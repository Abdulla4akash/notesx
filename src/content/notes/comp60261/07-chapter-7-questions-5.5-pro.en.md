---
subject: COMP60261
chapter: 7
title: "Chapter 7 Exam Questions - 5.5 Pro"
language: "en"
---

# Chapter 7 Exam Practice Set: Hardware Fundamentals

**AI author:** 5.5 Pro  
**Source material:** COMP60261 Chapter 7 / Hardware Fundamentals notes on hardware as a security foundation, von Neumann architecture, integer pointers, memory-safety vulnerabilities, ARM PAC/BTI/MTE, CHERI, CHERIoT, and CHERI compartmentalisation.

Unless a question states otherwise, assume:

- A C implementation where `char` is 1 byte, `int` is 4 bytes, `double` is 8 bytes, and pointers are 8 bytes.
- 4 KB pages where page calculations are needed.
- Ordinary C structure layout: each field is aligned to its own alignment, and the final structure size is rounded up to the largest field alignment.
- ARM MTE uses 4-bit tags and 16-byte memory granules.
- CHERI teaching examples use 128-bit capabilities plus a separate 1-bit validity tag.
- Code snippets are designed for analysis. They are complete and compilable, but security examples may include a deliberately unsafe function that is not necessarily called on the unsafe path.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1: Hardware as an active security foundation

**Q:** The notes say hardware is not just a passive platform. Explain why hardware matters for security, and why software cannot fully secure itself if the attacker can corrupt software state.

**Answer & Explanation:**

Step 1: Define hardware in this context. Hardware is the physical execution substrate of the system: CPU, registers, memory, storage devices, buses, and related circuits.

Step 2: State the security claim. Software is malleable: it can be patched, bypassed, misconfigured, or corrupted by exploits.

Step 3: Explain the enforcement gap. A software-only rule is ultimately enforced by more software. If an attacker corrupts that enforcing software, the rule can fail.

Step 4: Explain the role of hardware. Hardware can enforce invariants below software, such as permission checks, execute-disable bits, pointer tags, or capability bounds.

Step 5: State the exam conclusion. Hardware matters because secure systems need an inflexible enforcement layer that compromised software cannot simply rewrite.

---

### Question 2: Von Neumann architecture as computing's "original sin"

**Q:** Why does the lecture describe the von Neumann architecture as computing's "original sin" for security?

**Answer & Explanation:**

Step 1: State the model. A von Neumann computer stores software instructions and application data in the same memory.

Step 2: Identify the first consequence. Code can be read or overwritten as data if protections do not prevent it.

Step 3: Identify the second consequence. Data can be interpreted as code if control flow is redirected to it and execution permissions allow it.

Step 4: Connect to exploitation. Buffer overflows, code injection, return-oriented programming, and jump-oriented programming all exploit the fact that bytes, addresses, and control flow are ultimately represented in ordinary memory.

Step 5: State the exam conclusion. The model is "fundamentally insecure" because it does not intrinsically separate code from data or give pointers security meaning.

---

### Question 3: Fetch, decode, execute, and the PC

**Q:** Describe the fetch-decode-execute cycle. Why is control over the program counter security-critical?

**Answer & Explanation:**

Step 1: Fetch. The control unit reads the next instruction from memory at the address held in the program counter, or PC.

Step 2: Decode. The CPU interprets the instruction to determine the operation, operands, and addressing mode.

Step 3: Execute. The CPU performs the operation, such as arithmetic, memory access, or control transfer.

Step 4: Write back. Results are stored in registers or memory, and the PC is updated to the next instruction or branch target.

Step 5: Link to process state. A process is an execution context including PC, register state, and memory.

Step 6: State the security point. If an attacker controls the PC, they control which instruction executes next. Control-flow attacks therefore aim to corrupt data that later becomes the PC, such as return addresses or function pointers.

---

### Question 4: Early computers without pointers

**Q:** Early machines used fixed physical addresses in instructions. Explain how self-modifying code allowed list traversal, and why this was problematic.

**Answer & Explanation:**

Step 1: State the limitation. The address of a memory operand was encoded directly into the instruction.

Step 2: Explain the workaround. To access consecutive list elements, a program could fetch one of its own instructions, increment the address field inside that instruction, store the modified instruction back, and execute it.

Step 3: Give the example. An instruction such as `LOAD 100` could be rewritten into `LOAD 101`, then `LOAD 102`, and so on.

Step 4: Explain the problem. The program was not only changing data; it was rewriting code. This makes reasoning, verification, caching, pipelining, and later code/data separation harder.

Step 5: State the exam conclusion. Self-modifying code solved an early hardware limitation but exposed the security and maintenance problems of treating code as writable data.

---

### Question 5: The B-line register

**Q:** What was the Manchester B-line register, and why was it a major step toward modern pointers?

**Answer & Explanation:**

Step 1: Define the B-line register. It was an early index register that held an offset used in address calculation.

Step 2: State the mechanism. The CPU combined a base address encoded in the instruction with the B-line register value.

`effective address = base address + B-register offset`

Step 3: Explain the benefit. The instruction itself no longer had to be modified to access the next array or list element.

Step 4: Connect to pointers. The B-line register introduced runtime-computed addresses as first-class hardware-supported values.

Step 5: State the exam conclusion. It moved address manipulation out of self-modifying code and into hardware address-generation logic, creating the path toward integer pointers and pointer arithmetic.

---

### Question 6: COBOL ALTER and technical debt

**Q:** Explain why COBOL's `ALTER` statement is used in the notes as a technical-debt lesson.

**Answer & Explanation:**

Step 1: State what `ALTER` did. `ALTER` allowed program control flow to be changed by modifying where a paragraph would jump.

Step 2: Explain the historical motivation. Early machines had scarce registers and expensive conditional branching. Self-modifying or control-modifying techniques could be faster.

Step 3: Explain why the motivation disappeared. Later hardware gained more registers, branch prediction, pipelining, and better instruction-fetch machinery.

Step 4: Explain the debt. The software idiom persisted after the hardware problem had largely gone away, creating code that was harder to understand and hostile to modern optimisations.

Step 5: State the exam conclusion. Hardware limitations can shape software practices that outlive their usefulness and later become security and maintenance liabilities.

---

### Question 7: Pointer as a simple integer

**Q:** Explain the statement "a pointer is just an integer" in the simple hardware model. Why does the value `0x4000` have no inherent security meaning?

**Answer & Explanation:**

Step 1: State the hardware model. A pointer is represented as a numeric address stored in a register or memory location.

Step 2: Explain the ambiguity. The value `0x4000` can be treated as the integer 16384 by an arithmetic instruction or as memory address 16384 by a load/store instruction.

Step 3: State what hardware does not know. The hardware does not inherently know the pointer's intended type, object bounds, lifetime, or provenance.

Step 4: Explain why this is insecure. If an attacker can manipulate the number, the CPU may accept it as an address.

