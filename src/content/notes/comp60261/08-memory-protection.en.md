---
subject: COMP60261
chapter: 8
title: "Memory Protection"
language: en
---

# Lecture 2 — Memory Protection

**Course:** COMP60261 — Secure Computer Architecture and Systems  
**Lecturer:** John Goodacre  
**Lecture topic:** Memory Protection  
**Source used:** Uploaded slide deck, *Lecture 2 - Memory Protection.pdf*.  
**Transcript status:** No transcript was provided in this chat, so these notes are grounded in the slides only. Transcript-dependent gaps are marked **[UNCLEAR]**.

## Topic and scope

This lecture explains how computer architectures protect memory and control execution, starting with OS/process isolation and x86 segmentation, then moving through MMUs, MPUs/PMPs, speculative execution attacks, Rowhammer, and control-flow attacks such as ROP.

The broader theme is that the simple von Neumann CPU–memory model becomes security-critical once real systems add abstraction layers, performance optimisations, and hardware/software protection mechanisms.

---

## 1. Operating systems and the need for memory protection

### 1.1 Historical motivation: time-slicing and multiple processes

By the mid-1950s, computers began using operating systems so that a CPU could **time-slice** more than one process.

**Intuition:**  
A single CPU can appear to run multiple programs by switching between them quickly. But once multiple programs coexist, one program must not be allowed to corrupt another program or the operating system itself.

**Problem introduced by time-slicing:**

- Application code must be stopped from breaking OS code.
- Different processes must be isolated from one another.
- The OS kernel must be protected from user applications.
- Hardware support is needed because software alone cannot reliably stop malicious or faulty code from accessing arbitrary memory.

### 1.2 ISA extensions for isolation

The Instruction Set Architecture, or ISA, was extended to isolate:

- multiple process contexts from each other;
- application code from OS/kernel code;
- user-space execution from privileged kernel-space execution.

The slide diagram shows:

- **Physical hardware** at the bottom;
- an **ISA interface** above the hardware;
- the **OS kernel** in privileged kernel space;
- multiple user-space processes above the kernel;
- a **hardware barrier** blocking direct process-to-process access;
- system calls as the controlled route from application space into the kernel.

### Key concept — ISA-supported isolation

**Intuition:**  
The CPU provides mechanisms so that some instructions and memory regions are only accessible in privileged modes.

**Formal slide-level definition:**  
The ISA was extended “to isolate multiple Process contexts and the OS context from each other.”

---

## 2. Protection rings

### 2.1 x86 protection rings

Early x86-style privilege systems used **protection rings**.

#### Ring 0

- The most privileged level.
- Intended for the operating system kernel.
- Code running in Ring 0 has unrestricted access to hardware.

#### Rings 1 and 2

- Intermediate privilege levels.
- Rarely used by mainstream operating systems such as Windows or Linux.
- Originally designed for components such as device drivers.

#### Ring 3

- The least privileged level.
- User applications run here.

### 2.2 The memory-partitioning problem

The ring model defines *privilege levels*, but the lecture then asks:

> How do we ensure rings can partition memory for code in each level?

This motivates **segment translation** and later **paging/MMU-based virtual memory**.

### Key concept — protection rings

**Intuition:**  
A ring is a privilege level. Lower-numbered rings have more authority; Ring 0 is the kernel, Ring 3 is normal user code.

**Formal slide-level definition:**  
Ring 0 is the most privileged level; Ring 3 is the least privileged level where user applications run.

---

## 3. Segment translation

### 3.1 Data structures introduced for segmentation

Early ring-supporting processors introduced the following structures:

- **Descriptors**
- **Descriptor Tables**
- **Selectors**
- **Segment Registers**

Together, these allowed the OS to create mappings between a process’s **logical address** and a location in the **linear/physical address space**.

### 3.2 The role of segmentation

Segmentation changes the meaning of an address in code.

Instead of the address directly naming a physical memory location, an address consists of:

$$
\text{Address} = (\text{Segment Selector}, \text{Offset})
$$

The selector identifies a segment descriptor, and the offset selects a location inside that segment.

The diagram on the Intel 80286 slide shows the selector and offset entering the CPU; the selector is used to find a segment descriptor containing the segment base address; the physical address adder combines the base address with the offset.

Cleanly:

$$
\text{Linear/Physical Address} = \text{Segment Base Address} + \text{Offset}
$$

**[UNCLEAR]** The slides sometimes refer to “linear (physical) address space,” while later slides distinguish linear, virtual, and physical addresses more carefully. The transcript may clarify the exact terminology the lecturer intended here.

---

## 4. Intel 80286 Protected Virtual Address Mode, 1982

### 4.1 Real Mode

The Intel 80286 still supported the original flat **Real Mode** memory abstraction.

Real Mode properties from the slides:

- Flat, unprotected memory abstraction.
- Any memory location within the 1 MB address range could be used as either data or code.
- Programs started in Real Mode.
- Real Mode had no protection.

### Key concept — Real Mode

**Intuition:**  
Real Mode is the legacy mode where addresses behave like direct memory locations and there is no meaningful hardware-enforced isolation.

**Formal slide-level definition:**  
Real Mode allowed any memory location within the 1 MB address range to be either data or code.

### 4.2 Protected Mode

The 80286 introduced **Protected Mode** with a 16 MB address space.

Protected Mode was intended to enforce a privilege model to prevent:

- user applications from interfering with the OS;
- user applications from interfering with each other.

Two mechanisms were combined:

- **Protection rings** define the privilege level.
- **Memory segmentation** isolates memory.

In Protected Mode:

- addresses in code were no longer physical locations in linear memory;
- addresses consisted of a **Segment Selector** and an **Offset**;
- the slide emphasises that this was “still just a simple integer value.”

**[UNCLEAR]** The phrase “still just a simply integer value” appears on the slide. The intended point is probably that even though the address is interpreted structurally, it is still represented as an integer/pointer value in code.

---

## 5. Memory segmentation details

### 5.1 Segment Selector and Descriptor Tables

The pointer’s **Segment Selector** is used as an index into a descriptor table:

- **GDT:** Global Descriptor Table
- **LDT:** Local Descriptor Table

The selected descriptor describes the memory segment.

### 5.2 Descriptor fields

A descriptor contains fields including:

#### Base

A 32-bit linear address where the segment begins.

$$
\text{Base} = \text{start address of segment}
$$

#### Limit

A 20-bit value defining the size of the segment.

$$
\text{Limit} = \text{maximum allowed offset / segment size boundary}
$$

#### Type / Attributes

Bits indicating whether the segment is:

- executable;
- writable;
- readable.

#### S bit, “System”

A bit specifying whether the descriptor is for:

- a system structure, such as a TSS;
- or a normal code/data segment.

#### P bit, “Present”

A bit indicating whether the segment is currently in physical memory.

#### DPL, Descriptor Privilege Level

A 2-bit field specifying the privilege level, or ring, of the segment.

$$
\text{DPL} \in \{0,1,2,3\}
$$

### Key concept — descriptor

**Intuition:**  
A descriptor is metadata about a segment: where it starts, how large it is, what permissions it has, and which privilege level may access it.

**Formal slide-level definition:**  
The descriptor includes Base, Limit, Type/Attributes, S, P, and DPL fields.

---

## 6. Issues with Protected Virtual Address Mode, PVAM

### 6.1 Problem 1: memory fragmentation

PVAM segmentation used variable-sized segments. Constantly allocating and freeing variable-sized segments caused physical memory to become a patchwork of small, unusable free blocks.

This is **external fragmentation**.

**Consequence:**

- A large new segment may need contiguous physical memory.
- Even if total free memory is sufficient, it may be split into small gaps.
- Therefore allocating a new larger contiguous segment becomes difficult and inefficient.

The slide diagram shows existing processes A, B, C, and D with small free gaps between them. A new process needs a larger contiguous region, but no single free gap is large enough, so allocation fails even though several free gaps exist.

### Key concept — memory fragmentation

**Intuition:**  
Memory can be “full of holes”: enough free space overall, but not in one contiguous chunk.

**Formal slide-level definition:**  
Allocating and freeing variable-sized segments leads to physical memory becoming a patchwork of small unusable free blocks, making larger contiguous segment allocation difficult.

### 6.2 Problem 2: “Unreal Mode” vulnerability

The slides describe “Unreal Mode” as a vulnerability arising from backward compatibility between segmentation and Real Mode.

Step-by-step from the slide:

1. Segmentation needed to be backwards compatible with Real Mode, which was flat and unprotected.
2. A program starts in Real Mode, limited to a 1 MB address space.
3. The program requests to move into Protected Mode, gaining access to the wider 4 GB address space.
4. It loads segment descriptions using 32-bit descriptors.
5. These descriptors are held in the CPU descriptor cache.
6. The program switches back into Real Mode, where there are no protections.
7. It creates integer pointers that use the cached 32-bit descriptor.
8. Result: no protection on user data, OS data, or core memory.
9. Unreal Mode began being used to overcome the 1 MB limit of legacy DOS applications and became a feature of the next OS version.

**[UNCLEAR]** The slide says “whole 4GB address space” in the context of moving into Protected Mode, even though an earlier slide says 80286 Protected Mode had a 16 MB address space. The transcript may clarify whether this part refers to later x86 behaviour rather than the original 80286.

### Key concept — Unreal Mode

**Intuition:**  
Unreal Mode abuses cached Protected Mode segment descriptors after returning to unprotected Real Mode, allowing wider memory access without the intended protection checks.

**Formal slide-level description:**  
A program switches into Protected Mode, loads 32-bit descriptors into the CPU descriptor cache, switches back to Real Mode, then creates integer pointers using the cached 32-bit descriptor, resulting in unprotected access to the address space.

---

## 7. Virtual memory and the MMU

### 7.1 Why virtual memory was needed

The slides introduce MMU-based virtual memory as a foundation for modern computing because earlier approaches had serious issues.

#### Protection violation

Without a hardware-enforced boundary, a bug or malicious action in one process can corrupt:

- another process’s memory;
- or the operating system kernel itself.

#### Allocation inefficiency

Without virtual memory, software must find and manage contiguous physical memory blocks for each process.

As processes are created and destroyed:

- physical memory becomes externally fragmented;
- free memory is broken into small non-contiguous blocks;
- large segment allocation becomes difficult.

#### Static memory layout

Programs must be compiled for a specific physical address range.

This makes programs:

- non-relocatable;
- harder to develop;
- harder to deploy.

### 7.2 Virtual memory as an architectural abstraction

**Virtual Memory** is a memory management scheme that provides each process with its own private, linear **Virtual Address Space**, or VAS.

The VAS:

- is private to each process;
- is linear;
- typically starts at address zero;
- is independent of the physical memory layout.

The OS kernel is responsible for:

1. creating and managing mappings between a process’s virtual address space and actual physical addresses in DRAM;
2. storing these mappings in **Page Tables**;
3. allowing a process’s memory to be non-contiguous in physical RAM;
4. allowing parts of a process’s address space to be temporarily stored on secondary storage, i.e. paged to disk.

### Key concept — virtual address space

**Intuition:**  
Each process sees a clean, private memory world, even though its actual data may be scattered through physical RAM.

**Formal slide-level definition:**  
A Virtual Address Space is a private and linear address space, typically starting at address zero, independent of physical memory layout.

### 7.3 Virtual-to-physical address translation

The slide diagram shows a virtual address split into:

$$
\text{Virtual Address} = (\text{VPN}, \text{Offset})
$$

where:

- VPN = Virtual Page Number;
- Offset = position within the page.

The VPN is looked up in the page table and translated into a physical frame number:

$$
\text{Physical Address} = (\text{PFN}, \text{Offset})
$$

where:

- PFN = Physical Frame Number;
- Offset is unchanged.

So:

$$
\text{VPN} \rightarrow \text{PFN}
$$

and

$$
(\text{VPN}, \text{Offset}) \rightarrow (\text{PFN}, \text{Offset})
$$

**Key point:** page translation changes the page/frame number but preserves the offset.

---

## 8. Memory Management Unit, MMU

### 8.1 Definition

The **Memory Management Unit**, or MMU, is a dedicated hardware component integrated within the CPU that implements the virtual memory scheme.

It performs two primary functions on every memory access:

1. address translation;
2. permission enforcement.

### 8.2 Address translation

The MMU intercepts every virtual address generated by the CPU.

It performs a **page table walk**, which is a software- or hardware-accelerated traversal of OS-managed page tables residing in memory.

The purpose of the walk is to find the corresponding physical address for the requested virtual address.

Because page table walks have high latency, the MMU contains a high-speed cache of recent translations:

- **TLB:** Translation Lookaside Buffer.

### Key concept — TLB

**Intuition:**  
The TLB is a shortcut cache for address translations so the CPU does not have to walk page tables for every memory access.

**Formal slide-level definition:**  
The TLB is a high-speed cache of recent translations inside the MMU.

### 8.3 Permission enforcement

Each page table entry contains permission bits such as:

- Read;
- Write;
- Execute;
- User/Supervisor.

During translation, the MMU checks:

- the requested access type;
- the CPU’s current privilege level;
- the permission bits in the page table entry.

If access is not permitted:

- the MMU blocks the transaction;
- it generates a hardware exception, specifically a **page fault**, to the kernel.

### Key concept — page fault

**Intuition:**  
A page fault is the CPU/MMU’s way of saying “this memory access cannot proceed normally.”

**Formal slide-level description:**  
If access is not permitted, the MMU blocks the transaction and generates a hardware exception, a page fault, to the kernel.

---

## 9. Security implications of the MMU

### 9.1 Process isolation

The MMU makes it architecturally impossible for a user-mode process to generate a physical address outside the regions explicitly mapped for it in its own page tables.

This gives:

- hardware-enforced boundaries between processes;
- protection for the kernel.

### 9.2 Fault containment

Invalid memory access inside a single process, such as a NULL pointer dereference, is trapped by the MMU as a page fault.

The OS can then:

- terminate the faulty process;
- tidy up after it;
- preserve the stability of the kernel and other processes.

### 9.3 Efficient memory utilisation

By abstracting the physical layout, the OS can manage memory in fixed-size pages.

This:

- eliminates external fragmentation;
- enables demand paging;
- enables copy-on-write;
- improves performance and memory efficiency.

### Key concept — copy-on-write

The slide names copy-on-write as an advanced feature enabled by MMU-based virtual memory, but does not define it.

**[UNCLEAR]** Transcript needed if the lecturer explained copy-on-write in detail.

---

## 10. i386 paging unit, 1985

### 10.1 Two-level translation

The i386 paging unit translates a process’s **linear address** into a physical address using a two-level page table structure.

The slide says the OS-generated ID of each process is used as an index into a two-level translation, and the OS loads the address of the process’s page directory into the **CR3 register**.

**[UNCLEAR]** The phrase “process ID is used as an index” may be a simplification. The slide diagram specifically shows CR3 holding the page directory base for the active process.

### 10.2 CR3 register

For the active process:

$$
\text{CR3} = \text{address of that process’s Page Directory}
$$

The OS loads CR3 when switching to a process.

### 10.3 Linear address format

The i386 32-bit linear address is split into three fields:

$$
\text{Linear Address}_{32} =
\underbrace{\text{Directory}}_{10 \text{ bits}}
\ \Vert\
\underbrace{\text{Table}}_{10 \text{ bits}}
\ \Vert\
\underbrace{\text{Offset}}_{12 \text{ bits}}
$$

That is:

- Directory index: 10 bits
- Page table index: 10 bits
- Offset: 12 bits

### 10.4 Translation steps

1. CR3 points to the Page Directory.
2. The 10-bit Directory field indexes a directory entry.
3. The directory entry points to a Page Table.
4. The 10-bit Table field indexes a page table entry.
5. The page table entry contains the page frame address.
6. The 12-bit Offset is appended unchanged.

Cleanly:

$$
\text{Physical Address}
=
\text{Page Frame Base}
+
\text{Offset}
$$

or, bitwise:

$$
\text{Physical Address}
=
\underbrace{\text{Page Frame Address}}_{\text{upper bits}}
\ \Vert\
\underbrace{\text{Offset}}_{12\text{ bits}}
$$

### 10.5 Page count

The slide states:

$$
2^{20} \times 4K \text{ pages}
$$

Reason:

$$
10 \text{ directory bits} + 10 \text{ table bits} = 20 \text{ page-selection bits}
$$

So there are:

$$
2^{20}
$$

virtual pages, each of size:

$$
2^{12} = 4096 \text{ bytes} = 4 \text{ KiB}
$$

Total addressable space:

$$
2^{20} \times 2^{12} = 2^{32} \text{ bytes}
$$

### 10.6 Segmentation still existed

The slide notes that i386 also supported segmented logical addresses and descriptor tables. The segmentation stage produced a linear address, which was then used by the paging system.

