---
subject: COMP60261
chapter: 22
title: "Week 2 — Question Bank"
language: en
---

# Week 2 — Memory Safety: Worked Question Bank

Drills stack layout reasoning, the spatial/temporal split, exploitation primitives, trust-boundary analysis, and the defence/bypass pairs.

## Task types drilled

1. **Layout reasoning** — deduce what an overflow reaches from frame structure.
2. **Violation classification** — spatial vs temporal, read vs write.
3. **Exploit-chain construction** — assemble primitives into a capability.
4. **Defence/bypass pairing** — name the specific counter to each mitigation.
5. **Trust-boundary identification** — locate the boundary and the validation obligation.
6. **Tool selection** — pick static vs dynamic analysis and justify.
7. **Vulnerability diagnosis from code** — identify class, impact, and fix.

---

# Section A — Recall and classification

## Q1. State the one layout fact that makes stack smashing possible, and derive the consequence.

### Solution

**Step 1: State the fact.** Within a single stack frame, local buffers and the saved **return address** coexist, with the return address at a **higher** address than the locals.

**Step 2: Add the growth direction.** The stack grows downward (toward lower addresses), but `memcpy`/`strcpy` write **upward** through increasing addresses.

**Step 3: Compose.** A write that starts in a local buffer and continues past its end therefore proceeds toward the saved frame pointer and the return address — both in the same frame.

**Step 4: Consequence.** A sufficiently long contiguous overflow overwrites the return address, so the `ret` instruction transfers control to an attacker-chosen value. No other flaw is needed.

---

## Q2. Classify each as spatial or temporal, and read or write.

(a) `strcpy` into an undersized buffer. (b) Dereferencing a pointer after `free`. (c) Returning the address of a local. (d) Echoing more bytes than were received. (e) Double free.

### Solution

| | Violation | Direction |
|---|---|---|
| (a) | Spatial (past bounds) | Write |
| (b) | Temporal (after lifetime) | Read or write |
| (c) | Temporal (frame is dead on return) | Read or write, via the caller |
| (d) | Spatial (reads past the object) | Read |
| (e) | Temporal (second free is outside the lifetime) | Write, via allocator metadata |

**Note on (c):** the pointer is valid at the moment of return but the *object* is destroyed, which is why this is temporal rather than spatial. **Note on (e):** the damage is to allocator bookkeeping rather than to program data directly, which is what makes it exploitable via subsequent allocations.

---

## Q3. Pair each defence with its specific bypass, and state the design lesson.

### Solution

**Step 1: Tabulate.**

| Defence | What it stops | Specific bypass |
|---|---|---|
| NX / DEP / W^X | Executing injected shellcode | **Code reuse** — ROP, return-to-libc |
| ASLR | Predicting addresses | **Infoleak**; low 32-bit entropy; non-PIE binaries at fixed addresses |
| Stack canaries | Contiguous overflow to the return address | **Non-contiguous / targeted write**; leaking the canary |
| CFI + shadow stack | ROP and JOP | Attacks within the permitted target set; data-only attacks |
| RELRO | GOT overwrite | Other writable function pointers |

**Step 2: State the lesson.** Each bypass is *specific* — a mitigation is defeated by moving to a different primitive, not by brute force. NX forced the move to code reuse; ASLR forced the move to infoleaks; canaries forced the move to non-sequential writes.

**Step 3: Give the correct conclusion.** Defence in depth is therefore about **multiplying required primitives**: each layer adds an independent thing that must go right for the attacker. It is not about any single layer being sound, and none of it substitutes for not having the bug.

---

## Q4. Why is an out-of-bounds *read* not a minor bug?

### Solution

**Step 1: Direct impact.** It discloses adjacent memory, which may include keys, tokens, or session data — a confidentiality failure in its own right.

**Step 2: Enabling impact.** Adjacent memory contains **pointers**. Leaking one pointer reveals the base address of a mapped region.

**Step 3: Compose with ASLR.** ASLR's entire security value is address unpredictability. One leaked pointer converts randomised layout into known layout, wholesale.

**Step 4: Compose with canaries.** A leak that captures the canary value lets an attacker rewrite it correctly during a subsequent overflow, defeating the check.

**Answer.** Because it is a force multiplier: it converts the two most widely deployed mitigations from obstacles into formalities.

---

# Section B — Applied and multi-step

## Q5. Explain the Heartbleed bug precisely, and identify the general class.

### Solution

**Step 1: State the protocol shape.** A heartbeat request carries a payload together with a **declared length** field, and the peer echoes back that many bytes.

