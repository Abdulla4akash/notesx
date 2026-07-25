---
subject: COMP60261
chapter: 6
title: "Week 6"
language: en
---

# COMP60261 — Week 6: Virtualisation

**Scope:** what virtualisation is and why it exists, the formal theory of when it is possible, how CPU, memory and I/O are virtualised in practice, and lightweight alternatives based on containers.

**Covers lectures:** 27 Virtualisation Introduction · 28 The Theory of Virtualisation · 29 CPU and Memory Virtualisation · 30 I/O Virtualisation · 31 Lightweight Virtualisation

---

## 1. Introduction

### 1.1 Definition

**Virtualisation** presents a virtual version of a resource that differs from the physical reality. Three basic transformations:

- **Multiplexing** — one physical resource presented as many virtual ones (one CPU as several vCPUs).
- **Aggregation** — many physical resources presented as one (several disks as one volume).
- **Emulation** — presenting a resource that differs in kind from what is there, possibly one that does not physically exist at all.

A **system-level virtual machine** applies this to a whole machine: the guest sees CPUs, memory, and devices, and runs an unmodified OS believing it owns hardware. The **hypervisor** (or VMM) creates and manages VMs and arbitrates the real hardware among them.

Distinguish this from **process-level VMs** (the JVM), which virtualise an execution environment for a single program rather than a machine.

### 1.2 History

The idea is old — IBM's CP/CMS and VM/370 in the 1960s–70s multiplexed expensive mainframes among users. It faded as hardware got cheap, then returned in the late 1990s when **VMware** showed x86 could be virtualised despite hardware that was not designed for it, using binary translation. Hardware support followed (Intel VT-x, AMD-V) and virtualisation became the substrate of cloud computing.

### 1.3 Type I vs. Type II

- **Type I (bare-metal)** — the hypervisor runs directly on hardware (Xen, VMware ESXi, Hyper-V). Better performance and a smaller TCB; used in production clouds.
- **Type II (hosted)** — the hypervisor runs as an application on a host OS (VirtualBox, VMware Workstation, QEMU). Easier to use and install; the whole host OS is in the TCB.

**KVM** blurs the line: a Linux kernel module turning Linux itself into a hypervisor, so it is Type I in that it sits in the kernel with direct hardware access, and Type II in that a full general-purpose OS is present.

**Memory denomination** — the terminology to keep straight, because it recurs constantly in §3:

| Term | Meaning |
|---|---|
| **Guest virtual address (GVA)** | An address inside a guest process |
| **Guest physical address (GPA)** | What the guest believes is physical memory |
| **Host physical address (HPA)** | Actual machine memory |

The guest's "physical" memory is itself virtual — the source of the two-level translation problem.

### 1.4 Use cases

- **Consolidation** — many under-utilised servers become VMs on one machine, improving utilisation and cutting power and hardware costs. The original commercial driver.
- **Cloud computing** — VMs are the unit of rental, giving each tenant an apparently private machine on shared hardware. This makes the hypervisor a **security boundary between mutually hostile tenants**.
- **Checkpoint/restart and live migration** — a VM's whole state can be saved, resumed, or moved between physical machines with minimal downtime, enabling maintenance without service interruption and load balancing.
- **Legacy support, development and testing, and running multiple OSes.**
- **Security** — strong isolation, plus **introspection**: the hypervisor can inspect a guest from outside, which malware inside the guest cannot easily subvert.

---

## 2. The theory of virtualisation

Formal treatment of when a machine can be virtualised efficiently.

### 2.1 A simplified CPU model

Assume a CPU with two privilege modes (**supervisor** and **user**), memory addressed through a relocation-bound register, and an instruction set partitioned by behaviour. Three instruction classes matter:

- **Privileged instructions** — trap if executed in user mode.
- **Sensitive instructions** — those whose behaviour depends on, or changes, the machine's configuration or privilege state (control-sensitive: changing resource configuration; behaviour-sensitive: producing different results depending on mode).
- **Innocuous instructions** — everything else.

### 2.2 Hypervisor objectives and requirements

Popek and Goldberg's three requirements:

1. **Equivalence / fidelity** — a program runs on the VM essentially as it would on real hardware.
2. **Resource control / safety** — the hypervisor retains complete control of resources; the guest cannot affect anything outside its allocation.
3. **Efficiency** — a statistically dominant fraction of instructions execute directly on the hardware without hypervisor intervention.

Efficiency is what separates a hypervisor from an emulator: an emulator interprets everything and satisfies (1) and (2) but not (3).

### 2.3 Hypervisor operation: trap-and-emulate

