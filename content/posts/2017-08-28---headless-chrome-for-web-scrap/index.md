---
title: 使用headless chrome进行网页爬取
date: "2017-08-28 01:00:00"
template: post
draft: false
slug: "/posts/headless-chrome-for-web-scraping/"
category: "Python"
tags:
  - "Programming"
  - "Web Development"
  - "Chrome"
description: "使用headless chrome进行网页爬取"
---

在使用[scrapy](https://scrapy.org/) 编写爬虫的过程中遇到一些动态加载的内容不好抓取，所以研究了一下[headless chromium](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)，如果不用这种方式的话就得手动
破解ajax请求的接口，了解不同网站做的校验规则，使用浏览器解析dom然后分析页面结构是最简单快速的方法了。

## headless chromium基本用法
根据[官方教程](https://developers.google.com/web/updates/2017/04/headless-chrome) 说明，在chromium59版本之后的浏览器自带了无头模式，只要通过命令行执行
```bash
chromium --headless --disable-gpu
```

就能打开一个无头的浏览器了，如果我想打开某个网页，并且分析完全加载完成的dom结构，那么只要执行
```bash
chromium --headless --disable-gpu --dump-dom http://www.dianping.com/shop/14198848 > /tmp/14198848.html
```

想要做后续的分析直接分析这个html文件就行了

## 通过selenium来驱动headless chromium
python有个叫selenium的包叫作，安装好之后就能操作浏览器了
### 安装依赖
`sudo pip install selenium`

### 示例代码
```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--user-agent=some user-agent name")

driver = webdriver.Chrome(chrome_options=chrome_options)
driver.get('http://www.dianping.com/shop/59473758')

# 返回html
html = driver.execute_script("return document.documentElement.outerHTML")

# 读取js全局变量
shop_config = driver.execute_script("return window.shop_config")

id = '59474758'
with open(id + '.html', 'wb') as f:
    f.write(str.encode(html))

driver.save_screenshot(id + '.png')
driver.close()  # 关闭chrome进程
driver.quit()  # 关闭chromewebdriver进程
```
这段脚本的作用很明显，首先是创建一个headless chromium的浏览器对象，然后用它打开大众点评的一个网页，然后导出dom，写入到一个html文件
中，最后把当前网页截图保存为一个png文件，并且关闭浏览器。竟然还能读取到js的变量，真是太强大了

## 在使用headless chromium过程中遇到的问题
### 一些引用的资源加载超时，导致整个页面超时
这个问题没有好的解决办法，看到文档上有设置页面ready的配置
1. [https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options)
2. [https://stackoverflow.com/questions/46160929/puppeteer-wait-for-all-images-to-load-then-take-screenshot](https://stackoverflow.com/questions/46160929/puppeteer-wait-for-all-images-to-load-then-take-screenshot)
但是selenium webdriver没法提供扩展，目前我的解决办法是加了

```python
driver.implicitly_wait(10)  # 资源10s没加载完就放弃
driver.set_script_timeout(10)  # 资源10s没加载完就放弃
driver.set_page_load_timeout(30)  # 请求30s没完成就放弃
```
不是很好用，最好的办法是绕过这些有加载不了的资源的网页。
### python程序异常退出导致chrome进程变成僵尸进程
正确设置异常处理程序，在出现异常时记得close()和quit()

## scrapy操作字符串
通过headless chromium导出的是纯字符串，如果要让它支持xpath解析，需要处理一下，比如：
1. [转成HtmlResponse对象](https://stackoverflow.com/questions/27323740/scrapy-convert-html-string-to-htmlresponse-object)

```python
from scrapy.http import HtmlResponse

response = HtmlResponse(url="my HTML string", body='<div id="test">Test text</div>')
response.xpath('//div[@id="test"]/text()').extract()[0].strip()
```

2. [转成lxml对象](https://stackoverflow.com/questions/8711030/fetch-partial-string-matched-html-tag-using-xpath)

```python
import lxml

html = '<div id="test">Test text</div>'
doc = lxml.html.fromstring(html)
```

## 使用BeautifulSoup操作html
bs的api比lxml的易用多了，比如说要新建一个标签，并且添加到某个节点下，lxml就比较难实现了，毕竟html不是标准的xml，看了一下lxml的api感觉比较复杂
就选择了用bs
```python
from bs4 import BeautifulSoup
import json
soup = BeautifulSoup(html, 'html5lib')
# add script tag
script_tag = soup.new_tag('script')
script_tag.append('window.globale_config=' + json.dumps(global_config) + ';')
soup.body.insert_before(script_tag)
```
这段代码在body标签的前面新增了一个script标签，标签内部定义了一个全局变量，这样就可以把dom和脚本都保存到本地了

有了headless chromium之后写爬虫就方便多了，甚至现代的各种SPA应用也不用担心，happy hacking!
