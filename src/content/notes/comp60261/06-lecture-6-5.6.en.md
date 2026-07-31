---
subject: COMP60261
chapter: 6
title: "Lecture 6 - 5.6 Study Notes"
language: en
---

# COMP60261 - Lecture 6: Virtualisation (5.6)

**Sources used:** downloaded COMP60261 slide decks:

- `slides/27-virtualisation-introduction/index.html`
- `slides/28-virtualisation-theory/index.html`
- `slides/29-cpu-memory-virtualisation/index.html`
- `slides/30-io-virtualisation/index.html`
- `slides/31-lightweight-virtualisation/index.html`

All paths are relative to `C:\Users\abdul\Downloads\COMP60261-slides`.

**Transcript status:** no lecture transcript was provided. These notes are grounded in the slides and their local assets only.

**Topic and scope:** Chapter 6 develops virtualisation from its definition and Popek-Goldberg theory through x86-64 CPU, memory, and I/O support, then compares full VMs with containers, micro VMs, and unikernels.

---

## 1. Chapter map

An operating system normally expects to run alone with complete authority over hardware. Virtualisation asks how several mutually untrusted OSes can share one machine while each behaves as if it owns the hardware.

The five lectures answer this in layers:

1. **Introduction:** definitions, goals, use cases, hypervisor types, and memory terminology.
2. **Theory:** the Popek-Goldberg conditions under which direct execution can be safe and equivalent.
3. **CPU and memory:** VT-x, VMCS/vmexits, KVM, and Extended Page Tables.
4. **I/O:** emulation, virtio, passthrough, IOMMU, and SR-IOV.
5. **Lightweight virtualisation:** micro VMs, containers, and unikernels.

The recurring trade-off is:

> Equivalence, safety, and performance must be achieved together, while the trusted interface remains small enough to secure.

---

## 2. Virtualisation foundations

### 2.1 Definitions

A quick definition is: virtualisation uses software and hardware to run multiple operating systems simultaneously on one physical machine.

The more precise definition used in the slides characterises virtualisation as:

- an **abstraction at a widely used interface**;
- producing a virtual resource **identical to the virtualised component**;
- an abstraction that clients **cannot bypass**.

For system VMs, the widely used interface is the OS/hardware interface. Identity means an unmodified OS can use the virtual machine, while non-bypassability means a guest cannot escape the hypervisor.

The definition also covers virtual memory, scheduling, and virtual storage: each provides a familiar virtual resource while mediating access to underlying physical resources.

### 2.2 Three general techniques

- **Multiplexing:** present one physical resource as several virtual resources.
- **Aggregation:** present several physical resources as one virtual resource.
- **Emulation:** present a virtual resource different from the actual physical one.

A VM commonly combines all three: CPU time and memory are multiplexed, storage may be aggregated, and virtual devices may be emulated.

### 2.3 Historical motivation

IBM System/360 created a family of compatible machines. Customers wanted to consolidate workloads from several smaller machines onto a larger one without rewriting software.

Important milestones from the slides:

- 14 System/360 models were sold between 1965 and 1978;
- Model 67 in 1966 introduced a virtualisable ISA;
- Popek and Goldberg published their formal requirements in 1974;
- Stanford's Disco work in the 1990s led toward VMware;
- Xen, KVM, VirtualBox, and Hyper-V followed in the 2000s.

### 2.4 Use cases

**Consolidation:** replace many underused physical systems with fewer hosts containing isolated VMs.

**Development and deployment:** rapidly provision different OS versions and package applications with complete software dependencies.

**Checkpoint/restart:** capture a VM's identifiable CPU, memory, and device state and resume it later.

**Live migration:** move a running VM between hosts for maintenance, load balancing, energy saving, or fault avoidance.

**Hardware emulation:** run software for unavailable or older hardware.

**Cloud computing:** share provider infrastructure securely across tenants, supporting IaaS, PaaS, and SaaS.

**Security:** sandbox suspicious workloads and inspect a guest from a more privileged layer through VM introspection.

### 2.5 System-level VMs and the hypervisor goals

A system-level VM exposes a hardware model to an unmodified guest OS. A hypervisor or Virtual Machine Monitor (VMM) aims for:

1. **Equivalence:** guest OSes and applications behave as on physical hardware and remain unmodified.
2. **Safety:** the VMM retains complete control; guests cannot escape or access one another.
3. **Performance:** most execution remains close to native speed.