Run the guest OS **deprivileged** — in user mode, though it believes itself privileged. When it executes a privileged instruction, the CPU traps to the hypervisor, which inspects the instruction, emulates its effect on the guest's virtual state, and resumes the guest. Innocuous instructions run natively at full speed, which is where the efficiency comes from.

### 2.4 The theorem

**Popek and Goldberg (1974):** a virtual machine monitor may be constructed for a machine if the set of **sensitive instructions is a subset of the set of privileged instructions**.

Intuitively: every instruction that could observe or alter machine state must trap when executed in user mode. Then the hypervisor sees every action requiring virtualisation, and everything else can run natively. Such an architecture is **virtualisable**.

### 2.5 Violations and workarounds

**x86 (pre-2005) violated the theorem.** It had sensitive-but-unprivileged instructions — the classic example being `POPF`, which silently ignores attempts to modify the interrupt flag in user mode instead of trapping. A deprivileged guest disabling interrupts would simply have no effect, with no trap for the hypervisor to intercept: the guest's state silently diverges from what it believes. Reading `CS` to discover the current privilege level similarly reveals the deprivileging.

Workarounds:

- **Binary translation** — scan and rewrite guest code before execution, replacing problematic instructions with safe sequences that call into the hypervisor. VMware's approach; correct and fully transparent, but complex and costly.
- **Paravirtualisation** — modify the guest OS to replace problematic operations with explicit **hypercalls**. Xen's original approach; efficient and much simpler, but requires guest modification, so it cannot run unmodified proprietary OSes.
- **Hardware support** — change the architecture so the theorem holds. Intel **VT-x** and AMD-V added a new privilege dimension, making x86 virtualisable by construction and rendering the workarounds largely unnecessary.

### 2.6 Wrapping up

The theorem explains an entire era of systems engineering: x86's failure to satisfy it caused binary translation and paravirtualisation, and hardware extensions satisfying it made both largely obsolete. It is also the standard exam material for this week, so be able to state the condition, explain trap-and-emulate, give `POPF` as the violation, and name the three workarounds.

---

## 3. CPU and memory virtualisation

### 3.1 VT-x overview

Rather than juggling existing rings, VT-x adds an orthogonal distinction:

- **Root mode** — the hypervisor.
- **Non-root mode** — the guest, which has its own full set of rings 0–3.

The guest OS therefore runs in **ring 0 of non-root mode** — genuinely privileged from its own perspective, so it needs no modification and no deprivileging trick. Sensitive operations now cause transitions to root mode instead of failing silently.

**Transitions:**

- **VM exit** — non-root → root, when the guest does something requiring hypervisor attention.
- **VM entry** — root → non-root, resuming the guest.

State is held in the **VMCS** (Virtual Machine Control Structure), one per vCPU, storing guest state, host state, and control fields determining which events cause exits. VM exits are expensive (thousands of cycles: state save/restore plus lost cache and TLB warmth), so **minimising exit frequency is the central performance concern** in hypervisor design.

**VT-x and the P&G criteria:** VT-x makes x86 satisfy the theorem — every sensitive operation can be configured to cause a VM exit, so sensitive ⊆ trapping, while the guest runs natively otherwise, preserving efficiency.

### 3.2 Memory virtualisation

The problem: the guest maintains page tables mapping **GVA → GPA**, but the hardware needs **GVA → HPA**. Two levels of translation must be composed.

**Without hardware MMU virtualisation — shadow page tables.** The hypervisor maintains its own page tables mapping GVA directly to HPA, and points the real hardware at those. The guest's page tables become mere data structures the hypervisor reads. To stay consistent, the hypervisor write-protects the guest's page tables so that every guest update traps and can be reflected in the shadow tables. Correct and requires no guest changes, but **page-table-heavy workloads exit constantly** — process creation and context switching become very expensive.

**With hardware support — Extended Page Tables (EPT).** A second, hardware-walked level of translation. The guest's own page tables handle GVA → GPA exactly as on real hardware, and a hypervisor-managed EPT handles GPA → HPA. The MMU walks both.

- The guest may modify its page tables freely with **no VM exits** — the dominant benefit.
- The cost is a longer walk: an **EPT walk** requires walking the EPT for each level of the guest walk, so a full miss can approach ~24 memory accesses on 4-level paging. The TLB caches the composed GVA → HPA translation, so hits are as fast as native; misses are correspondingly worse. Large pages and TLB tagging (VPIDs, avoiding flushes on VM switch) mitigate this.

AMD's equivalent is **Nested Page Tables (NPT/RVI)**.

### 3.3 KVM

