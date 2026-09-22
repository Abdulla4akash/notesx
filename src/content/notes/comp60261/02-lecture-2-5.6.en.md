---
subject: COMP60261
chapter: 2
title: "Lecture 2 - 5.6 Study Notes"
language: en
---

# COMP60261 - Lecture 2: Memory Safety (5.6)

**Sources used:** downloaded COMP60261 slide decks:

- `slides/06-program-memory/index.html`
- `slides/07-memory-safety/index.html`
- `slides/08-exploiting-vulnerabilities-1/index.html`
- `slides/09-exploiting-vulnerabilities-2/index.html`
- `slides/10-secure-coding-practices-detecting-bugs/index.html`
- `slides/11-runtime-defences/index.html`

All paths are relative to `C:\Users\abdul\Downloads\COMP60261-slides`.

**Transcript status:** no lecture transcript was provided. These notes are grounded in the slides and their local source/assets only.

**Topic and scope:** Chapter 2 explains program memory layout and calling conventions, spatial and temporal memory safety, worked exploits, trust-boundary validation, secure coding and bug detection, and low-overhead runtime defences.

---

## 1. Chapter strategy

The six lectures support a three-part security strategy:

1. **Use secure coding practices** to avoid introducing bugs.
2. **Use analysis and testing tools** to find bugs before release.
3. **Deploy runtime defences** to make remaining bugs harder to exploit and reduce their impact.

The third step is necessary because no practical development or testing approach can guarantee that a non-trivial C/C++ program contains no bugs.

The conceptual flow is:

> Memory layout -> memory-safety violation -> exploit -> trust boundary -> detection -> mitigation.

---

## 2. Anatomy of a program in memory

### 2.1 Virtual address space

A process sees memory as a large array of bytes. Each byte has a virtual address, and machine load/store instructions access those addresses.

Important properties:

- each process receives a private virtual address space;
- the address-space size is independent of installed RAM;
- most possible addresses are unmapped;
- mapped regions carry read, write, and execute permissions.

The slides describe a modern 64-bit process as having an address space of roughly **128 TB**. It is sparse: only the program, libraries, stack, heap, and other requested areas are mapped.

### 2.2 Address-space lifecycle

Before execution, a program exists as a binary on disk. Starting it involves:

1. The OS creates a virtual address space.
2. ELF metadata identifies a userspace loader, such as `ld-linux-x86-64.so.2`.
3. The OS maps and starts the loader.
4. The loader maps the program binary.
5. For a dynamically linked program, the loader maps required shared libraries such as libc.
6. Control eventually reaches the program entry point.

The counter-intuitive point is that the loader is itself a program loaded first. The userspace loader, not the kernel alone, performs much of the dynamic-linking setup.

### 2.3 Static and dynamic regions

**Static memory** has contents and sizes determined from the binary:

- `.text`: executable code, normally read/execute;
- `.rodata`: read-only constants;
- `.data`: initialised writable globals;
- `.bss`: zero-initialised writable globals.

**Dynamic memory** changes during execution:

- the **stack** stores function frames and normally grows down;
- the **heap** stores dynamically allocated objects and traditionally grows up;
- additional mappings may hold libraries, files, modules, or JIT-generated code.

Writable private mappings do not write changes back into the original executable file. Different processes can map the same binary/library while retaining private writable state.

### 2.4 Inspecting a process and binary

Useful commands from the lecture:

```bash
cat /proc/<pid>/maps
readelf -lSW <binary>
ldd <binary>
objdump --disassemble <binary>
```

`/proc/<pid>/maps` shows live address ranges, permissions, and backing files. `readelf` shows ELF sections and loadable program headers. `objdump` shows the generated machine code.

### 2.5 Function calling convention

Machine code has jumps, registers, memory, and stack operations rather than a built-in high-level concept of a function. The compiler follows an ABI calling convention.

For normal x86-64 System V function calls:

| Purpose | Location |
|---|---|
| Arguments 1-6 | `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9` |
| Further arguments | Stack |
| Return value | `%rax` |

The `call` instruction pushes the return address and transfers control to the callee. The `ret` instruction pops the saved return address and jumps to it.