Step 5: State the exam conclusion. Integer pointers are efficient and backward-compatible, but they lack the metadata required to enforce memory safety.

---

### Question 8: C pointer arithmetic as compile-time abstraction

**Q:** In C, why does `int *p; p++;` move by 4 bytes while `char *q; q++;` moves by 1 byte? Why does this not mean hardware understands C types?

**Answer & Explanation:**

Step 1: State the C rule. Pointer arithmetic is scaled by the size of the pointed-to type.

Step 2: Apply it. If `p` points to `int`, `p++` adds `sizeof(int)`, normally 4. If `q` points to `char`, `q++` adds `sizeof(char)`, which is 1.

Step 3: Explain compilation. The compiler converts the typed operation into ordinary address arithmetic.

Step 4: Explain the hardware view. At machine level, both operations are integer additions on address values.

Step 5: State the security consequence. Runtime hardware does not automatically know the source-level type or bounds unless the architecture adds metadata, as MTE or CHERI do.

---

### Question 9: Missing pointer metadata and vulnerability classes

**Q:** For each missing pointer metadata item—bounds, lifetime, type, and provenance—name the vulnerability class it enables.

**Answer & Explanation:**

Step 1: Bounds. If a pointer has no object-size or range metadata, hardware cannot stop reads or writes past the end of the object. This enables buffer overflows and buffer over-reads.

Step 2: Lifetime. If a pointer has no allocation-lifetime metadata, hardware cannot know whether the object has been freed. This enables use-after-free.

Step 3: Type. If a pointer has no runtime type or permission metadata, the same memory can be interpreted through an incompatible type. This enables type confusion.

Step 4: Provenance. If the architecture cannot tell how a pointer was derived, an arbitrary integer may be treated as a pointer. This enables pointer forgery.

Step 5: State the exam conclusion. Modern memory-safety vulnerabilities are not isolated mistakes; they follow from representing authority to memory as a bare integer.

---

### Question 10: Spatial versus temporal safety

**Q:** Distinguish spatial and temporal memory-safety violations. Give one example of each.

**Answer & Explanation:**

Step 1: Define spatial safety. Spatial safety means a memory access stays within the intended bounds of the object.

Example: writing 20 bytes into an 8-byte buffer violates spatial safety.

Step 2: Define temporal safety. Temporal safety means a memory access occurs only while the object is still valid and allocated.

Example: dereferencing a pointer after `free()` violates temporal safety.

Step 3: Connect to metadata. Spatial safety needs bounds metadata. Temporal safety needs lifetime or validity metadata.

Step 4: State the exam conclusion. Bounds errors ask "where may this pointer access?"; lifetime errors ask "is the object still alive?"

---

### Question 11: The four-level memory-safety model

**Q:** Explain the four-level memory-safety model from the notes and place testing, memory-safe languages, MTE, and CHERI into it.

**Answer & Explanation:**

Step 1: Level 1 is testing and bug fixing. It tries to find and remove bugs but cannot prove all bugs are gone.

Step 2: Level 2 is memory-safe languages and software verification. These prevent or prove absence of classes of memory errors in software, but porting existing C/C++ ecosystems is hard.

Step 3: Level 3 is statistical hardware blocking. ARM MTE belongs here because it catches tag mismatches probabilistically.

Step 4: Level 4 is deterministic hardware blocking. CHERI belongs here because capabilities carry bounds, permissions, provenance, and tags that hardware enforces.

Step 5: State the exam conclusion. The levels differ by assurance: from finding individual bugs, to language-level prevention, to probabilistic hardware detection, to architectural impossibility of unauthorised pointer use.

---

### Question 12: Heartbleed as a missing bounds check

**Q:** Explain Heartbleed as a memory-safety bug. Why was it not fundamentally a TLS protocol flaw?

**Answer & Explanation:**

Step 1: State the feature. TLS Heartbeat lets one peer send a payload and a declared payload length; the other peer echoes the payload back.

Step 2: State the bug. The vulnerable OpenSSL implementation trusted the declared length without checking that the received record actually contained that many payload bytes.

Step 3: Explain the memory-safety failure. The server copied more bytes than were actually in the payload buffer, causing an out-of-bounds read.

Step 4: Explain why it was not a protocol flaw. Echoing a payload is legitimate; copying beyond the received payload is an implementation bounds-check failure.

Step 5: State the impact. An unauthenticated remote attacker could read adjacent process memory, potentially including keys, credentials, or user data.

Step 6: State the exam conclusion. Heartbleed is the canonical example of trusting an attacker-controlled length field at a trust boundary.

---

### Question 13: CrowdStrike comparison

**Q:** The notes compare Heartbleed with the July 2024 CrowdStrike Falcon outage. What shared engineering lesson is being drawn?

**Answer & Explanation:**

Step 1: Identify Heartbleed's shape. A missing bounds check in C code caused a memory disclosure vulnerability.

Step 2: Identify the CrowdStrike comparison in the notes. A missing bounds check while parsing a configuration update for a kernel-level security agent caused a crash/panic.

Step 3: State the shared issue. In both cases, software trusted structured input without validating that the requested access stayed within the actual available data.

Step 4: Explain why hardware is relevant. When parsing code runs in a privileged or security-critical context, one memory-safety mistake can have system-wide consequences.

Step 5: State the exam conclusion. Bounds checks are not "minor defensive programming"; they are core system-safety requirements, especially across trust boundaries.

---

### Question 14: ARM Pointer Authentication

**Q:** Explain ARM Pointer Authentication (PAC). What does it protect, and what are two limitations?

**Answer & Explanation:**

Step 1: Define PAC. PAC stores a cryptographic authentication code in unused high bits of a pointer.

Step 2: State the signing inputs. The PAC is computed from the pointer, a context/modifier value, and a secret hardware key.

Step 3: Explain authentication. Before use, hardware recomputes the PAC. If it matches, the PAC is stripped and the pointer is used. If it does not match, use of the pointer faults.

Step 4: State what it protects. PAC protects pointer integrity, especially return addresses and some function pointers. It makes simple pointer overwrites fail.

Step 5: Limitation 1: substitution. If an attacker can reuse a valid signed pointer in another place where the context is accepted, PAC may not detect it.

Step 6: Limitation 2: key leakage. If PAC keys are leaked, an attacker may be able to sign forged pointers.

Step 7: State the exam conclusion. PAC is a control-flow integrity aid, not full memory safety.

---

### Question 15: ARM BTI and JOP

**Q:** What is Branch Target Identification (BTI), and why does it complement PAC?

**Answer & Explanation:**

Step 1: Define BTI. BTI marks legitimate indirect branch targets with special landing-pad instructions.

Step 2: State the rule. When BTI is enabled, an indirect branch may land only on a valid BTI target.

Step 3: Explain the threat. Jump-Oriented Programming chains gadgets ending in indirect jumps, avoiding return instructions.

Step 4: Explain why PAC is insufficient alone. PAC mainly protects backward-edge control flow, such as return addresses. JOP attacks use forward-edge indirect branches.

