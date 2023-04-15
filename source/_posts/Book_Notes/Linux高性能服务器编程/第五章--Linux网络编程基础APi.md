---
title: 第五章--Linux网络编程基础APi
date: 2023-03-31 23:23:28
categories:
    - 读书笔记
    - Linux高性能服务器编程
tags:
    - C++
    - 后端
    - 编程
---
# 第五章--Linux网络编程基础APi

*主要讨论Linux网络编程基础Api与内核中 TCP / IP协议族之间的关系, 并为后续章节提供编程基础*

- **socket地址Api**

  *socket最开始的含义是一个IP地址和端口对 (ip, port)**它唯一地表示了使用TCP通信的一端***

- **socket基础api**

  socket的主要Api 都定义在`sys/socket.h`头文件中, 包括

  - 创建socket
  - 命名socket
  - 监听socket
  - 接收连接
  - 读写数据
  - 获取地址信息
  - 检测带外标记
  - 读取和设置socket选项

- **网络信息APi**

  *Linux提供了一套网络信息Api, 以实现主机名和IP地址之间的转换, 以及服务名称和端口号之间的转换*

  *这些Api都定义在`netdb.h`头文件中*



## socket地址API

*要学习 socket 地址API, 先要理解主机字节序和网络字节序*

### 主机字节序和网络字节序

现代CPU的累加器一次都能装载（至少）4字节（这里考虑32位机，下同），即一个整数。

那么**这4字节在内存中排列的顺序将影响它被累加器装载成的整数的值**。这就是字节序问题。

字节序分为大端字节序（big endian）和小端字节序（little endian)。

- **大端字节序**

  指一个整数的高位字节（23～31bit）存储在内存的低地址处，低位字节（0～7bit）存储在内存的高地址处。



- **小端字节序**

  指整数的高位字节存储在内存的高地址处，而低位字节则存储在内存的低地址处。



- **现代PC大多采用小端字节序，因此小端字节序又被称为主机字节序。**
  	*当格式化的数据（比如32bit 整型数和16 bit短整型数）在两台使用不同字节序的主机之间直接传递时，接收端必然错误地解释之。*

> 解决问题的方法是：
>
> **发送端总是把要发送的数据转化成大端字节序数据后再发送，而接收端知道对方传送过来的数据总是采用大端字节序，所以接收端可以根据自身采用的字节序决定是否对接收到的数据进行转换（小端机转换，大端机不转换）。**

*因此大端字节序也称为网络字节序，它给所有接收数据的主机提供了一个正确解释收到的格式化数据的保证。*

**需要指出的是，即使是同一台机器上的两个进程（比如一个由C语言编写，另一个由JAVA编写）通信，也要考虑字节序的问题（JAVA 虚拟机采用大端字节序）。**



Linux提供了如下4个函数来完成主机字节序和网络字节序之间的转换：

```c++
#include <netinet/in.h>
unsigned long int htonl( unsigned long int hostlong );
unsigned short int htons( unsigned short int hostshort );
unsigned long int ntohl( unsigned long int netlong );
unsigned short int ntohs( unsigned short int netshort );
```

它们的含义很明确，比如 htonl 表示“host to network long”，即 : 将长整型（32 bit）的主机字节序数据转化为网络字节序数据。

**这4个函数中，长整型函数通常用来转换IP地址，短整型函数用来转换端口号**

*（当然不限于此 , 任何格式化的数据通过网络传输时，都应该使用这些函数来转换字节序）*



---

### 通用socket地址

**socket网络编程接口中表示socket地址的是结构体sockaddr, 其定义如下 : **

```c++
tinclude <bits/socket.h>
struct sockaddr{
    sa_family_t sa_family;			
	char sa_data[14];				
}
```

- **sa_family成员是地址族类型 (sa_family_t)变量**

*地址族类型通常与协议族类型对应*

> 常见的协议族(protocol family, 也称domain)
>
> ![Screenshot_2022-09-04-22-11-41-264_com.miui.gallery](D:\Download\MiShare\Screenshot_2022-09-04-22-11-41-264_com.miui.gallery.png)
>
> 宏 PF\_\*和 AF\_*都定义在bits/socket.h头文件中，且后者与前者有完全相同的值，所以二者通常混用。



- **sa_data成员用于存放socket地址值。**

  *但是，不同的协议族的地址值具有不同的含义和长度*

