---
subject: COMP60261
chapter: 6
title: "Chapter 6 Exam Questions - Gemini 3.1 Pro"
language: "en"
---

# Chapter 6: Anatomy of a Program in Memory
## Practice Exam Set
**Author:** Gemini 3.1 Pro

---

### Part 1: Conceptual & Security Fundamentals

**Q: Explain the role of the stack during a function call (`CALL` instruction) and function return (`RET` instruction) in the x86-64 architecture. From a security perspective, why is this mechanism highly vulnerable to buffer overflows?**

**Answer & Explanation:**
* **Function Call (`CALL`):** When the CPU executes a `CALL` instruction, it automatically pushes the *return address* (the memory address of the instruction immediately following the `CALL`) onto the stack. It then jumps to the target function's machine code.
* **Function Return (`RET`):** When the target function finishes, it executes a `RET` instruction. The CPU pops the top value off the stack, assuming it is the valid return address, and jumps back to that address to resume the calling function.
* **Security Vulnerability:** Because the stack stores both control flow data (return addresses) and user data (local variables like character arrays) in the same contiguous memory region, a buffer overflow in a local array can allow an attacker to overwrite the adjacent return address. When `RET` is executed, the CPU will pop the attacker-controlled address and jump to it, granting the attacker control over the program's execution flow.

---

### Part 2: Memory & Storage Size Calculations

**Q: Consider a program running on a 64-bit Linux system. Based on the System V x86-64 ABI calling convention, how are the arguments passed for the following C function call?**
```c
int result = process_data(10, 20, 30, 40, 50, 60, 70, 80);
```
**Specifically, calculate how many bytes of data must be pushed onto the stack to pass these arguments before the `CALL` instruction is executed. (Assume all integer arguments are expanded to 8 bytes / 64 bits when passed on the stack for alignment).**

**Answer & Explanation:**
1. **Calling Convention:** The System V ABI specifies that the first 6 integer/pointer arguments are passed via CPU registers in the following order: `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, and `%r9`.
2. **Argument Placement:** 
   * `10` -> `%rdi`
   * `20` -> `%rsi`
   * `30` -> `%rdx`
   * `40` -> `%rcx`
   * `50` -> `%r8`
   * `60` -> `%r9`
   * Arguments `70` (7th) and `80` (8th) cannot fit in the designated registers and must be pushed onto the stack (in reverse order: 80 then 70).
3. **Calculation:** Since 2 arguments are pushed onto the stack, and each occupies 8 bytes (64 bits), a total of $2 \times 8 =$ **16 bytes** of data are pushed onto the stack to pass the remaining arguments.

---

### Part 3: Code Tracing & Output Prediction

**Q: Analyze the following pseudo-C code alongside its conceptual memory layout. What will this program print?**

```c
#include <stdio.h>

int global_counter = 5; // Resides in .data segment

void increment() {
    int local_counter = 5; // Resides in the stack
    global_counter++;
    local_counter++;
    printf("Global: %d, Local: %d\n", global_counter, local_counter);
}

int main() {
    increment();
    increment();
    return 0;
}
```

**Answer & Explanation:**
1. **First Call to `increment()`:**
   * `global_counter` (static memory) starts at `5`. It is incremented to `6`.
   * A new stack frame is created. `local_counter` is initialized to `5`. It is incremented to `6`.
   * **Prints:** `Global: 6, Local: 6`
   * The stack frame is destroyed.
2. **Second Call to `increment()`:**
   * `global_counter` persists across function calls. It starts at `6` and is incremented to `7`.
   * A new stack frame is created. A *brand new* `local_counter` is initialized to `5`. It is incremented to `6`.
   * **Prints:** `Global: 7, Local: 6`
* **Exact Output:** 
  ```text
  Global: 6, Local: 6
  Global: 7, Local: 6
  ```

---

### Part 4: Bug Identification & Secure Refactoring

**Q: A developer wrote a tool to parse binary headers. Identify the critical security flaw related to memory segments and returning local variables. Provide a secure refactored version.**

```c
#include <stdio.h>
#include <string.h>

char* get_status_message(int code) {
    char message[64]; // Allocated on the stack
    
    if (code == 200) {
        strcpy(message, "OK");
    } else {
        strcpy(message, "ERROR");
    }
    
    return message; // Bug here
}

int main() {
    char *msg = get_status_message(200);
    printf("Status: %s\n", msg);
    return 0;
}
```

**Answer & Explanation:**
* **Bug Identification:** The `message` array is allocated as a local variable on the stack inside `get_status_message`. When the function returns, its stack frame is logically deallocated and considered invalid. The pointer returned points to this now-invalid memory area (a "Dangling Pointer"). When `main` attempts to `printf` it, the stack memory may have already been overwritten, resulting in garbage data, a crash, or an exploitable Use-After-Free condition.
* **Secure Refactoring:** Either allocate the memory dynamically on the heap (`malloc`) so it survives the function return, pass a caller-allocated buffer into the function, or return a pointer to a static read-only string literal.

*Refactored Version (Static Strings):*
```c
#include <stdio.h>

// Returns a pointer to a string literal residing in the read-only data segment (.rodata)
const char* get_status_message(int code) {
    if (code == 200) {
        return "OK";
    } else {
        return "ERROR";
    }
}

int main() {
    const char *msg = get_status_message(200);
    printf("Status: %s\n", msg);
    return 0;
}
```
