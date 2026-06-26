---
subject: COMP60261
chapter: 7
title: "Hardware Fundamentals"
language: en
---

# COMP60261 - Secure Computer Architecture and Systems
# Hardware Lecture 1: Fundamentals - Study Notes

**Source used:** uploaded slide deck, `Lecture 1 - Fundamentals.pdf`.

**Transcript status:** no lecture transcript text was included in the conversation. These notes are grounded in the slides only. Transcript-dependent gaps are marked **[UNCLEAR]** rather than filled in from outside knowledge.

**Topic and scope:** This lecture introduces why hardware matters for system security, tracing modern memory-safety vulnerabilities back to von Neumann architecture and integer pointers, then covering hardware-assisted pointer protections including ARM PAC/BTI/MTE, CHERI, and CHERIoT.

**Broader role in the course:** This is the foundation for later material on secure computer architecture. It motivates why software-only security is insufficient and why hardware mechanisms are needed to enforce memory safety, control-flow integrity, and compartmentalisation.

---

## 1. Why hardware matters for security

### 1.1 Hardware as the foundation of computing systems

**Definition - hardware:**  
Hardware refers to the physical components forming the foundational layer of a computing system, on which all software relies.

This includes:

- Central processing unit, or CPU.
- Memory, especially RAM.
- Storage devices.
- Motherboard.
- Interconnected electronic circuits.

### 1.2 Hardware is not just a passive platform

In this course's security-focused context, hardware is presented as an **active security foundation**, not merely something software runs on.

The key claim is:

- Software is malleable.
- Because software can be changed, bypassed, or corrupted, it cannot fully secure itself.
- System security therefore needs the **inflexibility of hardware**.
- Hardware provides the physical layer that can enforce rules software cannot bypass.

**Intuition:**  
If the attacker can change the software, then software-based rules alone are weak. Hardware-enforced rules are harder to evade because they are built into the execution substrate.

**Connection:**  
This sets up the rest of the lecture: memory safety problems arise because hardware historically treated pointers as ordinary integers, and modern secure architectures try to add hardware-enforced meaning back into pointers.

---

## 2. Von Neumann architecture: computing's "original sin"

### 2.1 The von Neumann model

Almost all modern computers use the von Neumann model of computation, first described in 1945.

The key feature is that **one memory stores both**:

- Software instructions.
- Application data.

This is the **stored-program computer** model.

The slide diagram shows:

- CPU containing:
  - Control Unit.
  - Arithmetic/Logic Unit.
- Memory Unit connected to CPU.
- Input device.
- Output device.

### 2.2 Why the model is described as "fundamentally insecure"

The lecture calls this architecture computing's **"original sin"** because code and data share the same memory space.

The two core security problems are:

- Any code can read/write any data.
- Any data can be executed as code.

**Intuition:**  
If data and code are both just bytes in memory, then a corruption of data can become corruption of control flow. Attackers exploit this by turning data into executable behaviour, or by rewriting control data so that existing code is executed in unintended ways.

**Connection:**  
This directly motivates later material on:

- Buffer overflows.
- Code injection.
- Return-oriented programming.
- Jump-oriented programming.
- Execute Never / XN.
- ARM PAC, BTI, and CHERI.

---

## 3. Control Unit and the Fetch-Decode-Execute cycle

### 3.1 Control Unit

The **Control Unit**, or CU, coordinates instruction execution.

The slide describes the instruction cycle as:

1. Fetch.
2. Decode.
3. Execute.
4. Write back results.

### 3.2 Fetch

**Formal slide definition:**  
The Control Unit retrieves the next instruction from the memory location pointed to by the **Program Counter**, or **PC**, register.

Clean notation:

```text
instruction <- Memory[PC]
```

or:

$$
\text{instruction} \leftarrow \text{Memory}[\text{PC}]
$$

### 3.3 Decode

**Formal slide definition:**  
The CU interprets the instruction, determining:

- The operation to be performed.
- The required operands.

Clean notation:

$$
(\text{operation}, \text{operands}) \leftarrow \text{decode}(\text{instruction})
$$

### 3.4 Execute

**Formal slide definition:**  
The CU sends signals to the appropriate components, typically the **Arithmetic Logic Unit**, or **ALU**, and writes back any result into memory.

Clean notation:

$$
\text{result} \leftarrow \text{execute}(\text{operation}, \text{operands})
$$

$$
\text{Memory/register state} \leftarrow \text{result}
$$

### 3.5 Link to processes

The slide states that **sequential execution of instructions within a defined state establishes the concept of a process as a distinct execution context**.

**Definition - process, from lecture context:**  
A process is a distinct execution context formed by sequential instruction execution together with its associated state.

**Connection:**  
Later security mechanisms must protect the state of one process, compartment, or execution context from misuse by another.

---

## 4. Computers started without pointers

### 4.1 Fixed physical addresses in early machines

In late-1940s computers, instructions were architecturally rigid.

An instruction's machine code contained:

- A fixed physical memory address.
- This address was unchangeable unless the instruction itself was rewritten.

This was a serious bottleneck for common programming tasks, such as looping through a list of numbers.

### 4.2 The self-modifying code workaround

Because there were no pointer/index-register mechanisms, programmers wrote code that modified its own instructions.

The slide gives this example sequence for processing each element of a list:

1. **Fetch instruction**  
   Load the target instruction from memory.

   Example:

   ```text
   LOAD address 100
   ```

2. **Calculate new address**  
   Use an `ADD` instruction to increment the address portion of that instruction's code.

3. **Store instruction**  
   Store the modified instruction back into memory, overwriting the original.

4. **Execute**  
   The CPU executes the modified instruction.

   Example:

   ```text
   LOAD address 101
   ```

### 4.3 Worked example: looping over a list without pointers

Suppose a programmer wants to load consecutive list elements from addresses 100, 101, 102, ...

Without pointer/index-register support:

```text
Initial instruction: LOAD 100
```

For the next list element:

```text
Fetch LOAD 100
Modify address field: 100 + 1 = 101
Store modified instruction: LOAD 101
Execute LOAD 101
```

Then repeat:

```text
Fetch LOAD 101
Modify address field: 101 + 1 = 102
Store modified instruction: LOAD 102
Execute LOAD 102
```

**Key point:**  
The program is not just updating data. It is rewriting its own code.

**Connection:**  
This is an early example of software adapting itself to hardware limitations. The lecture later connects this to COBOL's `ALTER` statement and long-term technical debt.

---

## 5. Manchester breakthrough: the B-Line Register

### 5.1 What the B-Line Register did

In 1949, the **B-line registers** were the first-ever index registers.

**Definition - B-line register:**  
A dedicated hardware register designed to hold a memory address offset.

Its purpose was to automate address modification directly within the CPU.

### 5.2 How it worked

The slide gives the mechanism:

1. An instruction was marked with a bit telling the CPU to use the B-register.
2. When executing the instruction, the CPU took:
   - The base address written in the instruction.
   - The value stored in the B-register.
3. The CPU added them together.
4. The sum became the **effective address** used for memory access.

Clean formula:

$$
\text{effective address} = \text{base address in instruction} + \text{B-register offset}
$$

or:

$$
EA = A_{\text{base}} + B
$$

### 5.3 Why this mattered

The crucial innovation:

- The original instruction stored in memory was never touched.
- Address calculation happened inside hardware.
- This eliminated the need for slow self-modifying code loops.

**Intuition:**  
Instead of modifying the instruction to say "load address 101," the instruction can stay as "load base address," and the hardware adds an offset at execution time.

**Connection:**  
This is the historical path toward modern pointers. It begins the transition from self-modifying code to hardware-supported address calculation.

---

## 6. COBOL's `ALTER`: legacy of early hardware

### 6.1 What COBOL was

COBOL stands for **Common Business-Oriented Language**.

