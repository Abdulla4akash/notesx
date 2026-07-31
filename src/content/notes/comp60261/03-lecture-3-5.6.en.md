---
subject: COMP60261
chapter: 3
title: "Lecture 3 - 5.6 Study Notes"
language: en
---

# COMP60261 - Lecture 3: Operating Systems, Part 1 (5.6)

**Sources used:** downloaded COMP60261 slide decks:

- `slides/12-os-intro/index.html`
- `slides/13-os-basic-practical-aspects/index.html`
- `slides/14-process-management/index.html`
- `slides/15-scheduling/index.html`
- `slides/16-memory-management/index.html`

All paths are relative to `C:\Users\abdul\Downloads\COMP60261-slides`.

**Transcript status:** no lecture transcript was provided. These notes are grounded in the slides and their local source/assets only.

**Topic and scope:** Chapter 3 introduces the operating system and its trusted computing base, explains how the kernel executes, and develops three core subsystems: process management, scheduling, and virtual-memory management.

**Course terminology:** in these lectures, **operating system means the kernel**. Userspace utilities, libraries, graphical interfaces, and package managers belong to the distribution rather than the OS itself.

---

## 1. Chapter map

The five lectures build one implementation story:

1. **OS introduction:** define the kernel, its resource-management role, security goals, TCB, and threat models.
2. **Practical execution:** explain boot, interrupts, privilege modes, the MMU, and system calls.
3. **Processes:** create and replace processes, communicate, synchronise, and use threads.
4. **Scheduling:** decide which thread runs, where, when, and for how long.
5. **Memory management:** construct isolated address spaces and allocate physical/virtual memory.

Three hardware mechanisms support much of the chapter:

- privilege modes separate application authority from kernel authority;
- interrupts and exceptions transfer control into the kernel;
- page tables and the MMU enforce memory translation and protection.

---

## 2. What an operating system is

An operating system is software that manages hardware and software resources while providing applications with an interface that is both **convenient** and **secure**.

Its major functions include:

- processes, threads, and CPU scheduling;
- virtual memory and allocation;
- filesystems and storage;
- networking;
- device management;
- inter-process communication.

The OS sits between applications and hardware. If applications controlled hardware directly, one faulty or malicious program could corrupt another program's memory, monopolise the CPU, or overwrite another file's storage.

### 2.1 Kernel versus distribution

| Term | Contents | Examples |
|---|---|---|
| **Kernel/OS** | Privileged core managing CPU, memory, and devices | Linux, Windows NT kernel, XNU |
| **Distribution** | Kernel plus userspace utilities, libraries, package management, UI, and applications | Ubuntu, Fedora, Debian |

The distinction matters for trust. A kernel vulnerability threatens every application because the kernel mediates the machine. A userspace service usually has a narrower set of privileges.

### 2.2 Historical development

- **Batch monitors:** jobs ran one after another with minimal sharing.
- **Time-sharing systems:** several users shared a machine, increasing the need for isolation and fair scheduling.
- **Personal and embedded systems:** computers spread to individual users and specialised devices.
- **GUI and networked systems:** OSes accumulated larger interfaces and more device support.
- **Mobile, cloud, and virtualised systems:** many applications and tenants share hardware under adversarial conditions.

The security trend is that increased sharing requires stronger isolation. A batch machine has a simple trust problem; a cloud host must isolate mutually distrusting workloads.

### 2.3 Architecture preview

- A **monolithic kernel** runs most services in one privileged binary.
- A **microkernel** leaves only core mechanisms privileged and moves services/drivers to userspace.
- Other models include multikernels, exokernels, and unikernels.

The architecture changes the TCB size and the cost of communication across protection domains.

### 2.4 Resource and security goals

The OS should:

1. expose useful resource mechanisms;
2. multiplex resources efficiently;
3. enforce application security.

The slides give three concrete invariants:

- one application must not access another application's address space;
- writing one file must not overwrite disk blocks allocated to another file;
- one application must not monopolise the CPU at the expense of others.

These correspond to confidentiality/integrity of memory and storage, plus availability of CPU time.

Faulty software may violate mechanisms accidentally; adversarial software attempts to violate them deliberately. The adversarial setting is harder because an attacker actively searches for paths around the checks.

### 2.5 Subjects, operations, and objects

Security policy can be stated as:

> Which **subjects** may perform which **operations** on which **objects**?

