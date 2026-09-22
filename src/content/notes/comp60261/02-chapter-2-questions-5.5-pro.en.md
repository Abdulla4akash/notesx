---
subject: COMP60261
chapter: 2
title: "Chapter 2 Exam Questions - 5.5 Pro"
language: "en"
---

# Chapter 2 Exam Practice Set: Memory Safety and Low-Level C

**AI author:** 5.5 Pro  
**Source material:** COMP60261 Week 2 / Chapter 2 notes on program memory layout, memory safety, exploitation, trust boundaries, secure coding practices, bug detection, and runtime defences.

Unless a question states otherwise, assume a typical x86-64 Linux target using the LP64 data model:

- `char` is 1 byte and has alignment 1.
- `short` is 2 bytes and has alignment 2.
- `int` is 4 bytes and has alignment 4.
- `float` is 4 bytes and has alignment 4.
- `double` is 8 bytes and has alignment 8.
- Pointers are 8 bytes and have alignment 8.
- Structures are padded so each member starts at an address satisfying its alignment, and the whole structure size is rounded up to a multiple of the largest member alignment.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1: Why C is deliberately unsafe

**Q:** C and C++ are widely used for systems software even though they do not enforce memory safety. Explain the trade-off. Your answer must name at least three benefits and at least three security risks.

**Answer & Explanation:**

Step 1: State the core trade-off. C omits many runtime checks so the compiled program can run with low overhead and close control over machine resources. This is deliberate, not an accidental omission.

Step 2: Identify the benefits.

- **Performance:** array indexing and pointer arithmetic compile to address calculations and loads/stores, not bounds-checked operations.
- **Small runtime footprint:** C does not require garbage collection, object metadata, or a large managed runtime.
- **Predictable latency:** there are no garbage-collector pauses, which matters for kernels, device drivers, embedded systems, and real-time software.
- **Direct hardware and address-space control:** C can express operations needed by operating systems, hypervisors, allocators, and low-level libraries.

Step 3: Identify the risks.

- **Out-of-bounds reads:** the program may disclose adjacent memory, including secrets, pointers, or stack canaries.
- **Out-of-bounds writes:** the program may corrupt adjacent data, function pointers, allocator metadata, or return addresses.
- **Use-after-free and double-free bugs:** the program may access or release storage whose lifetime has already ended.
- **Uninitialised reads:** the program may consume stale memory contents and leak data.
- **Invalid pointer dereferences:** `NULL`, dangling, or forged pointers may crash the program or corrupt state.

Step 4: Connect to security. These bugs can break all three parts of CIA:

- **Confidentiality:** leaking sensitive data.
- **Integrity:** modifying control data or security-critical program state.
- **Availability:** crashing the process or system.

---

### Question 2: Spatial safety, temporal safety, and undefined behaviour

**Q:** Define spatial memory safety and temporal memory safety. For each of the following operations, classify the violation as spatial, temporal, both, or neither:

1. `buffer[16] = 'A';` when `buffer` has valid indices `0..15`.
2. Reading through a pointer after `free(ptr)`.
3. Calling `free(ptr)` twice on the same allocation.
4. Reading an automatic local variable before assigning a value to it.
5. Accessing `array[-1]`.

**Answer & Explanation:**

Step 1: Define the terms.

- **Spatial memory safety** means memory is accessed only within the bounds of the object being addressed. It is about the right place.
- **Temporal memory safety** means memory is accessed only while it is valid for use. It is about the right time.

Step 2: Classify each operation.

| Operation | Classification | Reason |
|---|---:|---|
| `buffer[16] = 'A';` for a 16-byte buffer | Spatial | Index `16` is one past the last valid index, so this is an out-of-bounds write. |
| Reading after `free(ptr)` | Temporal | The allocation's lifetime has ended, so the pointer is dangling. |
| Double-freeing `ptr` | Temporal | The second `free` acts on storage that is no longer allocated to the program. |
| Reading an uninitialised local variable | Temporal | The object exists, but its value has not been made valid for reading. |
| Accessing `array[-1]` | Spatial | The access is before the beginning of the array object. |

Step 3: Connect to C undefined behaviour. In C, these operations generally trigger undefined behaviour. That means the C standard imposes no useful requirements on what happens next: the program might crash, appear to work, silently compute the wrong result, or be transformed unexpectedly by compiler optimisation. The correct conclusion is not "it works on my machine"; the correct conclusion is that the program is invalid and must be fixed.

---

### Question 3: Program memory layout and the loader

**Q:** Explain how a dynamically linked program's address space is created before `main` starts. Your answer must include the roles of the operating system, ELF metadata, the dynamic loader, shared libraries, static memory, the stack, the heap, and memory permissions.

**Answer & Explanation:**

Step 1: The executable initially exists as a binary file on disk. On Linux this is typically an ELF file.

Step 2: When the program is invoked, the operating system creates a private virtual address space for the process. The process sees this as a large sparse array of bytes, independent of how much physical RAM is installed.