It was designed in 1959 and became the dominant high-level language for mainframe business applications.

It was created for:

- Readability.
- Maintainability.
- Business applications.

The slides note that COBOL still underpins many core systems in:

- Finance.
- Insurance.
- Government.

### 6.2 `ALTER` as a performance hack

The `ALTER` statement allowed a high-level language to enable a low-level self-modifying-code trick.

Although early mainframes such as the IBM 7090 had index registers, loops still had performance costs.

The slide identifies two bottlenecks:

#### Bottleneck 1: Register scarcity

Some early systems had as few as three index registers.

That made registers precious resources, needed for complex calculations rather than just simple loops.

#### Bottleneck 2: Expensive branching

Every loop required instructions to:

- Increment the index.
- Compare it to a limit.
- Perform a conditional branch.

Branching was slow and inefficient on early hardware.

### 6.3 Why programmers continued using self-modifying code

To maximize performance:

- Programmers kept using self-modifying code.
- By directly changing a memory address inside an instruction, a loop could run with a faster unconditional jump.
- COBOL's `ALTER` statement enabled this.

**Trade-off:**  
`ALTER` traded code clarity for raw speed.

### 6.4 Cost of legacy

The `ALTER` statement was not made obsolete until the **COBOL-85** standard.

By then, the original hardware bottlenecks had already been removed by hardware evolution.

Modern processors had:

- More abundant and faster registers.
- Branch prediction.
- Pipelining.

The slide states that legacy self-modifying code later became a cause of massive performance penalties because it forced the CPU to discard pre-fetched and pipelined instructions.

### 6.5 Technical debt lesson

The slide's lesson:

Software design decisions made to overcome hardware limitations can create long-term technical debt.

Even after hardware evolves and makes the hack obsolete, the software practice may persist for decades.

**Connection:**  
This is an important historical analogy for memory safety. Early hardware choices about pointers created vulnerabilities that still affect modern systems.

**[UNCLEAR]** Slide wording says "Processors many more general-purpose and index registers," which appears to be missing a verb. The intended meaning is that processors had many more general-purpose and index registers.

---

## 7. The pointer as a simple integer value

### 7.1 Hardware formalised pointers in the simplest possible way

The invention of the B-register and later **General-Purpose Registers**, or **GPRs**, formalised the pointer in hardware.

But this was done in the simplest possible way:

> An address is just a number.

### 7.2 Pointer definition in this model

**Definition - pointer, in the simple hardware model:**  
A pointer to a memory location is simply the integer value stored in a register or memory location.

The hardware does not inherently know whether the value is "data" or "an address."

### 7.3 Example: `0x4000`

The slide uses the hexadecimal value:

$$
0x4000
$$

This may be interpreted as:

- The integer value:

$$
16384
$$

- The memory address:

$$
16384
$$

The CPU distinguishes the meaning only based on the instruction.

Examples:

```text
ADD instruction  -> treat 0x4000 as a number
LOAD instruction -> treat 0x4000 as an address to fetch from
```

### 7.4 Backward compatibility

The slides note that this simple model was backward-compatible with pre-pointer written code.

**Key trade-off:**  
The simplicity of integer pointers made them efficient and compatible, but also stripped away safety information.

---

## 8. Exposing the hardware model to software: C pointers

### 8.1 C as "portable assembly"

The C programming language was designed as a **portable assembly language**.

It directly exposed the raw hardware model to the programmer.

### 8.2 Pointer as a C language construct

C formalised the pointer as:

- A variable type that stores a memory address.
- A variable that holds an unsigned integer.

### 8.3 Pointer arithmetic

C introduced pointer arithmetic.

Example:

```c
ptr++;
```

At the C language level, this is scaled by the compiler based on the size of the pointed-to type.

Examples from the slides:

```c
int *p;
p++;   // increments by 4 bytes
```

```c
char *p;
p++;   // increments by 1 byte
```

Clean formula:

$$
\text{new address} = \text{old address} + \text{sizeof}(*ptr)
$$

### 8.4 Compile-time abstraction only

The slide stresses that pointer arithmetic is only a **compile-time abstraction**.

At machine-code level:

```text
ptr++ = integer addition on the address stored in a CPU register
```

The hardware does not know:

- The pointer's type.
- The object's size.
- The intended bounds of the object.

### 8.5 Consequence

This design gave programmers:

- Very high control.
- Very high performance.

But it also made them directly responsible for managing raw memory addresses.

**Connection:**  
This is the immediate bridge into memory safety vulnerabilities. If the pointer is just an integer, the hardware cannot enforce whether it is being used safely.

---

## 9. Root of insecurity: no metadata, no safety

### 9.1 Core claim

The slides state that representing a pointer as a simple integer is the foundational reason for most modern memory-safety vulnerabilities and enables the majority of cyber attacks.

### 9.2 Missing semantic information

The core problem is that a pointer carries no semantic information.

The CPU does not know:

#### Bounds

The CPU has no information about the size of the memory buffer for which the pointer is valid.

#### Type

The CPU cannot verify that the data at the pointed-to memory location matches the type expected by the program.

#### Lifetime

The CPU does not know whether the memory referred to by the pointer is still allocated or has already been freed.

### 9.3 Why this is exploitable

Because hardware does not enforce bounds, type, or lifetime, attackers can manipulate pointer use to make programs execute outside their intended state.

The slide calls this lack of hardware-enforced context the key attack vector exploited today.

---

## 10. Common vulnerabilities from integer pointers

### 10.1 Buffer overflows

**Definition - buffer overflow:**  
A memory-safety violation where a program writes past the end of an allocated buffer.

**Cause:**  
No bounds information.

**Exploit mechanism:**  
A program uses pointer arithmetic and writes past the end of a buffer.

An attacker can craft the overflow to overwrite adjacent critical data, such as:

- A function return address on the stack.
- Other control data.

This can allow the attacker to seize control of the program's execution flow.

### 10.2 Use-after-free

**Definition - use-after-free:**  
A temporal memory-safety violation where a program uses a pointer after the memory it points to has been freed.

**Cause:**  
No lifetime information.

**Exploit mechanism:**

1. Program frees a memory block.
2. A dangling pointer still holds the block's address.
3. The memory is later reallocated for a new sensitive object.
4. The attacker uses the old dangling pointer to write to that memory.
5. This corrupts the new object's state.

Consequences may include:

- Information leakage.
- Arbitrary code execution.

### 10.3 Type confusion

**Definition - type confusion:**  
A memory-safety violation where a program accesses an object through a pointer of the wrong type.

**Cause:**  
No type or permissions information.

**Exploit mechanism:**  
An attacker tricks a program into reading an object through the wrong type of pointer.

Slide example:

```text
Read a User object through an Admin pointer
```

This misinterprets the object's memory layout.

Consequences:

- Bypassing security checks.
- Accessing private data fields.

---

## 11. Timeline and present state of pointer exploitation

### 11.1 Exploitation timeline

The slide includes a visual timeline of memory-safety exploitation techniques and mitigations.

The figure distinguishes:

- Exploitation techniques, marked with demons.
- Mitigations, marked with shields.

Examples shown on the timeline include:

- Stack smashing.
- Code injection.
- Return-to-libc.
- Heap overflows.
- Format string attacks.
- ASLR.
- Stack canaries.
- NX-bit.
- ROP.
- JOP.
- SROP.
- BOP.
- CFI.
- Shadow stacks.
- ARM PAC.
- Vtable protection.
- Code pointer integrity.

**Connection:**  
The point of the timeline is that attacks and mitigations co-evolved, but the underlying pointer problem persisted.

### 11.2 Modern memory-safety statistics

The slides present three major statistics:

#### Google Project Zero review of 0-days used in the wild in 2021

> 67% were memory corruption vulnerabilities.

#### Google Chromium memory safety

> 70% of serious security bugs are memory safety problems.

