---
title: 内存管理--VC6之malloc
date: 2023-03-31 20:03:27
categories:
    - C++
    - 侯捷C++内存管理
tags:
    - C++
    - 内存管理
    - 编程
---

# 内存管理---VC6 之 malloc

## malloc(C++程序)初始化操作

### `_heap_init`

-   _对**CRT 需要使用的内存**进行初始化分配_, 大小为 **4k** (第一次为 4k, 后续再申请, 获得的大小会自动增长)

    命名为*`crt_heap`*

### `_sbh_heap_init()`

​ 从*上一步获得的`_crt_heap`内存中*, 分配 16 个**`tagHeader`** [^链表头节点]

[^链表头节点]: 即创建 16 张链表

​ **设定`__sbh_pHeaderList`指向第一个链表头节点**

​ **为了对后续分配的内存完美管理** : 该 16 个链表对应管理分配的内存 **_(一个 Header 通常拥有 1MB 内存)_**

​ \*\*设定`__sbh_pHeaderDefer = NULL(nullptr)`, 用于记录全回收的 Header 的指针

#### **_tagHeader 数据结构_**

```c++
typedef unsigned int BITVEC		//因为uint的大小为32位,所以借用uint来表示32位的结构
typedef struct tagHeader{
    BITVEC bitvEntryHi;			//和bitvEntryLo拼凑成一个64位的结构
    BITVEC bitvEntryLo;			//用于管理group内部的64根链表有无使用

    BITVEC bitvCommit;			//32位用于管理32个group的使用情况
    void*  pHeapData;			//指向真正的内存
    struct tagRegion* pRegion;	//指向'管理中心'	region负责管理内存
}
HEADER, *PHEADER;
```

> typedef struct 使用方法简单讲解:
>
> -   typedef struct 时, {}后的代表给结构体取别名
>
>     好处是,使用结构体时, 可以省略 struct 关键字而直接使用为别名创建
>
>     可以同时定义多个别名, 使用逗号隔开即可
>
> -   **别名以星号 '\*' 开头时, 表示定义结构体指针的名字**
>
> > tagHeader 中表示 : 创建了 tagHeader 结构体, 为其取名为 HEADER, 并且给其指针取名为 PHEADER
> >
> > ```c++
> > HEADER  test;			//表示创建 test变量, 类型为tagHeader
> > PHEADER ptest; 			//表示创建ptest指针, 类型为tagHeader*
> > ```

**此时 pHeapData 还未真正拥有内存**, _相当于只是设置了门牌号_

真正获得内存,需要等到收到请求时 , 调用`__sbh_alloc_new_group()`函数分配

### `_ioinit()`

-   通过宏定义判断是否为 debug 模式, 非 debug 模式则更换`malloc`为`_malloc_dbg`

### `_malloc_dbg(...)`

**_非 debug 模式则调用 malloc 分配_**

**为基本的 io 操作分配内存空间, 也就是程序 _第一次实际申请_ 的空间, 大小为 256 字节**

-   _256 字节的来历_

    申请`IOINFO_ARRAY_ELTS * sizeof(ioinfo)`

    _IOINFO_ARRAY_ELTS 为宏定义, 设置为 32_

    _ioinfo 为结构体, 大小为 6, 内存对齐后为 8_

    ```c++
    typedef struct{
        long osfhnd;
        char osfile;
        char pipech;
    } ioinfo;
    ```

### `_nh_malloc_dbg(...)`

与讨论内容关系不大, 故略过

### `_heap_alloc_dbg(...)`

**对调用的内存封装 debug 需要的部分**

1. `blockSize = sizeof(_CrtMemBlockHeader) + nSize + nNoMansLandSize;		//nSize上一步计算好的(256字节)`

2. ``pHead = (_CrtMemBlockHeader*) `**`_heap_alloc_base(blockSize)`**`;		` **//正式分配内存**

​ _pHead 为指向新分配内存\_CrtMemBlockHeader 结构体的指针, 后续通过该指针设定初值_

3. _\_heap_alloc_base(blockSize) 见下一函数讲解_

-   `#define nNoMansLandSize 4` 宏定义 ''无人区'' 大小为 4

