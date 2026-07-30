---
subject: COMP60261
chapter: 4
title: "Chapter 4 Exam Questions - 5.5 Pro"
language: "en"
---

# Chapter 4 Exam Practice Set: Operating Systems Security, Access Control, TEEs, and OS Models

**AI author:** 5.5 Pro  
**Source material:** COMP60261 Week 4 / Chapter 4 notes on storage and network stacks, OS security invariants, kernel hardening, DAC/MAC/capabilities, trusted execution environments, and OS design models.

Unless a question states otherwise, assume:

- A Linux-like OS where "OS" means the kernel.
- x86-64 with user mode and supervisor mode.
- A 512-byte disk sector where sector arithmetic is requested.
- LP64 C layout: `char` is 1 byte, `short` is 2 bytes, `int` is 4 bytes, `long` and pointers are 8 bytes.
- Structure layout uses ordinary alignment and padding: each field is aligned to its own alignment, and the whole structure is rounded up to the largest field alignment.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1: Storage and network stacks

**Q:** Name the storage stack and the network stack from application level down to the driver level. Explain why both stacks use layering and what cost that layering introduces.

**Answer & Explanation:**

Step 1: State the storage stack.

```text
Application system calls
  -> Virtual File System (VFS)
  -> concrete filesystem
  -> page cache
  -> block layer
  -> optional device mapper
  -> low-level protocol
  -> device driver
  -> storage device
```

Step 2: State the network stack.

```text
Application socket interface
  -> transport layer, such as TCP or UDP
  -> network layer, usually IP
  -> link layer
  -> NIC driver
  -> network device
```

Step 3: Explain why layering is used. Layering provides indirection and abstraction. Applications can call `open`, `read`, `write`, `send`, and `recv` without knowing whether the underlying resource is ext4, tmpfs, NFS, NVMe, SATA, Ethernet, or Wi-Fi.

Step 4: Explain the cost. Each layer adds code paths, metadata, buffering, and coordination. That increases latency, especially for high-I/O workloads.

Step 5: State the security/performance trade-off. Kernel bypass can improve I/O latency by allowing applications to access disks or NICs more directly, but it weakens or relocates the OS mediation that normally enforces isolation, accounting, and access control.

---

### Question 2: VFS objects and hard links

**Q:** Explain the roles of the VFS superblock, inode, dentry, and file object. Why can two pathnames refer to the same file, and why can two file descriptors for the same pathname have different offsets?

**Answer & Explanation:**

Step 1: Define the VFS objects.

| VFS object | One per | Holds |
|---|---|---|
| Superblock | Mounted filesystem | Filesystem type, mount flags, quotas, mount point, associated devices, and filesystem methods. |
| Inode | File or directory | Metadata such as size, owner UID, permissions, and file operation methods. |
| Dentry | Name/location in directory tree | Filename and pathname lookup information. |
| File object | Open instance of a file | Open flags, current file offset, and methods for read/write/lseek. |

Step 2: Explain hard links. A file's name is represented by a dentry, while its file data and metadata are represented by an inode. Two dentries can point to the same inode. That is a hard link.

Step 3: Explain file descriptor offsets. A userspace file descriptor refers to a kernel file object. Opening the same pathname twice creates two file objects, each with its own file offset. Duplicating a file descriptor with `dup`, however, makes two descriptors refer to the same file object, so they share one offset.

Step 4: Security relevance. Confusing names, inodes, and open file objects is a common source of mistakes in pathname checks, hard-link handling, and time-of-check-to-time-of-use races.

---

### Question 3: Process-level and user-level OS security invariants

**Q:** State the process-level and user-level security invariants from Chapter 4. For the user/kernel isolation invariant, include both clauses.

**Answer & Explanation:**

Step 1: State process-level invariant 1: inter-process isolation. Processes must not directly read, write, or execute each other's state. The main enforcement mechanism is separate page tables and separate address spaces.

Step 2: State process-level invariant 2: user/kernel isolation. It has two clauses:

1. Processes must not directly access kernel memory.
2. Processes must invoke the kernel only at controlled, safe entry points.

Step 3: Explain the mechanism for clause 1. The CPU privilege mode and page-table user/supervisor bits prevent user-mode code from reading or writing supervisor-only kernel mappings.

Step 4: Explain the mechanism for clause 2. System calls provide controlled entry points. Userspace can select a service, such as `open` or `read`, but cannot choose an arbitrary instruction address inside the kernel.

Step 5: State user-level invariants.

- Users must be authenticated before using the system.
- Users may configure sharing of resources they own, commonly through file permissions.
- Only privileged users or privileged programs may perform security-critical tasks such as loading kernel modules, mounting filesystems, changing identity, or shutting down the machine.

Step 6: Security conclusion. These invariants are only as strong as the kernel and hardware mechanisms enforcing them. A kernel compromise can invalidate all of them at once.

---

### Question 4: Basic trust model and why it fails

**Q:** Describe the basic OS trust model presented in the notes, then explain four ways that model fails in reality.

**Answer & Explanation:**

Step 1: State the basic trust model.

- The entire kernel is trusted.
- Local and remote applications and users are not trusted.
- Hardware is assumed to behave correctly.
- The system administrator has broad authority.
- BIOS, firmware, bootloader, and the boot process are trusted.

Step 2: Explain boot failure. Firmware and bootloaders can have bugs or be corrupted. A local attacker may replace the kernel image or insert a rootkit before the OS starts.

Step 3: Explain kernel failure. Kernels are large C codebases. They contain bugs, especially in complex subsystems and third-party code such as drivers.

Step 4: Explain hardware failure. Hardware may itself be vulnerable, as demonstrated by classes such as Spectre and Meltdown.

Step 5: Explain administrator/owner failure. In cloud or locked-device scenarios, the machine owner or cloud provider may not be trusted by the workload owner.

Step 6: Connect to later topics.

- Untrusted boot motivates secure/measured boot.
- Kernel bugs motivate hardening, static analysis, and fuzzing.
- Hardware flaws motivate hardware security mechanisms and mitigations.
- Untrusted owners motivate trusted execution environments.

---

### Question 5: Syscall hardening and double fetch

**Q:** Why is the syscall interface the main user-to-kernel attack surface? Define TOCTTOU/double fetch and explain why copying user data into kernel memory before validation is the correct defence.

