---
title: linux桌面设置
slug: "/posts/linux-desktop-setup/"
date: "2018-12-11"
template: "post"
category: "Linux"
tags:
  - "Linux"
---

从大二开始使用 linux 系统，最早接触的系统是 ubuntu 11.10，那会儿刚买到自己的笔记本厌倦了普通的 windows 系统所以装了 ubuntu 双系统把玩，不得不说体验很好，导致接下来一直都在用 linux，直到现在物理机上只有 linux。类似话题的博客写过好几篇了，这篇当作个总结吧，之前写的零散的文章就可以删掉了

## 我的 linux 历程

1. 11 年 3 月上大一的时候买了第一台 Acer 笔记本，一开始只有 windows 系统
2. 11 年 10 月份左右因为沉迷游戏，觉得很羞愧开始把游戏都卸载了，并且了解到了 ubuntu 操作系统，开始安装 linux
3. 体验各色 linux，ubuntu 11.10 unity, mint, opensuse, gentoo/funtoo, sentific linux, calculate linux, antergos, arch, netbsd, freebsd, chromeos
4. 体验了各色桌面环境，unity, gnome3, gnome2, kde5, mate, lxde, xfce4, xmonad
5. 安装方式经历了嵌入到 windows 之中，双系统，虚拟机，单独的系统

到目前为止我在一台 xps 15 9570 上面使用 arch，使用 gnome3+wayland 桌面

## 基础配置

### SHELL

安装完系统之后，首先需要配置的是 fish，之前也用过 zsh，但是觉得不如 fish 好用，配置也简单，一键安装就行

```shell
sudo pacman -S fish

chsh -s /usr/bin/fish
```

### 终端

默认的 gnome terminal 就很好

### 终端复用器

最早的时候没概念只知道使用`Ctrl+Alt+T`让终端生成新的标签，后来使用了 tmux，发现功能非常强大，很提高效率

```shell
sudo pacman -S tmux
```

这个软件安装完了之后需要额外配置，不然默认界面非常丑

### 输入法

最早的时候用 ibus+sunpinyin，现在用 fcitx+rime,sougou-pinyin,google-pinyin，配置比较简单但是很繁琐，linux 下的拼音输入法还是太落后了，有时间想自己写一个

### 代码编辑器

最早是 vim 党，后来用 emacs，现在用 code，因为 code 也是开箱即用，不需要额外配置，方便的很

```shell
aurman -S visual-studio-code-bin
```

### 浏览器

最早的时候 linux 内置的浏览器只有 firefox，后来发现 chromium 支持也很好，所以现在一直在用 chromium，因为可以使用谷歌帐号同步信息

### 非对称加密

我使用 ed25519 的加密算法生成的密钥对，我用这对密钥来进行ssh身份认证，git也配置了自动签名，也是用的这对密钥

## 性能优化

### 挂起与休眠

这个特性可以节省很多电量，但是需要额外的配置，首先一个就是要配置一个比ram稍大的swap分区，我目前是32G的内存，配置了34G的swap，在配置swap的时候要注意不要把swap配置到root分区的左边，这样不好做未来的扩容，最好是把swap放到整个硬盘的最右边。然后配置hibernate，需要配置grub指定resume分区，并且给cpio加上resume的hook。配置完之后编辑 `/etc/systemd/sleep.conf`

```text
[Sleep]
AllowSuspend=yes
AllowHibernation=yes
AllowSuspendThenHibernate=yes
AllowHybridSleep=yes
HibernateDelaySec=180min
SuspendMode=suspend
SuspendState=disk
HibernateMode=suspend
HibernateState=disk
```

这样就省电了，可以通过 `sudo systemctl suspend`, `sudo systemctl hibernate` 测试挂起和休眠

### 使用nvidia GPU

最早为了省电是把gpu禁用了，但是后来发现把这块1050Ti的GPU禁用掉太浪费了，启用的话可以用cuda来做计算，或者可以配置本地的软件使用gpu，提高性能。目前我是设置是开机默认禁用nvidia，关机的时候也自动把nvidia关掉。从arch wiki上面找了2个自动启用gpu和自动关闭gpu的脚本，按需使用

```shell
sudo enablegpu.sh
sudo disablegpu.sh

lsmod | grep nvidia # 查询是否正确加载了驱动
nvidia-smi # nvidia 的命令行控制面板，显示当前显存使用情况等
```

测试了简单的cuda程序，以及安装测试了gpu版本的tensorflow，确实速度很快，但是很遗憾截止目前（2019-07-08），wayland, chromium, virtualbox都还不支持nvidia显卡

### 使用super键切换工作区

这是一个gnome的bug，[https://gitlab.gnome.org/GNOME/gnome-shell/issues/1250](https://gitlab.gnome.org/GNOME/gnome-shell/issues/1250)，新版本已经修复了，如把本地遇到这个bug要通过`dconf-editor`重置这几个按键，或者根据issue里面的方式使用一个脚本更新

```shell
for i in {1..9}; do gsettings set "org.gnome.shell.keybindings" "switch-to-application-$i" "[]"; done
```

### 优化rime输入法

自定义词库，配置颜文字

### 更换网卡

使用intel AX200，5.1以上内核不需要额外安装驱动 [https://wireless.wiki.kernel.org/en/users/drivers/iwlwifi](https://wireless.wiki.kernel.org/en/users/drivers/iwlwifi)

## 连接vpn

用过pptp, openvpn，这2者都算是标准的vpn协议，最近要用北大的vpn，使用的是第三方的某种小众vpn协议，费了一番手脚，最后用`openconnect`这个软件成功连上了
