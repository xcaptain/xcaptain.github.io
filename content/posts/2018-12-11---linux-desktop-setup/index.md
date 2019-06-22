---
title: linux桌面设置
slug: "/posts/linux-desktop-setup/"
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

到目前为止我在一台 xps 15 9560 上面使用 arch，使用 gnome3+xorg 桌面

## 基础配置

### SHELL

安装完系统之后，首先需要配置的是 fish，之前也用过 zsh，但是觉得不如 fish 好用，配置也简单，一键安装就行

```shell
sudo pacman -S fish

chsh -s /usr/bin/fish
```

### 终端

最早用的是默认的 gnome terminal，后来用了 urxvt/xterm，现在在用 alacritty，一个用 rust 写的终端软件，基本不需要配置，开箱即用

```shell
sudo pacman -S alacritty
```

### 终端复用器

最早的时候没概念只知道使用`Ctrl+Alt+T`让终端生成新的标签，后来使用了 tmux，发现功能非常强大，很提高效率

```shell
sudo pacman -S tmux
```

这个软件安装完了之后需要额外配置，不然默认界面非常丑

### 输入法

最早的时候用 ibus+sunpinyin，现在用 fcitx+sunpinyin,libpinyin,rime,google-pinyin，配置比较简单但是很繁琐，linux 下的拼音输入法还是太落后了，有时间想自己写一个

### 代码编辑器

最早是 vim 党，后来用 emacs，现在用 code，因为 code 也是开箱即用，不需要额外配置，方便的很

```shell
aurman -S visual-studio-code-bin
```

### 浏览器

最早的时候 linux 内置的浏览器只有 firefox，后来发现 chromium 支持也很好，所以现在一直在用 chromium，因为可以使用谷歌帐号同步信息

### 密钥对

我使用 ed25519 的加密算法生成的 rsa 密钥
