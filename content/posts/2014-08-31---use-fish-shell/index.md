---
title: 使用fish
date: "2014-08-31"
template: post
draft: false
slug: "/posts/use-fish/"
category: "Linux"
tags:
  - "Linux"
  - "Fish"
description: "从最初安装ubuntu到现在细细数来已经用过很多个Unix like system了，也经历过很多种shell从linux下标准的bash，到freebsd的tcsh..."
---

从最初安装ubuntu到现在细细数来已经用过很多个Unix like system了，也经历过很多种shell
从linux下标准的bash，到freebsd的tcsh，到补全功能非常强大的zsh，现在尝试了一个新的fish。
这不是鱼，全名叫做(friendly interactive shell)，用户友好的shell，语法高亮功能使得不容易
输错命令，自动补全功能比zsh还强大，能够根据man page里的关键字来补全，也能根据~/.ssh/config来
补全ssh命令，历史记录功能也比bash之类的友好。

fish的项目主页在[这里](https://github.com/fish-shell/fish-shell)，可以看到这个项目的还是比较
活跃的。因为我用的是archlinux，所以就没有去从build源代码，而是直接`pacman -S fish`安装的。

默认的fish已经很强大了:
    1. 内建了命令行语法高亮功能。输入不同的命令会用不同的颜色来显示。
    2. 要查找一个命令的历史记录不要用ctrl-R来找，直接输入这个命令的开头几个字母fish会自动用阴影
    显示上一次执行的这条命令，然后按下ctrl-E或者是右方向键就能全部补齐了，这个功能对于很长的命令
    来说真是太赞了，而且感觉比bash的ctrl-R强大多了。
    3. 自动补全功能非常强大。我在编辑这篇博客的时候不是输入`vim 20140-08-31-use-fish-shell.markdown`来
    编辑的，而是直接`vim fish<Tab>`来找到这个文件的，真是强大的功能，这是我目前发现的唯一支持任意
    位置补齐的shell，就算是也很不错的zsh也只支持从头补齐。
    4. 自动命令行纠错。比如说你要执行`cd ~/Documents`但是输成了`cd ~/documents`也没有关系，直接就自动
    纠错了。有了它真是方便。

虽然默认的fish很不错，但是我还是从github上clone了[oh-my-fish](https://github.com/bpinto/oh-my-fish)这个项目,
这个项目和[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)的结构很像，里面的配置都很有用，而且有多种
主题，当对目前这个主题审美疲劳了，换一个主题还是很不错的。使用oh-my-fish来作为fish的配置也很简单，按照github
上面的操作一步一步做就是了。

接下来就是根据自己的喜好自定义fish的theme了，要加载哪个theme只要改`~/.config/fish/config.fish`就ok，找到
`set fish_theme`这一行，填入你要的theme就行了，我用的是`set fish_theme zish`，这个主题挺漂亮的。

然后就是自定义一些别名了，fish没有alias这个命令，但是可以用函数来实现自定义别名。既然使用了oh-my-fish的配置
就得按照它的结构来修改。在`~/.oh-my-fish/functions/`里面放的都是自定义的函数。我先给vi起了个别名vim，因为
有了vim谁还用vi啊。在这个目录下建一个文件vi.fish。
<code>
function vi --description ‘alias of vim’
    vim
end
</code>
保存退出，然后在命令行输入vi，这时候打开的就是vim了，连重新打开一个shell都不用就生效了，真是好快啊。

接下来就是一些关于fish的shell编程方面的问题了。不过这块没有怎么认真去看。工作中用的都是bash，谁会为了执行
一个脚本而额外安装fish。不过我还是很喜欢fish的语法的，感觉和python和ruby很像，相比之下bash的语法就有点
另类和老古董了。等以后要用到fish script的时候再去认真研究一下fish syntax。
