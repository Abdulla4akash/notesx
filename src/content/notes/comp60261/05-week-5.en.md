---
subject: COMP60261
chapter: 5
title: "Week 5"
language: en
---

# COMP60261 — Week 5: Software Compartmentalisation

**Scope:** why applications can no longer be treated as a single unit of trust; the three-step compartmentalisation process; the compartment interface vulnerabilities that undermine it; and the policy, abstraction and mechanism choices that make up a design.

**Covers lectures:** 22 Compartmentalisation Introduction · 23 Compartmentalisation and Interfaces · 24 Compartmentalisation Policies · 25 Compartmentalisation Abstractions · 26 Compartmentalisation Mechanisms

**The organising structure for the whole week** — the three steps from Lecture 22, which the following three lectures then expand one each:

1. **Policy** — what goes into which compartment (Lecture 24)
2. **Abstractions** — how the policy is expressed in the code (Lecture 25)
3. **Mechanism** — what enforces the separation at runtime (Lecture 26)

Learn this triple first; it makes the rest of the week navigable, and it is the natural skeleton for any long-form answer.

---

# Part 1 — Introduction and key ideas (Lecture 22)

## 1.1 The problem: software as a single unit of trust

Most systems software is treated as **a single monolithic unit of trust**, so **one vulnerability may let an attacker take over an entire application or system**.

This is a poor fit for modern software for two reasons:

- Modern applications **integrate components from various sources with different degrees of trust** — which also raises the risk of **supply chain attacks**.
- They simultaneously integrate components that are **security-critical**.

Both kinds sit in the same trust domain with the same privileges. Hence: we need **isolation and privilege reduction *within* applications**, which is what compartmentalisation provides.

## 1.2 Definition, and what makes it different

> **Software compartmentalisation decomposes software into lesser-privileged components — *compartments* — that only have access to what they need to do their job.**

The distinguishing property, stated explicitly:

> **Unlike other defences, it acknowledges there *will* be bugs and exploits, and tries to limit their impact.**

> **Exam flag — high value.** This is *the* framing sentence for the week. Week 2's defences try to stop exploitation; compartmentalisation assumes exploitation succeeds and bounds the damage. Any answer that opens by getting this distinction right is starting from the correct place.

**It is not complete isolation.** The components remain part of a single application and must **communicate** — which is precisely what creates the interface problem in Lecture 23.

## 1.3 The key idea, formally

**Restrict control and data flow in the application so that each compartment has only the permissions it requires to do its job** — the **principle of least privilege applied to software**.

Note that *permission* here is broader than memory:

- memory (data **and** code) access — the main one, but also
- **filesystem** access,
- **system calls**,
- **hardware and software resource** usage.

And once again the model is **Lampson's access control matrix**, now applied *inside* one program:

| | Crypto library (comp. 1) | HTTP parser (comp. 2) |
|---|---|---|
| **Crypto keys** | read access | **no access** |
| **HTTP request data** | **no access** | read access |

This is the same matrix as Week 4's access control, with compartments as subjects instead of users. Recognising that is worth stating.

## 1.4 The three trust models

> **Exam flag — terminology.** These have specific names in this unit. Use them.

| Model | Definition |
|---|---|
| **Sandbox** | Part of the program is **untrusted**; isolate the rest of the program (trusted) **from it** |
| **Safebox** | Part of the program is **security-critical**; isolate **it** from the rest of the program (untrusted) |
| **Mutual distrust** | Compartments distrust **each other** — a **stronger generalisation** of the other two |

All three **generalise to more than two compartments**.

The direction of distrust is the whole distinction. *Sandbox*: you are protecting the program **from** the component (e.g. a media parser). *Safebox*: you are protecting the component **from** the program (e.g. a crypto library holding keys). Getting the direction backwards inverts where every validation check must go.

## 1.5 The three security properties

- **Confidentiality** — an attacker cannot **read/leak** information from outside a subverted compartment.
- **Integrity** — an attacker cannot **write/tamper with** data outside a subverted compartment.
- **Availability** — an attacker cannot **disrupt (e.g. crash)** code running outside a subverted compartment.

**Availability is very hard to achieve when retrofitting without a complete redesign, and is out of scope for most existing efforts.** Lecture 25 explains exactly what achieving it would require.

## 1.6 The three steps, and the privileged monitor

1. **Establish a compartmentalisation policy** — decide what part of the software goes into which compartment.
2. **Use compartmentalisation abstractions** to indicate, in the code: compartment boundaries; private and shared data and resources; how compartments communicate; and how interfaces are secured.
3. **At runtime, have an isolation mechanism enforce the partitioning.**

Plus one component that is easy to overlook:

