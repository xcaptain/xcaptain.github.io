---
title: 递归地删除数组里所有多余的空格
date: "2016-08-07"
template: post
draft: false
slug: "/posts/recursive-remove-space/"
category: "PHP"
tags:
  - "PHP"
  - "Programming"
description: "在使用jsoneditor的时候遇到一个问题就是总是会把多余的空格写入数据库..."
---

在使用[jsoneditor](https://github.com/jdorn/json-editor)的时候遇到一个问题就是总是会把多余的空格写入数据库，如：
```php
$a = ['a' => ' hello', 'b' => 'world ', 'c' => ' he '];
```

很多情况下我们都不需要开头结尾的空格，有时候空格甚至会带来麻烦，比如说图片地址后面加上空格之后就给前端操作带来麻烦，那么有什么好办法在写入数据库之前先过滤一遍呢？

对于上面这种对象数组处理方式很简单：
```php
$a = array_map('trim', $a);
```

但是如果数组结构复杂，比如说是二维数组
```php
$a = ['a' => ' hello', 'b' => 'world ', 'c' => ' he ', 'd' => ['a' => ' hello', 'b' => 'world ', 'c' => ' he ']];
```

这时候就要有一个机制能够递归的处理每隔元素内部的空格，思路就是递归，代码见下：
```php
$myfunc = function (&$value, $key) use (&$myfunc) {
    if (is_array($value)) {
        array_walk($value, $myfunc);
    } else {
        $value = trim($value);
    }
};
array_walk($a, $myfunc);
```

普通函数的递归很好写，但是匿名函数的递归就是第一次写来，竟然需要用use来把当前函数导入进闭包里面，而且必需以传引用的方式，php的语法也是丑得可以。
