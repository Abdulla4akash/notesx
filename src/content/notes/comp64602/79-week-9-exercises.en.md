---
subject: COMP64602
chapter: 79
title: "Week 9 — Extra Exercises"
language: en
---

# Week 9 — Multi-Agent Planning and POCL: Extra Exercise Set

A second layer on top of chapter 59, focused on the POCL plan tuple, detecting and repairing the two flaw types, and extending to parallel and multi-agent plans.

## Exercise types

1. **Plan tuple construction** — write a POCL plan formally.
2. **Open precondition detection and repair.**
3. **Causal link conflict (threat) detection**, with promotion and demotion.
4. **Parallel plan legality** — check step conflicts.
5. **Multi-agent allocation** — assign steps and adjust links.

---

# Section A — POCL plans and flaws

## E1. Write a POCL plan tuple

Define the components of a POCL plan, then write the tuple for the two-step Blocks World plan achieving $\mathsf{on}(A,B)$ from a table start.

### Solution

**Step 1: State the components.** A POCL plan is a tuple
$$P = \langle S,\ \prec,\ L \rangle$$
where $S$ is a set of **steps** (partially instantiated actions, including dummy $s_0$ *init* and $s_\infty$ *goal*), $\prec$ is a **partial order** on steps, and $L$ is a set of **causal links**.

**Step 2: Define a causal link.** Written
$$s_i \xrightarrow{\ p\ } s_j$$
meaning step $s_i$ produces literal $p$, which step $s_j$ requires as a precondition. The link **records the reason** $s_i$ is in the plan.

**Step 3: Fix the steps.**
$$S = \{s_0,\ s_1 = \mathsf{pickup}(A),\ s_2 = \mathsf{stack}(A,B),\ s_\infty\}$$

**Step 4: Fix the ordering.** Only the necessary constraints:
$$\prec = \{s_0 \prec s_1,\ s_1 \prec s_2,\ s_2 \prec s_\infty\}$$
(plus what follows by transitivity).

**Step 5: Fix the causal links.**
$L$ contains six links — three supporting $s_1$, two supporting $s_2$, one supporting the goal:

- $s_0 \xrightarrow{\ \mathsf{onTable}(A)\ } s_1$
- $s_0 \xrightarrow{\ \mathsf{clear}(A)\ } s_1$
- $s_0 \xrightarrow{\ \mathsf{handEmpty}\ } s_1$
- $s_1 \xrightarrow{\ \mathsf{holding}(A)\ } s_2$
- $s_0 \xrightarrow{\ \mathsf{clear}(B)\ } s_2$
- $s_2 \xrightarrow{\ \mathsf{on}(A,B)\ } s_\infty$

**Step 6: Note why partial order matters.** A total-order planner would commit to a full sequence. POCL commits only to orderings it can **justify**, which is what allows steps to be executed in parallel or distributed across agents later (Sections B and C). This is **least commitment**.

---

## E2. Detect and repair an open precondition

A partial plan has $S = \{s_0, s_2 = \mathsf{stack}(A,B), s_\infty\}$ with the link $s_2 \xrightarrow{\mathsf{on}(A,B)} s_\infty$. Identify the flaws and repair one.

### Solution

**Step 1: State the flaw type.** An **open precondition** is a precondition of some step in the plan with **no causal link** supplying it.

**Step 2: List $s_2$'s preconditions.** `stack(A,B)` requires $\mathsf{holding}(A)$ and $\mathsf{clear}(B)$.

**Step 3: Check for supporting links.** Neither has an incoming causal link, so both are open. **Two flaws.**

**Step 4: Repair $\mathsf{clear}(B)$.** Look for an existing step, or $s_0$, that provides it. If $\mathsf{clear}(B)$ holds initially, add
$$s_0 \xrightarrow{\ \mathsf{clear}(B)\ } s_2$$
with the ordering $s_0 \prec s_2$ (already implied, since $s_0$ precedes everything).

**Step 5: Repair $\mathsf{holding}(A)$.** No existing step provides it, so **add a new step** $s_1 = \mathsf{pickup}(A)$ with the link
$$s_1 \xrightarrow{\ \mathsf{holding}(A)\ } s_2$$
and ordering $s_1 \prec s_2$.

**Step 6: Note the consequence.** Adding $s_1$ introduces **its own** preconditions ($\mathsf{onTable}(A)$, $\mathsf{clear}(A)$, $\mathsf{handEmpty}$), each now an open precondition. Repairing one flaw creates others; POCL planning is the loop *while flaws remain, pick one and repair it*.

**Step 7: State the termination condition.** A plan is a **solution** when it has no open preconditions **and** no causal-link conflicts. Both flaw types must be cleared.

---

## E3. Detect a threat and repair by promotion or demotion

A plan contains the link $s_1 \xrightarrow{\mathsf{clear}(B)} s_2$ and a step $s_3$ whose effects include $\neg\mathsf{clear}(B)$, with $s_3$ unordered relative to $s_1$ and $s_2$. Identify the flaw and give both repairs.

### Solution

**Step 1: State the flaw type.** A **causal-link conflict** (threat): a step whose effect **deletes** the literal protected by a causal link, and which could execute **between** the link's producer and consumer.

**Step 2: Verify all three conditions.**
- The link protects $\mathsf{clear}(B)$ from $s_1$ to $s_2$ ✓
- $s_3$ has effect $\neg\mathsf{clear}(B)$, deleting it ✓
- $s_3$ is unordered w.r.t. $s_1$ and $s_2$, so **some** linearisation places it in between ✓

