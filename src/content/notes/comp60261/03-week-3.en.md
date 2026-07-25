---
subject: COMP60261
chapter: 3
title: "Week 3"
language: en
---

# COMP60261 — Week 3: Operating Systems, Part 1

**Scope:** what an OS is and the security goals it exists to enforce; how the kernel actually gets onto the CPU; and the three core subsystems — processes, scheduling, and memory management.

**Covers lectures:** 12 OS Introduction · 13 OS Basic Practical Aspects · 14 Process Management · 15 Scheduling · 16 Memory Management

**Terminology note used throughout the unit:** *OS* means **kernel**. The lecturer states this explicitly — where these notes say "the OS does X", read "the kernel does X". Userspace utilities, libraries and the package manager belong to the *distribution*, not the OS.

---

# Part 1 — What an operating system is (Lecture 12)

## 1.1 Definition and the two roles

An OS is software that **manages hardware and software resources** and acts as the interface between applications and the machine. It exists to provide an interface that is simultaneously **convenient** and **secure**.

Those two adjectives carry the whole lecture. Convenience alone would be a library. Security is what forces the OS to sit *between* applications and hardware rather than beside them, and it is why applications cannot be permitted to touch most hardware directly.

The functions provided: process and thread management, memory management, filesystems and storage, networking, device management, and IPC.

## 1.2 Kernel versus distribution

| | Contents | Examples |
|---|---|---|
| **Kernel** | The core managing CPU, memory, devices | Linux kernel, Windows NT kernel, XNU (macOS) |
| **Distribution** | Kernel **plus** utilities, libraries, package manager, UI, apps | Ubuntu, Fedora, Debian |

The distinction matters for TCB reasoning: a vulnerability in a distribution's userspace daemon is a fundamentally different problem from one in the kernel, because the kernel is in the TCB of *everything*.

## 1.3 A brief history, and what each step added

- **1950s–60s — monitors (batch systems).** Jobs queued on magnetic tape, run one after another. Example: IBM IBSYS.
- **1970s — time-sharing.** Multiple users share one machine. UNIX (Bell Labs) is the ancestor of most of what follows.
- **1980s — personal computers.** MS-DOS, early Macintosh OS. Also the rise of **embedded/real-time** OSes with microcontrollers — still highly relevant today for IoT.
- **1990s–2000s — GUI-based OSes** (Windows, Linux, macOS), plus networking and internet support.
- **Modern era — mobile** (Android, iOS) and **cloud/virtualisation** (VMs, containers), with security and multicore support as first-class concerns.

**The thread running through this:** each step added more *sharing* — of one machine between jobs, then users, then applications, then tenants. Every increase in sharing created the isolation requirements that define OS security. Batch monitors barely needed isolation; a cloud host needs it absolutely.

## 1.4 OS architectures (previewed here, developed in Week 4)

- **Monolithic kernel** — all OS services in one large privileged binary (Linux).
- **Microkernel** — a minimal kernel (IPC, scheduling) runs privileged; drivers and services are **deprivileged** into userspace (MINIX, QNX). Windows NT is a hybrid.
- **Research/exotic models** — multikernel, exokernel, unikernel.

## 1.5 Security goals, stated precisely

The lecturer frames OS goals as three, the third being non-negotiable:

1. Provide convenient **resource mechanisms** — processes, filesystems, memory management.
2. **Efficiently multiplex** access to those resources.
3. **Ensure the security of all applications.**

Security here means correct *design* **and** correct *implementation* of both the mechanisms and the scheduling. Three concrete invariants are given:

- An application must not access another application's address space.
- An application writing to a file must not overwrite disk space allocated to another file.
- An application must not hog the CPU at the expense of others.

Note these map cleanly onto **confidentiality/integrity** (the first two) and **availability** (the third).

**The two contexts in which these break:** *fault tolerance* — mechanisms misused inadvertently, by buggy software; and the **adversarial context** — mechanisms misused deliberately. The second is the harder problem and the one this unit is about.

### The "secure operating system" is an oxymoron

The lecturer is explicit: no system of modern complexity is fully secure. A secure OS is an **ideal goal**, not an achievable state. This framing recurs — it is why the unit is organised around mitigations, TCB reduction, and threat models rather than around achieving security outright.

### The subject/operation/object formulation

Security goals are generally stated as: what **subjects** (applications, users) may perform what **operations** (read, write) on what **objects** (files, sockets, bytes in memory). This triple is the standard access-control framing and it returns in Week 4 with DAC, MAC and capabilities.

Applying **least privilege** and maintaining **CIA** is the aim — and the lecturer notes these are frequently **at odds with the OS's other goals**: performance and convenience. That tension is a recurring exam theme.

## 1.6 The TCB and its three requirements

The **Trusted Computing Base** is the set of components enforcing the security goals. The lecture gives three requirements it must satisfy — worth memorising as a triple, since it is the classic *reference monitor* definition:

1. **Mediate all security-sensitive operations** — nothing may bypass it (complete mediation).
2. **Be correct** — it must actually implement the policy properly.
3. **Not be tamperable** by software outside the TCB.

For a typical system the TCB is: **hardware, the boot process, all OS code, and some privileged applications**.

Two honest admissions accompany this, and both are examinable:

- The TCB can be **hard to define precisely**.
- It is **mostly impossible to formally prove correct**.

So the security of the entire system rests on components that are assumed to work correctly — while being large programs, generally written in memory-unsafe languages, which Week 2 established will contain vulnerabilities. This is the lecture's closing argument and the intellectual bridge from Week 2 to the rest of the unit.

