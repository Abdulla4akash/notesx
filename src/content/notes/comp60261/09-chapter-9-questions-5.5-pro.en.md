---
subject: COMP60261
chapter: 9
title: "Chapter 9 Exam Questions - 5.5 Pro"
language: "en"
---

# Chapter 9 Exam Practice Set: System Protection

**AI author:** 5.5 Pro  
**Source material:** COMP60261 Chapter 9 / System Protection notes on DMA, I/O virtualization, IOMMUs, TrustZone, hypervisors, VirtIO, confidential computing, ARM CCA, remote attestation, GPC, MEE, and secure Realm I/O.

Unless a question states otherwise, assume:

- 4 KB pages.
- LP64 C layout: `char` is 1 byte, `short` is 2 bytes, `int` is 4 bytes, `long`, `uint64_t`, and pointers are 8 bytes.
- Ordinary C structure layout: each field is aligned to its own alignment, and the final structure size is rounded up to the largest field alignment.
- DMA addresses are physical addresses unless explicitly described as IOVAs.
- `NS = 1` means Non-secure / Normal World and `NS = 0` means Secure World in TrustZone examples.
- CCA page tags are one of `Root`, `Realm`, `Secure`, or `Non-secure`.
- Code snippets are complete and compilable. Some bug-identification questions include deliberately unsafe functions; the unsafe path is not necessarily executed in `main`.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1: Why CPU-centric protection is incomplete

**Q:** Explain why a security model that protects only CPU-originated memory accesses is incomplete on a modern system.

**Answer & Explanation:**

Step 1: State the CPU-centric model. The simple teaching model treats the CPU as the component that mediates computation, input/output, and all memory access.

Step 2: State the real system model. Modern systems include many memory transaction initiators, including DMA engines, GPUs, storage controllers, NICs, modems, and other SoC subsystems.

Step 3: Explain the security gap. CPU page tables, privilege rings, and MMU checks apply to CPU-originated accesses. A DMA-capable device can initiate memory transactions without going through the CPU's MMU.

Step 4: State the consequence. A malicious, compromised, or misprogrammed device may read secrets, corrupt kernel memory, or modify another process's memory.

Step 5: State the exam conclusion. Memory protection must cover every master of memory, not just CPU cores.

---

### Question 2: DMA mechanism and risk

**Q:** Define Direct Memory Access. Describe the three-stage software flow for using DMA and explain why DMA is dangerous.

**Answer & Explanation:**

Step 1: Define DMA. Direct Memory Access lets a peripheral read or write main memory directly without the CPU copying each byte.

Step 2: Stage 1: initiation. The CPU programs a DMA controller or device with a source address, destination address, and transfer size.

Step 3: Stage 2: execution. The device or DMA controller takes control of the bus and performs the transfer directly.

Step 4: Stage 3: completion. The device interrupts the CPU when the transfer has completed.

Step 5: Explain why it is useful. DMA improves performance and frees the CPU to do other work.

Step 6: Explain why it is dangerous. DMA may bypass CPU privilege rings and paging protections. Without an IOMMU or equivalent system-level protection, the device may access arbitrary physical memory.

Step 7: State the exam conclusion. DMA is both a performance feature and a memory-isolation threat.

---

### Question 3: Evil Maid DMA attack

**Q:** Explain an Evil Maid or external DMA attack. Why can it expose disk encryption keys even without installing malware on the victim OS?

**Answer & Explanation:**

Step 1: Define the setting. The attacker has brief physical access to a machine, such as a laptop left unattended.

Step 2: Describe the device. The attacker plugs in a DMA-capable external device, historically through interfaces such as Thunderbolt or external PCIe.

Step 3: Explain the bypass. The malicious device performs DMA directly into system memory.

Step 4: Explain the target. Disk encryption keys are often present in RAM while the machine is running or unlocked.

Step 5: Explain why OS malware is unnecessary. The device reads memory through the hardware DMA path, not by executing code inside the victim OS.

Step 6: State the mitigation direction. An IOMMU or equivalent DMA protection must restrict the device to explicitly authorised memory.

---

### Question 4: I/O virtualization, IOVA, and scatter-gather

**Q:** Why is I/O virtualization needed? Define IOVA and hardware scatter-gather.

**Answer & Explanation:**

Step 1: State the security need. Devices must be prevented from using DMA to reach arbitrary physical memory.

Step 2: State the memory-management need. Device buffers may be physically fragmented, but many devices expect simple contiguous address ranges.

Step 3: Define IOVA. An I/O Virtual Address is the address a device uses for DMA after the OS has set up an IOMMU mapping.

Step 4: Explain IOVA translation. The IOMMU translates device-visible IOVAs to actual physical addresses.

Step 5: Define scatter-gather. Hardware scatter-gather lets a device treat several non-contiguous physical buffers as one logical transfer.

Step 6: State the exam conclusion. I/O virtualization gives devices a controlled virtual view of memory, improving both isolation and allocation flexibility.

---

### Question 5: IOMMU functions and IOTLB

**Q:** Define an IOMMU. What are its two primary functions, and what is the role of the IOTLB?

**Answer & Explanation:**

Step 1: Define IOMMU. An Input/Output Memory Management Unit sits between DMA-capable peripherals and main memory.

Step 2: Function 1: address translation. It maps IOVAs generated by devices to physical addresses.

Step 3: Function 2: memory protection. It enforces OS-defined access-control rules so devices can access only authorised memory.

Step 4: Define IOTLB. The I/O Translation Lookaside Buffer caches recent IOVA-to-physical-address translations.

Step 5: Explain hit/miss behaviour. On an IOTLB hit, translation is fast. On a miss, the IOMMU walks its page tables. If no valid mapping exists, the access faults.

Step 6: State the exam conclusion. The IOMMU is the device-side analogue of the CPU MMU, with translation and protection applied to DMA.

---

### Question 6: DMA map-use-unmap protocol

**Q:** Explain the DMA Mapping Framework protocol: map, use, unmap. Why is forgetting to unmap dangerous?

**Answer & Explanation:**

Step 1: Map. Before DMA, the driver asks the OS to map a memory buffer for the device. The OS creates IOMMU page-table entries and returns an IOVA.

Step 2: Use. The driver programs the device with the IOVA. The device performs DMA through the IOMMU.

Step 3: Unmap. After the transfer, the driver tells the OS to revoke the mapping and invalidate relevant IOTLB state.

Step 4: Explain the lifetime issue. The mapping grants the device authority to access memory. If the mapping remains after the transfer, the device may continue accessing memory it no longer needs.

Step 5: State the vulnerability. If the buffer is freed or reused for sensitive data while the device mapping remains live, stale DMA access can leak or corrupt that new data.

Step 6: State the exam conclusion. IOMMU security depends on correct mapping lifetimes, not only on the existence of the hardware.

---

### Question 7: IOMMU threats mitigated and vulnerabilities introduced

**Q:** Name three threats mitigated by IOMMUs and three ways IOMMU support can itself introduce vulnerabilities.

**Answer & Explanation:**

Step 1: Threat 1. IOMMUs stop malicious peripherals from reading arbitrary kernel or process memory.

