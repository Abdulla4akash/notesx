---
subject: COMP60261
chapter: 8
title: "Chapter 8 Exam Questions - Fable 5"
language: "en"
---

# COMP60261 — Chapter 8 Exam Questions

**Author: Fable 5**

**Scope:** Memory protection — protection rings and x86 segmentation; virtual memory, the MMU and page-table permissions; MPUs and PMPs for systems without translation; the pipelining/superscalar/out-of-order/speculation progression and the transient execution attacks it enabled (Meltdown, Spectre); fault injection and lock-step execution; Rowhammer; and control-flow attacks and defences from ROP to shadow stacks.

**The lecture's organising claim:**

> The von Neumann model is elegant and simple, but the relationship between the CPU and memory is complex. **Abstraction layers create power and risk together** — each abstraction that makes systems work can also break, and each break is answered by a more complex abstraction, which creates more bugs.

**Assumed platform for calculations: i386-style 32-bit two-level paging with 4 KiB pages where stated; x86-64 with 8-byte words for the ROP material.**

| Quantity | Value |
|---|---|
| x86 protection rings | **0** (kernel) to **3** (user); 1 and 2 rarely used |
| 80286 Real Mode / Protected Mode | **1 MB** / **16 MB** |
| Descriptor fields | **Base**, **Limit** (20-bit), Type/Attributes, **S**, **P**, **DPL** (2-bit) |
| i386 linear address split | **10 / 10 / 12** bits → **2²⁰** pages × 4 KiB = 2³² |
| Page-table protection bits | **P**, **R/W**, **U/S**, **D**, AVAIL |
| Typical MPU/PMP region count | **8** or **16** |
| Meltdown / Spectre v1 / Spectre v2 | **CVE-2017-5754** / **5753** / **5715** |
| Target Row Refresh available from | **2016** |

> **On the calculations in Part 2.** Every figure was computed and checked numerically, including reassembling each decomposed linear address from its extracted fields to confirm the bit boundaries. Where a question needs a value the slides do not state — the DRAM refresh window, a hammering threshold, an ASLR entropy figure — the value is **given in the question** so the arithmetic is self-contained.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1 — Rings, segmentation, and descriptors

**Q:** Explain what problem time-slicing created and how the ISA was extended to solve it. Describe the x86 protection ring model, then explain segment translation and list the fields of a segment descriptor with the purpose of each.

**Answer & Explanation:**

**The problem.** By the **mid-1950s**, computers began using operating systems so that a CPU could **time-slice** more than one process. Once multiple programs coexist:

* application code must be **stopped from breaking OS code**;
* different processes must be **isolated from one another**;
* the **kernel must be protected** from user applications;
* and **hardware support is needed**, because **software alone cannot reliably stop malicious or faulty code from accessing arbitrary memory.**

That last clause is the chapter's premise, and it is the same argument as Chapter 7's: a rule enforced only by software can be evaded by software.

**The ISA response.** The Instruction Set Architecture was extended **"to isolate multiple Process contexts and the OS context from each other"** — specifically isolating multiple process contexts, application code from OS/kernel code, and user-space from privileged kernel-space execution. The resulting structure is physical hardware, an **ISA interface** above it, the **kernel in privileged space**, user processes above that, a **hardware barrier** blocking direct process-to-process access, and **system calls** as the only controlled route into the kernel.

**Protection rings.**

| Ring | Role |
|---|---|
| **0** | Most privileged; the OS kernel; **unrestricted access to hardware** |
| **1, 2** | Intermediate levels, **rarely used** by Windows or Linux; originally intended for device drivers |
| **3** | Least privileged; **user applications** |

**But rings alone are not enough**, and the lecture makes the gap explicit: rings define *privilege levels*, which prompts the question **"how do we ensure rings can partition memory for code in each level?"** A privilege level says what a piece of code may *do*; it says nothing about which *memory* it may touch. That gap is what segmentation, and later paging, fill.

**Segment translation.** Early ring-supporting processors introduced **Descriptors**, **Descriptor Tables**, **Selectors** and **Segment Registers**, letting the OS map a process's **logical address** onto the linear/physical address space. An address stops naming a location directly and becomes a pair:

```
Address = (Segment Selector, Offset)
Linear Address = Segment Base Address + Offset
```

The **selector indexes a descriptor table** — the **GDT** (Global Descriptor Table) or **LDT** (Local Descriptor Table) — and the selected descriptor describes the segment. Note the slides' own observation that even so, the address in code is **"still just a simple integer value"** — the structure is imposed by interpretation, not by anything carried in the value, which is precisely Chapter 7's integer-pointer point arriving one layer up.

**Descriptor fields:**

| Field | Width / values | Purpose |
|---|---|---|
| **Base** | 32-bit linear address | Where the segment **begins** |
| **Limit** | 20-bit | The segment's **size** — the maximum allowed offset |
| **Type / Attributes** | bits | Whether the segment is **executable, writable, readable** |
| **S ("System")** | 1 bit | Whether the descriptor is for a **system structure** such as a TSS, or a normal code/data segment |
| **P ("Present")** | 1 bit | Whether the segment is **currently in physical memory** |
| **DPL** | 2-bit | The **Descriptor Privilege Level** — which ring may access the segment, `DPL ∈ {0,1,2,3}` |

**Why this set of fields matters.** Between them, **Base** and **Limit** give spatial bounds, **Type** gives permissions, **DPL** ties the segment to the ring model, and **P** enables swapping. So a descriptor is **the metadata that a bare integer pointer lacks** — bounds and permissions attached to a region rather than to a pointer. That is the design ancestor of both a page-table entry (Question 3) and, much later, a CHERI capability. The difference, and the reason segmentation failed while paging succeeded, is in Question 2.

---

### Question 2 — Why Protected Virtual Address Mode failed

**Q:** The 80286 introduced Protected Mode in 1982. State its two mechanisms and its purpose, then explain the **two** problems the lecture identifies with PVAM. Give the Unreal Mode sequence step by step and say what makes it possible.

**Answer & Explanation:**

**What Protected Mode was for.** The 80286 introduced **Protected Mode** with a **16 MB** address space, intended to enforce a privilege model preventing **user applications from interfering with the OS** and **from interfering with each other**. It combined **two** mechanisms:

* **Protection rings** define the **privilege level**;
* **memory segmentation** isolates the **memory**.

The machine still supported the original **Real Mode**: a **flat, unprotected** memory abstraction in which **any location within the 1 MB address range could be used as either data or code**, and which had **no protection**. **Programs started in Real Mode.**

**Problem 1 — external fragmentation.** PVAM used **variable-sized segments**. Constantly allocating and freeing them made physical memory **a patchwork of small, unusable free blocks**. Since a large new segment needs **contiguous** physical memory, allocation can fail **even when total free memory is sufficient**, because the free space is split into gaps that are individually too small. The lecture's diagram shows processes A, B, C and D with small gaps between them and a new process that cannot be placed.

This is the decisive practical failure, and it is worth naming why paging fixes it: **fixed-size pages cannot fragment externally**, because any free frame is as good as any other. Question 3's "eliminates external fragmentation" is a direct consequence of abandoning variable-sized regions.

**Problem 2 — the Unreal Mode vulnerability.** This one is a **backward-compatibility** failure, and the sequence is the examinable part:

1. Segmentation had to be **backwards compatible with Real Mode**, which was flat and unprotected.
2. A program **starts in Real Mode**, limited to a **1 MB** address space.
3. The program **requests to move into Protected Mode**, gaining access to the wider address space.
4. It **loads segment descriptions using 32-bit descriptors**.
5. Those descriptors are held in the **CPU descriptor cache**.
6. The program **switches back into Real Mode**, where **there are no protections**.
7. It **creates integer pointers that use the cached 32-bit descriptor**.
8. **Result: no protection on user data, OS data, or core memory.**
9. Unreal Mode then began being used **to overcome the 1 MB limit of legacy DOS applications**, and **became a feature of the next OS version**.

**What makes it possible, stated as a principle.** The CPU **caches the descriptor** for speed, and the **mode switch does not invalidate the cache**. So the *authority* granted under Protected Mode's rules survives into a mode that **has no rules** — the check and the use are separated not in time but **across a change of security regime**. Backward compatibility required Real Mode to keep working; it did not require Real Mode to keep honouring Protected Mode's descriptors, and that mismatch is the bug.

**Why step 9 is the most interesting line.** A vulnerability became **a feature**. Once developers depended on Unreal Mode to escape the 1 MB limit, removing it would break working software — so the insecure behaviour was preserved deliberately. This is the same technical-debt pattern as Chapter 7's COBOL `ALTER`: a workaround for a hardware limitation outlives the limitation because software has come to rely on it.

**Note on the slides' figures.** One slide says Protected Mode gave the **whole 4 GB address space** while the earlier 80286 slide says **16 MB**. 4 GB is a **32-bit** (i386-era) address space, so the Unreal Mode description is best read as later x86 behaviour rather than the original 80286; the 80286 itself had a **24-bit, 16 MB** space. Flagging that discrepancy rather than silently picking one is the honest answer if the exam quotes the 4 GB figure.

---

### Question 3 — Virtual memory, the MMU, and its security implications

**Q:** State the **three** problems with pre-virtual-memory approaches. Define a virtual address space and list the kernel's four responsibilities. Explain the MMU's two functions and the address-translation format. Then give the **three** security implications.

**Answer & Explanation:**

**The three problems virtual memory solves:**

| Problem | Detail |
|---|---|
| **Protection violation** | Without a hardware-enforced boundary, a bug or malicious action in one process can corrupt **another process's memory** or **the kernel itself** |
| **Allocation inefficiency** | Software must find and manage **contiguous physical blocks** per process; as processes come and go, physical memory becomes **externally fragmented** and large allocations become difficult |
| **Static memory layout** | Programs must be **compiled for a specific physical address range**, making them **non-relocatable** and harder to develop and deploy |

**The abstraction.** **Virtual Memory** gives each process its own private, linear **Virtual Address Space (VAS)** which is **private per process**, **linear**, **typically starting at address zero**, and **independent of the physical memory layout**.

**The kernel's four responsibilities:**

1. **Create and manage mappings** between a process's virtual address space and actual physical addresses in DRAM.
2. **Store those mappings in page tables.**
3. **Allow a process's memory to be non-contiguous** in physical RAM.
4. **Allow parts of the address space to be paged to secondary storage.**

Responsibility 3 is what dissolves Question 2's fragmentation problem: once a process's memory need not be contiguous, **any free frame will do**.

**Address translation.** A virtual address splits into a **Virtual Page Number** and an **Offset**, and translation maps the page number while **leaving the offset untouched**:

```
Virtual Address  = (VPN, Offset)
Physical Address = (PFN, Offset)

VPN -> PFN          and       (VPN, Offset) -> (PFN, Offset)
```

> **Key point: page translation changes the page/frame number but preserves the offset.** This is not an implementation convenience — it is *why* the translation granularity **is** the page size, and it holds at every level of any page-table hierarchy.

**The MMU.** The **Memory Management Unit** is **dedicated hardware integrated within the CPU** that implements the virtual memory scheme, performing **two functions on every memory access**:

**1 — Address translation.** The MMU **intercepts every virtual address** the CPU generates and performs a **page table walk**, traversing OS-managed page tables in memory to find the physical address. Because walks have **high latency**, the MMU contains a **TLB (Translation Lookaside Buffer)** — a **high-speed cache of recent translations**.

**2 — Permission enforcement.** Each page table entry carries permission bits — **Read, Write, Execute, User/Supervisor**. During translation the MMU checks the **requested access type**, the **CPU's current privilege level**, and the **entry's permission bits**. If access is not permitted, the MMU **blocks the transaction and generates a hardware exception — a page fault — to the kernel.**

**The three security implications:**

| Implication | Mechanism |
|---|---|
| **Process isolation** | It becomes **architecturally impossible for a user-mode process to generate a physical address outside the regions explicitly mapped in its own page tables** — hardware-enforced boundaries between processes and protection for the kernel |
| **Fault containment** | An invalid access within a process, such as a **NULL pointer dereference**, is trapped as a page fault, so the OS can **terminate the faulty process and tidy up** while **preserving the stability of the kernel and other processes** |
| **Efficient memory utilisation** | Managing memory in **fixed-size pages** **eliminates external fragmentation** and enables **demand paging** and **copy-on-write** |

**The phrase to note in the first row is "architecturally impossible."** Isolation here is **enforcement by construction, not by checking**: an unmapped physical address is not merely forbidden to the process, it is **unnameable** — there is no virtual address the process can form that translates to it. Compare the second row, which *is* a check: permissions are consulted and violations are trapped. **The MMU therefore provides both kinds of enforcement at once**, and distinguishing them is what makes an answer precise rather than a list.

**The complexity cost, which the lecture flags.** Because i386-era segment descriptor tables **also** had permission bits and could point to page table entries, the result was **a complex mix of permissions**, **extra performance overhead from address translation**, and hence **a requirement for a translation cache**. The conceptual pipeline became `logical/segmented → linear → physical`, with **two independent protection systems** able to impose rules on the same access. That complexity is the chapter's recurring theme, and the TLB it forced into existence is itself a later source of vulnerabilities.

---

### Question 4 — MPUs and PMPs

**Q:** Explain why a full MMU is undesirable in some systems, and what still needs protecting. Define MPU and PMP, give the access-check algorithm, compare against an MMU, state the security guarantees, and give the **four** vulnerabilities and limitations.

**Answer & Explanation:**

**Why a full MMU is undesirable in embedded and real-time systems:**

| Reason | Detail |
|---|---|
| **Non-deterministic latency** | MMU-based virtual memory introduces **variable memory access times** from **TLB misses** and **page table walks** — **incompatible with hard real-time constraints** |
| **Resource overheads** | Significant **silicon area**, increased **power consumption**, and **complex OS software** for page table management |
| **System complexity** | Many embedded systems use a **static memory map** and need neither dynamic virtual memory, demand paging, nor page-table-heavy OS mechanisms |

**But protection is still required** — for **kernel code**, **interrupt stacks** and **peripheral control registers**, against **less-privileged** and **untrusted** software. **Unchecked physical memory access is a security and stability liability.**

**The mechanisms.** The **MPU (Memory Protection Unit)** in ARM Cortex-M and the **PMP (Physical Memory Protection unit)** in RISC-V are hardware modules providing **region-based access control directly over the physical address space**. Crucially they operate **without address translation** — their **sole function is to enforce access permissions on physical memory accesses initiated by the CPU core.** Privileged software defines a **finite set of regions**, each with **Read, Write, Execute** attributes, and the hardware validates every access against them, giving a **lightweight and deterministic** method of enforcing isolation.

