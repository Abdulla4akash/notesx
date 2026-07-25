---
subject: COMP64602
chapter: 78
title: "Week 8 — Extra Exercises"
language: en
---

# Week 8 — Planning: Extra Exercise Set

A second layer on top of chapter 58, focused on PDDL action modelling, tracing forward and backward search, and reasoning about heuristic admissibility.

## Exercise types

1. **PDDL action authoring** — write preconditions and effects.
2. **Applicability checking** — decide whether an action fires in a state.
3. **State progression** — apply an action and compute the successor.
4. **Search tracing** — forward and backward, with regression.
5. **Heuristic reasoning** — compute a heuristic and test admissibility.

---

# Section A — PDDL and state transitions

## E1. Write a PDDL action

In Blocks World with predicates `(on ?x ?y)`, `(onTable ?x)`, `(clear ?x)`, `(holding ?x)`, `(handEmpty)`, write the `unstack` action that lifts `?x` from `?y`.

### Solution

**Step 1: Identify the preconditions.** To lift `?x` off `?y` we need: `?x` actually on `?y`; `?x` clear (nothing on top of it); and a free gripper.

**Step 2: Identify the effects.** After the action: the robot holds `?x`; `?x` is no longer on `?y`; `?y` becomes clear; `?x` is no longer clear (it is held); the hand is no longer empty.

**Step 3: Write it.**

```lisp
(:action unstack
  :parameters (?x ?y)
  :precondition (and (on ?x ?y) (clear ?x) (handEmpty))
  :effect (and (holding ?x)
               (clear ?y)
               (not (on ?x ?y))
               (not (clear ?x))
               (not (handEmpty))))
```

**Step 4: Check the delete effects are complete.** A common error is omitting `(not (handEmpty))`. Without it the state would satisfy both `(holding ?x)` and `(handEmpty)` — physically impossible, and it would let the planner pick up a second block, producing an invalid plan that nonetheless "solves" the problem.

**Step 5: Note the STRIPS reading.** Preconditions are what must hold; the positive effects form the **add list**; the negated effects form the **delete list**. Successor computation is
$$s' = (s \setminus \mathrm{Del}(a)) \cup \mathrm{Add}(a).$$

**Step 6: Note the closed-world assumption.** Anything not in $s$ is false. So the effects need only state what **changes** — everything else persists. This is the *frame assumption*, and it is why PDDL actions are compact.

---

## E2. Applicability and progression

State $s = \{\mathsf{on}(A,B),\ \mathsf{onTable}(B),\ \mathsf{clear}(A),\ \mathsf{handEmpty}\}$. (a) Is `unstack(A,B)` applicable? (b) Is `unstack(B,A)` applicable? (c) Compute the successor of (a).

### Solution

**Step 1: (a) Check each precondition.**
- $\mathsf{on}(A,B) \in s$ ✓
- $\mathsf{clear}(A) \in s$ ✓
- $\mathsf{handEmpty} \in s$ ✓

All hold, so `unstack(A,B)` is **applicable**.

**Step 2: (b) Check the second.** Requires $\mathsf{on}(B,A)$, which is **not** in $s$ (we have $\mathsf{on}(A,B)$ — the other way round). Also $\mathsf{clear}(B)$ is absent, since $A$ sits on $B$. **Not applicable**, failing two preconditions.

**Step 3: (c) Identify the lists for `unstack(A,B)`.**
- Add: $\{\mathsf{holding}(A),\ \mathsf{clear}(B)\}$
- Delete: $\{\mathsf{on}(A,B),\ \mathsf{clear}(A),\ \mathsf{handEmpty}\}$

**Step 4: Remove the delete list.**
$$s \setminus \mathrm{Del} = \{\mathsf{onTable}(B)\}$$

**Step 5: Add the add list.**
$$s' = \{\mathsf{onTable}(B),\ \mathsf{holding}(A),\ \mathsf{clear}(B)\}$$

