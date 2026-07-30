---
subject: COMP60261
chapter: 2
title: "Chapter 2 Exam Questions - Fable 5"
language: "en"
---

# COMP60261 — Chapter 2 Exam Questions

**Author:** Fable 5
**Scope:** A brief introduction to C, and the memory-safety properties C deliberately does not provide.

**Assumed platform for every calculation below: x86-64 Linux (LP64), compiled without `__attribute__((packed))`.**

| Type | Size | Alignment |
|---|---|---|
| `char` | 1 | 1 |
| `short` | 2 | 2 |
| `int` | 4 | 4 |
| `float` | 4 | 4 |
| `long` | 8 | 8 |
| `double` | 8 | 8 |
| any pointer | 8 | 8 |

> **A note on how this set differs from the others.** Some practice sets tell you to "ignore padding". Real compilers do not, and the difference is examinable: in Question 8 the naive answer is 1400 bytes and the correct answer is 1600 bytes. Every size, offset and address in Part 2 was computed under the real x86-64 alignment rules and independently verified against `ctypes` structure layouts, which apply the same natural-alignment ABI.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1 — Memory safety, and why C omits it

**Q:** Define *memory safety*. State the two sub-classes of memory safety and give one violation belonging to each. Then explain why the absence of these checks in C is **not** considered a defect in the language specification.

**Answer & Explanation:**

**Definition.** Memory safety is protection against certain classes of bug relating to memory accesses in a program. The protection can be enforced at compile time, at runtime, or both.

**The two sub-classes:**

| Sub-class | Requirement | Example violation |
|---|---|---|
| **Spatial** memory safety | Accesses stay **within the bounds** of the addressed object | Buffer overflow, out-of-bounds array index, underflow such as `arr[-1]` |
| **Temporal** memory safety | Memory is accessed only while it is **still valid** | Use-after-free, dangling pointer, reading uninitialised memory |

The compact form worth memorising: **spatial safety is accessing memory at the right place; temporal safety is accessing it at the right time.**

**Why the omission is deliberate.** The lack of safety checks in C and C++ is not an error in the specifications — the unsafety is *required* to deliver the properties these languages are chosen for:

1. **Maximum performance** — no runtime checks on bounds, pointer validity or type correctness. Summing 100 million integers in C versus an equivalent bounds-checked Python loop makes the C version roughly **70× faster**.
2. **Low, controllable memory footprint** — no garbage collector and no per-object runtime metadata.
3. **Predictable latency** — no GC pauses, which is what real-time systems need.
4. **The ability to access arbitrary regions of the address space** — without which you cannot write an OS kernel, a hypervisor, or a device driver.

**Why this framing matters in an answer.** Because the trade is deliberate, "just be more careful" is not a solution. That is precisely why the discipline splits into three separate activities: adhere to good coding practices, use tools to detect bugs before shipping, and deploy runtime defences in production — and why the honest caveat is that **none of the existing practical approaches can guarantee the absence of bugs.**

---

### Question 2 — String representation and the NUL terminator

**Q:** How is a string represented in C? Name the character that must terminate it. Then explain the **two distinct** vulnerability classes that arise when that terminator is missing, and say which direction (read or write) each one is.

**Answer & Explanation:**

**Representation.** A C string is a contiguous array of `char` whose end is marked by the **NUL terminator `'\0'`** (the byte `0x00`). The length is *not* stored anywhere — C attaches no size metadata to arrays or buffers, so every library function must discover the end by scanning for that zero byte. This is why the coding guidance is that **you must keep track of buffer sizes yourself**: you need the size both to know when to stop iterating and to know the maximum number of bytes you may copy.

**Consequence 1 — out-of-bounds *read* (information disclosure).** Functions that consume a string — `printf("%s", …)`, `strlen`, `puts` — walk forward until they find a zero byte. With the terminator missing they walk *past* the end of the buffer into whatever happens to be adjacent in memory, and `printf` copies those bytes to standard output. If the neighbouring object is a secret, the secret is disclosed. This is the mechanism of the infoleak in Question 16, and it is why `strlen` — not itself an unsafe function — must never be called on an untrusted or possibly unterminated buffer.

**Consequence 2 — out-of-bounds *write* (buffer overflow).** Functions that *produce* a string, principally `strcpy`, copy source bytes until they read a `'\0'` **in the source**, with no regard for the size of the destination. An unterminated or attacker-chosen source therefore keeps writing past the end of the destination — over adjacent variables (Question 18), or over the saved return address, which turns a data bug into control-flow hijacking.

**The discriminator to state.** The read case costs you **confidentiality**; the write case costs you **integrity** and, via control-flow hijacking, the ability to run attacker-chosen code. Both are spatial violations; they differ only in direction.

---

### Question 3 — `argc`, `argv`, and the command line as a trust boundary

**Q:** Given `int main(int argc, char **argv)`, explain what `argc` and `argv` hold, why `argc` is always at least 1, and why a program must inspect `argc` before it touches `argv[1]`. Then state the three sanity checks appropriate to this interface.

**Answer & Explanation:**

* **`argc`** — the argument count: the number of command-line tokens passed to the program.
* **`argv`** — the argument vector: an array of pointers to NUL-terminated strings, one per token. By the standard, `argv[argc]` is itself a `NULL` pointer, which is what lets a program walk the vector without knowing `argc`.
* **Why `argc >= 1`:** `argv[0]` holds the name or path used to invoke the program, so even with no user-supplied arguments the count is 1.

**Why `argc` must be checked first.** If the program is run with no arguments, `argv[1]` is the `NULL` terminator of the vector. Passing it to `strcpy` or `printf("%s", …)` dereferences address 0. Since `NULL` is encoded as 0 and **most operating systems deliberately leave the first page of the address space unmapped**, this normally crashes with a segmentation fault — an **availability** failure. The dangerous case is the other one: if something *is* mapped at that address, the dereference silently succeeds and the program misbehaves without any signal that it went wrong.

**The three checks at this boundary.** The command line is a **trust boundary** — an interface between an untrusted component and a trusted one, according to the threat model. The OS and hardware are trusted; whatever invoked the program (a shell, a script, another process) is not. So:

1. **Check the number of parameters** — `if (argc != 3) { usage(); return 1; }`
2. **Check that the parameters make sense together** — consistency, not just individual validity.
3. **Check that each has a proper value** — type, range and format.

**The framing that earns the marks.** This is not defensive programming against a user's typo. Under the threat model the invoker **may be malicious and actively supplying malformed parameters specifically to trigger bugs**, so all data crossing the boundary must be validated *before use*.

---

### Question 4 — Undefined behaviour

**Q:** Define undefined behaviour, explain why the C standard contains it at all, and give three examples that are not memory-access errors. Then state the single most important consequence for a program that has entered undefined behaviour.

**Answer & Explanation:**

**Definition.** Undefined behaviour (UB) is a class of erroneous action for which the standard imposes **no requirements whatsoever**. The C FAQ's characterisation is the memorable one: anything at all can happen. The program may fail to compile; it may execute incorrectly, either crashing *or silently producing wrong results*; or it may fortuitously do exactly what the programmer intended.

**Why it exists.** For the same reason the safety checks are absent: it frees the compiler to generate very efficient code. If the compiler must preserve sane behaviour for `INT_MAX + 1`, it cannot assume signed arithmetic never overflows, and that assumption underpins many optimisations.

**Three non-memory examples:**

1. **Signed** integer overflow or underflow. Note the asymmetry — **unsigned** overflow is *defined* and wraps around modulo 2ⁿ; signed overflow is UB.
2. Shifting by more than the width of the type (an oversized shift).
3. Casting an `int *` to a `float *` and dereferencing it (a strict-aliasing violation). Passing a function as the operand of `sizeof` is a further example.