**Answer & Explanation:**

Step 1: Identify the attack surface. Userspace cannot directly access kernel memory or jump into arbitrary kernel code. The sanctioned interface is the syscall interface, so it is the main path for attacker-controlled data into the kernel.

Step 2: State what is untrusted. The kernel must treat all syscall inputs as untrusted:

- scalar arguments,
- pointers,
- data pointed to by user pointers,
- lengths and indices,
- file descriptors and resource identifiers,
- syscall sequences and state transitions.

Step 3: Define TOCTTOU/double fetch. A time-of-check-to-time-of-use bug occurs when the kernel checks data in userspace, then later reads that same userspace data again for use. A second userspace thread may change the data between the check and the use.

Step 4: Explain why in-place validation fails. Userspace memory remains under userspace control. A check performed on it does not freeze it.

Step 5: Explain the defence. The kernel should copy user data once into kernel memory, using mechanisms such as `copy_from_user`, then validate and use only the kernel copy.

Step 6: Explain why copying works. Once the data is in kernel memory, userspace cannot modify it. The validation and use are atomic with respect to the attacker-controlled source.

---

### Question 6: Kernel vulnerability classes and hardening

**Q:** List major kernel vulnerability classes and pair at least six hardening mechanisms with the threat or limitation they address.

**Answer & Explanation:**

Step 1: List vulnerability classes.

- Missing pointer checks.
- Missing permission checks.
- Buffer overflows.
- Integer overflows.
- Uninitialised data.
- Memory mismanagement: leaks, use-after-free, double free.
- Miscellaneous: `NULL` dereference, divide by zero, infinite loops, races, deadlocks.

Step 2: Distinguish the key categories. Buffer overflows and use-after-free are memory-safety bugs. Missing pointer and permission checks are privileged-mediator bugs: the kernel forgot to validate an operation it was supposed to mediate.

Step 3: Pair defences with threats.

| Mechanism | Addresses | Limitation / bypass |
|---|---|---|
| SMEP | Kernel executing attacker-controlled userspace code. | ret2dir may reach attacker-controlled bytes through physmap. |
| SMAP | Kernel accidentally reading/writing userspace memory. | Must be disabled briefly for legitimate `copy_from_user`/`copy_to_user`. |
| Kernel stack canaries | Contiguous stack overwrites. | One canary per CPU can be leaked and reused. |
| KASLR | Predictable kernel addresses. | Coarse-grained; one pointer leak may break the whole area. |
| Guard pages | Stack overflows/underflows crossing into adjacent memory. | Only catches accesses that hit the unmapped guard page. |
| Shadow stacks | Return-address corruption. | Requires strong protection of the shadow stack itself. |
| Seccomp | Excessively broad syscall attack surface. | Precise per-application syscall lists are hard to derive. |
| Zeroing/poisoning memory | Uninitialised leaks and reuse attacks. | Has performance cost. |

Step 4: Security conclusion. Kernel hardening is defence in depth. It does not prove absence of bugs; it raises exploit cost and reduces damage.

---

### Question 7: Bug detection in kernels

**Q:** Compare dynamic and static kernel bug-detection techniques. Include KASAN/KUBSAN, Lockdep, Syzkaller, Coccinelle, Smatch, Sparse, and Linux Test Project.

**Answer & Explanation:**

Step 1: Dynamic analysis runs the kernel and observes behaviour.

- **KASAN** detects address/memory errors.
- **KUBSAN** detects undefined behaviour.
- Race and leak sanitizers detect other runtime classes.
- **Lockdep** tracks lock usage to detect deadlocks, double locking, and lock-order inversion.
- **ftrace**, **perf**, and **eBPF** support runtime tracing and instrumentation.

Step 2: Explain Syzkaller. Syzkaller fuzzes kernels by generating short syscall programs. It runs the target kernel in VMs, commonly with KASAN and coverage enabled, because a successful fuzz may crash the kernel.

Step 3: Explain Syzlang. Syzlang describes syscall argument types, resources passed between syscalls, and length fields. This grammar makes fuzzing much more effective than random bytes because valid syscall sequences often require state, such as opening a file before reading from its file descriptor.

Step 4: Explain Syzbot. Syzbot continuously runs Syzkaller across many kernels and VMs. The notes emphasise that roughly two-thirds of reports can be invalid, so triage burden is part of the cost.

Step 5: Explain Linux Test Project. It provides thousands of regression and conformance tests for syscalls, filesystems, networking, memory management, and CVE reproductions.

Step 6: Static analysis examines code without executing it.

- **Coccinelle** and **Smatch** find pattern-based mistakes, such as missing frees or incorrect API usage.
- **Sparse** uses annotations such as `__user` to express properties tools can check, such as "this pointer refers to userspace and must not be directly dereferenced."

Step 7: State the trade-off. Dynamic tools have runtime context but path-dependent coverage. Static tools can cover code broadly but face false positives, state explosion, and scalability problems in 20M+ line kernels.

---

### Question 8: DAC, MAC, SELinux, and LSM

**Q:** Compare DAC and MAC. Explain how SELinux and LSM fit together, and state the order of checks when opening a file.

**Answer & Explanation:**

Step 1: Define DAC. Discretionary Access Control lets resource owners configure access to resources they own. UNIX permission bits are DAC because users can use `chmod` and `chown` within allowed rules.

Step 2: State DAC's weakness. DAC assumes users and their processes behave correctly. It fails when users misconfigure permissions or when a user's process is compromised and changes security settings maliciously.

Step 3: Define MAC. Mandatory Access Control uses administrator-defined security labels and policies. Ordinary users and ordinary processes cannot override the policy.

Step 4: Explain SELinux. SELinux is a MAC policy system for Linux. It assigns contexts and types to processes and resources, then applies deny-by-default rules that explicitly permit allowed operations.

Step 5: Explain LSM. Linux Security Modules is the kernel mechanism that provides hooks at security-sensitive operations. SELinux, AppArmor, Smack, and TOMOYO are policies/modules that use those hooks.

Step 6: State the open sequence.

1. Syscall begins processing.
2. The inode is looked up.
3. Basic error checks are performed.
4. DAC checks are performed.
5. The LSM hook runs, allowing, denying, or logging.
6. If all checks permit, the operation proceeds.

