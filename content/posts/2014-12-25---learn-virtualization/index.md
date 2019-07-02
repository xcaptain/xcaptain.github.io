---
title: 第一次接触虚拟化
date: "2014-12-25"
template: post
draft: false
slug: "/posts/learn-virtualization/"
category: "Virtualization"
tags:
  - "Virtualization"
  - "Vagrant"
description: "说discourse是未来十年互联网论坛发展的趋势，那就搭一个来看看呗，反正以前也学过一阵子ruby on rails..."
---

之前在我的vps上部署了一个[php论坛](http://f.joxy.org)，但是后来这个框架的[创始人](https://github.com/esotalk/)突然在github上宣布重构了[esotalk](https://github.com/esotalk/esoTalk)的代码做了一个新的论坛框架[Flarum](https://github.com/flarum/core)，搞得我很伤心，后来在[wiki](https://en.wikipedia.org/wiki/Comparison_of_Internet_forum_software)上看到介绍discourse，它的作者[Jeff Atwood](http://www.codinghorror.com/blog)说discourse是未来十年互联网论坛发展的趋势，那就搭一个来看看呗，反正以前也学过一阵子ruby on rails.

按照原来部署[http://f.joxy.org](http://f.joxy.org)的模式打算先在本地部署好环境，然后提交到git server然后在线上拷贝一份代码到服务器上。但是看discourse的官方安装文档的时候发现默认是不支持在实体机上安装系统的，官方的文档只支持通过docker来部署discourse，docker久仰大名了但是就是没有用过，那好，就去见识见识呗。

搜索了一下发现现在比较流行的服务器环境配置，服务器管理都是通过container也就是容器来进行的，最老土的服务器管理方式是通过ssh连接上服务器，然后手动编译或者包管理的形式安装软件。但是这种方式有很大的局限性，不易把所有的机器都统一配置，因为所有配置文件都要由手动编辑，然后手动更新，必然有的机器版本早，有的机器版本晚，对于管理一个服务器集群来说这是很不方便的。而且服务器多了软件更新就是一个麻烦事，不可能一台机器一台机器的去更新。

目前找到了3个比较有名的虚拟化技术：

1. docker， 更类似于chroot
2. vagrant，用来管理virtualbox虚拟机
3. rocket，暂时没什么太多了解

早上出门的时候在youtube上看了一个通过docker来安装coreos的视频，但是感觉要学习yaml语法配置，比较繁琐，那就先来看看vagrant吧。

在vagrant的[官方文档](http://docs.vagrantup.com/v2/getting-started/index.html)上找到了简单的使用方法，其实说白了就是一个自动安装运行virtualbox的脚本。首先得安装vagrant，`sudo pacman -S vagrant`，然后得安装virtualbox，`sudo pacman -S virtualbox`，然后还得安装一大堆的依赖，`sudo pacman -S virtualbox-host-modules`是用来安装virtualbox用来和宿主机通信的模块，如果这个软件太老了就会无法正常使用vagrant，那么一个补救措施就是`sudo pacman -S virtualbox-host-dkms`，virtualbox安装好了之后还得解决一些内核的驱动，最简单的就是`sudo dkms autoinstall`，这个命令会自动搜索`linux-headers`然后编译对应的驱动，如果系统上没有装`linux-header`那么还是会报错的，那就得`sudo pacman -S linux-headers`。需要安装的软件，驱动，都装好了之后就是在内核加载virtualbox的驱动了，很简单`sudo modprobe vboxdrv`，这时候就大功告成了。

对照着教程在自己的笔记本上一步一步的做，先`vagrant init hashicorp/precise32`，这回在当前的目录下创建一个叫作`Vagrantfile`的文件，这里面包含了一大堆虚拟机的配置信息。然后`vagrant up`就会启动虚拟机，这时候`ps aux | grep -i virtualbox`就会发现virtualbox已经自动在运行了，在家目录的`VirtualBox\ VMs/`目录下也会创建对应虚拟机的目录，但是没有启动那个讨厌的图形界面这很不错。因为vagrant主要是用来配置服务器的，所以不需要图形界面，等系统下载安装好了之后就可以执行`vagrant up`来启动虚拟机了，这个操作会检测是否有`Vagrantfile`里面写的系统，如果没有就会自动从网上下载。系统下完之后`vagrant ssh`可以远程连接上虚拟机，发现虚拟机上面有一个网卡ip是`10.0.2.15`，好奇怪的东西，联网方式是NAT还是bridge呢？有一个自动安装系统的脚本，叫作`postinstall.sh`，以root身份执行它会自动安装系统，等最后跑完的时候吓我一大跳

```shell
++ rm -f '/home/vagrant/*.iso' /home/vagrant/postinstall.sh
++ dd if=/dev/zero of=/EMPTY bs=1M
dd: writing `/EMPTY': No space left on device
78697+0 records in
78696+0 records out
82518818816 bytes (83 GB) copied, 207.558 s, 398 MB/s
++ rm -f /EMPTY
++ exit

```

一下dd我83G的硬盘，这可是我整个宿主机所有的空间了，不会影响到我吧，后来`df -h`了一下才发现虚拟机没有使用多少硬盘空间，而且宿主机也没有消耗掉很多硬盘空间。这样就有了一台虚拟机了，这可比直接用virtualbox方便多了，没有预先问我分配多少颗CPU，没有问我分配多少RAM，没有问我分配多少硬盘就把系统装好了，我喜欢。

vagrant有一个共享目录就是宿主机的`Vagrantfile`所在的那个目录，也是虚拟机的`/vagrant`目录，这个目录双方都可以读写，想想真是有点小激动，要是以后我虚拟一个windows出来在上面跑一个qq，然后今天志军通过qq传给我的《刺杀金正恩》就不用在windows上跑着vlc服务器给我的arch笔记本供源了，不知道有没有人为vagrant做windows的box。

不过vagrant毕竟是建立在virtualbox之上的，虽然说虚拟机占用宿主机的资源少了，但是还可以做得更好，要让机器资源更加充分的利用就得学习docker了，加油。

另外今天和小青谈了一下学习方式的问题，他说我三天打鱼两天晒网没有持之以恒的做一件事，想想也确实是这样，从工作开始学习和使用php来干活，python是原来就会的所以也就没有怎么学，但是又学了几个礼拜ruby，学了几个礼拜haskell，工作在二次开发discuz，但是业余时间却自己搭了一个esotalk的论坛，现在又在研究虚拟化技术。虽然我一直认为身为一个互联网从业者就得把握住互联网的发展方向，不断学习最新的技术，我们生活在一个很开放的社会，最新最热的技术都是开源的有详细的文档，如果不去学习不去研究而是抱着把会的东西研究透彻的话，我有种辜负了这个时代的感觉。希望时代别辜负了我。
