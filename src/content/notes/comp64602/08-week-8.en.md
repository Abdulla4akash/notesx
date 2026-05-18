---
subject: COMP64602
chapter: 8
title: "Week 8"
language: en
---

# COMP64602 Planning — Structured Study Notes

**Topic and scope:** This set of lectures introduces AI planning: how an agent can construct a sequence of actions to reach a goal, how planning problems are represented in PDDL, how plans are found using forward/backward search, how heuristics reduce search, how hierarchical planning abstracts over detail, and how online planning/replanning handles uncertainty and change.

**Course:** COMP64602  
**Lecture topics covered:** PDDL; Forward and Backward Search; Planning Heuristics; Hierarchical Planning / HTNs; Online Planning.

**Source files used:**

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

## 1. Planning Problems and PDDL

### 1.1 What a planning problem is

**Intuition:** A planning problem is about an agent working out what to do before doing it. The agent has a goal, a starting state, and a set of actions it could take. The planning task is to choose a sequence of actions that gets from the starting state to the goal.

**Lecture definition:** A planning problem is one where an agent must decide upon a sequence of actions to achieve some goal.

### 1.2 Classical assumptions about planning

Classical planning assumes:

- The environment is completely known.
  - The agent knows what is in the environment and where it is.
- The environment does not change while the plan is being enacted.
  - No other agents unexpectedly move things or alter the world.
- Actions have deterministic effects.
  - If the agent does an action, the result is definite; there is no probabilistic uncertainty in the action outcome.

The lecturer notes that there is now interest in **uncertain** and **changeable** environments, but the early examples in these lectures use the classical assumptions.

### 1.3 Connection to earlier logic-based agents

The lecturer connects planning to earlier work on logic-based agents:

- Logic-based agents can solve planning-like problems.
- But in those earlier approaches, programmers supply plans of various kinds.
- The agent then chooses which supplied plan to enact.
- The planning material asks whether agents can generate plans themselves rather than relying on pre-written plans.

**Connection:** This lecture sequence moves from “programmer supplies plans” to “agent constructs plans.”

---

## 2. PDDL: Planning Domain Description Language

### 2.1 What PDDL is

**Intuition:** PDDL is a formal syntax for writing down planning problems so that a planner can solve them.

**Lecture definition:** The Planning Domain Description Language is a syntax for defining planning problems. The key concept is the **action schema**, which defines the preconditions and effects of actions. These action schemas can be chained together to produce plans.

The lecturer says Russell and Norvig adapt the PDDL syntax in the textbook, but this lecture uses the syntax that would be used with an actual PDDL planner.

### 2.2 Action schema

**Intuition:** An action schema is a template for an action. It says:

- what the action is called;
- what parameters it takes;
- what must already be true for the action to be applicable;
- what becomes true or false after the action is executed.

**Formal syntax from the lecture, cleaned from the slide example:**

```lisp
(:action move
 :parameters (?x ?y - waypoint)
 :precondition (and (at ?x))
 :effect (and
          (at ?y)
          (not (at ?x))))
```

Meaning:

- The action is called `move`.
- It has two parameters, `?x` and `?y`.
- Both parameters are of type `waypoint`.
- The precondition is `(at ?x)`: the robot must currently be at `?x`.
- The effects are:
  - add `(at ?y)`: the robot is now at `?y`;
  - delete `(at ?x)`: the robot is no longer at `?x`.

The lecturer emphasises that it is typical in planning to think of effects as facts that are **added** and facts that are **removed** by an action.

[UNCLEAR] The PDDL slide contains a duplicated `:parameters` line, including `(:action move :parameters (?x, ?y)` and then `:parameters (?x ?y - waypoint)`. The second line is the usable typed PDDL form used in the rest of the lecture.

### 2.3 Variables and constants

In PDDL syntax:

- Variables begin with a question mark, for example `?x`, `?y`.
- Actual objects do **not** begin with a question mark.
  - Example constants: `waypoint_a`, `waypoint_b`.

The lecturer explains that variables are substituted with actual objects when an action is applied.

### 2.4 Preconditions and applicability

An action is applicable when its preconditions can be matched to the current state.

For the `move` action:

```lisp
:precondition (and (at ?x))
```

This means the robot can move from `?x` only if the current state includes the fact that the robot is at `?x`.

### 2.5 Effects: added and removed facts

For the `move` action:

```lisp
:effect (and
         (at ?y)
         (not (at ?x)))
```

The positive effect `(at ?y)` is added to the state.

The negative effect `(not (at ?x))` removes `(at ?x)` from the state.

### 2.6 Closed world assumption

**Definition:** PDDL uses the **closed world assumption**: if a fact cannot be derived from the current state description, it is assumed to be false.

Example from the lecture:

- If the planner cannot derive `(at ?x)`, then it assumes `(at ?x)` is false.
- Therefore the `move` action only works when the agent already knows it is at the relevant location.

---

## 3. PDDL Files: Domain File and Problem File

### 3.1 Domain file

**Intuition:** The domain file says what kinds of things exist in this domain, what predicates are relevant, and what actions are available.

**Lecture definition:** A planning domain is defined by a set of predicates appearing in action schemas together with a set of action schemas.

Example domain from the lecture:

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

- `robot-patrol` is the domain name.
- `waypoint` is a type.
- `(at ?x)` is the predicate used in the domain.
- `move` is the available action.
- In this domain, the only action the robot can do is move.

