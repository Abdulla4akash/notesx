---
subject: COMP64602
chapter: 80
title: "Week 10 — Extra Exercises"
language: en
---

# Week 10 — Agent Programming with Gwendolen: Extra Exercise Set

A second layer on top of chapter 60, focused on plan syntax, the achieve/perform distinction, tracing the reasoning cycle, and the event-versus-condition confusion.

## Exercise types

1. **Plan authoring** — write a Gwendolen plan with the right guard.
2. **Goal-type selection** — choose achieve or perform, and justify.
3. **Reasoning-cycle tracing** — step through one iteration.
4. **Defect diagnosis** — find why a plan never fires.
5. **BDI concept application** — events, intentions, beliefs.

---

# Section A — Plans and goals

## E1. Anatomy of a Gwendolen plan

State the three parts of a Gwendolen plan and what each contributes, then write a plan that picks up a block when the agent believes it is visible.

### Solution

**Step 1: Give the shape.** A plan has the form
$$\textit{trigger} : \{\textit{guard}\} \leftarrow \textit{body};$$

**Step 2: Explain each part.**
- **Trigger** — the event the plan responds to: a new belief (`+!b`), a dropped belief, or a goal to be handled. The plan is *considered* only when this event occurs.
- **Guard** — a condition on the agent's current **beliefs** (and goals). The plan is *applicable* only if the guard holds now.
- **Body** — a sequence of actions, belief updates, and subgoals to execute.

**Step 3: Write the plan.**

```
+!pickup(B) : {B block(B), B visible(B)} <-
    move_to(B),
    grasp(B),
    +holding(B);
```

**Step 4: Read it back.** On acquiring the goal `pickup(B)`, if the agent **believes** `block(B)` and `visible(B)`, then move to it, grasp it, and add the belief `holding(B)`.

**Step 5: Note the `B` prefix.** In Gwendolen, `B` denotes a belief query in the guard. Writing a bare literal is not the same as querying a belief, and confusing the two is a common source of plans that never fire.

**Step 6: State the essential separation.** The **trigger** says *when to consider* the plan; the **guard** says *whether it currently applies*. Both must hold. Putting a condition in the wrong place is the defect diagnosed in E4.

---

## E2. Achieve versus perform

Distinguish achieve goals from perform goals. For each task, choose one and justify: (a) move the arm 10° clockwise; (b) ensure the door is closed; (c) transmit a status message; (d) get the robot to the charging station.

### Solution

**Step 1: Define perform.** A **perform** goal (`!g` in the perform sense) is satisfied once its plan body has been **executed**. Success is about *doing*, and the agent does not re-check the world afterwards.

**Step 2: Define achieve.** An **achieve** goal (`[achieve]`) is satisfied only when the corresponding **belief holds**. If the plan body runs and the belief is still absent, the goal remains, and the agent will try again — selecting another applicable plan if one exists.

**Step 3: (a) Perform.** "Move 10° clockwise" is an action, not a state. There is no proposition that becomes true; the point is the doing.

**Step 4: (b) Achieve.** "Ensure the door is closed" names a **state of the world** (`closed(door)`). If pushing fails, the goal should persist and be retried — exactly achieve semantics.

**Step 5: (c) Perform.** Transmitting is an action. Note the contrast: "ensure the message has been **acknowledged**" would be *achieve*, since acknowledgement is a state the agent can verify.

**Step 6: (d) Achieve.** `at(robot, charger)` is a verifiable state; navigation may fail and warrant retry.

**Step 7: State the decision rule.** Ask *is there a belief whose truth defines success?* If yes → **achieve**. If success is simply "the body ran" → **perform**. Using perform where achieve is needed produces an agent that believes it succeeded when it did not — the more dangerous of the two errors.

---

# Section B — The reasoning cycle

## E3. Trace one reasoning cycle

State the stages of the Gwendolen reasoning cycle and trace one iteration for an agent with belief `visible(b1)`, no intentions, and an incoming `start` event that adds the goal `pickup(b1)`, using E1's plan.

### Solution

**Step 1: State the stages.** Broadly, each cycle:
1. **Perceive** — update beliefs from sensors and incoming messages.
2. **Select an event** from the event queue.
3. **Select an applicable plan** — trigger matches and guard holds.
4. **Create or update an intention** with the plan body.
5. **Execute** the next step of the selected intention.

