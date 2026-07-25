---
subject: COMP60261
chapter: 17
title: "Hardware Fundamentals — Flashcards"
language: en
---

# Hardware Fundamentals — Flashcards

40 flashcards. Click each question to reveal the answer.

**Anki:** [Download this deck as `.apkg`](/anki/comp60261/17-hardware-fundamentals-flashcards.apkg) — import into Anki via *File → Import*.

<details>
<summary><strong>Q1.</strong> Why is the von Neumann model called &quot;fundamentally insecure&quot;?</summary>

A single memory holds <b>both instructions and data</b>, addressed uniformly.<br>So <b>data can become code</b> (code injection), and addresses are ordinary integers in that same memory, so <b>pointers are forgeable</b>.

</details>

<details>
<summary><strong>Q2.</strong> What are the three phases of the instruction cycle?</summary>

<b>Fetch</b> — read the instruction at the PC, advance the PC.<br><b>Decode</b> — identify opcode, resolve operands and addressing modes.<br><b>Execute</b> — perform the operation, possibly modifying the PC.

</details>

<details>
<summary><strong>Q3.</strong> How does the instruction cycle relate to a process?</summary>

A process is a <b>PC value + register state + addressable memory</b>. Context switching saves one such set and restores another.<br>Security consequence: whoever controls the PC controls execution — every control-flow attack reduces to writing an attacker-chosen PC value.

</details>

<details>
<summary><strong>Q4.</strong> Why did early machines need self-modifying code?</summary>

Addresses were <b>fixed constants encoded in the instruction</b>. To access a different location the instruction itself had to change.<br>To loop over a list, the program rewrote its own address fields — possible only because von Neumann puts instructions in writable memory.

</details>

<details>
<summary><strong>Q5.</strong> What did the Manchester B-line register do, and give the formula.</summary>

It supplied a <b>runtime-computed effective address</b> — an index register.<br><code>effective address = base address in instruction + B-register contents</code><br>Iteration now changed a register, not the code.

</details>

<details>
<summary><strong>Q6.</strong> Why did the B-line register matter historically?</summary>

It made code <b>re-entrant and read-only in principle</b>, separated code from the addresses it operates on, and introduced the runtime-computed address — the <b>direct ancestor of the pointer</b>.

</details>

<details>
<summary><strong>Q7.</strong> What is the technical-debt lesson from COBOL's <code>ALTER</code>?</summary>

Self-modifying code persisted as a performance hack long after index registers made it unnecessary.<br>It became unreadable, unverifiable, and incompatible with W^X — a practice adopted for hardware reasons outliving the hardware.

</details>

<details>
<summary><strong>Q8.</strong> In the hardware model, what exactly is a pointer?</summary>

Just an <b>integer</b> naming a memory location. <code>0x4000</code> is a pointer exactly as <code>0x4000</code> is a number.<br>C exposed this directly as &quot;portable assembly&quot;; pointer arithmetic scaling by <code>sizeof</code> is <b>compile-time only</b>, leaving a bare integer at runtime.

</details>

<details>
<summary><strong>Q9.</strong> Name the four kinds of metadata a bare pointer lacks, and what each absence permits.</summary>

<b>Bounds</b> → buffer overflow.<br><b>Validity/lifetime</b> → use-after-free.<br><b>Type</b> → type confusion.<br><b>Provenance</b> → pointer forgery.

</details>

<details>
<summary><strong>Q10.</strong> Why does missing metadata make bugs <i>exploitable</i> rather than merely inconvenient?</summary>

A check needs information to check <b>against</b>. Since extent and validity are simply not present in the pointer, <b>no instruction can validate the access</b> — neither compiler nor hardware has grounds to object.

</details>

<details>
<summary><strong>Q11.</strong> State the four levels of the memory-safety model.</summary>

<b>L1</b> testing and bug fixing (software).<br><b>L2</b> memory-safe languages and verification (software).<br><b>L3</b> <b>statistical</b> hardware blocking — MTE.<br><b>L4</b> <b>deterministic</b> hardware blocking — CHERI.<br>A barrier separates software approaches (L1-2) from hardware enforcement (L3-4).

</details>

<details>
<summary><strong>Q12.</strong> Why are L3 and L4 different in kind, not just degree?</summary>

