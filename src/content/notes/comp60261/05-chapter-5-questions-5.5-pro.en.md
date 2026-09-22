---
subject: COMP60261
chapter: 5
title: "Chapter 5 Exam Questions - 5.5 Pro"
language: "en"
---

# Chapter 5 Exam Practice Set: Software Compartmentalisation

**AI author:** 5.5 Pro  
**Source material:** COMP60261 Week 5 / Chapter 5 notes on software compartmentalisation, compartment interface vulnerabilities, policies, abstractions, mechanisms, and the security/performance/engineering-effort trade-off.

Unless a question states otherwise, assume:

- A Linux-like environment for POSIX examples.
- 4 KB pages for page-granularity isolation.
- LP64 C layout: `char` is 1 byte, `short` is 2 bytes, `int` is 4 bytes, `long` and pointers are 8 bytes.
- Structure layout uses ordinary alignment and padding: each field is aligned to its own alignment, and the whole structure is rounded up to the largest field alignment.
- A "cross-compartment call" is a security-domain transition, not an ordinary function call.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1: What compartmentalisation is for

**Q:** Define software compartmentalisation. Why is it different from memory-safety defences such as stack canaries, ASLR, sanitizers, or bounds checks?

**Answer & Explanation:**

Step 1: Define the term. **Software compartmentalisation** decomposes software into lesser-privileged components, called compartments, where each compartment has access only to what it needs to do its job.

Step 2: State the security principle. It is least privilege applied inside one application or system, rather than only between processes or users.

Step 3: State the key difference from prevention-oriented defences. Memory-safety defences try to stop bugs or exploitation. Compartmentalisation assumes bugs and exploits will still happen and tries to limit the damage after compromise.

Step 4: Give an example. If an HTTP parser is compromised, compartmentalisation should prevent it from reading cryptographic keys, writing unrelated state, or invoking syscalls it does not need.

Step 5: State the exam conclusion. Compartmentalisation is primarily **impact mitigation**, not bug elimination. A compartmentalised program may contain the same number of bugs as before, but a successful exploit should have a smaller blast radius.

---

### Question 2: Sandbox, safebox, and mutual distrust

**Q:** Define the three trust models from Chapter 5: sandbox, safebox, and mutual distrust. For each, give one concrete example and state the direction of distrust.

**Answer & Explanation:**

Step 1: Define sandbox. A **sandbox** isolates an untrusted component from the rest of the trusted program.

Example: a media parser or PDF renderer is untrusted because it parses attacker-supplied input. The rest of the application is protected from it.

Step 2: Define safebox. A **safebox** isolates a security-critical component from the rest of the program.

Example: a cryptographic library holding private keys is security-critical. It must be protected from a larger application that may be compromised.

Step 3: Define mutual distrust. **Mutual distrust** means compartments distrust each other. Each compartment is protected from the others.

Example: browser renderer compartments for different web origins should not read or corrupt one another's data.

Step 4: State the direction of distrust.

| Model | Direction |
|---|---|
| Sandbox | Trusted program distrusts the isolated component. |
| Safebox | Critical component distrusts the surrounding program. |
| Mutual distrust | Compartments distrust one another. |

Step 5: Explain why direction matters. Validation must be performed on the trusted side of the boundary. If the direction is misidentified, checks are placed in the wrong compartment and become attacker-controlled.

---

### Question 3: Policy, abstractions, mechanism, and monitor

**Q:** Explain the three-step compartmentalisation pipeline: policy, abstractions, and mechanism. What is the role of the privileged monitor?

**Answer & Explanation:**

Step 1: Define policy. A **policy** decides how many compartments exist and what code, data, and resources go into each compartment.

Step 2: Define abstractions. **Abstractions** are how the policy is expressed in code. They describe compartment boundaries, private data, shared data, resource assignment, communication, and cross-compartment calls.

Step 3: Define mechanism. A **mechanism** enforces the policy at runtime. Examples include page tables, CPU privilege levels, MPK, software fault isolation, memory-safe languages, and TEEs.

Step 4: Define privileged monitor. A **privileged monitor** performs security-domain transitions and mediates communication. It may be the OS kernel, a hypervisor, or a special protected compartment.

Step 5: Explain why the monitor must be isolated. If an untrusted compartment can tamper with the monitor, it can alter permissions, forge transitions, or bypass the isolation mechanism.

Step 6: State the structural summary.

```text
Policy decides the split.
Abstractions express the split.
Mechanism enforces the split.
Monitor mediates transitions.
```

---

### Question 4: Compartment interface vulnerabilities

**Q:** Define a compartment interface vulnerability (CIV). List the main CIV classes and explain why retrofitting compartmentalisation creates them.

**Answer & Explanation:**

Step 1: Define CIV. A **compartment interface vulnerability** is a vulnerability arising from missing or improper control-flow and data-flow validation at a compartment boundary.

Step 2: List the main classes.

| CIV group | Examples |
|---|---|
| Data leakage | Exposing addresses; exposing confidential data. |
| Data corruption | Dereferencing corrupted pointers; using corrupted indices; using corrupted objects. |
| Temporal violations | Breaking API call order; corrupted synchronisation primitives; shared-memory TOCTTOU. |

Step 3: Explain why retrofitting creates them. In a monolithic program, a function may safely rely on its caller to validate arguments because both are in one trust domain. After compartmentalisation, that function may be called across a new internal trust boundary. The old caller-side validation may now be on the untrusted side.

