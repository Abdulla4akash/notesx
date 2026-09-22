---
subject: COMP60261
chapter: 4
title: "Chapter 4 Exam Questions - Fable 5"
language: "en"
---

# COMP60261 — Chapter 4 Exam Questions

**Author:** Fable 5
**Scope:** Operating systems, part 2 — the storage and network I/O stacks; the OS security invariants and the trust model beneath them; kernel hardening and bug detection; access control (DAC, MAC, capabilities); trusted execution environments; and how kernel design models trade security against performance.

**Assumed platform for every calculation: x86-64 Linux (LP64), 4 KiB pages, ext4 with 4 KiB blocks, 512-byte sectors, Ethernet MTU 1500.**

| Quantity | Value |
|---|---|
| Filesystem block / page size | 4 KiB |
| Disk sector, and the unit of `st_blocks` | 512 bytes |
| Driver share of the kernel | more than two-thirds of ~20M LoC |
| Ethernet MTU / TCP MSS | 1500 / 1460 bytes |
| Kernel canary weakness | one value per CPU, all frames |
| KASLR weakness | one offset for the whole kernel area |

> **On the calculations in Part 2.** Every figure below was computed and checked numerically. The struct-padding question in particular was verified against a real structure layout — and worth noting, the first attempt gave the wrong answer because `long` is 4 bytes under Windows LLP64 and 8 under Linux LP64. The published figures use LP64, which is what the question specifies.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1 — The OS security invariants

**Q:** State the two process-level security invariants an OS must enforce, naming the mechanism for each. One of them has two distinct clauses — give both. Then state the three user-level invariants.

**Answer & Explanation:**

**Invariant 1 — inter-process isolation.** Processes cannot access — read, write or execute — each other's state, principally memory, directly.

> **Mechanism: page tables.** Each process gets its own address space, so an address belonging to another process is not merely forbidden but **inexpressible**. This is enforcement by construction rather than by checking.

**Invariant 2 — user/kernel isolation.** This has **two clauses**, and the second is the one commonly omitted:

| Clause | Mechanism |
|---|---|
| Processes cannot access the kernel's memory directly | The **user/supervisor execution mode**, plus the corresponding **user/supervisor bits in page table entries** |
| Processes can invoke the kernel **only at a safe entry point** | **System calls**, whose security rests on that same user/supervisor protection |

> **Why both clauses are needed, stated as a pair:** isolation *without* a controlled doorway would make the kernel unusable — applications could never request a service. A doorway *without* isolation would make it insecure — the kernel's memory would be readable by anyone who could reach it. Neither half is sufficient, and an answer giving only "processes cannot read kernel memory" has answered half the question.

**The three user-level invariants:**

1. **User authentication** — only authorised users may access the system, enforced by some authentication mechanism (password, fingerprint, face recognition).
2. **Users can configure how to share, or not share, the resources they own** — implemented with **file permissions**. Note that under UNIX and Linux files abstract many kinds of system resource, so this one invariant covers far more than documents on a disk.
3. **Only privileged users may perform security-critical tasks** — loading kernel code, shutting down the machine, mounting filesystems.

**How the two levels relate.** The process-level invariants are enforced by **hardware the OS configures** — the MMU and the privilege modes — and hold regardless of what userspace does. The user-level invariants are enforced by **kernel code performing checks**, and are therefore only as good as the completeness of those checks. That distinction is why Question 3's missing-check bug class exists at all, and why Question 5's DAC critique bites: the first level cannot be misconfigured by a user, and the second can.

---

### Question 2 — The basic trust model, and why it is wrong

**Q:** State the assumptions of the basic OS trust model. Then give the four ways in which it fails to reflect reality, and say which later topic each failure motivates.

**Answer & Explanation:**

**The basic model assumes:**

* The **entire kernel** is trusted.
* Local and remote **applications and users** are **not** trusted.
* The **hardware** behaves correctly.
* The **system administrator** has ambient authority, and certain applications (login, password change) are privileged.
* The **BIOS, bootloader and boot process** are trusted.

**The four failures — and this progression is the intellectual spine of the chapter:**

| Assumption | Reality | Motivates |
|---|---|---|
| BIOS and bootloader are trusted | They **have bugs** and can be **corrupted**; a local attacker could swap the on-disk kernel image for a malicious one | **Secure and measured boot** |
| The kernel is correct | The kernel **has bugs**, particularly in **third-party code such as drivers** | **Kernel hardening and bug detection** (Questions 3, 4, 20–22) |
| The hardware is correct | The hardware **has vulnerabilities** — **Spectre and Meltdown** | The **hardware security** lectures |
| The administrator or owner is trusted | In certain scenarios the **owner may not be trusted at all** | **Trusted Execution Environments** (Question 7) |

**Why the last row is the one to remember.** If asked to *motivate* TEEs, the correct starting point is precisely this: the conventional model has the tenant trusting the provider's hardware and hypervisor, and the TEE model **removes that single assumption**. Everything distinctive about SGX, SEV and TrustZone follows from taking "the machine owner is an adversary" seriously.

**Why the second row is quantitatively convincing.** More than **two-thirds of the kernel's roughly 20 million lines** is device driver code — about 13.3 million lines, much of it third-party, much of it maintained outside the core, all of it running with full privilege in a monolithic kernel. "The kernel is correct" is not a claim anyone can substantiate about a codebase of that size and provenance. The lecturer's phrasing is that the sheer size does not merely fail to guarantee the absence of bugs but "almost guarantees their presence."

**The connection to Chapter 3.** This is the same argument as "a secure OS is an oxymoron", made concrete. Chapter 3 established that the TCB must be correct but cannot be proved so; this table itemises *which* specific trust assumptions break and hands each one to a specific mitigation. The response to an untrustworthy TCB is not to trust it harder but to **shrink it** (microkernels, Question 8), **harden it** (Question 4), **test it** (Question 3), or **route around it** (TEEs, Question 7).

---

### Question 3 — Hardening the system call interface, and the double fetch

**Q:** Why is the system call interface the principal user-to-kernel attack surface? List what the kernel must assume userspace may supply. Then explain the TOCTTOU / double-fetch attack and state precisely why copying into kernel space is the **only** solution.

**Answer & Explanation:**

**Why the syscall interface is the attack surface.** It is the **only** legitimate way for an unprivileged process to invoke kernel code, and it is a **very large trust interface that is hard to secure**: several hundred calls, each with its own arguments, many taking pointers to complex structures, and with meaningful ordering relationships between them. Chapter 2's rule that a boundary's difficulty is proportional to the richness of what it accepts applies directly — this is one of the richest interfaces in the system.

**What the kernel must assume userspace supplies.** Linux treats **every piece of data flowing from userspace through system calls as untrusted** — both the arguments themselves and, for pointer arguments, **what they point to**. Concretely, the kernel must assume it may receive:

* corrupted data structures,
* bad indexing information,
* `NULL` pointers,
* references to resources (for example files) the process has **no permission** to access,
* **sequences of system calls in the wrong order**.

> That last item is worth noticing separately: it is a **state**-based attack rather than a data-based one. No individual call is malformed; the *sequence* is. This is exactly why a grammar-aware fuzzer that knows the dependencies between calls — Question 4's Syzkaller — finds bugs that byte-level random input never will.

**The double fetch, step by step.** A process frequently passes a pointer into its own memory (as `readv` and `writev` do). Suppose the kernel validates the pointed-to data and then uses it:

1. The kernel reads a value from userspace — say a length — and **checks** it.
2. **Userspace, using another thread, overwrites that value.** The memory belongs to the process, so writing to it needs no privilege and no bug.
3. The kernel **re-reads** the value and **uses** it, now unvalidated.

This is a **time-of-check-to-time-of-use (TOCTTOU)** bug, in this context called a **double fetch**. Question 20 shows one in code, where the consequence is a kernel stack buffer overflow.

**The fix, and why it is the only one.** The kernel must **copy all user data passed by reference into kernel space**, and perform validity checks **on the copies**:

```c
unsigned long __copy_from_user(void *to, const void __user *from, unsigned long n);
unsigned long __copy_to_user(void __user *to, const void *from, unsigned long n);
```

**Why this works, stated precisely:** once the data is in kernel memory, **userspace cannot reach it** — no thread of the calling process has any mapping for it. So check-then-use becomes **atomic with respect to the attacker**, not because the kernel holds a lock or disables preemption, but because the attacker has been structurally removed from the data. Checking in place and re-reading is the bug; **copy once, then validate the copy, then use the copy** is the fix.

Two further points that complete the answer. The attack **requires concurrency** — a second thread — which is why multicore hardware made this class far more exploitable, since the attacker no longer needs to win a scheduling race but can simply write in a tight loop on another core. And **`copy_from_user` is also what makes SMAP workable**: the kernel is normally forbidden from touching userspace memory at all, and this function is the sanctioned, temporary exception (Question 4).

---

### Question 4 — Kernel runtime defences and their named bypasses

**Q:** Describe the kernel's memory-permission and attack-surface defences. For each, name its specific bypass or limitation. Then give the rules for preventing kernel information leaks, and explain the two kernel-specific vulnerability classes that are *not* memory-safety bugs.

**Answer & Explanation:**

**Memory permissions.** Kernel **executable code and read-only data must not be writable**, and neither must **kernel function pointers and sensitive variables**. Then userspace and kernel memory are segregated:

| Mechanism | Prevents | Bypass |
|---|---|---|
| **SMEP** (Supervisor Mode Execution Prevention) | The kernel **executing code located in userspace memory** | — |
| **SMAP** (Supervisor Mode Access Prevention) | The kernel **reading or writing userspace memory**; temporarily disabled during `copy_to_user`/`copy_from_user`, which is exactly when such access is legitimate | — |
| Both together | **ret2usr** — redirecting kernel control flow into attacker-controlled userspace code | **ret2dir** |

**The ret2dir bypass matters because it shows what the mitigation actually removed.** SMEP and SMAP stop the kernel from following a pointer *into userspace*. But **userspace can still partially control what is in the physmap** — the kernel's own direct linear mapping of all physical memory — so the attacker's bytes are reachable through a *kernel* address instead. The same attacker-controlled page, named differently, and both mitigations are satisfied. This is Chapter 2's pattern again: **each mitigation has a specific named bypass, and knowing the pair is worth more than knowing the mitigation alone.**

**Probabilistic defences, and why the lecture calls them "not a panacea":**

| Defence | Weakness |
|---|---|
| **Kernel stack canaries** | **One canary value for all stack frames on each CPU** — so a single leak, for example via a stack buffer **over-read**, breaks it everywhere and the value can be replayed |
| **KASLR** | **Coarse-grained** — one random offset for the whole kernel area (kernel and module code, kernel stacks, vmalloc, physmap), so **one pointer leak may break it for the entire area** (quantified in Question 13) |

**Memory integrity measures**, which are deterministic rather than probabilistic: use **shadow stacks** rather than canaries; prevent over- and underflows from leaving the stack using **guard pages**, unmapped pages that **fault when hit**; **sanity-check the heap free list for corruption** on every allocation and free; and **trap on integer overflows**, especially in counters and size variables.

**Preventing kernel infoleaks — the rules:**

* **Avoid exposing kernel pointers to userspace.** A single leak breaks KASLR for the whole area.
* Take care not to send **partially or un-initialised** structures or buffers to userspace — the struct-padding problem, quantified in Question 11 and exploited in Question 21.
* The **kernel log**, and any file containing pointers, should be readable **only by the administrator**.
* **Do not use addresses as resource identifiers** — for example file descriptors. Use **atomic counters** instead.
* **Poison or zero memory on release**, countering reuse attacks such as uninitialised reads and use-after-free — at a **performance cost**.

> **The fourth rule is the subtle and highly quotable one.** Any handle exposed to userspace that *is* a pointer is **an infoleak by construction**, however carefully everything else is guarded. You cannot audit your way out of it; the representation itself is the leak. Question 22 shows the bug.

**The two non-memory-safety classes.** From a study of one year of kernel vulnerabilities — **141 in 2010**, Chen et al. — the classes are: missing **pointer** checks, missing **permission** checks, buffer overflow, integer overflow, uninitialised data, memory mismanagement (leaks, use-after-free, double free), and miscellaneous (NULL dereference, divide by zero, infinite loop, race and deadlock).

The **first two are not memory-safety bugs at all** — they are **missing checks**. A strong answer distinguishes two sources of kernel vulnerability: the kernel is **written in C**, so it inherits every Chapter 2 bug class; *and* the kernel is a **privileged mediator**, so it has an additional class consisting of forgetting to verify a pointer or an authorisation that only it is in a position to verify. Both are needed, and only the first is addressed by memory-safe languages.

