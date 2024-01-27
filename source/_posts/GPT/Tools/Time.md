---
title: Time
date: 2023-09-08 14:35:52
categories:
- GPT
- Tools
tags:
- 编程
---






## Response

当你在同一台计算机上同时运行Windows和Linux双系统时，你可能会遇到时间不同步的问题。这是因为Windows和Linux处理系统时间的方式是不同的。

-  **Windows** ：默认情况下，Windows将计算机的硬件时钟（BIOS或UEFI时钟）设置为本地时间。
-  **Linux** ：大多数Linux发行版将硬件时钟视为UTC，并使用时区数据将UTC时间转换为本地时间。

这就是为什么当你从一个系统切换到另一个系统时，时间似乎“偏移”了。

要解决这个问题，有几种方法：

1.  **使Linux使用本地时间** ：


```bash
timedatectl set-local-rtc 1 --adjust-system-clock
```
使用这种方法后，Linux将硬件时钟视为本地时间，与Windows一致。


2.  **使Windows使用UTC时间** ：这需要编辑注册表。注意，编辑注册表可能会对系统造成不可逆的影响，请务必小心操作。


    1. 打开注册表编辑器（ `regedit.exe` ）。
    2. 导航到 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInformation` 。
    3. 右键点击 `TimeZoneInformation` ，选择 `新建` > `DWORD (32位) 值` ，命名为 `RealTimeIsUniversal` 。
    4. 双击这个新创建的项，并将其值设置为 `1` 。
    5. 重新启动计算机。
3.  **手动调整** ：这并不是一个长期解决方案，但如果你只是偶尔切换，可以考虑手动设置时间或使用网络时间同步功能在每个操作系统中同步时间。



我建议选择第一种或第二种方法，因为它们可以持续解决问题。选择哪种方法取决于你更习惯哪个系统的处理方式。



---

## Response

当你在同一台计算机上同时运行Windows和Linux双系统时，你可能会遇到时间不同步的问题。这是因为Windows和Linux处理系统时间的方式是不同的。

-  **Windows** ：默认情况下，Windows将计算机的硬件时钟（BIOS或UEFI时钟）设置为本地时间。
-  **Linux** ：大多数Linux发行版将硬件时钟视为UTC，并使用时区数据将UTC时间转换为本地时间。

这就是为什么当你从一个系统切换到另一个系统时，时间似乎“偏移”了。

要解决这个问题，有几种方法：

1.  **使Linux使用本地时间** ：


```bash
timedatectl set-local-rtc 1 --adjust-system-clock
```
使用这种方法后，Linux将硬件时钟视为本地时间，与Windows一致。


2.  **使Windows使用UTC时间** ：这需要编辑注册表。注意，编辑注册表可能会对系统造成不可逆的影响，请务必小心操作。


    1. 打开注册表编辑器（ `regedit.exe` ）。
    2. 导航到 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInformation` 。
    3. 右键点击 `TimeZoneInformation` ，选择 `新建` > `DWORD (32位) 值` ，命名为 `RealTimeIsUniversal` 。
    4. 双击这个新创建的项，并将其值设置为 `1` 。
    5. 重新启动计算机。
3.  **手动调整** ：这并不是一个长期解决方案，但如果你只是偶尔切换，可以考虑手动设置时间或使用网络时间同步功能在每个操作系统中同步时间。



我建议选择第一种或第二种方法，因为它们可以持续解决问题。选择哪种方法取决于你更习惯哪个系统的处理方式。



---
