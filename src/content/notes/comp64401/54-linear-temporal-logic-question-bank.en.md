---
subject: COMP64401
chapter: 54
title: "Linear Temporal Logic — Question Bank"
language: en
---

# COMP64401 — Linear Temporal Logic (LTL): Worked Question Bank

**Source used:** uploaded lecture sheet `COMP64401 Chapter 4 - Linear Temporal Logic.mht`.

This question bank drills only the task types that the sheet actually covers. It is arranged as a difficulty ramp: single-step mechanics first, then multi-condition checks, then construction tasks, then edge cases where the method can mislead you.

---

## Task types identified from the sheet

1. Check whether an expression is a well-formed LTL formula.
2. Expand syntactic sugar into the core LTL operators.
3. Evaluate atomic propositions, negation, disjunction, `X`, `U`, `E`, and `G` at a time point.
4. Use a witness time point for `until` and handle the vacuous case `j = i`.
5. Construct counterexamples to invalid semantic claims.
6. Convert a transition-system trace into an LTL valuation.
7. Distinguish: satisfaction at a time point, satisfaction by a valuation, satisfiable in a valuation, valid in a valuation, satisfiable, and valid.
8. Perform universal model checking over all traces of a transition system.
9. Classify system properties as local, safety, liveness, fairness-style, or precedence/past-looking.
10. Reduce model checking to validity by constructing the transition-system formula `φ_M`.
11. Reduce validity to model checking by constructing the universal transition system `M_ψ`.
12. Identify alpha formulae, beta formulae, eventualities, literals, and non-local `X` formulae.
13. Compute type expansions using alpha and beta rules, and discard clashes.
14. Build a small pre-tableau and apply elimination ideas.
15. Diagnose bad futures/lassos where an eventuality is postponed forever.
16. Match LTL limitations to the extension that fixes them.

---

# Section A — Mechanical / single-step practice

## A1. Well-formedness of LTL formulae

Assume the core LTL grammar uses propositional variables, `¬`, `∨`, `X`, and `U`, with the usual syntactic sugar allowed for `∧`, `→`, `E`, and `G`.

For each expression, decide whether it is a well-formed LTL formula.

1. `X(p ∨ q)`
2. `X ∨ p`
3. `p U (q ∨ Xr)`
4. `U(q ∨ r)`
5. `G(p → Eq)`
6. `(p U q) U r`

## A2. Expanding syntactic sugar

Expand the formula below into the core operators `¬`, `∨`, `X`, and `U` only:


$$

G(p \rightarrow E q)

$$


You may use a fresh tautology such as `(a ∨ ¬a)` for `⊤`.

## A3. Evaluating atomic, negation, disjunction, and next

Let valuation `V` be:


$$

V(0)=\{p\},\quad V(1)=\{q\},\quad V(2)=\{p,q\},\quad V(i)=\{q\}\text{ for all }i\ge 3.

$$


Decide whether each statement is true or false.

1. `V,0 ⊨ p`
2. `V,1 ⊨ ¬p ∨ q`
3. `V,1 ⊨ Xp`
4. `V,2 ⊨ X¬p`

## A4. Evaluating `until` with a witness

Use the same valuation from A3.

Decide whether each statement is true or false.

1. `V,0 ⊨ p U q`
2. `V,1 ⊨ p U q`
3. `V,2 ⊨ p U r`

## A5. Evaluating `eventually` and `globally`

Use the same valuation from A3.

Decide whether each statement is true or false.

1. `V,0 ⊨ Ep`
2. `V,3 ⊨ Ep`
3. `V,3 ⊨ Gq`
4. `V,0 ⊨ Gq`

## A6. Vacuous `until` with `⊥`

Let valuation `W` be:


$$

W(0)=\{q\},\quad W(1)=\{p\},\quad W(2)=\{q\},\quad W(i)=\{p\}\text{ for all }i\ge 3.

$$


Decide whether each statement is true or false.

1. `W,0 ⊨ ⊥ U q`
2. `W,1 ⊨ ⊥ U q`
3. `W,2 ⊨ ⊥ U q`

---

## Solutions — Section A

### Solution A1. Well-formedness of LTL formulae

**Step 1 — Check unary operators.**  
`X`, `E`, and `G` must be followed by a formula.

**Step 2 — Check binary operators.**  
`∨`, `∧`, `→`, and `U` need a formula on both sides.

**Step 3 — Decide each case.**

1. `X(p ∨ q)` is **well-formed**. `p ∨ q` is a formula, so `X(p ∨ q)` is a formula.
2. `X ∨ p` is **not well-formed**. `X` has no formula argument.
3. `p U (q ∨ Xr)` is **well-formed**. `p` is a formula, `q ∨ Xr` is a formula, and `U` has both sides.
4. `U(q ∨ r)` is **not well-formed**. `U` is binary and has no left-hand formula.
5. `G(p → Eq)` is **well-formed**, assuming the syntactic sugar `G`, `→`, and `E` is allowed.
6. `(p U q) U r` is **well-formed**. `p U q` is a formula, so it can itself be the left side of another `U`.

---

### Solution A2. Expanding syntactic sugar

**Step 1 — Replace implication.**


$$

p \rightarrow E q \equiv \neg p \lor E q.

$$


So:


$$

G(p \rightarrow E q) \equiv G(\neg p \lor E q).

$$


**Step 2 — Replace eventually.**


$$

E q := \top U q.

$$


Using `⊤ := a ∨ ¬a`:


$$

E q \equiv (a\lor \neg a)Uq.

$$


So:


$$

G(\neg p \lor E q)
\equiv
G\bigl(\neg p \lor ((a\lor \neg a)Uq)\bigr).

$$


**Step 3 — Replace globally.**


$$

G\theta := \neg E\neg\theta.

$$


Therefore:


$$

G\bigl(\neg p \lor ((a\lor \neg a)Uq)\bigr)
\equiv
\neg E\neg\bigl(\neg p \lor ((a\lor \neg a)Uq)\bigr).

$$


**Step 4 — Replace the remaining eventually.**


$$

E\alpha := \top U \alpha.

$$


Final core-operator version:


$$

\boxed{
\neg\Bigl((a\lor\neg a)U\neg\bigl(\neg p\lor((a\lor\neg a)Uq)\bigr)\Bigr)
}

$$


This uses only propositional variables, `¬`, `∨`, and `U`.

---

### Solution A3. Evaluating atomic, negation, disjunction, and next

The valuation is:


$$

V(0)=\{p\},\quad V(1)=\{q\},\quad V(2)=\{p,q\},\quad V(i)=\{q\}\text{ for }i\ge 3.

$$


#### 1. `V,0 ⊨ p`

**Step 1 — Use the atomic proposition rule.**  
`V,i ⊨ p` iff `p ∈ V(i)`.

