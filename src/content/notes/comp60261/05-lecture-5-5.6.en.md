---
subject: COMP60261
chapter: 5
title: "Lecture 5 - 5.6 Study Notes"
language: en
---

# COMP60261 - Lecture 5: Software Compartmentalisation (5.6)

**Sources used:** downloaded COMP60261 slide decks:

- `slides/22-comp-intro/index.html`
- `slides/23-comp-interfaces/index.html`
- `slides/24-comp-policies/index.html`
- `slides/25-comp-abstractions/index.html`
- `slides/26-comp-mechanisms/index.html`

All paths are relative to `C:\Users\abdul\Downloads\COMP60261-slides`.

**Transcript status:** no lecture transcript was provided. These notes are grounded in the slides and their local assets only.

**Topic and scope:** Chapter 5 explains why software is divided into compartments, how trust boundaries create new interface risks, and how policies, abstractions, and mechanisms work together to enforce least privilege inside an application.

---

## 1. The organising model

The central idea of this chapter is:

> Compartmentalisation assumes that bugs and successful exploits will occur, then limits the damage by giving each component only the authority required for its job.

The chapter follows one design pipeline:

1. **Policy:** decide what belongs in each compartment and which resources it may access.
2. **Abstraction:** express the compartments, their data, and their communication in the program.
3. **Mechanism:** enforce the separation and controlled communication at runtime.

A **privileged monitor** performs transitions between security domains. The monitor may be the operating-system kernel or a specially protected compartment, but it must be isolated from untrusted compartments. If an attacker can corrupt the monitor, the compartment boundaries no longer provide security.

### 1.1 Why monolithic trust is dangerous

Systems software is often treated as one unit of trust. A vulnerability in any library or parser can therefore expose the authority of the entire process. This is increasingly risky because modern programs combine:

- components from different suppliers and with different levels of assurance;
- complex third-party dependencies that increase supply-chain risk;
- security-critical components, such as cryptographic code and secret keys;
- exposed components, such as network parsers, that process attacker-controlled input.

Without internal isolation, a compromised low-trust component inherits access to high-value data and operations. Compartmentalisation applies the **principle of least privilege within one application**.

Permissions can cover more than memory. A policy may control access to:

- code and data memory;
- files and devices;
- system calls;
- hardware and software resources;
- communication with other compartments.

### 1.2 Access-control view

Compartmentalisation can be represented as an access-control matrix. Compartments are subjects, resources are objects, and each cell records an allowed operation.

| Resource | Crypto compartment | HTTP parser compartment |
|---|---:|---:|
| Cryptographic keys | Read/use | No access |
| HTTP request data | No access unless passed explicitly | Read |

This structure matters because compartmentalisation is not merely about drawing boundaries. The policy must specify what may cross each boundary and the mechanism must enforce that decision.

### 1.3 Three trust models

| Trust model | What is protected? | Direction of distrust |
|---|---|---|
| **Sandbox** | The rest of the program is protected from an untrusted component | Program distrusts component |
| **Safebox** | A security-critical component is protected from the rest of the program | Component distrusts program |
| **Mutual distrust** | Every compartment is protected from the others | Compartments distrust one another |

The direction of distrust determines where validation must occur. A sandbox protects its caller from a potentially malicious callee. A safebox protects a sensitive callee from a potentially malicious caller. Mutual distrust requires checks in both directions.

### 1.4 Security properties

- **Confidentiality:** a compromised compartment cannot read or leak information outside its authority.
- **Integrity:** a compromised compartment cannot modify code or data outside its authority.
- **Availability:** a compromised compartment cannot prevent other compartments from continuing their work.

Most compartmentalisation systems focus on confidentiality and integrity. Availability is substantially harder because isolation must also cover CPU time, memory, communication, state recovery, and dependencies.

---

## 2. From a monolith to compartments

The introductory slides compare manual and framework-assisted approaches.

### 2.1 Manual process-based compartmentalisation