**The consequence to state.** **If a program enters undefined behaviour, the entirety of its execution is invalid.** It is buggy and must be fixed **even if it appears to run correctly.** A one-line demonstration: a program printing the value of `(INT_MAX + 1) < 0` — which "should" be false — can report true, because the compiler is entitled to assume the overflow never happens and optimise on that basis.

**The trap to avoid.** Do not treat "it works on my machine" as evidence of correctness, and do not describe a memory bug as "just a crash". The crashing case is the one you find. The silently-wrong case is the one that ships.

---

### Question 5 — `sizeof` on an array versus on a parameter

**Q:** A developer writes a helper that is supposed to bound its copy using the destination's own size:

```c
#include <string.h>

void copy_into(char dest[64], const char *src) {
    strncpy(dest, src, sizeof(dest) - 1);
    dest[sizeof(dest) - 1] = '\0';
}
```

Explain why this is broken on x86-64, state the exact value `sizeof(dest)` yields, and give the correct idiom.

**Answer & Explanation:**

**The rule.** In a function parameter list, an array declarator is **adjusted to a pointer** to its first element. The `64` in `char dest[64]` is documentation with no effect whatsoever on the type: the parameter's real type is `char *`. Arrays do not carry their size with them, and passing one to a function decays it to a bare pointer.

**The values.** Inside `copy_into`, `sizeof(dest)` is `sizeof(char *)` = **8** on x86-64, not 64. So:

* The copy is bounded at `8 - 1` = **7 bytes**, silently truncating any longer input — a correctness bug, and a nasty one because short test inputs pass.
* `dest[sizeof(dest) - 1] = '\0'` writes to `dest[7]`, not `dest[63]`, so bytes 8 through 63 of the caller's buffer are never terminated. If the caller's buffer held stale data, a later `%s` reads straight through it.

**The correct idiom.** `sizeof` only reports the array size where the array type is still visible — that is, in the scope where the array was *declared*. So the size must be passed explicitly:

```c
#include <string.h>

void copy_into(char *dest, size_t dest_size, const char *src) {
    if (dest_size == 0) return;
    strncpy(dest, src, dest_size - 1);
    dest[dest_size - 1] = '\0';          /* strncpy may not terminate */
}

/* At the call site, where the array type is intact: */
char buffer[64];
copy_into(buffer, sizeof(buffer), user_input);
```

**Why this belongs in a security paper rather than a style guide.** The guidance "keep track of buffer sizes yourself" is often read as advice about diligence. This question shows it is a language-level obligation: the size information is *destroyed by the call*, so there is no way to recover it inside the callee. Question 14 shows the same effect as observable program output.

---

### Question 6 — Enumerating the trust boundaries

**Q:** Beyond command-line arguments, list the input sources that typically constitute trust boundaries, and complete a trust model for a web server. Then state the three obligations that "sanitising" a boundary actually imposes.

**Answer & Explanation:**

**The sources:** command-line arguments, **standard input**, **environment variables**, **disk I/O**, **network I/O**, and **IPC with untrusted processes**. Which of these you must treat as hostile depends on the threat model — but almost every production-ready program using these interfaces will need to sanitise them.

**A trust model for a web server:**

| Source | Trust level | Reasoning |
|---|---|---|
| Command-line arguments | Untrusted | User-controlled; may point at malicious files or overflow buffers |
| Environment variables | Untrusted | Inherited from the shell; manipulable by scripts or misconfiguration |
| Standard input | Untrusted | Human error, or injection if stdin is redirected |
| Configuration file | **Partially trusted** | Modifiable by external actors; needs integrity checks *and* format validation |
| Network input | **Totally untrusted** | Malicious clients send malformed, oversized or hostile payloads |
| Internal constants | Trusted | Developer-controlled, no user influence |

The *partially trusted* row is the interesting one, and it is not a hedge: a config file's trustworthiness is contingent on filesystem permissions being correct, which is an assumption worth stating explicitly rather than making silently.

**The three obligations of sanitisation:**

1. **Validate before use** — the **types, sizes, ranges and consistency** of everything crossing the interface, where *consistency* means whether the pieces make sense **together**, not merely individually.
2. **Avoid leaking data or references** outward — for instance by zeroing buffers that are only partially initialised before they are sent. (Question 20 shows why, and Question 23 shows the `calloc` version of the same defence.)
3. **Validate the control flow** — enforce correct **ordering** of the interface's operations. If the protocol requires request A before request B, ask what the implementation does when they arrive inverted.

**Which software suffers most, and why.** Parsers of rich formats such as XML, web browsers, image and document processors, shell and command-line parsers, and network protocol stacks. The common factor is **interface complexity proportional to format richness** — the more your program must be willing to accept, the more places validation can be incomplete.

---

## Part 2: Memory & Storage Size Calculations

### Question 7 — Base type sizes and total storage

**Q:** For the declarations below, give the number of bytes of storage occupied by the *data* of each object, and the total. State explicitly what the total does **not** account for.

```c
char    c;
short   s;
int     i;
long    l;
float   f;
double  d;
char    name[16];
int     data[10];
double *dp;
```

**Answer & Explanation:**

| Object | Computation | Bytes |
|---|---|---|
| `char c` | 1 | 1 |
| `short s` | 2 | 2 |
| `int i` | 4 | 4 |
| `long l` | 8 (LP64; note this is **4** on 64-bit Windows) | 8 |
| `float f` | 4 | 4 |
| `double d` | 8 | 8 |
| `char name[16]` | `16 × 1` | 16 |
| `int data[10]` | `10 × 4` | 40 |
| `double *dp` | pointer width, **not** the size of the pointee | 8 |
| **Total** | `1+2+4+8+4+8+16+40+8` | **91** |

**What 91 bytes is not.** It is the sum of the object sizes, not the amount of stack the frame consumes. Three separate reasons:

1. The compiler inserts **padding** so each object sits at a correctly aligned address, and it is free to **order locals however it likes** — declaration order implies nothing about addresses.
2. The frame also holds the saved return address, saved registers, and possibly a stack canary.
3. Objects the compiler can keep in registers may occupy no stack at all.

**The two exam traps.** First, `sizeof(dp)` is 8 because it is the *pointer* that is 8 bytes wide; `sizeof(*dp)` is also 8 here, but only coincidentally, because `double` happens to be 8 bytes. Second, always use **`sizeof()`** rather than a hardcoded literal, precisely because `long` is 8 bytes under LP64 and 4 bytes under Windows LLP64 — the exact class of assumption that breaks a bounds check when code is ported.

---

### Question 8 — Struct padding, array size, and element address

**Q:** Consider:

```c
struct sensor_data {
    short  id;
    int    temperature;
    double pressure;
};

struct sensor_data readings[100];
```

1. Give the offset of each member and the true `sizeof(struct sensor_data)`.
2. Give `sizeof(readings)`.
3. If `readings[0]` is at `0x2000`, what is the address of `readings[5]`?
4. State what answers you would get by "ignoring padding", and why that would be wrong.

**Answer & Explanation:**

**Step 1 — lay the members out under the alignment rules.** Each member is placed at the next offset that is a multiple of its own alignment.

| Member | Alignment | Offset | Occupies bytes |
|---|---|---|---|
| `short id` | 2 | 0 | 0–1 |
| *(padding)* | — | 2 | 2–3 — inserted so `temperature` reaches a multiple of 4 |
| `int temperature` | 4 | 4 | 4–7 |
| `double pressure` | 8 | 8 | 8–15 |