**Step 2 — Check `V(0)`.**  
`V(0) = {p}`.

**Answer:** true.

#### 2. `V,1 ⊨ ¬p ∨ q`

**Step 1 — Evaluate the left disjunct.**  
At time `1`, `V(1) = {q}`, so `p ∉ V(1)`. Therefore `V,1 ⊨ ¬p`.

**Step 2 — Evaluate the right disjunct.**  
`q ∈ V(1)`, so `V,1 ⊨ q`.

**Step 3 — Apply disjunction.**  
At least one disjunct is true; in fact both are true.

**Answer:** true.

#### 3. `V,1 ⊨ Xp`

**Step 1 — Use the next rule.**  
`V,i ⊨ Xφ` iff `V,i+1 ⊨ φ`.

**Step 2 — Move from time `1` to time `2`.**  
`V(2) = {p,q}`.

**Step 3 — Check `p` at time `2`.**  
`p ∈ V(2)`.

**Answer:** true.

#### 4. `V,2 ⊨ X¬p`

**Step 1 — Use the next rule.**  
Check `¬p` at time `3`.

**Step 2 — Check `V(3)`.**  
Since `3 ≥ 3`, `V(3) = {q}`.

**Step 3 — Evaluate `¬p`.**  
`p ∉ V(3)`, so `¬p` is true at time `3`.

**Answer:** true.

---

### Solution A4. Evaluating `until` with a witness

Recall:


$$

V,i\models \varphi U\psi

$$


iff there exists some `j ≥ i` such that:

1. `V,j ⊨ ψ`, and
2. for every `ℓ` with `i ≤ ℓ < j`, `V,ℓ ⊨ φ`.

#### 1. `V,0 ⊨ p U q`

**Step 1 — Find a candidate witness for `q`.**  
At time `1`, `q ∈ V(1)`, so choose `j = 1`.

**Step 2 — Check `p` before the witness.**  
The only `ℓ` with `0 ≤ ℓ < 1` is `ℓ = 0`.

At time `0`, `V(0) = {p}`, so `p` holds.

**Answer:** true.

#### 2. `V,1 ⊨ p U q`

**Step 1 — Check whether the right-hand side already holds now.**  
At time `1`, `q ∈ V(1)`.

**Step 2 — Use the vacuous witness case.**  
Choose `j = 1`. There are no `ℓ` with `1 ≤ ℓ < 1`.

**Step 3 — Conclude.**  
The requirement that `p` holds before `q` is vacuously satisfied.

**Answer:** true.

#### 3. `V,2 ⊨ p U r`

**Step 1 — Search for a future witness for `r`.**  
From time `2` onward:

- `V(2) = {p,q}`;
- for every `i ≥ 3`, `V(i) = {q}`.

So `r` never appears at or after time `2`.

**Step 2 — Apply the `until` requirement.**  
For `p U r`, the right-hand side `r` must eventually occur.

**Answer:** false.

---

### Solution A5. Evaluating `eventually` and `globally`

Recall:


$$

E\varphi := \top U\varphi,

$$


so `Eφ` means `φ` holds at some current-or-future time point.

Also:


$$

G\varphi := \neg E\neg\varphi,

$$


so `Gφ` means `φ` holds at every current-or-future time point.

#### 1. `V,0 ⊨ Ep`

**Step 1 — Search at or after time `0`.**  
`p` already holds at time `0`.

**Step 2 — Choose a witness.**  
Choose `j = 0`.

**Answer:** true.

#### 2. `V,3 ⊨ Ep`

**Step 1 — Search at or after time `3`.**  
For every `i ≥ 3`, `V(i) = {q}`.

**Step 2 — Check whether `p` ever returns.**  
It does not.

**Answer:** false.

#### 3. `V,3 ⊨ Gq`

**Step 1 — Check every time point from `3` onward.**  
For every `i ≥ 3`, `V(i) = {q}`.

**Step 2 — Check `q`.**  
`q` holds at every such time point.

**Answer:** true.

#### 4. `V,0 ⊨ Gq`

**Step 1 — Check every time point from `0` onward.**  
Start at time `0`.

**Step 2 — Inspect time `0`.**  
`V(0) = {p}`, so `q` does not hold at time `0`.

**Step 3 — Since global requires all times, one failure is enough.**

**Answer:** false.

---

### Solution A6. Vacuous `until` with `⊥`

Recall that `⊥` is never true. So `⊥ U q` can only hold if `q` is true **now**, because if the witness is later, `⊥` would need to hold at earlier points, which is impossible.

#### 1. `W,0 ⊨ ⊥ U q`

**Step 1 — Check whether `q` holds now.**  
`W(0) = {q}`, so `q` holds at time `0`.

**Step 2 — Choose the witness.**  
Choose `j = 0`.

**Step 3 — Check the before-witness interval.**  
There are no `ℓ` with `0 ≤ ℓ < 0`.

**Answer:** true.

#### 2. `W,1 ⊨ ⊥ U q`

**Step 1 — Check whether `q` holds now.**  
`W(1) = {p}`, so `q` does not hold at time `1`.

**Step 2 — Search for a later witness.**  
At time `2`, `q` holds.

**Step 3 — Check `⊥` before the witness.**  
For witness `j = 2`, we need `⊥` to hold at time `1`.

But `⊥` never holds.

**Answer:** false.

#### 3. `W,2 ⊨ ⊥ U q`

**Step 1 — Check whether `q` holds now.**  
`W(2) = {q}`.

**Step 2 — Choose the witness.**  
Choose `j = 2`.

**Step 3 — Use vacuity.**  
There are no earlier points between `2` and `2`.

**Answer:** true.

---

# Section B — Multi-condition checks

## B1. Nested `X` and `U`

Let valuation `V` be:


$$

V(0)=\{a\},\quad V(1)=\{a,b\},\quad V(2)=\{b\},\quad V(3)=\{a,c\},\quad V(i)=\{c\}\text{ for all }i\ge 4.

$$


Decide whether each statement is true or false.

1. `V,0 ⊨ X(a U c)`
2. `V,0 ⊨ a U Xc`

## B2. Counterexample: two eventualities do not combine

Construct a valuation `V` such that:


$$

V,0\models Ep,
\quad
V,0\models Eq,
\quad
\text{but}\quad
V,0\not\models E(p\land q).

$$


Then show the full verification.

## B3. Distinguishing reasoning tasks inside one valuation

Let valuation `V` be:


$$

V(0)=\{p\},\quad V(1)=\emptyset,\quad V(2)=\{p\},\quad V(i)=\{p\}\text{ for all }i\ge 3.

$$


For each formula, classify whether it is:

1. satisfied at time `0`;
2. satisfied by valuation `V`;
3. satisfiable in valuation `V`;
4. valid in valuation `V`.

Formulas:

- `p`
- `Ep`
- `Gp`

## B4. Running car example: derive the valuation from a trace

Use the lecture’s car-driving abstraction.

States and labels:

| State | Meaning | Label |
|---|---|---|
| `EC` | enter car | `{S}` |
| `FSB` | fasten seatbelt | `{S}` |
| `D` | drive | `{PA}` |
| `Stop` | stop | `{S,PA}` |
| `Park` | park | `{S,PA}` |
| `LC` | leave car | `{S,PA}` |

Trace:


$$

\sigma_1=EC,FSB,D,Stop,D,Stop,D,Stop,\dots

$$


Tasks:

1. Compute `V_σ1(0)` through `V_σ1(5)`.
2. Check whether `V_σ1,0 ⊨ S U PA`.
3. Check whether `V_σ1,0 ⊨ G(S U PA)`.

## B5. Universal model checking vs existential satisfaction

Consider transition system `M` with:

- states `s0`, `s1`, `s2`;
- start state `s0`;
- transitions `s0 → s1`, `s0 → s2`, `s1 → s1`, `s2 → s2`;
- labels `L(s0) = {p}`, `L(s1) = {q}`, `L(s2) = ∅`.

Check:

1. `M ⊨ Eq`
2. whether there exists a trace of `M` satisfying `Eq`
3. `M ⊨ Xq`
4. `M ⊨ X(q ∨ ¬q)`

## B6. Classifying property types

For each property, classify the best matching type from the lecture: local, safety, liveness, fairness-style, precedence/past-looking, or limitation/extension issue.

1. `G(¬safe → X safe)`
2. `G(request → E reply)`
3. “A bad state is never reached.”
4. “Every request is eventually answered.”
5. “Look left and right before crossing.”
6. “The alarm must trigger within five seconds.”

---

## Solutions — Section B

### Solution B1. Nested `X` and `U`

The valuation is:


$$

V(0)=\{a\},\quad V(1)=\{a,b\},\quad V(2)=\{b\},\quad V(3)=\{a,c\},\quad V(i)=\{c\}\text{ for }i\ge 4.

$$


#### 1. `V,0 ⊨ X(a U c)`

**Step 1 — Apply the outer `X`.**  
`V,0 ⊨ X(a U c)` iff `V,1 ⊨ a U c`.

**Step 2 — Search for a witness where `c` holds at or after time `1`.**  
The first such time is `j = 3`, because `V(3) = {a,c}`.

**Step 3 — Check `a` before the witness.**  
For `j = 3`, we need `a` to hold at times `1` and `2`.

- At time `1`, `a` holds.
- At time `2`, `V(2) = {b}`, so `a` does not hold.

**Step 4 — Check later witnesses.**  
For any later witness `j ≥ 4`, time `2` is still before the witness, and `a` still fails there.

**Answer:** false.

#### 2. `V,0 ⊨ a U Xc`

**Step 1 — Identify the right-hand target.**  
The right-hand side is `Xc`, not just `c`.

**Step 2 — Find a witness `j` where `Xc` holds.**  
`Xc` holds at time `j` iff `c` holds at time `j+1`.

At time `2`, `Xc` holds because `c` holds at time `3`.

So choose `j = 2`.

**Step 3 — Check `a` before the witness.**  
For `j = 2`, we need `a` at times `0` and `1`.

- `V(0) = {a}`: yes.
- `V(1) = {a,b}`: yes.

**Answer:** true.

---

### Solution B2. Counterexample: two eventualities do not combine

We need `p` eventually, `q` eventually, but never at the same time.

**Step 1 — Construct a valuation.**

Let:


$$

V(0)=\emptyset,
\quad
V(1)=\{p\},
\quad
V(2)=\{q\},
\quad
V(i)=\emptyset\text{ for all }i\ge 3.

$$


**Step 2 — Check `Ep`.**  
At time `1`, `p` holds. So from time `0`, choose witness `j = 1`.

Thus:


$$

V,0\models Ep.

$$


**Step 3 — Check `Eq`.**  
At time `2`, `q` holds. So from time `0`, choose witness `j = 2`.

Thus:


$$

V,0\models Eq.

$$


**Step 4 — Check `E(p ∧ q)`.**  
Search every time point:

- time `0`: neither `p` nor `q`;
- time `1`: `p` only;
- time `2`: `q` only;
- time `i ≥ 3`: neither.

There is no time point where both `p` and `q` hold together.

Therefore:


$$

V,0\not\models E(p\land q).

$$


**Final point:** eventualities can happen at different times. `Ep ∧ Eq` does not imply `E(p ∧ q)`.

---

### Solution B3. Distinguishing reasoning tasks inside one valuation

The valuation is:


$$

V(0)=\{p\},\quad V(1)=\emptyset,\quad V(2)=\{p\},\quad V(i)=\{p\}\text{ for }i\ge 3.

$$


#### Formula 1: `p`

**Step 1 — Satisfaction at time `0`.**  
`p ∈ V(0)`, so `V,0 ⊨ p`.

**Step 2 — Satisfaction by valuation `V`.**  
A valuation satisfies a formula iff it satisfies it at time `0`. Since `V,0 ⊨ p`, `V ⊨ p`.

**Step 3 — Satisfiable in `V`.**  
A formula is satisfiable in `V` iff it holds at some time point. It holds at time `0`, so yes.

**Step 4 — Valid in `V`.**  
A formula is valid in `V` iff it holds at every time point. At time `1`, `V(1)=∅`, so `p` is false.

**Classification for `p`:**

| Task | Result |
|---|---|
| satisfied at time `0` | yes |
| satisfied by `V` | yes |
| satisfiable in `V` | yes |
| valid in `V` | no |

#### Formula 2: `Ep`

**Step 1 — Satisfaction at time `0`.**  
`p` already holds at time `0`, so `Ep` holds at time `0`.

**Step 2 — Satisfaction by valuation `V`.**  
Since `V,0 ⊨ Ep`, valuation `V` satisfies `Ep`.

**Step 3 — Satisfiable in `V`.**  
It holds at time `0`, so it is satisfiable in `V`.

**Step 4 — Valid in `V`.**  
Check every time point:

- at time `0`, `p` already holds;
- at time `1`, `p` holds later at time `2`;
- at time `2`, `p` already holds;
- for every `i ≥ 3`, `p` already holds.

So `Ep` holds at every time point.

**Classification for `Ep`:**

| Task | Result |
|---|---|
| satisfied at time `0` | yes |
| satisfied by `V` | yes |
| satisfiable in `V` | yes |
| valid in `V` | yes |

#### Formula 3: `Gp`

