---
subject: COMP60261
chapter: 1
title: "Lecture 1 - 5.6 Study Notes"
language: en
---

# COMP60261 - Lecture 1: Core Concepts and the C Language (5.6)

**Slide provenance**

These notes use only the following downloaded Chapter 1 slide decks:

- C:\Users\abdul\Downloads\COMP60261-slides\slides\00-logistics\index.html
- C:\Users\abdul\Downloads\COMP60261-slides\slides\01-core-concepts\index.html
- C:\Users\abdul\Downloads\COMP60261-slides\slides\02-c-intro\index.html
- C:\Users\abdul\Downloads\COMP60261-slides\slides\03-c-pointers\index.html
- C:\Users\abdul\Downloads\COMP60261-slides\slides\04-c-dynamic-memory-allocation\index.html
- C:\Users\abdul\Downloads\COMP60261-slides\slides\05-c-standard-library\index.html

The local SVG and PNG assets in each deck's include directory and the
downloadable C examples in each deck's src directory were also used. No web
research, later slide decks, or other notes were used as content sources.

**Transcript status:** no separate lecture transcript was provided. The source
material is the slide text, the embedded speaker notes in the HTML decks, and
the local assets and code files. A requested idea that is absent from these
sources is marked [UNCLEAR] rather than filled in from outside knowledge.

**Topic and scope:** the lecture connects systems-security vocabulary with a
practical C refresher. The central chain is:

> security property -> trust and threat assumptions -> isolation and privilege
> -> C memory operations -> security consequences of incorrect bounds or
> lifetimes

---

## 1. Academically relevant logistics

The unit has two related parts:

| Part | Main subject | Why it matters here |
| --- | --- | --- |
| Part 1 | Systems software security | The first part uses C, pointers, memory allocation, and libc examples. |
| Part 2 | Hardware security | Software makes assumptions about hardware, and hardware behavior can undermine software security guarantees. |

The assessment structure shown in the logistics deck is 70 percent final exam
and 30 percent coursework. There are four lab exercises, each worth 25
percent of the coursework mark, and a weekly Canvas quiz is formative rather
than graded. The programming exercises should use a Linux x86-64 environment.

The downloadable examples matter academically: a slide may omit an include
file or error handling to fit on screen, while the local source version is
intended to be a runnable example. The lecture also expects code to compile
without warnings or errors. Starting lab work at least two weeks before the
deadline is part of the practical advice because no lab sessions are
timetabled.

---

## 2. Security foundations

### 2.1 From protecting machines to protecting information

Computer security historically concentrated on the physical machine: stopping
theft or physical damage. The slide deck presents the modern shift as a move
towards information security because information can be more valuable than the
hardware holding it.

Information security protects information that is:

- stored by a computer;
- processed by a computer; or
- transmitted by a computer.

It also aims to prevent disruption of service. This is why a security failure
does not have to expose a secret. A service that cannot operate has still lost
a security property.

### 2.2 Systems security

The deck defines systems security as:

> The practice of safeguarding computer systems against unauthorised access,
> modification, or disruption.

The wording is useful because it connects directly to the CIA properties:

- unauthorised access can disclose information;
- unauthorised modification can tamper with information; and
- disruption can prevent a system from operating.

The unit treats software and hardware security as heavily intertwined:

- software controls hardware and depends on hardware behavior;
- hardware implements mechanisms on which software isolation relies; and
- attacks can cross the software/hardware boundary.

The local sw-hw.svg asset shows the stack from applications and language
runtimes through libraries, the OS kernel, virtualization, and hardware
containing the CPU, memory, and I/O devices. A security argument about one
layer is therefore not automatically a security argument about the whole
system.

### 2.3 Ariane 5 as a failure of assumptions

The deck uses the first Ariane 5 flight on 4 June 1996 as a compact example of
why correctness and security engineering matter:

- the rocket went off course and disintegrated 40 seconds after lift-off;
- the root problem was a 16-bit signed integer overflow;
- code written for Ariane 4 carried assumptions that no longer held for
  Ariane 5;
- the failing computation was not useful after lift-off; and
- the loss was reported as 370 million dollars.

The study lesson is not just "check integers". A component can fail because
its environment changed, because old assumptions were reused, or because
unneeded code was left active. A feature that is not useful in the current
state can still be a failure path and therefore part of the system's
security-relevant surface.

### 2.4 Why vulnerabilities are expected

The slide deck gives scale indicators:

- Linux kernel v6.12 has 26 million lines of code.
- An Apple Silicon M3 Max system-on-chip has 92 billion transistors.

At this scale, the slides argue that there is no practical way to prove that
the entire software or hardware system is correct. Designers and engineers
are human and introduce bugs. A bug can cause a crash or instability, or it
can become a security vulnerability.

A security vulnerability is especially dangerous when it is mostly silent
during normal operation and is triggered only by a particular input, state, or
sequence of actions. That makes ordinary testing less likely to expose it and
gives an attacker an opportunity to search for the triggering condition.

---

## 3. Attack surface, vulnerabilities, and attacker objectives

### 3.1 Attack surface

An attack surface is the set of places and mechanisms through which an
attacker can reach a system, trigger behavior, or influence data. The lecture
starts from a simple chain:

1. designers introduce bugs;
2. some bugs are security vulnerabilities; and
3. vulnerabilities at any level of the software/hardware stack can be
   exploited.

The six local attack-surface SVG assets show the same layered stack while the
slide text changes the example at each layer.

| Layer | Slide example | Security significance |
| --- | --- | --- |
| Application | Apache Struts CVE-2017-5638, associated with the 2017 Equifax breach | A web-application parser vulnerability allowed a malicious request to execute code remotely and take over the server. |
| Library and supply chain | NodeJS event-stream, 2018 | An attacker took over the library repository and released a malicious version designed to steal from crypto-wallet software. Trust in the publication path became an attack surface. |
| OS kernel | Linux CVE-2016-5195, "Dirty CoW" | A normal user exploited a race condition to gain write access to read-only mappings and escalate to administrator; the deck notes rooting Android phones as an example. |
| Hypervisor | Xen CVE-2014-7188 | A read-mode overflow in interrupt-controller emulation allowed a VM to leak data from the hypervisor or other guests. The patch required an emergency reboot of about 10 percent of AWS EC2. |
| Hardware | Spectre and Meltdown side channels | Speculative execution could be tricked into leaking data from processes and the kernel. Countermeasures in microcode and software have performance costs. |

The table is an argument for studying the full stack. A library can be
dangerous even when an application is correct, the kernel is a security
boundary for applications, the hypervisor is a boundary between guests, and
hardware behavior can undermine isolation supplied by software.

### 3.2 Three attacker objectives

The deck groups attacker goals into read, write, and control:

| Objective | Meaning | Examples from the deck |
| --- | --- | --- |
| Read | Obtain information that should not be disclosed | Passwords, crypto keys, or information such as open ports that enables a further attack. |
| Write | Change information that should not be changed | Corrupt sensitive structures, inject data, forge access tokens, or hide evidence. |
| Control | Direct behavior that should not be under the attacker's control | Disturb operation, cause denial of service, or execute code that enables later attacks. |

This classification helps map a low-level bug to a high-level security
property. An out-of-bounds read can be a confidentiality failure, a write
through an adjacent object can be an integrity failure, and a bad indirect
call or crash can affect control or availability.

---

## 4. CIA, identity, trust, and threats

### 4.1 The CIA properties

The CIA triad is a compact set of high-level properties that a secure system
should maintain.

| Property | Definition | Mechanisms shown in the slides |
| --- | --- | --- |
| Confidentiality | Prevent unauthorised disclosure of sensitive information. | Encryption, access control, and secure deletion. |
| Integrity | Prevent unauthorised tampering with sensitive information. | Checksums, digital signatures, and their keys. |
| Availability | Prevent disturbances to system operation. | Denial-of-service protection, redundancy or replication, and backups. |

The word "unauthorised" is important for confidentiality and integrity. A
system can disclose data or modify data as part of an authorised operation
without violating those properties. The security question is who is allowed
to cause the action.

### 4.2 Identity is a precondition

Identity asks how a system can establish that an actor is who the actor claims
to be. The deck gives passwords and certificates as examples.

Identity is not one of the three CIA letters, but it supports decisions about
confidentiality and integrity. Access control cannot distinguish an
authorised actor from an impostor unless the system has some basis for
identity. Authentication therefore comes before many authorization
decisions.

### 4.3 Do not conflate the three models

The lecture uses three distinct concepts:

| Concept | Question it answers | Typical output |
| --- | --- | --- |
| Trust model | Which components are treated as trusted or untrusted for a particular actor and scenario? | A classification of components and trust relationships. |
| Trusted Computing Base (TCB) | Which software and hardware components are critical to maintaining the target security guarantees? | The set that is assumed to work correctly. |
| Threat model | What can the attacker do, and what can the attacker not do? | Explicit assumptions about attacker capability. |

The models interact, but they are not synonyms. A TCB is the critical
implementation set under a security argument; a trust model describes
assumed relationships; and a threat model describes the attacker.

### 4.4 IaaS example: trust depends on the viewpoint

The local trust-model and threat-model SVGs show hardware, a hypervisor, and
two virtual machines belonging to clients A and B. The colors change with the
viewpoint:

| Viewpoint in the asset | Trusted in the illustrated model | Not trusted in the illustrated model |
| --- | --- | --- |
| Cloud provider | Hardware and hypervisor | Client A and client B virtual machines |
| Client A | Hardware, hypervisor, and client A's VM | Client B's VM |
| Client B | Hardware and client B's VM | The hypervisor and client A's VM |

The exact list is less important than the method: always name the actor whose
view is being modeled. The same hypervisor can be trusted by the provider as
part of its platform and distrusted by a client that wants protection from
the provider. The same client VM can be trusted by its owner and treated as
untrusted by the provider.

### 4.5 Trusted Computing Base

The TCB is the set of software and hardware components that are critical to
the system's security. The security guarantees assume that these components
work correctly.

The slide deck gives two design requirements:

1. **Minimal:** keep the TCB as small as possible so it is easier to secure.
2. **Isolated:** separate it from non-critical components, because those
   components are not trusted by the security argument.

