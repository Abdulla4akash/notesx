---
subject: COMP60261
chapter: 6
title: "Chapter 6 Exam Questions - Fable 5"
language: "en"
---

# COMP60261 — Chapter 6 Exam Questions

**Author: Fable 5**

**Scope:** Virtualisation — what it is and why it exists; the Popek & Goldberg theory worked through the simplified CPU model; hardware support for CPU and memory virtualisation on x86-64; I/O virtualisation from full emulation to SR-IOV; and lightweight virtualisation with containers and unikernels.

**The question the whole chapter answers:**

> An OS expects to run **alone, with full privileges**, on a physical machine — to have **total control over that machine's hardware**. So how can two OSes cohabit on the same host?

**Assumed platform for every calculation: x86-64, 4 KiB pages, 4-level guest page tables and 4-level EPT, 3 GHz CPU.**

| Quantity | Value |
|---|---|
| EPT 2D page walk | **24** memory accesses (vs **4** native) |
| Modern TLB hit rate | **> 95%** |
| Shadow paging's share of vmexits | **over 90%** |
| Root ↔ non-root transition | **thousands of cycles** |
| SR-IOV virtual functions | up to **64K** theoretical, **~2K** on recent NICs |
| Container footprint / boot | **close to zero** / process spawn, **microseconds** |
| Qemu threads | **1 per vCPU + 1 per virtual device** |

> **On the calculations in Part 2.** Every figure was computed and checked numerically, including deriving the 24-access EPT walk from first principles rather than quoting it, and confirming that each Popek & Goldberg bounds check accepts and rejects the addresses claimed.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1 — Two definitions, and the three principles

**Q:** Give the quick and the precise (Bugnion) definitions of virtualisation. Map the three clauses of the precise definition onto the hypervisor's goals. Then name the three principles by which virtualisation is achieved, and explain why virtual memory qualifies as virtualisation under this definition.

**Answer & Explanation:**

**The quick definition.** Virtualisation technologies are the set of software and hardware components that allow **running multiple operating systems at the same time on the same physical machine**.

**The precise definition (Bugnion et al.).**

> Virtualisation is the **abstraction at a widely-used interface** of one or several components of a computer system, whereby the created virtual resource is **identical** to the virtualised component and **cannot be bypassed** by its clients.

**The three clauses map exactly onto the hypervisor's goals:**

| Clause | Meaning for a VM | Hypervisor goal |
|---|---|---|
| **Abstraction at a widely-used interface** | The interface is software (OS) ⇔ hardware | — |
| **Identical** | Present virtual hardware able to run **unmodified** existing OSes | **Equivalence** |
| **Cannot be bypassed** | Guest OSes cannot escape the abstraction | **Safety** |

**The three principles:**

* **Multiplexing** — one physical resource presented as several virtual ones.
* **Aggregation** — several physical resources presented as one.
* **Emulation** — presenting a resource that differs from what is physically there.

**Why virtual memory is virtualisation under this definition.** Take the three clauses in turn. The **interface** is the widely-used one between a program and memory — load and store on an address space. The virtual resource is **identical** to the virtualised component: a process sees what appears to be a private, contiguous address space indistinguishable in use from physical memory, and programs run unmodified. And it **cannot be bypassed**: a process cannot name a physical address directly, because the MMU translates every access and the page tables are controlled by the kernel, not the process.

**Why being able to say this matters.** The definition **generalises beyond VMs** — virtual memory, scheduling and storage solutions are all virtualisation under it. Scheduling multiplexes one CPU into many apparent CPUs, each identical in instruction set to the real one and unbypassable because the process cannot decline to be preempted. Demonstrating *why* each satisfies the three clauses is how you show you understand the definition rather than having memorised it.

**The unifying observation.** Each of these is the **same deception applied at a different interface**, and each is a security mechanism for the same reason: *cannot be bypassed* is exactly the "complete mediation" requirement of a reference monitor. Chapter 3's page tables, Chapter 4's TCB, and this chapter's hypervisor are the same idea at three scales — which is why the hypervisor inherits both the strengths and the failure modes of the OS beneath it.

---

### Question 2 — The three hypervisor goals, and direct execution

**Q:** State the hypervisor's three goals. Explain how **direct execution** achieves all three simultaneously. Then give the criterion distinguishing Type I from Type II hypervisors, and state how this unit classifies KVM.

**Answer & Explanation:**

**A system-level virtual machine** creates a model of the **hardware** for a mostly unmodified OS to run on, and each VM has **its own copy** of the virtualised hardware. A **hypervisor** (or **VMM**) creates a VM of the **same architecture as the host**, aiming jointly at:

1. **Equivalence** — it must run **unmodified** guest OSes and applications.
2. **Safety** — VMs **cannot escape** the isolation the hypervisor enforces.
3. **Performance** — VMs must run at **close to native** speed.

**Why these are in tension.** Safety would be easy if you emulated every instruction in software — but that destroys performance. Performance would be easy if you let the guest run with full privilege — but that destroys safety. Equivalence forbids the third escape route of simply editing the guest to behave better.

**Direct execution is the mechanism that reconciles them:**

* VM code executes **directly on the physical CPU**, at a **lower privilege level than the hypervisor** — this is the **fast path**, and it is why performance can approach native.
* **Only** those instructions that would let the VM escape the VMM's control — installing a new page table, for instance — are **emulated safely by the VMM**: the **slow path**.
* This is achieved **without modifying the guest**, by **trapping to the VMM** on exactly those instructions.

> **The high-value point.** Direct execution is what makes "performance" compatible with "safety", and the **Popek & Goldberg theorem is precisely the statement of the condition under which it is possible** — namely that trapping on exactly the dangerous instructions can be arranged. Questions 3 and 4 are that condition; this question is why anyone cares about it.

**Type I versus Type II.** The distinguishing question is **who does resource allocation and scheduling**:

* **Type I** — the **hypervisor** does it.
* **Type II** — there is **more involvement from the host OS**.

**This unit classifies KVM as Type 2**, on the grounds that it is a module inside a general-purpose host OS which performs the resource allocation and scheduling, with a userspace program (Qemu) managing the VM. Other sources call KVM a hybrid or Type 1; **follow this unit's classification in an exam here** and, if you have room, note that the disagreement exists and turns on where you locate the scheduling.

**The extra level of translation virtualisation introduces**, with the unit's terminology:

```
(guest) virtual  ->  (guest) pseudo-physical  ->  (host) physical
```

Use **pseudo-physical** for the middle stage. It is what the guest *believes* is physical memory but is itself virtual, and using the term correctly signals that you understand the guest is being deceived. Question 10 does the arithmetic.

---

### Question 3 — Classifying instructions

**Q:** Define control-sensitive, behaviour-sensitive, innocuous and privileged instructions, with an example of each. Explain why "sensitive" and "privileged" are independent classifications, and why that independence is essential to stating the theorem.

**Answer & Explanation:**

**Sensitive instructions**, in two sub-kinds:

| Kind | Definition | Example |
|---|---|---|
| **Control sensitive** | **Updates the system state** | Instructions modifying the PSW in the simplified model; **`LGDT`** on x86-32, which loads the descriptor table |
| **Behaviour sensitive** | **Semantics depends on the value of the system state** — e.g. the current privilege level | **`POPF`** — loads the status register from the stack; works in supervisor mode but **fails silently in user mode** |

**Innocuous instructions** — everything not sensitive. An `ADD` of two registers neither changes system state nor behaves differently depending on it.

**Privileged instructions** — can only execute in supervisor mode, and **trap** when executed in user mode. Example: **`HLT`** on x86-32.

**Why the two classifications are independent.** They partition the same instruction set along **different axes** and are defined by different criteria:

* **Sensitive** is about **what the instruction does or depends on** — a property of its semantics with respect to system state.
* **Privileged** is about **what the hardware does when a user-mode program executes it** — a property of the trap behaviour the architecture defines.

Nothing in an architecture forces these to coincide. An instruction can be:

| | Privileged | Not privileged |
|---|---|---|
| **Sensitive** | The good case — traps, so the VMM can emulate it | **The fatal case** — `POPF` on x86-32 |
| **Innocuous** | Merely wasteful — an unnecessary trap | The common case — ordinary arithmetic |

**Why the independence is essential to the theorem.** The theorem is a statement about **how the two sets relate** — that sensitive must be a *subset* of privileged. If the two classifications were the same thing by definition, the theorem would be a tautology and no architecture could fail it. It is precisely because they are independent that x86-32 could be, and was, unvirtualisable. **Answers that conflate the two cannot state the theorem correctly**, which is why this is worth getting exactly right before attempting Question 4.

**Why `POPF` failing *silently* is the worst possible behaviour.** If `POPF` faulted in user mode, it would be privileged and all would be well. If it worked fully, there would be no problem to solve. Instead it **executes, succeeds, and quietly does less than it was asked** — so the guest OS receives no signal, the VMM receives no trap, and the machine simply diverges from what the guest expects. Silence is what makes it fatal: there is no event on which to intervene.

---

### Question 4 — The Popek & Goldberg theorem

**Q:** State the theorem and its converse. For each of the two kinds of sensitive instruction, say which hypervisor requirement is lost if it fails to trap, and why. Then give the two historical workarounds for a non-compliant ISA and what each sacrifices.

**Answer & Explanation:**

**The theorem.**

> For a given ISA, a VMM may be constructed if the set of **sensitive** instructions for that ISA is a **subset** of the set of **privileged** instructions:
>
> `{control-sensitive} ∪ {behaviour-sensitive} ⊆ {privileged}`

In words: **every instruction that modifies system state, or whose behaviour depends on system state, must trap when executed in user mode.**

**The converse also holds** — if the criterion is not met, a VMM **cannot** be constructed for that architecture. Stating the converse matters: the paper's original purpose was to **show that some contemporary architectures were *not* virtualisable**, with the DEC PDP-10 as its case study. It was a negative result first.

**Which requirement each violation breaks:**

| If this fails to trap | What happens | Requirement lost |
|---|---|---|
| A **control-sensitive** instruction | The guest modifies system state **without VMM supervision** — for instance a guest OS **installing an arbitrary page table**, thereby mapping the VMM's or another VM's memory | **Safety** |
| A **behaviour-sensitive** instruction | The guest OS, actually running in **user mode**, sees **user-level semantics** where it expects supervisor-level, so it behaves differently virtualised than natively | **Equivalence** |

> **This attribution is what distinguishes a full answer.** **Control-sensitive → safety; behaviour-sensitive → equivalence.** The reasoning: a control-sensitive instruction that does not trap lets the guest *act* outside its box, which is a containment failure. A behaviour-sensitive instruction that does not trap lets the guest *observe* that it is boxed — or worse, silently malfunction — which is a fidelity failure.

**Why the theorem mattered when it did not seem to.** Published in 1974 in *Communications of the ACM*, it attracted little attention because virtualisation was unpopular in the 1970s. Then VMs became popular at the **end of the 1990s** — and **x86-32, the most popular ISA of the day, was not virtualisable**. In the 2000s, **AMD and Intel explicitly designed AMD-V and Intel VT-x for x86-64 to meet the paper's criteria.** A 1974 negative result became a hardware requirements document twenty-five years later.

**The canonical violation.** On **x86-32, `POPF` is behaviour-sensitive but does not trap in user mode — it fails silently.** A guest OS running in user mode executes `POPF` expecting to update the interrupt-enable flag; the instruction succeeds while ignoring that part; the guest proceeds on a false belief about the machine.

**The two workarounds, each sacrificing a different requirement:**

| Technique | How it works | What it breaks |
|---|---|---|
| **More emulation** (dynamic binary translation) | Run the entire guest OS, or every page table access, under emulation rather than directly | **Performance** — very slow |
| **Paravirtualisation** (Xen) | **Modify the guest OS** to handle the ISA's limitations | **Equivalence** |

> **The asymmetry to carry away, and the lecturer's summarising observation: you can compromise on performance or on equivalence — but never on safety.** That is not a matter of taste. Performance and equivalence are properties of how well the abstraction serves its clients; safety is what makes it an abstraction at all. A hypervisor that is slow is disappointing; a hypervisor that is not equivalent is inconvenient; a hypervisor that is unsafe is **not a hypervisor**, since "cannot be bypassed" is part of the definition (Question 1). This single asymmetry explains the entire design history that follows — including why hardware support was worth building.

---

### Question 5 — VT-x: root and non-root mode

**Q:** Name the three x86-64 virtualisation technologies and what each virtualises. Explain VT-x's central design decision and why it was chosen over the alternative. Restate the theorem for root/non-root mode. Then explain the counter-intuitive fact about first-generation VT-x performance.

**Answer & Explanation:**

**The three technologies.** A **fundamental design goal of x86-64 was architectural support for virtualisation**:

| Technology | Virtualises |
|---|---|
| **VT-x** (Virtualisation Technology) | **CPU** |
| **EPT** (Extended Page Tables) | **Memory** |
| **VT-d** (Virtualisation Technology for Directed I/O) | **I/O** |

AMD has closely equivalent technologies (AMD-V, NPT/RVI, AMD-Vi).

**The three problems that had to be solved**, all consequences of x86-32's non-compliance:

* **Protection ring aliasing and compression** — the guest OS runs in **ring 3** when it was designed for **ring 0**.
* **Address space compression** — the hypervisor must be **located somewhere** in the address space and **protected** there.
* **Performance impact of guest–host transitions** — some sensitive instructions are **very frequent**, system calls above all.

**The central design decision.** Rather than fixing each problematic aspect separately — changing the semantics of individual instructions such as `POPF`, **which would break backward compatibility** — VT-x **duplicates the entire state of the CPU** into two modes of execution:

* **Root mode** — hypervisor and host OS.
* **Non-root mode** — VMs.

Its properties:

* At any point the CPU is **either root or non-root**.
* **Protection rings are orthogonal** to root mode and available in **both** — so a guest OS runs in **non-root ring 0**, exactly the privilege level it was designed for. **This eliminates ring aliasing outright** rather than working around it.
* **Each mode has its own address space**, switched **atomically** as part of the transition — **including TLB content**. This dissolves address space compression: the hypervisor does not need to hide inside the guest's address space, because it has its own.

**Why duplication rather than repair.** Editing instruction semantics would have made every existing x86 binary's behaviour version-dependent. Duplicating the state instead leaves every instruction's meaning intact and changes only *which copy of the state* it operates on. Backward compatibility is preserved by construction — which is also why the approach could be adopted at all.

**The theorem restated for root/non-root:**

> When executed in non-root mode, all sensitive instructions must either
> 1. **cause a trap**, or
> 2. be **implemented by the CPU and operate on the non-root duplicate of the CPU state**.

**Option 2 is the new possibility hardware provides**, and it is what makes the design fast. Having *every* sensitive instruction trap would satisfy equivalence and safety perfectly — **but frequent guest ⇔ VMM transitions must be avoided, because these transitions cost thousands of cycles.** So the frequent sensitive instructions are implemented in hardware against the non-root state copy instead of trapping. The resulting trade-off is **hardware complexity versus performance**.