Step 7: State the composition rule. MAC complements DAC rather than replacing it. DAC is checked first, SELinux/LSM after it, and both must permit the operation.

---

### Question 9: Confused deputy and capabilities

**Q:** Explain the confused deputy problem using the compiler and `billing.txt` example. Then explain how capabilities solve the root cause.

**Answer & Explanation:**

Step 1: State the setup. A compiler is allowed to write usage statistics to `/sysx/language-stats.txt`, so it has write authority in `/sysx`. The same directory also contains `billing.txt`, which ordinary users must not modify.

Step 2: State the attack. A user invokes the compiler and supplies `/sysx/billing.txt` as the debug-symbol output file. The compiler writes to it using the compiler's authority, even though the user could not write to it directly.

Step 3: Define confused deputy. A privileged deputy is tricked into using its own authority on a resource named by a less-privileged caller.

Step 4: Identify the root cause. ACL-style systems separate designation from authority. The user supplies the name of the object, while the compiler supplies the permission to act on it.

Step 5: Define a capability. A capability is an unforgeable token that combines:

- designation of a resource, and
- permission to access that resource.

If a process can name a resource by capability, it can access it; if it lacks the capability, it cannot name it.

Step 6: Apply to the compiler. The shell passes the compiler only capabilities for the user's source file, executable output, and debug-symbol output. The compiler obtains the statistics-file capability directly from the kernel, not through the shell. The compiler never receives a capability for `billing.txt`, so it cannot overwrite it.

Step 7: Security conclusion. Capabilities make the attack inexpressible rather than trying to block a dangerous pathname after the fact.

---

### Question 10: Trusted Execution Environments

**Q:** Define a Trusted Execution Environment. Compare SGX, SEV, and TrustZone by granularity, memory encryption, application changes, TCB size, and weak interface. Explain why availability is out of scope.

**Answer & Explanation:**

Step 1: Define TEE. A Trusted Execution Environment is a hardware-enforced isolated execution context resistant to information disclosure and tampering by the host OS or hypervisor.

Step 2: State what it protects.

- Confidentiality: host software cannot read TEE code/data.
- Integrity: host software cannot alter TEE code/data.
- Availability: not guaranteed.

Step 3: Explain why availability is out of scope. If the attacker controls the host OS or hypervisor, they can refuse to schedule the TEE, power off the machine, or deny I/O. Hardware isolation cannot force a malicious host to provide service.

Step 4: Compare implementations.

| Feature | Intel SGX | AMD SEV | ARM TrustZone |
|---|---|---|---|
| Granularity | Part of an application, called an enclave. | Whole virtual machine. | System-wide secure world. |
| Memory encryption | Yes. | Yes. | No, according to these notes. |
| Application changes | Required; code must be split or ported to an enclave framework. | None for many existing VMs. | Trusted apps written for secure world. |
| TCB inside | Enclave code, often plus small embedded OS/runtime. | Application plus entire guest OS. | Secure-world OS plus trusted apps. |
| Weak interface | Enclave exits for syscalls and I/O. | Virtual hardware interface. | Calls between normal and secure world. |

Step 5: Explain attestation. Remote attestation proves that the TEE runs on expected hardware and that the software loaded inside has the expected measurement.

---

### Question 11: OS models and the isolation/performance trade-off

**Q:** Compare monolithic kernels, microkernels, exokernels, and unikernels in security terms. Why does this unit place unikernels on the faster, less-secure side of the design space?

**Answer & Explanation:**

Step 1: Define monolithic kernel. A monolithic kernel keeps most OS services inside one privileged address space. This gives good performance because kernel subsystems call each other directly, but there is little internal isolation.

Step 2: Define microkernel. A microkernel keeps only core functions, such as scheduling, process/memory management, and IPC, in the kernel. Drivers and filesystems run as userspace servers. This increases isolation but adds IPC and domain-crossing overhead.

Step 3: Define exokernel. An exokernel exposes low-level securely multiplexed hardware resources, while applications use specialised library OS components.

Step 4: Define unikernel. A unikernel packages an application and a library OS into one VM image. The hypervisor provides external isolation between unikernel instances.

Step 5: State the key trade-off. Unikernels are externally isolated from other VMs, but internally there is no user/kernel protection boundary between the application and its library OS.

Step 6: Explain why this unit treats unikernels as faster but less secure. System calls that do not need the hypervisor can become ordinary function calls. That improves performance, but if the application is compromised, the attacker can access the whole unikernel instance because internal isolation is absent.

---

## Part 2: Memory & Storage Size Calculations

### Question 12: Disk sector count and wasted bytes

**Q:** A file has size 151,152 bytes. The storage device uses 512-byte sectors. Calculate:

1. The minimum number of sectors needed to store the file.
2. The total sector-aligned storage consumed.
3. The unused bytes in the final sector.

**Answer & Explanation:**

Step 1: Use the sector formula.

```text
sectors = ceil(file_size / sector_size)
```

Step 2: Divide.

```text
151,152 / 512 = 295 remainder 112
```

So 295 sectors are not enough; one more sector is needed.

Step 3: Calculate sectors.

```text
sectors = 296
```

Step 4: Calculate total sector-aligned storage.

```text
296 * 512 = 151,552 bytes
```

Step 5: Calculate unused bytes.

```text
151,552 - 151,152 = 400 bytes
```

Answer:

```text
296 sectors, 151,552 bytes consumed, 400 unused bytes
```

---

### Question 13: Page-cache and sector coverage

**Q:** A `read` begins at file byte offset 6,000 and requests 9,000 bytes. Assume 4 KB page-cache pages and 512-byte disk sectors. Calculate:

1. The first and last page-cache page indices touched.
2. The number of page-cache pages touched.
3. The first and last disk sector indices touched.
4. The number of disk sectors touched.

**Answer & Explanation:**

Step 1: Calculate the last byte read.

```text
start = 6000
length = 9000
last byte = start + length - 1 = 6000 + 9000 - 1 = 14999
```

Step 2: Calculate page-cache indices.

```text
page size = 4096
first page = floor(6000 / 4096) = 1
last page  = floor(14999 / 4096) = 3
pages touched = 3 - 1 + 1 = 3
```

Step 3: Calculate sector indices.

