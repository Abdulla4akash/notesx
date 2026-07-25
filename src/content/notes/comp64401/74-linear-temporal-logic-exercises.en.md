---
subject: COMP64401
chapter: 74
title: "Linear Temporal Logic — Extra Exercises"
language: en
---

# Linear Temporal Logic — Extra Exercise Set

A second layer of problems on top of chapter 54, weighted toward the two things that reliably lose marks: the exact semantics of **until**, and distinguishing claims that look equivalent but are not.

**Prerequisite.** An LTL valuation assigns to each time point $i \in \mathbb{N}$ a set of true variables. Writing $v, i \models \varphi$ for "$\varphi$ holds at point $i$":

- $v, i \models \mathsf{X}\varphi$ iff $v, i{+}1 \models \varphi$
- $v, i \models \varphi \,\mathsf{U}\, \psi$ iff there is $j \geq i$ with $v, j \models \psi$ and $v, k \models \varphi$ for all $k$ with $i \leq k < j$
- $\mathsf{F}\varphi := \top \,\mathsf{U}\, \varphi$ and $\mathsf{G}\varphi := \neg\mathsf{F}\neg\varphi$

## Exercise types

1. **Pointwise evaluation** on a given trace.
2. **Until reasoning** — locate the witness point and check the prefix obligation.
3. **Trace construction** — build a trace satisfying or falsifying a formula.
4. **Equivalence and non-equivalence** — prove, or refute with a trace.
5. **Unfolding** — apply the fixpoint identity for until.
6. **Specification** — express English properties in LTL.

---

# Section A — Evaluation on traces

## E1. Evaluate at several points

Let the trace be, with $p$ listed where true:

| $i$ | 0 | 1 | 2 | 3 | 4 | 5, 6, … |
|---|---|---|---|---|---|---|
| $p$ | 1 | 1 | 0 | 1 | 1 | 1 |
| $q$ | 0 | 0 | 1 | 0 | 0 | 0 |

Decide (a) $v,0 \models p \,\mathsf{U}\, q$; (b) $v,3 \models p \,\mathsf{U}\, q$; (c) $v,0 \models \mathsf{X}\mathsf{X}q$; (d) $v,0 \models \mathsf{G}(q \Rightarrow \mathsf{X}p)$.

### Solution

**Step 1: (a) Find the witness for $q$.** $q$ is true only at $i = 2$, so $j = 2$ is the only candidate.

**Step 2: Check the prefix obligation.** Need $p$ at every $k$ with $0 \le k < 2$, i.e. at $k = 0$ and $k = 1$. Both have $p = 1$ ✓.

So $v,0 \models p \,\mathsf{U}\, q$ — **yes**.

**Step 3: (b) Look for a witness from point 3 onward.** Need some $j \ge 3$ with $q$ true. $q$ is false at $3, 4, 5, \dots$ — no witness exists.

So $v,3 \not\models p \,\mathsf{U}\, q$ — **no**. Note this holds even though $p$ is true throughout from 3 onward: until **requires** the eventual $\psi$.

**Step 4: (c) Evaluate $\mathsf{X}\mathsf{X}q$ at 0.** $v,0 \models \mathsf{X}\mathsf{X}q$ iff $v,1 \models \mathsf{X}q$ iff $v,2 \models q$. And $q$ is true at 2 ✓ — **yes**.

**Step 5: (d) Evaluate $\mathsf{G}(q \Rightarrow \mathsf{X}p)$.** This requires $q \Rightarrow \mathsf{X}p$ at **every** point. The implication is vacuously true wherever $q$ is false, so only $i = 2$ matters. At $i = 2$: $q$ is true, so we need $v,3 \models p$, and $p = 1$ at 3 ✓.

Every point satisfies the implication, so — **yes**.

**Step 6: Note the pattern in (d).** $\mathsf{G}(\alpha \Rightarrow \beta)$ questions reduce to checking only the points where $\alpha$ holds. Identify those first rather than scanning the whole trace.

---

## E2. Until with a false left argument

On the trace where $q$ is true at $i = 0$ and $p$ is false everywhere, decide $v,0 \models p \,\mathsf{U}\, q$.

### Solution

**Step 1: Apply the definition.** Need $j \ge 0$ with $v,j \models q$, and $p$ at all $k$ with $0 \le k < j$.

**Step 2: Take $j = 0$.** Then $q$ holds at $0$ ✓.

