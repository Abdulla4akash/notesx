---
subject: COMP64602
chapter: 4
title: "Week 4"
language: en
---

# COMP64602 Study Notes: Logic, Intelligent Agents, and Multi-Agent Organisation

**Topic and scope:** This revision pack covers six COMP64602 lecture pairs, using both the uploaded slides and transcripts: First Order Logic, Intelligent Agents, Logic-Based Agents, BDI Agents, Organisations and Roles, and Institutions and Norms.

**Source materials used:**

- `First Order Logic-English (1).txt` and `FOL.pdf`
- `Intelligent_Agents_Video1-English (1).txt` and `Video1.pdf`
- `LogicBasedAgentsFinal-English (1).txt` and `LogicBasedAgents.pdf`
- `BDI-English (1).txt` and `BDI.pdf`
- `Organisations-English (1).txt` and `organisations.pdf`
- `Institutions-English (1).txt` and `intitutions.pdf`

---

## Global exam flags

**Exam flag — First Order Logic:** The lecturer explicitly says First Order Logic is **not directly examinable**, but later material assumes familiarity with FOL syntax and some semantics. Treat it as background knowledge you need in order to understand the examinable parts.

**Exam flag — BDI:** The lecturer explicitly gives a “take-home message” for the exam: BDI systems have core constructs of **beliefs**, **goals/desires**, and **intentions**, but the exact workflow varies by language/system. The lecturer’s own system workflow is examinable only if that system is later used as an exemplar.

---

# 1. First Order Logic

## Topic and scope

This lecture gives a rapid background tour of **First Order Logic**, focusing on syntax, semantics, models, quantifiers, free/bound variables, and minimal models. It connects to earlier material on Datalog, description logics, and knowledge representation/reasoning, and is assumed background for later agent material.

## Status in the course

The lecturer says First Order Logic is **not actually examinable**, but many later topics assume that you are familiar with at least its syntax and some of its semantics. The lecture also points students to Russell and Norvig Chapter 8, while noting that Russell and Norvig use a non-standard syntax.

## Syntax of First Order Logic

### Terms

**Intuition:**  
A term is an expression that refers to, or computes, an object in the domain being discussed.

**Lecture definition:**  
A term in first order logic can be:

- A **constant**, such as  
  $$a, b, c, dog, cat, peter, jane, robot$$

  Constants usually refer to particular objects, such as a dog, a cat, Peter, Jane, or a robot.

- A **variable**, such as  
  $$v_1, v_2, \ldots, v_n$$

  Variables stand for objects that may vary.

- A **function symbol applied to the appropriate number of constants and variables**, for example:

  $$owner(dog)$$

  $$height(peter)$$

  $$child(peter,jane)$$

**Function symbols:**  
A function maps an object, or a set of objects, onto some other object.

Examples from the lecture:

- $$owner(dog)$$ denotes some person.
- $$height(peter)$$ denotes some number.
- $$child(peter,jane)$$ denotes some person.

**Connection to earlier material:**  
The lecturer says this should be familiar from last semester, especially the distinction between constants and variables and the idea of an arity / n-ary function symbol.

[UNCLEAR] The transcript says “entry function symbol”; this is almost certainly “n-ary function symbol”.

---

## Formulae

### Simple formulae

**Intuition:**  
A simple formula states that some predicate is true of some terms.

**Lecture definition:**  
A formula can be a **predicate symbol** applied to an appropriate number of terms.

Predicate examples:

$$well\_behaved$$

$$taller\_than$$

$$postman$$

Formula examples:

$$well\_behaved(dog)$$

Meaning: the dog is well behaved.

$$taller\_than(owner(dog), peter)$$

Meaning: the owner of the dog is taller than Peter.

$$postman(v_1)$$

Meaning: $v_1$ is a postman.

The lecturer stresses an important distinction: a **simple formula** is a predicate applied to some number of terms.

---

### Complex formulae

Complex formulae are built from simpler formulae using logical connectives.

#### Negation

$$\neg well\_behaved(dog)$$

Meaning: the dog is not well behaved.

#### Conjunction

$$well\_behaved(dog) \land taller\_than(owner(dog), peter)$$

Meaning: the dog is well behaved **and** the dog’s owner is taller than Peter.

#### Disjunction

$$well\_behaved(dog) \lor taller\_than(owner(dog), peter)$$

Meaning: the dog is well behaved **or** the dog’s owner is taller than Peter.

[UNCLEAR] The transcript says “distinction”, but the slide and context show this is “disjunction”.

#### Implication

$$well\_behaved(dog) \Rightarrow taller\_than(owner(dog), peter)$$

Meaning: if the dog is well behaved, then its owner is taller than Peter.

#### If and only if

$$well\_behaved(dog) \Leftrightarrow taller\_than(owner(dog), peter)$$

Meaning both directions hold:

$$well\_behaved(dog) \Rightarrow taller\_than(owner(dog), peter)$$

and

$$taller\_than(owner(dog), peter) \Rightarrow well\_behaved(dog)$$

The lecturer notes that sometimes the iff symbol may be shown with a single bar rather than a double bar in different parts of the unit.

---

## Quantifiers

### Universal quantifier

**Symbol:**  
$$\forall$$

**Name:** universal quantifier.

**Intuition:**  
The statement applies to every object in the domain.

**Lecture example:**

$$\forall v_1.\ well\_behaved(v_1) \Rightarrow owner(v_1)=peter$$

Meaning: for all objects, if that object is well behaved, then its owner is Peter.

The variable $v_1$ is **universally quantified**.

---

### Existential quantifier

**Symbol:**  
$$\exists$$

**Name:** existential quantifier.

**Intuition:**  
There is at least one object in the domain for which the statement holds.

**Lecture example:**

$$\exists v_1.\ well\_behaved(v_1) \land owner(v_1)=peter$$

Meaning: there exists an object that is well behaved and is owned by Peter.

The variable $v_1$ is **existentially quantified**.

---

## Free and bound variables

### Bound variables

**Definition:**  
If a variable is quantified, it is **bound**.

Example:

$$\forall v_1.\ well\_behaved(v_1) \Rightarrow owner(v_1)=peter$$

Here $v_1$ is bound.

### Free variables

**Definition:**  
If a variable occurs in a formula and is not quantified, it is **free**.

Example:

$$well\_behaved(v_1) \Rightarrow owner(v_1)=peter$$

Here $v_1$ is free.

### Convention used in the unit

The lecturer says there is a tendency to assume that free variables are actually universally quantified. Free variables are often written with capital letters:

$$well\_behaved(V) \Rightarrow owner(V)=peter$$

**Connection to Datalog:**  
This is the same style as Datalog. Datalog does not explicitly handle universal and existential quantifiers in the same way; instead, it uses free variables represented with capital letters.

---

# Semantics of First Order Logic

## Models

**Intuition:**  
A model gives a domain of objects and tells us what the symbols in the language mean in that domain.

**Lecture definition:**  
A model of a first order logic formula consists of:

$$M = (\Delta, I)$$

where:

- $\Delta$ is the **domain**.
- $I$ is an **interpretation function**.

Strictly, the lecturer says there are interpretation functions for constants, variables, function symbols, predicates, and so on, but in the lecture they simplify this and refer to a single interpretation function $I$.

[UNCLEAR] The transcript says “settlement amputation functions”; context and slide show this means a set of interpretation functions.

---

## Truth in a model

A formula $\phi$ is true in a model if:

$$I(\phi)=\top$$

The lecture uses:

$$\top$$

for true, and

$$\bot$$

for false.

---

## Worked example: dog and cat domain

### Domain

$$\Delta = \{dog, cat\}$$

The formulae do not directly use the names $dog$ and $cat$. Instead, they use constants $a$ and $b$.

### Interpretation of constants

$$I(a)=dog$$

$$I(b)=cat$$

### Predicate

Predicate:

$$is\_dog$$

Interpretation:

$$I(is\_dog)(dog)=\top$$

$$I(is\_dog)(cat)=\bot$$

### Evaluating formulae

#### Formula 1

$$is\_dog(a)$$

Step-by-step:

1. $a$ maps to $dog$:

   $$I(a)=dog$$

2. $is\_dog$ applied to $dog$ is true:

   $$I(is\_dog)(dog)=\top$$

3. Therefore:

   $$I(is\_dog(a))=\top$$

So $is\_dog(a)$ is true in this model.

#### Formula 2

$$is\_dog(b)$$

Step-by-step:

1. $b$ maps to $cat$:

   $$I(b)=cat$$

2. $is\_dog$ applied to $cat$ is false:

   $$I(is\_dog)(cat)=\bot$$

3. Therefore:

   $$I(is\_dog(b))=\bot$$

So $is\_dog(b)$ is false in this model.

---

## Semantics of quantifiers

### Universal quantification

For a universally quantified formula:

$$I(\forall v.\ \phi(v))=\top$$

if and only if, for every object $o$ in the domain:

$$I(\phi(o))=\top$$

### Worked example

Formula:

$$\forall v_1.\ is\_dog(v_1)$$

Domain:

$$\{dog,cat\}$$

Check every object:

$$I(is\_dog(dog))=\top$$

but

$$I(is\_dog(cat))=\bot$$

Because at least one object in the domain is not a dog:

$$I(\forall v_1.\ is\_dog(v_1))=\bot$$

---

### Existential quantification

For an existentially quantified formula:

$$I(\exists v.\ \phi(v))=\top$$

if there is some object $o$ in the domain such that:

$$I(\phi(o))=\top$$

### Worked example

Formula:

$$\exists v_1.\ is\_dog(v_1)$$

Domain:

$$\{dog,cat\}$$

Check whether there is at least one object that satisfies the predicate:

$$I(is\_dog(dog))=\top$$

So:

$$I(\exists v_1.\ is\_dog(v_1))=\top$$

---

## Truth in all models

The lecture says:

$$\phi$$

is true iff it is true in all models.

The lecturer also says that, in practice, this is often restricted because the unit is often dealing with restricted sets of domains.

---

# Sloppy terminology used later in the unit

The lecturer explicitly warns that she may use terminology imprecisely later to make explanations quicker.

## Saying “$\phi$ is true in $M$”

When the lecturer says:

$$\phi \text{ is true in } M$$

she means:

$$M=(\Delta,I)$$

and

$$I(\phi)=\top$$

This is shown on slide page 7.

---

## Describing a model as a set of formulae

The lecturer may write:

$$M=\{\phi_1,\phi_2,\phi_3\}$$

where the $\phi_i$ are simple formulae or negations of simple formulae.

This means:

$$M=(\Delta,I)$$

and

$$I(\phi_1)=\top$$

$$I(\phi_2)=\top$$

$$I(\phi_3)=\top$$

and for all other simple formulae $\phi$:

$$I(\phi)=\bot$$

### Example

In the dog/cat example:

$$is\_dog(dog)$$

is true in $M$, and the lecturer may write:

$$M=\{is\_dog(dog)\}$$

This means that $is\_dog(dog)$ is true and all other simple formulae are false.

---

# Minimal models

## Motivation

The lecturer says there are infinitely many models for any set of formulae, if only because there is a model for every subset of the numbers. But most of these models are not interesting when thinking about a particular knowledge base.

## Example knowledge base

$$KB = \{is\_dog(rover),\ is\_cat(kitty),\ldots\}$$

plus some complex formulae about dogs and cats.

In this case, the lecturer says we are interested in domains that give interpretations for $rover$ and $kitty$. We are not interested in domains containing unrelated objects such as Tweety or SpongeBob, because the knowledge base is not talking about them.

Formally, the relevant domain is:

$$\Delta = \{I(rover), I(kitty)\}$$

Sloppily, the lecturer may write:

$$\Delta = \{rover, kitty\}$$

## Definition: minimal model

A minimal model for a knowledge base is a model in which:

1. all formulae in the knowledge base are true in the model; and
2. the domain is as small as possible.

The lecturer says she will often say “all models” when she means “all minimal models.”

---

## Connections

- FOL connects to Datalog: capital-letter variables are treated like implicitly universally quantified variables.
- FOL connects to description logics and Datalog through model-based semantics.
- The material is assumed background for later agent lectures.
- Russell and Norvig Chapter 8 is suggested, though the lecturer notes that its syntax is non-standard.

## Unclear sections to revisit

- [UNCLEAR] “First order logic is not actually examine evil” = “not actually examinable.”
- [UNCLEAR] “entry function symbol” likely means “n-ary function symbol.”
- [UNCLEAR] “distinction” in complex formulae should be “disjunction.”
- [UNCLEAR] “settlement amputation functions” should be “set of interpretation functions.”
- [UNCLEAR] The transcript garbles parts of the iff explanation: “its own understood than Peter” should be “its owner is taller than Peter.”

---

# 2. Intelligent Agents and Multi-Agent Organisation

## Topic and scope

