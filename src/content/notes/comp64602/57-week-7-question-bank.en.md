---
subject: COMP64602
chapter: 57
title: "Week 7 — Question Bank"
language: en
---

# COMP64602 Week 7 — Argumentation Worked Question Bank

**Source read from disk:** `COMP64602 Chapter 7 - Week 7 (3).mht`  
**Topic identified from sheet:** argumentation: structured arguments, abstract argumentation frameworks, extension semantics, dispute trees, winning strategies, and dialogue moves.

## What the sheet actually covers as examinable task types

The sheet’s computational/procedural tasks are:

1. **Structured-argument construction**
   - build base arguments from a knowledge base;
   - apply strict rules `\to` and defeasible rules `\Rightarrow`;
   - compute `Prem(A)`, `Concl(A)`, and `Sub(A)`;
   - identify whether an argument is strict/defeasible from its **top rule**.

2. **Support and attack in structured arguments**
   - track which arguments support which larger arguments through subargument inclusion;
   - classify attacks as **undercutting**, **rebutting**, or **undermining**;
   - distinguish **attack** from **defeat** using preferences.

3. **Abstract argumentation frameworks**
   - compute `S^+`, `\alpha^-`, conflict-freeness, defence, and the characteristic function `\mathcal F(S)`;
   - check whether a set is **admissible** or **complete**.

4. **Extension semantics**
   - find grounded extensions by iterating `\mathcal F` from `\varnothing`;
   - find preferred, stable, and semi-stable extensions;
   - classify arguments as skeptically accepted, credulously accepted, or rejected.

5. **Arguments as games**
   - unfold an attack graph into a dispute tree;
   - check whether a subtree is a winning strategy for PRO;
   - use the three dialogue moves: `claim \phi`, `why \phi`, and `\phi since \psi`.

The sheet explicitly marks basic graph theory and Nash/dominant strategies as background or not examinable, so this bank does **not** drill them as core exam questions.

---

# Section A — Mechanical / single-step foundations

## Q1. Running example: construct the structured arguments `A_1` to `A_8`

Use the sheet’s running example:

```text
K = {p, q, u, r}
K_n = {p}
R_s = {p,q -> s ; u,v -> w}
R_d = {p => t ; s,r,t => v}
```

Construct arguments `A_1` to `A_8`. For each derived argument, give:

- the rule used;
- the argument form;
- `Prem(A)`;
- `Concl(A)`;
- `Sub(A)`;
- whether its top rule is strict or defeasible.

### Solution

**Step 1 — Build base arguments from the knowledge base.**

Each formula in `K` gives a base argument:

```text
A_1 : p
A_2 : q
A_3 : r
A_4 : u
```

For base arguments:

```text
Prem(A_i) = {its formula}
Concl(A_i) = its formula
Sub(A_i) = {A_i}
```

So:

```text
Prem(A_1) = {p},  Concl(A_1) = p,  Sub(A_1) = {A_1}
Prem(A_2) = {q},  Concl(A_2) = q,  Sub(A_2) = {A_2}
Prem(A_3) = {r},  Concl(A_3) = r,  Sub(A_3) = {A_3}
Prem(A_4) = {u},  Concl(A_4) = u,  Sub(A_4) = {A_4}
```

Note: the sheet’s base-argument subargument notation is slightly garbled in the export; for worked calculations, tracking subarguments by argument labels is the useful method.

---

**Step 2 — Derive `A_5` using the defeasible rule `p => t`.**

We already have:

```text
Concl(A_1) = p
```

The rule is:

```text
p => t
```

So construct:

```text
A_5 : A_1 => t
```

Then:

```text
Prem(A_5) = Prem(A_1) = {p}
Concl(A_5) = t
Sub(A_5) = Sub(A_1) union {A_5} = {A_1, A_5}
```

Top rule type:

```text
A_5 is defeasible because its top rule is p => t.
```

---

**Step 3 — Derive `A_6` using the strict rule `p,q -> s`.**

We already have:

```text
Concl(A_1) = p
Concl(A_2) = q
```

The rule is:

```text
p,q -> s
```

So construct:

```text
A_6 : A_1, A_2 -> s
```

Then:

```text
Prem(A_6) = Prem(A_1) union Prem(A_2) = {p, q}
Concl(A_6) = s
Sub(A_6) = {A_1, A_2, A_6}
```

Top rule type:

```text
A_6 is strict because its top rule is p,q -> s.
```

---

**Step 4 — Derive `A_7` using the defeasible rule `s,r,t => v`.**

We already have:

```text
Concl(A_6) = s
Concl(A_3) = r
Concl(A_5) = t
```

The rule is:

```text
s,r,t => v
```

So construct:

```text
A_7 : A_3, A_5, A_6 => v
```

Then:

```text
Prem(A_7) = Prem(A_3) union Prem(A_5) union Prem(A_6)
          = {r} union {p} union {p, q}
          = {p, q, r}

Concl(A_7) = v

Sub(A_7) = Sub(A_3) union Sub(A_5) union Sub(A_6) union {A_7}
         = {A_3} union {A_1, A_5} union {A_1, A_2, A_6} union {A_7}
         = {A_1, A_2, A_3, A_5, A_6, A_7}
```

