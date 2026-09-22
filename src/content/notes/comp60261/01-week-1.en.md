---
subject: COMP60261
chapter: 1
title: "Week 1"
language: en
---

# COMP60261 — Week 1: Core Concepts and the C Language

**Scope:** unit organisation and assessment; the core security vocabulary the whole unit rests on — attack surface, CIA, trust and threat models, TCB, least privilege; and a working refresher on C, including pointers, dynamic allocation, and the standard library functions whose failure modes drive Week 2.

**Covers lectures:** 00 Logistics · 01 Core Concepts · 02 C: Introduction · 03 C: Pointers · 04 C: Dynamic Memory Allocation · 05 C: The Standard Library

---

# Part 1 — Unit organisation (Lecture 00)

The unit is in **two parts**, with different instructors:

| Part | Topic | Instructor |
|---|---|---|
| **Part 1** | **Systems Software Security** | Dr Pierre Olivier |
| **Part 2** | **Hardware Security** | Prof John Goodacre |

**Materials.** A **live lecture** each week, plus **a set of videos to watch after the lecture** (part 1 only). Everything — schedule, recordings, videos, slides, quizzes, lab briefs, discussion boards, reading list — lives on the unit's Canvas page.

**Assessment.**

- **Formative (not graded):** one **quiz per week** on Canvas, to validate your understanding after seeing the week's materials.
- **Summative (marked):** **four lab exercises** — three for part 1, one for part 2 — done on your own machine. **No lab sessions are timetabled.** Each exercise is worth **25% of the coursework mark**.
- **Final mark: 70% exam / 30% coursework.**

**Setup.** All programming exercises require a **Linux x86-64 environment**; the first lab's "required setup" page lists the options. The lecture stresses getting this working in week 1.

**On the code in slides.** Slides sometimes omit `#include`s and error-checking for space. **The downloadable versions are always fully working examples** — use those when running anything.

**Getting help**, in increasing order of urgency: the **support session** → the **discussion boards** (and **do not post answers** there) → **email only if genuinely urgent**.

> **Worth acting on:** the lecture's own advice is to **start each lab exercise at least two weeks before its deadline**. With no timetabled lab sessions, the scheduling is entirely yours to manage.

---

# Part 2 — Systems security: core concepts (Lecture 01)

## 2.1 What computer security is now about

**Historically**, computer security focused on the **physical machine** — preventing **theft of or damage to the hardware**.

**Today the value of data is greater than the value of hardware**, so the focus has shifted to **information security**: preventing theft of or damage to the **information stored, processed or transmitted** by the computer, and preventing **disruption of service**.

**Systems security** is then:

> The practice of safeguarding computer systems against **unauthorised access, modification, or disruption**.

Note that those three map exactly onto **confidentiality, integrity and availability** — the triad is embedded in the definition itself.

**Two components, deliberately taught together:**

- **Software security** — protecting applications and systems software against vulnerabilities and their exploitation.
- **Hardware security** — protecting CPU, memory and devices against attacks.

> **Exam flag.** The lecture insists these are **heavily intertwined**: software **makes assumptions about hardware** and **controls it**, and there are **cross SW/HW attacks**. This is the stated justification for the unit's two-part structure — and it is exactly what Meltdown and Spectre demonstrate, where a hardware behaviour invalidates a software isolation guarantee.

## 2.2 Ariane 5 — why this matters

- **4 June 1996:** the first flight of the ESA **Ariane 5** rocket.
- It goes off track and **disintegrates 40 seconds after lift-off**.
- **Root problem: a 16-bit signed integer overflow.**
- The code had been **written for Ariane 4**, making assumptions that **no longer held** for Ariane 5.
- The computation **was not even doing anything useful after lift-off**.
- **Cost: $370M.**

> **Exam flag — high value as an opening example.** Every element is instructive. The bug was **an integer overflow** — the same class Week 2 revisits as undefined behaviour. The cause was **inherited assumptions that silently stopped holding**, not a coding error in the ordinary sense. And the failing code was **doing nothing useful**, which is the purest possible illustration of the Week 4 principle that **unused functionality is still attack surface**. It is also a reminder that this material predates any adversary: correctness failures and security failures share the same root.

**The broader case:** our world is massively computerised, so the **impact of cyberattacks is huge** (service disruption, financial losses); computer systems are **increasing in complexity**, and so are the chances of vulnerabilities; and **threats and attack vectors are evolving**.

