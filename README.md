[![npm version](https://badge.fury.io/js/cookeylang.svg)](https://badge.fury.io/js/cookeylang)
[![github issues](https://img.shields.io/github/issues/CookeyLang/CookeyLang)](https://github.com/CookeyLang/CookeyLang/issues)
[![Run on Repl.it](https://repl.it/badge/github/CookeyLang/CookeyLang)](https://repl.it/github/CookeyLang/CookeyLang)
# CookeyLang
Welcome to cookeylang! It is a dynamic, interpreted, and class-based language.
It is in active development on repl.it by our team.
- Coder100
- JDOG787
- CodingCactus
- Codemonkey51
- RaidTheWeb
- TheSummit3145

# Usage
## CLI
```sh
npx cookeylang [file]
```
```sh
npx -p cookeylang welcome
```

## Node
```js
const { interpretFile, interpretText } = require("./index");
interpretFile("[file]");
interpretText(`printLine("Hello, world!");`);
```

# Learn
Currently, use the [official website](https://cookeylangteam.repl.co) to learn cookeylang.

# Tests
For testing (benchmarks), use
```
npm run test
```

# Contributing
First, fork this repository.
```sh
git clone https://github.com/[user]/[name].git
```
To test out your fork (usually benchmarks):
```sh
npm test
```
To run your fork:
```sh
npm start
```
Commit:
```sh
git commit -m "[what you did]"
git push -u origin master
```
When you are ready, submit a pull request.