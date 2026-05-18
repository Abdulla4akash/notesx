---
subject: COMP64602
chapter: 9
title: "Week 9"
language: bn
---

# কাঠামোবদ্ধ স্টাডি নোটস — COMP64602 Multi-Agent Planning / POCL

**বিষয় ও পরিসর:** এই লেকচারগুলোতে partial-order causal-link planning-এর মাধ্যমে multi-agent planning আলোচনা করা হয়েছে: প্রথমে প্রেরণা ও planning approaches, তারপর single-agent POCL, parallel POCL, multi-agent parallel POCL, এবং শেষে Blocks World-এর worked examples, যেখানে causal-link adjustment ও redundant-step removal দেখানো হয়েছে। বিস্তৃত planning বিষয়ের মধ্যে এটি fully ordered plan থেকে partial-order plan-এ যাওয়ার অংশ; partial-order plan পরে linearise করা যায় এবং multi-agent ক্ষেত্রে বিভিন্ন agents-এর plan merge করা যায়।

**কোর্স:** COMP64602  
**লেকচার টপিক:** Multi-Agent Planning; Partial Order Causal-Link Planning; Parallel and Multi-Agent POCL Plans; Multi-Agent Planning Examples  
**ব্যবহৃত উৎস:** আপলোড করা lecture slides এবং সংশ্লিষ্ট transcripts:

- `IntroMAP.pdf`
- `Introduction to Multi-Agent Planning-English (1).txt`
- `POCL.pdf`
- `POCL-English (1).txt`
- `parallelPOCL.pdf`
- `Parallel and Multi-Agent POCL-English (1).txt`
- `Examples.pdf`
- `Multi-Agent Planning Examples-English (1).txt`

---

## 1. High-level multi-agent planning

### 1.1 সংজ্ঞা ও motivation

**Intuition:** Multi-agent planning হলো এমন planning যেখানে একাধিক agent জড়িত থাকে। এর সবচেয়ে মৌলিক বাড়তি সুবিধা হলো একসঙ্গে একাধিক action execute করা যায়, কারণ একাধিক agent বা effector available থাকে।

**মূল সমস্যা:** একাধিক agent কাজ করলে তাদের plan একে অপরের সঙ্গে interfere করতে পারে।

Transcript-এর উদাহরণ:

- এক agent কোনো object এক জায়গায় move করার plan করে।
- অন্য agent একই object অন্য জায়গায় move করার plan করে।
- Coordination না থাকলে agents objectটি নিয়ে “fight over” করতে পারে, অথবা একজন objectটি সরিয়ে ফেলার পর অন্যজন সেটি use করতে গিয়ে objectটি খুঁজে না পেতে পারে।

তাই multi-agent planning শুধু “আরও বেশি action” নয়; এতে interaction, interference, communication, uncertainty, এবং replanning নিয়েও reasoning করতে হয়।

---

## 2. Multi-agent planning-এর approaches

### 2.1 Centralised planning

**Definition / intuition:** Centralised planner জানে প্রত্যেক agent কী করতে পারে। এটি প্রত্যেক agent-এর জন্য plan বানায়, তারপর সংশ্লিষ্ট agent-কে সেই plan communicate করে।

**Advantages:**

- Individual agents-এর plans যেন একে অপরের সঙ্গে interfere না করে, তা এড়ায়।
- Execution শুরু হওয়ার আগেই central planner agents-এর actions-এর interactions নিয়ে plan করতে পারে।

**Disadvantages:**

- Computationally expensive, কারণ planner-কে সব agents এবং তাদের actions-এর সম্ভাব্য সব interactions বিবেচনা করতে হয়।
- Uncertainty এবং plan failure handle করা কঠিন।
- কোনো individual agent সমস্যায় পড়লে তাকে central planner-কে issue communicate করতে হয়; এরপর central planner-কে সিদ্ধান্ত নিতে হয় কী করা হবে।

### 2.2 Hierarchical planning / goal decomposition সহ centralised planning

**Definition / intuition:** Central planner high level-এ কাজ করে, hierarchical planning framework অথবা basic goal decomposition ব্যবহার করে। এটি agents-কে high-level plans বা goals communicate করে, এবং agents locally lower-level details পূরণ করে।

**Advantages:**

- Low-level plans interfere করার risk কমায়, কারণ high-level coordination আগেই হয়েছে।
- Agents-কে locally plan fix করার কিছু ক্ষমতা দেয়।

**Disadvantages:**

- Lower-level plans এখনও এমনভাবে interfere করতে পারে যা high-level planner আগে anticipate করেনি।

### 2.3 Centralised planner নেই: local plans, conflicts arise করলে resolve করা

**Definition / intuition:** প্রত্যেক agent নিজের goals-এর জন্য local plan তৈরি করে এবং execution-এর সময় conflict দেখা দিলে resolve করে।

**Advantages:**

- অতিরিক্ত infrastructure-এর প্রয়োজন কম।
- Communication overhead কম।
- Agents আগের single-agent planning methods-ই ব্যবহার করতে পারে।

**Disadvantages:**

- Agents-এর plans interfere করার risk বেশি।
- Interference ঘটলে uncertainty-এর অধীনে reasoning এবং replanning দরকার হয়।

### 2.4 Centralised planner নেই: local plans plus communication / negotiation

**Definition / intuition:** প্রত্যেক agent local plan তৈরি করে, কিন্তু agents communication-এর মাধ্যমে joint plan-এ agree করে।

**Advantages:**

- Interference-এর risk কমায়।

**Disadvantages:**

- Negotiation বা communication protocol infrastructure দরকার।
- Agreed plan-এ converge করতে significant time লাগতে পারে।

### 2.5 এই lectures-এ ব্যবহৃত approach

এই lectures-এ focus করা হয়েছে সেই version-এ যেখানে agents local **partial-order plans** তৈরি করে, তারপর সেই plans একটি central component-এ communicate করা হতে পারে, যা সেগুলো merge করে global plan বানায়। নির্দিষ্ট framework হলো **partial order planning**, তারপর **partial order causal-link planning**, তারপর **parallel and multi-agent POCL planning**।

---

## 3. Partial order planning

### 3.1 Core idea

**Intuition:** Partial-order plan শুধু সেই ordering constraints record করে যা plan কাজ করার জন্য দরকার। যেসব actions যেকোনো order-এ হতে পারে, তাদের ওপর arbitrary total order impose করে না।

উদাহরণ:

- যদি action $a_1$ অবশ্যই action $a_2$-এর আগে হতে হয়, partial-order plan record করে $a_1 \prec a_2$।
- যদি দুইটি action যেকোনো order-এ হতে পারে, partial-order plan তাদের unordered রাখে।
- পরে partial-order plan **linearised** হয়ে আগের material-এর মতো fully ordered plan-এ পরিণত হয়।

### 3.2 Course-এর এই অংশে topics-এর sequence

Lecture sequence:

1. **Partial Order Causal-Link Planning**  
   Single agent-এর জন্য simple partial-order planning। আগের সপ্তাহের material থেকে খুব বেশি আলাদা নয়, শুধু plan খোঁজার একটি নতুন পদ্ধতি।