## 2.3 Attack surface — vulnerabilities at every layer

Designers introduce **bugs**; some of those bugs are **security vulnerabilities** exploitable to mount attacks. Crucially:

> **Vulnerabilities can be present at every level of the SW/HW stack.**

The lecture gives one named example per layer, and the set is worth learning as a table:

| Layer | Example | What happened |
|---|---|---|
| **Application** | **Apache Struts, CVE-2017-5638** — the **Equifax breach, 2017** | Web application **parser** vulnerability; a malicious request allows **remote code execution** and complete server takeover |
| **Library / supply chain** | **NodeJS `event-stream`, 2018** | An attacker **took over the library's repository** and released a **malicious version**; the library was used extensively, and the malicious version was designed to **steal from crypto wallet software** |
| **OS / kernel** | **Linux CVE-2016-5195 — "Dirty CoW"** | A normal user exploits a **race condition** to gain write access to **read-only memory mappings** and escalate to administrator; used to root Android phones |
| **Hypervisor** | **Xen CVE-2014-7188** | A **read-mode overflow in the interrupt controller emulation** lets a VM **leak data from the hypervisor or other guests**; the patch required an **emergency forced reboot of ~10% of AWS EC2** |
| **Hardware** | **Spectre / Meltdown** side channels | **Speculative execution** can be tricked into leaking data from processes and the kernel; microcode and software countermeasures cost performance |

> **Exam flag.** This table is the map of the entire unit. Each row is a later week: applications and libraries → Weeks 1–2 and Week 5; the kernel → Weeks 3–4; the hypervisor → Week 6; hardware → the hardware lectures. If asked to justify studying the whole stack, cite the row structure.
>
> Two rows repay extra attention. **`event-stream`** is a **supply chain** attack — the vulnerability was not in code anyone wrote but in **who was trusted to publish it**, which is precisely the argument Week 5 opens with. And **Xen CVE-2014-7188** is worth remembering for the **~10% of EC2** figure: it quantifies what "the hypervisor is the only boundary between tenants" actually costs when it fails.

## 2.4 Why vulnerabilities are unavoidable

Software and hardware used in production is **increasingly complex**:

- The **Linux kernel v6.12 has 26M lines of code**.
- An **Apple Silicon M3 Max SoC has 92 billion transistors**.

From which:

- **There is no way to prove this software/hardware is entirely correct.**
- **In fact it is likely not** — designers and engineers are human, they make mistakes, and they introduce **bugs**.

Those bugs have two kinds of consequence: **instability and crashes**, and **security vulnerabilities** — where the defining property is that they are

> **mostly silent under normal operation** — hence hard to detect — **but when triggered in a certain way, allow an attacker to do something bad.**

> **Exam flag.** That sentence is the bridge into Week 2's central claim about undefined behaviour: **the dangerous bug is the one that appears to work.** Silence under normal operation is what lets a vulnerability survive in production for years.

## 2.5 The attacker's objectives

Three, and they map cleanly onto the triad:

- **Read what they are not supposed to read** — sensitive data such as **passwords or crypto keys**, or information about the target system (e.g. **open ports**) to **enable further attacks**.
- **Write what they are not supposed to write** — **corrupt sensitive data structures to escalate privilege**, inject malicious code and data, **forge access tokens**, **escape detection**.
- **Control what they are not supposed to control** — **disturb operation** (denial of service), or **execute code to enable further attacks**.

> Note the recurrence of *"to enable further attacks"*. Reconnaissance and privilege escalation are **steps**, not ends — which is why an apparently minor information leak matters. Week 2's format-string leak and Week 4's kernel pointer leak are both exactly this.

## 2.6 The CIA triad, and identity

| Property | Prevents | Example mechanisms |
|---|---|---|
| **Confidentiality** | **Unauthorised disclosure** of sensitive information | Encryption, access control, secure deletion |
| **Integrity** | **Unauthorised tampering** with sensitive information | Checksum verification, digital signatures (keys) |
| **Availability** | **Disturbances to the operation** of a system | DoS protection, redundancy/replication, backups |

**And a fourth concept the lecture adds: identity** — *how can we make sure an actor is who they claim to be?* (e.g. passwords, certificates).

