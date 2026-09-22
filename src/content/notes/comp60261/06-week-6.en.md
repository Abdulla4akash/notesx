---
subject: COMP60261
chapter: 6
title: "Week 6"
language: en
---

# COMP60261 — Week 6: Virtualisation

**Scope:** what virtualisation is and why it exists; the Popek & Goldberg theory worked through a simplified CPU model; hardware support for CPU and memory virtualisation on x86-64; I/O virtualisation from full emulation to SR-IOV; and lightweight virtualisation with containers and unikernels.

**Covers lectures:** 27 Virtualisation Introduction · 28 The Theory of Virtualisation · 29 CPU and Memory Virtualisation · 30 I/O Virtualisation · 31 Lightweight Virtualisation

**The fundamental challenge, stated up front:**

> An OS expects to run **alone, with full privileges**, on a physical machine — i.e. to have **total control over that machine's hardware**. So how can two OSes cohabit on the same host?

Every mechanism in this week is an answer to that one question.

---

# Part 1 — Introduction (Lecture 27)

## 1.1 Two definitions

**The quick definition:** virtualisation technologies are the set of software and hardware components that allow **running multiple operating systems at the same time on the same physical machine**.

**The precise definition** (Bugnion et al.):

> Virtualisation is the **abstraction at a widely-used interface** of one or several components of a computer system, whereby the created virtual resource is **identical** to the virtualised component and **cannot be bypassed** by its clients.

Applied to a VM, the three clauses map exactly onto the three hypervisor goals:

| Clause | Meaning for a VM |
|---|---|
| **Abstraction at a widely-used interface** | The interface is software (OS) ⇔ hardware |
| **Identical** | Present virtual hardware able to run **unmodified** existing OSes → **equivalence** |
| **Cannot be bypassed** | Guest OSes cannot escape the abstraction → **safety** |

> **Exam flag.** The definition generalises beyond VMs — **virtual memory, scheduling and storage solutions** are all virtualisation under it. Being able to say *why* (each abstracts a widely-used interface into something identical and unbypassable) is a good way to show you understand the definition rather than having memorised it.

## 1.2 The three principles

Virtualisation in general is achieved by combining:

- **Multiplexing** — one physical resource presented as several virtual ones
- **Aggregation** — several physical resources presented as one
- **Emulation** — presenting a resource that differs from what is physically there

## 1.3 History

- **1960s — IBM.** The **System/360 (S/360)** project produced a *family* of computers of different sizes built on the **same architecture**, so a client could buy a small model for prototyping and a larger one later. Clients then wanted to move software from several small models onto a single large one — **consolidation**.
- **14 models sold 1965–1978; model 67 (1966) introduced a virtualisable ISA** — the physical machine could appear as multiple, less powerful versions of itself: **virtual machines**.
- **1974 — Popek & Goldberg**, *Formal Requirements for Virtualisable Third Generation Architectures*.
- **1990s — Disco**, a hypervisor from Stanford; became the first version of VMware.
- **2000s — Xen, KVM, VirtualBox, Hyper-V.**

## 1.4 Use cases

**Consolidation** — creating X virtual machines from X physical ones and running them on Y hosts, Y < X. **The historical motivation** for developing virtualisation. Gives most of the benefits of multi-computer systems (separate software dependencies, reliability, security) **without the management costs**.

**Software development** — flexible **OS diversity** on one machine; **rapid, cost-efficient provisioning** (far faster than ordering physical machines); and VMs are **self-contained**, so they package an application with all its dependencies — OS model and version, libraries — useful for development, automated testing and deployment.

**Checkpoint/restart and live migration** — because a running VM's state is **easily identifiable**, it can be dumped to disk and resumed later (useful for long-running jobs), or **live-migrated** transparently between hosts to free machines for maintenance, save power, balance load, or evacuate ahead of an expected fault. **Both are straightforward for a VM, as opposed to a process.**

**Hardware emulation** — for development and backward compatibility.

**Cloud computing** — virtualisation is what *enables* cloud, letting providers **securely** share infrastructure between tenants. The cloud principle is offloading local tasks to remote resources: renting VMs for a web server (**IaaS**), deploying an app on a platform (**PaaS**), or using a hosted service such as webmail (**SaaS**).

**Security** — virtualisation provides **very strong isolation between guests**:
- **Sandboxing** — cloud, virus/malware analysis, honeypots, and process/task-level isolation via virtualisation (e.g. **QubesOS**).
- **VM introspection** — analysing guest behaviour **from a privileged level higher than the OS's**, because the guest OS cannot be trusted (e.g. **LibVMI**).

## 1.5 System-level VMs and the hypervisor's three goals

A **system-level virtual machine** creates a model of the **hardware** for a (mostly) unmodified OS to run on. Each VM has **its own copy** of the virtualised hardware.

A **hypervisor** (or **VMM**) creates a VM of the **same architecture as the host**, jointly aiming at:

1. **Equivalence** — must run **unmodified** guest OSes and applications.
2. **Safety** — VMs **cannot escape** the isolation enforced by the hypervisor.
3. **Performance** — VMs must run with **close to native** performance.

**How all three are achieved at once: direct execution.**

- VM code executes **directly on the physical CPU**, at a **lower privilege level than the hypervisor** — this is the fast path.
- **Only** the instructions that would let the VM escape the VMM's control (e.g. installing a new page table) are **emulated safely** by the VMM — the slow path.
- This is achieved **without modifying the guest**, by **trapping to the VMM** on such instructions.

> **Exam flag — high value.** Direct execution is the mechanism that makes "performance" compatible with "safety". It is also exactly what the Popek & Goldberg theorem is about: the theorem states the condition under which *trapping on exactly the dangerous instructions* is possible.

## 1.6 Type I versus Type II

The distinguishing question the lecture raises is **who does resource allocation and scheduling**:

- **Type I** — done by **the hypervisor**.
- **Type II** — **more involvement from the host OS**.

