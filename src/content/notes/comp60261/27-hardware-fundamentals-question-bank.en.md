---
subject: COMP60261
chapter: 27
title: "Hardware Fundamentals — Question Bank"
language: en
---

# Hardware Fundamentals — Worked Question Bank

Companion to the Hardware Lecture 1 notes. Drills the von Neumann model and its consequences, the pointer-as-integer problem, the four-level memory-safety model, and the hardware defences: ARM PAC, BTI, MTE, and CHERI.

## Task types drilled

1. **Architectural reasoning** — derive a security consequence from a design choice.
2. **Historical mechanism** — explain an early technique and why it was needed.
3. **Metadata analysis** — identify what information is missing and what that permits.
4. **Defence classification** — place a mechanism in the four-level model.
5. **Probabilistic security arithmetic** — compute detection/evasion probabilities.
6. **Capability semantics** — apply provenance, bounds, monotonicity, permissions.
7. **Mechanism comparison** — contrast PAC, BTI, MTE, CHERI by guarantee strength.

---

# Section A — Foundations

## Q1. Why is the von Neumann model described as fundamentally insecure?

### Solution

**Step 1: State the model.** A single memory holding **both instructions and data**, addressed uniformly, with a CPU that fetches, decodes, and executes from it.

**Step 2: Identify the security consequence.** Because code and data share one address space and one representation, **data can become code**. Nothing intrinsic to the architecture distinguishes a byte destined for execution from a byte of input.

**Step 3: Connect to exploitation.** This is precisely what code injection relies on: write attacker-supplied bytes into a data region, then transfer control to them. The architecture offers no objection because the distinction does not exist at that level.

**Step 4: Note the second consequence.** Addresses are ordinary integers in the same memory, so **pointers are forgeable** — a computed value is indistinguishable from a legitimately derived one.

**Step 5: State what follows.** Every later defence in the lecture is an attempt to reintroduce a distinction the model omitted: W^X separates code from data by permission; PAC makes pointers unforgeable by signing; MTE and CHERI attach extent metadata. The "original sin" framing means the insecurity is inherited from the foundation, not introduced by careless programmers.

---

## Q2. Describe the fetch-decode-execute cycle and its link to processes.

### Solution

**Step 1: Fetch.** The control unit reads the instruction at the address in the program counter, then advances the PC.

**Step 2: Decode.** The instruction is interpreted — opcode identified, operands and addressing modes resolved, control signals generated.

**Step 3: Execute.** The operation is performed: an ALU computation, a memory access, or a control transfer that modifies the PC.

**Step 4: Link to processes.** A process is, at this level, a **PC value plus register state plus the memory it may address**. Context switching is saving one such set and restoring another, which is why the register file and page-table root together define "which process is running."

**Step 5: State the security relevance.** Because control flow is just the PC's value, **whoever controls the PC controls execution**. Every control-flow attack in the unit — stack smashing, ROP, JOP — reduces to writing an attacker-chosen value into the PC by some indirect route.

---

## Q3. Early machines had no pointers. Explain the workaround and why the B-line register mattered.

### Solution

**Step 1: State the constraint.** Early machines used **fixed physical addresses** encoded directly in the instruction. To access a different location, the instruction itself had to differ.

**Step 2: State the workaround — self-modifying code.** To iterate over a list, the program **rewrote its own instructions**, incrementing the encoded address field between iterations. The loop body literally edited itself.

**Step 3: Note why this was possible.** Only the von Neumann model permits it: instructions live in writable memory, so they are modifiable as data.

**Step 4: Explain the B-line register (index register).** It supplied an **effective address computed at runtime**: the address used becomes the instruction's encoded base **plus** the register's contents.

```
effective address = base address in instruction + B-register contents
```

**Step 5: State why it mattered.** Iteration now required changing only the register, not the code. This made programs **re-entrant and read-only in principle**, separated code from the addresses it operates on, and introduced the runtime-computed address — the direct ancestor of the pointer.

