---
subject: COMP60261
chapter: 8
title: "Chapter 8 Exam Questions - 5.5 Pro"
language: "en"
---

# Chapter 8 Exam Practice Set: Memory Protection

**AI author:** 5.5 Pro  
**Source material:** COMP60261 Chapter 8 / Hardware Memory Protection notes on protection rings, segmentation, virtual memory, MMUs, MPUs/PMPs, speculation, transient-execution attacks, Rowhammer, ROP, and hardware control-flow integrity.

Unless a question states otherwise, assume:

- 4 KB pages.
- i386-style two-level paging for 32-bit address calculations: 10-bit directory index, 10-bit page-table index, 12-bit offset.
- LP64 C layout: `char` is 1 byte, `short` is 2 bytes, `int` is 4 bytes, `long`, `uint64_t`, and pointers are 8 bytes.
- Ordinary C structure layout: each field is aligned to its own alignment, and the final structure size is rounded up to the largest field alignment.
- Page permissions use `P` for present, `RW` for writable, `US` for user-accessible, `X` for executable where needed, and `D` for dirty.
- Code snippets are complete and compilable. Some bug-identification questions include deliberately unsafe functions; the unsafe path is not necessarily executed in `main`.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1: Why operating systems required memory protection

**Q:** Explain why time-slicing multiple processes forced architects to add memory-protection support to the ISA.

**Answer & Explanation:**

Step 1: State the historical driver. Once an operating system time-slices multiple processes, several programs coexist in memory at the same time.

Step 2: Identify the risk. Without hardware protection, any process could generate an address that reads or overwrites another process or the kernel.

Step 3: Explain why software alone is insufficient. The access check must happen on every instruction fetch, load, and store. If malicious software can bypass or corrupt the checking code, software-only isolation fails.

Step 4: State the architectural requirement. The ISA needs privilege levels and hardware-enforced address checks so user code cannot directly access privileged memory.

Step 5: State the exam conclusion. Multiprogramming turns memory protection from a convenience into a correctness and security requirement.

---

### Question 2: Protection rings and their limitation

**Q:** Define x86 protection rings. Why do rings alone not solve process-to-process memory isolation?

**Answer & Explanation:**

Step 1: Define rings. Rings are privilege levels. Ring 0 is most privileged and normally runs the OS kernel. Ring 3 is least privileged and normally runs user applications. Rings 1 and 2 exist but are rarely used by mainstream OSes.

Step 2: State what rings enforce. Rings control which code may execute privileged instructions or access privileged CPU state.

Step 3: State the limitation. Rings do not by themselves say which memory range one Ring 3 process may access.

Step 4: Give the key example. Two user processes can both run in Ring 3, but they still must be isolated from each other.

Step 5: State the missing mechanism. Address translation or region-based protection is needed to partition memory.

Step 6: State the exam conclusion. Rings define privilege; segmentation, paging, MPUs, or PMPs define memory reachability.

---

### Question 3: Segment translation

**Q:** Explain segment translation using selectors, descriptor tables, descriptors, bases, limits, and offsets.

**Answer & Explanation:**

Step 1: State the address form. A segmented address is conceptually a pair:

`(segment selector, offset)`

Step 2: Explain the selector. The selector indexes a descriptor table, such as the GDT or LDT.

Step 3: Explain the descriptor. The descriptor stores metadata for the segment: base, limit, type/attributes, present bit, system bit, and descriptor privilege level.

Step 4: Explain translation. The CPU checks that the offset and access rights are valid, then computes:

`linear address = segment base + offset`

Step 5: Explain the security purpose. The descriptor lets the OS define which memory a segment covers and which privilege level can access it.

Step 6: State the exam conclusion. Segmentation adds metadata to address interpretation, but the program still provides an address-like integer that hardware interprets through descriptor state.

---

### Question 4: Real Mode, Protected Mode, and Unreal Mode

**Q:** Compare Real Mode, Protected Mode, and Unreal Mode. Why is Unreal Mode a security-boundary problem?

**Answer & Explanation:**

Step 1: Define Real Mode. Real Mode is the legacy flat, unprotected memory mode. The notes describe it as allowing any memory location in the 1 MB range to be used as data or code.

Step 2: Define Protected Mode. Protected Mode adds privilege and memory protection using rings and segmentation. Programs use selectors and offsets rather than direct unprotected addresses.

Step 3: Define Unreal Mode. Unreal Mode abuses compatibility behaviour: code enters Protected Mode, loads wide segment descriptors into hidden CPU descriptor caches, then returns to Real Mode while retaining cached descriptor reach.

Step 4: Explain why this is dangerous. The processor is back in a mode with little or no protection, but stale descriptor state can still allow access beyond the ordinary Real Mode range.

Step 5: State the security lesson. Security transitions must reset, validate, or contain hidden state. Stale privileged metadata across a mode change can collapse the intended boundary.

---

### Question 5: External fragmentation in segmentation

**Q:** Why did variable-sized segments cause external fragmentation, and how did paging address this problem?

**Answer & Explanation:**

Step 1: Define external fragmentation. Memory becomes split into many small free holes. Total free memory may be large, but no single contiguous block is large enough for a new allocation.

Step 2: Explain why segmentation causes it. Segments have variable sizes. Creating and destroying processes or regions leaves irregular gaps.

Step 3: Explain the allocation failure. A large new segment requires one contiguous physical range. It may fail even when the sum of free holes is sufficient.

Step 4: Explain paging. Paging splits memory into fixed-size pages and frames.

Step 5: State the benefit. A process's virtual pages can be backed by non-contiguous physical frames, so the OS no longer needs one large contiguous physical segment.

Step 6: State the exam conclusion. Paging removes external fragmentation by replacing variable-sized contiguous allocations with fixed-size mappings.

---

### Question 6: Virtual memory and the MMU

**Q:** Define virtual memory and the Memory Management Unit. What are the MMU's two primary functions?

**Answer & Explanation:**

Step 1: Define virtual memory. Virtual memory gives each process a private, linear virtual address space independent of the actual physical memory layout.

Step 2: Define the MMU. The Memory Management Unit is CPU-integrated hardware that implements address translation and access checks.

Step 3: Function 1: translation. The MMU translates virtual addresses into physical addresses using OS-managed page tables.

Step 4: Function 2: permission enforcement. The MMU checks page permissions and the current privilege level on memory accesses.

Step 5: Explain faults. If a translation is missing or permission is denied, the MMU raises a page fault to the kernel.

Step 6: State the exam conclusion. The OS defines the mappings; the MMU enforces them on every memory access.

---

### Question 7: VPN, PFN, and offset

**Q:** Explain why page translation changes the page number but preserves the offset.

**Answer & Explanation:**

Step 1: Split the virtual address. A virtual address is divided into a virtual page number, or VPN, and a page offset.

Step 2: Translate the page number. The page table maps the VPN to a physical frame number, or PFN.

