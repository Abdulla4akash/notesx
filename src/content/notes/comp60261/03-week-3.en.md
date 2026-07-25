---
subject: COMP60261
chapter: 3
title: "Week 3"
language: en
---

# COMP60261 — Week 3: Operating Systems, Part 1

**Scope:** what an OS is and does, how the kernel is actually entered and executed, and the three core resource-management subsystems — processes, scheduling, and memory.

**Covers lectures:** 12 OS Introduction · 13 OS Basic Practical Aspects · 14 Process Management · 15 Scheduling · 16 Memory Management

---

## 1. What an operating system is

An OS sits between hardware and applications and does two things:

- **Abstraction** — turns awkward hardware into usable interfaces. A disk becomes files; a NIC becomes sockets; physical RAM becomes a private address space.
- **Multiplexing and arbitration** — shares finite resources (CPU, memory, devices) among mutually distrusting programs, and enforces the rules of that sharing.

The second role is why the OS is a security component: it is the arbiter, so it is also the thing to attack.

### 1.1 Functions

Process and thread management, memory management, storage and file systems, networking, device drivers, IPC, and access control.

### 1.2 Kernel vs. distribution

The **kernel** is the privileged core. A **distribution** is the kernel plus userspace: libc, shell, init system, package manager, utilities. "Linux" strictly names the kernel; Ubuntu and Debian are distributions around it. The distinction matters for TCB reasoning — a vulnerability in a distribution's userspace daemon is a very different problem from one in the kernel.

### 1.3 A brief history

Progression from no OS (single program, direct hardware access), to batch monitors, to multiprogramming and time-sharing (Multics, then Unix), to today's general-purpose systems. Each step added *sharing*, and each addition of sharing created the isolation requirements that define OS security. **Multics** is notable for taking security seriously as a design goal early; much later work reacts to it.

### 1.4 OS architectures, trust and threat models

The kernel runs with full hardware privilege, so:

- **Everything in the kernel is in the TCB of every process.** A monolithic kernel is millions of lines, all fully trusted.
- **The basic trust model** is asymmetric: processes must trust the kernel completely; the kernel must trust no process.
- **Threats** come from below and beside: malicious or compromised userspace processes attacking the kernel via its interfaces; processes attacking each other; and, in multi-tenant settings, whole other tenants.

Security aspects introduced here and developed in Week 4: isolation between processes, isolation between userspace and kernel, the system call interface as the primary attack surface, and privilege separation.

---

## 2. How the kernel actually runs

A crucial and often-missed point: **the kernel is not a process.** It has no independent thread of execution scheduled alongside applications. It is a body of code entered on demand, and it executes *in the context of* whatever was running.

### 2.1 Privilege modes

Hardware provides at least two privilege levels — on x86, **rings**, with ring 0 for the kernel and ring 3 for userspace. Privileged instructions (changing page tables, doing raw I/O, halting the CPU) are only permitted at the higher privilege level; attempting them from userspace faults.

This hardware distinction is the foundation of all OS enforcement. Without it, isolation would be advisory.

### 2.2 Kernel invocation — the three doors

The kernel is entered only via:

1. **System calls** — deliberate requests from userspace. The program executes a dedicated instruction (`syscall` on x86-64) that transitions to kernel mode at a fixed entry point.
2. **Interrupts** — asynchronous signals from devices (timer, disk completion, packet arrival).
3. **Exceptions/faults** — synchronous events caused by the current instruction (page fault, divide by zero, invalid opcode).

Between these events, the kernel is simply not running. This is the "kernel as a library of privileged routines" mental model, and it explains why kernel code must be reentrant and careful about which context it is in.

### 2.3 The system call ABI

A system call is not a function call. The **ABI** specifies the contract: a syscall number identifying the operation, arguments in specified registers (on Linux x86-64: number in `rax`; arguments in `rdi`, `rsi`, `rdx`, `r10`, `r8`, `r9`), and a return value in `rax` with errors as small negative values.

Normally libc wraps this — you call `read()`, libc loads registers and executes `syscall`. You can invoke it manually in assembly, which is instructive precisely because it shows there is no magic.

**Security significance:** the syscall interface is the entire sanctioned attack surface from userspace to kernel. Every argument crossing it is untrusted and must be validated in the kernel — including pointers, which must be checked to point into the caller's own address space, not the kernel's. This is why the kernel uses `copy_from_user`/`copy_to_user` rather than dereferencing user pointers directly.

### 2.4 Boot

Firmware (BIOS/UEFI) initialises hardware and loads a bootloader, which loads the kernel image; the kernel initialises subsystems and drivers, mounts the root filesystem, and starts the first userspace process (`init`/systemd, PID 1), which brings up everything else. Boot is security-relevant because it establishes the initial TCB — hence measured boot and secure boot, which verify each stage before handing control on.

