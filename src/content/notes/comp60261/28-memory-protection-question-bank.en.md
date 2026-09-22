---
subject: COMP60261
chapter: 28
title: "Memory Protection — Question Bank"
language: en
---

# Memory Protection — Worked Question Bank

Companion to the Hardware Lecture 2 notes. Drills rings and segmentation, the MMU and paging, MPU/PMP, the pipeline evolution to out-of-order speculation, the transient-execution attacks, Rowhammer, and control-flow defences.

## Task types drilled

1. **Isolation mechanism reasoning** — connect a hardware feature to the property it enforces.
2. **Segmentation vs paging comparison** — identify which problem each solves.
3. **Translation arithmetic** — decompose linear addresses, count table entries.
4. **Pipeline hazard analysis** — classify a stall and name the remedy.
5. **Transient-execution reasoning** — separate architectural from microarchitectural state.
6. **Attack-step reconstruction** — order the stages of Meltdown, Spectre, Rowhammer.
7. **Mitigation assessment** — state why a defence is partial.

---

# Section A — Segmentation, paging, and protection units

## Q1. Why did multiprogramming require ISA extensions for isolation?

### Solution

**Step 1: State the driver.** Time-slicing multiple processes on one machine means several programs' code and data coexist in memory simultaneously.

**Step 2: Identify what breaks.** With direct physical addressing, any program can name any address, so one process can read or overwrite another's memory — including the supervisor's.

**Step 3: Explain why software cannot fix it.** Enforcement must occur on **every** memory access. Only hardware can check every access without unacceptable cost, and only hardware can prevent the checking code itself from being bypassed.

