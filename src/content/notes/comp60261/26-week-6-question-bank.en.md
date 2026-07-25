---
subject: COMP60261
chapter: 26
title: "Week 6 — Question Bank"
language: en
---

# Week 6 — Virtualisation: Worked Question Bank

Drills the Popek and Goldberg theorem and its violation on x86, VT-x and EPT mechanics, the I/O virtualisation spectrum, and the container/VM isolation comparison.

## Task types drilled

1. **Theorem application** — decide virtualisability from an instruction-set description.
2. **Violation diagnosis** — identify why a specific instruction breaks the condition.
3. **Translation arithmetic** — count memory accesses for nested paging.
4. **Exit-cost reasoning** — explain performance from VM exit frequency.
5. **I/O mechanism selection** — choose an approach and state what is sacrificed.
6. **Isolation comparison** — argue container vs VM from attack-surface size.
7. **Terminology precision** — use GVA/GPA/HPA correctly.

---

# Section A — Recall and theory

## Q1. State the Popek and Goldberg theorem and the three requirements it serves.

### Solution

**Step 1: State the requirements.**
- **Equivalence/fidelity** — a program on the VM behaves essentially as on real hardware.
- **Resource control/safety** — the hypervisor retains complete control; the guest cannot affect anything outside its allocation.
- **Efficiency** — a statistically dominant fraction of instructions execute **directly on the hardware** without hypervisor intervention.

**Step 2: State the theorem.** A VMM may be constructed for a machine if the set of **sensitive instructions is a subset of the set of privileged instructions**.

**Step 3: Give the intuition.** Every instruction that could observe or alter machine state must **trap** when executed in user mode. Then the hypervisor sees every action needing virtualisation, and everything else may run natively.

**Step 4: Identify which requirement forces the condition.** **Efficiency.** Equivalence and resource control alone are satisfiable by interpreting every instruction — that is an emulator. The theorem is about achieving those two *while* running most instructions natively.

---

## Q2. Define privileged, sensitive, and innocuous instructions, and explain trap-and-emulate.

### Solution

**Step 1: Privileged.** Instructions that **trap** if executed in user mode.

**Step 2: Sensitive.** Instructions whose behaviour depends on, or changes, machine configuration or privilege state. Two sub-kinds: **control-sensitive** (change resource configuration) and **behaviour-sensitive** (produce different results depending on mode).

**Step 3: Innocuous.** Everything else — ordinary computation.

**Step 4: Describe trap-and-emulate.** Run the guest OS **deprivileged**: in user mode, though it believes itself privileged. When it executes a privileged instruction, the CPU traps to the hypervisor, which decodes the instruction, emulates its effect on the guest's *virtual* machine state, and resumes the guest.

**Step 5: Locate the efficiency.** Innocuous instructions — the overwhelming majority — execute natively at full speed with no hypervisor involvement. Only the rare privileged ones cost a trap.

---

## Q3. How did pre-2005 x86 violate the theorem? Give the canonical instruction and the failure mode.

### Solution

**Step 1: State the violation abstractly.** x86 possessed instructions that were **sensitive but not privileged** — they inspected or modified machine state yet did **not** trap in user mode. So sensitive ⊄ privileged.

**Step 2: Give the canonical example — `POPF`.** It pops flags from the stack, including the interrupt-enable flag. Executed in user mode it **silently ignores** the attempt to modify that flag instead of trapping.

**Step 3: Trace the failure.** A deprivileged guest kernel executes `POPF` intending to disable interrupts. The flag does not change. **No trap occurs**, so the hypervisor never learns of the attempt and cannot emulate it. The guest now believes interrupts are disabled while they are enabled — its model of the machine has **silently diverged** from reality, and it will subsequently make unsound decisions (e.g. entering a critical section unprotected).

**Step 4: Note the second class of violation.** Reading the code segment register `CS` exposes the **current privilege level**, so a guest can discover it is running deprivileged — breaking equivalence, since a program can detect it is virtualised.

