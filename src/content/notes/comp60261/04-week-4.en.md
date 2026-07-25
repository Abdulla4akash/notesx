---
subject: COMP60261
chapter: 4
title: "Week 4"
language: en
---

# COMP60261 — Week 4: Operating Systems, Part 2

**Scope:** the storage and network stacks, then the security material proper — OS security invariants and kernel hardening, access control models, trusted execution environments, and how kernel design shapes security.

**Covers lectures:** 17 OS Storage and Network · 18 OS Security Concepts 1 · 19 OS Security Concepts 2 · 20 Trusted Execution Environments · 21 OS Models and Security

---

## 1. Storage and network

Both stacks are layered, and in both cases the layering is what creates the security-relevant interfaces.

### 1.1 Storage

From the top down:

- **File systems** (ext4, XFS, Btrfs) — provide the file and directory abstraction over a flat array of blocks, and store metadata including ownership and permission bits. The **VFS** layer sits above them so that syscalls work uniformly across filesystem types.
- **Page cache** — caches file data in RAM. Reads are served from memory where possible; writes are buffered and flushed later. This is why `write()` returning does not mean data is on disk (hence `fsync`), and the caching is measurable, which makes it a **side channel** for inferring what other users have accessed.
- **Device mapper** — a layer for composing virtual block devices from physical ones: LVM, RAID, snapshots, and **dm-crypt** for full-disk encryption. Encryption here protects data at rest against physical access, and removes the disk from the confidentiality TCB.
- **The block layer** — queues, merges, and reorders requests, handling I/O scheduling.
- **Low-level drivers** — speak the actual device protocol (NVMe, AHCI/SATA, SCSI).

### 1.2 Networking

- **The network stack** implements the protocol layers — sockets API, then transport (TCP/UDP), then network (IP), then link (Ethernet) — plus routing and filtering (netfilter/iptables/nftables, eBPF/XDP).
- Packets arrive by **interrupt**, are processed in kernel context (with softirqs deferring the bulk of the work), and are delivered to a socket buffer for the owning process.

**Security significance:** the network stack parses fully attacker-controlled input **in the kernel**, at the highest privilege, without the attacker needing any local access at all. That makes it one of the most valuable attack surfaces in the system, and explains the heavy fuzzing and hardening effort directed at it.

---

## 2. OS security concepts, part 1: invariants and kernel hardening

### 2.1 The basic trust model

Userspace must trust the kernel entirely; the kernel trusts no userspace process. The kernel is therefore in every process's TCB, and its correctness is load-bearing for the whole system.

### 2.2 Security invariants the OS must maintain

**Process-level:**

- A process cannot read or write another process's memory without explicit, mediated permission (`ptrace`, shared memory, `/proc/<pid>/mem` — all access-controlled).
- A process cannot access kernel memory.
- A process cannot escalate its own privileges except through sanctioned paths (setuid execution, capability grants).
- A process cannot exhaust resources to the point of denying service to others (rlimits, cgroups).

**User-level:**

- Users cannot access each other's files except as permitted by the file's ownership and mode.
- Users cannot interfere with each other's processes (signalling and `ptrace` are restricted to matching UIDs, or root).
- Authentication must be required to assume a user identity, and privileged operations restricted to authorised identities.

Both sets rest on hardware (privilege modes, MMU) plus correct kernel enforcement. **Every kernel vulnerability is a potential violation of all of them at once.**

### 2.3 Apps/kernel isolation

Enforced by the user/supervisor page-table bit and the privilege-mode distinction, with the syscall interface as the single sanctioned crossing point. Hardware features harden the boundary further — SMEP prevents the kernel executing userspace pages, SMAP prevents it accidentally accessing userspace data, and KPTI separates the page tables entirely.

### 2.4 Kernel vulnerabilities

The kernel is a large C codebase running with full privilege, so it suffers the whole Week 2 catalogue — buffer overflows, use-after-free, integer overflows, uninitialised memory — plus classes specific to its position:

- **Missing or incorrect validation of syscall arguments**, especially user-supplied pointers and lengths.
- **TOCTOU races** — a check followed by a use, where the state changes in between. Concurrency makes these plentiful, and the classic file-based instance is checking a path with `access()` then opening it, while an attacker swaps in a symlink.
- **Infoleaks** — copying kernel memory to userspace, including uninitialised struct padding, which leaks pointers and defeats kernel ASLR.
- **Confused deputy** situations where the kernel acts on a process's behalf with more authority than the process has.

The consequence of a kernel bug is typically **local privilege escalation** to full root/kernel control.

### 2.5 Reducing and hardening the attack surface

**Attack surface reduction** — compile out unused subsystems and drivers; don't load unnecessary modules; restrict access to powerful interfaces.

**Hardening the syscall interface** — restrict which syscalls a process may make at all. **seccomp-BPF** installs a filter that the kernel evaluates per syscall, allowing, denying, or killing. Since most programs need only a small subset, this dramatically shrinks reachable kernel code. It is the primary sandboxing primitive for containers and browsers.

**Runtime defences in the kernel** — the userspace defences from Week 2 apply here too: KASLR, stack canaries, NX, plus kernel-specific measures such as read-only after init for constant data, hardened usercopy checks, freelist pointer obfuscation in SLUB, and **CFI** in the kernel.

**Memory integrity** — hardware and hypervisor mechanisms to protect kernel code and critical data even against a compromised kernel (e.g. hypervisor-enforced code integrity, IOMMU protection against malicious DMA).

**Bug detection at kernel scale** — static analysis (Coccinelle, Smatch, sparse), dynamic analysis with kernel sanitizers (KASAN for memory errors, KMSAN for uninitialised reads, KCSAN for data races), continuous fuzzing of the syscall interface (**syzkaller**, which generates syscall sequences and has found thousands of bugs), and functional test suites such as the **Linux Test Project**.

---

## 3. OS security concepts, part 2: access control

Once isolation exists, the question becomes *who may do what* — authorisation.

### 3.1 Discretionary Access Control (DAC)

The traditional Unix model. Each process carries a **UID/GID**; each file carries an owner UID, a group GID, and **permission bits** for owner/group/other × read/write/execute. The kernel compares the two on access.

"Discretionary" means **the resource owner sets the policy** at their own discretion — you may `chmod` your own files however you like.

Additional pieces: the **setuid bit**, which makes a program execute with the file owner's UID rather than the caller's (necessary for things like `passwd`, and a perennial source of privilege-escalation bugs); **root/UID 0** bypassing checks entirely; and **POSIX ACLs** for finer-grained per-user entries.

**Weaknesses:**

- **All-or-nothing root.** A process needing one privileged operation historically needed complete power. **Linux capabilities** decompose root into ~40 distinct privileges (`CAP_NET_BIND_SERVICE`, `CAP_SYS_ADMIN`, …), though `CAP_SYS_ADMIN` is so broad it recreates much of the problem.
- **Ambient authority.** A process wields all its user's rights all the time, so a compromised process gets everything that user can reach.
- **Users cannot be prevented from making bad policy** — discretion cuts both ways.
- **The confused deputy problem** (below).

### 3.2 The confused deputy problem

A privileged program is tricked into misusing its authority on behalf of a less-privileged caller. The program has the right to perform the action; the caller does not; the program cannot tell that the request originated from someone unauthorised.

The classic illustration is a billing service that may write to its own log file, induced by a client into writing to that path — the client supplied the name, and the service supplied the authority. This is not a memory-safety bug: it is a failure to distinguish *authority* from *designation*. Ambient-authority systems are structurally prone to it, which is the core argument for capabilities.

### 3.3 Mandatory Access Control (MAC)

Policy is set **centrally by an administrator** and cannot be overridden by resource owners. Even root is constrained. MAC complements DAC rather than replacing it — both must permit an access.

Motivations: enforce organisational policy regardless of user behaviour, and confine privileged processes so that compromising one does not yield everything it could technically reach.