**Transitions and the VMCS.** The VMM starts or resumes a VM with **`VMLAUNCH`** and **`VMRESUME`**. Transitions from VM to hypervisor are **vmexits**, either **involuntary** (traps) or **voluntary** (**`VMCALL`** — a **hypercall**, the hypervisor's equivalent of a system call). VM state lives in the **VMCS (VM Control Structure)**, accessed with **`VMREAD`** and **`VMWRITE`**. Vmexit categories: exception, interrupt, triple fault, root-mode sensitive instruction, hypercall, I/O instruction, EPT violation, legacy emulation, and the VT-x instructions themselves.

**The counter-intuitive fact.** Measured against the three criteria, VT-x delivered **equivalence** (absolute architectural compatibility, plus backward compatibility with legacy x86-32 and x86-64) and **safety** (with architectural support the hypervisor codebase is **much simpler**, so its **attack surface is reduced** compared with DBT or paravirtualisation solutions that must maintain complex invariants). But:

> **Performance was not a primary goal at first: the first generation of VT-x CPUs were *slower* than state-of-the-art dynamic binary translation.**

**Hardware support first bought simplicity and safety; performance came later** — and specifically, it came with EPT, because shadow paging was the bottleneck (Question 6). The simpler-codebase-means-smaller-attack-surface argument is a direct link back to Chapter 4's TCB reasoning: a hypervisor that needs less cleverness to be correct is more likely to be correct.

---

### Question 6 — Shadow paging and Extended Page Tables

**Q:** Explain why VT-x without hardware memory virtualisation required shadow paging, and quantify why that was fatal. Describe how EPT works and where each table lives. Then explain the two figures that must always be quoted together.

**Answer & Explanation:**

**Before EPT.** VT-x gave **disjoint page tables for root and non-root mode** via `%cr3`, which already bought an equivalence benefit: **no need to locate the hypervisor inside the guest address space** and protect it with segmentation. But the guest's own page tables remained a problem. A guest OS updating a page table entry is performing a **control-sensitive** operation — it is changing a virtual-to-physical mapping — and if left unsupervised it could map the VMM's memory or another VM's. So **every guest page table update had to be validated and controlled by the VMM: shadow paging.**

**Why that was fatal, quantitatively.** Guest page table updates are not rare — every `fork`, every `mmap`, every copy-on-write fault, every process switch touches them. The result:

> **Shadow paging accounted for over 90% of vmexits**, making **VT-x slower than software virtualisation.**

This is the mechanism behind Question 5's counter-intuitive fact. Hardware CPU virtualisation was correct and simple but slow, and the reason was entirely in memory management. The alternative — paravirtualisation — cost equivalence instead.

**How EPT resolves it — by splitting the responsibility in two:**

| Table | Maintained by | Maps | One per |
|---|---|---|---|
| **Guest page tables** | The **guest OS**, normally, and it may update them **freely without trapping** | guest virtual → guest **pseudo-physical** | guest process |
| **EPT** | The **hypervisor** | guest **pseudo-physical** → host physical | **VM** |

**Why this is safe despite the guest being unsupervised.** The guest can now write whatever it likes into its own page tables — but everything it can name there is a **pseudo-physical** address, and **every pseudo-physical address must pass through the EPT**, which the hypervisor fully controls. So the guest can map any pseudo-physical page it wishes and still **cannot reach a host physical page the hypervisor has not granted it**. The hypervisor stopped policing *operations* and started constraining the *namespace* — enforcement by construction rather than by checking, exactly the move Chapter 3 made with per-process page tables.

**The two figures that must always be quoted together.**

> **A TLB miss requires a 2D page walk costing 24 memory accesses, versus 4 for a standard walk — but the modern TLB hit rate is above 95%, so the walk almost never happens.**

Because the **TLB caches the guest-virtual → host-physical translation directly**, a hit gives **native performance** — the two-level structure is invisible. Question 9 derives the 24 and computes the average cost.

> **Quoting one figure without the other misrepresents the design.** "24 accesses instead of 4" alone suggests memory virtualisation is catastrophically slow, which is false. ">95% TLB hit rate" alone hides that the miss penalty is six times native, which matters for workloads with poor locality — large working sets, pointer-chasing, databases — where nested paging overhead is genuinely measurable and where huge pages are used precisely to reduce walk depth and TLB pressure.

**Where guest memory actually lives, in KVM.** This is worth being able to describe because it demystifies the whole arrangement:

1. The **guest manages its own page tables**, one per guest process, with minimal KVM intervention.
2. **Qemu runs in host userspace as an ordinary process**, with its own virtual address space.
3. Qemu makes **one large `malloc`**, and that buffer **becomes the guest's pseudo-physical memory**.
4. The **KVM module in the host kernel** sets up and manages the **EPT**, mapping guest pseudo-physical onto host physical.
5. When Qemu needs to read or write VM memory — for I/O virtualisation, say — it simply **reads and writes that buffer**, translated by Qemu's own page table like any other host process.

> **"Guest physical memory is just a `malloc` in a userspace process"** is a genuinely clarifying fact. It explains how Qemu implements DMA emulation trivially (Question 8), and it explains why the bug in Question 21 is so dangerous: an unchecked guest-supplied offset into that buffer is an unchecked offset into a **host userspace heap allocation**, with the rest of Qemu's address space on the other side of it.

---

### Question 7 — Why container isolation is weaker than VM isolation

**Q:** Reproduce the four-step argument for why containers isolate less strongly than VMs. Define containers precisely, distinguish namespaces from cgroups, and state the industry response together with what it costs.

**Answer & Explanation:**

**The definition first.**

> **Containers are process-level sandboxing technologies, enforced by the operating system** — sometimes called **OS-level virtualisation**.

The key idea has two halves, and keeping them apart is the examinable point:

| Half | Mechanism | What it controls |
|---|---|---|
| The OS restricts the **visibility** of system resources | **Namespaces** | Filesystem and mount points, network stack, PIDs and IPCs, hostname, user IDs |
| The OS controls **hardware resource allocation and usage** | **cgroups** | Memory and swap, CPU (sets, limits, **CFS quotas**), devices, block I/O, network I/O |

> **Keep the split clean: namespaces = what you can *see*; cgroups = what you can *use*.** Note the direct link back to Chapter 3 — cgroup CPU control works through **CFS quotas**, which is exactly the scheduling-attack defence flagged in the scheduling lecture.

Conceptually this achieves **the same isolation goals as a VM** — processes confined in a virtualised environment — **without a hypervisor or a system-level VM**. And it is far lighter: per-container systems footprint **close to zero**, boot time simply **that of spawning a process, microseconds**.

**Now the four-step argument, which is a reasoning question rather than a recall one.**

**Step 1 — the setup.** In both environments the **virtualisation layer is trusted** (the OS kernel for containers; the hypervisor for VMs) and the **instances are untrusted**. The threat model: one container or VM is malicious and attempts an **escape attack**, seeking access to the virtualisation layer's memory or to memory allocated to other instances.

**Step 2 — hardware isolation blocks the direct route.** Hardware-enforced isolation — **page tables** for containers, **page tables and extended page tables** for VMs — prevents the malicious instance from *directly* accessing anything else. **Containers are not weaker here.** A container's processes have their own address spaces enforced by exactly the same MMU as anything else.

**Step 3 — therefore the attack must go *through* the virtualisation layer.** The remaining threat is the layer itself, because the malicious instance **can invoke it**. If that invocation triggers a bug in the layer, isolation breaks.

**Step 4 — so security depends on how defensible that interface is:**

| | Interface | Complexity |
|---|---|---|
| **Containers** | The **system call interface** | **Hundreds of system calls**, some — such as **`ioctl`** — presenting **thousands of sub-functions**. There is no way to guarantee all of it is bug-free, and **syzkaller regularly finds bugs there** |
| **VMs** | Hypervisor traps | **Much simpler — just a few traps** |

> **The conclusion:** the isolation a host OS enforces between containers **is not trusted to be as strong as** that a hypervisor enforces between VMs, **due to the size and complexity of the system call interface.**

> **Do not say containers are insecure because they lack hardware isolation.** They have it. The syscall interface is the issue — and this is the same trust-interface-complexity argument as Chapter 4's syscall hardening and Chapter 5's compartment interfaces, which is why the syzkaller reference lands so precisely.

**Containers versus VMs, as a table:**

| Containers win on | VMs win on |
|---|---|
| Low memory and disk usage | **OS diversity** |
| Fast boot times | **Kernel version** flexibility |
| Per-host density | **Performance isolation** |
| **Nesting** | **Security** |

VMs retain OS diversity because namespaces and cgroups are **Linux features** — running a different OS efficiently is difficult with containers, though you *can* run a Fedora rootfs in a container on a Debian host, since the kernel is shared and only userspace differs. Studies also show **performance isolation is stronger with VMs**: it is harder for a malicious VM to steal resources.

**The industry response, and its cost.** Many organisations running containers in production **run them inside virtual machines** to gain the stronger isolation — Kata Containers and similar. These minimise Linux VM footprint and boot time to create **micro VMs**. But **this still kills most of the lightweightness benefits of containers**, which is the honest admission the lecture makes and the question the next topic exists to answer: **can we get both lightweightness and security?** Question 8's unikernels are the proposed answer, and Question 14 quantifies what the micro-VM compromise actually costs.

---

### Question 8 — I/O virtualisation, the IOMMU, and unikernels

**Q:** Describe the I/O virtualisation spectrum from full emulation to SR-IOV, with each approach's cost. State the **two** problems of direct device assignment and the mechanism addressing each — naming **both** engines of the IOMMU. Then define a unikernel and explain why dropping user/kernel protection is defensible there.

**Answer & Explanation:**

**The three physical I/O mechanisms**, which everything else emulates:

| Mechanism | Direction | Carries | Use |
|---|---|---|---|
| **PIO / MMIO** | CPU → device | Small, register-sized | Discover and **control** devices |
| **Interrupts** | device → CPU | **No data** — notification only | Signal completion or events |
| **DMA** | bidirectional | Large data | Bulk transfer; CPU starts it, is notified on completion |

Bulk transfer uses a **ring buffer** — a producer–consumer circular buffer in memory, **described in the device's registers, which the CPU sets up using MMIO/PIO**: base address, length, head and tail. The **device consumes from `head`**, the **CPU produces at `tail`**. Synchronisation is **MMIO for CPU → device** and **interrupts for device → CPU**. Question 16 traces the index arithmetic.

**Full device emulation.** Because the OS ⇔ device interface is simple, the hypervisor can emulate a device completely: **ensure every MMIO/PIO operation traps** (PIO uses **sensitive instructions** so it traps naturally; **MMIO memory is mapped read-only or not mapped** so accesses fault); **inject interrupts** via a virtual interrupt controller; and **read and write guest physical memory to emulate DMA** — trivial for Qemu, since that memory is its own `malloc`'d buffer. The **Qemu/KVM threading model** is **one thread per vCPU and one thread per virtual device**, with device threads handling most I/O **asynchronously**: a vCPU initiates MMIO → traps → work is deferred to the device thread → the guest **resumes** while the transfer proceeds → the hypervisor **injects an interrupt** on completion. **This mimics exactly what a real device does**, which is what makes the emulation transparent.

The canonical emulated device is the **Intel 82540EM Gigabit Ethernet Controller**, chosen because it is **very old but widespread, so every modern OS ships the driver** (`e1000`). Question 12 does its register arithmetic.

**The spectrum:**

| Approach | Performance | Compatibility | Cost |
|---|---|---|---|
| **Full emulation** | Worst — many vmexits per operation | **Best** — unmodified guests, existing drivers | Hypervisor in the data path |
| **Paravirtualisation (virtio)** | Much better — batched, **fewer vmexits** | Requires **PV drivers** in the guest | **Equivalence** compromised |
| **Direct assignment + IOMMU** | **Native** | Guest uses the real driver | Device dedicated to one VM; **loses interposition** |
| **SR-IOV** | Native, **and shareable** | Needs SR-IOV hardware | Still loses interposition |

**Why virtio exists.** Most hardware devices were **not designed with virtualisation in mind**: sending or receiving **a single Ethernet frame** with an e1000 involves **multiple register accesses, hence several costly vmexits**. **virtio** is the standard framework for Qemu/KVM — virtual **PCIe** devices discovered normally at startup, an **optimised ring buffer implementation minimising vmexits**, available for network, disk and console, and also for functionality with **no real-device counterpart** such as **memory hotplug** and **filesystem sharing**. Question 13 quantifies the improvement.

**Direct device assignment (PCI passthrough)** gives a VM **full and exclusive access to a device**, bypassing the hypervisor for native performance. It has **two fundamental problems**:

| Problem | Why | Mechanism that addresses it |
|---|---|---|
| **Security** | The VM controls the device, and **the device can DMA anywhere in host physical memory** — because **DMA bypasses the MMU** | **IOMMU** (VT-d) |
| **Scalability** | You cannot dedicate a device to each VM on a host running many VMs | **SR-IOV** |

**The IOMMU has two engines, and both must be named:**

| Engine | Function |
|---|---|
| **DMAR** — DMA remapping | **Enforces page table and EPT permissions on DMA**, preventing a malicious device from writing outside its allocated regions |
| **IR** — interrupt remapping | **Routes interrupts to the target VM**, preventing a malicious device injecting interrupts into the host or the wrong VM |

> **Most answers give DMA remapping and forget interrupt remapping.** Interrupt injection is a real escape vector — a device that can raise an arbitrary vector on the host can invoke arbitrary host interrupt handlers — and the IOMMU addresses it explicitly. Give both.

**SR-IOV** addresses scalability: the device **presents several instances of itself**, each assignable to a different VM — **the hardware multiplexes itself**. There is at least one **Physical Function (PF)**, controlled by the hypervisor, which creates the **Virtual Functions (VFs)** visible to VMs. Scale: **up to 64K VFs theoretically**, with **recent NICs supporting around 2K**.

**Unikernels.**

> **A unikernel is an application plus its dependencies plus a thin OS, compiled as a static binary running on top of a hypervisor.**

The **single-\* properties**: **single purpose** — runs one application, and if you want several you run several unikernels; **single process** — a multiprocess application means multiple unikernels, **though SMP and multithreading *are* supported**; **single binary and single address space** for application and kernel, so **no user/kernel protection is needed**.

**Why dropping user/kernel protection is defensible here.** Only a **single application** runs per instance, and **inter-application isolation is already enforced by running applications as separate unikernel instances**. There is no second application in the instance to protect against — so the boundary you removed was not separating two principals. The isolation that matters has been moved to the hypervisor, whose interface is the narrow one from Question 7.

**Benefits:** a form of **lightweight virtualisation**, containing only what the application absolutely needs; **considered a secure alternative to containers — because unikernels *are* virtual machines**, so they inherit the hypervisor's narrow interface; a **per-application tailored kernel**, which is the **exokernel model** specialised for lightweightness and performance; and **reduced OS noise with low system call latency — application and kernel both in ring 0, so system calls are function calls** — plus sub-second boot.

> **"System calls become function calls" is the single most quotable performance property**, and it follows directly from the single-address-space design. State the honest trade with it: **strong isolation *between* unikernels, none *inside* one** — so a vulnerability in the application yields the entire instance.

**Maturity, stated honestly:** **unlike containers — a mature, widespread production technology — unikernels are still at the stage of research prototypes**, with **Unikraft** the most mature and closest to production-ready. The performance evidence is nonetheless striking: benchmarking a popular key-value store, **Unikraft is the fastest setup measured — even virtualised on Qemu/KVM it is slightly faster than native Linux**, and much faster than Linux in a VM, by the syscall-latency mechanism above.

---

## Part 2: Memory & Storage Size Calculations

### Question 9 — Deriving the 24-access EPT walk

**Q:** Both the guest page table and the EPT have four levels.

1. Derive the number of memory accesses for a full 2D page walk from first principles. Do not quote the figure — show where each access comes from.
2. How many does a native walk require, and what is the ratio?
3. With a 95% TLB hit rate, what is the average number of walk accesses per memory reference, virtualised and native?
4. Repeat for 99%. What does the comparison tell you about which workloads suffer?

**Answer & Explanation:**

**1 — The derivation.** The key insight is that **every address stored inside a guest page table is a guest pseudo-physical address**, and the hardware cannot follow a pseudo-physical address — it must first be translated to host physical through the EPT. So each step of the guest walk carries a nested walk inside it.

To read **one** guest page-table entry:

```
translate the GPA of that guest table through the EPT   = 4 accesses (EPT is 4 levels)
read the guest entry itself                             = 1 access
                                                        ---
per guest level                                         = 5 accesses
```

There are four guest levels, and then the **final** guest entry yields the GPA of the **data page**, which must itself be translated:

```
4 guest levels × 5              = 20
final data-page GPA via the EPT =  4
                                  --
TOTAL                           = 24 memory accesses
```

**2 — Native, and the ratio.** A standard 4-level walk reads **one entry per level = 4 accesses**.

```
ratio = 24 / 4 = 6× more expensive
```

**3 — Average cost at a 95% hit rate.** A TLB hit costs **zero** walk accesses, because the **TLB caches the guest-virtual → host-physical translation directly** — the two-level structure is entirely invisible on a hit.

```
virtualised: 0.95 × 0 + 0.05 × 24 = 1.20 accesses per reference
native:      0.95 × 0 + 0.05 ×  4 = 0.20 accesses per reference
penalty:                            1.00 extra access per reference
```

**4 — At 99%.**

```
virtualised: 0.01 × 24 = 0.24
native:      0.01 ×  4 = 0.04
penalty:                 0.20
```

**What the comparison shows.** The *ratio* stays at 6× regardless of hit rate — that is fixed by the walk depths. What changes is the **absolute** penalty, and it scales linearly with the miss rate: 1.00 extra accesses per reference at 95%, 0.20 at 99%, 0.02 at 99.9%. So the design is excellent for workloads with **good locality** and progressively worse for workloads that miss:

* **Small working set, sequential or loop-local access** — hit rate near 100%, nested paging is effectively free.
* **Large working set, pointer-chasing, random access** — databases, graph processing, in-memory key-value stores — miss rate rises and each miss costs six times native. This is where nested paging overhead becomes genuinely measurable.

This is why **huge pages** matter so much under virtualisation: a 2 MiB page removes one level from *both* walks and covers 512× more memory per TLB entry, attacking the problem from both directions at once.

> **Always quote both figures together — 24 accesses and >95% hits.** One without the other misrepresents the design, as Question 6 explains.

---

### Question 10 — Three-stage address translation

**Q:** A guest process accesses guest virtual address `0x401ABC`. The guest page table maps that page to guest pseudo-physical frame `0x2F5`. The VM's EPT maps guest pseudo-physical frame `0x2F5` to host physical frame `0x8A31C`.

1. Give the page offset and the guest pseudo-physical address.
2. Give the host physical address.
3. What is invariant across both translation stages, and why?
4. Which table is maintained by whom, and what guarantee does that division provide?

**Answer & Explanation:**

**1 — Offset and guest pseudo-physical address.** With 4 KiB pages the offset is the low 12 bits:

```
offset = 0x401ABC & 0xFFF = 0xABC
GPA    = (0x2F5 << 12) | 0xABC = 0x2F5000 | 0xABC = 0x2F5ABC
```

**2 — Host physical address.** The second stage translates the *frame*, and the offset is carried through again:

```
HPA = (0x8A31C << 12) | 0xABC = 0x8A31C000 | 0xABC = 0x8A31CABC
```

So the full chain is:

```
guest virtual        0x401ABC
  -- guest page table (guest OS) -->
guest pseudo-physical 0x2F5ABC
  -- EPT (hypervisor) -->
host physical        0x8A31CABC
```

**3 — What is invariant.** The **page offset `0xABC` is preserved through both stages, untranslated.** Translation operates on **frame numbers only**; the low 12 bits are never touched. That is not an implementation convenience — it is *why* the translation granularity **is** the page size, and it holds at every level of the hierarchy. Note the consequence: the guest's byte-level layout within a page is exactly reproduced in host physical memory, so a structure spanning a page boundary is contiguous in the guest and may be **discontiguous in host physical memory** — which is precisely why emulated DMA must translate each page separately rather than assuming one contiguous host range (Question 21).

**4 — Who maintains what, and the guarantee.**

| Table | Maintained by | Maps | Per |
|---|---|---|---|
| Guest page tables | The **guest OS**, freely and **without trapping** | guest virtual → guest pseudo-physical | guest process |
| **EPT** | The **hypervisor** | guest pseudo-physical → host physical | **VM** |

**The guarantee.** Everything the guest can write into its own page tables is a **pseudo-physical** address, and **every pseudo-physical address must pass through the EPT**. Since the hypervisor fully controls the EPT, **it can guarantee a guest only maps memory it is allowed** — no matter what the guest writes. The guest is free precisely because its freedom is expressed in a namespace the hypervisor defines.

Note also the terminology discipline: the middle stage is **pseudo-physical**, not "physical". The guest believes it is physical; using the correct term signals that you know the guest is being deceived — which, as the theory lecture puts it, is the essence of virtualisation: **the MMU is transparently configured differently from what the guest OS requested, and the guest cannot tell.**

---

### Question 11 — The Popek & Goldberg resume formula and its bounds check

**Q:** A VMM allocates a VM at `addr0 = 0x40000000` with `memsize = 0x10000000`.

1. What host physical range does the VM occupy, and how large is it?
2. The VM's `vPSW` holds `B = 0x200000`, `L = 0x4000`, `PC = 0x1240`. Give the real `PSW` the VMM loads to resume it, all four fields.
3. The guest OS asks to load the segment register with `B = 0x0FFFF000`, `L = 0x8000`. Perform the check the VMM must perform, and give the outcome.
4. If that check were omitted, what host physical address would the guest reach, and what would it find there?

**Answer & Explanation:**

**1 — The VM's allocation.**

```
range = [addr0, addr0 + memsize)
      = [0x40000000, 0x50000000)
size  = 0x10000000 = 268,435,456 bytes = 256 MiB
```

The VMM allocates **contiguous physical memory for itself, never accessible by guests**, and **contiguous physical memory per VM**, each defined by `addr0` and `memsize`.

**2 — The resume formula.** The VMM loads the real `PSW = (M, B, L, PC)` as:

| Field | Formula | Value |
|---|---|---|
| `M'` | **always `u`** | **`u`** |
| `B'` | `addr0 + vPSW.B` | `0x40000000 + 0x200000` = **`0x40200000`** |
| `L'` | `vPSW.L` | **`0x4000`** |
| `PC'` | `vPSW.PC` | **`0x1240`** |

> **The single most important field is `M'`.** It is **`u` whatever the guest believes.** `vPSW.M` records the mode the VM *thinks* it is in — `s` while the guest OS runs, `u` while a guest application runs — but the real hardware mode is **always user**, because the whole design rests on running **the guest OS in user mode** so that its privileged actions trap. Every sensitive instruction the guest OS executes therefore traps to the VMM, which is what makes safety and equivalence achievable at all.

Note also that `B'` is a **relocation**: guest pseudo-physical address 0 is host physical `addr0`, so every guest address becomes `addr0 + guest address`. `L'` needs no relocation because it is a length, not an address.

**3 — The bounds check.** Before loading any address derived from the `vPSW`, the VMM must confirm the requested segment lies wholly within the VM's allocation:

```
requested B + L = 0x0FFFF000 + 0x8000 = 0x10007000
limit           = memsize             = 0x10000000

0x10007000 > 0x10000000  ->  OUT OF BOUNDS  ->  REJECTED
```

The VMM refuses the update — it would typically inject a fault into the guest, exactly as real hardware would for an invalid segment. **The guest requested something a bare-metal machine would also have refused**, so equivalence is preserved by refusing.

**4 — If the check were omitted.** The VMM would compute:

```
B' = addr0 + 0x0FFFF000 = 0x4FFFF000
the segment would then extend to 0x4FFFF000 + 0x8000 = 0x50007000
```

The VM's allocation **ends at `0x50000000`**, so the final `0x7000` bytes — 28 KiB — lie **outside it**. What the guest would find there depends on the host's layout: another VM's memory, or the **VMM's own memory**, which is the catastrophic case. Either way this is a **VM escape**: a guest reading or writing another guest's memory breaks isolation between VMs, and a guest reaching VMM memory breaks isolation from the hypervisor and hands over control of the machine.

**Which requirement this is.** **Safety** — the VMM must be in complete control of the hardware at all times, with **no assumptions made about guests, which may be malicious**, enforcing isolation between a VM and the VMM/hardware **and between VMs themselves (no shared state)**. Note that the guest doing this is not a bug in the guest; a **malicious** guest OS will deliberately request out-of-range segments, and the model explicitly assumes it might. This is why the theory says the VMM must **check** as well as **emulate**: emulation alone gives equivalence, and only the check gives safety. Question 21 is this same missing check in a modern hypervisor's DMA emulation.

---

### Question 12 — MMIO register addressing and trap behaviour

**Q:** A fully emulated Intel 82540EM NIC has its registers mapped at physical base `0xfebc0000`. Compute the physical address the CPU accesses for each register below, and explain what happens on each access in a VM.

| Register | Offset | Purpose |
|---|---|---|
| `ICR` | `0xC0` | Interrupt Cause Read |
| `RDBAL` / `RDBAH` | `0x2800` / `0x2804` | Receive ring base, low / high |
| `RDLEN` | `0x2808` | Receive ring length |
| `RDH` / `RDT` | `0x2810` / `0x2818` | Receive ring head / tail |
| `TDBAL` / `TDBAH` | `0x3800` / `0x3804` | Transmit ring base, low / high |

**Answer & Explanation:**

**1 — The addresses.** MMIO addressing is simply `base + offset`:

| Register | Computation | Physical address |
|---|---|---|
| `ICR` | `0xfebc0000 + 0xC0` | **`0xfebc00c0`** |
| `RDBAL` | `0xfebc0000 + 0x2800` | **`0xfebc2800`** |
| `RDBAH` | `0xfebc0000 + 0x2804` | **`0xfebc2804`** |
| `RDLEN` | `0xfebc0000 + 0x2808` | **`0xfebc2808`** |
| `RDH` | `0xfebc0000 + 0x2810` | **`0xfebc2810`** |
| `RDT` | `0xfebc0000 + 0x2818` | **`0xfebc2818`** |
| `TDBAL` | `0xfebc0000 + 0x3800` | **`0xfebc3800`** |
| `TDBAH` | `0xfebc0000 + 0x3804` | **`0xfebc3804`** |

**2 — What happens on each access.** These look like ordinary memory accesses to the guest driver, and that is the point — but under full emulation **every one of them traps**:

1. The hypervisor arranges that MMIO accesses cannot proceed silently: **MMIO memory is mapped read-only or not mapped at all**, so the guest's load or store **faults**. (PIO, the other mechanism, uses **sensitive instructions** — `IN`/`OUT` — so it traps naturally without any mapping trick.)
2. The fault causes a **vmexit** — an EPT violation or an I/O exit depending on the mechanism.
3. KVM passes the access to **Qemu**, which **reproduces the real NIC's documented behaviour in software** — in under two thousand lines of code for this device.
4. Work is **deferred to the device thread**, the guest **resumes**, and the hypervisor **injects an interrupt** when the operation completes.

**3 — Why these particular registers are the interesting ones.** `RDBAL`/`RDBAH`/`RDLEN`/`RDH`/`RDT` are exactly the **ring buffer description** from the physical I/O model: base address (split across two 32-bit registers), length, and the head and tail pointers. So the guest sets up a producer–consumer ring **in its own pseudo-physical memory** and tells the device where it is by writing these registers.

That is the crucial asymmetry for performance: **the ring buffer slots live in guest RAM and are written without any trap**, but **every register access traps**. So the cost of an I/O operation is driven by how many *register* accesses it needs, not by how much data moves — which is exactly why sending one Ethernet frame with an e1000 costs **several vmexits**, and why virtio's contribution is an **optimised ring implementation that minimises them**. Question 13 quantifies it.

**4 — Why this device.** The 82540EM is **very old but widespread, so any modern OS has the driver** (`e1000`). That is a deliberate equivalence choice: emulating an obsolete NIC that every guest already supports means **unmodified guests work with no PV drivers installed** — the top row of Question 8's spectrum, buying maximum compatibility at the cost of maximum vmexits. Running `lspci` inside a Qemu/KVM VM shows both strategies side by side: an emulated 82540EM and a paravirtualised virtio device.

---

### Question 13 — The cost of vmexits, and what virtio buys

**Q:** A root↔non-root transition costs 2000 cycles on a 3 GHz CPU. Transmitting one Ethernet frame through the emulated e1000 requires 5 register accesses.

1. What is the cycle and time cost of transmitting one frame, counting only transitions?
2. A workload transmits 100,000 frames per second. What fraction of one core is consumed by transitions alone?
3. virtio batches 32 frames per notification. Recompute, and give the improvement factor.
4. Verify the factor independently from the per-frame exit counts.
5. What does this tell you about where virtio's benefit comes from, and what it costs?

**Answer & Explanation:**

**1 — One frame.**

```
5 vmexits × 2000 cycles = 10,000 cycles
10,000 / 3×10^9         = 3.33 µs per frame
```

**3.33 microseconds of pure overhead per frame**, before any of the work of actually moving the data.

**2 — At 100,000 frames per second.**

```
100,000 × 5 × 2000 = 1,000,000,000 cycles per second
1×10^9 / 3×10^9    = 0.333 seconds of CPU per second of wall time
                   = 33.3% of one 3 GHz core
```

**A third of a core burned on transitions alone** — not on emulating the device, not on copying data, purely on crossing the boundary. And 100,000 frames per second is modest: it is roughly 1.2 Gbit/s at full-size frames, well below what the emulated device claims to be.

**3 — With virtio batching.**

```
notifications = ceil(100,000 / 32) = 3,125 per second
3,125 × 2000  = 6,250,000 cycles per second
6.25×10^6 / 3×10^9 = 0.00208 s = 0.21% of a core
```

```
improvement = 1,000,000,000 / 6,250,000 = 160×
```

**From 33.3% of a core to 0.21%.**

**4 — Independent verification.** Compare exits per frame directly:

```
full emulation: 5 exits per frame
virtio:         1 exit per 32 frames = 0.03125 exits per frame
ratio         = 5 / (1/32) = 5 × 32 = 160×   ✓
```

The two routes agree, which is the check worth doing — the factor is just the product of the two independent savings: **5× from needing fewer register accesses per operation, and 32× from amortising one notification over a batch.**

**5 — Where the benefit comes from, and what it costs.** Note what virtio does **not** do: it does not make data movement faster, and it does not reduce the number of frames. **The entire gain is in not crossing the boundary** — a virtual device designed **specifically to minimise overhead, corresponding to no real physical device**, with an **optimised ring buffer implementation minimising vmexits**. The ring slots were always writable without trapping (Question 12); virtio restructures the protocol so that the *notifications* are batched too.

The cost is stated plainly in the spectrum: it **requires PV drivers in the guest**, i.e. **modifying the guest OS**, so **equivalence is compromised**. This is the same trade as paravirtualisation in Question 4, made deliberately and at a much smaller scale — you modify a driver, not the guest's core. And because virtio is so widely used, the drivers **ship in Linux already**, which is what makes the equivalence cost tolerable in practice: the guest is "modified" only in the sense that it already contains the modification.

> **The pattern to recognise.** This is the same fast-path/slow-path reasoning as Chapter 3's futexes and userspace `malloc`: **identify the common case, handle it without crossing the expensive boundary, and pay the crossing only when genuinely necessary.** Here the boundary costs thousands of cycles instead of hundreds, so the payoff is correspondingly larger.

---

### Question 14 — Density, footprint, and the honest qualification

**Q:** A host has 128 GiB of RAM. Systems-software overhead per instance is 512 MiB for a traditional VM, 32 MiB for a micro VM, and 2 MiB for a container.

1. How many instances of each fit, counting systems overhead only?
2. Now suppose the application itself needs 256 MiB. Recompute for traditional VMs and containers, and give the revised density advantage.
3. Compare booting 1000 instances serially at 10 s per VM versus 50 µs per container.
4. What is the honest qualification the lecture attaches to these metrics, and what does part 2 demonstrate about it?

**Answer & Explanation:**

**1 — Systems overhead only.** `128 GiB = 131,072 MiB`:

| Instance type | Overhead | Instances |
|---|---|---|
| Traditional VM | 512 MiB | `131,072 / 512` = **256** |
| Micro VM | 32 MiB | `131,072 / 32` = **4,096** |
| Container | 2 MiB | `131,072 / 2` = **65,536** |

Container versus traditional VM: **256× the density**. These are the targets the lecture states — **KBs to a few MBs** per lightweight instance against **hundreds of MBs to GBs** for a traditional VM.

**2 — Including a 256 MiB application.**

| Instance type | Total per instance | Instances |
|---|---|---|
| Traditional VM | `512 + 256` = 768 MiB | `131,072 / 768` = **170** |
| Container | `2 + 256` = 258 MiB | `131,072 / 258` = **508** |

```
revised advantage = 508 / 170 = 2.99×
```

**The density advantage collapses from 256× to about 3×.**

**3 — Boot time for 1000 instances, serially.**

```
VMs:        1000 × 10 s    = 10,000 s = 166.7 minutes
containers: 1000 × 50 µs   = 0.050 s
ratio:      10 / 50×10^-6  = 200,000×
```

Container boot is **just spawning a process — microseconds** — which is why **serverless computing depends on that speed**: a platform charging per invocation cannot spend ten seconds booting.

**4 — The qualification, and what part 2 shows.**

> **These metrics concern the *systems software*. The portion of boot time and memory/disk footprint attributable to the application itself is unchanged.**

Part 2 is that qualification made quantitative, and it is the most useful thing in this question. **The lightweight advantage is a fixed saving, not a multiplier**, so its significance depends entirely on how it compares with the application's own demands:

* A **small** application — a microservice, a function, a static server — is dominated by systems overhead, and the 256× figure is close to real.
* A **large** application — a JVM, a database, an ML model — dwarfs the systems overhead, and the advantage shrinks toward 1×. At a 4 GiB application the difference between 512 MiB and 2 MiB of overhead is about 12%.

**Quoting "containers are 256× denser" without this qualification is the trap.** The right formulation is that lightweight virtualisation removes a **fixed per-instance cost**, which matters enormously for **many small instances** and hardly at all for **few large ones**.

**How this connects to the security argument.** Question 7 established that containers isolate less strongly, and that the industry response — **running containers inside micro VMs** — **kills most of the lightweightness benefit**. Now quantify that: moving from a container to a micro VM takes overhead from 2 MiB to 32 MiB, so density falls from 65,536 to 4,096, a **16× loss** on systems footprint alone. But with the 256 MiB application in part 2, the same move goes from 508 to `131,072/288` = 455 instances — a **10% loss**. So the micro-VM compromise is expensive for exactly the workloads containers were best at (many tiny instances) and nearly free for larger ones. That is a genuinely useful thing to be able to say about when Kata-style isolation is worth paying for, and it is the reasoning that motivates unikernels as the attempt to get **both** properties at once.

---

## Part 3: Code Tracing & Output Prediction

### Question 15 — Tracing a guest application's system call (P&G Case B)

**Q:** A VMM has allocated a VM at `addr0 = 0x40000000`, `memsize = 0x10000000`. The state is:

* Currently running: a **guest application**, with `vPSW = (M:u, B:0x100000, L:0x8000, PC:0x240)`.
* The guest's own trap-entry PSW, stored at **guest-physical** `MEM[1]`, is `(M:s, B:0x0, L:0x10000000, PC:0x9000)`.

The guest application executes a **system call**. Trace what the VMM does, giving every value, and state the final real `PSW` and `vPSW`.

**Answer & Explanation:**

**Step 0 — which case is this?** The VMM inspects **`vPSW.M`**. It is **`u`**, so the trap came from a **guest application**, not the guest OS. This is **Case B**: the application is making a syscall (or doing something illegal), so **the guest OS should handle it**, and the VMM's job is to **emulate what the hardware would have done natively — but within the VM's memory.**

**Step 1 — record where the guest was.**

```
vPSW.PC <- PSW.PC = 0x240
```

**Step 2 — save the application's state at the guest's `MEM[0]`.** Natively, a trap saves the PSW into `MEM[0]`. The guest's `MEM[0]` is guest-physical address 0, which is **host physical `addr0`**:

```
MEM[addr0] <- vPSW
MEM[0x40000000] <- (M:u, B:0x100000, L:0x8000, PC:0x240)
```

**Step 3 — load the guest OS's trap-entry state from the guest's `MEM[1]`.** Natively a trap loads the new PSW from `MEM[1]`; here that is host physical `addr0 + 1`:

```
vPSW <- MEM[addr0 + 1] = MEM[0x40000001]
vPSW  = (M:s, B:0x0, L:0x10000000, PC:0x9000)
```

**after checking the validity of `B` and `L`:** `0x0 + 0x10000000 = 0x10000000 ≤ memsize` ✓, so the guest OS's own trap-entry segment is within its allocation and may be loaded.

**Step 4 — load the real PSW to resume the VM, now running its kernel.**

| Field | Formula | Value |
|---|---|---|
| `M'` | **always `u`** | **`u`** |
| `B'` | `addr0 + vPSW.B` = `0x40000000 + 0x0` | **`0x40000000`** |
| `L'` | `vPSW.L` | **`0x10000000`** |
| `PC'` | `vPSW.PC` | **`0x9000`** |

**The final state:**

```
real PSW = (M:u,  B:0x40000000, L:0x10000000, PC:0x9000)
vPSW     = (M:s,  B:0x0,        L:0x10000000, PC:0x9000)
```

**The two observations that carry the marks.**

**`vPSW.M` is now `s` but the real `M'` is `u`.** The guest OS is about to run its trap handler believing itself to be in supervisor mode with access to all of "physical" memory (`B:0`, `L:memsize`). In reality it runs in **user mode**, with its segment relocated to `addr0`. It is privileged only within a namespace the VMM defines — which is exactly why every privileged instruction it now executes will trap, and why the VMM can remain in control.

**The VMM has reproduced the model's own trap mechanism one level up.** Compare Step 2 and Step 3 with the native behaviour from the model: *save the PSW into `MEM[0]`, load a new PSW from `MEM[1]`*. The VMM performs precisely that, with **every guest-physical address relocated to `addr0 + address` and checked against `memsize`**. The guest OS's handler will find its state saved exactly where the architecture says it should be, so it works **unmodified** — which is **equivalence** — while every address involved has been checked — which is **safety**.

**One further requirement this trace depends on.** The VMM could only choose Case B because it knew `vPSW.M` was `u`. Keeping that field accurate means the VMM **must track user/supervisor transition instructions** such as syscalls and returns from traps. Fortunately such transition instructions **are sensitive**, so under the theorem they trap and tracking is possible. Without it, the VMM could not tell whether a later trap came from the guest OS or a guest application, and so could not emulate correctly at all.

---

### Question 16 — Tracing a guest OS privileged instruction (P&G Case A)

**Q:** Same VM: `addr0 = 0x40000000`, `memsize = 0x10000000`. Now the **guest OS** is running, with `vPSW = (M:s, B:0x0, L:0x10000000, PC:0x9000)`.

1. The guest OS executes an instruction loading the segment register with `B = 0x200000`, `L = 0x4000`, in order to run one of its applications. Trace the VMM's handling and give the resulting real `PSW`.
2. A **malicious** guest OS instead requests `B = 0x0FFFF000`, `L = 0x8000`. Trace what happens.
3. What is the significance of the `vPSW.PC++` step, and why does it appear in this case but not in Question 15?

**Answer & Explanation:**

**1 — The legitimate request.**

**Step 0 — which case?** `vPSW.M` is **`s`**, so **the guest OS caused the trap**: a **sensitive instruction** trapped and the VMM must handle it. This is **Case A**.

**Step 1 — check the requested segment against the VM's allocation.**

```
B + L = 0x200000 + 0x4000 = 0x204000
0x204000 ≤ memsize (0x10000000)   ->  WITHIN BOUNDS, accept
```

**Step 2 — update the virtual state.**

```
vPSW.B <- 0x200000
vPSW.L <- 0x4000
```

**Step 3 — advance past the emulated instruction.**

```
vPSW.PC++     (the instruction has been emulated; resume at the next one)
```

**Step 4 — reload the real PSW.**

| Field | Formula | Value |
|---|---|---|
| `M'` | always `u` | `u` |
| `B'` | `addr0 + vPSW.B` = `0x40000000 + 0x200000` | **`0x40200000`** |
| `L'` | `vPSW.L` | **`0x4000`** |
| `PC'` | `vPSW.PC` | `0x9001` (one past the trapping instruction) |

> **This step is the essence of virtualisation, in one sentence: the MMU is transparently configured differently from what the guest OS requested — and the guest cannot tell.** The guest asked for base `0x200000` and the hardware got base `0x40200000`. Every subsequent read the guest makes of the segment register must therefore also be intercepted and given the **emulated** value `0x200000`, or the deception would be visible — which is why **behaviour-sensitive instructions must trap too**, and why that requirement is about **equivalence** rather than safety.

**2 — The malicious request.**

```
B + L = 0x0FFFF000 + 0x8000 = 0x10007000
0x10007000 > memsize (0x10000000)   ->  OUT OF BOUNDS
```

The VMM **rejects the update**. `vPSW.B` and `vPSW.L` are left unchanged, nothing is loaded into the real segment register, and the VMM injects a fault into the guest — exactly what bare-metal hardware would do for an invalid segment, so **equivalence is preserved by refusing**.

Had the check been omitted, `B'` would have been `0x40000000 + 0x0FFFF000 = 0x4FFFF000`, and the segment would have extended to `0x50007000`. The VM's allocation **ends at `0x50000000`**, so the last **28 KiB** would lie outside it — in another VM's memory or in the **VMM's own**. That is a **VM escape**, and a loss of **safety**.

Note that this is not a guest bug to be tolerated. The model's requirements state explicitly that **no assumptions are made about guests, which may be malicious** — so a guest deliberately requesting an out-of-range segment is an expected input, not an anomaly. Question 21 shows the same missing check in a modern hypervisor.

**3 — The significance of `vPSW.PC++`.**

In **Case A** the VMM has **emulated the trapping instruction** — it did what the instruction asked, safely, in software. The instruction is therefore **complete**, and execution must resume at the **following** instruction. Without the increment the guest would re-execute the same segment-load forever, trapping each time: an infinite loop.

In **Case B** the trapping instruction is a **syscall**, which the VMM does **not** emulate — it hands control to the **guest OS's handler**, and the guest OS is responsible for deciding where to resume. The saved `vPSW.PC` in `MEM[addr0]` is precisely the information the guest's handler needs to do that, so advancing it would corrupt the state the guest expects. Hence the asymmetry:

| Case | Who completes the operation | `vPSW.PC` |
|---|---|---|
| **A** — guest OS trapped | The **VMM** emulates it | **Incremented** — resume after it |
| **B** — guest app trapped | The **guest OS** handles it | **Saved unchanged** to `MEM[addr0]` for the guest's handler |

---

### Question 17 — Ring buffer index arithmetic

**Q:** Give the exact output. Then explain the one subtlety that makes the occupancy calculation correct.

```c
#include <stdio.h>
#define N 8

struct ring {
    unsigned head, tail;
    int slot[N];
};

static int push(struct ring *r, int v) {
    if ((r->tail + 1) % N == r->head)          /* full */
        return -1;
    r->slot[r->tail] = v;
    r->tail = (r->tail + 1) % N;
    return 0;
}

static int pop(struct ring *r, int *out) {
    if (r->head == r->tail)                    /* empty */
        return -1;
    *out = r->slot[r->head];
    r->head = (r->head + 1) % N;
    return 0;
}

int main(void) {
    struct ring r = { .head = 6, .tail = 6 };
    int v, i;

    for (i = 0; i < 4; i++)
        printf("push %2d -> %d\n", 10 * i, push(&r, 10 * i));

    printf("head=%u tail=%u\n", r.head, r.tail);

    for (i = 0; i < 2; i++) {
        pop(&r, &v);
        printf("pop -> %d\n", v);
    }

    printf("head=%u tail=%u occupancy=%u\n",
           r.head, r.tail, (r.tail - r.head) % N);
    return 0;
}
```

**Answer & Explanation:**

**The pushes.** Starting `head = tail = 6`, so the ring is **empty**:

| Push | Full check | Slot written | New `tail` | Returns |
|---|---|---|---|---|
| `0` | `(6+1)%8 = 7 ≠ 6` | `slot[6] = 0` | 7 | 0 |
| `10` | `(7+1)%8 = 0 ≠ 6` | `slot[7] = 10` | **0** — wraps | 0 |
| `20` | `(0+1)%8 = 1 ≠ 6` | `slot[0] = 20` | 1 | 0 |
| `30` | `(1+1)%8 = 2 ≠ 6` | `slot[1] = 30` | 2 | 0 |

All four succeed, and `tail` has **wrapped past the end of the array** — the whole point of a circular buffer.

**The pops.** `head = 6`, `tail = 2`, so not empty:

| Pop | Reads | New `head` | Prints |
|---|---|---|---|
| 1st | `slot[6]` = 0 | 7 | `0` |
| 2nd | `slot[7]` = 10 | **0** — wraps | `10` |

**Final occupancy:** `(2 - 0) % 8 = 2` — the two elements at `slot[0]` and `slot[1]`, values 20 and 30.

**Exact output:**

```text
push  0 -> 0
push 10 -> 0
push 20 -> 0
push 30 -> 0
head=6 tail=2
pop -> 0
pop -> 10
head=0 tail=2 occupancy=2
```

**The subtlety that makes the occupancy calculation correct.** `head` and `tail` are **`unsigned`**, and `(r.tail - r.head) % N` is evaluated in unsigned arithmetic. When `tail < head` — for instance `tail = 2`, `head = 6` at the midpoint of this trace — the subtraction **wraps modulo 2³²** rather than going negative:

```
2 - 6  ->  4,294,967,292   (2^32 - 4)
4,294,967,292 % 8 = 4      -> correct occupancy
```

This works **only because `N` is a power of two that divides 2³²**. Since `2^32 mod 8 = 0`, reducing modulo 8 after the wrap gives the same answer as the true mathematical difference modulo 8. Change `N` to 6 and the expression silently produces garbage whenever `tail < head`: `(2-6) mod 2^32 = 4294967292`, and `4294967292 % 6 = 0`, not the correct 2. With **signed** integers it would be worse still, since `-4 % 6` is `-4` in C — a negative "occupancy", and if used as an index, an out-of-bounds access.

**Why this matters for virtualisation specifically.** Ring buffers are how **all bulk I/O** works: the ring is **described in the device's registers, which the CPU sets up with MMIO/PIO** — base, length, head and tail — with the **device consuming from `head`** and the **CPU producing at `tail`**. Under full emulation or virtio, **the hypervisor is the consumer of a ring the guest produces into**, and the guest controls `tail` and the ring contents.

So a hypervisor that computes occupancy or indices from **guest-supplied** head/tail values is performing exactly this arithmetic **on attacker-controlled inputs**. If `N` is not a power of two, if the sign is wrong, or if the resulting index is not bounds-checked against the ring length, the guest chooses where the hypervisor reads or writes — a **VM escape**. Question 22 is that bug.

---

### Question 18 — What the guest sees inside a container

**Q:** A container is started with a new PID, mount, UTS and network namespace. Predict the output of each command **inside** the container, and say what the **host** sees for the same thing. Which mechanism is responsible in each case?

```bash
# inside the container
echo $$
hostname
ps -e --no-headers | wc -l
ls /
cat /sys/fs/cgroup/memory.max
ip -o link show | wc -l
id -u
```

**Answer & Explanation:**

| Command | Inside the container | On the host | Mechanism |
|---|---|---|---|
| `echo $$` | **`1`** — the shell is PID 1 | A large PID, e.g. `28431` | **PID namespace** |
| `hostname` | The container's own name, e.g. **`a3f9c1b2e4d5`** | The host's hostname | **UTS namespace** |
| `ps -e \| wc -l` | **A handful** — only the container's own processes | Hundreds | **PID namespace** |
| `ls /` | The **container image's** root filesystem — possibly a **Fedora** layout on a **Debian** host | The host's root filesystem | **Mount namespace** |
| `cat .../memory.max` | The configured limit, e.g. **`536870912`** (512 MiB) | The host's own value | **cgroups** |
| `ip -o link show \| wc -l` | **2** — loopback plus one virtual interface | Many: physical NICs, bridges, every container's veth | **Network namespace** |
| `id -u` | **`0`** — root *inside* the container | The unprivileged mapped UID, e.g. `100000` | **User namespace** |

**The two halves of the mechanism, visible in the table.** Every row except one is **namespaces restricting visibility** — what the container can *see*. The `memory.max` row is **cgroups controlling resource allocation** — what it can *use*. Keeping that split clean is the examinable point: **namespaces = visibility, cgroups = resources.**

**The three rows worth dwelling on.**

**`echo $$` printing `1`.** The container's init process genuinely *is* PID 1 in its namespace, and the same task has a different PID on the host — one task, two identities. Two consequences follow. Software that special-cases PID 1 (init systems, zombie reaping) behaves differently inside a container. And **`kill` cannot reach outside**: a PID that does not exist in the namespace cannot be named, which is isolation by construction, exactly as with an unmapped memory address.

**`ls /` showing a different distribution.** This is why **you can run a Fedora rootfs in a container on a Debian host**: only *userspace* differs, because the **kernel is shared**. It is also the precise limit of the technique — you cannot run Windows, or a different kernel version, which is why **VMs win on OS diversity and kernel version flexibility**.

**`id -u` printing `0`.** The container's root is root *only within its user namespace*, mapped to an unprivileged host UID. This matters enormously for the threat model: with user namespaces, a container escape lands the attacker as an unprivileged host user; **without** them — a container run as host root — an escape lands as **host root**. Question 23 is that misconfiguration.

**How this connects to the isolation argument.** Everything in this table is enforced by **kernel bookkeeping**, not by hardware. The MMU still isolates the container's memory perfectly well, so a **direct** attack on another container is blocked exactly as it would be for any process. But every one of these views is maintained by kernel code reached through **hundreds of system calls, some — like `ioctl` — with thousands of sub-functions**. A bug anywhere in that surface can make a namespace leak, and **syzkaller regularly finds bugs there**. That is the whole four-step argument from Question 7, and this table is what it is arguing about: the isolation is real, and its trusted computing base is the entire syscall interface.

---

### Question 19 — Which operations cause a vmexit?

**Q:** For each guest operation, state whether it causes a **vmexit** on a modern VT-x + EPT system, and give the reason. Where the answer differs under shadow paging or full device emulation, say so.

1. A guest application executes `ADD %rax, %rbx`.
2. A guest application executes a **system call** into the guest OS.
3. The guest OS **writes a page table entry** in its own page tables.
4. The guest OS reads `%cr3`.
5. The guest writes a **descriptor into a virtio ring buffer** in guest RAM.
6. The guest writes the virtio **notification register**.
7. The guest writes the emulated e1000's `RDT` register at `0xfebc2818`.
8. The guest executes `CPUID`.
9. The guest executes `HLT`.
10. The guest executes `VMCALL`.
11. The guest accesses a page whose **EPT entry is not present**.
12. A **host timer interrupt** fires while the guest is running.

**Answer & Explanation:**

| # | Operation | Vmexit? | Reason |
|---|---|---|---|
| 1 | `ADD` | **No** | **Innocuous** — neither changes system state nor depends on it. This is **direct execution**: the fast path, running natively on the physical CPU |
| 2 | Guest app **syscall** | **No** | The guest OS runs in **non-root ring 0**, the privilege level it was designed for. The transition is app→OS **entirely inside the VM** — rings are **orthogonal** to root mode |
| 3 | Guest OS **writes its own PTE** | **No** (with EPT) | The guest **maintains its page tables freely, without trapping**. Everything it writes is **pseudo-physical**, constrained by the hypervisor's EPT. **Under shadow paging: YES** — and this was **over 90% of all vmexits** |
| 4 | Reads `%cr3` | **No** | Sensitive, but **implemented by the CPU on the non-root duplicate of the CPU state** — option 2 of the restated theorem. It returns the guest's own value |
| 5 | Writes a **virtio ring descriptor** | **No** | The ring lives in **ordinary guest RAM**. This is exactly why ring buffers are the basis of bulk I/O — the *data path* is trap-free |
| 6 | Writes the virtio **notification register** | **Yes** | A register access, so it must reach the hypervisor. But **one exit per batch** of descriptors, which is the whole of virtio's advantage |
| 7 | Writes emulated **`RDT`** | **Yes** | An **MMIO** access to an emulated device: the region is **mapped read-only or not mapped**, so the store **faults**. Qemu then reproduces the NIC's behaviour |
| 8 | `CPUID` | **Yes** | **Behaviour sensitive** — it reports processor features, and the hypervisor must return **virtualised** values (including the hypervisor-present bit) or **equivalence** breaks |
| 9 | `HLT` | **Yes** | **Privileged**. The guest asking to halt must not halt the physical CPU; the hypervisor deschedules the vCPU instead |
| 10 | `VMCALL` | **Yes** | A **voluntary** exit — a **hypercall**, the hypervisor's equivalent of a system call |
| 11 | **EPT entry not present** | **Yes** | An **EPT violation** exit. The hypervisor populates the mapping (or refuses) and resumes — the same on-demand paging trick as Chapter 3, one level up |
| 12 | Host **timer interrupt** | **Yes** | An **interrupt** exit. Physical interrupts are the host's, so the CPU must return to root mode for the host to handle it |

**The pattern in the answers.** Six exits, six not — and the split is not arbitrary. **Nothing on the CPU/memory fast path exits** (1, 2, 3, 4), and **nothing on the I/O data path exits** (5). Everything that exits is either a **control** operation (6, 7, 10), a **state query needing a virtualised answer** (8), a **physical resource** the guest must not touch directly (9, 12), or a **fault the hypervisor must resolve** (11).

**The two rows that carry the most weight.**

**Row 3 is the difference EPT made.** Under shadow paging every guest PTE write trapped, which produced **over 90% of vmexits** and made **VT-x slower than software virtualisation**. With EPT the count goes to zero for the same operation. That single row is why hardware CPU virtualisation went from a disappointment to the standard, and it is the concrete content of the claim that **first-generation VT-x was slower than dynamic binary translation**.

**Row 2 is the difference VT-x made.** On x86-32, with the guest OS forced into ring 3, a guest syscall had to be intercepted — and syscalls are **very frequent**, which was listed as one of the three problems. Because **rings are orthogonal to root mode**, the guest OS sits in non-root ring 0 and app↔OS transitions never leave the VM. **Ring aliasing was eliminated outright rather than worked around.**

**And the reason any of this is designed so carefully:** each exit costs **thousands of cycles**. Question 13 shows that 5 exits per network frame consumes a third of a core at a modest frame rate. Every "No" in this table is a deliberate piece of engineering — either **direct execution**, or **hardware implementing a sensitive instruction against the non-root state copy** rather than trapping. The trade the lecture names is **hardware complexity versus performance**, and this table is where you can see what was bought.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 20 — An unbounded register index in a device model

**Q:** This is a simplified MMIO handler in a hypervisor's device model. Identify the vulnerability, explain the impact, and give a corrected version.

```c
#include <stdint.h>
#include <stddef.h>

#define NUM_REGS 64

struct dev_state {
    uint32_t regs[NUM_REGS];
    void   (*notify)(struct dev_state *);   /* callback into the device model */
    struct dev_state *next;
};

/* Called from the vmexit handler. `offset` comes from the guest's
   faulting MMIO access; `value` is what the guest tried to store. */
uint32_t dev_mmio_read(struct dev_state *d, uint64_t offset)
{
    return d->regs[offset / 4];
}

void dev_mmio_write(struct dev_state *d, uint64_t offset, uint32_t value)
{
    d->regs[offset / 4] = value;

    if (offset / 4 == 0)
        d->notify(d);
}
```

**Answer & Explanation:**

**The vulnerability.** `offset` is **entirely guest-controlled** — it is the offset within the MMIO region of the address the guest touched — and it is used to index `d->regs` **with no bounds check**. `regs` has `NUM_REGS = 64` entries, so only indices 0–63 are valid, but the guest can name any offset in the mapped region and thus any index.

**How the guest controls it.** MMIO is just a memory access: the guest driver stores to `mmio_base + offset` for any offset it likes. The access faults, causes a **vmexit**, and the hypervisor decodes the faulting address into this `offset`. **There is no filtering on the way** — the region is mapped as a whole, so any offset within it (and, depending on the decode, beyond it) arrives here.

**The impact, which is the worst case in the chapter.**

* **`dev_mmio_read` with a large offset** reads memory **past the end of `regs`**, inside the hypervisor's own address space, and **returns it to the guest**. Note what immediately follows `regs` in this structure: the **`notify` function pointer** and the **`next` pointer**. So the guest reads hypervisor **code addresses and heap addresses** — defeating whatever ASLR the hypervisor has and giving it the layout it needs for the next step.
* **`dev_mmio_write` with a large offset** writes a guest-chosen 32-bit value **past the end of `regs`**. Overwriting `notify` and then triggering the `offset/4 == 0` path gives **control-flow hijack inside the hypervisor**. Since in KVM this device model runs in **Qemu**, that is arbitrary code execution in a **host userspace process**, which is a **VM escape** — and Qemu is frequently privileged enough for that to mean the host.

This is not a hypothetical shape: it is the classic hypervisor device-model bug, and real examples (the Qemu floppy-controller flaw known as VENOM, among others) are exactly this — **an emulated device trusting a guest-supplied index or length**.

**Why the trust boundary is easy to forget here.** The code *looks* like a device model, and device registers feel like passive data. But the vmexit handler is **the hypervisor's syscall interface**: the guest is the untrusted principal, and `offset` crossed from it. Chapter 4's rule applies verbatim — **every piece of data flowing from the untrusted side is untrusted, and must be validated before use.**

**The corrected version:**

```c
uint32_t dev_mmio_read(struct dev_state *d, uint64_t offset)
{
    uint64_t idx;

    if (offset & 3)                       /* enforce 4-byte alignment */
        return 0;                         /* real hardware ignores it too */

    idx = offset / 4;
    if (idx >= NUM_REGS)                  /* THE bounds check */
        return 0;                         /* reads of absent registers return 0 */

    return d->regs[idx];
}

void dev_mmio_write(struct dev_state *d, uint64_t offset, uint32_t value)
{
    uint64_t idx;

    if (offset & 3)
        return;

    idx = offset / 4;
    if (idx >= NUM_REGS)                  /* THE bounds check */
        return;                           /* writes to absent registers are dropped */

    if (!reg_is_writable(idx)) {          /* not every register is guest-writable */
        return;
    }

    d->regs[idx] = value & reg_write_mask(idx);   /* honour read-only bits */

    if (idx == REG_CONTROL && d->notify != NULL)
        d->notify(d);
}
```

**Five properties of the fix, and why each is there.**

**The bounds check uses `>=` against the array's own count**, and `idx` is unsigned so there is no negative case to consider. This is the single change that closes the vulnerability.

**Alignment is enforced**, because a misaligned MMIO access on real hardware has defined (usually ignored) behaviour, and accepting it here would mean the emulated device diverges from the real one — an **equivalence** failure, and a way for a guest to detect that it is virtualised.

**Out-of-range accesses return 0 and drop writes rather than failing loudly**, because that is what real hardware does for unimplemented registers. Refusing in a way the guest can observe would again break equivalence. Note the general principle: **the emulated device must reject safely *and* behave exactly as the documented hardware would.**

**Read-only and reserved bits are honoured** via a per-register writable mask. A guest that can write bits real hardware ignores can drive the device model into states the real device never reaches — which is where a great many device-model bugs actually live, since those paths are the least tested.

**The function pointer is null-checked** before the indirect call. That does not fix the overflow, but it means a partially initialised device cannot be induced to call through uninitialised memory — defence in depth on the exact field the overflow was aiming at. Better still, in a real hypervisor this would be a **`const` table of operations** rather than a writable pointer in the same allocation as guest-influenced data, so that an overflow has nothing worth reaching.

---

### Question 21 — Emulated DMA without a bounds check

**Q:** This routine emulates a device's DMA write into guest memory. Identify the vulnerability, relate it to the Popek & Goldberg model, and give a corrected version.

```c
#include <stdint.h>
#include <string.h>

struct vm {
    uint8_t  *ram;        /* Qemu's malloc'd buffer = guest pseudo-physical memory */
    uint64_t  ram_size;
};

/* The guest programmed a DMA descriptor with a target guest-physical
   address and a length. Copy `len` bytes of received data there. */
void dma_write_to_guest(struct vm *vm, uint64_t gpa, const void *src, uint64_t len)
{
    memcpy(vm->ram + gpa, src, len);
}

uint32_t dma_read_from_guest(struct vm *vm, uint64_t gpa)
{
    uint32_t v;
    memcpy(&v, vm->ram + gpa, sizeof(v));
    return v;
}
```

**Answer & Explanation:**

**The vulnerability.** Both `gpa` and `len` come from a **DMA descriptor the guest wrote**, and neither is validated against `vm->ram_size`. `vm->ram + gpa` is pointer arithmetic on a **host userspace heap allocation** — recall that **guest pseudo-physical memory is just a large `malloc` in Qemu's address space** — so a `gpa` beyond `ram_size` produces a pointer **outside the guest's memory and inside Qemu's**.

**The two directions of impact.**

* **`dma_write_to_guest`** with a large `gpa`, or a `gpa` near the end plus a large `len`, writes **guest-chosen bytes into Qemu's heap** — beyond the RAM buffer, into whatever Qemu allocated next: device state structures, function pointers, allocator metadata. That is a **hypervisor heap overflow**, and hence a **VM escape**.
* **`dma_read_from_guest`** with a large `gpa` reads Qemu's memory and hands it to the guest — a **hypervisor information leak**, which is how the attacker locates the targets for the write.

**Three distinct checks are missing**, and getting all three is the point:

1. `gpa < ram_size` — the start must be inside guest RAM.
2. `gpa + len <= ram_size` — the **end** must be too. Checking only the start is the classic partial fix.
3. `gpa + len` must not **overflow**. With 64-bit unsigned arithmetic, a `gpa` and `len` that sum past 2⁶⁴ wrap to a small value, so a naive `gpa + len <= ram_size` **passes** while the individual values are enormous. This is exactly Chapter 2's signed/unsigned lesson arriving at the hypervisor boundary.

**The relation to Popek & Goldberg.** This is **precisely the check from Question 11**, in a modern hypervisor. There, the VMM had to verify `B + L ≤ memsize` before loading a guest-requested segment, and omitting it let the guest reach host physical memory outside its allocation. Here the VMM must verify `gpa + len ≤ ram_size` before performing a guest-requested transfer, and omitting it lets the guest reach host memory outside its allocation. **Same requirement, same failure, forty years apart.**

The theory names the requirement: **safety** — the VMM is in complete control of the hardware at all times, **no assumptions are made about guests, which may be malicious**, and isolation holds between a VM and the VMM **and between VMs**. And the theory names why the check is the VMM's job and cannot be delegated: **DMA bypasses the MMU**. There is no hardware translation on this path to catch a bad address, which is the same reason **physical** passthrough devices need an **IOMMU** (Question 24). Emulated DMA is software standing where the IOMMU would be, so it must do the IOMMU's job.

**The corrected version:**

```c
/* Return a checked host pointer for [gpa, gpa+len), or NULL. */
static void *gpa_to_host(struct vm *vm, uint64_t gpa, uint64_t len)
{
    if (len == 0)
        return NULL;
    if (gpa >= vm->ram_size)              /* (1) start in range */
        return NULL;
    if (len > vm->ram_size - gpa)         /* (2)+(3) end in range, no overflow */
        return NULL;
    return vm->ram + gpa;
}

int dma_write_to_guest(struct vm *vm, uint64_t gpa, const void *src, uint64_t len)
{
    void *dst = gpa_to_host(vm, gpa, len);

    if (dst == NULL)
        return -1;                        /* signal a DMA error, as hardware would */

    memcpy(dst, src, len);
    return 0;
}

int dma_read_from_guest(struct vm *vm, uint64_t gpa, uint32_t *out)
{
    const void *p = gpa_to_host(vm, gpa, sizeof(*out));

    if (p == NULL)
        return -1;

    memcpy(out, p, sizeof(*out));
    return 0;
}
```

**Why `len > vm->ram_size - gpa` rather than `gpa + len > vm->ram_size`.** This is the important detail. Because the first check has already established `gpa < ram_size`, the expression `ram_size - gpa` **cannot underflow**, and no addition is performed — so there is **nothing to overflow**. The tempting form `gpa + len > ram_size` is wrong precisely for case 3: with `gpa = 0x1000` and `len = 0xFFFFFFFFFFFFF000`, the sum wraps to `0` and the check passes. **Rearrange the inequality so the arithmetic cannot wrap, rather than adding an overflow check alongside it.**

**Two further points a complete answer makes.** All bounds checking happens in **one place**, returning a checked pointer, so a new caller cannot forget it — the pattern real hypervisors use (Qemu's address-space API does exactly this). And returning an error rather than silently clamping matters for **equivalence**: real hardware signals a DMA error for an invalid address, so the emulation should too, and clamping would let the guest write somewhere it did not ask for.

**A note on why guest-physical is not host-contiguous in general.** This model assumes one contiguous `ram` buffer, which is true for a simple Qemu configuration. In general guest pseudo-physical memory maps to **discontiguous host physical pages** (Question 10), so a transfer spanning a page boundary must be translated and bounds-checked **per page** rather than once. A hypervisor that validates only the starting address of a multi-page transfer has the same bug in a subtler form.

---

### Question 22 — A double fetch across the hypervisor boundary

**Q:** This routine processes a descriptor from a virtio ring. Identify the vulnerability, explain why the guest can win the race, and give a corrected version.

```c
#include <stdint.h>
#include <string.h>

struct vring_desc {
    uint64_t addr;
    uint32_t len;
    uint16_t flags;
    uint16_t next;
};

#define MAX_PAYLOAD 4096

/* `desc` points into GUEST memory (inside Qemu's ram buffer). */
int handle_descriptor(struct vm *vm, volatile struct vring_desc *desc)
{
    uint8_t buf[MAX_PAYLOAD];
    uint32_t len;

    len = desc->len;                                   /* FIRST fetch */
    if (len > MAX_PAYLOAD)
        return -1;                                     /* the check */

    if (dma_read_range(vm, desc->addr, buf, desc->len) < 0)   /* SECOND fetch */
        return -1;

    process(buf, len);
    return 0;
}
```

**Answer & Explanation:**

**The vulnerability.** `desc` points into **guest memory**, so every field it holds is **guest-writable at any moment**. The length is fetched **twice**: once into `len`, which is validated, and again as `desc->len` in the call that actually performs the copy. **The validated value and the used value are not the same read.** This is a **double fetch** — the TOCTTOU pattern of Chapter 4, now across the **VM/hypervisor** boundary rather than the user/kernel one.

**How the guest wins the race.**

1. A guest vCPU sets `desc->len = 64` and notifies the device.
2. The device thread executes `len = desc->len` → 64, and `64 > 4096` is false, so the **check passes**.
3. **Another guest vCPU, running concurrently on a different physical core, sets `desc->len = 0xFFFFFFFF`.**
4. The device thread reaches `dma_read_range(..., desc->len)` and re-reads the length, now enormous.
5. It copies that many bytes into `buf`, **a 4096-byte stack buffer in the hypervisor** — a hypervisor stack overflow, and a **VM escape**.

**Why the race is easy rather than tight.** This is not a narrow window the attacker must hit by luck:

* **The `volatile` qualifier guarantees the compiler re-reads it.** Without `volatile` the compiler *might* have cached the value in a register and accidentally made the code safe; `volatile` removes that accident and forces two genuine loads. It is there for correctness of device semantics and has the side effect of guaranteeing the bug.
* **Qemu/KVM runs one thread per vCPU and one thread per virtual device.** So the guest's vCPU threads and the device thread are **genuinely concurrent on different cores** — the guest does not need to win a scheduling race, it simply writes in a loop on one core while another calls in.
* **Failures are free.** A miss does nothing; the guest retries indefinitely.

**The fix — copy once, validate the copy, use the copy:**

```c
int handle_descriptor(struct vm *vm, volatile struct vring_desc *desc)
{
    uint8_t buf[MAX_PAYLOAD];
    struct vring_desc d;                    /* a HYPERVISOR-private copy */

    /* One single snapshot of the whole descriptor out of guest memory. */
    memcpy(&d, (const void *)desc, sizeof(d));

    /* Validate the copy. The guest cannot reach `d`. */
    if (d.len == 0 || d.len > MAX_PAYLOAD)
        return -1;

    /* Use the same copy throughout — `desc` is never read again. */
    if (dma_read_range(vm, d.addr, buf, d.len) < 0)
        return -1;

    process(buf, d.len);
    return 0;
}
```

**Why copying is the only real fix.** Once `d` is a **hypervisor-local** structure, **no guest vCPU has any mapping for it** — it is on the device thread's stack, outside the `ram` buffer entirely. So check-then-use becomes **atomic with respect to the attacker**, not through locking or by disabling anything, but because **the attacker has been structurally removed from the data**. This is exactly the `copy_from_user` argument from Chapter 4, and the reasoning transfers unchanged because the situation is identical: an untrusted principal supplying data by reference into memory it continues to control.

**What is *not* a fix.** Re-reading and comparing the two fetched values only narrows the window — the guest can change it a third time. Adding a lock in the hypervisor achieves nothing, because the guest is not participating in the hypervisor's locking. And using `d.len` in the call while leaving `desc->addr` in place would still be a double fetch on the **address**, which is just as exploitable via Question 21's path. **Snapshot the whole descriptor, then never touch guest memory for control data again.**

**Note the composition of the two fixes.** Even with the descriptor snapshotted, `d.addr` and `d.len` are still **attacker-chosen values** — validated as *consistent*, but not as *safe*. They must still be bounds-checked against `ram_size` inside `dma_read_range`, exactly as Question 21 requires. **The double-fetch fix makes the values stable; the bounds check makes them safe. You need both**, and confusing them is a common way to produce code that looks hardened and is not.

---

### Question 23 — A container that is not a sandbox

**Q:** Identify every security defect in this container invocation, explain the escape each enables, and give a hardened version.

```bash
docker run -d \
  --name worker \
  --privileged \
  --pid=host \
  --network=host \
  -v /:/host \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -u 0 \
  untrusted/worker:latest
```

**Answer & Explanation:**

**Defect 1 — `--privileged`.** This is the single worst flag. It grants **all Linux capabilities**, disables the **seccomp** and **AppArmor/SELinux** profiles, and gives access to **all host devices**. With it the container can `mount` filesystems, load **kernel modules**, and open `/dev/mem` or `/dev/sda` directly. Reading the raw disk device bypasses **every** file permission on the host, and loading a module is arbitrary code execution **in the kernel**. This is not a weakened sandbox; it is **no sandbox**.

**Defect 2 — `--pid=host`.** Disables the **PID namespace**, so the container sees and can signal **every host process**. Combined with the capabilities from `--privileged` it can read `/proc/<pid>/mem` of any host process — harvesting secrets from memory — or `nsenter` into another namespace. Question 18's `echo $$` would print a large host PID here rather than `1`, which is the observable symptom.

**Defect 3 — `--network=host`.** Disables the **network namespace**. The container shares the host's interfaces, so it can bind privileged ports, sniff **all** host traffic, and reach services bound to `127.0.0.1` that were assumed unreachable from outside — a very common way that "internal only" admin interfaces get exposed.

**Defect 4 — `-v /:/host`.** Mounts the **entire host filesystem** read-write. Writing `/host/etc/cron.d/x`, `/host/root/.ssh/authorized_keys`, or replacing a host binary gives **host root** directly. No exploit needed; this is just file I/O.

**Defect 5 — mounting the Docker socket.** `/var/run/docker.sock` is the **Docker daemon's API**, and the daemon runs as **root**. Anything that can talk to it can start a *new* container with `--privileged` and `-v /:/host`, so this flag alone is **equivalent to host root** even if every other flag were removed. It is the classic "container escape in one line".

**Defect 6 — `-u 0` with no user namespace.** The container runs as UID 0, and without user-namespace remapping that is **the same UID 0 as the host**. Question 18's contrast applies: with user namespaces an escape lands as an unprivileged host user; without them it lands as **host root**.

**Defect 7 — no resource limits.** No `--memory`, `--cpus` or `--pids-limit`, so **cgroups** are not constraining anything. One container can exhaust host memory, CPU or the process table — a **denial of service** against every other tenant. This is the *other* half of the container mechanism left switched off.

**Together these disable both halves of the mechanism.** Flags 2, 3, 4 and 6 defeat **namespaces** — what the container can *see*. Flag 7 defeats **cgroups** — what it can *use*. Flag 1 defeats both plus the LSM and seccomp layers. **Namespaces and cgroups are the entirety of what a container is**, so this invocation has kept the packaging and discarded the isolation.

**The hardened version:**

```bash
docker run -d \
  --name worker \
  --user 65534:65534 \                      # (6) non-root inside; not host root
  --read-only \                             # immutable root filesystem
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \  # writable scratch, no execution
  --cap-drop=ALL \                          # (1) drop every capability
  --security-opt=no-new-privileges \        # no setuid escalation inside
  --security-opt seccomp=/etc/docker/worker-seccomp.json \   # (1) syscall allowlist
  --pids-limit=128 \                        # (7) cgroups: bound the process table
  --memory=512m --memory-swap=512m \        # (7) bound memory
  --cpus=1.0 \                              # (7) bound CPU via CFS quotas
  --network=bridge -p 127.0.0.1:8080:8080 \ # (3) own netns; publish one port, locally
  -v /srv/worker/data:/data:ro \            # (4) one directory, read-only
  untrusted/worker:latest
```

with **user namespaces enabled on the daemon** (`"userns-remap": "default"` in `/etc/docker/daemon.json`), so that even the container's root maps to an unprivileged host UID.

**The principle behind every line.** Each flag re-establishes one of the two halves: `--cap-drop`, `--user`, `--read-only`, the narrow bind mount and the bridge network restrict **visibility and authority**; `--pids-limit`, `--memory` and `--cpus` restrict **resource usage** through cgroups — and note that `--cpus=1.0` works through **CFS quotas**, the scheduling-attack defence from Chapter 3.

**The honest limit of the hardening, which is the exam-relevant conclusion.** Even perfectly configured, this container's isolation rests on the **system call interface** — **hundreds of calls, some like `ioctl` with thousands of sub-functions**, where **syzkaller regularly finds bugs**. The seccomp profile is the most valuable line above precisely because it **shrinks that interface**, which is the only thing that addresses the actual weakness rather than a misconfiguration. But a kernel bug behind an allowed syscall still escapes.

So if the workload is genuinely untrusted — the name `untrusted/worker` suggests it is — the correct answer is not a longer flag list but **a different isolation boundary**: run it in a **VM**, or a **micro VM** (Kata and similar), and accept the footprint cost Question 14 quantifies. **Configuration errors are what the hardened command fixes; interface complexity is what only a hypervisor fixes.**

---

### Question 24 — Device passthrough without an IOMMU

**Q:** A host is configured to give an untrusted tenant's VM direct access to a NIC. Identify what is wrong, explain both attacks this enables, and give the corrected configuration.

```bash
# /etc/default/grub — kernel command line
GRUB_CMDLINE_LINUX="quiet splash"

# bind the NIC away from its host driver
echo 0000:03:00.0 > /sys/bus/pci/devices/0000:03:00.0/driver/unbind
echo 8086 10fb    > /sys/bus/pci/drivers/uio_pci_generic/new_id

# start the guest with the whole physical device
qemu-system-x86_64 \
  -enable-kvm -m 4096 \
  -device pci-assign,host=03:00.0 \
  -drive file=tenant.qcow2,if=virtio \
  ...
```

**Answer & Explanation:**

**What is wrong.** The kernel command line **does not enable the IOMMU** — there is no `intel_iommu=on` (or `amd_iommu=on`), and no `iommu=pt`. The device is then bound to **`uio_pci_generic`**, a generic driver that performs **no DMA isolation**, rather than to **`vfio-pci`**, which requires and uses the IOMMU. So the VM is handed **full and exclusive access to a physical device with no translation or filtering on the device's DMA or interrupts.**

**Direct device assignment has exactly two fundamental problems**, and this configuration walks into the first with no mitigation:

**Attack 1 — arbitrary DMA (the security problem).** The root cause is that **DMA bypasses the MMU and operates directly on physical memory**. The guest owns the device's registers, so it programs the device's DMA descriptors itself — and the device will faithfully read or write **any host physical address**. Neither the guest's page tables nor the **EPT** are consulted, because neither is on the DMA path. Consequences:

* The device **writes** to host physical memory belonging to the **hypervisor** or to **another tenant's VM** — a VM escape and a cross-tenant integrity breach.
* The device **reads** any host physical memory and places it where the guest can see it — a cross-tenant confidentiality breach. Because the guest can also read host memory containing another VM's pages, EPT isolation is bypassed entirely rather than defeated.

Note how thoroughly this defeats the chapter's memory virtualisation story: **EPT constrains what the guest's CPU can name, and a passthrough device is not the guest's CPU.**

**Attack 2 — arbitrary interrupt injection.** The guest can make the device **signal any interrupt vector**, not merely its own. A device raising an arbitrary vector causes the **host** to run the corresponding interrupt handler in **kernel context**, at a time and in a state the host did not expect. This is a genuine escape vector, and it is the half of the problem people forget.

**The fix — enable the IOMMU and use `vfio-pci`:**

```bash
# /etc/default/grub — then run update-grub and reboot
GRUB_CMDLINE_LINUX="quiet splash intel_iommu=on iommu=pt"

# confirm the IOMMU is actually active and the device is in its own group
dmesg | grep -e DMAR -e IOMMU
ls /sys/kernel/iommu_groups/                     # must be populated
readlink -f /sys/bus/pci/devices/0000:03:00.0/iommu_group

# bind to vfio-pci, which requires the IOMMU
echo 0000:03:00.0 > /sys/bus/pci/devices/0000:03:00.0/driver/unbind
echo vfio-pci     > /sys/bus/pci/devices/0000:03:00.0/driver_override
echo 0000:03:00.0 > /sys/bus/pci/drivers_probe

qemu-system-x86_64 \
  -enable-kvm -m 4096 \
  -device vfio-pci,host=03:00.0 \
  -drive file=tenant.qcow2,if=virtio \
  ...
```

**What the IOMMU now does — both engines, and both are needed:**

| Engine | Function | Attack it stops |
|---|---|---|
| **DMAR** — DMA remapping | **Enforces page table and EPT permissions on DMA**, so the device can only reach the VM's own memory | Attack 1 |
| **IR** — interrupt remapping | **Routes interrupts to the target VM**, so the device cannot inject into the host or another VM | Attack 2 |

> **Most answers give DMA remapping and stop.** Give both. The IOMMU addresses interrupt injection explicitly, and an answer that omits it has left half the attack surface unaddressed.

**Two operational details that are part of a correct answer.**

**IOMMU groups must be checked, not assumed.** Devices sharing an IOMMU group cannot be isolated from one another, so **the whole group must be assigned to the same VM**. Assigning one function of a multi-function device while another stays on the host means the guest can reach the host's device — a real misconfiguration, and the reason `ls /sys/kernel/iommu_groups/` appears above.

**Verify rather than trust the flag.** `intel_iommu=on` fails silently if the platform firmware has the IOMMU disabled, and the passthrough will then work perfectly while providing no protection. Checking `dmesg` for DMAR initialisation and confirming the groups are populated is what distinguishes "configured" from "effective" — the same distinction as Chapter 4's advice to verify that a privilege drop actually happened.

**The remaining problem the IOMMU does not solve.** Passthrough still has its **second** fundamental issue — **scalability**: you cannot dedicate a physical device to each VM on a host running many. That is what **SR-IOV** addresses, by having the device **present several instances of itself** — one **Physical Function** controlled by the hypervisor creating **Virtual Functions** assignable to VMs, up to **64K theoretically and around 2K on recent NICs**. And note what both approaches give up regardless of configuration: **interposition**. With the hypervisor out of the data path there is no place to implement snapshots, migration between hosts with different hardware, or the traffic inspection an emulated or paravirtualised device allows. That is the last row of Question 8's spectrum, and it is a cost no amount of correct configuration removes.

---

### Question 25 — A unikernel deployment that misunderstands its own security model

**Q:** A team migrates from containers to unikernels for security, and deploys this way. Identify what they have misunderstood, explain the consequence, and describe the correct architecture.

```
Single Unikraft unikernel image, one VM instance, containing:
  - the public-facing HTTP API
  - the session/authentication service
  - the billing service
  - the private signing key for customer tokens (embedded in the image)
All four compiled into one static binary, single address space, running in ring 0.
Justification recorded in the design document:
  "Unikernels are VMs, so the hypervisor's narrow interface gives us
   stronger isolation than containers. Fewer components than a container
   host means a smaller attack surface. Everything in one image also
   removes the network hops between services."
```

**Answer & Explanation:**

**What they got right.** The premise is sound as far as it goes: **unikernels *are* virtual machines**, so they inherit the **hypervisor's narrow interface** — a few traps rather than **hundreds of system calls with thousands of `ioctl` sub-functions** — which is exactly why they are **considered a secure alternative to containers**. Their **external** isolation genuinely is stronger than a container's.

**What they misunderstood.** They applied that argument to the **wrong boundary**. A unikernel's security properties are:

* **Strong isolation *between* unikernel instances** — enforced by the hypervisor.
* **No isolation *inside* one instance** — because the design is deliberately **single binary, single address space, application and kernel both in ring 0, so no user/kernel protection is needed** and system calls are function calls.

Dropping user/kernel protection is **defensible**, but only for the reason the lecture gives: **only a single application runs per instance, and inter-application isolation is already enforced by running applications as separate unikernel instances.** That justification is a **precondition, not a general licence** — and this deployment has violated it. Four distinct services with four distinct trust levels now share one address space with **nothing whatsoever between them**.

**The consequence.** A single memory-safety bug in the **public-facing HTTP parser** — the component most exposed to untrusted input, and historically the likeliest to have one — yields:

* **The entire instance**, because there is no user/kernel boundary and no inter-service boundary. The attacker is already in ring 0 of that VM.
* **The private signing key**, which is in the same address space and reachable with a plain memory read. No privilege escalation is required, because there is no privilege to escalate to.
* **The billing and authentication logic**, directly callable — and since **system calls are function calls**, so is everything else. The performance property they wanted *is* the absence of the boundary they needed.

So a bug that in a well-architected container deployment would compromise one service has here compromised **all four plus the key material**. This is the honest trade the lecture insists on stating: **strong isolation between unikernels, none inside one.** It is also, precisely, the OS-models observation from Chapter 4 — unikernels sit on the **faster, less secure** side of the design space because they **drop user/kernel protection**, with **external isolation strong and internal isolation absent**.

**Two further errors in the justification.**

**"Fewer components means a smaller attack surface" conflates two different measures.** Attack surface is a property of the **interface** an attacker can reach, not of the component count. Merging four services **removes internal boundaries**, which *increases* what a single reachable bug yields even as it reduces total lines of code. This is Chapter 4's point that reachability, not line count, is what matters.

**"Removes the network hops between services" is a statement of the problem, not a benefit.** Those hops *were* the security boundary. Replacing an authenticated network call between isolated services with a function call inside one address space is exactly the deprivileging step run in reverse.

**The correct architecture — one service per unikernel:**

```
Four unikernel instances, one service each, on the same hypervisor:

  [ HTTP API      ]  <- public; no key material; minimal image
  [ Auth service  ]  <- reachable only from the API instance
  [ Billing       ]  <- reachable only from the API instance
  [ Signing svc   ]  <- holds the key; exposes ONLY "sign this token"

  - Isolation between instances: hypervisor traps + EPT, as for any VM
  - Communication: explicit, authenticated, minimal interfaces
    (virtio-vsock or a virtual network), NOT function calls
  - The signing key never leaves its instance; callers get signatures,
    never the key
  - Each image contains only what its one service needs
```

**Why this is the design the technology actually asks for.** It satisfies the **single purpose** property — one application per instance, and *"want to run several? Run several unikernels"* — which is what makes dropping internal protection legitimate in the first place. Each instance's **narrow hypervisor interface** now separates components that genuinely do not trust each other, so the strong property is applied where it does work. And the compromise of the HTTP parser now yields **the HTTP parser**: the attacker holds one instance with no key material and must attack a **deliberately minimal, explicitly defined** interface to go further.

The cost is real and worth naming: four instances instead of one, four sets of systems overhead, and inter-service calls that are **messages rather than function calls** — so the syscall-latency advantage applies within a service but not across them. Question 14 is how to reason about that cost, and the answer for four services is that it is trivial. **The single-address-space design buys performance inside a trust domain; it must never be used to merge two.**

**A final note on maturity, which belongs in any recommendation.** **Unlike containers — a mature and widespread production technology — unikernels are still at the stage of research prototypes**, with **Unikraft** the most mature and closest to production-ready. So the honest recommendation is not "unikernels are the secure choice" but: the isolation argument is sound, the performance evidence is genuinely strong (**Unikraft on Qemu/KVM measured slightly faster than native Linux** on a key-value store), and the ecosystem maturity is a real deployment risk to weigh against a container-in-micro-VM design that is less elegant and better supported.

---

## Answer Key Summary

**Author: Fable 5**

| # | Topic | Key answer |
|---|---|---|
| 9 | EPT walk | `4 × (4+1) + 4` = **24** accesses vs **4** native = **6×**; at 95% hits, **1.20** vs **0.20** per reference |
| 10 | Translation | offset `0xABC`; GPA **`0x2F5ABC`**; HPA **`0x8A31CABC`**; the offset is never translated |
| 11 | P&G resume | VM occupies `[0x40000000, 0x50000000)`; `B'` = **`0x40200000`**, `M'` = **`u` always**; `0x0FFFF000+0x8000` = `0x10007000` > memsize → **rejected** |
| 12 | MMIO | `ICR` = **`0xfebc00c0`**, `RDT` = **`0xfebc2818`**, `TDBAL` = **`0xfebc3800`**; every register access traps, ring slots do not |
| 13 | Vmexit cost | 5 exits = **10,000 cycles = 3.33 µs**/frame; 100k frames/s = **33.3%** of a core; virtio = **0.21%**; **160×** |
| 14 | Density | **256 / 4,096 / 65,536** instances; with a 256 MiB app **170 vs 508** → advantage collapses to **2.99×** |
| 15 | P&G Case B | real `PSW` = **`(u, 0x40000000, 0x10000000, 0x9000)`**; `vPSW.M` = **`s`** (believed) |
| 16 | P&G Case A | `B'` = **`0x40200000`**, `L'` = `0x4000`, and **`vPSW.PC++`** — absent in Case B |
| 17 | Ring buffer | `head=6 tail=2`, pops give **0** then **10**, final `head=0 tail=2 occupancy=2` |
| 18 | Container | `$$` = **1**, `id -u` = **0** (mapped), 2 interfaces; namespaces = **see**, cgroups = **use** |
| 19 | Vmexits | **No** for 1–5 (innocuous, guest syscall, guest PTE write, `%cr3`, ring slot); **Yes** for 6–12 |

**The chapter's load-bearing claims:**

* **Virtualisation** = abstraction at a widely-used interface, **identical**, **cannot be bypassed** — which maps onto **equivalence** and **safety**; the third goal, **performance**, is delivered by **direct execution**.
* **Popek & Goldberg:** `sensitive ⊆ privileged`, **and the converse holds**. **Control-sensitive → safety; behaviour-sensitive → equivalence.** `POPF` on x86-32 **fails silently**, which is why silence is worse than a fault.
* **You may compromise performance or equivalence, never safety** — because "cannot be bypassed" is part of the definition of a hypervisor.
* **VT-x duplicates CPU state into root/non-root** rather than changing instruction semantics, so **rings are orthogonal** and a guest OS runs in **non-root ring 0** — eliminating ring aliasing. **First-generation VT-x was slower than dynamic binary translation**: hardware support bought **simplicity and safety** first.
* **Shadow paging caused over 90% of vmexits**; **EPT** removed them by constraining the guest's *namespace* instead of policing its *operations*. Quote **24 accesses and >95% TLB hits together**.
* Guest pseudo-physical memory **is a `malloc` in a host userspace process** — which is why an unchecked guest offset is a hypervisor heap overflow.
* **The IOMMU has two engines** — **DMAR** for DMA, **IR** for interrupts. **SR-IOV** solves scalability, not security. Both lose **interposition**.
* **Containers:** **namespaces = visibility, cgroups = resources**. Their weakness is **interface complexity, not missing hardware isolation** — hundreds of syscalls with thousands of `ioctl` sub-functions, versus a few hypervisor traps.
* **Unikernels:** **single purpose, single process, single address space**; **syscalls become function calls**; **strong isolation between instances, none inside one** — so one service per instance, always. Still **research prototypes**, Unikraft the most mature.
