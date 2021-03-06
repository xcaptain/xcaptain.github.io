---
title: 学习haskell（二）
date: "2014-10-26"
template: post
draft: false
slug: "/posts/learn-haskell-2/"
category: "Haskell"
tags:
  - "Haskell"
  - "Programming"
description: "今天发现一件很有趣的事，我在ghci下输入`:i zip`来查看zip这个函数的用法的时候得到的结果是`zip :: [a] -> [b] -> [(a, b)] 	-- Defined in ‘GHC.List’`，zip明明是接收2个列表作为参数，然后一个元组的列表，但是根据这个输出，感觉zip是先处理列表[a]，然后再处理列表[b]，最后得到一个得到一个列表[(a, b)]..."
---

今天发现一件很有趣的事，我在ghci下输入`:i zip`来查看zip这个函数的用法的时候得到的结果是`zip :: [a] -> [b] -> [(a, b)] 	-- Defined in ‘GHC.List’`，zip明明是接收2个列表作为参数，然后一个元组的列表，但是根据这个输出，感觉zip是先处理列表[a]，然后再处理列表[b]，最后得到一个得到一个列表[(a, b)]。

为了验证我的猜想，先试`zip [1,2,3] [3,2,1]` 得到 `[(1,3),(2,2),(3,1)]`。这是意料之中的，zip的作用就是这个。

然后再试验：`(zip [1,2,3]) [3,2,1]` 得到 `[(1,3),(2,2),(3,1)]`，在这个函数调用中，我用括号把前一部分括起来了，也就是说先处理一个列表，然后返回一个函数再处理另一个列表。很奇怪，在实际函数调用中使用的是什么顺序来求值的呢？

在[stackoverflow](http://stackoverflow.com/questions/26571897/haskell-function-invoke-order)上面问了一下这个问题，原来这种现象有一个专业术语叫作[currying](http://en.wikipedia.org/wiki/Currying)，也就是说函数如何处理多个参数。没有看到后面就问问题还是比较尴尬的，在haskell里面大名鼎鼎的术语都不知道，太丢人了。

后来我在搜索curry的时候还发现了[Haskell Brooks Curry](http://www-history.mcs.st-andrews.ac.uk/Biographies/Curry.html)这个人，haskell就是以他的名字命名的，真是牛得不行的一个家伙，16岁上哈佛，先是学医，后来又转学数学，后来有修了一个物理学的硕士，博士又开始搞数学，开始是打算写偏微分方面的论文的，到最后发现兴趣在逻辑学上，就转而研究逻辑去了。在40岁的时候成为了世界上最有名的逻辑学家。haskell的爱好者看起来都有很强的数理逻辑的背景啊，对于写过程式的代码也许真会越写越傻，因为思维到最后都变成机器的思维了。

还有一件很有意思的事就是惰性求值，在别的语言里可真是不多见。所谓的惰性求值就是如果这个变量没有被用到那就不会去求值。比如说`let a = 1`，在这里定义了一个变量a，但是其实这时候a还没有求值，只有在我们调用a的时候才会打印它的值。再比如说`let a = cycle [1,2,3]`，这会一直循环[1,2,3]这个列表，但是如果我们不去调用a就没关系，反正不调用就没有值。或者我们`take 10 a`，就会得到返回列表的前10个值，在这里调用了a，但是在求值的时候只用到了前10个，所以a没有一直循环下去。别的语言有这种定义无限个元素的列表的能力吗？别的语言有惰性求值的能力吗？
