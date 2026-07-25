---
subject: COMP60261
chapter: 12
title: "Week 2 — Flashcards"
language: en
---

# Week 2 — Memory Safety — Flashcards

34 flashcards. Click each question to reveal the answer.

**Anki:** [Download this deck as `.apkg`](/anki/comp60261/12-week-2-flashcards.apkg) — import into Anki via *File → Import*.

<details>
<summary><strong>Q1.</strong> Name the regions of a process address space from low addresses upward.</summary>

Text (code, r-x); data <code>.data</code> (initialised globals, rw-); BSS (zero-initialised globals, rw-); heap; memory mappings (libraries, <code>mmap</code>); stack.<br>Heap grows up, stack grows down, mappings sit between.

</details>

<details>
<summary><strong>Q2.</strong> Which regions are executable, and why does it matter?</summary>

Text is read+execute; data, BSS, heap and stack are read+write and should be <b>non-executable</b>.<br>This separation is what makes NX / W^X possible.

</details>

<details>
<summary><strong>Q3.</strong> What happens to the address space at <code>execve</code> time?</summary>

The kernel builds a fresh space, maps the executable's segments, maps the loader and shared libraries, builds an initial stack containing arguments and environment, and transfers control.

</details>

<details>
<summary><strong>Q4.</strong> What does a stack frame contain on x86-64?</summary>

Arguments not passed in registers, the <b>return address</b>, the saved frame pointer, and the callee's locals including arrays.

</details>

<details>
<summary><strong>Q5.</strong> State the single layout fact that makes stack smashing possible.</summary>

Local buffers and the return address live in the <b>same frame</b>, with the return address at a <b>higher</b> address than the locals.<br>A buffer overflowing upward runs directly into saved registers and the return address.

</details>

<details>
<summary><strong>Q6.</strong> Define memory safety.</summary>

Every memory access is to a valid object, within its bounds, during its lifetime, and consistent with its type.

</details>

<details>
<summary><strong>Q7.</strong> Distinguish spatial from temporal memory safety violations.</summary>

<b>Spatial:</b> outside an object's bounds — buffer overflow/underflow, out-of-bounds read.<br><b>Temporal:</b> outside an object's lifetime — use-after-free, double free, returned dangling stack pointer.

</details>

<details>
<summary><strong>Q8.</strong> How do memory-safe languages prevent these violations?</summary>

By construction: bounds-checked indexing, no manual <code>free</code>, and garbage collection or ownership tracking.<br>An out-of-bounds index raises an exception — the program stops rather than silently corrupting state.

</details>

<details>
<summary><strong>Q9.</strong> Why are C and C++ memory-unsafe, and why does that framing matter?</summary>

It was a deliberate <b>performance trade</b>: no bounds check means no per-access cost.<br>So unsafety is a design decision now billed in vulnerabilities — which is why &quot;rewrite in a safe language&quot; is a serious security proposal, and why it is often infeasible for the existing corpus.

</details>

<details>
<summary><strong>Q10.</strong> List the common memory-safety issue classes.</summary>

Stack and heap buffer overflow; out-of-bounds read; use-after-free; double free; uninitialised memory read; integer overflow causing an undersized allocation; format-string bugs.

</details>

<details>
<summary><strong>Q11.</strong> What is an infoleak, and what makes it strategically important?</summary>

An out-of-bounds <b>read</b> returning adjacent memory to the attacker.<br>Strategic because it defeats ASLR — leak one pointer and you learn where a region is mapped. An out-of-bounds read is therefore not a minor bug.

</details>

<details>
<summary><strong>Q12.</strong> Explain the Heartbleed bug.</summary>

A protocol heartbeat carried a payload plus a length. The implementation echoed back <code>length</code> bytes <b>without checking the payload was actually that long</b>.<br>A small payload with a large declared length returned up to ~64 KB of adjacent process memory, repeatable at will. It leaked production private keys.

</details>

<details>
<summary><strong>Q13.</strong> What is sensitive data tampering, and why needs it no code injection?</summary>

An out-of-bounds <b>write</b> modifies adjacent memory — an <code>is_admin</code> flag, a UID, a length, a function pointer.<br>The program's own logic then does the wrong thing while appearing to behave correctly.

</details>

<details>
<summary><strong>Q14.</strong> Describe stack smashing.</summary>

Overflow a stack buffer far enough to overwrite the <b>return address</b>.<br>When the function returns, execution jumps wherever the attacker chose.

</details>

<details>
<summary><strong>Q15.</strong> Contrast code injection with code reuse.</summary>

<b>Injection:</b> place shellcode in the buffer, point the return address at it — defeated by NX.<br><b>Reuse:</b> point at code already in the process; nothing is injected, so NX does not help.

</details>

<details>
<summary><strong>Q16.</strong> What is return-oriented programming (ROP)?</summary>

Chaining short existing instruction sequences (&quot;gadgets&quot;), each ending in <code>ret</code>, to stitch arbitrary computation out of code already present.<br>It is the standard response to non-executable memory.

</details>

<details>
<summary><strong>Q17.</strong> Define a trust boundary.</summary>

Any point where data crosses from a less-trusted domain into a more-trusted one.<br>Everything crossing must be validated <b>at</b> the boundary.

</details>

