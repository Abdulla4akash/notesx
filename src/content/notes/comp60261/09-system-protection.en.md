---
subject: COMP60261
chapter: 9
title: "System Protection"
language: en
---

# COMP60261 — Secure Computer Architecture and Systems
# Lecture 3: System Protection

**Source material used:** `Lecture 3 - System Protection.pdf` slide deck.  
**Transcript status:** [TRANSCRIPT MISSING] No lecture transcript was provided in the chat, so these notes are grounded in the slides only. Spoken emphasis, worked derivations, exam hints, or corrections from the transcript are not included unless visible on the slides.

**Topic and scope:** This lecture covers system-level protection mechanisms beyond the CPU: DMA, I/O virtualization, IOMMUs, TrustZone, virtualization, hypervisors, VirtIO, confidential computing, and ARM CCA. It fits into secure computer architecture by showing that memory isolation must protect against **all masters of memory**, not just CPU cores.

---

## 1. Why CPU-Centric Models Are Not Enough

### 1.1 Von Neumann model vs real systems

**Slide reference:** p. 2.

#### Intuition
The simple von Neumann teaching model makes it look as though the CPU directly mediates all input, output, computation, and memory access. Real systems are not like this. Devices can often move data themselves through **Direct Memory Access (DMA)**, which means the CPU is not the only component capable of initiating memory transactions.

#### Von Neumann model
- The CPU handles all input/output to directly attached devices.
- Input and output pass through the CPU.
- The slide explicitly says this is very slow.

#### More realistic physical structure
- The CPU is only one participant in the system.
- I/O devices connect through DMA hardware.
- DMA controllers can move data to and from memory without the CPU copying each byte.

#### Key security point
The CPU is not the only entity that can access memory. A secure system must account for every component that can initiate memory requests, including DMA engines, peripherals, storage controllers, GPUs, modems, and other SoC subsystems.

#### [UNCLEAR]
The slide title says “Von Newmann” rather than “Von Neumann”; this is almost certainly a typo.

---

## 2. Direct Memory Access — DMA

### 2.1 Definition of DMA

**Slide reference:** pp. 3–4.

#### Intuition
DMA is a performance mechanism. Instead of the CPU copying data byte-by-byte between an I/O device and memory, the CPU configures a DMA controller, and the DMA controller performs the transfer directly.

#### Formal definition from slides
**Direct Memory Access (DMA)** is a feature of modern computer architectures that allows peripheral devices — such as network cards, GPUs, and storage controllers — to read and write system memory directly without involving the CPU.

#### Why it exists
- It is essential for performance.
- It frees the CPU from byte-by-byte data-copying overhead.
- It lets the CPU continue executing other instructions while the DMA transfer proceeds.

---

### 2.2 How software uses DMA

**Slide reference:** p. 3.

The slide gives a three-stage DMA use pattern.

#### Stage 1: Initiation
The CPU programs the DMA controller with:

- Source address in physical memory, for example an I/O device buffer.
- Destination address in main memory.
- Size of the data block to transfer.

Clean notation:

```text
DMA configuration = (source_physical_address, destination_physical_address, size)
```

or:


$$

\text{DMATransfer}(\text{source\_PA}, \text{destination\_PA}, \text{size})

$$


where:

- $\text{source\_PA}$ is the source physical address.
- $\text{destination\_PA}$ is the destination physical address.
- $\text{size}$ is the number of bytes or words to transfer.

#### Stage 2: Delegation and execution
- The CPU delegates the transfer task to the DMA controller.
- The CPU is now free to execute other instructions.
- The DMA controller takes control of the system bus.
- The DMA controller transfers data directly between the I/O device and main memory.
- The transfer bypasses the CPU.

#### Stage 3: Completion
- Once the block transfer is complete, the DMA controller sends an interrupt to the CPU.
- The interrupt notifies the CPU that the job is complete.

---

### 2.3 Why DMA is dangerous

**Slide reference:** p. 4.

#### Intuition
DMA is fast because it bypasses the CPU. That is also the security problem: if DMA bypasses the CPU, then CPU-enforced privilege checks, privilege rings, and paging protections do not necessarily apply.

#### Formal security issue from slides
A DMA-capable device can have access to the entire physical address space. A malicious or compromised peripheral can:

- Read arbitrary memory.
- Read kernel secrets.
- Read data from other processes.
- Write to arbitrary locations.
- Corrupt the kernel.
- Inject malicious code.
- Bypass CPU privilege rings.
- Bypass paging protections.

#### Example: Evil Maid / external DMA attack
The slide mentions “Evil Maid” attacks:

- An attacker has brief physical access to a machine.
- The attacker plugs in a malicious device, for example through Thunderbolt or external PCIe.
- The malicious device performs DMA.
- It can extract disk encryption keys from memory.
- This can happen without loading software on the victim computer.

#### Security lesson
A system that protects only CPU-originated memory accesses is incomplete. DMA creates a route around the CPU’s memory protection model.

---

### 2.4 SoC example: Qualcomm Snapdragon 600

**Slide reference:** p. 5.

The Snapdragon 600 diagram is used to show that a modern SoC contains many subsystems connected through a system fabric. The CPU is only one part of the system.

#### Main points from the slide
- Multiple subsystems access a single memory.
- Direct memory access is a fundamental part of each subsystem and I/O interface.
- The CPU is only a small part of the system.
- Hardware security is therefore much more than just CPU security.

#### Security interpretation
A realistic attack surface includes:

- CPU cores.
- GPU.
- Multimedia subsystem.
- Modem / radio subsystem.
- Storage interfaces.
- Peripheral buses.
- DMA engines.
- System interconnect.
- Memory controller.

#### [UNCLEAR]
The schematic on p. 5 is dense and many labels are difficult to read in the rendered slide. The main message is clear: many non-CPU components can access shared memory.

---

## 3. The Need for I/O Virtualization

**Slide reference:** p. 6.

I/O virtualization is needed because DMA-capable devices require controlled, virtualized access to memory.

---

### 3.1 Security boundary

#### Intuition
The system needs a hardware-enforced firewall between devices and physical memory.

#### Slide statement
Without I/O virtualization, a malicious or malfunctioning peripheral such as a network card could initiate a DMA transfer to any physical address, overwriting the OS kernel or reading sensitive data from other processes while completely bypassing CPU memory protection.

#### Security role
I/O virtualization restricts a device so it can only access memory regions that have been explicitly assigned to it.

---

### 3.2 Memory management efficiency

#### Problem
Without address translation for I/O, the OS may need to find and reserve large physically contiguous memory regions for DMA buffers.

#### I/O virtualization solution
The OS can use fragmented physical pages while presenting them to the device as a single contiguous I/O virtual address range.

#### Key term: IOVA
**IOVA** means **I/O Virtual Address**.

#### Intuition
IOVA is virtual memory for devices. A device sees a clean contiguous address range, even if the actual physical memory pages are scattered.

---

### 3.3 Hardware scatter-gather

#### Definition from slides
Hardware scatter-gather is a hardware-accelerated mechanism for scatter-gather I/O, where data from multiple non-contiguous physical buffers can be treated as a single transfer by the device.

#### Intuition
Instead of copying fragmented memory into one contiguous buffer, hardware can treat separate physical buffers as one logical transfer.

---

## 4. IOMMU — Input/Output Memory Management Unit

### 4.1 Definition

**Slide reference:** p. 7.

