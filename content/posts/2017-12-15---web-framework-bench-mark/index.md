---
title: web框架性能测试
date: "2017-12-15"
template: post
draft: false
slug: "/posts/web-framework-benchmark-test/"
category: "Web"
tags:
  - "Web"
description: "最近因为工作原因调研了几款PHP框架，现在主要来做个性能测试..."
---

最近因为工作原因调研了几款PHP框架，现在主要来做个性能测试，看看不同框架在不同场景下各有什么优缺点，由于是性能测试，所以先一下我的环境配置:

```markdown
CPU: Intel Core i7-7500U @ 4x 3.5GHz [25.0°C]
GPU: Mesa DRI Intel(R) HD Graphics 620 (Kaby Lake GT2)
RAM: 1788MiB / 7865MiB
php: 7.2.0
python: 3.6.3
node: 9.2.0
rustc: 1.24.0-nightly
```

测试工具[siege](https://www.joedog.org/siege-home/)

# lumen

lumen号称是速度最快的微服务框架，先测试下这个框架的性能

## 通过命令行生成的未做任何处理的站点

操作：

```markdown
lumen new lumen-bench
cd lumen-bench
composer install
composer require php-pm/httpkernel-adapter:dev-maste
./vendor/bin/ppm start --bootstrap=laravel --port=8000 --cgi-path=/usr/bin/php
siege 'http://localhost:8000' -d1 -r20 -c20
```

结果：

```markdown
Transactions:                    400 hits
Availability:                 100.00 %
Elapsed time:                  13.59 secs
Data transferred:               0.02 MB
Response time:                  0.02 secs
Transaction rate:              29.43 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                    0.67
Successful transactions:         400
Failed transactions:               0
Longest transaction:            0.10
Shortest transaction:           0.00
```

在这里没有用php内建的server而是使用了[php-pm](https://github.com/php-pm/php-pm)是因为我用内建的server跑测试，并发上去之后完全没法测，性能太差了，目前看来ppm的性能还不错

## 还是上面的站点，但是稍作修改

操作：

编辑`bootstrap/app.php`把eloquent开启，再重复上面的步骤

结果：

```markdown
Transactions:                    400 hits
Availability:                 100.00 %
Elapsed time:                  15.45 secs
Data transferred:               0.02 MB
Response time:                  0.02 secs
Transaction rate:              25.89 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                    0.47
Successful transactions:         400
Failed transactions:               0
Longest transaction:            0.11
Shortest transaction:           0.00
```

我在公司观察到的结果是开启eloquent之后性能大幅降低，但是我在自己电脑上做测试却不能复现了，难道是php-pm的优化做得比较好？

## laravel

操作：

```markdown
laravel new laravel-bench
cd laravel-bench
composer install
composer require php-pm/httpkernel-adapter:dev-maste
./vendor/bin/ppm start --bootstrap=laravel --port=8000 --cgi-path=/usr/bin/php
siege 'http://localhost:8000' -d1 -r20 -c20
```

结果：

```markdown
Transactions:                    400 hits
Availability:                 100.00 %
Elapsed time:                  15.81 secs
Data transferred:               0.01 MB
Response time:                  0.04 secs
Transaction rate:              25.30 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                    1.08
Successful transactions:         400
Failed transactions:               0
Longest transaction:            0.33
Shortest transaction:           0.00
```

目前简单看来平均访问时间比lumen慢了一倍，但是总体性能还是不错的，可能是php-pm的帮助吧


## flask

操作：

`hello.py`

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'
```

```markdown
pip install Flask
set -x FLASK_APP hello.py
python -m flask run
siege 'http://localhost:5000' -d1 -r20 -c20
```

结果:

```markdown
Transactions:                    400 hits
Availability:                 100.00 %
Elapsed time:                  15.40 secs
Data transferred:               0.00 MB
Response time:                  0.01 secs
Transaction rate:              25.97 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                    0.37
Successful transactions:         400
Failed transactions:               0
Longest transaction:            0.05
Shortest transaction:           0.00
```

真令人吃惊，在20个并发的情况下python表现良好，而且响应速度非常快，而且内建的http server比php的要好多了，如果在复杂应用上还能维持这个表现那就太棒了


## Django

操作：
按照django文档上介绍的使用django-admin生成的一个简单站点，懒得改代码，连资源文件也一起返回了

结果:

```markdown
Transactions:                    800 hits
Availability:                 100.00 %
Elapsed time:                  17.95 secs
Data transferred:               6.48 MB
Response time:                  0.05 secs
Transaction rate:              44.57 trans/sec
Throughput:                     0.36 MB/sec
Concurrency:                    2.11
Successful transactions:         800
Failed transactions:               0
Longest transaction:            1.13
Shortest transaction:           0.00
```

就速度来说比flask慢了很多，但是考虑到返回了html,css,js，所以暂且认为速度还是很快的，比开启了ppm的php还要快，python做web还是挺合适的嘛

## express

操作：

按照文档写的一个简单的例子

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
```

结果:

```markdown
Transactions:                    900 hits
Availability:                 100.00 %
Elapsed time:                  21.52 secs
Data transferred:               0.01 MB
Response time:                  0.01 secs
Transaction rate:              41.82 trans/sec
Throughput:                     0.00 MB/sec
Concurrency:                    0.49
Successful transactions:         900
Failed transactions:               0
Longest transaction:            0.08
Shortest transaction:           0.00
```

这个速度也是飞快，和flask有得一拼，node的性能以及抗并发能力都不是吹得，就算加到30x30依旧很稳定，考虑到用typescript写代码的体验，我将非常期待使用typescript+express+nodejs开发服务端应用

## Rocket

既然做了评测就顺带看看我最喜欢的rust web框架性能如何

操作:

执行文档上的hello world例子

结果:

siege不知道为什么跑不出结果，所以用ab的结果替代了，上面的结果都是用siege跑出来的，所以以下的这个结论仅仅是看看而已，不具备参考价值，ab发请求的机制我一直觉得不合理，不像是真实的http请求。

```markdown
Concurrency Level:      30
Time taken for tests:   0.210 seconds
Complete requests:      900
Failed requests:        0
Total transferred:      148500 bytes
HTML transferred:       11700 bytes
Requests per second:    4294.63 [#/sec] (mean)
Time per request:       6.985 [ms] (mean)
Time per request:       0.233 [ms] (mean, across all concurrent requests)
Transfer rate:          692.01 [Kbytes/sec] received
```

单个请求看平均时间是在6.985ms，性能当之无愧最高，但是不知道为啥用siege就是跑不起来

## 结后语

本来还想再压一压ruby on rails的，但是想想又算了，虽然在前几年玩过一会儿ror，但是就现代的web开发来说，ror已经算是落伍了。php做web开发这么受欢迎很大原因应该是开发简单，部署简单导致的，看这个评测就性能来说并没有优势。nodejs的性能也很好，但是在进程管理方面还是比较欠缺，如果长时间运行可能会有内存泄漏，在这个hello world的例子看不出来，但是生产环境应用还是得慎重。python在语言特性，性能方面都很棒，下个框架可以考虑试试。rocket在我看来是未来的框架，把代码编译成可执行文件，不依赖容器就能运行，性能也是非常棒，等对rust更熟悉之后找点简单的项目开始练练手用用
