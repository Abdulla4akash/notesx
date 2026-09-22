---
subject: COMP60261
chapter: 16
title: "Week 6 — Flashcards"
language: en
---

# Week 6 — Virtualisation — Flashcards

47 flashcards. Click each question to reveal the answer.

**Anki:** [Download this deck as `.apkg`](/anki/comp60261/16-week-6-flashcards.apkg) — import into Anki via *File → Import*.

<details>
<summary><strong>Q1.</strong> Name the three basic virtualisation transformations.</summary>

<b>Multiplexing</b> — one physical resource as many virtual ones.<br><b>Aggregation</b> — many physical as one.<br><b>Emulation</b> — presenting a resource differing in kind, possibly one that does not physically exist.

</details>

<details>
<summary><strong>Q2.</strong> What is a system-level VM, and how does it differ from a process-level VM?</summary>

<b>System-level:</b> presents a whole machine — CPUs, memory, devices — so an unmodified OS runs believing it owns hardware.<br><b>Process-level</b> (e.g. the JVM): virtualises an execution environment for a single program.

</details>

<details>
<summary><strong>Q3.</strong> Why did virtualisation return in the late 1990s?</summary>

The idea dated to IBM CP/CMS and VM/370 (1960s–70s) but faded as hardware got cheap.<br><b>VMware</b> showed x86 could be virtualised despite hardware not designed for it, using binary translation. Hardware support (VT-x, AMD-V) followed, making virtualisation the substrate of cloud computing.

</details>

<details>
<summary><strong>Q4.</strong> Contrast Type I and Type II hypervisors, and place KVM.</summary>

<b>Type I (bare-metal):</b> runs directly on hardware (Xen, ESXi, Hyper-V) — better performance, smaller TCB, production clouds.<br><b>Type II (hosted):</b> an application on a host OS (VirtualBox, VMware Workstation) — easier, but the whole host OS is in the TCB.<br><b>KVM</b> blurs the line: a kernel module, so in-kernel with direct hardware access, yet a full general-purpose OS is present.

</details>

<details>
<summary><strong>Q5.</strong> Define GVA, GPA, and HPA.</summary>

<b>GVA:</b> guest virtual address, inside a guest process.<br><b>GPA:</b> guest physical address — what the guest <i>believes</i> is physical memory.<br><b>HPA:</b> host physical address, actual machine memory.<br>The guest's &quot;physical&quot; memory is itself virtual — the source of the two-level translation problem.

</details>

<details>
<summary><strong>Q6.</strong> Why does cloud computing make the hypervisor a security boundary?</summary>

VMs are the unit of rental, so the hypervisor separates <b>mutually hostile tenants</b> on shared hardware.

</details>

<details>
<summary><strong>Q7.</strong> What enables live migration and checkpoint/restart?</summary>

A VM's whole state can be saved, resumed, or moved between physical machines with minimal downtime.<br>Enables maintenance without service interruption, and load balancing.

</details>

<details>
<summary><strong>Q8.</strong> What security benefit is unique to virtualisation?</summary>

<b>Introspection</b> — the hypervisor can inspect a guest from outside, which malware inside the guest cannot easily subvert.

</details>

<details>
<summary><strong>Q9.</strong> Define privileged, sensitive, and innocuous instructions.</summary>

<b>Privileged:</b> trap if executed in user mode.<br><b>Sensitive:</b> behaviour depends on, or changes, machine configuration or privilege state (control-sensitive: changes resource configuration; behaviour-sensitive: different results by mode).<br><b>Innocuous:</b> everything else.

</details>

<details>
<summary><strong>Q10.</strong> State Popek and Goldberg's three hypervisor requirements.</summary>

<b>Equivalence/fidelity</b> — programs run essentially as on real hardware.<br><b>Resource control/safety</b> — the hypervisor retains complete control; the guest cannot affect anything outside its allocation.<br><b>Efficiency</b> — a statistically dominant fraction of instructions execute directly on hardware.

</details>

<details>
<summary><strong>Q11.</strong> Which requirement separates a hypervisor from an emulator?</summary>

