/* function error(type, lineno, file, stack) {
  console.log(`${'\x1b[0;31m'}error ${type} on line ${lineno} in file: ${file}\nstack: ${stack}${'\x1b[0m'}`)
}
error('<name>', '<lineno>', '<filename>', '<stack>')
error('zwackstapo', '1', 'life.clf', 'the zwack stapo has found and harvested ur organs') */
// thank you for the error!

/*
TODO:
- Add errors
NOTES:
- In CPP, we will have a default value of string, which will be parsed into numbers.
The official number is double
*/

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
  // console.log(code);


  benchmark.lexer = new Date().getMilliseconds();
  let tokens = lexer(code);
  benchmark.lexer = new Date().getMilliseconds(); - benchmark.lexer;
  
  // console.log(tokens);


  benchmark.parser = new Date().getMilliseconds();
  let trees = parser(tokens);
  benchmark.parser = new Date().getMilliseconds() - benchmark.parser;
  
  // console.log(JSON.stringify(trees, null, 2));


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