The payload is `2 + 4 + 8` = 14 bytes; there are **2 bytes of internal padding**.

**The struct's own alignment** is the *largest* alignment among its members = 8 (from `double`). The total size must be rounded up to a multiple of that alignment, so that in an array every element stays aligned. Here 16 is already a multiple of 8, so:

```
sizeof(struct sensor_data) = 16 bytes   (alignment 8, 2 bytes padding)
```

**Step 2 — the array.** Array elements are contiguous with no gaps between them; the required inter-element spacing is exactly why the struct size is rounded up.

```
sizeof(readings) = 100 × 16 = 1600 bytes
```

**Step 3 — the address.** Indexing scales by the element size:

```
&readings[5] = 0x2000 + (5 × 16) = 0x2000 + 80 = 0x2000 + 0x50 = 0x2050
```

**Step 4 — the naive answers, and the harm.** Ignoring padding gives `sizeof` = 14, array size = 1400, and `&readings[5]` = `0x2046`. All three are wrong on any mainstream compiler. The consequences are not academic:

* A hand-computed `memcpy(dst, readings, 100 * 14)` copies only 87.5 elements' worth of bytes and silently truncates the transfer.
* A hand-computed offset such as `0x2046` lands **10 bytes into element 4**, so reads and writes are misinterpreted as the wrong fields.
* Writing the struct to disk or a socket transmits the 2 padding bytes as well, which were never initialised — an **information leak of stale memory**, the same class of bug as Question 20.

**The rule to state:** never compute a structure's size by hand. Use `sizeof`, and if you need the position of a member, use `offsetof` from `<stddef.h>`.

---

### Question 9 — Member ordering and padding cost

**Q:** For the struct below, compute `sizeof` with the members in the given order. Then reorder them to minimise padding, give the new `sizeof`, and quantify the saving across an array of 1000 elements.

```c
struct record {
    char   flag;
    double score;
    char   grade;
    int    id;
    short  year;
};
```

**Answer & Explanation:**

**As declared.** Walk the offsets, inserting padding before any member whose alignment is not yet satisfied:

| Member | Align | Offset | Padding inserted before it |
|---|---|---|---|
| `char flag` | 1 | 0 | — |
| `double score` | 8 | 8 | **7 bytes** (offsets 1–7) |
| `char grade` | 1 | 16 | — |
| `int id` | 4 | 20 | **3 bytes** (offsets 17–19) |
| `short year` | 2 | 24 | — |

Members end at offset 26. The struct's alignment is 8, so the size is rounded up to the next multiple of 8: **32**. That final round-up is **6 bytes of trailing padding**.

```
payload = 1 + 8 + 1 + 4 + 2 = 16 bytes
sizeof(struct record) = 32 bytes  →  16 bytes of padding, 50% waste
```

**Reordered — largest alignment first.** Declaring members in non-increasing order of alignment lets each one fall naturally into place:

```c
struct record {
    double score;   /* offset  0, bytes 0–7  */
    int    id;      /* offset  8, bytes 8–11 */
    short  year;    /* offset 12, bytes 12–13 */
    char   flag;    /* offset 14 */
    char   grade;   /* offset 15 */
};
```

No padding is required anywhere, and the total of 16 is already a multiple of the struct's 8-byte alignment:

```
sizeof(struct record) = 16 bytes  →  0 bytes of padding
```

**The saving.** 16 bytes per element; across `struct record db[1000]` that is `32,000` bytes versus `16,000` — **16 KB saved, a 50% reduction**, from a change that alters no logic whatsoever.

**Why an exam in secure architecture asks this.**

1. **The compiler may not reorder members for you.** C guarantees that members are laid out in declaration order with increasing offsets, so this padding is not something the optimiser can remove. Ordering is the programmer's responsibility.
2. **Padding bytes are never initialised**, not even by `= {0}` on a per-member basis, and they are copied verbatim by `memcpy` or `write`. A struct that is 50% padding is a large window for leaking stale memory across a trust boundary.
3. The memory footprint argument connects to why C is chosen at all: a **low, controllable footprint** is one of the four benefits the language's unsafety buys, and it is squandered by careless declaration order.

**A caution about the obvious shortcut.** Do not reach for `__attribute__((packed))` to remove padding. It produces misaligned members, and taking a pointer to a misaligned member is undefined behaviour — on some architectures a fault, on x86-64 merely slow. Reordering achieves the same result with no such cost.

---

### Question 10 — Row-major layout of a 2D array

**Q:** Given `int matrix[4][6];` with `matrix` at `0x1000`:

1. What is `sizeof(matrix)`, and what is `sizeof(matrix[0])`?
2. What is the address of `&matrix[2][3]`?
3. What is the address of `&matrix[3][0]`?
4. `matrix[0][7]` compiles without a warning. Which element does it actually read, and why is this still a bug?

**Answer & Explanation:**

**The layout.** C stores multi-dimensional arrays in **row-major** order: `matrix` is an array of 4 objects, each of which is an `int[6]`. Row 0 is laid down completely, then row 1, and so on, contiguously.

**1 — Sizes.**

```
sizeof(matrix[0]) = 6 × 4  = 24 bytes   (one row)
sizeof(matrix)    = 4 × 24 = 96 bytes   (whole array)
```

**2 — `&matrix[2][3]`.** The flat element index is `row × columns + column` — note it is the **column count**, 6, that scales the row, never the row count:

```
flat index  = 2 × 6 + 3 = 15
byte offset = 15 × 4     = 60 = 0x3C
address     = 0x1000 + 0x3C = 0x103C
```

**3 — `&matrix[3][0]`.**

```
flat index  = 3 × 6 + 0 = 18
byte offset = 18 × 4     = 72 = 0x48
address     = 0x1000 + 0x48 = 0x1048
```

**4 — `matrix[0][7]`.** Row 0 legitimately spans columns 0–5. Index 7 is computed as flat index `0 × 6 + 7` = 7, which is the element at byte offset 28 — that is, **`matrix[1][1]`**. The access is inside `matrix` as a whole, so it will not fault and no tool relying on page permissions will notice.

It is nonetheless a genuine bug, for three reasons: it is **undefined behaviour**, because indexing is only defined within the bounds of the array actually subscripted, so the entire execution is invalid; the compiler is silent, since C performs no bounds checking; and the same arithmetic with a larger index — `matrix[3][7]`, flat index 25 in a 24-element array — walks off the end of the object entirely into neighbouring memory. The bug's severity depends on values the compiler cannot see, which is exactly why this class of error is caught by **dynamic** analysis such as AddressSanitizer rather than by inspection.

---

### Question 11 — A struct that needs no padding, and pointer differences

**Q:** Consider:

```c
struct item {
    char  code[8];
    float price;
    int   quantity;
};

struct item inventory[5];
```

1. Give the member offsets and `sizeof(struct item)`. How much padding is there?
2. Give `sizeof(inventory)`.
3. If `inventory[0]` is at `0x1000`, what is the address of `inventory[2]`?
4. Give the values of `&inventory[3] - &inventory[0]` and `(char *)&inventory[3] - (char *)&inventory[0]`, and explain why they differ.

**Answer & Explanation:**

**1 — Layout.** The alignment of `char code[8]` is the alignment of its element type, `char`, which is 1 — an array's alignment is that of its element type, not its total size.

| Member | Align | Offset | Bytes |
|---|---|---|---|
| `char code[8]` | 1 | 0 | 0–7 |
| `float price` | 4 | 8 | 8–11 |
| `int quantity` | 4 | 12 | 12–15 |

Offset 8 is already a multiple of 4, so no padding is needed before `price`; `quantity` follows immediately. The struct's alignment is the maximum among its members = **4**, and 16 is a multiple of 4, so no trailing padding either:

```
sizeof(struct item) = 16 bytes, alignment 4, padding 0
```

Here the naive sum `8 + 4 + 4 = 16` happens to be correct — but by arithmetic accident, not by principle. Compare Question 8, where the same style of sum was off by 2 bytes per element. This is the argument for using `sizeof` rather than trusting a favourable case.

**2 — Array size.** `sizeof(inventory) = 5 × 16 = 80 bytes`.

**3 — Address.** `&inventory[2] = 0x1000 + (2 × 16) = 0x1000 + 32 = 0x1000 + 0x20 = 0x1020`.

**4 — The two differences.**

```
&inventory[3] - &inventory[0]                    = 3     (elements)
(char *)&inventory[3] - (char *)&inventory[0]     = 48    (bytes)
```

**Why.** Pointer arithmetic in C is scaled by the size of the pointed-to type. Subtracting two `struct item *` yields the number of **elements** between them, of type `ptrdiff_t`; the compiler divides the byte distance by `sizeof(struct item)`. Casting both operands to `char *` sets the scale to 1, so the same distance is reported in **bytes**: `3 × 16 = 48`.

**The security relevance.** This scaling is the most common source of hand-written offset errors. `ptr + 1` advances by one *element*, so a bounds check written as `if (ptr + len < end)` compares in element units while a `len` that came from a network header is almost always in **bytes**. Getting this backwards produces a check that passes while the access it guards runs `sizeof(*ptr)` times too far — precisely the shape of the over-read in Question 20.

---

## Part 3: Code Tracing & Output Prediction

### Question 12 — 2D arrays and flat pointer access

**Q:** Give the exact console output.

```c
#include <stdio.h>

int main(void) {
    int grid[3][4] = { {1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12} };
    int *p = &grid[0][0];
    int total = 0;

    for (int i = 0; i < 4; i++)
        total += p[i * 3];

    printf("%d %d %d\n", grid[1][2], p[6], total);
    return 0;
}
```

**Answer & Explanation:**

**Step 1 — flatten the array.** Row-major order means the 12 `int`s sit contiguously, so `p` indexes them as one flat sequence:

| flat index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| value | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |

**Step 2 — the loop.** It reads `p[0]`, `p[3]`, `p[6]`, `p[9]`:

```
i=0: p[0]  = 1    total = 1
i=1: p[3]  = 4    total = 5
i=2: p[6]  = 7    total = 12
i=3: p[9]  = 10   total = 22
```

Note the stride is 3, not 4, so the walk deliberately does **not** follow a column — it drifts across rows.

**Step 3 — the three printed values.**

* `grid[1][2]` — row 1, column 2 → flat index `1 × 4 + 2` = 6 → **7**
* `p[6]` — flat index 6 → **7**. The same element, reached two ways, which is the point of the question.
* `total` → **22**

**Exact output:**

```text
7 7 22
```

**What this tests.** That `grid[i][j]` is not magic: it is `*(base + i × columns + j)`, and the row length used for the scaling is the **number of columns**. The loop bound of 4 with a stride of 3 reaches maximum flat index 9, which is inside the 12-element array — but change the array to `int grid[3][3]` while leaving the loop alone and index 9 is one past the end of a 9-element array, an out-of-bounds read that still compiles silently.

---

### Question 13 — Integer arithmetic, truncation, and conversions

**Q:** Give the exact console output.

```c
#include <stdio.h>

int main(void) {
    int a = 7, b = 2;
    printf("%d %d\n", a / b, a % b);

    int n = -7;
    printf("%d %d\n", n / b, n % b);

    char ch = 'A' + 2;
    printf("%c %d\n", ch, ch);

    double q = a / b;
    double r = (double)a / b;
    printf("%.1f %.1f\n", q, r);

    printf("%zu %zu\n", sizeof(a), sizeof(ch));
    return 0;
}
```

**Answer & Explanation:**

**Line 1 — `7 / 2` and `7 % 2`.** Both operands are `int`, so this is integer division: the fractional part is discarded, giving **3**, and the remainder is **1**. Note `(a / b) * b + (a % b) == a` always holds: `3 × 2 + 1 = 7`.

**Line 2 — `-7 / 2` and `-7 % 2`.** Since C99 integer division **truncates toward zero**, so `-7 / 2` is **-3** (not -4, which is what floor division would give). The identity above then forces the remainder's sign to follow the **dividend**: `-3 × 2 + r = -7`, so `r` = **-1**. This is a classic trap — a hash function written as `table[key % size]` yields a *negative index* for negative keys, which is an out-of-bounds write waiting to happen.

**Line 3 — `char ch = 'A' + 2`.** Character constants have integer values; `'A'` is 65 in ASCII, so `ch` holds **67**. Printed with `%c` the value is interpreted as a character → **C**; printed with `%d` it is promoted to `int` and shown as a number → **67**.

**Line 4 — the conversion trap.** `double q = a / b;` evaluates `a / b` **entirely in integer arithmetic first**, producing 3, and only then converts to `double` — so the information is already lost and `q` is **3.0**. The initialisation is not what makes the division fractional. `(double)a / b` casts *before* dividing, which promotes `b` to `double` too, giving **3.5**. Printed with `%.1f`: **`3.0 3.5`**.

**Line 5 — `sizeof`.** `sizeof(a)` is 4 for an `int` and `sizeof(ch)` is 1 for a `char`. `sizeof` yields `size_t`, whose correct specifier is **`%zu`** — using `%d` here would be a format/type mismatch and therefore undefined behaviour, not merely untidy.

**Exact output:**

```text
3 1
-3 -1
C 67
3.0 3.5
4 1
```

---

### Question 14 — `sizeof` across a function call

**Q:** Give the exact console output on x86-64, and explain the discrepancy.

```c
#include <stdio.h>
#include <string.h>

void show(char buf[64]) {
    printf("inside : sizeof = %zu, strlen = %zu\n", sizeof(buf), strlen(buf));
}

int main(void) {
    char buf[64] = "hello";
    printf("outside: sizeof = %zu, strlen = %zu\n", sizeof(buf), strlen(buf));
    show(buf);
    return 0;
}
```

**Answer & Explanation:**

**In `main`.** `buf` is a genuine `char[64]`, so `sizeof(buf)` is the array's total size, **64**. The initialiser `= "hello"` copies 5 characters plus a terminator and **zero-fills the remaining 58 bytes**, which is why `strlen(buf)` is a well-defined **5** rather than a scan into garbage.

**In `show`.** The parameter written `char buf[64]` is adjusted by the compiler to `char *`. `sizeof(buf)` therefore measures a **pointer**: **8** bytes on x86-64. `strlen(buf)` still reports **5**, because `strlen` follows the pointer to the same bytes and stops at the terminator — the *data* crossed the call intact; only the *size information* was lost.

**Exact output:**

```text
outside: sizeof = 64, strlen = 5
inside : sizeof = 8, strlen = 5
```

**Why this is the most dangerous small fact in C.** The two `sizeof` results differ by a factor of 8 with no warning at any optimisation level, and a bounds check written inside the callee as `strncpy(buf, src, sizeof(buf) - 1)` is silently a 7-byte bound. Compile with `-Wall -Wextra` and modern GCC and Clang will flag `sizeof` on an array-typed parameter (`-Wsizeof-array-argument`), which is a concrete illustration of why compiler warnings are the first line of static analysis. The fix is Question 5's: pass the size as its own parameter, taken with `sizeof` at the call site where the array type still exists.

---

### Question 15 — Strings, pointer offsets, and an interior NUL

