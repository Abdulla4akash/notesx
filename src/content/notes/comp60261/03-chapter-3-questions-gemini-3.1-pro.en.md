---
subject: COMP60261
chapter: 3
title: "Chapter 3 Exam Questions - Gemini 3.1 Pro"
language: "en"
---

# Chapter 3: Pointers in C
## Practice Exam Set
**Author:** Gemini 3.1 Pro

---

### Part 1: Conceptual & Security Fundamentals

**Q: Explain the difference between passing arguments by value and passing them by reference in C. Why is passing by reference important for performance when dealing with large custom data structures?**

**Answer & Explanation:**
* **Passing by Value:** When a function is called, a copy of each argument's value is made and placed in the newly created stack frame for the called function's parameters. Any modifications to these parameters inside the function do not affect the original variables in the caller's context.
* **Passing by Reference (using Pointers):** Instead of passing the data itself, the memory address of the data is passed as a pointer. The called function can use the dereference operator (`*`) to modify the value stored at that address, directly affecting the variables in the caller's memory context.
* **Performance Benefit:** Pointers are typically 8 bytes on modern 64-bit architectures, regardless of the size of the data they point to. If a `struct` is hundreds of bytes large, passing it by value requires copying the entire hundreds of bytes into the new stack frame. Passing it by reference requires copying only the 8-byte address, making it vastly more efficient and avoiding unnecessary memory overhead.

---

**Q: In the context of the virtual address space, what does a function pointer point to, and how is it different from a standard data pointer? Describe one security risk associated with function pointers.**

**Answer & Explanation:**
* **Function Pointer vs Data Pointer:** A standard data pointer stores the memory address of a variable (like an `int` or a `struct`). A function pointer stores the memory address of the first byte of executable machine code for a given function in the program's text/code segment.
* **Security Risk:** Because function pointers determine control flow, they are high-value targets for attackers. If a vulnerability (like a buffer overflow or use-after-free) allows an attacker to overwrite a function pointer's value in memory, the program will jump to the attacker's supplied address when the function pointer is called. This can lead to arbitrary code execution (Control Flow Hijacking).

---

### Part 2: Memory & Storage Size Calculations

**Q: Consider a 64-bit architecture where pointers are 8 bytes long and integers are 4 bytes long. Given the following declarations:**

```c
int val = 42;
int *p1 = &val;
int **p2 = &p1;
int ***p3 = &p2;
```

**If the variable `val` is stored at memory address `0x1000`, `p1` at `0x2000`, `p2` at `0x3000`, and `p3` at `0x4000`, calculate the exact memory address and the value that will be printed by the following statement:**

```c
printf("Address: %p, Value: %d\n", p2, **p2);
```

**Answer & Explanation:**
1. **Address (`p2`):** The value of `p2` itself is the memory address of `p1`. According to the problem statement, `p1` is stored at `0x2000`. Thus, `p2` evaluates to `0x2000`.
2. **Value (`**p2`):**
   * `p2` points to `p1`.
   * `*p2` dereferences `p2`, yielding the value of `p1`. The value of `p1` is the address of `val` (`0x1000`).
   * `**p2` dereferences `*p2` (which is `0x1000`), yielding the value stored at `val`. The value of `val` is `42`.
* **Output Printed:** `Address: 0x2000, Value: 42`

---

### Part 3: Code Tracing & Output Prediction

**Q: Trace the execution of the following C program. What will be the exact console output?**

```c
#include <stdio.h>

typedef struct {
    int id;
    float score;
    char *name;
} Student;

void update_student(Student *s) {
    s->id += 10;
    (*s).score -= 5.0;
}

int main() {
    Student st = {1, 95.5, "Alice"};
    Student *ptr = &st;
    
    update_student(ptr);
    
    printf("ID: %d, Score: %.1f, Name: %s\n", st.id, ptr->score, (*ptr).name);
    return 0;
}
```

**Answer & Explanation:**
1. In `main`, the `Student st` is initialized with `id = 1`, `score = 95.5`, and `name = "Alice"`.
2. A pointer `ptr` is created pointing to `st`.
3. `update_student(ptr)` is called, passing the address of `st`.
   * `s->id += 10;` increments the `id` field of the struct pointed to by `s` (which is `st`) by 10. `st.id` becomes `11`.
   * `(*s).score -= 5.0;` is equivalent to `s->score -= 5.0;`. It decreases the `score` field by `5.0`. `st.score` becomes `90.5`.
4. The `printf` statement accesses the modified `st`:
   * `st.id` evaluates to `11`.
   * `ptr->score` evaluates to `90.5`.
   * `(*ptr).name` evaluates to `"Alice"`.
* **Exact Output:** 
  ```text
  ID: 11, Score: 90.5, Name: Alice
  ```

---

### Part 4: Bug Identification & Secure Refactoring

**Q: The following program attempts to use a function to initialize two integers to `100` and `200` respectively. Identify the bug that prevents this from working as intended, and rewrite the code securely.**

```c
#include <stdio.h>

void initialize_values(int a, int b) {
    a = 100;
    b = 200;
}

int main() {
    int x = 0;
    int y = 0;
    
    initialize_values(x, y);
    
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
```

**Answer & Explanation:**
* **Bug Identification:** The function `initialize_values` accepts its parameters by value. When `initialize_values(x, y)` is called, the values of `x` (0) and `y` (0) are copied into the local variables `a` and `b` inside the function's stack frame. The assignments `a = 100;` and `b = 200;` modify these local copies, not the original variables `x` and `y` in `main`. When the function returns, `x` and `y` remain `0`, and the printed output will be `x = 0, y = 0`.
* **Secure Refactoring:** To allow the function to modify the caller's context, the parameters must be passed by reference using pointers.

```c
#include <stdio.h>

void initialize_values(int *a, int *b) {
    *a = 100;
    *b = 200;
}

int main() {
    int x = 0;
    int y = 0;
    
    // Pass the memory addresses of x and y
    initialize_values(&x, &y);
    
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
```
