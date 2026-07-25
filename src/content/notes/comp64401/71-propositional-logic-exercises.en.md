---
subject: COMP64401
chapter: 71
title: "Propositional Logic — Extra Exercises"
language: en
---

# Propositional Logic — Extra Exercise Set

A second layer of problems on top of chapter 51, weighted toward the parts that carry marks but are easy to fumble: entailment counterexamples, the reductions between reasoning tasks, and KB-modelling checks. Every exercise has a full worked solution.

**Prerequisite:** the primitive language is $\{\neg, \land, \lor\}$ over a variable set $\mathcal{P}$, with $\Rightarrow$ and $\Leftrightarrow$ as syntactic sugar.

## Exercise types

1. **Semantic evaluation** under a given valuation.
2. **Classification** — satisfiable, valid, unsatisfiable.
3. **Entailment** — prove, or refute with an explicit counterexample.
4. **Equivalence** — prove, or refute with a distinguishing valuation.
5. **Sugar elimination** and NNF conversion.
6. **Task reduction** — express one reasoning task using another.
7. **KB modelling** — check consistency, desired entailments, undesired properties.

---

# Section A — Semantics and classification

## E1. Evaluate under a valuation

Let $v(p) = 1$, $v(q) = 0$, $v(r) = 1$. Evaluate

$$\varphi = \neg\big((p \land \neg q) \lor (r \land q)\big) \lor (\neg r \land p)$$

### Solution

**Step 1: Innermost conjunctions.**
$v(\neg q) = 1$, so $v(p \land \neg q) = \min(1,1) = 1$.
$v(r \land q) = \min(1,0) = 0$.

**Step 2: The disjunction inside the negation.**
$v\big((p \land \neg q) \lor (r \land q)\big) = \max(1,0) = 1$.

**Step 3: Apply the negation.**
$v(\neg(\cdots)) = 1 - 1 = 0$.

**Step 4: The right disjunct.**
$v(\neg r) = 0$, so $v(\neg r \land p) = \min(0,1) = 0$.

**Step 5: Combine.**
$v(\varphi) = \max(0, 0) = \boxed{0}$.

**Check.** $\varphi$ has the shape $\neg\alpha \lor \beta$. We found $\alpha$ true and $\beta$ false, so $\varphi$ must be false — consistent.

---

## E2. Classify three formulae

For each, decide whether it is valid, satisfiable but not valid, or unsatisfiable. Justify with a valuation where one suffices.

(a) $(p \lor q) \lor \neg p$  (b) $(p \lor q) \land (\neg p \land \neg q)$  (c) $(p \land q) \lor \neg p$

### Solution

**Step 1: Recall what must be shown.** *Valid* — true under every valuation. *Unsatisfiable* — true under none. *Satisfiable but not valid* — needs **two** witnesses: one valuation making it true, one making it false.

**Step 2: (a).** Consider any $v$. If $v(p) = 1$ then $v(p \lor q) = 1$, so the disjunction is $1$. If $v(p) = 0$ then $v(\neg p) = 1$, so the disjunction is $1$. Every case gives $1$, so (a) is **valid**.

**Step 3: (b).** Suppose $v$ makes it true. Then $v(\neg p \land \neg q) = 1$, so $v(p) = v(q) = 0$, giving $v(p \lor q) = 0$ — contradicting that the first conjunct is true. No such $v$ exists, so (b) is **unsatisfiable**.

**Step 4: (c).** Take $v(p) = 0$: then $v(\neg p) = 1$, so the formula is $1$ — satisfiable. Take $v(p) = 1, v(q) = 0$: then $v(p \land q) = 0$ and $v(\neg p) = 0$, so the formula is $0$ — not valid. Hence **satisfiable but not valid**.

**Answer.** (a) valid; (b) unsatisfiable; (c) satisfiable, not valid.

**Marking note.** For "satisfiable but not valid" one valuation is never enough. Supply both.

---

## E3. Truth table with a shared subformula

Build the truth table for $\varphi = (p \Rightarrow q) \land (q \Rightarrow r)$ and state whether $\varphi \models (p \Rightarrow r)$.

### Solution

**Step 1: Eliminate sugar.** $\alpha \Rightarrow \beta$ abbreviates $\neg\alpha \lor \beta$, so
$$\varphi = (\neg p \lor q) \land (\neg q \lor r).$$