> **Exam flag — note this unit's classification.** This unit calls **KVM a Type 2 hypervisor** (Lecture 29), on the grounds that it is a module inside a general-purpose host OS which does the resource allocation and scheduling, with a userspace program (Qemu) managing the VM. Other sources call KVM a hybrid or Type 1; **follow the unit's classification** in an exam here.

## 1.7 Memory denomination

Virtualisation adds **another level of translation**, handled by the hypervisor:

$$\text{(guest) virtual} \;\rightarrow\; \text{(guest) pseudo-physical} \;\rightarrow\; \text{(host) physical}$$

Note the unit's term: **pseudo-physical** — what the guest *believes* is physical memory, but which is itself virtual. Using this term correctly signals that you understand the guest is being deceived.

---

# Part 2 — The theory of virtualisation (Lecture 28)

## 2.1 Why the paper matters

Published in 1974 in *Communications of the ACM*. Its **original purpose was to show that some contemporary architectures were *not* virtualisable**, with the DEC PDP-10 as case study. To do so it:

- described the **criteria for a proper VMM** — safety, efficiency, equivalence;
- defined the corresponding **requirements for an ISA to be virtualisable** (i.e. for a VMM meeting those criteria to be constructible on it).

It attracted little attention at the time, because virtualisation was unpopular in the 1970s. Then VMs became popular at the **end of the 1990s** — and **x86-32, the most popular ISA of the day, was not virtualisable**. In the 2000s, **AMD and Intel explicitly designed AMD-V and Intel VT-x for x86-64 to meet the paper's criteria**.

## 2.2 The simplified CPU model

The paper's model is deliberately simple but still representative.

**Memory and addressing**
- One processor core with **2 execution modes**: user and supervisor.
- **Physical memory** contiguous, starting at `0`, of size `SZ`.
- **Virtual memory via segmentation** (no paging): a **single segment** with **Base `B`** and **Limit `L`**, mapping virtual range `[0, L[` onto physical range `[B, B+L[`.

**CPU state — the Processor Status Word (PSW)**

$$\text{PSW} = (M,\; B,\; L,\; PC)$$

| Field | Meaning |
|---|---|
| `M` | execution level ∈ {`s`, `u`} — supervisor or user |
| `B`, `L` | segment register: physical base address, and length |
| `PC` | program counter — **virtual** address of the instruction being executed |

**Trap machinery**
- Hardware support for **saving the PSW into `MEM[0]`** and **loading a new PSW from `MEM[1]`** — this is the act of entering the OS on a **trap**.
- Hardware support for **loading the PSW from a memory location** — exiting the OS after handling the trap.
- **Traps** = hardware interrupts and exceptions (**including syscalls**).

## 2.3 How an OS runs on this model *without* a hypervisor

1. Kernel runs with `M = s`; applications run with `M = u`.
2. At initialisation the kernel **sets the trap entry point**:
   `MEM[1] ← (M:s, B:0, L:SZ, PC:trap_entry_point)`
   — note `B:0, L:SZ` gives the kernel access to **all** physical memory.
3. The kernel allocates a **contiguous, non-overlapping** physical range `(B, L)` for each application.
4. It launches/resumes an application by loading `PSW ← (M:u, B:B, L:L, PC:PC)`.
5. At the trap entry point the kernel **decodes the instruction at `MEM[0].PC`**, determines the cause of the trap, and acts.

> Worth pausing on step 2: the entire protection story on this machine is that the kernel's saved PSW grants full memory access while applications' PSWs do not — and only a trap can install the kernel's PSW.

## 2.4 The research question and the three requirements

**The question:** given a computer defined by this model, under what conditions can a hypervisor be constructed that

- can execute **one or more VMs**;
- supports **arbitrary, unmodified, and *potentially malicious*** guest OSes designed for the same architecture;
- is in **complete control of the hardware at all times**;
- is **efficient**, showing at worst a small performance decrease versus non-virtualised execution?

**The three requirements:**

1. **Safety** — the VMM is in complete control of the hardware at all times; **no assumptions are made about guests, which may be malicious**; the VMM must enforce isolation between a VM and the VMM/hardware, **and between VMs themselves (no shared state)**.
2. **Equivalence** — a VM is a **duplicate of the underlying physical machine**; guest OS and applications behave **the same** natively and in a VM, and run **unmodified**.
3. **Performance** — minimal decrease in execution speed.

## 2.5 The central design idea

- **Run the hypervisor in supervisor mode**, and
- **run guest applications *and the guest OS* in user mode.**

Everything else follows. The guest OS believes it is privileged but is not — so any privileged action it attempts must trap, letting the VMM emulate it safely.

## 2.6 Instruction classification

**Sensitive instructions**, in two sub-kinds:

- **Control sensitive** — **updates the system state**.
  *Examples:* instructions modifying the PSW in this model; `LGDT` on x86-32 (loads the descriptor table).
- **Behaviour sensitive** — **semantics depends on the value of the system state** (e.g. the privilege level).
  *Example:* **`POPF`** loads the status register from the stack; it works in supervisor mode but **fails silently in user mode**.

**Innocuous instructions** — everything not sensitive.

**Privileged instructions** — can only execute in supervisor mode and **trap** when executed in user mode. *Example:* `HLT` on x86-32.

> **Exam flag.** **Being privileged is independent of being sensitive.** They are two separate classifications of the same instruction set, and the theorem is precisely a statement about how the two sets relate. Answers that conflate them cannot state the theorem correctly.

## 2.7 The theorem

> **For a given ISA, a VMM may be constructed if the set of sensitive instructions for that ISA is a subset of the set of privileged instructions:**
>
> $$\{\text{control-sensitive}\} \cup \{\text{behaviour-sensitive}\} \subseteq \{\text{privileged}\}$$

In words: **every instruction that modifies system state, or whose behaviour depends on system state, must trap when executed in user mode.**

**The converse holds too** — if the criterion is not met, a VMM **cannot** be constructed for that architecture. And the two failure directions map onto two different broken requirements:

| If this doesn't trap… | Consequence | Requirement lost |
|---|---|---|
| A **control-sensitive** instruction | Any guest can modify system state without VMM supervision — e.g. a guest OS **installing an arbitrary page table** | **Safety** |
| A **behaviour-sensitive** instruction | The guest OS, running in user mode, sees **user-level semantics** where it expects supervisor-level | **Equivalence** |

> **Exam flag — high value.** Being able to attribute *which* requirement each violation breaks is what distinguishes a full answer. Control-sensitive → safety; behaviour-sensitive → equivalence.

## 2.8 Hypervisor operation on the model

Under the theorem's conditions the VMM operates as follows.

**Setup**
- The VMM runs in supervisor mode; the guest (OS **and** applications) runs in user mode.
- The VMM allocates **contiguous physical memory for itself**, never accessible by guests.
- It allocates **contiguous physical memory per VM**, each defined by `addr0` and `memsize`.
- For each VM it keeps a software model of the CPU state the VM *thinks* it has: the **`vPSW` = (M, B, L, PC)**, where **`M` is the mode the VM believes it is in** — `s` while the guest OS runs, `u` while a guest app runs.

**Starting/resuming a VM** — the VMM loads the real PSW:

$$M' \leftarrow u \qquad B' \leftarrow \texttt{addr0} + \text{vPSW}.B \qquad L' \leftarrow \text{vPSW}.L \qquad PC' \leftarrow \text{vPSW}.PC$$

The real mode is **always `u`**, whatever the guest believes. Addresses from the `vPSW` are **checked** before being loaded, so nothing outside the VM's allocation can be mapped.

**On a trap**
1. The VMM updates `vPSW.PC ← PSW.PC`.
2. It inspects the trapping instruction and **emulates its semantics according to the ISA** — with actions depending on whether the guest trapped from **kernel** or **user** space.

**Case A — the guest OS caused the trap (`vPSW.M == s`):** a sensitive instruction trapped, and the VMM handles it. For example, if the guest OS tries to update the segment register, the VMM **checks and updates `vPSW.B` and `vPSW.L`**; on return, the hardware registers are set to `PSW.B ← addr0 + vPSW.B` and `PSW.L ← vPSW.L`.

> **The MMU is transparently configured differently from what the guest OS requested** — and the guest cannot tell. That single sentence is the essence of virtualisation.

The VMM then advances `vPSW.PC++` so the VM resumes at the next instruction, and reloads the PSW.

**Case B — a guest application caused the trap (`vPSW.M == u`):** the application is making a syscall or doing something illegal, so **the guest OS should handle it**. The VMM emulates what the hardware would have done natively, but *within* the VM's memory:

1. `MEM[addr0] ← vPSW` — save the guest application's state at the **host-physical location of guest-physical `MEM[0]`**.
2. `vPSW ← MEM[addr0 + 1]` — load the guest OS state (its trap entry point) from the guest's equivalent of `MEM[1]`, **after checking the validity of `B` and `L`**.
3. Load the real PSW to resume the VM, now running its kernel.

> **Exam flag.** Notice the elegance: the VMM reproduces the model's own trap mechanism (§2.2) one level up, using `addr0` to relocate the guest's `MEM[0]`/`MEM[1]` into host physical memory. Every guest-physical address becomes `addr0 + guest address`, checked against `memsize`. If asked to "describe hypervisor operation", this two-case structure is the answer.

**Two further consequences**

- Because **all control-sensitive instructions trap**, each can be **checked** (giving **safety**) and **emulated** (giving **equivalence**). This includes every instruction updating the virtual-to-physical mapping.
- **User/supervisor transition instructions (e.g. syscalls) must be tracked** by the VMM so it can keep `vPSW.M` correct — otherwise it cannot tell whether a later trap came from the guest OS or a guest app, and so cannot emulate correctly. Such transition instructions **are sensitive**, so tracking them is possible.
- **Behaviour-sensitive instructions also trap** — e.g. reading `PSW.M` or `PSW.B`. Since the real values differ from what the guest believes, the VMM must return the **emulated** values, or programs would behave differently virtualised versus bare-metal — again **equivalence**.

## 2.9 Violations and workarounds

Many ISAs proposed between the 1970s and 2000s violated the theorem. The canonical case: on **x86-32**, **`POPF` is behaviour-sensitive but does not trap in user mode — it fails silently.**

Two workarounds, each sacrificing a different requirement:

| Technique | How | What it breaks |
|---|---|---|
| **More emulation** | Run the entire guest OS, or every page table access, under emulation | **Performance** — very slow |
| **Paravirtualisation** (Xen) | **Modify the guest OS** to handle the ISA's limitations | **Equivalence** |

> **Exam flag.** The lecturer's summarising observation is worth carrying: **you can compromise on performance or on equivalence — but never on safety.** That asymmetry explains the whole design history that follows.

---

# Part 3 — CPU and memory virtualisation on x86-64 (Lecture 29)

## 3.1 The three technologies

x86-32 was not virtualisable, forcing concessions on **performance** (dynamic binary translation) or **equivalence** (paravirtualisation). A **fundamental design goal of x86-64 was architectural support for virtualisation**, delivered by three technologies:

| Technology | Virtualises |
|---|---|
| **VT-x** (Virtualisation Technology) | **CPU** |
| **EPT** (Extended Page Tables) | **Memory** |
| **VT-d** (Virtualisation Technology for Directed I/O) | **I/O** |

(AMD has closely equivalent technologies.)

## 3.2 Why software virtualisation of x86-32 was hard

- **Protection ring aliasing and compression** — the guest OS runs in **ring 3** when it was designed for **ring 0**.
- **Address space compression** — the hypervisor must be **located somewhere** in the address space **and protected**.
- **Performance impact of guest–host transitions** — some sensitive instructions are **very frequent**, e.g. system calls.

## 3.3 VT-x

**The key design idea:** rather than fixing each problematic aspect of x86 separately — e.g. changing the semantics of individual instructions such as `POPF`, which would break backward compatibility — VT-x **duplicates the entire state of the CPU** into **two modes of execution**:

- **Root mode** — hypervisor and host OS.
- **Non-root mode** — VMs.

Properties:

- At any point the CPU is **either** root or non-root.
- **Protection rings are orthogonal** to root mode and available in **both** — so a guest OS runs in **non-root ring 0**, exactly the privilege level it was designed for. This eliminates ring aliasing outright.
- **Each mode has its own address space**, switched **atomically** as part of the transition — **including TLB content**.

**Against the P&G criteria:**

- **Equivalence** — absolute architectural compatibility between virtual and actual hardware, and backwards compatibility with legacy x86-32 and x86-64.
- **Safety** — with architectural support the hypervisor codebase is **much simpler**, giving a **reduced attack surface** versus DBT/paravirtualisation solutions that must maintain complex invariants.
- **Performance** — **not a primary goal at first: the first generation of VT-x CPUs were *slower* than state-of-the-art dynamic binary translation.**

> **Exam flag.** That last point is counter-intuitive and therefore examinable. Hardware support first bought **simplicity and safety**; performance came later. The simpler-codebase-means-smaller-attack-surface argument is also a nice link back to Weeks 4–5.

## 3.4 The theorem, restated for root/non-root

> When executed in non-root mode, all sensitive instructions must either
> 1. **cause a trap**, or
> 2. be **implemented by the CPU and operate on the non-root duplicate of the CPU state**.

Option 2 is the new possibility hardware provides. Having *every* sensitive instruction trap would satisfy equivalence and safety — **but frequent guest ⇔ VMM transitions must be avoided for performance**, since **these transitions cost thousands of cycles**. So some sensitive instructions are implemented in hardware instead.

**The resulting trade-off: hardware complexity versus performance.**

## 3.5 Transitions and the VMCS

- The VMM **starts or resumes** a VM with **`VMLAUNCH`** and **`VMRESUME`**.
- Transitions from VM to hypervisor are **vmexits**, and may be **involuntary** (traps) or **voluntary** (**`VMCALL`** — a **hypercall**, the hypervisor equivalent of a system call).
- VM state lives in the **VMCS (VM Control Structure)**, accessed with **`VMREAD`/`VMWRITE`**.

**Vmexit categories:**

| Category | Cause |
|---|---|
| **Exception** | Guest instruction caused an exception (e.g. divide by zero) |
| **Interrupt** | Interrupt from an I/O device during guest execution |
| **Triple fault** | Guest triple faulted |
| **Root-mode sensitive** | x86 privileged/sensitive instructions |
| **Hypercall** | Explicit call to the hypervisor via `VMCALL` |
| **I/O** | x86 I/O instructions, e.g. `IN`/`OUT` |
| **EPT** | Memory virtualisation violations/misconfigurations |
| **Legacy emulation** | Instruction not implemented in non-root mode |
| **VT-x new** | ISA extensions controlling non-root execution (`VMRESUME`, …) |

## 3.6 KVM

- A **Type 2 hypervisor** built from the ground up **assuming hardware support** for virtualisation.
- A **module part of the Linux kernel**, letting a host **userspace program** create and manage VMs.
- **Generally used with Qemu** to emulate I/O devices.
- **Arguably the most popular hypervisor in the world.**

**The split:** KVM lives in kernel space and handles traps and the VMCS. It relies on a userspace program — usually **Qemu** — for the rest of VM management, particularly **resource allocation**. Qemu is originally a machine *emulator*, but **CPU and memory emulation are disabled when running on KVM**, because VT-x and EPT handle them — which is what makes the combination fast.

## 3.7 Memory virtualisation: before EPT

With VT-x but no hardware MMU virtualisation:

- **Disjoint page tables for root and non-root mode** (via `%cr3`). Equivalence benefit: **no need to locate the hypervisor inside the guest address space** and protect it with segmentation.
- But **guest page table updates still had to be validated and controlled by the VMM** — **shadow paging**.

**The result was severe:** shadow paging accounted for **over 90% of vmexits**, making **VT-x slower than software virtualisation**. The alternative, paravirtualisation, cost equivalence.

## 3.8 Extended Page Tables

- The **guest OS maintains its page tables normally** — one per guest process, mapping **guest virtual → guest pseudo-physical** — and can update them **freely, without trapping**.
- A **second level, the EPT, is maintained by the hypervisor** — **one per VM**, mapping **guest pseudo-physical → host physical**. Because the hypervisor fully controls the EPT, it can guarantee a guest only maps memory it is allowed.

**Performance:**

- The **TLB caches the guest-virtual → host-physical translation directly**, so a **hit gives native performance**.
- **TLB hit rate in modern CPUs is > 95%**, so the two-level walk is avoided for the vast majority of accesses.
- A **TLB miss requires a 2D page walk**, through the guest page table *and* the VM's EPT.

**The cost of a 2D walk:** each of the guest's four page-table levels holds a **guest pseudo-physical** address, which must itself be translated through the EPT before it can be followed. Counting the EPT walks plus the final data translation gives:

> **24 memory accesses, versus 4 for a standard page table walk.**

> **Exam flag — the key numbers.** **24 vs 4**, mitigated by a **>95% TLB hit rate**. Quote both together: the walk is brutally expensive, and it almost never happens. Stating one without the other misrepresents the design.

## 3.9 Memory virtualisation in KVM, concretely

The arrangement is worth being able to describe, because it demystifies where guest memory actually lives:

1. The **guest manages its own page tables**, one per guest process, with minimal KVM intervention.
2. **Qemu runs in host userspace as an ordinary process**, with its own virtual address space.
3. Qemu makes **one large `malloc`**, allocating a big contiguous buffer that **becomes the guest's pseudo-physical memory**.
4. The **KVM module in the host kernel** sets up and manages the **EPT**, mapping guest pseudo-physical addresses onto host physical memory.
5. When Qemu itself needs to read or write VM memory — e.g. for I/O virtualisation — it simply **reads and writes that buffer**, translated by Qemu's own page table like any other host process.

