---
title: postgresql运维
template: post
draft: false
date: "2018-10-31"
slug: "/posts/postgresql-devops/"
category: "Web"
tags:
  - "Web"
---

在实际业务中遇到很多 mysql 不适用的场景，在初步使用了 postgresql 之后发现这个数据库功能非常强大，比 mysql 好多了，以后的业务都优先选择这个数据库，以下是一些服务器配置及日常开发中的经验

## 服务器配置(ubuntu 18.04)

1.  安装 postgresql，截止目前的稳定版是 11

    `apt install postgresql`

2.  安装 postgresql 客户端，装完就能使用 psql 命令了

    `apt install postgresql-client`

3.  确认 postgresql 服务器运行着

    `ps aux | grep postgres` 或者 `ss -naltp | grep 5432`

安装完成之后就可以通过 psql 连接服务器了，但是现在还只能用`postgres`这个用户。`sudo -u postgres -i` 切换用户，然后`psql`就进入 shell 界面了，这个是最高权限的用户，一般不使用在应用中，如果要连接 web 应用需要创建一个普通权限的用户。

## 数据库用户管理

使用 postgres 账户进入 psql 界面创建用户：

1.  创建用户

    `CREATE USER myappuser WITH PASSWORD 'somepassword';`

2.  给用户授权

    嫌麻烦可以直接授予超级用户权限，如果不嫌麻烦就按照文档一个一个配置权限。 `ALTER ROLE myappuser WITH SUPERUSER;`

3.  创建数据库

    `create database demodb`

用户管理其实比较重要，有时候我们想创建只读账号给一些业务使用，创建步骤如下：

```sql
CREATE USER readonly WITH ENCRYPTED PASSWORD 'readonly';
GRANT USAGE ON SCHEMA public to readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly;

GRANT CONNECT ON DATABASE foo to readonly;
\c foo
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly;
GRANT USAGE ON SCHEMA public to readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
```

还有一种方法是创建一个只读的角色，然后把用户添加到这个角色中

## 触发器

postgresql功能很强大，可以自定义很多函数，比如说存一棵树到表里可以使用ltree扩展

```sql
CREATE OR REPLACE FUNCTION update_parent_path() RETURNS TRIGGER AS $$
    DECLARE
        path ltree;
    BEGIN
        IF NEW.parent_id IS NULL OR NEW.parent_id = 0 THEN
            NEW.parent_path = 'root'::ltree;
        ELSEIF TG_OP = 'INSERT' OR OLD.parent_id IS NULL OR OLD.parent_id != NEW.parent_id THEN
            EXECUTE FORMAT('SELECT parent_path || id::text FROM %I WHERE id = $1', TG_TABLE_NAME) using NEW.parent_id INTO PATH;
            IF path IS NULL THEN
                RAISE EXCEPTION 'Invalid parent_id %', NEW.parent_id;
            END IF;
            NEW.parent_path = path;
        END IF;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;
```

上面这个`update_parent_path`函数返回了一个触发器，可以附加到一个表上，这样可以实现递归插入查询

但是有些地方就没那么方便了，比如说对比`on update CURRENT_TIMESTAMP`，必须再创建一个触发器

```sql
CREATE OR REPLACE FUNCTION update_changetimestamp_column() RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
$$ language plpgsql;
```

## 条件分组

在group by语句中如果还要继续分组，可以用filter语句，以下建了一个简单的例子用来说明按comment_id分组，然后通过dir来过滤的用法，一条语句就能查出某个评论点赞点踩的数量

```sql
create table test (
    user_id int,
    comment_id int,
    dir int
);

insert into test(user_id, comment_id, dir) values (1, 1, 1);
insert into test(user_id, comment_id, dir) values (1, 2, -1);
insert into test(user_id, comment_id, dir) values (1, 3, 1);
insert into test(user_id, comment_id, dir) values (1, 4, 1);
insert into test(user_id, comment_id, dir) values (2, 1, 1);
insert into test(user_id, comment_id, dir) values (2, 2, 1);
insert into test(user_id, comment_id, dir) values (2, 3, 1);
insert into test(user_id, comment_id, dir) values (2, 4, -1);
insert into test(user_id, comment_id, dir) values (3, 4, 1);
insert into test(user_id, comment_id, dir) values (3, 3, 0);
insert into test(user_id, comment_id, dir) values (4, 1, 0);

select * from test where comment_id in (1,2);
select comment_id, count(comment_id) filter (where dir=1) as up_votes, count(comment_id) filter (where dir=-1) as down_votes from test where comment_id in (1,2) group by comment_id;

```

## daterange type

在做一些对账结算业务的时候会遇到有些汇率在一段时间内对应一部分数据，这种场景用标准的数据结构很难表示，但是postgres的daterange数据类型很好的解决了这个问题，具体用法参见[https://tapoueh.org/blog/2018/04/postgresql-data-types-ranges/](https://tapoueh.org/blog/2018/04/postgresql-data-types-ranges/)，目前在我的业务中涉及到和合作厂商分账，不同厂商不同时间分成比例不同，使用这个类型又好又快的解决了我的问题

## with 语句

Postgres和sql server都支持with 语句，即可以把一条sql查询的结果临时保存起来，这样做的好处是在编写复杂的sql的时候不需要写很多复杂的嵌套，类似于把sql平铺了，分享一条很巧妙的计算留存的sql，用到了with

```sql
 with user_register as
    (select t2.user_id as user_id,
            t2.dt as register_day
     from
         (select user_id,
                 min(date(created_at)) as dt
          from user_login_logs
          group by user_id) as t2
     group by t2.user_id,
              t2.dt),
      user_cohort as
    (select l.user_id,
            r.register_day,
            EXTRACT(DAY
                    FROM l.created_at - r.register_day::date) as cohort_day
     from user_login_logs as l
     left join user_register as r on l.user_id=r.user_id
     group by l.user_id,
              r.register_day,
              cohort_day)
select register_day,
       cohort_day::int,
       count(distinct user_id) as user_num
from user_cohort
where cohort_day >= 0
group by register_day,
         cohort_day;
```

## docker 化

待定

## 版本升级

目前我们用的版本是10，打算直接上12，到时候补上升级经验

## 主从同步

待定

## 配置

在这里要注意postgresql支持本地linux内核授权和自己数据库内授权，按照`/etc/postgresql/10/main/pg_hba.conf` 中的配置

```text
# Database administrative login by Unix domain socket
local   all             postgres                                peer

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 md5
```

如果使用localhost连接是通过内核校验，所以有时候会出现`peer校验失败`，可以考虑使用网络连接，即换成`127.0.0.1`，这样就会使用postgresql内建的用户系统，当然也可以改这个配置文件然后重启服务，但是不建议这么做
