---
subject: COMP60261
chapter: 18
title: "Memory Protection — Flashcards"
language: en
---

# Memory Protection — Flashcards

49 flashcards. Click each question to reveal the answer.

**Anki:** [Download this deck as `.apkg`](/anki/comp60261/18-memory-protection-flashcards.apkg) — import into Anki via *File → Import*.

<details>
<summary><strong>Q1.</strong> Why did multiprogramming require ISA extensions rather than software checks?</summary>

With direct physical addressing, any program can name any address. Enforcement must occur on <b>every</b> memory access — only hardware can do that affordably and unbypassably.<br>Two extensions needed: a <b>privilege distinction</b> and an <b>address-translation / region-checking</b> mechanism.

</details>

<details>
<summary><strong>Q2.</strong> What do protection rings achieve, and what do they not?</summary>

<b>Achieve:</b> a privilege distinction — who may execute sensitive instructions (ring 0 kernel … ring 3 user on x86).<br><b>Do not:</b> say anything about <b>which memory</b> a process may touch. Two ring-3 processes are equally unprivileged yet must be isolated from each other.

</details>

<details>
<summary><strong>Q3.</strong> Describe segment translation.</summary>

A <b>segment selector</b> indexes a <b>descriptor table</b> (GDT/LDT); the <b>descriptor</b> gives the segment's base, limit, and access rights.<br>An address is (selector, offset); hardware checks <code>offset ≤ limit</code> and the rights, then adds the base.

</details>

<details>
<summary><strong>Q4.</strong> Contrast Real Mode with Protected Mode on the 80286.</summary>

<b>Real Mode:</b> addresses computed directly, <b>no protection</b>.<br><b>Protected Mode</b> (PVAM, 1982): segment limits and access rights enforced, enabling relocation and protection.

</details>

<details>
<summary><strong>Q5.</strong> Why did segmentation lose to paging on fragmentation grounds?</summary>

Segments are <b>variable-length</b>, so allocation and freeing leave gaps too small to reuse — <b>external fragmentation</b>. Total free memory suffices but no single contiguous run does.<br><b>Fixed-size pages eliminate this by construction.</b>

</details>

<details>
<summary><strong>Q6.</strong> What was the &quot;Unreal Mode&quot; vulnerability?</summary>

Segment limits and rights are cached in hidden descriptor registers when a selector loads. Switching back to Real Mode did not necessarily <b>reset</b> them.<br>So code could run with Real Mode's absent checks while keeping Protected Mode's extended reach — <b>state persisting across a mode change</b>.

</details>

<details>
<summary><strong>Q7.</strong> What is a virtual address space, as an architectural abstraction?</summary>

Each process sees a private, apparently contiguous range of addresses, translated by hardware onto physical memory.<br>Delivers isolation, abstraction over fragmentation, overcommit, and per-page permissions.

</details>

<details>
<summary><strong>Q8.</strong> What are the MMU's two jobs?</summary>

<b>Address translation</b> — virtual to physical, via page tables.<br><b>Permission enforcement</b> — checking access rights on every access, raising a <b>page fault</b> on violation or absent mapping.

</details>

<details>
<summary><strong>Q9.</strong> What is the TLB and why is it mandatory?</summary>

A cache of completed virtual→physical translations.<br>Mandatory because a walk costs one memory access <b>per level</b> before the data is reached; without caching, every access would multiply in cost.

</details>

<details>
<summary><strong>Q10.</strong> What is a page fault, and name three legitimate uses.</summary>

An exception raised when a mapping is absent or the access violates permissions.<br>Uses: <b>demand paging</b>, <b>swapping</b>, and <b>copy-on-write</b>; also guard pages catching overruns.

</details>

<details>
<summary><strong>Q11.</strong> How does copy-on-write use the MMU?</summary>

Shared frames are mapped <b>read-only</b> in both parties. A write raises a protection fault; the handler allocates a fresh frame, copies, remaps writable, and resumes.<br>Only touched pages are ever copied.

</details>

<details>
<summary><strong>Q12.</strong> Decompose an i386 linear address.</summary>

