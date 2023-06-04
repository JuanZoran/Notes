---
title: Rust中的属性
date: 2023-05-19 23:29:19
categories:
    - GPT
    - Rust
tags:
    - 编程
---

# Zoran:

-   Rust 的 attribute 如何使用，有哪些 attribute 可以使用呢

## ChatGPT:

-   在 Rust 中，属性（attributes）是一种将元数据（metadata）附加到代码的方法。它们可以应用于模块、结构体、枚举、函数、方法、常量等。属性以井号（#）开头，后跟一个方括号（[]）内的属性名称和可选的参数。

以下是一些常用的 Rust 属性及其用途：

1. `#[derive]`: 自动生成类型的特定 trait 实现。例如，为结构体或枚举自动生成 `Debug`、`Clone`、`PartialEq`、`Eq`、`PartialOrd`、`Ord`、`Hash` 和 `Default` 等 trait 的实现。

```rust

#[derive(Debug, Clone, PartialEq, Eq)]
struct Point {
    x: i32,
    y: i32,
}
```

1. `#[cfg]`: 在编译时根据配置条件包含或排除代码。它可以用于条件编译，以便根据不同的平台或配置生成不同的代码。

```rust

#[cfg(target_os = "linux")]
fn on_linux() {
    println!("Running on Linux!");
}

#[cfg(target_os = "windows")]
fn on_windows() {
    println!("Running on Windows!");
}
```

1. `#[test]`: 将一个函数标记为单元测试。这个函数将在 `cargo test` 命令下执行。

```rust

#[test]
fn test_addition() {
    assert_eq!(2 + 2, 4);
}
```

1. `#[ignore]`: 标记单元测试，使其在正常测试运行时被忽略。要运行被忽略的测试，可以使用 `cargo test -- --ignored` 命令。

```rust

#[test]
#[ignore]
fn expensive_test() {
    // Code for an expensive test that takes a long time to run
}
```

1. `#[allow]`, `#[warn]`, `#[deny]`, `#[forbid]`: 控制编译器警告和错误。这些属性允许或禁止特定的编译器 lints。

```rust

// Allow dead code in the following function
#[allow(dead_code)]
fn unused_function() {
    println!("This function is not used.");
}
```

1. `#[inline]`, `#[inline(always)]`, `#[inline(never)]`: 给编译器关于内联函数的建议。`#[inline]` 建议编译器内联该函数，`#[inline(always)]` 要求编译器始终内联该函数，`#[inline(never)]` 则要求编译器永不内联该函数。

```rust

#[inline]
fn fast_function() {
    // Code that should be inlined for performance reasons
}
```

这些只是 Rust 属性的一部分示例。Rust 属性有很多种用途，还有一些 crate 也提供自定义属性。你可以在 [Rust 参考手册](https://doc.rust-lang.org/reference/attributes.html) 中查看完整的属性列表。

# Zoran

Rust 中能否创建自定义的注解呢， 应该如何创建

## Response

在我知识库的截止日期（2021 年 9 月）之前，Rust 语言并没有直接支持自定义注解（或者称为"属性"）的能力。在 Rust 中，属性是一种元数据，可以应用于模块、crate、项和语句等。这些属性被硬编码到 Rust 编译器中，并不支持用户自定义。

然而，Rust 提供了一种功能强大的工具，叫做 "procedural macros"，你可以用它来定义一种特殊的属性，然后在编译时自定义处理你的代码。procedural macros 在 Rust 中主要有三种形式：derive，函数样式和属性样式。其中，属性样式的宏可能是你需要的。这种宏允许你定义一个新的属性，然后提供一个函数，在编译时对标记了这个属性的代码进行转换。

这是一个非常基础的示例：

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

#[proc_macro_attribute]
pub fn custom_attribute(_args: TokenStream, input: TokenStream) -> TokenStream {
    let function = parse_macro_input!(input as ItemFn);

    let expanded = quote! {
        #function

        // 这里可以添加你想要的代码转换逻辑
    };

    TokenStream::from(expanded)
}
```

这段代码定义了一个名为 `custom_attribute` 的属性样式的宏。当它被应用到一个函数上时，它会获取那个函数的源代码，然后生成一个新的代码片段。在这个例子中，我们仅仅返回了原始的函数，没有做任何修改，但你可以根据你的需要进行任何你想要的代码转换。

然后你可以在你的 Rust 代码中这样使用它：

```rust
#[custom_attribute]
fn my_function() {
    // your code here
}
```

这将在编译时调用 `custom_attribute` 宏，并将 `my_function` 的源代码作为输入。

注意，procedural macros 的编写通常涉及到比较深入的 Rust 知识，包括语法树（syn 库）和代码引用（quote 库）。如果你不熟悉这些知识，可能需要花一些时间去学习。

另外，Rust 的生态系统中有一些库可以让你更容易地创建自定义宏，例如 `darling` 和 `proc-macro2` 。

---

# Zoran

请你检索一下目前 Rust 支持了自定义注解吗，如果不支持的话， 那么请将 Rust 的宏的使用用法总结成一张表格向我介绍

## Response

我很抱歉，似乎在尝试搜索有关 Rust 宏使用的信息时遇到了一些问题。但我仍然可以为你提供一些基本的 Rust 宏使用概览。

Rust 的宏系统非常强大，可以使你在编译时生成和转换代码。以下是一些最常见的 Rust 宏及其使用方式：

| 宏类型         | 作用                                                         | 使用示例                                                                                                                                      |
| -------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `macro_rules!` | 创建声明式宏（Declarative Macros），这是 Rust 的宏预处理系统 | `macro_rules! vec { ( $( $x:expr ),* ) => { ... }; }`                                                                                         |
| `#[derive]`    | 自动实现一些特定的 trait                                     | `#[derive(Debug, Clone, PartialEq)] struct Point { x: i32, y: i32 }`                                                                          |
| `#[cfg]`       | 在编译时条件编译代码                                         | `#[cfg(target_os = "linux")] fn are_you_on_linux() -> bool { true } #[cfg(not(target_os = "linux"))] fn are_you_on_linux() -> bool { false }` |
| `#[test]`      | 声明一个测试函数                                             | `#[test] fn it_works() { assert_eq!(2 + 2, 4); }`                                                                                             |
| `#[macro_use]` | 在其他作用域中使用本作用域中的宏                             | `#[macro_use] extern crate some_crate;`                                                                                                       |
| `println!`     | 打印到标准输出，与换行符                                     | `println!("Hello, {}!", "world");`                                                                                                            |
| `format!`      | 返回一个格式化的 String                                      | `let s = format!("{} {}", "hello", "world");`                                                                                                 |

需要注意的是，Rust 的宏系统与许多其他编程语言的宏系统有很大不同，因为它们在语法和功能上更为强大和灵活。例如，Rust 的宏可以接受各种各样的输入（称为 "宏指示符"），并且可以在编译时生成或转换任意的 Rust 代码。

在深入了解和使用 Rust 宏之前，建议你阅读 Rust 的官方文档和相关教程，以获取更详细和准确的信息。

---
