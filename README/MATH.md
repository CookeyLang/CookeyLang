# Math
```
include("math", math);

%% Round
var num = 5.788;
math::round(num); %% output 6


%% PI
math::PI %% constant

%% E
math::E %% euler's number


%% Lowest common multiple
var a = 10;
var b = 20;
math::lcm(a, b); %% output 20


%% Mean
math::mean(1, 2, 5, 6, 7); %% output 4.2


%% Median
math::median(1, 2, 5, 3, 11, 2); %% output 2.5


%% Range
math::range(1, 2, 5, 3, 11, 2) %% output 10

%% Factorial
math::fact(4); %% output 24

%% Combinatorics
math::nPr(6, 4); %% 360
math::nCr(6, 4); %% 15

%% Trigonometry
var a = 45;

math::sin(a); %% output 0.707
math::cos(a); %% output 0.707
math::tan(a); %% output 1

```