This differs from the Linux system-call convention, which uses `%r10` instead of `%rcx` and places the system-call number in `%rax`.

### 2.6 Stack frames and the exploit-relevant layout

Each active function has a frame containing local variables and saved control state. A simplified call sequence is:

1. caller prepares arguments;
2. `call` pushes the next instruction address;
3. callee reserves stack space for locals;
4. callee executes;
5. `ret` reads the stored return address and resumes the caller.

The stack grows toward lower addresses, while an array write advances through increasing addresses within its frame. An unchecked write past a local buffer can therefore reach control data such as the return address.

---

## 3. Memory safety

**Memory safety is protection against bugs involving memory access.** A language or runtime may enforce it at compile time, runtime, or both.

Memory-safety failures can compromise:

- **availability:** crashes or denial of service;
- **confidentiality:** out-of-bounds reads and secret leakage;
- **integrity:** data modification, privilege escalation, or control-flow hijacking.

### 3.1 Rules enforced by memory-safe languages

Memory-safe languages commonly enforce:

- bounds on array and buffer access;
- no access after deallocation;
- no live reference to deallocated memory;
- at most one valid deallocation;
- no null/invalid reference dereference;
- type-correct memory access;
- initialisation before reading.

C and C++ do not generally enforce these rules. A C out-of-bounds access may compile without warning and run without an immediate crash, returning unrelated memory instead.

### 3.2 Unsafety is deliberate

C/C++ omit many checks to provide:

- high performance;
- low and controllable memory use;
- predictable latency without garbage-collector pauses;
- arbitrary low-level memory access needed by operating systems and drivers.

The slides compare summing 100 million integers and report the C version as about **70 times faster** than the equivalent checked Python loop.

This is a trade-off, not an accidental gap in the language specification. Security engineering must account for the authority that unchecked pointers provide.

### 3.3 Common issue classes

| Issue | Description | Typical impact |
|---|---|---|
| Buffer overflow | Access beyond the high end of an object | Corruption, leak, or control hijack |
| Buffer underflow | Access before the start of an object | Corruption or leak |
| Use-after-free | Access through a pointer after deallocation | Stale data, attacker-controlled reuse, crash |
| Double free | Deallocate the same object twice | Allocator corruption |
| Null dereference | Access through address zero | Usually crash; behaviour depends on mapping |
| Uninitialised read | Read bytes never assigned a valid value | Data leak or unpredictable behaviour |

Local variables and memory returned by `malloc` are not automatically zeroed. They may contain stale data from previous use.

### 3.4 Spatial and temporal safety

- **Spatial safety:** access occurs within the bounds of the intended live object, at the right place.
- **Temporal safety:** access occurs only while the object's lifetime is valid, at the right time.

Buffer overflows/underflows are spatial violations. Use-after-free and dangling references are temporal violations. Some bugs, such as uninitialised reads, also concern when an object becomes valid to read.

### 3.5 Why errors survive development

Real systems contain thousands or millions of lines, evolve over years, and are developed by many people. Data ownership and trust are difficult to reason about across interfaces. A change in one module may invalidate a length or lifetime assumption elsewhere.

The worked infoleak demonstrates this: a string was shortened but the loop bound was not updated. The error is obvious in a tiny example and plausible in a large evolving system.

### 3.6 Undefined behaviour

Memory-safety violations are part of the broader category of C **undefined behaviour (UB)**. Once execution reaches UB, the standard imposes no requirements on the result.

Other examples include:

- signed integer overflow or underflow;
- oversized shifts;
- incompatible pointer casting and dereferencing;
- invalid operations involving types or expressions.

Unsigned integer arithmetic wraps modulo its width and is defined, although defined wrapping can still produce security bugs if used for sizes.

A program that appears to work after UB is still incorrect. The compiler may optimise based on the assumption that UB never occurs.

---

## 4. Four worked exploitation patterns

The slides note that Microsoft and Google had reported roughly **70% of their security bugs** as memory-safety-related at the referenced time.

The examples show progressively stronger attacker outcomes: disclosure, data corruption, stack control-flow hijacking, and heap/lifetime control-flow hijacking.

### 4.1 Out-of-bounds read and infoleak