<b>Efficiency.</b> An emulator interprets everything, satisfying equivalence and resource control but not efficiency.

</details>

<details>
<summary><strong>Q12.</strong> Explain trap-and-emulate.</summary>

Run the guest OS <b>deprivileged</b> — in user mode, though it believes itself privileged.<br>A privileged instruction traps to the hypervisor, which emulates its effect on the guest's virtual state and resumes. Innocuous instructions run natively, which is where the efficiency comes from.

</details>

<details>
<summary><strong>Q13.</strong> State the Popek and Goldberg theorem.</summary>

A VMM may be constructed if the set of <b>sensitive instructions is a subset of the set of privileged instructions</b>.<br>Intuitively: every instruction that could observe or alter machine state must trap in user mode.

</details>

<details>
<summary><strong>Q14.</strong> How did pre-2005 x86 violate the theorem? Give the classic instruction.</summary>

It had sensitive-but-<b>unprivileged</b> instructions. <b>POPF</b> silently ignores attempts to modify the interrupt flag in user mode instead of trapping.<br>A deprivileged guest disabling interrupts has no effect and no trap, so its state silently diverges from what it believes. Reading <code>CS</code> similarly reveals the deprivileging.

</details>

<details>
<summary><strong>Q15.</strong> Name the three workarounds for x86's unvirtualisability.</summary>

<b>Binary translation</b> — rewrite guest code before execution (VMware); transparent but complex and costly.<br><b>Paravirtualisation</b> — modify the guest to use explicit <b>hypercalls</b> (Xen); efficient and simpler, but cannot run unmodified proprietary OSes.<br><b>Hardware support</b> — VT-x / AMD-V make x86 virtualisable by construction.

</details>

<details>
<summary><strong>Q16.</strong> What does VT-x add, and where does the guest OS run?</summary>

An orthogonal <b>root mode</b> (hypervisor) / <b>non-root mode</b> (guest) distinction, each with full rings 0–3.<br>The guest OS runs in <b>ring 0 of non-root mode</b> — genuinely privileged from its own perspective, so no modification and no deprivileging trick.

</details>

<details>
<summary><strong>Q17.</strong> What are VM exits and entries, and what is the VMCS?</summary>

<b>VM exit:</b> non-root → root, when the guest does something needing hypervisor attention. <b>VM entry:</b> root → non-root, resuming.<br><b>VMCS:</b> one per vCPU, holding guest state, host state, and control fields determining which events cause exits.

</details>

<details>
<summary><strong>Q18.</strong> Why is minimising VM exits the central performance concern?</summary>

Exits cost thousands of cycles — state save/restore plus lost cache and TLB warmth.

</details>

<details>
<summary><strong>Q19.</strong> How does VT-x satisfy the P&amp;G criteria?</summary>

Every sensitive operation can be configured to cause a VM exit, so <b>sensitive ⊆ trapping</b>, while the guest runs natively otherwise, preserving efficiency.

</details>

<details>
<summary><strong>Q20.</strong> State the memory virtualisation problem.</summary>

The guest maintains page tables mapping <b>GVA → GPA</b>, but hardware needs <b>GVA → HPA</b>.<br>Two levels of translation must be composed.

</details>

<details>
<summary><strong>Q21.</strong> How do shadow page tables work, and what is their cost?</summary>

The hypervisor keeps its own GVA → HPA tables and points real hardware at them, treating guest tables as mere data. It <b>write-protects</b> the guest's tables so every guest update traps and can be reflected.<br><b>Cost:</b> page-table-heavy workloads exit constantly — process creation and context switching become very expensive.

</details>

<details>
<summary><strong>Q22.</strong> How do Extended Page Tables work?</summary>

A second hardware-walked translation level: guest tables handle GVA → GPA as on real hardware, a hypervisor-managed <b>EPT</b> handles GPA → HPA, and the MMU walks both.<br>AMD's equivalent is Nested Page Tables (NPT/RVI).

</details>

<details>
<summary><strong>Q23.</strong> State EPT's main benefit and its main cost.</summary>

