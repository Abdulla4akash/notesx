---
subject: COMP60261
chapter: 4
title: "Lecture 4 - 5.6 Study Notes"
language: en
---

# COMP60261 - Lecture 4: Operating Systems Security (5.6)

**Sources used:** downloaded COMP60261 slide decks:

- `slides/17-storage-network/index.html`
- `slides/18-os-security-concepts-1/index.html`
- `slides/19-os-security-concepts-2/index.html`
- `slides/20-trusted-execution-environments/index.html`
- `slides/21-os-models-and-security/index.html`

All paths are relative to `C:\Users\abdul\Downloads\COMP60261-slides`.

**Transcript status:** no lecture transcript was provided. These notes are grounded in the slides and their local assets only.

**Topic and scope:** Chapter 4 covers storage and network stacks, operating-system security invariants, kernel hardening and bug detection, access-control models, trusted execution environments, and the security/performance trade-offs of different OS designs.

---

## 1. Chapter map

The five lectures connect through a single question: how can an operating system mediate access to complex hardware and shared resources without giving untrusted software excessive authority?

1. **Storage and network:** layered subsystems provide useful abstractions at a latency cost.
2. **OS security concepts:** isolation depends on explicit invariants, a realistic trust model, hardened interfaces, and bug detection.
3. **Access control:** DAC, MAC, and capabilities encode and enforce who may use which resources.
4. **Trusted Execution Environments:** hardware can protect a workload even when the host OS or hypervisor is untrusted.
5. **OS models:** monolithic kernels, microkernels, exokernels, and unikernels choose different points on the isolation/performance spectrum.

The recurring design tensions are:

- security versus performance;
- isolation versus communication;
- a small trusted computing base versus compatibility;
- flexible policy versus configuration complexity.

---

## 2. Storage and networking

A computer consists broadly of CPU, memory, and I/O. Storage provides persistence; networking provides communication. Both are managed through software stacks in which each layer hides lower-level detail.

Layering makes the system portable and manageable, but every layer adds work and therefore latency. High-performance systems sometimes use **kernel bypass**, allowing an application to access a disk or network interface more directly.

### 2.1 The storage stack

| Layer | Main responsibility |
|---|---|
| Application | Uses `open`, `read`, `write`, and `lseek` |
| Virtual File System (VFS) | Provides a common interface across filesystem types |
| Concrete filesystem | Defines the representation of files and metadata |
| Page cache | Caches file data in RAM |
| Block layer | Schedules and transforms requests to block devices |
| Device mapper, optional | Builds virtual block devices over physical devices |
| Low-level protocol | Communicates using interfaces such as USB, SCSI, NVMe, or SATA |
| Device driver | Controls a particular hardware device model |

The path is not identical for every filesystem. A network filesystem such as NFS sends work into the network stack, while a filesystem for embedded flash may use a memory-technology subsystem instead of the normal block layer.

### 2.2 Virtual File System

VFS lets applications use the same system calls regardless of whether a file resides on ext4, tmpfs, NFS, or another filesystem. It also allows several filesystems to appear in one directory tree and centralises common functionality such as caching.

This is an example of indirection: the application uses a stable interface, VFS selects an implementation, and the concrete filesystem interprets its own on-disk format.

Common filesystem classes include:

- disk filesystems for HDDs and SSDs;
- RAM filesystems such as `ramfs` and `tmpfs`;
- pseudo filesystems such as `/proc` and `/sys` that expose kernel state rather than stored file data;
- network filesystems such as NFS;
- filesystems for optical or embedded media.

### 2.3 Page cache, block layer, and device mapper

The **page cache** retains file data in otherwise unused RAM:

- recently read data can be returned without another device access;
- writes can be buffered, merged, and flushed later;
- short bursts of writes can be absorbed in memory.

Consequently, a successful `write()` does not necessarily mean the bytes have reached persistent storage. Software that requires durability needs an operation such as `fsync()`.