**Step 4: Name the two extensions required.** A **privilege distinction** (so that supervisor-only operations exist and are enforced), and an **address-translation or region-checking mechanism** (so that a process's reachable addresses can be restricted).

**Step 5: State the general principle.** Isolation is an architectural property. The OS configures policy; the ISA enforces it. This is why protection features appear in the instruction set rather than as a library.

---

## Q2. Explain protection rings and the memory-partitioning problem they do not solve.

### Solution

**Step 1: Describe rings.** x86 defines four privilege levels, ring 0 (most privileged) to ring 3 (least). Conventionally the kernel uses ring 0 and userspace ring 3; rings 1 and 2 are largely unused. Privileged instructions execute only at sufficient privilege.

**Step 2: State what rings achieve.** A **privilege** distinction — who may execute sensitive instructions and reach protected state.

**Step 3: State what rings do not achieve.** They say nothing about **which memory** a given process may touch. Two ring-3 processes are equally unprivileged, yet must still be isolated **from each other**.

**Step 4: Name the missing capability.** Memory partitioning: a per-process restriction on reachable addresses. Rings are orthogonal to it.

**Step 5: State the resolution.** Segmentation, then paging, supplied the partitioning. Rings and address translation are complementary — one governs *what operations*, the other *what memory*.

---

## Q3. Explain segment translation and the two problems that killed Protected Virtual Address Mode.

### Solution

**Step 1: Describe the mechanism.** Memory is divided into variable-length **segments**. A **segment selector** indexes a **descriptor table** (GDT/LDT); the **descriptor** supplies the segment's base address, limit, and access rights. An address is (selector, offset), and the hardware checks `offset ≤ limit` and the rights before adding the base.

**Step 2: State the role.** Segmentation provided both relocation (programs need not know physical addresses) and protection (per-segment limits and permissions).

**Step 3: Recall the 80286 context.** Protected Mode (1982) introduced this, in contrast to **Real Mode**, where addresses were computed directly with no protection at all.

**Step 4: Problem 1 — fragmentation.** Because segments are **variable-length**, allocating and freeing them leaves gaps too small to reuse. Over time the free memory is sufficient in total but not in any single contiguous run, so allocations fail. **External fragmentation** is intrinsic to variable-size partitioning.

**Step 5: Problem 2 — "Unreal Mode."** Segment limits and rights are loaded into hidden descriptor registers when a selector is loaded. Switching back to Real Mode did not necessarily **reset** those cached descriptors, so code could run with Real Mode's absent checks while retaining Protected Mode's extended reach — a privilege-escalation path arising from state that persisted across a mode change.

**Step 6: State the lesson and the successor.** Paging replaced segmentation as the primary mechanism because **fixed-size pages eliminate external fragmentation** by construction. Unreal Mode illustrates a recurring theme: incompletely reset state across a transition is a security boundary failure.

---

## Q4. Decompose an i386 linear address and compute the number of pages mapped.

### Solution

**Step 1: State the structure.** The i386 paging unit (1985) used **two-level** translation, with `CR3` holding the physical address of the page directory.

**Step 2: Decompose the 32-bit linear address.**

```
31        22 21        12 11         0
[  dir idx  ][ table idx ][  offset  ]
     10           10          12
```

**Step 3: Check the arithmetic.** 10 + 10 + 12 = 32 bits. The 12-bit offset gives a **4 KB** page. Each 10-bit index selects one of 2^10 = 1024 entries, and 1024 × 4 bytes = 4096 bytes, so each table occupies exactly one page — a deliberate and elegant fit.

**Step 4: State the translation steps.** Read `CR3` → index the page directory with bits 31–22 → obtain the page-table address → index it with bits 21–12 → obtain the frame address → add bits 11–0.

**Step 5: Count the mapped pages.**

```
1024 directory entries × 1024 table entries = 1,048,576 pages
1,048,576 × 4 KB = 4 GB
```

matching the full 32-bit address space.

**Step 6: Note the cost.** Two memory accesses per translation before reaching the data, which is why the **TLB** is mandatory rather than an optimisation. Note also that segmentation still existed alongside paging — it was bypassed in practice by using flat segments covering the whole space.

---

## Q5. Name the four security-relevant page-table protection bits and what each provides.

### Solution

**Step 1: P — Present.** Whether the mapping is valid. If clear, access raises a **page fault**. This underpins demand paging, swapping, and the guard pages that catch overruns.

**Step 2: R/W — Read/Write.** Whether writes are permitted. Enables read-only text and constant data, and is the mechanism behind **copy-on-write** (map shared frames read-only, fault on write, then copy).

**Step 3: U/S — User/Supervisor.** Whether ring 3 may access the page. This enforces the **userspace/kernel boundary** for every access, and is the bit Meltdown circumvented microarchitecturally.

**Step 4: D — Dirty.** Whether the page has been written. Not a protection control itself but essential to knowing whether a page must be written back before eviction.

**Step 5: Note the practical consequence.** Per-page permissions checked in hardware on every access give the OS fine-grained control at negligible marginal cost — but the resulting structure is complex and multi-level, which is exactly why the **TLB** is required for acceptable performance.

---

## Q6. Contrast MPU/PMP with an MMU, and state where each is appropriate.

### Solution

**Step 1: State what an MPU/PMP is.** A **region-based protection** unit: a small set of configurable regions, each with a base, a size, and permissions. Hardware checks every access against the regions.

**Step 2: State the decisive difference.** An MPU/PMP performs **no address translation**. Programs use physical addresses directly; the unit only permits or denies. An MMU both translates and protects.

**Step 3: Explain why the simpler unit exists.** A full MMU requires page tables in memory, a TLB, and page-fault handling — costing silicon area, power, and worst-case latency **determinism**. Embedded and real-time systems often cannot accept the variability of a TLB miss or the memory cost of page tables.

**Step 4: State the access-check logic.** For an access at address *A* with operation *op*: find the region containing *A*; if none, deny; otherwise permit iff *op* is allowed by that region's permissions for the current privilege level.

**Step 5: State what protection remains achievable.** Kernel/RTOS protection from tasks, inter-task isolation, code integrity via **W^X**, and protection of memory-mapped peripheral registers.

**Step 6: State the limitations.** A **small number of regions** with coarse alignment constraints, so fine-grained layouts are impossible; **misconfiguration** easily yields privilege escalation; **no protection against non-CPU bus masters** — a DMA-capable peripheral bypasses the MPU entirely, exactly as it bypasses an MMU; and no defence against physical attacks.

**Answer.** MMU where virtual memory, isolation at scale, and overcommit are needed; MPU/PMP in microcontrollers and real-time systems where determinism, area, and power dominate and translation is unnecessary.

---

# Section B — Pipelines and speculation

## Q7. Classify the three pipeline hazard types and give the remedy for each.

### Solution

**Step 1: Data hazard.** An instruction needs a result not yet produced by an earlier instruction still in the pipeline. **Remedy:** operand forwarding/bypassing where the value exists somewhere in the pipeline; stalling otherwise; and register renaming to remove false (write-after-read, write-after-write) dependencies.

**Step 2: Control/branch hazard.** The next instruction's address is unknown until a branch resolves, so fetching must either stop or guess. **Remedy:** branch prediction plus **speculative execution**, discarding work if the prediction proves wrong.

**Step 3: Structural hazard.** Two instructions need the same hardware resource in the same cycle (a single multiplier, one memory port). **Remedy:** duplicate the unit, pipeline it so it accepts a new operation each cycle, or stall.

**Step 4: State the escalation.** Removing these limits is what drove **superscalar** designs (multiple fetch/decode and several execution units, so more than one instruction issues per cycle) and then **out-of-order execution**.

**Step 5: Name the out-of-order machinery.** **Register renaming** eliminates false dependencies by mapping architectural registers onto a larger physical set; **reservation stations / issue queues** hold instructions until operands are ready; and the **Re-Order Buffer (ROB)** retires results **in program order**, so the architectural state appears sequential even though execution was not.

---

## Q8. Distinguish architectural from microarchitectural state, and explain why that distinction enables transient-execution attacks.

### Solution

**Step 1: Define architectural state.** What the ISA specifies as visible: general-purpose registers, flags, the program counter, and memory contents. This is what a correct program can observe.

**Step 2: Define microarchitectural state.** Implementation-internal state not named by the ISA: cache contents, TLB entries, branch predictor tables, prefetcher state, and buffers.

**Step 3: State the correctness rule for speculation.** When a prediction is wrong, the processor **discards** the speculative work by not retiring it through the ROB. Architectural state is left exactly as if the speculation never happened, so programs cannot observe it.

**Step 4: Identify the gap.** Squashing restores *architectural* state only. Effects on **microarchitectural** state — most importantly, lines brought into the cache — are **not** undone.

**Step 5: State the attack shape.** Cause the processor to speculatively perform an access it would never architecturally permit; the access is squashed, but it has already left a **cache footprint**. Then measure access timing to infer what was touched, converting microarchitectural residue into architectural knowledge.

**Step 6: State the general definition.** A **transient execution attack** exploits observable side effects of instructions that execute speculatively and are then discarded. The core discovery is that "discarded" was never "without trace."

---

## Q9. Give Meltdown's three steps, explain KPTI, and state its cost.

### Solution

**Step 1: State the design being exploited.** For performance, kernel memory was mapped into **every** process's address space at high addresses, protected only by the **U/S** page-table bit, so that syscalls needed no address-space switch.

**Step 2: Step one — speculative illegal read.** Userspace attempts to read a kernel address. The permission check will fail, but the load may proceed **speculatively** and return data before the fault retires.

**Step 3: Step two — encode into the cache.** The speculatively obtained byte is used as an **index** into an attacker-owned array, causing a specific line of that array to be cached. This transfers the secret's value into microarchitectural state.

**Step 4: Step three — retrieve by timing.** The fault is raised and the speculative work discarded, but the cached line persists. The attacker times access to each element of the array; the fast one reveals the index, hence the secret byte. Repeating recovers arbitrary kernel memory.

**Step 5: Identify precisely what failed.** The U/S bit was enforced **architecturally** — the read never retired — but not **microarchitecturally**, since the data reached the cache-timing channel first. A permission bit alone was insufficient.

**Step 6: State the mitigation — KPTI.** Kernel Page Table Isolation keeps **separate page tables** for user and kernel execution, unmapping almost all kernel memory while userspace runs. Speculation cannot leak what is not mapped, so the fix removes the mapping rather than relying on the bit.

**Step 7: State the cost.** Every syscall and interrupt now requires a **page-table switch** (a `CR3` reload) and consequent TLB pressure, making syscall-heavy workloads measurably slower. PCID tagging reduces but does not remove this.

---

## Q10. Contrast Spectre variants 1 and 2, and explain why Spectre is harder to fix than Meltdown.

### Solution

**Step 1: Variant 1 — Bounds Check Bypass (CVE-2017-5753).** A bounds check is speculatively bypassed: the branch predictor guesses the check passes, so the guarded access executes speculatively with an out-of-range index, reading memory the check would have forbidden. The value is then encoded into the cache as in Meltdown.

**Step 2: Variant 2 — Branch Target Injection (CVE-2017-5715).** The attacker **poisons the branch target predictor** so that an indirect branch in the victim speculatively jumps to an attacker-chosen **gadget** already present in the victim's code. The gadget speculatively accesses and leaks secrets.

**Step 3: State the shared mechanism.** Both use misprediction to execute instructions that architecturally never should, then recover the result through a microarchitectural channel.

**Step 4: State the crucial difference from Meltdown.** Meltdown crossed a **privilege boundary** by defeating a permission check, so unmapping kernel memory removed the target. Spectre stays **within** the victim's own permissions — the victim genuinely may read that memory, just not on that path. There is no permission bit being violated and nothing to unmap.

**Step 5: Explain the resulting difficulty.** Spectre exploits **branch prediction and speculation themselves**, which are foundational to performance across every high-performance CPU. Fixing it wholesale would mean abandoning speculation. It is also a property of correct programs, so it cannot be localised to a defective component.

**Step 6: Name the mitigations.** *Software:* `lfence`/speculation barriers at sensitive checks; array index masking; **retpolines** to avoid poisoned indirect predictors; compiler-inserted hardening. *Hardware:* IBRS/IBPB/STIBP to constrain predictor sharing, predictor flushing on domain change, and **speculation-safe microarchitectures** that isolate speculative state, delay committing side effects until retirement, or expose selective speculation controls.

**Step 7: State the trade-off.** Every such measure costs performance, since the mechanism being restricted is the one that makes modern CPUs fast. Mitigation is per-site and ongoing rather than a single structural fix — hence the "arms race" characterisation.

---

## Q11. Explain Rowhammer, its four attack stages, and why TRR was bypassed.

### Solution

**Step 1: State the physical cause.** DRAM cells are capacitors packed extremely densely. Repeatedly activating a row induces charge **disturbance** in physically adjacent rows, flipping bits without ever accessing those rows.

**Step 2: Name the abstraction failure.** Memory is presented as reliable addressable storage; the underlying analogue reality leaks through. A **leaky abstraction** — and note the security significance: the attacker writes only to memory it legitimately owns, yet modifies memory it does not.

**Step 3: Stage one — memory templating.** Profile the DIMM to locate cells susceptible to flipping and determine the physical row adjacency, since virtual and physical layouts differ.

**Step 4: Stage two — cache eviction.** Accesses must reach DRAM, not be absorbed by the cache. The attacker evicts the relevant lines (or uses non-temporal/uncached accesses) so each access genuinely activates a row.

**Step 5: Stage three — hammering.** Rapidly and repeatedly activate the **aggressor** rows flanking the **victim** row, many thousands of times within one refresh interval.

**Step 6: Stage four — disturbance error.** A bit in the victim row flips. If the attacker has arranged for security-critical data — a page-table entry, a permission field — to occupy that location, the flip yields privilege escalation.

**Step 7: Assess the early mitigations.** **ECC** corrects single-bit errors but is defeated by multi-bit flips within a word, and can even leak information through correction timing. **Increasing refresh rates** raises the bar but costs power and bandwidth without closing the window.

**Step 8: Explain TRR.** **Target Row Refresh** detects abnormally frequent activations, identifies the likely victim rows, and issues **targeted refreshes** to restore their charge before a flip occurs — transparently to software.

**Step 9: Explain the TRRespass bypass.** TRR implementations are **proprietary and resource-limited**: they can only track a small number of aggressor rows. By hammering **many** rows simultaneously — a "many-sided" pattern — the attacker exhausts the tracking capacity, so some genuine aggressors go unnoticed and flips occur anyway.

**Step 10: State the lesson.** A mitigation whose strength depends on **undisclosed, resource-bounded implementation details** is not a guarantee. Rowhammer remains an arms race across successive DDR standards, with no silver bullet, because the root cause is physical density rather than a logic error.

---

# Section C — Control-flow defences

## Q12. "The stack is just memory." Explain the consequence, then how ROP defeats W^X.

### Solution

**Step 1: State the observation.** The stack occupies ordinary writable memory. It holds locals and saved registers — **and return addresses**, which are control data.

**Step 2: State the consequence.** Control-flow data sits in a writable region alongside data buffers, with no architectural distinction between the two. A memory-safety bug in the data therefore becomes control over execution.

**Step 3: Recall the W^X defence.** Marking writable pages non-executable stops injected shellcode: bytes an attacker writes can never be executed.

**Step 4: State ROP's insight.** The attacker need not inject code. The process already contains abundant executable code. Short sequences ending in `ret` — **gadgets** — can be chained by writing a sequence of **addresses** to the stack.

**Step 5: Trace the mechanism.** Exploit the initial vulnerability to control the stack contents and hence the stack pointer's view; locate gadgets in the mapped code; craft a chain of gadget addresses interleaved with data; on each `ret`, the next address is popped and control flows to the next gadget. Chained together they perform arbitrary computation, typically ending in a syscall.

**Step 6: Explain why W^X is untouched.** Only **data** is written — the addresses on the stack. The bytes executed were already present and already executable. The invariant is never violated; it is simply irrelevant to this attack.

**Step 7: State the lesson.** W^X enforces a proxy (*do not execute attacker-supplied bytes*) for the real goal (*do not let the attacker choose what executes*). ROP satisfies the proxy while defeating the goal — which is why the answer must constrain **targets**, not page permissions.

---

## Q13. Compare Intel and ARM control-flow protections, mapping each to forward or backward edge.

### Solution

**Step 1: Define the edges.** **Backward edge** = returns (the `ret` target, i.e. the saved return address). **Forward edge** = indirect calls and jumps (function pointers, virtual dispatch, jump tables).

**Step 2: Tabulate.**

| Edge | Intel | ARM |
|---|---|---|
| Backward (returns) | **Shadow Stack (SS)** | **Pointer Authentication (PAC)** |
| Forward (indirect branches) | **Indirect Branch Tracking (IBT)** | **Branch Target Identification (BTI)** |

**Step 3: Explain Intel Shadow Stack.** A second, hardware-maintained stack holds a protected copy of return addresses, writable only by call/return machinery. On return, the two are compared; a mismatch faults. Because the shadow stack is inaccessible to ordinary stores, the overflow that corrupts the normal stack cannot corrupt it.

**Step 4: Explain ARM PAC's different approach to the same edge.** Rather than a separate copy, PAC **signs** the return address cryptographically, using a hardware key and a context value, and authenticates before use. Tampering is detected because the signature will not verify.

**Step 5: Note the design contrast.** Shadow Stack is **duplication** (keep a protected copy); PAC is **authentication** (make forgery detectable). Duplication costs memory and requires protecting the shadow region; authentication costs cryptographic operations and depends on key secrecy and context choice.

**Step 6: Explain IBT and BTI.** Both restrict indirect-branch targets to specially marked landing-pad instructions (`ENDBR64` on Intel, `BTI` on ARM). Both are **coarse-grained**: any valid landing pad is acceptable, not just the correct one for that call site, so they are weaker than fine-grained CFI while being far cheaper.

**Step 7: State the combined effect.** Backward-edge protection defeats classic ROP; forward-edge protection defeats JOP. Together they approximate CFI in hardware, and the residual attack surface is limited to targets within the permitted set plus **data-only** attacks that never divert control flow at all.

---

## Q14. State the lecture's architectural message about complexity and abstraction.

### Solution

**Step 1: State the abstraction point.** Each abstraction layer delivered real capability — segmentation gave relocation and protection, paging gave isolation and overcommit, speculation gave performance, DRAM density gave capacity. **The same abstractions also created the vulnerabilities**: Unreal Mode from cached descriptors, Meltdown from shared kernel mappings, Spectre from speculation, Rowhammer from density.

**Step 2: State the complexity point.** Each fix added complexity, which created new surface. Paging fixed segmentation's fragmentation and introduced page tables and TLBs. Speculation fixed pipeline stalls and introduced transient-execution attacks. KPTI fixed Meltdown and introduced syscall overhead. TRR fixed Rowhammer and introduced TRRespass.

**Step 3: State the leaky-abstraction generalisation.** Every abstraction eventually leaks, and the leak is where security fails — because the security argument was made at the abstraction level while the attack occurs at the implementation level.

**Step 4: Draw the practical conclusion.** Secure execution depends on **managing** this complexity rather than eliminating it: knowing which layer enforces which property, what happens when a layer's assumptions fail, and what state persists across transitions.

**Step 5: Note the product-selection warning.** Since mitigations like TRR are proprietary and vary in effectiveness between implementations, a feature checkbox is not a guarantee. Ask what threat model a mechanism was designed against and what its documented resource limits are — the concrete lesson from TRRespass.