### 3.2 Problem file

**Intuition:** The problem file gives a particular planning task inside a domain. It supplies the actual objects, the initial state, and the goal state.

Example problem from the lecture:

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

- Problem name: `to_b`.
- Domain used: `robot-patrol`.
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

and the action:

```lisp
(:action move
 :parameters (?x ?y - waypoint)
 :precondition (and (at ?x))
 :effect (and
          (at ?y)
          (not (at ?x))))
```

The obvious plan is:

```text
move(waypoint_a, waypoint_b)
```

Step-by-step:

1. Current state contains `(at waypoint_a)`.
2. Match `?x = waypoint_a`, `?y = waypoint_b`.
3. Precondition `(at ?x)` becomes `(at waypoint_a)`, which is true.
4. Apply the effects:
   - add `(at waypoint_b)`;
   - remove `(at waypoint_a)`.
5. The resulting state satisfies the goal `(at waypoint_b)`.

### 3.4 Tools mentioned for PDDL

The lecture mentions several ways to test PDDL planning problems:

- Online editor: `editor.planning.domains`
- Source code planner: PDDL4J
- VSCode PDDL plugin

These are presented as ways to test whether planning domains and problems have been constructed sensibly.

### 3.5 Exam flag

**EXAM FLAG:** The lecturer explicitly says that in the exam you are expected to be able to **read and construct simple PDDL planning domain descriptions**.

---

# 4. Forward and Backward Search for Planning

## 4.1 Forward search

### 4.1.1 Definition

**Intuition:** Forward search starts where the agent actually starts. It tries actions, moves forward through possible states, and keeps going until it reaches a goal state.

**Lecture definition:** In forward search, we start at the initial state of the planning problem and apply all applicable actions until we reach the goal state.

### 4.1.2 Applicability of actions

To determine whether an action is applicable:

- unify the current state with the action’s precondition;
- if the preconditions match the current state, the action can be applied.

The transcript explains that once an applicable action is selected, the planner updates the state according to the action’s effects:

- if an effect says something is true, add it to the state;
- if an effect says something is not true, remove it from the state.

### 4.1.3 Forward search algorithm, as given in the lecture

A clean version of the procedure described:

```text
ForwardSearch(initial_state, goal, actions):

1. Start with the initial state.
2. Check whether the current state satisfies the goal.
3. If not, find all actions whose preconditions unify with the current state.
4. For each applicable action:
   a. Apply the action notionally, not physically.
   b. Add positive effects to the state.
   c. Remove facts negated by the effects.
   d. Generate a successor state.
5. Search through successor states until a goal state is found.
6. Use breadth-first search, depth-first search, or a more sophisticated search method.
```

### 4.1.4 Breadth-first search vs depth-first search

The lecture gives the standard contrast.

**Breadth-first search:**

- Generate a set of options from the current state.
- Consider the outcome of each action in turn.
- Then consider all outcomes at the next level, and so on.
- If imagined as a tree, breadth-first search works level by level.
- It finds a plan with the fewest actions.
- It is more memory intensive.

**Depth-first search:**

- Generate options.
- Explore the first option.
- From that state, generate options again.
- Again explore the first option.
- Continue until reaching a loop or end state.
- Then backtrack to a previous state and try a different branch.

[UNCLEAR] The transcript says “breakfast search” and “depth research”; from the slides and context these are **breadth-first search** and **depth-first search**.

### 4.1.5 Why forward search can be large

Forward search can introduce a large state space because it may have many choices without yet knowing which choices help reach the goal.

Example from the lecture:

- In Blocks World, there may be many possible next blocks to pick up.
- There may also be many possible blocks to put a block down on.
- So the number of branches can grow quickly.

The lecturer later connects this to heuristics, which guide search towards promising branches.

---

## 4.2 Blocks World domain

The Forward/Backward Search lecture uses Blocks World as the main worked example. The world contains blocks `A`, `B`, and `C`.

Initial visual situation:

- `B` is on the table.
- `A` is on the table.
- `C` is on `A`.

The goal is a state where **B is between C and A**: that is, `A` is at the bottom, `B` is on `A`, and `C` is on `B`.

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

- You can pick up block `?x` if:
  - it is clear;
  - it is on the table;
  - the hand/gripper is empty.
- Effects:
  - `?x` is no longer on the table;
  - `?x` is no longer clear;
  - the hand is no longer empty;
  - the hand is holding `?x`.

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

- You can put down block `?x` if you are holding it.
- Effects:
  - you are no longer holding `?x`;
  - `?x` is clear;
  - the hand is empty;
  - `?x` is on the table.

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

- You can stack `?x` on `?y` if:
  - you are holding `?x`;
  - `?y` is clear.
- Effects:
  - you are no longer holding `?x`;
  - `?y` is no longer clear;
  - `?x` is clear;
  - the hand is empty;
  - `?x` is on `?y`.

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

- You can unstack `?x` from `?y` if:
  - `?x` is on `?y`;
  - `?x` is clear;
  - the hand is empty.
- Effects:
  - you are holding `?x`;
  - `?y` becomes clear;
  - `?x` is no longer clear;
  - the hand is no longer empty;
  - `?x` is no longer on `?y`.

