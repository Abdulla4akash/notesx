---
subject: COMP64602
chapter: 61
title: "Week 11 — Question Bank"
language: en
---

# COMP64602 Week 11 — Worked Question Bank

**Topic scope from the uploaded sheet:** verification and validation; testing/model checking/theorem proving; transition systems; LTL checking over execution sequences; CTL, CTL*, ATL, and ATL*; concurrent game structures; Modular Interpreted Systems; perfect/imperfect information and recall; Gwendolen/MCAPL operational semantics; agent-property specification.

**How to use this file:** cover the worked solutions first. Attempt the questions section-by-section. Then uncover the matching solutions and compare your working, especially the step headers.

## Task types identified from the sheet

The sheet supports these worked-task types:

1. Classify verification vs validation, and testing vs model checking vs theorem proving.
2. Build or read a transition-system tuple $\langle S, \to, \Pi, \pi, s_0\rangle$.
3. Check LTL formulae over a concrete execution sequence using atomic propositions, negation, conjunction, next, eventually, always, and until.
4. Convert a universal LTL-style property into CTL* form using $A\phi$.
5. Decide whether a formula is CTL or CTL* using the immediate-path-quantifier rule.
6. Write CTL formulae from short English specifications.
7. Interpret ATL cooperation modalities $\langle\langle A\rangle\rangle\phi$.
8. Check coalition ability in a small concurrent game structure.
9. List valid joint actions from agents' action-availability functions.
10. Unfold an MIS-style global state from local agent states and local transition functions.
11. Classify perfect/imperfect information and perfect/imperfect recall.
12. Use the model-checking idea: negate a property, view the negation as bad paths, and identify a counterexample.
13. Apply a small operational-semantics transition such as adding a belief.
14. Trace the Gwendolen reasoning-cycle stages at a high level.
15. Write simple MCAPL/Gwendolen-style temporal properties involving beliefs, goals, actions/deeds, and temporal operators.
16. Recognise edge cases where testing, LTL, CTL, ATL, MIS, or MCAPL answer different questions.

The sheet does **not** give enough detail to drill full theorem-proving proof rules, full CTL* semantics, full Büchi automata acceptance, or the exact definitions of every MCAPL symbol such as $A$, $I$, $ID$, $P$, and $D$. Those are therefore treated only at the recognition/formulation level.

---

# Section 1 — Mechanical / single-step drills

## Questions

### Q1. Classify the checking activity

For each item, classify the activity as **validation**, **testing**, **model checking**, or **theorem proving**. More than one label may apply if appropriate.

1. You ask users whether the requirement “the auctioneer must always announce a winner” is actually the right requirement.
2. You run 20 hand-picked executions of a robot controller and inspect whether it stops when it sees an obstacle.
3. You model the controller as a transition system and check that all possible executions satisfy a temporal formula.
4. You prove symbolically that if a precondition $\phi$ holds at the start, then a postcondition $\psi$ holds at the end.

### Q2. Build the transition-system tuple

A tiny system has two states $s_0$ and $s_1$. From $s_0$ it may move to $s_1$. From $s_1$ it loops to itself. The propositions are $ready$ and $done$. Proposition $ready$ is true only in $s_0$; proposition $done$ is true only in $s_1$. The initial state is $s_0$.

Write the transition system $\langle S, \to, \Pi, \pi, s_0\rangle$.

### Q3. Check the lecture's first LTL running example

The sheet's example path begins:


$$

 c \to b \to a \to \cdots \to e

$$


Check whether the following holds at position 0:


$$

 c \land \bigcirc b \land \bigcirc\bigcirc a

$$


### Q4. Check the lecture's second LTL running example

Using the same path prefix:


$$

 c \to b \to a \to \cdots \to e

$$


Check whether the following holds at position 0:


$$

 c \land \bigcirc c \land \bigcirc\bigcirc \neg a

$$


### Q5. Negate a safety property into a bad-path property

The property is:


$$

\Box \neg S1

$$


1. State its English meaning.
2. Negate it.
3. State what a bad path must do.

### Q6. CTL or CTL*?

Classify each formula as **CTL** or **CTL* but not CTL**, using the sheet's rule: in CTL, every temporal operator must be immediately preceded by a path quantifier.

1. $A\Box E\bigcirc red$
2. $A\Box \Diamond red$
3. $E\Diamond goal$
4. $A\Diamond(p \land \bigcirc q)$

### Q7. Write direct CTL formulae from English

Write a CTL formula for each statement.

1. All requests are eventually acknowledged.
2. It is possible for the system to achieve its goal.
3. It is always possible to move to a fail-safe state.

### Q8. Apply the belief-addition operational transition

The program state is:


$$

\langle \mathcal B, \mathcal G\rangle

$$


where:


$$

\mathcal B = \{safe\}, \qquad \mathcal G = \{deliver\}

$$


The current command is $+obstacle$, meaning “add the belief $obstacle$.” Compute the next state.

---

## Worked solutions — Section 1

### S1. Classify the checking activity

**1. User requirement check**

Step 1: Ask what question is being answered.

The question is: “Is this the right requirement for the real-world system?”

Step 2: Match it to the sheet's distinction.

That is **validation**: did we build/specify the right system?

**Answer:** validation.

**2. Twenty hand-picked executions**

Step 1: Identify the coverage.

Only selected executions are checked.

Step 2: Match to method.

Selected executions are **testing**, not exhaustive model checking.

**Answer:** testing.

**3. Transition system plus all possible executions**

Step 1: Identify the model.

The system is represented formally as a transition system.

Step 2: Identify the coverage.

All possible executions are checked against a formal property.

**Answer:** model checking; it is also a verification activity.

**4. Symbolic precondition-to-postcondition proof**

Step 1: Identify the method.

The reasoning is symbolic and proof-based.

Step 2: Match to sheet.

The sheet contrasts this with testing and model checking as **theorem proving**.

**Answer:** theorem proving; it is also a verification activity.

---

### S2. Build the transition-system tuple

Step 1: List the states.


$$

S = \{s_0, s_1\}

$$


Step 2: List the transition relation.

The system moves from $s_0$ to $s_1$, and $s_1$ loops to itself:


$$

\to = \{(s_0,s_1), (s_1,s_1)\}

$$


Step 3: List the atomic propositions.


$$

\Pi = \{ready, done\}

$$


Step 4: Define the valuation function.

The sheet uses $\pi : \Pi \to 2^S$, so each proposition maps to the set of states where it is true:


$$

\pi(ready) = \{s_0\}

$$



$$

\pi(done) = \{s_1\}

$$


Step 5: State the initial state.


$$

s_0

$$


**Answer:**


$$

\langle \{s_0,s_1\}, \{(s_0,s_1),(s_1,s_1)\}, \{ready,done\}, \pi, s_0\rangle

$$


where $\pi(ready)=\{s_0\}$ and $\pi(done)=\{s_1\}$.

---

### S3. Check the lecture's first LTL running example

Formula:


$$

 c \land \bigcirc b \land \bigcirc\bigcirc a

$$


Path prefix:


$$

0:c, \qquad 1:b, \qquad 2:a

$$


Step 1: Split the conjunction.

The formula is true iff all three parts are true:

1. $c$ at position 0,
2. $\bigcirc b$ at position 0,
3. $\bigcirc\bigcirc a$ at position 0.

Step 2: Check the atomic proposition at the current position.

At position 0, the path has $c$, so:


$$

c \in \pi(0)

$$


This part is true.

Step 3: Check the next operator.

$\bigcirc b$ at position 0 means $b$ must hold at position 1.

At position 1, the path has $b$. This part is true.

Step 4: Check the double-next operator.

$\bigcirc\bigcirc a$ at position 0 means $a$ must hold at position 2.

At position 2, the path has $a$. This part is true.

Step 5: Combine the results.

All conjuncts are true.

**Answer:** the formula is satisfied at position 0.

---

### S4. Check the lecture's second LTL running example

Formula:


$$

 c \land \bigcirc c \land \bigcirc\bigcirc \neg a

$$


Path prefix:


$$

0:c, \qquad 1:b, \qquad 2:a

$$


Step 1: Split the conjunction.

The formula is true iff all three parts are true:

1. $c$ at position 0,
2. $\bigcirc c$ at position 0,
3. $\bigcirc\bigcirc\neg a$ at position 0.

Step 2: Check $c$ at position 0.

Position 0 has $c$, so this part is true.

Step 3: Check $\bigcirc c$.

$\bigcirc c$ means $c$ must hold at position 1.

Position 1 has $b$, not $c$. This part is false.

Step 4: Check $\bigcirc\bigcirc \neg a$.

This means $\neg a$ must hold at position 2.

Position 2 has $a$, so $\neg a$ is false.

Step 5: Combine the results.

A conjunction with any false conjunct is false.

**Answer:** the formula is not satisfied at position 0.

---

### S5. Negate a safety property into a bad-path property

Property:


$$

\Box \neg S1

$$


Step 1: Translate the property.

$\Box$ means “always.” So the property says:

> Always not $S1$.

Equivalently:

> State $S1$ is never reached.

Step 2: Negate the temporal operator.

The negation of “always not $S1$” is “eventually $S1$.”


$$

\neg \Box \neg S1 \equiv \Diamond S1

$$


Step 3: Interpret the bad path.

A bad path is any path that eventually reaches $S1$.

**Answer:**


$$

\neg(\Box \neg S1) = \Diamond S1

$$


A counterexample path is a path where $S1$ is reached at least once.

---

### S6. CTL or CTL*?

Rule from sheet: CTL requires every temporal operator to be immediately preceded by a path quantifier such as $A$ or $E$.

**1. $A\Box E\bigcirc red$**

Step 1: Find temporal operators.

The temporal operators are $\Box$ and $\bigcirc$.

Step 2: Check immediate predecessors.

$\Box$ is immediately preceded by $A$.  
$\bigcirc$ is immediately preceded by $E$.

**Answer:** CTL.

**2. $A\Box \Diamond red$**

Step 1: Find temporal operators.

The temporal operators are $\Box$ and $\Diamond$.

Step 2: Check immediate predecessors.

$\Box$ is immediately preceded by $A$.  
$\Diamond$ is not immediately preceded by $A$ or $E$.

**Answer:** CTL* but not CTL.

**3. $E\Diamond goal$**

Step 1: Find temporal operators.

The temporal operator is $\Diamond$.

Step 2: Check immediate predecessor.

$\Diamond$ is immediately preceded by $E$.

**Answer:** CTL.

**4. $A\Diamond(p \land \bigcirc q)$**

Step 1: Find temporal operators.

The temporal operators are $\Diamond$ and $\bigcirc$.

Step 2: Check immediate predecessors.

$\Diamond$ is immediately preceded by $A$.  
$\bigcirc$ is not immediately preceded by $A$ or $E$.

**Answer:** CTL* but not CTL.

---

### S7. Write direct CTL formulae from English

**1. All requests are eventually acknowledged.**

Step 1: “All” over paths and states suggests universal path/state checking.

Use $A\Box$ for “on all paths, always.”

Step 2: “If request, eventually acknowledgement.”

At any request state, all paths should eventually reach $ack$:


$$

req \Rightarrow A\Diamond ack

$$


Step 3: Combine.


$$

A\Box(req \Rightarrow A\Diamond ack)

$$


**Answer:** $A\Box(req \Rightarrow A\Diamond ack)$.

**2. It is possible for the system to achieve its goal.**

Step 1: “Possible” means existential path.

Use $E$.

Step 2: “Achieve eventually” means $\Diamond goal$.

**Answer:**


$$

E\Diamond goal

$$


**3. It is always possible to move to a fail-safe state.**

Step 1: “Always” means check every reachable point.

Use $A\Box$.

Step 2: “Possible to move/reach fail-safe” means there exists a path eventually reaching $fail\_safe$.

Use $E\Diamond fail\_safe$.

**Answer:**


$$

A\Box E\Diamond fail\_safe

$$


---

### S8. Apply the belief-addition operational transition

Initial state:


$$

\langle \{safe\}, \{deliver\}\rangle

$$


Command:


$$

+obstacle

$$


Step 1: Use the operational transition pattern from the sheet.


$$

\langle \mathcal B, \mathcal G\rangle \xrightarrow{+b} \langle \mathcal B \cup \{b\}, \mathcal G\rangle

$$


Step 2: Substitute $b = obstacle$.


$$

\mathcal B \cup \{obstacle\} = \{safe, obstacle\}

$$


Step 3: Keep the goal base unchanged.


$$

\mathcal G = \{deliver\}

$$


**Answer:**


$$

\langle \{safe\}, \{deliver\}\rangle \xrightarrow{+obstacle} \langle \{safe, obstacle\}, \{deliver\}\rangle

$$


---

# Section 2 — Multi-condition checks

## Questions

### Q9. Check several LTL formulae on one infinite path

Consider the infinite path $\sigma$:


$$

0:\{p\}, \quad 1:\{p,q\}, \quad 2:\{q\}, \quad 3:\{r\}, \quad 4:\{r\}, \quad 5:\{r\}, \ldots

$$


So from position 3 onward, $r$ holds forever.

At position 0, decide whether each formula is true or false.

1. $p\ U\ r$
2. $\Diamond r$
3. $\Box q$
4. $\bigcirc(p \land q)$
5. $\Diamond\Box r$

### Q10. Check CTL formulae on a branching model

A model has states $s_0,s_1,s_2,s_3$ with transitions:


$$

s_0 \to s_1, \quad s_0 \to s_2, \quad s_1 \to s_1, \quad s_2 \to s_3, \quad s_3 \to s_3

$$


Valuations:


$$

ack \text{ is true only at } s_1

$$



$$

req \text{ is true at } s_0 \text{ and } s_2

$$



$$

fail \text{ is true only at } s_3

$$


At $s_0$, check:

1. $E\Diamond ack$
2. $A\Diamond ack$
3. $A\Box(req \Rightarrow A\Diamond ack)$
4. $A\Box E\Diamond ack$

### Q11. Translate an LTL-style property into CTL* and a CTL-style version

The LTL-style property is:


$$

\Box(req \Rightarrow \Diamond ack)

$$


