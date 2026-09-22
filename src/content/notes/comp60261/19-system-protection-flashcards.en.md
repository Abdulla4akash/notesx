---
subject: COMP60261
chapter: 19
title: "System Protection — Flashcards"
language: en
---

# System Protection — Flashcards

46 flashcards. Click each question to reveal the answer.

**Anki:** [Download this deck as `.apkg`](/anki/comp60261/19-system-protection-flashcards.apkg) — import into Anki via *File → Import*.

<details>
<summary><strong>Q1.</strong> Why is a CPU-centric protection model insufficient?</summary>

A modern SoC has <b>many bus masters</b> — GPU, DSP, modem, display, storage, network, DMA engines — that issue memory transactions <b>without passing through the CPU's MMU</b>.<br>Page-table permissions constrain the CPU only, so protection must be enforced on the <b>interconnect</b>.

</details>

<details>
<summary><strong>Q2.</strong> Define DMA and describe how software uses it.</summary>

<b>Direct Memory Access:</b> a device transfers data to/from memory <b>without CPU involvement</b> per word.<br>The driver allocates a buffer, obtains its <b>physical</b> address, programs the device's registers with address and length, starts the transfer, and is notified by <b>interrupt</b>.

</details>

<details>
<summary><strong>Q3.</strong> Why is DMA dangerous?</summary>

The device is handed a <b>raw physical address</b> and performs the access itself, <b>not subject to the MMU</b>.<br>Nothing checks whether the address belongs to the requesting driver, another process, the kernel, or another VM.

</details>

<details>
<summary><strong>Q4.</strong> Name three DMA exploitation shapes.</summary>

A buggy or malicious <b>driver</b> programming a device over kernel memory; compromised <b>peripheral firmware</b> acting on its own; and an external DMA-capable <b>port</b> (Thunderbolt/FireWire) used by a physically present attacker.

</details>

<details>
<summary><strong>Q5.</strong> State the IOMMU's two functions.</summary>

<b>Address translation</b> — device-visible addresses (IOVAs) → physical, via its own page tables; allows scattered backing and extends narrow device address ranges.<br><b>Memory protection</b> — each device/group gets a <b>domain</b> with its own tables, so it reaches only explicitly mapped memory.

</details>

<details>
<summary><strong>Q6.</strong> How does an IOMMU translate a transaction?</summary>

The transaction carries a <b>device identifier</b> (on PCIe, bus/device/function), which selects a context entry pointing at a page-table hierarchy. The IOVA is walked like a CPU virtual address, yielding a physical address and permissions. An <b>IOTLB</b> caches results.

</details>

<details>
<summary><strong>Q7.</strong> Which threats does the IOMMU mitigate?</summary>

Malicious/compromised peripheral firmware; DMA attacks over external ports; buggy drivers using wrong addresses; and it makes <b>safe device passthrough to VMs</b> possible by confining that device's DMA to the guest's memory.

</details>

<details>
<summary><strong>Q8.</strong> What vulnerabilities does the IOMMU itself introduce?</summary>

Its own complexity and page tables (which must be protected); <b>misconfiguration</b> (overly broad or stale mappings) silently removing protection; <b>device grouping</b> forcing devices to share a domain so isolation is coarser than it looks; interrupt remapping correctness; and a <b>boot window</b> before it is configured.

</details>

<details>
<summary><strong>Q9.</strong> What is address bit restriction? Work the 28-line example.</summary>

Simply <b>do not wire</b> some address lines from a device, so it physically cannot name addresses outside a window.<br>28 lines on a 32-bit bus: <code>0 … 2²⁸−1 = 0x0000_0000 … 0x0FFF_FFFF</code> = <b>256 MB</b>. Sensitive memory placed above is untouchable.

</details>

<details>
<summary><strong>Q10.</strong> Give address bit restriction's pros and cons.</summary>

<b>Pros:</b> essentially zero cost, no software management, cannot be misconfigured at runtime or bypassed by firmware — it is wiring.<br><b>Cons:</b> extremely <b>coarse and static</b> — one fixed window per device, no per-process or per-VM granularity, constrains the whole memory map, cannot support passthrough.

</details>

<details>
<summary><strong>Q11.</strong> Describe TrustZone's two worlds and their asymmetry.</summary>

A system-wide split into <b>Secure</b> and <b>Normal (non-secure)</b> worlds, orthogonal to ordinary privilege levels.<br><b>Asymmetry:</b> Secure may access Normal resources; Normal <b>cannot</b> access Secure. A fully compromised Normal OS still cannot reach Secure secrets.

