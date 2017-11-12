---
title: 一个简单的元编程例子
date: "2015-04-17"
layout: post
draft: false
path: "/posts/php-meta-programming/"
category: "PHP"
tags:
  - "PHP"
  - "Programming"
description: "去年在学习ruby的时候就看到了很多元编程的例子，用一个方法来生成多个类似的方法，避免制造重复的代码，ruby用的是method_missing来实现..."
---

去年在学习ruby的时候就看到了很多元编程的例子，用一个方法来生成多个类似的方法，避免制造重复的代码，ruby用的是method_missing来实现的。

今天工作遇到一个小问题，需要写一个简单的脚本来统计某个时间段用户的发帖信息，需求很简单要实现也很简单。最初的设计见下面：

```php
class UpdateUserRank {
public function __construct() {}
public function getDayRank($num) {}
public function getMonthRank($num) {}
public function getAllRank($num) {}

public function setDayRank() {}
public function setMonthRank() {}
public function setAllRank() {}
}
```

需要写3个get方法，3个set方法，这种形式实在是太不方便维护了，每个函数的功能类似，而且函数名也类似，有没有什么办法能够不要写这么多函数呢？利用php的`__call`方法可以很简单的实现

```php
class UpdateUserRank {
public function __construct() {
    $this->getMethods = array('getDayRank', 'getMonthRank', 'getAllRank');
    $this->setMethods = array('setDayRank', 'setMonthRank', 'setAllRank');
}
public function __call($name, $args) {
    if(in_array($name, $this->getMethods)) {
        $num = $args[0];
        return $this->redis->zrevrange($this->_key($name), 0, $num, true);
    } elseif(in_array($name, $this->setMethods)) {
        $nowtime = time();
        if($name == 'setDayRank') {
            $ago = $nowtime - 24 * 3600;
            $key = 'getDayRank';
        } elseif($name == 'setMonthRank') {
            $ago = $nowtime - 24 * 3600 * 30;
            $key = 'getMonthRank';
        } else {
            $ago = 0;
            $key = 'getAllRank';
        }
        $sql = "select authorid, count(authorid) as threadnum from dz_forum_thread where dateline between $ago and $nowtime group by authorid";
        $sth = $this->pdo->prepare($sql);
        $sth->execute();
        while($row = $sth->fetch(PDO::FETCH_ASSOC)) {
            $authorid = $row['authorid'];
            $threadnum = $row['threadnum'];
            $this->redis->zAdd($this->_key($key), $threadnum, $authorid);
        }
    } else {
        echo "不合法的方法: " . $name . "\n";
        exit(1);
    }
}
}
```

调用一个类里面的方法时，如果在当前类没有找到这个方法就会逐层往父类查找，直到找到对应的方法，但是如果这个类或者是父类定义了`__call`方法，则能自动处理找不到的方法，接受2个参数，第一个是函数名，第二个是函数名传过来的参数，是一个数组。基本上可以说`__call`实现了`method not defined`这个异常的处理吧。

因为php的正则没有ruby简单，所以在这里我先定义了2个数组，对象调用的方法必须在这2个数组中才能执行，否则就报不合法的方法，然后退出，也许还可以通过`__get`, `__set`来实现，谁知道呢？
