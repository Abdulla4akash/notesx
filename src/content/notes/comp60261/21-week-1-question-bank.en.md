---
subject: COMP60261
chapter: 21
title: "Week 1 — Question Bank"
language: en
---

# Week 1 — Core Concepts and C: Worked Question Bank

Drills the Week 1 material: threat modelling and TCB reasoning, the CIA triad, attack surface, and the C constructs (pointers, dynamic allocation, libc string handling) whose failure modes drive the rest of the unit.

## Task types drilled

1. **Definitional precision** — state a concept exactly enough to apply it.
2. **TCB enumeration** — list what must be correct for a stated property.
3. **Threat-model construction** — turn an informal scenario into assets/capabilities/goals/out-of-scope.
4. **CIA classification** — map a concrete failure onto the violated property.
5. **C code defect identification** — find the bug and state the consequence.
6. **Size and signedness arithmetic** — reason about overflow in allocation and bounds logic.
7. **libc function selection** — choose a safe function and justify against the alternatives.

---

# Section A — Recall and definitional drills

## Q1. Define the TCB, and explain why "components I trust" is the wrong definition.

### Solution

**Step 1: State the definition.** The Trusted Computing Base is the set of components that **must be correct** for a stated security property to hold.

**Step 2: Identify the error in the alternative.** "Components I trust" is a statement about the analyst's beliefs. The TCB is a statement about **dependency structure** — what is load-bearing regardless of anyone's confidence.

**Step 3: Show why the distinction matters.** You may distrust a component that is nonetheless in your TCB (a kernel you consider buggy is still fatal if it fails). Conversely you may trust something outside it. Defining the TCB by belief lets you shrink it by optimism rather than by design, which is exactly the error the concept exists to prevent.

**Answer.** The TCB is what must be correct, not what is believed correct; it is determined by the system's structure and the property being claimed.

---

## Q2. A design encrypts data client-side before storing it on a cloud provider's disks. Has the provider left the TCB?

### Solution

**Step 1: Fix the property.** The TCB is property-relative, so answer separately per property.

**Step 2: Confidentiality.** The provider sees only ciphertext, so it need not be correct for confidentiality to hold. It **has left** the confidentiality TCB. The cipher implementation and key management have entered it.

**Step 3: Integrity.** Encryption alone does not prevent deletion or replacement of ciphertext. Without authenticated encryption plus versioning, the provider **remains** in the integrity TCB.

**Step 4: Availability.** The provider can always refuse to serve data. It **remains** in the availability TCB unconditionally.

**Answer.** Partially — removed from confidentiality, retained for availability, and retained for integrity unless authenticated encryption is used. This is the "remove components from the TCB" move, and it is always property-specific.

---

## Q3. Why is "unused features still count" a claim about attack surface rather than about code quality?

### Solution

**Step 1: Recall the definition.** Attack surface is the set of points at which an adversary can interact with the system.

**Step 2: Apply it.** Reachability is determined by the adversary's options, not by the developer's intent. A parser that no application code path calls is still surface if an attacker can reach it — via a file type association, a protocol field, or a linked library entry point.

**Step 3: Draw the consequence.** Therefore surface is reduced by **removing or disabling** the feature, not by reviewing it more carefully. Validation hardens an entry point while keeping it.

**Answer.** Because surface is defined by adversary reachability, not by intended use; unreached-by-design is not the same as unreachable.

---

## Q4. Classify each failure by CIA property, and name the one property most often left unprotected.

(a) A timing difference reveals whether a username exists. (b) An attacker overwrites an `is_admin` flag. (c) A process spins consuming all CPU. (d) A leaked pointer defeats ASLR.

### Solution

**Step 1: (a)** A timing side channel discloses information — **confidentiality**.

**Step 2: (b)** Unauthorised modification of state — **integrity**.

**Step 3: (c)** Legitimate users cannot proceed — **availability**.

**Step 4: (d)** The leak itself is disclosure — **confidentiality** — though its value is as an enabler for a later integrity attack. Classify the primitive, then note the chain.

**Step 5: Identify the neglected property.** **Availability.** Mechanisms routinely deliver confidentiality and integrity while providing nothing against exhaustion or refusal — a pattern recurring in compartmentalisation (Week 5) and TEEs (Week 4).

---

# Section B — Applied and multi-step

## Q5. Build a threat model for a setuid binary that reads a config file path from `argv[1]`.

### Solution

**Step 1: Assets.** The elevated privilege itself (the ability to act as the file owner, often root); any secrets the binary reads; integrity of files it writes.

**Step 2: Adversary capabilities.** Any local unprivileged user. They fully control `argv` and `argc`, the entire environment block, the current working directory, file descriptors inherited across `exec`, resource limits, and the filesystem contents at any path they can write. They can also win races by manipulating paths between check and use.

