---
subject: COMP64602
chapter: 59
title: "Week 9 — Question Bank"
language: en
---

# COMP64602 Week 9 — Worked Question Bank

**Topic:** Multi-Agent Planning, Partial Order Causal-Link Planning, Parallel POCL, Multi-Agent Parallel POCL  
**Source used:** uploaded Week 9 `.mht` lecture sheet.  
**How to use:** cover each **Worked solution** block, attempt the question, then compare your step headers and calculations.

---

## 0. Computational task types identified from the sheet

The sheet contains these worked / procedural task types:

1. **Translate plan facts into POCL notation**: identify plan steps, temporal orderings, causal links, init step, and goal step.
2. **Build the initial POCL skeleton** from an initial state and a conjunctive goal state.
3. **Find open preconditions**: check which preconditions of a step are not yet supported by a causal link.
4. **Repair open preconditions** either from an existing step, from `s_init`, or by instantiating a new action.
5. **Detect causal-link conflicts**: find a threatening step that could occur between a provider and consumer and negate the protected condition.
6. **Repair causal-link conflicts** by adding temporal orderings that place the threatening step outside the protected interval.
7. **Infer preconditions/effects of simplified Blocks World `move` actions** used in the examples.
8. **Construct a parallel POCL tuple** by adding concurrency `=` and non-concurrency `#` relations.
9. **Detect and repair parallel step conflicts** from inconsistent postconditions when steps are unordered and not marked non-concurrent.
10. **Merge local agent POCL plans** into a multi-agent parallel POCL plan with assignments.
11. **Adjust causal links** to alternative providers using the condition `c \in post(s_k)` and the temporal validity check `s_j \not\prec_T s_k`.
12. **Detect redundant steps** after causal-link adjustment.
13. **Compute total step cost** under unit step costs.
14. **Linearise a partial-order / parallel plan** into an executable order or parallel schedule.
15. **Handle edge cases**: invalid causal-link adjustment, false redundancy, inconsistent concurrency/non-concurrency, slide-level state inconsistency, and the difference between plan modification and later linearisation.

Recognition-only material that is not really a computational worked-example task: broad comparisons between centralised/decentralised planning, POMDPs vs fixed plans, and the exact non-examinable coordination algorithm.

---

## Notation used throughout

A POCL plan is written:


$$

\langle S, \prec_T, \prec_C \rangle

$$


where:

- `S` is the set of plan steps.
- `\prec_T` is the temporal-ordering relation.
- `\prec_C` is the causal-link relation.

A temporal ordering is written:


$$

\langle s_i, s_j \rangle \in \prec_T

$$


meaning `s_i` must occur before `s_j`.

A causal link is written:


$$

\langle s_i, s_j, c \rangle \in \prec_C

$$


meaning step `s_i` establishes condition `c` for step `s_j`.

A parallel POCL plan is written:


$$

\langle S, \prec_T, \prec_C, \#, = \rangle

$$


where `#` means two steps must not be concurrent, and `=` means two steps must be concurrent.

A multi-agent parallel POCL plan is written:


$$

M = \langle A, S, \prec_T, \prec_C, \#, =, X \rangle

$$


where `A` is the set of agents and `X` assigns steps to agents.

---

# Section A — Mechanical / single-step drills

These questions drill the smallest operations before combining them.

---

## Q1. Write a temporal ordering as a tuple

A partial-order plan contains two steps:

- `s_1 = pickup(x)`
- `s_2 = stack(x,y)`

The plan requires `pickup(x)` before `stack(x,y)`.

Write this as an element of `\prec_T`.

### Worked solution

**Step 1 — Identify the earlier step.**  
The earlier step is:


$$

s_1 = pickup(x)

$$


**Step 2 — Identify the later step.**  
The later step is:


$$

s_2 = stack(x,y)

$$


**Step 3 — Write the temporal tuple.**


$$

\langle s_1, s_2 \rangle \in \prec_T

$$


**Answer:**


$$

s_1 \prec_T s_2

$$


---

## Q2. Write a causal link as a tuple

Step `s_i` establishes `clear(y)`. Step `s_j` needs `clear(y)` as a precondition.

Write the causal link.

### Worked solution

**Step 1 — Identify the provider.**  
The provider is the step that establishes the condition:


$$

s_i

$$


**Step 2 — Identify the consumer.**  
The consumer is the step that needs the condition:


$$

s_j

$$


**Step 3 — Identify the protected condition.**


$$

clear(y)

$$


**Step 4 — Write the causal-link tuple.**


$$

\langle s_i, s_j, clear(y) \rangle \in \prec_C

$$


**Answer:** `s_i` provides `clear(y)` for `s_j`.

---

## Q3. Build the initial POCL skeleton for the lecture's running Blocks World example

The initial state is:


$$

\{ontable(A), ontable(B), ontable(D), on(C,A), clear(B), clear(C), clear(D), handempty\}

$$


The goal state is:


$$

\{ontable(C), ontable(D), on(B,C), on(A,D), clear(A), clear(B), handempty\}

$$


Build the initial POCL skeleton before repairing any open preconditions.

### Worked solution

**Step 1 — Create the init step.**  
The init step represents the initial state as its postconditions:


$$

post(s_{init}) = \{ontable(A), ontable(B), ontable(D), on(C,A), clear(B), clear(C), clear(D), handempty\}

$$


**Step 2 — Create the goal step.**  
The goal step represents the goal state as its preconditions:


$$

pre(s_{goal}) = \{ontable(C), ontable(D), on(B,C), on(A,D), clear(A), clear(B), handempty\}

$$


**Step 3 — Define the step set.**  
At the skeleton stage, there are only the two special steps:


$$

S = \{s_{init}, s_{goal}\}

$$


**Step 4 — Define temporal and causal relations.**  
No ordinary action has been added yet. The skeleton may be read as having the usual implicit init-before-goal ordering, but the worked lecture fragment starts with no repaired causal links:


$$

\prec_C = \varnothing

$$


**Step 5 — List open preconditions.**  
All goal preconditions are initially open:


$$

