---
subject: COMP60261
chapter: 7
title: "Chapter 7 Exam Questions - Gemini 3.1 Pro"
language: "en"
---

# Chapter 7: Memory Safety
## Practice Exam Set
**Author:** Gemini 3.1 Pro

---

### Part 1: Conceptual & Security Fundamentals

**Q: C and C++ are considered "memory unsafe" languages. Explain the difference between spatial memory safety and temporal memory safety. Provide one classic example of a vulnerability for each.**

**Answer & Explanation:**
* **Spatial Memory Safety:** This ensures that memory accesses are strictly constrained within the physical bounds of an allocated object or array. A violation occurs when a program reads or writes outside these legitimate bounds.
  * *Example:* A **Buffer Overflow**, where writing past the end of an array can overwrite adjacent variables or return addresses on the stack.
* **Temporal Memory Safety:** This ensures that memory is only accessed during the valid lifetime of its allocation (i.e., accessing memory at the right time).
  * *Example:* A **Use-After-Free (UAF)** or Dangling Pointer, where a program calls `free()` on a heap-allocated buffer but later attempts to dereference the pointer that still points to that deallocated space.

---

### Part 2: Memory & Storage Size Calculations

**Q: Consider an array defined as `short values[5];` on an architecture where `short` is 2 bytes. If the base address of `values` is `0x4000`, what specific memory address is accessed when the program attempts an out-of-bounds spatial violation by evaluating `values[6]`? How many bytes past the valid end of the array is this read?**

**Answer & Explanation:**
1. **Valid Bounds:** The array holds 5 elements (`values[0]` through `values[4]`).
   * Start address = `0x4000`.
   * Size in bytes = 5 elements $\times$ 2 bytes = 10 bytes.
   * End address (first invalid byte) = `0x400A`.
2. **Out-of-Bounds Address Calculation:**
   * Accessing `values[6]` means jumping 6 elements ahead of the base address.
   * Offset = 6 $\times$ 2 bytes = 12 bytes (`0x0C`).
   * Address accessed = `0x4000 + 0x0C = 0x400C`.
3. **Difference:** 
   The valid array ends precisely at `0x400A`. Accessing `0x400C` means the program reads **2 bytes** (from `0x400C` to `0x400D`) that are completely outside the allocated array, exactly 2 bytes past the valid end of the array.

---

### Part 3: Code Tracing & Output Prediction

**Q: In C, "Undefined Behavior" (UB) means the compiler can assume a condition never happens to optimize code, leading to bizarre execution results. Analyze the following C code demonstrating signed integer overflow. What will the compiler likely output, and why?**

```c
#include <stdio.h>
#include <limits.h>

int main() {
    int max = INT_MAX;
    
    // Check if adding 1 causes the integer to wrap around to a negative number
    if (max + 1 < max) {
        printf("Overflow detected!\n");
    } else {
        printf("No overflow.\n");
    }
    
    return 0;
}
```

**Answer & Explanation:**
* **What happens:** In C, signed integer overflow is explicitly defined as **Undefined Behavior**. Because the compiler assumes UB never happens in a correct program, it assumes that `x + 1` is *always* strictly greater than `x` for any valid signed integer `x`.
* **The Optimization:** The compiler optimizes away the `if (max + 1 < max)` check entirely, replacing it with `if (false)` or simply compiling the `else` branch.
* **Exact Output:** 
  ```text
  No overflow.
  ```
*(Note: If the code used `unsigned int` instead, it would wrap around deterministically to 0, which is well-defined behavior, and the overflow would be detected).*

---

### Part 4: Bug Identification & Secure Refactoring

**Q: A developer wrote a networking function to process incoming packets. Identify the two critical temporal memory safety bugs present in this code. Refactor the code to eliminate these vulnerabilities securely.**

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void process_packet(int packet_id) {
    char *buffer = malloc(256);
    
    if (packet_id < 0) {
        free(buffer);
        printf("Error: Invalid packet ID.\n");
        // Execution continues...
    }
    
    // Simulate reading packet data
    strcpy(buffer, "Packet Data payload");
    
    printf("Processed: %s\n", buffer);
    free(buffer);
}
```

**Answer & Explanation:**
* **Bug 1 (Use-After-Free):** If `packet_id < 0`, the program calls `free(buffer)` inside the `if` block but does not return. The execution continues, and the program executes `strcpy(buffer, ...)` on the deallocated pointer, causing a Use-After-Free violation.
* **Bug 2 (Double Free):** Following the Use-After-Free, the program hits the end of the function and calls `free(buffer)` a second time. Freeing the same memory address twice corrupts the heap allocator metadata, often leading to immediate crashes or exploitable states.
* **Secure Refactoring:** Add a `return;` statement inside the error-handling block so execution stops immediately after the first `free`, preventing both the Use-After-Free and the Double Free.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void process_packet(int packet_id) {
    char *buffer = malloc(256);
    
    if (buffer == NULL) return; // Always check malloc
    
    if (packet_id < 0) {
        free(buffer);
        printf("Error: Invalid packet ID.\n");
        return; // Secure Fix: Exit immediately to prevent UAF and Double Free
    }
    
    // Simulate reading packet data
    strcpy(buffer, "Packet Data payload");
    
    printf("Processed: %s\n", buffer);
    free(buffer);
}
```
