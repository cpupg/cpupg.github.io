# 本地部署sonarqube

## 数据库

需要提前安装pgsql并创建专用于sonarqube的数据库和用户，这个用户需要有增删改查权限：

```sql
create user sonar_user;
ROLE sonar_user PASSWORD 'passwd';
```

![alt text](../../../temp/image.png)


然后创建数据库：

```sql
CREATE DATABASE sonar_db OWNER sonar_user;
```
创建模式

```sql
create schema sonar_s;
```

sonar启动后会创建需要的数据库，因此连接用的用户需要能对模式有增删改权限，这也是官网文档里提到的，可以使用如下命令赋权：

```sql
grant create on database sonar_db to sonar_user;
grant usage on schema sonar_s to sonar_user;
```

这里给了全部权限，其实可以只给增删改权限，搞完后设置`search_path`：

```sql
ALTER USER sonar_user SET search_path to sonar_s;
```

默认情况下创建的模式的拥有者是`postgres`，所以需要赋权，可以使用下面的sql在创建模式时指定拥有者：

```sql
create schema sonar_s authorization sonar_user;
```


## elasticsearch

sonarqube内置了es作为搜索引擎，因此运行sonarqube需要满足es的运行要求，包括`vm.max_map_count`参数，es要求这个值不能少于262144，soanrqube最小值是524288。有两种方法修改这个大小，第一种是修改默认配置文件`/etc/sysctl.conf`，第二个是创建单独的配置文件，我用单独配置文件，文件是`/etc/sysctl.d/99-sonarqube.conf`，文件内容如下：

```
vm.max_map_count=524288
fs.file-max=131072
```

然后在文件`/etc/security/limits.d/99-sonarqube.conf`写入以下内容：

```
sonarqube   -   nofile   131072
sonarqube   -   nproc    8192
```

这一步中，文件路径和文件内容中的sonarqube要替换为运行soanrqube的用户名。

## 启动

在官网下载zip安装，注意，10.8版本开始支持pg16，如果sonar低于10.8，就只能用pg15。，这是我的软件目录。

启动前要修改配置文件中的数据库连接，文件是安装目录下的`conf/sonar.properties`：

然后运行`bin`目录下的`sonar.sh`就可以启动，注意需要加`start`参数，然后打开`localhost:9000`就能进入管理页面，默认口令是`admin/admin`。