Top rule type:

```text
A_7 is defeasible because its top rule is s,r,t => v.
```

---

**Step 5 — Derive `A_8` using the strict rule `u,v -> w`.**

We already have:

```text
Concl(A_4) = u
Concl(A_7) = v
```

The rule is:

```text
u,v -> w
```

So construct:

```text
A_8 : A_4, A_7 -> w
```

Then:

```text
Prem(A_8) = Prem(A_4) union Prem(A_7)
          = {u} union {p, q, r}
          = {p, q, r, u}

Concl(A_8) = w

Sub(A_8) = Sub(A_4) union Sub(A_7) union {A_8}
         = {A_4} union {A_1, A_2, A_3, A_5, A_6, A_7} union {A_8}
         = {A_1, A_2, A_3, A_4, A_5, A_6, A_7, A_8}
```

Top rule type:

```text
A_8 is strict because its top rule is u,v -> w.
```

---

**Final answer.**

```text
A_1 : p
A_2 : q
A_3 : r
A_4 : u
A_5 : A_1 => t
A_6 : A_1, A_2 -> s
A_7 : A_3, A_5, A_6 => v
A_8 : A_4, A_7 -> w
```

---

## Q2. Running example: compute the support structure

Using the constructed arguments from Q1, list which later arguments are supported by each of `A_1` to `A_7`.

### Solution

**Step 1 — Use the support test.**

An argument supports another argument if it is a subargument of that larger argument.

So for each argument `X`, look for every argument whose `Sub(...)` contains `X`.

---

**Step 2 — Track each dependency.**

From Q1:

```text
A_5 uses A_1.
A_6 uses A_1 and A_2.
A_7 uses A_3, A_5, and A_6.
A_8 uses A_4 and A_7.
```

Because support propagates through subarguments, if `A_1` supports `A_5`, and `A_5` supports `A_7`, then `A_1` also supports `A_7`.

---

**Step 3 — List the support closure.**

```text
A_1 supports A_5, A_6, A_7, A_8.
A_2 supports A_6, A_7, A_8.
A_3 supports A_7, A_8.
A_4 supports A_8.
A_5 supports A_7, A_8.
A_6 supports A_7, A_8.
A_7 supports A_8.
```

---

## Q3. Running example: classify undercutting, rebutting, and undermining attacks

Use the structured arguments from Q1.

Classify the following extra arguments:

```text
B_1 : A_1 -> ¬(p => t)
B_2 : A_1 -> ¬t
B_3 : A_1 -> ¬q
```

For each, say what kind of attack it makes and which constructed arguments it attacks.

### Solution

**Step 1 — Recall the discriminator questions.**

Use these questions in order:

```text
Undercutting: does the attack target the use of a defeasible rule itself?
Rebutting: does the attack contradict the conclusion of a defeasible subargument?
Undermining: does the attack contradict a contestable premise?
```

---

**Step 2 — Classify `B_1 : A_1 -> ¬(p => t)`.**

`B_1` attacks the rule:

```text
p => t
```

This is the defeasible rule used to build:

```text
A_5 : A_1 => t
```

So the direct target is `A_5`.

Because `A_5` is a subargument of `A_7`, and `A_7` is a subargument of `A_8`, the attack also reaches:

```text
A_7 and A_8.
```

Classification:

```text
B_1 undercuts A_5, A_7, and A_8.
```

Note: the sheet flags that the slide/example wording may call this “rebutting,” but by the formal discriminator it attacks the defeasible rule itself, so it is best treated as undercutting.

---

**Step 3 — Classify `B_2 : A_1 -> ¬t`.**

`A_5` concludes:

```text
t
```

`B_2` concludes:

```text
¬t
```

So `B_2` contradicts the conclusion of the defeasible subargument `A_5`.

Classification:

```text
B_2 rebuts A_5.
```

Because `A_5` is inside `A_7`, and `A_7` is inside `A_8`, the attack also reaches:

```text
A_7 and A_8.
```

So:

```text
B_2 rebuts A_5, A_7, and A_8.
```

---

**Step 4 — Classify `B_3 : A_1 -> ¬q`.**

`q` is in the knowledge base but is not necessary:

```text
K_n = {p}
q notin K_n
```

So `q` is contestable.

`A_6` uses the premise argument:

```text
A_2 : q
```

`B_3` concludes:

```text
¬q
```

So `B_3` attacks a contestable premise.

Classification:

```text
B_3 undermines A_6.
```

Because `A_6` is inside `A_7`, and `A_7` is inside `A_8`, the attack also reaches:

```text
A_7 and A_8.
```

So, following the sheet’s listed targets:

```text
B_3 undermines A_6, A_7, and A_8.
```

