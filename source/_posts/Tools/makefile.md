---
title: makefile的基本使用
date: 2023-03-31 23:27:39
categories:
    - 基本工具使用
tags:
    - 编程
    - 效率提升
---

## 目标 + 依赖 + 命令

-   目标 = 需要生成的目标文件
-   依赖 = 生成目标文件所需要的子文件

> 非必须，可以省略

-   命令 = 生成目标文件使用的命令

> 非必须， 可以省略
>
> -   **指令前加上@可以让该指令运行时不输出**
>
> -   **指令前加上-表示报错时，仍然继续向下执行**
> -   使用`.PHONY:对应的命令名`可以将对应的命令声明为伪目标，不受目录下同名文件的影响

-   -f 可以指定使用的 makefile 文件

> 例如：`make -f makefile1`

## 实例

Lost Image!!
![image-20220817113429318](C:\Users\xh030927\AppData\Roaming\Typora\typora-user-images\image-20220817113429318.png)

## 进阶

### 函数

-   wildcard

> 使用通配符来匹配文件

-   patsubst

> 将文件内容进行替换

### 模式匹配

-   $@代表目标文件
-   $< 代表全部依赖
-   $^ 第一个依赖
-   $? 第一个变化的依赖

### 示例

```makefile
#get all .cpp file
src=$(wildcard *.cpp)

#turn all .cpp file into .o file
obj=$(patsubst %.cpp, %.o, $(src))
add:$(obj)
	g++ -o $@ -I./include $(obj)


%.o:%.cpp
	g++ -c $< -I./include
```

-   `src = $(wildcard *.cpp)`

> 使用 wildcard 函数，匹配当前目录下的所有.cpp 文件，并赋值给 src 变量

-   `obj = $(patsubst %.cpp, %.o, $(src))`

> 使用 patsuset 函数，将 src 变量中的所有.cpp 文件替换成.o 文件

-   `add:$(obj)`

> 声明需要创建目标 add，并且依赖为 obj 表示的所有文件

-   `g++ -o add -I ./include $(obj)`

> 使用 g++编译生成该目标文件，-I 指定所用的头文件文件夹为当前目录下的 include 文件夹，子项为 obj 变量的内容

-   `%.o:%.cpp`

> 声明一个编译模板，目标文件为.o 文件，生成对应的.cpp 文件

-   `g++ -c $< -I ./include`

> 使用 g++命令进行编译生成目标文件，使用**makefile 变量$<**代表该声明中的第一个依赖（也就是%.cpp）
>
> 可以使用-o + &@ 显示声明最终生成的文件名（默认为.o 的名称）

## 使用技巧

-   创建命令

```makefile
clean:
	@rm *.o
	rm app
```

> -   可以使用 make clean 来执行清空这些文件的命令
>
> -   @代表该命令运行时候不输出到屏幕上
>
> -   不要在 makefile 所在的目录下创建和指令同名的文件，会导致歧义
>     -   可以使用`.PHONY:clean`将 clean 命令声明为伪目标

-   生成所有文件

```makefile
all:app app1 app2
```

> -   执行`make all`即可生成所有对应的 app 文件
