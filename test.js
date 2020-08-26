const fs = require("fs");
const lexer = require("./src/lexer");
const parser = require("./src/parser");
const interpreter = require("./src/interpreter");

/**
 * @param file {string} The file
 */
function init(file) {
  let benchmark = {};


  let code = fs.readFileSync(file, "utf-8");
  console.log(code);


  benchmark.lexer = new Date().getMilliseconds();
  let tokens = lexer(code);
  benchmark.lexer = new Date().getMilliseconds(); - benchmark.lexer;
  
  console.log(tokens);


  benchmark.parser = new Date().getMilliseconds();
  let trees = parser(tokens);
  benchmark.parser = new Date().getMilliseconds() - benchmark.parser;
  
  console.log(JSON.stringify(trees, null, 2));


  benchmark.interpreter = new Date().getMilliseconds();
  let output = interpreter(trees);
  benchmark.interpreter = new Date().getMilliseconds();
  
  
  console.log("<=", output);
  console.log(`\n\nStats
Lexer: ${benchmark.lexer}ms
Parser: ${benchmark.parser}ms
Interpreter: ${benchmark.interpreter}ms
Total: ${benchmark.lexer + benchmark.parser + benchmark.interpreter}ms`)
}

init("files/test/tests/deletevariables.clf");