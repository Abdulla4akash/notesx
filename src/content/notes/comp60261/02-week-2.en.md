---
subject: COMP60261
chapter: 2
title: "Week 2"
language: en
---

# COMP60261 — Week 2: Memory Safety

**Scope:** how a program is laid out in memory and how function calls work at machine level; what memory safety is and why C deliberately lacks it; four worked exploits; trust boundaries as the organising concept for untrusted input; secure coding practices and bug-detection tooling; and the runtime defences deployed in production.

**Covers lectures:** 06 Anatomy of a Program in Memory · 07 Memory Safety · 08 Exploiting Vulnerabilities 1 · 09 Exploiting Vulnerabilities 2 · 10 Secure Coding Practices, Detecting Bugs · 11 Runtime Defences

**The week's three-part answer**, stated in Lecture 10 and worth holding as the skeleton:

1. **Adhere to good coding practices** — avoid introducing bugs (Lecture 10)
2. **Use tools to detect bugs** before shipping (Lecture 10)
3. **Use runtime defences in production** — make exploitation harder and limit the damage (Lecture 11)

And the honest caveat that motivates step 3: **none of the existing practical approaches can guarantee the absence of bugs.**

---

# Part 1 — Anatomy of a program in memory (Lecture 06)

## 1.1 The virtual address space

Each program sees the memory it can access as **a very large array of bytes** — the address space — where each slot has an **address**, running from 0 to **~128 TB on modern 64-bit CPUs**. The program accesses it with **load and store** instructions at target addresses.

Two properties matter:

- With virtual memory the address space is **private to each program** — each believes it can read and write the whole thing.
- Its size is **independent of how much RAM the machine has**, and it is **sparsely populated** — most of it is not mapped at all.

## 1.2 Life cycle of the address space

How the address space comes to exist, in order:

1. Before execution, the program's **binary sits on disk**.
2. On invocation, the **OS creates a virtual address space**.
3. The binary is in **ELF** format, whose metadata names the **loader** — e.g. `ld-linux-x86-64.so.2`, **a separate binary**. The OS maps parts of the *loader's* binary into the address space first.
4. **The loader executes.**
5. The loader **loads the program's binary**.
6. Most programs are **dynamically linked**, so the loader reads the list of required **shared libraries** from the ELF binary (e.g. `libc.so`) and loads them too. They are called *shared* because they can be loaded into several programs' address spaces.

> **Exam flag.** The ordering is counter-intuitive and examinable: **the loader is itself a program that the OS loads first**, and it — not the kernel — then loads your binary and its libraries. Inspect this with `readelf -l`, and list dependencies with `ldd`.

**Everything mapped so far is static memory:** the size of these areas and the data they contain is **fixed at compile time** and never changes during execution. Static memory holds **executable code** and **global variables**. Only once it is set up does the program's own code begin to run.

Then **dynamic memory** appears — areas whose size changes at runtime:

- A **stack**, holding **local variables and function arguments**, **growing down** with nested function calls.
- A **heap**, holding memory allocated with `malloc`, **growing up**.

Further mappings may appear later — loading modules, or **just-in-time compiled code** (e.g. Java).

