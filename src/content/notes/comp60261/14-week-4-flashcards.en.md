---
subject: COMP60261
chapter: 14
title: "Week 4 — Flashcards"
language: en
---

# Week 4 — Operating Systems, Part 2 — Flashcards

40 flashcards. Click each question to reveal the answer.

**Anki:** [Download this deck as `.apkg`](/anki/comp60261/14-week-4-flashcards.apkg) — import into Anki via *File → Import*.

<details>
<summary><strong>Q1.</strong> Name the storage stack layers from the top down.</summary>

File systems (ext4/XFS/Btrfs) under a unifying <b>VFS</b>; page cache; device mapper (LVM, RAID, snapshots, dm-crypt); block layer (queuing, merging, I/O scheduling); low-level drivers (NVMe, AHCI/SATA, SCSI).

</details>

<details>
<summary><strong>Q2.</strong> Why does the page cache have security implications?</summary>

It caches file data in RAM, so <code>write()</code> returning does not mean data is on disk (hence <code>fsync</code>).<br>The caching is <b>measurable</b>, making it a side channel for inferring what other users have accessed.

</details>

<details>
<summary><strong>Q3.</strong> What does dm-crypt achieve in TCB terms?</summary>

Full-disk encryption protects data at rest against physical access and <b>removes the disk from the confidentiality TCB</b>.

</details>

<details>
<summary><strong>Q4.</strong> Why is the kernel network stack such a valuable attack surface?</summary>

It parses <b>fully attacker-controlled input, in the kernel, at highest privilege, with no local access required</b>.<br>Hence the heavy fuzzing and hardening effort directed at it.

</details>

<details>
<summary><strong>Q5.</strong> State the process-level security invariants the OS must maintain.</summary>

A process cannot read/write another's memory without mediated permission (<code>ptrace</code>, shared memory, <code>/proc/pid/mem</code> — all access-controlled); cannot access kernel memory; cannot escalate privilege except via sanctioned paths; cannot exhaust resources to deny service (rlimits, cgroups).

</details>

<details>
<summary><strong>Q6.</strong> State the user-level security invariants.</summary>

Users cannot access each other's files except as ownership and mode permit; cannot interfere with each other's processes (signalling and <code>ptrace</code> restricted to matching UID or root); must authenticate to assume an identity, with privileged operations restricted to authorised identities.

</details>

<details>
<summary><strong>Q7.</strong> Why is every kernel vulnerability so severe?</summary>

It can violate <b>all</b> process-level and user-level invariants at once, since they all rest on correct kernel enforcement.

</details>

<details>
<summary><strong>Q8.</strong> What do SMEP, SMAP, and KPTI each do?</summary>

<b>SMEP:</b> prevents the kernel executing userspace pages.<br><b>SMAP:</b> prevents the kernel accidentally accessing userspace data.<br><b>KPTI:</b> separates kernel and user page tables entirely.

</details>

<details>
<summary><strong>Q9.</strong> Name the kernel-specific bug classes beyond ordinary memory errors.</summary>

Missing/incorrect validation of syscall arguments (especially user pointers and lengths); <b>TOCTOU races</b>; infoleaks including uninitialised struct padding (defeating KASLR); and confused-deputy situations.

</details>

<details>
<summary><strong>Q10.</strong> Give the classic file-based TOCTOU example.</summary>

Checking a path with <code>access()</code> then opening it — an attacker swaps in a symlink between the check and the use.<br>Consequence of a kernel bug is typically local privilege escalation to full root/kernel control.

</details>

<details>
<summary><strong>Q11.</strong> What does seccomp-BPF do and why is it effective?</summary>

Installs a filter the kernel evaluates <b>per syscall</b>, allowing, denying, or killing.<br>Most programs need only a small subset of syscalls, so it dramatically shrinks reachable kernel code. It is the primary sandboxing primitive for containers and browsers.

</details>

<details>
<summary><strong>Q12.</strong> Name kernel-specific runtime defences.</summary>

KASLR, stack canaries, NX, read-only-after-init for constant data, hardened usercopy checks, SLUB freelist pointer obfuscation, and kernel CFI.

</details>

<details>
<summary><strong>Q13.</strong> Which tools find kernel bugs, and what does each do?</summary>

<b>syzkaller:</b> fuzzes the syscall interface by generating syscall sequences — thousands of bugs found.<br><b>KASAN/KMSAN/KCSAN:</b> sanitizers for memory errors, uninitialised reads, data races.<br><b>Coccinelle/Smatch/sparse:</b> static analysis. <b>Linux Test Project:</b> functional tests.