## 1.7 Threat models

A threat model defines **what an attacker can do**, and is scenario-dependent. Examples given:

- A **remote** attacker sending malformed network packets.
- A **local** attacker running a malicious application, attempting privilege escalation to root.
- A **malicious device** misbehaving to compromise driver/OS code.
- A **compromised boot process** loading malicious kernel components or a rootkit.
- An attacker reading the **kernel log** to leak information — for instance to defeat ASLR — or to erase traces of intrusion.

That last one is worth dwelling on: the kernel log is not usually thought of as sensitive, but leaked kernel pointers defeat KASLR (the Week 2 infoleak lesson), and log erasure defeats forensics. It illustrates that the attack surface includes *information* channels, not just execution paths.

---

# Part 2 — How the kernel actually runs (Lecture 13)

## 2.1 The layering, and why applications are kept off the hardware

Hardware (CPU, memory, I/O) → OS manipulates it directly → applications run on top. Applications cannot be allowed direct hardware access for **safety and stability** reasons.

Instead the OS provides **standardised abstractions**: processes and threads for CPU/memory, filesystem for storage, sockets for network. These are reached through one standard API: **system calls** (`open`, `read`, `write`, `mmap`, …).

## 2.2 Boot sequence

1. Power on.
2. Motherboard firmware (BIOS/UEFI) performs basic hardware initialisation, then runs the boot loader.
3. Boot loader (e.g. GRUB) takes over.
4. The boot loader loads the **kernel**, which starts running.
5. The kernel initialises more hardware and itself.
6. Once ready, it can run applications.

Boot matters for security because it establishes the initial TCB — hence the "compromised boot process" threat above, and hence secure/measured boot.

## 2.3 Execution model on the CPU

The CPU is ALU + control logic + registers. The **instruction pointer** (program counter) points at the instruction currently executing. Load/store instructions read and write memory.

The crucial abstraction: **the contents of the registers define the application's state on the CPU**, and that state can be **saved to and restored from memory**. That single fact is what makes a context switch possible, and therefore what makes multitasking possible.

## 2.4 Kernel invocation — when does kernel code actually execute?

This is the central question of the lecture, and the lecturer's framing is specific. The kernel runs on only **two** occasions:

1. **At boot**, after the boot loader has loaded it.
2. **At runtime, when an interrupt is received by the processor.**

And there are **two types of interrupt**:

- **Hardware interrupts** — for I/O; a *device* signals the CPU.
- **Software exceptions** — e.g. division by zero; the *CPU interrupts itself*.

> **Exam flag.** Learn this as "boot + interrupts, where interrupts are hardware interrupts or software exceptions." A **system call is a software exception** deliberately triggered by a special instruction — it is not a third category. Many textbooks present syscalls/interrupts/exceptions as three peers; this unit derives syscalls as a *case of* the exception mechanism, and an answer that shows that derivation is stronger than one that lists three items.

The consequence: between these events, the kernel is **not running**. It is not a process with its own scheduled thread; it is a body of privileged code entered on demand, executing in the context of whatever was interrupted.

## 2.5 Memory protection via the MMU

The requirement: **an application must not read or write the memory of another application or of the kernel.**

The mechanism: the OS sets up the **MMU** to perform virtual→physical translation. Each application is "tricked" into believing it has access to all of memory, while being structurally unable to *name* addresses belonging to others — an unmapped address simply cannot be expressed. This is enforcement by construction, not by checking.

## 2.6 System calls: the controlled doorway

If an application cannot access kernel data or run kernel code, how does it invoke OS services? By executing a **special instruction that triggers an exception**, causing the CPU to start running the kernel to handle the request.

### API versus ABI — a distinction the lecture makes carefully

- A C program calls `read()`, `write()` — functions implemented by **libc**. Libc is compiled *with* the application and exposes a source-level **API**.
- But libc must invoke the OS, which is **not** compiled together with the application, and may be written in a different language.
- Therefore an API is insufficient. What is needed is an **ABI** — a machine-language-level convention specifying *what goes in which registers* and *what instruction to use*.

> **Exam flag.** The API/ABI distinction is set up deliberately and is a likely short-answer question. The reasoning is: *different compilation units, possibly different languages, so agreement must be at the binary level, not the source level.*

### The System V ABI on x86-64

Linux uses the **System V ABI**. A system call is invoked as follows:

1. Place arguments in order in `%rdi`, `%rsi`, `%rdx`, `%r10`, `%r8`, `%r9`.
2. Place the system call **id** (a unique integer) in `%rax`.
3. Execute the `syscall` instruction — this triggers the exception and traps to the kernel.
4. On return to userspace, the kernel has placed the return value in `%rax`.

You can invoke this by hand in assembly, which is instructive precisely because it demonstrates there is nothing magical about libc — it is a thin wrapper placing values in registers and executing one instruction.

### The world switch

On `syscall`:

- The CPU switches from **user mode to supervisor mode**.
- It jumps to a **predefined** piece of code: the **system call handler**. (Predefined, not caller-chosen — this is a control-flow-integrity property: userspace picks *which* service via `%rax`, never *where* to jump.)
- The kernel handles the call.
- The kernel executes **`sysret`**, which switches back to user mode and jumps to the instruction after `syscall`.

> **Exam flag — quantitative.** World switches are **costly: hundreds, up to thousands of cycles.** This number is the justification for several later design decisions: futexes (§3.7), shared memory over pipes (§3.6), virtio batching, and seccomp's value in reducing reachable kernel code. If a question asks *why* a mechanism avoids the kernel, the answer is this cost.