> **Exam flag.** The lecture makes the connection by **underlining "unauthorised"** in the first two definitions. Confidentiality and integrity are defined in terms of **authorisation**, and authorisation presupposes **knowing who is asking** — so identity is not a fourth item on the list but a **precondition for two of the three**. Availability is the odd one out: it makes no reference to authorisation at all, which is why it behaves differently throughout the unit (and why TEEs and compartmentalisation both give up on it).

## 2.7 Trust models, TCB, and threat models

**Trust model** — reasoning about **what components of a computer system are trusted versus not trusted**. The lecture works through an **IaaS (renting VMs in the cloud)** example, and draws the essential conclusion:

> **Trust models vary depending on which actor and which scenario are considered.**

The same system yields a different model from the provider's point of view than from a tenant's. There is no single "the" trust model.

**Trusted Computing Base** — the set of software and hardware components **critical to the security of the system**, which are **assumed to be working correctly** to maintain the target guarantees. The TCB should be:

- **As minimal as possible**, to make it easy to secure; and
- **Isolated** from non-critical components, since those are not trusted.

In the IaaS example, from the **cloud provider's** point of view the TCB includes **the hardware and the host systems software** — hypervisor, host kernel, firmware, boot process.

**Threat model** — a **series of assumptions about what the attacker can and cannot do.**

> **Exam flag.** Three distinct things, often conflated. **Trust model** = who is trusted. **TCB** = the components whose correctness is assumed. **Threat model** = what the adversary is capable of. The TCB's two requirements — **minimal** *and* **isolated** — are both examinable, and the second is the one usually forgotten: a small TCB that anything can tamper with is not a TCB.

## 2.8 Isolation approaches

Isolating components is what enforces the target trust model, and the lecture names three shapes:

| Approach | Meaning | Examples given |
|---|---|---|
| **Sandboxing** | Isolate the rest of the system **from** an untrusted component | Processes/VMs isolated by an OS/hypervisor; web pages from different sites isolated in different browser tabs |
| **Safeboxing** | Isolate a **security-critical** component from the rest | A **crypto library** isolated inside a web browser; code manipulating **passwords** in a password manager |
| **Mutual distrust** | Both sides distrust each other | **TEEs** — enclaves and confidential VMs distrust the OS/hypervisor, which in turn distrusts them |

> **Exam flag — high value.** This is **the same taxonomy** that returns in **Week 5** as compartmentalisation's three trust models, and the TEE row is exactly **Week 4**'s trust model. Learning the vocabulary properly here means two later weeks cost nothing. Remember the **direction**: sandbox protects the system *from* the component; safebox protects the component *from* the system.

## 2.9 The principle of least privilege

> **Actors (processes, users, etc.) in a system should only be granted the minimum permissions required to perform their duty correctly.**

**Why:** it **limits the damage that can be done should this actor be subverted by an attacker.**

**Origin:** introduced in the seminal 1975 paper ***The Protection of Information in Computer Systems*** by **Saltzer and Schroeder**.

**Applied extensively** — the examples are everywhere: **privilege levels of execution on the CPU**; **access control** (user-based file permissions, app permissions on mobile systems); using **`sudo` only for the operations that require root**.

**And the honest caveat:**

> It is **hard to fully apply in practice**: for **complexity or performance** reasons, components often end up **overprivileged**.

> **Exam flag.** PoLP plus that caveat is the single most reusable idea in the unit. Nearly every later mechanism is an attempt to apply it against those two pressures — privilege rings, seccomp, MAC, capabilities, compartmentalisation, unikernels. And nearly every limitation discussed later is complexity or performance winning.

---

# Part 3 — C: the essentials (Lecture 02)

## 3.1 Why C, and its trade

C was **designed in the 1970s** and remains in the **top 10 of most popularity rankings**. An enormous amount of widely used software is written in it: operating systems (Linux, macOS), web servers, databases, hypervisors (Xen), language runtimes (Perl, Python), and everyday tools such as Git.

What that software has in common is that it is **systems software** — **low-level software interacting closely with the hardware**.

| Pros | Cons |
|---|---|
| **Low-level** — close to the hardware, lots of freedom to manipulate the machine | **Programmer freedom comes at a cost: a large area for making mistakes** |
| **Fast, low memory footprint** | **Lack of memory safety**, risks of **undefined behaviour** at runtime |
| **Portable** — compilers exist for every modern architecture | |
| Established a **popular syntax**, reused by Java, C++ and others | |

