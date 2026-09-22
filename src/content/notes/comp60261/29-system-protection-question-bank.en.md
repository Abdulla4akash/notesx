---
subject: COMP60261
chapter: 29
title: "System Protection — Question Bank"
language: en
---

# System Protection — Worked Question Bank

Companion to the Hardware Lecture 3 notes. Drills DMA and the IOMMU, TrustZone, the virtualisation privilege model and two-stage translation, guest device models, and confidential computing including ARM CCA, GPC, and MEE.

## Task types drilled

1. **Threat reasoning beyond the CPU** — identify what a CPU-centric model misses.
2. **IOMMU function analysis** — separate translation from protection.
3. **TrustZone mechanism** — explain the NS-bit and world switching.
4. **Privilege-model placement** — locate hypervisor, host, and guest.
5. **Two-stage translation** — reason about nested address spaces.
6. **Device-model selection** — choose emulation, paravirtualisation, or passthrough.
7. **Confidential computing analysis** — determine the TCB and what each block provides.

---

# Section A — DMA and the IOMMU

## Q1. Why are CPU-centric protection models insufficient for real systems?

### Solution

**Step 1: State the assumption in the CPU-centric view.** The von Neumann picture has one CPU accessing one memory, so protecting memory means constraining CPU accesses — via rings and the MMU.

**Step 2: State the reality.** A modern SoC contains **many bus masters**: the CPU cores plus GPU, DSP, modem, display controller, storage and network controllers, and dedicated DMA engines. A phone SoC such as the Qualcomm Snapdragon 600 has numerous independent initiators.

**Step 3: Identify the gap.** Every one of these can issue memory transactions **without passing through the CPU's MMU**. Page-table permissions constrain the CPU only.

**Step 4: State the consequence.** A compromised or malicious peripheral — or a driver that can program one — reads or writes arbitrary physical memory, defeating all CPU-side isolation regardless of how correctly it is configured.

**Step 5: Draw the conclusion.** Protection must be enforced at the **system** level, on the interconnect, not merely in the CPU. This motivates the IOMMU, TrustZone's bus-level NS-bit, and CCA's Granularity Protection Check.

---

## Q2. Define DMA, explain how software uses it, and state precisely why it is dangerous.

### Solution

**Step 1: Define.** **Direct Memory Access** lets a device transfer data to and from main memory **without CPU involvement** in each word moved.

**Step 2: State the motivation.** Without it, the CPU would copy every byte between device and memory, wasting cycles and stalling on slow I/O. DMA lets the CPU issue a request and do other work.

**Step 3: Describe the software flow.** The driver allocates a buffer, obtains its **physical** address, programs the device's registers with that address and a length, and starts the transfer. The device signals completion by **interrupt**. Scatter-gather hardware accepts a list of physical fragments so the buffer need not be contiguous.

**Step 4: State the danger.** The device is given a **raw physical address** and performs the access itself. It is not subject to the MMU, so nothing checks whether the address belongs to the requesting driver, to another process, to the kernel, or to another VM.

**Step 5: State the exploitation shapes.** A buggy or malicious driver programs a device to DMA over kernel memory; a compromised peripheral's firmware does so on its own initiative; or an external port with DMA capability (Thunderbolt/FireWire) lets a physically present attacker read memory directly.

**Step 6: State the required fix.** An address-translation and permission layer **between devices and memory** — the IOMMU. Note that this is the same argument as for the CPU MMU, applied to the other initiators.

---

## Q3. State the IOMMU's two functions and the threats it mitigates. What vulnerabilities does it introduce?

### Solution

**Step 1: Function 1 — address translation.** It maps device-visible addresses (IOVAs) to physical addresses via its own page tables. Consequences: devices can be given contiguous IOVA ranges backed by scattered physical pages (removing the need for physically contiguous buffers and bounce buffers), and devices with narrow address widths can reach memory beyond their native range.