Small formal note: if a formalism treats the base argument `A_2 : q` itself as directly attackable by undermining, then `A_2` is also the immediate premise target. The sheet’s worked list focuses on `A_6, A_7, A_8`.

---

## Q4. Attack versus defeat

Suppose argument `X` rebuts argument `Y`.

Case 1: `X` is preferred to `Y`.  
Case 2: `Y` is preferred to `X`.

In each case, does `X` defeat `Y`?

### Solution

**Step 1 — Separate attack from defeat.**

The sheet’s rule is:

```text
X defeats Y iff:
1. X attacks Y, and
2. X is preferred strongly enough according to the relevant preferences.
```

So an attack is not automatically a defeat.

---

**Step 2 — Case 1: `X` is preferred to `Y`.**

We are given:

```text
X attacks Y by rebutting.
X is preferred to Y.
```

Both conditions are satisfied.

Therefore:

```text
X defeats Y.
```

---

**Step 3 — Case 2: `Y` is preferred to `X`.**

We are given:

```text
X attacks Y by rebutting.
But Y is preferred to X.
```

The attack condition is satisfied, but the preference condition is not.

Therefore:

```text
X attacks Y, but X does not defeat Y.
```

---

# Section B — Multi-condition checks on sets

## Q5. Compute `S^+`, attackers, and conflict-freeness in the sheet’s abstract graph

Use the abstract argumentation framework:

```text
A = {A_1, A_2, A_3, A_4, A_5}
R = {A_3 -> A_2, A_2 -> A_1, A_5 -> A_4, A_4 -> A_1}
S = {A_1, A_3, A_5}
```

Compute:

```text
S^+
A_1^-
A_3^-
A_5^-
```

Then say whether `S` is conflict-free.

### Solution

**Step 1 — Compute `S^+`.**

`S^+` is the set of arguments attacked by members of `S`.

Members of `S`:

```text
A_1, A_3, A_5
```

Check their outgoing attacks:

```text
A_1 attacks nothing.
A_3 attacks A_2.
A_5 attacks A_4.
```

Therefore:

```text
S^+ = {A_2, A_4}
```

---

**Step 2 — Compute `A_1^-`.**

`A_1^-` is the set of attackers of `A_1`.

Incoming attacks to `A_1`:

```text
A_2 -> A_1
A_4 -> A_1
```

Therefore:

```text
A_1^- = {A_2, A_4}
```

---

**Step 3 — Compute `A_3^-`.**

Nothing attacks `A_3`.

Therefore:

```text
A_3^- = ∅
```

---

**Step 4 — Compute `A_5^-`.**

Nothing attacks `A_5`.

Therefore:

```text
A_5^- = ∅
```

---

**Step 5 — Check conflict-freeness.**

A set is conflict-free iff:

```text
S ∩ S^+ = ∅
```

Here:

```text
S = {A_1, A_3, A_5}
S^+ = {A_2, A_4}
S ∩ S^+ = ∅
```

Therefore:

```text
S is conflict-free.
```

---

## Q6. Check admissible and complete for the sheet’s set `S = {A_1,A_3,A_5}`

Use the same framework as Q5:

```text
A_3 -> A_2 -> A_1
A_5 -> A_4 -> A_1
S = {A_1, A_3, A_5}
```

Check whether `S` is admissible and complete.

### Solution

**Step 1 — Reuse `S^+`.**

From Q5:

```text
S^+ = {A_2, A_4}
```

---

**Step 2 — Check conflict-freeness.**

From Q5:

```text
S ∩ S^+ = ∅
```

So:

```text
S is conflict-free.
```

---

**Step 3 — Check whether `S` defends `A_1`.**

Attackers of `A_1`:

```text
A_1^- = {A_2, A_4}
```

A set defends an argument iff all attackers of that argument are attacked by the set:

```text
A_1^- ⊆ S^+
```

Here:

```text
{A_2, A_4} ⊆ {A_2, A_4}
```

So:

```text
S defends A_1.
```

---

**Step 4 — Check whether `S` defends `A_3` and `A_5`.**

Nothing attacks `A_3` or `A_5`:

```text
A_3^- = ∅
A_5^- = ∅
```

The empty set is a subset of every set:

```text
∅ ⊆ S^+
```

So:

```text
S defends A_3 and A_5.
```

---

**Step 5 — Decide admissibility.**

A set is admissible iff:

```text
1. it is conflict-free, and
2. it defends every argument inside it.
```

Both conditions hold.

Therefore:

```text
S is admissible.
```

---

**Step 6 — Compute `F(S)`.**

`F(S)` is the set of all arguments defended by `S`.

We have shown:

```text
S defends A_1, A_3, A_5.
```

Check the other arguments:

- `A_2` is attacked by `A_3`. To defend `A_2`, `S` would need to attack `A_3`. It does not.
- `A_4` is attacked by `A_5`. To defend `A_4`, `S` would need to attack `A_5`. It does not.

So:

```text
F(S) = {A_1, A_3, A_5}
```

---

**Step 7 — Decide completeness.**

A set is complete iff:

```text
1. it is conflict-free, and
2. S = F(S).
```

Here:

```text
S = {A_1, A_3, A_5}
F(S) = {A_1, A_3, A_5}
```

Therefore:

```text
S is a complete extension.
```

---

## Q7. Fresh example: admissible but not complete

Use this framework:

```text
A = {a, b, c}
R = {a -> b, b -> a, b -> c}
S = {a}
```

Check whether `S` is conflict-free, admissible, and complete.

### Solution

**Step 1 — Compute `S^+`.**

`S = {a}`.

Outgoing attacks from `a`:

```text
a -> b
```

So:

```text
S^+ = {b}
```

---

**Step 2 — Check conflict-freeness.**

```text
S ∩ S^+ = {a} ∩ {b} = ∅
```

So:

```text
S is conflict-free.
```

---

**Step 3 — Check whether `S` defends its own member `a`.**

Attackers of `a`:

```text
a^- = {b}
```

Since:

```text
S^+ = {b}
```

we have:

```text
a^- ⊆ S^+
```

So:

```text
S defends a.
```

---

**Step 4 — Decide admissibility.**

`S` is conflict-free and defends every member of `S`.

Therefore:

```text
S is admissible.
```

---

**Step 5 — Compute `F(S)`.**

Check every argument in `A`.

For `a`:

```text
a^- = {b}
{b} ⊆ S^+ = {b}
```

So `a` is defended.

For `b`:

```text
b^- = {a}
```

But:

```text
a notin S^+
```

So `b` is not defended.

For `c`:

```text
c^- = {b}
```

And:

```text
b in S^+
```

So `c` is defended.

Therefore:

```text
F(S) = {a, c}
```

---

**Step 6 — Decide completeness.**

Complete requires:

```text
S = F(S)
```

But:

```text
S = {a}
F(S) = {a, c}
```

So:

```text
S is admissible but not complete.
```

Why? Because `S` defends `c` but does not include `c`.

---

## Q8. Fresh example: defence is not enough if conflict-free fails

Use this framework:

```text
A = {a, b}
R = {a -> b, b -> a}
S = {a, b}
```

Does `S` count as admissible or complete?

### Solution

**Step 1 — Compute `S^+`.**

`a` attacks `b`, and `b` attacks `a`.

So:

```text
S^+ = {a, b}
```

---

**Step 2 — Check conflict-freeness first.**

```text
S ∩ S^+ = {a, b} ∩ {a, b} = {a, b}
```

This is not empty.

Therefore:

```text
S is not conflict-free.
```

Already this means:

```text
S is not admissible.
S is not complete.
```

---

**Step 3 — Check defence only to see the trap.**

Attackers:

```text
a^- = {b}
b^- = {a}
```

Since:

```text
S^+ = {a, b}
```

we have:

```text
a^- ⊆ S^+
b^- ⊆ S^+
```

So `S` defends both `a` and `b`.

---

**Step 4 — Final decision.**

Even though `S` defends its members, it is internally inconsistent because its members attack each other.

Therefore:

```text
S is not admissible and not complete.
```

Exam trap:

```text
Defence does not rescue a set that is not conflict-free.
```

---

# Section C — Building extensions from scratch

## Q9. Grounded extension for the sheet’s main abstract graph

Use:

```text
A_3 -> A_2 -> A_1
A_5 -> A_4 -> A_1
```

Find the grounded extension by repeatedly applying `F` from `∅`.

### Solution

**Step 1 — Start with the empty set.**

```text
S_0 = ∅
```

The first application `F(∅)` gives arguments with no attackers.

In this graph:

```text
A_3 has no attackers.
A_5 has no attackers.
```

So:

```text
F(∅) = {A_3, A_5}
```

Let:

```text
S_1 = {A_3, A_5}
```

---

**Step 2 — Apply `F` again.**

Compute:

```text
S_1^+ = {A_2, A_4}
```

Now check which arguments are defended by `S_1`.

For `A_1`:

```text
A_1^- = {A_2, A_4}
```

Since:

```text
{A_2, A_4} ⊆ S_1^+
```

`A_1` is defended.

`A_3` and `A_5` are still defended because they have no attackers.

So:

```text
F({A_3, A_5}) = {A_1, A_3, A_5}
```

Let:

```text
S_2 = {A_1, A_3, A_5}
```

---

**Step 3 — Apply `F` again and check for a fixed point.**

From Q6:

```text
F({A_1, A_3, A_5}) = {A_1, A_3, A_5}
```

So we have reached a fixed point.

---

**Final answer.**

```text
Grounded extension = {A_1, A_3, A_5}
```

---

## Q10. Sheet example: preferred and stable extensions for a two-cycle plus isolated argument

Use:

```text
A = {A_1, A_2, A_3}
R = {A_1 -> A_2, A_2 -> A_1}
```

`A_3` is isolated.

Find the complete, preferred, and stable extensions.

### Solution

**Step 1 — Identify the isolated argument.**

`A_3` has no attackers and attacks nobody.