Still extensively used in **systems software, high performance computing, and embedded systems**.

> **Exam flag.** The pros/cons framing here is the seed of Week 2's "unsafety by design" argument. The freedom that makes C suitable for OS development is **the same property** that makes memory-safety bugs possible. They are not separable.

## 3.2 Compilation and warnings

C is a **compiled** language: source text must be translated into an executable binary.

```bash
gcc hello.c -o hello
./hello
```

The compiler **performs checks and may emit warnings and errors**. **Errors are unrecoverable and stop compilation; warnings are not.** Fix them **in the order the compiler emits them** — later messages are often consequences of earlier ones.

> **The unit's explicit expectation: all code you produce should compile without any warning or error.** Week 2 makes the security case for this, adding `-Wall`, `-Wextra` and `-pedantic`.

## 3.3 Variables and types

Variables have a **name**, a **type** and a **value**, and **must be declared before being used**.

**Types have two functions** — both examinable:

1. Help the compiler **check the validity of operations** on variables.
2. Define **how much memory is allocated** for variables.

**Three basic types:** integers, floating-point numbers, characters.

**Qualifiers** `long`/`short` request larger/smaller storage; **`unsigned`** indicates a variable will hold only non-negative values.

> **Storage size for a given type depends on the architecture — use `sizeof` to get the exact size on a given machine.**

On x86-64:

| Type | Bytes |
|---|---|
| `short int` | 2 |
| `int` | 4 |
| `unsigned int` | 4 |
| `long int` | 8 |
| `long long int` | 8 |
| `float` | 4 |
| `double` | 8 |

> **Exam flag.** "Sizes are architecture-dependent, so use `sizeof`" is stated here and reappears as a **secure coding practice** in Week 2 (§ integer overflows). Hard-coding `4` for an `int` is both a portability bug and, in size arithmetic, a security bug.

## 3.4 printf

Takes a **format string** plus optionally a list of variables whose values replace markers in it. Common markers: **`%d`** signed integer, **`%u`** unsigned, **`%f`** float, **`%c`** character, with the **`l` prefix** for `long`s and `double`s.

> Note for later: the fact that **the format string is interpreted** is exactly what makes an attacker-controlled format string dangerous — the format-string vulnerability in Week 2.

## 3.5 Arrays and strings

- Array **indexes start at 0**.
- Multi-dimensional arrays are supported, with one bracket pair per dimension.
- **There is no string type in C — strings are arrays of characters**, and to be valid **must end with the `\0` termination character**.

> **Exam flag.** Two consequences follow immediately, and both cause real bugs. **(1)** When declaring an array to hold a string, **you must allow space for the content *plus* the terminator**. **(2)** Because the length is not stored, **the terminator is the only thing marking where the string ends** — which is why Week 2's `strncpy` trap (it may not terminate) and Heartbleed (a length supplied separately from the data) are both so damaging.

**Arrays are laid out contiguously in memory** — for a 4-element `int` array on x86-64, four 4-byte slots back to back.

> That contiguity is not just an implementation detail. **It is what makes buffer overflows reach anything useful** — as Week 2's tampering example shows, where overflowing one global lands squarely in the next.

## 3.6 Conditionals, functions, loops

Standard `if` / `else if` / `else`, where a condition is **true when it evaluates to something other than 0**. Functions are declared with a return type, name and typed parameters. Loops: `for`, `while`, and `switch`/`case` — **ending each case with `break`** to leave the switch body.

## 3.7 Command line parameters

Handled through `main`'s parameters: **`argc`** (the number of parameters) and **`argv`** (the parameters themselves, as an array of strings).

> **Exam flag.** **The first parameter is always the name of the program being executed, so `argc` is at least 1.** This is why Week 2's hardened example checks `argc != 3` rather than `argc != 2` for a two-argument program — and why indexing `argv[1]` without checking `argc` is a null-pointer dereference waiting to happen.

## 3.8 Custom types and data structures

**`typedef`** creates an alias for a type — useful for shortening verbose ones.

**`struct`** aggregates primitive types into a custom data structure; fields are accessed with the **`.`** operator. Combining the two (`typedef struct { … } name;`) avoids writing `struct` everywhere.

**Memory layout:**

> **The fields of an instance of a custom data structure are laid out in memory contiguously and in the order declared.**

