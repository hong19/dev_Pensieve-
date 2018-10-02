const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');

const database = mysql.createPool(connection_key);


function _handler_err_BadReq(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = 'Error Occured: bad database query';
  res.status(400).json(resData);
 }

function _handler_err_Unauthorized(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = "Token is invalid";
  res.status(401).json(resData);
}

function _handler_err_Internal(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = 'Error Occured: Internal Server Error';
  res.status(500).json(resData);
}

function _handle_NewShare(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection in newShare handle.")
        }else{
          new Promise((resolve, reject)=>{
            //temp method, waiting for a real Pics server
            let imgFolderPath = path.join(__dirname, '/../../..', '/dev/faked_Pics/'+userId);
            fs.access(imgFolderPath, (err)=>{
              if(err){
                //which mean the folder doesn't exist
                fs.mkdir(imgFolderPath, function(err){
                  if(err) {_handler_err_Internal(err, res);reject(err);}
                  resolve();
                })
              }
              //or without err
              resolve();
            })
          }).then(function() {
            return new Promise((resolve, reject)=>{
              //add it into shares as a obj value
              console.log('add new one: deal img.');
              let modifiedBody = new Object();
              //deal with cover img first.
              let coverBase64Splice = req.body.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
              let coverBase64Buffer = new Buffer(coverBase64Splice[2], 'base64');
              fs.writeFile(path.join(__dirname, '/../../..', '/dev/faked_Pics/'+userId+'/'+req.body.submitTime+"_layer_0.jpg"), coverBase64Buffer, function(err){
                if(err) {_handler_err_Internal(err, res);reject(err);}
              });
              modifiedBody['url_pic_layer0'] = userId+'/'+req.body.submitTime+'_layer_0.jpg';
              //then deal with beneath img if any.
              if(req.body.beneathBase64){
                let beneathBase64Splice = req.body.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
                let beneathBase64Buffer = new Buffer(beneathBase64Splice[2], 'base64');
                modifiedBody['url_pic_layer1'] = userId+'/'+req.body.submitTime+'_layer_1.jpg';
                fs.writeFile(path.join(__dirname, '/../../..', '/dev/faked_Pics/'+userId+'/'+req.body.submitTime+"_layer_1.jpg"), beneathBase64Buffer, function(err){
                  if(err) {_handler_err_Internal(err, res);reject(err);}
                });
              }

              Object.assign(modifiedBody, req.body);
              delete modifiedBody.coverBase64;
              delete modifiedBody.beneathBase64;

              resolve(modifiedBody)
            })
          }).then(function(modifiedBody){
            console.log('add new one, write into the table: units.');
            return new Promise((resolve, reject)=>{
              let unitProfile = {
                'id_author': userId,
                'url_pic_layer0': modifiedBody.url_pic_layer0,
                'url_pic_layer1': modifiedBody.url_pic_layer1
              }
              connection.query('INSERT INTO units SET ?', unitProfile, function(err, result, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                modifiedBody['id_unit'] = result.insertId;
                resolve(modifiedBody)
              })
            })
          }).then(function(modifiedBody){
            console.log('add new one, write into the table: marks.');
            return new Promise((resolve, reject)=>{
              let valuesArr = modifiedBody.joinedMarks.map(function(markObj, index){
                return [
                  modifiedBody.id_unit,
                  userId,
                  markObj.layer,
                  markObj.top,
                  markObj.left,
                  markObj.serial,
                  markObj.editorContent
                ]
              })
              connection.query('INSERT INTO marks (id_unit, id_author, layer,portion_top,portion_left,serial,editor_content) VALUES ?; SHOW WARNINGS;', [valuesArr], function(err, result, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                resolve(modifiedBody)
              })
            })
          }).then(function(modifiedBody){
            console.log('add new one, write into the table: nouns.');
            return new Promise((resolve, reject)=>{
              let valuesArr = modifiedBody.nounsArr.map(function(noun, index){
                return [
                  noun,
                  modifiedBody.id_unit,
                  userId
                ]
              })
              connection.query('INSERT INTO nouns (name_noun, id_unit, id_user) VALUES ?', [valuesArr], function(err, rows, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                resolve(modifiedBody)
              })
            })
          }).then(()=>{
            let resData = {};
            resData['error'] = 0;
            resData['message'] = 'post req completed!';
            res.status(201).json(resData);
            connection.release();
          }).catch((err)=>{
            console.log("error occured during newShare promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
}

module.exports = _handle_NewShare