#### Matt Miller, Microsoft, BlueHat 2019

> Around 70% of CVEs are memory unsafety issues.

### 11.3 Government concern

The lecture states that governments are increasingly worried about memory safety.

The slide visually references:

- CISA and international cyber agencies: *The Case for Memory Safe Roadmaps*.
- UK National Cyber Strategy 2022.
- UK Semiconductor Strategy.
- White House technical report: *Back to the Building Blocks: A Path Toward Secure and Measurable Software*.

**[IMPORTANCE FLAG]** The "around 70%" memory-safety figure appears repeatedly and is highlighted visually in the slides. Treat this as a high-value motivation statistic for revision.

---

## 12. Conceptual model for memory safety

The slide presents a "Memory Safety Barrier" model.

### 12.1 Above the barrier

Above the barrier:

> Software is running within the defined features of the hardware and software language specification.

That is, execution remains within the intended rules of the program and language.

### 12.2 Below the barrier

Below the barrier:

> Software is executing in an undefined state outside the program intent or software language specification.

This is where memory-safety vulnerabilities become exploitable.

### 12.3 Level 1: testing and bug fixing

**Level 1:**  
Use testing and fixing bugs to attempt to remove the potential for software to reach and pass through the memory safety barrier.

Limitation:

- Many bugs are not found.
- Testing only finds bugs covered by the test suite.

### 12.4 Level 2: memory-safe languages and software verification

**Level 2:**  
Use memory-safe languages and/or software verification tools to find more bugs.

Limitation:

- Software tools and language choices can help find more bugs.
- They can reduce how many bugs developers make.
- They cannot stop all bugs.

### 12.5 Level 3: statistical hardware blocking

**Level 3:**  
Hardware has features that can statistically block software from entering a state of undefined execution.

Effect:

- Attacks become much harder.
- It becomes harder to find and abuse bugs.

Connection:

- ARM MTE is later described as probabilistic because it uses only 4-bit tags.

### 12.6 Level 4: deterministic hardware blocking

**Level 4:**  
Hardware deterministically blocks, architecturally, the ability for software to enter an undefined execution state.

Effect:

- Software would no longer have architectural memory-safety vulnerabilities.

Connection:

- CHERI is later presented as a hardware architecture that provides strong architectural enforcement, and the BLASTPASS example says CHERI deterministically mitigated that vulnerability.

---

## 13. Case study: Heartbleed

### 13.1 Overview

Heartbleed was a security vulnerability disclosed in 2014 in the OpenSSL cryptography library.

The slides state that OpenSSL was used by around 65% of the internet.

It affected:

- Servers.
- Clients.

The response required the world to:

- Identify and patch affected systems.
- Reissue certificates.
- In some cases, replace hardware because certificates were embedded in hardware.

### 13.2 Cause

Heartbleed was caused by improper input validation due to a missing bounds check in the TLS heartbeat "keep alive" protocol extension.

It was classified as a **buffer over-read** vulnerability.

The lecture explicitly links this to the fact that a buffer pointer was just an integer value.

### 13.3 TLS Heartbeat Extension, RFC 6520

The TLS Heartbeat Extension was designed as a keep-alive feature.

Its purpose:

- Let a client or server check whether a peer is still responsive.
- Avoid the overhead of renegotiating the whole secure session.

### 13.4 Intended protocol flow

#### Step 1: HeartbeatRequest

One peer sends a `HeartbeatRequest` message.

It contains two key fields:

1. An arbitrary data string:

```text
payload
```

2. A 16-bit integer specifying its length:

```text
payload_length
```

#### Step 2: HeartbeatResponse

The receiving peer must send back a `HeartbeatResponse`.

The response must contain an exact copy of the original payload.

### 13.5 Echo-service intuition

The protocol works like a simple echo:

```text
Client:  Are you alive? Echo this payload.
Server:  Here is the same payload back.
```

If the response comes back, the connection is active.

---

## 14. Heartbleed vulnerability: missing bounds check

### 14.1 Not a TLS protocol flaw

The slide states clearly:

- Heartbleed was not a flaw in the TLS protocol itself.
- It was a critical implementation error in OpenSSL.

### 14.2 Core issue

The OpenSSL heartbeat-processing code trusted the sender-provided `payload_length`.

It failed to validate:

$$
\text{actual payload size received} = \text{claimed payload\_length}
$$

### 14.3 Why this creates a buffer over-read

The vulnerable server:

1. Allocated a response buffer based on the untrusted claimed length.
2. Copied that many bytes from memory.
3. Started copying from the location of the small actual payload.
4. Continued copying beyond the actual payload into adjacent process memory.

### 14.4 Vulnerable functions

The vulnerability was located in:

```c
dtls1_process_heartbeat()
tls1_process_heartbeat()
```

The slide says the patch was a very simple fix.

### 14.5 Bounds-check formula from the patch

The slide image shows checks of the form:

```c
if (1 + 2 + 16 > s->s3->rrec.length)
    return 0; /* silently discard */
```

and then a further check involving:

```c
1 + 2 + payload + 16
```

The clean interpretation is:

$$
1 + 2 + \text{payload} + 16 \leq \text{record length}
$$

where:

- `1` is the heartbeat message type byte.
- `2` is the payload length field.
- `payload` is the claimed payload length.
- `16` is minimum padding.

**[UNCLEAR]** The code screenshot on slide 20 is partially visible and the second added check is truncated in the parsed slide text. Re-listen to this part or inspect the actual patch if exact syntax is required.

---

## 15. Heartbleed exploit mechanism

### 15.1 Attack idea

An attacker sends a malformed `HeartbeatRequest` that lies about payload length.

### 15.2 Worked exploit example

The slide gives the following values:

```text
Actual payload: "X"       = 1 byte
Claimed payload_length: 65535
```

`65535` is the maximum possible value for a 16-bit length field.

It represents approximately 64 KB.

### 15.3 Server processing

The vulnerable server:

1. Receives the request.
2. Allocates a 64 KB response buffer.
3. Writes the response header.
4. Calls `memcpy()`.
5. Copies the 1-byte payload `"X"`.
6. Continues reading and copying the next 65,534 bytes from its own process memory.

Clean calculation:

$$
65535 - 1 = 65534
$$

So after copying the real 1-byte payload, the server copies 65,534 unintended bytes.

### 15.4 Information disclosure: the "bleed"

The server sends the whole 64 KB response buffer back to the attacker.

The response contains:

- The original 1-byte payload.
- A large arbitrary chunk of private server memory.

---

## 16. Heartbleed impact and consequences

### 16.1 Why it was catastrophic

Heartbleed allowed an unauthenticated remote attacker to read sensitive data directly from memory of affected servers and clients.

### 16.2 Data that could leak

The leaked 64 KB chunks could contain:

#### Primary key material

Examples:

- Server private SSL/TLS keys.

Impact:

- Could allow decryption of communications.

#### Secondary key material

Examples:

- Usernames.
- Passwords.
- Other credentials.

#### Protected content

Examples:

- Session cookies.
- Authentication tokens.
- Sensitive application data.
- Personal information.
- Financial data.

### 16.3 Stealth

The exploit was exceptionally difficult to detect.

Reason:

- It left no traces in standard system logs.
- It was technically a valid Heartbeat message, although malformed.

### 16.4 Fix

The vulnerability was patched in OpenSSL 1.0.1g by adding a simple bounds check.

The check validated that the claimed `payload_length` did not exceed the actual length of the incoming packet.

---

## 17. Modern echo: 2024 CrowdStrike outage

### 17.1 Heartbleed was not isolated

The slides connect Heartbleed to the July 2024 CrowdStrike Falcon sensor outage.

The parallel is:

- A seemingly minor flaw.
- In critical, widely deployed software.
- Causing cascading global failure.

### 17.2 Root-cause comparison