**Step 2: Function 2 — memory protection.** Each device (or group) is assigned a **domain** with its own translation tables, so a device can only reach memory explicitly mapped for it. Unmapped accesses are blocked and faulted.

**Step 3: Describe the translation process.** The transaction carries a device identifier (on PCIe, the bus/device/function). The IOMMU uses it to select the device's context entry, which points to a page-table hierarchy; the IOVA is then walked much as a CPU virtual address is, yielding a physical address and permissions. An IOTLB caches results.

**Step 4: State the threats mitigated.** Malicious or compromised peripheral firmware; DMA attacks over external ports; buggy drivers programming wrong addresses; and, crucially, **safe device passthrough to VMs** — a guest can be given direct device control because the IOMMU confines that device's DMA to the guest's own memory.

**Step 5: State the vulnerabilities introduced.** The IOMMU is itself complex, adding attack surface: its page tables are in memory and must be protected; misconfiguration (overly broad mappings, or leaving mappings live longer than needed) silently removes the protection; **device grouping** may force several devices to share a domain, so isolation is coarser than it appears; interrupt remapping must also be correct or interrupt injection is possible; and there is a **window** during boot before the IOMMU is configured.

**Step 6: State the OS burden.** Managing per-domain page tables, mapping and unmapping around every transfer, and IOTLB invalidation — real software complexity and a source of both bugs and performance cost.

---

## Q4. Explain address bit restriction with a worked example, and give its pros and cons.

### Solution

**Step 1: State the idea.** Rather than a full translating IOMMU, simply **do not wire** some address lines from a device to the interconnect. The device becomes physically incapable of naming addresses outside a restricted window.

**Step 2: Work the example.** A device on a 32-bit bus with only the low **28** address lines connected can generate addresses in the range

```
0  …  2^28 − 1   =  0x0000_0000 … 0x0FFF_FFFF   (256 MB)
```

The upper 4 bits are not driven, so no transaction from that device can reference anything above 256 MB. If sensitive memory is placed above that line, the device cannot touch it.

**Step 3: State the pros.** Essentially zero cost — no page tables, no translation latency, no software management. It cannot be misconfigured at runtime because it is physical wiring, and it cannot be bypassed by firmware.

**Step 4: State the cons.** Extremely **coarse** and **static**: one contiguous window per device, fixed at design time, with no per-process or per-VM granularity. It constrains the memory layout of the whole system, and it cannot express changing policy — so it cannot support passthrough to different guests over time.

**Step 5: State where it fits.** Deeply embedded systems with a fixed, known set of devices and a static memory map, where an IOMMU's area and complexity are unjustifiable. It illustrates the general trade: **static physical restriction is cheap and inflexible; dynamic translation is expensive and expressive.**

---

# Section B — TrustZone and virtualisation

## Q5. Explain TrustZone's two worlds, the NS-bit, and the Secure Monitor's role.

### Solution

**Step 1: State the partition.** TrustZone divides the system into a **Secure world** and a **Normal (non-secure) world**. This is a system-wide split, not a per-application one, and it is orthogonal to the ordinary privilege levels — each world has its own.

**Step 2: State the asymmetry.** The Secure world may access Normal-world resources; the Normal world **cannot** access Secure-world resources. Secrets live in the Secure world, and a fully compromised Normal-world OS still cannot reach them.

**Step 3: Explain the NS-bit — the key mechanism.** Security state is propagated as an **extra bit on the system bus**, effectively giving the interconnect "+1 address width." Every transaction carries its world, so memory controllers and peripherals can enforce the split themselves.

**Step 4: State why this matters architecturally.** Enforcement is **system-wide, not CPU-only**. Because the NS-bit travels with every bus transaction, DMA-capable peripherals are covered too — addressing exactly the Q1 gap. In effect there are **two physical address spaces**, secure and non-secure, distinguished by that bit.