**Step 5: State why silence is the crux.** A trap would be fine — that is the normal mechanism. The fatal property is **failing without notification**, giving the hypervisor no interposition point.

---

# Section B — Applied and multi-step

## Q4. Name the three responses to x86's unvirtualisability and state each one's cost.

### Solution

**Step 1: Binary translation.** Scan and rewrite guest code before execution, replacing problematic instructions with safe sequences that call into the hypervisor. **Cost:** substantial complexity in the translator plus translation-time overhead and caching machinery. **Benefit:** fully transparent — runs unmodified guests. VMware's approach, and what made x86 virtualisation commercially viable.

**Step 2: Paravirtualisation.** Modify the guest OS to replace problematic operations with explicit **hypercalls**. **Cost:** requires source-level guest modification, so unmodified proprietary OSes cannot be run. **Benefit:** efficient and much simpler than translation. Xen's original approach.

**Step 3: Hardware support.** Change the architecture so the theorem holds — Intel **VT-x**, AMD-V. **Cost:** requires new silicon. **Benefit:** unmodified guests, no translation, and it renders the other two largely obsolete.

**Step 4: State the historical arc.** The theorem explains an era of systems engineering: x86's failure to satisfy it *caused* binary translation and paravirtualisation, and hardware extensions satisfying it made both mostly unnecessary. Paravirtualised **I/O** (virtio) survives, because its motivation is performance rather than virtualisability.

---

## Q5. Explain what VT-x adds, why the guest needs no modification, and why VM exits dominate performance.

### Solution

**Step 1: State the addition.** An orthogonal privilege dimension: **root mode** (hypervisor) and **non-root mode** (guest), each with its own complete set of rings 0–3.

**Step 2: Locate the guest.** The guest OS runs in **ring 0 of non-root mode** — genuinely privileged from its own perspective.

**Step 3: Explain why that removes the need for modification.** There is no deprivileging, so the `POPF` class of failure disappears: the guest is not lying to itself about its privilege level, and sensitive operations can be configured to cause a transition rather than silently misbehaving. Reading `CS` also yields the expected value.

**Step 4: Define the transitions.** **VM exit**: non-root → root when the guest does something requiring hypervisor attention. **VM entry**: root → non-root, resuming the guest. The **VMCS**, one per vCPU, holds guest state, host state, and control fields determining which events cause exits.

**Step 5: Quantify the cost.** An exit costs on the order of **thousands of cycles**: saving and restoring architectural state, plus the indirect cost of lost cache and TLB warmth and disrupted branch prediction.

**Step 6: Draw the design conclusion.** Since correctness is assured by hardware, hypervisor engineering becomes an exercise in **minimising exit frequency**. This single metric explains the design of nested paging (Q6) and of paravirtualised I/O (Q7).

**Step 7: Confirm the theorem is satisfied.** Every sensitive operation can be configured to exit, so sensitive ⊆ trapping, while everything else runs natively — preserving efficiency.

---

## Q6. Contrast shadow page tables with EPT. Count accesses for a full EPT walk on 4-level paging.

### Solution

**Step 1: State the problem.** The guest maintains **GVA → GPA** mappings; the hardware needs **GVA → HPA**. Two levels of translation must compose. Recall that GPA — what the guest believes is physical memory — is itself virtual.

**Step 2: Shadow page tables.** The hypervisor builds its own **GVA → HPA** tables and points the real hardware at them, treating the guest's tables as mere data. To stay consistent it **write-protects** the guest's page tables, so every guest update traps and can be reflected into the shadows.

**Step 3: State the shadow cost.** Every guest page-table write causes an exit. Page-table-heavy workloads — process creation, `fork`, context switching — exit constantly, making them very expensive. Correct, and needs no guest changes, but the exit rate is the problem.

**Step 4: EPT.** A second, **hardware-walked** translation level. The guest's own tables handle GVA → GPA exactly as on real hardware; a hypervisor-managed **EPT** handles GPA → HPA. The MMU walks both.

