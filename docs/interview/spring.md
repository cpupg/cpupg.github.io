---
title: spring
---

# bean的生命周期

1. 调用构造函数创建对象。
2. 设置属性。
3. 调用前置方法。
4. 调用aware接口。
5. 是否配置`init-method`方法。
6. 调用后置方法。
7. 如果实现了`InitializeBean`，调用`afterPropertiesSet`方法。
8. 如果不是单例对象，每次获取对象都使用cglib创建一个子类。
9. 如果实现了`DisposableBean`接口。
10. 检查是否设置`destory-method`方法。

# 事务失效的场景

- 在同一个类中，使用事务方法直接调用另一个事务烦法，而不是通过实例调用。
- 方法不是`public`的。
- 没有抛出异常：通常只有抛出异常才会回滚，如果异常被吞掉，事务就会失效。
- 事务没有被spring管理。