So the conceptual pipeline is:

$$
\text{Logical / segmented address}
\rightarrow
\text{Linear address}
\rightarrow
\text{Physical address}
$$

This created a complex mixture of permissions because both segmentation and paging could impose protection rules.

---

## 11. Page table protections

The slide lists page table protection/status bits.

### 11.1 P — Present

$$
P = 1
$$

means the page is in RAM and does not need to be swapped in from disk.

### 11.2 R/W — Read/Write

Indicates whether data can be written into the page.

### 11.3 U/S — User/Supervisor

Indicates whether the page is accessible only by the supervisor, i.e. the OS.

### 11.4 D — Dirty

Indicates whether the page has been written to.

If swapped out, dirty pages need to be written to disk.

### 11.5 AVAIL

Available for OS programmers to use however they want.

### 11.6 Complexity and TLB requirement

The slides emphasise that segment descriptor tables also had permission bits and could point to page table entries.

This created:

- a complex mix of permissions;
- extra performance overhead from address translation;
- a requirement for a cache of translations, the TLB.

The slide also notes that TLB vulnerabilities will be covered later.

**Connection:**  
This links earlier segmentation material to modern page-table permissions and foreshadows later vulnerability topics involving translation caches.

---

## 12. Requirement for physical memory protection

### 12.1 Why a full MMU is undesirable in some systems

In embedded and real-time systems, the overhead of a full MMU may be undesirable.

Reasons:

#### Non-deterministic latency

MMU-based virtual memory systems introduce variable memory access times due to:

- TLB misses;
- page table walks.

This is incompatible with hard real-time constraints.

#### Resource overheads

MMUs require:

- significant silicon area;
- increased power consumption;
- complex OS-level software for page table management.

#### System complexity

Many embedded systems use a static memory map.

They may not need:

- dynamic virtual memory;
- demand paging;
- page-table-heavy OS mechanisms.

### 12.2 But protection is still required

Even without an MMU, systems still need to protect critical memory regions such as:

- kernel code;
- interrupt stacks;
- peripheral control registers.

These must be protected from:

- less-privileged software;
- untrusted software components.

Unchecked physical memory access is a security and stability liability.

---

## 13. MPU and PMP

### 13.1 Definition

The lecture introduces:

- **MPU:** Memory Protection Unit, in ARM Cortex-M architecture.
- **PMP:** Physical Memory Protection unit, in RISC-V architecture.

Both are hardware modules that provide **region-based access control** directly over the physical address space.

### 13.2 No address translation

MPUs and PMPs operate without address translation.

Their sole function is to enforce access permissions on physical memory accesses initiated by the CPU core.

### 13.3 Region-based protection

Privileged software defines a finite set of memory regions.

Each region has access attributes:

- Read;
- Write;
- Execute.

The CPU hardware validates every memory access against these configured rules.

This provides a lightweight and deterministic method for enforcing memory isolation.

### Key concept — MPU/PMP

**Intuition:**  
An MPU/PMP is like a rule checker for physical addresses. It does not create virtual addresses; it just checks whether this CPU access is allowed.

**Formal slide-level definition:**  
MPU/PMP units are hardware modules that provide region-based access control directly on the physical address space and operate without address translation.

---

## 14. Principles of MPU/PMP operation

The MPU and PMP are configured and managed through dedicated CPU registers.

### 14.1 Region configuration

Privileged software programs hardware registers to define memory regions.

Examples of privileged software:

- an RTOS kernel running in privileged mode;
- RISC-V M-mode software.

Region definition typically includes:

- a base address register specifying the start of a region;
- a size or attribute register defining the region boundary and enabling it.

The slide notes that RISC-V PMP can use **NAPOT mode** for efficient power-of-two region definition.

**[UNCLEAR]** NAPOT is named but not defined in the slides. Transcript needed if the lecturer expanded it.

### 14.2 Permission assignment

For each region, a corresponding configuration register is programmed with an access-control policy.

Permissions include:

$$
R = \text{Read permission for loads}
$$

$$
W = \text{Write permission for stores}
$$

$$
X = \text{Execute permission for instruction fetches}
$$

These policies can depend on CPU privilege level.

### 14.3 Hardware enforcement

Once configured:

1. The MPU/PMP arbitrates every memory access initiated by the CPU core.
2. The physical address is checked against all enabled regions.
3. If the address matches one or more regions, the highest-priority matching region’s permissions are applied.
4. If the transaction violates permissions for the current privilege level, hardware blocks the access.
5. A precise memory fault exception is generated.

### Algorithm — MPU/PMP access check

```text
For every CPU memory access:
    input: physical address A, access type T ∈ {read, write, execute}, privilege level PL

    find all enabled regions containing A

    if no region matches:
        apply architecture-specific default behaviour [UNCLEAR from slides]

    else:
        choose the highest-priority matching region

    if T is permitted for PL:
        allow access

    else:
        block access
        raise precise memory fault exception
```

**[UNCLEAR]** The slides do not state what happens when no MPU/PMP region matches; this can be architecture/configuration dependent.

---

## 15. MPU/PMP versus MMU

### 15.1 Architectural rationale

Choosing MPU/PMP instead of MMU is deliberate for systems where certain properties are paramount.

#### Deterministic latency

Memory access times are predictable.

There are no variable-latency events such as:

- TLB misses;
- page table walks.

This is critical for hard real-time systems.

#### Resource efficiency

The hardware logic for MPU/PMP is much simpler than MMU logic.

This gives:

- smaller silicon area footprint;
- lower power consumption.

#### Reduced software complexity

The OS/firmware does not need to manage:

- complex multi-level page tables;
- demand paging;
- TLB invalidations.

#### System simplicity

MPU/PMP works well for systems with a mostly static memory map where the benefits of virtual memory are not required.

### 15.2 Comparison

| Feature | MMU | MPU/PMP |
|---|---|---|
| Address model | Virtual memory translation | Physical memory protection |
| Latency | Variable, e.g. TLB misses | Deterministic |
| Hardware cost | Higher silicon and power | Lower, simpler logic |
| Software cost | Page tables, paging, TLB management | Region configuration |
| Typical use | General-purpose systems, e.g. Linux | Real-time and embedded systems |

---

## 16. MPU/PMP security model and guarantees

An MPU/PMP provides hardware-enforced security guarantees for CPU-initiated transactions.

### 16.1 Kernel/RTOS protection

It creates an isolation boundary preventing unprivileged tasks from accessing or corrupting trusted kernel memory.

### 16.2 Inter-task isolation

It separates different unprivileged tasks.

This helps:

- contain faults;
- prevent lateral movement between sandboxed components.

### 16.3 Code integrity, W^X

By configuring code-containing regions as read-only and execute-only, it enforces a **Write-XOR-Execute** policy.

$$
W \oplus X
$$

Meaning memory should be writable or executable, but not both.

This mitigates:

- code injection;
- self-modifying attacks.

### 16.4 Peripheral register protection

MPU/PMP can restrict unprivileged access to memory-mapped peripheral control registers.

This prevents unauthorised:

- device configuration;
- device manipulation.

---

## 17. MPU/PMP vulnerabilities and architectural limitations

### 17.1 Bypass by non-CPU bus masters

Standard MPU/PMP only polices memory accesses originating from the CPU core it is part of.

It does not protect against other bus masters, such as:

- DMA controllers.

A DMA controller can access memory independently.

Mitigation requires separate hardware such as:

- IOMMU;
- IOPMP.

**Key limitation:** MPU/PMP is CPU-facing, not necessarily system-bus-wide.

### 17.2 Privilege escalation and misconfiguration

The protection scheme depends entirely on the integrity of privileged software that configures it.

If an attacker gains privilege sufficient to write MPU/PMP configuration registers, then:

- protections can be disabled;
- protections can be maliciously altered.

### 17.3 Limited granularity

MPU/PMP typically supports only a small finite number of programmable regions, for example:

- 8 regions;
- 16 regions.

This can force coarse-grained configurations.

A region may be larger than necessary, potentially allowing unintended access to nearby data inside an overly permissive region.

### 17.4 Physical attacks

MPU/PMP can be bypassed by sophisticated physical attacks, including:

- fault injection;
- glitching;
- side-channel analysis.

### 17.5 CWE reference

The slide references:

- **CWE-1260:** Improper Handling of Overlap Between Protected Memory Ranges.

**[UNCLEAR]** The slides mention CWE-1260 but do not explain an example. Transcript needed if discussed.

---

## 18. Processor speculation and CPU design evolution

