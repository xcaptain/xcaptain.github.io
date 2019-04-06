---
title: php猴子补丁
date: "2016-09-30"
template: post
draft: false
slug: "/posts/php-monkey-patch/"
category: "PHP"
tags:
  - "PHP"
  - "Programming"
description: "php中使用monkey patch以及在ruby和python中是如何做的"
---

ruby和python都有[monkey patch](https://en.wikipedia.org/wiki/Monkey_patch)，也就是可以在运行时修改某个对象或类的方法

在过去php是没有这种特性的，如果要给一个对象添加方法只有继承

```php
<?php

class A
{
    public function foo()
    {
        return 'foo';
    }
}
$obj = new A();
```

如果在某个情况下，我们要给`$obj`对象添加一个方法，这时候该怎么办呢？

```php
<?php

class B extends A
{
    public function bar()
    {
        return 'bar';
    }
}
$obj = new B();
```

这样obj对象就有了`bar`方法，但是这种办法很傻，得新建一个子类，而且这个子类可能很难被用上，如果在另外的情况下要用到另一个新的方法`bar2`，这时候又该怎么办呢，是再写一个继承？继承A还是B呢？

php7提供了一个新的语法叫做[匿名类](http://php.net/manual/en/language.oop5.anonymous.php) 在上面的例子中，要给类A的实例添加方法就不需要新建一个类文件然后去继承，直接
```php
<?php

$obj = new class extends A
{
    public function bar()
    {
        return 'bar';
    }
};
```
这样obj也有`bar`方法，但是却没有创建额外的类文件，毕竟目的只是作为临时补丁修复一下，如果能够确定这个方法会被很多地方用到，那么就得考虑是否把这个方法添加到基类中，还是放到单独的子类。

在测试中这特性非常有用，测试`protected`方法，构造`mock`对象而不用改原有代码，第一次在真实场景中见到是在[activity-log](https://github.com/spatie/laravel-activitylog)这个项目中[https://github.com/spatie/laravel-activitylog/blob/master/tests/DetectsChangesTest.php](https://github.com/spatie/laravel-activitylog/blob/master/tests/DetectsChangesTest.php)这里就构造了仅仅用于测试的model对象而没有改写原有的model
