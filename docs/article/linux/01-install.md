# 无网络环境启动ubuntu

ubuntu启动会等待网络配置，如果没有配置网络，就会提示`A start job is running for wait for network to be Configured`，直到网络配置好才会启动。解决方案：打开`/etc/systemd/system/network-online.targets.wants/systemd-networkd-wait-online.service`，找到`[Service]`，加入`TimeoutStartSec=1sec`即可。超时配置多久看你需求，我不想等，所以配置1s。

# 配置固定IP

编辑`/etc/netplan/00-installer-config.yaml`：

```yml
network:
  ethernets:
    ens33:
      addresses:
        - 192.168.1.23/24
      nameservers:
        addresses:
        - 223.4.4.4
        - 223.5.5.5
        search: []
      routes:
      - to: default
        via: 192.168.1.1
  version: 2
```


![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/20241114231038.png)

# 修改时区

官网下载的安装镜像安装后默认时区是0，需要改为+8，方式是调用`timedatectl`命令，中国有5个时区，分别是Asia/Chongqing、Asia/Shanghai、Asia/Urumqi（乌鲁木齐）、Asia/Macao（澳门）、Asia/Hong_Kong、Asia/Taipei，这里选择上海：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/20241114225534.png)

默认情况下，时间同步服务是打开的：

![](https://picture-home.obs.cn-south-1.myhuaweicloud.com/markdown-picture/20241114230912.png)。