Step 2: Threat 2. They stop devices from writing arbitrary memory and corrupting the OS.

Step 3: Threat 3. They enable safer passthrough of physical devices to guest VMs by confining device DMA to the assigned guest.

Step 4: Vulnerability 1. Driver bugs can leave mappings live too long, creating stale DMA authority.

Step 5: Vulnerability 2. IOMMU page-table or driver bugs can create time-of-check/time-of-use flaws, such as modifying entries after validation.

Step 6: Vulnerability 3. SoC-specific engines or incorrectly isolated DMA paths can bypass expected IOMMU/SMMU protections.

Step 7: State the exam conclusion. IOMMUs reduce DMA risk but add complex kernel and hardware state that must itself be correct.

---

### Question 8: Address bit restriction

**Q:** Explain address bit restriction as an alternative or complementary mechanism to an IOMMU. What are its strengths and weaknesses?

**Answer & Explanation:**

Step 1: Define the mechanism. Address bit restriction physically wires a peripheral to only a subset of the system address bus.

Step 2: Explain the security property. The device is physically unable to generate addresses outside the wired range.

Step 3: State strengths. It has zero software overhead, zero translation cost, and is hard to bypass because it is fixed in hardware.

Step 4: State weaknesses. It is static, coarse-grained, and inflexible. It cannot express per-process, per-VM, or changing mappings.

Step 5: State what it does not prevent. It does not stop malicious access within the allowed range.

Step 6: State the typical use. It fits simple, cost-sensitive SoCs with fixed peripheral memory windows.

---

### Question 9: TrustZone worlds and the NS-bit

**Q:** Explain ARM TrustZone's two worlds, the NS-bit, and why the NS-bit is described as a "+1 width" signal on the bus.

**Answer & Explanation:**

Step 1: Define the worlds. TrustZone partitions the SoC into a Normal World and a Secure World.

Step 2: Name the environments. The Normal World is also called the Rich Execution Environment, or REE. The Secure World is also called the Trusted Execution Environment, or TEE.

Step 3: State the access asymmetry. Normal World software cannot directly access Secure World resources. Secure World software can access Secure resources and, when configured, Non-secure resources.

Step 4: Define the NS-bit. The Non-secure bit labels each transaction as Secure or Non-secure.

Step 5: Explain "+1 width". On a 32-bit address bus, the NS-bit conceptually acts like an extra address/security-state bit. The same address value can refer to Secure or Non-secure physical address space depending on the NS-bit.

Step 6: State the exam conclusion. TrustZone is system-wide because the security label travels with bus transactions, including device and DMA transactions.

---

### Question 10: Secure Monitor and SMC

**Q:** Describe how a Normal World to Secure World transition occurs in TrustZone. What is the role of the Secure Monitor?

**Answer & Explanation:**

Step 1: Normal World code cannot directly jump into Secure World code.

Step 2: It executes an SMC instruction, a Secure Monitor Call.

Step 3: The processor takes an exception into EL3.

Step 4: The Secure Monitor, running at EL3, saves the current world's state.

Step 5: The Secure Monitor changes the security context, including the relevant `SCR_EL3.NS` state.

Step 6: It restores or sets up Secure World state and transfers control to the trusted OS or trusted application.

Step 7: State the exam conclusion. The Secure Monitor is the gatekeeper for world switching, so its smallness and correctness are central to TrustZone security.

---

### Question 11: TrustZone examples and implementation failure

**Q:** Explain the encrypted-filesystem and biometric-authentication examples from TrustZone, then explain why the TrustZone backdoor case study matters.

**Answer & Explanation:**

Step 1: Encrypted filesystem. The master key and filesystem key handling occur in Secure World. The Normal World can request operations, but the plaintext key never appears in Normal World memory or registers.

Step 2: Biometric authentication. The fingerprint sensor and raw biometric data are assigned to Secure World. Normal World can initiate a scan, but it receives only a result such as success or failure.

Step 3: State the benefit. Even if Android or Linux in Normal World is compromised, the hardware boundary keeps key material and raw biometric data out of Normal World reach.

Step 4: Explain the backdoor case study. The notes describe a Qualcomm QSEE TrustZone kernel vulnerability where Normal World input could trick Secure World software into using its own privileges to read protected memory.

Step 5: State the lesson. TrustZone architecture can be strong while a specific Secure World implementation is vulnerable.

Step 6: State the exam conclusion. Hardware isolation depends on correct trusted software at the boundary.

---

### Question 12: Law of leaky abstractions and isolation

**Q:** Define the Law of Leaky Abstractions and explain how it motivates isolation in this lecture.

**Answer & Explanation:**

Step 1: Define the law. All non-trivial abstractions leak details of their underlying implementation to some degree.

Step 2: Apply it to systems. Simple models hide complexity such as DMA, bus masters, hidden Secure World state, hypervisor device models, and shared virtqueues.

Step 3: Explain why leaks are dangerous. Security arguments are often made at the abstraction level, while attacks exploit the implementation details beneath the abstraction.

Step 4: Explain isolation. If abstractions leak, strong boundaries are needed to limit damage when one component behaves unexpectedly or maliciously.

Step 5: State the exam conclusion. Isolation is a response to abstraction leakage: assume components and interfaces can fail, then contain the blast radius.

---

### Question 13: Hypervisor types and privilege model

**Q:** In Chapter 9's framing, distinguish Type 1 and Type 2 hypervisors. Explain Ring -1, host/root mode, guest/non-root mode, and VM Exit.

**Answer & Explanation:**

Step 1: Define Type 1. A Type 1 hypervisor runs directly on physical hardware as the most privileged software layer. Chapter 9 describes KVM as Type 1 because the Linux kernel is transformed into a hypervisor using hardware virtualization support.

Step 2: Define Type 2. A Type 2 hypervisor runs as a user-space application on top of a conventional host OS. The notes use VirtualBox as the example.

Step 3: Explain Ring -1. Ring -1 is informal terminology for a hypervisor privilege level beneath the guest OS's Ring 0.

Step 4: Define host/root mode. This is the mode where the hypervisor runs and has control over virtualization state.

Step 5: Define guest/non-root mode. This is the mode where guest operating systems run while still being constrained by the hypervisor.

Step 6: Define VM Exit. A VM Exit is a hardware trap from guest mode into the hypervisor when a guest operation requires mediation.

Step 7: State the exam conclusion. Hardware virtualization adds a privilege layer below guest kernels so the hypervisor can control guests without rewriting them.

---

### Question 14: VMCS, VMCB, and two-stage MMU

**Q:** What are VMCS/VMCB structures, and why is two-stage translation important for virtualization isolation?

**Answer & Explanation:**

Step 1: Define VMCS/VMCB. VMCS is Intel's Virtual Machine Control Structure; VMCB is AMD's equivalent. They store guest state, host state, and control information for a virtual CPU.

Step 2: Explain VM switching. On transitions, hardware saves and loads VM state using these structures.

Step 3: Define two-stage translation. The guest translates Guest Virtual Address to Guest Physical Address, also called Intermediate Physical Address in ARM terminology. The hypervisor maps Guest Physical Address to Host Physical Address.