The example separates a main program from a library function. Process isolation supplies a familiar mechanism: each process has its own page-table-protected address space, while the kernel acts as the privileged monitor.

Two communication designs are shown:

| Design | Data movement | Main advantage | Main cost or risk |
|---|---|---|---|
| Named pipes | Parameters and results are copied through IPC channels | Strong separation and explicit data flow | Marshalling, copying, setup, and teardown |
| POSIX shared memory | Both processes map a shared structure | Fewer copies and faster access | Shared data can be modified concurrently and requires correct synchronisation |

Even a split involving only a small library call requires separate binaries, shared definitions, process creation, IPC setup, marshalling, error handling, synchronisation, and cleanup. The example demonstrates why manual compartmentalisation carries significant engineering effort.

The shared-memory version also uses a delay to wait for the child. A delay is not reliable synchronisation: scheduling can vary, so production code would need an explicit completion protocol.

### 2.2 Framework-assisted compartmentalisation

A framework can expose annotations and protected entry points, such as a `GATE`, so a developer marks the boundary while the framework generates lower-level transition code.

Framework support can automate parts of the process:

- creating and destroying compartments;
- assigning code and data to compartments;
- switching protection domains;
- marshalling some arguments and return values.

However, the framework cannot automatically infer the full semantic contract of an interface. It may know that an integer crosses a boundary, but not whether that integer is a valid array index, object state, command, or length.

---

## 3. Compartment interfaces

Isolation changes the threat model. Once one compartment may be compromised, every cross-compartment call becomes an interaction with a potentially malicious peer.

### 3.1 Why interface validation is essential

Consider this simplified pattern:

```c
if (index < data_length) {
    return lib_function(data, index);
}
```

If the caller is untrusted and `lib_function` belongs to a trusted compartment, the check is on the wrong side of the boundary. A compromised caller can bypass it and invoke the protected entry point directly with an invalid `index`.

The trusted compartment must validate every security-relevant property itself:

```c
int lib_function(const int *data, size_t data_length, size_t index) {
    if (data == NULL || index >= data_length) {
        return ERROR_INVALID_ARGUMENT;
    }
    return data[index];
}
```

This example captures a general rule:

> Validation belongs inside the compartment that relies on it, because validation performed by an untrusted caller is not part of the trusted computing base.

Checks may need to cover pointer validity, buffer size, value range, object state, call order, permissions, aliasing, and concurrent modification.

### 3.2 Compartment interface vulnerabilities

A **compartment interface vulnerability (CIV)** is caused by absent or incorrect control-flow or data-flow validation at a compartment boundary.

The slides group CIVs into three broad classes:

1. **Data leakage:** an interface exposes more information than the receiver should observe.
2. **Data corruption:** a caller can make the callee overwrite, misuse, or accept invalid state.
3. **Temporal inconsistency:** shared data changes between validation and use, producing a time-of-check to time-of-use problem.

The temporal case is especially important with shared memory. Suppose compartment A validates a shared length and compartment B changes it before A uses it. Both individual operations may be permitted, but their interleaving violates the intended security invariant.

Possible defences include copying inputs into private memory before validation, making data immutable during a call, locking, transferring ownership, or using message passing so only one compartment can access the data at a time.

### 3.3 Evidence from ConfFuzz

The interface study in the slides examined **36 APIs** under sandbox and safebox trust models and found:

| Result | Value |
|---|---:|
| Unique CIVs | 629 |
| Scenarios with at least one arbitrary-write vulnerability | 75% |
| Scenarios with arbitrary read/write vulnerabilities | 70% |
| Scenarios with arbitrary-execution vulnerabilities | 50% |

The significant conclusion is that there was **no correlation between API size and CIV count**. A small API is not automatically secure. Interface design, state exposure, pointer use, and assumptions about call ordering matter more than the raw number of functions.

The study also shows why retrofitting boundaries is insufficient. Existing APIs were designed for cooperative in-process callers. After compartmentalisation, those callers may be adversarial, so the API contract itself often needs redesign rather than a few added checks.