**Step 2: Perceive.** Beliefs become $\{\mathsf{visible}(b1),\ \mathsf{block}(b1)\}$ (assume `block(b1)` known). No new percepts.

**Step 3: Select the event.** The `start` event is taken from the queue and its plan adds the goal `pickup(b1)`, generating the goal-addition event `+!pickup(b1)`.

**Step 4: Select a plan.** The trigger `+!pickup(B)` unifies with $B = b1$. Guard: `B block(b1)` ✓ and `B visible(b1)` ✓. The plan is **applicable** and selected.

**Step 5: Create the intention.** A new intention is pushed with body
$$\langle \mathsf{move\_to}(b1),\ \mathsf{grasp}(b1),\ +\mathsf{holding}(b1) \rangle.$$

**Step 6: Execute one step.** The first item, `move_to(b1)`, is executed. The remainder stays on the intention for subsequent cycles.

**Step 7: Note what the ordering guarantees.** Perception happens **before** plan selection, so guards are evaluated against **current** beliefs. Were selection first, an agent could commit to a plan whose guard had just been falsified. And because only **one step** executes per cycle, the agent stays responsive — it can react to new events between steps rather than blocking until a whole plan completes. That interleaving is the point of the cycle.

---

## E4. Diagnose a plan that never fires

An agent has belief `at(home)` and this plan, but it never runs. Find the defect.

```
+!go(X) : {B at(X)} <- move(X);
```

### Solution

**Step 1: Read the guard's meaning.** It requires the agent to **already believe** `at(X)` — to already be at the destination.

**Step 2: Trace the intended use.** The goal `go(shop)` unifies $X = \mathsf{shop}$, so the guard demands `B at(shop)`. But the agent believes `at(home)`, so the guard **fails** and the plan is not applicable.

**Step 3: Identify the logical error.** The guard states the **goal condition** rather than the **applicability condition**. It fires only when the goal is already achieved — precisely when moving is unnecessary. The plan is unreachable in every useful case.

**Step 4: Write the corrected plan.**

```
+!go(X) : {B location(X), ~B at(X)} <- move(X);
```

Requiring that $X$ is a known location and that the agent is **not** already there.

**Step 5: Note the `~B` operator.** `~B p` is "does not believe $p$" — negation as failure over the belief base, not classical negation. This is the closed-world assumption from week 5 appearing in the agent language: the agent concludes "not at $X$" from the *absence* of that belief.

**Step 6: State the general diagnostic.** When a plan never fires, check in order: does the **trigger** actually match the event type (a goal addition, not a belief addition)? Does the **guard** describe applicability rather than the goal? Are guard literals actually **belief queries** (`B`)? Do the variables **unify** as intended? Most such bugs are one of these four.

---

## E5. Events versus conditions

Explain the difference between an event and a condition in Gwendolen, and why `+!g : {B p}` behaves differently from a plan triggered by `+p`.

### Solution

**Step 1: Define an event.** A **discrete occurrence** — a belief being added or removed, or a goal being adopted. It happens at an instant and is consumed from the event queue. It is a **change**.

**Step 2: Define a condition.** A **standing query** over the current belief base, evaluated when a plan's guard is checked. It is a **state**, and it may be true for a long time or never.

**Step 3: Contrast the two plans.**
- `+!g : {B p} <- ...` is triggered by **adopting the goal** $g$, and checks $p$ at that moment. If $p$ is false when $g$ is adopted, the plan does not apply — and it will **not** spontaneously fire later merely because $p$ becomes true.
- `+p : {...} <- ...` is triggered by **$p$ becoming believed**. It fires on the transition, so it responds to change.

**Step 4: State the consequence of confusing them.** An agent needing to react *when* $p$ becomes true must trigger on `+p`. Writing the condition in a guard means the reaction is only considered when some *other* event occurs, so the agent appears to ignore the world.

**Step 5: Note the converse error.** Triggering on `+p` when you meant a standing requirement means the plan fires **once** at the transition and never again, even though $p$ continues to hold. If $p$ is re-perceived without having been dropped, no new event is generated.

**Step 6: State the rule of thumb.** *Triggers are for changes; guards are for states.* If the requirement is "whenever $p$ starts holding, do $X$", it belongs in the trigger. If it is "do $X$ only while $p$ holds", it belongs in the guard. Deciding which the specification demands is the modelling step, and it is what E4's bug got wrong.