-   _\_CrtMemBlockHeader 数据结构_

    ```c++
    typedef struct _CrtMemBlockHeader{
        struct _CrtMemBlockHeader* pBlockHeaderNext;   		//创建链表数据结构,指向下一节点
        struct _CrtMemBlockHeader* pBlockHeaderPrev;		//指向上一节点
        char*  		  szFileName;							//记录debug时内存所属文件的名称
        int    		  nLine;								//记录内存是由文件的第几行申请
        size_t 		  nDataSize;							//记录原申请的内存(即不加debug结构的内存)大小
        int    		  nBlockUse;							//记录内存申请用途
        long   		  IRequest;								//记录流水编号(即当前是第几次分配, 由1开始计数)

        unsigned char gap[nNoMansLandSize];					//和内存尾部的gap成为一个'栏杆', 检测读写溢出

        /*
         *  结构体后跟着的:
         *  unsigned char data[nDataSize];
         *	unsigned char anotherGap[nNoMansLandSize];
         */
    } _CrtMemBlockHeader;
    ```

```c++
/*
 * nBlockUse说明:
 * 内存块识别
 * #define _FREE_BLOCK   0
 * #define _NORMAL_BLOCK 1			//用户程序申请的内存
 * #define _CRT_BLOCK    2			//CRT所申请的内存
 * #define _IGNORE_BLCOK 3
 * #define _GLIENT_BLOCK 4
 * #define _MAX_BLOCKS   5
 */
```

-   _\_pFirstBlock 和 \_pLastBlock 是函数内部定义的静态指针_

```c++
static _CreMemBlockHeader* _pFirstBlock;
static _CrtMemBlockHeader* _pLastBlock;
```

4. 调整`pFirstBlock和_pLastBlock`的指向

```c++
if(_pFirstBlock)
    _pFirstBlock->pBlockHeaderPrev = pHead;
else
    _pLastBlock = pHead;
```

5. 设定 pHead 的内容 : 如 pBlockHeaderNext, nLine, nDataSize...等

```c++
pHead->pBlockHeaderNext = _pFistBlock;
pHead->pBlockHeaderPrev = NULL;			//当时没有c++11的nullptr, 现在应该用nullptr
pHead->szFileName = (char*)szFileName;
pHead->nLine = nLine;
pHead->nDataSize = nSize;
pHead->nBlockUse = nBlockUse;
pHead->lRequest = lRequest;
```

6. 链接成完整链表

```c++
_pFirstBlock = pHead;
```

7. _为填充设定的静态变量_

```c++
static unsigned char _bNoMansLandFill = 0xFD;	//11111101	表示该区域为'无人区'
static unsigned char _bDeadLandFill   = 0xDD	//11011101	表示该区域需要回收
static unsigned char _bCleanLandFill  = 0xCD	//11001101	表示该区域未使用
```

8. 填充 gap 区域

```c++
//将gap初始化
memset((void*)pHead->gap, _bNoMansLandFill, nNoMansLandSize);
memset((void*)(pbData(pHead) + nSize), _bNoMansLandFill, nNoMansLandSize);

//pbData就是告诉这里应该填申请的块的大下(pHead)表示这里填写的是pHead大小
//pbData(pHead) + nSize 表示移动到了尾部的gap起始位置

//将数据块初始化设定
memset((void*)pbData(pHead), _bCleanLandFill, nSize);
//pbData(pHead)表示移动到了结构体尾部 == 真正需要的数据的起始位置
return (void*)pbData(pHead);		//返回真正需要返回的数据的起始位置
```

### `_heap_alloc_base(...)`

-   **判断申请大小是否小于 1016**

​ _其实是判断大小是否小于 1024, 需要减去还没有添加但是之后会添加的 cookie_

​ _cookie 是上下两个 int 变量, 所以为 8 字节_

-   小于 1016 字节的内存调用**`_sbh_alloc_block()`函数分配内存**
-   大于 1016 字节的内存调用**操作系统 api, 由操作系统分配**

### `__sbh_alloc_block(...)`

**为申请的内存添加 cookie**, 并*将得到后的内存对齐成 16 的倍数*

```c++
sizeEntry = (intSize + 2 * sizeof(int) + (BYTES_PER_PARA - 1)) & ~(BYTES_PER_PARA - 1);
//'&'	 		表示按位与
//'~'	 		表示按位取反
//cookie		为上下两个int型变量
//BYTES_PER_PARA - 1  == 16
```

