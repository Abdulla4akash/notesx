---
subject: COMP60261
chapter: 13
title: "Week 3 — Flashcards"
language: en
---

# Week 3 — Operating Systems, Part 1 — Flashcards

39 flashcards. Click each question to reveal the answer.

**Anki:** [Download this deck as `.apkg`](/anki/comp60261/13-week-3-flashcards.apkg) — import into Anki via *File → Import*.

<details>
<summary><strong>Q1.</strong> What two things does an operating system do?</summary>

<b>Abstraction</b> — turns awkward hardware into usable interfaces (disk → files, NIC → sockets, RAM → private address space).<br><b>Multiplexing and arbitration</b> — shares finite resources among mutually distrusting programs and enforces the rules.

</details>

<details>
<summary><strong>Q2.</strong> Why is the OS inherently a security component?</summary>

It is the <b>arbiter</b> of shared, privileged resources — so it is also the thing to attack.

</details>

<details>
<summary><strong>Q3.</strong> Distinguish a kernel from a distribution.</summary>

<b>Kernel:</b> the privileged core. <b>Distribution:</b> kernel plus userspace (libc, shell, init, package manager, utilities).<br>Matters for TCB reasoning: a userspace daemon bug is a very different problem from a kernel bug.

</details>

<details>
<summary><strong>Q4.</strong> What did each historical step in OS evolution add, and why does it matter?</summary>

Each step added <b>sharing</b> — no OS → batch monitors → multiprogramming and time-sharing → general-purpose systems.<br>Every addition of sharing created the isolation requirements that define OS security. Multics is notable for treating security as an early design goal.

</details>

<details>
<summary><strong>Q5.</strong> State the basic OS trust model.</summary>

Asymmetric: processes must trust the kernel <b>completely</b>; the kernel must trust <b>no</b> process.<br>Everything in the kernel is in the TCB of every process.

</details>

<details>
<summary><strong>Q6.</strong> Why is &quot;the kernel is not a process&quot; an important claim?</summary>

It has no independent scheduled thread. It is code entered on demand that executes <b>in the context of</b> whatever was running.<br>Hence kernel code must be reentrant and careful about which context it is in.

</details>

<details>
<summary><strong>Q7.</strong> Name the three ways the kernel is entered.</summary>

<b>System calls</b> — deliberate userspace requests.<br><b>Interrupts</b> — asynchronous device signals (timer, disk, packet).<br><b>Exceptions/faults</b> — synchronous events from the current instruction (page fault, divide by zero, invalid opcode).

</details>

<details>
<summary><strong>Q8.</strong> What are privilege rings, and why are they foundational?</summary>

Hardware privilege levels — ring 0 for kernel, ring 3 for userspace. Privileged instructions (page tables, raw I/O, halt) fault if attempted from userspace.<br>Without this hardware distinction, isolation would be merely advisory.

</details>

<details>
<summary><strong>Q9.</strong> How does a system call differ from a function call?</summary>

It is a privilege transition, not a jump. On Linux x86-64: syscall number in <code>rax</code>, arguments in <code>rdi, rsi, rdx, r10, r8, r9</code>, return in <code>rax</code> with errors as small negative values, invoked by the <code>syscall</code> instruction.

</details>

<details>
<summary><strong>Q10.</strong> Why is the syscall interface the critical attack surface?</summary>

It is the <b>entire</b> sanctioned path from userspace to kernel, so every argument crossing it is untrusted.

</details>

<details>
<summary><strong>Q11.</strong> Why does the kernel use <code>copy_from_user</code> rather than dereferencing user pointers?</summary>

User-supplied pointers must be validated to point into the <b>caller's own</b> address space, not kernel memory.<br>Direct dereference would let userspace make the kernel read or write arbitrary kernel addresses.

</details>

<details>
<summary><strong>Q12.</strong> Outline the boot sequence and why it is security-relevant.</summary>

Firmware (BIOS/UEFI) → bootloader → kernel image → subsystem and driver init → mount root → start PID 1 (init/systemd) → userspace.<br>Boot establishes the initial TCB, hence measured and secure boot verifying each stage before handing on control.

</details>

<details>
<summary><strong>Q13.</strong> What is a process, and what makes it the unit of isolation?</summary>

