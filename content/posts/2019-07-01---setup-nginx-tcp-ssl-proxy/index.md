---
title: 配置nginx tcp ssl负载均衡
template: "post"
date: "2019-07-02 00:02"
draft: false
slug: "/posts/setup-nginx-tcp-ssl-proxy"
category: "Web"
tags:
    - Linux
    - Web
description: "配置nginx tcp ssl负载均衡"
---

## 生成自签发证书

要做ssl代理必须要有证书，很多人会从第三方认证机构购买，有些人会直接使用lets encrypt的免费证书，但因为我们只是服务端通信用，所以不必要使用权威认证机构签发的证书，自己签发一个就行，参考了下面这篇文章生成自签发证书

[https://zonena.me/2016/02/creating-ssl-certificates-in-3-easy-steps/](https://zonena.me/2016/02/creating-ssl-certificates-in-3-easy-steps/)


生成使用ed25519加密算法的证书，第一行生成密钥，第二行生成证书

```shell
openssl ecparam -out /etc/ssl/private/ss1-nginx.key -name prime256v1 -genkey
openssl req -new -days 3650 -nodes -x509 \
    -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" \
    -key /etc/ssl/private/ss1-nginx.key -out /etc/ssl/certs/ss1-nginx.cert
```

## 重新编译nginx

因为要到nginx 1.9之后才开始支持tcp代理，所以如果要用这个功能必须要使用高版本nginx，如果有docker镜像是最好的，没有的话就得自己重新编译，具体编译步骤如下，我用的是archlinux，所以我下了我本地版本的nginx，然后使用了如下的编译选项，`--with-stream`，`--with-stream_ssl_module`这2个选项必须要有

```shell
wget https://nginx.org/download/nginx-1.16.0.tar.gz
tar zxf nginx-1.16.0.tar.gz
cd nginx-1.16.0

./configure \
--sbin-path=/usr/bin/nginx \
--conf-path=/etc/nginx/nginx.conf \
--pid-path=/var/run/nginx.pid \
--with-http_ssl_module \
--with-stream \
--with-stream_ssl_module

make && make install
```

## 配置nginx

总的来说就是2台服务器，前面的这台服务器叫反向代理服务器，后面的这台叫作上游服务器，为了安全起见反代和上游服务器之间的数据报要加密，所以引入一个ssl来给tcp包一层

以下是反代服务器的配置

```nginx
stream {
    upstream backend {
        server 129.181.12.5:92345 weight=1 max_fails=3 fail_timeout=10s;
        server 129.181.12.6:92345 weight=2 max_fails=3 fail_timeout=5s;
    }
    server {
        listen     12345;
        proxy_pass backend;
        proxy_ssl  on;
        proxy_ssl_certificate         /etc/ssl/certs/nginx1.cert;
        proxy_ssl_certificate_key     /etc/ssl/private/nginx1.key;
    }
}
```

配置很显然，指定了证书和密钥的位置，指定了上游服务的ip端口，指定了2个服务的权重，意思就是本机的12345收到请求（非ssl加密），再经过ssl加密后转到后面的2台服务器的92345端口

接下来配置上游服务器，也需要用到nginx，还要用到相同的证书进行解密

```nginx
stream {
    upstream backend {
        server 127.0.0.1:8598;
    }
    server {
        listen 92345 ssl;
        proxy_pass backend;
        ssl_certificate         /etc/ssl/certs/nginx1.cert;
        ssl_certificate_key     /etc/ssl/private/nginx1.key;
    }
}
```

这个配置也很好理解，监听92345端口，并且只接受ssl加密后了连接，收到请求后拿配置在证书和密就进行解密，解密完后把数据转发给后的的8598应用，一加密一解密，中间谁也不知道传了什么数据，除非攻击者厉害到能破解ecc算法，建议走外网的代理都使是ssl加密再传，提高安全性

需要注意这2个stream配置都要放到`nginx.conf`，千万别放到`sites-available`这种地方，不然就会进入到`http`部分
