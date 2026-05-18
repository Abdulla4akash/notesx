---
subject: COMP64602
chapter: 5
title: "Week 5"
language: en
---

# COMP64620 Study Notes: Non-Monotonic Reasoning for Agents

**Course:** COMP64620  
**Lecture cluster:** Non-monotonic reasoning for agents  
**Lecture topics:** Maintaining Truth; Negation as Failure / Closed World Assumption; Default Logic; Circumscription

**Topic and scope:** These lectures explain why agents need non-monotonic reasoning when the world changes or information is incomplete. They move from truth maintenance in belief bases to three approaches for default-style reasoning: negation as failure, default logic, and circumscription.

**Sources used:** Uploaded transcripts and slide PDFs for: Maintaining Truth, Negation as Failure / Closed World Assumption, Default Logic, and Circumscription.

---

## 1. Maintaining Truth

### 1.1 Why truth maintenance is needed

#### Intuition

Agents operate in worlds that change. What an agent perceives through its sensors may change because:

- the agent moves;
- objects in the world move;
- objects in the world change state.

This creates a problem for logical reasoning. A conclusion drawn at one point in time may no longer be valid later. The lecturer distinguishes two related issues:

1. **Default assumptions may be revised** when more information arrives.
2. **The actual truth of the world may change:** something that was true yesterday may not be true today.

Because of this, agents may need to withdraw previous conclusions. This is why they need **non-monotonic reasoning**.

**Connection:** The lecturer explicitly links this to earlier material on **beliefs, desires, intentions** and belief revision in BDI-style systems, and also to earlier discussion of default assumptions.

---

### 1.2 Monotonic vs non-monotonic reasoning

#### Key concept: monotonic logic

**Intuition:**  
A logic is monotonic if adding more information can give you more conclusions, but never removes conclusions you already had.

**Formal definition from the lecture/slides:**  
A logical system is **monotonic** if the set of inferences, or entailed sentences, can only increase as information is added.

$$
\forall \alpha, \beta.\; KB \vDash \alpha \implies KB \wedge \beta \vDash \alpha
$$

Meaning:

- If a knowledge base $KB$ entails $\alpha$,
- then adding extra information $\beta$ to the knowledge base should not stop $\alpha$ being entailed.

So if:

$$
KB \vDash \alpha
$$

then, in a monotonic logic:

$$
KB \wedge \beta \vDash \alpha
$$

#### Key concept: non-monotonic logic

**Intuition:**  
A logic is non-monotonic if adding information can invalidate earlier conclusions.

**Formal definition:**  
A logical system is **non-monotonic** if it does **not** satisfy the monotonicity property above.

So there can be cases where:

$$
KB \vDash \alpha
$$

but:

$$
KB \wedge \beta \nvDash \alpha
$$

Example intuition from the lecture:

- With defaults, we may infer a default property of an entity.
- Later we learn that the entity is abnormal or exceptional.
- That new information blocks the default inference.

The additional complication in this lecture is that facts can genuinely change, not just that exceptions are discovered.

Example from the transcript:

- The agent previously believed it could reach a place.
- It then learns there is an obstacle in the path.
- Its beliefs about reachability must be revised.

---

### 1.3 Belief bases and efficient reasoning in BDI-style agents

The lecturer connects truth maintenance to BDI systems.

#### Basic BDI-style belief representation

Agents have a **set of beliefs**. For efficiency, the ideal case would be:

- no logical inference at lookup time;
- just check whether a fact is in the belief set;
- use an efficient lookup mechanism, such as a hash-like structure.

So, if the belief base is treated as a database of facts, checking whether $p$ is believed is just checking membership:

$$
p \in Beliefs
$$

#### But sophisticated reasoning needs inference

If the agent wants more sophisticated reasoning, then when new information arrives it may apply inference rules and add extra beliefs.

Example pattern:

$$
\phi \Rightarrow \psi
$$

If the system learns:

$$
\phi
$$

then by inference it may add:

$$
\psi
$$

This can be done by **forward chaining**, which the lecturer says students should have met previously.

**Connection:** Forward chaining is linked to earlier material from the previous semester.

---

### 1.4 The basic truth maintenance problem

Suppose new information arrives in a simple literal form:

$$
\phi
$$

or:

$$
\neg \phi
$$

where $\phi$ is an atomic statement.

The lecturer explicitly says this is not a complicated formula with many conjunctions, disjunctions, or implications. It is just a literal: either a statement is true, or its negation is true.

#### Naive update rule: overwrite old information

If the new information is:

$$
\phi
$$

and the database currently contains:

$$
\neg \phi
$$

then remove $\neg \phi$ and add $\phi$.

If the new information is:

$$
\neg \phi
$$

and the database currently contains:

$$
\phi
$$

then remove $\phi$ and add $\neg \phi$.

So the naive approach is:

> New information overwrites old information.

#### Why this is insufficient

The problem is that other facts may have been inferred from the old fact.

Worked example from the slides:

Initial rule:

$$
\phi \Rightarrow \psi
$$

Initial knowledge base:

$$
KB = \{\phi\}
$$

Using inference, we add $\psi$, giving:

$$
KB = \{\phi, \psi\}
$$

Now suppose we learn:

$$
\neg \phi
$$

We remove $\phi$ and add $\neg \phi$. But we also need to remove $\psi$, because $\psi$ was only in the database because of $\phi$.

So after learning $\neg \phi$, the system should not simply have:

$$
\{\neg \phi, \psi\}
$$

because $\psi$'s justification has disappeared.

The lecturer adds that the system might even have reason to think $\psi$ is false, but the main point is that it no longer has a reason to believe $\psi$.

---

### 1.5 Truth Maintenance Systems

Truth Maintenance Systems are techniques for keeping a database or belief base consistent with the current state of the world as the agent understands it.

The lecture gives three main approaches.

---

#### 1.5.1 Logging facts and rerunning inference

##### Algorithm / procedure

Maintain a log of when facts were added to the database.

When a fact is removed:

1. Find the point in the log where that fact was added.
2. Remove that fact.
3. Remove all facts added after that point.
4. Rerun inference.
5. Add back any facts that can still be inferred.

##### Advantage

This is conceptually simple.

##### Problems

The lecturer gives two problems.

###### Problem 1: inefficiency

It may redo many inferences unnecessarily.

If only one old fact has changed, deleting everything after it and rerunning inference may involve recomputing lots of facts that were not affected.

###### Problem 2: it loses later perceptual facts

Worked example from the transcript:

1. At time $t_1$, the agent learns there is an obstacle in the way.
2. At time $t_2$, the agent learns there is a red car on the highway.
3. At time $t_3$, the agent learns the obstacle has been removed.

Using the logging method:

- the system deletes all information after the original obstacle fact;
- this removes the later fact about the red car;
- rerunning inference will not restore the red car fact if it came from perception rather than inference.

So logging does not work well when:

- new facts are continuously arriving from perception;
- the world is genuinely changing;
- later facts are independent perceptual inputs, not inferred consequences.

---

#### 1.5.2 Tracking dependencies as justifications

This is described as a better approach.

##### Key concept: justification

A **justification** records which other sentences must hold for a sentence to hold.

If a sentence depends on other facts, the system links it to those facts. If one of its justifications disappears, the sentence can be removed or marked as inactive.

Example pattern:

$$
\phi \Rightarrow \psi
$$

If $\psi$ was inferred from $\phi$, then $\psi$'s justification includes $\phi$.

If $\phi$ is removed, $\psi$ loses its justification.

##### In/out marking

The lecturer says many such systems do not literally delete and re-add facts repeatedly. Instead, they mark facts as:

- **in:** currently part of the knowledge base / belief base;
- **out:** not currently part of the active knowledge base / belief base.

This is useful because facts may move in and out regularly, and flipping an in/out marker can be more efficient than deleting and reconstructing database entries.

##### Justification Truth Maintenance System

The transcript refers to this as a **justification truth maintenance system**.

Core idea:

- track which facts justify which other facts;
- if a justification moves out of the knowledge base, dependent facts can also move out;
- maintain current consistency without wholesale deletion.

---

#### 1.5.3 Assumption-based systems

The lecture then extends the idea.

In a justification-based system, there are essentially two groups:

- facts that are **in**, representing the current state of the world;
- facts that are **out**, which may have been true in the past or may become true in the future.

In an **assumption-based system**, the system stores several possible states of the world.

##### Key concept: assumptions

Facts are linked to the sets of assumptions they depend on. A fact is true only in situations where all its assumptions are true.

So instead of just asking:

$$
\text{Is } \phi \text{ currently in or out?}
$$

The system tracks:

$$
\phi \text{ is true under assumption set } A
$$

When the world changes, the agent identifies which state of the world applies and uses the facts associated with that state.

##### Purpose

This allows:

- several possible world states to be represented;
- flexible switching between them;
- reasoning that is not tied to a single flat database of facts.

---

### 1.6 End-of-lecture transition

The lecturer says the rest of the week will look more at reasoning around **defaults**, because defaults are an interesting case of world change and there are many logics for them.

