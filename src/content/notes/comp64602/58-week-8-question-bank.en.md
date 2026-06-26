---
subject: COMP64602
chapter: 58
title: "Week 8 — Question Bank"
language: en
---

# COMP64602 Week 8 Planning — Worked Question Bank

**Topic and scope.** This practice bank drills the computational task types covered in the Week 8 planning sheet: PDDL representation, action applicability, forward and backward search, planning heuristics, hierarchical task networks, higher-level action effects, contingent planning, and online replanning.

**How to use this file.** In each section, attempt the questions first. The worked solutions are placed after the questions so you can cover them and self-test.

---

## Task types identified from the lecture sheet

The sheet covers these examinable/procedural task types:

1. Reading a simple PDDL action schema: parameters, preconditions, positive effects, negative effects.
2. Grounding action variables with constants.
3. Checking whether an action is applicable in a state.
4. Applying action effects: add positive effects, delete negated effects.
5. Using the closed world assumption: absent facts are treated as false.
6. Reading and constructing simple PDDL domain and problem files.
7. Expanding forward search from an initial state.
8. Recognising loops and unhelpful branches in forward search.
9. Regressing backward from a goal state through action effects.
10. Using variables in backward search to avoid enumerating equivalent choices.
11. Computing the ignore-preconditions heuristic.
12. Applying serializable sub-goals and detecting when an action undoes a protected sub-goal.
13. Applying state abstraction and checking whether ignored facts are truly irrelevant.
14. Building an HTN: high-level action, refinements, primitive actions, implementation.
15. Deciding whether a high-level plan achieves a goal via at least one implementation.
16. Reasoning about possible effects of higher-level actions and mutual exclusion.
17. Writing contingent plans with if-then-else branches.
18. Deciding when online planning/replanning is needed.
19. Choosing minimal replanning repair targets after an unexpected state.

---

## Reference action schemas used in several questions

### Simple robot-patrol move action

```lisp
(:action move
 :parameters (?x ?y - waypoint)
 :precondition (and (at ?x))
 :effect (and
          (at ?y)
          (not (at ?x))))
```

### Blocks World actions

Use the lecture's Blocks World predicates:

```text
ontable(X)    X is on the table
on(X,Y)       X is on Y
clear(X)      nothing is on X
handempty     the hand is empty
holding(X)    the hand is holding X
```

Actions:

```text
pick-up(X)
Preconditions: clear(X), ontable(X), handempty
Effects: add holding(X); delete ontable(X), clear(X), handempty

put-down(X)
Preconditions: holding(X)
Effects: add clear(X), handempty, ontable(X); delete holding(X)

stack(X,Y)
Preconditions: holding(X), clear(Y)
Effects: add clear(X), handempty, on(X,Y); delete holding(X), clear(Y)

unstack(X,Y)
Preconditions: on(X,Y), clear(X), handempty
Effects: add holding(X), clear(Y); delete clear(X), handempty, on(X,Y)
```

---

# Section A — Mechanical / single-step drills

These questions drill one operation at a time: reading schemas, checking preconditions, applying effects, and identifying PDDL components.

## Questions

### A1. Ground a PDDL action schema

Given the action schema:

```lisp
(:action move
 :parameters (?x ?y - waypoint)
 :precondition (and (at ?x))
 :effect (and (at ?y) (not (at ?x))))
```

Ground the action with:

```text
?x = wp1
?y = wp2
```

Write the grounded action name, grounded precondition, and grounded effects.

---

### A2. Check applicability under the closed world assumption

Current state:

```text
S = { at(wp1), connected(wp1, wp2) }
```

Action:

```text
move(wp2, wp3)
```

Using the `move` schema above, is the action applicable? Explain using the closed world assumption.

---

### A3. Apply add and delete effects

Current state:

```text
S = { at(wp1), battery_ok }
```

Apply:

```text
move(wp1, wp2)
```

What is the successor state?

---

### A4. Identify domain-file vs problem-file information

Classify each item as belonging mainly in a PDDL **domain file** or a PDDL **problem file**.

```text
1. Types: waypoint
2. Objects: wp1 wp2 wp3
3. Predicate declaration: (at ?x)
4. Initial state: (at wp1)
5. Goal: (at wp3)
6. Action schema: move
```

---

### A5. Check one Blocks World action

Current state:

```text
S = { ontable(A), ontable(B), clear(A), clear(B), handempty }
```

Is `stack(A,B)` applicable? If not, name the missing precondition.

---

### A6. Apply one Blocks World action

Current state:

```text
S = { ontable(A), ontable(B), clear(A), clear(B), handempty }
```

Apply:

```text
pick-up(A)
```

Write the successor state.

---

### A7. Classify primitive action, higher-level action, and implementation

Consider this plan:

```text
travel(home, campus)
```

and this refinement:

```text
walk(home, bus_stop);
bus(bus_stop, campus)
```

Assume `walk` and `bus` are executable primitive actions. Classify:

1. `travel(home, campus)`
2. `walk(home, bus_stop)`
3. the whole refined plan

as higher-level action, primitive action, or implementation.

---

## Worked solutions

### Solution A1. Ground a PDDL action schema

**Step 1 — Identify the variables.**

The schema has two variables:

```text
?x, ?y
```

**Step 2 — Substitute constants for variables.**

Use:

```text
?x = wp1
?y = wp2
```

**Step 3 — Ground the action name.**

```text
move(wp1, wp2)
```

**Step 4 — Ground the precondition.**

Original precondition:

```text
at(?x)
```

After substitution:

```text
at(wp1)
```

**Step 5 — Ground the effects.**

Original effects:

```text
add at(?y)
delete at(?x)
```

After substitution:

```text
add at(wp2)
delete at(wp1)
```

**Answer.**

```text
Action: move(wp1, wp2)
Precondition: at(wp1)
Effects: add at(wp2); delete at(wp1)
```

---

### Solution A2. Check applicability under the closed world assumption

**Step 1 — Ground the action precondition.**

For:

```text
move(wp2, wp3)
```

we have:

```text
?x = wp2
?y = wp3
```

So the precondition is:

```text
at(wp2)
```

**Step 2 — Check whether the precondition is in the current state.**

Current state:

```text
{ at(wp1), connected(wp1, wp2) }
```

The fact `at(wp2)` is not present.

**Step 3 — Apply the closed world assumption.**

Under the closed world assumption, a fact not derivable from the state is treated as false.

So:

```text
at(wp2) is false
```

**Answer.**

`move(wp2, wp3)` is **not applicable**, because its required precondition `at(wp2)` is absent from the state and therefore false under the closed world assumption.

---

### Solution A3. Apply add and delete effects

**Step 1 — Check the action precondition.**

For:

```text
move(wp1, wp2)
```

precondition:

```text
at(wp1)
```

Current state:

```text
{ at(wp1), battery_ok }
```

The precondition is true.

**Step 2 — List the effects.**

```text
add at(wp2)
delete at(wp1)
```

**Step 3 — Delete negative effects.**

Remove:

```text
at(wp1)
```

State becomes:

```text
{ battery_ok }
```

**Step 4 — Add positive effects.**

Add:

```text
at(wp2)
```

**Answer.**

```text
Successor state = { at(wp2), battery_ok }
```

The unrelated fact `battery_ok` remains because the action does not delete it.

---

### Solution A4. Identify domain-file vs problem-file information

**Step 1 — Recall what the domain file contains.**