Step 4: Write the chain.

`GVA -> GPA/IPA -> HPA`

Step 5: Explain security. The guest controls its own first-stage mappings, but the hypervisor controls the second-stage mappings that confine guest memory to assigned host frames.

Step 6: Explain performance. Hardware performs the composed translation without a VM Exit on every guest page-table operation.

---

### Question 15: ASID, VPID, and IOMMU domain IDs

**Q:** Explain why ASIDs/VPIDs and IOMMU domain IDs matter for both performance and security.

**Answer & Explanation:**

Step 1: Define ASID/VPID. Address Space IDs and Virtual Processor IDs tag cached translations in the TLB.

Step 2: Explain the performance benefit. Tagged translations from different processes or VMs can coexist in the TLB, reducing flushes on context switches or VM switches.

Step 3: Explain the security requirement. Tags must be correct so one VM or process does not accidentally use another's cached translation.

Step 4: Define IOMMU domain IDs. Each device assigned to a VM can be placed in an I/O protection domain.

Step 5: Explain the domain's role. The IOMMU uses the device's domain to choose which IOVA-to-PA mappings apply to its DMA requests.

Step 6: State the exam conclusion. Translation identifiers are performance optimisations only if they remain strict isolation labels.

---

### Question 16: VM escape and formal verification

**Q:** Define VM escape. Why are formal methods attractive for hypervisors, and what is their limitation?

**Answer & Explanation:**

Step 1: Define VM escape. A VM escape occurs when code inside a guest VM breaks out and compromises the host, hypervisor, or other guests.

Step 2: Explain why it is severe. The hypervisor is the isolation boundary in multi-tenant systems. Compromising it can compromise all VMs on the host.

Step 3: Name common surfaces. Device emulation, VirtIO backends, hypercalls, instruction emulation, and memory-management code are important attack surfaces.

Step 4: Explain formal verification. A formally verified hypervisor has key properties mathematically proven against a specification.

Step 5: Give the example. The notes name seL4 as a gold-standard formally verified microkernel that can be used as a hypervisor.

Step 6: State the limitation. A proof covers the specification and verified code. Bugs in device models, drivers, or omitted properties may remain outside the proof.

---

### Question 17: Guest I/O device models and VirtIO

**Q:** Compare device passthrough, software-emulated devices, and paravirtualized devices. Why is VirtIO an attack surface?

**Answer & Explanation:**

Step 1: Device passthrough gives a guest direct control of a physical device. It has near-native performance but requires IOMMU isolation and reduces hypervisor interposition.

Step 2: Software emulation presents a fake hardware device. It maximises compatibility because the guest can use ordinary drivers, but every register-level interaction may involve costly host-side emulation.

Step 3: Paravirtualized devices expose a virtualization-aware device interface. They require guest support but are faster because they avoid pretending to be a full physical device.

Step 4: Define VirtIO. VirtIO is a standard paravirtualization framework with guest front-end drivers, shared virtqueues, and host backends.

Step 5: Explain the attack surface. The guest controls descriptors, indexes, lengths, and buffer addresses in shared queues. The host backend must parse these hostile inputs.

Step 6: State the exam conclusion. VirtIO improves performance and standardisation but creates guest-controlled interfaces into the host.

---

### Question 18: Confidential computing and data in use

**Q:** Define the three states of data and explain why data in use is the hardest case. What does confidential computing add beyond ordinary virtualization?

**Answer & Explanation:**

Step 1: Data at rest is stored data, commonly protected by disk or storage encryption.

Step 2: Data in transit is data moving across a network, commonly protected by TLS.

Step 3: Data in use is data actively being processed by CPU cores, registers, caches, and memory.

Step 4: Explain why in use is hard. The processor must operate on plaintext values at some point. Traditional encryption does not protect data while the host OS or hypervisor can read the memory.

Step 5: Define confidential computing. It protects data in use from privileged infrastructure such as a host OS, hypervisor, or cloud administrator.

Step 6: Contrast with ordinary virtualization. Ordinary virtualization mainly protects the host from guests and guests from each other. Confidential computing adds the reverse goal: protect guests from the host.

---

### Question 19: SEV, SGX, TDX, and ARM CCA

**Q:** Compare AMD SEV/SEV-ES/SEV-SNP, Intel SGX, Intel TDX, and ARM CCA at the level described in the notes.

**Answer & Explanation:**

Step 1: AMD SEV encrypts VM memory so the hypervisor cannot read plaintext guest memory. SEV-ES adds protection for CPU register state. SEV-SNP adds integrity protection against memory tampering.

Step 2: Intel SGX creates enclaves: small isolated private memory regions inside an application.

Step 3: Intel TDX protects entire VMs called Trust Domains from the host/hypervisor.

Step 4: ARM CCA lets a hypervisor create confidential guest VMs called Realms.

Step 5: Identify the common goal. All protect sensitive computation from privileged host infrastructure.

Step 6: State the key difference. They differ mainly in granularity and architecture: enclave-level, VM-level, or Realm-level protection.

---

### Question 20: ARM CCA states, RMM, and GPC

**Q:** Explain ARM CCA's four security states and the roles of Realms, RMM, and GPC.

**Answer & Explanation:**

Step 1: TrustZone had two states: Secure and Non-secure. CCA extends the model to four states.

Step 2: Root state is the most privileged state and runs Secure Monitor code that routes transitions.

Step 3: Secure state remains for the traditional TrustZone TEE.

Step 4: Non-secure state is used by the ordinary host OS and hypervisor.

Step 5: Realm state is used for confidential guest VMs called Realms.

Step 6: Define RMM. The Realm Management Monitor is the trusted component that can create, manage, and destroy Realms.

Step 7: Define GPC. The Granularity Protection Check validates transactions against hardware page-state tags and blocks illegal accesses such as Non-secure to Realm memory.

Step 8: State the exam conclusion. CCA separates management from access: the untrusted hypervisor may manage resources, but hardware prevents it from reading Realm secrets.

---

### Question 21: Remote attestation

**Q:** Explain remote attestation in ARM CCA using the measurement-sign-verify flow.

**Answer & Explanation:**

Step 1: Before a Realm starts, the RMM measures its initial image.

Step 2: The measurement is a hash of components such as the bootloader, kernel, and initial image.

Step 3: The RMM or hardware root uses a device-unique Platform Key to sign the measurement, producing an attestation token.

Step 4: The token is sent to the remote data owner or verifier.

Step 5: The verifier checks the signature and compares the measurement with the expected image.

Step 6: Only after verification should the remote party provision secrets.

Step 7: State the exam conclusion. Attestation does not just say "something is running"; it proves genuine hardware and a measured, untampered initial Realm state.

---

### Question 22: GPC versus MEE and Realm I/O

**Q:** Distinguish the Granularity Protection Check from the Memory Encryption Engine. How does CCA allow Realm I/O through an untrusted host?

**Answer & Explanation:**

Step 1: GPC decides who may access a physical page. It enforces isolation and integrity by checking the originator state against the target page's hardware tag.

Step 2: MEE protects memory contents in external DRAM. It encrypts data written to memory and decrypts data read back, providing confidentiality against physical snooping.