Any complete extension must include every argument it defends. Since `A_3` has no attackers, it is defended by every set.

So complete extensions should include `A_3`.

---

**Step 2 — Check the empty-style candidate `{A_3}`.**

For:

```text
S = {A_3}
```

`S` is conflict-free.

It defends `A_3` because `A_3^- = ∅`.

It does not defend `A_1`, because `A_1^- = {A_2}` and `S` does not attack `A_2`.

It does not defend `A_2`, because `A_2^- = {A_1}` and `S` does not attack `A_1`.

So:

```text
F({A_3}) = {A_3}
```

Therefore:

```text
{A_3} is complete.
```

---

**Step 3 — Check `{A_1, A_3}`.**

`A_1` attacks `A_2`, and `A_3` attacks nobody.

So:

```text
S^+ = {A_2}
```

Conflict-free:

```text
S ∩ S^+ = {A_1,A_3} ∩ {A_2} = ∅
```

Defence:

```text
A_1^- = {A_2}
A_2 ∈ S^+
```

So `A_1` is defended.

`A_3` is unattacked, so it is defended.

No other argument is defended.

So:

```text
F({A_1,A_3}) = {A_1,A_3}
```

Therefore:

```text
{A_1,A_3} is complete.
```

---

**Step 4 — Check `{A_2, A_3}` symmetrically.**

By the same reasoning:

```text
{A_2,A_3} is complete.
```

---

**Step 5 — List complete extensions.**

```text
Complete extensions = {A_3}, {A_1,A_3}, {A_2,A_3}
```

---

**Step 6 — Find preferred extensions.**

Preferred extensions are maximal complete extensions.

`{A_3}` is contained in both larger complete extensions:

```text
{A_3} ⊂ {A_1,A_3}
{A_3} ⊂ {A_2,A_3}
```

So it is not preferred.

The maximal complete extensions are:

```text
Preferred extensions = {A_1,A_3}, {A_2,A_3}
```

---

**Step 7 — Check stable extensions.**

Stable requires:

```text
S^+ = A \ S
```

For `S = {A_1,A_3}`:

```text
S^+ = {A_2}
A \ S = {A_2}
```

So `{A_1,A_3}` is stable.

For `S = {A_2,A_3}`:

```text
S^+ = {A_1}
A \ S = {A_1}
```

So `{A_2,A_3}` is stable.

For `S = {A_3}`:

```text
S^+ = ∅
A \ S = {A_1,A_2}
```

So `{A_3}` is not stable.

---

**Final answer.**

```text
Complete extensions = {A_3}, {A_1,A_3}, {A_2,A_3}
Preferred extensions = {A_1,A_3}, {A_2,A_3}
Stable extensions = {A_1,A_3}, {A_2,A_3}
```

---

## Q11. Fresh example: build all major extensions for a chain

Use:

```text
A = {a, b, c}
R = {a -> b, b -> c}
```

Find the grounded, preferred, stable, and semi-stable extensions.

### Solution

**Step 1 — Compute the grounded extension by iteration.**

Start:

```text
S_0 = ∅
```

Unattacked arguments:

```text
a has no attackers.
```

So:

```text
F(∅) = {a}
```

Now compute `F({a})`.

`{a}^+ = {b}`.

Check defended arguments:

```text
a^- = ∅, so a is defended.
b^- = {a}, but a notin {a}^+ = {b}, so b is not defended.
c^- = {b}, and b in {a}^+ = {b}, so c is defended.
```

Therefore:

```text
F({a}) = {a, c}
```

Now compute `F({a,c})`.

```text
{a,c}^+ = {b}
```

The same defence check gives:

```text
F({a,c}) = {a,c}
```

So:

```text
Grounded extension = {a,c}
```

---

**Step 2 — Find complete extensions.**

A complete extension must be conflict-free and equal to `F(S)`.

Check the useful candidates:

```text
∅ is not complete because F(∅) = {a}.
{a} is not complete because F({a}) = {a,c}.
{a,c} is complete because F({a,c}) = {a,c}.
```

Other singletons fail defence or completeness.

So:

```text
Complete extensions = {a,c}
```

---

**Step 3 — Preferred extension.**

Preferred means maximal complete.

There is only one complete extension:

```text
Preferred extension = {a,c}
```

---

**Step 4 — Stable extension.**

For `S = {a,c}`:

```text
S^+ = {b}
A \ S = {b}
```

So:

```text
S^+ = A \ S
```

Therefore:

```text
Stable extension = {a,c}
```

---

**Step 5 — Semi-stable extension.**

Semi-stable means complete and maximal by range `S ∪ S^+`.

For the only complete extension:

```text
S = {a,c}
S^+ = {b}
S ∪ S^+ = {a,b,c}
```

So it is maximal.

Therefore:

```text
Semi-stable extension = {a,c}
```

---

**Final answer.**

```text
Grounded = {a,c}
Preferred = {a,c}
Stable = {a,c}
Semi-stable = {a,c}
```

---

## Q12. Acceptance status from extensions