The domain file describes the general planning world:

```text
types, predicates, action schemas
```

**Step 2 — Recall what the problem file contains.**

The problem file describes one particular task:

```text
objects, initial state, goal state
```

**Step 3 — Classify each item.**

| Item | File |
|---|---|
| Types: `waypoint` | Domain file |
| Objects: `wp1 wp2 wp3` | Problem file |
| Predicate declaration: `(at ?x)` | Domain file |
| Initial state: `(at wp1)` | Problem file |
| Goal: `(at wp3)` | Problem file |
| Action schema: `move` | Domain file |

**Answer.**

Domain file: 1, 3, 6.  
Problem file: 2, 4, 5.

---

### Solution A5. Check one Blocks World action

**Step 1 — Write the preconditions of `stack(A,B)`.**

The schema `stack(X,Y)` requires:

```text
holding(X)
clear(Y)
```

For `stack(A,B)`, this becomes:

```text
holding(A)
clear(B)
```

**Step 2 — Check the current state.**

Current state:

```text
{ ontable(A), ontable(B), clear(A), clear(B), handempty }
```

`clear(B)` is true.

But `holding(A)` is absent.

**Step 3 — Apply closed world reasoning.**

Because `holding(A)` is absent, it is treated as false.

**Answer.**

`stack(A,B)` is **not applicable**. The missing precondition is:

```text
holding(A)
```

---

### Solution A6. Apply one Blocks World action

**Step 1 — Check the preconditions of `pick-up(A)`.**

`pick-up(X)` requires:

```text
clear(X), ontable(X), handempty
```

For `A`:

```text
clear(A), ontable(A), handempty
```

All three are present in:

```text
{ ontable(A), ontable(B), clear(A), clear(B), handempty }
```

So the action is applicable.

**Step 2 — List the effects of `pick-up(A)`.**

```text
add holding(A)
delete ontable(A)
delete clear(A)
delete handempty
```

**Step 3 — Remove deleted facts.**

Remove:

```text
ontable(A), clear(A), handempty
```

Remaining state:

```text
{ ontable(B), clear(B) }
```

**Step 4 — Add positive effects.**

Add:

```text
holding(A)
```

**Answer.**

```text
Successor state = { ontable(B), clear(B), holding(A) }
```

---

### Solution A7. Classify primitive action, higher-level action, and implementation

**Step 1 — Identify the action that still needs refinement.**

```text
travel(home, campus)
```

This is not directly executable as written. It stands for a larger task.

So it is a **higher-level action**.

**Step 2 — Identify directly executable actions.**

The question says:

```text
walk(home, bus_stop)
bus(bus_stop, campus)
```

are executable primitive actions.

So each one is a **primitive action**.

**Step 3 — Classify the whole refined plan.**

The refined plan contains only primitive actions:

```text
walk(home, bus_stop);
bus(bus_stop, campus)
```

A plan containing only primitive actions is an **implementation**.

**Answer.**

```text
travel(home, campus) = higher-level action
walk(home, bus_stop) = primitive action
bus(bus_stop, campus) = primitive action
walk; bus plan = implementation
```

---

# Section B — Multi-condition checks and search expansion

These questions combine several checks at once: multiple preconditions, branching, loops, backward regression, and heuristic evaluation.

## Questions

### B1. Running Blocks World example: list applicable actions

Use the lecture's running initial state:

```text
S0 = { ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty }
```

List all applicable actions from `S0` among the standard Blocks World actions.

---

### B2. Running example: expand the `pick-up(B)` branch

From:

```text
S0 = { ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty }
```

apply:

```text
pick-up(B)
```

1. Compute the successor state.
2. List the applicable next actions from that successor.
3. Identify which next action immediately loops back.

---

### B3. Running example: expand the `unstack(C,A)` branch

From:

```text
S0 = { ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty }
```

apply:

```text
unstack(C,A)
```

1. Compute the successor state.
2. List the applicable next actions from that successor.
3. Identify which next action immediately returns to the starting configuration.

---

### B4. Backward search through the final action

Use the lecture's Blocks World goal state:

```text
G = { ontable(A), on(B,A), on(C,B), clear(C), handempty }
```

Assume the last action was:

```text
stack(C,B)
```

Compute the predecessor state immediately before `stack(C,B)`.

---

### B5. Ignore-preconditions heuristic from the all-on-table state

Initial state:

```text
S = { ontable(A), ontable(B), ontable(C), clear(A), clear(B), clear(C), handempty }
```

Goal:

```text
G = { ontable(A), on(B,A), on(C,B) }
```

Using the ignore-preconditions heuristic, compute `h(S)`.

---

### B6. Compare heuristic values after three possible first actions

Same goal:

```text
G = { ontable(A), on(B,A), on(C,B) }
```

Suppose the first action creates each of these states:

```text
S1 = { holding(A), ontable(B), ontable(C) }
S2 = { ontable(A), holding(B), ontable(C) }
S3 = { ontable(A), ontable(B), holding(C) }
```

Using the ignore-preconditions heuristic, compute `h(S1)`, `h(S2)`, and `h(S3)`. Which state should a greedy heuristic search prefer?

---

### B7. Serializable sub-goals: detect a bad first move

Goal sub-goal order:

```text
1. ontable(A)
2. on(B,A)
3. on(C,B)
```

Current state:

```text
S = { ontable(A), ontable(B), ontable(C), clear(A), clear(B), clear(C), handempty }
```

Possible first actions:

```text
pick-up(A)
pick-up(B)
pick-up(C)
```

Which action should be pruned immediately by the serializable sub-goals heuristic, and why?

---

### B8. State abstraction: remove irrelevant facts safely

Current state:

```text
S = { ontable(A), ontable(B), ontable(C), clear(A), clear(B), clear(C), handempty }
```

Goal:

```text
G = { ontable(A), on(B,A) }
```

Using state abstraction, remove facts involving irrelevant objects. What abstracted state and abstracted goal remain?

---

### B9. Contingent plan branch selection

A contingent plan is:

```text
perceive(colour, table);
perceive(colour, chair);

if colour(table) = colour(chair)
then noop
else if colour(table) = colour(paint)
     then paint(chair)
else replan
```

Case:

```text
colour(table) = blue
colour(chair) = red
colour(paint) = blue
```

Which branch is executed?

---

## Worked solutions

### Solution B1. Running Blocks World example: list applicable actions

**Step 1 — Write the current state.**

```text
S0 = { ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty }
```

**Step 2 — Test `pick-up(X)`.**

`pick-up(X)` requires:

```text
clear(X), ontable(X), handempty
```

For `A`:

```text
clear(A) is absent
```

So `pick-up(A)` is not applicable.

For `B`:

```text
clear(B), ontable(B), handempty
```

all hold, so:

```text
pick-up(B)
```

is applicable.

For `C`:

```text
clear(C) is true, but ontable(C) is absent
```

So `pick-up(C)` is not applicable.

**Step 3 — Test `unstack(X,Y)`.**

`unstack(X,Y)` requires:

```text
on(X,Y), clear(X), handempty
```

The state contains:

```text
on(C,A), clear(C), handempty
```

So:

```text
unstack(C,A)
```

is applicable.

No other `on(X,Y)` fact is present, so no other unstack action applies.

**Step 4 — Test `stack` and `put-down`.**

Both require `holding(X)` for some block. No `holding` fact is in the state.

So no `stack` or `put-down` action is applicable.

**Answer.**

