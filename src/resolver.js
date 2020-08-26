// This semantic analysis will allow us to error on:
/*
return "hi";
*/
const error = require("./error")

function resolver(trees) {
  let current = {
    func: false,
    loop: false,
    construct: false,
    clss: false,
    superClass: false
  };

  function resolveBlock(statements) {
    // Check each statement
    for (const expr of statements) {
      switch (expr.type) {
        case "return":
          if (current.construct) error(expr.line, "Constructors cannot have return values.")
          if (!current.func && !current.clss) error(expr.line, "Return statements can only be in functions and methods.");
          break;
        
        case "block":
          resolveBlock(expr.block);
          break;

        default:
          resolve(expr);
          break;
        
      }
    }
  }

  function resolve(expr) {
    switch (expr.type) {
      case "expr":
        resolve(expr.expr);
        break;

      case "funcdef":
        current.func = true;
        resolveBlock(expr.body);
        current.func = false;
        break;
      
      case "class":
        if (expr.superclass != null && expr.name.value == expr.superclass.name) {
          error(expr.line, "A class cannot inherit from itself.");
        }

        for (const method of expr.methods) {
          current.clss = true;
          if (method.name.value == "construct") current.construct = true;

          resolveBlock(method.body)
          current.construct = false;
        }

        current.clss = false;
        break;
      
      case "typechange":
        if (expr.newtype.name != "STRING") error(expr.line, "Conversion type has to be a string.")
        switch (expr.newtype.value) {
          case "string":
          case "boolean":
          case "number":
          case "NaV":
            break;
          
          default:
            error(expr.line, "Invalid type conversion.");
        }
        break;
      
      case "whileloop":
        current.loop = true;
        resolve(expr.body);
        current.loop = false;
        break;
      
      case "forrep":
        current.loop = true;

        if (expr.params.length != 1 && expr.params.length != 3 && expr.params.length != 4) {
          error(expr.line, "Invalid forrep arguments, expected 1, 3, or 4 but got " + expr.params.length + ".");
        }

        switch (expr.params.length) {
          case 3:
            if (expr.params[0].type != "variable") error(expr.line, "First argument of 3-parameter forrep loop must be a variable.");
            break;
          case 4:
            if (expr.params[0].type != "variable") error(expr.line, "First argument of 4-parameter forrep loop must be a variable.");
            break;
        }

        resolve(expr.body)
        current.loop = false;
        break;
      
      case "block":
        resolveBlock(expr.block);
        break;
      
      case "superclass":
        if (!current.clss) error(expr.line, "'superClass' can only be inside methods.");
        break;
      
      case "call":
        for (const arg of expr.args) {
          resolve(arg);
        }
        break;
      
      case "return":
        if (!current.func) error(expr.line, "Return statements can only be in functions and methods.");
        break;

      case "breakloop":
        if (!current.loop) error(expr.line, "Break statements can only be inside loops.");
        break;
      
      case "switchstatement":
        for (const check of expr.checks) {
          if (check.type == "case") {
            for (const expr of check.expr) resolve(expr)
          }
          resolve(check.body)
        }
        break;
    }
  }

  
  for (const tree of trees) {
    resolve(tree);
  }
}

module.exports = resolver;