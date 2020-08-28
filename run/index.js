const fs = require("fs");
const lexer = require("../src/lexer");
const parser = require("../src/parser");
const interpreter = require("../src/interpreter");

/**
 * @param file {string} The text.
 * @returns {string} Output value.
 */
function interpretFile(file) {
  if (!fs.existsSync(file)) {
    console.log(`\x1b[91mError: \x1b[0m\x1b[1mFile does not exist\x1b[0m`);
    return "NaV";
  }
  let code = fs.readFileSync(file, "utf-8");

  let tokens = lexer(code);
  let trees = parser(tokens);
  let output = interpreter(trees);
  
  
  console.log("<=", output);
  return output;
}

/**
 * @param code {string} CookeyLang code.
 * @returns {string} Output value.
 */
function interpretText(code) {
  let tokens = lexer(code);
  let trees = parser(tokens);
  let output = interpreter(trees);
  
  
  console.log("<=", output);
  return output;
}

module.exports = { interpretFile, interpretText };