The solution is **direct execution**:

- ordinary guest instructions run directly on the physical CPU at reduced hypervisor authority;
- instructions that can affect protected system state trap;
- the VMM validates and emulates those operations.

Direct execution provides a fast path while traps form the controlled slow path.

### 2.6 Type I and Type II

| Type | Resource allocation and scheduling |
|---|---|
| **Type I** | Primarily managed by the hypervisor |
| **Type II** | Host OS has substantial involvement |

For this unit, **KVM is classified as Type II** because it is a Linux kernel module, the general-purpose host OS schedules/resources it, and a userspace Qemu process manages the VM. Other sources may classify KVM differently; the course classification should be used for this module.

### 2.7 Memory terminology

Virtualisation adds a translation stage:

$$\text{guest virtual} \rightarrow \text{guest pseudo-physical} \rightarrow \text{host physical}$$

**Pseudo-physical** is the address the guest OS believes is physical. The hypervisor maps it onto actual host physical memory.

---

## 3. Popek-Goldberg theory

Popek and Goldberg's 1974 work defines the properties of a correct VMM and the ISA conditions needed to build one efficiently.

### 3.1 Simplified CPU model

The paper's model has:

- one processor core;
- supervisor and user modes;
- contiguous physical memory from address `0` to size `SZ`;
- one segmentation-based virtual-memory region with base `B` and limit `L`.

The Processor Status Word is:

$$\text{PSW} = (M, B, L, PC)$$

| Field | Meaning |
|---|---|
| `M` | Supervisor (`s`) or user (`u`) execution mode |
| `B` | Segment physical base |
| `L` | Segment length/limit |
| `PC` | Virtual program counter |

The virtual interval `[0, L)` maps to physical `[B, B + L)`.

### 3.2 Trap mechanism

On a trap, hardware can:

- save the current PSW in `MEM[0]`;
- load a trap-handler PSW from `MEM[1]`;
- later restore a PSW to resume execution.

Traps include hardware interrupts and exceptions, including the mechanism used for system calls.

Without a hypervisor, the kernel initialises `MEM[1]` with supervisor mode and full memory access, allocates a disjoint `(B, L)` region to each application, and loads a user-mode PSW to run it.

### 3.3 VMM requirements

A VMM must run arbitrary, unmodified, potentially malicious guest OSes while remaining efficient.

**Safety:** the VMM always controls hardware and isolates itself and every VM. No trusted behaviour is assumed from guests.

**Equivalence:** a VM duplicates the underlying machine closely enough that unmodified software behaves as it would natively.

**Performance:** most guest instructions execute directly with only a small slowdown.

Safety is non-negotiable. Historical solutions compromised equivalence or performance when hardware did not satisfy the theorem.

### 3.4 Central design idea

- Run the VMM in supervisor mode.
- Run the guest OS and guest applications in user mode.

The guest OS believes it is privileged. Any operation capable of changing protected machine state must trap so the VMM can validate and emulate it.

### 3.5 Instruction classifications

**Control-sensitive instructions** update system state, such as changing the PSW or installing memory mappings.

**Behaviour-sensitive instructions** behave differently depending on system state such as privilege level. The slides use x86-32 `POPF`, which silently fails in user mode rather than trapping.

**Sensitive instructions** are the union of control-sensitive and behaviour-sensitive instructions.

**Privileged instructions** execute only in supervisor mode and trap when attempted in user mode.

**Innocuous instructions** are not sensitive.

Privilege and sensitivity are independent classifications. The theorem describes how their sets must relate.

### 3.6 The theorem

For a VMM to be constructible through direct execution:

$$\{\text{control-sensitive}\} \cup \{\text{behaviour-sensitive}\} \subseteq \{\text{privileged}\}$$

In words:

> Every instruction that changes protected system state, or whose behaviour depends on that state, must trap when run without supervisor privilege.

If a control-sensitive instruction does not trap, a guest can alter system state without VMM mediation, breaking **safety**.

If a behaviour-sensitive instruction does not trap, a deprivileged guest OS observes behaviour different from native supervisor execution, breaking **equivalence**.

### 3.7 VMM state and VM resumption

For each VM, the VMM stores a virtual processor state:

$$\text{vPSW} = (M, B, L, PC)$$

`vPSW.M` records the mode the guest believes it occupies. The real CPU mode used to run all guest code is user mode.

If the VM owns host physical range beginning at `addr0`, resumption loads approximately:

$$M' = u, \quad B' = \texttt{addr0} + \text{vPSW}.B, \quad L' = \text{vPSW}.L, \quad PC' = \text{vPSW}.PC$$

The VMM checks the resulting region against the VM's allocated `memsize`. This relocation ensures that guest address zero means host address `addr0`, not the real machine's zero.

### 3.8 Two trap cases

**Trap from the guest OS (`vPSW.M == s`):**

1. A sensitive instruction traps.
2. The VMM decodes the instruction.
3. It validates and updates the virtual state.
4. It advances the virtual PC and resumes the guest.

For a virtual segment-register update, the guest's requested `B` and `L` are stored in `vPSW`, while real hardware receives a checked mapping relocated by `addr0`.

**Trap from a guest application (`vPSW.M == u`):**

1. The guest application made a syscall or faulted.
2. The guest OS, not the VMM, should logically handle it.
3. The VMM saves the guest application state at the VM's relocated equivalent of `MEM[0]`.
4. It loads the guest trap-handler state from the relocated `MEM[1]` after validating it.
5. The VM resumes in its virtual supervisor state, while real execution remains deprivileged.

The VMM reproduces the hardware trap mechanism one level above the guest.

### 3.9 Theorem violations and workarounds

x86-32 violated the theorem because instructions such as `POPF` were behaviour-sensitive but did not trap in user mode.

| Workaround | Method | Sacrifice |
|---|---|---|
| Full or selective emulation/binary translation | Interpret or rewrite problematic guest execution | Performance |
| Paravirtualisation | Modify the guest OS to call the hypervisor explicitly | Equivalence |

The design rule is: equivalence or performance may be compromised, but safety cannot be.

---

## 4. CPU virtualisation with VT-x

x86-64 added three major hardware technologies:

| Technology | Resource |
|---|---|
| Intel VT-x | CPU virtualisation |
| Extended Page Tables (EPT) | Memory virtualisation |
| Intel VT-d | I/O virtualisation |

AMD provides closely corresponding technologies.

### 4.1 Problems in software-only x86-32 virtualisation

- **Ring aliasing/compression:** guest kernels designed for ring 0 had to run at a lower privilege.
- **Address-space compression:** the hypervisor needed protected space inside the guest-visible address space.
- **Transition cost:** frequently used sensitive operations created many expensive guest/VMM crossings.

### 4.2 Root and non-root modes

VT-x duplicates architectural CPU state across:

- **root mode:** hypervisor and host OS;
- **non-root mode:** virtual machines.

Protection rings exist independently in both modes. A guest kernel can run in **non-root ring 0**, matching its expected ring, while the hypervisor remains in root mode.

Root/non-root transitions atomically switch the relevant CPU/address-space state, including translation-cache context.

This preserves backwards compatibility without changing the semantics of individual legacy instructions.

### 4.3 Hardware version of the theorem

In non-root mode, every sensitive instruction must either:

1. cause a vmexit to the VMM; or
2. be implemented by hardware against the non-root copy of CPU state.

The second option avoids transitions for frequent safe operations. VM exits cost **thousands of cycles**, so trapping every sensitive instruction would be correct but slow.

Early VT-x generations were sometimes slower than mature dynamic binary translation. Initial hardware support primarily improved simplicity and safety; performance improved later.

### 4.4 VMCS and transitions

The **VM Control Structure (VMCS)** stores guest and transition state.

- `VMLAUNCH` starts a VM.
- `VMRESUME` resumes it.
- `VMREAD` and `VMWRITE` access VMCS fields.
- A **vmexit** transfers from non-root guest execution to root mode.
- `VMCALL` makes a voluntary hypercall, analogous to a system call.

Vmexit causes include:

- guest exceptions and hardware interrupts;
- triple faults;
- privileged/root-sensitive instructions;
- hypercalls;
- I/O instructions such as `IN`/`OUT`;
- EPT violations;
- legacy instructions requiring emulation;
- attempts to use VT-x control instructions.

### 4.5 KVM architecture

For this unit, KVM is a Type II hypervisor built assuming hardware virtualisation support.

- The KVM kernel module handles VMCS state, traps, and CPU/memory virtualisation.
- A host userspace process creates and manages the VM.
- Qemu commonly supplies virtual-device models and resource allocation.
- Qemu's normal CPU and memory emulation are disabled when KVM/VT-x/EPT provide direct execution.