**Step 3: Check the prefix obligation for $j = 0$.** The condition is "$p$ at all $k$ with $0 \le k < 0$" — an **empty** range. A universal claim over an empty set is vacuously **true**, so nothing about $p$ is required.

**Step 4: Conclude.** $v,0 \models p \,\mathsf{U}\, q$ — **yes**, even though $p$ is false everywhere.

**Step 5: State the general consequence.** If $\psi$ holds now, then $\varphi \,\mathsf{U}\, \psi$ holds now, **for any** $\varphi$:
$$\psi \models \varphi \,\mathsf{U}\, \psi.$$
In particular $\bot \,\mathsf{U}\, \psi$ holds at $i$ exactly when $\psi$ holds at $i$ — the left argument is irrelevant when the witness is immediate.

**Step 6: Name the misconception this defeats.** Reading $\varphi \,\mathsf{U}\, \psi$ as "$\varphi$ holds for a while, *then* $\psi$" wrongly suggests $\varphi$ must hold at least once. It need not: the prefix can be empty.

---

## E3. Until does not mean "and then stops"

Construct a trace where $p \,\mathsf{U}\, q$ holds at 0 **and** $p$ remains true after the witness point. Explain what this shows.

### Solution

**Step 1: Design the trace.** Make $q$ true at $i=1$ and $p$ true everywhere.

| $i$ | 0 | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| $p$ | 1 | 1 | 1 | 1 | 1 |
| $q$ | 0 | 1 | 0 | 0 | 0 |

**Step 2: Verify $p \,\mathsf{U}\, q$ at 0.** Take $j = 1$: $q$ holds at 1 ✓. Prefix obligation: $p$ at $k = 0$ ✓. So $v,0 \models p \,\mathsf{U}\, q$.

**Step 3: Observe the continuation.** $p$ is still true at $1, 2, 3, \dots$ — after and including the witness point.

**Step 4: State what this shows.** The definition constrains $\varphi$ only **strictly before** the witness $j$. It says nothing about $\varphi$ at $j$ or after. So "until" does **not** imply that $\varphi$ ceases.

**Step 5: Give the formula that does say it stops.** To require $p$ false once $q$ arrives, state it explicitly, e.g.
$$(p \,\mathsf{U}\, q) \land \mathsf{G}(q \Rightarrow \mathsf{X}\mathsf{G}\neg p).$$
The extra conjunct is doing all the "stopping" work — the until contributes none of it.

---

# Section B — Equivalences and refutations

## E4. Refute a tempting equivalence

Is $\mathsf{F}p \land \mathsf{F}q$ equivalent to $\mathsf{F}(p \land q)$? Prove or refute.

### Solution

**Step 1: Understand the two claims.** $\mathsf{F}p \land \mathsf{F}q$: $p$ happens at some point, and $q$ happens at some point — possibly **different** points. $\mathsf{F}(p \land q)$: there is a **single** point where both hold.

**Step 2: Build a distinguishing trace.** Put $p$ and $q$ true at different points and never together.

| $i$ | 0 | 1 | 2, 3, … |
|---|---|---|---|
| $p$ | 1 | 0 | 0 |
| $q$ | 0 | 1 | 0 |

**Step 3: Evaluate the left side at 0.** $\mathsf{F}p$: witness $i=0$ ✓. $\mathsf{F}q$: witness $i=1$ ✓. So $v,0 \models \mathsf{F}p \land \mathsf{F}q$.

**Step 4: Evaluate the right side at 0.** Need some $i$ with both $p$ and $q$ true. At $0$: $q$ false. At $1$: $p$ false. Elsewhere both false. No such point, so $v,0 \not\models \mathsf{F}(p \land q)$.

**Step 5: Conclude.** Not equivalent:
$$\mathsf{F}p \land \mathsf{F}q \;\not\equiv\; \mathsf{F}(p \land q).$$

**Step 6: State the one-way implication that does hold.** $\mathsf{F}(p \land q) \models \mathsf{F}p \land \mathsf{F}q$ — a single point where both hold witnesses each separately. The converse fails, as shown.

**Step 7: Contrast with the distributions that are valid.** $\mathsf{F}$ distributes over $\lor$ and $\mathsf{G}$ over $\land$:
$$\mathsf{F}(p \lor q) \equiv \mathsf{F}p \lor \mathsf{F}q, \qquad \mathsf{G}(p \land q) \equiv \mathsf{G}p \land \mathsf{G}q.$$
The failing directions are $\mathsf{F}$ over $\land$ and $\mathsf{G}$ over $\lor$. Learn which way each goes.