ontable(C), ontable(D), on(B,C), on(A,D), clear(A), clear(B), handempty

$$


**Answer:** the initial skeleton is `s_init`, `s_goal`, no causal links yet, and every goal condition is open.

---

## Q4. Repair an open precondition using `s_init`

In the lecture's running example, the goal step needs:


$$

ontable(D)

$$


The initial state already contains:


$$

ontable(D)

$$


Repair this open precondition.

### Worked solution

**Step 1 — Identify the consumer step.**  
The consumer is the step needing the condition:


$$

s_{goal}

$$


**Step 2 — Identify the condition.**


$$

c = ontable(D)

$$


**Step 3 — Find a provider.**  
Because `ontable(D)` is already in the initial state, the provider is:


$$

s_{init}

$$


**Step 4 — Add the causal link.**


$$

\langle s_{init}, s_{goal}, ontable(D) \rangle

$$


**Answer:** add `\langle s_init, s_goal, ontable(D) \rangle` to `\prec_C`.

---

## Q5. Repair an open precondition by adding a new action

In the running example, the goal step needs:


$$

on(B,C)

$$


The plan introduces:


$$

s_1 = stack(B,C)

$$


with:


$$

pre(s_1) = \{clear(C), holding(B)\}

$$


and:


$$

post(s_1) = \{on(B,C), not\ clear(C), not\ holding(B), handempty\}

$$


Repair the goal precondition and list the new open preconditions created by adding `s_1`.

### Worked solution

**Step 1 — Identify the open goal condition.**


$$

on(B,C)

$$


**Step 2 — Check whether the new action establishes it.**  
The postconditions of `s_1` include:


$$

on(B,C)

$$


So `s_1` can support the goal condition.

**Step 3 — Add the causal link.**


$$

\langle s_1, s_{goal}, on(B,C) \rangle

$$


**Step 4 — Add the new step to the step set.**


$$

S := S \cup \{s_1\}

$$


**Step 5 — List new open preconditions introduced by `s_1`.**  
Since `s_1` has preconditions:


$$

clear(C), holding(B)

$$


these now become open unless they already have causal support.

**Answer:** add `s_1 = stack(B,C)`, add causal link `\langle s_1, s_goal, on(B,C) \rangle`, and now repair the new open preconditions `clear(C)` and `holding(B)`.

---

## Q6. Repair an open precondition using a two-step chain

In the running example, the goal needs:


$$

ontable(C)

$$


The plan introduces:


$$

s_2 = unstack(C,A)

$$


and:


$$

s_3 = putdown(C)

$$


with:


$$

pre(s_2)=\{clear(C), on(C,A)\}

$$



$$

post(s_2)=\{not\ clear(C), not\ on(C,A), holding(C)\}

$$



$$

pre(s_3)=\{holding(C)\}

$$



$$

post(s_3)=\{ontable(C), clear(C), not\ holding(C), handempty\}

$$


Add the causal links needed for this fragment.

### Worked solution

**Step 1 — Identify the final condition to support.**


$$

ontable(C)

$$


The step that establishes it is:


$$

s_3 = putdown(C)

$$


So add:


$$

\langle s_3, s_{goal}, ontable(C) \rangle

$$


**Step 2 — Support `s_3`'s precondition.**  
`s_3` needs:


$$

holding(C)

$$


`s_2` establishes:


$$

holding(C)

$$


So add:


$$

\langle s_2, s_3, holding(C) \rangle

$$


**Step 3 — Support `s_2`'s preconditions from the initial state.**  
`s_2` needs:


$$

clear(C), on(C,A)

$$


Both are in the initial state, so add:


$$

\langle s_{init}, s_2, clear(C) \rangle

$$


and:


$$

\langle s_{init}, s_2, on(C,A) \rangle

$$


**Answer:** the causal-link chain is:


$$

\{\langle s_{init},s_2,clear(C)\rangle,
\langle s_{init},s_2,on(C,A)\rangle,
\langle s_2,s_3,holding(C)\rangle,
\langle s_3,s_{goal},ontable(C)\rangle\}

$$


---

## Q7. Detect and repair the lecture's causal-link conflict

The plan contains the causal link:


$$

\langle s_{init}, s_2, clear(C) \rangle

$$


where:


$$

s_2 = unstack(C,A)

$$


Another step is:


$$

s_1 = stack(B,C)

$$


with postcondition:


$$

not\ clear(C)

$$


Detect the conflict and repair it.

### Worked solution

**Step 1 — Identify the protected causal link.**


$$

\langle s_{init}, s_2, clear(C) \rangle

$$


This means `clear(C)` must remain true from `s_init` until `s_2` uses it.

**Step 2 — Identify the threatening step.**  
A threatening step is one that can negate the protected condition. Here:


$$

post(s_1) \ni not\ clear(C)

$$


So `s_1` threatens the link.

**Step 3 — Check whether the threat can occur between provider and consumer.**  
The danger is:


$$

s_{init} \prec_T s_1 \prec_T s_2

$$


If this happens, `clear(C)` is destroyed before `s_2` needs it.

**Step 4 — Choose a repair.**  
A conflict is repaired by putting the threatening step outside the protected interval.

Option 1 would be:


$$

s_1 \prec_T s_{init}

$$


but this is impossible because nothing happens before `s_init`.

So use option 2:


$$

s_2 \prec_T s_1

$$


**Answer:** `s_1` threatens the causal link by deleting `clear(C)`. Repair it by adding:


$$

s_2 \prec_T s_1

$$


---

## Q8. Detect a parallel step conflict

A parallel POCL plan contains two steps:


$$

post(s_1)=\{door\_open\}

$$



$$

post(s_2)=\{not\ door\_open\}

$$


The plan has no ordering between them:


$$

s_1 \not\prec_T s_2, \quad s_2 \not\prec_T s_1

$$


and they are not marked non-concurrent:


$$

\langle s_1,s_2\rangle \notin \#

$$


Is there a parallel step conflict?

### Worked solution

**Step 1 — Compare postconditions.**  
`s_1` establishes:


$$

door\_open

$$


`s_2` establishes:


$$

not\ door\_open