For a struct of `char name[10]`, `float size`, `int weight` on x86-64: **10 bytes, then 4, then 4**.

> **Exam flag.** "Contiguous and in declaration order" is what makes Week 2's use-after-free exploit work — the attacker knows **exactly where** the function pointer sits within the reallocated chunk. (In real code, note that compilers may insert **padding** for alignment, which is separately the source of the kernel infoleaks discussed in Week 4.)

---

# Part 4 — Pointers (Lecture 03)

## 4.1 Addresses and pointers

> **An address is a location in memory.** The address of a variable is **the first byte holding that variable**. Obtain it with the **`&`** operator.

> **A pointer is a variable whose value is an address.**

Declared with **`*` preceded by the type of data it references** — e.g. `int *`. The pointed-to content is accessed by **dereferencing** with the **`*`** operator.

```c
int x = 42;
int *ptr = &x;         // ptr points to x
printf("%d\n", *ptr);  // dereference: prints 42
```

## 4.2 C passes arguments by value

> **C passes arguments by value: a copy of each parameter's value is made at the time a function is called.**

The demonstration is a naive swap:

```c
int swap(int a, int b) { int tmp = a; a = b; b = tmp; }
/* ... */
swap(x, y);   // x and y are UNCHANGED
```

**Why it fails:** the call copies the *values* of `x` and `y` into `a` and `b`, which live in **`swap`'s own stack frame**. The swap happens to the copies, which are discarded when `swap` returns.

**The fix — passing references:**

```c
int swap(int *a, int *b) { int tmp = *a; *a = *b; *b = tmp; }
/* ... */
swap(&x, &y);  // now the values really are swapped
```

Now the **addresses** are copied, so dereferencing reaches **main's** memory.

> **Exam flag — high value.** "C passes by value" is *the* fact that makes pointers necessary rather than optional. It also explains why pointer parameters are so pervasive in C APIs — and therefore why so many trust boundaries in Week 2 and Week 4 involve **a pointer supplied by an untrusted caller**.

## 4.3 What pointers are used for

Three stated purposes:

- **Have a function modify its calling context** (the swap example).
- **"Return" more than one single value** — e.g. a function computing both a product and a quotient writes them through two pointer parameters, and reserves its actual return value for an **error code**.
- **Avoid costly data copies** for arrays and large data structures — **a pointer is just 8 bytes on modern 64-bit architectures**, so passing one is far cheaper than copying a large object.

## 4.4 C arrays are pointers

> **The variable representing an array is a pointer to the first byte of the array in memory.**

So a function that operates on an array takes a **pointer** — and, critically:

> it **also needs the size** to iterate properly.

Inside the function the pointer can be indexed with square brackets exactly like an array: **`ptr[i]` is equivalent to `*(ptr + i)`**.

> **Exam flag — the origin of an entire bug class.** Because the array **decays to a pointer** and the size **must be passed separately**, the two can disagree — and nothing in the language notices. That is the root of Week 2's whole spatial-safety story, and the reason "keep track of the sizes of arrays and buffers yourself" is the first secure coding practice listed.

## 4.5 Pointers to structs

With a pointer to a struct, access a field either by **dereferencing then using `.`** — **`(*ptr).x`**, where **the parentheses are required because of operator precedence** — or with the shortcut **`ptr->x`**, which does both.

## 4.6 Pointer chains

**A pointer is itself a variable and has its own address, so it can be pointed to.** Hence `int *`, `int **`, `int ***` — chains of memory locations linking to one another.

## 4.7 Function pointers

A special kind of pointer: instead of the address of **data**, it holds the address of **machine code** — specifically **the address of the first byte of the pointed function's machine code**.

```c
void (*func_ptr)(char *);   // returns void, takes a char *
func_ptr = greet_v1;        // assign by using the function's name
func_ptr(username);         // call through the pointer
```

> **Exam flag.** Function pointers are **writable data that determine where execution goes**. That is precisely why they are a prime target: Week 2's use-after-free exploit overwrites one, and Week 2's **forward-edge CFI** exists specifically to constrain calls made through them.

---

# Part 5 — Dynamic memory allocation (Lecture 04)

## 5.1 Why it is needed

So far everything has used **static** allocation — **the allocation size is known at compile time**, so the compiler handles it automatically. The question is what to do when **the size is not known until runtime**.