> A **privileged monitor** is also needed to perform **security domain transitions**. The **OS kernel** can play that role, or it can be a **special compartment**. Either way, **the monitor must itself be isolated from the untrusted compartments.**

> **Exam flag.** The monitor is a recurring answer. It explains why process-based compartmentalisation is "free" (the kernel is already a monitor and is already isolated), why userspace monitors need their own protection, and — per Lecture 25 — why the monitor's *other* interfaces become a bypass route.

## 1.7 Worked example: manual compartmentalisation

The lecture takes a trivial monolithic program — a `main` holding a `password`, calling a `library_function` that holds a `cryptokey` and reads a global — and splits it in two:

- **Policy:** `library_function` in one compartment, `main` in the other.
- **Abstractions:** process-based isolation; communication via IPC.
- **Mechanisms:** page tables for isolation; **pipes** (v1) or **shared memory** (v2) for communication.

**Version 1 (pipes).** `main` creates two named pipes (`mkfifo`) — one for parameters, one for the result — then `fork`s and `execve`s the library binary. It writes the argument and the global into the parameter pipe and reads the result back. The library compartment opens both pipes, reads the two values, calls the function, and writes the result.

**Version 2 (shared memory).** A `struct` holding `param`, `global` and `result` is placed in a POSIX shared memory object (`shm_open` + `mmap` with `MAP_SHARED`). The library compartment maps the same object, computes, and writes `result` in place.

**What the example is really demonstrating:** how much machinery a *two-function* split requires. Two source files, a shared header, IPC setup and teardown, manual marshalling of every value that crosses. This is why the lecture says the approach is **not widespread because it is a lot of work**.

> Note also a detail visible in v2: the parent `usleep`s to give the child time to finish. That is a **synchronisation bug** standing in for proper coordination — an honest illustration that hand-rolled compartmentalisation invites new classes of error.

## 1.8 Framework-assisted compartmentalisation

The same split expressed with framework support collapses to a few annotations:

- mark data that must cross as `shared` (e.g. the global and the argument);
- replace the call with a **`GATE(library_function, &arg)`** construct, which performs the **security domain switch**.

The framework then handles compartment creation, the transition, and placing shared data somewhere both compartments can reach. Available in several — **mostly research** — frameworks.

## 1.9 Designed-in versus retrofitted

- Software can be **designed from scratch** with compartmentalisation in mind. **Most production-ready examples are of this kind.**
- It can also be **retrofitted into monolithic software** — a desirable objective given the large volume of legacy monolithic system software, but **hard to achieve in practice**.

Traditional production examples: **OS kernels (microkernels), web browsers, web servers, SSH software**. The lecture is clear that these are **niche/specific** cases and the approach is **not widespread because it is a lot of work**.

---

# Part 2 — Interfaces and CIVs (Lecture 23)

## 2.1 What can be automated

Given that manual approaches require effort and expert knowledge, the ideal is to compartmentalise monolithic software **automatically** — seamlessly (in "one click") and **without expert knowledge**. Taking the three steps in turn:

| Step | Automatable? |
|---|---|
| **Policy definition** | **Some** approaches can be automated where they rely on standard programming-language or runtime constructs — e.g. *every library / object file / function in its own compartment* |
| **Shared data & communication management** | Requires identifying **all** shared data and either allocating it in shared memory or exchanging it by message passing. **Identification is the hardest part — but has been shown automatable in recent research** |
| **Applying an isolation mechanism** | Good primitives exist — e.g. `fork()` for processes — with similar support in several frameworks |

The lecture then asks: *that's it?* — and the answer is no. The remaining step is **interface safety**, and it is the subject of the rest of the lecture.

## 2.2 The interface safety example

The example is small enough to reproduce mentally, and it is the single most important thing in the lecture.

A monolithic program has a global array `data[DATA_SIZE]`. A function writes into it:

```c
int lib_function(int index, double object) {
    data[index] = object;      // no bounds check here
    /* ... */
}
```

and the caller checks the index before calling:

```c
int main() {
    int index = get_index();
    double object = get_object();
    if (index < DATA_SIZE)     // the check lives HERE
        lib_function(index, object);
}
```

**In the monolithic program this is fine.** There is one trust domain; the check happens before the call; the function may safely assume `index` is in range.

**Now apply a policy:** `lib_function` in one compartment, `main` in the other — a **safebox**, where `lib_function` does **not trust** `main`. Put a gate at the call. No shared data. Several frameworks automate all of that.

**What has just happened:** compartmentalisation has created a **new internal trust boundary** — the call to `lib_function`. And the bounds check is now **on the untrusted side of it**.

