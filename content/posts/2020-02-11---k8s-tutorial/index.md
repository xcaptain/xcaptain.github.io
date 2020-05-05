---
title: k8s 教程
template: "post"
date: "2020-02-11 17:54"
draft: true
slug: "/posts/k8s-tutorial"
category: "Linux"
tags:
    - Linux
description: "本文介绍我自己在本地搭建K8s开发环境的经历"
---

## 安装必要的软件

```bash
pacman -S kubectl minikube
```

## 启动minikube

```bash
minikube start
```

这期间会遇到docker镜像被墙的问题，需要自己手动设置国内的镜像仓库，例如使用阿里云的镜像

```bash
minikube start --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers
```

查看缓存的镜像

```bash
ll .minikube/cache/images/registry.cn-hangzhou.aliyuncs.com/google_containers/
```

## 运行部署

```bash
kubectl create deployment hello-minikube --image=registry.cn-hangzhou.aliyuncs.com/google_containers/echoserver:1.10

kubectl get pod
kubectl get deployment
kubectl get services

# 如果pod的状态不是ready可以使用下面这个命令查看失败原因
kubectl describe pod hello-minikube-647f9746bc-hx2kh
```

## 把容器作为一个服务暴露使得外界可访问

```bash
kubectl expose deployment hello-minikube --type=NodePort --port=8080

# 获取服务的访问地址
minikube service hello-minikube --url

# 打开网页dashboard
minikube dashboard
```

## 停止和删除

```bash
minikube delete service hello-minikube
minikube delete deployment hello-minikube
```

kubectl get service hello-minikube --output='jsonpath="{.spec.ports[0].nodePort}"'
