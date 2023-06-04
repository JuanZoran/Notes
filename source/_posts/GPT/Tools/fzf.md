---
title: fzf的使用
date: 2023-05-19 23:43:04
categories:
    - GPT
    - Tools
tags:
    - fzf
    - 编程
---

# Zoran

请学习以下文档, 然后回答我 fzf 能不能实现当没有匹配选项的时候按下 enter, 返回用户当时输入的文本
https://github.com/junegunn/fzf

## Response

From the documentation of `fzf` on GitHub, it does not explicitly mention the feature you're asking about - returning the user's input text when there are no matching options and pressing enter. `fzf` is a powerful command-line fuzzy finder that can be used with any list, but its behavior is typically to select from the provided list. If there are no matches, pressing enter usually does not return any result.

However, depending on your specific use case, you might be able to achieve this functionality by using a custom script or function that checks if `fzf` returns an empty result, and if so, returns the original input instead.

---

# Zoran

可以如何实现这样的功能呢

## Response

要实现这样的功能，你可能需要编写一个自定义的脚本或函数。以下是一个简单的 Bash 脚本示例，它使用 `fzf` 来获取用户的选择，如果没有匹配的选项，它将返回用户的输入：

```bash
#!/bin/bash

# 读取用户输入
read -p "请输入你的选择: " user_input

# 使用 fzf 获取用户的选择
selected_option=$(echo "$user_input" | fzf)

# 如果 fzf 没有返回结果（即没有匹配的选项），则返回用户的输入
if [ -z "$selected_option" ]; then
    echo "$user_input"
else
    echo "$selected_option"
fi
```

这个脚本首先提示用户输入他们的选择，然后使用 `fzf` 来处理这个输入。如果 `fzf` 返回一个空结果（这意味着没有匹配的选项），脚本将输出用户原始的输入。否则，它将输出 `fzf` 的结果。

请注意，这只是一个基本的示例，你可能需要根据你的具体需求来修改和扩展这个脚本。

---

# Zoran

可以如何使用 fzf --print-query 来改写这一个函数呢:
def handle_new(blog_root: Path): # Create new blog post
categories = [d.name for d in blog_root.glob("*") if d.is_dir()]

    # Generate categories string for fzf
    categories_str = "\n".join(categories)
    tmp = "/tmp/temp_categories.txt"
    with open(tmp, "w") as temp_file:
        temp_file.write(categories_str)

    cmd = f"cat {tmp} | fzf --preview 'ls {blog_root}/{{}}'"
    selected_category = os.popen(cmd).read().strip()
    os.remove(tmp)

    if selected_category:
        category = selected_category
    else:
        category = click.prompt("Enter the category", type=str)
        while category not in categories:
            choice = click.prompt(
                f"Category [{category}] does not exist. Do you want to create it? (y/n)",
                type=str,
            )
            if choice.lower() == "y":
                os.makedirs(blog_root / category)  # Recursively create the directory
                categories.append(category)
            else:
                category = click.prompt("Enter the category", type=str)

    title: str = click.prompt("Enter the blog post title", type=str)
    assert not title.endswith("/"), "Title cannot end with /"

    safe_title = "".join(c if c.isalnum() or c.isspace() else "_" for c in title)
    file_name = f"{safe_title}.md"
    file_path = blog_root / category / file_name

    front_matter = f"""

---

title: {title}
date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
categories:

-   {category}
    tags:
-   编程

---

"""
with open(file_path, "w") as f:
f.write(front_matter)

    os.system(f"nvim -c '+normal! Gzt' {file_path}")

## Response

你可以使用 `fzf` 的 `--print-query` 选项来获取用户的输入。当使用 `--print-query` 选项时， `fzf` 会在输出中首先打印查询字符串。你可以使用这个查询字符串来实现你的需求。

以下是你的函数的修改版本：