**Step 3: Adversary goals.** Execute code with elevated privilege; read a file they could not otherwise read; write a file they could not otherwise write.

**Step 4: Out of scope.** Attacks requiring root already; physical access; kernel vulnerabilities; side channels.

**Step 5: Derive obligations.** Every item in step 2 is a trust boundary crossing needing validation — including `argc` before indexing `argv[1]`, and the environment, which is inherited silently and is not visible in the source at the point of use.

**Answer.** The model's value is that step 2 surfaces the environment and the inherited descriptors, which reading the code alone would not suggest.

---

## Q6. Identify every defect and state the consequence.

```c
char *dup_prefix(const char *src, int n) {
    char *buf = malloc(n);
    strncpy(buf, src, n);
    return buf;
}
```

### Solution

**Step 1: Unchecked allocation.** `malloc` may return `NULL`; `strncpy` then dereferences it. Consequence: null-pointer dereference, a crash and hence an availability failure.

**Step 2: Signed parameter.** `n` is `int`. A negative `n` converts to a huge `size_t` at the `malloc` call. Either the allocation fails (returning `NULL`, see step 1) or, on the `strncpy`, the length argument is enormous. Consequence: potential massive out-of-bounds write.

**Step 3: Missing NUL termination.** If `strlen(src) >= n`, `strncpy` copies exactly `n` bytes and writes **no terminator**. The returned buffer is not a valid C string. Consequence: every later `strlen`/`printf` on it reads out of bounds — an infoleak, or a crash.

**Step 4: No room for the terminator.** Even conceptually, allocating `n` and wanting an `n`-character prefix leaves nowhere for the NUL.

**Step 5: Corrected version.**

```c
char *dup_prefix(const char *src, size_t n) {
    char *buf = malloc(n + 1);          /* room for terminator */
    if (!buf) return NULL;              /* check allocation */
    memcpy(buf, src, n);                /* caller guarantees n bytes readable */
    buf[n] = '\0';                      /* terminate explicitly */
    return buf;
}
```

**Answer.** Four defects: unchecked `malloc`, signed length, absent termination, and off-by-one on the allocation size. The signedness bug is the most dangerous because it converts a caller mistake into an arbitrary-length write.

---

## Q7. Explain precisely why `calloc(count, size)` is preferable to `malloc(count * size)`, with a worked overflow.

### Solution

**Step 1: State the mechanism.** `count * size` is computed in `size_t` arithmetic, which **wraps** on overflow rather than trapping.

**Step 2: Work an example.** On a 64-bit system, `size_t` is 64 bits, so the modulus is 2^64. Take `size = 16` and `count = 2^60`. Then

```
count * size = 2^60 * 16 = 2^64 ≡ 0  (mod 2^64)
```

so `malloc(0)` is called. It succeeds, returning a minimal (possibly zero-length) block.

**Step 3: Trace the consequence.** The caller believes it holds space for 2^60 elements and indexes accordingly. Every write past the tiny block is a **heap overflow**, with the attacker controlling how far.

**Step 4: Contrast `calloc`.** `calloc(count, size)` is required to detect overflow in the product and fail, returning `NULL`. It also zeroes the memory, removing uninitialised-read bugs.

**Answer.** Because the multiplication is the vulnerability: it silently wraps in `malloc`, whereas `calloc` is obliged to check it.

---

## Q8. A reviewer says "we use `strncpy` and `strncat` everywhere, so we are safe from overflows." Rebut with specifics.

### Solution

**Step 1: `strncpy` termination.** It does not NUL-terminate when the source is at least as long as the size argument. The result is an unterminated buffer, and the overflow simply moves to the next function that scans for a terminator.

**Step 2: `strncat` semantics.** Its size argument is the maximum number of **additional** characters, not the total destination size. Code passing `sizeof(dst)` overflows by up to `strlen(dst)` bytes — a very common error.

**Step 3: Correct arithmetic is itself error-prone.** The safe `strncat` bound is `sizeof(dst) - strlen(dst) - 1`, which is wrong if `dst` is unterminated (step 1) and underflows if `strlen(dst) >= sizeof(dst)`.

**Step 4: Truncation is silently undetectable.** Neither function reports that it truncated, so a security decision made on a truncated value can be wrong (e.g. a truncated path or hostname comparing equal to something it is not).

**Step 5: Recommend.** Prefer `snprintf`, which always terminates and returns the length it *wanted* to write, making truncation detectable:

```c
int need = snprintf(dst, sizeof dst, "%s%s", a, b);
if (need < 0 || (size_t)need >= sizeof dst) { /* handle truncation */ }
```

**Answer.** Bounded is not safe: `strncpy` may not terminate, `strncat`'s bound means something different from what most callers assume, and neither surfaces truncation.

---