## 2.7 Privilege modes

Some instructions are **privileged** and must only be executed by the kernel: installing a new page table, communicating with hardware, shutting down or resetting the CPU.

At any moment the processor is in one of two modes:

- **User mode** — applications run.
- **Supervisor mode** (kernel mode) — the kernel runs.

A privileged instruction **executes successfully in kernel mode**, but **triggers an exception and traps to the kernel when invoked in user mode**. Note the elegance: an attempted violation is itself routed to the kernel, so the kernel gets to decide what happens.

On x86 these modes are called **protection rings**. x86-32 had rings 0–3; **rings 1 and 2 were dropped with x86-64**, leaving ring 0 (supervisor) and ring 3 (user).

## 2.8 Wrapping up Part 2

The OS abstracts hardware for **ease of use and for security**:

- Applications cannot access each other's memory or the kernel's memory → enforced by the **MMU / virtual memory**.
- Applications cannot execute privileged operations → enforced by **privilege levels**.
- The only way in is a safe, controlled interface: **system calls**.

Both enforcement mechanisms are **hardware** features that the OS configures. The OS sets policy; the hardware enforces it on every access.

---

# Part 3 — Process management (Lecture 14)

## 3.1 What a process is

**An instance of a running program.** The program is "tricked" by the OS into believing it is alone on the machine:

- **Memory:** each process has its **own virtual address space**.
- **CPU:** each process is **transparently scheduled** in and out of the CPU.

A process also owns:

- **Handles to system resources** maintained by the kernel — file descriptors, sockets.
- An **execution context** — the values in the CPU registers.

## 3.2 PIDs and the process tree

Each process has a unique integer **PID**. A process obtains its own with `getpid()`; `ps -e` lists all processes.

**Every process must be created by another process**, establishing a parent/child relationship. At boot, once the kernel finishes initialising, it creates the first process — **PID 1**, historically `init`. That process creates children, which create children, and so on, producing the system **process tree** (viewable with `pstree`).

## 3.3 `fork` — the one and only way to create a process

A parent calls `fork` to create a child. The critical property:

> **The child is not created empty — it is a duplicate of the parent's state at the moment `fork` was called.**

Specifically the child receives a copy of:

- the **address space**,
- **system resources** such as file descriptors,
- the **execution context** (CPU register values).

Under the hood on Linux, `fork` is implemented by libc over the **`clone`** system call. Because the register state is duplicated, the **return path is executed by both parent and child** — which is why `fork` appears to return twice.

Return-value convention:

| Return | Meaning |
|---|---|
| `-1` | error (in the parent only) |
| `0` | you are the **child** |
| `> 0` | you are the **parent**; the value is the **child's PID** |

After `fork`, parent and child run **concurrently**.

The standard demonstration: a program with a global and a local variable prints them, forks, and both processes then modify and reprint them. The child initially sees the *same* values — proving the address space started as a copy — and after modification each sees only its *own* values — proving the address spaces are **private and independent**.

## 3.4 How the OS implements `fork`: copy-on-write

Copying the entire mapped address space at `fork` time would waste enormous amounts of memory and time — there may be megabytes or gigabytes mapped. Instead the OS uses paging to implement **on-demand, copy-on-write (CoW) address space duplication**:

1. On return from `fork`, the child gets a **copy of the parent's page table**. Both address spaces are identical, and mapped virtual pages point to the **same physical pages**.
2. **Read** accesses proceed normally — as long as neither party writes, there is no reason for them to see different content.
3. Only when one **writes** is the corresponding physical memory actually copied and the page table updated.

The copy happens at the granularity of a **page — 4 KB** in the vast majority of systems.

> **Exam flag.** CoW is asked about in two directions: *why* (avoid copying gigabytes, most of which is discarded immediately by a following `execve`) and *how* (shared physical pages marked read-only; a write faults; the fault handler copies one page and remaps). Mention the **4 KB granularity** — it is the kind of concrete detail that distinguishes a strong answer.

## 3.5 `execve` — running a different program

`fork` alone gives a duplicate. To run a *new* program, the idiom is **`fork` + `execve`**: the parent forks, and the **child** calls `execve`.

What the kernel does on `execve`:

1. Creates a **new, blank address space**. The duplicated parent address space is **completely lost**; the new program starts from its entry point.
2. The kernel's **loader** reads metadata from the binary: which **segments** to load, the **program entry point**, and whether an **interpreter** is required (the userspace loader `ld-linux.so`).
3. Loads the binary directly (static binaries) or loads the **interpreter** instead (dynamic binaries and scripts), passing the target program as a parameter.
4. Allocates a **stack** and populates it with what the program needs — `argc`, `argv`, environment variables.
5. Returns to userspace at the program's (or interpreter's) entry point. For dynamic binaries the interpreter then loads the program in userspace.

Note that a call to `execve` that returns has **failed** — on success there is nothing left to return to.

> **Exam flag.** Be able to say *why* the pairing exists: `fork` creates the process, `execve` replaces its contents. The gap between them is where the child adjusts file descriptors and credentials — where a shell sets up pipes and redirection, and where a privileged program must **drop privileges before exec'ing anything untrusted**.

## 3.6 Inter-process communication

Multiprocess applications — browsers, servers, GUI applications — use several processes to exploit parallelism, run background operations, and **sandbox untrusted code**. These processes must **communicate** and **synchronise**. All such mechanisms are provided by the OS and reached through system calls.

### Signals

A **notification sent by the kernel to a process**.