Step 3: For a dynamically linked program, the ELF metadata names the dynamic loader, such as `ld-linux-x86-64.so.2`. The OS maps the loader first and transfers execution to it.

Step 4: The loader maps the program's own code and data segments, then maps the shared libraries named by the program, such as `libc.so`.

Step 5: These mapped code and global-data regions are **static memory**: their layout and initial contents are determined before execution. They include regions such as:

- `.text` for executable code.
- `.rodata` for read-only data.
- `.data` for initialised writable globals.
- `.bss` for zero-initialised writable globals.

Step 6: Runtime storage is then available through:

- The **stack**, which stores stack frames, local variables, call metadata, and some arguments. On x86-64 it grows toward lower addresses.
- The **heap**, which stores dynamically allocated memory from functions such as `malloc`. It generally grows upward conceptually, although modern allocators may use multiple mappings.

Step 7: Each mapped region has permissions, such as read-only, read-execute, or read-write. The CPU enforces those permissions on loads, stores, and instruction fetches. This is the mechanism runtime defences such as NX and W^X rely on.

---

### Question 4: Function calls, stack smashing, and control-flow hijacking

**Q:** On x86-64, explain how a normal function call and return work, then explain why a stack buffer overflow can overwrite a return address.

**Answer & Explanation:**

Step 1: State the calling convention. Under the System V x86-64 function calling convention, the first six integer or pointer arguments are passed in:

```text
%rdi, %rsi, %rdx, %rcx, %r8, %r9
```

The return value is placed in `%rax`.

Step 2: Explain `call`. A `call` instruction pushes the address of the next instruction, the return address, onto the stack and then jumps to the called function.

Step 3: Explain the callee's stack frame. The callee reserves stack space for local variables and saved state. Local arrays may be placed in this frame.

Step 4: Explain `ret`. A `ret` instruction pops the return address from the stack and jumps to it.

Step 5: Explain the vulnerable geometry. The stack grows toward lower addresses, but writing through a local buffer with functions such as `strcpy` proceeds toward increasing addresses. If the local buffer is below the saved return address in the frame, a long copy can write past the end of the buffer, through adjacent frame data, and into the return address.

Step 6: Explain the security impact. If the attacker controls the overwritten return address, then when the function returns, the CPU jumps to an attacker-chosen location. That is a control-flow hijack.

---

### Question 5: Trust boundaries

**Q:** Define a trust boundary. Then identify four common trust boundaries in C programs and state what must be checked at each boundary.

**Answer & Explanation:**

Step 1: Define the term. A **trust boundary** is an interface where data passes from a less-trusted component into a more-trusted component, according to the threat model. Data crossing that interface must be validated before use.

Step 2: Identify common boundaries.

| Boundary | Example | Required checks |
|---|---|---|
| Command-line arguments | `argc`, `argv` | Check argument count, length, allowed characters, numeric ranges, and semantic validity. |
| Environment variables | `getenv("APP_HOME")` | Check for `NULL`, length, allowed format, and whether the value is trustworthy in the process context. |
| Files | configuration files, uploads, saved state | Check file size, format, magic values, parser state, path traversal, and malformed content. |
| Network input | sockets, TLS records, RPC messages | Check message lengths, field ranges, authentication state, replay rules, and protocol sequencing. |

Step 3: Explain why this is security-critical. The C type system usually does not record whether a pointer refers to trusted or untrusted data. A `char *` from a hard-coded string and a `char *` from the network look the same at the call site. The validation requirement comes from the threat model, not from the type.

---

### Question 6: Runtime defences and their limitations

**Q:** For each runtime defence, state what it is designed to stop and one important limitation or bypass:

1. NX / non-executable memory.
2. ASLR.
3. Stack canaries.
4. RELRO.
5. `_FORTIFY_SOURCE`.
6. Control Flow Integrity.

**Answer & Explanation:**

| Defence | Designed to stop | Limitation or bypass |
|---|---|---|
| NX / non-executable memory | Executing injected shellcode from writable memory such as the stack or heap. | Does not stop code-reuse attacks such as return-to-libc or ROP, because those reuse existing executable code. |
| ASLR | Predicting addresses of code, stack, heap, and libraries across executions. | Segment-granular randomisation can be broken by an infoleak. A non-PIE main executable may still load at a fixed address. |
| Stack canaries | Contiguous stack overflows that overwrite a return address. | A canary leak allows the attacker to rewrite the correct value; non-contiguous writes may skip the canary. |
| RELRO | Overwriting relocation structures such as GOT entries. | Partial RELRO protects only part of the GOT; full RELRO has load-time cost and does not protect every writable function pointer. |
| `_FORTIFY_SOURCE` | Some misuse of functions such as `strcpy`, `memcpy`, and `strcat` when object sizes are known. | Coverage is incomplete; stronger levels can expose compatibility issues and require testing. |
| Control Flow Integrity | Indirect jumps/calls and returns to illegitimate targets. | Coarse-grained CFI may still allow too many targets; shadow stacks must themselves be protected. |

