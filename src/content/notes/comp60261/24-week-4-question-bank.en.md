---
subject: COMP60261
chapter: 24
title: "Week 4 — Question Bank"
language: en
---

# Week 4 — Operating Systems Part 2: Worked Question Bank

Drills OS security invariants and kernel hardening, the DAC/MAC/capability access-control comparison, TEE properties and limits, and the TCB-versus-performance argument across kernel designs.

## Task types drilled

1. **Invariant statement** — say what the OS must guarantee and what breaks it.
2. **Access-control model comparison** — place a scenario in DAC/MAC/capability terms.
3. **Confused-deputy analysis** — identify the authority/designation split.
4. **TEE reasoning** — determine what is and is not in the TCB.
5. **Attestation logic** — explain why a protocol step is necessary.
6. **Kernel-model selection** — choose a design and defend the trade-off.
7. **Hardening selection** — pick the mechanism matching a stated threat.

---

# Section A — Recall and classification

## Q1. State the process-level security invariants, and explain why one kernel bug can violate all of them.

### Solution

**Step 1: List them.**
- A process cannot read or write another's memory without mediated permission (`ptrace`, shared memory, `/proc/<pid>/mem` — each access-controlled).
- A process cannot access kernel memory.
- A process cannot escalate privilege except via sanctioned paths (setuid execution, capability grants).
- A process cannot exhaust resources so as to deny service to others (rlimits, cgroups).

**Step 2: Identify the common dependency.** Each is enforced by kernel code, relying on hardware (privilege modes, MMU) that only the kernel configures.

**Step 3: Draw the conclusion.** An attacker executing with kernel privilege controls the enforcement mechanism itself — page tables, credentials, and limits. There is no residual authority above the kernel to appeal to.

**Answer.** The invariants are not independent guarantees but consequences of one guarantee (kernel integrity), so compromising the kernel voids them simultaneously. This is why kernel LPE is the highest-value local outcome.

---

## Q2. Distinguish DAC from MAC, and state how they compose.

### Solution

**Step 1: DAC.** Policy is set by the **resource owner** at their discretion. Unix implements it via process UID/GID compared against file owner, group, and permission bits; root bypasses the checks.

**Step 2: MAC.** Policy is set **centrally by an administrator** and cannot be overridden by resource owners — **even root is constrained**.

**Step 3: State the composition rule.** They are complementary, not alternatives: **both must permit** an access. A `chmod 777` file is still unreachable if the MAC policy forbids it, and a MAC-permitted access still fails if the permission bits deny it.

**Step 4: Give the motivation for adding MAC.** Two things DAC cannot do — enforce organisational policy regardless of user behaviour, and confine a privileged process so that compromising it does not yield everything it could technically reach.

**Step 5: Name the implementation route.** The **LSM** framework provides kernel hook points at security decisions; SELinux, AppArmor, Smack, and TOMOYO are modules using them.

---

## Q3. Explain the confused deputy problem and its root cause. Why is it not a memory-safety bug?

### Solution

**Step 1: State the shape.** A privileged program is induced to misuse its authority on behalf of a less-privileged caller. The program is entitled to perform the action; the caller is not; the program cannot tell the request came from someone unauthorised.

**Step 2: Identify the root cause.** A failure to separate **authority** from **designation**. The caller supplies the *name* of the target; the program supplies the *authority* to act on it. Nothing ties the authority to what the caller was permitted to name.

**Step 3: Explain why it is not memory unsafety.** No bounds are exceeded, no lifetime violated, no memory corrupted. The program executes exactly as written, and every individual operation is permitted. The defect is in the **authority model**, so no amount of memory safety, sanitizing, or fuzzing removes it.

**Step 4: Identify the structurally vulnerable systems.** Those with **ambient authority** — where a process wields all its user's rights implicitly at all times, so authority is never mentioned at the point of use and therefore never checked against the caller.

**Step 5: State the structural fix.** Capabilities, which bind designation and authority into one unforgeable token, so a caller must **pass a capability** for the object it wants touched — and can therefore only direct the deputy at things it could already reach.

---

## Q4. What are the four key characteristics of a TEE?

### Solution

**Step 1: Isolated execution.** Memory that privileged software cannot read or modify, typically enforced by the CPU and backed by memory encryption.

**Step 2: A minimal TCB.** Ideally the hardware plus the protected code only — excluding the OS, hypervisor, and machine operator.

**Step 3: Remote attestation.** The ability to prove to a remote party **what code is actually running**, on genuine hardware.

**Step 4: Sealing.** Binding secrets to a specific measured code identity, so only that code can retrieve them.

**Step 5: State the underlying motivation.** All four exist to solve a **TCB problem**: running a computation on someone else's machine ordinarily means trusting their whole stack. A TEE aims to remove that stack from the TCB.