```text
Applicable actions = { pick-up(B), unstack(C,A) }
```

---

### Solution B2. Running example: expand the `pick-up(B)` branch

**Step 1 — Check preconditions.**

`pick-up(B)` requires:

```text
clear(B), ontable(B), handempty
```

All are present in:

```text
S0 = { ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty }
```

So the action is applicable.

**Step 2 — Apply effects.**

Effects of `pick-up(B)`:

```text
add holding(B)
delete ontable(B)
delete clear(B)
delete handempty
```

Start:

```text
{ ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty }
```

Delete:

```text
ontable(B), clear(B), handempty
```

Add:

```text
holding(B)
```

Successor:

```text
S1 = { ontable(A), on(C,A), clear(C), holding(B) }
```

**Step 3 — List applicable next actions.**

Because `holding(B)` is true:

```text
put-down(B)
```

is applicable.

Also `stack(B,Y)` is applicable for any clear `Y`. The only clear block in `S1` is:

```text
clear(C)
```

So:

```text
stack(B,C)
```

is applicable.

**Step 4 — Identify immediate loop.**

`put-down(B)` reverses `pick-up(B)`:

```text
pick-up(B) → put-down(B)
```

This returns B to the table and restores the previous configuration.

**Answer.**

```text
Successor = { ontable(A), on(C,A), clear(C), holding(B) }
Applicable next actions = { put-down(B), stack(B,C) }
Immediate loop = put-down(B)
```

---

### Solution B3. Running example: expand the `unstack(C,A)` branch

**Step 1 — Check preconditions.**

`unstack(C,A)` requires:

```text
on(C,A), clear(C), handempty
```

All are present in:

```text
S0 = { ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty }
```

So the action is applicable.

**Step 2 — Apply effects.**

Effects of `unstack(C,A)`:

```text
add holding(C)
add clear(A)
delete clear(C)
delete handempty
delete on(C,A)
```

Start:

```text
{ ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty }
```

Delete:

```text
clear(C), handempty, on(C,A)
```

Add:

```text
holding(C), clear(A)
```

Successor:

```text
S1 = { ontable(A), ontable(B), clear(A), clear(B), holding(C) }
```

**Step 3 — List applicable next actions.**

Since `holding(C)` is true:

```text
put-down(C)
```

is applicable.

Since `clear(A)` is true:

```text
stack(C,A)
```

is applicable.

Since `clear(B)` is true:

```text
stack(C,B)
```

is applicable.

**Step 4 — Identify immediate loop.**

`stack(C,A)` places C back on A, undoing `unstack(C,A)`.

So:

```text
unstack(C,A) → stack(C,A)
```

returns to the initial configuration.

**Answer.**

```text
Successor = { ontable(A), ontable(B), clear(A), clear(B), holding(C) }
Applicable next actions = { put-down(C), stack(C,A), stack(C,B) }
Immediate loop = stack(C,A)
```

---

### Solution B4. Backward search through the final action

**Step 1 — Write the goal state.**

```text
G = { ontable(A), on(B,A), on(C,B), clear(C), handempty }
```

**Step 2 — Instantiate the final action.**

For:

```text
stack(C,B)
```

we have:

```text
X = C
Y = B
```

`stack(C,B)` has preconditions:

```text
holding(C), clear(B)
```

and effects:

```text
add clear(C)
add handempty
add on(C,B)
delete holding(C)
delete clear(B)
```

**Step 3 — Reverse the action effects.**

Backward search removes facts added by the action and restores facts deleted by the action.

Remove from goal:

```text
clear(C), handempty, on(C,B)
```

Restore:

```text
holding(C), clear(B)
```

**Step 4 — Keep goal facts not affected by the action.**

The facts:

```text
ontable(A), on(B,A)
```

are not changed by `stack(C,B)`, so keep them.

**Answer.**

```text
Predecessor state = { ontable(A), on(B,A), clear(B), holding(C) }
```

---

### Solution B5. Ignore-preconditions heuristic from the all-on-table state

**Step 1 — Write the goal facts.**

```text
G = { ontable(A), on(B,A), on(C,B) }
```

**Step 2 — Check which goal facts are already true.**

Current state:

```text
S = { ontable(A), ontable(B), ontable(C), clear(A), clear(B), clear(C), handempty }
```

Already true:

```text
ontable(A)
```

Missing:

```text
on(B,A)
on(C,B)
```

**Step 3 — Ignore preconditions.**

Under the ignore-preconditions heuristic, any action can be applied regardless of its preconditions.

**Step 4 — Count the minimum actions needed to add missing goal facts.**

To add `on(B,A)`, use:

```text
stack(B,A)
```

To add `on(C,B)`, use:

```text
stack(C,B)
```

That is two actions.

**Answer.**

```text
h(S) = 2
```

This is an underestimate because in the real problem the planner may also need `pick-up` actions before stacking.

---

### Solution B6. Compare heuristic values after three possible first actions

**Step 1 — Write the goal facts.**

```text
G = { ontable(A), on(B,A), on(C,B) }
```

**Step 2 — Evaluate `S1`.**

```text
S1 = { holding(A), ontable(B), ontable(C) }
```

Goal facts already true: none of the listed goal facts except possibly none.

Missing:

```text
ontable(A)
on(B,A)
on(C,B)
```

Ignoring preconditions, these can be achieved by:

```text
put-down(A)       gives ontable(A)
stack(B,A)        gives on(B,A)
stack(C,B)        gives on(C,B)
```

So:

```text
h(S1) = 3
```

**Step 3 — Evaluate `S2`.**

```text
S2 = { ontable(A), holding(B), ontable(C) }
```

Already true:

```text
ontable(A)
```

Missing:

```text
on(B,A)
on(C,B)
```

Ignoring preconditions, use:

```text
stack(B,A)
stack(C,B)
```

So:

```text
h(S2) = 2
```

**Step 4 — Evaluate `S3`.**

```text
S3 = { ontable(A), ontable(B), holding(C) }
```

Already true:

```text
ontable(A)
```

Missing:

```text
on(B,A)
on(C,B)
```

Ignoring preconditions, use:

```text
stack(B,A)
stack(C,B)
```

So:

```text
h(S3) = 2
```

**Step 5 — Choose the preferred state.**

A greedy heuristic search prefers the lowest heuristic value.

```text
h(S1) = 3
h(S2) = 2
h(S3) = 2
```

**Answer.**

The search should prefer `S2` or `S3` over `S1`. The heuristic does not distinguish between `S2` and `S3` here.

---

### Solution B7. Serializable sub-goals: detect a bad first move

**Step 1 — Identify the protected first sub-goal.**

The first sub-goal is:

```text
ontable(A)
```

It is already true in the current state.

**Step 2 — Test whether each action preserves the protected sub-goal.**

`pick-up(A)` has effect:

```text
delete ontable(A)
```

So it undoes the protected first sub-goal.

`pick-up(B)` deletes:

```text
ontable(B), clear(B), handempty
```

It does not delete `ontable(A)`.

`pick-up(C)` deletes:

```text
ontable(C), clear(C), handempty
```

It does not delete `ontable(A)`.

**Step 3 — Apply the heuristic.**

The serializable sub-goals heuristic avoids branches that undo already achieved sub-goals.

**Answer.**

Prune:

```text
pick-up(A)
```

because it deletes `ontable(A)`, the first protected sub-goal.

---