**Step 6: Sanity-check the physics.** The robot holds $A$; $B$ is on the table and now clear; the hand is not empty. Coherent ✓. Had we omitted $\mathsf{handEmpty}$ from the delete list, $s'$ would contain both $\mathsf{handEmpty}$ and $\mathsf{holding}(A)$ — the error flagged in E1, Step 4.

---

# Section B — Search

## E3. Trace forward search

Initial state $s_0 = \{\mathsf{onTable}(A), \mathsf{onTable}(B), \mathsf{clear}(A), \mathsf{clear}(B), \mathsf{handEmpty}\}$; goal $g = \{\mathsf{on}(A,B)\}$. Trace a forward search to a solution.

### Solution

**Step 1: State the method.** Forward (progression) search starts at $s_0$, applies applicable actions to generate successors, and stops when a state **satisfies** the goal, i.e. $g \subseteq s$.

**Step 2: Check the goal at $s_0$.** $\mathsf{on}(A,B) \notin s_0$, so not yet.

**Step 3: Enumerate applicable actions at $s_0$.** `unstack` needs an `on` atom — none exists. `putdown`/`stack` need `holding` — the hand is empty. So only `pickup` applies, to $A$ or to $B$ (both are clear and on the table).

**Step 4: Choose `pickup(A)`.**
- Add: $\{\mathsf{holding}(A)\}$; Delete: $\{\mathsf{onTable}(A), \mathsf{clear}(A), \mathsf{handEmpty}\}$
$$s_1 = \{\mathsf{onTable}(B),\ \mathsf{clear}(B),\ \mathsf{holding}(A)\}$$

**Step 5: Check the goal at $s_1$.** Not satisfied.

**Step 6: Apply `stack(A,B)`.** Preconditions $\mathsf{holding}(A)$ ✓ and $\mathsf{clear}(B)$ ✓.
- Add: $\{\mathsf{on}(A,B),\ \mathsf{clear}(A),\ \mathsf{handEmpty}\}$; Delete: $\{\mathsf{holding}(A),\ \mathsf{clear}(B)\}$
$$s_2 = \{\mathsf{onTable}(B),\ \mathsf{on}(A,B),\ \mathsf{clear}(A),\ \mathsf{handEmpty}\}$$

**Step 7: Check the goal at $s_2$.** $\mathsf{on}(A,B) \in s_2$ ✓ — goal reached.

**Step 8: State the plan.** $\langle \mathsf{pickup}(A),\ \mathsf{stack}(A,B) \rangle$, length 2.

**Step 9: Note the branch not taken.** Choosing `pickup(B)` first leads to `stack(B,A)`, achieving $\mathsf{on}(B,A)$ — not the goal — and would require undoing work. This is exactly why heuristics matter: the branching factor is small here but grows quickly with the number of blocks.

---

## E4. Trace backward search with regression

Same problem. Trace a backward (regression) search from the goal.

### Solution

**Step 1: State the method.** Backward search starts from the **goal set** and works toward $s_0$. For a goal $g$ and a **relevant** action $a$ (one whose add list contributes to $g$ and whose delete list does not destroy any part of $g$), the regressed subgoal is
$$g' = \big(g \setminus \mathrm{Add}(a)\big) \cup \mathrm{Pre}(a).$$

**Step 2: Start from $g = \{\mathsf{on}(A,B)\}$.**

**Step 3: Choose a relevant action.** Which action adds $\mathsf{on}(A,B)$? Only `stack(A,B)`. Check it does not delete anything in $g$: its delete list is $\{\mathsf{holding}(A), \mathsf{clear}(B)\}$, disjoint from $g$ ✓. So it is relevant.

**Step 4: Regress through `stack(A,B)`.**
- $g \setminus \mathrm{Add} = \{\mathsf{on}(A,B)\} \setminus \{\mathsf{on}(A,B), \mathsf{clear}(A), \mathsf{handEmpty}\} = \emptyset$
- Add the preconditions: $\mathrm{Pre} = \{\mathsf{holding}(A), \mathsf{clear}(B)\}$
$$g_1 = \{\mathsf{holding}(A),\ \mathsf{clear}(B)\}$$