#### Heartbleed, 2014

A missing bounds check in a C function led to a memory disclosure vulnerability.

#### CrowdStrike, 2024

A missing bounds check while parsing a configuration file update for the Falcon security agent caused a panic with the Windows kernel.

This led to Blue Screen of Death, or BSOD, on affected machines.

### 17.3 Shared lesson

Both incidents came from:

- Basic low-level programming or logic errors.
- Not complex or exotic attacks.

Both also occurred in security products intended to protect systems.

This made the security product itself a single point of failure.

**Connection:**  
This reinforces the lecture's central question: why do simple implementation bugs still cause huge failures despite decades of security work?

**[UNCLEAR]** The slide gives the high-level CrowdStrike comparison, but not code-level detail. The transcript may contain more explanation of exactly how the missing bounds check manifested.

---

## 18. Securing the pointer

### 18.1 Why pointer protection is required

The slides repeat that around 70% of reported software vulnerabilities are because of corruption of a memory pointer.

**[UNCLEAR]** The phrase "corruption of a memory pointer" is probably being used as shorthand for memory corruption / memory unsafety involving pointers. Re-listen for the lecturer's precise phrasing.

### 18.2 Two primary classes of memory-safety errors

#### Spatial safety violations

**Formal slide definition:**  
Accessing memory outside the intended bounds of an object.

This is the root cause of buffer overflow vulnerabilities on:

- The stack.
- The heap.

**Intuition:**  
The pointer points to a valid object, but the access goes outside the object's permitted region.

#### Temporal safety violations

**Formal slide definition:**  
Accessing memory after it has been deallocated, or freed.

This is the root cause of use-after-free vulnerabilities, where a dangling pointer is used to access memory that may have been reallocated for another purpose.

**Intuition:**  
The pointer may still contain an address, but the object it originally referred to no longer exists.

---

## 19. Recap: Instruction Set Architecture

### 19.1 Formal definition

**Formal slide definition - ISA:**  
The Instruction Set Architecture, or ISA, is a formal abstract model of a computer that defines the functional interface between low-level software and hardware.

### 19.2 What an ISA specifies

The ISA specifies:

- What the processor is capable of doing.
- Not how the processor implements it.

The ISA is a contract.

It guarantees that software compiled for a specific ISA will run on any processor implementing that ISA, regardless of the processor's microarchitecture.

### 19.3 ISA vs microarchitecture

**ISA:**  
The programmer-visible contract.

**Microarchitecture:**  
The implementation underneath.

The same ISA can be implemented by different microarchitectures.

### 19.4 Examples of ISAs

#### x86

- CISC.
- Proprietary ISA from Intel/AMD.
- Uses complex, variable-length instructions.
- Instructions can perform multi-step operations, such as read-operate-write, in one command.
- Standard for desktops and servers.

#### ARM

- RISC.
- Licensed ISA designed for power efficiency.
- Uses many simple, fixed-length instructions.
- Uses a strict load/store model: data must be in registers to be processed.
- Dominates mobile and embedded markets.

#### RISC-V

- RISC.
- Open-source and royalty-free.
- Modular design.
- Small base instruction set with optional extensions.
- Allows customizable processors for IoT devices through supercomputers.

---

## 20. ARM pointer protection overview

ARM introduced two complementary ISA technologies to address memory safety and control-flow integrity:

1. Pointer Authentication, or PAC.
2. Memory Tagging Extension, or MTE.

The slide also mentions BTI, Branch Target Identification, as part of the layered defence.

### 20.1 Pointer Authentication, PAC

**Function:**  
Protects pointer integrity, especially control data such as:

- Return addresses.
- Function pointers.

**Security question answered:**  

> Has this pointer been illicitly modified since it was created?

### 20.2 Memory Tagging Extension, MTE

**Function:**  
Protects validity of memory accesses.

It defends against:

- Spatial safety violations.
- Temporal safety violations.

**Security question answered:**

> Does this pointer have valid permission to access this specific memory region right now?

### 20.3 Layered defence

PAC, MTE, and BTI are designed to work together.

Purpose:

- Hardware-enforced defence.
- Protection against a wide range of common exploit techniques.

---

## 21. Pointer Authentication, PAC

### 21.1 Core principle

PAC uses unused high-order bits of a 64-bit virtual address to store a cryptographic signature.

This signature is called the:

```text
Pointer Authentication Code
```

or:

```text
PAC
```

### 21.2 What PAC protects

PAC provides cryptographic integrity and authenticity protection for pointers.

It ensures pointers have not been illicitly modified after being created by a trusted software component.

### 21.3 Signing operation

Signing is performed by new CPU instructions:

```text
PAC* instructions
```

When a pointer needs protection, such as a function return address before storage on the stack, a PAC instruction is executed.

The hardware calculates a PAC using:

1. The original pointer.
2. A 64-bit context, such as the stack pointer.
3. A secret 128-bit key stored in protected system registers, such as IAK, IBK, etc.

The slide names the cryptographic algorithm:

```text
QARMA
```

Clean formula:

$$
PAC = QARMA(\text{pointer}, \text{context}_{64}, \text{key}_{128})
$$

The PAC is then inserted into the upper bits of the pointer.

Clean notation:

$$
\text{signed pointer} = \text{pointer} + \text{PAC bits}
$$

### 21.4 Authentication operation

Authentication is performed by:

```text
AUT* instructions
```

Before the pointer is used, for example before a `RET` instruction uses a return address:

1. Hardware recalculates the PAC using the same inputs.
2. Hardware compares the recalculated PAC with the PAC stored in the pointer.

Clean condition:

$$
\text{authentication succeeds}
\iff
PAC_{\text{stored}} = QARMA(\text{pointer}, \text{context}_{64}, \text{key}_{128})
$$

### 21.5 Authentication outcomes

#### If PACs match

- Authentication succeeds.
- PAC is stripped.
- The instruction proceeds with the valid pointer.

#### If PACs do not match

- Authentication fails.
- Hardware raises a fault exception.
- Program terminates.

### 21.6 Worked example: return-address protection

1. A function is called.
2. Its return address is signed before being stored on the stack.
3. An attacker uses a buffer overflow to overwrite the saved return address.
4. The overwritten pointer does not have a valid PAC.
5. When the function returns, the hardware runs an `AUT` check.
6. The check fails.
7. The program faults instead of jumping to the attacker's chosen address.

### 21.7 PAC limitation: pointer substitution/reuse

PAC prevents modifying a protected pointer's value.

However, it does not prevent replacing one protected pointer with another validly signed pointer copied from elsewhere.

If an attacker finds a useful signed pointer, called a **PAC gadget**, an attack may still succeed.

### 21.8 PAC limitation: key leakage

PAC security depends entirely on secrecy of the 128-bit keys.

If another vulnerability leaks the PAC keys from protected system registers, the mitigation is defeated.

---

## 22. ARM Branch Target Identification, BTI

### 22.1 Purpose

BTI provides a low-overhead, forward-edge Control-Flow Integrity mechanism.

It restricts targets of indirect branches.

BTI is designed to work alongside PAC.

### 22.2 Threat addressed: Jump-Oriented Programming

BTI addresses **Jump-Oriented Programming**, or **JOP**.

JOP is an exploit technique where an attacker chains existing code fragments called gadgets.

Unlike Return-Oriented Programming, or ROP, JOP gadgets do not end in `RET`.

Instead, they end in indirect branch instructions such as:

```text
BR
BLR
```

### 22.3 How JOP works

The slide gives four stages.

#### 1. Find gadgets

The attacker scans application memory and loaded libraries to find short instruction sequences.

Each gadget:

- Already exists in executable code.
- Performs a small operation.
- Ends with an indirect branch.

#### 2. Corrupt the stack

The attacker uses a vulnerability, typically a buffer overflow, to overwrite stack data.

