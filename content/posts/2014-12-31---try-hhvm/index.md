---
title: 尝试hhvm
date: "2014-12-31"
template: post
draft: false
slug: "/posts/try-hhvm/"
category: "PHP"
tags:
  - "PHP"
  - "HHVM"
  - "Programming"
description: "今天听到一个新闻说维基百科把他的php引擎由zend全面转到hhvm了，详情见..."
---

今天听到一个新闻说维基百科把他的php引擎由zend全面转到hhvm了，详情见[这里](https://www.mediawiki.org/wiki/HHVM)。其实之前对于这东西是闻所未闻的，太不关注php的发展了，后来详细搜了一下，才稍微了解了一点php代码的执行过程。

对于动态语言来说，都是首先通过代码解析来生成字节码，然后通过解释器来执行这些字节码，php用的解释器叫作zend。看来和python差不多，程序在执行的时候也会先生成字节码，然后用python解释器去执行这些字节码。不过解释器的使用也导致了程序运行缓慢。所以现在facebook就做了一个叫作hhvm的东西，当通过hhvm来执行php程序的时候，会先生成一种中间码(intermediat byte code)也叫作HHBC(hhvm byte code)，然后hhvm会通过一种即时编译(just in time)的技术，将这种中间码编译为本地可执行的x86-64机器码，最后执行代码的时候等于是本地执行一个可执行程序，效率自然比解释器高了很多。不知道有没有什么方式能够把hhvm的这些步骤分离出来分析，真想看看php的字节码长什么样，生成的二进制程序长什么样。

我在本地立刻部署了一下HHVM的环境，很简单`sudo pacman -S hhvm`直接就安装hhvm了，测试一下效果，随便写一个php文件，然后`hhvm test.php`如果安装成功的话就可以得到像执行`php test.php`一样的效果，现在还没想好写个怎样的测试用例来比较hhvm和原生php的速度。

hhvm装好了之后当然不能只是用它来执行脚本，最重要的还是在服务器端编程上，当nginx接收到了一个请求的文件之后，并且把这个请求交个php的fastcgi处理后，在这里就不能用原生的php来执行文件里的php了，必须通过hhvm来执行，简单，就是不要启动php-fpm嘛，我看了一下安装hhvm的时候竟然自动连systemd的配置文件也生成了，所以我只要执行`sudo systemctl start hhvm.service`就能开启hhvm的监听程序了，类似php-fpm，hhvm服务器的配置文件存在`/etc/hhvm/server.ini`，在我这里配置文件写的是监听9000端口，那么`netstat -naltp | grep 9000`真的看到了一个监听的进程。然后就是确保nginx的配置文件中`fastcgi_pass`的值是`127.0.0.1:9000`，这样所有进入9000端口的数据都会被hhvm所处理。随便写了一个简单的数据库查询示例，暂时没发现hhvm和原生php的性能区别，也许是测试代码写得不好。
