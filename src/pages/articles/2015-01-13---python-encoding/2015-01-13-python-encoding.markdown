---
title: python2编码问题
date: "2015-01-13"
layout: post
draft: false
path: "/posts/python-encoding/"
category: "Python"
tags:
  - "Python"
  - "Programming"
description: "这篇文章是要记录今天写一个采集是遇到的编码问题的，但是因为在写博客时遇到了一些问题，所以也就顺便记录一下。..."
---

这篇文章是要记录今天写一个采集是遇到的编码问题的，但是因为在写博客时遇到了一些问题，所以也就顺便记录一下。

在执行rake new_post的时候，突然提示
<pre>
rake aborted!
LoadError: cannot load such file -- bundler/setup
/home/joey/octopress/Rakefile:2:in `<top (required)>'
(See full trace by running task with --trace)
</pre>

突然感觉很奇怪，前几天更新博客的时候都没有遇到这种情况，后来执行`rake --trace`的时候发现
<pre>
/usr/lib/ruby/2.2.0/rubygems/core_ext/kernel_require.rb:54:in `require'
/usr/lib/ruby/2.2.0/rubygems/core_ext/kernel_require.rb:54:in `require'
/home/joey/octopress/Rakefile:2:in `<top (required)>'
/usr/lib/ruby/2.2.0/rake/rake_module.rb:28:in `load'
/usr/lib/ruby/2.2.0/rake/rake_module.rb:28:in `load_rakefile'
/usr/lib/ruby/2.2.0/rake/application.rb:689:in `raw_load_rakefile'
/usr/lib/ruby/2.2.0/rake/application.rb:94:in `block in load_rakefile'
/usr/lib/ruby/2.2.0/rake/application.rb:176:in `standard_exception_handling'
/usr/lib/ruby/2.2.0/rake/application.rb:93:in `load_rakefile'
/usr/lib/ruby/2.2.0/rake/application.rb:77:in `block in run'
/usr/lib/ruby/2.2.0/rake/application.rb:176:in `standard_exception_handling'
/usr/lib/ruby/2.2.0/rake/application.rb:75:in `run'
/usr/bin/rake:33:in `<main>'
</pre>

原来是系统ruby的版本更新到2.2了，以前是2.1的，octopress用的是2.1的gem，也许是和2.2的ruby不兼容吧，所以要重装2.2的gem套系，执行`proxychains gem install bundle`，有经验了必须要通过代理才能访问rubygem网站，下载完之后需要把`/home/joey/.gem/ruby/2.2.0/bin` 添加到环境变量中，因为我用的是fish，所以编辑`~/.config/fish/config.fish`就行了。然后用bundle安装完必要的依赖`proxychains bundle install`，下载一大堆gem，最后发现系统用的rake已经是10.4.2版的了，而配置文件中需要的还是10.4.0,手动编辑一下`Gemfile.lock`，把版本号改过来就行了，后来又重装了一下`safe_yaml`和`liquid`，把对应的版本号也都改过来了，一个小版本升级搞得这么麻烦，真是郁闷。

接下来就是说说今天写代码遇到的问题了。

需求很简单（话说写采集需求都很明确），这回需要的是采集明星的信息，第一个方案用的是采集baidu整理的明星信息，过程很简单，写了一个简单的脚本采了900条数据，但是后来发现图片做了防盗链，采集过来的图片不是图片的绝对路径，而是通过一台服务器生成的图片，也许是做了cookie的限制或者是做了ip的限制，导致每次刷新页面的时候都会返回一个403错误，链接在[这里](http://www.baidu.com/s?wd=%E6%98%8E%E6%98%9F%E5%A4%A7%E5%85%A8&rsv_spt=1&issp=1&f=8&rsv_bp=0&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_sug3=4&rsv_sug4=83&rsv_sug1=3&rsv_pq=d5fdf7cd00002ac7&rsv_t=975c0jUWTeYgIUYA%2FfdqSJ75f%2BipUP9QR9v8Qgqb2jzy3rnHgTU3k4rBD%2B5moP73i00p&rsv_sug2=0&inputT=5564)，以后有时间也许会去看看这个防盗链的实现，但是现在我可懒得花时间去研究怎么破解这个限制，那就换别的站采集吧。

和产品沟通了一下，他也觉得如果死扣baidu是不明智的选择，后来换成360整理的资源了，链接在[这里](http://www.haosou.com/s?ie=utf-8&shb=1&src=360sou_newhome&q=%E6%98%8E%E6%98%9F%E5%A4%A7%E5%85%A8)，数据也比较明确，分成3栏：领域，地域，性别，这个分类还是比较好的，以后我们拿来查询也方便。通过chrome开发工具，找到了js的接口，简单分析了一下就知道要获取那块数据，接下来就是敲代码了，最后的代码在[这里](https://gist.github.com/xcaptain/cbf9980f1b30b2467d8a)，本来是打算试试octopress对于gist的支持的，但是因为gist在国内被墙了，会影响整篇文章的阅读，所以就换个链接在这里，有兴趣的朋友就去看看。

在写代码过程中遇到一个编码问题，困扰我很久，不过最终还是解决了。

在使用python2的时候，要自己手动设置编码，python默认的字符串编码是ascii，这就导致如果在python2程序中出现了中文都会提示一个语法错误，但是如果在python2文件中强制加上一句`# -*- coding: utf-8 -*-` 这样python在执行程序的时候就知道使用utf-8来编码里面的字符串了。也许是我本地locale的设置，在打开python解释器的时候总是会自动帮我使用utf-8编码。
首先说说ascii编码，ascii只能编码代码点从0到127的字符，也就是英文字符，如果遇到代码点很高的字符，比如说中文，就没法争取的编码了，就会报错。下面来举几个例子：

```python2
s1 = '你好，world' #这里如果指定了文件的编码为utf-8，会自动把这个字符串编码成utf-8
s1 => '\xe4\xbd\xa0\xe5\xa5\xbd\xef\xbc\x8cworld'
s2 = u'你好，world' #这里前面加了一个u来表明这个字符串是一个unicode字符串
s2 => u'\u4f60\u597d\uff0cworld'
u2 = s2.encode('utf-8')
u2 => '\xe4\xbd\xa0\xe5\xa5\xbd\xef\xbc\x8cworld'
```

字符串在内存中应该是用类似utf-8的形式存储的，这样比较节省内存空间，而且也不会出现太多的0导致字符串在大尾和小尾机器上的不兼容。所以对于一个python字符串的旅程可以大致归结为：

 1. 在编辑器里写下`s1 = '你好，world'`然后保存为一个python文件的时候，编辑器会自动选择某种编码来保存这个文件，一般来说都是用的utf-8。
 2. python把这个程序加载进解释器的时候，会根据文件头来判断使用什么编码来解码这个文件，也就是`# -*-coding: utf-8 -*-`这行，如果没有这行就会用默认的`ascii`来解码。
 3. 这时候程序里的字符串都是utf8的。
写到这里突然发现昨晚的问题实在不算问题，看来之前是没有静下心来研究，写博客还是有好处的。

接下来再看看python3,python3的默认编码是unicode，而实际存在内存中的就是字节码，bytecode。也就是说一个字符串只有2种状态，unicode和byte，这样就节省很多事情了，没有各种编码解码的麻烦。
```python3
s = '你好，world' #这是一个str类型的字符串
b1 = s.encode('utf-8') #这是把s编码为utf-8后的字节码
b2 = s.encode('gbk') #把s编码为gbk后的字节码
```
相对于2来说，3最大的进步就是不需要手动encode，decode，对于处理未知编码的文件最方便了。
