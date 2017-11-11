---
title: php陷阱与缺陷
date: "2017-06-30"
layout: post
draft: false
path: "/posts/php-pitfalls/"
category: "PHP"
tags:
  - "PHP"
  - "Programming"
description: "最近使用php时遇到一个很奇怪的问题..."
---


最近使用php时遇到一个很奇怪的问题，即
```php
// php
0 == 'a'; // true
```
这个问题在web开发的时候可能会导致一些莫名其妙的问题，比较了一些其他语言之后发现大部分是不这么做的，先总结 0=='a' ==> true的

```perl
# perl
0 == 'a' # 1
1 == 'a' # 0
0 == '0' # 1
```

```php
// php
0 == 'a' // ==> true
0 === 'a' // false
1 == 'a' // ==> false
0 == '0' // true
```

0=='a' ==> False的：

```python
# python 3.6
0 == 'a' # False
0 == '0' # False
```

```ruby
# ruby 2.4
0 == 'a' # false
0 == '0' # false
```

```elisp
; elisp
(= 0 "a") ;; error
```

```ocaml
(* ocaml 4.04.1 *)
0 == '0';; (* error *)
```

```haskell
-- ghci 8.0.2
0 == '0' -- error
```

```erlang
% erlang otp 20
0 == '0'. % false
```

```c
// C
#include <stdio.h>

int main(void) {
  char a = 'a';
  printf("%d\n", (0 == a)); // 0

  return 0;
}
```

其他更加现代的语言，如rust,typescript,idris等就不说了，强大的type inference导致这样的代码根本不能通过编译器。
按照这样对照看来和php行为类似的只有perl，其他语言比较0=='a'要么报错，要么返回false。不管是返回true还是false，我还是更喜欢在编译时报错，这样可以及时发现代码中的问题。
