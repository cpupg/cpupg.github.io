---
title: 新手上路
---

:::tip

多看官网，作为一个程序员，你都当程序员了，cet4不可能没有过吧？英文文档不可能看不懂吧？

:::

:::info

本笔记的gradle使用kotlin语法，不使用grovvy。

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

# 简介

![gradle-basic-1](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/gradle-basic-1.png)

一个gradle工程包含以下内容：

- 构建脚本`build.gradle.kts`。
- 工程设置（主要设置子模块）`settings.gradle.kts`。
- 包装器wrapper以及版本目录`libs.version.toml`。

当一个工程存在`gradlew.bat`时，这个工程就是一个gradle工程，如果是linux环境，则是`gradlew`。`gradlew`会使用warpper中指定的gradle版本，而不是本地安装的版本。推荐使用wrapper来使用gradle而不是本地版本，除非本地版本和wrapper一样。使用wrapper时，首先会检查是否已下载该版本的gradle，下载目录在量`%GRADLE_USER_HOME%/caches/版本号`下。

`settings.gradle.kts`定义了子项目和根项目，根工程可以是工程目录，也可以是子目录，若工程只有一个项目，则可以不使用`settings.gradle.kts`，否则必须有`settings.gradle.kts`。



当一个项目中存在`gradlew.bat`时，这个项目就是一个gradle工程。`gradlew.bat`是gradle wrapper的启动脚本使用该脚本不会使用本地安装的gradle，而会下载`wrapper/gradle/wrapper-properties`中定义的gradle版本。在gradle中，一个wrapper版本只会下载一次。

gradle使用脚本来定义编译过程，每个过程都可以定义成一个任务。和maven一样，gradle也可以使用插件来增强功能，但是由于gradle中可以写脚本，因此比maven更加灵活，maven要实现增强，即使是简单的重命名jar包，也要写插件。当然，你可以编写打包脚本，在`mvn package`运行完成后手动重命名或执行其他操作。

构建脚本定义了项目或子项目的依赖以及插件，每个插件都定义了多个任务，使用gradle就是执行这些任务，每个任务都可以有任务参数。依赖和插件都可以在`gradle/libs.versions.toml`中定义并在`build.gradle.kts`中引用：

```toml
[versions]
androidGradlePlugin = "7.4.1"
mockito = "2.16.0"

[libraries]
googleMaterial = { group = "com.google.android.material", name = "material", version = "1.1.0-alpha05" }
mockitoCore = { module = "org.mockito:mockito-core", version.ref = "mockito" }

[plugins]
androidApplication = { id = "com.android.application", version.ref = "androidGradlePlugin" }

## [bundles]
## 定义一系列依赖和插件
```

```kotlin
plugins {
   alias(libs.plugins.androidApplication)  
}

dependencies {
    // Dependency on a remote binary to compile and run the code
    implementation(libs.googleMaterial)    

    // Dependency on a remote binary to compile and run the test code
    testImplementation(libs.mockitoCore)   
}
```

引用时要注意，`libs.version.toml`中的下划线在`build.gradle.kts`中要改成点。

