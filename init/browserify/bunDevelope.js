const fs = require("fs");
const browserify = require('browserify');
const babelify = require("babelify");

let dir = './public/react';

let rootSign = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
    ],
  plugins: [
    "transform-object-rest-spread"
  ]})
).require("./app/Sign/root.js", {entry: true})/*.plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/
let rootWithin = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
    ],
  plugins: [
    "transform-object-rest-spread"
  ]})
).require("./app/Within/root.js", {entry: true}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });
let rootSelfFront = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
    ],
  plugins: [
  	"transform-object-rest-spread"
  ]})
).require("./app/Self/root_Front.js", {entry: true}).plugin(require('css-modulesify'), {
    rootDir: __dirname
  });
let rootTerrace = browserify({debug: true}).transform(babelify.configure({
  presets: [
      "react",
      "env"
    ],
  plugins: [
  	"transform-object-rest-spread"
  ]})
).require("./app/Terrace/root_Terrace.js", {entry: true})/*.plugin(require('css-modulesify'), {
    rootDir: __dirname
  });*/

let appSign = rootSign.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appWithin = rootWithin.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appSelfFront = rootSelfFront.bundle().on("error", function (err) { console.log("Error: " + err.message); });
let appTerrace = rootTerrace.bundle().on("error", function (err) { console.log("Error: " + err.message); });
rootWithin.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesWithin.css')); //rewrite the file with the new "abstract name"
});
rootSelfFront.on('css stream', function (css) {
    css.pipe(fs.createWriteStream('./public/css/stylesSelfFront.css')); //rewrite the file with the new "abstract name"
});

exports.bundler = ()=>{
  if(!fs.existsSync(dir)) fs.mkdirSync(dir);
  appSign.pipe(fs.createWriteStream('./public/react/appSign.js'));
  appWithin.pipe(fs.createWriteStream('./public/react/appWithin.js'));
  appSelfFront.pipe(fs.createWriteStream('./public/react/appSelfFront.js'));
  appTerrace.pipe(fs.createWriteStream('./public/react/appTerrace.js'));
}
