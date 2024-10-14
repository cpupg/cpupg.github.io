---
title: gradle速成
---

# 创建项目

创建项目有两种方式，一种是通过idea创建，一种是通过命令行`gradle init`任务创建，我习惯使用命令行。创建完成后建议先修改wrapper的url为`https\://mirrors.tencent.com/gradle/gradle-版本号-all.zip`。这里不建议使用bin包，建议使用all包，如果使用bin包，导入idea时会龟速下载all包。

> 解决wrapper下载慢的问题
> 有三种方案：
>
> 1. 使用代理。
> 2. 使用镜像，比如腾讯镜像。
> 3. 在本地搭建建议服务器，可以使用iis，也可以使用tomcat，启动后将文件放进去然后修改wrapper里的url即可，本质也是镜像。

> 注意事项
> 本文档使用的gradle版本是8.7。


## 项目结构

使用命令行创建项目时，会提示选择项目结构：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/20241009223331.png)

- application：开发Java应用，包含`main`方法和`application`插件，可以使用`gradle app:run`来执行`main`方法。默认情况下生成的模块目录是app，因此可以使用`gradle app:run`来运行。
- library：开发第三方库，会引入`java-library`插件。
- gradle plugin: gradle插件。我没用过，所以略过。
- basic：只包含一个`build.gradle`和`settings.gradle`，还有wrapper。

在创建过程中，gradle会提示选择jdk版本，选择后会在`build.gradle`中添加jdk工具链插件。

## 定义wrapper镜像

可以使用腾讯镜像`https://mirrors.tencent.com/gradle/gradle-8.7-all.zip`，注意，一定要使用all，不要使用bin，否则idea会慢速下载all。

如果你在内网且访问不了腾讯镜像，并且你手上有all包，那么你可以在本地起一个服务器，将gradle放在服务器根目录，然后使用`http://localhost:port/gradle-8.7-all.zip`来访问wrapper。