### 3.4 Interface design lessons

- Minimise shared mutable state.
- Prefer narrow operations that express intent over exposing internal objects.
- Validate data in the compartment that trusts the result of the check.
- Treat control flow, call ordering, and object lifetime as part of the interface.
- Do not assume that a smaller function count means a smaller attack surface.
- Revisit the API when the trust model changes.

Compartmentalisation without secure interfaces is largely ineffective: the attacker may be unable to cross memory protections directly but can still abuse the authorised entry points.

---

## 4. Compartmentalisation policies

A policy describes how the program is decomposed and what each compartment may access. It identifies **subjects** such as functions, libraries, or data objects, places them into compartments, and assigns permitted resources and communication paths.

### 4.1 What can define a compartment?

Selection can be:

- **Code-centric:** functions, libraries, modules, or components define the boundary.
- **Data-centric:** sensitive data and the code allowed to operate on it define the boundary.
- **Hybrid:** both code structure and data sensitivity influence placement.

Code-centric policies are often easier to apply to existing software because source trees already contain modules and libraries. Data-centric policies can better capture the security goal when a secret or critical state is the main object being protected.

### 4.2 Granularity

| Granularity | Example | Security effect | Engineering and performance effect |
|---|---|---|---|
| Coarse | One library per compartment | Less privilege reduction; more code shares authority | Fewer transitions and simpler interfaces |
| Medium | Module or group of functions | Better separation with moderate boundary count | More policy and interface work |
| Fine | Function or data object | Stronger least privilege and a smaller compromise radius | Many transitions, complex sharing, and higher overhead |

Granularity is a trade-off. Fine-grained policies can reduce privilege more effectively, but create more boundaries to secure and can magnify runtime and engineering costs.

### 4.3 Levels of automation

The slides distinguish four broad levels:

1. **Manual:** developers define the complete policy.
2. **Assisted:** analysis recommends compartments but developers decide.
3. **Semi-automated:** tools derive much of the policy from developer-supplied goals or annotations.
4. **Automated:** tools infer and apply the policy with minimal developer input.

Automation reduces effort, but normally weakens guarantees. A tool must approximate program behaviour and may grant extra access to avoid breaking the program. That oversharing reduces the least-privilege benefit.

### 4.4 Policy languages

Policies may be expressed through:

- source-code annotations;
- placement rules, such as assigning selected libraries to separate compartments;
- external configuration or a domain-specific policy language.

Annotations are tied closely to code and can describe individual objects precisely. Placement rules can be easier to apply across a codebase, but may be less expressive. The policy language must be able to represent the intended trust model; otherwise the desired security property cannot be enforced regardless of the underlying mechanism.

### 4.5 Analysis techniques

| Technique | Strength | Main limitation |
|---|---|---|
| Static analysis | Can examine paths without executing the program | Often over-approximates, producing oversharing |
| Dynamic analysis | Observes concrete runtime behaviour | Misses unexecuted paths, producing under-privileged policies and runtime faults |
| Hybrid analysis | Combines static coverage with runtime evidence | Results and assumptions may not compose cleanly |

Policy derivation is also often programming-language-specific. Languages differ in pointer use, reflection, object models, type information, and runtime behaviour. Language-specific restrictions are therefore not merely an implementation inconvenience; they can be what makes accurate analysis possible.

---

## 5. Compartmentalisation abstractions

Abstractions are the programmer-visible or framework-visible operations used to realise a policy.

### 5.1 Core operations

- **`CREATE`:** establish a new compartment.
- **`DESTROY`:** remove a compartment and release its resources.
- **`ASSIGN`:** place code, data, or resources in a compartment.
- **`CALL`:** enter another compartment through an authorised interface.
- **`RETURN`:** return control and results to the caller.

Many code-centric systems make `CREATE` and `DESTROY` implicit: compartments are created when the application starts and destroyed when it terminates. More automated systems may also make assignment and calls implicit.