- Sent on certain events (Ctrl+C, segmentation fault), and can also originate from another process.
- Beyond a signal **type** (an integer id), it **carries no data**.
- A process installs **handlers** (via `sigaction`) invoked when a given signal arrives.
- **If a signal with no handler is received, the OS kills the process.**

**Implementation.** The kernel delivers signals **lazily**: it checks whether any signal is pending for a process **immediately before returning to userspace** (from a syscall or interrupt). If one must be delivered, it determines the action — call a handler, or kill.

If a handler must run, the kernel **modifies the userspace execution context that is about to be restored**:

- the PC is pointed at the **handler**;
- the **stack** is set up with signal information and with the means to return from the handler — the **`sigreturn`** system call.

Control then returns to userspace, the handler runs, and `sigreturn` cleans up the stack frame and resumes normal execution.

> **Worth noticing.** The kernel achieves signal delivery by *forging a stack frame and redirecting the PC in userspace* — mechanically the same primitive an attacker wants from a control-flow hijack. The difference is who is authorised to do it. (This is also why `sigreturn`-oriented programming, SROP, is a real exploitation technique.)

### Pipes and sockets

**Data communication channels** — pipes are **unidirectional**, sockets **bidirectional**.

- Set up with specific system calls, then read from and written to.
- Visible to multiple processes as **pseudo-files on the filesystem** — this is *how* they are shared, since the filesystem is a namespace visible to all processes.
- Use **kernel buffers** for data in transit.
- The kernel also **puts processes to sleep** — a writer to a full pipe, or a reader from an empty one.

### Shared memory

All the above involve **many system calls** during intense communication — poor performance, because user/kernel switches are costly (§2.6).

**Shared memory** is more basic but faster: **physical pages mapped into the address spaces of two or more processes**, achieved by the OS setting up the page tables to point at the **same physical pages**. Established with `mmap` using `MAP_SHARED`.

Once established, communication involves **no kernel involvement per access** — the reason it is the fastest option, and simultaneously the reason it is the most dangerous, since it deliberately punctures isolation and requires explicit synchronisation.

## 3.7 Synchronisation

### Race conditions

Concurrent reads and writes to shared data create the need for synchronisation. The canonical failure: a process is **preempted in the middle of updating a large data structure**; a second process is scheduled and reads the **inconsistent, half-updated** structure. That is a **race condition**, and it is a bug.

### Critical sections and atomicity

Code where processes access shared data is a **critical section**. To avoid races, critical sections must execute **atomically**, which the lecture defines with **two rules**:

1. A critical section can only be executed by **one process at a time**; and
2. Once a process **starts** executing a critical section, it must **finish** it before another process may start executing that critical section.

> **Exam flag.** Give **both** rules. Rule 1 alone (mutual exclusion) is the answer most people give; rule 2 (no interleaving once started) is what actually rules out the half-updated-structure scenario.

Atomicity is ensured with **locks**. The protocol: both processes attempt to take the lock; exactly one succeeds; the winner executes its critical section while **the loser is put to sleep by the OS**; on release, the waiter retries, acquires, and proceeds.

### Lock implementation and the futex optimisation

The OS **must** be involved in locking, because only the kernel can put processes to sleep and wake them. Historically this meant a **costly system call for every lock and unlock operation** — very expensive.

The optimisation is the **futex** (*fast userspace mutex*), which implements the lock **partially in userspace**:

- A **shared userspace variable** indicates whether the lock is free, accessed with **atomic CPU instructions**.
- The kernel is entered **only when actually needed** — when a process must be put to sleep or woken.

So in the **uncontended** case the lock is taken and released with **no system call at all**.

> **Exam flag.** Futex is a direct application of the world-switch cost from §2.6: identify the common case (uncontended), handle it without the kernel, and pay the kernel cost only in the rare case. This "fast path in userspace, slow path in the kernel" pattern recurs throughout systems design.

## 3.8 Threads

**A thread is an execution flow within a process.** Every process has at least one — the flow that begins at the program's entry point at load time. More can be created, e.g. with the POSIX threads library (`pthread`) in C.

The defining property: **threads of the same process share the same address space.** They can therefore communicate via global variables and by exchanging pointers — and because they **run concurrently**, this creates race conditions and the same need for synchronisation.

**Implementation by the OS:**

- From the OS's point of view a thread is a **task — the smallest schedulable entity**.
- Threads are created with the **same system call as `fork`: `clone`**.
- Threads of one process share an address space by literally **using the same page table**.
- All threads of a process report the **same PID**, but each also has a unique **TID** (thread identifier).
- **Many scheduler-related system calls take a TID, not a PID** — because threads, not processes, are what gets scheduled.

> **Exam flag — high value.** *The OS does not schedule processes; it schedules threads.* The lecturer states this directly and it is reinforced at the start of Lecture 15. Any scheduling answer that says "the scheduler picks the next process" is using the wrong model. The PID/TID asymmetry is the observable consequence.

---

# Part 4 — Scheduling (Lecture 15)

## 4.1 What scheduling is, and its four objectives

Scheduling **determines what tasks run on which CPU cores, when, and for how long**. In Linux the schedulable entity is the **thread**. Where `#tasks > #cores` — almost always — tasks are **multiplexed in time**, fast enough to give the illusion of parallel execution.

The four desirable properties:

| Objective | Meaning |
|---|---|
| **Throughput** | Run as many tasks as possible; minimise context-switch overhead |
| **Responsiveness** | Low overhead; respond quickly, or in bounded time, to events |
| **Fairness** | Tasks of equal priority get equal shares of CPU time |
| **Scalability** | Support many tasks and many cores |