Instead of injecting shellcode, they place a crafted sequence of addresses on the stack.

Each address points to a gadget.

#### 3. Hijack control flow

The attacker triggers the first indirect branch.

Execution jumps to the first gadget.

The gadget's own indirect branch uses the next corrupted stack value as its target.

#### 4. Chain execution

The process repeats.

By chaining enough legitimate code fragments, the attacker constructs a malicious computation from existing code.

This bypasses defences such as Execute Never, or XN, which prevent injected code from being executed.

### 22.4 How BTI blocks JOP

The compiler places a special BTI instruction at the start of functions or code blocks that are legitimate targets of indirect jumps.

When a memory page is marked as guarded:

- The CPU permits indirect branches only to land on a BTI instruction.
- A jump into the middle of an instruction sequence, a gadget, faults.

### 22.5 BTI mechanism

BTI is enabled per page using a:

```text
Guard Page bit
```

or:

```text
GP bit
```

in the memory translation tables.

This allows BTI-protected and legacy code to coexist.

BTI instructions are encoded in the "NOP space."

That means:

- Code compiled with BTI can run on older processors.
- Older processors treat BTI instructions as no-ops.
- But no BTI protection is provided on older processors.

### 22.6 BTI limitations

#### No backward-edge protection

BTI protects indirect jumps and calls - the forward edge.

It does not protect function `RET` instructions - the backward edge.

Therefore, BTI must be combined with PAC or another mechanism to protect against both ROP and JOP.

#### Coarse granularity

By default, any BTI instruction is a valid target for any indirect branch within a guarded page.

An attacker may still redirect execution to a different valid BTI target.

This is harder than classic JOP but still a risk.

#### Software dependency

BTI's effectiveness depends on:

- OS correctly marking pages as guarded.
- Compiler inserting BTI instructions in all required locations.

### 22.7 PAC + BTI result

The slides state that enabling both BTI and PAC gives a significant **97% reduction** in available ROP and JOP gadgets in the GLIBC library.

---

## 23. Memory Tagging Extension, MTE

### 23.1 Core principle

MTE associates a small metadata tag with:

- Pointers.
- The memory they reference.

Hardware validates that the tags match on every memory access.

Clean rule:

$$
\text{access permitted}
\iff
\text{tag(pointer)} = \text{tag(memory)}
$$

### 23.2 Tagged pointers

The upper four bits of a 64-bit pointer are reserved to store a pointer tag.

That gives:

$$
2^4 = 16
$$

possible tag values.

### 23.3 Tagged memory

For every 16-byte granule of physical memory, there is a corresponding 4-bit memory tag.

This tag metadata is stored in a dedicated, hardware-managed region of DRAM.

### 23.4 Allocation behaviour

When memory is allocated, for example by `malloc`:

1. Allocator generates a random 4-bit tag.
2. It stores this tag in the memory-tag region for every 16-byte granule of the allocation.
3. It returns a pointer with the same tag embedded in its upper four bits.

Clean notation:

$$
\text{tag(pointer)} = \text{tag(allocated memory granules)}
$$

### 23.5 Access behaviour

On every `LOAD` or `STORE`:

1. Hardware reads the tag from the pointer.
2. Hardware reads the tag from the target memory location.
3. Hardware compares the two tags.

If tags match:

```text
access permitted
```

If tags mismatch:

```text
hardware detects a fault
```

### 23.6 Spatial violation detection

If a buffer overflow crosses into a granule with a different tag, the hardware detects a mismatch.

Example:

```text
Pointer tag = A
Adjacent memory tag = B
A != B -> fault
```

### 23.7 Temporal violation detection

If memory is freed and later reallocated with a new tag, an old dangling pointer may retain the old tag.

Example:

```text
Dangling pointer tag = A
Reallocated memory tag = C
A != C -> fault
```

### 23.8 MTE region tagging diagram

The slide's visual example uses coloured regions.

For spatial safety:

- The allocated region and the regions before and after it should have different tag "colours."
- Adjacent regions are randomly tagged to protect against buffer overflows and underruns.

For temporal safety:

- When memory is freed, regions are re-tagged.
- This helps mitigate use-after-free.

**[UNCLEAR]** Slide 32 says "When freed the 'config' region before, and the allocated region are re-tagged." The word "config" may be an auto/slide typo or shorthand; re-listen for the lecturer's explanation.

---

## 24. MTE limitations

### 24.1 Probabilistic security

MTE uses only 4-bit tags.

Therefore, there are only 16 possible tags.

There is a 1 in 16 chance that an illegal memory access is not detected because the pointer tag happens to match the target memory tag.

Clean probability:

$$
P(\text{missed illegal access}) = \frac{1}{16} = 0.0625 = 6.25\%
$$

Therefore, MTE is probabilistic, not deterministic.

### 24.2 Granularity limitation

Protection is at 16-byte granularity.

A buffer overflow that remains within the same 16-byte granule may not be detected.

Slide example:

- A 4-byte buffer.
- Write 8 bytes past the end.
- If still within the same 16-byte granule, no tag mismatch occurs.

### 24.3 Allocation-time aliasing

If two adjacent buffers are allocated back-to-back and the allocator assigns the same random tag to both, an overflow from one to the other is not caught.

### 24.4 Performance modes

MTE can operate in asynchronous mode.

In asynchronous mode:

- Faults are detected.
- Faults are reported later.

Benefit:

- Low overhead.

Risk:

- Fault reporting is imprecise.
- The attacker may get a larger window to operate before termination.

---

## 25. CHERI architecture extensions

### 25.1 What CHERI stands for

CHERI stands for:

```text
Capability Hardware Enhanced RISC Instructions
```

### 25.2 CHERI project origin

The University of Cambridge co-led CHERI research.

The project was a collaboration with SRI International.

It began in 2010.

The goal was to address widespread memory-security issues at their hardware source.

### 25.3 Primary objectives

#### Fine-grained memory protection

CHERI aims to provide a more precise and robust way to control memory access.

It prevents unauthorized:

- Reads.
- Writes.
- Code execution.

#### Scalable software compartmentalisation

CHERI enables separating parts of an application so that a vulnerability in one component does not compromise the whole system.

#### Minimal disruption

CHERI aims to integrate with existing:

- Programming languages.
- Operating systems.

The goal is practical adoption with minimal changes.

### 25.4 Capabilities

CHERI introduces capabilities.

**Definition - capability:**  
A hardware-protected pointer-like value that carries unforgeable bounds and permissions.

Capabilities mitigate:

- Heap temporal errors, such as use-after-free.
- Spatial errors, such as out-of-bounds access.

---

## 26. Principles CHERI was designed to uphold

### 26.1 Principle of intentional use

The first principle is:

> Ensure that software runs the way the programmer intended, not the way the attacker tricked it.

Approach:

- Guarantee pointer integrity.
- Guarantee pointer provenance.
- Provide efficient dynamic bounds checking.

**Definition - provenance, in CHERI context:**  
The origin and derivation history of a pointer/capability, used to ensure valid pointers are derived only from other valid pointers through valid transformations.

### 26.2 Principle of least privilege

The second principle is:

> Reduce the attack surface using software compartmentalisation.

The slide says this mitigates:

- Known exploits.
- Unknown exploits.

The approach provides highly scalable and efficient compartmentalisation.

---

## 27. CHERI 128-bit capabilities

### 27.1 Capability structure

The slide shows a CHERI capability as a 128-bit value plus a 1-bit tag.

The 128-bit capability contains:

- 64-bit virtual address.
- Permissions.
- Bounds compressed relative to the address.

The separate 1-bit tag records validity.

Clean abstract representation:

$$
\text{capability} =
(\text{address}, \text{bounds}, \text{permissions}, \text{metadata}, \text{valid tag})
$$

### 27.2 Bounds