**All mappings carry access permissions**, set up by the OS and **enforced by the CPU on load and store operations** — e.g. read+execute for **code**, read+write for **data**. (This is the hardware hook that Lecture 11's NX defence uses.)

## 1.3 Inspecting it

- `cat /proc/<pid>/maps` — the live memory map, showing each region's address range, permissions (`r--p`, `r-xp`, `rw-p`), and backing file. You can directly identify the program's own segments, `libc.so.6`, `ld-linux`, `[heap]` and `[stack]`.
- `readelf -lSW <binary>` — ELF **sections** and **program headers**. Sections include `.text` (code, flagged `AX`), `.rodata` (read-only data, `A`), `.data` (initialised globals, `WA`) and `.bss` (zero-initialised globals, type `NOBITS`, `WA`). The `LOAD` program headers carry the flags `R`, `R E`, `RW` that become the mapping permissions.
- `objdump --disassemble <binary>` — see how the compiler turned source into machine code.

> **A detail worth noting:** static mappings are **private** — stores the program makes into writable areas are **not reflected in the binary on disk**. That is what makes it possible for many processes to share one on-disk `libc` while each has its own writable data.

## 1.4 The function calling convention

**The concept of a "function" does not exist at the machine code level.** So how does the compiler turn calls and returns into machine code? Via an architecture-specific **calling convention**. For x86-64:

1. Place arguments in order in **`%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9`**. More than six? Additional ones are **pushed on the stack**.
2. Issue the **`call`** instruction; the CPU jumps to the called function.
3. On return, the callee places the return value in **`%rax`** and issues **`ret`**.

This convention is the **System V x86-64 ABI**.

> **Exam flag — a precise discriminator.** Compare with the **system call** ABI (Week 3, Lecture 13): the syscall convention uses **`%r10` where the function convention uses `%rcx`**, and puts the **syscall number in `%rax`** rather than a return value. They are *different conventions from the same ABI document*, and the difference exists because the `syscall` instruction itself clobbers `%rcx`. Being able to state both, and why they differ, is worth having.

## 1.5 Function calls and the stack

The **stack** is a contiguous area of the address space holding **per-function data** — parameters and local variables. **Each function has a stack frame.**

The mechanics, which are the foundation of Lecture 08:

- When the CPU executes **`call`** it: **(1) pushes the return address onto the stack**, and **(2) jumps to the target function**.
- The callee's frame — its locals and parameters — is then allocated **above** that return address in the direction the stack grows.
- When the CPU executes **`ret`** it: **pops the return address from the stack and jumps to it.**

**The stack grows down** (toward lower addresses), but buffers within a frame are written **upward**. That opposition is exactly what makes stack smashing possible.

---

# Part 2 — Memory safety (Lecture 07)

## 2.1 Definition and stakes

> **Memory safety: protection against certain types of bugs relating to memory accesses in a program.** Protections can be enforced **at compile time and/or at runtime**.

**Some languages — notably C and C++ — do not have such protections. The problem is that these are the languages used for systems software development.**

When memory safety bugs occur they lead to crashes and strange behaviour, **but also to security vulnerabilities**, exploitable to compromise:

- **Availability** — e.g. crash a program or system
- **Confidentiality** — e.g. leak sensitive data or secrets
- **Integrity** — e.g. escalate privilege

## 2.2 What memory-safe languages enforce

Languages such as **Java, Python, Haskell** enforce a **series of rules**:

- No out-of-bounds access
- Memory that has been deallocated cannot be accessed
- **No reference to deallocated memory can even exist**
- Memory can only be freed once
- `NULL`/invalid references cannot be dereferenced
- Memory must be accessed through variables of the **correct type**
- Memory must be **initialised before being read**

**C and C++ lack essentially all of them:** no bounds checks; deallocated memory can be pointed to and accessed; memory can be freed multiple times; `NULL`/invalid references can be dereferenced; uninitialised memory can be read; no type-safety enforcement (casts bypass it).

**The contrast in one line:** indexing past the end of a three-element list in Python **throws an out-of-bounds exception**; the equivalent C **compiles without warning, does not crash, and prints garbage**.

## 2.3 Unsafety by design

> **The lack of safety checks in C/C++ is not an error in the languages' specifications.**

The unsafety is **required to achieve the benefits these languages are known for**:

| Omission | Benefit it buys |
|---|---|
| No runtime checks on bounds, pointer validity, type correctness | **Maximise performance** |
| No garbage collection or runtime metadata overhead | **Low, controllable memory footprint** |
| No GC pauses | **Predictable latency** — e.g. real-time systems |
| Ability to **access arbitrary areas of the address space** | Needed to write **OS code** |

**The measured trade-off:** summing 100 million integers in C versus the equivalent bounds-checked Python loop, **the C version is about 70× faster**.

> **Exam flag — high value.** This is the framing to open any "why is C unsafe?" answer with. It is a **deliberate trade**, not an oversight — which is precisely why "just be more careful" is not a solution, and why the rest of the unit is about mitigation, detection and hardware enforcement.

## 2.4 The common issue classes

- **Buffer/array overflow** — e.g. a loop written `for(i=0; i<=4; i++)` over a four-element array: at `i == 4` it reads past the array, multiplies, and writes back.
- **Underflow** — the same thing in the other direction, e.g. `array[-1]`.
- **Use-after-free / dangling pointers** — after `free(buffer)`, `buffer` references unallocated memory; `*buffer = 42` is a use-after-free.
- **Double free** — freeing the same pointer twice, which generally makes the allocator misbehave.
- **`NULL` pointer dereference** — `NULL` is **encoded as 0**, so dereferencing it accesses address 0. **Most OSes do not map the first page**, so this usually crashes — **but if something *is* mapped there, the program silently misbehaves instead.**
- **Accessing uninitialised memory** — neither local variables nor `malloc`'d memory are zeroed; **most of the time they contain garbage** and must never be read before being written.

**And the property that makes all of them dangerous:**

> In most cases **the compiler will not warn** about these issues. At runtime the **program misbehaves, sometimes silently.** They can be hard to detect, and hard to debug — you must trace a symptom (e.g. a crash) back to a root cause that may be far away.

## 2.5 How these errors sneak in

The lecture pre-empts the obvious objection — that the examples are trivially small and nobody would make such mistakes. The answer is that real programs differ in ways that make the mistakes likely:

- **High complexity** — thousands to millions of lines of code
- It is **hard (but important) to reason about what code and data can be trusted**
- **Developed by different programmers**
- **Codebases evolving over years**

> The Lecture 08 infoleak example is a deliberate demonstration of exactly this: a message is shortened, but the loop bound that walks it is not updated. Trivially spotted in ten lines; entirely plausible across a large codebase and a maintenance window.

## 2.6 Spatial and temporal safety

| | Definition | Violations |
|---|---|---|
| **Spatial memory safety** | Enforcing accesses **within the bounds** of addressed objects and allocated memory | Buffer over/underflows, indexing arrays out of bounds |
| **Temporal memory safety** | Preventing access to memory that is **no longer valid** | Use-after-free, dangling pointers, reading uninitialised memory |

**Both classes let an attacker break all aspects of CIA** — data tampering and leaks, malicious code execution, denial of service.

> **The compact summary the lecture uses:** spatial safety is accessing memory **at the right place**; temporal safety is accessing it **at the right time**. Worth quoting verbatim.

## 2.7 Undefined behaviour

Spatial and temporal violations are a **subset** of erroneous actions defined as **undefined behaviour**. The C FAQ's characterisation is the memorable one: **anything at all can happen** — the standard imposes no requirements; the program may fail to compile, execute incorrectly (crashing *or silently generating incorrect results*), **or fortuitously do exactly what the programmer intended**.

**The reason UB exists** is, again, to let the compiler **generate very efficient code**.

**Examples beyond memory errors:**

- **Signed** integer under/overflow (note: **unsigned** overflow is *defined* — it wraps)
- Oversized shifts
- Passing a function as a parameter to `sizeof`
- Casting an `int *` into a `float *` and dereferencing it

A one-line demonstration: printing `(INT_MAX + 1) < 0` — which "should" be false, but the program misbehaves and reports true.

> **Exam flag — the key claim.** **If a program goes into undefined behaviour, the entirety of its execution is invalid.** It is buggy and needs to be fixed **even if it seems to run fine.** That is the sentence to state; the seeming-to-work case is the dangerous one, not the crashing one.

---

# Part 3 — Four worked exploits (Lecture 08)

**The scale of the problem, stated up front:** a few years ago **both Microsoft and Google reported that about 70% of their security bugs were due to memory safety violations.**

## 3.1 Example 1 — Infoleak

**Scenario.** A security-sensitive program is distributed **binary-only**; it contains a hardcoded **password**; the attacker has **only the binary** and wants the password.

**The program** prints a welcome message **character by character** in a loop bounded by the message's length (27), then prompts for a password and compares.

**The bug.** A later update **shortens the welcome message** to 11 characters — but **the loop bound is not updated**.

**The exploit.** The loop now **reads past the end of the welcome message** and prints whatever follows it in memory to standard output. Because of **how the compiler lays out global variables**, the password is very likely to sit immediately after — so it is **printed straight to the attacker**.

**Class:** spatial, **read** direction — an out-of-bounds read. No attacker action is even required beyond running the program.

## 3.2 Example 2 — Sensitive data tampering

**Scenario.** Similar password-checking program; the attacker **does not know the password** and wants to pass the check.

**The program** has two adjacent globals — `user_input[32]` and `password[32]` — copies `argv[1]` into `user_input` with **`strcpy`**, and compares them with `strncmp`.

**The exploit.** `strcpy` copies the entire source string **regardless of destination size**. Passing an argument longer than 32 bytes **overflows `user_input` into `password`** — which the compiler likely placed immediately after. The attacker crafts the input so that **the overwritten "correct" password matches what is now in `user_input`**, and authentication **succeeds**.

**Class:** spatial, **write** direction. Note that **no code was injected and no control flow was hijacked** — the program's own logic was turned against it by editing its data.

## 3.3 Example 3 — Stack smashing

**A classic control-flow hijacking attack**, originally described in a 1996 Phrack article. The attacker has external (e.g. command-line) access and **exploits a bug to make the program execute code it is not supposed to**.

**The program.** `main` passes `argv[1]` to `preprocess_input`, which copies it into a **`local_buffer[16]`** with `strcpy`. Elsewhere there is a `security_critical_function`, normally reached only after a successful password check.

**The stack at the moment of the call**, from higher to lower addresses: `main`'s frame → **the return address pushed by `call`** → `preprocess_input`'s frame, containing `local_buffer`.

**The exploit.** Overflowing `local_buffer` writes **upward**, toward higher addresses — through the rest of the frame and into **the return address**. Crafting the payload so the return address is replaced with the address of `security_critical_function` means that when `preprocess_input` executes `ret`, the CPU **pops the attacker's value and jumps to it** — running the protected function **without ever reaching the password check**.

## 3.4 Example 4 — Use-after-free

**The program.** A struct whose third member is a **function pointer** is `malloc`'d and initialised to point at a benign function, which is called. The struct is then **`free`d**. Afterwards, `malloc(12)` allocates a small buffer and `strcpy`s `argv[1]` into it. Then — the bug — **the freed struct's function pointer is invoked**.

**The exploit.** Because **`malloc` reuses freed memory** wherever possible, the 12-byte allocation is likely to land **exactly where the struct was**. The attacker's `strcpy` therefore writes over the region that used to hold the function pointer, and by overflowing the 12 bytes can place **the address of `security_critical_function`** there. When the use-after-free calls through the stale pointer, that function runs.

> **Exam flag.** This example demonstrates why use-after-free is not merely a crash risk. The exploitation requires **allocator behaviour** — deterministic reuse of freed chunks — which is precisely what "heap grooming" generalises. It also explains why the fix is not only "don't use after free" but also **`NULL` the pointer after freeing**.

## 3.5 Advanced control-flow hijacking and ROP

The last two examples are **control flow hijack attacks** — diverting the program's control flow onto **CFG paths the programmer never intended**.

Beyond the program's own functions, an attacker can jump or return to:

- **libc functions** — e.g. a remote attacker jumping to **`exec` with `"/bin/sh"`** as the argument, obtaining a shell;
- **small snippets of code ending in `ret`** — **return-oriented programming (ROP)**.

**ROP mechanics.** The attacker places on the stack a **series of addresses pointing to gadgets** — snippets of just a few instructions, each ending in `ret`. The CPU **`ret`s from gadget to gadget**, and the stack can also hold **data for the gadgets to consume**, e.g. values popped into registers.

> **Exam flag — the killer fact.** There are **tons of gadgets in modern programs**, and it is **easy for an attacker to achieve arbitrary Turing-complete computation** with ROP. That is why non-executable memory (Lecture 11) does not end the story: the attacker stops needing to inject code at all.

---

# Part 4 — Trust boundaries (Lecture 09)

## 4.1 The concept

In every attack so far the **payload** — a piece of program input, maliciously malformed to trigger a vulnerability — arrived via the **command line**. Making the trust model explicit: the OS and hardware are **trusted**; **other programs that can inject command-line arguments are not** — e.g. the invoking shell.

> **A trust boundary is an interface between an untrusted component and a trusted one, according to the threat model** — which makes it a **vector of attack**.
>
> **The validity of all data flowing through this interface needs to be checked before that data is used.**

**Sanity checks at the command line boundary:** do we have the **right number** of parameters? Do the parameters **make sense together**? Do they have **proper values** — type, range, format?

And the framing that matters: this is **not just about the invoker making mistakes**. Under the threat model, **the invoker may be malicious and actively input bad parameters to trigger bugs.**

## 4.2 The other boundaries

Beyond the command line: **standard input**, **environment variables**, **disk and network I/O**, and **IPC with untrusted processes**.

Whether each must be considered depends on your threat model — but **almost every production-ready program using these interfaces will need to sanitise them.**

## 4.3 Worked example — command line

A program `strcpy`s `argv[1]` and `argv[2]` into two 32-byte buffers. The hardened version does **three** things:

1. **Check the number of parameters** — `if (argc != 3)` print usage and exit.
2. **Bound the copies** — `strncpy` with the destination sizes.
3. **Explicitly NUL-terminate both buffers** — `username[sizeof(username)-1] = '\0'` — **because the attacker could supply input such that they are not terminated** (see §5.2).

## 4.4 Worked example — environment variables and format strings

```c
char *user = getenv("USER_INPUT");
char buffer[100];
snprintf(buffer, 100, user);      // vulnerable
```

**There is no overflow here** — `snprintf` will not write more than 100 bytes. The bug is different: **the format string itself is attacker-controlled**. `snprintf` interprets tokens in it and substitutes values, exactly like `printf`. So an attacker who supplies a string containing format tokens can **leak parts of the program's memory**.

**And why that matters beyond the leak itself:** some of the leaked values **look like pointers** — and **leaking a pointer is an important step in many attacks**, because it defeats ASLR (§6.2).

**The fix** is to make the format string a constant and pass the untrusted data as an argument:

```c
snprintf(buffer, sizeof(buffer), "%s", user);
```

> **Exam flag.** Format-string vulnerabilities are a distinct class from overflows: the danger is **attacker-controlled *format*, not attacker-controlled *length***. The rule is simple and absolute — **never pass untrusted data as a format string.**

## 4.5 Worked example — Heartbleed

**Heartbleed (CVE-2014-0160)** — a critical vulnerability in **OpenSSL** that allowed **remote attackers to read memory from vulnerable servers**.

**The mechanism.** In a malformed heartbeat request, **the malicious client controls the size of the server's response** and sets it **larger than the response's actual data**. This triggers a **buffer overflow in read mode**, and the server's memory — potentially including **crypto keys** — is sent back to the client.

**The simplified code** makes the bug a single line:

```c
unsigned char buf[32] = {0};
recv(client, buf, sizeof(buf), 0);
int len = buf[1];               // attacker-supplied length, no bounds check
send(client, buf + 2, len, 0);  // reads up to 255 bytes from a 32-byte buffer
```

**The fix has two parts**, and both matter:

```c
memset(buf, 0x0, 32);           // 1. zero the buffer before use
recv(client, buf, sizeof(buf), 0);
int len = buf[1];
if (len > (32 - 2))             // 2. cap the length
    len = (32 - 2);
send(client, buf + 2, len, 0);
```

> **Exam flag.** Part 2 (**capping the length**) stops the over-read. Part 1 (**zeroing**) stops **leaking stale data that was already in the buffer** — a separate confidentiality problem that a bounds check alone would not fix. Giving both parts, and explaining that they address different failures, is what makes a complete answer.

## 4.6 Building a trust model

The lecture's example, for a web server:

| Source | Trust level | Reasoning |
|---|---|---|
| **Command-line arguments** | ❌ Untrusted | User-controlled; could point at malicious files or overflow buffers |
| **Environment variables** | ❌ Untrusted | Inherited from the shell; manipulable via scripts or misconfiguration |
| **Standard input** | ❌ Untrusted | Human error, or injection if stdin is redirected |
| **Configuration file** | ⚠️ **Partially trusted** | Could be modified by external actors; needs **integrity checks and format validation** |
| **Network input** | ❌ **Totally untrusted** | Malicious clients send malformed, oversized or malicious payloads |
| **Internal constants** | ✅ Trusted | Controlled by the developer; no user influence |

> The **partially trusted** row is the interesting one. It is not a cop-out — it reflects that a config file's trustworthiness depends on filesystem permissions being right, which is an assumption worth stating rather than silently making.

## 4.7 What sanitisation means

Three obligations, not one:

- **Validate before use** the **types, sizes, ranges, and consistency** of data flowing through the interface. (*Consistency* meaning whether the pieces make sense **together**, not just individually.)
- **Avoid leaking data or references** to untrusted components — e.g. by zeroing data that is not initialised.
- **Validate the control flow** — enforce **proper ordering** in the use of the trusted interface's primitives. If a protocol requires request A before request B, ask what happens when they are inverted.

## 4.8 Why this is hard, and which software suffers

**Properly securing trust boundaries becomes very hard when the program and the boundaries are complex.** For that reason particular classes of software are known to suffer from bugs:

- **Parsers** — feature-rich, complex formats (e.g. XML)
- **Web browsers** — huge quantities of untrusted input (HTML, CSS, JS)
- **Image/document processors** — complex formats, **sometimes embedding code**
- **Shell/command-line parsers** — many features
- **Network protocol stacks** — complex, many features

> **Exam flag.** The common factor is **interface complexity proportional to format richness**. This is the same argument that returns in Week 5 (compartment interfaces) and Week 6 (the syscall interface versus a hypervisor's few traps). If asked why some software is disproportionately vulnerable, the answer is the size and complexity of what it must accept.

---

# Part 5 — Secure coding and bug detection (Lecture 10)

## 5.1 Arrays, buffers and integers

- **Arrays/buffers: keep track of their sizes yourself** — C does not embed them. You need the size to know **when to stop iterating** and **how many bytes at most to copy**.
- **Integer arithmetic: be aware of type sizes on your target architecture.** Use **`sizeof()`**.
- **Signed integer overflow is undefined behaviour** — whereas **unsigned** merely wraps around, which is defined.
- The compiler provides **integer-overflow builtin functions** (for addition, subtraction, multiplication) to detect overflow explicitly.

## 5.2 The unsafe libc functions

| Unsafe | Why | Safer alternative |
|---|---|---|
| `gets()` | No bounds checking at all | `fgets()` |
| `strcpy()` | No bounds checking; overflows destination | `strncpy()`, `strlcpy()` if available |
| `sprintf()` | No bounds checking | `snprintf()` |
| `scanf()` | No bounds checking, e.g. `%s` with no width | `fgets()` + `sscanf()` **with width specifiers** |
| `memcpy()` | No bounds checking | Use with care; `memmove()` for **overlapping** regions |
| `bcopy()` | Obsolete, no bounds checking | `memmove()` |
| `strlen()` | **Not inherently unsafe**, but must not be used on untrusted or **unterminated** buffers | Ensure NUL-termination first |

**But the `n` versions have their own traps.** Most importantly: **`strncpy` does not add `\0` at the end of the target buffer.** Copying `"hello, world"` into a 32-byte buffer previously filled with `x`s, using `strlen(source)` as the bound, yields `"hello, worldxxxxxxxxxxxxxxxxxxx"` — **a mix of both strings**, almost certainly not what was intended.

> **Exam flag.** "Use the `n` versions" is the half-answer. The full answer adds that **bounded is not the same as safe**: `strncpy` may leave the destination unterminated, which is exactly why §4.3's hardened example terminates both buffers explicitly.

## 5.3 Dynamic memory practices

- **Check `malloc`'s return value.**
- **After `free`, the pointer is invalid** — it **cannot be dereferenced**, and **cannot be used at all**, not even for a comparison.
- **`realloc` returns `NULL` on failure but does not free the old pointer** — so `ptr = realloc(ptr, new_size)` **is a leak**.
- **Use `calloc`** (which zeroes the memory) **if performance requirements allow**. The reason is specific: `malloc` does **not** zero its memory, so if you **partially initialise** a structure in a `malloc`'d buffer and then pass it to an **untrusted context** — e.g. send it over the network — **you leak whatever was previously in that memory**.

> That last point connects directly to §4.5: zeroing the Heartbleed buffer and using `calloc` for outbound structures are the same defence against the same class of leak.

**Further reading named in the lecture:** the SEI CERT C Coding Standard, Seacord's *Secure Coding in C and C++*, ISO/IEC TS 17961, the NASA JPL C Coding Standard, and Fedora's Defensive Coding Guide.

## 5.4 Static analysis

Detection tools generally **cannot run in production** (too much overhead), so they run in the **build and testing phases**, often **integrated into the CI/CD pipeline**. They come in two categories.

**Static analysis searches for issues by analysing the source code, without running the program.**

| Pros | Cons |
|---|---|
| **Good coverage** — sees the whole program | **False positives** |
| Lends itself well to **automation** | **Limited context available** — most memory contents are unknown until runtime |
| | **Scalability** on large programs |

**Start with compiler warnings**, in increasing order of pickiness: **`-Wall`** → **`-Wextra`** → **`-pedantic`**.

**Then dedicated tools:** Clang Static Analyser, Lint, Coverity, cppcheck.

## 5.5 The demonstration that motivates dynamic analysis

A deliberately faulty program contains **three** bugs: a **signed integer overflow**, a **buffer overflow** (`strcpy` of a long string into an 8-byte buffer), and a **use-after-free**.

- Compiled with default settings: **no warning or error at compile time, and no visible effect at runtime.**
- `clang --analyze`: detects **only the use-after-free** — **not** the integer overflow, **not** the buffer overflow.

**Conclusion drawn:** for the other two we need **dynamic analysis**.

> **Exam flag.** This one/three result is a concrete, quotable demonstration that **static analysis is necessary but not sufficient**. It is far more persuasive than the abstract "static analysis has false negatives".

## 5.6 Dynamic analysis

**Dynamic analysis tries to detect errors while running the program.**

| Pros | Cons |
|---|---|
| **Runtime context available** | **Input-dependent coverage** — only sees executed paths |
| Easier when **sources are unavailable** (black-box testing) | Scalability to many programs; **high runtime overheads** |

**Sanitisers** — compiler-based instrumentation, the most popular approach:

- **AddressSanitizer (ASan)** — heap/stack/global memory issues: **buffer overflows, use-after-free, double free, memory leaks**. Enabled with `-fsanitize=address`.
- **UndefinedBehaviorSanitizer (UBSan)** — **integer overflows, invalid casts, misaligned pointers, division by zero**. Enabled with `-fsanitize=undefined`.

On the faulty program: **ASan catches the buffer overflow**; after fixing that and recompiling, **ASan catches the use-after-free**; **UBSan catches the signed integer overflow**. Between them, all three bugs static analysis missed.

**Valgrind** — an older tool for memory errors and leaks, **mostly superseded by sanitisers**. Its remaining advantage: **no need to recompile**, so it is still useful when you have only the binary.

**Fuzzing** —

> **Injecting malformed input through a trust boundary to trigger bugs** — e.g. command-line arguments, input files, network. A form of dynamic analysis, and a **highly popular modern approach helping to secure interfaces.**

Note how precisely that definition ties back to Lecture 09: **fuzzing is trust-boundary testing.** The workflow with **AFL**: instrument the target (`afl-clang`), create a **seed** input, run `afl-fuzz`, then **reproduce the crash under ASan** to diagnose it.

**Other approaches named:** manual code review, unit testing, linters/style checkers, **taint analysis**, **symbolic execution**, **abstract interpretation**, **formal verification**, **model checking**.

## 5.7 The conclusion that motivates Part 6

> **None of the existing practical approaches can guarantee the absence of bugs.**

So we also need runtime defences in production — to **detect bugs**, to **make exploits harder to achieve**, and to **limit the damage** an attacker can do when exploiting a vulnerability.

---

# Part 6 — Runtime defences (Lecture 11)

## 6.1 Non-executable memory and W⊕X

**Historically**, large parts of the address space — including **the stack** — were accessible with **execution rights**. This made **code injection** attacks very easy: overflow a buffer with machine code, then jump to it.

**Hardware support for marking parts of the address space non-executable appeared in the early 2000s — the NX bit.** Everything that is not code (stack, heap, static data) is marked non-executable. This is **an application of least privilege**.

**Today modern programs aim to maintain W⊕X:** **no part of memory can be writable and executable at the same time.**

## 6.2 ASLR

**ASLR randomises the layout of the address space**, making it **hard for an attacker to determine target locations in memory**.

**The attack it defeats:** observe one invocation of the program — e.g. under a debugger — to learn where a buffer or a target function sits, then launch the attack against a **second** invocation. With ASLR the addresses differ between runs, so the reconnaissance does not transfer.

**Granularity — and this is the critical part.** For performance reasons, individual variables are **not** randomised. ASLR **randomises the start address of segments when they are loaded** — at program initialisation for the main program, and at load time for libraries and shared objects.

The consequence, demonstrated by printing addresses of pairs of globals, locals and heap allocations across runs:

- The **relative distance between two pieces of data in *different* segments changes** between executions.
- **The relative distance between two pieces of data in the *same* segment does not.**

> **Exam flag — high value, and this unit's specific framing.** Because only segment **base** addresses are randomised, **a single pointer leak lets the attacker compute the address of everything else in that segment.** So coarse-grained ASLR is **easy to break given any infoleak** — which is exactly why the format-string leak in §4.4 mattered, and why §4.7 says to avoid leaking references.

## 6.3 Stack canaries

**Return address protection on the stack:** place a **magic value (the canary)** before the return address on function entry, and **check it on return**. The **compiler inserts both** the placing and the checking code.

**Why it works:** an overflow aiming to rewrite the return address must **pass through the canary first**, so the canary is corrupted, the check fails, and **the overflow is detected** and the program stopped.

**Coverage is configurable:**

- By default, modern compilers protect **only certain functions** — those declaring a **`char` array larger than 8 bytes**.
- **`-fstack-protector-strong`** applies it to **more functions, with no size limit**.
- **`-fstack-protector-all`** applies it to **all** functions.
- The trade: **security versus code size increase and performance impact**.

**Canaries are not perfect.** **The same canary value is generally used for all function calls**, so **if it leaks to the attacker — e.g. through a read overflow — the protection is broken** across the program.

## 6.4 Other hardening

**Strip symbols and debug information.** These are **very helpful to an attacker reverse-engineering a binary**. Use `strip <binary>`.

**RELRO (read-only relocations)** protects against attacks that use the **shared library relocation system — the Global Offset Table (GOT)** — to hijack control flow. GOT entries are effectively function pointers, so making them writable makes them targets.

- **Partial RELRO** (the default) makes **only part** of the GOT read-only.
- **Full RELRO** performs **all relocation at program load time** and makes the **GOT read-only** — at the cost of **significantly longer load times**. Flags: `-Wl,-z,relro,-z,now`.

**`_FORTIFY_SOURCE`** enables **lightweight compile-time and runtime buffer-overflow checks before sensitive functions** such as `strcpy` and `strcat`. Enabled with `-D_FORTIFY_SOURCE=1`; **level 2 adds more checks but may break the program**, so only use it if you can test thoroughly.

**Checking what a binary actually has:** the **`checksec`** tool reports **RELRO, STACK CANARY, NX, PIE, Symbols, FORTIFY**.

> **Exam flag.** **PIE — position independent executable — is a prerequisite for the binary to be compatible with ASLR.** A non-PIE binary loads at a fixed address no matter what ASLR does, leaving its code permanently predictable. So "ASLR is enabled" is not by itself a complete statement about a binary.

## 6.5 Control Flow Integrity

**CFI ensures that the program's control flow follows legitimate paths only**, protecting against control-flow hijacking attacks such as stack smashing. **In practice it focuses on protecting jumps whose target address is writable**, which splits into two edges.

**Forward edge CFI** — when a **function pointer** or **C++ virtual table entry** is called, restrict the target to valid functions:

- **Coarse-grained:** the target may be the beginning of **any** function.
- **Fine-grained:** restrict to **only the legitimate targets in the CFG** — e.g. only those function addresses actually assigned to that pointer.

Implementations: **in software** with LLVM/clang (`-fsanitize=cfi -flto -fvisibility=hidden`), and **in hardware** with **Intel CET**, which marks valid targets with an **`endbr64`** instruction.

**Backward edge CFI** — implemented with a **shadow stack**: a **separate location storing a copy of the return address** on each call. On return, the return address on the normal stack is **checked against the copy**; a mismatch means something is wrong.

Walking through nested calls `f1 → f2 → f3 → f4`, each `call` pushes the return address to **both** stacks, and each `ret` compares them. **The shadow stack must be placed by the compiler somewhere very hard for an attacker to read or write** — otherwise the attacker simply corrupts both copies.

## 6.6 The constraint that shapes all of these

> **These countermeasures run in production, so their performance overhead must be very low** — generally just a few percent.

That constraint explains nearly every design decision in this lecture: why ASLR is **segment-granular** rather than per-variable; why canaries are **not applied to every function** by default; why Full RELRO is **not** the default; and why CFI is often coarse-grained. **The strongest version of each defence exists — it is simply too slow to deploy.**

---

# Exam flags and lecturer emphasis

## Definitions to state exactly

1. **Memory safety** — protection against bugs relating to memory accesses, enforceable at compile time and/or runtime.
2. **Spatial vs temporal** — the right **place** vs the right **time**.
3. **Undefined behaviour** — the standard imposes no requirements; **the entire execution is invalid**, even if it appears to work.
4. **Trust boundary** — an interface between untrusted and trusted components **according to the threat model**; all data crossing must be **validated before use**.
5. **Fuzzing** — **injecting malformed input through a trust boundary** to trigger bugs.
6. **W⊕X** — no memory writable and executable at the same time.
7. **CFI** — control flow follows legitimate paths only; **forward edge** (function pointers, vtables) and **backward edge** (returns, via shadow stack).

## Quantitative and named facts

| Fact | Value |
|---|---|
| Share of Microsoft's and Google's security bugs from memory safety | **~70%** |
| C versus bounds-checked Python on a summation loop | **~70× faster** |
| Virtual address space on modern 64-bit CPUs | **up to ~128 TB** |
| Stack smashing first described | **1996** (Phrack) |
| Heartbleed | **CVE-2014-0160**, OpenSSL |
| Clang static analyser on the 3-bug program | **finds 1 of 3** |
| Default canary coverage | functions with a **`char` array > 8 bytes** |
| Runtime defence overhead budget | **a few percent** |
| Function call args (x86-64 SysV) | `%rdi`, `%rsi`, `%rdx`, **`%rcx`**, `%r8`, `%r9`; return in `%rax` |

## Mechanism → limitation pairs

| Defence | Limitation / bypass |
|---|---|
| **NX / W⊕X** | **Code reuse** — ret2libc and **ROP**, which is Turing-complete in practice |
| **ASLR** | **Segment-granular** — one pointer leak breaks the whole segment; needs **PIE** to cover the main binary |
| **Stack canaries** | **Same value for all calls** — one leak breaks it program-wide; only catches **contiguous** overflows |
| **Partial RELRO** (default) | Only part of the GOT protected; Full RELRO costs load time |
| **`_FORTIFY_SOURCE=2`** | May **break the program** |
| **Coarse-grained CFI** | Any function entry is a valid target |
| **Shadow stack** | Only as strong as the secrecy/protection of its location |
| **Static analysis** | False positives; **missed 2 of 3** bugs in the demo |
| **Dynamic analysis** | **Input-dependent coverage**; high overhead |
| **All of the above** | **Cannot guarantee the absence of bugs** |

## Counter-intuitive claims

- **C's unsafety is deliberate**, and buys performance, footprint, latency predictability, and the ability to write OS code.
- **A program in UB is buggy even when it appears to work** — the silent case is the dangerous one.
- **`strncpy` may leave the destination unterminated** — bounded ≠ safe.
- **`ptr = realloc(ptr, n)` leaks** on failure.
- **The format-string bug involves no overflow at all.**
- **The Heartbleed fix has two parts** — capping *and* zeroing.
- **`malloc` reuse is what makes use-after-free exploitable**, not the dangling pointer alone.
- **ASLR does not randomise within a segment.**

## Common traps

- **Do not** describe stack smashing without the direction: the stack **grows down**, but buffers are written **upward** into the return address.
- **Do not** confuse the **function calling convention** (`%rcx`) with the **syscall ABI** (`%r10`).
- **Do not** say a memory bug is "just a crash" — the silent cases are worse.
- **Do not** claim sanitisers or fuzzing prove correctness — coverage is input-dependent.
- **Do** remember `NULL` is address **0**, and that most OSes leave the first page unmapped — which is *why* it usually crashes.
- **Do** state that **unsigned** overflow wraps (defined) while **signed** overflow is **UB**.

## Links across the unit

- **§1.5 stack frames and `ret`** → Week 3's context switches and Week 4's kernel stack canaries.
- **§4.1 trust boundaries** → Week 4's syscall interface as *the* boundary, and Week 5's **compartment interface vulnerabilities** — the same idea applied inside one program.
- **§5.6 fuzzing** → Week 4's **syzkaller**, which fuzzes the syscall boundary.
- **§6.1 NX** ← Week 3's per-page permission bits; the PTE flag is what makes it enforceable.
- **§6.5 CFI** → Week 4's kernel CFI, and the hardware lectures' **PAC/BTI** and Intel **CET/shadow stack**.
- **§2.3 unsafety by design** → the hardware lectures' four-level memory-safety model, where MTE and CHERI are the hardware answers.

---

# Summary checklist

- [ ] Address space: private, sparse, ~128 TB; permissions enforced by the CPU on every access
- [ ] Life cycle: **OS loads the loader**, loader loads the binary, then the libraries
- [ ] Static memory (code, globals) vs dynamic (stack **down**, heap **up**); later JIT/module mappings
- [ ] `/proc/pid/maps`, `readelf -lSW`, `ldd`, `objdump --disassemble`
- [ ] ELF sections `.text`/`.rodata`/`.data`/`.bss`; `LOAD` headers carry R/RE/RW
- [ ] Calling convention: six argument registers, return in `%rax`, `call` pushes, `ret` pops
- [ ] Memory safety definition; the rules safe languages enforce and C omits
- [ ] **Unsafety by design** — four benefits it buys; **~70× speed** example
- [ ] The issue classes, incl. `NULL` = address 0 and the unmapped first page
- [ ] Why the compiler stays silent, and why real codebases breed these bugs
- [ ] **Spatial = right place; temporal = right time**; both break all of CIA
- [ ] **UB** — definition, examples, and that the **whole execution is invalid**
- [ ] **~70%** of Microsoft/Google security bugs
- [ ] Four exploits: infoleak (loop bound), tampering (adjacent globals), stack smashing (return address), UAF (allocator reuse + function pointer)
- [ ] Control-flow hijack → ret2libc → **ROP**, gadgets, **Turing-complete**
- [ ] **Trust boundary** definition; validate everything crossing, before use
- [ ] Sources: command line, stdin, env, disk/network I/O, IPC; the trust-model table
- [ ] Hardened command line: check `argc`, bound the copy, **terminate explicitly**
- [ ] **Format string** bug — no overflow; leaks pointers; breaks ASLR
- [ ] **Heartbleed** — attacker-controlled length; fix = **cap + zero**
- [ ] Sanitisation = data **and** control flow (ordering); avoid leaking references
- [ ] Complex-format software is disproportionately vulnerable
- [ ] Practices: track sizes, `sizeof`, signed overflow is UB, the unsafe-function table
- [ ] **`strncpy` does not terminate**; **`realloc` leak**; **`calloc` for untrusted contexts**
- [ ] Static: coverage + automation vs false positives, limited context, scale; `-Wall`/`-Wextra`/`-pedantic`
- [ ] **The 1-of-3 demonstration**
- [ ] Dynamic: **ASan**, **UBSan**, Valgrind (no recompile), **fuzzing = trust-boundary injection**, AFL workflow
- [ ] **No approach guarantees absence of bugs**
- [ ] **NX / W⊕X**; **ASLR** and the **same-segment** weakness; **PIE** as prerequisite
- [ ] **Canaries** — how, coverage flags, and the shared-value weakness
- [ ] **strip**, **RELRO** (partial/full, GOT), **`_FORTIFY_SOURCE`**, **`checksec`**
- [ ] **CFI** — forward (coarse vs fine, `endbr64`/Intel CET) and backward (**shadow stack**)
- [ ] Overhead budget of **a few percent** explains every weakened design
