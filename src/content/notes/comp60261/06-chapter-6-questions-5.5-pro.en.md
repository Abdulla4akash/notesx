---
subject: COMP60261
chapter: 6
title: "Chapter 6 Exam Questions - 5.5 Pro"
language: "en"
---

# Chapter 6 Exam Practice Set: Virtualisation

**AI author:** 5.5 Pro  
**Source material:** COMP60261 Week 6 / Chapter 6 notes on virtualisation, Popek and Goldberg, CPU and memory virtualisation, I/O virtualisation, containers, and unikernels.

Unless a question states otherwise, assume:

- A Linux/x86-64 context where examples mention KVM, Qemu, VT-x, EPT, VT-d, virtio, or containers.
- 4 KB pages.
- Four-level page tables with 512 entries per page-table page.
- LP64 C layout: `char` is 1 byte, `short` is 2 bytes, `int` is 4 bytes, `long`, `uint64_t`, and pointers are 8 bytes.
- Ordinary C structure alignment and padding: each field is aligned to its own alignment, and the final structure size is rounded up to the largest field alignment.
- In Popek and Goldberg questions, `B` is a base, `L` is a length/limit, and the valid virtual range is `[0, L)`.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1: The core problem virtualisation solves

**Q:** State the fundamental challenge of system virtualisation. Why is this challenge harder than simply running two ordinary programs on the same operating system?

**Answer & Explanation:**

Step 1: State the challenge. An operating system expects to run alone, with full privileges, on a physical machine. It expects total control over CPU privilege, memory mappings, interrupts, devices, and other hardware state.

Step 2: Explain what virtualisation must achieve. A hypervisor must let multiple guest operating systems believe they each own the machine while actually sharing one host.

Step 3: Contrast with ordinary processes. Ordinary programs are already designed to run below an OS. They expect the kernel to be privileged and to multiplex resources. Guest operating systems are not designed that way: they expect to be the privileged kernel.

Step 4: State the security implication. If a guest OS can directly change privileged hardware state, it may escape its VM or interfere with another VM. The hypervisor must therefore remain in control of all dangerous operations.

Step 5: State the exam conclusion. Virtualisation is hard because it must safely multiplex components that were designed to be uniquely controlled by one privileged operating system.

---

### Question 2: Bugnion's definition of virtualisation

**Q:** Explain Bugnion's definition of virtualisation: "abstraction at a widely-used interface" where the created virtual resource is "identical" to the virtualised component and "cannot be bypassed". Map each clause to a VM hypervisor goal.

**Answer & Explanation:**

Step 1: Explain "abstraction at a widely-used interface". The interface is the stable boundary between two system layers. In a system VM, this is the software/hardware interface exposed to an operating system.

Step 2: Explain "identical". The virtual hardware should appear sufficiently identical to real hardware that existing guest operating systems and applications run unmodified. This maps to **equivalence**.

Step 3: Explain "cannot be bypassed". Guests must be unable to access the underlying physical resources except through the virtualised interface. This maps to **safety**.

Step 4: Connect to performance. The definition itself does not guarantee performance, but a practical hypervisor also needs the virtual interface to run close to native speed.

Step 5: State the exam conclusion. For VMs, Bugnion's definition becomes: expose an OS-compatible hardware interface, preserve guest behaviour, and prevent guests from escaping the hypervisor's mediation.

---

### Question 3: Multiplexing, aggregation, and emulation

**Q:** Define multiplexing, aggregation, and emulation in virtualisation. Give one example of each from computer systems.

**Answer & Explanation:**

Step 1: Define multiplexing. **Multiplexing** presents one physical resource as several virtual resources.

Example: one physical CPU is time-shared among multiple virtual CPUs.

Step 2: Define aggregation. **Aggregation** presents several physical resources as one virtual resource.

Example: several disks can be combined into one logical storage volume.

Step 3: Define emulation. **Emulation** presents a resource that differs from the underlying physical resource.

Example: Qemu can expose an emulated Intel e1000 network card even if the host has a different physical NIC.

Step 4: Connect to VMs. A VM commonly uses all three: CPU and memory are multiplexed, storage may be aggregated, and devices may be emulated.

Step 5: State the exam conclusion. Virtualisation is not one mechanism; it is a design pattern using multiplexing, aggregation, and emulation at stable interfaces.

---

### Question 4: Hypervisor goals and direct execution

**Q:** A hypervisor aims for equivalence, safety, and performance. Define each goal and explain how direct execution helps achieve them together.

**Answer & Explanation:**

Step 1: Define equivalence. The VM should behave like the underlying physical machine, allowing unmodified guest OSes and applications to run correctly.

Step 2: Define safety. The hypervisor must remain in complete control of hardware resources. A guest must not escape isolation or affect another VM outside permitted interfaces.

Step 3: Define performance. Most guest instructions should run close to native speed.

Step 4: Explain direct execution. Guest code executes directly on the physical CPU, but at a privilege level or execution mode where dangerous operations trap to the hypervisor.

Step 5: Explain the fast and slow paths. Innocuous instructions run directly, preserving performance. Sensitive instructions trap and are safely emulated, preserving safety and equivalence.

Step 6: State the exam conclusion. Direct execution is the central technique that makes high performance compatible with controlled emulation of privileged hardware operations.

---

### Question 5: Type I versus Type II hypervisors

**Q:** Distinguish Type I and Type II hypervisors using the classification used in this unit. Why is KVM classified as Type II in these notes?

**Answer & Explanation:**

Step 1: State the classification criterion. The unit distinguishes Type I and Type II mainly by who performs resource allocation and scheduling.

Step 2: Define Type I. In a Type I design, the hypervisor itself directly allocates and schedules hardware resources.

Step 3: Define Type II. In a Type II design, a host operating system is substantially involved in allocation and scheduling.

Step 4: Apply this to KVM. In the unit's framing, KVM is classified as Type II because it is a Linux kernel module using the host Linux OS for scheduling and resource management, with Qemu in userspace managing VM setup and emulated devices.

Step 5: Handle the common ambiguity. Some external sources describe KVM as Type I or hybrid because it runs in the kernel and uses hardware virtualisation. For this course, the expected exam answer is the unit's classification: **KVM is Type II**.

---

### Question 6: Guest virtual, guest pseudo-physical, and host physical memory

**Q:** Explain the three memory denominations in a virtualised system: guest virtual, guest pseudo-physical, and host physical. Why is the term "pseudo-physical" important?

**Answer & Explanation:**

Step 1: Define guest virtual memory. Guest virtual addresses are the addresses used by applications and the guest kernel inside the VM.

Step 2: Define guest pseudo-physical memory. Guest pseudo-physical addresses are what the guest OS believes are physical memory addresses. They are "physical" from the guest's viewpoint but are not necessarily real host physical addresses.

Step 3: Define host physical memory. Host physical addresses identify real machine memory controlled by the host/hypervisor.

Step 4: State the translation chain:

`guest virtual -> guest pseudo-physical -> host physical`

Step 5: Explain why "pseudo-physical" matters. It captures the deception at the heart of VM memory virtualisation: the guest manages what it thinks is physical memory, while the hypervisor maps that memory onto real host resources.

---

### Question 7: Popek and Goldberg instruction classes

**Q:** Define control-sensitive, behaviour-sensitive, innocuous, and privileged instructions. Why is it wrong to treat "sensitive" and "privileged" as synonyms?

**Answer & Explanation:**

Step 1: Define control-sensitive. An instruction is **control-sensitive** if it changes system state, such as the processor mode, segment registers, page tables, or interrupt configuration.

Step 2: Define behaviour-sensitive. An instruction is **behaviour-sensitive** if its behaviour depends on system state, such as the current privilege level or address-translation state.