A binary contains a hardcoded password and prints a welcome string character by character. The original string length is embedded as a loop bound. A later version shortens the string without changing the bound.

The loop continues reading beyond the string and prints adjacent global data. If the compiler lays the password nearby, it is disclosed.

**Classification:** spatial violation, read direction, confidentiality impact.

The lesson is that a read overflow can be security-critical even when it never changes memory or redirects control flow.

### 4.2 Out-of-bounds write and data tampering

A program has adjacent global arrays for user input and the expected password. It copies an arbitrary command-line argument into the first array using `strcpy`.

An oversized argument overflows the input array and changes the expected-password array. Authentication logic then compares attacker-controlled values and may accept them.

**Classification:** spatial violation, write direction, integrity impact.

The program's own intended control flow is used. An attacker does not always need injected code or a changed return address.

### 4.3 Stack smashing

A function copies an untrusted string with `strcpy` into a 16-byte local buffer. The buffer sits in a frame below the saved return address.

An overflow can overwrite the saved address. When `ret` executes, it uses the corrupted value and transfers control to a location chosen through the payload, such as a security-sensitive function that normal logic would call only after authentication.

**Classification:** spatial write violation causing backward-edge control-flow hijacking.

The mechanism depends on the calling convention: `call` stores a writable return address on the normal stack, and `ret` trusts it.

### 4.4 Use-after-free

A heap object contains a function pointer. The program frees the object but later invokes the function pointer through the stale reference. Between free and use, another allocation reuses the same region and receives attacker-controlled bytes.

The replacement allocation can overwrite the old function-pointer slot. Invoking the stale object then redirects control flow.

**Classification:** temporal safety violation leading to indirect-call hijacking.

The example shows why allocator reuse matters. Use-after-free is not only a crash: the attacker may shape new allocations so stale references observe controlled data.

Setting a pointer to `NULL` after `free` helps prevent accidental reuse of that particular reference, but correct ownership and lifetime design are still required for aliases.

### 4.5 Return-oriented programming

Non-executable data memory prevents direct execution of injected stack/heap bytes, but attackers may reuse existing code.

**Return-oriented programming (ROP)** chains short instruction sequences called gadgets. Each gadget normally ends in `ret`, so a sequence of addresses placed on the stack drives execution from one existing snippet to another. Stack data can also supply register values.

Modern binaries and shared libraries contain many gadgets, so code reuse can express complex computation without injecting new executable bytes.

This motivates stronger control-flow protections beyond NX.

---

## 5. Trust boundaries

A **trust boundary is an interface between a trusted component and an untrusted component under a stated threat model**. It is an attack vector because attacker-controlled data or control requests cross into code that holds authority.

All data crossing the boundary must be validated before use.

### 5.1 Common boundaries

- command-line arguments;
- standard input;
- environment variables;
- configuration and input files;
- network input;
- IPC from untrusted processes.

Whether a source is trusted depends on the threat model. A configuration file may be partly trusted if filesystem permissions are assumed correct, but its format still needs validation.

### 5.2 Command-line validation

A robust program validates:

- number of arguments;
- individual type, format, length, and range;
- consistency between arguments;
- termination of strings after bounded copies.

For fixed-size buffers:

```c
if (argc != 3) {
    fprintf(stderr, "usage: %s USER PASS\n", argv[0]);
    return EXIT_FAILURE;
}

strncpy(username, argv[1], sizeof(username));
username[sizeof(username) - 1] = '\0';

strncpy(password, argv[2], sizeof(password));
password[sizeof(password) - 1] = '\0';
```

The explicit terminator is necessary because `strncpy` does not guarantee a trailing null byte when the source fills or exceeds the destination.

### 5.3 Environment variables and format strings

This pattern is vulnerable even though output length is bounded:

```c
char *user = getenv("USER_INPUT");
char buffer[100];
snprintf(buffer, sizeof(buffer), user);
```

The untrusted value is interpreted as a format string. Format directives can make the function read unintended values, leaking stack or memory contents including pointers.

The format must be fixed:

```c
snprintf(buffer, sizeof(buffer), "%s", user);
```

A format-string vulnerability is not fundamentally a length bug. It is an attacker-controlled interpretation bug.

