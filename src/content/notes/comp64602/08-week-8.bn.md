---
subject: COMP64602
chapter: 8
title: "Week 8"
language: bn
---

# COMP64602 Planning — বাংলা স্টাডি নোটস

**বিষয় ও পরিসর:** এই লেকচার-সেটটি AI planning নিয়ে: কীভাবে একটি agent কোনো goal-এ পৌঁছানোর জন্য actions-এর sequence তৈরি করে, planning problem কীভাবে PDDL-এ লেখা হয়, forward/backward search কীভাবে plan খোঁজে, heuristics কীভাবে search কমায়, hierarchical planning কীভাবে abstraction ব্যবহার করে, এবং online planning/replanning কীভাবে uncertainty ও changing environment সামলায়।

**Course:** COMP64602  
**Lecture topics covered:** PDDL; Forward and Backward Search; Planning Heuristics; Hierarchical Planning / HTNs; Online Planning.

**ব্যবহৃত source files:**

- `PDDL.pdf`
- `PDDL-English (1).txt`
- `ForwardandBackward-1.pdf`
- `Forwards and Backwards Search-English (1).txt`
- `Heuristics.pdf`
- `Planning Heuristics-English (1).txt`
- `HTN.pdf`
- `HTN-English (1).txt`
- `OnlinePlanning.pdf`
- `Online Planning-English (1).txt`

---

## 1. Planning Problems এবং PDDL

### 1.1 Planning problem কী

**Intuition:** Planning problem হলো এমন একটি সমস্যা যেখানে agent আগে থেকেই ঠিক করে নিতে চায় কী কী action করলে সে goal-এ পৌঁছাবে। Agent-এর একটি starting state, একটি goal state, এবং কিছু available actions থাকে। Planning-এর কাজ হলো starting state থেকে goal state-এ পৌঁছানোর জন্য actions-এর একটি sequence বেছে নেওয়া।

**Lecture definition:** Planning problem হলো এমন সমস্যা যেখানে একটি agent-কে কোনো goal অর্জনের জন্য actions-এর sequence সম্পর্কে সিদ্ধান্ত নিতে হয়।

### 1.2 Classical planning-এর assumptions

Classical planning সাধারণত ধরে নেয়:

- Environment সম্পূর্ণভাবে known।
  - Agent জানে environment-এ কী আছে এবং কোথায় আছে।
- Plan enact করার সময় environment বদলাবে না।
  - অন্য agent এসে জিনিস সরিয়ে দেবে বা world পরিবর্তন করবে — এমনটা ধরা হয় না।
- Actions-এর effects deterministic।
  - Agent কোনো action করলে তার ফলাফল নিশ্চিত; probabilistic uncertainty নেই।

Lecturer উল্লেখ করেন যে এখন uncertain ও changeable environments নিয়ে অনেক আগ্রহ আছে, কিন্তু এই লেকচারগুলোর শুরুতে classical assumptions-ভিত্তিক examples ব্যবহৃত হয়েছে।

### 1.3 আগের logic-based agents-এর সঙ্গে connection

Lecturer planning-কে আগের logic-based agents-এর সঙ্গে যুক্ত করেন:

- Logic-based agents planning-like problems solve করতে পারে।
- কিন্তু আগের পদ্ধতিগুলোতে programmer বিভিন্ন ধরনের plans সরবরাহ করে।
- Agent তখন supplied plans-এর মধ্যে থেকে কোন plan enact করবে তা বেছে নেয়।
- এই planning অংশের প্রশ্ন হলো: agent কি নিজে নিজে plans তৈরি করতে পারে?

**Connection:** Lecture sequence-টি “programmer supplies plans” থেকে “agent constructs plans”-এ এগিয়ে যায়।

---

## 2. PDDL: Planning Domain Description Language

### 2.1 PDDL কী

**Intuition:** PDDL হলো planning problems formalভাবে লেখার syntax, যাতে কোনো planner সেগুলো solve করতে পারে।

**Lecture definition:** Planning Domain Description Language হলো planning problems define করার syntax। এর key concept হলো **action schema**, যা actions-এর preconditions এবং effects define করে। এই action schemas chain করে plans তৈরি করা যায়।

Lecturer বলেন Russell and Norvig textbook-এ PDDL syntax adapt করা হয়েছে, কিন্তু এই lecture-এ actual PDDL planner-এ ব্যবহৃত syntax ব্যবহার করা হয়েছে।

### 2.2 Action schema

**Intuition:** Action schema হলো action-এর template। এটি বলে:

- action-এর নাম কী;
- action কী parameters নেয়;
- action applicable হওয়ার আগে কী সত্য হতে হবে;
- action execute করার পর কী সত্য বা মিথ্যা হবে।

**Formal syntax from lecture, slide example পরিষ্কার করে লেখা:**

```lisp
(:action move
 :parameters (?x ?y - waypoint)
 :precondition (and (at ?x))
 :effect (and
          (at ?y)
          (not (at ?x))))
```

অর্থ:

- Action-এর নাম `move`।
- Parameters হলো `?x` এবং `?y`।
- দুটিই `waypoint` type-এর।
- Precondition হলো `(at ?x)`: robot বর্তমানে `?x`-এ থাকতে হবে।
- Effects:
  - add `(at ?y)`: robot এখন `?y`-এ আছে।
  - delete `(at ?x)`: robot আর `?x`-এ নেই।

Lecturer জোর দেন যে planning-এ effects-কে facts that are **added** এবং facts that are **removed** হিসেবে ভাবা typical।

[UNCLEAR] PDDL slide-এ `move` action-এর জন্য duplicate `:parameters` line আছে: একটি `(:action move :parameters (?x, ?y)` এবং আরেকটি `:parameters (?x ?y - waypoint)`। ব্যবহারযোগ্য typed PDDL form হলো দ্বিতীয়টি।

### 2.3 Variables এবং constants

PDDL syntax-এ:

- Variables question mark দিয়ে শুরু হয়: যেমন `?x`, `?y`।
- Actual objects question mark দিয়ে শুরু হয় না।
  - উদাহরণ constants: `waypoint_a`, `waypoint_b`।

Lecturer ব্যাখ্যা করেন যে action apply করার সময় variables-এর জায়গায় actual objects বসানো হয়।

### 2.4 Preconditions এবং applicability

কোনো action applicable কিনা তা নির্ভর করে তার preconditions current state-এর সঙ্গে match করে কিনা।

`move` action-এর জন্য:

```lisp
:precondition (and (at ?x))
```

এর অর্থ robot `?x` থেকে move করতে পারবে শুধুমাত্র যদি current state-এ `(at ?x)` fact থাকে।

### 2.5 Effects: added এবং removed facts

`move` action-এর জন্য:

```lisp
:effect (and
         (at ?y)
         (not (at ?x)))
```

Positive effect `(at ?y)` state-এ add হয়।

Negative effect `(not (at ?x))` state থেকে `(at ?x)` remove করে।

### 2.6 Closed world assumption

**Definition:** PDDL **closed world assumption** ব্যবহার করে: current state description থেকে কোনো fact derive করা না গেলে সেটি false ধরে নেওয়া হয়।

Example:

- Planner যদি `(at ?x)` derive করতে না পারে, তাহলে সে ধরে নেয় `(at ?x)` false।
- তাই `move` action শুধু তখনই কাজ করবে যখন agent জানে যে সে relevant location-এ আছে।

---

## 3. PDDL files: domain file এবং problem file

### 3.1 Domain file

**Intuition:** Domain file বলে এই domain-এ কী ধরনের objects আছে, কোন predicates relevant, এবং কোন actions available।