[UNCLEAR] The transcript garbles part of the `unstack` effect and says “Y is not clear”; the slide action schema gives `(clear ?y)`, which is the version used here.

---

## 4.3 Worked example: forward search in Blocks World

### 4.3.1 Initial state

The initial state is:

```text
ontable(A), ontable(B), clear(B), on(C, A), clear(C), handempty
```

Visual meaning:

- `A` is on the table.
- `B` is on the table.
- `B` is clear.
- `C` is on `A`.
- `C` is clear.
- The hand is empty.

### 4.3.2 Goal state

The goal is for `B` to be between `C` and `A`.

The corresponding goal state used later in backward search is:

```text
ontable(A), on(B, A), on(C, B), clear(C), handempty
```

### 4.3.3 Applicable actions from the initial state

From the initial state, the lecture identifies two applicable actions:

```text
pick-up(B)
unstack(C, A)
```

Why `pick-up(B)` is applicable:

- `B` is clear.
- `B` is on the table.
- the hand is empty.

Why `unstack(C, A)` is applicable:

- `C` is on `A`.
- `C` is clear.
- the hand is empty.

### 4.3.4 Branch 1: apply `pick-up(B)`

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
- add `holding(B)`.

Resulting state, as given in the slides/transcript:

```text
ontable(A), holding(B), on(C, A), clear(C)
```

Available options from this state:

```text
put-down(B)
stack(B, C)
```

#### Option 1: `put-down(B)`

If the planner applies:

```text
put-down(B)
```

then it returns to the original state, because it has picked up `B` and then put it down again.

The lecturer describes this as a loop. In depth-first search, this branch stops and the planner backtracks.

#### Option 2: `stack(B, C)`

If the planner applies:

```text
stack(B, C)
```

then `B` is placed on `C`.

Resulting state from the slide/transcript:

```text
ontable(A), on(B, C), on(C, A), clear(B)
```

The only available option is then:

```text
unstack(B, C)
```

Applying `unstack(B, C)` reverses the previous stacking action and returns to an earlier state. This branch therefore also loops/backtracks.

[UNCLEAR] The slide state after `stack(B, C)` omits `handempty`, even though the `stack` action schema includes `handempty` as an effect. The lecture’s state listing is abbreviated.

### 4.3.5 Branch 2: apply `unstack(C, A)`

Action:

```text
unstack(C, A)
```

Effects:

- add `holding(C)`;
- add `clear(A)`;
- remove `clear(C)`;
- remove `handempty`;
- remove `on(C, A)`.

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

This stacks `C` back on `A`, returning to the initial configuration. The lecturer treats this as a loop.

#### Option: `put-down(C)`

This gives a state where all three blocks are on the table and clear:

```text
ontable(A), clear(A), ontable(B), clear(B), ontable(C), clear(C)
```

Available options from there:

```text
pick-up(A)
pick-up(B)
pick-up(C)
```

The lecture stops the detailed expansion here, because the point is to show how forward search repeatedly applies all possible actions and backtracks from loops or dead ends.

### 4.3.6 Important idea from the example

The human can see the intended plan direction quickly, but the uninformed forward search does not use that insight. It blindly explores branches such as:

```text
pick-up(B) → put-down(B)
pick-up(B) → stack(B, C) → unstack(B, C)
unstack(C, A) → stack(C, A)
```

These are legal action sequences but unhelpful for reaching the goal.

This motivates using heuristics later.

---

# 5. Backward Search for Planning

## 5.1 Definition

**Intuition:** Backward search starts from the goal and works backwards. Instead of asking “what can I do now?”, it asks “what action could have produced this state?”

**Lecture definition:** Backward search starts with the goal state and explores all actions that could lead to that state, until it reaches the initial state.

## 5.2 How backward search chooses actions

In forward search:

- unify the current state with an action’s **preconditions**.

In backward search:

- unify the current state with an action’s **postconditions/effects** to determine which actions could have led to that state.

Then calculate a previous state by reversing the action effects:

- add anything negated in the postcondition/effect;
- delete anything positive in the postcondition/effect.

The lecture says this can use either breadth-first or depth-first search.

### 5.3 Cost and efficiency

The lecture states:

- In theory, backward search should be as computationally expensive as forward search.
- In practice, backward search is often more efficient because the final state of the world is often more constrained than the initial state.

---

## 5.4 Worked example: backward search in Blocks World

### 5.4.1 Goal state

The goal state is:

```text
ontable(A), on(B, A), on(C, B), clear(C), handempty
```

This is the tower with `A` on the table, `B` on `A`, and `C` on `B`.

### 5.4.2 Identify the last action

The lecture says the only action that could have produced this final state is:

```text
stack(C, B)
```

Why:

- The final goal contains `on(C, B)`.
- `C` is clear.
- The hand is empty.
- Everything is in a single column.

### 5.4.3 Deriving the previous state before `stack(C, B)`

Use the `stack` action schema:

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

So the effects of `stack(C, B)` are:

```text
not holding(C)
not clear(B)
clear(C)
handempty
on(C, B)
```

Backward search reverses these:

| Effect in forward direction | Backward operation |
|---|---|
| `not holding(C)` | add `holding(C)` |
| `not clear(B)` | add `clear(B)` |
| `clear(C)` | delete `clear(C)` |
| `handempty` | delete `handempty` |
| `on(C, B)` | delete `on(C, B)` |