**Step 2: Tabulate.** Eight rows; last column is $p \Rightarrow r$.

| $p$ | $q$ | $r$ | $\neg p \lor q$ | $\neg q \lor r$ | $\varphi$ | $p \Rightarrow r$ |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 1 | 1 | **1** | 1 |
| 0 | 0 | 1 | 1 | 1 | **1** | 1 |
| 0 | 1 | 0 | 1 | 0 | 0 | 1 |
| 0 | 1 | 1 | 1 | 1 | **1** | 1 |
| 1 | 0 | 0 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 1 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 | **1** | 1 |

**Step 3: Test entailment.** $\varphi \models p \Rightarrow r$ holds iff every row with $\varphi = 1$ also has $p \Rightarrow r = 1$. The rows with $\varphi = 1$ are 1, 2, 4, 8, and each has $p \Rightarrow r = 1$.

**Answer.** Yes, $\varphi \models (p \Rightarrow r)$ — the transitivity of implication.

**Step 4: Note what was not claimed.** The converse fails: row 5 has $p \Rightarrow r$... no, row 5 has $p \Rightarrow r = 0$. Take row 6 instead ($p=1,q=0,r=1$): $p \Rightarrow r = 1$ but $\varphi = 0$. So $(p \Rightarrow r) \not\models \varphi$, and the two are not equivalent.

---

# Section B — Entailment, equivalence, reductions

## E4. Refute an entailment with an explicit counterexample

Does $\{p \lor q,\ \neg p \lor r\} \models q \lor r$? Prove or refute.

### Solution

**Step 1: State the test.** The entailment holds iff **every** valuation satisfying both premises also satisfies the conclusion. To refute, exhibit one valuation satisfying the premises but not the conclusion.

**Step 2: Force the conclusion false.** $v(q \lor r) = 0$ requires $v(q) = 0$ and $v(r) = 0$.

**Step 3: Try to satisfy the premises under that constraint.**
- Premise 1: $v(p \lor q) = 1$ with $v(q) = 0$ forces $v(p) = 1$.
- Premise 2: $v(\neg p \lor r) = 1$ with $v(r) = 0$ forces $v(\neg p) = 1$, i.e. $v(p) = 0$.

**Step 4: Detect the contradiction.** Step 3 requires $v(p) = 1$ and $v(p) = 0$. No valuation does both, so no counterexample exists.

**Step 5: Conclude.** The entailment **holds**: $\{p \lor q,\ \neg p \lor r\} \models q \lor r$.

**Remark.** This is resolution on $p$: from $p \lor q$ and $\neg p \lor r$, resolve to get $q \lor r$. The attempted-counterexample method and resolution are two views of the same fact.

---

## E5. Refute an equivalence

Is $\neg(p \land q)$ equivalent to $\neg p \land \neg q$? If not, give a distinguishing valuation and the correct equivalence.

### Solution

**Step 1: State the test.** Two formulae are equivalent iff they agree under every valuation. To refute, find one valuation where they differ.

**Step 2: Search.** Try $v(p) = 1$, $v(q) = 0$.
- $v(p \land q) = 0$, so $v(\neg(p \land q)) = 1$.
- $v(\neg p) = 0$, so $v(\neg p \land \neg q) = 0$.

**Step 3: Conclude non-equivalence.** They differ at this valuation ($1$ versus $0$), so they are **not** equivalent.

**Step 4: Give the correct law.** By De Morgan,
$$\neg(p \land q) \equiv \neg p \lor \neg q.$$

**Step 5: Verify the corrected form at the witness.** $v(\neg p \lor \neg q) = \max(0, 1) = 1$, matching $v(\neg(p \land q)) = 1$. ✓

**Step 6: State the companion law.** $\neg(p \lor q) \equiv \neg p \land \neg q$ — note the negation **swaps** the connective. Asserting $\neg p \land \neg q$ for $\neg(p \land q)$ is the single most common error in this material.

---

## E6. Convert to NNF

Put $\neg\big((p \Rightarrow q) \lor \neg(r \land \neg s)\big)$ into negation normal form.

### Solution

**Step 1: Eliminate sugar.** $p \Rightarrow q$ becomes $\neg p \lor q$:
$$\neg\big((\neg p \lor q) \lor \neg(r \land \neg s)\big).$$