**Q:** Give the exact console output.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char msg[12] = "COMP60261";
    char *p = msg;

    printf("1: %s\n", p);
    printf("2: %s\n", p + 4);
    printf("3: %c%c\n", *p, p[3]);

    msg[4] = '\0';

    printf("4: %s|%zu\n", msg, strlen(msg));
    printf("5: %s\n", msg + 5);
    printf("6: %zu\n", sizeof(msg));
    return 0;
}
```

**Answer & Explanation:**

**The bytes.** `"COMP60261"` is 9 characters, so `msg[12]` holds them at indices 0–8, the terminator at index 9, and zero-fill at 10–11:

| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| byte | C | O | M | P | 6 | 0 | 2 | 6 | 1 | `\0` | `\0` | `\0` |

**Line 1.** `p` points at index 0; `%s` prints from there to the first NUL → **`COMP60261`**.

**Line 2.** `p + 4` points at index 4. For a `char *` the scale is 1 byte, so this is simply "four characters in", and printing yields the tail → **`60261`**. There is no separate string object here; `%s` merely starts later in the same array.

**Line 3.** `*p` dereferences index 0 → `C`. `p[3]` is exactly `*(p + 3)` → `P`. With no separator in the format string: **`CP`**.

**Line 4.** Writing `msg[4] = '\0'` overwrites the `'6'` with a terminator. Every string function now stops there, so `%s` prints **`COMP`** and `strlen` returns **4**.

**Line 5.** This is the instructive one. `msg + 5` starts *after* the interior NUL, at index 5, and prints until the next one at index 9 → **`0261`**. The tail of the original string was never erased: overwriting one byte only changed where the functions *stop looking*, not what the memory contains. Data you believe you have removed from a string is still sitting in the buffer, reachable by anything that indexes past the terminator.

**Line 6.** `sizeof(msg)` is a property of the array **type**, fixed at compile time and unaffected by any of the writes → **12**. `strlen` is a runtime scan; `sizeof` is not. Confusing the two is how buffers get bounded by the wrong number.

**Exact output:**

```text
1: COMP60261
2: 60261
3: CP
4: COMP|4
5: 0261
6: 12
```

---

### Question 16 — Why an out-of-bounds read has no predictable output

**Q:** A vendor ships this program as a binary only. It once printed a 26-character banner; a later update shortened the banner, but the loop bound was not updated.

```c
#include <stdio.h>

char welcome[]  = "Welcome!";
char password[] = "s3cr3t-key";

int main(void) {
    for (int i = 0; i < 27; i++)
        putchar(welcome[i]);
    putchar('\n');
    return 0;
}
```

State how many bytes the loop reads out of bounds, explain why the exact output cannot be predicted from the source, describe the *likely* output and why, and classify the vulnerability.

**Answer & Explanation:**

**1 — The overrun, quantified.** `welcome` is initialised from an 8-character literal, so its type is `char[9]` — 8 characters plus the terminator, and `sizeof(welcome)` is **9**. The loop runs `i` from 0 to 26 inclusive, reading **27** bytes. Valid indices are 0–8, so indices 9–26 are out of bounds: **18 bytes read past the end of the object.**

**2 — Why the output is not predictable from the source.** The access is **undefined behaviour**, so the standard imposes no requirements at all on what happens. Concretely, nothing in the C source determines what lies at `&welcome[9]`. That depends on decisions outside the language: how the compiler orders and aligns objects in `.data`, which linker and version combined the objects, the optimisation level, and whether padding was inserted between them. Any of these can change between builds, so the program is entitled to print different things — or crash — after a recompile that touched none of this code.

**3 — The likely output, and why.** Both objects are initialised, writable globals, so both live in `.data`, and compilers commonly emit them in declaration order. The likely sequence is therefore: the 8 characters `Welcome!`; then `welcome`'s NUL terminator, which `putchar` writes as a zero byte the terminal renders as nothing visible; then the bytes of `password`, `s3cr3t-key`, followed by its terminator and whatever else follows, until 27 bytes have been emitted. Visible output, approximately:

```text
Welcome!s3cr3t-key
```

**The secret is printed to standard output by the program's own code.** The attacker who has only the binary needs no crafted input, no payload and no privileges — just to run it.

**4 — Classification.** A **spatial** memory-safety violation in the **read** direction: an out-of-bounds read, and specifically an **infoleak**, breaking **confidentiality**. Note that it compiles cleanly, does not crash, and looks like it works.

**5 — Why the loop bound survived the edit.** In nine lines the bug is obvious, which invites the objection that no one would write this. The properties of real code make it likely anyway: high complexity across thousands to millions of lines; the genuine difficulty of reasoning about which code and data can be trusted; multiple programmers; and codebases evolving over years. A shortened string literal and a numeric loop bound in different files, changed months apart, is entirely plausible.

**6 — The fix, and how it would have been caught.** Never hardcode a length that duplicates information the array already carries:

```c
for (size_t i = 0; i < sizeof(welcome) - 1; i++)   /* -1 to skip the terminator */
    putchar(welcome[i]);
```

or simply `fputs(welcome, stdout);`. As for detection: the Clang static analyser may miss this, since a global's neighbours are a link-time property, but **AddressSanitizer** (`-fsanitize=address`) instruments globals with redzones and reports the read at index 9 immediately, with the offending line. This is the general lesson — static analysis is necessary but not sufficient, and on a comparable three-bug demonstration the static analyser finds only one of the three.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 17 — The missing NUL terminator

**Q:** Identify the bug, explain precisely what happens at runtime, and give two correct rewrites.

```c
#include <stdio.h>

void print_welcome(void) {
    char greeting[5];
    greeting[0] = 'H';
    greeting[1] = 'e';
    greeting[2] = 'l';
    greeting[3] = 'l';
    greeting[4] = 'o';

    printf("Message: %s\n", greeting);
}
```

**Answer & Explanation:**

**The bug.** `greeting` is 5 bytes and all 5 are consumed by characters, leaving **no room for the NUL terminator**. `greeting` is therefore an array of characters, not a valid C string, and passing it to `%s` is undefined behaviour.

**What happens at runtime.** `printf`'s `%s` conversion has no length information — it prints bytes starting at the pointer and stops at the first zero byte. Since `greeting[4]` is `'o'`, it continues into whatever follows the array **in the current stack frame**: other locals, padding, saved registers, eventually the saved return address. Output is `Hello` followed by an unpredictable run of garbage, ending only when a zero byte happens to appear.

Three properties make this worse than it looks. The array is **uninitialised** to begin with, so the trailing bytes are whatever the frame previously held — plausibly data from an earlier, more privileged function. Nothing crashes, because the read stays within a mapped stack page, so the bug is invisible in testing. And the behaviour changes with optimisation level and compiler version, because stack layout does — a build that "worked" tells you nothing.

**Fix 1 — the idiomatic version.** Let the compiler size the array and terminate it:

```c
#include <stdio.h>

void print_welcome(void) {
    char greeting[] = "Hello";      /* char[6]: 5 characters + '\0' */
    printf("Message: %s\n", greeting);
}
```

**Fix 2 — if the array must be written by hand.** Size it for the terminator and write it explicitly:

```c
#include <stdio.h>

void print_welcome(void) {
    char greeting[6] = {0};         /* zero the whole buffer up front */
    greeting[0] = 'H';
    greeting[1] = 'e';
    greeting[2] = 'l';
    greeting[3] = 'l';
    greeting[4] = 'o';
    greeting[5] = '\0';             /* explicit, and already guaranteed by = {0} */

    printf("Message: %s\n", greeting);
}
```

**The rule.** A `char[N]` holds at most **N-1** characters of string. Budget for the terminator when you declare the array, not when you fill it — and prefer `= {0}` so that a partially filled buffer is still terminated by construction.

---

### Question 18 — `strcpy` into adjacent globals

**Q:** This program checks a password. Identify every vulnerability, explain how an attacker who does not know the password gets past the check, and give a hardened version.

```c
#include <stdio.h>
#include <string.h>