_调整成 16 的倍数是为了方便后续匹配对应的内存处理链表_

**调整 16 倍数后, 则最后一个字节肯定是 0,则利用最后一位记录该内存区域是否是给出去的内存**

给出时设置成 1

**向下调用`__sbh_alloc_new_region()`函数**

### `___sbh_alloc_new_region()`

**从 crt_heap 中分配**32 个**`tagRegion`组** 用于**管理申请的内存空间**

​ _每个 tagRegion 负责管理 tagHeader 指向的**1MB**大小的内存, 而 tagRegion 大概需要消耗**16k**左右的内存_

#### **_tagHeader 数据结构[回顾]_**

```c++
typedef unsigned int BITVEC		//因为uint的大小为32位,所以借用uint来表示32位的结构
typedef struct tagHeader{
    BITVEC bitvEntryHi;			//和bitvEntryLo拼凑成一个64位的结构
    BITVEC bitvEntryLo;			//用于管理group内部的64根链表有无使用

    BITVEC bitvCommit;			//还不知道
    void*  pHeapData;			//指向真正的内存
    struct tagRegion* pRegion;	//指向'管理中心'	region负责管理内存
}HEADER, *PHEADER;
```

#### tagRegion 数据结构

```c++
typedef struct tagRegion{
    int 	indGroupUse;				//记录当前使用的是第几号Group
    char 	cntRegionSize[64];			//对应相对应的group内的对应链表是否含有内存
    BITVEC 	bitvGroupHi[32];			//与bitvGroupLo并成一个64位32个的数组, 用于记录32组64个的链表是否含有区块
    BITVEC 	bitvGroupLo[32];			//BITVEC 是宏定义的unsigned int

    struct tagGroup grpHeadList[32];
} REGION, *PREGION;
```

#### tagGroup 数据结构

```c++
typedef struct tagGroup{
  int 	cntEnties;						//记录分配内存的次数	回收时减一, 为0时归还给操作系统
  struct tagListHead listHead[64];		//由数据结构可知,为64条双向链表
}GROUP, *PGROUP;
```

**使用 32 个 group 是为了将申请的 1MB 内存分成 32 块内存进行管理, _每个单元负责 32k_**

​ _每个单元又被分成 8 页, 初始挂在最后一张链表, 其每页对应 4k 内存_

**操作时用到内存再真正分配内存给对应的组**[通过操作系统 api]

**64 对指针用于处理对应大小的请求** : 如 1008 字节的请求对应着 62 号指针 [*1008 / 16 = 63, 63 - 1 = **62***]

**同时最后一条指针负责所有大于等于 1k 大小的请求**

#### tagListHead 数据结构

```c++
typedef struct tagListHead{
    struct tagEntry* pEntryNext;
    struct tagEntry* pEntryPrev;
}LISTHEAD, *PLISTHEAD;
```

#### tagEntry 数据结构

```c++
typedef struct tagEntry{
    int 	sizeFront;					//记录页内容前的大小
    struct tagEntry* pEntryNext;		//双向链表的基础部分
    struct tagEntry* pEntryPrev;
}ENTRY, *PENTRY;
```

**调用下一函数真正分配内存**

### `___sbh_alloc_new_group(...)`

1. **_通过操作系统_ 分配 1MB 的*虚拟* 内存交给 tagHeader**

2. 将分配的内存进行分组, 分页

    为 header 分配 1MB 的**虚拟内存**, 实际上还未分配

    为 group 分配 32k**实际内存**, 并一开始分成 4k 挂在 group 的最后一张链表上[即最后一张链表, 每页 4k]

    同时将 bit 位数组的最后一位设置成 1 [bit 位记录着对应的链表是否含有区块]

3. 将每个页的头尾设置成 -1

    为了后续合并时,能够保证回收不会超过最初页的大小

4. 在'-1'内部设置 cookie, 记录可用大小

    _规定大小应该为 16 的倍数, 所以将 16 倍数多余的部分保留(浪费不用)_

5. 返回分配后的内存首地址指针

#### tagEntry 数据结构

```c++
typedef struct tagEntry{
    int 	sizeFront;
    struct tagEntry* pEntryNext;
    struct tagEntry* pEntryPrev;
}ENTRY, *PENTRY;
```

![image-20220831214056214](C:\Users\xh030927\AppData\Roaming\Typora\typora-user-images\image-20220831214056214.png)

