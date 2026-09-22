---
subject: COMP60261
chapter: 2
title: "Chapter 2 Exam Questions - Antigravity"
language: en
---

# COMP60261: Secure Computer Architecture and Systems
## Chapter 2 Exam Practice Questions & Solutions
**Author:** Antigravity AI Agent  
**Source Material:** COMP60261 Chapter 2 — Brief Introduction to C (`02-c-intro.md`)

---

## Part 1: Conceptual & Security Fundamentals

### Question 1 (Memory Safety & Systems Programming)
**Q:** Why is C extensively used for low-level systems programming (e.g., operating system kernels, hypervisors) despite its lack of memory safety? Explain two major advantages and one security risk associated with C.

**Answer & Explanation:**
* **Advantages:**
  1. **Low-Level Control & Hardware Access:** C allows direct hardware manipulation, raw pointer arithmetic, and explicit memory management without abstraction overhead.
  2. **Performance & Low Footprint:** Minimal runtime footprint with no garbage collection overhead, making execution fast and deterministic for high-performance computing (HPC) and embedded platforms.
* **Security Risk:**
  * **Lack of Memory Safety:** C compilers do not automatically perform array bounds checking or lifetime management. This leaves programs susceptible to memory corruption vulnerabilities (e.g., buffer overflows, use-after-free, uninitialized memory reads) that attackers can exploit.

---

### Question 2 (String Representation & Buffer Security)
**Q:** In C, how are strings represented in memory? What essential character must terminate a valid C string, and why can omitting this character cause a security vulnerability?

**Answer & Explanation:**
* **Representation:** Strings in C are contiguous arrays of `char` bytes ending with the null termination character `'\0'` (ASCII byte 0).
* **Vulnerability:** Standard C string functions (such as `printf("%s")`, `strcpy`, `strlen`) rely on finding `'\0'` to determine string length. If `'\0'` is missing or overwritten:
  1. **Out-of-bounds Read (Information Disclosure):** Functions will continue reading past the buffer into adjacent memory until a zero byte is encountered, exposing sensitive stack or heap data.
  2. **Buffer Overflow (Control Flow Hijacking):** Functions like `strcpy` will keep copying bytes until finding `'\0'`, overwriting adjacent stack frames or function return addresses.

---

### Question 3 (Command-Line Argument Safety)
**Q:** Consider the function signature `int main(int argc, char **argv)`. What do `argc` and `argv` represent, and why must a program always inspect `argc` before accessing `argv[1]`?

**Answer & Explanation:**
* `argc` (*argument count*): An integer representing the total number of command-line tokens passed. `argc` is always $\ge 1$ because `argv[0]` contains the program execution path.
* `argv` (*argument vector*): An array of string pointers (`char*`) containing the individual argument values.
* **Safety Reason:** Accessing `argv[1]` when `argc == 1` causes a **Segmentation Fault** or **Out-of-Bounds Memory Access** because `argv[1]` is `NULL` or unallocated memory. Programs must verify `if (argc > 1)` before referencing `argv[1]`.

---

## Part 2: Memory Layout & `sizeof` Calculations

### Question 4 (Type Storage & Memory Calculation)
**Q:** Assuming an x86-64 architecture where data types have the following sizes:
- `char`: 1 byte
- `short int`: 2 bytes
- `int`: 4 bytes
- `float`: 4 bytes
- `double`: 8 bytes
- `long int`: 8 bytes

Given the following array declaration:
```c
struct item {
    char code[8];
    float price;
    int quantity;
};
struct item inventory[5];
```
1. Calculate the total size in bytes occupied by one `struct item` instance (ignoring compiler padding).
2. Calculate the total memory size of the `inventory` array.
3. If `inventory[0]` starts at memory address `0x1000`, what is the starting memory address of `inventory[2]`?

**Answer & Explanation:**
1. **Single Struct Size:**
   $$\text{Size} = \text{sizeof}(\text{char}[8]) + \text{sizeof}(\text{float}) + \text{sizeof}(\text{int}) = 8 + 4 + 4 = 16 \text{ bytes}$$
2. **Array Total Size:**
   $$\text{Total Memory} = 5 \times 16 \text{ bytes} = 80 \text{ bytes}$$
3. **Address Calculation:**
   $$\text{Address of } \text{inventory}[2] = 0x1000 + (2 \times 16) = 0x1000 + 32_{10} = 0x1000 + 0x20 = 0x1020$$

---

## Part 3: Code Tracing & Output Prediction

### Question 5 (Format Specifiers & Tracing)
**Q:** What is the exact console output of the following C program?

```c
#include <stdio.h>

int main() {
    int arr[2][2] = {{10, 20}, {30, 40}};
    int x = 5;
    x *= 3;
    
    printf("%d, %d, %d\n", arr[1][0], x, arr[0][1]);
    return 0;
}
```

**Answer & Explanation:**
* `arr[1][0]` accesses the 2nd row, 1st column $\rightarrow 30$.
* `x *= 3` evaluates $5 \times 3 = 15$.
* `arr[0][1]` accesses the 1st row, 2nd column $\rightarrow 20$.
* **Console Output:**
  ```text
  30, 15, 20
  ```

---

## Part 4: Bug Identification & Secure Fixes

### Question 6 (Off-by-One Buffer Overflow)
**Q:** Identify the bug in the following C code snippet and write the corrected version.

```c
#include <stdio.h>

void greet_user() {
    char name[4];
    name[0] = 'B';
    name[1] = 'o';
    name[2] = 'b';
    name[3] = 'y';
    printf("Hello, %s!\n", name);
}
```

**Answer & Explanation:**
* **Bug:** The array `name` has size 4, and characters `'B'`, `'o'`, `'b'`, `'y'` fill all 4 available slots (`indices 0..3`). There is no space left for the mandatory null-terminator `'\0'`. When `printf("%s", name)` runs, it will read past `name[3]` into stack memory until it hits a random `0x00` byte, causing memory corruption or an information leak.
* **Corrected Code:**
```c
#include <stdio.h>

void greet_user() {
    char name[5]; // Allocate 5 bytes (4 for characters + 1 for '\0')
    name[0] = 'B';
    name[1] = 'o';
    name[2] = 'b';
    name[3] = 'y';
    name[4] = '\0'; // Explicit null-termination
    printf("Hello, %s!\n", name);
}
```

---

## AI Agent Prompt Specification

For reference by other AI agents evaluating or extending these exam materials:

```text
[SYSTEM PROMPT FOR EXAM QUESTION GENERATION]
Role: AI Assistant specialized in Secure Computer Architecture and C Memory Safety (COMP60261).
Task: Read the specified course notes (e.g., COMP60261 Chapter 2 slides/text).
Output Format: Markdown document compatible with Astro notes schema:
  - YAML Frontmatter: subject, chapter, title, language ("en").
  - Categorized Question Sections:
    1. Conceptual & Security Questions
    2. Memory Calculations (sizeof, struct layouts, pointer offsets)
    3. Code Tracing & Output Prediction
    4. Vulnerability Identification & Secure Code Refactoring
  - Every question MUST include a detailed, mathematically verified solution and explanation.
```
