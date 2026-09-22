---
subject: COMP60261
chapter: 15
title: "Week 5 — Flashcards"
language: en
---

# Week 5 — Software Compartmentalisation — Flashcards

41 flashcards. Click each question to reveal the answer.

**Anki:** [Download this deck as `.apkg`](/anki/comp60261/15-week-5-flashcards.apkg) — import into Anki via *File → Import*.

<details>
<summary><strong>Q1.</strong> What assumption does compartmentalisation attack?</summary>

That a process is <b>one flat trust domain</b> — every line of code can reach every byte of data and exercise all the process's privileges, so a single bug compromises everything.

</details>

<details>
<summary><strong>Q2.</strong> Define compartmentalisation.</summary>

Splitting a program into isolated, mutually distrusting <b>compartments</b>, each with only the memory and privileges it needs, with all interaction mediated.<br>It is <b>least privilege applied inside an application</b>.

</details>

<details>
<summary><strong>Q3.</strong> Is compartmentalisation prevention or mitigation?</summary>

<b>Mitigation of impact</b>, not prevention of bugs.<br>It assumes compromise will happen and bounds the consequences.

</details>

<details>
<summary><strong>Q4.</strong> Give the motivating mismatch with linked libraries.</summary>

Applications link image decoders, XML/font parsers, compression and crypto — untrusted-input parsers in C, historically where the bugs are.<br>Yet a font-parser bug can steal crypto keys, because both share one address space and privilege set. Huge blast radius from a peripheral component.

</details>

<details>
<summary><strong>Q5.</strong> Name real deployed examples of compartmentalisation.</summary>

OpenSSH privilege separation (small privileged monitor + unprivileged chrooted network-facing process); web browsers (per-site renderer processes distrusted by a privileged broker); qmail/Postfix; mobile app sandboxes.

</details>

<details>
<summary><strong>Q6.</strong> What security properties does compartmentalisation aim to give, and which is hardest?</summary>