> **Exam flag.** These four are listed explicitly and restated in the summary. Learn them as a set, and be ready to explain why they **conflict** — maximising throughput favours long timeslices, responsiveness favours short ones.

## 4.2 Cooperative versus preemptive — a security argument

**Cooperative scheduling.** A task does not stop running until it chooses to **yield** or finishes. The consequence: **the OS cannot enforce fairness.** A malicious task that never yields monopolises the CPU — a **denial of service**.

**Preemptive multitasking.** The OS can **interrupt** a task's execution — **preemption** — for example when it expires its timeslice, or when a higher-priority task becomes ready. The lecture's judgement: preemption is **necessary when assuming adversarial workloads**.

> **Note on the slide's wording.** The slide describes the cooperative DoS as compromising *integrity*. Denial of service is properly an **availability** failure under the CIA triad — the CPU-hogging invariant from Lecture 12 (§1.5) is explicitly the availability one. If this comes up, the safe answer is "availability", while noting that a scheduler that cannot enforce its own policy has also lost the integrity of the *mechanism*. Flagging the distinction is likely to read as understanding rather than pedantry.

## 4.3 Traditional algorithms, and why they are insufficient

- **First-Come, First-Served (FCFS)** — a FIFO queue; tasks run in the order they become ready until they yield or finish.
- **Round Robin** — tasks run for a fixed **quantum** in rotation.
- **Priority Scheduling** — priorities determine selection.
- **Multilevel Feedback Queues** — ready tasks separated into multiple queues, favouring tasks with short CPU bursts and heavy I/O.

The verdict: these are **not really scalable to modern systems**. They are pedagogically useful but none is efficient for modern workloads on modern machines.

**Two reasons modern systems need better schedulers:**

1. **Increasing core counts** over the last two decades.
2. **Mixed workloads** — interactive plus batch, and in some settings real-time:
   - **Batch/background** (e.g. a video encoder, ML training): CPU/memory-bound, long-running, throughput-oriented; wants to run as much as possible to **keep caches warm**, but is **fine with being preempted**.
   - **Interactive** (e.g. a text editor): I/O-bound (keyboard), needs **little CPU** but demands **responsiveness**.
   - **Real-time**: needs **deterministic scheduling latency** — e.g. a guarantee that brakes engage within a bounded time of a sensor triggering.

The insight from the batch-vs-interactive illustration: **perfectly equal CPU shares would be the wrong answer.** The text editor needs only a few cycles, but *promptly*; the encoder wants everything left over. Good scheduling is therefore not equal division but **matching each task's actual need**.

## 4.4 Linux scheduler history

| Scheduler | Notes |
|---|---|
| Original (1990s) | Did not scale to many tasks and cores |
| **O(1) scheduler** (2003) | **Constant-time** scheduling decisions, good scalability, but **problems with interactive tasks** |
| **CFS — Completely Fair Scheduler** | Introduced in **Linux 2.6.23** (2007); the current scheduler for this unit |

## 4.5 CFS: the core idea

Assume a single core first.

- CFS defines a **fixed time interval within which every thread must run at least once**.
- The interval is divided into **timeslices — one per thread**.
- Each thread's timeslice is computed **proportionally to its weight**, which derives from its priority (the **nice** value).
- As threads run, CFS tracks their **`vruntime`**:

$$\text{vruntime} = \frac{\text{time spent running}}{\text{weight}}$$

A running thread is **preempted** when either:

1. it **exceeds its timeslice** and other threads are ready to run; **or**
2. **another thread with a smaller `vruntime` wakes up**.

Threads ready to run are held in a **runqueue: a red-black tree**.

> **Exam flag.** Both preemption triggers are examinable — most answers give only the timeslice one. The second (a waking thread with smaller `vruntime`) is what delivers **interactive responsiveness**.

## 4.6 The runqueue

- Threads are sorted in the red-black tree by **increasing `vruntime`**.
- The **next thread to run is always the leftmost node** — cheap to find.
- Insert, delete, rebalancing and recolouring are all **O(log n)** — which is what keeps scheduler overhead low as thread counts grow.

## 4.7 `vruntime` and the nice value

`vruntime` increases as a task runs, **weighted by the nice value**. Note the inversion: **the higher the nice value, the "nicer" the thread** — i.e. the more willing it is to let others run, hence the *lower* its priority.

The formula ensures:

- **CPU-heavy threads increase `vruntime` faster**, so they drift rightwards in the tree and are selected less often.
- **I/O-bound / interactive threads get scheduled sooner**, because while blocked they accumulate no `vruntime` at all, so on waking they sit at or near the leftmost position.

> **Exam flag.** The key insight is that **interactivity requires no special case**. Older schedulers needed heuristics to detect interactive tasks; CFS gets the behaviour for free from the fairness rule, because blocking *is* not accumulating `vruntime`. Being able to state this is worth more than reciting the formula.

## 4.8 CFS on multiple cores

- **One runqueue (red-black tree) per core.**
- Per-core runqueues allow context switches **without costly inter-core synchronisation** — a single shared runqueue would need locks, which would not scale.
- But runqueues must be kept **balanced** — you do not want one core loaded with many high-priority threads while another holds a single low-priority one.
- Hence a relatively complex **load balancing** algorithm that migrates threads between runqueues, considering:
  - thread **priorities**,
  - the **number of threads** in each runqueue,
  - the system **topology** — cache hierarchy, **SMT**, **NUMA** — because migration has a real cost: the thread must rebuild its cache state on the target core.

