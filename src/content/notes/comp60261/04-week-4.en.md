---
subject: COMP60261
chapter: 4
title: "Week 4"
language: en
---

# COMP60261 — Week 4: Operating Systems, Part 2

**Scope:** the storage and network I/O stacks; the OS security invariants and the trust model that underpins them; kernel hardening and bug detection; user-level access control (DAC, MAC, capabilities); trusted execution environments; and how kernel design models trade security against performance.

**Covers lectures:** 17 Storage and Network · 18 OS Security Concepts 1 · 19 OS Security Concepts 2 · 20 Trusted Execution Environments · 21 OS Models and Security

---

# Part 1 — Storage and network (Lecture 17)

## 1.1 Framing: I/O as stacked indirection

A computer is CPU + memory + I/O. The two I/O classes present in essentially every machine are **storage** and **network** — servers often have nothing else, and embedded devices with no screen, keyboard or mouse still need persistence and communication.

Both are managed through **stacked layers of software**. The lecturer invokes the "fundamental theorem of software engineering" — *any problem can be solved by introducing another level of indirection* — and presents the storage stack as an illustration of it.

> **Exam flag.** The framing matters more than any individual layer. Be able to name both stacks top-to-bottom, and to state the **cost** of the layering: it hurts performance, especially **latency**. High-I/O-performance systems therefore let the application access the disk or NIC **directly, bypassing the OS** — kernel bypass. That trade (abstraction vs latency) is the summary point of the lecture.

## 1.2 The storage stack, layer by layer

| Layer | Responsibility |
|---|---|
| **Application** | Accesses files via system calls: `open`, `read`, `write`, `lseek` |
| **VFS** | Abstracts all filesystems under one common interface |
| **Concrete filesystem** | Defines how data and metadata are laid out on the medium |
| **Page cache** | Buffers all file data in RAM |
| **Block layer** | Manages requests to disk-like devices; I/O scheduling |
| **Device mapper** *(optional)* | Virtual block devices over physical ones |
| **Low-level protocols** | USB, SCSI, NVMe, SATA |
| **Driver** | Speaks to one specific model of device |

### Virtual File System (VFS)

Abstracts every supported filesystem behind the same syscall interface, translating those calls into concrete filesystem operations. Three benefits:

- **Applications need not know** which filesystem holds the files they access.
- **Multiple filesystems can be mounted in a single directory tree.**
- It **factorises code** that would otherwise be reimplemented per filesystem — especially data and metadata **caching**.

### Concrete filesystems

Linux supports **tens** of them, and the variety is the point — the same interface covers radically different media:

- **Disk-based** (HDD/SSD) — e.g. ext4
- **RAM-based** — ramfs, tmpfs
- **Pseudo filesystems** storing no data at all — `/proc`, `/sys`
- **Network filesystems** — NFS
- **Other media** — optical, embedded flash chips

Filesystems targeting non-block devices issue requests to **other subsystems** entirely: NFS goes to the **network stack**; embedded flash goes through the **Memory Technology Device** subsystem.

### Page cache

Buffers **all** file data in RAM:

- Data **read** is retained in case it is read again.
- Data **written** is retained for a time before being flushed, absorbing short bursts of writes and allowing overwrites to be coalesced.
- Linux's policy is simple: **all RAM not used by programs and the kernel is used to cache file data**, maximising RAM utilisation. Inspect it with `free -h` under `buff/cache` — gigabytes is normal.

> **Security relevance** (drawn out later in the unit rather than here): because caching is *measurable*, it forms a **side channel** for inferring which files another user has accessed. Also note that `write()` returning does **not** mean data is on disk — hence `fsync`.

### Block layer

Manages devices accessed at **block** granularity — relatively large units, e.g. a **512-byte** disk sector. Beyond providing a uniform interface, it implements **I/O schedulers** that **queue, reorder, merge and split** requests to maximise performance — classically to avoid moving a hard disk's magnetic head, a very costly operation.

### Device mapper

An **optional** layer creating **virtual block devices on top of physical ones**, implementing in software features the hardware may not provide:

- **Encryption** (dm-crypt)
- **Virtual partitions** (LVM)
- **Compression**
- **Caching**
- **Disk aggregation and mirroring** (RAID)

### Drivers

Below any further protocol layers sits the driver — the lowest level of software in the OS, responsible for issuing requests to the actual device. There is generally **one driver per model of device**.

> **Exam flag — quantitative.** **More than two-thirds of the kernel's ~20 million lines of code is device driver code.** This single statistic does a lot of work later: it explains why the kernel is so large, why "the kernel has bugs — particularly in third-party code such as drivers" (Lecture 18), and why microkernels want drivers out of the privileged core (Lecture 21).

## 1.3 VFS data structures

The kernel maintains a set of in-RAM structures to handle filesystem operations. Some are created at **mount** time, others **on demand** (e.g. when a file is opened). VFS asks the **concrete filesystem** to construct them from on-disk metadata — because only the filesystem knows the on-disk layout; VFS is purely an abstraction layer.

| Structure | One per | Holds | Cached as |
|---|---|---|---|
| **Superblock** | mounted filesystem (partition) | Filesystem type, mount flags, quotas, mount point, associated devices; methods to flush caches, unmount | — |
| **Inode** | file or directory | Metadata: size, owner id, permissions; methods to create, delete, resize, move | **inode cache** |
| **Dentry** | name/location of a file or directory | File **name** and **location in the directory tree**; pathname lookup | **dentry cache** |
| **File object** | **open instance** of a file | Open flags, **file offset**; methods `read`, `write`, `lseek` | — |

Two relationships worth stating precisely, because they are exactly the sort of thing a short question targets:

- **Two dentries can refer to the same inode** — that is what a **hard link** is. A file's *name* is not part of the file; it is part of the directory structure.
- **Each userspace file descriptor corresponds to one kernel file object.** Opening the same file twice yields **two** file objects — with independent offsets — over **one** inode.

## 1.4 The network stack

| Layer | Responsibility |
|---|---|
| **Application** | Accesses the network via the **socket interface** — syscalls to connect, send and receive |
| **Transport** | Breaks data into packets and reassembles them; reliability, ordering, flow control. **TCP**: reliable, ordered, connection-oriented (UDP the alternative) |
| **Network** | Packet delivery: **addressing and routing**. **IP** |
| **Link** | Communication between devices on the network: physical (**MAC**) addressing, and the **NIC driver** |

The socket syscalls are deliberately *file-like* — sending and receiving resemble writing and reading — which is the "everything is a file" principle that Lecture 19 opens with.

## 1.5 Summary of Part 1

- Storage: **VFS → FS → Block → Driver**
- Network: **Socket → Transport → Network → Link → Driver**

Both are among the most complex I/O the kernel manages, and both handle that complexity with layered indirection — at a **latency cost** that high-performance designs recover by bypassing the OS.

---

# Part 2 — OS security invariants and kernel hardening (Lecture 18)

## 2.1 Security goals restated

As in Lecture 12: enforce what **subjects** (applications, users) may perform which **operations** (read, write) on which **objects** (files, system resources); apply **least privilege**; maintain **confidentiality, integrity, availability** — while noting these are **often at odds with performance and convenience**.

## 2.2 The basic process-level invariants

**1. Inter-process isolation.** Processes cannot access (read/write/execute) each other's state — mostly memory — directly.
→ Enforced with **page tables**, giving each process its own address space.

**2. User/kernel isolation.** Two distinct parts:

- Processes cannot access the kernel's memory directly.
  → Enforced with the **user/supervisor execution mode** and the corresponding **bits in page table entries**.
- Processes can only invoke the kernel **at a safe entry point**.
  → Enabled by **system calls**, with security enforced by user/supervisor protection.

> **Exam flag.** Invariant 2 has **two clauses**, and the second is the one commonly omitted. "Cannot read kernel memory" is only half — the other half is that entry is possible *only* at a controlled point. Isolation without a controlled doorway would make the kernel unusable; a doorway without isolation would make it insecure.

## 2.3 The user-level invariants

- **User authentication** — only authorised users may access the system, enforced by some authentication mechanism (password, fingerprint, face ID).
- **Users can configure how to share (or not share) the resources they own** — implemented with **file permissions**; note that under UNIX/Linux, files abstract many kinds of system resource.
- **Only privileged users (administrators) may perform security-critical tasks** — loading kernel code, shutting down the machine, mounting filesystems.

## 2.4 The basic trust model — and why it is wrong

The lecture builds up the traditional model, then demolishes it. Under the **basic** model:

- The **entire kernel** is trusted.
- Local and remote **applications and users** are **not** trusted.
- **Hardware** is assumed to behave correctly.
- The **system administrator** has **ambient authority**; certain applications (login, password change) are privileged.
- **BIOS, bootloader and the boot process** are trusted.

The slide then asks directly: **does this model reflect reality?** It does not:

| Assumption | Reality |
|---|---|
| BIOS/bootloader trusted | They **have bugs** and could be **corrupted**; a local attacker could swap the on-disk kernel image for a malicious one |
| Kernel correct | The kernel **has bugs** — particularly in **third-party code such as drivers** |
| Hardware correct | The hardware **has vulnerabilities** — e.g. **Spectre and Meltdown** |
| Sysadmin/owner trusted | In certain scenarios the **owner may not be trusted at all** |

> **Exam flag — high value.** This progression is the intellectual spine of the week. Each broken assumption motivates a later topic: untrusted boot → measured/secure boot; kernel bugs → the hardening and detection work in this lecture; hardware vulnerabilities → the hardware lectures; **untrusted owner → trusted execution environments (Lecture 20)**. If asked to motivate TEEs, the correct starting point is *this row of the table*.

## 2.5 User → kernel attacks

The kernel is written in a **memory-unsafe language** and is subject to every Week 2 vulnerability class. General-purpose kernels are **millions of lines** — the lecturer's phrasing is that the sheer size does not merely fail to guarantee the absence of bugs but "almost guarantees their presence."

**The main attack surface from userspace is the system call interface** — described as a **very large trust interface, hard to secure**.

**What an attacker aims for by exploiting a kernel vulnerability:**

- **Leak or tamper with kernel memory** — e.g. read kernel pointers to break **KASLR**, or escalate privilege to administrator.
- **Access other processes' memory** — the kernel can reach **all** of the machine's memory.
- **Execute code, possibly arbitrary, in kernel context** with full privileges — e.g. installing and hiding **rootkits**.
- **Denial of service** against the system or other applications.

## 2.6 Hardening the syscall interface

Linux treats **every piece of data flowing from userspace through system calls as untrusted** — both the parameters themselves and, for pointer parameters, **what they point to**.

The kernel must assume userspace may supply:

- corrupted data structures,
- bad indexing information,
- `NULL` pointers,
- references to resources (e.g. files) the process has **no permission** to access,
- **sequences of system calls in the wrong order**.

All of which requires the kernel to **check** validity — and getting *every* check right is hard given the interface's complexity.

> That last item — wrong-order call sequences — is worth noticing. It is a **state**-based attack rather than a data-based one, and it is the kind of bug that fuzzing with a grammar (Syzkaller, §2.9) is specifically built to find.

### TOCTTOU / double fetch

A process frequently passes a **pointer** into its own memory (e.g. `readv`/`writev`). Validating what such a pointer references needs special treatment:

