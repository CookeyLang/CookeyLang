const error = require("./error");

/**
 * @interface tokens {
 *  name: string
 * }
 */
function parser(tokens) {
  let index = 0;

  // Helpers
  function peek() { return tokens[index] || {}; }
  function consume(name, expect) {
    if (tokens[index].name != name) error(tokens[index].line, expect);
    
    index++;
    return tokens[index];
  }

  function match(...types) {
    for (const type of types) {
      if (check(type)) {
        index++;
        return true;
      }
    }

    return false;
  }

  function check(type) {
    if (isAtEnd()) return false;
    return peek().name == type;
  }

  function isAtEnd() {
    return peek().name == "EOF";
  }

  function peek() {
    return tokens[index];
  }

  function previous() {
    return tokens[index - 1];
  }



  // Parsing
  function declaration() {
    // We will use the same for class methods as well, so that's what kind is.
    if (match("CLASS")) return classDeclaration();
    if (match("FUNCTION")) return funcDeclaration("function");
    if (match("VAR", "FINAL")) return varDeclaration();

    return statement();
  }

  function classDeclaration() {
    let name = peek();
    consume("IDENTIFIER", "Expect class name.");

    let superclass = null;
    if (match("EXTENDS")) {
      consume("IDENTIFIER", "Expect superclass name.");
      superclass = { type: "variable", line: previous().line, name: previous().value };
    }

    consume("LEFT_BRACE", "Expect '{' before class body.");

    let methods = []
    while (!check("RIGHT_BRACE") && !isAtEnd()) {
      methods.push(funcDeclaration("method"));
    }

    consume("RIGHT_BRACE", "Expect '}' after class body.");

    return { type: "class", line: name.line, name, superclass, methods };
  }

  function funcDeclaration(kind) {
    let name = peek();
    consume("IDENTIFIER", "Expect " + kind + " name.")
    let line = name.line;

    consume("LEFT_PAREN", "Expect '(' after " + kind + " name.");

    let params = [];
    if (!check("RIGHT_PAREN")) {
      do {
        params.push(peek());
        consume("IDENTIFIER", "Expect parameter name.")
      } while (match("COMMA"));
    }
    consume("RIGHT_PAREN", "Expect ')' after parameters.");

    consume("LEFT_BRACE", "Expect '{' before " + kind + " body.");
    let body = block();
    
    return { type: "funcdef", line, name, params, body }
  }

  function varDeclaration() {
    let type = previous().value;
    let line = previous().line;
    consume("IDENTIFIER", "Expected an identifier.");
    let name = previous().value;

    if (peek().name != "EQ" && type.name == "FINAL") error(peek().line, "Constants require a value.");

    let value = null;
    if (match("EQ")) {
      value = expression();
    }

    consume("SEMI", "Expect ';' after variable declaration.");
    return { type: "vardef", line, mut: type, name, value }
  }

  function statement() {
    if (match("IF")) return ifStatement();
    if (match("RET")) return returnStatement();
    if (match("WHILE")) return whileStatement();
    if (match("DO")) return doWhileStatement();
    if (match("FOR")) return forStatement();
    if (match("FORREP")) return forrepStatement();
    if (match("SWITCH")) return switchCaseStatement();
    if (match("BREAK")) return breakStatement();
    if (match("DELETEVARIABLE")) return deleteVariableStatement();
    if (match("EXIT")) return exitStatement();
    if (match("LEFT_BRACE")) return { type: "block", line: previous().line, block: block() };

    return expressionStatement();
  }

  function ifStatement() {
    consume("LEFT_PAREN", "Expect '(' after if statement.");
    let line = previous().line;
    let condition = expression();
    consume("RIGHT_PAREN", "Expect ')' after if statement.");

    let ifTrue = statement();
    let ifFalse = null;
    if (match("EL")) {
      ifFalse = statement();
    }

    return { type: "ifstatement", line, condition, ifTrue, ifFalse };
  }

  function returnStatement() {
    let keyword = previous();
    let line = peek().line;
    let value = null;
    if (!check("SEMI")) {
      value = expression();
    }

    consume("SEMI", "Expect ';' after return value.");
    return { type: "return", line, keyword, value };
  }

  function doWhileStatement() {
    let body = statement();

    consume("WHILE", "Expect 'while' condition.");
    consume("LEFT_PAREN", "Expect '(' after 'while'.");
    let condition = expression();
    consume("RIGHT_PAREN", "Expect ')' after condition.");
    consume("SEMI", "Expect ';' after condition.")

    return { type: "dowhile", line: condition.line, condition, body };
  }

  function whileStatement() {
    consume("LEFT_PAREN", "Expect '(' after 'while'.");
    let condition = expression();
    consume("RIGHT_PAREN", "Expect ')' after condition.");
    let body = statement();

    return { type: "whileloop", line: condition.line, condition, body };
  }

  function forStatement() {
    consume("LEFT_PAREN", "Expect '(' after 'for'.")
    let line = previous().line;

    let initializer;
    if (match("SEMI")) {
      initializer = null;
    } else if (match("VAR", "FINAL")) {
      initializer = varDeclaration();
    } else {
      initializer = expressionStatement();
    }

    let condition = null;
    if (!check("SEMI")) {
      condition = expression();
    }
    consume("SEMI", "Expect ',' after loop condition.");

    let increment = null;
    if (!check("RIGHT_PAREN")) {
      increment = expression();
    }
    consume("RIGHT_PAREN", "Expect ')' after for clauses.");


    let body = statement();

    if (increment != null) {
      body = { type: "block", line, block: [
        body,
        { type: "expr", line, expr: increment }
      ] };
    }

    if (condition == null) condition = { type: "literal", value: true, line };
    body = { type: "whileloop", line, condition, body };

    if (initializer != null) {
      body = { type: "block", line, block: [
        initializer, body
      ] };
    }

    return body;
  }

  function switchCaseStatement() {
    consume("LEFT_PAREN", "Expect '(' after switch")
    let condition = expression();
    consume("RIGHT_PAREN", "Expect ')' after condition")

    consume("LEFT_BRACE", "Expect '{' after switch value");

    let checks = []
    while (!check("RIGHT_BRACE") && !isAtEnd()) {
      checks.push(parameterExpressions());
    }

    consume("RIGHT_BRACE", "Expect '}' after switch body.");

    return { type: "switchstatement", line: condition.line, condition, checks };
  }

  function parameterExpressions() {
    let line = peek().line;

    if (match("CASE")) {
      consume("LEFT_PAREN", "Expect '(' after 'case'");
      let expr = [];
      
      if (!check("RIGHT_PAREN")) {
        do {
          expr.push(expression());
        } while (match("COMMA"));
      } else error(line, "Expected conditions in 'case' statement.");

      consume("RIGHT_PAREN", "Expect ')' after conditions.");
      
      let body = statement();
      return { type: "case", expr, body };
    }

    if (match("DEFAULT")) {
      let body = statement();
      return { type: "default", body };
    }

    error(line, "Expected 'case' or 'default', got " + peek().name);
  }

  function forrepStatement() {
    consume("LEFT_PAREN", "Expect '(' after 'forrep' loop.");
    let line = previous().line;
    let params = [];

    if (!check("RIGHT_PAREN")) {
      do {
        params.push(expression());
      } while (match("COMMA"));
    }

    consume("RIGHT_PAREN", "Expect ')' after arguments.");

    let body = statement();

    return { type: "forrep", params, line, body };
  }

  function breakStatement() {
    consume("SEMI", "Expect ';' after break statement.");
    return { type: "breakloop", line: previous().line }
  }

  function deleteVariableStatement() {
    let variable = peek();
    consume("IDENTIFIER", "Expect variable name.");
    consume("SEMI", "Expect ';' after variable.");
    return { type: "deletevariable", line: variable.line, variable };
  }

  function exitStatement() {
    let line = previous().line;
    let num = { type: "literal", line, value: 0 }

    if (!check("SEMI")) {
      num = expression();
    }

    consume("SEMI", "Expect ';' after exit statement.")

    return { line, type: "exit", num }
  }

  function block() {
    let statements = [];

    while (!check("RIGHT_BRACE") && !isAtEnd()) {
      statements.push(declaration());
    }

    consume("RIGHT_BRACE", "Expect '}' after block.");
    return statements;
  }

  function expressionStatement() {
    let line = peek().line;
    let expr = expression();
    
    consume("SEMI", "Expected ';' after expression.");
    return { line, type: "expr", expr }
  }

  function expression() {
    if (match("LAMBDA")) {
      consume("LEFT_PAREN", "Expect '(' after lambda statement.")

      let line = previous().line;
      let params = [];
      if (!check("RIGHT_PAREN")) {
        do {
          params.push(peek());
          consume("IDENTIFIER", "Expect parameter name.")
        } while (match("COMMA"));
      }
      consume("RIGHT_PAREN", "Expect ')' after lambda parameters.");
      consume("COL", "Expect ':' after right parentheses.");

      let retVal = expression();

      return { type: "lambda", line, params, retVal }
    }

    return ternary();
  }

  function ternary() {
    let expr = postfix();
    let line = expr.line;

    if (match("QUE")) {
      let ifTrue = postfix();

      consume("COL", "Expect ':' after ternary statement.");

      let ifFalse = ternary();

      expr = { type: "ternarystatement", line, condition: expr, ifTrue, ifFalse };
    }

    return expr;
  }

  function postfix() {
    let expr = assignment();
    let line = expr.line;

    if (match("PLUS_PLUS", "MINUS_MINUS")) {
      let operator = previous().name;

      expr = { type: "postfix", line, name: expr.name, operator };
    }

    return expr;
  }

  function assignment() {
    let expr = or();

    if (match("EQ", "PLUS_EQ", "MINUS_EQ", "DIVIDE_EQ", "TIMES_EQ", "POWER_EQ", "MODULO_EQ")) {
      let equals = previous();
      let value = assignment();

      if (expr.type == "variable") {
        let name = expr.name;
        return { line: equals.line, type: "assign", name, operator: equals.name, value };
      } else if (expr.type == "accessor") {
        let accessor = expr;
        return { type: "accessorset", line: equals.line, obj: accessor.obj, name: accessor.name, value };
      }

      error(equals.line, "Invalid assignment target."); 
    }

    return expr;
  }

  function or() {
    let expr = and();
    let line = expr.line;

    while (match("OR")) {
      let operator = previous();
      let right = and();

      expr = { type: "logical", line, left: expr, operator: operator.name, right }
    }

    return expr;
  }

  function and() {
    let expr = equality();
    let line = expr.line;

    while (match("AND")) {
      let operator = previous();
      let right = equality();
      expr = { type: "logical", line, left: expr, operator, right };
    }

    return expr;
  }

  function equality() {
    let expr = comparison();

    while (match("BANG_EQ", "EQ_EQ")) {
      let line = previous().line;
      let operator = previous().value;
      let right = comparison();
      expr = { line, type: "binary", left: expr, operator, right };
    }

    return expr;
  }

  function comparison() {
    let expr = addition();

    while (match("GREATER", "GREATER_EQ", "LESS", "LESS_EQ")) {
      let line = previous().line;
      let operator = previous().value;
      let right = addition();
      expr = { line, type: "binary", left: expr, operator, right };
    }

    return expr;
  }

  function addition() {
    let expr = multiplication();

    while (match("MINUS", "PLUS")) {
      let line = previous().line;
      let operator = previous().value;
      let right = multiplication();
      expr = { line, type: "binary", left: expr, operator, right };
    }

    return expr;
  }

  function multiplication() {
    let expr = power();

    while (match("DIVIDE", "TIMES", "MODULO")) {
      let line = previous().line;
      let operator = previous().value;
      let right = power();
      expr = { line, type: "binary", left: expr, operator, right };
    }

    return expr;
  }

  function power() {
    let expr = type_change();

    while (match("POWER")) {
      let line = previous().line;
      let operator = previous().value;
      let right = type_change();
      expr = { line, type: "binary", left: expr, operator, right };
    }

    return expr;
  }

  function type_change() {
    if (match("AT")) {
      let line = previous().line;
      let newtype = peek();
      consume("STRING", "Expected type name in string.");
      consume("COL", "Expected ':' after type name")

      let expr = type_change();
      return { type: "typechange", line, newtype, expr };
    }

    return unary();
  }

  function unary() {
    if (match("BANG", "MINUS")) {
      let line = previous().line;
      let operator = previous().value;
      let right = unary();
      return { line, type: "unary", operator, right };
    }

    return call();
  }

  function call() {
    let expr = primary();

    while (true) { 
      if (match("LEFT_PAREN")) {
        expr = finishCall(expr);
      } else if (match("DOT")) {
        let name = peek();
        consume("IDENTIFIER", "Expect property name after '.'.");
        expr = { type: "accessor", obj: expr, name, line: name.line }
      } else {
        break;
      }
    }

    return expr;
  }

  function finishCall(callee) {
    let args = [];
    if (!check("RIGHT_PAREN")) {
      do {
        args.push(expression());
      } while (match("COMMA"));
    }

    let paren = peek();
    consume("RIGHT_PAREN", "Expect ')' after arguments.");

    return { type: "call", line: paren.line, call: callee, args };
  }

  function primary() {
    if (match("FALSE")) return { type: "literal", value: false, line: previous().line };
    if (match("TRUE")) return { type: "literal", value: true, line: previous().line };
    if (match("NAV")) return { type: "literal", value: null, line: previous().line };

    if (match("NUMBER", "STRING")) {
      return { type: "literal", value: previous().value, line: previous().line };
    }

    if (match("THIS")) return { type: "this", line: previous().line };
    if (match("SUPERCLASS")) {
      let keyword = previous();
      consume("DOT", "Expect '.' after 'superClass'.");
      let method = peek();
      consume("IDENTIFIER", "Expect superclass method name.");
      return { type: "superclass", keyword, method, line: method.line };
    }

    if (match("IDENTIFIER")) {
      return { type: "variable", name: previous().value, line: previous().line };
    }

    if (match("LEFT_PAREN")) {
      let expr = expression();
      consume("RIGHT_PAREN", "Expected ')' after expression.");
      return { type: "grouping", expr, line: previous().line };
    }

    if (match("PIPE")) {
      let expr = expression();
      consume("PIPE", "Expected '|' after expression.");
      return { type: "absolute", expr, line: previous().line };
    }

    error(peek().line, "Unexpected token '" + peek().value + "'");
  }

  let statements = [];
  while(!isAtEnd()) {
    statements.push(declaration())
  }

  return statements;
}

module.exports = parser;