2. **Parallel Partial Order Causal-Link Planning**  
   Actions parallel-এ occur করতে দেয়। এটি centralised planner ব্যবহার করতে পারে।

3. **Multi-agent Parallel Partial Order Causal-Link Planning**  
   Individual agents partial plans তৈরি করতে পারে, যেগুলো centralised planner পরে merge করে।

4. **Examples**  
   Multi-agent plans merge ও simplify করার worked examples।

---

## 4. Covered নয়: POMDPs

### 4.1 POMDPs কী

Lecture স্পষ্টভাবে বলে যে POMDPs এই unit-এ **covered নয়**, কিন্তু multi-agent planning এবং uncertainty সহ planning-এ এগুলো গুরুত্বপূর্ণ।

**POMDP** = **Partially Observable Markov Decision Process**।

**Lecture থেকে intuition:**

- POMDPs partial এবং probabilistic information সহ planning problems model করে।
- এগুলো possible action outcomes এবং probabilities model করে।
- World state সম্পর্কে observations-এর uncertainty model করে।
- Solution একটি **policy** দেয়, fixed plan নয়।

### 4.2 Policy বনাম plan

**Plan:** “Action 1 করো, তারপর action 2, তারপর action 3।”

**Policy:** “Current state, বা probable current state, given হলে কী করতে হবে।”

তাই agent কোনো action নিয়ে expected state-এ না পৌঁছালেও policy এখনও বলে দিতে পারে এরপর কী করতে হবে।

### 4.3 অন্য courses-এর সঙ্গে connection

Lecture POMDP-solving techniques-কে reinforcement learning-এর সঙ্গে connect করে, যা অন্য unit-এ covered।

---

# Part I — Partial Order Causal-Link Planning

## 5. POCL: high-level idea

**POCL** মানে **Partial Order Causal Link** planning। Lecture-এ Blocks World examples ব্যবহার করা হয়েছে।

একটি POCL plan represent করে:

- **Plan steps**: instantiated actions, যেমন `stack(A, B)`।
- **Causal links**: কোন step অন্য step-এর দরকারি condition establish করে।
- **Temporal orderings**: কোন steps অন্যদের আগে হতে হবে, সাধারণত interference prevent করার জন্য।
- **Special init and goal steps**।
- **Consistency flaws**, যা plan build করার সময় repair করা হয়।

### 5.1 Plan steps

একটি plan step হলো instantiated action।

উদাহরণ:

```text
stack(A,B)
```

মানে block $A$-কে block $B$-এর ওপর stack করার নির্দিষ্ট action।

### 5.2 Causal links

**Intuition:** Causal link বলে যে একটি step এমন একটি condition establish করে যা অন্য step-এর প্রয়োজন।

উদাহরণ:

- যদি step $s_i = stack(A,B)$, $on(A,B)$ true করে,
- এবং step $s_j$-এর precondition হিসেবে $on(A,B)$ দরকার হয়,
- তাহলে $s_i$ থেকে $s_j$-এ $on(A,B)$ label সহ একটি causal link থাকে।

লেখা হয়:

$$
\langle s_i, s_j, on(A,B) \rangle
$$

এর অর্থ:

$$
s_i \text{ establishes } on(A,B) \text{ for } s_j.
$$

### 5.3 Temporal orderings

**Intuition:** Temporal ordering বলে একটি step অন্য step-এর আগে হতে হবে।

লেখা হয়:

$$
s_i \prec_T s_j
$$

অথবা tuple হিসেবে:

$$
\langle s_i, s_j \rangle \in \prec_T
$$

এটি প্রায়ই দুইটি action যেন interfere না করে তা prevent করতে ব্যবহৃত হয়।

### 5.4 Init and goal steps

Plan শুরু হয় বিশেষ steps দিয়ে:

- $s_{init}$: initial state represent করে।
- $s_{goal}$: desired goal state represent করে।

Initial state represent করা হয় init step-এর **postconditions** দিয়ে:

$$
post(s_{init}) = \text{initial state}
$$

Goal state represent করা হয় goal step-এর **preconditions** দিয়ে:

$$
pre(s_{goal}) = \text{goal state}
$$

---

## 6. POCL plan-এর formal definition

### 6.1 Formal definition

**[EXAM FLAG]** Slide স্পষ্টভাবে বলেছে এই technical definition “will be on formula sheet in the exam.”

একটি **Partial Order Causal Link plan** হলো tuple:

$$
\langle S, \prec_T, \prec_C \rangle
$$

যেখানে:

- $S$ হলো plan steps-এর set, অর্থাৎ instantiated actions।
- $\prec_T$ হলো $S$-এর steps-এর ওপর temporal partial order।
- $\prec_C$ হলো $S$-এর steps-এর ওপর causal-link partial order।

Temporal ordering-এর একটি element:

$$
e \in \prec_T
$$

যেখানে:

$$
e = \langle s_i, s_j \rangle
$$

with:

$$
s_i, s_j \in S
$$

মানে:

$$
s_i \prec_T s_j
$$

Causal-link ordering-এর একটি element:

$$
e \in \prec_C
$$

যেখানে:

$$
e = \langle s_i, s_j, c \rangle
$$

with:

$$
s_i, s_j \in S
$$

এবং $c$ একটি condition।

এর অর্থ:

$$
s_i \text{ establishes condition } c \text{ for } s_j.
$$

Plan model করে:

$$
post(init) = \text{initial state}
$$

এবং:

$$
pre(goal) = \text{goal state}
$$

---

## 7. Consistency flaw 1: open preconditions

### 7.1 Definition

**Intuition:** কোনো step-এর open precondition থাকে যখন তার কোনো condition $c$ দরকার, কিন্তু plan-এ এখনও এমন কোনো causal link নেই যা $c$ provide করে।

### 7.2 Formal definition

একটি **open precondition** থাকে যখন কোনো step $s_j$-এর precondition $c$ আছে, কিন্তু কোনো suitable $s_i$-এর জন্য causal-link tuple নেই:

$$
\langle s_i, s_j, c \rangle \in \prec_C
$$

শব্দে:

$$
s_j \text{ needs } c,\quad \text{but no step has been selected to establish } c.
$$

### 7.3 Open precondition repair করা

Flaw repair করতে:

1. এমন step $s_i$ choose করো যাতে:

$$
c \in post(s_i)
$$

2. causal link যোগ করো:

$$
\langle s_i, s_j, c \rangle
$$

to:

$$
\prec_C
$$

Chosen $s_i$ হতে পারে:

- plan-এ already থাকা একটি step, অথবা
- action instantiate করে তৈরি নতুন step।

### 7.4 Search aspect

Open precondition flaws যেকোনো order-এ fix করা যায়, কিন্তু কীভাবে fix করা হবে তা possible supporting steps-এর ওপর search require করতে পারে।

তাই flaw selection-এর ordering flexible, কিন্তু ঠিক repair নির্বাচন করা গুরুত্বপূর্ণ হতে পারে।

---

## 8. Worked POCL example: Blocks World

### 8.1 Problem statement

Initial state:

$$
\begin{aligned}
&ontable(A),\ ontable(B),\ ontable(D),\ on(C,A),\\
&clear(B),\ clear(C),\ clear(D),\ handempty
\end{aligned}
$$

Goal state:

$$
\begin{aligned}
&ontable(C),\ ontable(D),\ on(B,C),\ on(A,D),\\
&clear(A),\ clear(B),\ handempty
\end{aligned}
$$

Init step-এর preconditions empty এবং initial state হলো এর postconditions।

Goal step-এর postconditions empty এবং goal state হলো এর preconditions।

### 8.2 Initial plan structure

Plan শুরু হয়:

$$
s_{init}
$$

এবং:

$$
s_{goal}
$$

দিয়ে, যেখানে সব goal conditions initially open:

$$
ontable(C),\ ontable(D),\ on(B,C),\ on(A,D),\ clear(A),\ clear(B),\ handempty
$$

Slides-এ এই goal preconditions circle করা হয়েছে, বোঝানোর জন্য যে এগুলো repair দরকার।

---

## 9. Example-এ open preconditions repair করা

### 9.1 $ontable(D)$ repair করা

Goal-এর দরকার:

$$
ontable(D)
$$

Initial state-এ already আছে:

$$
ontable(D)
$$

তাই causal link যোগ করো:

$$
\langle s_{init}, s_{goal}, ontable(D) \rangle
$$

এটি init step ব্যবহার করে সরাসরি open precondition repair করে।

### 9.2 $on(B,C)$ repair করা

Goal-এর দরকার:

$$
on(B,C)
$$

Plan instantiate করে:

$$
s_1 = stack(B,C)
$$

$s_1$-এর preconditions:

$$
clear(C),\ holding(B)
$$

$s_1$-এর postconditions:

$$
on(B,C),\ not\ clear(C),\ not\ holding(B),\ handempty
$$

যেহেতু $s_1$, $on(B,C)$ establish করে, যোগ করো:

$$
\langle s_1, s_{goal}, on(B,C) \rangle
$$

এটি goal precondition $on(B,C)$ repair করে, কিন্তু $s_1$-এর জন্য নতুন open preconditions তৈরি করে:

$$
clear(C),\ holding(B)
$$

### 9.3 $ontable(C)$ repair করা

Goal-এর দরকার:

$$
ontable(C)
$$

Plan introduce করে:

$$
s_2 = unstack(C,A)
$$

এবং:

$$
s_3 = putdown(C)
$$

$s_2 = unstack(C,A)$-এর জন্য:

Preconditions:

$$
clear(C),\ on(C,A)
$$

Postconditions:

$$
not\ clear(C),\ not\ on(C,A),\ holding(C)
$$

$s_3 = putdown(C)$-এর জন্য:

Precondition:

$$
holding(C)
$$

Postconditions:

$$
ontable(C),\ clear(C),\ not\ holding(C),\ handempty
$$

Causal links যোগ করা হয়েছে:

$$
\langle s_{init}, s_2, clear(C) \rangle
$$

$$
\langle s_{init}, s_2, on(C,A) \rangle
$$

$$
\langle s_2, s_3, holding(C) \rangle
$$

$$
\langle s_3, s_{goal}, ontable(C) \rangle
$$

---

## 10. Consistency flaw 2: causal link conflict

### 10.1 Definition

**Intuition:** Causal link conflict ঘটে যখন একটি step $s_i$ অন্য step $s_j$-এর জন্য condition $c$ establish করে, কিন্তু কোনো third step $s_k$ তাদের মাঝখানে occur করে $c$ negate করতে পারে।

### 10.2 Formal shape

Given causal link:

$$
\langle s_i, s_j, c \rangle \in \prec_C
$$

Conflict exists যদি আরেকটি step $s_k$ থাকে, such that plan-এর কোনো possible linearisation-এ:

$$
s_i \prec s_k \prec s_j
$$

এবং $s_k$, $c$ negate করবে।

Blocks World notation-এ এর মানে এমন কিছু:

$$
c \in post(s_i)
$$

কিন্তু:

$$
not\ c \in post(s_k)
$$

তাই $s_k$ যদি $s_i$ এবং $s_j$-এর মাঝখানে ঘটে, তাহলে $s_j$ যখন $c$ দরকার করবে তখন $c$ আর hold করবে না।

### 10.3 Causal link conflict repair করা

Temporal ordering যোগ করে repair করা হয় যাতে $s_k$, $s_i$ এবং $s_j$-এর মাঝখানে occur করতে না পারে।

অথবা $s_k$-কে $s_i$-এর আগে force করো:

$$
\langle s_k, s_i \rangle \in \prec_T
$$

অথবা $s_k$-কে $s_j$-এর পরে force করো:

$$
\langle s_j, s_k \rangle \in \prec_T
$$

শব্দে:

- threatening step-কে causal link শুরু হওয়ার আগে রাখো, অথবা
- causal link ব্যবহৃত হয়ে যাওয়ার পরে রাখো।

### 10.4 Worked example-এ causal link conflict

Plan-এ causal link আছে:

$$
\langle s_{init}, s_2, clear(C) \rangle
$$

এটি বলে init step $clear(C)$ provide করে:

$$
s_2 = unstack(C,A)
$$

এর জন্য। কিন্তু:

$$
s_1 = stack(B,C)
$$

এর postcondition:

$$
not\ clear(C)
$$

তাই যদি $s_1$, $s_{init}$ এবং $s_2$-এর মাঝখানে ঘটে, তাহলে $C$ আর clear থাকবে না, এবং $s_2$, $A$ থেকে $C$ unstack করতে পারবে না।

Conflict repair করা হয় temporal ordering যোগ করে:

$$
s_2 \prec_T s_1
$$

Transcript note করে যে alternative, $s_1$-কে $s_{init}$-এর আগে রাখা, impossible কারণ init step-এর আগে কিছু occur করে না।

---

## 11. Worked example-এর POCL plan tuple

Slide-এ দেখানো plan tuple হিসেবে:

$$
\langle S, \prec_T, \prec_C \rangle
$$

with:

$$
S = \{s_{init}, s_1, s_2, s_3, s_{goal}\}
$$

$$
post(s_{init}) =
\{ontable(A),\ ontable(B),\ ontable(D),\ on(C,A),\ clear(B),\ clear(C),\ clear(D),\ handempty\}
$$

$$
s_1 = stack(B,C)
$$

$$
s_2 = unstack(C,A)
$$

$$
s_3 = putdown(C)
$$

$$
pre(s_{goal}) =
\{ontable(C),\ ontable(D),\ on(B,C),\ on(A,D),\ clear(A),\ clear(B),\ handempty\}
$$

Temporal ordering:

$$
\prec_T = \{(s_2, s_1)\}
$$

Causal links:

$$
\begin{aligned}
\prec_C = \{&
(s_{init}, s_{goal}, ontable(D)),\\
&(s_1, s_{goal}, on(B,C)),\\
&(s_{init}, s_2, clear(C)),\\
&(s_{init}, s_2, on(C,A)),\\
&(s_2, s_3, holding(C)),\\
&(s_3, s_{goal}, ontable(C))\}
\end{aligned}
$$