A running program plus its context: address space, file descriptors, credentials (UID/GID), and threads.<br>Separate address spaces mean one process cannot read another's memory without going through the kernel.

</details>

<details>
<summary><strong>Q14.</strong> Why are PIDs a source of race conditions?</summary>

They are <b>reused</b> after wraparound, so code that stores a PID and later acts on it may target a different process.

</details>

<details>
<summary><strong>Q15.</strong> What does <code>fork()</code> return, and why?</summary>

It returns <b>twice</b>: the child's PID in the parent, and <code>0</code> in the child — the standard way to distinguish them.<br>On failure, <code>-1</code> in the parent only.

</details>

<details>
<summary><strong>Q16.</strong> How does the kernel make <code>fork</code> cheap?</summary>

<b>Copy-on-write:</b> both processes share the same physical pages marked read-only; a page is copied only when one writes.<br>This matters because the common use is fork-then-immediately-exec.

</details>

<details>
<summary><strong>Q17.</strong> What does <code>execve()</code> do to the process?</summary>

Replaces the process image: <b>same PID, same process, entirely new address space</b>.<br>Old mappings are torn down; new segments, loader and libraries are mapped; a fresh initial stack with <code>argv</code> and environment is built; control jumps to the entry point.

</details>

<details>
<summary><strong>Q18.</strong> Why is the gap between <code>fork</code> and <code>execve</code> significant?</summary>

It is where the child adjusts file descriptors and credentials — where a shell sets up pipes and redirections, and where a privileged program must <b>drop privileges</b> before exec'ing anything untrusted.

</details>

<details>
<summary><strong>Q19.</strong> Compare pipes, sockets, shared memory, and signals as IPC.</summary>

<b>Pipes:</b> unidirectional byte streams (FIFOs for unrelated processes).<br><b>Sockets:</b> bidirectional, local or networked.<br><b>Shared memory:</b> fastest — no kernel involvement per access — and most dangerous, deliberately puncturing isolation.<br><b>Signals:</b> asynchronous, very limited, handlers must be async-signal-safe.

</details>

<details>
<summary><strong>Q20.</strong> How is a lock implemented across userspace and kernel on Linux?</summary>

An atomic hardware primitive (compare-and-swap / test-and-set) for the uncontended fast path, with the kernel involved only to sleep and wake waiters — via <b>futexes</b>.<br>Failures here are races and deadlocks; races on security checks give TOCTOU bugs.

</details>

<details>
<summary><strong>Q21.</strong> Contrast batch and interactive workloads for scheduling.</summary>

<b>Batch/CPU-bound:</b> long computations, want throughput and few context switches.<br><b>Interactive/I/O-bound:</b> short bursts then blocking, want low latency.<br>These goals conflict, which drives scheduler design.

</details>

<details>
<summary><strong>Q22.</strong> What is preemption, and what does a context switch cost?</summary>

Preemption is the OS forcibly taking the CPU, driven by the timer interrupt.<br>A context switch saves and restores register state, possibly switching address space and invalidating TLB entries — so the scheduler trades responsiveness (short slices) against overhead and cache warmth.

</details>

<details>
<summary><strong>Q23.</strong> Evaluate FCFS, SJF, and round-robin.</summary>

<b>FCFS:</b> simple, but one long job blocks everyone.<br><b>SJF:</b> optimal average waiting time, but requires knowing run times.<br><b>Round-robin:</b> fair; quantum choice is the whole game.

</details>

<details>
<summary><strong>Q24.</strong> How do multi-level feedback queues approximate SJF?</summary>

By demoting CPU-hungry threads and promoting interactive ones.<br>Needs <b>ageing</b> to avoid starvation.

</details>

<details>
<summary><strong>Q25.</strong> State the core idea of CFS.</summary>

Track each task's <b>virtual runtime</b> (<code>vruntime</code>) — execution time weighted by priority — and always run the task with the smallest <code>vruntime</code>.<br>This approximates an ideal processor giving each of n tasks 1/n of the CPU simultaneously.

</details>

<details>
<summary><strong>Q26.</strong> Why does CFS use a red-black tree?</summary>

The runqueue is ordered by <code>vruntime</code>: picking the next task is O(1) at the leftmost node, insertion is O(log n).

</details>

