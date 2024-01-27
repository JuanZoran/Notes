---
title: zsh的基本使用
date: 2023-04-23 20:23
categories:
    - 折腾日记
    - Termux配置
    - 小米平板5Pro配置
tags:
    - Termux
    - 小米平板5Pro
    - Linux
    - zsh
cover: https://zoran-blog.oss-cn-wuhan-lr.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/zsh%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/screen.jpg
---

# TLDR

我的 github 地址: [JuanZoran](https://github.com/JuanZoran)
我的配置地址: [dotfiles](https://github.com/JuanZoran/dotfiles)

> `Termux`对应的`dotfiles`在`termux`分支

# 本文要点

-   `Zsh`的插件管理
-   `Zsh`的插件介绍
-   `Zsh`的一些使用技巧

# Zsh 的插件管理

上一篇文章介绍了`Zsh`的安装和背景同时简单介绍了一下`Zsh`的插件管理--Zinit，这里详细介绍一下`Zinit`的使用。

-   项目地址：[zdharma/zinit](https://github.com/zdharma-continuum/zinit)
-   官方文档：[zdharma/zinit](https://zdharma-continuum.github.io/zinit/wiki/)

## 安装插件

类似于`vim/neovim`的插件管理, zinit 的插件安装也是只需要 github 的`username/reponame`即可安装

> `zi` 是`zinit`的别名, 作用完全一样

使用 Termux 的时候, 由于安卓的特殊性, 可能优先使用使用官方打包好的文件更好

-   安装: `pkg install {{package}}`
-   查找: `pkg search {{package}}`

### 安装一个最简单的插件:

`zinit light zsh-users/zsh-autosuggestions`

解释:

-   `zinit`

    zinit 自身

-   `light`

    `加载|下载`插件的命令

    > 同样作用的还有`load`  
    > `load` 将启用报告这样可以通过使用 `zinit report {plugin-spec}` 查看信息  
    > `light` 是一个没有跟踪和报告的显着更快的加载, 一般情况下, 只需要使用`light`即可
    > 官方说: 在 Turbo 模式下，跟踪引起的性能损失可以忽略不计, **zinit 已经够快了**

-   `zsh-users/zsh-autosuggestions`

    通过'/'分为两部分, 前一部分为 github 上仓库的`用户名`, 后一部分为`仓库名`  
     只需要提供这两部分, zinit 在启动的时候如果发现没有找到该插件,自动从 github 上下载

---

### 高级技巧

#### `ice`

第一眼看到这个名字, 似乎没有提供任何的信息, 但是实际上他是一个非常强大的功能

**官方介绍**:

冰通常是作为饮料或者咖啡的添加物, 在`zinit`中, `ice`意味着向下一个`zinit`命令中配置一些选项  
冰通常也是会很快融化的, 所以在`zinit`中, 它只会作用与下一条`zinit`命令

**示例说明**:

    通过`ice`可以实现很多强大的配置, 并且直观易懂

-   `as" program"`

```sh
zinit ice as"program" cp"httpstat.sh -> httpstat" pick"httpstat"
zinit light b4b4r07/httpstat
```

    上面的命令通过`ice`为下一条命令`zinit light b4b4r07/httpstat`添加一块冰(配置)
    `as"program"`告诉`zsh`该插件不是一个`zsh`插件, 而是应该添加到`$PATH`中的命令
    `pick`为选中的目标, 设置可执行权限(可能需要一些linux文件系统的知识)

-   `atpull ... | atpull ...`

```sh
zinit ice as"program" mv"httpstat.sh -> httpstat" \
      pick"httpstat" atpull'!git reset --hard'
zinit light b4b4r07/httpstat
```

    `atpull`在插件更新的时候执行, 该命令会在插件更新的时候执行`git reset --hard`命令
    如果后面跟着的命令以!开头, 表明该命令应该在pull之前执行

> 为了不让 Zsh 扩展感叹号，请使用 '…' 而不是 "…" 来包含 atpull ice-mod 的内容  
> 这是 shell 双引号和单引号的语法, 与`zinit`无关

-   **Turbo 模式**

    这是 zinit 拥有超高性能的一个原因, 也是很多现代化插件管理器应该支持的--`延迟加载`

    简单来说, 就是在开始的时候只加载必要的插件, 等进入页面或者触发了对应的条件再加载

    > **需要 Zsh 5.3 或更高版本**, Termux 安装的默认是最新版, 无需担心

    -   `wait` 延迟加载

    ```sh
    zinit ice wait'!0'
    zinit load halfo/lambda-mod-zsh-theme
    ```

    > `wait`命令后面的数字表示该插件应该在进入 zsh 页面后`{number}`秒加载该插件  
    > 似乎需要在数字前加上'!'

    `wait` '!0'表示在进入 zsh 之后立即加载该插件  
    `wait` 后不带参数, zinit 将默认为 **1ms** 后加载该插件

    -   `load` 条件加载

    ```sh
    # 当处于 ~/tmp 目录下时, load zprompts 插件

    zinit ice load'![[ $PWD = */tmp* ]]' unload'![[ $PWD != */tmp* ]]' \
        atload"!promptinit; prompt sprint3"
    zinit load psprint/zprompts

    # 当处于 ~/tmp 目录下时, unload angry-fly 插件
    zinit ice load'![[ $PWD != */tmp* ]]' unload'![[ $PWD = */tmp* ]]'
    zinit load russjohnson/angry-fly-zsh
    ```

    > 注意，要卸载插件才能正常工作，插件需要加载跟踪  
    > 所以 zinit load … ，而不是 zinit light … 。  
    > 跟踪会导致轻微的减速，但这不会影响使用 Turbo 模式时 Zsh 的启动时间

-   其他可以参考官方 wiki, 获取更详细的介绍

    -   `as "completion"`: 将`snippet` 子命令直接指向一个完成文件
    -   `blockf`: 为该插件启用`zinit`自己的补全方法
    -   `for`: 用于简化使用 zinit ice 的使用, 将两条命令合并为一条

#### Snippet

> 我是`oh-my-zsh`(或者是其他 zsh 配置系统)的用户, 我想转 zinit, 但是我已经习惯了包管理器自带的插件了怎么办?
>
> 使用`snippet`, 你可以轻松的安装 oh-my-zsh 自带的一大堆插件当中的一个

oh-my-zsh 是一个社区维护的 zsh 配置系统, 他提供了很多的插件, 这些插件是和他一起被克隆下来

> 所有的插件可以见 [oh-my-zsh/plugins](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins)

通过`zinit snippet`可以轻松的其他插件系统中的内置插件

**示例说明**

从 URL 中下载单个文件

```sh
zinit snippet 'https://github.com/robbyrussell/oh-my-zsh/raw/master/plugins/git/git.plugin.zsh'
zinit snippet 'https://github.com/sorin-ionescu/prezto/blob/master/modules/helper/init.zsh'
```

也可以是一个目录

```sh
zinit ice svn
zinit snippet PZT::modules/docker
```

-   对于`oh-my-zsh`用户, 可以使用`OMZ::`前缀简写

    ```sh
    zinit snippet OMZ::plugins/git/git.plugin.zsh
    ```

-   对于`Prezto`用户, 可以使用`PZT::`前缀简写
    ```sh
    zinit snippet PZT::modules/helper/init.zsh
    ```

---

zinit 的功能其实还有很多, 比如补全, 内置插件, 条件判断, 下载 hook 这些  
目前我只介绍我使用到了的部分, 等后续有时间再补充

---

## 主题安装

我有的朋友, 使用 omz 的原因一个是很多人推荐, 另一个原因是他有很多的主题提供

然而 zsh 拥有强大的插件系统, 使用 zinit 可以轻松的找到用户制作的主题

**我了解的比较火的几款主题分别为**:

-   [romkatv/powerlevel10k](#romkatvpowerlevel10khttpsgithubcomromkatvpowerlevel10k)
-   [starship](#starshiphttpsgithubcomstarshipstarship)

### [romkatv/powerlevel10k](https://github.com/romkatv/powerlevel10k)

#### 介绍

Powerlevel10k 是一个继承于 Powerlevel9k 的主题, 但是它比 Powerlevel9k 更加**强大, 更加美观, 更加快速**

**使用 Shell 编写** 但是**支持异步渲染以及缓存**, 启动速度相比`Powerlevel9k`快了很多

功能上, Powerlevel10k 支持很多的图标, 以及很多的选项, 你可以根据自己的喜好进行配置

> 最重要的是, `p10k` 支持`瞬态提示`
> 简单来说, 当你输入命令的时候, 你可以看到命令的提示, 但是当你按下回车的时候, 这个提示就会消失, 这样可以让你的命令行更加的干净  
> 当你使用双行命令的时候, 这个尤其有用, 可以减少很多的干扰信息

![瞬态提示](https://zoran-blog.oss-cn-wuhan-lr.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/zsh%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/trans.png)

#### 安装

将一下代码添加到你的`~/.zshrc`中

> 在`zinit`的`(( ${+_comps} )) && _comps[zinit]=_zinit`命令之后

```sh
zi ice depth=1; zinit light romkatv/powerlevel10k
```

> Termux 中使用`pkg install p10k`安装`

#### 配置

在命令行中运行`p10k configure`即可进入配置界面

 ![p10k 配置](https://zoran-blog.oss-cn-wuhan-lr.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/zsh%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/p10k_conf.png)

运行之后会在你的家目录下生成一个`.p10k.zsh`文件, 你可以在这个文件中进行配置  
但是由于文件内容太多, 配置起来很不方便, 所以我建议在`github`上找一个喜欢的主题再进行微调

如果没有生效请手动添加以下代码到你的`~/.zshrc`中

```sh
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```

> 这段代码的意思是如果存在`.p10k.zsh`文件(你的配置), 则加载这个文件

### [starship](https://github.com/starship/starship)

#### 介绍

Starship 是一个快速, 简单, 以及可配置的命令行提示符
他由 Rust 编写, 性能相比`Powerlevel10k`要快一些, 同时感觉鲁棒性更好
**而且有官方的中文文档, 虽然翻译的不完全**

 ![Starship官方](https://zoran-blog.oss-cn-wuhan-lr.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/zsh%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/starship_dash.png)

[官方文档](https://starship.rs/zh-CN/config/)

官方介绍:

-   快：🚀 它很快——真的非常快！
-   可定制：🎨 配置提示的各个方面。
-   通用：🌍 适用于任何操作系统的任何 shell。
-   智能化：💡 相关信息一目了然。
-   功能丰富：🛠️ 支持所有您喜欢的工具。
-   简单：👍 安装快速 -- 几分钟内即可开始使用。

> starship 虽然功能丰富, 但是并不支持瞬态提示

#### 安装

将一下代码添加到你的`~/.zshrc`中

```sh
zi ice depth=1; zinit light starship/starship
```

> Termux 中使用`pkg install starship`安装`

#### 配置

starship 的配置文件在`~/.config/starship.toml`中, 可以先运行以下命令

```sh
mkdir -p ~/.config && touch ~/.config/starship.toml
```

![效果展示](https://zoran-blog.oss-cn-wuhan-lr.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/zsh%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/screen.jpg) 

详细的介绍可以查看[官方文档](https://starship.rs/zh-CN/config/)

![starship文档](https://zoran-blog.oss-cn-wuhan-lr.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/zsh%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/starship_wiki.png)

> 也可以直接复制我的配置文件: [starship.toml](https://github.com/JuanZoran/dotfiles/blob/master/config/starship.toml)

## 常用工具安装

工具相关的介绍可以参考 [上一篇](<https://juanzoran.github.io/Notes/2023/03/30/Toss_Diary/Termux/Termux%E7%9A%84%E4%BD%BF%E7%94%A8(%E4%B8%80)/>)

### marlonrichert/zsh-autocomplete

官方地址: [marlonrichert/zsh-autocomplete](https://github.com/marlonrichert/zsh-autocomplete)

```sh
zi light marlonrichert/zsh-autocomplete
```

虽然有一点小 bug, 但是完全不影响是一个很好用的补全插件

#### 配置

-   插入公共子串

    ```sh
    # all Tab widgets
    zstyle ':autocomplete:*complete*:*' insert-unambiguous yes

    # all history widgets
    zstyle ':autocomplete:*history*:*' insert-unambiguous yes

    # ^S
    zstyle ':autocomplete:menu-search:*' insert-unambiguous yes
    ```

    ![before](https://zoran-blog.oss-cn-wuhan-lr.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/zsh%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/insert_pre.png) 

    ![after](https://zoran-blog.oss-cn-wuhan-lr.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/zsh%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/insert.png) 

    当补全内容含有公共子串时, 则按`Tab`自动插入公共子串

    zstyle ':autocomplete:\*' widget-style menu-select

-   选择模式

    ```sh
    zstyle ':autocomplete:*' widget-style menu-select
    # complete-word: 类似与bash的补全, Tab补全第一个, Shift+Tab补全最后一个
    # menu-complete: 每次按Tab都会在补全列表中选择下一个
    # menu-select:  每次按Tab都会在补全列表中选择下一个, 但是会显示补全列表
    ```

-   其他

    参考官方说明: [marlonrichert/zsh-autocomplete](https://github.com/marlonrichert/zsh-autocomplete)

### zsh-vi-mode

> 如果你习惯 vi 的模式, 那么这个插件能让你在终端中如虎添翼

该插件高度可定制, 强烈建议阅读一下官方文档

官方地址: [jeffreytse/zsh-vi-mode](https://github.com/jeffreytse/zsh-vi-mode)

```sh
zinit ice depth=1
zinit light jeffreytse/zsh-vi-mode
```

#### 配置

-   hook 函数

    -   `zvm_before_init_commands`
    -   `zvm_after_init_commands`
    -   `zvm_before_select_vi_mode_commands`
    -   `zvm_after_select_vi_mode_commands`
    -   `zvm_before_lazy_keybindings_commands`
    -   `zvm_after_lazy_keybindings_commands`

-   对 zsh 原生 vi-mode 的补充

    > `zvm_conig`函数是会被`zsh-vi-mode`插件自动调用的

    -   `vi-surround`

    在配置中添加以下代码

    ```sh
    function zvm_config () {
        ZVM_INSERT_MODE_CURSOR=$ZVM_CURSOR_BLINKING_BEAM
        ZVM_VI_INSERT_ESCAPE_BINDKEY='^S'
        ZVM_VI_SURROUND_BINDKEY='s-prefix'
        ZVM_READKEY_ENGINE=$ZVM_READKEY_ENGINE_NEX
    }
    ```

        - ZVM_VI_SURROUND_BINDKEY=classic
            S"   : 添加 " 用于视觉选择
            ys"  : 添加 " 用于视觉选择
            cs"' : 将 " 更改为 '
            ds"  ：删除 "

        - ZVM_VI_SURROUND_BINDKEY=s-prefix
            sa"  : 添加 " 用于视觉选择
            sd"  ：删除 "
            sr"' : 将 " 更改为 '

    -   `ctrl-a和ctrl-x`的扩展

        -   数字（十进制、十六进制、二进制...）
        -   布尔值（真或假，是或否，开或关......）
        -   平日（周日、周一、周二、周三……）
        -   月份（一月、二月、三月、四月、五月……）
        -   运算符（&&、||、++、--、==、!== 和、或...）
        -   ...

        > 和 vim 的 ctrl-a 有一些不同: 这里需要在内容上使用 ctrl + a 才生效

    -   **使用`vim/neovim`编辑命令行**

        这个功能十分强大, 简单来说就是可以随时用 vim/neovim 打开当前编辑的命令行,编辑完了之后再返回到命令行

        > 默认的键绑定是`vv`, 如果需要更改请参考官方文档

           ![](https://zoran-blog.oss-cn-wuhan-lr.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/zsh%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/vi_command_line.png) 

-   [我的配置](https://github.com/JuanZoran/dotfiles/blob/master/config/zsh/maps.zsh)

    > 很多是根据我自己习惯的键位改的

### zsh-autosuggestions

官方地址: [zsh-users/zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)

```sh
zi ice wait lucid atload'_zsh_autosuggest_start'
zi light zsh-users/zsh-autosuggestions
```

### zsh-syntax-highlighting

官方地址: [zsh-users/zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)

```sh
zinit light zsh-users/zsh-syntax-highlighting
```

根据个人喜好定制的, 你也可以直接复制我的[颜色配置](https://github.com/JuanZoran/dotfiles/blob/master/config/zsh/highlight.zsh)

![](https://zoran-blog.oss-cn-wuhan-lr.aliyuncs.com/Termux%E9%85%8D%E7%BD%AE/zsh%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/highlight.png) 

# 使用技巧

-   命令行里的`emacs | vi-mode`

    zsh 对 emacs 和 vi 键位有着原生的支持, 但是我觉得介绍文档有一点老, 可能不是很适合新手

    -   键绑定是`bindkey -M {mode} {key} {widget}` 的形式

    -   `bindkey -M` 可以查看所有的模式

        所有可用的模式:

        -   `.safe`
        -   `command`
        -   `emacs`
        -   `isearch`
        -   `listscroll`
        -   `main`
        -   `menuselect`
        -   `vicmd`
        -   `viins`
        -   `viopp`
        -   `visual`

    -   `bindkey`: 可以查看所有的键绑定

        -   `bindkey <keystroke>` : 基于按键查看 widgets
        -   `bindkey <keystroke> <widget>` : 绑定到已经有的 widgets 里面
        -   `bindkey -s <keystroke> <keystroke>` : 把 a 绑定到 b 快捷键上
        -   `bindkey -M <keymap> <keystroke>` : 绑定到具体模式
        -   `bindkey -r <keystroke>` : 删除键绑定
        -   `bindkey -M <keymap> -r <keystroke>` : 删除 Bindkey

    -   zle -l 查看所有的 widgets

-   寻找需要的插件

    zsh 的插件很多, 可以去[awesome-zsh-plugins](https://github.com/unixorn/awesome-zsh-plugins) 里看看有没有你需要的

    > 编程学习的小技巧: 任何一个领域, 一般都会都对应的`awesome-xxx`话题, 里面会包含很多社区维护的优秀资源  
    > 例如:
    >
    > -   [awesome-python](https://github.com/vinta/awesome-python)
    > -   [awesome-neovim](https://github.com/rockerBOO/awesome-neovim)

# 总结

zsh 是一个强大的 shell, 但是他的配置的确很多, 同时文档又比较零散, 希望这篇文章能帮助到你入门`zsh`
