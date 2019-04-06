---
title: php编码规范
date: "2015-07-14"
template: post
draft: false
slug: "/posts/php-coding-style/"
category: "PHP"
tags:
  - "PHP"
  - "Programming"
description: "之前写代码的时候一直不是很在意编码规范的问题，感觉只要把代码功能实现了就OK，但是看到越来越多的优秀开源项目都给自己的项目制定了编码规范，提交PR必须要满足规范才能合并到主干，而且自己搞php开发也已经有1年了，得开始走向规范化开发的道路..."
---

之前写代码的时候一直不是很在意编码规范的问题，感觉只要把代码功能实现了就OK，但是看到越来越多的优秀开
源项目都给自己的项目制定了编码规范，提交PR必须要满足规范才能合并到主干，而且自己搞php开发也已经有1
年了，得开始走向规范化开发的道路。

首先得介绍一下psr2，目前[laravel](http://laravel.com/)项目使用的就是这个风格标准，具体的规定
在[这里](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)
我以前的习惯大部分符合psr2的标准，但是因为渐渐的使用到了很多高级的php特性，比如说closure, trait, 抽象类等，
所以还是得纠正一点小的习惯。

除了psr2这个标准之外，各大公司也有自己内部使用的标准，比如说symfony, wordpress, squiz等，还是靠拢
国际标准吧，目前我的emacs里面的php-mode的设置就是psr2的标准，自动格式化代码省了点心。

代码写完了之后提交到github上却总是发现过不了持续集成(Continuous Integration)的审核，我自己目前几个个人
项目使用的是[styleci](https://styleci.io/)这个在线审核的工具，功能很简单但是很强大，最初几次提交
总是会给我返回很多fail，导致严格要求自己按照编码规范来。

为了避免提交之后被styleci给鄙视，从网上找到了[PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer)这个
小工具，叫做php嗅探器，它其实包括2个小部件，一个是phpcs(php coding style)，另一个是phpcbf(PHP Code Beautifier and Fixer)，
前者只检查代码的问题，后者还会帮忙纠正代码，如果信不过机器帮忙纠正代码，那么之前一定的记得提交代码。根据官方文档上的
说明修改配置，简单使用，效果很不错。后来我又找了一个叫做[emacs-phpcbf](https://github.com/nishimaki10/emacs-phpcbf)的
小工具，这个是一个emacs的插件配置好之后可以集成到php-mode里面，稍加配置就可以在保存php文件的时候自动纠正错误。

后面发现通过phpcbf纠错的代码还是不能通过styleci，找了一下发现styleci用的是一个叫做[php-cs-fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer)
的引擎来审核代码的，又对照着装了一个php-cs-fixer，和phpcbf的功能差不多，但是稍微严格一点，对于额外的空行也会删掉。

码农要往正规化方向走，现在养成一下编码规范的习惯，以后再来培养测试驱动的习惯。