The lecturer also says modern BDI systems tend to take a “halfway house” approach and do not simply maintain one fact database where inference inserts all possible facts.

---

## 2. Negation as Failure / Closed World Assumption

### 2.1 What negation as failure is

The lecture topic is **Negation as Failure**, also called the **Closed World Assumption**.

The lecturer says it is used widely in practical reasoning about practical logic.

#### Key concept: negation as failure

**Intuition:**  
If the system cannot prove that something is true, it treats that failure as evidence that the thing is false.

**Formal definition from slides/transcript:**

$$
KB \nvDash \phi \quad \text{is equivalent to} \quad KB \vDash \neg \phi
$$

So if $\phi$ cannot be derived from $KB$, then the system concludes $\neg \phi$.

This is different from classical logic, where failure to prove $\phi$ does not normally imply $\neg \phi$.

---

### 2.2 Simple robot-location example

Knowledge base:

$$
KB = \{at(1,2),\; see(obstacle)\}
$$

Interpretation from the lecturer:

- $at(1,2)$: the robot is at coordinate $(1,2)$.
- $see(obstacle)$: the robot can see an obstacle.

Question:

$$
at(0,0)?
$$

The system cannot deduce:

$$
at(0,0)
$$

from the knowledge base.

Under negation as failure, it therefore assumes:

$$
\neg at(0,0)
$$

So because $at(0,0)$ is not in the knowledge base and cannot be derived, the system concludes that the robot is not at $(0,0)$.

---

### 2.3 More complicated checked-square example

The lecture gives a grid/square example.

Knowledge base:

$$
checked(0,0)
$$

$$
checked(1,0)
$$

$$
checked(2,0)
$$

$$
obstacle(1,0)
$$

Rule:

$$
checked(X,Y) \wedge \neg obstacle(X,Y) \rightarrow clear(X,Y)
$$

Interpretation:

- The squares $(0,0)$, $(1,0)$, and $(2,0)$ have been checked.
- An obstacle was seen at $(1,0)$.
- If a square has been checked and there is not an obstacle at that square, then the square is clear.

#### Derivation of $clear(0,0)$

We have:

$$
checked(0,0)
$$

There is no fact:

$$
obstacle(0,0)
$$

and no derivation of:

$$
obstacle(0,0)
$$

So by negation as failure:

$$
\neg obstacle(0,0)
$$

Now the rule antecedent is satisfied:

$$
checked(0,0) \wedge \neg obstacle(0,0)
$$

Therefore:

$$
clear(0,0)
$$

#### Derivation of $clear(2,0)$

We have:

$$
checked(2,0)
$$

There is no fact:

$$
obstacle(2,0)
$$

and no derivation of:

$$
obstacle(2,0)
$$

So by negation as failure:

$$
\neg obstacle(2,0)
$$

Then:

$$
checked(2,0) \wedge \neg obstacle(2,0)
$$

Therefore:

$$
clear(2,0)
$$

#### Why $clear(1,0)$ is not derived

For $(1,0)$, the knowledge base contains:

$$
obstacle(1,0)
$$

So we do not get:

$$
\neg obstacle(1,0)
$$

Therefore the antecedent of the rule is not satisfied for $(1,0)$, and the lecture only derives:

$$
clear(0,0)
$$

and:

$$
clear(2,0)
$$

---

### 2.4 Why this is useful for agents

The lecturer connects this to the agent paradigm.

Agents get facts from perception: things they see or sense. Under negation as failure, they can reason from absence:

- If the agent checked a square and did not see an obstacle,
- it can infer that the square is clear.

This is useful because agents often need to act on what they have or have not perceived.

---

### 2.5 Negation as failure in BDI belief revision

The lecture says many BDI systems do **not** use forward chaining to insert every possible consequence into the knowledge base.

Instead, they:

1. Store facts from perception in the belief base.
2. Store inference rules.
3. Use rule-based inference and negation as failure when they need to answer a query.
4. Often use **backward chaining** rather than proactively deriving all consequences.

#### Forward chaining approach

A forward chaining system would:

- add perceptual facts;
- infer all possible consequences;
- insert those consequences into the knowledge base;
- later look up whether a fact is present.

This can be expensive when new facts arrive frequently, because the system repeatedly derives many consequences.

#### Backward chaining approach in BDI systems

The lecturer says BDI systems often instead:

- keep the observed facts;
- keep rules such as:

$$
checked(X,Y) \wedge \neg obstacle(X,Y) \rightarrow clear(X,Y)
$$

- only try to derive $clear(X,Y)$ when the agent needs to know it.