This lecture introduces **intelligent agents** and how they fit into **multi-agent organisation**. The lecturer says intelligent agents will be used in several other topics throughout the unit.

---

# What is an agent?

## Formal definition

The lecturer gives the textbook definition:

> An agent is a computer system that is situated in some environment and that is capable of autonomous action in this environment in order to achieve its delegated objectives.

## Intuition

An agent is a system that:

1. exists within some environment;
2. receives information from that environment;
3. acts in that environment;
4. can act without constant human intervention;
5. acts in pursuit of objectives given to it by people or by the system design.

The lecturer stresses that an agent does not have to be a physical robot. It may be a purely computational system, as long as it interacts dynamically with a wider computational environment.

---

## Key parts of the definition

### Environment

For something to count as an agent, it must interact with an outside world in some way.

Examples:

- A robot interacts with the physical world using sensors and manipulators.
- A purely computational agent interacts with a wider computational environment.

### Autonomous action

The agent must be able to do things that change what happens in the environment.

### Delegated objectives

The objectives come from the people who deployed the agent or from the system specification/design.

The lecturer explicitly says the unit is not mainly concerned with futuristic systems that invent their own objectives. It is concerned with systems whose objectives have been delegated by people.

---

# Autonomy

## Definition

By autonomy, the lecturer means:

> agents are able to act without the intervention of humans or other systems.

## Important nuance

The definition does not say anything about:

- how complicated the action is;
- how intelligent the reasoning is;
- whether the action is sophisticated.

It only says the agent can act without direct intervention.

---

# Sense-Reason-Act cycle

The slide on page 3 shows the basic structure:

$$Environment \rightarrow Sensors \rightarrow Agent \rightarrow Actuators \rightarrow Environment$$

## Sensors

Sensors provide the agent with information from the environment.

For embodied agents, examples include:

- cameras;
- infrared detectors;
- motion detectors.

## Actuators

Actuators allow the agent to act on the environment.

Examples include:

- grippers;
- motors.

## Cycle

The cycle is:

1. The agent senses the environment.
2. The agent decides what to do.
3. The agent acts on the environment.
4. The environment changes.
5. The agent senses again.

This is called the **sense-reason-act cycle**.

---

# Worked example: thermostat as an agent

The lecturer uses a thermostat to show that not all agents are intelligent agents.

## Environment

The house/environment has a temperature.

## Sensor input

The thermostat detects the temperature.

## Internal rule

The thermostat has a target, for example 20 degrees.

## Actions

If the detected temperature is below the target, it switches the central heating on.

If the detected temperature is above the target, it switches the central heating off.

## Why it is an agent

It senses the environment and acts on the environment.

## Why it is not the kind of intelligent agent the unit focuses on

Its behaviour is very simple and fixed. Given the same sensor input, it does the same thing.

[UNCLEAR] The transcript says “below 22 C 20 degrees”; the intended threshold appears to be 20 degrees.

---

# What makes an agent intelligent?

The lecture identifies three properties:

1. proactiveness;
2. reactiveness;
3. social ability.

These are also listed on slide page 4.

---

## Proactive intelligent agents

### Formal definition from the slide

Proactive intelligent agents are able to exhibit goal-directed behaviour by taking the initiative in order to satisfy their delegated objectives.

### Intuition

A proactive agent does not just react mechanically to the current sensor input. It chooses actions according to the goal it is currently pursuing.

### Contrast with thermostat

A thermostat always behaves the same way for the same temperature reading.

A proactive agent may behave differently even with the same sensor input, depending on its current goal/objective.

---

## Reactive intelligent agents

### Formal definition from the slide

Reactive intelligent agents are able to perceive their environment and respond in a timely fashion to changes that occur in it in order to satisfy their delegated objectives.

### Intuition

A reactive agent pays attention to changes and adjusts its behaviour when the environment changes.

### Worked example: robot obstacle

A robot is trying to get to a location as quickly as possible.

Its proactive objective is to reach the goal location.

If an obstacle suddenly appears, the robot must react:

1. perceive the obstacle;
2. stop following the shortest route;
3. navigate around the obstacle;
4. continue pursuing the goal.

This illustrates a balance between:

- **proactive behaviour**: pursuing the goal;
- **reactive behaviour**: responding to environmental change.

---

## Social ability

### Formal definition from the slide

Social ability means intelligent agents are capable of interacting with other agents, and possibly humans, in order to satisfy their design objectives.

### Intuition

An intelligent agent may need to collaborate, coordinate, or negotiate with others.

The lecturer connects this to distributed computing and multi-agent systems:

- agents may be on different computers;
- agents may be in different robots;
- agents may need to work together to achieve a task;
- agents may have different objectives but collaborate so that all can achieve their goals.

---

## Connections

- This lecture introduces intelligent agents, which later lectures use in logic-based agents, BDI agents, organisations, roles, institutions, and norms.
- Social ability leads directly into multi-agent systems.
- The lecture sets up the later discussion of how groups, communities, societies, or organisations of agents coordinate.

## Exam flags

No explicit “this is on the exam” statement is made in this lecture. The definitions of agent, autonomy, and the three intelligent-agent properties are central lecture content.

## Unclear sections to revisit

- [UNCLEAR] “how do I textbook” is garbled; it refers to the course textbook.
- [UNCLEAR] “delicate delegated objectives” should be “delegated objectives.”
- [UNCLEAR] “girl” in the robot example should be “goal.”

---

# 3. Logic-Based Agents

## Topic and scope

This lecture explains **logic-based agents**: agents that use facts, rules, and theorem proving to decide what action to take next. The lecturer explicitly connects this to Datalog and logic programming.

---

# Key idea

## Slide formulation

A computational intelligent agent reasons logically about what to do next. Using its rules and facts, it deduces the optimal action to take using theorem proving.

## Intuition

A logic-based agent contains a knowledge base of facts and rules. It updates facts through perception, then uses logical reasoning to infer which action it should perform.

The lecturer frames this as putting something like Datalog inside an agent architecture and letting it control the agent’s actions.

---

# Action choice algorithm

## Inputs

The action choice algorithm assumes:

- a set of possible actions:

  $$A$$

- a set of facts and rules:

  $$\Delta$$

## Algorithm

Clean version of the algorithm from the slide:

```text
Assume set of actions A, and set of facts and rules Δ.

for each a ∈ A do
    if Δ ⊢ do(a)
        return a

for each a ∈ A do
    if Δ ⊬ ¬do(a)
        return a

return noop
```

## Meaning of the symbols

$$\Delta \vdash do(a)$$