The **block layer** provides a common interface to block devices. It can queue, merge, split, and reorder I/O requests. A traditional hard disk benefits greatly from reordering because moving its physical head is expensive. A typical disk sector in the slides is **512 bytes**.

The optional **device mapper** creates virtual block devices and can provide:

- encryption, such as dm-crypt;
- logical volumes, such as LVM;
- compression and caching;
- aggregation or mirroring, such as RAID.

At the bottom, a driver issues commands to the device. Drivers account for **more than two-thirds of a kernel containing roughly 20 million lines of code**. This size and the prevalence of third-party drivers explain why drivers are both essential and a major part of the kernel attack surface.

### 2.4 VFS data structures

| Structure | Represents | Important contents |
|---|---|---|
| **Superblock** | One mounted filesystem | Filesystem type, mount state, quotas, devices, and filesystem-wide methods |
| **Inode** | One file or directory object | Size, owner, permission metadata, and object operations |
| **Dentry** | One name/location in the directory tree | Name and relationship used during pathname lookup |
| **File object** | One open instance | Open flags, current offset, and read/write/seek operations |

Important relationships:

- Two dentries may reference one inode. This is how a **hard link** gives one file multiple names.
- Opening the same file twice creates two file objects with independent offsets, while both refer to the same inode.
- A userspace file descriptor identifies an open file object in that process.

The distinction prevents a common misconception: the file's name, persistent metadata, and per-open state are not one object.

### 2.5 The network stack

| Layer | Main responsibility |
|---|---|
| Application/socket interface | Connects, sends, and receives through file-like system calls |
| Transport | Segmentation, reassembly, flow control, reliability, and ordering; for example TCP |
| Network | Addressing and routing; for example IP |
| Link | Communication on the local network, MAC addressing, and the NIC driver |

TCP is reliable, ordered, and connection-oriented. UDP offers a different transport contract. The socket interface deliberately resembles file I/O, connecting this lecture to the UNIX idea that many resources are exposed through file-like abstractions.

### 2.6 Storage/network exam summary

- Storage path: **VFS -> filesystem -> block layer -> driver**.
- Network path: **socket -> transport -> network -> link -> driver**.
- Layering improves abstraction and portability but increases latency.
- Kernel bypass trades OS mediation and abstraction for performance.
- Superblock is per mounted filesystem, inode is per file, dentry is per name, and file object is per open instance.

---

## 3. Operating-system security invariants

An OS enforces which **subjects** may perform which **operations** on which **objects**. The security goals remain confidentiality, integrity, and availability, while least privilege limits each subject to the authority it needs.

### 3.1 Process-level invariants

**Inter-process isolation:** one process cannot directly read, write, or execute another process's private state. Separate page tables provide each process with its own virtual address space.

**User/kernel isolation has two parts:**

1. A userspace process cannot directly access kernel memory. CPU privilege modes and page-table permission bits enforce this.
2. A userspace process can enter the kernel only through a controlled entry point, normally a system call.

Both clauses matter. Memory isolation without a controlled entry path would still allow untrusted control flow inside the kernel; a controlled path without memory isolation would leave kernel data exposed.

### 3.2 User-level invariants

- Only authenticated users should obtain system access.
- Users can configure how resources they own are shared.
- Only privileged users may perform security-critical administration, such as loading kernel code, mounting filesystems, or shutting down the machine.

Authentication establishes an identity. Authorisation then decides what that identity may do.

### 3.3 The traditional trust model

The basic model assumes:

- the complete kernel is trusted;
- users and applications are untrusted;
- hardware behaves correctly;
- the administrator is trusted and holds broad authority;
- firmware, bootloader, and boot process are trusted.

The slides challenge every major assumption:

| Assumption | Why it can fail |
|---|---|
| Firmware and boot are trusted | They contain bugs and may be corrupted or replaced |
| Kernel is correct | Kernels and third-party drivers contain vulnerabilities |
| Hardware is correct | Hardware has vulnerabilities such as Spectre and Meltdown |
| Administrator or owner is trusted | Cloud and remote-computation scenarios may explicitly distrust the machine owner |

Each failed assumption motivates a defence: secure/measured boot, kernel hardening, hardware security work, and TEEs respectively.

### 3.4 The system-call attack surface

The main interface from userspace into the kernel is the system-call interface. It is large, stateful, and difficult to secure. A successful kernel exploit may let an attacker:

- read or alter kernel memory;
- access another process's memory;
- escalate privileges;
- execute code in kernel context or install a rootkit;
- crash or deny service to the system.

The kernel must treat system-call numbers, scalar arguments, pointer arguments, pointed-to objects, resource identifiers, and call sequences as untrusted.

Inputs may include null or invalid pointers, inconsistent lengths, inaccessible files, malformed structures, or operations invoked in the wrong state.

### 3.5 TOCTTOU and double fetch

Checking a userspace pointer in place is unsafe because another userspace thread can modify the referenced memory after validation but before use. This is a **time-of-check to time-of-use (TOCTTOU)** vulnerability, also called a **double fetch** in this context.

The required pattern is:

1. Copy referenced data from userspace into kernel-owned memory.
2. Validate the private copy.
3. Use that same copy.

Linux provides helpers such as:

```c
unsigned long __copy_from_user(
    void *to,
    const void __user *from,
    unsigned long n
);

unsigned long __copy_to_user(
    void __user *to,
    const void *from,
    unsigned long n
);
```

Copying works because userspace cannot modify the kernel's private copy between the check and use. Copying and then re-reading the original pointer would reintroduce the race.

### 3.6 Kernel vulnerability classes

A study cited in the slides examined **141 kernel vulnerabilities from 2010**. The classes include:

- missing pointer checks;
- missing permission checks;
- buffer and integer overflows;
- uninitialised data;
- memory leaks, use-after-free, and double free;
- null dereferences, divide-by-zero errors, infinite loops, races, and deadlocks.

Missing checks are important because kernel security failures are not limited to C memory safety. The kernel is a privileged mediator, so forgetting an authorisation or pointer check is itself a critical vulnerability.

---

## 4. Kernel hardening and bug detection

No single mitigation makes a large kernel safe. Runtime defences reduce exploitability, while dynamic and static analysis aim to find bugs before attackers do.

### 4.1 Memory permissions and attack-surface reduction

- Executable kernel code and read-only data should not be writable.
- Function pointers and sensitive variables should be protected from writes.
- **SMEP** prevents supervisor-mode execution of userspace memory.
- **SMAP** prevents supervisor-mode reads and writes to userspace memory, except when the kernel temporarily enables legitimate copying.

SMEP and SMAP impede **ret2usr**, where an attacker redirects kernel execution to code in userspace. A named bypass is **ret2dir**: attacker-influenced physical pages may also be reachable through the kernel's direct physical-memory mapping.

The general lesson is that a defence protects a particular boundary and must be evaluated against alternative paths to the same underlying data.

### 4.2 System-call filtering

Linux **seccomp** can restrict which system calls an application invokes. It is used in environments including containers, Android, and sandboxed application systems.

A whitelist can minimise attack surface, but deriving a precise list is difficult:

- too broad a list leaves unnecessary kernel interfaces exposed;
- too narrow a list breaks legitimate execution;
- required calls may depend on configuration and runtime paths.

Deriving accurate per-application filters is therefore an open policy-analysis problem, not just a matter of enabling a kernel feature.

### 4.3 Probabilistic defences

**Kernel stack canaries** detect some overwrites before a function returns. The weakness highlighted in the slides is that one value is used per CPU for its stack frames, so a stack over-read may disclose a reusable value.

**Kernel Address Space Layout Randomisation (KASLR)** shifts kernel regions. Its coarse granularity means one leaked kernel pointer may reveal the offset for the whole area.