Step 3: Define sensitive. Sensitive instructions are the union of control-sensitive and behaviour-sensitive instructions.

Step 4: Define innocuous. Innocuous instructions are not sensitive; they neither modify system state nor behave differently because of it in a way relevant to virtualisation.

Step 5: Define privileged. A privileged instruction traps if executed outside supervisor mode.

Step 6: Explain the distinction. "Sensitive" describes semantic danger. "Privileged" describes hardware trap behaviour. They are different classifications of instructions.

Step 7: State the exam conclusion. Virtualisability depends on the relationship between these sets, not on them being the same set.

---

### Question 8: The Popek and Goldberg theorem

**Q:** State the Popek and Goldberg virtualisability theorem. What happens if a control-sensitive instruction is not privileged? What happens if a behaviour-sensitive instruction is not privileged?

**Answer & Explanation:**

Step 1: State the theorem. A VMM can be constructed for an ISA if every sensitive instruction is privileged:

`control-sensitive instructions union behaviour-sensitive instructions subset privileged instructions`

Step 2: Explain the intuition. The guest OS runs without real supervisor privilege. Therefore every instruction that could expose or alter privileged state must trap to the VMM.

Step 3: Control-sensitive failure. If a control-sensitive instruction is not privileged, the guest can modify system state without a trap. The VMM loses control of the machine. This breaks **safety**.

Step 4: Behaviour-sensitive failure. If a behaviour-sensitive instruction is not privileged, the guest may observe user-mode behaviour when it expects supervisor-mode behaviour. The VMM does not get a chance to emulate the expected result. This breaks **equivalence**.

Step 5: State the exam conclusion. Control-sensitive-but-not-privileged breaks safety; behaviour-sensitive-but-not-privileged breaks equivalence.

---

### Question 9: Why x86-32 POPF was a virtualisation problem

**Q:** Explain why x86-32 `POPF` is a classic violation of the Popek and Goldberg theorem.

**Answer & Explanation:**

Step 1: State what `POPF` does conceptually. It attempts to load flags from the stack into the processor status register.

Step 2: Explain why it is behaviour-sensitive. Its effect depends on privilege level. In supervisor mode, it can update privileged flag state. In user mode, some privileged effects do not occur.

Step 3: Explain the problem. On x86-32, `POPF` does not necessarily trap when executed without sufficient privilege. It can fail silently.

Step 4: Map to the theorem. Because `POPF` is behaviour-sensitive but not reliably privileged, it violates the condition that sensitive instructions must trap.

Step 5: State the consequence. The guest OS can observe different behaviour in a VM than it would on bare metal, so equivalence is broken unless the hypervisor uses a workaround.

Step 6: Name the workarounds. Full or heavy emulation can preserve equivalence but hurts performance. Paravirtualisation modifies the guest OS and therefore sacrifices strict equivalence.

---

### Question 10: vPSW and the two trap cases

**Q:** In the Popek and Goldberg model, what is the `vPSW`, and how does the VMM handle traps differently when `vPSW.M == s` versus `vPSW.M == u`?

**Answer & Explanation:**

Step 1: Define `PSW`. The processor status word is `(M, B, L, PC)`: mode, base, limit, and program counter.

Step 2: Define `vPSW`. The VMM stores a virtual PSW for each VM. It records the CPU state the VM believes it has, including whether the guest believes it is in supervisor mode or user mode.

Step 3: Explain resume. When resuming a VM, the real CPU runs the guest in user mode, even if `vPSW.M` says the guest believes it is supervisor. The real base becomes `addr0 + vPSW.B`, after bounds checks.

Step 4: Guest OS trap case. If `vPSW.M == s`, the guest OS caused the trap. The trapped instruction is normally a sensitive operation. The VMM checks and emulates it, updates `vPSW`, advances `vPSW.PC`, and resumes the VM.

Step 5: Guest application trap case. If `vPSW.M == u`, a guest application caused the trap. The VMM must emulate a native trap inside the VM: save the app state to the VM's virtual `MEM[0]`, load the guest kernel trap handler state from the VM's virtual `MEM[1]`, validate it, and resume in the guest's virtual kernel mode.

Step 6: State the exam conclusion. `vPSW.M` tells the VMM whether a trap should be handled by the hypervisor as a guest-kernel operation or delivered virtually to the guest OS.

---

### Question 11: VT-x, VMCS, and VM exits

**Q:** Explain how VT-x changes the privilege model used for virtualisation. What are root mode, non-root mode, VMCS, VM entry, and VM exit?

**Answer & Explanation:**

Step 1: State the x86-32 problem. Older software virtualisation had to run the guest OS at a lower ring than expected, creating ring aliasing, address-space compression, and expensive transitions.

Step 2: Define root and non-root mode. VT-x adds a root mode for the hypervisor and a non-root mode for guests. These are orthogonal to the traditional x86 rings.

Step 3: Explain the key benefit. A guest OS can run in ring 0 non-root mode, so it sees the privilege level it expects, while the hypervisor still retains control in root mode.

Step 4: Define VMCS. The Virtual Machine Control Structure stores guest state, host state, and control fields for a virtual CPU.

Step 5: Define VM entry. VM entry transfers execution from the hypervisor into a guest using the state described by the VMCS.

Step 6: Define VM exit. VM exit transfers execution from the guest back to the hypervisor when configured events or sensitive operations occur.

Step 7: State the performance point. VM exits and entries are costly, often thousands of cycles, so high-performance virtualisation tries to avoid unnecessary exits.

---

### Question 12: Shadow paging versus EPT

**Q:** Why did shadow paging cause many VM exits, and how does EPT solve the problem?

**Answer & Explanation:**

Step 1: Explain shadow paging. Without nested page-table hardware, the hypervisor must maintain shadow page tables that combine guest virtual-to-pseudo-physical translations with pseudo-physical-to-host-physical translations.

Step 2: Explain why exits occur. Guest page-table updates are sensitive because they affect address translation. Under shadow paging, the hypervisor must trap and inspect many page-table operations.

Step 3: State the measured problem from the notes. Shadow paging caused over 90% of VM exits in the discussed context, making early hardware-assisted CPU virtualisation less attractive without hardware memory virtualisation.

Step 4: Define EPT. Extended Page Tables add hardware support for the second translation: guest pseudo-physical to host physical.

Step 5: Explain the benefit. The guest can manage its own page tables while hardware performs a two-dimensional walk through guest page tables and EPT. This removes most page-table update exits.

Step 6: State the trade-off. A worst-case two-dimensional page walk can require many more memory accesses than a native walk, but modern TLB hit rates are high, so the overhead is usually manageable.

---

### Question 13: I/O virtualisation spectrum

**Q:** Compare full emulation, virtio, direct assignment with IOMMU, and SR-IOV. For each, state the main performance/security trade-off.

**Answer & Explanation:**

Step 1: Full emulation. The hypervisor emulates a real device, such as e1000. Compatibility is excellent because the guest can use existing drivers, but performance is poor because MMIO/PIO operations and interrupts often require VM exits.

Step 2: virtio. The guest uses paravirtualised drivers designed for virtual I/O. Performance is much better because rings, batching, and notification suppression reduce exits. The cost is that the guest needs virtio drivers, so strict equivalence is weakened.

Step 3: Direct assignment with IOMMU. A physical device is assigned to a guest. Performance is near-native and the guest uses the real driver. The cost is reduced hypervisor interposition, difficult live migration, and often dedicating a device to one VM.

Step 4: SR-IOV. A device exposes one or more Physical Functions controlled by the host and many Virtual Functions assignable to guests. Performance remains near-native and the device becomes shareable. The cost is hardware dependency and less software interposition.

Step 5: State the exam conclusion. The spectrum moves from compatibility and control toward performance and lower interposition.

---