**The attack.** Userspace uses **another thread** to corrupt the pointed-to data **after the kernel has checked it but before the kernel uses it**. This is a **time-of-check-to-time-of-use (TOCTTOU)** bug, also called a **double fetch**.

**The only solution:** the kernel must **copy** all user data passed by reference **into kernel space**, and perform the validity checks **on the copies**. Hence:

```c
unsigned long __copy_from_user(void *to, const void __user *from, unsigned long n);
unsigned long __copy_to_user(void __user *to, const void *from, unsigned long n);
```

> **Exam flag — high value.** Be precise about *why* copying works: once the data is in kernel memory, userspace **cannot reach it**, so check-then-use becomes atomic with respect to the attacker. Checking in place and re-reading is the bug; copy-once-then-validate-the-copy is the fix. Note also that the attack requires **concurrency** — another thread — which is why multicore made this class far more exploitable.

## 2.7 Kernel vulnerability classes

From a study of one year of kernel vulnerabilities (141 in 2010; Chen et al., *Linux kernel vulnerabilities: state-of-the-art defences and open problems*), the classes are:

- Missing **pointer** checks
- Missing **permission** checks
- **Buffer overflow**
- **Integer overflow**
- **Uninitialised data**
- **Memory mismanagement** — leaks, use-after-free, double free
- **Miscellaneous** — NULL dereference, divide by zero, infinite loop, race/deadlock

The lecture also presents these plotted against **impact** and against **location in the codebase**.

> **Exam flag.** Notice that the first two classes are *not* memory-safety bugs — they are **missing checks**. A strong answer distinguishes "the kernel is written in C so it inherits Week 2's bug classes" from "the kernel additionally has bugs specific to being a **privileged mediator**: forgetting to check a pointer or a permission." Both are needed.

## 2.8 Runtime defences in the kernel

### Attack surface reduction: memory permissions

- Kernel **executable code and read-only data must not be writable**.
- Kernel **function pointers and sensitive variables must not be writable**.
- **Segregate kernel and userspace memory:**
  - **SMEP** (Supervisor Mode Execution Prevention) — prevents the kernel **executing code located in userspace memory**.
  - **SMAP** (Supervisor Mode Access Prevention) — prevents the kernel **reading or writing userspace memory**; **temporarily disabled by the kernel during `copy_to_user`/`copy_from_user`**, which is exactly when such access is legitimate.

These defend against **ret2usr** — redirecting kernel control flow into attacker-controlled userspace code. But note the residual: **userspace can still partially control what is in the physmap**, enabling the **ret2dir** attack, which reaches the same attacker-controlled bytes through the kernel's own direct mapping of physical memory.

> **Exam flag.** SMEP/SMAP → **ret2usr**; the bypass is **ret2dir**. This is another instance of the Week 2 pattern: each mitigation has a *specific* named bypass, and knowing the pair is worth more than knowing the mitigation alone.

### Attack surface reduction: system call filtering

**Reduce an application's access to system calls.** Blacklist (or whitelist) the syscall types an application has no legitimate reason to invoke.

- Widely used in production to harden multi-tenant and sensitive environments: **Docker containers, Android, Flatpak/AppImage**.
- Achieved under Linux with **seccomp**.
- **The stated open problem: how to derive precise, per-application system call black/whitelists?**

> **Exam flag.** The *problem* is as examinable as the mechanism. A list that is too permissive gives little benefit; too restrictive and the application breaks. Deriving them automatically is genuinely hard — and it is the same difficulty as deriving compartmentalisation policies in Week 5.

### Probabilistic defences, and their weaknesses

- **Kernel stack canaries.** Weakness: **one canary value for all stack frames on each CPU**, so it can be leaked by e.g. a **stack buffer over-read** and then reused.
- **KASLR.** Weakness: **coarse-grained** — a single random offset applied to the main kernel memory area (kernel and module executable code, kernel stacks, vmalloc, physmap). Consequently **one pointer leak may break ASLR for the entire area**.

The lecture's verdict: these are **not a panacea**.

### Memory integrity

- Use **shadow stacks** rather than canaries.
- Prevent over/underflows leaving the stack with **guard pages** — unmapped pages that **fault when hit**.
- **Sanity-check the heap free list for corruption** on allocation and free.
- **Trap on integer overflows** — especially counters and size variables.

### Preventing kernel infoleaks

- **Avoid exposing kernel pointers to userspace** — a single leak breaks KASLR.
- Take care not to send **partially or un-initialised** data structures or buffers to userspace (the struct-padding problem).
- The **kernel log**, and files containing pointers, should be readable **only by the administrator**.
- **Do not use addresses as resource identifiers** — e.g. file descriptors; use **atomic counters** instead.
- **Poison or zero memory on release**, countering reuse attacks (uninitialised reads, use-after-free) — at a **performance cost**.

> **Exam flag.** "Don't use addresses as identifiers" is a subtle and highly quotable design rule: any handle exposed to userspace that *is* a pointer is an infoleak by construction, however carefully everything else is guarded.

## 2.9 Bug detection

### Dynamic analysis

- **Sanitisers** — KASAN (address), KUBSAN (undefined behaviour), plus leak and concurrency/race sanitisers.
- **Lockdep** — tracks lock state to detect **deadlocks, double locking, and lock order inversion**.
- **Dynamic tracing/instrumentation** — ftrace, perf, **eBPF**.
- **Fuzzing** — **Syzkaller**.

### Syzkaller in detail

- A widely used kernel fuzzer that **injects badly-formed system calls** hoping to trigger bugs.
- The **kernel under test runs in a VM**, with fuzzing **controlled from the host** — necessary, since a successful fuzz crashes the kernel.
- Works best with **KASAN and coverage enabled**, which guide the process.
- Each round **generates and executes a program — a few syscalls**, not a single call.