Examples:

- subject: application or user;
- operation: read, write, execute, allocate, or send;
- object: file, socket, device, process, or memory page.

The OS should enforce least privilege while preserving confidentiality, integrity, and availability. Those goals often conflict with convenience and performance.

### 2.6 Trusted Computing Base

The **Trusted Computing Base (TCB)** is the set of components relied upon to enforce security goals. It normally includes hardware, the boot process, kernel code, and some privileged applications.

A reference-monitor-like TCB must satisfy three requirements:

1. **Complete mediation:** every security-sensitive operation passes through it.
2. **Correctness:** it implements and enforces the intended policy correctly.
3. **Tamper resistance:** software outside the TCB cannot alter it.

In practice, the TCB can be difficult to define and too large to prove correct formally. This creates the central OS-security problem: all protection depends on complex privileged software that may contain bugs.

### 2.7 Threat models

A threat model states the attacker's capabilities for a particular scenario. Examples from the lecture include:

- a remote attacker sends malformed network packets;
- a local malicious application attempts privilege escalation;
- a malicious device attacks its driver or kernel interface;
- a compromised boot chain loads malicious kernel components;
- an attacker reads kernel logs to leak addresses or erases logs to hide activity.

Security claims are meaningful only relative to a threat model. A mechanism that stops unprivileged processes may not stop compromised firmware or a malicious administrator.

---

## 3. How the kernel executes

Applications run above standard OS abstractions rather than manipulating the CPU, MMU, storage devices, and network hardware directly. System calls provide the controlled interface to those abstractions.

### 3.1 Boot sequence

1. The machine powers on.
2. BIOS or UEFI firmware performs basic hardware initialisation.
3. Firmware transfers control to a bootloader such as GRUB.
4. The bootloader loads the kernel and starts it.
5. The kernel initialises itself and additional hardware.
6. The kernel starts the first userspace process.

The boot chain establishes the initial TCB. If firmware or the bootloader is compromised, later kernel protections begin from an untrusted state.

### 3.2 CPU execution state

The CPU contains arithmetic/control logic and registers. The instruction pointer identifies the next instruction; other registers hold operands, stack state, addresses, and results.

The register set represents a thread's current execution state. Saving those registers to memory and restoring another saved set enables a **context switch**. Multitasking depends on this ability to suspend and resume computation transparently.

### 3.3 When the kernel runs

The lecture groups kernel execution into:

1. execution at boot; and
2. runtime entry when the processor handles an interrupt.

Runtime events include:

- **hardware interrupts**, where a device signals the processor;
- **software exceptions**, where the processor reports an event such as division by zero.

A system call deliberately uses a special instruction that invokes the exception/controlled-entry machinery. It is not an ordinary function call into freely addressable kernel code.

Between such entries, the kernel is not a normal scheduled process continually running in the background. It executes in response to events, often in the context of the interrupted thread.

### 3.4 MMU and virtual memory

The OS configures the Memory Management Unit (MMU) to translate virtual addresses into physical addresses. Each process receives its own address space, so the same virtual address may map to different physical memory in different processes.

An unmapped or forbidden access raises an exception. This enforces isolation in hardware on every load and store rather than relying on applications to check one another.

### 3.5 System-call API versus ABI

A C program calls libc functions such as `read()` or `write()`. This is a source-level **API**. Libc and the kernel are not compiled together and may be written in different languages, so the boundary requires a binary convention: an **ABI**.

An ABI defines:

- which registers contain arguments;
- how the system-call number is supplied;
- which instruction enters the kernel;
- where the return value appears.

### 3.6 x86-64 Linux syscall convention

The convention shown in the slides uses:

| Purpose | Register |
|---|---|
| System-call number | `%rax` |
| Arguments 1-6 | `%rdi`, `%rsi`, `%rdx`, `%r10`, `%r8`, `%r9` |
| Return value | `%rax` |

A minimal assembly outline is:

```asm
mov $SYS_write, %rax
mov $1, %rdi
mov $message, %rsi
mov $message_length, %rdx
syscall
```

Libc normally prepares the registers and executes `syscall`. The wrapper is convenient, but the hardware/software contract is the ABI.

### 3.7 The user/kernel world switch

On `syscall`:

1. the CPU switches from user to supervisor mode;
2. control transfers to a predefined kernel entry point;
3. the handler uses `%rax` to dispatch the requested service;
4. the kernel validates arguments and performs the operation;
5. `sysret` returns to user mode after the calling instruction.

