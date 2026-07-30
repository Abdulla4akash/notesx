---
subject: COMP60261
chapter: 2
title: "Chapter 2 Exam Questions - Gemini 3.1 Pro"
language: "en"
---

# Chapter 2: Brief Introduction to C
## Practice Exam Set
**Author:** Gemini 3.1 Pro

---

### Part 1: Conceptual & Security Fundamentals

**Q: C is often criticized for its lack of "memory safety." Explain what this means in the context of C arrays and strings. Why is this lack of memory safety considered a major security risk for operating systems and hypervisors?**

**Answer & Explanation:**
In C, memory safety is not enforced by the language runtime. The compiler does not perform automatic bounds checking when indexing into arrays or strings.
For example, if an array is declared as `char buf[10]`, accessing `buf[15]` is not stopped by the compiler or the language, resulting in undefined behavior. 
This is a critical security risk for system software (like OSes and hypervisors) because an attacker who can control array indices can read out-of-bounds memory (Information Disclosure) or overwrite adjacent memory locations, such as function return addresses (Buffer Overflow). This allows attackers to hijack the control flow of high-privilege programs.

---

**Q: Explain the purpose and relationship of `argc` and `argv` inside the `main` function signature `int main(int argc, char **argv)`. Why is `argc` guaranteed to be at least 1?**

**Answer & Explanation:**
* `argc` (Argument Count) is an integer indicating the total number of command-line arguments passed to the program.
* `argv` (Argument Vector) is an array of strings (specifically, pointers to characters) containing the exact text of each argument.
* `argc` is guaranteed to be at least 1 because the first element, `argv[0]`, always contains the name or the execution path of the program itself. Therefore, even if the user passes no additional parameters, `argc` evaluates to 1.

---

### Part 2: Memory & Storage Size Calculations

**Q: Assume you are compiling a program for an x86-64 architecture where `short` is 2 bytes, `int` is 4 bytes, `float` is 4 bytes, and `double` is 8 bytes. Consider the following struct declaration:**

```c
struct sensor_data {
    short id;
    int temperature;
    double pressure;
};
```
**Ignoring any potential compiler padding, calculate the total size of an array declared as `struct sensor_data readings[100];`. If `readings[0]` is located at memory address `0x2000`, what is the address of `readings[5]`?**

**Answer & Explanation:**
1. **Size of a single struct (without padding):**
   `sizeof(short)` + `sizeof(int)` + `sizeof(double)` = 2 + 4 + 8 = 14 bytes.
2. **Total size of the array:**
   14 bytes per struct $\times$ 100 structs = 1400 bytes.
3. **Memory Address Calculation:**
   Array elements are contiguous in memory. The offset to `readings[5]` is $5 \times 14 = 70$ bytes (which is $0x46$ in hexadecimal).
   Address of `readings[5]` = `0x2000` + `0x46` = `0x2046`.

---

### Part 3: Code Tracing & Output Prediction

**Q: Trace the execution of the following C program and determine the exact console output. Pay attention to format specifiers and 2-dimensional array memory layouts.**

```c
#include <stdio.h>

int main() {
    int matrix[2][3] = {
        {10, 20, 30},
        {40, 50, 60}
    };
    
    int val = matrix[1][1];
    val++;
    
    printf("%d, %d, %d\n", matrix[0][2], val, matrix[1][2]);
    return 0;
}
```

**Answer & Explanation:**
* `matrix[0][2]` refers to the 1st row (index 0), 3rd column (index 2), which holds the value **30**.
* `val` is initialized to `matrix[1][1]`. The 2nd row (index 1), 2nd column (index 1) holds the value **50**. The statement `val++` increments it to **51**.
* `matrix[1][2]` refers to the 2nd row (index 1), 3rd column (index 2), which holds the value **60**.
* The `printf` format string `%d, %d, %d\n` prints these integers separated by a comma and space.
* **Exact Output:** 
  ```text
  30, 51, 60
  ```

---

### Part 4: Bug Identification & Secure Refactoring

**Q: A junior developer wrote the following C function to create a string containing a standard welcome message. Identify the critical memory safety bug in this code. Provide a rewritten, secure version of the code that fixes the bug.**

```c
#include <stdio.h>

void print_welcome() {
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
* **Bug Identification:** In C, strings must always be terminated by a null character (`'\0'`). The array `greeting` allocates exactly 5 bytes. The code fills all 5 bytes with the characters `H`, `e`, `l`, `l`, `o`, leaving no room for the null-terminator. When `printf` attempts to read `%s`, it will continue reading past the bounds of the `greeting` array into adjacent stack memory until it arbitrarily finds a zero byte. This results in an out-of-bounds read and memory corruption.
* **Secure Refactoring:** Allocate an extra byte for the null-terminator (making the size 6) and explicitly add `'\0'` at the end.

```c
#include <stdio.h>

void print_welcome() {
    char greeting[6]; // Allocate 6 bytes (5 for chars + 1 for '\0')
    greeting[0] = 'H';
    greeting[1] = 'e';
    greeting[2] = 'l';
    greeting[3] = 'l';
    greeting[4] = 'o';
    greeting[5] = '\0'; // Add explicit null-termination
    
    printf("Message: %s\n", greeting);
}
```