<code>[ dir idx 10 ][ table idx 10 ][ offset 12 ]</code> = 32 bits.<br>12-bit offset → <b>4 KB pages</b>; each 10-bit index selects one of 1024 entries; 1024 × 4 bytes = 4096 = exactly one page.

</details>

<details>
<summary><strong>Q13.</strong> How many pages does i386 two-level paging map, and to what total?</summary>

<code>1024 × 1024 = 1,048,576 pages</code><br><code>1,048,576 × 4 KB = 4 GB</code> — the full 32-bit space.

</details>

<details>
<summary><strong>Q14.</strong> What does CR3 hold?</summary>

The <b>physical address of the page directory</b> — the root of the translation walk. It is reloaded on address-space change.

</details>

<details>
<summary><strong>Q15.</strong> Name the four security-relevant PTE bits and what each gives.</summary>

<b>P</b> present — validity; absent → page fault (demand paging, swapping, guard pages).<br><b>R/W</b> — read-only text and constants; the mechanism behind copy-on-write.<br><b>U/S</b> user/supervisor — enforces the <b>userspace/kernel boundary</b>.<br><b>D</b> dirty — whether writeback is needed.

</details>

<details>
<summary><strong>Q16.</strong> How does an MPU/PMP differ decisively from an MMU?</summary>

It performs <b>no address translation</b> — programs use physical addresses directly and the unit only permits or denies, using a small set of base/size/permission <b>regions</b>.

</details>

<details>
<summary><strong>Q17.</strong> Why do MPU/PMPs exist when MMUs are more capable?</summary>

An MMU needs page tables in memory, a TLB, and fault handling — costing area, power, and worst-case latency <b>determinism</b>.<br>Embedded and real-time systems often cannot accept TLB-miss variability or page-table memory cost.

</details>

<details>
<summary><strong>Q18.</strong> Give the MPU/PMP access-check algorithm.</summary>

For access at address A with operation <i>op</i>: find the region containing A; if none, <b>deny</b>; otherwise permit iff <i>op</i> is allowed by that region's permissions for the current privilege level.

</details>

<details>
<summary><strong>Q19.</strong> What can an MPU/PMP still protect?</summary>

Kernel/RTOS from tasks; inter-task isolation; code integrity via <b>W^X</b>; and memory-mapped <b>peripheral registers</b>.

</details>

<details>
<summary><strong>Q20.</strong> Give four MPU/PMP limitations.</summary>

<b>Few regions</b> with coarse alignment, so fine layouts are impossible.<br><b>Misconfiguration</b> easily yields escalation.<br><b>No protection against non-CPU bus masters</b> — DMA bypasses it entirely.<br>No defence against physical attacks.

</details>

<details>
<summary><strong>Q21.</strong> Classify the three pipeline hazards with remedies.</summary>

<b>Data</b> — needs an unproduced result; forwarding/bypassing, stalling, register renaming.<br><b>Control/branch</b> — next address unknown until resolution; prediction + speculation.<br><b>Structural</b> — two instructions need one resource; duplicate, pipeline, or stall.

</details>

<details>
<summary><strong>Q22.</strong> What defines a superscalar processor?</summary>

Multiple fetch/decode paths and <b>several execution units</b>, so more than one instruction issues per cycle.

</details>

<details>
<summary><strong>Q23.</strong> What is register renaming and which problem does it solve?</summary>

Mapping architectural registers onto a larger physical set, removing <b>false</b> (write-after-read, write-after-write) dependencies that would otherwise serialise independent instructions.

</details>

<details>
<summary><strong>Q24.</strong> What does the Re-Order Buffer do?</summary>

Retires results <b>in program order</b>, so architectural state appears sequential even though execution was out of order. It is also where mispredicted speculative work is discarded.

</details>

<details>
<summary><strong>Q25.</strong> Distinguish architectural from microarchitectural state.</summary>

<b>Architectural:</b> what the ISA specifies as visible — registers, flags, PC, memory.<br><b>Microarchitectural:</b> implementation-internal and unnamed by the ISA — caches, TLB, branch predictors, prefetchers, buffers.

</details>

<details>
<summary><strong>Q26.</strong> What is a transient execution attack, and what is the core discovery?</summary>