**Syzlang.** Syzkaller is **grammar-based** and **aware of the interface it fuzzes**. The Syzlang grammar describes the system calls and the **data flow** between them:

- syscall arguments and their **types**,
- **values passed between system calls** — e.g. an `fd` created by `open()` being usable by `read()`,
- **length parameters** specifying the size of other parameters.

This knowledge lets Syzkaller generate and mutate programs far more effectively than blind random input.

**Syzbot.** Continuous fuzzing of Linux, Android, FreeBSD, NetBSD, OpenBSD and gVisor across **25 Syzkaller instances (~150–200 VMs)**, having reported **thousands** of bugs to the kernel mailing lists. **The stated problem: roughly two-thirds of reported bugs are invalid.**

> **Exam flag.** Two points here reward precision. (1) *Why* the grammar matters: random bytes almost never form a valid syscall sequence, so structure-awareness is what makes kernel fuzzing productive — the dependency between `open` and `read` is the canonical example. (2) The **two-thirds invalid** figure — automated bug finding produces a triage burden, and reporting volume is not the same as value.

### Linux Test Project

A repository of **thousands of test cases** for the kernel. Categories include **syscalls, POSIX conformance, filesystem, networking, memory management**, and **reproducing existing CVEs**.

### Static analysis

- **Pattern-based** — **Coccinelle**, **Smatch**: describe patterns of programming mistakes, e.g. *every `kmalloc` should have a matching `kfree`*.
- **Control and data flow analysis** — **Sparse** uses **compiler attributes** to express properties of objects and memory: `__user` marks pointers into userspace, `__acquires` marks a lock held on function exit but not entry.
- Others: verification techniques, symbolic execution, compiler techniques.

**The scaling problem:** static analysis's usual downsides — scalability and **state explosion** — are **exacerbated on kernels** because of codebase size (Linux at **20M+ LoC**).

> **Note the elegance of `__user`.** It makes an *invisible* property — "this pointer is not safe to dereference" — into something the toolchain can check. It is the same idea as writing down a trust boundary so a machine can enforce it, which is precisely what Week 5 argues compartmentalisation lacks.

---

# Part 3 — Access control (Lecture 19)

## 3.1 "Everything is a file"

Linux inherits from UNIX the principle that **everything is a file** — regular files, devices, IPCs, OS metadata and configuration knobs — though the lecturer notes it is not *technically* everything.

The consequence: **much of the security model rests on file permissions**, which define what user or process may do what with which files.

Linux is also **multi-user**: users share the machine and **do not trust each other**, and the **system administrator does not trust the users**.

### Lampson's access control matrix

The abstract model: **columns are subjects**, **rows are objects**, and each cell holds the **permissions** that subject has on that object.

|  | File A | File B | File C |
|---|---|---|---|
| **Process 1 (user 1)** | read, write | read | — |
| **Process 2 (user 2)** | read | write | read |

Everything that follows — DAC, MAC, capabilities — is a different way of **representing and enforcing this matrix**. Realising that is what makes the three comparable.

## 3.2 UNIX/Linux file permissions

- **Process identity** = a **UID** and a **GID**. Normally a process inherits the invoking user's.
- **Each file** has an **owner UID** and an **owner GID**.
  - A process running with the file's owner UID can **change permissions** on it — effectively full access.
  - A process running with the file's owner GID can obtain additional permissions.
- **Permissions** live in each file's metadata as **permission bits**.

Inspecting them:

```bash
ps -o pid,user,group,uid,gid,comm -p <pid>   # a process's UID/GID
ls -ln <file>                                # a file's UID/GID and permission bits
```

Reading `ls -l` output, field by field:

```
-rwxr-xr-x 1 0 0 151152 Sep 20 2022 /usr/bin/cp
```

| Field | Meaning |
|---|---|
| `-rwxr-xr-x` | file **type** + permission bits for owner UID, owner GID, others |
| `1` | number of **hard links** |
| `0` | **owner UID** |
| `0` | **owner GID** |
| `151152` | **size** in bytes |
| rest | modification timestamp and path |

The permission string is one type character followed by **three blocks of three**: owner, group, others. Within each block, **`r`** read the content, **`w`** write, **`x`** execute as a program; a dash denies.

## 3.3 Authorisation mechanisms

- **Userspace configures** permissions — `chown` to change owner, `chmod` for permissions.
- **The kernel performs authorisation checks on each access** — `open`, `read`, `write`.
- **Authentication processes (`login`, `sshd`) must run as root**, because on success they must **switch to the identity of the authenticated user**. All subsequent processes in the session **inherit** that identity.
- Some services must be **callable by users but require root** — e.g. `passwd`, which updates `/etc/shadow`, a file users cannot access. The **setuid** permission bit lets such a program be **invoked by a normal user but run with root permissions**.

## 3.4 Discretionary Access Control (DAC)

Because non-root users can change the security configuration — updating mode bits and owner UID/GID of files they own — this is **Discretionary Access Control**.

**The problem with DAC:** it **assumes users always behave correctly.** Two ways that fails:

1. **Mistakes** — user A misconfigures permissions so that user B can read A's private files (the lecturer's example: a botched `chmod` exposing a private SSH key).
2. **Compromise** — one of A's processes, which is **outside the TCB**, is taken over by an attacker (e.g. via a use-after-free) and acts maliciously, lowering the system's defences by changing its security configuration.

**These assumptions do not hold in reality.** What is needed is a protection system that **maintains its guarantees even when software outside the TCB is malicious.**

> **Exam flag — this sentence is the pivot of the lecture.** It is the precise motivation for MAC, and it is phrased in TCB terms, tying back to Lecture 12. Quote it in that form: *DAC's guarantees depend on the good behaviour of untrusted software; MAC's do not.*

## 3.5 Mandatory Access Control (MAC)