---

## E5. Prove an equivalence from the definitions

Show $\neg\mathsf{F}\varphi \equiv \mathsf{G}\neg\varphi$.

### Solution

**Step 1: Expand $\mathsf{F}$.** $\mathsf{F}\varphi := \top \,\mathsf{U}\, \varphi$. By the until clause, $v,i \models \mathsf{F}\varphi$ iff there is $j \ge i$ with $v,j \models \varphi$ (the prefix obligation on $\top$ is automatic).

**Step 2: Negate.** $v,i \models \neg\mathsf{F}\varphi$ iff there is **no** $j \ge i$ with $v,j \models \varphi$, i.e. for **all** $j \ge i$, $v,j \not\models \varphi$, i.e. for all $j \ge i$, $v,j \models \neg\varphi$.

**Step 3: Expand $\mathsf{G}$.** By definition $\mathsf{G}\psi := \neg\mathsf{F}\neg\psi$, so
$$v,i \models \mathsf{G}\neg\varphi \iff v,i \models \neg\mathsf{F}\neg\neg\varphi \iff v,i \models \neg\mathsf{F}\varphi,$$
using $\neg\neg\varphi \equiv \varphi$.

**Step 4: Alternatively, read $\mathsf{G}$ directly.** Unwinding the definition once gives the standard reading: $v,i \models \mathsf{G}\psi$ iff for all $j \ge i$, $v,j \models \psi$. With $\psi = \neg\varphi$ this is exactly Step 2's condition.

**Step 5: Conclude.** Both sides hold at $i$ under precisely the same condition, so $\neg\mathsf{F}\varphi \equiv \mathsf{G}\neg\varphi$. The dual $\neg\mathsf{G}\varphi \equiv \mathsf{F}\neg\varphi$ follows by negating both sides.

**Step 6: Note the significance.** $\mathsf{F}$ and $\mathsf{G}$ are De Morgan duals across time, exactly as $\exists$ and $\forall$ are in first-order logic. This is why only one of them needs to be primitive.

---

## E6. Apply the unfolding property

State and verify the unfolding identity for until, then use it to evaluate $p \,\mathsf{U}\, q$ at 0 on a short trace.

### Solution

**Step 1: State the identity.**
$$\varphi \,\mathsf{U}\, \psi \;\equiv\; \psi \;\lor\; \big(\varphi \land \mathsf{X}(\varphi \,\mathsf{U}\, \psi)\big).$$

**Step 2: Justify it from the definition.** $v,i \models \varphi \,\mathsf{U}\, \psi$ means some $j \ge i$ witnesses $\psi$ with $\varphi$ holding strictly before. Two cases:
- $j = i$: then $\psi$ holds now — the left disjunct.
- $j > i$: then $\psi$ does not hold at $i$ via this witness, $\varphi$ must hold at $i$ (since $i < j$), and the same until claim holds from $i{+}1$ with witness $j$ — the right disjunct.

Conversely each disjunct gives a witness, so the two sides coincide.

**Step 3: Set up a trace.**

| $i$ | 0 | 1 | 2 | 3, … |
|---|---|---|---|---|
| $p$ | 1 | 1 | 0 | 0 |
| $q$ | 0 | 0 | 1 | 0 |

**Step 4: Unfold at 0.** $q$ false at 0, so the left disjunct fails. $p$ true at 0 ✓, so we need $v,1 \models p \,\mathsf{U}\, q$.

**Step 5: Unfold at 1.** $q$ false at 1; $p$ true at 1 ✓; so we need $v,2 \models p \,\mathsf{U}\, q$.

**Step 6: Unfold at 2.** $q$ **true** at 2, so the left disjunct succeeds: $v,2 \models p \,\mathsf{U}\, q$.

**Step 7: Propagate back.** Step 5 gives $v,1 \models p \,\mathsf{U}\, q$; Step 4 gives $v,0 \models p \,\mathsf{U}\, q$ ✓ — agreeing with the direct method (witness $j=2$, prefix $p$ at $0,1$).

**Step 8: Note why the identity matters.** It expresses until as a **fixpoint**, letting an evaluator step forward one point at a time instead of searching for a witness. This is the basis of LTL model-checking algorithms, and it is also why $\mathsf{X}$ plus a fixpoint is enough to capture until.