**The tempting wrong answer** is a variable-size array:

```c
void process_array(int size) {
    int arr[size];   // variable-size array — generally poor practice in C
    /* ... */
}
```

**Why it is bad:** as a local variable it lives **on the stack**, and **the stack has a very small size — just a few megabytes**. If the user supplies a large enough number, **the stack overflows and the program crashes**.

## 5.2 `malloc` and `free`

```c
void *malloc(size_t size);
```

Takes the **number of bytes** to allocate and returns:

- **a pointer to the allocated space** if the allocation succeeded, or
- **`NULL` if it failed**.

Three properties the lecture stresses:

- **`malloc` never guarantees that an allocation will succeed** — it depends on the free memory available on the machine **at the time of the allocation**.
- It returns a **generic pointer (`void *`)**, which can be **cast to any other pointer type** — i.e. **`malloc` allocates memory that can hold any type**.
- **Memory allocated with `malloc` must be released explicitly** by the programmer, with **`free`**, taking the pointer that `malloc` returned.

**The canonical pattern:**

```c
int *arr = (int *)malloc(size * sizeof(int));
if (arr == NULL) {                 /* ALWAYS check */
    printf("ERROR: cannot allocate memory\n");
    exit(-1);
}
for (int i = 0; i < size; i++) arr[i] = i * i;
free(arr);                         /* release when done */
```

> **Exam flag.** Note the **`size * sizeof(int)`** idiom — you request **bytes**, not elements. Week 2 returns to exactly this expression as an **integer overflow** risk, and recommends `calloc`, which checks the multiplication. Note also the **cast** of the `void *` return, and the **unconditional NULL check**.

## 5.3 Memory leaks

Forgetting to `free` means the memory is **never released** — and once the pointer goes out of scope, it **can never be released**.

> **Leaks are a security issue: they can be exploited by an attacker to crash your program or starve the machine of resources.**

That framing matters: a leak is an **availability** vulnerability, not merely untidiness.

**Valgrind** detects them:

```bash
gcc -g my-leaky-program.c -o my-leaky-program    # -g embeds debug info
valgrind --leak-check=full ./my-leaky-program
```

It reports how many bytes are **definitely lost**, in how many blocks, and **the call path that allocated them** — enough to fix the leak directly.

> **The unit's expectation is explicit: use Valgrind to check for leaks in all the C code you produce, and your code should be free of them.** Week 2 adds that sanitisers now detect leaks too, but **Valgrind needs no recompilation**, which keeps it useful.

---

# Part 6 — The C standard library (Lecture 05)

## 6.1 What libc is

A **library of pre-written functions for many low-level tasks** — `printf` for console output, `malloc` for allocation, and much more. These are **essential utilities standardised across compilers and operating systems for portability**.

**Key areas and their headers:**

| Area | Header |
|---|---|
| Input/output | `stdio.h` |
| Memory management | `stdlib.h` |
| String and memory manipulation | `string.h` |
| Mathematical functions | `math.h` |
| File handling | `fcntl.h`, `unistd.h` |
| Time and date | `time.h` |

> The lecture is explicit that it focuses on **I/O and memory/string manipulation functions because they have security implications** — i.e. this section exists to set up Week 2.

## 6.2 String copy

```c
char *strcpy(char *dest, const char *src);
char *strncpy(char *dest, const char *src, size_t n);
```

**First, a distinction that catches people out:**

```c
char *string1 = "hello";
char *string2 = string1;   // this is NOT a string copy
```

That assignment **copies the pointer**, so both variables point at **the same string in memory**. A real copy requires `strcpy` into a buffer with enough space.

**And the danger:** `strcpy` is **not safe when the source string is larger than the destination buffer** — **it blindly copies the entire source string and overflows the destination**. `strncpy` lets you pass the destination buffer's size as a bound.

> **Exam flag.** "`strcpy` copies until it finds the source's terminator, regardless of the destination's size" is the mechanism behind **three of Week 2's four worked exploits**. Learn it as a mechanism, not a rule.

## 6.3 String concatenation

```c
char *strcat(char *dest, const char *src);
char *strncat(char *dest, const char *src, size_t n);
```

After the call, the destination contains the original destination **followed by** the source. **The destination buffer must have space for the original characters, plus the source's, plus one terminator.**

The safer form, and the arithmetic worth memorising:

```c
strncat(s2, world, 32 - strlen(s2));
```

— the **size of the destination buffer minus the number of characters already in it**, obtained with `strlen`.

> **Exam flag.** Note that this bound is **"how many more characters may be appended"**, not the total buffer size. Passing `sizeof(dst)` here is the classic `strncat` bug that Week 2 flags.

## 6.4 Copying memory

```c
void *memcpy(void *dest, void *src, size_t n);
```

Copies **`n` bytes** from source to destination. Preferable to a hand-written loop because it is **highly optimised for speed**, and both parameters are **`void *`**, so they can point at anything.

Typical use — copying an array of structs, exploiting the fact that arrays are contiguous:

```c
memcpy(array2, array1, array_size * sizeof(mystruct));
```

## 6.5 Console input

```c
char *fgets(char *s, int size, FILE *stream);
int scanf(const char *format, ...);
```

- **`fgets`** takes the destination buffer, **the maximum number of characters to write**, and a stream (`stdin` for the console).
- **`scanf`** takes a format string describing the expected input, followed by **the addresses of the variables to fill** — hence the `&`.
- Use **`%lf` for `double`** and **`%f` for `float`**.

> **Exam flag.** `fgets` takes a size; **`scanf` with a bare `%s` does not**. That asymmetry is why Week 2's unsafe-function table pairs `scanf` with "`fgets` + `sscanf` with width specifiers". Also note that `scanf` needing **addresses** is a direct application of §4.2: C passes by value, so a function that must fill your variable needs its address.

## 6.6 Finding out more — the manual

Beyond online references, the **manual pages** are integrated into the command line:

```bash
man <function name>
```

which gives the function's **prototype**, the **headers to include**, a **description of the parameters and behaviour**, and the **return values on success and error**.

> **Worth internalising as a habit.** Week 2's `strncpy` termination trap and `realloc`'s failure semantics are both **documented in the man page** and both routinely missed. On these functions the manual is authoritative and short.

---

# Exam flags and lecturer emphasis

## Definitions to state exactly

1. **Systems security** — safeguarding systems against **unauthorised access, modification, or disruption**.
2. **The CIA triad**, with **identity** as the precondition for the first two.
3. **Trust model** vs **TCB** vs **threat model** — three different things.
4. **The TCB's two requirements** — **minimal** *and* **isolated**.
5. **Sandboxing / safeboxing / mutual distrust**, with the direction of protection in each.
6. **PoLP** — minimum permissions to perform the duty correctly; **Saltzer and Schroeder, 1975**; **limits damage if the actor is subverted**.
7. **A pointer** — a variable whose value is an address.
8. **C passes arguments by value.**

## Named facts and figures

| Fact | Value |
|---|---|
| Ariane 5 | **4 June 1996**, disintegrated **40 s** after lift-off, **16-bit signed integer overflow**, code inherited from **Ariane 4**, **$370M** |
| Equifax breach | **Apache Struts CVE-2017-5638** (2017) |
| Supply chain example | **NodeJS `event-stream`** (2018) |
| Dirty CoW | **Linux CVE-2016-5195** — race condition, privilege escalation |
| Xen | **CVE-2014-7188** — forced reboot of **~10% of AWS EC2** |
| Linux kernel v6.12 | **26M lines of code** |
| Apple M3 Max SoC | **92 billion transistors** |
| PoLP origin | **Saltzer & Schroeder, 1975** |
| Assessment split | **70% exam / 30% coursework**; 4 labs at 25% of coursework each |
| Pointer size, 64-bit | **8 bytes** |
| Stack size | **just a few megabytes** |

## C facts that become security facts later

| Week 1 fact | Where it bites |
|---|---|
| Strings are char arrays ending in `\0`; length is not stored | `strncpy` non-termination, Heartbleed |
| Arrays are laid out **contiguously** | Overflow into the adjacent variable (Week 2 tampering) |
| Struct fields are contiguous **and in declaration order** | Use-after-free targeting a function pointer |
| **Arrays decay to pointers; the size must be passed separately** | The entire spatial-safety bug class |
| **C passes by value** | Why untrusted callers supply pointers everywhere |
| Function pointers hold **code** addresses | Control-flow hijack targets; forward-edge CFI |
| `sizeof` is architecture-dependent | Size arithmetic and integer overflow |
| `argv[0]` is the program name, so **`argc` ≥ 1** | Off-by-one in argument validation |
| **`malloc` never guarantees success** | Unchecked `NULL` dereference |
| Format strings are **interpreted** | Format-string vulnerabilities |
| Leaks starve the machine | An **availability** vulnerability |