**Lecture definition:** Planning domain define হয় action schemas-এ ব্যবহৃত predicates-এর set এবং action schemas-এর set দিয়ে।

Lecture-এর example domain:

```lisp
(define (domain robot-patrol)

  (:types waypoint)

  (:predicates
    (at ?x)
  )

  (:action move
    :parameters (?x ?y - waypoint)
    :precondition (and (at ?x))
    :effect (and
              (at ?y)
              (not (at ?x))))
)
```

Components:

- `robot-patrol` হলো domain name।
- `waypoint` হলো type।
- `(at ?x)` হলো domain-এ ব্যবহৃত predicate।
- `move` হলো available action।
- এই domain-এ robot-এর একমাত্র action হলো move।

### 3.2 Problem file

**Intuition:** Problem file কোনো domain-এর ভেতরে একটি নির্দিষ্ট planning task দেয়। এতে actual objects, initial state, এবং goal state থাকে।

Lecture-এর example problem:

```lisp
(define (problem to_b)
  (:domain robot-patrol)

  (:objects
    waypoint_a waypoint_b - waypoint
  )

  (:init
    (at waypoint_a) ; the robot is at a
  )

  (:goal
    (at waypoint_b)
  )
)
```

Components:

- Problem name: `to_b`।
- ব্যবহৃত domain: `robot-patrol`।
- Objects:
  - `waypoint_a`
  - `waypoint_b`
- Initial state:
  - `(at waypoint_a)`
- Goal:
  - `(at waypoint_b)`

### 3.3 Worked example: simple robot patrol plan

Given:

```lisp
(:init
  (at waypoint_a)
)

(:goal
  (at waypoint_b)
)
```

এবং action:

```lisp
(:action move
 :parameters (?x ?y - waypoint)
 :precondition (and (at ?x))
 :effect (and
          (at ?y)
          (not (at ?x))))
```

Obvious plan:

```lisp
move(waypoint_a, waypoint_b)
```

Step-by-step:

1. Current state-এ `(at waypoint_a)` আছে।
2. Match করি `?x = waypoint_a`, `?y = waypoint_b`।
3. Precondition `(at ?x)` becomes `(at waypoint_a)`, যা true।
4. Effects apply করি:
   - add `(at waypoint_b)`;
   - remove `(at waypoint_a)`।
5. Resulting state goal `(at waypoint_b)` satisfy করে।

### 3.4 PDDL testing tools

Lecture-এ PDDL planning problems test করার জন্য কয়েকটি tool mention করা হয়েছে:

- Online editor: `editor.planning.domains`
- Source code planner: PDDL4J
- VSCode PDDL plugin

এগুলো planning domains এবং problems sensibly construct হয়েছে কিনা test করার উপায় হিসেবে দেওয়া হয়েছে।

### 3.5 Exam flag

**EXAM FLAG:** Lecturer স্পষ্টভাবে বলেছেন exam-এ simple PDDL planning domain descriptions **read এবং construct** করতে পারার expectation আছে।

Revise করতে হবে:

- action schema syntax;
- parameters এবং types;
- preconditions;
- effects;
- `not` effects as deleted facts;
- domain files;
- problem files;
- variables vs constants;
- closed world assumption।

---

# 4. Forward এবং Backward Search for Planning

## 4.1 Forward search

### 4.1.1 Definition

**Intuition:** Forward search শুরু হয় agent-এর actual initial state থেকে। এটি possible actions try করে, possible states-এর মধ্যে forward move করে, এবং goal state পাওয়া পর্যন্ত চালিয়ে যায়।

**Lecture definition:** Forward search-এ আমরা planning problem-এর initial state থেকে শুরু করি এবং goal state-এ পৌঁছানো পর্যন্ত সব applicable actions apply করি।

### 4.1.2 Applicability of actions

কোনো action applicable কিনা নির্ধারণ করতে:

- current state-কে action-এর precondition-এর সঙ্গে unify করা হয়;
- preconditions current state-এর সঙ্গে match করলে action apply করা যায়।

Applicable action select করার পর planner action-এর effects অনুযায়ী state update করে:

- effect যদি বলে কোনো fact true, সেটি state-এ add করা হয়;
- effect যদি বলে কোনো fact not true, সেটি state থেকে remove করা হয়।

### 4.1.3 Forward search algorithm, lecture-এর ভাষ্য পরিষ্কার করে

```text
ForwardSearch(initial_state, goal, actions):

1. Initial state থেকে শুরু করো।
2. Current state goal satisfy করে কিনা check করো।
3. না করলে, যেসব actions-এর preconditions current state-এর সঙ্গে unify করে সেগুলো খুঁজে বের করো।
4. প্রতিটি applicable action-এর জন্য:
   a. Action notionally apply করো, physically নয়।
   b. Positive effects state-এ add করো।
   c. Negated effects অনুযায়ী facts remove করো।
   d. Successor state generate করো।
5. Goal state না পাওয়া পর্যন্ত successor states search করো।
6. Breadth-first search, depth-first search, বা আরও sophisticated search method ব্যবহার করা যায়।
```

### 4.1.4 Breadth-first search বনাম depth-first search

Lecture-এ standard contrast দেওয়া হয়েছে।

**Breadth-first search:**

- Current state থেকে options generate করে।
- প্রতিটি action-এর outcome turn-by-turn consider করে।
- এরপর next level-এর সব outcomes consider করে, এভাবে চলতে থাকে।
- Tree হিসেবে ভাবলে breadth-first search level-by-level কাজ করে।
- Fewest actions সহ plan খুঁজে পায়।
- কিন্তু memory intensive।

**Depth-first search:**

- Options generate করে।
- প্রথম option explore করে।
- সেই state থেকে আবার options generate করে।
- আবার প্রথম option explore করে।
- Loop বা end state পেলে backtrack করে previous state-এ ফিরে অন্য branch try করে।

[UNCLEAR] Transcript-এ “breakfast search” এবং “depth research” আছে; slides/context অনুযায়ী এগুলো **breadth-first search** এবং **depth-first search**।

### 4.1.5 Forward search কেন বড় state space তৈরি করে

Forward search অনেক বড় state space তৈরি করতে পারে, কারণ এটি goal-এর দিকে কোন choices useful তা না জেনেই legal actions expand করতে পারে।

Blocks World example:

- পরের কোন block pick up করা হবে তার অনেক option থাকতে পারে।
- কোনো block কোথায় put down/stack করা হবে তারও অনেক option থাকতে পারে।
- ফলে branching factor দ্রুত বড় হয়।

Lecturer পরে এটাকে heuristics-এর সঙ্গে connect করেন: heuristics promising branches-এর দিকে search guide করে।

---

## 4.2 Blocks World domain

Forward/Backward Search lecture-এর main worked example হলো Blocks World। এখানে blocks `A`, `B`, এবং `C` আছে।

Initial visual situation:

- `B` table-এর উপর আছে।
- `A` table-এর উপর আছে।
- `C`, `A`-এর উপর আছে।

Goal হলো এমন state যেখানে **B is between C and A**: অর্থাৎ `A` bottom-এ, `B` `A`-এর উপর, এবং `C` `B`-এর উপর।

### 4.2.1 Blocks World action: `pick-up`

```lisp
(:action pick-up
 :parameters (?x - block)
 :precondition (and
                (clear ?x)
                (ontable ?x)
                (handempty))
 :effect (and
          (not (ontable ?x))
          (not (clear ?x))
          (not (handempty))
          (holding ?x)))
```

Meaning:

- `?x` block pick up করা যায় যদি:
  - block clear হয়;
  - block table-এর উপর থাকে;
  - hand/gripper empty থাকে।
- Effects:
  - `?x` আর table-এর উপর নেই;
  - `?x` আর clear নয়;
  - hand আর empty নয়;
  - hand এখন `?x` hold করছে।

### 4.2.2 Blocks World action: `put-down`

```lisp
(:action put-down
 :parameters (?x - block)
 :precondition (holding ?x)
 :effect (and
          (not (holding ?x))
          (clear ?x)
          (handempty)
          (ontable ?x)))
```

Meaning:

- `?x` put down করা যায় যদি hand `?x` hold করে।
- Effects:
  - hand আর `?x` hold করছে না;
  - `?x` clear;
  - hand empty;
  - `?x` table-এর উপর।

### 4.2.3 Blocks World action: `stack`

```lisp
(:action stack
 :parameters (?x - block ?y - block)
 :precondition (and
                (holding ?x)
                (clear ?y))
 :effect (and
          (not (holding ?x))
          (not (clear ?y))
          (clear ?x)
          (handempty)
          (on ?x ?y)))
```

Meaning:

- `?x`-কে `?y`-এর উপর stack করা যায় যদি:
  - hand `?x` hold করে;
  - `?y` clear থাকে।
- Effects:
  - hand আর `?x` hold করছে না;
  - `?y` আর clear নয়;
  - `?x` clear;
  - hand empty;
  - `?x` `?y`-এর উপর।

### 4.2.4 Blocks World action: `unstack`

```lisp
(:action unstack
 :parameters (?x - block ?y - block)
 :precondition (and
                (on ?x ?y)
                (clear ?x)
                (handempty))
 :effect (and
          (holding ?x)
          (clear ?y)
          (not (clear ?x))
          (not (handempty))
          (not (on ?x ?y))))
```

Meaning:

- `?x`-কে `?y` থেকে unstack করা যায় যদি:
  - `?x` `?y`-এর উপর থাকে;
  - `?x` clear থাকে;
  - hand empty থাকে।
- Effects:
  - hand `?x` hold করছে;
  - `?y` clear হয়;
  - `?x` আর clear নয়;
  - hand আর empty নয়;
  - `?x` আর `?y`-এর উপর নেই।

[UNCLEAR] Transcript-এ `unstack` effect-এর একটি অংশ garbled, এবং “Y is not clear” টাইপের কথা এসেছে; slide schema অনুযায়ী correct effect হলো `(clear ?y)`।

---

## 4.3 Worked example: forward search in Blocks World

### 4.3.1 Initial state

Initial state:

```text
ontable(A), ontable(B), clear(B), on(C, A), clear(C), handempty
```

Visual meaning:

- `A` table-এর উপর।
- `B` table-এর উপর।
- `B` clear।
- `C`, `A`-এর উপর।
- `C` clear।
- hand empty।

### 4.3.2 Goal state

Goal: `B` যেন `C` এবং `A`-এর মাঝখানে থাকে।

Backward search-এ ব্যবহৃত corresponding goal state:

```text
ontable(A), on(B, A), on(C, B), clear(C), handempty
```

### 4.3.3 Initial state থেকে applicable actions

Initial state থেকে lecturer দুইটি applicable action identify করেন:

```text
pick-up(B)
unstack(C, A)
```

`pick-up(B)` applicable কারণ:

- `B` clear;
- `B` table-এর উপর;
- hand empty।

`unstack(C, A)` applicable কারণ:

- `C` `A`-এর উপর;
- `C` clear;
- hand empty।

### 4.3.4 Branch 1: `pick-up(B)` apply করা

Action:

```text
pick-up(B)
```

Starting state:

```text
ontable(A), ontable(B), clear(B), on(C, A), clear(C), handempty
```

Effects of `pick-up(B)`:

- remove `ontable(B)`;
- remove `clear(B)`;
- remove `handempty`;
- add `holding(B)`।

Resulting state, slides/transcript অনুযায়ী:

```text
ontable(A), holding(B), on(C, A), clear(C)
```

এই state থেকে options:

```text
put-down(B)
stack(B, C)
```

#### Option 1: `put-down(B)`

Planner যদি apply করে:

```text
put-down(B)
```

তাহলে original state-এ ফিরে যায়, কারণ B pick up করে আবার put down করা হয়েছে।

Lecturer এটাকে loop হিসেবে describe করেন। Depth-first search-এ branch থামে এবং planner backtrack করে।

#### Option 2: `stack(B, C)`

Planner যদি apply করে:

```text
stack(B, C)
```

তাহলে `B`, `C`-এর উপর রাখা হয়।

Resulting state from slide/transcript:

```text
ontable(A), on(B, C), on(C, A), clear(B)
```

এরপর only available option:

```text
unstack(B, C)
```

`unstack(B, C)` apply করলে previous state-এ ফিরে আসে। তাই branch loop/backtrack করে।

[UNCLEAR] `stack(B, C)`-এর পর slide state-এ `handempty` omit করা হয়েছে, যদিও `stack` action schema-তে `handempty` effect হিসেবে আছে। Lecture-এর state listing abbreviated।

### 4.3.5 Branch 2: `unstack(C, A)` apply করা

Action:

```text
unstack(C, A)
```

Effects:

- add `holding(C)`;
- add `clear(A)`;
- remove `clear(C)`;
- remove `handempty`;
- remove `on(C, A)`।

Resulting state:

```text
ontable(A), clear(A), ontable(B), clear(B), holding(C)
```

Available options:

```text
put-down(C)
stack(C, A)
stack(C, B)
```

#### Option: `stack(C, A)`

এটি `C`-কে আবার `A`-এর উপর stack করে, ফলে initial configuration-এ ফিরে যায়। Lecturer এটাকে loop হিসেবে দেখান।

#### Option: `put-down(C)`

এতে তিনটি block-ই table-এর উপর ও clear অবস্থায় থাকে:

```text
ontable(A), clear(A), ontable(B), clear(B), ontable(C), clear(C)
```

সেখান থেকে options:

```text
pick-up(A)
pick-up(B)
pick-up(C)
```

Lecture এখানেই detailed expansion থামায়, কারণ point হলো forward search কীভাবে all possible actions repeatedly apply করে এবং loops/dead ends থেকে backtrack করে।

### 4.3.6 Example-এর important idea

Human খুব দ্রুত intended plan direction দেখতে পারে, কিন্তু uninformed forward search সেই insight ব্যবহার করে না। এটি blindভাবে legal কিন্তু unhelpful branches explore করে, যেমন:

```text
pick-up(B) → put-down(B)
pick-up(B) → stack(B, C) → unstack(B, C)
unstack(C, A) → stack(C, A)
```

এগুলো legal action sequences, কিন্তু goal-এ পৌঁছাতে helpful নয়।

এটাই heuristics ব্যবহারের motivation।

---

# 5. Backward search for planning

## 5.1 Definition

**Intuition:** Backward search goal থেকে শুরু করে পিছনের দিকে কাজ করে। “এখন কী করতে পারি?” না জিজ্ঞেস করে এটি জিজ্ঞেস করে: “কোন action এই state তৈরি করতে পারত?”

**Lecture definition:** Backward search goal state দিয়ে শুরু করে এবং initial state-এ পৌঁছানো পর্যন্ত সেই state-এ lead করতে পারে এমন সব actions explore করে।

## 5.2 Backward search actions কীভাবে choose করে

Forward search-এ:

- current state-কে action-এর **preconditions**-এর সঙ্গে unify করা হয়।

Backward search-এ:

- current state-কে action-এর **postconditions/effects**-এর সঙ্গে unify করা হয়, যাতে বোঝা যায় কোন actions ওই state-এ lead করতে পারত।

তারপর action effects reverse করে previous state calculate করা হয়:

- postcondition/effect-এ negated যা ছিল, backwards গেলে তা add করা হয়;
- postcondition/effect-এ positive যা ছিল, backwards গেলে তা delete করা হয়।

Lecture বলে breadth-first বা depth-first দুটো search-ই ব্যবহার করা যায়।

### 5.3 Cost এবং efficiency

Lecture states:

- Theory অনুযায়ী backward search forward search-এর মতোই computationally expensive হওয়ার কথা।
- Practice-এ backward search অনেক সময় বেশি efficient, কারণ final state often initial state-এর তুলনায় বেশি constrained।

---

## 5.4 Worked example: backward search in Blocks World

### 5.4.1 Goal state

Goal state:

```text
ontable(A), on(B, A), on(C, B), clear(C), handempty
```

এটি tower: `A` table-এ, `B` `A`-এর উপর, `C` `B`-এর উপর।

### 5.4.2 Last action identify করা

Lecture বলে final state produce করতে পারে এমন only action হলো:

```text
stack(C, B)
```

কারণ:

- Final goal-এ `on(C, B)` আছে।
- `C` clear।
- hand empty।
- সব block এক column-এ।

### 5.4.3 `stack(C, B)`-এর আগে previous state derive করা

`stack` action schema:

```lisp
(:action stack
 :parameters (?x - block ?y - block)
 :precondition (and
                (holding ?x)
                (clear ?y))
 :effect (and
          (not (holding ?x))
          (not (clear ?y))
          (clear ?x)
          (handempty)
          (on ?x ?y)))
```

Instantiate:

```text
?x = C
?y = B
```

So effects of `stack(C, B)`:

```text
not holding(C)
not clear(B)
clear(C)
handempty
on(C, B)
```

Backward search এগুলো reverse করে:

| Forward direction-এর effect | Backward operation |
|---|---|
| `not holding(C)` | add `holding(C)` |
| `not clear(B)` | add `clear(B)` |
| `clear(C)` | delete `clear(C)` |
| `handempty` | delete `handempty` |
| `on(C, B)` | delete `on(C, B)` |

Previous state:

```text
ontable(A), on(B, A), clear(B), holding(C)
```

### 5.4.4 সেই previous state-এর আগে options

From:

```text
ontable(A), on(B, A), clear(B), holding(C)
```

Lecture দুটি possible preceding actions identify করে:

```text
pick-up(C)
unstack(C, B)
```

এগুলো এমন actions যা agent-কে `holding(C)` অবস্থায় আনতে পারত।

### 5.4.5 `pick-up(C)` branch explore করা

Previous action যদি হয়:

```text
pick-up(C)
```

তাহলে তার আগে `C` table-এর উপর ও clear ছিল, এবং hand empty ছিল।

Slide-এর previous state:

```text
ontable(A), on(B, A), clear(B), ontable(C), clear(C), handempty
```

Options:

```text
stack(B, A)
put-down(C)
```

Backward search tree এরপর জিজ্ঞেস করে `stack(B, A)`-এর আগে কী ঘটতে পারত:

```text
pick-up(B)
unstack(B, A)
unstack(B, C)
```

Lecturer continuation student-এর জন্য ছেড়ে দেন, কারণ point হলো backward search mechanics দেখানো।

### 5.4.6 Backward search using variables

Lecturer backward search search কমাতে পারে এমন একটি বিশেষ case দেন: কোনো object action schema-এর precondition-এ থাকে, কিন্তু effects-এ শুধু negatively থাকে।

Example action schema:

```lisp
(:action unload
 :parameters (?x - cargo ?y - plane ?z - airport)
 :precondition (and
                (in ?x ?y)
                (at ?y ?z))
 :effect (and
          (at ?x ?z)
          (not (in ?x ?y))))
```

Meaning:

- `?x` cargo।
- `?y` plane।
- `?z` airport।
- Preconditions:
  - cargo `?x` plane `?y`-এর ভেতরে আছে;
  - plane `?y` airport `?z`-এ আছে।
- Effects:
  - cargo `?x` airport `?z`-এ আছে;
  - cargo `?x` আর plane `?y`-এর ভেতরে নেই।

Backward-search point:

- Plane variable `?y` precondition-এ আছে।
- Effects-এ এটি শুধু negative effect `(not (in ?x ?y))`-এ আছে।
- Goal থেকে backward কাজ করার সময় cargo কোনো airport-এ আছে — এটুকু থেকে কোন plane cargo এনেছে তা জানা যায় না।
- তাই planner previous state-এ variable ব্যবহার করতে পারে, প্রতিটি possible plane enumerate না করেও।
- এতে multiple options একসঙ্গে consider করা যায় এবং search কমতে পারে।
- Lecturer সতর্ক করেন যে এটি careful programming require করে।

[UNCLEAR] Slide text-এ negative effect সম্ভবত `(not (in (?x, ?y)))` হিসেবে garbled; intended predicate হলো `(not (in ?x ?y))`।

---

# 6. Planning Heuristics

## 6.1 Heuristic কী

**Intuition:** Heuristic হলো rule of thumb যা search guide করে, যাতে planner unpromising branches explore করে সময় নষ্ট না করে।

Lecturer planning heuristics-কে এমন rules of thumb হিসেবে describe করেন যেগুলো সাধারণত plan-এর search দ্রুত করতে পারে।

## 6.2 Planning problems as graphs

Lecture বলে planning problem-কে graph হিসেবে দেখা যায়:

- প্রতিটি state একটি vertex;
- প্রতিটি action একটি edge;
- planning হলো initial state থেকে goal state পর্যন্ত shortest path problem।

Transcript-এ tree হিসেবে কথাও আসে, কারণ search প্রায়ই states-কে search tree হিসেবে expand করে।

## 6.3 Shortest path framing

Graph algorithms-এর একটি major class হলো shortest path algorithms:

- graph-এর দুই vertices-এর মধ্যে shortest path খোঁজা;
- planning-এ relevant vertices হলো initial state এবং goal state।

Lecture general shortest-path algorithms বিস্তারিত করে না।

## 6.4 A* এবং admissible heuristics

### 6.4.1 A* in lecture

**IMPORTANT FLAG:** Lecturer A* algorithm-কে particularly important বলেন।

Lecture-এর simplified presentation:

- A* একটি heuristic `h` ব্যবহার করে।
- `h` প্রতিটি state evaluate করে।
- Search সেই state-এর successors explore করে যার `h` অনুযায়ী lowest value।

### 6.4.2 Admissibility

**Formal definition from lecture:** A* algorithm-এ heuristic অবশ্যই **admissible** হতে হবে, অর্থাৎ এটি goal state-এ পৌঁছানোর distance **underestimate** করে।

**Intuition:** Heuristic optimistic হতে পারে, কিন্তু pessimistic হতে পারবে না। এটি goal-কে বাস্তবের চেয়ে কাছাকাছি দেখাতে পারে, কিন্তু distance overestimate করতে পারবে না।

[UNCLEAR] Transcript বলে ordinary forward search-কে এমন A* algorithm হিসেবে ভাবা যায় যেখানে `h` প্রতিটি state-এর জন্য `1` return করে। এটি lecturer-এর informal comparison; transcript goal state treatment specify করে না।

---

# 7. Ignore Preconditions Heuristic

## 7.1 Definition

**Formal definition from slide:** Assume all actions are applicable in all states. Then compute the minimum number of actions needed to reach the goal state.