The diagram shows a pointer address inside a memory allocation with:

- Lower bound.
- Upper bound.

The capability's bounds restrict the accessible memory range.

Clean condition:

$$
\text{access allowed only if}
\quad
\text{lower bound} \leq \text{address} < \text{upper bound}
$$

### 27.3 Metadata

Metadata controls how capabilities may be used.

Examples:

- Bounds.
- Permissions.
- Other metadata.

### 27.4 Guarded manipulation

CHERI controls how capabilities may be manipulated.

Examples of protected properties:

- Provenance validity.
- Monotonicity.

### 27.5 Tags

Tags protect capability integrity and derivation in:

- Registers.
- Memory.

If a capability is overwritten by ordinary non-capability data, the validity tag is cleared.

---

## 28. CHERI protection semantics for pointers

### 28.1 Integrity and provenance validity

Valid pointers must be derived from other valid pointers through valid transformations.

Invalid pointers cannot be used.

### 28.2 Bounds

Bounds prevent pointers from being manipulated to access the wrong object.

Example:

```text
Pointer to object A cannot be widened or shifted to access object B.
```

### 28.3 Monotonicity

Monotonicity prevents pointer privilege escalation.

Example from the slide:

- Prevents broadening bounds.

Clean intuition:

```text
A derived capability may become less powerful,
but not more powerful.
```

### 28.4 Permissions

Permissions limit unintended pointer use.

Example:

```text
W^X for pointers
```

That is, write and execute permissions can be controlled so that a pointer cannot be misused for unintended access.

### 28.5 Higher-level policy

These primitives support:

- Strong spatial memory protection.
- Strong temporal memory protection.
- Scalable software compartmentalisation.

---

## 29. Capability-extended register file and tagged memory

### 29.1 Register extension

64-bit general-purpose registers are extended with:

- 64 bits of metadata.
- 1-bit validity tag.

So the slide describes GPRs as extended to:

$$
64 + 64 + 1 = 129 \text{ bits}
$$

### 29.2 Program counter capability

The ordinary program counter, PC, is extended to become the:

```text
Program Counter Capability
```

or:

```text
$PCC
```

### 29.3 Tagged memory

Tagged memory protects capability-sized and capability-aligned words in DRAM by adding a 1-bit validity tag.

### 29.4 New instructions

New instructions are used to explicitly:

- Load capability values.
- Store capability values.
- Inspect capability values.
- Manipulate capability values.

### 29.5 Existing instruction encodings

Existing encodings are reused for capability-relative dereferences when in a suitable mode.

### 29.6 Default Data Capability

The Default Data Capability is written as:

```text
$DDC
```

It constrains legacy integer-relative ISA load and store instructions.

### 29.7 System mechanism extensions

The slides list extended system mechanisms including:

- Capability-instruction enable control register.
- New page-table-entry, or PTE, permissions.
- New exception codes.
- Exception stack pointers becoming capabilities.
- Exception vectors becoming capabilities.

---

## 30. Implementing C/C++ memory safety with CHERI

### 30.1 Conventional C/C++ versus CHERI C/C++

Conventional C/C++ uses integer pointers.

CHERI C/C++ uses capability pointers.

### 30.2 Data layout

C/C++ data types are laid out to hold:

- Wider capability-width pointers.
- Capability-aligned pointers.

### 30.3 Code generation

Code generation is pointer-aware.

It uses explicit:

- Load-capability instructions.
- Store-capability instructions.

### 30.4 Software Trusted Computing Bases

The slides refer to software TCBs.

They restrict capability:

- Bounds.
- Permissions.

as code runs.

Examples of software components that refine bounds and permissions:

- `mmap()` system call.
- Runtime linker.
- Heap allocator.
- Stack allocator.

### 30.5 Hardware enforcement

Hardware continuously enforces capability protections on all pointer manipulation and use.

### 30.6 Pointer types covered

Protections apply to all pointer types in compiled code and the runtime environment.

#### Implicit sub-language pointers

Examples:

- GOT entries.
- Stack pointers.
- Return addresses.

#### Explicit language-level pointers

Examples:

- Pointers to globals.
- Pointers to stack allocations.
- Pointers to heap allocations.
- Function pointers.

---

## 31. Software compartmentalisation

### 31.1 Limitations of current CPU design

The slide lists several limitations in current CPU design:

1. Number of compartments, or processes, and the rate of their creation/destruction.
2. Frequency of switching between compartments, especially as compartment count grows.
3. Nature and performance of memory sharing between compartments.

### 31.2 CHERI improvement

CHERI has been shown to improve each of these by at least an order of magnitude.

### 31.3 Security effect

The slide's diagram says:

> CHERI contains attack within compartment, preventing access to other data.

**Intuition:**  
If an attacker compromises one component, CHERI capabilities can prevent the attacker from reaching capabilities belonging to other components.

---

## 32. Reachable set of capabilities

### 32.1 Definition

**Formal slide definition - reachable capabilities for a thread:**  
Reachable capabilities are those:

- In the thread's register file or program counter capability, `$PCC`.
- Transitively loadable via any capability in its register file.

### 32.2 Unreachable capabilities

All other capabilities are:

- Unreachable.
- Unavailable to the thread.

### 32.3 Memory safety as a prerequisite

The slide states:

> Memory safety is a necessary first step toward CHERI compartmentalisation.

### 32.4 Capability set intuition

Each capability authorizes access to a memory region.

The region could represent:

- Code.
- Heap allocation.
- Global variable.
- Stack object.
- Another memory type.

---

## 33. Two independent compartments

### 33.1 Shared virtual address space

The slide shows two independent compartments inside a shared virtual address space.

Each compartment has its own set of capabilities.

### 33.2 Preventing privilege escalation

Capability provenance validity and monotonicity prevent privilege escalation beyond the reachable capabilities of each compartment.

### 33.3 Architectural isolation

These principles allow software to implement strong architecturally supported isolation between compartments.

**Connection:**  
This extends memory safety into compartmentalisation. CHERI is not only about preventing out-of-bounds pointer use; it also enables software architecture where components can be isolated within a shared address space.

---

## 34. Compartment transition with sentries

### 34.1 Definition of sentry

A **sentry** is a special type of capability that acts as a secure gateway into a compartment.

The slide defines:

```text
sentry = sealed entry capability
```

It is essentially a carefully constructed function pointer.

It allows an outside module, the caller, to execute a specific function inside a protected compartment, the callee, without gaining full access to that compartment's internal state.

### 34.2 Components of a sentry

The slide breaks this down as:

```text
sentry = code pointer to compartment
sealed = cannot be dereferenced or modified
entry capability = code entry pointer
```

### 34.3 Sentry transition instruction

The slide gives:

```asm
jalr rd, 0(sentry)    # unseals the sentry and jumps to the address
```

### 34.4 Sentry mechanism

#### Step 1: Creating the sentry

The target compartment, such as a library, creates a sentry capability.

The sentry:

- Points to a specific function inside the compartment.
- Has sealed permissions.
- Can only be used for a call.
- Cannot be modified or dereferenced by the caller.

#### Step 2: The call

An external module does not call the function directly.

Instead, it makes a special call through the sentry capability.

#### Step 3: Secure transition

CHERI hardware recognizes the call via the sentry.

This triggers a secure compartment transition.

The processor switches from:

```text
caller context -> callee context
```

This involves changing:

- Active register state.
- Memory permissions.

The sentry ensures execution begins only at the intended trusted entry point.

#### Step 4: Execution and return

The function executes with its own privileges.

When it completes, control returns to the original caller.

Hardware performs another secure transition and restores the caller's context and privileges.

---

## 35. Compartmentalisation built on CHERI memory safety

The slide shows two compartments and selectively shared resources.

### 35.1 Isolation in shared address space

Software components can be strongly isolated from one another within a shared address space.

### 35.2 Initial sharing