This split keeps privileged mechanisms in the host kernel while complex device management remains in userspace.

---

## 5. Memory virtualisation and EPT

### 5.1 Shadow paging before EPT

VT-x separated root and non-root address spaces, so the VMM no longer needed to occupy protected space inside a guest layout. However, guest page-table updates still needed VMM validation through **shadow page tables**.

The slides report that shadow paging caused **more than 90% of vmexits**, making early VT-x systems slower than good software virtualisation in some cases.

### 5.2 Extended Page Tables

EPT divides translation responsibility:

- the guest OS freely manages page tables mapping guest virtual to guest pseudo-physical addresses;
- the hypervisor manages one EPT per VM mapping pseudo-physical to host physical addresses.

Because only the VMM controls EPT, it can restrict each VM to authorised host pages without trapping every guest page-table update.

### 5.3 TLB behaviour

The TLB caches the final guest-virtual to host-physical translation directly. A hit therefore approaches native translation performance.

The slides state modern TLB hit rates are **greater than 95%**, so most accesses avoid a complete two-dimensional walk.

### 5.4 Two-dimensional page walk

On a TLB miss, the MMU walks the guest's four-level page table. Each guest page-table entry contains a pseudo-physical address that must itself be translated through the EPT before the next guest level can be read.

The resulting cost in the slides is:

- **24 memory accesses** for the combined two-dimensional walk;
- versus **4 accesses** for a normal four-level page-table walk.

These numbers must be paired with the high TLB hit rate: the miss penalty is severe, but misses are relatively uncommon.

### 5.5 Guest memory in Qemu/KVM

The concrete arrangement is:

1. Each guest process uses guest-managed page tables.
2. Qemu is an ordinary host userspace process with its own host virtual address space.
3. Qemu makes one large allocation that represents the guest's pseudo-physical memory.
4. KVM creates EPT mappings from that pseudo-physical range to host physical frames.
5. Qemu device code accesses guest memory by reading/writing its own buffer.

The clarifying idea is that guest "physical" RAM is represented by memory owned by a userspace Qemu process, while EPT makes it appear as physical memory to the guest CPU.

---

## 6. I/O virtualisation

I/O interposition places a virtual device model between the guest driver and host hardware. It enables device sharing, aggregation, migration, snapshots, and features not present on the physical device.

### 6.1 Physical I/O mechanisms

| Mechanism | Direction | Purpose |
|---|---|---|
| PIO/MMIO | CPU to device | Discover and manipulate device registers |
| Interrupt | Device to CPU | Notify completion or events; carries no bulk data |
| DMA | Bidirectional device/memory | Transfer large data without CPU copying each byte |

The CPU configures a DMA transfer through registers and the device signals completion with an interrupt.

### 6.2 Ring buffers

A ring buffer is a circular producer-consumer queue in shared memory. Device registers describe its base, length, head, and tail.

For CPU-to-device transfer:

- CPU produces descriptors/data at the tail;
- device consumes from the head;
- MMIO tells the device about new work;
- an interrupt tells the CPU about completion.

Ring buffers support continuous asynchronous data flow and batch multiple requests.

### 6.3 Full device emulation

The VMM/Qemu can model a physical device completely:

- PIO instructions trap naturally.
- MMIO pages are left unmapped or protected so access faults/traps.
- The model updates virtual registers.
- The VMM injects virtual interrupts.
- Qemu reads/writes guest memory to emulate DMA.

Qemu/KVM commonly uses one thread per virtual CPU and one thread per virtual device. A vCPU's MMIO access traps, work is deferred to a device thread, guest execution can resume, and a virtual interrupt is injected on completion.

This mimics asynchronous physical hardware and permits unmodified guest drivers.

### 6.4 e1000 example

The slides use Intel's 82540EM/e1000 NIC because modern OSes already contain its driver. Qemu implements the documented register behaviour in software.

If the MMIO base is `0xfebc0000` and the Interrupt Cause Read register offset is `0xc0`, the guest accesses:

$$\texttt{0xfebc0000} + \texttt{0xc0} = \texttt{0xfebc00c0}$$

Every emulated register interaction may cause a costly path through KVM to Qemu. Compatibility is excellent, but performance is limited.

### 6.5 I/O paravirtualisation and virtio

Physical devices were not designed to minimise vmexits. One Ethernet frame can require several register operations and therefore multiple exits.