char user_input[32];
char password[32] = "correct-horse";

int main(int argc, char **argv) {
    strcpy(user_input, argv[1]);

    if (strncmp(user_input, password, 32) == 0)
        printf("Access granted\n");
    else
        printf("Access denied\n");

    return 0;
}
```

**Answer & Explanation:**

**Bug 1 — `argv[1]` is used without checking `argc`.** Run with no arguments, `argv[1]` is `NULL` and `strcpy` dereferences address 0. Usually a segmentation fault, since the first page is normally unmapped — an availability failure, and a denial of service if this is a service entry point.

**Bug 2 — `strcpy` performs no bounds checking.** It copies from the source until it finds a `'\0'` **in the source**, with no knowledge of the destination's size. An `argv[1]` longer than 31 characters therefore writes past the end of `user_input`.

**The exploit.** The two arrays are adjacent, initialised globals in `.data`, and the compiler will very likely place `password` immediately after `user_input`. Overflowing `user_input` with a 32-byte prefix followed by more data writes that data **directly over `password`**. Because the overflow and the comparison read the same attacker-supplied bytes, the attacker simply repeats their chosen string:

```
./check "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"      (32 bytes into user_input)
                                     ↑ the 33rd byte onward lands in password[]
```

Supplying 32 bytes of `A` followed by `A`s again makes `password` contain what `user_input` contains, `strncmp` returns 0, and **access is granted without the real password ever being known.**

**What makes this example worth understanding.** **No code was injected and no control flow was hijacked.** The program's own comparison logic was turned against it purely by editing its data. Defences aimed at control-flow hijacking — stack canaries, non-executable memory, CFI — do nothing here. That is why memory safety is not reducible to "stop attackers running code".

**Bug 3 — the comparison length is a magic number.** `strncmp(…, 32)` hardcodes a size that must be kept in step with two declarations; and comparing a secret with `strncmp` is not constant-time, which leaks information through timing in a remotely reachable service.

**The hardened version:**

```c
#include <stdio.h>
#include <string.h>

static char user_input[32];
static const char password[] = "correct-horse";

int main(int argc, char **argv) {
    /* 1. Validate the boundary before touching it. */
    if (argc != 2) {
        fprintf(stderr, "usage: %s <password>\n", argv[0]);
        return 1;
    }

    /* 2. Bound the copy by the destination's size, and reject over-long input
          rather than silently truncating it. */
    if (strlen(argv[1]) >= sizeof(user_input)) {
        fprintf(stderr, "input too long\n");
        return 1;
    }

    /* 3. Copy with an explicit bound, then terminate explicitly, because
          strncpy does not guarantee a terminator. */
    strncpy(user_input, argv[1], sizeof(user_input) - 1);
    user_input[sizeof(user_input) - 1] = '\0';

    /* 4. Compare using a length derived from the data, not a literal. */
    if (strcmp(user_input, password) == 0)
        printf("Access granted\n");
    else
        printf("Access denied\n");

    return 0;
}
```

**The four changes, and what each one buys:** checking `argc` closes the `NULL` dereference; bounding the copy closes the overflow; explicit termination closes the unterminated-buffer read that `strncpy` can leave behind (Question 19); and `sizeof` in place of literals means the code stays correct if a declaration changes. Marking `password` as `const` additionally moves it to `.rodata`, so even a residual overflow into it faults on the write instead of succeeding — a cheap application of least privilege. In real code the password would not be in the binary at all: it would be a salted hash, compared in constant time.

---

### Question 19 — `strncpy` is bounded but not safe

**Q:** A developer replaces every `strcpy` with `strncpy` and reports the code hardened. Trace this function exactly and state what it prints, then explain the general rule.

```c
#include <stdio.h>
#include <string.h>

void build_label(void) {
    char dest[32];
    const char *src = "hello, world";

    memset(dest, 'x', sizeof(dest));       /* pre-existing contents */
    strncpy(dest, src, strlen(src));       /* "bounded" copy */

    printf("[%s]\n", dest);
}
```

**Answer & Explanation:**

**The trace.** `memset` fills all 32 bytes with `'x'`. The bound handed to `strncpy` is `strlen(src)` = **12**, so exactly 12 bytes are copied — the characters of `"hello, world"` and **not** its terminator. `strncpy` writes padding NULs only when the bound *exceeds* the source length; here they are equal, so nothing is terminated. Bytes 12–31 remain `'x'`, and there is no zero byte anywhere in the array.

`printf("%s")` therefore prints all 32 bytes and keeps going into the stack frame beyond:

```text
[hello, worldxxxxxxxxxxxxxxxxxxxx…garbage…]
```

— 12 characters of the intended string, then **20** `x`s (`32 - 12`), then whatever follows `dest` in the frame, until a zero byte turns up. The result is a mixture of both strings plus stack contents, which is certainly not what was intended.

**The two errors, separated.**

1. **The bound is derived from the source, not the destination.** `strlen(src)` says how much there is to copy, not how much room there is to copy into. Had `src` been 40 characters, `strncpy(dest, src, 40)` would have overflowed a 32-byte buffer — the `n` version providing no protection at all, because the programmer supplied the wrong `n`.
2. **`strncpy` does not guarantee NUL-termination.** When the source is at least as long as the bound, the destination is left unterminated. This is the trap that makes "use the `n` versions" only half an answer.

**The fix.** Bound by the destination's size, reserve a byte for the terminator, and write it explicitly:

```c
void build_label(void) {
    char dest[32];
    const char *src = "hello, world";

    strncpy(dest, src, sizeof(dest) - 1);
    dest[sizeof(dest) - 1] = '\0';         /* mandatory after strncpy */

    printf("[%s]\n", dest);
}
```

Better still, use an interface that terminates for you and reports truncation:

```c
    int n = snprintf(dest, sizeof(dest), "%s", src);
    if (n < 0 || (size_t)n >= sizeof(dest))
        return;                            /* truncated — handle, don't ignore */
```

`snprintf` always terminates within the given size and returns the length it *would* have written, which is how you detect truncation. `strlcpy` also terminates unconditionally, where available.

**The rule to state in an exam.** **Bounded is not the same as safe.** The safe-function table is a starting point, not the answer:

| Unsafe | Why | Safer, with the caveat |
|---|---|---|
| `gets()` | No bounds checking whatsoever | `fgets()` |
| `strcpy()` | Copies until source NUL, ignores destination size | `strncpy()` — **may not terminate**; `strlcpy()` does |
| `sprintf()` | No bounds checking | `snprintf()` — check the return value for truncation |
| `scanf("%s")` | No width limit | `fgets()` + `sscanf()` **with width specifiers** |
| `memcpy()` | No bounds checking | Use with care; `memmove()` for **overlapping** regions |
| `strlen()` | Not unsafe in itself | But never call it on an untrusted or possibly unterminated buffer |

---

### Question 20 — An attacker-controlled length (Heartbleed)

**Q:** The following is a simplified form of a real, critical vulnerability. Name the vulnerability class and the CVE it corresponds to, quantify the over-read, and give a fix. Your fix must have **two** parts — explain what each part addresses and why one alone is insufficient.

```c
#include <sys/socket.h>