Confidentiality (cannot read another's data), integrity (cannot modify it), availability (cannot prevent progress).<br><b>Availability is hardest and often simply not provided</b> — a compartment can loop or exhaust memory unless resources are separately controlled.

</details>

<details>
<summary><strong>Q7.</strong> Name the three compartment trust-model shapes.</summary>

<b>Hierarchical</b> — trusted supervisor plus untrusted workers (OpenSSH, browsers).<br><b>Mutual distrust among peers</b> — each validates everything received.<br><b>Partial trust</b> — a lattice reflecting sensitivity.

</details>

<details>
<summary><strong>Q8.</strong> Why must the trust model be stated explicitly?</summary>

Interface obligations follow directly from it: if A distrusts B, A must validate everything crossing from B.<br>That is exactly where compartmentalisation tends to go wrong.

</details>

<details>
<summary><strong>Q9.</strong> Why is retrofitting harder than designing for compartmentalisation?</summary>

Existing code shares state freely, uses pointers across would-be boundaries, and has <b>no notion of who owns what</b>.<br>Designing from the start lets the decomposition inform the architecture.

</details>

<details>
<summary><strong>Q10.</strong> Manual compartmentalisation: pros and cons?</summary>

<b>Pros:</b> the developer understands the semantics, so boundaries land where they are meaningful.<br><b>Cons:</b> laborious, error-prone, invasive; does not scale to large codebases or hundreds of dependencies. Every boundary is a new chance to introduce a validation bug.

</details>

<details>
<summary><strong>Q11.</strong> What does a first manual attempt typically miss?</summary>

Which data genuinely must cross; what the privileged side must validate; how failure is handled; and how to stop a chatty interface destroying performance.

</details>

<details>
<summary><strong>Q12.</strong> What do framework-assisted and automated approaches each offer?</summary>

<b>Framework-assisted:</b> supplies plumbing (compartment creation, marshalling, sharing); developer declares boundaries. Less boilerplate, but abstractions constrain what is expressible.<br><b>Automated:</b> derives the decomposition from analysis — the research frontier.

</details>

<details>
<summary><strong>Q13.</strong> Why is automated compartmentalisation hard?</summary>

It must infer <b>semantics</b> — what is sensitive, what must be shared, what a safe interface is — from code that never recorded it.<br>Tools tend to produce either over-permissive boundaries (no security gain) or over-restrictive ones (broken programs).

</details>

<details>
<summary><strong>Q14.</strong> What is a Compartment Interface Vulnerability (CIV)?</summary>

A vulnerability arising specifically at a compartment boundary, where code written under whole-program assumptions now receives data from an <b>untrusted</b> compartment.

</details>

<details>
<summary><strong>Q15.</strong> What is the root cause of CIVs, and why can't the compiler catch them?</summary>

The code was written assuming the caller was itself — same trust domain, so no validation needed. After splitting, the caller is untrusted but the code was never updated.<br>The compiler cannot notice because <b>the assumption was never written down</b>.

</details>

<details>
<summary><strong>Q16.</strong> List the recurring CIV patterns.</summary>

Unvalidated pointers/indices/lengths accepted at face value; pointers into the other compartment's memory; shared memory mutated after validation (a boundary TOCTOU); confused deputy inside one application; API misuse and state confusion; and error handling / resource exhaustion across the boundary.

</details>

<details>
<summary><strong>Q17.</strong> What do empirical studies of retrofitted compartmentalisation find?</summary>

CIVs are <b>pervasive</b>, and the count grows with interface size and complexity.<br>Fuzzing unprotected APIs finds many crashes — code newly exposed at a boundary was never written to withstand hostile input on it.

</details>

<details>
<summary><strong>Q18.</strong> State the three key takeaways about interfaces.</summary>

Compartmentalisation <b>relocates</b> risk to the interface rather than eliminating it.<br>Interfaces must be small and simple.<br>A poorly designed boundary can be <b>worse than none</b> — it adds complexity and false confidence.

</details>

<details>
<summary><strong>Q19.</strong> What makes a compartment boundary safe?</summary>

Minimise what crosses; use self-contained serialisable data rather than pointers; <b>copy rather than share</b> so data cannot change after checking; validate exhaustively on the receiving side; keep it narrow enough to review and fuzz in full.

</details>

<details>
<summary><strong>Q20.</strong> What does a compartmentalisation policy specify?</summary>

The decomposition — which code and data go in which compartment, and what may cross.

</details>

<details>
<summary><strong>Q21.</strong> Explain the granularity trade-off.</summary>

Coarse (subsystem/process): weaker isolation, low overhead. Fine (function/object): strong isolation, many crossings and high overhead.<br>Finer means less privilege each but <b>more interfaces, more CIVs, more overhead</b> — so finer is <b>not</b> automatically better.

</details>

<details>
<summary><strong>Q22.</strong> What is a defensible default policy, and why?</summary>

<b>Per-library isolation of untrusted parsers</b> — each risky library in its own compartment, the rest of the application in another.<br>It targets the components most likely to hold exploitable bugs while keeping crossing counts manageable.

</details>

<details>
<summary><strong>Q23.</strong> Name the compartment selection methods.</summary>

By data sensitivity; by exposure to untrusted input; by privilege required; by provenance (third-party dependencies); and profiling-guided, to keep hot paths inside one compartment.

</details>

<details>
<summary><strong>Q24.</strong> What is PL genericity, and why is it desirable?</summary>

A policy language and tooling not tied to one programming language or one enforcement mechanism.<br>So a policy can <b>outlive both</b>. Separate declarative policy files also keep policy reviewable independently of code.

</details>

<details>
<summary><strong>Q25.</strong> Contrast static and dynamic analysis for deriving policies.</summary>

<b>Static</b> (call graphs, points-to, information flow) <b>over-approximates</b> — risks over-permissive policies.<br><b>Dynamic</b> (profiling real runs) <b>under-approximates</b> — risks breaking on unexercised paths.

</details>

<details>
<summary><strong>Q26.</strong> What can automation not decide about policy?</summary>

The <b>security judgement</b> of what is worth protecting from what — that needs a human with a threat model.<br>Automation can propose boundaries, estimate overhead, and identify data that must cross.

</details>

<details>
<summary><strong>Q27.</strong> What is a compartmentalisation abstraction?</summary>

The programming model for compartments and their interaction — sitting between <b>policy</b> (what to separate) and <b>mechanism</b> (how it is enforced).

</details>

<details>
<summary><strong>Q28.</strong> Name the main abstraction categories.</summary>

<b>CALL/RETURN</b> — crossings look like function calls.<br><b>Message passing</b> — explicit send/receive.<br><b>Shared memory</b> — designated shared regions.<br><b>Object/reference</b> — capability-style handles.

</details>

<details>
<summary><strong>Q29.</strong> What is the danger of CALL/RETURN abstractions?</summary>

They look <b>too familiar</b> — a trust boundary hidden behind ordinary-looking call syntax.<br>Easy to retrofit since call sites keep their shape, which is exactly why developers forget to validate.

</details>

<details>
<summary><strong>Q30.</strong> Contrast implicit and explicit abstractions.</summary>

<b>Explicit:</b> crossings visible in source, so the developer knows to validate.<br><b>Implicit:</b> crossings hidden for compatibility, letting existing code work unmodified — easier to adopt and <b>more dangerous</b>.

</details>

<details>
<summary><strong>Q31.</strong> What extra machinery does enforcing availability require?</summary>

Timeouts, resource limits, the ability to kill and restart a compartment, and a supervisor that can make progress without a wedged compartment.

</details>

<details>
<summary><strong>Q32.</strong> Why is threading a source of complexity for compartment abstractions?</summary>

Questions of whether a switch is per-thread, whether threads migrate between compartments, and how locks behave across boundaries.<br>Abstractions must also compose with signals, shared libraries, existing IPC, and OS isolation.

</details>

<details>
<summary><strong>Q33.</strong> Processes + MMU as a mechanism: strengths and costs?</summary>

Separate address spaces — strong, well understood, universally available (OpenSSH, browsers).<br><b>Costs:</b> heavyweight, with expensive crossings via IPC (microsecond scale).

</details>

<details>
<summary><strong>Q34.</strong> What is Intel MPK/PKU, and what is its weakness?</summary>

Tags pages with a protection key, gating access through a per-thread register, so switching domains is a cheap <b>unprivileged</b> instruction with no address-space change.<br><b>Weakness:</b> because the switch instruction is unprivileged, a compromised compartment may simply change the register unless code is also restricted. Also a limited number of keys.

</details>

<details>
<summary><strong>Q35.</strong> What is Software Fault Isolation, and what must hold for it to work?</summary>

Instrument code so every memory access is masked or checked to stay in its region — no special hardware, at runtime cost.<br>Correctness requires the instrumentation be <b>unbypassable</b>: all code must be verified or toolchain-generated. <b>WebAssembly</b> is the mainstream instance.

</details>

<details>
<summary><strong>Q36.</strong> What does CHERI do?</summary>

Replaces pointers with hardware <b>capabilities</b> carrying bounds and permissions, giving fine-grained memory safety and compartmentalisation primitives in hardware.<br>Very strong; requires new hardware and recompilation.

</details>

<details>
<summary><strong>Q37.</strong> Compare hardware and software enforcement mechanisms.</summary>

<b>Hardware:</b> faster and harder to bypass, but needs specific features, offers fixed granularity, and cannot change once shipped.<br><b>Software:</b> portable and flexible, but costs runtime overhead and puts the instrumentation in the TCB.

</details>

<details>
<summary><strong>Q38.</strong> What is the trade-off in cross-compartment data transfer?</summary>

<b>Copying:</b> safe, costly for large payloads.<br><b>Sharing:</b> fast, dangerous — validated data can be mutated afterwards.<br>Copy small payloads; share large ones carefully.

</details>

<details>
<summary><strong>Q39.</strong> What dominates compartmentalisation performance?</summary>

<b>Crossing frequency × cost per crossing</b>, plus data copying and indirect cache/TLB/branch-predictor effects.<br>Process IPC is microseconds; MPK switches are tens of cycles — and that difference dictates viable granularity.

</details>

<details>
<summary><strong>Q40.</strong> Why is performance a security concern here, not a side issue?</summary>

Compartmentalisation that is too slow <b>does not get deployed</b>, so it delivers no security at all.<br>Much of the research is about finding acceptable points on the security/performance curve.

</details>

<details>
<summary><strong>Q41.</strong> What should you always ask about a mechanism's own security?</summary>

What is in its TCB — MMU and kernel? a runtime? an instrumenting compiler?<br>And can a compromised compartment escape by manipulating the mechanism itself (rewriting PKRU, forging an SFI-masked access, exploiting the runtime)?

</details>