#### Intuition
An IOMMU is an MMU for devices. It sits between DMA-capable peripherals and memory, translating and checking device-originated memory accesses.

#### Formal definition from slides
The **IOMMU** is a hardware unit that sits between a DMA-capable peripheral and the main memory interconnect. It has two primary interdependent functions:

1. Address translation.
2. Memory protection.

It is also known as a **System MMU** in some contexts.

---

### 4.2 Function 1: Address translation

#### Formal slide definition
The IOMMU translates device-generated addresses, known as **I/O Virtual Addresses (IOVAs)**, into actual **Physical Addresses (PAs)** in system memory.

Clean notation:


$$

\text{IOMMU}: \text{IOVA} \rightarrow \text{PA}

$$


#### Intuition
The device operates in a clean, contiguous virtual address space. The IOMMU maps that address space onto real physical pages, which may be fragmented.

---

### 4.3 Function 2: Memory protection

#### Formal slide definition
The IOMMU enforces access control rules defined by the operating system. Using its own page tables, it ensures that a device can only read from or write to memory regions it has explicitly been granted access to.

#### Consequence
Any unauthorized access attempt is blocked, and a fault is reported to the CPU.

---

### 4.4 IOMMU page-table translation process

**Slide reference:** p. 8.

#### Algorithm
1. A peripheral initiates a DMA request using an IOVA.
2. The IOMMU checks its **I/O Translation Lookaside Buffer (IOTLB)**.
3. If the translation is present:
   - This is an **IOTLB hit**.
   - The IOVA is converted to a PA.
   - The memory access proceeds with minimal latency.
4. If the translation is absent:
   - This is an **IOTLB miss**.
   - The IOMMU performs a page-table walk.
   - It reads through a hierarchical set of page tables in main memory.
   - It searches for the correct IOVA-to-PA mapping.
   - This is a high-latency operation.
5. Once the translation is found:
   - The IOTLB is updated with the new entry.
   - The memory access completes.
6. If no valid mapping exists:
   - The access is blocked.
   - A fault is generated.

Clean notation:


$$

\text{DMA request} = (\text{device}, \text{IOVA}, \text{operation})

$$



$$

\text{IOTLB lookup}: \text{IOVA} \mapsto \text{PA}

$$


If valid:


$$

\text{access}(\text{PA}, \text{operation})

$$


If invalid:


$$

\text{fault}

$$


---

### 4.5 OS management and software complexity

**Slide reference:** p. 9.

#### Key point
The IOMMU is not managed directly by device drivers. The OS kernel provides a generic **DMA Mapping Framework** that abstracts the hardware.

#### Driver protocol: map-use-unmap
Drivers must follow a strict protocol.

##### 1. Map
Before a DMA transfer:

- The driver requests a mapping from the OS for a memory buffer.
- The OS creates an entry in the IOMMU page tables.
- The OS returns an IOVA to the driver.

##### 2. Use
During the transfer:

- The driver programs the device with the IOVA.
- The device performs DMA using that IOVA.

##### 3. Unmap
After the transfer:

- The driver tells the OS to unmap the buffer.
- The OS revokes the device’s access to that memory.

Clean notation:


$$

\text{map} \rightarrow \text{use} \rightarrow \text{unmap}

$$


#### Complexity added
The kernel must manage:

- IOMMU page tables.
- TLB flushing.
- Memory domains for every device.
- Correct mapping lifetimes.
- Correct isolation across devices.

#### Security implication
Failure to correctly manage mappings, such as forgetting to unmap, can lead to serious security vulnerabilities.

---

### 4.6 Threats mitigated by IOMMUs

**Slide reference:** p. 10.

The IOMMU provides defense-in-depth against attacks from I/O devices.

#### Mitigated threats
- Prevents a compromised peripheral DMA device, such as a network card with malicious firmware, from reading sensitive kernel memory.
- Prevents stealing data from other processes.
- Prevents injecting malicious code into the system.
- Isolates the impact of a faulty device driver.
- If a driver incorrectly programs a DMA transfer to a wrong address, the IOMMU blocks it.
- Prevents system-wide memory corruption that would otherwise lead to a crash.
- Stops devices being used to read arbitrary physical memory.
- Protects cryptographic keys, passwords, and other sensitive data from arbitrary DMA reads.
- Enables safe passthrough of a physical device to a guest VM without allowing that guest to compromise the host hypervisor or other guests.

#### Connection to later material
The slide explicitly connects IOMMU isolation to virtualization. Safe physical device passthrough to a guest VM requires IOMMU protection.

---

### 4.7 IOMMUs also introduce vulnerabilities

**Slide reference:** p. 11.

#### Key idea
Adding security mechanisms adds complexity. Complexity creates new attack surfaces.

#### Vulnerability examples from the slides
- A use-after-free vulnerability in the AMD IOMMU driver in the Linux kernel:
  - Could cause denial of service.
  - Could potentially escalate privileges.

- A flaw in the Intel VT-d IOMMU driver in the Linux kernel:
  - A page-table entry could be modified after validation.
  - Could allow a guest VM to compromise the host hypervisor.

- A bug in the ARM SMMU driver in the Linux kernel:
  - Improper handling of certain page-table formats could cause a system crash.

- “Bad-BAM” vulnerabilities in Qualcomm BAM:
  - Qualcomm BAM means Bus Access Module DMA engine.
  - A compromised component inside the SoC could bypass SMMU protections.
  - It could access memory it should not access.

#### [UNCLEAR]
The slide ends with “leading to a breakdown of the security mode”. This likely means “security model”, but the slide text says “mode”.

---

## 5. Alternative and Complementary Security Mechanisms

**Slide reference:** p. 12.

### 5.1 Why alternatives exist

The IOMMU provides comprehensive I/O virtualization and protection, but it is not the only hardware mechanism for securing memory and peripherals in a System-on-Chip.

Other techniques:

- May be used alongside an IOMMU.
- May be used where a full IOMMU is not practical.
- Offer different trade-offs between security, complexity, and performance.

---

## 6. Address Bit Restriction

**Slide reference:** p. 13.

### 6.1 Definition

#### Intuition
Address bit restriction is the most basic hardware isolation mechanism: the peripheral is physically prevented from generating addresses outside a fixed range.

#### Formal definition from slides
A peripheral’s physical connection to the system bus is intentionally limited. The peripheral’s hardware interface is wired only to a subset of the SoC’s address bus lines.

---

### 6.2 Worked example: 32-bit bus with only 28 address lines

#### Given
- System address bus: 32-bit.
- Full addressable space:


$$

2^{32} \text{ bytes} = 4 \text{ GB}

$$


- Peripheral connected only to the lower 28 address lines:


$$

A_0, A_1, \ldots, A_{27}

$$


#### Therefore
The peripheral can generate only:


$$

2^{28} \text{ byte addresses}

$$



$$

2^{28} = 268{,}435{,}456 \text{ bytes}

$$



$$

268{,}435{,}456 \text{ bytes} = 256 \text{ MB}

$$


#### Result
The peripheral is physically incapable of addressing memory outside the first 256 MB.

#### Security property
Any attempt to access memory beyond this hardwired limit fails at the hardware level.

---

### 6.3 Pros and cons

#### Pros
- Zero software overhead.
- Zero performance cost.
- Extremely simple.
- Robust because it is hardwired.

#### Cons
- Completely inflexible.
- Static.
- Does not protect against malicious accesses within the permitted region.

