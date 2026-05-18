---
subject: COMP64602
chapter: 9
title: "Week 9"
language: en
---

# Structured study notes — COMP64602 Multi-Agent Planning / POCL

**Topic and scope:** These lectures cover multi-agent planning through partial-order causal-link planning: first the motivation and planning approaches, then single-agent POCL, parallel POCL, multi-agent parallel POCL, and finally worked Blocks World examples showing causal-link adjustment and redundant-step removal. This fits into the broader planning material by moving from fully ordered plans to partial-order plans that can later be linearised and, in the multi-agent case, merged across agents.

**Course:** COMP64602  
**Lecture topic:** Multi-Agent Planning; Partial Order Causal-Link Planning; Parallel and Multi-Agent POCL Plans; Multi-Agent Planning Examples  
**Sources used:** uploaded lecture slides and matching transcripts for:

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

### 1.1 Definition and motivation

**Intuition:** Multi-agent planning is planning where more than one agent is involved. The minimum extra feature this gives is the ability to execute more than one action at once, because there is more than one agent or effector available.

**Core issue:** Once multiple agents act, their plans can interfere with one another.

Example from the transcript:

- One agent plans to move an object to one place.
- Another agent plans to move the same object somewhere else.
- Without coordination, the agents may “fight over” the object, or one may move it before the other tries to use it.

So multi-agent planning is not just “more actions”; it also requires reasoning about interaction, interference, communication, uncertainty, and replanning.

---

## 2. Approaches to multi-agent planning

### 2.1 Centralised planning

**Definition / intuition:** A centralised planner knows what every agent can do, constructs a plan for each agent, then communicates each plan to the corresponding agent.

**Advantages:**

- Avoids individual agents’ plans interfering with one another.
- The central planner can plan over the interactions between agents before execution begins.

**Disadvantages:**

- Computationally expensive, because the planner must consider all agents and all possible interactions between their actions.
- Harder to handle uncertainty and plan failure.
- If an individual agent encounters a problem, it has to communicate that issue to the central planner, which then has to decide what to do.

### 2.2 Centralised planning with hierarchical planning / goal decomposition

**Definition / intuition:** The central planner works at a high level, using a hierarchical planning framework or basic goal decomposition. It communicates high-level plans or goals to agents, and the agents fill in lower-level details locally.

**Advantages:**

- Minimises risk that low-level plans will interfere, because high-level coordination has already happened.
- Gives agents some ability to fix plans locally.

**Disadvantages:**

- Lower-level plans can still interfere in ways not anticipated by the high-level planner.

### 2.3 No centralised planner: local plans, conflicts resolved as they arise

**Definition / intuition:** Each agent forms a local plan for its own goals and resolves conflicts only when they arise during execution.

**Advantages:**

- Minimal need for additional infrastructure.
- Minimal communication overhead.
- Agents can use the same kind of single-agent planning methods covered earlier.

**Disadvantages:**

- High risk of interference between agents’ plans.
- Requires reasoning under uncertainty and replanning when interference happens.

### 2.4 No centralised planner: local plans plus communication / negotiation

**Definition / intuition:** Each agent forms a local plan, but the agents communicate to agree on a joint plan.

**Advantages:**

- Reduces risk of interference.

**Disadvantages:**

- Requires negotiation or communication protocol infrastructure.
- Can take significant time to converge on an agreed plan.

### 2.5 Approach used in these lectures

The lectures focus on the version where agents form local **partial-order plans**, then those plans may be communicated to a central component which merges them into a global plan. The specific framework is **partial order planning**, then **partial order causal-link planning**, then **parallel and multi-agent POCL planning**.

---

## 3. Partial order planning

### 3.1 Core idea

**Intuition:** A partial-order plan records only the ordering constraints needed for the plan to work. It does not impose an arbitrary total order on actions that could happen in either order.

For example:

- If action $a_1$ must happen before action $a_2$, the partial-order plan records $a_1 \prec a_2$.
- If two actions can happen in either order, the partial-order plan leaves them unordered.
- Later, the partial-order plan is **linearised** into a fully ordered plan of the sort seen in earlier material.

### 3.2 Sequence of topics in this part of the course

The lecture sequence is:

1. **Partial Order Causal-Link Planning**  
   Simple partial-order planning for a single agent. This is not much different from the previous week’s material except that it is a new way to find a plan.

2. **Parallel Partial Order Causal-Link Planning**  
   Allows actions to occur in parallel. This could be used by a centralised planner.

3. **Multi-agent Parallel Partial Order Causal-Link Planning**  
   Allows individual agents to create partial plans which a centralised planner then merges.

4. **Examples**  
   Worked examples of merging and simplifying multi-agent plans.

---

## 4. Not covered: POMDPs

### 4.1 What POMDPs are

The lecture explicitly says POMDPs are **not covered** in this unit, but they are important in multi-agent planning and planning with uncertainty.