Userspace selects a service number but cannot select an arbitrary kernel instruction address. This is a control-flow restriction as well as a privilege transition.

A world switch costs **hundreds to thousands of cycles**. Later mechanisms such as futexes, shared memory, and unikernel function calls are motivated partly by avoiding this cost on common paths.

### 3.8 Privilege modes

Privileged instructions include installing page tables, communicating directly with devices, and controlling the CPU. Applications execute in **user mode**; the kernel executes in **supervisor mode**.

An attempted privileged instruction from user mode raises an exception. On x86-64 Linux, the relevant protection rings are ring 3 for userspace and ring 0 for the kernel.

The overall protection model is:

- MMU/page tables prevent unauthorised memory access;
- privilege modes prevent unauthorised hardware/control operations;
- system calls provide the approved doorway into the kernel.

---

## 4. Processes and threads

A **process is an instance of a running program**. The OS gives it the illusion of a private machine through a virtual address space and scheduled CPU execution.

A process includes:

- an address space;
- open file descriptors and sockets;
- credentials and other kernel-managed resources;
- an execution context containing CPU register state.

### 4.1 PIDs and the process tree

Every process has a process identifier (PID). `getpid()` retrieves the caller's PID, while commands such as `ps -e` list processes.

Processes form a parent/child tree. After kernel initialisation, the first userspace process has PID 1, historically `init`. It creates children, which create further descendants. `pstree` displays this relationship.

### 4.2 Creating a process with `fork`

`fork()` creates a child as a duplicate of the parent at the moment of the call. The child receives duplicated address-space mappings, execution state, and references to system resources such as file descriptors.

The return convention distinguishes both flows:

| Return value | Meaning |
|---:|---|
| `-1` | Creation failed in the parent |
| `0` | Current execution is the child |
| Positive | Current execution is the parent; value is child PID |

Example:

```c
pid_t pid = fork();

if (pid < 0) {
    perror("fork");
    exit(EXIT_FAILURE);
}

if (pid == 0) {
    puts("child");
} else {
    puts("parent");
}
```

Both paths continue concurrently. On Linux, libc implements `fork` using the more general `clone` system call.

### 4.3 Copy-on-write

Copying every physical page immediately would be slow and wasteful, especially when the child soon calls `execve`. Instead, `fork` uses **copy-on-write (CoW)**:

1. The child receives a copy of the parent's page table.
2. Parent and child initially map the same physical pages.
3. Shared pages are protected against direct writes.
4. A write raises a page fault.
5. The kernel copies that page, updates the writer's mapping, and retries the instruction.

The normal granularity is one **4 KB page**. Reads require no copying, and pages never modified remain shared.

### 4.4 Replacing a process with `execve`

The usual program-launch pattern is `fork` followed by `execve` in the child. `fork` creates the process; `execve` replaces its program image.

On successful `execve`, the kernel:

1. discards the old address space;
2. reads executable metadata and identifies segments and entry point;
3. loads a static executable or its userspace interpreter/loader;
4. allocates a new stack containing arguments and environment variables;
5. returns to userspace at the new entry point.

A successful `execve` never returns to the old program. If it returns, an error occurred.

The interval between `fork` and `execve` lets a shell configure file descriptors, pipes, redirection, and credentials for the child.

---

## 5. Inter-process communication and synchronisation

Multiple processes improve isolation and parallelism, but they need explicit mechanisms to exchange events and data.

### 5.1 Signals

A signal is a notification delivered by the kernel to a process. It has a type/number but does not carry general data.

- Hardware/software events or another process may cause a signal.
- A process installs handlers with `sigaction`.
- A signal without a suitable handler commonly triggers the default action, which may terminate the process.

Delivery is lazy. Before returning to userspace, the kernel checks pending signals. To invoke a handler, it changes the userspace context:

- the instruction pointer is redirected to the handler;
- a signal frame is placed on the userspace stack;
- the frame supports return through `sigreturn`.

The handler runs in userspace, then `sigreturn` restores the original execution context.

### 5.2 Pipes and sockets

Pipes and sockets are kernel-mediated byte channels:

- a pipe is normally unidirectional;
- a socket is bidirectional;
- data passes through kernel buffers;
- readers of empty channels and writers to full channels may sleep.

