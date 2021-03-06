const express = require('express');
const main = express.Router();

const srcExecutive = require('./src.js');
const plainExecutive = require('./plain/plain.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id/src', srcExecutive)
main.use('/:id', plainExecutive)

module.exports = main;