## 4.9 Preemption mechanics and context switches

Preemption does **not** happen instantly at the moment the scheduler decides it should:

1. A **per-CPU flag** is set to indicate preemption is required — when the running thread exceeds its timeslice, or a higher-priority (lower-`vruntime`) thread wakes.
2. The flag is **checked on returning from an interrupt** — a system call, exception, or hardware interrupt.
3. If set, **preemption happens** at that point.

If another thread is to run, a **context switch** occurs:

- **Switch the address space** to the target thread's — by writing the control register holding the page table root.
- **Switch the CPU state** — the registers.

> **Exam flag.** The deferred, flag-based mechanism is a favourite detail. Preemption is *requested* by the scheduler but *taken* at the next kernel-exit boundary — which is precisely why §2.4's "the kernel only runs on interrupts" matters: interrupts are the only moments at which the kernel is running and can act.

Note also that threads of the **same process** share a page table, so switching between them **skips the address-space switch** — one reason thread switches are cheaper than process switches.

## 4.10 Security aspects of scheduling

An attacker who can **manipulate scheduling parameters** can readily compromise **availability** — for instance by giving malicious threads a higher priority, or selecting a prioritised scheduling policy such as real-time.

Two defences:

1. **Prevent untrusted users from accessing scheduling parameters** — e.g. by filtering the system calls an untrusted application may issue (previewing seccomp in Week 4).
2. **Use additional CPU isolation mechanisms — control groups (cgroups)**, which:
   - allow **CPU quotas/weights** to be set for threads,
   - are **scheduler-independent**,
   - are covered properly under virtualisation later in the unit, and are what containers use.

---

# Part 5 — Memory management (Lecture 16)

## 5.1 What memory management covers

The set of OS features managing allocation of, and access to, memory:

- Memory allocation/deallocation **for applications and for the kernel**.
- Setting up and maintaining **address spaces** for processes and the kernel.
- Enforcing **memory protection (isolation)** — between processes, and between processes and the kernel.
- **Swapping** — using secondary storage as main memory.

## 5.2 Virtual memory: segmentation then paging

The CPU accesses memory with load and store instructions. **At boot the OS enables virtual memory**, after which **every load/store targets a virtual address**, translated **transparently** to a physical address by the **MMU**.

**Segmentation** (the old implementation). A process gets a relatively small virtual address space — a **segment** — mapped **contiguously** onto physical memory, so translation is effectively **adding an offset** to the virtual address. Each process gets its own segment at a different physical location, which provides isolation. Its problems: **inflexibility** and **fragmentation**.

**Paging** (today). Nearly the entire space addressable by the address bus width is available to each process. On most Intel 64-bit CPUs virtual addresses are **48 bits**, giving each process a **256 TB** virtual address space — of which most is unmapped. Mapping is at the granularity of **4 KB pages**, described by a **page table**.

**Each process has a different page table**, and without explicitly established shared memory, processes **share no physical pages** — hence full isolation.

## 5.3 The page table

- Virtual→physical mapping at **4 KB page** granularity.
- **One page table == one address space == one per process.**
- Page tables are:
  1. **Set up and controlled by the OS** — created when the process is created, and maintained as mappings are added or removed (loading a shared library, allocating memory);
  2. **Walked transparently by the MMU** when the CPU performs loads and stores.

### Why a tree rather than an array

A linear array with one entry per virtual page would be **hugely wasteful**: a 64-bit address space is very **sparse** — enormous numbers of pages, almost all unmapped.

Instead the page table is a **tree of pages** holding translation data — **4 levels** on most modern 64-bit CPUs, with 5-level designs beginning to appear. The tree lets the system avoid storing translation data for the vast unmapped regions.

The **root address of the tree is held in a control register** — `%cr3` on x86-64. **Changing address space during a context switch is therefore just writing a new root into that register.**

### The walk, step by step

Each translation page is 4 KB and holds **512 pointers** (512 × 8 bytes = 4 KB). Each entry is either **present** (referring to a page at the next level) or **absent** (that range of the address space is unmapped). All pointers in translation pages refer to **physical** addresses.

For a 48-bit virtual address on x86-64:

| Bits | Used for |
|---|---|
| 39–47 | index into the **root (4th level)** page, from `%cr3` → gives the 3rd-level page |
| 30–38 | index into the **3rd level** → gives the 2nd-level page |
| 21–29 | index into the **2nd level** → gives the 1st-level page |
| 12–20 | index into the **1st level** → gives the **physical data page** |
| 0–11 | **offset** of the byte within that 4 KB page |

Check the arithmetic: 4 × 9 index bits + 12 offset bits = 48 bits, and 2⁹ = 512 entries per level — the numbers are mutually determined.

### Page table entries

Each translation page holds **512 entries of 64 bits**. But the full 64 bits are not needed to reference the next level:

- the virtual address space is indexed on **48 bits**, not 64;
- entries reference **physical page indices**, not full physical addresses — and there are far fewer pages than addresses.

Roughly **36 bits** suffice for the reference, leaving the remaining bits available for **metadata** about the referenced range:

- **Present** — is this range actually mapped?
- **Read/write** — may it be written?
- **User/supervisor** — is it accessible from user mode, or supervisor only?

If an access is to a non-present page, or is denied (e.g. a write to a read-only page), the CPU raises a **page fault exception**.