বাংলায়: সব actions সব states-এ applicable ধরে নাও। তারপর goal state-এ পৌঁছাতে minimum কত action লাগে তা compute করো।

**Intuition:** Planner pretend করে preconditions actions block করছে না। প্রশ্ন করে: “যদি যেকোনো action যেকোনো জায়গায় ব্যবহার করা যেত, তাহলে goal facts true করতে কত actions লাগত?”

এই relaxation real problem-এর চেয়ে সহজ, তাই result real distance-এর underestimate হয়; এজন্য heuristic admissible।

## 7.2 Blocks World example

Initial state:

```text
ontable(A), ontable(B), ontable(C)
```

Goal state:

```text
ontable(A), on(B, A), on(C, B)
```

Initial visual-এ `A`, `B`, `C` সব table-এর উপর।

### 7.2.1 Initial state-এর heuristic value

Ignoring preconditions:

- `ontable(A)` already true।
- Need `on(B, A)`।
- Need `on(C, B)`।

Missing facts achieve করতে দুটো actions:

```text
stack(B, A)
stack(C, B)
```

So:

```text
h(initial) = 2
```

Transcript notes real distance বেশি, কারণ actual domain-এ pick-up actions এবং other preconditions লাগে।

### 7.2.2 First possible actions এবং heuristic values

All-on-table state থেকে possible first actions:

```text
pick-up(A)
pick-up(B)
pick-up(C)
```

#### Branch: `pick-up(A)`

Resulting state:

```text
holding(A), ontable(B), ontable(C)
```

Slide gives:

```text
h(s) = 3
```

Reason:

- Goal requires `ontable(A)`, কিন্তু `pick-up(A)` করার পর `A` আর table-এর উপর নেই।
- Planner-কে এখন achieve করতে হবে:
  - `ontable(A)`;
  - `on(B, A)`;
  - `on(C, B)`।

এই branch অন্যগুলোর চেয়ে worse।

#### Branch: `pick-up(B)`

Resulting state:

```text
ontable(A), holding(B), ontable(C)
```

Slide gives:

```text
h(s) = 2
```

Relaxed plan এখনও দুই actions away।

#### Branch: `pick-up(C)`

Resulting state:

```text
ontable(A), ontable(B), holding(C)
```

Slide gives:

```text
h(s) = 2
```

Lecturer বলেন planner `pick-up(A)` আগে explore করবে না, কারণ এর heuristic value খারাপ।

### 7.2.3 `pick-up(B)` branch continue করা

Planner explore করলে:

```text
pick-up(B)
```

Options shown:

```text
stack(B, A)
stack(B, C)
```

#### Option: `stack(B, A)`

Resulting state:

```text
ontable(A), on(B, A), ontable(C)
```

Slide gives:

```text
h(s) = 1
```

শুধু `on(C, B)` achieve করা বাকি।

#### Option: `stack(B, C)`

Resulting state:

```text
ontable(A), on(B, C), ontable(C)
```

Slide gives:

```text
h(s) = 2
```

Transcript notes real cost এর চেয়ে বেশি, কারণ `B` যদি `C`-এর উপর থাকে, তাহলে `B`-কে আগে সরাতে হবে এবং তারপর `A`-এর উপর রাখতে হবে। Key point হলো heuristic underestimates।

### 7.2.4 Heuristic কেন সাহায্য করে

Heuristic search guide করে এই দিকে:

```text
pick-up(B) → stack(B, A)
```

rather than:

```text
pick-up(A)
```

or:

```text
pick-up(B) → stack(B, C)
```

এটি planner-কে less promising branches ignore করতে সাহায্য করে।

---

# 8. Serializable Sub-goals Heuristic

## 8.1 Definition

**Formal definition from slide:** Find an order of sub-goals so that we never have to undo one once achieved.

বাংলায়: Sub-goals-এর এমন order খুঁজে বের করো যাতে কোনো sub-goal একবার achieved হলে পরে সেটি undo করতে না হয়।

**Intuition:** Goal-কে pieces-এ ভাঙো, তারপর এমন order-এ pieces solve করো যাতে completed pieces untouched রাখা যায়।

Sub-goal হলো goal state-এর individual facts-এর একটি হতে পারে।

Blocks World goal:

```text
ontable(A), on(B, A), on(C, B)
```

Sub-goals:

```text
ontable(A)
on(B, A)
on(C, B)
```

## 8.2 Requirement: domain knowledge

Lecturer বলেন এই heuristic problem/domain knowledge require করে। এটি কাজ করে যখন এমন order আছে যেখানে কোনো sub-goal achieved হলে তা পরে undo করতে হয় না।

## 8.3 Blocks World example

Goal:

```text
ontable(A), on(B, A), on(C, B)
```

Good sub-goal order:

```text
1. ontable(A)
2. on(B, A)
3. on(C, B)
```

Reasoning:

- `A` table-এ থাকলে rest solve করতে `A` move করার দরকার নেই।
- `B` `A`-এর উপর থাকলে rest solve করতে `B`-কে `A` থেকে remove করার দরকার নেই।
- শেষে `C`-কে `B`-এর উপর রাখা হয়।

### 8.4 Heuristic কীভাবে branches prune করে

Initial state: `A`, `B`, `C` সব table-এর উপর।

Possible actions:

```text
pick-up(A)
pick-up(B)
pick-up(C)
```

#### Branch: `pick-up(A)`

Planner choose করলে:

```text
pick-up(A)
```

resulting state:

```text
holding(A), ontable(B), ontable(C)
```

কিন্তু first sub-goal ছিল:

```text
ontable(A)
```

এই branch first achieved sub-goal undo করে, তাই heuristic এটি ignore/prune করে।

Slide explicitly notes:

```text
A no longer on-table - ignore
```

#### Branch: `pick-up(B)`

Planner choose করলে:

```text
pick-up(B)
```

`A` table-এ থাকে, তাই first sub-goal violate হয় না।

এরপর planner choose করতে পারে:

```text
stack(B, A)
```

এটি next sub-goal achieve করে:

```text
on(B, A)
```

Slide labels:

```text
Achieved next subgoal!
```

এরপর planner এই state থেকে continue করে:

```text
on(C, B)
```

achieve করতে।

### 8.5 Slide typo / transcript correction

[UNCLEAR] Slide bullet-এ আছে: “First achieve `ontable(A)`, then `on(B, A)`, then `on(B, C)`।” একই slide-এর goal state `ontable(A), on(B, A), on(C, B)` এবং transcript অনুযায়ী final step হলো `C`-কে `B`-এর উপর রাখা। তাই intended final sub-goal হলো `on(C, B)`, not `on(B, C)`।

---

# 9. State Abstraction Heuristic

## 9.1 Definition

**Formal definition from slide:** Remove irrelevant parts of the state.

বাংলায়: State-এর irrelevant parts remove করো।

**Intuition:** Current goal-কে affect করে না এমন objects এবং facts ignore করা। এতে state descriptions ছোট হয় এবং useless actions consideration থেকে বাদ যায়।

## 9.2 Blocks World example

Initial visual state:

```text
A, B, C all on the table
```

Goal state:

```text
ontable(A), on(B, A)
```

Goal-এ `C` সম্পর্কে কিছু বলা নেই।

Therefore:

- `C`-এর সঙ্গে সম্পর্কিত সবকিছু ignore করো;
- picking up `C` ignore করো;
- putting down `C` ignore করো;
- stacking `C` on `A` ignore করো;
- stacking `C` on `B` ignore করো।

Initial state abstracted হয়ে হয়:

```text
ontable(A), ontable(B)
```

Planner এরপর শুধু `A` ও `B` relevant facts নিয়ে কাজ করে।

## 9.3 কেন সাহায্য করে

Heuristic search problem-এর size কমায়:

- fewer state facts;
- fewer applicable actions;
- fewer irrelevant branches।

Lecturer emphasize করেন যে এটিও problem knowledge require করে, কারণ planner-কে জানতে হবে কী irrelevant।

---

# 10. Hierarchical Planning এবং HTNs

## 10.1 Motivation: abstraction দিয়ে complexity handle করা

**Intuition:** শুরুতেই সব tiny actions দিয়ে plan না করে, আগে high-level plan বানাও, তারপর details fill in করো।

Lecture travel example ব্যবহার করে:

- Goal: Manchester-এর home থেকে Paphos, Cyprus-এ travel করা।
- প্রথমে Paphos-এর nearest/useful airport খুঁজে বের করা।
- Cyprus-এ relevant airports: Larnaca এবং Paphos।
- Airports involving high-level route choose করা।
- তারপর separately plan করা:
  - home থেকে Manchester Airport কীভাবে যাবো;
  - Larnaca থেকে Paphos কীভাবে যাবো।

Lecturer explicitly বলেন তিনি শুরুতেই home থেকে সব transport options consider করেননি: bus, train, taxi, driving, এবং সেখান থেকে reachable সব places। তা huge search space তৈরি করত।

## 10.2 Hierarchical Task Networks

**Formal term:** Hierarchical planning সাধারণত **Hierarchical Task Networks**, abbreviated **HTNs**, ব্যবহার করে।

### 10.2.1 Primitive actions

**Definition:** Lowest level-এ HTNs-এর primitive actions থাকে, PDDL-এর actions-এর মতোই।

Primitive actions হলো এমন actions যা আর further planning require করে না।

Travel plan examples:

```text
taxi(home, man_airport)
fly(man_airport, larnaca)
bus(larnaca, paphos)
```

### 10.2.2 Higher-level actions / HLAs

**Definition from slides:** Higher-level actions এমন জিনিস represent করে যা further planned হতে হবে। এগুলো sub-goals-এ decomposition-এর মতো।

Example:

```text
go(home, man_airport)
```

এটি higher-level action, কারণ planner-কে এখনো work out করতে হবে exactly কীভাবে করা হবে:

- taxi?
- drive?
- train?
- bus?

### 10.2.3 Implementation

**Formal definition from slide:** Plan যদি only primitive actions contain করে, তাকে **implementation** বলা হয়।

**Intuition:** Implementation হলো fully detailed plan যা actually execute করা যায়।

### 10.2.4 High-level plan কখন goal achieve করে

**Formal definition from slide:** A high-level plan achieves a goal if at least one of its implementations achieves the goal.

বাংলায়: কোনো high-level plan goal achieve করে যদি তার অন্তত একটি implementation সেই goal achieve করে।

**Intuition:** High-level plan successful যদি সেটিকে refine করে এমন executable plan পাওয়া যায় যা goal-এ পৌঁছায়।

---

## 10.3 Top-down planning

Lecture বলে hierarchical planning সাধারণত top down হয়।

### 10.3.1 একটি high-level action দিয়ে শুরু

Initial high-level plan:

```text
go(home, paphos)
```

এটি পুরো problem represent করে: initial state থেকে goal state-এ যাওয়া।

### 10.3.2 Intermediate higher-level actions-এ refine করা

Next level:

```text
go(home, man_airport);
go(man_airport, larnaca);
go(larnaca, paphos)
```

Meaning:

1. Home থেকে Manchester Airport যাও।
2. Manchester Airport থেকে Larnaca যাও।
3. Larnaca থেকে Paphos যাও।

### 10.3.3 Primitive actions-এ refine করা

Fully implemented plan:

```text
taxi(home, man_airport);
fly(man_airport, larnaca);
bus(larnaca, paphos)
```

এটি implementation, কারণ এতে only primitive actions আছে।

---

## 10.4 Search methods for hierarchical planning

Slides বলে hierarchical planning করতে পারে:

- breadth-first search;
- depth-first search;
- more sophisticated algorithms যেমন:
  - shortest path;
  - iterative deepening।

### 10.4.1 Breadth-first in HTN planning

Transcript explanation:

- Top থেকে শুরু।
- Next-level plan work out করা।
- তারপর ওই level-এর সব items deeper যাওয়ার আগে consider করা।

### 10.4.2 Depth-first in HTN planning

Depth-first alternative:

- Top high-level action থেকে শুরু।
- একটি sub-action choose করা, যেমন `go(home, man_airport)`।
- ওই part fully refine করা।
- তারপর next high-level action refine করতে ফিরে যাওয়া।

### 10.4.3 Iterative deepening

Lecturer iterative deepening describe করেন:

- depth-first search-এর মতো;
- কিন্তু একটি particular level পর্যন্তই search;
- ওই level-এ plan না পেলে এক level আরও নিচে search;
- breadth-first search-এর তুলনায় কম memory use করতে পারে।

Lecturer details-এর জন্য Russell and Norvig দেখার কথা বলেন।

[UNCLEAR] Transcript-এ “breakfast search” এসেছে; এটি **breadth-first search**।

---

# 11. Writing higher-level actions

## 11.1 Problem: different implementations-এর different effects

Lecturer বলেন ideally higher-level actions primitive actions-এর মতো লেখা যেত, যেখানে all effects of interest define করা হয়।

কিন্তু একই HLA-এর different implementations-এর different side effects থাকতে পারে।

Example HLA:

```text
go(home, man_airport)
```

Possible implementations:

```text
taxi(home, man_airport)
drive(home, man_airport)
```

Different effects:

- Taxi নেওয়া:
  - traveller-এর enough cash থাকলে কাজ করবে;
  - result: cash কমে যাবে।
- Driving:
  - car airport-এ থাকবে পুরো trip-এর duration জুড়ে।

এই side effects goal state achieve হবে কিনা তা affect করতে পারে। যেমন traveller-এর cash আছে কিনা বা car কোথায় আছে overall goal-এর জন্য relevant হতে পারে।

## 11.2 Two approaches

Lecture দুই broad options দেয়।

### Option 1: Search করে failed implementations reject করা

Planner implementations-এর উপর search করতে পারে এবং implementation কাজ না করলে reject করতে পারে।

Example:

- Taxi implementation try করো।
- Cash effect final goal impossible করলে reject করো।
- অন্য implementation try করো।

### Option 2: Abstract levels-এ search improve করা

HLAs-কে তাদের **possible effects** দিয়ে represent করা, যাতে abstract-level search specific implementation commit করার আগে reason করতে পারে।

---

## 11.3 Possible effects notation

Lecturer Russell and Norvig-এর notation refer করেন।

Slides “twiddle”/tilde notation দেখায়:

```text
~E
~not E
```

Transcript explanation:

- `~E` means `E` possibly added।
- `~not E` means `E` possibly removed।

এটি ব্যবহার করে abstract search involves:

1. actions-এর possible choices search করা;
2. actions-এর possible outcomes/effects search করা।

তারপর desired possible outcomes সহ high-level plan পাওয়ার পরে planner এমন implementation choose করে যা those outcomes achieve করে।

---

## 11.4 Limitation: mutually exclusive effects

Lecture notes possible-effects representation **mutually exclusive effects** capture করে না।

### 11.4.1 Example

Suppose goal somehow requires both:

```text
not cash
at(car, airport)
```

অর্থ:

- cash spend করা;
- car airport-এ রেখে যাওয়া।

