---
subject: COMP60261
chapter: 3
title: "Chapter 3 Exam Questions - 5.5 Pro"
language: "en"
---

# Chapter 3 Exam Practice Set: Operating Systems, Processes, Scheduling, and Memory Management

**AI author:** 5.5 Pro  
**Source material:** COMP60261 Week 3 / Chapter 3 notes on operating-system security, kernel entry, system calls, process management, IPC, synchronisation, scheduling, paging, and kernel memory allocation.

Unless a question states otherwise, assume:

- A Linux-like OS where "OS" means the kernel.
- x86-64 with user mode and supervisor mode.
- 4 KB pages.
- 48-bit virtual addresses.
- 4-level page tables with 512 entries per translation page.
- LP64 C layout: `char` is 1 byte, `short` is 2 bytes, `int` is 4 bytes, `long` and pointers are 8 bytes.
- Structure layout uses ordinary alignment and padding: each field is aligned to its own alignment, and the whole structure is rounded up to the largest field alignment.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1: OS, kernel, distribution, and security goals

**Q:** In this course's terminology, what is an operating system? Distinguish a kernel from a distribution, then explain the three security-relevant invariants the OS is expected to enforce.

**Answer & Explanation:**

Step 1: State the course terminology. In this unit, "OS" means the **kernel**: the privileged core that manages hardware resources and mediates access to them.

Step 2: Distinguish kernel from distribution.

| Term | Meaning | Example |
|---|---|---|
| Kernel | Core privileged software managing CPU, memory, devices, filesystems, IPC, and networking. | Linux kernel, Windows NT kernel, XNU |
| Distribution | Kernel plus userspace utilities, package manager, libraries, UI, and applications. | Ubuntu, Fedora, Debian |

Step 3: State why the distinction matters. A bug in the kernel affects the Trusted Computing Base of every program on the machine. A bug in an ordinary userspace utility is still serious, but it is not automatically trusted by every process.

Step 4: State the three concrete invariants.

- An application must not access another application's address space.
- An application writing to a file must not overwrite disk blocks allocated to another file.
- An application must not monopolise the CPU at the expense of others.

Step 5: Map to CIA.

- The first invariant protects confidentiality and integrity of process memory.
- The second protects integrity of persistent storage.
- The third protects availability.

---

### Question 2: The Trusted Computing Base

**Q:** Define the Trusted Computing Base (TCB). Then state the three reference-monitor-style requirements it must satisfy and explain why a modern OS makes these requirements difficult.

**Answer & Explanation:**

Step 1: Define TCB. The **Trusted Computing Base** is the set of components that enforce the system's security goals.

Step 2: State the three requirements.

1. **Complete mediation:** it must mediate all security-sensitive operations, with no bypass path.
2. **Correctness:** it must implement the security policy correctly.
3. **Tamper resistance:** it must not be modifiable by software outside the TCB.

Step 3: Name typical TCB components. On a general-purpose machine the TCB usually includes hardware, firmware or boot process, the kernel, and some privileged applications or services.

Step 4: Explain the difficulty. Modern kernels are large, concurrent, hardware-facing programs, commonly written in C. Week 2 established that such code will contain memory safety bugs. Therefore, while the TCB is assumed to work correctly, it is hard to define exactly and mostly impossible to prove correct in practice.

Step 5: Security conclusion. A "secure OS" is an ideal design goal, not a final achievable state. Practical OS security is therefore about reducing attack surface, reducing TCB size, enforcing least privilege, and deploying mitigations.

---

### Question 3: Kernel entry points

**Q:** When does kernel code actually execute? Explain why a system call is not a third category separate from interrupts and exceptions in this unit's framing.

**Answer & Explanation:**

Step 1: State the two occasions.

Kernel code runs:

1. At boot, after the boot loader has loaded the kernel.
2. At runtime, when the processor receives an interrupt.

Step 2: Split runtime interrupts into two categories.

- **Hardware interrupts:** caused by external devices, such as a network card or disk controller.
- **Software exceptions:** caused by the CPU itself, such as divide-by-zero, page fault, illegal instruction, or a deliberate system-call instruction.

Step 3: Place system calls correctly. A system call is a deliberate software exception. Userspace executes a special instruction, such as `syscall`, causing a controlled trap into the kernel.

Step 4: Explain why this matters. The kernel is not an ordinary process that the scheduler runs independently. It is privileged code entered on demand. Between boot and interrupt/exception events, it is not executing.

Step 5: Security consequence. Since every runtime kernel entry is an interrupt/exception path, those entry paths must be treated as the main control points for validation, isolation, and recovery.

---

### Question 4: API versus ABI for system calls

**Q:** Explain the difference between a system-call API and a system-call ABI. Then describe the Linux x86-64 syscall ABI register convention.

**Answer & Explanation:**

Step 1: Define API. An **API** is a source-level interface. For example, a C program may call:

```c
read(fd, buf, len);
```

That is a libc function call visible to the C source code.

Step 2: Define ABI. An **ABI** is a binary-level convention. It defines the machine-level contract between independently compiled components, possibly written in different languages.

Step 3: Explain why syscalls need an ABI. The application and kernel are not compiled as one program and do not share a normal function-call environment. Userspace must agree with the kernel about registers, syscall number, return value, and transition instruction.

Step 4: State the Linux x86-64 syscall ABI.

| Purpose | Register / instruction |
|---|---|
| Syscall number | `%rax` |
| Argument 1 | `%rdi` |
| Argument 2 | `%rsi` |
| Argument 3 | `%rdx` |
| Argument 4 | `%r10` |
| Argument 5 | `%r8` |
| Argument 6 | `%r9` |
| Return value | `%rax` |
| Enter kernel | `syscall` |
| Return to userspace | `sysret` or equivalent kernel return path |

Step 5: Distinguish this from the normal function ABI. The ordinary System V x86-64 function convention uses `%rcx` as the fourth integer/pointer argument. The syscall ABI uses `%r10` instead because the `syscall` instruction itself uses or clobbers `%rcx`.