### Solution B8. State abstraction: remove irrelevant facts safely

**Step 1 — Identify objects mentioned in the goal.**

Goal:

```text
G = { ontable(A), on(B,A) }
```

Objects mentioned:

```text
A, B
```

Object not mentioned:

```text
C
```

**Step 2 — Remove facts involving irrelevant object `C`.**

Current state:

```text
{ ontable(A), ontable(B), ontable(C), clear(A), clear(B), clear(C), handempty }
```

Remove:

```text
ontable(C), clear(C)
```

**Step 3 — Keep relevant state facts.**

Abstracted state:

```text
{ ontable(A), ontable(B), clear(A), clear(B), handempty }
```

**Step 4 — Abstract the goal.**

The goal already mentions only A and B, so it remains:

```text
{ ontable(A), on(B,A) }
```

**Answer.**

```text
Abstracted state = { ontable(A), ontable(B), clear(A), clear(B), handempty }
Abstracted goal = { ontable(A), on(B,A) }
```

This abstraction is safe here because C is separate and does not block A or B.

---

### Solution B9. Contingent plan branch selection

**Step 1 — Read the perceived facts.**

```text
colour(table) = blue
colour(chair) = red
colour(paint) = blue
```

**Step 2 — Test the first condition.**

Condition:

```text
colour(table) = colour(chair)
```

Substitute values:

```text
blue = red
```

This is false.

So do not execute `noop`.

**Step 3 — Test the second condition.**

Condition:

```text
colour(table) = colour(paint)
```

Substitute values:

```text
blue = blue
```

This is true.

**Step 4 — Select the branch.**

The plan executes:

```text
paint(chair)
```

**Answer.**

The agent executes the `paint(chair)` branch.

---

# Section C — Building things from scratch

These questions require constructing a representation, plan, or search trace rather than just checking one given step.

## Questions

### C1. Construct a simple PDDL action schema

Create a PDDL action schema for a robot picking up a key.

Use these intended meanings:

```text
Action: pickup-key(?r, ?k, ?l)
Types: robot, key, location
Preconditions:
  robot ?r is at location ?l
  key ?k is at location ?l
  robot's hand is empty
Effects:
  robot holds key ?k
  key ?k is no longer at location ?l
  robot's hand is no longer empty
```

Write a clean PDDL-style action schema.

---

### C2. Construct a matching problem file

Using the action idea from C1, build a small PDDL problem file with:

```text
Domain: key-domain
Objects: rob1 - robot, key1 - key, room1 room2 - location
Initial state: rob1 is at room1; key1 is at room1; handempty
Goal: rob1 holds key1
```

Write the PDDL-style problem file.

---

### C3. Build a forward plan for a two-step Blocks World goal

Initial state:

```text
S0 = { ontable(A), ontable(B), clear(A), clear(B), handempty }
```

Goal:

```text
G = { on(B,A) }
```

Build a valid forward plan and show the state after each action.

---

### C4. Build a backward search trace for a two-block goal

Goal:

```text
G = { on(B,A), clear(B), handempty }
```

Assume the last action is:

```text
stack(B,A)
```

1. Regress through `stack(B,A)`.
2. Then identify what action could produce the predecessor state from an all-on-table state.
3. Give the resulting forward plan.

Use the initial state:

```text
S0 = { ontable(A), ontable(B), clear(A), clear(B), handempty }
```

---

### C5. Construct an HTN refinement and implementation

Goal:

```text
go(student_home, lecture_hall)
```

Available primitive actions:

```text
walk(student_home, bus_stop)
bus(bus_stop, campus_gate)
walk(campus_gate, lecture_hall)
taxi(student_home, lecture_hall)
```

Construct:

1. a high-level plan,
2. one refinement into lower-level actions,
3. one implementation.

Then state whether the high-level plan achieves the goal.

---

### C6. Construct a contingent plan

Goal:

```text
have(light)
```

Available actions:

```text
perceive(power_status)
turn_on_lamp
open_curtains
replan
```

Known possibilities:

```text
If power works, turning on the lamp gives light.
If power does not work but it is daytime, opening curtains gives light.
If neither condition holds, the agent must replan.
```

Write a contingent plan using if-then-else structure.

---

### C7. Construct a minimal replanning repair

Original expected plan path:

```text
S1 → S2 → S3 → S4 → S5
```

During execution, after the first action the agent expects `S2` but observes:

```text
S6
```

Known repair costs:

```text
cost(S6 → S2) = 2
cost(S6 → S3) = 4
cost(S6 → S4) = 7
cost(S6 → S5) = 10
```

Which minimal repair target should the agent choose if it wants to resume the original plan as cheaply as possible?

---

## Worked solutions

### Solution C1. Construct a simple PDDL action schema

**Step 1 — Identify parameters and types.**

The action has:

```text
?r - robot
?k - key
?l - location
```

**Step 2 — Translate preconditions into predicates.**

Required conditions:

```text
(at ?r ?l)
(at ?k ?l)
(handempty)
```

**Step 3 — Translate positive effects.**

The robot will hold the key:

```text
(holding ?r ?k)
```

**Step 4 — Translate negative effects.**

The key is no longer at the location:

```text
(not (at ?k ?l))
```

The robot's hand is no longer empty:

```text
(not (handempty))
```

**Answer.**

```lisp
(:action pickup-key
 :parameters (?r - robot ?k - key ?l - location)
 :precondition (and
                (at ?r ?l)
                (at ?k ?l)
                (handempty))
 :effect (and
          (holding ?r ?k)
          (not (at ?k ?l))
          (not (handempty))))
```

---

### Solution C2. Construct a matching problem file

**Step 1 — Name the problem and domain.**

The problem can have any sensible name, for example:

```text
get-key-problem
```

The domain is given:

```text
key-domain
```

**Step 2 — Declare objects with types.**

```text
rob1 - robot
key1 - key
room1 room2 - location
```

**Step 3 — Write the initial state.**

```text
(at rob1 room1)
(at key1 room1)
(handempty)
```

**Step 4 — Write the goal.**

```text
(holding rob1 key1)
```

**Answer.**

```lisp
(define (problem get-key-problem)
  (:domain key-domain)

  (:objects
    rob1 - robot
    key1 - key
    room1 room2 - location)

  (:init
    (at rob1 room1)
    (at key1 room1)
    (handempty))

  (:goal
    (holding rob1 key1))
)
```

---

### Solution C3. Build a forward plan for a two-step Blocks World goal

**Step 1 — Write the initial state and goal.**

```text
S0 = { ontable(A), ontable(B), clear(A), clear(B), handempty }
G = { on(B,A) }
```

**Step 2 — Decide what must become true.**

The goal requires:

```text
on(B,A)
```

The action that adds `on(B,A)` is:

```text
stack(B,A)
```

**Step 3 — Check preconditions of the final action.**

`stack(B,A)` requires:

```text
holding(B), clear(A)
```

`clear(A)` is already true in `S0`.

`holding(B)` is not true, so we need to achieve it.

**Step 4 — Choose an action to achieve `holding(B)`.**

`pick-up(B)` adds:

```text
holding(B)
```

Check its preconditions:

```text
clear(B), ontable(B), handempty
```

All are true in `S0`.

**Step 5 — Apply `pick-up(B)`.**

Effects:

```text
add holding(B)
delete ontable(B), clear(B), handempty
```

State after `pick-up(B)`:

```text
S1 = { ontable(A), clear(A), holding(B) }
```