**Bug detection, briefly.** Dynamically: **KASAN** and **KUBSAN** (the kernel's address and undefined-behaviour sanitisers), leak and race sanitisers, **Lockdep** for deadlocks, double locking and lock-order inversion, tracing via ftrace/perf/**eBPF**, and fuzzing with **Syzkaller**. Syzkaller runs the **kernel under test in a VM controlled from the host** — necessary, since a successful fuzz crashes the kernel — works best with **KASAN and coverage** guiding it, and generates **a program of several syscalls** per round rather than one call. Its **Syzlang** grammar describes argument types, **values passed between calls** (an `fd` from `open` being usable by `read`), and **length parameters** describing other parameters; that structure-awareness is what makes kernel fuzzing productive, since random bytes almost never form a valid sequence. **Syzbot** runs **25 instances over roughly 150–200 VMs** and has reported thousands of bugs — with the stated problem that **about two-thirds of its reports are invalid**, which is the reminder that reporting volume is not the same as value. Statically: **Coccinelle** and **Smatch** match patterns of mistakes (every `kmalloc` should have a matching `kfree`), and **Sparse** uses compiler attributes such as **`__user`** and `__acquires` to make invisible properties checkable — with the caveat that static analysis's usual **state explosion** is severely worsened at 20M+ lines.

---

### Question 5 — DAC, MAC, and the division of labour in Linux

**Q:** Explain Lampson's access control matrix and how DAC, MAC and capabilities relate to it. State DAC's failure condition and its two failure modes. Then explain how SELinux and LSM divide responsibility, and give the order of checks performed when a file is opened.

**Answer & Explanation:**

**Lampson's access control matrix.** The abstract model: **columns are subjects**, **rows are objects**, and each cell holds the permissions that subject has on that object.

|  | File A | File B | File C |
|---|---|---|---|
| **Process 1 (user 1)** | read, write | read | — |
| **Process 2 (user 2)** | read | write | read |

**Everything that follows — DAC, MAC, capabilities — is a different way of representing and enforcing this one matrix.** Recognising that is what makes the three comparable rather than three unrelated topics: ACL-based systems store the matrix **by column** (each object lists who may touch it), and capability systems store it **by row** (each subject holds tokens for what it may touch). That single structural difference is what produces the confused deputy in one and not the other (Question 6).

**Linux's baseline: DAC.** A process's identity is a **UID** and **GID**; each file has an **owner UID and GID** plus **permission bits** in its metadata. A process running with the file's owner UID can **change the permissions** on it, which is effectively full access. Userspace configures permissions with `chown` and `chmod`; **the kernel performs the authorisation check on each access** — `open`, `read`, `write`. Because **non-root users can change the security configuration** of files they own, this is **Discretionary** Access Control.

**DAC's failure condition, in the form worth quoting.** DAC **assumes users always behave correctly**, and that fails in two distinct ways:

1. **Mistakes** — user A misconfigures permissions so that user B can read A's private files. The lecturer's example is a botched `chmod` exposing a private SSH key. Question 23 is this failure in a setup script.
2. **Compromise** — one of A's processes, which is **outside the TCB**, is taken over by an attacker (say via a use-after-free) and then acts maliciously, **lowering the system's defences by changing its security configuration**. The attacker inherits not just A's access but A's *authority to grant access*.

> **The pivot sentence of the lecture:** what is needed is a protection system that **maintains its guarantees even when software outside the TCB is malicious.** Phrase it in TCB terms — *DAC's guarantees depend on the good behaviour of untrusted software; MAC's do not.*

**MAC.** A protection system in which **the security configuration can only be modified by trusted administrators**. Every **subject** and **object** carries a **security label**; labels define **rules** for how processes may interact with each other and with resources; the label set is defined by **trusted administrators** and is **immutable** — it **cannot be changed by processes**, which is what makes the control *mandatory*. Labels are **assigned at creation time** and can be changed later only by trusted software, which in the lecture's worked example requires a **restart of the MAC system**. Note that subject and object labels need not come from the same set, and a process may be denied an object whose label is more sensitive than its own — the classic case being a *secret* process unable to read a *top secret* file.

**SELinux** is MAC for Linux. Processes and resources are assigned labels called **contexts**, each with several fields including a **type** — a web server process is `httpd_t`, its content `httpd_sys_content_t`, its ports `http_port_t`. The **policy** is a set of administrator-defined rules explicitly describing permitted operations, and **no rule means deny by default**. In the worked example a web server and an SQL database each have their own type; **because no rule permits it, the web server cannot reach the database file**, and the database cannot touch the web server's port or content.

Its **pros**: strict, fine-grained enforcement and a much better application of **least privilege** — if Apache is compromised the attacker reaches only what the policy marks accessible, rather than everything readable by that user or by "others", and catastrophically better than a server running as root. Also widely available and **required for some compliance standards**. Its **cons**: the **complexity of configuration, management and troubleshooting**, which is the real barrier to adoption — the lecturer's illustration is to search for "how to disable SELinux" — and being **too strict**, blocking legitimate actions under overly strict or outdated policies.

**The division of labour, which is the examinable point.** **SELinux is concerned with *policies*** — the rules. **LSM (Linux Security Modules) provides the *mechanisms*** to implement access control inside the kernel, and is used not only by SELinux but by **Smack, TOMOYO and AppArmor**. LSM exposes **hooks** on kernel code paths **immediately before access to security-sensitive internal resources**, at which a module may **permit, deny, or log** (the last for auditing); kernel objects carry an **opaque `void *security` field** for whatever metadata a module needs.

**The order of checks when opening a file:**

1. The syscall begins processing.
2. The **inode** for the file is looked up.
3. **Basic error checks** — does the file exist?
4. **DAC checks** — traditional UNIX permissions.
5. **LSM hook** — the module (for example SELinux) allows, denies, or logs.
6. If allowed, the operation proceeds.

> **Two traps in one sequence.** **DAC is checked *before* LSM**, and **both must permit**. So MAC **complements rather than replaces** DAC — a file unreadable under its mode bits stays unreadable no matter what the SELinux policy says, and vice versa. Do not describe MAC as superseding DAC.

---

### Question 6 — The confused deputy, and how capabilities dissolve it

**Q:** Describe the confused deputy problem using the compiler example. Explain precisely why access control lists cannot fix it, whether discretionary or mandatory. Then define a capability, and show how a capability system makes the attack inexpressible.

**Answer & Explanation:**

**The setup.** A shared multi-user system used for compiling code. Users have home directories containing their source. They invoke the **compiler**, passing the source file, the name of the executable to produce, and optionally a separate file for **debug symbols**. Separately, the **administrator** has configured the compiler to record language-usage statistics into a system directory, `/sysx/language-stats.txt`.

**The permission arrangement.** `/sysx/` is meant to be accessible only by root. But because the compiler must write its statistics there, the administrator grants **the compiler** write access to that directory. `/sysx/` also contains a security-critical **`billing.txt`** that normal users must not touch.

**The attack.** A user who learns `billing.txt` exists passes it as the **debug-symbols output file**. The compiler — exercising **its own** authority over `/sysx/` — overwrites it.

**The definition this instantiates.** A **deputy** (the compiler), holding privilege, is **confused into accessing a file that the user it acts on behalf of has no permission to access**.

**Why ACLs cannot fix it — the crucial point.** Note what is *not* wrong here. There is **no misconfiguration**: the compiler **genuinely needs** write access to `/sysx/`, and **every individual step is permitted** by the policy as written. Tightening the ACL either breaks the statistics feature or does not address the attack. The flaw is structural:

> **The caller supplies the *name* while the deputy supplies the *authority*, and nothing binds the two together.**

In matrix terms from Question 5, an ACL system stores permissions **by object** and checks them against **whoever is executing**. At the moment of the write, the executing subject is the compiler, and the compiler is authorised. The user's lack of authority over `billing.txt` is simply **not consulted**, because the user is not the subject any more. Attribute the confused deputy to **the separation of designation from authority**, never to a permission mistake.

**A capability.** A token that **conflates**:

* the **designation** of a resource (which file), **and**
* the **permissions** to access it.

In other words: **if you can name a resource, you can access it.** This is the exact inverse of ACLs, where name and permission are **separate** — an ordinary user can freely *refer to* `/etc/shadow` by path while being unable to read it.

**Capabilities are unforgeable.** The only way to obtain one is for **another security domain to copy one of its own and give it to you.** The system is bootstrapped by subsetting downward:

1. The **OS starts with all capabilities** — every permission to every resource.
2. It creates **`init`** with a large set.
3. `init` spawns processes, and **each parent decides which capabilities its children receive**, subsetting as the tree descends.
4. Because processes **cannot forge** capabilities, there is **no way to increase** what a parent granted.

**Applying this to the deputy.** After `login` authenticates the user it subsets its capabilities for the user's shell: read/write on the home directory, execute on the compiler. When the user runs the compiler, the shell subsets again — the compiler receives capabilities only for **the source file, the executable output, and the debug-symbols output**.

The compiler still needs to write `/sysx/language-stats.txt`. That capability *could* be passed down the chain, but doing so would give **the shell** access it does not need. Instead the compiler obtains it **directly from the kernel**, which holds full filesystem access.

**The result.** The compiler holds **no capability for `billing.txt`**, so it **cannot** overwrite it — regardless of what filename the user supplies. The user can still *type* the name, but a name is no longer authority.

> **The detail that elevates an answer:** the statistics capability is granted **directly to the compiler by the kernel rather than passed through the shell**, so authority is never accumulated by intermediaries. That is **least privilege expressed structurally**, and it is why the attack becomes **inexpressible** rather than merely blocked. A blocked attack implies a check that could be forgotten; an inexpressible one does not.

**Where you have already met a capability.** A **file descriptor** is very close to one: it designates a specific open file object and carries the access mode it was opened with, it cannot be forged, and it can be *given* to another process — over a UNIX socket with `SCM_RIGHTS`. Question 24 fixes a confused deputy by doing exactly that, and Question 25 shows the flip side: a descriptor leaked across `execve` is a capability handed to code that was never meant to have it.

---

### Question 7 — Trusted Execution Environments

**Q:** Define a TEE and state its threat model. Which of the CIA properties does it provide, and why is the omitted one out of scope? Give the four key characteristics, and compare SGX, SEV and TrustZone along the axis that organises them.

**Answer & Explanation:**

**The trust model that motivates it.** A server in a data centre, owned by a **cloud provider**, running VMs rented to different **tenants**. Conventionally the provider trusts its own hardware and virtualisation software and distrusts everything tenants run; each tenant trusts its own software **and also the provider's hardware and software, including the VMM**; and tenants distrust each other. The TEE model changes exactly one thing:

> **Tenants do not trust the cloud provider.**

This is realistic because many organisations decline to move workloads to the cloud precisely because they do not want the provider able to read their code and data.

**Definition.** A TEE is an **isolated execution context enforced by the CPU hardware, resistant to information disclosure and tampering by the host OS or hypervisor.**

**Threat model:** the attacker may control **all host software outside the TEE, including privileged layers — the OS and the hypervisor — and the I/O devices.** Concretely, a **process that does not trust the OS it runs on**, or a **VM that does not trust the hypervisor managing it**.

**Which properties it provides:**

| Property | Provided? |
|---|---|
| **Confidentiality** — code and data cannot be **read** by the host | Yes |
| **Integrity** — code and data cannot be **altered** by the host | Yes |
| **Availability** | **Explicitly out of scope** |

**Why availability is excluded, with the reason stated.** The attacker runs privileged software, so nothing stops them **simply shutting the machine down**, or declining to schedule the TEE at all. No hardware mechanism inside the CPU can compel a hostile hypervisor to give a guest CPU time. Maintaining availability against an adversary who controls the scheduler is not merely hard but incoherent — so the guarantee offered is honestly limited to C and I. **Do not claim TEEs protect availability.**

**The four key characteristics:**

1. **An isolation mechanism** from normal execution — the outside world cannot read or write TEE memory.
2. **Controlled interaction** with the outside world. The TEE is **not self-sufficient** and must interact with the OS or hypervisor for I/O. These are **new interfaces relative to traditional trust models, and they need securing** — because the OS is no longer trusted.
3. **Secure storage** — encryption with **keys that never leave the TEE**, for secrets such as keys and passwords.
4. **Attestation** — proving remotely that the TEE runs on the **right hardware** and that the **software inside was not tampered with before being loaded**.

> **Characteristic 2 is where the real vulnerabilities live**, and it recurs in every implementation below. Isolation **creates a new, narrow, untrusted-facing interface**, and each implementation's weakest point is exactly there. Same lesson as Chapter 5's compartment interfaces: you do not remove a trust boundary by adding isolation, you **relocate** it — and the new one is often less well studied than the one you replaced.

**The three implementations, organised by granularity:**

| | **Intel SGX** | **AMD SEV** | **ARM TrustZone** |
|---|---|---|---|
| Granularity | Part of an application — an **enclave** | A whole **VM** (confidential VM) | System-wide **secure world** |
| Memory encryption | **Yes** — pages encrypted in DRAM | **Yes** | **No** |
| Application changes | **Required** — port to an enclave framework | **None** — existing applications run as-is | Trusted apps written for the secure world |
| TCB inside | Enclave code, plus an embedded mini-OS | Application **+ the entire guest OS** | Small secure OS + trusted apps |
| Weakest interface | **Enclave exits** for syscalls — slow, and the untrusted OS may return bad data | **Virtual hardware**, which has proven very hard to secure | Normal↔secure world calls |

**Why granularity is the right organising axis.** Every cost follows from it. **Finer** granularity (SGX) gives a **small TCB** — only the sensitive part of the application is trusted — but demands **porting** and pays **expensive transitions**, since at any moment the CPU is executing either inside or outside the enclave and every syscall requires a costly, dangerous exit. Frameworks mitigate this by **embedding a small OS inside the enclave** to service as many calls internally as possible, though **disk and network I/O still require the untrusted host OS**. **Coarser** granularity (SEV) needs **no porting at all**, which is its decisive practical advantage, but the TCB swells to include **the whole guest OS**. **TrustZone is orthogonal** — a system-wide split into normal and secure worlds that is **independent of privilege levels**, so supervisor and user modes exist in *both* worlds — and it is the only one of the three with **no memory encryption**, relying instead on hardware preventing non-secure access to secure memory. Its canonical use is fingerprint unlock on Android: the normal-world app invokes a trusted application to verify identity, so even a **stolen and rooted** phone does not readily yield the fingerprint data.

**Remote attestation.** A client connecting to a TEE must verify two things: that the enclave **runs on the expected hardware** (a genuine SGX-capable CPU), and that the **software inside was not tampered with before loading**. The enclave **sends a measurement** — generally hashes identifying both — which the client verifies; with SGX, **Intel additionally offers an attestation service** to validate the hardware. Note that attestation covers the state **at load time**: it says what was loaded, not that it has behaved correctly since.

---

### Question 8 — OS design models on the isolation/performance axis

**Q:** Place the monolithic kernel, microkernel and unikernel on an axis of isolation versus performance, giving the mechanism and the assessment for each. Be careful about where unikernels sit, and justify it.

**Answer & Explanation:**

**An OS design model** is a set of core design choices defining how the OS's functions are organised. Each has consequences for **performance** and, the point of the lecture, for **security**.

**Monolithic kernel — the middle ground.** Application and kernel generally live in the **same address space**, and the kernel is a **large monolithic unit of trust with no internal isolation** between subsystems. Application and kernel are separated by **privilege levels** — supervisor CPU mode plus the supervisor bit in page table entries — and applications from each other by **separate address spaces**. Assessment: **medium isolation, good performance**, precisely because **less isolation means fewer costly security-domain crossings**. Examples: **Linux**, FreeBSD, the BSDs.

**From there, exactly two directions:** increase isolation at a performance cost, or sacrifice isolation for performance.

**Microkernel — more isolation, less speed.** Many kernel functions are **offloaded to userspace processes called servers**, each in its own address space; only core functionality stays privileged — **scheduling, process and memory management, and IPC**. **IPC is key**, since it is how the offloaded subsystems communicate.

* **More secure:** if one server fails or is compromised, **it is not game over for the whole system** — the attacker is confined to that server's address space. Set against Question 2's observation that two-thirds of the kernel is driver code, deprivileging drivers is precisely the point.
* **Slower:** applications and servers communicate by **IPC**, involving **security domain crossings** (system calls, context switches) and possibly **data copies**. Heavily optimisable, never free.

Examples: **MINIX v3**, **L4** — of which **seL4** is additionally **formally verified**, the strongest available assurance argument for the model, and the one case where "the TCB is correct" is more than an assumption.

**Exokernel and unikernel — more speed, less isolation.** An **exokernel** keeps core functionality minimal and has **applications embed OS services as a library OS (libOS)**, exposing a low-level interface that **securely multiplexes hardware between untrusted libOSes**. Proposed in the 1990s, it did not take off. The **unikernel** is the 2010s revival with one substitution: **a hypervisor plays the exokernel's role**, and each application runs in **its own VM compiled together with a libOS**. Because **there is no need to isolate the application from the libOS**, **system calls that do not require the hypervisor become ordinary function calls** — much faster.

> **The correction to the common assumption.** This unit places **unikernels on the *faster, less secure* side** of the design space. If you have absorbed the general claim that unikernels are "more secure because they have a smaller attack surface", note that **this unit's framing is different**, and give *its* argument.

**State the security assessment in both halves, because both are required:**

* Unikernels are **well isolated from each other**, since they run in **separate VMs**, and **the hypervisor is isolated** from them. External isolation is **strong**.
* But there is **no isolation between a unikernel instance and the application it runs.** So **if an attacker exploits a vulnerability in the application, they may easily access the entire unikernel instance.** Internal isolation is **absent**.

The trade in one line: **unikernels drop user/kernel protection for performance.** An answer giving only the strong external isolation has described the advantage and omitted the cost.

| Model | Isolation | Performance | Key property |
|---|---|---|---|
| **Monolithic** | Medium — privilege levels separate apps from kernel; **no intra-kernel isolation** | Good | The middle ground; fewer domain crossings |
| **Microkernel** | High — services in userspace, separate address spaces | Slower — IPC crossings and copies | Trades performance for security |
| **Unikernel** | External strong (separate VMs), **internal none** | Fast — syscalls become function calls | Trades security for performance |

**The unifying observation.** All three sit on one axis because **isolation is purchased with domain crossings**, and domain crossings cost cycles — the same world-switch cost from Chapter 3 that justified futexes and userspace `malloc`. A microkernel buys safety by paying that cost more often; a unikernel buys speed by refusing to pay it at all; the monolithic kernel pays it at exactly one boundary, the syscall interface, which is why that interface is such a concentrated attack surface (Question 3).

---

## Part 2: Memory & Storage Size Calculations

### Question 9 — Permission bits, octal modes, and `umask`

**Q:**

1. Convert `-rwxr-xr-x` and `-rw-r--r--` to octal.
2. Give the symbolic form of `0644`, `04755`, `02770` (a directory) and `01777` (a directory), and name the special bit in each of the last three.
3. A process with `umask 022` calls `open(..., O_CREAT, 0666)` and `mkdir(..., 0777)`. Give both resulting modes. Repeat for `umask 077`.
4. `/usr/bin/passwd` is mode `04755` and owned by root. Explain why, and what invariant this supports.
5. Why is `04777` on a root-owned binary an immediate full-system compromise?

**Answer & Explanation:**

**1 — Symbolic to octal.** The string is one type character followed by **three blocks of three** — owner, group, others — where within each block `r` = **4**, `w` = **2**, `x` = **1**, and a dash is 0.

```
-rwxr-xr-x  ->  rwx=4+2+1=7  r-x=4+0+1=5  r-x=5   ->  0755
-rw-r--r--  ->  rw-=4+2+0=6  r--=4        r--=4   ->  0644
```

**2 — Octal to symbolic.** A fourth (leading) octal digit carries the special bits: **setuid = 4**, **setgid = 2**, **sticky = 1**.

| Mode | Symbolic | Special bit |
|---|---|---|
| `0644` | `-rw-r--r--` | none |
| `04755` | `-rwsr-xr-x` | **setuid** — the `s` replaces the owner's `x` |
| `02770` | `drwxrws---` | **setgid** — the `s` replaces the group's `x` |
| `01777` | `drwxrwxrwt` | **sticky** — the `t` replaces others' `x` |

The lowercase `s`/`t` indicates the special bit **with** the execute bit; an uppercase `S`/`T` would mean the special bit is set while execute is **not** — usually a mistake.

What each special bit does: **setuid** runs the program with the **file owner's** UID rather than the caller's; **setgid** on a directory makes new entries inherit the directory's **group**; **sticky** on a directory means **only a file's owner may delete or rename it**, which is why `/tmp` is `01777` — world-writable but not a free-for-all.

**3 — `umask` arithmetic.** The umask *removes* permissions: **`final = requested & ~umask`**.

| Call | Requested | umask | Final | Symbolic |
|---|---|---|---|---|
| `open(O_CREAT)` | `0666` | `022` | **`0644`** | `-rw-r--r--` |
| `mkdir` | `0777` | `022` | **`0755`** | `drwxr-xr-x` |
| `open(O_CREAT)` | `0666` | `077` | **`0600`** | `-rw-------` |
| `mkdir` | `0777` | `077` | **`0700`** | `drwx------` |

Worked once explicitly: `0666 & ~0022`. In binary `0666` is `110 110 110` and `0022` is `000 010 010`, so `~0022` clears the group and other **write** bits, giving `110 100 100` = `0644`.

Note that `open` conventionally requests `0666` and not `0777`: **files should not be created executable**, and the umask is not relied upon to remove it. Note also that **`umask 000` yields `0666`** — world-writable — which is the bug in Question 23.

**4 — Why `passwd` is setuid root.** `passwd` must update **`/etc/shadow`**, a file ordinary users cannot read or write. But **any** user must be able to change their own password. The **setuid** bit resolves this: the program is **invoked by a normal user but runs with the file owner's (root's) permissions**.

