---
subject: COMP60261
chapter: 7
title: "Chapter 7 Exam Questions - Fable 5"
language: "en"
---

# COMP60261 — Chapter 7 Exam Questions

**Author: Fable 5**

**Scope:** Hardware fundamentals — why hardware matters for security; von Neumann architecture as computing's "original sin"; the historical path from self-modifying code to the integer pointer; why an integer pointer is the root of modern memory-safety vulnerabilities; Heartbleed as the worked case study; and the hardware answers — ARM PAC, BTI and MTE, then CHERI and CHERIoT.

**The claim the whole lecture rests on:**

> Software is malleable, so it cannot fully secure itself. System security needs the **inflexibility of hardware** — a physical layer enforcing rules software cannot bypass.

**Assumed platform for every calculation: 64-bit ARM with 48-bit virtual addresses, 4-bit MTE tags over 16-byte granules, and 128-bit CHERI capabilities.**

| Quantity | Value |
|---|---|
| Share of serious bugs / CVEs that are memory safety | **~70%** (Chromium, Microsoft); **67%** of 2021 in-the-wild 0-days |
| MTE tag size / granule | **4 bits** per **16 bytes** → **16** tags |
| MTE false-negative probability | **1/16 = 6.25%** |
| PAC algorithm / key / context | **QARMA**, **128-bit** key, **64-bit** context |
| PAC + BTI gadget reduction in GLIBC | **97%** |
| CHERI capability | **128 bits + 1 validity tag**; GPRs become **129 bits** |
| CHERI typical C/C++ footprint overhead | **~5%** |
| CHERIoT revocation bitmap | **1 bit per 8 bytes** |

> **On the calculations in Part 2.** Every figure was computed and checked numerically. One correction the checking produced: leaking 1 MiB via Heartbleed takes **17** requests, not 16, because `65,534 × 16` falls 32 bytes short of a mebibyte — the kind of off-by-one a plausible-looking mental estimate gets wrong.

---

## Part 1: Conceptual & Security Fundamentals

### Question 1 — Hardware as an active security foundation, and the "original sin"

**Q:** Explain why this lecture treats hardware as an *active* security foundation rather than a passive platform. State the von Neumann model's defining feature and the **two** core security problems it creates. Then define the ISA, distinguish it from microarchitecture, and say why that distinction matters for everything that follows.

**Answer & Explanation:**

**Hardware as an active foundation.** Hardware is the physical layer — CPU, memory, storage, motherboard, interconnected circuits — on which all software relies. The security argument is a chain:

1. **Software is malleable** — it can be changed, bypassed, or corrupted.
2. Therefore **software cannot fully secure itself**: if the attacker can alter the software, software-based rules are weak.
3. Therefore system security needs the **inflexibility of hardware** — rules built into the execution substrate that software cannot evade.

**The von Neumann model**, first described in **1945**, is the **stored-program computer**: **one memory stores both software instructions and application data**.

**The two core security problems**, which is why the lecture calls this computing's **"original sin"**:

* **Any code can read or write any data.**
* **Any data can be executed as code.**

**Why that is the root of so much.** If code and data are both just bytes in one memory, then **corruption of data becomes corruption of control flow**. Attackers exploit this in two directions: turning data into executable behaviour (code injection), or rewriting control data so that *existing* code executes in unintended ways (ROP, JOP). This single architectural choice motivates buffer overflows, code injection, return-oriented and jump-oriented programming, and the defences that answer them — Execute Never, PAC, BTI, CHERI.

**The instruction cycle**, for completeness, since the Control Unit is what makes a process a process:

```
Fetch:      instruction  <- Memory[PC]
Decode:     (operation, operands) <- decode(instruction)
Execute:    result <- execute(operation, operands)
Writeback:  Memory/register state <- result
```

**Sequential execution of instructions within a defined state establishes the concept of a process as a distinct execution context** — and every later security mechanism exists to protect one such context, compartment, or execution state from misuse by another.

**ISA versus microarchitecture.**

> **The Instruction Set Architecture is a formal abstract model of a computer that defines the functional interface between low-level software and hardware.**

The ISA specifies **what the processor is capable of doing, not how it implements it**. It is a **contract**: software compiled for an ISA will run on **any** processor implementing that ISA, whatever its microarchitecture. The **microarchitecture** is the implementation underneath, and **the same ISA can be implemented by many different microarchitectures**.

| ISA | Type | Character |
|---|---|---|
| **x86** | CISC | Proprietary (Intel/AMD); complex, **variable-length** instructions; one instruction can do read-operate-write; standard for desktops and servers |
| **ARM** | RISC | Licensed, designed for power efficiency; many **simple, fixed-length** instructions; strict **load/store** model — data must be in registers to be processed; dominates mobile and embedded |
| **RISC-V** | RISC | **Open-source and royalty-free**; **modular** — a small base set with optional extensions; customisable from IoT to supercomputers |

**Why the distinction matters here.** Every mechanism in this chapter is an **ISA-level** change — PAC and BTI add instructions, MTE adds tag semantics to loads and stores, CHERI changes what a register *contains*. That is precisely what makes them different in kind from software mitigations: because they are in the **contract**, they cannot be opted out of by the software running above, which is the "inflexibility of hardware" argument made concrete. It also explains the adoption problem: changing an ISA requires new silicon, and code must be recompiled to use the new instructions — which is why BTI is encoded in the **NOP space** so BTI-compiled binaries still run (unprotected) on older cores.

---

### Question 2 — The integer pointer, and the three things hardware does not know

**Q:** Trace how hardware came to represent a pointer as a plain integer. State the **three** kinds of semantic information a pointer therefore lacks, and name the vulnerability class each omission enables. Explain why C made this worse rather than better.

**Answer & Explanation:**

**How it happened, in three steps.**

**Step 1 — no pointers at all.** In late-1940s machines an instruction's machine code contained a **fixed physical address**, unchangeable unless the instruction itself was rewritten. Looping over a list therefore required **self-modifying code**: fetch the instruction, `ADD` to increment its address field, store it back over itself, execute it. **The program was rewriting its own code, not just its data.**

**Step 2 — the B-line register (1949, Manchester).** The **first-ever index registers**: a dedicated hardware register holding a **memory address offset**, so the CPU computed

```
effective address = base address in instruction + B-register offset
```

The instruction in memory was **never touched**, and address calculation moved **inside hardware**. This is the historical origin of the pointer.

**Step 3 — formalisation in the simplest possible way.** The B-register and later **General-Purpose Registers** formalised the pointer as:

> **An address is just a number.**

So a **pointer is simply the integer value stored in a register or memory location**, and **the hardware does not inherently know whether a value is "data" or "an address."** The value `0x4000` is *both* the integer `16384` and the address `16384`; **only the instruction decides which** — `ADD` treats it as a number, `LOAD` as an address to fetch from. This was chosen partly because it was **backward-compatible with pre-pointer code**.

**The three missing pieces of semantic information** — and this table is the heart of the lecture:

| The CPU does not know | Meaning | Vulnerability class it enables |
|---|---|---|
| **Bounds** | No information about the **size of the buffer** for which the pointer is valid | **Buffer overflow** — write past the end, overwrite a return address or other control data, seize control of execution flow |
| **Type** | Cannot verify that the data at the location **matches the type the program expects** | **Type confusion** — e.g. read a `User` object through an `Admin` pointer, misinterpreting the memory layout, bypassing checks and exposing private fields |
| **Lifetime** | Does not know whether the memory is **still allocated or already freed** | **Use-after-free** — a dangling pointer writes into memory since reallocated for a new sensitive object, corrupting its state |

**The slides' central claim:** representing a pointer as a simple integer is **the foundational reason for most modern memory-safety vulnerabilities and enables the majority of cyber attacks.** The lack of hardware-enforced context is *the* key attack vector exploited today.

**Why C made it worse.** C was designed as a **portable assembly language** and **directly exposed the raw hardware model to the programmer**. It formalised the pointer as a variable holding an unsigned integer address, and added **pointer arithmetic**:

```c
int  *p;  p++;   /* +4 bytes */
char *p;  p++;   /* +1 byte  */
```

so that `new address = old address + sizeof(*ptr)`. But — and this is the examinable point — **the scaling is a compile-time abstraction only.** At machine level `ptr++` is **integer addition on a value in a register**, and the hardware still knows nothing of the pointer's type, the object's size, or its intended bounds.

So C gave programmers very high control and performance while making them **directly responsible for managing raw memory addresses**, with no hardware check on whether they did so correctly. **The compiler knows the type and the size; it simply has no way to tell the hardware.** Every mechanism in the rest of this chapter is an attempt to give the hardware back the information the compiler already had.

**The historical lesson the lecture draws.** COBOL's `ALTER` statement let a high-level language perform the self-modifying-code trick, because early hardware made loops expensive: **register scarcity** (some systems had as few as **three** index registers) and **expensive branching** (increment, compare, conditional branch on slow hardware). `ALTER` traded clarity for speed, and **was not obsolete until COBOL-85** — long after more registers, **branch prediction** and **pipelining** had removed the bottleneck, and by then self-modifying code was a **massive performance penalty** because it forces the CPU to discard pre-fetched and pipelined instructions.

> **The lesson: software design decisions made to overcome hardware limitations create long-term technical debt, and the practice persists for decades after the hardware reason disappears.** That is the analogy for memory safety itself — an early hardware choice about pointers, made for simplicity and compatibility, still shapes vulnerabilities seventy-five years later.

---

### Question 3 — The four-level memory safety barrier model

**Q:** Describe the "memory safety barrier" model. Give all four levels with the limitation of each, and say which technology from this lecture exemplifies levels 3 and 4. Explain what distinguishes level 4 from level 3 and why that distinction is the point of the whole lecture.

**Answer & Explanation:**

**The barrier.**

* **Above the barrier:** software is running **within the defined features of the hardware and software language specification** — execution remains inside the intended rules of the program and language.
* **Below the barrier:** software is executing in an **undefined state, outside the program's intent or the language specification.** This is where memory-safety vulnerabilities become exploitable.

**The four levels of response:**

| Level | Approach | Limitation |
|---|---|---|
| **1** | **Testing and bug fixing** — try to remove the potential for software to reach and pass through the barrier | **Many bugs are not found.** Testing only finds bugs **covered by the test suite** |
| **2** | **Memory-safe languages and/or software verification tools** | They help find more bugs and reduce how many developers make, but **cannot stop all bugs** |
| **3** | Hardware features that **statistically block** software from entering an undefined state | Probabilistic — attacks become **much harder**, not impossible |
| **4** | Hardware that **deterministically, architecturally blocks** entry into an undefined execution state | Software would **no longer have architectural memory-safety vulnerabilities** |

**The exemplars.**

* **Level 3 — ARM MTE.** It is explicitly described as **probabilistic because it uses only 4-bit tags**: 16 possible values, so a **1 in 16** chance that an illegal access goes undetected because the tags happen to match (Question 11).
* **Level 4 — CHERI.** Presented as providing **strong architectural enforcement**, with the **BLASTPASS** case as the evidence: CHERI **deterministically mitigated** that vulnerability (Question 14 and the closing note below).

**What actually distinguishes level 4 from level 3, and why it matters.** The difference is not "stronger" versus "weaker" — it is a difference in **kind of guarantee**:

* A **statistical** defence changes the attacker's **success probability**. It is defeated by **repetition**: an attacker who can retry gets 16 attempts' worth of chances against a 4-bit tag, and an attacker who can *choose* which allocations to target may not even need to retry (Question 11's aliasing case). It also cannot be reasoned about compositionally — you cannot say "this program has no exploitable overflow", only "an overflow is likely to be caught".
* A **deterministic architectural** guarantee changes what is **expressible**. An out-of-bounds access is not *usually* caught; it **cannot be performed**, because the capability authorising the access carries bounds the hardware checks on every use. That is a property you can build a security argument on top of, which is why CHERI can go on to support **compartmentalisation** (Question 8) while MTE cannot.

**Why the model is the right frame for the whole lecture.** Levels 1 and 2 are where the industry has spent decades, and the ~**70%** figure is the measurement of how well that went: **67%** of 2021 in-the-wild 0-days were memory corruption; **70%** of serious Chromium bugs are memory safety; **around 70% of Microsoft's CVEs** are memory unsafety. Governments now treat this as strategic — CISA's *The Case for Memory Safe Roadmaps*, the UK National Cyber Strategy and Semiconductor Strategy, and the White House's *Back to the Building Blocks*.

The argument the model makes is therefore: **levels 1 and 2 are necessary and demonstrably insufficient, so the barrier has to be enforced lower down — in the ISA.** And note the honest ordering: level 2 (memory-safe languages) is not dismissed, it is placed *above* hardware precisely because it cannot cover the C and C++ that the world's systems software is already written in — **6 million lines** of which have been compiled for CHERI at a **0.026%** line-modification rate, which is the argument that level 4 is reachable without rewriting everything.

---

### Question 4 — ARM Pointer Authentication

**Q:** Explain what PAC protects and the security question it answers. Give the signing and authentication operations, naming the algorithm and all three inputs. State both outcomes of an authentication check, work the return-address example, and give the **two** limitations.

**Answer & Explanation:**

**What it protects, and the question it answers.** PAC provides **cryptographic integrity and authenticity protection for pointers**, especially **control data** — **return addresses** and **function pointers**. It ensures pointers have not been **illicitly modified after being created by a trusted software component**. The security question:

> **Has this pointer been illicitly modified since it was created?**

**The core principle.** PAC uses **unused high-order bits of a 64-bit virtual address** to store a cryptographic signature — the **Pointer Authentication Code**. Because a 48-bit virtual address leaves the top bits unused, there is room for a signature **inside the pointer itself**, with no extra storage (Question 12 does the bit budget).

**Signing — the `PAC*` instructions.** When a pointer needs protection, for instance a return address before it is stored on the stack, a `PAC*` instruction computes:

```
PAC = QARMA(pointer, context_64, key_128)
signed pointer = pointer with the PAC inserted into its upper bits
```

The three inputs are the **original pointer**, a **64-bit context** (such as the stack pointer), and a **secret 128-bit key** held in **protected system registers** (IAK, IBK, and others). The algorithm is **QARMA**.

**Why the context matters** — this is the input people forget, and it is what makes the scheme more than a checksum. Because the SP is mixed in, a pointer signed in one stack frame **will not authenticate in a different frame**, so a signed return address cannot simply be copied from elsewhere on the stack. Question 18 traces exactly this.

**Authentication — the `AUT*` instructions.** Before the pointer is used, for instance before a `RET` consumes a return address:

1. Hardware **recalculates** the PAC from the same three inputs.
2. Hardware **compares** it with the PAC stored in the pointer.

```
authentication succeeds  <=>  PAC_stored == QARMA(pointer, context_64, key_128)
```

**The two outcomes:**

| Result | Behaviour |
|---|---|
| PACs **match** | Authentication succeeds, the **PAC is stripped**, and the instruction proceeds with the valid pointer |
| PACs **differ** | Authentication fails, hardware **raises a fault exception**, and the program **terminates** |

**The return-address example, in seven steps:**

1. A function is called.
2. Its return address is **signed** before being stored on the stack.
3. An attacker uses a **buffer overflow** to overwrite the saved return address.
4. The overwritten pointer **does not carry a valid PAC** — the attacker cannot compute one without the key.
5. On return, hardware runs the **`AUT`** check.
6. The check **fails**.
7. The program **faults** instead of jumping to the attacker's chosen address.

**Limitation 1 — pointer substitution / reuse.** PAC prevents **modifying** a protected pointer's value. It does **not** prevent **replacing one protected pointer with another validly signed pointer copied from elsewhere.** If an attacker finds a useful signed pointer — a **PAC gadget** — the attack may still succeed. The signature attests "this pointer was signed with this key and this context", not "this is the pointer that belongs here."

**Limitation 2 — key leakage.** PAC's security depends **entirely on the secrecy of the 128-bit keys**. If another vulnerability leaks them from the protected system registers, **the mitigation is defeated** — the attacker can then sign any pointer they like. Note the shape: this is the same single-secret dependency as a stack canary or KASLR, and it fails the same way.

**Where PAC sits in the layered defence.** PAC protects the **backward edge** (returns) and function pointers; **BTI** restricts **forward-edge** indirect branch targets; **MTE** checks whether an access is permitted at all. They are designed to work together, and Question 5 gives the measured result of combining the first two.

---

### Question 5 — Branch Target Identification and Jump-Oriented Programming

**Q:** State what BTI provides and the threat it addresses. Explain how JOP differs from ROP and give the four stages of a JOP attack. Explain how BTI blocks it, including the per-page mechanism and why BTI instructions sit in the NOP space. Give the **three** limitations and the measured benefit of PAC + BTI.

**Answer & Explanation:**

**What BTI provides.** A **low-overhead, forward-edge Control-Flow Integrity mechanism** that **restricts the targets of indirect branches**. It is designed to work **alongside PAC**.

**The threat: Jump-Oriented Programming.** JOP chains existing code fragments called **gadgets**. The difference from ROP is precise:

| | Gadgets end in | Edge attacked |
|---|---|---|
| **ROP** | `RET` | Backward |
| **JOP** | **Indirect branches — `BR`, `BLR`** | Forward |

**The four stages of a JOP attack:**

1. **Find gadgets.** The attacker scans application memory and loaded libraries for short instruction sequences that **already exist in executable code**, each performing a small operation and **ending with an indirect branch**.
2. **Corrupt the stack.** Using a vulnerability, typically a buffer overflow, the attacker overwrites stack data — **not with shellcode**, but with a **crafted sequence of addresses**, each pointing at a gadget.
3. **Hijack control flow.** The attacker triggers the first indirect branch; execution jumps to the first gadget; that gadget's own indirect branch takes **the next corrupted stack value** as its target.
4. **Chain execution.** The process repeats, constructing a malicious computation **entirely out of existing, legitimate code**.

**Why this bypasses Execute Never.** XN prevents **injected code** from being executed. JOP injects **no code at all** — only addresses of code that is already executable and already marked as such. This is exactly the von Neumann problem from Question 1 in its second form: control data was corrupted so that existing code runs in an unintended order.

**How BTI blocks it.** The compiler places a **special BTI instruction at the start of every function or code block that is a legitimate target of an indirect jump**. When a memory page is marked **guarded**:

* the CPU **permits indirect branches only to land on a BTI instruction**;
* **a jump into the middle of an instruction sequence — i.e. into a gadget — faults.**

Since gadgets are by definition *not* at legitimate entry points, the gadget supply collapses.

**The mechanism, and two design details.** BTI is enabled **per page** via a **Guard Page (GP) bit** in the memory translation tables, which lets **BTI-protected and legacy code coexist** in one process. And BTI instructions are encoded in the **"NOP space"**, so **code compiled with BTI runs on older processors**, which treat the instructions as no-ops — **with no BTI protection provided there**. That is a deliberate adoption trade: binaries are forward- and backward-compatible, and the protection appears only on hardware that implements it.

**The three limitations:**

| Limitation | Detail |
|---|---|
| **No backward-edge protection** | BTI protects indirect **jumps and calls** — the forward edge. It does **not** protect function `RET` instructions. **So BTI must be combined with PAC** (or equivalent) to cover **both** ROP and JOP |
| **Coarse granularity** | By default **any** BTI instruction is a valid target for **any** indirect branch within a guarded page, so an attacker may still redirect execution to a **different valid BTI target**. Harder than classic JOP, but still a risk |
| **Software dependency** | Effectiveness depends on the **OS correctly marking pages as guarded** and the **compiler inserting BTI instructions everywhere required** |

**The measured benefit.** Enabling **both BTI and PAC** gives a **97% reduction in available ROP and JOP gadgets in GLIBC**.

**How to read that number honestly.** 97% is a large reduction and it is the right figure to quote — but it is a reduction, not an elimination, and the residual matters. If a library offers on the order of 100,000 gadgets, **3% is still about 3,000**, which is well above the handful an attacker typically needs for a useful chain. So the correct claim is that PAC + BTI **substantially raises the cost** of code-reuse attacks by shrinking the gadget space and forcing the attacker onto legitimate entry points, not that it **eliminates** them. That is precisely the level-3-versus-level-4 distinction from Question 3: these are strong probabilistic and coarse-grained defences, and the deterministic answer to code reuse is the **architectural** one — CHERI, whose capabilities make an unauthorised control-flow target inexpressible rather than merely improbable.

---

### Question 6 — Memory Tagging Extension

**Q:** Give MTE's core rule and the security question it answers. Describe the tagged-pointer and tagged-memory representation, the allocation and access behaviour, and how spatial and temporal violations are each detected. Then give the **four** limitations.

**Answer & Explanation:**

**The core principle.** MTE associates a small metadata **tag** with **both** pointers and the memory they reference, and **hardware validates that the tags match on every memory access**:

```
access permitted  <=>  tag(pointer) == tag(memory granule)
```

**The security question it answers:**

> **Does this pointer have valid permission to access this specific memory region right now?**

Note the contrast with PAC's question — PAC asks whether the pointer has been *modified*; MTE asks whether **this** pointer may access **this** memory **now**. The word "now" is what gives MTE temporal coverage.

**The representation:**

| | Where | Size |
|---|---|---|
| **Pointer tag** | The **upper four bits** of a 64-bit pointer | 4 bits → **2⁴ = 16** possible values |
| **Memory tag** | A dedicated, **hardware-managed region of DRAM**, one tag per **16-byte granule** of physical memory | 4 bits per 16 bytes |

**Allocation behaviour.** When memory is allocated, for instance by `malloc`:

1. The allocator **generates a random 4-bit tag**.
2. It **stores that tag** in the memory-tag region **for every 16-byte granule of the allocation**.
3. It **returns a pointer with the same tag** embedded in its upper four bits.

So by construction `tag(pointer) == tag(allocated memory granules)`.

**Access behaviour.** On **every `LOAD` or `STORE`**, hardware reads the tag from the pointer, reads the tag from the target memory, and compares them. Match → **access permitted**. Mismatch → **hardware detects a fault**.

**Spatial violation detection.** If a buffer overflow crosses into a granule with a **different tag**, hardware detects the mismatch:

```
pointer tag = A,  adjacent memory tag = B,  A != B  ->  fault
```

The slides' visual model: **the allocated region and the regions before and after it are given different tag "colours"**, with adjacent regions **randomly tagged** to catch both overflows and underruns.

**Temporal violation detection.** If memory is **freed and later reallocated with a new tag**, an old dangling pointer retains the **old** tag:

```
dangling pointer tag = A,  reallocated memory tag = C,  A != C  ->  fault
```

**When memory is freed, regions are re-tagged**, which is what makes use-after-free detectable at all.

**The four limitations** — and MTE is only defensible if you can state these:

**1 — Probabilistic security.** With only 4-bit tags there are **16 possible tags**, so there is a **1 in 16 chance an illegal access is not detected** because the pointer tag happens to match the target's:

```
P(missed illegal access) = 1/16 = 6.25%
```

**MTE is therefore probabilistic, not deterministic** — level 3, not level 4, in Question 3's model.

**2 — Granularity.** Protection is at **16-byte granularity**, so **an overflow that stays within the same granule is not detected**. The slides' example: a **4-byte buffer**, written **8 bytes past the end**, still inside the same 16-byte granule → **no tag mismatch**. Question 19 traces this and Question 25 is the bug.

**3 — Allocation-time aliasing.** If two adjacent buffers are allocated back-to-back and the allocator happens to assign **the same random tag to both**, an overflow from one into the other **is not caught**. Note this is not the same as limitation 1: here the collision is decided **once, at allocation**, so the attacker does not get an independent 1-in-16 roll per access — every access in that overflow direction is undetected, deterministically.

**4 — Performance modes.** MTE can run **asynchronously**, in which faults are **detected but reported later**. The benefit is **low overhead**; the risk is that **fault reporting is imprecise** and **the attacker gets a larger window to operate before termination**. So the cheap deployment mode is also the weakest one — an important point for any question asking whether enabling MTE "solves" memory safety.

---

### Question 7 — CHERI capabilities

**Q:** Expand CHERI, give its origin and its three primary objectives, and define a capability. Give the structure of a 128-bit capability and the **five** protection properties it enforces. Explain how the register file and memory are extended, and what `$PCC` and `$DDC` are for.

**Answer & Explanation:**

**CHERI** stands for **Capability Hardware Enhanced RISC Instructions**. It was co-led by the **University of Cambridge** in collaboration with **SRI International**, beginning in **2010**, with the goal of addressing widespread memory-security issues **at their hardware source**.

**The three primary objectives:**

1. **Fine-grained memory protection** — a more precise and robust way to control memory access, preventing unauthorised **reads, writes and code execution**.
2. **Scalable software compartmentalisation** — separating parts of an application so that **a vulnerability in one component does not compromise the whole system**.
3. **Minimal disruption** — integrating with existing programming languages and operating systems, for practical adoption with minimal changes.

**The definition:**

> **A capability is a hardware-protected pointer-like value that carries unforgeable bounds and permissions.**

Capabilities mitigate **spatial** errors such as out-of-bounds access and **heap temporal** errors such as use-after-free — i.e. exactly the two classes from Question 2 that the integer pointer could not prevent, because it carried neither bounds nor lifetime information.

**Structure — a 128-bit capability plus a 1-bit tag:**

```
capability = (address, bounds, permissions, metadata, valid tag)
```

The **128 bits** hold a **64-bit virtual address**, **permissions**, and **bounds compressed relative to the address**. The **separate 1-bit tag** records **validity**. Access is allowed only if:

```
lower bound <= address < upper bound
```

**The five protection properties** — these are what a full answer must enumerate:

| Property | What it guarantees |
|---|---|
| **Integrity and provenance validity** | **Valid pointers must be derived from other valid pointers through valid transformations**; invalid pointers cannot be used. You cannot manufacture a capability out of an integer |
| **Bounds** | Prevent a pointer being manipulated to reach the wrong object — **a pointer to object A cannot be widened or shifted to access object B** |
| **Monotonicity** | Prevents **pointer privilege escalation**, in particular **broadening bounds**. A derived capability **may become less powerful, never more** |
| **Permissions** | Limit unintended use — e.g. **W⊕X for pointers**, so a pointer cannot be misused for an unintended kind of access |
| **Tags** | Protect capability integrity and derivation **in registers and in memory**. **If a capability is overwritten by ordinary non-capability data, the validity tag is cleared** |

**Why the tag-clearing rule is the elegant part.** It resolves the von Neumann problem of Question 1 without abandoning a unified memory. Code and data still share one memory, but the **1-bit tag distinguishes a capability from an integer at every location**, and any ordinary data write over a capability **destroys its validity**. So an attacker who overflows a buffer *can* overwrite a stored pointer — and what they produce is an **untagged value that cannot be dereferenced**. The hardware has been given back the information the compiler always had.

**Register file and memory extensions.**

* **64-bit general-purpose registers are extended** with **64 bits of metadata** and a **1-bit validity tag**: `64 + 64 + 1 = 129 bits`.
* The program counter becomes the **Program Counter Capability, `$PCC`** — so even instruction fetch is bounds- and permission-checked.
* **Tagged memory** protects **capability-sized and capability-aligned words in DRAM** by adding a **1-bit validity tag** to each.
* **New instructions** explicitly **load, store, inspect and manipulate** capability values, while **existing encodings are reused for capability-relative dereferences** in a suitable mode.
* The **Default Data Capability, `$DDC`**, **constrains legacy integer-relative load and store instructions** — which is how unmodified legacy code is still confined.
* System mechanisms are extended too: a **capability-instruction enable control register**, **new PTE permissions**, **new exception codes**, and **exception stack pointers and vectors becoming capabilities**.

**How C and C++ use this.** CHERI C/C++ uses **capability pointers** in place of integer pointers; data types are laid out for **wider, capability-aligned** pointers; and code generation is pointer-aware, emitting explicit **load-capability and store-capability** instructions. **Software TCBs restrict capability bounds and permissions as code runs** — the `mmap()` system call, the **runtime linker**, the **heap allocator** and the **stack allocator** each hand out narrower capabilities than they hold. Hardware then **continuously enforces** the protections on all pointer manipulation and use, and this covers **every** pointer type: **implicit sub-language pointers** (GOT entries, stack pointers, return addresses) as well as **explicit language-level pointers** (to globals, stack allocations, heap allocations, and functions).

> That last point is why CHERI subsumes much of what PAC and BTI do separately: **return addresses and function pointers are capabilities too**, so ROP and JOP targets are bounded and permission-checked architecturally rather than signed or restricted to marked entry points.

---

### Question 8 — CHERI compartmentalisation, sentries, and the evidence

**Q:** Define the reachable set of capabilities for a thread and explain why memory safety is a prerequisite for compartmentalisation. Explain what a sentry is and trace a compartment transition. Then state CHERI's costs and the evidence for its benefits, including the BLASTPASS result.

**Answer & Explanation:**

**The reachable set.**

> **The reachable capabilities for a thread are those in the thread's register file or program counter capability `$PCC`, and those transitively loadable via any capability in its register file.** All other capabilities are **unreachable and unavailable** to the thread.

Each capability **authorises access to a memory region**, which could be code, a heap allocation, a global, a stack object, or another memory type.

**Why memory safety is a prerequisite.** The slide states it directly: **memory safety is a necessary first step toward CHERI compartmentalisation.** The reason is that the reachable-set argument is only meaningful if a thread **cannot fabricate a capability it was not given**. That is exactly what **provenance validity** (no capability from thin air) and **monotonicity** (no widening) guarantee. Without them, "unreachable" would be an aspiration rather than a property — an attacker could forge or widen a capability and the set would not bound anything. So compartmentalisation is not a separate feature bolted on; it is what the five properties of Question 7 buy once you have them.

**Two compartments in one address space.** Compartments share a **virtual address space**, each with **its own set of capabilities**. **Provenance validity and monotonicity prevent privilege escalation beyond each compartment's reachable capabilities**, which lets software implement **strong, architecturally supported isolation** without giving each compartment its own page table. Initial sharing is **authorised by the TCB**, which **delegates capabilities for shared resources** — functions, globals, heap objects. The performance consequence is significant: **fast domain switching and shared memory without TLB contention**.

**What a sentry is.**

```
sentry = sealed entry capability
  code pointer to compartment
  sealed          = cannot be dereferenced or modified
  entry capability = code entry pointer
```

It is **essentially a carefully constructed function pointer** that lets an outside **caller** execute a specific function inside a protected **callee** compartment **without gaining full access to that compartment's internal state**.

**The transition, in four steps:**

1. **Creating the sentry.** The target compartment creates a sentry capability pointing at a **specific function** inside itself, with **sealed permissions** — usable **only for a call**, and **not modifiable or dereferenceable by the caller**.
2. **The call.** The external module does not call the function directly; it calls **through the sentry capability**:

   ```asm
   jalr rd, 0(sentry)    # unseals the sentry and jumps to the address
   ```
3. **Secure transition.** CHERI hardware recognises the call via the sentry and triggers a **secure compartment transition**, switching from **caller context to callee context** — changing the **active register state** and **memory permissions**. **The sentry ensures execution begins only at the intended trusted entry point.**
4. **Execution and return.** The function executes **with its own privileges**; on completion hardware performs another secure transition, **restoring the caller's context and privileges**.

**Why sealing is the key idea.** An ordinary capability you can call, you can also **inspect and modify** — so handing one out would leak the compartment's internals. Sealing separates *the authority to invoke* from *the authority to examine*, which is what makes a one-way gateway possible. Note the parallel with the access-control material: this is **designation fused with permission**, narrowed to a single operation, which is exactly the capability-system answer to the confused deputy.

**What CHERI improves, quantitatively.** Current CPU designs are limited in (1) the **number of compartments and the rate of their creation and destruction**, (2) the **frequency of switching between compartments** as the count grows, and (3) the **nature and performance of memory sharing** between them. **CHERI has been shown to improve each of these by at least an order of magnitude** — and the security effect is that **CHERI contains an attack within a compartment, preventing access to other data**.

**Costs versus benefits.**

| | |
|---|---|
| **Main cost** | **Larger memory footprint due to larger pointers**, varying significantly with **programming language and data structures used** — often around **5%** for C/C++ (Question 13 shows why it varies so much) |
| **Benefits** | **Fine-grained spatial and temporal memory protection**, fundamentally mitigating memory-safety vulnerabilities; **improved control-flow robustness**, making ROP/JOP much harder or impossible; **highly scalable compartmentalisation**, fundamentally reducing attack surface |

**The evidence, as of 2025.** **6 million lines of C/C++ compiled for memory safety** with modest dynamic testing; **three compartmentalisation case studies in Qt/KDE**; a **0.026% line-of-code modification rate** across the corpus for memory safety; and a **73.8% mitigation rate** across the corpus using memory safety **and** compartmentalisation. The accompanying observation is important and honest:

> **Memory safety is not enough to address the de facto threat model of quite a few libraries.**

That is, memory safety is **necessary but not always sufficient** — some components need **compartmentalisation** because their threat model assumes malicious inputs, logic errors, or internal compromise. It is also why the mitigation figure is 73.8% rather than ~100%.

**The BLASTPASS result — CVE-2023-4863.** A **heap buffer overflow** in Google's **`libwebp`**, exploitable for **remote arbitrary code execution**, discovered **in the wild** after targeted attacks using NSO Group's **Pegasus**. It had gone **undiscovered for years despite fuzzing**, because of the **complexity of the Huffman coding logic**, and affected **Chrome, Edge and WebKit** — first-party code for Google, third-party for Apple and Microsoft, with **zero-interaction exploitation of iOS**. The CHERI result:

* There was **no prior awareness of this CVE** in the CHERI work.
* There were **0% LoC changes to `webp`** for use on CHERI.
* **CHERI deterministically mitigated the vulnerability without awareness of its nature, location or origin during development.**

> **The takeaway to state: CHERI's protection is architectural — it can stop certain memory-safety vulnerabilities without knowing the specific bug in advance.** That is what "deterministic" means in Question 3's level 4, and it is a categorically different claim from any mitigation whose effectiveness depends on having anticipated the bug class, the code path, or the exploit technique.

**CHERIoT**, briefly, for microcontrollers: a **hardware-software pure-CHERI platform for secure embedded systems** on **RISC-V 32-bit**, created by **Microsoft** and maintained by Microsoft, Google and SCI Semiconductor. It uses **CHERI instead of a PMP** and is **area neutral** — adding capability-extended registers and capability logic while **replacing the fully associative PMP structure** — and supports an **arbitrary number of protection regions and compartments**. Its **use-after-free temporal safety** comes from a **revocation quarantine** (a **bitmap of freed regions at 1 bit per 8 bytes**) plus a **load filter** preventing use of dangling pointers before revocation — which **works well for microcontrollers but is not scalable to larger memories** (Question 13 shows why). It makes **extensive use of formal methods to verify the core**, and the ISA, ABI and RTOS are **co-designed** for **privilege separation for everything**, **fine-grained auditing** and **lightweight code sharing**. Note the course flag: **CHERIoT extra detail is explicitly "not required to pass the exam with a good mark."**

---

## Part 2: Memory & Storage Size Calculations

### Question 9 — B-line register effective addresses

**Q:**

1. An instruction encodes base address `100`; the B-register holds `5`. Give the effective address.
2. Repeat for base `0x1000` with offset `0x2C`, and base `0x4000` with offset `0x18`.
3. Using the slides' four-step self-modifying-code sequence, how many steps are needed to walk a 1000-element list, and how many with a B-register? Give the ratio.
4. What is the crucial architectural difference, beyond step count?

**Answer & Explanation:**

**1 and 2 — the effective address.** The B-register's contribution is a plain addition performed **inside the CPU at execution time**:

```
EA = A_base + B
```

| Base | Offset | Effective address |
|---|---|---|
| `100` | `5` | **`105`** |
| `0x1000` (4096) | `0x2C` (44) | **`0x102C`** (4140) |
| `0x4000` (16384) | `0x18` (24) | **`0x4018`** (16408) |

**3 — step counts.** The slides give self-modifying code as a **four-step** sequence per element: **fetch** the instruction, **calculate** the new address with an `ADD`, **store** the modified instruction back, **execute** it. With a B-register the instruction is untouched, so per element you **increment the offset** and **execute**:

```
self-modifying: 4 steps × 1000 = 4000 steps
B-register:     2 steps × 1000 = 2000 steps
ratio:          2× fewer
```

**4 — the crucial difference.** The step count understates the gain, and the architectural point is the one to make:

> **The original instruction stored in memory is never touched. Address calculation happens inside hardware.**

Three consequences follow, and the third is the one that lasted.

**It eliminated slow self-modifying-code loops** — the immediate motivation.

**It made the code read-only in principle**, which is the seed of everything in this chapter. A program that rewrites its own instructions *requires* code memory to be writable, so **W⊕X and Execute Never are unthinkable** while self-modifying code is the normal way to loop. Separating "the instruction" from "the address it operates on" is the precondition for ever marking code non-writable.

**It is the historical origin of the pointer** — and of the problem. The B-register formalised an address as **a number you can add to**, which is precisely the representation Question 2 identifies as carrying **no bounds, type or lifetime**. So the same 1949 innovation that made structured looping possible also fixed the integer pointer into the architecture, and CHERI's capabilities are the attempt, seventy-five years later, to attach the missing metadata back onto that number.

**A note on the long tail.** Self-modifying code persisted long after the hardware reason vanished — COBOL's **`ALTER`** was not obsolete until **COBOL-85**, by which time **more registers, branch prediction and pipelining** had removed the bottleneck, and self-modifying code had become a **performance penalty** because it **forces the CPU to discard pre-fetched and pipelined instructions**. The lesson: **software workarounds for hardware limitations become long-term technical debt that outlives the limitation by decades.**

---

### Question 10 — Pointer arithmetic scaling and the integer/address ambiguity

**Q:** A register holds `0x4000`.

1. What integer does it represent, and what determines whether the CPU treats it as a number or an address?
2. For `char *`, `int *`, `double *` and `struct rec { int id; char tag; } *` all set to `0x4000`, give `p + 1` and `p + 3`.
3. Give `(char *)i + 3` where `i` is the `int *`, and explain the difference from `i + 3`.
4. Evaluate `(int *)0x4010 - (int *)0x4000` and `(char *)0x4010 - (char *)0x4000`.
5. What does the hardware know about any of this?

**Answer & Explanation:**

**1 — The value and what disambiguates it.**

```
0x4000 = 16384
```

It is simultaneously the integer `16384` and the memory address `16384`. **The CPU distinguishes the meaning only from the instruction:**

```
ADD  instruction -> treat 0x4000 as a number
LOAD instruction -> treat 0x4000 as an address to fetch from
```

**2 — Scaled arithmetic.** `new address = old address + n × sizeof(*ptr)`. Note `sizeof(struct rec)` is **8**: `int` at offset 0–3, `char` at 4, then **3 bytes of tail padding** to satisfy the struct's 4-byte alignment.

| Type | `sizeof(*p)` | `p + 1` | `p + 3` |
|---|---|---|---|
| `char *` | 1 | **`0x4001`** | **`0x4003`** |
| `int *` | 4 | **`0x4004`** | **`0x400C`** |
| `double *` | 8 | **`0x4008`** | **`0x4018`** |
| `struct rec *` | 8 | **`0x4008`** | **`0x4018`** |

**3 — The cast changes the scale.**

```
i + 3            = 0x4000 + 3 × 4 = 0x400C
(char *)i + 3    = 0x4000 + 3 × 1 = 0x4003
```

**Same starting value, same literal `3`, addresses nine bytes apart.** The scale factor lives entirely in the **static type**, and casting is how you change it. This is the single most common source of hand-computed offset errors, and the reason a length taken from a wire protocol — always in **bytes** — must never be added to a typed pointer without an explicit cast.

**4 — Pointer differences.**

```
(int  *)0x4010 - (int  *)0x4000 = 16 / 4 = 4    (elements)
(char *)0x4010 - (char *)0x4000 = 16          (bytes)
```

Subtraction is **divided** by the element size, so the result is in **elements** and has type `ptrdiff_t`. The two answers describe the same distance in different units.

**5 — What the hardware knows: nothing.** Every one of the values above is produced by the **compiler** performing multiplication at compile time and emitting **plain integer addition**. At machine level:

```
ptr++  ==  integer addition on the address held in a CPU register
```

**The hardware does not know the pointer's type, the object's size, or the intended bounds of the object.** So all four rows of the table are, to the CPU, the same instruction with a different constant — and there is no mechanism by which it could object if `p + 3` left the object entirely.

**Why this question is the whole chapter in miniature.** The compiler **has** the type, size and bounds information; it uses that information to compute the scale factor; and then it **throws the information away**, emitting an untyped integer add. Question 2's three missing metadata items are not missing because nobody knew them — they are missing because **the ISA offered no way to carry them.** MTE adds 4 bits of tag to that register value; CHERI extends it to 129 bits with explicit bounds and permissions. Both are answers to exactly this question.

**A final note that connects to Question 19.** The program implied here casts integer literals to pointers and does arithmetic on them. On a conventional machine that is harmless as long as nothing is dereferenced. **On CHERI it behaves differently**: an integer-to-pointer cast produces a value with **no valid tag**, so any attempt to dereference it faults — provenance validity means a pointer must be **derived from another valid pointer**, and `(int *)0x4000` is derived from nothing.

---

### Question 11 — MTE tag arithmetic

**Q:**

1. How many distinct tags does MTE provide, and what is the probability that an illegal access goes undetected?
2. If an attacker makes 1, 2, 3 and 5 *independent* illegal accesses, what is the probability at least one is caught?
3. How many granules are tagged for `malloc(4)`, `malloc(48)`, `malloc(100)` and `malloc(1000)`? How much slack is tagged in each case?
4. What is MTE's DRAM overhead for tag storage, and how much tag memory does a 16 GiB and a 64 GiB machine need?
5. Give the intra-granule blind spot concretely, and the probability that two adjacent allocations collide.

**Answer & Explanation:**

**1 — Tag space and the miss probability.**

```
4-bit tags -> 2^4 = 16 distinct tags
P(missed illegal access) = 1/16 = 0.0625 = 6.25%
```

An illegal access is undetected exactly when the pointer's tag **happens to equal** the target granule's tag, which for a random tag assignment is 1 in 16.

**2 — Repeated independent attempts.** `P(at least one caught) = 1 - (1/16)^n`:

| n | P(all n missed) | **P(≥1 caught)** |
|---|---|---|
| 1 | 6.25% | **93.75%** |
| 2 | 0.39% | **99.6094%** |
| 3 | 0.024% | **99.9756%** |
| 5 | 0.0001% | **99.9999%** |

**How to read this correctly, because it cuts both ways.** For a **buggy** program, MTE is very likely to catch the bug: any test run performing the illegal access a few times will fault with probability approaching 1, which makes MTE an excellent *debugging* and *crash-reporting* tool. For an **attacker**, the arithmetic is different — a **single** attempt succeeds 6.25% of the time, and because a crash is usually cheap for an attacker (retry, or target a forking server), 1-in-16 is not a strong barrier. **The same number is reassuring for reliability and weak for security**, which is precisely why MTE is level 3 rather than level 4.

**3 — Granule counts.** Tags apply to whole **16-byte granules**, so an allocation tags `ceil(size/16)` granules:

| Allocation | Granules | Bytes tagged | Slack tagged |
|---|---|---|---|
| `malloc(4)` | **1** | 16 | **12** |
| `malloc(48)` | **3** | 48 | **0** |
| `malloc(100)` | **7** | 112 | **12** |
| `malloc(1000)` | **63** | 1008 | **8** |

The slack is the problem: those bytes carry the **same tag as the allocation**, so writes into them are **indistinguishable from legitimate accesses**.

**4 — DRAM overhead.**

```
4 bits of tag per 16 bytes of memory
= 4 / (16 × 8) = 4/128 = 1/32 = 3.125%
```

| DRAM | Tag storage |
|---|---|
| 16 GiB | **512 MiB** |
| 64 GiB | **2048 MiB (2 GiB)** |

A little over 3% of DRAM, in a **dedicated, hardware-managed region**. Compare CHERI's tag overhead in Question 13 — **0.78%** — and note the inversion: MTE stores **more** metadata per byte than CHERI and provides a **weaker** guarantee, because CHERI's bit protects a pointer's *validity* while MTE's four bits must serve as a probabilistic *name* for a region.

**5 — The intra-granule blind spot.** The slides' example, worked exactly:

```
char *buf = malloc(4);        /* 1 granule, bytes 0..15, tag A */
memset(buf, 0, 16);           /* writes bytes 0..15 */
```

The allocation is 4 bytes but occupies **one whole granule**, so bytes **4..15 carry tag A as well**. Writing 12 bytes past the end therefore compares **tag A against tag A** — **no mismatch, no fault, undetected overflow.** Only at byte **16** does the pointer cross into the next granule and meet a different tag.

**Adjacent-allocation collision.** If the allocator assigns the same random tag to two adjacent buffers, an overflow between them is invisible:

```
P(two adjacent allocations receive the same tag) = 1/16 = 6.25%
```

**And this is worse than limitation 1, for a reason worth stating.** In part 2 each illegal access was an independent 1-in-16 roll, so repetition helped the defender. Here the collision is decided **once, at allocation time**, and then **every** access across that boundary is undetected — **deterministically**, for the whole lifetime of those two allocations. Repetition does not help the defender at all. An attacker who can influence allocation order can also **retry allocation** until a collision occurs, converting a 6.25% chance into a reliable primitive.

---

### Question 12 — The PAC bit budget

**Q:**

1. With 48-bit virtual addresses in a 64-bit pointer, how many bits are available above the address for a PAC?
2. Compute the forgery probability and the expected number of blind attempts for a 16-bit, a 15-bit and an 11-bit PAC. Explain what consumes the bits in each case.
3. Repeat for a 52-bit virtual address.
4. Is blind PAC forgery a practical attack? Justify your answer, and say what the realistic attack on PAC is instead.

**Answer & Explanation:**

**1 — The available bits.** PAC stores the signature in the **unused high-order bits of the pointer**, so the budget is whatever the address does not use:

```
64 - 48 = 16 bits available above a 48-bit virtual address
```

**2 — Forgery probability and attempts.** A blind forger must guess the signature; with `b` PAC bits, `P(success) = 1/2^b` per attempt and the expected number of attempts is `2^(b-1)`:

| PAC bits | What consumes the rest | `P(forge)` per try | Expected attempts |
|---|---|---|---|
| **16** | Nothing — all spare bits used | `1/65,536` = **0.00153%** | **32,768** |
| **15** | One bit as an **address-space selector** (upper/lower half) | `1/32,768` = **0.00305%** | **16,384** |
| **11** | Selector **plus the 4 bits MTE needs for its tag** | `1/2,048` = **0.0488%** | **1,024** |

**The 11-bit row is the important one.** PAC and MTE are complementary defences that **compete for the same bits**. Enabling MTE takes four bits out of the top of every pointer, which **shortens the PAC from 15 to 11 bits and multiplies the per-attempt forgery probability by 16**. Layered defences are not always free of one another, and this is a concrete, quotable example.

**3 — With a 52-bit virtual address.** Larger address spaces cost signature strength:

```
64 - 52 = 12 bits available
```

| PAC bits | `P(forge)` | Expected attempts |
|---|---|---|
| **12** (all spare) | `1/4,096` = **0.0244%** | **2,048** |
| **11** (minus selector) | `1/2,048` = **0.0488%** | **1,024** |
| **7** (minus selector + MTE tag) | `1/128` = **0.781%** | **64** |

**A 7-bit PAC is forged in 64 attempts on average** — barely a defence at all. So the security of PAC is **not a fixed property**: it degrades as virtual address space grows and as other features claim pointer bits.

**4 — Is blind forgery practical?** For a **single-process** target, essentially no: **every failed authentication raises a fault and terminates the program**, so the attacker gets **one attempt per process lifetime**. 32,768 expected attempts against a target that dies on the first miss is not an attack.

But the qualification matters. Where the attacker can **cheaply obtain a fresh process with the same key** — a **forking server** that inherits the parent's keys, or a service that restarts on crash — each crash is a free retry, and 1,024 or 64 expected attempts becomes entirely feasible. Crashes are noisy, which is a detection opportunity, but noise is not prevention.

**The realistic attacks on PAC are the two limitations from Question 4, not brute force:**

* **Pointer substitution.** PAC prevents *modifying* a pointer, not **replacing it with another validly signed pointer** — a **PAC gadget**. This requires **zero** guesses and is unaffected by PAC length. Question 18 makes it observable.
* **Key leakage.** The scheme's security rests **entirely** on the secrecy of the **128-bit keys** in protected system registers. A leak defeats it completely, and no number of PAC bits helps.

**The general lesson.** Bit-budget arithmetic tells you the cost of a **blind** attack, and blind attacks are usually the ones defenders can afford to ignore. Both real weaknesses here are **structural** — what the signature attests to, and where the key lives — which is the recurring shape of every mitigation in this chapter: **the arithmetic is reassuring, and the design assumption is where it breaks.**

---

### Question 13 — CHERI widths, footprint overhead, and revocation cost

**Q:**

1. Give the width of a CHERI capability, of an extended GPR, and the factor by which pointer width grows.
2. Compute `sizeof` conventionally and under CHERI for `struct node { int value; struct node *next; }` and for `struct bulk { int a[10]; char *p; }`. Give the ratio for each and explain why they differ.
3. What is CHERI's tag-memory overhead, and how much does a 16 GiB machine need?
4. CHERIoT's revocation quarantine uses 1 bit per 8 bytes. Compute the bitmap size for a 256 KiB, a 1 MiB and a 4 GiB heap, and explain the scalability claim.

**Answer & Explanation:**

**1 — Widths.**

```
capability      = 128 bits + 1 validity tag = 129 bits
extended GPR    = 64-bit address + 64-bit metadata + 1-bit tag = 129 bits
pointer width   = 8 bytes -> 16 bytes = 2× growth
```

**2 — Structure sizes.** A capability is 16 bytes and must be **16-byte aligned**, which changes padding as well as pointer size.

**`struct node { int value; struct node *next; }`**

```
conventional:  int 4  + pad 4  + ptr 8  = 16 bytes
CHERI:         int 4  + pad 12 + cap 16 = 32 bytes
ratio:         2.00×
```

**`struct bulk { int a[10]; char *p; }`**

```
conventional:  int[10] 40 + pad 0 + ptr 8  = 48 bytes
CHERI:         int[10] 40 + pad 8 + cap 16 = 64 bytes
ratio:         1.33×
```

**Why they differ — and this is the answer to "why does overhead vary significantly?"** The cost is driven by **pointer density**, not by code size:

* `node` is a **pointer-dominated** structure: half its useful content is a pointer, and the pointer's 16-byte alignment forces the padding after `value` from 4 bytes to 12. Both effects push the same way, giving a full **2×**.
* `bulk` is **pointer-sparse**: 40 bytes of payload amortise the pointer growth, so the overhead falls to **33%**.

This is exactly why the slides say the **main cost is a larger memory footprint due to larger pointers**, varying significantly with **programming language and data structures used**, and land on **around 5% for C/C++** in practice. A linked list or a pointer-heavy tree approaches the 2× worst case; bulk arrays, strings and numeric data are barely affected. The corollary for anyone porting: **the overhead is a property of your data structures, and pointer-dense structures are worth flattening.**

**3 — Tag memory.** One validity bit per capability-sized, capability-aligned word:

```
1 bit per 128 bits = 1/128 = 0.78125%
16 GiB DRAM -> 128 MiB of tag storage
```

**Compare MTE: 3.125%, or 512 MiB on the same machine — four times more metadata for a probabilistic guarantee.** The reason is instructive. MTE's four bits must act as a **name** for a region, so more bits mean better discrimination and fewer bits mean collisions. CHERI's single bit only has to answer a **yes/no** question — *is this word a valid capability?* — and the bounds and permissions it protects are stored **inside the 128 bits themselves**, where they cost pointer width rather than tag memory. **CHERI pays in pointer size and gets determinism; MTE pays in tag memory and gets probability.**

**4 — CHERIoT revocation bitmap.**

```
1 bit per 8 bytes = 1/64 = 1.5625%
```

| Heap | Bitmap |
|---|---|
| 256 KiB | **4 KiB** |
| 1 MiB | **16 KiB** |
| 4 GiB | **64 MiB** |

**The scalability claim explained.** CHERIoT achieves **use-after-free temporal safety** with a **revocation quarantine** — a **bitmap of freed memory regions** at 1-bit-per-8-bytes granularity — plus a **load filter** that **prevents use of dangling pointers before they are revoked**. The slides note this **works well for microcontrollers but is not scalable to larger memories**, and the arithmetic shows why in two ways.

**Absolute size:** on a microcontroller with a 256 KiB heap the bitmap is **4 KiB** — trivial. On a 4 GiB heap it is **64 MiB**, which is a substantial permanent allocation.

**And the sweep cost, which is the real limit:** revocation requires **scanning** to find and invalidate dangling pointers, so the work grows with the size of the address space being protected. A 4 KiB bitmap can be swept essentially instantly; a 64 MiB one cannot, and doing so repeatedly on a general-purpose system with a large heap and many threads is a different engineering problem entirely. **The technique's viability comes from the smallness of the embedded target, not merely from the bitmap's density** — which is why CHERIoT is presented as a microcontroller platform and heap temporal safety on large CHERI systems remains a distinct problem.

---

### Question 14 — Heartbleed arithmetic

**Q:**

1. An attacker sends a heartbeat with a 1-byte payload and a claimed `payload_length` of 65535. How many unintended bytes does the server copy?
2. How many requests are needed to exfiltrate 1 MiB, and 1 GiB?
3. The patch enforces `1 + 2 + payload + 16 ≤ record length`. Explain each term, and give the maximum legal payload for record lengths 20, 100 and 1024.
4. What record length does a legitimate 1-byte payload require?
5. Why was this so hard to detect, and what would each hardware mechanism from this lecture have done?

**Answer & Explanation:**

**1 — The over-read.** The server allocates a response buffer from the **untrusted claimed length**, copies the real payload, and keeps copying:

```
65535 - 1 = 65534 unintended bytes
```

`65535` is the maximum value of a **16-bit** length field, so a single request bleeds **approximately 64 KB** of the server's process memory — the original 1-byte payload plus 65,534 bytes of whatever followed it.

**2 — Requests to exfiltrate a given volume.**

```
1 MiB: ceil(1,048,576 / 65,534)     =    17 requests
1 GiB: ceil(1,073,741,824 / 65,534) = 16,385 requests
```

**Note the 1 MiB figure is 17, not 16.** `65,534 × 16 = 1,048,544`, which falls **32 bytes short** of a mebibyte — an easy off-by-one to get wrong by estimating `65,534 ≈ 65,536` and dividing. Worth doing exactly, because it is the same class of arithmetic slip that produced the bug.

**The security reading of these numbers.** Seventeen requests is nothing — a few seconds of ordinary-looking traffic. The attacker does not choose *which* memory arrives, but they do not need to: they simply repeat and sift, and **16,385 requests for a gigabyte** is entirely practical. So the leak rate per request is almost irrelevant; what matters is that the operation is **repeatable, cheap and unauthenticated.**

**3 — The patch's bounds check.** The condition is that the claimed payload must fit inside the record actually received:

| Term | Meaning |
|---|---|
| `1` | The heartbeat **message type** byte |
| `2` | The **payload length field** itself |
| `payload` | The **claimed** payload length |
| `16` | **Minimum padding** |

Rearranged, `payload ≤ record_length - 19`:

| Record length | Maximum legal payload |
|---|---|
| 20 | **1** |
| 100 | **81** |
| 1024 | **1005** |

**4 — A legitimate 1-byte payload** needs `1 + 2 + 1 + 16 = 20` bytes of record. So the record length is the ground truth the implementation already had and failed to consult: **the number of bytes that actually arrived**. The bug was not a missing piece of information — it was **trusting the sender's claim over the server's own measurement.**

The correctness condition, stated generally:

```
claimed payload_length <= actual available payload bytes
```

**5 — Why it was hard to detect, and what hardware would do.**

**Detection was exceptionally hard** because the exploit **left no traces in standard system logs** and was **technically a valid Heartbeat message**, merely malformed. There was no crash, no error, no anomaly in the protocol state machine — just a slightly larger response than it should have been. And the impact was severe and broad: OpenSSL was used by around **65% of the internet**, the leak could contain **server private SSL/TLS keys**, credentials, session cookies and tokens, and remediation required patching, **reissuing certificates**, and in some cases **replacing hardware** where certificates were embedded in it.

**Now the hardware question, which is the point of putting Heartbleed in a hardware lecture.** The lecture explicitly links the bug to the fact that **a buffer pointer was just an integer value** — the read walked off the end of an object and the hardware had no basis on which to object. So:

| Mechanism | Effect on this bug |
|---|---|
| **PAC** | **Nothing.** No pointer was corrupted and no control flow was hijacked. PAC answers "has this pointer been modified?", and the answer here is no |
| **BTI** | **Nothing.** No indirect branch is involved |
| **MTE** | **Probably catches it** — the read runs far past the object, so it crosses into granules with different tags. But **probabilistically**: 1-in-16 per granule boundary, and a read confined to the allocation's own tagged slack would be missed |
| **CHERI** | **Deterministically prevents it.** The buffer capability carries **bounds**; the read stops at the upper bound and faults, because `lower ≤ address < upper` is checked by hardware on **every** access |

**This is the level-3 versus level-4 distinction with a real CVE attached**, and it is why the **BLASTPASS** result matters as evidence: CHERI **deterministically mitigated** a heap overflow in `libwebp` with **0% LoC changes** and **no prior awareness of the vulnerability**. The same argument applies to Heartbleed — a bounds-carrying pointer makes the over-read **inexpressible**, not merely unlikely.

**And the modern echo.** The slides pair Heartbleed with the **July 2024 CrowdStrike Falcon outage**: a **missing bounds check while parsing a configuration file update** caused a **panic in the Windows kernel** and **BSOD** on affected machines. Both incidents came from **basic low-level programming or logic errors, not complex or exotic attacks**, and both occurred **in security products intended to protect systems**, making the security product itself a **single point of failure**. Ten years apart, the same root cause — which is the lecture's central question: **why do simple implementation bugs still cause huge failures despite decades of security work?**

---

## Part 3: Code Tracing & Output Prediction

### Question 15 — Pointer arithmetic and the integer/pointer boundary

**Q:** Give the exact output on x86-64. Then say how the program's behaviour would differ on CHERI.

```c
#include <stdio.h>
#include <stdint.h>

struct rec { int id; char tag; };

int main(void) {
    char       *c = (char *)0x4000;
    int        *i = (int  *)0x4000;
    double     *d = (double *)0x4000;
    struct rec *r = (struct rec *)0x4000;

    printf("1: %lu\n", (unsigned long)(uintptr_t)i);
    printf("2: %#lx %#lx %#lx %#lx\n",
           (unsigned long)(uintptr_t)(c + 1),
           (unsigned long)(uintptr_t)(i + 1),
           (unsigned long)(uintptr_t)(d + 1),
           (unsigned long)(uintptr_t)(r + 1));
    printf("3: %#lx %#lx\n",
           (unsigned long)(uintptr_t)(i + 3),
           (unsigned long)(uintptr_t)((char *)i + 3));
    printf("4: %ld %ld\n",
           (long)((int  *)0x4010 - (int  *)0x4000),
           (long)((char *)0x4010 - (char *)0x4000));
    printf("5: %zu %zu\n", sizeof(struct rec), sizeof(r));
    return 0;
}
```

**Answer & Explanation:**

**Line 1.** `0x4000` as a decimal integer: **16384**. The bit pattern is identical whether it is used as a number or an address — **only the instruction decides**.

**Line 2.** Each `+ 1` advances by `sizeof(*p)`. `sizeof(struct rec)` is **8**: `int id` at 0–3, `char tag` at 4, then **3 bytes of tail padding** to satisfy the struct's 4-byte alignment. So `double *` and `struct rec *` advance identically here — by coincidence of size, not by any relationship between the types.

```
c + 1 = 0x4001      i + 1 = 0x4004      d + 1 = 0x4008      r + 1 = 0x4008
```

**Line 3.** The instructive pair:

```
i + 3          = 0x4000 + 3 × 4 = 0x400c
(char *)i + 3  = 0x4000 + 3 × 1 = 0x4003
```

**Same pointer value, same literal `3`, nine bytes apart.** The scale factor is a property of the **static type** alone.

**Line 4.** Subtraction divides by the element size:

```
(int  *)0x4010 - (int  *)0x4000 = 16 / 4 = 4     (elements)
(char *)0x4010 - (char *)0x4000 = 16            (bytes)
```

**Line 5.** `sizeof(struct rec)` = **8** (padded); `sizeof(r)` = **8**, the width of a **pointer** on x86-64 — the same number for entirely unrelated reasons, which is a nice trap.

**Exact output:**

```text
1: 16384
2: 0x4001 0x4004 0x4008 0x4008
3: 0x400c 0x4003
4: 4 16
5: 8 8
```

**What the machine actually executed.** Every value above was computed by the **compiler** multiplying at compile time and emitting **plain integer addition**. At machine level `ptr++` is integer arithmetic on a register, and **the hardware knows nothing of the type, the object's size, or its bounds.** The compiler had all three and had no way to communicate any of them to the CPU.

**How this differs on CHERI — and this is the payoff.** On a conventional machine this program is harmless because it never **dereferences** anything; it only computes addresses. On CHERI the four casts behave differently:

* `(char *)0x4000` and friends are **integer-to-pointer casts**, producing values with **no valid tag**. Under **provenance validity**, a valid pointer must be **derived from another valid pointer through valid transformations**, and an integer literal is derived from nothing.
* The **arithmetic and the printing still work** — you may compute with and inspect an untagged value.
* But **any dereference faults**, because the capability's validity tag is clear. The hardware refuses to load or store through something that is not a capability.

So the program's *output* is essentially unchanged while its *meaning* has shifted fundamentally: on x86-64 these are perfectly good pointers that merely have not been dereferenced yet, and on CHERI they are **permanently unusable for access**. That is what it means for the ISA to carry the metadata — **`sizeof(r)` would report 16 rather than 8**, and the value in the register would be a 129-bit capability rather than a 64-bit integer.

---

### Question 16 — Self-modifying code before pointers

**Q:** A late-1940s machine has no index registers. Memory holds a list at addresses 100, 101, 102, with values 11, 22, 33. The instruction at address 50 is `LOAD 100`. Trace the four-step sequence for three iterations, giving the instruction at address 50 and the value loaded each time.

**Answer & Explanation:**

**Why this is necessary.** An instruction's machine code contained a **fixed physical address**, **unchangeable unless the instruction itself was rewritten**. With no pointer or index-register mechanism, iterating over a list required the program to **modify its own instructions**.

**The four-step sequence per element**, from the slides: **fetch** the target instruction, **calculate** the new address with an `ADD` on its address field, **store** the modified instruction back over the original, then **execute** it.

**Iteration 1.**

```
Mem[50] = LOAD 100
Execute            -> loads Mem[100] = 11
```

**Iteration 2.**

```
Fetch    Mem[50]                -> LOAD 100
Calculate address field 100 + 1 -> 101
Store    Mem[50] = LOAD 101     <- the program has rewritten its own code
Execute                         -> loads Mem[101] = 22
```

**Iteration 3.**

```
Fetch    Mem[50]                -> LOAD 101
Calculate address field 101 + 1 -> 102
Store    Mem[50] = LOAD 102
Execute                         -> loads Mem[102] = 33
```

**The trace as a table:**

| Iteration | `Mem[50]` before | `Mem[50]` after | Value loaded |
|---|---|---|---|
| 1 | `LOAD 100` | `LOAD 100` | **11** |
| 2 | `LOAD 100` | **`LOAD 101`** | **22** |
| 3 | `LOAD 101` | **`LOAD 102`** | **33** |

**The key observation.** **The program is not just updating data — it is rewriting its own code.** Address 50 holds an instruction, and that instruction is the loop variable. There is no separation whatever between the program and its state.

**Three things follow, and they run through the whole chapter.**

**Code memory must be writable.** Marking code non-writable is impossible while this is the normal way to loop, so **W⊕X and Execute Never are unthinkable** on such a machine. The von Neumann property that "any data can be executed as code" is not an accident here — it is a **required feature**.

**The B-line register (1949) removed the need.** With `EA = A_base + B` the instruction stays `LOAD 100` forever and the hardware adds the offset at execution time — **the original instruction in memory is never touched**, and address calculation moves **inside the CPU**. Question 9 quantifies the step saving; the architectural gain is that code and iteration state finally became separate things.

**The practice outlived the reason by decades.** COBOL's **`ALTER`** exposed this trick to a high-level language because loops remained expensive — **register scarcity** (as few as **three** index registers) and **expensive branching** (increment, compare, conditional branch). It **was not obsolete until COBOL-85**, long after **more registers, branch prediction and pipelining** had removed the bottleneck, and by then self-modifying code was a **major performance penalty** because it **forces the CPU to discard pre-fetched and pipelined instructions** — a modern CPU must assume its instruction stream is stable, and this code violates that assumption on every iteration.

> **The lesson, and the analogy the lecture is drawing: software workarounds for hardware limitations become long-term technical debt that persists for decades after the limitation disappears.** The integer pointer is the same story — adopted for simplicity and **backward compatibility with pre-pointer code**, and still generating vulnerabilities seventy-five years later.

---

### Question 17 — Tracing MTE tag checks

**Q:** An MTE system has 16-byte granules and 4-bit tags. Two allocations are made:

* `a = malloc(48)` at `0x1000`, assigned tag **`0x3`**
* `b = malloc(32)` at `0x1030`, assigned tag **`0x9`**

For each access below, state whether hardware faults, and why.

| # | Access |
|---|---|
| 1 | `a[0] = 1` |
| 2 | `a[47] = 1` |
| 3 | `a[48] = 1` |
| 4 | `b[0] = 1` through pointer `b` |
| 5 | `free(a)`; then `a[0] = 1` through the old pointer, where the region was re-tagged to `0xC` |
| 6 | `free(a)`; `c = malloc(48)` returns `0x1000` with tag `0x3` again; then `a[0] = 1` through the old pointer |
| 7 | `s = malloc(4)` at `0x1080`, tag `0x5`; then `s[8] = 1` |
| 8 | Same `s`; then `s[16] = 1`, where `0x1090` has tag `0x7` |

**Answer & Explanation:**

**The rule applied throughout:** `access permitted ⇔ tag(pointer) == tag(memory granule)`. Allocation `a` covers `0x1000`–`0x102F` — **3 granules**, all tagged `0x3`. Allocation `b` covers `0x1030`–`0x104F` — **2 granules**, all tagged `0x9`.

| # | Address | Pointer tag | Memory tag | Result | Why |
|---|---|---|---|---|---|
| 1 | `0x1000` | `0x3` | `0x3` | **OK** | In bounds, tags match |
| 2 | `0x102F` | `0x3` | `0x3` | **OK** | Last byte of the last granule of `a` |
| 3 | `0x1030` | `0x3` | `0x9` | **FAULT** | **Spatial violation caught** — the overflow crossed into `b`'s granule |
| 4 | `0x1030` | `0x9` | `0x9` | **OK** | Same address as #3, but reached through the **correctly tagged** pointer |
| 5 | `0x1000` | `0x3` | `0xC` | **FAULT** | **Temporal violation caught** — freeing **re-tagged** the region, so the dangling pointer's tag is stale |
| 6 | `0x1000` | `0x3` | `0x3` | **NO FAULT** | **Use-after-free undetected** — the reallocation drew the same tag by chance, probability **1/16** |
| 7 | `0x1088` | `0x5` | `0x5` | **NO FAULT** | **Intra-granule overflow undetected** — `malloc(4)` occupies the whole granule `0x1080`–`0x108F`, so byte 8 carries the **same** tag |
| 8 | `0x1090` | `0x5` | `0x7` | **FAULT** | The write finally left the granule and met a different tag |

**The four lessons in this trace.**

**Rows 3 and 4 together show what MTE actually enforces.** The *same address* is a fault through one pointer and legal through another. MTE does not protect addresses — it checks **whether this pointer is the one entitled to this memory**, which is why the lecture phrases its question as *"does this pointer have valid permission to access this specific memory region right now?"*

**Row 5 is the temporal mechanism, and it depends entirely on re-tagging.** The dangling pointer still holds a perfectly valid **address**; what makes the access detectable is that `free` **changed the memory's tag**. If an allocator omitted re-tagging on free, MTE would provide **no** use-after-free protection at all.

**Row 6 is the 1-in-16 limitation made concrete.** Nothing is wrong with the hardware — the tags genuinely match. The attacker's use-after-free simply landed on a reallocation that drew the same random tag. And note this is not a per-access roll: once the collision has happened, **every** access through the stale pointer succeeds for the lifetime of the new allocation.

**Row 7 is the granularity limitation, and it is the one that surprises people.** `malloc(4)` returns a 4-byte object but **tags a whole 16-byte granule**, so bytes 4–15 are indistinguishable from the allocation itself. An overflow of up to 12 bytes is **invisible by construction, not by chance** — no probability is involved, and repetition will never catch it. Question 25 is this bug, and only **byte-granular** bounds (CHERI) detect it.

**A note on asynchronous mode.** Every "FAULT" above assumes **synchronous** reporting. In **asynchronous** mode faults are **detected but reported later**, with **low overhead** but **imprecise reporting** — so the faulting instruction is not identified and **the attacker gets a larger window to operate before termination**. The trace's outcomes are the same; their timing and diagnostic value are not.

---

### Question 18 — Tracing PAC signing and authentication

**Q:** A function signs its return address using the **stack pointer as context**. For each scenario, state whether the `AUT` check succeeds and what happens.

| # | Scenario |
|---|---|
| 1 | Signed at `SP = 0x7FF0`; returns normally with `SP = 0x7FF0` |
| 2 | Buffer overflow overwrites the saved return address with the raw address `0x401234` |
| 3 | Attacker copies a validly signed return address from another frame, signed at `SP = 0x7FD0`; authentication occurs at `SP = 0x7FF0` |
| 4 | Attacker copies a validly signed pointer that was signed **with the same key and the same context** `SP = 0x7FF0`, but points to a different function |
| 5 | Attacker has leaked the 128-bit signing key and forges a PAC for `0x401234` |

**Answer & Explanation:**

**The mechanism.** Signing computes `PAC = QARMA(pointer, context_64, key_128)` and inserts it into the pointer's **unused high-order bits**. Authentication **recomputes** the PAC from the same three inputs and **compares**:

```
succeeds  <=>  PAC_stored == QARMA(pointer, context_64, key_128)
```

Match → PAC **stripped**, instruction proceeds. Mismatch → **fault exception**, program **terminates**.

| # | Result | Why |
|---|---|---|
| 1 | **Succeeds** | All three inputs identical to signing time. PAC stripped, `RET` proceeds to the genuine return address |
| 2 | **FAULT** | `0x401234` carries **no PAC** in its high bits. The recomputed PAC cannot match whatever those bits happen to hold. **The attack is defeated** |
| 3 | **FAULT** | The pointer and key match, but the **context differs** — signed with `0x7FD0`, authenticated with `0x7FF0`, so QARMA produces a different PAC. **The context input is what defeats cross-frame copying** |
| 4 | **SUCCEEDS — the attack works** | Pointer, context and key all match what the signature attests. This is the **pointer substitution / PAC gadget** limitation |
| 5 | **SUCCEEDS — the attack works** | With the key, the attacker computes a valid PAC for any pointer and context. **Key leakage defeats the mechanism entirely** |

**Rows 1–3 are PAC working, and row 3 is the part worth understanding.** Including the **stack pointer as the 64-bit context** means a signature is bound to *where* the pointer was signed, so the obvious attack — scavenging a validly signed return address from elsewhere on the stack and pasting it in — **fails**. Without the context input, PAC would be little more than a keyed checksum on the pointer value and row 3 would succeed.

**Row 4 is the limitation stated precisely.** PAC prevents **modifying** a protected pointer's value; it does **not** prevent **replacing one protected pointer with another validly signed pointer**. The signature attests:

> *"This pointer value was signed with this key and this context."*

It does **not** attest:

> *"This is the pointer that belongs in this location."*

So if the attacker can find a **PAC gadget** — a validly signed pointer, with a matching context, that points somewhere useful — the attack succeeds with **zero** guesses, and **no amount of PAC length helps**. Question 12 shows that blind forgery needs 32,768 expected attempts against a target that dies on the first miss; substitution needs **one**.

**Row 5 is the single-secret dependency.** PAC's security rests **entirely on the secrecy of the 128-bit keys** in protected system registers. This is structurally the same weakness as a **stack canary** (one value, leaked once, forged thereafter) or **KASLR** (one offset, leaked once, computed thereafter) — a probabilistic or cryptographic defence with **one secret** and no recovery if it leaks.

**Where this leaves PAC.** It is a genuinely strong **backward-edge** mitigation against the ordinary case — row 2, plain return-address corruption, which is the classic stack smash — and it composes with **BTI** for the forward edge, together removing **97%** of ROP and JOP gadgets in GLIBC. But rows 4 and 5 are why it is a **level-3** defence in Question 3's model: the guarantee is *"a modified pointer will be caught"*, not *"control flow follows the intended graph."* The architectural answer is CHERI, where **return addresses and function pointers are capabilities** with **bounds and permissions**, so a substituted pointer is not merely detected as unexpected — an unauthorised target is **not expressible**.

---

### Question 19 — Tracing CHERI capability derivation

**Q:** A thread holds capability `c0`: base `0x1000`, length `0x100`, permissions **Load | Store**, validity tag **set**. For each operation, state whether it succeeds, and if not, which CHERI property prevents it.

| # | Operation |
|---|---|
| 1 | Derive `c1` from `c0`, narrowing bounds to `[0x1040, 0x1050)` |
| 2 | Load through `c1` at `0x1048` |
| 3 | Load through `c1` at `0x1060` |
| 4 | Load through `c0` at `0x1060` |
| 5 | Derive `c2` from `c1`, widening bounds back to `[0x1000, 0x1100)` |
| 6 | Derive `c3` from `c1`, removing the Store permission |
| 7 | Derive `c4` from `c3`, adding the Store permission back |
| 8 | Store the integer `0x1040` over a capability held in memory, then load it and dereference |
| 9 | Place the integer `0x1040` in a register and dereference it |
| 10 | Load through `c1` at `0x1050` |

**Answer & Explanation:**

| # | Result | Property involved |
|---|---|---|
| 1 | **Succeeds** | Narrowing is a **monotonic decrease** in authority — always permitted |
| 2 | **Succeeds** | `0x1040 ≤ 0x1048 < 0x1050` — within `c1`'s bounds |
| 3 | **FAULT** | **Bounds.** `0x1060` is outside `[0x1040, 0x1050)` |
| 4 | **Succeeds** | `0x1000 ≤ 0x1060 < 0x1100` — inside `c0`'s bounds. **`c0` was never weakened by deriving `c1`** |
| 5 | **FAILS** | **Monotonicity** — prevents broadening bounds. A derived capability **may become less powerful, never more** |
| 6 | **Succeeds** | Removing a permission is monotonic |
| 7 | **FAILS** | **Monotonicity** again — permissions cannot be added back once dropped |
| 8 | **FAULT on dereference** | **Tags.** Overwriting a capability with ordinary non-capability data **clears the validity tag**; the loaded value is an untagged integer |
| 9 | **FAULT** | **Provenance validity.** A valid pointer must be **derived from another valid pointer**; an integer is derived from nothing and has no tag |
| 10 | **FAULT** | **Bounds.** The check is `lower ≤ address < upper`, so `0x1050` — the exclusive upper bound — is **one past the end** |

**The four properties this trace exercises, and why each matters.**

**Rows 3 and 4 together show that bounds are per-capability, not per-address.** `0x1060` is legal through `c0` and illegal through `c1`. Authority travels **with the capability**, so handing a narrowed capability to a callee genuinely limits it — which is what makes the "software TCBs restrict bounds and permissions as code runs" model work: `mmap`, the runtime linker, and the heap and stack allocators each hand out **narrower** capabilities than they hold, and the narrowing is irreversible.

**Rows 5 and 7 are monotonicity, and it is the property that makes delegation safe.** Without it, a compartment given a narrow capability could simply widen it, and every bound would be advisory. With it, **authority can only flow downhill**, so the reachable set of Question 8 is genuinely a bound rather than a hope. Note that monotonicity applies to **permissions as well as bounds** — row 7 is the case people forget.

**Row 8 is the elegant answer to von Neumann's "any data can be executed as code."** Code and data still share one memory, but a **1-bit tag** distinguishes a capability from an integer **at every capability-aligned location**, and **any ordinary data write over a capability destroys its validity**. So an attacker who overflows a buffer into a stored pointer **can still overwrite it** — and what they produce is **unusable**. The attack is not detected after the fact; the corrupted value simply has no authority.

**Row 9 is provenance validity, and it is why forging is impossible rather than merely hard.** There is no instruction sequence that turns an integer into a valid capability. Compare PAC, where forging requires guessing a signature — 32,768 expected attempts, or **zero** if you find a PAC gadget or leak the key (Question 18). Here the operation is not improbable, it is **not available**.

**Row 10 is the off-by-one, and it is worth being explicit about.** The bounds condition is

```
access allowed  <=>  lower bound <= address < upper bound
```

so the upper bound is **exclusive**. An access at exactly `0x1050` is the classic one-past-the-end read that a hand-written `<=` check would permit — and CHERI faults on it **deterministically**, at **byte granularity**. This is precisely what MTE cannot do: Question 17 row 7 showed a 12-byte overflow surviving because it stayed inside a 16-byte granule. CHERI has no granule.

**The summary the trace supports.** These five primitives — **provenance validity, bounds, monotonicity, permissions, tags** — are what let CHERI provide **strong spatial memory protection, strong temporal memory protection, and scalable software compartmentalisation**. Every row above is a hardware check on every use, which is what "level 4, deterministic architectural blocking" means in Question 3's model.

---

## Part 4: Bug Identification & Secure Refactoring

### Question 20 — Heartbleed

**Q:** Identify the vulnerability in this simplified heartbeat handler, give the fix, and state what each hardware mechanism from this lecture would have done about it.

```c
#include <string.h>
#include <stdint.h>
#include <stdlib.h>

#define TLS1_HB_REQUEST  1
#define TLS1_HB_RESPONSE 2

/* `record` is the TLS record actually received; `record_len` its true length. */
int process_heartbeat(const uint8_t *record, unsigned record_len,
                      uint8_t **response, unsigned *response_len)
{
    uint16_t payload_length;
    uint8_t *buf;

    if (record[0] != TLS1_HB_REQUEST)
        return 0;

    /* 2-byte big-endian length, taken straight from the request */
    payload_length = (record[1] << 8) | record[2];

    buf = malloc(1 + 2 + payload_length + 16);
    if (buf == NULL)
        return -1;

    buf[0] = TLS1_HB_RESPONSE;
    buf[1] = record[1];
    buf[2] = record[2];
    memcpy(buf + 3, record + 3, payload_length);   /* <-- the bug */

    *response     = buf;
    *response_len = 1 + 2 + payload_length + 16;
    return 1;
}
```

**Answer & Explanation:**

**The vulnerability.** `payload_length` is **taken from the attacker's request and never validated against `record_len`**, the number of bytes actually received. The `memcpy` then copies that many bytes **from the received record onward**, running off the end of the real payload and into **adjacent process memory**, which is subsequently sent back to the peer. This is a **buffer over-read** — a **spatial** memory-safety violation in the **read** direction, and it is **CVE-2014-0160, Heartbleed**.

**Note what is *not* wrong**, because misidentifying it is the common error. The `malloc` is correctly sized **for the claimed length**, so there is **no buffer overflow of `buf`** — the write side is fine. And this is **not a flaw in the TLS protocol**; RFC 6520's heartbeat design is sound. It is **a critical implementation error in OpenSSL**: the code **trusted the sender's claim over the server's own measurement** of how many bytes arrived.

**The exploit, with numbers.** The attacker sends a 1-byte payload while claiming `payload_length = 65535`, the maximum for a 16-bit field. The server copies the 1 real byte and then **65,534 unintended bytes** of its own memory, and returns all ~64 KB. Seventeen such requests exfiltrate a mebibyte. Because OpenSSL was used by roughly **65% of the internet**, and the leaked memory could contain **server private keys**, credentials, session cookies and tokens, remediation required patching, **reissuing certificates**, and sometimes **replacing hardware** with embedded certificates.

**Why it went undetected.** The exploit **left no traces in standard system logs** and was **technically a valid Heartbeat message**, merely malformed. No crash, no protocol error — just a response larger than it should have been.

**The fix — validate the claim against what actually arrived:**

```c
int process_heartbeat(const uint8_t *record, unsigned record_len,
                      uint8_t **response, unsigned *response_len)
{
    uint16_t payload_length;
    unsigned total;
    uint8_t *buf;

    /* (1) enough bytes for type + length field + minimum padding? */
    if (record_len < 1 + 2 + 16)
        return 0;                         /* silently discard */

    if (record[0] != TLS1_HB_REQUEST)
        return 0;

    payload_length = (record[1] << 8) | record[2];

    /* (2) THE bounds check: the claimed payload must fit in the record. */
    if (1 + 2 + (unsigned)payload_length + 16 > record_len)
        return 0;                         /* silently discard */

    total = 1 + 2 + (unsigned)payload_length + 16;
    buf = malloc(total);
    if (buf == NULL)
        return -1;

    buf[0] = TLS1_HB_RESPONSE;
    buf[1] = record[1];
    buf[2] = record[2];
    memcpy(buf + 3, record + 3, payload_length);   /* now provably in range */

    *response     = buf;
    *response_len = total;
    return 1;
}
```

This is the real patch's condition, shipped in **OpenSSL 1.0.1g**:

```
1 + 2 + payload + 16 <= record_length
```

with `1` the **message type** byte, `2` the **payload length field**, `payload` the **claimed** length, and `16` the **minimum padding**. Equivalently `payload ≤ record_len - 19`. Note the first check is separate and necessary: without it, `record_len - 19` would underflow for a short record.

**Two details that make this a complete answer.** The `(unsigned)` cast prevents the sum being computed in a narrower type — a 16-bit `payload_length` added to small constants must not be allowed to wrap. And the correct response to a malformed request is to **silently discard** it, which is what the patch does: replying with an error would give an attacker an oracle.

**What each hardware mechanism would have done** — the reason Heartbleed appears in a hardware lecture is that the lecture links it directly to **a buffer pointer being just an integer value**:

| Mechanism | Effect |
|---|---|
| **PAC** | **Nothing.** No pointer was corrupted and no control flow hijacked. PAC answers *"has this pointer been modified?"* — here, no |
| **BTI** | **Nothing.** No indirect branch involved |
| **MTE** | **Probably catches it.** A 64 KB over-read crosses many granule boundaries, so a tag mismatch is near-certain — but **probabilistically** (1/16 per boundary), and a read confined to the allocation's own tagged slack would be missed |
| **CHERI** | **Deterministically prevents it.** The source capability carries **bounds**; the copy faults at the upper bound, because `lower ≤ address < upper` is checked on **every** access, at **byte** granularity |

**The generalisable rule.** A length that crosses a trust boundary must be **validated against the size of the object it will be used to access, before that access** — and the ground truth is always **what you actually received**, never what the sender claims. The same class of bug produced the **July 2024 CrowdStrike outage**: a **missing bounds check parsing a configuration update** panicked the Windows kernel into **BSOD**. Both were **basic low-level errors, not exotic attacks**, and both were **in security products**, making the protection itself the single point of failure.

---

### Question 21 — Return-address overwrite, and what four mechanisms do about it

**Q:** Identify the vulnerability, give a corrected version, and then compare precisely what PAC, BTI, MTE and CHERI each do about this specific bug.

```c
#include <stdio.h>
#include <string.h>

void log_request(const char *user_input)
{
    char line[64];

    strcpy(line, "request from: ");
    strcat(line, user_input);          /* <-- unbounded */

    printf("%s\n", line);
}
```

**Answer & Explanation:**

**The vulnerability.** `strcat` appends until it finds a terminator **in the source**, with no regard for the destination's size. `line` is 64 bytes and already holds 14, so any `user_input` longer than **49** characters overflows it. Because a stack buffer is written **upward** toward higher addresses while the stack **grows down**, the overflow runs through the rest of the frame and into the **saved return address**. A **spatial** violation in the **write** direction, and the classic stack smash: crafting the payload so the return address becomes an attacker-chosen value hands over control at the `ret`.

**The fix — bound every copy by the destination's size:**

```c
void log_request(const char *user_input)
{
    char line[64];
    int  n;

    n = snprintf(line, sizeof(line), "request from: %s", user_input);
    if (n < 0 || (size_t)n >= sizeof(line))
        return;                        /* truncated — handle, don't ignore */

    printf("%s\n", line);
}
```

`snprintf` always terminates within the given size and returns the length it *would* have written, which is how truncation is detected. Note that simply switching to `strncat` would be the **half-fix**: bounded is not the same as safe, since the bound must be derived from the **destination's remaining space**, not from the source's length.

**Now the comparison, which is the substance of the question:**

| Mechanism | What it does about *this* bug | Deterministic? |
|---|---|---|
| **PAC** | **Prevents exploitation, not the overflow.** The return address was **signed** before being stored; the attacker's raw value carries **no valid PAC**, so the `AUT` check before `ret` fails and the program **faults** instead of jumping. The buffer is still overflowed and neighbouring locals are still corrupted | **No** — see below |
| **BTI** | **Nothing for this bug.** BTI restricts **forward-edge** indirect branch targets (`BR`, `BLR`). A `RET` is the **backward edge**, which BTI explicitly does not protect. This is why **BTI must be combined with PAC** to cover both ROP and JOP |
| **MTE** | **Probably detects the overflow itself**, earlier than PAC does. The write runs past `line` into adjacent stack granules with different tags → mismatch → fault. But **probabilistically** (1/16), and an overflow staying inside `line`'s own 16-byte granule slack is **invisible** | **No** — 1/16 |
| **CHERI** | **Deterministically prevents the overflow.** The capability for `line` carries **bounds**; the write faults at byte **64**, before any neighbouring data is touched. Additionally the **return address is itself a capability**, so even a hypothetical corruption yields an **untagged, unusable** value | **Yes** |

**Three points that distinguish a strong answer.**

**PAC and MTE act at different moments, and that matters.** MTE (or CHERI) catches the **overflow**, at the moment of the bad write. PAC catches only the **consequence**, at the moment of return — so with PAC alone the corruption has already happened: other locals, saved registers and any spilled pointers in the frame are damaged, and only the *control-flow* consequence is blocked. If the function's logic depends on a local the overflow clobbered, PAC does not save you from a data-only attack.

**PAC's protection here is strong but not deterministic**, for the reasons in Question 18. Blind forgery needs ~32,768 attempts against a program that dies on the first miss — effectively secure — but **pointer substitution** (a validly signed pointer with a matching context, a **PAC gadget**) needs **zero** guesses, and **key leakage** defeats it outright. And enabling MTE alongside it **shortens the PAC from 15 bits to 11**, multiplying forgery probability by 16 (Question 12).

**The combination is what is actually deployed, and its measured value is real but bounded.** PAC (backward edge) plus BTI (forward edge) removes **97% of ROP and JOP gadgets in GLIBC** — a large reduction that forces the attacker onto legitimate entry points. But 3% of a large gadget set is still thousands of gadgets, and **BTI's coarse granularity** means **any** BTI instruction in a guarded page is a valid target for **any** indirect branch. So the honest summary is Question 3's model: **PAC, BTI and MTE are level-3 defences that make this exploit much harder; CHERI is the level-4 answer that makes the out-of-bounds write itself impossible.**

---

### Question 22 — Use-after-free through a function pointer

**Q:** Identify the vulnerability and explain why it is exploitable rather than merely a crash risk. Give a corrected version, then explain how MTE and CHERIoT each address this class, and why they differ in strength.

```c
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

struct handler {
    int   id;
    void (*callback)(void);
};

static void benign(void) { puts("benign"); }

void run(const char *input)
{
    struct handler *h = malloc(sizeof(*h));
    char *tmp;

    h->id       = 1;
    h->callback = benign;
    h->callback();

    free(h);

    tmp = malloc(16);
    strcpy(tmp, input);        /* attacker-controlled, unbounded */

    h->callback();             /* <-- use-after-free */

    free(tmp);
}
```

**Answer & Explanation:**

**The vulnerability.** After `free(h)`, `h` is a **dangling pointer**: the memory it names is no longer valid, and dereferencing it — even to read — is a **temporal** memory-safety violation. `h->callback()` reads a **function pointer out of freed memory and calls it**.

**Why it is exploitable, not merely a crash risk.** The exploitability comes from **allocator behaviour**, not from the dangling pointer alone:

1. `malloc` **reuses freed memory** wherever it can, so the 16-byte request immediately after `free(h)` is very likely satisfied from **the very chunk the struct occupied**.
2. `strcpy` then writes **attacker-controlled bytes** over that chunk — including over the bytes that used to hold `callback`. It is also unbounded, so it can write past 16 bytes regardless.
3. `h->callback()` calls through the stale pointer, transferring control to **an address the attacker chose**.

So this is a **control-flow hijack** with **no stack involvement and no injected code** — unaffected by stack canaries, and unaffected by Execute Never since the target is existing executable code. It also has a second defect worth naming: `malloc`'s return value is **never checked**, so an allocation failure dereferences `NULL`.

**The fix:**

```c
void run(const char *input, size_t n)
{
    struct handler *h = calloc(1, sizeof(*h));   /* zeroed, and checked */
    char *tmp;

    if (h == NULL)
        return;

    h->id       = 1;
    h->callback = benign;
    h->callback();

    free(h);
    h = NULL;                    /* (1) poison the stale pointer */

    tmp = malloc(n + 1);
    if (tmp == NULL)
        return;

    memcpy(tmp, input, n);       /* (2) bounded by a known length */
    tmp[n] = '\0';

    /* h is NULL: any residual use faults loudly instead of calling
       into memory an attacker controls. */

    free(tmp);
}
```

**Why `h = NULL` is the important line.** "Don't use after free" is only half the guidance. Setting the pointer to `NULL` **converts a silent, exploitable use-after-free into a deterministic crash at the point of the bug** — because `NULL` is address 0 and most operating systems leave the first page unmapped. It is a software approximation of what the hardware mechanisms below do properly.

**How MTE addresses this class.** MTE gives **temporal** coverage because **memory is re-tagged when freed**:

```
dangling pointer tag = A,  re-tagged (or reallocated) memory tag = C,  A != C -> fault
```

So the `h->callback()` read faults — **usually**. Three limitations bite here, and they are exactly Question 17's rows 6 and 7:

* **1-in-16.** If the reallocation happens to draw **the same tag**, the access is undetected — and once that collision occurs it holds for the **whole lifetime** of the new allocation, so repetition does not help the defender.
* **Granularity.** `sizeof(struct handler)` is 16 bytes, exactly one granule, and `malloc(16)` reuses it — so the attacker's `strcpy` writes within a **single** granule and never crosses a tag boundary.
* **Asynchronous mode** would detect the fault but report it **later**, giving the attacker a larger window.

So MTE makes this attack unreliable rather than impossible: **level 3**.

**How CHERIoT addresses it.** CHERIoT provides **use-after-free temporal memory safety** through two co-designed pieces:

* a **revocation quarantine** — a **bitmap of freed memory regions at 1 bit per 8 bytes** — recording precisely which memory has been freed and is awaiting reuse; and
* a **load filter** that **prevents use of dangling pointers before they are revoked**.

The difference in kind is that this does not rely on a **tag collision not happening**. Freed memory is **quarantined** and cannot be handed out until any capabilities referring to it have been **revoked**, and the load filter blocks the stale capability in the interim. The dangling pointer is not *probably* caught — it is **architecturally unusable**. Combined with CHERI's ordinary properties, the `strcpy` is also **bounds-checked** at byte granularity, so it cannot exceed 16 bytes in the first place, and the stored `callback` is a **capability** whose validity tag is **cleared** by any ordinary data write over it (Question 19 row 8).

**The honest limitation to state.** The slides are explicit that this revocation scheme **works well for microcontrollers but is not scalable to larger memories**. Question 13's arithmetic shows why: 1.5625% overhead is **4 KiB** on a 256 KiB heap and **64 MiB** on a 4 GiB heap, and the periodic **sweep** cost grows with the space being protected. So **heap temporal safety on large CHERI systems remains a distinct problem** — spatial safety is deterministic and general, while temporal safety currently has a deterministic answer that is practical mainly at embedded scale.

---

### Question 23 — Type confusion, and the limits of bounds checking

**Q:** Identify the vulnerability, give a corrected version, and explain carefully which hardware mechanisms do and do **not** address this bug. Be precise about CHERI's coverage.

```c
#include <stdio.h>
#include <string.h>

struct user  { int id; char name[16]; int is_admin; };
struct admin { int id; char name[16]; int privileges; };

#define ROLE_USER  1
#define ROLE_ADMIN 2

/* A generic dispatcher: `obj` is whichever struct the caller had. */
void show(void *obj, int role)
{
    if (role == ROLE_ADMIN) {
        struct admin *a = (struct admin *)obj;   /* <-- unchecked cast */
        printf("admin %d privileges=0x%x\n", a->id, a->privileges);
    } else {
        struct user *u = (struct user *)obj;
        printf("user %d admin=%d\n", u->id, u->is_admin);
    }
}
```

**Answer & Explanation:**

**The vulnerability.** `show` takes a `void *` and a **separately supplied** `role`, then casts based on the role **without any check that the object really is of that type**. If an attacker can cause a `struct user` to be passed with `role == ROLE_ADMIN`, the function reads the object **through the wrong type of pointer**. This is **type confusion**, and its cause in Question 2's table is that **the CPU has no type information** — it cannot verify that the data at a location matches the type the program expects.

**What goes wrong concretely.** Both structures have **identical layout and identical size**: `int id` at offset 0, `char name[16]` at 4, `int` at 20, total 24 bytes. So the confused read **does not go out of bounds at all** — it reads offset 20 and *interprets `is_admin` as `privileges`*. The slides' framing is exactly this: **read a `User` object through an `Admin` pointer**, misinterpreting the memory layout, with consequences of **bypassing security checks and accessing private data fields**. And the write direction is worse: a `struct admin *` assignment to `a->privileges` would set a user's `is_admin` field to an attacker-chosen bit pattern.

**The fix — make the type self-describing and check it, rather than trusting a parallel parameter:**

```c
struct header { int role; int id; };                 /* discriminant FIRST */

struct user  { struct header h; char name[16]; int is_admin;   };
struct admin { struct header h; char name[16]; int privileges; };

void show(struct header *h)
{
    switch (h->role) {                               /* read the tag FROM the object */
    case ROLE_ADMIN: {
        struct admin *a = (struct admin *)h;
        printf("admin %d privileges=0x%x\n", a->h.id, a->privileges);
        break;
    }
    case ROLE_USER: {
        struct user *u = (struct user *)h;
        printf("user %d admin=%d\n", u->h.id, u->is_admin);
        break;
    }
    default:
        fprintf(stderr, "unknown role\n");
        break;
    }
}
```

**The principle:** the discriminant must live **inside the object**, so the type cannot disagree with the pointer. Passing type information **alongside** a `void *` creates two sources of truth that an attacker only has to desynchronise. In C++ this is what a virtual destructor and `dynamic_cast` provide; in C it is a **tagged union** with the tag at a common offset.

**Now the hardware comparison — and this question exists because the honest answer is uncomfortable:**

| Mechanism | Effect on this bug |
|---|---|
| **PAC** | **Nothing.** No pointer was modified; the correct pointer was used with the wrong interpretation |
| **BTI** | **Nothing.** No indirect branch |
| **MTE** | **Nothing.** The access is **within** the allocation, so `tag(pointer) == tag(memory)` holds. MTE answers *"may this pointer access this region?"* — and it may |
| **CHERI** | **Does not fully prevent it.** See below |

**Why CHERI does not fully fix type confusion — the important nuance.** CHERI capabilities carry **bounds** and **permissions**, not **types**. Here:

* the access is **inside the object's bounds**, so **bounds checking does not trigger**;
* the operation is an ordinary **load** through a capability that legitimately holds **Load** permission, so **permissions do not trigger**;
* **provenance validity** is satisfied — the capability was properly derived.

So a same-size, same-layout confusion of the kind above **survives on CHERI**. This is worth stating plainly because it is easy to over-claim CHERI as "solving memory safety" and be caught out.

**What CHERI *does* contribute, which is not nothing:**

* If the two types **differ in size**, the capability's bounds are set from the **actual allocation**, so reading `admin` fields beyond a smaller `user` object **faults deterministically** — a large fraction of real-world type confusion involves reading past a smaller object, and that is covered.
* **Function pointers and vtable entries are capabilities**, so the classic escalation of type confusion — confusing an object to obtain a bogus vtable and hijack control flow — is blocked by **bounds and permissions on the code capability**, not merely by a signature.
* **Permissions** allow **W⊕X for pointers**, so a data capability cannot be used to execute.

**The lesson for the exam.** Question 2's table lists **three** missing metadata items — bounds, type, lifetime — and the hardware mechanisms in this lecture address them **unevenly**: **bounds** are handled deterministically by CHERI and probabilistically by MTE; **lifetime** is handled probabilistically by MTE and deterministically by CHERIoT's revocation at embedded scale; **type** is addressed only **indirectly**, via size differences. Type safety remains largely a **language and compiler** responsibility — which is exactly why the slides note that **memory safety is not enough to address the de facto threat model of quite a few libraries**, and why the corpus mitigation rate is **73.8%** rather than approaching 100%.

---

### Question 24 — A hardening configuration built on a misunderstanding

**Q:** A team enables hardware mitigations and records this justification. Identify every error, and give the correct configuration and claim.

```
Build and platform configuration:
  - BTI enabled on all pages (compiler inserts BTI landing pads)
  - PAC disabled ("BTI already gives us control-flow integrity")
  - MTE enabled in ASYNCHRONOUS mode
  - MTE tag size: 4 bits (hardware default)

Design document claims:
  1. "BTI gives us full control-flow integrity, so ROP and JOP are both
      blocked. PAC would be redundant overhead."
  2. "MTE gives us deterministic memory safety: every out-of-bounds
      access is caught by the tag check."
  3. "Async mode is a pure performance win with no security cost."
  4. "With BTI + MTE we are at level 4 of the memory safety model, so we
      do not need to prioritise the remaining C bugs."
```

**Answer & Explanation:**

**Error 1 — BTI does not protect the backward edge, so ROP is untouched.** BTI is a **forward-edge** mechanism: it restricts the targets of **indirect branches** (`BR`, `BLR`) to instructions marked as legitimate landing pads. It **does not protect function `RET` instructions**. **ROP gadgets end in `RET`**, so a ROP chain works exactly as before. The slides state the requirement directly: **BTI must be combined with PAC or another mechanism to protect against both ROP and JOP.**

Disabling PAC therefore removes **all** backward-edge protection — the single most commonly exploited edge, since a stack buffer overflow reaching a saved return address is the classic memory-safety exploit (Question 21). The claim has it precisely backwards: PAC is not redundant given BTI; **the two cover disjoint halves of the problem.**

**Error 2 — BTI is coarse-grained even on the forward edge.** By default **any BTI instruction is a valid target for any indirect branch within a guarded page**, so an attacker can still **redirect execution to a different valid BTI target**. That is harder than classic JOP but is not integrity of the control-flow graph. "Full control-flow integrity" is not a claim BTI supports.

**Error 3 — MTE is explicitly probabilistic, not deterministic.** With **4-bit tags** there are only **16** possible values, so there is a **1-in-16 (6.25%)** chance an illegal access is **not** detected because the tags coincide. The lecture's own classification puts MTE at **level 3 — statistical hardware blocking** — precisely for this reason. Two further gaps make "every out-of-bounds access is caught" false even before the probability argument:

* **Granularity.** Protection is at **16-byte granularity**, so an overflow **within the same granule** produces no mismatch. A 4-byte buffer written 8 bytes past its end is undetected **by construction** — no probability involved (Question 17 row 7).
* **Allocation-time aliasing.** If two adjacent allocations receive the **same random tag**, an overflow between them is undetected for the **entire lifetime** of both, deterministically.

**Error 4 — asynchronous mode is not free.** Faults are **detected but reported later**. The benefit is **low overhead**; the costs are that **fault reporting is imprecise** — you do not learn which instruction faulted, which badly damages both debugging and incident response — and that **the attacker gets a larger window to operate before termination**. For a mitigation whose value is stopping an exploit *in progress*, a delayed stop is a materially weaker guarantee.

**Error 5 — the level-4 claim is wrong, and it is the most consequential error.** Level 4 requires hardware that **deterministically, architecturally blocks** entry into an undefined execution state. BTI is coarse-grained and forward-edge-only; MTE is probabilistic, granular, and here running in imprecise mode. This configuration is **level 3** at best. Level 4 in this lecture is exemplified by **CHERI**, whose evidence is the **BLASTPASS** result: **deterministic** mitigation of a real heap overflow with **0% LoC change** and **no prior awareness of the vulnerability**.

Treating a level-3 deployment as level 4 and therefore **deprioritising the remaining C bugs** inverts the actual relationship. Levels 1 and 2 — **testing and bug fixing**, **memory-safe languages and verification** — are not superseded by statistical hardware; they are what reduces the number of occasions on which the 1-in-16 die is rolled at all.

**A sixth issue worth noting: PAC and MTE compete for pointer bits.** Enabling MTE consumes **4 bits** of every pointer's upper bits, which is where PAC's signature lives. On a 48-bit-VA platform this **shortens the PAC from 15 bits to 11**, multiplying per-attempt forgery probability by **16** (Question 12). So enabling both is right, but it is not free of interaction, and the resulting PAC strength should be stated rather than assumed.

**The corrected configuration:**

```
  - BTI enabled, with pages correctly marked guarded by the OS
  - PAC ENABLED  (backward edge: return addresses and function pointers)
  - MTE enabled in SYNCHRONOUS mode for security-sensitive processes
      (async acceptable only for wide fleet telemetry, where the goal is
       finding bugs rather than stopping exploits)
  - Continue investing in levels 1 and 2: testing, sanitisers,
    memory-safe languages for new code
  - Track CHERI adoption as the level-4 answer
```

**And the corrected claim:**

> PAC and BTI together provide layered control-flow protection — **PAC on the backward edge, BTI on the forward edge** — measured at a **97% reduction in available ROP and JOP gadgets in GLIBC**. MTE provides **probabilistic** spatial and temporal detection at **16-byte granularity** with a **1-in-16** false-negative rate per check. Together these **substantially raise the cost of exploitation** — **level 3, statistical blocking** — but they are **not deterministic**, do **not eliminate** our memory-safety bugs, and do **not** reduce the value of fixing those bugs. Deterministic architectural protection would require **CHERI**.

**The general lesson.** Every mechanism in this chapter has a **specific scope and a specific named limitation**, and the errors above all come from generalising a narrow guarantee into a broad one: forward edge → all control flow, a tag check → all bounds, low overhead → no cost. Naming the mechanism's edge, its granularity, its probability and its failure mode is what turns a list of acronyms into a security argument.

---

### Question 25 — The overflow MTE cannot see

**Q:** This code is deployed on a system with MTE enabled in synchronous mode. Explain precisely why MTE does **not** detect the bug, quantify the blind spot, give the software fix, and state what would detect it.

```c
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

struct session {
    char token[4];      /* 4-character code, e.g. "A1B2" */
    int  authenticated;
};

void set_token(struct session *s, const char *code)
{
    strcpy(s->token, code);       /* <-- no bound, and no room for '\0' */
}

int main(void)
{
    struct session *s = malloc(sizeof(*s));
    if (s == NULL)
        return 1;

    s->authenticated = 0;
    set_token(s, "A1B2XXXXXXX");            /* attacker-controlled */

    printf("authenticated = %d\n", s->authenticated);
    return 0;
}
```

**Answer & Explanation:**

**The bug, in two parts.** `strcpy` copies until it finds a terminator **in the source**, ignoring the destination's size, so an 11-character `code` writes 12 bytes into a **4-byte** field. And even a 4-character code overflows, because `token[4]` leaves **no room for the NUL terminator** — a `char[4]` holds at most **3** characters of string.

**What it overwrites.** `struct session` is laid out `char token[4]` at offset 0 and `int authenticated` at offset 4 (both 4-aligned, `sizeof` = 8). So the overflow runs straight into **`authenticated`**, and the attacker chooses its bytes. `"A1B2XXXXXXX"` sets it to `0x58585858`, which is **non-zero and therefore true** — authentication bypassed by a string copy. Note this is a **data-only** attack: no control flow is hijacked, so **PAC and BTI are irrelevant**, and the program's own logic is turned against it.

**Why MTE does not detect it — this is the point of the question.** MTE's rule is `tag(pointer) == tag(memory granule)`, with tags applied to **16-byte granules**. Here:

```
sizeof(struct session) = 8 bytes
malloc(8) -> ceil(8/16) = 1 granule, bytes 0..15, all tagged with the SAME tag
overflow writes bytes 4..15  ->  entirely inside granule 0
tag(pointer) == tag(granule)  ->  NO MISMATCH  ->  NO FAULT
```

**The overflow never leaves the granule**, so there is no boundary to detect. This is MTE's **granularity limitation**, and the slides state it in exactly this shape: a **4-byte buffer**, written **8 bytes past the end**, still within the same 16-byte granule → **no tag mismatch**.

**Quantifying the blind spot.** Two figures matter, and they are different in kind:

| Property | Value |
|---|---|
| Bytes of undetectable overflow after an `n`-byte allocation | up to `16 × ceil(n/16) − n` |
| For `malloc(8)` | **8 bytes** of silent slack |
| For `malloc(4)` | **12 bytes** of silent slack |
| For `malloc(100)` | **12 bytes** (112 tagged − 100 used) |
| Probability involved | **none** |

> **The crucial distinction: this is not the 1-in-16 limitation.** MTE's 6.25% false-negative rate is a **probabilistic** miss that repetition helps the defender overcome. This is **deterministic** — the intra-granule region carries the allocation's own tag **by construction**, so **every** such overflow is undetected, **every** time, and no number of runs will ever catch it. An exam answer that explains the miss by citing 1-in-16 has identified the wrong limitation.

**The software fix — size for the terminator and bound the copy:**

```c
struct session {
    char token[8];               /* room for a code plus '\0' */
    int  authenticated;
};

int set_token(struct session *s, const char *code)
{
    if (strlen(code) >= sizeof(s->token))
        return -1;                               /* reject, don't truncate */

    memcpy(s->token, code, strlen(code) + 1);    /* copies the terminator */
    return 0;
}
```

Or with an explicitly bounded, always-terminating call:

```c
    int n = snprintf(s->token, sizeof(s->token), "%s", code);
    if (n < 0 || (size_t)n >= sizeof(s->token))
        return -1;                               /* truncated */
```

**Reordering the structure is not a fix**, and it is worth saying so: putting `authenticated` *before* `token` means the overflow runs into whatever follows the allocation instead — possibly heap metadata. It changes the victim, not the bug.

**What would detect it.**

| Mechanism | Result |
|---|---|
| **MTE** | **No** — intra-granule, as shown |
| **PAC / BTI** | **No** — data-only attack, no pointer corruption, no indirect branch |
| **CHERI** | **Yes, deterministically.** The capability for `s->token` is bounded to the **subobject** where the compiler narrows it, and in any case the capability for the allocation is bounded at **byte** granularity: `lower ≤ address < upper` is checked on **every** access, so the write faults at byte 4 (or byte 8) rather than at byte 16. **CHERI has no granule** |
| **AddressSanitizer** | **Yes** in testing — redzones with byte-level poisoning catch this — but ASan is a **level-1/2** tool that **cannot run in production** because of its overhead |
| **A memory-safe language** | **Yes** — level 2: the copy would be bounds-checked or the type would not permit it |

**The conclusion this question is built to support.** MTE is a genuinely valuable **level-3** mechanism: cheap, broad, and very likely to catch the large overflows that dominate real bug reports. But its guarantee is bounded in **two independent ways** — probabilistically by the 4-bit tag, and **structurally** by the 16-byte granule — and the structural gap is the one that cannot be argued away with repetition or better luck. **Byte-granular, deterministic bounds require the metadata to travel with the pointer**, which is precisely what a CHERI capability is and what an integer pointer, per Question 2, can never be.

---

## Answer Key Summary

**Author: Fable 5**

| # | Topic | Key answer |
|---|---|---|
| 9 | B-register | `EA = 100+5 = 105`; `0x1000+0x2C = 0x102C`; `0x4000+0x18 = 0x4018`; **4000 vs 2000** steps = **2×** |
| 10 | Pointer arithmetic | `0x4000 = 16384`; `int* +3 = 0x400C` but `(char*)+3 = 0x4003`; differences **4** elements / **16** bytes |
| 11 | MTE arithmetic | **16** tags, **6.25%** miss; detect ≥1 of 3 = **99.9756%**; `malloc(4)` → **1** granule, **12** bytes slack; overhead **3.125%** = **512 MiB** per 16 GiB |
| 12 | PAC bits | 48-bit VA → **16** spare; 16 bits → **1/65,536**, ~**32,768** attempts; with MTE → **11** bits → **1/2,048** |
| 13 | CHERI widths | **128+1 = 129** bits; `node` **16→32** (**2×**), `bulk` **48→64** (**1.33×**); tags **0.78%** = 128 MiB/16 GiB; CHERIoT bitmap **1.5625%** → **64 MiB** per 4 GiB |
| 14 | Heartbleed | over-read **65,534** bytes; **17** requests per MiB (not 16); `payload ≤ record_len − 19` |
| 15 | Pointer trace | `16384` / `0x4001 0x4004 0x4008 0x4008` / `0x400c 0x4003` / `4 16` / `8 8` |
| 16 | Self-modifying code | `Mem[50]` becomes `LOAD 100 → 101 → 102`; values **11, 22, 33** |
| 17 | MTE trace | **OK, OK, FAULT, OK, FAULT, NO FAULT (1/16), NO FAULT (granule), FAULT** |
| 18 | PAC trace | **succeeds, FAULT, FAULT (context), SUCCEEDS (PAC gadget), SUCCEEDS (key leak)** |
| 19 | CHERI trace | narrowing OK, widening **fails** (monotonicity), integer deref **faults** (provenance), overwrite **clears tag**, `0x1050` **faults** (exclusive bound) |

**The chapter's load-bearing claims:**

* **Software is malleable and cannot secure itself; security needs the inflexibility of hardware.** Von Neumann's **one memory for code and data** is the "original sin": **any code can read/write any data, and any data can be executed as code.**
* **The pointer is just an integer**, so hardware knows nothing of **bounds**, **type** or **lifetime** — giving **buffer overflow**, **type confusion** and **use-after-free** respectively. C exposed this model directly, and **pointer arithmetic scaling is a compile-time abstraction only**.
* **~70%** of serious bugs and CVEs are memory safety (**67%** of 2021 in-the-wild 0-days).
* **The four-level barrier model:** testing → safe languages/verification → **statistical** hardware (**MTE**) → **deterministic** architectural hardware (**CHERI**). The level 3/4 distinction is between changing an attacker's **probability** and changing what is **expressible**.
* **PAC** answers *"has this pointer been modified?"* via `QARMA(pointer, context, key)`; limited by **pointer substitution (PAC gadgets)** and **key leakage**. **BTI** is **forward-edge only** and **coarse-grained**, so it **must be paired with PAC**; together **97%** of GLIBC ROP/JOP gadgets go.
* **MTE** answers *"may this pointer access this memory now?"* via `tag(pointer) == tag(granule)`; limited by **1-in-16**, **16-byte granularity**, **allocation aliasing** and **async imprecision**. The granularity gap is **deterministic**, not probabilistic.
* **CHERI capabilities** = 128 bits + a validity tag, enforcing **provenance validity, bounds, monotonicity, permissions and tags**; GPRs become **129 bits**; **`$PCC`** and **`$DDC`** extend the PC and constrain legacy accesses. Cost ~**5%** footprint; **BLASTPASS** was **deterministically mitigated with 0% LoC change and no prior awareness of the bug**.
* **Memory safety is a necessary first step toward compartmentalisation**, which **sentries** (sealed entry capabilities) make possible — and **memory safety alone is not enough for the de facto threat model of quite a few libraries** (**73.8%** mitigation, not ~100%).