**Configuration.** Privileged software — an **RTOS kernel in privileged mode**, or **RISC-V M-mode software** — programs registers defining a **base address** and a **size/attribute** register that bounds and enables each region. RISC-V PMP can use **NAPOT mode** for efficient power-of-two region definition (Question 12 does the arithmetic). Permissions are `R` for loads, `W` for stores, `X` for instruction fetches, and **can depend on CPU privilege level**.

**The access-check algorithm:**

```text
For every CPU memory access:
    input: physical address A, access type T ∈ {read, write, execute},
           privilege level PL

    find all enabled regions containing A

    if no region matches:
        apply architecture-specific default behaviour

    else:
        choose the highest-priority matching region

    if T is permitted for PL:
        allow access
    else:
        block access
        raise a precise memory fault exception
```

Two details in that algorithm matter. **"Highest-priority matching region"** means overlap is resolved by priority rather than by intersection — which is exactly what Question 23's misconfiguration exploits. And the fault is **precise**, which is part of the determinism argument: unlike an asynchronously reported error, you know which instruction failed.

**MPU/PMP versus MMU:**

| Feature | MMU | MPU/PMP |
|---|---|---|
| Address model | **Virtual memory translation** | **Physical memory protection** |
| Latency | **Variable** (TLB misses, walks) | **Deterministic** |
| Hardware cost | Higher silicon and power | **Lower, simpler logic** |
| Software cost | Page tables, paging, TLB management | **Region configuration** |
| Typical use | General-purpose systems, e.g. Linux | **Real-time and embedded** |

**The security guarantees**, for CPU-initiated transactions: **kernel/RTOS protection** (an isolation boundary preventing unprivileged tasks corrupting trusted kernel memory); **inter-task isolation** (containing faults and preventing lateral movement between sandboxed components); **code integrity via W⊕X** — configuring code regions as read-only and execute-only enforces **Write-XOR-Execute**, mitigating **code injection** and **self-modifying attacks**; and **peripheral register protection**, restricting unprivileged access to memory-mapped control registers.

**The four vulnerabilities and limitations:**

**1 — Bypass by non-CPU bus masters.** A standard MPU/PMP **only polices accesses originating from the CPU core it is part of**. It does **not** protect against other bus masters such as **DMA controllers**, which access memory independently. Mitigation requires separate hardware — an **IOMMU** or **IOPMP**. **The key limitation is that MPU/PMP is CPU-facing, not system-bus-wide.**

**2 — Privilege escalation and misconfiguration.** The scheme depends **entirely on the integrity of the privileged software that configures it**. An attacker who can write the configuration registers can **disable or maliciously alter** the protections. Note the asymmetry with an MMU: both depend on privileged software, but an MPU's entire policy lives in a handful of registers, so a single write primitive in privileged code is total.

**3 — Limited granularity.** Typically only **8 or 16** programmable regions, forcing **coarse-grained configurations**. A region may be **larger than necessary**, allowing **unintended access to nearby data inside an overly permissive region** — quantified in Question 12.

**4 — Physical attacks.** Bypassable by **fault injection**, **glitching** and **side-channel analysis** — which is Question 8's topic.

The slides also cite **CWE-1260: Improper Handling of Overlap Between Protected Memory Ranges**, which is limitation 3 and the priority rule combining into a concrete bug class (Question 23).

---

### Question 5 — From pipelining to speculation

**Q:** Give the three hazard classes that limit an in-order pipeline. Explain what superscalar and out-of-order execution add, including register renaming, the issue queue and the ROB. State the throughput limit each design reaches. Then explain branch speculation and why it is necessary.

**Answer & Explanation:**

**The starting point.** An in-order processor is a **direct translation of the von Neumann execution model**: **Fetch → Decode → Execute → Writeback**. **Pipelining** overlaps these stages across instructions, so different stages are busy with different instructions rather than one instruction completing before the next begins.

**The three hazard classes:**

| Hazard | Cause | Effect |
|---|---|---|
| **Data hazard** | A later instruction **needs the result of an earlier one**. "Everything pauses if the result of one instruction is needed to proceed with a subsequent instruction" — the RAW (Read-After-Write) case | Pipeline **bubbles**, reducing instruction throughput |
| **Branch (control) hazard** | Branches mean the processor **does not know which code path enters the pipeline next** — until the condition resolves, **"you can't feed the pipeline"** | Fetch stalls |
| **Structural hazard** | Different instructions take **different numbers of cycles**; if a `DIV` is still using a unit, a later `ADD` **cannot use the needed unit** | Instruction waits for a busy resource |

**The in-order ceiling.** Stalls leave expensive execution units idle, and the theoretical maximum throughput is **1 instruction per cycle (1 IPC)** — a hard limit, since one instruction is issued per cycle at best.

**Superscalar execution.** The front-end **fetches and decodes multiple instructions in parallel**; the number processed simultaneously is the pipeline's **width**. The core contains **duplicated and heterogeneous functional units** — multiple **ALUs**, **FPUs**, **Load/Store Units** — and **dispatch logic** issues multiple decoded instructions to available, appropriate units **in the same clock cycle**.

**Out-of-order execution**, which superscalar pipelines enabled, lets instructions **execute when their inputs and hardware resources are ready, not necessarily in program order.** Four pieces make it work:

**Instructions enter in program order** from memory.

**Register renaming** eliminates **WAR (Write-After-Read)** and **WAW (Write-After-Write)** dependencies by mapping the **architectural registers named in instructions onto a larger set of physical hardware registers**. This lets instructions that reuse the same logical register **for independent purposes** execute concurrently. Note what it does *not* remove: **RAW** dependencies are real data flow and cannot be renamed away — only *false* dependencies created by register-name reuse.

**A reservation station / issue queue** holds decoded and renamed instructions until **all operand values are available**.

**The Re-Order Buffer (ROB)** tracks instructions in flight and **commits results to architectural state — registers and memory — in original program order**, preserving **precise exception handling** and **logical program flow**.

**The result.** Combining **parallel hardware** (superscalar) with **dynamic scheduling** (out-of-order) keeps units fed with ready instructions, sustaining **IPC > 1**.

> **The ROB is the conceptual hinge of the whole chapter.** It lets the CPU **execute speculatively and out of order internally while making the program appear to complete in the correct order.** That is a statement about **architectural** state — and Question 6 is about everything the ROB does *not* undo.

**Branch speculation.** Even with OoO and superscalar execution, branches remain a major problem: the processor fetches, decodes and issues quickly, but `if-then-else` means it **may not know which path to fetch next**. An **in-order** processor simply **waits** until the branch result is known — **safe but slow**. An **out-of-order** processor instead **speculates** which path will be taken and **continues fetching from the predicted path**. When the branch resolves:

* **prediction correct** → results are **committed**;
* **prediction wrong** → **uncommitted results are discarded**.

The flow through the hardware: instruction stream reaches a branch → the **branch predictor** guesses ("history says taken") → **speculative fetch** follows the predicted path → the **branch unit** computes the actual condition → **ROB comparison logic** checks prediction against reality → **commit** on match, **discard/flush** on mismatch.

**Why speculation is not optional.** All three hazards cost cycles, and branches are frequent — a few instructions apart in typical code. Waiting for every branch would idle a wide superscalar core most of the time, so the deeper and wider the pipeline, the more speculation is required to keep it fed. **The performance of every modern general-purpose CPU depends on it**, which is why Question 6's attacks were so difficult to answer: the vulnerable mechanism is the one doing most of the work.

---

### Question 6 — Transient execution: Meltdown and Spectre

**Q:** What was discovered in 2017, and what distinction does it rest on? Explain Meltdown's three steps and KPTI. Explain Spectre's two variants and why Spectre is harder to mitigate. Then describe what a speculation-safe microarchitecture does.

**Answer & Explanation:**

**The 2017 discovery.** Although **mis-speculated results are discarded, side effects were not.** The most critical side effect was a **change in the CPU's data cache**: even if a speculative read was never committed, **the cache could hold evidence that the read happened**, and an attacker can recover information from it using **cache-timing side channels**.

**The distinction this rests on:**

| State | Contents | On mis-speculation |
|---|---|---|
| **Architectural** | Committed registers, committed memory updates, control flow after retirement — the **program-visible** state | **Discarded** — the ROB guarantees it |
| **Microarchitectural** | **Cache contents**, **predictor state**, **buffers** — internal implementation state | **Side effects may remain** |

**The ROB's correctness guarantee is about architectural state only.** It was never designed to unwind the cache, because the cache is not part of the programmer-visible contract — it is an implementation detail that, by definition, the ISA does not describe. That is exactly why the ISA-level reasoning of the earlier lectures did not predict these attacks: **the vulnerability lives below the level of the contract.**

**Meltdown (CVE-2017-5754)** exploits out-of-order execution to **break isolation between user applications and the OS kernel**. It relies on a design decision: **a large portion of kernel memory was mapped into the page table of every user process**. CPU privilege checks prevent user code from *accessing* it, **but the memory is still present in the virtual address space** — the distinction Meltdown weaponises.

**The three steps:**

**1 — Trigger (Ring 3 violation).** An attacker in user space attempts to read a **protected kernel address**. The out-of-order engine **immediately dispatches** the instruction, creating a **race between the execution unit and the security permission check**.

**2 — Race and transmission (the "window").** Before the slower privilege check raises a fault, the CPU **speculatively executes transient instructions**. The secret kernel byte is loaded and **used as an index into a user-controlled probe array**, forcing the corresponding page **into the L1 data cache**:

```asm
mov rax, [KERNEL_ADDR]     ; illegal read; secret reaches rax transiently
mov rbx, [PROBE + rax]     ; secret used as an index -> caches probe_array[S]
```

**3 — Persistence and recovery (side channel).** The permission check eventually fails, the **pipeline is squashed**, and **register results are discarded** — **but the L1 cache state is not reverted.** The attacker handles the exception and uses a **FLUSH+RELOAD** timing attack to find which probe page loads fastest:

```
argmin_i reload_time(probe_array[i]) = S
```

**KPTI (Kernel Page Table Isolation)** is the primary software mitigation: it **removes most kernel memory mappings from user-space page tables entirely**. It works because **if the kernel address is no longer valid in the user context, the initial speculative read cannot proceed in the same way** — the fix is not to mark the memory inaccessible (it already was) but to make it **untranslatable**. The cost is real: **the OS must switch page tables on every system call.**

**Spectre** is a class of attacks that **tricks a victim process into speculatively executing its own code in a way that leaks its secrets** — so, unlike Meltdown, it **turns the victim's own code against itself**.

**Variant 1 — Bounds Check Bypass (CVE-2017-5753)**, targeting conditional branches that perform bounds checks:

```c
if (index < array_size) {
    value = array[index];
}
```

1. The attacker **repeatedly calls the code with valid indices**.
2. This **trains the branch predictor** to expect the bounds check to pass.
3. The attacker calls with a **malicious out-of-bounds index**.
4. The CPU **follows the trained prediction** and speculatively executes inside the `if` **before the bounds check completes**.
5. This performs an **out-of-bounds read from victim memory**.
6. The secret leaks through a **cache side channel**.

**Variant 2 — Branch Target Injection (CVE-2017-5715)**, targeting **indirect branches** whose target comes from a register or memory — **virtual function calls**, **switch statements**:

1. The attacker **poisons the Branch Target Buffer (BTB)** by repeatedly executing an indirect branch in their own code resolving to a chosen address.
2. The victim later executes an indirect branch.
3. The **poisoned BTB causes a mispredict**.
4. The CPU **speculatively executes at an attacker-chosen location**.
5. That location is a **gadget already present in victim code**.
6. The gadget **leaks victim data** through a cache side channel.

**Why Spectre is harder than Meltdown.** Meltdown had a structural fix: a specific *design decision* (kernel mapped in user page tables) was removable, at a price. Spectre **exploits fundamental branch prediction behaviour** — it abuses **ordinary speculative control flow inside victim programs**, and there is no analogous single design decision to withdraw. Every conditional and indirect branch in every program is a potential instance, so mitigation is **per-code-site** rather than **per-system**.

**The mitigations, and their cost.** In **software**: **special fence instructions** and **retpolines**, which **prevent or control speculation but can have significant performance impacts**. In **hardware**: **IBRS (Indirect Branch Restricted Speculation)** and **IBPB (Indirect Branch Predictor Barrier)**, giving the OS mechanisms to **flush branch predictor state** and **constrain speculation during sensitive operations**.

**Speculation-safe microarchitectures** attack the root cause — **preventing leakage through microarchitectural side effects while retaining speculation's performance benefits**:

* **Isolation of speculative state** — speculative loads go into a **private speculation buffer**, or a dedicated non-shared portion of L1, **merged into the main hierarchy only if speculation is confirmed correct**; **if incorrect, the buffer is invalidated and no measurable side effect remains.**
* **Delay of side-effect committal** — state-changing effects are **deferred until the branch is fully resolved**, with speculative results held in internal buffers such as the ROB rather than written into visible cache.
* **Selective speculation controls** — ISA-level barriers such as **`LFENCE`** on x86 and **`CSDB`** on ARM, which when placed by a compiler or developer **prevent subsequent instructions executing speculatively until all prior instructions are resolved.**

**The trade-off is unavoidable**: isolating speculative state, adding barriers, delaying commits and reducing predictor and OoO efficiency all cost performance. **The design challenge is architectures that are safe by design while minimising overhead** — which is the general shape of every answer in this chapter.

---

### Question 7 — Rowhammer

**Q:** Define Rowhammer and explain the "leaky abstraction" it exposes. Give the four stages of the attack. Then evaluate the three mitigations — ECC, increased refresh, and TRR — and explain how TRRespass defeats TRR.

**Answer & Explanation:**

**The definition.** **Rowhammer** is a critical hardware vulnerability affecting modern **DRAM**. It is a **physical side-channel attack, not a software bug**: **repeatedly and rapidly accessing a specific row of memory cells can cause unintended electrical disturbances that flip bits in adjacent, physically separate rows.**

**The leaky abstraction.** The architectural model presents memory as **discrete, independent, reliable address locations**. The physical reality is that **DRAM cells are extremely dense**, **neighbouring cells can electrically affect each other**, and **electromagnetic coupling and charge leakage can corrupt nearby rows**. Rowhammer therefore **demonstrates a gap between the logical model of reliable memory and volatile physical reality** — and note where that places it relative to everything else in this chapter. Every other mechanism here operates *within* the abstraction, enforcing rules about which addresses may be accessed. Rowhammer **violates the abstraction itself**: the attacker never accesses the victim row at all, so **no access-control mechanism — MMU, MPU, segmentation — is even consulted.**

**The four stages**, performed by **malicious, unprivileged software**:

**1 — Memory templating.** The attacker **allocates large amounts of memory to deduce the physical DRAM layout**, aiming to identify **two aggressor rows sandwiching a victim row**.

