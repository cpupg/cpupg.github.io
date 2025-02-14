---
title: hello world
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

在创建过程中，gradle会提示选择jdk版本，选择后会在`build.gradle`中添加jdk工具链插件。我们选择`application`类型的项目。

# 打开项目前的准备

## 修改wrapper地址

可以使用腾讯镜像`https://mirrors.tencent.com/gradle/gradle-8.7-all.zip`，注意，一定要使用all，不要使用bin，否则idea会慢速下载all。

如果你在内网且访问不了腾讯镜像，并且你手上有all包，那么你可以在本地起一个服务器，将gradle放在服务器根目录，然后使用`http://localhost:port/gradle-8.7-all.zip`来访问wrapper。

## 去掉工具链和依赖

默认生成的项目在`/settings.gradle`中增加了`foojay`工具链，我们先去掉它：

```groovy
plugins {
    // Apply the foojay-resolver plugin to allow automatic download of JDKs
    id 'org.gradle.toolchains.foojay-resolver-convention' version '0.8.0'
}
```

下面是`app/build.gradle`：

```groovy
plugins {
    // Apply the application plugin to add support for building a CLI application in Java.
    id 'application'
}
repositories {
    // Use Maven Central for resolving dependencies.
    mavenCentral()
}
dependencies {
    // Use JUnit Jupiter for testing.
    testImplementation libs.junit.jupiter
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
    // This dependency is used by the application.
    implementation libs.guava
}
// Apply a specific Java toolchain to ease working on different environments.
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}
application {
    // Define the main class for the application.
    mainClass = 'org.example.App'
}
tasks.named('test') {
    // Use JUnit Platform for unit tests.
    useJUnitPlatform()
}
```

`build.gradle`中有以下内容：

- 插件：应用`application`插件，可以使用`gradle run`来运行。
- 仓库：定义从哪里拉取依赖，需要使用国内镜像。
- 依赖：项目用到的依赖。在默认生成的项目中，依赖通过`gradle/libs.versions.toml`定义，也可以在坐标后加上版本。
- java：配置`JavaPlugin`，使用jdk21编译和执行项目。这部分是为了在不同环境提供相同jdk，学习时可以先删掉。
- application：`application`插件配置，定义了主类。
- 测试任务：定义一个名为`test`的测试任务。

修改后的`build.gradle`如下：

```groovy

plugins {
    // Apply the application plugin to add support for building a CLI application in Java.
    id 'application'
}
repositories {
  maven {
    url 'https://maven.aliyun.com/repository/public/'
  }
  mavenLocal()
  mavenCentral()
}

dependencies {
    // Use JUnit Jupiter for testing.
    testImplementation libs.junit.jupiter
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
    // This dependency is used by the application.
    implementation libs.guava
}

// Apply a specific Java toolchain to ease working on different environments.
application {
    // Define the main class for the application.
    mainClass = 'org.example.App'
}
tasks.named('test') {
    // Use JUnit Platform for unit tests.
    useJUnitPlatform()
}
```

# 运行项目

运行`gradlew build`编译项目，运行`gradlew app:run`运行项目，`gradlew app:test`测试项目：

![alt text](../../../temp/image-1.png)

![alt text](../../../temp/image-2.png)

![alt text](../../../temp/image-3.png)