They provide clear ownership and synchronisation semantics, but repeated reads and writes require system calls and user/kernel transitions.

### 5.3 Shared memory

Shared memory maps the same physical pages into several process address spaces, commonly using `mmap` with `MAP_SHARED`.

After setup, processes communicate through ordinary loads and stores without entering the kernel for each access. This makes shared memory fast, but deliberately removes isolation for the shared pages.

| Mechanism | Data capacity | Kernel involvement | Main concern |
|---|---:|---:|---|
| Signal | Event/type only | Delivery by kernel | Limited payload and asynchronous handling |
| Pipe/socket | Byte stream/messages | Each operation | Copying and world-switch cost |
| Shared memory | Arbitrary in-memory data | Setup only for normal access | Races and explicit synchronisation |

### 5.4 Race conditions and critical sections

A race condition occurs when the result depends on an uncontrolled interleaving. One task may be preempted after partially updating a shared structure, and another then observes inconsistent state.

A **critical section** accesses shared state that must appear atomic. The slides emphasise two rules:

1. only one task executes that critical section at a time;
2. once a task starts it, it finishes before another task enters it.

Locks enforce this protocol. A losing waiter may need to sleep until the owner releases the lock.

### 5.5 Futexes

Only the kernel can safely put a thread to sleep or wake it, but entering the kernel for every uncontended lock operation would be expensive.

A **futex (fast userspace mutex)** splits the implementation:

- an atomic userspace variable handles the fast, uncontended case;
- the futex system call is used only when a thread must sleep or be woken.

This is a common systems pattern: keep the frequent path in userspace and use the privileged slow path only for contention.

### 5.6 Threads

A **thread is an execution flow within a process**. Threads in one process share the same address space, so they exchange pointers and global data efficiently but must synchronise concurrent access.

From the kernel's view:

- a thread is the smallest schedulable task;
- Linux creates threads through `clone`;
- threads share a page table;
- threads in one process share a PID but each has a distinct TID.

The scheduler schedules **threads, not processes**. Scheduler-related operations often identify a TID for this reason.

---

## 6. Scheduling

Scheduling decides which tasks run on which CPU cores, when, and for how long. When runnable threads outnumber cores, the scheduler multiplexes them in time.

### 6.1 Four objectives

| Objective | Meaning |
|---|---|
| **Throughput** | Complete as much useful work as possible and limit switching overhead |
| **Responsiveness** | React quickly or within a bounded time to events |
| **Fairness** | Give equal-priority tasks comparable CPU shares |
| **Scalability** | Remain efficient with many tasks and cores |

The objectives conflict. Longer time slices reduce switching overhead and improve throughput; shorter ones often improve responsiveness.

### 6.2 Cooperative versus preemptive scheduling

Under **cooperative scheduling**, a task runs until it finishes or voluntarily yields. A malicious or defective task that never yields can monopolise a core, causing denial of service.

Under **preemptive scheduling**, the OS interrupts a task after its allocation or when a more deserving task becomes runnable. Preemption is necessary when workloads may be adversarial because it lets the kernel enforce availability and fairness.

### 6.3 Traditional algorithms

- **First-Come, First-Served:** FIFO ordering until completion/yield.
- **Round Robin:** fixed quantum for each ready task in rotation.
- **Priority scheduling:** select according to assigned priority.
- **Multilevel feedback queues:** use several queues and adapt based on observed behaviour.

Modern systems combine many cores and mixed workloads:

- batch tasks are CPU-bound and value throughput/cache locality;
- interactive tasks use little CPU but need quick wake-up;
- real-time tasks require bounded scheduling delay.

Equal CPU division is not always the desired result. An editor needs a small amount promptly; an encoder can use the remainder.

### 6.4 Linux scheduler progression

| Scheduler | Characteristic |
|---|---|
| Original Linux scheduler | Did not scale to large task/core counts |
| O(1), introduced 2003 | Constant-time choices but weak interactive behaviour |
| Completely Fair Scheduler (CFS) | Introduced in Linux 2.6.23 in 2007 |

The lecture focuses on CFS as the Linux design model.

### 6.5 CFS core model

CFS defines an interval in which every runnable thread should execute at least once. It divides CPU time proportionally to each thread's weight, derived from its **nice value**.

The simplified metric is:

$$\text{vruntime} = \frac{\text{actual running time}}{\text{weight}}$$

