---
title: Termux的使用(一)
date: 2023-03-30 17:38
categories:
    - 折腾日记
    - Termux
    - 小米平板5Pro配置
tags:
    - Termux
    - 小米平板5Pro
    - Linux
    - Neovim
    - 美化
---

<!--toc:start-->
- [Termux 基本命令](#termux-基本命令)
- [设置喜欢的主题和字体](#设置喜欢的主题和字体)
  - [下载](#下载)
  - [使用](#使用)
  - [更多主题和字体](#更多主题和字体)
  - [抄作业](#抄作业)
- [美化终端](#美化终端)
  - [Zsh 的配置](#zsh-的配置)
    - [介绍](#介绍)
    - [使用](#使用)
<!--toc:end-->

上一篇文章中, 向大家简单的介绍了一下 Termux 的概念, 并且说明了一下如何安装

本篇文章, 主要想说明一下如何美化你的 ZeroTermux 以及 Termux 的简单使用

-   美化前:
    ![](https://zoran-blog-image.oss-cn-hangzhou.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/%E7%BE%8E%E5%8C%96/before.jpg)

-   美化后:
    ![](https://zoran-blog-image.oss-cn-hangzhou.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/%E7%BE%8E%E5%8C%96/after.jpg)

---

正文开始

<!--toc:start-->

# Termux 基本命令

-   包管理器 `pkg`
    pkg 是 Termux 的一个软件包管理器，它可以让您搜索、安装、卸载、更新和升级 Termux 中的软件包

    pkg 的常用命令有：

    -   `pkg search <query>`：搜索包
    -   `pkg install <package>`：安装包
    -   `pkg uninstall <package>`：卸载包
    -   `pkg reinstall <package>`：重新安装包
    -   `pkg update`：更新源
    -   `pkg upgrade`：升级软件包
    -   `pkg list-all`：列出可供安装的所有包
    -   `pkg list-installed`：列出已经安装的包

> pkg 其实是 apt 的一个封装，它会在安装前自动运行`apt update`，保证安装的是最新版本。所以，您也可以直接使用`apt`命令来管理软件包]。

-   **换源**

    换源也是可选的，如果你不会科学上网，觉得更新软件包的网速比较慢，可以选择换源
    使用官方提供的命令： `termux-change-repo`
    然后跟着提示选择中国大陆的镜像源即可

# 设置喜欢的主题和字体

-   通过官方的扩展包`Termux:Style`
    使用方法在上一节介绍过了, 这里再简单地介绍一下

    ## 下载

    -   **官方用户**:

        在 F-Droid 上下载 Termux:Style, 或者其他你下载 Termux 的地方

    -   **ZeroTermux**:
        双击左侧显示选项栏 -> 找到官方插件 -> 选择 Termux:Style -> 确认下载

    ## 使用

    长按任意空白区域选择更多 -> 样式 -> 选择 font | color

    ## 更多主题和字体

    可以去`github`上搜索`Termux的主题`, `字体`

    **字体不一定需要是 Termux 字体**, 上篇说到任意字体文件以 ttf 后缀结尾, 理论上 Termux 都是支持的

    **小技巧**: 官方的 Termux:Style 在 github 上可以搜索到, 由于这个项目很久没有更新, 有很多用户自己制作了很多优秀的主题, 可以在 github 的 PR 申请里找到,

    > 我的主题就是从 PR 里看到的`tokyonight`(使用 neovim 的应该都知道这个主题吧)

    ## 抄作业

    我的配置是`tokyonight`主题 + `JetBrains Mono Nerd Font`字体 (支持连字)
    ![连字效果](https://zoran-blog-image.oss-cn-hangzhou.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/%E7%BE%8E%E5%8C%96/overview.jpg)

    如果你觉得我的主题配色还不错, 可以考虑直接克隆我的 Termux 主题配置:

    1. 把我的配置克隆到`~/termux目录`

        `git clone https://github.com/JuanZoran/termux ~/termux`

    2. 将我配置`.termux`里的主题文件移动到`~/.termux`目录下

        `mv ~/termux/colors.properties ~/termux/font.ttf ~/.termux/`

        > 我的配置下的`colors-backup.properties`为`Dracula`配色 喜欢的也可以自行设置

    3. 删除刚刚克隆下来的`termux`文件夹(可选的)

        `rm -rf ~/termux`

# 美化终端

## Zsh 的配置

### 介绍

在 Linux 中，与系统打交道的主要途径就是**命令行(Shell)**, Shell 就像是我们与 Linux 系统和其他各种工具交流的一个媒介

通过它， 我们才能将想要执行的命令和相对应的参数传递给操作系统

从某种意义上来说，Shell 相当于类 Unix 系统的前端, 既然是前端，那肯定有各种各样美化的空间，而我选择的就是`Shell中的极品 --Zsh`

**Bash**

> 一般 Unix 系统中，默认选择的是 Bash, _Bash 是最常见的 Linux Shell_，也是 MacOS 的默认 Shell 之一

-   优点:

    -   兼容性好

-   缺点:
    -   语法比较反人类（个人觉得 Bash 的语法是最反人类的）
    -   补全不智能
    -   历史记录不方便

**Zsh**

> Zsh 是一个**结合了 Bash、Ksh 和 Tcsh 的优点的 Shell**

-   优点:
    -   有很多强大的功能和扩展，比如自动纠错、主题支持、模糊匹配等
    -   **语法兼容 Bash**, 同时也支持自己的 Zsh 语法，比 Bash 更加人性化
-   缺点:
    -   需要花时间配置和定制
    -   有些功能可能会影响性能

**Fish**

> Fish 是一个友好的交互式 Shell

-   优点:

    -   开箱即用酷炫的特性，比如一致的语法、漂亮的制表符完成和语法高亮显示

    -   更加人性化的语法（_不过我没有怎么使用过，只是懒得配置 root 用户的 Shell， 就直接使用 Fish 了_）

-   缺点:

    -   **不兼容 Bash 和 Zsh 的脚本**

    -   没有插件系统

对比之后，我还是选择了 Zsh, 同样是因为使用的人更多，生态系统更加完善，兼容 Bash 也很重要

### 使用

-   安装`zsh`

    使用`pkg install zsh`
    如果你想使用`fish`, 你使用类似的命令 `pkg install fish`

    > 在之后如果你想下载任何工具, 应该首先尝试使用官方的`pkg install {{your application}}`, 这样安装的软件包是由官方编译打包的，稳定性相对更好

-   设置`zsh`

    使用命令`chsh -s "${which zsh}"`, 为当前的用户设置默认 shell 为 zsh
    设置之后，需要重新打开 Termux， 也就是下次登录时生效

    **更换 zsh 需要注意的**:

        配置文件从`.bashrc` -> `.zshrc`

        默认配置文件会在登录 shell 时， 自动执行

        虽然 zsh 兼容 bash, 但是如果你已经设置了一些`.bashrc`的配置，仍然不建议直接将.bashrc 文件重命名为.zshrc

        可以将.bashrc 中的一些配置到.zshrc 中，有的功能可能 zsh 默认就实现了

-   配置`zsh`

    插件管理器

    使用 zsh, 很多人首先想到使用 `oh-my-zsh`, 如果你是新手, 上来就使用 zsh, 你会遇到:

    很多时候，一个功能完全不知道这是 zsh 的功能， 还是 oh-my-zsh 做的封装，导致很多时候我并不了解我自己的 zshrc

    同时 oh-my-zsh 还会影响 zsh 的性能，毕竟这是一个社区维护的大集合， 很多配置一股脑的就塞给你了

    > 我认为对于需要学习，和了解自己经常使用的工具还是很有必要的，如果你有时间且愿意的话

我这里使用的是一个轻量的插件管理 `zinit`, 他具有以下特点：

-   速度非常快

    官方 github 上有 benchmark 对比，zinit 是所有插件管理器里， 速度最快的

    并且支持了`Turbo mode`

        我的理解是类似于插件延迟加载，不是必要的插件可以延迟到 zsh 进入了以后再后台加载

    它不会让等到所有插件都加载完毕后再进入 zsh , 而是立即启动，在后台异步加载你的插件，除了一些特别的插件，一般都可以通过这个模式来大大提高加载速度

        据说 Turbo Mode 可以提高 Zsh 的启动速度 50 － 80 %

－终端显示效果十分友好
![zinit彩色输出](https://zoran-blog-image.oss-cn-hangzhou.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/%E7%BE%8E%E5%8C%96/zinit.jpg)

-   方便配置同步

他的插件加载非常方便， 类似于 neovim 里的插件下载方式  
只需要： zinit light zsh-users/zsh-syntax-highlighting  
然后重新进入终端， 便可以自动从 github 上下载所需要的插件

上面的代码， 需要首先你安装`zinit`, `zinit` 安装后，会在你的 zshrc 里自动添加如果没有找到 zinit， 自动下载 zinit 的代码

-   zinit 的下载:

    官方下载方式: （终端下执行以下代码）

    由于酷安会屯链接的显示， 所以请自行删除添加的分割符号

    bash -c "$(curl --fail --show-error --silent --location http 删 s://raw.git 删 hubuserco 删 ntent.c 删 om/zdharma 删-continuum/zinit/HEAD/scripts/inst 删 all.sh)"

    如果提示不存在 curl, 可以先执行 `pkg install curl`

-   zinit 安装插件
    上面介绍了， zinit 安装插件非常简单，只需要

    `zinit light username/repo_name`

    然后重新启动 zsh, 没有找到的插件就会自动安装

    你需要将上述代码放在在 zinit 启动之后

    > zinit 虽然 github 上的 star 数只有 1.7k, 但是网络上关于 zinit 的文档相当丰富，可以自行查看  
    > [项目地址](https://github.com/zdharma-continuum/zinit)

我现在使用的插件:

-   `romkatv/powerlevel10k`

    很有名的美化主题，我终端的主题就是默认效果, 我觉得已经很符合我的审美了, 而且是异步加载的

    如果你安装后按照默认配置完和我的不一样，很有可能是因为你没有设置 TERM 环境变量为 `xterm-256color`

    建议在 zinit 加载 power10k 之前，使用添加以下命令

        `export TERM=256color`

    **注意等号周围不能有空格，shell 是以空格分割的**

-   `zsh-users/zsh-syntax-highlighting`

    貌似是 zsh 官方的语法高亮， 旨在为 zsh 提供类似 fish 的语法高亮功能， 毕竟 zsh 不像 fish 开箱即用

-   `marlonrichert/zsh-autocomplete`

    强烈推荐!!!! 类似编辑器一样的， 实时下方出现补全功能，我的 demo 里下方提示不断变化，就是这个插件

-   `zsh-users/zsh-autosuggestions`

    根据你的历史命令来给出命令的阴影提示，可以按`Ctrl + e` 或者方向右键接受

    基本是必备插件了, 也是为了提供类似 fish 的功能

-   `jeffreytse/zsh-vi-mode`

    增强了 zsh 的 vi-mode, **注意是增强，不是提供**，因为 zsh 自带 vi 模式，这个插件是增强了一些功能， 同时更加容易配置