means: from the facts and rules in $\Delta$, the system can derive that action $a$ should be done.

$$\Delta \nvdash \neg do(a)$$

means: from $\Delta$, the system cannot derive that action $a$ should not be done.

## Interpretation of the algorithm

### First loop

The agent searches through actions and chooses an action if it can prove:

$$do(a)$$

This means the action is positively recommended by the knowledge base.

### Second loop

If no action is provably recommended, the agent searches again for an action that is not ruled out. It returns an action $a$ if it cannot prove:

$$\neg do(a)$$

So the second loop chooses an action that does not contradict the knowledge base.

### Final case

If no such action is found, the agent returns:

$$noop$$

meaning no operation / no action.

[UNCLEAR] The transcript says “no some, no action”; the slide clearly shows `noop`.

---

# Role of the programmer and perception

The programmer writes the facts and rules assuming this algorithm is in place.

Facts are updated by perception.

The repeated cycle is:

1. perceive the world;
2. update facts;
3. run the logic program / reasoning;
4. decide what action to do;
5. perform the action;
6. perceive again.

This links back to the earlier **sense-reason-act** cycle.

---

# Worked example: grid world

The slide on page 4 shows a grid world with a teleporting robot and two gold squares. The lecturer simplifies navigation by allowing the robot to teleport from one square to another rather than navigate step by step.

## Environment

The grid uses coordinates from 0 to 2.

[UNCLEAR] The transcript says “coordinates that go from not to two”; this means 0 to 2.

The robot starts in the middle square:

$$at(1,1)$$

There are two squares containing gold.

The robot can perceive/update:

- whether it is at a square:

  $$at(X,Y)$$

- whether a square has been explored:

  $$explored(X,Y)$$

- whether a square is unexplored:

  $$unexplored(X,Y)$$

- whether there is gold in the current square:

  $$gold$$

- whether there is no gold in the current square:

  $$not\_gold$$

These perceptions are updated whenever the robot teleports or collects gold.

---

## Initial facts

The program begins with:

$$at(1,1).$$

$$not\_gold.$$

$$unexplored(0,0).$$

$$unexplored(0,1).$$

$$\ldots$$

$$unexplored(2,2).$$

The lecturer notes that the program probably should also believe:

$$explored(1,1)$$

but this was not written on the slide.

---

## Rules

### Rule 1: go to an unexplored square when there is no gold

$$at(X,Y) \land not\_gold \land unexplored(A,B) \rightarrow do(go(A,B))$$

Meaning: if the robot is at some location $(X,Y)$, sees no gold, and believes another square $(A,B)$ is unexplored, then it should go to $(A,B)$.

### Rule 2: collect gold when gold is present

$$at(X,Y) \land gold \rightarrow do(collect(gold))$$

Meaning: if the robot is at some square and sees gold, it should collect the gold.

### Rule 3: stop once square $(2,2)$ has been explored

$$explored(2,2) \rightarrow do(stop)$$

Meaning: once the bottom-corner square $(2,2)$ is explored, the robot should stop.

[UNCLEAR] The transcript says “square two two inches the bottom corner”; this means square $(2,2)$.

---

## Variables and unification

The lecturer says capital letters are used as in Datalog to represent variables.

So:

$$X,Y,A,B$$

are variables, and they are instantiated by unification.

---

## Step-by-step execution

### Step 1: start at $(1,1)$

Current beliefs include:

$$at(1,1)$$

$$not\_gold$$

$$unexplored(0,0)$$

Rule 1 applies:

$$at(X,Y) \land not\_gold \land unexplored(A,B) \rightarrow do(go(A,B))$$

using:

$$X=1,\ Y=1,\ A=0,\ B=0$$

Therefore:

$$do(go(0,0))$$

The robot teleports to square $(0,0)$.

---

### Step 2: perceive at $(0,0)$

After teleporting, perception updates the facts.

The robot now perceives:

$$at(0,0)$$

The lecturer says it will perceive gold at this square.

It may also update:

$$explored(1,1)$$

and delete or replace the previous unexplored status.

---

### Step 3: collect gold at $(0,0)$

Now the current facts include:

$$at(0,0)$$

$$gold$$

Rule 2 applies:

$$at(X,Y) \land gold \rightarrow do(collect(gold))$$

using:

$$X=0,\ Y=0$$

Therefore:

$$do(collect(gold))$$

The robot collects the gold.

The lecturer imagines the robot putting the gold into a backpack.

After collecting, perception changes:

$$gold$$

to:

$$not\_gold$$

---

### Step 4: choose next unexplored square

Now Rule 1 applies again:

$$at(X,Y) \land not\_gold \land unexplored(A,B) \rightarrow do(go(A,B))$$

The next unexplored square is likely:

$$(0,1)$$

so the agent derives something like:

$$do(go(0,1))$$

The lecturer says the order of choosing facts is not specified, but usually facts are picked up in the order they were written.

---

### Step 5: collect gold at $(0,1)$

At $(0,1)$, the robot perceives gold.

Rule 2 applies again:

$$at(0,1) \land gold \rightarrow do(collect(gold))$$

The robot collects the second gold.

Perception then updates:

$$gold$$

to:

$$not\_gold$$

---

### Step 6: continue exploring

The robot continues moving to unexplored squares.

The lecturer says it skips the square that was explored at the start.

Eventually, the robot reaches square:

$$(2,2)$$

Perception updates:

$$explored(2,2)$$

Now Rule 3 applies:

$$explored(2,2) \rightarrow do(stop)$$

Therefore:

$$do(stop)$$

The robot stops.

---

# General pattern illustrated by the example

Every time the agent takes an action:

1. the facts change through perception;
2. the logic program is run again;
3. the updated facts and rules determine the next action;
4. the action is executed;
5. perception occurs again.

This is a logic-programming version of sense-reason-act.

---

# Critiques of logic-based agents

## 1. Burden on the programmer

The programmer must determine the optimal action in all situations by writing rules.

Problems:

- The programmer may fail to imagine some situation the agent could encounter.
- If no rule handles a situation, the agent has little flexibility to adapt.
- The programmer must ensure rules do not overlap badly.
- If multiple rules apply at once, the system must somehow choose the best one.

## 2. Theorem proving can be slow

The agent may spend time reasoning about what to do.

Problem: the world may change while the agent is reasoning.

The lecturer emphasizes that the loop is:

$$perception \rightarrow reasoning \rightarrow action$$

While reasoning, the agent is not checking the world again.

So the action it chooses may no longer be optimal by the time it acts.