### 3.4 Linux Security Modules (LSM) and SELinux

**LSM** is the kernel framework providing hook points at security-relevant decisions, allowing modules to implement policy. SELinux, AppArmor, Smack, and TOMOYO are all LSMs.

**SELinux** labels every subject and object with a **security context** (user:role:type:level) and makes decisions primarily by **type enforcement**: policy rules state which subject types may perform which operations on which object types. Anything not explicitly allowed is denied. It also supports role-based access control and multi-level security.

| SELinux — pros | SELinux — cons |
|---|---|
| Very fine-grained, default-deny | Policies are large and complex |
| Confines even root-privileged daemons | Steep learning curve; hard to debug |
| Mature, widely deployed (RHEL, Android) | Tempting to disable rather than fix denials |
| Limits blast radius of a compromise | Correct policy authoring is genuinely hard |

AppArmor trades granularity for usability by using path-based profiles.

### 3.5 Capability systems

A **capability** is an unforgeable token that both *designates* a resource and *conveys the authority* to use it. You cannot act on something you hold no capability for, and there is no ambient authority to be confused.

Because designation and authority travel together, the confused deputy problem largely disappears: the caller must *pass a capability* for the object it wants touched, so it can only direct the deputy at things it could already reach.

File descriptors are the familiar partial example — an fd designates an open file and carries the access rights determined at `open` time, and it can be passed between processes over Unix sockets. Fuller realisations include **seL4** and **Capsicum** (which puts processes in a capability mode where they can only use resources they already hold). This connects directly to Week 5, since capabilities are the natural way to express what a compartment may touch.

Note the terminology collision: **Linux "capabilities" are not capabilities in this sense** — they are a partition of root's ambient privileges, not unforgeable object references.

---

## 4. Trusted Execution Environments

### 4.1 What a TEE is and why

A **TEE** provides an isolated execution environment whose confidentiality and integrity are protected **even from privileged software** — the OS, the hypervisor, and the machine's administrator.

The motivation is a TCB problem. Ordinarily, running a computation on someone else's machine means trusting their entire stack. A TEE aims to remove the OS, hypervisor, and operator from the TCB, leaving (ideally) only the CPU and your own code.

### 4.2 Key characteristics

- **Isolated execution** — protected memory that privileged software cannot read or modify, typically enforced by the CPU and backed by memory encryption.
- **A minimal TCB** — the hardware plus the enclave's own code.
- **Remote attestation** — the ability to prove to a remote party *what code is actually running* inside the environment on genuine hardware.
- **Sealing** — binding secrets to a specific measured code identity so only that code can retrieve them.

### 4.3 Remote attestation

The environment produces a **measurement** (a cryptographic hash of the loaded code and configuration), signed by a hardware key that chains to the vendor. A remote verifier checks the signature and compares the measurement to what it expects, and only then provisions secrets.

Without attestation a TEE is nearly useless remotely: you would have no way to know your code, rather than an attacker's substitute, was running.

### 4.4 The three examples

- **Intel SGX** — application-level **enclaves**. A process carves out an encrypted, integrity-protected region that even the kernel cannot read. TCB is just the CPU and enclave code. Costs: enclave code cannot make syscalls directly (transitions are expensive), limited protected memory, and a hard requirement to port applications. Repeatedly broken by side-channel and transient-execution attacks, which it explicitly does not defend against.
- **ARM TrustZone** — a system-wide split into a **secure world** and a **normal world**, with the CPU switching between them via a monitor. Coarser than SGX (one secure world, not per-application enclaves) and pervasive in mobile devices, where it protects payment, DRM, and biometric processing.
- **AMD SEV** — **VM-level** protection, encrypting a guest VM's memory with a key the hypervisor does not hold. SEV-SNP adds integrity and attestation. The appeal for cloud computing is that unmodified VMs get protection from the host — no application rewriting required.

The progression is worth noting: enclave (part of a process) → world (part of a system) → whole VM. Larger granularity means a bigger TCB inside the boundary but far less porting effort.