1. Write its CTL* translation using the sheet's rule that LTL becomes $A\phi$.
2. Write the usual CTL formula from the sheet for “all requests are eventually acknowledged.”
3. Explain why the CTL formula obeys the immediate-path-quantifier rule.

### Q12. Check ATL coalition ability in the two-robot carriage setting

Use the following concurrent game at position $pos0$. Agents $R1$ and $R2$ each have actions $wait$ and $push$.

Transition table from $pos0$:

| Joint action $(R1,R2)$ | Next position |
|---|---|
| $(wait,wait)$ | $pos0$ |
| $(push,wait)$ | $pos0$ |
| $(wait,push)$ | $pos0$ |
| $(push,push)$ | $pos1$ |

Check at $pos0$:

1. $\langle\langle R1,R2\rangle\rangle \bigcirc pos1$
2. $\langle\langle R1\rangle\rangle \bigcirc pos1$
3. $\langle\langle R1\rangle\rangle \Box \neg pos1$, assuming the same table applies whenever the carriage is at $pos0$ and $R1$ may repeatedly choose $wait$.

### Q13. List valid joint actions in a concurrent game structure

At state $s$, the available actions are:


$$

d(a_1,s)=\{x,y\}, \qquad d(a_2,s)=\{u\}, \qquad d(a_3,s)=\{m,n\}

$$


1. List all valid joint actions.
2. Explain why $(x,v,m)$ is invalid.

### Q14. Unfold one MIS-style global transition

There are two agents, $A$ and $B$.

Local states:


$$

St_A = \{idle, ready\}, \qquad St_B = \{low, ok\}

$$


Current global state:


$$

s = \langle idle, low\rangle

$$


Available actions:


$$

d_A(idle)=\{charge, wait\}, \qquad d_B(low)=\{charge\}

$$


Local transition functions:

- $o_A(idle, \langle charge, charge\rangle)=ready$
- $o_A(idle, \langle wait, charge\rangle)=idle$
- $o_B(low, \langle charge, charge\rangle)=ok$
- $o_B(low, \langle wait, charge\rangle)=ok$

1. List the available joint actions from $s$.
2. Compute the successor global state for each joint action.

### Q15. Perfect/imperfect information and recall

Classify each agent controller.

1. Controller $C_1$ can observe the full global state and remembers every previous state and action.
2. Controller $C_2$ can observe only its local sensor reading but remembers the full history of its sensor readings and actions.
3. Controller $C_3$ can observe the full global state but chooses only from the current state, ignoring history.

### Q16. Trace one pass of the Gwendolen reasoning cycle

An agent has one unsuspended, non-empty intention. There are two applicable plans for that intention. The selected plan adds a deed to the top of the current intention. The current intention is not empty after the plan is applied.

Using the sheet's stages A–F, state which stages are reached before perception/message handling.

---

## Worked solutions — Section 2

### S9. Check several LTL formulae on one infinite path

Path:


$$

0:\{p\}, \quad 1:\{p,q\}, \quad 2:\{q\}, \quad 3:\{r\}, \quad 4:\{r\}, \ldots

$$


**1. $p\ U\ r$**

Step 1: Use the until condition.

$p\ U\ r$ is true if there is some future position where $r$ holds, and $p$ holds at every position before that point.

Step 2: Find the first position where $r$ holds.

$r$ first holds at position 3.

Step 3: Check $p$ before position 3.

Before position 3, check positions 0, 1, and 2.

- Position 0 has $p$.
- Position 1 has $p$.
- Position 2 does **not** have $p$.

Step 4: Conclude.

The until condition fails because $p$ does not hold at all earlier positions.

**Answer:** false.

**2. $\Diamond r$**

Step 1: Use eventually.

$\Diamond r$ is true if $r$ holds at some position $j \geq 0$.

Step 2: Check the path.

$r$ holds at position 3.

**Answer:** true.

**3. $\Box q$**

Step 1: Use always.

$\Box q$ is true if $q$ holds at every position from 0 onward.

Step 2: Check position 0.

Position 0 has only $p$, not $q$.

Step 3: One counter-position is enough.

Since $q$ already fails at position 0, $\Box q$ is false.

**Answer:** false.

**4. $\bigcirc(p \land q)$**

Step 1: Use next.

$\bigcirc(p \land q)$ at position 0 asks whether $p \land q$ holds at position 1.

Step 2: Check position 1.

Position 1 has $\{p,q\}$.

Step 3: Check the conjunction.

Both $p$ and $q$ hold.

**Answer:** true.

**5. $\Diamond\Box r$**

Step 1: Parse the formula.

$\Diamond\Box r$ means: eventually, from some future point onward, $r$ is always true.

Step 2: Find a candidate future point.

At position 3, $r$ holds, and the path stays with $r$ forever.

Step 3: Check the always part.

From position 3 onward, every position contains $r$.

**Answer:** true.

---

### S10. Check CTL formulae on a branching model

Model:


$$

s_0 \to s_1, \quad s_0 \to s_2, \quad s_1 \to s_1, \quad s_2 \to s_3, \quad s_3 \to s_3

$$


$ack$ is true only at $s_1$.  
$req$ is true at $s_0$ and $s_2$.  
$fail$ is true only at $s_3$.

**1. $E\Diamond ack$ at $s_0$**

Step 1: Parse the formula.

There exists a path where eventually $ack$ is reached.

Step 2: Look for one successful path.

There is a path:


$$

s_0 \to s_1 \to s_1 \to \cdots

$$


Step 3: Check $ack$.

$ack$ is true at $s_1$.

**Answer:** true.

**2. $A\Diamond ack$ at $s_0$**

Step 1: Parse the formula.

All paths from $s_0$ must eventually reach $ack$.

Step 2: Look for a failing path.

There is a path:


$$

s_0 \to s_2 \to s_3 \to s_3 \to \cdots

$$


Step 3: Check $ack$ on that path.

Neither $s_2$ nor $s_3$ has $ack$.

**Answer:** false.

**3. $A\Box(req \Rightarrow A\Diamond ack)$ at $s_0$**

Step 1: Parse the outer part.

At every reachable state on every path, if $req$ holds, then all paths from that state must eventually reach $ack$.

Step 2: Check reachable request states.

$req$ holds at $s_0$ and $s_2$.

Step 3: Check $s_2$.

From $s_2$, the only path goes:


$$

s_2 \to s_3 \to s_3 \to \cdots

$$


$ack$ is never reached.

Step 4: Conclude.

The implication fails at $s_2$.

**Answer:** false.

**4. $A\Box E\Diamond ack$ at $s_0$**

Step 1: Parse the formula.

At every reachable state, there must exist some path to $ack$.

Step 2: Check all reachable states.

Reachable states are $s_0,s_1,s_2,s_3$.

Step 3: Find a failing state.

At $s_2$, the only path goes to $s_3$, and $ack$ is never reached. At $s_3$, the only path loops at $s_3$, also without $ack$.

**Answer:** false.

---

### S11. Translate an LTL-style property into CTL* and a CTL-style version

LTL-style property:


$$

\Box(req \Rightarrow \Diamond ack)

$$


**1. CTL* translation**

Step 1: Use the sheet's rule.

Any LTL formula $\phi$ translates into CTL* as:


$$

A\phi

$$