Neither defence is a panacea. Both rely on secrets that information leaks can expose.

### 4.4 Memory integrity and information-leak prevention

Memory-integrity measures include:

- shadow stacks for protecting return addresses;
- unmapped guard pages around stacks;
- sanity checks on heap free lists;
- traps for integer overflow in counters and sizes.

Information-leak prevention includes:

- do not expose kernel pointers to userspace;
- fully initialise structures and padding before copying them out;
- restrict logs and files containing addresses;
- use counters or opaque handles rather than addresses as resource identifiers;
- zero or poison released memory, accepting the performance cost.

The rule **do not use an address as an identifier** is especially useful: an address-based handle defeats KASLR by design.

### 4.5 Dynamic analysis

| Technique | Purpose |
|---|---|
| KASAN | Detect invalid memory accesses |
| KUBSAN | Detect undefined behaviour |
| Leak and race sanitisers | Detect resource leaks and concurrency errors |
| Lockdep | Detect deadlocks, double locking, and lock-order inversions |
| ftrace, perf, eBPF | Trace and instrument runtime behaviour |
| Syzkaller | Fuzz the system-call interface |

Syzkaller runs the kernel under test in a VM controlled from a host, because generated tests may crash it. It creates short programs containing several related system calls rather than only random isolated calls.

**Syzlang** describes argument types and data flow between calls. For example, it can express that `open()` produces a file descriptor consumed by `read()`, and that one parameter specifies another parameter's length. This grammar makes generated sequences far more useful than random bytes.

**Syzbot** operates continuous fuzzing using **25 Syzkaller instances and approximately 150-200 VMs**. The slides also note a major triage cost: roughly **two-thirds of its reports are invalid**.

The **Linux Test Project** complements fuzzing with thousands of tests covering system calls, POSIX behaviour, filesystems, networking, memory management, and known CVEs.

### 4.6 Static analysis

- **Coccinelle** and **Smatch** identify bug patterns, such as an allocation lacking a corresponding free.
- **Sparse** performs control/data-flow checks and uses annotations such as `__user` for userspace pointers and `__acquires` for lock-state contracts.
- Symbolic execution, compiler analysis, and verification can check deeper properties.

The central limitation is scale. A kernel of more than 20 million lines creates state explosion and complex cross-subsystem behaviour.

---

## 5. Access control

UNIX exposes many resources through file-like interfaces, so file ownership and permissions form a large part of the OS security model. Linux is multi-user: users distrust one another, while the administrator also distrusts ordinary users.

### 5.1 Access-control matrix

Lampson's access-control matrix represents:

- **subjects:** users or processes requesting operations;
- **objects:** files and other protected resources;
- **permissions:** allowed operations such as read, write, or execute.

DAC, MAC, and capability systems are different ways to represent and enforce the relationships captured by this matrix.

### 5.2 UNIX identity and file permissions

A process has a **user ID (UID)** and **group ID (GID)**, normally inherited from the user who starts it. Each file also records an owner UID, group GID, and permission bits.

Useful inspection commands include:

```bash
ps -o pid,user,group,uid,gid,comm -p <pid>
ls -ln <file>
```

For example:

```text
-rwxr-xr-x 1 0 0 151152 Sep 20 2022 /usr/bin/cp
```

The first character identifies the file type. The next nine characters are read, write, and execute permissions for owner, group, and others. The remaining fields include hard-link count, owner UID, owner GID, size, timestamp, and path.

Userspace tools such as `chmod` and `chown` configure permissions, but the kernel performs the authorisation check on operations such as `open`, `read`, and `write`.

Some programs need privilege while remaining callable by normal users. For example, `passwd` must update `/etc/shadow`. A **setuid** executable can run with its owner's effective identity rather than the caller's identity.

### 5.3 Discretionary Access Control

Under **Discretionary Access Control (DAC)**, resource owners may change permissions on objects they own.

