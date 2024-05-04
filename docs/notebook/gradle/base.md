---
title: gradle速成
---

# 执行流程

和maven一样，用gradle的大概流程如下：

1. 创建项目，创建项目。
2. 引入依赖和插件。
3. 编译。
4. 打包。

gradle也一样。

gradle使用`init`命令来创建一个新项目：

![image-20240425022345642](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/202404250223747.png)

`init`命令支持通过参数传入选项：`gradle init --type java-application --dsl kotlin`。

:::tip

gradle会在当前目录创建项目，并且创建过程中不会检测当前目录是否为空，因此你应该在执行`init`命令前手动创建目录。

:::

创建的新项目结构如下：

```
.
├── .gradle
│   ├── libs.version.toml 统一管理依赖和插件，也可以定义依赖组和插件组
│   └── ⋮
├── gradle
│   └── wrapper 包装器，gradle会使用这里定义的版本。
├── gradlew
├── gradlew.bat
├── settings.gradle.kts 项目结构文件，定义了根工程和子工程
├── app
│   ├── build.gradle.kts 构建脚本，其中可以定义依赖，可以从libs.version.toml引入，也可以直接引入
│   └── src 源代码
```

一个gradle项目包含一个根工程和多个子工程并通过`settings.gradle.kts`关联，每个子工程都有自己的`build.gradle.kts`。根工程可以放在项目根目录，也可以放在自己的目录。

初始化完成后，就可以通过`gradle tasks`来查看可以执行的任务，如果任务名唯一，则可以直接使用任务名，如果不唯一，需要使用`插件名:任务名`的形式来调用，比如`gradlew app:build`。如果纸箱查看指定插件下的任务，可以执行`gradlew 插件名:tasks`，比如`gradlew app:tasks`。

# 任务

使用gradle就是执行任务的过程，就像使用maven需要目标一样：

```cmd
gradle build
mvn compile
```

当前工程里的任务可以使用`gradlew tasks`来查看，如果想查看指定插件下的任务，可以使用`gradlew tasks <插件名>:tasks`，如果想执行指定插件下的任务，可以使用`gradlew <插件名>:任务名`，如果任务名唯一，可以不加。

## 自定义任务

自定义任务需要使用gradle api，例如：

```kotlin
tasks.register<Copy>("copy-github") {
    from("../.github/workflowsbackup/gradle.yml")
    into("src/main/resources")
    include("*.*")
}
```

gradle内置了一系列任务，这段代码就是使用的内置复制任务，任务会将`gradle.yml`复制到资源文件夹，注意任务名不能有空格。

## 任务的前置任务

任务可以有前置依赖，通过`dependsOn`定义：

```kotlin
tasks.register("hello") {
    println("hello,world")
}

tasks.register<Copy>("copy-github") {
    from("../.github/workflowsbackup/gradle.yml")
    into("src/main/resources")
    include("*.*")
    dependsOn("hello")
}
```

在默认情况下，gradle会通过显式依赖和隐式依赖来自行确定任务执行顺序，如果不能决定顺序，会让用户选择顺序。

# 依赖管理

依赖定义在`build.gradle.kts`中：

```kotlin
implementation("com.fasterxml.jackson.core:jackson-annotations:2.17.0")
```

我们也可以将在`libs.version.toml`中集中管理依赖并在`build.gradle.kts`中引入，比如我们想引入jackson，就可以在`libs.version.toml`中增加以下内容：

```kotlin
[version]
jackson = "2.17.0"

[libraries]
jackson-core = { module = "com.fasterxml.jackson.core:jackson-core", version.ref = "jackson"}
jackson-databind = { module = "com.fasterxml.jackson.core:jackson-databind", version.ref = "jackson"}
jackson-annotation = { module = "com.fasterxml.jackson.core:jackson-annotation", version.ref = "jackson"}
```

也可以不使用`version`配置，直接在`libraries`中定义版本，不过推荐统一管理版本号和坐标。

:::tip

toml文件中的横线在`build.gradle.kts`中要替换为`.`，比如`implementation(libs.jackson.core)`

在国内使用gradle，建议设置仓库镜像：

```kotlin
    mavenLocal()
    maven { setUrl("https://maven.aliyun.com/repository/public") }
```

## 依赖传递

大多数引用的jar包自身会引入一些依赖，比如jackson-core的依赖：

```
+--- com.fasterxml.jackson.core:jackson-core:2.17.0
|    \--- com.fasterxml.jackson:jackson-bom:2.17.0
|         +--- com.fasterxml.jackson.core:jackson-annotations:2.17.0 (c)
|         +--- com.fasterxml.jackson.core:jackson-core:2.17.0 (c)
|         \--- com.fasterxml.jackson.core:jackson-databind:2.17.0 (c)

```

在引入jackson-core时也会引入jackson-core依赖树上的所有依赖，除非手动引入依赖树上的某个依赖，此时该依赖被覆盖，但是该依赖的依赖不会被覆盖。

假如jar包a依赖树为a -> b -> c -> d，当我们引入a时会同时引入bcd，如果我们引入a和c，则bd依然会被引入，但c的版本是我们手动引入的版本，而不是a的依赖树上的版本。