Initial sharing is authorized by the TCB.

The TCB delegates capabilities for shared resources such as:

- Functions.
- Globals.
- Heap objects.

### 35.3 Performance benefit

Fast domain switching and shared memory without TLB contention accelerate sharing.

**Connection:**  
This is a key architectural benefit: CHERI can support compartmentalisation without requiring every compartment to be a heavyweight process with separate page tables.

---

## 36. CHERI status as of 2025

### 36.1 Software compiled

The slide reports:

- 6 million lines of C/C++ code compiled for memory safety.
- Modest dynamic testing.

### 36.2 Case studies

There were:

- Three compartmentalisation whiteboard case studies in Qt/KDE.

### 36.3 Evaluation results

The slide reports:

$$
0.026\%
$$

LoC modification rate across the full corpus for memory safety.

It also reports:

$$
73.8\%
$$

mitigation rate across the full corpus using memory safety and compartmentalisation.

### 36.4 Observation

The slide notes:

> Memory safety is not enough to address the de facto threat model of quite a few libraries.

**Interpretation within lecture scope:**  
Memory safety is necessary but not always sufficient. Some components need compartmentalisation because their threat model assumes malicious or untrusted inputs, logic errors, or internal compromise.

---

## 37. Google Chromium porting to CHERI

### 37.1 Why Chromium matters

Chromium is the foundation for:

- Google Chrome.
- Microsoft Edge.
- Microsoft Teams.
- Electron.

### 37.2 Codebase scale

The slide lists:

- Around 27 million lines of base source code.
- At least 7 different just-in-time compilers, or JITs.
- Around 47 million lines including more than 760 library dependencies.
- V8 JavaScript and WASM runtime, around 2 million lines of code.

### 37.3 Security relevance

Chromium contains:

- Code from diverse origins.
- Idiomatic C and C++.
- Many past vulnerabilities useful for evaluation.

The slide states there was roughly one critical memory-safety vulnerability every 2 days in 2023.

### 37.4 Porting progress

Chromium was able to browse increasingly complex websites.

Effort so far:

- Around 18 staff months.
- Just reaching functional browsing.

The slide compares this to a 100-member Chromium security team, saying it is less than a week of their time.

### 37.5 Modification rates

The slide reports:

```text
Chromium base, 27 MLoC: ~0.045% LoC change
V8, 2 MLoC:             ~0.8% LoC change
```

---

## 38. CVE-2023-4863 "BLASTPASS"

### 38.1 Vulnerability context

This memory-safety vulnerability was discovered "in the wild" after targeted attacks against victims in the US using NSO Group's Pegasus.

### 38.2 Vulnerability location

It was a naturally occurring vulnerability in Google's `libwebp` image library.

### 38.3 Vulnerability type

The slide describes it as:

- Heap-memory buffer overflow.
- Exploitable for remote arbitrary code execution.

### 38.4 Why it was hard to find

It was undiscovered for years despite fuzzing.

Reason given:

- Complexity of Huffman coding logic.

### 38.5 Affected software

Affected software included:

- Chrome.
- Edge.
- WebKit.

The slide notes:

- First-party code for Google.
- Third-party code for Apple and Microsoft.
- Zero-interaction exploitation of Apple iOS.

### 38.6 CHERI result

The slide states:

- There was no prior awareness of this CVE in the CHERI work.
- There were 0% LoC changes to `webp` for use on CHERI.
- CHERI deterministically mitigated the Chromium vulnerability without awareness of the nature, location, or origin of the vulnerability during development.

**Key exam-style takeaway:**  
CHERI's protection is architectural: it can stop certain memory-safety vulnerabilities without knowing the specific bug in advance.

---

## 39. CHERIoT: CHERI for microcontrollers

### 39.1 Microarchitectural highlights

CHERIoT uses CHERI instead of a PMP.

**PMP** is not expanded in the slide, but the slide says CHERI replaces the fully associative PMP structure.

### 39.2 Area neutrality

The slide states CHERI is area neutral in this microcontroller context.

It does this by:

- Adding capability-extended integer registers.
- Adding extra capability logic.
- Replacing the fully associative PMP structure.

### 39.3 Protection regions and compartments

CHERI supports an arbitrary number of:

- Protection regions.
- Compartments.

### 39.4 Use-after-free temporal memory safety

Use-after-free temporal safety is enabled by:

#### Revocation quarantine

A bitmap of freed memory regions.

Granularity:

```text
1 bit per 8 bytes
```

#### Load filter

Prevents use of dangling pointers before they are revoked.

### 39.5 Scalability limitation

The slide says this works well for microcontrollers but is not scalable to larger memories.

### 39.6 Formal verification

The slide contains a prominent flag:

> Extensive use of formal methods to verify the core.

---

## 40. CHERIoT platform

### 40.1 Platform definition

CHERIoT is described as a hardware-software pure-CHERI platform for secure embedded systems.

It is implemented on:

```text
RISC-V 32-bit architecture
```

### 40.2 Maintainers

The slide says it was:

- Created by Microsoft.
- Maintained by Microsoft, Google, and SCI Semiconductor.

**[UNCLEAR]** The name "SCI Semiconductor" is taken directly from the slide. Re-listen if the lecturer pronounced a different organisation name.

### 40.3 Extensions to CHERI base specification

The slide lists:

- Temporal safety.
- Interrupt control sentries.
- Rich sealing abstractions.

### 40.4 Co-designed layers

The ISA, ABI, and RTOS are co-designed.

The platform supports:

- Privilege separation for everything.
- Fine-grained auditing.
- Lightweight code sharing.

### 40.5 Further information

The slide points to:

```text
cheriot.org
```

and a CHERIoT book.

**[EXAM FLAG]** The slide explicitly says CHERIoT extra information is **"Not required to pass exam with a good mark."**

---

## 41. Summary of CHERI costs versus benefits

### 41.1 Main cost

The main cost is larger memory footprint due to larger pointers.

The overhead varies significantly depending on:

- Programming language.
- Data structures used.

For C/C++ code, the slide says overhead is often around:

$$
5\%
$$

### 41.2 Benefits

#### Fine-grained spatial and temporal memory protection

This fundamentally mitigates memory-safety vulnerabilities.

#### Improved control-flow robustness

This makes ROP/JOP attacks much harder or impossible.

#### Highly scalable compartmentalisation

This fundamentally reduces the attack surface.

---

## 42. Optional further reading

The slide lists optional further reading:

```text
IEEE Security and Privacy Magazine 2024
CHERI: Hardware-Enabled C/C++ Memory Protection at Scale
```

**[EXAM FLAG]** This is explicitly labelled optional further reading, not core required lecture content.

---

## 43. Quiz and lab notes

### 43.1 Hardware Fundamentals Quiz #8

The slide says:

- See Canvas Quizzes.
- It contains multiple-choice questions to check understanding of this week's lecture.
- It does not form part of the mark.
- It would be good practice.

**[EXAM / REVISION FLAG]** Although not marked, the quiz is described as good practice for checking understanding.

**[UNCLEAR]** Slide typo: "Is does not form part of your mark" should read "It does not form part of your mark."

### 43.2 Lab #4 exercise

The slide says Lab 4 is available.

Submission:

- Upload repository back into GitHub.

Assessment:

- Lab 4 is 25% of the overall lab mark.

**[COURSEWORK FLAG]** Lab 4 is worth **25% of the overall lab mark**.

### 43.3 Lab environments

The lab provides two emulator environments of RISC-V microcontrollers:

1. RV32 without CHERI support.
2. CHERIoT, RV32 with CHERI support.

### 43.4 Lab content

Each codespace environment has examples of memory-safety vulnerabilities in:

- C.
- C++.

Students should:

- Follow lab scripts.
- Run exercises.
- Observe what happens.
- Use CHERIoT features to trap memory-safety vulnerabilities.
- Keep the application running without fixing the bugs.

