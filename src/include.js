const error = require('./error');
const fs = require('fs');
const COOKEYPATH = process.env.COOKEYPATH;
// const lexer = require("./lexer");
// const parser = require("./parser");


function include(libname, globals, interpretBlock, interpreter) {
  var libs = fs.readdirSync(__dirname + "/stdlib");
  if (libs.includes(libname + ".js")) {
    const { lib, name } = require('./stdlib/' + libname);
    globals.define(0, name, lib, "final");
    
  }/*  else if (start.includes(libname + '.clf')) {
    const lib = fs.readFileSync(treestart + '/' + libname + '.clf');

  } else {
    // do path traversal here
  } */
  return globals;
}

module.exports = include;