L3 detects violations with high <b>probability</b> (MTE's random tags can coincide).<br>L4 makes the violation <b>architecturally inexpressible</b> — CHERI carries real bounds, so no capability authorises the access and none can be forged.

</details>

<details>
<summary><strong>Q13.</strong> What was the actual cause of Heartbleed?</summary>

The TLS Heartbeat extension echoes a payload of a peer-<b>declared</b> length. The implementation used that declared length to size the response <b>without checking the payload was really that long</b>.<br>Not a protocol flaw — a missing bounds check.

</details>

<details>
<summary><strong>Q14.</strong> Give Heartbleed's bounds-check condition and the over-read size.</summary>

Patch condition, in essence:<br><code>1 + 2 + declared_payload_length + 16 ≤ received_record_length</code><br>With a 1-byte payload and declared length 65535:<br><code>65535 − 1 = 65534 bytes ≈ 64 KB</code> per request, repeatable.

</details>

<details>
<summary><strong>Q15.</strong> Why was Heartbleed catastrophic beyond the leak size?</summary>

It needed <b>no authentication</b>, was repeatable indefinitely (sampling different memory each time), leaked <b>private keys</b> in practice, and left <b>no distinctive log trace</b> — so exploitation was stealthy.

</details>

<details>
<summary><strong>Q16.</strong> Distinguish ISA from microarchitecture.</summary>

<b>ISA:</b> the architectural contract — instructions, registers, addressing modes, privilege model. What software may rely on.<br><b>Microarchitecture:</b> how a particular chip implements it — pipeline depth, caches, predictors. Not named by the ISA.

</details>

<details>
<summary><strong>Q17.</strong> What is ARM PAC's core principle?</summary>

Attach a <b>cryptographic signature</b> to a pointer, stored in its unused upper bits, so tampering is <b>detectable</b>.

</details>

<details>
<summary><strong>Q18.</strong> Describe PAC's signing and authentication operations.</summary>

<b>Sign:</b> compute a PAC over the pointer value, a <b>context/modifier</b> (often the stack pointer), and a hardware <b>key</b> inaccessible to normal code; insert into spare bits.<br><b>Authenticate:</b> recompute and compare; on success strip the PAC to yield the address, on failure <b>poison</b> the pointer so dereference faults.

</details>

<details>
<summary><strong>Q19.</strong> What does PAC primarily protect, and against which attack?</summary>

<b>Return addresses</b> (backward-edge control flow) and function pointers.<br>An overflow overwriting a saved return address cannot produce a valid signature, so <code>ret</code> faults — defeating ROP's core primitive.

</details>

<details>
<summary><strong>Q20.</strong> Give PAC's two limitations.</summary>

<b>Pointer substitution/reuse:</b> a legitimately signed pointer replayed where the same context applies passes authentication — no forgery needed.<br><b>Key leakage:</b> if a signing key is disclosed, arbitrary pointers can be signed and the mechanism collapses.

</details>

<details>
<summary><strong>Q21.</strong> Why does PAC not give memory safety?</summary>

It protects <b>pointer integrity</b> only. The overflow that overwrote the pointer still happened, and adjacent non-pointer data is unprotected.

</details>

<details>
<summary><strong>Q22.</strong> What threat does BTI address that PAC does not?</summary>

<b>Jump-Oriented Programming.</b> JOP chains gadgets ending in <b>indirect branches</b> rather than <code>ret</code>, using a dispatcher — so PAC's return protection never applies. BTI covers the <b>forward edge</b>.

</details>

<details>
<summary><strong>Q23.</strong> How does BTI work, and what is its limitation?</summary>

Indirect branch targets must be a marked <b>BTI landing-pad instruction</b>; branching indirectly elsewhere faults. Gadgets are mid-function sequences, so most become unreachable.<br><b>Limitation:</b> <b>coarse-grained</b> — any valid landing pad is accepted, not just the correct one for that call site.

</details>

<details>
<summary><strong>Q24.</strong> What is MTE's core principle and access rule?</summary>

Attach a small random <b>tag</b> to both pointers and memory granules and compare on access.<br><code>access permitted ⟺ tag(pointer) == tag(granule)</code>

</details>

<details>
<summary><strong>Q25.</strong> What are MTE's tag size and granule size?</summary>

Typically <b>4-bit tags</b> (16 values) stored in the pointer's spare upper bits, over <b>16-byte granules</b> of memory whose tags are held separately.

</details>

<details>
<summary><strong>Q26.</strong> How does MTE catch spatial and temporal violations?</summary>

<b>Spatial:</b> overflowing into an adjacent object reaches differently-tagged granules → mismatch.<br><b>Temporal:</b> memory is <b>retagged on free</b>, so a stale pointer holds the old tag → mismatch. Catches use-after-free.

</details>

<details>
<summary><strong>Q27.</strong> Compute MTE's false-negative probability for 4-bit tags.</summary>

Detection fails only if the wrongly accessed granule happens to carry the same tag:<br><code>P(missed) = 1/2⁴ = 1/16 = 6.25%</code><br><code>P(detected) = 15/16 = 93.75%</code>

</details>

<details>
<summary><strong>Q28.</strong> Give MTE's four limitations.</summary>

<b>Probabilistic</b> (~1/16 miss, eroded by repeated attempts — hence L3 not L4).<br><b>Granularity</b> — overflows <i>within</i> a 16-byte granule are invisible.<br><b>Allocation-time aliasing</b> — an adjacent allocation may randomly get the same tag.<br><b>Performance modes</b> — synchronous is precise but slower, asynchronous faster but imprecise.

</details>

<details>
<summary><strong>Q29.</strong> What does CHERI stand for, and what does it replace?</summary>

<b>Capability Hardware Enhanced RISC Instructions.</b><br>It replaces integer pointers with <b>capabilities</b>: address + compressed bounds + permissions + object type, plus a <b>1-bit tag</b> held out-of-band in registers and tagged memory.

</details>

<details>
<summary><strong>Q30.</strong> What is CHERI's provenance validity property?</summary>

A valid capability can only be <b>derived from another valid capability</b> via permitted operations. Any attempt to fabricate one from ordinary data <b>clears the out-of-band tag</b>.<br>So forging a capability is <b>impossible</b>, not merely difficult.

</details>

<details>
<summary><strong>Q31.</strong> State CHERI's monotonicity property and why it matters.</summary>

Capabilities may be <b>narrowed</b> (smaller bounds, fewer permissions) but <b>never widened</b>.<br>Authority can only decrease along a derivation chain — the mechanism behind least privilege.

</details>

<details>
<summary><strong>Q32.</strong> What are CHERI's principles of intentional use and least privilege?</summary>

<b>Intentional use:</b> authority must be <b>named explicitly</b> through the capability used, never obtained ambiently.<br><b>Least privilege:</b> each capability conveys only the bounds and permissions actually needed.

</details>

<details>
<summary><strong>Q33.</strong> Why is CHERI deterministic where MTE is probabilistic?</summary>

MTE compares a <b>random tag</b>, which can coincide (1/16). CHERI checks the <b>actual bounds carried in the capability</b> — an out-of-bounds access is not <i>probably caught</i> but <b>not expressible</b>, since no capability authorises it and none can be forged.

</details>

<details>
<summary><strong>Q34.</strong> What is a CHERI reachable set, and what does it require?</summary>

The capabilities obtainable from those in registers by transitively following capabilities in reachable memory. Anything outside it is <b>architecturally unnameable</b>, not merely unmapped.<br>Requires <b>memory safety as a prerequisite</b> — without provenance and bounds, a compartment could fabricate a capability.

</details>

<details>
<summary><strong>Q35.</strong> What is a sentry in CHERI?</summary>

A <b>sealed entry capability</b> — a code capability sealed so it cannot be inspected or modified, usable only as the target of a controlled call.<br>It is the <b>sole permitted entry point</b> into a compartment.

</details>

<details>
<summary><strong>Q36.</strong> How does a sentry transition work, and why is it fast?</summary>

The call unseals it atomically, transfers control to the designated entry point, and installs that compartment's capabilities. The callee cannot be entered at an arbitrary offset; the caller cannot extract the capability.<br><b>Fast because no page tables change and no TLB flush occurs</b> — far cheaper than process IPC.

</details>

<details>
<summary><strong>Q37.</strong> Why does CHERI make fine-grained compartmentalisation plausible?</summary>

Isolation comes from <b>capability reachability, not address-space separation</b>, so two compartments share one virtual address space yet stay isolated.<br>Cheap crossings make the granularity that is infeasible with processes practical.

</details>

<details>
<summary><strong>Q38.</strong> What is CHERI's main cost, and the counterweight?</summary>

<b>Cost:</b> pointers double in size (memory and cache footprint), plus new hardware and recompilation.<br><b>Counterweight:</b> reported porting effort on large codebases — including <b>Chromium</b> — is a small percentage of lines changed.

</details>

<details>
<summary><strong>Q39.</strong> What does CVE-2023-4863 (BLASTPASS) demonstrate?</summary>

A heap buffer overflow in a widely embedded image-decoding library — hard to find, broadly deployed.<br>It is <b>deterministically blocked under CHERI</b>, illustrating L4 protection against a real, high-impact bug class.

</details>

<details>
<summary><strong>Q40.</strong> What is CHERIoT?</summary>

CHERI for <b>microcontrollers</b>: area-neutral microarchitecture, protection regions and compartments, <b>use-after-free temporal safety</b>, and formally verified components.<br>Limitation: scalability to larger systems.

</details>