**The consequence.** Assume `main` is malicious and sends corrupted values. The **absence of a check inside `lib_function`** gives an attacker who has taken over `main` an **arbitrary memory write primitive** — the negative `index` case is not even excluded by the original check.

**The fix:** perform the check **within the trusted compartment**:

```c
int lib_function(int index, double object) {
    if (index >= DATA_SIZE || index < 0)
        return -1;
    data[index] = object;
    /* ... */
}
```

> **Exam flag — the highest-value item in the week.** The bug was created *by compartmentalising*, and the code did not change. Be able to state the general principle: **retrofitting compartmentalisation creates internal trust boundaries, and the monolithic software was never designed with those internal trust assumptions.** Validation that was correct for one trust domain ends up on the wrong side of a boundary that did not previously exist.

**And the uncomfortable state of the field:** the **majority of existing approaches — including automated ones — provide no help for securing interfaces**, and most recent compartmentalisation research makes no effort to do so.

## 2.3 Compartment Interface Vulnerabilities

> **CIVs are vulnerabilities arising due to lack of, or improper, control and data flow validation at compartment boundaries.**

The classes, which are worth memorising as three groups of three:

**Data leakage**
- Exposure of **addresses**
- Exposure of **confidential data**

**Data corruption**
- Dereference of a **corrupted pointer**
- Usage of **corrupted indexing information**
- Usage of a **corrupted object**

**Temporal violations**
- **Breaking API usage ordering**
- Usage of **corrupted synchronisation primitives**
- **Shared memory TOCTTOU**

> **Exam flag.** The **temporal** class is the one most people miss, and it is where compartmentalisation meets Week 4: shared-memory TOCTTOU is exactly the double-fetch problem from the syscall interface, reappearing at an application-internal boundary — with the same fix (copy, then validate the copy).

## 2.4 How bad is it? The ConfFuzz study

**Method.** A fuzzer injects malformed data into monolithic software **at potential compartment boundaries**, emulating the result of compartmentalising *without* securing interfaces — so the bugs found are the CIVs you would have introduced.

**Scope.** **36 APIs**, across the two trust models, including libraries but also **module and internal APIs** — many of which had been compartmentalised in past research studies:

- **Sandbox:** Apache + libmarkdown; cURL + libnghttp2; git + libcurl
- **Safebox:** curl + libssl; GPG + libgcrypt; sudo + libapparmor

**Result: 629 unique bugs** — read/write/execute (both limited and arbitrary), plus allocation and `NULL` bugs.

**Illustrative cases.** In safeboxing sudo's authentication API, a single function both **reads** a caller-supplied buffer at a fixed offset and **writes** a terminator into it — a read CIV and a write CIV in two adjacent lines. In libssl, an innocuous-looking **option-setting function** that ORs a caller-supplied value into a context field yields **arbitrary read/write**; and a **cross-API object** carrying **function pointers**, passed in and later dereferenced, yields **arbitrary execution**.

> The libssl cases are the instructive ones: neither function looks dangerous. They are dangerous **only because the caller became untrusted**. That is the entire phenomenon in two examples.

## 2.5 Takeaways from the study

1. **CIVs are widespread, and compartmentalisation without securing interfaces is mostly meaningless.**

2. **There are clear disparities among APIs.**
   - There are **large and almost totally CIV-free** APIs, and **small but fully vulnerable** ones.
   - **There is no correlation between API size and CIV count.**
   - Some **API design patterns are highly vulnerable** — e.g. **modules**, because of the large amount of **state exposure**.

3. **CIVs are high-impact.**
   - **75%** of scenarios have **at least one write vulnerability**.
   - **70%** of read/write and **50%** of execute vulnerabilities are **arbitrary**.

4. **Fixing CIVs goes beyond writing simple checks** — it **requires API redesign in many cases**, and is **hard to automate**.

> **Exam flag — a correction worth internalising.** The intuitive claim "bigger interface, more CIVs" is **explicitly contradicted**: there is **no correlation between API size and CIV count**. What matters is **design** — specifically how much **state** the API exposes. A module-style API sharing lots of state is vulnerable regardless of how few functions it has.

**The lecture's conclusion:** securing cross-compartment interfaces is the step **unlikely to be automatable** — which is unfortunate, because without it compartmentalising is mostly meaningless.

---

# Part 3 — Policies (Lecture 24)

## 3.1 What a policy is

A **compartmentalisation policy** decides, for the application being compartmentalised:

- **how many compartments there should be**, and
- **what goes in which compartment**.

Different policies for the same application have important consequences for both the **security** and the **performance** of the result.

## 3.2 Compartment selection method

Two main classes, plus their combination:

**Code-centric (spatial)** — protection domains are **regions of code**.
*Examples:* each library in its own compartment; or a web server split into main server code and the SSL library.

