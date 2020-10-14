#!/usr/bin/env node
const params = process.argv;

function error(message, code=1) {
  console.log(`Error: \x1b[0m\x1b[1m${message}\x1b[0m`);
  process.exit(code);
}

/**
 * Args: [node] [cli] [...args]
 * TODO: Trim arguments.
 */
if (params.length == 2) {
  error("\x1b[91mExpected a file name, e.g. \x1b[0mnpx cookeylang index.clf");
} else if (params.length == 3) {
  require("./index").interpretFile(params[2])
} else {
  error("\x1b[91mExpected only one file name, e.g. \x1b[0mnpx cookeylang index.clf");
}