**POMDP** = **Partially Observable Markov Decision Process**.

**Intuition from the lecture:**

- POMDPs model planning problems with partial and probabilistic information.
- They model possible action outcomes and probabilities.
- They model uncertainty in observations about the state of the world.
- A solution gives a **policy**, not a fixed plan.

### 4.2 Policy vs plan

**Plan:** “Do action 1, then action 2, then action 3.”

**Policy:** “Given the current state, or probable current state, here is what to do.”

So if the agent takes an action and does not end up in the expected state, a policy can still say what to do next.

### 4.3 Connection to other courses

The lecture connects POMDP-solving techniques to reinforcement learning, which is covered in another unit.

---

# Part I — Partial Order Causal-Link Planning

## 5. POCL: high-level idea

**POCL** stands for **Partial Order Causal Link** planning. The lecture uses Blocks World examples.

A POCL plan represents:

- **Plan steps**: instantiated actions, e.g. `stack(A, B)`.
- **Causal links**: which step establishes a condition needed by another step.
- **Temporal orderings**: which steps must happen before others, usually to prevent interference.
- **Special init and goal steps**.
- **Consistency flaws**, which are repaired while building the plan.

### 5.1 Plan steps

A plan step is an instantiated action.

Example:

```text
stack(A,B)
```

means the specific action of stacking block $A$ on block $B$.

### 5.2 Causal links

**Intuition:** A causal link says that one step establishes a condition that another step needs.

Example:

- If step $s_i = stack(A,B)$ makes $on(A,B)$ true,
- and step $s_j$ needs $on(A,B)$ as a precondition,
- then there is a causal link from $s_i$ to $s_j$ labelled $on(A,B)$.

Written:

$$
\langle s_i, s_j, on(A,B) \rangle
$$

This means:

$$
s_i \text{ establishes } on(A,B) \text{ for } s_j.
$$

### 5.3 Temporal orderings

**Intuition:** A temporal ordering says one step must happen before another.

Written:

$$
s_i \prec_T s_j
$$

or as a tuple:

$$
\langle s_i, s_j \rangle \in \prec_T
$$

This is often used to prevent two actions from interfering.

### 5.4 Init and goal steps

The plan begins with special steps:

- $s_{init}$: represents the initial state.
- $s_{goal}$: represents the desired goal state.

The initial state is represented by the **postconditions** of the init step:

$$
post(s_{init}) = \text{initial state}
$$

The goal state is represented by the **preconditions** of the goal step:

$$
pre(s_{goal}) = \text{goal state}
$$

---

## 6. Formal definition of a POCL plan

### 6.1 Formal definition

**[EXAM FLAG]** The slide explicitly says this technical definition “will be on formula sheet in the exam.”

A **Partial Order Causal Link plan** is a tuple:

$$
\langle S, \prec_T, \prec_C \rangle
$$

where:

- $S$ is a set of plan steps, i.e. instantiated actions.
- $\prec_T$ is the temporal partial order over steps in $S$.
- $\prec_C$ is the causal-link partial order over steps in $S$.

An element of the temporal ordering is:

$$
e \in \prec_T
$$

where:

$$
e = \langle s_i, s_j \rangle
$$

with:

$$
s_i, s_j \in S
$$

meaning:

$$
s_i \prec_T s_j
$$

An element of the causal-link ordering is:

$$
e \in \prec_C
$$

where:

$$
e = \langle s_i, s_j, c \rangle
$$

with:

$$
s_i, s_j \in S
$$

and $c$ is a condition.

This means:

$$
s_i \text{ establishes condition } c \text{ for } s_j.
$$

The plan models:

$$
post(init) = \text{initial state}
$$

and:

$$
pre(goal) = \text{goal state}
$$

---

## 7. Consistency flaw 1: open preconditions

### 7.1 Definition

**Intuition:** A step has an open precondition when it needs some condition $c$, but nothing in the plan has yet been linked to provide $c$.

### 7.2 Formal definition

An **open precondition** exists when some step $s_j$ has a precondition $c$, and there is no causal-link tuple:

$$
\langle s_i, s_j, c \rangle \in \prec_C
$$

for any suitable $s_i$.

In words:

$$
s_j \text{ needs } c,\quad \text{but no step has been selected to establish } c.
$$

### 7.3 Repairing an open precondition

To repair the flaw:

1. Choose a step $s_i$ such that:

$$
c \in post(s_i)
$$

2. Add the causal link:

$$
\langle s_i, s_j, c \rangle
$$

to:

$$
\prec_C
$$

The chosen $s_i$ can be:

- a step already in the plan, or
- a new step created by instantiating an action.

### 7.4 Search aspect

Open precondition flaws can be fixed in any order, but the way they are fixed may require search across possible supporting steps.

So the ordering of flaw selection is flexible, but choosing the right repair can matter.

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