**Step 5: Explain the Secure Monitor.** World switching passes through a **Secure Monitor** running at the highest privilege (EL3 on modern ARM), entered by a dedicated call (`SMC`). It saves and restores state and is the sole gatekeeper of transitions — so it is a small, highly trusted component whose correctness is critical.

**Step 6: Give the use cases.** An encrypted filesystem, where keys and crypto operations stay in the Secure world so the Normal-world OS never sees the key; and biometric authentication, where the sensor and matching are Secure-world-owned so the Normal world receives only a yes/no result.

**Step 7: State the caveat.** The Secure world is a full software stack and can itself contain vulnerabilities. Documented TrustZone "backdoor" cases show that a bug in Secure-world code is maximally severe — it is trusted by everything and inspectable by nothing.

---

## Q6. Explain why virtualisation required another privilege level, and describe the negative-rings model.

### Solution

**Step 1: State the problem.** A guest OS expects to run at the highest privilege (ring 0), since it manages page tables and devices. But the hypervisor must be **more** privileged, to retain control over the guest. Two entities both wanting ring 0 is a contradiction.

**Step 2: Recall the pre-hardware workarounds.** Deprivileging the guest (ring compression) plus binary translation or paravirtualisation — necessary because x86 had sensitive-but-unprivileged instructions that failed silently rather than trapping.

**Step 3: State the hardware answer.** Add a distinct mode for the hypervisor: **VMX root mode** on Intel (with the guest in non-root mode), EL2 on ARM, HS-mode on RISC-V. The guest keeps its full ring hierarchy inside its own mode and needs no modification.

**Step 4: Explain the "negative rings" model.** Informally, the hypervisor is described as **ring −1**, sitting beneath ring 0. Extending the picture, **SMM** or a Secure Monitor is sometimes called ring −2 and platform management engines ring −3. It is not architectural terminology, but it conveys the essential point: **privilege continued to be added below what was once the floor.**

**Step 5: Define a VM exit.** A transition from guest (non-root) to hypervisor (root) when the guest performs something requiring mediation. Its counterpart is VM entry. Exits are the interposition points, and each is expensive, so minimising them dominates hypervisor performance design.

**Step 6: Note the security consequence.** Each new privilege layer is more trusted than everything above it and correspondingly harder to inspect. The lowest layers are the smallest but the most consequential — which is why hypervisor formal verification (seL4, CertiKOS) is an active goal.

---

## Q7. Explain two-stage translation, name the hardware structures, and state why identifiers matter.

### Solution

**Step 1: State the requirement.** The guest translates its own virtual addresses to what it believes are physical addresses; the hypervisor must map those onto real machine memory. Two translations must compose.

**Step 2: Name the stages.** **Stage 1** — guest virtual → guest physical, controlled by the **guest** using its own page tables, exactly as on real hardware. **Stage 2** — guest physical → host physical, controlled by the **hypervisor**, invisible to the guest.

**Step 3: Name the hardware.** Intel **EPT**, AMD **NPT/RVI**, ARM **stage-2 translation tables**. VM control state lives in the **VMCS** (Intel) or **VMCB** (AMD), one per vCPU, holding guest state, host state, and exit controls.

**Step 4: State the software view.** The guest OS is unaware of stage 2 and manages its page tables freely, with **no VM exits** on page-table writes — the decisive advantage over shadow page tables, where the hypervisor had to write-protect guest tables and trap every update.

**Step 5: State the cost.** A full walk must traverse both levels, so a missing translation costs roughly the product of the two walks — up to around two dozen memory accesses on four-level paging. The TLB caches the **composed** translation, so hits are as fast as native.

**Step 6: Explain why identifiers matter.** Tagging TLB entries with a **VMID/VPID** (and ASIDs within a guest) lets entries for different VMs coexist, so a VM switch need not flush the whole TLB. This is a **performance** mechanism, but also a **security** one: correct tagging is what prevents one VM from hitting on another's cached translations. Similarly, **IOMMU domain IDs** associate each device with the right guest's translation tables, which is what makes passthrough safe.