> **Exam flag.** "Guest physical memory is just a `malloc` in a userspace process" is a genuinely clarifying fact, and it explains how Qemu can implement DMA emulation trivially (§4.4).

---

# Part 4 — I/O virtualisation (Lecture 30)

## 4.1 I/O interposition and its benefits

As with CPU and memory, **software methods predate hardware support**. In **I/O interposition** the hypervisor creates a **software model of a virtual device** that the guest OS drives with an ordinary driver, as if it were physical; the hypervisor connects that virtual device to the real host devices.

**Benefits:**

- **I/O device consolidation** — map **multiple virtual devices onto a smaller set of physical ones**, letting several VMs share one or a few devices. Increases utilisation and efficiency, reduces cost.
- **Aggregation** — combine several physical devices into a single virtual one, e.g. for performance.
- **The hypervisor can capture the entire state of the device** — enabling VM **suspend/resume** and **migration, including between hosts with different physical devices**.
- **Add features the physical device does not support** — disk snapshots, compression, and so on.

## 4.2 Physical I/O: the three mechanisms

| Mechanism | Direction | Carries | Typical use |
|---|---|---|---|
| **Port-based / Memory-mapped I/O (PIO/MMIO)** | CPU → device | Small, register-sized | Discover and **control** devices |
| **Interrupts** | device → CPU | **No data** — notification only | Signal completion or events |
| **DMA** | bidirectional | Large data | Bulk transfer; CPU starts it and is notified on completion |

## 4.3 Ring buffers

Bulk transfer uses a **ring buffer** — a **producer–consumer circular buffer** in memory for streaming communication, **described in the device's registers, which the CPU sets up using MMIO/PIO** (base address, length, head and tail pointers).

For a CPU → device transfer: the **device consumes from `head`** and updates that pointer; the **CPU produces at `tail`** and updates that one.

**Synchronisation** between the two: **MMIO for CPU → device** (e.g. initialise the device, start a DMA transfer), and **interrupts for device → CPU** (e.g. signal the end of a DMA transfer).

## 4.4 Full device emulation

The OS ⇔ device interface is essentially simple — the OS discovers and controls devices with MMIO/PIO, and devices respond with interrupts and DMA — so the hypervisor can **emulate a device completely**:

- **Ensure every MMIO/PIO operation traps.** PIO is performed through **sensitive instructions**, so it traps naturally; **MMIO memory is mapped read-only or not mapped**, so accesses fault.
- **Inject interrupts into the guest**, by calling the handlers the guest registered in a **virtual interrupt controller**.
- **Read and write guest physical memory to emulate DMA** — trivial for Qemu, since that memory is its own buffer (§3.9).

**The Qemu/KVM threading model:**

- **One thread per vCPU** (virtual core).
- **One thread per virtual device.**
- **Device threads handle most I/O operations asynchronously.**

The flow: a vCPU initiates MMIO with the virtual device → traps to the hypervisor → treatment is **deferred to the device thread** → the guest **resumes** while the transfer proceeds → the hypervisor **injects an interrupt** when it completes. **This mimics exactly what happens with a real device** — which is what makes the emulation transparent.

**A concrete emulated device.** Running `lspci` inside a Qemu/KVM VM shows both approaches side by side — an **Intel 82540EM Gigabit Ethernet Controller** (fully emulated) and a **Virtio network device** (paravirtualised).

The 82540EM is chosen because it is **very old but widespread, so any modern OS has the driver** (`e1000`). Its registers are mapped at a physical base address, and each register sits at a documented offset — for example the **Interrupt Cause Read (`ICR`)** register at offset `0xC0`, so with a base of `0xfebc0000` the CPU reads physical address:

$$\texttt{0xfebc0000} + \texttt{0xc0} = \texttt{0xfebc00c0}$$

Others include the receive ring's base address, length, head and tail (`RDBAH`, `RDLEN`, `RDH`, `RDT`) and the transmit ring's base (`TDBAH`). **Every interaction with these registers traps to KVM and then to Qemu**, which reproduces the real NIC's documented behaviour in software — in under two thousand lines of code.

## 4.5 I/O paravirtualisation

**The problem:** most hardware devices were **not designed with virtualisation in mind**. Sending or receiving **a single Ethernet frame** with an e1000 involves **multiple register accesses — i.e. several costly vmexits.**

**The response:** virtual devices designed **specifically to minimise overhead**, corresponding to no real physical device — at the cost of **installing PV drivers in the guest**, i.e. modifying the guest OS.

**virtio** is the standard framework for Qemu/KVM:

- virtual **PCIe** devices, discovered normally at startup;
- an **optimised ring buffer implementation minimising vmexits**;
- available for **network, disk (blk, scsi) and console** — and also for functionality with **no real-device counterpart**, such as **memory hotplug** and **filesystem sharing** with the host.

Because virtio is so widely used, drivers ship in Linux already.

## 4.6 Hardware support: direct assignment, IOMMU, SR-IOV

**Direct device assignment (PCI passthrough)** gives a VM **full and exclusive access to a device**, bypassing the hypervisor for **native performance**. It has **two fundamental issues**:

- **Security** — the VM controls the device, and the device **can DMA anywhere in host physical memory**.
- **Scalability** — you cannot dedicate a device to each VM on a host running many VMs.

**The IOMMU (VT-d on Intel)** addresses the security issue. The root cause: **DMA bypasses the MMU and operates directly on physical memory**, so a VM with a directly assigned device could **read/write anywhere in host physical memory** and **trigger any interrupt vector**. The IOMMU provides **two engines**:

| Engine | Function |
|---|---|
| **DMAR** — DMA remapping engine | **Enforces page table and EPT permissions on DMA**, preventing a malicious device from writing outside its allocated regions |
| **IR** — interrupt remapping engine | **Routes interrupts to the target VM**, preventing a malicious device injecting interrupts into the host or the wrong VM |