**Step 5: State EPT's benefit.** The guest may modify its page tables freely with **no VM exits** — the dominant win, directly addressing the shadow-table failure mode.

**Step 6: Count the accesses.** The guest walk has 4 levels. Each level's table access is itself a *guest physical* address needing EPT translation, costing 4 accesses. So 4 × 4 = 16 for the guest-table reads, plus a further 4 to translate the final GPA of the data, plus 1 to fetch the data:

```
4 guest levels × 4 EPT accesses = 16
final GPA → HPA translation      =  4
the data access itself           =  1
                             total ≈ 21–24
```

Commonly quoted as **up to ~24 memory accesses** for a fully missing translation.

**Step 7: State the mitigation.** The **TLB caches the composed GVA → HPA** translation, so hits cost nothing extra; only misses pay. Large pages shorten walks, and **VPID** tagging avoids TLB flushes on VM switch. AMD's equivalent is Nested Page Tables (NPT/RVI).

**Answer.** Shadow tables trade many exits for short walks; EPT trades longer walks for almost no exits — and since exits cost thousands of cycles while an extra access costs tens, EPT wins decisively.

---

## Q7. Place full emulation, virtio, passthrough, and SR-IOV on a spectrum, and state what each sacrifices.

### Solution

**Step 1: Full device emulation.** The hypervisor models a real device — commonly the Intel **e1000**, chosen precisely because every OS already ships a driver for it. The guest's unmodified driver writes to what it believes are registers; those pages are configured to cause exits; the hypervisor decodes, updates the model, and performs real I/O. **Sacrifices performance:** one high-level operation may touch many registers, each an exit. The worst-performing option, and the reason the others exist. **Gains:** completely unmodified guests.

**Step 2: Paravirtualised I/O (virtio).** Replace the emulated hardware interface with one designed for virtualisation, plus a matching guest driver. A **ring buffer** shared between guest and hypervisor holds descriptors pointing at data buffers, so requests are **batched** per notification, data moves by reference rather than through registers, and **notification suppression** lets either side poll instead — eliminating exits under load. **Sacrifices:** requires virtio drivers in the guest, though these are universal for Linux and available for Windows, so the trade is nearly free in practice.

**Step 3: Direct device assignment (passthrough).** Give the guest exclusive direct access to physical hardware; near-native performance, hypervisor out of the data path. **Requires** an **IOMMU** and interrupt remapping. **Sacrifices:** the device is dedicated to one guest (no sharing), and **live migration breaks**, because device state is outside hypervisor control. Also sacrifices **I/O interposition** (Q8).

**Step 4: SR-IOV.** A capable device presents multiple **virtual functions**, each assignable to a different guest — passthrough performance *with* sharing. **Sacrifices:** requires hardware support, and migration remains awkward.

**Step 5: State the ordering.** Performance ascends emulation → virtio → passthrough/SR-IOV; guest transparency descends after emulation; hypervisor control descends sharply at passthrough.

---

## Q8. Why is the IOMMU a security requirement rather than a performance feature?

### Solution

**Step 1: State the gap.** **DMA bypasses the MMU entirely.** A device transfers data to and from memory without CPU involvement, so CPU page-table permissions do not apply to it.

**Step 2: State the consequence without an IOMMU.** A guest granted direct control of a device can program that device to DMA to **any host physical address** — the hypervisor's own memory, or another guest's. Isolation is trivially escaped, and no CPU-side mechanism can prevent it.

**Step 3: Define the IOMMU's role.** A device-side MMU translating and **restricting** the addresses a device may access, confining its DMA to the guest's own memory. It supplies for devices what the MMU supplies for the CPU.

**Step 4: Note the broader applicability.** It also protects the host from malicious peripherals generally — the basis of Thunderbolt/DMA attacks against machines with unrestricted DMA.

