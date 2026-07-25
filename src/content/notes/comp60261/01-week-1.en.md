---
subject: COMP60261
chapter: 1
title: "Week 1"
language: en
---

# COMP60261 — Week 1: Core Concepts and the C Language

**Scope:** unit logistics, systems security core concepts, and a working introduction to C (basics, pointers, dynamic allocation, the standard library).

**Covers lectures:** 00 Logistics · 01 Core Concepts · 02 C: Introduction · 03 C: Pointers · 04 C: Dynamic Memory Allocation · 05 C: The Standard Library

---

## 1. Framing: what "systems security" means here

**Computer security** is the broad discipline of keeping computing systems behaving as intended in the presence of an adversary. **Systems security** is the subset concerned with the layers beneath the application: the language runtime, the operating system, the hypervisor, and the hardware interfaces they sit on.

This matters because these layers are *shared* and *privileged*. A bug in a web form affects that form. A bug in the kernel affects every process on the machine. The lower you go, the wider the blast radius — which is why this unit spends its time there.

### 1.1 Attack surface

The **attack surface** is the total set of points where an adversary can interact with your system. Every input channel counts: command-line arguments, environment variables, files, network sockets, IPC, system calls, even the timing of your responses.

Two consequences worth internalising:

- **Attack surface is a design property, not an implementation detail.** You reduce it by removing entry points, not by validating harder at each one.
- **Unused features still count.** A parser you never call is still reachable if an attacker can reach it.

### 1.2 Vulnerabilities, exploits, and the gap between them

A **vulnerability** is a flaw that *could* let an attacker violate a security property. An **exploit** is a concrete artefact that actually does it. Not every vulnerability is exploitable — mitigations, memory layout, and luck all intervene — but treating "not obviously exploitable" as "safe" is how incidents happen.

### 1.3 The CIA triad

The classical decomposition of security properties:

| Property | Question it answers | Violated by |
|---|---|---|
| **Confidentiality** | Who may *read* this? | Information leak, side channel |
| **Integrity** | Who may *modify* this? | Tampering, unauthorised write |
| **Availability** | Can legitimate users use it? | Denial of service, resource exhaustion |

**Identity** (authentication) underpins all three: you cannot enforce "who may" without knowing who is asking. Add **authenticity** and **non-repudiation** when the question is whether a message genuinely came from a claimed party.

Use the triad as a checklist when analysing any mechanism: which of the three does it protect, and which does it silently ignore? Many mechanisms buy confidentiality and integrity while leaving availability wide open.

### 1.4 Trust models and the TCB

The **Trusted Computing Base (TCB)** is the set of components that *must* be correct for your security properties to hold. It is not the set of components you happen to trust — it is the set whose failure is fatal.

Key discipline: **state your TCB explicitly.** For a normal Linux process, the TCB includes the CPU, firmware, hypervisor (if any), kernel, libc, and the program itself. That is an enormous amount of code to be betting on.

Two design moves follow, and both recur throughout this unit:

- **Shrink the TCB** — less trusted code means fewer places a fatal bug can hide (microkernels, unikernels, TEEs).
- **Remove components from the TCB** — if you encrypt data so the OS cannot read it, the OS is no longer trusted for confidentiality, even though it still runs your code.

### 1.5 Threat models

A **threat model** states what you are defending against. Without one, "is this secure?" has no answer. A usable threat model specifies:

- **Assets** — what is worth protecting.
- **Adversary capabilities** — can they run code on the machine? Send network packets? Measure timing? Physically open the box?
- **Adversary goals** — read a secret, escalate privilege, crash the service.
- **Out of scope** — what you explicitly are *not* defending against.

That last item is the one people skip, and it is the most useful. A design is only "insecure" relative to a threat model; being clear about the boundary is what makes the claim meaningful.

---

## 2. Why C

The unit uses C because the systems layer is written in C, and because C's failure modes *are* the subject matter. C gives you direct control over memory with essentially no safety net — which is exactly why memory-corruption vulnerabilities are a systems-security topic rather than a historical curiosity.

### 2.1 Basics worth being precise about

- **Types and sizes.** `int`, `char`, `long` and friends have implementation-defined widths. Assuming `int` is 32 bits or that pointers are 8 bytes is a portability bug and sometimes a security bug. Use `stdint.h` (`uint32_t`, `size_t`, `intptr_t`) when width matters.
- **Signedness.** Mixing signed and unsigned in comparisons and arithmetic triggers implicit conversions that routinely produce attacker-useful surprises. A negative length converted to `size_t` becomes enormous.
- **Undefined behaviour (UB).** Out-of-bounds access, overflowing signed arithmetic, use-after-free, and reading uninitialised memory are *undefined*, not merely "unpredictable". The compiler is entitled to assume UB never happens and optimise accordingly — which is how "harmless" bugs turn into removed security checks.
- **Arrays do not carry their length.** Nothing in the type system records how big an array is. Every bounds check is one you wrote by hand.