---

## 44. Next lecture

The final slide says the next lecture will cover:

```text
Hardware Memory Protection
```

**Connection:**  
This lecture motivates why hardware memory protection is needed. The next lecture likely builds on the pointer, memory-safety, and compartmentalisation ideas introduced here.

---

## 45. Clean formulas, mechanisms, and algorithms

### 45.1 Fetch-Decode-Execute

```text
Fetch:     instruction <- Memory[PC]
Decode:    operation, operands <- decode(instruction)
Execute:   result <- execute(operation, operands)
Writeback: store result
```

### 45.2 B-register effective address

$$
EA = A_{\text{base}} + B
$$

where:

- $EA$ = effective address.
- $A_{\text{base}}$ = base address encoded in instruction.
- $B$ = B-register offset.

### 45.3 C pointer arithmetic

$$
ptr++ \Rightarrow address := address + sizeof(*ptr)
$$

Examples:

```c
int *p;   p++;   // +4 bytes
char *p;  p++;   // +1 byte
```

At hardware level, this is just integer addition.

### 45.4 Heartbeat correctness condition

The implementation should ensure:

$$
\text{claimed payload\_length} \leq \text{actual available payload bytes}
$$

From the patch screenshot:

$$
1 + 2 + \text{payload} + 16 \leq \text{record length}
$$

### 45.5 Heartbleed over-read amount

Given:

```text
Actual payload = 1 byte
Claimed payload_length = 65535 bytes
```

Extra unintended bytes copied:

$$
65535 - 1 = 65534
$$

### 45.6 PAC signing

$$
PAC = QARMA(\text{pointer}, \text{context}_{64}, \text{key}_{128})
$$

$$
\text{signed pointer} = \text{pointer with PAC inserted into high bits}
$$

### 45.7 PAC authentication

$$
\text{valid}
\iff
PAC_{\text{stored}} = QARMA(\text{pointer}, \text{context}_{64}, \text{key}_{128})
$$

### 45.8 MTE access rule

$$
\text{access permitted}
\iff
\text{tag(pointer)} = \text{tag(memory granule)}
$$

### 45.9 MTE false-negative probability

$$
P(\text{undetected illegal access}) = \frac{1}{16} = 6.25\%
$$

### 45.10 CHERI GPR width

$$
64\text{-bit address} + 64\text{-bit metadata} + 1\text{-bit validity tag}
= 129\text{ bits}
$$

### 45.11 CHERI bounds check intuition

$$
\text{access allowed}
\iff
\text{lower bound} \leq \text{address} < \text{upper bound}
$$

### 45.12 Sentry call

```asm
jalr rd, 0(sentry)    # unseals the sentry and jumps to the address
```

---

## 46. Worked examples to revise

### 46.1 Self-modifying code before pointers

Goal: process a list at consecutive addresses.

```text
LOAD 100
```

To process next element:

```text
Fetch instruction LOAD 100
Increment address field to 101
Store modified instruction LOAD 101
Execute LOAD 101
```

This repeats for each list element.

**Answer / takeaway:**  
Without index registers or pointers, the program modifies its own instructions to change memory addresses.

### 46.2 B-register address calculation

Instruction contains:

```text
base address = 100
```

B-register contains:

```text
offset = 5
```

Effective address:

$$
EA = 100 + 5 = 105
$$

**Answer / takeaway:**  
The instruction itself stays unchanged; hardware computes the effective address.

### 46.3 Integer pointer ambiguity

Register contains:

```text
0x4000
```

Interpretation depends on instruction:

```text
ADD  -> 0x4000 is integer 16384
LOAD -> 0x4000 is memory address 16384
```

**Answer / takeaway:**  
Hardware does not know the semantic meaning of the value.

### 46.4 Heartbleed exploit

Attacker sends:

```text
payload = "X"
actual length = 1
claimed payload_length = 65535
```

Server copies:

```text
1 real byte + 65534 adjacent memory bytes
```

Server returns:

```text
64 KB response containing private process memory
```

**Answer / takeaway:**  
A missing bounds check turns a valid-looking protocol request into a memory disclosure vulnerability.

### 46.5 PAC return-address protection

Normal flow:

```text
Return address signed before being stored.
Return address authenticated before RET.
```

Attack:

```text
Buffer overflow overwrites saved return address.
AUT check recomputes PAC.
PAC mismatch -> fault.
```

**Answer / takeaway:**  
PAC prevents simple return-address corruption but not reuse of another validly signed pointer.

### 46.6 MTE temporal safety

Allocation:

```text
malloc returns pointer with tag A.
Memory granules also tagged A.
```

Free and reallocation:

```text
Memory retagged B.
Old dangling pointer still has tag A.
```

Access:

```text
A != B -> fault.
```

**Answer / takeaway:**  
MTE can detect use-after-free when retagging changes the memory tag.

### 46.7 CHERI sentry transition

Caller has a sentry capability to a compartment function.

```asm
jalr rd, 0(sentry)
```

Hardware:

```text
unseals sentry
jumps to intended entry point
switches context/permissions
executes callee
restores caller on return
```

**Answer / takeaway:**  
A sentry allows controlled entry into a compartment without exposing the compartment's internal state.

---

## 47. Exam flags and high-value revision points

### Explicit exam/course flags from slides

**[EXAM FLAG]** CHERIoT platform extra information is **not required to pass the exam with a good mark**.

**[REVISION FLAG]** Hardware Fundamentals Quiz #8 is not marked but is good practice.

**[COURSEWORK FLAG]** Lab #4 is worth **25% of the overall lab mark**.

### High-value conceptual flags

**[IMPORTANCE FLAG]** Around 70% of serious security bugs/CVEs are memory-safety or memory-unsafety issues, according to the lecture's cited Project Zero, Chromium, and Microsoft figures.

**[IMPORTANCE FLAG]** The root architectural issue is the integer pointer: a pointer carries no bounds, type, or lifetime metadata.

**[IMPORTANCE FLAG]** The two main classes of memory-safety errors are:

- Spatial safety violations.
- Temporal safety violations.

**[IMPORTANCE FLAG]** ARM mechanisms are layered but limited:

- PAC protects pointer integrity.
- BTI restricts indirect branch targets.
- MTE checks pointer/memory tag agreement but is probabilistic.

**[IMPORTANCE FLAG]** CHERI capabilities add architectural metadata and enforcement:

- Bounds.
- Permissions.
- Provenance validity.
- Monotonicity.
- Tags.

**[IMPORTANCE FLAG]** CHERI supports both memory safety and compartmentalisation.

---

## 48. Unclear sections to revisit in the recording

- **Transcript missing:** No transcript was included after the prompt, so any spoken emphasis, examples, derivations, jokes, or exam hints not present in the slides are absent from these notes.

- **Slide 8:** "Processors many more general-purpose and index registers" appears to be missing a verb. Likely meaning: processors had many more registers.

- **Slide 20:** The OpenSSL patch screenshot is partly visible. The first bounds check is readable, but the second check is truncated in the parsed text. Revisit if exact patch syntax matters.

- **Slide 23:** CrowdStrike is described as a missing bounds check while parsing a configuration update, but no detailed code path is provided. Transcript may add nuance.

- **Slide 25:** "70% of all reported software vulnerabilities are because of 'corruption' of a memory pointer" may be shorthand. Re-listen for whether the lecturer means pointer corruption specifically or memory corruption / memory unsafety more broadly.

- **Slide 32:** "config region before" is unclear in the MTE retagging bullet. Re-listen for the intended term.

- **Slide 53:** "SCI Semiconductor" is taken directly from the slide. Check transcript/audio if the organisation name matters.

- **Slide 56:** "Is does not form part of your mark" is a typo; intended meaning is that the quiz does not count toward the mark.