Step 5: Explain the combination. PAC protects returns; BTI restricts indirect branch targets. Together they reduce available ROP/JOP gadgets.

Step 6: State the limitation. BTI is coarse-grained because any valid landing pad in a guarded page may still be a possible target.

---

### Question 16: ARM Memory Tagging Extension

**Q:** Explain ARM Memory Tagging Extension (MTE). Why is it probabilistic rather than deterministic?

**Answer & Explanation:**

Step 1: Define MTE. MTE associates a small tag with a pointer and a small tag with each memory granule.

Step 2: State the access rule. A memory access is permitted only if the pointer tag equals the memory granule tag.

Step 3: State the allocation behaviour. The allocator assigns a random 4-bit tag to the allocation's 16-byte granules and returns a pointer containing the same tag.

Step 4: State spatial protection. An overflow into a differently tagged adjacent granule can be detected.

Step 5: State temporal protection. If freed memory is retagged, an old dangling pointer with the previous tag may fault on use.

Step 6: Explain probabilism. A 4-bit tag has only 16 possible values. An illegal access may accidentally use a pointer tag matching the target memory tag.

Step 7: State the exam conclusion. MTE detects many spatial and temporal bugs cheaply, but a 1-in-16 tag collision means it is not deterministic memory safety.

---

### Question 17: CHERI capabilities

**Q:** Define a CHERI capability and explain bounds, permissions, provenance validity, tags, and monotonicity.

**Answer & Explanation:**

Step 1: Define a capability. A CHERI capability is a hardware-protected pointer-like value carrying an address plus security metadata.

Step 2: Bounds. Bounds restrict the memory range the capability can access.

Step 3: Permissions. Permissions say which operations are allowed, such as load, store, execute, or capability load/store.

Step 4: Provenance validity. Valid capabilities must be derived from existing valid capabilities. Arbitrary integers cannot become valid capabilities.

Step 5: Tags. A separate validity tag records whether the capability is authentic. Overwriting capability storage with ordinary data clears the tag.

Step 6: Monotonicity. Capabilities can be narrowed but not widened. Bounds cannot be expanded and permissions cannot be added beyond the parent capability.

Step 7: State the exam conclusion. CHERI turns pointers from forgeable integers into unforgeable, bounded, permissioned authorities.

---

### Question 18: CHERI versus MTE

**Q:** Why is CHERI considered deterministic hardware blocking while MTE is statistical hardware blocking?

**Answer & Explanation:**

Step 1: State MTE's check. MTE compares small tags. A mismatch faults.

Step 2: State MTE's weakness. Because tags are only 4 bits, two unrelated objects can have the same tag by chance.

Step 3: State CHERI's check. CHERI checks capability validity, bounds, permissions, and provenance.

Step 4: Explain determinism. If an access lies outside capability bounds or lacks permission, the hardware rejects it. The attacker cannot rely on a random tag collision because the authority itself is absent.

Step 5: State the exam conclusion. MTE makes many bugs likely to fault; CHERI makes unauthorised capability use architecturally invalid.

---

### Question 19: CHERI compartmentalisation and sentries

**Q:** Explain how CHERI supports compartmentalisation in a shared address space. What is a sentry?

**Answer & Explanation:**

Step 1: State the problem. Traditional compartmentalisation often uses separate address spaces, which makes fine-grained domain switching expensive.

Step 2: State CHERI's approach. Compartments can share one virtual address space but hold different sets of capabilities.

Step 3: Define reachable capability set. A compartment can access only memory for which it has reachable valid capabilities.

Step 4: Explain isolation. If a capability is not reachable, the memory it authorises is architecturally unavailable even if it has an address in the same virtual address space.

Step 5: Define a sentry. A sentry is a sealed entry capability that acts as a controlled gateway into a compartment.

Step 6: Explain the transition. Calling through a sentry unseals the entry capability and transfers control only to the intended entry point, without giving the caller unrestricted access to callee internals.

Step 7: State the exam conclusion. CHERI builds compartment boundaries from capability reachability and controlled sentry entry, not just from page tables.

---

## Part 2: Memory & Storage Size Calculations

### Question 20: B-register effective address calculation

**Q:** An instruction contains base address `1000`. The B-line register contains offset `37`. What effective address does the CPU use? If the program then increments the B-line register by 4 for the next iteration, what is the next effective address?

**Answer & Explanation:**

Step 1: Use the formula.

`effective address = base address + B-register offset`

Step 2: Compute the first address.

`1000 + 37 = 1037`

Step 3: Update the B-line register.

`37 + 4 = 41`

Step 4: Compute the next address.

`1000 + 41 = 1041`

Step 5: State the result. The effective addresses are **1037** and **1041**.

---

### Question 21: C pointer arithmetic offsets

**Q:** A compiler lowers C pointer increments to integer address arithmetic. Assume an initial address of `0x4000`. Compute the resulting address after each operation: `char *c; c += 9`, `int *i; i += 9`, and `double *d; d += 9`.

**Answer & Explanation:**

Step 1: State the rule.

`new address = old address + n * sizeof(*pointer)`

Step 2: Compute the `char *` case.

`sizeof(char) = 1`, so `0x4000 + 9 * 1 = 0x4009`.

Step 3: Compute the `int *` case.

`sizeof(int) = 4`, so `0x4000 + 9 * 4 = 0x4000 + 36 = 0x4024`.

Step 4: Compute the `double *` case.

`sizeof(double) = 8`, so `0x4000 + 9 * 8 = 0x4000 + 72 = 0x4048`.

Step 5: State the result. The addresses are **0x4009**, **0x4024**, and **0x4048**.

---

### Question 22: Struct layout for raw pointer metadata

**Q:** Under the assumptions at the top of this document, compute the offsets and total size of `struct RawPointerRecord`. Then compute the address of `table[3].bounds_hi` if `table` begins at address `0x800000`.

```c
#include <stdint.h>
#include <stdio.h>

struct RawPointerRecord {
    char kind;
    uint64_t address;
    uint32_t bounds_lo;
    uint32_t bounds_hi;
    uint8_t valid;
};

int main(void) {
    struct RawPointerRecord table[8];
    (void)table;
    printf("Raw pointer metadata teaching example.\n");
    return 0;
}
```

**Answer & Explanation:**

Step 1: Place `kind`. `char` has size 1 and alignment 1. Offset = 0.

Step 2: Align `address`. `uint64_t` needs 8-byte alignment. After `kind`, the next offset is 1, so 7 bytes of padding are inserted. `address` offset = 8.

Step 3: Place `bounds_lo`. `uint32_t` has size 4 and alignment 4. It starts at offset 16.

Step 4: Place `bounds_hi`. It starts at offset 20.

Step 5: Place `valid`. `uint8_t` starts at offset 24.

Step 6: Add tail padding. The structure ends at offset 25, but the largest alignment is 8, so the total size rounds up to 32.

Step 7: Compute `table[3]`.

