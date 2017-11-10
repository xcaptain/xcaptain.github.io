---
title: elasticsearch基础查询功能
date: "2017-11-11 01:00:00"
layout: post
draft: false
path: "/posts/elasticsearch-learning-basics/"
category: "elasticsearch"
tags:
  - "Elasticsearch"
  - "Programming"
  - "Web Development"
description: "如何搭建部署es服务，使用es进行基本的查询操作，一些简单的例子"
---

## 简介
Elasticsearch是一个高可用的，开源的，支持海量数据读写，搜索和分析的引擎。常见的用途有搜索、日志存储与检索。[中文文档](https://www.elastic.co/guide/cn/elasticsearch/guide/current/foreword_id.html)是个开始的好地方

## 搭建部署服务器
官网上说服务器至少要安装jdk8，但是我自己电脑上使用的是`OpenJDK 9`也能部署，所以应该8以上都能跑。
按照官方文档，ubuntu服务器的安装流程如下：
1. 导入签名
```bash
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
```
2. 更新本地软件源
```bash
echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-5.x.list
```
3. 安装并且更新
```bash
sudo apt update && sudo apt install elasticsearch
```
4. 启动服务
```bash
sudo systemctl start elasticsearch
```
在ubuntu 16.04机器上，es配置文件存放在`/etc/elasticsearch`目录下，可执行文件和插件等在`/usr/share/elasticsearch/`下，默认情况下es监听的是`localhost:9200`端口

## 基本术语
**集群(cluster):**
多个es节点，配置了相同的集群名字组成一个集群，集群内可以新增和删除节点

**节点(node):**
一个运行中的es实例称为一个节点，一般是一台服务器

**分片(shard):**
整个集群中的一部分数据

**索引(index):**
索引实际上是指向一个或者多个物理 分片 的 逻辑命名空间，与mysql类比的话可以当作是数据库

**类型(type):**
索引中相关的数据放在一个type中，类似mysql中的表

**文档:**
type中的一行记录

## 相关开发工具
1. curl

使用curl来操作es，或者是其他http客户端

2. elasticdump

这个工具用来导出数据很方便

## 查询语句
查询语句比较复杂，慢慢看文档去吧

## 中文分词
中文搜索比较麻烦，同义词，近义词，多义词，多音词等等都是要考虑的问题，目前比较有名的分词插件有[ik](#), [ansj](#)

## 搜索优化
目前没有太好的办法，我是添加词库操作的

## 实际例子
基于大众点评数据做的搜索引擎