![Screenshot_2022-09-04-22-13-52-394_com.miui.gallery](D:\Download\MiShare\Screenshot_2022-09-04-22-13-52-394_com.miui.gallery.png)

*由表可见, 14字节的sa_data根本无法容纳多数协议族的地址值, 因此, LInux定义了下面这个新的通用的 socket 地址结构体*

```c++
#include <bits/socket.h>
struct sockaddr_storage1{
    sa _family_t sa _family;
	unsigned long int _ss_align;
	char _ss_padding[128-sizeof(_ss_align )];
}
```

*这个结构体不仅提供了足够大的空间用于存放地址值, 而且是内存对其的 (``__ss_align`的作用)*



---

### 专用socket地址

上面这两个通用 socket 地址结构体显然很不好用

*比如设置与获取IP地址和端口号就需要执行繁琐的位操作*

**所以Linux为各种协议族提供了专门的 socket 地址结构体**

- **UNIX本地域协议族使用如下专用socket 地址结构体**

  ```c++
  #include <sys/un.h>
  struct sockaddr_un{
      sa_family_t sin_family;			//地址族 : AF_UNIX
  	char sun_path[108];				//文件路径名
  }
  ```

  

- **TCP / IP 协议族**

  - **sockaddr_in**

    ```c++
    struct sockaddr_in{
        sa_family_t 	sin_family;			//地址族 : AF_INET
        u_int16_t 		sin_port;			//端口号, 要用网络字序表示
        struct in_addr 	sin_addr;			//IPv4地址结构体, 见下
    }
    
    struct in_addr{
        u_it32_t s_addr;					//IPv4地址, 要用网络字节序表示
    }
    ```

    

  - **sockaddr_in6**

    ```c++
    struct sockaddr_in6{
        sa_family_t 	sin6_family;			//地址族 : AF_INET6
        u_int16_t 		sin6_port;				//端口号, 要用网络字节序表示
        u_int32_t		sin6_flowinfo;			//流信息, 应设置为 0
        struct in6_addr sin6_addr;				//IPv6地址结构体, 见下方定义
        u_int32_t 		sin6_scope_id;			//socpe ID, 尚处于试验阶段
    }
    
    struct in6_addr{
        unsigned char sa_addr[16];				//IPv6地址, 要用网络字节序表示
    }
    ```

  ==**所有专用socket地址类型的变量在实际使用时都需要转化为通用socket类型 sockaddr**    (强制转换即可)==



----

### IP地址转换函数

通常，人们习惯用可读性好的字符串来表示IP地址

​	*比如用点分十进制字符串表示IPv4地址，以及用十六进制字符串表示IP√6地址。*

- **编程中我们需要先把它们转化为整数（二进制数）方能使用**。

- **记录日志时则相反，我们要把整数表示的IP地址转化为可读的字符串。**

下面3个函数可用于用点分十进制字符串表示的IPv4地址和用网络字节序整数表示的IPv4地址之间的转换：

```c++
#include <arpa/inet.h>
in_addr_t inet_addr( const char* strptr );
int inet_aton( const char* cp, struct in_addr* inp );
char* inet_ntoa( struct in_addr in );
```

- **inet_addr 函数**

  *将用点分十进制字符串表示的IPv4地址转化为用网络字节序整数表示的IPv4地址。它**失败时返回INADDR_NONE**。*

  

- **inet_aton 函数**

  *完成和inet_addr同样的功能，但是将转化结果存储于参数inp指向的地址结构中。它**成功时返回1，失败则返回0**。*



- **inet_ntoa 函数**

  *用网络字节序整数表示的IPv4地址转化为用点分十进制字符串表示的IPv4 地址。*

  > 但需要注意的是，该函数内部用一个静态变量存储转化结果，函数的返回值指向该静态内存，因此inet_ntoa是不可重入的。
  >
  > 下列代码揭示了其不可重入性 :
  >
  > ```c++
  > char* szValuel = inet_ntoa("1.2.3.4");
  > printf("address 1: %s\n", szValuel );
  > char* szValue2 = inet_ntoa("10.194.71.60");
  > printf("address 2: %s\n", szValue2 );
  > 
  > /*
  > 运行这段代码，得到的结果是:
  > address1: 10.194.71.60
  > address2:10.194.71.60
  > */
  > ```



下面这对更新的函数也能完成和前面3个函数相同的功能, 并且他们同样适用于IPv4地址和IPv6地址

```c++
#include <arpa/inet.h>
int inet_pton(int af, const char* src, void* dst);
const char* inet_ntop(int af, const void* src, char* dst, socklen_t cnt);
```

- **inet_pton函数**

  *将用字符串表示的IP地址src(用点分十进制表示的字符串)用十六进制字符串表示的IPv6地址, 转换成用网络字节序整数表示的IP地址，并把转换结果存储于dst指向的内存中。*

  - **af 	指定地址族**

    *可以是 AF_INET 或者 AF_INET6。inet_pton成功时返回1，失败则返回0并设置errnoe。*

    

- **inet_ntop 函数**

  *进行相反的转换，前三个参数的含义与inet_pton的参数相同，最后一个参数 cnt指定目标存储单元的大小。*

  *inet_ntop 成功时返回目标存储单元的地址，失败则返回NULL并设置ermo。*

  > 下面的两个宏能帮助我们指定这个大小（分别用于IPv4和IPv6):
  > ```c++
  > #include <netinet/in.h>
  > #define INET_ADDRSTRLEN 16
  > #define INET6_ADDRSTRLEN 46
  > ```



---

## 创建sokcet

*unix / linux的一个哲学是 : **一切皆文件***

*socket也不例外, 他就是可读, 可写 , 可控制, 可关闭的**文件描述符***

> 下列socket系统调用可创建一个socket :
>
> ```c++
> #include <sys/types.h>
> #include <sys/socket.h>
> int socket(int domain, int type, int protocol);
> ```

- **domain参数**

  告诉系统使用哪个底层协议

  > 对于TCP / IP协议族来说, 该参数应该设置为**PF_INET (Protocol Family of Internet, 用于IPv4)**或**PF_INET6(用于IPv6)**
  >
  > 对于UNIX本地协议族来说, 该参数应该设置为**PF_UNIX**



- **type参数**

  服务类型主要有**SOCK_STREAM(流服务)** 和 **SOCK_DGRAM(数据报服务)**

  > 对于TCP / IP协议族来说, 该值应该取 **SOCK_STREAM**表示传输层使用TCP协议
  >
  > 取**SOCK_DGRAM**表示传输层使用UDP协议



- **protocol**

  在前两个参数构成的协议集合下, 再选择一个具体的协议

  *通常这个值设置为0, 表示使用默认的协议 (**前两个参数已经确定了唯一协议**)*



- **成功时返回一个socket文件描述符, 失败返回-1, 并设置errno**



---

## 命名socket

*创建socket时, 我们给它指定了地址族, 但是并未指定使用该地址族中的哪一个具体socket地址*

*所以我们需要将一个socket与socket地址绑定, 该步骤称为**==给socket命名==***

- **服务端**

  *在服务器程序中, 我们通常==需要命名socket==, 因为只有命名后客户端才知道该如何分配它*



- **客户端**

  *==通常不需要命名socket, 而是采用匿名的方式==, **即使用操作系统自动分配的socket地址***



### bind函数

*定义如下:*

```c++
#include <sys/socket.h>
#include <sys/types.h>
int bind(int sockfd, const struct sockaddr* my_addr, socklen_t addrlen);
```

bind函数将my_addr的地址分配给未命名的sockfd文件描述符, addrlen参数指出该socket的长度

bind成功时返回0, 失败时返回-1并设置errno

> 其中两种常见的errno是 **EACCES** 和 **EADDRINUSE**
>
> - **EACCES**
>
>   被绑定的socket地址是受保护的地址, 进超级用户能够访问
>
>   
>
> - **EADDRINUSE**
>
>   被绑定的地址正在使用中



---

## 监听socket

*socket被命名后, 还不能马上接收客户连接, 我们需要使用如下系统调用来创建一个监听队列以存放待处理的客户连接*

```c++
#include <sys/socket.h>
int listen(int sockfd, int backlog);
```

- **sockfd参数**

  指定被监听的socket

  

- **backlog参数**

  设定内核监听队列的最大长度, 实际上是backlog + 1, 从0 开始计数

  > 监听队列的长度如果超过backlog, 服务器将不再受理新的客户连接, 客户端也将收到ECONNEREFUSED的错误信息



---

## 接受连接

### accpet函数

```c++
#include <sys/types.h>
#include <sys/socket.h>
int accept(int sockfd, struct sockaddr* addr, socklen_t* addrlen);
```

- **sockfd参数**

  执行过listen系统调用的监听socket



- **addr参数**

  用来获取被接受连接的远端socket地址, 该socket地址的长度由addrlen参数指出

  成功时返回新连接的socket, 该socket唯一标识了被接受的这个连接



- **addrlen参数**

  ==指针类型==

  ​	这里的addrlen所指向的值，是必须初始化的，而且要初始化为一个大于等于实际获取socket的数据长度的值

  而accept函数在执行后，会将**实际值赋给addrlen所指向的值**



- **失败时返回- 1并设置errno**



----

## 发起连接

如果说服务器通过listen调用来被动接受连接, 那么**客户端需要通过如下系统调用来主动与服务器建立连接**

```c++
#include <sys/types.h>
#include <sys/socket.h>
int connect(int sockfd, const struct sockaddr* serv_addr, socklen_t addrlen);
```

- **sockfd参数**

  ==客户端的socket描述符==

- **serv_addr参数**

  服务器监听的socket地址

- **addrlen参数**

  监听地址的长度

  - 成功时返回0, 失败返回 -1 并设置errno

    一旦成功建立连接,sockfd, 客户端就可以通过读写sockfd来与服务器端通信

    > 两种常见的errno是 
    >
    > **ECONNREFUSED** : 目标端口不存在, 连接被拒绝 
    >
    > **ETIMEDOUT** :   连接超时

  

  ---

## 关闭连接

### close函数

*关闭一个连接实际上就是关闭该连接对应的 socket, 可以通过如下关闭普通文件描述符*

```c++
#include <unistd.h>
int close(int fd);
```

fd参数是待关闭的socket

> 不过, close系统调用并非总是立即关闭一个连接, 
>
> 而是**将fd的引用数减一,  只有当fd的引用计数为0时, 才真正关闭连接**
>
> 多进程程序中, 一次fork系统调用, 默认将使父进程中打开socket的引用计数加一



---

### shoudown函数

*如果无论如何都要立即终止连接, 则可以通过如下关闭普通文件描述符的系统调用来完成*

```c++
#include <sys/socket.h>
int shutdown(int sockfd, int howto);
```

sockfd参数是带关闭的socket

howto参数决定了shutdown的行为, 具体行为如下 : 

| 可选值        | 含义                                                   |
| ------------- | ------------------------------------------------------ |
| **SHUT_RD**   | 关闭socket读的功能       \*socket接收缓冲区将会被丢弃* |
| **SHUT_WR**   | 关闭socket写的功能        \*处于半关闭状态*            |
| **SHUT_RDWR** | 同时关闭读和写的功能                                   |



---

## 数据读写

### TCP数据读写

***对文件的读写操作read和write同样适用于socket***

*但是socket编程接口提供了几个专门用于socket数据读写的系统调用*

它们增加了对数据读写的控制, 其中用于TCP流数据的读写的调用是 : 

```c++
#include <sys/types.h>
#include <sys/socket.h>
ssize_t recv(int sockfd, void* buf, size_t len, int flags);
ssize_t send(int sockfd, const void* buf, size_t len, int flags);
```

#### **recv函数**

*读取sockfd上的数据*,

recv成功时返回实际读到的数据的长度, 它可能小于我们期望的长度len, 所以我们可能需要多次调用recv, 才能读取到完整的数据

**recv可能返回0, 这意味着对方可能已经关闭了连接**

*recv出错时返回 - 1并设置errno*

- **buf参数**

  指定缓冲区的位置

- **len参数**

  指定缓冲区的大小

- **flags参数**

  **一般置为0**

  flags参数为数据收发提供了额外的控制, 它可以取以下几个选项的逻辑或

  ![Screenshot_2022-09-06-13-25-39-349_com.miui.gallery](D:\Download\MiShare\Screenshot_2022-09-06-13-25-39-349_com.miui.gallery.png)



----

#### send函数

*send函数往 sockfd 上写入数据*

- **buf参数**

  指定写缓冲区的位置

- **len参数**

  指定写缓冲区的大小

- **flags参数**

  同recv函数



---

### UDP数据读写

*UDP数据socket同样提供了相应的发送和接收函数*

```c++
#include <sys/types.h>
#include <sys/socket.h>
ssize_t recvfrom(int sockfd, void* buf, size_t len, int flags, struct sockaddr* src_addr, socklen_t* addrlen);

ssize_t sendto(int sockfd, const void* buf, size_t len, int flags, const struct sockaddr* dest_addr, socklen_t addrlen);
```

- **recvfrom函数**

  *读取sockfd上的内容*

  **buf和len参数分别指定读缓冲区的位置和大小**

  ==由于UDP没有连接的概念, 所以我们每次读取数据都需要获取发送端的地址==

  所以参数scr_addr所指的就是发送端的地址, 而addrlen则指定该地址的长度



- **sento函数**

  *往sockfd上写入数据*

  **buf和len参数分别指定写缓冲区的位置和大小**

  dest_addr参数指定接收端的socket地址, addrlen参数则指定该地址的长度\

  

- **以上两个函数调用的flags参数与send以及recv函数相同**



*recvfrom / sendto函数其实也适用于面向连接的socket函数的读写, 只需要的把最后两个参数设置为NULL即可*



---

### 通用数据读写函数

*除了上述的读写函数, socket接口还提供了一组通用的数据读写函数API, 他们不仅能用于TCP流数据, 还能用于UDP数据*

```c++
#include <sys/socket.h>
ssize_t sendmsg(int sockfd, struct msghdr* msg, int flags);
ssize_t recvmsg(int sockfg, struct msghdr* msg, int flags);
```

- **sockfd参数**

  指定被操作的目标socket



- **msghdr结构体**

  ```c++
  struct msghdr{
    	void* 		msg_name;					//socket地址  
      socklen_t 	msg_namelen;				//socket地址的长度
      struct 		iovec* msg_iov;				//分散的内存块
      int 		msg_iovlen;					//分散内存块的数量
      void* 		msg_control;				//指向辅助数据的起始位置
      socklen_t 	msg_controllen;				//辅助数据的大小
      int 		msg_flags;					//复制函数中的flags参数
      										//并在调用的过程中更新
  };
  ```

  **msg_name**

  ​	指向通信对方的socket地址, 对于面向连接的TCP协议, 该成员没有意义, **必须设置为NULL**

​		**msg_namelen**

​			指定通信对方地址的长度

​		**msg_iov**

​			是iovec结构体类型的指针

```c++
struct iovec{
    void* iov_base;		//内存的起始地址
    size_t iov_len;		//这块内存的长度
};
```

​		指向一块内存的起始位置和长度

​		**msg_iovlen**

​		指定了这样的内存块有多少个

> ​		对于recvmsg而言, 数据将被读取并存放在msg_iovlen块分散的内存中, 这些内存的位置和长度则由msg_iov指向的数组指定, 这称为**分散读**
>
> ​		对于sendmsg而言, msg_iovlen块分散中的数据将一并发送, 这称为**集中写**

​		**msg_control 和 msg_controllen**

​			用于辅助数据的传送, 在此不深入讨论, 将在第13章介绍如何使用它们来实现在进程间传递文件描述符



---

### 带外标记

*在实际应用中, 我们通常无法预期带外数据何时到来*

**好在Linux内核检测到TCP紧急标志时, 将通知应用程序有带外数据需要接收**

这里介绍两种常见内核通知应用程序带外数据到达的方式

- **I / O复用产生的异常事件**
- **SIGURG信号**

但是即使应用程序得到了有带外数据需要接收的通知, 也需要确定带外数据在数据流的具体位置

可以通过下列API来实现 : 

```c++
#include <sys/socket.h>
int sockatmark(int sockfd);
```

socckatmark函数判断sockfd是否处于带外标记

> 通过判断 下一个被读取的数据是否为带外数据
>
> 如果是, 则返回1, 此时我们可以利用带MSG_OOB标志的recv调用来接收带外数据
>
> 如果不是, 则返回 0 			(不知道为啥不设置返回值为bool)



---

### 地址信息函数

*在某些情况下, 我们想知道一个连接socket的本端地址, 以及远端的socket地址*

socket接口提供了下列两个函数来达到此目的 : 

```c++
#include <sys/socket.h>
int getsockname(int sockfd, struct sockaddr* address, socklen_t* address_len);
int getpeername(int sockfd, struct sockaddr* address, socklen__t address_len);
```

**sockfd参数分别对应本端地址和远端socket, 获取到其信息后分别填入address 和 address_len中**



### socket选项