**Step 5: Concede the performance role.** It does enable efficiency features (scatter-gather, avoiding bounce buffers), which is why it is easy to misfile as an optimisation.

**Answer.** Without it, passthrough is not merely slow but **unsound** — the isolation property fails outright. It is a precondition for direct assignment, not an enhancement to it.

---

# Section C — Extended / exam-style

## Q9. Explain I/O interposition and why passthrough's cost is architectural rather than merely operational.

### Solution

**Step 1: Define interposition.** Because the hypervisor sits in the I/O path, it **sees every I/O operation** and can transparently add functionality the guest knows nothing about.

**Step 2: Enumerate what it enables.** Storage snapshots, copy-on-write disks, thin provisioning, encryption at rest, deduplication, replication; network filtering, monitoring, rate limiting, and software-defined networking.

**Step 3: Reframe the hypervisor's position.** Being in the path is usually presented as pure overhead. It is also the **source of most of virtualisation's operational value** — the features above are why virtualised infrastructure is manageable at all.

**Step 4: State what passthrough gives up.** By removing the hypervisor from the data path, direct assignment removes the interposition point. Every listed feature becomes unavailable **by construction**, not by configuration.

**Step 5: Add the migration consequence.** Live migration also breaks, because device state now lives in hardware the hypervisor does not mediate — and migration is itself an interposition-dependent capability.

**Step 6: Draw the conclusion.** The trade is not "a bit faster for a bit less convenience" but **performance in exchange for the entire management layer**. That is why SR-IOV matters (it restores sharing but not interposition) and why most cloud workloads use virtio rather than passthrough despite the performance gap — the features are worth more than the cycles.

---

## Q10. A team wants to run untrusted customer code and proposes containers for density. Assess and recommend.

### Solution

**Step 1: State what containers are.** Not hardware virtualisation: **isolation of process groups within a single shared kernel**. **Namespaces** restrict *visibility* (PID, mount, network, UTS, IPC, user, cgroup); **cgroups** restrict *consumption* (CPU, memory, block I/O, devices), which is what supplies the limited availability protection namespaces alone lack.

**Step 2: Grant the density argument.** Millisecond start-up, megabyte-scale footprint, very high density, no duplicated guest kernel — genuinely better than VMs for packing many instances.

**Step 3: State the decisive objection.** The isolation boundary is the kernel's **syscall interface**: hundreds of calls with complex arguments, all reachable from inside the container. A single kernel privilege-escalation bug compromises the host and therefore **every** container on it. A hypervisor's interface is far narrower and thus far more defensible.

**Step 4: Apply to the stated threat.** "Untrusted customer code" means an adversary executing arbitrary code with the full syscall surface available, deliberately hunting kernel bugs. This is the case containers are **weakest** against — precisely the hostile-tenant scenario.

**Step 5: List the compounding risks.** Container root mapping to real root without user namespaces; excessive capabilities (notably `CAP_SYS_ADMIN`); mounted sensitive host paths or the Docker socket; missing cgroup limits enabling resource-exhaustion DoS; shared-kernel side channels; untrusted images.

**Step 6: Recommend.** Use **micro-VMs** — **Firecracker** or **Kata Containers** — which run each workload in a stripped-down VM with a minimal device model, booting in tens of milliseconds. This retains most of the density and start-up benefit while restoring a hypervisor boundary. **gVisor** is the alternative, intercepting syscalls in a userspace kernel to shrink host kernel exposure. **Unikernels** occupy the same space: a specialised single-purpose image with VM-grade isolation at container-grade footprint.

**Step 7: State the residual hardening if containers are used anyway.** User namespaces so container root is unprivileged on the host; drop all capabilities and add back only what is needed; a tight **seccomp-BPF** profile; an LSM profile (SELinux/AppArmor); read-only root filesystem; cgroup limits; never privileged mode.

**Answer.** Containers for density among code you broadly trust; **VMs or micro-VMs when the boundary must hold against a hostile tenant** — which is this case. Recommend Firecracker or Kata.