**2 — Cache eviction.** The attacker uses instructions such as **`CLFLUSH`** on x86 to **bypass the CPU caches**, ensuring **every read goes directly to the DRAM hardware**. Without this the cache would absorb the repeated reads and no DRAM activation would occur — which is why the mechanism depends on being able to flush.

**3 — Hammering.** A tight loop issues **thousands of read requests per second to the two aggressor rows**, **rapidly activating and deactivating them** and causing **electrical stress on the memory array**:

```asm
Loop:
    mov (X), %eax        ; read aggressor row X
    mov (Y), %ebx        ; read aggressor row Y
    clflush (X)          ; force the next read back to DRAM
    clflush (Y)
    mfence               ; enforce ordering
    jmp loop
```

**4 — Disturbance error.** The activity causes **charge to leak from or into cells of the adjacent victim row**, and over a short time the leakage **corrupts a cell's state** — a **bit flip**, `1 → 0` or `0 → 1`.

**Named variants** extend the reach considerably: **Throwhammer**, the first **network-based remote** Rowhammer attack using network cards and **RDMA** channels; **GLitch**, using **embedded GPUs** against Android devices; and **Nethammer**, a network-based remote technique attacking systems that use **uncached memory or flush instructions while processing network requests.** The significance is that Rowhammer is not confined to local code execution.

**Mitigation 1 — ECC memory: unreliable.** **Error-Correcting Code** memory detects and corrects **single-bit** errors, and the initial belief was that **server-grade ECC would solve Rowhammer**. But researchers demonstrated Rowhammer causing **multi-bit flips within a single memory word**, which standard ECC **cannot correct and in some cases cannot even detect**. So ECC is an **unreliable** defence — and note the subtlety in "cannot even detect": ECC that silently mis-corrects is worse than no ECC, because it converts a detectable fault into corrupted data.

**Mitigation 2 — increased refresh intervals: impractical.** Refreshing DRAM more frequently restores cell charge more often and so reduces bit flips, but it imposes **performance and power penalties** across **the entire system**, making it **impractical as a general solution**. Question 13 quantifies why the attacker's required hammering rate only doubles when you halve the interval — a poor exchange for a system-wide cost.

**Mitigation 3 — Target Row Refresh (TRR), available from 2016.** The first **dedicated hardware mitigation implemented by chip vendors**, in **modern DRAM memory controllers**. It aims to **detect intense localised access patterns and counteract hammering while avoiding the cost of refreshing the entire module more frequently**:

```text
For DRAM row activations:
    monitor activation count per row
    if row R exceeds the hammering threshold:
        mark R as aggressor
        identify adjacent victim rows V1, V2
        issue a targeted refresh to V1 and V2
        continue monitoring
```

So the controller **tracks access rates per row**, **flags aggressors** above a threshold, **identifies physically adjacent victim rows**, and issues a **special out-of-band refresh** restoring their charge. The process is **autonomous and transparent to the CPU and OS**.

**How TRRespass defeats it — resource exhaustion.** The memory controller has a **finite number of internal trackers** for monitoring hot rows. Researchers found they could **overwhelm that tracking capacity by hammering many aggressor rows simultaneously from multiple CPU cores**. When all trackers are occupied by other aggressor rows, the controller **fails to identify a new hammering pattern**, becomes **effectively blinded**, **does not issue the needed refresh**, and **bit flips occur**. Question 13 quantifies the exhaustion.

**The state of play.** TRR **raises the bar** but its effectiveness depends on **implementation details, available controller resources and hammering pattern complexity**. Despite **a decade of research and multiple generations of fixes**, Rowhammer **remains a fundamental and unresolved vulnerability rooted in high-density memory physics**. Newer standards — **LPDDR5**, **DDR5** — include **more sophisticated in-DRAM TRR**, yet researchers **continue to find more complex hammering patterns that bypass the latest defences**. **There is no silver bullet**; the current approach is **defence in depth**: latest hardware mitigations plus OS-level attempts to **detect** and **throttle** hammering.

---

### Question 8 — Transient faults, fault injection, and lock-step execution

**Q:** Distinguish random transient errors from maliciously induced faults, giving examples of each. Explain what fault injection achieves with a worked example. Then define lock-step execution and give its five mechanism steps, stating clearly what its purpose is and is not.

**Answer & Explanation:**

**Two sources of faults.** Faults can be **random environmental events** or **deliberately induced by an attacker**.

**Random transient errors:**

| Source | Mechanism |
|---|---|
| **Single-Event Upsets (SEUs)** | **High-energy particles, such as cosmic rays, strike the silicon die**, corrupting state — for example flipping a bit |
| **Electromagnetic Interference (EMI)** | **Electrical noise** from adjacent components or external sources |
| **Power and clock instability** | Minor **voltage droops** or **clock glitches** cause a logic gate to **compute an incorrect value for a single cycle** |

**Maliciously induced faults — fault injection.** Attackers **deliberately create transient errors at precise moments, often to bypass critical security checks such as authentication.** Techniques:

* **Voltage and clock glitching** — briefly manipulating the power or clock signal to **induce a miscalculation**.
* **Electromagnetic Fault Injection (EMFI)** — a **targeted electromagnetic pulse to flip a bit**.

**The worked example** is the clearest illustration in the chapter. Intended logic:

```c
bool admin = false;
if (admin) { ... }
/* access denied */
```

Corrupted by an injected fault:

```c
bool admin = true;
if (admin) { ... }
/* access granted */
```

> **The definition to state:** fault injection **deliberately creates a transient error at a precise moment to bypass a critical security check.** And the framing that makes it distinctive: **instead of breaking the algorithm logically, the attacker physically disturbs the hardware so it computes the wrong result at the right moment.**

**Why this is categorically different from everything else in the chapter.** Every other attack here operates on **inputs**: a malformed length, a poisoned predictor, a crafted stack. Fault injection operates on the **substrate**, so the program's logic can be **perfectly correct** and still produce the wrong answer. No amount of input validation, bounds checking or memory safety helps — which is why it is listed among the ways an MPU/PMP can be bypassed (Question 4), and why Question 26's fix looks so different from the others.

**Lock-step execution** is the hardware answer for transient errors:

> **Lock-step execution is a hardware fault-tolerance technique where two or more identical processors execute the exact same instruction stream in perfect clock-cycle synchrony.**

**State its purpose precisely, because this is the common error.** Its purpose is **not to increase performance** — two cores doing identical work produce the throughput of one. Its purpose is to provide **a robust, real-time method for detecting hardware errors and ensuring computation integrity**. It is a **direct hardware implementation of redundancy and verification**.

**The five mechanism steps:**

1. **Duplication** — two identical CPU cores, a **primary** and a **shadow** core, **sharing the same inputs**.
2. **Synchronisation** — both are driven by **the exact same clock signal** and execute each instruction **in the same cycle**.
3. **Parallel execution** — both execute the **identical instruction stream** in parallel.
4. **Comparison** — outputs from both cores are **continuously fed into a dedicated hardware comparator circuit** — memory addresses, data results.
5. **Fault detection** — the comparator **checks for mismatches on every clock cycle**, and **signals an error if outputs differ.**

**What it does and does not give you.** It **detects** a transient fault affecting one core, because a random particle strike or a localised glitch is overwhelmingly unlikely to corrupt both cores identically in the same cycle. It does **not** detect a fault that affects **both cores identically** — a shared-clock glitch, a shared-power droop, or a **deterministic design bug present in both**, since both cores are the same design and will compute the same wrong answer. Nor does it *correct* anything by itself: with two cores you learn that a disagreement occurred but not which core was right, so recovery requires a policy (halt, retry, reset) or a third core to vote. That is why lock-step is characteristic of **safety-critical** designs — automotive, aerospace, industrial control — where **detecting** a fault and failing safe is the requirement, and why an attacker with precise spatial control over an EMFI pulse remains a harder adversary than a cosmic ray.

---

### Question 9 — ROP and the four control-flow mechanisms

**Q:** Explain why the stack is security-critical, define ROP and explain how it bypasses W⊕X. Give the ROP mechanism. Then compare Intel Shadow Stack, Intel IBT, ARM PAC and ARM BTI across protection focus, attack mitigated, mechanism and recompilation requirement, and explain the backward/forward edge distinction.

**Answer & Explanation:**

**The stack is just memory.** A program's memory space is a structured address space managed by the OS, containing **text** (executable code), **data** (initialised globals), **BSS** (uninitialised data), **heap** (dynamic memory) and **stack**. The **stack** is a **LIFO memory region for managing function execution**, controlled by a dedicated CPU register, the **Stack Pointer** — where typical pointers address the heap or data sections, the stack is reached through this register.

**And critically, it is not passive storage.** The stack **contains integer values such as return addresses**, and **these return addresses actively define the high-level execution path of the program.** So the stack is **control data stored in writable memory** — which is Chapter 7's von Neumann problem in its purest form: corrupt the data and you corrupt the control flow.

**W⊕X, and why it was not enough.** Modern OSes implement **W⊕X / DEP (Data Execution Prevention) / NX (Non-Executable memory)**: pages are marked **either writable or executable, never both**. This **stops classic stack-based buffer overflow attacks** in which an attacker writes **shellcode** to the stack and executes it.

**ROP.** **Return-Oriented Programming** is an exploit technique for executing arbitrary code **despite** DEP. **It does not inject new malicious code** — it **chains existing code snippets already present in target memory**, called **gadgets**. A gadget is **a sequence of instructions already present in executable memory that ends with a return instruction**.

**Why it circumvents W⊕X:** ROP **only uses code already located in executable memory regions** — the binary's **`.text`** section and **loaded libraries**. Since the attacker **reuses executable code**, DEP/NX does not block execution merely because the stack is non-executable. The stack supplies **addresses**, not instructions, and addresses are data.

**The mechanism:**

1. **Initial vulnerability** — typically a **stack-based buffer overflow**, allowing saved return addresses to be overwritten.
2. **Taking control of the stack pointer** — the attack controls `rsp` and creates a **malicious call stack**.
3. **Finding gadgets** — scanning the binary and loaded libraries such as **`libc.so`** for short sequences ending in `ret`.
4. **Crafting the ROP chain** — a payload on the stack of **gadget addresses interleaved with data those gadgets operate on**.
5. **Chained execution** — the vulnerability redirects control to the first gadget; **its final `ret` pops the next value from the stack**, which the attacker arranged to be the next gadget's address; and so on through the chain.

The primitive that makes it work is simply the semantics of `ret`:

```
RET:   IP <- [SP];   SP <- SP + word size
```

**So if the attacker controls stack memory, they control the sequence of return targets.** By chaining simple operations the attacker can **load values into registers, prepare function arguments, and call a library function** — Question 19 traces exactly that.

**The three software-era defences, and their limits.** **ASLR** randomises the base addresses of **stack, heap and loaded libraries** each run, so without knowing gadget addresses (`pop rdi; ret`) or function addresses (`system()`) the attacker **cannot build a functional chain** — but ASLR **can be bypassed using information leaks that disclose addresses**. **Stack canaries** place a random value **between local variables and the saved frame pointer / return address**, so a **linear** overflow must overwrite the canary before reaching the return address, and the check before return **aborts the program**. **CFI hardware** ensures indirect branches and returns **only jump to valid predetermined locations** such as function starts, and since **gadgets are often in the middle of functions**, CFI can detect and block jumps to them.

**The four hardware mechanisms compared:**

| | **Intel Shadow Stack (SS)** | **Intel IBT** | **ARM PAC** | **ARM BTI** |
|---|---|---|---|---|
| **Protection focus** | **Backward edge** — `RET` | **Forward edge** — indirect `JMP`/`CALL` | **Backward edge** — `RET` | **Forward edge** — indirect `JMP`/`CALL` |
| **Primary attack mitigated** | **ROP** | **JOP / COP** | **ROP** | **JOP / COP** |
| **Core mechanism** | A **duplicate hardware-protected stack** stores a second copy of return addresses; **mismatch on `RET` faults** | Indirect branches must land on **`ENDBRANCH`**; landing elsewhere faults | **Cryptographically signs** a pointer before storage; **verified before use** | Indirect branches must land on a **BTI instruction** acting as a valid landing pad |
| **Recompilation required?** | **No** — the OS can enable it for **legacy binaries**, because it hooks into existing `CALL`/`RET` | **Yes** — the compiler must insert `ENDBRANCH` at every valid target | **Yes** — the compiler must insert `PAC`/`AUT` instructions | **Yes** — the compiler must insert BTI instructions at valid targets |

**The edge distinction, which organises the whole table:**

* **Backward-edge control flow** = **function returns**. Typical attack **ROP**. Defences **Intel SS**, **ARM PAC**.
* **Forward-edge control flow** = **indirect jumps and calls**. Typical attacks **JOP**, **COP**. Defences **Intel IBT**, **ARM BTI**.

**The row worth dwelling on is recompilation.** **Intel Shadow Stack is the only one of the four that protects legacy code**, because it works purely by shadowing the existing `CALL`/`RET` instruction pair and needs no new instructions in the binary. The other three require the compiler to emit something — a landing pad or a signing instruction — so **code that was never recompiled gets no protection**. The lecture makes this point explicitly against BTI: **ARM's BTI does not help secure legacy code that has no BTI instructions.** For a large deployed base of un-rebuildable binaries, that difference matters more than any strength comparison between the mechanisms.

**And note that a complete defence needs one from each column.** SS or PAC alone leaves JOP; IBT or BTI alone leaves ROP. Question 20 traces the case a shadow stack catches that a canary does not, and Question 22 works through the layering on a concrete overflow.

---

## Part 2: Memory & Storage Size Calculations

### Question 10 — Segmentation arithmetic

**Q:**

1. A descriptor has **Base = `0x00200000`**. Give the linear address for offset `0x1234`.
2. The Limit field is **20 bits**. What is the largest byte-granular segment? What if a 4 KiB granularity flag is applied?
3. How many privilege levels can DPL encode, and why?
4. Give the address-bus width implied by Real Mode's 1 MB, the 80286's 16 MB, and the i386's 4 GB.
5. A segment has Limit = `0x0FFF`. Does an access at offset `0x1234` succeed?

**Answer & Explanation:**

**1 — Linear address.** Segmentation is a base-plus-offset addition performed in hardware:

```
Linear Address = Segment Base Address + Offset
               = 0x00200000 + 0x1234
               = 0x00201234
```

**2 — Segment size from a 20-bit Limit.**

```
byte granularity:  2^20 = 1,048,576 bytes = 1 MiB
4 KiB granularity: 2^20 × 4 KiB = 4 GiB
```

The granularity flag is what lets a 20-bit field describe a 4 GiB segment: the limit is counted in **pages** rather than bytes, trading precision (segments become 4 KiB-quantised) for reach. This is the same size/granularity trade that appears in MTE's 16-byte granules and in MPU regions (Question 12).