### Question 14: IOMMU, DMA remapping, and interrupt remapping

**Q:** A VM is given direct access to a NIC. Why is an IOMMU required, and why are both DMA remapping and interrupt remapping relevant?

**Answer & Explanation:**

Step 1: State the threat. A directly assigned device can perform DMA and raise interrupts. If uncontrolled, a malicious or buggy device could write outside the VM's memory or interrupt the wrong target.

Step 2: Define DMA remapping. DMA remapping restricts which host physical memory ranges the assigned device can read or write.

Step 3: Define interrupt remapping. Interrupt remapping controls where device-generated interrupts are delivered.

Step 4: Explain why both are needed. DMA remapping protects memory integrity and confidentiality. Interrupt remapping prevents interrupt injection into the host or another VM.

Step 5: State the exam conclusion. A safe passthrough design needs IOMMU support for both memory writes/reads and interrupt delivery, not only DMA address translation.

---

### Question 15: Containers and the interface-security argument

**Q:** The notes say containers have weaker isolation than VMs because of interface complexity, not because page tables do not work. Explain the full argument.

**Answer & Explanation:**

Step 1: Identify the trusted layer. For containers, the trusted virtualisation layer is the host OS kernel. For VMs, it is the hypervisor.

Step 2: Identify the direct route. Hardware page tables prevent a container or VM from directly reading memory outside its allocation.

Step 3: Identify the remaining attack route. The untrusted instance can still invoke the trusted layer. A container invokes the kernel through syscalls and related interfaces. A VM invokes the hypervisor through a much narrower set of traps and virtual-device interfaces.

Step 4: Compare interface complexity. The Linux syscall interface has hundreds of syscalls, and interfaces such as `ioctl` expose many sub-functions. Hypervisor traps are generally much smaller in number.

Step 5: Draw the security conclusion. A larger trusted interface is harder to audit and more likely to contain exploitable bugs. Therefore containers are considered weaker isolation boundaries than VMs, even though hardware memory protection still works.

Step 6: State the industry response. Production systems often run containers inside VMs or micro VMs to regain a stronger isolation boundary, but this reduces some lightweightness advantages.

---

### Question 16: Unikernels

**Q:** Define a unikernel. Why can a unikernel remove the user/kernel boundary inside the instance, and what security trade-off does this create?

**Answer & Explanation:**

Step 1: Define a unikernel. A unikernel is an application plus its dependencies plus a thin OS, compiled into a static binary that runs on a hypervisor.

Step 2: State the single-purpose design. A unikernel normally runs one application in one process-like image.

Step 3: Explain the single-address-space property. The application and kernel code share one binary and one address space.

Step 4: Explain why no internal user/kernel boundary is needed. There is no second application inside the same instance to protect against. Inter-application isolation is achieved by running separate applications as separate unikernel VMs.

Step 5: State the performance benefit. System calls can become ordinary function calls, reducing transition overhead.

Step 6: State the security trade-off. Isolation between unikernel instances can be strong because it uses the VM boundary, but there is no strong isolation inside one unikernel. A memory bug in the application may corrupt kernel-like state in that same image.

---

## Part 2: Memory & Storage Size Calculations

### Question 17: Two-dimensional page-walk cost

**Q:** Assume a four-level guest page table and a four-level EPT. On a TLB miss, a guest virtual address translation requires walking the guest page table. Each guest page-table entry read is itself a guest pseudo-physical memory access that must be translated through EPT. If each four-level EPT walk takes 4 memory accesses, and the final data access also needs EPT translation, compute the worst-case number of memory accesses. Compare it with a native four-level page walk using the simplified convention from the notes: native = 4 memory accesses.

**Answer & Explanation:**

Step 1: Count guest page-table levels. A four-level guest page walk reads 4 guest page-table entries.

Step 2: Translate each guest page-table entry address. Each guest page-table entry address is guest pseudo-physical, so each one needs a four-level EPT walk: `4 guest levels * 4 EPT accesses = 16 accesses`.

Step 3: Count the guest page-table entry reads themselves. The 4 guest page-table entries must also be read: `4 accesses`.

Step 4: Count the final data access. The final guest pseudo-physical data address needs one more EPT walk of 4 accesses, plus the actual data access. In the lecture's simplified headline comparison, the total is usually reported as **24 memory accesses versus 4 native**.

Step 5: State the result. Worst-case EPT two-dimensional translation is **24 memory accesses**, compared with **4 native** in the notes' simplified model.

Step 6: State the practical caveat. This worst case is softened by TLB caching; the notes report modern TLB hit rates above 95%.

---

### Question 18: EPT page-table memory footprint

**Q:** A VM has 2 GiB of guest pseudo-physical memory, backed by 4 KB pages. EPT uses four levels, and each page-table page contains 512 entries. Assume every byte of the 2 GiB range is mapped using 4 KB EPT leaf mappings. How many 4 KB pages are required for the EPT metadata itself? How many bytes is that?

**Answer & Explanation:**

Step 1: Convert guest memory to pages.

`2 GiB = 2 * 1024 MiB = 2048 MiB`

`2048 MiB / 4 KB = 524,288 data pages`

Step 2: Compute leaf EPT pages. Each leaf page-table page maps 512 data pages.

`524,288 / 512 = 1,024 leaf EPT pages`

Step 3: Compute the next level. Each next-level page maps 512 leaf EPT pages.

`1,024 / 512 = 2 pages`

Step 4: Compute the remaining top levels. The 2 next-level pages fit under 1 higher-level page, and that fits under 1 top-level page.

Step 5: Add metadata pages.

`1,024 + 2 + 1 + 1 = 1,028 EPT metadata pages`

Step 6: Convert to bytes.

`1,028 * 4,096 = 4,210,688 bytes`

Step 7: State the result. The EPT metadata requires **1,028 pages**, or **4,210,688 bytes**, ignoring implementation-specific extra metadata.

---

### Question 19: Qemu guest memory allocation

**Q:** In the KVM/Qemu model from the notes, Qemu allocates memory that becomes the guest's pseudo-physical memory. A host runs four VMs with guest memory sizes 1.5 GiB, 2 GiB, 768 MiB, and 512 MiB. Ignoring overhead, how much host virtual memory must Qemu allocate across all four processes? Give the answer in MiB and GiB.

**Answer & Explanation:**

Step 1: Convert all sizes to MiB.

- `1.5 GiB = 1.5 * 1024 MiB = 1,536 MiB`
- `2 GiB = 2 * 1024 MiB = 2,048 MiB`
- `768 MiB = 768 MiB`
- `512 MiB = 512 MiB`

Step 2: Add them.

`1,536 + 2,048 + 768 + 512 = 4,864 MiB`

Step 3: Convert to GiB.

`4,864 / 1,024 = 4.75 GiB`

Step 4: State the result. Qemu must allocate **4,864 MiB**, which is **4.75 GiB**, before considering page-table, emulator, device, and host-kernel overheads.

---

### Question 20: VMCS-like structure layout

**Q:** Under the LP64 layout assumptions at the top of this document, compute the field offsets and total size of `struct VmcsLite`. Then compute the address of `records[2].name[5]` if `records` begins at address `0x700000`.

```c
#include <stdint.h>
#include <stdio.h>

struct VmcsLite {
    uint16_t vpid;
    uint16_t flags;
    uint64_t guest_rip;
    uint64_t host_rsp;
    uint32_t exit_reason;
    char name[12];
};

int main(void) {
    struct VmcsLite records[4];
    (void)records;
    printf("VmcsLite is a VMCS-like teaching structure.\n");
    return 0;
}
```

**Answer & Explanation:**

Step 1: Place `vpid`. It is a `uint16_t`, so it has size 2 and alignment 2. Offset = 0.