#### Typical use
Common in simpler, cost-sensitive SoCs for low-bandwidth peripherals where a fixed, dedicated memory region is sufficient.

---

## 7. ARM TrustZone

**Slide reference:** pp. 14–18.

### 7.1 Definition

#### Intuition
TrustZone divides a whole SoC into two security worlds: one normal/untrusted world and one secure/trusted world.

#### Formal definition from slides
ARM TrustZone is not a specific component. It is a security architecture that partitions the entirety of a System-on-Chip into two distinct operating environments, called **worlds**.

---

### 7.2 The two worlds

#### Normal World
Also called the **Rich Execution Environment (REE)**.

Contains:

- Commodity operating system, such as Linux or Android.
- Applications.
- Drivers.

Security status:

- Considered untrusted.

#### Secure World
Also called the **Trusted Execution Environment (TEE)**.

Contains:

- Small trusted operating system.
- Security-critical applications.
- Trusted Applications, or TAs.

Security status:

- Trusted environment.

#### Fundamental TrustZone guarantee
The Normal World cannot directly access or interfere with any Secure World resource, including:

- Memory.
- Peripherals.
- Code.

All transitions from the Normal World to the Secure World are tightly controlled through a specific software layer.

---

### 7.3 Architectural model

**Slide reference:** p. 15.

#### Two security states
The processor core operates in either:

- Secure state.
- Non-secure state.

At exception levels **EL0**, **EL1**, and **EL2**, the current state is dictated by the system register bit:


$$

\text{SCR\_EL3.NS}

$$


where **NS** means **Non-secure**.

#### Notation from slides
- $\text{NS.EL1}$: Non-secure state, Exception Level 1.
- $\text{S.EL1}$: Secure state, Exception Level 1.

#### EL3 special case
EL3 is always in Secure state, regardless of the value of the $\text{SCR\_EL3.NS}$ bit.

#### Intuition
EL3 is the root of trust for managing the system and controlling world transitions.

---

### 7.4 Two physical address spaces

TrustZone provides two separate physical address spaces:

- Secure physical address space.
- Non-secure physical address space.

#### Access rules
- Non-secure software can access only the Non-secure physical address space.
- If Non-secure software tries to access a Secure address, hardware blocks it.
- Secure software can access both physical address spaces.
- For Secure software, the target space is determined by an **NS bit** in its memory translation tables.

---

### 7.5 World switching and the Secure Monitor

**Slide reference:** p. 16.

#### Definition: Secure Monitor
The **Secure Monitor** is software running at EL3 that mediates transitions between the Normal and Secure worlds.

#### Intuition
The Secure Monitor is the gatekeeper. Normal World code cannot simply jump into Secure World code. It must go through a controlled exception path.

#### Secure Monitor Call — SMC
To switch from the Normal World to the Secure World, software executes a Secure Monitor Call:


$$

\text{SMC}

$$


#### Algorithm: Normal World to Secure World transition
1. Normal World software executes an SMC instruction.
2. The processor takes an exception.
3. The exception forces the processor into EL3.
4. The Secure Monitor saves the state of the current world, including:
   - General-purpose registers.
   - System registers.
   - Vector registers.
5. The Secure Monitor changes the security context by modifying:


$$

\text{SCR\_EL3.NS}

$$


6. It restores the state of the world being entered.
7. It performs an exception return into the target world, for example:


$$

\text{S.EL1}

$$


---

### 7.6 TrustZone security model

**Slide reference:** p. 17.

#### Components
- Normal World OS has a client API, usually through a kernel driver.
- The client API acts as a proxy.
- Applications use it to trigger SMC instructions and request Secure World services.
- The SMC instruction is the only hardware-layer mechanism for requesting a Secure World service from the Normal World.
- The Secure Monitor is minimal and highly audited.
- The Secure Monitor saves Normal World state, switches the processor to Secure state, and passes control to the Trusted OS.
- The Secure World runs a small OS, for example OP-TEE.
- Trusted Applications use Secure World APIs for functions such as:
  - Cryptography.
  - Secure storage.

#### Security proof idea from slides
The security of this model relies on the verifiable simplicity and correctness of the Secure Monitor. Its sole job is to manage the world switch. Formal verification methods can be applied to this small, well-defined code base to prove that it correctly isolates the two worlds and has no vulnerabilities allowing the Normal World to influence or gain control over the Secure World during a transition.

---

### 7.7 The NS-bit: “+1 width” on the system bus

**Slide reference:** p. 18.

#### Definition
The hardware foundation of TrustZone is a single additional signal that propagates with every transaction on the SoC interconnect, such as an AXI bus. This is the **Non-Secure bit**, or **NS bit**.

#### Intuition
The NS-bit is a security label attached to each memory or device transaction.

#### Conceptual model
On a 32-bit bus, the NS-bit acts conceptually like a 33rd address bit.

Important distinction:

- It is not part of the address value itself.
- It is a tag travelling alongside the address.
- It indicates the security state of the transaction’s originator.

#### Values

$$

\text{NS}=1

$$


means the transaction originates from the Normal World.


$$

\text{NS}=0

$$


means the transaction originates from the Secure World.

#### Enforcement
TrustZone-aware hardware checks the NS-bit for every transaction, including:

- Memory controllers.
- Peripherals.
- Interrupt controllers.

If:


$$

\text{NS}=1

$$


and the target resource is configured as Secure, hardware denies the transaction.

#### Result
The NS-bit provides pervasive hardware-enforced partitioning of the whole system.

---

## 8. TrustZone Worked Examples

### 8.1 Example: encrypted filesystem

**Slide reference:** p. 19.

#### Scenario
Data on off-chip storage is encrypted, but the decryption key must be protected from malware that might compromise the main operating system in the Normal World.

#### Components
- Encrypted filesystem stored in off-chip flash.
- Filesystem key stored in off-chip flash, but itself encrypted.
- Device-unique master key stored permanently in secure on-chip memory.
- Secure on-chip memory may be one-time programmable fuses, or OTP fuses.
- The master key is never accessible to the Normal World.
- Secure on-chip RAM is available to the Secure World.
- Crypto hardware or flash controller has a secure-access-only register.

#### Flow
1. The filesystem key is stored in off-chip flash.
2. The filesystem key is encrypted using a device-unique master key.
3. The device-unique master key is stored permanently in secure on-chip memory.
4. The Normal World cannot access the master key.
5. To mount the filesystem, the Secure World loads the encrypted filesystem key into secure on-chip RAM.
6. The TEE uses the on-chip master key to decrypt the filesystem key inside the secure environment.
7. The plaintext filesystem key is programmed directly into a secure-access-only register in the crypto hardware or flash controller.
8. The crypto hardware or flash controller performs on-the-fly decryption for the Normal World.
9. The actual plaintext filesystem key is never exposed to Normal World software.

#### Security result
Even if the main OS is compromised, the filesystem key remains confidential because it never appears in Normal World memory or registers.

---

### 8.2 Example: biometric authentication

**Slide reference:** p. 20.

#### Scenario
A fingerprint sensor and its associated driver are used for biometric authentication.

#### Hardware configuration
- The fingerprint sensor peripheral is physically configured as Secure:


$$

\text{NS}=0

$$


- A specific DRAM region is allocated and configured by the memory controller as Secure.
- The Normal World OS, such as Android, and its drivers run with:


$$

\text{NS}=1

$$


- A trusted OS and trusted fingerprint application run in the Secure World with:


$$

\text{NS}=0

$$


#### Operation
1. The Normal World driver can initiate a fingerprint scan.
2. The Normal World driver cannot read raw fingerprint data from the sensor’s registers.
3. If it tries, it generates a transaction with:


$$

\text{NS}=1

$$


   to a Secure peripheral.
4. The hardware bus blocks that transaction.
5. The Secure sensor can only be programmed to DMA its data into Secure DRAM.
6. A DMA transfer to Normal World memory is blocked.
7. The Trusted Application in the Secure World processes the raw data in Secure DRAM.
8. It performs the matching algorithm.
9. It returns only a simple result to the Normal World:
   - success
   - fail

#### Security result
Sensitive biometric data never leaves the hardware-enforced Secure World boundary.

---

### 8.3 TrustZone “Backdoor” case study

**Slide reference:** p. 21.

#### Key lesson
TrustZone’s architecture can be strong while still being broken by a bad implementation. Hardware isolation depends on trusted software being correct.

#### Case from slides
A vulnerability was discovered in the TrustZone kernel, specifically Qualcomm QSEE. The vulnerability could be exploited by an attacker with only Normal World privileges.

#### Attack logic
1. Attacker has privileges only in the Normal World.
2. Attacker sends a malicious command to the TrustZone OS.
3. The command tricks the TrustZone OS into using its own Secure World privileges.
4. The TrustZone OS reads protected physical memory.
5. This includes memory regions reserved exclusively for the Secure World.
6. The secure data is passed back to the Normal World.
7. The isolation model is completely broken.

#### Important distinction
This was not a flaw in the ARM architecture itself. It was a flaw in a specific proprietary implementation of the Secure World OS.

#### Security lesson
A single bug inside the “trusted” environment can render all hardware protections useless.

---

## 9. The Law of Leaky Abstractions

### 9.1 Definition

**Slide reference:** p. 22.

#### Intuition
Systems expose simplified interfaces, but hidden implementation details often leak through. Security models often depend on abstractions being clean, but real hardware and software are messy.

#### Formal principle from slides
An abstraction is a simplified interface that hides underlying complexity. The **Law of Leaky Abstractions** states that all non-trivial abstractions, to some degree, leak details of their underlying implementation.

These leaks occur because the abstraction cannot, or for performance reasons does not, perfectly encapsulate every edge case or physical reality of the system it hides.

---

### 9.2 Why leaks cause vulnerabilities

#### Security model
Security often relies on guarantees provided by an abstraction.

Examples of security abstractions:

- User/kernel privilege separation.
- Virtual memory.
- Secure/Normal TrustZone worlds.
- Guest/host virtualization boundaries.
- Device abstractions through VirtIO.

#### Problem
When hidden details leak, they violate assumptions made by higher-level code. This creates unexpected behaviour and side effects that attackers can exploit.

#### Slide phrasing
The abstraction promises a simple, secure model, but the leak exposes a complex and insecure reality.

---

### 9.3 Leaky abstractions as the driving force for isolation

**Slide reference:** p. 23.

#### Key claim
The existence of privilege levels and criticality domains is an architectural acknowledgment of leaky abstractions.

Examples:

- Ring 0 / kernel vs Ring 3 / user.
- ARM TrustZone Secure World vs Normal World.

#### Ideal vs reality

##### Ideal: perfect abstraction
A system could be secured by a simple set of abstract rules. A privilege check would be an unbreakable logical barrier.

##### Reality: leaky abstraction
The logical barrier is implemented on complex physical reality, including:

- Shared caches.
- DRAM cells.
- Microcode.

These leak information and state, creating unintended side channels that bypass intended security rules.

#### Core purpose of isolation
Hardware-enforced isolation minimizes the **blast radius** of a leaky abstraction. It assumes the abstract boundary will fail and aims to contain the consequences.

---

## 10. Introduction to Computer Virtualization

### 10.1 Definition

**Slide reference:** p. 24.

#### Intuition
Virtualization lets one physical machine behave like multiple separate computers.

#### Formal definition from slides
Computer virtualization is a technology that creates a virtual, software-based representation of a computer system. It is achieved using a software layer called a **hypervisor**, which abstracts the physical hardware from the operating systems that run on it.

#### Purpose
Virtualization provides:

- Strong isolation.
- Improved efficiency.
- Flexibility.
- Concurrent execution of multiple independent operating systems on one physical machine.

#### Key terms
- **Host**: the physical machine.
- **Guest Operating System**: an OS running inside a virtual machine.
- **Hypervisor**: the software layer that manages and isolates guest systems.

---

## 11. Types of Virtualization

**Slide reference:** p. 25.

### 11.1 Type 1 hypervisor — bare-metal

#### Definition
A Type 1, or bare-metal, hypervisor runs directly on the host’s physical hardware and acts as the most privileged software layer.

#### Architectural position
It is the foundational software that directly controls the hardware.

#### Hardware access
It directly manages and uses the CPU’s hardware virtualization extensions.

#### Isolation model
Type 1 hypervisors provide strong, direct hardware-enforced isolation between guest virtual machines.

#### Security implication
The security boundary is small and well-defined: the hypervisor itself. A compromise in one guest is contained by the hypervisor and cannot directly affect other guests.

#### Example from slides: KVM
KVM is a Linux kernel module that transforms the Linux kernel itself into a Type 1 hypervisor. The kernel gains direct privileged control over hardware virtualization features to manage VMs.

---

### 11.2 Type 2 hypervisor — hosted

#### Definition
A Type 2, or hosted, hypervisor runs as a standard user-space application on top of a conventional host operating system.

#### Architectural position
It is a less-privileged application dependent on the underlying host OS.

#### Hardware access
It accesses CPU virtualization extensions indirectly by making API calls through the host OS kernel.

#### Isolation model
Isolation is indirect and software-mediated. Its security depends on the integrity of the larger and more complex host OS.

#### Security implication
If the host OS is compromised, the isolation boundary for all guest VMs running on it is broken.

#### Example from slides: VirtualBox
VirtualBox is an application that asks the host OS, such as Windows, macOS, or Linux, to access hardware extensions for it.

---

## 12. Virtualization Privilege Model

**Slide reference:** p. 26.

### 12.1 Why another privilege level is needed

Standard operating systems use a privilege model with at least:

- Ring 0 for the kernel.
- Ring 3 for applications.

To manage a guest OS, the hypervisor must operate at a higher privilege level than the guest kernel. Otherwise, the guest kernel would be the true master of the hardware.

---

### 12.2 Hardware virtualization modes

Hardware virtualization extensions such as Intel VT-x and AMD-V introduce distinct CPU modes.

#### Host mode / root mode
- Highly privileged mode.
- Conceptually called:


$$

\text{Ring } -1

$$


- The hypervisor runs in this mode.
- It has ultimate control over the physical hardware.

#### Guest mode / non-root mode
- Less privileged mode.
- The entire guest operating system runs in this mode.
- The guest’s Ring 0 kernel is no longer the true master of hardware.
- The guest kernel is subservient to the hypervisor.

---

### 12.3 VM Exit

#### Definition
A **VM Exit** is a hardware trap from guest mode to the hypervisor in host/root mode.

#### When it happens
A VM Exit occurs when a guest tries to:

- Execute a sensitive instruction.
- Access a protected resource.
- Perform an operation that must be mediated by the hypervisor.

