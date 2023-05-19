---
title: Gdb-tips
date: 2023-05-08 14:11:18
categories:
    - GPT
    - GDB
    - Tips
tags:
    - 编程
---

-   Zoran
    gdb 还有哪些类似于 enable pretty-printer 这样实用的功能呢

-   GPT4
    `gdb` 提供了许多有用的功能，以帮助您更有效地调试程序。除了 pretty-printers 之外，还有其他一些实用的功能，如下所示：

1. **User-Defined Commands**：用户可以创建自定义命令，将多个 `gdb` 命令组合在一起以简化调试过程。使用 `define` 命令创建自定义命令，并使用 `end` 结束命令定义。

    ```
    define my_cmd
    command_1
    command_2
    ...
    end
    ```

2. **Command History**：`gdb` 会保存您输入的命令历史，以便您可以通过上下键方便地访问先前使用的命令。

3. **Reverse Debugging**：`gdb` 支持反向调试，允许您回退到先前的程序状态。使用 `reverse-*` 命令（如 `reverse-step`, `reverse-next`, `reverse-continue`）在程序的执行历史中向后导航。

4. **Conditional Breakpoints**：您可以设置带有条件表达式的断点，只有当该表达式为真时才会触发断点。例如，您可以使用以下命令在 `i` 变量等于 5 时设置一个条件断点：

    ```
    break my_function if i == 5
    ```

5. **Watchpoints**：使用 watchpoints 可以监视特定变量或内存地址的更改。当被监视的变量值发生更改时，`gdb` 将停止程序的执行。使用 `watch` 命令设置一个 watchpoint：

    ```
    watch variable_name
    ```

6. **Call Stack Inspection**：使用 `bt`（backtrace）命令，您可以检查程序的调用堆栈，查看函数调用的顺序和当前的堆栈帧。您还可以使用 `frame` 命令在不同堆栈帧之间切换。

7. **Thread Debugging**：`gdb` 支持多线程程序的调试。使用 `info threads` 命令查看所有可用线程，使用 `thread` 命令在不同线程之间切换。

8. **Attach and Detach**：您可以使用 `gdb` 附加到一个正在运行的进程进行调试。使用 `attach` 命令附加到进程，然后在完成调试后使用 `detach` 命令从进程中分离。

9. **Remote Debugging**：`gdb` 可以通过网络远程调试程序。要实现这一点，您需要在目标设备上运行 `gdbserver`，然后使用 `gdb` 的 `target remote` 命令连接到目标设备。

10. **Python Scripting**：从 `gdb` 7.0 开始，您可以使用 Python 脚本扩展 `gdb` 的功能。这使得您可以编写更复杂的自定义命令

## GDB 奇技淫巧

Zoran:

-   我希望设置一个全局的 gdb 配置, 比如每次 gdb 调试的时候都首先 tui enable, b main, 应该怎么做

ChatGPT:

-   您可以创建一个名为 `.gdbinit` 的文件，该文件包含您希望在启动 `gdb` 时自动执行的命令。将此文件放置在您的主目录下，或者在您运行 `gdb` 的当前工作目录下。`gdb` 在启动时会首先查找这两个位置的 `.gdbinit` 文件。

下面是一个 `.gdbinit` 文件的示例，该文件自动执行 `tui enable` 和 `b main` 命令：

```css

tui enable
b main
```

要创建这个文件，请打开一个文本编辑器，将上述内容粘贴进去，然后将文件保存为 `.gdbinit`。将此文件放置在您的主目录（`~/.gdbinit`）或您的当前工作目录下。

现在，当您使用 `gdb` 调试程序时，它将首先启用 TUI 模式并在 `main` 函数上设置断点。

如果您希望创建针对特定项目的配置文件，可以将 `.gdbinit` 文件放在项目目录下。在这种情况下，当您在该目录下运行 `gdb` 时，将使用该目录下的 `.gdbinit` 文件。请注意，从 `gdb` 7.0 开始，为了安全起见，`gdb` 默认不允许自动加载当前工作目录中的 `.gdbinit` 文件。要允许这一行为，您需要在主目录的 `.gdbinit` 文件中添加以下行：

```vbnet

set auto-load local-gdbinit on
```

这将允许 `gdb` 在启动时自动加载当前工作目录下的 `.gdbinit` 文件。

Zoran:

-   gdb 还有哪些类似于 enable pretty-printer 这样实用的功能呢

ChatGPT:

-   `gdb` 提供了许多有用的功能，以帮助您更有效地调试程序。除了 pretty-printers 之外，还有其他一些实用的功能，如下所示：

1. **User-Defined Commands** ：用户可以创建自定义命令，将多个 `gdb` 命令组合在一起以简化调试过程。使用 `define` 命令创建自定义命令，并使用 `end` 结束命令定义。

```python

define my_cmd
command_1
command_2
...
end
```