HLA:

```lisp
(:action go_from_home
 :parameters (?d - place)
 :precondition (and
                (at home))
 :effect (and
          (at ?d)
          (~ not cash)
          (~ at car ?d)))
```

Meaning:

- `go_from_home`-এর পর agent `?d`-এ আছে;
- cash removed হওয়া possible;
- car `?d`-এ থাকা possible।

### 11.4.2 কেন problem

Possible effects suggest করে দুটো effects-ই available হতে পারে:

```text
~not cash
~at(car, ?d)
```

কিন্তু implementations mutually exclusive:

- Taxi implementation:
  - cash deduct করে;
  - car move করে না।
- Driving implementation:
  - car airport-এ নিয়ে যায়;
  - taxi cash deduct করে না।

তাই abstract representation দেখে মনে হতে পারে এমন implementation আছে যা একই সঙ্গে cash spend করে এবং car airport-এ রাখে, যদিও single implementation দুটোই করে না।

Lecturer এই issue handle করার sophisticated search techniques বিস্তারিত করেন না, কিন্তু variable unification involved হতে পারে বলে উল্লেখ করেন।

[UNCLEAR] Slide-এ typo “airpot”; intended word “airport।”

---

# 12. Online Planning

## 12.1 Lecture-এর scope

Lecturer বলেন online planning নিয়ে এটি only brief introduction।

**IMPORTANT FLAG:** Lecturer explicitly বলেন important হলো জানা যে online planning often necessary, এবং abstractভাবে কোন ধরনের techniques ব্যবহৃত হয় সে সম্পর্কে aware থাকা।

এই lecture full implementation details দেয় না।

---

## 12.2 Contingent planning

### 12.2.1 Definition

**Intuition:** Contingent planning হলো uncertain environment-এ known possible contingencies-এর জন্য plan করা।

Advance-এ তৈরি plan সব সময় কাজ নাও করতে পারে, কারণ:

- কিছু facts execution-এর আগে unknown থাকতে পারে;
- agent শুধু environment-এ act বা perceive করার পর সেগুলো জানতে পারে।

Agent যদি জানে:

- কী সে জানে না;
- কীভাবে সেই information find out করা যায়;

তাহলে সে contingent plan বানাতে পারে।

**Formal structure:** Contingent plans action choices-এর চারপাশে `if-then-else` syntax ব্যবহার করে।

### 12.2.2 Worked example: table, chair, paint

Goal:

```text
make the chair the same colour as the table
```

Available information:

- Agent table-এর colour perceive করতে পারে।
- Agent chair-এর colour perceive করতে পারে।
- Agent-এর paint আছে।
- Paint-এর কোনো colour আছে।

Slide-এর plan:

```text
perceive(colour, table);
perceive(colour, chair);

if colour(table) = colour(chair)
then noop

else if colour(table) = colour(paint)
     then paint(chair)

else replan
```

Step-by-step:

1. Table colour perceive করো।
2. Chair colour perceive করো।
3. যদি table এবং chair already same colour হয়:
   - কিছু করো না।
   - `noop` means “no operation।”
4. Else, যদি table colour এবং paint colour same হয়:
   - chair paint করো।
5. Else:
   - replan।

Lecturer বলেন contingent plan কখনও সব branches fully expand করতে পারে। যেমন paint wrong colour হলে আরও paint find করার plan থাকতে পারে। কিন্তু যদি contingency unlikely হয়, planner আগে থেকে computational effort spend না করে `replan` ব্যবহার করতে পারে।

---

## 12.3 Replanning এবং online/ongoing planning

Contingent plan-এ `replan` command থাকলে planning **during execution** করতে হয়।

Transcript এটাকে “ongoing planning” বলে: system যখন already কিছু করছে, তখন planning হওয়া।

**Definition:** Online planning হলো execution চলার সময় planning করা, execution শুরুর আগে only plan করা নয়।

---

## 12.4 Variables in initial states and effects

Lecturer বলেন contingent planning variables require করতে পারে:

- initial state-এ;
- actions-এর effects-এ।

এটি earlier straightforward PDDL examples থেকে আলাদা, যেখানে initial state বা effects-এ variables ব্যবহার করা হয়নি।

Slide example:

```lisp
(:init
  (colour_paint ?a)
)

(:action perceive
  :effect (colour_table ?a)
)
```

Meaning:

- Paint-এর কোনো colour `?a` আছে, কিন্তু value আগে থেকে known নাও হতে পারে।
- `perceive` action table colour সম্পর্কে information introduce করতে পারে।
- `?a`-এর value perception action perform না করা পর্যন্ত known নয়।

---

## 12.5 Changing environments-এ replanning

Lecturer contingent plans-এর বাইরে idea extend করেন।

Plan explicitly contingent না হলেও changing environment-এ replanning লাগতে পারে।

Examples:

- Robot কোনো space-এ move করছে।
- কেউ কিছু knocked over করে intended route block করে।
- People objects move করে, যেগুলো robot pick up করার কথা ছিল।
- Human system-কে নতুন instructions দেয়।

Replanning needed হতে পারে কারণ:

- action-এর preconditions unexpectedly satisfied নয়;
- remaining plan কাজ করবে না;
- goals change হয়েছে;
- environment-এর other changes হয়েছে।

System-কে এগুলো monitor করতে হবে এবং arise করলে replan করতে হবে। Lecturer বলেন replanning ideally minimal হওয়া উচিত, পুরো space জুড়ে complete replanning নয়।

---

## 12.6 Minimal replanning example: failed preconditions

Slide-এ original plan path:

```text
S1 → S2 → S3 → S4 → S5
```

প্রতিটি arrow হলো action।

Expected execution:

1. `S1` থেকে start।
2. First action execute।
3. `S2`-এ পৌঁছানো।
4. `S2` থেকে next action execute করে `S3`-এ যাওয়া।

কিন্তু instead:

```text
S1 → actual state S6
```

System expected করেছিল `S2`, কিন্তু action execute করার পর নিজেকে `S6`-এ পায়।

### 12.6.1 Minimal repair strategy

Lecturer বলেন minimal plan probably try করবে নতুন plan খুঁজতে:

```text
S6 → S2
```

এতে system original plan resume করতে পারে এমন state-এ ফিরে আসে।

### 12.6.2 Alternative repair targets

Resources থাকলে system check করতে পারে `S6` থেকে directly later state-এ যাওয়া যায় কিনা:

```text
S6 → S3
S6 → S4
S6 → S5
```

এতে original plan-এর কিছু অংশ bypass করা যায়।

Planner-কে decide করতে হবে new target state কী হবে। Lecturer বলেন target current situation-এর কাছাকাছি হলে search technique hopefully কম resources use করবে।

[UNCLEAR] Transcript এই section garble করে: “transporters five” corresponds to slide path through `S3`, `S4`, `S5`; “to us for” corresponds to `to S4`।

---

# 13. Cross-lecture connections

## 13.1 PDDL → forward/backward search

PDDL lecture define করে:

- states;
- predicates;
- action schemas;
- preconditions;
- effects।

Forward/backward search lecture সেই action schemas operationalভাবে ব্যবহার করে:

- forward search preconditions check করে এবং effects apply করে;
- backward search effects/postconditions check করে এবং reverse করে।

তাই PDDL হলো representation language, আর forward/backward search হলো সেই style-এ represented planning problems solve করার basic methods।

## 13.2 Forward search → heuristics

Forward search বড় state space তৈরি করে কারণ এটি অনেক legal কিন্তু unhelpful branches expand করে।

Heuristics lecture সরাসরি এই problem address করে:

- planning-কে graph search হিসেবে দেখা;
- heuristic `h` দিয়ে search guide করা;
- A*-এর জন্য admissible heuristics ব্যবহার করা;
- domain knowledge দিয়ে bad branches prune/avoid করা।

## 13.3 Heuristics → HTNs

Planning heuristics search কমায় useful directions estimate করে বা irrelevant branches remove করে।

Hierarchical planning search কমায় অন্যভাবে:

- আগে abstract level-এ plan করা;
- পরে lower-level actions-এ decompose করা;
- start থেকেই all low-level options consider না করা।

দুটিই planning complexity manage করার mechanism।

## 13.4 HTNs → PDDL

HTNs lowest level-এ primitive actions ব্যবহার করে, এবং lecturer বলেন এগুলো PDDL-style primitive actions-এর মতোই।

So HTNs PDDL-style primitive actions-এর উপর higher-level actions add করে planning structure extend করে।

## 13.5 Classical planning → online planning

PDDL lecture শুরুতে classical assumptions দেয়:

- fully known environment;
- execution চলাকালীন no change;
- deterministic actions।

Online Planning lecture এগুলো relax করে:

- uncertain environments;
- execution চলাকালীন perception;
- contingencies;
- changing goals;
- unexpected failed preconditions;
- execution চলাকালীন replanning।

---

# 14. Exam এবং high-value flags

## 14.1 Explicit exam flag

**EXAM FLAG:** Simple PDDL planning domain descriptions **read এবং construct** করতে পারতে হবে। PDDL transcript-এ এটি explicitly stated।

Revise:

- action schema syntax;
- parameters and types;
- preconditions;
- effects;
- `not` effects as deleted facts;
- domain files;
- problem files;
- variables vs constants;
- closed world assumption।

## 14.2 Important flag: online planning

**IMPORTANT FLAG:** Online planning-এর জন্য lecturer বলেন important হলো এটি often necessary জানা এবং abstractভাবে techniques সম্পর্কে aware থাকা।

Revise:

- contingent planning;
- `if-then-else` action choices;
- `replan`;
- monitoring failed preconditions / changed goals / broken remaining plan;
- minimal replanning।

## 14.3 Important flag: A*

**IMPORTANT FLAG:** Lecturer planning-as-graph-search context-এ A* algorithm-কে particularly important বলেন।

Revise:

- states as graph vertices;
- actions as graph edges;
- shortest path from initial to goal;
- heuristic `h`;
- admissibility = underestimate of distance to goal।

## 14.4 High-value definitions

নিচের definitions পরিষ্কারভাবে জানা দরকার:

```text
Planning problem:
An agent must decide on a sequence of actions to achieve a goal.
বাংলা: Agent-কে কোনো goal achieve করার জন্য actions-এর sequence decide করতে হয়।

Action schema:
A template defining an action’s parameters, preconditions, and effects.
বাংলা: Action-এর parameters, preconditions, এবং effects define করা template।

Closed world assumption:
If a fact cannot be derived, assume it is false.
বাংলা: কোনো fact derive করা না গেলে সেটিকে false ধরে নেওয়া।

Forward search:
Start from the initial state and apply applicable actions until the goal is reached.
বাংলা: Initial state থেকে শুরু করে goal না পাওয়া পর্যন্ত applicable actions apply করা।

Backward search:
Start from the goal state and work backward through actions that could have produced it.
বাংলা: Goal state থেকে শুরু করে কোন actions সেই state produce করতে পারত তা ধরে backward কাজ করা।

Admissible heuristic:
A heuristic that underestimates the distance to the goal.
বাংলা: এমন heuristic যা goal পর্যন্ত distance underestimate করে।

Ignore preconditions heuristic:
Assume all actions are applicable in all states, then compute the minimum number of actions needed to reach the goal.
বাংলা: সব action সব state-এ applicable ধরে goal-এ পৌঁছাতে minimum actions compute করা।

Serializable sub-goals:
An ordering of sub-goals such that once a sub-goal is achieved, it never has to be undone.
বাংলা: Sub-goals-এর এমন order যেখানে একটি sub-goal achieved হলে আর undo করতে হয় না।

State abstraction:
Remove irrelevant parts of the state.
বাংলা: State-এর irrelevant parts remove করা।

HTN:
Hierarchical Task Network; a planning approach using primitive actions and higher-level actions.
বাংলা: Primitive actions এবং higher-level actions ব্যবহার করা hierarchical planning approach।

Implementation:
A plan containing only primitive actions.
বাংলা: এমন plan যেখানে only primitive actions আছে।

Contingent plan:
A plan with branches depending on perceived information or conditions.
বাংলা: Perceived information বা conditions অনুযায়ী branching করা plan।

Online planning:
Planning during execution, often because the environment is uncertain or has changed.
বাংলা: Execution চলাকালীন planning করা, সাধারণত environment uncertain বা changed হওয়ার কারণে।
```

---

# 15. Unclear sections এবং likely transcript/slide corrections

Recording check করার মতো অংশগুলো:

1. **PDDL repeatedly transcribed as PDL/PGL/PDI**  
   Slides use **PDDL**। Transcript-এ “PDL,” “PGL,” বা “PDI” এসেছে। Correct term: PDDL।

2. **PDDL action schema duplicate parameters**  
   `move` action slide-এ duplicated/garbled `:parameters` line আছে। Clean form:
   ```lisp
   :parameters (?x ?y - waypoint)
   ```

3. **Forward/backward transcript: “breakfast search”**  
   Correct: **breadth-first search**।

4. **Forward/backward transcript: “depth research”**  
   Correct: **depth-first search**।

5. **Blocks World `unstack` explanation**  
   Transcript garbles effect on `?y`। Slide schema says `unstack` makes `?y` clear:
   ```lisp
   (clear ?y)
   ```

6. **Forward-search informal solution wording**  
   Transcript says something like “take C off A, put B on A, then put C on A।” Goal অনুযায়ী শেষটি `C` on `B` হওয়া উচিত, not `C` on `A`।

7. **Backward-search transcript: “AI’s on the table” / “That is on B”**  
   Intended goal:
   ```text
   ontable(A), on(B, A), on(C, B), clear(C), handempty
   ```

8. **Backward-search `unload` schema syntax**  
   Slide likely syntax issue:
   ```lisp
   (not (in (?x, ?y)))
   ```
   Intended:
   ```lisp
   (not (in ?x ?y))
   ```

9. **Heuristics transcript: “serializable subclass heuristic”**  
   Correct: **serializable sub-goals heuristic**।

10. **Serializable sub-goals slide typo**  
    Slide says final sub-goal `on(B, C)`, কিন্তু goal state/transcript indicates `on(C, B)`। Use `on(C, B)`।

11. **HTN transcript: “hierarchical textbook networks”**  
    Correct: **Hierarchical Task Networks**।

12. **HTN transcript: “Paphos in Greece and Cyprus”**  
    Slides/rest of transcript identify destination as **Paphos, Cyprus**।

13. **HTN transcript: “breakfast search”**  
    Again: **breadth-first search**।

14. **Online planning transcript: “replanted”**  
    Meaning: **replanned**।

15. **Online planning transcript: “transporters five” / “to us for”**  
    These refer to state sequence:
    ```text
    S1 → S2 → S3 → S4 → S5
    ```
    and replanning from `S6` to `S2`, or possibly to `S3`, `S4`, or `S5`।

16. **Online planning: “ongoing planning” vs “online planning”**  
    Transcript uses “ongoing planning” for planning while the system is executing. Slide title/topic: **online planning**।