### 5.2 Code-centric, data-centric, and hybrid abstractions

- A **code-centric abstraction** attaches isolation to code units, such as a function or library.
- A **data-centric abstraction** attaches protection to data and controls which code may access it.
- A **hybrid abstraction** explicitly represents both protected code and protected data.

The abstraction affects what policies are convenient to express. A code-only interface may make fine-grained data ownership awkward, while a data-only system still needs a way to control which computations may use the data.

### 5.3 Secure `CALL` and `RETURN`

Cross-compartment transitions need more than a jump to another address. Two requirements are central:

1. **Cross-compartment control-flow integrity:** callers may enter only through approved entry points and return only through legitimate return paths.
2. **Machine-state sanitisation:** switch to an appropriate stack and clear registers or other state that could leak data across the boundary.

If registers retain secrets from the previous compartment, memory isolation alone does not preserve confidentiality. If a caller can jump into the middle of a callee, it can bypass validation and violate integrity.

Calls may be:

- **Synchronous:** the caller blocks until the callee returns, resembling a conventional function call.
- **Asynchronous:** compartments execute concurrently and exchange messages, resembling a distributed protocol.

### 5.4 Explicit and implicit abstractions

- **Explicit abstractions** require developers to mark compartments, shared data, or protected entry points. This costs engineering effort but keeps trust boundaries visible.
- **Implicit abstractions** are applied automatically by a framework. This lowers adoption cost but can hide boundaries from programmers who need to secure the interfaces.

The more implicit the abstraction, the more it depends on correct analysis and conservative sharing decisions.

### 5.5 Integrity, confidentiality, and availability

Most abstractions enforce integrity and confidentiality. The slides describe integrity as a prerequisite for the other properties: if an attacker can modify the code or data implementing confidentiality or availability, those guarantees can be subverted.

Strong availability would require:

- concurrently running compartments and asynchronous communication;
- performance isolation and bounded resource use;
- state stored so a failed compartment can restart;
- recovery of failed compartments and their dependencies while preserving consistency.

The resulting design resembles a **distributed application**, which is why availability is usually outside the scope of a simple retrofit.

### 5.6 Composition with other system abstractions

**Processes and threads.** Threads may be orthogonal to compartments, meaning one thread enters several compartments, or coupled to compartments, meaning each compartment has its own thread or process.

**Privilege levels.** The kernel can act as the monitor for user/kernel transitions, or a monitor can operate in userspace. Compartmentalising kernels and hypervisors is difficult because they traditionally assume ambient authority. A smaller trusted computing base must first be identified and isolated.

**System interfaces.** Other interfaces must not bypass the chosen isolation. Examples in the slides include `mmap` and `/dev/mem`. Process isolation works well with kernel interfaces because kernels were designed to isolate processes. A newer same-address-space mechanism may be invisible to kernel access-control assumptions, so syscall filtering and careful monitor design may be required.

---

## 6. Compartmentalisation mechanisms

A mechanism enforces the separation defined by the policy and represented by the abstractions.

### 6.1 Two fundamental obligations

Every mechanism needs:

1. **Isolated protection domains:** one compartment cannot read, write, or execute another compartment's private code or data.
2. **Controlled communication:** cross-domain control flow uses approved entry points, and only the data required for the operation is shared.

Sharing more data than an operation requires is **oversharing**. It increases the authority available to a compromised compartment and weakens least privilege.

### 6.2 Examples

| Mechanism | Typical protection domains | Important feature |
|---|---|---|
| Page tables | Processes | Mature address-space isolation |
| CPU privilege levels | User and kernel domains | Privileged monitor in the kernel |
| Memory Protection Keys (MPK) | Domains inside one address space | Fast permission switching without changing page tables |
| Trusted Execution Environments | Enclaves, confidential VMs, or separate worlds | Can exclude the OS or hypervisor from part of the TCB |
| Software Fault Isolation (SFI) | Compiler-created sandboxes | Rewrites or constrains memory and control-flow operations |
| Memory-safe languages | Language-enforced domains or components | Prevent unsafe memory access used to escape boundaries |
| Bounds checking or fat pointers | Object-bounded references | Checks that a pointer remains within its authorised object |