Step 2: Substitute the formula.


$$

A\Box(req \Rightarrow \Diamond ack)

$$


**Answer:** $A\Box(req \Rightarrow \Diamond ack)$.

**2. CTL version from the sheet**

Step 1: Use the sheet's direct CTL formula for “all requests are eventually acknowledged.”


$$

A\Box(req \Rightarrow A\Diamond ack)

$$


Step 2: Notice the extra $A$ before $\Diamond$.

That extra path quantifier is what makes the formula CTL-style.

**Answer:** $A\Box(req \Rightarrow A\Diamond ack)$.

**3. Immediate-path-quantifier check**

Step 1: Identify temporal operators.

The temporal operators are $\Box$ and $\Diamond$.

Step 2: Check immediate predecessors.

$\Box$ is immediately preceded by $A$.  
$\Diamond$ is immediately preceded by $A$.

**Answer:** the CTL version obeys the CTL rule because every temporal operator is immediately paired with $A$ or $E$.

---

### S12. Check ATL coalition ability in the two-robot carriage setting

Transition table from $pos0$:

| Joint action $(R1,R2)$ | Next position |
|---|---|
| $(wait,wait)$ | $pos0$ |
| $(push,wait)$ | $pos0$ |
| $(wait,push)$ | $pos0$ |
| $(push,push)$ | $pos1$ |

**1. $\langle\langle R1,R2\rangle\rangle \bigcirc pos1$**

Step 1: Parse the formula.

The coalition $\{R1,R2\}$ must have a joint strategy to ensure $pos1$ in the next state.

Step 2: Since both agents are in the coalition, they control both components of the joint action.

They can jointly choose:


$$

(push,push)

$$


Step 3: Check the transition table.

$(push,push)$ leads to $pos1$.

**Answer:** true.

**2. $\langle\langle R1\rangle\rangle \bigcirc pos1$**

Step 1: Parse the formula.

Agent $R1$ alone must choose an action that guarantees $pos1$, regardless of what $R2$ does.

Step 2: Try $R1=push$.

If $R2=push$, the result is $pos1$.  
If $R2=wait$, the result is $pos0$.

Step 3: Try $R1=wait$.

Both $(wait,wait)$ and $(wait,push)$ lead to $pos0$.

Step 4: Conclude.

No single action by $R1$ guarantees $pos1$.

**Answer:** false.

**3. $\langle\langle R1\rangle\rangle \Box \neg pos1$**

Step 1: Parse the formula.

$R1$ must have a strategy to ensure that $pos1$ is never reached.

Step 2: Try the strategy “always wait.”

If $R1=wait$, possible joint actions are:


$$

(wait,wait), \qquad (wait,push)

$$


Step 3: Check the table.

Both lead to $pos0$, not $pos1$.

Step 4: Repeatability assumption.

The question states that $R1$ may repeatedly choose $wait$ under the same transition pattern at $pos0$.

**Answer:** true under the stated table/assumption.

---

### S13. List valid joint actions in a concurrent game structure

Available actions:


$$

d(a_1,s)=\{x,y\}, \qquad d(a_2,s)=\{u\}, \qquad d(a_3,s)=\{m,n\}

$$


**1. Valid joint actions**

Step 1: Use the CGS condition.

A joint action $(\alpha_1,\alpha_2,\alpha_3)$ is valid only if:


$$

\alpha_i \in d(a_i,s)

$$


for each agent.

Step 2: Combine each choice for $a_1$, $a_2$, and $a_3$.

$a_1$ has $x$ or $y$.  
$a_2$ has only $u$.  
$a_3$ has $m$ or $n$.

Step 3: List the Cartesian product.


$$

(x,u,m), \quad (x,u,n), \quad (y,u,m), \quad (y,u,n)

$$


**Answer:** these four joint actions are valid.

**2. Why $(x,v,m)$ is invalid**

Step 1: Check each component.

$x \in d(a_1,s)$, so the first component is valid.

Step 2: Check the second component.

$v \notin d(a_2,s)$, because $d(a_2,s)=\{u\}$.

Step 3: One invalid component invalidates the whole tuple.

**Answer:** $(x,v,m)$ is invalid because agent $a_2$ cannot choose $v$ at state $s$.

---

### S14. Unfold one MIS-style global transition

Current global state:


$$

s = \langle idle, low\rangle

$$


Available actions:


$$

d_A(idle)=\{charge, wait\}, \qquad d_B(low)=\{charge\}

$$


**1. Available joint actions**

Step 1: Use the MIS joint-action rule.


$$

d(s)=\{\langle \alpha_A,\alpha_B\rangle \mid \alpha_A\in d_A(s_A), \alpha_B\in d_B(s_B)\}

$$


Step 2: Substitute current local states.

$A$ may choose $charge$ or $wait$.  
$B$ must choose $charge$.

Step 3: List the combinations.


$$

\langle charge, charge\rangle, \qquad \langle wait, charge\rangle

$$


**Answer:** two joint actions are available.

**2. Successor for each joint action**

Step 1: Use the MIS successor rule.

The next global state is:


$$

\langle o_A(s_A,\alpha), o_B(s_B,\alpha)\rangle

$$


Step 2: Compute successor for $\langle charge, charge\rangle$.

Given:


$$

o_A(idle, \langle charge, charge\rangle)=ready

$$



$$

o_B(low, \langle charge, charge\rangle)=ok

$$


So:


$$

\langle idle,low\rangle \to \langle ready,ok\rangle

$$


Step 3: Compute successor for $\langle wait, charge\rangle$.

Given:


$$

o_A(idle, \langle wait, charge\rangle)=idle

$$



$$

o_B(low, \langle wait, charge\rangle)=ok

$$


So:


$$

\langle idle,low\rangle \to \langle idle,ok\rangle

$$


**Answer:**


$$

\langle charge,charge\rangle \mapsto \langle ready,ok\rangle

$$



$$

\langle wait,charge\rangle \mapsto \langle idle,ok\rangle

$$


---

### S15. Perfect/imperfect information and recall

**1. $C_1$**

Step 1: Information check.

It observes the full global state, so it has perfect information.

Step 2: Recall check.

It remembers every previous state and action, so it has perfect recall.

**Answer:** perfect information, perfect recall.

**2. $C_2$**

Step 1: Information check.

It observes only a local sensor reading, so different global states may look identical.

That is imperfect information.

Step 2: Recall check.

It remembers the full history of its sensor readings and actions.

That is perfect recall over what it can observe.

**Answer:** imperfect information, perfect recall.

**3. $C_3$**

Step 1: Information check.

It observes the full global state, so it has perfect information.

Step 2: Recall check.

It ignores history and uses only the current state.

That is imperfect recall.

**Answer:** perfect information, imperfect recall.

---

### S16. Trace one pass of the Gwendolen reasoning cycle

Given:

- one unsuspended, non-empty intention,
- two applicable plans,
- one selected plan,
- the intention remains non-empty after the plan is applied.

Step 1: Start at Stage A.

Stage A selects a current intention or sleeps the agent.

Since there is an unsuspended, non-empty intention, the agent selects it and proceeds.

Step 2: Go to Stage B.

Stage B finds all plans applicable to the current intention.

The question says there are two applicable plans.

