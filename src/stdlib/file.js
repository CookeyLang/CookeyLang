const { ClassCallable } = require("../classes");
const { NativeCallable } = require("../functions");
const Environment = require("../environment");

const fs = require("fs");

let nativeclss = new ClassCallable("File", {
  "construct": new NativeCallable(0, [], new Environment(), () => {}, true),
  
  "writeFile": new NativeCallable(2, ["file", "value"], new Environment(), args => {
    fs.writeFileSync(args[0], args[1])
  }, false),

  "appendFile": new NativeCallable(2, ["file", "value"], new Environment(), args => {
    fs.appendFileSync(args[0], args[1])
  }, false),

  "readFile": new NativeCallable(1, ["file"], new Environment(), args => {
    if(!fs.existsSync(args[0])) return false;
    return fs.readFileSync(args[0]);
  }, false),

  "unlink": new NativeCallable(1, ["file"], new Environment(), args => {
    if(!fs.existsSync(args[0])) return false;
    fs.unlinkSync(args[0]);
    return true;
  }, false),

  "delete": new NativeCallable(1, ["file"], new Environment(), args => {
    if(!fs.existsSync(args[0])) return false;
    fs.unlinkSync(args[0]);
    return true
  }, false),

  "deleteFolder": new NativeCallable(1, ["name"], new Environment(), args => {
    if(!fs.existsSync(args[0])) return false;
    fs.rmdirSync(args[0]);
    return true;
  }, false),

  "createFolder": new NativeCallable(1, ["name"], new Environment(), args => {
    if(fs.existsSync(args[0])) return false;
    fs.mkdirSync(args[0]);
    return true;
  }, false),

  "exists": new NativeCallable(1, ["file"], new Environment(), args => fs.existsSync(args[0]), false),
}, null, null);

let lib = nativeclss.call([]);
lib.setVal({ value: "dirname" }, __dirname);
lib.setVal({ value: "filename" }, __filename);


module.exports = { lib, name: "File" };