Step 2: Place `flags`. It is also a `uint16_t`. Offset = 2.

Step 3: Align `guest_rip`. It is a `uint64_t`, so it needs 8-byte alignment. After `flags`, the next offset is 4, so 4 bytes of padding are inserted. `guest_rip` offset = 8.

Step 4: Place `host_rsp`. It is another `uint64_t`. Offset = 16.

Step 5: Place `exit_reason`. It is a `uint32_t`, size 4, alignment 4. Offset = 24.

Step 6: Place `name`. `char[12]` has alignment 1. Offset = 28. It occupies bytes 28 through 39.

Step 7: Round the structure size. The largest alignment is 8. The structure ends at byte 40, already a multiple of 8, so `sizeof(struct VmcsLite) = 40`.

Step 8: Compute `records[2]`.

`records[2] base = 0x700000 + 2 * 40 = 0x700000 + 0x50 = 0x700050`

Step 9: Compute `name[5]`.

`name` offset is 28 decimal, which is `0x1c`. Index 5 adds `0x5`.

`address = 0x700050 + 0x1c + 0x5 = 0x700071`

Step 10: State the result. `records[2].name[5]` is at **0x700071**.

---

### Question 21: virtio descriptor ring layout

**Q:** Under the LP64 layout assumptions, compute the size of `struct VirtqDesc`, the size of an array of 128 descriptors, and the address of `ring[37].next` if `ring` begins at address `0x100000`.

```c
#include <stdint.h>
#include <stdio.h>

struct VirtqDesc {
    uint64_t addr;
    uint32_t len;
    uint16_t flags;
    uint16_t next;
};

int main(void) {
    struct VirtqDesc ring[128];
    (void)ring;
    printf("Virtqueue descriptor teaching example.\n");
    return 0;
}
```

**Answer & Explanation:**

Step 1: Place `addr`. It is a `uint64_t`, so offset = 0, size = 8, alignment = 8.

Step 2: Place `len`. It is a `uint32_t`, so offset = 8, size = 4.

Step 3: Place `flags`. It is a `uint16_t`, so offset = 12, size = 2.

Step 4: Place `next`. It is a `uint16_t`, so offset = 14, size = 2.

Step 5: Compute structure size. The structure ends at byte 16, already a multiple of the largest alignment, 8. Therefore `sizeof(struct VirtqDesc) = 16`.

Step 6: Compute array size.

`128 * 16 = 2,048 bytes`

Step 7: Compute `ring[37]`.

`37 * 16 = 592 decimal = 0x250`

`ring[37] base = 0x100000 + 0x250 = 0x100250`

Step 8: Add `next` offset.

`next offset = 14 decimal = 0xe`

`address = 0x100250 + 0xe = 0x10025e`

Step 9: State the result. `ring[37].next` is at **0x10025e**.

---

### Question 22: Per-vCPU state storage

**Q:** Under the LP64 layout assumptions, compute the size of `struct VcpuState`. Then compute how many bytes are needed for 6 vCPUs.

```c
#include <stdint.h>
#include <stdio.h>

struct VcpuState {
    uint64_t regs[16];
    uint64_t rip;
    uint64_t rsp;
    uint32_t exit_reason;
    uint8_t runnable;
};

int main(void) {
    struct VcpuState vcpus[6];
    (void)vcpus;
    printf("Per-vCPU state teaching example.\n");
    return 0;
}
```

**Answer & Explanation:**

Step 1: Compute `regs`. `regs[16]` contains 16 `uint64_t` values:

`16 * 8 = 128 bytes`

Offset of `regs` = 0.

Step 2: Place `rip`. It is 8 bytes and already aligned at offset 128. It occupies bytes 128 through 135.

Step 3: Place `rsp`. It is 8 bytes and starts at offset 136.

Step 4: Place `exit_reason`. It is 4 bytes and starts at offset 144.

Step 5: Place `runnable`. It is 1 byte and starts at offset 148.

Step 6: Add tail padding. The structure currently ends at offset 149. The largest alignment is 8, so the total size rounds up to 152.

Step 7: Compute 6 vCPUs.

`6 * 152 = 912 bytes`

Step 8: State the result. `sizeof(struct VcpuState) = 152`, and 6 such structures need **912 bytes**.

---

### Question 23: Qemu thread count

**Q:** The notes state that Qemu commonly has one thread per vCPU and one thread per virtual device. A VM has 8 vCPUs and 5 virtual devices. Each thread is configured with a 1 MiB stack. Ignoring all other memory, how many Qemu threads are needed and how much stack memory is reserved?

**Answer & Explanation:**

Step 1: Count vCPU threads.

`8 vCPUs -> 8 threads`

Step 2: Count virtual-device threads.

`5 devices -> 5 threads`

Step 3: Add them.

`8 + 5 = 13 threads`

Step 4: Compute stack reservation.

`13 * 1 MiB = 13 MiB`

Step 5: State the result. The VM needs **13 Qemu threads** and reserves **13 MiB** of stack memory under these assumptions.

---

### Question 24: SR-IOV capacity

**Q:** A host cluster has 3 hosts. Each host has one SR-IOV NIC supporting 2,048 Virtual Functions. The hypervisor reserves 5 VFs per host for management and testing. A tenant wants to run 6,000 VMs, each requiring one VF. Is the request feasible, and how many VFs remain unused or how many are missing?

**Answer & Explanation:**

Step 1: Compute usable VFs per host.

`2,048 - 5 = 2,043 usable VFs per host`

Step 2: Compute cluster capacity.

`3 * 2,043 = 6,129 usable VFs`

Step 3: Compare with demand.

Demand = 6,000 VFs.

`6,129 - 6,000 = 129`

Step 4: State the result. The request is feasible, and **129 VFs remain unused**.

Step 5: State the architectural caveat. Capacity is not the only design criterion: SR-IOV reduces hypervisor interposition and can complicate migration, monitoring, and policy enforcement.

---

## Part 3: Code Tracing & Output Prediction

### Question 25: Instruction classifier output

**Q:** Predict the exact output of the following complete C program. Then explain which instruction violates the Popek and Goldberg condition.

```c
#include <stdio.h>
#include <stddef.h>

struct Instr {
    const char *name;
    int control_sensitive;
    int behaviour_sensitive;
    int privileged;
};

int main(void) {
    struct Instr ins[] = {
        {"HLT",  0, 0, 1},
        {"LGDT", 1, 0, 1},
        {"POPF", 0, 1, 0},
        {"ADD",  0, 0, 0}
    };

    for (size_t i = 0; i < sizeof(ins) / sizeof(ins[0]); i++) {
        int sensitive = ins[i].control_sensitive || ins[i].behaviour_sensitive;
        const char *verdict = (sensitive && !ins[i].privileged)
            ? "breaks-virtualisability"
            : "ok";

        printf("%s: sensitive=%d privileged=%d verdict=%s\n",
               ins[i].name, sensitive, ins[i].privileged, verdict);
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
HLT: sensitive=0 privileged=1 verdict=ok
LGDT: sensitive=1 privileged=1 verdict=ok
POPF: sensitive=1 privileged=0 verdict=breaks-virtualisability
ADD: sensitive=0 privileged=0 verdict=ok
```

Step 1: `sensitive` is computed as `control_sensitive || behaviour_sensitive`.

Step 2: `HLT` is privileged but not marked sensitive in this simplified table, so it is `ok`.

Step 3: `LGDT` is sensitive and privileged, so it satisfies the theorem.

Step 4: `POPF` is behaviour-sensitive and not privileged, so it is sensitive but does not trap. It violates the theorem.

Step 5: `ADD` is neither sensitive nor privileged, so it is ordinary innocuous code.

Step 6: The violating instruction is **POPF**.

---

### Question 26: vPSW resume calculation

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