### 6.3 Message passing versus shared memory

| Property | Message passing | Shared memory |
|---|---|---|
| Exchange | Values are sent over a channel, usually with copying | References point to jointly accessible memory |
| Performance | Copying and formatting add cost | Fast because references can be passed |
| Security | Data ownership can be exclusive during transfer | Concurrent access enables TOCTTOU bugs |
| Interface style | Explicit serialised contract | In-memory objects and pointers |

Message passing is structurally safer when transfer ensures that data is not simultaneously reachable by both compartments. Shared memory is faster but demands careful ownership and synchronisation.

### 6.4 Trust models and the TCB

Mechanisms embody assumptions about trust:

- CPU privilege levels usually model **single distrust**: the kernel distrusts the application, while the application trusts the kernel.
- Page tables separating peer processes can support **mutual distrust** between those processes.

A mechanism designed for one direction of distrust cannot automatically enforce a stronger trust model.

From a compartment's perspective, the **trusted computing base (TCB)** can include parts of the workload, compiler, loader, system software, firmware, CPU package, and physical environment. TEE mechanisms can shrink the TCB by excluding the operating system or hypervisor from the confidentiality and integrity boundary.

### 6.5 Hardware and software mechanisms

| Hardware mechanisms | Software mechanisms |
|---|---|
| Usually fast and compatible with existing applications | Available without specialised hardware |
| Require appropriate processor support | Often slower or tied to a language/toolchain |
| Examples: page tables, MPK, virtualisation extensions, TEEs, hardware capabilities | Examples: safe languages, SFI, software capabilities |

The choice is not simply hardware versus software. A practical system may combine hardware memory isolation, compiler instrumentation, a runtime monitor, and interface validation.

### 6.6 Permissions, granularity, and domain count

Mechanisms vary along three concrete dimensions.

**Permissions enforced:** read, write, execute, and **address**, where address permission means being able to form a pointer to a resource. Not every mechanism supports every permission.

**Enforcement granularity:** typically a page, commonly 4 KB, or an individual byte/object. Page granularity can waste memory and force unrelated objects to share protection, causing oversharing.

**Number of domains:** some mechanisms have a fixed limit. Intel MPK provides at most **16 protection-key domains** in its basic hardware interface. Systems can virtualise keys to support more logical domains, but this adds performance cost.

Important MPK facts from the slides:

- read/write, read-only, or no read/write access can be represented;
- execution cannot be disabled through MPK;
- enforcement is page-granular;
- the hardware exposes 16 domains.

These limitations determine which policies MPK can express. A fast mechanism is unsuitable if it cannot enforce a required permission or support the required number of compartments.

### 6.7 Performance considerations

Mechanisms affect:

- security-domain switching latency;
- sanitisation at each crossing;
- compartment creation and destruction;
- permission setup and updates;
- memory fragmentation, locality, and cache behaviour;
- scalability with compartment size and count.

The slides emphasise that **domain-switching latency often dominates**. Exception-free, same-address-space mechanisms tend to switch faster because they avoid a system call, exception, context switch, or page-table replacement. That speed must still be evaluated against weaker permissions, a limited domain count, and the risk that kernel interfaces bypass the isolation.

The overall mechanism choice is therefore a three-way trade-off:

> **Security, performance, and engineering effort.**

---

## 7. How the chapter fits together

Suppose a program contains an exposed image decoder and a cryptographic library.

1. The **policy** places them in separate compartments, denies the decoder access to keys, and gives the cryptographic compartment only the operations it needs.
2. The **abstraction** marks protected code/data and defines approved `CALL`/`RETURN` entry points.
3. The **mechanism** isolates memory and performs domain transitions.
4. The **monitor** configures permissions and controls each transition.
5. The **interfaces** validate all inputs inside the compartment that relies on them.