```text
sector size = 512
first sector = floor(6000 / 512) = 11
last sector  = floor(14999 / 512) = 29
sectors touched = 29 - 11 + 1 = 19
```

Step 4: Interpret. The read spans 3 page-cache pages and 19 disk sectors. The storage stack can use these ranges to merge, split, or reorder I/O requests.

---

### Question 14: Struct alignment for a VFS file object

**Q:** Consider the following complete C program. Under the assumptions at the top of this document, calculate:

1. `sizeof(struct VfsFile)`.
2. The offset of each field.
3. `sizeof(files)`.
4. If `files[0]` starts at `0x5000`, the address of `files[4].name[7]`.

```c
#include <stdint.h>
#include <stddef.h>
#include <stdio.h>

struct VfsFile {
    uint32_t flags;
    uint64_t offset;
    void *inode;
    uint16_t mode;
    char name[14];
};

int main(void) {
    struct VfsFile files[6];

    printf("%zu\n", sizeof(struct VfsFile));
    printf("%zu\n", offsetof(struct VfsFile, flags));
    printf("%zu\n", offsetof(struct VfsFile, offset));
    printf("%zu\n", offsetof(struct VfsFile, inode));
    printf("%zu\n", offsetof(struct VfsFile, mode));
    printf("%zu\n", offsetof(struct VfsFile, name));
    printf("%zu\n", sizeof(files));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Lay out fields.

| Field | Size | Alignment | Offset |
|---|---:|---:|---:|
| `flags` | 4 | 4 | 0 |
| padding | 4 | - | 4..7 |
| `offset` | 8 | 8 | 8 |
| `inode` | 8 | 8 | 16 |
| `mode` | 2 | 2 | 24 |
| `name[14]` | 14 | 1 | 26 |

Step 2: Calculate structure size. After `name`, the next offset is:

```text
26 + 14 = 40
```

The largest alignment is 8. `40` is already a multiple of 8, so:

```text
sizeof(struct VfsFile) = 40 bytes
```

Step 3: Calculate array size.

```text
sizeof(files) = 6 * 40 = 240 bytes
```

Step 4: Calculate address of `files[4].name[7]`.

```text
base of files[4] = 0x5000 + 4 * 40
                 = 0x5000 + 160
                 = 0x50a0

offset of name[7] = offset(name) + 7
                  = 26 + 7
                  = 33
                  = 0x21

address = 0x50a0 + 0x21 = 0x50c1
```

---

### Question 15: Struct alignment for LSM security metadata

**Q:** Consider the following complete C program. Under the assumptions at the top of this document, calculate:

1. `sizeof(struct SecurityBlob)`.
2. The offsets of `label`, `sid`, `permissions`, `type`, and `next`.
3. If `blobs[0]` starts at `0x9000`, the address of `blobs[2].next`.

```c
#include <stdint.h>
#include <stddef.h>
#include <stdio.h>

struct SecurityBlob {
    uint8_t label;
    uint32_t sid;
    uint64_t permissions;
    char type[12];
    void *next;
};