**Step 2: State the missing check.** The implementation used the declared length to size the response **without verifying the actual received payload was that long**.

**Step 3: Trace the attack.** Send a 1-byte payload with a declared length near the maximum. The responder copies that many bytes starting from its payload buffer, so the response contains the payload plus everything that happens to follow it in memory.

**Step 4: Quantify and note repeatability.** Up to roughly 64 KB per request, and the request can be repeated indefinitely, sampling different memory as the process runs.

**Step 5: Note two aggravating properties.** It required no authentication, and it left no distinctive log entry, so exploitation was **stealthy**.

**Step 6: Classify.** A spatial, read-direction violation — a **buffer over-read** driven by an attacker-controlled length. Not a protocol design flaw: the specification was fine, the implementation omitted a bounds check.

**Answer.** The general class is *trusting a length field supplied by the peer*. The fix is to validate the declared length against the actually received size before use.

---

## Q6. A stack buffer overflow exists in a binary with NX, ASLR (PIE), and stack canaries enabled. Explain what the attacker needs.

### Solution

**Step 1: Defeat the canary.** A contiguous overflow to the return address must pass through the canary. So the attacker needs either an **infoleak** to read the canary value and rewrite it correctly, or a non-contiguous write primitive that skips it.

**Step 2: Defeat PIE/ASLR.** With the binary and libraries at randomised bases, no useful target address is known. The attacker needs an **infoleak of a code pointer** to compute the load base — for example a leaked return address or GOT entry, then subtract the known offset.

**Step 3: Defeat NX.** Injected shellcode cannot execute, so the payload must be **code reuse**: a ROP chain built from gadgets in the now-located binary or libc.

**Step 4: Assemble.** The chain is: infoleak → canary value and module base → craft ROP chain at correct absolute addresses → trigger the overflow → `ret` into the chain.

**Step 5: Draw the conclusion.** The overflow alone is insufficient; the attacker needs an **additional information-disclosure primitive**. This is precisely why Q4's point matters, and why the mitigations are valuable even though each is individually bypassable — they convert a one-bug exploit into a two-bug exploit.

---

## Q7. Identify the trust boundaries and the validation obligations.

```c
int main(int argc, char **argv) {
    char path[256];
    char *base = getenv("APP_HOME");
    sprintf(path, "%s/%s", base, argv[1]);
    FILE *f = fopen(path, "r");
    ...
}
```

### Solution

**Step 1: Boundary — `argc`/`argv`.** `argv[1]` is read without checking `argc > 1`. If invoked with no arguments, `argv[1]` is `NULL` and `sprintf`'s `%s` dereferences it. **Obligation:** check `argc` before indexing.

**Step 2: Boundary — environment.** `getenv` returns `NULL` if `APP_HOME` is unset, again dereferenced by `%s`. The variable's *content* is also fully attacker-controlled and of unbounded length. **Obligation:** check for `NULL` and treat the value as hostile.

**Step 3: Boundary — the formatting itself.** `sprintf` into a fixed 256-byte buffer with two unbounded inputs is an unconditional stack buffer overflow. **Obligation:** use `snprintf` with `sizeof path` and detect truncation.

**Step 4: Boundary — path semantics.** Even with lengths fixed, `argv[1]` may contain `../` sequences or an absolute path, escaping the intended directory. **Obligation:** canonicalise and verify the result stays under the intended root — a path-traversal check distinct from the memory-safety fixes.

**Step 5: Note the severity ordering.** The `sprintf` overflow is the most severe because it yields memory corruption; the traversal is next; the null dereferences are availability only.

**Answer.** Four boundaries, and note that two of them (environment content, path semantics) are invisible at the point of use — which is exactly why boundaries must be enumerated deliberately rather than spotted while reading code.

---

## Q8. Choose analysis techniques for (a) an unbounded `memcpy` on a rare error path, and (b) a use-after-free triggered by a specific message ordering. Justify.

### Solution

**Step 1: Characterise (a).** The defect is on a path that tests rarely execute, but it is visible in the code's structure — a size argument not derived from the destination's bounds.

**Step 2: Select for (a): static analysis.** It reasons over **all paths** regardless of execution, so rarely-taken branches are covered. Expect false positives requiring triage. Dynamic tools would miss it unless the error path is provoked.

**Step 3: Characterise (b).** The defect depends on runtime ordering and heap state — properties static analysis approximates poorly, since it must over-approximate aliasing and interleaving.