**A protection system in which the security configuration can only be modified by trusted administrators.**

How it works:

- Every **subject** (process) and **object** (file, system resource) is given a **security label**.
- Labels are used to define **rules** describing how processes may interact with each other and with system resources.
- The set of labels is defined by **trusted administrators** and is **immutable**:
  - It **cannot be changed by processes** — hence access control is *mandatory*.
  - Labels are **assigned at creation time**.
  - They can be **changed later by trusted software** — and in the lecture's worked example, re-labelling requires a **restart of the MAC system**.

Note that **subject and object labels need not be drawn from the same set**, and that a process may be denied access to an object whose label is more sensitive than its own — the classic multi-level example being a *secret* process unable to read a *top secret* file.

## 3.6 SELinux

**Security Enhanced Linux** is MAC for Linux.

- Processes and system resources are assigned labels called **contexts**.
- A context has several fields including a **type**. Examples:
  - a running web server process: `httpd_t`
  - content served from `/var/www/html/`: `httpd_sys_content_t`
  - ports traditionally used by web servers: `http_port_t`
- The **policy** is defined by a trusted administrator as **rules** explicitly describing the operations processes may perform on OS resources.
- **SELinux checks are performed *after* file permissions, which still apply.**
- **No rule means deny by default** — strict enforcement.

The worked example: a web server and an SQL database, each with its own type. The web server may reach the HTTPS port and the files it serves; the database may reach its storage location. **Because no rule permits it, the web server cannot access the database file** — and the database cannot touch the web server's port or content.

### Pros and cons

**Pros**

- **Strict, fine-grained enforcement.** If Apache is compromised, the attacker can only reach what the policy marks accessible — versus *all* files accessible to that user or to "others" under traditional permissions. Much better application of **least privilege**. (And catastrophically better than a server running as root, where compromise yields the whole machine.)
- **Widely available**, and **required for certain compliance standards**.

**Cons**

- **Complexity of configuration, management and troubleshooting** — the main barrier to adoption. The lecturer's illustration: search for "how to disable SELinux."
- **Too strict** — legitimate actions blocked by overly strict or outdated policies (false positives at runtime).

## 3.7 Linux Security Modules (LSM)

The division of labour is the examinable point:

- **SELinux is concerned with *policies*** — the rules defining what may do what to what.
- **LSM provides the *mechanisms*** to implement access control systems inside the kernel.

LSM is used not only by SELinux but by **Smack, TOMOYO, AppArmor** and others.

How LSM works:

- It exposes **hooks** on kernel code paths **immediately before access to internal, security-sensitive kernel resources** — e.g. just before opening or accessing a file.
- Security modules can then **permit, deny, or log** operations (the last for auditing).
- Kernel objects carry an **opaque `void *security` field** for holding whatever security metadata the module needs.

**The order of checks when opening a file** — worth memorising as a sequence:

1. The syscall begins processing.
2. The **inode** for the file is looked up.
3. **Basic error checks** (does the file exist?).
4. **DAC checks** — traditional UNIX permissions.
5. **LSM hook** — the module (e.g. SELinux) allows, denies, or logs.
6. If allowed, the operation proceeds.

> **Exam flag.** *Policy vs mechanism*, and *DAC before LSM*. Both must permit — which is the concrete meaning of "MAC complements rather than replaces DAC."

## 3.8 The confused deputy problem

Access control systems handle many situations well but not this one. The worked example (after Norm Hardy):

**Setup.** A shared multi-user system used for compiling code. Users have a home directory containing their source. They invoke the **compiler**, passing the source file, the name of the executable to produce, and optionally a separate file for **debug symbols**. Separately, the **administrator** has configured the compiler to record language-usage statistics into a system directory — `/sysx/language-stats.txt`.

**The permission arrangement.** `/sysx/` is meant to be accessible only by root. But because the compiler must write its statistics there, the administrator grants **the compiler** write access to that directory. `/sysx/` also contains a security-critical **`billing.txt`**, which normal users must not touch.

**The attack.** A user who learns `billing.txt` exists simply passes it as the **debug-symbols output file**. The compiler — exercising *its own* authority over `/sysx/` — overwrites it.

**The definition this instantiates:** a **deputy** (the compiler), holding privilege, is **confused into accessing a file that the user it acts on behalf of has no permission to access**.

> **Exam flag.** Be able to reproduce this example in a few lines. Note precisely why ACLs cannot fix it: the compiler *genuinely needs* write access to `/sysx/`, and every individual step is permitted. The flaw is that the **caller supplies the name** while the **deputy supplies the authority** — nothing binds the two together.

## 3.9 Capability systems

**You cannot solve the confused deputy easily with access control lists (whether MAC or DAC).** Capability systems address it.

**A capability is a token that conflates:**

- the **designation** of a system resource (e.g. a file); **and**
- the **permissions** to access that resource.

In other words: **if you can name a resource, you can access it.** This differs fundamentally from ACLs, where **name and permission are separate** — a normal user can *refer to* `/etc/shadow` by path while being unable to read it.

**Capabilities are unforgeable.** The only way to obtain one is for **another security domain to copy one of its own capabilities and give it to you.**

**How the system is bootstrapped:**

1. The **OS starts with all capabilities** — all permissions to all resources.
2. It creates the **`init`** process with a large set.
3. `init` spawns other processes, and **parents decide which capabilities their children receive**, subsetting as they go down the process tree.
4. Because processes **cannot forge** capabilities, there is **no way to increase** the permissions granted by a parent.

**Applying this to the confused deputy.** After login authenticates the user, it subsets its capabilities for the user's shell: read/write to the home directory, execute on the compiler. When the user runs the compiler, the shell subsets again — the compiler receives only capabilities for the source file, the executable output and the debug-symbols output.