---

### Question 5: Privilege modes and hardware enforcement

**Q:** Explain how user mode, supervisor mode, privileged instructions, and the MMU work together to enforce OS security.

**Answer & Explanation:**

Step 1: Define the two modes.

- **User mode:** ordinary applications execute here.
- **Supervisor mode:** the kernel executes here.

Step 2: Explain privileged instructions. Instructions that configure hardware, install page tables, communicate directly with devices, or shut down the CPU must be restricted to supervisor mode.

Step 3: Explain what happens on misuse. If userspace attempts a privileged instruction, the CPU raises an exception and traps to the kernel rather than executing the instruction.

Step 4: Explain the MMU's role. The kernel configures page tables. The MMU translates every virtual address used by loads, stores, and instruction fetches into physical addresses and checks page permissions.

Step 5: Connect to isolation.

- Separate page tables isolate process memory from other processes.
- User/supervisor page permissions isolate kernel memory from userspace.
- Read/write/execute permissions constrain what can be done to each mapped page.

Step 6: Security conclusion. The OS sets the policy by configuring tables and modes; hardware enforces that policy on every relevant operation.

---

### Question 6: `fork`, copy-on-write, and `execve`

**Q:** Explain the roles of `fork` and `execve` in Unix process creation. Your answer must include the `fork` return values, what is copied, how copy-on-write works, and why `execve` returning indicates failure.

**Answer & Explanation:**

Step 1: Define `fork`. `fork` creates a child process by duplicating the parent's state at the moment of the call.

Step 2: List what the child receives.

- A copy of the address space.
- Copies of handles to system resources such as file descriptors.
- A duplicated execution context, meaning register state.

Step 3: State return values.

| `fork` return value | Meaning |
|---:|---|
| `-1` | Error in the parent; no child was created. |
| `0` | This execution path is the child. |
| `> 0` | This execution path is the parent; the value is the child's PID. |

Step 4: Explain why `fork` appears to return twice. The CPU state is duplicated. Both parent and child resume from the instruction after `fork`, but with different return values.

Step 5: Explain copy-on-write. Eagerly copying all memory would be expensive. Instead, parent and child initially share physical pages marked read-only. When either process writes, the CPU raises a page fault. The kernel copies the affected 4 KB page, remaps it writable for the writer, and resumes execution.

Step 6: Define `execve`. `execve` replaces the current process image with a new program: new address space, new program entry point, stack containing `argc`, `argv`, and environment variables.

Step 7: Explain the idiom. Shells use `fork` to create a process, then the child uses `execve` to replace itself with the requested program. The parent continues as the shell.

Step 8: State the failure rule. If `execve` succeeds, the old program image is gone. Therefore, if an `execve` call returns to the caller, it failed.

---

### Question 7: IPC, synchronisation, and race conditions

**Q:** Compare signals, pipes, sockets, shared memory, and locks. Explain why shared memory is fast but dangerous, and give the full two-part definition of atomicity used in the lecture.

**Answer & Explanation:**

Step 1: Compare IPC mechanisms.

| Mechanism | Main purpose | Key property |
|---|---|---|
| Signals | Notify a process of an event. | Carries a signal type, but no ordinary payload data. |
| Pipes | Unidirectional byte stream. | Uses kernel buffers and blocks readers/writers when needed. |
| Sockets | Bidirectional communication. | Works for local or network-style communication. |
| Shared memory | Direct data sharing between processes. | Same physical pages mapped into multiple address spaces. |
| Locks / futexes | Synchronise access to shared state. | Prevent concurrent critical-section execution. |

Step 2: Explain shared-memory performance. Once a shared mapping is established, ordinary loads and stores communicate through memory. There is no syscall per message, so it avoids repeated user/kernel world switches.

Step 3: Explain shared-memory danger. Shared memory deliberately weakens process isolation for selected pages. If two processes or threads update the same data without synchronisation, one can observe a half-updated state or overwrite another's update.

Step 4: Define critical section. A critical section is code that accesses shared state and must be protected from unsafe interleaving.

Step 5: Give the full atomicity definition.

1. Only one process or thread may execute the critical section at a time.
2. Once one process or thread starts the critical section, it must finish before another begins that critical section.

Step 6: Explain futexes. A futex keeps the uncontended lock fast path in userspace using atomic CPU instructions. The kernel is entered only when a thread must sleep or wake another thread.

---

### Question 8: Scheduling and security

**Q:** State the four scheduling objectives from the lecture. Then explain why preemptive multitasking is a security requirement under adversarial workloads and why Linux schedules threads rather than processes.

**Answer & Explanation:**

Step 1: State the four objectives.

| Objective | Meaning |
|---|---|
| Throughput | Run as much useful work as possible, minimising overhead. |
| Responsiveness | React quickly to events and interactive input. |
| Fairness | Give equal-priority tasks a fair CPU share. |
| Scalability | Work well with many tasks and many CPU cores. |

Step 2: Explain the conflict. Long timeslices improve throughput by reducing context switches, but short timeslices improve responsiveness. Scheduler design balances these goals rather than maximising one absolutely.

Step 3: Explain cooperative scheduling risk. In cooperative scheduling, a task runs until it yields or finishes. A malicious task can refuse to yield and monopolise the CPU.

Step 4: Classify the security failure. CPU monopolisation is primarily an **availability** failure: other tasks cannot make progress.

Step 5: Explain preemption. In preemptive multitasking, the OS can interrupt a running task after a timeslice or when a more eligible task wakes up. This lets the kernel enforce scheduling policy against buggy or malicious code.

Step 6: Explain why threads are scheduled. A thread is the smallest execution flow. Threads in the same process share a page table and PID but have distinct TIDs. Scheduler syscalls operate on schedulable entities, so they often use TIDs rather than PIDs.

---

### Question 9: Paging as an isolation mechanism

**Q:** Explain how paging enforces both process-to-process isolation and user-to-kernel isolation. Your answer must distinguish the two mechanisms.

