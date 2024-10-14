---
title: firefox问题记录
---

# 禁用跨域

B站静态文件都放在hdlsb.com域名下，这个域名在火狐里经常无法访问，原因就是跨域问题，可以到浏览器设置`about:config`里将`Security.fileuri.strict_origin_policy`设置为`false`。