## Q9. Why does undefined behaviour let the compiler delete a security check? Give the shape of the failure.

### Solution

**Step 1: State the licence.** The standard imposes no requirements on a program that executes UB. The optimiser may therefore assume UB **does not occur** and propagate that assumption.

**Step 2: Apply to a null check after use.**

```c
int v = p->field;          /* if p were NULL this is UB */
if (p == NULL) return -1;  /* so the compiler may assume p != NULL */
```

Because dereferencing `p` would be UB if `p` were `NULL`, the compiler infers `p != NULL` at that point and may **remove the check entirely**.

**Step 3: Apply to signed overflow.** A check written as `if (x + 100 < x)` to detect overflow is testing for a condition that is itself UB for signed `x`. The compiler may fold it to `false` and remove the branch.

**Step 4: State the general shape.** The programmer writes a check that is only meaningful *if* UB has already happened; the compiler reasons that UB has not happened; the check is dead code and is deleted.

**Answer.** UB is a premise the optimiser reasons from, not merely unpredictable execution — so checks predicated on UB having occurred get eliminated. Detect overflow *before* it occurs (compare against limits, or use checked builtins).

---

# Section C — Extended / exam-style

## Q10. "Memory unsafety in C is a bug, not a design decision." Argue against this, and state what follows for security policy.

### Solution

**Step 1: Establish the trade.** Bounds-checked indexing costs a comparison and branch per access. C omits it deliberately so that array access compiles to an address computation and a load. That is a **design choice** with a stated benefit, not an oversight.

**Step 2: Supply the corroborating evidence.** The absence of length metadata is systematic, not incidental — arrays decay to pointers, strings are NUL-terminated rather than length-prefixed, and `malloc` returns a bare address. A language that had merely forgotten bounds checking would still carry sizes somewhere.

**Step 3: Concede the counter-argument's kernel.** Individual vulnerabilities are of course bugs. The claim being rejected is about the *language*, not about particular defects.

**Step 4: Draw the policy consequence.** If unsafety is a design trade, then it cannot be fixed by exhorting developers to be careful — the language provides no mechanism to be careful *with*. Options become: pay the cost elsewhere (sanitizers, fuzzing, static analysis), enforce in hardware (MTE, CHERI), or change language. This is why memory-safe-language migration is a **security** argument at government-advisory level rather than a style preference.

**Step 5: State the residual difficulty.** The existing systems corpus is enormous and in C, so migration is slow, which is what makes mitigation (Weeks 2 and 5) necessary in the interim.

---

## Q11. Explain why C's string representation is a structural rather than incidental cause of insecurity.

### Solution

**Step 1: Name the representation.** A C string is a pointer to bytes terminated by a NUL sentinel; the length is not stored.

**Step 2: Identify the conflation.** The representation merges **data** with **metadata about the data's extent**. The length must be *recovered by scanning the data itself*.

**Step 3: Derive the failure modes.**
- The scan is unbounded, so a missing terminator reads past the object (`strlen`, `strcpy`).
- The terminator is an in-band value, so an attacker who can write or remove a NUL changes the apparent length of a buffer they do not own.
- Any function taking only a destination pointer cannot check anything, which is why `strcpy`/`strcat`/`sprintf` are unsafe by construction rather than by implementation.

**Step 4: Contrast the alternative.** A length-prefixed or (pointer, length) representation makes the extent unforgeable by data content and makes bounds checking possible at all.

**Step 5: Connect forward.** This is the same defect at a higher level as the pointer-without-metadata problem: authority to access a range is carried without any record of the range. Hardware capability designs address exactly this.

**Answer.** Structural, because the insecurity follows from the data representation itself, so every function built on it inherits the flaw.

---

## Q12. A colleague proposes dropping the threat-model section from a design document as "bureaucratic overhead." Give the strongest technical case against.

### Solution

**Step 1: Show that claims become unfalsifiable.** "Secure" has no truth value without a stated adversary. Reviewers cannot disagree with an unstated model, so review degenerates into taste.

**Step 2: Show that obligations become invisible.** Interface validation duties are *derived* from trust relationships (Q5, step 5). With no recorded model, the obligations exist but nobody knows which they are — the exact mechanism behind compartment interface vulnerabilities in Week 5, where code assumes a caller it no longer has.

**Step 3: Show that scope creep goes undetected.** Without a written out-of-scope list, a later change silently moves an in-scope adversary into a component that was never designed to resist it.

**Step 4: Show that the TCB cannot be computed.** The TCB is property- and adversary-relative, so no threat model means no defensible TCB statement, and hence no way to argue about assurance.

**Step 5: Offer the proportionate version.** The four bullets — assets, adversary capabilities, adversary goals, out of scope — are short. The overhead objection is to length, and the remedy is brevity, not omission. Note that the out-of-scope list is both the most-skipped and the most useful element.
