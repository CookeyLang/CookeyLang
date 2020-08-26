const error = require('./error');
const fs = require('fs');


function include(libname, globals, interpretBlock, interpreter) {
  var libs = fs.readdirSync(__dirname + "/stdlib");
  if (libs.includes(libname + ".js")) {
    const { lib, name } = require('./stdlib/' + libname);
    globals.define(0, name, lib, "final");
    
  }
  return globals;
}

module.exports = include;