---

## 3. Process management

A **process** is a running program plus its context: address space, open file descriptors, credentials (UID/GID), and one or more threads. It is the OS's primary unit of *isolation* — separate address spaces mean one process cannot read another's memory without going through the kernel.

### 3.1 PIDs

Each process has a **PID**. Used for signalling, waiting, and inspection (`/proc/<pid>`). PID 1 is `init`. Note that PIDs are reused after wraparound, which creates real race conditions in code that stores a PID and later acts on it.

### 3.2 `fork`

`fork()` creates a near-duplicate of the calling process. It returns **twice**: the child's PID in the parent, and `0` in the child — the standard way to distinguish them. On failure it returns `-1` in the parent only.

The child inherits copies of the address space, file descriptors, and credentials. The kernel implements this efficiently with **copy-on-write**: rather than physically duplicating memory, both processes share the same physical pages marked read-only, and a page is copied only when one of them writes to it. This makes `fork` cheap, which matters because the common use is fork-then-immediately-exec.

### 3.3 `execve`

`execve()` replaces the current process image with a new program. Same PID, same process, entirely new address space. The kernel tears down the old mappings, loads the new executable's segments, maps the dynamic loader and libraries, builds a fresh initial stack containing `argv` and the environment, and jumps to the entry point.

**`fork` + `execve` is the Unix process-creation idiom**: fork to get a new process, optionally adjust its file descriptors and credentials in the child, then exec the target program. The gap between the two is exactly where a shell sets up pipes and redirections — and where privileged programs must be careful to drop privileges before exec'ing anything untrusted.

### 3.4 Interaction and communication

Processes are isolated by default, so the kernel must mediate every interaction.

**IPC mechanisms:**

- **Pipes** — unidirectional byte streams, classically between related processes; named pipes (FIFOs) work between unrelated ones.
- **Sockets** — bidirectional, work locally (Unix domain) or across a network.
- **Shared memory** — the fastest option, since after setup no kernel involvement is needed per access; correspondingly the most dangerous, as it deliberately punctures isolation and requires explicit synchronisation.
- **Signals** — asynchronous notifications; a very limited channel and notoriously tricky, since handlers run at arbitrary points and must be async-signal-safe.

**Synchronisation.** Concurrent access to shared state needs mutual exclusion. A **lock** ensures one holder at a time. Implementation involves an atomic hardware primitive (compare-and-swap or test-and-set) for the fast path, with the kernel involved when a waiter must actually block — on Linux via **futexes**, which keep uncontended locking entirely in userspace and only enter the kernel to sleep and wake. Failures here are races and deadlocks; races on security checks give rise to **TOCTOU** vulnerabilities (Week 4).

---

## 4. Scheduling

With more runnable threads than CPUs, the **scheduler** decides who runs next and for how long.

### 4.1 Workload types

- **Batch/CPU-bound** — long computations; want throughput and few context switches.
- **Interactive/I/O-bound** — short bursts then blocking; want low latency.

These goals conflict, and the tension drives scheduler design. Additional criteria: fairness, priority respect, and (on multicore) cache locality and load balance.

### 4.2 Preemption and context switches

**Preemption** is the OS forcibly taking the CPU from a running thread, driven by the timer interrupt. A **context switch** saves the current thread's registers and state, and restores another's — possibly including an address-space switch, which invalidates TLB entries. Switches are not free, so the scheduler balances responsiveness (short slices) against overhead and cache warmth (long slices).

### 4.3 Traditional algorithms

FCFS (simple, poor for interactivity — one long job blocks everyone), SJF (optimal average waiting time but requires knowing run times), round-robin (fair, quantum choice is the whole game), and priority scheduling with multi-level feedback queues (approximates SJF by demoting CPU-hungry threads and promoting interactive ones). Priority schemes need care to avoid **starvation**, typically via ageing.

### 4.4 Linux: CFS

Traditional heuristics became unmanageable, motivating the **Completely Fair Scheduler**.

**Core idea:** track each task's **virtual runtime** (`vruntime`) — accumulated execution time, weighted by priority — and always run the task with the smallest `vruntime`. This approximates an ideal fair processor where every one of *n* tasks receives 1/*n* of the CPU simultaneously.

- **Runqueue** is a red-black tree ordered by `vruntime`, so picking the next task is O(1) at the leftmost node and insertion is O(log n).
- **Priority** (nice value) scales how fast `vruntime` advances: a high-priority task accumulates it more slowly and so is chosen more often. Priority becomes a weight rather than a strict ordering, which avoids starvation naturally.
- **Interactivity** needs no special case: a task that blocks accumulates little `vruntime` and is therefore favoured when it wakes.
- **Multicore** uses per-CPU runqueues with periodic **load balancing**, respecting cache and NUMA topology through scheduling domains.