#### Security role
VM Exits ensure that the hypervisor maintains control and isolation.

---

### 12.4 Negative rings model

The slide lists:

- Ring -3: Management Engine (ME).
- Ring -2: System Management Mode (SMM).
- Ring -1: Hypervisor.
- Ring 0: Kernel.
- Ring 1: Device drivers.
- Ring 2: Device drivers.
- Ring 3: User applications.

#### [UNCLEAR]
Later, slide p. 34 mentions “Ring -2 Attacks” and then names Intel Management Engine and AMD Platform Security Processor as running at higher privilege than anything on the CPU. Slide p. 26 places ME at Ring -3 and SMM at Ring -2. Safe revision wording: there are layers below or more privileged than the hypervisor, such as ME, PSP, and SMM, that can undermine hypervisor-based security assumptions.

---

## 13. Hardware Resources for Virtualization Isolation

**Slide reference:** pp. 27–29.

### 13.1 VMCS / VMCB on x86

#### Definition
The x86 **Virtual Machine Control Structure (VMCS)**, and AMD’s equivalent **VMCB**, are ISA-supported data structures in memory that store the architectural state of a guest VM.

They include state such as:

- CPU registers.
- Control registers.
- Interrupt status.
- Other architectural guest state.

#### Operation
When the hypervisor context-switches between VMs:

1. The CPU saves the state of the current guest to its VMCS/VMCB.
2. The CPU loads the state of the next guest from the next VMCS/VMCB.
3. Execution continues in the selected guest.

#### Security and performance role
VMCS/VMCB provide fast, secure, hardware-accelerated management of multiple isolated VM states.

---

### 13.2 ARM and RISC-V approach

The slides state that RISC ISAs such as ARM and RISC-V use software to save and restore VM state.

#### Key contrast
- x86: dedicated structures such as VMCS/VMCB.
- ARM/RISC-V: software save/restore for VM state.

Both use hardware to accelerate MMU manipulations.

---

### 13.3 Two-stage MMU

#### Definition
A **two-stage MMU** performs two levels of address translation:


$$

\text{Guest Virtual Address} \rightarrow \text{Guest Physical Address} \rightarrow \text{Host Physical Address}

$$


The slides also use:


$$

\text{GVA} \rightarrow \text{GPA} \rightarrow \text{HPA}

$$


and note that **GPA** is also known as **IPA**, or **Intermediate Physical Address**.

#### Intuition
The guest OS thinks it controls physical memory. The hypervisor must map the guest’s “physical” memory onto real machine memory. Two-stage translation lets hardware do this efficiently.

#### Security role
Two-stage translation isolates the memory of each VM from:

- Other VMs.
- The hypervisor.

#### Performance role
It avoids slow software-based shadow page tables and improves VM performance.

---

### 13.4 Software view of two-stage translation

**Slide reference:** p. 28.

#### Problem
In a virtualized environment, two software layers manage memory:

1. Guest OS.
2. Hypervisor.

A standard MMU supports only one translation stage:


$$

\text{Process Virtual Address} \rightarrow \text{Hardware Physical Address}

$$


This creates a performance problem for VMs.

#### Worked flow
1. A guest application generates a **Guest Virtual Address**:


$$

\text{GVA}

$$


2. The Guest OS translates it into what it believes is a physical address:


$$

\text{GVA} \rightarrow \text{GPA}

$$


3. The GPA is also called:


$$

\text{IPA}

$$


4. Without two-stage hardware support, access to the GPA would cause a VM Exit to the hypervisor.
5. The hypervisor would perform software translation:


$$

\text{GPA} \rightarrow \text{HPA}

$$


6. The final address is the **Host Physical Address**, the location in real physical RAM.

#### Full translation

$$

\boxed{\text{GVA} \rightarrow \text{GPA/IPA} \rightarrow \text{HPA}}

$$


---

### 13.5 Hardware identifiers for performance and security

**Slide reference:** p. 29.

#### ASID / VPID
**Address Space IDs (ASIDs)** and **Virtual Processor IDs (VPIDs)** are hardware tags used by the MMU’s Translation Lookaside Buffer.

#### Purpose
Each TLB entry is tagged with the ID of the VM it belongs to.

#### Benefit
The TLB can hold translations for:

- Hypervisor.
- VM 1.
- VM 2.
- Other VMs.

without mixing them up.

#### Performance result
The system avoids a costly full TLB flush on every context switch between VMs.

---

### 13.6 IOMMU domain IDs

#### Definition
In a system with an IOMMU, each device assigned to a VM is placed in a separate I/O protection domain.

#### Purpose
The IOMMU uses domain IDs to ensure that a device’s DMA requests can access only physical memory belonging to its assigned VM.

#### Security result
This provides hardware-enforced isolation for peripheral I/O.

---

## 14. Threats to Virtualization Isolation

### 14.1 VM escape

**Slide reference:** p. 30.

#### Definition
A **VM escape** occurs when an attacker inside a guest VM breaks out of the guest’s isolated environment and compromises the host or other guests.

#### Causes
Vulnerabilities may exist in:

- Hypervisor software.
- Underlying hardware.
- System configuration.

#### Key point
Virtualization provides a powerful isolation model, but its complexity creates a significant attack surface.

---

### 14.2 Formal verification of hypervisors

**Slide reference:** p. 31.

#### Definition
A formally verified hypervisor is one whose core properties, such as isolation, have been mathematically proven correct.

#### Intuition
Formal verification attempts to prove security properties rather than merely finding and patching bugs.

#### Method
It uses:

- Mathematical models.
- Theorem provers.
- Formal specifications.

#### Important limitation
“Bug-free” means bug-free **with respect to the formal specification**. If the specification omits a property, the proof does not cover it.

#### Example from slides
The gold-standard example is **seL4**, a formally verified microkernel that can be used as a hypervisor.

#### Why it matters
Most hypervisors have millions of lines of code, but a formally verified Trusted Computing Base (TCB) might have only a few thousand lines. This reduces the amount of trusted code that must be correct.

---

## 15. Guest OS “Hardware”

**Slide reference:** p. 32.

### 15.1 The hypervisor must virtualize I/O devices

The hypervisor does not only virtualize CPU and memory. It also needs to present peripheral I/O devices into the guest’s physical memory.

---

### 15.2 Device passthrough / pinned physical devices

#### Concept
Host physical devices can be “pinned” into the Guest Physical Address memory.

The slide references PCIe SR-IOV.

#### Consequence
Only that guest OS can access the interface of the pinned device.

#### Hardware virtualization of device interfaces
Some hardware devices can virtualize their own interface, so virtualized instances of the physical hardware device can be pinned to multiple guest VMs.

#### [UNCLEAR]
The slide says “multiple GVM”. This likely means multiple guest VMs.

#### [UNCLEAR]
The phrase “pinned into the Guest Physical Address Memory” likely means mapped into the guest physical address space.

---

### 15.3 Software-emulated device interfaces

#### Alternative
The hypervisor can create a software interface that represents a hardware device.

#### Security issue
This can be complex and has led to vulnerabilities.

#### Reason
Emulating hardware means the hypervisor must parse and respond to guest-controlled inputs, increasing attack surface.

---

### 15.4 Paravirtualized devices

#### Definition
Paravirtualized devices are devices where the hypervisor creates a more efficient and standardized interface to represent hardware devices.

#### Purpose
They reduce emulation overhead and improve performance.

---

## 16. VirtIO

**Slide reference:** p. 33.