</details>

<details>
<summary><strong>Q12.</strong> What is the NS-bit and why is it architecturally important?</summary>

Security state propagated as an <b>extra bit on the system bus</b> — effectively &quot;+1 address width&quot;, giving two physical address spaces.<br>Important because enforcement is <b>system-wide, not CPU-only</b>: since the bit travels with every transaction, <b>DMA-capable peripherals are covered too</b>.

</details>

<details>
<summary><strong>Q13.</strong> What is the Secure Monitor's role?</summary>

It runs at the highest privilege (EL3), is entered by a dedicated call (<code>SMC</code>), and is the <b>sole gatekeeper of world switches</b> — saving and restoring state.<br>Small, highly trusted, and critical to correctness.

</details>

<details>
<summary><strong>Q14.</strong> Give two TrustZone use cases and the key caveat.</summary>

<b>Encrypted filesystem</b> — keys and crypto stay Secure-world, so the Normal OS never sees the key.<br><b>Biometric authentication</b> — sensor and matching are Secure-world-owned; Normal receives only yes/no.<br><b>Caveat:</b> the Secure world is a full software stack that can itself be buggy — trusted by everything, inspectable by nothing.

</details>

<details>
<summary><strong>Q15.</strong> State the law of leaky abstractions and its security consequence.</summary>

Every abstraction eventually exposes details of what it hides.<br>Security fails at the leak because the <b>argument was made at the abstraction level while the attack occurs at the implementation level</b> — which is why isolation must be enforced at each layer.

</details>

<details>
<summary><strong>Q16.</strong> Why did virtualisation need another privilege level?</summary>

A guest OS expects ring 0 to manage page tables and devices, but the hypervisor must be <b>more</b> privileged to retain control. Two entities cannot both own ring 0.<br>Answer: a distinct mode — Intel <b>VMX root</b>, ARM <b>EL2</b>, RISC-V <b>HS-mode</b>.

</details>

<details>
<summary><strong>Q17.</strong> Explain the &quot;negative rings&quot; model.</summary>

Informally the hypervisor is <b>ring −1</b>, below ring 0; SMM or a Secure Monitor is called −2, and platform management engines −3.<br>Not architectural terminology, but it conveys that <b>privilege kept being added below what was once the floor</b> — each layer more trusted and less inspectable.

</details>

<details>
<summary><strong>Q18.</strong> What is a VM exit, and why does it dominate hypervisor design?</summary>

A transition from guest (non-root) to hypervisor (root) when the guest does something requiring mediation; VM entry is its counterpart.<br>Exits are the <b>interposition points</b> and each is expensive, so <b>minimising exit frequency</b> drives design.

</details>

<details>
<summary><strong>Q19.</strong> What are the VMCS and VMCB?</summary>

Per-vCPU VM control structures — Intel <b>VMCS</b>, AMD <b>VMCB</b> — holding guest state, host state, and control fields determining which events cause exits.

</details>

<details>
<summary><strong>Q20.</strong> Explain two-stage translation and name the hardware.</summary>

<b>Stage 1:</b> guest virtual → guest physical, controlled by the <b>guest</b> as on real hardware.<br><b>Stage 2:</b> guest physical → host physical, controlled by the <b>hypervisor</b>, invisible to the guest.<br>Intel <b>EPT</b>, AMD <b>NPT/RVI</b>, ARM <b>stage-2 tables</b>.

</details>

<details>
<summary><strong>Q21.</strong> What is two-stage translation's benefit and cost?</summary>

<b>Benefit:</b> the guest manages its page tables with <b>no VM exits</b> — the decisive advantage over shadow page tables, which had to write-protect guest tables and trap every update.<br><b>Cost:</b> a full walk traverses both levels (up to ~24 accesses on 4-level paging); the TLB caches the <b>composed</b> translation so hits are native-speed.

</details>

<details>
<summary><strong>Q22.</strong> Why do VMIDs and IOMMU domain IDs matter for security, not just speed?</summary>

<b>VMID/ASID</b> tagging lets TLB entries for different VMs coexist without flushing — and correct tagging is what <b>prevents one VM hitting on another's cached translations</b>.<br><b>IOMMU domain IDs</b> bind each device to the right guest's tables, which is what makes passthrough safe.

</details>