**Step 5: Test against $s_0$.** Is $g_1 \subseteq s_0$? $\mathsf{holding}(A) \notin s_0$ — no. Continue.

**Step 6: Choose the next relevant action.** Which adds $\mathsf{holding}(A)$? `pickup(A)` (and `unstack(A, ?y)`, but no `on(A,?y)` route leads to $s_0$ here). Check `pickup(A)`'s delete list $\{\mathsf{onTable}(A), \mathsf{clear}(A), \mathsf{handEmpty}\}$ against $g_1$ — disjoint from $\{\mathsf{holding}(A), \mathsf{clear}(B)\}$ ✓ relevant.

**Step 7: Regress through `pickup(A)`.**
- $g_1 \setminus \mathrm{Add} = \{\mathsf{holding}(A), \mathsf{clear}(B)\} \setminus \{\mathsf{holding}(A)\} = \{\mathsf{clear}(B)\}$
- Add $\mathrm{Pre} = \{\mathsf{onTable}(A), \mathsf{clear}(A), \mathsf{handEmpty}\}$
$$g_2 = \{\mathsf{clear}(B),\ \mathsf{onTable}(A),\ \mathsf{clear}(A),\ \mathsf{handEmpty}\}$$

**Step 8: Test against $s_0$.** Every element is in $s_0$ ✓ — search succeeds.

**Step 9: Read the plan forwards.** Reversing the actions chosen: $\langle \mathsf{pickup}(A),\ \mathsf{stack}(A,B) \rangle$ — the same plan as E3.

**Step 10: Note the contrast.** Backward search considers only **relevant** actions, so it ignores irrelevant branches like `pickup(B)` that forward search must generate. But it reasons over **sets of states** (subgoals) rather than concrete states, so applicability is harder to check and the subgoals may be unreachable. Neither direction dominates; the choice depends on branching structure.

---

# Section C — Heuristics

## E5. Compute the ignore-preconditions heuristic and test admissibility

Explain the ignore-preconditions heuristic, compute it for the E3 problem at $s_0$, and prove it is admissible.

### Solution

**Step 1: State the relaxation.** Drop **all preconditions** from every action, keeping effects. Every action is then applicable in every state, and the relaxed problem is far easier to solve; its solution length is the heuristic value.

**Step 2: Apply at $s_0$ for goal $\{\mathsf{on}(A,B)\}$.** With preconditions ignored, `stack(A,B)` is immediately applicable and adds $\mathsf{on}(A,B)$. So one action suffices:
$$h_{\text{ignore-pre}}(s_0) = 1.$$

**Step 3: Compare with the true cost.** The real optimal plan has length 2 (E3). So $h(s_0) = 1 \le 2 = h^*(s_0)$ ✓ — it underestimates here.

**Step 4: Prove admissibility in general.** Let $\pi$ be any optimal plan for the **original** problem, of length $h^*(s)$. Since the relaxed problem has the same actions with **fewer** constraints, $\pi$ is still a valid plan in the relaxed problem (every precondition it satisfied is now trivially satisfied). Hence the relaxed optimum is at most $|\pi|$:
$$h_{\text{ignore-pre}}(s) \le h^*(s).$$
Never overestimating is exactly admissibility.

**Step 5: State why admissibility matters.** With an admissible heuristic, **A\*** is guaranteed to return an **optimal** plan. An inadmissible heuristic may overestimate and prune the optimal path, so A* could return a suboptimal plan (though often faster).

**Step 6: Note the general principle.** Any **relaxation** of a problem yields an admissible heuristic, because removing constraints cannot make the optimal solution longer. Ignore-preconditions and ignore-delete-lists are two standard relaxations; the latter underlies $h^{\text{max}}$, $h^{\text{add}}$, and $h^{\text{FF}}$.

**Step 7: Note the trade-off.** The relaxation must itself be cheap to solve, or computing the heuristic costs more than the search it saves. Ignore-preconditions reduces to a set-cover-like problem — still NP-hard in general, so practical planners approximate it further. A heuristic is only useful if *informative* **and** *cheap*.