2. **Command History** ：`gdb` 会保存您输入的命令历史，以便您可以通过上下键方便地访问先前使用的命令。
3. **Reverse Debugging** ：`gdb` 支持反向调试，允许您回退到先前的程序状态。使用 `reverse-*` 命令（如 `reverse-step`, `reverse-next`, `reverse-continue`）在程序的执行历史中向后导航。
4. **Conditional Breakpoints** ：您可以设置带有条件表达式的断点，只有当该表达式为真时才会触发断点。例如，您可以使用以下命令在 `i` 变量等于 5 时设置一个条件断点：

```kotlin

break my_function if i == 5
```

5. **Watchpoints** ：使用 watchpoints 可以监视特定变量或内存地址的更改。当被监视的变量值发生更改时，`gdb` 将停止程序的执行。使用 `watch` 命令设置一个 watchpoint：

```

watch variable_name
```

6. **Call Stack Inspection** ：使用 `bt`（backtrace）命令，您可以检查程序的调用堆栈，查看函数调用的顺序和当前的堆栈帧。您还可以使用 `frame` 命令在不同堆栈帧之间切换。
7. **Thread Debugging** ：`gdb` 支持多线程程序的调试。使用 `info threads` 命令查看所有可用线程，使用 `thread` 命令在不同线程之间切换。
8. **Attach and Detach** ：您可以使用 `gdb` 附加到一个正在运行的进程进行调试。使用 `attach` 命令附加到进程，然后在完成调试后使用 `detach` 命令从进程中分离。
9. **Remote Debugging** ：`gdb` 可以通过网络远程调试程序。要实现这一点，您需要在目标设备上运行 `gdbserver`，然后使用 `gdb` 的 `target remote` 命令连接到目标设备。
10. **Python Scripting** ：从 `gdb` 7.0 开始，您可以使用 Python 脚本扩展 `gdb` 的功能。这使得您可以编写更复杂的自定义命

Zoran:

-   (gdb) reverse-step
    Target native does not support this command.
    这是什么原因

ChatGPT:

-   `gdb` 的反向调试功能并非在所有平台上都受支持。在您遇到的情况下，当您尝试执行 `reverse-step` 命令时，`gdb` 返回了 "Target native does not support this command." 这意味着您所使用的平台不支持反向调试功能。

反向调试需要特定的硬件或模拟器支持，因此在许多平台上不可用。通常，在使用基于硬件虚拟化技术（如 QEMU）或使用特定处理器（如支持 Branch Trace Store 的 Intel 处理器）进行调试时，反向调试才可用。

如果您仍希望尝试使用反向调试，可以考虑以下替代方法：

1. 使用 QEMU 进行模拟。QEMU 是一个通用的开源计算机模拟器和虚拟化器，支持将目标系统运行在虚拟环境中。您可以将程序在 QEMU 上运行，然后使用 QEMU 的 gdbserver 功能连接到 `gdb`。在这种配置下，您应该能够使用反向调试。
2. 将程序的执行分解成更小的部分，然后在适当的位置设置断点以便于逐步分析。这样，即使您无法使用反向调试，也可以通过在关键点设置断点来近似反向执行的效果。

需要注意的是，这些方法仍可能无法为您提供与实际反向调试相同的功能。但它们至少可以帮助您更好地理解程序的执行过程。

Zoran:

-   有哪些 gdb 的奇技淫巧呢

ChatGPT:

-   `gdb` 提供了许多强大的功能，这里列出了一些奇技淫巧，可以帮助您更有效地使用 `gdb` 进行调试：

1. **查找函数的源代码位置** ：使用 `info functions` 命令加上正则表达式，找到与之匹配的函数及其源代码位置。例如：

```bash

info functions .*main
```

这将列出所有包含 "main" 的函数及其在源代码中的位置。 2. **从当前位置运行到指定行** ：使用 `until` 命令从当前位置运行到指定行。这在你想跳过某个范围内的代码时非常有用。

```lua

until 42
```

这将运行程序，直到执行到第 42 行。 3. **执行指定次数的命令** ：在命令前加上一个数字，可以执行多次该命令。例如，要执行 5 次 `next` 命令：

```lua

5 next
```

4. **更改运行时的变量值** ：您可以在调试过程中更改变量的值。这对于测试代码在不同条件下的行为非常有用。

```arduino

set variable my_variable = 42
```

5. **在命令中使用文件名和行号** ：您可以在某些命令中使用文件名和行号，例如设置断点。这在您知道要在特定源文件的特定行上设置断点时非常有用。

```kotlin

break main.c:42
```

6. **忽略断点的前 N 次触发** ：使用 `ignore` 命令设置断点的忽略计数。例如，要忽略断点 1 的前 5 次触发：

```

ignore 1 5
```

7. **将输出重定向到文件** ：在命令后添加 `> file_name` 将该命令的输出重定向到指定的文件中。例如，将 `info registers` 的输出保存到名为 `registers.txt` 的文件中：

```

info registers > registers.txt
```

8. **查找内存泄漏** ：使用 `gdb` 的 `malloc_history` 命令找到在程序执行期间未释放的内存分配。这可以帮助您识别内存泄漏。
9. ** 为断点添加自动执行的命令** ：使用 `commands` 命令为断点分配一个或多个自动执行的命令。当断点被触发时，这些命令将自动执行。这对于在断点触发时自动更改变量或显示特定信息非常有用。