**Step 2: Push the outer negation over the top-level $\lor$** (De Morgan):
$$\neg(\neg p \lor q) \;\land\; \neg\neg(r \land \neg s).$$

**Step 3: Handle the left conjunct** (De Morgan again, then double negation):
$$\neg(\neg p \lor q) \equiv \neg\neg p \land \neg q \equiv p \land \neg q.$$

**Step 4: Handle the right conjunct** (double negation):
$$\neg\neg(r \land \neg s) \equiv r \land \neg s.$$

**Step 5: Assemble.**
$$(p \land \neg q) \land (r \land \neg s)$$
or, flattening, $p \land \neg q \land r \land \neg s$.

**Step 6: Check NNF.** Negations appear only directly on variables, and only $\land, \lor$ remain. ✓

**Step 7: Sanity-check semantically.** The result is true only when $p=1, q=0, r=1, s=0$. Verify on the original: $p \Rightarrow q$ is $0$; $r \land \neg s$ is $1$ so $\neg(r \land \neg s)$ is $0$; the disjunction is $0$; the outer negation gives $1$. ✓

---

## E7. Reduce every reasoning task to SAT

You have only a satisfiability checker $\mathrm{SAT}(\cdot)$ returning yes/no. Express validity, equivalence, and entailment using it.

### Solution

**Step 1: Validity.** $\varphi$ is valid iff no valuation makes it false, i.e. iff $\neg\varphi$ is unsatisfiable:
$$\varphi \text{ valid} \iff \mathrm{SAT}(\neg\varphi) = \text{no}.$$

**Step 2: Entailment.** $\varphi \models \psi$ iff no valuation makes $\varphi$ true and $\psi$ false:
$$\varphi \models \psi \iff \mathrm{SAT}(\varphi \land \neg\psi) = \text{no}.$$

**Step 3: Generalise to a set of premises.** For $\Gamma = \{\gamma_1, \dots, \gamma_n\}$:
$$\Gamma \models \psi \iff \mathrm{SAT}(\gamma_1 \land \cdots \land \gamma_n \land \neg\psi) = \text{no}.$$

**Step 4: Equivalence.** $\varphi \equiv \psi$ iff they never differ. They differ exactly when one is true and the other false:
$$\varphi \equiv \psi \iff \mathrm{SAT}\big((\varphi \land \neg\psi) \lor (\neg\varphi \land \psi)\big) = \text{no}.$$

Equivalently, two calls: $\varphi \models \psi$ and $\psi \models \varphi$.

**Step 5: State the moral.** Four reasoning tasks, **one** engine. This is why "do we need four reasoners?" is answered *no*: satisfiability is the primitive, and the rest are reductions to it. Note each reduction works by **negating the goal** and asking for a counterexample — if none exists, the claim holds.

---

# Section C — Knowledge-base modelling

## E8. Diagnose a knowledge base

A KB about a lift is $\Gamma = \{\, m \Rightarrow \neg d,\;\; d \lor m,\;\; \neg m \,\}$, where $m$ = "moving", $d$ = "doors open". Check consistency, then whether $\Gamma \models d$, then whether $\Gamma$ is valid.

### Solution

**Step 1: Consistency.** Seek a valuation satisfying all three. From $\neg m$: $v(m) = 0$. Then $m \Rightarrow \neg d$ is $\neg 0 \lor \neg d = 1$, satisfied regardless of $d$. Then $d \lor m = d \lor 0$ requires $v(d) = 1$.

So $v(m) = 0, v(d) = 1$ satisfies all three. $\Gamma$ is **consistent (satisfiable)**.

**Step 2: Entailment of $d$.** Test $\mathrm{SAT}(\Gamma \land \neg d)$. Setting $v(d) = 0$ and, from $\neg m$, $v(m) = 0$ makes $d \lor m = 0$, violating the second axiom. So no valuation satisfies $\Gamma \land \neg d$, and $\Gamma \models d$ **holds**.

**Step 3: Validity of $\Gamma$.** $\Gamma$ (as the conjunction of its axioms) is valid iff true under *every* valuation. Take $v(m) = 1$: then $\neg m$ is false, so the conjunction is false. $\Gamma$ is **not valid**.