<b>Benefit:</b> the guest modifies its page tables freely with <b>no VM exits</b>.<br><b>Cost:</b> a longer walk — the EPT is walked for each level of the guest walk, so a full miss approaches ~24 memory accesses on 4-level paging. Mitigated by large pages and VPID tagging.

</details>

<details>
<summary><strong>Q24.</strong> Describe KVM's division of labour.</summary>

KVM handles CPU and memory virtualisation (VT-x/EPT); <b>Linux</b> provides scheduling and memory management free — a vCPU is just a thread, so CFS schedules it; <b>QEMU</b> does device emulation in userspace, where a device-model bug is contained in an unprivileged process rather than the kernel.

</details>

<details>
<summary><strong>Q25.</strong> How does userspace run a vCPU under KVM?</summary>

QEMU opens <code>/dev/kvm</code>, creates the VM, allocates guest memory from its own address space, and runs vCPUs as ordinary Linux threads via an <code>ioctl</code> that enters non-root mode; the thread returns from the <code>ioctl</code> on a VM exit.

</details>

<details>
<summary><strong>Q26.</strong> What does mapping guest memory into QEMU's address space buy?</summary>

Linux's existing memory management — paging, swapping, page sharing, KSM deduplication — applies to guest memory, with KVM programming the EPT accordingly.

</details>

<details>
<summary><strong>Q27.</strong> What three physical I/O facilities must a hypervisor intercept or arrange?</summary>

Memory-mapped registers (MMIO) or port I/O; <b>interrupts</b> for completion; and <b>DMA</b> moving bulk data directly to and from memory without the CPU.

</details>

<details>
<summary><strong>Q28.</strong> How does full device emulation work, and why the e1000?</summary>

The hypervisor implements a software model of a real device; the guest's unmodified driver writes to what it thinks are registers, those pages cause VM exits, and the hypervisor decodes, updates the model, and performs real I/O via the host driver.<br>The <b>e1000</b> is chosen precisely because every OS already ships a driver for it.

</details>

<details>
<summary><strong>Q29.</strong> What is the cost of full device emulation?</summary>

<b>Very slow</b> — a single high-level operation may touch many registers, each costing a VM exit.<br>The worst-performing option, and the reason alternatives exist.

</details>

<details>
<summary><strong>Q30.</strong> What is paravirtualised I/O, and what is the standard?</summary>

Replace the emulated hardware interface with one designed for virtualisation, plus a matching guest driver.<br><b>virtio</b> is the standard (virtio-net, virtio-blk).

</details>

<details>
<summary><strong>Q31.</strong> How do virtio ring buffers achieve their performance?</summary>

A ring shared between guest and hypervisor holds descriptors pointing at data buffers, so many requests are <b>batched</b> per notification, data goes by reference not copy, and <b>notification suppression</b> lets either side poll instead — eliminating exits under load.

</details>

<details>
<summary><strong>Q32.</strong> What is the trade-off of paravirtualised I/O?</summary>

Far better performance than emulation, but requires virtio drivers in the guest.<br>Universally available for Linux and available for Windows, so the trade is nearly free in practice.

</details>

<details>
<summary><strong>Q33.</strong> What is direct device assignment, and what does it require?</summary>

Give a guest exclusive direct access to a physical device — near-native performance, hypervisor out of the data path.<br>Requires an <b>IOMMU</b> and <b>interrupt remapping</b>.

</details>

<details>
<summary><strong>Q34.</strong> Why is the IOMMU a security requirement, not just performance?</summary>

Without it a guest could program a device to <b>DMA to any host physical address</b>, trivially escaping isolation.<br>The IOMMU restricts device DMA to the guest's own memory — and also protects against malicious peripherals generally (Thunderbolt/DMA attacks).

</details>

<details>
<summary><strong>Q35.</strong> What does direct assignment give up, and what does SR-IOV fix?</summary>

Gives up device <b>sharing</b> and breaks <b>live migration</b> (device state is outside hypervisor control).<br><b>SR-IOV</b> presents multiple <b>virtual functions</b>, each assignable to a different guest — passthrough performance with sharing. Migration remains awkward.