```arduino

commands 1
print some_variable
continue
end
```

在这个例子中，当断点 1 触发时，它将打印 `some_variable` 的值

Zoran:

-   继续

ChatGPT:

-   的值并继续执行。这种自动执行的命令对于观察程序状态变化非常有用，而无需每次都手动输入命令。

1. ** 命令自动显示变量** ：`display` 命令允许您在每次程序停止时自动显示一个或多个表达式的值。这可以让您更轻松地观察特定变量在执行过程中的变化。

```arduino

display my_variable
```

这将在每次程序停止时显示 `my_variable` 的值。 2. ** 保存断点信息** ：如果您在一个调试会话中设置了许多断点，并希望在其他调试会话中重用这些断点，您可以使用 `save breakpoints` 命令将断点信息保存到一个文件中。

```

save breakpoints breakpoints.txt
```

要在另一个调试会话中加载这些断点，使用 `source` 命令：

```bash

source breakpoints.txt
```

3. **显示汇编与源代码混合视图** ：使用 `layout asm` 和 `layout src` 命令在 TUI 模式下显示汇编与源代码的混合视图。这使您可以在同一界面中查看源代码和对应的汇编代码。
4. **跟踪系统调用** ：使用 `catch syscall` 命令捕获和跟踪系统调用。您可以使用这个命令来跟踪程序如何与操作系统进行交互。

```arduino

catch syscall open
```

上述命令会在程序尝试打开文件（使用 `open` 系统调用）时停止执行。

这些奇技淫巧可以让您更高效地使用 `gdb` 进行调试。然而，请注意，根据您的 `gdb` 版本和所使用的平台，部分功能可能不可用或需要特定配置才能正常工作。尝试这些技巧时，请务必参考您所使用的 `gdb` 版本的官方文档。

Zoran:

-   还有哪些技巧呢

ChatGPT:

-   这里还有一些其他 `gdb` 技巧，以帮助您在调试过程中提高效率：

1. **使用别名** ：您可以为频繁使用的命令创建别名，以便快速调用。使用 `define` 命令创建一个别名：

```arduino

define pname
print variable_name
end
```

这将创建一个名为 `pname` 的别名，执行时将输出 `variable_name` 的值。 2. **列出源代码** ：使用 `list` 命令列出当前源文件的内容。您可以指定要显示的行号范围或函数名。例如，要列出 `main` 函数附近的代码：

```css

list main
```

3. **在命令中使用通配符** ：在一些命令中，您可以使用通配符（`*`）匹配多个项目。例如，您可以一次性删除多个断点：

```perl

delete breakpoints *   # 删除所有断点
```

4. **查找并显示符号信息** ：使用 `info symbol` 命令可以查找并显示特定内存地址的符号信息。这有助于识别内存地址对应的函数或变量。

```typescript

info symbol 0x400000
```

5. ** 搜索命令和帮助信息** ：如果您无法记住某个命令的名称，可以使用 `apropos` 命令搜索相关命令和帮助信息。

```kotlin

apropos break
```

6. **比较内存中的数据** ：使用 `cmp` 命令可以比较两个内存地址范围中的数据。例如，比较地址 `0x400000` 和 `0x500000` 处的 4 字节：

```

cmp 0x400000 0x500000 4
```

7. **检查内存区域的值** ：使用 `x`（examine）命令检查内存区域的值。您可以指定要显示的格式和单位。例如，查看以十六进制格式显示的 4 个字（32 位）：

```

x/4xw 0x400000
```

8. **跳转到指定行执行** ：使用 `jump` 命令可以将程序的执行跳转到指定行。这可以帮助您快速跳过或返回到特定代码段。

```

jump 42
```

9. **设置命令执行时的超时** ：`gdb` 提供了 `timeout` 命令，允许您为命令设置一个超时值。当命令执行超过指定时间时，`gdb` 会自动停止该命令。这在调试慢速程序或处理器密集型任务时非常有用。

```bash

timeout 5 next
```

这个命令将在 5 秒后超时，无论 `next

Zoran:

-   继续

ChatGPT:

-   无论 `next` 命令是否已经完成。

1. **监视变量值的变化** ：使用 `watch` 命令在变量值发生变化时自动中断程序。这对于跟踪可能出现错误的变量非常有用。

```

watch my_variable
```

这将在 `my_variable` 的值发生变化时中断程序。 2. **跟踪函数参数和返回值** ：使用 `info args` 和 `info locals` 命令查看当前函数的参数和局部变量。使用 `return` 命令查看或修改函数的返回值。

```kotlin

info args
info locals
return
```

3. **启用和禁用断点** ：您可以使用 `enable` 和 `disable` 命令临时启用或禁用断点，而无需删除它们。这在调试过程中管理断点非常有用。

```bash

disable 1
enable 1
```

4. **设置条件断点** ：您可以设置一个条件断点，当满足特定条件时才会触发。例如，仅在 `my_variable` 值大于 10 时触发断点：

```kotlin

