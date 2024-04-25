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

# 概念

![gradle-basic-1](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/gradle-basic-1.png)

当一个项目中存在`gradlew.bat`时，这个项目就是一个gradle工程。`gradlew.bat`是gradle wrapper的启动脚本使用该脚本不会使用本地安装的gradle，而会下载`wrapper/gradle/wrapper-properties`中定义的gradle版本。在gradle中，一个wrapper版本只会下载一次。

gradle使用脚本来定义编译过程，每个过程都可以定义成一个任务。和maven一样，gradle也可以使用插件来增强功能，但是由于gradle中可以写脚本，因此比maven更加灵活，maven要实现增强，即使是简单的重命名jar包，也要写插件。当然，你可以编写打包脚本，在`mvn package`运行完成后手动重命名或执行其他操作。

## 项目结构

gradle可以是但项目也可以是单项目。使用`gradle init`可以创建多项目也可以创建单项目，之前的例子中创建的是多项目。当使用多项目时，`settings.gradle.kts`定义了子项目，否则`settings.gradle.kts`不是必须的。

```kotlin
rootProject.name = "root-project"  // 定义根目录

include("sub-project-a")  // 子项目
include("sub-project-b")  // 子项目
include("sub-project-c")  // 子项目
```

## 构建脚本

`build.gradle.kts`是构建脚本，定义了项目依赖、插件、仓库以及编译和打包过程，以及一些自定义任务，这些任务可以通过`gradle 任务名称`来执行。一次可以执行多个任务，每个任务都可以跟任务参数。

可以在`build.gradle.kts`中定义依赖，并在`gradle/wrapper/libs.versions.toml`中定义依赖和插件的版本，相当于maven中的`depencediesManagment`：

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

注意，`libs.version.toml`中只是定义了依赖和插件，但是并不能直接使用，还需要在`build.gradle.kts`中引用：

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

使用`libs.version.toml`可以统一管理插件、依赖以及相关的版本，你可以使用`gradlew :app:dependencies `命令来查看依赖树。

## 任务

gradle中的任务是一个独立的流程，可以是单独流程，也可以是组合流程，可以使用`gradle tasks`来查看当前项目可以使用的任务。执行任务时，可以直接使用任务名称执行，也可以使用`gradle 插件:任务名`执行。插件前面可以加分号也可以不加。

## 插件

插件有三种，一种是核心插件，一种是社区插件，一种是自己开发的定制化插件。自己开发的插件发布到社区后就成为了社区插件。