## Common traps

- **Do not** conflate trust model, threat model and TCB.
- **Do not** give only "minimal" for the TCB's requirements — **isolated** too.
- **Do not** describe `char *b = a;` as a string copy.
- **Do not** forget the terminator when sizing a buffer for a string.
- **Do not** pass `sizeof(dst)` as `strncat`'s bound — it is **remaining** capacity.
- **Do** remember `(*ptr).x` needs parentheses, and `ptr->x` is the shortcut.
- **Do** state that PoLP is **hard to apply** — components end up **overprivileged** for complexity or performance reasons.

## Forward links

- **§2.3 the attack-surface table** → the structure of the whole unit, one row per later week.
- **§2.7 TCB** → Week 3's reference-monitor triple (mediate, be correct, be tamper-proof).
- **§2.8 sandbox/safebox/mutual distrust** → **Week 5**'s compartmentalisation trust models, verbatim; and **Week 4**'s TEEs.
- **§2.9 PoLP** → privilege rings (Week 3), seccomp and MAC (Week 4), compartmentalisation (Week 5), unikernels (Week 6).
- **§3.5, §4.4 arrays and pointers** → Week 2's spatial safety.
- **§4.7 function pointers** → Week 2's use-after-free exploit and CFI.
- **§5.2 `malloc`** → Week 2's `calloc`/integer-overflow practice.
- **§6.2–6.5 libc** → Week 2's unsafe-function table.

---

# Summary checklist

- [ ] Unit structure, **70/30** split, 4 labs at 25% each, start labs **2 weeks ahead**
- [ ] Security has moved from **protecting hardware** to **protecting information**
- [ ] Systems security = unauthorised **access, modification, disruption**; SW and HW **intertwined**
- [ ] **Ariane 5** — all five details, and why each one is instructive
- [ ] **Vulnerabilities at every layer**, with the named example for each
- [ ] **26M LoC**, **92B transistors** — correctness cannot be proved
- [ ] Vulnerabilities are **silent under normal operation**
- [ ] Attacker objectives: **read / write / control**, and "to enable further attacks"
- [ ] **CIA**, with mechanisms; **identity** as the precondition for C and I
- [ ] **Trust model** (varies by actor), **TCB** (minimal + isolated), **threat model**
- [ ] **Sandboxing / safeboxing / mutual distrust** with examples and directions
- [ ] **PoLP** — definition, purpose, 1975 origin, and why it is hard to apply
- [ ] C's pros and cons; why the freedom and the unsafety are the same property
- [ ] Compilation; **errors stop, warnings do not**; fix in order; **zero warnings expected**
- [ ] Types: **two functions**; `sizeof`; the x86-64 size table
- [ ] Arrays from 0; **strings are char arrays + `\0`**; contiguous layout
- [ ] `argc` **≥ 1** because `argv[0]` is the program name
- [ ] Structs: fields **contiguous and in declaration order**
- [ ] **Address** vs **pointer**; `&` and `*`
- [ ] **C passes by value** — the swap example, and the pointer fix
- [ ] Pointer uses: modify caller's context, return multiple values, avoid copies
- [ ] **Arrays are pointers**; `ptr[i]` ≡ `*(ptr+i)`; **the size must travel separately**
- [ ] `(*ptr).x` vs `ptr->x`; pointer chains
- [ ] **Function pointers** hold the address of machine code
- [ ] Variable-size arrays overflow the **few-MB** stack
- [ ] `malloc` — bytes not elements, **may fail**, returns `void *`, **always check**
- [ ] `free`, and leaks as a **security** issue; **Valgrind** with `-g`
- [ ] libc areas and headers; why the focus is on string/memory/IO
- [ ] `strcpy` overflows by design; `strncpy`; **pointer assignment is not a copy**
- [ ] `strncat`'s bound = **remaining** capacity
- [ ] `memcpy` and `n = count * sizeof(type)`
- [ ] `fgets` bounds, `scanf` takes **addresses**, `%lf` vs `%f`
- [ ] **`man <function>`** for prototype, headers, behaviour, return values