<details>
<summary><strong>Q23.</strong> What is a VM escape and why is it the critical cloud threat?</summary>

A guest breaking out to control the hypervisor or host, thereby reaching other guests.<br>Critical because in multi-tenant cloud the hypervisor is the <b>only</b> boundary between hostile tenants — its failure compromises every VM on the machine.

</details>

<details>
<summary><strong>Q24.</strong> Where is the hypervisor attack surface concentrated?</summary>

<b>Device model / emulation code</b> — large and parsing guest-controlled input, historically the most productive source — plus VirtIO back-ends, the instruction emulator, nested paging management, and hypercall interfaces.

</details>

<details>
<summary><strong>Q25.</strong> Why is hypervisor formal verification pursued, and what is the caveat?</summary>

The interface is <b>narrow</b> compared with a kernel's syscalls and the core is small — the profile where proof is tractable. <b>seL4</b> is ~10k lines and verified.<br><b>Caveat:</b> verification covers the proved core under stated assumptions; <b>device models</b>, the actual bug farm, are typically outside it — hence deprivileging them instead.

</details>

<details>
<summary><strong>Q26.</strong> Compare the three ways a hypervisor gives a guest &quot;hardware&quot;.</summary>

<b>Passthrough:</b> real device, near-native, needs an <b>IOMMU</b>; loses sharing, migration, and interposition.<br><b>Full emulation:</b> models a real device (e1000), unmodified guest driver works, but register accesses trap — worst performance.<br><b>Paravirtualised:</b> virtualisation-aware interface plus a guest driver; far faster than emulation.

</details>

<details>
<summary><strong>Q27.</strong> What are VirtIO's components?</summary>

A <b>front-end driver</b> in the guest, a <b>back-end</b> in the hypervisor or a userspace process, and <b>virtqueues</b> — shared ring buffers — between them.<br>Requests are batched per notification, data moves by reference, and notification suppression eliminates exits under load.

</details>

<details>
<summary><strong>Q28.</strong> Where is VirtIO's attack surface, and why is it serious?</summary>

The <b>shared virtqueues and the back-end parsing them</b>. The guest fully controls descriptors, indices, lengths, and buffer addresses — so the back-end parses <b>hostile input on the host side</b> of the boundary.<br>A back-end trusting a length or address is a <b>guest-to-host escape</b>.

</details>

<details>
<summary><strong>Q29.</strong> How is VirtIO's back-end risk mitigated?</summary>

Run it in a <b>deprivileged userspace process</b> (QEMU, and more so vhost-user), so a back-end compromise is contained rather than immediately meaning hypervisor or kernel compromise.

</details>

<details>
<summary><strong>Q30.</strong> Name the three states of data and how the first two are protected.</summary>

<b>At rest</b> — storage encryption (dm-crypt, SEDs).<br><b>In transit</b> — transport encryption (TLS).<br><b>In use</b> — loaded in memory and being processed.

</details>

<details>
<summary><strong>Q31.</strong> Why is protecting data <i>in use</i> fundamentally harder?</summary>

The CPU must <b>operate on plaintext</b> — values must be in registers and cache for arithmetic and comparison. So the data is necessarily decrypted somewhere, and whoever controls that place can read it.<br>Encryption alone cannot help, because the computation requires cleartext.

</details>

<details>
<summary><strong>Q32.</strong> State the cloud VM threat scenario for data in use.</summary>

The provider's hypervisor maps the guest's memory and can read it at will. A malicious administrator, compromised host, or legal compulsion all yield the tenant's data.<br>The tenant must trust the provider's <b>entire</b> stack — the TCB problem confidential computing addresses.

</details>

<details>
<summary><strong>Q33.</strong> Define confidential computing and name implementations.</summary>

Protecting <b>data in use</b> in a hardware-enforced environment isolated from privileged software, removing the OS, hypervisor, and operator from the TCB.<br>Intel <b>SGX/TDX</b>, AMD <b>SEV/SEV-SNP</b>, ARM <b>CCA</b> — differing mainly in <b>granularity</b> (enclave / VM / realm).

</details>

<details>
<summary><strong>Q34.</strong> Name confidential computing's key functional blocks.</summary>

<b>Isolation/access control</b> (page tagging or a protection check); <b>memory encryption</b>; <b>attestation</b>; <b>key management and sealing</b>; and a small <b>trusted monitor</b> managing lifecycle.

</details>

