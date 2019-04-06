---
title: freebsd基本操作
date: "2014-08-16"
template: post
draft: false
slug: "/posts/freebsd-basic-operations/"
category: "FreeBSD"
tags:
  - "FreeBSD"
description: "上周买了一年的vps，一直没怎么折腾，今天环境稍微配置了一下，其实基本的软件安装都是
很简单的，每个成熟的系统都有它自己的包管理器..."
---

上周买了一年的vps，一直没怎么折腾，今天环境稍微配置了一下，其实基本的软件安装都是
很简单的，每个成熟的系统都有它自己的包管理器。我用类unix系统也不久，接触过的包管理
方式有debian/ubuntu系的dpkg和apt-get, opensuse的zypper, redhat的yum和arch的pacman
和freebsd的pkg，这这些发行版中我对于debian和arch还是比较熟悉的，freebsd也玩过但是
不是很熟悉它的命令行。

因为被公司的一台freebsd主机给震惊了，持续服务超过900天了，所以我买了vps之后没有
多想就安装了一个freebsd10的系统，因为这台机器硬件配置还是比较低的，只有768M的
内存。

首先安装nginx服务器，我还是比较习惯二进制安装，要我在服务器上编译nginx的源码
我才没有那个闲功夫呢。
`pkg install nginx`
这样就把nginx安装上了，如果要启动nginx得执行
`sudo /usr/local/etc/rc.d/nginx start`
因为我还没有想好在服务器上放什么，所以还没有具体配置nginx和fastcgi应用。

然后安装mariadb,这个没办法了必须得从源码安装，而且还没有办法安装mariadb10,只能
从源码编译5.5的版本。
`cd /usr/ports/databases/mariadb55-server`
`sudo make install clean`
编译的过程要很久，真怕生成一大堆临时文件让我可怜的15G固态硬盘受不了。漫长的等待时间过去
了，终于编译完了。默认的mariadb没有设置root的密码，为了明确权限肯定得设置密码。
`mysql -u root` 连接上数据库服务器之后就开始设置权限了，`set password for ‘root’@’localhost’ = password(‘yourpasswd’)`
这样就设置好了root的密码。

然后就是给root设置访问的权限了，`grant all privileges on *.* to ‘root’@’localhost’ with grant option`
这条命令是给root用户通过本地访问所有数据库的所有表的权限，如果我想要远程连接数据库稍微修改一下这条命令
就ok了。`grant all privileges on *.* to ‘root’@’%’ with grant option`，在mysql中`%`代表匹配任意字符串，所以
这条命令表示允许root通过任何ip来连接数据库。

本来还打算配置一下php的环境的，但是就我这几个月php开发的经历来看，这门语言实在是不值得花太多精力去学，
消耗巨大的内存，语言设计简陋，前后端分隔明显。我打算在服务器上搭建RoR的环境。

然后就是分配用户了，我新建了一个公共帐号public，操作也很简单`adduser`然后按照提示一步一步安装就好了，到了
最后还得考虑给这个用户分配权限的问题，我是通过sudo来管理root权限的，但是暂时没打算给这个公共号分配root权限。
后面还涉及到用户资源限制的问题，比如带宽资源，硬盘资源，cpu时间资源和内存资源，这些都是很专业的系统管理员
知识了，暂时没那个精力去学习。