### 2.2 Pointers and the virtual address space

A **pointer** is a variable holding a memory address. Each process sees its own **virtual address space** — a flat range of addresses, mapped by the hardware and kernel onto physical memory. Two processes can hold the identical numeric address and refer to entirely different memory.

Core operations: `&x` takes the address of `x`; `*p` dereferences `p` to reach the pointed-to object.

Why pointers dominate C code:

- **C passes arguments by value.** To let a function modify a caller's variable, you pass its address. "Pass by reference" in C is just passing a pointer by value.
- **Arrays decay to pointers.** An array expression becomes a pointer to its first element, which is why array parameters lose their size and why bounds are the programmer's problem.
- **Data structures are built from pointers.** Linked lists, trees, and graphs are pointer chains; traversing them means dereferencing repeatedly, and each hop is a chance to dereference something invalid.
- **Function pointers** hold code addresses, enabling callbacks and dispatch tables. They are also a prime attacker target: overwrite one and you redirect control flow.

Pointer arithmetic is scaled by the pointed-to type — `p + 1` advances by `sizeof(*p)` bytes, not one byte. Getting this wrong is a classic source of off-by-N overflows.

### 2.3 Dynamic memory allocation

Static and automatic (stack) allocation require sizes known at compile time and lifetimes bound to scope. When you need a lifetime or size determined at runtime, you allocate on the **heap**:

- `malloc(n)` returns a pointer to `n` uninitialised bytes, or `NULL` on failure. **Always check for `NULL`.**
- `calloc(count, size)` zeroes the memory and checks the multiplication for overflow — preferable when allocating an array.
- `realloc(p, n)` resizes; note it may move the block, and on failure returns `NULL` while leaving the original allocated (so `p = realloc(p, n)` leaks on failure).
- `free(p)` releases the block. After this, `p` is a **dangling pointer** — the value is still there but using it is undefined.

The four canonical heap errors, all of which recur in Week 2:

| Error | What it is |
|---|---|
| **Memory leak** | Allocation never freed; availability problem, not usually exploitable |
| **Use-after-free** | Dereferencing a pointer after `free`; the block may already be reallocated to other data |
| **Double free** | Freeing twice; corrupts allocator metadata |
| **Heap overflow** | Writing past the end of a block; corrupts adjacent data or allocator metadata |

Defensive habit: set pointers to `NULL` after freeing, and keep allocation and deallocation in the same structural place (same function, or paired init/cleanup routines) so ownership is obvious.

### 2.4 The C standard library, and why it is dangerous

Libc provides string and memory manipulation, I/O, and process facilities. Several of its historical string functions are unsafe by construction because they take no destination size:

- `strcpy`, `strcat`, `sprintf` — write until they hit a terminating NUL in the *source*. If the source is longer than the destination, they overflow. No diagnostic.
- `gets` — reads a line from stdin with no bound whatsoever. Removed from the language in C11; never acceptable.
- `scanf("%s", buf)` — unbounded unless you supply a field width.

Bounded alternatives (`strncpy`, `strncat`, `snprintf`, `fgets`) are safer but have their own traps: `strncpy` does not NUL-terminate if the source fills the buffer, and `strncat`'s size argument means "additional characters", not "total buffer size". `snprintf` is the most predictable of the family — it always terminates and tells you the length it wanted.

Two structural points to carry forward:

- **A NUL-terminated string conflates data with its length.** The length is discovered by scanning for a sentinel that an attacker may control or remove. Much of C's string insecurity traces back to this single representation choice.
- **Read the manual pages.** `man 3 strncpy` documents the termination behaviour that surprises people. On these topics the manual is authoritative and short.

---

## 3. Week 1 takeaways

1. Security claims are meaningless without a **threat model** and an explicit **TCB**; get in the habit of stating both.
2. **Attack surface** is reduced by design, not by validation.
3. The **CIA triad** is a checklist — always ask which property a mechanism does *not* protect.
4. C's power and its insecurity are the same feature: **direct memory access with no bounds checking and no length metadata.**
5. **Undefined behaviour is not "unpredictable behaviour"** — the optimiser actively exploits it, sometimes by deleting your checks.
6. Prefer `calloc` for arrays, `snprintf` for formatting, `fgets` for input; treat `strcpy`, `strcat`, `sprintf`, and `gets` as defects.