Step 3: Preserve the offset. The offset identifies the byte position within a page. Since virtual pages and physical frames have the same size, the offset is copied unchanged.

Step 4: State the transformation.

`(VPN, offset) -> (PFN, offset)`

Step 5: State the exam conclusion. Paging relocates whole pages; it does not change a byte's position within its page.

---

### Question 8: i386 two-level paging and CR3

**Q:** Describe i386 two-level paging. What does `CR3` contain, and how is a 32-bit linear address split?

**Answer & Explanation:**

Step 1: State the structure. i386 uses a page directory and page tables.

Step 2: Define `CR3`. For the active process, `CR3` contains the physical address of that process's page directory.

Step 3: Split the linear address. A 32-bit linear address is split as:

- 10-bit directory index
- 10-bit page-table index
- 12-bit offset

Step 4: Explain translation. `CR3` locates the page directory. The directory index selects a page-directory entry. That entry points to a page table. The table index selects a page-table entry. The PTE gives the page frame base. The offset is appended unchanged.

Step 5: State the scale. The 20 page-selection bits identify `2^20` virtual pages, each 4 KB, giving a 4 GB address space.

---

### Question 9: Page-table protection bits

**Q:** Explain the security role of `P`, `R/W`, `U/S`, `D`, and `AVAIL` bits in page-table entries.

**Answer & Explanation:**

Step 1: `P`, present. If set, the page is present in RAM. If clear, the access faults or triggers OS handling such as demand paging.

Step 2: `R/W`, read/write. This controls whether writes are permitted. It supports read-only code/data and mechanisms such as copy-on-write.

Step 3: `U/S`, user/supervisor. This controls whether user-mode code may access the page or whether it is supervisor-only.

Step 4: `D`, dirty. This records whether the page has been written. It helps the OS decide whether a page must be written back to storage before eviction.

Step 5: `AVAIL`. These bits are available for OS-defined use.

Step 6: State the exam conclusion. Page-table entries combine translation metadata with protection state, and the MMU enforces the relevant bits on every access.

---

### Question 10: Why the TLB is required

**Q:** Why is the Translation Lookaside Buffer essential for virtual memory performance?

**Answer & Explanation:**

Step 1: State the problem. A page-table walk requires memory accesses to page-table structures before the requested data can be accessed.

Step 2: Explain repeated translations. Programs often access the same pages repeatedly due to locality.

Step 3: Define TLB. The TLB is a high-speed MMU cache of recent virtual-to-physical translations.

Step 4: Explain the benefit. On a TLB hit, the MMU avoids the full page-table walk.

Step 5: State the exam conclusion. Page-table translation without a TLB would add unacceptable latency to ordinary memory access.

---

### Question 11: MPU/PMP versus MMU

**Q:** Compare an MPU/PMP with an MMU. Why might embedded or real-time systems prefer an MPU/PMP?

**Answer & Explanation:**

Step 1: Define MPU/PMP. An MPU or PMP provides region-based access control over physical addresses.

Step 2: State the key difference. An MPU/PMP does not translate addresses. It checks whether a CPU-initiated physical address access is allowed.

Step 3: Define MMU. An MMU provides both virtual-to-physical translation and permission enforcement.

Step 4: Explain real-time motivation. MMUs introduce TLB misses, page-table walks, and page-fault complexity, creating variable latency.

Step 5: Explain resource motivation. MPUs/PMPs require less hardware area, less power, and simpler software configuration.

Step 6: State the exam conclusion. MMUs are suited to rich OS virtual memory; MPUs/PMPs are suited to simpler, deterministic systems with mostly static memory maps.

---

### Question 12: MPU/PMP limitations

**Q:** State four limitations or vulnerability classes for MPU/PMP-based protection.

**Answer & Explanation:**

Step 1: Non-CPU bus masters. A standard MPU/PMP checks CPU-originated accesses, not necessarily DMA or other system-bus masters. IOMMU or IOPMP-like mechanisms may be needed.

Step 2: Misconfiguration. Incorrect region permissions or overlapping ranges can accidentally grant access.

Step 3: Limited granularity. A small finite number of regions and alignment constraints make fine-grained protection difficult.

Step 4: Privileged compromise. If an attacker can modify MPU/PMP configuration registers, they can change the protection policy.

Step 5: Physical attacks. Sophisticated physical attacks may bypass CPU-enforced policy entirely.

Step 6: State the exam conclusion. MPU/PMP is useful but is not equivalent to full system-wide memory isolation.

---

### Question 13: Pipeline hazards

**Q:** Define data hazards, branch/control hazards, and structural hazards. Give the typical remedy for each.

**Answer & Explanation:**

Step 1: Data hazard. A later instruction needs a value that an earlier instruction has not produced yet. Remedies include stalls, forwarding, and register renaming for false dependencies.

Step 2: Branch/control hazard. The CPU does not yet know which path to fetch after a branch. Remedies include branch prediction and speculative execution.

Step 3: Structural hazard. Two instructions need the same hardware resource at the same time. Remedies include stalling, duplicating resources, or pipelining the resource.

Step 4: State the broader link. Superscalar and out-of-order designs were introduced to keep execution units busy despite these hazards.

Step 5: State the security relevance. The performance techniques used to avoid stalls created microarchitectural state and speculation effects that later became attack surfaces.

---

### Question 14: Out-of-order execution and the ROB

**Q:** Explain register renaming, reservation stations, and the Re-Order Buffer in out-of-order execution.

**Answer & Explanation:**

Step 1: Register renaming maps architectural registers to a larger pool of physical registers, removing false WAR and WAW dependencies.

Step 2: Reservation stations or issue queues hold decoded instructions until operands and execution units are ready.

Step 3: Execution may occur out of original program order when inputs are ready.

Step 4: The Re-Order Buffer tracks in-flight instructions and commits their results to architectural state in original program order.

Step 5: Explain why this matters. The ROB preserves precise exceptions and the illusion of sequential execution, even though the microarchitecture worked out of order.

Step 6: State the exam conclusion. Out-of-order execution is an implementation strategy; the architectural state still appears to follow program order.

---

### Question 15: Architectural versus microarchitectural state

**Q:** Distinguish architectural and microarchitectural state. Why is this distinction central to transient-execution attacks?

**Answer & Explanation:**

Step 1: Define architectural state. Architectural state is program-visible state defined by the ISA, such as committed registers, memory, flags, and control flow.

Step 2: Define microarchitectural state. Microarchitectural state is implementation-internal state such as caches, TLBs, branch predictors, buffers, and queues.

Step 3: Explain speculation recovery. When speculation is wrong, the CPU discards wrong-path architectural results.

Step 4: Identify the gap. The CPU may not undo microarchitectural side effects, especially cache changes.

Step 5: Explain the attack. An attacker causes a transient access, then times later accesses to infer what cache state changed.