**3 — DPL.** The field is **2 bits**, giving `2² = 4` values — `DPL ∈ {0,1,2,3}` — which is **exactly the four protection rings**. The encoding width and the ring count are the same design decision, which is why x86 has four rings and not five.

**4 — Address-bus widths.**

| Mode | Space | Width |
|---|---|---|
| Real Mode | 1 MB | `2^20` → **20 bits** |
| 80286 Protected Mode | 16 MB | `2^24` → **24 bits** |
| i386 | 4 GB | `2^32` → **32 bits** |

This is the arithmetic behind the discrepancy flagged in Question 2: the Unreal Mode slide's **4 GB** figure is a **32-bit** space and therefore i386-era, not the 80286's 24-bit 16 MB.

**5 — The limit check.**

```
offset 0x1234 = 4660
limit  0x0FFF = 4095
4660 > 4095  ->  OUT OF BOUNDS  ->  the access FAULTS
```

**What this question demonstrates about segmentation as a protection mechanism.** All four descriptor protections are **cheap comparisons on this one addition**: the **Limit** bounds the offset, the **Type** bits gate the access kind, the **DPL** is compared against the current privilege level, and **P** decides whether the segment is resident at all. Segmentation was not a weak *protection* design — it carried bounds and permissions per region, which is more metadata than a flat pointer ever had.

Its failure was **allocation**, not protection: variable-sized segments **fragment** (Question 2), and a program cannot be given a segment when no contiguous hole is large enough. **Paging keeps the per-region metadata and abandons the variable sizing**, which is why the page-table entry of Question 11 looks like a descriptor with the Base and Limit replaced by a fixed-size frame number.

---

### Question 11 — i386 two-level paging

**Q:** With `CR3 = 0x00030000`, translate linear address **`0x12345678`**.

1. Decompose the address into its three fields, in hex and decimal.
2. Give the address of the page-directory entry accessed.
3. That entry points to a page table at `0x00040000`. Give the address of the page-table entry accessed.
4. That entry holds page frame `0x9ABC`. Give the physical address.
5. How many pages does this scheme address, and what total space? What is the memory cost of a page directory, and of a **complete** set of tables mapping the whole space?

**Answer & Explanation:**

**1 — The three fields.** The i386 32-bit linear address splits **10 / 10 / 12**:

| Bits | Field | Hex | Decimal |
|---|---|---|---|
| 31–22 | **Directory** index | `0x48` | **72** |
| 21–12 | **Table** index | `0x345` | **837** |
| 11–0 | **Offset** | `0x678` | **1656** |

Reassembling `(0x48 << 22) | (0x345 << 12) | 0x678` returns `0x12345678`, which confirms the boundaries. And the widths are mutually determined: `10 + 10 + 12 = 32` bits, exactly the linear address width.

**2 — The page-directory entry.** `CR3` holds **the address of the active process's Page Directory**, and entries are **4 bytes**:

```
PDE address = CR3 + Directory × 4
            = 0x00030000 + 72 × 4
            = 0x00030000 + 0x120
            = 0x00030120
```

**3 — The page-table entry.**

```
PTE address = 0x00040000 + Table × 4
            = 0x00040000 + 837 × 4
            = 0x00040000 + 0xD14
            = 0x00040D14
```

**4 — The physical address.** The entry supplies a **frame** number, which must be shifted into place, and the **12-bit offset is appended unchanged**:

```
Physical Address = (0x9ABC << 12) | 0x678
                 = 0x09ABC000 | 0x678
                 = 0x09ABC678
```

**5 — Capacity and cost.**

```
page-selection bits = 10 (directory) + 10 (table) = 20
virtual pages       = 2^20 = 1,048,576
page size           = 2^12 = 4096 bytes = 4 KiB
total space         = 2^20 × 2^12 = 2^32 = 4 GiB
```

```
one page directory   = 1024 entries × 4 B = 4096 B = 4 KiB  (exactly one page)
one page table       = 1024 entries × 4 B = 4 KiB
complete mapping     = 1 directory + 1024 tables = 1025 pages
                     = 1025 × 4096 = 4,198,400 B ≈ 4.004 MiB
overhead vs 4 GiB    = 0.098%
```

**Three observations worth making.**

**A table is exactly one page, and that is not a coincidence.** `1024 entries × 4 bytes = 4096 bytes`, so the translation structures are themselves allocated in the same unit they describe. Choosing a 4 KiB page and a 4-byte entry forces 1024 entries, which forces a 10-bit index, which — with two levels — forces the 12-bit offset to make 32. The parameters are **one interlocking design**, exactly as in the 4-level 64-bit case.

**The two-level structure exists because the address space is sparse.** A single flat table would need `2^20 × 4 B = 4 MiB` **per process**, permanently, whether or not the process maps anything. The tree lets an **absent directory entry prune an entire 4 MiB range** (`1024 pages × 4 KiB`) at the cost of one 4-byte slot, so a small process pays for a directory plus a handful of tables — perhaps 12 KiB rather than 4 MiB.

**Translation costs memory accesses, which is why the TLB exists.** This walk read **two** entries (the PDE and the PTE) before the data access — three accesses to satisfy one load. Chapter 6's 4-level case costs four, and nested paging twenty-four. Every level added for sparsity is a level added to the walk, which is the tension the **TLB** was introduced to resolve.

---

### Question 12 — MPU/PMP region arithmetic

**Q:**

1. A region must cover `0x20000000`–`0x20002FFF`. Is that a single NAPOT region? Decompose it minimally.
2. If instead you round up to one region, how much extra memory becomes accessible?
3. For 3 KiB, 5 KiB and 12 KiB buffers, give the NAPOT region size and the over-permission, absolutely and as a percentage.
4. An RTOS needs regions for kernel code (RX), kernel data (RW), three task stacks (RW), a peripheral block (RW) and a shared read-only area (R). Does this fit in 8 regions? What happens when two more tasks are added?
5. What does this tell you about the "limited granularity" vulnerability?

**Answer & Explanation:**

**1 — NAPOT decomposition.** **NAPOT** means **naturally aligned power-of-two**: a region of size `2^n` must start at an address that is a multiple of `2^n`.

```
size = 0x20002FFF - 0x20000000 + 1 = 0x3000 = 12,288 bytes = 12 KiB
12 KiB = 3 × 4 KiB, which is NOT a power of two
```

So it cannot be one NAPOT region. Minimally it takes **two**:

| Region | Base | Size | Covers |
|---|---|---|---|
| 1 | `0x20000000` | **8 KiB** | `0x20000000`–`0x20001FFF` |
| 2 | `0x20002000` | **4 KiB** | `0x20002000`–`0x20002FFF` |

Note the alignment constraint doing real work: the 8 KiB piece must come **first**, because `0x20002000` is not 8 KiB-aligned. Decomposition is not simply "largest powers of two" — it is largest **aligned** powers of two.

**2 — Rounding up to one region.**

```
next power of two ≥ 12,288 = 16,384 bytes = 16 KiB
over-permission = 16,384 - 12,288 = 4096 bytes = 4 KiB
```

**4 KiB of memory beyond the intended region becomes accessible with the region's permissions** — the concrete form of the "region may be larger than necessary, potentially allowing unintended access to nearby data" limitation.

**3 — Over-permission for small buffers.**

| Buffer | NAPOT region | Over-permission | As % of the buffer |
|---|---|---|---|
| 3 KiB | 4 KiB | 1 KiB | **33%** |
| 5 KiB | 8 KiB | 3 KiB | **60%** |
| 12 KiB | 16 KiB | 4 KiB | **33%** |

**The 5 KiB case is the worst**, and the pattern is general: a size just above a power of two rounds up to nearly double, so **over-permission approaches 100% for a buffer of size `2^n + 1`**. Region granularity is not a fixed tax — it depends on how unluckily your sizes fall.

**4 — Region budget.**

```
kernel code (RX)      1
kernel data (RW)      1
task stacks (RW)      3
peripherals (RW)      1
shared read-only (R)  1
                     ---
total                 7   of 8 available  ->  fits, with 1 spare
add two more tasks    9   of 8 available  ->  DOES NOT FIT
```

**5 — What this tells you about the limitation.** The granularity vulnerability has **two independent faces**, and both appear above.

**Spatial over-permission** (parts 1–3): a protected object rarely has a NAPOT size and alignment, so the enforced region is **larger than the object**, and whatever shares the rounded-up space inherits its permissions. There is no probability involved — it is **structural**, exactly like MTE's granule from Chapter 7.

**Region exhaustion** (part 4): with only **8 or 16** regions, a system that grows past the budget cannot express its intended policy at all. The engineer's options are all bad: **merge** regions (coarsening permissions — two task stacks in one RW region means task A can write task B's stack, destroying inter-task isolation); **drop** a region (leaving something unprotected); or **reconfigure on every context switch** (which reintroduces exactly the software complexity and latency variability that motivated choosing an MPU over an MMU).

**That is the real cost of the MPU/PMP trade.** An MMU's page tables scale to as many distinct protection domains as memory allows, at the price of variable latency; an MPU gives determinism and small silicon, at the price of a **hard ceiling on policy expressiveness**. And the ceiling is what turns a design decision into a vulnerability: coarse regions are not a theoretical inelegance but the mechanism by which one task reaches another's data.

---

### Question 13 — Rowhammer and refresh arithmetic

**Q:** Assume a **64 ms** DRAM refresh window and that bit flips require **50,000** activations of an aggressor row within one window.

1. At 500,000 activations per second, how many occur per refresh window? Is that enough?
2. What activation rate is required to reach the threshold?
3. If the OS halves the refresh interval to 32 ms, what rate is now required? Comment on this as a mitigation.
4. A memory controller has **16** TRR trackers. How many aggressor rows go untracked if the attacker hammers 20 rows? 32? What if 4 cores each hammer 8 rows?
5. Why does the cache-flush step matter to all of this?

**Answer & Explanation:**

**1 — Activations per window.**

```
500,000 activations/s × 0.064 s = 32,000 activations per refresh window
threshold = 50,000
32,000 < 50,000  ->  NOT enough; the refresh restores charge before flips accumulate
```

**2 — Required rate.**

```
50,000 / 0.064 s = 781,250 activations per second
```

So the attack needs roughly **780,000 row activations per second sustained** — which is why the mechanism is described as **a tight loop issuing thousands of read requests per second** and why it must **bypass the caches** (part 5).

**3 — Halving the refresh interval.**

```
threshold / 0.032 s = 1,562,500 activations per second
```

**The required rate exactly doubles.** And this is the argument against increased refresh as a mitigation, made quantitative:

* the attacker's cost goes up by a factor of **2**, which is a modest engineering obstacle — a faster loop, or more cores;
* the defender's cost is **paid by the entire system, continuously**, in both **performance and power**, because refreshes consume DRAM bandwidth that no workload gets to use.

A defence that doubles the attacker's effort while permanently taxing every access on the machine is a poor exchange — which is precisely why the lecture calls it **impractical as a general solution**, and why **TRR** exists: it applies extra refreshes **only to rows adjacent to a detected aggressor**, avoiding the system-wide cost.

**4 — Tracker exhaustion (TRRespass).**

| Attacker's aggressor rows | Trackers | Untracked |
|---|---|---|
| 20 | 16 | **4** |
| 32 | 16 | **16** |
| **4 cores × 8 rows = 32** | 16 | **16** |

**Any row beyond the tracker count is unmonitored**, so the controller **does not know it is an aggressor**, **issues no targeted refresh to its victims**, and bit flips proceed. The multi-core case is the practical one: the attacker does not need a faster loop, only **more loops in parallel**, and each core contributes rows to a shared, finite tracking resource.

**The structural point.** TRR is a **detection** mechanism with **bounded state**, and bounded state can be exhausted. The defence is not broken cryptographically or logically — it is **blinded by volume**, which is the same failure mode as any fixed-size table facing an adversary who controls the number of entries. That is why the effectiveness of TRR **depends on implementation details, available memory-controller resources and hammering pattern complexity**, and why newer patterns keep defeating newer in-DRAM TRR in **LPDDR5** and **DDR5**.

**5 — Why cache flushing matters.** Every figure above counts **DRAM row activations**, not CPU loads. A read that **hits in cache never reaches DRAM**, so it contributes **nothing** to the electrical stress — a naive hammering loop would be entirely absorbed by the L1 and produce zero activations. Hence step 2 of the attack: **`CLFLUSH` on x86 to bypass CPU caches**, ensuring **every memory read goes directly to the DRAM hardware**, with **`mfence`** enforcing ordering so the reads are not reordered or coalesced.

This is also why the variants matter: **Nethammer** attacks systems that use **uncached memory or flush instructions while processing network requests**, i.e. it finds a way to get DRAM-reaching accesses **without needing a flush instruction of its own** — and **Throwhammer** does it **remotely over RDMA**, where the network card's DMA writes bypass the CPU cache by construction. Removing `CLFLUSH` from unprivileged code is therefore not a fix; the requirement is only that accesses reach DRAM, and there are many ways to arrange that.

---

### Question 14 — ROP chain and ASLR arithmetic

**Q:** On x86-64, a vulnerable function has a **64-byte** local buffer, then a saved frame pointer, then the return address.

1. State the `RET` semantics precisely.
2. How many bytes of overflow are needed to reach the return address slot?
3. Lay out this chain and give its size: `pop rdi; ret` → `0x601050` → `pop rsi; ret` → `0x0` → `system()`.
4. What is the total overflow length required?
5. If library base addresses have 28 bits of ASLR entropy, how many possibilities must the attacker consider, and what does one information leak do?

**Answer & Explanation:**

**1 — `RET` semantics.** This one primitive is the whole technique:

```
RET:   IP <- [SP]        (load the instruction pointer from the top of the stack)
       SP <- SP + 8      (pop it; 8 bytes on x86-64)
```

**So whoever controls stack memory controls the sequence of return targets.** No instruction is injected; `ret` is simply asked to read attacker-supplied data.

**2 — Reaching the return address.**

```
local buffer        64 bytes
saved frame pointer  8 bytes
                    ---------
padding to reach the return slot = 72 bytes
```

The 73rd through 80th bytes written land **on the return address itself**.

**3 — The chain.** Each entry is one 8-byte word, and gadget addresses and data **interleave** — the data words are what the preceding `pop` instructions consume:

| Stack offset | Value | Role |
|---|---|---|
| `+0x00` | `0x400a01` | `pop rdi; ret` — occupies the **return address slot** |
| `+0x08` | `0x601050` | data: popped into `rdi` (pointer to `"/bin/sh"`) |
| `+0x10` | `0x400a03` | `pop rsi; ret` |
| `+0x18` | `0x0` | data: popped into `rsi` |
| `+0x20` | `0x400b10` | address of `system()` |

```
chain size = 5 words × 8 bytes = 40 bytes
```