Step 4: Give the key example. If `main` checks `index < DATA_SIZE` and then calls `lib_function(index, object)`, the check was acceptable in a monolithic program. If `lib_function` becomes a safebox that distrusts `main`, the check must move into `lib_function`.

Step 5: Exam conclusion. The code can become vulnerable even if the source code did not change. The vulnerability is created by changing the trust model.

---

### Question 5: ConfFuzz findings

**Q:** Summarise the ConfFuzz study and state the exam-relevant conclusions about interface size, impact, and automation.

**Answer & Explanation:**

Step 1: State the method. ConfFuzz injected malformed data at potential compartment boundaries in monolithic software, emulating what would happen if the software were compartmentalised without securing the new interfaces.

Step 2: State the scope. The study covered 36 APIs across sandbox and safebox trust models, including libraries, modules, and internal APIs.

Step 3: State the result. It found 629 unique bugs.

Step 4: State impact facts.

- 75% of scenarios had at least one write vulnerability.
- 70% of read/write vulnerabilities were arbitrary.
- 50% of execute vulnerabilities were arbitrary.

Step 5: State the counter-intuitive conclusion. There was **no correlation between API size and CIV count**. A small API can be highly vulnerable if it exposes dangerous state, and a larger API can be mostly safe if its design avoids fragile shared state.

Step 6: State the automation conclusion. Securing interfaces is unlikely to be fully automatable. Fixing CIVs often requires API redesign, not just adding simple checks.

---

### Question 6: Policy choices

**Q:** Compare code-centric, data-centric, and hybrid compartmentalisation policies. Then explain the granularity trade-off.

**Answer & Explanation:**

Step 1: Define code-centric policy. A **code-centric** policy partitions the program by regions of code.

Examples: one library per compartment, one package per compartment, or one function per compartment.

Step 2: Define data-centric policy. A **data-centric** policy partitions by execution flow or data context. Compartments may run the same code but handle different data.

Example: each web-server worker handling a different connection runs in its own compartment.

Step 3: Define hybrid policy. A **hybrid** policy combines both, such as isolating the SSL library while also separating worker threads from one another.

Step 4: Explain coarse granularity.

- Fewer compartments.
- Fewer domain switches.
- Lower engineering and runtime overhead.
- Less privilege reduction because each compartment contains more code/data.

Step 5: Explain fine granularity.

- More compartments.
- Better privilege reduction.
- More interfaces to secure.
- More domain-switching overhead.
- Higher engineering complexity.

Step 6: State the decision rule. Choose boundaries by threat and crossing frequency, not by blindly minimising compartment size. A tiny compartment with a large, fragile interface can be worse than a coarser one with a simple validated interface.

---

### Question 7: Automation and policy derivation

**Q:** Compare manual, guided manual, policy-refinement, and fully automated compartmentalisation. Why does more automation often weaken security?

**Answer & Explanation:**

Step 1: Define manual. Developers choose and implement the policy directly. This can be strong but requires expertise, effort, and careful review.

Step 2: Define guided manual. Tools provide feedback and analysis while developers still make key boundary decisions. This can improve interface safety and reduce human error.

Step 3: Define policy-refinement. Developers provide a high-level policy, such as annotations or configuration files, and a framework installs a lower-level concrete policy.

Step 4: Define full automation. The tool chooses and applies compartments with no programmer effort.

Step 5: Explain the weakness. Automation depends on program analysis. Static analysis over-approximates dependencies, often causing **oversharing**: data or permissions are shared even when not strictly needed. Dynamic analysis under-approximates, seeing only exercised paths, which can cause runtime failures when unseen paths need missing permissions.

Step 6: State the trade-off. More automation lowers engineering effort but may weaken least privilege and interface guarantees.

---

### Question 8: Abstractions and cross-compartment calls

**Q:** List the five main compartmentalisation abstractions from the notes. Then state the two security requirements for `CALL`/`RETURN`.

**Answer & Explanation:**

Step 1: List the abstractions.

| Abstraction | Purpose |
|---|---|
| `CREATE` | Create a compartment. |
| `DESTROY` | Destroy a compartment. |
| `ASSIGN` | Assign code, data, or resources to a compartment. |
| `CALL` | Enter another compartment through an approved interface. |
| `RETURN` | Return from a cross-compartment call. |

Step 2: State requirement 1: cross-compartment control-flow integrity. An untrusted compartment must not be able to jump to arbitrary addresses inside another compartment. It may enter only through the callee's exposed API.

Step 3: State why requirement 1 matters. Without it, the caller can execute arbitrary code paths in the callee's context, which is an integrity violation.

Step 4: State requirement 2: stack/register sanitisation. The mechanism must switch stacks and clear registers as needed during transitions.

Step 5: State why requirement 2 matters. Residual stack or register values can leak confidential data across the boundary.

Step 6: Exam conclusion. A cross-compartment call is not an ordinary function call. It is a privilege transition that must sanitise both control flow and data flow.

---

### Question 9: Mechanism selection

**Q:** What must every compartmentalisation mechanism provide? Compare page tables, MPK, software fault isolation, memory-safe languages, and TEEs.

**Answer & Explanation:**

Step 1: State the two obligations.

1. Isolated protection domains that prevent one compartment from reading, writing, or executing another compartment's memory.
2. Controlled communication between domains, with cross-compartment CFI and no unnecessary oversharing.

Step 2: Compare mechanisms.

