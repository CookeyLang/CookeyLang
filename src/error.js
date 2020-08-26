function error(line, message, code=1) {
  console.log(`\x1b[91m[Line \x1b[0m${line}\x1b[91m] Error: \x1b[0m\x1b[1m${message}\x1b[0m`);
  process.exit(code);
} 


module.exports = error;