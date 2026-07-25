---
subject: COMP60261
chapter: 2
title: "Week 2"
language: en
---

# COMP60261 — Week 2: Memory Safety

**Scope:** how a program is laid out in memory, what memory safety means, how memory-unsafety is exploited, and the coding practices, analysis tools, and runtime defences used against it.

**Covers lectures:** 06 Anatomy of a Program in Memory · 07 Memory Safety · 08 Exploiting Vulnerabilities 1 · 09 Exploiting Vulnerabilities 2 · 10 Secure Coding Practices, Detecting Bugs · 11 Runtime Defences

---

## 1. Anatomy of a program in memory

Every process runs in its own **virtual address space**, and understanding its regions is a prerequisite for understanding every attack in this week.

Typical regions, from low addresses upward:

| Region | Contents | Lifetime | Typical permissions |
|---|---|---|---|
| **Text** | Machine code | Process lifetime | read + execute |
| **Data (`.data`)** | Initialised globals/statics | Process lifetime | read + write |
| **BSS (`.bss`)** | Zero-initialised globals/statics | Process lifetime | read + write |
| **Heap** | `malloc`'d objects | Explicit, until `free` | read + write |
| **Memory mappings** | Shared libraries, `mmap` regions | Varies | varies |
| **Stack** | Frames: locals, saved registers, return addresses | Per function call | read + write |

The heap grows upward, the stack grows downward, and mappings sit between them.

### 1.1 Life cycle

The address space is constructed at `execve` time: the kernel builds a fresh space, maps the executable's segments, maps the dynamic loader and shared libraries, sets up the initial stack (containing arguments and environment), and transfers control. It evolves during execution as the heap grows, libraries are loaded, and stack frames are pushed and popped, and is torn down at exit.

### 1.2 The stack frame — the structure that matters most

On a function call, a **frame** is pushed containing (roughly, on x86-64): the arguments not passed in registers, the **return address**, the saved frame pointer, and the callee's local variables including any arrays.

The critical adjacency: **local buffers and the return address live in the same frame, with the return address at a higher address than the locals.** A buffer that overflows upward therefore runs directly into saved registers and the return address. This single layout fact is the basis of stack smashing.

---

## 2. What memory safety is

A program is **memory safe** if every memory access is to a valid object, within its bounds, during its lifetime, and consistent with its type. Violations fall into two families:

- **Spatial safety** — accessing outside an object's bounds (buffer overflow/underflow, out-of-bounds read).
- **Temporal safety** — accessing outside an object's lifetime (use-after-free, double free, dangling stack pointer returned from a function).

### 2.1 Safe vs. unsafe languages

**Memory-safe languages** (Python, Java, Go, Rust, and most others) prevent these violations by construction — typically via bounds-checked indexing, no manual free, and garbage collection or ownership tracking. An out-of-bounds index in Python raises an exception; the program stops rather than silently corrupting adjacent state.

**C and C++ are unsafe by design.** This was a deliberate performance trade: no bounds check means no per-access cost. The cost of a bounds check is small but nonzero, and in the 1970s — and in hot loops today — that mattered. Benchmarking indexed summation in C against the equivalent in a checked language demonstrates the gap, and also demonstrates that the gap is often smaller than assumed.

The trade-off framing is worth holding onto: memory unsafety is not an accident of bad programmers but a *design decision* whose bill is now paid in vulnerabilities. This is why "rewrite it in a safe language" is a serious security proposal, and also why it is often infeasible for the existing systems corpus.

### 2.2 The common issue classes

Buffer overflow (stack and heap), out-of-bounds read, use-after-free, double free, uninitialised memory read, integer overflow leading to an undersized allocation, and format-string bugs.

---

## 3. Exploiting memory unsafety

The progression here runs from *reading* what you shouldn't, to *writing* what you shouldn't, to *executing* what you shouldn't.

### 3.1 Information leak (infoleak)

An out-of-bounds *read* returns adjacent memory to the attacker. If a length field is attacker-controlled and unvalidated, a request for more bytes than were stored returns whatever follows in memory — potentially keys, tokens, or pointers.

**Heartbleed** is the canonical case: a protocol heartbeat message carried a payload plus a length, and the implementation echoed back `length` bytes without checking that the payload was actually that long. An attacker sent a small payload with a large declared length and received up to ~64 KB of adjacent process memory per request, repeatable at will. It leaked private keys from production servers.

Beyond the direct damage, infoleaks are strategically important because they defeat **ASLR** (§5.2): leak one pointer and you learn where a region is mapped.

### 3.2 Sensitive data tampering

An out-of-bounds *write* modifies adjacent memory. If a security-relevant variable — an `is_admin` flag, a UID, a length, a function pointer — sits next to an overflowable buffer, the attacker overwrites it. No code injection required; the program's own logic then does the wrong thing while behaving "correctly".

### 3.3 Stack smashing

The classic full-control attack. Overflow a stack buffer far enough to overwrite the **return address**. When the function returns, execution jumps wherever the attacker chose.

Two variants:

- **Code injection** — place shellcode in the buffer and point the return address at it. Defeated by non-executable memory (§5.1).
- **Code reuse** — point the return address at code already present in the process. **Return-oriented programming (ROP)** chains short instruction sequences ("gadgets") each ending in `ret`, stitching together arbitrary computation from existing bytes. This is the standard response to non-executable memory.

### 3.4 Trust boundaries in programs

The unifying concept. A **trust boundary** is any point where data crosses from a less-trusted domain into a more-trusted one. Every input crossing such a boundary must be validated *at* the boundary.

Inputs that are routinely and wrongly assumed trustworthy:

- **Command-line arguments** — fully attacker-controlled when the program is setuid or invoked by other software. Both `argv` contents *and* `argc` need checking; indexing `argv[1]` without confirming `argc > 1` is a null-pointer dereference at best.
- **Environment variables** — inherited, arbitrary in name, content, and size. Historically a rich source of privilege-escalation bugs in setuid binaries.
- **Files, network data, IPC messages, and anything from another process** — including data from a *less* privileged process.

The discipline: identify your boundaries explicitly, then validate length, range, encoding, and structure on the trusted side. Validation performed by the caller does not count if the callee is separately reachable.

---

## 4. Secure coding practices and bug detection

### 4.1 Practices

- Check every `malloc`/`calloc`/`realloc` return against `NULL`.
- Validate all lengths and indices against actual buffer sizes; compute sizes with `sizeof` rather than literals.
- Watch integer overflow in size arithmetic — `n * sizeof(T)` can wrap and yield a small allocation for a large `n`. Prefer `calloc`, which checks.
- Prefer bounded, predictable functions: `snprintf` over `sprintf`, `fgets` over `gets`, `memcpy` with an explicitly computed size.
- Never mix signed and unsigned in bounds comparisons.
- `NULL` pointers after freeing; keep allocation and release paired and local.
- Enable compiler warnings aggressively (`-Wall -Wextra`) and treat them as errors.

### 4.2 Detecting mistakes

**Static analysis** examines code without running it — compiler warnings, linters, and dedicated analysers. It can reason about all paths, so it finds bugs testing never reaches, but it cannot know runtime values, so it produces **false positives** and misses value-dependent bugs. Practical use requires triaging that noise.

**Dynamic analysis** observes actual execution:

- **Sanitizers** — AddressSanitizer instruments memory accesses to catch overflows and use-after-free at the moment they happen; MemorySanitizer catches uninitialised reads; UBSan catches undefined behaviour. Low false-positive rate, real slowdown, and only covers code paths you actually execute.
- **Fuzzing** — feed large volumes of generated/mutated input and watch for crashes. Coverage-guided fuzzers mutate toward unexplored branches. Extremely effective on parsers and any code consuming untrusted structured input.
- **Test suites** — e.g. the Linux Test Project for kernel interfaces.

The two families are complementary: static analysis for breadth over all paths, dynamic analysis for precision on executed paths. Neither is sufficient alone, and neither proves absence of bugs.

---

## 5. Runtime defences

These do not fix vulnerabilities; they make exploitation harder or turn a compromise into a crash. Each targets a specific step in the attack chain.

### 5.1 Non-executable memory (NX / DEP / W^X)

Mark writable pages non-executable and executable pages non-writable, enforced by the MMU's NX bit. Injected shellcode in a data buffer can no longer be executed.

**Bypass:** code reuse — ROP and return-to-libc use existing executable code, so nothing needs to be injected.

### 5.2 Address Space Layout Randomisation (ASLR)

Randomise the base addresses of stack, heap, libraries, and (with PIE) the executable at each run, so the attacker cannot predict where anything is.

**Limitations:** on 32-bit systems the entropy is small enough to brute-force; a single **infoleak** defeats it wholesale; and non-PIE executables leave the main binary at a fixed address, providing a reliable gadget source.

### 5.3 Stack canaries

Place a random value between the local variables and the return address at function entry, and verify it before returning. A sequential overflow reaching the return address must first overwrite the canary, so the check fails and the process aborts.

**Limitations:** only detects *contiguous* overflows — a targeted write that skips the canary is unaffected; the canary can be leaked; and it protects the return address, not other data in the frame.

### 5.4 Control Flow Integrity (CFI)

Restrict indirect control transfers to targets that the program's control-flow graph actually permits.

- **Forward edge** — indirect calls and jumps (function pointers, virtual calls). Enforced by checking the target against a set of legal destinations for that call site.
- **Backward edge** — returns. Protected by a **shadow stack** holding a separate, protected copy of return addresses, compared on return. Hardware support exists (e.g. Intel CET's shadow stack and indirect branch tracking).

CFI directly attacks ROP, since ROP depends on returning and jumping to places the program never intended.

### 5.5 Other hardening

RELRO (making the GOT read-only after relocation), FORTIFY_SOURCE (compile-time and runtime checks on libc calls), heap hardening (allocator metadata checks, pointer obfuscation), and `-fstack-protector-strong` to broaden canary coverage.

### 5.6 How to think about the set

Defences form a chain, and attacks route around individual links: NX pushed attackers to ROP; ASLR pushed them to infoleaks; canaries pushed them to non-contiguous writes. **Defence in depth is the point** — each layer raises the number of primitives an attacker must chain, and each additional requirement is another thing that must go right for them.

None of it substitutes for not having the bug.

---

## 6. Week 2 takeaways

1. **Stack layout is the attack.** Locals sit below the return address in the same frame; a contiguous overflow reaches it.
2. Memory safety splits into **spatial** (bounds) and **temporal** (lifetime) violations.
3. C/C++ unsafety is a deliberate **performance trade-off**, not an accident — which is what makes safe-language migration a security argument.
4. **Infoleaks are force multipliers**: they defeat ASLR and canaries, so an out-of-bounds *read* is not a minor bug.
5. **Heartbleed** = attacker-controlled length echoed without validating the actual payload size.
6. Validate untrusted input **at the trust boundary** — `argv`, `argc`, environment, files, network, and other processes are all untrusted.
7. **Static** analysis covers all paths with false positives; **dynamic** analysis (sanitizers, fuzzing) is precise but only on executed paths.
8. Know each defence's **specific bypass**: NX → ROP; ASLR → infoleak; canaries → non-contiguous or leaked; ROP → CFI + shadow stack.
