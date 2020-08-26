const { ClassCallable } = require("../classes");
const { NativeCallable } = require("../functions");
const Environment = require("../environment");

let nativeclss = new ClassCallable("Math", {
  "construct": new NativeCallable(0, [], new Environment(), () => {}, true),
  
  "sin": new NativeCallable(1, ["ang"], new Environment(), args => {
    return Math.sin(args[0]);
  }, false),

  "cos": new NativeCallable(1, ["ang"], new Environment(), args => {
    return Math.cos(args[0]);
  }, false),

  "tan": new NativeCallable(1, ["ang"], new Environment(), args => {
    return Math.tan(args[0]);
  }, false),

  "asin": new NativeCallable(1, ["ang"], new Environment(), args => {
    return Math.asin(args[0]);
  }, false),

  "acos": new NativeCallable(1, ["ang"], new Environment(), args => {
    return Math.acos(args[0]);
  }, false),

  "atan": new NativeCallable(1, ["ang"], new Environment(), args => {
    return Math.atan(args[0]);
  }, false),

  "atan2": new NativeCallable(1, ["ang"], new Environment(), args => {
    return Math.atan2(args[0]);
  }, false),

  "abs": new NativeCallable(1, ["num"], new Environment(), args => {
    return Math.abs(args[0]);
  }, false),

  "pow": new NativeCallable(2, ["num", "exp"], new Environment(), args => {
    return Math.pow(args[0], args[1]);
  }, false),

  "sqrt": new NativeCallable(1, ["num"], new Environment(), args => {
    return Math.sqrt(args[0]);
  }, false),

  "sqrtn": new NativeCallable(2, ["p", "r"], new Environment(), args => {
    if (args[0] == 0) return null;
    return Math.pow(args[1], 1 / args[0]);
  }, false),

  "round": new NativeCallable(1, ["num"], new Environment(), args => {
    return Math.round(args[0]);
  }, false),

  "floor": new NativeCallable(1, ["num"], new Environment(), args => {
    return Math.floor(args[0]);
  }, false),

  "ceil": new NativeCallable(1, ["num"], new Environment(), args => {
    return Math.ceil(args[0]);
  }, false),
}, null, null);

let lib = nativeclss.call([]);
lib.setVal({ value: "PI" }, Math.PI);
lib.setVal({ value: "E" }, Math.E);
lib.setVal({ value: "infinity" }, Infinity);


module.exports = { lib, name: "Math" };