---
title: laravel密码生成与校验机制
date: "2016-07-08"
layout: post
draft: false
path: "/posts/laravel-password-and-key/"
category: "Laravel"
tags:
  - "Laravel"
  - "PHP"
  - "Programming"
description: "在irc上听到有人说他们的应用改了.env中的APP_KEY之后就无法登录了，太奇怪了，在本地测试了几个例子都没有复现，决定详细看看这块..."
---

在irc上听到有人说他们的应用改了.env中的APP_KEY之后就无法登录了，太奇怪了，在本地测试了几个例子都没有复现，决定详细看看这块

在注册的时候生成密码的密文，内置了一个叫做[bcrypt](https://github.com/laravel/framework/blob/5.2/src/Illuminate/Foundation/helpers.php#L180)的函数来加密明文密码，实际密码生成是在[BcryptHasher#make](https://github.com/laravel/framework/blob/5.2/src/Illuminate/Hashing/BcryptHasher.php#L26)中，使用blowfish算法来生成密文，不带参数使用的cost是10

再看看密码验证这部分
实际校验是在[EloquentUserProvider#validateCredentials](https://github.com/laravel/framework/blob/5.2/src/Illuminate/Auth/EloquentUserProvider.php#L114)，调用BcryptHasher#check来校验，关于laravel和php的加密有[一篇很好的文章](https://mnshankar.wordpress.com/2014/03/29/laravel-hash-make-explained/)讲述了blowfish这个算法的作用，盐和加密变换次数都存放在密码本身，所以密码的生成和校验完全和APP_KEY无关，别害怕使用`php artisan key:generate`，这个命令只会让session失效