`table[3] base = 0x800000 + 3 * 32 = 0x800000 + 0x60 = 0x800060`

Step 8: Add `bounds_hi` offset.

`0x800060 + 20 = 0x800060 + 0x14 = 0x800074`

Step 9: State the result. `sizeof(struct RawPointerRecord) = 32`, and `table[3].bounds_hi` is at **0x800074**.

---

### Question 23: Heartbeat bounds-check arithmetic

**Q:** A TLS heartbeat record contains 1 byte of type, 2 bytes of payload-length field, a payload, and 16 bytes of padding. A request claims `payload_length = 65535`, but the received record length is only 20 bytes. Does the correctness condition pass?

**Answer & Explanation:**

Step 1: State the correctness condition.

`1 + 2 + payload_length + 16 <= received_record_length`

Step 2: Substitute the values.

`1 + 2 + 65535 + 16 = 65554`

Step 3: Compare with received length.

`65554 <= 20` is false.

Step 4: State the result. The request must be rejected.

Step 5: Explain the security point. The declared length is attacker-controlled. The implementation must compare it with the actual received record size before copying.

---

### Question 24: Heartbleed over-read amount

**Q:** In a Heartbleed-style attack, the attacker sends an actual payload of 1 byte but claims a payload length of 65,535 bytes. Ignoring protocol overhead, how many unintended bytes may be copied from adjacent memory?

**Answer & Explanation:**

Step 1: Identify the claimed copy size.

`claimed payload_length = 65,535`

Step 2: Identify actual controlled payload bytes.

`actual payload = 1`

Step 3: Compute unintended bytes.

`65,535 - 1 = 65,534`

Step 4: State the result. Up to **65,534 unintended bytes** may be copied.

Step 5: State the exam conclusion. A single missing bounds check can turn a tiny input into a roughly 64 KB memory disclosure.

---

### Question 25: MTE tag metadata overhead

**Q:** ARM MTE uses one 4-bit tag for every 16-byte memory granule. How much tag storage is required for 1 MiB of memory? Give the answer in tags, bits, bytes, and KiB.

**Answer & Explanation:**

Step 1: Convert memory size.

`1 MiB = 1,048,576 bytes`

Step 2: Compute number of granules.

`1,048,576 / 16 = 65,536 granules`

Step 3: Compute number of tags.

There is one tag per granule, so there are **65,536 tags**.

Step 4: Compute bits.

`65,536 * 4 = 262,144 bits`

Step 5: Convert to bytes.

`262,144 / 8 = 32,768 bytes`

Step 6: Convert to KiB.

`32,768 / 1,024 = 32 KiB`

Step 7: State the result. Tag storage is **65,536 tags**, **262,144 bits**, **32,768 bytes**, or **32 KiB**.

---

### Question 26: MTE false-negative probability

**Q:** MTE uses 4-bit tags. What is the probability that one illegal access is not detected because the pointer tag happens to match the target granule's tag? If an attacker gets three independent attempts, what is the probability all three attempts are missed?

**Answer & Explanation:**

Step 1: Count tag values.

`2^4 = 16`

Step 2: Compute one-attempt false-negative probability.

`1 / 16 = 0.0625 = 6.25%`

Step 3: Compute three independent missed attempts.

`(1 / 16)^3 = 1 / 4096`

Step 4: Convert to percentage.

`1 / 4096 = 0.000244140625 = 0.0244140625%`

Step 5: State the result. One attempt has a **6.25%** miss probability; three independent attempts all being missed has probability **1/4096**, or about **0.0244%**.

Step 6: State the caveat. Real exploit attempts may not be independent if allocator/tag behaviour can be influenced, which is why MTE is not treated as deterministic protection.

---

### Question 27: CHERI capability storage overhead

**Q:** A conventional program stores 10,000 raw 64-bit pointers in an array. A CHERI version stores 10,000 128-bit capabilities instead, ignoring separate tag storage. How many bytes does each array use, and what is the overhead in bytes and percentage?

**Answer & Explanation:**

Step 1: Compute raw pointer array size.

`10,000 * 8 = 80,000 bytes`

Step 2: Compute CHERI capability array size.

`10,000 * 16 = 160,000 bytes`

Step 3: Compute overhead.

`160,000 - 80,000 = 80,000 bytes`

Step 4: Compute percentage overhead relative to the original.

`80,000 / 80,000 * 100% = 100%`

Step 5: State the result. The raw array uses **80,000 bytes**; the CHERI array uses **160,000 bytes**; the direct pointer-array overhead is **80,000 bytes**, or **100%** for that array.

Step 6: State the broader caveat. Whole-program overhead can be lower than 100% because not all memory is pointer storage; the notes report C/C++ overhead often around 5%, depending on language and data structures.

---

### Question 28: CHERI register-file teaching calculation

**Q:** In the notes' simplified CHERI width formula, one capability-extended register contains a 64-bit address, 64 bits of metadata, and a 1-bit validity tag. How many bits are needed for 32 such registers? Convert the result to bytes.

**Answer & Explanation:**

Step 1: Compute bits per register.

`64 + 64 + 1 = 129 bits`

Step 2: Compute bits for 32 registers.

`32 * 129 = 4,128 bits`

Step 3: Convert to bytes.

`4,128 / 8 = 516 bytes`

Step 4: State the result. The teaching model requires **4,128 bits**, or **516 bytes**, for 32 capability-extended registers.

Step 5: State the caveat. Real implementations may store validity tags out-of-band, but the exam formula in the notes is `64 + 64 + 1 = 129 bits`.

---

### Question 29: CHERIoT revocation quarantine bitmap

**Q:** CHERIoT's temporal-safety mechanism uses a revocation quarantine bitmap with 1 bit per 8 bytes. How large is the bitmap for a 2 MiB heap?

**Answer & Explanation:**

Step 1: Convert heap size.

`2 MiB = 2 * 1,048,576 = 2,097,152 bytes`

Step 2: Compute number of 8-byte regions.

`2,097,152 / 8 = 262,144 regions`

Step 3: Compute bits.

`262,144 regions * 1 bit = 262,144 bits`

Step 4: Convert to bytes.

`262,144 / 8 = 32,768 bytes`

Step 5: Convert to KiB.

`32,768 / 1,024 = 32 KiB`

Step 6: State the result. The bitmap requires **32 KiB**.

---

### Question 30: CHERI porting effort arithmetic

**Q:** The notes report approximate line-change rates of `0.045%` for a 27 MLoC Chromium base and `0.8%` for a 2 MLoC V8 codebase. Estimate the number of changed lines in each.

**Answer & Explanation:**

Step 1: Convert percentages to decimals.

`0.045% = 0.00045`

`0.8% = 0.008`

Step 2: Compute Chromium base changes.

`27,000,000 * 0.00045 = 12,150 lines`

Step 3: Compute V8 changes.

`2,000,000 * 0.008 = 16,000 lines`

