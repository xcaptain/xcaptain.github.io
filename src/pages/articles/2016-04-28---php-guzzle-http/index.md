---
title: php使用guzzle发送http请求
date: "2016-04-28"
layout: post
draft: false
path: "/posts/php-guzzle-http-client/"
category: "PHP"
tags:
  - "PHP"
  - "Programming"
description: "最原始的发送http请求的方法是调用原生的curl扩展，这就需要在php.ini中允许`extension=curl.so`，使用方式也很简单，下面是几个发送基本GET, POST请求的例子..."
---

最原始的发送http请求的方法是调用原生的curl扩展，这就需要在php.ini中允许
`extension=curl.so`，使用方式也很简单，下面是几个发送基本GET, POST请求的例子。

1. curl 发送GET请求:
```php
$ch = curl_init($url) ;
curl_setopt($ch, CURLOPT_HEADER, 0); // 不返回http头
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1) ; // 按字符串返回而不是输出到屏幕上
curl_setopt($ch, CURLOPT_TIMEOUT, 3); // 设置连接超时时间
$result = curl_exec($ch) ;
curl_close($ch);
```

2. curl 发送POST请求:
```php
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST,1); // 表明是发送post请求
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonString); // post的数据，支持json字符串和http_build_query之后的参数
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch) ;
curl_close($ch);
```

3. curl上传文件:
也是一个post请求，例子见下面
```php
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST,1);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'file' => new \CurlFile($fullFileName, $mimeType, $filename);
    'param1' => $value1,
    'param2' => $value2,
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-type: multipart/form-data;'
]);
$result=curl_exec ($ch);
curl_close ($ch);
```

第一次使用curl上传文件的时候还遇到了一点小问题，网上大部分写法都是用`'file' => @"$fullFileName"`来加载文件的，我用这种写法反复测试了很久都不能获取到真是的文件，后来才发现[CurlFile](https://secure.php.net/manual/en/class.curlfile.php)这个类，按照文档下面评论的说法，php发送multipart请求的时候会有问题，解决办法有2个，1：允许`CURLOPT_SAFE_UPLOAD`， 2：使用CURLFile 而不是 "@"

我偏好的http请求库 [guzzle](https://github.com/guzzle/guzzle)
作为一个应用开发者而言，更多的封装往往是更好的，curl太原始了，接口太少，选项太多，如果要发一个post请求，得先去查一下如何设置数据，如何设置请求头，返回值说明什么意思，如何表示20x, 30x, 40x, 50x的状态码，但是作为一个http库选择就更少了，我们只要知道如何创建请求对象，如何发送请求，响应对象，异常是什么就够了，知道了这几个概念如果要发送一种特殊请求只需要修改请求对象就行了

请求对象:

一个简单的GET请求的对象
```php
$request = new \GuzzleHttp\Psr7\Request('GET', 'http://httpbin.org');
```

一个简单的POST请求的对象
```php
$request = new \GuzzleHttp\Psr7\Request('POST', 'http://httpbin.org');
```

一个简单的发送multipart/form-data请求上传文件的例子
```php
$r = $client->request('POST', $url, [
    'multipart' => [
        ['name' => 'file','contents' => $body],
        ['name' => 'user_id', 'contents' => 1],
    ],
]);
```

发送请求：
首先要有一个客户端对象，这个对象能够发送一个请求对象，然后获得响应
```php
$client = new Client();
```
发送请求：
```php
$client->send($request);
```

在调试curl发请求的时候还发现了一个小技巧抓包，用`nc -l -p 8888`开启一个监听端口，然后把curl的请求地址设置为`http://127.0.0.1:8888`，这样就能抓到php发送http请求的数据了，总之guzzle比curl强大太多，能用就多用。