---

# Section B — Applied and multi-step

## Q5. A logging service may append to `/var/log/app.log`. A client passes a filename, and the service writes there. Analyse, and give both fixes.

### Solution

**Step 1: Classify.** A textbook **confused deputy**. The service holds write authority the client lacks; the client supplies the designation.

**Step 2: Trace the attack.** The client passes `/etc/passwd` or `/etc/cron.d/evil`. The service, acting with its own authority, writes there. The client has achieved a write it could not perform directly.

**Step 3: Note why review misses it.** Each step is legitimate in isolation — the service is permitted to write, and writing where told is its job. The flaw appears only when you ask *whose authority is being exercised on whose designation*.

**Step 4: Fix 1 — validation (DAC-compatible).** Refuse to accept a path at all: confine writes to a fixed, service-chosen file, or accept only an opaque identifier that the service maps to a path from a whitelist. If a path must be accepted, canonicalise it and verify it lies under an allowed root — noting that this is race-prone and easy to get wrong.

**Step 5: Fix 2 — capabilities (structural).** Require the client to pass an **open file descriptor** it already holds, and have the service write to that descriptor rather than to a name. Because the client can only obtain descriptors for files it may itself open, it becomes impossible to direct the service anywhere the client could not already reach. Authority and designation now travel together.

**Step 6: State why fix 2 is stronger.** Fix 1 blocks the paths you thought of; fix 2 makes the class unreachable, since the service never exercises authority the client lacks.

---

## Q6. Why is a TEE nearly useless remotely without attestation? Walk through the provisioning protocol.

### Solution

**Step 1: State the problem.** Isolation protects code *running inside* the environment. It says nothing about **which** code is inside. A remote party sending secrets to "an enclave" has no idea whose enclave.

**Step 2: Show the attack without attestation.** The machine operator runs a substitute enclave — or no enclave at all — that presents the same interface. The remote party sends its key material, and the operator reads it. Isolation was never violated; it simply protected the attacker's code.

**Step 3: Give the protocol.**
1. The environment computes a **measurement**: a cryptographic hash over the loaded code and configuration.
2. The hardware signs that measurement with a key that **chains to the vendor**, unavailable to software.
3. The verifier checks the signature (establishing genuine hardware) and compares the measurement against the expected value (establishing correct code).
4. Only then does the verifier provision secrets — typically by establishing a session key bound to the attested identity.

**Step 4: Identify what each step establishes.** The signature gives *genuine hardware*; the measurement gives *the expected code*; the binding of the session to the attestation prevents the secrets going to a different enclave than the one attested.

**Step 5: Connect to sealing.** Sealing binds data to the measured identity, so persisted secrets remain retrievable only by the same code — the local counterpart of the same idea.

**Answer.** Attestation supplies the identity that isolation lacks; without it, confidentiality is guaranteed *to an unknown party*, which is no guarantee at all.

---

## Q7. A cloud customer wants to run an unmodified Linux VM protected from the host operator. Which TEE, and what remains unprotected?

### Solution

**Step 1: Apply the granularity requirement.** "Unmodified VM" excludes SGX, which protects application-level **enclaves** and requires porting, with enclave code unable to make syscalls directly. It excludes TrustZone, which provides one system-wide **secure world** rather than per-tenant VMs.

**Step 2: Select.** **AMD SEV** (specifically SEV-SNP) encrypts a guest VM's memory with a key the hypervisor does not hold, and SNP adds integrity and attestation. Unmodified guests get protection with no application rewriting. (ARM CCA occupies the same design point on ARM.)

**Step 3: State what remains unprotected — availability.** Privileged software can always refuse to schedule or resume the VM, or destroy it. Availability is outside every TEE threat model.

**Step 4: State the second gap — side channels.** Cache, timing, and transient-execution channels are largely **out of scope** for these designs and have repeatedly broken them in practice. Shared microarchitectural resources leak across the boundary.

**Step 5: State the third gap — the vendor.** The hardware manufacturer becomes a trust anchor: they hold the attestation signing root and implement the encryption. This is unauditable by the customer, so the OS has been removed from the TCB partly by **relocating** trust rather than eliminating it.

**Step 6: State the fourth gap — internal bugs.** A vulnerability in the guest is as exploitable as anywhere, and with less external visibility, since the host's monitoring and introspection are precisely what has been excluded.

**Answer.** SEV-SNP; unprotected are availability, side channels, vendor trust, and bugs inside the protected boundary.

---

## Q8. Match each threat to the most appropriate hardening mechanism, and justify.

(a) A compromised network daemon reaching unrelated kernel subsystems. (b) A malicious PCIe device reading arbitrary host memory. (c) A daemon running as root reading files unrelated to its function. (d) A kernel infoleak revealing kernel text addresses.