<details>
<summary><strong>Q35.</strong> What is inside and outside the confidential-computing threat model?</summary>

<b>Inside:</b> malicious hypervisor, host OS, and operator; other tenants; physical attackers reading DRAM or the bus.<br><b>Outside:</b> <b>availability</b> (privileged software can refuse to schedule); <b>side channels</b> (cache, timing, transient — which have repeatedly broken these systems); bugs <b>inside</b> the environment; and <b>the vendor</b>, an unauditable trust anchor.

</details>

<details>
<summary><strong>Q36.</strong> What is remote attestation?</summary>

The environment produces a <b>measurement</b> (a hash of loaded code and configuration) signed by a hardware key chaining to the vendor. A verifier checks the signature and compares the measurement before provisioning secrets.<br>Without it, confidentiality is guaranteed to an <b>unknown party</b>.

</details>

<details>
<summary><strong>Q37.</strong> Why did ARM extend TrustZone's two states to four?</summary>

Two states suffice for a device vendor's secrets but not for <b>mutually distrusting tenants</b> on shared infrastructure — there is only one Secure world and the platform owner controls it.

</details>

<details>
<summary><strong>Q38.</strong> Name ARM CCA's four security states.</summary>

<b>Non-secure</b> (normal OS and hypervisor), <b>Secure</b> (traditional TrustZone), <b>Realm</b> (confidential workloads), and <b>Root</b> (the most privileged monitor).

</details>

<details>
<summary><strong>Q39.</strong> What is a realm, and what is CCA's central design idea?</summary>

A protected environment — typically a VM — isolated from the Non-secure hypervisor that nonetheless <b>schedules</b> it.<br>Central idea: <b>separating management from access</b> — the untrusted hypervisor keeps resource management while being denied visibility.

</details>

<details>
<summary><strong>Q40.</strong> What is the RMM?</summary>

The <b>Realm Management Monitor</b>, running in Realm-EL2, handling realm lifecycle — creation, memory delegation, entry and exit — with the Root world monitor (EL3) above it. Small and deliberately trusted.

</details>

<details>
<summary><strong>Q41.</strong> How does CCA's hardware page tagging work, and why tags rather than translation?</summary>

Every physical page is <b>tagged with the security state that owns it</b>, checked on each access; memory is explicitly <b>delegated</b> and <b>undelegated</b>, and scrubbed on transition.<br>Tags rather than translation because a translation scheme would rely on the <b>hypervisor's</b> stage-2 tables — the very entity being distrusted.

</details>

<details>
<summary><strong>Q42.</strong> What is the Granularity Protection Check and what does it defend against?</summary>

A hardware access check consulting a <b>Granule Protection Table</b> recording which security state owns each granule; accessor state is compared and mismatches fault.<br>Defends against <b>software</b> attacks from privileged code — independent of the tables the hypervisor controls.

</details>

<details>
<summary><strong>Q43.</strong> What is the Memory Encryption Engine and what does it defend against?</summary>

It encrypts (and in stronger variants integrity-protects) data leaving the SoC for DRAM, with keys held in hardware.<br>Defends against <b>physical</b> attacks — bus probing, cold-boot, interposers, or removing the DIMM.

</details>

<details>
<summary><strong>Q44.</strong> Contrast GPC with MEE and give their sequential operation.</summary>

<b>GPC = software</b> attacks, on the access path inside the SoC. <b>MEE = physical</b> attacks, at the SoC boundary. Neither substitutes for the other.<br><b>Sequence:</b> translate → <b>GPC</b> validates the accessor's state may reach the granule → if fetched from DRAM, <b>MEE</b> decrypts inbound → MEE encrypts on writeback.

</details>

<details>
<summary><strong>Q45.</strong> How does a realm perform I/O through an untrusted host?</summary>

Via <b>securely shared memory</b>: the realm encrypts and authenticates the payload with a key the host lacks, copies it into a buffer whose granules are tagged Non-secure-accessible, and signals the host, which performs the device I/O. Inbound data is copied into private memory and verified there.

</details>

<details>
<summary><strong>Q46.</strong> What can the host still do to realm I/O, and what leaks?</summary>

It can <b>delay, drop, reorder, or replay</b> — so <b>availability and freshness are not guaranteed</b> and anti-replay must be built in. It cannot read private memory (GPC) or undetectably alter payloads (authentication).<br><b>Leaks:</b> traffic <b>metadata</b> — sizes, timing, frequency.

</details>