This saves time because the system does not spend effort deriving consequences it never uses.

#### Important condition

This depends on programmers providing sensible inference rules:

- few enough rules;
- not too many long chains of inference;
- reasoning should remain quick when needed.

---

### 2.6 Negation as failure is non-monotonic

The lecture explicitly says negation as failure is non-monotonic.

Using the previous example:

Initially:

$$
KB \vDash clear(0,0)
$$

because:

$$
checked(0,0)
$$

and, by negation as failure:

$$
\neg obstacle(0,0)
$$

But if we add:

$$
obstacle(0,0)
$$

then we can no longer infer:

$$
\neg obstacle(0,0)
$$

So we no longer derive:

$$
clear(0,0)
$$

The slides give the formal contrast:

$$
KB \vDash clear(0,0)
$$

but:

$$
KB \wedge obstacle(0,0) \nvDash clear(0,0)
$$

This is the exact non-monotonic pattern: adding information removes an earlier conclusion.

---

### 2.7 Semantics of negation as failure

#### Classical monotonic semantics

In classical monotonic logic:

$$
KB \vDash \phi
$$

means:

$$
\phi \text{ is true in all models of } KB
$$

A **model** of a knowledge base assigns truth values to variables in a way that makes all formulae in the knowledge base true.

#### Why classical model semantics does not match negation as failure

In the obstacle example, the system assumed there was no obstacle at $(0,0)$ because it could not see one.

But classically, the knowledge base did not actually say anything about whether there was an obstacle at $(0,0)$. There can be models of the knowledge base where:

$$
obstacle(0,0)
$$

is true, even if that fact is absent from the knowledge base.

So negation as failure needs a different semantics.

#### Minimal model semantics

Under negation as failure:

$$
KB \vDash \phi
$$

if:

$$
\phi \text{ is true in all minimal models of } KB
$$

A **minimal model** is a model with the fewest true atoms.

So the system excludes models that make unnecessary extra atoms true.

Example intuition:

- If $obstacle(0,0)$ is not forced to be true,
- then minimal models prefer not to make it true.
- Therefore $\neg obstacle(0,0)$ is accepted under the closed world assumption.

---

### 2.8 Model preference logics

The lecturer introduces a broader class: **model preference logics**.

In model preference logics:

$$
KB \vDash \phi
$$

holds when:

$$
\phi \text{ is true in all preferred models}
$$

The closed world assumption is an example.

For the closed world assumption:

- the preferred models are the **minimal models**;
- minimal means having the fewest true atoms.

**Connection:** The lecturer says this will be discussed in the next few videos, which connects directly to circumscription later.

---

## 3. Default Logic

### 3.1 What default logic is

The lecture introduces **default logic** as a more sophisticated way of reasoning with incomplete and changing information than negation as failure.

#### Key concept: default logic

**Intuition:**  
Some inference rules apply only if there is no evidence against applying them, or if applying them does not lead to contradiction.

Default logic is for reasoning like:

> Normally, birds fly.  
> But if we know the bird is exceptional, we should not infer that it flies.

---

### 3.2 Syntax of default rules

The slide gives the syntax:

$$
A : J / C
$$

#### Formal interpretation from the lecture

$$
A : J / C
$$

means:

- $A$ implies $C$,
- provided that the justifications in $J$ are consistent with the knowledge base.

So:

- $A$ is the prerequisite / condition;
- $J$ is the justification that must remain consistent;
- $C$ is the conclusion.

In words:

> If $A$ holds, infer $C$, as long as the justification $J$ does not conflict with what is known.

---

### 3.3 Simple bird example

The lecture uses the standard non-monotonic reasoning example of birds that fly or do not fly.

Default rule:

$$
Bird(X) : Flies(X) / Flies(X)
$$

Interpretation:

- If $X$ is a bird,
- then assume $X$ flies,
- provided that $Flies(X)$ is consistent with the knowledge base.

The slide says this means we can assume birds fly unless:

$$
\neg Flies(X)
$$

is in the atomic facts of the knowledge base, or:

$$
KB \vDash \neg Flies(X)
$$

So if the knowledge base contains or entails that the bird does not fly, the default cannot be applied.

#### Worked version

Suppose:

$$
Bird(Tweety)
$$

and the knowledge base does **not** contain or entail:

$$
\neg Flies(Tweety)
$$

Then the default can apply, giving:

$$
Flies(Tweety)
$$

But if the knowledge base contains:

$$
\neg Flies(Tweety)
$$

then the default is blocked.

---

### 3.4 Penguin/emu example