This supports the third user-level invariant from Question 1 — *only privileged users may perform security-critical tasks* — by narrowing the privilege to **one specific, audited program implementing one specific policy**, rather than granting the user write access to the file. The same pattern applies to `login` and `sshd`, which must run as root because on successful authentication they **switch to the identity of the authenticated user**, and every process in the session then **inherits** that identity.

**5 — Why `04777` is instant compromise.** The mode is `-rwsrwxrwx`: **setuid root and world-writable**. Any user can **overwrite the file's contents** with a program of their choosing — and the setuid bit means the OS will then run **their** code with **root's** UID. There is no exploitation required at all; it is a one-line escalation:

```
cp /bin/sh /usr/local/bin/helper     # the binary is world-writable
/usr/local/bin/helper                # runs setuid root
```

**The rule:** a setuid binary must be **writable only by its owner** — `04755`, never any mode with group or other write. This is worth stating as the general principle: **whenever a file's permissions determine what privilege its contents obtain, write access to that file is equivalent to that privilege.** The same reasoning applies to anything in the boot path, to files in `/etc/cron.d`, and to a library on the loader's search path.

---

### Question 10 — Block allocation, internal fragmentation, and read amplification

**Q:** An ext4 filesystem uses 4 KiB blocks on a device with 512-byte sectors.

1. A file contains 10,000 bytes. How many blocks does it occupy, how much space is allocated, how much is wasted, and what does `stat` report in `st_blocks`?
2. Repeat for a 100-byte file, and for a 4097-byte file.
3. A mail spool holds 1,000,000 files averaging 100 bytes. Compare the data volume with the space consumed.
4. An application reads **one byte** from the middle of a file. How much does the filesystem actually read, and what is the amplification factor?
5. Why does `write()` returning success not mean the data is on disk?

**Answer & Explanation:**

**1 — A 10,000-byte file.** Allocation is in whole blocks, so round up:

```
blocks     = ceil(10000 / 4096) = 3
allocated  = 3 × 4096 = 12,288 bytes
wasted     = 12,288 - 10,000 = 2,288 bytes  (internal fragmentation)
st_blocks  = 12,288 / 512 = 24
```

> **The `st_blocks` trap.** `st_blocks` is **always** expressed in **512-byte units**, regardless of the filesystem's block size. It is not the number of filesystem blocks, and it is not `st_size / 512`. A 4 KiB block is **8** such units, so block counts appear multiplied by 8 relative to what you might expect.

**2 — The small and the just-over cases.**

| File size | Blocks | Allocated | Wasted | `st_blocks` |
|---|---|---|---|---|
| 100 B | 1 | 4,096 | **3,996** | 8 |
| 4,096 B | 1 | 4,096 | 0 | 8 |
| 4,097 B | **2** | 8,192 | **4,095** | 16 |

The 4,097-byte case is the pathological one: **one byte over a block boundary costs an entire additional block**, so 4,095 bytes are wasted — the worst possible ratio short of the 1-byte file.

**3 — A million small files.**

```
data       = 1,000,000 × 100   =   100,000,000 B  =  95.4 MiB
allocated  = 1,000,000 × 4,096 = 4,096,000,000 B  =   3.81 GiB
overhead   = 4096 / 100        = 40.96×
```

**Nearly 4 GiB consumed to store 95 MiB of data** — and this ignores the inode and directory-entry costs, which for a million files are themselves substantial. This is why filesystems aimed at many small files use techniques such as **inline data** (storing tiny files inside the inode itself) or tail packing.

**4 — Read amplification.** The **page cache** buffers file data at **page granularity**, and the filesystem reads whole **blocks** — so a one-byte read pulls in a full **4,096-byte** block:

```
amplification = 4096 / 1 = 4096×
```

