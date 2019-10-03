---
title: 我的服务器运维手册
date: "2018-09-14"
template: post
draft: true
slug: "/posts/my-ops-handbook/"
category: "Web"
tags:
  - "Web"
description: "断断续续的积累了挺多杂七杂八的服务器运维经验，是时候总结一下了，这样下次再需要做的时候直接查这篇文章就可以了，运维没有太大的难度，主要是规范化和细心"
---

目前的运维经验主要集中在云服务器运维上，实际机房运维经验少的可怜，所以本文主要讲的是云服务器的运维，即所谓的devops运维，实际机房的运维太繁琐也没多大必要去做

## 云服务商选型

国内主流的云服务商有阿里云，腾讯云，七牛云，京东云等，我用过的有阿里云，腾讯云，七牛云，按理来说这几家技术上应该没有本质区别，该有的功能大家都有，各种各样的事故大家都出过，但是我更喜欢阿里云。为某个业务选择好云服务器厂商之后，应该保证所有的服务都在一个厂商的一个机房下，这样数据在一个机房内网通信是最快的，避免不必要的消耗

## 服务器操作系统选择

我的经验主要在ubuntu上，但是目前容器化是趋势，所以宿主机的功能已经不多了，ubuntu和redhat系差别不大，主要是易用性。最近有幸在业务中接触到了windows server，也算是积累了windows运维的经验，没啥别的感受，部署都是很简单，就是觉得windows server + sql server 造成的额外开支实在是没必要

## 数据库服务选型

目前运维过的数据库有：

1. mysql

    这是最常见的数据库了，上云之后运维难度也大大降低，只要创建用户，设置备份，设置访问白名单，这样安全性就很高了。
2. mongodb

    自建维护比较麻烦，尤其是遇到服务器升级这块，我个人不喜欢mongodb，能用关系型数据库的地方就用关系型数据库
3. SQL server

    微软家的产品，几乎无法在web服务器上自建，因为安装光盘都是盗版的，但是买服务器的话又比mysql贵了一倍，实在是不知道为啥有人要用这个数据库，使用ORM的话，就算是.net软件也能用mysql
4. clickhouse

    穷人的数据仓库，单击部署还是很简单的，官方提供了ubuntu的安装包，但是多机分布式部署就得仔细学习了，但是比起hadoop那一套应该还是简单多了

## 负载均衡选型

以前需要手动配置nginx或者haproxy来做负载均衡，配置https还会更麻烦，但是现在只要买一个负载均衡服务就行了，不用关心厂商是使用什么软件来做的负载均衡，要加密连接也很简单，申请好证书，绑定到负载均衡器上，这样外网到机房的连接就是https的了，但是负载均衡器到后端的业务服务器还是明文http请求，不过影响应该不大，都在机房内网应该不用担心中间人攻击。

## 对象存储以及CDN选型

在存储和图片处理这方面七牛确实比腾讯云做得好得多，之前比较过腾讯云和七牛云用同样的算法模糊一张图的性能，七牛比腾讯快多了，为此我还发了工单以及去v2发帖找腾讯云的人确认是否真这么慢。配置对象存储也很简单，调用sdk把服务器硬盘的文件传到存储上然后删除本地硬盘文件就行，阿里云有个对象存储的文件系统，直接上传之后就写云端了，机房内网带宽是1G以上的，所以内网传文件和本地硬盘写文件的性能损失应该不会很大。

## 部分机房运维经验

前段时间去了一次机房下线服务器，所以对服务器价格配置都有点基本的了解

## 某在线教育服务架构实践