**Step 6 — Apply `stack(B,A)`.**

Preconditions:

```text
holding(B), clear(A)
```

Both are true in `S1`.

Effects:

```text
add on(B,A), clear(B), handempty
delete holding(B), clear(A)
```

State after `stack(B,A)`:

```text
S2 = { ontable(A), on(B,A), clear(B), handempty }
```

**Step 7 — Check goal.**

`S2` contains:

```text
on(B,A)
```

So the goal is achieved.

**Answer.**

```text
Plan: pick-up(B); stack(B,A)
```

---

### Solution C4. Build a backward search trace for a two-block goal

**Step 1 — Write the goal.**

```text
G = { on(B,A), clear(B), handempty }
```

**Step 2 — Regress through the assumed last action.**

Last action:

```text
stack(B,A)
```

Effects of `stack(B,A)`:

```text
add on(B,A)
add clear(B)
add handempty
delete holding(B)
delete clear(A)
```

Backward regression removes added effects and restores deleted effects.

Remove:

```text
on(B,A), clear(B), handempty
```

Restore:

```text
holding(B), clear(A)
```

So the predecessor condition is:

```text
P = { holding(B), clear(A) }
```

**Step 3 — Ask what action could produce `holding(B)`.**

From the all-on-table initial state:

```text
S0 = { ontable(A), ontable(B), clear(A), clear(B), handempty }
```

The action:

```text
pick-up(B)
```

has effect:

```text
add holding(B)
```

and requires:

```text
clear(B), ontable(B), handempty
```

These are all true in `S0`.

Also `clear(A)` remains true after picking up B.

**Step 4 — Convert the backward trace into a forward plan.**

Backward trace:

```text
Goal ← stack(B,A) ← predecessor requiring holding(B) ← pick-up(B) ← initial state
```

Forward plan reverses this:

```text
pick-up(B);
stack(B,A)
```

**Answer.**

```text
Regressed predecessor before stack(B,A): { holding(B), clear(A) }
Forward plan: pick-up(B); stack(B,A)
```

---

### Solution C5. Construct an HTN refinement and implementation

**Step 1 — Start with the top-level high-level action.**

The goal can be represented as:

```text
go(student_home, lecture_hall)
```

This is a higher-level action because it still needs planning.

**Step 2 — Choose a refinement.**

One refinement decomposes the journey into stages:

```text
go(student_home, bus_stop);
go(bus_stop, campus_gate);
go(campus_gate, lecture_hall)
```

These may still be high-level if `go` needs further refinement.

**Step 3 — Refine into primitive actions.**

Using the available primitive actions:

```text
walk(student_home, bus_stop);
bus(bus_stop, campus_gate);
walk(campus_gate, lecture_hall)
```

**Step 4 — Check whether the final plan is an implementation.**

The final plan contains only primitive actions.

So it is an implementation.

**Step 5 — Decide whether the high-level plan achieves the goal.**

A high-level plan achieves the goal if at least one implementation achieves the goal.

This implementation gets from `student_home` to `lecture_hall`, so the high-level plan achieves the goal.

**Answer.**

```text
High-level plan:
  go(student_home, lecture_hall)

Refinement:
  go(student_home, bus_stop);
  go(bus_stop, campus_gate);
  go(campus_gate, lecture_hall)

Implementation:
  walk(student_home, bus_stop);
  bus(bus_stop, campus_gate);
  walk(campus_gate, lecture_hall)

The high-level plan achieves the goal because at least one implementation reaches lecture_hall.
```

---

### Solution C6. Construct a contingent plan

**Step 1 — Identify what must be perceived.**

The agent needs to know:

```text
power_status
daytime_status
```

Because the correct action depends on those conditions.

**Step 2 — Write the first branch.**

If power works, use the lamp:

```text
if power_status = works
then turn_on_lamp
```

**Step 3 — Write the second branch.**

If power does not work but it is daytime, use daylight:

```text
else if daytime_status = daytime
then open_curtains
```

**Step 4 — Write the failure branch.**

If neither branch works, replan:

```text
else replan
```

**Answer.**

```text
perceive(power_status);
perceive(daytime_status);

if power_status = works
then turn_on_lamp
else if daytime_status = daytime
     then open_curtains
else replan
```

This is a contingent plan because the chosen action depends on information discovered during execution.

---

### Solution C7. Construct a minimal replanning repair

**Step 1 — State the expected and actual situation.**

Expected:

```text
S1 → S2
```

Observed instead:

```text
S1 → S6
```

So the original plan cannot simply continue from `S2` unless the agent repairs the mismatch.

**Step 2 — List possible repair targets and costs.**

```text
S6 → S2 costs 2
S6 → S3 costs 4
S6 → S4 costs 7
S6 → S5 costs 10
```

**Step 3 — Choose the cheapest target that resumes the plan.**

The cheapest repair is:

```text
S6 → S2
```

with cost 2.

**Step 4 — Explain why this is minimal.**

This gets the agent back to the earliest expected state after the failure, allowing the original plan to resume:

```text
S2 → S3 → S4 → S5
```

**Answer.**

The minimal repair target is:

```text
S2
```

Repair plan:

```text
S6 → S2
```

Then resume the original plan from `S2`.

---

# Section D — Hard edge cases: where methods mislead, disagree, or break down

These are the highest-value exam-style cases. They test whether you can spot when a method is legal but unhelpful, optimistic, unsafe, or incomplete.

## Questions

### D1. Forward search legal branch vs useful branch

Initial state:

```text
S0 = { ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty }
```

Goal:

```text
G = { ontable(A), on(B,A), on(C,B), clear(C), handempty }
```

Forward search can start with either:

```text
pick-up(B)
unstack(C,A)
```

Explain why `pick-up(B)` is legal but strategically poor for this goal.

---

### D2. Backward search can be more focused than forward search

Suppose a planning problem has:

```text
Initial state: many objects and many applicable actions
Goal state: one very specific final relation, target(obj1, obj2)
```

An action schema `make-target(?x, ?y)` is the only action whose effect can add `target(?x, ?y)`.

Which search direction is likely more focused, forward or backward? Explain procedurally.

---

### D3. Ignore-preconditions heuristic underestimates a blocked goal

Current state:

```text
S = { ontable(A), ontable(C), on(B,C), clear(A), clear(B), handempty }
```

Goal:

```text
G = { on(B,A) }
```

1. Compute the ignore-preconditions heuristic value `h(S)`.
2. Compute a real valid plan.
3. Explain why the heuristic is admissible but optimistic.

---

### D4. Serializable sub-goals: wrong ordering forces undoing

Initial state:

```text
S0 = { ontable(A), ontable(B), ontable(C), clear(A), clear(B), clear(C), handempty }
```

Goal:

```text
G = { on(B,C), on(A,B) }
```

Consider two possible sub-goal orders:

```text
Order 1: on(A,B), then on(B,C)
Order 2: on(B,C), then on(A,B)
```

Which order is serializable, and why?

---

### D5. State abstraction can be unsafe when an ignored object blocks the goal

Current state:

```text
S = { ontable(A), ontable(B), on(C,A), clear(B), clear(C), handempty }
```

Goal:

```text
G = { on(B,A) }
```

A careless abstraction says: “C is not mentioned in the goal, so ignore all C facts.”

Is this abstraction safe? Explain.

---

### D6. HLA possible effects: false abstract success due to mutual exclusion

Higher-level action:

```text
go(home, airport)
```

Possible implementations:

```text
taxi(home, airport): requires cash; effect not cash; does not move car
drive(home, airport): effect at(car, airport); does not spend taxi cash
```

Abstract possible effects representation says:

```text
~not cash
~at(car, airport)
```

Goal:

```text
{ not cash, at(car, airport) }
```

Why might the abstract search wrongly think the goal is achievable by this HLA?

---

### D7. Backward search with a variable that need not be enumerated

Action schema:

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

Goal:

```text
at(pkg1, jfk)
```

There are 50 planes in the domain.

Explain how backward search can represent the predecessor state without immediately enumerating all 50 planes.

---

### D8. Online planning: cheapest repair is not always the best continuation

Original expected path:

```text
S1 → S2 → S3 → S4 → S5
```

After executing the first action, the agent lands in:

```text
S6
```

Repair costs:

```text
cost(S6 → S2) = 2
cost(S6 → S3) = 3
cost(S6 → S4) = 4
cost(S6 → S5) = 5
```

Remaining original path costs:

```text
cost(S2 → S5 along original path) = 10
cost(S3 → S5 along original path) = 6
cost(S4 → S5 along original path) = 2
cost(S5 → S5) = 0
```

Which target gives the cheapest total route to the goal? Why is this different from simply choosing the cheapest immediate repair?

---

### D9. Contingent planning vs replanning

A robot must deliver a parcel. It knows there may be a locked door on the usual route.

Available facts/actions:

```text
perceive(door_status)
open_door
use_corridor_route
use_stairs_route
replan
```

Case 1: the robot knows in advance that the door is either open or closed, and if closed, the stairs route works.

Case 2: the robot does not know what alternative route exists if the door is blocked.

For each case, should the plan use a fully specified contingent branch or a `replan` branch? Explain.

---

### D10. A* admissibility: spot the bad heuristic

A planning problem has true remaining distances:

```text
true_distance(Sa) = 4
true_distance(Sb) = 6
true_distance(Sc) = 2
```

A heuristic gives:

```text
h(Sa) = 3
h(Sb) = 7
h(Sc) = 2
```

Is this heuristic admissible? If not, identify the violating state.

---

## Worked solutions

### Solution D1. Forward search legal branch vs useful branch

**Step 1 — Check why `pick-up(B)` is legal.**

`pick-up(B)` requires:

```text
clear(B), ontable(B), handempty
```

In the initial state:

```text
S0 = { ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty }
```

all three preconditions are true.

So `pick-up(B)` is applicable.

**Step 2 — Look at the goal structure.**

Goal:

```text
{ ontable(A), on(B,A), on(C,B), clear(C), handempty }
```

To place B on A, A must be clear.

But initially:

```text
on(C,A)
```

So A is blocked by C.

**Step 3 — Check what `pick-up(B)` does not solve.**

`pick-up(B)` gives:

```text
holding(B)
```

but A is still not clear, because C is still on A.

So B cannot yet be stacked on A.

**Step 4 — Compare with the alternative action.**

`unstack(C,A)` directly removes the obstacle from A and makes:

```text
clear(A)
```

which is needed before stacking B on A.

**Answer.**

`pick-up(B)` is legal because its preconditions hold, but it is strategically poor because it does not clear A. The more goal-directed first move is `unstack(C,A)`, because the goal requires `on(B,A)` and A must be clear before B can be stacked on it.

---

### Solution D2. Backward search can be more focused than forward search

**Step 1 — Compare the starting branching factors.**

Forward search begins from the initial state.

The problem says the initial state has:

```text
many objects and many applicable actions
```

So forward search may branch widely.

**Step 2 — Look at the goal.**

Goal:

```text
target(obj1, obj2)
```

This is a very specific final relation.

**Step 3 — Ask which action can produce the goal.**

Only:

```text
make-target(?x, ?y)
```

can add `target(?x, ?y)`.

To produce the exact goal, backward search immediately instantiates:

```text
?x = obj1
?y = obj2
```

**Step 4 — Compare search directions.**

Forward search asks:

```text
What can I do now?
```

and may generate many options.

Backward search asks:

```text
What action could have produced target(obj1, obj2)?
```

and immediately focuses on `make-target(obj1, obj2)`.

**Answer.**

Backward search is likely more focused because the goal is highly constrained and only one action schema can produce it. It starts from the desired final effect and works backward through the relevant action, avoiding many legal but irrelevant forward branches.

---

### Solution D3. Ignore-preconditions heuristic underestimates a blocked goal

**Step 1 — Identify the missing goal fact.**

Goal:

```text
G = { on(B,A) }
```

Current state:

```text
S = { ontable(A), ontable(C), on(B,C), clear(A), clear(B), handempty }
```

The fact `on(B,A)` is missing.

**Step 2 — Compute ignore-preconditions heuristic.**

Ignoring preconditions, the action:

```text
stack(B,A)
```

can be used immediately because preconditions are ignored.

It adds:

```text
on(B,A)
```

So:

```text
h(S) = 1
```

**Step 3 — Compute a real valid plan.**

In the real domain, `stack(B,A)` requires:

```text
holding(B), clear(A)
```

`clear(A)` is true, but `holding(B)` is false.

B is currently on C:

```text
on(B,C)
```

So first unstack B from C.

Action 1:

```text
unstack(B,C)
```

Preconditions:

```text
on(B,C), clear(B), handempty
```

all hold.

After `unstack(B,C)`:

```text
{ ontable(A), ontable(C), clear(A), clear(C), holding(B) }
```

Action 2:

```text
stack(B,A)
```

Preconditions:

```text
holding(B), clear(A)
```

both hold.

After `stack(B,A)`:

```text
{ ontable(A), ontable(C), clear(C), on(B,A), clear(B), handempty }
```

**Step 4 — Compare heuristic and real cost.**

Relaxed heuristic:

```text
h(S) = 1
```

Real plan length found:

```text
2
```

**Answer.**

```text
h(S) = 1
Real valid plan = unstack(B,C); stack(B,A)
Real cost = 2
```

The heuristic is admissible because it underestimates rather than overestimates the real distance. It is optimistic because ignoring preconditions pretends B can be stacked while not actually being held.

---

### Solution D4. Serializable sub-goals: wrong ordering forces undoing

**Step 1 — Understand the final tower.**

Goal:

```text
on(B,C), on(A,B)
```

This means the final stack is:

```text
A on B on C
```

So C is bottom, B is middle, A is top.

**Step 2 — Test Order 1.**

Order 1:

```text
on(A,B), then on(B,C)
```

If we achieve `on(A,B)` first, then B is no longer clear because A is on B.

To later achieve `on(B,C)`, we need to stack B on C.

But `stack(B,C)` requires:

```text
holding(B), clear(C)
```

To hold B while A is on B, we would first have to remove A from B.

That undoes:

```text
on(A,B)
```

So Order 1 is not serializable.

**Step 3 — Test Order 2.**

Order 2:

```text
on(B,C), then on(A,B)
```

First make B on C.

Then B can support A.

To make A on B, use:

```text
pick-up(A); stack(A,B)
```

This does not require undoing `on(B,C)`.

**Answer.**

Serializable order:

```text
Order 2: on(B,C), then on(A,B)
```

because it builds the tower from bottom to top. Order 1 is bad because achieving `on(A,B)` first makes B unavailable for stacking onto C unless A is removed, which undoes the first sub-goal.

---