Leaked pointers are particularly useful for defeating ASLR.

### 5.4 Heartbleed

Heartbleed, CVE-2014-0160, was an OpenSSL out-of-bounds read allowing a remote client to request more response bytes than the provided heartbeat payload contained.

A simplified pattern is:

```c
unsigned char buf[32] = {0};
recv(client, buf, sizeof(buf), 0);
int len = buf[1];
send(client, buf + 2, len, 0);
```

The attacker controls `len`, so `send` may read beyond the 32-byte buffer and return unrelated server memory, potentially including secrets.

A complete correction addresses two problems:

```c
memset(buf, 0, sizeof(buf));
recv(client, buf, sizeof(buf), 0);

int len = buf[1];
if (len > (int)(sizeof(buf) - 2)) {
    len = (int)(sizeof(buf) - 2);
}

send(client, buf + 2, len, 0);
```

- Capping the length prevents the over-read.
- Zero-initialising the buffer prevents disclosure of stale bytes within portions not overwritten by input.

These controls address separate confidentiality failures.

### 5.5 Example trust model

| Input source | Example trust judgement |
|---|---|
| Command-line arguments | Untrusted and user-controlled |
| Environment variables | Untrusted and inherited/manipulable |
| Standard input | Untrusted, especially when redirected |
| Configuration file | Partially trusted; depends on integrity/permissions |
| Network | Fully untrusted under a remote-attacker model |
| Internal constants | Trusted if not externally influenced |

The assumptions should be written explicitly. "Internal" data may still become untrusted if it was derived from an external input earlier.

### 5.6 Sanitisation obligations

Securing a trust boundary requires:

1. validating types, lengths, ranges, encodings, and cross-field consistency;
2. preventing leaks of uninitialised data or sensitive references;
3. validating control-flow/state ordering across the interface.

Complex parsers, browsers, document/image processors, shells, and network stacks are especially exposed because their accepted formats and protocols have large, feature-rich state spaces.

---

## 6. Secure C/C++ coding practices

### 6.1 Buffers and integers

- Track buffer capacities explicitly; C arrays do not carry runtime length metadata.
- Distinguish element count from byte count.
- Use `sizeof` carefully and understand target type widths.
- Check addition and multiplication before computing allocation sizes.
- Remember signed overflow is undefined; unsigned wrapping is defined but may still violate a security invariant.
- Use compiler overflow builtins where appropriate.

### 6.2 Library-function hazards

| Risky function | Problem | Safer direction |
|---|---|---|
| `gets` | No size limit | `fgets` |
| `strcpy` | No destination bound | Bounded copy plus explicit termination |
| `sprintf` | No output bound | `snprintf` |
| `scanf("%s", ...)` | No width by default | `fgets` then bounded parsing |
| `memcpy` | Caller must prove sizes; unsafe for overlap | Validate size; use `memmove` for overlap |
| `bcopy` | Obsolete/unbounded semantics | `memmove` |
| `strlen` | Reads until null terminator | Use only after termination is established |

Bounded does not automatically mean safe. `strncpy` may leave the destination unterminated, and using the source length as the bound may fail to cover or terminate the destination correctly.

### 6.3 Dynamic allocation

- Check `malloc`/`calloc` return values.
- Do not dereference or otherwise use a pointer after `free`.
- Clear invalid owning pointers after free where this reduces accidental reuse.
- Handle aliases and ownership so no other stale reference remains.
- Do not overwrite the only pointer with `realloc` directly.

Unsafe `realloc` pattern:

```c
ptr = realloc(ptr, new_size);
```

If allocation fails, `realloc` returns `NULL` while the old allocation remains live, so the original pointer is lost. Use a temporary:

```c
void *new_ptr = realloc(ptr, new_size);
if (new_ptr != NULL) {
    ptr = new_ptr;
}
```

`calloc` zero-initialises memory. This can prevent stale-data disclosure when structures are only partially filled before being sent across a trust boundary, though it has a performance cost.

---

## 7. Static and dynamic bug detection

Detection tooling belongs in development, testing, and CI because instrumentation and deep analysis are usually too expensive for unrestricted production use.