In the IaaS example, the cloud provider's TCB includes hardware and host
systems software such as the hypervisor, host kernel, firmware, and boot
process. This does not mean that every component on the machine is equally
important. It means that compromise of those listed components can invalidate
the provider's stated security guarantees.

### 4.6 Threat models

A threat model is a series of assumptions about attacker capability. It
should say what the attacker can access, influence, observe, or cause, and
what remains outside the attacker's capability.

The same architecture can support different security claims under different
threat models. For example, a client that assumes the hypervisor is trusted
has a different claim from a client that treats the hypervisor as an
attacker-controlled component. Without stating the threat model, a phrase
such as "the VM is secure" is incomplete.

### 4.7 Isolation approaches

The boxes-1.svg, boxes-2.svg, and boxes-3.svg assets illustrate three
directions of protection:

| Approach | What is isolated | What the isolation protects |
| --- | --- | --- |
| Sandboxing | A malicious or easily subverted component | The rest of the system from that component |
| Safeboxing | A critical or sensitive component | The sensitive component from the rest of the system |
| Mutual distrust | Two components that distrust each other | Each component from the other component |

Examples from the deck:

- Processes or virtual machines can be isolated by an OS or hypervisor.
- Browser tabs from different sites can be isolated from one another.
- A cryptographic library can be isolated in a browser.
- Code that manipulates passwords can be isolated in a password manager.
- A trusted execution environment, enclave, or confidential VM can distrust
  the OS or hypervisor while the OS or hypervisor also distrusts it.

The protection direction matters in an exam answer. Sandboxing is not just
"putting something in a box"; it is isolating a risky component to protect
the surrounding system. Safeboxing starts from the sensitive component and
protects it from its surroundings.

### 4.8 Principle of Least Privilege

The Principle of Least Privilege (PoLP) says:

> An actor such as a process or user should receive only the minimum
> permissions required to perform its duty correctly.

The security benefit is damage limitation. If the actor is subverted, an
attacker inherits only the actor's permissions rather than every permission
available on the system.

The deck attributes the principle to Saltzer and Schroeder's 1975 paper The
Protection of Information in Computer Systems. Examples include:

- CPU execution privilege levels;
- user-based file access permissions;
- application permissions on mobile systems; and
- using sudo only for operations that require root privileges.

PoLP is difficult to apply completely. Complexity and performance pressures
often cause components to become overprivileged. That implementation
difficulty is itself an exam point: state both the principle and why real
systems may not achieve it perfectly.

---

## 5. C as systems-software groundwork

### 5.1 Why C is still used

The C deck describes C as an old language designed in the 1970s that remains
widely used for systems software. The local slide imagery names examples such
as operating systems, web servers, database systems, hypervisors, language
runtimes, and Git.

| Strength | Security-relevant interpretation |
| --- | --- |
| Low-level and close to hardware | The programmer can control memory and machine behavior directly. |
| Fast with a small memory footprint | Useful for systems, high-performance computing, and embedded systems. |
| Portable | Compilers exist for many CPU architectures. |
| Familiar syntax | The syntax influenced many later languages. |
| Lack of memory safety | The same freedom leaves a large space for memory mistakes and undefined behavior. |

C's performance and its security risk come from the same freedom. The
language does not automatically prevent every invalid memory operation, so a
programmer must reason about addresses, sizes, object layout, and lifetime.

### 5.2 Compilation and the entry point

The local hello-world sources illustrate the basic program shape:

~~~c
#include <stdio.h>

int main() {
    printf("hello, world!\n");
    return 0;
}
~~~

stdio.h declares printf. main is the entry point and returns an integer.
Returning zero conventionally indicates success, and returning from main
exits the program.

C is compiled: source text is translated into an executable binary before it
is run.

~~~bash
gcc hello.c -o hello
./hello
~~~

The compiler reports warnings and errors. Errors stop compilation; warnings do
not necessarily stop it. The lecture's working rule is to fix errors and
warnings in the order emitted and to produce no warnings or errors in unit
code. Fixing the first diagnostic can remove later, misleading diagnostics.

### 5.3 Variables and expressions

A C variable has a name, a type, and a value. It must be declared before use.
The local variables example demonstrates:

~~~c
int a;
int d = 12;
int x, y = 10, z = 11;

a = 12;
d++;
y *= 2;
~~~

Declaration and initialization are separate ideas. int d = 12 declares and
initializes one variable, while a = 12 assigns a value after declaration.
d++ increments by one, and y *= 2 is a compact multiplication assignment.

### 5.4 Types and storage size

The deck gives two functions for types:

1. types help the compiler check whether operations are valid; and
2. types tell the compiler how much storage is needed for a variable.

Basic examples are int, float, and char:

~~~c
int my_integer = -12345;
float my_float = 42.5;
char my_char = 'a';
~~~

Storage size is architecture-dependent. The x86-64 values displayed in the
deck are:

| Type | Size shown |
| --- | --- |
| short int | 2 bytes |
| int | 4 bytes |
| unsigned int | 4 bytes |
| long int | 8 bytes |
| long long int | 8 bytes |
| float | 4 bytes |
| double | 8 bytes |