### 4.5 Use cases and limits

Confidential cloud computing on untrusted infrastructure, protecting keys and DRM, secure multi-party computation, and privacy-preserving ML on sensitive data.

Limits worth stating: side channels (cache, timing, speculative execution) are largely **out of scope** for these designs and have repeatedly broken them; the hardware vendor becomes a trust anchor you cannot audit; availability is not protected, since privileged software can always refuse to schedule you; and bugs *inside* the enclave are as exploitable as anywhere else — with less visibility.

---

## 5. OS models and security

Kernel structure determines how much code is in the TCB, which makes it a security question.

### 5.1 The design space

The axis is **how much functionality runs privileged in the kernel** versus in isolated userspace components, trading performance (privileged code avoids crossings) against security and robustness (isolated components fail independently).

### 5.2 The models

**Monolithic kernel** (Linux, Windows, BSD) — all OS services in one privileged address space. Fast, since subsystems call each other directly. But the entire kernel (millions of lines, much of it drivers) is in the TCB, and any bug anywhere is a full compromise. Mitigations: modules, LSMs, and pushing drivers to userspace where feasible.

**Microkernel** (seL4, QNX, MINIX 3, L4) — the kernel provides only address spaces, threads, scheduling, and IPC. Filesystems, drivers, and network stacks run as isolated userspace servers. A driver bug crashes one server, not the system. The TCB shrinks enormously — **seL4** is around 10k lines and **formally verified**, a genuinely different assurance level. Cost is IPC overhead on every cross-server interaction, which decades of engineering have reduced but not eliminated. Widely used where correctness dominates: avionics, automotive, secure phone enclaves.

**Exokernel** — pushes abstraction *out* of the kernel entirely. The kernel only multiplexes and protects raw hardware resources; applications link library OSes implementing whatever abstractions they want. Maximum flexibility and specialisation; security depends on the resource-protection layer being right, and the model has been more influential than deployed.

**Unikernel** — compile the application together with just the library-OS functionality it needs into a single specialised image, usually run directly on a hypervisor. Tiny attack surface (no shell, no unused drivers, often a single address space), fast boot, small footprint. Security benefits come mainly from **attack-surface reduction**, though the single address space means no internal isolation, and debugging and operational tooling are weak. This connects forward to Week 6's lightweight virtualisation.

### 5.3 The lesson

**There is a direct trade-off between TCB size and performance**, and the models are points along it. Monolithic kernels won on performance and ecosystem; microkernels win on assurance. Much modern practice is monolithic kernels borrowing microkernel ideas — userspace drivers, sandboxed services, seccomp, hypervisor-backed integrity — to shrink effective trust without giving up the ecosystem.

---

## 6. Week 4 takeaways

1. The **network stack parses attacker-controlled input in the kernel with no local access required** — a top-tier attack surface.
2. Know the **process-level and user-level invariants**; a kernel bug can violate all of them simultaneously.
3. **TOCTOU** races and unvalidated user pointers are the kernel-specific bug classes to name.
4. **seccomp-BPF** restricts the syscalls a process may make — the main practical surface-reduction tool.
5. **syzkaller** (fuzzing) and **KASAN** (sanitizer) are the kernel bug-finding tools to cite.
6. **DAC** = owner sets policy, ambient authority, root bypasses. **MAC** = admin sets policy, binds even root; both must permit access.
7. **The confused deputy** is a failure to separate authority from designation — the core argument for **capabilities**, which bind the two together.
8. **Linux capabilities ≠ capability systems.** The former partitions root; the latter uses unforgeable object references.
9. A TEE's essential features are **isolated execution + minimal TCB + remote attestation**; SGX = enclave, TrustZone = secure world, SEV = whole VM.
10. **Side channels are out of scope for TEE threat models** and have repeatedly broken them in practice.
11. Kernel models trade **TCB size against performance**: monolithic (fast, huge TCB) → microkernel (seL4: ~10k lines, formally verified) → exokernel/unikernel (minimal surface, specialised).