So the previous state is:

```text
ontable(A), on(B, A), clear(B), holding(C)
```

This matches the slide’s previous state.

### 5.4.4 Options before that previous state

From:

```text
ontable(A), on(B, A), clear(B), holding(C)
```

the lecture identifies two possible preceding actions:

```text
pick-up(C)
unstack(C, B)
```

These are actions that could have led to the agent holding `C`.

### 5.4.5 Explore the `pick-up(C)` branch

If the previous action was:

```text
pick-up(C)
```

then before that, `C` must have been on the table and clear, and the hand must have been empty.

The slide gives the previous state:

```text
ontable(A), on(B, A), clear(B), ontable(C), clear(C), handempty
```

Options from there include:

```text
stack(B, A)
put-down(C)
```

The backward search tree then continues to ask what could have happened before `stack(B, A)`:

```text
pick-up(B)
unstack(B, A)
unstack(B, C)
```

The lecturer leaves the continuation for the student to follow, because the point is to show the mechanics of backward search.

### 5.4.6 Backward search using variables

The lecturer gives a special reason backward search can sometimes reduce search: an object may appear in an action schema’s precondition but only negatively in its effects.

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

- `?x` is cargo.
- `?y` is a plane.
- `?z` is an airport.
- Preconditions:
  - cargo `?x` is in plane `?y`;
  - plane `?y` is at airport `?z`.
- Effects:
  - cargo `?x` is at airport `?z`;
  - cargo `?x` is no longer in plane `?y`.

Backward-search point:

- The plane variable `?y` appears in the precondition.
- In the effects, it appears only in the negative effect `(not (in ?x ?y))`.
- When working backward from the goal that cargo is at an airport, any plane could have brought the cargo.
- Therefore the planner can sometimes represent the previous state using a variable rather than enumerating every possible plane.
- This can reduce search by considering many options at once.
- The lecturer warns that it requires careful programming.

[UNCLEAR] The slide text for the negative effect appears as `(not (in (?x, ?y)))`; the surrounding syntax and transcript indicate the intended predicate is `(not (in ?x ?y))`.

---

# 6. Planning Heuristics

## 6.1 What a heuristic is

**Intuition:** A heuristic is a rule of thumb that helps guide search so the planner does not waste as much effort exploring unpromising branches.

The lecturer describes planning heuristics as rules of thumb that can usually make the search for a plan quicker.

## 6.2 Planning problems as graphs

The lecture says a planning problem can be viewed as a graph:

- each state is a vertex;
- each edge is an action;
- planning becomes a shortest path problem from the initial state to the goal state.

The lecturer also describes this as tree-like in the transcript, because search often expands states as a search tree.

## 6.3 Shortest path framing

A major class of graph algorithms are shortest path algorithms:

- find the shortest path through a graph between two vertices;
- in planning, the relevant vertices are the initial state and the goal state.

The lecture does not go into general shortest-path algorithms in detail.

## 6.4 A* and admissible heuristics

### 6.4.1 A* in the lecture

**IMPORTANT FLAG:** The lecturer calls A* a particularly important algorithm.

In the lecture’s simplified presentation:

- A* uses a heuristic `h`.
- `h` evaluates each state.
- Search explores the successors of the state with the lowest value according to `h`.

### 6.4.2 Admissibility

**Formal definition from the lecture:** In an A* algorithm, the heuristic must be **admissible**, meaning it **underestimates the distance to reach the goal state**.

**Intuition:** The heuristic is allowed to be optimistic, but not pessimistic. It can say the goal is closer than it really is, but it must not overestimate the remaining distance.

[UNCLEAR] The transcript says ordinary forward search can be viewed as an A* algorithm where `h` returns `1` for each state. This is the lecturer’s informal comparison, but the transcript does not specify how the goal state is treated.

---

# 7. Ignore Preconditions Heuristic

## 7.1 Definition

**Formal definition from the slide:** Assume all actions are applicable in all states. Then compute the minimum number of actions needed to reach the goal state.

**Intuition:** The planner pretends preconditions do not block actions. It asks: “If I could use any action anywhere, how many actions would it take to make the goal facts true?”

Because this relaxation makes the problem easier than the real problem, the number of actions found is an underestimate, so the heuristic is admissible.

## 7.2 Blocks World example

Initial state:

```text
ontable(A), ontable(B), ontable(C)
```

Goal state:

```text
ontable(A), on(B, A), on(C, B)
```

The lecture’s initial visual has `A`, `B`, and `C` all on the table.

### 7.2.1 Heuristic value for the initial state

Ignoring preconditions:

- `ontable(A)` is already true.
- Need `on(B, A)`.
- Need `on(C, B)`.

The two actions that would achieve those missing facts are:

```text
stack(B, A)
stack(C, B)
```

So:

```text
h(initial) = 2
```

The transcript notes that the real distance is longer because the actual domain also requires pick-up actions and other preconditions.

### 7.2.2 First possible actions and heuristic values

From the all-on-table state, possible first actions shown in the slide:

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

The slide gives:

```text
h(s) = 3
```

Reason:

- The goal requires `ontable(A)`, but after `pick-up(A)`, `A` is no longer on the table.
- The planner still needs to achieve:
  - `ontable(A)`;
  - `on(B, A)`;
  - `on(C, B)`.

This branch is worse than the others.

