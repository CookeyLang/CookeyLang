// I'm going to have to use prototypes here.
// This is because of inheritance, I can't think of any other way to do it
const error = require("./error")

class Environment {
  // The previous is what it inherits from, for example:
  /*
  {
    var g = 5; <----- previous
    {
      var g2 = 10; <- new Environment
    }
  }
  */
  // It can be recursive.
  constructor(previous=null) {
    this.previous = previous;
    this.values = {};
    /*
    "variableName": {
      type: "var" | "final",
      value: null | String | ...
    }
    */
  }

  getVal(line, name) {
    if (this.values[name] !== undefined) return this.values[name].value;

    // No need for .value here because of the preceding line
    if (this.previous != null) return this.previous.getVal(line, name);

    error(line, name + " is not defined.")
  }

  getMut(name) {
    if (this.values[name] !== undefined) return this.values[name].mut;
    if (this.previous != null) return this.previous.getMut(name);
    return "var";
  }

  define(line, name, value, mut) {
    if (this.getMut(name) == "final") error(line, `Constant ${name} is already defined.`)
    this.values[name] = { value, mut };
  }

  assign(line, name, value) {
    if (this.getMut(name) == "final") {
      error(line, "Assignment to constant " + name);
      return;
    }

    if (this.values[name] !== undefined) {
      this.values[name].value = value;
      return;
    }

    if (this.previous != null) {
      this.previous.assign(line, name, value);
      return;
    }

    error(line, name + " is not defined.")
  }
}

module.exports = Environment;