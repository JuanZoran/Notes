---
title: Cargo
date: 2023-05-30 18:15:22
categories:
    - GPT
    - Rust
    - Cargo
tags:
    - 编程
---

# Zoran

cargo install 安装后的命令行程序, 如何进行更新呢

## Response

要更新通过 "cargo install" 安装的命令行程序，可以使用 Cargo 的内置更新功能。下面是更新命令行程序的步骤：

1. 打开终端或命令行界面。

2. 运行以下命令以更新 Cargo 自身：

```sql
cargo install cargo-update
```

1. 安装完 "cargo-update" 后，运行以下命令以查看已安装的可更新程序：

```sql
cargo install-update -l
```

1. 在列出的可更新程序中找到您要更新的命令行程序的名称。

2. 运行以下命令以更新指定的命令行程序：

```php
cargo install-update <program_name>
```

将 `<program_name>` 替换为您要更新的命令行程序的实际名称。

1. Cargo 将检查可用的更新版本并自动安装最新版本。完成更新后，您的命令行程序将更新为最新版本。

请注意，以上步骤假定您使用的是 Cargo 包管理器来安装命令行程序。如果您使用其他包管理器或手动安装的程序，则更新过程可能会有所不同。

---
