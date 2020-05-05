---
title: 不同语言锁的实现
template: "post"
date: "2020-05-02 20:51"
draft: false
slug: "/posts/thread-and-lock"
category: "Programming"
tags:
  - Programming
description: "在并发的场景中我们经常要用到锁来避免资源竞争，不同的语言有不同的实现，比如说rust是调用操作系统的接口，Go是自己实现了一套用户态的锁，至于java就更多了"
---

本文将先介绍 Wait-free 和 Lock-free 算法，但是在有些场合必须要使用 lock，所以再讨论下各种语言标准库 lock 的实现，最后会探索下分布式锁的一些想法。

首先要明确一点如果一个程序是单线程执行的，那肯定没有资源竞争(data race)，因为这个线程是顺序往前推进的，所谓的资源竞争只发生在多线程场景。所以像 redis 就没有数据竞争，因为只有一个线程在读写内存。

## Wait-free

那么在多线程场景如何处理资源竞争呢，首先介绍 Wait-free 算法，这个算法是一个很强的并发算法，就好比在一个十字路口每辆车都高速驶过，既不减速也不停下来等红绿灯但是决不会发生交通事故。听起来非常神奇，是怎么做到的呢，这里要引入原子操作(atomic)这一概念，如果多个线程对一个变量的访问是原子性的，那就可以不用加锁也不用等待一个线程访问结束，因为对这个变量的读写是用一条 CPU 指令来完成的，所以如果 2 个线程一读一写，到底是先读后写还是先写后读不重要，只要不会是这个变量读到一半，剩下一半被另一个线程改了就行。

我们都直到变量是存在内存里的，但是 CPU 不是直接操作内存的而是直接操作寄存器，所以一个读的操作是先把值从内存读到寄存器，一个写操作是先把变量读到寄存器，修改寄存器里的值，再写入到内存，那么是不是 C/Rust 里的 primitive type 都是原子操作呢？这个得看情况，我用的是一个 x86-64 指令集的 CPU，并且用的是 64 位的操作系统，所以一次性最多能往寄存器里读一个 64 位的值，如 i64, u64 等所以对于简单类型是一次性就能读出来，但是对于 32 位的系统，要读一个 64 位的值要用到 2 个 32 位的寄存器，就涉及到 2 条指令，这时候就可能出现读第二条指令的时候，这部分被另一个写线程修改。

那么不同语言对原子操作的实现如何呢？

先看看 rust

