---
subject: COMP60261
chapter: 23
title: "Week 3 — Question Bank"
language: en
---

# Week 3 — Operating Systems Part 1: Worked Question Bank

Drills kernel entry and the syscall ABI, process creation semantics, CFS scheduling arithmetic, and paging and kernel allocators.

## Task types drilled

1. **Mechanism explanation** — say precisely how a kernel facility works.
2. **`fork`/`exec` semantics** — predict process state and output.
3. **Scheduling reasoning** — apply `vruntime` to decide ordering.
4. **Address translation arithmetic** — decompose addresses, count accesses.
5. **PTE flag reasoning** — connect a flag to the security property it enforces.
6. **Attack-surface analysis** — locate the untrusted input in a kernel path.
7. **Allocator selection** — choose `kmalloc`/`vmalloc` and justify.

---

# Section A — Recall and mechanism

## Q1. "The kernel is not a process." Justify, and state two consequences for kernel code.

### Solution

**Step 1: Establish the claim.** The kernel has no independently scheduled thread of execution running alongside applications. Between entry events it is simply not executing.

**Step 2: Name the only entries.** System calls (deliberate, synchronous, from userspace), interrupts (asynchronous, from devices), and exceptions/faults (synchronous, from the current instruction).

**Step 3: State whose context it runs in.** On entry the kernel executes **in the context of whatever was running** — using that task's kernel stack, with that task as `current`.

**Step 4: Consequence 1 — reentrancy.** Because an interrupt may arrive while the kernel is already executing on behalf of a syscall, kernel code must be reentrant and must use locking appropriate to the context.

**Step 5: Consequence 2 — context restrictions.** Code in interrupt context cannot sleep (there is no task to put to sleep meaningfully), so allocation and locking primitives differ between process and interrupt context.

**Answer.** It is a body of privileged routines entered on demand, not a schedulable entity — which is why "what context am I in?" is a constant question in kernel programming.

---

## Q2. Describe the Linux x86-64 syscall ABI, and explain why it is not a function call.

### Solution

**Step 1: Give the register convention.** Syscall number in `rax`; arguments in `rdi`, `rsi`, `rdx`, `r10`, `r8`, `r9`; return value in `rax`, with errors as small negative values.

**Step 2: Name the transition.** The `syscall` instruction causes a privilege transition to a fixed kernel entry point — not a jump to a caller-chosen address.

**Step 3: State the difference from a function call.** A function call transfers control within one privilege level and one address space, and the callee trusts its caller. A syscall **crosses a privilege boundary**: the destination is fixed by the kernel, and the callee must distrust its caller entirely.

**Step 4: Note the register-set difference.** `r10` replaces `rcx` (used by the `syscall` instruction itself for the return address), so the syscall convention deliberately differs from the C function-call ABI.

**Step 5: Note libc's role.** Ordinarily libc wraps this — you call `read()` and libc loads registers and executes `syscall`. Doing it by hand in assembly shows there is no magic, only a convention.

---

## Q3. Which two page-table-entry flags carry most of the security weight, and what does each enforce?

### Solution

**Step 1: Flag 1 — User/supervisor (U/S).** Marks a page as accessible only from supervisor mode. This enforces the **userspace/kernel boundary**: kernel pages mapped into a process's address space are unreachable from ring 3.

**Step 2: Flag 2 — NX (no-execute, the top bit).** Marks a page non-executable, enforcing **W^X** and thereby blocking execution of injected code — the Week 2 defence.

**Step 3: Note the others for completeness.** Present (P), Read/Write (R/W), Accessed, and Dirty are functionally important but not the primary isolation flags.

**Step 4: State the important caveat.** Meltdown showed the U/S bit is enforced **architecturally but not microarchitecturally** — speculative execution could load kernel data and leak it through a cache side channel before the permission check retired. The response was KPTI, which unmaps most kernel memory during userspace execution rather than relying on the bit alone. A hardware flaw invalidated a software design.

---

# Section B — Applied and multi-step

## Q4. How many times is "x" printed, and why?

```c
for (int i = 0; i < 3; i++) fork();
printf("x\n");
```

### Solution

**Step 1: Model the first iteration.** One process calls `fork`, giving 2 processes. Both continue the loop.

**Step 2: Second iteration.** Each of the 2 forks, giving 4.

**Step 3: Third iteration.** Each of the 4 forks, giving 8.

**Step 4: Count the prints.** All 8 processes exit the loop and reach the `printf`, so **8** lines.

**Step 5: Generalise.** After *n* iterations there are 2^n processes, because each existing process forks at every remaining iteration — children inherit the loop counter and continue from the same point.