**Step 1 — Satisfaction at time `0`.**  
`Gp` requires `p` at every time point from `0` onward.

**Step 2 — Check for a counterexample.**  
At time `1`, `p` is false.

So `V,0 ⊭ Gp`.

**Step 3 — Satisfaction by valuation `V`.**  
Since it fails at time `0`, `V` does not satisfy `Gp`.

**Step 4 — Satisfiable in `V`.**  
Check whether `Gp` holds somewhere. At time `2`, `p` holds forever from then onward.

So `V,2 ⊨ Gp`.

**Step 5 — Valid in `V`.**  
It fails at time `0`, so it is not valid in `V`.

**Classification for `Gp`:**

| Task | Result |
|---|---|
| satisfied at time `0` | no |
| satisfied by `V` | no |
| satisfiable in `V` | yes |
| valid in `V` | no |

---

### Solution B4. Running car example: derive the valuation from a trace

Trace:


$$

\sigma_1=EC,FSB,D,Stop,D,Stop,D,Stop,\dots

$$


Labels:

- `L(EC) = {S}`
- `L(FSB) = {S}`
- `L(D) = {PA}`
- `L(Stop) = {S,PA}`

#### 1. Compute `V_σ1(0)` through `V_σ1(5)`

**Step 1 — Use the trace-to-valuation rule.**


$$

V_\sigma(i)=L(s_i).

$$


**Step 2 — Match each trace position to its state label.**

| `i` | `σ1(i)` | `V_σ1(i)` |
|---:|---|---|
| 0 | `EC` | `{S}` |
| 1 | `FSB` | `{S}` |
| 2 | `D` | `{PA}` |
| 3 | `Stop` | `{S,PA}` |
| 4 | `D` | `{PA}` |
| 5 | `Stop` | `{S,PA}` |

#### 2. Check `V_σ1,0 ⊨ S U PA`

**Step 1 — Find a witness where `PA` holds.**  
At time `2`, `V_σ1(2) = {PA}`.

Choose `j = 2`.

**Step 2 — Check `S` before time `2`.**  
We need `S` at times `0` and `1`.

- time `0`: `{S}` contains `S`;
- time `1`: `{S}` contains `S`.

**Answer:** true.

#### 3. Check `V_σ1,0 ⊨ G(S U PA)`

**Step 1 — Understand the global requirement.**  
`G(S U PA)` means: at every time point `i ≥ 0`, `S U PA` must hold.

**Step 2 — Check the repeating pattern.**

- At `EC` and `FSB`, `S` holds until the next `D`, where `PA` holds.
- At `D`, `PA` already holds, so `S U PA` holds with witness `j = i`.
- At `Stop`, `PA` already holds, so again `S U PA` holds with witness `j = i`.

**Step 3 — Use the infinite pattern.**  
After time `2`, the trace alternates `D, Stop, D, Stop, ...`; in both states, `PA` holds now.

**Answer:** true.

---

### Solution B5. Universal model checking vs existential satisfaction

Transition system:

- `s0` starts;
- from `s0`, the system may go to either `s1` or `s2`;
- `s1` loops forever;
- `s2` loops forever;
- `q` holds only in `s1`.

#### 1. `M ⊨ Eq`

**Step 1 — Recall model checking is universal in this course.**  
`M ⊨ φ` means every trace of `M` satisfies `φ` at time `0`.

**Step 2 — List the possible infinite traces.**

Trace A:


$$

s0,s1,s1,s1,\dots

$$


Trace B:


$$

s0,s2,s2,s2,\dots

$$


**Step 3 — Check `Eq` on each trace.**

- On Trace A, `q` appears at time `1`, so `Eq` is true.
- On Trace B, `q` never appears, so `Eq` is false.

**Step 4 — Apply universal model checking.**  
One bad trace is enough to make universal model checking fail.

**Answer:** `M ⊭ Eq`.

#### 2. Does there exist a trace satisfying `Eq`?

**Step 1 — Use the existential version.**  
We only need one trace.

**Step 2 — Choose Trace A.**  
`Trace A = s0,s1,s1,s1,...` has `q` at time `1`.

**Answer:** yes, there exists a trace satisfying `Eq`.

#### 3. `M ⊨ Xq`

**Step 1 — Interpret `Xq`.**  
At the next state, `q` must hold.

**Step 2 — Check every possible first transition.**

- `s0 → s1`: next label is `{q}`, so `Xq` is true.
- `s0 → s2`: next label is `∅`, so `Xq` is false.

**Step 3 — Apply universal model checking.**  
Because the `s0 → s2` trace fails, the model does not satisfy `Xq`.

**Answer:** `M ⊭ Xq`.

#### 4. `M ⊨ X(q ∨ ¬q)`

**Step 1 — Interpret the formula.**  
`q ∨ ¬q` is true at every time point in every valuation.

**Step 2 — Move one step forward.**  
No matter whether the next state is `s1` or `s2`, `q ∨ ¬q` holds there.

**Step 3 — Apply universal model checking.**  
All traces satisfy the formula.

**Answer:** `M ⊨ X(q ∨ ¬q)`.

---

### Solution B6. Classifying property types

#### 1. `G(¬safe → X safe)`

**Step 1 — Look for next-state dependence.**  
The formula says: if unsafe now, then safe at the next time point.

**Step 2 — Classify.**  
This is a **local property**, because it relates the current state to the next state.

It also has a safety flavour, but the most specific lecture category here is local.

#### 2. `G(request → E reply)`

**Step 1 — Look for eventual fulfilment.**  
Every request must eventually be followed by a reply.

**Step 2 — Classify.**  
This is a **liveness property**. It says something good eventually happens.

#### 3. “A bad state is never reached.”

**Step 1 — Translate informally.**  
This means: globally, not bad.


$$

G\neg bad.

$$


**Step 2 — Classify.**  
This is a **safety property**: bad things do not happen.

#### 4. “Every request is eventually answered.”

**Step 1 — Translate informally.**


$$

G(request \rightarrow E answered).

$$


**Step 2 — Classify.**  
This is **fairness-style** and also **liveness-style**. The lecture treats fairness as closely related to liveness and gives request/reply as the intuition.

#### 5. “Look left and right before crossing.”

**Step 1 — Identify the temporal direction.**  
The phrase “before crossing” asks whether something happened earlier.

**Step 2 — Compare with plain LTL.**  
The lecture’s LTL is future-only. It does not directly look backwards.

**Step 3 — Classify.**  
This is a **precedence/past-looking property**. It motivates past modalities or a more careful future-only encoding with extra state.

#### 6. “The alarm must trigger within five seconds.”

**Step 1 — Identify the missing feature.**  
Plain LTL has abstract next steps, not real clocks.

**Step 2 — Classify.**  
This is a **timed limitation/extension issue**. It needs a timed temporal logic or clocks.