**4 — Total overflow.** The chain's **first** word *is* the return address, so it is not additional padding:

```
total = 72 bytes of padding + 40 bytes of chain = 112 bytes
```

Writing 112 bytes into a 64-byte buffer is a 48-byte overflow of the buffer — modest, and well within what a single unbounded `strcpy` achieves.

**5 — ASLR entropy.**

```
28 bits of entropy -> 2^28 = 268,435,456 possible library base addresses
after one address leak -> 1
```

**Why ASLR is nonetheless the defence ROP actually has to defeat first.** Every one of the five values in the table above is an **absolute address** — three gadget addresses inside libc, a data address, and `system()`. With libc randomised, all of them are unknown, so the chain cannot be constructed at all, and blind guessing against `2^28` possibilities means each wrong guess crashes the process. But **ASLR can be bypassed using information leak vulnerabilities that disclose memory addresses**, and because the randomisation applies **one base offset per library**, a **single leaked address collapses the whole space to one candidate** — every gadget's offset from the base is fixed and published in the binary.

That is the same coarse-granularity weakness as kernel ASLR in Chapter 4 and stack canaries: **one secret, leaked once, and the mitigation is finished.** It is also why the defences that do not depend on secrecy — **shadow stacks**, **PAC**, **IBT/BTI** — are the ones that changed the picture. A shadow stack does not care whether the attacker knows the gadget addresses; the mismatch on `RET` is detected regardless.

---

### Question 15 — FLUSH+RELOAD arithmetic

**Q:**

1. Why is the Meltdown probe array **256 entries of 4096 bytes**, and how large is it?
2. How many bits does one successful attempt recover, and how many attempts to leak 4 KiB?
3. With a cache hit at 50 cycles and a miss at 310 cycles on a 3 GHz CPU, give both times in nanoseconds and the discrimination ratio.
4. State the recovery step formally.
5. What exactly is the "race" that makes step 2 of the attack possible?

**Answer & Explanation:**

**1 — The probe array's shape.**

```
256 entries × 4096 bytes = 1,048,576 bytes = 1 MiB
```

**256 entries** because the secret is **one byte**, with 256 possible values, and the attack uses the secret **directly as an index** — one distinct cache line per possible value. **4096 bytes apart** because entries must land on **separate pages**: if the probe locations were adjacent, the hardware **prefetcher** would pull neighbouring lines into the cache alongside the one the secret selected, and several indices would appear fast. Page-sized stride defeats prefetching, because prefetchers do not cross page boundaries.

**2 — Yield per attempt.**

```
log2(256) = 8 bits = 1 byte per successful attempt
to leak 4096 bytes -> 4096 successful attempts (before retries)
```

The attack is therefore **byte-serial**: every byte requires its own trigger, transmit and recover cycle, plus repetitions to overcome noise. That is why leak rates are measured in kilobytes per second rather than instantaneously — but also why it is entirely practical, since 4096 attempts is a fraction of a second of work.

**3 — Timing discrimination.**

| Outcome | Cycles | Time at 3 GHz |
|---|---|---|
| Cache **hit** | 50 | **16.7 ns** |
| Cache **miss** | 310 | **103.3 ns** |

```
discrimination ratio = 310 / 50 = 6.2×
```

A **6× timing difference** is enormous and trivially measurable with `rdtsc`, which is why the side channel is so reliable. The attacker does not need a subtle statistical inference — one probe of each of the 256 entries yields one obvious outlier.

**4 — The recovery step.**

```
argmin_i  reload_time(probe_array[i])  =  S
```

The **fastest-reloading** entry is the one already resident in **L1**, and the only thing that could have loaded it is the transient instruction `mov rbx, [PROBE + rax]` executing with the secret in `rax`. So the index of the fastest probe **is the secret byte**.

**5 — The race.** This is the crux, and it is a race between two things that were never intended to be concurrent:

* the **execution unit**, which the out-of-order engine dispatches **immediately** on encountering `mov rax, [KERNEL_ADDR]`; and
* the **security permission check**, which resolves more slowly.

Because the engine does not wait for the check, there is a **window** in which the forbidden byte is in a register and **subsequent transient instructions can use it**. When the check finally fails, the **pipeline is squashed and register results are discarded** — the ROB does its job perfectly. **But the L1 cache state is not reverted**, because the ROB's contract covers **architectural** state only.

**And this is why the design decision mattered.** The kernel byte was reachable at all only because **a large portion of kernel memory was mapped into every user process's page table** — inaccessible by permission, but **present in the address space and therefore translatable**. **KPTI** removes those mappings, so the speculative load has no valid translation and **cannot proceed in the same way**. The mitigation targets not the race, not the cache, and not the permission check, but the **presence of the mapping** — the one element of the chain that was a removable design choice rather than a fundamental performance mechanism. The cost, a **page-table switch on every system call**, is what that choice was originally made to avoid.

---

## Part 3: Code Tracing & Output Prediction

### Question 16 — Tracing segmentation checks

**Q:** A GDT contains three descriptors. The CPU is running at **CPL = 3**.

| Selector | Base | Limit | Type | DPL |
|---|---|---|---|---|
| `0x08` | `0x00100000` | `0x0FFF` | code, execute/read | **0** |
| `0x10` | `0x00200000` | `0xFFFF` | data, read/write | **3** |
| `0x18` | `0x00300000` | `0x00FF` | data, **read-only** | **3** |

For each access, give the linear address if it proceeds, or the reason it faults.

| # | Access |
|---|---|
| 1 | **read** at `(0x10, 0x1234)` |
| 2 | **write** at `(0x10, 0x1234)` |
| 3 | **write** at `(0x18, 0x0080)` |
| 4 | **read** at `(0x18, 0x0100)` |
| 5 | **read** at `(0x08, 0x0010)` |
| 6 | **execute** at `(0x10, 0x0000)` |

**Answer & Explanation:**

Three checks run on every segmented access, and any one can fail: **Limit** (is the offset within the segment?), **Type** (is this kind of access allowed?), **DPL versus CPL** (is the current privilege level sufficient?).

| # | Check that decides it | Result |
|---|---|---|
| 1 | `0x1234 ≤ 0xFFFF` ✓, readable ✓, `DPL 3 ≥ CPL 3` ✓ | **OK** → `0x00200000 + 0x1234 = 0x00201234` |
| 2 | Same segment, and it is **read/write** | **OK** → `0x00201234` |
| 3 | Segment is **read-only** | **FAULT — Type.** A write to a read-only data segment |
| 4 | `0x0100 > 0x00FF` | **FAULT — Limit.** One byte past the end: the limit is the **maximum allowed offset**, so `0x00FF` is the last valid byte |
| 5 | `DPL = 0`, `CPL = 3` | **FAULT — Privilege.** Ring 3 code cannot reach a ring-0 segment |
| 6 | Segment is **data**, not executable | **FAULT — Type.** An instruction fetch from a data segment |

**Exact linear addresses computed:** access 1 and 2 both resolve to **`0x00201234`**; nothing else produces an address at all.

**Four things this trace establishes.**

**Rows 1 and 2 versus row 3 show that Type is a per-segment permission, not a per-address one.** The same offset is writable through selector `0x10` and not through `0x18`, because the authority travels with **the descriptor**, not with the address. This is the ancestor of the page-table `R/W` bit and, much later, of a capability's permission field.

**Row 4 is the off-by-one worth being explicit about.** `Limit` is the **maximum allowed offset**, so a segment with limit `0x00FF` is **256 bytes** spanning offsets `0x00`–`0xFF`. An access at `0x0100` is the classic one-past-the-end read — caught here **deterministically**, in hardware, on every access.

**Row 5 is where segmentation and the ring model meet.** Question 1 noted that rings define privilege but not memory; the **DPL** field is the join. Without it, ring 3 code would be prevented from executing privileged *instructions* while remaining free to read kernel *data*, which is no isolation at all.

**Row 6 is W⊕X in its earliest form.** Marking a segment as data rather than code makes instruction fetch from it a fault — the same policy that DEP/NX later applied per page, and that Question 24's JIT violates. Note that the mechanism long predates the attacks it defends against.

**And the reason all of this was replaced.** Every check above is cheap and effective; what killed segmentation was **allocation**, not protection. Variable-sized segments **fragment**, so the model that gave excellent per-region metadata could not reliably find room for a region. Paging kept the metadata — Limit becomes a fixed frame size, Type becomes `R/W` and `U/S` — and discarded the variable sizing.

---

### Question 17 — Tracing an i386 page-table walk

**Q:** `CR3 = 0x00030000`. The page directory entry at index `0x48` contains page-table base `0x00040000` with `P=1, R/W=1, U/S=1`. In that page table:

* entry `0x345` holds frame `0x9ABC`, `P=1`, **`R/W=0`**, `U/S=1`
* entry `0x346` holds frame `0x9ABD`, **`P=0`**
* entry `0x347` holds frame `0x9ABE`, `P=1`, `R/W=1`, **`U/S=0`**

For each access from **user mode**, give the physical address or the fault.

| # | Access |
|---|---|
| 1 | **read** `0x12345678` |
| 2 | **write** `0x12345678` |
| 3 | **read** `0x12346000` |
| 4 | **read** `0x12347010` |
| 5 | **read** `0x12345678` again, immediately after access 1 |

**Answer & Explanation:**

**The decomposition, done once.** All four addresses share directory index `0x48`; they differ in the table index:

| Linear address | Directory | Table | Offset |
|---|---|---|---|
| `0x12345678` | `0x48` | **`0x345`** | `0x678` |
| `0x12346000` | `0x48` | **`0x346`** | `0x000` |
| `0x12347010` | `0x48` | **`0x347`** | `0x010` |

**The walk, done once:** `CR3 + 0x48 × 4 = 0x00030120` gives the directory entry → page table at `0x00040000` → `0x00040000 + index × 4` gives the page-table entry.

| # | Entry consulted | Result |
|---|---|---|
| 1 | `0x345`: `P=1, R/W=0, U/S=1` | **OK** — read of a read-only user page → PA = `(0x9ABC << 12) \| 0x678` = **`0x09ABC678`** |
| 2 | Same entry | **PAGE FAULT — protection.** `R/W=0` forbids the write |
| 3 | `0x346`: **`P=0`** | **PAGE FAULT — not present.** The page is not in RAM; the handler must page it in from disk and restart the access |
| 4 | `0x347`: **`U/S=0`** | **PAGE FAULT — privilege.** A supervisor-only page accessed from user mode |
| 5 | Cached in the **TLB** | **OK** — PA = **`0x09ABC678`**, with **no walk**: the two table reads are skipped entirely |

**What each row teaches.**

**Row 1 shows the offset passing through untranslated.** `0x678` appears unchanged in the physical address. Translation operates on **frame numbers only**, which is why the granularity **is** the page size.

**Rows 2, 3 and 4 are the three distinct page-fault causes, and distinguishing them matters.** All three raise the *same* exception, and the kernel's handler must inspect the fault status to decide what to do:

* **Row 3 (`P=0`) is normally not an error at all** — it is the mechanism behind **demand paging** and **copy-on-write**. The handler maps the page and **restarts the instruction**, and the program never knows.
* **Rows 2 and 4 are genuine violations.** For row 2 the handler either terminates the process or — if this is a **copy-on-write** page deliberately marked read-only — copies the page, marks it writable, and restarts. So even a protection fault can be a normal mechanism, depending on the kernel's bookkeeping.
* **Row 4 is the process/kernel boundary being enforced**, and it is the check Meltdown races against (Question 15). Note that the *translation* here succeeds — the mapping exists and is perfectly valid — and only the **permission** check fails. That is precisely the configuration Meltdown exploited: **present in the address space, forbidden by permission**.

**Row 5 is why the TLB exists, and it is the performance point.** Accesses 1 and 5 are identical, but the first cost **three memory accesses** (directory entry, table entry, data) and the second cost **one**. Because walks have **high latency**, the MMU caches recent translations; without it, every load would triple in cost. And this is the hidden expense of **KPTI**: switching page tables on every syscall means **flushing the TLB**, so the next accesses each pay the full walk again — which is exactly the cost that mapping the kernel into every address space was designed to avoid.

---

### Question 18 — Recovering a secret with FLUSH+RELOAD

**Q:** A Meltdown attacker has flushed a 256-entry probe array, run the transient sequence, handled the exception, and timed a reload of every entry. Reload times in cycles:

| Index | `0x00`–`0x40` | `0x41` | `0x42`–`0xFF` |
|---|---|---|---|
| Cycles | ~312 | **78** | ~309 |

1. What is the secret byte, and what character is it?
2. Explain why exactly one entry is fast.
3. A second run gives two fast entries, `0x41` at 80 cycles and `0x42` at 91 cycles. What happened, and how should the attacker respond?
4. A third run gives **no** fast entry. Give two possible causes.

**Answer & Explanation:**

**1 — The secret.**

```
argmin_i reload_time(probe_array[i]) = 0x41
```

The secret byte is **`0x41`**, which in ASCII is the character **`'A'`**.

**2 — Why exactly one entry is fast.** The transient instruction sequence was:

```asm
mov rax, [KERNEL_ADDR]     ; secret 0x41 transiently in rax
mov rbx, [PROBE + rax]     ; touches probe_array[0x41] -> that page enters L1
```

The attacker **flushed the entire probe array beforehand**, so every entry started out of cache. The **only** thing that could have brought any entry back is that second transient load, and the index it used **was the secret**. So a cache **hit** at index `i` is proof that the transient execution used `i` — and the 78-versus-310 cycle gap (a **4×** difference here) makes it unambiguous.

Note what has happened architecturally: the read of `KERNEL_ADDR` **failed**, the fault was raised, the pipeline was squashed and `rax` was discarded. **Not one bit of the secret survived in architectural state.** It survived only as **which cache line is resident** — microarchitectural state the ROB never promised to unwind.

**3 — Two fast entries: prefetcher or noise.** The likely cause is the **hardware prefetcher**, which observed the access to `probe_array[0x41]` and speculatively pulled in a neighbouring region, warming `0x42` as well. Ordinary system noise — an unrelated process touching that memory, or an interrupt — can do the same.

**The attacker's response is repetition.** Run the whole trigger/transmit/recover cycle many times for the same secret byte and take the index that is fastest **most often**. Because prefetcher and noise effects are not correlated with the secret, they average out, while the true index is fast every time. The structural mitigation on the attacker's side is what the probe array's shape already encodes: **entries are 4096 bytes apart precisely so the prefetcher cannot easily bridge them**, since prefetchers do not cross page boundaries — which is why this failure mode is uncommon rather than routine.

**4 — No fast entry: two causes.**

