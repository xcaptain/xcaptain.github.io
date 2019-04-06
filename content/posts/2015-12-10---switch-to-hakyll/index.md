---
title: 博客从octopress迁移到hakyll
date: "2015-12-10"
template: post
draft: false
slug: "/posts/switch-to-hakyll/"
category: "Blog"
tags:
  - "Blog"
description: "之前的博客是使用octopress搭建的，这个静态站点生成器最大的好处就是简单，不需要自己额外的hack，装好octopress，简单设置好之后就能使用,而且提交，部署都有..."
---

### 准备完全迁移到hakyll上面了

之前的博客是使用octopress搭建的，这个静态站点生成器最大的好处就是简单，不需要自己额外的hack，装好octopress，简单设置好之后就能使用，而且提交，部署都有
现成的工具，主题也有很多，所以一用就用了一年多。从7月份开始就有点厌倦octopress了，因为不喜欢这么傻瓜式的东西，咱们的目标是to be a geeker，当然不能一直
不进步。hakyll算是非常极客的一个工具了，haskell写的，使用pandoc处理文本，而且配置文件完全是haskell代码，想着能用这么geek的语言，玩这么geek的软件，就
非常激动。

使用hakyll也非常简单，步骤是:

1. `cabal install hakyll` 安装hakyll，这一步非常耗时，因为自己的笔记本CPU落伍了。
2. `hakyll-init blog` 会在当前目录下创建一个叫作blog的目录。
3. `cd blog` 进入这个目录，会发现有一系列文件，这是默认的博客站点。
4. `cabal build` 默认会build这个haskell站点，生成站点可执行文件。
5. `dist/build/site/site build` 会编译`posts/`下面的文件，生成html文件到`_site/posts/`下面。
6. `dist/build/site/site watch` 会开启一个web服务器，默认访问地址是http://127.0.0.1:4000/ 点击访问，然后就你发现默认的首页了。
7. 默认站点好了接下来就是迁移原博客的文章，从原来的git仓库中把所有的markdown文件复制到`posts/`下面。
8. 再次试着build整个站点，这时候可能会有点问题，我这里因为有的文章元数据中categories:熟悉为空报了几个错，改完就好了。
9. 配置博客站点，修改站点外观，添加rss和tag页，我用的是[variadic](https://github.com/eakron/variadic.me)的配置，很简单，配置文件改动很小但是
却把我要的功能都实现了，真的很厉害。
10. 再次build，并且watch新的项目，顺利跑通了之后，但是看不到标签，很奇怪，原来老的文章是使用categories作为标签名的，现在使用tags了，自然要改。
`sed -i 's/categories\:/tags\:/g'` 一行sed命令，批量替换，真不错。
11. 博客在本地搭好了，并且预览过了，接下来就是部署到线上，还是用github-pages。那么我就需要2个分支，一个source分支用来存放静态站点的代码，包括站点
配置，原始markdown格式的博文，这样将来要换到别的机器上，直接clone source分支的代码下来build就行了。还有一个分支是master分支，这个分支存放build之后
的文件，也就是所有的静态文件，html, css, js, 图片等。因为我线上已经有一个博客站点了，所以只需要添加远程github仓库就行。
`cd blog`进入我的博客根目录，执行`git init .` 添加版本控制, `git add .`, `git commit -m 'first commit'`, `git checkout -b source`切换到
source分支，然后删掉master分支`git branch -d master`，因为代码只要保存在source，master只能放生成的静态文件。`git remote add origin git@github.com:xcaptain/xcaptain.github.io`添加我的远程仓库，
要注意编辑.gitignore文件，把_site, _tmp, _cache都忽略掉。然后是`git submodule add git@github.com:xcaptain/xcaptain.github.io.git _site/`把
线上的master分支作为我的一个模块，克隆到_site目录下。再执行一下`dist/build/site/site build`会生成新的静态文件写入_site/目录，当然那些老的文件不会被
删掉，比如说我之前的CNAME文件，favicon文件都还留着，这时候`cd _site/`然后再提交一下。本地所有的代码都干净之后就是推送部署了。在`blog/`目录下执行
`git push origin source`把当前分支推送到origin的source分支，然后再切换到`_site/`目录，执行`git push origin master`把生成的静态文件推送到线上的
master分支。访问[http://blog.iyue.club](http://blog.iyue.club)开测，真不错。

虽然说没有了octopress那么多做好的功能，但是通过折腾hakyll学习到了很多知识，等以后优化这个部署流程的时候可以自己写脚本部署，省得总是自己多次写shell命令

### Update 2017-05-05:

模板重写，使用了[sakura](https://github.com/oxalorg/sakura)的样式，界面稍微变得更加美观点了。