Step 2: Draw the design conclusion. Runtime defences are valuable because they force attackers to combine more primitives, such as an overflow plus an infoleak. They do not prove that the program is memory-safe.

---

### Question 7: Static analysis, dynamic analysis, sanitizers, and fuzzing

**Q:** Compare static analysis and dynamic analysis for finding memory safety bugs. Include compiler warnings, AddressSanitizer, UndefinedBehaviorSanitizer, Valgrind, and fuzzing in your answer.

**Answer & Explanation:**

Step 1: Static analysis examines source code without executing it. Its strengths are broad code coverage and automation. Its weaknesses are false positives, limited runtime context, and scalability limits on large codebases.

Step 2: Compiler warnings are the first static-analysis layer. A typical hardening progression is:

```text
-Wall -> -Wextra -> -pedantic
```

Dedicated static tools include Clang Static Analyzer, cppcheck, Lint, and commercial analyzers such as Coverity.

Step 3: Dynamic analysis observes a program while it runs. Its strength is concrete runtime context: actual pointer values, allocation lifetimes, input lengths, and executed paths. Its weakness is input-dependent coverage: it only detects bugs that are reached.

Step 4: AddressSanitizer instruments code to detect memory bugs such as heap, stack, and global buffer overflows, use-after-free, double-free, and some leaks.

Step 5: UndefinedBehaviorSanitizer instruments code to detect undefined behaviour such as signed integer overflow, invalid casts, misaligned pointer access, and division by zero.

Step 6: Valgrind can find memory errors without recompiling the target, which is useful when only a binary is available, but it is generally slower than compiler sanitizers.

Step 7: Fuzzing repeatedly sends malformed or randomly mutated inputs through a trust boundary to trigger bugs. Coverage-guided fuzzing, such as AFL-style fuzzing, is effective because it searches for new paths and then pairs well with sanitizers for diagnosis.

Step 8: The exam conclusion is that these techniques are complementary. Static analysis is necessary but not sufficient; dynamic analysis is precise but path-dependent; neither proves the absence of memory safety bugs.

---

## Part 2: Memory & Storage Size Calculations

### Question 8: Struct alignment, padding, and field addresses

**Q:** Consider the following complete C program. Under the assumptions at the top of this document, calculate:

1. `sizeof(struct Packet)`.
2. The offset of each field.
3. `sizeof(packets)`.
4. If `packets[0]` starts at address `0x1000`, the address of `packets[2].checksum`.

```c
#include <stddef.h>
#include <stdio.h>

struct Packet {
    char type;
    int length;
    char flags;
    short checksum;
};

int main(void) {
    struct Packet packets[3];

    printf("%zu\n", sizeof(struct Packet));
    printf("%zu\n", sizeof(packets));
    printf("%zu\n", offsetof(struct Packet, checksum));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Lay out the fields.

| Field | Size | Alignment | Offset calculation |
|---|---:|---:|---|
| `type` | 1 | 1 | Starts at offset `0`. |
| padding | 3 | - | Needed so `length` starts on a 4-byte boundary. |
| `length` | 4 | 4 | Starts at offset `4`, occupies offsets `4..7`. |
| `flags` | 1 | 1 | Starts at offset `8`. |
| padding | 1 | - | Needed so `checksum` starts on a 2-byte boundary. |
| `checksum` | 2 | 2 | Starts at offset `10`, occupies offsets `10..11`. |

Step 2: Round the structure size. The largest alignment requirement is 4, and the next offset after `checksum` is 12. Since 12 is already a multiple of 4:

```text
sizeof(struct Packet) = 12 bytes
```

Step 3: Calculate the array size.

```text
sizeof(packets) = 3 * 12 = 36 bytes
```

Step 4: Calculate the requested address.

```text
address(packets[2].checksum)
  = base + 2 * sizeof(struct Packet) + offsetof(checksum)
  = 0x1000 + 2 * 12 + 10
  = 0x1000 + 24 + 10
  = 0x1000 + 34
  = 0x1000 + 0x22
  = 0x1022
```

---

### Question 9: Nested arrays and row-major offsets

**Q:** Consider the following complete C program. Assume `frame[0][0]` starts at address `0x7000`. Calculate:

1. The total size of `frame`.
2. The address of `frame[2][3]`.
3. The address of `frame[3][0]`.

```c
#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint16_t frame[4][5];

    printf("%zu\n", sizeof(frame));
    printf("%zu\n", sizeof(frame[0]));
    printf("%zu\n", sizeof(frame[0][0]));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Calculate the element size.

```text
sizeof(uint16_t) = 2 bytes
```

Step 2: Calculate total array size.

```text
frame has 4 * 5 = 20 elements
sizeof(frame) = 20 * 2 = 40 bytes
```

Step 3: Use row-major layout. In C, a two-dimensional array is stored row by row. The linear index of `frame[row][column]` is:

```text
row * number_of_columns + column
```

Step 4: Address of `frame[2][3]`.

```text
linear index = 2 * 5 + 3 = 13
byte offset = 13 * 2 = 26 = 0x1a
address = 0x7000 + 0x1a = 0x701a
```

