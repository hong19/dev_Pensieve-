const fs = require('fs');
const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const deliverVerifiedMail = require('./verifiedMail');
const validateRegisterInput = require('../validation/register');
const {
  verify_email
} = require('../../../config/jwt.js');
const {
  userImg_SecondtoSrc
} = require('../../../config/path.js');
const {
  _select_Basic
} = require('../../utils/dbSelectHandler.js');
const {
  _insert_basic
} = require('../../utils/dbInsertHandler.js');
const {
  _handler_ErrorRes,
} = require('../../utils/reserrHandler.js');
const _DB_lastvisitShared = require('../../../db/models/index').lastvisit_shared;
const _DB_lastvisitNotify = require('../../../db/models/index').lastvisit_notify;
const _DB_lastvisitIndex = require('../../../db/models/index').lastvisit_index;

const _create_new_ImgFolder = (userId)=>{
  return new Promise((resolve,reject)=>{
    let imgFolderPath = path.join(__dirname, userImg_SecondtoSrc+userId);
    fs.mkdir(imgFolderPath, function(err){
      if(err) {reject({err: err});return;}
      resolve();
    })
  });
};

const _promise_customBreak_res = (errSet)=>{
  let errObj = {
    errSet: errSet,
    custom: true
  };
  return errObj;
}

//handle register request
function _handle_auth_register_POST(req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);

  if(!isValid) {
    let errSet = {
      "status": 400,
      "message": errors,
      "console": ''
    };
    return _handler_ErrorRes(errSet, res);
  }

  let mysqlForm = {
    accordancesList: [[req.body.email]]
  },
  conditionUser = {
    table: "verifications",
    cols: ["email"],
    where: ["email"]
  };
  _select_Basic(conditionUser, mysqlForm.accordancesList).then((rows)=>{
    //distinguish iis the user already exist or not.
    if(rows.length>0) {
      let errSet = {
        "status": 400,
        "message": {'email': 'email already exist!'},
        "console": ''
      };
      throw _promise_customBreak_res(errSet);
    }else{
      const newUser = {
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        gender: req.body.gender,
        birthYear: req.body.birthYear,
        birthMonth: req.body.birthMonth,
        birthDate: req.body.birthDate
      };
      return newUser;
    }
  }).then((newUser)=>{
    //after confimation, create new user account officially.
    //first create user in users and get the user Id
    return _insert_basic({
      table: 'users',
      col: '(first_name, last_name, account, status, email)'},
      [[
        newUser.first_name,
        newUser.last_name,
        newUser.first_name+" "+newUser.last_name,
        'unverified',
        newUser.email
      ]]
    ).then((resultObj)=>{
      const userId = resultObj.insertId;
      return new Promise((resolve, reject)=>{
        //sign a token for email verification
        const payload = {
          user_Id: userId,
          token_property: 'emailVerified'
        };
        jwt.sign(JSON.parse(JSON.stringify(payload)), verify_email, {
          expiresIn: '1d'
        }, (err, token) => {
            if(err){
              reject({status: 500, err: 'There is some error in token ' + err});
            }
            else {
              resolve(token);
            }
        });
      }).then((tokenEmail)=>{
        //genSalt and hash user's password
        //use a new promise again is because, we don't want to append a new catch here
        return new Promise((resolve, reject)=>{
          bcrypt.genSalt(10, (err, salt) => {
            if(err) reject({status: 500, err: 'There was an error'+err});
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) reject({status: 500, err: 'There was an error'+err});
              resolve(hash);
            })
          });
        }).then((hash)=>{
          let pinsertNewVerifi = Promise.resolve(_insert_basic({table: 'verifications', col: '(id_user, email, password)'}, [[userId, newUser.email, hash]]).catch((errObj)=>{throw errObj})),
              pinsertNewSheet = Promise.resolve(_insert_basic({table: 'sheets', col: '(id_user, gender, birthYear, birthMonth, birthDate)'}, [[userId, newUser.gender, newUser.birthYear, newUser.birthMonth, newUser.birthDate]]).catch((errObj)=>{throw errObj})),
              pinsertEmailToken = Promise.resolve(_insert_basic({table: 'users_apply', col: '(id_user, token_email, status)'}, [[userId, tokenEmail, 'unverified']]).catch((errObj)=>{throw errObj})),
              pcreateImgFolder = Promise.resolve(_create_new_ImgFolder(userId).catch((errObj)=>{throw errObj})),
              pinsertLastvisitShared = _DB_lastvisitShared.create({id_user: userId}).catch((err)=>{throw err}),
              pinsertLastvisitNotify = _DB_lastvisitNotify.create({id_user: userId}).catch((err)=>{throw err}),
              pinsertLastvisitIndex = _DB_lastvisitIndex.create({id_user: userId}).catch((err)=>{throw err});

          return Promise.all([
            pinsertNewVerifi,
            pinsertNewSheet,
            pinsertEmailToken,
            pcreateImgFolder,
            pinsertLastvisitIndex,
            pinsertLastvisitShared,
            pinsertLastvisitNotify])
            .then((results)=>{
              return deliverVerifiedMail(newUser, tokenEmail);
            });
        });
      })
    });
  }).then(()=>{
    //complete the process, and response to client
    console.log("POST: auth/register req: complete.")
    let resData = {};
    resData.error = 0;
    resData['message'] = {'warning': 'Registered successfully! Please verify your email address'};
    res.status(201).json(resData);
  }).catch((errObj)=>{
    //catch errors, both custom and internal
    if(errObj.custom) _handler_ErrorRes(errObj.errSet, res);
    else{
      console.log("Error: during auth/register promise: "+errObj.err)
      let errSet = {
        "status": errObj.status?errObj.status:500,
        "message": {'warning': 'Internal Server Error, please try again later'},
        "console": 'Error Occured: Internal Server Error'
      };
      _handler_ErrorRes(errSet, res);
    }
  });
};

module.exports = _handle_auth_register_POST;