<details>
<summary><strong>Q18.</strong> Why must you check <code>argc</code>, not just <code>argv</code> contents?</summary>

Indexing <code>argv[1]</code> without confirming <code>argc &gt; 1</code> is a null-pointer dereference at best.<br>Both the count and the contents are attacker-controlled when the program is setuid or invoked by other software.

</details>

<details>
<summary><strong>Q19.</strong> Why are environment variables a classic privilege-escalation vector?</summary>

They are inherited and arbitrary in name, content, and size, yet routinely assumed trustworthy — historically rich ground for setuid binary bugs.

</details>

<details>
<summary><strong>Q20.</strong> Why does &quot;the caller validates it&quot; not discharge validation duty?</summary>

If the callee is separately reachable, validation performed by one caller does not protect it.<br>Validate on the trusted side of the boundary.

</details>

<details>
<summary><strong>Q21.</strong> Why prefer <code>calloc</code> and watch <code>n * sizeof(T)</code>?</summary>

Size arithmetic can <b>integer overflow</b> and wrap, producing a small allocation for a large <code>n</code>, then a heap overflow.<br><code>calloc</code> checks the multiplication.

</details>

<details>
<summary><strong>Q22.</strong> List core secure C coding practices.</summary>

Check every allocation against <code>NULL</code>; validate lengths and indices against real buffer sizes computed with <code>sizeof</code>; never mix signed and unsigned in bounds comparisons; prefer <code>snprintf</code>/<code>fgets</code>; <code>NULL</code> pointers after freeing; enable <code>-Wall -Wextra</code> and treat warnings as errors.

</details>

<details>
<summary><strong>Q23.</strong> Static analysis: strengths and weaknesses?</summary>

Examines code without running it, so it reasons over <b>all paths</b> and finds bugs testing never reaches.<br>But it cannot know runtime values, so it yields <b>false positives</b> and misses value-dependent bugs. Requires triage.

</details>

<details>
<summary><strong>Q24.</strong> What do AddressSanitizer, MemorySanitizer, and UBSan each catch?</summary>

<b>ASan:</b> overflows and use-after-free at the moment of access.<br><b>MSan:</b> uninitialised memory reads.<br><b>UBSan:</b> undefined behaviour.<br>Low false positives, real slowdown, and only on paths actually executed.

</details>

<details>
<summary><strong>Q25.</strong> Why is coverage-guided fuzzing so effective on parsers?</summary>

It generates and mutates input toward unexplored branches, and parsers consume untrusted structured input with many states — exactly where hand-written tests miss cases.

</details>

<details>
<summary><strong>Q26.</strong> How do static and dynamic analysis complement one another?</summary>

Static gives <b>breadth</b> over all paths with false positives; dynamic gives <b>precision</b> on executed paths only.<br>Neither is sufficient alone and neither proves absence of bugs.

</details>

<details>
<summary><strong>Q27.</strong> What does non-executable memory (NX / DEP / W^X) do, and how is it bypassed?</summary>

Marks writable pages non-executable and executable pages non-writable, enforced by the MMU's NX bit, so injected shellcode cannot run.<br><b>Bypass:</b> code reuse — ROP and return-to-libc.

</details>

<details>
<summary><strong>Q28.</strong> What does ASLR do, and what are its three limitations?</summary>

Randomises base addresses of stack, heap, libraries and (with PIE) the executable each run.<br><b>Limits:</b> low entropy on 32-bit is brute-forceable; a single infoleak defeats it entirely; non-PIE executables stay at a fixed address, giving reliable gadgets.

</details>

<details>
<summary><strong>Q29.</strong> How do stack canaries work?</summary>

A random value is placed between locals and the return address at function entry and verified before return.<br>A sequential overflow must overwrite it first, so the check fails and the process aborts.

</details>

<details>
<summary><strong>Q30.</strong> Give three limitations of stack canaries.</summary>

Only detect <b>contiguous</b> overflows — a targeted write can skip the canary; the canary can be leaked; and they protect the return address, not other frame data.

</details>

<details>
<summary><strong>Q31.</strong> What is CFI, and what are its forward and backward edges?</summary>

Control Flow Integrity restricts indirect transfers to targets the control-flow graph permits.<br><b>Forward edge:</b> indirect calls/jumps (function pointers, virtual calls) checked against legal destinations.<br><b>Backward edge:</b> returns, protected by a <b>shadow stack</b> holding a protected copy of return addresses.

</details>

<details>
<summary><strong>Q32.</strong> Why does CFI directly counter ROP?</summary>

ROP depends on returning and jumping to places the program never intended — precisely what CFI forbids.<br>Hardware support exists (Intel CET: shadow stack + indirect branch tracking).

</details>

<details>
<summary><strong>Q33.</strong> What do RELRO and FORTIFY_SOURCE do?</summary>

<b>RELRO:</b> makes the GOT read-only after relocation, blocking GOT overwrite.<br><b>FORTIFY_SOURCE:</b> adds compile-time and runtime checks to libc calls.

</details>

<details>
<summary><strong>Q34.</strong> Why is defence in depth the point, given every defence has a bypass?</summary>

Attacks route around individual links: NX → ROP, ASLR → infoleak, canaries → non-contiguous writes.<br>Each layer raises the number of primitives that must be chained, and each is another thing that must go right for the attacker. None of it substitutes for not having the bug.

</details>