| Mechanism | Strength | Limitation |
|---|---|---|
| Page tables / processes | Strong process isolation, designed into the OS. | Crossings require syscalls/IPC and are relatively expensive. |
| MPK | Fast domain switches inside one address space. | Maximum 16 domains; controls read/write but not execute; needs protection against malicious key-register writes. |
| Software fault isolation | Compiler instruments code to keep it inside a sandbox and constrain control transfers. | Requires trusted compiler/toolchain and adds runtime overhead. |
| Memory-safe languages | Prevent many memory escapes by construction. | Requires compatible language/runtime and may not support legacy C directly. |
| TEEs | Can reduce TCB by excluding host OS/hypervisor for confidentiality and integrity. | Weak interfaces to untrusted host remain; availability is out of scope. |

Step 3: State the overall trade-off. Mechanism choice is a three-way trade between security, performance, and engineering effort.

---

### Question 10: Message passing versus shared memory

**Q:** Compare message passing and shared memory for cross-compartment communication. Why is message passing usually more secure, and why is shared memory usually faster?

**Answer & Explanation:**

Step 1: Define message passing. Data is sent over a channel, such as a pipe, socket, or RPC interface. It is usually copied and may be serialised.

Step 2: Define shared memory. Two compartments map the same memory, then exchange pointers or read/write shared structures.

Step 3: Explain security of message passing. Data is not simultaneously reachable by both compartments after transfer if the design copies it into the receiver. That structurally prevents shared-memory TOCTOU: the sender cannot mutate the receiver's private copy after validation.

Step 4: Explain cost of message passing. It may involve copies, formatting, syscalls, context switches, and scheduling overhead.

Step 5: Explain speed of shared memory. Once mapped, communication can be ordinary loads and stores, and passing a reference is cheaper than copying a large object.

Step 6: Explain risk of shared memory. If compartments run concurrently, one can modify data after another validates it. Shared memory also widens the set of data simultaneously reachable by multiple compartments, increasing oversharing.

---

### Question 11: Availability and distributed-system requirements

**Q:** Why is availability out of scope for most compartmentalisation work? What would a design need to provide strong availability across adversarial compartments?

**Answer & Explanation:**

Step 1: Define availability in this context. A compartment remains able to perform its duties even when other compartments are malicious, crashing, looping, or trying to exhaust resources.

Step 2: Explain why this is hard. Confidentiality and integrity can often be enforced by memory access restrictions. Availability requires resource scheduling, restart logic, dependency management, and state recovery.

Step 3: List requirements.

- Concurrent compartments with asynchronous calls.
- Performance isolation and bounded resource consumption.
- State stored outside restartable compartments or carefully replicated.
- A monitor that can detect failures and restart compartments.
- Recursive restart of crashed compartments and dependent compartments when needed.

Step 4: State the key course phrase. The target software effectively becomes a **distributed application**.

Step 5: Exam conclusion. Availability is not just "another flag" on the mechanism. It requires substantial redesign.

---

## Part 2: Memory & Storage Size Calculations

### Question 12: Domain-switching overhead

**Q:** A compartment boundary is crossed 200,000 times per second.

1. If process-based IPC costs 2.5 microseconds per crossing, how much CPU time per second is spent crossing?
2. If an MPK-style transition costs 80 CPU cycles on a 3 GHz CPU, how much CPU time per second is spent crossing?
3. What does this imply for mechanism choice?

**Answer & Explanation:**

Step 1: Process-based IPC cost.

```text
200,000 crossings/s * 2.5 microseconds/crossing
= 500,000 microseconds/s
= 0.5 seconds/s
```

That is roughly 50% of one CPU core just on crossing overhead.

Step 2: MPK-style transition cost.

```text
crossings/s = 200,000
cycles/crossing = 80
cycles/s = 200,000 * 80 = 16,000,000 cycles/s
```

At 3 GHz:

```text
3 GHz = 3,000,000,000 cycles/s
time = 16,000,000 / 3,000,000,000
     = 0.005333... seconds/s
```

That is about 0.53% of one CPU core.

Step 3: Interpretation. If crossings are frequent, domain-switching latency dominates. Process isolation may still be appropriate for high-risk boundaries, but hot paths often require cheaper mechanisms, batching, or moving the boundary.

---

### Question 13: Page-granularity oversharing

**Q:** A page-granularity mechanism protects memory in 4 KB pages. One page contains the following objects:

```text
secret_key:   offset 0,    size 96 bytes
parser_state: offset 96,   size 3000 bytes
public_stats: offset 3096, size 800 bytes
unused space: offset 3896 to 4095
```

Only `public_stats` needs to be shared with another compartment.

1. If the page is shared, how many bytes become reachable by the other compartment?
2. How many bytes are actually needed?
3. How many unnecessary bytes are overshared?
4. If each object is moved to its own page, how many bytes are reserved and how many bytes are internal overhead?

**Answer & Explanation:**

Step 1: Page-granularity sharing exposes the whole page.

```text
bytes reachable = 4096
```

Step 2: The intended shared object is only:

```text
public_stats = 800 bytes
```

Step 3: Oversharing is:

```text
4096 - 800 = 3296 bytes
```

Those 3296 bytes include the secret key, parser state, and unused padding in the page.

Step 4: Move each object to its own page. There are 3 objects, so:

```text
reserved = 3 * 4096 = 12,288 bytes
actual object bytes = 96 + 3000 + 800 = 3896 bytes
overhead = 12,288 - 3896 = 8392 bytes
```

Step 5: Interpretation. Page granularity is fast and hardware-supported, but it can force oversharing or increase memory footprint.

---

### Question 14: Struct layout for a gate message

**Q:** Consider the following complete C program. Under the assumptions at the top of this document, calculate:

1. `sizeof(struct GateMessage)`.
2. The offset of each field.
3. `sizeof(messages)`.
4. If `messages[0]` starts at address `0x7000`, the address of `messages[3].payload[10]`.

```c
#include <stdint.h>
#include <stddef.h>
#include <stdio.h>

struct GateMessage {
    uint32_t target;
    uint16_t op;
    uint16_t length;
    uint64_t call_id;
    char payload[18];
};

int main(void) {
    struct GateMessage messages[5];

    printf("%zu\n", sizeof(struct GateMessage));
    printf("%zu\n", offsetof(struct GateMessage, target));
    printf("%zu\n", offsetof(struct GateMessage, op));
    printf("%zu\n", offsetof(struct GateMessage, length));
    printf("%zu\n", offsetof(struct GateMessage, call_id));
    printf("%zu\n", offsetof(struct GateMessage, payload));
    printf("%zu\n", sizeof(messages));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Lay out fields.

| Field | Size | Alignment | Offset |
|---|---:|---:|---:|
| `target` | 4 | 4 | 0 |
| `op` | 2 | 2 | 4 |
| `length` | 2 | 2 | 6 |
| `call_id` | 8 | 8 | 8 |
| `payload[18]` | 18 | 1 | 16 |
| tail padding | 6 | - | 34..39 |

Step 2: Compute structure size. The largest alignment is 8. After `payload`, the next offset is 34, so the structure rounds up to 40 bytes.

```text
sizeof(struct GateMessage) = 40
```

Step 3: Compute array size.

```text
sizeof(messages) = 5 * 40 = 200 bytes
```

Step 4: Compute address of `messages[3].payload[10]`.

```text
base of messages[3] = 0x7000 + 3 * 40
                    = 0x7000 + 120
                    = 0x7078

offset payload[10] = 16 + 10 = 26 = 0x1a

address = 0x7078 + 0x1a = 0x7092
```

---

### Question 15: Access-control matrix inside one application

**Q:** A compartment access-control matrix has 5 compartments and 8 resources. Each cell is a one-byte bitmask storing read, write, execute, and address permissions.

1. How many bytes are needed for the full matrix?
2. If stored row-major by resource, then compartment, what is the byte offset for resource index `6`, compartment index `3`?
3. If the matrix base address is `0x4000`, what is the address of that cell?

**Answer & Explanation:**

Step 1: Count cells.

```text
cells = compartments * resources = 5 * 8 = 40
```

Step 2: Compute storage.

```text
1 byte per cell
total storage = 40 bytes
```

Step 3: Compute row-major offset by resource.

```text
offset = resource_index * number_of_compartments + compartment_index
       = 6 * 5 + 3
       = 33
       = 0x21
```

Step 4: Compute address.

```text
address = 0x4000 + 0x21 = 0x4021
```

Step 5: Conceptual link. This is Lampson's access-control matrix applied inside one program, with compartments as subjects and memory/resources as objects.

---

### Question 16: MPK domain limits

**Q:** Intel MPK supports a maximum of 16 protection-key domains. Calculate:

1. The minimum number of MPK key configurations needed to represent 47 compartments if all 16 domains are usable for compartments.
2. The minimum number needed if one domain is reserved for a trusted monitor, leaving 15 domains for ordinary compartments.
3. Why this matters for policy design.

**Answer & Explanation:**

Step 1: With all 16 domains usable:

```text
ceil(47 / 16) = ceil(2.9375) = 3 configurations
```

Step 2: With one reserved monitor domain:

```text
ordinary domains = 16 - 1 = 15
ceil(47 / 15) = ceil(3.1333...) = 4 configurations
```

Step 3: Interpret. MPK's fixed domain count limits how fine-grained a policy can be without virtualising domains.

Step 4: Security/performance conclusion. Virtualising domains can support more compartments, but switching or remapping virtual domains has a performance cost and adds mechanism complexity. A policy with too many compartments may not fit the chosen mechanism cleanly.

---

### Question 17: Shared channel struct offsets

**Q:** Consider the following complete C program. Under the assumptions at the top of this document, calculate:

1. `sizeof(struct Channel)`.
2. The offset of `data`.
3. The offset of `checksum`.
4. If `channels[0]` starts at `0x10000`, the address of `channels[2].data[99]`.

```c
#include <stdint.h>
#include <stddef.h>
#include <stdio.h>

struct Channel {
    uint32_t state;
    uint32_t len;
    char data[1000];
    uint64_t checksum;
};