---

## Q8. Compare passthrough, full emulation, and paravirtualised devices. Where does VirtIO's attack surface lie?

### Solution

**Step 1: State the hypervisor's obligation.** The guest expects hardware. The hypervisor must present devices while multiplexing real ones and preserving isolation.

**Step 2: Passthrough / pinned physical device.** The guest is given direct control of real hardware. **Near-native performance**; requires an **IOMMU** to confine the device's DMA. Costs: the device is dedicated to one guest, live migration breaks, and the hypervisor loses I/O interposition.

**Step 3: Full software emulation.** The hypervisor models a real device (commonly the e1000 NIC), so an unmodified guest driver works. Register accesses trap to the hypervisor, which updates the model and performs real I/O. **Maximum compatibility, worst performance** — one logical operation may touch many registers, each an exit.

**Step 4: Paravirtualised devices.** A virtualisation-aware interface plus a matching guest driver. The guest cooperates rather than pretending to drive hardware. Far better performance than emulation; requires drivers in the guest.

**Step 5: Describe VirtIO.** The standard paravirtualisation framework — virtio-net, virtio-blk and others. Components: a **front-end driver** in the guest, a **back-end** in the hypervisor or a userspace process, and **virtqueues** (shared ring buffers) between them. Requests are **batched** per notification, data moves by reference, and notification suppression eliminates exits under load.

**Step 6: Locate VirtIO's attack surface.** The **shared virtqueues and the back-end that parses them**. The guest fully controls the ring contents — descriptors, indices, lengths, and buffer addresses — so the back-end is parsing hostile input **on the host side of the isolation boundary**. A back-end that trusts a descriptor's length or address is a **guest-to-host escape**. This is a compartment interface vulnerability in the Week 5 sense: performance demanded shared memory, and shared memory is where validated data can change after checking.

**Step 7: Note the mitigation.** Run the back-end in a **deprivileged userspace process** (as QEMU does, and vhost-user more so) so a back-end compromise does not immediately mean kernel or hypervisor compromise — device-model bugs are contained rather than fatal.

---

## Q9. Define VM escape and explain why hypervisor formal verification is pursued.

### Solution

**Step 1: Define.** A **VM escape** is a guest breaking out of its VM to execute code in, or otherwise control, the hypervisor or host — thereby reaching other guests.

**Step 2: State why it is the critical threat.** In multi-tenant cloud infrastructure, the hypervisor is the **only** boundary between mutually hostile tenants. Its failure compromises every VM on the machine, so an escape is the highest-value cloud outcome.

**Step 3: Enumerate the surface.** Device model / emulation code (historically the most productive source, being large and parsing guest-controlled input); VirtIO back-ends (Q8); the instruction emulator used on some exits; nested paging management; and any hypercall interface.

**Step 4: State the argument for verification.** The hypervisor's interface is **narrow** compared with a kernel's syscall surface, and its core is small. That combination — small, critical, well-specified — is exactly the profile where formal proof of functional correctness is tractable and worth the cost.

**Step 5: Give the exemplars and the caveat.** **seL4** is a formally verified microkernel usable as a hypervisor, at roughly 10k lines. The caveat is that verification covers the proved core under stated assumptions; the **device models**, which are the actual bug farm, are typically outside it. Hence the complementary strategy of deprivileging device models rather than proving them.

---

# Section C — Confidential computing

## Q10. State the three states of data, explain why "in use" is hardest, and give the cloud threat scenario.

### Solution

**Step 1: Name the states.** **At rest** (stored), **in transit** (moving across a network), **in use** (loaded in memory and being processed).

**Step 2: At rest.** Solved by storage encryption (dm-crypt, self-encrypting drives). The data is never needed in plaintext while stored.

**Step 3: In transit.** Solved by transport encryption (TLS). Again the data need not be plaintext while moving.

