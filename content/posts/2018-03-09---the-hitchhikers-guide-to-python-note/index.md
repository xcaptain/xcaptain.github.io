---
title: The hitchhiker's guide to python 读书笔记
date: "2018-03-09"
template: post
draft: false
slug: "/posts/the-hitchhikers-guide-to-python-note/"
category: "Python"
tags:
  - "Python"
description: "速读了《The hitchhiker's guide to python》这本书的英文影印版，记录一下读书笔记"
---

这不是一本初学者的教程，里面没有涉及太多语法特性，作者主要精力用于描述python编程中的一些最佳实践，以及开发高质量应用的一些经验，如使用pip管理依赖，把组件以vendor的形式发布到网络上，如何跨平台开发，组织代码等

# 目录结构

## 1~3章

前3章讲的是工具性的内容，开发环境，python版本，编辑器，实用小工具等，对于有生产软件开发经验的人基本可以跳过

## 第四章如何写好代码

这块的内容也比较浅显通用，如果有几年软件开发经验应该都能体会到，举几个例子：

### 函数定义要保持简短，返回值要尽量保持简单。

这个很好理解，太长的函数不便于复用，如果返回值太过于复杂了可以考虑抽象

### 函数参数定义要明确，尽量避免传列表和字典

这个也好理解，因为简单类型可以用类型推导，复杂的类型没法类型推导而且第一眼看过去不知道是什么类型，影响可读性

### 相信开发者都是理性人

python是一门很灵活的语言，没有提供私有方法私有属性的语法特性，是因为作者相信每个开发者都是理性的，不会滥用语言给开的后门，当然作者给了最佳实践就是用下划线来区分私有，这样看到代码就知道这是个私有方法，别轻易调用后果自负。而且语言给了开发者自由
修改库方法默认行为的权利，所以要自己对自己负责。

### 一些开发中遇到的陷阱

```python
def append_to(element, to=[]):
    to.append(element);
    return to
```

```php
function append_to($element, $to=[]) {
    $to[] = $element;
    return $to;
}
```

在python中默认参数是在函数创建时被初始化一次，以后多次调用都使用这一个值
而php不一样，默认参数随着函数每次调用都使用传入的值，在这个例子中是空，个人感觉php的行为更合理点

### python的装饰器语法

和装饰器模式的概念类似，已有一个咖啡对象，可以通过装饰器模式生成一个加糖的开发对象，也可以生成一个加牛奶的咖啡对象，具体例子见下：

```python
def p_decorate(func):
   def func_wrapper(name):
       return "<p>{0}</p>".format(func(name))
   return func_wrapper

def strong_decorate(func):
    def func_wrapper(name):
        return "<strong>{0}</strong>".format(func(name))
    return func_wrapper

def div_decorate(func):
    def func_wrapper(name):
        return "<div>{0}</div>".format(func(name))
    return func_wrapper

@div_decorate
@p_decorate
@strong_decorate
def get_text(name):
   return "lorem ipsum, {0} dolor sit amet".format(name)

get_text = div_decorate(p_decorate(strong_decorate(get_text)))
```

这么看来python的装饰器和函数式编程中的高阶函数概念差不多，通过一个函数去组合另一个函数，使得生成的函数包含更多的功能，不过装饰器更加强大的一点是它可以在对象方法里使用

### 文档、测试

讲了一些测试工具，但是基本思想所有语言都差不多。打包的话可以找现有优质项目的`setup.py`看看

## 第五章 如何读代码

读代码各人有各人的技巧，现代的编辑器非常强大，善用跳转调试功能，读起来就很方便了，书中介绍了一个工具叫[python call graph](http://pycallgraph.slowchop.com/en/master/)用来生成调用图，对复杂的项目还是调试一遍更容易代码

## 第六章

讲了如何打包代码，如何发布到pypi上

## 第七章及以后

不想看了，主要介绍了一些开发的工具，如jenkins, travis-ci, numpy, jupyter等
