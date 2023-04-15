---
title: web项目--线程池的设计和实现
date: 2023-03-31 23:29:07
categories:
    - C++
    - 玩具项目
    - C++服务器
tags:
    - C++
    - 后端
    - 编程
---

## web 项目--线程池的设计和实现

### 线程池原理

-   空间换时间,浪费服务器的硬件资源,换取运行效率.
-   池是一组资源的集合,这组资源在服务器启动之初就被完全创建好并初始化,这称为静态资源.
-   当服务器进入正式运行阶段,开始处理客户请求的时候,如果它需要相关的资源,可以直接从池中获取,无需动态分配.
-   当服务器处理完一个客户连接后,可以把相关的资源放回池中,无需执行系统调用释放资源.

---

### 线程池分析

**_线程池的设计模式为半同步/半反应堆，其中反应堆具体为 Proactor 事件处理模式。_**

-   主线程为异步线程，==负责监听文件描述符，接收 socket 新连接==，若当前监听的 socket 发生了读写事件，然后将任务插入到请求队列。
-   工作线程==从请求队列中取出任务，完成读写数据的处理==。

#### **线程池类定义**

具体定义可以看代码。需要注意，**线程处理函数和运行函数设置为私有属性**。

```c++
 1template<typename T>
 2class threadpool{
 3    public:
 4        //thread_number是线程池中线程的数量
 5        //max_requests是请求队列中最多允许的、等待处理的请求的数量
 6        //connPool是数据库连接池指针
 7        threadpool(connection_pool *connPool, int thread_number = 8, int max_request = 10000);
 8        ~threadpool();
 9
10        //像请求队列中插入任务请求
11        bool append(T* request);
12
13    private:
14        //工作线程运行的函数
15        //它不断从工作队列中取出任务并执行之
16        static void *worker(void *arg);
17
18        void run();
19
20    private:
21        //线程池中的线程数
22        int m_thread_number;
23
24        //请求队列中允许的最大请求数
25        int m_max_requests;
26
27        //描述线程池的数组，其大小为m_thread_number
28        pthread_t *m_threads;
29
30        //请求队列
31        std::list<T *>m_workqueue;
32
33        //保护请求队列的互斥锁
34        locker m_queuelocker;
35
36        //是否有任务需要处理
    	  //sem为信号量类型
37        sem m_queuestat;
38
39        //是否结束线程
40        bool m_stop;
41
42        //数据库连接池
43        connection_pool *m_connPool;
44};
```

#### **线程池创建与回收**

-   **构造函数** 创建线程池
-   **pthread_create 函数** 将类的对象作为参数传递给静态函数(worker)

-   **静态函数** 引用这个对象,并调用其动态方法(run)。

具体的，类对象传递时用 this 指针，传递给静态函数后，将其转换为线程池类，并调用私有成员函数 run。

```c++
 1template<typename T>
 2threadpool<T>::threadpool( connection_pool *connPool, int thread_number, int max_requests) : m_thread_number(thread_number), m_max_requests(max_requests), m_stop(false), m_threads(NULL),m_connPool(connPool){
 3
 4    if(thread_number<=0||max_requests<=0)
 5        throw std::exception();
 6
 7    //线程id初始化
 8    m_threads=new pthread_t[m_thread_number];
 9    if(!m_threads)
10        throw std::exception();
11    for(int i=0;i<thread_number;++i)
12    {
13        //循环创建线程，并将工作线程按要求进行运行
14        if(pthread_create(m_threads+i,NULL,worker,this)!=0){
15            delete [] m_threads;
16            throw std::exception();
17        }
18
19        //将线程进行分离后，不用单独对工作线程进行回收
20        if(pthread_detach(m_threads[i])){
21            delete[] m_threads;
22            throw std::exception();
23        }
24    }
25}
```

#### **向请求队列中添加任务**

通过 list 容器创建请求队列，向队列中添加时，通过互斥锁保证线程安全，添加完成后通过信号量提醒有任务要处理，最后注意线程同步。

```c++
 1template<typename T>
 2bool threadpool<T>::append(T* request)
 3{
 4    m_queuelocker.lock();
 5
 6    //根据硬件，预先设置请求队列的最大值
 7    if(m_workqueue.size()>m_max_requests)
 8    {
 9        m_queuelocker.unlock();
10        return false;
11    }
12
13    //添加任务
14    m_workqueue.push_back(request);
15    m_queuelocker.unlock();
16
17    //信号量提醒有任务要处理
18    m_queuestat.post();
19    return true;
20}
```

#### **线程处理函数**

内部访问私有成员函数 run，完成线程处理要求。

```c++
1template<typename T>
2void* threadpool<T>::worker(void* arg){
3
4    //将参数强转为线程池类，调用成员方法
5    threadpool* pool=(threadpool*)arg;
6    pool->run();
7    return pool;
8}
```

#### **run 执行任务**

主要实现，工作线程从请求队列中取出某个任务进行处理，注意线程同步。

```c++
 1template<typename T>
 2void threadpool<T>::run()
 3{
 4    while(!m_stop)
 5    {
 6        //信号量等待
 7        m_queuestat.wait();
 8
 9        //被唤醒后先加互斥锁
10        m_queuelocker.lock();
11        if(m_workqueue.empty())
12        {
13            m_queuelocker.unlock();
14            continue;
15        }
16
17        //从请求队列中取出第一个任务
18        //将任务从请求队列删除
19        T* request=m_workqueue.front();
20        m_workqueue.pop_front();
21        m_queuelocker.unlock();
22        if(!request)
23            continue;
24
25        //从连接池中取出一个数据库连接
26        request->mysql = m_connPool->GetConnection();
27
28        //process(模板类中的方法,这里是http类)进行处理
29        request->process();
30
31        //将数据库连接放回连接池
32        m_connPool->ReleaseConnection(request->mysql);
33    }
34}
```