#### Branch: `pick-up(B)`

Resulting state:

```text
ontable(A), holding(B), ontable(C)
```

The slide gives:

```text
h(s) = 2
```

The remaining relaxed plan is still two actions away.

#### Branch: `pick-up(C)`

Resulting state:

```text
ontable(A), ontable(B), holding(C)
```

The slide gives:

```text
h(s) = 2
```

The lecture says the planner is therefore not going to explore `pick-up(A)` first because it has a worse heuristic value.

### 7.2.3 Continue the `pick-up(B)` branch

Suppose the planner explores:

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

The slide gives:

```text
h(s) = 1
```

Only `on(C, B)` remains to be achieved.

#### Option: `stack(B, C)`

Resulting state:

```text
ontable(A), on(B, C), ontable(C)
```

The slide gives:

```text
h(s) = 2
```

The transcript notes that the real cost would be more than this, because if `B` is on `C`, the planner would have to undo that before putting `B` on `A`. The key point is that the heuristic underestimates.

### 7.2.4 Why this heuristic helps

The heuristic guides search toward:

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

It lets the planner ignore branches that look less promising.

---

# 8. Serializable Sub-goals Heuristic

## 8.1 Definition

**Formal definition from the slide:** Find an order of sub-goals so that we never have to undo one once achieved.

**Intuition:** Break the goal into pieces, then solve those pieces in an order where completed pieces can be left alone.

A sub-goal can be one of the individual facts in the goal state.

For the Blocks World goal:

```text
ontable(A), on(B, A), on(C, B)
```

the sub-goals are:

```text
ontable(A)
on(B, A)
on(C, B)
```

## 8.2 Requirement: domain knowledge

The lecturer says this heuristic requires knowledge about the problem and domain. It only works when there is an order such that once a sub-goal is achieved, it does not need to be undone later.

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

- Once `A` is on the table, it should not need to be moved to solve the rest.
- Once `B` is on `A`, it should not need to be removed from `A`.
- Finally, put `C` on `B`.

### 8.4 How the heuristic prunes branches

Initial state: `A`, `B`, and `C` all on the table.

Possible actions:

```text
pick-up(A)
pick-up(B)
pick-up(C)
```

#### Branch: `pick-up(A)`

If the planner chooses:

```text
pick-up(A)
```

then the resulting state has:

```text
holding(A), ontable(B), ontable(C)
```

But the first sub-goal was:

```text
ontable(A)
```

This branch undoes the first achieved sub-goal, so the heuristic ignores/prunes it.

The slide explicitly notes:

```text
A no longer on-table - ignore
```

#### Branch: `pick-up(B)`

If the planner chooses:

```text
pick-up(B)
```

then `A` remains on the table, so it does not violate the first sub-goal.

From there, the planner can choose:

```text
stack(B, A)
```

This achieves the next sub-goal:

```text
on(B, A)
```

The slide labels this:

```text
Achieved next subgoal!
```

Then the planner can continue from that state to achieve:

```text
on(C, B)
```

### 8.5 Slide typo / transcript correction

[UNCLEAR] The slide bullet says: “First achieve `ontable(A)`, then `on(B, A)`, then `on(B, C)`.” The goal state on the same slide is `ontable(A), on(B, A), on(C, B)`, and the transcript says the final step is to put `C` on `B`. The intended final sub-goal is therefore `on(C, B)`, not `on(B, C)`.

---

# 9. State Abstraction Heuristic

## 9.1 Definition

**Formal definition from the slide:** Remove irrelevant parts of the state.

**Intuition:** Ignore objects and facts that cannot affect the current goal. This makes each state description smaller and removes useless actions from consideration.

## 9.2 Blocks World example

Initial visual state:

```text
A, B, C all on the table
```

Goal state:

```text
ontable(A), on(B, A)
```

The goal says nothing about `C`.

Therefore:

- ignore anything to do with `C`;
- ignore picking up `C`;
- ignore putting down `C`;
- ignore stacking `C` on `A`;
- ignore stacking `C` on `B`.

The initial state becomes the abstracted state:

```text
ontable(A), ontable(B)
```

The planner then works only with the facts relevant to `A` and `B`.

## 9.3 Why it helps

The heuristic reduces the size of the search problem:

- fewer state facts;
- fewer applicable actions;
- fewer irrelevant branches.

The lecturer emphasises that this also requires knowing something about the problem, because the planner needs to know what is irrelevant.

---

# 10. Hierarchical Planning and HTNs

## 10.1 Motivation: handling complexity by abstraction

**Intuition:** Instead of planning with every tiny action from the beginning, plan first at a high level, then fill in the details.

The lecture uses a travel example:

- Goal: travel from home in Manchester to Paphos, Cyprus.
- First, find the nearest/useful airport to Paphos.
- There are two relevant airports in Cyprus: Larnaca and Paphos.
- Choose a high-level route involving airports.
- Then separately plan:
  - how to get from home to Manchester Airport;
  - how to get from Larnaca to Paphos.

The lecturer explicitly says she did **not** start by considering all transport options from home: bus, train, taxi, driving, and every onward place reachable from those. That would create a huge search space.

## 10.2 Hierarchical Task Networks

**Formal term:** Hierarchical planning is usually done using **Hierarchical Task Networks**, abbreviated **HTNs**.

### 10.2.1 Primitive actions