Paravirtualised devices are designed specifically for VMs. They require a guest PV driver, sacrificing strict equivalence for performance.

**virtio** provides:

- discoverable virtual PCIe devices;
- optimised shared-ring queues;
- batching that reduces vmexits;
- network, block, SCSI, console, memory-hotplug, and host-filesystem devices.

Virtio drivers are widely included in Linux guests.

### 6.6 Direct assignment

PCI passthrough assigns a physical device exclusively to one VM, removing the hypervisor from the data path and approaching native performance.

Two problems remain:

1. **Security:** the device can perform DMA to arbitrary host physical addresses and can generate interrupts.
2. **Scalability:** dedicating one physical device to each VM does not scale.

Passthrough also gives up some benefits of interposition, such as hardware-independent migration.

### 6.7 IOMMU / VT-d

The IOMMU applies isolation to device-originated access, which bypasses the CPU MMU.

| Engine | Purpose |
|---|---|
| **DMAR (DMA remapping)** | Restricts device DMA to permitted pages according to virtualisation mappings |
| **IR (interrupt remapping)** | Routes interrupts only to the intended VM and blocks hostile vectors |

Both are necessary. Restricting DMA does not stop a malicious device from targeting the wrong interrupt context.

### 6.8 SR-IOV

Single Root I/O Virtualisation lets one physical device expose multiple assignable functions:

- a **Physical Function (PF)** is controlled by the host/hypervisor;
- the PF creates **Virtual Functions (VFs)** assigned to different VMs.

Hardware multiplexes the device, retaining near-native performance while improving sharing.

The slides give:

- theoretical maximum of about **64K VFs**;
- recent NIC support up to roughly **2K VFs**.

### 6.9 I/O spectrum

| Approach | Performance | Guest compatibility | Main cost |
|---|---|---|---|
| Full emulation | Lowest | Best; normal legacy driver | Many exits and software data path |
| Virtio/PV | High | Requires PV driver | Equivalence concession |
| Passthrough + IOMMU | Native | Uses physical driver | Exclusive device, less interposition |
| SR-IOV | Native and shareable | Requires capable hardware/driver | Less interposition and hardware dependency |

---

## 7. Lightweight virtualisation

Traditional VMs may include an entire guest kernel, distribution, services, and packages even when one application uses only a fraction of them.

Software bloat causes:

- a larger attack surface;
- higher memory, disk, and CPU cost;
- less workload performance for a fixed budget.

### 7.1 Definition and targets

Compared with traditional VMs, lightweight systems aim for:

| Metric | Lightweight target | Traditional VM |
|---|---|---|
| System memory footprint | KBs to a few MBs | Hundreds of MBs to GBs |
| Boot time | Microseconds to milliseconds | Seconds to minutes |
| System disk footprint | KBs/MBs | Much larger |

These figures concern systems software; application size and application-specific startup remain.

Three approaches are micro VMs, containers, and unikernels.

### 7.2 Containers

Containers are **process-level sandboxing enforced by the host operating system**, also called OS-level virtualisation.

They combine:

- restricted visibility of resources;
- controlled allocation/usage of hardware resources.

No guest kernel or system-level VM is required. Starting a container can be close to spawning a process, with very low per-instance overhead.

### 7.3 Namespaces: what processes can see

| Namespace | Isolated view |
|---|---|
| Mount/filesystem | Own visible root and mount points |
| Network | Own interfaces, addresses, routing context |
| PID and IPC | Own visible processes and IPC namespace |
| Host/domain name | Own hostname/domain identity |
| User | Mapped user IDs; apparent root inside container |

A Fedora root filesystem may run in a container on a Debian host because the filesystem view differs while the Linux host kernel is shared.

### 7.4 Cgroups: what processes can use

| Resource | Example control |
|---|---|
| Memory | Limit RAM and swap |
| CPU | Quota, weight, CPU sets, CFS quota |
| Devices | Permit/deny device access |
| Block I/O | Limit throughput |
| Network | Prioritise or constrain traffic |

The key distinction is:

> Namespaces control what a container can **see**; cgroups control what it can **use**.

### 7.5 Container use cases

- repeatable development, testing, and deployment environments;
- high-density and elastic cloud services;
- rapid creation/destruction for serverless computing;
- packaging application dependencies independently of host userspace configuration.

### 7.6 Containers versus VMs

