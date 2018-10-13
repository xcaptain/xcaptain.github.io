---
title: emacs使用自定义grep-find模板
date: "2015-03-07"
layout: post
draft: false
path: "/posts/emacs-use-grep-find/"
category: "Emacs"
tags:
  - "Emacs"
description: "被emacs的搜索功能纠结好久了，今天下定决心来解决一下。以前执行..."
---

被emacs的搜索功能纠结好久了，今天下定决心来解决一下。以前执行`grep-find`命令的时候查找的模板都是`find . -type f -exec grep -nH -e {} +`，但是这条命令在fish下没法用，找了一下发现在[这个issue](https://github.com/fish-shell/fish-shell/issues/95)里面作者提到了为什么fish里面没法用find，因为在fish里面`{}`是有意义的，所以就会提示exec缺少参数，所以如果写成`find . -type f -exec grep -nH -e '{}' +`就可以了，接下来的任务就是修改emacs的配置，把默认的`grep-find`的行为改掉。

因为查找功能是emacs默认就有的，所以我直接就去源代码目录找了，在`/usr/share/emacs/24.4/`下执行`grep 'grep-find' -R *`，然后在`lisp/ldefs-boot.el`和`lisp/loaddefs.el`找到了相关的代码，然后试着修改第12669行，这行看起来像是相关的代码，结果改完了半天不生效，无奈之下去[stackoverflow](http://stackoverflow.com/questions/28915372/change-the-default-find-grep-command-in-emacs/)提问，这个网站效率真的不是一般的高，很快就拿到答案了，有人说我找到的代码只不过是docstring而已，要修改的话得改`grep-find-template`,通过`C-h v`查看了一下这个变量的值，默认的是`"find . <X> -type f <F> -exec grep <C> -nH -e <R> {} +"`，修改它就行了，编辑`~/.emacs.d/personal/custom.el`，在最底下加上`(setq grep-find-template "find . <X> -type f <F> -exec grep <C> -nH -e <R> \'{}\' +")`，然后`eval-buffer`，问题完美解决，不得不说emacs真是灵活，不用改源代码就能实现自定义功能。

后面又修改了`find-grep-dired`的模板，好像这条命令没有模板，所以我直接改的代码，`/usr/share/emacs/24.4/lisp/find-dired.el.gz`编辑第278行，把{}转义了。
