---
subject: COMP60261
chapter: 11
title: "Week 1 — Flashcards"
language: en
---

# Week 1 — Core Concepts and the C Language — Flashcards

36 flashcards. Click each question to reveal the answer.

**Anki:** [Download this deck as `.apkg`](/anki/comp60261/11-week-1-flashcards.apkg) — import into Anki via *File → Import*.

<details>
<summary><strong>Q1.</strong> What distinguishes <i>systems</i> security from computer security generally?</summary>

Systems security concerns the layers beneath the application: language runtime, OS, hypervisor, hardware.<br>These layers are <b>shared</b> and <b>privileged</b>, so a bug there has a far wider blast radius than an application bug.

</details>

<details>
<summary><strong>Q2.</strong> Define attack surface.</summary>

The total set of points at which an adversary can interact with a system.<br>Includes command-line arguments, environment variables, files, sockets, IPC, system calls, and observable timing.

</details>

<details>
<summary><strong>Q3.</strong> Why is attack surface reduced by design rather than by validation?</summary>

Validation hardens an entry point but keeps it. Reduction <b>removes</b> entry points.<br>Note that unused features still count: a parser you never call is reachable if an attacker can reach it.

</details>

<details>
<summary><strong>Q4.</strong> Distinguish a vulnerability from an exploit.</summary>

<b>Vulnerability:</b> a flaw that could permit violation of a security property.<br><b>Exploit:</b> a concrete artefact that actually achieves it.<br>Not every vulnerability is exploitable, but treating &quot;not obviously exploitable&quot; as &quot;safe&quot; is how incidents happen.

</details>

<details>
<summary><strong>Q5.</strong> Name the CIA triad and what violates each.</summary>

<b>Confidentiality</b> (who may read) — infoleak, side channel.<br><b>Integrity</b> (who may modify) — tampering, unauthorised write.<br><b>Availability</b> (can legitimate users use it) — DoS, resource exhaustion.

</details>

<details>
<summary><strong>Q6.</strong> Why does identity/authentication underpin the CIA triad?</summary>

You cannot enforce &quot;who may&quot; without knowing who is asking.<br>Add authenticity and non-repudiation when the question is whether a message genuinely came from a claimed party.

</details>

<details>
<summary><strong>Q7.</strong> How should the CIA triad be used analytically?</summary>

As a checklist against any mechanism: which properties does it protect, and which does it <b>silently ignore</b>?<br>Many mechanisms deliver confidentiality and integrity while leaving availability wide open.

</details>

<details>
<summary><strong>Q8.</strong> Define the Trusted Computing Base (TCB).</summary>

The set of components that <b>must be correct</b> for your security properties to hold.<br>Crucially: not what you happen to trust, but what is fatal if it fails.

</details>

<details>
<summary><strong>Q9.</strong> What is in the TCB of an ordinary Linux process?</summary>

CPU, firmware, hypervisor (if present), kernel, libc, and the program itself.<br>An enormous amount of code to be betting on — which motivates TCB-shrinking designs.

</details>

<details>
<summary><strong>Q10.</strong> Name the two distinct design moves for improving a TCB.</summary>

<b>Shrink it</b> — less trusted code, fewer fatal bug sites (microkernels, unikernels, TEEs).<br><b>Remove components from it</b> — e.g. encrypt data so the OS cannot read it; the OS still runs your code but is no longer trusted for confidentiality.

</details>

<details>
<summary><strong>Q11.</strong> What must a usable threat model specify?</summary>

Assets worth protecting; adversary capabilities; adversary goals; and explicitly what is <b>out of scope</b>.<br>The out-of-scope item is most often skipped and most useful.

</details>

<details>
<summary><strong>Q12.</strong> Why is &quot;is this secure?&quot; unanswerable without a threat model?</summary>

A design is only insecure <i>relative to</i> a threat model.<br>Stating the boundary is what makes any security claim meaningful.

</details>

<details>
<summary><strong>Q13.</strong> Why does this unit teach C?</summary>

The systems layer is written in C, and C's failure modes are themselves the subject matter.<br>Direct memory control with no safety net is why memory corruption is a systems-security topic.

</details>

<details>
<summary><strong>Q14.</strong> Why is assuming <code>int</code> is 32 bits a potential security bug?</summary>

C integer widths are implementation-defined.<br>Size assumptions cause portability bugs and, in size/length arithmetic, exploitable ones. Use <code>stdint.h</code> (<code>uint32_t</code>, <code>size_t</code>, <code>intptr_t</code>) when width matters.

</details>

<details>
<summary><strong>Q15.</strong> Why is mixing signed and unsigned types dangerous?</summary>

Implicit conversions in comparisons and arithmetic produce attacker-useful surprises.<br>Classic case: a negative length converted to <code>size_t</code> becomes enormous, defeating a bounds check.

</details>

<details>
<summary><strong>Q16.</strong> Why is undefined behaviour more dangerous than merely unpredictable behaviour?</summary>

The compiler is entitled to assume UB never occurs and optimise on that basis.<br>This is how a &quot;harmless&quot; bug results in the optimiser <b>deleting your security checks</b>.