> **Exam flag.** Give **both** engines. Most answers mention DMA remapping and forget **interrupt remapping** — but interrupt injection is a real escape vector, and the IOMMU addresses it explicitly.

**SR-IOV** addresses the **scalability** issue. An SR-IOV-enabled device **presents several instances of itself**, each assignable to a different VM — **the hardware multiplexes itself**. The device has at least one **Physical Function (PF)**, controlled by the hypervisor, which creates the **Virtual Functions (VFs)** visible to VMs.

Scale: **theoretically up to 64K VFs**; **recent NICs support up to ~2K** (e.g. Mellanox/Nvidia ConnectX-7).

## 4.7 The I/O spectrum

| Approach | Performance | Compatibility | Cost |
|---|---|---|---|
| **Full emulation** | Worst — many vmexits per operation | **Best** — unmodified guests, existing drivers | Hypervisor in the data path |
| **Paravirtualisation (virtio)** | Much better — batched, fewer vmexits | Requires **PV drivers** in the guest | Equivalence compromised |
| **Direct assignment + IOMMU** | **Native** | Guest uses the real driver | Device dedicated to one VM; loses interposition |
| **SR-IOV** | Native, **and shareable** | Needs SR-IOV hardware | Still loses interposition |

---

# Part 5 — Lightweight virtualisation (Lecture 31)

## 5.1 The motivation: software bloat

Consider renting a cloud VM to host a website. The stack: provider hardware → hypervisor (Qemu/KVM) → your VM → a full guest Linux kernel → an entire Ubuntu userspace → Apache and its dependencies.

But what you *actually need* is the **web server, its dependencies, and the subset of kernel features it uses**. Everything else is installed, possibly running, and unnecessary — **software bloat**, with three consequences:

1. **Increased attack surface** — every unnecessary package and background process is a potential target. Probabilistically, **the more software you run, the higher the chance a vulnerability is present**.
2. **Additional cost** — you pay the provider for disk, memory and CPU cycles consumed by software you do not need.
3. **Performance loss** — for a fixed budget, those resources are not being spent on the workload that matters.

## 5.2 Definition

**Lightweight virtualisation** aims to provide, compared with traditional VMs:

| Metric | Lightweight | Traditional VM |
|---|---|---|
| **Memory footprint** | **KBs to a few MBs** per instance | Hundreds of MBs to GBs |
| **Boot time** | **Micro/milliseconds** | Seconds to minutes |
| **Disk footprint** | **KBs/MBs** | Much larger |

**Important qualification:** these metrics concern the **systems software**. The portion of boot time and memory/disk footprint attributable to **the application itself is unchanged**.

**Three technologies** reach these goals: **micro VMs** (stripped-down traditional Linux VMs), **containers**, and **unikernels**.

## 5.3 Containers

> **Containers are process-level sandboxing technologies, enforced by the operating system** — sometimes called **OS-level virtualisation**.

**The key idea, in two halves:**

- **The OS restricts the *visibility* of system resources** for a process or set of processes — filesystem, network interfaces, PIDs, and so on.
- **The OS also controls *hardware resource allocation and usage*** among those isolated processes — CPU scheduling cycles, memory, disk and network bandwidth.

Conceptually this achieves **the same isolation goals as a VM** — processes confined in a virtualised environment — **without a hypervisor or a system-level VM**.

**And it is much lighter:** per-container system memory/disk footprint **close to zero**, and boot time is simply **that of spawning a process — microseconds**.

### Namespaces — restricting visibility

| Namespace | Effect |
|---|---|
| **Filesystem / mount points** (~`chroot`) | Container cannot see the host's or other containers' filesystems. **You can run a Fedora rootfs in a container on a Debian host** |
| **Network stack** | Own IP, virtual bridged/routed network |
| **Processes: PIDs and IPCs** | Isolated PID set; cannot see or communicate with outside processes |
| **Host and domain name** | Own hostname |
| **User IDs** | **Can have root privileges inside the container** |

### Control groups (cgroups) — controlling hardware resources

| Resource | Control |
|---|---|
| **Memory** | Limit memory and swap usage |
| **CPU** | Limit usage (e.g. "1.5 CPU"), restrict to CPU sets, **control CFS quotas** |
| **Devices** | Enable/disable access to specific devices |
| **Block I/O** | Control throughput |
| **Network I/O** | Control traffic priority |

> **Exam flag.** Keep the split clean: **namespaces = what you can *see*; cgroups = what you can *use*.** Note the direct link back to Week 3 — cgroup CPU control works through **CFS quotas**, which is exactly the scheduling-attack defence flagged in Lecture 15.

### Use cases

- **Software development/testing/deployment** — develop, build and test in a controlled, identical environment, then deploy in that same environment (**repeatability**), on any machine supporting containers regardless of host configuration.
- **Lightweight, elastic virtualisation** — containers consume few resources and can be created and destroyed very fast. Large services make extensive use of them, and **serverless computing** (e.g. AWS Lambda) depends on that speed.

## 5.4 Containers versus VMs

| **Containers win on** | **VMs win on** |
|---|---|
| Low memory/disk usage | **OS diversity** |
| Fast boot times | **Kernel version** flexibility |
| Per-host density | **Performance isolation** |
| **Nesting** | **Security** |

VMs retain OS diversity because namespaces and cgroups are **Linux features** — running a different OS efficiently is difficult with containers. Studies also show **performance isolation is stronger with VMs**, i.e. it is harder for a malicious VM to steal resources.

## 5.5 Why container isolation is weaker — the interface argument

This is the most important argument in the lecture, and it is a *reasoning* question rather than a recall one.

**The setup.** In both environments, the **virtualisation layer is trusted** (the OS kernel for containers; the hypervisor for VMs) and the **instances are untrusted**.

**The threat model.** One container or VM is malicious and attempts an **escape attack** — gaining access to the virtualisation layer's memory, or to memory allocated to other instances.

**What stops the direct route.** Hardware-enforced isolation — **page tables and extended page tables** — prevents the malicious instance from *directly* accessing anything else.