$$


These are inconsistent.

**Step 2 — Check temporal ordering.**  
The question states:


$$

s_1 \not\prec_T s_2

$$


and:


$$

s_2 \not\prec_T s_1

$$


So they are unordered.

**Step 3 — Check non-concurrency.**  
The question states:


$$

\langle s_1,s_2\rangle \notin \#

$$


So the plan has not forbidden them from occurring together.

**Step 4 — Apply the definition.**  
Inconsistent postconditions + unordered + not marked non-concurrent means a parallel step conflict exists.

**Answer:** yes. Repair by adding `\langle s_1,s_2\rangle \in \#`, or by adding an ordering so they cannot occur simultaneously.

---

## Q9. Infer the effect of a simplified `move` action

In a simplified Blocks World example, the current state includes:


$$

on(X,Y), clear(X), clear(Z)

$$


A merged action is:


$$

move(X,Z)

$$


Infer the main preconditions and effects relevant to causal-link reasoning.

### Worked solution

**Step 1 — Interpret the action.**  
`move(X,Z)` means move block `X` from its current support onto block `Z`.

**Step 2 — Identify required clear conditions.**  
To move `X`, `X` must be clear. To place `X` onto `Z`, `Z` must be clear:


$$

clear(X), clear(Z)

$$


**Step 3 — Identify the old support.**  
The state says:


$$

on(X,Y)

$$


So the old support is `Y`.

**Step 4 — Infer positive effects.**  
After moving `X` onto `Z`:


$$

on(X,Z)

$$


and the old support `Y` becomes clear:


$$

clear(Y)

$$


**Step 5 — Infer negative effects.**  
`X` is no longer on `Y`:


$$

not\ on(X,Y)

$$


and `Z` is no longer clear because `X` is on it:


$$

not\ clear(Z)

$$


**Answer:** the action needs `clear(X)` and `clear(Z)`; it establishes `on(X,Z)` and `clear(Y)`; it deletes `on(X,Y)` and `clear(Z)`.

---

# Section B — Multi-condition checks

These questions combine several checks at once.

---

## Q10. Repair several open preconditions and list what remains open

A POCL fragment has:


$$

post(s_{init})=\{ontable(P), on(Q,P), clear(Q), handempty\}

$$


The goal needs:


$$

ontable(Q), clear(P)

$$


You add:


$$

s_1 = unstack(Q,P)

$$


with:


$$

pre(s_1)=\{clear(Q), on(Q,P)\}

$$



$$

post(s_1)=\{holding(Q), clear(P), not\ on(Q,P)\}

$$


and:


$$

s_2 = putdown(Q)

$$


with:


$$

pre(s_2)=\{holding(Q)\}

$$



$$

post(s_2)=\{ontable(Q), clear(Q), handempty\}

$$


Repair the two goal conditions and list any new open preconditions.

### Worked solution

**Step 1 — Repair `clear(P)`.**  
The goal needs:


$$

clear(P)

$$


`s_1` establishes `clear(P)`, so add:


$$

\langle s_1, s_{goal}, clear(P) \rangle

$$


**Step 2 — Repair `ontable(Q)`.**  
The goal needs:


$$

ontable(Q)

$$


`s_2` establishes `ontable(Q)`, so add:


$$

\langle s_2, s_{goal}, ontable(Q) \rangle

$$


**Step 3 — Support `s_2`.**  
`s_2` needs:


$$

holding(Q)

$$


`s_1` establishes `holding(Q)`, so add:


$$

\langle s_1, s_2, holding(Q) \rangle

$$


**Step 4 — Support `s_1`.**  
`s_1` needs:


$$

clear(Q), on(Q,P)

$$


Both are in `post(s_init)`, so add:


$$

\langle s_{init}, s_1, clear(Q) \rangle

$$


and:


$$

\langle s_{init}, s_1, on(Q,P) \rangle

$$


**Step 5 — List remaining open preconditions.**  
Every precondition of `s_1`, `s_2`, and `s_goal` now has a causal link.

**Answer:** no open preconditions remain in this fragment. The causal links are:


$$

\{\langle s_1,s_{goal},clear(P)\rangle,
\langle s_2,s_{goal},ontable(Q)\rangle,
\langle s_1,s_2,holding(Q)\rangle,
\langle s_{init},s_1,clear(Q)\rangle,
\langle s_{init},s_1,on(Q,P)\rangle\}

$$


---

## Q11. Check two possible causal-link threats

A plan contains the causal link:


$$

\langle s_a, s_d, clear(R) \rangle

$$


Two other steps exist:


$$

post(s_b)=\{not\ clear(R)\}

$$



$$

post(s_c)=\{clear(R)\}

$$


There is no temporal ordering involving `s_b` or `s_c` yet.

Which steps threaten the causal link, and how can the threat be repaired?

### Worked solution

**Step 1 — Identify the protected condition.**


$$

clear(R)

$$


**Step 2 — Check `s_b`.**  
`s_b` has:


$$

not\ clear(R)

$$


So `s_b` can negate the protected condition. Since it is unordered, it could occur between `s_a` and `s_d`. Therefore `s_b` is a threat.

**Step 3 — Check `s_c`.**  
`s_c` has:


$$

clear(R)

$$


This reinforces the protected condition; it does not negate it. So `s_c` is not a threat.

**Step 4 — Repair the threat.**  
Place `s_b` outside the causal interval.

Demote it before the provider:


$$

s_b \prec_T s_a

$$


or promote it after the consumer:


$$

s_d \prec_T s_b

$$


**Answer:** only `s_b` threatens the link. Repair with either `s_b \prec_T s_a` or `s_d \prec_T s_b`.

---

## Q12. Test whether a causal-link adjustment is valid

A plan has the causal link:


$$

\langle s_1, s_4, c \rangle

$$


A candidate replacement provider is `s_2`.

You know:


$$

c \in post(s_2)

$$


but the temporal ordering contains:


$$

s_4 \prec_T s_2

$$


Can the link be adjusted to:


$$

\langle s_2, s_4, c \rangle

$$
?

### Worked solution