```python
def handle_new(blog_root: Path):
    # Create new blog post
    categories = [d.name for d in blog_root.glob("*") if d.is_dir()]

    # Generate categories string for fzf
    categories_str = "\n".join(categories)
    tmp = "/tmp/temp_categories.txt"
    with open(tmp, "w") as temp_file:
        temp_file.write(categories_str)

    cmd = f"cat {tmp} | fzf --print-query --preview 'ls {blog_root}/{{}}'"
    result = os.popen(cmd).read().strip().split('\n')
    os.remove(tmp)

    if len(result) > 1:
        selected_category = result[1]
    else:
        selected_category = result[0]

    if selected_category in categories:
        category = selected_category
    else:
        category = click.prompt("Enter the category", type=str)
        while category not in categories:
            choice = click.prompt(
                f"Category [{category}] does not exist. Do you want to create it? (y/n)",
                type=str,
            )
            if choice.lower() == "y":
                os.makedirs(blog_root / category)  # Recursively create the directory
                categories.append(category)
            else:
                category = click.prompt("Enter the category", type=str)

    title: str = click.prompt("Enter the blog post title", type=str)
    assert not title.endswith("/"), "Title cannot end with /"

    safe_title = "".join(c if c.isalnum() or c.isspace() else "_" for c in title)
    file_name = f"{safe_title}.md"
    file_path = blog_root / category / file_name

    front_matter = f"""
---
title: {title}
date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
categories:
- {category}
tags:
- 编程
---
"""
    with open(file_path, "w") as f:
        f.write(front_matter)

    os.system(f"nvim -c '+normal! Gzt' {file_path}")
```

在这个修改版本中，我添加了 `--print-query` 选项到 `fzf` 命令中。然后，我将 `fzf` 的输出分割成多行，并检查结果的长度。如果长度大于 1，那么说明 `fzf` 找到了匹配的选项，我将选择的类别设置为第二行（即匹配的选项）。如果长度等于 1，那么说明 `fzf` 没有找到匹配的选项，我将选择的类别设置为用户的输入（即第一行）。

---

# Zoran

    # Generate categories string for fzf
    categories_str = "\n".join(categories)
    tmp = "/tmp/temp_categories.txt"
    with open(tmp, "w") as temp_file:
        temp_file.write(categories_str)

    cmd = f"cat {tmp} | fzf --preview 'ls {blog_root}/{{}}'"
    selected_category = os.popen(cmd).read().strip()
    os.remove(tmp)

这一部分, 可以不先创建文件再删掉吗, 而是通过 stdin 传入给 fzf, 省去了临时文件和 cat 的调用

## Response

当然可以，你可以直接将字符串传递给 `fzf` ，而不是先写入文件。这可以通过使用 Python 的 `subprocess` 模块来实现。以下是你的代码的修改版本：

```python
import subprocess

def handle_new(blog_root: Path):
    # Create new blog post
    categories = [d.name for d in blog_root.glob("*") if d.is_dir()]

    # Generate categories string for fzf
    categories_str = "\n".join(categories)

    cmd = ["fzf", "--print-query", "--preview", f"ls {blog_root}/{{}}"]
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    selected_category, _ = process.communicate(input=categories_str.encode())
    selected_category = selected_category.decode().strip().split('\n')

    if len(selected_category) > 1:
        selected_category = selected_category[1]
    else:
        selected_category = selected_category[0]

    if selected_category in categories:
        category = selected_category
    else:
        category = click.prompt("Enter the category", type=str)
        while category not in categories:
            choice = click.prompt(
                f"Category [{category}] does not exist. Do you want to create it? (y/n)",
                type=str,
            )
            if choice.lower() == "y":
                os.makedirs(blog_root / category)  # Recursively create the directory
                categories.append(category)
            else:
                category = click.prompt("Enter the category", type=str)

    title: str = click.prompt("Enter the blog post title", type=str)
    assert not title.endswith("/"), "Title cannot end with /"

    safe_title = "".join(c if c.isalnum() or c.isspace() else "_" for c in title)
    file_name = f"{safe_title}.md"
    file_path = blog_root / category / file_name

    front_matter = f"""
---
title: {title}
date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
categories:
- {category}
tags:
- 编程
---
"""
    with open(file_path, "w") as f:
        f.write(front_matter)

    os.system(f"nvim -c '+normal! Gzt' {file_path}")
```

在这个修改版本中，我使用 `subprocess.Popen` 来启动 `fzf` 进程，并通过 `stdin` 传递类别字符串。然后，我使用 `communicate` 方法来发送输入并获取输出。这样就避免了创建和删除临时文件的需要。

---

# Zoran

请你学习一下 fzf 的文档, 稍后我将对文档内容进行提问
https://github.com/junegunn/fzf#using-the-finder

## Response

"fzf" is a general-purpose command-line fuzzy finder. It's an interactive Unix filter for command-line that can be used with any list; files, command history, processes, hostnames, bookmarks, git commits, etc. It's portable, fast, and comes with a comprehensive feature set. It also includes a Vim/Neovim plugin, key bindings, and fuzzy auto-completion.

The "fzf" project consists of the following components:

-   fzf executable
-   fzf-tmux script for launching fzf in a tmux pane
-   Shell extensions
-   Key bindings (CTRL-T, CTRL-R, and ALT-C) for bash, zsh, fish
-   Fuzzy auto-completion for bash, zsh
-   Vim/Neovim plugin