break my_function if my_variable > 10
```

5. **记录和回放程序的执行** ：`gdb` 支持记录程序的执行过程，之后您可以回放这个过程进行分析。使用 `record` 开始记录，然后使用 `stop` 停止记录。在记录过程中，您可以使用 `next`, `step`, `finish`, `continue` 等命令。回放时，使用 `reverse-*` 命令，如 `reverse-next`、`reverse-step` 等。

```arduino

record
stop
```

这些技巧可以帮助您更高效地使用 `gdb` 调试程序。然而，请注意，根据您的 `gdb` 版本和所使用的平台，部分功能可能不可用或需要特定配置才能正常工作。尝试这些技巧时，请务必参考您所使用的 `gdb` 版本的官方文档。

Zoran:

-   这是我的 gdbinit 文件:
    tui enable
    enable pretty-printer

每次执行 gdb 调试的时候, 都会先弹出这样的其提示, 这是什么原因:
None No process In: L?? PC: ??
--Type <RET> for more, q to quit, c to continue without paging--

ChatGPT:

-   这个提示来自 `gdb`，表示 `.gdbinit` 文件中的命令在启动时被执行。在这种情况下，`tui enable` 和 `enable pretty-printer` 在执行时会输出一些信息。

问题出在 `gdb` 启动时没有加载任何程序或进程，因此在执行 `.gdbinit` 中的命令时，`tui enable` 试图在没有进程上下文的情况下启用 TUI 模式，从而导致这个提示。

为了解决这个问题，您可以在 `.gdbinit` 文件中添加一条 `if` 语句，以确保只在加载了程序或进程的情况下执行 `tui enable` 和 `enable pretty-printer` 命令：

```gdb

if $argc > 0
    tui enable
    enable pretty-printer
end
```

这将确保只有在 `gdb` 加载了一个程序或进程时，才会执行 `tui enable` 和 `enable pretty-printer`。这样一来，您就不会再看到该提示。

Zoran:

-   为什么使用这个脚本之后, 我使用 gdb hello, 来调试命令也没有调用 tui enable 呢

ChatGPT:

-   抱歉，我在上面的回答中犯了一个错误。使用 `$argc` 是不正确的，因为 `$argc` 表示程序的命令行参数个数，而不是 `gdb` 自己的命令行参数个数。

要在 `.gdbinit` 文件中正确检查 `gdb` 是否已加载程序，您应该使用下面的脚本：

```gdb

# 在 .gdbinit 中检查程序是否已加载
python
import gdb
if len(gdb.execute('info files', to_string=True).strip()) > 0:
    gdb.execute('tui enable')
    gdb.execute('enable pretty-printer')
end
```

这段脚本使用 Python API，通过执行 `info files` 命令来检查是否已经加载了程序。当 `gdb.execute('info files', to_string=True).strip()` 的长度大于 0 时，说明已经加载了程序。此时，脚本将执行 `tui enable` 和 `enable pretty-printer` 命令。

Zoran:

-   gdb 如何加载 python 脚本文件呢

ChatGPT:

-   在 GDB 中，可以使用`source`命令加载并执行 Python 脚本文件。假设您有一个名为`myscript.py`的 Python 脚本文件，您可以在 GDB 中这样加载它：

```bash

source myscript.py
```

当您执行此命令时，GDB 将加载`myscript.py`文件并执行其中的 Python 代码。

此外，您还可以在`.gdbinit`文件中添加`source`命令，以便在启动 GDB 时自动加载 Python 脚本。例如，要在启动时自动加载名为`myscript.py`的脚本，请将以下行添加到`.gdbinit`文件中：

```bash

source myscript.py
```

现在，每当您启动 GDB 时，它都会自动加载并执行`myscript.py`脚本中的 Python 代码。

Zoran:

-   (gdb) source /home/zoran/.gdbinit.py
    Traceback (most recent call last):
    File "/home/zoran/.gdbinit.py", line 5, in <module>
    end
    NameError: name 'end' is not defined
    (gdb)
    这是我的 gdbinit.py 文件:
    ❯ cat $HOME/.gdbinit.py
    ───────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
    │ File: /home/zoran/.gdbinit.py
    ───────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
    1 │ import gdb
    2 │ if len(gdb.execute('info files', to_string=True).strip()) > 0:
    3 │ gdb.execute('tui enable')
    4 │ gdb.execute('enable pretty-printer')
    5 │ end
    ───────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

ChatGPT:

-   抱歉，我的回答中犯了一个错误。Python 中没有 `end` 关键字。在 Python 中，您应该使用缩进（空格或制表符）来表示代码块。在您的例子中，您只需删除第 5 行中的 `end`。

修改后的 `.gdbinit.py` 文件应如下所示：

```python

import gdb
if len(gdb.execute('info files', to_string=True).strip()) > 0:
    gdb.execute('tui enable')
    gdb.execute('enable pretty-printer')