Threads ready on a core are ordered by increasing `vruntime`. The task that has received the least weighted service should run next.

A higher nice value means the task is "nicer" to others and therefore has lower priority/weight.

### 6.6 CFS runqueue

Each core has a runqueue implemented as a red-black tree:

- key: increasing `vruntime`;
- next task: the leftmost node;
- insertion, deletion, and rebalancing: `O(log n)`.

CPU-heavy threads continually accumulate `vruntime` and move right. An interactive thread accumulates no runtime while blocked on I/O, so it often returns near the left and runs promptly. CFS gains interactive responsiveness from its fairness metric rather than a separate interactive-task classifier.

### 6.7 Preemption triggers

A running CFS task can be preempted when:

1. it exceeds its time slice while other tasks are ready; or
2. a waking task has a smaller `vruntime`.

The second trigger is essential for interactivity. A newly woken task should not wait behind a CPU-bound task that has already consumed more weighted service.

### 6.8 Multiple cores and load balancing

CFS maintains one runqueue per core, avoiding a single globally locked scheduling structure. Separate queues need load balancing so one core does not remain overloaded while another is idle.

Migration decisions consider:

- task count and priority/weight;
- cache hierarchy and locality;
- simultaneous multithreading (SMT);
- NUMA topology.

Moving a thread can harm performance because its cache state may need rebuilding on the target core.

### 6.9 Preemption mechanics and context switches

When preemption is needed, the kernel sets a per-CPU flag. The flag is checked at a safe kernel-exit point after an interrupt, exception, or system call.

A context switch saves the current registers and restores the next thread's registers. If the next thread belongs to a different process, the kernel also switches the page-table root. Threads in the same process already share a page table, so their switch can avoid that address-space change.

### 6.10 Scheduling security

An attacker who controls priorities or real-time scheduling parameters can starve other tasks. Defences include:

- restricting access to scheduling-related system calls and parameters;
- using control groups (cgroups) to set CPU quotas and weights independently of a task's scheduler choices.

Scheduling is therefore part of OS security: CPU time is a protected resource, and availability depends on enforceable allocation.

---

## 7. Memory management

Memory management covers allocation/deallocation for applications and the kernel, address-space construction, protection, and swapping between memory and secondary storage.

At boot, the OS enables virtual memory. Afterwards, every CPU load/store uses a virtual address that the MMU translates transparently.

### 7.1 Segmentation versus paging

**Segmentation** maps a process's virtual segment to a contiguous physical region, roughly by adding a base offset. It provides separation but suffers from inflexibility and external fragmentation.

**Paging** divides virtual and physical memory into fixed-size units. On the systems described:

- virtual addresses are commonly 48 bits;
- each process sees a virtual space of **256 TB**;
- pages are normally **4 KB**;
- most of the virtual space remains unmapped.

Each process has a different page table. Unless shared memory is configured explicitly, processes do not map each other's private physical pages.

### 7.2 Page-table responsibilities

A page table maps virtual pages to physical frames and holds access metadata.

- The OS creates and modifies page tables.
- The MMU walks them during memory access.
- One page-table tree represents one address space.
- On x86-64, `%cr3` holds the physical address of the root.

Changing to another process address space means installing another root in `%cr3`, with associated translation-cache costs.

### 7.3 Why page tables are trees

A flat entry for every virtual page would consume enormous memory even though address spaces are sparse. A multi-level tree allocates lower levels only for mapped regions.

The common x86-64 model in the slides uses four levels. Each translation page is 4 KB and contains 512 eight-byte entries.

For a 48-bit virtual address:

| Bits | Meaning |
|---|---|
| 47-39 | Index root/fourth-level table |
| 38-30 | Index third-level table |
| 29-21 | Index second-level table |
| 20-12 | Index first-level table |
| 11-0 | Byte offset in the 4 KB data page |

Each nine-bit index selects one of $2^9 = 512$ entries. Four indexes plus a 12-bit offset account for all 48 bits.

### 7.4 Page-table walk

For a normal 4 KB mapping, the MMU:

1. reads the root address from `%cr3`;
2. uses bits 47-39 to find a third-level table;
3. uses bits 38-30 to find a second-level table;
4. uses bits 29-21 to find a first-level table;
5. uses bits 20-12 to find the physical data frame;
6. adds bits 11-0 as the byte offset.

Entries reference physical addresses because the hardware must continue the walk before the target virtual translation is known.