"fzf" can be installed using Homebrew, git, or various Linux package managers. It can also be used as a Vim plugin.

"fzf" will launch an interactive finder, read the list from STDIN, and write the selected item to STDOUT. It can be used with the "find" command to fetch a list of files, or it can turn itself into a different process with the "--bind" option.

"fzf" supports a variety of key bindings, including moving the cursor up and down, selecting items, and exiting. It also supports multi-select mode, Emacs style key bindings, and mouse interactions.

"fzf" also provides a preview window when the "--preview" option is set, automatically starting an external process with the current line as the argument and showing the result in a split window.

Here are some questions to consider:

1. How does "fzf" improve the command-line user experience?
2. What are some potential use cases for the "fzf" command-line fuzzy finder?
3. How does the preview window feature in "fzf" enhance its functionality?

---

# Zoran

介绍一下刚刚让你学习的文档中, 有关于"3. Interactive ripgrep integration"的部分

## Response

"Interactive ripgrep integration" 是 fzf 的一个高级特性，它允许你在 fzf 中动态地执行 ripgrep 搜索。

以下是一个示例，它使用 fzf 作为 ripgrep 的选择器接口。在这个示例中，我们将 reload 动作绑定到 change 事件，所以每次你在 fzf 中输入时，ripgrep 进程都会用更新的查询字符串（由占位符表达式 {q} 表示）重新启动。此外，我们使用了 --disabled 选项，所以 fzf 不会执行任何二次过滤。

```bash
INITIAL_QUERY=""
RG_PREFIX="rg --column --line-number --no-heading --color=always --smart-case "
FZF_DEFAULT_COMMAND="$RG_PREFIX '$INITIAL_QUERY'" \
  fzf --bind "change:reload:$RG_PREFIX {q} || true" \
      --ansi --disabled --query "$INITIAL_QUERY" \
      --height=50% --layout=reverse
```

如果 ripgrep 没有找到任何匹配项，它将以非零退出状态退出，fzf 会对此发出警告。为了抑制警告消息，我们在命令后添加了 || true，以便它总是以 0 退出。

这个功能可以让你在使用 fzf 的同时，动态地执行 ripgrep 搜索，大大提高了搜索的灵活性和效率。

---

# Zoran

再介绍一下有关于"Preview window"的部分, 我应该如何使用这个特性

## Response

"fzf" 的 "Preview window" 是一个非常有用的特性，它可以让你在选择项时预览相关内容。

当你设置了 "--preview" 选项时，fzf 会自动启动一个外部进程，并将当前行作为参数，然后在一个分割窗口中显示结果。你可以使用任何可以接受标准输入的命令作为预览命令。

例如，你可以使用 "cat" 命令预览文件内容：

```bash
fzf --preview 'cat {}'
```

在这个例子中，"{}" 是一个占位符，它会被替换为当前选中的行。你也可以使用 "{+}" 来表示所有选中的行。

你还可以使用 "--preview-window" 选项来自定义预览窗口的大小和位置。例如，你可以设置预览窗口在右侧，占据 50% 的宽度：

```bash
fzf --preview 'cat {}' --preview-window right:50%
```

此外，你还可以使用 "--bind" 选项来绑定键到 "toggle-preview" 命令，这样你就可以在需要时打开或关闭预览窗口。

```bash
fzf --preview 'cat {}' --bind '?:toggle-preview'
```

在这个例子中，按 "?" 键将会切换预览窗口的显示和隐藏。

总的来说，"Preview window" 特性可以让你在使用 fzf 时更好地理解和选择你的选项。

---

# Zoran

为什么"Turning into a different process"这一节提到了 fzf --print0 | xargs -0 -o vim instead of vim "$(fzf)"

## Response

"Turning into a different process" 是 fzf 的一个高级特性，它允许 fzf 将自身转变为一个不同的进程。这在某些情况下可以提供更好的用户体验。

在 "fzf --print0 | xargs -0 -o vim" 和 "vim $(fzf)" 两种方式中，前者的优势在于它允许 vim 在 fzf 选择器仍然打开的情况下启动。这意味着你可以在 vim 中编辑文件，然后关闭 vim 返回到 fzf 选择器，而不需要重新启动 fzf。这在你需要在多个文件之间切换时非常有用。

而 "vim $(fzf)" 命令会在你选择文件后关闭 fzf，然后启动 vim。当你关闭 vim 后，如果你想再次选择一个文件，你需要重新启动 fzf。

因此，"fzf --print0 | xargs -0 -o vim" 提供了一种更流畅的工作流，允许你在不关闭 fzf 的情况下在多个文件之间切换。

---