**Step 6: Add the practical caveat.** With a buffered stream, output already in the buffer at fork time is duplicated in the child. Here `\n` on a line-buffered terminal flushes each time, so exactly 8 lines appear — but redirecting to a file makes the stream fully buffered and can produce more than 8 lines. This is why `fflush` before `fork` matters.

---

## Q5. Explain how copy-on-write makes `fork` cheap, and why that matters given typical usage.

### Solution

**Step 1: State the naive cost.** A literal duplicate would copy the entire address space — potentially gigabytes — making `fork` prohibitively expensive.

**Step 2: State the CoW mechanism.** Instead, parent and child page tables are set to **share the same physical frames**, with every writable page marked **read-only** in both.

**Step 3: Trace a write.** When either process writes such a page, the MMU raises a **protection fault**. The kernel's fault handler recognises a CoW page, allocates a fresh frame, copies the contents, remaps it writable in the faulting process, and resumes. Only touched pages are ever copied.

**Step 4: Connect to usage.** The dominant idiom is `fork` immediately followed by `execve`. In that case the child writes almost nothing before `execve` discards the whole address space — so almost no copying happens at all.

**Step 5: State the payoff.** The cost of `fork` becomes proportional to page-table setup rather than to memory size, which is what makes the Unix process-creation idiom practical.

**Step 6: Note a security-relevant subtlety.** CoW faults are observable in timing, and CoW page sharing across security boundaries has been the basis of side-channel and (in the case of `CVE-2016-5195`, "Dirty COW") privilege-escalation attacks where a race in the CoW handling allowed writing to supposedly read-only mappings.

---

## Q6. Three tasks on one CPU under CFS: A and B at nice 0, C at nice −5 (higher priority). All runnable. Explain the ordering, then what happens when a task blocks.

### Solution

**Step 1: State the selection rule.** CFS always runs the task with the **smallest `vruntime`**, kept in a red-black tree ordered by `vruntime` — leftmost node is next, O(1) to pick, O(log n) to insert.

**Step 2: State how priority enters.** Nice values are **weights** that scale how fast `vruntime` accumulates. For a task with weight *w*, `vruntime` advances by roughly `delta_exec × (w_0 / w)` where `w_0` is the nice-0 weight. Higher priority means larger weight, so **slower** `vruntime` growth.

**Step 3: Apply.** C at nice −5 has a larger weight, so its `vruntime` grows more slowly per unit of CPU time. It therefore returns to the leftmost position sooner and is selected more often, receiving a larger share. A and B, at equal weight, accumulate at the same rate and interleave evenly.

**Step 4: Note what does *not* happen.** C does not starve A and B. Priority scales a rate; it does not impose a strict ordering. Once C's `vruntime` exceeds theirs, they are selected. Starvation avoidance is therefore structural, not a bolted-on ageing rule.

**Step 5: Handle blocking.** A blocked task accumulates **no** `vruntime`. When it wakes, its `vruntime` is small relative to tasks that kept running, so it is at or near the leftmost position and is scheduled promptly.