> **Exam flag.** Note the framing: the metadata bits exist *because there were spare bits*, and they are used to implement not only **memory protection** but also **CoW** and **swap**. One mechanism — the present/permission bits plus the page-fault exception — underlies three features. That unification is a strong point to make in an answer.

## 5.4 Where the kernel lives, and why

Because of the **user/supervisor** protection bit, **the kernel can be mapped into the address space of every process** — in Linux, at the **top** of each address space — with that region marked **supervisor-accessible only**.

The advantage is significant: **no page table switch is needed on a system call.** Switching page tables is very costly because it entails **flushing the TLB**, the translation cache.

This gives the **two mechanisms enforcing the main memory-protection invariants**:

| Invariant | Mechanism |
|---|---|
| A process's memory is not accessible from other processes | **Different page tables** — disjoint, non-overlapping address spaces |
| Kernel memory is not accessible from processes | **User/supervisor protection** within each address space |

> **Exam flag — high value.** This two-line table is the summary of the entire lecture and is stated twice (in the body and in the summary). If asked "how does the OS enforce memory isolation?", these are the two answers, and they are *different mechanisms* — one is separation, the other is permission.
>
> Connect forward: **Meltdown** breaks the second one microarchitecturally, which is why **KPTI** must undo the "kernel mapped in every address space" optimisation and pay the page-table-switch cost the design was created to avoid. Week 4 and the hardware lectures both return to this.

## 5.5 The kernel address space

Zooming into the kernel's portion, the notable regions:

- **dirmap** — a **direct linear mapping of all physical memory**. Useful when the kernel needs to touch physical memory directly, e.g. when setting up page tables, or allocating physically contiguous memory.
- **vmalloc area** — effectively the **kernel heap**, serving `vmalloc` allocations.
- **Kernel code and static memory** (`.data`, `.bss`) — mapped from the kernel binary at boot, like a normal program.
- **Modules** — pieces of kernel code loadable and unloadable **at runtime without rebooting**, placed in their own region.

## 5.6 How allocation works

When the kernel needs memory — for itself or for an application:

1. **Reserve free physical memory** sufficient for the request. The pages **need not be physically contiguous**.
2. If not already mapped:
   - **Find a free range of virtual memory** — within the kernel's region if the kernel is asking, or within the process-accessible region if a process is.
   - **Create the page table entries** for that range.
   - **Map the virtual pages to the reserved physical pages** — usually **later, on demand**.
3. **Return a pointer** to the virtual area.

The on-demand step is done by **leaving the present bit unset**: the first access triggers a **page fault**, at which point the kernel performs the mapping and restarts the access.

**All allocations are served by the kernel.** From userspace this goes through **`mmap`**. Note that **`malloc` is implemented in userspace by libc** — it calls `mmap` under the hood to obtain a large region of virtual memory, then subdivides it to satisfy individual requests.

> **Exam flag.** "Is `malloc` a system call?" — **no**. It is a libc function that uses `mmap` (or `brk`) to obtain memory in bulk and then manages it in userspace. This is the same fast-path/slow-path pattern as the futex: avoid the world switch in the common case.

## 5.7 The kernel's allocators

### `kmalloc` versus `vmalloc`

| | `kmalloc` | `vmalloc` |
|---|---|---|
| Size | **Small** allocations | **Large** allocations (page granularity) |
| Speed | Fast | Slower — must modify the page table |
| Physical contiguity | **Always contiguous** | Not contiguous |
| Mapping | Memory returned **already mapped** (via dirmap) | Page table modified; **mapped on demand** |
| Usable when code cannot sleep (e.g. interrupt context) | **Yes** | No |

That last row is the one people forget: `kmalloc` is usable in **interrupt context**, where kernel code **cannot sleep**.

### The SLAB layer

`kmalloc` relies on the **SLAB layer** — a system of **caches that reuse same-size allocations** as far as possible.

- Good for **performance** and for **reducing fragmentation**.
- Especially useful when **many data structures of the same type** are allocated frequently — exactly the kernel's workload.
- Kernel code may also **create its own SLAB caches** directly, without going through `kmalloc`.

### The buddy (physical page) allocator

All allocation methods ultimately rest on the **buddy system**, also called the frame allocator (a *frame* being a physical page).

- Allocates physical memory at **page granularity**.
- Maintains **lists of blocks of same-size, power-of-two runs of contiguous free pages** — 1, 2, 4, 8, … — to limit fragmentation.
- Blocks are **split** (into "buddies") and **merged** as needed.

**The allocation stack, top to bottom:** userspace `malloc` (libc) → `mmap` (syscall) → kernel allocators (`kmalloc` → SLAB, or `vmalloc`) → **buddy system** → physical pages.

---

# Exam flags and lecturer emphasis

Derived from what the lecturer stresses in the narration, repeats across slides, and restates in the summary slides. Nothing here is an explicitly marked "exam question", but these are the load-bearing points.

## Definitions to be able to state exactly

1. **TCB's three requirements** — mediates all security-sensitive operations, is correct, cannot be tampered with from outside. Plus the two admissions: hard to define precisely, essentially impossible to formally verify.
2. **Atomicity's two rules** — one at a time, *and* no interleaving once started.
3. **The four scheduling objectives** — throughput, responsiveness, fairness, scalability.
4. **`vruntime`** = running time ÷ weight, and the **two** preemption triggers.
5. **The two memory-protection mechanisms** — separate page tables (process↔process); user/supervisor bit (process↔kernel).

## Framings this unit uses that differ from generic textbooks