Step 3: State the ordering. A transaction first passes the GPC access check. If allowed, the MEE performs encryption or decryption at the memory controller boundary.

Step 4: Explain Realm I/O. A Realm asks the RMM to temporarily share a page with the Non-secure host for I/O.

Step 5: Explain one-world-at-a-time access. The RMM updates GPC state so the page moves from Realm to Non-secure shared state; the Realm loses access while the host uses it.

Step 6: Reclaim. After the host finishes, the RMM transitions the page back to Realm state and the host loses access.

Step 7: State the exam conclusion. CCA uses explicit, temporary shared pages so an untrusted host can provide I/O without uncontrolled access to Realm-private memory.

---

## Part 2: Memory & Storage Size Calculations

### Question 23: Address bit restriction capacity

**Q:** A system has a 32-bit address bus, but a peripheral is physically connected only to the lower 28 address lines. How much memory can the peripheral address? What is the highest address it can generate?

**Answer & Explanation:**

Step 1: Count connected address lines.

`28 address lines -> 2^28 byte addresses`

Step 2: Compute bytes.

`2^28 = 268,435,456 bytes`

Step 3: Convert to MiB.

`268,435,456 / 1,048,576 = 256 MiB`

Step 4: Compute highest address.

The range is `0x00000000` through `0x0fffffff`.

Step 5: State the result. The peripheral can address **256 MiB**, with highest address **0x0fffffff**.

---

### Question 24: DMA CPU-copy savings

**Q:** A 64 MiB device transfer would cost the CPU 2 cycles per byte if copied byte-by-byte. With DMA, the CPU spends 5,000 cycles programming the transfer and later handling completion. How many CPU cycles are saved?

**Answer & Explanation:**

Step 1: Convert transfer size.

`64 MiB = 64 * 1,048,576 = 67,108,864 bytes`

Step 2: Compute CPU-copy cost.

`67,108,864 * 2 = 134,217,728 cycles`

Step 3: Compute DMA CPU cost.

`5,000 cycles`

Step 4: Compute savings.

`134,217,728 - 5,000 = 134,212,728 cycles`

Step 5: State the result. DMA saves **134,212,728 CPU cycles** in this simplified model.

Step 6: State the security caveat. The performance win is exactly why DMA exists, but the device must be restricted by an IOMMU or equivalent.

---

### Question 25: IOVA page count for a fragmented buffer

**Q:** A driver maps a 48 KiB buffer for DMA using 4 KB pages. The physical pages are fragmented, but the IOMMU presents one contiguous IOVA range starting at `0x800000`. How many IOMMU page mappings are needed, and what is the IOVA of the byte at offset `0x2345` into the buffer?

**Answer & Explanation:**

Step 1: Compute page count.

`48 KiB / 4 KiB = 12 pages`

Step 2: Compute the IOVA for the byte.

`0x800000 + 0x2345 = 0x802345`

Step 3: State the result. The IOMMU needs **12 page mappings**, and the byte at offset `0x2345` has IOVA **0x802345**.

Step 4: State the concept. The device sees contiguous IOVAs even if the physical frames are scattered.

---

### Question 26: IOTLB effective latency

**Q:** An IOTLB lookup costs 5 ns. On an IOTLB hit, the DMA access then costs 80 ns. On a miss, an IOMMU page-table walk adds 400 ns before the same 80 ns memory access. If the IOTLB hit rate is 95%, what is the average access latency?

**Answer & Explanation:**

Step 1: Compute hit latency.

`hit = 5 + 80 = 85 ns`

Step 2: Compute miss latency.

`miss = 5 + 400 + 80 = 485 ns`

Step 3: Apply hit rate.

`average = 0.95 * 85 + 0.05 * 485`

`average = 80.75 + 24.25 = 105 ns`

Step 4: State the result. The average latency is **105 ns**.

---

### Question 27: Scatter-gather descriptor layout

**Q:** Under the LP64 assumptions, compute the offsets and total size of `struct SgEntry`. Then compute the address of `ring[17].flags` if `ring` begins at `0x100000`.

```c
#include <stdint.h>
#include <stdio.h>

struct SgEntry {
    uint64_t iova;
    uint64_t pa;
    uint32_t len;
    uint16_t flags;
    uint16_t domain;
};

int main(void) {
    struct SgEntry ring[32];
    (void)ring;
    printf("scatter-gather teaching example.\n");
    return 0;
}
```

**Answer & Explanation:**

Step 1: Place `iova`. It is 8 bytes at offset 0.

Step 2: Place `pa`. It is 8 bytes at offset 8.

Step 3: Place `len`. It is 4 bytes at offset 16.

Step 4: Place `flags`. It is 2 bytes at offset 20.

Step 5: Place `domain`. It is 2 bytes at offset 22.

Step 6: Compute size. The structure ends at offset 24, already aligned to 8, so `sizeof(struct SgEntry) = 24`.

Step 7: Compute `ring[17]`.

`17 * 24 = 408 decimal = 0x198`

`ring[17] base = 0x100000 + 0x198 = 0x100198`

Step 8: Add `flags` offset.

`0x100198 + 0x14 = 0x1001ac`

Step 9: State the result. `ring[17].flags` is at **0x1001ac**.

---

### Question 28: Two-stage translation arithmetic

**Q:** A guest virtual address is `0x12345`. Page size is 4 KB. The guest page table maps guest virtual page `0x12` to guest physical frame base `0xa000`. The stage-2 table maps guest physical page `0xa` to host physical frame base `0x30000`. What is the final host physical address?

**Answer & Explanation:**

Step 1: Compute the offset.

`0x12345 & 0xfff = 0x345`

Step 2: Use the guest mapping.

Guest virtual page `0x12` maps to guest physical frame base `0xa000`.

`GPA = 0xa000 + 0x345 = 0xa345`

Step 3: Use the stage-2 mapping.

Guest physical page `0xa` maps to host physical frame base `0x30000`.

`HPA = 0x30000 + 0x345 = 0x30345`

Step 4: State the result. The final host physical address is **0x30345**.

---

### Question 29: Nested page-table metadata footprint

**Q:** A VM has 8 GiB of guest physical memory mapped with 4 KB pages. A four-level stage-2 page table has 512 entries per page-table page. How many metadata pages are needed for the stage-2 tables, assuming all memory is mapped with 4 KB leaf pages?

**Answer & Explanation:**

Step 1: Convert memory to data pages.

`8 GiB = 8 * 1,073,741,824 bytes`

`8 GiB / 4 KB = 2,097,152 data pages`

Step 2: Compute leaf page-table pages.

`2,097,152 / 512 = 4,096 leaf pages`

Step 3: Compute next level.

`4,096 / 512 = 8 pages`

Step 4: Compute top levels.

The 8 pages fit under 1 higher-level page, and that fits under 1 top-level page.

Step 5: Add metadata pages.

`4,096 + 8 + 1 + 1 = 4,106 pages`

Step 6: Convert to bytes.

`4,106 * 4,096 = 16,818,176 bytes`

Step 7: State the result. The stage-2 metadata needs **4,106 pages**, or **16,818,176 bytes**, ignoring implementation-specific metadata.

