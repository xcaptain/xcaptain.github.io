---
title: 使用azure devops
slug: "/posts/azure-devops-tutorial/"
category: "Web"
tags:
  - "Web"
---

介绍一下如何使用 azure devops pipeline 实现自己的 CI/CD

## 整体步骤

### 注册账号

1. 注册 azure.com 的账号
2. 开通 devops 服务
3. 访问 [https://dev.azure.com](https://dev.azure.com)
4. 创建组织
5. 创建项目

### 创建 build pipeline

用于CI使用，会自动生成一个yml文件

### 创建 deploy pipeline

部署的时候用，基本流程是

1. 在azure管理后台创建一个部署组
2. 把这个部署组关联指定的机器，在第一步的时候会生成一段命令，粘贴到自己的部署服务器上就行