The init step has empty preconditions and the initial state as its postconditions.

The goal step has empty postconditions and the goal state as its preconditions.

### 8.2 Initial plan structure

The plan begins with:

$$
s_{init}
$$

and:

$$
s_{goal}
$$

with all goal conditions initially open:

$$
ontable(C),\ ontable(D),\ on(B,C),\ on(A,D),\ clear(A),\ clear(B),\ handempty
$$

The slides show these goal preconditions circled to indicate that they need repair.

---

## 9. Repairing open preconditions in the example

### 9.1 Repairing $ontable(D)$

The goal needs:

$$
ontable(D)
$$

The initial state already contains:

$$
ontable(D)
$$

So add the causal link:

$$
\langle s_{init}, s_{goal}, ontable(D) \rangle
$$

This directly repairs the open precondition using the init step.

### 9.2 Repairing $on(B,C)$

The goal needs:

$$
on(B,C)
$$

The plan instantiates:

$$
s_1 = stack(B,C)
$$

Preconditions of $s_1$:

$$
clear(C),\ holding(B)
$$

Postconditions of $s_1$:

$$
on(B,C),\ not\ clear(C),\ not\ holding(B),\ handempty
$$

Since $s_1$ establishes $on(B,C)$, add:

$$
\langle s_1, s_{goal}, on(B,C) \rangle
$$

This repairs the goal precondition $on(B,C)$, but creates new open preconditions for $s_1$:

$$
clear(C),\ holding(B)
$$

### 9.3 Repairing $ontable(C)$

The goal needs:

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

For $s_2 = unstack(C,A)$:

Preconditions:

$$
clear(C),\ on(C,A)
$$

Postconditions:

$$
not\ clear(C),\ not\ on(C,A),\ holding(C)
$$

For $s_3 = putdown(C)$:

Precondition:

$$
holding(C)
$$

Postconditions:

$$
ontable(C),\ clear(C),\ not\ holding(C),\ handempty
$$

Causal links added:

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

**Intuition:** A causal link conflict occurs when one step $s_i$ establishes a condition $c$ for another step $s_j$, but some third step $s_k$ could occur between them and negate $c$.

### 10.2 Formal shape

Given a causal link:

$$
\langle s_i, s_j, c \rangle \in \prec_C
$$

a conflict exists if there is another step $s_k$ such that, in some possible linearisation of the plan:

$$
s_i \prec s_k \prec s_j
$$

and $s_k$ would negate $c$.

In Blocks World notation, this means something like:

$$
c \in post(s_i)
$$

but:

$$
not\ c \in post(s_k)
$$

so if $s_k$ happens between $s_i$ and $s_j$, the condition $c$ no longer holds when $s_j$ needs it.

### 10.3 Repairing a causal link conflict

Repair by adding a temporal ordering so $s_k$ cannot occur between $s_i$ and $s_j$.

Either force $s_k$ before $s_i$:

$$
\langle s_k, s_i \rangle \in \prec_T
$$

or force $s_k$ after $s_j$:

$$
\langle s_j, s_k \rangle \in \prec_T
$$

In words:

- put the threatening step before the causal link begins, or
- put it after the causal link has finished being used.

### 10.4 Causal link conflict in the worked example

The plan has a causal link:

$$
\langle s_{init}, s_2, clear(C) \rangle
$$

This says the init step provides $clear(C)$ for:

$$
s_2 = unstack(C,A)
$$

But:

$$
s_1 = stack(B,C)
$$

has the postcondition:

$$
not\ clear(C)
$$

So if $s_1$ happens between $s_{init}$ and $s_2$, then $C$ will no longer be clear, and $s_2$ cannot unstack $C$ from $A$.

The conflict is repaired by adding the temporal ordering:

$$
s_2 \prec_T s_1
$$

The transcript notes that the alternative, putting $s_1$ before $s_{init}$, is impossible because nothing occurs before the init step.

---

## 11. POCL plan tuple for the worked example

The slide gives the plan shown as the tuple:

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

The transcript notes that there are still more preconditions to be solved; this tuple represents the plan fragment shown in the slides, not necessarily a completely solved final plan.

---

# Part II — Parallel POCL Plans

## 12. Motivation for parallel plans

**Intuition:** A parallel plan allows multiple actions to happen at once. This can happen because:

- multiple agents act at the same time, or
- one agent has multiple effectors, e.g. a robot with two arms.

A centralised planner can coordinate these actions by constructing a parallel plan.

The approach used for ordinary partial plans can also be used for parallel plans. The difference is that the plan may specify:

- actions that **must** happen at the same time, or
- actions that **must not** happen at the same time.

---

## 13. Formal definition of a parallel POCL plan

### 13.1 Definition

**[EXAM FLAG]** The slide says the parallel POCL plan definition “will be on formula sheet in the exam.”

A **parallel POCL plan** is a tuple:

$$
\langle S, \prec_T, \prec_C, \#, = \rangle
$$

where:

$$
\langle S, \prec_T, \prec_C \rangle
$$

is the embedded POCL plan.

The two new relations are:

$$
\#
$$

and:

$$
=
$$

### 13.2 Non-concurrency relation $\#$

$\#$ is a symmetric **non-concurrency** relation.

**Meaning:** steps related by $\#$ must not occur at the same time.

If:

$$
\langle s_i, s_j \rangle \in \#
$$

then:

$$
s_i \text{ and } s_j \text{ cannot be concurrent.}
$$

### 13.3 Concurrency relation $=$

$=$ is a symmetric **concurrency** relation.

**Meaning:** steps related by $=$ must occur at the same time.

If:

$$
\langle s_i, s_j \rangle \in =
$$

then:

$$
s_i \text{ and } s_j \text{ must be concurrent.}
$$

### 13.4 When $\#$ and $=$ are filled in

The transcript says these may not be filled in during planning. They might be filled in during final linearisation, when deciding which steps can occur simultaneously.

The transcript also gives a domain-specific example:

- A robot arm with a screwdriver and another with a spanner may do some actions simultaneously.
- But two actions that require the same constrained resource may not be possible at the same time.
- These domain-specific restrictions can be represented using $\#$.

---

## 14. Parallel step conflicts

### 14.1 Definition

A **parallel step conflict** exists in a parallel plan when there are steps $s_i$ and $s_j$ such that:

$$
post(s_i)
$$

is inconsistent with:

$$
post(s_j)
$$

and neither step is temporally ordered before the other, and they are not already marked non-concurrent.

### 14.2 Formal conditions

A parallel step conflict exists when:

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

So the two steps are:

- not ordered,
- not explicitly forbidden from occurring together,
- but would have inconsistent simultaneous effects.

### 14.3 Repairing parallel step conflicts

Parallel step conflicts can always be solved by making the steps non-concurrent. The slides state that fixing these conflicts can be left until a candidate solution plan has been chosen.

In the transcript, this is described as doing some sequencing or adding an ordering so the conflicting steps no longer occur together.

---

# Part III — Multi-agent Parallel POCL Plans

## 15. Basic idea

Multi-agent parallel POCL plans extend parallel POCL plans by assigning plan steps to agents.

The key setting is:

1. Several agents each have their own goals.
2. Each agent constructs a POCL plan for its own goals.
3. The individual POCL plans are combined.
4. Conflicts are removed.
5. The result is a multi-agent plan.

The transcript emphasises that when each agent sends its plan, all the steps in that plan are already assigned to that agent.

---

## 16. Formal definition of a multi-agent parallel POCL plan

A **multi-agent parallel POCL plan** is a tuple:

$$
M = \langle A, S, \prec_T, \prec_C, \#, =, X \rangle
$$

where:

$$
\langle S, \prec_T, \prec_C, \#, = \rangle
$$

is the embedded parallel POCL plan.

The additional components are:

- $A$: the set of agents.
- $X$: a set of step-assignment tuples.

A tuple in $X$ has the form:

$$
\langle s, a \rangle
$$

meaning:

$$
\text{agent } a \in A \text{ is assigned to execute step } s.
$$

The plan models the agents’ initial states using init steps:

$$
init_i \in S
$$

and the agents’ goals using goal steps:

$$
goal_i \in S
$$

The preconditions of the goal steps represent the conjunctive goals the plan achieves, and the postconditions of the init steps represent features of the agents’ initial states before actions are taken.

---

## 17. Redundant plan steps

### 17.1 Intuition

A plan step is redundant if everything it contributes through causal links can be contributed by other steps instead.

In multi-agent planning, this matters because two agents may independently plan to do similar or overlapping actions. After merging their plans, one action may become unnecessary.

### 17.2 Formal definition

A plan step $s$ is **redundant** in a multi-agent parallel POCL plan $M$ with steps $S$ when there exists a set of replacing steps $R$, where:

$$
R \subseteq S
$$

such that for every causal link of the form:

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

In words:

For every condition $c$ that $s$ provides to another step, some replacement step can also provide $c$.

---

## 18. Adjusting causal links

### 18.1 Intuition

Redundancy is discovered by adjusting causal links. Instead of having step $s_i$ provide a condition $c$ to $s_j$, another step $s_k$ may provide the same condition.

### 18.2 Formal definition

Given a causal link:

$$
l = \langle s_i, s_j, c \rangle
$$

we can adjust it by finding another step $s_k$ such that:

$$
c \in post(s_k)
$$

and:

$$
s_j \not\prec_T s_k
$$

Then change the causal link to:

$$
\langle s_k, s_j, c \rangle
$$

### 18.3 Why the temporal condition matters

The condition:

$$
s_j \not\prec_T s_k
$$