Step 4: State the result. The estimates are **12,150 changed lines** for the 27 MLoC Chromium base and **16,000 changed lines** for the 2 MLoC V8 codebase.

Step 5: State the interpretation. The V8 percentage is much higher, but because the codebase is smaller, the absolute changed-line count is comparable.

---

## Part 3: Code Tracing & Output Prediction

### Question 31: Pointer arithmetic lowering

**Q:** Predict the exact output of the following complete C program. Explain how it models C pointer arithmetic.

```c
#include <stdio.h>
#include <stdint.h>

int main(void) {
    uint64_t base = 0x4000;
    uint64_t char_p = base + 7 * sizeof(char);
    uint64_t int_p = base + 7 * sizeof(int);
    uint64_t double_p = base + 7 * sizeof(double);

    printf("char pointer: 0x%llx\n", (unsigned long long)char_p);
    printf("int pointer: 0x%llx\n", (unsigned long long)int_p);
    printf("double pointer: 0x%llx\n", (unsigned long long)double_p);

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
char pointer: 0x4007
int pointer: 0x401c
double pointer: 0x4038
```

Step 1: `sizeof(char) = 1`, so `0x4000 + 7 = 0x4007`.

Step 2: `sizeof(int) = 4`, so `0x4000 + 28 = 0x401c`.

Step 3: `sizeof(double) = 8`, so `0x4000 + 56 = 0x4038`.

Step 4: The concept is that C type-aware pointer arithmetic becomes ordinary integer address arithmetic after compilation.

---

### Question 32: Fetch-decode-execute trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