**KVM** turns the Linux kernel into a Type I-ish hypervisor via a kernel module exposing `/dev/kvm`. A userspace process (typically **QEMU**) creates the VM, allocates guest memory from its own address space, and runs vCPUs as ordinary Linux threads via an `ioctl` that enters non-root mode; the thread returns from the `ioctl` on a VM exit.

The division of labour is the elegant part: KVM handles CPU and memory virtualisation (VT-x/EPT), Linux handles scheduling and memory management for free (a vCPU is just a thread, so CFS schedules it), and QEMU handles device emulation in userspace — where a device-model bug is contained in an unprivileged process rather than the kernel.

**Memory virtualisation in KVM** maps guest physical memory onto QEMU's virtual address space, letting Linux's existing memory management (paging, swapping, page sharing, KSM deduplication) apply to guest memory, with KVM programming the EPT accordingly.

---

## 4. I/O virtualisation

Each guest believes it has its own devices; the hypervisor must multiplex real hardware.

### 4.1 Physical I/O background

Devices are driven through memory-mapped registers (MMIO) or port I/O, signal completion via **interrupts**, and move bulk data by **DMA** directly to and from memory without CPU involvement. Each is a thing the hypervisor must intercept or arrange.

### 4.2 Full device emulation

The hypervisor implements a software model of a real device — commonly the Intel **e1000** NIC, precisely because every OS already ships a driver for it. The guest's unmodified driver writes to what it thinks are device registers; those pages are configured to cause VM exits, the hypervisor decodes the access, updates the model, and performs real I/O through the host's driver.

- **Pro:** works with completely unmodified guests, and the emulated device need not resemble the physical one.
- **Con:** **very slow.** A single high-level operation may touch many registers, each costing a VM exit. This is the worst-performing option and the reason the alternatives exist.

### 4.3 Paravirtualised I/O

Replace the emulated hardware interface with one designed for virtualisation, and put a matching driver in the guest. **virtio** is the standard (virtio-net, virtio-blk).

The key structure is a **ring buffer** in memory shared between guest and hypervisor. The guest places descriptors pointing at data buffers into the ring and the hypervisor consumes them, so:

- Many requests are **batched** per notification, amortising the exit cost.
- Data is transferred by reference, not copied through registers.
- **Notification suppression** lets either side say "don't notify me, I'm polling", eliminating exits under load.

The result is far better performance than emulation, at the cost of needing virtio drivers in the guest — universally available for Linux and available for Windows, so the trade is nearly free in practice.

### 4.4 Direct device assignment (passthrough)

Give a guest exclusive, direct access to a physical device. Near-native performance, since the guest's driver talks to real hardware with the hypervisor out of the data path.

Two requirements:

- **The IOMMU** — a device-side MMU translating device DMA addresses. Essential for both correctness and security: without it, a guest could program a device to DMA to *any* host physical address, trivially escaping isolation. The IOMMU restricts device DMA to the guest's own memory. (It also protects the host from malicious peripherals generally — Thunderbolt/DMA attacks.)
- **Interrupt remapping** — routing device interrupts to the correct guest.

Costs: the device is dedicated to one guest (no sharing), and it breaks live migration, since device state is not under hypervisor control.

**SR-IOV** resolves the sharing limitation: a capable device presents multiple **virtual functions**, each assignable to a different guest, giving passthrough performance with sharing. Hardware support required, and migration remains awkward.

### 4.5 I/O interposition

The hypervisor sitting in the I/O path is not only a cost — it is an opportunity. Because it sees every I/O operation it can transparently add functionality the guest knows nothing about: storage snapshots, copy-on-write disks, thin provisioning, encryption at rest, deduplication, replication, network filtering and monitoring, rate limiting, and software-defined networking.

This is a genuine architectural benefit of virtualisation, and it is precisely what passthrough gives up: **direct assignment trades interposition (and migration) for performance.** Knowing that trade-off is the point of this lecture.

---

## 5. Lightweight virtualisation

### 5.1 Motivation

Full VMs are heavyweight: each runs a complete guest OS, consuming hundreds of megabytes, taking seconds to boot, and duplicating kernel functionality already present on the host. For deploying many instances of a single application — the microservices pattern — that overhead dominates.

**Lightweight virtualisation** seeks VM-like isolation with far lower resource and time cost.

### 5.2 Containers

**Key idea:** rather than virtualising hardware and running another kernel, isolate groups of processes **within a single shared kernel** so that each group sees only its own resources. A container is a set of processes running on the host kernel with a restricted view of the system.

Two Linux mechanisms do the work:

- **Namespaces** — restrict *visibility*. Each namespace type virtualises one global resource: PID (own process tree, own PID 1), mount (own filesystem view), network (own interfaces, routing, ports), UTS (own hostname), IPC, user (own UID mapping, enabling unprivileged containers), and cgroup. A process in a PID namespace simply cannot see or signal processes outside it.
- **Control groups (cgroups)** — restrict *consumption*. Hierarchical limits and accounting for CPU, memory, block I/O, and device access. This is what provides a degree of **availability** protection, which namespaces alone do not.

Usually combined with a root filesystem image, plus **seccomp-BPF** to restrict syscalls, **capability** dropping, and an LSM profile (SELinux/AppArmor) — the Week 4 mechanisms, composed.

### 5.3 Containers vs. VMs

| | Containers | VMs |
|---|---|---|
| Isolation boundary | Shared host kernel | Hypervisor |
| Guest kernel | None — host's | Full guest kernel |
| Start time | Milliseconds | Seconds |
| Memory footprint | Megabytes | Hundreds of MB+ |
| Density | Very high | Lower |
| OS flexibility | Host kernel only | Any guest OS |
| Isolation strength | **Weaker** | **Stronger** |
| Attack surface | Whole syscall interface | Narrow hypervisor interface |

### 5.4 Containers and security

The essential point: **the isolation boundary is the kernel's syscall interface, which is enormous.** Hundreds of syscalls, each with complex arguments, all reachable from inside the container. A single kernel privilege-escalation bug compromises the host and therefore every container on it. A hypervisor's interface is far narrower and thus far easier to defend.

Container-specific risks: running as root inside the container mapping to real root without user namespaces; excessive capabilities (notably `CAP_SYS_ADMIN`); mounting sensitive host paths or the Docker socket; missing cgroup limits allowing resource-exhaustion DoS; shared kernel side channels; and untrusted images.

Hardening in practice: user namespaces so container root is unprivileged on the host, drop all capabilities and add back only what is needed, a tight seccomp profile, an LSM profile, read-only root filesystems, cgroup limits, and no privileged mode.

**Sandboxed and micro-VM approaches** close the gap by reintroducing a stronger boundary while keeping container ergonomics: **gVisor** intercepts syscalls in a userspace kernel, shrinking host kernel exposure; **Kata Containers** and **Firecracker** run each container in a stripped-down micro-VM with a minimal device model, booting in tens of milliseconds. This is also where **unikernels** (Week 4) reappear — a specialised single-purpose image on a hypervisor, giving VM-grade isolation with container-grade footprint.

### 5.5 Use cases

Microservices and high-density deployment, reproducible packaging of an application with its dependencies, CI/CD pipelines, orchestration at scale (Kubernetes), serverless platforms (where millisecond start-up is the enabling property), and development environments.

The general judgement: **containers for density, speed, and packaging among code you broadly trust; VMs or micro-VMs when the boundary must hold against a hostile tenant.**

---

## 6. Week 6 takeaways

1. Virtualisation = **multiplexing, aggregation, emulation**; a system VM presents a whole machine.
2. **Type I** = bare-metal (small TCB, production); **Type II** = hosted; **KVM** is a hybrid.
3. Know the three address kinds — **GVA, GPA, HPA** — the guest's "physical" memory is itself virtual.
4. **Popek & Goldberg:** virtualisable iff **sensitive ⊆ privileged**; mechanism is **trap-and-emulate** with the guest deprivileged.
5. **x86 violated the theorem** (`POPF` silently ignoring interrupt-flag changes in user mode); workarounds were **binary translation**, **paravirtualisation**, then **hardware support**.
6. **VT-x** adds **root/non-root** modes so the guest runs in ring 0 of non-root; **VM exits** are expensive, so minimising them drives design; state lives in the **VMCS**.
7. **Shadow page tables** = write-protect guest tables, exit on every update (slow). **EPT** = hardware two-level GVA→GPA→HPA walk, no exits on guest page-table writes, but up to ~24 accesses on a full miss.
8. I/O spectrum: **full emulation** (unmodified guest, very slow) → **paravirtualisation/virtio** (ring buffers, batching, notification suppression) → **direct assignment** (near-native, needs **IOMMU**) → **SR-IOV** (passthrough with sharing).
9. The **IOMMU is a security requirement**, not just performance — without it a guest can DMA anywhere in host memory.
10. Passthrough **sacrifices I/O interposition and live migration** for speed.
11. Containers = **namespaces (visibility) + cgroups (consumption)** on a **shared kernel**.
12. Containers isolate across the **entire syscall interface**, so they are weaker than VMs; **gVisor, Kata, Firecracker** close the gap.
