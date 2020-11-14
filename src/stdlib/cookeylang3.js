const { ClassCallable } = require("../classes");
const { NativeCallable } = require("../functions");
const Environment = require("../environment");

let nativeclss = new ClassCallable("std", {
  "construct": new NativeCallable(0, [], new Environment(), () => {}, true),

  // String features
  "getCharCode": new NativeCallable(1, ["char"], new Environment(), args => {
    const code = args[0].charCodeAt(0);
    return code == NaN ? false : code;
  }, false),
  "getCharAt": new NativeCallable(2, ["str", "index"], new Environment(), args => {
    const code = args[0].charAt(args[1]);
    return code == NaN ? false : code;
  }, false),
  "sliceString": new NativeCallable(3, ["str", "s", "e"], new Environment(), args => {
    return args[0].slice(args[1], args[2]);;
  }, false),
  "reverseString": new NativeCallable(1, ["str"], new Environment(), args => {
    return args[0].split("").reverse().join("");
  }, false),
}, null, null);

let lib = nativeclss.call([]);

// NaV
lib.setVal({ value: "Unknown" }, new ClassCallable("Unknown", {
  "construct": new NativeCallable(0, [], new Environment(), (_, environment) => {
    environment.getVal(0, "this").fields.value = null;
  }, true),

  "set": new NativeCallable(1, ["v"], new Environment(), (args, environment) => {
    environment.getVal(0, "this").fields.value = args[0];
  }, false),

  "get": new NativeCallable(1, ["cb"], new Environment(), (args, environment) => {
    if (environment.getVal(0, "this").fields.value != null) args[0].call([environment.getVal(0, "this").fields.value])
  }, false),
}, null, null));

// Vector
lib.setVal({ value: "Vector" }, new ClassCallable("Vector", {
  "construct": new NativeCallable(0, [], new Environment(), (_, environment) => {
    environment.getVal(0, "this").fields.length = 0;
    environment.getVal(0, "this").fields._vector = [];
  }, true),

  "push": new NativeCallable(2, ["i", "v"], new Environment(), (args, environment) => {
    let arr = environment.getVal(0, "this").fields._vector;
    if (args[0] > arr.length) arr.push(args[1]);
    else arr[args[0]] = args[1];
    environment.getVal(0, "this").fields.length = arr.length;
  }, false),

  "get": new NativeCallable(1, ["i"], new Environment(), (args, environment) => {
    let arr = environment.getVal(0, "this").fields._vector;
    let length = environment.getVal(0, "this").fields.length;

    return args[0] > length ? null : arr[args[0]];
  }, false),
}, null, null));

module.exports = { lib, name: "std" };