### 7.1 Static analysis

Static analysis examines code without running it.

| Strength | Limitation |
|---|---|
| Can inspect broad code coverage | Produces false positives |
| Automates well in CI | Runtime values and heap state may be unknown |
| Can find issues before tests execute | May not scale to very large programs |

Start with compiler diagnostics:

```bash
cc -Wall -Wextra -pedantic source.c
```

Dedicated tools named in the slides include Clang Static Analyzer, Lint, Coverity, and cppcheck.

In the lecture demonstration, a program contains a signed overflow, a buffer overflow, and a use-after-free. Default compilation shows no visible issue, while `clang --analyze` finds only the use-after-free. The example demonstrates false negatives: static analysis is useful but insufficient.

### 7.2 Dynamic analysis

Dynamic analysis observes an executing program.

| Strength | Limitation |
|---|---|
| Has concrete runtime state | Sees only executed paths and inputs |
| Works well for difficult runtime/lifetime bugs | Adds significant overhead |
| Some tools operate on binaries | Large input spaces limit coverage |

### 7.3 Sanitizers

**AddressSanitizer (ASan)** detects many heap, stack, and global-memory errors:

- buffer overflow/underflow;
- use-after-free;
- double free;
- some memory leaks.

```bash
clang -fsanitize=address -g program.c -o program
```

**UndefinedBehaviorSanitizer (UBSan)** detects cases such as signed integer overflow, invalid casts, misaligned access, and division by zero.

```bash
clang -fsanitize=undefined -g program.c -o program
```

In the three-bug example, ASan reports the buffer overflow and then the use-after-free once the first bug is fixed; UBSan reports the signed overflow.

### 7.4 Valgrind

Valgrind detects memory errors and leaks without requiring the target to be rebuilt with sanitizer instrumentation. It is older and often slower than compiler sanitizers, but binary-only operation remains useful.

### 7.5 Fuzzing

**Fuzzing injects malformed inputs through a trust boundary to trigger bugs.** It is dynamic testing of interfaces such as files, command-line arguments, network messages, or IPC.

The AFL workflow in the slides is:

1. instrument/compile the target with AFL tooling;
2. supply at least one seed input;
3. let AFL mutate inputs and monitor behaviour;
4. preserve crashing payloads;
5. reproduce a crash under a diagnostic tool such as ASan.

Coverage-guided fuzzing explores paths more effectively than purely random input, but its results still depend on reachable states and seed quality.

Other named approaches include code review, unit testing, taint analysis, symbolic execution, abstract interpretation, formal verification, and model checking.

### 7.6 Why multiple techniques are required

- Static analysis has broad potential coverage but incomplete runtime context.
- Dynamic analysis has concrete context but input-dependent coverage.
- Fuzzing stresses trust boundaries but cannot exhaust all inputs/states.
- Runtime defences reduce exploitability but do not correct the bug.

Defence in depth combines all of them.

---

## 8. Runtime defences

Runtime defences must operate in production, so their overhead must generally remain within a few percent. This performance constraint explains why deployed protections are often coarse or selective.

### 8.1 Non-executable memory and W^X

Historically, data regions including stacks could be executable. An overflow could write injected machine code into a buffer and jump to it.

The hardware **NX bit** marks pages non-executable. Modern systems aim for **W^X**:

> A memory region should not be writable and executable at the same time.

Code is executable but not writable; stack, heap, and writable globals are writable but not executable. This applies least privilege to page permissions.

Limitation: NX blocks direct code injection but not reuse of existing executable code, including ROP.

### 8.2 Address Space Layout Randomisation

ASLR randomises where program segments are loaded. Addresses learned from one process execution should not predict the next execution.

For performance, randomisation is segment-granular rather than per variable:

- relative distances between different segments may change;
- relative distances within one segment remain constant.

Therefore a single leaked pointer may reveal the base and allow calculation of other addresses in the same segment. ASLR depends strongly on preventing infoleaks.

A main executable must be position-independent (**PIE**) to benefit fully from relocation. A non-PIE program's code may remain at a fixed address even when other mappings are randomised.

### 8.3 Stack canaries