The compiler still needs write access to `/sysx/language-stats.txt`. This capability could be passed down the chain — but that would give the **shell** access it does not need. Instead the compiler obtains it **directly from the kernel**, which holds full filesystem access.

**Result:** the compiler holds **no capability for `billing.txt`**, so it simply cannot overwrite it — regardless of what filename the user supplies.

> **Exam flag — high value.** The detail that elevates an answer: the statistics capability is granted **directly to the compiler by the kernel rather than passed through the shell**, so authority is not accumulated by intermediaries. That is **least privilege expressed structurally**, and it is the real reason the attack becomes inexpressible rather than merely blocked.

---

# Part 4 — Trusted Execution Environments (Lecture 20)

## 4.1 The motivating scenario and its trust models

A server in a data centre, owned by a **cloud provider**, running several VMs each rented to a different **tenant**.

**Conventional trust model:**

- The **provider** trusts its own hardware and its virtualisation software (the VMM, host-level software), and **distrusts everything tenants run** inside the VMs — it has no idea what that will be and must assume it may be malicious.
- Each **tenant** trusts its own software, **and also trusts the provider's hardware and software** (including the VMM).
- **Tenants distrust each other** — one tenant's VM must not reach another's memory.

**The TEE trust model adds one change, and it is the whole point:**

> **Tenants do not trust the cloud provider.**

The lecturer notes why this is realistic: many organisations are reluctant to move workloads to the cloud precisely because they do not want providers to access their code and data.

## 4.2 What a TEE is

**A Trusted Execution Environment is an isolated execution context enforced by the CPU hardware, resistant to information disclosure and tampering by the host OS or hypervisor.**

It ensures:

- **Confidentiality** — code and data within the TEE cannot be **read** by the host.
- **Integrity** — code and data within the TEE cannot be **altered** by the host.
- **Availability is out of scope** — too hard to maintain.

**Why availability is excluded** is worth being able to justify: the attacker can run privileged software, so nothing prevents them from simply **shutting the machine down** (or declining to schedule the TEE).

**Threat model:** the attacker may control **all host software outside the TEE, including privileged layers (OS, hypervisor)**, and **I/O devices**.

Concretely this means: a **process that does not trust the OS it runs on**, or a **VM that does not trust the hypervisor managing it**.

## 4.3 Key characteristics

1. **Isolation mechanism** from normal execution environments — the outside world cannot read or write TEE memory.
2. **Controlled interaction** with the outside world. The TEE is not self-sufficient and must interact with the OS/hypervisor for I/O. These are **new interfaces relative to traditional trust models, and they need to be secured** — because the OS is no longer trusted.
3. **Secure storage** — encryption with **keys that never leave the TEE**, for sensitive data such as keys and passwords.
4. **Attestation** — to prove trustworthiness remotely: that the TEE runs on the **right hardware**, and that the **software inside was not tampered with before being loaded**.

> **Exam flag.** Characteristic 2 is the one that generates most real vulnerabilities, and it recurs in each implementation below. Isolation creates a **new, narrow, untrusted-facing interface** — and every implementation's weakest point is exactly there. This is the same lesson as Week 5's compartment interface vulnerabilities.

## 4.4 Use cases

- **Remote computation environments** — cloud computing where the provider is not trusted.
- **Secure vaults** — cryptographic keys, password managers, cryptocurrency wallets, personal data such as fingerprints.
- **Confidential computation in hostile environments** — Digital Rights Management, confidential ML training/inference, healthcare applications.

## 4.5 The three implementations

### Intel SGX — enclave (part of an application)

- **Part of an application** runs inside the TEE, called an **enclave**.
- At any moment the CPU is executing **either inside or outside** the enclave.
- Enclave memory pages are **encrypted in DRAM** and cannot be accessed from outside; decryption happens transparently when the CPU is executing inside.
- **Transitions out of and into the enclave** are required for e.g. system calls. These are **slow**, and they are an **attack vector** — the untrusted OS could return bad data.
- Mitigation in practice: enclave frameworks **embed a small OS inside the enclave** to handle as many syscalls as possible internally, avoiding costly and dangerous exits. **Disk and network I/O still require the untrusted host OS.**

### AMD SEV — confidential VM (whole virtual machine)

- Places an **entire virtual machine** inside the TEE — a **confidential VM**.
- The VM's memory is **encrypted** relative to the outside world, as with SGX.
- **Benefit over SGX: application compatibility** — existing applications run **as-is**, with no porting to an enclave framework.
- **Drawback: a large TCB** — it now includes the entire **guest OS** as well as the application.
- **Interface with the outside world is virtual hardware**, which has **proven very hard to secure**.

### ARM TrustZone — secure world (system-wide)

- CPU execution is split between a **normal world** and a **secure world** (the TEE).
- **These are orthogonal to privilege levels** — supervisor and user modes exist in **both** worlds.
- Hardware prevents software in the non-secure world from accessing secure-world memory — **note: no memory encryption here**, unlike SGX and SEV.
- In the secure world, a **small dedicated OS** runs **trusted applications**, which can be **invoked from normal-world applications**.
- Example: fingerprint unlock on Android. The normal-world app invokes a trusted application to verify identity — so even if the phone is stolen **and rooted**, extracting the fingerprint data remains very difficult.

### Comparison

| | **SGX** | **SEV** | **TrustZone** |
|---|---|---|---|
| Granularity | Part of an application (**enclave**) | Whole **VM** | System-wide **secure world** |
| Memory encryption | Yes | Yes | **No** |
| Application changes | **Required** (enclave framework) | **None** | Trusted apps written for the secure world |
| TCB inside | Enclave code (+ embedded mini-OS) | Application **+ entire guest OS** | Small secure OS + trusted apps |
| Weak interface | Enclave exits for syscalls | **Virtual hardware** | Normal↔secure world calls |