DAC depends on correct behaviour by users and their software. It fails when:

1. a user accidentally grants excessive access, such as exposing a private key;
2. a compromised process deliberately changes permissions using the user's authority.

The second case is fundamental: a process outside the trusted computing base can weaken the policy. This motivates a system whose guarantees survive malicious software outside the TCB.

### 5.4 Mandatory Access Control

Under **Mandatory Access Control (MAC)**, only trusted administrators or trusted policy-management software may change the security configuration.

- Subjects and objects receive security labels.
- Rules define how labelled subjects may interact with labelled objects.
- Ordinary processes cannot change their labels to escape restrictions.
- Labels are assigned at creation and can be changed only through trusted mechanisms.

MAC complements rather than replaces DAC. An operation must pass both forms of checking.

### 5.5 SELinux

SELinux implements MAC for Linux. Processes and resources receive contexts containing types, such as:

- `httpd_t` for a web-server process;
- `httpd_sys_content_t` for web content;
- `http_port_t` for web-server ports.

Trusted administrators define rules specifying permitted interactions. **No rule means deny by default.** Traditional file permissions are checked first; SELinux checks are then applied.

Benefits:

- strict, fine-grained least privilege;
- compromise of one service does not automatically expose all resources accessible to the same UNIX user;
- broad availability and use in compliance-sensitive systems.

Costs:

- policy configuration and troubleshooting are complex;
- an incomplete or outdated policy can block legitimate operations.

### 5.6 Linux Security Modules

The policy/mechanism distinction is central:

- **SELinux defines policy.**
- **Linux Security Modules (LSM) supplies kernel mechanisms** that SELinux, AppArmor, Smack, TOMOYO, and other systems use.

LSM places hooks immediately before security-sensitive kernel operations. A module may permit, deny, or log an action. Kernel objects contain an opaque `void *security` field for module-specific metadata.

A simplified file-open sequence is:

1. Begin processing the system call.
2. Resolve the file's inode.
3. Perform basic error checks.
4. Perform DAC checks.
5. Invoke the LSM hook for the MAC/security-module decision.
6. Proceed only if every required check allows the operation.

### 5.7 The confused deputy

A **confused deputy** is a privileged program tricked into using its authority on behalf of a less-privileged caller.

The slides use a compiler service:

- Users ask a compiler to read source and write executable/debug output files.
- The compiler also needs authority to update `/sysx/language-stats.txt`.
- The same protected directory contains `billing.txt`.
- A malicious user supplies `billing.txt` as the requested debug-output pathname.
- The compiler overwrites it using the compiler's own authority.

An access-control list cannot easily solve this because the compiler genuinely needs to write the statistics file. The vulnerability arises because the **caller chooses the resource name while the deputy contributes the authority**. Designation and permission are separate.

### 5.8 Capability systems

A **capability** is an unforgeable token combining:

- designation of a resource; and
- permission to operate on that resource.

If a process holds no capability naming an object, it cannot access that object. Capabilities can be copied and passed to another security domain, but not forged or expanded.

A capability system can begin with the OS holding all capabilities. The OS gives a subset to `init`; each parent then gives subsets to its children. Authority therefore narrows down the process tree.

In the compiler example, the shell gives the compiler capabilities only for the source and requested outputs. The compiler receives a separate capability for the statistics file directly from the kernel. It never receives a capability for `billing.txt`, so the attack cannot be expressed even if the user supplies that pathname.

Capabilities solve the confused-deputy structure by binding the requested object to the authority used to access it.

---

## 6. Trusted Execution Environments

Traditional cloud computing assumes tenants trust the provider's hardware, host OS, and hypervisor. A TEE changes this assumption:

> The tenant does not trust the cloud provider or privileged host software.

### 6.1 Definition and threat model

A **Trusted Execution Environment (TEE)** is a hardware-enforced isolated execution context resistant to disclosure and tampering by the host OS or hypervisor.