| Containers tend to win | VMs tend to win |
|---|---|
| Low footprint and fast startup | OS and kernel-version diversity |
| High density | Stronger performance isolation |
| Easy nesting | Stronger security isolation |

Containers share the host kernel, whereas each VM contains its own guest kernel and crosses a narrower hypervisor interface.

### 7.7 Why container isolation is weaker

The lecture's reasoning is a four-step interface argument:

1. Page tables/EPT stop a malicious instance from directly reading another instance or virtualisation layer.
2. The remaining escape path is invoking the trusted virtualisation layer and triggering a bug.
3. Security therefore depends on the complexity and defensibility of the trusted interface.
4. Containers expose hundreds of system calls, with interfaces such as `ioctl` containing thousands of sub-operations, while a VM reaches a hypervisor through only a few trap types.

Syzkaller's continuing discovery of syscall bugs demonstrates the difficulty of securing the container boundary.

Therefore container isolation is not normally trusted as strongly as hypervisor isolation. Some deployments put containers inside micro VMs, as in Kata Containers, trading away part of the lightweight advantage for a narrower security boundary.

### 7.8 Unikernels

A **unikernel is an application, its dependencies, and a thin OS compiled into a static binary that runs on a hypervisor**.

It is typically:

- single-purpose;
- single-process, though multithreading and multicore execution can be supported;
- a single binary;
- a single application/kernel address space.

Application and kernel do not need an internal privilege boundary because one application occupies the instance; separate unikernels provide inter-application isolation.

### 7.9 Unikernel benefits and trade-offs

Benefits:

- include only OS components the application needs;
- small memory/disk footprint and fast boot;
- hypervisor-level isolation between instances;
- application-specific OS specialisation;
- system calls become ordinary function calls because application and OS share ring 0/address space;
- sub-second startup and low syscall latency.

Trade-off:

- strong isolation exists between unikernels;
- no isolation exists between the application and its thin OS inside one instance.

Unikernels therefore combine VM-style external security with container-like lightweightness, but a compromise of the application exposes the entire instance.

### 7.10 Maturity and evidence

Containers are mature production technology. Unikernels remain closer to research prototypes.

Projects named in the slides include MirageOS, LING, HalVM, Unikraft, HermiTux, HermitCore, OSv, Rumprun, Lupine, Hermit, and Clive. **Unikraft** is described as the most mature and closest to production-ready.

The presented key-value-store benchmark shows Unikraft as the fastest measured setup: even under Qemu/KVM it was slightly faster than native Linux and substantially faster than Linux inside a VM, attributed largely to system calls becoming function calls.

---

## 8. How the chapter fits together

The full VM design is a hierarchy of controlled interfaces:

- guest instructions run directly until VT-x causes a vmexit;
- guest page-table updates run directly while EPT constrains final memory access;
- guest I/O traps to emulated/PV devices unless hardware assignment bypasses the model;
- IOMMU mappings constrain DMA and interrupts;
- containers remove the guest kernel but expose the much larger host syscall interface;
- unikernels keep the narrow hypervisor boundary and remove the internal user/kernel transition.

Each performance optimisation moves work off a trap-heavy path:

- hardware handles some sensitive CPU operations in non-root state;
- TLB caches final two-stage translations;
- virtio batches work in shared rings;
- passthrough removes the software device path;
- containers share one kernel;
- unikernels turn system calls into function calls.

Each optimisation changes an assumption or loses a feature, so safety, equivalence, migration, compatibility, and performance must be evaluated together.

---

## 9. Exam-focused facts

### 9.1 High-value questions

| Question | Answer |
|---|---|
| Hypervisor goals? | Equivalence, safety, performance |
| How is near-native speed achieved? | Direct execution plus traps for dangerous operations |
| Virtualisation principles? | Multiplexing, aggregation, emulation |
| Course classification of KVM? | Type II |
| Memory address stages? | Guest virtual -> pseudo-physical -> host physical |
| P&G theorem? | Sensitive instructions must be a subset of privileged instructions |
| Non-trapping control-sensitive instruction breaks? | Safety |
| Non-trapping behaviour-sensitive instruction breaks? | Equivalence |
| Historical x86-32 problem instruction? | `POPF` |
| Workarounds for theorem violation? | Emulation loses performance; PV loses equivalence |
| VT-x modes? | Root and non-root, orthogonal to rings |
| VM state structure? | VMCS |
| Start/resume instructions? | `VMLAUNCH`, `VMRESUME` |
| Guest-to-VMM voluntary call? | `VMCALL` hypercall |
| EPT ownership? | Hypervisor, one per VM |
| Why is EPT fast normally? | TLB caches final translation with >95% hit rate |
| 2D walk cost? | 24 accesses versus 4 standard |
| Qemu guest RAM representation? | Large allocation in Qemu userspace |
| Physical I/O mechanisms? | PIO/MMIO, interrupts, DMA |
| Why virtio? | PV ring design reduces vmexits |
| IOMMU engines? | DMA remapping and interrupt remapping |
| SR-IOV objects? | PF controlled by host creates assignable VFs |
| Namespaces versus cgroups? | Visibility versus resource usage |
| Why are containers weaker than VMs? | Much larger syscall interface versus few hypervisor traps |
| Unikernel definition? | Application + dependencies + thin OS as one static VM binary |
| Unikernel syscall benefit? | System calls become function calls |