The read descends the whole stack — **VFS → concrete filesystem → page cache → block layer → driver** — and at the bottom the device transfers at least one **512-byte** sector, with the block layer typically issuing the full 4 KiB. The **latency** of that descent, not the byte count, is the real cost, and it is exactly what the layering buys convenience with: high-performance I/O systems therefore let applications access the disk or NIC **directly, bypassing the OS**.

The compensating benefit is that the byte is now **cached**: Linux's policy is that **all RAM not used by programs and the kernel caches file data** — visible as `buff/cache` in `free -h`, routinely gigabytes — so a re-read costs no I/O at all. Amplification on the first access is the price of that.

**5 — Why `write()` is not durability.** A successful `write()` means the data has been copied into the **page cache**, not that it has reached the medium. Written data is **retained for a time before being flushed**, which lets the kernel absorb bursts and **coalesce overwrites** of the same block. Durability requires **`fsync`**. A crash between the `write` and the flush loses the data while the application has already been told it succeeded.

> **A security note the caching raises.** Because caching is **measurable** — a cached read is dramatically faster than an uncached one — the page cache is a **side channel** for inferring which files another user has accessed, without any permission to read them. It is the same shape of leak as the timing channels in the hardware lectures: the mechanism is a performance optimisation, and the leak is a *consequence of it working*.

---

### Question 11 — Struct padding as a kernel information leak

**Q:** A driver returns event records to userspace:

```c
struct event {
    int    type;
    char   flag;
    long   timestamp;
    short  code;
    void  *handle;
};
```

1. Give each member's offset, `sizeof(struct event)`, and the total padding, identifying exactly which byte ranges are padding.
2. The driver sets every member and then calls `copy_to_user`. How many bytes of kernel memory leak per record, and per 100 records?
3. Which two of the kernel's stated infoleak rules does this code break?
4. What must the fix be, and why is `= {0}` not the most reliable form?

**Answer & Explanation:**

**1 — The layout.** Under LP64, `long` and any pointer are 8 bytes with 8-byte alignment. Each member goes at the next offset that is a multiple of its own alignment:

| Member | Align | Offset | Bytes |
|---|---|---|---|
| `int type` | 4 | 0 | 0–3 |
| `char flag` | 1 | 4 | 4 |
| *padding* | — | — | **5–7 (3 bytes)** |
| `long timestamp` | 8 | 8 | 8–15 |
| `short code` | 2 | 16 | 16–17 |
| *padding* | — | — | **18–23 (6 bytes)** |
| `void *handle` | 8 | 24 | 24–31 |

```
payload = 4 + 1 + 8 + 2 + 8 = 23 bytes
sizeof(struct event)        = 32 bytes  (alignment 8)
padding                     = 32 - 23   = 9 bytes
```

The 3-byte gap gets `timestamp` to a multiple of 8; the 6-byte gap does the same for `handle`. Both are **holes the compiler will never initialise**, because no member occupies them.

**2 — The leak, quantified.** `copy_to_user` copies **`sizeof(struct event)` = 32 bytes**, not the 23 bytes of members. Since `struct event ev;` is an **uninitialised kernel stack variable**, and assigning to each member writes only the member bytes, the 9 padding bytes still hold **whatever previously occupied that region of the kernel stack**:

```
per record  =  9 bytes of kernel memory
100 records =  900 bytes
1000 records = 9,000 bytes
```

Those bytes are prior kernel stack contents: **saved registers, return addresses, remnants of earlier syscall arguments, fragments of other users' data**. An attacker who can call this repeatedly harvests kernel stack contents at 9 bytes per call, which is more than enough — a single **kernel pointer** is all that is needed to defeat KASLR (Question 13).

**3 — Two rules broken.** From the kernel's infoleak rules:

* **"Take care not to send partially or un-initialised data structures or buffers to userspace."** The padding is exactly this, and it is invisible in the source — every member *is* assigned, so the code looks complete.
* **"Avoid exposing kernel pointers to userspace."** The `handle` member is a pointer, deliberately copied out. Combined with the rule **"do not use addresses as resource identifiers"**, this is an infoleak **by construction**: even with the padding fixed, the structure's *design* leaks an address on every call. Question 22 addresses that half.

**4 — The fix.** Zero the whole object before populating it, so padding is defined:

```c
struct event ev;
memset(&ev, 0, sizeof(ev));      /* covers members AND padding */

ev.type      = type;
ev.flag      = flag;
ev.timestamp = ktime_get();
ev.code      = code;
ev.id        = atomic_inc_return(&event_counter);   /* not a pointer */

if (copy_to_user(out, &ev, sizeof(ev)))
    return -EFAULT;
```

**Why `= {0}` is not the most reliable form.** `struct event ev = {0};` is *specified* to initialise every **member** — padding bytes are explicitly left with unspecified values by the standard. In practice GCC and Clang do zero the padding for such initialisers, but that is a property of those implementations, not a guarantee, and it can vary with optimisation and with partial initialiser lists. **`memset` over `sizeof`** covers the entire object by construction and is what kernel code uses. Better still, remove the hole: reordering members largest-first (`timestamp`, `handle`, `type`, `code`, `flag`) leaves 8 bytes of trailing padding only, and `__packed` is not the answer because it produces misaligned members.

**The general principle worth stating:** whenever a structure crosses a trust boundary — to userspace, to disk, to a socket — **the unit of transfer is `sizeof`, not the sum of the members**, so anything `sizeof` covers must be initialised. This is Chapter 2's padding arithmetic reappearing as a confidentiality bug in the kernel, and it is the same defence as zeroing the Heartbleed buffer or using `calloc` for outbound structures.

---

### Question 12 — Packet arithmetic and the cost of layering

**Q:** An Ethernet link has an MTU of 1500 bytes. IPv4 and TCP headers are 20 bytes each; the Ethernet frame adds 14 bytes of header and a 4-byte checksum.

1. What is the TCP MSS?
2. An application sends 1 MiB over TCP. How many segments, and what are the sizes of the full ones and the last?
3. What is the header overhead as a percentage, at the IP level and on the wire?
4. How many bytes travel on the wire for a **1-byte** payload, and what is the amplification?
5. Name the layers this data traverses, and relate the result to the chapter's claim about layering.

**Answer & Explanation:**

**1 — The MSS.** The maximum segment size is the MTU less the headers that must fit inside it:

```
MSS = 1500 - 20 (IP) - 20 (TCP) = 1460 bytes
```

**2 — Segmenting 1 MiB.**

```
payload   = 1 MiB = 1,048,576 bytes
segments  = ceil(1,048,576 / 1460) = 719
full ones = 718 × 1460 = 1,048,280 bytes
last one  = 1,048,576 - 1,048,280 = 296 bytes
```

**3 — Overhead.**

```
IP level:  1,048,576 + 719 × 40  = 1,077,336 bytes
           header cost = 28,760   → 28,760 / 1,077,336 = 2.67%

On wire:   1,048,576 + 719 × 58  = 1,090,278 bytes    (40 + 18 per frame)
           total cost = 41,702    → 41,702 / 1,090,278 = 3.82%
```

For **bulk transfer the overhead is small** — under 4% — because a 1460-byte payload amortises 58 bytes of framing well. That is the case protocol designers optimised for.

**4 — A one-byte payload.** Now the same framing is paid for a single useful byte:

```
1 + 20 (IP) + 20 (TCP) + 18 (Ethernet) = 59 bytes on the wire
amplification = 59×
```

**Amplification ranges over three orders of magnitude depending on message size** — 1.04× for a full segment, 59× for one byte. This is why chatty protocols that send small messages perform so badly, why Nagle's algorithm exists to coalesce small writes, and why an attacker looking for an asymmetric denial-of-service targets exactly this ratio.

**5 — The layers, and the chapter's claim.** Descending the network stack:

| Layer | Contribution |
|---|---|
| **Application** | Uses the **socket interface** — syscalls to connect, send and receive |
| **Transport** — TCP | Breaks data into packets and reassembles; reliability, ordering, flow control (UDP the alternative) |
| **Network** — IP | Packet delivery: addressing and **routing** |
| **Link** | Communication between devices: physical (**MAC**) addressing, and the **NIC driver** |

Each layer adds its own header, which is where the 58 bytes come from, and each adds processing and a possible copy, which is where the **latency** comes from. The chapter's framing is the "fundamental theorem of software engineering" — any problem can be solved by another level of indirection — with the cost stated plainly: **layering hurts performance, especially latency.** Hence high-I/O-performance systems let the application access the NIC or disk **directly, bypassing the OS**.

**The security reading of kernel bypass.** Bypassing the OS also **bypasses the mediation the OS provides**. Question 1's invariants are enforced *because* every access goes through the kernel; a direct hardware path is a deliberate hole in complete mediation, which is why such setups rely on hardware-level isolation (IOMMU, SR-IOV) to restore what the software path was providing. The convenience/security tension of Chapter 3 reappears as a convenience/latency/security triangle.

---

### Question 13 — KASLR entropy and the value of one leaked pointer

**Q:** A kernel randomises its base address among 512 possible 2 MiB-aligned slots.

1. How many bits of entropy is that, and how many guesses would a blind brute force need on average? Why is this not a practical attack?
2. An attacker leaks the kernel pointer `0xFFFFFFFF8A3C1240`, and knows from the distributed binary that this symbol sits at offset `0x3C1240` from the kernel base. Compute the base, and then the address of a symbol at offset `0x9A5B0`.
3. By what factor did one leak reduce the search space?
4. Why does the same leak also break the kernel's **stack canaries**, and what property do the two defences share?

**Answer & Explanation:**

**1 — Entropy and brute force.**

```
512 slots = 2^9  →  9 bits of entropy
expected guesses for a blind search = 512 / 2 = 256
```

**Why this is not practical.** Each **wrong** guess dereferences an address where the attacker believes kernel code sits and it does not — which **crashes the kernel**. Unlike a userspace brute force, where a crashed process is restarted and the attacker retries, a kernel oops takes down **the whole machine**, resetting the randomisation and alerting anyone watching. So the effective number of attempts is close to **one**, and 9 bits of entropy is ample *against guessing*. Its weakness is not the entropy — it is that the entropy can be **learned** rather than guessed.

**2 — Deriving the base and a target.** Because the randomisation applies **one offset to the whole area**, every symbol's distance from the base is **fixed and published in the binary**. So one leak plus one known offset gives the base by subtraction:

```
base   = 0xFFFFFFFF8A3C1240 - 0x3C1240 = 0xFFFFFFFF8A000000
target = 0xFFFFFFFF8A000000 + 0x9A5B0  = 0xFFFFFFFF8A09A5B0
```

Note the base lands on a clean 2 MiB boundary, which is a useful consistency check on the arithmetic — the alignment is a property of how KASLR chooses slots.

**3 — The reduction.**

```
before: 512 candidate bases  (9 bits)
after:    1 candidate base   (0 bits)
```

**A single pointer leak collapses the entire search space** — a factor of 512, and more importantly a change of *kind*: from a probabilistic attack that crashes the machine to a **deterministic** computation. This is precisely why the infoleak rules of Question 4 are stated so absolutely, why the **kernel log should be readable only by the administrator**, and why the padding bytes in Question 11 matter so much. The exploit chain is short: **any** infoleak, however small, followed by full address knowledge.

**4 — Why the same leak breaks canaries too.** Kernel stack canaries use **one canary value for all stack frames on each CPU**. So an attacker who reads the canary once — for instance with a stack buffer **over-read**, which does not even require a write primitive — can **embed the correct value in a subsequent overflow payload**, and the check passes. One leak, and the protection is defeated for every frame on that CPU.

**The shared property.** Both are **probabilistic defences that depend on a single secret being kept**, applied at coarse granularity for performance reasons:

| Defence | The one secret | Granularity chosen for performance | Consequence |
|---|---|---|---|
| KASLR | One base offset | The whole kernel area, not per-function | One leak reveals every address |
| Stack canaries | One canary value | Per CPU, not per frame or per call | One leak forges every check |

Per-function randomisation and per-frame canaries both exist as designs; they are not deployed because the overhead is unacceptable in production, where the budget is a few percent. So the lecture's verdict — **these are not a panacea** — is not a criticism of the implementations but a statement about what a cheap probabilistic defence can buy: they raise the cost of an attack that has **no** infoleak, and contribute nothing once there is one. That is why they are layered with deterministic measures — shadow stacks, guard pages, free-list checks — rather than relied upon.

---

### Question 14 — Quantifying attack surface reduction

**Q:** A container runtime confines an application with **seccomp**, allowing 40 of the kernel's roughly 350 system calls.

1. What proportion of syscall entry points is removed?
2. Given that more than two-thirds of the kernel's ~20M lines is driver code, how many lines is that, and how much is the rest?
3. Why is the number of *reachable syscalls* a better measure of exposure than the number of *lines of code*?
4. What is the stated open problem with this technique, and why is it genuinely hard?

