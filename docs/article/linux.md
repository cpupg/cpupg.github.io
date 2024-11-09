# 无网络环境启动ubuntu

ubuntu启动会等待网络配置，如果没有配置网络，就会提示`A start job is running for wait for network to be Configured`，直到网络配置好才会启动。解决方案：打开`/etc/systemd/system/network-online.targets.wants/systemd-networkd-wait-online.service`，找到`[Service]`，加入`TimeoutStartSec=1sec`即可。超时配置多久看你需求，我不想等，所以配置1s。
