const fs = require('fs');
const path = require("path");
const {
  userImg_FirsttoSrc
} = require('../../config/path.js');

function _handle_img_requisition(req, res){
  const folder = req.params.user;
  const file = req.params.ofWhich;
  switch(req.query.type){
    case 'thumb':
      res.sendFile(path.join(__dirname, userImg_FirsttoSrc+folder+'/'+file), {headers: {'Content-Type': 'image'}}, function (err) {
        if (err) {console.log('error occured: img sending fail:'+err)}
      });
      break;
    case  'unitSingle':
      fs.readFile(path.join(__dirname, userImg_FirsttoSrc+folder+'/'+file), function(err, imgBuffer){
        if(err) {console.log('err in Read_imgFile:'+err);res.status(500);return;};
        let imgBase64 = new Buffer(imgBuffer, 'binary').toString('base64');
        imgBase64 = 'data:image/jpeg;base64,' + imgBase64;
        res.status(200).send(imgBase64);
      });
      break;
    default:
      res.sendFile(path.join(__dirname, '/../..', '/faked_Pics/'+folder+'/'+file), {headers: {'Content-Type': 'image'}}, function (err) {
        if (err) {console.log('error occured: img sending fail:'+err)}
      });
  }
}

module.exports = _handle_img_requisition;