**Data-centric (temporal / horizontal)** — compartments are **temporal units of execution**, e.g. a thread or process.
*Example:* a web server's worker threads, each in its own compartment, all executing broadly the same code.

**Hybrid** — combine both: main application code in one compartment, a library in a second, plus one compartment per worker thread.

> **Exam flag.** Note that data-centric compartments may run **identical code** — the separation is by *execution flow*, not by *which code*. This is the natural fit for per-connection or per-user isolation, where the risk is one request's data leaking into another's.

## 3.3 Granularity

From coarser to finer: **library/software package → linkage unit → function**.

| | **Coarser** | **Finer** |
|---|---|---|
| **Pros** | Reduces compartmentalisation effort; lower performance impact | **Better privilege reduction** |
| **Cons** | **Low degree of privilege reduction** | Higher complexity and performance impact |

The mechanism behind both columns: coarser granularity means **fewer compartments**, hence **fewer security domain switches** (cheaper) but **larger compartments** (an attacker who subverts one gets more). Finer granularity inverts both.

## 3.4 Degrees of automation

Four points on a spectrum:

**Manual**
Adopted by most existing compartmentalisation efforts. Depends heavily on **developer expertise**, is **prone to human error**, and is **unable to guarantee correctness**.

**Guided manual**
Assists developers with **tools and feedback loops** to reduce errors and improve boundary definition. Offers **stronger guarantees against issues such as interface vulnerabilities** — note this is the level at which CIVs start being addressed.

**Policy-refinement**
The developer indicates **high-level policies** — e.g. code annotations, or a configuration file naming which library goes where. The framework then **automates installation of a low-level concrete policy**. **Interface safety remains hard to automate.**

**Full automation**
Requires **no effort from the programmer**. But computing data dependencies **without manual refinement may weaken the degree of privilege reduction** — because the necessary static analysis **overestimates**, leading to **oversharing**.

> **Exam flag.** The summarising claim: **mostly or fully automated methods trade off security to lower engineering effort.** More automation → less effort → weaker guarantees. Be able to say *why*: automation depends on static analysis, static analysis over-approximates, over-approximation means data is shared that need not be, and oversharing is reduced privilege separation.

## 3.5 Policy languages

Two forms, often combined:

**Code annotations** (e.g. compiler attributes) expressing semantics about **shared/private data** and **sensitive code**. Two opposite defaults are possible — treat all data as private and mark what is shared, or treat all as shared and mark what is private:

```c
int __shared(compartment1) *glob_ref = /* ... */;   // shared with compartment1
char __private password[128];                        // private to this compartment
```

**Placement rules** — higher-level statements of which parts of the application go into which compartment:

```yaml
default: comp0
libraries:
  - libredis:    comp1
  - libopenjpg:  comp2
  - libxml:      comp3
```

These differ in **granularity of expressivity** (a variable versus an entire library) and in which **trust models** they can address.

> **A neat inference from the lecture:** if a framework lets you mark data as *untrusted* but not as *security-sensitive*, it probably supports **sandboxing but not safeboxing**. The expressiveness of the policy language determines which trust models are reachable — a good point to make in a comparison question.

## 3.6 Analysis techniques

For automated approaches, analysis determines permissions, compartment boundaries, and which data is shared or private.

| | **Static analysis** | **Dynamic analysis** |
|---|---|---|
| Completeness | **Complete** but **overestimates** | **Incomplete**, **underestimates** |
| Failure mode | **Oversharing** — weaker privilege reduction | **Underprivileged compartments** — **permission fault at runtime under legitimate behaviour** |
| Scalability | Scales to **many applications/policies**; may **not** scale to large codebases | Scales to **large programs**; poor scalability to **many programs/policies** |

**Hybrid methods exist, but static and dynamic analyses generally do not compose well** — mixing them tends to yield a mix of both sets of drawbacks.

> **Exam flag.** Learn the two failure modes as a pair, because they are opposite and each is bad in a different way: static → **oversharing** (insecure but working); dynamic → **underprivileged** (secure but **broken at runtime on paths the analysis never saw**). The dynamic failure is a *correctness* failure in production, which is why it is rarely acceptable.

## 3.7 Programming-language genericity

**Most policy-definition approaches focus on one language or class of languages**, for two legitimate reasons:

- They must **tackle domain-specific problems** — e.g. **pointer aliasing in C**.
- They **leverage language-specific features** — e.g. the **rich type information in C++** to partially automate interface safety, or **software fault isolation** to confine **WebAssembly** sandboxes.

So the lack of genericity is not merely an oversight; the language-specific features are often what makes the automation possible at all.