</details>

<details>
<summary><strong>Q14.</strong> What does &quot;discretionary&quot; mean in DAC?</summary>

The <b>resource owner</b> sets the policy at their own discretion — you may <code>chmod</code> your own files however you like.

</details>

<details>
<summary><strong>Q15.</strong> How does traditional Unix DAC make a decision?</summary>

Each process carries a UID/GID; each file carries owner UID, group GID, and permission bits for owner/group/other × read/write/execute. The kernel compares the two.

</details>

<details>
<summary><strong>Q16.</strong> What is the setuid bit, and why is it dangerous?</summary>

It makes a program execute with the <b>file owner's</b> UID rather than the caller's — necessary for tools like <code>passwd</code>.<br>A perennial source of privilege-escalation bugs, since attacker-controlled input reaches privileged code.

</details>

<details>
<summary><strong>Q17.</strong> Name four weaknesses of DAC.</summary>

All-or-nothing root; <b>ambient authority</b> (a process wields all its user's rights all the time); users cannot be prevented from setting bad policy; and the confused deputy problem.

</details>

<details>
<summary><strong>Q18.</strong> What are Linux capabilities, and what is their limitation?</summary>

They decompose root into ~40 distinct privileges (<code>CAP_NET_BIND_SERVICE</code>, <code>CAP_SYS_ADMIN</code>, …).<br>But <code>CAP_SYS_ADMIN</code> is so broad it recreates much of the all-or-nothing problem.

</details>

<details>
<summary><strong>Q19.</strong> Explain the confused deputy problem.</summary>

A privileged program is tricked into misusing its authority for a less-privileged caller.<br>The program has the right to act; the caller does not; the program cannot tell the request came from someone unauthorised.

</details>

<details>
<summary><strong>Q20.</strong> What is the root cause of confused deputy, and which systems are prone to it?</summary>

Failure to distinguish <b>authority</b> from <b>designation</b> — the caller supplies the name, the deputy supplies the authority.<br><b>Ambient-authority</b> systems are structurally prone to it. It is not a memory-safety bug.

</details>

<details>
<summary><strong>Q21.</strong> How does MAC differ from DAC, and how do they combine?</summary>

MAC policy is set <b>centrally by an administrator</b> and cannot be overridden by resource owners — even root is constrained.<br>It complements rather than replaces DAC: <b>both must permit</b> an access.

</details>

<details>
<summary><strong>Q22.</strong> What is the LSM framework?</summary>

Kernel hook points at security-relevant decisions, letting modules implement policy.<br>SELinux, AppArmor, Smack, and TOMOYO are all LSMs.

</details>

<details>
<summary><strong>Q23.</strong> How does SELinux make decisions?</summary>

Every subject and object carries a <b>security context</b> (user:role:type:level); decisions are primarily by <b>type enforcement</b> — rules state which subject types may perform which operations on which object types.<br>Anything not explicitly allowed is <b>denied</b>.

</details>

<details>
<summary><strong>Q24.</strong> Give SELinux's main pros and cons.</summary>

<b>Pros:</b> fine-grained, default-deny, confines even root daemons, mature (RHEL, Android), limits blast radius.<br><b>Cons:</b> large complex policies, steep learning curve, hard to debug, and tempting to disable rather than fix denials.<br>AppArmor trades granularity for usability with path-based profiles.

</details>

<details>
<summary><strong>Q25.</strong> Define a capability in the capability-systems sense.</summary>

An <b>unforgeable token</b> that simultaneously <i>designates</i> a resource and <i>conveys the authority</i> to use it.<br>There is no ambient authority to be confused.

</details>

<details>
<summary><strong>Q26.</strong> Why do capabilities largely solve the confused deputy problem?</summary>

Designation and authority travel <b>together</b>, so a caller must pass a capability for the object it wants touched — it can only direct the deputy at things it could already reach.

</details>

<details>
<summary><strong>Q27.</strong> Why are file descriptors a partial capability example?</summary>

An fd designates an open file and carries rights fixed at <code>open</code> time, and can be passed between processes over Unix sockets.<br>Fuller realisations: <b>seL4</b>, <b>Capsicum</b>.

</details>

<details>
<summary><strong>Q28.</strong> What terminology collision must you avoid around &quot;capabilities&quot;?</summary>

<b>Linux capabilities are not capabilities</b> in the capability-systems sense.<br>They partition root's ambient privileges; they are not unforgeable object references.

</details>

<details>
<summary><strong>Q29.</strong> What is a TEE, and what TCB problem does it solve?</summary>

An isolated execution environment whose confidentiality and integrity hold <b>even against privileged software</b> — OS, hypervisor, and machine administrator.<br>It removes those from the TCB, ideally leaving only the CPU and your own code.

</details>

<details>
<summary><strong>Q30.</strong> Name the four key characteristics of a TEE.</summary>

Isolated execution (protected, usually encrypted memory); a <b>minimal TCB</b>; <b>remote attestation</b>; and sealing (binding secrets to a measured code identity).

</details>

<details>
<summary><strong>Q31.</strong> How does remote attestation work, and why is it essential?</summary>

The environment produces a <b>measurement</b> (hash of loaded code and configuration) signed by a hardware key chaining to the vendor; a verifier checks it before provisioning secrets.<br>Without it a TEE is nearly useless remotely — you could not tell your code from an attacker's substitute.

</details>

<details>
<summary><strong>Q32.</strong> Contrast SGX, TrustZone, and SEV by granularity.</summary>

<b>SGX:</b> application-level <b>enclaves</b> within a process.<br><b>TrustZone:</b> a system-wide <b>secure world</b> vs normal world, switched via a monitor; pervasive in mobile.<br><b>SEV:</b> whole-<b>VM</b> memory encryption with a key the hypervisor lacks (SEV-SNP adds integrity and attestation).<br>Progression: part of a process → part of a system → whole VM. Larger granularity means bigger internal TCB but far less porting.

</details>

<details>
<summary><strong>Q33.</strong> What are SGX's practical costs?</summary>

Enclave code cannot make syscalls directly (expensive transitions), protected memory is limited, and applications must be ported.<br>Repeatedly broken by side-channel and transient-execution attacks it explicitly does not defend against.

</details>

<details>
<summary><strong>Q34.</strong> State four honest limits of TEEs.</summary>

<b>Side channels</b> (cache, timing, speculative) are largely out of scope and have repeatedly broken them; the hardware vendor becomes an unauditable trust anchor; <b>availability is not protected</b> (privileged software can refuse to schedule you); and bugs inside the enclave are as exploitable as anywhere, with less visibility.

</details>

<details>
<summary><strong>Q35.</strong> What is the axis of the OS design space?</summary>

How much functionality runs <b>privileged in the kernel</b> versus in isolated userspace components — trading performance (no crossings) against security and robustness (independent failure).

</details>

<details>
<summary><strong>Q36.</strong> Monolithic kernel: benefits and costs?</summary>

All OS services in one privileged address space (Linux, Windows, BSD). Fast, since subsystems call directly.<br>But the entire kernel — millions of lines, much of it drivers — is in the TCB, so any bug anywhere is full compromise.

</details>

<details>
<summary><strong>Q37.</strong> What does a microkernel provide, and what is seL4's significance?</summary>

Only address spaces, threads, scheduling, and IPC; filesystems, drivers and network stacks run as isolated userspace servers, so a driver bug crashes one server.<br><b>seL4</b> is ~10k lines and <b>formally verified</b> — a genuinely different assurance level. Cost is IPC overhead per cross-server interaction. Used in avionics, automotive, secure enclaves.

</details>

<details>
<summary><strong>Q38.</strong> What is an exokernel?</summary>

The kernel only multiplexes and protects raw hardware; applications link <b>library OSes</b> implementing whatever abstractions they want.<br>Maximum flexibility; security rests on the resource-protection layer. More influential than deployed.

</details>

<details>
<summary><strong>Q39.</strong> What is a unikernel, and where does its security come from?</summary>

Application compiled together with just the library-OS functionality it needs into a single specialised image, usually on a hypervisor.<br>Security comes mainly from <b>attack-surface reduction</b> (no shell, no unused drivers). Downsides: single address space means no internal isolation, and weak tooling.

</details>

<details>
<summary><strong>Q40.</strong> What is the overall lesson of the OS models material?</summary>

A direct trade-off between <b>TCB size and performance</b>; the models are points along it.<br>Monolithic won on performance and ecosystem; microkernels win on assurance. Modern practice borrows microkernel ideas — userspace drivers, sandboxed services, seccomp, hypervisor-backed integrity — to shrink effective trust without losing the ecosystem.

</details>
