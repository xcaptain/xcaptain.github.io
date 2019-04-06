---
title: 使用go编写web后端
draft: false
slug: "/posts/go-web-programming/"
category: "Go"
tags:
  - "Go"
description: "最近把一些比较简单的web服务迁移到go上面了，总结一下最近遇到的问题"
---

整理下最近使用 go 编写服务端代码的心得，包括 go 语言基础，基本的服务端模型，一些常用的场景，一些在实战中总结出来的最佳实践。go 这门语言有
很多框架，因为`net/http`包太强大了，所以导致写 web 框架太容易了，不过我不建议用框架，自己从头编写代码就很好

## Go 基础

### 字符串和数字互相转换

如"1"和 1 之间转换

### struct 和 map[string]interface{} 转换

在 json 变换中常遇到

### 包导入

如何导入一个包

## 基本的 web server 开发常识

### mux 路由包的使用

`gorilla/mux`

### 中间件的使用

`gorilla/handlers`

### 记录请求日志

使用日志库记录日志

### 连接数据库（偏爱 postgresql）

已经对 mysql 无爱了，而且喜欢定义严格的数据库约束条件

### http 返回 json，设置状态码

`json.Marshal`
`json.UnMarshal`

### 渲染模板并且返回

核心思想是解析模板生成 html 写入到输出流中

## 基本的目录结构

使用 go mod 来管理依赖，核心代码放在`cmd`和`pkg`这 2 个目录下

### jwt 授权最佳实践

生成 jwt token，校验 jwt token，通过 bcrypt 算法生成密码并且验证密码

### 使用 DDD（领域驱动设计）来设计代码

代码不是按 MVC 的模式分层管理而是基于领域模型来划分

### 依赖注入最佳实践

使用 go cloud 开源的 wire 库来注入/解析依赖，不建议手动管理依赖，那将是个灾难

1. 在请求入口的`main.go`中绑定依赖（service)
2. 把这些service注入到http handler中，在handler中处理http路由请求
3. 每个service做指定的一件事

## 代码部署最佳实践

本地开发直接`go run`，部署到线上的时候使用 docker