**Step 4: State why this is the desired shape.** A good system description is **satisfiable but not valid**. Satisfiable means the description is realisable — it does not contradict itself. Not valid means it actually **says something**: it excludes some states of affairs. A valid KB rules nothing out and is therefore vacuous.

**Step 5: Note the modelling observation.** $\Gamma$ has exactly one model ($m = 0$, $d = 1$), so it pins the system to a single state. That is consistent but usually over-constrained for a real specification — worth flagging in a modelling answer.

---

## E9. Check a desired entailment and an undesired property

Extend the lift KB to $\Gamma' = \{\, m \Rightarrow \neg d,\;\; d \lor m \,\}$. (a) Does $\Gamma' \models \neg(m \land d)$? (b) Is the "unsafe" state $m \land d$ possible?

### Solution

**Step 1: (a) Set up.** Test whether $\mathrm{SAT}\big(\Gamma' \land \neg\neg(m \land d)\big)$, i.e. $\mathrm{SAT}(\Gamma' \land m \land d)$, is unsatisfiable.

**Step 2: Attempt to satisfy.** Require $v(m) = 1$ and $v(d) = 1$. Then the first axiom $m \Rightarrow \neg d$ evaluates to $\neg 1 \lor \neg 1 = 0 \lor 0 = 0$ — violated.

**Step 3: Conclude (a).** No valuation satisfies $\Gamma' \land m \land d$, so $\Gamma' \models \neg(m \land d)$ **holds**. The safety property is entailed.

**Step 4: (b) Interpret.** Asking whether the unsafe state is *possible* is asking whether $\Gamma' \cup \{m \land d\}$ is satisfiable. Step 2 showed it is not.

**Step 5: State the general pattern.** For a **desired** property $\pi$, check $\Gamma \models \pi$ — equivalently that $\Gamma \land \neg\pi$ is unsatisfiable. For an **undesired** property $\pi$, check that $\Gamma \land \pi$ is **unsatisfiable**. Both reduce to satisfiability, per E7.

**Step 6: Note the trap.** $\Gamma \not\models \pi$ does **not** mean $\Gamma \models \neg\pi$. It means $\pi$ is *not forced* — it may still be possible. Here $\Gamma' \not\models m$ and $\Gamma' \not\models \neg m$: both remain possible, since $\Gamma'$ has models with $m=1,d=0$ and with $m=0,d=1$. Confusing "not entailed" with "entailed false" is a standard and costly error.

---

## E10. Prove that entailment reduces to validity

Show $\varphi \models \psi$ iff $\varphi \Rightarrow \psi$ is valid, working from the definitions.

### Solution

**Step 1: State the two definitions.**
- $\varphi \models \psi$: for every valuation $v$, if $v(\varphi) = 1$ then $v(\psi) = 1$.
- $\varphi \Rightarrow \psi$ valid: for every valuation $v$, $v(\varphi \Rightarrow \psi) = 1$.

**Step 2: Expand the sugar.** $v(\varphi \Rightarrow \psi) = v(\neg\varphi \lor \psi) = \max(1 - v(\varphi),\, v(\psi))$.

**Step 3: Determine when that equals 1.** The maximum is $1$ iff $1 - v(\varphi) = 1$ or $v(\psi) = 1$, i.e. iff $v(\varphi) = 0$ **or** $v(\psi) = 1$.

**Step 4: Recognise the material conditional.** "$v(\varphi) = 0$ or $v(\psi) = 1$" is exactly "if $v(\varphi) = 1$ then $v(\psi) = 1$".

**Step 5: Quantify over all valuations.** Holding for every $v$, the two statements coincide:
$$\varphi \models \psi \iff \varphi \Rightarrow \psi \text{ is valid.}$$

**Step 6: Close the triangle with E7.** Combining with Step 1 of E7 (validity reduces to unsatisfiability of the negation):
$$\varphi \models \psi \iff \varphi \Rightarrow \psi \text{ valid} \iff \neg(\varphi \Rightarrow \psi) \text{ unsatisfiable} \iff \varphi \land \neg\psi \text{ unsatisfiable},$$
using $\neg(\neg\varphi \lor \psi) \equiv \varphi \land \neg\psi$. This is the theorem relating the reasoning tasks, derived rather than quoted.
