---
subject: COMP60261
chapter: 25
title: "Week 5 — Question Bank"
language: en
---

# Week 5 — Software Compartmentalisation: Worked Question Bank

Drills the key idea and trust models, compartment interface vulnerabilities, granularity and policy choice, abstraction design, and mechanism selection under performance constraints.

## Task types drilled

1. **Motivation reasoning** — justify compartmentalisation from a stated bug model.
2. **CIV identification** — find the interface vulnerability a split introduces.
3. **Granularity decision** — choose a boundary and defend the trade-off.
4. **Abstraction critique** — assess implicit vs explicit designs.
5. **Mechanism selection** — match enforcement to crossing frequency and threat.
6. **Property analysis** — determine which of C/I/A a design provides.
7. **Performance arithmetic** — estimate overhead from crossing counts.

---

# Section A — Recall and concepts

## Q1. State the assumption compartmentalisation attacks, and why it makes a font-parser bug catastrophic.

### Solution

**Step 1: Name the assumption.** A process is **one flat trust domain**: every line of code can reach every byte of the process's data and exercise all of its privileges.

**Step 2: Apply to the example.** A font parser and a TLS key handler linked into the same process share one address space and one privilege set. Nothing in the hardware or the language distinguishes them.

**Step 3: Draw the consequence.** A memory-safety bug in the font parser yields read/write access to the key material, because reachability is a property of the address space, not of the module's purpose.

**Step 4: State the mismatch.** A **peripheral** component with a **huge** blast radius. The component most likely to hold bugs — a C parser of untrusted input — has the same authority as the most sensitive one.

**Step 5: State the remedy in one line.** Least privilege applied *inside* the application: split into compartments, give each only what it needs, mediate all interaction.

---

## Q2. Is compartmentalisation prevention or mitigation? Why does the answer matter?

### Solution

**Step 1: Answer.** **Mitigation of impact**, not prevention of bugs. It removes no vulnerability; the parser still has its overflow.

**Step 2: State the underlying assumption.** It *assumes compromise will happen* and bounds the consequences.

**Step 3: Explain why the distinction matters — evaluation.** Success is measured by what an attacker gains after compromise, not by bug counts. A compartmentalised system with the same number of bugs may be far more secure, and metrics counting vulnerabilities will miss this entirely.

**Step 4: Explain why it matters — composition.** Because bugs remain, compartmentalisation must be combined with prevention (safe languages, sanitizers, fuzzing) rather than substituted for it.

**Step 5: Explain why it matters — the honest caveat.** Since the benefit is bounded blast radius, a badly placed boundary can deliver *no* benefit while adding complexity and a new attack surface — which is why a poor boundary can be worse than none.

---

## Q3. Name three deployed examples and identify each one's trust model shape.

### Solution

**Step 1: OpenSSH privilege separation.** A small privileged monitor plus an unprivileged, chrooted process handling network input. **Hierarchical** — the monitor is trusted, the network-facing worker is not.

**Step 2: Web browsers.** Per-site renderer processes, sandboxed and distrusted, plus a privileged broker mediating access to files, network, and devices. **Hierarchical**, with additional **mutual distrust between renderers** of different origins.

**Step 3: Mobile app sandboxes.** Each app confined with its own storage and permission set. **Mutual distrust among peers**, with the platform as supervisor.

**Step 4: State the general point.** Compartmentalisation is not speculative — the research question is not *whether* it works but how to obtain it **without hand-crafting every case**, which is why the automation and policy material exists.

---

# Section B — Applied and multi-step

## Q4. A JPEG decoder is moved into a separate process. The API is `int decode(char *in, size_t in_len, char *out, size_t out_len)`. Identify the CIVs.

### Solution

**Step 1: State the general cause.** The decoder was written assuming its caller was *itself* — same trust domain, so no validation. After the split the caller is untrusted, but the code was never updated. The compiler cannot object because the assumption was never written down.

**Step 2: CIV — pointers across the boundary.** `in` and `out` are addresses in the *caller's* space, meaningless or dangerous in the decoder's. Either they must be marshalled (copy the data, do not pass the pointer), or the decoder dereferences memory it does not own. Passing raw pointers also leaks layout information.

**Step 3: CIV — unvalidated lengths.** `in_len` and `out_len` are now attacker-controlled. If the decoder trusts `out_len` to size its writes, an inflated value causes an overflow in whatever region backs `out`. Both must be validated against the actual mapped extents.

**Step 4: CIV — shared-memory TOCTOU.** If `in` is shared memory rather than copied, the caller can **mutate the data after validation**. A decoder that checks a header then re-reads it operates on different bytes than it validated. Copy-then-validate is the fix.

**Step 5: CIV — return-value trust in the other direction.** The now-untrusted decoder returns a length or status the caller uses to size subsequent reads. Distrust is **mutual**: the caller must validate the decoder's outputs too. This is the direction people forget.