It aims to provide:

- **confidentiality:** host software cannot read protected code or data;
- **integrity:** host software cannot alter protected code or data.

**Availability is out of scope.** A malicious provider can refuse to schedule the workload or shut down the machine.

The attacker may control all software outside the TEE, including the OS and hypervisor, and may control I/O devices. The TEE therefore protects a process from its OS or a VM from its hypervisor.

### 6.2 Four characteristics

1. **Isolation:** normal execution cannot read or write TEE memory.
2. **Controlled interaction:** the TEE uses narrow interfaces to request host services.
3. **Secure storage:** sensitive persistent data is encrypted with keys that remain protected.
4. **Attestation:** a remote party can verify the hardware and the software measurement.

Controlled interaction is a recurring weakness. A TEE still requires disk, network, scheduling, or other host services, but the host is now untrusted. Every exit and returned value must be treated as adversarial.

### 6.3 Uses

- confidential cloud computation;
- cryptographic-key and password vaults;
- cryptocurrency wallets and biometric storage;
- digital-rights management;
- confidential ML or healthcare workloads.

### 6.4 Intel SGX

Intel SGX protects an **enclave containing part of an application**.

- The processor executes either inside or outside the enclave.
- Enclave memory is encrypted in DRAM and is inaccessible to outside software.
- System calls require enclave exits and later re-entry.
- Transitions are slow and expose an interface to the untrusted OS.
- Frameworks may include a small OS inside the enclave to handle some calls internally, but disk and network I/O still need the host.

SGX offers fine granularity and potentially a small TCB, but applications need adaptation and must secure their enclave boundary.

### 6.5 AMD SEV

AMD Secure Encrypted Virtualisation protects an **entire virtual machine**.

- VM memory is encrypted against the host.
- Existing applications can run without enclave-specific porting.
- The TCB includes the application and complete guest OS.
- The main host interface is virtual hardware, which is large and difficult to secure.

SEV favours compatibility at the cost of a larger protected computing base.

### 6.6 ARM TrustZone

ARM TrustZone separates execution into **normal world** and **secure world**.

- Privilege levels exist independently in both worlds.
- Hardware blocks normal-world access to secure-world memory.
- Unlike SGX and SEV, the model in the slides does **not encrypt memory**.
- A small secure-world OS runs trusted applications invoked by normal-world software.

A representative use is fingerprint verification: normal-world Android requests an operation, while biometric material remains in the secure world even if the normal OS is compromised.

### 6.7 TEE comparison

| Property | Intel SGX | AMD SEV | ARM TrustZone |
|---|---|---|---|
| Protected unit | Application enclave | Whole VM | System-wide secure world |
| Memory encryption | Yes | Yes | No |
| Application changes | Required | Usually none | Trusted app targets secure world |
| TCB | Enclave code and support runtime | Application plus guest OS | Secure OS and trusted apps |
| Difficult interface | Enclave exits/system calls | Virtual hardware | Normal/secure-world calls |

Granularity explains the trade-off: SGX can keep the TCB smaller but requires porting and frequent transitions; SEV offers compatibility but protects a much larger software stack.

### 6.8 Remote attestation

A remote client needs evidence that:

1. the workload runs on the expected genuine hardware;
2. the software loaded into the protected environment has the expected measurement.

Remote attestation sends a cryptographically protected measurement, generally based on hashes of the relevant hardware/software state. For SGX, Intel can additionally provide an attestation service for validating the platform evidence.

Attestation proves identity and initial state; it does not itself guarantee availability or remove vulnerabilities from the attested code.

---

## 7. OS models and security

An OS design model specifies how kernel functions are organised. Moving functionality across protection boundaries changes both security and performance.

### 7.1 Monolithic kernel

A monolithic kernel places most OS functionality in one privileged kernel:

- kernel subsystems share one large trust domain;
- privilege levels isolate applications from the kernel;
- page tables isolate applications from one another;
- internal kernel calls are fast because they do not cross protection domains.

This provides **medium isolation and good performance**. A vulnerability in a driver or other kernel subsystem can compromise the entire kernel because there is little internal isolation.

Examples include Linux, FreeBSD, NetBSD, and OpenBSD.

### 7.2 Microkernel

A microkernel keeps only core operations privileged, such as scheduling, process and memory management, and inter-process communication. Filesystems, drivers, and other services run as separate userspace servers.

Security benefit:

- compromise or failure of one server is contained in its address space;
- the privileged TCB is smaller;
- services can potentially restart independently.

Performance cost:

- applications and services communicate through IPC;
- calls require system calls, context switches, and sometimes data copies;
- frequent security-domain crossings add latency.

Examples include MINIX 3 and L4. seL4 also demonstrates the assurance benefit of formal verification.

### 7.3 Exokernel

An exokernel retains a minimal privileged layer that securely multiplexes hardware. Higher-level OS services live in application-specific **library operating systems (libOSes)**.

Applications can specialise their libOS for performance because the exokernel exposes lower-level resource interfaces. The exokernel must still isolate mutually untrusted libOSes while distributing hardware safely.

### 7.4 Unikernel

A unikernel compiles an application together with a libOS and runs the result in its own VM. The hypervisor plays a role similar to the exokernel.

Advantages:

- separate VMs strongly isolate unikernel instances from one another;
- many operations that would be system calls become ordinary function calls;
- the application/libOS combination can be specialised.

Limitation:

- there is no internal protection boundary between the application and its libOS;
- compromising the application may expose the whole unikernel instance.

In this chapter's design space, unikernels trade internal isolation for performance. They have strong external VM isolation but absent application/kernel isolation inside each instance.

### 7.5 Model comparison

| Model | Isolation | Performance | Main trade-off |
|---|---|---|---|
| Monolithic | App/kernel and inter-process boundaries; little intra-kernel isolation | Good | Middle ground |
| Microkernel | Services isolated in separate address spaces | Lower due to IPC crossings | More isolation for less performance |
| Exokernel | Minimal privileged multiplexing of separate libOSes | Specialisable | Low-level control with application responsibility |
| Unikernel | Strong between VMs, none inside application/libOS instance | High | Internal isolation sacrificed for fast calls |

---

## 8. How the chapter fits together

The storage and network lecture explains why kernels are large: they mediate layered, device-specific subsystems. The security lecture then shows why this large privileged codebase is difficult to trust. Access-control mechanisms constrain users and services, but they depend on correct kernel enforcement. TEEs change the boundary again by moving the host OS and hypervisor outside the workload's TCB. Finally, OS models explore whether kernel services themselves should share one trust domain.

Several ideas recur across the chapter:

- A boundary needs a controlled interface: system calls, LSM hooks, TEE exits, IPC, and hypercalls are all security-sensitive interfaces.
- A smaller TCB generally improves assurance but may reduce compatibility or performance.
- Copying and domain transitions improve isolation but add latency.
- Policy and mechanism are different: SELinux specifies rules; LSM exposes enforcement hooks.
- Attackers seek alternate paths around a defence, such as ret2dir around ret2usr protections.

---

## 9. Exam-focused facts

### 9.1 High-value comparisons