The compiler places a magic value before protected return-control data and checks it before returning. An overflow that reaches the return address normally overwrites the canary first, causing detection and termination.

Protection levels include:

```bash
-fstack-protector-strong
-fstack-protector-all
```

The default protects selected functions, including those with sufficiently large character arrays; stronger modes protect more functions at increased code-size/performance cost.

Limitation: a process usually reuses one canary value. If an out-of-bounds read discloses it, an attacker may preserve the correct value while corrupting later data.

### 8.4 Symbol stripping, RELRO, and fortification

**Symbol stripping** removes debugging/symbol information useful for reverse engineering:

```bash
strip <binary>
```

**RELRO** protects relocation data such as the Global Offset Table (GOT), whose entries behave like function pointers.

- Partial RELRO leaves some relocation state writable.
- Full RELRO resolves everything at load time and makes the GOT read-only, increasing startup cost.

```bash
-Wl,-z,relro,-z,now
```

**`_FORTIFY_SOURCE`** enables lightweight compile/runtime checks around sensitive library calls when object sizes are known.

```bash
-D_FORTIFY_SOURCE=1
```

Higher levels add checks but may require careful compatibility testing.

`checksec` reports common binary properties including RELRO, canaries, NX, PIE, symbols, and fortification.

### 8.5 Control Flow Integrity

**Control Flow Integrity (CFI)** restricts indirect control transfers to legitimate program paths.

**Forward-edge CFI** protects indirect calls through function pointers or C++ virtual tables:

- coarse-grained: target must be the start of some valid function;
- fine-grained: target must be one of the functions allowed for that particular call site in the control-flow graph.

Software implementations include compiler CFI, while Intel CET marks valid indirect targets with `endbr64`.

**Backward-edge CFI** protects returns using a **shadow stack**:

1. `call` stores the return address on the normal stack and a protected shadow stack;
2. `ret` compares the normal value with the protected copy;
3. a mismatch indicates corruption.

The shadow stack must itself be inaccessible to the attacker; otherwise both copies can be modified.

### 8.6 Mitigation/limitation table

| Defence | Stops or impedes | Important limitation |
|---|---|---|
| NX / W^X | Executing injected data | Existing-code reuse and ROP |
| ASLR | Predictable addresses across runs | Segment granularity; pointer leak breaks layout secrecy |
| Stack canary | Many stack return-address overwrites | Reused value may leak; not all functions protected by default |
| Full RELRO | GOT overwrite | Increased load time |
| `_FORTIFY_SOURCE` | Some known-size library overflows | Coverage depends on compiler knowledge; compatibility cost |
| Forward-edge CFI | Invalid indirect-call targets | Coarse policies permit extra targets |
| Shadow stack | Corrupted return address | Shadow storage must remain protected |

The existence of a defence does not prove a binary is safe. Each mechanism covers a class of exploit and has explicit assumptions.

---

## 9. How the chapter fits together

The address-space lecture explains where code, data, heap objects, and return addresses reside. The safety lecture defines illegal place/time accesses. The exploitation lecture shows how those mistakes become CIA violations. The trust-boundary lecture identifies where malicious inputs arrive. The coding/tooling lecture tries to prevent and detect mistakes. The runtime lecture assumes some bugs remain and constrains exploitation.

Key connections:

- The call/return ABI creates writable return addresses; stack smashing targets them; canaries and shadow stacks protect them.
- Page permissions distinguish code and data; NX/W^X enforce that distinction.
- Infoleaks expose pointers; pointer leaks undermine ASLR.
- Freed memory is reused for performance; that reuse makes use-after-free exploitable.
- `strncpy` limits bytes but may omit termination; validation must consider semantic correctness, not only maximum length.
- Fuzzing deliberately injects malformed data at the same trust boundaries that secure code must validate.

---

## 10. Exam-focused facts

### 10.1 High-value questions