```

现在，当您在 GDB 中使用 `source` 命令加载此脚本时，应该不会出现错误。

Zoran:

-   gdb 的 set pretty prin on 和 enable pretty-printer 有什么区别

ChatGPT:

-   在 GDB 中，`set print pretty on` 和 `enable pretty-printer` 具有不同的目的，尽管它们看起来类似。

1. `set print pretty on`：这个命令用于启用或禁用 GDB 的 "漂亮打印" 功能，用于控制输出的格式。这个设置会改变 GDB 如何显示复杂数据结构（例如结构体、联合体和数组）的默认显示方式。当这个选项被启用（`on`）时，GDB 将尝试以更易读的方式显示这些数据结构。例如，每个字段都会显示在新行上，并且会添加适当的缩进。您可以使用 `set print pretty off` 关闭此功能。

示例：

```arduino

(gdb) set print pretty on
(gdb) p my_struct
$1 = {
  field1 = 42,
  field2 = {
    sub_field1 = 3.14,
    sub_field2 = "hello, world"
  },
  field3 = 'a'
}
```

2. `enable pretty-printer`：这个命令用于启用或禁用已加载的自定义 GDB pretty-printer。这些 pretty-printer 是用 Python 编写的，允许您自定义如何显示特定类型的数据。这对于查看 C++ STL 容器（如 `std::vector`、`std::map` 等）和自定义数据结构非常有用。默认情况下，这些 pretty-printer 是启用的，您可以使用 `disable pretty-printer` 命令关闭它们。

示例：

```bash

(gdb) enable pretty-printer
(gdb) p my_vector
$1 = std::vector of length 3, capacity 4 = {1, 2, 3}
```

总之，`set print pretty on` 控制 GDB 默认的格式化输出，而 `enable pretty-printer` 控制自定义的 pretty-printer（如 C++ STL 容器）。它们具有不同的用途，可以根据需要启用或禁用。

Zoran:

-   如何使用 gdb 命令查看选项是否是开启的呢

ChatGPT:

-   要在 GDB 中查看特定选项的当前状态，您可以使用 `show` 命令。下面是一些示例，展示如何使用 `show` 命令检查不同选项的状态：

1. 查看 pretty printing 的状态：

```arduino

(gdb) show print pretty
```

1. 查看 auto-loading 是否启用：

```scss

(gdb) show auto-load
```

1. 查看当前使用的语言：

```sql

(gdb) show language
```

1. 查看十六进制显示设置：

```perl

(gdb) show print hex
```

对于某些设置，可能需要在 `show` 命令后加上子命令来查看具体的状态，例如查看 pretty-printer 的状态：

```scss

(gdb) show pretty-printer
```

此命令将列出已加载的 pretty-printer 以及它们当前是否启用。您可以从输出中判断各个 pretty-printer 的启用状态。

在 GDB 中，您可以使用 `help show` 命令查看可用的 `show` 命令。请注意，可用的设置取决于您使用的 GDB 版本和编译选项。您也可以参阅 GDB 的官方文档以获取更详细的信息。

Zoran:

-   "set print elements 0",
    这段代码有什么用

ChatGPT:

-   在 GDB 中，`set print elements` 命令用于控制在输出字符串或数组时打印的最大字符数。通过设置一个限制，您可以防止 GDB 输出过长的字符串或数组，从而避免控制台被大量数据淹没。

`set print elements 0` 这个命令将最大输出字符数设置为 0，表示没有限制，GDB 将打印完整的字符串或数组。这在查看较长的字符串或数组时可能很有用，但请注意，输出大量数据可能导致 GDB 的响应速度变慢。

您可以使用 `set print elements <number>` 命令将最大输出字符数设置为一个正整数。例如，如果要限制输出的字符数为 100，可以执行以下命令：

```arduino

(gdb) set print elements 100
```

此设置后，GDB 在输出字符串或数组时将最多只打印前 100 个字符。要恢复默认设置（通常为 200），您可以执行：

```arduino

(gdb) set print elements 200
```

要查看当前的最大输出字符数设置，您可以使用 `show print elements` 命令：

```arduino