**Answer & Explanation:**

Step 1: State the paging model. Every load and store uses a virtual address. The MMU translates that virtual address through the current process's page table.

Step 2: Process-to-process isolation. Each process has its own page table. Without deliberate shared memory, the physical frames belonging to process A are not present in process B's page table. Process B cannot name process A's memory.

Step 3: User-to-kernel isolation. The kernel may be mapped at the top of each process's address space for performance, but those pages are marked supervisor-only. User-mode code cannot read or write them even though the virtual addresses are mapped.

Step 4: State the two different mechanisms.

| Security invariant | Mechanism |
|---|---|
| A process cannot access another process's memory. | Different page tables with disjoint mappings. |
| User code cannot access kernel memory. | User/supervisor permission bit in page-table entries. |

Step 5: Explain the performance trade-off. Mapping the kernel into every address space avoids switching page tables on every syscall, which would flush or disturb TLB state. The cost is that hardware must enforce the user/supervisor boundary correctly.

---

### Question 10: Kernel memory allocation

**Q:** Compare userspace `malloc`, the `mmap` system call, `kmalloc`, `vmalloc`, SLAB, and the buddy allocator. Include when `kmalloc` is preferred over `vmalloc`.

**Answer & Explanation:**

Step 1: Place the layers in order.

```text
userspace malloc
  -> mmap or brk system call when libc needs more virtual memory
  -> kernel allocation path
  -> kmalloc/SLAB or vmalloc
  -> buddy allocator
  -> physical pages
```

Step 2: Explain `malloc`. `malloc` is a libc function, not a system call. It obtains memory from the kernel in larger chunks, often using `mmap` or `brk`, then subdivides it in userspace.

Step 3: Explain the buddy allocator. The buddy allocator manages physical pages, allocating power-of-two runs of page frames and merging buddies when freed.

Step 4: Explain SLAB. SLAB keeps caches of same-size kernel objects. This improves performance and reduces fragmentation for frequently allocated kernel structures.

Step 5: Compare `kmalloc` and `vmalloc`.

| Property | `kmalloc` | `vmalloc` |
|---|---|---|
| Typical size | Small allocations | Large allocations |
| Physical contiguity | Physically contiguous | Not necessarily physically contiguous |
| Virtual contiguity | Yes | Yes |
| Speed | Faster | Slower; modifies page tables |
| Interrupt context | Can be usable | Not suitable because it may sleep |
| DMA suitability | Often required, though the DMA API is preferred | Usually unsuitable unless device supports scatter-gather through proper APIs |

Step 6: Decision rule. Use `kmalloc` for small, hot-path, physically contiguous allocations and code that cannot sleep. Use `vmalloc` for large CPU-only buffers where physical contiguity is not required.

---

## Part 2: Memory & Storage Size Calculations

### Question 11: Page count and internal fragmentation

**Q:** A process requests mappings of 20,000 bytes, 65,536 bytes, and 65,537 bytes. With 4 KB pages, calculate:

1. The number of pages required for each mapping.
2. The total bytes reserved at page granularity.
3. The internal fragmentation, in bytes, for each mapping.

**Answer & Explanation:**

Step 1: Use the page-size formula.

```text
pages_required = ceil(requested_bytes / 4096)
reserved_bytes = pages_required * 4096
internal_fragmentation = reserved_bytes - requested_bytes
```

Step 2: Calculate each case.

| Requested bytes | Pages required | Reserved bytes | Internal fragmentation |
|---:|---:|---:|---:|
| 20,000 | `ceil(20000 / 4096) = 5` | `5 * 4096 = 20,480` | `20,480 - 20,000 = 480` |
| 65,536 | `ceil(65536 / 4096) = 16` | `16 * 4096 = 65,536` | `0` |
| 65,537 | `ceil(65537 / 4096) = 17` | `17 * 4096 = 69,632` | `69,632 - 65,537 = 4,095` |

Step 3: Explain the security relevance. Page granularity matters for memory protection because permissions apply to whole pages. It also matters for copy-on-write because writes copy one page at a time, usually 4 KB.

---

### Question 12: x86-64 page-table index decomposition

**Q:** On a 48-bit x86-64 virtual address with 4-level paging, decompose the virtual address `0x00007f123456789a` into:

1. PML4 index.
2. PDPT index.
3. Page-directory index.
4. Page-table index.
5. Offset within the 4 KB page.

Use the bit layout:

```text
bits 47..39: PML4 index
bits 38..30: PDPT index
bits 29..21: page-directory index
bits 20..12: page-table index
bits 11..0 : page offset
```

**Answer & Explanation:**

Step 1: Recall the field sizes.

- Each table index is 9 bits because each translation page has 512 entries and `512 = 2^9`.
- The page offset is 12 bits because each page is 4096 bytes and `4096 = 2^12`.

Step 2: Extract the fields.

| Field | Decimal | Hex |
|---|---:|---:|
| PML4 index | 254 | `0xfe` |
| PDPT index | 72 | `0x48` |
| Page-directory index | 418 | `0x1a2` |
| Page-table index | 359 | `0x167` |
| Page offset | 2202 | `0x89a` |

Step 3: Check the arithmetic.

```text
4 index fields * 9 bits + 12 offset bits = 48 bits
```

Step 4: Explain page-walk cost. If the translation is not cached in the TLB, the MMU must read one entry from each of the four levels, then access the actual data. That is four translation memory accesses plus the final data access.

---

### Question 13: Page-table storage overhead

**Q:** A 48-bit virtual address space uses 4 KB pages and 8-byte page-table entries.

1. How many virtual pages exist in the full 48-bit address space?
2. How much memory would a flat one-entry-per-virtual-page page table require?
3. Why does a tree-structured page table avoid most of this cost?
4. Assuming a 16 MiB region is page-aligned and mapped contiguously inside one page-directory range, how many lowest-level page-table pages are needed for that region?

**Answer & Explanation:**

Step 1: Count virtual pages.