Step 6: State the exam conclusion. Transient-execution attacks exploit traces left in microarchitectural state by instructions that never architecturally committed.

---

### Question 16: Meltdown and KPTI

**Q:** Explain Meltdown's three-step process and why Kernel Page Table Isolation mitigates it.

**Answer & Explanation:**

Step 1: Trigger. User-mode code attempts to read a kernel address mapped in its page table but protected by privilege bits.

Step 2: Race/transmission. Before the fault fully takes effect, out-of-order execution transiently uses the secret byte as an index into a probe array, loading a secret-dependent cache line.

Step 3: Persistence/recovery. The architectural results are squashed and the fault is raised, but the cache footprint remains. Timing the probe array reveals the secret.

Step 4: Explain KPTI. KPTI removes most kernel mappings from user-space page tables.

Step 5: Explain why it works. If the kernel address is not mapped in the user context, the transient read cannot translate in the same useful way.

Step 6: State the cost. System calls and interrupts require page-table switches, increasing overhead and TLB pressure.

---

### Question 17: Spectre variants 1 and 2

**Q:** Compare Spectre Variant 1 and Spectre Variant 2. Why is Spectre harder to mitigate than Meltdown?

**Answer & Explanation:**

Step 1: Variant 1 is bounds-check bypass. The branch predictor is trained to expect a bounds check to pass, so an out-of-bounds access executes transiently and leaks through a cache side channel.

Step 2: Variant 2 is branch target injection. The attacker poisons indirect branch prediction so the victim transiently executes an attacker-chosen gadget already present in victim code.

Step 3: Contrast with Meltdown. Meltdown exploited kernel memory mapped into user page tables, so KPTI could remove most of the target mappings.

Step 4: Explain Spectre's difficulty. Spectre abuses ordinary victim code and valid in-process permissions. The victim is allowed to read its secrets; the problem is the transient path and side channel.

Step 5: State mitigations. Software mitigations include fences and retpolines. Hardware mitigations include IBRS and IBPB-style controls.

Step 6: State the exam conclusion. Spectre attacks branch prediction itself, so mitigation is broader, more performance-sensitive, and less clean than unmapping kernel memory.

---

### Question 18: Rowhammer and TRR

**Q:** Explain Rowhammer, the four attack stages, Target Row Refresh, and why TRRespass showed TRR was not a complete solution.

**Answer & Explanation:**

Step 1: Define Rowhammer. Rowhammer is a DRAM vulnerability where repeatedly activating aggressor rows causes electrical disturbance and bit flips in adjacent victim rows.

Step 2: Stage 1: memory templating. The attacker profiles memory to locate vulnerable cells and useful physical row relationships.

Step 3: Stage 2: cache eviction. The attacker ensures accesses reach DRAM rather than being absorbed by caches.

Step 4: Stage 3: hammering. The attacker repeatedly accesses aggressor rows.

Step 5: Stage 4: disturbance error. A victim-row bit flips, potentially corrupting security-critical data such as page tables.

Step 6: Explain TRR. Target Row Refresh monitors hot rows and refreshes adjacent victim rows when hammering is suspected.

Step 7: Explain TRRespass. TRR has limited proprietary tracking resources. Many-sided hammering can overwhelm trackers so real aggressor rows are missed.

Step 8: State the exam conclusion. Rowhammer is a physical leaky-abstraction problem and remains an arms race rather than a solved software bug.

---

### Question 19: ROP and W^X

**Q:** Why does Return-Oriented Programming bypass W^X/DEP/NX?

**Answer & Explanation:**

Step 1: Define W^X. W^X means memory should be writable or executable, but not both.

Step 2: State what W^X stops. It stops classic injected shellcode on writable data pages such as the stack.

Step 3: Define ROP. Return-Oriented Programming chains existing executable instruction snippets called gadgets, each usually ending in `ret`.

Step 4: Explain the bypass. The attacker writes only gadget addresses and data onto the stack. The executed instructions already exist in executable pages.

Step 5: State the key mechanism. Each `ret` pops the next attacker-chosen address from the stack, transferring control to the next gadget.

Step 6: State the exam conclusion. W^X prevents executing injected data; ROP reuses existing code, so control-flow integrity mechanisms are needed.

---

### Question 20: ASLR, stack canaries, shadow stacks, IBT, PAC, and BTI

**Q:** Compare ASLR, stack canaries, Intel Shadow Stack, Intel IBT, ARM PAC, and ARM BTI by what they defend.

**Answer & Explanation:**

Step 1: ASLR randomises base addresses of stack, heap, and libraries so attackers do not know gadget addresses. It can be bypassed by information leaks.

Step 2: Stack canaries place a random tripwire before saved control data. They detect linear stack overflows before return.

Step 3: Intel Shadow Stack protects backward-edge control flow by keeping a protected duplicate of return addresses.

Step 4: Intel IBT protects forward-edge control flow by requiring indirect branches to land on `ENDBRANCH`-style legal targets.

Step 5: ARM PAC protects pointer integrity, commonly return addresses, by signing and authenticating pointers.

Step 6: ARM BTI protects forward-edge control flow by requiring indirect branches to land on BTI landing pads.

Step 7: State the exam conclusion. Backward-edge defences target returns and ROP; forward-edge defences target indirect calls/jumps and JOP/COP.

---

## Part 2: Memory & Storage Size Calculations

### Question 21: Segment translation with bounds

**Q:** A segment descriptor has base `0x200000` and limit `0x3000`. Assume valid offsets satisfy `0 <= offset < limit`. Compute the linear address for offset `0x1234`, and state whether offset `0x3000` is valid.

**Answer & Explanation:**

Step 1: Compute the valid access.

`linear address = base + offset`

`0x200000 + 0x1234 = 0x201234`

Step 2: Check offset `0x1234`.

`0x1234 < 0x3000`, so it is valid.

Step 3: Check offset `0x3000`.

The valid range is `[0, 0x3000)`, so `0x3000` is just outside the segment.

Step 4: State the result. Offset `0x1234` translates to **0x201234**. Offset `0x3000` is **invalid** under the stated convention.

---

### Question 22: External fragmentation

**Q:** A segmented memory allocator has free holes of 12 KiB, 20 KiB, 8 KiB, 28 KiB, and 16 KiB. A new process needs one contiguous 40 KiB segment. Is there enough total free memory? Can the allocation succeed without compaction?

**Answer & Explanation:**

Step 1: Add total free memory.

`12 + 20 + 8 + 28 + 16 = 84 KiB`

Step 2: Find the largest contiguous hole.

Largest hole = `28 KiB`

Step 3: Compare with request.

The request is `40 KiB`, which is larger than the largest hole.

Step 4: State the result. There is enough total free memory, **84 KiB**, but allocation cannot succeed without compaction because no single hole is at least **40 KiB**.