## 3. Practical qualification

The lecturer notes that, in practice, good logic programmers can often construct programs that execute quickly, so the slowness is not always a major practical issue.

There are logic programming languages specialized for getting agents to do things in the real world.

---

# Connections

- Directly connected to Datalog and logic programming.
- Builds on the earlier agent sense-reason-act architecture.
- Leads into BDI agents, which refine the idea to make action selection more structured and potentially quicker.
- Later planning material will add more flexibility and adaptability.

## Exam flags

No explicit exam phrase is used in this lecture, but the action choice algorithm, grid-world example, and critiques are the major lecture content.

## Unclear sections to revisit

- [UNCLEAR] “logic based engines” should be “logic-based agents.”
- [UNCLEAR] “current signature” should be “current square.”
- [UNCLEAR] “coordinates that go from not to two” means coordinates 0 to 2.
- [UNCLEAR] “explored one more” likely means $explored(1,1)$.
- [UNCLEAR] “two two inches the bottom corner” means square $(2,2)$.

---

# 4. Beliefs-Desires-Intentions Agents

## Topic and scope

This lecture introduces **Beliefs-Desires-Intentions agents**, usually abbreviated **BDI agents**. BDI agents are presented as going beyond logic-based agents while retaining advantages of precise behavioural specification and analysis.

---

# Why go beyond logic-based agents?

The lecture gives four motivations, also shown on slide page 2.

BDI agents aim to:

1. simplify reasoning about the current state;
2. direct action via goals, called intentions or desires;
3. provide, or get the computer to construct, plans for achieving goals;
4. monitor plan and action execution and revise if necessary.

## Intuition

Logic-based agents can require theorem proving over facts and rules to decide the next action. BDI systems try to reduce this burden by separating:

- what the agent believes;
- what the agent wants;
- what the agent is currently committed to doing;
- what plans it has for achieving goals.

---

# Core BDI concepts

## Beliefs

**Intuition:**  
Beliefs represent what the agent currently takes to be true about the world.

In the textbook-style BDI workflow, beliefs are simplified into atomic facts through belief revision.

In practical languages, according to the lecturer, belief bases often still contain some rules.

## Desires

**Definition from lecture:**  
Desires are all the things the agent would like to achieve in the world.

**Intuition:**  
Desires are candidate goals. The agent may want many things, but it may not currently be acting on all of them.

## Intentions

**Definition from lecture:**  
Intentions are the things the agent is currently committed to trying to achieve.

**Important nuance:**  
In some programming languages, an intention is not just a goal. It may be a goal plus a plan of action attached to it.

So an intention can be:

$$goal + instantiated\ plan$$

This gives the meaning of being committed to doing something about that goal.

## Plans

Plans are ways of achieving goals.

The lecturer says plans may be:

- provided by the programmer; or
- constructed by the computer using AI planning.

The lecture also says AI planning will be covered later in the unit.

---

# Monitoring and revising execution

BDI systems monitor plans and actions as they execute.

This allows the agent to revise behaviour, including:

- dropping goals if they are no longer achievable;
- dropping goals if the agent is no longer interested in them;
- dropping intentions if the plan is not working;
- dropping intentions if the goal is no longer a priority.

---

# BDI workflow according to the textbook

The slide on page 3 shows the textbook workflow.

## Overall flow

$$Sensor\ Input \rightarrow Belief\ Revision \rightarrow Beliefs$$

Then:

$$Beliefs + Current\ Intentions \rightarrow Generate\ Options$$

Then:

$$Goals/Desires \rightarrow Deliberate/Filter \rightarrow Intentions$$

Then:

$$Intentions \rightarrow Select \rightarrow Act$$

Then the process returns to sensor input.

## Step-by-step explanation

### 1. Sensor input

The agent receives new information from sensors.

[UNCLEAR] The transcript repeatedly says “censor”; this should be “sensor.”

### 2. Belief revision

The agent updates its belief database.

The textbook version uses belief revision so that, instead of keeping facts and rules and doing theorem proving each time to work out the current world state, the beliefs become a set of atomic statements about the world.

So, in the textbook picture:

- beliefs are just facts;
- beliefs do not contain rules.

The lecturer says belief revision will be covered next week.

### 3. Generate options

The agent looks at its current intentions and generates options.

This may modify the goal base:

- add goals;
- remove goals;
- change goals.

[UNCLEAR] The transcript says “object options”; this should be “options.”

### 4. Deliberation/filtering

The agent works through its goals and decides which ones it currently wants to do something about.

Those selected goals become the current set of intentions.

The existing current intentions are also considered, because the agent must decide its immediate priorities.

### 5. Select intention and act

The agent selects one intention.

That selected intention tells the agent what to do next.

The agent acts, then returns to sensing.

---

# BDI workflow according to the lecturer

The lecturer says the textbook presentation is an oversimplification of what happens in practical BDI languages.

The slides on pages 4–6 show the lecturer’s preferred workflow.

## Main differences from the textbook

### 1. Beliefs may include rules

In practice, many BDI languages do not have only atomic facts in the belief base.

They often keep some rules.

### 2. Belief revision is “simple belief revision”

The lecturer calls the practical version:

$$Simple\ Belief\ Revision$$

Sensor information may add or remove beliefs.

Example:

- previously the agent saw an obstacle;
- now it no longer sees an obstacle;
- the belief about the obstacle should be removed.

But the system does not necessarily perform full forward chaining to compute every atomic consequence.

Reason: full forward chaining can be computationally expensive.

### 3. Generate options / deliberate / filter is messy

The lecturer says the step involving new goals, deliberation, and intentions is messy in many systems.

Different languages do this differently.

So the lecturer represents this as one combined stage:

$$Generate\ Options / Deliberate / Filter$$

### 4. Plans feed into option generation

Plans are added into the workflow.

The plans may come from:

- the programmer; or
- a planning algorithm.

Plans help instantiate intentions.

### 5. Intentions may be sequences of steps

In practice, intentions often become currently instantiated plans for achieving goals.

So an intention may not simply be:

$$goal$$

It may be:

$$sequence\ of\ actions\ for\ achieving\ a\ goal$$

When selecting an intention, the agent may:

- execute the whole sequence; or
- execute only the first/top step and then loop back to reconsider.

The lecturer suggests the second approach allows the agent to drop or revise intentions if circumstances change.

---

# BDI workflow in the lecturer’s own system

The lecturer mentions her own system, Gwendolen.

[UNCLEAR] The transcript uses “Gwendolyn” and “Gwendolen”; the system name appears to be Gwendolen.