### Solution

**Step 1: (a) → seccomp-BPF.** The threat is breadth of reachable kernel code. A per-syscall filter restricts the daemon to the small subset it needs, shrinking reachable kernel code sharply. Attack-surface reduction is the right frame.

**Step 2: (b) → IOMMU.** Devices performing DMA bypass the MMU entirely, so page-table permissions are irrelevant. The IOMMU is a device-side MMU restricting DMA to permitted ranges. Nothing in the CPU-side model addresses this.

**Step 3: (c) → MAC (SELinux/AppArmor).** DAC cannot help: root bypasses permission checks by design. MAC binds even root, confining the daemon to the file types its policy permits. This is exactly the "confine a privileged process" motivation for MAC.

**Step 4: (d) → KASLR, plus the leak fix.** KASLR randomises kernel text placement so leaked addresses are less useful. But note the Week 2 lesson: an infoleak **defeats** ASLR, so KASLR mitigates rather than solves, and the real fix is eliminating the leak — commonly by zeroing structures so **padding bytes** are not copied to userspace.

**Step 5: State the general principle.** Match the mechanism to the **boundary being crossed**: syscall interface → seccomp; device DMA → IOMMU; file access by a privileged subject → MAC; address disclosure → randomisation plus leak elimination.

---

# Section C — Extended / exam-style

## Q9. "Microkernels are more secure than monolithic kernels, so Linux was a mistake." Assess.

### Solution

**Step 1: Grant the assurance claim.** A microkernel provides only address spaces, threads, scheduling, and IPC; filesystems, drivers, and network stacks run as isolated userspace servers. So a driver bug crashes one server rather than the system, and the TCB shrinks enormously. **seL4** is roughly 10k lines and **formally verified** — a genuinely different assurance level, not a marginal improvement.

**Step 2: State the cost precisely.** Every cross-server interaction becomes IPC rather than a direct call. Decades of engineering reduced but did not eliminate this. Monolithic kernels avoid it because all subsystems share one privileged address space.

**Step 3: Reject the "mistake" framing on its own terms.** Linux won on performance **and ecosystem** — drivers, filesystems, and hardware support that no verified microkernel matches. A design nobody deploys provides no security in practice, so the comparison must be against realistic alternatives, not against an idealised one.

**Step 4: Observe that the dichotomy is false.** Modern monolithic practice **borrows microkernel ideas** to shrink effective trust without abandoning the ecosystem: userspace drivers (FUSE, DPDK, userspace USB), sandboxed system services, seccomp confinement, hypervisor-enforced kernel integrity, and kernel CFI. The trend is convergent.

**Step 5: State where each genuinely wins.** Microkernels dominate where correctness outweighs generality and hardware is fixed — avionics, automotive, secure phone enclaves. Monolithic kernels dominate general-purpose computing.

**Step 6: Conclude.** The real content of the claim is the **TCB-size/performance trade-off**, and the models are points along it. "More secure" is true of the TCB metric and insufficient as an engineering conclusion, because deployability is part of the security outcome.

---

## Q10. Explain why Linux capabilities do not solve the confused deputy problem, despite the shared name.

### Solution

**Step 1: State what Linux capabilities are.** A partition of root's powers into roughly 40 named privileges (`CAP_NET_BIND_SERVICE`, `CAP_SYS_ADMIN`, …), so a process needing one privileged operation need not hold all of root's power.

**Step 2: State what a capability is in the capability-systems sense.** An **unforgeable token** that simultaneously *designates* a specific resource and *conveys the authority* to use it. There is no authority except through held tokens.

**Step 3: Identify the decisive difference.** Linux capabilities are **ambient and object-independent**. `CAP_DAC_OVERRIDE` authorises bypassing file permission checks **on any file**; it names a *class of operation*, not a *specific object*.

**Step 4: Apply to the deputy.** The deputy's authority remains ambient and unbounded in extent, so it can still be aimed at any object the caller names. The authority/designation split — the actual root cause — is untouched. Splitting root reduces the *blast radius* of a confused deputy but does not prevent the confusion.

**Step 5: Show what genuine capabilities change.** With object capabilities, the deputy holds no ambient authority; the caller must supply a token for the target. The caller can therefore only obtain tokens for things it may already reach, so directing the deputy elsewhere is not expressible. File descriptors are the familiar partial example, and Capsicum and seL4 are fuller realisations.

**Step 6: Note the aggravating detail.** `CAP_SYS_ADMIN` is so broad it recreates much of the all-or-nothing problem, so even the blast-radius benefit is unevenly realised in practice.

**Answer.** They divide ambient authority; they do not bind authority to designation. The name collision is unfortunate and worth stating explicitly in any exam answer touching either concept.