void handle_heartbeat(int client) {
    unsigned char buf[32];

    recv(client, buf, sizeof(buf), 0);
    int len = buf[1];                  /* length, taken from the request */
    send(client, buf + 2, len, 0);     /* echo that many bytes back */
}
```

**Answer & Explanation:**

**The class.** A **buffer over-read** — a spatial memory-safety violation in the read direction — caused by trusting a length field supplied by an untrusted peer. This is **Heartbleed, CVE-2014-0160**, in OpenSSL, which let remote attackers read memory out of vulnerable servers.

**The mechanism.** `len` is read from the attacker's own request and used as the size of the response with **no bounds check**. The client controls it entirely.

**Quantifying it.** `buf` is 32 bytes, of which the payload region `buf + 2` is at most 30. `len` comes from a single `unsigned char`, so it ranges up to **255**. A malicious client sets `len = 255` and the server sends 255 bytes starting at `buf + 2` — that is, up to `255 - 30 =` **225 bytes past the end of the buffer**, straight back to the attacker over the network. `buf` is a stack local, so the leaked bytes are the caller's frame: saved registers, return addresses, and whatever earlier calls left there. In the real bug the leaked memory could include **private keys**. And the attack is silent — the server neither crashes nor logs anything — and repeatable, so the attacker walks memory by asking again and again.

**Bug 2, present even with a bounds check.** `buf` is **uninitialised**. `recv` may return fewer than 32 bytes, so bytes beyond what was actually received hold whatever previously occupied that stack region — and are echoed back.

**The fix, both parts:**

```c
#include <sys/socket.h>
#include <string.h>

void handle_heartbeat(int client) {
    unsigned char buf[32];
    ssize_t received;

    /* PART 1: zero the buffer, so nothing stale can be echoed. */
    memset(buf, 0x00, sizeof(buf));

    received = recv(client, buf, sizeof(buf), 0);
    if (received < 3)                       /* need the length byte + payload */
        return;

    /* PART 2: cap the attacker-supplied length at what we actually hold. */
    size_t len = buf[1];
    size_t available = (size_t)received - 2;
    if (len > available)
        len = available;

    send(client, buf + 2, len, 0);
}
```

**What each part addresses, and why either alone is insufficient.**

* **Part 2 (capping)** stops the **out-of-bounds** read. It bounds the response to memory that belongs to the buffer.
* **Part 1 (zeroing)** stops leaking **stale data that was already inside the buffer**. A bounds check cannot help here: reading `buf[10]` when only 5 bytes were received is perfectly in bounds and still discloses the previous occupant of that stack slot.

They fix **different failures** — one spatial, one an uninitialised-memory disclosure — and a complete answer gives both and says why. Note also that the cap is against `received`, not against `sizeof(buf)`: capping at 30 would still echo bytes the client never sent.

**The generalisation.** This is the canonical **network trust boundary** failure: a length taken from untrusted input must be validated against the size of the object it will be used to access, *before* that access. The same reasoning covers file headers, IPC messages and deserialisers. Detection: **fuzzing** — injecting malformed input through the trust boundary — finds this class quickly, since a mutated length byte produces an ASan-reportable over-read on the first hit.

---

### Question 21 — Attacker-controlled format string

**Q:** Explain why this code is vulnerable even though `snprintf` cannot overflow `buffer`, describe what an attacker gains, and give the fix.

```c
#include <stdio.h>
#include <stdlib.h>

void log_user(void) {
    char *user = getenv("USER_INPUT");
    char buffer[100];

    snprintf(buffer, 100, user);       /* vulnerable */
    printf("%s\n", buffer);
}
```

**Answer & Explanation:**

**First, what is *not* wrong.** There is **no buffer overflow here.** `snprintf` respects its size argument and will never write more than 100 bytes into `buffer`. Any answer that identifies this as an overflow has misclassified it.

**The actual bug.** The third argument to `snprintf` is the **format string**, and here it is **attacker-controlled** — `USER_INPUT` is an environment variable, inherited from the shell and therefore untrusted. `snprintf` parses conversion specifications in the format string and fetches a corresponding argument for each one. Since the caller passed **no** variadic arguments, every specifier the attacker includes makes the function read an argument that was never supplied, taking whatever happens to be in the next argument register or stack slot.

**What the attacker gains.**

* `USER_INPUT="%x %x %x %x"` prints words from the argument registers and the stack — **an information leak**, breaking confidentiality.
* `USER_INPUT="%s"` treats a leaked word as a **pointer** and prints the memory it points at, which usually either dumps a region of memory or crashes the process.
* Some of the leaked words *are* pointers, and **leaking a pointer is a key step in many attacks**: because ASLR randomises only the **base address of each segment** and not the offsets within it, one leaked pointer lets the attacker compute the address of everything else in that segment. This is precisely why the sanitisation rules say to avoid leaking references, and it is how a "mere" infoleak becomes the enabler of a control-flow hijack.
* With `printf`-family functions that support it, **`%n` writes** the number of bytes emitted so far **to a pointer argument**, turning the leak into a memory write. This is why `%n` is disabled in hardened C libraries.

**The fix — make the format a compile-time constant and pass the data as an argument:**

```c
void log_user(void) {
    const char *user = getenv("USER_INPUT");
    char buffer[100];

    if (user == NULL)                       /* getenv returns NULL if unset */
        user = "(unset)";

    snprintf(buffer, sizeof(buffer), "%s", user);
    printf("%s\n", buffer);
}
```

Now the specifier count and types are fixed by the programmer, and the untrusted bytes are only ever *data* consumed by `%s`. Note the second fix folded in: `getenv` returns `NULL` when the variable is unset, so the original would also pass `NULL` as a format string.

**The rule, which admits no exceptions:** **never pass untrusted data as a format string.** The danger here is attacker-controlled **format**, not attacker-controlled **length** — a distinct vulnerability class from overflows, and one that bounds checking does not touch. Compile with `-Wformat -Wformat-security` (included in `-Wall -Wextra`) and the compiler will flag a non-literal format string, which is the cheapest possible detection for a bug of this severity.

---

### Question 22 — Off-by-one in a loop bound

**Q:** Find the bug, state exactly which byte is written and where, explain why the program may appear to work, and give the fix.

```c
#include <stdio.h>

#define LEN 8

int main(void) {
    int  data[LEN];
    int  canary = 0xCAFE;

    for (int i = 0; i <= LEN; i++)
        data[i] = i * i;

    printf("canary = 0x%X\n", canary);
    return 0;
}
```

**Answer & Explanation:**

**The bug.** The loop condition is `i <= LEN`, so `i` takes the values 0 through **8 inclusive** — nine iterations over an eight-element array. Valid indices are 0–7. The final iteration performs `data[8] = 64`, an **out-of-bounds write**.

**Exactly what is written where.** `data` occupies `8 × 4` = 32 bytes, at offsets 0–31 from its base. `data[8]` is at byte offset `8 × 4` = **32** — the first 4 bytes immediately past the end of the array. The value written is `8 × 8` = **64** (`0x40`).

**What sits there.** Whatever the compiler placed next in the stack frame. It may be `canary`, in which case the program prints `canary = 0x40` instead of `0xCAFE` — a variable silently corrupted by code that never mentions it. It may equally be padding, a saved register, or the saved return address, in which case the program returns to address `0x40` and crashes on `ret`. Declaration order does not determine layout, so **which** object is hit is not knowable from the source.

**Why it may appear to work.** No bounds check exists to fail; the compiler emits no warning for an out-of-range index it cannot see through; and the write lands within a mapped stack page, so the hardware raises nothing. If the four bytes at offset 32 happen to be padding, the program produces entirely correct output — while still being in **undefined behaviour**, and therefore still invalid in its entirety. A change of compiler, flag, or an added local can turn the silent version into the crashing version with no source change at all.

**The fix — a strict comparison:**

```c
    for (int i = 0; i < LEN; i++)
        data[i] = i * i;