**Step 6: CIV — state confusion and resource exhaustion.** Calling `decode` out of order, re-entrantly, or with crafted input that makes it allocate unboundedly or loop forever. Availability is not provided by the split alone.

**Answer.** Six, spanning both directions. Note the pattern: every CIV is an assumption that was safe within one trust domain and is false across two.

---

## Q5. A team proposes per-function compartments for maximum security. Assess.

### Solution

**Step 1: Grant the intuition.** Finer compartments mean each holds less privilege, so any single compromise yields less.

**Step 2: State the first counter — interface multiplication.** Every boundary creates an interface, and interfaces are where CIVs live. Per-function granularity produces an enormous number of interfaces, each needing validation designed and reviewed. Empirically CIVs are **pervasive** and their count grows with interface count and complexity.

**Step 3: State the second counter — crossing overhead.** Cost is dominated by **crossing frequency × cost per crossing**. Function calls are the most frequent event in a program. Converting them into domain crossings multiplies the most common operation by the switch cost.

**Step 4: Quantify.** With process-based enforcement at roughly microseconds per crossing, a workload making 10^6 calls/second would spend on the order of seconds of overhead per second of work — plainly infeasible. Even MPK at tens of cycles imposes a large relative cost on a call that was a few cycles.

**Step 5: State the third counter — deployability as security.** A scheme too slow to deploy delivers **zero** security. Performance is not a separate engineering concern here; it determines whether any protection exists.

**Step 6: Give the recommendation.** Choose granularity by threat, not by minimality — typically **per-library isolation of untrusted parsers**. It targets the components most likely to hold exploitable bugs while keeping crossing counts and interface counts manageable. Place boundaries where crossings are **rare**, keeping hot paths inside a compartment.

**Answer.** Reject. Finer is not automatically better: it maximises exactly the two things that cause failure — interface count and crossing count.

---

## Q6. Contrast implicit and explicit compartment abstractions. Which for retrofitting a large C codebase, and what is the risk?

### Solution

**Step 1: Define.** **Explicit** abstractions make crossings visible in source (message send/receive, an annotated cross-domain call), so the developer sees a boundary. **Implicit** abstractions hide crossings so existing code compiles and runs unmodified.

**Step 2: State the adoption argument.** For a large existing codebase, implicit — usually CALL/RETURN-shaped — is dramatically cheaper: call sites keep their shape, so the diff is small and the change is tractable.

**Step 3: State the risk precisely.** A trust boundary hidden behind ordinary-looking call syntax. Developers do not validate, because nothing indicates validation is needed. This is the exact generative mechanism for CIVs from Q4, now made systematic by the abstraction's design.

**Step 4: Note the compounding factor.** Future maintainers, who never saw the compartmentalisation work, read plain function calls and reason about them as intra-domain calls. The security property silently decays with maintenance.

**Step 5: Give the mitigation.** Take implicit for adoption, then restore explicitness by other means: interface definition languages generating validated marshalling; static analysis flagging unvalidated flows across boundaries; naming and file-layout conventions making the boundary obvious; and dedicated fuzzing of each interface, treating it as the untrusted entry point it is.

**Answer.** Implicit for feasibility; the risk is invisible boundaries producing unvalidated interfaces, and the tooling must supply the visibility the abstraction removed.

---

## Q7. Choose a mechanism for (a) 10^7 crossings/second between two components in one address space, and (b) isolating a codec from a hostile-tenant perspective. Justify.

### Solution

**Step 1: Recall the cost spectrum.** MPK/PKU: tens of cycles, intra-address-space. SFI/WebAssembly: instrumentation overhead per access, no special hardware. Processes + MMU: microsecond-scale IPC. VMs: heaviest.

**Step 2: Handle (a).** At 10^7 crossings/second, process IPC at ~1 µs would consume ~10 seconds per second — impossible. **Intel MPK/PKU** is the correct choice: a domain switch is a cheap unprivileged register write with no address-space change.

**Step 3: State (a)'s security caveat.** Because the switch instruction is **unprivileged**, a compromised compartment can potentially just rewrite the protection-key register. MPK is only sound if the compartment's code is additionally constrained (verified or instrumented to contain no arbitrary `WRPKRU`), so it must be combined with control-flow restriction. Also, the number of keys is limited.

**Step 4: Handle (b).** "Hostile tenant" demands a strong boundary and tolerates cost. **Processes + MMU** at minimum; a **VM or micro-VM** if the threat model includes kernel-level attack from the tenant, since the container/process boundary is the whole syscall interface.

**Step 5: State the selection rule.** Pick the cheapest mechanism whose **trust model matches the threat** and whose crossing cost the workload's crossing frequency can absorb. Compute the product before choosing.