</details>

<details>
<summary><strong>Q17.</strong> Give four examples of undefined behaviour in C.</summary>

Out-of-bounds access; signed integer overflow; use-after-free; reading uninitialised memory.

</details>

<details>
<summary><strong>Q18.</strong> Why is every bounds check in C one you wrote by hand?</summary>

Arrays do not carry their length — nothing in the type system records how big an array is.

</details>

<details>
<summary><strong>Q19.</strong> What is a pointer, and what are the two core operators?</summary>

A variable holding a memory address.<br><code>&amp;x</code> takes the address of <code>x</code>; <code>*p</code> dereferences <code>p</code> to reach the pointed-to object.

</details>

<details>
<summary><strong>Q20.</strong> Can two processes hold the same numeric pointer value and refer to different memory?</summary>

Yes. Each process has its own <b>virtual address space</b>, mapped independently onto physical memory by the hardware and kernel.

</details>

<details>
<summary><strong>Q21.</strong> C passes arguments by value — so how does a function modify a caller's variable?</summary>

You pass the variable's <b>address</b>.<br>&quot;Pass by reference&quot; in C is just passing a pointer by value.

</details>

<details>
<summary><strong>Q22.</strong> Why do array parameters lose their size in C?</summary>

An array expression <b>decays</b> to a pointer to its first element.<br>The size is not part of what is passed, so bounds become the programmer's problem.

</details>

<details>
<summary><strong>Q23.</strong> Why are function pointers a prime attacker target?</summary>

They hold code addresses used for callbacks and dispatch tables.<br>Overwriting one redirects control flow.

</details>

<details>
<summary><strong>Q24.</strong> <code>p + 1</code> advances by how many bytes?</summary>

<code>sizeof(*p)</code> bytes — pointer arithmetic is scaled by the pointed-to type, not by one byte.<br>Getting this wrong is a classic off-by-N overflow source.

</details>

<details>
<summary><strong>Q25.</strong> When must you use heap allocation rather than stack or static?</summary>

When the size or the lifetime is determined at runtime rather than known at compile time or bound to scope.

</details>

<details>
<summary><strong>Q26.</strong> Why prefer <code>calloc(count, size)</code> over <code>malloc(count * size)</code>?</summary>

<code>calloc</code> checks the multiplication for <b>overflow</b> and zeroes the memory.<br><code>count * size</code> can wrap, yielding a small allocation for a large request — then a heap overflow.

</details>

<details>
<summary><strong>Q27.</strong> What is the bug in <code>p = realloc(p, n);</code>?</summary>

On failure <code>realloc</code> returns <code>NULL</code> but leaves the original block allocated.<br>Overwriting <code>p</code> therefore <b>leaks</b> it. Assign to a temporary and check first.

</details>

<details>
<summary><strong>Q28.</strong> What is a dangling pointer?</summary>

A pointer whose value still refers to memory that has been freed.<br>Using it is undefined behaviour; the block may already have been reallocated to unrelated data.

</details>

<details>
<summary><strong>Q29.</strong> Name the four canonical heap errors.</summary>

<b>Memory leak</b> — never freed (availability).<br><b>Use-after-free</b> — dereference after <code>free</code>.<br><b>Double free</b> — corrupts allocator metadata.<br><b>Heap overflow</b> — writes past the block into adjacent data or metadata.

</details>

<details>
<summary><strong>Q30.</strong> Give two defensive habits for heap management.</summary>

Set pointers to <code>NULL</code> after freeing.<br>Keep allocation and deallocation structurally paired (same function, or paired init/cleanup) so ownership is obvious.

</details>

<details>
<summary><strong>Q31.</strong> Why are <code>strcpy</code>, <code>strcat</code>, and <code>sprintf</code> unsafe by construction?</summary>

They take <b>no destination size</b> — they write until a NUL terminator in the <i>source</i>.<br>A source longer than the destination overflows it, with no diagnostic.

</details>

<details>
<summary><strong>Q32.</strong> Why is <code>gets</code> never acceptable?</summary>

It reads a line from stdin with no bound whatsoever.<br>It was removed from the language in C11.

</details>

<details>
<summary><strong>Q33.</strong> What is the trap in <code>strncpy</code>?</summary>

It does <b>not NUL-terminate</b> if the source fills the destination buffer, leaving an unterminated string.

</details>

<details>
<summary><strong>Q34.</strong> What does <code>strncat</code>'s size argument actually mean?</summary>

The number of <b>additional</b> characters to append — not the total destination buffer size.<br>A very common source of off-by-N overflows.

</details>

<details>
<summary><strong>Q35.</strong> Why is <code>snprintf</code> the most predictable of the bounded functions?</summary>

It always NUL-terminates, and its return value tells you the length it <i>wanted</i> to write, so truncation is detectable.

</details>

<details>
<summary><strong>Q36.</strong> Why does C's string representation cause structural insecurity?</summary>

A NUL-terminated string <b>conflates data with its length</b>.<br>The length is discovered by scanning for a sentinel an attacker may control or remove.

</details>