**So where is the real threat?** **The virtualisation layer itself**, because the malicious instance **can invoke it**. If that invocation triggers a bug in the virtualisation layer, isolation breaks.

**Therefore the question becomes: how complex is the interface between trusted and untrusted?** — i.e. how hard is it to make sure that interface is bug-free?

| | Interface | Complexity |
|---|---|---|
| **Containers** | The **system call interface** | **Hundreds of system calls**, some — like `ioctl` — presenting **thousands of sub-functions**. There is no way to guarantee all of it is bug-free; **syzkaller regularly finds bugs there** |
| **VMs** | Hypervisor traps | **Much simpler — just a few traps** |

> **The conclusion:** the isolation a host OS enforces between containers **is not trusted to be as strong as** that a hypervisor enforces between VMs, **due to the size and complexity of the system call interface**.

**The industry response:** many organisations running containers in production **run them inside virtual machines** to gain the stronger isolation (Kata Containers and similar). These minimise Linux VM footprint and boot time to create **micro VMs** — but **this still kills most of the lightweightness benefits of containers**.

**Which leaves the question the next section answers: can we get both lightweightness and security?**

> **Exam flag — high value.** Reproduce the *argument*, not just the conclusion. Four steps: (1) hardware isolation blocks the direct route; (2) so the attack must go **through the virtualisation layer**; (3) so security depends on **how defensible that interface is**; (4) hundreds of syscalls with thousands of `ioctl` sub-functions versus a few traps. The syzkaller reference ties this directly back to Week 4.

## 5.6 Unikernels

> **A unikernel is an application plus its dependencies plus a thin OS, compiled as a static binary running on top of a hypervisor.**

**The "single-\*" properties:**

- **Single purpose** — runs **one application**. Want to run several? Run several unikernels.
- **Single process** — a multiprocess application means multiple unikernels. **However, SMP (multicore) and multithreading *are* supported.**
- **Single binary and single address space** for application + kernel — so **no user/kernel protection is needed**.

**Why dropping user/kernel protection is defensible here:** only a **single application** runs per instance, and **inter-application isolation is already enforced by running applications as separate unikernel instances**. There is no second application to protect against.

### Benefits

- **A form of lightweight virtualisation** — contains and runs **only what the application absolutely needs**, giving memory and disk footprint reductions and a cost advantage.
- **Considered a secure alternative to containers — because unikernels *are* virtual machines**, so they inherit the hypervisor's narrow interface (§5.5).
- **Per-application tailored kernel** — the **exokernel model** from Week 4, specialised for both lightweightness and performance.
- **Reduced OS noise and increased performance** — notably **low system call latency: application and kernel both in ring 0, so system calls are function calls**. Plus **sub-second boot times**.

> **Exam flag.** "System calls become function calls" is the single most quotable performance property, and it follows directly from the single-address-space design. Note the honest trade this implies, consistent with Week 4: **strong isolation *between* unikernels, none *inside* one.**

### Maturity and evidence

**Application domains:** cloud (servers, microservices, SaaS); embedded virtualisation, edge computing, IoT; network function virtualisation, HPC; and security-oriented uses such as VM introspection, malware analysis and secure desktops.

**But:** **unlike containers — a mature and widespread production technology — unikernels are still at the stage of research prototypes.** Projects can be grouped by supported language: memory-safe languages (MirageOS/OCaml, LING/Erlang, HalVM/Haskell); C/C++ with a semi-POSIX API (**Unikraft**, HermiTux, HermitCore, OSv, Rumprun, Lupine); and Rust/Go (Hermit, Clive). **Unikraft is the most mature and closest to production-ready.**

**Performance evidence:** benchmarking a popular key-value store, **Unikraft is the fastest setup measured — and even running virtualised on Qemu/KVM it is slightly faster than native Linux, and much faster than Linux in a VM.** The mechanism is the syscall-as-function-call latency reduction.

---

# Exam flags and lecturer emphasis

## Definitions to state exactly

1. **The fundamental challenge** — an OS expects to run alone with full privileges; how do two cohabit?
2. **The Bugnion definition** — abstraction at a widely-used interface; **identical**; **cannot be bypassed**.
3. **The three hypervisor goals** — equivalence, safety, performance — and **direct execution** as how all three are met.
4. **The P&G theorem** — sensitive ⊆ privileged — plus the **converse** and which requirement each violation breaks.
5. **The VT-x restatement** — sensitive instructions in non-root mode must **trap** *or* be **implemented in hardware on the non-root state duplicate**.
6. **Containers** — process-level sandboxing **enforced by the OS**; **namespaces = visibility, cgroups = resources**.
7. **Unikernel** — application + dependencies + thin OS as a **static binary** on a hypervisor; **single purpose, single process, single address space**.

## The P&G model — be able to work it

- **PSW = (M, B, L, PC)**; trap saves to `MEM[0]`, loads from `MEM[1]`.
- **vPSW** per VM; **`M` is what the guest *thinks* it is**.
- Resume: **`M' = u`**, **`B' = addr0 + vPSW.B`**, `L' = vPSW.L`, `PC' = vPSW.PC`, with bounds **checked**.
- **Two trap cases** — guest OS trapped (`vPSW.M == s`) → VMM emulates the sensitive instruction and does `vPSW.PC++`; guest app trapped (`vPSW.M == u`) → VMM saves state to `MEM[addr0]`, loads guest OS state from `MEM[addr0+1]`, resumes in guest-kernel mode.
- **Syscall/transition instructions must be tracked** to keep `vPSW.M` accurate.

## Quantitative facts

| Fact | Value |
|---|---|
| EPT 2D walk | **24 memory accesses** (vs **4** native) |
| Modern TLB hit rate | **> 95%** |
| Shadow paging share of vmexits | **over 90%** |
| Root↔non-root transition cost | **thousands of cycles** |
| SR-IOV virtual functions | **up to 64K** theoretical; **~2K** on recent NICs |
| Container memory/disk footprint | **close to zero**; boot = process spawn, **microseconds** |
| Lightweight VM targets | **KBs–MBs** memory, **µs–ms** boot |
| Qemu threads | **1 per vCPU + 1 per virtual device** |