### 7.5 Page-table entry metadata

Page-table entries include mapping information and permission/state bits such as:

- **present:** whether the mapping currently exists;
- **read/write:** whether stores are permitted;
- **user/supervisor:** whether user-mode access is permitted.

A non-present mapping or forbidden access raises a **page fault**. The OS handles the exception and may reject the access, load swapped data, create a demand mapping, or implement copy-on-write.

One mechanism therefore supports isolation, lazy allocation, swapping, and CoW.

### 7.6 Kernel mapping in process address spaces

The kernel is mapped near the top of every process address space, with its entries marked supervisor-only. Userspace cannot access those mappings, but the kernel can execute without replacing the complete page table on every system call.

This avoids a costly page-table switch and Translation Lookaside Buffer (TLB) disruption on normal kernel entry.

The two main isolation mechanisms are distinct:

| Invariant | Mechanism |
|---|---|
| Processes cannot access one another's private memory | Different page tables/address spaces |
| A process cannot access kernel memory | User/supervisor page permissions |

### 7.7 Kernel address-space regions

- **Direct map (dirmap):** a linear mapping of physical memory, useful for page-table work and physically contiguous allocations.
- **vmalloc area:** virtual kernel allocation region.
- **Kernel code and static data:** mappings for executable code, `.data`, and `.bss`.
- **Modules:** runtime-loadable kernel code in a dedicated region.

### 7.8 Allocation flow

When allocating memory, the kernel may:

1. reserve free physical pages;
2. find a free virtual range;
3. create page-table entries;
4. map pages immediately or leave them for demand allocation;
5. return a virtual pointer.

With demand allocation, the PTE begins non-present. First access faults, the kernel creates the physical mapping, and execution resumes.

Userspace `malloc` is **not a system call**. Libc obtains larger regions using `mmap` or `brk`, then subdivides them in userspace. This avoids a kernel transition for every small allocation.

### 7.9 `kmalloc` versus `vmalloc`

| Property | `kmalloc` | `vmalloc` |
|---|---|---|
| Typical use | Small allocations | Large/page-granular allocations |
| Speed | Fast | Slower due to page-table work |
| Physical layout | Contiguous | May be non-contiguous |
| Existing mapping | Uses direct map | Creates virtual mappings |
| Interrupt context | Can be used with appropriate flags | Cannot be used where sleeping is forbidden |

`kmalloc` is fast because physical pages are accessible through the direct map. `vmalloc` can join scattered physical pages into one contiguous virtual range but must construct mappings.

### 7.10 SLAB allocator

The SLAB layer maintains caches of reusable, same-sized objects:

- improves allocation/free performance;
- reduces fragmentation;
- suits kernels, which repeatedly allocate standard structures;
- allows subsystems to create type-specific caches.

`kmalloc` uses size-based SLAB caches for common allocation sizes.

### 7.11 Buddy allocator

The buddy system is the physical-page/frame allocator beneath higher-level allocation:

- manages free blocks in power-of-two page counts: 1, 2, 4, 8, and so on;
- splits a larger block to serve a smaller request;
- merges free buddy blocks back into larger blocks;
- provides contiguous physical pages when possible.

The allocation stack is:

> userspace `malloc` -> `mmap`/`brk` -> kernel allocator (`kmalloc`/SLAB or `vmalloc`) -> buddy allocator -> physical pages.

---

## 8. How the mechanisms connect

The chapter's mechanisms reinforce one another:

- An interrupt enters the kernel; saved registers make returning or switching tasks possible.
- A system call crosses privilege modes through a fixed entry point.
- The scheduler chooses a thread and a context switch restores its CPU state.
- `%cr3` selects the thread's process address space.
- Page permissions protect the kernel and implement CoW.
- Page faults let the kernel allocate memory lazily.
- Shared memory deliberately maps the same frames into multiple page tables.
- Futexes use atomic shared memory for the fast path and enter the kernel only to sleep/wake.

A strong answer explains both the mechanism and why it exists. For example, CoW is not merely "pages are copied on write"; it avoids copying an address space that `execve` may immediately discard.

---

## 9. Exam-focused facts

### 9.1 High-value questions