The lecture shifts from memory protection to CPU execution optimisations and their security consequences.

---

## 19. In-order processors and pipelining

### 19.1 Von Neumann execution model

The lecture presents in-order processors as a direct translation of the von Neumann execution model.

Basic instruction stages:

1. **Fetch** the instruction from memory.
2. **Decode** the instruction to know what to do.
3. **Execute** the instruction, e.g. arithmetic or moving data.
4. **Writeback** the result into memory or registers.

### 19.2 Pipelining

Pipelining overlaps these stages for different instructions.

For example:

```text
Instruction i:     fetch → decode → execute
Instruction i+1:          fetch → decode → execute
Instruction i+2:                  fetch → decode → execute
```

**Intuition:**  
Rather than waiting for one instruction to finish completely before starting the next, the CPU keeps different stages busy with different instructions.

---

## 20. Problems with pipelined processors

### 20.1 Data hazards

A data hazard occurs when a later instruction needs the result of an earlier instruction before it can proceed.

The slide says:

> Everything pauses if the result of one instruction is needed to proceed with a subsequent instruction.

This creates pipeline **bubbles**, reducing the speed at which instructions can be processed.

### Key concept — data hazard

**Intuition:**  
Instruction B cannot run because it needs a value that Instruction A has not produced yet.

**Formal slide-level description:**  
Data hazards cause bubbles in the pipeline, reducing the speed at which instructions can be processed.

### 20.2 Branch hazards / control hazards

Branches in code mean the processor does not know which code path should enter the pipeline next.

Example branch:

```c
if (...) {
    ...
} else {
    ...
}
```

Until the condition is resolved, the CPU may not know which path to fetch.

The slide says this means:

> you can’t feed the pipeline.

**[UNCLEAR]** The slide does not use the term “control hazard,” but this is the standard term. The notes retain “branch hazard” as the slide’s concept.

### 20.3 Structural hazards

Different instructions can take different numbers of clock cycles.

Example from the slide:

- If a `DIV` instruction is still using hardware resources,
- a later `ADD` instruction may not be able to use the needed unit.

The slide says structural hazards mean:

> you can’t do a say ADD instruction for the next instruction in the pipeline, if you’re still waiting for DIV to complete.

### Key concept — structural hazard

**Intuition:**  
The hardware unit needed by the next instruction is busy.

**Formal slide-level description:**  
Instructions must wait if a required hardware resource is occupied by a preceding instruction.

---

## 21. Superscalar pipelines

### 21.1 Motivation

Superscalar pipelines increase throughput by processing multiple instructions in parallel.

### 21.2 Instruction fetch and decode

The processor front-end can fetch and decode multiple instructions in parallel from memory.

The number of instructions processed simultaneously is called the pipeline’s **width**.

Example from the slide diagram:

- Instruction 1 and Instruction i+1 are fetched from the instruction cache.
- They pass through Decoder A and Decoder B.

### 21.3 Multiple execution units

A superscalar core contains duplicated and heterogeneous functional units, such as:

- multiple ALUs;
- FPUs;
- Load/Store Units, LSUs.

### 21.4 Instruction dispatch

Additional pipeline stage(s) contain dispatch logic.

Dispatch logic issues multiple decoded instructions to available and appropriate execution units during the same clock cycle.

The slide diagram includes:

- instruction cache;
- decoders;
- dispatch and hazard logic;
- ALU 1;
- ALU 2;
- FPU;
- LSU;
- register file with multiple write ports.

### Key concept — superscalar processor

**Intuition:**  
A superscalar CPU tries to do more than one instruction’s worth of work per cycle by having multiple execution units and dispatching instructions to them in parallel.

**Formal slide-level definition:**  
A superscalar front-end fetches and decodes multiple instructions in parallel; the number processed simultaneously is the pipeline width.

---

## 22. Out-of-order execution

### 22.1 Why superscalar enables out-of-order execution

The lecture says superscalar pipelines then enabled **Out-of-Order Execution**, or OoO.

Out-of-order execution allows instructions to execute when their inputs and hardware resources are ready, not necessarily in original program order.

### 22.2 Instruction fetch and decode

Instructions enter the pipeline from memory in their original program order.

### 22.3 Register renaming

Register renaming eliminates certain data dependencies:

- Write-After-Read, WAR;
- Write-After-Write, WAW.

Architectural registers named in instructions are mapped onto a larger set of physical hardware registers.

This allows instructions that reuse the same logical register for independent purposes to execute concurrently.

### Key concept — register renaming

**Intuition:**  
The CPU gives temporary physical registers to instructions so false dependencies on the same architectural register name do not force unnecessary waiting.

**Formal slide-level definition:**  
Architectural registers specified in instructions are mapped to a larger set of physical hardware registers to eliminate WAR and WAW hazards.

### 22.4 Reservation station / issue queue

Decoded and renamed instructions are placed into a buffer called:

- a **reservation station**;
- or an **issue queue**.

They wait there until all operand values are available.

### 22.5 Execution

Once:

- operands are ready;
- a corresponding execution unit is free;

an instruction is issued from the queue and executed.

Execution can complete out of original program sequence.

### 22.6 Commit / retire

A **Re-Order Buffer**, or ROB, tracks instructions in flight.

Results are committed to architectural state in original program order.

Architectural state includes:

- registers;
- memory.

This preserves:

- precise exception handling;
- logical program flow.

### Key concept — Re-Order Buffer, ROB

**Intuition:**  
The ROB lets the CPU execute speculatively and out of order internally, while still making the program appear to complete in the correct order.

**Formal slide-level definition:**  
The ROB tracks instructions in flight and commits their results to architectural state in original program order.

---

## 23. Example architecture: ARM Cortex-A9

The lecture includes an ARM Cortex-A9 single-core processor diagram labelled “one I created earlier.”

The diagram shows components including:

- dual-instruction decode stage;
- instruction prefetch stage;
- branch prediction;
- global history buffer;
- branch target address cache;
- return stack;
- register rename stage;
- virtual-to-physical register pool;
- branches;
- instruction queue and dispatch;
- out-of-order multi-issue with speculation;
- ALU/MUL;
- ALU;
- FPU/NEON;
- address unit;
- out-of-order writeback stage;
- load-store unit;
- store buffer;
- data cache;
- µTLB;
- MMU;
- program trace unit;
- PL310 L2 cache controller;
- bus interface unit.

**Connection:**  
This architecture example ties together concepts already introduced:

- superscalar decode;
- register renaming;
- branch prediction;
- out-of-order issue;
- speculation;
- memory system, TLB, MMU, caches.

---

## 24. Summary: why CPUs became out-of-order and superscalar

### 24.1 In-order pipeline limitations

#### Data hazards, especially RAW dependencies

RAW = Read-After-Write.

An instruction stalls the entire pipeline behind it while waiting for a result from a prior instruction.

This creates bubbles and wastes cycles.

#### Structural hazards

Instructions wait if required hardware resources are occupied.

Example resources:

- ALU;
- memory port.

#### Low resource utilisation and throughput

Stalls leave expensive execution units idle.

The theoretical maximum throughput is fundamentally limited to:

$$
1 \text{ instruction per cycle} = 1 \text{ IPC}
$$

### 24.2 Out-of-order superscalar benefits

#### Hides stall latency with dynamic scheduling

The processor looks ahead in an instruction buffer, such as an issue queue.

It finds independent ready instructions and executes them while dependent instructions wait.

#### Enables parallel execution

Multiple redundant execution units are provided:

- ALUs;
- FPUs;
- AGUs.

**[UNCLEAR]** AGU is named on the slide but not defined. It usually refers to Address Generation Unit; transcript needed if explained.

Dispatch logic issues multiple instructions simultaneously to these units.

#### Maximises utilisation and throughput

Combining:

- parallel hardware, i.e. superscalar execution;
- dynamic scheduling, i.e. OoO execution;

keeps units fed with ready-to-execute instructions.

This allows sustained:

$$
\text{IPC} > 1
$$

---

## 25. Branch speculation

### 25.1 Why branches are a problem

Even with OoO and superscalar execution, branches create a major problem.

The processor fetches, decodes, and issues multiple instructions quickly, but code branches, such as `if-then-else`, mean the CPU may not know which path to fetch next.

### 25.2 In-order solution

An in-order pipelined processor simply waits until the branch result is known before restarting or continuing the pipeline.

This is safe but slow.

### 25.3 Out-of-order speculative solution

An OoO processor speculates which path will be taken.

It continues fetching instructions from that predicted path.