**Definition:** At the lowest level, HTNs have primitive actions, the same as in PDDL.

Primitive actions are actions that no longer need further planning.

Examples from the travel plan:

```text
taxi(home, man_airport)
fly(man_airport, larnaca)
bus(larnaca, paphos)
```

### 10.2.2 Higher-level actions / HLAs

**Definition from the slides:** Higher-level actions represent things that need to be planned further. They are a bit like decomposition into sub-goals.

Example:

```text
go(home, man_airport)
```

This is a higher-level action because the planner still has to work out how to do it:

- taxi?
- drive?
- train?
- bus?

### 10.2.3 Implementation

**Formal definition from the slide:** If a plan contains only primitive actions, we call it an **implementation**.

**Intuition:** An implementation is a fully detailed plan that can actually be executed.

### 10.2.4 When a high-level plan achieves a goal

**Formal definition from the slide:** A high-level plan achieves a goal if at least one of its implementations achieves the goal.

**Intuition:** A high-level plan is successful if there is some way to refine it into a real executable plan that reaches the goal.

---

## 10.3 Top-down planning

The lecture says hierarchical planning is usually done top down.

### 10.3.1 Start with one high-level action

Initial high-level plan:

```text
go(home, paphos)
```

This represents the whole problem: get from the initial state to the goal state.

### 10.3.2 Refine into intermediate high-level actions

Next level:

```text
go(home, man_airport);
go(man_airport, larnaca);
go(larnaca, paphos)
```

Meaning:

1. Get from home to Manchester Airport.
2. Fly/get from Manchester Airport to Larnaca.
3. Get from Larnaca to Paphos.

### 10.3.3 Refine into primitive actions

Fully implemented plan:

```text
taxi(home, man_airport);
fly(man_airport, larnaca);
bus(larnaca, paphos)
```

This is an implementation because it contains only primitive actions.

---

## 10.4 Search methods for hierarchical planning

The slides say hierarchical planning can use:

- breadth-first search;
- depth-first search;
- more sophisticated algorithms such as:
  - shortest path;
  - iterative deepening.

### 10.4.1 Breadth-first in HTN planning

In the transcript’s explanation:

- Start at the top.
- Work out the next-level plan.
- Then work through all items at that level before going deeper.

### 10.4.2 Depth-first in HTN planning

Depth-first alternative:

- Start with the top high-level action.
- Choose one sub-action, such as `go(home, man_airport)`.
- Fully refine that part first.
- Then return to refine the next high-level action.

### 10.4.3 Iterative deepening

The lecturer describes iterative deepening as:

- like depth-first search;
- but only search down to a particular level;
- if no plan is found at that level, go one level further down;
- it can use less memory than breadth-first search.

The lecturer points students to Russell and Norvig for more detail.

[UNCLEAR] The transcript says “breakfast search”; this is **breadth-first search**.

---

# 11. Writing Higher-Level Actions

## 11.1 Problem: different implementations have different effects

The lecturer says that ideally, higher-level actions would be written like primitive actions, by defining all effects of interest.

But this is difficult because different implementations of the same HLA may have different side effects.

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

- Taking a taxi:
  - only works if the traveller has enough cash;
  - results in having less cash.
- Driving:
  - leaves the car at the airport for the duration of the trip.

These side effects may matter depending on the goal state. For example, whether the traveller still has cash or where the car is located may affect whether the overall goal is achieved.

## 11.2 Two approaches

The lecture gives two broad options.

### Option 1: Search and reject failed implementations

The planner can simply search over implementations and reject options if the implementation does not work.

Example:

- Try a taxi implementation.
- If the cash effect means the final goal cannot be achieved, reject it.
- Try another implementation.

### Option 2: Improve search at abstract levels

Represent HLAs in terms of their **possible effects** so that the abstract-level search can reason before committing to a specific implementation.

---

## 11.3 Possible effects notation

The lecturer refers to Russell and Norvig’s notation.

The slides show a “twiddle”/tilde notation:

```text
~E
~not E
```

The transcript explains:

- `~E` means `E` is possibly added.
- `~not E` means `E` is possibly removed.

Using this, abstract search involves searching over:

1. possible choices of actions;
2. possible outcomes/effects of those actions.

Then, after finding a high-level plan with desired possible outcomes, the planner chooses an implementation that achieves those outcomes.

---

## 11.4 Limitation: mutually exclusive effects

The lecture notes that this possible-effects representation does **not** capture mutually exclusive effects.

### 11.4.1 Example

Suppose the goal somehow requires both:

```text
not cash
at(car, airport)
```

That is:

- spend cash;
- leave the car at the airport.

The HLA is:

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

- after `go_from_home`, the agent is at `?d`;
- it is possible that cash is removed;
- it is possible that the car is at `?d`.

### 11.4.2 Why this is a problem

The possible effects suggest that both effects could be available:

```text
~not cash
~at(car, ?d)
```

But the implementations are mutually exclusive:

- Taxi implementation:
  - deducts cash;
  - does **not** move the car.
- Driving implementation:
  - moves the car to the airport;
  - does **not** deduct taxi cash.

So the abstract representation can make it look as though there is an implementation that both spends cash and leaves the car at the airport, even though no single implementation does both.

The lecturer does not go into more sophisticated search techniques for handling this, but notes that variable unification may be involved.