Use the preferred extensions from Q10:

```text
E_1 = {A_1, A_3}
E_2 = {A_2, A_3}
```

Classify `A_1`, `A_2`, and `A_3` as skeptically accepted, credulously accepted, or rejected under preferred semantics.

### Solution

**Step 1 — Recall the tests.**

```text
Skeptically accepted: appears in every extension.
Credulously accepted: appears in at least one extension.
Rejected: appears in no extension.
```

---

**Step 2 — Check `A_1`.**

```text
A_1 ∈ E_1
A_1 ∉ E_2
```

So `A_1` is accepted by at least one extension, but not all extensions.

Therefore:

```text
A_1 is credulously accepted, not skeptically accepted.
```

---

**Step 3 — Check `A_2`.**

```text
A_2 ∉ E_1
A_2 ∈ E_2
```

So:

```text
A_2 is credulously accepted, not skeptically accepted.
```

---

**Step 4 — Check `A_3`.**

```text
A_3 ∈ E_1
A_3 ∈ E_2
```

So:

```text
A_3 is skeptically accepted.
```

Since skeptical acceptance implies credulous acceptance, `A_3` is also credulously accepted.

---

**Step 5 — Check rejection.**

Every argument appears in at least one extension.

Therefore:

```text
No argument is rejected under preferred semantics.
```

---

# Section D — Hard edge cases where semantics disagree or break down

## Q13. Odd cycle: no stable extension

Use:

```text
A = {a, b, c}
R = {a -> b, b -> c, c -> a}
```

Find the grounded, complete, preferred, stable, and semi-stable extensions.

### Solution

**Step 1 — Start with conflict-free candidates.**

The graph is a directed 3-cycle.

Conflict-free sets are:

```text
∅, {a}, {b}, {c}
```

Any pair contains an attack along the cycle, so pairs are not conflict-free.

---

**Step 2 — Compute `F(∅)`.**

There are no unattacked arguments:

```text
a is attacked by c.
b is attacked by a.
c is attacked by b.
```

So:

```text
F(∅) = ∅
```

Therefore:

```text
∅ is complete.
```

It is also the grounded extension, because grounded is the least complete extension.

---

**Step 3 — Check singleton `{a}`.**

```text
{a}^+ = {b}
a^- = {c}
```

To defend `a`, `{a}` would need to attack `c`.

But:

```text
c notin {a}^+
```

So `{a}` does not defend itself.

Therefore:

```text
{a} is not admissible and not complete.
```

---

**Step 4 — Check singletons `{b}` and `{c}` symmetrically.**

For `{b}`:

```text
{b}^+ = {c}
b^- = {a}
```

`{b}` does not attack `a`, so it does not defend itself.

For `{c}`:

```text
{c}^+ = {a}
c^- = {b}
```

`{c}` does not attack `b`, so it does not defend itself.

Thus:

```text
{b} and {c} are not admissible and not complete.
```

---

**Step 5 — List complete and preferred extensions.**

Only `∅` is complete.

So:

```text
Complete extensions = ∅
Preferred extensions = ∅
Grounded extension = ∅
```

---

**Step 6 — Check stable extensions.**

Stable requires:

```text
S^+ = A \ S
```

For `S = ∅`:

```text
S^+ = ∅
A \ S = {a,b,c}
```

So `∅` is not stable.

For each singleton:

```text
{a}^+ = {b}, but A \ {a} = {b,c}
{b}^+ = {c}, but A \ {b} = {a,c}
{c}^+ = {a}, but A \ {c} = {a,b}
```

No singleton attacks every argument outside it.

Therefore:

```text
There is no stable extension.
```

---

**Step 7 — Check semi-stable.**

Semi-stable chooses complete extensions with maximal `S ∪ S^+`.

The only complete extension is:

```text
S = ∅
```

So it is semi-stable by default:

```text
Semi-stable extension = ∅
```

---

**Final answer.**

```text
Grounded = ∅
Complete = ∅
Preferred = ∅
Stable = none
Semi-stable = ∅
```

Exam meaning:

```text
Odd cycles can make stable semantics break down completely.
```

---

## Q14. Odd cycle plus isolated argument: semi-stable but not stable

Use:

```text
A = {a, b, c, d}
R = {a -> b, b -> c, c -> a}
```

So `a,b,c` form an odd cycle and `d` is isolated.

Find the grounded, preferred, stable, and semi-stable extensions.

### Solution

**Step 1 — Find unattacked arguments.**

In the cycle:

```text
a is attacked by c.
b is attacked by a.
c is attacked by b.
```

The isolated argument `d` has no attackers.

So:

```text
F(∅) = {d}
```

---

**Step 2 — Apply `F` again.**

For `S = {d}`:

```text
S^+ = ∅
```

because `d` attacks nobody.

Check defence:

```text
d^- = ∅, so d is defended.
a^- = {c}, but c notin S^+.
b^- = {a}, but a notin S^+.
c^- = {b}, but b notin S^+.
```

Therefore:

```text
F({d}) = {d}
```

So `{d}` is a fixed point.

---

**Step 3 — Grounded extension.**

Since iteration from `∅` reaches `{d}`:

```text
Grounded extension = {d}
```

---

**Step 4 — Complete and preferred extensions.**

The odd cycle part contributes no admissible singleton, pair, or triple.

The isolated argument `d` must be included in any complete extension because it is unattacked.

So the only complete extension is:

```text
{d}
```

Therefore the only preferred extension is also:

```text
{d}
```

---

**Step 5 — Stable extension check.**

For:

```text
S = {d}
```

we have:

```text
S^+ = ∅
A \ S = {a,b,c}
```

Stable requires:

```text
S^+ = A \ S
```

But:

```text
∅ ≠ {a,b,c}
```

So `{d}` is not stable.

No set containing any of `a,b,c` can be admissible, so there is no alternative stable candidate.

Therefore:

```text
There is no stable extension.
```

---

**Step 6 — Semi-stable check.**

Semi-stable means:

```text
complete and maximises S ∪ S^+
```

The only complete extension is `{d}`.

So it is automatically maximal among complete extensions.

Therefore:

```text
Semi-stable extension = {d}
```

---

**Final answer.**

```text
Grounded = {d}
Preferred = {d}
Stable = none
Semi-stable = {d}
```

Exam meaning:

```text
Semi-stable can still return an extension when stable semantics returns none.
```

---

## Q15. Mixed hard case: preferred exists but stable does not

Use:

```text
A = {a, b, c, d, e}
R = {a -> b, b -> a, c -> d, d -> e, e -> c}
```

So `a,b` form a 2-cycle and `c,d,e` form a 3-cycle.

Find the grounded, preferred, stable, and semi-stable extensions.

### Solution

**Step 1 — Split the graph into components.**

There are two disconnected parts:

```text
Component 1: a <-> b
Component 2: c -> d -> e -> c
```

The first component is an even 2-cycle.

The second component is an odd 3-cycle.

---

**Step 2 — Grounded extension.**

There are no unattacked arguments:

```text
a is attacked by b.
b is attacked by a.
c is attacked by e.
d is attacked by c.
e is attacked by d.
```

So:

```text
F(∅) = ∅
```

Therefore:

```text
Grounded extension = ∅
```

---

**Step 3 — Work out complete extensions from each component.**

For the 2-cycle `a <-> b`:

```text
∅, {a}, {b}
```

are complete options for that component.

For the 3-cycle `c -> d -> e -> c`:

```text
only ∅
```

is complete, because no singleton defends itself in a directed odd cycle.

Combine the component choices:

```text
Complete extensions = ∅, {a}, {b}
```

---

**Step 4 — Preferred extensions.**

Preferred means maximal complete.

`∅` is contained in both `{a}` and `{b}`.

So:

```text
Preferred extensions = {a}, {b}
```

---

**Step 5 — Stable extension check.**

For `S = {a}`:

```text
S^+ = {b}
A \ S = {b,c,d,e}
```

`{a}` does not attack `c,d,e`, so it is not stable.

For `S = {b}`:

```text
S^+ = {a}
A \ S = {a,c,d,e}
```

`{b}` does not attack `c,d,e`, so it is not stable.

For `S = ∅`:

```text
S^+ = ∅
A \ S = {a,b,c,d,e}
```

So `∅` is not stable.

Therefore:

```text
Stable extensions = none.
```

---

**Step 6 — Semi-stable extension check.**

Compute the ranges `S ∪ S^+` of complete extensions.

For `S = ∅`:

```text
S ∪ S^+ = ∅
```

For `S = {a}`:

```text
S^+ = {b}
S ∪ S^+ = {a,b}
```

For `S = {b}`:

```text
S^+ = {a}
S ∪ S^+ = {a,b}
```

The maximal ranges are achieved by `{a}` and `{b}`.

Therefore:

```text
Semi-stable extensions = {a}, {b}
```

---

**Final answer.**

```text
Grounded = ∅
Preferred = {a}, {b}
Stable = none
Semi-stable = {a}, {b}
```

Exam meaning:

```text
Preferred extensions may exist even when stable extensions do not.
A disconnected odd cycle can destroy stability globally.
```

---

# Section E — Argument games, dispute trees, and dialogue moves

## Q16. Build a winning strategy in a dispute tree

Use this abstract argument graph:

```text
b -> a
c -> a
d -> b
e -> c
```

PRO starts with root argument `a`.

Show a winning strategy for PRO, if one exists.

### Solution

**Step 1 — Identify OPP attacks on PRO’s root.**

The root is:

```text
PRO: a
```

Arguments attacking `a` are:

```text
b and c
```

So OPP has two possible attacks:

```text
OPP: b
OPP: c
```

A winning strategy must include both, not just one.

---

**Step 2 — Find PRO replies to each OPP attack.**

For OPP’s attack `b`:

```text
d -> b
```

So PRO can reply with:

```text
PRO: d
```