---

# Part 4 — Abstractions (Lecture 25)

## 4.1 What an abstraction is

In computer science, an **abstraction** is a layer **simplifying** the use of a software or hardware component by **hiding unnecessary details** and exposing a **convenient interface**.

Familiar examples, used to set up the analogy:

- a **programming language** abstracts assembly instructions with high-level statements;
- the **system call interface** abstracts a plethora of OS features — `fork` abstracts many details of process creation and duplication;
- a **file** abstracts disk blocks, and `read`/`write` abstract caching, block allocation, request scheduling and drivers.

## 4.2 Compartmentalisation abstractions

> **A compartmentalisation abstraction defines and implements primitives to express compartmentalisation policies in a program.**

It lets the programmer (or a higher layer) express:

- what part of the application goes into which compartment;
- where the compartment boundaries are;
- what data is **shared** between which compartments;
- what data is **private** to the containing compartment;
- when and how compartments are **created/destroyed**;
- when and how to **set up/update permissions**.

## 4.3 The main abstraction categories

| Category | Purpose | Process-based example |
|---|---|---|
| **`CREATE`** / **`DESTROY`** | Bring a compartment into and out of existence | `fork()` / `exit()` |
| **`ASSIGN`** | Assign permissions to compartments | separate address spaces via separate processes |
| **`CALL`** / **`RETURN`** | Transition execution between compartments | IPC / a gate |

## 4.4 `CALL`/`RETURN` in detail

These achieve **privileged domain switches** and carry **two security requirements**:

1. **Enforce cross-compartment control flow integrity.** An untrusted caller must not be able to jump to **arbitrary code addresses** inside the callee — that would be roughly equivalent to letting the caller **execute arbitrary code in the callee's context**. A compartment should be callable **only through the API it exposes**.
2. **Switch the stack and clear registers** to avoid leaks — otherwise residual stack and register contents leak across the boundary.

> **Exam flag.** Both requirements, and the reason for each. Requirement 1 is about **integrity** (who decides where execution goes); requirement 2 is about **confidentiality** (what data rides along). A cross-compartment call is not a function call — it is a privilege transition that must sanitise both control and data.

**Synchronicity** is the other axis:

- **Synchronous** — the caller **blocks**, akin to traditional function calls and returns.
- **Asynchronous** — compartments run **concurrently** and exchange **messages**, closer to a **distributed protocol** (RPC-like).

## 4.5 Implicit versus explicit abstractions

- **Explicit** — exposed to the developer, who must use them deliberately (e.g. placing an annotation to mark a shared variable). Implies **engineering effort**.
- **Implicit** — handled **automatically under the hood** (e.g. a framework placing every library in its own compartment). **No effort from the programmer.**

Because most approaches are **code-centric**, `CREATE`/`DESTROY` are **often implicit** — each compartment is created when the application launches and destroyed when it exits. **With more automated approaches, `ASSIGN` and `CALL`/`RETURN` may also become implicit.**

> Connect this to §3.4: **more implicit = more automated = less effort = weaker guarantees**, and to §2.2: an implicit boundary is one the developer may not realise needs validating.

## 4.6 Properties enforced

The vast majority of existing abstractions enforce:

- **Integrity** — noted as a **prerequisite for enforcing confidentiality and availability**;
- **Confidentiality**.

**Very few target availability.**

> **Exam flag.** "Integrity is a prerequisite for the other two" is a compact and quotable claim. The reasoning: if an attacker can **tamper with** a compartment's code or data, they can subvert whatever machinery was supposed to deliver confidentiality or availability. Integrity is the base of the stack.

## 4.7 What availability would actually require

**Availability here means:** can a compartment continue to perform its duties **in the presence of other adversarial compartments actively trying to crash it or starve it of resources?**

It would require specific abstractions:

- **concurrently running compartments** with **asynchronous `CALL`/`RETURN`**;
- **cross-compartment performance isolation** and **bounded resource consumption** — so no compartment can starve the rest;
- **careful TCB and interface design to store state outside compartments** — so crashed compartments can be restarted;
- **recursive restart of crashed compartments and their dependencies**, to maintain state consistency.

> **The lecture's summarising line, worth quoting: the target software becomes a *distributed application*.**

That is why availability is out of scope for nearly all work: it is not an incremental addition but a **re-architecture**, layered on top of confidentiality and integrity, which are already hard.

## 4.8 Composing with other abstractions

### Processes and threads

The threading model can be either:

- **Orthogonal** to compartments — **a thread/process can execute multiple compartments**, entering and exiting them with `CALL`/`RETURN`.
- **Coupled** with compartments — **a thread/process runs a single compartment only**, and `CALL`/`RETURN` **spawn or transition to** the corresponding thread/process.