| Question | Answer |
|---|---|
| What does OS mean in these lectures? | The kernel, not the full distribution |
| What are the TCB requirements? | Complete mediation, correctness, tamper resistance |
| When does the kernel run? | At boot and on interrupt/exception entry |
| API versus ABI? | Source-level function contract versus binary register/instruction contract |
| x86-64 syscall argument registers? | `%rdi`, `%rsi`, `%rdx`, `%r10`, `%r8`, `%r9` |
| Syscall number and result? | `%rax` |
| What does `fork` create? | A child duplicating parent state, implemented efficiently with CoW |
| Why `fork` plus `execve`? | Create a process, then replace its program image |
| Fastest bulk IPC? | Shared memory, after setup |
| Why are futexes fast? | Uncontended path stays in userspace |
| What does Linux schedule? | Threads/tasks, not processes |
| CFS next task? | Leftmost red-black-tree node with smallest `vruntime` |
| CFS preemption triggers? | Timeslice expiry or waking task with smaller `vruntime` |
| Why one runqueue per core? | Avoid global locking and improve scalability |
| Virtual address size in the slides? | Commonly 48 bits, giving 256 TB |
| Normal page size? | 4 KB |
| Page-table tree? | Four levels of 512 entries in the presented x86-64 model |
| Process versus kernel isolation? | Different page tables versus user/supervisor bits |
| Is `malloc` a syscall? | No, it is a libc allocator using `mmap`/`brk` in bulk |

### 9.2 Quantitative facts

| Fact | Value |
|---|---:|
| User/kernel world switch | Hundreds to thousands of cycles |
| Normal page size | 4 KB |
| Common x86-64 virtual-address width | 48 bits |
| Virtual address-space size | 256 TB |
| Page-table levels in the model | 4 |
| Entries per translation page | 512 |
| CFS introduced | Linux 2.6.23, 2007 |
| O(1) scheduler introduced | 2003 |

### 9.3 Common mistakes

- Treating the entire distribution as the OS in this course's terminology.
- Defining the TCB only as trusted code without stating its three requirements.
- Listing system calls as unrelated to the exception mechanism.
- Confusing libc's source API with the kernel ABI.
- Saying `fork` copies all physical memory immediately.
- Saying successful `execve` returns to the old program.
- Calling a signal a general data channel.
- Using mutual exclusion as the whole explanation of critical-section atomicity.
- Saying the scheduler selects processes rather than threads.
- Giving only timeslice expiry as a CFS preemption trigger.
- Assuming one global CFS runqueue rather than one per core.
- Confusing virtual contiguity with physical contiguity.
- Saying one page table isolates userspace from the kernel; the user/supervisor bit does that within each address space.
- Calling `malloc` a system call.

### 9.4 Revision checklist

- [ ] Define the OS/kernel and distinguish it from a distribution.
- [ ] State the three OS goals and the three TCB requirements.
- [ ] Give local, remote, device, boot, and information-leak threat examples.
- [ ] Explain boot and the CPU register/context model.
- [ ] Relate hardware interrupts, software exceptions, and system calls.
- [ ] Distinguish API and ABI and recall the syscall registers.
- [ ] Explain user/supervisor mode and controlled kernel entry.
- [ ] Explain PID tree, `fork`, CoW, and `execve`.
- [ ] Compare signals, pipes/sockets, and shared memory.
- [ ] State both critical-section rules and explain futex fast/slow paths.
- [ ] Explain why threads share a page table and why the OS schedules TIDs.
- [ ] Recall throughput, responsiveness, fairness, and scalability.
- [ ] Compare cooperative and preemptive scheduling.
- [ ] Explain CFS `vruntime`, red-black trees, wake-up preemption, and per-core queues.
- [ ] Describe four-level page-table translation using 9/9/9/9/12 bits.
- [ ] Explain present, read/write, and user/supervisor PTE bits.
- [ ] Distinguish process isolation from kernel isolation.
- [ ] Compare `kmalloc`, `vmalloc`, SLAB, and buddy allocation.

---

## 10. Compact answer framework

For a long-form question about an OS mechanism:

1. State the **resource and security invariant**.
2. Identify the **trusted kernel component and relevant hardware**.
3. Describe the normal operation step by step.
4. Explain the **privilege or address-space transition**.
5. Identify the performance cost and the optimisation used.
6. Explain how faulty or malicious software could attack it.
7. State concrete implementation facts from the slides.

This framework works for system calls, process creation, IPC, scheduling, page-table translation, and allocation, connecting all five Chapter 3 decks.