**Step 6: Note the legacy point.** Self-modifying code persisted anyway (COBOL's `ALTER` as a performance hack) long after it was necessary, and became technical debt: unreadable, unverifiable, and incompatible with W^X. A practice adopted for hardware reasons outlived the hardware.

---

# Section B — Pointers and memory safety

## Q4. "A pointer is just an integer." Explain what metadata is absent and what each absence permits.

### Solution

**Step 1: State the model.** Hardware formalised a pointer in the simplest possible way: an integer value naming a memory location. `0x4000` is a pointer exactly as `0x4000` is a number.

**Step 2: Enumerate the missing metadata.**

| Missing information | What its absence permits |
|---|---|
| **Bounds** (the extent of the object) | Buffer overflow — no basis for a check |
| **Validity/lifetime** | Use-after-free — a freed pointer looks identical to a live one |
| **Type** | Type confusion — reinterpretation of one object as another |
| **Provenance** (how it was derived) | Pointer forgery — an arbitrary integer becomes a usable pointer |

**Step 3: Explain why this is exploitable rather than merely inconvenient.** A check requires information to check *against*. Since the extent and validity of the target are simply not present in the pointer, no instruction can validate the access, and neither the compiler nor the hardware has grounds to object.

**Step 4: Connect to C.** C exposed the hardware model directly — "portable assembly." Pointer arithmetic is compile-time abstraction only: scaling by `sizeof` happens at compile time, and the runtime value is a bare integer with no residual type or bounds information.

**Step 5: State the consequence for defences.** Any real fix must **add metadata** — probabilistically (MTE tags) or architecturally (CHERI capabilities) — or make forgery detectable (PAC signatures). This is why the defences that follow all concern *what a pointer carries*.

---

## Q5. Explain the four-level memory-safety model, and place each defence.

### Solution

**Step 1: State the organising idea.** Defences sit above or below a **barrier** separating software approaches from hardware enforcement, and increase in strength.

**Step 2: Level 1 — testing and bug fixing (software).** Find and fix individual defects: code review, test suites, sanitizers, fuzzing. **Limitation:** finds bugs, never proves their absence; scales poorly against an enormous corpus.

**Step 3: Level 2 — memory-safe languages and verification (software).** Remove the class by construction (Rust, Java, Go) or prove its absence formally. **Limitation:** requires rewriting or re-engineering; the existing C/C++ corpus is vast, so migration is slow.

**Step 4: Level 3 — statistical hardware blocking.** Hardware detects violations with high probability but not certainty — **MTE** is the exemplar, using random tags. **Limitation:** probabilistic, so a determined attacker with many attempts may succeed.

**Step 5: Level 4 — deterministic hardware blocking.** Hardware makes the violation architecturally impossible — **CHERI** carries bounds and permissions in the pointer, so an out-of-bounds access cannot be expressed. **Limitation:** requires new hardware plus recompilation.

**Step 6: State the model's value.** It makes explicit that PAC and BTI are *control-flow* defences rather than memory-safety ones, that MTE and CHERI differ in kind rather than degree (probabilistic vs deterministic), and that software approaches remain necessary while hardware is undeployed.

---

## Q6. Explain the Heartbleed bounds-check condition, and compute the over-read.

### Solution

**Step 1: State the setting.** The TLS Heartbeat extension (RFC 6520) sends a payload with a **declared length**; the peer echoes back that many bytes. An echo service, in effect.

**Step 2: State the defect.** The implementation used the *declared* length to size the response without verifying the **actually received** payload was that long. Not a protocol flaw — a missing bounds check in the implementation.

**Step 3: State the correctness condition.** The check added by the patch is, in essence:

```
1 + 2 + declared_payload_length + 16  ≤  received_record_length
```

that is, the declared payload plus the type byte, the 2-byte length field, and the 16-byte padding must fit within what actually arrived. If it does not, discard the request silently.

**Step 4: Compute the over-read.** With a 1-byte actual payload and a declared length of 65535:

```
over-read ≈ declared_length − actual_payload_length
          = 65535 − 1
          = 65534 bytes  (~64 KB per request)
```

**Step 5: State the impact.** Whatever followed the payload buffer in the process's memory — session data, credentials, and in practice **private keys**. Repeatable indefinitely, sampling different memory as the process ran, and leaving **no distinctive log trace**, so exploitation was stealthy.

**Step 6: Generalise.** The class is *trusting a peer-supplied length*. The same shape recurs wherever a length accompanies data across a trust boundary, which is why the fix is structural: validate declared against received before any copy.

---

# Section C — Hardware defences

## Q7. Explain PAC: the signing and authentication operations, what it protects, and its two limitations.

### Solution

**Step 1: State the principle.** ARM **Pointer Authentication** attaches a **cryptographic signature (PAC)** to a pointer, stored in the pointer's unused upper bits, so that tampering is detectable.

**Step 2: Signing.** A PAC is computed over the pointer value, a **context/modifier** value (commonly the stack pointer), and a hardware **key** held in registers inaccessible to normal code; the result is inserted into the spare bits.

```
signed_pointer = pointer ⊕ PAC(pointer, context, key)   [conceptually]
```

**Step 3: Authentication.** Before use, the signature is recomputed and compared. On success the PAC bits are stripped, yielding the usable address. On failure the pointer is **poisoned** so that dereferencing it faults.

**Step 4: State what it protects.** Chiefly **return addresses** (backward-edge control flow) and function pointers. A stack overflow that overwrites a saved return address cannot produce a value with a valid signature, so the `ret` faults instead of transferring control — defeating ROP's core primitive.

**Step 5: Limitation 1 — pointer substitution/reuse.** A signature is valid for a (pointer, context, key) triple. An attacker who can **replay a legitimately signed pointer** into a different location where the same context applies bypasses the check without forging anything. Careful context selection narrows but does not eliminate this.

**Step 6: Limitation 2 — key leakage.** If a signing key is disclosed (through a side channel or a kernel bug), arbitrary pointers can be signed and the mechanism collapses entirely.

**Step 7: Note the scope.** PAC protects **pointer integrity**, not memory safety: the overflow that overwrote the pointer still occurred, and adjacent non-pointer data is unprotected.

---

## Q8. What is BTI, what threat does it address, and why is PAC insufficient alone?

### Solution

**Step 1: State the residual threat after PAC.** PAC secures the backward edge (returns). An attacker can still target the **forward edge**: indirect branches and calls through function pointers.

**Step 2: Define the attack — Jump-Oriented Programming.** JOP chains gadgets ending in **indirect branches** rather than `ret`, using a dispatcher to sequence them. Because it never relies on return addresses, PAC's return protection does not apply.

**Step 3: State BTI's mechanism.** ARM **Branch Target Identification** requires that the target of an indirect branch be a specially marked **`BTI` landing-pad instruction**. Branching indirectly to any other instruction raises a fault.

**Step 4: Explain why this blocks JOP.** JOP gadgets are mid-function instruction sequences, not marked entry points. Restricting indirect branches to legitimate landing pads removes the great majority of usable gadgets — the target set shrinks from "any byte" to "declared entry points."

**Step 5: State BTI's limitations.** It is **coarse-grained**: it permits branching to *any* valid landing pad, not only the correct one for that call site, so a gadget beginning at a legitimate entry point remains reachable. It is therefore weaker than fine-grained CFI.

**Step 6: State the combination.** PAC covers the backward edge, BTI the forward edge; together they approximate CFI in hardware. Note the Intel counterparts: **Shadow Stack** for the backward edge, **Indirect Branch Tracking** for the forward edge.

---

## Q9. Explain MTE, and compute the false-negative probability for 4-bit tags.

### Solution

**Step 1: State the principle.** ARM **Memory Tagging Extension** attaches a small random **tag** to both pointers and memory granules, and checks them on access.

**Step 2: Tagged pointers and tagged memory.** A tag (typically **4 bits**, so 16 values) is stored in the pointer's spare upper bits, and every memory **granule** (16 bytes) carries a tag held separately.

**Step 3: Allocation behaviour.** On allocation, a random tag is chosen, written to the granules covering the object, and embedded in the returned pointer. On free, the memory is **retagged** to a different value.

**Step 4: Access rule.** On every access the pointer's tag is compared with the accessed granule's tag; a mismatch faults.

```
access permitted  ⟺  tag(pointer) == tag(granule)
```

**Step 5: Spatial detection.** Overflowing into an adjacent object reaches granules tagged differently, so the mismatch is caught.

**Step 6: Temporal detection.** After free the granules are retagged, so a stale pointer holding the old tag mismatches — catching use-after-free.

**Step 7: Compute the false-negative probability.** Detection fails only if the wrongly accessed granule happens to carry the **same** tag. With 4-bit tags there are 2^4 = 16 values, so

```
P(missed detection) = 1/16 = 6.25%
P(detected)         = 15/16 = 93.75%
```

**Step 8: State the limitations.**
- **Probabilistic** — a ~1/16 miss chance per attempt, so repeated attempts erode the guarantee. This is why MTE is Level 3, not Level 4.
- **Granularity** — 16-byte granules mean overflows *within* a granule are undetectable.
- **Allocation-time aliasing** — an adjacent allocation may randomly receive the same tag.
- **Performance modes** — synchronous checking is precise but slower; asynchronous is faster but reports imprecisely, complicating diagnosis.

---

## Q10. State CHERI's capability semantics, and explain why they are deterministic where MTE is probabilistic.

### Solution

**Step 1: State the representation.** CHERI replaces integer pointers with **capabilities** — on the common design, **128 bits** of address plus compressed **bounds**, **permissions**, and an object type, together with a **1-bit tag** held out-of-band in the register file and in tagged memory.

**Step 2: Integrity and provenance validity.** A valid capability can only be derived from another valid capability, via permitted operations. The out-of-band tag is cleared by any attempt to fabricate one from ordinary data, so **forging a capability is impossible** rather than merely difficult.

**Step 3: Bounds.** Each capability carries the extent of the object it authorises. An access outside those bounds is rejected **by the hardware on every access**.

**Step 4: Monotonicity.** Capabilities may be **narrowed** (smaller bounds, fewer permissions) but never widened. Authority can therefore only decrease along a derivation chain — the mechanism behind the principle of least privilege.

**Step 5: Permissions.** Load, store, execute, and capability-load/store rights are carried explicitly, enabling W^X and finer policies per object rather than per page.

**Step 6: Explain the determinism.** MTE compares a **random tag** and so can coincide by chance (1/16). CHERI checks the **actual bounds** carried in the capability: an out-of-bounds access is not *probably* caught but **not expressible** — there is no capability authorising it, and none can be forged because of provenance and the tag bit. Hence Level 4, deterministic blocking.

**Step 7: Note the principle of intentional use.** Authority must be **named explicitly** through the capability used, not obtained ambiently — connecting directly to the capability-systems argument against confused deputies.

**Step 8: State the main cost.** Pointers double in size, with consequent memory and cache-footprint overhead, plus new hardware and recompilation. Reported porting effort on large codebases is a small percentage of lines changed, which is the counterweight to the cost.

---

## Q11. Explain CHERI compartmentalisation and the role of sentries.

### Solution

**Step 1: State the limitation being addressed.** Conventional CPUs make isolation expensive because it requires separate address spaces and MMU-mediated switches, so fine-grained compartmentalisation is impractical.

**Step 2: State CHERI's alternative.** Isolation derives from **reachability of capabilities**, not from address-space separation. Two compartments can share one virtual address space yet be isolated, because each holds only capabilities to its own memory.

**Step 3: Define the reachable set.** The set of capabilities obtainable by starting from those in registers and transitively following capabilities found in reachable memory. Anything outside that set is **architecturally unreachable** — not merely unmapped, but unnameable.

**Step 4: Note the dependency.** This requires memory safety as a prerequisite: without provenance and bounds, a compartment could fabricate a capability and the isolation argument collapses.

**Step 5: Define a sentry.** A **sealed entry capability** — a code capability sealed so it cannot be inspected or modified, usable only as the target of a controlled call instruction. It is the sole permitted entry point into a compartment.

**Step 6: Explain the transition.** Calling through a sentry unseals it atomically and transfers control to the designated entry point, installing that compartment's capabilities. The callee cannot be entered at an arbitrary offset, and the caller cannot extract the underlying capability. The boundary is thus enforced without an address-space switch.

**Step 7: State the performance benefit.** Because no page tables change and no TLB is flushed, crossings are far cheaper than process IPC — which is precisely what makes the fine granularity rejected as infeasible in Week 5 become plausible.

**Step 8: Give the deployment evidence.** Large codebases including **Chromium** have been ported with low modification rates; **CVE-2023-4863 (BLASTPASS)**, a heap buffer overflow in a widely embedded image-decoding library, is deterministically blocked under CHERI. **CHERIoT** extends the model to microcontrollers with area-neutral cost and formally verified components.
