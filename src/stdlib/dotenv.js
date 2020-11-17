const { ClassCallable } = require("../classes");
const { NativeCallable } = require("../functions");
const Environment = require("../environment");

let nativeclss = new ClassCallable("Dotenv", {
  "construct": new NativeCallable(0, [], new Environment(), () => {}, true),
  
  "get": new NativeCallable(1, ["item"], new Environment(), args => {
    return process.env[args[0]] || false;
  }, false),
}, null, null);

let lib = nativeclss.call([]);

Object.keys(process.env).forEach(item => {
  lib.setVal({ value: item }, process.env[item]);
})

module.exports = { lib, name: "Dotenv" };