means the consumer step $s_j$ is not already forced to occur before the new provider $s_k$. If $s_j$ had to occur before $s_k$, then $s_k$ could not provide $c$ for $s_j$.

---

## 19. Total step cost

The **total step cost** measures the cost of a multi-agent parallel plan by aggregating the costs of the steps in the plan.

In the cases used in the lecture, the cost is simply the total number of steps in the plan.

The transcript notes that richer planning formalisms could assign different costs to different steps, but these lectures use unit step costs.

---

## 20. Multi-Agent Plan Coordination by Plan Modification

### 20.1 Status of this algorithm

**[EXAM FLAG]** The slide explicitly says this algorithm is **Not Examinable**.

**[EXAM FLAG]** The transcript says the lecturer does **not** expect students to remember and run this exact algorithm. What students are expected to understand is:

- whether a plan is a viable multi-agent parallel POCL plan,
- and whether something is an adjustment of a causal link.

### 20.2 Algorithm from the slide

**Input:** an inconsistent multi-agent parallel plan.  
**Output:** an optimal and consistent multi-agent parallel plan, or null plan.

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

### 20.3 What the algorithm is doing conceptually

The algorithm searches over possible causal-link adjustments.

At each point:

1. Pick a plan from the search queue.
2. Check whether it is better than the current solution.
3. Select a causal link.
4. Generate possible refinements by changing which step provides that causal link.
5. Remove steps that have become unnecessary.
6. Continue searching.
7. Repair parallel-step conflicts only at the end.

### 20.4 Important detail from the transcript

When generating refinements for a causal link, one refinement is that the causal link stays as it is. Other refinements correspond to other possible provider steps for the same condition.

---

# Part IV — Worked multi-agent planning examples

## 21. Common setup for the examples

The examples are in Blocks World. The lecturer simplifies the Blocks World operators by merging multi-step manipulation into single `move` actions.

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

The lecture says the purpose is to make the presentation less fussy. The preconditions and effects should still be worked out from the Blocks World meaning of the move.

**[EXAM FLAG / HIGH VALUE]** The transcript says students should be able to work out what the merged `move` actions are doing and figure out their preconditions and effects.

In the diagrams:

- Agent A’s actions are blue.
- Agent B’s actions are red.
- Solid arrows are causal links.
- Dotted arrows are temporal links.
- Green ovals mark potential parallel steps during linearisation.

---

# Example 1

## 22. Example 1: initial state and goals

### 22.1 Initial state

The initial world has two stacks:

$$
C \text{ on } B
$$

and:

$$
A \text{ on } D
$$

The slide diagram shows $C$ above $B$, and $A$ above $D$.

### 22.2 Goals

Agent A’s goal:

$$
on(a,c),\ clear(b)
$$

Agent B’s goal:

$$
on(b,d),\ ontable(c)
$$

---

## 23. Agent A’s POCL plan in Example 1

Agent A’s plan contains:

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

So Agent A first moves $C$ to the table, then moves $A$ onto $C$.

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

- The init step provides $clear(c)$ for moving $C$ to the table.
- The init step provides $clear(a)$ and $clear(c)$ for moving $A$ onto $C$.
- Moving $C$ to the table makes $B$ clear, satisfying $clear(b)$.
- Moving $A$ onto $C$ satisfies $on(a,c)$.

---

## 24. Agent B’s POCL plan in Example 1

Agent B’s plan contains:

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

Causal links shown on the slide:

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

- $move(a, table)$ is used to clear $D$, so that $B$ can be moved onto $D$.
- $move(c, table)$ establishes $ontable(c)$.
- $move(b,d)$ establishes $on(b,d)$.

**[UNCLEAR]** The slide lists both $(s^B_{init}, s^B_3, clear(d))$ and $(s^B_1, s^B_3, clear(d))$. But the diagram shows $A$ on $D$, so $D$ should not initially be clear. The intended causal support for $clear(d)$ appears to be $s^B_1 = move(a, table)$. Check the recording or lecturer notes for whether the init-to-$s^B_3$ causal link is a slide typo.

---

## 25. Combined initial multi-agent parallel POCL plan

The combined plan takes the steps from both agents.

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

Temporal ordering shown:

$$
\prec_T = \{(s^A_1, s^A_2)\}
$$

Causal links are the union of the individual agents’ causal links.

Assignment relation shown:

$$
\{
\langle s^A_1, A \rangle,
\langle s^A_2, A \rangle,
\langle s^B_1, B \rangle,
\langle s^B_2, B \rangle,
\langle s^B_3, B \rangle
\}
$$

This records which agent is responsible for each non-init, non-goal action step.

**[UNCLEAR]** The example slide labels this assignment set as $A = \{\cdots\}$, but the formal multi-agent POCL definition uses $A$ for the set of agents and $X$ for the step-assignment relation. The example is best read as giving the assignment relation $X$.

---

## 26. Example 1: causal-link adjustment and redundancy