Then:

- when the branch result is known, the CPU checks whether the prediction was right;
- if correct, results are committed;
- if wrong, uncommitted results are discarded.

### 25.4 Speculation and the ROB

The branch prediction slide diagram shows:

1. Instruction stream reaches a branch.
2. Branch predictor guesses, e.g. “history says taken.”
3. Speculative fetch follows the predicted path.
4. Branch unit computes the actual condition.
5. ROB comparison logic checks prediction against actual result.
6. If match: commit results.
7. If mismatch: discard/flush wrong-path results.

### Key concept — speculative execution

**Intuition:**  
The CPU guesses the future to avoid waiting. If the guess is right, time is saved. If wrong, architectural results are thrown away.

**Formal slide-level description:**  
The OoO processor speculates which path it thinks will be taken and continues fetching from that path; only when the branch result is known are results committed, and wrong-path uncommitted results are discarded.

---

## 26. Transient execution attacks

### 26.1 Core discovery

In 2017, it was found that although mis-speculated results are discarded, side effects were not.

The most critical side effect was a change in the CPU’s data cache.

Even if a speculative read was not committed, the cache could hold evidence of the speculated read.

An attacker can then use cache-timing side-channel mechanisms to recover information.

### 26.2 Architectural versus microarchitectural state

The slides imply an important distinction.

#### Architectural state

The official program-visible state, such as:

- committed registers;
- committed memory updates;
- control flow after retirement.

Wrong-path architectural state is discarded.

#### Microarchitectural state

Internal CPU implementation state, such as:

- cache contents;
- predictor state;
- buffers.

Wrong-path microarchitectural side effects may remain.

**[UNCLEAR]** The slide does not explicitly use “architectural state versus microarchitectural state” here, but later slides use “microarchitectural side effects.” Transcript may clarify how the lecturer framed this distinction.

### Key concept — transient execution attack

**Intuition:**  
Speculative work is supposed to disappear if it was wrong, but traces in caches or predictors can remain and leak secrets through timing.

**Formal slide-level description:**  
Mis-speculated results are discarded, but side effects, especially changes in CPU data cache content, are not necessarily discarded and can be exploited via cache-timing side channels.

---

## 27. Meltdown

### 27.1 Definition

**Meltdown**, CVE-2017-5754, exploits out-of-order execution to break isolation between user applications and the operating system kernel.

### 27.2 Kernel mapping design

On modern operating systems, a large portion of kernel memory was mapped into the page table of every user process.

Important distinction:

- CPU privilege checks prevent user code from accessing this memory.
- But the memory is still present in the virtual address space.

Meltdown leverages this design to steal protected memory values.

### 27.3 Meltdown three-step process

#### Step 1: Trigger, Ring 3 violation

An attacker in user space attempts to read a protected kernel address.

The CPU’s out-of-order engine immediately dispatches this instruction.

This creates a race between:

- the execution unit;
- the security permission check.

#### Step 2: Race and transmission, the “window”

Before the slower privilege check raises a fault, the CPU speculatively executes transient instructions.

The secret kernel byte is loaded and used as an index into a user-controlled probe array.

This specific access forces the corresponding memory page into the L1 data cache.

Pseudo-code form based on the slide diagram:

```asm
mov rax, [KERNEL_ADDR]        ; illegal read, secret goes to rax transiently
mov rbx, [PROBE + rax]        ; use secret as index into probe array
```

The key idea is:

$$
\text{Secret byte} = S
$$

$$
\text{Accessed cache line/page} = \text{probe\_array}[S]
$$

#### Step 3: Persistence and recovery, side channel

Eventually:

- the permission check fails;
- the pipeline is squashed;
- register results are discarded.

But:

- the L1 cache state is not reverted.

The attacker handles the exception and uses a **FLUSH+RELOAD** timing attack to identify which page in the probe array loads fastest.

The fastest page reveals the secret byte.

$$
\arg\min_i \ \text{reload\_time}(\text{probe\_array}[i]) = S
$$

### Key concept — Meltdown

**Intuition:**  
Meltdown exploits a timing window where the CPU transiently uses forbidden kernel data before the permission fault fully takes effect, leaving a cache trace that reveals the data.

**Formal slide-level definition:**  
Meltdown exploits out-of-order execution to break isolation between user applications and the OS kernel.

---

## 28. Meltdown mitigation: KPTI

### 28.1 Kernel Page Table Isolation

The primary software mitigation for Meltdown is **Kernel Page Table Isolation**, or **KPTI**.

KPTI removes most kernel memory mappings from user-space page tables entirely.

### 28.2 Why it works

If the kernel address is no longer valid in the user context, the initial speculative read cannot proceed in the same way.

### 28.3 Cost

KPTI comes at a performance cost because the OS must switch page tables during every system call.

### Key concept — KPTI

**Intuition:**  
Do not merely mark kernel memory inaccessible; remove most of it from the user page table so user-mode speculation cannot even translate it.

**Formal slide-level definition:**  
KPTI removes most kernel memory mappings from user-space page tables entirely.

---

## 29. Spectre

### 29.1 Definition

**Spectre** is a class of attacks that tricks a victim process into speculatively executing its own code in a way that leaks its secrets.

Unlike Meltdown, Spectre turns the victim’s own code against itself.

### 29.2 Spectre Variant 1: Bounds Check Bypass, CVE-2017-5753

Variant 1 targets conditional branches in victim code that perform bounds checks.

Example pattern:

```c
if (index < array_size) {
    value = array[index];
}
```

Attack sequence:

1. The attacker repeatedly calls the code with valid index values.
2. This trains the CPU branch predictor to expect the bounds check to pass.
3. The attacker then calls the code with a malicious out-of-bounds index.
4. The CPU follows the trained prediction and speculatively executes inside the `if` block before the bounds check completes.
5. This speculative execution performs an out-of-bounds read from victim memory.
6. The secret beyond the array is leaked through a cache side channel similar to Meltdown.

### Key concept — bounds check bypass

**Intuition:**  
The CPU is trained to expect “index is valid,” so it briefly behaves as if an invalid index were valid.

**Formal slide-level description:**  
Variant 1 targets conditional branches performing bounds checks, trains the predictor with valid indices, then uses an out-of-bounds index so speculative execution reads secret memory.

### 29.3 Spectre Variant 2: Branch Target Injection, CVE-2017-5715

Variant 2 targets **indirect branches**, where the target address is read from a register or memory.

Examples from the slide:

- object-oriented virtual function calls;
- switch statements.

Attack sequence:

1. The attacker poisons the Branch Target Buffer, or BTB.
2. They repeatedly execute an indirect branch in their own code that resolves to a chosen address.
3. Later, the victim executes an indirect branch.
4. The poisoned BTB causes the CPU to mispredict the target.
5. The CPU speculatively executes code at an attacker-chosen location.
6. That location is a **gadget** already present in victim code.
7. The gadget leaks victim data through a cache side channel.

### Key concept — gadget in Spectre Variant 2

**Intuition:**  
A gadget is a useful snippet of existing victim code that the attacker tricks the CPU into running transiently.

**Formal slide-level definition:**  
A gadget is a small useful sequence of instructions already present in the victim’s code, used to leak data through a cache side channel.

---

## 30. Mitigating Spectre

### 30.1 Why Spectre is harder than Meltdown

Mitigating Spectre is more complex because Spectre exploits fundamental branch prediction behaviour.

Meltdown could be mitigated by removing most kernel mappings from user page tables, but Spectre abuses ordinary speculative control flow inside victim programs.

### 30.2 Software mitigations

Software mitigations include:

- special fence instructions;
- retpolines.

These prevent or control speculation, but can have significant performance impacts.

**[UNCLEAR]** The slide names retpolines but does not define their mechanism. Transcript needed if explained.

### 30.3 Hardware mitigations

Later hardware mitigations include:

- **IBRS:** Indirect Branch Restricted Speculation.
- **IBPB:** Indirect Branch Predictor Barrier.

These provide mechanisms for the OS to:

- flush branch predictor state;
- constrain speculation during sensitive operations.

---

## 31. Speculation-safe microarchitectures

### 31.1 Goal

A speculation-safe microarchitecture is designed to prevent leakage of information through microarchitectural side effects of speculative execution.

The goal is to retain speculation’s performance benefits while eliminating security vulnerabilities.

### 31.2 Isolation of speculative state

Hardware can use temporary, non-architecturally visible buffers for speculative operations.

Example:

- speculative loads go into a private speculation buffer;
- or into a dedicated portion of the L1 cache that is not shared.

