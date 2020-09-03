const { ClassCallable } = require("../classes");
const { NativeCallable, FuncCallable } = require("../functions");
const Environment = require("../environment");
const { execSync } = require()

let nativeclss = new ClassCallable("Subprocess", {
  "construct": new NativeCallable(0, [], new Environment(), (_, environment) => {}, true),
  "run": new NativeCallable(1, ["cmd"], new Environment(), (_, environment) args => {
    return execSync(args[0]).toString();
  }, false),
}, null, null);

let lib = nativeclss;


module.exports = { lib, name: "Subprocess" };