Step 5: Address of `frame[3][0]`.

```text
linear index = 3 * 5 + 0 = 15
byte offset = 15 * 2 = 30 = 0x1e
address = 0x7000 + 0x1e = 0x701e
```

---

### Question 10: Struct with arrays, a double, and a pointer

**Q:** Consider the following complete C program. Under the assumptions at the top of this document, calculate:

1. `sizeof(struct Record)`.
2. The offset of `weight`.
3. The offset of `ids`.
4. The offset of `next`.
5. If `records[0]` starts at `0x4000`, the address of `records[1].next`.
6. If `records[0]` starts at `0x4000`, the address of `records[3].ids[2]`.

```c
#include <stddef.h>
#include <stdio.h>

struct Record {
    char tag;
    char name[7];
    double weight;
    int ids[3];
    void *next;
};

int main(void) {
    struct Record records[4];

    printf("%zu\n", sizeof(struct Record));
    printf("%zu\n", offsetof(struct Record, weight));
    printf("%zu\n", offsetof(struct Record, ids));
    printf("%zu\n", offsetof(struct Record, next));
    printf("%zu\n", sizeof(records));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Lay out the first two fields.

```text
tag       offset 0, size 1
name[7]   offset 1, size 7
```

Together, `tag` and `name` occupy offsets `0..7`, so the next offset is 8.

Step 2: Place `weight`. A `double` requires 8-byte alignment. Offset 8 already satisfies that.

```text
weight    offset 8, size 8, occupies 8..15
```

Step 3: Place `ids`. An `int` requires 4-byte alignment. Offset 16 already satisfies that.

```text
ids[3]    offset 16, size 3 * 4 = 12, occupies 16..27
```

Step 4: Place `next`. A pointer requires 8-byte alignment. The next free offset is 28, so 4 bytes of padding are inserted at offsets `28..31`.

```text
next      offset 32, size 8, occupies 32..39
```

Step 5: Round the structure size. The largest alignment is 8. The next offset is 40, which is already a multiple of 8.

```text
sizeof(struct Record) = 40 bytes
```

Step 6: Calculate `records[1].next`.

```text
address = 0x4000 + 1 * 40 + 32
        = 0x4000 + 0x28 + 0x20
        = 0x4048
```

Step 7: Calculate `records[3].ids[2]`.

```text
base of records[3] = 0x4000 + 3 * 40
                   = 0x4000 + 120
                   = 0x4078

offset of ids[2] within one struct = offset(ids) + 2 * sizeof(int)
                                   = 16 + 2 * 4
                                   = 24
                                   = 0x18

address = 0x4078 + 0x18 = 0x4090
```

---

### Question 11: Strings, null terminators, and storage size

**Q:** Consider the following complete C program. Calculate the value printed by each `printf`, and explain the difference between `sizeof` and `strlen`.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char a[8] = "Secure";
    char b[] = "Secure";
    char c[8] = {'S', 'e', 'c', 'u', 'r', 'e'};

    printf("%zu %zu\n", sizeof(a), strlen(a));
    printf("%zu %zu\n", sizeof(b), strlen(b));
    printf("%zu %zu\n", sizeof(c), strlen(c));

    return 0;
}
```

**Answer & Explanation:**

Step 1: Analyse `a`.

```text
char a[8] = "Secure";
```

The string literal has 6 visible characters plus `'\0'`, so 7 bytes are required. The array has 8 bytes, so the remaining byte is zero-initialised.

```text
sizeof(a) = 8
strlen(a) = 6
```

Step 2: Analyse `b`.

```text
char b[] = "Secure";
```

The compiler chooses the exact size needed for the string literal, including the null terminator.

```text
sizeof(b) = 7
strlen(b) = 6
```

Step 3: Analyse `c`.

```text
char c[8] = {'S', 'e', 'c', 'u', 'r', 'e'};
```

Because this is an aggregate initializer with fewer elements than the array size, the remaining bytes are zero-initialised. Therefore `c[6]` is `'\0'`.

```text
sizeof(c) = 8
strlen(c) = 6
```

Step 4: Exact output.

```text
8 6
7 6
8 6
```

Step 5: General rule. `sizeof(array)` is the storage size in bytes known at compile time. `strlen(string)` counts visible characters at runtime until the first `'\0'`; it does not include the terminator and can read out of bounds if the buffer is not properly terminated.

---

### Question 12: Allocation size, overflow checks, and object counts

**Q:** Consider this complete C program. Under the assumptions at the top of this document, compute the number of bytes required for `count = 17` records. Then explain why the overflow check is needed before `calloc`.