```text
virtual address space size = 2^48 bytes
page size = 2^12 bytes
number of virtual pages = 2^(48 - 12) = 2^36 pages
```

Step 2: Calculate a flat page table.

```text
entries = 2^36
entry size = 8 bytes = 2^3 bytes
flat table size = 2^36 * 2^3 = 2^39 bytes
```

`2^39` bytes is 512 GiB.

Step 3: Explain why that is wasteful. Most of a 48-bit address space is unmapped. A flat array would still allocate entries for all absent pages.

Step 4: Explain the tree benefit. A multi-level page table allocates translation pages only for ranges that contain mapped pages. Unmapped regions are represented by absent entries high in the tree.

Step 5: Calculate lowest-level page-table pages for 16 MiB.

```text
16 MiB = 16 * 1024 * 1024 = 16,777,216 bytes
pages mapped = 16,777,216 / 4096 = 4096 data pages
one lowest-level page table page maps 512 data pages
lowest-level page-table pages = 4096 / 512 = 8
```

Step 6: Caveat. This final count assumes the 16 MiB region is aligned so it does not straddle extra page-directory ranges. Without that alignment, one additional lowest-level table could be needed.

---

### Question 14: Struct alignment for a syscall log entry

**Q:** Consider the following complete C program. Under the assumptions at the top of this document, calculate:

1. `sizeof(struct SyscallLog)`.
2. The offset of each field.
3. `sizeof(logs)`.
4. If `logs[0]` starts at address `0x6000`, the address of `logs[3].result`.

```c
#include <stdint.h>
#include <stddef.h>
#include <stdio.h>

struct SyscallLog {
    uint16_t nr;
    uint16_t flags;
    uint64_t arg0;
    uint64_t arg1;
    int32_t result;
};

int main(void) {
    struct SyscallLog logs[5];

    printf("%zu\n", sizeof(struct SyscallLog));
    printf("%zu\n", offsetof(struct SyscallLog, nr));
    printf("%zu\n", offsetof(struct SyscallLog, flags));
    printf("%zu\n", offsetof(struct SyscallLog, arg0));
    printf("%zu\n", offsetof(struct SyscallLog, arg1));
    printf("%zu\n", offsetof(struct SyscallLog, result));
    printf("%zu\n", sizeof(logs));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Lay out the fields.

| Field | Size | Alignment | Offset |
|---|---:|---:|---:|
| `nr` | 2 | 2 | 0 |
| `flags` | 2 | 2 | 2 |
| padding | 4 | - | 4..7 |
| `arg0` | 8 | 8 | 8 |
| `arg1` | 8 | 8 | 16 |
| `result` | 4 | 4 | 24 |
| tail padding | 4 | - | 28..31 |

Step 2: Compute structure size. The largest alignment is 8. After `result`, the next offset is 28, so 4 bytes of tail padding are needed.

```text
sizeof(struct SyscallLog) = 32 bytes
```

Step 3: Compute array size.

```text
sizeof(logs) = 5 * 32 = 160 bytes
```

Step 4: Compute the address of `logs[3].result`.

```text
base of logs[3] = 0x6000 + 3 * 32
                = 0x6000 + 96
                = 0x6060

offset(result) = 24 = 0x18

address = 0x6060 + 0x18 = 0x6078
```

---

### Question 15: Array offsets inside page metadata

**Q:** Consider the following complete C program. Under the assumptions at the top of this document, calculate:

1. `sizeof(struct PageInfo)`.
2. The offset of `pfn`.
3. The offset of `perms`.
4. The offset of `tag`.
5. If `pages[0]` starts at `0x8000`, the address of `pages[9].tag[2]`.

```c
#include <stdint.h>
#include <stddef.h>
#include <stdio.h>

struct PageInfo {
    uint8_t present;
    uint64_t pfn;
    uint32_t perms;
    char tag[3];
};