int main(void) {
    struct SecurityBlob blobs[3];

    printf("%zu\n", sizeof(struct SecurityBlob));
    printf("%zu\n", offsetof(struct SecurityBlob, label));
    printf("%zu\n", offsetof(struct SecurityBlob, sid));
    printf("%zu\n", offsetof(struct SecurityBlob, permissions));
    printf("%zu\n", offsetof(struct SecurityBlob, type));
    printf("%zu\n", offsetof(struct SecurityBlob, next));
    printf("%zu\n", sizeof(blobs));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Place `label`.

```text
label: offset 0, size 1
```

Step 2: Align `sid`. `sid` is 4 bytes and requires 4-byte alignment, so 3 bytes of padding follow `label`.

```text
sid: offset 4, size 4
```

Step 3: Place `permissions`.

```text
permissions: offset 8, size 8
```

Step 4: Place `type`.

```text
type: offset 16, size 12, occupies offsets 16..27
```

Step 5: Align `next`. `next` is a pointer requiring 8-byte alignment. The next free offset is 28, so 4 bytes of padding are inserted.

```text
next: offset 32, size 8
```

Step 6: Compute structure size.

```text
next ends at offset 40
largest alignment = 8
40 is a multiple of 8
sizeof(struct SecurityBlob) = 40
```

Step 7: Compute `blobs[2].next`.

```text
base of blobs[2] = 0x9000 + 2 * 40
                 = 0x9000 + 80
                 = 0x9050

offset(next) = 32 = 0x20
address = 0x9050 + 0x20 = 0x9070
```

---

### Question 16: UNIX permission bits

**Q:** A file has owner UID `1000`, group GID `2000`, and mode `0754`. For each process below, decide whether it can read, write, and execute the file under DAC alone:

1. Process A: UID `1000`, GID `9999`.
2. Process B: UID `3000`, GID `2000`.
3. Process C: UID `3000`, GID `3000`.

**Answer & Explanation:**

Step 1: Decode mode `0754`.

```text
owner: 7 = rwx
group: 5 = r-x
other: 4 = r--
```

Step 2: Apply matching order.

- If process UID matches file owner UID, use owner bits.
- Else if process GID matches file owner GID, use group bits.
- Else use other bits.

Step 3: Decide access.

| Process | Matching class | Read | Write | Execute |
|---|---|---:|---:|---:|
| A: UID 1000 | Owner | Yes | Yes | Yes |
| B: GID 2000 | Group | Yes | No | Yes |
| C: neither | Other | Yes | No | No |

Step 4: Security note. This is only DAC. A MAC policy such as SELinux may still deny an operation that DAC permits.

---

### Question 17: Access-control matrix storage

**Q:** An access-control matrix has 6 subjects and 9 objects. Each cell stores a one-byte bitmask for read, write, execute, and append permissions.

1. How many bytes are needed for the matrix?
2. If the matrix is stored row-major by object, then subject, what is the byte offset for object index `7`, subject index `4`?
3. If the matrix base address is `0x3000`, what is the address of that cell?

**Answer & Explanation:**

Step 1: Calculate total cells.

```text
subjects = 6
objects = 9
cells = 6 * 9 = 54
```

Step 2: Calculate storage.

```text
one byte per cell
total = 54 bytes
```

Step 3: Calculate row-major offset by object.

```text
offset = object_index * number_of_subjects + subject_index
       = 7 * 6 + 4
       = 46
       = 0x2e
```

Step 4: Calculate address.

```text
address = 0x3000 + 0x2e = 0x302e
```

Step 5: Interpretation. DAC, MAC, and capabilities are different ways to represent or enforce this abstract subject-operation-object matrix.

---

## Part 3: Code Tracing & Output Prediction

### Question 18: File object offsets with `dup` and `open`

**Q:** Trace the following complete POSIX C program. Assuming all system calls succeed, give the exact console output.

```c
#define _XOPEN_SOURCE 700

#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(void) {
    char path[] = "/tmp/comp60261_ch4_XXXXXX";
    char buf[5] = {0};
    int fd1;
    int fd2;
    int fd3;

    fd1 = mkstemp(path);
    write(fd1, "ABCDEFGH", 8);
    lseek(fd1, 0, SEEK_SET);

    fd2 = dup(fd1);

    read(fd1, buf, 2);
    read(fd2, buf + 2, 2);
    printf("%s\n", buf);

    fd3 = open(path, O_RDONLY);
    memset(buf, 0, sizeof(buf));
    read(fd3, buf, 2);
    printf("%s\n", buf);

    close(fd1);
    close(fd2);
    close(fd3);
    unlink(path);

    return 0;
}
```

**Answer & Explanation:**

Step 1: `fd1` opens a temporary file and writes `ABCDEFGH`.

Step 2: `lseek(fd1, 0, SEEK_SET)` resets `fd1`'s file offset to 0.

Step 3: `fd2 = dup(fd1)` creates another descriptor for the same kernel file object. Therefore `fd1` and `fd2` share the same file offset.

Step 4: `read(fd1, buf, 2)` reads `AB` and advances the shared offset to 2.

Step 5: `read(fd2, buf + 2, 2)` continues from the shared offset 2, reads `CD`, and stores it after `AB`.

First line:

```text
ABCD
```

Step 6: `fd3 = open(path, O_RDONLY)` creates a new file object with an independent offset starting at 0.

Step 7: Reading 2 bytes from `fd3` reads `AB`.

Exact output:

```text
ABCD
AB
```

VFS note: `dup` shares a file object; a separate `open` creates a distinct file object over the same inode.

---

### Question 19: Permission-bit tracing

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

#define R 4
#define W 2
#define X 1

static void print_perm(int bits) {
    putchar((bits & R) ? 'r' : '-');
    putchar((bits & W) ? 'w' : '-');
    putchar((bits & X) ? 'x' : '-');
}

int main(void) {
    int owner = R | W | X;
    int group = R | X;
    int other = 0;
    int mode = (owner << 6) | (group << 3) | other;

    printf("%03o ", mode);
    print_perm(owner);
    print_perm(group);
    print_perm(other);
    putchar('\n');

    return 0;
}
```

**Answer & Explanation:**

Step 1: Decode each class.

```text
owner = R | W | X = 4 | 2 | 1 = 7
group = R | X     = 4 | 1     = 5
other = 0
```

Step 2: Compute mode.

```text
mode = (7 << 6) | (5 << 3) | 0
     = octal 750
```

Step 3: Print permissions.

- Owner `7` prints `rwx`.
- Group `5` prints `r-x`.
- Other `0` prints `---`.

Exact output:

```text
750 rwxr-x---
```

---

### Question 20: DAC then MAC decision order

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

static int dac_allows(int uid_matches, int mode_write_bit) {
    return uid_matches && mode_write_bit;
}

static int mac_allows(const char *subject_type, const char *object_type) {
    return subject_type[0] == 'h' && object_type[0] == 'w';
}

int main(void) {
    int uid_matches = 1;
    int mode_write_bit = 1;
    const char *subject = "httpd_t";
    const char *object = "db_t";

    int dac = dac_allows(uid_matches, mode_write_bit);
    int mac = mac_allows(subject, object);

    printf("dac=%d mac=%d final=%d\n", dac, mac, dac && mac);

    object = "web_content_t";
    mac = mac_allows(subject, object);
    printf("dac=%d mac=%d final=%d\n", dac, mac, dac && mac);

    return 0;
}
```

**Answer & Explanation:**

Step 1: DAC calculation. `uid_matches` and `mode_write_bit` are both 1, so:

```text
dac = 1
```

Step 2: First MAC calculation. `subject` is `"httpd_t"` so `subject_type[0] == 'h'` is true. `object` is `"db_t"` so `object_type[0] == 'w'` is false.

```text
mac = 0
final = dac && mac = 0
```

First line:

```text
dac=1 mac=0 final=0
```

Step 3: Second MAC calculation. `object` becomes `"web_content_t"`, whose first character is `w`.

```text
mac = 1
final = 1 && 1 = 1
```

Exact output:

```text
dac=1 mac=0 final=0
dac=1 mac=1 final=1
```

Security note: this models the Chapter 4 rule that SELinux/MAC is checked after DAC and both must permit.

---

### Question 21: Capability subsetting

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

#define CAP_SRC   0x01u
#define CAP_OUT   0x02u
#define CAP_DEBUG 0x04u
#define CAP_STATS 0x08u
#define CAP_BILL  0x10u

static unsigned subset(unsigned parent_caps, unsigned requested) {
    return parent_caps & requested;
}

int main(void) {
    unsigned kernel_caps = CAP_SRC | CAP_OUT | CAP_DEBUG | CAP_STATS | CAP_BILL;
    unsigned shell_caps = subset(kernel_caps, CAP_SRC | CAP_OUT | CAP_DEBUG);
    unsigned compiler_caps = subset(shell_caps, CAP_SRC | CAP_OUT | CAP_DEBUG);

    compiler_caps |= CAP_STATS;

    printf("shell=0x%02x compiler=0x%02x can_bill=%d\n",
           shell_caps,
           compiler_caps,
           (compiler_caps & CAP_BILL) != 0);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Kernel starts with all capabilities:

```text
CAP_SRC | CAP_OUT | CAP_DEBUG | CAP_STATS | CAP_BILL
```

Step 2: Shell receives only:

```text
CAP_SRC | CAP_OUT | CAP_DEBUG = 0x01 | 0x02 | 0x04 = 0x07
```

Step 3: Compiler receives the same subset from the shell:

```text
0x07
```

Step 4: Compiler independently obtains `CAP_STATS`, modelling the course example where the statistics capability comes directly from the kernel.

```text
compiler_caps = 0x07 | 0x08 = 0x0f
```

Step 5: `CAP_BILL` is `0x10`, which is absent from `compiler_caps`, so `can_bill` is 0.

Exact output:

```text
shell=0x07 compiler=0x0f can_bill=0
```

---

### Question 22: Struct padding and zero initialisation

**Q:** Trace the following complete C program under the assumptions at the top of this document. Give the exact console output.

```c
#include <stdint.h>
#include <stdio.h>
#include <string.h>

struct Reply {
    uint8_t status;
    uint64_t value;
    uint16_t flags;
};

int main(void) {
    struct Reply reply;

    memset(&reply, 0, sizeof(reply));
    reply.status = 1;
    reply.value = 0x1122334455667788ull;
    reply.flags = 7;

    printf("size=%zu status=%u flags=%u\n",
           sizeof(reply),
           (unsigned)reply.status,
           (unsigned)reply.flags);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Layout `status`.

```text
status: offset 0, size 1
```

Step 2: Align `value`. `value` is 8 bytes and requires 8-byte alignment, so offsets `1..7` are padding.

```text
value: offset 8, size 8
```

Step 3: Place `flags`.

```text
flags: offset 16, size 2
```

Step 4: Add tail padding. The next offset is 18, but the whole struct must be a multiple of 8, so it rounds up to 24.

```text
sizeof(reply) = 24
```

Step 5: `memset` zeroes the whole object, including padding, before named fields are set.

Exact output:

```text
size=24 status=1 flags=7
```

Security note: zeroing padding prevents raw struct copies from leaking stale stack or kernel memory.

---

### Question 23: TEE selection logic

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

enum tee_kind {
    TEE_SGX,
    TEE_SEV,
    TEE_TRUSTZONE
};

static const char *name(enum tee_kind kind) {
    switch (kind) {
    case TEE_SGX:
        return "SGX enclave";
    case TEE_SEV:
        return "SEV confidential VM";
    case TEE_TRUSTZONE:
        return "TrustZone secure world";
    }
    return "unknown";
}

int main(void) {
    int needs_unmodified_vm = 1;
    int needs_memory_encryption = 1;
    enum tee_kind chosen;

    if (needs_unmodified_vm && needs_memory_encryption) {
        chosen = TEE_SEV;
    } else {
        chosen = TEE_SGX;
    }

    printf("%s\n", name(chosen));

    return 0;
}
```

**Answer & Explanation:**

Step 1: The program sets:

```text
needs_unmodified_vm = 1
needs_memory_encryption = 1
```

Step 2: The `if` condition is true, so:

```c
chosen = TEE_SEV;
```

Step 3: `name(TEE_SEV)` returns `"SEV confidential VM"`.

Exact output:

```text
SEV confidential VM
```

Conceptual link: SEV protects an entire VM and is chosen when unmodified VM compatibility is required. SGX has finer granularity but requires enclave-oriented application changes.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 24: Double-fetch bug in a syscall-like handler

**Q:** Identify the bug in the following complete C program that models a syscall handler. Then provide a secure, complete version.

```c
#include <stdint.h>
#include <stdio.h>
#include <string.h>

struct UserRequest {
    uint32_t len;
    char data[16];
};

static int handle_request(const struct UserRequest *user_req) {
    char kernel_buf[16];

    if (user_req->len > sizeof(kernel_buf)) {
        return -1;
    }

    memcpy(kernel_buf, user_req->data, user_req->len);
    return 0;
}

int main(void) {
    struct UserRequest req = {5, "HELLO"};

    printf("%d\n", handle_request(&req));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the model. `user_req` represents a pointer to attacker-controlled userspace memory.

Step 2: Identify the bug. The handler reads `user_req->len` once for the check and again for the `memcpy` length. In a real kernel, another userspace thread could change `len` between those two reads.

Step 3: Classify. This is a TOCTTOU/double-fetch bug.

Step 4: Explain impact. The check may validate a small length, then the use may copy a larger length, overflowing `kernel_buf`.

Step 5: Secure refactor by copying once into a kernel-owned object, then validating the copy.

```c
#include <stdint.h>
#include <stdio.h>
#include <string.h>

struct UserRequest {
    uint32_t len;
    char data[16];
};

static int handle_request(const struct UserRequest *user_req) {
    struct UserRequest req_copy;
    char kernel_buf[16];

    memcpy(&req_copy, user_req, sizeof(req_copy));

    if (req_copy.len > sizeof(req_copy.data) ||
        req_copy.len > sizeof(kernel_buf)) {
        return -1;
    }

    memcpy(kernel_buf, req_copy.data, req_copy.len);
    return 0;
}

int main(void) {
    struct UserRequest req = {5, "HELLO"};

    printf("%d\n", handle_request(&req));
    return 0;
}
```

Step 6: Kernel note. Real kernel code would use `copy_from_user` rather than plain `memcpy`, because userspace pointers may be invalid or faulting.

---

### Question 25: Kernel pointer exposed as a handle

**Q:** Identify the information leak in the following complete C program. Then provide a secure, complete version.

```c
#include <inttypes.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

struct KernelObject {
    int value;
};

static uintptr_t create_handle(void) {
    struct KernelObject *obj = malloc(sizeof(*obj));
    if (obj == NULL) {
        return 0;
    }
    obj->value = 123;
    return (uintptr_t)obj;
}

int main(void) {
    uintptr_t handle = create_handle();

    printf("handle=0x%" PRIxPTR "\n", handle);
    free((void *)handle);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. The program returns the address of an allocated object as an externally visible handle.

Step 2: Security impact. In kernel code, exposing kernel addresses to userspace leaks layout information. A single pointer leak may help defeat KASLR.

Step 3: State the design rule. Do not use addresses as resource identifiers. Use opaque IDs that do not encode memory addresses.

Step 4: Secure refactor using an atomic-style counter. This single-threaded teaching example uses a monotonically increasing integer ID.

```c
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

struct KernelObject {
    int value;
    uint64_t id;
};

static uint64_t next_id = 1;
static struct KernelObject *last_object = NULL;

static uint64_t create_handle(void) {
    struct KernelObject *obj = malloc(sizeof(*obj));
    if (obj == NULL) {
        return 0;
    }

    obj->value = 123;
    obj->id = next_id++;
    last_object = obj;
    return obj->id;
}

int main(void) {
    uint64_t handle = create_handle();

    printf("handle=%llu\n", (unsigned long long)handle);
    free(last_object);
    return 0;
}
```

Step 5: Production note. Real kernels need handle tables, lifetime management, locking, and permissions checks. The important security property is that the handle is not a pointer.

---

### Question 26: Raw struct copy leaks padding

**Q:** Identify the information leak in the following complete POSIX C program. Then provide a secure, complete version.

```c
#include <stdint.h>
#include <unistd.h>

struct Reply {
    uint8_t status;
    uint64_t value;
    uint16_t flags;
};

int main(void) {
    struct Reply reply;

    reply.status = 1;
    reply.value = 0x1122334455667788ull;
    reply.flags = 7;

    write(STDOUT_FILENO, &reply, sizeof(reply));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify padding. The compiler inserts padding between `status` and `value`, and tail padding after `flags`, to satisfy alignment.

Step 2: Identify the bug. The named fields are initialised, but the padding bytes are not. Writing the whole struct copies those uninitialised bytes to standard output.

Step 3: Security impact. If this pattern occurs in kernel code returning a structure to userspace, stale kernel stack data or pointers may leak, weakening KASLR and exposing secrets.

Step 4: Secure refactor by zero-initialising the object first.

```c
#include <stdint.h>
#include <string.h>
#include <unistd.h>

struct Reply {
    uint8_t status;
    uint64_t value;
    uint16_t flags;
};

int main(void) {
    struct Reply reply;

    memset(&reply, 0, sizeof(reply));
    reply.status = 1;
    reply.value = 0x1122334455667788ull;
    reply.flags = 7;

    write(STDOUT_FILENO, &reply, sizeof(reply));
    return 0;
}
```

Step 5: Stronger protocol design. Avoid exposing raw C struct layout across trust boundaries. Serialise fields explicitly into a byte buffer with defined sizes and endianness.

---

### Question 27: Confused deputy through pathname output

**Q:** Identify the confused-deputy bug in the following complete C program. Then provide a safer, complete version using a caller-provided file descriptor.

```c
#include <stdio.h>

static int write_report(const char *path) {
    FILE *fp = fopen(path, "w");
    if (fp == NULL) {
        return -1;
    }
    fputs("report\n", fp);
    fclose(fp);
    return 0;
}

int main(int argc, char **argv) {
    if (argc != 2) {
        return 1;
    }

    return write_report(argv[1]) == 0 ? 0 : 1;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. If `write_report` runs with more authority than the caller, the caller can supply the name of a file it could not write directly. The helper then writes using its own authority.

Step 2: Classify. This is a confused deputy: caller supplies designation, deputy supplies authority.

Step 3: Why path validation is fragile. Canonicalising and checking pathnames can be race-prone and may miss hard links, symlinks, bind mounts, or namespace changes.

Step 4: Safer refactor. Require the caller to provide an already-open file descriptor. This is closer to capability style: the descriptor names an object and carries authority to write it.

```c
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

static int write_report_fd(int fd) {
    const char msg[] = "report\n";
    ssize_t n = write(fd, msg, sizeof(msg) - 1);

    return n == (ssize_t)(sizeof(msg) - 1) ? 0 : -1;
}

int main(int argc, char **argv) {
    char *end = NULL;
    long fd_long;

    if (argc != 2) {
        fprintf(stderr, "usage: %s <open-fd>\n", argv[0]);
        return 1;
    }

    errno = 0;
    fd_long = strtol(argv[1], &end, 10);
    if (errno != 0 || end == argv[1] || *end != '\0' || fd_long < 0) {
        fprintf(stderr, "invalid fd\n");
        return 1;
    }

    if (write_report_fd((int)fd_long) != 0) {
        fprintf(stderr, "write failed: %s\n", strerror(errno));
        return 1;
    }

    return 0;
}
```

Step 5: Security conclusion. The helper no longer resolves a caller-supplied pathname with helper authority. It writes only to an object for which the caller already supplied a capability-like descriptor.

---

### Question 28: Unsafe `system` call in privileged code

**Q:** Identify the security bug in the following complete C program. Then provide a safer, complete version.

```c
#include <stdlib.h>

int main(void) {
    return system("cp /tmp/input.txt /var/app/output.txt");
}
```

**Answer & Explanation:**

Step 1: Identify the context. This pattern is especially dangerous in privileged or setuid-style programs.

Step 2: Identify the bug. `system` invokes a shell. The shell uses environment variables and shell parsing rules. An attacker may influence `PATH`, shell behaviour, file descriptors, or other inherited process state.

Step 3: Security impact. Privileged code may execute the wrong program or interpret attacker-controlled shell syntax. This violates least privilege and expands the attack surface.

Step 4: Safer refactor. Avoid the shell. Use direct file operations with fixed paths, bounded buffers, and checked return values.

```c
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(void) {
    int in_fd;
    int out_fd;
    char buf[4096];
    ssize_t n;

    in_fd = open("/tmp/input.txt", O_RDONLY | O_NOFOLLOW);
    if (in_fd < 0) {
        perror("open input");
        return 1;
    }

    out_fd = open("/var/app/output.txt",
                  O_WRONLY | O_CREAT | O_TRUNC | O_NOFOLLOW,
                  0600);
    if (out_fd < 0) {
        perror("open output");
        close(in_fd);
        return 1;
    }

    while ((n = read(in_fd, buf, sizeof(buf))) > 0) {
        char *p = buf;
        ssize_t remaining = n;

        while (remaining > 0) {
            ssize_t written = write(out_fd, p, (size_t)remaining);
            if (written < 0) {
                perror("write");
                close(in_fd);
                close(out_fd);
                return 1;
            }
            p += written;
            remaining -= written;
        }
    }

    if (n < 0) {
        perror("read");
        close(in_fd);
        close(out_fd);
        return 1;
    }

    close(in_fd);
    close(out_fd);
    return 0;
}
```

Step 5: Remaining policy note. In real privileged code, also drop privileges as early as possible, sanitise the environment, validate paths against policy, and consider MAC/seccomp confinement.

---

### Question 29: Missing permission check in a privileged mediator

**Q:** Identify the security bug in the following complete C program that models a privileged mediator. Then provide a secure, complete version.

```c
#include <stdio.h>
#include <string.h>

struct Request {
    int caller_uid;
    int target_owner_uid;
    char new_label[16];
};

static int relabel_object(const struct Request *req) {
    printf("label=%s\n", req->new_label);
    return 0;
}

int main(void) {
    struct Request req = {1001, 0, "top_secret"};

    return relabel_object(&req);
}
```

**Answer & Explanation:**

Step 1: Identify the role. `relabel_object` models a privileged mediator changing security metadata.

Step 2: Identify the bug. It performs no permission check. A caller with UID `1001` can relabel an object owned by UID `0`.

Step 3: Classify. This is not primarily memory unsafety. It is a missing permission check, one of the kernel vulnerability classes highlighted in Chapter 4.

Step 4: Secure refactor. Validate authority before changing the label, and use bounded formatting to keep the label terminated.

```c
#include <stdio.h>
#include <string.h>

struct Request {
    int caller_uid;
    int target_owner_uid;
    char new_label[16];
};

static int may_relabel(int caller_uid, int target_owner_uid) {
    return caller_uid == 0 || caller_uid == target_owner_uid;
}

static int relabel_object(const struct Request *req) {
    char label[16];
    int written;

    if (!may_relabel(req->caller_uid, req->target_owner_uid)) {
        fprintf(stderr, "permission denied\n");
        return 1;
    }

    written = snprintf(label, sizeof(label), "%s", req->new_label);
    if (written < 0 || (size_t)written >= sizeof(label)) {
        fprintf(stderr, "label too long\n");
        return 1;
    }

    printf("label=%s\n", label);
    return 0;
}

int main(void) {
    struct Request req = {1001, 0, "top_secret"};

    return relabel_object(&req);
}
```

Step 5: Expected behaviour of the secure version for the shown request. Since UID `1001` is neither root nor the target owner UID `0`, the program rejects the operation with `permission denied`.

---

### Question 30: Seccomp-style filtering mistake

**Q:** Identify the policy bug in the following complete C program that models a syscall filter. Then provide a secure, complete version.

```c
#include <stdio.h>

enum Syscall {
    SYS_READ,
    SYS_WRITE,
    SYS_OPEN,
    SYS_MOUNT,
    SYS_LOAD_MODULE
};

static int syscall_allowed(enum Syscall nr) {
    if (nr == SYS_LOAD_MODULE) {
        return 0;
    }
    return 1;
}

int main(void) {
    printf("mount=%d module=%d\n",
           syscall_allowed(SYS_MOUNT),
           syscall_allowed(SYS_LOAD_MODULE));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the policy. The filter denies only `SYS_LOAD_MODULE` and permits everything else.

Step 2: Identify the bug. This is a blacklist. It accidentally leaves dangerous operations such as `SYS_MOUNT` allowed.

Step 3: Security impact. For sandboxing, a too-permissive syscall filter leaves large kernel attack surface reachable. The notes emphasise that deriving precise syscall allow/deny lists is hard.

Step 4: Secure refactor using an allowlist for the small set the application needs.

```c
#include <stdio.h>

enum Syscall {
    SYS_READ,
    SYS_WRITE,
    SYS_OPEN,
    SYS_MOUNT,
    SYS_LOAD_MODULE
};

static int syscall_allowed(enum Syscall nr) {
    switch (nr) {
    case SYS_READ:
    case SYS_WRITE:
        return 1;
    case SYS_OPEN:
    case SYS_MOUNT:
    case SYS_LOAD_MODULE:
        return 0;
    }
    return 0;
}

int main(void) {
    printf("mount=%d module=%d\n",
           syscall_allowed(SYS_MOUNT),
           syscall_allowed(SYS_LOAD_MODULE));
    return 0;
}
```

Step 5: Exact output of the secure version.

```text
mount=0 module=0
```

Step 6: Design conclusion. Allowlisting is usually safer than denylisting for sandboxing because unknown or newly added operations default to denied.

---

## Final Exam Checklist

- Storage stack: application syscalls, VFS, concrete filesystem, page cache, block layer, optional device mapper, low-level protocol, driver.
- Network stack: socket interface, transport, network, link, NIC driver.
- Layering provides abstraction but costs latency; kernel bypass trades OS mediation for performance.
- VFS objects: superblock per mounted filesystem, inode per file, dentry per name, file object per open instance.
- Two dentries can reference one inode; duplicated descriptors share a file object, separate opens do not.
- User/kernel isolation has two clauses: no direct kernel memory access and only safe entry points.
- The basic trust model fails for boot, kernel, hardware, and administrator/owner assumptions.
- Syscall interface is the main user-to-kernel attack surface.
- Double fetch / TOCTTOU: copy user data into kernel memory once, validate the copy, then use the copy.
- Kernel vulnerability classes include missing pointer checks and missing permission checks, not only memory-safety bugs.
- SMEP/SMAP defend against ret2usr; ret2dir is the named bypass.
- Kernel canaries are weakened by one canary value per CPU; KASLR is weakened by one pointer leak.
- Do not expose kernel pointers as identifiers; use opaque counters or handles.
- KASAN, KUBSAN, Lockdep, Syzkaller, LTP, Coccinelle, Smatch, and Sparse address different bug-detection needs.
- Syzkaller uses grammar-aware syscall programs; Syzlang models syscall arguments, resources, and lengths.
- DAC lets owners configure access; MAC uses administrator-defined immutable labels.
- SELinux is policy; LSM is mechanism.
- DAC is checked before LSM/SELinux, and both must permit.
- Confused deputy arises when caller supplies designation and deputy supplies authority.
- Capabilities combine designation and authority in an unforgeable token.
- TEE protects confidentiality and integrity against a hostile host OS/hypervisor, not availability.
- SGX = enclave; SEV = confidential VM; TrustZone = secure world and no memory encryption in these notes.
- Remote attestation proves expected hardware and untampered software measurement.
- Monolithic kernels optimise performance with less internal isolation.
- Microkernels increase isolation by moving services to userspace servers at IPC cost.
- Unikernels have strong external VM isolation but no internal user/kernel boundary; this unit treats them as faster but less secure internally.