---

### Question 30: VPID TLB flush savings

**Q:** Without VPID tagging, each VM switch flushes 5,000 cached translations, and rebuilding each translation costs 100 cycles. A workload performs 20 VM switches. With VPID tagging, assume each switch costs only 200 cycles for bookkeeping. How many cycles are saved?

**Answer & Explanation:**

Step 1: Compute no-VPID cost.

`20 * 5,000 * 100 = 10,000,000 cycles`

Step 2: Compute VPID cost.

`20 * 200 = 4,000 cycles`

Step 3: Compute savings.

`10,000,000 - 4,000 = 9,996,000 cycles`

Step 4: State the result. VPID tagging saves **9,996,000 cycles** in this simplified model.

Step 5: State the caveat. Real costs depend on TLB size, workload locality, ASID/VPID semantics, and microarchitecture.

---

### Question 31: VirtIO batching

**Q:** A software-emulated device causes 4 VM exits per I/O request. A VirtIO device batches 128 requests per notification. For 4,096 requests, how many exits occur with emulation, how many notifications occur with VirtIO, and what is the integer reduction factor?

**Answer & Explanation:**

Step 1: Compute emulation exits.

`4,096 * 4 = 16,384 exits`

Step 2: Compute VirtIO notifications.

`4,096 / 128 = 32 notifications`

Step 3: Compute reduction factor.

`16,384 / 32 = 512`

Step 4: State the result. Emulation causes **16,384 exits**, VirtIO uses **32 notifications**, and the simplified reduction factor is **512**.

---

### Question 32: GPC metadata storage

**Q:** ARM CCA tags every 4 KB physical page with one of four states: Root, Realm, Secure, or Non-secure. If tags are stored using the minimum number of bits per page, how much tag storage is needed for 16 GiB of physical memory?

**Answer & Explanation:**

Step 1: Determine bits per tag.

Four states require `log2(4) = 2 bits`.

Step 2: Count pages.

`16 GiB / 4 KB = 4,194,304 pages`

Step 3: Compute tag bits.

`4,194,304 * 2 = 8,388,608 bits`

Step 4: Convert to bytes.

`8,388,608 / 8 = 1,048,576 bytes`

Step 5: Convert to MiB.

`1,048,576 bytes = 1 MiB`

Step 6: State the result. Minimum GPC tag storage is **1 MiB** for 16 GiB of physical memory.

---

### Question 33: Remote attestation token size

**Q:** A simplified attestation token contains a 32-byte measurement hash and a 64-byte signature. What is the token size? If a verifier receives 10,000 such tokens, how many bytes are received?

**Answer & Explanation:**

Step 1: Compute one token.

`32 + 64 = 96 bytes`

Step 2: Compute 10,000 tokens.

`10,000 * 96 = 960,000 bytes`

Step 3: State the result. One token is **96 bytes**, and 10,000 tokens total **960,000 bytes**.

Step 4: State the concept. The token size is independent of the measured image size because the image is represented by a fixed-size hash.

---

### Question 34: Realm shared-buffer pages

**Q:** A Realm needs to send 100 network packets of 1,500 bytes each through an untrusted host using shared 4 KB pages. If the packets are packed contiguously into a shared buffer, how many pages are needed and how many unused bytes remain in the final allocated page range?

**Answer & Explanation:**

Step 1: Compute total data.

`100 * 1,500 = 150,000 bytes`

Step 2: Compute pages.

`ceil(150,000 / 4,096) = 37 pages`

Step 3: Compute allocated bytes.

`37 * 4,096 = 151,552 bytes`

Step 4: Compute unused bytes.

`151,552 - 150,000 = 1,552 bytes`

Step 5: State the result. The shared buffer needs **37 pages**, with **1,552 unused bytes** in the allocated page range.

---

### Question 35: VM control structure layout

**Q:** Under the LP64 assumptions, compute the offsets and total size of `struct VmControl`. Then compute the address of `controls[9].exit_reason` if `controls` begins at address `0x700000`.

```c
#include <stdint.h>
#include <stdio.h>

struct VmControl {
    uint64_t guest_rip;
    uint64_t host_rsp;
    uint32_t exit_reason;
    uint16_t vpid;
    uint8_t launched;
    char name[9];
};

int main(void) {
    struct VmControl controls[16];
    (void)controls;
    printf("VM control structure teaching example.\n");
    return 0;
}
```

**Answer & Explanation:**

Step 1: Place `guest_rip`. Offset = 0, size = 8.

Step 2: Place `host_rsp`. Offset = 8, size = 8.

Step 3: Place `exit_reason`. Offset = 16, size = 4.

Step 4: Place `vpid`. Offset = 20, size = 2.

Step 5: Place `launched`. Offset = 22, size = 1.

Step 6: Place `name`. Offset = 23, size = 9, ending at offset 32.

Step 7: Round size. Largest alignment is 8, and 32 is already aligned, so `sizeof(struct VmControl) = 32`.

Step 8: Compute `controls[9]`.

`9 * 32 = 288 decimal = 0x120`

`controls[9] base = 0x700000 + 0x120 = 0x700120`

Step 9: Add `exit_reason` offset.

`0x700120 + 0x10 = 0x700130`

Step 10: State the result. `controls[9].exit_reason` is at **0x700130**.

---

## Part 3: Code Tracing & Output Prediction

### Question 36: DMA map-use-unmap state trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

struct Mapping {
    int mapped;
    unsigned int iova;
};

static void map(struct Mapping *m, unsigned int iova) {
    m->mapped = 1;
    m->iova = iova;
}

static void unmap(struct Mapping *m) {
    m->mapped = 0;
}