(gdb) show print elements
```

Zoran:

-   我构造了这样一个 NFA 的代码, 我希望通过 gdb 可以将构造的 NFA 自动机的图的状态导出, 可能的方式应该是如何做到呢:
    #pragma once
    #include <Util.hpp>
    #include <cassert>
    #include <color.h>
    #include <cstdint>
    #include <fmt/format.h>
    #include <fstream>
    #include <map>
    #include <set>
    #include <stack>
    #include <string>
    #include <string_view>
    #include <utility>

/\*\*

-   @class NFA
-   @brief Thompson algorithm's NFA
-   \*/
    class NFA
    {
    public:
    using state = uint32_t;
    using size_t = uint32_t;
    using str = std::string;
    using priority_t = uint32_t;
    using str_view = std::string_view;

public:
NFA() = default;
/\*\*
_ @brief The wrapper of parse function
_
_ @tparam Args see parse function
_ @param args parse method's arguments
\*/
template <typename... Args>
explicit NFA(Args&&... args) noexcept;
NFA(NFA&&) = default;
NFA(const NFA&) = default;
NFA& operator= (NFA&&) = default;
NFA& operator= (const NFA&) = default;
~NFA() = default;

public:
void toDiagram(
const str& filename, const std::ios_base::openmode flag = std::ios::app) const noexcept;
void parse(const str RE, str&& info = "", NFA::priority_t priority = 1) noexcept;
void clear() noexcept;
friend std::ostream& operator<< (std::ostream& os, const NFA& nfa) noexcept;
NFA& operator+ (NFA& rhs) noexcept;

    bool match(const str_view& str) const noexcept;

public:
static NFA::str stateInfo() noexcept;

private:
static state new_state()
{
return \_size++;
}

private:
std::map<std::pair<state, char>, state> transition {};
std::map<state, std::set<state>> epsilon_transition {};
state \_start {};
state \_end {};

private:
static std::map<state, std::pair<priority_t, str>> state_info;
static size_t \_size;
str RE {};
str postfix {};
str pre_process {};
};

inline NFA::size_t NFA::\_size {};
inline std::map<NFA::state, std::pair<NFA::priority_t, NFA::str>> NFA::state_info {};

/\*

-
-   INFO :
-   Thompson algorithm
-   meta characters : ( ) | _ + ?
    _/
    template <typename... Args>
    inline NFA::NFA(Args&&... args) noexcept
    {
    parse(std::forward<Args>(args)...);
    }

inline std::ostream& operator<< (std::ostream& os, const NFA& nfa) noexcept
{
using namespace Color;

    os << Green << "start : " << End << nfa._start << '\n';
    os << Green << "end : " << End << nfa._end << '\n';
    os << Green << "transition : \n";
    for (const auto& [key, value] : nfa.transition) {
        os << Blue << key.first << End << " -" << Blue << key.second << End << "-> " << value
           << '\n';
    }


    os << Green << "epsilon transition : \n" << End;
    for (const auto& [key, value] : nfa.epsilon_transition) {
        os << Yellow << (key) << End << " -"
           << "epsilon"
           << "-> ";
        for (const auto& v : value) {
            os << v << ' ';
        }
        os << '\n';
    }
    return os;

}

inline void
NFA::toDiagram(const std::string& filename, const std::ios_base::openmode flag) const noexcept
{
using os = std::ofstream;
os out { filename, flag };
assert(out.is_open());

    out << fmt::format(
        "## RE: {}\n"
        "### Preprocess : {}\n"
        "### Postfix : {}\n"
        "```dot\n"
        "digraph G {{\n"
        "rankdir=LR;\n"
        "{} [shape = doublecircle];\n"
        "node [shape = circle];\n",
        RE,
        pre_process,
        postfix,
        _end);

    for (const auto& [key, value] : transition) {
        out << fmt::format("{} -> {} [label = \"{}\"];\n", key.first, value, key.second);
    }

    for (const auto& [key, value] : epsilon_transition) {
        for (const auto& v : value) {
            out << fmt::format("{} -> {} [ label = \"ε\" ];\n", key, v);
        }
    }
    out << "}\n"
           "```\n";

}

inline void NFA::clear() noexcept
{
transition.clear();
epsilon_transition.clear();
\_start = \_end = 0;
RE.clear();
postfix.clear();
pre_process.clear();
state_info.erase(this->\_end);
}

inline void NFA::parse(NFA::str RE, str&& info, NFA::priority_t priority) noexcept
{
using stack = std::stack<std::pair<state, state>>;
this->clear();
stack st {};

    this->RE = RE;
    Util::addConcatOperator(RE);
    this->pre_process = RE;
    Util::toPostfix(RE);
    this->postfix = RE;

    auto Kleene = [this, &st]() {
        auto [start, end] = st.top();
        st.pop();

        epsilon_transition[new_start].emplace(start);
        epsilon_transition[new_start].emplace(new_end);

        epsilon_transition[end].emplace(start);
        epsilon_transition[end].emplace(new_end);

        st.push({ new_start, new_end });
    };

    auto Concat = [this, &st]() {
        auto [start1, end1] = st.top();
        st.pop();
        auto [start2, end2] = st.top();
        st.pop();

        epsilon_transition[end2].emplace(start1);

        st.push({ start2, end1 });
    };

    auto Union = [this, &st]() {
        auto new_start = new_state(), new_end = new_state();
        auto [start1, end1] = st.top();
        st.pop();
        auto [start2, end2] = st.top();
        st.pop();

        epsilon_transition[new_start].emplace(start1);
        epsilon_transition[new_start].emplace(start2);

        epsilon_transition[end1].emplace(new_end);
        epsilon_transition[end2].emplace(new_end);

        st.push({ new_start, new_end });
    };

o auto Char = [this, &st](const char ch) {
auto start = new_state(), end = new_state();
transition[{ start, ch }] = end;
st.push({ start, end });
};

    for (const auto ch : RE) {
        switch (ch) {
            case '*':
                Kleene();
                break;
            case '^':
                Concat();
                break;

            case '|':
                Union();
                break;

            default:
                Char(ch);
                break;
        }
    }

    assert(st.size() == 1);
    _start = st.top().first;
    _end = st.top().second;

    if (info.size() > 0)
        state_info[_end] = { priority, info };

}

