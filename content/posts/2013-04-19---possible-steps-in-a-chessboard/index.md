---
title: CSDN老博文迁移-棋盘中走n步的所有可能走法
date: "2013-04-19"
template: post
draft: false
slug: "/posts/possible-steps-in-a-chessboard/"
category: "Programming"
tags:
  - "Programming"
description: "棋盘中走n步的所有可能走法..."
---

原文链接见：[http://blog.csdn.net/zazzle/article/details/8825150](http://blog.csdn.net/zazzle/article/details/8825150)

问题，求下列递推式值：
= 3*-2*+2,
a1=3,a2=7,a3=17,a4=41, 求


来源：
a1 = 3, a2 = 7, a3 = 17, a4 = 41, a5 =99


b1 = 1, b2 = 2, b3 = 5, b4 = 12, b5 =29


更深的来源：走棋盘问题，一个无限大的棋盘上有人在走路，可以往3个方向走，上，左，右。
向前走之后原来那个格子就不能走了，问如果走n步有几种可能的走法。


我的思路是按照排列组合的方法来数情况，如果可能就列出递归式来。
第一步如果是上，第二步有3种走法。
第一步如果是左或者右，第二步有2种走法。
...

到最后肯定能列举出走n步的可能数，但是不可能单纯的数数，可以利用数列的思想来做。
设走n步有an种可能，an由3部分组成，b1,n b2,n b3,n
an = b1,n + b2,n + b3,n ，其中b2,n= b3,n

这样下去就能得到递归式了。

其中是an的前n-3项和，到此递归式出来了，可以编程求解了。

因为a1= 3, a2 = 7, a3 = 17, a4 = 41, a5 = 99 …

下面开始写程序：

```C
  /*
   * count the probable outcome for nstep in a matrix
   * algorithms: an = 3*a(n-1)-2*S(n-3)-4
   * a1 = 3, a2 = 7, a3 = 17,a4 = 41, a5 = 99
   */
  #include <stdio.h>
  #define MAX 100

  int main(void) {
    long long int a[MAX] = {3, 7, 17, 41,99}, S;
    int i, n;
    printf("input the steps n:");
    scanf("%d", &n);
    S = a[0];

    for (i = 4; i < n; i++) {
      S += a[i-3];
      a[i] = 3*a[i-1] -2*S - 4;
    }
    printf("n = %d, methods =%lld\n", n, a[i-1]);
    return 0;
  }
```

结果：n= 5, 99 methods
n = 6, 239 methods

算小数据还可以，就是说n< 40以下可以算，超过40连longlong int都溢出，日子真是没法过了，增长的怎么会这么快啊。
大数据运算真是重头戏啊。