int main(void) {
    struct PageInfo pages[10];

    printf("%zu\n", sizeof(struct PageInfo));
    printf("%zu\n", offsetof(struct PageInfo, pfn));
    printf("%zu\n", offsetof(struct PageInfo, perms));
    printf("%zu\n", offsetof(struct PageInfo, tag));
    printf("%zu\n", sizeof(pages));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Lay out `present`.

```text
present: offset 0, size 1
```

Step 2: Align `pfn`. `pfn` is 8 bytes and requires 8-byte alignment. After `present`, the next offset is 1, so 7 bytes of padding are inserted.

```text
pfn: offset 8, size 8, occupies offsets 8..15
```

Step 3: Place `perms`.

```text
perms: offset 16, size 4, occupies offsets 16..19
```

Step 4: Place `tag`.

```text
tag: offset 20, size 3, occupies offsets 20..22
```

Step 5: Add tail padding. The largest alignment is 8. The next offset is 23, so the structure is rounded up to 24 bytes.

```text
sizeof(struct PageInfo) = 24
sizeof(pages) = 10 * 24 = 240
```

Step 6: Compute `pages[9].tag[2]`.

```text
base of pages[9] = 0x8000 + 9 * 24
                 = 0x8000 + 216
                 = 0x8000 + 0xd8
                 = 0x80d8

offset of tag[2] = offset(tag) + 2
                 = 20 + 2
                 = 22
                 = 0x16

address = 0x80d8 + 0x16 = 0x80ee
```

---

### Question 16: Shared-memory ring buffer offsets

**Q:** A shared memory mapping starts at virtual address `0x10000000` in process A and at virtual address `0x20000000` in process B. Both mappings point to the same physical pages. The shared region contains:

```c
#include <stdint.h>

struct Ring {
    uint32_t head;
    uint32_t tail;
    char data[4096];
};
```

Calculate:

1. `sizeof(struct Ring)`.
2. The address of `data[100]` in process A.
3. The address of `data[100]` in process B.
4. Whether both addresses refer to the same physical byte.

**Answer & Explanation:**

Step 1: Compute the layout.

```text
head: offset 0, size 4
tail: offset 4, size 4
data: offset 8, size 4096
```

The largest alignment is 4, and the total size is:

```text
4 + 4 + 4096 = 4104 bytes
```

`4104` is already divisible by 4, so:

```text
sizeof(struct Ring) = 4104
```

Step 2: Compute `data[100]` offset.

```text
offset(data[100]) = offset(data) + 100
                  = 8 + 100
                  = 108
                  = 0x6c
```

Step 3: Process A virtual address.

```text
0x10000000 + 0x6c = 0x1000006c
```

Step 4: Process B virtual address.

```text
0x20000000 + 0x6c = 0x2000006c
```

Step 5: Interpret. The virtual addresses differ, but the OS has set both page tables to map this region to the same physical frames. Therefore these two virtual addresses refer to the same physical byte in the shared memory object.

---

## Part 3: Code Tracing & Output Prediction

### Question 17: `fork` and private address spaces

**Q:** Trace the following complete POSIX C program. Assuming `fork` succeeds, give the exact console output.

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int global_value = 10;

int main(void) {
    int local_value = 20;
    pid_t pid;

    setbuf(stdout, NULL);

    pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    }

    if (pid == 0) {
        global_value += 100;
        local_value += 1000;
        printf("child: global=%d local=%d\n", global_value, local_value);
        return 0;
    }

    waitpid(pid, NULL, 0);
    global_value += 1;
    local_value += 1;
    printf("parent: global=%d local=%d\n", global_value, local_value);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Before `fork`, there is one process:

```text
global_value = 10
local_value = 20
```

Step 2: `fork` duplicates the process state. The child starts with the same values, but in its own private address space.

Step 3: Child path. In the child, `pid == 0`, so:

```text
global_value = 10 + 100 = 110
local_value = 20 + 1000 = 1020
```

The child prints:

```text
child: global=110 local=1020
```

Step 4: Parent path. The parent waits for the child to exit before printing. Its own variables were not modified by the child.

```text
global_value = 10 + 1 = 11
local_value = 20 + 1 = 21
```

Step 5: Exact output.

```text
child: global=110 local=1020
parent: global=11 local=21
```

Security note: this demonstrates process memory isolation. The child changed its copy, not the parent's variables.

---

### Question 18: Pipe communication and file descriptors

**Q:** Trace the following complete POSIX C program. Assuming all system calls succeed, give the exact console output.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    int fds[2];
    pid_t pid;

    setbuf(stdout, NULL);

    if (pipe(fds) != 0) {
        perror("pipe");
        return 1;
    }

    pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    }

    if (pid == 0) {
        char buf[8] = {0};
        close(fds[1]);
        read(fds[0], buf, sizeof(buf) - 1);
        printf("child read: %s\n", buf);
        close(fds[0]);
        return 0;
    }

    close(fds[0]);
    write(fds[1], "syscall", strlen("syscall"));
    close(fds[1]);
    waitpid(pid, NULL, 0);
    printf("parent done\n");

    return 0;
}
```

**Answer & Explanation:**

Step 1: `pipe(fds)` creates two file descriptors:

- `fds[0]` is the read end.
- `fds[1]` is the write end.

Step 2: `fork` duplicates the file descriptors into the child. Parent and child refer to the same underlying pipe object in the kernel.

Step 3: Child path. The child closes the write end and blocks in `read` until data is available.

Step 4: Parent path. The parent closes the read end, writes the 7 visible bytes of `"syscall"`, closes the write end, and waits.

Step 5: Child output. `buf` was zero-initialised, and at most 7 bytes are read, so it remains a valid C string:

```text
child read: syscall
```

Step 6: Parent output after `waitpid`.

```text
parent done
```

Step 7: Exact output.

```text
child read: syscall
parent done
```

---

### Question 19: Array parameter decay and `sizeof`

**Q:** Trace the following complete C program under the LP64 assumptions at the top of this document. Give the exact console output.

```c
#include <stdio.h>

static void inspect(int pages[4]) {
    printf("inside=%zu first=%d\n", sizeof(pages), pages[0]);
}

int main(void) {
    int pages[4] = {4, 8, 16, 32};

    printf("outside=%zu count=%zu\n", sizeof(pages), sizeof(pages) / sizeof(pages[0]));
    inspect(pages);

    return 0;
}
```

**Answer & Explanation:**

Step 1: In `main`, `pages` is a real array of 4 `int` objects. Each `int` is 4 bytes.

```text
sizeof(pages) = 4 * 4 = 16
sizeof(pages) / sizeof(pages[0]) = 16 / 4 = 4
```

Step 2: In `inspect`, the parameter declaration:

```c
int pages[4]
```

is adjusted by the C language to:

```c
int *pages
```

So `sizeof(pages)` inside `inspect` is the size of a pointer, not the size of the original array.

Step 3: Under LP64, pointer size is 8 bytes. `pages[0]` still accesses the first integer, which is `4`.

Step 4: Exact output.

```text
outside=16 count=4
inside=8 first=4
```

Security note: passing arrays to functions loses the bound. Secure APIs pass the pointer and the element count together.

---

### Question 20: Page-permission bit masking

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdint.h>
#include <stdio.h>

#define PTE_PRESENT 0x001u
#define PTE_WRITE   0x002u
#define PTE_USER    0x004u

int main(void) {
    uint64_t pte = 0x0000000012345000ull;

    pte |= PTE_PRESENT;
    pte |= PTE_USER;

    printf("pte=0x%llx present=%d write=%d user=%d\n",
           (unsigned long long)pte,
           (pte & PTE_PRESENT) != 0,
           (pte & PTE_WRITE) != 0,
           (pte & PTE_USER) != 0);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Initial `pte` is:

```text
0x12345000
```

Step 2: `PTE_PRESENT` sets bit `0x001`, producing:

```text
0x12345001
```

Step 3: `PTE_USER` sets bit `0x004`, producing:

```text
0x12345005
```

Step 4: `PTE_WRITE` is never set, so the write check is false.

Step 5: `%d` prints the boolean comparisons as `1` for true and `0` for false.

Exact output:

```text
pte=0x12345005 present=1 write=0 user=1
```

Security note: a real page-table entry contains a physical page reference plus metadata. Permission metadata is what lets the MMU enforce user/supervisor and read/write policy.

---

### Question 21: Deterministic signal handling

**Q:** Trace the following complete POSIX C program. Assuming `sigaction` succeeds, give the exact console output.

```c
#include <signal.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