Step 3: Go to Stage C.

Stage C picks a plan and applies it.

The question says one plan is selected and adds a deed to the current intention.

Step 4: Use the Stage C decision point.

After the plan is applied, the current intention is not empty.

So the agent does not go to perception/message handling yet.

Step 5: Go to Stage D.

Stage D executes the top deed on the current intention.

**Answer:** before perception/message handling, the stages reached are:


$$

A \to B \to C \to D

$$


---

# Section 3 — Building things from scratch

## Questions

### Q17. Build the model-checking bad-path check

A system has states $s_0,s_1,s_2$ with transitions:


$$

s_0\to s_1, \quad s_1\to s_1, \quad s_0\to s_2, \quad s_2\to s_2

$$


The property is:


$$

\Box \neg s_2

$$


1. Negate the property.
2. State the bad-path condition.
3. Give a counterexample path if one exists.

### Q18. Build CTL formulae from English specifications

Write CTL formulae for the following.

1. From every reachable state, it is possible to eventually return to $idle$.
2. Whenever $alarm$ is true, every path eventually reaches $safe$.
3. There exists a path where the system eventually reaches $goal$ and then always remains stable.

### Q19. Build ATL formulae from English specifications

Write ATL/ATL*-style formulae for the following.

1. Team $\{a_1,a_2\}$ can ensure that $goal$ is true in the next state.
2. Agent $a_1$ can ensure that $collision$ never happens.
3. Team $T$ can ensure that if $request$ occurs, $ack$ eventually occurs.

### Q20. Build an MIS global model fragment

There are two agents and an environment.

Current local/global components:


$$

s = \langle s_A, s_B, s_{env}\rangle = \langle idle, waiting, clear\rangle

$$


Available actions:


$$

d_A(idle)=\{send, wait\}

$$



$$

d_B(waiting)=\{receive, wait\}

$$



$$

d_{env}(clear)=\{stay\}

$$


Local transition functions for selected joint actions:

- If $\alpha = \langle send, receive, stay\rangle$, then:
  
$$

  o_A(idle,\alpha)=idle, \quad o_B(waiting,\alpha)=got\_msg, \quad o_{env}(clear,\alpha)=clear
  
$$

- If $\alpha = \langle wait, wait, stay\rangle$, then:
  
$$

  o_A(idle,\alpha)=idle, \quad o_B(waiting,\alpha)=waiting, \quad o_{env}(clear,\alpha)=clear
  
$$


1. List all joint actions from the current state.
2. Compute the next global state for the two joint actions whose transitions are specified.
3. Explain what information would still be needed to fully unfold the model.

### Q21. Build a Gwendolen/MCAPL property from an English requirement

The requirement is:

> If agent $ag1$ believes there is an obstacle, then in the next step it has the goal to stop.

1. Write the property using the belief and goal notation from the sheet.
2. If implication is not treated as primitive, rewrite it using $\neg$ and $\lor$.

### Q22. Trace the car-agent program skeleton

Use the sheet's car-agent plans:

```text
+start: {True} <- +!at_speed_limit[achieve];
+! at_speed_limit [achieve] : {True} <- perf(accelerate), *at_speed_limit;
+at_speed_limit: {True} <- perf(maintain_speed);
```

Assume the environment first adds percept $start$, and later adds percept $at\_speed\_limit$.

Trace the intended high-level behaviour of the agent.

### Q23. Build the random-percept checking scenario

The sheet's environment code randomly chooses whether to assert:

- $start$,
- $at\_speed\_limit$.

The property is:


$$

\Box(B_{car}at\_speed\_limit \to \Diamond D_{car}maintain\_speed)

$$


Explain how model checking treats the random environment choices.

---

## Worked solutions — Section 3

### S17. Build the model-checking bad-path check

Property:


$$

\Box \neg s_2

$$


System transitions:


$$

s_0\to s_1, \quad s_1\to s_1, \quad s_0\to s_2, \quad s_2\to s_2

$$


**1. Negate the property**

Step 1: Translate the property.

$\Box \neg s_2$ means “always not $s_2$,” i.e. $s_2$ is never reached.

Step 2: Negate.


$$

\neg\Box\neg s_2 \equiv \Diamond s_2

$$


**Answer:** $\Diamond s_2$.

**2. Bad-path condition**

Step 1: Use the model-checking idea from the sheet.

The negated property represents bad paths.

Step 2: Interpret $\Diamond s_2$.

A bad path is any path that eventually reaches $s_2$.

**Answer:** bad path = a path that reaches $s_2$ at least once.

**3. Counterexample path**

Step 1: Look from the initial state $s_0$.

There is a transition:


$$

s_0 \to s_2

$$


Step 2: Extend it to an execution path.

Since $s_2$ loops to itself:


$$

s_0 \to s_2 \to s_2 \to s_2 \to \cdots

$$


Step 3: Check the bad condition.

This path reaches $s_2$, so it satisfies $\Diamond s_2$.

**Answer:** the property fails; a counterexample is $s_0\to s_2\to s_2\to\cdots$.

---

### S18. Build CTL formulae from English specifications

**1. From every reachable state, it is possible to eventually return to $idle$.**

Step 1: “Every reachable state” suggests $A\Box$.

Step 2: “Possible to eventually return” suggests $E\Diamond idle$.

Step 3: Combine.


$$

A\Box E\Diamond idle

$$


**Answer:** $A\Box E\Diamond idle$.

**2. Whenever $alarm$ is true, every path eventually reaches $safe$.**

Step 1: “Whenever” across reachable states suggests $A\Box$.

Step 2: The local condition is an implication:


$$

alarm \Rightarrow \cdots

$$


Step 3: “Every path eventually reaches safe” suggests $A\Diamond safe$.

**Answer:**


$$

A\Box(alarm \Rightarrow A\Diamond safe)

$$


**3. There exists a path where the system eventually reaches $goal$ and then always remains stable.**

Step 1: “There exists a path” suggests $E$.

Step 2: “Eventually reaches goal and then always remains stable” suggests:


$$

\Diamond(goal \land \Box stable)

$$


Step 3: Combine.


$$

E\Diamond(goal \land \Box stable)

$$


Step 4: CTL caution.

As written, $\Box$ is not immediately preceded by a path quantifier, so this is CTL* style, not CTL under the sheet's immediate-quantifier rule. A CTL-style approximation would need a path quantifier before the inner $\Box$, for example:


$$

E\Diamond(goal \land A\Box stable)

$$


if the intended meaning is “eventually reach a goal state from which all paths remain stable.”

**Answer:** CTL* version: $E\Diamond(goal \land \Box stable)$. CTL-style strengthened version: $E\Diamond(goal \land A\Box stable)$.

---

### S19. Build ATL formulae from English specifications

**1. Team $\{a_1,a_2\}$ can ensure that $goal$ is true in the next state.**

Step 1: Coalition ability uses $\langle\langle A\rangle\rangle$.

Step 2: “Next state” uses $\bigcirc$.

**Answer:**


$$

\langle\langle a_1,a_2\rangle\rangle\bigcirc goal

$$


**2. Agent $a_1$ can ensure that $collision$ never happens.**

Step 1: Single-agent coalition:


$$