---

# Section C — Building things from scratch

## C1. Translate system requirements into LTL

For each informal requirement, write a suitable LTL formula.

Use the following propositional variables:

- `safe`: the system is safe;
- `req`: a request is active;
- `ack`: an acknowledgement occurs;
- `err`: an error occurs;
- `reset`: the system resets.

Requirements:

1. Whenever the system is unsafe now, it is safe at the next time point.
2. Every request is eventually acknowledged.
3. Errors never occur.
4. If an error occurs, then a reset eventually occurs.
5. Once a request appears, the request remains active until acknowledgement.

## C2. Build a transition system from a workflow

Construct a transition system for this workflow:

- states: `Idle`, `Request`, `Process`, `Reply`;
- start state: `Idle`;
- possible moves:
  - `Idle → Idle`;
  - `Idle → Request`;
  - `Request → Process`;
  - `Process → Reply`;
  - `Reply → Idle`;
- labels:
  - `Idle` has no propositions true;
  - `Request` has `{req}`;
  - `Process` has `{busy}`;
  - `Reply` has `{reply}`.

Tasks:

1. Write the formal transition system `M = (S, →, L, S0)`.
2. Give one infinite trace where a request is eventually replied to.
3. Give the associated valuation for the first five time points of that trace.

## C3. Encode a transition system as `φ_M`

Let transition system `M` have:

- states `{s0, s1}`;
- start state `s0`;
- transitions `s0 → s1` and `s1 → s1`;
- labels `L(s0) = {p}` and `L(s1) = {q}`;
- propositional variables `{p,q}`.

Construct the four conceptual parts of `φ_M`:

1. initial state;
2. exactly one state at each time;
3. successor relation respected;
4. state labelling respected.

Use fresh state variables `ps0` and `ps1`.

## C4. Build the universal transition system for validity

Let:


$$

\psi = G(p \lor q).

$$


Construct the universal transition system `M_ψ` used in the lecture’s reduction from validity to model checking.

Give:

1. the state set;
2. the transition relation;
3. the labelling function;
4. the start states;
5. whether `ψ` is valid, using this transition system idea.

## C5. Identify alpha, beta, eventuality, literal, and non-local formulae

For each formula, classify it and give its components if applicable.

1. `¬¬p`
2. `p ∧ q`
3. `¬(p ∨ q)`
4. `p U q`
5. `¬(p U q)`
6. `Xp`
7. `p`
8. `¬p`

## C6. Compute local type expansions

Use the alpha/beta expansion method from the sheet.

Start with:


$$

M=\{pUq,\ \neg q\}.

$$


Compute the possible local expansions, and drop branches with clashes.

## C7. Build a small pre-tableau for `p U q`

Construct the important part of the pre-tableau for:


$$

\psi = pUq.

$$


Show:

1. the initial nodes;
2. the `∨`-rule expansion of `{pUq}`;
3. the `X`-successors of the type nodes;
4. why the surviving structure represents satisfiability.

## C8. Diagnose unsatisfiability with a bad future

Consider:


$$

\psi = pU(q\land \neg q).

$$


Explain why a naive tableau may keep postponing the eventuality, and why the bad-future rule removes the bad cycle.

---

## Solutions — Section C

### Solution C1. Translate system requirements into LTL

#### 1. Whenever the system is unsafe now, it is safe at the next time point.

**Step 1 — Identify the trigger.**  
The trigger is `¬safe`.

**Step 2 — Identify the next-state requirement.**  
The next state must satisfy `safe`, so use `X safe`.

**Step 3 — Make it hold at all times.**


$$

\boxed{G(\neg safe \rightarrow X safe)}

$$


#### 2. Every request is eventually acknowledged.

**Step 1 — Identify the trigger.**  
The trigger is `req`.

**Step 2 — Identify the eventual target.**  
The target is `ack`, so use `E ack`.

**Step 3 — Make it hold at all times.**


$$

\boxed{G(req \rightarrow E ack)}

$$


#### 3. Errors never occur.

**Step 1 — Identify the bad proposition.**  
The bad proposition is `err`.

**Step 2 — Say it is globally false.**


$$

\boxed{G\neg err}

$$


#### 4. If an error occurs, then a reset eventually occurs.

**Step 1 — Trigger.**  
`err`.

**Step 2 — Eventual target.**  
`reset`.

**Step 3 — Globalise the rule.**


$$

\boxed{G(err \rightarrow E reset)}

$$


#### 5. Once a request appears, the request remains active until acknowledgement.

**Step 1 — Trigger.**  
The rule applies whenever `req` is true.

**Step 2 — Use `until` for “req remains active until ack”.**


$$

req U ack.

$$


**Step 3 — Globalise the triggered rule.**


$$

\boxed{G(req \rightarrow (req U ack))}

$$


**Important subtlety:** this formula requires `ack` to eventually occur once `req` is active. Also, if `ack` holds immediately, the `until` is satisfied with witness `j = i`.

---

### Solution C2. Build a transition system from a workflow

#### 1. Formal transition system

**Step 1 — Define the state set.**


$$

S=\{Idle,Request,Process,Reply\}.

$$


**Step 2 — Define the successor relation.**


$$

\to=\{(Idle,Idle),(Idle,Request),(Request,Process),(Process,Reply),(Reply,Idle)\}.

$$


**Step 3 — Define the labelling function.**


$$

L(Idle)=\emptyset,
\quad
L(Request)=\{req\},
\quad
L(Process)=\{busy\},
\quad
L(Reply)=\{reply\}.

$$


**Step 4 — Define the start states.**


$$

S_0=\{Idle\}.

$$


So:


$$

\boxed{M=(S,\to,L,S_0)}.

$$


#### 2. One infinite trace where a request is eventually replied to

**Step 1 — Start at the start state.**  
The trace must begin with `Idle`.

**Step 2 — Follow valid transitions.**

One valid trace is:


$$

Idle,Request,Process,Reply,Idle,Idle,Idle,\dots

$$


The request at time `1` is replied to at time `3`.

#### 3. Associated valuation for the first five time points

**Step 1 — Use `V_σ(i)=L(s_i)`.**

| `i` | state | valuation |
|---:|---|---|
| 0 | `Idle` | `∅` |
| 1 | `Request` | `{req}` |
| 2 | `Process` | `{busy}` |
| 3 | `Reply` | `{reply}` |
| 4 | `Idle` | `∅` |

---

### Solution C3. Encode a transition system as `φ_M`

We use fresh state variables `ps0` and `ps1` to record which transition-system state is active.

#### Part 1 — Initial state

**Step 1 — Identify the start state.**  
The start state is `s0`.

**Formula:**


$$

\boxed{ps0}

$$


#### Part 2 — Exactly one state at each time

