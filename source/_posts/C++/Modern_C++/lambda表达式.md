---
title: lambda表达式
date: 2023-03-31 23:14:15
categories:
    - C++
    - 现代C++学习
tags:
    - C++
    - 现代C++
    - 编程
---

# lambda 表达式

-   基本语法

    ```c++

      auto 函数名[可为匿名] =
            [使用外界的参数, &代表引用传递](传入的参数) (可选项)(mutable[代表值传递时是否可写])() ->(返回类型) {
          //函数体内容
      };
    ```

    -   lambda 为创建匿名函数,需要用名字接收时,使用**auto 关键字创建对象**

    -   需要使用 lambda 对象类型,使用**decltype(**lamabda 对象名)

    -   可以省略返回类型,函数体内直接 return 返回值,由编译器自动推导

-   使用场景

-   临时想到需要创建函数时
-   需要临时重载小括号之类作为参数时

-   返回值类型

![image-20220827114455683](C:\Users\xh030927\AppData\Roaming\Typora\typora-user-images\image-20220827114455683.png)

## lambda + auto = 随时构建泛型函数

_在 C++14 下, lambda 支持使用 auto 自动推导参数, 那么也就可以使构造的 lambda 表达式具有泛型的能力_

```c++
#include <iostream>
#include <string>

using std::cin;
using std::cout;
using std::endl;
using std::string;

int main() {
	auto f1 = [](const auto& x) {
		return x + x;
	};
	cout << f1(1)<< endl  << f1(3.1415926) << endl << f1(string("牛逼"));		//2 6...  牛逼牛逼
	getchar();
	return 0;
}
```