**Step 4: Why in use is different.** The CPU must **operate on plaintext**. Values must be in registers and cache for arithmetic and comparison to be possible. So the data is necessarily decrypted somewhere, and whoever controls that place — the OS, the hypervisor, the machine operator — can read it. Encryption alone cannot help, because the computation requires the cleartext.

**Step 5: State the cloud scenario.** A tenant runs a workload on a provider's machine. The provider's hypervisor maps the guest's memory and can read it at will; a malicious administrator, a compromised host, or a legal compulsion all yield the tenant's data. The tenant must trust the provider's **entire** stack, which is exactly the TCB problem confidential computing addresses.

**Step 6: Note the partial alternatives.** Homomorphic encryption and secure multi-party computation compute on encrypted data without decryption, but at large performance cost and with restricted expressiveness — which is why hardware-enforced isolation is the mainstream answer.

---

## Q11. Define confidential computing, name its key functional blocks, and state its threat model.

### Solution

**Step 1: Define.** Protecting **data in use** by performing computation in a hardware-enforced environment isolated from privileged software, so the OS, hypervisor, and operator are removed from the TCB.

**Step 2: Name the implementations.** Intel SGX and TDX, AMD SEV/SEV-SNP, ARM CCA, and RISC-V equivalents. They differ mainly in **granularity**: enclave within a process, whole VM, or realm.

**Step 3: Name the key functional blocks.**
- **Isolation/access control** — hardware prevents privileged software reading protected memory (page tagging, a Granularity Protection Check, or equivalent).
- **Memory encryption** — protects against physical attacks on DRAM and against anything observing the bus.
- **Attestation** — proves which code is running on genuine hardware.
- **Key management and sealing** — binds secrets to a measured identity.
- **A trusted monitor/manager** — a small privileged component managing lifecycle transitions.

**Step 4: State what is inside the threat model.** A malicious or compromised **hypervisor**, **host OS**, and **operator**; other tenants; and physical attackers reading DRAM or the memory bus.

**Step 5: State what is outside it.** **Availability** — privileged software can always refuse to schedule or can destroy the environment. **Side channels** — cache, timing, and transient-execution channels are largely out of scope and have repeatedly broken these systems. **Bugs inside** the protected environment. And **the hardware vendor**, who becomes an unauditable trust anchor holding the attestation root.

**Step 6: State the honest summary.** Confidential computing **relocates** trust from the operator to the silicon vendor and shrinks the TCB substantially; it does not eliminate trust, and it explicitly does not defend availability or microarchitectural leakage.

---

## Q12. Explain ARM CCA: the four security states, realms, and hardware page tagging.

### Solution

**Step 1: State the starting point.** Classic TrustZone offers **two** states, Secure and Normal. That suffices for a device vendor's secrets but not for **mutually distrusting tenants** on shared infrastructure, since there is only one Secure world and the platform owner controls it.

**Step 2: Name the four CCA states.** **Non-secure** (normal OS and hypervisor), **Secure** (traditional TrustZone), **Realm** (confidential workloads), and **Root** (the most privileged monitor managing the others).

**Step 3: Define a realm.** A protected execution environment — typically a VM — isolated from the Non-secure hypervisor that nonetheless *schedules* it. So the untrusted hypervisor retains resource management while being denied access to realm contents. That separation of **management** from **access** is the central design idea.

**Step 4: Name the managing component.** The **Realm Management Monitor (RMM)**, running in Realm-EL2, handles realm lifecycle — creation, memory delegation, entry and exit — with the Root world (a monitor at EL3) above it. The RMM is small and trusted, deliberately so.

**Step 5: Explain hardware page tagging.** Every page of physical memory is **tagged** with the security state that owns it. The hardware checks, on each access, that the accessor's current state matches the page's tag. Memory is explicitly **delegated** from Non-secure to Realm and **undelegated** on return — and is scrubbed on transition so no residue crosses.