- **The kernel runs only at boot and on interrupts**; interrupts are either **hardware interrupts** or **software exceptions**; a **syscall is a software exception**, not a third category.
- **Threads, not processes, are scheduled.** PIDs are shared across a process's threads; **TIDs** are what scheduler syscalls take.
- **"OS" means "kernel"** in this unit.
- **A secure OS is an oxymoron** — an ideal, not an achievable state.

## Quantitative facts worth quoting

| Fact | Value |
|---|---|
| Page size | **4 KB** |
| World switch (user↔kernel) cost | **hundreds to thousands of cycles** |
| Virtual address width, x86-64 | **48 bits** → **256 TB** per process |
| Page table levels | **4** (5 emerging) |
| Entries per translation page | **512** (× 64 bits = 4 KB) |
| Bits needed to reference the next level | ~**36**, leaving the rest for metadata |
| Page table root register | **`%cr3`** |
| Red-black tree operations | **O(log n)**; next task is the **leftmost node** |
| CFS introduced in | **Linux 2.6.23** (2007); O(1) scheduler 2003 |
| Rings on x86-64 | **0 and 3** only — 1 and 2 dropped |

## Mechanisms and their justifications (the "why" is usually the question)

| Mechanism | Justification |
|---|---|
| **Copy-on-write** on `fork` | Copying GBs is wasteful, and usually discarded immediately by `execve` |
| **Futex** | World switches are costly; keep the uncontended case in userspace |
| **Shared memory** over pipes | No kernel involvement per access |
| **`malloc` in libc** | Amortise `mmap` over many small allocations |
| **Kernel mapped in every address space** | Avoids a page-table switch (and TLB flush) per syscall |
| **Per-core runqueues** | Avoid lock contention on a shared runqueue |
| **Red-black tree runqueue** | O(log n) operations, O(1) next-task selection |
| **Tree-structured page table** | 64-bit address spaces are sparse; avoid storing unmapped ranges |
| **Deferred preemption flag** | The kernel can only act when it is running — i.e. at interrupt boundaries |

## Common traps

- **Do not** say the scheduler picks the next *process*.
- **Do not** give only mutual exclusion when asked to define atomicity.
- **Do not** describe `fork` as copying the address space eagerly.
- **Do not** call `malloc` a system call.
- **Do not** treat syscalls, interrupts and exceptions as three peer categories in this unit's framing.
- **Do** remember `execve` returning at all means it **failed**.
- **Do** distinguish **nice value** (higher = lower priority) from **weight** (higher = more CPU).
- **Note** the slide describing cooperative-scheduling DoS as an *integrity* compromise; DoS is properly an **availability** failure.

## Forward links

- **§2.7 privilege modes** and **§5.4 user/supervisor** → Week 4's kernel/userspace isolation, SMEP/SMAP, and **Meltdown/KPTI**.
- **§4.10 cgroups** → containers, in Week 6's lightweight virtualisation.
- **§3.6 sandboxing untrusted code in separate processes** → Week 5's compartmentalisation, with OpenSSH and browsers as the worked examples.
- **§5.7 SLAB** → kernel heap grooming for use-after-free exploitation, Week 4.
- **§2.6 syscall interface** → seccomp-BPF attack-surface reduction, Week 4.

---

# Summary checklist

- [ ] OS = kernel; convenience **and** security; kernel vs distribution
- [ ] Three OS goals; three concrete invariants; fault-tolerance vs adversarial context
- [ ] TCB three requirements; "secure OS is an oxymoron"; subject/operation/object
- [ ] Kernel runs at boot + on interrupts (hardware interrupts / software exceptions)
- [ ] System V ABI: `%rax` = id, args in `%rdi`…; `syscall` / `sysret`; cost in cycles
- [ ] API vs ABI, and *why* an ABI is required
- [ ] Privilege modes; privileged instruction traps from user mode; rings 0 and 3
- [ ] Process = instance of running program; PID; process tree; PID 1
- [ ] `fork` duplicates address space + FDs + execution context; returns twice; `clone`
- [ ] CoW: shared read-only pages, copy on write, 4 KB granularity
- [ ] `execve`: blank address space, loader, interpreter, stack with `argc`/`argv`
- [ ] Signals: no payload, lazy delivery, handler or kill, `sigreturn`
- [ ] Pipes/sockets as pseudo-files with kernel buffers; shared memory as fastest
- [ ] Race condition; critical section; **both** atomicity rules; locks; futex
- [ ] Threads share one page table; same PID, distinct TID; **threads are scheduled**
- [ ] Four scheduling objectives; cooperative vs preemptive; why traditional algorithms fail
- [ ] CFS: `vruntime`, timeslice ∝ weight, RB-tree runqueue, leftmost node, two preemption triggers
- [ ] Per-core runqueues + load balancing (priority, count, topology)
- [ ] Preemption flag checked on interrupt return; context switch = page table + registers
- [ ] Scheduling attack → availability; defences: restrict params, cgroups
- [ ] Paging: 48-bit VA, 256 TB, 4 KB pages, 4-level tree, `%cr3`, 512 entries
- [ ] Walk bit ranges; PTE metadata (present, R/W, user/supervisor) → protection, CoW, swap
- [ ] Kernel mapped high in every address space; avoids page-table switch per syscall
- [ ] Two isolation mechanisms: different page tables; user/supervisor bit
- [ ] Kernel address space: dirmap, vmalloc area, code/static, modules
- [ ] Allocation path: `malloc` (libc) → `mmap` → `kmalloc`/SLAB or `vmalloc` → buddy
- [ ] `kmalloc` vs `vmalloc` (size, contiguity, mapping, interrupt context)
