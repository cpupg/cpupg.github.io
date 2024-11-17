# 使用独立账户在挂载盘中安装pg数据库

> 建议使用默认安装目录，可以下载deb也可以直接使用`apt`安装。使用`dpkg`定义了`--instdir`后会报错没有找到依赖。

首先要创建一个新账号，官网建议是使用单独账号来运行pg，并且这个运行pg的账号不能是pg程序文件的拥有者，这可以防止该用户修改pg文件。在这里我们创建两个账号，一个是`pgadm`，一个是`pguser`，前一个用户用来修改pg，后一个程序用来运行数据库，显然安装成功后`pgadm`拥有数据库程序的修改权限，`pguser`只有运行权限。为了方便管理，还需要创建一个用户组`pguser`，在这个组内的用户都可以执行pg下的文件。

## 权限分类

创建用户组`app`，这个组拥有`app`目录和`appdata`目录的读写权限。创建用户组`appadmin`，这个组只有`app`的执行权限和`appdata`的读写权限。为了方便管理权限，通过`useradd`同时创建用户和组，并且设置用户为不可登录。

<!-- 删除 -->
<!-- ![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/20241114231442.png) -->

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/20241114232947.png)



<!-- 需要删除文件 -->
<!-- ![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/20241114223832.png) -->

创建用户`pguser`和`pgadm`，并将`pgadmin`加入`app`组，`pguser`加入`appuser`组。此外，`pguser`和`pgadm`用户不可登录。

## 挂载目录

挂载过程省略，我的硬盘挂载在`/home/data`下，默认挂载用户和组都是`root`，我按照我的习惯，在这个目录下创建3个目录：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/20241114220013.png)

第一个目录用来安装软件，第二个用来保存软件数据，第三个用来当新用户的`home`目录。`main`用户是我创建的管理员用户，平时运维都登录`main`，除了此用户，其他用户都不能使用`sudo`命令。在挂载并创建目录后，将三个目录的用户和组改为`main`。

## 下载安装包

我打算不用`apt`命令，而是直接用`dpkg`命令，因此首先需要下载安装包。使用`apt`安装时会自动下载相关依赖，如果下载安装包后发现缺少依赖就会提示缺少依赖，下图是我安装时缺少的依赖：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-2.png)

可以使用`apt show <package>`来查看详情：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-3.png)

`apt show`可以展示这个包是作为依赖的包还是可以直接运行的包，如果是做依赖的包，可以直接安装。装完这些依赖后，运行`apt show postgresql-16`来查看需要的依赖，下载postgresql-client-common，postgresql-common和postgresql-client-16这三个包：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-4.png)

安装时注意，这三个包是有依赖关系的，client-common需要第一个安装，然后安装client-16和common。