For OPP’s attack `c`:

```text
e -> c
```

So PRO can reply with:

```text
PRO: e
```

---

**Step 3 — Write the disputes.**

The winning-strategy subtree has two branches:

```text
Branch 1: PRO a, OPP b, PRO d
Branch 2: PRO a, OPP c, PRO e
```

---

**Step 4 — Check winning-strategy condition 1.**

Condition 1 says the set of disputes must be:

```text
non-empty,
finite,
made of finite disputes,
and every dispute must end with PRO.
```

Here:

```text
D = {[a,b,d], [a,c,e]}
```

This set is non-empty and finite.

Both branches are finite.

Both branches end with PRO:

```text
[a,b,d] ends with PRO d.
[a,c,e] ends with PRO e.
```

So condition 1 holds.

---

**Step 5 — Check winning-strategy condition 2.**

Condition 2 says every possible OPP attack on a PRO move must be represented.

For the root PRO move `a`, the attacks are:

```text
b and c
```

Both are represented as OPP branches.

For PRO move `d`, there are no attackers in the graph.

For PRO move `e`, there are no attackers in the graph.

So all possible attacks on PRO moves are represented.

---

**Final answer.**

```text
Yes, PRO has a winning strategy:

PRO a
├── OPP b
│   └── PRO d
└── OPP c
    └── PRO e
```

The strategy works because PRO has the final move on every branch and has answered every possible attack on `a`.

---

## Q17. No winning strategy because an attack is unanswered

Use this graph:

```text
b -> a
```

PRO starts with root argument `a`.

Does PRO have a winning strategy?

### Solution

**Step 1 — Start the dispute tree.**

PRO begins:

```text
PRO: a
```

OPP can attack with:

```text
OPP: b
```

So the branch is:

```text
PRO a, OPP b
```

---

**Step 2 — Look for a PRO reply to `b`.**

There is no argument in the graph that attacks `b`.

So PRO has no reply.

---

**Step 3 — Check the winning condition.**

A winning dispute branch must end with PRO.

But this branch ends with OPP:

```text
PRO a, OPP b
```

Therefore condition 1 fails.

---

**Final answer.**

```text
PRO does not have a winning strategy for a.
```

Reason:

```text
OPP has an attack b on a, and PRO cannot answer it.
```

---

## Q18. Dialogue moves: `claim`, `why`, and `since`

Suppose an agent’s knowledge base contains:

```text
ψ => φ
```

Agent 1 makes the move:

```text
claim φ
```

Answer the following:

1. What move can Agent 2 use to challenge it?
2. What move can Agent 1 use to answer the challenge?
3. What does the answer move attack?

### Solution

**Step 1 — Check whether `claim φ` is allowed.**

The sheet says:

```text
claim φ
```

can be stated only if `φ` is deducible from the agent’s knowledge base.

Here, the knowledge base contains:

```text
ψ => φ
```

So if the agent can use `ψ` as a reason, then `claim φ` can be supported.

---

**Step 2 — Challenge the claim.**

The challenge move is:

```text
why φ
```

This attacks:

```text
claim φ
```

because it asks for justification.

---

**Step 3 — Answer with a reason.**

Agent 1 can answer:

```text
φ since ψ
```

This says:

```text
φ holds because ψ holds.
```

---

**Step 4 — Identify what `φ since ψ` attacks.**

The move:

```text
φ since ψ
```

attacks:

```text
why φ
```

because it answers the request for justification.

It can also attack a competing move that supports the contrary of `φ`, written schematically as:

```text
¬φ
```

or with the sheet’s overline notation:

```text
\overline{φ}
```

---

**Final answer.**

```text
1. Agent 2 can play: why φ.
2. Agent 1 can answer: φ since ψ.
3. φ since ψ attacks why φ, and can also attack a competing argument for the contrary of φ.
```

---

# Final exam-method checklist

When solving an abstract-argumentation question, write these headings before calculating:

```text
Step 1 — Compute S^+.
Step 2 — Check conflict-free: S ∩ S^+ = ∅.
Step 3 — For each α in S, compute α^- and check α^- ⊆ S^+.
Step 4 — Decide admissible.
Step 5 — Compute F(S) for all arguments, not just members of S.
Step 6 — Decide complete using S = F(S).
```

When solving extension questions, use this order:

```text
Step 1 — Grounded: iterate F from ∅ until fixed point.
Step 2 — Complete: find conflict-free fixed points S = F(S).
Step 3 — Preferred: choose maximal complete extensions.
Step 4 — Stable: check S^+ = A \ S.
Step 5 — Semi-stable: among complete extensions, maximise S ∪ S^+.
Step 6 — Acceptance: skeptical = every extension, credulous = some extension, rejected = no extension.
```

When classifying structured attacks, use this discriminator:

```text
Targets defeasible rule itself?        -> undercutting.
Contradicts defeasible conclusion?     -> rebutting.
Contradicts contestable premise?       -> undermining.
Attack plus sufficient preference?     -> defeat.
```
