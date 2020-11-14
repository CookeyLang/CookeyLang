[![npm version](https://badge.fury.io/js/cookeylang.svg)](https://badge.fury.io/js/cookeylang)
[![github issues](https://img.shields.io/github/issues/CookeyLang/CookeyLang)](https://github.com/CookeyLang/CookeyLang/issues)
[![Run on Repl.it](https://repl.it/badge/github/CookeyLang/CookeyLang)](https://repl.it/github/CookeyLang/CookeyLang)
# CookeyLang V2
Welcome to cookeylang2! It is a dynamic, interpreted, and class-based language.

It is in active development on repl.it by our team.
- Coder100
- JDOG787
- CodingCactus
- Codemonkey51
- RaidTheWeb
- TheSummit3145

# Deprecation notice
At the time of writing, CookeyLang **2** is slowly getting deprecated as version **3** starts rolling. This means that you should upgrade.
```sh
npm update
```
We have a special package, `cookeylang3` to provide some polyfills for the version 3, but it does not polyfill *all* the new features and definitely not the new syntax.

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
Currently, use the [official website](https://cookeylangteam.repl.co) to learn cookeylang**3**.

# Tests
For testing (benchmarks), use
```
npm run test
```