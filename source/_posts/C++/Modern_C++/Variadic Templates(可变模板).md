---
title: Variadic Templates(可变模板)
date: 2023-03-31 23:14:15
categories:
    - C++
    - 现代C++学习
tags:
    - C++
    - 现代C++
    - 编程
---

# Variadic Templates(可变模板)

## 基本语法

**_注意下面三个[...]的位置不同_**

-   声明接收任意个数的参数

    `template<typename T, typename [1]... Types>`

-   函数接收任意个数的参数

    `void func(T& fisrtArg, Types&[2]... args)`

-   递归调用时传入任意个参数

    `func(args[3]...);`

---

## 原理

-   参数个数

    利用**参数个数逐一递减**的特性

    实现递归函数的调用,使用**_function template_**完成

-   参数类型

    利用**参数个数逐一递减**导致**参数类型也逐一递减**的特性

    实现递归继承或递归复合,使用**_class template_**完成

---

## 注意点

-   模板接收任意参数时**至少要有一个参数**

    所以在写递归模板时,需要写一个无参数的重载函数作为终止条件

    ```c++
      template<typename... Types>
      void func(Types... args){

      }
      //上一个函数可以和该函数同时存在
      //但下面的函数作为特化版本,会优先被调用
      //上面的函数永远不会被调用
      template<typename T, typename... Types>
      void func(T& fisrtArg, Types&... args){

      }
    ```

-   接收参数类型相同的时

    可以考虑使用**initializer_list** ---需要使用大括号

-   需要获取参数个数可以使用**sizeof...()**