**在该结构中**, sizefront 用于记录数据存储在距离指针后的几个位置,

由下图可知, 页内数据部分存储在头指针后(**包括头指针本身**)3 个位置, 所以 sizefront 应该为 3

而最后一页的指针, 按图内的逻辑顺序应该也指向后三个位置, \*\*这里就设置成向上指着同一片区域内容

而第一个指针向上指 3 个内容时, **tagGroup 内有有一个 int cntEntries 保证第一个指针指向不会发生意外**

![image-20220831214615187](C:\Users\xh030927\AppData\Roaming\Typora\typora-user-images\image-20220831214615187.png)

## SBH 行为图解

![image-20220831221405133](C:\Users\xh030927\AppData\Roaming\Typora\typora-user-images\image-20220831221405133.png)

### 申请内存

-   观察对应的链表位是否置为 1, 如果没有置为 1 , 则**从比需要的链表大的第一个链表**中取内存

-   如果不是完美分配, 并且剩余的碎片小于 1k, 则将对应的内存碎片移到相应的链表下

    _同时调整对应的位_

-   如果最大的链表内存块都无法满足分配需求, 则重新分配一个 group, 并且将当前可用的 group 标识++

### 回收内存

-   查看回收的内存大小, 将对应的内存挂在对应的链表上, 如果当时该链表没有置为 1, 则将对应位置为 1

-   将 cntEntries--

-   同时查看回收部分区块的上下 cookie 的最后一位是否为 0 [0 表示未给出]

    如果为 0, 则进行合并操作,将内存碎片合并成一个大块

-   合并后计算新的 cookie,并填入

**free 操作**

-   首先要知道该内存落在哪一个 HEADER 中

    通过 HEADER 记录的头来确定地址范围

-   然后计算应该落在哪一个 group 中

    计算方法:(地址 - HEADER 的头 ) / 32 - 1 得到的数字即是组数

-   通过 cookie 计算 free-list

## SBH 行为分析

**为什么需要将 1MB 的内存分成 32 个 group, 又再将每个 group 分成 8 个 page?**

​ 为了方便管理内存回收时归还操作系统的动作

**如何判断全回收?**

​ 通过查看 group 的 cntEntries, 由于分配内存则++, 回收内存则--

当 cntEntries 为 0 时,则说明内存全回收

​ 全回收时, 一定全部挂在最后一条链表上, 且大小和最开始相同

**何时将内存归还给操作系统?**

​ 并不是一旦 "全回收" 就将内存归还给操作系统, 而是**等手上有两个全回收,再归还**

​ 目的是为了防止归还后, 手上还有内存可供分配, 来避免重新申请内存的情况

​ **_通过`__sbh_pHeaderDefer`指针记录手上保留全回收的 group_**

​ 再分配时, 也通过该指针来使用刚刚全回收的 group, 分配后该指针置为 NULL

**当所有内存归还给 SBH, 此时 SBH 是什么状态?**

​ 回到最初时的状态: 只有一个 group 可用, 且内存挂在其最后一条链表上, 分成了 8 个 4k 大小的 page

**既然我已经了解了 VC 下 debugger 的原理, 我能否通过类似的行为, 通过 static 指针来追踪?**

​ 可以, 并且 VC 提供了对应的 api

**既然 malloc 已经做了这么多内存管理的操作, 分配内存的效率已经够快了, 我们还有必要进行内存管理吗?**

​ 当然, 内存管理的主要目的并不是提升运行的速度, 而是**为了减少频繁调用 malloc 时, malloc 所分配内存带有的 cookie**

**从 malloc, 到标准分配器 alloc, 甚至操作系统内部也会使用类似内存池的管理方式, 每一层都进行这样的大费周章, 是浪费吗?, 有必要吗**

​ 是浪费, 但是有必要; malloc 进行内存管理, 是因为其内属于 C 语言的部分, 目的是实现代码的跨平台, 所以其不能预先假设操作系统进行了内存管理; 同理 C++标准库的 alloc 也不应该依赖 C 语言的管理

**为什么 VC10 内部的 SBH 被删除了?**

​ 没有被删除,而是将内存管理的操作封装在操作系统调用的函数中, VC 本身就是为了在 Windows 自身平台下写的, 所以放心的依赖其操作系统的管理