int main(void) {
    const char *memory[] = {"LOAD", "ADD", "JMP", "HALT"};
    int pc = 0;

    for (int step = 0; step < 4; step++) {
        const char *instruction = memory[pc];
        printf("fetch pc=%d instruction=%s\n", pc, instruction);

        if (instruction[0] == 'J') {
            pc = 3;
        } else {
            pc++;
        }
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
fetch pc=0 instruction=LOAD
fetch pc=1 instruction=ADD
fetch pc=2 instruction=JMP
fetch pc=3 instruction=HALT
```

Step 1: At step 0, `pc=0`, so the program fetches `LOAD`, then increments `pc` to 1.

Step 2: At step 1, it fetches `ADD`, then increments `pc` to 2.

Step 3: At step 2, it fetches `JMP`, so the branch logic sets `pc=3`.

Step 4: At step 3, it fetches `HALT`, then increments `pc` to 4 after printing.

Step 5: The security point is that changing the PC changes the next instruction fetched.

---

### Question 33: Self-modifying code model

**Q:** Predict the exact output of the following complete C program. Explain how it models early self-modifying code.

```c
#include <stdio.h>

struct Instruction {
    const char *op;
    int address;
};

int main(void) {
    struct Instruction load = {"LOAD", 100};

    for (int iter = 0; iter < 3; iter++) {
        printf("%s %d\n", load.op, load.address);
        load.address++;
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
LOAD 100
LOAD 101
LOAD 102
```

Step 1: The instruction initially has address 100.

Step 2: The loop prints the current instruction address, then increments the stored address field.

Step 3: The printed addresses are therefore 100, 101, and 102.

Step 4: This models old code that modified the address inside an instruction to walk through memory before index registers/pointers were available.

---

### Question 34: Heartbeat validation trace

**Q:** Predict the exact output of the following complete C program. Then explain which request is Heartbleed-shaped.

```c
#include <stdio.h>
#include <stdint.h>

static int heartbeat_ok(uint16_t payload_len, uint16_t record_len) {
    uint32_t required = 1u + 2u + payload_len + 16u;
    return required <= record_len;
}

int main(void) {
    printf("small valid=%d\n", heartbeat_ok(1, 20));
    printf("huge valid=%d\n", heartbeat_ok(65535, 20));
    printf("exact valid=%d\n", heartbeat_ok(32, 51));
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
small valid=1
huge valid=0
exact valid=1
```

Step 1: For `payload_len=1`, required length is `1 + 2 + 1 + 16 = 20`, so it is valid.

Step 2: For `payload_len=65535`, required length is `65554`, which is greater than 20, so it is invalid.

Step 3: For `payload_len=32`, required length is `51`, exactly equal to the record length, so it is valid.

Step 4: The Heartbleed-shaped request is the one with a huge claimed payload length but a tiny actual record.

---

### Question 35: Toy PAC authentication

**Q:** Predict the exact output of the following complete C program. This is a toy model of PAC and is not cryptographic.

```c
#include <stdio.h>
#include <stdint.h>

static uint32_t sign_ptr(uint32_t pointer, uint32_t context, uint32_t key) {
    return (pointer ^ context ^ key) & 0xffu;
}

static int authenticate(uint32_t pointer, uint32_t context,
                        uint32_t key, uint32_t pac) {
    return sign_ptr(pointer, context, key) == pac;
}

int main(void) {
    uint32_t key = 0x5a;
    uint32_t context = 0x1000;
    uint32_t ret = 0x8040;
    uint32_t pac = sign_ptr(ret, context, key);

    printf("pac=0x%02x\n", pac);
    printf("original=%d\n", authenticate(ret, context, key, pac));
    printf("tampered=%d\n", authenticate(0x9000, context, key, pac));

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
pac=0x1a
original=1
tampered=0
```

Step 1: Compute the PAC for `ret=0x8040`, `context=0x1000`, and `key=0x5a`.

`0x8040 ^ 0x1000 ^ 0x005a = 0x901a`

Low 8 bits = `0x1a`.

Step 2: Authenticating the original pointer recomputes the same value, so it prints 1.

Step 3: Authenticating `0x9000` gives a different low-byte signature, so it prints 0.

Step 4: The concept is pointer integrity: changing the pointer without updating the authentication code is detected.

---

### Question 36: BTI landing-pad check

**Q:** Predict the exact output of the following complete C program. Explain how it models BTI.

```c
#include <stdio.h>

struct Target {
    const char *name;
    int has_bti;
};

int main(void) {
    struct Target targets[] = {
        {"function_start", 1},
        {"middle_gadget", 0},
        {"valid_stub", 1}
    };

    for (int i = 0; i < 3; i++) {
        printf("%s -> %s\n",
               targets[i].name,
               targets[i].has_bti ? "branch allowed" : "fault");
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
function_start -> branch allowed
middle_gadget -> fault
valid_stub -> branch allowed
```

Step 1: `function_start` has a BTI landing pad, so it is allowed.

Step 2: `middle_gadget` lacks a BTI landing pad, so it faults.

Step 3: `valid_stub` has a landing pad, so it is allowed.

Step 4: This models the BTI rule: indirect branches are restricted to marked legal targets.

---

### Question 37: MTE tag checking trace

**Q:** Predict the exact output of the following complete C program.

```c
#include <stdio.h>

struct Access {
    unsigned int pointer_tag;
    unsigned int memory_tag;
};

int main(void) {
    struct Access accesses[] = {
        {3, 3},
        {3, 4},
        {15, 15},
        {0, 8}
    };

    for (int i = 0; i < 4; i++) {
        printf("access %d: %s\n",
               i,
               accesses[i].pointer_tag == accesses[i].memory_tag ? "ok" : "fault");
    }

    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
access 0: ok
access 1: fault
access 2: ok
access 3: fault
```

Step 1: Access 0 has matching tags 3 and 3, so it is permitted.

Step 2: Access 1 has tags 3 and 4, so it faults.

Step 3: Access 2 has matching tags 15 and 15, so it is permitted.

Step 4: Access 3 has tags 0 and 8, so it faults.

Step 5: This models MTE's tag equality check. Matching tags are not proof of full memory safety; they only pass the tag check.

---

### Question 38: CHERI capability narrowing

**Q:** Predict the exact output of the following complete C program. Explain how it models CHERI monotonicity.

```c
#include <stdio.h>

struct Cap {
    unsigned int base;
    unsigned int length;
    unsigned int perms;
    int valid;
};

static struct Cap narrow(struct Cap parent,
                         unsigned int new_base,
                         unsigned int new_length,
                         unsigned int new_perms) {
    unsigned int parent_end = parent.base + parent.length;
    unsigned int new_end = new_base + new_length;

    if (!parent.valid ||
        new_base < parent.base ||
        new_end > parent_end ||
        (new_perms & ~parent.perms) != 0) {
        struct Cap invalid = {0, 0, 0, 0};
        return invalid;
    }

    struct Cap child = {new_base, new_length, new_perms, 1};
    return child;
}

int main(void) {
    struct Cap parent = {100, 80, 0x7, 1};
    struct Cap ok = narrow(parent, 120, 20, 0x3);
    struct Cap bad = narrow(parent, 90, 20, 0x3);

    printf("ok valid=%d base=%u length=%u perms=0x%x\n",
           ok.valid, ok.base, ok.length, ok.perms);
    printf("bad valid=%d\n", bad.valid);
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
ok valid=1 base=120 length=20 perms=0x3
bad valid=0
```

Step 1: The parent capability covers `[100, 180)` and has permissions `0x7`.

Step 2: The `ok` child covers `[120, 140)` and has permissions `0x3`, a subset of `0x7`. It is valid.

Step 3: The `bad` child starts at 90, which is below the parent's base 100. It would widen authority, so it is invalid.

Step 4: This models CHERI monotonicity: derived capabilities may reduce authority but must not expand it.

---

### Question 39: Sentry call simulation

**Q:** Predict the exact output of the following complete C program. Explain the sentry concept being modelled.

```c
#include <stdio.h>

struct Sentry {
    const char *entry_name;
    int sealed;
};

static void call_sentry(struct Sentry s) {
    if (!s.sealed) {
        printf("reject unsealed entry\n");
        return;
    }
    printf("unseal and enter %s\n", s.entry_name);
    printf("return to caller\n");
}

int main(void) {
    struct Sentry parse_entry = {"parser_compartment", 1};
    call_sentry(parse_entry);
    return 0;
}
```

**Answer & Explanation:**

Exact output:

```text
unseal and enter parser_compartment
return to caller
```

Step 1: `parse_entry.sealed` is 1, so the sentry is accepted.

Step 2: The function prints the controlled entry into the parser compartment.

Step 3: It then prints the return to the caller.

Step 4: In CHERI, a sentry is a sealed entry capability. It allows controlled calls into a compartment without exposing arbitrary access to the compartment's internals.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 40: Heartbleed-style missing bounds check

**Q:** The following complete C program contains a Heartbleed-shaped bug in `heartbeat_bad`. Identify the bug and explain why `heartbeat_safe` is the correct refactor.

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

static uint16_t heartbeat_bad(uint16_t claimed_payload_len,
                              uint16_t received_record_len) {
    (void)received_record_len;
    return claimed_payload_len;
}

static bool heartbeat_safe(uint16_t claimed_payload_len,
                           uint16_t received_record_len,
                           uint16_t *copy_len) {
    uint32_t required = 1u + 2u + claimed_payload_len + 16u;
    if (required > received_record_len) {
        return false;
    }
    *copy_len = claimed_payload_len;
    return true;
}

int main(void) {
    uint16_t copy_len = 0;

    printf("bad copy=%u\n", heartbeat_bad(65535, 20));
    printf("safe accepted=%d\n", heartbeat_safe(65535, 20, &copy_len));
    printf("copy_len=%u\n", copy_len);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `heartbeat_bad` trusts `claimed_payload_len` and ignores `received_record_len`.

Step 2: State the output.

```text
bad copy=65535
safe accepted=0
copy_len=0
```

Step 3: Explain the vulnerability. If the program copied `claimed_payload_len` bytes from the received payload buffer, it could read beyond the actual received record.

Step 4: Explain the secure refactor. `heartbeat_safe` calculates the full required record size using a wider integer type and rejects the request unless the claimed payload plus protocol overhead fits inside the received record.

Step 5: State the exam conclusion. Never trust a peer-supplied length field until it has been checked against the actual buffer length.

---

### Question 41: Buffer overflow from missing bounds metadata

**Q:** The following complete C program contains an unsafe write function and a safe refactor. Identify the bug in `write_bad` and explain why `write_safe` is correct.

```c
#include <stdio.h>
#include <stdbool.h>
#include <stddef.h>

struct Packet {
    char payload[8];
    int authenticated;
};

static void write_bad(struct Packet *p, size_t index, char value) {
    p->payload[index] = value;
}

static bool write_safe(struct Packet *p, size_t index, char value) {
    if (index >= sizeof(p->payload)) {
        return false;
    }
    p->payload[index] = value;
    return true;
}

int main(void) {
    struct Packet p = {{0}, 0};

    printf("safe write=%d\n", write_safe(&p, 3, 'A'));
    printf("safe rejected=%d\n", write_safe(&p, 12, 'B'));
    printf("authenticated=%d\n", p.authenticated);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `write_bad` indexes `payload` without checking that `index < sizeof(p->payload)`.

Step 2: Explain the security consequence. An out-of-bounds write could corrupt adjacent fields, such as `authenticated`, or later control data.

Step 3: State the output of the safe path.

```text
safe write=1
safe rejected=0
authenticated=0
```

Step 4: Explain the secure refactor. `write_safe` rejects indexes outside the payload array.

Step 5: Connect to the lecture. This is a spatial memory-safety bug caused by missing bounds metadata on ordinary integer pointers.

---

### Question 42: Use-after-free from missing lifetime metadata

**Q:** The following complete C program models a dangling pointer bug without actually dereferencing freed memory in `main`. Identify the bug in `use_after_free_bad` and explain the safer ownership pattern in `free_safe`.

```c
#include <stdio.h>
#include <stdlib.h>

struct Session {
    int authenticated;
};

static void use_after_free_bad(struct Session *s) {
    free(s);
    s->authenticated = 1;
}

static void free_safe(struct Session **s) {
    free(*s);
    *s = NULL;
}

int main(void) {
    struct Session *s = malloc(sizeof(*s));
    if (s == NULL) {
        return 1;
    }

    s->authenticated = 0;
    free_safe(&s);

    printf("pointer cleared=%d\n", s == NULL);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `use_after_free_bad` frees `s` and then writes through the dangling pointer.

Step 2: Explain the vulnerability class. This is a temporal memory-safety violation: the pointer still contains an address, but the lifetime of the object has ended.

Step 3: State the output of the safe path.

```text
pointer cleared=1
```

Step 4: Explain the safer refactor. `free_safe` takes a pointer to the pointer, frees the object, and clears the caller's pointer to `NULL`.

Step 5: State the limitation. Clearing one pointer does not clear all aliases. Hardware temporal-safety mechanisms such as MTE retagging or CHERIoT revocation aim to catch remaining dangling pointers.

---

### Question 43: Type confusion from missing runtime type validation

**Q:** The following complete C program contains a type-confusion bug in `is_admin_bad`. Identify the bug and explain the secure refactor.

```c
#include <stdio.h>
#include <stdbool.h>

enum Kind {
    KIND_USER,
    KIND_ADMIN
};

struct User {
    enum Kind kind;
    int user_id;
};

struct Admin {
    enum Kind kind;
    int user_id;
    int can_delete;
};

static bool is_admin_bad(void *obj) {
    struct Admin *admin = (struct Admin *)obj;
    return admin->can_delete != 0;
}

static bool is_admin_safe(void *obj) {
    struct User *base = (struct User *)obj;
    if (base->kind != KIND_ADMIN) {
        return false;
    }
    struct Admin *admin = (struct Admin *)obj;
    return admin->can_delete != 0;
}

int main(void) {
    struct User user = {KIND_USER, 100};
    struct Admin admin = {KIND_ADMIN, 1, 1};

    printf("user safe=%d\n", is_admin_safe(&user));
    printf("admin safe=%d\n", is_admin_safe(&admin));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `is_admin_bad` casts any object pointer to `struct Admin *` and reads the `can_delete` field without checking the object's real type.

Step 2: Explain the vulnerability. If the object is not actually an `Admin`, the program interprets unrelated memory as an admin permission field.

Step 3: State the output of the safe path.

```text
user safe=0
admin safe=1
```

Step 4: Explain the secure refactor. `is_admin_safe` checks a runtime kind tag before interpreting the object as `struct Admin`.

Step 5: Connect to the lecture. Type confusion exists because raw pointers do not carry reliable runtime type metadata.

---

### Question 44: PAC context omission allows pointer substitution

**Q:** The following complete C program models PAC with and without a context value. Identify the bug in `sign_bad` and explain the secure refactor.

```c
#include <stdio.h>
#include <stdint.h>

static uint32_t sign_bad(uint32_t pointer, uint32_t key) {
    return (pointer ^ key) & 0xffu;
}

static uint32_t sign_safe(uint32_t pointer, uint32_t context, uint32_t key) {
    return (pointer ^ context ^ key) & 0xffu;
}

int main(void) {
    uint32_t pointer = 0x8040;
    uint32_t key = 0x5a;
    uint32_t stack_a = 0x1000;
    uint32_t stack_b = 0x2000;

    printf("bad same=%d\n",
           sign_bad(pointer, key) == sign_bad(pointer, key));
    printf("safe same_context=%d\n",
           sign_safe(pointer, stack_a, key) == sign_safe(pointer, stack_a, key));
    printf("safe different_context=%d\n",
           sign_safe(pointer, stack_a, key) == sign_safe(pointer, stack_b, key));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `sign_bad` signs only the pointer and key. It does not bind the pointer to its intended use context.

Step 2: State the output.

```text
bad same=1
safe same_context=1
safe different_context=0
```

Step 3: Explain pointer substitution. If the same signed pointer is valid everywhere, an attacker may reuse a legitimately signed pointer in a different location.

Step 4: Explain the secure refactor. `sign_safe` includes a context value, such as a stack pointer or call-site modifier, so the same pointer is not automatically valid in a different context.

Step 5: State the limitation. Context binding narrows substitution attacks, but PAC still does not provide full memory safety.

---

### Question 45: BTI missing landing-pad validation

**Q:** The following complete C program models an indirect branch dispatcher. Identify the bug in `dispatch_bad` and explain why `dispatch_safe` better models BTI.

```c
#include <stdio.h>
#include <stdbool.h>

struct Target {
    const char *name;
    bool bti_landing_pad;
};

static void dispatch_bad(struct Target t) {
    printf("jump to %s\n", t.name);
}

static bool dispatch_safe(struct Target t) {
    if (!t.bti_landing_pad) {
        return false;
    }
    printf("jump to %s\n", t.name);
    return true;
}

int main(void) {
    struct Target gadget = {"middle_of_function_gadget", false};
    struct Target entry = {"function_entry", true};

    dispatch_bad(gadget);
    printf("safe gadget=%d\n", dispatch_safe(gadget));
    printf("safe entry=%d\n", dispatch_safe(entry));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `dispatch_bad` accepts any indirect branch target.

Step 2: State the output.

```text
jump to middle_of_function_gadget
safe gadget=0
jump to function_entry
safe entry=1
```

Step 3: Explain the attack. Jump-Oriented Programming relies on redirecting indirect branches to useful gadgets, often in the middle of functions or blocks.

Step 4: Explain the secure refactor. `dispatch_safe` rejects targets that are not marked as valid landing pads.

Step 5: State the exam conclusion. BTI reduces the branch target set from arbitrary addresses to compiler-marked legal targets.

---

### Question 46: MTE tag match mistaken for complete bounds safety

**Q:** The following complete C program contains a flawed MTE-style check in `mte_bad`. Identify the bug and explain why `mte_safe` is stronger.

```c
#include <stdio.h>
#include <stdbool.h>
#include <stddef.h>

struct TaggedObject {
    unsigned int tag;
    size_t length;
};

static bool mte_bad(struct TaggedObject obj,
                    unsigned int pointer_tag,
                    size_t offset) {
    (void)offset;
    return obj.tag == pointer_tag;
}

static bool mte_safe(struct TaggedObject obj,
                     unsigned int pointer_tag,
                     size_t offset) {
    if (obj.tag != pointer_tag) {
        return false;
    }
    if (offset >= obj.length) {
        return false;
    }
    return true;
}

int main(void) {
    struct TaggedObject obj = {7, 16};

    printf("bad=%d\n", mte_bad(obj, 7, 31));
    printf("safe=%d\n", mte_safe(obj, 7, 31));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `mte_bad` treats tag equality as sufficient and ignores the access offset.

Step 2: State the output.

```text
bad=1
safe=0
```

Step 3: Explain why tag equality is insufficient. MTE tags are coarse and probabilistic. A matching tag does not prove the access is within the intended object bounds.

Step 4: Explain the secure refactor. `mte_safe` requires both a tag match and an explicit bounds check.

Step 5: State the exam conclusion. MTE is useful bug detection, but software or stronger hardware mechanisms still need to reason about exact bounds.

---

### Question 47: CHERI monotonicity violation

**Q:** The following complete C program models a capability derivation bug. Identify the bug in `derive_bad` and explain why `derive_safe` enforces monotonicity.

```c
#include <stdio.h>
#include <stdbool.h>

struct Cap {
    unsigned int base;
    unsigned int length;
    unsigned int perms;
    bool valid;
};

static struct Cap derive_bad(struct Cap parent,
                             unsigned int base,
                             unsigned int length,
                             unsigned int perms) {
    (void)parent;
    struct Cap child = {base, length, perms, true};
    return child;
}

static bool derive_safe(struct Cap parent,
                        unsigned int base,
                        unsigned int length,
                        unsigned int perms,
                        struct Cap *out) {
    unsigned int parent_end = parent.base + parent.length;
    unsigned int child_end = base + length;

    if (!parent.valid) {
        return false;
    }
    if (base < parent.base || child_end > parent_end) {
        return false;
    }
    if ((perms & ~parent.perms) != 0) {
        return false;
    }

    *out = (struct Cap){base, length, perms, true};
    return true;
}

int main(void) {
    struct Cap parent = {100, 50, 0x3, true};
    struct Cap out = {0, 0, 0, false};
    struct Cap bad = derive_bad(parent, 0, 1000, 0x7);

    printf("bad base=%u length=%u perms=0x%x\n", bad.base, bad.length, bad.perms);
    printf("safe accepted=%d\n", derive_safe(parent, 0, 1000, 0x7, &out));
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `derive_bad` ignores the parent capability and creates a child with arbitrary base, length, permissions, and validity.

Step 2: State the output.

```text
bad base=0 length=1000 perms=0x7
safe accepted=0
```

Step 3: Explain the security consequence. The bad function lets a child capability gain more authority than the parent, violating least privilege.

Step 4: Explain the secure refactor. `derive_safe` checks that the child range is inside the parent range and that child permissions are a subset of parent permissions.

Step 5: State the CHERI rule. Capability derivation must be monotonic: authority can decrease, but it cannot increase.

---

### Question 48: Sentry bypass by exposing raw entry capability

**Q:** The following complete C program models compartment entry. Identify the bug in `export_bad` and explain why `export_safe` better represents CHERI sentries.

```c
#include <stdio.h>
#include <stdbool.h>

struct EntryCap {
    const char *target;
    bool sealed;
    bool can_read_internals;
};

static struct EntryCap export_bad(void) {
    struct EntryCap cap = {"crypto_compartment", false, true};
    return cap;
}

static struct EntryCap export_safe(void) {
    struct EntryCap sentry = {"crypto_compartment_entry", true, false};
    return sentry;
}

int main(void) {
    struct EntryCap bad = export_bad();
    struct EntryCap safe = export_safe();

    printf("bad sealed=%d internals=%d\n", bad.sealed, bad.can_read_internals);
    printf("safe sealed=%d internals=%d\n", safe.sealed, safe.can_read_internals);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `export_bad` exposes an unsealed capability that can read compartment internals.

Step 2: State the output.

```text
bad sealed=0 internals=1
safe sealed=1 internals=0
```

Step 3: Explain why this breaks compartmentalisation. A caller should receive authority to enter a specific function, not authority to inspect or modify the callee's internal state.

Step 4: Explain the secure refactor. `export_safe` exposes a sealed entry capability: a sentry.

Step 5: State the exam conclusion. Sentries are controlled gateways. Exposing raw internal capabilities collapses the compartment boundary.

---

### Question 49: Integer-to-pointer forgery model

**Q:** The following complete C program models raw pointer forgery versus CHERI-style provenance validity. Identify the bug in `raw_pointer_bad` and explain the secure refactor.

```c
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

struct Cap {
    uint64_t address;
    bool valid_tag;
};

static uint64_t raw_pointer_bad(uint64_t attacker_integer) {
    return attacker_integer;
}

static bool cap_from_integer_safe(uint64_t attacker_integer, struct Cap *out) {
    (void)attacker_integer;
    out->address = 0;
    out->valid_tag = false;
    return false;
}

int main(void) {
    struct Cap cap = {0, false};

    printf("raw pointer=0x%llx\n",
           (unsigned long long)raw_pointer_bad(0x41414141));
    printf("cap created=%d\n", cap_from_integer_safe(0x41414141, &cap));
    printf("cap valid=%d\n", cap.valid_tag);
    return 0;
}
```

**Answer & Explanation:**

Step 1: Identify the bug. `raw_pointer_bad` treats an attacker-controlled integer as an address-like pointer value.

Step 2: State the output.

```text
raw pointer=0x41414141
cap created=0
cap valid=0
```

Step 3: Explain the security problem. In a raw integer-pointer architecture, a forged number may be used as an address if software fails to stop it.

Step 4: Explain the CHERI-style refactor. `cap_from_integer_safe` refuses to create a valid capability from an arbitrary integer. The validity tag remains false.

Step 5: State the exam conclusion. Provenance validity is central to CHERI: valid capabilities must derive from valid capabilities, not from attacker-chosen integers.

---

## Final Revision Checklist

- Hardware is an active security foundation, not just a passive platform.
- The von Neumann model stores code and data in one memory, enabling code/data confusion.
- Control over the PC is control over execution.
- Early self-modifying code rewrote instruction addresses; the B-line register replaced this with hardware address calculation.
- COBOL `ALTER` illustrates hardware-driven software technical debt.
- C exposes the integer-pointer hardware model as "portable assembly."
- Raw pointers lack bounds, lifetime, type, and provenance metadata.
- Spatial safety concerns object bounds; temporal safety concerns object lifetime.
- Around 70% of serious bugs/CVEs in the cited sources are memory-safety or memory-unsafety issues.
- Heartbleed is a missing bounds-check over-read, not a TLS design flaw.
- The key Heartbeat check is `1 + 2 + payload_length + 16 <= record_length`.
- PAC signs pointers using pointer, context, and key; it protects integrity but not full memory safety.
- BTI restricts indirect branch targets and complements PAC.
- MTE uses pointer/memory tags, 16-byte granules, and 4-bit tags; it has a 1-in-16 false-negative probability.
- CHERI capabilities carry address, bounds, permissions, metadata, and a validity tag.
- CHERI enforces provenance validity and monotonicity.
- MTE is probabilistic; CHERI is deterministic.
- CHERI compartmentalisation uses reachable capability sets inside a shared address space.
- A sentry is a sealed entry capability for controlled compartment calls.
- CHERI's main cost is larger pointers; the notes cite C/C++ overhead often around 5%.
- CHERIoT applies CHERI ideas to secure embedded systems and includes temporal-safety mechanisms.