**Answer & Explanation:**

**1 — Syscall filtering.**

```
blocked = 350 - 40 = 310
reduction = 310 / 350 = 88.6% of entry points removed
```

Nearly nine-tenths of the interface becomes unreachable for that application. Since the syscall interface is **the** main user-to-kernel attack surface (Question 3), a vulnerability in any of those 310 handlers is no longer reachable from this process — not mitigated, **unreachable**, which is a stronger property.

**2 — Driver code.**

```
drivers    > 2/3 × 20,000,000 ≈ 13,333,333 LoC   (66.7%)
everything else            ≈  6,666,667 LoC
```

This is the figure behind "the kernel has bugs, particularly in third-party code such as drivers", and behind the microkernel argument for deprivileging drivers.

**3 — Why reachability beats line count.** Lines of code measure how much code *exists*; what matters for a given attacker is how much code they can *reach*. A container that never issues `ioctl` on a graphics device cannot trigger a bug in that driver's `ioctl` handler no matter how many lines it contains, whereas a bug behind a syscall on the allowlist is one call away. The two measures also move independently: **13 million lines of driver code may contribute almost nothing to a particular process's exposure**, while a single reachable handler with a double fetch (Question 20) is a complete privilege escalation. Attack surface is a property of the **boundary**, not of the codebase — which is why the chapter frames it as trust-interface complexity, and why seccomp, which narrows the interface, is deployed in **Docker, Android and Flatpak/AppImage** while "rewrite 20 million lines" is not an option.

The honest limits of the 88.6% figure: syscalls differ enormously in the amount of kernel code they reach — `ioctl` is a single entry point onto an enormous, driver-defined surface, so allowing it concedes far more than 1/350 of the exposure, while `getpid` concedes almost nothing. A count of entry points is a proxy, not a measurement. And filtering does nothing about the **hardware** attack surface, which is why Spectre and Meltdown are unaffected by seccomp.

**4 — The open problem.** **How to derive precise, per-application system call black/whitelists?**

Why it is hard: a list that is **too permissive** gives little benefit, while one that is **too restrictive breaks the application** — and the failure mode is nasty, since a syscall issued on a rare path (an error handler, a fallback, a code path in a library only reached under memory pressure) may not appear in any test run. So static analysis over-approximates to stay safe and dynamic tracing under-approximates by construction, since it observes only executed paths. The set also drifts with every dependency update, and the application does not know which calls libc will make on its behalf.

> Note this is **the same difficulty** as deriving compartmentalisation policies in Chapter 5: in both cases the mechanism is available and cheap, and the hard part is **producing an accurate least-privilege specification for a large program nobody fully understands**. The mechanism is a solved problem; the policy is not.

---

## Part 3: Code Tracing & Output Prediction

### Question 15 — Two `open` calls on one file

**Q:** Give the exact output, and state which VFS structures are involved.

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd1 = open("/tmp/t.txt", O_RDWR | O_CREAT | O_TRUNC, 0644);
    write(fd1, "ABCDEFGH", 8);
    lseek(fd1, 0, SEEK_SET);

    int fd2 = open("/tmp/t.txt", O_RDONLY);      /* a second open */

    char a = 0, b = 0;
    read(fd1, &a, 1);
    read(fd2, &b, 1);

    printf("a=%c b=%c\n", a, b);
    printf("off1=%ld off2=%ld\n",
           (long)lseek(fd1, 0, SEEK_CUR), (long)lseek(fd2, 0, SEEK_CUR));
    return 0;
}
```

**Answer & Explanation:**

**The trace.** `write` puts eight bytes in the file and leaves `fd1`'s offset at 8; `lseek` resets it to 0. The second `open` creates a **new, independent** offset starting at 0. So:

* `read(fd1, &a, 1)` reads from offset 0 → `'A'`, and `fd1`'s offset becomes 1.
* `read(fd2, &b, 1)` reads from **`fd2`'s own** offset 0 → also `'A'`, and `fd2`'s offset becomes 1.

**Exact output:**

```text
a=A b=A
off1=1 off2=1
```

**Why both are `'A'`, and what would prove otherwise.** If the two descriptors shared an offset, the second read would have returned `'B'` and the offsets would print as 2. That they are both 1 is the observable evidence of independence — which is the whole point of the question.

**The structures involved.** Each `open` creates **one file object**, which is the structure holding the **open flags and the file offset**. Both file objects refer to **one inode**, which holds the file's metadata — size, owner, permissions — and one **dentry**, which holds the name and its position in the directory tree. So:

| Structure | How many here | What it holds |
|---|---|---|
| **File object** | **2** — one per `open` | Open flags, **file offset** |
| **Inode** | **1** | Metadata: size, owner UID, permissions |
| **Dentry** | **1** | The name `t.txt` and its location in the tree |
| **Superblock** | 1 per mounted filesystem | Type, mount flags, quotas, mount point |

**Each userspace file descriptor corresponds to one kernel file object**, so opening the same file twice yields **two file objects with independent offsets over one inode**. Keeping these three straight is exactly the distinction a short exam question targets — and note the two access modes differ too, `O_RDWR` versus `O_RDONLY`, which is per-file-object state: a `write` on `fd2` would fail with `EBADF` while succeeding on `fd1`, on the same file.

**A contrast worth knowing.** With `O_APPEND`, each write repositions to the current end of file **atomically** as part of the write, so two independently opened appending descriptors do not overwrite each other — the reason log files can be safely opened by several processes, and the reason `>>` differs from `>` in a shell in more than intent.

---

### Question 16 — `dup` and `fork`: sharing one file object

**Q:** Give the exact output. Explain why it differs from Question 15.

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int fd = open("/tmp/t.txt", O_RDWR | O_CREAT | O_TRUNC, 0644);
    write(fd, "ABCDEFGH", 8);
    lseek(fd, 0, SEEK_SET);

    int fd2 = dup(fd);                    /* same file object, new descriptor */

    char a = 0, b = 0;
    read(fd,  &a, 1);
    read(fd2, &b, 1);
    printf("dup : a=%c b=%c off=%ld\n", a, b, (long)lseek(fd, 0, SEEK_CUR));

    if (fork() == 0) {
        char c = 0;
        read(fd, &c, 1);
        printf("child : c=%c off=%ld\n", c, (long)lseek(fd, 0, SEEK_CUR));
        _exit(0);
    }

    wait(NULL);
    char d = 0;
    read(fd, &d, 1);
    printf("parent: d=%c off=%ld\n", d, (long)lseek(fd, 0, SEEK_CUR));
    return 0;
}
```

**Answer & Explanation:**

**The `dup` part.** `dup` does **not** create a new file object — it creates a **second descriptor pointing at the existing one**. The offset is therefore **shared**:

* `read(fd, &a, 1)` → `'A'`, shared offset becomes 1.
* `read(fd2, &b, 1)` → `'B'`, because it continues from the **same** offset. It becomes 2.

**The `fork` part.** `fork` gives the child a **copy of the descriptor table**, but the copied entries point at the **same file objects**. So the child's `fd` and the parent's `fd` share one offset:

* The child reads at offset 2 → `'C'`, and advances the shared offset to 3.
* The parent, after `wait`, reads at offset **3** → `'D'`, giving 4.

**Exact output:**

```text
dup : a=A b=B off=2
child : c=C off=3
parent: d=D off=4
```

**The contrast with Question 15, in one line.** **Two `open` calls create two file objects (independent offsets); `dup` and `fork` create additional references to one file object (shared offset).** The offset lives in the **file object**, not in the descriptor and not in the inode, so the observable behaviour follows entirely from how many file objects exist.

| Operation | File objects | Offset |
|---|---|---|
| Two `open`s | 2 | Independent |
| `dup` / `dup2` | 1 | **Shared** |
| `fork` | 1 | **Shared across processes** |

**Why the parent's read is not `'C'`.** This is the part that surprises people: `fork` gives the child a private *address space* — Chapter 3's copy-on-write — but file offsets are **not in the address space**. They are kernel state, reached through the descriptor table, and the table entries were copied as **references**. So the isolation that applies to memory does not apply to file position, and a parent and child reading the same descriptor **interleave** rather than each seeing the whole file.

**Why this matters in practice.** It is the mechanism behind shell redirection: a shell opens the output file **once** and `fork`s, so several commands in a pipeline appending to one redirect share an offset and do not overwrite each other. It is also a real bug source — two processes that inherited a descriptor and both `read` will each get *part* of the data, silently, with no error. If you want independent positions after forking, each process must `open` the file itself.

---

### Question 17 — `umask` and the mode of a created file

**Q:** Predict the `ls -l` output for all three objects.

```c
#include <sys/stat.h>
#include <sys/types.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    umask(0022);
    int a = open("/tmp/a", O_CREAT | O_WRONLY, 0666);

    umask(0077);
    int b = open("/tmp/b", O_CREAT | O_WRONLY, 0666);
    mkdir("/tmp/d", 0777);

    umask(0000);
    int c = open("/tmp/c", O_CREAT | O_WRONLY, 0666);

    close(a); close(b); close(c);
    return 0;
}
```

**Answer & Explanation:**

**The rule.** The mode passed to `open` or `mkdir` is a **request**; the kernel applies the process's umask, which **removes** bits: **`final = requested & ~umask`**. The umask is per-process state inherited across `fork` and `execve`.

**The four objects:**

| Object | Requested | umask | Final | `ls -l` |
|---|---|---|---|---|
| `/tmp/a` | `0666` | `0022` | `0644` | `-rw-r--r--` |
| `/tmp/b` | `0666` | `0077` | `0600` | `-rw-------` |
| `/tmp/d` | `0777` | `0077` | `0700` | `drwx------` |
| `/tmp/c` | `0666` | `0000` | `0666` | **`-rw-rw-rw-`** |

Worked for `/tmp/a`: `0022` is `----w--w-`, so `~0022` clears the group-write and other-write bits. `0666` = `rw-rw-rw-` becomes `rw-r--r--` = `0644`.

**Exact output** (owner and group shown as `user`):

```text
-rw-r--r-- 1 user user 0 ... /tmp/a
-rw------- 1 user user 0 ... /tmp/b
-rw-rw-rw- 1 user user 0 ... /tmp/c
drwx------ 2 user user ... /tmp/d
```

**Three things this tests.**

**The umask can only remove, never add.** `open(..., 0666)` with any umask cannot produce a mode with the execute bit set — which is why `0666` rather than `0777` is the conventional request for a regular file: **files should not be created executable**, and that is enforced by the requested mode, not left to the umask.

**`/tmp/c` is the bug.** `umask(0000)` yields `-rw-rw-rw-` — **world-writable**. Any user on the system can modify the file's contents. If anything privileged later reads it as configuration, or executes it, that is a straightforward escalation. A process that sets `umask(0)` — sometimes done to "avoid permission problems" — silently makes every file it subsequently creates world-writable, including ones created much later by unrelated code, since the umask persists.

**Directories need `x`, files do not.** `/tmp/d` at `0700` is usable by its owner because the **execute bit on a directory means "may traverse"**. The same bit means "may run as a program" on a regular file. A directory at `0600` would be listable but not traversable — you could read the names but not `open` anything inside — a distinction that produces genuinely confusing failures.

**The security framing.** This is DAC's first failure mode from Question 5 in miniature: **nothing here is a kernel bug, and every call succeeded.** The system faithfully applied a policy the program stated, and the policy was wrong. That is precisely what "DAC assumes users always behave correctly" means, and why MAC exists — under SELinux the file would additionally carry a type, and a rule would have to permit access regardless of what the mode bits say.

---

### Question 18 — Hard links, inodes, and dentries