Failure at any layer can defeat the design:

- a coarse policy grants too much authority;
- an inexpressive abstraction cannot encode the intended ownership;
- a mechanism lacks execute control or enough domains;
- an insecure interface provides an authorised route to corrupt protected state;
- an unprotected monitor lets an attacker disable enforcement.

This is why compartmentalisation should be evaluated as an end-to-end design rather than as a single hardware feature.

---

## 8. Exam-focused comparisons

### 8.1 High-value facts

| Question | Answer |
|---|---|
| What are the three design stages? | Policy, abstraction, mechanism |
| What additional component performs transitions? | A protected privileged monitor |
| What are the trust models? | Sandbox, safebox, mutual distrust |
| What is a CIV? | A boundary vulnerability caused by improper control-flow or data-flow validation |
| Where must validation occur? | Inside the compartment that relies on it |
| Did CIV count correlate with API size? | No |
| What must a mechanism provide? | Isolated domains and controlled communication |
| Why is shared memory risky? | Concurrent access enables temporal/TOCTTOU vulnerabilities |
| Why is availability difficult? | It needs resource isolation, asynchronous design, restart, and consistent external state |
| What are the key MPK limits? | 16 domains, page granularity, and no execute control |
| What often dominates performance? | Domain-switching latency |

### 8.2 Common mistakes

- Treating compartmentalisation as a way to eliminate bugs. It limits exploit impact.
- Naming the trust models without explaining the direction of distrust.
- Assuming a boundary automatically secures the API crossing it.
- Placing a security check only in an untrusted caller.
- Claiming that fewer API functions imply fewer CIVs.
- Forgetting to include the privileged monitor in the design.
- Treating integrity, confidentiality, and availability as equally easy to retrofit.
- Describing MPK as complete memory protection without noting its lack of execute control and its 16-domain limit.
- Comparing mechanisms only on security and speed while ignoring engineering effort.

### 8.3 Revision checklist

- [ ] Define compartmentalisation and explain its assume-compromise approach.
- [ ] Apply least privilege using an access-control matrix.
- [ ] Distinguish sandbox, safebox, and mutual distrust.
- [ ] Explain policy, abstraction, mechanism, and monitor.
- [ ] Compare manual IPC with framework-assisted compartmentalisation.
- [ ] Define CIVs and the leakage, corruption, and temporal classes.
- [ ] Recall the ConfFuzz results and the lack of API-size correlation.
- [ ] Compare code-centric, data-centric, and hybrid policies.
- [ ] Explain granularity and automation trade-offs.
- [ ] Compare static, dynamic, and hybrid policy analysis.
- [ ] Describe `CREATE`, `DESTROY`, `ASSIGN`, `CALL`, and `RETURN`.
- [ ] State the two security requirements for cross-compartment calls.
- [ ] Explain why availability turns the design into a distributed application.
- [ ] Compare page tables, privilege levels, MPK, TEEs, SFI, and safe languages.
- [ ] Compare message passing with shared memory.
- [ ] Explain how a mechanism changes the TCB and supported trust model.
- [ ] Recall MPK permissions, page granularity, and 16-domain limit.
- [ ] Discuss the security-performance-engineering-effort trade-off.

---

## 9. Compact answer framework

For a long-form exam question about designing a compartmentalised system:

1. State the **asset**, attacker, and trust model.
2. Define a **policy** using compartments, resources, and permitted flows.
3. Choose an **abstraction** capable of expressing those flows.
4. Choose a **mechanism** whose permissions, granularity, and domain count match the policy.
5. Identify the **privileged monitor** and the resulting TCB.
6. Secure every **interface**, including pointers, state, timing, and call order.
7. Evaluate **security, performance, engineering effort, and availability**.

This structure connects every lecture in Chapter 5 and prevents an answer from focusing on an isolation mechanism while omitting policy and interface security.