### 16.1 Definition

**VirtIO** is a standardized device paravirtualization framework.

#### Intuition
Instead of pretending that the guest is talking to real physical hardware, the guest uses a special driver that knows it is running in a VM. It communicates efficiently with a host-side backend through shared memory queues.

---

### 16.2 VirtIO components

#### Frontend driver
Runs inside the guest OS.

Examples:

- `virtio-net` for networking.
- `virtio-blk` for storage.

Responsibilities:

- Prepare I/O requests.
- Place I/O requests into a shared memory queue.
- Avoid pretending to talk to real hardware.

#### Transport layer: virtqueues

**Virtqueues** are standardized, efficient, shared-memory ring buffers.

They are used by frontend and backend drivers to pass I/O requests and data back and forth with:

- Minimal overhead.
- Very few, if any, costly VM Exits.

#### Backend driver
Runs in the hypervisor or host.

Example:

- QEMU/KVM backend.

Responsibilities:

- Implement the “other side” of the device.
- Pull I/O requests from the shared memory queue.
- Submit them to the host physical device driver, or emulate the device.

---

### 16.3 VirtIO attack surface

**Slide reference:** p. 34.

#### Key security assumption
The guest OS and guest applications cannot be trusted by the host OS.

#### Later connection
The slide says later material will cover the reverse problem: the guest might not trust the host either.

#### Attack direction
Common virtualization attacks come from the guest against interfaces provided by the hypervisor. VirtIO is a significant attack surface because it collectively represents all devices.

#### Attack classes mentioned
- Classical memory safety issues:
  - Buffer overflows.
  - Use-after-free.
- Denial of service against other guests.
- Uninitialized memory:
  - The hypervisor reuses memory across devices and guests.
  - This can lead to information leaks.
- Abstractions below the hypervisor:
  - Ring -2 / lower-level attacks.
  - Intel Management Engine.
  - AMD Platform Security Processor.
- Side channels:
  - Speculation.
  - Power.
  - Cache.
  - I/O ports.

---

## 17. Protecting Guests from Untrusted Hosts

**Slide reference:** p. 35.

### 17.1 The three states of data

The slides divide data protection into three lifecycle states.

#### Data at rest
Data stored on a hard drive.

Example protection:

- Disk encryption.

#### Data in transit
Data moving across a network.

Example protection:

- TLS.

#### Data in use
Data currently being processed by CPU and memory.

This is the missing piece.

---

### 17.2 Why data in use is difficult

When an application performs a calculation:

- It loads data into memory.
- It loads data into the CPU.
- The data must be in decrypted plaintext form for computation.

In this state, data is visible to software with sufficient privilege on the machine.

---

### 17.3 Cloud VM threat scenario

Assume a calculation is running inside a guest application in a cloud VM.

Question from slide:

> How do you protect it against compromised or malicious infrastructure?

Potential attackers include:

- Hypervisor managing the VM.
- Host OS kernel.
- Privileged cloud administrator.
- Other tenants on the same machine if a vulnerability lets them cross the isolation boundary.
- A bug or malicious insider within the infrastructure provider’s stack.

#### Security problem
A bug or malicious actor in the infrastructure provider’s stack could compromise sensitive information while it is being processed.

---

## 18. Confidential Computing

### 18.1 Definition and goal

**Slide reference:** pp. 36–38.

#### Intuition
Confidential computing protects data while it is being used, even from privileged infrastructure such as the host OS, hypervisor, or cloud administrator.

#### Threat model from slides
Confidential computing is designed to protect against threats originating from a privileged attacker with full control of the host platform.

The primary assumption is:

- Guest application code and data are trusted.
- Cloud infrastructure is not trusted.

---

### 18.2 Implementations

**Slide reference:** p. 36.

#### AMD: SEV, SEV-ES, SEV-SNP

##### SEV — Secure Encrypted Virtualization
- Designed to protect an entire VM.
- Hardware encrypts the full memory of the VM.
- The encryption key is managed by an on-chip Secure Processor.
- The hypervisor can manage the VM.
- The hypervisor cannot read the VM memory.

##### Later generations
- **SEV-ES** adds protection for CPU register state.
- **SEV-SNP** adds cryptographic integrity protection against memory tampering.

---

#### Intel: SGX and TDX

##### SGX — Software Guard Extensions
- Allows an application to create a small isolated private memory region called an enclave.
- Only code inside the enclave can access enclave data in plaintext.
- Useful for protecting specific highly sensitive parts of an application.

##### TDX — Trust Domain Extensions
- Intel technology for protecting entire VMs.
- Creates an isolated VM called a Trust Domain.
- Memory is encrypted and protected from the hypervisor.

---

#### ARM: CCA / Realms

##### CCA — Confidential Compute Architecture
- Allows a hypervisor to create a special type of VM called a Realm.
- Realm memory and CPU state are isolated from the host hypervisor.
- A more privileged software layer called the Realm Management Monitor (RMM) manages Realm secrets.
- Hardware prevents the Normal World hypervisor from accessing Realm secrets.

---

### 18.3 Key functional blocks in confidential computing

**Slide reference:** p. 37.

#### On-chip secure co-processor

##### Definition
A physically isolated, dedicated processor on the CPU die.

Examples from slides:

- AMD Secure Processor (AMD-SP).
- Intel Secure Arbitration Module (SEAM).

##### Functions
- Acts as root of trust.
- Manages the secure environment lifecycle.
- Generates encryption keys.
- Protects encryption keys.
- Handles attestation.
- Runs highly privileged vendor-signed firmware.

---

#### Inline Memory Encryption Engine — MEE

##### Definition
A high-performance cryptographic engine integrated directly into the CPU memory controller.

##### Function
It automatically:

- Encrypts protected VM/enclave data written to DRAM.
- Decrypts protected VM/enclave data read back into CPU caches.

##### Properties
- Transparent to the running application.
- Provides protection with minimal performance overhead.

---

#### Remote attestation hardware

##### Definition
A hardware-based mechanism allowing the secure co-processor to generate a signed cryptographic report.

##### Purpose
The report acts as a certificate of authenticity.

##### What a remote user can verify
- Application is running on genuine hardware.
- TEE is properly configured.
- Application has not been tampered with by the cloud provider.
- Verification occurs before secrets are provisioned.

---

### 18.4 Confidential computing threat model

**Slide reference:** p. 38.

#### Protected against
Confidential computing protects against privileged attackers with full control of the host platform.

##### Malicious or compromised hypervisor / host OS
It protects guest VM memory from a hypervisor or host OS compromised by malware or another tenant.

##### Curious cloud administrators
It prevents a privileged administrator or engineer at the cloud provider from using host-level access to inspect a customer’s running processes, memory, or data.

##### Physical access attacks
By encrypting data in main memory, it protects against:

- Cold boot attacks.
- Hardware probes on the memory bus.

#### Important contrast with ordinary virtualization
Ordinary virtualization mainly protects the host from guests and guests from each other. Confidential computing adds the reverse goal:


$$

\text{protect guest from host}

$$


---

## 19. ARM Confidential Compute Architecture — CCA

### 19.1 Definition

**Slide reference:** p. 39.

ARM CCA is a comprehensive security architecture designed to change the trust model of virtualization. Its goal is to enable secure processing of sensitive data on untrusted infrastructure by removing the host hypervisor and OS from the guest VM’s Trusted Computing Base.

---

### 19.2 Key architectural components

