---
title: 通过vagrant安装coreos
date: "2014-12-26"
template: post
draft: false
slug: "/posts/install-coreos-with-vagrant/"
category: "Virtualization"
tags:
  - "Virtualization"
  - "Vagrant"
  - "CoreOS"
description: "昨晚学习了一下vagrant的用法，今天开始试着用vagrant来在本地虚拟化一个coreos的系统，等熟悉coreos的基本操作之后就可以把我现在vps的freebsd10换成coreos了..."
---

昨晚学习了一下vagrant的用法，今天开始试着用vagrant来在本地虚拟化一个coreos的系统，等熟悉coreos的基本操作之后就可以把我现在vps的freebsd10换成coreos了。

按照[官方的教程](https://coreos.com/docs/running-coreos/platforms/vagrant/)一步一步来。

1. `git clone https://github.com/coreos/coreos-vagrant.git` 会在当前目录创建一个叫做`coreos-vagrant`的目录，里面包含coreos的基本配置以及vagrant的配置。
2. 更改配置。vagrant的配置文件就是`Vagrantfile`，这是一个ruby的文件，里面定义了2个配置文件

    CLOUD_CONFIG_PATH = File.join(File.dirname(__FILE__), "user-data")
    CONFIG = File.join(File.dirname(__FILE__), "config.rb")


一个是当前目录下的`user-data`文件，一个是当前目录下的`config.rb`文件

<pre>
VirtualBox is complaining that the kernel module is not loaded. Please
run `VBoxManage --version` or open the VirtualBox GUI to see the error
message which should contain instructions on how to fix this error.
</pre>

根据Vagrantfile里面 提供的url下载系统的时候，可能是url被屏蔽了，所以需要使用点小手段`proxychains vagrant up`

但是等下载都完成之后却出现下面这段错误信息
<pre>
Command: ["hostonlyif", "create"]

Stderr: 0%...
Progress state: NS_ERROR_FAILURE
VBoxManage: error: Failed to create the host-only adapter
VBoxManage: error: VBoxNetAdpCtl: Error while adding new interface: failed to open /dev/vboxnetctl: No such file or directory
VBoxManage: error: Details: code NS_ERROR_FAILURE (0x80004005), component HostNetworkInterface, interface IHostNetworkInterface
VBoxManage: error: Context: "int handleCreate(HandlerArg*, int, int*)" at line 66 of file VBoxManageHostonly.cpp
</pre>

听起来是virtualbox的网卡驱动没有加载进来，在网上搜到一个很简单的方法，`sudo vboxreload`

virtualbox的驱动问题解决之后，还是执行`proxychains vagrant up`但是这回却报错了
<pre>
Bringing machine 'core-01' up with 'virtualbox' provider...
Bringing machine 'core-02' up with 'virtualbox' provider...
Bringing machine 'core-03' up with 'virtualbox' provider...
==> core-01: Checking if box 'coreos-stable' is up to date...
==> core-01: Fixed port collision for 22 => 2222. Now on port 2250.
==> core-01: Clearing any previously set network interfaces...
==> core-01: Preparing network interfaces based on configuration...
    core-01: Adapter 1: nat
    core-01: Adapter 2: hostonly
==> core-01: Forwarding ports...
    core-01: 22 => 2250 (adapter 1)
==> core-01: Running 'pre-boot' VM customizations...
==> core-01: Booting VM...
==> core-01: Waiting for machine to boot. This may take a few minutes...
    core-01: SSH address: 127.0.0.1:2250
    core-01: SSH username: core
    core-01: SSH auth method: private key
    core-01: Warning: Remote connection disconnect. Retrying...
    core-01: Warning: Remote connection disconnect. Retrying...
</pre>

翻墙之后127.0.0.1是vps的内部loop地址，不是本机的，所以怎么也ssh不上去，既然东西都下载完了那就不需要代理了，直接`vagrant up`就有了下面的信息，太好了，这是在自动装系统呢。

<pre>
Bringing machine 'core-01' up with 'virtualbox' provider...
Bringing machine 'core-02' up with 'virtualbox' provider...
Bringing machine 'core-03' up with 'virtualbox' provider...
==> core-01: Checking if box 'coreos-stable' is up to date...
==> core-01: There was a problem while downloading the metadata for your box
==> core-01: to check for updates. This is not an error, since it is usually due
==> core-01: to temporary network problems. This is just a warning. The problem
==> core-01: encountered was:
==> core-01:
==> core-01: Failed to connect to 2404:6800:4008:c00::80: Network is unreachable
==> core-01:
==> core-01: If you want to check for box updates, verify your network connection
==> core-01: is valid and try again.
==> core-01: VirtualBox VM is already running.
==> core-02: Importing base box 'coreos-stable'...
==> core-02: Matching MAC address for NAT networking...
==> core-02: Checking if box 'coreos-stable' is up to date...
</pre>

3台虚拟机全部安装ok，我有一个集群了，哈哈哈哈。查看一下集群的运行状态。
<pre>
Current machine states:

core-01                   running (virtualbox)
core-02                   running (virtualbox)
core-03                   running (virtualbox)

This environment represents multiple VMs. The VMs are all listed
above with their current state. For more information about a specific
VM, run `vagrant status NAME`.
</pre>

查看一下virtualbox的运行状态，有3个进程分别运行着3个虚拟机。
<pre>
joey     10033  1.1  0.2 163232  9492 ?        Sl   22:33   0:08 /usr/lib/virtualbox/VBoxXPCOMIPCD
joey     10040  2.6  0.4 707156 19324 ?        Sl   22:33   0:20 /usr/lib/virtualbox/VBoxSVC --auto-shutdown
joey     11184  3.8  1.9 1497696 74992 ?       Sl   22:33   0:28 /usr/lib/virtualbox/VBoxHeadless --comment coreos-vagrant_core-01_1419632903871_39166 --startvm 29a5b99b-dfa8-48e6-b18f-d63b01696df2 --vrde config
joey     11204  0.0  0.2 154828  9228 ?        S    22:33   0:00 /usr/lib/virtualbox/VBoxNetDHCP --ip-address 192.168.56.100 --lower-ip 192.168.56.101 --mac-address 08:00:27:AA:0D:77 --netmask 255.255.255.0 --network HostInterfaceNetworking-vboxnet0 --trunk-name vboxnet0 --trunk-type netflt --upper-ip 192.168.56.254
joey     27124 10.2  1.9 1527828 76788 ?       Sl   22:40   0:32 /usr/lib/virtualbox/VBoxHeadless --comment coreos-vagrant_core-02_1419633622663_70678 --startvm 07c05704-61e7-4e61-bebd-723978180348 --vrde config
joey     28280 17.8  2.0 1523732 81576 ?       Sl   22:43   0:28 /usr/lib/virtualbox/VBoxHeadless --comment coreos-vagrant_core-03_1419633784764_52573 --startvm f614df63-7556-45ac-a4ca-3654d6039d3d --vrde config
joey     29297  0.0  0.0  12384  2400 pts/2    R+   22:45   0:00 grep --color=auto -i virtualbox
</pre>

再看一下我的`VirtualBox VMs`目录：
<pre>
coreos-vagrant_core-01_1419632903871_39166/  coreos-vagrant_core-03_1419633784764_52573/
coreos-vagrant_core-02_1419633622663_70678/  Public_default_1419540157403_62624/
</pre>
昨天还只有`Public_default_1419540157403_62624/`一个目录，今天就多了3个了，算上昨天的那个ubuntu12.04，我是不是有4个虚拟系统了？

进入到我的`Vagrantfile`所在的目录，执行`vagrant ssh core-01`，就登陆进我的第一个虚拟机了。

剩下的就是学习如何使用coreos在上面部署开发环境了，有vagrant这么方便的工具来管理虚拟机，我都不想去研究docker了，我这样一个菜鸟竟然也能管理4台机器，科技真是使人懒惰。