```c
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

struct Entry {
    uint32_t id;
    uint16_t flags;
    uint16_t length;
    uint64_t timestamp;
};

int main(void) {
    size_t count = 17;

    if (count > SIZE_MAX / sizeof(struct Entry)) {
        return 1;
    }

    struct Entry *entries = calloc(count, sizeof(struct Entry));
    if (entries == NULL) {
        return 1;
    }

    printf("%zu\n", count * sizeof(struct Entry));
    free(entries);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Lay out `struct Entry`.

| Field | Size | Alignment | Offset |
|---|---:|---:|---:|
| `id` | 4 | 4 | 0 |
| `flags` | 2 | 2 | 4 |
| `length` | 2 | 2 | 6 |
| `timestamp` | 8 | 8 | 8 |

No padding is needed before `timestamp` because offsets `0..7` are already filled, so offset 8 satisfies 8-byte alignment.

Step 2: Compute structure size.

```text
id + flags + length + timestamp = 4 + 2 + 2 + 8 = 16 bytes
sizeof(struct Entry) = 16
```

Step 3: Compute allocation size for 17 records.

```text
17 * 16 = 272 bytes
272 decimal = 0x110
```

The program prints:

```text
272
```

Step 4: Explain the overflow check.

If `count * sizeof(struct Entry)` overflows `size_t`, the computed allocation size can wrap to a smaller value. The allocator would then reserve too little memory, while later code may still write `count` entries. That becomes a heap buffer overflow. The check:

```c
count > SIZE_MAX / sizeof(struct Entry)
```

prevents the multiplication from wrapping.

---

## Part 3: Code Tracing & Output Prediction

### Question 13: Pointer arithmetic over an array

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

int main(void) {
    int values[3] = {2, 4, 6};
    int *p = values;

    p[1] += values[0];

    printf("%d %d %td\n", values[1], *(p + 2), &values[2] - &values[0]);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Initial array:

```text
values[0] = 2
values[1] = 4
values[2] = 6
```

Step 2: `p` points at `values[0]`, so `p[1]` is the same object as `values[1]`.

Step 3: Execute:

```c
p[1] += values[0];
```

This updates `values[1]` from `4` to `4 + 2 = 6`.

Step 4: Evaluate the `printf` arguments.

- `values[1]` is `6`.
- `*(p + 2)` is `values[2]`, which is `6`.
- `&values[2] - &values[0]` is a pointer difference measured in `int` elements, not bytes, so it is `2`.

Exact output:

```text
6 6 2
```

---

### Question 14: Two-dimensional arrays and row-major layout

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

int main(void) {
    int matrix[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    int *flat = &matrix[0][0];
    flat[4] += matrix[0][2];

    printf("%d %d %zu\n", matrix[1][1], flat[5], sizeof(matrix) / sizeof(matrix[0]));

    return 0;
}
```

**Answer & Explanation:**

Step 1: C stores `matrix` in row-major order:

```text
flat[0] = matrix[0][0] = 1
flat[1] = matrix[0][1] = 2
flat[2] = matrix[0][2] = 3
flat[3] = matrix[1][0] = 4
flat[4] = matrix[1][1] = 5
flat[5] = matrix[1][2] = 6
```

Step 2: Execute:

```c
flat[4] += matrix[0][2];
```

`flat[4]` is `matrix[1][1]`, initially `5`. `matrix[0][2]` is `3`. Therefore `matrix[1][1]` becomes `8`.

Step 3: Evaluate the output.

- `matrix[1][1]` is `8`.
- `flat[5]` is `matrix[1][2]`, still `6`.
- `sizeof(matrix) / sizeof(matrix[0])` is the number of rows: `2`.

Exact output:

```text
8 6 2
```

---

### Question 15: String storage and format specifiers

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char word[] = "RAM";

    printf("%c %zu %d %s\n", word[1], sizeof(word), (int)word[3], word);
    printf("%zu %zu\n", strlen(word), sizeof(word) - strlen(word));

    return 0;
}
```

**Answer & Explanation:**

Step 1: `word[] = "RAM"` creates this array:

```text
word[0] = 'R'
word[1] = 'A'
word[2] = 'M'
word[3] = '\0'
```

Step 2: First `printf`.

- `%c` with `word[1]` prints `A`.
- `%zu` with `sizeof(word)` prints `4`, because the null terminator is included.
- `%d` with `(int)word[3]` prints `0`, because `'\0'` has integer value 0.
- `%s` with `word` prints `RAM`.

First line:

```text
A 4 0 RAM
```

Step 3: Second `printf`.

- `strlen(word)` is `3`, because it excludes the null terminator.
- `sizeof(word) - strlen(word)` is `4 - 3 = 1`.

Exact output:

```text
A 4 0 RAM
3 1
```

---

### Question 16: Bounded formatting and truncation

**Q:** Trace the following complete C program and give the exact console output. Explain why the result is truncated.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char dst[6];
    int needed = snprintf(dst, sizeof(dst), "%s", "buffer");

    printf("%s\n", dst);
    printf("%d %zu\n", needed, strlen(dst));

    return 0;
}
```

**Answer & Explanation:**

Step 1: `dst` has 6 bytes total.

Step 2: `snprintf` writes at most `sizeof(dst) - 1` visible characters and then writes a null terminator, assuming the buffer size is greater than zero.

Step 3: The source string `"buffer"` has 6 visible characters. Only 5 visible characters fit in `dst[0..4]`; `dst[5]` is reserved for `'\0'`.