```

Better, remove the duplicated size entirely so the bound cannot drift from the declaration:

```c
    for (size_t i = 0; i < sizeof(data) / sizeof(data[0]); i++)
        data[i] = (int)(i * i);
```

**Why `<=` is such a productive source of bugs.** A C array of `N` elements is indexed `0` to `N-1`; `<=` is correct for an inclusive upper bound and wrong for a count, and the two read almost identically at a glance. It is also the mechanism behind Question 16's infoleak in the read direction and the classic four-element loop that walks one past its array. Detection: **AddressSanitizer** (`-fsanitize=address`) places redzones around stack arrays and reports this immediately as a stack-buffer-overflow with the exact line — where inspection and static analysis frequently miss it.

---

### Question 23 — Three heap bugs in ten lines

**Q:** This function contains **three** distinct memory-safety defects. Identify each, name its class, explain how the last one is exploitable to run attacker-chosen code, and give a corrected version.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct handler {
    int   id;
    int   flags;
    void (*callback)(void);
};

static void benign(void) { puts("benign handler"); }

void run(const char *input, size_t n) {
    struct handler *h = malloc(sizeof(*h));
    h->id = 1;
    h->callback = benign;
    h->callback();

    free(h);

    char *tmp = malloc(12);
    strcpy(tmp, input);

    h->callback();                       /* (3) */

    h = realloc(h, n);
    free(tmp);
}
```

**Answer & Explanation:**

**Defect 1 — `malloc`'s return value is not checked.** `malloc` returns `NULL` on failure, so `h->id = 1` dereferences `NULL`, writing to address 0. Since the first page is normally unmapped this crashes — a **`NULL` pointer dereference**, an availability failure. Note also that `h->flags` is never initialised: `malloc` does **not** zero its memory, so `flags` holds whatever previously occupied that heap chunk.

**Defect 2 — unbounded `strcpy` into a 12-byte allocation.** `strcpy` copies until it finds a terminator in `input`, ignoring the destination size entirely, so any `input` longer than 11 characters overflows the chunk — a **spatial** violation, heap variety, corrupting adjacent heap data and the allocator's own metadata. The `n` parameter, which presumably describes `input`, is never used to bound anything.

**Defect 3 — use-after-free of a function pointer.** After `free(h)`, `h` is a **dangling pointer**: it may not be dereferenced, and strictly may not even be *used*, including in a comparison. `h->callback()` reads a function pointer out of freed memory and calls it — a **temporal** violation.

**Why defect 3 is exploitable, not merely a crash.** The exploitability comes from **allocator behaviour**, not from the dangling pointer alone. `malloc` reuses freed memory wherever it can, and the 12-byte request that follows `free(h)` is very likely to be satisfied from **the very chunk the struct just occupied**. The attacker's `strcpy` therefore writes over the bytes that used to hold `callback`. Combined with defect 2, the attacker chooses those bytes exactly, placing the address of a function of their choosing — a `security_critical_function`, or `system` — where the stale pointer expects `benign`. The subsequent `h->callback()` calls it. This is a **control-flow hijack** achieved with no stack involvement and no injected code, so it is unaffected by non-executable memory and by stack canaries; **forward-edge CFI**, which restricts indirect calls to legitimate targets, is the defence aimed at it.

**Defect 4 (a bonus, in the last two lines).** `h = realloc(h, n)` is wrong twice over. It calls `realloc` on an **already-freed** pointer, which is heap corruption. And the idiom itself leaks: `realloc` returns `NULL` on failure **without freeing the original**, so overwriting the only surviving pointer to that block with `NULL` loses it. Always assign to a temporary and check before reassigning.

**The corrected version:**

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct handler {
    int   id;
    int   flags;
    void (*callback)(void);
};

static void benign(void) { puts("benign handler"); }

void run(const char *input, size_t n) {
    /* calloc: zeroes the allocation, so no member is left holding stale
       heap contents that could later be leaked outward. */
    struct handler *h = calloc(1, sizeof(*h));
    if (h == NULL)
        return;                              /* (1) check the allocation */

    h->id       = 1;
    h->flags    = 0;
    h->callback = benign;
    h->callback();

    free(h);
    h = NULL;                                /* (3) poison the stale pointer */

    char *tmp = malloc(n + 1);
    if (tmp == NULL)
        return;

    memcpy(tmp, input, n);                   /* (2) bound by the known length */
    tmp[n] = '\0';                           /* terminate explicitly */

    /* h is NULL here: any residual use faults loudly instead of calling
       into memory an attacker controls. */

    char *grown = realloc(tmp, n * 2 + 1);   /* (4) never assign onto the arg */
    if (grown == NULL) {
        free(tmp);                           /* tmp is still valid — no leak */
        return;
    }
    tmp = grown;

    free(tmp);
}
```

**The five practices this demonstrates:**

1. **Check every allocation's return value.**
2. **Set the pointer to `NULL` immediately after `free`.** This is why "don't use after free" is only half the guidance: `NULL`ing converts a silent, exploitable use-after-free into a deterministic crash at the point of the bug.
3. **Bound every copy by a size you actually know**, and prefer `memcpy` with an explicit length over `strcpy` when the length is already available.
4. **Never write `p = realloc(p, n)`** — it leaks the original block on failure.
5. **Prefer `calloc` where performance allows.** `malloc` does not zero, so a partially initialised structure passed to an untrusted context — written to a socket or a file — discloses whatever previously occupied that memory. This is the heap form of the zeroing in Question 20.

**Detection.** All three primary defects are found by **AddressSanitizer** (`-fsanitize=address`), which reports heap-buffer-overflow, use-after-free and double-free with allocation and free stack traces. A static analyser will typically flag the use-after-free but miss the overflow, which is the practical demonstration that static analysis is necessary but not sufficient. And because none of these approaches can guarantee the absence of bugs, production still relies on runtime defences — W⊕X, ASLR with PIE, canaries, RELRO, `_FORTIFY_SOURCE` and CFI — to raise the cost of exploiting the ones that survive.

---

## Answer Key Summary

| # | Topic | Key answer |
|---|---|---|
| 7 | Type sizes | 91 bytes of payload; excludes padding, and `long` is 4 bytes on Windows |
| 8 | `sensor_data` | `sizeof` = **16** (not 14); array = **1600**; `&readings[5]` = **0x2050** |
| 9 | Member ordering | **32** bytes as declared → **16** reordered; 16 KB saved per 1000 elements |
| 10 | `int[4][6]` | `sizeof` = 96; `&matrix[2][3]` = **0x103C**; `&matrix[3][0]` = **0x1048** |
| 11 | `item` | `sizeof` = **16**, zero padding; `&inventory[2]` = **0x1020**; differences **3** and **48** |
| 12 | Grid trace | `7 7 22` |
| 13 | Arithmetic | `3 1` / `-3 -1` / `C 67` / `3.0 3.5` / `4 1` |
| 14 | `sizeof` decay | `64` outside, **`8`** inside; `strlen` = 5 in both |
| 15 | String trace | `COMP60261` / `60261` / `CP` / `COMP|4` / `0261` / `12` |
| 16 | Infoleak | 18 bytes out of bounds; likely prints the password; unpredictable by definition |

**The three-part structure to hang any "how do we deal with this?" answer on:** adhere to good coding practices to avoid introducing bugs; use static and dynamic tools to detect them before shipping; deploy runtime defences in production to make exploitation harder and limit the damage. With the caveat that motivates the third part — **none of the existing practical approaches can guarantee the absence of bugs.**