The buffer is merged with the main cache hierarchy only if speculation is confirmed correct.

If speculation is incorrect:

- the buffer is invalidated;
- no measurable side effect remains.

### 31.3 Delay of side-effect committal

The microarchitecture can defer state-changing side effects until a branch is fully resolved.

Speculative load results are held in internal buffers, such as the ROB.

They are not written into architecturally visible cache until speculation commits.

**[UNCLEAR]** The phrase “architecturally visible cache” appears conceptually tricky because caches are usually microarchitectural. The slide wording says results are not written to any architecturally visible cache. Transcript may clarify the exact intended model.

### 31.4 Selective speculation controls

The ISA can be extended to provide granular control over speculation.

Examples:

- **LFENCE** on x86;
- **CSDB** on ARM.

These act as speculation barriers.

When placed by a compiler or developer, hardware is prevented from executing subsequent instructions speculatively until all prior instructions are resolved.

### 31.5 Trade-off

Safety mechanisms usually incur a performance cost.

Costs arise from:

- isolating speculative state;
- adding barriers;
- delaying commits;
- reducing branch predictor and OoO engine efficiency.

The CPU design challenge is to build architectures that are safe by design while minimising performance overhead.

---

## 32. Transient and malicious faults

### 32.1 Types of faults

Faults can be:

- random environmental events;
- deliberately induced by an attacker.

### 32.2 Random transient errors

#### Single-Event Upsets, SEUs

High-energy particles, such as cosmic rays, strike the silicon die.

This can corrupt state, such as flipping a bit.

#### Electromagnetic Interference, EMI

Electrical noise from adjacent components or external sources.

#### Power and clock instability

Minor voltage droops or clock glitches can cause a logic gate to compute an incorrect value for a single cycle.

### 32.3 Maliciously induced faults: fault injection

Attackers deliberately create transient errors at precise moments, often to bypass critical security checks such as authentication.

Techniques include:

#### Voltage and clock glitching

Briefly manipulating the power or clock signal to induce a miscalculation.

#### Electromagnetic Fault Injection, EMFI

Using a targeted electromagnetic pulse to flip a bit.

The slide diagram shows an intended logic path:

```c
bool admin = false;

if (admin) {
    ...
}
// access denied
```

and a corrupted path:

```c
bool admin = true;

if (admin) {
    ...
}
// access granted
```

### Key concept — fault injection

**Intuition:**  
Instead of breaking the algorithm logically, the attacker physically disturbs the hardware so it computes the wrong result at the right moment.

**Formal slide-level description:**  
Fault injection deliberately creates a transient error at a precise moment to bypass a critical security check.

---

## 33. Protecting pipelines from transient errors: lock-step execution

### 33.1 Definition

**Lock-step execution** is a hardware fault-tolerance technique where two or more identical processors execute the exact same instruction stream in perfect clock-cycle synchrony.

Its purpose is not to increase performance.

Its purpose is to provide a robust, real-time method for:

- detecting hardware errors;
- ensuring computation integrity.

### 33.2 Redundancy and verification mechanism

The lock-step mechanism is a direct hardware implementation of redundancy and verification.

#### Duplication

The design uses two identical CPU cores:

- primary core;
- shadow core.

Both share the same inputs.

#### Synchronisation

Both cores are driven by the exact same clock signal.

They execute each instruction in the same cycle.

#### Parallel execution

Both cores execute the identical instruction stream in parallel.

#### Comparison

Outputs from both cores are continuously fed into a dedicated hardware comparator circuit.

Example outputs:

- memory addresses;
- data results.

#### Fault detection

The comparator checks for mismatches between the outputs of the two cores on every clock cycle.

If outputs differ, an error is signalled.

### Key concept — lock-step execution

**Intuition:**  
Run the same computation twice in hardware at the same time and compare the answers continuously.

**Formal slide-level definition:**  
Lock-step execution uses two or more identical processors executing the same instruction stream in perfect clock-cycle synchrony to detect errors.

---

## 34. Rowhammer

### 34.1 Definition

**Rowhammer** is a critical hardware vulnerability affecting modern Dynamic Random-Access Memory, or DRAM.

It is a physical side-channel attack, not a software bug.

Repeatedly and rapidly accessing a specific row of memory cells can cause unintended electrical disturbances that flip bits in adjacent physically separate rows.

### 34.2 Leaky abstraction

Rowhammer exploits a leaky abstraction.

The architectural model presents memory as:

- discrete;
- independent;
- reliable address locations.

The physical reality is different:

- DRAM cells are extremely dense;
- neighbouring cells can electrically affect each other;
- electromagnetic coupling and charge leakage can corrupt nearby rows.

### Key concept — leaky abstraction

**Intuition:**  
The clean model says “memory cells are independent,” but the physics says neighbouring cells can interfere.

**Formal slide-level description:**  
Rowhammer demonstrates a gap between the logical model of reliable memory and volatile physical reality.

### 34.3 Related Rowhammer variants named in the slide

#### Throwhammer

The first network-based remote Rowhammer attack using network cards and Remote Direct Memory Access, RDMA, channels.

#### GLitch

A technique using embedded GPUs to carry out Rowhammer attacks against Android devices.

#### Nethammer

A network-based remote Rowhammer technique that attacks systems using uncached memory or flush instructions while processing network requests.

---

## 35. Rowhammer attack mechanism

The attack is performed by malicious, unprivileged software.

### 35.1 Memory templating

The attacker allocates large amounts of memory to deduce the physical DRAM layout.

Goal:

- identify two **aggressor rows**;
- which sandwich a **victim row**.

### 35.2 Cache eviction

The attacker uses CPU instructions such as `CLFLUSH` on x86 to bypass CPU caches.

Purpose:

- ensure every memory read goes directly to DRAM hardware.

### 35.3 Hammering

The attacker runs a tight loop issuing thousands of read requests per second to the two aggressor rows.

This rapidly activates and deactivates the rows, causing electrical stress on the memory array.

### 35.4 Disturbance error

The electrical activity causes charge to leak from or into cells of the adjacent victim row.

Over a short time, leakage can corrupt a cell’s state.

A bit flip occurs:

$$
1 \rightarrow 0
$$

or

$$
0 \rightarrow 1
$$

### 35.5 Code pattern from the slide

The slide gives an assembly-like loop:

```asm
Loop:
    mov (X), %eax
    mov (Y), %ebx
    clflush (X)
    clflush (Y)
    mfence
    jmp loop
```

Meaning:

- read from aggressor row/address `X`;
- read from aggressor row/address `Y`;
- flush both from cache;
- use `mfence` to enforce ordering;
- repeat.

### Key concept — aggressor and victim rows

**Aggressor rows:** Rows repeatedly accessed by the attacker.  
**Victim row:** Physically adjacent row that suffers bit flips due to electrical disturbance.

---

## 36. Mitigating Rowhammer

### 36.1 Early proposed mitigation: ECC memory

Error-Correcting Code, ECC, memory can detect and correct single-bit errors.

Initial belief:

- server-grade ECC would solve Rowhammer.

But researchers demonstrated Rowhammer could cause multi-bit flips within a single memory word.

Standard ECC:

- cannot correct such multi-bit flips;
- in some cases cannot even detect them.

Therefore ECC is an unreliable Rowhammer defence.

### 36.2 Early proposed mitigation: increased refresh intervals

A brute-force software approach is to increase DRAM refresh frequency for the entire system.

This reduces bit flips by restoring cell charge more often.

But it has serious costs:

- performance penalties;
- power consumption penalties.

Therefore it is impractical as a general solution.

### 36.3 Dedicated mitigation: Target Row Refresh, TRR

The slide states that the first dedicated hardware mitigation implemented by chip vendors was **Target Row Refresh**, TRR, made available in 2016.

**[UNCLEAR]** The slide wording says “Wasn’t until 2016 the first dedicated hardware mitigation implemented by chip vendors was Target Row Refresh (TRR) was made available.” The sentence is grammatically garbled, but the intended point is that TRR became available as a vendor hardware mitigation around 2016.

---

## 37. Target Row Refresh, TRR

### 37.1 Definition

TRR is a hardware-based mitigation implemented within modern DRAM memory controllers.

Purpose:

- detect intense localised memory access patterns;
- counteract hammering;
- avoid the high performance and power cost of refreshing the entire memory module more frequently.

### 37.2 How TRR works

TRR monitors memory access traffic in real time.

It identifies potential Rowhammer attacks and issues extra targeted refresh commands to protect potential victim rows.