Use sizeof to obtain the size on the current machine instead of assuming
that every architecture has the same layout. short and long request smaller
or larger integer storage relative to the ordinary form shown in the deck.
unsigned expresses that the value is intended to be non-negative.

### 5.5 printf and format strings

printf takes a format string followed by zero or more values. Conversion
markers tell it how to interpret each following value.

| Marker in the deck | Use |
| --- | --- |
| %d | signed integer |
| %u | unsigned integer |
| %f | float in the displayed printf example |
| %c | character |
| %lu | unsigned long |
| %lf | double in the displayed example |

The marker and the value type must agree. A format string is interpreted by
the library, which is why the programmer must keep the format under control
when values may be influenced by an attacker. The Chapter 1 decks introduce
format strings but do not give a worked format-string attack; the detailed
attack behavior is therefore outside this note's evidence.

### 5.6 Arrays and C strings

C arrays have fixed declared dimensions and start at index zero.

~~~c
int array[4];
array[0] = 42;
array[3] = 45;

int arr2d[2][2];
arr2d[1][0] = 14;
~~~

The local arrays.svg asset shows that array elements are contiguous in
memory. A two-dimensional array is laid out contiguously dimension by
dimension. On x86-64 the int elements in the slide occupy 4 bytes each.

C has no separate string type in this lecture. A string is an array of
characters ending with the null character \0.

~~~c
char str[3];
str[0] = 'h';
str[1] = 'i';
str[2] = '\0';
~~~

The terminator is part of the storage requirement. A buffer for n characters
of a C string needs room for the terminator as well. If it is missing,
functions that search for the end of a string can continue beyond the
intended array. If the array is too small, a copy can write beyond its end.

### 5.7 Conditionals, functions, and loops

In C, a conditional is true when its expression evaluates to a nonzero value
and false when it evaluates to zero.

~~~c
if (num > 0) {
    printf("positive\n");
} else if (num < 0) {
    printf("negative\n");
} else {
    printf("zero\n");
}
~~~

A function declares a return type, a name, and parameters:

~~~c
int add(int a, int b) {
    return a + b;
}
~~~

The deck demonstrates:

- for, with initialization, a condition, and an update;
- while, where the body must update state itself; and
- switch, where case selects behavior and break prevents unintended
  fall-through to the next case.

Missing a loop bound or using an index outside the array is a direct route
from ordinary C control flow to a memory-safety problem.

### 5.8 Command-line parameters

The standard parameter form is:

~~~c
int main(int argc, char **argv) {
    for (int i = 0; i < argc; i++) {
        printf("argument %d: %s\n", i, argv[i]);
    }
    return 0;
}
~~~

argc counts the command-line arguments and argv contains the argument
strings. The first argument is the program name, so argc is at least 1 in
the model used by the deck. The form char **argv can be viewed as an array
of character arrays.

Command-line values are input. A secure program must not assume that a
string is the expected length or format simply because it came through the
process launcher. The C deck only demonstrates enumeration; the validation
policy must be designed at the trust boundary.

### 5.9 Typedefs and structures

typedef creates an alias for an existing type:

~~~c
typedef long long unsigned int my_int;
my_int x = 12;
~~~

A struct aggregates fields of different types:

~~~c
struct person {
    char name[10];
    float size_in_meters;
    int weight_in_grams;
};
~~~

Fields are accessed with the dot operator:

~~~c
struct person p = {"George", 1.8, 70000};
printf("%s\n", p.name);
~~~

The deck states that an instance's fields are laid out contiguously and in
the order declared. The local structs.svg asset illustrates the name array,
the float, and the integer in that order. This is security-relevant because
an out-of-bounds operation on one field can reach adjacent fields or padding
and because code must use the correct size for a complete structure.

---

## 6. Pointers and pass-by-value

### 6.1 Virtual address space, addresses, and pointers

The pointer deck models each program's accessible memory as a very large array
of bytes called its virtual address space. Each byte has an address. The deck
describes a modern 64-bit address space as ranging from zero to about 128 TB,
with most possible addresses not mapped to physical memory. Virtual address
spaces are private to programs.

An address is a location in memory. The address of a variable is the first
byte holding that variable. The & operator obtains that address.

~~~c
int x = 42;
printf("%p\n", (void *)&x);
~~~

A pointer is a variable whose value is an address. The type says what the
pointer is intended to reference.

~~~c
int x = 42;
int *ptr = &x;
printf("%d\n", *ptr);
~~~

The two uses of * have different roles:

- in int *ptr, it declares ptr as a pointer to int;
- in *ptr, it dereferences the pointer and accesses the pointed-to value.

The & operation obtains a location; dereferencing uses a location to read
or write the object stored there. A pointer is therefore a capability for
reaching some memory location, subject to the validity of that address and
the lifetime of the object.

### 6.2 C passes arguments by value

C copies each argument's value when a function is called. The first swap
example changes only the function's local copies:

~~~c
int swap(int a, int b) {
    int tmp = a;
    a = b;
    b = tmp;
}

int main() {
    int x = 10;
    int y = 100;
    swap(x, y);
    printf("x=%d, y=%d\n", x, y);
}
~~~

The swap function receives values 10 and 100 in its own parameters. The
copies are exchanged and then discarded, so the variables in main do not
change.