| Question | Answer |
|---|---|
| What loads a dynamic program and libraries? | The userspace ELF loader mapped first by the OS |
| Normal x86-64 function argument registers? | `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9` |
| Spatial versus temporal safety? | Right place versus right time/lifetime |
| Is C unsafety accidental? | No, it trades checks/metadata for performance and low-level control |
| What can undefined behaviour do? | Anything; execution has no language guarantee |
| What did the four examples show? | Infoleak, data tampering, stack hijack, and UAF hijack |
| What is a trust boundary? | Interface between trusted and untrusted components under a threat model |
| Format-string fix? | Use a constant format and pass input as data |
| Heartbleed class? | Remote out-of-bounds read controlled by an untrusted length |
| Why zero Heartbleed buffers too? | Prevent stale-data disclosure separate from the bounds bug |
| Does `strncpy` always terminate? | No |
| Safe `realloc` pattern? | Store result temporarily before replacing the original pointer |
| Static-analysis demonstration? | Clang found only one of three intentional bugs |
| ASan versus UBSan? | Memory/lifetime errors versus undefined behaviour such as signed overflow |
| What is fuzzing? | Malformed input injection through a trust boundary |
| NX limitation? | ROP reuses existing executable code |
| ASLR limitation? | Segment-level layout and pointer leaks |
| Canary limitation? | Reused value can be leaked; selective function coverage |
| PIE relationship to ASLR? | PIE lets the main executable be relocated |
| Forward versus backward CFI? | Indirect calls versus returns |

### 10.2 Quantitative and named facts

| Fact | Value |
|---|---:|
| Approximate modern address space in Lecture 06 | 128 TB |
| C/Python summation comparison | About 70x faster in C |
| Reported Microsoft/Google memory-safety bug share | About 70% |
| Default canary example threshold | Character arrays larger than 8 bytes |
| Desired production-defence overhead | Generally a few percent |

### 10.3 Common mistakes

- Treating the loader as part of the program binary rather than a separately loaded userspace component.
- Confusing normal function-call registers with syscall registers.
- Describing memory safety only as bounds checking and omitting lifetime safety.
- Assuming a crash is the only effect of undefined behaviour.
- Ignoring read overflows because they do not modify memory.
- Assuming control-flow hijacking always injects new code.
- Treating every input source as equally trusted without stating a threat model.
- Believing `snprintf` is safe when the attacker controls its format string.
- Saying the Heartbleed fix is only a length check and omitting stale-data zeroing.
- Assuming bounded string functions guarantee valid C strings.
- Overwriting a pointer directly with `realloc`.
- Treating static or dynamic analysis as complete.
- Saying NX prevents ROP.
- Saying ASLR randomises every variable independently.
- Claiming canaries or CFI remove the underlying memory bug.

### 10.4 Revision checklist

- [ ] Draw the process address space and label code, globals, heap, libraries, and stack.
- [ ] Explain ELF loader order and inspect mappings/headers.
- [ ] Recall normal x86-64 calling-convention registers and `call`/`ret` behaviour.
- [ ] Define memory safety and spatial/temporal safety.
- [ ] Explain why C deliberately omits safety checks.
- [ ] Classify overflow, UAF, double-free, null, and uninitialised-read bugs.
- [ ] Explain why undefined behaviour invalidates execution even when output looks correct.
- [ ] Reproduce the four exploit patterns and their CIA effects.
- [ ] Explain ROP as existing-code reuse.
- [ ] Identify command line, environment, file, network, and IPC trust boundaries.
- [ ] Explain format-string and Heartbleed fixes.
- [ ] Compare risky libc calls and bounded alternatives/limitations.
- [ ] State correct allocation, free, `realloc`, and initialisation practices.
- [ ] Compare static analysis, sanitizers, Valgrind, and fuzzing.
- [ ] Explain NX/W^X, ASLR/PIE, canaries, RELRO, FORTIFY, and CFI.
- [ ] Pair every mitigation with its limitation.

---

## 11. Compact answer framework

For a long-form vulnerability question:

1. Identify the **trust boundary and attacker-controlled input**.
2. Name the violated **spatial or temporal rule**.
3. Trace the affected memory region using the program layout.
4. State the confidentiality, integrity, or availability impact.
5. Give the **root coding fix**, including validation and lifetime rules.
6. Name development-time tools that can detect the bug.
7. Discuss production defences and their limitations.

This structure avoids confusing mitigations with fixes: the bug should be removed, while runtime defences provide additional resilience if similar bugs remain.