<details>
<summary><strong>Q27.</strong> In CFS, how does priority work, and why does that avoid starvation?</summary>

The nice value <b>scales how fast <code>vruntime</code> advances</b> — high priority accumulates it more slowly and so is picked more often.<br>Priority is a weight rather than a strict ordering, so low-priority tasks still eventually run.

</details>

<details>
<summary><strong>Q28.</strong> Why does CFS need no special case for interactivity?</summary>

A task that blocks accumulates little <code>vruntime</code>, so it is naturally favoured when it wakes.

</details>

<details>
<summary><strong>Q29.</strong> How does CFS handle multicore?</summary>

Per-CPU runqueues with periodic <b>load balancing</b>, respecting cache and NUMA topology via scheduling domains.

</details>

<details>
<summary><strong>Q30.</strong> How do scheduler classes interact?</summary>

They are consulted in priority order — real-time (<code>SCHED_FIFO</code>, <code>SCHED_RR</code>) before the fair class before idle — so real-time tasks always win over normal ones.

</details>

<details>
<summary><strong>Q31.</strong> Name three security aspects of scheduling.</summary>

<b>Availability:</b> CPU monopolisation is a local DoS (countered by cgroups/limits).<br><b>Side channels:</b> scheduling and timing are observable across isolation boundaries; shared cores and caches make this concrete.<br><b>Priority inversion:</b> a low-priority lock holder blocks a high-priority waiter, exploitable to manipulate timing.

</details>

<details>
<summary><strong>Q32.</strong> What four things does paging deliver in one mechanism?</summary>

<b>Isolation</b> — a process can only name mapped addresses.<br><b>Abstraction</b> — a private contiguous space despite physical fragmentation.<br><b>Overcommit</b> — lazy backing, sharing/CoW, swapping.<br><b>Per-page permissions</b> — r/w/x, which is what enables NX.

</details>

<details>
<summary><strong>Q33.</strong> How does x86-64 4-level paging decompose a virtual address?</summary>

A 48-bit address splits into four 9-bit table indices plus a 12-bit offset.<br>Each level's entry points to the next; the last points to a physical frame. 5-level paging extends this to 57 bits.

</details>

<details>
<summary><strong>Q34.</strong> Why does the TLB matter so much, and how is context-switch flushing avoided?</summary>

A full page-table walk costs up to four memory accesses per translation, so recent translations are cached.<br>Flushing on context switch is mitigated by <b>tagging</b> entries (PCIDs). <code>CR3</code> holds the root and is switched on address-space change.

</details>

<details>
<summary><strong>Q35.</strong> Which two PTE flags carry most of the security weight?</summary>

<b>User/supervisor</b> — makes kernel pages inaccessible from userspace, enforcing the userspace/kernel boundary.<br><b>NX</b> (top bit) — no-execute, the basis of the Week 2 defence.

</details>

<details>
<summary><strong>Q36.</strong> What did Meltdown break, and what was the response?</summary>

It broke the assumption that the user/supervisor <b>permission bit alone</b> sufficed to protect kernel memory mapped into every process.<br>Response: <b>KPTI</b>, unmapping most kernel memory during userspace execution, at a performance cost — a hardware flaw invalidating a software design.

</details>

<details>
<summary><strong>Q37.</strong> What does the buddy allocator do?</summary>

Manages free <b>physical pages</b> in power-of-two blocks, splitting and coalescing to limit external fragmentation.

</details>

<details>
<summary><strong>Q38.</strong> What is the SLAB/SLUB allocator for, and why is it security-relevant?</summary>

Caches small, frequently used kernel objects per type above the page allocator, cutting fragmentation, init cost, and improving cache behaviour.<br>Security-relevant because attacker-controlled allocation patterns enable <b>heap grooming</b> — arranging the slab so a freed object is replaced by attacker-controlled data, the basis of many kernel use-after-free exploits.

</details>

<details>
<summary><strong>Q39.</strong> Contrast <code>kmalloc</code> and <code>vmalloc</code>.</summary>

<b><code>kmalloc</code>:</b> physically contiguous (needed for DMA), size-limited, fast.<br><b><code>vmalloc</code>:</b> virtually contiguous but physically scattered — allows large allocations, requires page-table setup, slower.

</details>