## Key difference

In the lecturer’s system, the arrow between:

$$Generate\ Options / Deliberate / Filter$$

and:

$$Goals/Desires$$

is one-way.

At that stage, the system does **not** update goals. It only uses:

- goals;
- intentions;
- plans;

to decide what the next set of intentions will be.

## How goals and beliefs change

Intentions are sequences of things to do, based on plans.

Those sequences can include actions that change:

- goals;
- beliefs.

So there are arrows from Act back to:

$$Beliefs$$

and:

$$Goals/Desires$$

## Why goal change is deliberate

The lecturer says goal change is something you want to be deliberate about.

Goals may change because:

- a user sends a message telling the agent to update goals;
- the agent reasons that a goal is out of date;
- the agent gains a subgoal.

---

# Exam flag: BDI take-home message

The lecturer explicitly says the important exam-level message is:

BDI systems have core constructs:

1. a set of beliefs that are hopefully quick to reason about;
2. a set of goals/desires that help decide what the agent wants to do;
3. a set of intentions that tell the agent which goals it will try to act on in the next period of time and how it will go about that.

The exact workflow differs across languages and systems.

The lecturer says her own workflow is examinable only if her system is later used as an exemplar.

---

# Connections

- BDI agents are a refinement of logic-based agents.
- They aim to keep formal precision and analyzability while simplifying reasoning.
- Belief revision is connected to a later lecture.
- AI planning is connected to a later part of the unit.
- Agent programming will be covered later if the course uses Gwendolen or another exemplar.

## Unclear sections to revisit

- [UNCLEAR] “beliefs disaster intentions” = “beliefs, desires, intentions.”
- [UNCLEAR] “thing improving” = “theorem proving.”
- [UNCLEAR] “object options” = “options.”
- [UNCLEAR] “censor” = “sensor.”
- [UNCLEAR] The final sentence around “examiner or” is garbled, but the exam message is clear: the lecturer’s own workflow is only examinable if used later as the exemplar system.

---

# 5. Organisations and Roles

## Topic and scope

This lecture introduces **organisations** and **roles** as mechanisms for coordinating multi-agent systems. It prepares for the next lecture on institutions and norms.

---

# Multi-agent systems

## Basic idea

Agents in a multi-agent system often need to interact with other agents.

These agents may be:

- computational agents;
- human agents.

Many multi-agent systems are designed so that humans and computational agents work together to achieve some end.

## Examples from the lecture

Examples of multi-agent systems include:

- sensor networks;
- business process management systems;
- e-commerce platforms;
- agentic workflows, especially where multiple large language models coordinate together.

[UNCLEAR] The transcript says “genetic workflows”; the slide says “Agentic workflows.”

---

# Why structure is needed

Often, designers want to impose some structure on how a multi-agent system coordinates its work.

Traditional coordination mechanisms include:

- organisations;
- roles;
- institutions;
- norms.

This lecture focuses on organisations and roles. The following lecture covers institutions and norms.

---

# Organisations

## Definition

An organisation is a structure that allows multiple agents to coordinate to achieve some goal that they cannot achieve individually.

## Intuition

An organisation is a coordinating framework. It gives agents a structured way to work together.

## Organisational structure

An organisational structure is a collection of:

- roles;
- relationships;
- authority structures.

These govern:

- the behaviour of the organisation as a whole;
- the behaviour of agents within the organisation.

In computational systems, organisational structures are often defined via:

- models;
- protocols for interaction.

They may include delegation between roles.

## Unknown agents at design time

The lecturer says that, in theory, once an organisational structure is defined, individual agents can enter and play roles within it even if their identities or programmers were not known at design time.

---

# Roles

## Definition

Individual agents assume roles within an organisation.

## What a role defines

A role may define:

1. rules, obligations, or norms that the agent should follow;
2. goals for the agent to achieve;
3. capabilities the agent receives while playing the role;
4. relationships of delegation.

## Goals in roles

The goals assigned to roles are usually subgoals of the organisation’s goals.

The idea is:

$$Agents\ achieve\ role\ goals \Rightarrow Organisation\ achieves\ overall\ goal$$

## Capabilities

A role can give an agent capabilities that it does not otherwise have.

Example from the lecture:

For web agents, a role might give the capability to access and manipulate certain data.

If the agent is not playing that role, it cannot access or manipulate that data.

## Delegation

Roles may define relationships where:

- an agent can delegate tasks to other agents;
- an agent can be delegated tasks by other agents.

## Agents can have other goals

Agents inside an organisation may also have:

- their own goals;
- roles in other organisations.

The lecturer notes this is true of both software agents and human agents.

---

# Worked example: COMP64602 as an organisation

The lecturer uses COMP64602 itself as an example.

## Organisation

$$COMP64602$$

can be considered an organisation.

## Organisational goal

The goal is that students learn more and know more about knowledge representation and reasoning by the end of the unit.

## Roles

Roles include:

- unit lead;
- lecturer;
- graduate teaching assistant;
- student.

## Protocols for interaction

The organisation has protocols such as:

- when modules are released on Canvas;
- when lectures take place;
- when coursework is marked;
- how coursework is marked.

---

# Worked example: course lecturer as a role

The lecturer role has particular capabilities, goals, obligations, and delegation relationships.

## Capabilities

The lecturer can:

- edit the Canvas space;
- add material;
- alter material;
- assign grades for coursework.

The lecturer does not have these capabilities in other units.

Students do not have these capabilities in this unit, even though they are part of the organisation.

## Delegation

The lecturer may be delegated tasks by the unit lead.

The lecturer may delegate tasks to GTAs.

[UNCLEAR] The transcript says “GCS”; context and slides show this means GTAs.

## Goals

The lecturer has goals to:

- release material;
- release coursework;
- mark coursework.

## Obligations

The lecturer has obligations to:

- achieve these things on time;
- answer student questions on time.

## Nested organisations

The lecturer also has other roles in the university.

COMP64602 itself can be seen as part of the larger university organisation.

The lecturer also has personal goals outside work.

---

# Design time vs runtime

## Organisations as design-time tools

Organisations and roles are frequently part of the design process of a multi-agent system.

If designers are creating a closed multi-agent system, they may use organisations and roles only during design.

After design, they simply program agents to play the intended roles.

In that case, there may be no runtime software representing the organisation.

## Organisations at runtime

Organisations can also exist at runtime.

Runtime frameworks can support concepts such as:

- communicating goals to agents;
- communicating obligations;
- granting capabilities;
- communicating protocols.