## Counter-intuitive claims

- **First-generation VT-x was slower than software (DBT) virtualisation** — hardware support first bought simplicity and safety.
- **Shadow paging caused >90% of vmexits**, making hardware CPU virtualisation *slower* than software until EPT arrived.
- **This unit classifies KVM as Type 2.**
- **You may compromise performance or equivalence, never safety.**
- **Containers' weakness is interface complexity, not a missing hardware mechanism** — page tables isolate them perfectly well; the syscall interface is the problem.
- **Running containers in VMs kills most of their lightweightness advantage.**
- **Unikernels are still research prototypes**, unlike containers.

## Mechanism → problem it solves

| Mechanism | Problem |
|---|---|
| **Direct execution** | Performance, without sacrificing safety |
| **VT-x root/non-root** | Ring aliasing, address space compression, transition cost |
| **EPT** | Shadow paging's vmexit storm |
| **virtio** | Vmexits per register access in full emulation |
| **IOMMU — DMAR** | Assigned device DMAing anywhere in host memory |
| **IOMMU — IR** | Assigned device injecting arbitrary interrupts |
| **SR-IOV** | One device per VM — scalability |
| **Containers** | VM heavyweightness (footprint, boot time) |
| **Micro VMs / Kata** | Container isolation weakness |
| **Unikernels** | Lightweightness **and** security together |

## Common traps

- **Do not** state the theorem without defining **sensitive** *and* **privileged** as separate classifications.
- **Do not** forget the **converse** of the theorem, or which requirement each violation breaks.
- **Do not** quote the 24-access EPT walk without the **>95% TLB hit rate**.
- **Do not** give only DMA remapping for the IOMMU — **interrupt remapping** too.
- **Do not** say containers are insecure because they lack hardware isolation — they have it; the **syscall interface** is the issue.
- **Do** remember `POPF` **fails silently** rather than trapping — silence is what makes it fatal.
- **Do** use **pseudo-physical** for guest "physical" memory.

## Links across the unit

- **§2.8 MMU configured differently from what the guest requests** ← the same deception as Week 3's per-process page tables, one level up.
- **§4.6 IOMMU** ← Week 4's DMA/device threat; and the hardware lectures' System Protection material.
- **§5.3 cgroups and CFS quotas** ← Week 3's scheduling security aspects.
- **§5.5 syzkaller and the syscall interface** ← Week 4's kernel bug detection and seccomp.
- **§5.6 unikernels and the exokernel model** ← Week 4's OS design space — and note both lectures agree that unikernels **drop user/kernel protection**.
- **VM introspection (§1.4)** → analysing an untrusted guest from outside is the same idea as a TEE's inverted trust, from the opposite direction.

---

# Summary checklist

- [ ] The fundamental challenge; quick vs Bugnion definitions; multiplexing/aggregation/emulation
- [ ] S/360 model 67; P&G 1974; Disco → VMware; Xen/KVM/VirtualBox/Hyper-V
- [ ] Use cases: consolidation (historical motivation), development, checkpoint/migration, emulation, cloud, security (sandboxing, **VM introspection**)
- [ ] Hypervisor's **three goals**; **direct execution** as the mechanism
- [ ] Type I vs II by **who does resource allocation**; **KVM = Type 2** in this unit
- [ ] **guest virtual → guest pseudo-physical → host physical**
- [ ] P&G model: **PSW (M,B,L,PC)**, `MEM[0]`/`MEM[1]`, segmentation with B and L
- [ ] Native OS operation, all five steps
- [ ] Three requirements: **safety, equivalence, performance**
- [ ] Hypervisor in supervisor mode, **guest OS in user mode**
- [ ] **Control-sensitive / behaviour-sensitive / innocuous / privileged**; independence of the classifications
- [ ] **Theorem**, converse, and which requirement each violation breaks
- [ ] `vPSW`, `addr0`, resume formulas, **both trap cases**, syscall tracking
- [ ] `POPF` fails silently; workarounds break **performance** or **equivalence**, never safety
- [ ] x86-32 problems: ring aliasing, address space compression, transition cost
- [ ] **VT-x**: root/non-root, rings orthogonal, address space switched atomically incl. TLB
- [ ] VT-x vs criteria — including that **performance was not the first goal**
- [ ] Restated theorem; **transitions cost thousands of cycles**
- [ ] `VMLAUNCH`/`VMRESUME`/`VMCALL`/`VMREAD`/`VMWRITE`; **VMCS**; vmexit categories
- [ ] KVM + Qemu split; Qemu's `malloc` **is** guest pseudo-physical memory
- [ ] Shadow paging **>90% of vmexits**; **EPT**; **24 vs 4**; **>95% TLB hits**
- [ ] Physical I/O: **MMIO/PIO, interrupts, DMA**; ring buffers with head/tail
- [ ] Full emulation: trap MMIO, inject interrupts, emulate DMA; **1 thread per vCPU + 1 per device**
- [ ] e1000 chosen for driver ubiquity; register offsets and `base + offset` addressing
- [ ] **virtio**: PV devices, optimised rings, fewer vmexits; needs guest drivers
- [ ] Passthrough's **two problems**; **IOMMU = DMAR + IR**; **SR-IOV = PF + VFs**
- [ ] Software bloat: **attack surface, cost, performance**
- [ ] Lightweight targets; micro VMs / containers / unikernels
- [ ] **Namespaces (visibility)** vs **cgroups (resources)**, with their lists
- [ ] Containers vs VMs pros table
- [ ] **The interface argument**, all four steps, with `ioctl` sub-functions and syzkaller
- [ ] Kata/micro VMs as the response, and what they cost
- [ ] Unikernel definition, **single-\*** properties, why no user/kernel protection
- [ ] Benefits incl. **syscalls as function calls**; exokernel lineage
- [ ] **Still research prototypes**; Unikraft the most mature