To modify the caller's objects, pass their addresses:

~~~c
int swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main() {
    int x = 10;
    int y = 100;
    swap(&x, &y);
    printf("x=%d, y=%d\n", x, y);
}
~~~

The pointer values themselves are copied into a and b, but both copies refer
to the original objects. Dereferencing them therefore updates the caller's
storage. This is the key distinction:

| Passed value | What the callee can change |
| --- | --- |
| An integer or structure value | Only its local copy, unless another pointer is supplied. |
| A pointer value | The object reached through the pointer. |

The deck's pointer examples use pointers to:

- modify the calling context;
- provide more than one output value; and
- avoid copying arrays or large structures.

### 6.3 Multiple outputs and error codes

The local multiply-and-divide.c example returns an error code and writes two
results through pointer parameters:

~~~c
int multiply_and_divide(int n1, int n2, int *product, int *quotient) {
    if (n2 == 0) {
        return -1;
    }
    *product = n1 * n2;
    *quotient = n1 / n2;
    return 0;
}
~~~

The caller allocates p and q, then passes &p and &q. The function returns zero
on the shown success path and -1 for division by zero. Passing a pointer is
also cheap: the deck notes that a pointer is an address and is 8 bytes on
modern 64-bit architectures, while a large structure could require many more
bytes to copy.

### 6.4 Array names, pointer arithmetic, and bounds

The lecture uses the shorthand "C arrays are pointers". The operational rule
shown by the example is that an array name supplies a pointer to the first
element when passed to a function, and the receiving function needs a
separate size:

~~~c
void negate_int_array(int *ptr, int size) {
    for (int i = 0; i < size; i++) {
        ptr[i] = -ptr[i];
    }
}

int main() {
    int array[] = {1, 2, 3, 4, 5, 6, 7};
    negate_int_array(array, 7);
}
~~~

The indexing expression has a pointer form:

~~~c
ptr[i] = -ptr[i];
~~~

is equivalent to:

~~~c
*(ptr + i) = -(*(ptr + i));
~~~

Pointer arithmetic is therefore tied to the pointed-to type: the offset is
interpreted in elements of that type, not as an arbitrary character count.
The pointer does not carry the array length in the function signature. If
size is wrong, the loop can stop too early or access past the array.

This is a central security connection. Contiguous arrays plus a separately
maintained size create a spatial-safety obligation. The code must keep the
pointer, element type, and valid range consistent.

### 6.5 Pointers to structures

For a pointer to a structure, the deck shows two equivalent field-access
forms:

~~~c
my_struct *ptr = &ms;
printf("%d\n", (*ptr).x);
printf("%s\n", ptr->s);
~~~

(*ptr).x needs parentheses because the dereference must happen before the
dot selection. ptr->x is the shortcut for (*ptr).x. Forgetting the
parentheses or confusing . and -> can produce a compile error or access the
wrong expression.

### 6.6 Pointer chains

A pointer is itself a variable and therefore has an address. It can be
pointed to by another pointer:

~~~c
int value = 42;
int *ptr1 = &value;
int **ptr2 = &ptr1;
int ***ptr3 = &ptr2;
~~~

Here:

- ptr1 reaches value;
- *ptr2 reaches ptr1, and **ptr2 reaches value; and
- *ptr3 reaches ptr2, **ptr3 reaches ptr1, and ***ptr3 reaches value.

Pointer chains are useful when a function must work with a pointer variable
itself rather than only the object it currently points to. They also increase
the number of dereferences that must be valid, so they increase the amount of
state that needs careful reasoning.

### 6.7 Function pointers

A function pointer stores the address of machine code rather than the address
of ordinary data.

~~~c
void (*func_ptr)(char *);

func_ptr = greet_v1;
func_ptr(username);

func_ptr = greet_v2;
func_ptr(username);
~~~

The declaration says that func_ptr points to a function returning void and
taking a char * parameter. It can point to functions with the matching
prototype, and calling it invokes the selected function.

Security significance: a function pointer is a data value that determines an
indirect control-flow destination. If an invalid pointer value is written or
an object containing a function pointer is corrupted, the program may
transfer control somewhere unintended. The Chapter 1 deck introduces the
mechanism; exploitation details are outside the allowed source set.

### 6.8 Pointer exam traps

- A pointer stores an address; it is not the object at that address.
- &x obtains an address, while *p dereferences a pointer.
- C passes pointer values by value. The copied pointer can still modify the
  shared target object.
- An array passed to a function does not provide its length in the pointer
  parameter; pass the length separately.
- ptr[i] and *(ptr + i) express the same access.
- Use (*ptr).field or the shorter ptr->field.
- A function pointer points to code, not ordinary data.

---

## 7. Stack, heap, and dynamic allocation

### 7.1 Static allocation versus runtime allocation

Static allocation is suitable when the required size is known at compile
time. The motivation deck asks what to do when the size depends on a runtime
value such as user input.

The first attempted solution is a variable-size local array:

~~~c
void process_array(int size) {
    int arr[size];
    for (int i = 0; i < size; i++) {
        arr[i] = i * i;
    }
}
~~~