This is especially useful if agents may enter and leave the organisation.

For this to work, agents need to:

- understand the information;
- represent the relevant knowledge;
- reason about how to play the role.

Runtime organisational structures may also monitor interactions and correct things if they are not going properly.

---

# Connections

- Connects intelligent agents to multi-agent coordination.
- Draws on business processes and organisational theory.
- Leads directly into institutions and norms.
- Shows how knowledge representation is needed when roles, obligations, capabilities, and protocols are communicated at runtime.

## Exam flags

No explicit exam flag is stated.

## Unclear sections to revisit

- [UNCLEAR] “multi-agency system” = “multi-agent system.”
- [UNCLEAR] “genetic workflows” = “agentic workflows.”
- [UNCLEAR] “code 64602” = “COMP64602.”
- [UNCLEAR] “GCS” = “GTAs.”

---

# 6. Institutions and Norms

## Topic and scope

This lecture introduces **institutions** and **norms** as rule-based structures for governing organisations in multi-agent systems. It focuses especially on how norm violations can be monitored using traces of states and events.

---

# Organisations, institutions, and norms

## Organisations

Earlier, organisations were introduced as structures for coordinating groups of agents to achieve some goal.

## Institutions

In multi-agent systems, organisations are associated with institutions.

## Definition: institution

An institution is the set of rules that govern the organisation.

The lecturer stresses that this is a technical definition. In everyday language, “institution” can mean a wider range of things, but here it specifically means a set of rules.

## Norms

The rules of an institution are often represented as norms.

---

# What is a norm?

## Definition

A norm is:

> a standard or pattern of social behaviour that is accepted or expected of a group.

## Types of norms

Norms may express:

- permissions: what agents are allowed to do;
- obligations: what agents are expected or required to do;
- prohibitions: what agents are obliged not to do.

The lecturer says prohibitions are included under obligations because a prohibition is essentially an obligation not to do something.

---

## Coordination norms

Some norms are simple coordination devices.

Examples:

- always drive on the left;
- shake hands when meeting someone for the first time.

The lecturer says these do not necessarily carry moral weight. They coordinate society or indicate social attitudes.

## Moral norms

Some norms have moral or ethical weight.

Examples:

- do not kill people;
- care for your children;
- treat people with dignity.

The lecturer does not go into the difference in detail. For this unit, “norms” covers obligations, prohibitions, and permissions across these cases.

---

# Norm violations and sanctions

Agents may violate norms.

The lecturer says agents often do violate norms, and sometimes may have good reasons to do so.

When an agent violates a norm, the institution or organisation may choose to impose a sanction.

So the structure is:

$$Norm \rightarrow Expected\ behaviour$$

$$Violation \rightarrow Behaviour\ does\ not\ satisfy\ norm$$

$$Sanction \rightarrow Consequence\ imposed\ by\ institution$$

---

# Aside: Deontic logic

The slide on page 4 introduces deontic logic as a logic for obligations and permissions.

[UNCLEAR] The transcript says “logic called logic,” “downtick logic,” and “down logic”; these all refer to **deontic logic**.

## Symbols

$$O$$

means obligation.

$$P$$

means permission.

## Permission as absence of obligation not to act

The lecture gives:

$$PA \equiv \neg O \neg A$$

Meaning: being permitted to do $A$ is equivalent to not being obliged not to do $A$.

In words: you can do $A$ if you want to.

## Axioms

The slide gives three axioms.

### Axiom 1

$$(\vDash A) \rightarrow (\vDash OA)$$

Meaning: if $A$ is always true, then it is obligatory that $A$ is true.

[UNCLEAR] The transcript says “A is a technology”; this should be “A is a tautology.”

### Axiom 2

$$O(A \rightarrow B) \rightarrow (OA \rightarrow OB)$$

Meaning: if it is obligatory that $A$ implies $B$, then if $A$ is obligatory, $B$ is also obligatory.

### Axiom 3

$$OA \rightarrow PA$$

Meaning: if you are obliged to do something, then you are also permitted to do it.

## Semantics vs monitoring

The lecturer says the semantics of deontic logic is tricky.

However, monitoring for violations is generally straightforward:

- If an agent is obliged to do $A$, monitor whether $A$ happens.
- If an agent is obliged not to do $A$, and $A$ happens, then there is a violation.

---

# Events and states: monitoring norm violations

## External environment

The institution is placed around an external environment where concrete things happen.

## External events

Let:

$$\mathcal{E}_{ex}$$

be the set of events in the external environment.

Events are usually agent actions.

## External states

Let:

$$S_{ex}$$

be the set of states in the external environment.

A state is typically considered as a set of propositions that are true in that state.

## Transition function

The environment has a transition function:

$$\tau : S_{ex} \times \mathcal{E}_{ex} \rightarrow S_{ex}$$

This tells us how an event transforms one state into another.

The lecturer assumes determinism for simplicity.

So if the environment is in state $s_0$, and event $e_0$ happens, the system transitions to state $s_1$:

$$s_0 \xrightarrow{e_0} s_1$$

A trace is then:

$$s_0,\ e_0,\ s_1,\ e_1,\ s_2,\ldots$$

The lecturer says this is what happens “out in the real world”: agents take actions and generate a sequence of states and transitions.

---

# Institutional trace

The institution monitors the external trace and creates its own institutional trace.

## Institutional events

Let:

$$\mathcal{E}_{inst}$$

be the set of institutional events.

## Institutional states

Let:

$$S_{inst}$$

be the set of institutional states.

Institutional states are sets of facts, which may include:

- obligations;
- violations;
- sanctions;
- other institutional facts.

## Environment trace induces institution trace

An external trace induces an institutional trace:

$$s'_0,\ e'_0,\ s'_1,\ e'_1,\ s'_2,\ldots$$

The institutional trace records only what the institution cares about.

---

# Generation and consequence functions

## Generation function

The lecturer describes a generation function that takes:

- the current institutional state;
- the current environmental state;
- an external event;

and produces an institutional event.

The slide formula is garbled in the parsed text, but the intended idea is:

$$generation: (S_{inst}, S_{ex}, \mathcal{E}_{ex}) \rightarrow \mathcal{E}_{inst}$$

or, more loosely:

$$g(S_{inst}, S_{ex}, e_{ex}) = e_{inst}$$

[UNCLEAR] The exact formal type on the slide is parsed as something like

$$inst \cup ex \times \mathcal{E}_{ex} \rightarrow \mathcal{E}_{inst}$$

so the notation should be checked against the recording/slides.