**Step 4: Select for (b): dynamic analysis, two tools.** **AddressSanitizer** to detect the use-after-free precisely at the moment of access (with quarantining so freed memory is not immediately reused), and **coverage-guided fuzzing** to discover the ordering that triggers it. Fuzzing supplies the input; ASan supplies the detection.

**Step 5: State the general principle.** Static gives breadth over paths with imprecision; dynamic gives precision on executed paths only. Structural defects → static. State- and ordering-dependent defects → dynamic. Neither proves absence of bugs.

---

# Section C — Extended / exam-style

## Q9. Contrast code injection with return-oriented programming, and explain what ROP demonstrates about mitigation design.

### Solution

**Step 1: Code injection.** The attacker supplies bytes that are machine code, places them in a writable region, and redirects control to them. Requires the target region to be **both writable and executable**.

**Step 2: How NX defeats it.** Enforcing W^X via the MMU's NX bit means no region is simultaneously writable and executable, so supplied bytes can never be executed as instructions.

**Step 3: ROP's insight.** The attacker need not supply code — the process already contains a great deal of executable code. Short sequences ending in `ret` ("gadgets") can be chained by writing a sequence of **addresses** onto the stack. Each `ret` pops the next gadget address, so control flows through the chain.

**Step 4: Why NX does not apply.** Only data is written (the addresses on the stack); the executed bytes were already present and already executable. The W^X invariant is never violated.

**Step 5: State the general lesson.** NX enforced a property (*do not execute attacker-supplied bytes*) that was a **proxy** for the real goal (*do not let the attacker choose what executes*). ROP satisfies the proxy while defeating the goal.

**Step 6: Note the correct response.** CFI addresses the actual goal by constraining transfer *targets*, with a shadow stack protecting return addresses specifically. That is why CFI, not NX, is the answer to ROP.

**Answer.** The lesson is that mitigations enforcing proxies for a security goal are bypassed by attacks that respect the proxy — so state the goal, then check the mechanism actually enforces it.

---

## Q10. Explain the trade-off C and C++ made, and why "just be careful" is not a coherent response.

### Solution

**Step 1: State the trade.** Bounds checking costs a comparison and a branch on every access, plus the space and maintenance of length metadata. C omits both, so array indexing compiles to arithmetic plus a load. The gain is performance and predictability; the cost is that no violation is detected.

**Step 2: Establish it was deliberate.** The omission is systematic, not localised: arrays decay to pointers, strings use an in-band terminator instead of a stored length, and `malloc` returns an address with no extent. A language that had merely overlooked bounds checking would still record sizes somewhere.

**Step 3: Show why exhortation fails.** "Be careful" asks developers to maintain, by hand and without tool support, an invariant the language deliberately declines to represent. The information needed (each object's extent, at each use site) is not present in the program text. At scale, manual maintenance of an unrepresented invariant fails with statistical certainty — which the vulnerability record confirms.

**Step 4: Enumerate coherent responses.**
- **Pay the cost elsewhere:** sanitizers, fuzzing, static analysis in CI.
- **Enforce in hardware:** MTE (probabilistic tagging), CHERI (bounds carried in the pointer).
- **Change language:** move new code to a memory-safe language.
- **Bound the impact:** compartmentalisation (Week 5), accepting that bugs will exist.

**Step 5: Note why all four persist.** The existing corpus is vast and in C, so migration is slow; hardware requires deployment; so mitigation and analysis remain necessary in the interim. This is why the unit covers all four rather than declaring a winner.

---

## Q11. Why is a trust boundary a design artefact rather than something discoverable by reading code?

### Solution

**Step 1: State what a boundary is.** A point where data passes from a less-trusted domain to a more-trusted one. It is defined by the **trust relationship**, which is a property of the design and threat model.

**Step 2: Show that code does not express it.** In C, `char *p` looks identical whether `p` points to a constant, to data from a local computation, or to a network buffer. Nothing in the type, the call syntax, or the calling convention records provenance or trust level.

**Step 3: Give the corroborating cases.** Environment variables arrive without any call at the point of use; inherited file descriptors arrive across `exec` with no syntax at all. Both are boundaries with no textual footprint.

**Step 4: Derive the consequence.** Because boundaries are invisible in code, they must be **enumerated from the threat model** and then checked against the code — not spotted while reading. Reviewing code without a model finds only the boundaries that happen to look suspicious.

**Step 5: Connect forward.** Week 5's compartment interface vulnerabilities are exactly this failure at a larger scale: splitting a program creates new boundaries, the code retains its old whole-program assumptions, and the compiler cannot object because the assumption was never written down.
