# 安装和使用pgsql

## 安装

使用`apt`命令即可安装，安装前要设置pg的镜像仓库，这个仓库只用来下载pg，下面是使用华为云镜像的示例:

```bash
sudo sh -c 'echo  "deb https://mirrors.huaweicloud.com/postgresql/repos/apt $(lsb_release -cs)-pgdg main " > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://mirrors.huaweicloud.com/postgresql/repos/apt/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install postgresql-16
```

截至发稿，阿里云和腾讯云只能设置`yum`仓库，华为云可以切`yum`和`apt`。

使用`apt`安装pg后，会将pg加入开机启动:

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-5.png)

此外还会创建一个用户和组:

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-6.png)

## 初始化

安装pg后还不能立即使用，还需要使用`createdb`命令创建数据库:

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-8.png)

为了方便日后管理，在运行这个命令以前你需要考虑以下内容，并且在运行前就已经有答案:

- 你要将数据库文件放在哪里，默认`/var/lib/postgresql/16/main`。
- 数据库文件要不要放在nas上。
- 表空间如何规划。
- 编码使用什么内容。
- 排序时按拼音排序。

下面目录是pg安装后的默认目录，可以在`/etc/postgresql/16/main/postgres.conf`中查看：

- 安装目录: `/usr/lib/postgresql/16`
- 配置文件: `/etc/postgresql/16/main`
- 数据目录: `/var/lib/postgresql/16/main`
- 帮助文件和示例配置: `/usr/share/postgresql/16`

为了按拼音排序中文，需要设置本地化，不加参数的情况下使用系统本地化设置。本地化也有几个参数:

- LC_COLLATE: 排序方式。
- LC_CTYPE: 字母分类，影响大小写和`initcap`方法。
- LC_MESSAGES: 通知使用什么语言
- LC_MONETARY: 货币格式
- LC_NUMERIC: 数字格式
- LC_TIME: 日期格式

本地化会影响以下内容：

- 排序`order by`。
- 大小写`upper`，`lower`，`initcap`。
- 搜索类操作`like`,`similar to`。
- 字符串转换类的函数`to_char`。

修改区域设置会降低字符处理性能，并且会阻止`like`使用普通索引，因此建议只有实际需要时才设置区域。

除了本地化，还有一个排序设置。区域设置在创建数据库后就不能更改，但是排序规则可以修改，并且可以为每个字段和每个操作单独设置排序规则。


## 启动

pg支持两种方式启动，一种是`postgres`命令，一种是`pg_ctl`命令，`pg_ctl`还支持停止和重启，`postgres`可以通过`-T`参数传入信号来重启：

```bash
# 启动
/usr/lib/postgresql/16/bin/postgres -D /var/lib/postgresql/16/main -c config_file=/etc/postgresql/16/main/postgresql.conf -c hba_file=/etc/postgresql/16/main/pg_hba.conf -c ident_file=/etc/postgresql/16/main/pg_ident.conf
```

```bash
/usr/lib/postgresql/16/bin/pg_ctl start -l /etc/postgresql/16/main/logs/pg.log -D /var/lib/postgresql/16/main -o "-c config_file=/etc/postgresql/16/main/postgresql.conf" -o "-c hba_file=/etc/postgresql/16/main/pg_hba.conf" -o "-c ident_file=/etc/postgresql/16/main/pg_ident.conf"
/usr/lib/postgresql/16/bin/pg_ctl stop -l /etc/postgresql/16/main/logs/pg.log -D /var/lib/postgresql/16/main -o "-c config_file=/etc/postgresql/16/main/postgresql.conf" -o "-c hba_file=/etc/postgresql/16/main/pg_hba.conf" -o "-c ident_file=/etc/postgresql/16/main/pg_ident.conf"
/usr/lib/postgresql/16/bin/pg_ctl restart -D /var/lib/postgresql/16/main -o "-c config_file=/etc/postgresql/16/main/postgresql.conf" -o "-c hba_file=/etc/postgresql/16/main/pg_hba.conf" -o "-c ident_file=/etc/postgresql/16/main/pg_ident.conf"
```

在命令行运行：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-9.png)


## 修改认证方式和防火墙

默认情况下pg只允许当前机器连接，因此需要修改配置来让其他机器也可以连接，通常是使用网段配置，配置文件是`pg_hba.conf`，将ipv4 local connections改为下面的内容：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-11.png)

之后修改防火墙，放行端口，下图是允许局域网访问5432端口，注意使用ufw前首先要启用ufw，命令是`ufw enable`。

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-12.png)

此外还要修改`postgresql.conf`中的监听地址：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-14.png)

监听地址有以下特殊格式：

- `*`：监听所有IP。
- `0.0.0.0`: 监听所有ipv4地址。
- `::`: 监听所有ipv6地址。

监听地址用逗号分隔，如果不配置或者配置为空，则只允许本地连接，不允许其他机器连接。

在datagrip中连接成功：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-13.png)

如果报错`User "postgres" has no password assigned.`，需要在psql中设置密码：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-1.png)

## 问题记录

### 服务报错

将上面的启动命令写入`postgresql.service`时，服务会报错

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-10.png)

此时pg已经跑起来了，但是不知道为什么服务会说已经存在pid xxx，也就是说pg启动了两次。我暂时还没有找到解决方案，因此写了启动脚本来手动启动。


### 防火墙语法

可以使用`ufw allow 5432`来放行所有通过5432端口的连接，我只放行了局域网内的连接。