### 26.1 First adjustment: use Agent A’s $move(c,table)$ to support Agent B’s $move(b,d)$

Originally, Agent B has:

$$
s^B_2 = move(c, table)
$$

This action can make $B$ clear by moving $C$ away from $B$. That supports:

$$
s^B_3 = move(b,d)
$$

But Agent A also has:

$$
s^A_1 = move(c, table)
$$

which also moves $C$ away from $B$, making $B$ clear.

So the causal link providing $clear(b)$ for $move(b,d)$ can be adjusted from Agent B’s $move(c,table)$ to Agent A’s $move(c,table)$.

After this adjustment, Agent B’s $move(c,table)$ is not yet redundant, because it still provides:

$$
ontable(c)
$$

for Agent B’s goal.

### 26.2 Second adjustment: use Agent A’s $move(c,table)$ to support Agent B’s $ontable(c)$

Agent B’s goal includes:

$$
ontable(c)
$$

Originally this was provided by:

$$
s^B_2 = move(c, table)
$$

But Agent A’s:

$$
s^A_1 = move(c, table)
$$

also establishes:

$$
ontable(c)
$$

So the causal link for $ontable(c)$ can be adjusted from $s^B_2$ to $s^A_1$.

Now $s^B_2$ has no remaining useful causal link. It is redundant and can be removed.

### 26.3 Result

The plan is simplified because Agent A’s action:

$$
move(c, table)
$$

also helps Agent B.

The original visible action steps were:

$$
move(c, table),\ move(a,c),\ move(a,table),\ move(c,table),\ move(b,d)
$$

After removing Agent B’s redundant $move(c,table)$, the visible action steps are:

$$
move(c, table),\ move(a,c),\ move(a,table),\ move(b,d)
$$

So the merged plan has fewer action steps.

---

## 27. Example 1: potential parallel steps after simplification

The lecture emphasises that identifying potential parallel steps is part of **linearisation**, not part of creating the partial-order causal-link plan itself.

The slide marks potential parallel steps with green ovals:

First potential parallel group:

$$
move(c, table)
$$

by Agent A, and:

$$
move(a, table)
$$

by Agent B.

Second potential parallel group:

$$
move(a,c)
$$

by Agent A, and:

$$
move(b,d)
$$

by Agent B.

So a possible linearised parallel execution is:

1. In parallel:

$$
move(c, table) \quad \text{and} \quad move(a, table)
$$

2. Then in parallel:

$$
move(a,c) \quad \text{and} \quad move(b,d)
$$

This achieves:

Agent A:

$$
on(a,c),\ clear(b)
$$

Agent B:

$$
on(b,d),\ ontable(c)
$$

**[UNCLEAR]** The transcript appears to say Agent B could also be moving $C$ to the table in parallel after the redundant $move(c,table)$ step has been removed. The slide’s green ovals show $move(c,table)$ with $move(a,table)$, and $move(a,c)$ with $move(b,d)$. The slide version is internally consistent with the redundancy removal.

---

# Example 2

## 28. Example 2: initial state and goals

### 28.1 Initial state

The initial state has:

$$
A \text{ on } B
$$

and:

$$
C \text{ on table},\quad D \text{ on table}
$$

The clear blocks are:

$$
clear(a),\ clear(c),\ clear(d)
$$

as shown on the slide diagram.

### 28.2 Goals

Agent A’s goal:

$$
clear(b),\ not\ clear(c)
$$

Agent B’s goal:

$$
ontable(a),\ on(d,c)
$$

---

## 29. Example 2: initial local plans

### 29.1 Agent A’s initial plan

Agent A chooses:

$$
move(a,c)
$$

This uses:

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

So Agent A’s initial plan uses $move(a,c)$ to achieve both its goal conditions.

### 29.2 Agent B’s initial plan

Agent B chooses:

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

The slide shows the causal structure:

- $clear(a)$ supports $move(a,table)$.
- $clear(c)$ and $clear(d)$ support $move(d,c)$.
- $move(a,table)$ establishes $ontable(a)$.
- $move(d,c)$ establishes $on(d,c)$.

---

## 30. Example 2: first causal-link adjustment

Agent A’s goal includes:

$$
not\ clear(c)
$$

Initially this is provided by:

$$
move(a,c)
$$

But Agent B’s:

$$
move(d,c)
$$

also makes:

$$
not\ clear(c)
$$

because putting $D$ on $C$ means $C$ is no longer clear.

So adjust the causal link for $not\ clear(c)$ away from Agent A’s $move(a,c)$ and toward Agent B’s $move(d,c)$.

After this adjustment, $move(a,c)$ is not yet redundant, because it still provides:

$$
clear(b)
$$

for Agent A’s goal.

---

## 31. Example 2: second causal-link adjustment

Agent A’s goal also includes:

$$
clear(b)
$$

Initially this is provided by:

$$
move(a,c)
$$

But Agent B’s:

$$
move(a, table)
$$

also moves $A$ off $B$, which makes:

$$
clear(b)
$$

So adjust the causal link for $clear(b)$ away from Agent A’s $move(a,c)$ and toward Agent B’s $move(a,table)$.

Now Agent A’s $move(a,c)$ no longer provides any needed causal link. It is redundant and can be removed.

---

## 32. Example 2: result after redundancy removal

After removing:

$$
move(a,c)
$$

the remaining useful action steps are:

$$
move(a, table)
$$

and:

$$
move(d,c)
$$

These achieve:

Agent A:

$$
clear(b),\ not\ clear(c)
$$

Agent B:

$$
ontable(a),\ on(d,c)
$$

The transcript notes that, at this point, the blue agent is not doing anything: Agent A can “watch” Agent B do everything.

---

## 33. Example 2: reassignment and parallelisation

The lecture then considers a possible efficiency improvement after planning:

- Reassign:

$$
move(a, table)
$$

to Agent A.

- Keep:

$$
move(d,c)
$$

with Agent B.

Then the two actions can potentially happen at the same time:

$$
move(a, table) \parallel move(d,c)
$$

The slide marks both actions inside a green oval as potential parallel steps.

The transcript explicitly says this reassignment is **not part of the planning mechanism** itself; it is something that might be done afterwards to make execution more efficient.

---

# Key concept index

## 34. Multi-agent planning

**Intuition:** Planning with multiple agents, allowing multiple actions to be executed in parallel because there is more than one agent or effector.

**Formal definition in lecture:** No formal tuple definition is given at the introduction stage.

---

## 35. Partial-order plan

**Intuition:** A plan that records only the orderings required for correctness. If two steps can occur in either order, the partial-order plan leaves them unordered.

**Important consequence:** Partial-order plans are later linearised into ordinary fully ordered plans.

---

## 36. POCL plan

**Intuition:** A partial-order plan plus explicit causal links showing which step supports which precondition of another step.

**Formal definition:**

$$
\langle S,\prec_T,\prec_C\rangle
$$

where $S$ is the set of steps, $\prec_T$ is the temporal ordering relation, and $\prec_C$ is the causal-link relation.

**[EXAM FLAG]** Definition is on the formula sheet.

---

## 37. Plan step

**Intuition:** A concrete instantiated action in a plan.

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

**Intuition:** Records that one step establishes a condition needed by another step.

**Formal shape:**

$$
\langle s_i, s_j, c \rangle
$$

meaning $s_i$ provides $c$ for $s_j$.

---

## 39. Temporal ordering

**Intuition:** Records that one step must happen before another.

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

**Intuition:** A condition required by a step but not yet supported by a causal link.

**Formal definition:**

Step $s_j$ has precondition $c$, but there is no:

$$
\langle s_i, s_j, c \rangle \in \prec_C
$$

**Repair:**

Choose or instantiate $s_i$ such that:

$$
c \in post(s_i)
$$

and add:

$$
\langle s_i, s_j, c \rangle
$$

to $\prec_C$.

---

## 41. Causal link conflict

**Intuition:** A third step could occur between a provider and consumer and negate the condition being protected by the causal link.

**Repair:**

Add a temporal ordering to force the threatening step either before the provider or after the consumer.

---

## 42. Parallel POCL plan

**Intuition:** A POCL plan that can also represent concurrency and non-concurrency between steps.

**Formal definition:**

$$
\langle S,\prec_T,\prec_C,\#,=\rangle
$$

where $\#$ is symmetric non-concurrency and $=$ is symmetric concurrency.

**[EXAM FLAG]** Definition is on the formula sheet.

---

## 43. Parallel step conflict

**Intuition:** Two unordered steps might occur in parallel, but their postconditions are inconsistent.

**Formal shape:**

A conflict exists when:

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

**Repair:** Make the steps non-concurrent, usually by adding ordering or non-concurrency information.

---

## 44. Multi-agent parallel POCL plan

**Intuition:** A parallel POCL plan with step assignments to agents.

**Formal definition:**

$$
M = \langle A, S, \prec_T, \prec_C, \#, =, X \rangle
$$

where $A$ is the agent set and $X$ assigns steps to agents:

$$
\langle s,a \rangle \in X
$$

meaning agent $a$ executes step $s$.

---

## 45. Redundant step

**Intuition:** A step is redundant if all the causal links it provides can be supplied by other steps.

**Formal definition:**

Step $s$ is redundant when there exists $R \subseteq S$ such that for every causal link:

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

**Intuition:** Change which step provides a condition to another step.

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

**[EXAM FLAG]** The transcript says students should be able to identify when something is an adjustment of a causal link.

---

## 47. Total step cost

**Intuition:** The total cost of the plan’s steps.

In these lectures:

$$
\text{total step cost} = \text{number of steps}
$$

