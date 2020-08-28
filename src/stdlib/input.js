const { ClassCallable } = require("../classes");
const { NativeCallable, FuncCallable } = require("../functions");
const Environment = require("../environment");
const readline = require("readline");

// const error = require("../error");

let nativeclss = new ClassCallable("Input", {
  "construct": new NativeCallable(0, [], new Environment(), (_, environment) => {
    environment.getVal(0, "this").fields.nativerl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }, false),
  "prompt": new NativeCallable(0, ["text", "function"], new Environment(), (args, environment) => {
    environment.getVal(0, "this").fields.nativerl.question(args[0], ans => {
      if (args[1] instanceof FuncCallable) {
        args[1].call(ans)
      }
    })
  }, false),
}, null, null);

let lib = nativeclss;


module.exports = { lib, name: "Input" };