static volatile sig_atomic_t seen = 0;

static void handle_usr1(int signo) {
    const char msg[] = "handler\n";
    seen = signo;
    write(STDOUT_FILENO, msg, sizeof(msg) - 1);
}

int main(void) {
    struct sigaction sa;

    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = handle_usr1;
    sigemptyset(&sa.sa_mask);

    if (sigaction(SIGUSR1, &sa, NULL) != 0) {
        return 1;
    }

    raise(SIGUSR1);
    printf("seen=%d\n", seen == SIGUSR1);

    return 0;
}
```

**Answer & Explanation:**

Step 1: The program installs a handler for `SIGUSR1`.

Step 2: `raise(SIGUSR1)` sends `SIGUSR1` to the current process.

Step 3: The installed handler runs. It sets:

```text
seen = SIGUSR1
```

and writes:

```text
handler
```

Step 4: After the handler returns, normal execution resumes after `raise`.

Step 5: The comparison `seen == SIGUSR1` is true, so `%d` prints `1`.

Exact output:

```text
handler
seen=1
```

Security note: signal delivery works by the kernel modifying the userspace execution context before returning to user mode. That is legitimate kernel-mediated control-flow manipulation.

---

### Question 22: CFS-style selection from `vruntime`

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

struct Task {
    const char *name;
    unsigned long vruntime;
    unsigned int weight;
};

int main(void) {
    struct Task runqueue[] = {
        {"A", 120, 1024},
        {"B", 80, 1024},
        {"C", 80, 2048},
        {"D", 200, 512}
    };
    size_t count = sizeof(runqueue) / sizeof(runqueue[0]);
    size_t best = 0;
    size_t i;

    for (i = 1; i < count; i++) {
        if (runqueue[i].vruntime < runqueue[best].vruntime) {
            best = i;
        }
    }

    printf("next=%s vruntime=%lu weight=%u\n",
           runqueue[best].name,
           runqueue[best].vruntime,
           runqueue[best].weight);

    return 0;
}
```

**Answer & Explanation:**

Step 1: CFS chooses the runnable task with the smallest `vruntime`.

Step 2: Compare the values:

| Task | `vruntime` |
|---|---:|
| A | 120 |
| B | 80 |
| C | 80 |
| D | 200 |

Step 3: The code updates `best` only when it finds a strictly smaller value. B is the first task with `vruntime = 80`, and C ties B rather than being strictly smaller.

Step 4: Therefore the selected array element is B.

Exact output:

```text
next=B vruntime=80 weight=1024
```

Scheduling note: a real CFS runqueue is a red-black tree ordered by `vruntime`; the leftmost node is selected next.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 23: Unsafe read from a file descriptor

**Q:** Identify the memory-safety bug in the following complete POSIX C program. Then provide a secure, complete version.

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    char buf[16];
    ssize_t n;

    n = read(STDIN_FILENO, buf, 64);
    if (n < 0) {
        perror("read");
        return 1;
    }

    buf[n] = '\0';
    printf("input=%s\n", buf);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the first bug. `buf` has 16 bytes, but `read` is asked to write up to 64 bytes:

```c
read(STDIN_FILENO, buf, 64);
```

This can overflow the stack buffer.

Step 2: Identify the second bug. If `read` returns `16`, the assignment:

```c
buf[n] = '\0';
```

writes to `buf[16]`, which is one byte past the end. One byte must be reserved for the terminator if the buffer will be printed as a C string.

Step 3: Security impact. Standard input is a trust boundary. The attacker controls the byte count and contents supplied to the program.

Step 4: Secure refactor.

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    char buf[16];
    ssize_t n;

    n = read(STDIN_FILENO, buf, sizeof(buf) - 1);
    if (n < 0) {
        perror("read");
        return 1;
    }

    buf[n] = '\0';
    printf("input=%s\n", buf);

    return 0;
}
```

Step 5: Why this fixes it. The read is capped at 15 bytes, leaving `buf[15]` available for `'\0'`. The program still needs higher-level validation if only certain input formats are allowed.

---

### Question 24: Race condition in threaded code

**Q:** Identify the concurrency bug in the following complete POSIX C program. Then provide a secure, complete version using a mutex.

```c
#include <pthread.h>
#include <stdio.h>

#define ITERATIONS 100000

static int counter = 0;

static void *worker(void *arg) {
    int i;
    (void)arg;

    for (i = 0; i < ITERATIONS; i++) {
        counter++;
    }

    return NULL;
}

