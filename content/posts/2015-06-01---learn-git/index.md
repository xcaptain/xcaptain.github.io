---
title: 学习git
date: "2015-06-01"
layout: post
draft: false
path: "/posts/learn-git/"
category: "Git"
tags:
  - "Git"
  - "Programming"
description: "继续学习git，把统计后台的代码从内部git服务器迁移到github上面了，用的是自己的私有仓库..."
---

继续学习git，把统计后台的代码从内部git服务器迁移到github上面了，用的是自己的私有仓库。

目前主要用到的功能有：

1. 添加远程仓库
   `git remote add origin https://github.com/xcaptain/simple-admin.git`
   这样就能添加一个远程仓库了，等以后把代码push上去就行了，访问远程仓库的方式有2种，一种是ssh，一种是https，上面这种是https的仓库，也是github默认的访问仓库的方法，
   因为ssh太不安全了，对于我们这种生活在封锁国度的老百姓来说，很容易被屏蔽。

2. 往远程仓库里面提交代码
   `git commit -m 'some comment'`
   这样就可以提交代码，返回一个hash值标识的版本号，提交之后代码版本还在本地，如果要多方合作开发，那就得把改动保存到一个大家都可以访问的远程仓库，
   `git push origin master`，把本地版本推送到远程的master分支。

3. 建立本地分支
   `git branch dev`
   这样就在本地创建了一个叫做dev的分支，并且会自动切换到这个dev分支，如果建了好多个分支，想查看当前自己在哪个分支，直接`git branch`就会列出，当然如果使用的是zsh或者是
   fish这样的shell，一般都会有git的插件，可以显示当前所在分支。

4. 把本地分支添加到远程仓库
   `git checkout dev`切换到dev分支，然后`git push origin dev`就可以把代码推送到远程仓库的dev分支了。

5. 打标签
   `git tag`可以查看当前版本库的所有标签信息，如果要添加标签，那么就是`git tag -a v0.2 -m '优化流量统计代码，统一风格'`添加一个叫作v0.2的标签，并且提交。如果要把
   本地的标签信息提交到远程仓库，那么就是`git push --tags`，然后去github上查看就能看到对应的v0.2版本了。

6. 查看提交版本
   `git log`, `git diff`，我一般喜欢用emacs的magit插件来查看diff和版本。

7. 把未暂存的文件回滚
   `git checkout file1`，这样会从版本库中检出上一个提交的file1的版本，覆盖掉当前这个未提交的版本。

8. 回滚版本库
   这个操作目前做得比较少，都是`git reset --hard HEAD~1`，来回到上一个版本的，对于这个操作还不熟悉，至少svn回滚已经是很熟悉的了。

git的功能很强大也很复杂，但是一定是要掌握的，这样才能成为一个合格的项目经理，以后慢慢积累，有新的体会再来更新这篇博客。