**Step 6: Add the mechanism-TCB question.** For any choice, ask what is in the mechanism's own TCB — MMU and kernel, a language runtime, an instrumenting compiler — and whether a compromised compartment can escape by attacking the mechanism itself.

---

# Section C — Extended / exam-style

## Q8. "Compartmentalisation eliminates the risk from untrusted libraries." Assess.

### Solution

**Step 1: Identify the true kernel.** It genuinely bounds what a library compromise yields — the central benefit, and the reason for OpenSSH and browser architectures.

**Step 2: Reject "eliminates" — risk relocation.** Splitting does not remove risk; it **moves it to the interface**. The library's overflow still exists; what changes is what the attacker reaches next, and that is governed by interface quality. Studies retrofitting real software find CIVs pervasive, and fuzzing newly exposed APIs finds many crashes — code exposed at a new boundary was never written to withstand hostile input on it.

**Step 3: Note the possibility of net loss.** A poorly designed boundary adds complexity, adds a new attack surface, and supplies false confidence. It can be **worse than no boundary**.

**Step 4: Note the property gap.** Even a good boundary typically provides confidentiality and integrity but **not availability**. A compromised compartment can loop, exhaust memory, or wedge, unless timeouts, resource limits, and kill-and-restart are separately engineered.

**Step 5: Note residual channels.** Shared caches, timing, and any deliberately shared memory remain. Isolation of *named* memory is not isolation of *all* signal.

**Step 6: State the defensible version.** Compartmentalisation *bounds* the impact of an untrusted library **conditional on** a small, simple, validated interface, and provides no availability guarantee by itself. Interface safety means: minimise what crosses, prefer self-contained serialisable data over pointers, **copy rather than share** so validated data cannot change, validate exhaustively on the receiving side, and keep the interface narrow enough to review and fuzz in full.

---

## Q9. Why does automating compartmentalisation remain hard, and what must a human still supply?

### Solution

**Step 1: State the goal.** Derive the decomposition from analysis of existing code with minimal developer input, since manual work does not scale to large codebases or hundreds of dependencies.

**Step 2: Identify the core difficulty.** Automation must infer **semantics** — what is sensitive, what must be shared, what a safe interface looks like — from code that **never recorded** any of it. C has no notation for "this holds secrets" or "this data is untrusted."

**Step 3: State the failure modes.** Tools tend to produce either over-permissive boundaries (little security gain, since everything important still crosses) or over-restrictive ones (the program breaks, because a genuinely needed flow was cut).

**Step 4: Give the analysis limits.** **Static** analysis (call graphs, points-to, information flow) **over-approximates** — it must assume aliasing and flows that may never occur, yielding permissive policies. **Dynamic** analysis (profiling real runs) **under-approximates** — it sees only executed paths, so a derived policy may break on an unexercised path in production.

**Step 5: State what automation genuinely delivers.** Proposing candidate boundaries, estimating crossing overhead, and identifying which data actually crosses — all valuable and all mechanical.

**Step 6: State the irreducible human contribution.** The **security judgement**: what is worth protecting, from whom, and what residual risk is acceptable. That is a threat model, and no analysis of the code can produce it, because the code does not contain it. Related: the policy language should be **generic** across languages and mechanisms (PL genericity) so the human's judgement outlives both.

---

## Q10. A design places each of three untrusted parsers in its own compartment, sharing a large input buffer for performance. Critique.

### Solution

**Step 1: Credit the policy.** Per-library isolation of untrusted parsers is the pragmatic sweet spot — it targets likely-buggy components at manageable crossing counts.

**Step 2: Attack the sharing decision — TOCTOU.** A shared buffer lets a compromised parser **mutate data after another compartment has validated it**. Any check performed on shared memory is void the instant it completes. This is the boundary-level analogue of the classic time-of-check/time-of-use race.

**Step 3: Note the second consequence — cross-compartment reachability.** If all three parsers share one buffer, a compromise of one gives read access to whatever the others placed there. The compartments are no longer mutually isolated for confidentiality with respect to that region, undermining the point of separating them.

**Step 4: Note the third — the region becomes an implicit interface.** Shared memory is a channel with no function signature, so it receives none of the validation discipline applied to explicit calls. It is precisely the kind of implicit boundary that generates CIVs.

**Step 5: Give the fix hierarchy.**
- Best: **copy** input into each compartment's private memory, then validate the copy. Cost is proportional to data size, paid once.
- If copying is genuinely too expensive: give each parser a **separate** region, never shared between parsers, and make it **read-only** to the recipient after the producer finishes — so the producer cannot mutate post-validation.
- Either way, **batch** to amortise crossing cost rather than sharing to avoid it.

**Step 6: State the principle.** Performance pressure pushes toward sharing, and sharing is where compartment guarantees break. Resolve it by reducing crossing **frequency** (batching, boundary placement on cold paths), not by widening what is shared.
