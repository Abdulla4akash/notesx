---
subject: COMP60261
chapter: 5
title: "Week 5"
language: en
---

# COMP60261 — Week 5: Software Compartmentalisation

**Scope:** decomposing a program into mutually distrusting compartments — the key idea and security properties, interface vulnerabilities, policies, abstractions, and enforcement mechanisms.

**Covers lectures:** 22 Compartmentalisation Introduction · 23 Compartmentalisation and Interfaces · 24 Compartmentalisation Policies · 25 Compartmentalisation Abstractions · 26 Compartmentalisation Mechanisms

---

## 1. The key idea

Weeks 2–4 established that memory-unsafe code will contain bugs and that a single bug typically compromises the whole program, because a process is one flat trust domain: every line of code can reach every byte of data and exercise every one of the process's privileges.

**Compartmentalisation** breaks that assumption. Split a program into multiple isolated **compartments**, give each only the memory and privileges it actually needs, and mediate all interaction between them. A vulnerability in one compartment then yields only that compartment's access.

This is **least privilege** applied *inside* an application, and it is a mitigation of *impact* rather than a prevention of bugs. It assumes compromise will happen and bounds the consequences.

### 1.1 Why it matters in practice

A typical application links many libraries — image decoders, XML and font parsers, compression, crypto. These parse untrusted input in C, and historically they are where the vulnerabilities are. Yet a bug in a font parser can steal your crypto keys, because both live in the same address space with the same privileges. That mismatch — huge blast radius from a peripheral component — is what compartmentalisation targets.

### 1.2 It is already everywhere

The idea is well established in the systems people already use: OpenSSH's privilege separation (a small privileged monitor plus an unprivileged, chrooted network-facing process), web browsers (per-site renderer processes with the sandboxed renderer distrusted by the privileged broker), qmail and Postfix's separated components, and modern mobile app sandboxes. Compartmentalisation is not speculative; the research question is how to get it without hand-crafting each case.

### 1.3 Security properties

- **Confidentiality** — a compromised compartment cannot read another's data.
- **Integrity** — it cannot modify another's data or code.
- **Availability** — it cannot prevent others from making progress. This is the hardest to obtain and is often simply not provided; a compartment that loops forever or exhausts memory can deny service unless resources are separately controlled.

### 1.4 Trust models

The essential shift: compartments are **mutually distrusting**. Trust relationships vary by design —

- **Hierarchical** — a trusted supervisor plus untrusted workers (OpenSSH, browsers).
- **Mutual distrust among peers** — no compartment trusts any other; each validates everything it receives.
- **Partial trust** — a lattice reflecting sensitivity.

Whatever the shape, **state it explicitly**, because the interface obligations follow directly from it. In particular, if A distrusts B, then A must validate everything crossing from B — and this is exactly where compartmentalisation tends to go wrong.

---

## 2. Doing it: manual, framework-assisted, automated

### 2.1 (Re)designing for compartmentalisation

Designing a system compartmentalised from the start yields clean boundaries, because the decomposition informs the architecture. Most real code, however, must be **retrofitted** — a very different and much harder problem, since existing code shares state freely, uses pointers across would-be boundaries, and has no notion of who owns what.

### 2.2 Manual compartmentalisation

The developer explicitly splits the program, moves code into separate protection domains, and rewrites cross-domain interactions as explicit message passing or RPC.

A first attempt typically separates the obviously risky component (say, a parser) into its own process, passing data over a pipe. Refining it means addressing what the first cut missed: which data genuinely must cross, what the privileged side must validate, how to handle failure, and how to avoid a chatty interface destroying performance.

- **Pros:** the developer understands the semantics, so boundaries can be placed where they are meaningful.
- **Cons:** laborious, error-prone, invasive, and it does not scale to large codebases or to hundreds of dependencies. Every boundary is a new opportunity to introduce a validation bug.

### 2.3 Framework-assisted

A framework or library supplies the plumbing — compartment creation, cross-compartment call marshalling, memory sharing — leaving the developer to declare boundaries and annotate what crosses. Less boilerplate and fewer mechanical errors; still requires developer understanding, and the framework's abstractions constrain what is expressible.

### 2.4 Automated

Tooling derives the decomposition from analysis of the code, ideally with little developer input. This is the research frontier, and the difficulty is that automation must infer *semantics* — what is sensitive, what must be shared, what a safe interface looks like — from code that never recorded it. Automated tools tend to produce either over-permissive boundaries (little security gain) or over-restrictive ones (broken programs).

---

## 3. Interfaces: where compartmentalisation actually fails

Introducing a boundary creates an **interface**, and the interface becomes a new attack surface. This lecture's message is that the interface is usually the weakest part of a compartmentalised system.

### 3.1 Compartment Interface Vulnerabilities (CIVs)

A **CIV** is a vulnerability arising specifically at the boundary, where code written under whole-program assumptions now receives data from an untrusted compartment.

The root cause is that the original code was written assuming the caller was itself — same trust domain, so no validation needed. After splitting, the caller is untrusted, but the code was not updated to reflect that. The compiler cannot notice; the assumption was never written down.