rust 对 atomic 的实现可以追溯到 `src/libcore/intrinsics.rs` 这个文件，这里面有很多 atomic 相关的 api 定义，但是没有实现，我们可以肯定这部分实现是依赖于 LLVM 的，而 LLVM 是用 C++写的，所以要得探索到 C++对原子操作的实现，这就太复杂了，贴两个相关链接[llvm](http://llvm.org/docs/Atomics.html#atomic-orderings), [c++ stl](https://github.com/microsoft/STL/blob/a5a9e49fc6b87637e3c18ea23ac1c8cb176d80dd/stl/inc/atomic)

看看 Go 是怎么实现 atomic 的：

主要的 api 接口定义在 `src/sync/atomic/doc.go`，但是具体的实现在 `src/runtime/internal/atomic`，而且在这个目录下分了不同 CPU 架构的实现，我的电脑是 64 位 intel 架构的，所以用的是 `atomic_amd64.go`下的实现，不过跟 rust 版本不太一样这里没有严格定义并发原子操作的内存访问顺序，在 rust 和 C++中是有

```rust
pub enum Ordering {
    Relaxed,
    Release,
    Acquire,
    AcqRel,
    SeqCst,
}
```

的，不过在 go 中有 `LoadAcq` 这个方法，意思应该就是以 `Acquire` 的顺序来访问这块内存吧，其他更复杂的顺序没在代码中看到。

总结一下，要实现 wait-free 算法必须要保证对共享变量的访问是原子的，但是标准库中只能保证一些很简单的类型的原子访问。

## Lock-free

Lock-free 是比 wait-free 更弱一点的算法，意思就是当线程 A 在访问一块内存时，线程 B 在一边等待，等线程 A 操作结束后 B 再操作。听起来似乎是要加锁实现，也就是说 A 访问时设置锁，B 访问时检测到锁就进入等待状态，A 完成之后释放锁，这时候 B 开始进行访问。但是咱们现在讨论的是 Lock-free 算法啊，如果有锁的话和 free 这个名字冲突了，那到底是怎么实现的呢？

以下图为例，本来队列中有 1、2 这 2 个元素了，这时候 2 个线程分别要写入 3、4 到这个队列中，很可能 3、4 都会被添加到 2 后面，这样就冲突了，期望的答案应该是 2 后面跟 3,3 后面跟 4,那么要如何做呢？

```
  1           1
  |           |
  2     ->    2
 / \          |
3   4         3
              |
              4
```

为什么会出现第一种分叉的情况呢，就是因为把一个元素拼接到队列中要 2 步操作，第一步是让 3 指向 2,第二步是把队列的队尾指针指向 3,在第一步的时候很可能 3、4 都指向 2 了。要避免这种情况就得把这两步合并为一步来做，这时候又要用到一个原子操作的原语`atomic_compare_exchange`，以这个图为例，先通过`atomic_compare_exchange`检测到 2 和 3 不相等，那么就执行把 3 拼到 2 后面的操作，这时候另一个线程想把 4 拼到队尾，他通过循环执行`atomic_compare_exchange`检测到队尾的值现在是 3,和自身不相等，就把 4 拼到 3 后面

这个 atomic_compare_exchange 也就是鼎鼎大名的`CAS` compare and swap。rust中默认就用的C++的这个`atomic_compare_exchange`，但是Go的代码不太一样，具体还是在 `src/sync/atomic/doc.go`，但是方法命令类似 `CompareAndSwapInt32`，具体的实现可以追溯到`src/runtime/internal/atomic`这个目录下的`atomic_amd64.go`中的`Cas64`之类的方法，不过这个go文件只包含方法定义，具体的实现在一个汇编文件中，叫`asm_amd64.s`，具体可以贴一段代码看看

```asm
// bool Cas(int32 *val, int32 old, int32 new)
// Atomically:
//	if(*val == old){
//		*val = new;
//		return 1;
//	} else
//		return 0;
TEXT runtime∕internal∕atomic·Cas(SB),NOSPLIT,$0-17
	MOVQ	ptr+0(FP), BX
	MOVL	old+8(FP), AX
	MOVL	new+12(FP), CX
	LOCK
	CMPXCHGL	CX, 0(BX)
	SETEQ	ret+16(FP)
	RET

// bool	runtime∕internal∕atomic·Cas64(uint64 *val, uint64 old, uint64 new)
// Atomically:
//	if(*val == *old){
//		*val = new;
//		return 1;
//	} else {
//		return 0;
//	}
TEXT runtime∕internal∕atomic·Cas64(SB), NOSPLIT, $0-25
	MOVQ	ptr+0(FP), BX
	MOVQ	old+8(FP), AX
	MOVQ	new+16(FP), CX
	LOCK
	CMPXCHGQ	CX, 0(BX)
	SETEQ	ret+24(FP)
	RET
```

我是看不懂这段代码，汇编里咋还跑出了`LOCK`这个指令了，难道说所谓的Lock-free算法没有在内存设锁但是在CPU上有锁？费解

## 锁

说到锁就简单了，这是最low的一种方法，性能肯定比前2种差很多，但是用起来最简单，大家都知道锁分为2类，读写锁和互斥锁，也就是`RwLock`和`Mutex`，但是很奇怪为啥Go要把读写锁命名为`RwMutex`，rust和C++都是叫`RwLock`。接下来比较下具体的实现

Rust在锁定一个变量时会调用操作系统的api，也就是`pthread_mutex_lock`，这个方法是阻塞的，也就是说会阻塞这个线程直到获得锁，下面那个`try_lock`方法就是非阻塞的，如果当前没法获得锁就返回false有调用方决定怎么办。还有一个有意思的地方在于用户不需要手动调用`unlock`的方法来释放锁，因为rust会自动在这个锁后面的变量结束生命周期的时候释放，对用户来说又省事多了

```rust
pub unsafe fn lock(&self) {
    let r = libc::pthread_mutex_lock(self.inner.get());
    debug_assert_eq!(r, 0);
}

pub unsafe fn try_lock(&self) -> bool {
    libc::pthread_mutex_trylock(self.inner.get()) == 0
}
```

看看Go的实现吧

```go
func (m *Mutex) Lock() {
	// Fast path: grab unlocked mutex.
	if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
		if race.Enabled {
			race.Acquire(unsafe.Pointer(m))
		}
		return
	}
	// Slow path (outlined so that the fast path can be inlined)
	m.lockSlow()
}
```

又见熟悉的cas了，也就是说go没有用操作系统提供的api而是自己实现了一套，第一个判断走cas，意思是如果没有锁竞争那么直接标记为locked然后返回，如果有锁竞争呢就走下面那个`lockSlow`的方法，这个方法就复杂了，核心也是cas而且有for循环等待，有点像spinlock，但是做了很多优化

## 总结

原子操作和锁在rust和go都是在sync这个模块下，意思就是用来做多线程同步的，不过相比来说rust依赖系统调用而go是完全自己实现了一套锁，哪个实现好不好判断，因为个人喜欢rust所以觉得操作系统能解决的事情就让操作系统来做的理念更好，著名的rust开发者matklad曾经有过2篇博客比较系统自带的mutex和自己实现的spinlock哪个好，文章见下：

- [Spinlocks Considered Harmful](https://matklad.github.io/2020/01/02/spinlocks-considered-harmful.html)
- [Mutexes Are Faster Than Spinlocks](https://matklad.github.io/2020/01/04/mutexes-are-faster-than-spinlocks.html)

按他的意思是利用了系统调用的mutex比用户态自己实现的spinlock好，所以无脑一下rust的锁比Go的高明吧！