inline NFA& NFA::operator+ (NFA& other) noexcept
{
transition.merge(other.transition);
epsilon_transition.merge(other.epsilon_transition);

    auto new_start = new_state();
    auto new_end = new_state();

    epsilon_transition[new_start].emplace(_start);
    epsilon_transition[new_start].emplace(other._start);
    epsilon_transition[_end].emplace(new_end);
    epsilon_transition[other._end].emplace(new_end);

    _start = new_start;
    _end = new_end;
    return *this;

}

inline bool NFA::match(const NFA::str_view& str) const noexcept
{
fmt::print("TODO: {}", **func**);
return false;
}

inline NFA::str NFA::stateInfo() noexcept
{
NFA::str info;
for (const auto& [key, value] : NFA::state_info) {
info += fmt::format(
"Index: {} \n"
"\tpriority : {} \n",
"\tinfo: {} \n",
key,
value.first,
value.second);
}
return info;
}

ChatGPT:

-   要使用 GDB 将构造的 NFA 自动机的图的状态导出，您可以使用 Python 脚本扩展 GDB 的功能。您需要编写一个 GDB Python 脚本，该脚本将获取 NFA 类的实例信息，然后将其转换为所需的图形表示形式（如 Graphviz）。

首先，在您的工程目录下创建一个名为 `nfa_gdb.py` 的文件，然后编写以下内容：

```python

import gdb

class NFAStatePrinter:
    def __init__(self, val):
        self.val = val

    def to_string(self):
        nfa = self.val

        # 获取 NFA 类成员的值
        transition = nfa['transition']
        epsilon_transition = nfa['epsilon_transition']
        start = nfa['_start']
        end = nfa['_end']

        # TODO: 将这些值转换为图形表示形式，例如 Graphviz

        # 返回您希望在 GDB 中显示的字符串
        return "NFA states"

def build_pretty_printer():
    pp = gdb.printing.RegexpCollectionPrettyPrinter("nfapp")
    pp.add_printer('NFA', '^NFA
```

, NFAStatePrinter)
return pp

gdb.printing.register_pretty_printer(gdb.current_objfile(), build_pretty_printer())

````



然后，在您的 `.gdbinit` 文件中添加以下行，以便在启动 GDB 时加载此 Python 脚本：

```bash

source /path/to/your/nfa_gdb.py
````

当您在 GDB 中打印 `NFA` 类型的变量时，它将调用 `NFAStatePrinter.to_string` 方法来生成所需的图形表示。您需要在 `TODO` 处实现转换逻辑。

这个例子展示了如何设置基本的 pretty printer。您可能需要根据实际情况调整代码，以便正确处理 `NFA` 类的内部结构并生成所需的图形表示。

Zoran:

-   我是一个 gdb python 新手, 请你讲解一下你刚刚写的这段 gdb python 代码, 我应该如何理解和扩展呢

ChatGPT:

-   当然，我很高兴为您解释这段 GDB Python 代码。这段代码定义了一个名为 `NFAStatePrinter` 的 Python 类，它用于在 GDB 中以特定格式打印 `NFA` 类型的变量。以下是代码逐行分析：

1. 导入 gdb 模块，它提供了与 GDB 进行交互的 API。

```python

import gdb
```

2-3. 定义 `NFAStatePrinter` 类。

```python

class NFAStatePrinter:
    def __init__(self, val):
```

4-5. `__init__` 方法接受一个 GDB Value 对象（即要打印的变量），并将其存储在类实例中。

```python

self.val = val
```

的变量时调用。

```python

def to_string(self):
        nfa = self.val
```

10-13. 使用 GDB API 从 `NFA` 类型的变量中提取所需的成员值。在这里，我们提取了 `transition`、`epsilon_transition`、`_start` 和 `_end` 成员的值。

```python

transition = nfa['transition']
        epsilon_transition = nfa['epsilon_transition']
        start = nfa['_start']
        end = nfa['_end']
```

14-16. 此处需要实现将提取的值转换为所需的图形表示形式（如 Graphviz）。这是一个占位符，您需要根据您的需求来实现具体的逻辑。

```python

# TODO: 将这些值转换为图形表示形式，例如 Graphviz
```

17-19. 返回一个字符串，这个字符串将在 GDB 中显示。在这里，您需要返回适当的图形表示字符串。

```python

return "NFA states"
```

20-25. `build_pretty_printer` 函数定义了如何将 `NFAStatePrinter` 类与 GDB pretty printer 机制关联。它创建了一个新的 `gdb.printing.RegexpCollectionPrettyPrinter` 对象，并将 `NFAStatePrinter` 添加到 pretty printer 集合中。

```python