---

## 48. Linearisation

**Intuition:** Turning a partial-order plan into an executable ordered plan.

In the parallel setting, linearisation may also decide which unordered actions can be executed at the same time.

The examples show that identifying potential parallel steps happens during linearisation, not during the construction of the partial-order causal-link plan.

---

# Exam flags and high-value points

1. **[EXAM FLAG] POCL definition**  
   The technical definition of a POCL plan is marked as “will be on formula sheet in the exam.” Know how to use:

   $$
   \langle S,\prec_T,\prec_C\rangle
   $$

   and interpret temporal and causal-link tuples.

2. **[EXAM FLAG] Parallel POCL definition**  
   The technical definition of a parallel POCL plan is marked as “will be on formula sheet in the exam.” Know:

   $$
   \langle S,\prec_T,\prec_C,\#,=\rangle
   $$

   and the meanings of $\#$ and $=$.

3. **[EXAM FLAG] Algorithm not examinable**  
   The Multi-Agent Plan Coordination by Plan Modification algorithm is explicitly marked **Not Examinable**.

4. **[EXAM FLAG] What is expected instead of the algorithm**  
   The transcript says students should be able to:

   - say whether a plan is a viable multi-agent parallel POCL plan,
   - identify when something is an adjustment of a causal link.

5. **[EXAM FLAG / HIGH VALUE] Merged Blocks World operators**  
   In the examples, operators are merged into `move` actions. Students should still be able to infer the preconditions and effects.

6. **[HIGH VALUE] Causal-link adjustment drives redundancy removal**  
   The examples repeatedly show the key mechanism:

   - adjust causal links to alternative provider steps,
   - then remove a step if it no longer supports any causal links.

7. **[HIGH VALUE] Parallelisation is later than POCL construction**  
   Potential parallel steps are identified during linearisation or post-processing, not as the core causal-link adjustment process.

---

# Connections to earlier or other material

- **Connection to previous week’s planning material:** Partial-order plans are later linearised into the fully ordered kind of plan studied previously.
- **Connection from single-agent to multi-agent planning:** Single-agent POCL is extended to parallel POCL, then to multi-agent parallel POCL by adding step assignments to agents.
- **Connection to centralised planning:** Multi-agent parallel POCL can be used where individual agents create local partial plans and a centralised component merges them.
- **Connection to Blocks World:** All worked examples use Blocks World, with simplified merged `move` operators.
- **Connection to reinforcement learning:** POMDPs are not covered here, but the lecture notes that reinforcement learning is a major technique for solving them and is covered in another unit.

---

# Unclear sections to revisit in the recording

1. **[UNCLEAR] Auto-transcription of “POCL”**  
   The transcript repeatedly garbles “POCL” as things like “Pascal,” “class,” “coarsening,” or similar. These should be read as **Partial Order Causal Link** unless the context says otherwise.

2. **[UNCLEAR] Example 1 Agent B causal link for $clear(d)$**  
   The slide lists:

   $$
   (s^B_{init}, s^B_3, clear(d))
   $$

   even though the diagram has $A$ on $D$, so $D$ should not initially be clear. The slide also lists:

   $$
   (s^B_1, s^B_3, clear(d))
   $$

   which is consistent with $move(a,table)$ clearing $D$. This is likely a slide typo or transcription issue; check the audio.

3. **[UNCLEAR] Example 1 potential parallel steps in transcript**  
   The transcript appears to say Agent B could still be doing $move(c,table)$ in parallel after that step has been removed as redundant. The slide shows the potential parallel steps as:

   $$
   move(c,table) \parallel move(a,table)
   $$

   and:

   $$
   move(a,c) \parallel move(b,d)
   $$

   Check the recording if the exact spoken explanation matters.

4. **[UNCLEAR] Parallel step conflict formula typo**  
   The parsed slide text includes a likely typo in the temporal conditions. The intended condition is that neither:

   $$
   s_i \prec_T s_j
   $$

   nor:

   $$
   s_j \prec_T s_i
   $$

   holds.

5. **[UNCLEAR] Algorithm terminology: flagged steps vs flagged causal links**  
   The algorithm slide says “number of flagged steps,” but the transcript describes flagging causal links after considering them. Check whether “flagged steps” is shorthand or a slide/transcript inconsistency.

6. **[UNCLEAR] Cost of null solution in the algorithm**  
   The algorithm compares the total step cost of $M$ with the total step cost of `Solution`, but `Solution` is initialised to null. The convention for the cost of null is not stated in the lecture.

7. **[UNCLEAR] Assignment relation notation in Example 1**  
   The formal definition uses $A$ for the set of agents and $X$ for assignments. The example slide labels the assignment set with:

   $$
   A = \{\langle s,A\rangle,\ldots\}
   $$

   Treat this as the assignment relation $X$, but verify if notation is important for assessed work.
