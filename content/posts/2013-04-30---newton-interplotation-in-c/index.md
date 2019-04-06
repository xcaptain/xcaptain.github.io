---
title: CSDN老博文迁移-牛顿插值法的C语言实现
date: "2013-04-30"
template: post
draft: false
slug: "/posts/newton-interplotation-in-c/"
category: "Programming"
tags:
  - "Programming"
description: "老师让我们写一个牛顿插值公式的程序，要满足如下要求..."
---

原文链接见：[http://blog.csdn.net/zazzle/article/details/8870810](http://blog.csdn.net/zazzle/article/details/8870810)

```C
  #include <stdio.h>

  #define N 100
  double diff_quot(double *x, double *y, int start, int end);
  double compute_y(double *x, double *y, double *t, int len, double xx);
  int main(void) {
    double x[N], y[N], t[N], xx, yy, mul = 1.0;
    int i, j, n, start, len, ch;
    char chh;

    len = 0; //len 保存了数组x和y的长度
    start = 0; //start是每一次循环之后添加元素的起始位置

    while (1) {
      printf("输入要添加的点数: ");
      scanf("%d", &n);
      len += n;

      //输入数组x和y
      printf("输入x: ");
      for (i = start; i < start + n; i++) {
        scanf("%lf", &x[i]);
      }
      printf("输入y: ");
      for (i = start; i < start + n; i++) {
        scanf("%lf", &y[i]);
      }
      start += n; //不断跟新start的位置

      //开始求各阶差商了
      for (i = 0; i < len; i++) {
        t[i] = diff_quot(x, y, 0, i);
      }
      printf("\n");
      //打印各阶差商
      for (i = 0; i < len; i++) {
        printf("%12.5lf ", t[i]);

      }
      printf("\n");

      //计算插入点的函数值
    again:
      printf("输入要计算的x值: ");
      scanf("%lf", &xx);

      yy = compute_y(x, y, t, len, xx);
      printf("\nxx对应的值是 %lf: \n", yy);

      printf("继续求值吗1继续2停止？\n");
      scanf("%d", &ch);
      if (ch == 1) {
        goto again;
      }

      //小技巧来了，输入一个数字来判断是否继续输入
      printf("继续添加点吗? 1 for yes and 2 for no\n");
      scanf("%d", &ch);
      if (ch == 1) {
        continue;
      } else if (ch == 2) {
        break;
      }

    }
    system("pause");
    return 0;
  }

  double diff_quot(double *x, double *y, int start, int end) {
    if (start == end) {
      return y[start];
    } else {
      return ( (diff_quot(x, y, start, end-1) - diff_quot(x, y, start+1, end)) / (x[start] - x[end]) );
    }
  }

  double compute_y(double *x, double *y, double *t, int len, double xx) {
    double ret = t[0];
    double mul = 1.0;
    int i;
    for (i = 1; i < len; i++) {
      mul *= (xx - x[i-1]);
      ret += t[i] * mul;
    }
    return ret;
  }
```

《数值逼近》老师让我们写一个牛顿插值公式的程序，要满足如下要求：1. 输入一串点，能输出它们的各阶差商。2. 输入一个x值，通过插值函数能计算出它对应的y值。3.提示是否要继续加点，因为牛顿插值比起拉格朗日插值的最大优点就是新增加点不需要重新计算前面点的差商。4. 添加点之后继续回到第二步，重复。对程序要求的分析：1.有2个子函数要写，一个是求差商的，暂且叫作diff_quot吧，另一个是计算函数值的，把它叫作compute_y吧。2.之后还有一个小技巧要实现，就是实现一些交互功能，能判断是否要继续输入，继续输入之后还要继续计算。这里可以使用while(1) 结合break& continue来实现。
diff_quot这个函数是用来求牛顿插值的插值多项式系数的，用的是递归的方法实现，也可以用循环迭代来实现，但是这样就要写更多代码了，递归的话8行搞定。简洁又明了。
如果要迭代的话就要不断更新牛顿差商表，不断更新那个下三角矩阵。

compute_y是用来求已知插值多项式系数的情况下给定一个x的y值的函数，比较简单，就是简单的累加累乘。
博客难写啊，连个代码怎么放上去都不熟悉，郁闷。
