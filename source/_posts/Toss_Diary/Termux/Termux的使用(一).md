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

上一篇文章中, 我向大家简单的介绍了一下 Termux 的概念, 并且说明了一下如何安装

本篇文章, 主要想说明一下如何美化你的 ZeroTermux 以及 Termux 的简单使用

-   美化前:
    TODO

-   美化后:
    TODO

# 正文开始

## 设置喜欢的主题和字体

-   通过官方的扩展包`Termux:Style`
    使用方法在上一节介绍过了, 这里再简单地介绍一下

    -   下载

        -   **官方用户**:

            在 F-Droid 上下载 Termux:Style, 或者其他你下载 Termux 的地方

        -   **ZeroTermux**:
            双击左侧显示选项栏 -> 找到官方插件 -> 选择 Termux:Style -> 确认下载

    -   使用

        长按任意空白区域选择更多 -> 样式 -> 选择 font | color

    -   更多主题和字体

        可以去`github`上搜索`Termux的主题`, `字体`

        **字体不一定需要是 Termux 字体**, 上篇说到任意字体文件以 ttf 后缀结尾, 理论上 Termux 都是支持的

        **小技巧**: 官方的 Termux:Style 在 github 上可以搜索到, 由于这个项目很久没有更新, 有很多用户自己制作了很多优秀的主题, 可以在 github 的 PR 申请里找到,

        > 我的主题就是从 PR 里看到的`tokyonight`(使用 neovim 的应该都知道这个主题吧)

    -   抄作业

        我的配置是`tokyonight`主题 + `JetBrains Mono Nerd Font`字体 (支持连字)
        TODO: Image for preview

        如果你觉得我的主题配色还不错, 可以考虑直接克隆我的 Termux 主题配置:

        1. 把我的配置克隆到`~/termux目录`
           `git clone https://github.com/JuanZoran/termux ~/termux`

        2. 将我配置`.termux`里的主题文件移动到`~/.termux`目录下
           `mv ~/termux/colors.properties ~/termux/font.ttf ~/.termux/`
            > 我的配置下的`colors-backup.properties`为`Dracula`配色
            > 喜欢的也可以自行设置
        3. 删除刚刚克隆下来的`termux`文件夹(可选的)
           `rm -rf ~/termux`