### CPU privilege levels

Application-level abstractions are influenced by the **user/kernel interface**: the **kernel may play the role of the monitor** performing security domain transitions, or the monitor can live in **userspace** (with performance implications either way).

**Kernel- or hypervisor-level compartmentalisation is harder**, because these entities generally assume **ambient authority** — they are accustomed to running with full privilege. Compartmentalising them requires **establishing a TCB and isolating it** to act as the monitor.

### Other system interfaces — the bypass problem

Compartmentalisation prevents compartment A directly accessing compartment B — **given proper interface security**. But **other system interfaces must also resist attempts to bypass the compartmentalisation**, notably:

- the **system call interface** — e.g. **`mmap`**;
- **pseudo filesystems** — e.g. **`/dev/mem`**.

The lecture's key observation: kernel interfaces **are** well secured for **process-based** compartmentalisation, because the kernel was **designed to isolate processes**. But with **more modern isolation mechanisms** these interfaces become concerning, **because the kernel was never designed with those mechanisms in mind**.

> **Exam flag — high value.** This is a genuinely subtle point and a good discriminator. If compartments live in **one address space** (e.g. MPK), the kernel still sees **one process** — so a compartment that can call `mmap`, or open `/dev/mem`, may legitimately obtain access to memory the mechanism was carefully denying it. The isolation mechanism and the monitor's own API must agree, and for newer mechanisms they often do not. It also explains why **syscall filtering (seccomp)** is a natural companion to intra-address-space compartmentalisation.

---

# Part 5 — Mechanisms (Lecture 26)

## 5.1 What a mechanism must provide

> **A compartmentalisation mechanism enforces at runtime the separation defined by policies and implemented through abstractions.**

Every suitable mechanism must allow:

1. **Isolated protection domains** — preventing a compartment from reading, writing or executing data and code in another compartment's memory.
2. **Controlled communications between domains** — i.e. `CALL`/`RETURN` must be implementable, with **cross-compartment control flow integrity** (A may invoke B **only through a well-defined interface**, not at arbitrary points in B's code), and **the data exchanged should be limited to what the communication requires** — anything more is **oversharing**, which decreases security.

## 5.2 Examples of mechanisms

**Hardware**

| Mechanism | Compartments are… |
|---|---|
| **Page tables** | **processes** |
| **CPU privilege levels** | user vs kernel space — e.g. in a **microkernel** |
| **Memory protection keys (MPK)** | **threads within a single address space** |
| **Trusted Execution Environments** | enclaves, confidential VMs, world separation |

**Software**

- **Software fault isolation (SFI)** — a **compiler-level** technique: compartment code is generated so it **cannot escape a sandbox**, and control transfers (jumps, calls) are generated so they **can only target legitimate code locations**, enforcing CFI.
- **Memory-safe languages** — preventing the memory-safety issues that would let a compartment reach memory it should not.
- **Bounds-checking software** — e.g. **fat pointers**, augmenting pointers with the **bounds of the objects they point to**, checked on dereference.

## 5.3 Cross-compartment communication: two methods

Beyond `CALL`/`RETURN`, a mechanism must support **data exchange** — to pass parameters and return values, and to handle data referenced by pointer parameters.

| | **Message passing** | **Shared memory** |
|---|---|---|
| How | Data sent/received over a channel, **generally with one or more copies** (IPC: pipes, sockets) | Compartments share an address space or part of it, and **exchange references (pointers)** |
| Speed | **Slow** — copies, and possibly formatting for transmission | **Faster** — only references move |
| Security | **Secure** — data is **never accessible from more than one compartment at a time** | **Less secure** — **TOCTTOU possible if compartments run concurrently** |

> **Exam flag.** State the security property of message passing precisely: *the data is never reachable by two compartments simultaneously*, which is what structurally eliminates the race. Shared memory reintroduces exactly the temporal CIV class from §2.3.

## 5.4 Trust models and the TCB

**Mechanisms are designed with a trust model in mind:**

- **CPU privilege levels** target **single distrust** — the kernel distrusts the application, while the application trusts the kernel.
- **Page tables** isolating processes target **mutual distrust**.

**Mechanisms also influence the content of the TCB.** In general, from a compartment's point of view, the TCB comprises: **(part of) the workload, the compiler, the loader, system software, firmware, the CPU package, and the physical environment.** **TEE mechanisms allow some reduction of the TCB** — notably by removing the OS and hypervisor.

> **Exam flag.** "Which trust model does this mechanism assume?" is a clean way to compare mechanisms, and it explains a real limitation: a mechanism built for **single distrust** cannot simply be repurposed for **mutual distrust**. It also connects directly to Week 4 — TEEs are on this list precisely because they shrink the TCB.

## 5.5 Hardware versus software mechanisms

**Most approaches employ hardware mechanisms**, for **speed** and **application compatibility** — but you must have the right hardware.
*Examples:* page tables, memory protection keys, memory virtualisation extensions, TEE enclaves and confidential VMs, bounds-checking hardware, hardware capabilities.

**Software mechanisms** are **slower and less compatible** — some work only with a particular programming language — but are **available independently of the hardware**.
*Examples:* memory-safe languages, software fault isolation, software capabilities.

## 5.6 Three further mechanism properties

**Permissions enforced.** A combination of **read**, **write**, **execute**, and **address** — the last meaning the ability to **create a pointer to** a resource. **Not all mechanisms support all permissions.** Concretely: **Intel MPK supports read/write, read-only, or no read/write access — with no support for preventing execution.**

**Enforcement granularity.** Most target either the **page (4 KB)** or **byte** granularity. This has implications for **memory consumption** and for **oversharing** — page granularity forces anything smaller than a page to share protection with its neighbours.

**Number of domains.** May be limited: **MPK supports a maximum of 16 domains**, extendable through virtualisation **at a performance cost**. More generally, increasing the number of domains raises **scalability** issues.

> **Exam flag — concrete numbers.** **MPK: 16 domains, no execute control, page granularity.** These are exactly the kind of specifics that distinguish "I know MPK is fast" from "I know what MPK can and cannot express" — and they directly limit which **policies** (§3.3 granularity) are implementable on it.

## 5.7 Performance

Mechanisms affect performance in many ways:

- **compartment switching latency**, and **domain-crossing sanitisation costs**;
- **compartment creation/destruction delays**;
- the **cost of setting/updating permissions**;
- **memory fragmentation, access locality and cache effects** — caused by having to arrange memory to reflect what is shared and what is private;
- **scalability** to compartment size and number.

> **The dominating factor is often the domain switching latency.** It varies between mechanisms, and **modern exception-free approaches tend to be much faster** — meaning approaches that work **within a single address space** (no context switch, no page-table change) and that switch security domain **without raising an exception**, unlike a system call.

## 5.8 The overall trade

> **Picking a mechanism means choosing a trade-off between security, performance, and engineering effort.**

Three axes, not two — engineering effort is a first-class consideration, and it is why the most secure available mechanism is frequently not the one chosen.

---

# Exam flags and lecturer emphasis

## The structural spine

**Policy → Abstractions → Mechanism**, plus the **privileged monitor**. Lectures 24, 25 and 26 are one each. If you remember nothing else, remember this pipeline and which lecture owns which step.

## Definitions to state exactly

1. **Compartmentalisation** — decompose software into lesser-privileged compartments having only what they need; **acknowledges bugs will exist and limits their impact**.
2. **The three trust models** — **sandbox** (protect program *from* untrusted part), **safebox** (protect critical part *from* program), **mutual distrust** (generalises both).
3. **CIV** — vulnerability from **lack of or improper control and data flow validation at compartment boundaries**, with the three classes.
4. **The two `CALL`/`RETURN` security requirements** — cross-compartment CFI; switch stack and clear registers.
5. **A mechanism's two obligations** — isolated protection domains; controlled communication with cross-compartment CFI and no oversharing.

## Quantitative and named facts

| Fact | Value |
|---|---|
| ConfFuzz scope | **36 APIs**, two trust models |
| Bugs found | **629 unique** |
| Scenarios with ≥1 write vulnerability | **75%** |
| Arbitrary read/write vulnerabilities | **70%** |
| Arbitrary execute vulnerabilities | **50%** |
| Correlation between API size and CIV count | **None** |
| MPK maximum domains | **16** |
| MPK execute prevention | **Not supported** |
| Typical enforcement granularity | **page (4 KB)** or **byte** |

## Claims that contradict the intuitive answer

- **No correlation between API size and CIV count** — what matters is **design**, especially **state exposure** (module-style APIs are highly vulnerable).
- **Compartmentalisation without securing interfaces is *mostly meaningless*** — not merely weakened.
- **Securing interfaces is unlikely to be automatable**, while the other steps largely are.
- **Fixing CIVs requires API redesign**, not just adding checks.
- **More automation means weaker security** — via static analysis overestimation and oversharing.
- **Integrity is a prerequisite** for confidentiality and availability, not a peer.
- **Kernel interfaces (`mmap`, `/dev/mem`) can bypass compartmentalisation** when the mechanism is newer than the kernel's isolation assumptions.

## Trade-offs to be able to argue in both directions

| Choice | One way | The other |
|---|---|---|
| Granularity | Coarse: less effort, faster, **less privilege reduction** | Fine: **better privilege reduction**, more complexity and slower |
| Automation | Manual: strong, expensive, error-prone | Automated: cheap, **weaker guarantees** |
| Static vs dynamic analysis | Static: complete, **overshares** | Dynamic: incomplete, **underprivileges → runtime faults** |
| Message passing vs shared memory | Messages: slow, **secure** | Shared: fast, **TOCTTOU-prone** |
| Hardware vs software mechanism | Hardware: fast, compatible, **needs the hardware** | Software: portable, **slower and less compatible** |
| Explicit vs implicit abstractions | Explicit: effort, **visible boundary** | Implicit: effortless, **invisible boundary** |

## Common traps

- **Do not** use "hierarchical / peer" for the trust models — this unit says **sandbox / safebox / mutual distrust**.
- **Do not** claim CIV counts scale with interface size.
- **Do not** forget the **privileged monitor** as a required component.
- **Do not** treat availability as merely "hard" — say what it needs (**the application becomes distributed**).
- **Do** put the interface check **inside the trusted compartment**, not the caller.
- **Do** remember `CALL`/`RETURN` must clear registers and switch stacks, not just control where execution lands.

## Forward and backward links

- **§2.3 shared-memory TOCTTOU** ← Week 4's syscall double-fetch; same bug, same fix.
- **§1.3 access control matrix** ← Week 4's Lampson matrix, now applied inside one program.
- **§5.2 TEEs as a mechanism** ← Week 4's TEE lecture; here they appear as an isolation primitive that also shrinks the TCB.
- **§4.8 kernel bypass** → seccomp syscall filtering, Week 4.
- **§5.2 privilege levels / microkernel** ← Week 4's OS models; a microkernel *is* a compartmentalised kernel.
- **CHERI hardware capabilities** (hardware lectures) → the "hardware capabilities" entry in §5.5 and byte-granularity bounds checking in §5.6.

---

# Summary checklist

- [ ] Software as a single unit of trust; components of differing trust; supply chain risk
- [ ] Definition, and that it **assumes exploitation will happen**
- [ ] Least privilege inside an application; permissions include files, syscalls, resources
- [ ] **Sandbox / safebox / mutual distrust**, and the direction of distrust in each
- [ ] C / I / A, with availability out of scope for most work
- [ ] **Policy → abstractions → mechanism**, plus the **privileged monitor**
- [ ] The manual pipe and shared-memory example; how much machinery a two-way split needs
- [ ] Framework-assisted: annotations + `GATE`
- [ ] What automates (policy, shared-data identification, mechanism) and what does not (**interfaces**)
- [ ] The `lib_function`/`data[index]` example: check ends up on the **untrusted side**
- [ ] CIV definition and the **three classes** (leakage, corruption, **temporal**)
- [ ] ConfFuzz: 36 APIs, **629 bugs**, 75% / 70% / 50%, **no size correlation**
- [ ] Fixing CIVs needs **API redesign**; securing interfaces is **not automatable**
- [ ] Code-centric vs data-centric vs hybrid selection
- [ ] Granularity table, both directions
- [ ] Four automation levels; automation **trades security for effort**
- [ ] Annotations vs placement rules; expressiveness limits reachable trust models
- [ ] Static **overestimates → oversharing**; dynamic **underestimates → runtime faults**; hybrids compose poorly
- [ ] PL genericity: most approaches are language-specific, for good reasons
- [ ] `CREATE` / `DESTROY` / `ASSIGN` / `CALL` / `RETURN`
- [ ] `CALL`/`RETURN`: **CFI** + **switch stack, clear registers**; sync vs async
- [ ] Implicit vs explicit; why `CREATE`/`DESTROY` are usually implicit
- [ ] **Integrity as prerequisite**; availability requires becoming a **distributed application**
- [ ] Threads **orthogonal vs coupled**; kernel as monitor; ambient authority in kernels
- [ ] **Bypass via `mmap` / `/dev/mem`** when the kernel predates the mechanism
- [ ] Mechanism obligations: isolated domains + controlled communication, no oversharing
- [ ] Hardware (page tables, privilege levels, MPK, TEEs) vs software (SFI, safe languages, fat pointers)
- [ ] Message passing vs shared memory; the exact security property of each
- [ ] Single distrust vs mutual distrust; TCB contents; TEEs shrink it
- [ ] Permissions incl. **address**; **MPK: 16 domains, no execute**; page vs byte granularity
- [ ] **Domain switching latency dominates**; exception-free single-address-space approaches are fastest
- [ ] The three-way trade: **security, performance, engineering effort**