**Step 1 — Say either `s0` or `s1` is active.**

**Step 2 — Prevent both from being active together.**

Formula:


$$

\boxed{G\bigl((ps0\land \neg ps1)\lor(ps1\land \neg ps0)\bigr)}

$$


#### Part 3 — Successor relation respected

**Step 1 — From `s0`, the only successor is `s1`.**


$$

ps0\rightarrow Xps1.

$$


**Step 2 — From `s1`, the only successor is `s1`.**


$$

ps1\rightarrow Xps1.

$$


**Step 3 — Globalise.**


$$

\boxed{G\bigl((ps0\rightarrow Xps1)\land(ps1\rightarrow Xps1)\bigr)}

$$


#### Part 4 — State labelling respected

The system propositions are `p` and `q`.

**Step 1 — Label for `s0`.**  
`L(s0) = {p}`, so if the active state is `s0`, then `p` is true and `q` is false:


$$

ps0\rightarrow(p\land\neg q).

$$


**Step 2 — Label for `s1`.**  
`L(s1) = {q}`, so:


$$

ps1\rightarrow(q\land\neg p).

$$


**Step 3 — Globalise.**


$$

\boxed{G\bigl((ps0\rightarrow(p\land\neg q))\land(ps1\rightarrow(q\land\neg p))\bigr)}

$$


#### Final `φ_M`

**Step 1 — Conjoin the four parts.**


$$

\boxed{
\varphi_M
=
ps0
\land
G\bigl((ps0\land \neg ps1)\lor(ps1\land \neg ps0)\bigr)
\land
G\bigl((ps0\rightarrow Xps1)\land(ps1\rightarrow Xps1)\bigr)
\land
G\bigl((ps0\rightarrow(p\land\neg q))\land(ps1\rightarrow(q\land\neg p))\bigr)
}

$$


**Step 2 — Use the reduction.**  
For any property `ψ`:


$$

M\models\psi
\quad\text{iff}\quad
\varphi_M\rightarrow\psi\text{ is valid.}

$$


---

### Solution C4. Build the universal transition system for validity

Formula:


$$

\psi = G(p\lor q).

$$


Its propositional variables are:


$$

\mathcal P_\psi=\{p,q\}.

$$


#### 1. State set

**Step 1 — Use all subsets of the formula variables.**


$$

S=2^{\{p,q\}}=\{\emptyset,\{p\},\{q\},\{p,q\}\}.

$$


Each state is itself a possible propositional valuation.

#### 2. Transition relation

**Step 1 — In the universal transition system, every state can go to every state.**


$$

\to = S\times S.

$$


#### 3. Labelling function

**Step 1 — Label each state by itself.**


$$

L(s)=s.

$$


So:

- `L(∅)=∅`;
- `L({p})={p}`;
- `L({q})={q}`;
- `L({p,q})={p,q}`.

#### 4. Start states

**Step 1 — Every state is a possible start state.**


$$

S_0=S.

$$


#### 5. Is `ψ` valid?

**Step 1 — Use the reduction idea.**


$$

\psi\text{ is valid iff }M_\psi\models\psi.

$$


**Step 2 — Look for a counter-trace.**  
Because `∅` is a start state and every state can loop to itself, there is a trace:


$$

\emptyset,\emptyset,\emptyset,\dots

$$


On this trace, neither `p` nor `q` holds at any time.

**Step 3 — Evaluate `G(p ∨ q)`.**  
At time `0`, `p ∨ q` is false, so `G(p ∨ q)` is false.

**Answer:** `ψ` is not valid.

---

### Solution C5. Identify alpha, beta, eventuality, literal, and non-local formulae

#### 1. `¬¬p`

**Step 1 — Match the alpha table.**  
Double negation behaves conjunctively: satisfying `¬¬p` forces `p`.

**Classification:** alpha formula.  
**Component:** `p`.

#### 2. `p ∧ q`

**Step 1 — Match conjunction.**  
To satisfy `p ∧ q`, both `p` and `q` must hold.

**Classification:** alpha formula.  
**Components:** `p`, `q`.

#### 3. `¬(p ∨ q)`

**Step 1 — Apply De Morgan behaviour.**  
To satisfy `¬(p ∨ q)`, both `¬p` and `¬q` must hold.

**Classification:** alpha formula.  
**Components:** `¬p`, `¬q`.

#### 4. `p U q`

**Step 1 — Use the unfolding of until.**


$$

pUq \Rightarrow q\lor(p\land X(pUq)).

$$


**Classification:** beta formula and eventuality.  
**Components:** `q`, and `p ∧ X(pUq)`.

#### 5. `¬(p U q)`

**Step 1 — Use the alpha rule for negated until.**  
If `p U q` is false, then `q` is not true now, and either `p` fails now or the until fails next.

**Classification:** alpha formula.  
**Components:** `¬q`, and `¬p ∨ ¬X(pUq)`.

#### 6. `Xp`

**Step 1 — Check whether it decomposes locally.**  
`Xp` says something about the next time point, not the current one.

**Classification:** neither alpha nor beta; non-local next formula.  
**Local components:** none.

#### 7. `p`

**Step 1 — Check literal definition.**  
A propositional variable is a literal.

**Classification:** literal.

#### 8. `¬p`

**Step 1 — Check literal definition.**  
Negated propositional variables are literals.

**Classification:** literal.

---

### Solution C6. Compute local type expansions

Start with:


$$

M=\{pUq,\neg q\}.

$$


**Step 1 — Identify formula types.**

- `pUq` is a beta formula.
- Its beta components are:


$$

q
\quad\text{or}\quad
p\land X(pUq).

$$


- `¬q` is a literal.

**Step 2 — Apply the beta rule to `pUq`.**

Branch 1:


$$

\{pUq,\neg q,q\}.

$$


Branch 2:


$$

\{pUq,\neg q,p\land X(pUq)\}.

$$


**Step 3 — Drop branches with clashes.**

Branch 1 contains both `q` and `¬q`, so it has a clash. Drop it.

**Step 4 — Apply alpha expansion to Branch 2.**

`p ∧ X(pUq)` is alpha-like conjunction, so add both components:


$$

p,
\quad
X(pUq).

$$


Branch 2 becomes:


$$

\boxed{\{pUq,\neg q,p\land X(pUq),p,X(pUq)\}}.

$$


**Step 5 — Interpret the result.**  
Locally, if `pUq` holds but `q` does not hold now, then `p` must hold now and the same until obligation must continue at the next time point.

---

### Solution C7. Build a small pre-tableau for `p U q`

Formula:


$$

\psi=pUq.

$$


#### 1. Initial nodes

**Step 1 — Create the two initial labels.**

- `e_ψ` with label `{pUq}`;
- `e_⊤` with label `{⊤}`.