[UNCLEAR] The slide has a typo “airpot”; this is “airport.”

---

# 12. Online Planning

## 12.1 Scope of the lecture

The lecturer says this is only a brief introduction to online planning.

**IMPORTANT FLAG:** The lecturer explicitly says the important thing is to know that online planning is often necessary and to be aware, abstractly, of the sorts of techniques used for it.

This is not a lecture that gives full implementation details.

---

## 12.2 Contingent planning

### 12.2.1 Definition

**Intuition:** Contingent planning is planning for known possible contingencies in an uncertain environment.

A plan made in advance may not always work because:

- some facts are unknown before execution;
- the agent may only be able to discover those facts by acting or perceiving in the environment.

If the agent knows:

- what it does not know;
- how it can find that information out;

then it can make a contingent plan.

**Formal structure:** Contingent plans use `if-then-else` syntax around action choices.

### 12.2.2 Worked example: table, chair, and paint

Goal:

```text
make the chair the same colour as the table
```

Available information:

- The agent can perceive the colour of the table.
- The agent can perceive the colour of the chair.
- The agent has paint.
- The paint has some colour.

Plan from the slide:

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

1. Perceive the table colour.
2. Perceive the chair colour.
3. If table and chair already have the same colour:
   - do nothing.
   - `noop` means “no operation.”
4. Else, if the table colour is the same as the paint colour:
   - paint the chair.
5. Else:
   - replan.

The lecturer says that sometimes a contingent plan can be fully expanded for every branch. For instance, if the paint is the wrong colour, the plan might include going to find more paint. But if that contingency is unlikely, the planner may avoid spending computational effort on it in advance and instead use `replan` if that case arises.

---

## 12.3 Replanning and online/ongoing planning

A contingent plan with a `replan` command means planning must happen **during execution**.

The transcript calls this “ongoing planning”: planning that happens while the system is already in the middle of doing something.

**Definition:** Online planning is planning that occurs during execution, rather than only before execution begins.

---

## 12.4 Variables in initial states and effects

The lecturer says contingent planning may require variables:

- in the initial state;
- in effects of actions.

This differs from the earlier straightforward PDDL examples, where the lecture did not use variables in the initial state or in effect descriptions.

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

- There is some paint colour `?a`, but its value may not be known in advance.
- A `perceive` action can introduce information about the table colour.
- The value of `?a` is not known until the perception action is performed.

---

## 12.5 Replanning in changing environments

The lecturer extends the idea beyond contingent plans.

Even if the plan is not explicitly contingent, replanning may be needed in a changing environment.

Examples:

- A robot moves around a space.
- Someone knocks something over, blocking the intended route.
- People move objects that the robot was supposed to pick up.
- A human gives the system new instructions.

Reasons replanning may be needed:

- an action’s preconditions are unexpectedly not satisfied;
- the remaining plan will not work;
- the goals change;
- other environment changes occur.

The system must monitor for these situations and replan if they arise. The lecturer says replanning should ideally be minimal, not a complete re-planning through the whole space.

---

## 12.6 Minimal replanning example: failed preconditions

The slide shows an original plan path:

```text
S1 → S2 → S3 → S4 → S5
```

Each arrow is an action.

Expected execution:

1. Start in `S1`.
2. Execute the first action.
3. Arrive in `S2`.
4. From `S2`, execute the next action to get to `S3`.

But instead:

```text
S1 → actual state S6
```

The system expected `S2`, but after executing the action it finds itself in `S6`.

### 12.6.1 Minimal repair strategy

The lecturer says a minimal plan would probably try to find a new plan:

```text
S6 → S2
```

This gets the system back to the state where the original plan can resume.

### 12.6.2 Alternative repair targets

If resources permit, the system might also check whether it can get from `S6` directly to a later state:

```text
S6 → S3
S6 → S4
S6 → S5
```

This could allow the system to bypass parts of the original plan.

The planner needs some technique for deciding what the new target state should be. The lecturer says that if the target is close to the current situation, the search technique will hopefully use fewer resources.

[UNCLEAR] The transcript garbles this section: “transporters five” corresponds to the slide path through `S3`, `S4`, `S5`; “to us for” corresponds to `to S4`.

---

# 13. Cross-Lecture Connections

## 13.1 PDDL → forward/backward search

The PDDL lecture defines:

- states;
- predicates;
- action schemas;
- preconditions;
- effects.

The forward/backward search lecture then uses those action schemas operationally:

- forward search checks preconditions and applies effects;
- backward search checks effects/postconditions and reverses them.

So PDDL is the representation language, and forward/backward search are basic ways to solve planning problems represented in that style.

## 13.2 Forward search → heuristics

Forward search creates a large state space because it expands many legal but unhelpful branches.

The heuristics lecture directly addresses this problem:

- view planning as graph search;
- use a heuristic `h` to guide search;
- use admissible heuristics for A*;
- prune or avoid bad branches using domain knowledge.

## 13.3 Heuristics → HTNs

Planning heuristics reduce search by estimating useful directions or removing irrelevant branches.

Hierarchical planning reduces search differently:

- plan at an abstract level first;
- decompose into lower-level actions later;
- avoid considering all low-level options from the start.

Both are mechanisms for managing planning complexity.

## 13.4 HTNs → PDDL

HTNs still use primitive actions at the lowest level, and the lecture says these are the same kind of primitive actions as in PDDL.

