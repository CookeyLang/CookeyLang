const { ClassCallable } = require("../classes");
const { NativeCallable } = require("../functions");
const Environment = require("../environment");

const { execSync, exec } = require("child_process");

let nativeclss = new ClassCallable("Procmanager", {
  "construct": new NativeCallable(0, [], new Environment(), () => {}, true),
  
  "exec": new NativeCallable(1, ["cmd"], new Environment(), args => {
    return execSync(args[0]);
  }, false),
}, null, null);

let lib = nativeclss.call([]);

module.exports = { lib, name: "Procmanager" };