\langle\langle a_1\rangle\rangle

$$


Step 2: “Never collision” means always not collision:


$$

\Box \neg collision

$$


**Answer:**


$$

\langle\langle a_1\rangle\rangle\Box\neg collision

$$


**3. Team $T$ can ensure that if $request$ occurs, $ack$ eventually occurs.**

Step 1: Coalition ability:


$$

\langle\langle T\rangle\rangle

$$


Step 2: The temporal objective is “always, if request then eventually ack”:


$$

\Box(request \Rightarrow \Diamond ack)

$$


Step 3: Combine.


$$

\langle\langle T\rangle\rangle\Box(request \Rightarrow \Diamond ack)

$$


Step 4: ATL/ATL* caution.

This is ATL*-style because the $\Diamond$ is nested inside the path objective. If the exam asks specifically for ATL, check whether the temporal operators must be immediately paired with the cooperation modality. Under the sheet's simplified rule, the formula is best treated as ATL* unless rewritten into an allowed ATL fragment.

**Answer:** $\langle\langle T\rangle\rangle\Box(request \Rightarrow \Diamond ack)$, ATL*-style.

---

### S20. Build an MIS global model fragment

Current global state:


$$

s = \langle idle, waiting, clear\rangle

$$


Available actions:


$$

d_A(idle)=\{send, wait\}

$$



$$

d_B(waiting)=\{receive, wait\}

$$



$$

d_{env}(clear)=\{stay\}

$$


**1. List all joint actions**

Step 1: Use the MIS joint-action set.


$$

d(s)=\{\langle \alpha_A,\alpha_B,\alpha_{env}\rangle \mid \alpha_A\in d_A(s_A), \alpha_B\in d_B(s_B), \alpha_{env}\in d_{env}(s_{env})\}

$$


Step 2: Combine the options.

$A$: $send$ or $wait$.  
$B$: $receive$ or $wait$.  
Environment: $stay$ only.

Step 3: List the Cartesian product.


$$

\langle send,receive,stay\rangle

$$



$$

\langle send,wait,stay\rangle

$$



$$

\langle wait,receive,stay\rangle

$$



$$

\langle wait,wait,stay\rangle

$$


**Answer:** four joint actions.

**2. Compute specified next states**

Step 1: Use the MIS successor rule.


$$

next(s,\alpha)=\langle o_A(s_A,\alpha), o_B(s_B,\alpha), o_{env}(s_{env},\alpha)\rangle

$$


Step 2: For $\alpha=\langle send,receive,stay\rangle$:

Given:


$$

o_A(idle,\alpha)=idle

$$



$$

o_B(waiting,\alpha)=got\_msg

$$



$$

o_{env}(clear,\alpha)=clear

$$


So:


$$

\langle idle,waiting,clear\rangle \to \langle idle,got\_msg,clear\rangle

$$


Step 3: For $\alpha=\langle wait,wait,stay\rangle$:

Given:


$$

o_A(idle,\alpha)=idle

$$



$$

o_B(waiting,\alpha)=waiting

$$



$$

o_{env}(clear,\alpha)=clear

$$


So:


$$

\langle idle,waiting,clear\rangle \to \langle idle,waiting,clear\rangle

$$


**Answer:**


$$

\langle send,receive,stay\rangle \mapsto \langle idle,got\_msg,clear\rangle

$$



$$

\langle wait,wait,stay\rangle \mapsto \langle idle,waiting,clear\rangle

$$


**3. Missing information**

Step 1: Check which joint actions are not specified.

The unspecified actions are:


$$

\langle send,wait,stay\rangle

$$



$$

\langle wait,receive,stay\rangle

$$


Step 2: State what is needed.

To fully unfold the model, we need $o_A$, $o_B$, and $o_{env}$ for those joint actions too.

**Answer:** the full local transition functions for every available joint action are needed.

---

### S21. Build a Gwendolen/MCAPL property from an English requirement

Requirement:

> If agent $ag1$ believes there is an obstacle, then in the next step it has the goal to stop.

**1. Write the property**

Step 1: Identify the belief part.

“Agent $ag1$ believes there is an obstacle” is:


$$

B(ag1, obstacle)

$$


Step 2: Identify the next-goal part.

“In the next step it has the goal to stop” is:


$$

\bigcirc G(ag1, stop)

$$


Step 3: Combine with implication.


$$

B(ag1, obstacle) \to \bigcirc G(ag1, stop)

$$


**Answer:** $B(ag1, obstacle) \to \bigcirc G(ag1, stop)$.

**2. Rewrite implication using $\neg$ and $\lor$**

Step 1: Use the propositional equivalence.


$$

P \to Q \equiv \neg P \lor Q

$$


Step 2: Substitute:


$$

P = B(ag1, obstacle)

$$



$$

Q = \bigcirc G(ag1, stop)

$$


Step 3: Rewrite.


$$

\neg B(ag1, obstacle) \lor \bigcirc G(ag1, stop)

$$


**Answer:** $\neg B(ag1, obstacle) \lor \bigcirc G(ag1, stop)$.

---

### S22. Trace the car-agent program skeleton

Plans:

```text
+start: {True} <- +!at_speed_limit[achieve];
+! at_speed_limit [achieve] : {True} <- perf(accelerate), *at_speed_limit;
+at_speed_limit: {True} <- perf(maintain_speed);
```

Step 1: Process the $start$ percept.

When $+start$ is added/perceived, the first plan applies:

```text
+start: {True} <- +!at_speed_limit[achieve];
```

So the agent adopts the achievement goal:


$$

at\_speed\_limit

$$


Step 2: Process the achievement goal.

The second plan applies to the goal:

```text
+! at_speed_limit [achieve] : {True} <- perf(accelerate), *at_speed_limit;
```

So the agent performs:


$$

perf(accelerate)

$$


then waits/tests for:


$$

at\_speed\_limit

$$


Step 3: Process the later $at\_speed\_limit$ percept.

When $+at\_speed\_limit$ is added/perceived, the third plan applies:

```text
+at_speed_limit: {True} <- perf(maintain_speed);
```

So the agent performs:


$$

perf(maintain\_speed)

$$


**Answer:** high-level trace:


$$

start \Rightarrow +!at\_speed\_limit \Rightarrow perf(accelerate) \Rightarrow at\_speed\_limit \Rightarrow perf(maintain\_speed)

$$


---

### S23. Build the random-percept checking scenario

Property:


$$

\Box(B_{car}at\_speed\_limit \to \Diamond D_{car}maintain\_speed)

$$


Step 1: Identify the environment nondeterminism.

The environment may assert or not assert:

- $start$,
- $at\_speed\_limit$.

Step 2: Model checking does not check just one random run.

The model checker explores possible execution branches produced by these choices.

Step 3: Interpret the property.

At every point in every explored execution, if the car believes $at\_speed\_limit$, then eventually the car should do/try $maintain\_speed$.

Step 4: State the failure condition.

A counterexample is a branch where:

1. $B_{car}at\_speed\_limit$ becomes true, and
2. there is no later $D_{car}maintain\_speed$.

Step 5: Connect to the car plans.

The sheet's plan:

```text
+at_speed_limit: {True} <- perf(maintain_speed);
```