int main(void) {
    struct Channel channels[3];

    printf("%zu\n", sizeof(struct Channel));
    printf("%zu\n", offsetof(struct Channel, data));
    printf("%zu\n", offsetof(struct Channel, checksum));
    printf("%zu\n", sizeof(channels));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Lay out fields.

| Field | Size | Alignment | Offset |
|---|---:|---:|---:|
| `state` | 4 | 4 | 0 |
| `len` | 4 | 4 | 4 |
| `data[1000]` | 1000 | 1 | 8 |
| `checksum` | 8 | 8 | 1008 |

Step 2: Verify checksum alignment. `data` ends at:

```text
8 + 1000 = 1008
```

`1008` is divisible by 8, so no padding is needed before `checksum`.

Step 3: Compute structure size.

```text
checksum ends at 1008 + 8 = 1016
1016 is divisible by 8
sizeof(struct Channel) = 1016
```

Step 4: Compute address of `channels[2].data[99]`.

```text
base of channels[2] = 0x10000 + 2 * 1016
                    = 0x10000 + 2032
                    = 0x10000 + 0x7f0
                    = 0x107f0

offset data[99] = 8 + 99 = 107 = 0x6b

address = 0x107f0 + 0x6b = 0x1085b
```

---

## Part 3: Code Tracing & Output Prediction

### Question 18: Boundary-side validation

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

#define DATA_SIZE 4

static double data[DATA_SIZE] = {0.0, 0.0, 0.0, 0.0};

static int safebox_store(int index, double object) {
    if (index < 0 || index >= DATA_SIZE) {
        return -1;
    }

    data[index] = object;
    return 0;
}

int main(void) {
    int r1 = safebox_store(2, 3.5);
    int r2 = safebox_store(7, 9.0);
    int r3 = safebox_store(-1, 1.0);

    printf("r1=%d r2=%d r3=%d data2=%.1f\n", r1, r2, r3, data[2]);
    return 0;
}
```

**Answer & Explanation:**

Step 1: First call:

```text
safebox_store(2, 3.5)
```

Index `2` is valid, so `data[2]` becomes `3.5` and the function returns `0`.

Step 2: Second call:

```text
safebox_store(7, 9.0)
```

Index `7` is invalid because valid indices are `0..3`, so the function returns `-1`.

Step 3: Third call:

```text
safebox_store(-1, 1.0)
```

Negative index is invalid, so the function returns `-1`.

Step 4: `data[2]` remains `3.5`.

Exact output:

```text
r1=0 r2=-1 r3=-1 data2=3.5
```

Security note: the validation is inside the safebox compartment, not left to the untrusted caller.

---

### Question 19: Copying versus shared memory

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char shared[8] = "token";
    char private_copy[8];

    memcpy(private_copy, shared, sizeof(private_copy));
    shared[0] = 'X';

    printf("copy=%s shared=%s\n", private_copy, shared);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Initially:

```text
shared = "token"
```

Step 2: `memcpy` copies all 8 bytes from `shared` into `private_copy`, including the null terminator and remaining zero bytes.

Step 3: The program then mutates only `shared[0]`, changing `shared` to:

```text
"Xoken"
```

Step 4: `private_copy` remains the old private copy:

```text
"token"
```

Exact output:

```text
copy=token shared=Xoken
```

Security note: copying before validation prevents the sender from changing the receiver's private bytes after validation. Shared memory does not provide that property by itself.

---

### Question 20: Cross-compartment CFI with an operation code

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

enum Operation {
    OP_ADD1 = 0,
    OP_MUL2 = 1,
    OP_SECRET = 2,
    OP_PUBLIC_COUNT = 2
};

static int add1(int x) {
    return x + 1;
}

static int mul2(int x) {
    return x * 2;
}

static int secret(int x) {
    return x + 1000;
}

static int gate(enum Operation op, int arg) {
    int (*public_api[OP_PUBLIC_COUNT])(int) = {add1, mul2};

    if (op < 0 || op >= OP_PUBLIC_COUNT) {
        return -1;
    }

    return public_api[op](arg);
}

int main(void) {
    printf("%d %d %d\n",
           gate(OP_ADD1, 3),
           gate(OP_MUL2, 3),
           gate(OP_SECRET, 3));

    (void)secret;
    return 0;
}
```

**Answer & Explanation:**

Step 1: `gate(OP_ADD1, 3)` selects `add1`, returning `4`.

Step 2: `gate(OP_MUL2, 3)` selects `mul2`, returning `6`.

Step 3: `OP_SECRET` has value 2. `OP_PUBLIC_COUNT` is also 2, so the check rejects it:

```c
op >= OP_PUBLIC_COUNT
```

The return value is `-1`.

Exact output:

```text
4 6 -1
```

Security note: this models cross-compartment CFI. The caller supplies an operation code, not an arbitrary function address.

---

### Question 21: Compartment access matrix

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

#define PERM_READ  0x1u
#define PERM_WRITE 0x2u
#define PERM_EXEC  0x4u

enum Compartment {
    COMP_PARSER = 0,
    COMP_CRYPTO = 1,
    COMP_MONITOR = 2
};

enum Resource {
    RES_REQUEST = 0,
    RES_KEY = 1,
    RES_LOG = 2,
    RES_NETWORK = 3
};

static unsigned matrix[3][4] = {
    {PERM_READ, 0, PERM_WRITE, 0},
    {0, PERM_READ, 0, 0},
    {PERM_READ | PERM_WRITE, PERM_READ | PERM_WRITE,
     PERM_READ | PERM_WRITE, PERM_READ | PERM_WRITE}
};

static int can(enum Compartment c, enum Resource r, unsigned perm) {
    return (matrix[c][r] & perm) != 0;
}

int main(void) {
    printf("%d %d %d\n",
           can(COMP_PARSER, RES_KEY, PERM_READ),
           can(COMP_CRYPTO, RES_KEY, PERM_READ),
           can(COMP_MONITOR, RES_NETWORK, PERM_WRITE));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Parser on key. `matrix[COMP_PARSER][RES_KEY]` is `0`, so parser cannot read the key.

Step 2: Crypto on key. `matrix[COMP_CRYPTO][RES_KEY]` is `PERM_READ`, so crypto can read the key.

Step 3: Monitor on network. The monitor has read/write permissions on all listed resources, so it can write the network resource.

Exact output:

```text
0 1 1
```

Conceptual link: this is an in-application access-control matrix.

---

### Question 22: MPK-style permission bits

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

#define CAN_READ  0x1u
#define CAN_WRITE 0x2u

static void print_domain(unsigned perm) {
    putchar((perm & CAN_READ) ? 'r' : '-');
    putchar((perm & CAN_WRITE) ? 'w' : '-');
}

int main(void) {
    unsigned domains[4] = {
        CAN_READ | CAN_WRITE,
        CAN_READ,
        0,
        CAN_WRITE
    };

    printf("d0=");
    print_domain(domains[0]);
    printf(" d1=");
    print_domain(domains[1]);
    printf(" d2=");
    print_domain(domains[2]);
    printf(" d3=");
    print_domain(domains[3]);
    putchar('\n');

    return 0;
}
```

**Answer & Explanation:**

Step 1: Domain 0 has read and write, so it prints `rw`.

Step 2: Domain 1 has read only, so it prints `r-`.

Step 3: Domain 2 has neither permission, so it prints `--`.

Step 4: Domain 3 has write only, so it prints `-w`.

Exact output:

```text
d0=rw d1=r- d2=-- d3=-w
```

Mechanism note: this models read/write permission control. Chapter 5 emphasises that MPK does not prevent execution.

---

### Question 23: Static versus dynamic policy derivation

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

int main(void) {
    int static_edges = 12;
    int dynamic_edges = 7;
    int overshared = static_edges - dynamic_edges;
    int unseen_runtime_edges = 3;

    printf("overshared=%d runtime_fault_risk=%d\n",
           overshared,
           unseen_runtime_edges);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Static analysis sees 12 possible data/control-flow edges.

Step 2: Dynamic analysis observed 7 edges during profiling.

Step 3: The difference is:

```text
12 - 7 = 5
```

Step 4: The program sets `unseen_runtime_edges` to 3.

Exact output:

```text
overshared=5 runtime_fault_risk=3
```

Conceptual link: static analysis tends to over-approximate, causing oversharing; dynamic analysis tends to under-approximate, risking runtime faults on unseen paths.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 24: Interface check on the wrong side

**Q:** Identify the compartment interface vulnerability in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>

#define DATA_SIZE 4

static double data[DATA_SIZE];

static int lib_function(int index, double object) {
    data[index] = object;
    return 0;
}

int main(void) {
    int index = -1;
    double object = 7.0;

    if (index < DATA_SIZE) {
        lib_function(index, object);
    }

    printf("done\n");
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the original check.

```c
if (index < DATA_SIZE)
```

This does not reject negative indices.

Step 2: Identify the compartmentalisation problem. If `lib_function` is moved into a safebox compartment that distrusts `main`, any validation in `main` is on the untrusted side of the boundary.

Step 3: Identify the vulnerability. `lib_function` writes to `data[index]` without validating `index`. A corrupted caller can supply a negative or oversized index, causing an out-of-bounds write.

Step 4: Secure refactor. Validate inside the trusted callee.

```c
#include <stdio.h>

#define DATA_SIZE 4

static double data[DATA_SIZE];

static int lib_function(int index, double object) {
    if (index < 0 || index >= DATA_SIZE) {
        return -1;
    }

    data[index] = object;
    return 0;
}

int main(void) {
    int index = -1;
    double object = 7.0;
    int result;

    result = lib_function(index, object);
    printf("result=%d\n", result);
    return 0;
}
```

Step 5: Exact output of the secure version.

```text
result=-1
```

---

### Question 25: Raw pointer passed across a compartment boundary

**Q:** Identify the CIV in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>

struct Request {
    int *target;
    int value;
};

static int secret = 1234;
static int trusted_state = 0;

static void trusted_compartment(struct Request req) {
    *req.target = req.value;
}

int main(void) {
    struct Request req;

    req.target = &secret;
    req.value = 0;

    trusted_compartment(req);
    printf("secret=%d trusted=%d\n", secret, trusted_state);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the boundary problem. `req.target` is a raw pointer supplied by the caller. If the caller is untrusted, this gives it control over where the trusted compartment writes.

Step 2: Classify. This is a data-corruption CIV: dereference of a corrupted pointer.

Step 3: Security impact. A compromised caller can direct writes to sensitive objects, such as `secret`, control data, or other trusted-compartment state.

Step 4: Secure refactor. Do not accept raw pointers. Accept an operation or field identifier and map it to allowed trusted objects inside the trusted compartment.

```c
#include <stdio.h>

enum Field {
    FIELD_TRUSTED_STATE = 0
};

struct Request {
    enum Field field;
    int value;
};

static int secret = 1234;
static int trusted_state = 0;

static int trusted_compartment(struct Request req) {
    switch (req.field) {
    case FIELD_TRUSTED_STATE:
        trusted_state = req.value;
        return 0;
    }

    return -1;
}

int main(void) {
    struct Request req;
    int result;

    req.field = FIELD_TRUSTED_STATE;
    req.value = 7;

    result = trusted_compartment(req);
    printf("result=%d secret=%d trusted=%d\n", result, secret, trusted_state);
    return 0;
}
```

Step 5: Exact output of the secure version.

```text
result=0 secret=1234 trusted=7
```

---

### Question 26: Shared-memory TOCTOU

**Q:** Identify the temporal CIV in the following complete C program. Then provide a secure, complete version.

```c
#include <stdint.h>
#include <stdio.h>
#include <string.h>

struct SharedMessage {
    uint32_t len;
    char payload[32];
};

static void simulate_attacker(struct SharedMessage *msg) {
    msg->len = 24;
}

static int receiver(struct SharedMessage *shared) {
    char local[16];

    if (shared->len >= sizeof(local)) {
        return -1;
    }

    simulate_attacker(shared);
    memcpy(local, shared->payload, shared->len);
    local[shared->len] = '\0';
    printf("%s\n", local);
    return 0;
}

int main(void) {
    struct SharedMessage msg = {5, "HELLO"};

    return receiver(&msg) == 0 ? 0 : 1;
}
```

**Answer & Explanation:**

Step 1: Identify the check.

```c
if (shared->len >= sizeof(local))
```

The receiver checks `len` while it is in shared memory.

Step 2: Identify the TOCTOU. After the check, `simulate_attacker` changes `shared->len` before the `memcpy`. In real shared memory, another compartment could do this concurrently.

Step 3: Security impact. The receiver validates a small length but uses a larger one, overflowing `local`.

Step 4: Secure refactor. Copy the shared message into private memory once, then validate and use only the copy.

```c
#include <stdint.h>
#include <stdio.h>
#include <string.h>

struct SharedMessage {
    uint32_t len;
    char payload[32];
};

static int receiver(const struct SharedMessage *shared) {
    struct SharedMessage snapshot;
    char local[16];

    memcpy(&snapshot, shared, sizeof(snapshot));

    if (snapshot.len >= sizeof(local) ||
        snapshot.len > sizeof(snapshot.payload)) {
        return -1;
    }

    memcpy(local, snapshot.payload, snapshot.len);
    local[snapshot.len] = '\0';
    printf("%s\n", local);
    return 0;
}

int main(void) {
    struct SharedMessage msg = {5, "HELLO"};

    return receiver(&msg) == 0 ? 0 : 1;
}
```

Step 5: Exact output of the secure version.

```text
HELLO
```

---

### Question 27: Arbitrary cross-compartment control flow

**Q:** Identify the control-flow bug in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>

struct GateCall {
    int (*entry)(int);
    int arg;
};

static int public_double(int x) {
    return x * 2;
}

static int secret_admin(int x) {
    return x + 1000;
}

static int gate(struct GateCall call) {
    return call.entry(call.arg);
}

int main(void) {
    struct GateCall call = {secret_admin, 5};

    printf("%d\n", gate(call));
    (void)public_double;
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. The caller supplies a function pointer, and the gate calls it directly.

Step 2: Classify. This violates cross-compartment control-flow integrity. An untrusted caller can jump to an arbitrary function inside the callee's compartment.

Step 3: Security impact. The caller can invoke non-API functions such as `secret_admin`.

Step 4: Secure refactor. Accept an operation code and dispatch only through a whitelist of public entry points.

```c
#include <stdio.h>

enum GateOp {
    GATE_PUBLIC_DOUBLE = 0
};

static int public_double(int x) {
    return x * 2;
}

static int secret_admin(int x) {
    return x + 1000;
}

static int gate(enum GateOp op, int arg) {
    switch (op) {
    case GATE_PUBLIC_DOUBLE:
        return public_double(arg);
    }

    return -1;
}

int main(void) {
    printf("%d\n", gate(GATE_PUBLIC_DOUBLE, 5));
    (void)secret_admin;
    return 0;
}
```

Step 5: Exact output of the secure version.

```text
10
```

---

### Question 28: Cross-compartment data leakage through raw struct copy

**Q:** Identify the data-leakage CIV in the following complete C program. Then provide a secure, complete version.

```c
#include <stdint.h>
#include <stdio.h>
#include <string.h>

struct InternalReply {
    uint8_t status;
    uint64_t secret_token;
    char message[8];
};

int main(void) {
    struct InternalReply reply;
    char wire[sizeof(reply)];

    reply.status = 1;
    reply.secret_token = 0xdeadbeefcafebabeull;
    strcpy(reply.message, "OK");

    memcpy(wire, &reply, sizeof(reply));
    printf("sent=%zu\n", sizeof(wire));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the trust-boundary problem. `InternalReply` contains both public response data and a confidential `secret_token`.

Step 2: Identify the bug. The program copies the entire internal struct into the wire buffer. That sends confidential data and possibly padding bytes across the compartment boundary.

Step 3: Classify. This is a data-leakage CIV: exposure of confidential data due to oversharing.

Step 4: Secure refactor. Define an explicit public wire format containing only fields intended to cross.

```c
#include <stdint.h>
#include <stdio.h>
#include <string.h>

struct InternalReply {
    uint8_t status;
    uint64_t secret_token;
    char message[8];
};

struct WireReply {
    uint8_t status;
    char message[8];
};

int main(void) {
    struct InternalReply reply;
    struct WireReply wire;

    memset(&reply, 0, sizeof(reply));
    memset(&wire, 0, sizeof(wire));

    reply.status = 1;
    reply.secret_token = 0xdeadbeefcafebabeull;
    strcpy(reply.message, "OK");

    wire.status = reply.status;
    snprintf(wire.message, sizeof(wire.message), "%s", reply.message);

    printf("sent=%zu status=%u message=%s\n",
           sizeof(wire),
           (unsigned)wire.status,
           wire.message);

    return 0;
}
```

Step 5: Why this fixes it. The wire format excludes `secret_token`, zero-initialises padding, and serialises only intended data.

---

### Question 29: Unbounded compartment creation

**Q:** Identify the availability problem in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>
#include <stdlib.h>

struct Compartment {
    int id;
};

int main(int argc, char **argv) {
    int count;
    struct Compartment *items;

    if (argc != 2) {
        return 1;
    }

    count = atoi(argv[1]);
    items = malloc((size_t)count * sizeof(*items));
    if (items == NULL) {
        return 1;
    }

    printf("created=%d\n", count);
    free(items);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the trust boundary. `argv[1]` is untrusted input.

Step 2: Identify the bugs.

- `atoi` provides no robust error reporting.
- Negative values can become huge when cast to `size_t`.
- Very large values can exhaust memory.
- The multiplication may overflow.

Step 3: Classify. This is an availability problem: untrusted input controls resource consumption.

Step 4: Secure refactor with parsing, bounds, and overflow checks.

```c
#include <errno.h>
#include <limits.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#define MAX_COMPARTMENTS 64

struct Compartment {
    int id;
};

int main(int argc, char **argv) {
    char *end = NULL;
    long requested;
    size_t count;
    struct Compartment *items;

    if (argc != 2) {
        fprintf(stderr, "usage: %s <count>\n", argv[0]);
        return 1;
    }

    errno = 0;
    requested = strtol(argv[1], &end, 10);
    if (errno != 0 || end == argv[1] || *end != '\0' ||
        requested < 0 || requested > MAX_COMPARTMENTS) {
        fprintf(stderr, "invalid count\n");
        return 1;
    }

    count = (size_t)requested;
    if (count > SIZE_MAX / sizeof(*items)) {
        fprintf(stderr, "size overflow\n");
        return 1;
    }

    items = calloc(count, sizeof(*items));
    if (items == NULL && count != 0) {
        perror("calloc");
        return 1;
    }

    printf("created=%zu\n", count);
    free(items);
    return 0;
}
```

Step 5: Why this fixes it. The secure version rejects invalid input, caps resource consumption, checks integer overflow, and uses zero-initialised allocation.

---

### Question 30: API ordering CIV

**Q:** Identify the temporal interface bug in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>

struct CryptoBox {
    int initialized;
    int key;
};

static int encrypt(struct CryptoBox *box, int message) {
    return message ^ box->key;
}

int main(void) {
    struct CryptoBox box;

    printf("%d\n", encrypt(&box, 42));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the intended API order. The object should be initialised before use.

Step 2: Identify the bug. `encrypt` does not check whether `box` is initialised. The caller can invoke `encrypt` before setup, causing an uninitialised read of `box->key`.

Step 3: Classify. This is a temporal CIV: breaking API usage ordering.

Step 4: Secure refactor. Provide an initialisation function and enforce state checks in the trusted API.

```c
#include <stdio.h>

struct CryptoBox {
    int initialized;
    int key;
};

static void cryptobox_init(struct CryptoBox *box, int key) {
    box->initialized = 1;
    box->key = key;
}

static int encrypt(struct CryptoBox *box, int message, int *out) {
    if (box == NULL || out == NULL || !box->initialized) {
        return -1;
    }

    *out = message ^ box->key;
    return 0;
}

int main(void) {
    struct CryptoBox box = {0, 0};
    int ciphertext = 0;
    int result;

    cryptobox_init(&box, 7);
    result = encrypt(&box, 42, &ciphertext);

    printf("result=%d ciphertext=%d\n", result, ciphertext);
    return 0;
}
```

Step 5: Exact output of the secure version.

```text
result=0 ciphertext=45
```

Step 6: Why this fixes it. The callee validates object state before use. The caller cannot rely on an old monolithic assumption that API order is always respected.

---

## Final Exam Checklist

- Compartmentalisation decomposes software into lesser-privileged compartments.
- It assumes exploitation may happen and limits blast radius.
- Least privilege applies inside applications: memory, files, syscalls, and resources.
- Trust models: sandbox, safebox, mutual distrust.
- The direction of distrust determines where validation belongs.
- Security properties: confidentiality, integrity, availability; availability is usually out of scope.
- Pipeline: policy, abstractions, mechanism, plus a privileged monitor.
- Manual compartmentalisation requires IPC, marshalling, synchronisation, and teardown.
- Frameworks may provide annotations and gate calls, but interfaces still need security review.
- CIVs arise from missing/improper control-flow and data-flow validation at boundaries.
- CIV classes: leakage, corruption, temporal violations.
- Shared-memory TOCTOU is the compartment version of syscall double fetch.
- ConfFuzz: 36 APIs, 629 bugs, 75% with write bugs, no API-size correlation.
- Fixing CIVs often requires API redesign, not only extra checks.
- Policy choices: code-centric, data-centric, hybrid.
- Granularity: coarse is cheaper but weaker; fine is stronger but more complex and slower.
- Automation trades engineering effort against precision and often causes oversharing.
- Static analysis over-approximates; dynamic analysis under-approximates.
- Abstractions: `CREATE`, `DESTROY`, `ASSIGN`, `CALL`, `RETURN`.
- `CALL`/`RETURN` needs cross-compartment CFI plus stack/register sanitisation.
- Explicit abstractions expose boundaries; implicit abstractions reduce effort but hide validation needs.
- Integrity is prerequisite for confidentiality and availability.
- Availability requires asynchronous compartments, resource bounds, externalised state, and restart logic.
- Other system interfaces such as `mmap` and `/dev/mem` can bypass newer isolation mechanisms.
- Mechanisms must provide isolated domains and controlled communication.
- Message passing is slower but safer; shared memory is faster but TOCTTOU-prone.
- Hardware mechanisms are fast and compatible but hardware-dependent.
- Software mechanisms are portable but slower or language-specific.
- MPK specifics: 16 domains, page granularity, read/write control, no execute prevention.
- Mechanism choice is a trade-off between security, performance, and engineering effort.