int main(void) {
    pthread_t t1;
    pthread_t t2;

    pthread_create(&t1, NULL, worker, NULL);
    pthread_create(&t2, NULL, worker, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("%d\n", counter);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the shared data. `counter` is a global variable shared by both threads because threads in one process share the same address space.

Step 2: Identify the race. `counter++` is not one indivisible operation. It is effectively:

```text
load counter
add 1
store counter
```

Two threads can interleave these steps and lose updates.

Step 3: Explain why the output is not reliable. The intended value is `200000`, but the actual result may be lower and varies by schedule.

Step 4: Secure refactor using a mutex.

```c
#include <pthread.h>
#include <stdio.h>

#define ITERATIONS 100000

static int counter = 0;
static pthread_mutex_t counter_lock = PTHREAD_MUTEX_INITIALIZER;

static void *worker(void *arg) {
    int i;
    (void)arg;

    for (i = 0; i < ITERATIONS; i++) {
        pthread_mutex_lock(&counter_lock);
        counter++;
        pthread_mutex_unlock(&counter_lock);
    }

    return NULL;
}

int main(void) {
    pthread_t t1;
    pthread_t t2;

    if (pthread_create(&t1, NULL, worker, NULL) != 0) {
        return 1;
    }
    if (pthread_create(&t2, NULL, worker, NULL) != 0) {
        return 1;
    }

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("%d\n", counter);
    return 0;
}
```

Step 5: Why this fixes it. The increment is now inside a critical section. Only one thread can execute that critical section at a time, so the read-modify-write sequence cannot be interleaved with another increment.

---

### Question 25: Unbounded process creation

**Q:** Identify the availability bug in the following complete POSIX C program. Then provide a safer, complete version.

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(int argc, char **argv) {
    int n;
    int i;

    if (argc != 2) {
        return 1;
    }

    n = atoi(argv[1]);

    for (i = 0; i < n; i++) {
        fork();
    }

    puts("done");
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the trust boundary. `argv[1]` is attacker-controlled command-line input.

Step 2: Identify the bug. The program uses `atoi` without robust error checking and then calls `fork` in a loop. Worse, because every child continues the loop, the number of processes grows exponentially.

Step 3: Calculate the impact. If `n = 20`, up to `2^20 = 1,048,576` processes may be created in principle. This can exhaust process-table entries, memory, and CPU time.

Step 4: Classify. This is an availability failure: a local denial-of-service vector.

Step 5: Safer refactor. This version parses the count, caps it, makes only the original parent create children, checks `fork`, and waits for children.

```c
#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define MAX_CHILDREN 8

int main(int argc, char **argv) {
    char *end = NULL;
    long requested;
    pid_t children[MAX_CHILDREN];
    int created = 0;
    int i;

    if (argc != 2) {
        fprintf(stderr, "usage: %s <child-count>\n", argv[0]);
        return 1;
    }

    errno = 0;
    requested = strtol(argv[1], &end, 10);
    if (errno != 0 || end == argv[1] || *end != '\0' ||
        requested < 0 || requested > MAX_CHILDREN) {
        fprintf(stderr, "invalid child count\n");
        return 1;
    }

    for (i = 0; i < requested; i++) {
        pid_t pid = fork();
        if (pid < 0) {
            perror("fork");
            break;
        }
        if (pid == 0) {
            puts("child");
            return 0;
        }
        children[created++] = pid;
    }

    for (i = 0; i < created; i++) {
        waitpid(children[i], NULL, 0);
    }

    puts("parent done");
    return 0;
}
```

Step 6: Why this fixes it. The process count is validated and bounded, children do not keep forking recursively, and the parent reaps children to avoid zombies.

---

### Question 26: TOCTOU path race

**Q:** Identify the security bug in the following complete POSIX C program. Then provide a safer, complete version.

```c
#include <stdio.h>
#include <unistd.h>

int main(int argc, char **argv) {
    FILE *fp;

    if (argc != 2) {
        return 1;
    }

    if (access(argv[1], W_OK) != 0) {
        perror("access");
        return 1;
    }

    fp = fopen(argv[1], "w");
    if (fp == NULL) {
        perror("fopen");
        return 1;
    }

    fputs("updated\n", fp);
    fclose(fp);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the trust boundary. `argv[1]` is an attacker-controlled path.

Step 2: Identify the bug. The program checks the path with `access`, then later opens the path with `fopen`. Between the check and the use, an attacker may replace the path with a symlink or another file. This is a **time-of-check to time-of-use** race.

Step 3: Explain why the kernel matters. Pathnames are resolved by the kernel each time. A permission check on one resolution does not guarantee that a later resolution names the same object.

Step 4: Safer refactor. Use one `open` operation with flags expressing the security policy, then write through the returned file descriptor. This version refuses symlinks and refuses to overwrite an existing file.

```c
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char **argv) {
    int fd;
    const char msg[] = "updated\n";
    ssize_t written;

    if (argc != 2) {
        fprintf(stderr, "usage: %s <path>\n", argv[0]);
        return 1;
    }

    fd = open(argv[1], O_WRONLY | O_CREAT | O_EXCL | O_NOFOLLOW, 0600);
    if (fd < 0) {
        fprintf(stderr, "open: %s\n", strerror(errno));
        return 1;
    }

    written = write(fd, msg, sizeof(msg) - 1);
    if (written != (ssize_t)(sizeof(msg) - 1)) {
        perror("write");
        close(fd);
        return 1;
    }

    if (close(fd) != 0) {
        perror("close");
        return 1;
    }

    return 0;
}
```

Step 5: Why this is safer. The program asks the kernel to perform creation and policy checks atomically during `open`, instead of validating one pathname and later using whatever the pathname resolves to.

---

### Question 27: Leaking uninitialised struct padding

**Q:** Identify the information leak in the following complete POSIX C program. Then provide a secure, complete version.

```c
#include <stdint.h>
#include <unistd.h>

struct Reply {
    uint8_t status;
    uint64_t value;
    uint16_t flags;
};

int main(void) {
    struct Reply reply;

    reply.status = 1;
    reply.value = 0x1122334455667788ull;
    reply.flags = 7;

    write(STDOUT_FILENO, &reply, sizeof(reply));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the structure layout issue. Because `value` needs 8-byte alignment, the compiler inserts padding after `status`. The compiler may also add tail padding at the end.

Step 2: Identify the bug. The program initialises the named fields but not the padding bytes. Writing the whole struct:

```c
write(STDOUT_FILENO, &reply, sizeof(reply));
```

may copy uninitialised stack bytes to standard output.

Step 3: Security impact. In kernel or privileged code, this pattern can leak pointers, stack contents, or other sensitive data to a less-trusted caller. Pointer leaks are especially useful because they can weaken ASLR/KASLR.

Step 4: Secure refactor by zero-initialising the whole object before setting fields.

```c
#include <stdint.h>
#include <string.h>
#include <unistd.h>

struct Reply {
    uint8_t status;
    uint64_t value;
    uint16_t flags;
};

int main(void) {
    struct Reply reply;

    memset(&reply, 0, sizeof(reply));
    reply.status = 1;
    reply.value = 0x1122334455667788ull;
    reply.flags = 7;

    write(STDOUT_FILENO, &reply, sizeof(reply));
    return 0;
}
```

Step 5: Alternative secure design. For external protocols, avoid writing raw C structs at all. Serialise each field explicitly into a defined byte layout so padding cannot leak and endianness is controlled.

---

### Question 28: Incorrect `exec` failure handling

**Q:** Identify the bug in the following complete POSIX C program. Then provide a secure, complete version.

```c
#include <stdio.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();

    if (pid == 0) {
        execl("/definitely/not/a/program", "program", (char *)NULL);
        puts("child continued after exec");
    } else if (pid > 0) {
        waitpid(pid, NULL, 0);
        puts("parent done");
    }

    return 0;
}
```

**Answer & Explanation:**

Step 1: State the rule. If `exec` succeeds, the current program image is replaced. There is no return to the old code.

Step 2: Identify the bug. The child continues executing ordinary code after `execl` fails. In a privileged program, this may accidentally run code under the wrong assumptions, with wrong file descriptors, wrong credentials, or partially prepared state.

Step 3: Explain the security issue. The code after `exec` should be treated as an error path only. It must not fall through into normal child logic.

Step 4: Secure refactor. Report the failure and exit the child with a conventional `exec` failure status.

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

int main(void) {
    pid_t pid = fork();

    if (pid < 0) {
        perror("fork");
        return 1;
    }

    if (pid == 0) {
        execl("/definitely/not/a/program", "program", (char *)NULL);
        perror("execl");
        _exit(127);
    }

    waitpid(pid, NULL, 0);
    puts("parent done");
    return 0;
}
```

Step 5: Why `_exit` is used. In a child process after `fork`, especially before or after a failed `exec`, `_exit` avoids running parent-inherited `atexit` handlers or flushing buffered stdio state in surprising ways.

---

### Question 29: Shared-memory protocol without validation

**Q:** Identify the bug in the following complete C program that models a shared-memory message parser. Then provide a secure, complete version.

```c
#include <stdint.h>
#include <stdio.h>
#include <string.h>

struct SharedMessage {
    uint32_t len;
    char payload[16];
};

int main(void) {
    struct SharedMessage msg = {32, "HELLO"};
    char local[16];

    memcpy(local, msg.payload, msg.len);
    local[15] = '\0';

    printf("%s\n", local);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the trust boundary. Shared memory may be writable by another process. Fields inside it must be treated as untrusted every time they are read.

Step 2: Identify the bug. `msg.len` claims 32 bytes, but `msg.payload` and `local` are each only 16 bytes. The `memcpy` performs both:

- An out-of-bounds read from `msg.payload`.
- An out-of-bounds write to `local`.

Step 3: Explain why shared memory makes this worse. Another process can modify `len` concurrently unless the protocol uses locking or atomics. Validating a field once and then re-reading it later can become a TOCTOU bug.

Step 4: Secure refactor. Copy the length once, validate it against both buffers, reserve space for a terminator, and then copy.

```c
#include <stdint.h>
#include <stdio.h>
#include <string.h>

struct SharedMessage {
    uint32_t len;
    char payload[16];
};

int main(void) {
    struct SharedMessage msg = {5, "HELLO"};
    char local[16];
    uint32_t len = msg.len;

    if (len >= sizeof(local) || len > sizeof(msg.payload)) {
        fprintf(stderr, "invalid shared-memory message length\n");
        return 1;
    }

    memcpy(local, msg.payload, len);
    local[len] = '\0';

    printf("%s\n", local);
    return 0;
}
```

Step 5: Remaining production requirement. Real shared-memory IPC should protect the message with a lock, sequence counter, or atomic protocol so the sender cannot modify the message while the receiver is validating and copying it.

---

## Final Exam Checklist

- OS means kernel in this unit; distribution means kernel plus userspace.
- OS security protects memory isolation, file/storage integrity, and CPU availability.
- TCB requirements: complete mediation, correctness, and tamper resistance.
- Kernel runs at boot and on interrupts; syscalls are deliberate software exceptions.
- Syscall ABI on x86-64: `%rax` syscall number; args in `%rdi`, `%rsi`, `%rdx`, `%r10`, `%r8`, `%r9`.
- User mode and supervisor mode are enforced by hardware privilege checks.
- The MMU translates virtual addresses and enforces page permissions.
- `fork` duplicates process state and returns twice; `execve` replaces the process image.
- Copy-on-write shares physical pages until a write fault, then copies one 4 KB page.
- Signals carry a type, are delivered lazily, and may cause a handler or process termination.
- Pipes and sockets use kernel buffers; shared memory maps the same physical pages into multiple address spaces.
- Critical-section atomicity requires mutual exclusion and no interleaving once started.
- Futexes keep uncontended lock operations in userspace and enter the kernel only to sleep or wake.
- Linux schedules threads/tasks, not abstract processes; TIDs matter.
- Scheduling objectives: throughput, responsiveness, fairness, scalability.
- CFS chooses the smallest `vruntime`; blocking tasks accumulate no `vruntime` while asleep.
- CFS uses per-core red-black-tree runqueues and load balancing across cores.
- Preemption is requested with a per-CPU flag and taken on return from an interrupt/exception/syscall.
- Paging uses 48-bit virtual addresses, 4 KB pages, 4 levels, 512 entries per table page, and `%cr3` as the root pointer.
- Process-to-process isolation uses different page tables; user-to-kernel isolation uses the user/supervisor bit.
- `malloc` is not a syscall; it is a libc allocator that obtains memory from the kernel in larger chunks.
- `kmalloc` is fast and physically contiguous; `vmalloc` is large and virtually contiguous but not physically contiguous.
- The buddy allocator manages physical page frames; SLAB caches frequently used kernel objects.