**Q:** Give the exact output, and explain what it demonstrates about the relationship between names and files.

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    int fd = open("/tmp/one", O_RDWR | O_CREAT | O_TRUNC, 0644);
    write(fd, "hello", 5);
    close(fd);

    link("/tmp/one", "/tmp/two");            /* a second name */

    struct stat s1, s2;
    stat("/tmp/one", &s1);
    stat("/tmp/two", &s2);
    printf("same inode: %s  nlink=%lu\n",
           (s1.st_ino == s2.st_ino) ? "yes" : "no", (unsigned long)s1.st_nlink);

    unlink("/tmp/one");                      /* remove the first name */

    stat("/tmp/two", &s2);
    printf("after unlink: nlink=%lu size=%lld\n",
           (unsigned long)s2.st_nlink, (long long)s2.st_size);

    char buf[8] = {0};
    int fd2 = open("/tmp/two", O_RDONLY);
    read(fd2, buf, 5);
    printf("content=%s  open(/tmp/one)=%d\n", buf, open("/tmp/one", O_RDONLY));
    return 0;
}
```

**Answer & Explanation:**

**Exact output:**

```text
same inode: yes  nlink=2
after unlink: nlink=1 size=5
content=hello  open(/tmp/one)=-1
```

**Step by step.**

`link` creates a **second directory entry referring to the same inode**. So `stat` on both names reports the **same `st_ino`** — they are not two files but **two names for one file** — and `st_nlink`, the link count stored in the inode, is **2**.

`unlink("/tmp/one")` does not delete a file. It removes a **name**, and decrements the link count to **1**. The inode and its data blocks survive because a reference remains.

The content is therefore still readable through `/tmp/two`, and `st_size` is still 5. Opening the removed name fails, returning **-1** with `errno == ENOENT`.

**What this demonstrates.** **A file's name is not part of the file.** It is part of the directory structure:

| Structure | Contains | This example |
|---|---|---|
| **Inode** | The file's metadata and data pointers — size, owner, permissions, link count | **1** inode |
| **Dentry** | A **name** and its **location in the directory tree** | **2** dentries initially, 1 after `unlink` |

**Two dentries referring to one inode is exactly what a hard link is** — that is the definition, not an analogy. And it explains why `unlink` is named as it is rather than `delete`: the data is freed only when the **link count reaches zero *and* no process holds it open**. A file unlinked while open remains fully usable through the descriptor and disappears when the last one closes, which is how temporary files that survive no crash are built, and why deleting a large log file does not free space while a daemon still holds it open.

**The security relevance.** Because a name is a separate, cheaply created reference, an attacker with write access to a *directory* can manipulate what a name refers to without touching the file — which is the substrate for the TOCTTOU attacks of Chapter 3, for the sticky-bit protection on `/tmp` in Question 9, and for the rule that a privileged program should act on a **file descriptor** (which pins the inode) rather than re-resolving a **path** (which does not). Question 24 turns exactly this observation into a fix.

---

### Question 19 — A sparse file: `st_size` versus `st_blocks`

**Q:** Predict the reported values, and explain the discrepancy.

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <string.h>

int main(void) {
    int fd = open("/tmp/sparse", O_RDWR | O_CREAT | O_TRUNC, 0644);

    lseek(fd, 1048576, SEEK_SET);            /* seek 1 MiB past the start */
    write(fd, "X", 1);

    struct stat st;
    fstat(fd, &st);
    printf("size=%lld blocks=%lld (512B units) = %lld KiB\n",
           (long long)st.st_size, (long long)st.st_blocks,
           (long long)st.st_blocks * 512 / 1024);

    lseek(fd, 0, SEEK_SET);
    unsigned char buf[4] = {0xAA, 0xAA, 0xAA, 0xAA};
    read(fd, buf, 4);
    printf("first bytes: %02x %02x %02x %02x\n", buf[0], buf[1], buf[2], buf[3]);
    return 0;
}
```

**Answer & Explanation:**

**Exact output** (on ext4 with 4 KiB blocks):

```text
size=1048577 blocks=8 (512B units) = 4 KiB
first bytes: 00 00 00 00
```

**Why `st_size` is 1,048,577.** The size is the offset of the **highest byte written, plus one**. Writing one byte at offset 1,048,576 makes the file `1048576 + 1` bytes long. Seeking past the end is legal and does **not** extend the file; only the write does.

**Why `st_blocks` is 8, not 2048.** The region between offset 0 and offset 1,048,576 was never written, so the filesystem **allocates no blocks for it** — it records a **hole**. Only the block containing the written byte is allocated:

```
one 4 KiB block = 4096 / 512 = 8 units       <- what is reported
a dense file would need ceil(1048577/4096) = 257 blocks
                                   = 257 × 8 = 2056 units
```

So `ls -l` reports **1 MiB** while `du` reports **4 KiB**, and both are correct — they measure different things. This is exactly the `st_blocks` trap from Question 10: the unit is **always 512 bytes**, never the filesystem block size and never `st_size / 512`.

**Why reading the hole returns zeros.** A hole reads as **zero bytes**, so the `0xAA` bytes in `buf` are overwritten with `00`. There is no I/O — the kernel simply supplies zeros, since there is no block to read. That is also why creating a huge sparse file is instantaneous.

**Two security-relevant consequences.**

**Reading a hole must return zeros, and this is a correctness requirement, not a convenience.** If it returned the contents of whatever previously occupied a block, every sparse file would be a window into other users' deleted data. This is the filesystem-level version of Question 11's rule about not exposing uninitialised memory, and of Chapter 2's Heartbleed zeroing: **wherever a boundary hands out storage, it must hand out defined content.**

**Sparse files break size-based accounting.** A program that checks available space against `st_size`, or a quota system that trusts apparent size, can be induced to reserve or refuse wildly wrong amounts. Conversely, an archive utility that does not understand holes will **expand** a 4 KiB sparse file into 1 MiB of zeros on copy — a 256× amplification an attacker can drive by creating a file with a very large apparent size, which is a denial-of-service primitive against backup systems.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 20 — A double fetch in an `ioctl` handler

**Q:** This driver handler contains the archetypal kernel vulnerability of this chapter. Identify it precisely, explain how it is exploited, and give a corrected version.

```c
#include <linux/uaccess.h>
#include <linux/errno.h>

struct req {
    unsigned int  len;
    unsigned char data[64];
};

static long dev_ioctl(struct file *f, unsigned int cmd, unsigned long arg)
{
    struct req __user *ureq = (struct req __user *)arg;
    unsigned char kbuf[64];
    unsigned int len;

    if (get_user(len, &ureq->len))          /* FIRST fetch of len */
        return -EFAULT;

    if (len > sizeof(kbuf))                 /* the check */
        return -EINVAL;

    if (copy_from_user(kbuf, ureq->data, ureq->len))   /* SECOND fetch of len */
        return -EFAULT;

    process(kbuf, len);
    return 0;
}
```

**Answer & Explanation:**

**The bug.** The length is fetched from userspace **twice**. It is validated once, as the local `len`, but the `copy_from_user` call re-reads **`ureq->len`** — the userspace value — rather than using the validated copy. This is a **double fetch**, the kernel-specific form of **TOCTTOU**.

**The exploit, step by step.** The attacker needs two threads sharing an address space — no privilege and no other bug required, since the memory being modified is their own:

1. Thread A sets `ureq->len = 8` and issues the `ioctl`.
2. The kernel executes `get_user`, reading **8**, and the check `8 > 64` fails, so validation **passes**.
3. **Thread B, running concurrently on another core, writes `ureq->len = 0xFFFFFFFF`.**
4. The kernel reaches `copy_from_user(kbuf, ureq->data, ureq->len)` and re-reads the length, now getting a value far larger than 64.
5. `copy_from_user` writes that many bytes into `kbuf`, **a 64-byte kernel stack buffer** — a kernel stack buffer overflow, overwriting saved registers and the return address in **kernel context** with attacker-controlled data.

**Why the window is winnable.** The attacker does not need to hit a narrow instant: they spin in a tight loop flipping the value between 8 and a huge number while repeatedly issuing the `ioctl`. One success is enough, failures cost nothing, and **multicore hardware means no scheduling race is needed at all** — thread B simply writes continuously while thread A calls in. This is why the double fetch went from a theoretical concern to a routinely exploited class.

**The impact.** A kernel stack overflow is the strongest possible primitive: it yields **code execution in kernel context with full privilege**, which is the top item on the attacker's wish list from this chapter — leak or tamper with kernel memory, reach any process's memory, install and hide a rootkit. Kernel stack canaries offer some resistance but share **one value per CPU**, so a prior 9-byte infoleak (Question 11) defeats them.

**The corrected version — copy once, validate the copy, use the copy:**

```c
static long dev_ioctl(struct file *f, unsigned int cmd, unsigned long arg)
{
    struct req __user *ureq = (struct req __user *)arg;
    struct req kreq;                       /* a KERNEL copy */

    /* One single fetch of the whole structure into kernel memory. */
    if (copy_from_user(&kreq, ureq, sizeof(kreq)))
        return -EFAULT;

    /* Validate the copy. Userspace cannot reach kreq. */
    if (kreq.len > sizeof(kreq.data))
        return -EINVAL;

    /* Use the same validated copy — ureq is never touched again. */
    process(kreq.data, kreq.len);
    return 0;
}
```

**Why this is the only real fix.** Once `kreq` is in kernel memory, **no thread of the calling process has any mapping for it**, so check-then-use is **atomic with respect to the attacker** — not by locking, not by disabling preemption, but because the attacker has been structurally removed from the data. Note what the fix is *not*: re-checking after the copy would still be a double fetch, and comparing the two fetched values would merely narrow the window. The rule is **fetch once, into kernel space, then never re-read the userspace original.**

**How to catch it.** The `__user` annotation is the tool: **Sparse** knows `ureq` is a userspace pointer, and a pattern-based checker (**Coccinelle**, **Smatch**) can flag a `__user` dereference appearing in the argument list of a `copy_from_user` after a value from the same structure has already been validated. This is the point of `__user` — it makes the invisible property "this pointer is not safe to dereference casually" into something the toolchain can check. **Syzkaller** can also find it, since its Syzlang grammar knows the relationship between length parameters and the buffers they describe.

---

### Question 21 — A kernel infoleak

**Q:** Identify both defects, quantify the leak, and give a corrected version.

```c
#include <linux/uaccess.h>

struct event {
    int    type;
    char   flag;
    long   timestamp;
    short  code;
    void  *handle;
};

static long get_event(struct event __user *out, struct obj *o)
{
    struct event ev;

    ev.type      = o->type;
    ev.flag      = o->flag;
    ev.timestamp = ktime_get();
    ev.code      = o->code;
    ev.handle    = o;                     /* the object's kernel address */

    if (copy_to_user(out, &ev, sizeof(ev)))
        return -EFAULT;
    return 0;
}
```

**Answer & Explanation:**

**Defect 1 — uninitialised padding is copied to userspace.** `struct event ev;` is an uninitialised **kernel stack** variable. Every *member* is assigned, so the code looks complete — but under LP64 the layout has two holes:

| Bytes | Contents |
|---|---|
| 0–3 | `type` |
| 4 | `flag` |
| **5–7** | **padding — never written (3 bytes)** |
| 8–15 | `timestamp` |
| 16–17 | `code` |
| **18–23** | **padding — never written (6 bytes)** |
| 24–31 | `handle` |

`sizeof(struct event)` is **32**; the members total **23**; so **9 bytes per call** of prior kernel stack contents are copied out — saved registers, return addresses, remnants of earlier syscall arguments, fragments of other users' data. **100 calls leak 900 bytes**, and the call is unprivileged and repeatable.

**Defect 2 — a kernel pointer is deliberately exposed.** `ev.handle = o` copies a **kernel address** to userspace. This breaks two of the chapter's rules at once: *avoid exposing kernel pointers to userspace*, and *do not use addresses as resource identifiers*. Even with the padding fixed, this structure's **design** leaks an address on every call — it is an **infoleak by construction**, and no amount of care elsewhere compensates.

**Why either defect alone is a full KASLR break.** KASLR applies **one offset to the entire kernel area**, so one leaked pointer whose static offset is known gives the base by subtraction, and thereafter every address (Question 13: 512 candidates collapse to 1). The same leak also yields the **stack canary**, which is **one value per CPU**. So a 9-byte-per-call leak is not a minor hygiene problem — it is the enabling first stage of the Question 20 exploit.

**The corrected version:**

```c
static DEFINE_IDR(event_idr);              /* id -> object lookup */

static long get_event(struct event __user *out, struct obj *o)
{
    struct event ev;

    /* (1) Zero the WHOLE object, padding included. */
    memset(&ev, 0, sizeof(ev));

    ev.type      = o->type;
    ev.flag      = o->flag;
    ev.timestamp = ktime_get();
    ev.code      = o->code;

    /* (2) An opaque id from a counter, never an address. */
    ev.id        = o->id;                  /* assigned at creation from an IDR/atomic counter */

    if (copy_to_user(out, &ev, sizeof(ev)))
        return -EFAULT;
    return 0;
}
```

with the structure's pointer member replaced by an integer handle:

```c
struct event {
    long   timestamp;      /* largest alignment first: no interior padding */
    unsigned int id;        /* opaque handle, NOT an address */
    int    type;
    short  code;
    char   flag;
    /* 1 byte trailing padding — still zeroed by the memset */
};
```

**The three fixes and why each is phrased that way.**

**`memset` over `sizeof`, not `= {0}`.** The standard guarantees `= {0}` initialises every **member**; padding bytes are explicitly left unspecified. GCC and Clang do zero them in practice, but that is an implementation property, not a guarantee. `memset(&ev, 0, sizeof(ev))` covers the whole object by construction, which is why kernel code uses it.

**An id from a counter, resolved through a lookup table.** The kernel keeps the id→object mapping (an IDR, or an atomic counter plus a table) and userspace holds only the id. This is the same design as a **file descriptor**: a small integer that designates a kernel object without revealing anything about where it lives. The address becomes unguessable *and* unnecessary.

