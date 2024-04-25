---
title: 新手上路
---

:::tip

多看官网，作为一个程序员，你都当程序员了，cet4不可能没有过吧？英文文档不可能看不懂吧？

:::

# 认识gradle

gradle牛逼就完事了，什么是gradle，去看官网就行了。

# 使用注意事项

## 尽量使用wapper而不是本地安装的gradle

gradle经常出现新版本不兼容旧版本的情况，不像maven，一个版本用到死，因此建议使用wrapper而不是使用本地安装的版本。其实maven也有wrapper，不过由于maven太稳定，大多数情况下没必要使用maven wrapper。

## 在gradle-wrapper.properties中配置镜像。

可以配置腾讯云镜像，比如https\://mirrors.cloud.tencent.com/gradle/gradle-8.7-bin.zip。

> 截至2024-04-25，idea-2024.1在导入gradle项目时会强制下载gradle源代码，导致导入非常慢。

## 在build.gradle中配置镜像仓库

配置方法：在`build.gradle`中的`repositories`中增加以下代码：

```
maven {
    url 'https://maven.aliyun.com/repository/public/'
}
mavenLocal()
mavenCentral()
```

:::tip

上面的代码只适用于grovvy，不适用于kotlin，如果你使用的是kotlin，需要使用下面的代码：

```
maven {
    setUrl('https://maven.aliyun.com/repository/public/')
}
mavenLocal()
mavenCentral()
```

:::

# 第一个gradle工程

有两个方案来尝试gradle，分别在本地安装gradle和未安装gradle的情况下测试。

## 使用spring initializer

不要勾选任何依赖，打开后直接生成：

![image-20240425021946538](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/202404250219663.png)

然后直接下载到本地，在命令行中运行`gradlew build`就可以编译了。

## 使用本地安装的gradle

安装好gradle后，就可以使用`init`命令来初始化一个gradle项目：

![image-20240425022345642](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/202404250223747.png)

:::tip

`gradle init`不会创建新目录，而是在当前目录下创建工程，即使当前目录不是空目录。

:::

`gradle init`默认生成的工程会指定jdk版本，如果你当前`PATH`中的jdk版本和工程的jdk版本不一致，gradle就会以龟速下载工具链，如果你不需要这个功能，需要删除`build.gradle.kts`中的版本限制：

```kotlin
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}
```

然后删除`settings.gradle.kts`中的工具链插件：

```kotlin
plugins {
    // Apply the foojay-resolver plugin to allow automatic download of JDKs
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.7.0"
}
```

当然还有另一种方法，就是每次执行gradle前手动设置path，你可以写一个bat脚本放到工程目录下：

```bat
set JAVA_HOME=%1
set PATH=%JAVA_HOME%\bin;%PATH%
```

如果你的jdk安装路径包含空格，你需要使用双引号将路径括起来。

:::tip

使用双引号包裹带空格的字符串是一个好习惯。

:::