An attack exploiting observable side effects of instructions that execute <b>speculatively and are then discarded</b>.<br>Core discovery: squashing restores <b>architectural</b> state only — the <b>cache footprint survives</b>. &quot;Discarded&quot; was never &quot;without trace.&quot;

</details>

<details>
<summary><strong>Q27.</strong> Give Meltdown's three steps.</summary>

<b>1.</b> Userspace speculatively reads a kernel address; the permission check will fail but the load proceeds.<br><b>2.</b> The obtained byte <b>indexes an attacker array</b>, caching a specific line.<br><b>3.</b> The fault retires and work is squashed, but the line persists — <b>timing</b> each element reveals the index, hence the byte.

</details>

<details>
<summary><strong>Q28.</strong> What exactly failed in Meltdown?</summary>

The <b>U/S bit was enforced architecturally but not microarchitecturally</b> — the read never retired, yet the data reached the cache-timing channel first.<br>A permission bit alone was insufficient.

</details>

<details>
<summary><strong>Q29.</strong> What is KPTI, why does it work, and what does it cost?</summary>

<b>Kernel Page Table Isolation:</b> separate page tables for user and kernel, unmapping almost all kernel memory during userspace execution.<br>Works because <b>speculation cannot leak what is not mapped</b>.<br>Costs a page-table switch (CR3 reload) on every syscall and interrupt, plus TLB pressure.

</details>

<details>
<summary><strong>Q30.</strong> Describe Spectre Variant 1.</summary>

<b>Bounds Check Bypass</b> (CVE-2017-5753). The predictor guesses a bounds check passes, so the guarded access executes speculatively with an out-of-range index, then the value is encoded into the cache.

</details>

<details>
<summary><strong>Q31.</strong> Describe Spectre Variant 2.</summary>

<b>Branch Target Injection</b> (CVE-2017-5715). The attacker <b>poisons the branch target predictor</b> so a victim's indirect branch speculatively jumps to an attacker-chosen <b>gadget</b> already in the victim's code, which leaks.

</details>

<details>
<summary><strong>Q32.</strong> Why is Spectre harder to fix than Meltdown?</summary>

Meltdown crossed a <b>privilege boundary</b>, so unmapping kernel memory removed the target. Spectre stays <b>within</b> the victim's own permissions — nothing to unmap, no permission bit violated.<br>It exploits branch prediction and speculation themselves, foundational to performance, and is a property of <i>correct</i> programs.

</details>

<details>
<summary><strong>Q33.</strong> Name Spectre mitigations, software and hardware.</summary>

<b>Software:</b> speculation barriers (<code>lfence</code>), index masking, <b>retpolines</b>, compiler hardening.<br><b>Hardware:</b> IBRS/IBPB/STIBP constraining predictor sharing, predictor flushing on domain change.

</details>

<details>
<summary><strong>Q34.</strong> What is a speculation-safe microarchitecture?</summary>

One that <b>isolates speculative state</b>, <b>delays committing side effects</b> until retirement, or exposes <b>selective speculation controls</b>.<br>Trade-off: every measure costs performance, since the restricted mechanism is what makes CPUs fast.

</details>

<details>
<summary><strong>Q35.</strong> What is fault injection?</summary>

<b>Maliciously induced</b> faults — via voltage/clock glitching, laser, or electromagnetic interference — to corrupt computation and skip checks.<br>Distinct from random transient errors (cosmic rays, noise).

</details>

<details>
<summary><strong>Q36.</strong> What is lock-step execution?</summary>

Two or more cores execute the <b>same instruction stream in parallel</b> and their results are compared each cycle; a mismatch signals a fault.<br>Redundancy-based detection of transient errors, used in safety-critical systems.

</details>

<details>
<summary><strong>Q37.</strong> What is Rowhammer, and why is it a leaky abstraction?</summary>

Repeatedly activating a DRAM row induces charge <b>disturbance</b> in physically adjacent rows, flipping bits never accessed.<br>Leaky because memory is presented as reliable storage while the underlying analogue physics shows through — <b>the attacker writes only its own memory yet modifies another's</b>.

</details>

<details>
<summary><strong>Q38.</strong> Give Rowhammer's four attack stages.</summary>