Step 5: State the lesson. This is external fragmentation.

---

### Question 23: i386 address decomposition

**Q:** Decompose the 32-bit i386 linear address `0xCAFEBABE` into directory index, page-table index, and offset. Give each field in hexadecimal and decimal.

**Answer & Explanation:**

Step 1: Use the i386 layout:

- directory index = bits 31..22
- table index = bits 21..12
- offset = bits 11..0

Step 2: Compute the fields.

`directory = 0xCAFEBABE >> 22 = 0x32b = 811`

`table = (0xCAFEBABE >> 12) & 0x3ff = 0x3eb = 1003`

`offset = 0xCAFEBABE & 0xfff = 0xabe = 2750`

Step 3: State the result. Directory index is **0x32b / 811**, table index is **0x3eb / 1003**, and offset is **0xabe / 2750**.

---

### Question 24: Number of i386 virtual pages

**Q:** In i386 two-level paging, how many 4 KB virtual pages exist in the 32-bit address space? Show the calculation.

**Answer & Explanation:**

Step 1: Count page-selection bits.

Directory bits = 10. Table bits = 10.

`10 + 10 = 20 page-selection bits`

Step 2: Compute pages.

`2^20 = 1,048,576 pages`

Step 3: Confirm address-space size.

`1,048,576 * 4,096 = 4,294,967,296 bytes = 4 GiB`

Step 4: State the result. i386 has **1,048,576 virtual pages** in a 32-bit address space using 4 KB pages.

---

### Question 25: Page-table metadata for mapping 64 MiB

**Q:** In i386 two-level paging, each page table has 1,024 entries and maps 1,024 pages. How many page-table pages plus page-directory pages are needed to map a contiguous 64 MiB region using 4 KB pages? Assume one page directory is needed.

**Answer & Explanation:**

Step 1: Convert mapped memory to pages.

`64 MiB = 64 * 1024 * 1024 = 67,108,864 bytes`

`67,108,864 / 4,096 = 16,384 pages`

Step 2: Compute page-table pages.

Each page table maps 1,024 pages.

`16,384 / 1,024 = 16 page tables`

Step 3: Add page directory.

One page directory is needed.

`16 + 1 = 17 metadata pages`

Step 4: Convert to bytes.

`17 * 4,096 = 69,632 bytes`

Step 5: State the result. The mapping needs **17 metadata pages**, or **69,632 bytes**, ignoring other OS metadata.

---

### Question 26: Effective access time with TLB misses

**Q:** A memory access takes 100 cycles. A TLB lookup takes 1 cycle. On a TLB miss, an i386 two-level page walk requires 2 extra memory accesses before the final data access. If the TLB hit rate is 98%, compute the effective average access time.

**Answer & Explanation:**

Step 1: Compute hit cost.

`hit cost = TLB lookup + data memory access = 1 + 100 = 101 cycles`

Step 2: Compute miss cost.

On a miss, the CPU performs 2 page-table memory accesses plus the final data access:

`miss cost = 1 + 2 * 100 + 100 = 301 cycles`

Step 3: Apply hit rate.

`average = 0.98 * 101 + 0.02 * 301`

`average = 98.98 + 6.02 = 105 cycles`

Step 4: State the result. The effective average access time is **105 cycles**.

---

### Question 27: KPTI syscall overhead

**Q:** KPTI adds one extra page-table switch cost of 700 cycles per system call in a simplified model. A workload performs 1,000,000 system calls on a 3 GHz CPU. How much extra time is spent?

**Answer & Explanation:**

Step 1: Compute extra cycles.

`1,000,000 * 700 = 700,000,000 cycles`

Step 2: Convert CPU frequency.

`3 GHz = 3,000,000,000 cycles/second`

Step 3: Compute time.

`700,000,000 / 3,000,000,000 = 0.233333... seconds`

Step 4: State the result. The simplified KPTI overhead is about **0.233 seconds**, or **233 ms**.

Step 5: State the caveat. Real systems depend on PCID, TLB behaviour, syscall mix, and microarchitecture.

---

### Question 28: Meltdown probe-array size

**Q:** A Meltdown-style cache side channel uses one 4 KB page per possible byte value. How large must the probe array be for 256 possible byte values? If secret byte `0x5a` is used as the index, what byte offset in the probe array is touched?

**Answer & Explanation:**

Step 1: Compute probe-array size.

`256 * 4 KB = 256 * 4,096 = 1,048,576 bytes = 1 MiB`

Step 2: Convert secret byte.

`0x5a = 90 decimal`

Step 3: Compute touched offset.

`90 * 4,096 = 368,640 bytes`

In hexadecimal:

`0x5a * 0x1000 = 0x5a000`

Step 4: State the result. The probe array is **1 MiB**, and secret `0x5a` touches offset **0x5a000**.

---

### Question 29: MPU/PMP region matching

**Q:** An MPU has two enabled regions. Region 0 covers `[0x1000, 0x3000)` and allows read/write. Region 1 has higher priority, covers `[0x1800, 0x2000)`, and allows read only. Is a write to `0x1900` allowed? Is a write to `0x2500` allowed?

**Answer & Explanation:**

Step 1: Check `0x1900`. It lies inside both Region 0 and Region 1.

Step 2: Apply priority. Region 1 has higher priority and is read-only.

Step 3: Result for `0x1900`. A write is denied.

Step 4: Check `0x2500`. It lies inside Region 0 but outside Region 1.

Step 5: Apply permissions. Region 0 allows read/write.

Step 6: Result for `0x2500`. A write is allowed.

Step 7: State the exam conclusion. Overlapping regions must be resolved using the architecture's priority rules; otherwise a low-priority permissive region can accidentally override a high-priority restrictive region.

---

### Question 30: Shadow stack memory usage

**Q:** A program has 12,000 active call frames at peak. Each return address is 8 bytes. If Intel Shadow Stack stores one protected duplicate return address per call frame, how much shadow-stack memory is needed for return addresses at peak?

**Answer & Explanation:**

Step 1: Identify entries.

`12,000 call frames -> 12,000 shadow return addresses`

Step 2: Compute memory.

`12,000 * 8 = 96,000 bytes`

Step 3: Convert to KiB.

`96,000 / 1,024 = 93.75 KiB`

Step 4: State the result. The shadow stack needs **96,000 bytes**, or about **93.75 KiB**, for return addresses at that peak depth.

---

### Question 31: Rowhammer activation rate

**Q:** A Rowhammer experiment performs 500,000 row activations during a 64 ms DRAM refresh interval. What is the activation rate per second?

**Answer & Explanation:**

Step 1: Convert time.

`64 ms = 0.064 seconds`

Step 2: Compute rate.

`500,000 / 0.064 = 7,812,500 activations/second`

Step 3: State the result. The activation rate is **7,812,500 activations per second**.

Step 4: State the security relevance. High activation rates are needed to stress aggressor rows enough to disturb nearby victim rows before refresh restores charge.