Because this is a local variable, the deck places it on the stack. The stack
is described as only a few megabytes, so a sufficiently large user-supplied
size can overflow the stack and crash the program. The input has therefore
turned a memory-size decision into an availability risk.

The distinction used by these slides is:

| Area | Typical Chapter 1 use | Management issue |
| --- | --- | --- |
| Stack | Function-local variables, including the variable-size array example | Size is limited; the function's local storage is tied to its execution. |
| Heap | The contiguous buffer returned by malloc | The programmer must check allocation and release the buffer explicitly. |

The table is a study model, not a claim that all implementation details of
every C runtime are identical.

### 7.2 malloc

The slide prototype is:

~~~c
void *malloc(size_t size);
~~~

malloc requests size bytes at runtime. On success it returns a pointer to the
allocated contiguous area; on failure it returns NULL. The allocation is not
guaranteed to succeed because available memory varies at runtime.

The return type is void *, a generic pointer that can be converted to a
pointer to another type. To store size integers, the local example requests
size * sizeof(int) bytes:

~~~c
int *arr = (int *)malloc(size * sizeof(int));

if (arr == NULL) {
    printf("ERROR: cannot allocate memory\n");
    exit(-1);
}

for (int i = 0; i < size; i++) {
    arr[i] = i * i;
}

free(arr);
~~~

Important reasoning steps:

1. malloc takes bytes, not a number of typed elements.
2. sizeof(int) converts an element count into a byte count.
3. The return value must be checked before dereferencing arr.
4. The loop bound must match the number of elements requested.
5. The same allocation must eventually be released with free.

The slide source includes an explicit cast to int *. The central security
point is not the cast; it is the size calculation, the NULL check, and the
eventual release.

### 7.3 free, ownership, and lifetime: what these decks support

The deck states that memory allocated by malloc must be released explicitly
with free, passing the pointer returned for the allocated area. Memory is
needed only for a period of execution, so the programmer must retain a usable
pointer until the data is no longer needed and then release the area.

The slides do not define a formal ownership type system or use a formal
ownership/lifetime vocabulary. A safe interpretation of the shown examples
is:

- the code responsible for an allocation must keep track of the pointer;
- the allocation remains available until the program calls free;
- losing the only pointer before calling free prevents release; and
- using an area after it has been released would contradict the slide's
  "release when done" discipline.

Formal ownership rules, aliasing rules, and temporal-safety terminology are
[UNCLEAR] from the allowed Chapter 1 decks.

### 7.4 Memory leaks and availability

If free is omitted, the allocation remains reserved while the program
continues. In the local leaky example, arr goes out of scope at the end of
process_array, so the program loses the pointer and cannot release the
allocation:

~~~c
void process_array(int size) {
    int *arr = (int *)malloc(size * sizeof(int));
    if (!arr) {
        exit(-1);
    }

    for (int i = 0; i < size; i++) {
        arr[i] = i * i;
    }

    /* no free: arr is lost when the function returns */
}
~~~

The lecture explicitly treats leaks as a security issue. An attacker may
repeat an operation that causes leaks until the program crashes or the
machine's resources are starved. This is an availability failure.

Valgrind is the local debugging tool shown:

~~~bash
gcc -g my-leaky-program.c -o my-leaky-program
valgrind --leak-check=full ./my-leaky-program
~~~

The -g option embeds debugging information. The example report identifies
400 bytes definitely lost in one block and gives the allocation call path.
The unit expectation is that produced C code should be checked for leaks and
should be free of them.

### 7.5 Requested APIs absent from the allowed source set

The six allowed Chapter 1 decks contain malloc and free, but do not contain
calloc, realloc, or a formal treatment of ownership and object lifetime. The
local Chapter 1 source tree also contains no calloc or realloc example.

Therefore:

- calloc: [UNCLEAR] from the allowed sources. No prototype or behavior is
  stated in decks 00-05.
- realloc: [UNCLEAR] from the allowed sources. No prototype or failure
  behavior is stated in decks 00-05.
- ownership and lifetime as formal concepts: [UNCLEAR] beyond the malloc/free
  discipline described above.

This is an intentional source boundary. Adding the usual later-chapter
semantics would violate the instruction to use only decks 00-05. The
supported exam facts are the malloc, NULL, free, and leak behavior covered in
sections 7.2-7.4.

---

## 8. C standard-library functions with security significance

### 8.1 What libc provides

The C standard library, or libc, is a collection of pre-written functions for
low-level tasks. The deck emphasizes portability across compilers and
operating systems.

| Area | Header shown |
| --- | --- |
| Input/output | stdio.h |
| Memory management | stdlib.h |
| String and memory manipulation | string.h |
| Mathematics | math.h |
| File handling | fcntl.h, unistd.h |
| Time and date | time.h |

The lecture focuses on I/O, string, and memory functions because their
arguments and buffer sizes have direct security consequences.

### 8.2 String copy: pointer assignment is not copying

The prototypes shown are:

~~~c
char *strcpy(char *dest, const char *src);
char *strncpy(char *dest, const char *src, size_t n);
~~~

This assignment does not copy the characters:

~~~c
char *string1 = "hello";
char *string2 = string1;
~~~

It copies the pointer value, so both pointers refer to the same string
location. A separate character buffer is needed for a separate copy:

~~~c
char string3[10];
strcpy(string3, string1);
~~~

strcpy copies the source string, including its terminator, but it does not
know the size of dest. If the source is larger than the destination, it
blindly writes beyond the destination buffer. This is an out-of-bounds write
that can corrupt adjacent data and possibly affect control flow.

strncpy adds a maximum count n and the deck presents passing the destination
buffer size as the better direction:

~~~c
strncpy(string3, string1, 10);
~~~

The allowed deck establishes the bounded-copy idea but does not explain every
edge case of strncpy; those details are [UNCLEAR] for this source-limited
note. The source-supported security rule is still clear: a copy operation
must account for destination capacity and the string terminator.

### 8.3 Concatenation and remaining capacity

The prototypes are:

~~~c
char *strcat(char *dest, const char *src);
char *strncat(char *dest, const char *src, size_t n);
~~~

After concatenation, the destination contains its old contents followed by
the source. The destination must have room for:

1. its original characters;
2. the source characters; and
3. one terminating \0.

The local example uses:

~~~c
char world[6] = "world";
char s2[32];

strcpy(s2, "hello ");
strncat(s2, world, 32 - strlen(s2));
~~~

The important bound is remaining capacity, not total capacity. Passing 32 as
the count after s2 already contains text would describe too much room. The
deck's expression 32 - strlen(s2) calculates how many characters can still be
appended in a 32-byte destination under the shown model.

### 8.4 memcpy

The prototype is:

~~~c
void *memcpy(void *dest, void *src, size_t n);
~~~

memcpy copies n bytes from src to dest. The void * parameters allow the
function to operate on different data types, and the deck notes that it is
optimized compared with a hand-written copy loop.

For an array of structures, the local example uses:

~~~c
memcpy(array2, array1, array_size * sizeof(mystruct));
~~~

The byte count is element count multiplied by the size of one element. This
works only when the destination has enough space for that many bytes and the
source and destination describe the intended regions. A wrong count is a
direct buffer-bound error.

### 8.5 Console input

The deck contrasts:

~~~c
char *fgets(char *s, int size, FILE *stream);
int scanf(const char *format, ...);
~~~

fgets receives a destination buffer, a maximum character count, and a stream
such as stdin. The explicit size parameter is the important security
property: the caller provides a bound.

scanf receives a format string followed by addresses of variables to fill:

~~~c
int number;
double value;
float ratio;

scanf("%d", &number);
scanf("%lf", &value);
scanf("%f", &ratio);
~~~

The address operator is required because C passes arguments by value and the
function must write into the caller's variables. The deck specifically warns
that %lf is used for double and %f for float.

The safe, source-supported comparison is:

| Function behavior shown | Security obligation |
| --- | --- |
| fgets receives a maximum size | Supply the actual destination capacity. |
| scanf receives a format and output addresses | Match formats to types and pass valid writable addresses. |
| String functions use destination buffers | Ensure the buffer can hold data and its terminator. |

The allowed decks do not show a bare %s scanf example or give a complete
unsafe-input taxonomy. Any additional claims about specific scanf format
vulnerabilities are [UNCLEAR] from this source set.

### 8.6 Manual pages

The deck recommends:

~~~bash
man <function name>
~~~

A manual page gives the prototype, required headers, parameter and behavior
details, and return values on success or error. This is particularly important
for functions where a small argument such as a count changes the security
meaning of the operation. Reading the contract is part of correctly using
libc, not an optional extra.

---

## 9. Security interpretation of the C examples

The C decks are a security foundation because each language feature creates a
specific obligation.

| C fact | Security significance |
| --- | --- |
| Arrays are contiguous | An out-of-range index can reach adjacent storage. |
| Strings end at \0 | Missing termination can make later functions read beyond the intended data. |
| Array length is passed separately | A stale or attacker-influenced size can cause an out-of-bounds read or write. |
| C passes arguments by value | Pointers are used to let a function reach caller storage. A pointer value therefore carries authority to modify an object. |
| Struct fields follow declaration order | A memory mistake can affect neighboring fields, including pointer-valued fields. |
| Function pointers hold code addresses | Corruption of a function pointer can affect indirect control flow. |
| sizeof is architecture-dependent | Hard-coded byte counts can describe the wrong region on another target. |
| malloc can return NULL | Dereferencing without a check can crash the program. |
| free is explicit | Losing the pointer causes a leak; using a released area would violate the release discipline. |
| strcpy has no destination bound | An oversized source can overwrite beyond the destination. |
| strncat takes remaining capacity | Treating the count as total capacity can still overrun the destination. |
| Input functions receive external data | Input must be treated as a trust-boundary concern and checked against capacity and expected type. |

The common pattern is that C exposes a low-level operation and leaves a
precondition to the programmer. Security failures occur when the precondition
is assumed rather than checked.

---

## 10. Common mistakes and exam-focused facts

### 10.1 Definitions worth stating precisely

- Systems security safeguards systems against unauthorised access,
  modification, or disruption.
- Confidentiality prevents unauthorised disclosure.
- Integrity prevents unauthorised tampering.
- Availability prevents disruption of operation.
- A trust model classifies trusted and untrusted components for a viewpoint.
- A TCB is the critical software and hardware set assumed to work correctly;
  it should be minimal and isolated.
