---
title: 使用尺取法计算数组中最短连续子数组之和大于某个指定的数
date: "2017-11-24 01:16:00"
template: post
draft: false
slug: "/posts/shortest-seq-sum-greater-than-target/"
category: "Algorithms"
tags:
  - "Algorithms"
  - "Programming"
  - "Rust"
description: "使用尺取法计算数组中最短连续子数组之和大于某个指定的数"
---

## 问题描述
给定一个纯数字的数组，以及一个数字，从这个数组中找到一个连续子数组满足连续子数组之和大于或等于这个给定的数字且这个连续子数组的长度最短

## 问题分析
已知这个问题最快的解法就是尺取法，所谓尺取就是指先移动右侧索引，找到一个最长的连续子数组，再不断调整左侧索引，找到一个最短的窗口

## 代码示例
```rust
fn shortest_seq(arr: Vec<usize>, target: usize) -> (usize, usize, usize) {
    let mut sum = 0;
    let mut start = 0;
    let mut end = 0;
    let len = arr.len();
    let mut ans = len + 1;

    loop {
        while sum < target && end < len { // 移动右侧索引，找到一个最长的窗口
            sum += arr[end];
            end += 1;
        }
        if sum < target { // 右侧索引移动到头了但是子数组之和还是更小，说明没有找到这样的子数组，要跳出循环
            break;
        }
        ans = min(ans, end - start); // 比较2次窗口哪个最短
        sum -= arr[start]; // 更新子数组之和
        start += 1; // 移动左侧索引
    }
    if ans > len { // 没找到这样的子数组
        return (0, 0, 0);
    }
    return (ans, start-1, end-1);
}
```

如果以前没接触过这类问题，第一次做是比较难想到这个解法，不过看过分析之后感觉还是比较简单的。我把具体代码以及单测用例都传到[github](https://github.com/xcaptain/rust-algorithms/blob/master/src/iters/shortest_seq.rs)