**Step 6: Draw the conclusion.** Interactivity needs **no special case** — an I/O-bound task is naturally favoured on wake purely by the fairness rule. (In practice the kernel clamps how far behind a waking task's `vruntime` may be, to stop a long-sleeping task monopolising the CPU on wake.)

---

## Q7. On x86-64 with 4-level paging, decompose a virtual address and count the memory accesses for a full walk. Then explain why performance is nonetheless acceptable.

### Solution

**Step 1: Decompose.** Of the 48 significant bits: four 9-bit table indices plus a 12-bit page offset.

```
47        39 38        30 29        21 20        12 11         0
[ PML4 idx ][  PDPT idx ][   PD idx  ][   PT idx  ][  offset   ]
     9            9            9            9           12
```

**Step 2: Check the arithmetic.** 9 × 4 + 12 = 48 bits. Each 9-bit index selects one of 2^9 = 512 entries; each table is 512 × 8 bytes = 4096 bytes = one page. 4 KB pages follow from the 12-bit offset.

**Step 3: Count accesses.** One access per level to read the entry, so **4 memory accesses** to translate, plus **1** to touch the actual data = 5 total for a fully missing translation.

**Step 4: Explain why this is tolerable — the TLB.** The **TLB** caches completed virtual→physical translations, so a hit costs no extra accesses. Walks occur only on misses.

**Step 5: Note the supporting mechanisms.** **Large pages** (2 MB via 3 levels, 1 GB via 2) shorten walks and cover more memory per entry. **PCIDs** tag TLB entries with an address-space identifier so a context switch need not flush the whole TLB. `CR3` holds the walk root and is reloaded on address-space change.

**Step 6: Note the extension.** 5-level paging adds a level, extending the space to 57 bits at the cost of a fifth access on a miss.

---

## Q8. A driver needs a 2 MB buffer for DMA and a 4 MB buffer for internal bookkeeping. Choose allocators and justify.

### Solution

**Step 1: Recall the distinction.** `kmalloc` returns memory that is **physically contiguous**; `vmalloc` returns memory that is **virtually contiguous but physically scattered**.

**Step 2: Handle the DMA buffer.** A device performing DMA addresses **physical** memory (or IOVAs via an IOMMU) and generally cannot follow scattered page lists unless it supports scatter-gather. Physical contiguity is therefore required, so `kmalloc` (or the DMA API, `dma_alloc_coherent`) is correct.

**Step 3: Flag the practical difficulty.** 2 MB physically contiguous is a large, high-order allocation. The buddy allocator must find a suitably sized free block, which may fail under fragmentation. Correct engineering is to use the **DMA API** and, if the device supports scatter-gather, to accept a scattered list instead.

**Step 4: Handle the bookkeeping buffer.** Only the CPU touches it, and the CPU goes through the MMU, so physical layout is irrelevant. `vmalloc` is correct: it satisfies large allocations by stitching scattered pages into a contiguous virtual range.

**Step 5: State the trade-off.** `vmalloc` requires page-table setup and pays extra TLB pressure, so it is slower and unsuitable for hot paths or DMA. `kmalloc` is fast and DMA-capable but size-limited and fragmentation-sensitive.

**Answer.** DMA buffer → `kmalloc`/DMA API (physical contiguity mandatory); bookkeeping buffer → `vmalloc` (large, CPU-only).

---

# Section C — Extended / exam-style

## Q9. Explain what paging provides, and why it is the mechanism behind two separate defences from other weeks.

### Solution

**Step 1: Enumerate what paging delivers.**
- **Isolation** — a process can only name addresses mapped for it; anything else faults.
- **Abstraction** — a private, apparently contiguous space despite physical fragmentation.
- **Overcommit** — lazy backing, sharing and copy-on-write, swapping.
- **Per-page permissions** — read/write/execute, checked in hardware on every access.

**Step 2: Identify the first dependent defence — process isolation (Week 3/4).** The claim "a process cannot read another's memory" is enforced by the simple fact that the other process's frames are **not present** in this process's page tables. There is no software check to bypass; the address is unnameable.

**Step 3: Identify the second — NX / W^X (Week 2).** Marking data pages non-executable requires **per-page execute permission**, which exists only because translation is per-page and the MMU checks permissions on each access. Without paging there is nowhere to record the property and nothing to enforce it.

**Step 4: Draw the general point.** Paging is not merely a memory-management convenience; it is the **enforcement substrate** for confidentiality between processes and for control-flow defence within one. This is why hardware flaws in translation (Meltdown) have security consequences disproportionate to their apparent scope.

**Step 5: Note the boundary of the guarantee.** Paging enforces isolation only for CPU accesses through the MMU. Devices performing DMA bypass it entirely, which is why the IOMMU exists — the Week 6 and hardware-lecture point.

---

## Q10. Why is the syscall interface the critical attack surface, and what specific discipline does that impose on kernel code?

### Solution

**Step 1: Establish exclusivity.** Userspace can reach the kernel only via syscalls, interrupts, and faults. Of these, only syscalls are **deliberately driven by userspace with attacker-chosen arguments**. It is therefore the entire sanctioned attack surface from an unprivileged process.

**Step 2: State the asymmetry.** The kernel is in every process's TCB and must trust no process. So every value crossing this boundary is hostile by assumption.

**Step 3: Derive the pointer discipline.** A user-supplied pointer must be validated to point into the **caller's own** address space. Dereferencing it directly would let userspace direct the kernel to read or write arbitrary kernel addresses. Hence `copy_from_user` / `copy_to_user`, which perform the range check and handle faults, rather than plain dereference.

**Step 4: Derive the length discipline.** Sizes and indices must be validated against real object bounds, with attention to integer overflow in size arithmetic — the kernel analogue of the Week 2 `calloc` point.

**Step 5: Derive the time discipline.** Because the user can run concurrently on another CPU, a value validated then re-read from user memory may have **changed**. This is a TOCTOU race, and the rule is to copy once into kernel memory and validate the copy — never validate user memory and then read it again.

**Step 6: Note the leak discipline.** Data copied *out* must not include uninitialised bytes, notably **struct padding**, which otherwise leaks kernel pointers and defeats KASLR.

**Step 7: Name the surface-reduction answer.** Because the interface is large (hundreds of calls), the practical mitigation is to shrink what a given process may reach at all — **seccomp-BPF** filtering per syscall. Most programs need a small subset, so reachable kernel code drops sharply.