int main(void) {
    struct Mapping m = {0, 0};

    map(&m, 0x800000);
    printf("after map: mapped=%d iova=0x%x\n", m.mapped, m.iova);
    printf("device uses iova=0x%x\n", m.iova);
    unmap(&m);
    printf("after unmap: mapped=%d\n", m.mapped);

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
after map: mapped=1 iova=0x800000
device uses iova=0x800000
after unmap: mapped=0
```

Step 1: `map` sets `mapped` to 1 and stores the IOVA.

Step 2: The device uses the mapped IOVA.

Step 3: `unmap` clears the mapping.

Step 4: This models the required DMA mapping lifetime protocol: map, use, unmap.

---

### Question 37: IOMMU translation trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

struct Entry {
    unsigned int iova_page;
    unsigned int pa_frame;
    int valid;
};

static int translate(struct Entry e, unsigned int iova, unsigned int *pa) {
    unsigned int page = iova >> 12;
    unsigned int offset = iova & 0xfff;

    if (!e.valid || page != e.iova_page) {
        return 0;
    }

    *pa = e.pa_frame + offset;
    return 1;
}

int main(void) {
    struct Entry e = {0x800, 0x300000, 1};
    unsigned int pa = 0;

    printf("valid=%d\n", translate(e, 0x800234, &pa));
    printf("pa=0x%x\n", pa);
    printf("invalid=%d\n", translate(e, 0x801000, &pa));
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
valid=1
pa=0x300234
invalid=0
```

Step 1: `0x800234 >> 12 = 0x800`, matching the entry's IOVA page.

Step 2: Offset is `0x234`.

Step 3: Physical address is `0x300000 + 0x234 = 0x300234`.

Step 4: `0x801000` has page `0x801`, which does not match, so translation fails.

---

### Question 38: IOTLB hit/miss trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

int main(void) {
    int accesses = 1000;
    int hits = 930;
    int misses = accesses - hits;
    int hit_ns = 85;
    int miss_ns = 485;
    int total_ns = hits * hit_ns + misses * miss_ns;

    printf("misses=%d\n", misses);
    printf("total_ns=%d\n", total_ns);
    printf("average_ns=%d\n", total_ns / accesses);
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
misses=70
total_ns=113000
average_ns=113
```

Step 1: Misses are `1000 - 930 = 70`.

Step 2: Hit time total is `930 * 85 = 79,050 ns`.

Step 3: Miss time total is `70 * 485 = 33,950 ns`.

Step 4: Total is `113,000 ns`.

Step 5: Integer average is `113,000 / 1,000 = 113 ns`.

---

### Question 39: TrustZone NS-bit trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

static const char *world(int ns_bit) {
    return ns_bit ? "Normal World" : "Secure World";
}

static int can_access_secure_memory(int ns_bit) {
    return ns_bit == 0;
}

int main(void) {
    int normal_ns = 1;
    int secure_ns = 0;

    printf("normal=%s access_secure=%d\n",
           world(normal_ns), can_access_secure_memory(normal_ns));
    printf("secure=%s access_secure=%d\n",
           world(secure_ns), can_access_secure_memory(secure_ns));
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
normal=Normal World access_secure=0
secure=Secure World access_secure=1
```

Step 1: `NS=1` maps to Normal World.

Step 2: Normal World cannot access Secure memory in this model, so access is 0.

Step 3: `NS=0` maps to Secure World.

Step 4: Secure World can access Secure memory, so access is 1.

---

### Question 40: SMC transition trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

int main(void) {
    const char *state = "NS.EL1";

    printf("start=%s\n", state);
    printf("execute SMC\n");
    state = "EL3 Secure Monitor";
    printf("trap=%s\n", state);
    state = "S.EL1 Trusted OS";
    printf("resume=%s\n", state);

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
start=NS.EL1
execute SMC
trap=EL3 Secure Monitor
resume=S.EL1 Trusted OS
```

Step 1: The program starts in Non-secure EL1.

Step 2: The SMC instruction conceptually traps into EL3.

Step 3: The Secure Monitor mediates the transition.

Step 4: Execution resumes in Secure EL1 trusted software.

---

### Question 41: Two-stage translation trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

int main(void) {
    unsigned int gva = 0x12345;
    unsigned int offset = gva & 0xfff;
    unsigned int gpa_frame = 0xa000;
    unsigned int hpa_frame = 0x30000;
    unsigned int gpa = gpa_frame + offset;
    unsigned int hpa = hpa_frame + offset;

    printf("offset=0x%x\n", offset);
    printf("gpa=0x%x\n", gpa);
    printf("hpa=0x%x\n", hpa);
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
offset=0x345
gpa=0xa345
hpa=0x30345
```

Step 1: Page offset is the low 12 bits: `0x345`.

Step 2: Guest physical address is `0xa000 + 0x345 = 0xa345`.

Step 3: Host physical address is `0x30000 + 0x345 = 0x30345`.

Step 4: This models `GVA -> GPA/IPA -> HPA`.

---

### Question 42: VM exit classifier

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

enum Event {
    IO_PORT,
    CPUID,
    ADD_REG,
    HLT
};

static int causes_vmexit(enum Event e) {
    return e == IO_PORT || e == CPUID || e == HLT;
}

int main(void) {
    enum Event events[] = {IO_PORT, ADD_REG, HLT, CPUID};

    for (int i = 0; i < 4; i++) {
        printf("event %d exit=%d\n", i, causes_vmexit(events[i]));
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
event 0 exit=1
event 1 exit=0
event 2 exit=1
event 3 exit=1
```

Step 1: `IO_PORT` causes a VM exit in this model.

Step 2: `ADD_REG` is ordinary computation and does not exit.

Step 3: `HLT` exits.

Step 4: `CPUID` exits.

Step 5: VM exits are hypervisor interposition points and are expensive.

---

### Question 43: VirtIO ring index trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

int main(void) {
    unsigned int ring_size = 8;
    unsigned int avail_idx = 6;

    for (unsigned int n = 0; n < 5; n++) {
        unsigned int slot = (avail_idx + n) % ring_size;
        printf("request %u uses slot %u\n", n, slot);
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
request 0 uses slot 6
request 1 uses slot 7
request 2 uses slot 0
request 3 uses slot 1
request 4 uses slot 2
```

Step 1: The ring has 8 slots.

Step 2: Starting at index 6, the next slots are 6, 7, then wrap to 0, 1, and 2.

Step 3: This models virtqueue circular-buffer behaviour.

---

### Question 44: Confidential computing threat classifier

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

static const char *protected_by_confidential_computing(int host_privileged,
                                                       int guest_internal_bug) {
    if (guest_internal_bug) {
        return "not protected";
    }
    if (host_privileged) {
        return "protected goal";
    }
    return "ordinary isolation";
}

int main(void) {
    printf("malicious host: %s\n", protected_by_confidential_computing(1, 0));
    printf("bug inside realm: %s\n", protected_by_confidential_computing(0, 1));
    printf("other tenant: %s\n", protected_by_confidential_computing(0, 0));
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
malicious host: protected goal
bug inside realm: not protected
other tenant: ordinary isolation
```

Step 1: Confidential computing specifically targets privileged host attackers.

Step 2: Bugs inside the protected guest/Realm are not automatically solved.

Step 3: Other-tenant isolation is already a goal of ordinary virtualization, though confidential computing can add extra protection.

---

### Question 45: GPC access check trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

enum State {
    ROOT,
    REALM,
    SECURE,
    NONSECURE
};

static int allowed(enum State origin, enum State page) {
    if (origin == ROOT) {
        return 1;
    }
    return origin == page;
}

int main(void) {
    printf("nonsecure->realm=%d\n", allowed(NONSECURE, REALM));
    printf("realm->realm=%d\n", allowed(REALM, REALM));
    printf("root->secure=%d\n", allowed(ROOT, SECURE));
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
nonsecure->realm=0
realm->realm=1
root->secure=1
```

Step 1: Non-secure origin cannot access Realm-tagged memory.

Step 2: Realm origin can access Realm-tagged memory.

Step 3: Root is treated as privileged in this simplified model.

Step 4: This models the GPC's page-state access check.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 46: DMA range-check integer overflow

**Q:** The following complete C program contains an unsafe DMA range check. Identify the bug in `dma_ok_bad` and explain why `dma_ok_safe` is correct.

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

static bool dma_ok_bad(uint64_t addr, uint64_t len, uint64_t limit) {
    return addr + len <= limit;
}

static bool dma_ok_safe(uint64_t addr, uint64_t len, uint64_t limit) {
    if (addr > limit) {
        return false;
    }
    if (len > limit - addr) {
        return false;
    }
    return true;
}

int main(void) {
    uint64_t limit = 0x1000;
    uint64_t addr = UINT64_MAX - 7u;
    uint64_t len = 16;

    printf("bad=%d\n", dma_ok_bad(addr, len, limit));
    printf("safe=%d\n", dma_ok_safe(addr, len, limit));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `dma_ok_bad` checks `addr + len <= limit`, but `addr + len` can overflow.

Step 2: State the output.

```text
bad=1
safe=0
```

Step 3: Explain the exploit. `UINT64_MAX - 7 + 16` wraps to a small value, making an invalid range appear valid.

Step 4: Explain the secure refactor. `dma_ok_safe` checks `addr <= limit` first, then checks `len <= limit - addr`, avoiding overflow.

Step 5: State the exam conclusion. DMA buffers use attacker- or device-influenced addresses and lengths, so overflow-safe bounds checks are mandatory.

---

### Question 47: Forgetting to unmap DMA memory

**Q:** The following complete C program models a stale DMA mapping. Identify the bug in `driver_bad` and explain why `driver_safe` is correct.

```c
#include <stdio.h>
#include <stdbool.h>

struct DmaMap {
    bool live;
};

static void driver_bad(struct DmaMap *m) {
    m->live = true;
}

static void driver_safe(struct DmaMap *m) {
    m->live = true;
    m->live = false;
}

int main(void) {
    struct DmaMap bad = {false};
    struct DmaMap safe = {false};

    driver_bad(&bad);
    driver_safe(&safe);

    printf("bad live=%d\n", bad.live);
    printf("safe live=%d\n", safe.live);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `driver_bad` maps the buffer but never unmaps it.

Step 2: State the output.

```text
bad live=1
safe live=0
```

Step 3: Explain the security consequence. A live mapping keeps device authority after the transfer should have ended.

Step 4: Explain why this is dangerous. If the memory is reused for secrets, the device may still be able to read or write it.

Step 5: Explain the secure refactor. `driver_safe` models the full map-use-unmap lifetime by clearing the mapping after use.

---

### Question 48: IOMMU validation TOCTOU

**Q:** The following complete C program models a page-table entry modified after validation. Identify the bug in `use_entry_bad` and explain the secure refactor.

```c
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>

struct IoPte {
    bool valid;
    uint64_t pa;
};

static uint64_t use_entry_bad(struct IoPte *pte) {
    if (!pte->valid) {
        return 0;
    }
    pte->pa = 0xdead0000;
    return pte->pa;
}

static bool use_entry_safe(const struct IoPte *pte, uint64_t *out) {
    struct IoPte snapshot = *pte;
    if (!snapshot.valid) {
        return false;
    }
    *out = snapshot.pa;
    return true;
}

int main(void) {
    struct IoPte pte = {true, 0x300000};
    uint64_t out = 0;

    printf("bad pa=0x%llx\n", (unsigned long long)use_entry_bad(&pte));
    pte.pa = 0x300000;
    printf("safe=%d\n", use_entry_safe(&pte, &out));
    printf("safe pa=0x%llx\n", (unsigned long long)out);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `use_entry_bad` validates `pte->valid`, then uses a mutable `pte->pa` after it can change.

Step 2: State the output.

```text
bad pa=0xdead0000
safe=1
safe pa=0x300000
```

Step 3: Explain the vulnerability. A page-table entry modified after validation can redirect DMA to memory that was never authorised.

Step 4: Explain the secure refactor. `use_entry_safe` snapshots the entry and uses the validated snapshot. Real kernels also need locking, memory barriers, and IOTLB invalidation rules.

Step 5: State the exam conclusion. For IOMMU mappings, validation and use must be atomic with respect to modification.

---

### Question 49: VirtIO descriptor validation bug

**Q:** The following complete C program contains an unsafe VirtIO descriptor validator. Identify the bug in `desc_ok_bad` and explain why `desc_ok_safe` is correct.

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

struct Desc {
    uint64_t addr;
    uint32_t len;
    uint16_t next;
};

static bool desc_ok_bad(struct Desc d, uint64_t guest_mem_size) {
    return d.addr + d.len <= guest_mem_size;
}

static bool desc_ok_safe(struct Desc d, uint64_t guest_mem_size,
                         uint16_t queue_size) {
    if (d.next >= queue_size) {
        return false;
    }
    if (d.addr > guest_mem_size) {
        return false;
    }
    if ((uint64_t)d.len > guest_mem_size - d.addr) {
        return false;
    }
    return true;
}

int main(void) {
    uint64_t mem = 0x1000;
    struct Desc d = {UINT64_MAX - 7u, 16, 4};

    printf("bad=%d\n", desc_ok_bad(d, mem));
    printf("safe=%d\n", desc_ok_safe(d, mem, 8));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `desc_ok_bad` checks only an overflow-prone `addr + len` expression and ignores queue index validity.

Step 2: State the output.

```text
bad=1
safe=0
```

Step 3: Explain why this matters. VirtIO descriptors are guest-controlled inputs parsed by a host-side backend.

Step 4: Explain the secure refactor. `desc_ok_safe` checks the next descriptor index and uses subtraction-based bounds validation to avoid overflow.

Step 5: State the exam conclusion. VirtIO performance relies on shared memory, so the backend must treat every descriptor field as hostile.

---

### Question 50: TrustZone command length bug

**Q:** The following complete C program models a TrustZone Trusted Application command parser. Identify the bug in `handle_cmd_bad` and explain the secure refactor.

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

static bool handle_cmd_bad(uint16_t claimed_len, uint16_t received_len) {
    (void)received_len;
    return claimed_len <= 4096;
}

static bool handle_cmd_safe(uint16_t claimed_len, uint16_t received_len) {
    if (claimed_len > received_len) {
        return false;
    }
    if (claimed_len > 4096) {
        return false;
    }
    return true;
}

int main(void) {
    printf("bad=%d\n", handle_cmd_bad(1000, 16));
    printf("safe=%d\n", handle_cmd_safe(1000, 16));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `handle_cmd_bad` trusts the claimed command length and ignores the actual received length.

Step 2: State the output.

```text
bad=1
safe=0
```

Step 3: Explain the security consequence. Normal World input is untrusted. A Trusted Application that over-reads or over-writes based on a claimed length may expose Secure World data or corrupt Secure World state.

Step 4: Explain the secure refactor. `handle_cmd_safe` checks the claimed length against both the received buffer size and the maximum command size.

Step 5: State the exam conclusion. TrustZone security depends on Secure World code validating Normal World requests.

---

### Question 51: Secure Monitor state leak

**Q:** The following complete C program models a Secure Monitor state-save bug. Identify the bug in `switch_bad` and explain why `switch_safe` is correct.

```c
#include <stdio.h>

struct CpuState {
    unsigned int normal_r0;
    unsigned int secure_r0;
};

static void switch_bad(struct CpuState *s) {
    s->normal_r0 = s->secure_r0;
}

static void switch_safe(struct CpuState *s) {
    s->normal_r0 = 0;
}

int main(void) {
    struct CpuState s = {0x1111, 0xfeed};

    switch_bad(&s);
    printf("bad normal_r0=0x%x\n", s.normal_r0);

    s.normal_r0 = 0x1111;
    switch_safe(&s);
    printf("safe normal_r0=0x%x\n", s.normal_r0);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `switch_bad` copies Secure World register state into the Normal World register slot.

Step 2: State the output.

```text
bad normal_r0=0xfeed
safe normal_r0=0x0
```

Step 3: Explain the vulnerability. A world switch must not leak Secure World register contents to Normal World.

Step 4: Explain the secure refactor. `switch_safe` clears the Normal World register value in this simplified model. Real Secure Monitors must save, restore, and scrub state precisely.

Step 5: State the exam conclusion. The Secure Monitor is small but critical because it handles state crossing the security boundary.

---

### Question 52: GPC check missing Non-secure to Realm denial

**Q:** The following complete C program contains a broken CCA GPC access check. Identify the bug in `gpc_bad` and explain why `gpc_safe` is correct.

```c
#include <stdio.h>
#include <stdbool.h>

enum State {
    ROOT,
    REALM,
    SECURE,
    NONSECURE
};

static bool gpc_bad(enum State origin, enum State page) {
    (void)page;
    return origin != SECURE;
}

static bool gpc_safe(enum State origin, enum State page) {
    if (origin == ROOT) {
        return true;
    }
    return origin == page;
}

int main(void) {
    printf("bad ns->realm=%d\n", gpc_bad(NONSECURE, REALM));
    printf("safe ns->realm=%d\n", gpc_safe(NONSECURE, REALM));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `gpc_bad` ignores the target page tag and therefore allows Non-secure access to Realm memory.

Step 2: State the output.

```text
bad ns->realm=1
safe ns->realm=0
```

Step 3: Explain the security consequence. The host hypervisor runs in Non-secure state. If it can read Realm pages, CCA's core protection goal fails.

Step 4: Explain the secure refactor. `gpc_safe` permits Root and otherwise requires the origin state to match the page state.

Step 5: State the exam conclusion. GPC enforcement must compare both the transaction originator state and the page metadata tag.

---

### Question 53: CCA shared-page TOCTOU bug

**Q:** The following complete C program models CCA shared memory. Identify the bug in `share_bad` and explain why `share_safe` enforces the one-world-at-a-time rule.

```c
#include <stdio.h>
#include <stdbool.h>

struct SharedPage {
    bool realm_access;
    bool host_access;
};

static void share_bad(struct SharedPage *p) {
    p->host_access = true;
}

static void share_safe(struct SharedPage *p) {
    p->realm_access = false;
    p->host_access = true;
}

int main(void) {
    struct SharedPage bad = {true, false};
    struct SharedPage safe = {true, false};

    share_bad(&bad);
    share_safe(&safe);

    printf("bad realm=%d host=%d\n", bad.realm_access, bad.host_access);
    printf("safe realm=%d host=%d\n", safe.realm_access, safe.host_access);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `share_bad` grants host access without revoking Realm access.

Step 2: State the output.

```text
bad realm=1 host=1
safe realm=0 host=1
```

Step 3: Explain the TOCTOU issue. If both worlds can access the page at the same time, the host may change data after the Realm checks it or read data while the Realm is processing it.

Step 4: Explain the secure refactor. `share_safe` first removes Realm access, then grants host access, modelling the RMM/GPC state transition.

Step 5: State the exam conclusion. CCA shared I/O pages must be explicitly transitioned so only one world can access the page at a time.

---

### Question 54: Remote attestation verification bug

**Q:** The following complete C program models attestation verification. Identify the bug in `accept_bad` and explain why `accept_safe` is correct.

```c
#include <stdio.h>
#include <stdbool.h>
#include <string.h>

struct Token {
    char measurement[9];
    bool signature_ok;
};

static bool accept_bad(struct Token t) {
    return t.signature_ok;
}

static bool accept_safe(struct Token t, const char *expected_measurement) {
    if (!t.signature_ok) {
        return false;
    }
    return strcmp(t.measurement, expected_measurement) == 0;
}

int main(void) {
    struct Token wrong = {"badimage", true};

    printf("bad accept=%d\n", accept_bad(wrong));
    printf("safe accept=%d\n", accept_safe(wrong, "goodimg"));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `accept_bad` accepts any correctly signed token without checking that the measurement matches the expected Realm image.

Step 2: State the output.

```text
bad accept=1
safe accept=0
```

Step 3: Explain the security consequence. A valid signature on the wrong measurement proves only that some measured image ran on genuine hardware, not that the intended code is running.

Step 4: Explain the secure refactor. `accept_safe` requires both a valid signature and the expected measurement.

Step 5: State the exam conclusion. Attestation must verify identity and integrity, not merely token authenticity.

---

## Final Revision Checklist

- CPU-only protection is incomplete because devices and SoC subsystems can initiate memory transactions.
- DMA improves performance by bypassing CPU copying, but it also bypasses CPU MMU checks unless contained.
- External DMA attacks can read secrets directly from RAM.
- I/O virtualization gives devices controlled IOVA views of memory.
- IOMMU functions are address translation and memory protection.
- IOTLB caches IOVA-to-PA translations.
- DMA drivers must follow map-use-unmap; stale mappings are dangerous.
- IOMMU protection can introduce new software and hardware attack surfaces.
- Address bit restriction is cheap and robust but static and coarse.
- TrustZone splits the SoC into Secure World and Normal World.
- `NS=1` means Normal/Non-secure; `NS=0` means Secure.
- The NS-bit labels bus transactions and makes TrustZone system-wide.
- SMC enters EL3; the Secure Monitor mediates world switching.
- TrustZone examples protect filesystem keys and biometric data from Normal World.
- TrustZone can still fail through buggy Secure World software.
- Leaky abstractions motivate isolation boundaries.
- Chapter 9 frames KVM as Type 1 and VirtualBox as Type 2.
- Ring -1 is the informal hypervisor privilege layer beneath guest Ring 0.
- VMCS/VMCB store guest/host virtual CPU state and controls.
- Two-stage translation is `GVA -> GPA/IPA -> HPA`.
- ASID/VPID and IOMMU domain IDs are both performance and isolation labels.
- VM escape means guest compromise of host/hypervisor/other guests.
- Formal verification proves properties only against a specification.
- VirtIO consists of frontend drivers, virtqueues, and backend drivers.
- VirtIO is an attack surface because the host parses guest-controlled shared-memory descriptors.
- Confidential computing protects data in use from privileged host infrastructure.
- Ordinary virtualization protects host from guests; confidential computing also protects guests from host.
- AMD SEV protects VMs; Intel SGX protects enclaves; Intel TDX protects Trust Domains; ARM CCA protects Realms.
- ARM CCA has Root, Realm, Secure, and Non-secure states.
- RMM creates, manages, and destroys Realms.
- Remote attestation uses measurement, signing, and verification before secrets are provisioned.
- GPC decides who can access memory; MEE protects memory contents from physical snooping.
- CCA Realm I/O uses explicitly shared pages and one-world-at-a-time access transitions.
