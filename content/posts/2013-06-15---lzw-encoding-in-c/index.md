---
title: CSDN老博文迁移-用lzw算法编码一个字符串
date: "2013-06-15"
template: post
draft: false
slug: "/posts/lzw-encoding-in-c/"
category: "Programming"
tags:
  - "Programming"
description: "利用LZW算法给一个字符串编码..."
---

原文链接见：[http://blog.csdn.net/zazzle/article/details/9103885](http://blog.csdn.net/zazzle/article/details/9103885)


实验目的：
(1).利用LZW算法给一个字符串编码

实验原理：
(1).构造一个4096个元素的字典数组，前256个初始化为ASCII字符集，即表示单个字符。
(2).逐个读入测试字符串中的字符。
(3).判断这个字符是否在字典中
(4).由于先初始化了前256个元素，所以单个字符肯定是在字典中的。
(5).读入下一个字符，添加到前一个字符后面，判断字符串在不在字典中，如果在不做什么，否则更新字典，从256开始更新。

实验步骤：
(1).初始化字典。
(2).读入字符串并更新字典。
(3).打印出对字符串的编码。

具体实现代码：

```C
  #include <stdio.h>
  #include <string.h>
  #define STR_LEN 100
  #define DIC_LEN 4096

  struct dict {
    char str[STR_LEN];
    int index;
  } Dict[DIC_LEN];

  int j = 256;

  int in_dict(char *s, struct dict *Dict); /* 判断一个字符串s是否在字典中 */
  int index_of(char *s, struct dict *Dict);/* 通过字符串在字典中查找编号 */
  void insert_into_dict(char *s, struct dict *Dict);/*把字符串添加到字典中 */
  void init(struct dict *Dict); /* 初始化字典 */
  void output(int code, char *s);/* 输出编码与相应的字符串 */

  int main(void) {
    int i, code;
    char ch;
    char *str = "hellohellohello";
    char old_string[STR_LEN], new_string[STR_LEN];
    old_string[0] = str[0];
    old_string[1] = '\0';

    init(Dict);

    for (i = 1; str[i] != '\0'; i++) {
      ch = str[i];
      strcpy(new_string, old_string);
      strncat(new_string, &ch, 1);
      if (in_dict(new_string, Dict)) {
        strcpy(old_string, new_string);/* 更新旧字符串 */
      } else {
        code = index_of(old_string, Dict); /* 找到编码 */
        output(code, old_string); /* 输出编码 */
        insert_into_dict(new_string, Dict); /* 更新字典 */
        j++;
        old_string[0] = ch;
        old_string[1] = '\0';
      }
    }
    code = index_of(old_string, Dict);
    output(code, old_string);
    printf("\n");

    return 0;
  }

  int in_dict(char *s, struct dict *Dict) {
    int i;
    for (i = 0; i < DIC_LEN; i++) {
      if (strcmp(s, Dict[i].str) == 0) {
        return 1;
      }
    }
    return 0;
  }

  int index_of(char *s, struct dict *Dict) {
    int i;
    for (i = 0; i < DIC_LEN; i++) {
      if (strcmp(s, Dict[i].str) == 0) {
        return Dict[i].index;
      }
    }
  }

  void insert_into_dict(char *s, struct dict *Dict) {
    Dict[j].index = j;
    strcpy(Dict[j].str, s);
  }

  void init(struct dict *Dict) {
    int i, j;
    for (i = 0; i < DIC_LEN; i++) {
      for (j = 0; j < STR_LEN; j++) {
        Dict[i].str[j] = '\0';
      }
      Dict[i].index = i;
    }
    for (i = 0; i < 256; i++) {
      Dict[i].str[0] = (char) i;
    }
  }

  void output(int code, char *s) {
    printf("%d (%s)\n", code, s);
  }
```

测试字符串是“hellohellohello”
运行结果：
104(h)
101(e)
108(l)
108(l)
111(o)
256(he)
258(ll)
260(oh)
257(el)

用这种方法也能实现文本压缩，只要把字典输出到文件中，再把上述对文本的编码也附加到压缩文件中，解压的时候把编码从字典中对比就能实现解压了。