**Step 1 — Check whether the new provider establishes the condition.**  
The question states:


$$

c \in post(s_2)

$$


So the effect condition passes.

**Step 2 — Check the temporal validity condition.**  
For adjustment, the consumer must not already be forced before the new provider:


$$

s_j \not\prec_T s_k

$$


Here:


$$

s_j=s_4, \quad s_k=s_2

$$


But the plan contains:


$$

s_4 \prec_T s_2

$$


**Step 3 — Interpret the ordering.**  
The consumer `s_4` must happen before the candidate provider `s_2`. Therefore `s_2` cannot provide `c` in time for `s_4`.

**Answer:** no. Even though `s_2` establishes `c`, the adjustment is invalid because `s_4 \prec_T s_2`.

---

## Q13. Decide whether a step is redundant after partial adjustment

A merged multi-agent plan contains a step:


$$

s_x

$$


Initially it has two outgoing causal links:


$$

\langle s_x, s_g, p \rangle

$$


and:


$$

\langle s_x, s_h, q \rangle

$$


You adjust the first link to a replacement provider:


$$

\langle s_y, s_g, p \rangle

$$


No replacement has been found for `q`.

Is `s_x` redundant?

### Worked solution

**Step 1 — Recall the redundancy test.**  
A step is redundant only if everything it contributes through causal links can be supplied by other steps.

**Step 2 — List what `s_x` originally provided.**


$$

p \text{ for } s_g

$$


and:


$$

q \text{ for } s_h

$$


**Step 3 — Check adjusted links.**  
The link for `p` has been replaced by `s_y`.

**Step 4 — Check remaining contributions.**  
The link:


$$

\langle s_x, s_h, q \rangle

$$


still depends on `s_x`.

**Answer:** no. `s_x` is not redundant yet, because it still provides `q` to `s_h`.

---

## Q14. Compute total step cost before and after redundancy removal

A multi-agent plan has six ordinary action steps plus two init steps and two goal steps.

The lecture's total step cost uses unit action-step cost. One ordinary action is found redundant and removed.

Compute the ordinary action-step cost before and after removal.

### Worked solution

**Step 1 — Identify what cost convention is being used.**  
The lecture examples use unit step costs, and the relevant simplification cost is the number of ordinary action steps.

**Step 2 — Count ordinary actions before removal.**


$$

6

$$


**Step 3 — Remove one redundant action.**


$$

6 - 1 = 5

$$


**Step 4 — State the before/after cost.**

Before:


$$

6

$$


After:


$$

5

$$


**Answer:** the action-step cost falls from `6` to `5`.

---

## Q15. Find potential parallel groups during linearisation

A partial-order plan has ordinary steps:


$$

a,b,c,d

$$


with temporal constraints:


$$

a \prec_T c, \quad b \prec_T d

$$


There is no ordering between `a` and `b`, and no ordering between `c` and `d`. Also assume no parallel step conflicts.

Give one possible parallel linearisation.

### Worked solution

**Step 1 — Find steps with no unsatisfied predecessors.**  
Initially, `a` has no predecessor and `b` has no predecessor.

So the first parallel group can be:


$$

\{a,b\}

$$


**Step 2 — Remove completed first-group steps.**  
After `a` is done, `c` is allowed.  
After `b` is done, `d` is allowed.

**Step 3 — Find the next parallel group.**  
Now `c` and `d` have no remaining unsatisfied predecessors and are not conflicting.

So the second parallel group can be:


$$

\{c,d\}

$$


**Answer:** one possible parallel linearisation is:


$$

(a \parallel b) ; (c \parallel d)

$$


---

## Q16. Check whether a multi-agent assignment relation is well-formed

A multi-agent plan has agents:


$$

A = \{agent_1, agent_2\}

$$


and ordinary steps:


$$

S_{act}=\{s_1,s_2,s_3\}

$$


The assignment relation is:


$$

X=\{\langle s_1,agent_1\rangle, \langle s_2,agent_2\rangle\}

$$


Is every ordinary action assigned? If not, repair `X` using the assumption that `s_3` belongs to `agent_2`.

### Worked solution

**Step 1 — List ordinary action steps.**


$$

\{s_1,s_2,s_3\}

$$


**Step 2 — List assigned steps from `X`.**


$$

s_1 \mapsto agent_1

$$



$$

s_2 \mapsto agent_2

$$


**Step 3 — Find missing assignments.**  
`s_3` has no assignment.

**Step 4 — Add the missing assignment.**  
The question says `s_3` belongs to `agent_2`, so add:


$$

\langle s_3, agent_2 \rangle

$$


**Answer:** the repaired assignment relation is:


$$

X=\{\langle s_1,agent_1\rangle, \langle s_2,agent_2\rangle, \langle s_3,agent_2\rangle\}

$$


---

# Section C — Building plans from scratch

These questions require constructing larger fragments rather than checking one relation.

---

## Q17. Build a POCL fragment from a small Blocks World goal

Initial state:


$$

\{ontable(A), ontable(B), clear(A), clear(B), handempty\}

$$


Goal:


$$

on(A,B)

$$


Available action:


$$

s_1 = stack(A,B)

$$


with:


$$

pre(s_1)=\{holding(A), clear(B)\}

$$



$$

post(s_1)=\{on(A,B), not\ clear(B), not\ holding(A), handempty\}

$$


Assume there is another action:


$$

s_0 = pickup(A)

$$


with:


$$

pre(s_0)=\{ontable(A), clear(A), handempty\}

$$



$$

post(s_0)=\{holding(A), not\ ontable(A), not\ clear(A), not\ handempty\}

$$


Build the POCL fragment that achieves the goal.

### Worked solution

**Step 1 — Create init and goal steps.**


$$

post(s_{init})=\{ontable(A), ontable(B), clear(A), clear(B), handempty\}

$$



$$

pre(s_{goal})=\{on(A,B)\}

$$


**Step 2 — Support the goal condition.**  
The goal needs:


$$

on(A,B)

$$


`s_1 = stack(A,B)` establishes it, so add:


$$

\langle s_1, s_{goal}, on(A,B) \rangle