## Consequence function

The consequence function takes:

- an institutional state;
- an institutional event;

and returns the next institutional state:

$$consequence: S_{inst} \times \mathcal{E}_{inst} \rightarrow S_{inst}$$

or:

$$c(s'_{i}, e'_{i}) = s'_{i+1}$$

The lecturer says the textbook version is more complicated: instead of directly giving the next institutional state, the consequence function may generate facts to add and delete from the institutional state.

---

# Worked example: coursework submission and marking

The lecture gives a concrete example involving coursework deadlines.

## Event sequence

1. Lecturer Barbara sets coursework with a deadline of 2 February.
2. Student Susan completes and submits the coursework on 1 February.
3. Student Vicki completes and submits the coursework on 3 February.
4. Barbara marks Susan’s coursework on 4 February.
5. Barbara marks Vicki’s coursework on 4 March.

---

# Environment trace

The slide on page 8 shows the environment trace.

## Abbreviations

$$cs$$

means coursework set.

$$ss$$

means Susan submits.

$$sv$$

means Vicki submits.

$$ms$$

means Barbara marks Susan’s coursework.

$$mv$$

means Barbara marks Vicki’s coursework.

$$cd(x)$$

means coursework due for $x$.

## Trace

Initial state:

$$start$$

Barbara sets coursework:

$$start \xrightarrow{cs} \{cd(susan), cd(vicki)\}$$

Susan submits:

$$\{cd(susan), cd(vicki)\} \xrightarrow{ss} \{submitted(susan), cd(vicki)\}$$

Vicki submits:

$$\{submitted(susan), cd(vicki)\} \xrightarrow{sv} \{submitted(susan), submitted(vicki)\}$$

Barbara marks Susan’s coursework:

$$\{submitted(susan), submitted(vicki)\} \xrightarrow{ms} \{marked(susan), submitted(vicki)\}$$

Barbara marks Vicki’s coursework:

$$\{marked(susan), submitted(vicki)\} \xrightarrow{mv} \{marked(susan), marked(vicki)\}$$

## Important observation

The environment trace records only external facts such as submission and marking.

It does not itself mark Vicki’s submission as late or Barbara’s marking as late. Those are institutional facts.

---

# Adding new-day transitions

The lecturer adds:

$$new\_day$$

events because deadlines matter institutionally.

The new-day event may not change the external state, but it can matter to the institution because obligations have deadlines.

On slides pages 9–10, these are simplified as:

$$nd$$

The simplified environment trace is:

$$s_0 \xrightarrow{cs} s_1$$

with an $nd$ transition around $s_1$, then:

$$s_1 \xrightarrow{ss} s_2$$

with another $nd$, then:

$$s_2 \xrightarrow{sv} s_3$$

with another $nd$, then:

$$s_3 \xrightarrow{ms} s_4$$

with another $nd$, then:

$$s_4 \xrightarrow{mv} s_5$$

---

# Institution trace

The institution observes the environment trace and creates institutional events and states.

## Initial institutional state

$$s'_0$$

## Coursework set

External event:

$$cs$$

Institutional event:

$$cs'$$

The institution is interested in coursework being set, so it creates obligations.

New institutional state:

$$\{O(susan, submit(f2)),\ O(vicki, submit(f2))\}$$

Meaning:

- Susan is obliged to submit by 2 February.
- Vicki is obliged to submit by 2 February.

Here:

$$f2$$

means February 2.

---

## Susan submits

External event:

$$ss$$

Institutional event:

$$ss'$$

Susan’s submission removes Susan’s obligation to submit.

It also creates an obligation for Barbara to mark Susan’s coursework by 20 February.

New institutional state:

$$\{O(barbara, mark(susan,f20)),\ O(vicki, submit(f2))\}$$

Meaning:

- Barbara is obliged to mark Susan’s coursework by 20 February.
- Vicki is still obliged to submit by 2 February.

Here:

$$f20$$

means February 20.

---

## Vicki’s deadline passes

At the point where a new-day event occurs after the deadline, Vicki has still not submitted.

The institution translates this into an institutional violation event:

$$viol(vicki, submit(f2))$$

This means Vicki violated the obligation to submit by 2 February.

The new institutional state becomes:

$$\{O(barbara, mark(susan,f20)),\ O(vicki, submit(f2)),\ late\_submission(vicki)\}$$

Meaning:

- Barbara is still obliged to mark Susan’s coursework by 20 February.
- Vicki’s original obligation is still represented.
- Vicki now has an institutional fact:

  $$late\_submission(vicki)$$

The lecturer stops the detailed trace here and leaves the rest as an exercise.

She notes that there may later be another violation if Barbara does not mark Vicki’s coursework on time.

---

# What does an agent do with institutional facts?

The lecturer says that although the semantics of obligations and permissions is complex, an agent can still use institutional facts to reason about what to do.

## Obligations as goals

An agent can transform obligations into goals.

Example:

$$O(susan, submit(f2))$$

can become a goal for Susan’s agent:

$$submit\ coursework\ by\ February\ 2$$

## Institutional facts as basis for sanctions

Agents can use institutional facts such as:

$$late\_submission(vicki)$$

to apply sanctions.

Example from the lecture:

A software agent in a coursework marking system such as Canvas could observe that Vicki’s coursework was late. When Barbara marks the coursework, the system could automatically deduct marks as a late penalty.

This is a sanction imposed because of a norm violation.

---

# Connections

- Builds directly on the organisations lecture.
- Institutions are the rules governing organisations.
- Norms are a way of representing those rules.
- Deontic logic connects to the previous semester’s logic material.
- The example connects abstract norms to practical multi-agent systems and institutional monitoring.
- The use of obligations as goals connects back to agent programming and BDI-style reasoning.

## Exam flags

No explicit exam phrase is used in this lecture, but the definitions of institution/norm, deontic notation, trace-based monitoring, and the coursework example are central lecture content.

## Unclear sections to revisit

- [UNCLEAR] “downtick logic” / “down logic” = deontic logic.
- [UNCLEAR] “A is a technology” = A is a tautology.
- [UNCLEAR] The transcript says “This is not a simplified version of the textbook,” but the surrounding explanation says the lecturer is simplifying the textbook version. Recheck recording.
- [UNCLEAR] The exact formal type of the generation function is garbled in the parsed slide text.
- [UNCLEAR] “PHE is Vikki submits” is garbled; the slide abbreviation is $sv$, Vicki submits.
- [UNCLEAR] The transcript sometimes says “Ricky” where the slide and context say Vicki.