> **Exam flag.** The axis to organise an answer around is **granularity**, and each implementation's cost follows from it: finer granularity (SGX) → smaller TCB but **porting required and expensive transitions**; coarser (SEV) → **no porting** but a **large TCB**. TrustZone is orthogonal — a system-wide split rather than a per-application one, and the only one **without memory encryption**.

## 4.6 Remote attestation

In a remote scenario, a client connecting to a TEE must check two things:

1. The enclave **runs on the expected hardware** — e.g. a genuine SGX-capable CPU.
2. The **software in the enclave has not been tampered with before being loaded**.

**Remote attestation** is the mechanism: the enclave **sends a measurement** attesting that the hardware and software environment is as expected — generally hashes identifying both. With SGX, the enclave sends a measurement the client can verify, and **Intel additionally offers an attestation service** to validate the hardware.

---

# Part 5 — OS models and security (Lecture 21)

## 5.1 The framing

An **OS design model** is a set of **core design choices defining how the OS's functions are organised**. Each has advantages and disadvantages in **performance** — but also in **security**, and the lecture's purpose is to place the models on that axis.

## 5.2 Monolithic kernel

- **Application and kernel generally live in the same address space.**
- The kernel is a **large monolithic unit of trust: no internal isolation** between subsystems.
- The application and kernel are isolated with **privilege levels** — supervisor CPU mode plus the supervisor bit in page table entries. Applications are isolated from each other by **separate address spaces**.
- Assessment: **medium level of isolation, good performance** — because **less isolation means fewer costly security-domain crossings**.

Examples: **Linux**, FreeBSD, NetBSD, OpenBSD; also MS-DOS.

## 5.3 The design space

Starting from the monolithic kernel as the middle ground, there are exactly two directions:

- **Increase isolation** — at a **performance cost** → microkernel.
- **Sacrifice isolation for performance** → exokernel and unikernel.

> **Exam flag — high value, and a correction to the common assumption.** This unit places **unikernels on the *faster, less secure* side of the design space**, not the more secure side. The reasoning is given explicitly in §5.5. If you have absorbed the general claim that unikernels are "more secure because they have a smaller attack surface," note that **this unit's framing is different** and be ready to give *its* argument: they **drop the user/kernel protection boundary**.

## 5.4 Microkernel

- Many kernel functionalities are **offloaded to userspace processes called servers**, each in its own address space.
- Only core functionality remains in the kernel: **scheduling, process and memory management, and IPC**.
- **IPC is key**, because it is how the offloaded subsystems communicate with the rest of the system.

**More secure than monolithic:** if one server fails or is compromised, **it is not game over for the whole system** — the attacker is confined to that server's address space.

**Slower than monolithic:** applications and servers must communicate via **IPC**, involving **security domain crossings** (system calls, context switches) and possibly **data copies**. Heavily optimisable, but never free.

Examples: **MINIX v3**, **L4**. (The seL4 member of the L4 family is additionally *formally verified*, which is the strongest available assurance argument for the model.)

## 5.5 Exokernel and unikernel

### Exokernel

- A **minimal exokernel** handles core OS functionality — roughly microkernel-like.
- **Applications embed OS services as a library OS (libOS)** — one per application or group of applications.
- The exokernel exposes a **low-level interface that securely multiplexes the hardware between the (untrusted) libOSes**.
- More management responsibility moves to the libOSes, which can be **specialised per application** for performance.

Proposed in the 1990s; it did not really take off at the time.

### Unikernel

The 2010s revival of the idea, with one substitution:

- **A hypervisor can play the role of the exokernel.**
- Each application runs in **its own virtual machine, compiled together with a libOS** — this bundle is the **unikernel**.
- **There is no need to isolate the application from the libOS**, so **system calls that do not require the hypervisor become ordinary function calls** — much faster.

**Security assessment, stated carefully:**

- Unikernels are **well isolated from each other**, because they run in **separate VMs**.
- The **hypervisor is isolated** from the unikernels.
- But there is **no isolation between a unikernel instance and the application it runs**. So **if an attacker exploits a vulnerability in the application, they may easily access the entire unikernel instance.**

> **Exam flag.** State the trade in exactly these terms: unikernels **drop user/kernel protection for performance**. External isolation (VM-level) is strong; **internal isolation is absent**. Both halves are needed for full marks.

## 5.6 Summary table

| Model | Isolation | Performance | Key property |
|---|---|---|---|
| **Monolithic** | Medium — privilege levels separate kernel from apps; **no intra-kernel isolation** | Good | The middle ground; fewer domain crossings |
| **Microkernel** | High — services in userspace, separate address spaces | Slower — IPC crossings and copies | Trades performance for security |
| **Unikernel** | External strong (separate VMs), **internal none** | Fast — syscalls become function calls | Trades security for performance |

---

# Exam flags and lecturer emphasis

Derived from repetition, summary slides, and narration emphasis across the five decks.

## Definitions to be able to state exactly

1. **The two process-level invariants** — inter-process isolation (page tables) and user/kernel isolation, the latter with **both** clauses (no direct memory access; entry only at a safe point).
2. **TOCTTOU / double fetch**, and why **copying into kernel space** is the *only* solution.
3. **DAC's failure condition** — it assumes users always behave correctly; a system is needed whose guarantees survive **malicious software outside the TCB**.
4. **A capability** — a token conflating **designation** and **permission**; unforgeable; "if you can name it you can access it."
5. **A TEE** — hardware-enforced isolated execution context resistant to disclosure and tampering **by the host OS or hypervisor**; C and I only, **availability out of scope**.
6. **Policy vs mechanism** — SELinux is policy; **LSM is mechanism**.

## Framings specific to this unit