$$


**Step 3 — Support `s_1`'s precondition `holding(A)`.**  
`s_1` needs `holding(A)`. `s_0 = pickup(A)` establishes it, so add:


$$

\langle s_0, s_1, holding(A) \rangle

$$


**Step 4 — Support `s_1`'s precondition `clear(B)`.**  
`clear(B)` is initially true, so add:


$$

\langle s_{init}, s_1, clear(B) \rangle

$$


**Step 5 — Support `s_0`'s preconditions.**  
`s_0` needs:


$$

ontable(A), clear(A), handempty

$$


All are initially true, so add:


$$

\langle s_{init}, s_0, ontable(A) \rangle

$$



$$

\langle s_{init}, s_0, clear(A) \rangle

$$



$$

\langle s_{init}, s_0, handempty \rangle

$$


**Step 6 — Add necessary temporal orderings.**  
The causal links imply the useful order:


$$

s_{init} \prec_T s_0 \prec_T s_1 \prec_T s_{goal}

$$


**Answer:** one valid POCL fragment has:


$$

S=\{s_{init},s_0,s_1,s_{goal}\}

$$


and causal links:


$$

\{\langle s_1,s_{goal},on(A,B)\rangle,
\langle s_0,s_1,holding(A)\rangle,
\langle s_{init},s_1,clear(B)\rangle,
\langle s_{init},s_0,ontable(A)\rangle,
\langle s_{init},s_0,clear(A)\rangle,
\langle s_{init},s_0,handempty\rangle\}

$$


---

## Q18. Build a parallel POCL tuple with resource restrictions

A POCL plan has:


$$

S=\{s_1,s_2,s_3\}

$$


and existing POCL relations `\prec_T` and `\prec_C`.

The domain says:

- `s_1` and `s_2` must happen at the same time.
- `s_2` and `s_3` use the same tool and therefore cannot happen at the same time.

Write the corresponding parallel POCL tuple and the `=` / `#` relations.

### Worked solution

**Step 1 — Start from the ordinary POCL plan.**  
The embedded POCL plan is:


$$

\langle S, \prec_T, \prec_C \rangle

$$


**Step 2 — Add the concurrency relation.**  
`s_1` and `s_2` must be concurrent, so add:


$$

\langle s_1,s_2\rangle \in =

$$


Because the relation is symmetric, this also represents `s_2` concurrent with `s_1`.

**Step 3 — Add the non-concurrency relation.**  
`s_2` and `s_3` cannot be concurrent, so add:


$$

\langle s_2,s_3\rangle \in \#

$$


**Step 4 — Write the parallel POCL plan.**


$$

\langle S, \prec_T, \prec_C, \#, = \rangle

$$


where:


$$

=\;=\{\langle s_1,s_2\rangle\}

$$


and:


$$

\#=\{\langle s_2,s_3\rangle\}

$$


**Answer:** the plan is the embedded POCL plan plus `s_1 = s_2` and `s_2 # s_3`.

---

## Q19. Merge the lecture's Example 1 local plans into a multi-agent plan

In the lecture's first multi-agent example, Agent A has:


$$

s^A_1=move(c,table), \quad s^A_2=move(a,c)

$$


with temporal ordering:


$$

s^A_1 \prec_T s^A_2

$$


Agent B has:


$$

s^B_1=move(a,table), \quad s^B_2=move(c,table), \quad s^B_3=move(b,d)

$$


Build the combined multi-agent step set and assignment relation before redundancy removal.

### Worked solution

**Step 1 — List Agent A's steps.**


$$

s^A_1, s^A_2

$$


**Step 2 — List Agent B's steps.**


$$

s^B_1, s^B_2, s^B_3

$$


**Step 3 — Combine the action steps.**


$$

S_{act}=\{s^A_1,s^A_2,s^B_1,s^B_2,s^B_3\}

$$


If including init and goal steps, the full set is:


$$

S=\{s^A_{init},s^A_1,s^A_2,s^A_{goal},s^B_{init},s^B_1,s^B_2,s^B_3,s^B_{goal}\}

$$


**Step 4 — Combine temporal orderings.**  
The shown temporal ordering is:


$$

\prec_T = \{(s^A_1,s^A_2)\}

$$


plus any causal-order constraints implied by causal links.

**Step 5 — Create the assignment relation.**  
Each ordinary step is assigned to the agent that proposed it:


$$

X=\{\langle s^A_1,A\rangle,
\langle s^A_2,A\rangle,
\langle s^B_1,B\rangle,
\langle s^B_2,B\rangle,
\langle s^B_3,B\rangle\}

$$


**Answer:** before simplification, the merged plan has five ordinary action steps and the assignment relation above.

---

## Q20. Perform the lecture's Example 1 causal-link adjustments

In Example 1, Agent B has:


$$

s^B_2 = move(c,table)

$$


which supports both:


$$

clear(b) \text{ for } s^B_3=move(b,d)

$$


and:


$$