The lecture gives a more specific example:

$$
Bird(X) : Penguin(X) \vee Emu(X) / Flies(X)
$$

The verbal explanation says:

> We can assume a bird flies unless it is a penguin or an emu.

So if Tweety is a starling and a bird, and there is no information that Tweety is a penguin or emu, then the lecture says we can assume Tweety flies.

**[UNCLEAR]** The slide’s displayed formal rule is:

$$
Bird(X) : Penguin(X) \vee Emu(X) / Flies(X)
$$

but the lecturer’s explanation says the default should be blocked if $X$ is a penguin or emu. Under the earlier syntax $A:J/C$, where $J$ must be consistent with the knowledge base, the displayed justification is potentially confusing: the verbal meaning is clear, but the formula as printed may be missing a negation or may be using a compressed notation not fully explained in the lecture.

---

### 3.5 Semantics of default logic: extensions

Default logic uses the concept of an **extension**.

#### Key concept: extension

An **extension** of a default theory consists of:

1. the set of atomic facts;
2. all conclusions of non-default rules;
3. the conclusions of as many default rules as possible while keeping the theory consistent.

So an extension is a possible completed version of the theory after applying defaults consistently.

---

### 3.6 Skeptical vs credulous semantics

The lecture says there are different semantics for default logic.

#### Skeptical semantics

$\phi$ is entailed if it is true in **all extensions** of the theory.

So skeptical reasoning accepts only conclusions that survive every possible consistent way of applying defaults.

#### Credulous semantics

$\phi$ is entailed if it is true in **at least one extension** of the theory.

So credulous reasoning accepts conclusions that are supported by some consistent application of defaults.

#### Range of possible semantics

The lecturer says there can be a range of semantics between skeptical and credulous semantics.

---

### 3.7 Worked example: the Nixon Diamond in default logic

The lecture presents the Nixon Diamond as a famous example in non-monotonic reasoning.

#### Facts

$$
Republican(Nixon)
$$

$$
Quaker(Nixon)
$$

#### Default rules

Republicans are normally not pacifists:

$$
Republican(X) : \neg Pacifist(X) / \neg Pacifist(X)
$$

Quakers are normally pacifists:

$$
Quaker(X) : Pacifist(X) / Pacifist(X)
$$

#### The conflict

Nixon is both:

$$
Republican(Nixon)
$$

and:

$$
Quaker(Nixon)
$$

So one default supports:

$$
\neg Pacifist(Nixon)
$$

and the other supports:

$$
Pacifist(Nixon)
$$

The question is:

$$
Pacifist(Nixon)?
$$

or:

$$
\neg Pacifist(Nixon)?
$$

#### Two extensions

The slides give two extensions.

Extension 1:

$$
\{Republican(Nixon),\; Quaker(Nixon),\; \neg Pacifist(Nixon)\}
$$

Extension 2:

$$
\{Republican(Nixon),\; Quaker(Nixon),\; Pacifist(Nixon)\}
$$

Both are consistent internally, but they support opposite conclusions about whether Nixon is a pacifist.

#### Skeptical semantics result

In skeptical semantics, neither conclusion is entailed:

$$
KB \nvDash Pacifist(Nixon)
$$

and:

$$
KB \nvDash \neg Pacifist(Nixon)
$$

Reason: each conclusion appears in only one of the two extensions, not both.

#### Credulous semantics result

In credulous semantics, both conclusions are entailed:

$$
KB \vDash Pacifist(Nixon)
$$

and:

$$
KB \vDash \neg Pacifist(Nixon)
$$

Reason: each conclusion appears in at least one extension.

#### Why preferred extensions are useful

The lecturer says that normally we want a concept of **preferred extensions**.

Example preference ordering:

> Religion tends to be more important than political affiliation.

If the Quaker rule is preferred over the Republican rule, then the extension supporting:

$$
Pacifist(Nixon)
$$

is preferred.

So under that preference, we would conclude:

$$
Pacifist(Nixon)
$$

The lecturer also points out that both Nixon Diamond extensions are the same size, so simply choosing a “minimal” or size-based extension does not resolve the conflict.

---

## 4. Circumscription

### 4.1 What circumscription is

**[UNCLEAR]** The transcript repeatedly says “subscription” or “circumspection”, but the slides make clear that the topic is **circumscription**.

#### Key concept: circumscription

**Intuition:**  
Circumscription assumes that certain selected predicates are false unless they are known to be true.

The selected predicates are called **circumscribed**.

The slide’s key idea:

> Some predicates are assumed to be false, circumscribed, unless known to be true.

---

