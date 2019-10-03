---
title: 学习idris
date: "2017-06-06"
template: post
draft: false
slug: "/posts/learning-idris/"
category: "Idris"
tags:
  - "Idris"
  - "Haskell"
  - "Programming"
description: "学习idris这门语言的特性，了解依赖类型，强类型语言的优点"
---

在工作中一直写的是php，偶尔写点javascript, python，动态语言写多了之后发现很多语言本身的问题，导致要通过很多人为的规范来让程序变得可维护。

目前对php语言的一些感受：
1. 无类型推导([Type inference](https://en.wikipedia.org/wiki/Type_inference))
2. 无确定性异常捕获([checked exception](https://stackoverflow.com/questions/6115896/java-checked-vs-unchecked-exception-explanation))

目前在php7中加入了强类型开关，如果启用了能做部分类型推导，但是目前公司大部分代码还是php5的语法，而且线上环境还未切换到7。其实就算完全用php7
的严格模式开发，要想充分利用到类型推导带来的好处似乎也不太简单，php的创始人做的[phan](https://github.com/etsy/phan) 项目还没有发布v1.0版本，再说到处使用array, stdclass
这样的类型来存储变量，phan要实现这种代码的静态分析应该也很吃力，因为php7还不支持 [dependent type](https://en.wikipedia.org/wiki/Dependent_type)。看php相关的新闻，最近开发组的工作重心
似乎在jit以及性能优化上，要想做一个完整的类型系统估计还要很久，在这之前能加上一个好用的debugger我就知足了。

为什么类型推导这么重要呢，举个例子吧。
领导有个需求让实现一个字符串截取功能，你很快就写出来了

```php
/**
 * 一个很简单的字符串截取函数
 *
 * @param string $str 待处理的字符串
 * @param int $start 开始点
 * @param int $length 截取长度
 * @return string
 */
function cut_str($str, $start, $length)
{
    return substr($str, $start, $length);
}
```

你还特意给这个简单得不能再简单的方法添加了注释文档，但是有一天你在查看程序的日志时发现以下内容:

```text
PHP warning:  substr() expects parameter 1 to be string, array given on line 1
PHP error:  Undefined variable: a on line 1
```

如果公司做了错误日志收集监控，并且和kpi挂钩的话，那你就惨了，郁闷的你仔细查了一下代码，发现某个队友在调用你的cut_str方法时没有按照你给的注释来
传字符串参数而是传了一个数组过来，你可能会去和那个同事理论，告诉他你的文档里写得很清楚这个方法第一个参数是字符串不能传数组过来，他可能会埋怨你
这个方法写得不严谨没有做好脏数据的异常处理，互相扯皮几句之后还得回去老老实实修改代码，思考了一下之后你可能改成如下的样子:

```php
/**
 * 一个很简单的字符串截取函数
 *
 * @param string $str 待处理的字符串
 * @param int $start 开始点
 * @param int $length 截取长度
 * @return string
 */
function cut_str($str, $start, $length)
{
    if (! is_string($str)) {
        // do some log
        return '';
    }
    if ($start < 0) {
        // do some log
        return '';
    }
    if ($start >= str_len($str)) {
        // do some log
        return '';
    }
    if ($length < 0) {
        // do some log
        return '';
    }
    return substr($str, $start, $length);
}
```

写完之后你志得意满，新的方法太健壮了，不管猪队友传任何参数过来这个方法都能容错不会挂，而且可以默默的记录一些日志提醒自己有人传了乱七八糟的参数过来，
但是这个方法真的写得好吗？原来一行能搞定的问题被硬生生扩展到了15行，大部分都是冗余的校验，而且把校验，记日志，返回结果这3个职责混在一起做了，违反
了单一职责原则。在这里我们没有考虑抛异常把异常抛给上层去处理，因为这是上面checked exception相关的内容了。

说了这么多就是想引出idris这们语言，按照官网的介绍：
> Idris is a general purpose pure functional programming language with dependent types. Dependent types allow types to be predicated on values, meaning that some aspects of a program’s behaviour can be specified precisely in the type. It is compiled  with eager evaluation. Its features are influenced by Haskell and ML

简单说就是idris实现了一个很强大的类型系统，在编译时能能检测出大部分程序潜在的问题，真正做到once it compiles, it runs.

用idris重写一下上面那个cut_str方法

```haskell
cut_str : (index : Nat) -> (len : Nat) -> (subject : String) -> String
cut_str = substr
```

这时候谁要是写 cut_str 0 2 ["hello"] 这样的代码，编译器直接会报错，没机会走到runtime

```text
When checking argument subject to function Main.cut_str:
        Can't disambiguate since no name has a suitable type:
                Prelude.List.::, Prelude.Stream.::
```

这种形式的代码我非常喜欢，方法的参数定义得很明确，功能定义也很明确，如果谁乱调用，那么就将自食其果。

之前关注过的强类型的语言还有:

1. [typescrit](https://www.learning-idrisw.typescriptlang.org/)

学习idris这门语言的特性，了解依赖类型，强类型语言的有点