</details>

<details>
<summary><strong>Q36.</strong> What is I/O interposition, and why is it an architectural benefit?</summary>

Because the hypervisor sees every I/O operation, it can transparently add functionality the guest knows nothing about: snapshots, copy-on-write disks, thin provisioning, encryption at rest, deduplication, replication, network filtering, rate limiting, SDN.<br><b>Passthrough trades interposition (and migration) for performance.</b>

</details>

<details>
<summary><strong>Q37.</strong> Why are full VMs too heavyweight for microservices?</summary>

Each runs a complete guest OS — hundreds of megabytes, seconds to boot, duplicating kernel functionality already on the host.<br>Deploying many instances of one application makes that overhead dominate.

</details>

<details>
<summary><strong>Q38.</strong> State the key idea of containers.</summary>

Rather than virtualising hardware and running another kernel, <b>isolate groups of processes within a single shared kernel</b> so each sees only its own resources.

</details>

<details>
<summary><strong>Q39.</strong> What do namespaces do, and name the types.</summary>

Restrict <b>visibility</b>, each virtualising one global resource: PID (own process tree and PID 1), mount, network, UTS (hostname), IPC, user (UID mapping, enabling unprivileged containers), cgroup.<br>A process in a PID namespace cannot see or signal processes outside it.

</details>

<details>
<summary><strong>Q40.</strong> What do cgroups do, and which security property do they provide?</summary>

Restrict <b>consumption</b> — hierarchical limits and accounting for CPU, memory, block I/O, device access.<br>They provide the degree of <b>availability</b> protection that namespaces alone do not.

</details>

<details>
<summary><strong>Q41.</strong> Which Week 4 mechanisms are normally composed with containers?</summary>

seccomp-BPF to restrict syscalls, capability dropping, and an LSM profile (SELinux/AppArmor) — plus a root filesystem image.

</details>

<details>
<summary><strong>Q42.</strong> Compare containers and VMs on isolation boundary and cost.</summary>

<b>Containers:</b> shared host kernel, no guest kernel, millisecond start, megabytes, very high density, host kernel only, <b>weaker</b> isolation.<br><b>VMs:</b> hypervisor boundary, full guest kernel, seconds, hundreds of MB, lower density, any guest OS, <b>stronger</b> isolation.

</details>

<details>
<summary><strong>Q43.</strong> Why are containers fundamentally weaker than VMs?</summary>

The isolation boundary is the kernel's <b>syscall interface</b> — hundreds of syscalls with complex arguments, all reachable from inside.<br>One kernel privilege-escalation bug compromises the host and every container on it. A hypervisor's interface is far narrower.

</details>

<details>
<summary><strong>Q44.</strong> Name the container-specific risks.</summary>

Running as root inside mapping to real root without user namespaces; excessive capabilities (notably <code>CAP_SYS_ADMIN</code>); mounting sensitive host paths or the Docker socket; missing cgroup limits allowing DoS; shared-kernel side channels; untrusted images.

</details>

<details>
<summary><strong>Q45.</strong> How do you harden a container in practice?</summary>

User namespaces so container root is unprivileged on the host; drop all capabilities and add back only what is needed; a tight seccomp profile; an LSM profile; read-only root filesystem; cgroup limits; no privileged mode.

</details>

<details>
<summary><strong>Q46.</strong> How do gVisor, Kata, and Firecracker close the container/VM gap?</summary>

<b>gVisor</b> intercepts syscalls in a userspace kernel, shrinking host kernel exposure.<br><b>Kata</b> and <b>Firecracker</b> run each container in a stripped-down <b>micro-VM</b> with a minimal device model, booting in tens of milliseconds.<br>Unikernels reappear here too: a specialised single-purpose image with VM-grade isolation at container-grade footprint.

</details>

<details>
<summary><strong>Q47.</strong> State the general judgement on containers versus VMs.</summary>

<b>Containers</b> for density, speed, and packaging among code you broadly trust.<br><b>VMs or micro-VMs</b> when the boundary must hold against a hostile tenant.

</details>
