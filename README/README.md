# CookeyLang
File extension: `.clf`
Specifications: Dynamic, Strong

## Comments
```
%% comment
%*
  multi comment
*%
```

## Variables
```
var variable = 5;
final constantVariable = 5;
var notyetdefined; %% by default, it will be NaV.
```

### Strings
```
var str = "Strings
can
span
multiple
lines
as
well.";
```

## Functions
```
function funcname(arg, arg1, arg2) {
  ret arg + arg1 + arg2;
}
```

### Spread Operator
```
function sum(x, y, z) {
  ret x + y + z;
}

var arr = [1, 2, 3];

sum(***arr);
```

## Lambdas
```
var a = (b, c): b + c;
```
These are one line, and they follow the form:
```
var/final function = (arg1[, arg2[, arg3[, ...]]]): [return value];
```

## Variable Conversion
```
var variable = "5";
number <- variable;

var variable = "d";
number <- variable; %% Error cannot convert to number
```
Now variable is of type number and is now able to add with other numbers.
If it can't be converted, it will throw error.

## Native Functions
```
print ("Hello, World!");
var output = input ("Your name? ");
clear();
error("OH NO THERE WAS A ERROR!");
exit 1;
```
The exit code is optional, and does not need parentheses.

## Logic
```
var num = 5;
if (num < 5) {
  print ("num is less than 5");
} el if (num > 5) {
  print ("num is greater than 5");
} el {
  print ("num is equal to 5");
}

%% => num is equal to 5

%% It can be simplified down to:
(num < 5) ? print ("num is less than 5");
: (num > 5) ? print ("num is greater than 5");
: print("num is equal to 5");

switch (expression) {
  case (x) {
    %% Code here
  }
  case (y) {
    %% Code here
  }
  def {
    %% Code here
  }
}
```

You can also evaluate code on the fly as well:
```
if {
  print("hello,");
  ret true;
} {
  print("world!");
}
```
Notice the `ret`.

## Loops
```
var array = [1, 2, 3];

foreach (var item in array) { print (item); }
for (i, 0, array.length, 1) { print (array[i]); }
while (true) { print ("I happen once!"); break; }
```
For the `for` loop, it is composed like this:
```js
("variable name", "start value", "end value (not inclusive)", "incrementer")
```

## Namespace
```
namespace_name :: {
  var variable = 5;
}
print(variable); %% error
namespace_name :: {
  print(variable); %% 5
}

print(namespace::variable); %% 5
var namespace::variable2 = 5; %% error
namespace::variable = 6; %% success
```
Namespaces is cookey's way of scope.

## Importing
```
include("path/to/file", namespace?);
```
All defined variables and functions will become global, so this should be at the top of the file. The namespace is optional, and will put inside a namespace.


Licensed under CC BY-NC-SA 4.0