- A threat model states what an attacker can and cannot do.
- A pointer is a variable whose value is an address.
- C passes arguments by value.
- PoLP grants only the minimum permissions required for the duty.

### 10.2 C and memory traps

- Do not call char *b = a a string copy. It copies an address.
- Do not forget the \0 terminator when sizing a C string.
- Do not use an array index without a valid bound.
- Do not assume a type has the same size on every architecture; use sizeof.
- Do not confuse . with ->, and remember the parentheses in
  (*ptr).field.
- Do not assume that an array's length travels with its pointer parameter.
- Do not dereference the result of malloc before checking for NULL.
- Do not forget free when the allocation is no longer needed.
- Do not treat a memory leak as only a style problem; the deck classifies it
  as a possible availability issue.
- Do not use a total buffer size where strncat needs remaining capacity.
- Do not copy an unbounded source into a fixed destination with strcpy.
- Do not pass a value to scanf where the function needs the variable's
  address.
- Do not use a format marker that disagrees with the value type.

### 10.3 Short comparison: trust, threat, and TCB

| If the prompt asks about... | Start the answer with... |
| --- | --- |
| Who is trusted | "For actor X in scenario Y, the trust model treats..." |
| What the attacker can do | "The threat model assumes the attacker can/cannot..." |
| What must be correct | "The TCB contains the components critical to..." |
| How to reduce damage | "Apply isolation and PoLP so that..." |

---

## 11. Revision checklist

- [ ] Explain the shift from protecting hardware to protecting information.
- [ ] Define systems security using access, modification, and disruption.
- [ ] Explain why software and hardware security are intertwined.
- [ ] Reproduce the Ariane 5 facts: date, 40 seconds, 16-bit signed overflow,
  Ariane 4 assumptions, unused computation, and 370 million dollars.
- [ ] Define attack surface and give one named vulnerability at each stack
  layer from the deck.
- [ ] Distinguish read, write, and control attacker objectives.
- [ ] Define confidentiality, integrity, and availability and give the slide
  mechanisms.
- [ ] Explain why identity supports confidentiality and integrity decisions.
- [ ] Contrast trust model, TCB, and threat model.
- [ ] State that the TCB must be minimal and isolated.
- [ ] Explain the cloud-provider, client A, and client B trust viewpoints.
- [ ] Distinguish sandboxing, safeboxing, and mutual distrust.
- [ ] Define PoLP, state its damage-limiting purpose, cite Saltzer and
  Schroeder in 1975, and explain why it is hard to apply completely.
- [ ] Explain why C is fast and useful but not memory-safe.
- [ ] Compile a C program and distinguish errors from warnings.
- [ ] Explain variables, basic types, sizeof, and the x86-64 sizes shown.
- [ ] Use the correct printf markers.
- [ ] Explain zero-based, contiguous arrays and null-terminated strings.
- [ ] Explain argc, argv, and why the first argument is the program name.
- [ ] Define a structure, use . for fields, and describe field layout.
- [ ] Define an address, a pointer, &, and *.
- [ ] Explain why the first swap fails and the pointer version works.
- [ ] Derive ptr[i] as *(ptr + i) and explain why the size is separate.
- [ ] Use (*ptr).field and ptr->field correctly.
- [ ] Explain pointer chains and function pointers.
- [ ] Compare a stack variable-size array with a heap buffer.
- [ ] State the malloc prototype, byte-count rule, NULL check, and explicit
  free.
- [ ] Explain a leak, its availability impact, and the Valgrind command.
- [ ] Record the source gap for calloc, realloc, and formal
  ownership/lifetime rules rather than importing unsupported details.
- [ ] Explain why strcpy can overflow, why pointer assignment is not a copy,
  and why strncat needs remaining capacity.
- [ ] Explain memcpy byte counts and fgets versus scanf.
- [ ] Use man <function> to check prototypes, headers, behavior, and return
  values.

---

## 12. Compact long-answer framework

For a long answer about a C security issue, use this order:

1. **State the security property.** Identify whether the risk is disclosure,
   tampering, disruption, or loss of control.
2. **Name the trust and threat assumptions.** Say who supplies the input,
   which component is trusted, and what the attacker can influence.
3. **Describe the C object.** Identify the array, string, structure, pointer,
   stack variable, or heap allocation and its valid size.
4. **Trace the operation.** Follow the address, index, pointer arithmetic,
   copy count, format, allocation result, or free call.
5. **Identify the violated precondition.** Examples are a missing terminator,
   an incorrect bound, a failed NULL check, a lost allocation pointer, or an
   invalid indirect-call target.
6. **Map the consequence.** Explain whether the operation reads, writes, or
   controls something outside the intended authority.
7. **Give the source-supported mitigation.** Use a correct size, pass the
   size explicitly, check malloc, call free, use the bounded input/copy
   direction shown, or isolate and least-privilege the component.
8. **Close with the security model.** State how the fix preserves CIA,
   reduces the attack surface, or keeps an untrusted component from
   invalidating the TCB.

This framework turns a code detail into a security argument: assumption,
object, operation, violated bound, impact, and mitigation.
