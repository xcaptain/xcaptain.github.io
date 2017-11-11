---
title: 再次基于discourse搭建论坛
date: "2017-10-07 01:00:00"
layout: post
draft: false
path: "/posts/rebuild-discourse/"
category: "Discourse"
tags:
  - "Programming"
  - "Web Development"
description: "重新部署discourse"
---

早在14年的时候就关注过 [discourse](https://github.com/discourse/discourse) 并且在自己的服务器上部署过一个小论坛，但是当时精力有限，并且只是当玩具玩的，所以没多久就没有再维护了。
最近工作稍微不那么忙了，有了更多时间思考产品和运营的这块，而且自己业余时间做了几个小项目，突然有了一个想把目前做的这些项目整合起来做一个闭合的生态圈的想法

整理一下最近做的玩意儿：

## [hspot](https://hspot.iyue.club/)
我称之为热点，或者high点，这个网站是用来做资讯聚合以及订阅的，目前集成了一个爬虫抓取我觉得有意思的资源然后在前台展示

## [discuss](https://discuss.iyue.club/)
这是今天早上开始搭建的一个discourse的论坛，我打算用来做资讯交流，因为我自己看完新闻之后是喜欢和朋友严肃探讨一下的，网易和头条的评论
喷子太多，而且很多评论没多少价值，不是我喜欢的。国外的reddit, hackernews 上面的评论很多价值都很高，都是用户深思熟虑之后发表上去的，
我希望我能做一个类似的论坛让大家发表严肃的交流

## slackbot
最近喜欢上了做机器人，所以我把hspot和discuss都深度集成了slackbot，未来的考虑是把 [AI](https://api.ai/) 给集成进来，让我的机器人更加智能


接下来重点讲讲我部署discuss的经历吧，毕竟折腾一场，留点纪念。操作其实比较简单，discourse的开发团队很专业，文档，社区都很完善

### 通过docker线上部署discourse站点
这步操作比较简单，先把docker的仓库拉下来，然后初始化配置，再build站点
1. `./discourse-setup`
2. `./launcher build app`

### 配置多站点支持
这步稍微需要折腾一下，以前部署php站点是很简单的，因为php服务不吃内存，一台机器上可以部署几十上百个站点，但是对于rails应用来说就不行了，
rails很吃内存，discourse甚至要求服务器至少1G的内存，因为我的机器上已经跑了几个别的站点了，所以我要把这个论坛集成进去，不能让它独占我的
80和443端口。

通过上面的操作已经生成了一个叫 =containers/app.yml= 的配置文件，把template选项修改成以下的内容
```yaml
templates:
    - "templates/postgres.template.yml"
    - "templates/redis.template.yml"
    - "templates/web.template.yml"
    - "templates/web.ratelimited.template.yml"
  ## Uncomment these two lines if you wish to add Lets Encrypt (https)
  ##   - "templates/web.ssl.template.yml"
    - "templates/web.letsencrypt.ssl.template.yml"
    - "templates/web.socketed.template.yml"
```
而且还要把expose的2个端口配置给删掉，容器内不暴露端口而是通过socket与宿主机通信。 rebuild一下，会发现多了一个 =shared/standalone/nginx.http.sock=
文件，修改一下宿主机对应的nginx配置，通过proxy_pass把请求转到这个socket上，就搞定了

## 配置https
在上面的app.yml文件中注释掉了ssl配置就是因为要把https配置放到宿主机的nginx上，在宿主机上配置https也很简单，轻车熟路通过 =certbox --nginx=
生成ssl证书以及key。这里有个疑问，在proxy_pass过程中是把加密的数据包发给后端了还是把解密之后的数据包发过去了，有空的时候再去了解下，这里存疑。

## 配置邮件服务
邮件服务是花了最多时间的，因为 [mailgun](https://www.mailgun.com/) 的审核机制太慢了，按照里面的配置一步一步配置好，填好信用卡，配置好自定义域名，到最后还是处于
disabled状态，给客服发工单又是让填各种信息，回答各种问题，要求保证不spam，等到晚上才把我的站点给active了。mailgun提供api和smtp这2种
发邮件的方式，discourse默认用的是smtp发送，只要把smtp的用户名，密码，发送端口填好就行了，虽然官网介绍说api发送比smtp快3倍，但那有怎样呢，
我要到那个量级估计我的信用卡被刷爆了

## 设置主题
主题通过后台的自定义主题功能装了官方提供的一个material design主题

## 设置插件
目前我装了一个官方的slack插件，简单试验了一下效果不错，具体slack配置不提

## 其它
配置一个这么复杂的论坛不容易，我还有很多东西没弄，比如说cdn，比如说自定义logo,icon，还有首页布局等是待做的