is the intended mechanism that should make the property hold when $at\_speed\_limit$ is perceived/believed.

**Answer:** model checking treats the random percept generator as branching behaviour and checks the property across the resulting execution tree, returning a bad branch if the belief occurs without eventual maintain-speed behaviour.

---

# Section 4 — Hard edge cases and method traps

## Questions

### Q24. Testing passes, but verification may still fail

A robot is tested on one path:


$$

s_0 \to s_1 \to s_2

$$


On that path, whenever $obstacle$ is true, the robot eventually performs $stop$. The full transition system also has another path:


$$

s_0 \to s_3 \to s_4 \to s_4 \to \cdots

$$


where $obstacle$ is true at $s_3$ and $stop$ never occurs.

Does the successful test path establish the model-checking property?


$$

\Box(obstacle \Rightarrow \Diamond stop)

$$


### Q25. Finite prefix trap for $\Box$ and $\Diamond$

You observe a finite execution prefix:


$$

s_0:p, \quad s_1:p, \quad s_2:p

$$


Can you conclude that $\Box p$ is true? Can you conclude that $\Diamond q$ is false?

### Q26. CTL immediate-quantifier trap

Classify each formula as CTL or CTL* but not CTL.

1. $A\Box A\Diamond p$
2. $A\Box\Diamond p$
3. $A\Diamond A\Box p$
4. $A\Diamond\Box p$

### Q27. ATL is not the same as existential path

At state $s$, agents $a_1$ and $a_2$ each choose $L$ or $R$. Proposition $win$ is true in the next state only for joint action $(L,L)$. For all other joint actions, $win$ is false.

At $s$, compare:

1. $E\bigcirc win$
2. $\langle\langle a_1\rangle\rangle\bigcirc win$
3. $\langle\langle a_1,a_2\rangle\rangle\bigcirc win$

### Q28. Imperfect information can destroy a strategy

Agent $i$ cannot distinguish states $s_A$ and $s_B$:


$$

s_A \sim_i s_B

$$


At $s_A$, action $left$ leads to $goal$, while $right$ leads to failure.  
At $s_B$, action $right$ leads to $goal$, while $left$ leads to failure.

Assume the agent must choose the same action in indistinguishable states. Can agent $i$ ensure $\bigcirc goal$ under imperfect information?

### Q29. Choose the simplest adequate logic

For each requirement, choose the simplest logic family from the sheet: LTL, CTL, ATL, or MCAPL/Gwendolen property logic.

1. “On every execution, every request is eventually acknowledged.”
2. “There exists some path where recovery eventually happens.”
3. “Team $T$ can force the system to reach $goal$.”
4. “If agent $ag1$ believes obstacle, then its next goal is stop.”

### Q30. Do not over-define symbols the sheet leaves unclear

A question asks: “In the MCAPL grammar, define exactly what $A_{ag}f$, $I_{ag}f$, $ID_{ag}f$, $P(f)$, and $D_{ag}f$ mean.”

Based only on this Week 11 sheet, how should you answer safely?

### Q31. Negating liveness is not the same as a short failed prefix

The property is:


$$

\Diamond goal

$$


1. Negate it.
2. What kind of counterexample path violates the property?
3. Why is a finite prefix without $goal$ not automatically enough?

### Q32. MIS valuation ambiguity with agent-specific propositions

Suppose a global state is:


$$

s=\langle s_1,s_2\rangle

$$


Proposition $battery\_low$ belongs only to agent 1's local propositions. The slide gives a compact valuation idea but is unclear about agent-specific propositions.

How should you handle this in an exam-style answer?

---

## Worked solutions — Section 4

### S24. Testing passes, but verification may still fail

Step 1: Identify what testing established.

The tested path:


$$

s_0 \to s_1 \to s_2

$$


satisfies the property on that one execution.

Step 2: Identify what model checking requires.

Model checking requires the property to hold over all possible executions of the model.

Step 3: Check the untested path.

The model also contains:


$$

s_0 \to s_3 \to s_4 \to s_4 \to \cdots

$$


At $s_3$, $obstacle$ is true. After that, $stop$ never occurs.

Step 4: Evaluate the property.


$$

\Box(obstacle \Rightarrow \Diamond stop)

$$


fails on the second path because the antecedent $obstacle$ becomes true, but the consequent $\Diamond stop$ never becomes true.

**Answer:** no. The successful test path does not establish the model-checking property. The second path is a counterexample.

---

### S25. Finite prefix trap for $\Box$ and $\Diamond$

Observed prefix:


$$

s_0:p, \quad s_1:p, \quad s_2:p

$$


**Can we conclude $\Box p$?**

Step 1: Use the meaning of $\Box$.

$\Box p$ means $p$ holds at every future position.

Step 2: Check what we actually know.

We know only positions 0, 1, and 2.

Step 3: Consider a possible continuation.

The next state could lack $p$. If so, $\Box p$ would be false.

**Answer:** not from this finite prefix alone.

**Can we conclude $\Diamond q$ is false?**

Step 1: Use the meaning of $\Diamond$.

$\Diamond q$ means $q$ holds at some future position.

Step 2: Check what the finite prefix says.

$q$ has not appeared yet.

Step 3: Consider a continuation.

$q$ might appear later.

**Answer:** not from this finite prefix alone.

**Exam-safe conclusion:** finite prefixes are not enough to settle future-looking temporal claims unless the model or loop structure tells you all possible continuations.

---

### S26. CTL immediate-quantifier trap

Rule: in CTL, each temporal operator must be immediately preceded by $A$ or $E$.

**1. $A\Box A\Diamond p$**

Step 1: Temporal operators are $\Box$ and $\Diamond$.

Step 2: $\Box$ is immediately preceded by $A$.  
$\Diamond$ is immediately preceded by $A$.

**Answer:** CTL.

**2. $A\Box\Diamond p$**

Step 1: Temporal operators are $\Box$ and $\Diamond$.

Step 2: $\Box$ is immediately preceded by $A$.  
$\Diamond$ is not immediately preceded by a path quantifier.

**Answer:** CTL* but not CTL.

**3. $A\Diamond A\Box p$**

Step 1: Temporal operators are $\Diamond$ and $\Box$.

Step 2: $\Diamond$ is immediately preceded by $A$.  
$\Box$ is immediately preceded by $A$.

**Answer:** CTL.

**4. $A\Diamond\Box p$**

Step 1: Temporal operators are $\Diamond$ and $\Box$.

Step 2: $\Diamond$ is immediately preceded by $A$.  
$\Box$ is not immediately preceded by a path quantifier.

**Answer:** CTL* but not CTL.

---

### S27. ATL is not the same as existential path

Game: $win$ happens next only for joint action $(L,L)$.

**1. $E\bigcirc win$**

Step 1: Interpret $E$.

There exists some path/choice leading to $win$ next.

Step 2: Check whether any joint action works.

$(L,L)$ works.

**Answer:** true.

**2. $\langle\langle a_1\rangle\rangle\bigcirc win$**

Step 1: Interpret ATL ability.

Agent $a_1$ alone must choose an action that guarantees $win$, regardless of $a_2$'s action.

Step 2: Try $a_1=L$.

If $a_2=L$, $win$ occurs.  
If $a_2=R$, $win$ does not occur.

