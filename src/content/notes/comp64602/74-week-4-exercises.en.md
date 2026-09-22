---
subject: COMP64602
chapter: 74
title: "Week 4 — Extra Exercises"
language: en
---

# Week 4 — First Order Logic and Agents: Extra Exercise Set

A second layer on top of chapter 54, focused on quantifier scope, free and bound variables, model checking in a small domain, and the quantifier-order distinctions that lose marks.

## Exercise types

1. **Free/bound variable identification.**
2. **Quantifier scope** — read a formula precisely.
3. **Model checking** — evaluate a sentence in a given structure.
4. **Countermodel construction** — refute a claimed entailment.
5. **Formalisation** — English to FOL, with attention to quantifier order.

---

# Section A — Syntax and scope

## E1. Free and bound occurrences

In each formula, identify which variable occurrences are free and which are bound, and say whether the formula is a sentence.

(a) $\forall x\, P(x, y)$
(b) $\exists y\, \big(P(x,y) \land \forall x\, Q(x)\big)$
(c) $\forall x\, \exists y\, R(x,y)$

### Solution

**Step 1: Recall the rule.** An occurrence of $v$ is **bound** if it lies within the scope of a quantifier over $v$; otherwise it is **free**. A **sentence** (closed formula) has no free occurrences.

**Step 2: (a).** $x$ in $P(x,y)$ is bound by $\forall x$. $y$ is not quantified anywhere, so it is **free**. Not a sentence.

**Step 3: (b).** Work outward from each occurrence.
- $x$ in $P(x,y)$: the only quantifier over $x$ is $\forall x$, whose scope is $Q(x)$ alone — it does **not** extend over $P(x,y)$. So this $x$ is **free**.
- $y$ in $P(x,y)$: within the scope of $\exists y$ → **bound**.
- $x$ in $Q(x)$: within the scope of $\forall x$ → **bound**.

Not a sentence, because of the free $x$ in $P(x,y)$.

**Step 4: (c).** $x$ bound by $\forall x$; $y$ bound by $\exists y$. No free occurrences, so it **is** a sentence.

**Step 5: Note the trap in (b).** The same variable letter $x$ occurs both free and bound in one formula. Scope is determined by the **syntactic extent** of the quantifier, not by the letter used. This is why renaming bound variables (to $\forall x'\, Q(x')$) is good practice — it changes nothing semantically and removes the ambiguity for the reader.

**Step 6: State why sentences matter.** Only sentences have a truth value in a model outright. A formula with free variables is evaluated relative to an **assignment** to those variables, so "is it true in $\mathcal{M}$?" is not yet a well-posed question for (a) or (b).

---

## E2. Quantifier order

Distinguish $\forall x\, \exists y\, \mathsf{Loves}(x,y)$ from $\exists y\, \forall x\, \mathsf{Loves}(x,y)$, and give a model separating them.

### Solution

**Step 1: Read each precisely.**
- $\forall x\, \exists y\, \mathsf{Loves}(x,y)$: everyone loves **someone**, possibly a different someone for each person.
- $\exists y\, \forall x\, \mathsf{Loves}(x,y)$: there is **one particular** individual loved by everyone.

**Step 2: Note the dependency.** In the first, the choice of $y$ may **depend on** $x$, since $y$ is chosen inside $x$'s scope. In the second, $y$ is fixed before $x$ varies, so it cannot depend on $x$. Quantifier order encodes dependency.

**Step 3: Build a separating model.** Let $\Delta = \{a, b\}$ with
$$\mathsf{Loves}^{\mathcal{M}} = \{(a,a), (b,b)\}$$
— everyone loves only themselves.

**Step 4: Evaluate the first.** For $x = a$, choose $y = a$: $(a,a) \in \mathsf{Loves}$ ✓. For $x = b$, choose $y = b$ ✓. So $\mathcal{M} \models \forall x\, \exists y\, \mathsf{Loves}(x,y)$.

**Step 5: Evaluate the second.** Try $y = a$: need $(b,a) \in \mathsf{Loves}$ — false. Try $y = b$: need $(a,b)$ — false. No witness, so $\mathcal{M} \not\models \exists y\, \forall x\, \mathsf{Loves}(x,y)$.

**Step 6: State the valid direction.** $\exists y\, \forall x\, \varphi \models \forall x\, \exists y\, \varphi$ — a single universal witness serves every $x$. The converse fails, as shown. Swapping $\exists\forall$ to $\forall\exists$ is always safe; the reverse never is.

---

# Section B — Semantics

## E3. Model checking in a small structure

Let $\Delta = \{1, 2, 3\}$ with $\mathsf{P}^{\mathcal{M}} = \{1, 2\}$ and $\mathsf{R}^{\mathcal{M}} = \{(1,2), (2,3), (1,3)\}$. Evaluate:

(a) $\forall x\, (\mathsf{P}(x) \rightarrow \exists y\, \mathsf{R}(x,y))$
(b) $\exists x\, (\mathsf{P}(x) \land \forall y\, \neg \mathsf{R}(y,x))$
(c) $\forall x \forall y \forall z\, \big((\mathsf{R}(x,y) \land \mathsf{R}(y,z)) \rightarrow \mathsf{R}(x,z)\big)$

### Solution