#### Realms
A **Realm** is a confidential guest VM.

Properties:

- Runs in protected memory.
- Has protected CPU state.
- Is managed by the RMM.
- Is isolated from the host hypervisor.

---

#### Root World — EL3

##### Definition
The highest privilege level in the system.

##### Function
Runs Secure Monitor code.

##### In CCA
The Secure Monitor primarily acts as a router, directing requests between the different security worlds.

---

#### Realm Management Monitor — RMM

##### Definition
A new highly privileged, small, and verifiable software component that runs in a new architectural state.

##### Authority
The RMM is the only software with authority to:

- Create Realms.
- Manage Realms.
- Destroy Realms.

##### Security role
It is the core of the Realm TCB.

---

#### Granularity Protection Check — GPC

##### Definition
The hardware enforcement engine for memory isolation.

##### Function
It checks the security state of every transaction on the bus against the physical address tag of the target memory and blocks illegal access.

---

## 20. ARM’s Extended Security State Model

**Slide reference:** p. 40.

### 20.1 From two states to four states

TrustZone has a two-state model:

- Secure.
- Non-secure.

CCA evolves this into a four-state model.

---

### 20.2 Four CCA states

#### 1. Secure state
Used for the traditional TrustZone TEE.

Property:

- Remains isolated from all other states.

#### 2. Non-secure state
Used for the untrusted host OS and hypervisor, such as KVM.

#### 3. Realm state
Used for confidential guest VMs.

Property:

- The GPC blocks Non-secure access attempts to Realm memory.

#### 4. Root state
Used for the Secure Monitor.

Property:

- Most privileged state.
- Manages transitions between the other three states.

---

### 20.3 Hardware page tagging

Every physical memory page is tagged with one of the four states:


$$

\{\text{Root}, \text{Realm}, \text{Secure}, \text{Non-secure}\}

$$


The GPC enforces access rules between them.

---

## 21. Remote Attestation

**Slide reference:** p. 41.

### 21.1 Definition

#### Intuition
Remote attestation lets a remote user verify the code and hardware they are about to trust before sending secrets.

#### Slide flow
1. Before a Realm starts, the RMM creates a cryptographic measurement of the Realm’s initial image.
2. The measurement is a hash of components such as:
   - Kernel.
   - Bootloader.
   - Initial image.
3. The RMM uses a device-unique hardware key, called the Platform Key, to sign the measurement.
4. This creates an **Attestation Token**.
5. The token is sent to the remote user, who owns the data.
6. The user cryptographically verifies the token.
7. Verification gives a non-repudiable guarantee that the user is communicating with:
   - Genuine hardware.
   - An untampered Realm.
   - Authentic hardware.
8. Only after trust is established does the user provision secrets, such as:
   - Application code.
   - Data.
   - Keys.

#### Clean notation

$$

M = H(\text{Realm initial image})

$$



$$

\text{Token} = \text{Sign}_{\text{Platform Key}}(M)

$$


Remote verifier checks:


$$

\text{Verify}_{\text{Platform public key}}(\text{Token}, M)

$$


The exact cryptographic syntax is not given in the slides, but the measurement-sign-verify structure is.

---

## 22. Granularity Protection Check — GPC

**Slide reference:** p. 42.

### 22.1 Definition

The GPC is the enforcement mechanism for memory isolation within ARM CCA. It is a hardware unit that validates every transaction on the system bus and operates directly on physical addresses.

---

### 22.2 GPC metadata tags

Every physical memory page has a hardware metadata tag corresponding to one of:


$$

\text{Root}

$$



$$

\text{Realm}

$$



$$

\text{Secure}

$$



$$

\text{Non-secure}

$$


---

### 22.3 GPC access-check algorithm

For every memory access:

1. Identify the transaction originator:
   - CPU core.
   - DMA engine.
   - Other bus master.
2. Determine the originator’s security state:
   - Root.
   - Realm.
   - Secure.
   - Non-secure.
3. Identify the target physical page.
4. Read the target page’s hardware metadata tag.
5. Compare:


$$

\text{originator state}

$$


against:


$$

\text{target page state}

$$


6. If permitted by architecture policy:
   - Transaction proceeds.
7. If illegal:
   - GPC blocks the transaction.
   - Hardware fault is raised.

#### Example illegal access from slides

$$

\text{Non-secure originator} \rightarrow \text{Realm memory}

$$


This is illegal and blocked.

#### Security properties
The GPC provides architectural guarantees of:

- Integrity.
- Isolation.

---

## 23. Memory Encryption Engine — MEE

**Slide reference:** p. 43.

### 23.1 Definition

The MEE is an optional complementary hardware block that can be implemented within the memory controller.

#### Purpose
It provides confidentiality for data in external DRAM against physical attacks.

---

### 23.2 GPC vs MEE

The slides draw a clean distinction.

#### GPC
Enforces **who can access memory**.

Security properties:

- Isolation.
- Integrity.

#### MEE
Protects **the content of memory** from physical snooping.

Security property:

- Confidentiality.

---

### 23.3 Sequential operation of GPC and MEE

When both GPC and MEE are present, they operate sequentially and independently.

#### Algorithm
1. CPU or peripheral issues a memory transaction.
2. GPC performs an access-control check.
3. If the GPC blocks the transaction:
   - It never reaches the memory controller.
4. If the GPC permits the transaction:
   - The transaction proceeds to the memory controller.
5. The MEE performs its cryptographic operation:
   - Encrypts data written to DRAM.
   - Decrypts data read from DRAM.

#### Important ordering

$$

\text{Transaction} \rightarrow \text{GPC access check} \rightarrow \text{MEE encryption/decryption}

$$


The MEE does not decide whether access is allowed. The GPC does.

---

## 24. Managing I/O with an Untrusted Host in CCA

**Slide reference:** p. 44.

### 24.1 Problem

A Realm’s memory and CPU state are protected, but the Realm still relies on the untrusted host hypervisor to manage physical I/O devices.

#### Security challenge
How can a Realm perform I/O without allowing the host to inspect or tamper with Realm-private memory?

---

### 24.2 Solution: securely shared memory

CCA handles I/O through memory pages temporarily shared between the Realm and Host via the RMM.

#### Core guarantee
The RMM and GPC ensure that a shared page is accessible to only one world at a time.

#### Threat prevented
This prevents TOCTOU races:


$$

\text{Time-of-check} / \text{Time-of-use}

$$


The host cannot access memory while the Realm is processing I/O data.

---

### 24.3 Worked protocol: Realm sends data through host I/O

#### Step-by-step flow
1. **Realm prepares data**
   - Realm prepares packet data in a buffer.
   - The buffer is inside private Realm-state memory.

2. **Realm requests sharing**
   - Realm calls the RMM.
   - It requests that the specific memory page containing the buffer be shared with the Host.

3. **RMM checks request**
   - RMM performs security checks.

4. **RMM updates GPC state**
   - RMM instructs GPC hardware to transition the physical page state:


$$

\text{Realm} \rightarrow \text{Non-secure shared}

$$


5. **Atomic access change**
   - Realm loses all access rights to the page.
   - Host gains read-only access.

6. **RMM notifies Host**
   - Host is told the shared buffer is ready.

7. **Host performs I/O**
   - Host driver reads the packet data from the shared buffer.
   - Host instructs the physical network card to transmit it.
   - Host cannot write to the buffer, only read it.