### Solution D5. State abstraction can be unsafe when an ignored object blocks the goal

**Step 1 — Identify the goal objects.**

Goal:

```text
on(B,A)
```

Goal mentions:

```text
A, B
```

It does not mention C.

**Step 2 — Check whether C affects action applicability.**

To achieve `on(B,A)`, likely final action:

```text
stack(B,A)
```

requires:

```text
holding(B), clear(A)
```

Current state contains:

```text
on(C,A)
```

This means A is not clear.

So C blocks A.

**Step 3 — Test the careless abstraction.**

If we remove all C facts, we might incorrectly believe A is clear or at least fail to represent why A is not clear.

The abstracted problem would hide the need to remove C from A.

**Step 4 — Decide safety.**

An object is not irrelevant merely because it is absent from the goal. It may still affect whether goal-achieving actions are applicable.

**Answer.**

The abstraction is **not safe**. C is not in the goal, but C is on A, and A must be clear before B can be stacked on A. Ignoring C removes a real obstacle and can make the planning problem look easier than it is.

---

### Solution D6. HLA possible effects: false abstract success due to mutual exclusion

**Step 1 — List the concrete implementations.**

Taxi:

```text
spends cash → not cash
car does not move to airport
```

Drive:

```text
car moves to airport → at(car, airport)
does not spend taxi cash
```

**Step 2 — Interpret the abstract possible effects.**

The HLA representation says:

```text
~not cash
~at(car, airport)
```

Meaning:

```text
not cash is possibly achieved
at(car, airport) is possibly achieved
```

**Step 3 — Compare possible effects with actual implementations.**

The abstract representation lists both possible effects under the same HLA.

But no single implementation achieves both:

```text
taxi achieves not cash but not at(car, airport)
drive achieves at(car, airport) but not not cash
```

**Step 4 — Explain the failure.**

Possible-effects notation does not by itself encode that these effects are mutually exclusive.

So abstract search may combine effects from different implementations as if one implementation could produce all of them.

**Answer.**

The abstract search may wrongly think the goal is achievable because it sees both `~not cash` and `~at(car, airport)` as possible effects of `go(home, airport)`. But those effects belong to different mutually exclusive implementations: taxi spends cash, while driving moves the car. No single implementation does both.

---

### Solution D7. Backward search with a variable that need not be enumerated

**Step 1 — Match the goal against the action effect.**

Goal:

```text
at(pkg1, jfk)
```

Unload effect:

```text
at(?x, ?z)
```

Unify:

```text
?x = pkg1
?z = jfk
```

**Step 2 — Notice the remaining variable.**

The plane variable:

```text
?y
```

appears in the preconditions:

```text
in(?x, ?y)
at(?y, ?z)
```

but the positive goal-producing effect does not identify a specific plane.

**Step 3 — Write the regressed predecessor with a variable.**

Before unloading, the predecessor condition is:

```text
in(pkg1, ?y)
at(?y, jfk)
```

where `?y` is some plane.

**Step 4 — Avoid immediate enumeration.**

Instead of generating 50 separate predecessors:

```text
in(pkg1, plane1), at(plane1, jfk)
in(pkg1, plane2), at(plane2, jfk)
...
```

backward search can keep:

```text
∃?y: in(pkg1, ?y) and at(?y, jfk)
```

as a variable predecessor condition.

**Answer.**

Backward search can regress to:

```text
{ in(pkg1, ?plane), at(?plane, jfk) }
```

without choosing which of the 50 planes it is yet. This represents many possible planes compactly and delays enumeration until the planner needs to match the condition against the initial state or earlier actions.

---

### Solution D8. Online planning: cheapest repair is not always the best continuation

**Step 1 — Calculate total cost through each possible target.**

For each target, total cost is:

```text
repair cost + remaining original path cost
```

**Step 2 — Compute target S2 total.**

```text
cost(S6 → S2) + cost(S2 → S5)
= 2 + 10
= 12
```

**Step 3 — Compute target S3 total.**

```text
cost(S6 → S3) + cost(S3 → S5)
= 3 + 6
= 9
```

**Step 4 — Compute target S4 total.**

```text
cost(S6 → S4) + cost(S4 → S5)
= 4 + 2
= 6
```

**Step 5 — Compute target S5 total.**

```text
cost(S6 → S5) + cost(S5 → S5)
= 5 + 0
= 5
```

**Step 6 — Choose the cheapest total route.**

The cheapest total route is:

```text
S6 → S5
```

with total cost 5.

**Answer.**

The best target is:

```text
S5
```

because it gives the lowest total cost to the goal.

This differs from simply choosing the cheapest immediate repair because `S6 → S2` is cheapest locally, but after reaching S2 the agent still has a long remaining path. Sometimes a slightly more expensive repair can skip much more of the original plan.

---

### Solution D9. Contingent planning vs replanning

**Step 1 — Identify what the agent knows in Case 1.**

Case 1 says:

```text
Door is open or closed.
If closed, stairs route works.
```

The agent knows the relevant contingencies and knows what to do in each case.

**Step 2 — Use a fully specified contingent branch for Case 1.**

A suitable plan is:

```text
perceive(door_status);

if door_status = open
then use_corridor_route
else if door_status = closed
     then use_stairs_route
else replan
```

The final `else replan` is optional defensive handling for unexpected observations, but the main known branches are specified.

**Step 3 — Identify what the agent lacks in Case 2.**

Case 2 says the robot does not know what alternative route exists if the door is blocked.

So it cannot write a complete branch in advance.

**Step 4 — Use replanning for Case 2.**

A suitable plan is:

```text
perceive(door_status);

if door_status = open
then use_corridor_route
else replan
```

**Answer.**

Case 1 should use a fully specified contingent branch, because the agent knows the relevant possible conditions and actions. Case 2 should use `replan` when the blocked-door condition is discovered, because the agent does not yet have a known alternative plan to encode.

---

### Solution D10. A* admissibility: spot the bad heuristic

**Step 1 — Recall admissibility.**

A heuristic is admissible if it never overestimates the true remaining distance:

```text
h(S) ≤ true_distance(S)
```

for every state.

**Step 2 — Check Sa.**

```text
true_distance(Sa) = 4
h(Sa) = 3
```

Since:

```text
3 ≤ 4
```

this is admissible for `Sa`.

**Step 3 — Check Sb.**

```text
true_distance(Sb) = 6
h(Sb) = 7
```

Since:

```text
7 > 6
```

this overestimates.

So admissibility is violated.

**Step 4 — Check Sc.**

```text
true_distance(Sc) = 2
h(Sc) = 2
```

Since:

```text
2 ≤ 2
```

this is admissible for `Sc`.

**Answer.**

The heuristic is **not admissible**. The violating state is:

```text
Sb
```

because:

```text
h(Sb) = 7 > true_distance(Sb) = 6
```

---

# Section E — Mixed exam-style mini-set

This final mini-set mixes the whole lecture: PDDL, search, heuristics, HTNs, and online planning.

## Questions

### E1. Full mini-problem: PDDL action, applicability, and successor state

Action schema:

```lisp
(:action load
 :parameters (?pkg - package ?truck - truck ?loc - location)
 :precondition (and
                (at ?pkg ?loc)
                (at ?truck ?loc)
                (empty ?truck))
 :effect (and
          (in ?pkg ?truck)
          (not (at ?pkg ?loc))
          (not (empty ?truck))))
```

Current state:

```text
S = { at(p1, depot), at(t1, depot), empty(t1), at(t2, depot), empty(t2) }
```

1. Is `load(p1,t1,depot)` applicable?
2. What is the successor state?
3. Is `load(p1,t2,depot)` applicable after that successor state?

---

### E2. Full mini-problem: forward search plus heuristic choice

Initial state:

```text
S0 = { ontable(A), ontable(B), ontable(C), clear(A), clear(B), clear(C), handempty }
```

Goal:

```text
G = { on(B,A), on(C,B) }
```

Possible first actions:

```text
pick-up(A)
pick-up(B)
pick-up(C)
```

1. Compute the successor state for each first action.
2. Compute the ignore-preconditions heuristic for each successor.
3. Which branch should the heuristic avoid first?

---

### E3. Full mini-problem: HTN plus possible-effects failure

High-level task:

```text
prepare_for_trip(home, airport)
```

Possible implementations:

```text
taxi(home, airport): effect at(person, airport), not cash
drive(home, airport): effect at(person, airport), at(car, airport)
```

Goal:

```text
{ at(person, airport), at(car, airport), not cash }
```

1. Does each implementation achieve the full goal?
2. Why could possible-effects abstraction mislead the planner?
3. What should the planner do at implementation-check time?

---

## Worked solutions

### Solution E1. Full mini-problem: PDDL action, applicability, and successor state

**Step 1 — Ground the action.**

For:

```text
load(p1,t1,depot)
```

substitute:

```text
?pkg = p1
?truck = t1
?loc = depot
```

Preconditions become:

```text
at(p1, depot)
at(t1, depot)
empty(t1)
```

**Step 2 — Check applicability in S.**

Current state:

```text
S = { at(p1, depot), at(t1, depot), empty(t1), at(t2, depot), empty(t2) }
```

All three preconditions are present.

So `load(p1,t1,depot)` is applicable.

**Step 3 — Apply effects.**

Effects:

```text
add in(p1,t1)
delete at(p1,depot)
delete empty(t1)
```

Successor state:

```text
S1 = { at(t1, depot), at(t2, depot), empty(t2), in(p1,t1) }
```

**Step 4 — Test `load(p1,t2,depot)` in S1.**

Grounded preconditions:

```text
at(p1, depot)
at(t2, depot)
empty(t2)
```

`at(t2,depot)` and `empty(t2)` are present.

But:

```text
at(p1,depot)
```

is absent because p1 is now in t1.

Under the closed world assumption, absent means false.

**Answer.**

1. `load(p1,t1,depot)` is applicable.  
2. Successor:

```text
{ at(t1, depot), at(t2, depot), empty(t2), in(p1,t1) }
```

3. `load(p1,t2,depot)` is not applicable afterward because `at(p1,depot)` is false.

---

### Solution E2. Full mini-problem: forward search plus heuristic choice

**Step 1 — Compute successor after `pick-up(A)`.**

`pick-up(A)` deletes:

```text
ontable(A), clear(A), handempty
```

and adds:

```text
holding(A)
```

So:

```text
S_A = { ontable(B), ontable(C), clear(B), clear(C), holding(A) }
```

**Step 2 — Compute successor after `pick-up(B)`.**

`pick-up(B)` deletes:

```text
ontable(B), clear(B), handempty
```

and adds:

```text
holding(B)
```

So:

```text
S_B = { ontable(A), ontable(C), clear(A), clear(C), holding(B) }
```

**Step 3 — Compute successor after `pick-up(C)`.**

`pick-up(C)` deletes:

```text
ontable(C), clear(C), handempty
```

and adds:

```text
holding(C)
```

So:

```text
S_C = { ontable(A), ontable(B), clear(A), clear(B), holding(C) }
```

**Step 4 — Compute heuristic for `S_A`.**

Goal:

```text
{ on(B,A), on(C,B) }
```

Neither goal fact is true in `S_A`.

Ignoring preconditions, missing facts can be achieved by:

```text
stack(B,A)
stack(C,B)
```

So:

```text
h(S_A) = 2
```

**Step 5 — Compute heuristic for `S_B`.**

Neither goal fact is yet true in `S_B`.

Ignoring preconditions, still need:

```text
stack(B,A)
stack(C,B)
```

So:

```text
h(S_B) = 2
```

**Step 6 — Compute heuristic for `S_C`.**

Neither goal fact is yet true in `S_C`.

Ignoring preconditions, still need:

```text
stack(B,A)
stack(C,B)
```

So:

```text
h(S_C) = 2
```

**Step 7 — Interpret the result.**

The ignore-preconditions heuristic ties all three states in this variant:

```text
h(S_A) = h(S_B) = h(S_C) = 2
```

It does not know that holding B may be more useful for building the tower bottom-up.

**Answer.**

The ignore-preconditions heuristic does **not** avoid any branch here, because all three successors get the same value. This is an edge case showing that a heuristic can be admissible but too weak to discriminate between choices.

---

### Solution E3. Full mini-problem: HTN plus possible-effects failure

**Step 1 — Check taxi implementation.**

Taxi effects:

```text
at(person, airport)
not cash
```

Goal:

```text
{ at(person, airport), at(car, airport), not cash }
```

Taxi achieves:

```text
at(person, airport), not cash
```

but does not achieve:

```text
at(car, airport)
```

So taxi alone does not achieve the full goal.

**Step 2 — Check drive implementation.**

Drive effects:

```text
at(person, airport)
at(car, airport)
```

Drive achieves:

```text
at(person, airport), at(car, airport)
```

but does not achieve:

```text
not cash
```

So drive alone does not achieve the full goal.

**Step 3 — Explain the possible-effects trap.**

At the abstract HLA level, the planner might represent:

```text
prepare_for_trip has possible effect not cash
prepare_for_trip has possible effect at(car, airport)
```

This makes it look as if the HLA can achieve both side effects.

But those effects come from different implementations:

```text
taxi gives not cash
drive gives at(car, airport)
```

No single implementation gives both.

**Step 4 — State what implementation-check time must do.**

The planner must verify that one concrete implementation achieves all required goal facts together.

It cannot merely combine possible effects from different refinements.

**Answer.**

1. Taxi does not achieve the full goal because it does not put the car at the airport.  
2. Driving does not achieve the full goal because it does not spend taxi cash.  
3. Possible-effects abstraction can mislead the planner by combining mutually exclusive effects from different implementations.  
4. At implementation-check time, the planner must reject the HLA as a complete solution unless it finds one concrete implementation that achieves all required effects.

---

# Final revision checklist

Before the exam, make sure you can do the following without looking:

```text
[ ] Ground a PDDL action schema.
[ ] Decide whether an action is applicable.
[ ] Apply add/delete effects to produce a successor state.
[ ] Use the closed world assumption correctly.
[ ] Separate domain-file material from problem-file material.
[ ] Expand one level of forward search and spot loops.
[ ] Regress one step in backward search by reversing effects.
[ ] Compute ignore-preconditions heuristic values.
[ ] Use serializable sub-goals to prune actions that undo achieved goals.
[ ] Apply state abstraction only when ignored facts are genuinely irrelevant.
[ ] Build an HTN refinement and identify an implementation.
[ ] Explain why HLA possible-effects notation can fail under mutual exclusion.
[ ] Write an if-then-else contingent plan.
[ ] Choose a minimal replanning target after unexpected execution.
[ ] Distinguish offline/classical planning from online planning/replanning.
```