### 9.2 Quantitative facts

| Fact | Value |
|---|---:|
| System/360 models | 14 between 1965-1978 |
| First virtualisable S/360 model | Model 67, 1966 |
| Popek-Goldberg paper | 1974 |
| Guest/VMM transition cost | Thousands of cycles |
| Shadow-paging share of vmexits | More than 90% |
| Modern TLB hit rate | More than 95% |
| EPT two-dimensional walk | 24 accesses versus 4 |
| SR-IOV theoretical VFs | Up to about 64K |
| Recent high-end NIC VFs in slides | About 2K |
| Lightweight memory target | KBs to a few MBs |
| Lightweight boot target | Microseconds to milliseconds |

### 9.3 Common mistakes

- Defining virtualisation only as "multiple OSes" and omitting identity/non-bypassability.
- Treating privileged and sensitive instructions as the same classification.
- Reversing the theorem's subset direction.
- Forgetting which requirement each theorem violation breaks.
- Saying the guest kernel runs in root mode under VT-x; it runs non-root ring 0.
- Assuming early hardware virtualisation was automatically faster than DBT.
- Describing EPT as guest-managed rather than hypervisor-managed.
- Giving `24 vs 4` without the `>95%` TLB-hit context.
- Saying interrupts carry bulk I/O data; DMA carries the data.
- Mentioning only DMA remapping and forgetting interrupt remapping.
- Claiming passthrough retains transparent device migration/interposition.
- Confusing namespaces with cgroups.
- Saying containers provide VM-equivalent security solely because both use page tables.
- Calling a unikernel internally isolated; its application and OS share one address space.

### 9.4 Revision checklist

- [ ] Define virtualisation precisely and explain multiplexing, aggregation, and emulation.
- [ ] State equivalence, safety, and performance.
- [ ] Explain direct execution and Type I/II classification used in this unit.
- [ ] Use virtual, pseudo-physical, and host physical correctly.
- [ ] Describe PSW, segment translation, and trap storage in the P&G model.
- [ ] Distinguish control-sensitive, behaviour-sensitive, privileged, and innocuous instructions.
- [ ] State and apply the P&G subset theorem.
- [ ] Work both guest-OS and guest-application trap cases.
- [ ] Explain emulation versus paravirtualisation workarounds.
- [ ] Describe VT-x root/non-root modes, VMCS, and vmexits.
- [ ] Explain KVM/Qemu responsibilities.
- [ ] Compare shadow paging with EPT.
- [ ] Explain 2D page walking and TLB mitigation.
- [ ] Compare PIO/MMIO, interrupts, DMA, and ring buffers.
- [ ] Compare full emulation, virtio, passthrough, IOMMU, and SR-IOV.
- [ ] Distinguish namespace visibility from cgroup resource limits.
- [ ] Reproduce the container-versus-VM interface argument.
- [ ] Define micro VMs and unikernels and state their internal/external isolation trade.

---

## 10. Compact answer framework

For a long-form virtualisation design question:

1. Identify the **virtual resource and widely used interface**.
2. State the **equivalence, safety, and performance** requirements.
3. Separate the direct-execution fast path from trapping/emulation.
4. Identify who owns each mapping and state structure.
5. Trace CPU, memory, and I/O transitions step by step.
6. State the trusted interface and possible escape path.
7. Evaluate compatibility, migration, isolation, and performance trade-offs.

This framework connects Popek-Goldberg theory to VT-x/EPT, I/O design, containers, and unikernels across all five Chapter 6 decks.