### 4.2 Circumscription vs closed world assumption

The lecturer describes circumscription as a refined version of the closed world assumption.

#### Closed world assumption

Under the closed world assumption, all predicates are treated as false unless known true.

#### Circumscription

Under circumscription, only some chosen predicates are treated as false unless known true.

So circumscription is more selective:

- Closed world assumption: minimise truth of all atoms/predicates.
- Circumscription: minimise selected circumscribed predicates.

---

### 4.3 Simple bird example with `Flightless`

The lecture gives the example where:

$$
Flightless
$$

is circumscribed.

Rule:

$$
Bird(X) \wedge \neg Flightless(X) \rightarrow Flies(X)
$$

Because $Flightless$ is circumscribed, the system assumes:

$$
\neg Flightless(X)
$$

unless it knows:

$$
Flightless(X)
$$

Therefore, if the system knows:

$$
Bird(X)
$$

and does not know:

$$
Flightless(X)
$$

then it can infer:

$$
Flies(X)
$$

#### Worked version

Suppose:

$$
Bird(Tweety)
$$

and $Flightless$ is circumscribed.

If the knowledge base does not say:

$$
Flightless(Tweety)
$$

then circumscription assumes:

$$
\neg Flightless(Tweety)
$$

Now apply the rule:

$$
Bird(Tweety) \wedge \neg Flightless(Tweety) \rightarrow Flies(Tweety)
$$

Therefore:

$$
Flies(Tweety)
$$

If later the system learns:

$$
Flightless(Tweety)
$$

then the inference to:

$$
Flies(Tweety)
$$

is blocked.

---

### 4.4 Preferred model semantics for circumscription

The lecture connects circumscription back to model preference logics.

Recall from the negation-as-failure lecture:

$$
KB \vDash \phi
$$

if:

$$
\phi \text{ is true in all preferred models}
$$

The closed world assumption is one example of a model preference logic.

Circumscription is another.

#### Preferred models in circumscription

For circumscription, a preferred model is one with the fewest circumscribed entities or objects.

So the preferred models minimise the extension of the circumscribed predicates.

In the bird example:

- $Flightless$ is circumscribed;
- preferred models make as few things flightless as possible;
- therefore, unless something is known to be flightless, it is treated as not flightless.

---

### 4.5 Worked example: Nixon Diamond in circumscription

The lecture returns to the Nixon Diamond, now expressed using circumscription.

#### Facts

$$
Republican(Nixon) \wedge Quaker(Nixon)
$$

#### Rules

Republicans are normally not pacifists unless abnormal in one way:

$$
Republican(X) \wedge \neg Abnormal_1(X) \Rightarrow \neg Pacifist(X)
$$

Quakers are normally pacifists unless abnormal in another way:

$$
Quaker(X) \wedge \neg Abnormal_2(X) \Rightarrow Pacifist(X)
$$

#### Circumscribed predicates

$$
Abnormal_1
$$

and:

$$
Abnormal_2
$$

are circumscribed.

So the system prefers models in which as few things as possible are abnormal.

#### Conflict

For Nixon:

- If $Abnormal_1(Nixon)$ is false, the Republican rule gives:

$$
\neg Pacifist(Nixon)
$$

- If $Abnormal_2(Nixon)$ is false, the Quaker rule gives:

$$
Pacifist(Nixon)
$$

But having both conclusions would be inconsistent.

#### Two preferred models

The slide says there are two preferred models:

1. One where:

$$
Abnormal_1(Nixon)
$$

is true.

2. One where:

$$
Abnormal_2(Nixon)
$$

is true.

The transcript adds that the logic has no preference between these two models.

#### Consequence

Circumscription, as presented here, does not resolve the Nixon Diamond by itself. It produces two equally preferred alternatives, one blocking the Republican default and one blocking the Quaker default.

---

## 5. Cross-lecture conceptual map

### 5.1 Overall progression

The lectures build a sequence:

1. **Maintaining Truth:** Agents need non-monotonic reasoning because their world and perceptions change.
2. **Negation as Failure / Closed World Assumption:** If something cannot be proved, treat it as false. Semantics: minimal models.
3. **Default Logic:** Defaults apply when their justifications are consistent. Semantics: extensions, with skeptical and credulous variants.
4. **Circumscription:** Some predicates are minimised: assume selected predicates false unless known true. Semantics: preferred models with fewest circumscribed entities.

---

### 5.2 Main semantic contrast

#### Classical monotonic logic

$$
KB \vDash \phi
$$

means:

$$
\phi \text{ is true in all models of } KB
$$

#### Negation as failure / closed world assumption

