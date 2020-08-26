const { FuncCallable } = require("./functions");
const error = require("./error");

class ClassCallable extends FuncCallable {
  constructor(name, methods, superclass, interpretBlock) {
    super(0, () => {}, () => `<class ${name}>`);
    this.name = name;
    this.methods = methods;
    this.superclass = superclass;
    this.interpretBlock = interpretBlock;

    let initializer = this.findMethod("construct");
    if (initializer == null) this.arity = 0;
    else this.arity = initializer.arity;

    let self = this;
    this.call = args => {
      // interpret
      let instance = new ClassInstance(self);
      let initializer = this.findMethod("construct");
      if (initializer != null) {
        initializer.bind(instance).call(args);
      }

      return instance;
    }
  }

  findMethod(name) {
    if (this.methods[name]) {
      return this.methods[name];
    }

    if (this.superclass != null) {
      return this.superclass.findMethod(name);
    }

    return null;
  }

  toString() {
    return `<class ${this.name}>`;
  }
}

class ClassInstance {
  constructor(classCall) {
    this.classCall = classCall;
    this.fields = {};
  }

  getVal(line, name) {
    if (this.fields[name]) {
      return this.fields[name];
    }

    let method = this.classCall.findMethod(name);
    if (method != null) return method.bind(this);

    error(line, "Undefined property '" + name + "'.")
  }

  setVal(name, value) {
    this.fields[name.value] = value;
  }

  toString() {
    return `<instance ${this.classCall.name}>`;
  }
}

/*
class NativeClass extends FuncCallable {
  constructor(name, methods) {
    super(0, () => {}, () => `<native class ${name}>`);
    this.name = name;
    this.methods = methods;

    let initializer = this.findMethod("construct");
    if (initializer == null) this.arity = 0;
    this.arity = initializer.arity;

    let self = this;
    this.call = args => {
      // interpret
      let instance = new NativeInstance(self);
      let initializer = this.findMethod("construct");
      initializer.bind(instance).call(args);

      return instance;
    }
  }

  findMethod(name) {
    if (this.methods[name]) {
      return this.methods[name];
    }

    if (this.superclass != null) {
      return this.superclass.findMethod(name);
    }

    return null;
  }

  toString() {
    return `<native class ${this.name}>`;
  }
}

class NativeInstance extends ClassInstance {
  constructor(classCall) {
    super(classCall);
  }

  getVal(line, name) {
    if (this.fields[name]) {
      return this.fields[name];
    }

    let method = this.classCall.findMethod(name);
    if (method != null) return method.bind(this);

    error(line, "Undefined property '" + name + "'.")
  }

  setVal(name, value) {
    this.fields[name] = value;
  }

  toString() {
    return `<native instance ${this.classCall.name}>`;
  }
}
*/

module.exports = { ClassCallable, ClassInstance };