#### 2. `∨`-rule expansion of `{pUq}`

**Step 1 — Recognise `pUq` as beta/eventuality.**

Its local alternatives are:

1. `q` holds now;
2. `p` holds now and `pUq` remains required next.

**Step 2 — Create type alternatives.**

Type alternative 1:


$$

t_1=\{pUq,q\}.

$$


Type alternative 2:


$$

t_2=\{pUq,p\land X(pUq),p,X(pUq)\}.

$$


**Step 3 — Add `∨`-edges.**


$$

e_\psi \to_\lor t_1,
\quad
 e_\psi \to_\lor t_2.

$$


#### 3. `X`-successors of the type nodes

**Step 1 — For `t1`, collect next obligations.**  
`t1` has no formula of the form `Xφ`.

So its `X`-successor is `e_⊤`.


$$

t_1\to_X e_\top.

$$


**Step 2 — For `t2`, collect next obligations.**  
`t2` contains `X(pUq)`, so the next required label is:


$$

\{pUq\}.

$$


That is the label of `e_ψ`, so:


$$

t_2\to_X e_\psi.

$$


**Step 3 — For `e_⊤`.**  
`{⊤}` has no next obligations, so:


$$

e_\top\to_X e_\top.

$$


#### 4. Why the surviving structure represents satisfiability

**Step 1 — Remove non-type intermediates during elimination.**  
`e_ψ` is not itself a type; it is an intermediate label that expands into `t1` or `t2`.

Incoming `X`-edges to `e_ψ` are redirected to its type alternatives.

So from `t2`, the next step may go to a type where either:

- `q` finally holds; or
- the obligation is postponed again.

**Step 2 — Check eventuality fulfilment.**  
The eventuality is `pUq`, whose right-hand side is `q`.

A satisfying path can choose:


$$

t_2,t_2,\dots,t_2,t_1,e_\top,e_\top,\dots

$$


where `q` eventually appears at `t1`.

**Step 3 — Conclude.**  
Because there is a lasso/path where the eventuality is fulfilled, `pUq` is satisfiable.

---

### Solution C8. Diagnose unsatisfiability with a bad future

Formula:


$$

\psi=pU(q\land \neg q).

$$


#### Step 1 — Identify the eventuality

The formula is an eventuality:


$$

pU(q\land\neg q).

$$


The right-hand side is:


$$

q\land\neg q.

$$


#### Step 2 — Notice that the target is impossible

`q ∧ ¬q` contains a direct clash. It cannot be true at any time point in any valuation.

#### Step 3 — Apply the beta unfolding of until

The formula can locally branch into:

1. `q ∧ ¬q` holds now; or
2. `p ∧ X(pU(q∧¬q))` holds now.

#### Step 4 — Drop the impossible immediate branch

The branch where `q ∧ ¬q` holds now expands to both `q` and `¬q`, so it clashes and is removed.

#### Step 5 — See the tempting bad cycle

The tableau may keep the second branch:


$$

p,
\quad
X(pU(q\land\neg q)).

$$


This says: `p` holds now, and the impossible eventuality is postponed to the next time point.

If repeated, this creates a cycle where the tableau keeps saying:

> not yet, try next time.

#### Step 6 — Apply the bad-future rule

The bad-future rule asks whether there is a lasso from the node such that every eventuality in the node is eventually fulfilled.

Here, the eventuality requires a future node containing:


$$

q\land\neg q.

$$


No surviving node can contain that, because it clashes.

#### Step 7 — Conclude

The only possible behaviour postpones the eventuality forever. That is not allowed by the semantics of `U`.

So the bad-future rule removes the cycle, and:


$$

\boxed{pU(q\land\neg q)\text{ is unsatisfiable.}}

$$


---

# Section D — Hard edge cases and failure modes

## D1. `Until` does not mean “then stops”

Construct a valuation where `p U q` is true at time `0`, but `p` remains true at the time where `q` first appears and also afterwards.

Show why this does not violate the semantics of `U`.

## D2. `EGq` versus `GEq`

Let valuation `V` be:


$$

V(0)=\emptyset,\quad V(1)=\{q\},\quad V(2)=\emptyset,\quad V(3)=\{q\},\quad V(4)=\emptyset,\quad V(i)=\emptyset\text{ for all }i\ge 5.

$$


Check:

1. `V,0 ⊨ GEq`
2. `V,0 ⊨ EGq`

## D3. State labels can collapse different states

Using the car labels from the lecture, `Stop`, `Park`, and `LC` all have label `{S,PA}`.

Explain why an LTL formula over propositions `{S,PA}` cannot distinguish whether the current state is `Stop`, `Park`, or `LC` if it only sees the associated valuation.

## D4. Satisfiable formula, but not model-checked by a system

Give a small transition system `M` and formula `φ` such that:

1. `φ` is satisfiable as an LTL formula;
2. some trace of `M` satisfies `φ`;
3. but `M ⊭ φ` under universal model checking.

## D5. Valid in one valuation vs valid in LTL

Construct a valuation `V` such that `Gp` is valid in `V`, but `Gp` is not valid as an LTL formula.

Show both parts.

## D6. Choosing the right LTL extension

For each requirement, say why plain LTL is insufficient and name the extension suggested by the lecture.

1. “In some possible future, the robot succeeds; in all possible futures, it remains safe.”
2. “Tomorrow I will know someone who is not late.”
3. “If it rained yesterday, take an umbrella tomorrow.”
4. “The controller must respond within ten seconds.”
5. “The backup succeeds with probability at least 80%.”

---

## Solutions — Section D

### Solution D1. `Until` does not mean “then stops”

**Step 1 — Construct a valuation.**

Let:


$$

V(0)=\{p\},\quad V(1)=\{p\},\quad V(2)=\{p,q\},\quad V(i)=\{p,q\}\text{ for all }i\ge 3.

$$


**Step 2 — Check `p U q` at time `0`.**  
We need a witness `j ≥ 0` where `q` holds.

Choose `j = 2`, since `q ∈ V(2)`.

**Step 3 — Check `p` before the witness.**  
Before time `2`, we check times `0` and `1`.

- `V(0) = {p}`: `p` holds.
- `V(1) = {p}`: `p` holds.

**Step 4 — Notice what the semantics does not require.**  
The definition does **not** say that `p` must stop at `j`.

At time `2`, both `p` and `q` hold. After time `2`, `p` continues to hold. That is allowed.

**Answer:** `V,0 ⊨ p U q`, and `p` may continue after `q` appears.

---

### Solution D2. `GEq` versus `EGq`

Valuation:


$$

V(0)=\emptyset,\quad V(1)=\{q\},\quad V(2)=\emptyset,\quad V(3)=\{q\},\quad V(4)=\emptyset,\quad V(i)=\emptyset\text{ for }i\ge 5.