**Step 6: State why tagging rather than translation.** A translation-based scheme would rely on the hypervisor's stage-2 tables, which is precisely the entity being distrusted. Tags are maintained by hardware and the Root/RMM, so the hypervisor cannot grant itself access by editing page tables — it can only manage which pages a realm has, not read them.

---

## Q13. Explain the Granularity Protection Check and the Memory Encryption Engine, and their sequential operation.

### Solution

**Step 1: Define the GPC.** The **Granularity Protection Check** is a hardware access check consulting a **Granule Protection Table** that records, for each physical granule, which security state owns it. On every access the accessor's state is compared against the granule's tag; a mismatch is faulted.

**Step 2: State what the GPC defends against.** **Software** attacks from privileged code — a malicious hypervisor attempting to read realm memory is blocked, because its Non-secure state does not match the granule's Realm tag. Note that this is a check on the **access path**, independent of the translation tables the hypervisor controls.

**Step 3: Define the MEE.** The **Memory Encryption Engine** encrypts (and in stronger variants integrity-protects) data as it leaves the SoC for DRAM, and decrypts on the way back, using keys held in hardware and never exposed to software.

**Step 4: State what the MEE defends against.** **Physical** attacks — probing the memory bus, cold-boot attacks on DRAM, interposer hardware, or simply removing the DIMM. Data in DRAM is ciphertext, so reading it directly yields nothing.

**Step 5: State the division of labour explicitly.** GPC = **software** attacks, enforced on the access path inside the SoC. MEE = **physical** attacks, enforced on data crossing the SoC boundary. Neither substitutes for the other: encryption would not stop a hypervisor that is permitted to read (it would receive plaintext through the normal path), and access checks would not stop someone reading the DRAM chips directly.

**Step 6: Give the sequential operation.** On a memory access: the address is translated; the **GPC** validates that the accessor's security state may reach that granule; if permitted and the line must be fetched from DRAM, the **MEE** decrypts it on the way in; on writeback, the MEE encrypts before the data leaves the SoC. Access control is checked first, encryption applied at the boundary.

---

## Q14. In CCA, how does a realm perform I/O through an untrusted host? Give the protocol.

### Solution

**Step 1: State the problem.** The realm's memory is inaccessible to the Non-secure hypervisor, but the hypervisor owns the **devices**. The realm needs network and storage I/O and cannot reach hardware itself.

**Step 2: State the solution shape.** **Securely shared memory**: the realm explicitly designates a region to be shared with the Non-secure world, and all host-mediated I/O flows through that region only. Everything else stays tagged Realm and unreachable.

**Step 3: Give the protocol for sending data.**
1. The realm **encrypts and authenticates** the payload with a key the host does not hold — established earlier under attestation.
2. The realm copies the protected payload into the **shared buffer**, whose granules are tagged as accessible to Non-secure.
3. The realm signals the host (an exit or doorbell) that data is ready.
4. The host's driver performs the actual device I/O on the shared buffer.
5. Inbound data arrives in the shared buffer; the realm copies it into private memory and **verifies and decrypts** it there.

**Step 4: State what the host can and cannot do.** It can see only ciphertext, and only in the shared region. It **cannot** read realm-private memory (the GPC blocks it) and cannot undetectably alter payloads (authentication fails). It **can** delay, drop, reorder, or replay — so **availability and freshness are not guaranteed**, and anti-replay must be built into the protocol.

**Step 5: State the residual leakage.** Traffic **metadata** — sizes, timing, and frequency — is visible to the host and can be informative even when contents are not.

**Step 6: State the general principle.** The pattern is **cryptographic protection plus a minimal explicitly shared window**, so the untrusted party can supply a *service* (device access) without being granted *visibility*. Note that the shared window is an interface across a trust boundary and must be validated on the realm's side — the same discipline as any compartment interface, and the same TOCTOU caution about data that can change after checking.
