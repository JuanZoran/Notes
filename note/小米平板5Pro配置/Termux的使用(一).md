上一篇文章中, 我向大家简单的介绍了一下Termux的概念, 并且说明了一下如何安装

本篇文章, 主要想说明一下如何美化你的ZeroTermux以及Termux的简单使用

- 美化前:
	TODO

- 美化后: 
	TODO 

# 正文开始

## 设置喜欢的主题和字体
- 通过官方的扩展包`Termux:Style`
	使用方法在上一节介绍过了, 这里再简单地介绍一下
	- 下载
		- **官方用户**:
	 
			在F-Droid上下载Termux:Style, 或者其他你下载Termux的地方
	  
		- **ZeroTermux**:
			 双击左侧显示选项栏 -> 找到官方插件 -> 选择Termux:Style -> 确认下载

	- 使用
 
		长按任意空白区域选择更多 -> 样式 -> 选择font | color
  
	- 更多主题和字体
 
		可以去`github`上搜索`Termux的主题`, `字体`
  
		**字体不一定需要是Termux字体**, 上篇说到任意字体文件以ttf后缀结尾, 理论上Termux都是支持的
  
	 	**小技巧**: 官方的Termux:Style在github上可以搜索到, 由于这个项目很久没有更新, 有很多用户自己制作了很多优秀的主题, 可以在github的PR申请里找到, 

	   > 我的主题就是从PR里看到的`tokyonight`(使用neovim的应该都知道这个主题吧)
   
	- 抄作业

		我的配置是`tokyonight`主题 + `JetBrains Mono Nerd Font`字体 (支持连字)
			TODO: Image for preview
   
		 如果你觉得我的主题配色还不错, 可以考虑直接克隆我的Termux主题配置:
		1. 把我的配置克隆到`~/termux目录`
			 `git clone https://github.com/JuanZoran/termux ~/termux`
	
		2. 将我配置`.termux`里的主题文件移动到`~/.termux`目录下
			  `mv ~/termux/colors.properties ~/termux/font.ttf ~/.termux/`
			 > 我的配置下的`colors-backup.properties`为`Dracula`配色
			 喜欢的也可以自行设置
		3. 删除刚刚克隆下来的`termux`文件夹(可选的)
			  `rm -rf ~/termux`