Step 3: Try $a_1=R$.

No joint action with $a_1=R$ gives $win$, because only $(L,L)$ works.

**Answer:** false.

**3. $\langle\langle a_1,a_2\rangle\rangle\bigcirc win$**

Step 1: Interpret coalition ability.

The coalition controls both action choices.

Step 2: Choose the winning joint action.

The coalition chooses:


$$

(L,L)

$$


Step 3: Check the result.

$(L,L)$ makes $win$ true next.

**Answer:** true.

**Core distinction:** $E\bigcirc win$ means some joint behaviour can lead to $win$. $\langle\langle a_1\rangle\rangle\bigcirc win$ means $a_1$ can force $win$ despite the other agent.

---

### S28. Imperfect information can destroy a strategy

Given:


$$

s_A \sim_i s_B

$$


At $s_A$:

- $left \to goal$
- $right \to fail$

At $s_B$:

- $right \to goal$
- $left \to fail$

Step 1: Identify the perfect-information strategy.

If the agent could distinguish the states, it would choose:

- $left$ in $s_A$,
- $right$ in $s_B$.

Step 2: Apply imperfect information.

Because $s_A \sim_i s_B$, the agent cannot tell which state it is in.

Step 3: Apply the uniform-action constraint.

The agent must choose the same action in both indistinguishable states.

Step 4: Test uniform action $left$.

$left$ succeeds at $s_A$ but fails at $s_B$.

Step 5: Test uniform action $right$.

$right$ succeeds at $s_B$ but fails at $s_A$.

Step 6: Conclude.

No uniform action guarantees $goal$ from both possible states.

**Answer:** no. Under imperfect information, agent $i$ cannot ensure $\bigcirc goal$.

---

### S29. Choose the simplest adequate logic

**1. “On every execution, every request is eventually acknowledged.”**

Step 1: The property talks about all executions and temporal behaviour.

Step 2: It does not require branching choice, coalitions, beliefs, or goals.

**Answer:** LTL is enough. CTL can also express a version, but LTL is the simplest adequate family from the sheet.

**2. “There exists some path where recovery eventually happens.”**

Step 1: The key phrase is “there exists some path.”

Step 2: LTL in the sheet is all-path by default, so we need explicit path quantification.

**Answer:** CTL/CTL*; a direct CTL formula is $E\Diamond recovery$.

**3. “Team $T$ can force the system to reach $goal$.”**

Step 1: The key phrase is “team can force.”

Step 2: That is strategic coalition ability.

**Answer:** ATL/ATL*.

**4. “If agent $ag1$ believes obstacle, then its next goal is stop.”**

Step 1: The property mentions an agent's belief and goal.

Step 2: Plain LTL/CTL/ATL over ordinary propositions does not directly provide the belief/goal operators used in the sheet.

**Answer:** MCAPL/Gwendolen-style property logic.

---

### S30. Do not over-define symbols the sheet leaves unclear

Step 1: Check what the sheet explicitly defines by example.

The sheet clearly uses:

- $B$ for belief,
- $G$ for goal.

Step 2: Check what the sheet lists but does not define fully.

The grammar lists:


$$

A_{ag}f, \quad I_{ag}f, \quad ID_{ag}f, \quad P(f)

$$


The later property also uses:


$$

D_{car}maintain\_speed

$$


But the sheet does not define these symbols in the provided text.

Step 3: Give an exam-safe answer.

Say that Week 11's slide lists these as part of the property language, but the exact meanings are not specified in the slide excerpt. Do not invent definitions unless they were supplied elsewhere in the module.

Step 4: State what can safely be said.

They are agent/property-language modalities or predicates used to express properties over agent programs, alongside temporal operators such as $\Box$, $\Diamond$, $U$, and $R$.

**Answer:** define $B$ and $G$ from the sheet examples; for $A$, $I$, $ID$, $P$, and $D$, state that the Week 11 sheet lists them but does not give exact definitions, so their precise meanings need confirmation from lecture/source material.

---

### S31. Negating liveness is not the same as a short failed prefix

Property:


$$

\Diamond goal

$$


**1. Negate it**

Step 1: Translate the property.

$\Diamond goal$ means “eventually $goal$.”

Step 2: Negate eventually.

Not eventually $goal$ means always not $goal$:


$$

\neg\Diamond goal \equiv \Box\neg goal

$$


**Answer:** $\Box\neg goal$.

**2. Counterexample path**

Step 1: Use the negated property as bad-path condition.

A violating path must satisfy:


$$

\Box\neg goal

$$


Step 2: Interpret.

The path must avoid $goal$ forever.

**Answer:** an infinite path where $goal$ never occurs.

**3. Why a finite prefix is not enough**

Step 1: Suppose the prefix has no $goal$.

That shows only that $goal$ has not occurred yet.

Step 2: Check possible continuation.

$goal$ may occur later.

Step 3: Conclude.

A finite prefix without $goal$ does not by itself prove $\Box\neg goal$. You need the model/loop structure to show $goal$ can be avoided forever.

**Answer:** finite absence is not permanent absence unless the model proves no future continuation reaches $goal$.

---

### S32. MIS valuation ambiguity with agent-specific propositions

Global state:


$$

s=\langle s_1,s_2\rangle

$$


Proposition $battery\_low$ belongs only to agent 1.

Step 1: Recall the sheet's valuation idea.

The sheet says the global valuation is built from local valuations, but the parsed text is unclear because it says “for all $i$” without explaining propositions belonging only to a specific agent.

Step 2: Avoid an over-strong interpretation.

Do not require $battery\_low$ to appear in every agent's local proposition set if the proposition belongs only to agent 1.

Step 3: State a clear assumption.

Exam-safe phrasing:

> Assuming $battery\_low$ is an agent-1 proposition, $battery\_low$ is true in global state $s=\langle s_1,s_2\rangle$ iff $battery\_low$ is true in agent 1's local state $s_1$, according to $\pi_1$.

Step 4: Mention the slide ambiguity.

If the exam gives a specific valuation convention, follow that convention.

**Answer:** use the relevant local valuation for the agent that owns the proposition, and explicitly state the assumption because the Week 11 slide's compact valuation statement is under-explained.

---

# Final revision checklist

Before an exam-style answer, ask:

1. **Am I checking one path or all paths?**  
   One path = testing/path evaluation. All model executions = model checking.

2. **Does the formula need explicit path quantifiers?**  
   LTL is all-path by default in the sheet; CTL/CTL* uses $A$ and $E$.

3. **Is it CTL or CTL*?**  
   CTL requires every temporal operator to be immediately preceded by $A$ or $E$.

4. **Is it about strategic ability?**  
   Use ATL/ATL* and check whether the coalition can force the result against non-coalition choices.

5. **Is it about local agents and unfolding the global model?**  
   Use MIS: local states, local actions, joint actions, and local transition functions.

6. **Is it about beliefs, goals, deeds/actions, or an actual agent program?**  
   Use MCAPL/Gwendolen-style property reasoning and operational semantics.

7. **If a property fails, what is the counterexample?**  
   For safety, often a finite reachability-style bad path is enough. For liveness, you usually need an infinite path avoiding the desired event.