**Step 1: (a) Restrict to where the antecedent holds.** $\mathsf{P}$ holds of $1$ and $2$; for $x = 3$ the implication is vacuously true.
- $x = 1$: is there $y$ with $(1,y) \in \mathsf{R}$? Yes, $y = 2$ ✓
- $x = 2$: $(2,3) \in \mathsf{R}$ ✓

All cases hold, so (a) is **true**.

**Step 2: (b) Read the claim.** There is a $\mathsf{P}$-element with **no incoming** $\mathsf{R}$-edge.
- $x = 1$: incoming pairs would be $(y,1)$. Checking $\mathsf{R}$: none has second component $1$ ✓. So $\forall y\, \neg\mathsf{R}(y,1)$ holds, and $\mathsf{P}(1)$ holds.

A witness exists, so (b) is **true**.

**Step 3: (c) Check transitivity.** Find all $(x,y),(y,z)$ pairs that chain:
- $(1,2)$ and $(2,3)$ chain with $x=1, z=3$. Need $(1,3) \in \mathsf{R}$ — present ✓
- $(2,3)$: need some $(3,z)$ — none, so no further chains.
- $(1,3)$: need some $(3,z)$ — none.

Every applicable instance is satisfied, so (c) is **true** — $\mathsf{R}$ is transitive on this structure.

**Step 4: Note the technique.** For $\forall$ over an implication, enumerate only the tuples satisfying the antecedent — the rest are vacuous. For $\exists$, stop at the first witness. Both save substantial work in an exam.

---

## E4. Refute an entailment with a countermodel

Does $\forall x\, (\mathsf{P}(x) \rightarrow \mathsf{Q}(x)) \models \forall x\, (\mathsf{Q}(x) \rightarrow \mathsf{P}(x))$? Prove or refute.

### Solution

**Step 1: State the test.** Entailment holds iff every model of the premise satisfies the conclusion. To refute, build a model of the premise falsifying the conclusion.

**Step 2: Design.** We want every $\mathsf{P}$ to be a $\mathsf{Q}$, but some $\mathsf{Q}$ that is not a $\mathsf{P}$.

**Step 3: Specify.** $\Delta = \{a, b\}$, $\mathsf{P}^{\mathcal{M}} = \{a\}$, $\mathsf{Q}^{\mathcal{M}} = \{a, b\}$.

**Step 4: Verify the premise.** For $x = a$: $\mathsf{P}(a)$ true and $\mathsf{Q}(a)$ true, so the implication holds. For $x = b$: $\mathsf{P}(b)$ false, so vacuously true. Premise ✓.

**Step 5: Verify the conclusion fails.** For $x = b$: $\mathsf{Q}(b)$ true but $\mathsf{P}(b)$ false, so $\mathsf{Q}(b) \rightarrow \mathsf{P}(b)$ is **false**, hence the universal claim fails ✗.

**Step 6: Conclude.** $\mathcal{M}$ models the premise and refutes the conclusion, so the entailment **does not hold**. Converse implication is not entailed — the same error as confusing a GCI with a definition in description logic.

---

# Section C — Formalisation

## E5. Formalise with care over quantifier order

Formalise: (a) every student has a supervisor; (b) some supervisor supervises every student; (c) no student supervises themselves; (d) every student has exactly one supervisor.

### Solution

**Step 1: (a).**
$$\forall x\, \big(\mathsf{Student}(x) \rightarrow \exists y\, (\mathsf{Supervisor}(y) \land \mathsf{Supervises}(y,x))\big)$$
The $\exists$ sits **inside** the $\forall$, so different students may have different supervisors.

**Step 2: (b).**
$$\exists y\, \big(\mathsf{Supervisor}(y) \land \forall x\, (\mathsf{Student}(x) \rightarrow \mathsf{Supervises}(y,x))\big)$$
The $\exists$ is now **outermost** — one supervisor for all students. Note this is strictly stronger than (a): by E2, Step 6, (b) entails (a) but not conversely.

**Step 3: (c).**
$$\forall x\, \big(\mathsf{Student}(x) \rightarrow \neg\mathsf{Supervises}(x,x)\big)$$
equivalently $\neg\exists x\, (\mathsf{Student}(x) \land \mathsf{Supervises}(x,x))$.

**Step 4: (d) Uniqueness needs equality.** "Exactly one" is "at least one **and** at most one":
$$\forall x\, \Big(\mathsf{Student}(x) \rightarrow \exists y\, \big(\mathsf{Supervises}(y,x) \land \forall z\, (\mathsf{Supervises}(z,x) \rightarrow z = y)\big)\Big)$$
The inner universal states that any supervisor of $x$ **is** $y$, giving uniqueness.

**Step 5: Note the requirement.** (d) is inexpressible without the equality predicate $=$. This is why FOL with equality is the standard setting, and why cardinality claims need OWL constructs rather than plain RDFS (chapter 71, E5a).

**Step 6: Note the restricted-quantifier idiom.** Universals over a class use $\rightarrow$ ($\forall x (C(x) \rightarrow \ldots)$) while existentials use $\land$ ($\exists x (C(x) \land \ldots)$). Mixing these up — writing $\forall x (C(x) \land \ldots)$ — asserts that **everything** is a $C$, a very different and usually false claim. It is the single most common formalisation error in this material.