So HTNs extend the planning structure by adding higher-level actions above PDDL-style primitive actions.

## 13.5 Classical planning → online planning

The PDDL lecture begins with classical assumptions:

- fully known environment;
- no change during execution;
- deterministic actions.

The Online Planning lecture relaxes this by considering:

- uncertain environments;
- perception during execution;
- contingencies;
- changing goals;
- unexpected failed preconditions;
- replanning during execution.

---

# 14. Exam and High-Value Flags

## 14.1 Explicit exam flag

**EXAM FLAG:** You are expected to be able to **read and construct simple PDDL planning domain descriptions**. This is stated explicitly in the PDDL transcript.

What to revise for this:

- action schema syntax;
- parameters and types;
- preconditions;
- effects;
- `not` effects as deleted facts;
- domain files;
- problem files;
- variables vs constants;
- closed world assumption.

## 14.2 Important flag: online planning

**IMPORTANT FLAG:** For online planning, the lecturer says the important thing is to know that it is often necessary and to be aware in an abstract way of the techniques used.

What to revise:

- contingent planning;
- `if-then-else` action choices;
- `replan`;
- monitoring failed preconditions / changed goals / broken remaining plan;
- minimal replanning.

## 14.3 Important flag: A*

**IMPORTANT FLAG:** The lecturer identifies A* as a particularly important algorithm in planning-as-graph-search.

What to revise:

- states as graph vertices;
- actions as graph edges;
- shortest path from initial to goal;
- heuristic `h`;
- admissibility = underestimate of distance to goal.

## 14.4 High-value definitions

Know these definitions cleanly:

```text
Planning problem:
An agent must decide on a sequence of actions to achieve a goal.

Action schema:
A template defining an action’s parameters, preconditions, and effects.

Closed world assumption:
If a fact cannot be derived, assume it is false.

Forward search:
Start from the initial state and apply applicable actions until the goal is reached.

Backward search:
Start from the goal state and work backward through actions that could have produced it.

Admissible heuristic:
A heuristic that underestimates the distance to the goal.

Ignore preconditions heuristic:
Assume all actions are applicable in all states, then compute the minimum number of actions needed to reach the goal.

Serializable sub-goals:
An ordering of sub-goals such that once a sub-goal is achieved, it never has to be undone.

State abstraction:
Remove irrelevant parts of the state.

HTN:
Hierarchical Task Network; a planning approach using primitive actions and higher-level actions.

Implementation:
A plan containing only primitive actions.

Contingent plan:
A plan with branches depending on perceived information or conditions.

Online planning:
Planning during execution, often because the environment is uncertain or has changed.
```

---

# 15. Unclear Sections and Likely Transcript/Slide Corrections

These are the parts worth checking against the recording.

1. **PDDL repeatedly transcribed as PDL/PGL/PDI**  
   The slides use **PDDL**. The transcript often says “PDL,” “PGL,” or “PDI.” Use PDDL.

2. **PDDL action schema duplicate parameters**  
   The slide for `move` includes a duplicated/garbled `:parameters` line. The clean form used in the lecture is:

   ```lisp
   :parameters (?x ?y - waypoint)
   ```

3. **Forward/backward transcript: “breakfast search”**  
   This is **breadth-first search**.

4. **Forward/backward transcript: “depth research”**  
   This is **depth-first search**.

5. **Blocks World `unstack` explanation**  
   The transcript garbles the effect on `?y`. The slide schema says `unstack` makes `?y` clear:

   ```lisp
   (clear ?y)
   ```

6. **Forward-search informal solution wording**  
   The transcript says something like “take C off A, put B on A, then put C on A.” Given the goal, this should be `C` on `B`, not `C` on `A`.

7. **Backward-search transcript: “AI’s on the table” / “That is on B”**  
   This is the goal:

   ```text
   ontable(A), on(B, A), on(C, B), clear(C), handempty
   ```

8. **Backward-search `unload` schema syntax**  
   The slide shows a likely syntax issue around:

   ```lisp
   (not (in (?x, ?y)))
   ```

   The intended predicate form is:

   ```lisp
   (not (in ?x ?y))
   ```

9. **Heuristics transcript: “serializable subclass heuristic”**  
   This is **serializable sub-goals heuristic**.

10. **Serializable sub-goals slide typo**  
    The slide says the final sub-goal is `on(B, C)`, but the goal state and transcript indicate `on(C, B)`. Use `on(C, B)`.

11. **HTN transcript: “hierarchical textbook networks”**  
    This is **Hierarchical Task Networks**.

12. **HTN transcript: “Paphos in Greece and Cyprus”**  
    The slides and rest of the transcript identify the destination as **Paphos, Cyprus**.

13. **HTN transcript: “breakfast search”**  
    Again, this is **breadth-first search**.

14. **Online planning transcript: “replanted”**  
    This means **replanned**.

15. **Online planning transcript: “transporters five” / “to us for”**  
    These refer to the state sequence on the slide:

    ```text
    S1 → S2 → S3 → S4 → S5
    ```

    and replanning from `S6` to `S2`, or possibly to `S3`, `S4`, or `S5`.

16. **Online planning: “ongoing planning” vs “online planning”**  
    The transcript uses “ongoing planning” to describe planning while the system is in the middle of execution. The slide title and topic are **online planning**.