---

### Question 32: Struct layout for a page-table entry model

**Q:** Under the LP64 assumptions, compute the offsets and total size of `struct PteAudit`. Then compute the address of `entries[5].fault_count` if `entries` starts at `0x900000`.

```c
#include <stdint.h>
#include <stdio.h>

struct PteAudit {
    uint64_t frame;
    uint8_t present;
    uint8_t rw;
    uint8_t user;
    uint32_t fault_count;
    char label[10];
};

int main(void) {
    struct PteAudit entries[16];
    (void)entries;
    printf("PTE audit layout example.\n");
    return 0;
}
```

**Answer & Explanation:**

Step 1: Place `frame`. `uint64_t` has offset 0 and size 8.

Step 2: Place `present`, `rw`, and `user`. They are 1 byte each at offsets 8, 9, and 10.

Step 3: Align `fault_count`. It is a `uint32_t`, requiring 4-byte alignment. After offset 11, one byte of padding is inserted, so `fault_count` starts at offset 12.

Step 4: Place `label`. `char[10]` starts at offset 16 and occupies offsets 16 through 25.

Step 5: Add tail padding. The structure ends at offset 26. The largest alignment is 8, so size rounds up to 32.

Step 6: Compute `entries[5]`.

`5 * 32 = 160 decimal = 0xa0`

`entries[5] base = 0x900000 + 0xa0 = 0x9000a0`

Step 7: Add `fault_count` offset.

`0x9000a0 + 0x0c = 0x9000ac`

Step 8: State the result. `sizeof(struct PteAudit) = 32`, and `entries[5].fault_count` is at **0x9000ac**.

---

## Part 3: Code Tracing & Output Prediction

### Question 33: Segment translation code

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

struct Segment {
    unsigned int base;
    unsigned int limit;
};

static int translate(struct Segment s, unsigned int offset, unsigned int *out) {
    if (offset >= s.limit) {
        return 0;
    }
    *out = s.base + offset;
    return 1;
}