**Reordering members to remove the holes.** Declaring largest-alignment-first eliminates the interior padding entirely, so the structure is robust even if someone later adds a field and forgets the `memset`. Do **not** reach for `__packed` — it produces misaligned members, and taking a pointer to one is undefined behaviour.

**Detection.** This is what **KASAN** and the kernel's uninitialised-memory checking are for; a **Coccinelle** or **Smatch** pattern can also flag a `copy_to_user` of a stack structure with no preceding `memset`, and flag structures containing pointer members that reach `copy_to_user` at all. The general principle, as in Question 11: **whenever a structure crosses a trust boundary the unit of transfer is `sizeof`, not the sum of the members** — so everything `sizeof` covers must be initialised.

---

### Question 22 — A missing permission check

**Q:** Identify the defects in this handler and give a corrected version. Explain which vulnerability class this belongs to, and why it is not a memory-safety bug.

```c
#define DEV_SET_DEBUG_LEVEL  0x1001
#define DEV_SET_UID_FILTER   0x1002
#define DEV_GET_HANDLE       0x1003

static int debug_level;
static uid_t uid_filter;
static struct obj internal_obj;

static long dev_ioctl(struct file *f, unsigned int cmd, unsigned long arg)
{
    switch (cmd) {
    case DEV_SET_DEBUG_LEVEL:
        debug_level = (int)arg;            /* verbose logging of kernel internals */
        return 0;

    case DEV_SET_UID_FILTER:
        uid_filter = (uid_t)arg;           /* whose events this device reports */
        return 0;

    case DEV_GET_HANDLE:
        return (long)&internal_obj;        /* a kernel address, returned to userspace */
    }
    return -ENOTTY;
}
```

**Answer & Explanation:**

**Defect 1 — no permission check on privileged operations.** Any process that can open the device file can raise `debug_level`, which by design causes the kernel to log internal state. Kernel logs routinely contain **pointers**, so an unprivileged user can turn on a firehose of KASLR-breaking information — which is precisely why the chapter's rules say the **kernel log should be readable only by the administrator**. There is no `capable()` check anywhere.

**Defect 2 — a security-relevant parameter accepted from an unprivileged caller.** `DEV_SET_UID_FILTER` lets the caller select **whose** events the device reports. Setting it to another user's UID — or to 0 — makes the device disclose that user's activity. The operation is not merely unauthenticated; it is **authorisation-relevant**, and nothing checks that the caller may act for the requested UID.

**Defect 3 — a kernel address returned as a handle.** `DEV_GET_HANDLE` hands `&internal_obj` to userspace, breaking both *avoid exposing kernel pointers* and *do not use addresses as resource identifiers*. It is also returned through the `long` return value of `ioctl`, which is how success codes travel — so a caller cannot distinguish it from a large positive status, and a future refactor could leak it into a log.

**Defect 4 — `arg` is used without validation.** `debug_level` takes an arbitrary `int`, and `uid_filter` an arbitrary `uid_t`, with no range check. Even benign-looking values matter: a negative or enormous debug level may index a table of log-level strings.

**The vulnerability class, and why it is not memory safety.** These are **missing permission checks** and **missing pointer/value checks** — the first two classes in the kernel vulnerability study, and **neither is a memory-safety bug**. No buffer overflows, no use-after-free, no undefined behaviour. Rewriting this handler in Rust would fix **none** of it.

> **The distinction to state in an exam.** The kernel has two sources of vulnerability. It is **written in C**, so it inherits every Chapter 2 bug class. *And* it is a **privileged mediator**, so it has an additional class consisting of **forgetting to verify an authorisation that only it is in a position to verify**. A memory-safe language addresses the first and does nothing for the second — which is why the answer to "would Rust fix kernel security?" is "partly", and this handler is the example.

**The corrected version:**

```c
static long dev_ioctl(struct file *f, unsigned int cmd, unsigned long arg)
{
    switch (cmd) {
    case DEV_SET_DEBUG_LEVEL: {
        int level = (int)arg;

        if (!capable(CAP_SYS_ADMIN))              /* (1) authorise first */
            return -EPERM;
        if (level < 0 || level > DEBUG_MAX)       /* (4) validate the value */
            return -EINVAL;

        debug_level = level;
        return 0;
    }

    case DEV_SET_UID_FILTER: {
        kuid_t want = make_kuid(current_user_ns(), (uid_t)arg);

        if (!uid_valid(want))                     /* (4) */
            return -EINVAL;
        /* (2) may the caller act for this uid at all? */
        if (!uid_eq(want, current_uid()) && !capable(CAP_SYS_ADMIN))
            return -EPERM;

        uid_filter = want;
        return 0;
    }

    case DEV_GET_HANDLE: {
        /* (3) an opaque id from a counter, never an address */
        u32 id = internal_obj.id;

        if (copy_to_user((void __user *)arg, &id, sizeof(id)))
            return -EFAULT;
        return 0;
    }
    }
    return -ENOTTY;
}
```

**Four points about the corrected form.** The capability check comes **before** any state change, so a failed authorisation has no side effects. Authorisation is expressed as a **capability** (`CAP_SYS_ADMIN`) rather than `uid == 0`, which is the finer-grained mechanism and the right one to name. The UID case shows the general shape of an authorisation check — *may this subject perform this operation on this object?* — which is Lampson's matrix applied at a syscall boundary, with `current_uid()` as the subject rather than whatever the caller claims. And the handle is now an **id copied out through a pointer argument**, keeping the return value purely a status code.

**Where the check belongs in the stack.** Note that this is a **DAC-style** check inside a driver, and it composes with the rest: reaching this handler at all required passing the **file permission** check on the device node, and then the **LSM hook** — so a policy could deny the `ioctl` even for root. Question 5's ordering applies: **basic checks, then DAC, then LSM**, and **all** must permit. Getting the device node's mode right (not world-writable) is part of the fix, not an alternative to it.

---

### Question 23 — A setup script that gives away root

**Q:** This installation script contains four security defects. Identify each, explain the concrete attack, and give a corrected version.

```bash
#!/bin/sh
set -e

umask 0

mkdir -p /var/lib/app/spool
chmod 777 /var/lib/app/spool

install -m 4777 ./helper /usr/local/bin/helper

cp ./app.conf /etc/app.conf
chmod 666 /etc/app.conf
```

**Answer & Explanation:**

**Defect 1 — `umask 0`.** Every file created by this script *and by anything it runs* is created **world-writable** (Question 17: `0666 & ~0 = 0666`). The umask is inherited across `fork` and `execve`, so it silently affects far more than the visible lines.

**Defect 2 — `chmod 777` on a shared directory with no sticky bit.** `drwxrwxrwx` means **any user can create, rename and delete entries** — including entries belonging to other users. An attacker can delete another user's spool file, or replace it with a **symlink** to somewhere sensitive so that the next privileged write follows it. This is the substrate for the TOCTTOU and confused-deputy attacks of Question 24.

The fix for a genuinely shared directory is the **sticky bit** — `1777`, `drwxrwxrwt` — under which **only a file's owner may delete or rename it**. That is exactly why `/tmp` is `1777` and not `0777`.

**Defect 3 — `install -m 4777` is instant root for any local user.** The mode is `-rwsrwxrwx`: **setuid root and world-writable**. Any user can overwrite the binary's contents, and the setuid bit means the kernel then runs **their** code as **root**:

```
cp /bin/sh /usr/local/bin/helper     # world-writable
/usr/local/bin/helper                # runs setuid root -> root shell
```

No exploitation, no race, no memory-safety bug — a two-line escalation. A setuid binary must be **writable only by its owner**: `4755`. The general principle: **whenever a file's permissions determine what privilege its contents obtain, write access to that file is equivalent to that privilege** — which applies equally to anything in the boot path, in `/etc/cron.d`, or on the loader's library search path.

**Defect 4 — a world-writable configuration file.** `chmod 666 /etc/app.conf` lets any user rewrite the configuration a privileged service reads. Depending on what the file can express — a log path, a plugin directory, a `LD_PRELOAD`-like hook, a command to run — this ranges from denial of service to direct code execution as the service's user. Configuration read by a privileged process is **input crossing a trust boundary**, and making it world-writable moves it from "partially trusted" to "attacker-controlled".

**The corrected version:**

```bash
#!/bin/sh
set -eu

umask 022                                   # (1) sane default: no group/other write

# (2) private data directory, owned by the service account
install -d -o appsvc -g appsvc -m 0750 /var/lib/app/spool
#   if it genuinely must be shared between users, use the sticky bit:
#   install -d -o root -g root -m 1777 /var/lib/app/shared

# (3) not setuid at all; if it must be, 4755 and root-owned
install -o root -g root -m 0755 ./helper /usr/local/bin/helper

# (4) configuration readable by the service, writable only by root
install -o root -g appsvc -m 0640 ./app.conf /etc/app.conf
```

**Why the biggest fix is dropping setuid entirely.** The reason `helper` was setuid was presumably that it needs a privilege an ordinary user lacks. A setuid binary is a **deputy**, and Question 24 shows how easily a deputy is confused — it inherits the caller's environment, arguments, descriptors, working directory and resource limits, all attacker-influenced. The modern alternative is a **service with a socket**: the privileged work happens in a long-running process started by init with a known-good environment, and unprivileged clients send requests over a UNIX socket. The kernel authenticates the peer (`SO_PEERCRED`) instead of the deputy having to reconstruct who is asking, and the attack surface shrinks from "everything a process inherits" to "the messages the protocol defines".

**The framing that ties this to the chapter.** **Nothing here is a kernel bug, and every command succeeded.** The system faithfully enforced a policy that was stated incorrectly — which is exactly DAC's first failure mode: *it assumes users always behave correctly*, and administrators are users. This is the argument for **MAC**: under SELinux, `helper` would carry a type, and even a world-writable setuid binary could not be used to reach resources no rule permits — the guarantees would survive the misconfiguration, because the configuration is not the user's to change. And it is the argument for least privilege via a service account rather than root: `appsvc` owning the spool directory means a compromise of the service reaches the spool and not the machine.

---

### Question 24 — A confused deputy in a privileged service

**Q:** A logging daemon runs as root so it can write to protected locations. Explain why this is a confused deputy, why tightening file permissions cannot fix it, and give two fixes — one confining the deputy, one eliminating it using a capability.

```c
/* Runs as root. Clients send a target path and a line to append. */
void handle_request(const char *path, const char *line)
{
    int fd = open(path, O_WRONLY | O_CREAT | O_APPEND, 0644);
    if (fd < 0)
        return;

    write(fd, line, strlen(line));
    write(fd, "\n", 1);
    close(fd);
}
```

**Answer & Explanation:**

**Why this is a confused deputy.** The **client supplies the designation** — which file to write — and the **daemon supplies the authority** — root's write access to the whole filesystem. **Nothing binds the two together.** The daemon has no idea whether the requesting client may write the path it named, and never asks.

The attack is a single request:

```
path = "/etc/cron.d/pwn",  line = "* * * * * root /tmp/x.sh"
path = "/root/.ssh/authorized_keys",  line = "ssh-rsa AAAA..."
path = "/etc/ld.so.preload", line = "/tmp/evil.so"
```

Any of these converts "append a line to a log" into **arbitrary code execution as root**. And because the path is resolved fresh on each request, a symlink planted in a writable directory redirects the write even for a path that looks safe — the Question 18 observation that a name is a cheap, separately controlled reference.

**Why permissions cannot fix it.** This is the crucial point, and it is the compiler/`billing.txt` example in production form. **There is no misconfiguration to correct**: the daemon *genuinely needs* write access to protected log locations, and **every individual operation is permitted** by the policy as written. At the moment of the write the executing subject is the **daemon**, and the daemon is authorised; the **client's** lack of authority is simply not consulted, because the client is not the subject any more.

Tightening the ACL either breaks logging or leaves the attack intact. Adding **MAC** helps — SELinux would confine the daemon to files of a permitted type, so `/etc/cron.d` becomes unreachable — but note what that achieves: it **bounds the blast radius** without addressing the structural flaw. Within the set of files the policy allows, the client still chooses, and one client can still overwrite another's log. Attribute the bug to **the separation of designation from authority**, not to a permission mistake.

**Fix 1 — confine the deputy: accept a name, not a path.** If the interface must stay string-based, remove the client's ability to designate anything outside one directory:

```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <fcntl.h>
#include <unistd.h>

static int valid_name(const char *s)
{
    size_t n;
    if (s == NULL)
        return 0;
    n = strlen(s);
    if (n == 0 || n > 32)
        return 0;
    for (const char *p = s; *p; p++)                 /* allowlist, not blocklist */
        if (!isalnum((unsigned char)*p) && *p != '_' && *p != '-')
            return 0;
    return 1;                                        /* no '/', no '.' -> no traversal */
}

void handle_request(const char *name, const char *line)
{
    static int logdir = -1;
    char file[40];
    int fd;

    if (!valid_name(name))
        return;

    if (logdir < 0) {
        logdir = open("/var/log/app", O_RDONLY | O_DIRECTORY);   /* opened ONCE */
        if (logdir < 0)
            return;
    }

    snprintf(file, sizeof(file), "%s.log", name);

    /* Resolved relative to a pinned directory; refuses symlinks. */
    fd = openat(logdir, file, O_WRONLY | O_CREAT | O_APPEND | O_NOFOLLOW | O_CLOEXEC, 0640);
    if (fd < 0)
        return;

    write(fd, line, strlen(line));
    write(fd, "\n", 1);
    close(fd);
}
```

Three properties do the work: the client supplies a **name**, not a path, so `../` and absolute paths are not expressible; `openat` against a **directory descriptor opened once** pins the target directory, so it cannot be swapped underneath; and `O_NOFOLLOW` refuses a symlink outright.

**Fix 2 — eliminate the deputy: let the client pass a capability.** The structural fix is to stop the daemon from designating anything at all. The client opens the file **with its own authority** and passes the **open file descriptor** over a UNIX socket using `SCM_RIGHTS`:

```c
#include <sys/socket.h>
#include <unistd.h>
#include <string.h>

/* Receive one descriptor from the client, then write to exactly that object. */
int recv_fd(int sock)
{
    struct msghdr msg = {0};
    struct iovec  io  = { .iov_base = (char[1]){0}, .iov_len = 1 };
    char cbuf[CMSG_SPACE(sizeof(int))] = {0};
    struct cmsghdr *cm;

    msg.msg_iov        = &io;
    msg.msg_iovlen     = 1;
    msg.msg_control    = cbuf;
    msg.msg_controllen = sizeof(cbuf);

    if (recvmsg(sock, &msg, 0) <= 0)
        return -1;

    cm = CMSG_FIRSTHDR(&msg);
    if (cm == NULL || cm->cmsg_level != SOL_SOCKET || cm->cmsg_type != SCM_RIGHTS)
        return -1;

    int fd;
    memcpy(&fd, CMSG_DATA(cm), sizeof(fd));
    return fd;
}

void handle_request(int sock, const char *line)
{
    int fd = recv_fd(sock);
    if (fd < 0)
        return;

    write(fd, line, strlen(line));     /* no path, no lookup, no authority of ours */
    write(fd, "\n", 1);
    close(fd);
}
```

**Why this dissolves the problem rather than blocking it.** A file descriptor is **very nearly a capability**: it **conflates designation and permission** — it names one specific open file object *and* carries the access mode it was opened with; it is **unforgeable**, since the only way to get one is for another domain to give you one; and it is obtained here exactly as the capability model prescribes, by a **domain copying one of its own and passing it on**.

So the client can only hand over a descriptor for a file **it was itself permitted to open**. The kernel performed the check, at open time, **against the client's identity**. `/etc/cron.d/pwn` is not something an unprivileged client can open for writing, so it is not something it can pass. The daemon's root authority is never applied to a client-chosen name because **the daemon no longer resolves names at all** — the attack becomes **inexpressible**, not merely denied.

**The comparison to state.** Fix 1 keeps the deputy and **bounds** what it can be confused into touching — good, but it relies on a check that could be incomplete, and every future feature risks widening it. Fix 2 removes the deputy's discretion entirely, which is **least privilege expressed structurally**. This is precisely the compiler example's resolution — the statistics capability granted **directly by the kernel rather than passed through the shell**, so authority is never accumulated by an intermediary. Note too that Question 25 is the same insight read backwards: a descriptor is a capability, so **leaking one across `execve` hands authority to code that was never meant to have it.**

---

### Question 25 — A leaked descriptor and an ignored return value

**Q:** Identify the two defects, explain the security consequence of each, and give a corrected version.

```c
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

int serve(int sock, const char *plugin)
{
    char key[4096];
    int  fd = open("/etc/app/secret.key", O_RDONLY);
    if (fd < 0)
        return -1;

    ssize_t n = read(fd, key, sizeof(key));
    close(fd);

    int logfd = open("/var/log/app/audit.log", O_WRONLY | O_APPEND | O_CREAT, 0640);

    pid_t pid = fork();
    if (pid == 0) {
        char *argv[] = { (char *)plugin, NULL };
        char *envp[] = { NULL };
        execve(plugin, argv, envp);
        _exit(127);
    }
    waitpid(pid, NULL, 0);

    write(sock, key, n);
    return 0;
}
```

**Answer & Explanation:**

**Defect 1 — descriptors leak across `execve` because `O_CLOEXEC` is missing.** `fork` copies the descriptor table, and `execve` **preserves** it by default — only descriptors marked close-on-exec are closed. So the untrusted plugin starts life holding:

* **`logfd`**, an append-only handle to the privileged audit log, which it can use to forge or flood audit entries — defeating exactly the forensic record that would show what it did; and
* **`sock`**, the client connection, which it can read from or write to, impersonating the server.

The key descriptor happens to be closed before the `fork`, which is the one thing this code gets right — but only by luck of ordering. Had the `close(fd)` come later, the plugin would have inherited a read handle on the **private key** itself.

**Why this is more than untidiness.** Recall from Question 24 that **a file descriptor is essentially a capability** — it fuses designation and permission, and it is unforgeable, so possessing one *is* the authority. Leaking one across `execve` therefore **hands authority to code that was never granted it**, and the plugin did not need to open anything, guess a path, or defeat a permission check. It is a capability system's failure mode — over-broad delegation — occurring inside an ACL system, where nothing will flag it: the plugin's own UID may have no access to `/var/log/app/audit.log` at all, and it does not need any, because permissions are checked at **`open`** time and never re-checked on an inherited descriptor.

**Defect 2 — `read` and `write` return values are mishandled.** Three separate problems:

* `n` from `read` is used without checking for **-1**. On error `write(sock, key, n)` is called with `n == -1`, which converts to a huge `size_t`, so the kernel is asked to send about 18 exabytes from a 4 KiB stack buffer — an out-of-bounds read of the stack, sending its contents to the client until it faults. **This is Heartbleed's shape exactly**: an unvalidated length used as a transfer size.
* A **short read** is possible even on success — `read` may return fewer bytes than requested — so `key` may be partially filled while `n` correctly describes it. That part is handled, but only because `n` is used rather than `sizeof(key)`; using the latter would leak the uninitialised remainder of the buffer.
* `write` may perform a **partial write**, and its return value is discarded, so part of the response is silently dropped. Ignoring it also discards `EPIPE` and `ENOSPC`, and for `logfd` means audit records can vanish with no indication.

**The corrected version:**

```c
#include <errno.h>            /* EINTR */

static ssize_t write_all(int fd, const void *buf, size_t len)
{
    const char *p = buf;
    size_t left = len;

    while (left > 0) {
        ssize_t w = write(fd, p, left);
        if (w < 0) {
            if (errno == EINTR)
                continue;                  /* retry, don't lose data */
            return -1;
        }
        if (w == 0)
            return -1;
        p    += w;
        left -= (size_t)w;
    }
    return (ssize_t)len;
}

int serve(int sock, const char *plugin)
{
    char key[4096];
    ssize_t n;
    int fd, logfd;
    pid_t pid;

    /* (1) O_CLOEXEC on every descriptor, set atomically at open time. */
    fd = open("/etc/app/secret.key", O_RDONLY | O_CLOEXEC);
    if (fd < 0)
        return -1;

    /* (2) check for error explicitly; n is then a valid length. */
    n = read(fd, key, sizeof(key));
    close(fd);
    if (n < 0)
        return -1;

    logfd = open("/var/log/app/audit.log",
                 O_WRONLY | O_APPEND | O_CREAT | O_CLOEXEC, 0640);
    if (logfd < 0)
        return -1;

    pid = fork();
    if (pid < 0) {
        close(logfd);
        return -1;
    }
    if (pid == 0) {
        char *argv[] = { (char *)plugin, NULL };
        char *envp[] = { "PATH=/usr/bin:/bin", NULL };

        /* Belt and braces: the plugin inherits nothing but stdio. */
        closefrom(3);                      /* or close_range(3, ~0U, 0) on Linux 5.9+ */

        execve(plugin, argv, envp);
        _exit(127);
    }

    if (waitpid(pid, NULL, 0) < 0) {
        close(logfd);
        return -1;
    }

    /* (2) handle partial writes and report failure. */
    if (write_all(sock, key, (size_t)n) < 0) {
        close(logfd);
        return -1;
    }

    close(logfd);
    return 0;
}
```

**Why `O_CLOEXEC` at `open` rather than `fcntl` afterwards.** Setting the flag as part of `open` is **atomic**. The two-step form — `open` then `fcntl(fd, F_SETFD, FD_CLOEXEC)` — leaves a window in which another **thread** may `fork` and `exec`, inheriting the descriptor. Same reasoning as Question 20: a check-and-then-act sequence with an attacker-reachable gap is a race, and the fix is to make it one operation. The `close_range`/`closefrom` call is defence in depth for descriptors opened by libraries you do not control.

**The general rules.** **Every descriptor should be `O_CLOEXEC` unless you have decided deliberately to pass it to a child** — the default inheritance is a legacy of when `fork`+`exec` plumbing was done by hand, and it fails open. And **every `read` and `write` return value must be handled**: `-1` for error, a short count as a normal outcome, and never a length used as a size without being checked first — which is the single lesson shared by Heartbleed, the double fetch in Question 20, and this function.

---

## Answer Key Summary

| # | Topic | Key answer |
|---|---|---|
| 9 | Permissions | `-rwxr-xr-x` = **0755**; `04755` = `-rwsr-xr-x`; `01777` = `drwxrwxrwt`; `0666 & ~022` = **0644** |
| 10 | Blocks | 10,000 B → **3** blocks, **2,288** B wasted, `st_blocks` = **24**; 1M × 100 B → **40.96×** overhead; 1-byte read = **4096×** |
| 11 | Struct padding | `sizeof` = **32**, payload 23, **9** padding bytes (5–7 and 18–23) → **900 B** leaked per 100 records |
| 12 | Packets | MSS **1460**; 1 MiB → **719** segments; **2.67%** IP overhead, **3.82%** on the wire; 1 byte → **59 B** = 59× |
| 13 | KASLR | **9** bits = 512 slots, ~256 blind guesses (each crashes the kernel); one leak → **1** candidate; base `0xFFFFFFFF8A000000` |
| 14 | Attack surface | 40 of 350 syscalls → **88.6%** of entry points removed; drivers ≈ **13.3M** of 20M LoC |
| 15 | Two `open`s | `a=A b=A`, `off1=1 off2=1` — **two file objects**, one inode |
| 16 | `dup` / `fork` | `a=A b=B off=2`, child `c=C off=3`, parent `d=D off=4` — **one shared** file object |
| 17 | `umask` | `0644`, `0600`, `0700`, and `0666` (`-rw-rw-rw-`, the bug) |
| 18 | Hard links | `same inode: yes nlink=2`, then `nlink=1 size=5`, content intact, `open` of the removed name = **-1** |
| 19 | Sparse file | `size=1048577 blocks=8` (4 KiB, not 2048 units); the hole reads as **zeros** |

**The chapter's load-bearing claims:**

* **Two process-level invariants**, and user/kernel isolation has **two clauses** — no direct access to kernel memory, **and** entry only at a safe point.
* **The basic trust model does not reflect reality**, and each broken assumption motivates a later topic — the **untrusted owner** motivating TEEs.
* The syscall interface is the main user→kernel attack surface; everything crossing it is untrusted; the **double fetch** is fixed **only** by copying into kernel space and validating the copy, because that removes the attacker from the data.
* **SMEP/SMAP** counter **ret2usr**; the bypass is **ret2dir**. Canaries share **one value per CPU**; KASLR uses **one offset** for the whole area — so **any** infoleak breaks both.
* Two kernel bug classes are **not** memory-safety bugs: missing **pointer** and missing **permission** checks.
* **DAC assumes users behave correctly**; MAC's guarantees survive **malicious software outside the TCB**. **SELinux is policy, LSM is mechanism**, and **DAC is checked before LSM** — both must permit.
* The **confused deputy** comes from **separating designation from authority**; a **capability** conflates them, is unforgeable, and makes the attack **inexpressible**. A **file descriptor** is the everyday example.
* A **TEE** provides **confidentiality and integrity only** — **availability is explicitly out of scope**, because the attacker can simply refuse to run it. Organise SGX/SEV/TrustZone by **granularity**; only TrustZone lacks **memory encryption**.
* **Unikernels sit on the faster, less secure side** — strong **external** isolation between VMs, **no internal** isolation between application and libOS.