$$
KB \vDash \phi
$$

means:

$$
\phi \text{ is true in all minimal models of } KB
$$

#### Model preference logics

$$
KB \vDash \phi
$$

means:

$$
\phi \text{ is true in all preferred models}
$$

#### Circumscription

Preferred models are those with the fewest circumscribed entities/objects.

#### Default logic

Entailment is based on extensions:

- skeptical: true in all extensions;
- credulous: true in at least one extension;
- preferred extension approaches can be added to resolve conflicts.

---

### 5.3 Main non-monotonic pattern

Across all these systems, adding information can remove conclusions.

Generic form:

$$
KB \vDash \alpha
$$

but:

$$
KB \wedge \beta \nvDash \alpha
$$

Examples from the lectures:

Negation as failure:

$$
KB \vDash clear(0,0)
$$

but:

$$
KB \wedge obstacle(0,0) \nvDash clear(0,0)
$$

Bird default:

$$
Bird(X)
$$

may support:

$$
Flies(X)
$$

unless later information gives:

$$
\neg Flies(X)
$$

or an exception such as being flightless.

Circumscription:

$$
Bird(X) \wedge \neg Flightless(X) \rightarrow Flies(X)
$$

with $Flightless$ circumscribed supports $Flies(X)$, unless $Flightless(X)$ becomes known.

---

## 6. Worked examples collected

### 6.1 Truth maintenance example: removing inferred facts

Given:

$$
\phi \Rightarrow \psi
$$

Initial KB:

$$
\{\phi\}
$$

Forward chaining adds:

$$
\psi
$$

So:

$$
KB = \{\phi,\psi\}
$$

New information:

$$
\neg \phi
$$

Naive update gives:

$$
\{\neg \phi,\psi\}
$$

but this is wrong because $\psi$ depended on $\phi$.

Truth maintenance requires removing both:

$$
\phi
$$

and:

$$
\psi
$$

because $\psi$'s justification has gone.

---

### 6.2 Negation as failure: robot position

Given:

$$
KB = \{at(1,2), see(obstacle)\}
$$

Query:

$$
at(0,0)?
$$

Cannot derive $at(0,0)$, so under negation as failure:

$$
\neg at(0,0)
$$

---

### 6.3 Negation as failure: clear squares

Given:

$$
checked(0,0)
$$

$$
checked(1,0)
$$

$$
checked(2,0)
$$

$$
obstacle(1,0)
$$

$$
checked(X,Y) \wedge \neg obstacle(X,Y) \rightarrow clear(X,Y)
$$

Derive:

$$
clear(0,0)
$$

because:

$$
checked(0,0)
$$

and:

$$
\neg obstacle(0,0)
$$

by negation as failure.

Derive:

$$
clear(2,0)
$$

because:

$$
checked(2,0)
$$

and:

$$
\neg obstacle(2,0)
$$

by negation as failure.

Do not derive:

$$
clear(1,0)
$$

because:

$$
obstacle(1,0)
$$

is explicitly known.

---

### 6.4 Default logic: bird flies

Rule:

$$
Bird(X) : Flies(X) / Flies(X)
$$

Given:

$$
Bird(Tweety)
$$

and no evidence for:

$$
\neg Flies(Tweety)
$$

infer by default:

$$
Flies(Tweety)
$$

If later:

$$
\neg Flies(Tweety)
$$

is known or entailed, the default is blocked.

---

### 6.5 Default logic: Nixon Diamond

Facts:

$$
Republican(Nixon)
$$

$$
Quaker(Nixon)
$$

Defaults:

$$
Republican(X) : \neg Pacifist(X) / \neg Pacifist(X)
$$

$$
Quaker(X) : Pacifist(X) / Pacifist(X)
$$

Extensions:

$$
\{Republican(Nixon), Quaker(Nixon), \neg Pacifist(Nixon)\}
$$

$$
\{Republican(Nixon), Quaker(Nixon), Pacifist(Nixon)\}
$$

Skeptical result:

$$
Pacifist(Nixon)
$$

is not entailed, and:

$$
\neg Pacifist(Nixon)
$$

is not entailed.

Credulous result:

Both are entailed, because each appears in at least one extension.

Preferred extension example:

If religious affiliation is preferred over political affiliation, choose the Quaker-based extension and infer:

$$
Pacifist(Nixon)
$$

---

### 6.6 Circumscription: flightless birds

Circumscribed predicate:

$$
Flightless
$$

Rule:

$$
Bird(X) \wedge \neg Flightless(X) \rightarrow Flies(X)
$$

Given:

$$
Bird(Tweety)
$$

and no known:

$$
Flightless(Tweety)
$$

infer:

$$
\neg Flightless(Tweety)
$$

because $Flightless$ is circumscribed.

Then infer:

$$
Flies(Tweety)
$$

---

### 6.7 Circumscription: Nixon Diamond

Facts:

$$
Republican(Nixon) \wedge Quaker(Nixon)
$$

Rules:

$$
Republican(X) \wedge \neg Abnormal_1(X) \Rightarrow \neg Pacifist(X)
$$

$$
Quaker(X) \wedge \neg Abnormal_2(X) \Rightarrow Pacifist(X)
$$

Circumscribed predicates:

$$
Abnormal_1,\; Abnormal_2
$$

Two preferred models:

$$
Abnormal_1(Nixon)
$$

true in one model, and:

$$
Abnormal_2(Nixon)
$$

true in the other.

The lecture says this logic has no preference between those two models.

---

## 7. Exam flags and lecturer emphasis

No explicit phrase like “this will be on the exam” appears in the uploaded transcripts/slides.

High-value emphasized material for revision:

- Definition of **monotonic reasoning**:

$$
\forall \alpha,\beta.\; KB \vDash \alpha \implies KB \wedge \beta \vDash \alpha
$$

- Definition of **non-monotonic reasoning** as failure of monotonicity.
- Why changing facts create a truth maintenance problem.
- The $\phi \Rightarrow \psi$, $KB=\{\phi,\psi\}$, then learning $\neg\phi$ example.
- Three truth maintenance approaches:
  - logging and rerunning inference;
  - justifications / in-out marking;
  - assumption-based systems.
- Definition of **negation as failure**:

$$
KB \nvDash \phi \iff KB \vDash \neg \phi
$$

- The checked/obstacle/clear example.
- Why negation as failure is non-monotonic:

$$
KB \vDash clear(0,0)
$$

but:

$$
KB \wedge obstacle(0,0) \nvDash clear(0,0)
$$

- Minimal model semantics for closed world reasoning.
- Default logic syntax:

$$
A:J/C
$$

- Default logic extensions, skeptical semantics, and credulous semantics.
- Nixon Diamond in default logic.
- Circumscription as minimising selected predicates.
- Circumscription’s preferred models with the fewest circumscribed entities.
- Nixon Diamond in circumscription.

---

## 8. Connections to earlier/later material

### 8.1 Earlier lectures / prior knowledge

- The lecturer connects maintaining truth to previous material on **beliefs, desires, intentions** programs and belief revision.
- The lecturer mentions that default assumptions had already been discussed by Zhao Yun.
- Forward chaining is referenced as something students should have met in the previous semester.
- Classical model semantics is recalled before introducing minimal/preferred model semantics.

### 8.2 Connections between these lectures

- Truth maintenance motivates non-monotonic reasoning generally.
- Negation as failure gives a practical non-monotonic method.
- Default logic is introduced as more sophisticated than negation as failure.
- Circumscription is introduced as another example of non-monotonic logic.
- Both closed world assumption and circumscription are presented as **model preference logics**.
- The Nixon Diamond appears in both default logic and circumscription to show how different non-monotonic systems handle conflicting defaults.

---

## 9. Unclear / transcript-garbled sections to revisit

- **[UNCLEAR]** The transcript says “subscription” and “circumspection” in the final lecture. The slides identify the topic as **circumscription**.
- **[UNCLEAR]** The transcript phrase “modal preference logic” appears to correspond to **model preference logic**, as shown by the slides and surrounding explanation.
- **[UNCLEAR]** In the default logic lecture, the transcript says “impartial and changing information”; this is likely “incomplete and changing information.”
- **[UNCLEAR]** The default rule:

$$
Bird(X) : Penguin(X) \vee Emu(X) / Flies(X)
$$

is verbally explained as “a bird flies unless it is a penguin or an emu.” The displayed formula and the earlier definition of $A:J/C$ are not fully reconciled in the lecture. Re-listen to this part.

- **[UNCLEAR]** Several transcript terms are auto-generated incorrectly: “monitor necessity” for monotonicity, “food chain” for forward chaining, “si obstacle” for `see(obstacle)`, “absolute” for obstacle, “Knicks” for Nixon, “Emmy/Indian” for emu, and “abnormal to” for $Abnormal_2$.
- **[UNCLEAR]** The lecturer says in default logic that $KB \vDash \phi$ if $\phi$ is true in “some set of extensions”; the slides clarify this through skeptical and credulous semantics. The exact general entailment condition depends on the chosen semantics.