int main(void) {
    struct Segment code = {0x200000, 0x3000};
    unsigned int addr = 0;

    printf("a=%d\n", translate(code, 0x1234, &addr));
    printf("addr=0x%x\n", addr);
    printf("b=%d\n", translate(code, 0x3000, &addr));
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
a=1
addr=0x201234
b=0
```

Step 1: Offset `0x1234` is less than limit `0x3000`, so translation succeeds.

Step 2: Address is `0x200000 + 0x1234 = 0x201234`.

Step 3: Offset `0x3000` is equal to the limit, so it is outside `[0, limit)`, and translation fails.

---

### Question 34: i386 address split code

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>
#include <stdint.h>

int main(void) {
    uint32_t linear = 0xCAFEBABEu;
    uint32_t dir = linear >> 22;
    uint32_t table = (linear >> 12) & 0x3ffu;
    uint32_t offset = linear & 0xfffu;

    printf("dir=%u 0x%x\n", dir, dir);
    printf("table=%u 0x%x\n", table, table);
    printf("offset=%u 0x%x\n", offset, offset);
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
dir=811 0x32b
table=1003 0x3eb
offset=2750 0xabe
```

Step 1: The top 10 bits are `0x32b`, decimal 811.

Step 2: The next 10 bits are `0x3eb`, decimal 1003.

Step 3: The low 12 bits are `0xabe`, decimal 2750.

Step 4: This is the exact i386 directory/table/offset split.

---

### Question 35: Page permission check output

**Q:** Predict the exact output of the following complete C program. Then explain the `U/S` security role.

```c
#include <stdio.h>

struct Pte {
    int present;
    int rw;
    int user;
};

static int allowed(struct Pte p, char access, int user_mode) {
    if (!p.present) {
        return 0;
    }
    if (user_mode && !p.user) {
        return 0;
    }
    if (access == 'w' && !p.rw) {
        return 0;
    }
    return 1;
}

int main(void) {
    struct Pte kernel_ro = {1, 0, 0};
    struct Pte user_rw = {1, 1, 1};

    printf("user read kernel=%d\n", allowed(kernel_ro, 'r', 1));
    printf("kernel read kernel=%d\n", allowed(kernel_ro, 'r', 0));
    printf("user write user=%d\n", allowed(user_rw, 'w', 1));
    printf("user write kernel_ro=%d\n", allowed(kernel_ro, 'w', 1));
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
user read kernel=0
kernel read kernel=1
user write user=1
user write kernel_ro=0
```

Step 1: User mode cannot read `kernel_ro` because `user=0`.

Step 2: Kernel mode can read `kernel_ro` because supervisor access is allowed and it is present.

Step 3: User mode can write `user_rw` because it is present, user-accessible, and writable.

Step 4: User mode cannot write `kernel_ro` because it fails the `U/S` check and also lacks write permission.

Step 5: The `U/S` bit enforces the user/kernel page boundary.

---

### Question 36: MPU region priority trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

struct Region {
    unsigned int start;
    unsigned int end;
    int write;
};

static int write_allowed(unsigned int addr) {
    struct Region low = {0x1000, 0x3000, 1};
    struct Region high = {0x1800, 0x2000, 0};

    if (addr >= high.start && addr < high.end) {
        return high.write;
    }
    if (addr >= low.start && addr < low.end) {
        return low.write;
    }
    return 0;
}

int main(void) {
    printf("0x1900 write=%d\n", write_allowed(0x1900));
    printf("0x2500 write=%d\n", write_allowed(0x2500));
    printf("0x4000 write=%d\n", write_allowed(0x4000));
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
0x1900 write=0
0x2500 write=1
0x4000 write=0
```

Step 1: `0x1900` matches both regions, but the high-priority region is checked first and denies writes.

Step 2: `0x2500` matches only the low-priority region, which allows writes.

Step 3: `0x4000` matches no region, and this model denies by default.

Step 4: This models the importance of priority when MPU/PMP regions overlap.

---

### Question 37: TLB hit/miss accounting

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

int main(void) {
    int accesses = 1000;
    int hits = 970;
    int misses = accesses - hits;
    int hit_cost = 101;
    int miss_cost = 301;
    int total_cycles = hits * hit_cost + misses * miss_cost;

    printf("misses=%d\n", misses);
    printf("total_cycles=%d\n", total_cycles);
    printf("average_cycles=%d\n", total_cycles / accesses);
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
misses=30
total_cycles=107000
average_cycles=107
```

Step 1: Misses = `1000 - 970 = 30`.

Step 2: Total cycles = `970 * 101 + 30 * 301`.

Step 3: `970 * 101 = 97,970`; `30 * 301 = 9,030`.

Step 4: Total = `107,000`.

Step 5: Integer average = `107,000 / 1,000 = 107`.

---

### Question 38: Pipeline hazard classifier

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

enum Hazard {
    DATA,
    BRANCH,
    STRUCTURAL
};

static const char *name(enum Hazard h) {
    switch (h) {
        case DATA: return "data hazard";
        case BRANCH: return "branch hazard";
        case STRUCTURAL: return "structural hazard";
    }
    return "unknown";
}

int main(void) {
    enum Hazard seq[] = {DATA, BRANCH, STRUCTURAL, DATA};

    for (int i = 0; i < 4; i++) {
        printf("%d: %s\n", i, name(seq[i]));
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
0: data hazard
1: branch hazard
2: structural hazard
3: data hazard
```

Step 1: The array stores the hazards in the order `DATA`, `BRANCH`, `STRUCTURAL`, `DATA`.

Step 2: The `name` function maps each enum value to its label.

Step 3: The loop prints the index and label for all four entries.

---

### Question 39: Meltdown-style cache probe trace

**Q:** Predict the exact output of the following complete C program. This is a safe timing-model simulation, not an exploit.

```c
#include <stdio.h>

int main(void) {
    int cached[256] = {0};
    unsigned char secret = 0x5a;

    cached[secret] = 1;

    for (int i = 0; i < 256; i++) {
        if (cached[i]) {
            printf("fast index=%d hex=0x%x\n", i, i);
            break;
        }
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
fast index=90 hex=0x5a
```

Step 1: `secret` is `0x5a`, which is decimal 90.

Step 2: The program sets `cached[90] = 1`.

Step 3: The loop finds the first nonzero cache marker at index 90.

Step 4: This models the side-channel idea: a secret-dependent access selects one probe entry, and later timing identifies which entry was touched.

---

### Question 40: Spectre branch predictor toy trace

**Q:** Predict the exact output of the following complete C program. Explain how it models Spectre Variant 1 at a high level.

```c
#include <stdio.h>

int main(void) {
    int predictor_expects_taken = 0;
    int training_taken = 5;

    for (int i = 0; i < training_taken; i++) {
        predictor_expects_taken++;
    }

    printf("predictor score=%d\n", predictor_expects_taken);

    int malicious_index_in_bounds = 0;
    if (predictor_expects_taken > 3 && !malicious_index_in_bounds) {
        printf("would speculatively enter guarded block\n");
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
predictor score=5
would speculatively enter guarded block
```

Step 1: The loop increments `predictor_expects_taken` five times.

Step 2: The score is 5, so the first `if` condition component is true.

Step 3: `malicious_index_in_bounds` is 0, so `!malicious_index_in_bounds` is true.

Step 4: The message is printed.

Step 5: This models Spectre Variant 1 conceptually: repeated valid training can make the CPU expect a bounds check to pass, so it may transiently execute the guarded block for a later invalid index.

---

### Question 41: Rowhammer TRR tracker model

**Q:** Predict the exact output of the following complete C program. Then explain the TRR limitation it models.

```c
#include <stdio.h>

int main(void) {
    int tracker_capacity = 4;
    int aggressor_rows = 6;
    int tracked = aggressor_rows < tracker_capacity ? aggressor_rows : tracker_capacity;
    int untracked = aggressor_rows - tracked;

    printf("tracked=%d\n", tracked);
    printf("untracked=%d\n", untracked);

    if (untracked > 0) {
        printf("tracker pressure may hide aggressors\n");
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
tracked=4
untracked=2
tracker pressure may hide aggressors
```

Step 1: Tracker capacity is 4 and aggressor rows are 6.

Step 2: The model tracks 4 rows and leaves `6 - 4 = 2` untracked.

Step 3: Since untracked rows exist, the warning prints.

Step 4: This models the TRRespass insight: resource-limited TRR trackers can be overwhelmed by many-sided hammering patterns.

---

### Question 42: ROP chain simulation

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

static void gadget(const char *name) {
    printf("execute %s; ret\n", name);
}

int main(void) {
    const char *chain[] = {"pop rdi", "pop rsi", "call system"};

    for (int sp = 0; sp < 3; sp++) {
        gadget(chain[sp]);
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
execute pop rdi; ret
execute pop rsi; ret
execute call system; ret
```

Step 1: The array represents attacker-controlled stack entries in a ROP chain.

Step 2: The loop calls the gadget simulation for each entry.

Step 3: Each gadget ends conceptually with `ret`, which transfers control to the next address from the stack.

Step 4: This shows how stack data can become a sequence of control-flow targets.

---

### Question 43: Shadow stack comparison trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

static int shadow_return_ok(unsigned long normal_ret, unsigned long shadow_ret) {
    return normal_ret == shadow_ret;
}

int main(void) {
    unsigned long real_return = 0x401000;
    unsigned long attack_return = 0x404040;

    printf("normal=%d\n", shadow_return_ok(real_return, real_return));
    printf("attack=%d\n", shadow_return_ok(attack_return, real_return));
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
normal=1
attack=0
```

Step 1: In the normal case, the return address on the normal stack matches the shadow-stack copy.

Step 2: In the attack case, the normal stack has been changed to `0x404040`, but the shadow stack still holds `0x401000`.

Step 3: The mismatch returns 0.

Step 4: This models Intel Shadow Stack's protected duplicate return-address check.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 44: Page permission check ignores user/supervisor

**Q:** The following complete C program contains a buggy page-permission check. Identify the bug in `allowed_bad` and explain why `allowed_safe` is correct.

```c
#include <stdio.h>
#include <stdbool.h>

struct Pte {
    bool present;
    bool rw;
    bool user;
};

static bool allowed_bad(struct Pte p, char access) {
    if (!p.present) {
        return false;
    }
    if (access == 'w' && !p.rw) {
        return false;
    }
    return true;
}

static bool allowed_safe(struct Pte p, char access, bool user_mode) {
    if (!p.present) {
        return false;
    }
    if (user_mode && !p.user) {
        return false;
    }
    if (access == 'w' && !p.rw) {
        return false;
    }
    return true;
}

int main(void) {
    struct Pte kernel_page = {true, false, false};

    printf("bad user read=%d\n", allowed_bad(kernel_page, 'r'));
    printf("safe user read=%d\n", allowed_safe(kernel_page, 'r', true));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `allowed_bad` checks present and write permission but ignores whether the access comes from user mode.

Step 2: State the output.

```text
bad user read=1
safe user read=0
```

Step 3: Explain the security consequence. A user process could read a supervisor-only mapping if the user/supervisor bit is ignored.

Step 4: Explain the secure refactor. `allowed_safe` rejects user-mode access when `p.user` is false.

Step 5: State the exam conclusion. Page protection requires checking both access type and privilege level.

---

### Question 45: Page-table walk trusts a non-present PTE

**Q:** The following complete C program models a page-table lookup. Identify the bug in `translate_bad` and explain the secure refactor.

```c
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>

struct Pte {
    bool present;
    uint32_t frame_base;
};

static uint32_t translate_bad(struct Pte p, uint32_t offset) {
    return p.frame_base + offset;
}

static bool translate_safe(struct Pte p, uint32_t offset, uint32_t *out) {
    if (!p.present) {
        return false;
    }
    if (offset >= 0x1000u) {
        return false;
    }
    *out = p.frame_base + offset;
    return true;
}

int main(void) {
    struct Pte swapped_out = {false, 0x900000};
    uint32_t out = 0;

    printf("bad=0x%x\n", translate_bad(swapped_out, 0x123));
    printf("safe=%d\n", translate_safe(swapped_out, 0x123, &out));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `translate_bad` uses the frame base even when the PTE is not present.

Step 2: State the output.

```text
bad=0x900123
safe=0
```

Step 3: Explain the security/correctness issue. A non-present page should fault or trigger OS handling, not produce a usable physical address.

Step 4: Explain the secure refactor. `translate_safe` checks `present` and validates the page offset before producing an address.

Step 5: State the exam conclusion. Translation and permission metadata must be checked before constructing a physical address.

---

### Question 46: Stale TLB entry after address-space switch

**Q:** The following complete C program models a stale TLB bug. Identify the bug in `switch_bad` and explain why `switch_safe` flushes the TLB.

```c
#include <stdio.h>
#include <stdbool.h>

struct Cpu {
    unsigned int cr3;
    unsigned int tlb_vpn;
    unsigned int tlb_pfn;
    bool tlb_valid;
};

static void switch_bad(struct Cpu *cpu, unsigned int new_cr3) {
    cpu->cr3 = new_cr3;
}

static void switch_safe(struct Cpu *cpu, unsigned int new_cr3) {
    cpu->cr3 = new_cr3;
    cpu->tlb_valid = false;
}

int main(void) {
    struct Cpu cpu = {0x1000, 0x4, 0xabc, true};

    switch_bad(&cpu, 0x2000);
    printf("bad cr3=0x%x tlb_valid=%d\n", cpu.cr3, cpu.tlb_valid);

    switch_safe(&cpu, 0x3000);
    printf("safe cr3=0x%x tlb_valid=%d\n", cpu.cr3, cpu.tlb_valid);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `switch_bad` changes `CR3` but leaves the old TLB entry valid.

Step 2: State the output.

```text
bad cr3=0x2000 tlb_valid=1
safe cr3=0x3000 tlb_valid=0
```

Step 3: Explain the security problem. A stale translation from the previous address space could be used under the new process if not invalidated or tagged correctly.

Step 4: Explain the secure refactor. `switch_safe` invalidates cached translations when switching page tables.

Step 5: State the caveat. Real CPUs may use address-space identifiers or PCIDs to avoid full flushes, but stale translations still need correct tagging or invalidation.

---

### Question 47: MPU overlap priority bug

**Q:** The following complete C program contains an MPU overlap bug. Identify the bug in `write_allowed_bad` and explain why `write_allowed_safe` is correct for this model.

```c
#include <stdio.h>
#include <stdbool.h>

struct Region {
    unsigned int start;
    unsigned int end;
    bool write;
};

static bool contains(struct Region r, unsigned int addr) {
    return addr >= r.start && addr < r.end;
}

static bool write_allowed_bad(unsigned int addr) {
    struct Region low_priority = {0x1000, 0x3000, true};
    struct Region high_priority = {0x1800, 0x2000, false};

    if (contains(low_priority, addr)) {
        return low_priority.write;
    }
    if (contains(high_priority, addr)) {
        return high_priority.write;
    }
    return false;
}

static bool write_allowed_safe(unsigned int addr) {
    struct Region low_priority = {0x1000, 0x3000, true};
    struct Region high_priority = {0x1800, 0x2000, false};

    if (contains(high_priority, addr)) {
        return high_priority.write;
    }
    if (contains(low_priority, addr)) {
        return low_priority.write;
    }
    return false;
}

int main(void) {
    printf("bad 0x1900=%d\n", write_allowed_bad(0x1900));
    printf("safe 0x1900=%d\n", write_allowed_safe(0x1900));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `write_allowed_bad` checks the low-priority permissive region before the high-priority restrictive region.

Step 2: State the output.

```text
bad 0x1900=1
safe 0x1900=0
```

Step 3: Explain the vulnerability. Address `0x1900` lies in both regions. If the permissive region wins, a protected subrange becomes writable.

Step 4: Explain the secure refactor. `write_allowed_safe` applies the highest-priority matching region first.

Step 5: State the exam conclusion. Overlapping protection ranges are dangerous unless priority is defined and implemented correctly.

---

### Question 48: Spectre Variant 1 bounds-check bypass

**Q:** The following complete C program shows a Spectre-shaped victim function and a safer refactor. Identify the vulnerability pattern in `victim_bad` and explain why `victim_safe` avoids the architectural out-of-bounds read in this model.

```c
#include <stdio.h>
#include <stddef.h>

static int victim_bad(const int *array, size_t array_size, size_t index) {
    if (index < array_size) {
        return array[index];
    }
    return -1;
}

static int victim_safe(const int *array, size_t array_size, size_t index) {
    if (index >= array_size) {
        return -1;
    }
    return array[index];
}

int main(void) {
    int array[4] = {10, 20, 30, 40};

    printf("bad valid=%d\n", victim_bad(array, 4, 2));
    printf("safe invalid=%d\n", victim_safe(array, 4, 9));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the pattern. `victim_bad` contains the classic Spectre Variant 1 shape: a bounds check guarding an array access.

Step 2: State the output.

```text
bad valid=30
safe invalid=-1
```

Step 3: Explain the Spectre issue. Architecturally, the check prevents out-of-bounds access. Microarchitecturally, branch prediction may transiently execute the body for an invalid index after training.

Step 4: Explain the safe refactor shown. `victim_safe` cleanly rejects invalid indexes before accessing the array, which is necessary for architectural correctness.

Step 5: State the limitation. This C-level refactor alone is not a complete Spectre mitigation on all CPUs. High-assurance code may also require speculation barriers, index masking, or compiler/hardware hardening.

---

### Question 49: Stack overflow enabling ROP

**Q:** The following complete C program contains an unsafe stack-copy function and a safe refactor. Identify how `copy_bad` can enable ROP and explain why `copy_safe` is safer.

```c
#include <stdio.h>
#include <string.h>

struct FrameLike {
    char buffer[8];
    unsigned long saved_return;
};

static void copy_bad(struct FrameLike *f, const char *src) {
    strcpy(f->buffer, src);
}

static int copy_safe(struct FrameLike *f, const char *src) {
    int written = snprintf(f->buffer, sizeof(f->buffer), "%s", src);
    return written >= 0 && (size_t)written < sizeof(f->buffer);
}

int main(void) {
    struct FrameLike f = {{0}, 0x401000};

    printf("safe copied=%d\n", copy_safe(&f, "ABCDEFG"));
    printf("return=0x%lx\n", f.saved_return);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `copy_bad` uses `strcpy` with no destination-size check.

Step 2: Explain the ROP connection. A long input can overflow `buffer` and overwrite adjacent control data, represented here by `saved_return`. In a real stack frame, corrupting a saved return address can start a ROP chain.

Step 3: State the output of the safe path.

```text
safe copied=1
return=0x401000
```

Step 4: Explain the secure refactor. `copy_safe` uses `snprintf` with the destination size, ensuring null termination and avoiding writes past the buffer.

Step 5: State the exam conclusion. W^X does not stop overwriting return addresses; bounds-safe copying is still required.

---

### Question 50: Missing null terminator in protection metadata

**Q:** The following complete C program stores a page label in fixed-size metadata. Identify the bug in `set_label_bad` and explain the secure refactor.

```c
#include <stdio.h>
#include <string.h>

struct PageLabel {
    char label[8];
};

static void set_label_bad(struct PageLabel *p, const char *src) {
    strncpy(p->label, src, sizeof(p->label));
}

static void set_label_safe(struct PageLabel *p, const char *src) {
    snprintf(p->label, sizeof(p->label), "%s", src);
}

int main(void) {
    struct PageLabel p;

    set_label_safe(&p, "kernel-page");
    printf("label=%s\n", p.label);
    printf("terminated=%d\n", p.label[7] == '\0');
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `strncpy` does not guarantee a null terminator if the source is at least as long as the destination.

Step 2: Explain the risk. Later code treating `label` as a C string may read past the 8-byte array.

Step 3: State the safe-path output.

```text
label=kernel-
terminated=1
```

Step 4: Explain the secure refactor. `snprintf` respects the destination size and writes a terminator when the size is nonzero.

Step 5: State the exam conclusion. Metadata buffers in low-level systems code need the same bounds and termination discipline as data buffers.

---

### Question 51: Shadow stack mismatch ignored

**Q:** The following complete C program models a broken and a correct shadow-stack return check. Identify the bug in `return_bad` and explain why `return_safe` is correct.

```c
#include <stdio.h>
#include <stdbool.h>

static bool return_bad(unsigned long normal_ret, unsigned long shadow_ret) {
    (void)shadow_ret;
    return normal_ret != 0;
}

static bool return_safe(unsigned long normal_ret, unsigned long shadow_ret) {
    return normal_ret == shadow_ret;
}

int main(void) {
    unsigned long original = 0x401000;
    unsigned long attacked = 0x404040;

    printf("bad attack=%d\n", return_bad(attacked, original));
    printf("safe attack=%d\n", return_safe(attacked, original));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `return_bad` ignores the shadow-stack value and only checks that the normal return address is nonzero.

Step 2: State the output.

```text
bad attack=1
safe attack=0
```

Step 3: Explain the security consequence. If the normal stack return address is overwritten, the program returns to attacker-controlled code or gadgets unless the protected duplicate is checked.

Step 4: Explain the secure refactor. `return_safe` compares the normal and shadow return addresses and rejects mismatches.

Step 5: State the exam conclusion. Shadow stacks work because the attacker cannot silently change both copies.

---

### Question 52: Rowhammer detector with too few tracked rows

**Q:** The following complete C program models a Rowhammer detector. Identify the weakness in `trr_bad` and explain the improvement in `trr_safe`.

```c
#include <stdio.h>
#include <stdbool.h>

static bool trr_bad(int hottest_row_count, int threshold) {
    return hottest_row_count > threshold;
}

static bool trr_safe(int aggressor_rows, int tracker_capacity,
                     int hottest_row_count, int threshold) {
    if (aggressor_rows > tracker_capacity) {
        return true;
    }
    return hottest_row_count > threshold;
}

int main(void) {
    int threshold = 100000;

    printf("bad many-sided=%d\n", trr_bad(80000, threshold));
    printf("safe many-sided=%d\n", trr_safe(8, 4, 80000, threshold));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the weakness. `trr_bad` checks only the hottest single row count. It misses many-sided patterns where no one tracked row exceeds the threshold but tracker capacity is overwhelmed.

Step 2: State the output.

```text
bad many-sided=0
safe many-sided=1
```

Step 3: Explain the TRRespass connection. Researchers bypassed TRR-style mitigations by exploiting limited row-tracking resources.

Step 4: Explain the improvement. `trr_safe` treats tracker-capacity pressure itself as suspicious.

Step 5: State the limitation. This is still only a simplified model. Real Rowhammer defence remains an arms race involving DRAM physics, memory controllers, OS policy, and workload behaviour.

---

## Final Revision Checklist

- Time-slicing requires hardware-enforced isolation between processes and the kernel.
- Rings define privilege, but not complete memory partitioning.
- Segmentation uses selectors, descriptor tables, descriptors, bases, limits, permissions, and DPLs.
- Real Mode is flat and unprotected; Protected Mode adds segmentation and privilege; Unreal Mode abuses cached descriptor state.
- Variable-sized segments cause external fragmentation; fixed-size pages address it.
- Virtual memory gives each process a private linear VAS independent of physical memory layout.
- The MMU translates addresses and enforces permissions on every memory access.
- i386 splits linear addresses into 10-bit directory, 10-bit table, and 12-bit offset fields.
- `CR3` points to the active process's page directory.
- Page-table bits include present, read/write, user/supervisor, dirty, and OS-available bits.
- The TLB is essential because page-table walks are expensive.
- MPU/PMP provides region-based physical-address protection without translation.
- MPU/PMP is deterministic and lightweight, but limited by region count, granularity, misconfiguration, and non-CPU bus-master bypasses.
- Pipeline hazards are data, branch/control, and structural hazards.
- Superscalar and out-of-order execution improve utilisation but increase microarchitectural complexity.
- The ROB commits results in program order to preserve architectural correctness.
- Transient attacks exploit microarchitectural side effects left by wrong-path execution.
- Meltdown leaks kernel memory transiently through cache state; KPTI removes most kernel mappings from user page tables.
- Spectre mistrains branch prediction inside victim code and is harder to mitigate cleanly.
- Speculation-safe designs isolate or delay speculative side effects, with performance cost.
- Lock-step execution duplicates cores and compares outputs to detect faults.
- Rowhammer is a DRAM physical disturbance attack using aggressor and victim rows.
- TRR refreshes likely victim rows but can be bypassed when tracking resources are overwhelmed.
- The stack stores control data; corrupting return addresses enables ROP.
- W^X stops injected shellcode but not reuse of existing executable gadgets.
- ASLR hides gadget addresses but can be defeated by information leaks.
- Stack canaries detect linear overwrites before return.
- Intel Shadow Stack and ARM PAC protect backward-edge control flow.
- Intel IBT and ARM BTI protect forward-edge indirect branches.