### 37.3 Detection

The memory controller tracks access rates to individual DRAM rows.

If certain aggressor rows are activated more frequently than a threshold, the controller flags the activity as potential Rowhammer.

### 37.4 Identification of victims

After detecting an aggressor row, the memory controller identifies physically adjacent victim rows.

These are most at risk of:

- electrical disturbance;
- charge loss.

### 37.5 Targeted refresh

The controller issues a special out-of-band refresh command to the victim rows.

This restores full charge to their cells, preventing accumulated leakage from causing bit flips.

### 37.6 Transparency

The process is handled autonomously by memory-controller hardware.

It is transparent to:

- CPU;
- operating system.

### Algorithm — TRR

```text
For DRAM row activations:
    monitor activation count per row

    if row R exceeds hammering threshold:
        mark R as aggressor

        identify adjacent victim rows V1, V2

        issue targeted refresh to V1 and V2

        continue monitoring
```

---

## 38. TRR limitations and TRRespass

### 38.1 TRR effectiveness depends on implementation

TRR is effective in principle, but real-world implementations can have vulnerabilities.

Security researchers demonstrated bypasses, notably **TRRespass**.

### 38.2 Limited tracking resources

The memory controller has a finite number of internal trackers for monitoring hot rows.

Researchers found they could overwhelm this tracking capacity by hammering many aggressor rows simultaneously from multiple CPU cores.

### 38.3 Bypass mechanism

When all trackers are occupied by other aggressor rows:

- the controller may fail to identify a new specific hammering pattern;
- it becomes effectively blinded;
- it does not issue the needed target row refresh command;
- bit flips can occur in the victim row.

### 38.4 Security lesson

TRR raises the bar for Rowhammer attacks, but its effectiveness depends on:

- implementation details;
- available memory-controller resources;
- hammering pattern complexity.

---

## 39. Rowhammer as an unsolved arms race

The slide describes Rowhammer as a continuing arms race.

### 39.1 Persistent problem

Despite a decade of research and multiple generations of attempted fixes, Rowhammer remains a fundamental and unresolved vulnerability rooted in high-density memory physics.

### 39.2 Newer standards

Newer standards such as:

- LPDDR5;
- DDR5;

include more sophisticated in-DRAM TRR and other mitigation logic.

However, researchers continue to find new and more complex hammering patterns that bypass latest defences.

### 39.3 No silver bullet

There is no single “silver bullet” solution.

The current approach is defence-in-depth:

- latest hardware mitigations;
- OS-level attempts to detect hammering;
- OS-level attempts to throttle hammering behaviour.

### 39.4 Bigger lesson

Rowhammer demonstrates a deep leaky abstraction between:

- the logical model of reliable memory;
- the volatile physical reality of DRAM.

---

## 40. The stack is just memory

### 40.1 Program memory layout

A program’s memory space is a structured address space managed by the OS.

The slide lists regions:

- text, executable code;
- data, initialized global variables;
- heap, dynamic memory;
- stack;
- uninitialized data, BSS, shown in the diagram.

### 40.2 Stack definition

The stack is a **LIFO**, Last-In First-Out, memory region for managing function execution.

It is controlled by a dedicated CPU register:

- **Stack Pointer**

The slide notes that typical pointers address heap or data sections, but the stack is controlled through this dedicated register.

### 40.3 Stack as control data

The stack is not just passive storage.

It contains integer values such as return addresses.

These return addresses actively define the high-level execution path of a program.

### Key concept — stack

**Intuition:**  
The stack stores function-call state, including where execution should go after a function returns.

**Formal slide-level definition:**  
The stack is a LIFO memory region for managing function execution, controlled by the Stack Pointer.

---

## 41. Return-Oriented Programming, ROP

### 41.1 Definition

**Return-Oriented Programming**, ROP, is an exploit technique used to execute arbitrary code despite defences such as Data Execution Prevention, DEP.

ROP does not inject new malicious code.

Instead, it chains existing code snippets already present in target memory.

These snippets are called **gadgets**.

### 41.2 W^X / DEP / NX

Modern operating systems implement:

- W^X, Write XOR Execute;
- DEP, Data Execution Prevention;
- NX, Non-Executable memory.

Policy:

$$
\text{Writable} \oplus \text{Executable}
$$

Memory pages are marked either writable or executable, but never both.

This stops classic stack-based buffer overflow attacks where an attacker writes malicious shellcode to the stack and executes it.

**[UNCLEAR]** The slide sentence ends “where an attacker writes” and appears cut off. The diagram shows malicious shellcode written to the stack and execution blocked by NX.

### 41.3 How ROP bypasses W^X

ROP circumvents W^X because it only uses code already located in executable memory regions, such as:

- the `.text` section of the binary;
- loaded libraries.

Since the attacker reuses executable code, DEP/NX does not block execution merely because the stack is non-executable.

### Key concept — ROP gadget

**Intuition:**  
A gadget is a tiny existing instruction sequence that does something useful and ends in `ret`.

**Formal slide-level definition:**  
A gadget is a sequence of instructions already present in executable memory that ends with a return instruction.

---

## 42. ROP mechanism

### 42.1 Initial vulnerability

The attacker first needs a vulnerability, typically a stack-based buffer overflow.

This allows overwriting saved return addresses on the stack.

### 42.2 Taking control of the stack pointer

The attack takes control of the program’s stack pointer, `rsp`, and creates a malicious call stack.

### 42.3 Finding gadgets

The attacker scans:

- the binary;
- loaded libraries such as `libc.so`;

for useful gadgets.

Each gadget:

- already exists in executable memory;
- performs a small operation;
- ends with `ret`.

### 42.4 Crafting the ROP chain

The attacker crafts a payload on the stack containing:

- a series of gadget addresses;
- interleaved data that those gadgets will operate on.

This forms the **ROP chain**.

### 42.5 Chained execution

Execution proceeds as follows:

1. The initial vulnerability redirects control flow to the first gadget.
2. The first gadget executes.
3. Its final `ret` pops the next value from the stack.
4. The attacker arranged that value to be the address of the second gadget.
5. Execution “returns” to the second gadget.
6. The second gadget executes and returns to the third.
7. This continues through the chain.

### 42.6 What ROP achieves

By chaining simple operations, the attacker can perform complex tasks, such as:

- loading values into registers;
- preparing function arguments;
- calling a library function.

The slide diagram gives example gadgets:

```asm
Gadget 1:
    pop eax
    ret

Gadget 2:
    pop ebx
    ret

Gadget 3:
    xor eax, eax
    ret
```

A malicious stack contains addresses such as:

```text
Address of Gadget 1
Address of Gadget 2
Address of Gadget 3
...
```

The `ret` instructions turn stack data into the next instruction pointer values.

**Key idea:**

$$
\text{RET}:\quad
\text{IP} \leftarrow [\text{SP}]
\quad
\text{SP} \leftarrow \text{SP} + \text{word size}
$$

So if the attacker controls stack memory, they can control the sequence of return targets.

---

## 43. Control-flow defences and mitigations

### 43.1 Address Space Layout Randomization, ASLR

ASLR randomizes base addresses of:

- stack;
- heap;
- loaded libraries;

each time a program runs.

If the attacker does not know gadget addresses, such as:

```asm
pop rdi; ret
```

or function addresses such as:

```c
system()
```

they cannot build a functional ROP chain.

ASLR can be bypassed using information leak vulnerabilities that disclose memory addresses.

### Key concept — ASLR

**Intuition:**  
Move code and data around each run so the attacker cannot reliably know where gadgets are.

**Formal slide-level definition:**  
ASLR randomizes base addresses of stack, heap, and loaded libraries each time a program runs.

### 43.2 Stack canaries

A stack canary is a random value placed on the stack between:

- local variables;
- saved frame pointer / return address.

A linear buffer overflow must overwrite the canary before reaching the return address.

Before a function returns, it checks the canary.

If modified:

- the program aborts;
- the ROP chain is prevented from executing.

### Key concept — stack canary

**Intuition:**  
A canary is a tripwire. If an overflow crosses it, the program notices before using the corrupted return address.

**Formal slide-level definition:**  
A random value placed between local variables and saved control data, checked before return.

### 43.3 Control-Flow Integrity, CFI, hardware

CFI hardware ensures that indirect branches and function returns only jump to valid predetermined locations.

Example valid location:

- start of a function.

Since gadgets are often in the middle of functions, CFI can detect and block jumps to them.

### 43.4 Connection to previous lecture

The slide says:

