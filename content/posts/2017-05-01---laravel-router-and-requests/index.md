---
title: laravel路由与请求处理
date: "2017-05-01"
template: post
draft: false
slug: "/posts/laravel-router-and-requests/"
category: "Laravel"
tags:
  - "PHP"
  - "Programming"
  - "Laravel"
description: "在升级laravel过程中深入挖掘laravel与lumen框架处理路由与请求的具体细节..."
---

把手上的几个项目都从laravel 5.3升级到5.4了，说说在升级过程中遇到的问题。

## dingo api不兼容问题的解决
dingo使用了自己的route service，在最开始的配置中和laravel5.4是不兼容的


## jwt-auth的配置以及和dingo的配合使用
通过配置jwt使得在代码中能够获取到当前登录用户信息，在middleware中能检验登录

## 通过middleware来记录request和response的log
terminate middleware
