const { ClassCallable } = require("../classes");
const { NativeCallable } = require("../functions");
const Environment = require("../environment");

const http = require("http");

let nativeclss = new ClassCallable("Http", {
  "construct": new NativeCallable(1, ["server"], new Environment(), (args, environment) => {
    environment.getVal(0, "this").fields._httpserver = http.createServer((req, res) => {
      const fn = new NativeCallable(1, ["data"], new Environment(), args => {
        res.end(args[0]);
      });

      args[0].call([req.method, req.url, fn]);
    });
  }, true),

  "listen": new NativeCallable(1, ["port"], new Environment(), (args, environment) => {
    environment.getVal(0, "this").fields._httpserver.listen(args[0]);
  }, true)
}, null, null);

module.exports = { lib: nativeclss, name: "Http" };