8. **Host finishes**
   - Host notifies RMM that it is done.

9. **RMM reclaims page**
   - RMM transitions the page back:


$$

\text{Non-secure shared} \rightarrow \text{Realm}

$$


10. **Access rights reverse**
   - Host instantly loses all access.
   - Realm regains access.
   - Realm can safely reuse the buffer.

#### Security result
The host participates in I/O but does not gain uncontrolled access to Realm-private memory.

---

## 25. Lecture Summary

**Slide reference:** p. 45.

The lecture summary says the session covered:

- Other masters of memory, especially DMA.
- Why additional memory protection features are needed to protect and isolate DMA weaknesses.
- The key concept of leaky abstraction.
- Increasing levels of abstraction used to increase isolation.
- Warning: do not select a product only based on the features exposed by the software.

---

## 26. Wrap-up / course logistics

**Slide reference:** p. 46.

The final slide says:

- There is a Canvas quiz covering today’s lecture.
- It does not form part of the mark.
- It helps confirm understanding.
- Students are in the third week of Lab 4.
- Students should have compiled and executed all sample buggy software in both environments, for both C and C++ variants.
- Next week looks further up the hardware stack into system aspects.

---

## 27. Exam Flags and High-Value Revision Signals

### Explicit exam flags
No explicit “this will be on the exam” or “you should know this for the exam” statement appears in the slides provided.

**[TRANSCRIPT MISSING]** There may be spoken exam flags in the lecture recording or transcript that are not visible in the slides.

### Explicit quiz / coursework flags from slides
- Canvas quiz covers today’s lecture.
- The quiz is not marked, but checks understanding.
- Lab 4 status matters: compile and execute the sample buggy software in both environments, for both C and C++ variants.

### High-value revision concepts from slide emphasis
These are not explicit exam statements, but they are central to the lecture structure:

- DMA bypasses CPU protection.
- IOMMU translates IOVA to PA and enforces access control.
- DMA driver protocol:


$$

\text{map} \rightarrow \text{use} \rightarrow \text{unmap}

$$


- Forgetting to unmap is dangerous.
- IOMMU protection can itself introduce vulnerabilities.
- TrustZone splits the SoC into Secure and Normal worlds.
- NS-bit labels transactions.
- Secure Monitor and SMC mediate world switching.
- TrustZone security depends on correct Secure World implementation.
- Leaky abstractions motivate isolation.
- Type 1 vs Type 2 hypervisors.
- VM Exit and Ring -1 model.
- Two-stage address translation:


$$

\text{GVA} \rightarrow \text{GPA/IPA} \rightarrow \text{HPA}

$$


- VirtIO is an important attack surface.
- Confidential computing protects data in use.
- ARM CCA adds Realms, RMM, GPC, four security states, and remote attestation.
- Difference between GPC and MEE.

---

## 28. Connections Across the Lecture

### DMA → IOMMU
DMA creates the problem: devices can access physical memory directly. IOMMU is the protection mechanism that makes DMA safer.

### IOMMU → virtualization
IOMMU protection is required for safe device passthrough to guest VMs. Without it, a guest-controlled device could DMA into host or other guest memory.

### TrustZone → confidential computing
TrustZone begins with two worlds: Secure and Normal. ARM CCA extends this idea into a four-state model including Realm and Root states.

### Leaky abstractions → isolation
The lecture uses leaky abstraction as a unifying concept. Because abstractions leak, hardware-enforced isolation tries to contain damage.

### Virtualization → confidential computing
Traditional virtualization often protects the host from the guest. Confidential computing adds the reverse concern: protecting guest data from an untrusted host.

### Hypervisor attack surface → formal verification
Hypervisors are complex and security-critical, so formal verification is presented as a way to mathematically prove key isolation properties.

### VirtIO → guest-to-host attacks
VirtIO improves performance and standardization, but it creates guest-controlled interfaces into the hypervisor, making it an important attack surface.

---

## 29. Unclear Sections / Things to Check Against the Recording

- **[TRANSCRIPT MISSING]** The transcript was not included, so spoken explanations, lecturer emphasis, derivations, warnings, and exam hints could not be integrated.
- **Snapdragon diagram, p. 5:** diagram is dense and many labels are not fully legible in the rendered slide. The core message is that multiple subsystems access shared memory and DMA is system-wide.
- **IOMMU vulnerability slide, p. 11:** “security mode” likely means “security model”.
- **Negative rings, pp. 26 and 34:** p. 26 lists ME at Ring -3 and SMM at Ring -2, while p. 34 says “Ring -2 attacks” and mentions ME/PSP. Use the broader point: privileged components below or outside the hypervisor can leak or undermine isolation.
- **Guest OS hardware, p. 32:** “multiple GVM” likely means multiple guest VMs.
- **Guest Physical Address Memory, p. 32:** likely means guest physical address space.
- **TrustZone backdoor, p. 21:** slides give attack shape but not detailed exploit mechanics. Check recording if the lecturer discussed QSEE, KeyMaster, Widevine, or the diagram steps in more detail.
- **Remote attestation, p. 41:** slides give the measurement/signing concept but not a full protocol specification. Check transcript if the lecturer described endorser, relying party, verifier, or token verification in more detail.
- **CCA I/O shared memory, p. 44:** slides give the transmit packet-sharing flow. Check recording for whether read-only vs read-write sharing differs for receive vs transmit paths.

---

## 30. Condensed Revision Checklist

You should be able to explain:

1. Why DMA exists and why it is dangerous.
2. Why CPU privilege rings and paging do not stop DMA attacks.
3. How IOMMU translation works:


$$

\text{IOVA} \rightarrow \text{PA}

$$


4. What the IOTLB does.
5. The DMA driver protocol:


$$

\text{map} \rightarrow \text{use} \rightarrow \text{unmap}

$$


6. Why forgetting to unmap is dangerous.
7. How address bit restriction works.
8. Why 28 address lines gives 256 MB.
9. TrustZone’s Secure World vs Normal World.
10. Meaning of:


$$

\text{NS}=1

$$


and:


$$

\text{NS}=0

$$


11. How SMC causes a transition through EL3.
12. Why Secure Monitor simplicity matters.
13. How encrypted filesystem and biometric examples keep secrets out of Normal World.
14. Why TrustZone can still fail through buggy trusted software.
15. What the Law of Leaky Abstractions means.
16. Why isolation reduces blast radius.
17. Type 1 vs Type 2 hypervisors.
18. Ring -1 / host mode / guest mode.
19. What a VM Exit is.
20. What VMCS/VMCB store.
21. Two-stage MMU translation:


$$

\text{GVA} \rightarrow \text{GPA/IPA} \rightarrow \text{HPA}

$$


22. Why ASID/VPID avoid TLB flushes.
23. Why IOMMU domain IDs matter for device passthrough.
24. What VM escape means.
25. Why formal verification is attractive for hypervisors.
26. What VirtIO frontend, virtqueue, and backend mean.
27. Why VirtIO is an attack surface.
28. Why “data in use” is the hard case.
29. Differences between AMD SEV, Intel SGX/TDX, and ARM CCA at the level described in the slides.
30. What remote attestation proves.
31. What ARM Realms and the RMM are.
32. The four CCA states:


$$

\text{Root}, \text{Realm}, \text{Secure}, \text{Non-secure}

$$


33. What GPC enforces.
34. What MEE protects.
35. How CCA shares I/O buffers with an untrusted host without giving simultaneous access.

