---
title: 操作服务器
date: "2018-08-22"
template: post
draft: true
slug: "/posts/a-funny-thing-about-servers/"
category: "Web"
tags:
  - "Web"
description: "从机房搬迁了物理服务器"
---

# 操作服务器

## 从机房搬迁服务器

## 重新启动服务器

## 破解密码

编辑 grub，recover mode entry 最后修改为 rw single init=/bin/bash 然后再用 root 登录，passwd 修改密码

## 备份数据

docker cp 从容器中复制文件到 host 机器

## 备份数据库文件

mongodump 生成备份目录
mongorestore 恢复备份
