---
subject: COMP60261
chapter: 4
title: "Chapter 4 Exam Questions - Gemini 3.1 Pro"
language: "en"
---

# Chapter 4: Dynamic Memory Allocation in C
## Practice Exam Set
**Author:** Gemini 3.1 Pro

---

### Part 1: Conceptual & Security Fundamentals

**Q: Explain the primary limitation of static memory allocation (e.g., using variable-length arrays on the stack) when handling user input. Why is dynamic memory allocation (`malloc`) preferred in these scenarios, and what is the primary security risk if `malloc` is used incorrectly?**

**Answer & Explanation:**
* **Limitation of Static Allocation:** In C, local variables and variable-length arrays (VLAs) are allocated on the stack. The stack has a fixed, relatively small size (typically a few megabytes). If the size of an array depends on unvalidated user input, a user entering a massive number can exceed the stack boundary, causing a **Stack Overflow**, which results in a program crash.
* **Why Dynamic Allocation is Preferred:** Dynamic allocation (`malloc`) allocates memory on the **heap**, which is vastly larger than the stack. This allows programs to handle large, variable-sized structures at runtime safely without overflowing the stack.
* **Security Risk (Memory Leak):** If a programmer allocates memory using `malloc` but forgets to release it using `free()`, the memory remains allocated indefinitely. This is known as a **memory leak**. In secure systems, attackers can exploit memory leaks by repeatedly forcing the program to leak memory until the system runs out of RAM (Resource Starvation), leading to a Denial of Service (DoS) crash.

---

### Part 2: Memory & Storage Size Calculations

**Q: Suppose you are writing a program on a 64-bit architecture where `int` is 4 bytes and `char *` (pointer) is 8 bytes. You need to dynamically allocate an array of 500 integers. Write the exact C statement to perform this allocation. How many bytes in total will `malloc` request from the operating system for this array?**

**Answer & Explanation:**
* **C Statement:**
  ```c
  int *arr = (int *)malloc(500 * sizeof(int));
  ```
* **Byte Calculation:**
  The `sizeof(int)` evaluates to 4 bytes. 
  Total bytes = 500 $\times$ 4 = **2000 bytes**.
  `malloc` will attempt to find a contiguous 2000-byte block on the heap and return a pointer to its first byte.

---

### Part 3: Code Tracing & Output Prediction

**Q: Trace the execution of the following C program. What will be printed to the console? Assume the system has plenty of memory and `malloc` never fails.**

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *numbers = (int *)malloc(3 * sizeof(int));
    
    numbers[0] = 5;
    numbers[1] = 10;
    numbers[2] = 15;
    
    int sum = 0;
    for (int i = 0; i < 3; i++) {
        sum += numbers[i];
    }
    
    numbers[1] = sum;
    
    printf("Value: %d\n", numbers[1]);
    
    free(numbers);
    return 0;
}
```

**Answer & Explanation:**
1. A dynamically allocated array of 3 integers is created on the heap.
2. The elements are initialized: `numbers[0] = 5`, `numbers[1] = 10`, `numbers[2] = 15`.
3. The `for` loop calculates the sum of all elements: $5 + 10 + 15 = 30$.
4. The line `numbers[1] = sum;` replaces the value at index 1 (which was 10) with the new sum (30).
5. The `printf` statement outputs the value at `numbers[1]`.
* **Exact Output:**
  ```text
  Value: 30
  ```

---

### Part 4: Bug Identification & Secure Refactoring

**Q: Identify the two critical vulnerabilities/bugs in the following C code block. Rewrite the code securely to fix these issues.**

```c
#include <stdio.h>
#include <stdlib.h>

void process_data(int size) {
    int *buffer = (int *)malloc(size * sizeof(int));
    
    for (int i = 0; i < size; i++) {
        buffer[i] = i * 2;
    }
    
    printf("Processed %d items.\n", size);
}
```

**Answer & Explanation:**
* **Bug 1: Missing NULL Check.** The `malloc` function can fail and return `NULL` if the system is out of memory. The code immediately dereferences `buffer` in the `for` loop without checking. If `buffer` is `NULL`, this will cause a Segmentation Fault.
* **Bug 2: Memory Leak (Missing `free`).** The memory allocated for `buffer` is never released before the function exits. Since `buffer` is a local pointer, once `process_data` returns, the pointer is destroyed, and the allocated heap memory is orphaned permanently.
* **Secure Refactoring:**

```c
#include <stdio.h>
#include <stdlib.h>

void process_data(int size) {
    // 1. Allocate memory
    int *buffer = (int *)malloc(size * sizeof(int));
    
    // 2. Fix: Check for NULL to ensure allocation succeeded
    if (buffer == NULL) {
        printf("ERROR: Memory allocation failed.\n");
        return; // Alternatively, exit(-1);
    }
    
    // 3. Use the memory
    for (int i = 0; i < size; i++) {
        buffer[i] = i * 2;
    }
    printf("Processed %d items.\n", size);
    
    // 4. Fix: Release the memory to prevent memory leaks
    free(buffer);
}
```
