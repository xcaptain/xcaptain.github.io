---
title: dotnet core 2回顾与评价
slug: "/posts/dotnet-core2-review/"
template: post
draft: true
date: "2019-05-30"
category: "Web"
tags:
  - "Web"
  - "C#"
  - "Tuturial"

description: "最近忙完了一个小项目，使用了dotnet core这个框架，回顾之后感觉还不错"
---

在这个项目中用到的技术包括dotnet core 2.2, entity framework core, sql server, jwt, 微信开发, swagger文档生成, docker自动化构建, windows server 2019 运维，很多东西都是第一次用到，但是很顺利的交付了产品，以下介绍在开发中用dotnet core的心得

技术选型上没什么说的，因为依赖sql server 2008，还要维护一些老代码，所以选择了dotnet core 2，新项目采用了前后端分离的开发模式，前端是小程序和管理后台单页，后端只要出接口就行，所以这个server还是比较简单的

## 开发环境配置

我本地是archlinux，所以通过包管理器安装dotnet core的sdk和runtime就行，开发工具用的是vscode，安装了微软自家的C#扩展

## 创建dotnet项目

```bash
dotnet new webapi -o TodoApi
```

dotnet cli中内置很多模板，选择webapi，默认生成的脚手架代码做了很多操作，比如引入json库，默认返回json等

## 安装依赖包

先安装efcore(entity framework core)，这是默认的orm，要操作数据库一定要安装这个，从nuget上搜索包名，然后下载就行，我本地是linux开发，所以我用的`dotnet add`命令

安装完成之后根目录下的csproj文件会新增一条`PackageReference`，和其他语言的不同之处是微软似乎不喜欢用语义包管理法，所有的包都必须要有一个精确地版本号，不像别的语言可以使用`*`, `^`, `~`等来标识一个版本

## 依赖注入

依赖注入对于现代的web应用来说是必不可少的，以前写go的时候没有依赖注入，导致写出来的代码就像过程式代码，意大利面条一般，而且要花很多力气在不同地方反复构造一个对象。依赖注入的好处自不必说，asp dotnet core内置了很多服务，但是默认开启的不多，用户可以按需开启，比如说

```csharp
// 注入数据库依赖
services.AddDbContext<DbContext>(opt =>
    opt.UseSqlServer("数据库连接串"));

// 添加日志服务依赖
services.AddLogging();

// 开启内存缓存（2.2才引入的特性，但是很方便）
services.AddMemoryCache();
```

注入服务之后，dotnet core会进行自动依赖解析，比如说一个控制器要用到数据库以及日志，那么在构造函数中指明这2个依赖，框架会自动从容器
中解析出这2个对象传到控制器内部

```csharp
private readonly ILogger _logger;

private readonly DbContext _context;

public ValueController(ILogger<ValueController> logger, DbContext context)
{
    _logger = logger;
    _context = context;
}
```

## model binding

这个特性我也很喜欢，通过类型注解自动从请求的查询参数、请求表单、请求体中解析出指定字段或对象，相比很多其他语言都是要自己从请求中
获取参数，省去了很多机械化的劳动

## C# 7的特性

C#绝对是一门被低估的语言，强类型，强大的类型推导，强大的LINQ语法