**The transient window closed too early.** The permission check resolved before the second load could execute, so `probe_array[S]` was never touched and nothing was cached. Window size varies with machine state — cache pressure, competing load on the core, the address's own translation status — so a proportion of attempts simply fail. The attacker's remedy is again repetition, often combined with deliberately slowing the permission check (for instance by ensuring the kernel address's translation is itself uncached).

**KPTI is enabled.** With **most kernel mappings removed from user-space page tables**, the address is **not translatable** in the user context, so the speculative load **cannot proceed in the same way** and the secret never reaches `rax`. This is the diagnostic difference between an unmitigated and a mitigated machine: on an unmitigated one the attack fails **intermittently** and succeeds on repetition; with KPTI it fails **consistently**, because the chain is broken at its first link rather than losing a race.

**The exam-relevant summary.** The information channel here is **not** a bug in the permission check, which worked correctly, nor in the ROB, which discarded the architectural results correctly. It is the gap between **what the ISA promises to undo** (architectural state) and **what an attacker can observe** (timing, and therefore cache residency). Every mitigation in Question 6 attacks a different link in that chain: **KPTI** removes the mapping, **speculation barriers** close the window, and **speculation-safe microarchitectures** keep speculative loads in a buffer that is **invalidated on mis-speculation so no measurable side effect remains**.

---

### Question 19 — Tracing a ROP chain

**Q:** A stack overflow has placed the following at and above the return address slot. Trace execution from the vulnerable function's `ret`, giving `rsp`, the instruction pointer target, and register state at each step.

```
[rsp+0x00]  0x400a01     ; gadget A:  pop rdi ; ret
[rsp+0x08]  0x601050     ; address of the string "/bin/sh"
[rsp+0x10]  0x400a03     ; gadget B:  pop rsi ; ret
[rsp+0x18]  0x0000000000000000
[rsp+0x20]  0x400b10     ; address of system()
```

What does the attacker achieve, and which defences would have stopped this?

**Answer & Explanation:**

**The primitive, applied repeatedly:** `RET: IP ← [SP]; SP ← SP + 8`.

| Step | Action | `rsp` after | `rdi` | `rsi` | Next instruction |
|---|---|---|---|---|---|
| 0 | Vulnerable function executes `ret`: pops `0x400a01` | `+0x08` | — | — | **gadget A** |
| 1 | `pop rdi` reads `[rsp]` = `0x601050` | `+0x10` | **`0x601050`** | — | `ret` of gadget A |
| 2 | Gadget A's `ret` pops `0x400a03` | `+0x18` | `0x601050` | — | **gadget B** |
| 3 | `pop rsi` reads `[rsp]` = `0x0` | `+0x20` | `0x601050` | **`0x0`** | `ret` of gadget B |
| 4 | Gadget B's `ret` pops `0x400b10` | `+0x28` | `0x601050` | `0x0` | **`system()`** |

**Final state:** `rdi = 0x601050` (pointer to `"/bin/sh"`), `rsi = 0`, and execution has transferred to **`system()`**.

**What the attacker achieved.** On the x86-64 System V calling convention the **first integer argument is passed in `rdi`**, so this is a call to `system("/bin/sh")` — **a shell, with the privileges of the vulnerable process.** Five stack words, 40 bytes, no injected code.

**Two mechanics worth naming explicitly.**

**The `pop` instructions consume the interleaved data.** The chain alternates gadget addresses with values, and each `pop` takes the next word and advances `rsp`, so the *same* stack region serves as both **the instruction schedule** and **the argument list**. That is what "interleaved data that those gadgets will operate on" means, and it is why counting chain length requires counting data words too (Question 14).

**No page was ever both writable and executable.** The stack held only **addresses**, and every instruction executed came from `.text` or libc — **already executable memory**. So **W⊕X / DEP / NX was fully in force and entirely irrelevant**: it prevents executing *injected* code, and nothing was injected. This is the single most important point about ROP.

**Which defences would have stopped it:**

| Defence | Effect | Verdict |
|---|---|---|
| **W⊕X / NX** | Blocks injected shellcode only | **No effect** — nothing was injected |
| **ASLR** | The five absolute addresses become unknown; `2^28` candidates for the libc base, and each wrong guess crashes | **Stops it — unless an infoleak discloses one address**, after which every offset is computable |
| **Stack canary** | A **linear** overflow must cross the canary to reach the return slot, so the check before `ret` fails and the program aborts **before step 0** | **Stops this overflow.** But not a non-linear write (Question 20), and not if the canary leaks |
| **Intel Shadow Stack** | The real return address was pushed to the protected shadow stack at call time; step 0 pops `0x400a01` from the normal stack, the two **mismatch**, and a control-flow protection exception fires | **Stops it** — and, uniquely, **without recompilation** |
| **ARM PAC** | The saved return address was **signed**; `0x400a01` carries no valid PAC, so the `AUT` check before `ret` fails | **Stops it** (requires recompilation) |
| **IBT / BTI** | Protect the **forward** edge only | **No effect** — every transfer here is a `ret`, the **backward** edge |

**The pattern to state.** ROP is a **backward-edge** attack, so the defences that address it are the **backward-edge** ones — **Shadow Stack** and **PAC** — plus the two secrecy-based mitigations, **ASLR** and **canaries**, which work until something leaks. **IBT and BTI are the wrong tools here**, and would be the right tools against the JOP variant where gadgets end in indirect branches instead. A complete control-flow defence needs **one mechanism from each edge**, which is exactly what Question 9's comparison table is arranged to show.

---

### Question 20 — Tracing a shadow stack

**Q:** A program runs with an Intel Shadow Stack and stack canaries both enabled. For each scenario, state whether the canary check passes, whether the shadow stack check passes, and the overall outcome.

| # | Scenario |
|---|---|
| 1 | Normal call and return, no corruption |
| 2 | A linear `strcpy` overflow overwrites the canary and the return address |
| 3 | An arbitrary-write primitive overwrites **only** the return address, leaving the canary intact |
| 4 | The attacker leaks the canary value, then overflows, rewriting the correct canary and a new return address |
| 5 | A JOP attack corrupting a function pointer, then an indirect `call` |

**Answer & Explanation:**

**The two mechanisms.** A **canary** is a random value placed **between local variables and the saved frame pointer / return address**, checked before return. A **shadow stack** pushes the return address **onto both the normal stack and a hardware-protected shadow stack** on `CALL`, pops **both** on `RET`, and **compares them**; a mismatch raises a **control-flow protection exception**.

| # | Canary check | Shadow stack check | Outcome |
|---|---|---|---|
| 1 | **Passes** | **Passes** — the two copies match | Normal return |
| 2 | **FAILS** — the canary was overwritten | Would also fail | **Program aborts** at the canary check, before `ret` |
| 3 | **Passes** — the canary was never touched | **FAILS** — normal stack holds the attacker's address, the shadow stack holds the real one | **Control-flow protection exception.** Only the shadow stack catches it |
| 4 | **Passes** — the correct value was rewritten | **FAILS** — the shadow copy is unchanged and unreachable | **Control-flow protection exception.** Only the shadow stack catches it |
| 5 | **Passes** — irrelevant | **Passes** — irrelevant | **Attack succeeds.** Needs **IBT** (or BTI) |

**Rows 3 and 4 are the point of the question.** They are the two ways a canary fails while a shadow stack does not:

**Row 3 — the canary assumes a *linear* overflow.** Its entire security argument is that an overflow writing forward from a local buffer **must cross the canary** to reach the return address. An attacker with an **arbitrary-write** primitive — a format-string `%n`, an out-of-bounds array index with attacker-controlled offset, a use-after-free write — writes **directly** to the return address slot and never touches the canary. The tripwire is intact because the attacker stepped over it. The shadow stack makes no such assumption: it does not care **how** the value changed, only that the two copies **disagree**.

**Row 4 — the canary is a single secret.** Leak it once, and every subsequent overflow can carry the correct value. This is the same structural weakness as ASLR (one base offset), as kernel canaries (one value per CPU) and as PAC keys: **a defence resting on one secret ends when that secret leaks.** A shadow stack rests not on secrecy but on **memory protection** — the shadow stack is **set up by the OS/VMM, protected by new memory access control, and different for each privilege level**, so the attacker cannot write it even knowing exactly what it contains.

**Row 5 is the honest limit.** A shadow stack protects the **backward edge** only. A corrupted **function pointer** followed by an indirect `call` never consults it, because no `RET` is involved. That is **JOP/COP**, and the answer is **Intel IBT** (`ENDBRANCH` landing pads) or **ARM BTI**. Enabling a shadow stack and declaring control-flow integrity achieved is exactly the error Question 25 examines from the other direction.

**Two properties of the shadow stack design worth stating.** It requires **no recompilation** — the OS can enable it for **legacy binaries** because it hooks into the existing `CALL`/`RET` instructions, which is what distinguishes it from IBT, PAC and BTI. And it **keeps the stack ABI intact**: **no parameters are passed on the shadow stack** and there are **no changes to the data stack layout**, so it interoperates with existing calling conventions, debuggers and unwinders. Those two facts are why it is deployable at scale, and they are as examinable as the mechanism.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 21 — Spectre variant 1 in code

**Q:** Identify the vulnerability, explain why the bounds check does not prevent it, and give mitigations at the source level. Explain why this is harder to fix than Meltdown.

```c
#include <stddef.h>
#include <stdint.h>

extern uint8_t  array1[16];
extern size_t   array1_size;     /* == 16 */
extern uint8_t  array2[256 * 512];
extern uint8_t  temp;

/* `index` is attacker-controlled. */
void victim(size_t index)
{
    if (index < array1_size) {
        temp &= array2[array1[index] * 512];
    }
}
```

**Answer & Explanation:**

**The vulnerability.** This is **Spectre variant 1, Bounds Check Bypass (CVE-2017-5753)**, and it is the canonical shape: a **conditional branch performing a bounds check**, guarding a **memory access whose address depends on the loaded value**.

**Why the bounds check does not prevent it.** The check is **architecturally correct** — if you reason about committed state only, `array1[index]` is never read out of bounds. The problem is that the check is **not evaluated before the guarded code executes speculatively**:

1. The attacker **repeatedly calls `victim` with valid indices** (0–15).
2. This **trains the branch predictor** to expect the bounds check to **pass**.
3. The attacker calls with a **large out-of-bounds `index`**.
4. Reading `array1_size` may itself miss in cache, so the check is slow to resolve — and the CPU **follows the trained prediction**, speculatively executing the body **before the comparison completes**.
5. `array1[index]` performs an **out-of-bounds read of victim memory**, and the loaded byte indexes `array2`, **bringing one specific cache line resident**.
6. The branch resolves, the misprediction is detected, the pipeline is flushed, and **`temp` is never architecturally updated** — but **the cache line remains**, and **FLUSH+RELOAD** over the 256 possible lines recovers the secret byte (Question 15's `argmin`).

Note the `* 512` and the `256 * 512` array size: exactly the probe-array construction from Question 15, spacing entries so the **prefetcher** cannot bridge them.

**Why this is Spectre rather than Meltdown.** Meltdown had the *attacker's own* code read a kernel address and relied on a **race against the permission check**. Here the attacker never reads anything — **the victim's own correctly-written code performs the out-of-bounds read on the attacker's behalf**, after being mistrained. **Spectre turns the victim's code against itself**, which is why no privilege boundary is crossed and why removing a mapping does not help.

**Source-level mitigations:**

```c
void victim(size_t index)
{
    if (index < array1_size) {
        /* Mitigation 1: a speculation barrier.
           Nothing after this executes speculatively until the
           preceding instructions -- including the bounds check -- resolve. */
        speculation_barrier();          /* _mm_lfence() on x86; __builtin_arm_csdb() on ARM */

        temp &= array2[array1[index] * 512];
    }
}
```

```c
void victim(size_t index)
{
    /* Mitigation 2: index masking -- make the value SAFE rather than
       relying on control flow to prevent its use.  Requires a
       power-of-two size, here 16. */
    size_t safe = index & (array1_size - 1);

    temp &= array2[array1[safe] * 512];
}
```

**Why masking is the stronger of the two.** A barrier constrains **speculation**; masking removes the **out-of-bounds value itself**, so even if the CPU speculates freely, the address it computes is in bounds. The general principle is to convert a **control-flow** guarantee (this code runs only when the index is valid) into a **data-flow** one (the index is always valid) — because speculation reorders control flow and cannot invent data. This is why compilers implementing Spectre-v1 hardening prefer arithmetic clamping and conditional-move sequences over fences where they can.

**Why Spectre is harder to mitigate than Meltdown.** Meltdown depended on a **removable design decision** — kernel memory mapped into every user page table — so **KPTI** could break the chain once, system-wide, at a known cost. Spectre **exploits fundamental branch prediction behaviour**, present at **every conditional and indirect branch in every program**. There is no single mapping to remove, so mitigation is **per-code-site**: someone must identify each vulnerable pattern and insert a barrier or a mask, which is why **automated detection of Spectre gadgets remains hard** and why the deployed answers are broad and expensive — **fences** and **retpolines** in software, **IBRS** and **IBPB** in hardware — all of which **prevent or control speculation** and therefore **cost performance**.

**And note where the real fix lies.** The architectural answer is a **speculation-safe microarchitecture**: hold speculative loads in a **private speculation buffer** merged into the cache hierarchy **only if speculation is confirmed correct**, and **invalidated otherwise so no measurable side effect remains**. That removes the channel rather than the gadget, which is the only approach that does not require finding every vulnerable line of source in the world.

---

### Question 22 — A stack overflow and the layered defences

**Q:** Identify the vulnerability and give a corrected version. Then state, for each defence, whether it stops the attack and why: NX, ASLR, stack canary, Intel Shadow Stack, ARM PAC, Intel IBT.

```c
#include <stdio.h>
#include <string.h>

void handle_name(const char *input)
{
    char name[64];

    strcpy(name, input);          /* unbounded */
    printf("hello, %s\n", name);
}
```

**Answer & Explanation:**

**The vulnerability.** `strcpy` copies until it finds a terminator **in the source**, ignoring the destination's size, so any `input` longer than 63 characters overflows `name`. Because a stack buffer is written **upward** while the stack grows **down**, the overflow runs through the rest of the frame into the **saved frame pointer** and the **saved return address** — reachable at **72 bytes** (Question 14). The stack **contains integer values such as return addresses, and these actively define the execution path**, so overwriting one is a control-flow hijack.

**The fix:**

```c
void handle_name(const char *input)
{
    char name[64];
    int  n;

    n = snprintf(name, sizeof(name), "%s", input);
    if (n < 0 || (size_t)n >= sizeof(name))
        return;                   /* truncated -- handle, don't ignore */

    printf("hello, %s\n", name);
}
```

`snprintf` always terminates within the given size and returns the length it *would* have written, which is how truncation is detected. Note that `strncpy(name, input, sizeof(name))` would be the **half-fix**: bounded, but it may leave the buffer **unterminated**, so the following `printf("%s")` would read past the end — a spatial violation in the read direction instead of the write direction.

**Now the defences, in the order they would engage:**

| Defence | Stops it? | Why |
|---|---|---|
| **NX / W⊕X / DEP** | **No** | It prevents executing **injected** shellcode on the stack. A **ROP** payload injects **no code** — it places **addresses** of code already in `.text` and libc, which is **already executable**. This is exactly why ROP was invented |
| **ASLR** | **Usually** | The chain needs **absolute** gadget, string and `system()` addresses. With libc randomised at 28 bits there are `2^28` candidates and each wrong guess crashes. **But one information leak collapses it to 1**, because randomisation applies **one base per library** and every gadget offset is fixed |
| **Stack canary** | **Yes, for this overflow** | `strcpy` writes **linearly** from `name` upward, so it **must cross the canary** to reach the return address. The check before `ret` fails and the program **aborts**. Fails against a **non-linear** arbitrary write, or if the canary **leaks** |
| **Intel Shadow Stack** | **Yes** | The genuine return address was pushed to the **protected** shadow stack at `CALL`. On `RET` the two copies **mismatch** → **control-flow protection exception**. It does not care *how* the value changed, and needs **no recompilation** |
| **ARM PAC** | **Yes** | The return address was **cryptographically signed** before storage; the attacker's value carries **no valid signature**, so the `AUT` check before `ret` faults. Requires **recompilation** |
| **Intel IBT** | **No** | IBT enforces that **indirect jumps and calls** land on `ENDBRANCH` — the **forward** edge. A hijacked `RET` is the **backward** edge and never consults it |

**The three lessons this layering teaches.**

**Two defences here rest on a secret, and two do not.** **ASLR** (the base offset) and the **canary** (the random value) both fail completely once the secret leaks — and information-leak vulnerabilities are common. **Shadow Stack** and **PAC** rest on **memory protection** and **a key the attacker cannot use**, so knowing everything about them does not help. That distinction is more predictive of real-world resilience than any strength ordering.

**The canary and the shadow stack look equivalent here and are not.** Both stop *this* attack, but the canary's guarantee is conditional on the overflow being **linear and contiguous**, whereas the shadow stack's is not (Question 20, rows 3 and 4). When two defences agree on the easy case, the informative question is which assumptions each is making.

**And note the sequencing.** ASLR acts before the exploit is even constructed; the canary and shadow stack act at the moment of return; NX would act at the moment of execution, which never comes. **Defence in depth here is not redundancy but coverage of different stages**, and IBT's presence in the list is a reminder that a complete control-flow defence needs **one mechanism per edge** — this bug needs a backward-edge mechanism, and IBT is simply the wrong tool.

---

### Question 23 — MPU/PMP misconfiguration

**Q:** An RTOS configures its MPU as follows. Identify every defect and give a corrected configuration.

```c
/* Cortex-M style MPU setup. Regions are checked with the
   HIGHEST-NUMBERED matching region winning. */

mpu_region(0, 0x00000000, SIZE_512M, RWX, PRIV_RW_UNPRIV_RW);  /* "everything, be safe" */
mpu_region(1, 0x08000000, SIZE_1M,   RX,  PRIV_RO_UNPRIV_RO);  /* flash: kernel + tasks */
mpu_region(2, 0x20000000, SIZE_64K,  RW,  PRIV_RW_UNPRIV_RW);  /* all SRAM: kernel + task stacks */
mpu_region(3, 0x40000000, SIZE_512M, RW,  PRIV_RW_UNPRIV_RW);  /* entire peripheral space */

/* Regions 4-7 left unconfigured. */
/* DMA controller programmed separately; no IOPMP configured. */
```

**Answer & Explanation:**

**Defect 1 — region 0 is a catch-all that grants everything to everyone.** A 512 MB **RWX** region readable and writable by **unprivileged** code covers the whole low address space including flash and SRAM. Even though higher-numbered regions override it where they match, region 0 remains in force **everywhere they do not** — so any address not explicitly covered by regions 1–3 is **fully accessible and executable from unprivileged code**. A default-permit background region inverts the security model: the MPU should **deny by default** and permit narrowly.

**Defect 2 — overlapping regions with a priority rule (CWE-1260).** Regions 0 and 1, and 0 and 2, overlap. Because the **highest-numbered matching region wins**, the effective permissions are not what any single line says — they depend on the **numbering**, which is invisible at the point of use and easy to break when someone inserts a region. This is exactly **CWE-1260: Improper Handling of Overlap Between Protected Memory Ranges**, and it is why the access-check algorithm's "choose the highest-priority matching region" step is a security-relevant detail rather than a formality.

**Defect 3 — W⊕X is violated in region 0.** `RWX` on a 512 MB region means memory that is **both writable and executable**, defeating **Write-XOR-Execute** entirely. The lecture's guarantee — configuring code regions read-only and execute-only to mitigate **code injection and self-modifying attacks** — is not being claimed here at all: an attacker who can write anywhere in the low 512 MB can then execute what they wrote.

**Defect 4 — no inter-task isolation.** Region 2 makes **all 64 KB of SRAM** readable and writable by **every unprivileged task**, so the kernel's data and **every task's stack** are mutually accessible. The MPU's second security guarantee — **inter-task isolation, containing faults and preventing lateral movement between sandboxed components** — is not delivered. Kernel/RTOS protection fails for the same reason.

**Defect 5 — the entire peripheral space is unprivileged-writable.** Region 3 gives unprivileged tasks write access to **all** memory-mapped control registers, so any task can reconfigure the clock, the watchdog, the DMA controller or the debug unit. **Peripheral register protection** is one of the four stated guarantees and it is switched off.

**Defect 6 — DMA is unpoliced.** Standard MPU/PMP **only polices accesses originating from the CPU core it is part of**, and does **not** protect against other bus masters such as **DMA controllers**, which access memory independently. With the DMA engine programmable from unprivileged code (defect 5), a task can simply **ask the DMA controller to read or write kernel memory on its behalf** — bypassing the MPU completely. Mitigation requires **IOMMU or IOPMP** hardware, which is absent. **MPU/PMP is CPU-facing, not system-bus-wide.**

**A corrected configuration:**

```c
/* Deny by default: no catch-all background region.
   Grant narrowly, and keep W and X disjoint. */

/* Kernel code: execute-only for privileged, read-execute for tasks that
   need shared library code; NEVER writable. */
mpu_region(0, 0x08000000, SIZE_256K, RX, PRIV_RO_UNPRIV_NONE);   /* kernel text  */
mpu_region(1, 0x08040000, SIZE_256K, RX, PRIV_RO_UNPRIV_RO);     /* task text    */

/* Kernel data: privileged access only. */
mpu_region(2, 0x20000000, SIZE_16K,  RW, PRIV_RW_UNPRIV_NONE);   /* kernel data  */

/* Exactly one task stack enabled at a time, reprogrammed on context switch. */
mpu_region(3, current_task->stack_base, current_task->stack_size,
                                     RW, PRIV_RW_UNPRIV_RW);     /* active stack */

/* Only the peripherals this task legitimately needs. */
mpu_region(4, 0x40010000, SIZE_4K,   RW, PRIV_RW_UNPRIV_RW);     /* one UART     */
mpu_region(5, 0x40000000, SIZE_64K,  RW, PRIV_RW_UNPRIV_NONE);   /* clocks, WDT: privileged only */

/* Regions 6-7 spare, for NAPOT decomposition of non-power-of-two ranges. */

/* And separately, in hardware: configure the IOPMP/IOMMU so the DMA
   controller cannot reach kernel memory regardless of who programs it. */
```

**Five principles behind the corrected version.** **Deny by default** — no background permit region, so anything not explicitly granted faults. **Keep W and X disjoint** — no region is ever both, which is W⊕X as an invariant rather than an aspiration. **Avoid overlap**, so effective permissions do not depend on region numbering (and where overlap is unavoidable, document the priority explicitly). **One task stack at a time**, reprogrammed on context switch — which restores inter-task isolation and is the standard answer to the **region-count ceiling** from Question 12, at the cost of some switch latency. And **police the bus, not just the core**: an IOPMP is not optional once a DMA-capable peripheral exists, because the MPU structurally cannot see those transactions.

**The meta-point.** Every defect above is a **configuration** error, and the MPU behaved exactly as specified throughout. That is limitation 2 from Question 4 — **the protection scheme depends entirely on the integrity of the privileged software that configures it** — and it is why an MPU's small register set is both its strength (deterministic, auditable) and its weakness (one bad setup function, or one write primitive in privileged code, and the whole policy is gone).

---

### Question 24 — A JIT that violates W⊕X

**Q:** Identify the vulnerability, explain what it re-enables, and give a corrected version.

```c
#include <sys/mman.h>
#include <string.h>
#include <stdlib.h>

typedef int (*jit_fn)(int);

/* Compile `src` into machine code and return a callable pointer. */
jit_fn jit_compile(const unsigned char *src, size_t len)
{
    void *page;

    page = mmap(NULL, 4096,
                PROT_READ | PROT_WRITE | PROT_EXEC,      /* <-- RWX */
                MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    if (page == MAP_FAILED)
        return NULL;

    memcpy(page, src, len);          /* emit code */

    return (jit_fn)page;             /* stays writable forever */
}
```

**Answer & Explanation:**

**The vulnerability.** The page is mapped **`PROT_READ | PROT_WRITE | PROT_EXEC`** and stays that way for its whole lifetime. That is a **direct violation of W⊕X**, whose entire content is that **memory pages are marked either writable or executable, but never both**.

**What it re-enables.** W⊕X exists to **stop classic stack-based buffer overflow attacks where an attacker writes malicious shellcode and executes it**. An RWX page reopens exactly that:

* Any memory-corruption bug that can write into this page — an out-of-bounds write elsewhere in the process, a use-after-free, a bad index in the JIT's own emit logic — becomes **direct code injection**. The attacker no longer needs ROP, gadget hunting, ASLR defeat or a chain; they write bytes and the process executes them.
* The page's address is **returned to the caller and stored in a function pointer**, so it is also a value that can leak, removing the address-discovery problem too.
* The region is **guaranteed executable**, so it is the single most valuable write target in the address space.

**The irony worth stating.** ROP was invented **because** W⊕X made code injection impossible, and the whole apparatus of gadgets, chains, ASLR bypasses, canaries and shadow stacks follows from that. An RWX page **undoes the premise**, making the older and far simpler attack available again. A process with one RWX page has, for that page, the threat model of 1996.

**The corrected version — never writable and executable at the same time:**

```c
jit_fn jit_compile(const unsigned char *src, size_t len)
{
    void *page;

    if (len > 4096)
        return NULL;

    /* 1. Writable, NOT executable, while we emit code. */
    page = mmap(NULL, 4096,
                PROT_READ | PROT_WRITE,
                MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    if (page == MAP_FAILED)
        return NULL;

    memcpy(page, src, len);

    /* 2. Flip to executable and drop write permission, atomically
          from the program's point of view. */
    if (mprotect(page, 4096, PROT_READ | PROT_EXEC) != 0) {
        munmap(page, 4096);
        return NULL;
    }

    return (jit_fn)page;
}
```

The invariant is that at **no instant** is the page both writable and executable: it is `RW` while being written, then `RX` while being executed, and the transition is one-way.

**Three refinements a strong answer mentions.**

**Never flip back.** If the JIT needs to patch code later, the tempting fix is `mprotect` to `RW`, patch, `mprotect` to `RX`. That reopens the window, and in a **multithreaded** process another thread may be executing the page while it is writable — so the invariant holds only per-page-per-instant, not per-thread. The robust pattern is **dual mapping**: map the same physical pages twice, once `RW` at a private address held only by the JIT and once `RX` at the address handed out, so the writable alias is never executable and the executable alias is never writable. Better still, **W⊕X plus a separate patch page**: emit a fresh page and atomically swap the function pointer.

**Bound the copy.** The original does `memcpy(page, src, len)` into a 4096-byte mapping with **no check on `len`** — an overflow of the JIT's own code page, which given the RWX mapping writes attacker bytes into executable memory. The fix above rejects `len > 4096`; a real implementation would size the mapping from `len`.

**Consider hardware CFI.** Even with W⊕X restored, JIT-generated code is a favourite target because it is **attacker-influenced by construction**. On platforms with **IBT** or **BTI**, generated code must emit **`ENDBRANCH`** / BTI landing pads at indirect-branch targets, or the JIT's own indirect calls will fault; and emitting them **only** at genuine entry points is what preserves the forward-edge protection rather than sprinkling valid targets everywhere. This is the sense in which a JIT has to participate in the defences rather than merely tolerate them.

---

### Question 25 — A platform configuration built on a misunderstanding

**Q:** A team configures a fleet of servers and records this justification. Identify every error and give the corrected configuration and claim.

```
Kernel command line and build configuration:
  - KPTI:            DISABLED  ("nopti" -- 20% syscall overhead was unacceptable)
  - Spectre v2 mit.: DISABLED  ("spectre_v2=off" -- KPTI already covers speculation)
  - Shadow Stack:    ENABLED
  - IBT:             DISABLED  ("shadow stack already gives us CFI")
  - ASLR:            ENABLED
  - ECC DRAM:        installed ("solves Rowhammer")
  - MPU/PMP:         n/a (server class, full MMU)

Design document claims:
  1. "KPTI only matters for multi-tenant hosts; ours run trusted workloads."
  2. "Disabling Spectre mitigations is safe because we disabled KPTI anyway --
      both are speculation defences, so neither is load-bearing."
  3. "Shadow Stack gives us full control-flow integrity."
  4. "ECC memory solves Rowhammer."
  5. "ASLR protects us from ROP."
```

**Answer & Explanation:**

**Error 1 — KPTI and Spectre mitigations defend against different attacks.** **KPTI** mitigates **Meltdown (CVE-2017-5754)** by **removing most kernel memory mappings from user-space page tables**. **Spectre v2 (CVE-2017-5715)** is **Branch Target Injection** via **BTB poisoning**, and it has nothing to do with kernel mappings — it makes **victim code speculatively execute a gadget at an attacker-chosen location**. Disabling both because "both are speculation defences" leaves the machine exposed to **two independent attacks**, and the reasoning does not even hold internally: turning off one defence is not an argument for turning off another.

**Error 2 — "trusted workloads" is not a threat model for Meltdown.** Meltdown is exploitable by **any unprivileged code that runs on the machine**, which includes anything the workload itself is induced to run: a JIT compiling attacker-supplied JavaScript, a deserialiser, a plugin, a compromised dependency. It reads **kernel memory**, which on a server means credentials, keys and other tenants' data resident in the page cache. "We trust our workloads" is a statement about intent, not about the absence of memory-safety bugs in them — and Chapter 7's ~70% figure is the reason that distinction matters.

**Error 3 — Shadow Stack does not give full control-flow integrity.** It protects the **backward edge** — `RET` — and mitigates **ROP**. It does **nothing** for the **forward edge**: **indirect `JMP` and `CALL`**, attacked by **JOP and COP**, which is what **IBT** addresses with **`ENDBRANCH`** landing pads. Enabling SS and disabling IBT leaves **half the control-flow surface unprotected**, and it is the half that Spectre v2 also targets. The lecture's comparison table exists precisely to separate these columns: **a complete defence needs one mechanism per edge.**

**Error 4 — ECC does not solve Rowhammer.** This was the **initial belief**, and it was disproved: researchers demonstrated Rowhammer causing **multi-bit flips within a single memory word**, which standard ECC **cannot correct and in some cases cannot even detect**. ECC is therefore an **unreliable** Rowhammer defence. Note the sharper point — an ECC implementation that **silently mis-corrects** a multi-bit error is worse than none, because it converts a detectable fault into corrupted data with no signal.

**Error 5 — ASLR does not protect against ROP; it raises its cost.** ASLR **randomises base addresses of stack, heap and loaded libraries**, so an attacker who does not know gadget or function addresses cannot build a working chain. But **ASLR can be bypassed using information leak vulnerabilities that disclose memory addresses**, and because randomisation applies **one base offset per library**, **a single leaked address collapses the search space to one candidate** (Question 14: `2^28` → 1). Treating ASLR as protection rather than as cost-raising is the error, and it is the same single-secret weakness as a stack canary.

**Error 6 — the 20% figure is not evaluated against anything.** Disabling a mitigation for performance can be a legitimate engineering decision, but only as an explicit risk trade with a stated threat model and compensating controls. Recorded here as a bare percentage with no assessment of what it buys, it is not a decision — and the cheaper options were not considered: **PCID/ASID** support substantially reduces KPTI's cost by avoiding full TLB flushes on switch, so the measured overhead may be an artefact of an unoptimised configuration rather than an inherent price.

**The corrected configuration:**

```
  - KPTI:            ENABLED   (with PCID/ASID support to reduce switch cost)
  - Spectre v2 mit.: ENABLED   (retpoline / IBRS + IBPB as the platform supports)
  - Shadow Stack:    ENABLED   (backward edge; works on legacy binaries)
  - IBT:             ENABLED   (forward edge; requires rebuilt binaries)
  - ASLR:            ENABLED   (and fix information-leak bugs, which are what defeat it)
  - ECC DRAM:        keep, for its actual purpose -- random single-bit errors
  - Rowhammer:       rely on TRR in the DRAM plus OS-level detection/throttling,
                     and treat it as an unsolved arms race, not a closed issue
  - If the syscall overhead is genuinely unacceptable, re-measure with PCID and
    then make an explicit, documented risk decision -- not a silent default.
```

**And the corrected claim:**

> **KPTI** mitigates **Meltdown** by removing kernel mappings from user page tables, at the cost of a page-table switch per syscall. **Spectre v1 and v2** are **separate** attacks exploiting **fundamental branch prediction behaviour**, requiring their own mitigations — **fences and retpolines** in software, **IBRS/IBPB** in hardware — and are **not** covered by KPTI. **Shadow Stack** covers the **backward edge** (ROP) and **IBT** the **forward edge** (JOP/COP); **both** are required for control-flow integrity, and Shadow Stack's distinctive advantage is that it needs **no recompilation**. **ASLR raises the cost** of ROP but is **defeated by any address leak**. **ECC does not solve Rowhammer**; **TRR** raises the bar and is itself bypassable by **tracker exhaustion (TRRespass)**, so Rowhammer remains **an unresolved arms race** requiring defence in depth.

**The general lesson, which is the chapter's closing warning.** Every error above generalises a **narrow** guarantee into a **broad** one: one edge → all control flow, one attack → all speculation, single-bit correction → a physics-level vulnerability, cost-raising → prevention. The slides put it as **"don't just select a product based on the features exposed by the software"** — security properties depend on **which specific mechanism covers which specific attack**, and a feature list does not encode that mapping. Naming the mechanism, its **edge**, its **assumption** and its **known bypass** is what turns a configuration into a security argument.

---

### Question 26 — A security decision vulnerable to fault injection

**Q:** This runs on a microcontroller in a physically accessible device. Identify why it is vulnerable even though the logic is correct, and give a hardened version.

```c
#include <stdbool.h>
#include <string.h>

bool verify_pin(const char *entered, const char *stored)
{
    return strcmp(entered, stored) == 0;
}

void unlock_device(const char *entered, const char *stored)
{
    bool admin = false;

    if (verify_pin(entered, stored))
        admin = true;

    if (admin) {
        grant_full_access();          /* <-- one bit decides everything */
    }
    /* access denied */
}
```

**Answer & Explanation:**

**Why it is vulnerable despite correct logic.** Nothing here is a memory-safety bug, an input-validation failure or a logic error. The vulnerability is that **the entire security decision rests on a single bit at a single instant**, on a device an attacker can physically manipulate. **Fault injection deliberately creates a transient error at a precise moment to bypass a critical security check** — and this is the lecture's own worked example:

```c
bool admin = false;   ->  bool admin = true;
if (admin) { ... }        if (admin) { ... }
/* access denied */       /* access granted */
```

**The available techniques:** **voltage and clock glitching**, briefly manipulating the power or clock signal to **induce a miscalculation**; and **Electromagnetic Fault Injection (EMFI)**, a **targeted electromagnetic pulse to flip a bit**. Any of them can corrupt the `admin` variable, the comparison's result register, the branch's condition flags, or the branch instruction itself.

**Why this is categorically different from every other bug in this chapter.** All the others operate on **inputs** — a malformed length, a poisoned predictor, a crafted stack. Fault injection operates on **the substrate**, so **the program's logic can be perfectly correct and still produce the wrong answer.** Input validation, bounds checking, memory safety and even formal verification of the source all remain intact and all fail to help, because the machine did not execute the program you verified. It is also why fault injection appears in Question 4's list of ways an **MPU/PMP can be bypassed**: the protection registers are just more silicon to glitch.

**Three specific weaknesses to name:**

* **A single point of decision.** One `if`, one bit. A single successful glitch anywhere in that dependency chain grants access.
* **`strcmp` is not constant-time.** It returns at the first differing byte, so **response timing leaks how many leading characters were correct**, letting an attacker recover the PIN byte-by-byte without any glitching at all.
* **No detection or response.** A glitch that fails leaves no trace and costs the attacker nothing, so they retry indefinitely.

**A hardened version:**

```c
#include <stdint.h>
#include <string.h>

/* Two-of-two redundant, non-complementary success sentinels.
   A single bit flip cannot produce both. */
#define OK_A   0xA5C36E1Du
#define OK_B   0x5A3C91E2u

static volatile uint32_t glitch_counter;      /* persisted across resets */

/* Constant-time comparison: always examines every byte. */
static uint32_t ct_equal(const uint8_t *a, const uint8_t *b, size_t n)
{
    uint8_t diff = 0;
    for (size_t i = 0; i < n; i++)
        diff |= (uint8_t)(a[i] ^ b[i]);
    return diff;                              /* 0 iff equal */
}

void unlock_device(const uint8_t *entered, const uint8_t *stored, size_t n)
{
    volatile uint32_t ok1 = 0, ok2 = 0;
    uint32_t d1, d2;

    /* 1. Compute the comparison TWICE, in constant time. */
    d1 = ct_equal(entered, stored, n);
    random_delay();                           /* desynchronise the glitch window */
    d2 = ct_equal(entered, stored, n);

    /* 2. Both computations must agree -- a single fault desynchronises them. */
    if (d1 != d2) {
        glitch_counter++;                     /* 5. detect and respond */
        secure_lockout();
        return;
    }

    if (d1 == 0) { ok1 = OK_A; ok2 = OK_B; }

    random_delay();

    /* 3. Redundant, non-complementary check: BOTH sentinels required,
          and the comparison is repeated. */
    if (ok1 == OK_A && ok2 == OK_B) {
        if (ok1 != OK_A || ok2 != OK_B) {     /* 4. double-check the branch itself */
            glitch_counter++;
            secure_lockout();
            return;
        }
        grant_full_access();
        return;
    }

    /* Default path is DENY, and it is the fall-through. */
    deny_access();
}
```

**The five hardening principles, each answering a specific glitch target:**

**Redundant computation with comparison.** Computing the check twice and requiring agreement means a **single** transient fault corrupts one result and is detected by the mismatch. This is the software analogue of **lock-step execution** — two computations and a comparator — which is exactly what lock-step does in hardware with a **primary and shadow core** compared **every clock cycle**. Where the hardware is available, that is the stronger version.

**Non-complementary multi-bit sentinels.** `true`/`false` differ in one bit, so one flip inverts the decision. `0xA5C36E1D` and `0x5A3C91E2` have large Hamming distance from each other and from `0`, so a single flip — or even several — cannot produce a valid success value. Requiring **two** independent sentinels means a successful attack needs **two** precisely-timed faults.

**Deny by default, as the fall-through.** The success path is the exception and requires positive evidence; the denial path is what execution reaches if anything goes wrong, including a glitched branch that skips the success block. Never structure it so that **skipping** a check yields access.

**Re-verify inside the taken branch.** Glitching the **branch instruction** itself bypasses the condition entirely, so the code re-checks after entering. It looks redundant to a reader and is precisely the point — it forces the attacker to glitch the same decision twice.

**Constant-time comparison, random delays, and a persistent counter.** `ct_equal` always inspects every byte, closing the **timing** side channel. Random delays desynchronise the attacker's trigger, making the glitch window hard to hit repeatedly. And counting suspected faults in **non-volatile** storage, with lockout, removes the attacker's free-retry assumption — turning an unlimited-attempt attack into a bounded one.

**The honest limit.** None of this makes fault injection impossible; an attacker with precise spatial and temporal control, and unlimited physical access, can in principle land multiple coordinated faults. It raises the required precision from **one** glitch to **several simultaneous, correctly-placed** ones, which is a large practical step. Where the threat model genuinely includes a well-equipped physical attacker, the answer is **hardware**: lock-step cores, on-die glitch and voltage detectors, and a secure element — because, as with everything else in this chapter, **software mitigations of a hardware-level attack raise cost rather than provide guarantees.**

---

## Answer Key Summary

**Author: Fable 5**

| # | Topic | Key answer |
|---|---|---|
| 10 | Segmentation | `0x00200000 + 0x1234` = **`0x00201234`**; 20-bit limit → **1 MiB** byte-granular, **4 GiB** page-granular; DPL 2 bits → **4** rings; widths **20 / 24 / 32** bits |
| 11 | i386 paging | `0x12345678` → dir **`0x48`**, table **`0x345`**, offset **`0x678`**; PDE at **`0x00030120`**, PTE at **`0x00040D14`**; PA = **`0x09ABC678`**; full map **1025** pages ≈ **4.004 MiB** = **0.098%** |
| 12 | MPU/PMP | 12 KiB → **2** NAPOT regions (8 KiB + 4 KiB); rounding up wastes **4 KiB**; 5 KiB buffer → **60%** over-permission; **7** of 8 regions fits, **9** does not |
| 13 | Rowhammer | 500k/s → **32,000** per 64 ms window (below 50,000); need **781,250/s**; halving refresh doubles it to **1,562,500/s**; 16 trackers vs 32 rows → **16** untracked |
| 14 | ROP / ASLR | `RET: IP ← [SP], SP += 8`; **72** bytes padding; chain **40** bytes; total **112**; 28-bit ASLR = **2²⁸**, one leak → **1** |
| 15 | FLUSH+RELOAD | probe array **1 MiB** (256 × 4096); **8** bits/attempt; hit **16.7 ns** vs miss **103.3 ns** = **6.2×** |
| 16 | Segmentation trace | **OK `0x00201234`**, OK, **FAULT type**, **FAULT limit**, **FAULT privilege**, **FAULT type** |
| 17 | Paging trace | **`0x09ABC678`**, **fault (R/W=0)**, **fault (P=0)**, **fault (U/S=0)**, then **`0x09ABC678`** from the **TLB** with no walk |
| 18 | Meltdown recovery | secret = **`0x41`** = **`'A'`**; two fast entries → **prefetcher**; none → **window closed** or **KPTI enabled** |
| 19 | ROP trace | `rdi` = **`0x601050`**, `rsi` = **`0`**, control reaches **`system()`** = `system("/bin/sh")` |
| 20 | Shadow stack trace | **1** both pass; **2** canary fails; **3 and 4** canary **passes**, shadow stack **catches**; **5** neither — needs **IBT** |

**The chapter's load-bearing claims:**

* **Time-slicing created the need for isolation, and software alone cannot provide it** — hence ISA support: **rings** for privilege, **segmentation** then **paging** for memory.
* **Segmentation carried real per-region metadata** (Base, **20-bit Limit**, Type, S, P, **2-bit DPL**) but failed on **external fragmentation**, and **Unreal Mode** shows a cached descriptor's authority surviving into a mode with no rules — a vulnerability that **became a feature**.
* **Virtual memory** makes it **architecturally impossible** for a process to name an unmapped physical address (separation) while the **MMU** additionally **checks permissions** on every access (permission) — two different kinds of enforcement, plus a **TLB** because walks are slow.
* **MPU/PMP** trades translation for **determinism and small silicon**, and its four limitations are **DMA/bus-master bypass**, **configuration integrity**, **limited granularity** (**8–16** regions, **CWE-1260** on overlap) and **physical attacks**.
* **The ROB guarantees architectural state only.** Mis-speculation discards registers and memory but **not cache, predictor and buffer state** — so **Meltdown** races the permission check on kernel memory **mapped but forbidden** (fixed by **KPTI**, at a page-table switch per syscall), and **Spectre** mistrains prediction so **victim code leaks its own secrets** (much harder, because there is no single design decision to withdraw).
* **Rowhammer violates the abstraction rather than working within it** — no access-control mechanism is consulted. **ECC is unreliable**, **more refresh is impractical**, and **TRR** is bypassable by **tracker exhaustion (TRRespass)**. **No silver bullet.**
* **Fault injection attacks the substrate**, so correct logic is not sufficient; **lock-step execution** detects transient faults by **comparing two synchronised cores every cycle**, and its purpose is **integrity, not performance**.
* **ROP defeats W⊕X by injecting no code**, using `RET: IP ← [SP]` to chain gadgets. Defences split by **edge**: **backward** (`RET`, ROP) → **Intel SS**, **ARM PAC**; **forward** (indirect `JMP`/`CALL`, JOP/COP) → **Intel IBT**, **ARM BTI**. **Only Shadow Stack needs no recompilation**, and **ASLR and canaries fail to a single leak**.
