---
title: 使用rust创建websocket服务器
date: "2017-08-15"
layout: post
draft: false
path: "/posts/rust-websocket-server/"
category: "Rust"
tags:
  - "Rust"
  - "Programming"
description: "使用rust做websocket服务器，websocket协议的标准规范，用途等"
---

最近需要做实时推送相关的应用，所以继续调研了一下websocket，在15年底的时候曾经使用过 [Gru](https://github.com/sumory/gru) 来做聊天推送，
但是那时候没仔细研究过websocket的细节。现在趁机自己构思一下

## 使用 [ws-rs](https://github.com/housleyjk/ws-rs) 构建websocket服务端
按照 [Guide](https://ws-rs.org/guide) 搭建服务端应用，代码见下：
```bash
cargo new ws-server1 --bin
```

```rust
extern crate ws;

use ws::listen;

fn main() {
    listen("127.0.0.1:3012", |out| {
        move |msg| {
            println!("received msg: {}", msg);
            out.broadcast(msg)
        }
    }).unwrap()
}
```

`cargo run` 运行服务端

## 服务端推送
往socket里面推送消息，代码见下：
```bash
cargo new ws-client1 --bin
```

```rust
extern crate ws;

use ws::{connect, CloseCode};

fn main() {
    connect("ws://127.0.0.1:3012", |out| {
        out.send("Hello WebSocket").unwrap();

        move |msg| {
            println!("Got message: {}", msg);
            out.close(CloseCode::Normal)
        }
    }).unwrap()
}
```

运行 `cargo run`，这时候会看到服务端输出`received msg: Hello WebSocket`，客户端输出`Got message: Hello WebSocket`

## 客户端连接
创建2个websocket客户端连接，打开2个chrome标签，分别在终端执行
```rust
ws = new WebSocket('ws://127.0.0.1:3012'); // 创建连接
ws.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
}); // 监听服务端

ws.send('from browser'); // 可以在2个console中互相发消息玩
```

能发现websocket会自动检测连接，如果连接断开会提示 =WebSocket is already in CLOSING or CLOSED state.= 这也省去了手动发送心跳包
检测连接的麻烦