- **The basic trust model does not reflect reality** — and each broken assumption motivates a later topic, with the **untrusted machine owner** motivating TEEs.
- **Unikernels sit on the *faster, less secure* side** of the design space — they drop user/kernel protection.
- **SELinux is checked *after* DAC**, and both must permit.
- **TrustZone has no memory encryption**, unlike SGX and SEV.
- **TEE availability is explicitly out of scope**, with a stated reason.

## Quantitative and named facts

| Fact | Value |
|---|---|
| Driver share of the kernel | **More than two-thirds** of ~**20M** LoC |
| Typical disk block/sector | **512 bytes** |
| Kernel vulnerability study | **141** vulnerabilities in **2010** (Chen et al.) |
| Syzbot scale | **25** Syzkaller instances, **~150–200 VMs** |
| Syzbot invalid reports | **~two-thirds** |
| Kernel canary weakness | **one value per CPU** for all frames |
| KASLR weakness | **single offset** for the whole kernel area → **one leak breaks it** |

## Mechanism → bypass / limitation pairs

| Mechanism | Bypass or limitation |
|---|---|
| **SMEP/SMAP** (vs ret2usr) | **ret2dir** — userspace partially controls physmap |
| **Kernel stack canaries** | One value per CPU; leak via stack over-read |
| **KASLR** | Coarse-grained; one pointer leak breaks the whole area |
| **Syscall filtering (seccomp)** | Deriving precise per-application lists is an **open problem** |
| **DAC** | Assumes users behave correctly; fails on mistakes and on compromise |
| **MAC/SELinux** | Complexity of configuration and troubleshooting; sometimes too strict |
| **ACLs generally** | **Confused deputy** |
| **SGX** | Enclave exits slow and an attack vector |
| **SEV** | Large TCB (guest OS); virtual-hardware interface hard to secure |
| **Static analysis on kernels** | State explosion at 20M+ LoC |

## Common traps

- **Do not** give only half of the user/kernel isolation invariant.
- **Do not** say the kernel validates user pointers *in place* — it **copies first**.
- **Do not** describe MAC as replacing DAC; **both** must permit, and **DAC is checked first**.
- **Do not** claim TEEs protect availability.
- **Do not** say unikernels are more secure in this unit's framing without stating the internal-isolation caveat.
- **Do** remember that a **file object per open**, an **inode per file**, and **dentries per name** are three different things — and that two dentries per inode is a hard link.
- **Do** attribute the confused deputy to the **separation of designation from authority**, not to a permission misconfiguration.

## Forward links

- **§2.6 TOCTTOU** → the same check-then-use race at compartment boundaries, Week 5.
- **§2.8 syscall filtering** → containers and cgroups, Week 6.
- **§3.9 capabilities** → CHERI's hardware capabilities in the hardware lectures, and compartmentalisation abstractions in Week 5.
- **§4.3 controlled interaction** → compartment interface vulnerabilities, Week 5; VirtIO's attack surface, Week 6.
- **§5.5 unikernel** → lightweight virtualisation, Week 6.
- **§2.4 hardware vulnerabilities** → Meltdown, Spectre and Rowhammer in the hardware lectures.

---

# Summary checklist

- [ ] Storage stack: **VFS → FS → Block → Driver**; network: **Socket → Transport → Network → Link → Driver**
- [ ] Layering costs **latency**; high-performance I/O **bypasses the OS**
- [ ] VFS structures: superblock (per partition), inode (per file), dentry (per name; 2 → hard link), file object (per open fd)
- [ ] Page cache uses **all free RAM**; block layer schedules I/O; device mapper gives encryption/LVM/RAID
- [ ] Drivers = **two-thirds of 20M LoC**
- [ ] Two process-level invariants; **both clauses** of user/kernel isolation; three user-level invariants
- [ ] Basic trust model, and **all four ways it fails** in reality
- [ ] Syscall interface = main user→kernel attack surface; everything crossing it is untrusted
- [ ] **TOCTTOU/double fetch**; fix = `copy_from_user`, validate the copy
- [ ] Kernel vulnerability classes, including **missing pointer/permission checks**
- [ ] SMEP/SMAP → ret2usr; bypass **ret2dir**; canary and KASLR weaknesses
- [ ] Infoleak rules, incl. **don't use addresses as identifiers**
- [ ] Syzkaller: VM-based, KASAN + coverage, **Syzlang** grammar, Syzbot's two-thirds invalid
- [ ] Static analysis: Coccinelle/Smatch patterns, Sparse `__user`/`__acquires`, state explosion
- [ ] Everything is a file; **Lampson's access control matrix**
- [ ] UID/GID, permission bits, `ls -l` fields, setuid and `passwd`/`/etc/shadow`
- [ ] **DAC** and its two failure modes; the "guarantees despite malicious software outside the TCB" requirement
- [ ] **MAC**: labels, immutable, admin-defined, assigned at creation
- [ ] **SELinux**: contexts and types, deny-by-default, **checked after DAC**, pros and cons
- [ ] **LSM** = mechanism; hooks; `void *security`; the six-step open path
- [ ] **Confused deputy**: the compiler/`billing.txt` example and why ACLs can't fix it
- [ ] **Capabilities**: designation + permission, unforgeable, subsetting from `init` down
- [ ] TEE trust model — **tenant does not trust the provider**; C+I only, **availability out of scope**
- [ ] Four TEE characteristics; **controlled interaction** is the weak point
- [ ] SGX vs SEV vs TrustZone by **granularity**, encryption, porting cost, TCB
- [ ] Remote attestation: right hardware **and** untampered software; measurement
- [ ] Monolithic / microkernel / unikernel on the isolation-vs-performance axis
- [ ] Unikernels: strong **external**, absent **internal** isolation; syscalls become function calls