def build_pretty_printer():
    pp = gdb.printing.RegexpCollectionPrettyPrinter("nfapp")
    pp.add_printer('NFA', '^NFA
```

, NFAStatePrinter)
return pp

````


1. 注册 pretty printer，以便在 GDB 中使用。`gdb.current_objfile()` 表示当前加载的可执行文件。

```python

gdb.printing.register_pretty_printer(gdb.current_objfile(), build_pretty_printer())
````

要扩展这段代码，您需要实现从 NFA 类型的变量提取的值到图形表示（如 Graphviz）的转换。此外，您可以在需要时自定义其他 pretty printer，只需添加新的类，并在 `build_pretty_printer` 函数中将其添加到 pretty printer 集合中。

我希望这个解释对您有所帮助！如有任何疑问，请

Zoran:

-   在详细解释一下这段代码:
    def build_pretty_printer():
    pp = gdb.printing.RegexpCollectionPrettyPrinter("nfapp")
    pp.add_printer('NFA', '^NFA$', NFAStatePrinter)
    return pp
    同时如何在 gdb 调试的时候, 使用创建的 pretty-printer 呢

ChatGPT:

-   `build_pretty_printer` 函数的作用是构建一个包含我们自定义的 pretty-printers 的集合。下面是这个函数的详细解释：

1. 创建一个 `gdb.printing.RegexpCollectionPrettyPrinter` 实例。这是一个内置的 GDB 类，用于管理一组 pretty-printers。我们为此实例提供了一个名为 "nfapp" 的标识符，用于在 GDB 中引用它。

```python

pp = gdb.printing.RegexpCollectionPrettyPrinter("nfapp")
```

1. 使用 `add_printer` 方法将我们之前定义的 `NFAStatePrinter` 类添加到 pretty-printers 集合中。这里我们为 pretty-printer 提供了一个名为 'NFA' 的标识符。` '^NFA`` 是一个正则表达式，表示只有当我们在 GDB 中打印一个类型名称为 "NFA" 的变量时，才会调用  `NFAStatePrinter`。

```python

pp.add_printer('NFA', '^NFA
```

, NFAStatePrinter)

````


1. 返回创建的 pretty-printers 集合。

```python

return pp
````

当您在 GDB 调试时，要使用创建的 pretty-printer，只需在启动 GDB 调试时运行 `.gdbinit` 文件中的 Python 代码。这通常是通过将代码放入用户主目录下的 `.gdbinit` 文件或使用 `source` 命令手动加载脚本来完成的。

当您在 GDB 中打印类型为 "NFA" 的变量时，GDB 将自动调用相应的 pretty-printer（在这里是 `NFAStatePrinter` 类）。例如，假设您在调试一个程序，其中有一个名为 `my_nfa` 的 "NFA" 类型的变量，只需在 GDB 中键入 `print my_nfa`，GDB 将调用 `NFAStatePrinter` 并显示相应的图形表示。

如果您希望禁用 pretty-printer，可以在 GDB 中键入 `disable pretty-printer`。要重新启用它，只需键入 `enable pretty-printer`。

Zoran:

-   我的想法是执行的过程中, 调用 python 脚本生成的 pretty-printer 生成 dot 语言的图表, 然后交给浏览器实时渲染, 这样每次我 next 的时候,浏览器就可以实时更新当前的 NFA 自动机的状态图, 如何去实现这个思路呢

ChatGPT:

-   要实现您的思路，您可以按照以下步骤操作：

1. 编写一个 Python 脚本，用于将 NFA 自动机转换为 DOT 语言图表。您可以在此脚本中使用之前为 GDB 创建的 pretty-printer 作为基础。
2. 在 GDB 中设置一个断点，使其在每次 `next` 时触发。当断点触发时，调用 Python 脚本并将当前的 NFA 自动机转换为 DOT 语言。
3. 将生成的 DOT 语言图表写入一个文件。您可以选择覆盖之前的文件或创建一个新文件，取决于您是否希望保留每个步骤的状态。
4. 在一个 Web 服务器上托管一个简单的 HTML 页面，其中包含一个 JavaScript 脚本。此脚本将周期性地读取您在步骤 3 中生成的 DOT 文件并将其呈现到页面上。您可以使用现有的 JavaScript 库，例如 [viz.js](https://github.com/mdaines/viz.js/) ，将 DOT 语言转换为可视化图表。
5. 在浏览器中打开托管的 HTML 页面，每当您在 GDB 中执行 `next` 时，页面将自动更新并显示当前的 NFA 自动机状态图。

下面是关于如何在 GDB 中设置断点并在每次执行 `next` 时调用 Python 脚本的示例：

1. 在 `.gdbinit` 文件中添加以下代码：

```python

import gdb

class NFAStateBreakpoint(gdb.Breakpoint):
    def __init__(self, location):
        super().__init__(location, gdb.BP_BREAKPOINT, internal=True)

    def stop(self):
        # 在这里调用您的 Python 脚本，将 NFA 自动机转换为 DOT 语言并写入文件
        return False

nfa_state_breakpoint = NFAStateBreakpoint("*some_function_name")
```

替换 `*some_function_name` 为您想在执行 `next` 时调用 Python 脚本的函数名称。当您执行 `next` 且程序进入指定函数时，`stop` 方法将被调用，您可以在该方法中执行所需的操作，例如调用 Python 脚本以生成 DOT 语言图表。
FA 自动机状态图。

完成这些步骤后，当您在 GDB 中执行 `next` 时，浏览器中的页面将实时更新并显示当前的 N
6-9. 定义 `to_string` 方法，它将在 GDB 中实际打印 `NFA` 类型 new_start = new_state(), new_end = new_state();
aut
