# 设置桥接网络

设置桥接网络要启用hyper-v，如果与vmware不兼容，可以搜索相关解决方案。

在hyper-v中新建虚拟交换机：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-15.png)

创建完成后需要修改wsl全局配置，目录是`<用户目录>/.wslconfig`，默认情况下没有这个文件，将文件改为以下内容：

```ini
[wsl2]
networkingMode=bridged
vmSwitch=localswitch
ipv6=true
dhcp=true
```

第二行的值就是hyper-v中的虚拟交换机名称。设置完此项后，关闭wsl然后重新启动，再打开网络就是路由器自动分配的网络，很显然，如果路由器重启，这个IP就会变，因此还需要设置固定IP。

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/image-16.png)