ontable(c) \text{ for Agent B's goal}

$$


Agent A also has:


$$

s^A_1=move(c,table)

$$


which can establish both `clear(b)` and `ontable(c)`.

Adjust causal links and decide whether `s^B_2` is redundant.

### Worked solution

**Step 1 — List what `s^B_2` provides.**  
It provides:


$$

clear(b)

$$


for:


$$

s^B_3=move(b,d)

$$


and:


$$

ontable(c)

$$


for Agent B's goal.

**Step 2 — Find an alternative provider for `clear(b)`.**  
Agent A's step:


$$

s^A_1=move(c,table)

$$


also moves `c` away from `b`, so it establishes:


$$

clear(b)

$$


Adjust the first causal link from:


$$

\langle s^B_2, s^B_3, clear(b) \rangle

$$


to:


$$

\langle s^A_1, s^B_3, clear(b) \rangle

$$


**Step 3 — Check whether `s^B_2` is redundant yet.**  
Not yet, because it still provides:


$$

ontable(c)

$$


for Agent B's goal.

**Step 4 — Find an alternative provider for `ontable(c)`.**  
Agent A's same step:


$$

s^A_1=move(c,table)

$$


also establishes:


$$

ontable(c)

$$


Adjust the second causal link from:


$$

\langle s^B_2, s^B_{goal}, ontable(c) \rangle

$$


to:


$$

\langle s^A_1, s^B_{goal}, ontable(c) \rangle

$$


**Step 5 — Apply the redundancy test.**  
After both adjustments, `s^B_2` no longer provides any necessary causal link.

**Answer:** `s^B_2=move(c,table)` is redundant and can be removed.

---

## Q21. Perform the lecture's Example 2 adjustments and interpret the result

In Example 2, Agent A originally uses:


$$

move(a,c)

$$


to achieve:


$$

clear(b), \quad not\ clear(c)

$$


Agent B uses:


$$

move(a,table)

$$


and:


$$

move(d,c)

$$


where `move(a,table)` establishes `clear(b)`, and `move(d,c)` establishes `not clear(c)`.

Adjust the causal links, remove redundancy, and state the post-planning reassignment idea.

### Worked solution

**Step 1 — List Agent A's original contributions.**  
Agent A's step:


$$

move(a,c)

$$


provides:


$$

clear(b)

$$


and:


$$

not\ clear(c)

$$


**Step 2 — Adjust the `not clear(c)` link.**  
Agent B's:


$$

move(d,c)

$$


puts `d` on `c`, so `c` is no longer clear. Therefore it establishes:


$$

not\ clear(c)

$$


Adjust the causal link for `not clear(c)` away from Agent A's `move(a,c)` and toward Agent B's `move(d,c)`.

**Step 3 — Check redundancy after the first adjustment.**  
Agent A's `move(a,c)` is not yet redundant, because it still provides:


$$

clear(b)

$$


**Step 4 — Adjust the `clear(b)` link.**  
Agent B's:


$$

move(a,table)

$$


moves `a` off `b`, so it establishes:


$$

clear(b)

$$


Adjust the causal link for `clear(b)` away from Agent A's `move(a,c)` and toward Agent B's `move(a,table)`.

**Step 5 — Apply redundancy test.**  
Agent A's `move(a,c)` now has no remaining necessary causal links.

So remove:


$$

move(a,c)

$$


**Step 6 — State the result.**  
The remaining useful actions are:


$$

move(a,table), \quad move(d,c)

$$


These achieve Agent A's goals:


$$

clear(b), \quad not\ clear(c)

$$


and Agent B's goals:


$$

ontable(a), \quad on(d,c)

$$


**Step 7 — State the post-planning reassignment idea.**  
After planning, one might reassign `move(a,table)` to Agent A and keep `move(d,c)` with Agent B, allowing:


$$

move(a,table) \parallel move(d,c)

$$


But this reassignment is a later efficiency improvement, not the core causal-link adjustment mechanism.

**Answer:** Agent A's original action becomes redundant; Agent B's two actions can achieve both agents' goals, and later reassignment may allow parallel execution.

---

## Q22. Linearise the simplified Example 1 plan after redundancy removal

After redundancy removal in Example 1, the ordinary actions are:


$$

move(c,table), \quad move(a,c), \quad move(a,table), \quad move(b,d)

$$


The relevant dependency is:


$$

move(c,table) \prec_T move(a,c)

$$


and the lecture marks two potential parallel groups:


$$

move(c,table) \parallel move(a,table)

$$


then:


$$

move(a,c) \parallel move(b,d)

$$


Write the linearised parallel execution.

### Worked solution

**Step 1 — Identify first actions with no unsatisfied predecessors.**  
`move(c,table)` can happen first.  
`move(a,table)` is not ordered after it in the simplified plan.

So they can be grouped:


$$

move(c,table) \parallel move(a,table)

$$


**Step 2 — Check what becomes enabled.**  
After `move(c,table)`, the action:


$$

move(a,c)

$$


is enabled.

After `move(a,table)`, moving `b` onto `d` becomes possible because `d` is clear.

So:


$$

move(b,d)

$$


is enabled.

**Step 3 — Form the second parallel group.**


$$

move(a,c) \parallel move(b,d)

$$


**Answer:** one possible parallel linearisation is:


$$

(move(c,table) \parallel move(a,table));\ (move(a,c) \parallel move(b,d))

$$


---

# Section D — Hard edge cases where methods disagree or break down

These are the highest-value exam-style traps.

---

## Q23. Invalid causal-link adjustment because the provider is too late

A plan has:


$$

\langle s_old, s_need, p \rangle

$$


A candidate new provider is:


$$

s_new

$$


with:


$$

p \in post(s_new)

$$


But the temporal ordering already contains:


$$

s_need \prec_T s_new

$$


A student says: "The adjustment is valid because `s_new` establishes `p`."

Is the student correct?

### Worked solution

**Step 1 — Check the effect condition.**  
The candidate provider does establish `p`:


$$

p \in post(s_new)

$$


So the first requirement passes.

**Step 2 — Check the temporal condition.**  
For causal-link adjustment, the consumer must not be forced before the new provider:


$$

s_j \not\prec_T s_k

$$


Here:


$$

s_j=s_need, \quad s_k=s_new

$$


But the plan says:


$$

s_need \prec_T s_new

$$


**Step 3 — Explain the failure.**  
If `s_need` must happen before `s_new`, then `s_new` cannot provide `p` in time.

**Answer:** the student is wrong. Establishing the condition is not enough; the replacement provider must also be temporally usable.

---

## Q24. False redundancy: a step still supports one causal link

A step `s_r` originally supports three causal links:


$$

\langle s_r,s_1,a\rangle, \quad \langle s_r,s_2,b\rangle, \quad \langle s_r,s_3,c\rangle

$$


You adjust the first two links to other providers, but the third link remains unchanged.

Can `s_r` be removed?

### Worked solution

**Step 1 — Apply the redundancy rule.**  
A step is redundant only if every causal contribution it makes can be replaced.

**Step 2 — Count original contributions.**  
`s_r` contributes:


$$

a,b,c

$$


through three causal links.

**Step 3 — Count replaced contributions.**  
Only `a` and `b` have been replaced.

**Step 4 — Identify remaining dependency.**  
The plan still has:


$$

\langle s_r,s_3,c\rangle

$$


So `s_3` still depends on `s_r` for `c`.

**Answer:** no. Removing `s_r` would reopen precondition `c` for `s_3`.

---

## Q25. Adjustment succeeds, but a new causal-link conflict appears

A plan has an existing causal link:


$$

\langle s_a, s_b, q \rangle

$$


A different link is adjusted so that `s_k` is introduced as a new provider of `p` for `s_j`:


$$

\langle s_k, s_j, p \rangle

$$


However:


$$

not\ q \in post(s_k)

$$


and `s_k` is unordered relative to the interval from `s_a` to `s_b`.

What must be checked after the adjustment?

### Worked solution

**Step 1 — Notice that adjustment is not the final consistency check.**  
Changing a causal link can change the threat structure of the plan.

**Step 2 — Identify the protected existing link.**


$$

\langle s_a, s_b, q \rangle

$$


This requires `q` to remain true until `s_b` uses it.

**Step 3 — Check whether the adjusted-in step threatens it.**  
The new provider `s_k` has:


$$

not\ q \in post(s_k)

$$


So `s_k` can destroy `q`.

**Step 4 — Check whether `s_k` could occur inside the protected interval.**  
Since `s_k` is unordered relative to the interval, some linearisation may place it as:


$$

s_a \prec_T s_k \prec_T s_b

$$


That would break the causal link.

**Step 5 — Repair if needed.**  
Add an ordering that places `s_k` outside the interval:


$$

s_k \prec_T s_a

$$


or:


$$

s_b \prec_T s_k

$$


**Answer:** after a causal-link adjustment, re-check causal-link conflicts. The new provider may threaten other existing causal links.

---

## Q26. Inconsistent concurrency and non-concurrency

A parallel POCL plan contains both:


$$

\langle s_1,s_2\rangle \in =

$$


and:


$$

\langle s_1,s_2\rangle \in \#

$$


Can this plan be directly linearised?

### Worked solution

**Step 1 — Interpret the concurrency relation.**  
`=` means the two steps must occur at the same time.

So:


$$

s_1 \text{ concurrent with } s_2

$$


**Step 2 — Interpret the non-concurrency relation.**  
`#` means the two steps must not occur at the same time.

So:


$$

s_1 \text{ not concurrent with } s_2

$$


**Step 3 — Compare the requirements.**  
The same pair is required to be concurrent and forbidden from being concurrent.

**Step 4 — Conclude consistency status.**  
The constraints are inconsistent. No direct linearisation can satisfy both.

**Answer:** no. The plan must be repaired by removing or revising one of the constraints.

---

## Q27. Parallel conflict disappears if the steps are already ordered

Two steps have inconsistent postconditions:


$$

post(s_1)=\{light\_on\}

$$



$$

post(s_2)=\{not\ light\_on\}

$$


But the temporal relation contains:


$$

s_1 \prec_T s_2

$$


Is this a parallel step conflict?

### Worked solution

**Step 1 — Check postcondition inconsistency.**  
The effects are inconsistent:


$$

light\_on

$$


versus:


$$

not\ light\_on

$$


So the first condition for a parallel conflict is present.

**Step 2 — Check whether the steps are unordered.**  
A parallel step conflict requires the steps not to be temporally ordered.

But the plan states:


$$

s_1 \prec_T s_2

$$


**Step 3 — Interpret the ordering.**  
Since `s_1` must occur before `s_2`, the two steps cannot be forced to occur in parallel by linearisation.

**Answer:** no parallel step conflict exists under the lecture definition, because the steps are already ordered. There may still be a domain-level question about final state, but not a parallel-concurrency flaw.

---

## Q28. Reject an impossible init causal link from state consistency

In a Blocks World example, the diagram shows:


$$

A \text{ on } D

$$


A proposed causal link says:


$$

\langle s_{init}, s_3, clear(D) \rangle

$$


where `s_3` needs `clear(D)`.

Should this init causal link be accepted?

### Worked solution

**Step 1 — Read the state.**  
The diagram says:


$$

A \text{ on } D

$$


**Step 2 — Infer whether `D` is clear.**  
If `A` is on `D`, then `D` has a block on top of it.

Therefore:


$$

clear(D)

$$


is false initially.

**Step 3 — Check the proposed provider.**  
`s_init` can only provide conditions true in the initial state.

The proposed link claims:


$$

s_{init} \text{ provides } clear(D)

$$


but `clear(D)` is not initially true.

**Step 4 — Find the likely correct support.**  
A step that moves `A` away from `D`, such as:


$$

move(a,table)

$$


would establish:


$$

clear(D)

$$


**Answer:** do not accept the init causal link. The support should come from the action that clears `D`, not from `s_init`.

---

## Q29. Do not parallelise a step that has been removed as redundant

A merged plan initially contains:


$$

s^A_1=move(c,table)

$$


and:


$$

s^B_2=move(c,table)

$$


After causal-link adjustment, `s^B_2` is redundant and removed.

A proposed linearisation includes:


$$

s^B_2 \parallel move(a,table)

$$


Is this valid after simplification?

### Worked solution

**Step 1 — Check which steps remain in the simplified plan.**  
The question states that:


$$

s^B_2

$$


has been removed.

**Step 2 — Apply the linearisation rule.**  
Linearisation orders or groups the steps that are actually in the plan.

It cannot schedule a removed step.

**Step 3 — Identify the valid remaining provider.**  
The remaining `move(c,table)` step is:


$$

s^A_1=move(c,table)

$$


**Step 4 — Correct the proposed group.**  
A valid first parallel group may use:


$$

s^A_1 \parallel move(a,table)

$$


not the removed `s^B_2`.

**Answer:** no. After redundancy removal, only remaining steps can be linearised.

---

## Q30. Distinguish causal-link adjustment from reassignment

A plan contains the causal link:


$$

\langle s_1, s_g, p \rangle

$$


Two proposed changes are made:

1. Replace the link by `\langle s_2, s_g, p \rangle`, where `p \in post(s_2)` and `s_g \not\prec_T s_2`.
2. Change the executor of `s_2` from Agent B to Agent A so that two final actions can run in parallel.

Which change is a causal-link adjustment?

### Worked solution

**Step 1 — Recall what causal-link adjustment changes.**  
Causal-link adjustment changes which step provides a condition to a consumer step.

Its form is:


$$

\langle s_i,s_j,c\rangle \rightarrow \langle s_k,s_j,c\rangle

$$


**Step 2 — Check proposed change 1.**  
It changes:


$$

\langle s_1, s_g, p \rangle

$$


to:


$$

\langle s_2, s_g, p \rangle

$$


The consumer `s_g` and condition `p` stay the same, but the provider changes. It also passes the condition/effect and temporal checks.

So change 1 is a causal-link adjustment.

**Step 3 — Check proposed change 2.**  
Changing the executor of `s_2` changes the assignment relation `X`, not the causal-link relation `\prec_C`.

**Step 4 — Connect to the lecture examples.**  
The lecture's reassignment for parallel efficiency is a later post-planning idea, not the core causal-link adjustment mechanism.

**Answer:** change 1 is causal-link adjustment. Change 2 is reassignment / post-processing, not causal-link adjustment.

---

## Q31. Decide whether the non-examinable algorithm step is conceptually valid

The non-examinable algorithm says that when refining a causal link, one possible refinement is to leave the causal link unchanged.

A student says: "That cannot be a refinement, because a refinement must always modify the plan."

Using the lecture's conceptual description, evaluate the student's claim.

### Worked solution

**Step 1 — Recall what the algorithm is searching over.**  
The algorithm searches over possible refinements of causal links.

**Step 2 — Recall the lecture's important detail.**  
When generating refinements for a causal link, one option is that the causal link stays as it is.

**Step 3 — Interpret why this is useful.**  
Keeping the link unchanged represents the branch of the search where the current provider remains the best or necessary provider.

**Step 4 — State examinability status.**  
The exact algorithm is not examinable, but this conceptual point explains why unchanged links can still appear in the search tree.

**Answer:** the student's claim is wrong in the context of this algorithm. One refinement branch may keep the causal link unchanged.

---

## Q32. Full hard check: adjustment, redundancy, conflict, and cost

A merged plan has ordinary steps:


$$

s_1,s_2,s_3,s_4

$$


with causal links:


$$

\langle s_2,s_g,p\rangle, \quad \langle s_2,s_4,q\rangle

$$


Candidate replacement providers are:


$$

p \in post(s_1), \quad q \in post(s_3)

$$


Temporal facts:


$$

s_g \not\prec_T s_1

$$



$$

s_4 \not\prec_T s_3

$$


But also:


$$

not\ r \in post(s_3)

$$


and the plan has another causal link:


$$

\langle s_a,s_b,r\rangle

$$


with `s_3` unordered relative to the interval from `s_a` to `s_b`.

Can `s_2` be removed immediately after the two adjustments? If not, what must be checked first?

### Worked solution

**Step 1 — Check the first adjustment.**  
Original link:


$$

\langle s_2,s_g,p\rangle

$$


Candidate provider:


$$

s_1

$$


Effect check:


$$

p \in post(s_1)

$$


Temporal check:


$$

s_g \not\prec_T s_1

$$


So the first adjustment is valid:


$$

\langle s_1,s_g,p\rangle

$$


**Step 2 — Check the second adjustment.**  
Original link:


$$

\langle s_2,s_4,q\rangle

$$


Candidate provider:


$$

s_3

$$


Effect check:


$$

q \in post(s_3)

$$


Temporal check:


$$

s_4 \not\prec_T s_3

$$


So the second adjustment is valid:


$$

\langle s_3,s_4,q\rangle

$$


**Step 3 — Tentatively apply redundancy test to `s_2`.**  
Both outgoing causal links from `s_2` have been replaced. So `s_2` is a redundancy candidate.

**Step 4 — Check whether the adjustment introduced a new threat.**  
The new provider `s_3` has:


$$

not\ r \in post(s_3)

$$


There is another causal link:


$$

\langle s_a,s_b,r\rangle

$$


If `s_3` can occur between `s_a` and `s_b`, it threatens the protected condition `r`.

**Step 5 — Repair the new conflict before accepting the simplified plan.**  
Add either:


$$

s_3 \prec_T s_a

$$


or:


$$

s_b \prec_T s_3

$$


if such an ordering is consistent with the rest of the plan.

**Step 6 — Compute cost only after consistency.**  
Before removal, ordinary action-step cost is:


$$

4

$$


After removing `s_2`, it would be:


$$

3

$$


But that cost reduction is only acceptable if the resulting plan is consistent.

**Answer:** `s_2` is a redundancy candidate, but do not accept removal immediately. First repair or rule out the new causal-link conflict caused by `s_3` threatening `r`. If repaired consistently, the cost falls from `4` to `3`.

---

# Final checklist for solving Week 9 computational questions

When given a POCL / multi-agent POCL problem, use this order:

1. **Write the tuple type.** Is it POCL, parallel POCL, or multi-agent parallel POCL?
2. **List steps.** Include init and goal steps if the tuple asks for full `S`.
3. **List open preconditions.** Every required condition needs a causal provider.
4. **Repair open preconditions.** Add causal links from existing steps or instantiate new steps.
5. **Check causal-link conflicts.** Any unordered step that deletes a protected condition is a threat.
6. **Repair threats.** Put the threat before the provider or after the consumer.
7. **For parallel plans, check inconsistent postconditions.** If unordered and not in `#`, add `#` or order them.
8. **For multi-agent plans, add assignments.** `X` records which agent executes each ordinary step.
9. **Try causal-link adjustment.** Check both `c \in post(s_k)` and `s_j \not\prec_T s_k`.
10. **Remove redundancy only after all outgoing causal links have replacements.**
11. **Re-check conflicts after adjustment.** New providers can create new threats.
12. **Only then linearise.** Parallel groups are found during linearisation / post-processing, not during the core causal-link adjustment step.