$$


#### 1. `V,0 ⊨ GEq`

**Step 1 — Interpret `GEq`.**  
At every time point from `0` onward, there must be some current-or-future point where `q` holds.

**Step 2 — Check early times.**

- At time `0`, `q` occurs later at time `1`.
- At time `1`, `q` holds now.
- At time `2`, `q` occurs later at time `3`.
- At time `3`, `q` holds now.

**Step 3 — Check time `4`.**  
At time `4`, `q` does not hold. For all `i ≥ 5`, `V(i)=∅`, so `q` never appears again.

**Answer:** false.

#### 2. `V,0 ⊨ EGq`

**Step 1 — Interpret `EGq`.**  
There must be some future time `j ≥ 0` such that from `j` onward, `q` always holds.

**Step 2 — Check possible witnesses.**

- `j = 1` fails because `q` is false at time `2`.
- `j = 3` fails because `q` is false at time `4`.
- no later `j` works, because after time `4`, `q` never holds.

**Answer:** false.

**Key distinction:** `GEq` means `q` keeps recurring often enough that it is always still possible in the future. `EGq` means eventually `q` becomes permanently true.

---

### Solution D3. State labels can collapse different states

**Step 1 — Recall how a trace becomes a valuation.**

For a trace:


$$

\sigma=s_0,s_1,s_2,\dots

$$


its valuation is:


$$

V_\sigma(i)=L(s_i).

$$


**Step 2 — Compare the labels.**

In the car example:


$$

L(Stop)=\{S,PA\},
\quad
L(Park)=\{S,PA\},
\quad
L(LC)=\{S,PA\}.

$$


**Step 3 — Notice what LTL can see.**  
An LTL formula over `{S,PA}` sees only which propositions are true. It does not see the state name.

**Step 4 — Conclude.**  
If two trace positions have the same label `{S,PA}` and their future labelled behaviour is also indistinguishable, then LTL over `{S,PA}` cannot tell whether the original transition-system state was `Stop`, `Park`, or `LC`.

The valuation forgets why the propositions are true.

---

### Solution D4. Satisfiable formula, but not model-checked by a system

**Step 1 — Choose a simple formula.**

Let:


$$

\varphi=Eq.

$$


This is satisfiable: any valuation with `q` at some future time satisfies it.

**Step 2 — Construct a transition system with one good trace and one bad trace.**

Use:

- states `s0`, `s1`, `s2`;
- start `s0`;
- transitions `s0 → s1`, `s0 → s2`, `s1 → s1`, `s2 → s2`;
- labels `L(s0)=∅`, `L(s1)={q}`, `L(s2)=∅`.

**Step 3 — Show a satisfying trace exists.**

Trace:


$$

s0,s1,s1,s1,\dots

$$


At time `1`, `q` holds, so this trace satisfies `Eq`.

**Step 4 — Show universal model checking fails.**

Trace:


$$

s0,s2,s2,s2,\dots

$$


On this trace, `q` never holds. So `Eq` is false.

**Step 5 — Conclude.**

`Eq` is satisfiable, and some trace of `M` satisfies it, but:


$$

\boxed{M\not\models Eq}

$$


because model checking requires all traces to satisfy the formula.

---

### Solution D5. Valid in one valuation vs valid in LTL

#### Part 1 — Make `Gp` valid in one valuation

**Step 1 — Construct a valuation where `p` always holds.**

Let:


$$

V(i)=\{p\}\text{ for every }i\in\mathbb N.

$$


**Step 2 — Check `Gp` at every time point.**  
For any time `i`, every future time `j ≥ i` also has `p` true.

So:


$$

V,i\models Gp\quad\text{for every }i.

$$


Therefore `Gp` is valid in `V`.

#### Part 2 — Show `Gp` is not valid as an LTL formula

**Step 1 — Recall LTL validity.**  
A formula is valid iff every valuation satisfies it at time `0`.

**Step 2 — Construct a countervaluation.**

Let:


$$

W(0)=\emptyset,
\quad
W(i)=\{p\}\text{ for every }i\ge 1.

$$


**Step 3 — Check `Gp` at time `0`.**  
`Gp` requires `p` to hold at time `0`, but `p ∉ W(0)`.

So:


$$

W,0\not\models Gp.

$$


**Step 4 — Conclude.**

`Gp` can be valid in a particular valuation, but it is not valid in all valuations.

---

### Solution D6. Choosing the right LTL extension

#### 1. “In some possible future, the robot succeeds; in all possible futures, it remains safe.”

**Step 1 — Identify the missing feature.**  
Plain LTL has one linear future. It cannot quantify over branching possible futures.

**Step 2 — Choose the extension.**  
Use a branching-time logic such as **CTL** or **CTL\***.

#### 2. “Tomorrow I will know someone who is not late.”

**Step 1 — Identify the missing feature.**  
Plain LTL worlds are propositional. It has no individuals or binary relations such as `knows(x,y)`.

**Step 2 — Choose the extension.**  
Use temporal logic combined with **first-order logic** or **description logic**.

#### 3. “If it rained yesterday, take an umbrella tomorrow.”

**Step 1 — Identify the missing feature.**  
Plain LTL in the lecture is future-only. It cannot directly talk about yesterday.

**Step 2 — Choose the extension.**  
Use LTL with **past modalities**, such as yesterday/since/globally-in-the-past.

#### 4. “The controller must respond within ten seconds.”

**Step 1 — Identify the missing feature.**  
Plain LTL has abstract discrete steps but no real clocks or time measurements.

**Step 2 — Choose the extension.**  
Use a **timed temporal logic** with clocks and time comparisons.

#### 5. “The backup succeeds with probability at least 80%.”

**Step 1 — Identify the missing feature.**  
Plain LTL is Boolean: propositions are true or false; transitions are possible or impossible. It has no probabilities.

**Step 2 — Choose the extension.**  
Use a **probabilistic temporal logic**, often over probabilistic transition systems or Markov processes, with operators such as:


$$

P_{\ge 80\%}\varphi.

$$


---

# Final revision checklist

Before the exam, make sure you can do these without looking:

1. For `φ U ψ`, explicitly name the witness `j` and check every `ℓ` before it.
2. For `Xφ`, move exactly one time point forward before evaluating `φ`.
3. For `Eφ`, find one current-or-future witness.
4. For `Gφ`, check every current-or-future time point or find one counterexample.
5. For transition systems, remember: traces are infinite and model checking is universal.
6. For trace valuations, remember: `V_σ(i)=L(s_i)`; state names disappear.
7. For tableau, remember: alpha adds, beta branches, `X` moves to the next node, and bad-future removes postponed eventualities that never get fulfilled.