**Scheduler classes** are consulted in priority order — real-time classes (`SCHED_FIFO`, `SCHED_RR`) before the fair class before idle — so real-time tasks always win over normal ones. (Newer kernels replace CFS with EEVDF, refining the same fairness idea with explicit latency guarantees.)

### 4.5 Security aspects

- **Availability** — a process monopolising CPU is a local DoS; cgroups and limits are the countermeasure.
- **Side channels** — scheduling and timing are observable. Contention and execution timing leak information across isolation boundaries, and shared-core resources (SMT siblings, caches) make this concrete.
- **Priority inversion** — a low-priority holder of a lock blocks a high-priority waiter; exploitable to manipulate timing.

---

## 5. Memory management

### 5.1 Paging

Physical and virtual memory are divided into fixed-size **pages** (typically 4 KB, with 2 MB/1 GB large pages available). The MMU translates virtual to physical addresses per access, using tables the kernel maintains.

Paging delivers, in one mechanism:

- **Isolation** — a process can only name addresses that are mapped for it. Unmapped access faults. This is the enforcement behind process isolation.
- **Abstraction** — each process sees a private, contiguous space regardless of physical fragmentation.
- **Overcommit** — pages can be backed lazily, shared (copy-on-write), or swapped to disk.
- **Per-page permissions** — read/write/execute, which is what makes NX and W^X possible.

### 5.2 Page tables

A flat table would be impossibly large for a 64-bit space, so translation uses a **multi-level radix tree**. On x86-64 with 4-level paging, the 48-bit virtual address splits into four 9-bit indices plus a 12-bit offset; each level indexes a table whose entry points to the next level, with the last pointing to a physical frame. (5-level paging extends this to 57 bits.)

A **page table walk** follows those indices from the root (held in `CR3`, switched on address-space change) to the leaf. That is up to four memory accesses per translation, so the **TLB** caches recent translations; TLB misses are expensive, and TLB pressure is a real performance factor. Flushing on context switch is mitigated by tagging entries (PCIDs).

**Page table entries (x86-64)** hold the next-level or frame physical address plus flags: present, read/write, user/supervisor, accessed, dirty, and **NX** in the top bit. Two flags carry most of the security weight:

- **User/supervisor** — kernel pages are inaccessible from userspace. This enforces the userspace/kernel boundary.
- **NX** — no-execute, the basis of the Week 2 defence.

### 5.3 Kernel memory

The kernel has its own address-space region, historically mapped into every process's space (at high addresses, protected by the user/supervisor bit) so syscalls need no address-space switch. **Meltdown** broke the assumption that the permission bit alone was sufficient, forcing **KPTI** (kernel page-table isolation), which unmaps most kernel memory during userspace execution at a performance cost — a good example of a hardware flaw invalidating a software design.

**Allocators:**

- **Physical page allocator** — the **buddy allocator** manages free physical pages in power-of-two blocks, splitting and coalescing to limit external fragmentation.
- **SLAB/SLUB allocator** — sits above the page allocator for small, frequently-used kernel objects. Caches per-object-type, which reduces internal fragmentation and initialisation cost and improves cache behaviour. Security-relevant because attacker-controlled allocation patterns enable **heap grooming**: arranging the slab so a freed object is replaced by one the attacker controls, the basis of many use-after-free kernel exploits.
- **`kmalloc` vs `vmalloc`** — `kmalloc` returns physically contiguous memory (needed for DMA, limited in size, fast); `vmalloc` returns virtually contiguous but physically scattered memory (allows large allocations, requires page-table setup, slower).

---

## 6. Week 3 takeaways

1. The OS does **abstraction** and **multiplexing**; being the arbiter is what makes it a security component.
2. **The kernel is not a process** — it is entered only via syscalls, interrupts, and exceptions, and runs in the context of the interrupted thread.
3. **Privilege modes in hardware** are the root of all OS enforcement.
4. The **syscall interface is the userspace→kernel attack surface**; all arguments, especially pointers, are untrusted (`copy_from_user`).
5. `fork` returns twice (child PID in parent, 0 in child) and uses **copy-on-write**; `execve` replaces the image, keeping the PID.
6. **CFS** = run the task with the lowest weighted `vruntime`, kept in a red-black tree; priority is a weight, so starvation is avoided and interactivity is automatic.
7. **Paging** simultaneously provides isolation, abstraction, and per-page permissions — the mechanism behind both process isolation and NX.
8. PTE flags to remember: **user/supervisor** (userspace/kernel boundary) and **NX**; Meltdown defeated the former, requiring KPTI.
9. **SLAB grooming** turns kernel use-after-free bugs into exploits.
