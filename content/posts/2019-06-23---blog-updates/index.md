---
title: 博客更新
template: "post"
date: "2019-06-23 03:48"
draft: false
slug: "/posts/blog-updates"
category: "Blog"
tags:
    - Blog
    - Writing
description: "对博客界面和功能做了一些更新，希望能激励自己写作"
---

花了一晚上时间优化了一下界面，添加了一些功能，并且给写作制定一些标准

## 功能更新

- 加入disqus评论支持

    博客一直都没加评论也没有做SEO，现在看来是时候好好优化下了，目前disqus国内还用不了，很遗憾

- 加入google analysis统计

    在谷歌后台把原来老的统计更新到新的网站域名，实时统计功能还不错

- 使用travis-ci自动构建静态站点

    目前这个网站[https://joeyxf.com](https://joeyxf.com)是用netlify来构建的，如果要deploy到github pages则需要手动部署，目前通过`.travis.yml`部署效果不错

- katex支持

    启用了katex支持，方便把markdown转化为美观的数学公式，通过`$$`，或者`$$ $$`来包裹公式

- algolia搜索

    虽然文章不算多，但是搜个功能还是很有用的，目前只会索引发布的的文章，每次`yarn deploy`的时候会自动更新索引


## 写作规范

在markdown头部定义了很多元数据，每篇文的都应该包含这部分头，以便后续更新

目前markdown结构和netlify cms后台的目录结构不兼容，应该按目前的目录结构来，即使用本地相对路径图片地址而不是netlify cms的media path

写作我文章要有深度有内涵

## SEO优化

目前网站谷歌统计(google analysis)，谷歌搜索控制台(google search console)，在谷歌搜索控制台后台提交了sitemap和rss，页面上暂时没加太多seo优化代码，没有robot协议文件

## 注意

github personal page 只能把master分支当作gh-pages分支，所以不要白费劲去设置别的分支了，netlify后台配置了source分支更新的hook，travis监听的也是source分支，一改都得改