- Last week, ARM’s BTI mechanism was discussed.
- ARM’s BTI does not help secure legacy code that has no BTI instructions.

**Connection:**  
This explicitly links Lecture 2 to the previous lecture’s discussion of ARM Branch Target Identification.

---

## 44. Intel Shadow Stacks

### 44.1 Concept

The Intel Shadow Stack slide shows duplicate tracking of return addresses.

On a normal call:

- return address is pushed onto the normal stack;
- return address is also pushed onto the shadow stack.

On return:

- return address is popped from both stacks;
- the two return addresses are compared.

If they do not match:

- a control-flow protection exception occurs.

### 44.2 Properties from the slide

The shadow stack is:

- set up by OS/VMM;
- protected by new memory access control;
- different for each privilege level.

The slide also states:

- no parameters are passed on the shadow stack;
- it keeps the stack ABI intact;
- there are no changes to data stack layout.

### Key concept — shadow stack

**Intuition:**  
Keep a protected duplicate of return addresses so an attacker who corrupts the normal stack cannot silently change returns.

**Formal slide-level description:**  
A call pushes the return address on both stacks; return pops from both; mismatch causes a control-flow protection exception.

---

## 45. Intel and ARM control-flow integrity protections compared

The final comparison table covers four mechanisms:

1. Intel Shadow Stack, SS
2. Intel Indirect Branch Tracking, IBT
3. ARM Pointer Authentication, PAC
4. ARM Branch Target Identification, BTI

### 45.1 Intel Shadow Stack, SS

#### Protection focus

Backward-edge control flow:

- `RET`

#### Primary attack mitigated

Return-Oriented Programming, ROP.

#### Core mechanism

A duplicate hardware-protected stack stores a second copy of return addresses.

A mismatch on `RET` causes a fault.

#### Recompilation required?

No.

It can be enabled by the OS for legacy binaries because it hooks into existing `CALL`/`RET` instructions.

### 45.2 Intel Indirect Branch Tracking, IBT

#### Protection focus

Forward-edge control flow:

- indirect `JMP`;
- indirect `CALL`.

#### Primary attack mitigated

Jump/Call-Oriented Programming:

- JOP;
- COP.

#### Core mechanism

Indirect branches must land on a special `ENDBRANCH` instruction.

Landing elsewhere causes a fault.

#### Recompilation required?

Yes.

The compiler must insert `ENDBRANCH` instructions at every valid indirect branch target.

### 45.3 ARM Pointer Authentication, PAC

#### Protection focus

Backward-edge control flow:

- `RET`.

#### Primary attack mitigated

ROP.

#### Core mechanism

Cryptographically signs a pointer, such as a return address, before it is stored.

The signature is verified before use.

#### Recompilation required?

Yes.

The compiler must insert instructions to:

- sign pointers, PAC;
- authenticate them, AUT.

### 45.4 ARM Branch Target Identification, BTI

#### Protection focus

Forward-edge control flow:

- indirect `JMP`;
- indirect `CALL`.

#### Primary attack mitigated

JOP/COP.

#### Core mechanism

Indirect branches must land on a special BTI instruction.

BTI acts as a valid landing pad.

#### Recompilation required?

Yes.

The compiler must insert BTI instructions at valid branch targets.

### 45.5 Backward-edge versus forward-edge control flow

#### Backward-edge control flow

Function returns.

Typical attack:

- ROP.

Defences:

- Intel Shadow Stack;
- ARM PAC.

#### Forward-edge control flow

Indirect jumps and calls.

Typical attacks:

- JOP;
- COP.

Defences:

- Intel IBT;
- ARM BTI.

---

## 46. Overall lecture summary

### 46.1 Main architectural message

The von Neumann model of a computer is elegant and simple.

But the relationship between:

- Control Unit / CPU;
- Memory;

is complex.

### 46.2 Abstraction creates both power and risk

The lecture repeatedly shows that abstractions help systems work but can also break.

Examples:

- segmentation abstracts physical addresses but creates fragmentation and Unreal Mode issues;
- virtual memory abstracts physical layout but creates TLB/page-table complexity;
- out-of-order speculation improves performance but enables transient execution attacks;
- DRAM abstracts memory as independent cells but Rowhammer exposes physical coupling;
- stack memory supports structured calls but return addresses can be abused by ROP.

### 46.3 Complexity leads to more complexity

The slides state:

- abstraction layers lead to high complexity that can be broken;
- this leads to more complex abstractions;
- more complexity can create more bugs.

### 46.4 Secure execution depends on managing this complexity

The way computers manage and control CPU–memory complexity provides the foundational platform for secure and integral execution of software.

### 46.5 Product-selection warning

The final slide warns:

> Don’t just select a product based on the features exposed by the software.

Meaning: security properties depend on underlying architecture and hardware mechanisms, not just software-visible features.

---

## 47. Wrap-up and course logistics

The lecture ends with:

- a Canvas quiz covering the lecture;
- the quiz does not form part of the mark;
- it helps confirm understanding;
- students are in the second week of Lab 4;
- students should have set up emulation environments and started running sample code;
- next week will look outside the CPU at how the surrounding system can be protected.

**Exam/revision flag:** No explicit “this will be on the exam” statement appears in the slides. The Canvas quiz covers the lecture and is useful for checking understanding, but the slide says it does **not** form part of the mark.

---

## 48. Consolidated key concepts

### Memory protection

Hardware and architectural mechanisms that prevent code from accessing memory it should not access.

In this lecture, memory protection appears through:

- rings;
- segmentation;
- page tables;
- MMUs;
- MPUs/PMPs;
- W^X;
- control-flow protections.

### Protection rings

Privilege levels controlling what code may do.

Ring 0 is kernel-level; Ring 3 is user-level.

### Segmentation

A memory scheme where addresses are interpreted as:

$$
(\text{Segment Selector}, \text{Offset})
$$

The selector indexes a descriptor table, and the descriptor gives base, limit, permissions, and privilege level.

### Virtual memory

A scheme giving each process a private, linear virtual address space independent of physical memory layout.

### MMU

CPU-integrated hardware that translates virtual addresses to physical addresses and enforces page permissions.

### Page table

OS-managed structure storing mappings from virtual pages to physical frames, plus protection bits.

### TLB

A high-speed cache of recent address translations.

### MPU/PMP

Physical-address protection hardware for region-based access control without address translation.

### Superscalar execution

A CPU design where multiple instructions can be fetched, decoded, and issued in parallel.

### Out-of-order execution

A CPU design where ready instructions can execute before earlier stalled instructions, while results commit in original program order.

### Speculative execution

Execution along a predicted path before it is known to be correct.

### Transient execution attack

An attack exploiting temporary speculative execution whose architectural results are discarded but whose microarchitectural side effects remain.

### Meltdown

A transient execution attack using out-of-order execution to leak kernel memory mapped into user page tables.

### Spectre

A class of attacks that mistrain branch prediction so victim code speculatively leaks its own secrets.

### Rowhammer

A DRAM physical vulnerability where repeatedly accessing aggressor rows causes bit flips in adjacent victim rows.

### TRR

Target Row Refresh, a hardware mitigation that monitors hot rows and refreshes adjacent victim rows.

### ROP

Return-Oriented Programming, an exploit technique chaining existing executable gadgets ending in `ret`.

### Shadow stack

A protected duplicate stack of return addresses used to detect tampering with normal stack return addresses.

---

## 49. Unclear / transcript-needed sections

- **[UNCLEAR]** Transcript was not provided, so spoken details and exam emphasis are missing.
- **[UNCLEAR]** The slides mix “linear” and “physical” wording during early segmentation; transcript may clarify the intended distinction.
- **[UNCLEAR]** Unreal Mode slide mentions a 4 GB address space despite the earlier 80286 slide saying Protected Mode had 16 MB; likely later x86 context, but the transcript is needed.
- **[UNCLEAR]** i386 slide says the OS-generated process ID is used as an index into translation; diagram shows CR3 loaded with the page directory address. Transcript may clarify the exact wording.
- **[UNCLEAR]** Copy-on-write is named but not explained.
- **[UNCLEAR]** NAPOT mode is named but not defined.
- **[UNCLEAR]** CWE-1260 is cited but not explained.
- **[UNCLEAR]** Retpolines are named but not explained.
- **[UNCLEAR]** The ROP slide has a cut-off phrase about classic stack-based buffer overflow attacks.
- **[UNCLEAR]** The speculation-safe microarchitecture slide uses “architecturally visible cache,” which may need clarification from the spoken explanation.