struct Psw {
    char mode;
    unsigned int B;
    unsigned int L;
    unsigned int PC;
};

static int valid_vpsw(const struct Psw *v, unsigned int memsize) {
    return v->B <= memsize &&
           v->L <= memsize - v->B &&
           v->PC < v->L;
}

int main(void) {
    unsigned int addr0 = 0x4000;
    unsigned int memsize = 0x2000;
    struct Psw vpsw = {'s', 0x1200, 0x0700, 0x0030};

    if (valid_vpsw(&vpsw, memsize)) {
        printf("guest M=%c\n", vpsw.mode);
        printf("real M=%c B=0x%04x L=0x%04x PC=0x%04x\n",
               'u', addr0 + vpsw.B, vpsw.L, vpsw.PC);
    } else {
        printf("invalid vPSW\n");
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
guest M=s
real M=u B=0x5200 L=0x0700 PC=0x0030
```

Step 1: Validate `B`. `0x1200 <= 0x2000`, so the base is inside VM memory.

Step 2: Validate `L`. `memsize - B = 0x2000 - 0x1200 = 0x0e00`; `0x0700 <= 0x0e00`, so the segment fits.

Step 3: Validate `PC`. `0x0030 < 0x0700`, so the program counter is inside the virtual segment.

Step 4: Compute real base. `addr0 + vpsw.B = 0x4000 + 0x1200 = 0x5200`.

Step 5: Explain the mode. The guest believes it is in supervisor mode (`guest M=s`), but the VMM resumes it in real user mode (`real M=u`).

---

### Question 27: Guest trap routing

**Q:** Predict the exact output of the following complete C program. Interpret the output using the two Popek and Goldberg trap cases.

```c
#include <stdio.h>

struct Trap {
    const char *source;
    char vmode;
    const char *instruction;
};

int main(void) {
    struct Trap traps[] = {
        {"guest kernel", 's', "LGDT"},
        {"guest app",    'u', "SYSCALL"},
        {"guest kernel", 's', "HLT"}
    };

    for (int i = 0; i < 3; i++) {
        if (traps[i].vmode == 's') {
            printf("%s trapped on %s -> VMM emulates sensitive operation\n",
                   traps[i].source, traps[i].instruction);
        } else {
            printf("%s trapped on %s -> VMM injects virtual trap to guest OS\n",
                   traps[i].source, traps[i].instruction);
        }
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
guest kernel trapped on LGDT -> VMM emulates sensitive operation
guest app trapped on SYSCALL -> VMM injects virtual trap to guest OS
guest kernel trapped on HLT -> VMM emulates sensitive operation
```

Step 1: The first trap has `vmode == 's'`, so the VMM treats it as a guest-kernel operation and emulates it.

Step 2: The second trap has `vmode == 'u'`, so the VMM treats it as a guest-application trap. It should be delivered virtually to the guest OS, not handled as a guest-kernel sensitive instruction.

Step 3: The third trap again has `vmode == 's'`, so it is handled directly by the VMM.

Step 4: The security point is that the VMM must track transitions accurately. If `vPSW.M` is wrong, the VMM may route traps to the wrong handler.

---

### Question 28: VM exit counts for emulated I/O versus virtio batching

**Q:** Predict the exact output of the following complete C program. Then explain what it says about full emulation versus virtio.

```c
#include <stdio.h>

int main(void) {
    int packets = 1000;
    int mmio_writes_per_packet = 6;
    int emulated_exits = packets * mmio_writes_per_packet;

    int virtio_batch = 64;
    int virtio_kicks = (packets + virtio_batch - 1) / virtio_batch;

    printf("emulated_exits=%d\n", emulated_exits);
    printf("virtio_kicks=%d\n", virtio_kicks);
    printf("exit_reduction_factor=%d\n", emulated_exits / virtio_kicks);

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
emulated_exits=6000
virtio_kicks=16
exit_reduction_factor=375
```

Step 1: Full emulation causes `1000 * 6 = 6000` MMIO-related exits.

Step 2: virtio batches 64 packets per notification.

`ceil(1000 / 64) = (1000 + 63) / 64 = 1063 / 64 = 16` using integer division.

Step 3: The integer reduction factor is `6000 / 16 = 375`.

Step 4: The virtualisation lesson is that virtio improves I/O performance by reducing VM exits through paravirtualised rings, batching, and notification suppression.

---

### Question 29: Qemu thread tracing

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

int main(void) {
    int vcpus = 4;
    int virtual_devices = 3;
    int qemu_threads = vcpus + virtual_devices;

    printf("vCPU threads: %d\n", vcpus);
    printf("device threads: %d\n", virtual_devices);
    printf("total Qemu threads: %d\n", qemu_threads);

    if (qemu_threads > vcpus) {
        printf("device emulation is in the process model\n");
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
vCPU threads: 4
device threads: 3
total Qemu threads: 7
device emulation is in the process model
```

Step 1: `vcpus` is 4.

Step 2: `virtual_devices` is 3.

Step 3: The total is `4 + 3 = 7`.

Step 4: Since 7 is greater than 4, the final `if` condition is true.

Step 5: This reflects the KVM/Qemu split from the notes: KVM provides kernel/hardware support, while Qemu userspace handles VM management and emulated devices.

---

### Question 30: Namespace and cgroup bitmask tracing

**Q:** Predict the exact output of the following complete C program. Then explain the namespace/cgroup distinction.

```c
#include <stdio.h>

#define NS_MOUNT  (1u << 0)
#define NS_NET    (1u << 1)
#define NS_PID    (1u << 2)
#define NS_USER   (1u << 3)

#define CG_MEMORY (1u << 0)
#define CG_CPU    (1u << 1)
#define CG_DEVICE (1u << 2)

int main(void) {
    unsigned int namespaces = NS_MOUNT | NS_NET | NS_PID | NS_USER;
    unsigned int cgroups = CG_MEMORY | CG_CPU;

    printf("mount_ns=%u\n", (namespaces & NS_MOUNT) != 0);
    printf("net_ns=%u\n", (namespaces & NS_NET) != 0);
    printf("pid_ns=%u\n", (namespaces & NS_PID) != 0);
    printf("device_cgroup=%u\n", (cgroups & CG_DEVICE) != 0);
    printf("memory_limited=%u\n", (cgroups & CG_MEMORY) != 0);

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
mount_ns=1
net_ns=1
pid_ns=1
device_cgroup=0
memory_limited=1
```

Step 1: `namespaces` includes mount, network, PID, and user namespaces, so the first three printed namespace checks are true.

Step 2: `cgroups` includes memory and CPU, but not device control.

Step 3: Therefore `device_cgroup=0` and `memory_limited=1`.

Step 4: The conceptual distinction is: namespaces restrict what the process can **see**, while cgroups restrict what resources the process can **use**.

Step 5: The missing device cgroup is a security concern because device access is a resource-control problem, not a visibility-only problem.

---

### Question 31: Guest virtual to host physical address translation

**Q:** Predict the exact output of the following complete C program. Assume the `gpa_to_hpa_page` array maps guest pseudo-physical page numbers to host physical page bases.

```c
#include <stdio.h>

int main(void) {
    unsigned int page_size = 0x1000;
    unsigned int gva = 0x1234;
    unsigned int gva_page = gva / page_size;
    unsigned int offset = gva % page_size;

    unsigned int guest_page_to_pseudo_page[] = {3, 1, 0, 2};
    unsigned int gpa_page = guest_page_to_pseudo_page[gva_page];

    unsigned int gpa_to_hpa_page[] = {0x9000, 0xa000, 0xb000, 0xc000};
    unsigned int hpa = gpa_to_hpa_page[gpa_page] + offset;

    printf("gva_page=%u offset=0x%x\n", gva_page, offset);
    printf("gpa_page=%u\n", gpa_page);
    printf("hpa=0x%x\n", hpa);

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
gva_page=1 offset=0x234
gpa_page=1
hpa=0xa234
```

Step 1: `0x1234 / 0x1000 = 1`, so the guest virtual page number is 1.

Step 2: `0x1234 % 0x1000 = 0x234`, so the page offset is `0x234`.

Step 3: `guest_page_to_pseudo_page[1] = 1`, so the guest pseudo-physical page number is 1.

Step 4: `gpa_to_hpa_page[1] = 0xa000`.

Step 5: Add the offset: `0xa000 + 0x234 = 0xa234`.

Step 6: This models the two-stage translation idea: guest virtual to guest pseudo-physical, then guest pseudo-physical to host physical.

---

### Question 32: Unikernel syscall-latency model

**Q:** Predict the exact output of the following complete C program. Then explain the virtualisation concept it models.

```c
#include <stdio.h>

int main(void) {
    int calls = 250000;
    int linux_syscall_cycles = 160;
    int unikernel_function_cycles = 24;

    int linux_total = calls * linux_syscall_cycles;
    int unikernel_total = calls * unikernel_function_cycles;

    printf("linux_total=%d\n", linux_total);
    printf("unikernel_total=%d\n", unikernel_total);
    printf("saved=%d\n", linux_total - unikernel_total);

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
linux_total=40000000
unikernel_total=6000000
saved=34000000
```

Step 1: Linux-style syscall total:

`250,000 * 160 = 40,000,000`

Step 2: Unikernel function-call total:

`250,000 * 24 = 6,000,000`

Step 3: Difference:

`40,000,000 - 6,000,000 = 34,000,000`

Step 4: The concept is that a unikernel can compile application and kernel-like code into one address space, so system calls can become function calls.

Step 5: This improves performance inside the instance, but it also means there is no strong user/kernel isolation inside that same unikernel.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 33: Buggy virtualisability checker

**Q:** The following complete C program contains both a buggy and a corrected virtualisability checker. Identify the bug in `virtualisable_bad`, explain the security consequence, and explain why `virtualisable_safe` is correct.

```c
#include <stdio.h>
#include <stddef.h>

struct Instr {
    const char *name;
    int control_sensitive;
    int behaviour_sensitive;
    int privileged;
};

static int virtualisable_bad(const struct Instr *ins, size_t n) {
    for (size_t i = 0; i < n; i++) {
        if (ins[i].control_sensitive && !ins[i].privileged) {
            return 0;
        }
    }
    return 1;
}

static int virtualisable_safe(const struct Instr *ins, size_t n) {
    for (size_t i = 0; i < n; i++) {
        int sensitive = ins[i].control_sensitive || ins[i].behaviour_sensitive;
        if (sensitive && !ins[i].privileged) {
            return 0;
        }
    }
    return 1;
}

int main(void) {
    struct Instr subset[] = {
        {"LGDT", 1, 0, 1},
        {"POPF", 0, 1, 0},
        {"ADD",  0, 0, 0}
    };

    printf("bad=%d\n", virtualisable_bad(subset, 3));
    printf("safe=%d\n", virtualisable_safe(subset, 3));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `virtualisable_bad` checks only `control_sensitive` instructions. It ignores behaviour-sensitive instructions.

Step 2: Show the failing case. `POPF` is marked `behaviour_sensitive=1` and `privileged=0`. The bad checker accepts the ISA because it never checks that field.

Step 3: State the output.

```text
bad=1
safe=0
```

Step 4: Explain the consequence. A behaviour-sensitive non-privileged instruction may behave differently in a VM than on real hardware without trapping, so the VMM cannot emulate the expected result. That breaks equivalence.

Step 5: Explain the fix. `virtualisable_safe` computes `sensitive = control_sensitive || behaviour_sensitive` and rejects any sensitive instruction that is not privileged. This matches the Popek and Goldberg theorem.

---

### Question 34: Unsafe vPSW segment loading

**Q:** The following complete C program demonstrates an unsafe and a safe way to convert a guest `vPSW` segment into a real segment. Identify the vulnerability in `load_segment_bad` and explain the secure refactor.

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

struct Psw {
    char mode;
    uint32_t B;
    uint32_t L;
    uint32_t PC;
};

struct Vm {
    uint32_t addr0;
    uint32_t memsize;
};

static void load_segment_bad(const struct Vm *vm, const struct Psw *vpsw,
                             uint32_t *real_B, uint32_t *real_L) {
    *real_B = vm->addr0 + vpsw->B;
    *real_L = vpsw->L;
}

static bool load_segment_safe(const struct Vm *vm, const struct Psw *vpsw,
                              uint32_t *real_B, uint32_t *real_L) {
    if (vpsw->B > vm->memsize) {
        return false;
    }
    if (vpsw->L > vm->memsize - vpsw->B) {
        return false;
    }
    if (vpsw->PC >= vpsw->L) {
        return false;
    }
    if (vm->addr0 > UINT32_MAX - vpsw->B) {
        return false;
    }

    *real_B = vm->addr0 + vpsw->B;
    *real_L = vpsw->L;
    return true;
}

int main(void) {
    struct Vm vm = {0x4000, 0x2000};
    struct Psw malicious = {'s', 0x1f00, 0x0200, 0x0010};
    uint32_t B = 0;
    uint32_t L = 0;

    load_segment_bad(&vm, &malicious, &B, &L);
    printf("bad B=0x%x L=0x%x\n", B, L);

    printf("safe accepted=%d\n", load_segment_safe(&vm, &malicious, &B, &L));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the vulnerability. `load_segment_bad` trusts the guest-controlled `vpsw->B` and `vpsw->L` without bounds checks.

Step 2: Explain the exploit condition. The malicious segment starts at `0x1f00` and has length `0x0200`, so it extends to `0x2100`. The VM's memory size is only `0x2000`, so the requested segment exceeds the VM allocation.

Step 3: State the output.

```text
bad B=0x5f00 L=0x200
safe accepted=0
```

Step 4: Explain the security impact. If the VMM loaded that segment into hardware, the guest could address memory outside its assigned range. That breaks safety.

Step 5: Explain the secure refactor. `load_segment_safe` validates `B <= memsize`, validates `L <= memsize - B` without overflow, validates `PC < L`, and checks that `addr0 + B` cannot overflow.

Step 6: State the exam conclusion. A VMM must never load guest-requested translation state into real hardware until the translated range is proven to remain inside the VM allocation.

---

### Question 35: MMIO register array out-of-bounds access

**Q:** The following complete C program models a virtual device with MMIO registers. Identify the bug in `mmio_read_bad` and explain the secure refactor in `mmio_read_safe`.

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

struct Device {
    uint32_t regs[8];
};

static uint32_t mmio_read_bad(struct Device *dev, uint32_t offset) {
    return dev->regs[offset / 4];
}

static bool mmio_read_safe(struct Device *dev, uint32_t offset, uint32_t *out) {
    if (offset % 4 != 0) {
        return false;
    }
    if (offset / 4 >= 8) {
        return false;
    }
    *out = dev->regs[offset / 4];
    return true;
}

int main(void) {
    struct Device dev = {{10, 20, 30, 40, 50, 60, 70, 80}};
    uint32_t value = 0;

    printf("bad valid=%u\n", mmio_read_bad(&dev, 12));
    printf("safe valid=%d\n", mmio_read_safe(&dev, 12, &value));
    printf("safe value=%u\n", value);
    printf("safe invalid=%d\n", mmio_read_safe(&dev, 40, &value));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `mmio_read_bad` computes `offset / 4` and indexes the register array without checking alignment or range.

Step 2: Explain why this matters for virtualisation. MMIO offsets are guest-controlled. A malicious guest can issue invalid offsets to try to read or write outside the virtual-device register array.

Step 3: State the output for this particular run.

```text
bad valid=40
safe valid=1
safe value=40
safe invalid=0
```

Step 4: Explain the secure refactor. `mmio_read_safe` rejects unaligned offsets and rejects offsets where `offset / 4 >= 8`.

Step 5: State the exam conclusion. Virtual device emulation is part of the trusted interface. Every guest-supplied offset and length must be checked before touching emulator memory.

---

### Question 36: Virtio descriptor length validation

**Q:** The following complete C program models descriptor validation for a virtio-like queue. Identify the bug in `desc_ok_bad` and explain why `desc_ok_safe` is correct.

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

struct Desc {
    uint64_t addr;
    uint32_t len;
};

static bool desc_ok_bad(struct Desc d, uint64_t guest_mem_size) {
    return d.addr + d.len <= guest_mem_size;
}

static bool desc_ok_safe(struct Desc d, uint64_t guest_mem_size) {
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
    struct Desc normal = {0x0800, 0x0100};
    struct Desc overflow = {UINT64_MAX - 7u, 16};

    printf("normal bad=%d safe=%d\n",
           desc_ok_bad(normal, mem), desc_ok_safe(normal, mem));
    printf("overflow bad=%d safe=%d\n",
           desc_ok_bad(overflow, mem), desc_ok_safe(overflow, mem));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `desc_ok_bad` checks `d.addr + d.len <= guest_mem_size`, but the addition can overflow.

Step 2: Explain the failing descriptor. For `overflow`, `d.addr = UINT64_MAX - 7` and `d.len = 16`. The addition wraps around modulo 2^64 to a small value.

Step 3: State the output.

```text
normal bad=1 safe=1
overflow bad=1 safe=0
```

Step 4: Explain the security impact. If accepted, the descriptor could cause the virtual device or hypervisor to access memory outside the guest's valid pseudo-physical range.

Step 5: Explain the secure refactor. `desc_ok_safe` first checks `addr <= guest_mem_size`, then checks `len <= guest_mem_size - addr`. Subtracting after the bounds check avoids overflow.

Step 6: State the exam conclusion. For guest-controlled addresses and lengths, validate using subtraction-based bounds checks rather than overflow-prone addition.

---

### Question 37: Missing null terminator in VM metadata

**Q:** The following complete C program models storing a VM display name in fixed-size metadata. Identify the null-termination bug and explain the secure refactor.

```c
#include <stdio.h>
#include <string.h>

struct VmMetadata {
    char name[8];
};

static void set_name_bad(struct VmMetadata *vm, const char *src) {
    strncpy(vm->name, src, sizeof(vm->name));
}

static void set_name_safe(struct VmMetadata *vm, const char *src) {
    snprintf(vm->name, sizeof(vm->name), "%s", src);
}

int main(void) {
    struct VmMetadata bad;
    struct VmMetadata safe;

    set_name_bad(&bad, "guest123456");
    set_name_safe(&safe, "guest123456");

    printf("safe name=%s\n", safe.name);
    printf("safe last byte=%d\n", safe.name[7] == '\0');

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `strncpy` does not guarantee null termination when the source string length is greater than or equal to the destination size.

Step 2: Apply it here. `name` has 8 bytes, while `"guest123456"` is longer than 7 visible characters. `set_name_bad` may leave `bad.name` without a terminating `'\0'`.

Step 3: Explain why this is dangerous. Later code that prints or compares `bad.name` as a C string may read past the end of the array.

Step 4: State the safe output from the refactored path.

```text
safe name=guest12
safe last byte=1
```

Step 5: Explain the secure refactor. `snprintf` writes at most `sizeof(vm->name) - 1` visible characters and always writes a null terminator when the size is nonzero.

Step 6: State the exam conclusion. Fixed-size metadata buffers must reserve space for `'\0'` or use APIs that guarantee termination.

---

### Question 38: Unsafe passthrough without complete IOMMU checks

**Q:** The following complete C program models device assignment. Identify the security bug in `assign_bad` and explain why `assign_safe` requires both DMA remapping and interrupt remapping.

```c
#include <stdio.h>
#include <stdbool.h>

struct Device {
    const char *name;
    bool supports_dmar;
    bool supports_interrupt_remap;
    bool already_assigned;
};

static bool assign_bad(struct Device dev) {
    return !dev.already_assigned;
}

static bool assign_safe(struct Device dev) {
    if (dev.already_assigned) {
        return false;
    }
    if (!dev.supports_dmar) {
        return false;
    }
    if (!dev.supports_interrupt_remap) {
        return false;
    }
    return true;
}

int main(void) {
    struct Device nic = {"nic0", true, false, false};

    printf("bad assignment=%d\n", assign_bad(nic));
    printf("safe assignment=%d\n", assign_safe(nic));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `assign_bad` only checks whether the device is already assigned. It does not check whether the platform can safely contain the device.

Step 2: State the output.

```text
bad assignment=1
safe assignment=0
```

Step 3: Explain DMA remapping. `supports_dmar` is required so the device can only DMA into memory assigned to the VM.

Step 4: Explain interrupt remapping. `supports_interrupt_remap` is required so the device cannot inject interrupts into the host or the wrong VM.

Step 5: Apply it here. The NIC supports DMA remapping but not interrupt remapping, so the safe assignment rejects it.

Step 6: State the exam conclusion. Direct assignment is not safe merely because a device is free; safe passthrough requires both memory and interrupt containment.

---

### Question 39: Container launched with unsafe privileges

**Q:** The following complete C program models container configuration. Identify the bug in `bad_web_container` and explain the secure refactor in `safe_web_container`.

```c
#include <stdio.h>
#include <stdbool.h>

#define CAP_NET_BIND_SERVICE (1u << 0)
#define CAP_SYS_ADMIN        (1u << 1)
#define CAP_SYS_MODULE       (1u << 2)
#define CAP_ALL              (CAP_NET_BIND_SERVICE | CAP_SYS_ADMIN | CAP_SYS_MODULE)

#define NS_MOUNT  (1u << 0)
#define NS_NET    (1u << 1)
#define NS_PID    (1u << 2)
#define NS_USER   (1u << 3)

#define CG_MEMORY (1u << 0)
#define CG_CPU    (1u << 1)
#define CG_DEVICE (1u << 2)

struct ContainerConfig {
    unsigned int namespaces;
    unsigned int cgroups;
    unsigned int caps;
    bool seccomp_enabled;
    bool privileged;
};

static struct ContainerConfig bad_web_container(void) {
    struct ContainerConfig c = {
        NS_MOUNT | NS_NET | NS_PID,
        CG_MEMORY | CG_CPU,
        CAP_ALL,
        false,
        true
    };
    return c;
}

static struct ContainerConfig safe_web_container(void) {
    struct ContainerConfig c = {
        NS_MOUNT | NS_NET | NS_PID | NS_USER,
        CG_MEMORY | CG_CPU | CG_DEVICE,
        CAP_NET_BIND_SERVICE,
        true,
        false
    };
    return c;
}

int main(void) {
    struct ContainerConfig bad = bad_web_container();
    struct ContainerConfig safe = safe_web_container();

    printf("bad privileged=%d caps=0x%x seccomp=%d\n",
           bad.privileged, bad.caps, bad.seccomp_enabled);
    printf("safe privileged=%d caps=0x%x seccomp=%d\n",
           safe.privileged, safe.caps, safe.seccomp_enabled);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `bad_web_container` creates a privileged container with all modeled capabilities and no seccomp filtering.

Step 2: State the output.

```text
bad privileged=1 caps=0x7 seccomp=0
safe privileged=0 caps=0x1 seccomp=1
```

Step 3: Explain why this weakens isolation. Capabilities such as `CAP_SYS_ADMIN` and `CAP_SYS_MODULE` are far beyond what a simple web container needs and expand the damage from a compromise.

Step 4: Explain the namespace issue. The bad configuration omits the user namespace, so root-like identity separation is weaker in this model.

Step 5: Explain the cgroup issue. The bad configuration omits the device cgroup, so device access is not explicitly constrained.

Step 6: Explain the secure refactor. The safe configuration uses more namespaces, resource controls, least privilege capabilities, seccomp filtering, and no privileged mode.

Step 7: State the exam conclusion. Container security is not just "use namespaces"; it also needs resource limits, capability minimisation, syscall filtering, and avoidance of privileged mode.

---

### Question 40: Missing cgroup memory limit

**Q:** The following complete C program models a scheduler decision for containers. Identify the resource-isolation bug and explain the secure refactor.

```c
#include <stdio.h>
#include <stdbool.h>

struct Limits {
    bool pid_namespace;
    bool mount_namespace;
    bool memory_cgroup;
    unsigned int memory_limit_mb;
};

static bool isolated_bad(struct Limits l) {
    return l.pid_namespace && l.mount_namespace;
}

static bool isolated_safe(struct Limits l) {
    return l.pid_namespace &&
           l.mount_namespace &&
           l.memory_cgroup &&
           l.memory_limit_mb > 0;
}

int main(void) {
    struct Limits c = {true, true, false, 0};

    printf("bad isolated=%d\n", isolated_bad(c));
    printf("safe isolated=%d\n", isolated_safe(c));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `isolated_bad` treats namespace isolation as sufficient and ignores resource controls.

Step 2: State the output.

```text
bad isolated=1
safe isolated=0
```

Step 3: Explain the distinction. Namespaces restrict visibility; cgroups restrict resource usage.

Step 4: Explain the attack. Without a memory cgroup limit, a compromised or buggy container may consume excessive host memory and cause denial of service.

Step 5: Explain the secure refactor. `isolated_safe` requires namespace isolation and an enabled memory cgroup with a positive memory limit.

Step 6: State the exam conclusion. A container that cannot see other processes may still be unsafe if it can exhaust shared host resources.

---

### Question 41: Unikernel single-address-space out-of-bounds write

**Q:** The following complete C program models a single-address-space unikernel image. Identify the vulnerability in `write_input_bad` and explain the secure refactor.

```c
#include <stdio.h>
#include <stdbool.h>
#include <stddef.h>

struct UnikernelImage {
    char input[8];
    char secret[8];
};

static void write_input_bad(struct UnikernelImage *img, size_t index, char value) {
    img->input[index] = value;
}

static bool write_input_safe(struct UnikernelImage *img, size_t index, char value) {
    if (index >= sizeof(img->input)) {
        return false;
    }
    img->input[index] = value;
    return true;
}

int main(void) {
    struct UnikernelImage img = {{0}, {'S', 'E', 'C', 'R', 'E', 'T', '!', '\0'}};

    printf("safe write=%d\n", write_input_safe(&img, 3, 'A'));
    printf("safe rejected=%d\n", write_input_safe(&img, 20, 'B'));
    printf("secret=%s\n", img.secret);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the vulnerability. `write_input_bad` writes to `img->input[index]` without checking that `index` is inside the 8-byte array.

Step 2: Explain why this matters in a unikernel. A unikernel typically has a single address space for application and kernel-like code. An out-of-bounds write in application-facing parsing code can corrupt other state inside the same image.

Step 3: State the output of the safe path.

```text
safe write=1
safe rejected=0
secret=SECRET!
```

Step 4: Explain the secure refactor. `write_input_safe` rejects any index greater than or equal to `sizeof(img->input)`.

Step 5: State the virtualisation trade-off. A VM boundary may isolate this unikernel from other unikernels, but it does not isolate components inside the same unikernel. Memory-safety checks are still required inside the image.

---

### Question 42: Incorrectly trusting guest-controlled trap-entry state

**Q:** The following complete C program models loading a guest kernel trap-entry `vPSW` from the guest's virtual `MEM[1]`. Identify the bug in `load_trap_entry_bad` and explain the secure refactor.

```c
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>

struct Psw {
    char mode;
    uint32_t B;
    uint32_t L;
    uint32_t PC;
};

static struct Psw load_trap_entry_bad(const struct Psw *guest_mem1) {
    return *guest_mem1;
}

static bool load_trap_entry_safe(const struct Psw *guest_mem1,
                                 uint32_t memsize,
                                 struct Psw *out) {
    if (guest_mem1->mode != 's') {
        return false;
    }
    if (guest_mem1->B > memsize) {
        return false;
    }
    if (guest_mem1->L > memsize - guest_mem1->B) {
        return false;
    }
    if (guest_mem1->PC >= guest_mem1->L) {
        return false;
    }
    *out = *guest_mem1;
    return true;
}

int main(void) {
    struct Psw guest_mem1 = {'s', 0x1f00, 0x0200, 0x0010};
    struct Psw out = {'u', 0, 0, 0};
    struct Psw bad = load_trap_entry_bad(&guest_mem1);

    printf("bad B=0x%x L=0x%x\n", bad.B, bad.L);
    printf("safe accepted=%d\n", load_trap_entry_safe(&guest_mem1, 0x2000, &out));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `load_trap_entry_bad` copies guest-controlled trap-entry state without validating it.

Step 2: Explain the failing state. `B=0x1f00` and `L=0x0200`, so the segment extends to `0x2100`, outside a VM memory size of `0x2000`.

Step 3: State the output.

```text
bad B=0x1f00 L=0x200
safe accepted=0
```

Step 4: Explain the security impact. When a guest application traps, the VMM emulates the native trap path by loading guest kernel state from the VM's virtual `MEM[1]`. That state is part of guest memory and must be treated as untrusted.

Step 5: Explain the secure refactor. The safe loader validates expected mode, base, length, and program counter before accepting the trap-entry state.

Step 6: State the exam conclusion. Even when the VMM is "delivering" a trap to the guest OS, it must validate the guest OS state before using it to resume execution.

---

## Final Revision Checklist

- Know the fundamental challenge: each OS expects to own privileged hardware.
- State Bugnion's definition with all three parts: widely-used interface, identical resource, cannot be bypassed.
- Connect VM goals to mechanisms: equivalence, safety, performance, and direct execution.
- Use the unit's classification: KVM is Type II here because Linux/Qemu are involved in scheduling and allocation.
- State memory denomination precisely: guest virtual -> guest pseudo-physical -> host physical.
- State the Popek and Goldberg theorem: all sensitive instructions must be privileged.
- Separate control-sensitive from behaviour-sensitive instructions.
- Map theorem violations correctly: control-sensitive non-privileged breaks safety; behaviour-sensitive non-privileged breaks equivalence.
- Explain `vPSW`, real `PSW`, `addr0`, `memsize`, and the two trap cases.
- Remember x86-32 `POPF`: behaviour-sensitive, non-privileged, fails silently.
- Explain VT-x root/non-root mode and why it is orthogonal to x86 rings.
- Know VMCS, VM entry, VM exit, and why exits are expensive.
- Explain shadow paging versus EPT, including the 24-access worst-case walk and the high TLB-hit-rate caveat.
- Compare full emulation, virtio, direct assignment, and SR-IOV.
- For IOMMU, mention both DMA remapping and interrupt remapping.
- Keep namespaces and cgroups separate: visibility versus resource usage.
- Reproduce the container security argument based on trusted-interface complexity.
- Define unikernels as static application-plus-thin-OS images running on a hypervisor.
- State the unikernel trade-off: VM-strength isolation between instances, no user/kernel isolation inside one instance.