Recurring CIV patterns:

- **Unvalidated data crossing** — pointers, indices, lengths, and sizes accepted at face value, now attacker-controlled.
- **Pointers into the other compartment's memory** — passing a pointer across a boundary either leaks addresses or requires the recipient to dereference untrusted memory.
- **Shared memory used as an implicit channel** — data validated once, then mutated by the untrusted side afterwards (a TOCTOU at the compartment boundary).
- **Confused deputy** — the privileged compartment performing a privileged operation on behalf of, and at the direction of, an untrusted one. Exactly the Week 4 problem, re-appearing inside one application.
- **API misuse and state confusion** — calling functions out of order or in unexpected states, violating invariants the code assumed but never checked.
- **Error handling and resource exhaustion** across the boundary.

### 3.2 How bad is it?

Studies retrofitting compartmentalisation onto real software find CIVs to be **pervasive** — boundaries introduce many, and the count grows with interface size and complexity. Fuzzing the interfaces of unprotected APIs finds large numbers of crashes, confirming that code exposed at a new boundary was never written to withstand hostile input on it.

**Takeaways from that work:**

- Compartmentalisation **relocates** risk to the interface rather than eliminating it.
- Interfaces must be **small and simple**; every additional function, argument, and shared structure adds attack surface.
- **Data crossing must be validated and, where possible, copied** rather than shared, so it cannot change after checking.
- **A poorly designed boundary can be worse than none**, since it adds complexity and a false sense of security.

### 3.3 Interface safety

Making a boundary safe means: minimising what crosses; using self-contained, serialisable data rather than pointers; copying instead of sharing where feasible; validating exhaustively on the receiving side; and keeping the interface narrow enough to be reviewed and fuzzed in full. Tooling can help — interface definition languages generating validated marshalling code, and static analysis to find unvalidated flows.

---

## 4. Policies: what to separate

A **compartmentalisation policy** specifies the decomposition — which code and data go in which compartment, and what may cross.

### 4.1 Granularity

The central choice, and a direct trade-off:

| Granularity | Example | Security | Cost |
|---|---|---|---|
| Coarse | Whole subsystem or process | Weaker (large domains) | Low overhead, few crossings |
| Medium | Per library | Reasonable middle ground | Moderate |
| Fine | Per function or per object | Strong | Many crossings, high overhead |

Finer compartments mean less privilege each, but more boundaries, more interfaces, more CIVs, and more crossing overhead. **Finer is not automatically better** — it multiplies interfaces, and interfaces are where the bugs are.

A common and defensible policy is **per-library isolation** of untrusted parsers — placing, say, a Redis client library, a JPEG 2000 decoder, and an XML parser each in its own compartment with the rest of the application in another. It targets the components most likely to contain exploitable bugs while keeping crossing counts manageable.

### 4.2 Compartment selection method

How the boundary is chosen: by **sensitivity of data** (isolate what holds secrets), by **exposure to untrusted input** (isolate the parsers), by **privilege required** (isolate the part needing elevated rights), by **provenance** (isolate third-party dependencies), or guided by profiling to keep hot paths within a compartment.

### 4.3 Policy languages

Policies need expressing. Desirable properties: precise enough to specify compartments and permitted flows; concise enough to write and review; and **generic** — **PL genericity** meaning the language and tooling are not tied to one programming language or one enforcement mechanism, so a policy can outlive both. Approaches range from source annotations to separate declarative policy files, the latter keeping policy reviewable independently of code.

### 4.4 Analysis and automation

Deriving or checking policies uses static analysis (call graphs, points-to analysis, information-flow analysis to find what actually crosses) and dynamic analysis (profiling real executions to observe accesses and calls). Static over-approximates; dynamic under-approximates by only seeing executed paths — so a dynamically derived policy risks breaking on unexercised paths, while a statically derived one risks being too permissive.

Automation can propose candidate boundaries, estimate overhead, and identify data needing to cross — but the security judgement of *what is worth protecting from what* still needs a human with a threat model.

---

## 5. Abstractions: how compartments are presented to the developer

An **abstraction** is the programming model for compartments and their interaction, sitting between policy and mechanism.

### 5.1 Main categories

- **CALL/RETURN abstractions** — cross-compartment interaction looks like a function call. Familiar and easy to retrofit, since existing call sites keep their shape; the danger is that it looks *too* familiar, hiding a trust boundary behind ordinary-looking syntax. Includes synchronous RPC and domain-crossing calls.
- **Message passing** — explicit send/receive. The boundary is visible, which encourages validation, and it maps naturally onto processes and separate address spaces; requires restructuring code that was written as calls.
- **Shared-memory abstractions** — explicitly designated shared regions. Fast, but reintroduces the possibility of data changing after validation.
- **Object/reference abstractions** — capability-style handles to objects, where holding a reference conveys authority. Connects to Week 4's capability systems.

### 5.2 Implicit vs. explicit

**Explicit** abstractions make crossings visible in the source: the developer sees a boundary and knows to validate. **Implicit** abstractions hide crossings for compatibility, letting existing code work unmodified — at the cost of developers forgetting that a boundary exists. Implicit is easier to adopt and more dangerous, and this tension recurs throughout the field.