---

# Section C — Specification

## E7. Formalise English properties

Express in LTL: (a) $p$ holds at every point; (b) $p$ holds infinitely often; (c) $p$ eventually holds forever; (d) every request is eventually acknowledged; (e) $p$ never holds twice in a row.

### Solution

**Step 1: (a) Always.**
$$\mathsf{G}p$$

**Step 2: (b) Infinitely often.** At every point, $p$ still lies ahead:
$$\mathsf{G}\mathsf{F}p$$
Because $\mathsf{F}p$ must hold at arbitrarily late points, occurrences cannot run out.

**Step 3: (c) Eventually forever (stabilisation).** At some point, $p$ holds from there on:
$$\mathsf{F}\mathsf{G}p$$

**Step 4: Distinguish (b) and (c).** $\mathsf{F}\mathsf{G}p \models \mathsf{G}\mathsf{F}p$ but **not** conversely. A trace alternating $p$ true, false, true, false, … satisfies $\mathsf{G}\mathsf{F}p$ (infinitely many occurrences) yet fails $\mathsf{F}\mathsf{G}p$ (it never settles). The nesting order of $\mathsf{F}$ and $\mathsf{G}$ is the whole content of the distinction.

**Step 5: (d) Response.**
$$\mathsf{G}(\mathsf{req} \Rightarrow \mathsf{F}\mathsf{ack})$$
Note $\mathsf{F}$ includes the present, so a same-point acknowledgement counts. For a strictly later one, use $\mathsf{G}(\mathsf{req} \Rightarrow \mathsf{X}\mathsf{F}\mathsf{ack})$.

**Step 6: (e) No two consecutive.**
$$\mathsf{G}(p \Rightarrow \mathsf{X}\neg p)$$
Whenever $p$ holds, it fails at the next point.

**Step 7: Note the shapes worth memorising.** $\mathsf{G}(\cdot)$ = invariant; $\mathsf{G}(\alpha \Rightarrow \mathsf{F}\beta)$ = response; $\mathsf{G}\mathsf{F}$ = fairness/liveness; $\mathsf{F}\mathsf{G}$ = stabilisation. Most specification questions are one of these four with the arguments filled in.

---

## E8. Refute an equivalence between nested modalities

Show $\mathsf{G}\mathsf{F}p \not\equiv \mathsf{F}\mathsf{G}p$ with an explicit trace, and state which direction holds.

### Solution

**Step 1: Build the alternating trace.** Let $p$ be true exactly at even points:

| $i$ | 0 | 1 | 2 | 3 | 4 | 5 | … |
|---|---|---|---|---|---|---|---|
| $p$ | 1 | 0 | 1 | 0 | 1 | 0 | … |

**Step 2: Check $\mathsf{G}\mathsf{F}p$ at 0.** Fix any $i$. There is an even number $\ge i$, so $\mathsf{F}p$ holds at $i$. Since this is true for every $i$, $v,0 \models \mathsf{G}\mathsf{F}p$ ✓.

**Step 3: Check $\mathsf{F}\mathsf{G}p$ at 0.** We would need some $i$ with $p$ true at **every** $j \ge i$. But every $i$ has an odd number $\ge i$ where $p$ is false. So no such $i$ exists, and $v,0 \not\models \mathsf{F}\mathsf{G}p$ ✗.

**Step 4: Conclude non-equivalence.** The trace satisfies $\mathsf{G}\mathsf{F}p$ but not $\mathsf{F}\mathsf{G}p$, so they are not equivalent.

**Step 5: Establish the valid direction.** Suppose $v,0 \models \mathsf{F}\mathsf{G}p$, so there is $i_0$ with $p$ true at all $j \ge i_0$. Take any $i$. Then $\max(i, i_0) \ge i$ and $p$ holds there, so $\mathsf{F}p$ holds at $i$. As $i$ was arbitrary, $\mathsf{G}\mathsf{F}p$ holds. Hence
$$\mathsf{F}\mathsf{G}p \models \mathsf{G}\mathsf{F}p,$$
and the converse fails by Steps 1–3.

**Step 6: Read the meanings back.** $\mathsf{G}\mathsf{F}p$ = "$p$ recurs forever" (infinitely often). $\mathsf{F}\mathsf{G}p$ = "$p$ eventually becomes permanent". Permanence implies recurrence; recurrence permits endless interruption. Stating both meanings in words is usually worth as much as the formal argument.
