---
subject: COMP60261
chapter: 5
title: "Chapter 5 Exam Questions - Gemini 3.1 Pro"
language: "en"
---

# Chapter 5: The C Standard Library
## Practice Exam Set
**Author:** Gemini 3.1 Pro

---

### Part 1: Conceptual & Security Fundamentals

**Q: In the C standard library (`string.h`), what is the critical security difference between `strcpy` and `strncpy`? Why is `strcpy` widely considered unsafe for handling user input?**

**Answer & Explanation:**
* **Difference:** `strcpy(dest, src)` copies characters from the source string to the destination buffer until it encounters the null-terminator (`'\0'`) in the source. `strncpy(dest, src, n)` behaves similarly but takes an additional parameter `n`, which specifies the maximum number of characters to copy.
* **Security Risk:** `strcpy` is considered unsafe because it performs no bounds checking on the destination buffer. If the `src` string is larger than the `dest` buffer, `strcpy` will blindly continue writing past the end of `dest` into adjacent memory. This leads to a **Buffer Overflow** vulnerability, allowing an attacker to corrupt memory, overwrite adjacent variables, or overwrite return addresses to hijack program execution. By using `strncpy`, developers can strictly limit the copy operation to the size of the destination buffer.

---

### Part 2: Memory & Storage Size Calculations

**Q: Consider the following C struct and array declarations:**

```c
#include <string.h>

typedef struct {
    int id;
    double balance;
    char name[16];
} Account;

Account db_old[50];
Account db_new[50];
```

**Assume you are on a 64-bit architecture where `int` is 4 bytes and `double` is 8 bytes. You want to copy the entire contents of `db_old` into `db_new` using `memcpy`. Write the exact `memcpy` statement to achieve this. Exactly how many bytes will be copied in this operation? (Assume default struct padding where `id` (4 bytes) is padded with 4 bytes to align the 8-byte `double`).**

**Answer & Explanation:**
1. **`memcpy` Statement:**
   ```c
   memcpy(db_new, db_old, 50 * sizeof(Account));
   ```
2. **Memory Calculation:**
   First, calculate `sizeof(Account)`:
   * `id` = 4 bytes + 4 bytes of padding (to align the `double`) = 8 bytes.
   * `balance` = 8 bytes.
   * `name[16]` = 16 bytes.
   * Total size of one `Account` = $8 + 8 + 16 = 32$ bytes.
   * Total bytes to copy = 50 items $\times$ 32 bytes/item = **1600 bytes**.

---

### Part 3: Code Tracing & Output Prediction

**Q: Trace the execution of the following C program. What will be printed to the console?**

```c
#include <stdio.h>
#include <string.h>

int main() {
    char s1[32];
    char s2[32];
    
    strcpy(s1, "Secure ");
    strcpy(s2, "Systems ");
    
    strncat(s1, "Architecture", 32 - strlen(s1) - 1);
    
    printf("Result: %s\n", s1);
    
    return 0;
}
```

**Answer & Explanation:**
1. `s1` is initialized with the string `"Secure "` (7 characters, plus `'\0'`).
2. `s2` is initialized with `"Systems "` (8 characters, plus `'\0'`).
3. The `strncat` function is called to concatenate `"Architecture"` onto `s1`.
   * `strlen(s1)` evaluates to `7`.
   * The third parameter (max characters to concatenate) is `32 - 7 - 1 = 24`.
   * Since `"Architecture"` is 12 characters long, it fits entirely within the 24-character limit.
4. `s1` becomes `"Secure Architecture"`.
* **Exact Output:** 
  ```text
  Result: Secure Architecture
  ```

---

### Part 4: Bug Identification & Secure Refactoring

**Q: Identify the security vulnerability in the following program that attempts to read user input. Rewrite the program securely using a safer standard library function.**

```c
#include <stdio.h>

int main() {
    char username[16];
    
    printf("Enter your username: ");
    // Vulnerable input reading
    scanf("%s", username); 
    
    printf("Welcome, %s!\n", username);
    return 0;
}
```

**Answer & Explanation:**
* **Bug Identification:** The `scanf("%s", username)` function reads a string from standard input until it encounters whitespace. Crucially, it **does not check the size of the destination buffer**. If a user enters a string longer than 15 characters (e.g., a 100-character string), `scanf` will write past the end of the `username` array, causing a classic **Buffer Overflow**.
* **Secure Refactoring:** Replace `scanf` with `fgets`, which takes the size of the destination buffer as an explicit parameter, ensuring that it never reads more characters than the buffer can hold.

```c
#include <stdio.h>

int main() {
    char username[16];
    
    printf("Enter your username: ");
    // Secure input reading: limits input to 15 chars + '\0'
    fgets(username, 16, stdin);
    
    printf("Welcome, %s!\n", username);
    return 0;
}
```