### 5.3 Properties enforced, and composition

Different abstractions enforce different subsets of confidentiality, integrity, and availability, with **availability** typically requiring extra machinery (timeouts, resource limits, the ability to kill and restart a compartment, and a supervisor able to make progress without a wedged compartment).

Abstractions must also **compose with what already exists** — threads, signals, shared libraries, existing IPC, and the OS's own isolation. Interaction with threading is a notable source of complexity: whether a compartment switch is per-thread, whether threads can migrate between compartments, and how locks behave across boundaries.

---

## 6. Mechanisms: how isolation is actually enforced

The **mechanism** is the enforcement layer beneath the abstraction.

### 6.1 Examples

- **Processes + MMU** — separate address spaces, the classic mechanism (OpenSSH, browsers). Strong, well understood, available everywhere; heavyweight, with expensive crossings via IPC.
- **Intra-address-space hardware mechanisms** — **Intel MPK/PKU** tags pages with a protection key and gates access through a per-thread register, so switching domains is a cheap unprivileged instruction with no address-space change. Very fast; limited number of keys, and the switch instruction is unprivileged, so a compromised compartment can potentially just change the register unless the code is also restricted.
- **ARM Memory Domains / MTE**, and **CHERI** — CHERI replaces pointers with hardware **capabilities** carrying bounds and permissions, giving fine-grained memory safety and compartmentalisation primitives in hardware. Very strong, but requires new hardware and recompilation.
- **Software Fault Isolation (SFI)** — instrument code so every memory access is masked or checked to stay within its region. No special hardware; runtime overhead, and correctness depends on the instrumentation being unbypassable (all code must be verified or generated by the toolchain). **WebAssembly** is the modern mainstream instance.
- **Language- and runtime-level isolation** — type and memory safety plus module boundaries (JVM, JavaScript isolates, Rust). Strong within the language; the runtime itself is in the TCB.
- **Virtualisation-based** — separate VMs per compartment. Very strong isolation, heaviest cost; leads into Week 6.

### 6.2 Hardware vs. software mechanisms

**Hardware** enforcement is typically faster and harder to bypass, but needs specific (sometimes unavailable) features, offers fixed granularity, and cannot be changed once shipped. **Software** enforcement is portable and flexible, but costs runtime overhead and puts the instrumentation and its correctness in the TCB.

### 6.3 Cross-compartment communication

Every mechanism needs a way to transfer control and data. **Control transfer** may be a call gate, a system call, an IPC message, or a register write. **Data transfer** is by copying (safe, costly for large payloads) or sharing (fast, dangerous — validated data can be mutated afterwards). The **switch cost** is the critical figure: process IPC is on the order of microseconds, MPK switches are tens of cycles, and this difference dictates viable granularity.

### 6.4 Performance considerations

The dominant cost is **crossing frequency × cost per crossing**, plus data copying, plus indirect effects on caches, TLB, and branch predictors. Practical consequences:

- Place boundaries where **crossings are rare** — put hot paths inside one compartment.
- Prefer **batching** over chatty interfaces.
- Copy small payloads; carefully share large ones.
- Overhead is workload-dependent, and the honest evaluation reports it per workload rather than as a single number.

Performance is not a side issue: **compartmentalisation that is too slow does not get deployed**, so it delivers no security at all. Much of the research is about finding acceptable points on the security/performance curve.

### 6.5 Trust models, again

Each mechanism defines what is trusted. Ask of any scheme: what is in the TCB — the MMU and kernel? A runtime? An instrumenting compiler? Can a compromised compartment escape by manipulating the mechanism itself (rewriting a PKRU register, forging an SFI-masked access, exploiting the runtime)? The mechanism's own attack surface is part of the security argument.

---

## 7. Week 5 takeaways

1. Compartmentalisation applies **least privilege inside an application** — it bounds the impact of a bug rather than preventing it.
2. It is already deployed: **OpenSSH privilege separation, browser renderer sandboxes, mobile app sandboxes**.
3. Compartments are **mutually distrusting** — state the trust model, because interface obligations follow from it.
4. **CIVs are the central problem.** Splitting code creates interfaces, and code written under whole-program assumptions does not validate what now arrives from an untrusted peer.
5. Studies find CIVs **pervasive**; a bad boundary can be worse than none.
6. Interface safety = **small, simple, copy rather than share, validate exhaustively**.
7. **Granularity is a trade-off** — finer means less privilege per compartment but more interfaces, more CIVs, and more overhead. Per-library isolation of untrusted parsers is the pragmatic sweet spot.
8. **Implicit vs. explicit** abstractions: implicit eases adoption but hides the boundary from developers.
9. **Availability is the property usually not provided.**
10. Mechanism spectrum by cost and strength: **MPK/PKU (cheap, intra-address-space) → SFI/WebAssembly → processes+MMU → VMs**; CHERI is the hardware-capability endpoint.
11. **Crossing frequency × crossing cost dominates performance**, and performance determines whether any of it ships.