| Question | Answer |
|---|---|
| What are the two process-level invariants? | Inter-process isolation and user/kernel isolation |
| What are the two parts of user/kernel isolation? | No direct kernel-memory access and entry only at controlled points |
| What is the main userspace/kernel attack surface? | The system-call interface |
| How is a double fetch prevented? | Copy once into kernel memory, validate and use that copy |
| What do SMEP and SMAP address? | Supervisor execution/access involving userspace memory |
| What is the named alternative path? | ret2dir through the kernel physical-memory mapping |
| Why is precise seccomp policy hard? | Too broad is insecure; too narrow breaks applications |
| What is DAC's central weakness? | It relies on correct behaviour by users and their software |
| Does MAC replace DAC? | No; both checks apply, with DAC checked first in the shown flow |
| SELinux versus LSM? | SELinux is policy; LSM provides kernel enforcement mechanisms |
| What causes the confused deputy? | Caller supplies designation while deputy supplies authority |
| What does a capability combine? | Resource designation and permission |
| What does a TEE protect against? | A hostile host OS or hypervisor, for confidentiality and integrity |
| Does a TEE guarantee availability? | No |
| Which TEE lacks memory encryption in the slides? | ARM TrustZone |
| Why is a microkernel slower? | IPC and security-domain crossings |
| Why is a unikernel fast? | Application/libOS calls need no internal user/kernel transition |

### 9.2 Quantitative and named facts

| Fact | Value |
|---|---:|
| Driver share of the kernel | More than two-thirds of about 20M lines |
| Typical disk sector in the slides | 512 bytes |
| Kernel vulnerability study | 141 vulnerabilities in 2010 |
| Syzbot scale | 25 instances, about 150-200 VMs |
| Approximate invalid Syzbot reports | Two-thirds |
| Kernel stack-canary granularity | One value per CPU |
| KASLR limitation | One coarse offset; one pointer leak may reveal it |

### 9.3 Common mistakes

- Giving only the memory half of user/kernel isolation and omitting controlled entry points.
- Validating a userspace object and then reading it again instead of using a private copy.
- Treating all kernel bugs as memory-safety bugs and forgetting missing authorisation checks.
- Saying MAC replaces UNIX permissions rather than complementing them.
- Confusing SELinux policy with the LSM enforcement framework.
- Describing a capability as only a permission; it also designates the resource.
- Claiming TEEs protect availability against the host.
- Saying TrustZone encrypts memory in the model presented by these slides.
- Claiming unikernels are uniformly more secure without noting their absent internal boundary.
- Comparing OS designs only by speed without discussing TCB size and isolation.

### 9.4 Revision checklist

- [ ] Name the storage and network stacks in order.
- [ ] Distinguish superblock, inode, dentry, and file object.
- [ ] Explain why layering costs latency and why kernel bypass is used.
- [ ] State both process-level invariants and both parts of user/kernel isolation.
- [ ] Explain why the basic trust model does not match reality.
- [ ] Describe the syscall interface as a trust boundary.
- [ ] Define TOCTTOU/double fetch and its copy-then-check solution.
- [ ] Compare SMEP, SMAP, ret2usr, and ret2dir.
- [ ] Explain seccomp policy precision and the limitations of canaries/KASLR.
- [ ] Compare dynamic and static kernel bug detection.
- [ ] Explain UID, GID, permissions, and setuid.
- [ ] Compare DAC and MAC.
- [ ] Explain SELinux contexts, deny-by-default rules, and LSM hooks.
- [ ] Reproduce the compiler confused-deputy example.
- [ ] Define an unforgeable capability and explain capability subsetting.
- [ ] Define a TEE and its confidentiality/integrity threat model.
- [ ] Compare SGX, SEV, and TrustZone by granularity, encryption, and TCB.
- [ ] Explain remote attestation.
- [ ] Compare monolithic, microkernel, exokernel, and unikernel designs.

---

## 10. Compact answer framework

For a long-form question about OS security:

1. Identify the **asset, subject, attacker, and trust boundary**.
2. State the required **security invariant**.
3. Describe the enforcing **mechanism** and its privileged TCB.
4. Explain the **interface** through which legitimate interaction occurs.
5. Identify validation, concurrency, confused-deputy, or information-leak risks.
6. Discuss known **limitations or bypasses**.
7. Evaluate the trade-off among **security, performance, compatibility, and complexity**.

This structure applies to system calls, access control, TEEs, and OS architecture, tying together all five Chapter 4 slide decks.