So $s_3$ **threatens** the link.

**Step 3: Explain the danger.** In a linearisation where $s_1 \prec s_3 \prec s_2$, the literal $s_2$ depends on is destroyed before $s_2$ runs, so $s_2$'s precondition fails and the plan is invalid. Because POCL plans stand for **all** linearisations, one bad linearisation makes the plan unsound.

**Step 4: Repair 1 — promotion.** Order the threat **after** the consumer:
$$s_2 \prec s_3$$
Then $s_3$ cannot fall between $s_1$ and $s_2$; by the time it deletes $\mathsf{clear}(B)$, $s_2$ has already consumed it.

**Step 5: Repair 2 — demotion.** Order the threat **before** the producer:
$$s_3 \prec s_1$$
Then $s_1$ re-establishes $\mathsf{clear}(B)$ after $s_3$ destroys it, so the link is safe.

**Step 6: Note the mnemonic and the caveat.** *Promotion pushes the threat later; demotion pushes it earlier.* Either may be **inconsistent** with existing ordering constraints — if the plan already requires $s_3 \prec s_2$, promotion would create a cycle in $\prec$ and must be rejected. If **neither** repair is consistent, the partial plan is a dead end and the planner must backtrack.

**Step 7: Note the third option.** In some formulations **separation** is also available: add a variable-binding constraint making the threatening effect refer to a different object (e.g. force $s_3$'s block $\neq B$), removing the conflict without ordering.

---

# Section B — Parallel and multi-agent plans

## E4. Check parallel step legality

A parallel POCL plan groups steps into ordered sets executed simultaneously. Given the step group $\{\mathsf{pickup}(A),\ \mathsf{pickup}(B)\}$ in Blocks World with one gripper, decide legality.

### Solution

**Step 1: State the legality condition.** Steps in one parallel group must be **non-conflicting**: no step may delete a precondition or an effect required by another in the same group, and their preconditions must be jointly satisfiable in the state where the group executes.

**Step 2: List each action's requirements.** Both `pickup(A)` and `pickup(B)` require $\mathsf{handEmpty}$.

**Step 3: List each action's effects.** Both delete $\mathsf{handEmpty}$ and add $\mathsf{holding}(\cdot)$.

**Step 4: Detect the conflict.** Each deletes $\mathsf{handEmpty}$, which the **other** requires. So whichever executes first invalidates its partner's precondition — a mutual conflict.

**Step 5: Conclude.** The group is **illegal**. The two steps must be **sequentialised**, adding an ordering constraint between them.

**Step 6: Note what the model captures.** The conflict encodes a genuine **resource constraint** — one gripper. Parallelism is limited by shared resources, and representing the resource as a fluent ($\mathsf{handEmpty}$) makes the limit fall out of the ordinary conflict check rather than needing special machinery.

**Step 7: Give a legal contrast.** With **two** grippers, modelled as $\mathsf{handEmpty}(h_1)$ and $\mathsf{handEmpty}(h_2)$, the group $\{\mathsf{pickup}(A, h_1),\ \mathsf{pickup}(B, h_2)\}$ has disjoint preconditions and effects and is **legal** — genuinely parallel.

---

## E5. Multi-agent allocation and redundant steps

Extend a parallel POCL plan to two agents. Explain what changes in the plan tuple, then explain how a redundant step is detected and what must be adjusted on removal.

### Solution

**Step 1: State the tuple extension.** A multi-agent parallel POCL plan adds an **allocation** mapping each non-dummy step to an executing agent:
$$P = \langle S,\ \prec,\ L,\ \alpha \rangle, \qquad \alpha : S \to \mathit{Agents}.$$

**Step 2: State the extra legality requirement.** Beyond the parallel conditions of E4, steps allocated to the **same** agent in the same parallel group must be executable by that agent simultaneously — usually impossible, so one agent gets at most one step per group. Steps in a group allocated to **different** agents remain subject to the shared-resource checks.

**Step 3: Note what parallelism now buys.** With one gripper per agent, $\{\mathsf{pickup}(A) \mapsto \mathit{ag}_1,\ \mathsf{pickup}(B) \mapsto \mathit{ag}_2\}$ becomes legal, because the resource is per-agent. Multi-agent plans shorten the plan's **depth** (number of groups) without shortening its step count.

**Step 4: Define redundancy.** A step is **redundant** if removing it leaves a valid plan — typically because its effects are no longer needed: nothing depends on it via a causal link, or another step already supplies everything it supplied.

**Step 5: Give the detection test.** Step $s$ is redundant if every causal link $s \xrightarrow{p} s_j$ can be **replaced** by a link from another step already ordered before $s_j$ that also produces $p$ — or if $s$ has no outgoing links at all.

**Step 6: State the adjustments on removal.** Removing $s$ requires:
- **Delete** all causal links with $s$ as producer or consumer.
- **Re-source** each dependent precondition to an alternative producer, adding the corresponding link and any ordering constraint needed.
- **Remove** ordering constraints mentioning $s$, taking care to preserve constraints that were only implied **transitively through** $s$ — if $s_a \prec s \prec s_b$ was the only reason $s_a \prec s_b$ held, and that ordering is still required, add it explicitly.
- **Re-check** for threats, since removing a step changes which linearisations are possible and may expose a previously blocked conflict.

**Step 7: State why redundancy arises at all.** Plans are built by repairing flaws one at a time (E2), so a step added to satisfy one precondition may later be made unnecessary by another step added for a different reason. Least-commitment planning trades some redundancy for flexibility, and a post-processing pass removes it.