Transcript note করে যে আরও preconditions solve করা বাকি আছে; এই tuple slides-এ দেখানো plan fragment represent করে, necessarily সম্পূর্ণ solved final plan নয়।

---

# Part II — Parallel POCL Plans

## 12. Parallel plans-এর motivation

**Intuition:** Parallel plan একাধিক action একসঙ্গে হতে দেয়। এটি হতে পারে কারণ:

- multiple agents একই সময়ে act করে, অথবা
- এক agent-এর multiple effectors আছে, যেমন দুই arms-সহ robot।

Centralised planner এই actions coordinate করতে parallel plan construct করতে পারে।

Ordinary partial plans-এর জন্য ব্যবহৃত approach parallel plans-এর জন্যও ব্যবহার করা যায়। পার্থক্য হলো plan specify করতে পারে:

- actions যা **অবশ্যই একই সময়ে** হতে হবে, অথবা
- actions যা **অবশ্যই একই সময়ে হতে পারবে না**।

---

## 13. Parallel POCL plan-এর formal definition

### 13.1 Definition

**[EXAM FLAG]** Slide বলে parallel POCL plan definition “will be on formula sheet in the exam.”

একটি **parallel POCL plan** হলো tuple:

$$
\langle S, \prec_T, \prec_C, \#, = \rangle
$$

যেখানে:

$$
\langle S, \prec_T, \prec_C \rangle
$$

embedded POCL plan।

দুইটি নতুন relation হলো:

$$
\#
$$

এবং:

$$
=
$$

### 13.2 Non-concurrency relation $\#$

$\#$ হলো symmetric **non-concurrency** relation।

**Meaning:** $\#$ দ্বারা related steps একই সময়ে occur করতে পারবে না।

যদি:

$$
\langle s_i, s_j \rangle \in \#
$$

তাহলে:

$$
s_i \text{ and } s_j \text{ cannot be concurrent.}
$$

### 13.3 Concurrency relation $=$

$=$ হলো symmetric **concurrency** relation।

**Meaning:** $=$ দ্বারা related steps অবশ্যই একই সময়ে occur করবে।

যদি:

$$
\langle s_i, s_j \rangle \in =
$$

তাহলে:

$$
s_i \text{ and } s_j \text{ must be concurrent.}
$$

### 13.4 $\#$ এবং $=$ কখন filled in হয়

Transcript বলে planning চলাকালে এগুলো fill in নাও করা হতে পারে। Final linearisation-এর সময়, কোন steps simultaneously occur করতে পারে তা decide করতে গিয়ে এগুলো fill in হতে পারে।

Transcript একটি domain-specific example দেয়:

- Screwdriver-সহ robot arm এবং spanner-সহ আরেক arm কিছু actions simultaneously করতে পারে।
- কিন্তু একই constrained resource require করা দুই action একই সময়ে possible নাও হতে পারে।
- এই domain-specific restrictions $\#$ দিয়ে represent করা যায়।

---

## 14. Parallel step conflicts

### 14.1 Definition

Parallel plan-এ **parallel step conflict** থাকে যখন steps $s_i$ এবং $s_j$ আছে such that:

$$
post(s_i)
$$

inconsistent with:

$$
post(s_j)
$$

এবং neither step temporally ordered before the other, এবং তারা already non-concurrent হিসেবে marked নয়।

### 14.2 Formal conditions

Parallel step conflict থাকে যখন:

$$
post(s_i) \text{ is inconsistent with } post(s_j)
$$

and:

$$
s_i \not\prec_T s_j
$$

and:

$$
s_j \not\prec_T s_i
$$

and:

$$
\langle s_i, s_j \rangle \notin \#
$$

তাই দুইটি step:

- ordered নয়,
- explicitভাবে together occur করা forbidden নয়,
- কিন্তু simultaneous effects inconsistent হবে।

### 14.3 Parallel step conflicts repair করা

Parallel step conflicts সবসময় steps non-concurrent বানিয়ে solve করা যায়। Slides বলে এই conflicts fix করা candidate solution plan choose হওয়া পর্যন্ত left করা যায়।

Transcript-এ এটি sequencing করা বা ordering যোগ করা হিসেবে describe করা হয়েছে, যাতে conflicting steps একসঙ্গে occur না করে।

---

# Part III — Multi-agent Parallel POCL Plans

## 15. Basic idea

Multi-agent parallel POCL plans, parallel POCL plans-কে extend করে plan steps agents-কে assign করার মাধ্যমে।

Key setting:

1. Several agents প্রত্যেকে নিজের goals রাখে।
2. প্রত্যেক agent নিজের goals-এর জন্য POCL plan construct করে।
3. Individual POCL plans combine করা হয়।
4. Conflicts remove করা হয়।
5. Result হলো multi-agent plan।

Transcript emphasises করে যে প্রত্যেক agent যখন plan পাঠায়, সেই plan-এর সব steps already ঐ agent-কে assigned থাকে।

---

## 16. Multi-agent parallel POCL plan-এর formal definition

একটি **multi-agent parallel POCL plan** হলো tuple:

$$
M = \langle A, S, \prec_T, \prec_C, \#, =, X \rangle
$$

যেখানে:

$$
\langle S, \prec_T, \prec_C, \#, = \rangle
$$

embedded parallel POCL plan।

Additional components:

- $A$: agents-এর set।
- $X$: step-assignment tuples-এর set।

$X$-এর একটি tuple-এর form:

$$
\langle s, a \rangle
$$

meaning:

$$
\text{agent } a \in A \text{ is assigned to execute step } s.
$$

Plan agents-এর initial states model করে init steps ব্যবহার করে:

$$
init_i \in S
$$

এবং agents-এর goals model করে goal steps ব্যবহার করে:

$$
goal_i \in S
$$

Goal steps-এর preconditions represent করে conjunctive goals যা plan achieve করে, এবং init steps-এর postconditions represent করে agents-এর initial states-এর features, actions নেওয়ার আগের world state।

---

## 17. Redundant plan steps

### 17.1 Intuition

একটি plan step redundant যদি causal links-এর মাধ্যমে যা যা contribute করে, সবই অন্য steps দিয়ে contribute করা যায়।

Multi-agent planning-এ এটি গুরুত্বপূর্ণ, কারণ দুই agents independently similar বা overlapping actions plan করতে পারে। Plans merge করার পর একটি action unnecessary হয়ে যেতে পারে।

### 17.2 Formal definition

একটি plan step $s$ **redundant** হয় multi-agent parallel POCL plan $M$-এ steps $S$ সহ, যখন replacing steps-এর একটি set $R$ exists করে, যেখানে:

$$
R \subseteq S
$$

such that causal link-এর প্রতিটি form-এর জন্য:

$$
\langle s, s'', c \rangle
$$

there exists some:

$$
s' \in R
$$

such that:

$$
c \in post(s')
$$

শব্দে:

$s$ যে প্রতিটি condition $c$ অন্য step-কে provide করে, কোনো replacement step-ও সেই $c$ provide করতে পারে।

---

## 18. Causal links adjust করা

### 18.1 Intuition

Redundancy causal links adjust করার মাধ্যমে discover করা হয়। Step $s_i$-কে condition $c$ provide করতে দেওয়ার বদলে অন্য step $s_k$ একই condition provide করতে পারে।

### 18.2 Formal definition

Given causal link:

$$
l = \langle s_i, s_j, c \rangle
$$

আমরা এটি adjust করতে পারি অন্য step $s_k$ খুঁজে, such that:

$$
c \in post(s_k)
$$

and:

$$
s_j \not\prec_T s_k
$$

তারপর causal link বদলে দিই:

$$
\langle s_k, s_j, c \rangle
$$

### 18.3 Temporal condition কেন গুরুত্বপূর্ণ

Condition:

$$
s_j \not\prec_T s_k
$$

মানে consumer step $s_j$ already forced নয় new provider $s_k$-এর আগে occur করতে। যদি $s_j$-কে $s_k$-এর আগে occur করতেই হয়, তাহলে $s_k$, $s_j$-এর জন্য $c$ provide করতে পারবে না।

---

## 19. Total step cost

**Total step cost** multi-agent parallel plan-এর cost measure করে plan-এর steps-এর costs aggregate করে।

Lecture-এ ব্যবহৃত cases-এ cost simply plan-এর total number of steps।

Transcript note করে যে richer planning formalisms বিভিন্ন steps-কে আলাদা costs assign করতে পারে, কিন্তু এই lectures unit step costs ব্যবহার করে।

---

## 20. Multi-Agent Plan Coordination by Plan Modification

### 20.1 এই algorithm-এর status

**[EXAM FLAG]** Slide স্পষ্টভাবে বলে এই algorithm **Not Examinable**।

**[EXAM FLAG]** Transcript বলে lecturer students-দের এই exact algorithm remember এবং run করতে expect করেন না। Students-এর যা বুঝতে expected:

- কোনো plan viable multi-agent parallel POCL plan কিনা,
- এবং কোনো কিছু causal link-এর adjustment কিনা।

### 20.2 Slide-এর algorithm

**Input:** inconsistent multi-agent parallel plan।  
**Output:** optimal এবং consistent multi-agent parallel plan, অথবা null plan।

```text
Initialise Solution to null;
Add input plan to search queue;

while queue not empty do
    Select and remove multi-agent plan M from queue;

    if the number of flagged steps in M is less than the total step cost of the solution then
        if total step cost of M < total step cost of Solution
           and all causal-link conflicts can be resolved then
               Solution = M;
        end

        Select a non-flagged causal-link in M
        and generate all possible refinements
        (adjustments of the causal link);

        For each refinement,
            remove unnecessary steps
            (any step that no longer has a causal link to any other)
            in the plan;

        Enqueue all plan refinements in search queue;
    end
end

Repair parallel-step conflicts in Solution;
Return Solution;
```

### 20.3 Algorithm conceptually কী করছে

Algorithm possible causal-link adjustments-এর ওপর search করে।

প্রতিটি point-এ:

1. Search queue থেকে plan pick করে।
2. Current solution-এর চেয়ে better কিনা check করে।
3. একটি causal link select করে।
4. কোন step causal link provide করবে তা বদলে possible refinements generate করে।
5. Unnecessary হয়ে যাওয়া steps remove করে।
6. Search চালিয়ে যায়।
7. Parallel-step conflicts একেবারে শেষে repair করে।

### 20.4 Transcript থেকে important detail

Causal link-এর refinements generate করার সময় একটি refinement হলো causal link unchanged থাকে। অন্যান্য refinements একই condition-এর জন্য অন্য possible provider steps-এর সাথে correspond করে।

---

# Part IV — Worked multi-agent planning examples

## 21. Examples-এর common setup

Examples Blocks World-এ। Lecturer Blocks World operators simplify করেছেন multi-step manipulation একক `move` actions-এ merge করে।

Example simplifications:

$$
move(c,a)
$$

means something like:

$$
unstack(c),\ stack(c,a)
$$

and:

$$
move(c, table)
$$

means something like:

$$
unstack(c),\ putdown(c)
$$

Lecture বলে purpose হলো presentation কম fussy করা। Preconditions এবং effects এখনও move-এর Blocks World meaning থেকে work out করতে হবে।

**[EXAM FLAG / HIGH VALUE]** Transcript বলে students-দের merged `move` actions কী করছে তা work out করতে এবং তাদের preconditions ও effects figure out করতে পারা উচিত।

Diagrams-এ:

- Agent A-এর actions blue।
- Agent B-এর actions red।
- Solid arrows হলো causal links।
- Dotted arrows হলো temporal links।
- Green ovals linearisation-এর সময় potential parallel steps mark করে।

---

# Example 1

## 22. Example 1: initial state and goals

### 22.1 Initial state

Initial world-এ দুইটি stack আছে:

$$
C \text{ on } B
$$

and:

$$
A \text{ on } D
$$

Slide diagram $C$-কে $B$-এর ওপরে, এবং $A$-কে $D$-এর ওপরে দেখায়।

### 22.2 Goals

Agent A-এর goal:

$$
on(a,c),\ clear(b)
$$

Agent B-এর goal:

$$
on(b,d),\ ontable(c)
$$

---

## 23. Example 1-এ Agent A-এর POCL plan

Agent A-এর plan contains:

$$
S^A = \{s^A_{init}, s^A_1, s^A_2, s^A_{goal}\}
$$

where:

$$
s^A_1 = move(c, table)
$$

$$
s^A_2 = move(a,c)
$$

Temporal ordering:

$$
\prec_T = \{(s^A_1, s^A_2)\}
$$

তাই Agent A প্রথমে $C$-কে table-এ move করে, তারপর $A$-কে $C$-এর ওপর move করে।

Causal links:

$$
\begin{aligned}
\prec_C = \{&
(s^A_{init}, s^A_1, clear(c)),\\
&(s^A_{init}, s^A_2, clear(a)),\\
&(s^A_{init}, s^A_2, clear(c)),\\
&(s^A_1, s^A_{goal}, clear(b)),\\
&(s^A_2, s^A_{goal}, on(a,c))\}
\end{aligned}
$$

Meaning:

- Init step $C$-কে table-এ move করার জন্য $clear(c)$ provide করে।
- Init step $A$-কে $C$-এর ওপর move করার জন্য $clear(a)$ এবং $clear(c)$ provide করে।
- $C$-কে table-এ move করা $B$-কে clear করে, ফলে $clear(b)$ satisfy হয়।
- $A$-কে $C$-এর ওপর move করা $on(a,c)$ satisfy করে।

---

## 24. Example 1-এ Agent B-এর POCL plan

Agent B-এর plan contains:

$$
S^B = \{s^B_{init}, s^B_1, s^B_2, s^B_3, s^B_{goal}\}
$$

where:

$$
s^B_1 = move(a, table)
$$

$$
s^B_2 = move(c, table)
$$

$$
s^B_3 = move(b,d)
$$

Slide-এ shown causal links:

$$
\begin{aligned}
\prec_C = \{&
(s^B_{init}, s^B_1, clear(a)),\\
&(s^B_{init}, s^B_2, clear(c)),\\
&(s^B_{init}, s^B_3, clear(d)),\\
&(s^B_1, s^B_3, clear(d)),\\
&(s^B_2, s^B_{goal}, ontable(c)),\\
&(s^B_3, s^B_{goal}, on(b,d))\}
\end{aligned}
$$

Meaning:

- $move(a, table)$ ব্যবহার করা হয় $D$ clear করতে, যাতে $B$-কে $D$-এর ওপর move করা যায়।
- $move(c, table)$ establish করে $ontable(c)$।
- $move(b,d)$ establish করে $on(b,d)$।

**[UNCLEAR]** Slide both $(s^B_{init}, s^B_3, clear(d))$ and $(s^B_1, s^B_3, clear(d))$ list করে। কিন্তু diagram-এ $A$ on $D$, তাই $D$ initially clear হওয়া উচিত নয়। $clear(d)$-এর intended causal support সম্ভবত $s^B_1 = move(a, table)$। Recording বা lecturer notes check করো init-to-$s^B_3$ causal link slide typo কিনা।

---

## 25. Combined initial multi-agent parallel POCL plan

Combined plan দুই agents-এর steps নেয়।

$$
S =
\{s^A_{init}, s^A_1, s^A_2, s^A_{goal},
s^B_{init}, s^B_1, s^B_2, s^B_3, s^B_{goal}\}
$$

Action steps:

$$
s^A_1 = move(c, table)
$$

$$
s^A_2 = move(a,c)
$$

$$
s^B_1 = move(a, table)
$$

$$
s^B_2 = move(c, table)
$$

$$
s^B_3 = move(b,d)
$$

Shown temporal ordering:

$$
\prec_T = \{(s^A_1, s^A_2)\}
$$

Causal links হলো individual agents-এর causal links-এর union।

Shown assignment relation:

$$
\{
\langle s^A_1, A \rangle,
\langle s^A_2, A \rangle,
\langle s^B_1, B \rangle,
\langle s^B_2, B \rangle,
\langle s^B_3, B \rangle
\}
$$

এটি record করে কোন agent প্রত্যেক non-init, non-goal action step-এর জন্য responsible।

**[UNCLEAR]** Example slide এই assignment set-কে $A = \{\cdots\}$ label করেছে, কিন্তু formal multi-agent POCL definition-এ $A$ agents-এর set এবং $X$ step-assignment relation। Example-টি assignment relation $X$ দিচ্ছে বলে পড়াই best।

---

## 26. Example 1: causal-link adjustment and redundancy

### 26.1 First adjustment: Agent B-এর $move(b,d)$ support করতে Agent A-এর $move(c,table)$ ব্যবহার

Originally, Agent B-এর আছে:

$$
s^B_2 = move(c, table)
$$

এই action $C$-কে $B$ থেকে সরিয়ে $B$ clear করতে পারে। এটি support করে:

$$
s^B_3 = move(b,d)
$$

কিন্তু Agent A-এরও আছে:

$$
s^A_1 = move(c, table)
$$

যা $C$-কে $B$ থেকে সরিয়ে $B$ clear করে।

তাই $move(b,d)$-এর জন্য $clear(b)$ provide করা causal link Agent B-এর $move(c,table)$ থেকে Agent A-এর $move(c,table)$-এ adjust করা যায়।

এই adjustment-এর পর Agent B-এর $move(c,table)$ এখনও redundant নয়, কারণ এটি এখনও provide করে:

$$
ontable(c)
$$

Agent B-এর goal-এর জন্য।

### 26.2 Second adjustment: Agent B-এর $ontable(c)$ support করতে Agent A-এর $move(c,table)$ ব্যবহার

Agent B-এর goal includes:

$$
ontable(c)
$$

Originally এটি provided by:

$$
s^B_2 = move(c, table)
$$

কিন্তু Agent A-এর:

$$
s^A_1 = move(c, table)
$$

also establishes:

$$
ontable(c)
$$

তাই $ontable(c)$-এর causal link $s^B_2$ থেকে $s^A_1$-এ adjust করা যায়।

এখন $s^B_2$-এর আর কোনো useful causal link নেই। এটি redundant এবং remove করা যায়।

### 26.3 Result

Plan simplify হয় কারণ Agent A-এর action:

$$
move(c, table)
$$

Agent B-কেও help করে।

Original visible action steps ছিল:

$$
move(c, table),\ move(a,c),\ move(a,table),\ move(c,table),\ move(b,d)
$$

Agent B-এর redundant $move(c,table)$ remove করার পর visible action steps:

$$
move(c, table),\ move(a,c),\ move(a,table),\ move(b,d)
$$

তাই merged plan-এর action steps কম।

---

## 27. Example 1: simplification-এর পর potential parallel steps

Lecture emphasises করে যে potential parallel steps identify করা **linearisation**-এর অংশ, partial-order causal-link plan তৈরি করার অংশ নয়।

Slide green ovals দিয়ে potential parallel steps mark করে:

First potential parallel group:

$$
move(c, table)
$$

Agent A দ্বারা, এবং:

$$
move(a, table)
$$

Agent B দ্বারা।

Second potential parallel group:

$$
move(a,c)
$$

Agent A দ্বারা, এবং:

$$
move(b,d)
$$

Agent B দ্বারা।

তাই possible linearised parallel execution:

1. Parallel-এ:

$$
move(c, table) \quad \text{and} \quad move(a, table)
$$

2. তারপর parallel-এ:

$$
move(a,c) \quad \text{and} \quad move(b,d)
$$

এটি achieve করে:

Agent A:

$$
on(a,c),\ clear(b)
$$

Agent B:

$$
on(b,d),\ ontable(c)
$$

**[UNCLEAR]** Transcript যেন বলে Agent B redundant $move(c,table)$ step removed হওয়ার পরও $C$ table-এ move করতে পারে parallel-এ। Slide-এর green ovals দেখায় $move(c,table)$ with $move(a,table)$, এবং $move(a,c)$ with $move(b,d)$। Slide version redundancy removal-এর সঙ্গে internally consistent।

---

# Example 2

## 28. Example 2: initial state and goals

### 28.1 Initial state

Initial state-এ আছে:

$$
A \text{ on } B
$$

and:

$$
C \text{ on table},\quad D \text{ on table}
$$

Clear blocks:

$$
clear(a),\ clear(c),\ clear(d)
$$

slide diagram-এ যেমন দেখানো হয়েছে।

### 28.2 Goals

Agent A-এর goal:

$$
clear(b),\ not\ clear(c)
$$

Agent B-এর goal:

$$
ontable(a),\ on(d,c)
$$

---

## 29. Example 2: initial local plans

### 29.1 Agent A-এর initial plan

Agent A choose করে:

$$
move(a,c)
$$

এটি uses:

$$
clear(a)
$$

and:

$$
clear(c)
$$

and achieves:

$$
clear(b)
$$

and:

$$
not\ clear(c)
$$

তাই Agent A-এর initial plan $move(a,c)$ ব্যবহার করে নিজের দুইটি goal conditions achieve করে।

### 29.2 Agent B-এর initial plan

Agent B choose করে:

$$
move(a, table)
$$

to achieve:

$$
ontable(a)
$$

and:

$$
move(d,c)
$$

to achieve:

$$
on(d,c)
$$

Slide causal structure দেখায়:

- $clear(a)$ supports $move(a,table)$।
- $clear(c)$ এবং $clear(d)$ support করে $move(d,c)$।
- $move(a,table)$ establishes $ontable(a)$।
- $move(d,c)$ establishes $on(d,c)$।

---

## 30. Example 2: first causal-link adjustment

Agent A-এর goal includes:

$$
not\ clear(c)
$$

Initially এটি provided by:

$$
move(a,c)
$$

কিন্তু Agent B-এর:

$$
move(d,c)
$$

also makes:

$$
not\ clear(c)
$$

কারণ $D$-কে $C$-এর ওপর রাখলে $C$ আর clear থাকে না।

তাই $not\ clear(c)$-এর causal link Agent A-এর $move(a,c)$ থেকে সরিয়ে Agent B-এর $move(d,c)$-এর দিকে adjust করা হয়।

এই adjustment-এর পর $move(a,c)$ এখনও redundant নয়, কারণ এটি এখনও provide করে:

$$
clear(b)
$$

Agent A-এর goal-এর জন্য।

---

## 31. Example 2: second causal-link adjustment

Agent A-এর goal-এ আরও আছে:

$$
clear(b)
$$

Initially এটি provided by:

$$
move(a,c)
$$

কিন্তু Agent B-এর:

$$
move(a, table)
$$

$A$-কে $B$ থেকে সরিয়ে দেয়, ফলে:

$$
clear(b)
$$

হয়।

তাই $clear(b)$-এর causal link Agent A-এর $move(a,c)$ থেকে সরিয়ে Agent B-এর $move(a,table)$-এ adjust করা হয়।

এখন Agent A-এর $move(a,c)$ আর কোনো needed causal link provide করে না। এটি redundant এবং remove করা যায়।

---

## 32. Example 2: redundancy removal-এর পর result

Remove করার পর:

$$
move(a,c)
$$

remaining useful action steps:

$$
move(a, table)
$$

and:

$$
move(d,c)
$$

এগুলো achieve করে:

Agent A:

$$
clear(b),\ not\ clear(c)
$$

Agent B:

$$
ontable(a),\ on(d,c)
$$

Transcript note করে যে এই point-এ blue agent কিছু করছে না: Agent A শুধু Agent B-কে সবকিছু করতে “watch” করতে পারে।

---

## 33. Example 2: reassignment and parallelisation

Lecture এরপর planning-এর পরে possible efficiency improvement বিবেচনা করে:

- Reassign:

$$
move(a, table)
$$

to Agent A।

- Keep:

$$
move(d,c)
$$

with Agent B।

Then two actions potentially একই সময়ে হতে পারে:

$$
move(a, table) \parallel move(d,c)
$$

Slide দুই actions-কে green oval-এর ভেতরে potential parallel steps হিসেবে mark করে।

Transcript explicitly বলে এই reassignment **planning mechanism**-এর অংশ নয়; এটি planning-এর পরে execution আরও efficient করার জন্য করা হতে পারে।

---

# Key concept index

## 34. Multi-agent planning

**Intuition:** Multiple agents সহ planning, যেখানে একাধিক action parallel-এ execute করা যায় কারণ একাধিক agent বা effector আছে।

**Formal definition in lecture:** Introduction stage-এ কোনো formal tuple definition দেওয়া হয়নি।

---

## 35. Partial-order plan

**Intuition:** এমন plan যা correctness-এর জন্য required orderings-ই record করে। দুইটি step যেকোনো order-এ হতে পারলে partial-order plan সেগুলো unordered রাখে।

**Important consequence:** Partial-order plans পরে ordinary fully ordered plans-এ linearised হয়।

---

## 36. POCL plan

**Intuition:** Partial-order plan plus explicit causal links, যা দেখায় কোন step অন্য step-এর কোন precondition support করে।

**Formal definition:**

$$
\langle S,\prec_T,\prec_C\rangle
$$

যেখানে $S$ হলো steps-এর set, $\prec_T$ হলো temporal ordering relation, এবং $\prec_C$ হলো causal-link relation।

**[EXAM FLAG]** Definition formula sheet-এ থাকবে।

---

## 37. Plan step

**Intuition:** Plan-এর একটি concrete instantiated action।

Example:

$$
stack(B,C)
$$

or:

$$
move(a,c)
$$

---

## 38. Causal link

**Intuition:** Record করে যে একটি step অন্য step-এর দরকারি condition establish করে।

**Formal shape:**

$$
\langle s_i, s_j, c \rangle
$$

meaning $s_i$, $s_j$-এর জন্য $c$ provide করে।

---

## 39. Temporal ordering

**Intuition:** Record করে যে একটি step অন্য step-এর আগে happen করতে হবে।

**Formal shape:**

$$
\langle s_i, s_j \rangle \in \prec_T
$$

meaning:

$$
s_i \prec_T s_j
$$

---

## 40. Open precondition

**Intuition:** একটি step-এর required condition যা causal link দ্বারা এখনও supported নয়।

**Formal definition:**

Step $s_j$-এর precondition $c$ আছে, কিন্তু নেই:

$$
\langle s_i, s_j, c \rangle \in \prec_C
$$

**Repair:**

Choose বা instantiate করো $s_i$ such that:

$$
c \in post(s_i)
$$

and add:

$$
\langle s_i, s_j, c \rangle
$$

to $\prec_C$।

---

## 41. Causal link conflict

**Intuition:** Third step provider ও consumer-এর মাঝখানে occur করে causal link দ্বারা protected condition negate করতে পারে।

**Repair:**

Temporal ordering যোগ করে threatening step-কে provider-এর আগে অথবা consumer-এর পরে force করা।

---

## 42. Parallel POCL plan

**Intuition:** POCL plan যা steps-এর মধ্যে concurrency এবং non-concurrency-ও represent করতে পারে।

**Formal definition:**

$$
\langle S,\prec_T,\prec_C,\#,=\rangle
$$

where $\#$ is symmetric non-concurrency and $=$ is symmetric concurrency।

**[EXAM FLAG]** Definition formula sheet-এ থাকবে।

---

## 43. Parallel step conflict

**Intuition:** দুই unordered steps parallel-এ occur করতে পারে, কিন্তু তাদের postconditions inconsistent।

**Formal shape:**

Conflict exists when:

$$
post(s_i) \text{ inconsistent with } post(s_j)
$$

and:

$$
s_i \not\prec_T s_j
$$

and:

$$
s_j \not\prec_T s_i
$$

and:

$$
\langle s_i, s_j \rangle \notin \#
$$

**Repair:** Steps non-concurrent বানাও, usually ordering বা non-concurrency information যোগ করে।

---

## 44. Multi-agent parallel POCL plan

**Intuition:** Agent-দের step assignments সহ parallel POCL plan।

**Formal definition:**

$$
M = \langle A, S, \prec_T, \prec_C, \#, =, X \rangle
$$

where $A$ is the agent set and $X$ assigns steps to agents:

$$
\langle s,a \rangle \in X
$$

meaning agent $a$ executes step $s$।

---

## 45. Redundant step

**Intuition:** একটি step redundant যদি এটি যে সব causal links provide করে সেগুলো সব অন্য steps দ্বারা supplied হতে পারে।

**Formal definition:**

Step $s$ redundant when there exists $R \subseteq S$ such that for every causal link:

$$
\langle s, s'', c \rangle
$$

there is some:

$$
s' \in R
$$

with:

$$
c \in post(s')
$$

---

## 46. Causal-link adjustment

**Intuition:** কোন step একটি condition অন্য step-কে provide করে সেটি change করা।

**Formal transformation:**

Start with:

$$
l = \langle s_i, s_j, c \rangle
$$

Find $s_k$ such that:

$$
c \in post(s_k)
$$

and:

$$
s_j \not\prec_T s_k
$$

Then replace the link with:

$$
\langle s_k, s_j, c \rangle
$$

**[EXAM FLAG]** Transcript বলে students-দের identify করতে পারা উচিত কখন কোনো কিছু causal link-এর adjustment।

---

## 47. Total step cost

**Intuition:** Plan-এর steps-এর total cost।

এই lectures-এ:

$$
\text{total step cost} = \text{number of steps}
$$

---

## 48. Linearisation

**Intuition:** Partial-order plan-কে executable ordered plan-এ turn করা।

Parallel setting-এ linearisation decide করতে পারে কোন unordered actions একই সময়ে execute করা যাবে।

Examples দেখায় যে potential parallel steps identify করা linearisation-এর সময় ঘটে, partial-order causal-link plan construction-এর সময় নয়।

---

# Exam flags and high-value points

1. **[EXAM FLAG] POCL definition**  
   POCL plan-এর technical definition “will be on formula sheet in the exam” হিসেবে marked। কীভাবে ব্যবহার করতে হয় জানো:

   $$
   \langle S,\prec_T,\prec_C\rangle
   $$

   এবং temporal ও causal-link tuples interpret করতে পারো।

2. **[EXAM FLAG] Parallel POCL definition**  
   Parallel POCL plan-এর technical definition “will be on formula sheet in the exam” হিসেবে marked। জানো:

   $$
   \langle S,\prec_T,\prec_C,\#,=\rangle
   $$

   এবং $\#$ ও $=$-এর meanings।

3. **[EXAM FLAG] Algorithm not examinable**  
   Multi-Agent Plan Coordination by Plan Modification algorithm explicitly **Not Examinable**।

4. **[EXAM FLAG] Algorithm-এর বদলে যা expected**  
   Transcript বলে students-দের able হওয়া উচিত:

   - কোনো plan viable multi-agent parallel POCL plan কিনা বলতে,
   - কোনো কিছু causal link-এর adjustment কিনা identify করতে।

5. **[EXAM FLAG / HIGH VALUE] Merged Blocks World operators**  
   Examples-এ operators `move` actions-এ merge করা হয়েছে। Students-দের এখনও preconditions ও effects infer করতে পারা উচিত।

6. **[HIGH VALUE] Causal-link adjustment redundancy removal চালায়**  
   Examples repeatedly key mechanism দেখায়:

   - causal links alternative provider steps-এ adjust করা,
   - তারপর কোনো step আর causal links support না করলে সেটি remove করা।

7. **[HIGH VALUE] Parallelisation POCL construction-এর পরে**  
   Potential parallel steps linearisation বা post-processing-এর সময় identify করা হয়, core causal-link adjustment process হিসেবে নয়।

---

# Connections to earlier or other material

- **Previous week-এর planning material-এর সঙ্গে connection:** Partial-order plans পরে আগের studied fully ordered type-এর plan-এ linearised হয়।
- **Single-agent থেকে multi-agent planning-এর connection:** Single-agent POCL extend হয়ে parallel POCL, তারপর step assignments যোগ করে multi-agent parallel POCL হয়।
- **Centralised planning-এর সঙ্গে connection:** Multi-agent parallel POCL ব্যবহার করা যায় যেখানে individual agents local partial plans তৈরি করে এবং centralised component সেগুলো merge করে।
- **Blocks World-এর সঙ্গে connection:** সব worked examples Blocks World ব্যবহার করে, simplified merged `move` operators সহ।
- **Reinforcement learning-এর সঙ্গে connection:** POMDPs এখানে covered নয়, কিন্তু lecture note করে reinforcement learning এগুলো solve করার একটি major technique এবং অন্য unit-এ covered।

---

# Recording-এ revisit করার unclear sections

1. **[UNCLEAR] “POCL”-এর auto-transcription**  
   Transcript বারবার “POCL” garble করেছে “Pascal,” “class,” “coarsening,” বা similar হিসেবে। Context ভিন্ন কিছু না বললে এগুলো **Partial Order Causal Link** হিসেবে পড়তে হবে।

2. **[UNCLEAR] Example 1 Agent B causal link for $clear(d)$**  
   Slide lists:

   $$
   (s^B_{init}, s^B_3, clear(d))
   $$

   যদিও diagram-এ $A$ on $D$, তাই $D$ initially clear হওয়া উচিত নয়। Slide আরও lists করে:

   $$
   (s^B_1, s^B_3, clear(d))
   $$

   যা $move(a,table)$ দ্বারা $D$ clear হওয়ার সঙ্গে consistent। এটি likely slide typo বা transcription issue; audio check করো।

3. **[UNCLEAR] Example 1 potential parallel steps in transcript**  
   Transcript যেন বলে Agent B redundant হিসেবে removed হওয়ার পরও $move(c,table)$ parallel-এ করতে পারে। Slide potential parallel steps দেখায়:

   $$
   move(c,table) \parallel move(a,table)
   $$

   and:

   $$
   move(a,c) \parallel move(b,d)
   $$

   Exact spoken explanation দরকার হলে recording check করো।

4. **[UNCLEAR] Parallel step conflict formula typo**  
   Parsed slide text-এ temporal conditions-এ likely typo আছে। Intended condition হলো neither:

   $$
   s_i \prec_T s_j
   $$

   nor:

   $$
   s_j \prec_T s_i
   $$

   holds।

5. **[UNCLEAR] Algorithm terminology: flagged steps vs flagged causal links**  
   Algorithm slide “number of flagged steps” বলে, কিন্তু transcript causal links considering করার পর flag করার কথা বলে। “flagged steps” shorthand কিনা বা slide/transcript inconsistency কিনা check করো।

6. **[UNCLEAR] Algorithm-এ null solution-এর cost**  
   Algorithm $M$-এর total step cost, `Solution`-এর total step cost-এর সঙ্গে compare করে, কিন্তু `Solution` null দিয়ে initialise করা। Null-এর cost convention lecture-এ stated নয়।

7. **[UNCLEAR] Example 1 assignment relation notation**  
   Formal definition $A$ ব্যবহার করে agents-এর set-এর জন্য এবং $X$ assignments-এর জন্য। Example slide assignment set label করেছে:

   $$
   A = \{\langle s,A\rangle,\ldots\}
   $$

   এটিকে assignment relation $X$ হিসেবে treat করো, কিন্তু assessed work-এ notation important হলে verify করো।
