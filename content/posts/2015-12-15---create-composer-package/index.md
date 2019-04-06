---
title: 创建自己的composer组建
date: "2015-12-15"
template: post
draft: false
slug: "/posts/create-composer-package/"
category: "PHP"
tags:
  - "PHP"
  - "Programming"
description: "最近在做服务重构与模块化的工作，以前的老代码太多复制粘贴的东西，需要整理一下，否则将来项目就不可维护了..."
---

最近在做服务重构与模块化的工作，以前的老代码太多复制粘贴的东西，需要整理一下，否则
将来项目就不可维护了

涉及到的服务有：

1. api 主要的接口模块，大部分客户端交互由这个接口完成
2. image 图片服务，图片上传下载压缩等操作
3. chat 聊天服务

目前的架构就是这样的，等将来还可以继续拆分api接口，独立出更多小功能

在api和image中都会用到mq来与后端的java服务通信，原来的实现是自己封装的mq，同一个功能实现2次，
现在抽象出mq功能作为一个公共库，让这2个服务都能调用同一个mq的库。

主要涉及到的工具是composer，真是一个强大的武器。

1. 创建库
   - 新建一个目录，`mkdir mqpackage`
   - 切换进目录执行`composer init` 根据提示内容创建`composer.json`文件
   - 按照要求自己编辑这个json文件，比较重要的就是require和autoload这块
   - 然后就是敲代码了
   
2. 提交package到git仓库
   - 因为是在公司里开发的项目，不敢放到github上，推送到内部的git服务器了
   
3. 配置项目的composer.json文件，引入刚刚新增的库
   - 在项目的`composer.json`文件中的require区域加上上面的包要注意的就是要在repository里面加上这个包的地址，因为默认会从packgist上面拉
   
4. 重新测试一遍原有的2个服务的功能
   - 创建单元测试写测试是很重要的，尤其是写这种公共库，我也是对照这phpunit的文档一点一点的敲测试用例的
