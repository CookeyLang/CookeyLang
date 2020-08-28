const Environment = require("./environment");
const error = require("./error")

class FuncCallable {
  constructor(arity, call, toString) {
    this.arity = arity;
    this.call = call;
    this.toString = toString;
  }
}

class Return extends Error {
  constructor(message) {
    super()
    this.name = "return";
    this.message = message;
  }
}

class Break extends Error {
  constructor() {
    super()
    this.name = "break";
  }
}

class LambdaFunc extends FuncCallable {
  constructor(decl, closure, interpretStmt) {
    super(decl.params.length, args => {
      let environment = new Environment(closure);
      
      for (let i = 0; i < decl.params.length; i++) {
        environment.define(decl.params[i].line, decl.params[i].value, args[i], "final");
      }

      return interpretStmt(decl.retVal, environment);
    }, () => `<lambda function>`);
  }
}

class UserCallable extends FuncCallable {
  constructor(decl, closure, interpretBlock, isConstruct=false) {
    super(decl.params.length, args => {
      let environment = new Environment(closure);
      
      for (let i = 0; i < decl.params.length; i++) {
        environment.define(decl.params[i].line, decl.params[i].value, args[i], "var");
      }

      try {
        interpretBlock(decl.body, environment);
        if (isConstruct) return environment.getVal(0, "this")
      } catch (e) {
        if (e.name != "return") {
          error(decl.line, "Too much recursion.")
        }

        return e.message;
      }
    }, () => `<function ${decl.name.value}>`);
    this.closure = closure;
    this.decl = decl;
    this.isConstruct = isConstruct;
  }

  // Create `this` variable
  bind(instance) {
    let environment = new Environment(this.closure);
    environment.define(0, "this", instance, "var");
    return new UserCallable(this.decl, environment, instance.classCall.interpretBlock, this.isConstruct);
  }
}

class NativeCallable extends FuncCallable {
  constructor(arity, params, closure, call, isConstruct=false) {
    super(arity, args => {
      let environment = new Environment(closure);
      
      for (let i = 0; i < params.length; i++) {
        environment.define(0, params[i], args[i], "final");
      }

      environment.define(0, "this", this.instance, "final")

      let data = call(args, environment);
      if (isConstruct) return environment.getVal(0, "this")
      else return data;
    }, () => `<function ${decl.name.value}>`);
    this.closure = closure;
    this.arity = arity;
    this.params = params;
    this.isConstruct = isConstruct;
  }

  // Create `this` variable
  bind(instance) {
    let environment = new Environment(this.closure);
    this.instance = instance;
    environment.define(0, "this", instance, "var");

    return new NativeCallable(this.arity, this.params, environment, this.call, this.isConstruct);
  }
}

module.exports = { FuncCallable, LambdaFunc, UserCallable, NativeCallable, Return, Break };