<b>1. Templating</b> — profile the DIMM for susceptible cells and physical row adjacency.<br><b>2. Cache eviction</b> — ensure accesses actually reach DRAM.<br><b>3. Hammering</b> — rapidly activate the <b>aggressor</b> rows flanking the victim, thousands of times per refresh interval.<br><b>4. Disturbance error</b> — a bit flips in the <b>victim</b> row.

</details>

<details>
<summary><strong>Q39.</strong> Why are ECC and faster refresh inadequate against Rowhammer?</summary>

<b>ECC</b> corrects single-bit errors but is defeated by multi-bit flips in a word, and correction timing can itself leak.<br><b>Faster refresh</b> raises the bar but costs power and bandwidth without closing the window.

</details>

<details>
<summary><strong>Q40.</strong> What is Target Row Refresh?</summary>

A DRAM mitigation that <b>detects abnormally frequent activations</b>, identifies likely victim rows, and issues <b>targeted refreshes</b> to restore charge before a flip — transparently to software.

</details>

<details>
<summary><strong>Q41.</strong> How does TRRespass bypass TRR, and what is the lesson?</summary>

TRR implementations are <b>proprietary and resource-limited</b>, tracking only a few aggressor rows. Hammering <b>many</b> rows at once (&quot;many-sided&quot;) exhausts the tracking so some aggressors go unnoticed.<br><b>Lesson:</b> a mitigation whose strength rests on undisclosed, resource-bounded implementation details is not a guarantee.

</details>

<details>
<summary><strong>Q42.</strong> &quot;The stack is just memory.&quot; What follows?</summary>

It holds locals <b>and return addresses</b> — control data — in one writable region with no architectural distinction between them.<br>So a memory-safety bug in data becomes <b>control over execution</b>.

</details>

<details>
<summary><strong>Q43.</strong> What is a ROP gadget, and how is a chain executed?</summary>

A short existing instruction sequence ending in <code>ret</code>.<br>The attacker writes a sequence of gadget <b>addresses</b> to the stack; each <code>ret</code> pops the next, so control flows through the chain, typically ending in a syscall.

</details>

<details>
<summary><strong>Q44.</strong> Why does ROP defeat W^X entirely?</summary>

Only <b>data</b> is written (addresses on the stack); the executed bytes were <b>already present and already executable</b>.<br>The W^X invariant is never violated — it is simply irrelevant. W^X enforced a <i>proxy</i> for the real goal.

</details>

<details>
<summary><strong>Q45.</strong> What do ASLR and stack canaries each do here?</summary>

<b>ASLR</b> randomises module and region base addresses, so gadget addresses are unknown — defeated by an infoleak.<br><b>Canary</b> is a random value between locals and the return address, checked before return — defeats <b>contiguous</b> overflows only, and can be leaked.

</details>

<details>
<summary><strong>Q46.</strong> What is a shadow stack?</summary>

A second, hardware-maintained stack holding a <b>protected copy of return addresses</b>, writable only by call/return machinery. On return the two are compared; a mismatch faults.<br>The overflow corrupting the normal stack cannot reach it.

</details>

<details>
<summary><strong>Q47.</strong> Map Intel and ARM control-flow protections to the two edges.</summary>

<b>Backward edge (returns):</b> Intel <b>Shadow Stack</b> · ARM <b>PAC</b>.<br><b>Forward edge (indirect branches):</b> Intel <b>IBT</b> · ARM <b>BTI</b>.

</details>

<details>
<summary><strong>Q48.</strong> Contrast the design philosophies of Shadow Stack and PAC.</summary>

<b>Shadow Stack = duplication</b> — keep a protected copy; costs memory and requires protecting the shadow region.<br><b>PAC = authentication</b> — make forgery detectable; costs crypto operations and depends on key secrecy and context choice.

</details>

<details>
<summary><strong>Q49.</strong> What is the lecture's architectural message about abstraction and complexity?</summary>

Each abstraction delivered real capability <b>and</b> created the vulnerability: segmentation→Unreal Mode, shared kernel mappings→Meltdown, speculation→Spectre, DRAM density→Rowhammer.<br>Each fix added complexity and new surface (paging→page tables, KPTI→syscall cost, TRR→TRRespass). <b>Every abstraction eventually leaks, and the leak is where security fails.</b>

</details>