Step 4: Therefore `dst` contains:

```text
b u f f e \0
```

Step 5: `snprintf` returns the number of characters that would have been written if enough space were available, excluding the null terminator. For `"buffer"`, that is `6`.

Exact output:

```text
buffe
6 5
```

---

### Question 17: Function calls through pointers

**Q:** Trace the following complete C program and give the exact console output.

```c
#include <stdio.h>

static int add3(int x) {
    return x + 3;
}

static int twice(int x) {
    return x * 2;
}

int main(void) {
    int (*operation)(int) = add3;
    int value = 4;

    value = operation(value);
    operation = twice;
    value = operation(value);

    printf("%d\n", value);

    return 0;
}
```

**Answer & Explanation:**

Step 1: `operation` initially points to `add3`.

Step 2: `value = operation(value);` is `value = add3(4);`, so `value` becomes `7`.

Step 3: `operation = twice;` changes the function pointer target.

Step 4: `value = operation(value);` is now `value = twice(7);`, so `value` becomes `14`.

Exact output:

```text
14
```

Security note: function pointers are security-sensitive control data. If a memory corruption bug lets an attacker overwrite one, the program may call an unintended function.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 18: Missing null terminator

**Q:** Identify the bug in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>

int main(void) {
    char name[4];

    name[0] = 'O';
    name[1] = 'm';
    name[2] = 'a';
    name[3] = 'r';

    printf("Hello, %s\n", name);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `name` has exactly 4 bytes, and all 4 bytes are filled with visible characters. There is no space for the required C string terminator `'\0'`.

Step 2: Explain the impact. `printf("%s", name)` reads bytes until it finds a zero byte. Because `name` is not terminated, `printf` reads past the end of the array into adjacent stack memory. This is an out-of-bounds read and may leak data or crash.

Step 3: Secure refactor.

```c
#include <stdio.h>

int main(void) {
    char name[5];

    name[0] = 'O';
    name[1] = 'm';
    name[2] = 'a';
    name[3] = 'r';
    name[4] = '\0';

    printf("Hello, %s\n", name);

    return 0;
}
```

Step 4: Alternative safe style.

```c
#include <stdio.h>

int main(void) {
    char name[] = "Omar";

    printf("Hello, %s\n", name);

    return 0;
}
```

---

### Question 19: Unsafe command-line copy

**Q:** Identify all memory-safety bugs in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>
#include <string.h>

int main(int argc, char **argv) {
    char user[16];

    strcpy(user, argv[1]);
    printf("user=%s\n", user);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify bug 1: missing `argc` validation. If the program is run without an extra command-line argument, `argv[1]` is not a valid user string. Passing it to `strcpy` is invalid and may crash.

Step 2: Identify bug 2: unbounded copy. `strcpy` copies until it reaches `'\0'` in the source. If `argv[1]` is longer than 15 visible characters, it overflows `user`, because one byte must be reserved for the terminator.

Step 3: Identify bug 3: trust-boundary failure. Command-line input is attacker-controlled in this threat model and must be checked before use.

Step 4: Secure refactor using `snprintf` and truncation detection.

```c
#include <stdio.h>
#include <string.h>

int main(int argc, char **argv) {
    char user[16];
    int written;

    if (argc != 2) {
        fprintf(stderr, "usage: %s <user>\n", argv[0]);
        return 1;
    }

    written = snprintf(user, sizeof(user), "%s", argv[1]);
    if (written < 0 || (size_t)written >= sizeof(user)) {
        fprintf(stderr, "error: user name is too long\n");
        return 1;
    }

    printf("user=%s\n", user);

    return 0;
}
```

Step 5: Why this is safer. The code checks the trust boundary, bounds the copy, preserves null termination, and rejects truncation instead of silently changing the username.

---

### Question 20: Off-by-one out-of-bounds write

**Q:** Identify the bug in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>

int main(void) {
    int scores[4] = {10, 20, 30, 40};
    int i;

    for (i = 0; i <= 4; i++) {
        scores[i] = scores[i] + 1;
    }

    printf("%d %d %d %d\n", scores[0], scores[1], scores[2], scores[3]);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the valid index range. `scores` has 4 elements, so valid indices are `0`, `1`, `2`, and `3`.

Step 2: Identify the bug. The loop condition is:

```c
i <= 4
```

That means the final iteration uses `i == 4`, so the code writes to `scores[4]`, which is one element past the end of the array.

Step 3: Security impact. This is a spatial memory safety violation: an out-of-bounds write. Depending on stack layout, it may corrupt another local variable, a saved register, a canary, or other stack data.

Step 4: Secure refactor using an array-derived bound.

```c
#include <stdio.h>

int main(void) {
    int scores[4] = {10, 20, 30, 40};
    size_t i;
    size_t count = sizeof(scores) / sizeof(scores[0]);

    for (i = 0; i < count; i++) {
        scores[i] = scores[i] + 1;
    }

    printf("%d %d %d %d\n", scores[0], scores[1], scores[2], scores[3]);

    return 0;
}
```

Step 5: Exact output of the secure version.

```text
11 21 31 41
```

---

### Question 21: Out-of-bounds read caused by a stale length

**Q:** Identify the bug in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char message[] = "OK";
    const char secret[] = "TOKEN";
    size_t old_len = 8;
    size_t i;

    for (i = 0; i < old_len; i++) {
        putchar(message[i]);
    }
    putchar('\n');

    (void)secret;
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the mismatch. `message` contains `"OK"`, which occupies 3 bytes including the null terminator:

```text
message[0] = 'O'
message[1] = 'K'
message[2] = '\0'
```

Step 2: Identify the bug. The loop uses `old_len = 8`, a stale length from an older, longer version of the message. It reads `message[3]` through `message[7]`, which are out of bounds.

Step 3: Security impact. This is a spatial out-of-bounds read. It can disclose adjacent memory if those bytes are printed or sent over a network. The `secret` object is not guaranteed to be adjacent, but the pattern is the same as real infoleak bugs: the program trusts an incorrect length.

Step 4: Secure refactor using the actual string length.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char message[] = "OK";
    const char secret[] = "TOKEN";
    size_t len = strlen(message);
    size_t i;

    for (i = 0; i < len; i++) {
        putchar(message[i]);
    }
    putchar('\n');

    (void)secret;
    return 0;
}
```

Step 5: Exact output of the secure version.

```text
OK
```

---

### Question 22: `strncpy` is bounded but not automatically safe

**Q:** Identify the bug in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char dst[8];
    const char *src = "SECURECODING";

    memset(dst, 'X', sizeof(dst));
    strncpy(dst, src, sizeof(dst));

    printf("%s\n", dst);

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the misleading assumption. `strncpy` is bounded, but if the source is at least as long as the bound, it does not append a null terminator.

Step 2: Apply that rule here. `dst` has 8 bytes. `src` has more than 8 visible characters. Therefore:

```text
dst = {'S','E','C','U','R','E','C','O'}
```

No `'\0'` is written.

Step 3: Security impact. `printf("%s", dst)` reads past the end of `dst` until it happens to find a zero byte. This is an out-of-bounds read and potential information disclosure.

Step 4: Secure refactor with explicit termination and truncation detection.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char dst[8];
    const char *src = "SECURECODING";
    int written;

    written = snprintf(dst, sizeof(dst), "%s", src);
    if (written < 0 || (size_t)written >= sizeof(dst)) {
        fprintf(stderr, "error: source string is too long\n");
        return 1;
    }

    printf("%s\n", dst);

    return 0;
}
```

Step 5: Why rejection is better than silent truncation in security-sensitive code. If a username, path, key name, or policy label is silently shortened, later checks may apply to a different value from the one the user supplied. Rejecting overlong input keeps control flow and data semantics explicit.

---

### Question 23: Format string vulnerability without an overflow

**Q:** Identify the bug in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc != 2) {
        return 1;
    }

    printf(argv[1]);
    putchar('\n');

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the trust boundary. `argv[1]` is command-line input controlled by whoever invokes the program.

Step 2: Identify the bug. The program uses attacker-controlled data as the **format string**:

```c
printf(argv[1]);
```

Step 3: Explain why this is dangerous. Format specifiers such as `%p`, `%x`, and `%s` cause `printf` to read arguments that were never provided. This can disclose stack contents, pointers, and other process data. Leaked pointers can weaken or defeat ASLR. The `%n` specifier is especially dangerous because it writes through a pointer argument.

Step 4: This vulnerability does not require a buffer overflow. The bug is direct misuse of a variadic formatting API at a trust boundary.

Step 5: Secure refactor.

```c
#include <stdio.h>

int main(int argc, char **argv) {
    if (argc != 2) {
        return 1;
    }

    printf("%s\n", argv[1]);

    return 0;
}
```

Step 6: Why this is safe. The format string is now a trusted string literal. The untrusted input is passed only as data for `%s`.

---

### Question 24: Use-after-free and stale pointers

**Q:** Identify the bug in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Session {
    char name[16];
    int is_admin;
};

int main(void) {
    struct Session *session = malloc(sizeof(*session));
    if (session == NULL) {
        return 1;
    }

    strcpy(session->name, "guest");
    session->is_admin = 0;

    free(session);

    if (session->is_admin) {
        puts("admin");
    } else {
        puts("guest");
    }

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. After:

```c
free(session);
```

the object that `session` pointed to no longer belongs to the program. Reading `session->is_admin` is a use-after-free.

Step 2: Classify it. This is a temporal memory safety violation. The pointer value still exists, but the pointed-to allocation's lifetime has ended.

Step 3: Explain exploitability. Freed heap memory may be reused by later allocations. In more complex code, an attacker may influence the reused contents so that the stale pointer reads attacker-controlled data or calls through an overwritten function pointer.

Step 4: Secure refactor by not using the object after `free` and by nulling the pointer after release.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Session {
    char name[16];
    int is_admin;
};

int main(void) {
    struct Session *session = malloc(sizeof(*session));
    int was_admin;

    if (session == NULL) {
        return 1;
    }

    strcpy(session->name, "guest");
    session->is_admin = 0;

    was_admin = session->is_admin;

    free(session);
    session = NULL;

    if (was_admin) {
        puts("admin");
    } else {
        puts("guest");
    }

    return 0;
}
```

Step 5: Exact output of the secure version.

```text
guest
```

---

### Question 25: Incorrect `realloc` pattern

**Q:** Identify the bug in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t count = 8;
    int *items = malloc(count * sizeof(*items));

    if (items == NULL) {
        return 1;
    }

    count = 16;
    items = realloc(items, count * sizeof(*items));
    if (items == NULL) {
        return 1;
    }

    printf("%zu\n", count);
    free(items);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. Assigning directly back to `items` is unsafe:

```c
items = realloc(items, count * sizeof(*items));
```

If `realloc` fails, it returns `NULL` and leaves the original allocation untouched. The direct assignment overwrites the only pointer to the old allocation, causing a memory leak.

Step 2: Identify the second missing check. The multiplication:

```c
count * sizeof(*items)
```

could overflow `size_t` for large `count`, producing an allocation smaller than intended.

Step 3: Secure refactor using a temporary pointer and an overflow check.

```c
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t count = 8;
    int *items;
    int *tmp;

    if (count > SIZE_MAX / sizeof(*items)) {
        return 1;
    }

    items = malloc(count * sizeof(*items));
    if (items == NULL) {
        return 1;
    }

    count = 16;
    if (count > SIZE_MAX / sizeof(*items)) {
        free(items);
        return 1;
    }

    tmp = realloc(items, count * sizeof(*items));
    if (tmp == NULL) {
        free(items);
        return 1;
    }

    items = tmp;

    printf("%zu\n", count);
    free(items);
    return 0;
}
```

Step 4: Exact output of the secure version, assuming allocation succeeds.

```text
16
```

---

### Question 26: Heartbleed-style length validation failure

**Q:** Identify the bug in the following complete C program. Then provide a secure, complete version.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    unsigned char request[4] = {'P', 'I', 'N', 'G'};
    unsigned short claimed_len = 12;
    unsigned char response[16];

    memcpy(response, request, claimed_len);

    fwrite(response, 1, claimed_len, stdout);
    putchar('\n');

    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the trust-boundary pattern. `claimed_len` represents a length field. In real protocol code, such a value often comes from a peer and must be treated as untrusted.

Step 2: Identify the first bug. `request` has only 4 bytes, but the program copies 12 bytes from it:

```c
memcpy(response, request, claimed_len);
```

This is an out-of-bounds read from `request`.

Step 3: Identify the second potential bug. The destination `response` has 16 bytes, so this specific `claimed_len` does not overflow the destination. But if `claimed_len` were greater than 16, the same code would also become an out-of-bounds write.

Step 4: Explain security impact. This is the same pattern as Heartbleed: trusting a claimed length rather than verifying it against the actual received payload size. The response may contain bytes copied from adjacent memory.

Step 5: Secure refactor by validating against both source and destination sizes before copying.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    unsigned char request[4] = {'P', 'I', 'N', 'G'};
    unsigned short claimed_len = 12;
    unsigned char response[16];
    size_t actual_len = sizeof(request);

    if (claimed_len > actual_len || claimed_len > sizeof(response)) {
        fprintf(stderr, "invalid length\n");
        return 1;
    }

    memcpy(response, request, claimed_len);

    fwrite(response, 1, claimed_len, stdout);
    putchar('\n');

    return 0;
}
```

Step 6: Behaviour of the secure version. With `claimed_len = 12`, the program rejects the request and prints an error instead of copying beyond the valid payload.

---

## Final Exam Checklist

- Define memory safety as protection against memory-access bugs, enforced at compile time and/or runtime.
- Explain C's deliberate safety/performance trade-off.
- Distinguish spatial safety from temporal safety.
- State that undefined behaviour invalidates the whole execution, even if the program appears to work.
- Explain address spaces, static mappings, stack, heap, and memory permissions.
- Know that `call` pushes a return address and `ret` pops and jumps to it.
- Track valid array indices and remember that C arrays are zero-indexed.
- Account for null terminators in C strings.
- Use `sizeof array / sizeof array[0]` when the array is still in scope as an actual array.
- Calculate struct padding from each member's alignment.
- Calculate row-major two-dimensional array offsets.
- Treat command-line arguments, environment variables, files, network messages, and IPC as trust boundaries.
- Avoid `strcpy`, `sprintf`, unchecked `memcpy`, user-controlled format strings, and direct assignment from `realloc`.
- Remember that `strncpy` may leave the destination unterminated.
- Pair static analysis with dynamic analysis; use sanitizers and fuzzing as complementary tools.
- Pair each runtime defence with its limitation: NX versus ROP, ASLR versus infoleaks, canaries versus leaks/non-contiguous writes, RELRO versus other function pointers, and CFI versus overly broad valid target sets.
