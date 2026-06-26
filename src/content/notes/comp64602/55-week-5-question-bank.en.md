---
subject: COMP64602
chapter: 55
title: "Week 5 — Question Bank"
language: en
---

# COMP64602 Week 5 — Worked Question Bank

**Topic:** Non-Monotonic Reasoning for Agents  
**Source read:** uploaded Week 5 MHT lecture sheet. The filename/navigation indicate COMP64602; the sheet header itself says COMP64620, so I preserve the Week 5 topic and use the uploaded filename for the output name.  
**Main lecture cluster:** Maintaining Truth; Negation as Failure / Closed World Assumption; Default Logic; Circumscription.

This is a self-test bank. Each question is followed immediately by its worked solution, so cover the solution before attempting the question.

---

## Task types identified from the sheet

The sheet contains the following examinable procedural task types:

1. Testing whether a reasoning pattern is monotonic or non-monotonic.
2. Updating a belief base when a literal is contradicted by new information.
3. Removing inferred consequences whose justifications have disappeared.
4. Comparing naive logging/rerunning with justification-based truth maintenance.
5. Marking facts **in** or **out** using dependency justifications.
6. Tracking beliefs under different assumption sets.
7. Applying negation as failure / closed world assumption to an unprovable atom.
8. Backward-chaining through rules that contain negation-as-failure conditions.
9. Deriving clear squares in the `checked/obstacle/clear` running example.
10. Showing why negation as failure is non-monotonic after a new obstacle fact is added.
11. Reading negation as failure using minimal-model semantics.
12. Using model-preference entailment: true in all preferred models.
13. Parsing and applying default rules of the form `A : J / C`.
14. Blocking a default when its justification is inconsistent with the knowledge base.
15. Constructing default-logic extensions.
16. Testing skeptical versus credulous entailment from extensions.
17. Handling conflicting defaults with the Nixon Diamond.
18. Adding a preference ordering over default extensions.
19. Applying circumscription by minimising selected predicates.
20. Computing preferred models under circumscription.
21. Comparing CWA, default logic, and circumscription when they agree, disagree, or fail to choose a unique answer.
22. Identifying the sheet's flagged ambiguity in the penguin/emu default rule.

---

# Section A — Mechanical / single-step checks

## Q1. Monotonic or non-monotonic?

A reasoning system has the following behaviour:

- From `KB`, it derives `α`.
- After adding extra information `β`, it no longer derives `α`.

Classify the reasoning pattern as monotonic or non-monotonic.

---

### Worked solution

**Step 1: Recall the monotonicity test.**  
A logic is monotonic if:

`KB ⊨ α` implies `KB ∧ β ⊨ α`.

That means adding information can add conclusions, but cannot remove conclusions.

**Step 2: Compare the given behaviour to the test.**  
Here, the system has:

`KB ⊨ α`

but after adding `β`:

`KB ∧ β ⊭ α`.

**Step 3: Decide the classification.**  
This violates monotonicity.

**Answer:** The reasoning pattern is **non-monotonic**.

**Reference rule:** A system is monotonic iff every old consequence remains a consequence after new information is added.

---

## Q2. Basic truth maintenance: remove an inferred fact

Given the rule:

`φ ⇒ ψ`

Initial belief base:

`KB = {φ}`

The system forward-chains and adds `ψ`. Later it learns:

`¬φ`

What should the updated active belief base contain under truth maintenance?

---

### Worked solution

**Step 1: Derive the initial inferred fact.**  
The rule is:

`φ ⇒ ψ`.

Since `φ` is initially in the belief base, the system infers `ψ`.

So before the update:

`KB = {φ, ψ}`.

**Step 2: Apply the new literal.**  
The new information is `¬φ`, so the old fact `φ` must be removed or marked out.

**Step 3: Check dependencies.**  
`ψ` was not independently observed. It was inferred only because `φ` held.

So `ψ` depends on `φ`.

**Step 4: Remove unsupported consequences.**  
When `φ` disappears, `ψ` loses its justification.

The active belief base should be:

`{¬φ}`.

**Answer:** The system should remove both `φ` and the inferred `ψ`, leaving `¬φ` active.

**Reference rule:** In truth maintenance, an inferred sentence remains active only while its justifications remain active.

---

## Q3. Negation as failure: simple absent fact

Knowledge base:

`KB = {at(1,2), see(obstacle)}`

Query:

`at(0,0)?`

Using negation as failure, what should the system conclude?

---

### Worked solution

**Step 1: Try to prove the positive query.**  
The query is:

`at(0,0)`.

The knowledge base contains:

`at(1,2)`

but it does not contain or derive:

`at(0,0)`.

**Step 2: Apply negation as failure.**  
Negation as failure says: if `φ` cannot be proved, treat `¬φ` as derivable.

So because `at(0,0)` cannot be proved, infer:

`¬at(0,0)`.

**Answer:** Under negation as failure, the system concludes that the robot is **not** at `(0,0)`.

**Reference rule:** `KB ⊭ φ` is treated as `KB ⊨ ¬φ` under negation as failure / closed world reasoning.

---

## Q4. Apply one default rule

Default rule:

`Bird(X) : Flies(X) / Flies(X)`

Facts:

`Bird(a)`

There is no fact or derivation of:

`¬Flies(a)`

Can the default derive `Flies(a)`?

---

### Worked solution

**Step 1: Identify the parts of the default.**  
A default has the form:

`A : J / C`

where:

- `A` is the prerequisite,
- `J` is the justification that must be consistent,
- `C` is the conclusion.

Here:

- prerequisite: `Bird(X)`
- justification: `Flies(X)`
- conclusion: `Flies(X)`

**Step 2: Substitute the object.**  
For `a`, the rule becomes:

`Bird(a) : Flies(a) / Flies(a)`.

**Step 3: Check the prerequisite.**  
`Bird(a)` is known, so the prerequisite holds.

**Step 4: Check the justification.**  
The justification `Flies(a)` must be consistent with the knowledge base.

Since the knowledge base does not contain or entail `¬Flies(a)`, the justification is consistent.

**Step 5: Apply the default.**  
Infer:

`Flies(a)`.

**Answer:** Yes. The default applies and derives `Flies(a)`.

**Reference rule:** `A : J / C` means: if `A` holds, infer `C`, provided `J` is consistent with the knowledge base.

---

## Q5. Apply one circumscription rule

Circumscribed predicate:

`Faulty`

Rule:

`Device(X) ∧ ¬Faulty(X) → Usable(X)`

Facts:

`Device(d)`

No fact says `Faulty(d)`. Under circumscription, can the system derive `Usable(d)`?

---

### Worked solution

**Step 1: Identify the circumscribed predicate.**  
The circumscribed predicate is:

`Faulty`.

Circumscription minimises the extension of this predicate.

**Step 2: Apply the circumscription assumption.**  
Because `Faulty(d)` is not known, prefer models where `Faulty(d)` is false.

So assume:

`¬Faulty(d)`.

**Step 3: Check the rule antecedent.**  
The rule requires:

`Device(d) ∧ ¬Faulty(d)`.

We have:

`Device(d)` by fact, and `¬Faulty(d)` by circumscription.

**Step 4: Apply the rule.**  
Therefore infer:

`Usable(d)`.

**Answer:** Yes. Under circumscription, `Usable(d)` is derived.

**Reference rule:** Circumscription assumes selected predicates false unless known true; preferred models minimise those predicates.

---

# Section B — Multi-condition checks

## Q6. Truth maintenance with a dependency chain

Rules:

1. `p ⇒ q`
2. `q ⇒ r`
3. `s ⇒ t`

Initial observed facts:

`{p, s}`

After forward chaining, the active belief base contains:

`{p, q, r, s, t}`

New information arrives:

`¬p`

Which facts should remain active under justification-based truth maintenance?

---

### Worked solution

**Step 1: Record each inferred fact's justification.**

- `q` depends on `p` because of `p ⇒ q`.
- `r` depends on `q`, and indirectly on `p`, because of `q ⇒ r`.
- `t` depends on `s` because of `s ⇒ t`.

**Step 2: Apply the new information.**  
The system learns `¬p`, so `p` must go out and `¬p` becomes active.

**Step 3: Remove facts depending on `p`.**  
Since `q` depends on `p`, mark `q` out.

Since `r` depends on `q`, mark `r` out too.

**Step 4: Keep independent facts.**  
The fact `s` is independent of `p`, so it remains active.

Since `s` still holds, `t` still has its justification and remains active.

**Answer:** The active belief base should be:

`{¬p, s, t}`.

`q` and `r` are removed because their justification chain passes through `p`.

**Reference rule:** In a justification-based TMS, when a fact moves out, every consequence that depends only on that fact must also move out.

---

## Q7. Why naive logging can delete the wrong things

A system uses the logging/rerunning method. The log is:

| Time | Added fact | Source |
|---|---|---|
| `t1` | `obstacle(path)` | perception |
| `t2` | `red_car(highway)` | perception |
| `t3` | `avoid(path)` | inferred from `obstacle(path)` |

At `t4`, the system learns:

`¬obstacle(path)`

Using naive logging, what gets deleted, and what is the problem?

---

### Worked solution

**Step 1: Locate the fact being revised.**  
The old fact is:

`obstacle(path)`

It was added at `t1`.

**Step 2: Apply the logging method.**  
The logging method removes the old fact and all facts added after it.

So it deletes:

- `obstacle(path)` from `t1`,
- `red_car(highway)` from `t2`,
- `avoid(path)` from `t3`.

**Step 3: Rerun inference.**  
After learning `¬obstacle(path)`, the system should not rederive `avoid(path)`.

So removing `avoid(path)` is correct.

**Step 4: Identify the error.**  
`red_car(highway)` was an independent perceptual fact. It did not depend on `obstacle(path)`.

Rerunning inference will not restore it, because it was not inferred; it came from perception.

**Answer:** Naive logging deletes too much. It correctly removes `obstacle(path)` and `avoid(path)`, but wrongly loses the independent later perception `red_car(highway)`.

**Reference rule:** Logging/rerunning is simple but inefficient and can lose later perceptual facts that are independent of the revised fact.

---

## Q8. Justifications with two independent supports

Rules:

1. `p ⇒ r`
2. `q ⇒ r`

Initial facts:

`{p, q}`

The system has inferred `r`. Later it learns:

`¬p`

Should `r` remain active?

---

### Worked solution

**Step 1: List the justifications for `r`.**  
There are two separate ways to infer `r`:

- from `p` using `p ⇒ r`,
- from `q` using `q ⇒ r`.

So `r` has two possible justifications.

**Step 2: Apply the new information.**  
The system learns `¬p`, so `p` is no longer active.

The first justification for `r` is lost.

**Step 3: Check whether another justification remains.**  
`q` is still active.

Therefore the second justification still supports `r`.

**Step 4: Decide the status of `r`.**  
Since `r` still has at least one active justification, it remains active.

**Answer:** Yes. `r` remains active because it is still justified by `q`.

**Reference rule:** A justified fact should move out only when all active justifications supporting it have disappeared.

---

## Q9. Running example: derive clear squares using NAF

Knowledge base:

```text
checked(0,0)
checked(1,0)
checked(2,0)
obstacle(1,0)
```

Rule:

`checked(X,Y) ∧ ¬obstacle(X,Y) → clear(X,Y)`

Using negation as failure, which `clear` facts are derived?

---

### Worked solution

**Step 1: Check square `(0,0)`.**  
We have:

`checked(0,0)`.

There is no fact or derivation of:

`obstacle(0,0)`.

By negation as failure, infer:

`¬obstacle(0,0)`.

Now the rule antecedent holds:

`checked(0,0) ∧ ¬obstacle(0,0)`.

So infer:

`clear(0,0)`.

**Step 2: Check square `(1,0)`.**  
We have:

`checked(1,0)`.

But the knowledge base explicitly contains:

`obstacle(1,0)`.

So we cannot infer:

`¬obstacle(1,0)`.

The rule antecedent fails, so do not infer:

`clear(1,0)`.

**Step 3: Check square `(2,0)`.**  
We have:

`checked(2,0)`.

There is no fact or derivation of:

`obstacle(2,0)`.

By negation as failure, infer:

`¬obstacle(2,0)`.

Now the rule antecedent holds, so infer:

`clear(2,0)`.

**Answer:** The system derives:

```text
clear(0,0)
clear(2,0)
```

It does not derive `clear(1,0)`.

**Reference rule:** Under NAF, absence of proof for `obstacle(x,y)` supports `¬obstacle(x,y)`, but only when `obstacle(x,y)` is not known or derivable.

---

## Q10. Show non-monotonicity in the clear-square example

Initially:

```text
checked(0,0)
```

Rule:

`checked(X,Y) ∧ ¬obstacle(X,Y) → clear(X,Y)`

There is no `obstacle(0,0)` fact. Later the system adds:

`obstacle(0,0)`

Show the non-monotonic pattern.

---

### Worked solution

**Step 1: Derive the initial conclusion.**  
Initially we have:

`checked(0,0)`.

There is no proof of:

`obstacle(0,0)`.

So by NAF:

`¬obstacle(0,0)`.

Apply the rule:

`checked(0,0) ∧ ¬obstacle(0,0) → clear(0,0)`.

So initially:

`KB ⊨ clear(0,0)`.

**Step 2: Add the new information.**  
Now add:

`obstacle(0,0)`.

The new knowledge base is:

`KB ∧ obstacle(0,0)`.

**Step 3: Re-check the NAF condition.**  
Because `obstacle(0,0)` is now explicitly known, we cannot infer:

`¬obstacle(0,0)`.

**Step 4: Re-check the rule antecedent.**  
The rule needs:

`checked(0,0) ∧ ¬obstacle(0,0)`.

The second part fails.

So we no longer derive:

`clear(0,0)`.

**Answer:** The non-monotonic pattern is:

`KB ⊨ clear(0,0)`

but:

`KB ∧ obstacle(0,0) ⊭ clear(0,0)`.

**Reference rule:** NAF is non-monotonic because adding a new positive fact can remove a previous failure-based negation.

---

## Q11. Backward-chain a NAF query

Facts:

```text
checked(a)
checked(b)
obstacle(b)
```

Rule:

`checked(Z) ∧ ¬obstacle(Z) → clear(Z)`

Query:

`clear(a)?`

Use backward chaining with negation as failure.

---

### Worked solution

**Step 1: Start from the query.**  
We want to prove:

`clear(a)`.

**Step 2: Find a rule whose conclusion matches the query.**  
The rule is:

`checked(Z) ∧ ¬obstacle(Z) → clear(Z)`.

Substitute `Z = a`:

`checked(a) ∧ ¬obstacle(a) → clear(a)`.

**Step 3: Prove the positive subgoal.**  
The first subgoal is:

`checked(a)`.

This is a fact, so it succeeds.

**Step 4: Prove the NAF subgoal.**  
The second subgoal is:

`¬obstacle(a)`.

Under NAF, try to prove `obstacle(a)`.

There is no fact or rule deriving `obstacle(a)`.

So the proof of `obstacle(a)` fails.

By NAF, infer:

`¬obstacle(a)`.

**Step 5: Apply the rule.**  
Both subgoals now succeed:

`checked(a)` and `¬obstacle(a)`.

Therefore infer:

`clear(a)`.

**Answer:** `clear(a)` is derivable by backward chaining with negation as failure.

**Reference rule:** In backward chaining with NAF, a negative subgoal `¬P` succeeds when the corresponding positive subgoal `P` fails.

---

## Q12. Minimal-model check under the closed world assumption

Suppose the relevant atoms are:

`p, q, r`

Knowledge base:

`KB = {p}`

Under closed world / minimal-model reasoning, decide whether each is accepted:

1. `p`
2. `¬q`
3. `¬r`

---

### Worked solution

**Step 1: Identify what must be true.**  
The knowledge base forces:

`p = true`.

It says nothing about `q` or `r`.

**Step 2: Choose minimal models.**  
Minimal models make as few atoms true as possible while still satisfying the knowledge base.

So the preferred minimal assignment is:

```text
p = true
q = false
r = false
```

**Step 3: Test each query in the minimal model.**

- `p` is true, so `p` is accepted.
- `q` is false, so `¬q` is accepted.
- `r` is false, so `¬r` is accepted.

**Answer:** Under minimal-model / closed-world reasoning, all three are accepted:

```text
p
¬q
¬r
```

**Reference rule:** Under CWA/NAF, entailment is truth in all minimal models; unspecified atoms are false in minimal models unless forced true.

---

## Q13. Model-preference entailment

A model-preference logic has two preferred models:

```text
M1 = {p, q}
M2 = {p, r}
```

Which of the following are entailed?

1. `p`
2. `q`
3. `r`
4. `q ∨ r`

---

### Worked solution

**Step 1: Recall the preferred-model entailment test.**  
A formula is entailed if it is true in **all preferred models**.

**Step 2: Test `p`.**  
`p` is true in both `M1` and `M2`.

So `p` is entailed.

**Step 3: Test `q`.**  
`q` is true in `M1`, but false in `M2`.

So `q` is not entailed.

**Step 4: Test `r`.**  
`r` is true in `M2`, but false in `M1`.

So `r` is not entailed.

**Step 5: Test `q ∨ r`.**  
In `M1`, `q` is true, so `q ∨ r` is true.

In `M2`, `r` is true, so `q ∨ r` is true.

So `q ∨ r` is true in all preferred models.

**Answer:** Entailed:

```text
p
q ∨ r
```

Not entailed:

```text
q
r
```

**Reference rule:** In model-preference logics, `KB ⊨ φ` iff `φ` is true in all preferred models.

---

# Section C — Building things from scratch

## Q14. Build a NAF derivation for a fresh grid

Facts:

```text
checked(a)
checked(b)
checked(c)
obstacle(c)
```

Rule:

`checked(Z) ∧ ¬obstacle(Z) → clear(Z)`

Using negation as failure, derive all `clear` facts.

---

### Worked solution

**Step 1: Identify checked objects.**  
The checked objects are:

```text
a, b, c
```

Only checked objects can become clear using this rule.

**Step 2: Test object `a`.**  
`checked(a)` is known.

There is no proof of `obstacle(a)`.

By NAF:

`¬obstacle(a)`.

Therefore:

`clear(a)`.

**Step 3: Test object `b`.**  
`checked(b)` is known.

There is no proof of `obstacle(b)`.

By NAF:

`¬obstacle(b)`.

Therefore:

`clear(b)`.

**Step 4: Test object `c`.**  
`checked(c)` is known.

But `obstacle(c)` is explicitly known.

So we cannot infer:

`¬obstacle(c)`.

Therefore we cannot infer:

`clear(c)`.

**Answer:** The derived clear facts are:

```text
clear(a)
clear(b)
```

`clear(c)` is not derived.

**Reference rule:** `clear(Z)` is derivable exactly when `checked(Z)` is known and `obstacle(Z)` fails to be proved.

---

## Q15. Build and apply a default rule

Natural-language default:

> Normally, registered students can access the lab, unless this is inconsistent with what is known.

Facts:

```text
Registered(s1)
Registered(s2)
¬Access(s2)
```

Build a default rule and decide who gets `Access` by default.

---

### Worked solution

**Step 1: Convert the normality statement into default form.**  
The default says:

If someone is registered, infer they have access, provided access is consistent.

So the rule is:

`Registered(X) : Access(X) / Access(X)`.

**Step 2: Apply the rule to `s1`.**  
Prerequisite:

`Registered(s1)` is known.

Justification:

`Access(s1)` must be consistent.

There is no `¬Access(s1)` fact or derivation.

So the default applies.

Infer:

`Access(s1)`.

**Step 3: Apply the rule to `s2`.**  
Prerequisite:

`Registered(s2)` is known.

Justification:

`Access(s2)` must be consistent.

But the knowledge base contains:

`¬Access(s2)`.

So `Access(s2)` is inconsistent with the knowledge base.

The default is blocked.

**Answer:**

```text
Access(s1) is derived.
Access(s2) is not derived.
```

**Reference rule:** A default `A : J / C` applies only when `A` holds and `J` is consistent with what is known.

---

## Q16. Construct a simple default-logic extension

Facts:

```text
Bird(t)
```

Default rules:

```text
Bird(X) : Flies(X) / Flies(X)
Flies(X) : HasWings(X) / HasWings(X)
```

Assume no contradictions are known. Construct the extension.

---

### Worked solution

**Step 1: Start with atomic facts.**  
The initial fact is:

`Bird(t)`.

So the extension must contain:

`Bird(t)`.

**Step 2: Apply the first default.**  
Default:

`Bird(X) : Flies(X) / Flies(X)`.

For `t`:

`Bird(t)` is known.

`Flies(t)` is consistent because no `¬Flies(t)` is known.

So infer:

`Flies(t)`.

**Step 3: Apply the second default.**  
Default:

`Flies(X) : HasWings(X) / HasWings(X)`.

For `t`:

`Flies(t)` has now been derived.

`HasWings(t)` is consistent because no `¬HasWings(t)` is known.

So infer:

`HasWings(t)`.

**Step 4: Stop when no more defaults apply.**  
No further rules are given.

**Answer:** The extension is:

```text
{Bird(t), Flies(t), HasWings(t)}
```

**Reference rule:** An extension contains facts, non-default consequences, and as many consistent default conclusions as possible.

---

## Q17. Build a circumscription encoding

Natural-language rule:

> Registered users normally have access unless they are banned.

Use circumscription rather than default logic.

Facts:

```text
Registered(u1)
Registered(u2)
Banned(u2)
```

Build the rule, state the circumscribed predicate, and derive access conclusions.

---

### Worked solution

**Step 1: Choose the exception predicate to circumscribe.**  
The exception is being banned.

So circumscribe:

`Banned`.

That means assume users are not banned unless known banned.

**Step 2: Write the ordinary implication rule.**  
The rule is:

`Registered(X) ∧ ¬Banned(X) → Access(X)`.

**Step 3: Evaluate `u1`.**  
`Registered(u1)` is known.

`Banned(u1)` is not known.

Since `Banned` is circumscribed, infer:

`¬Banned(u1)`.

Therefore:

`Access(u1)`.

**Step 4: Evaluate `u2`.**  
`Registered(u2)` is known.

But `Banned(u2)` is explicitly known.

So we cannot assume:

`¬Banned(u2)`.

The rule antecedent fails.

So do not infer:

`Access(u2)`.

**Answer:**

```text
Circumscribed predicate: Banned
Rule: Registered(X) ∧ ¬Banned(X) → Access(X)
Derived: Access(u1)
Not derived: Access(u2)
```

**Reference rule:** Circumscription handles defaults by minimising selected exception predicates.

---

## Q18. Translate a default into an abnormality-based circumscription rule

Default statement:

> Normally, `A(X)` implies `B(X)`.

Translate this into a circumscription-style rule using an abnormality predicate.

---

### Worked solution

**Step 1: Identify the normal rule.**  
The normal rule is:

`A(X) → B(X)`

but it should hold only when `X` is not abnormal.

**Step 2: Introduce an abnormality predicate.**  
Use:

`Abnormal(X)`.

**Step 3: Write the circumscription-style implication.**  
The rule becomes:

`A(X) ∧ ¬Abnormal(X) → B(X)`.

**Step 4: Circumscribe the abnormality predicate.**  
Circumscribe:

`Abnormal`.

This makes the system prefer models where as few objects as possible are abnormal.

**Step 5: Explain the resulting default behaviour.**  
If `A(a)` is known and `Abnormal(a)` is not known, circumscription assumes:

`¬Abnormal(a)`.

Then the rule gives:

`B(a)`.

If later `Abnormal(a)` becomes known, the inference to `B(a)` is blocked.

**Answer:** Use:

```text
A(X) ∧ ¬Abnormal(X) → B(X)
```

with `Abnormal` circumscribed.

**Reference rule:** Circumscription represents defaults by minimising abnormality predicates.

---

# Section D — Hard edge cases: disagreement, ambiguity, and failure to choose

## Q19. Classical logic versus negation as failure

Facts:

```text
checked(a)
```

Rule:

`checked(Z) ∧ ¬obstacle(Z) → clear(Z)`

No fact says either `obstacle(a)` or `¬obstacle(a)`.

Is `clear(a)` derivable under:

1. classical monotonic semantics?
2. negation as failure / closed world semantics?

---

### Worked solution

**Step 1: Analyse the classical case.**  
Classically, to use the rule we need:

`checked(a) ∧ ¬obstacle(a)`.

We have:

`checked(a)`.

But the knowledge base does not say:

`¬obstacle(a)`.

In classical logic, failure to prove `obstacle(a)` does not imply `¬obstacle(a)`.

So the rule antecedent is not established.

Classically:

`KB ⊭ clear(a)`.

**Step 2: Analyse the NAF/CWA case.**  
Under NAF, try to prove:

`obstacle(a)`.

There is no such proof.

So infer:

`¬obstacle(a)`.

Now the rule antecedent holds:

`checked(a) ∧ ¬obstacle(a)`.

Therefore:

`clear(a)`.

Under NAF:

`KB ⊨ clear(a)`.

**Answer:**

```text
Classical monotonic semantics: clear(a) is not derivable.
Negation as failure: clear(a) is derivable.
```

**Reference distinction:** Classical entailment means true in all models of `KB`; NAF/CWA entailment means true in all minimal models of `KB`.

---

## Q20. Default blocked by an explicit contradiction

Default rule:

`Bird(X) : Flies(X) / Flies(X)`

Facts:

```text
Bird(t)
¬Flies(t)
```

Can the default derive `Flies(t)`?

---

### Worked solution

**Step 1: Check the prerequisite.**  
The prerequisite is:

`Bird(t)`.

This is known, so the prerequisite holds.

**Step 2: Check the justification.**  
The justification is:

`Flies(t)`.

For the default to apply, `Flies(t)` must be consistent with the knowledge base.

**Step 3: Look for contradiction.**  
The knowledge base contains:

`¬Flies(t)`.

So adding `Flies(t)` would create inconsistency.

**Step 4: Block the default.**  
Since the justification is not consistent, the default cannot be applied.

**Answer:** No. The default is blocked, so `Flies(t)` is not derived.

**Reference rule:** A default conclusion is not allowed when its justification conflicts with what is already known or entailed.

---

## Q21. The sheet's penguin/emu rule ambiguity

The sheet reports a displayed default rule like:

`Bird(X) : Penguin(X) ∨ Emu(X) / Flies(X)`

but the verbal explanation says:

> Birds normally fly unless they are penguins or emus.

Using the default syntax `A : J / C`, explain why the displayed rule is problematic and give a safer formulation of the intended rule.

---

### Worked solution

**Step 1: Recall the syntax.**  
A default rule:

`A : J / C`

means:

If `A` holds, infer `C`, provided `J` is consistent.

So `J` is not something that blocks the rule. It is something that must remain consistent.

**Step 2: Apply that reading to the displayed rule.**  
The displayed rule is:

`Bird(X) : Penguin(X) ∨ Emu(X) / Flies(X)`.

Under the earlier syntax, the justification would be:

`Penguin(X) ∨ Emu(X)`.

That would mean the default can be applied when it is consistent that `X` is a penguin or emu.

But that does not match the verbal statement.

**Step 3: Compare with the intended meaning.**  
The intended meaning is:

A bird flies unless it is known to be a penguin or emu.

So being a penguin or emu should block the default, not justify it.

**Step 4: Give a safer formulation.**  
One safer way is to use the conclusion itself as the justification, plus rules that penguins/emus do not fly:

```text
Bird(X) : Flies(X) / Flies(X)
Penguin(X) → ¬Flies(X)
Emu(X) → ¬Flies(X)
```

Then if `Penguin(X)` or `Emu(X)` is known, `¬Flies(X)` is derived and the bird default is blocked.

Another direct exception-style formulation would require a justification that encodes the absence of the exceptions, for example:

`Bird(X) : ¬Penguin(X) ∧ ¬Emu(X) ∧ Flies(X) / Flies(X)`

but this is no longer the simple default form shown in the lecture.

**Answer:** The displayed rule is problematic because its justification appears to require consistency of being a penguin or emu, whereas the verbal explanation needs penguin/emu status to block flying. A safer exam answer is to state the ambiguity, then use `Bird(X) : Flies(X) / Flies(X)` plus exception rules deriving `¬Flies(X)` for penguins and emus.

**Reference warning:** The sheet itself flags this as unclear; preserve the lecturer's verbal intention rather than silently treating the printed formula as unproblematic.

---

## Q22. Default-logic Nixon Diamond

Facts:

```text
Republican(Nixon)
Quaker(Nixon)
```

Defaults:

```text
Republican(X) : ¬Pacifist(X) / ¬Pacifist(X)
Quaker(X) : Pacifist(X) / Pacifist(X)
```

Find the extensions and decide whether `Pacifist(Nixon)` is skeptically or credulously entailed.

---

### Worked solution

**Step 1: Start with the facts.**  
Every extension contains:

```text
Republican(Nixon)
Quaker(Nixon)
```

**Step 2: Apply the Republican default candidate.**  
Since `Republican(Nixon)` is known, the Republican default can try to infer:

`¬Pacifist(Nixon)`.

This is consistent as long as `Pacifist(Nixon)` is not also accepted.

So one possible extension contains:

`¬Pacifist(Nixon)`.

Call it:

```text
E1 = {Republican(Nixon), Quaker(Nixon), ¬Pacifist(Nixon)}
```

**Step 3: Apply the Quaker default candidate.**  
Since `Quaker(Nixon)` is known, the Quaker default can try to infer:

`Pacifist(Nixon)`.

This is consistent as long as `¬Pacifist(Nixon)` is not also accepted.

So another possible extension contains:

`Pacifist(Nixon)`.

Call it:

```text
E2 = {Republican(Nixon), Quaker(Nixon), Pacifist(Nixon)}
```

**Step 4: Check why both defaults cannot be in one extension.**  
Accepting both would give:

```text
Pacifist(Nixon)
¬Pacifist(Nixon)
```

That is inconsistent.

So the theory has two competing extensions.

**Step 5: Test skeptical entailment.**  
Skeptical entailment means true in all extensions.

`Pacifist(Nixon)` appears only in `E2`, not in `E1`.

So it is not skeptically entailed.

`¬Pacifist(Nixon)` appears only in `E1`, not in `E2`.

So it is not skeptically entailed either.

**Step 6: Test credulous entailment.**  
Credulous entailment means true in at least one extension.

`Pacifist(Nixon)` appears in `E2`, so it is credulously entailed.

`¬Pacifist(Nixon)` appears in `E1`, so it is also credulously entailed.

**Answer:**

Extensions:

```text
E1 = {Republican(Nixon), Quaker(Nixon), ¬Pacifist(Nixon)}
E2 = {Republican(Nixon), Quaker(Nixon), Pacifist(Nixon)}
```

Skeptically:

```text
Pacifist(Nixon): no
¬Pacifist(Nixon): no
```

Credulously:

```text
Pacifist(Nixon): yes
¬Pacifist(Nixon): yes
```

**Reference rule:** Skeptical = true in all extensions; credulous = true in at least one extension.

---

## Q23. Nixon Diamond with a preferred extension

Use the same default-logic Nixon Diamond as Q22. Suppose the system has a preference:

```text
Quaker default > Republican default
```

Which extension is preferred, and what conclusion should be accepted?

---

### Worked solution

**Step 1: Recall the two extensions.**

```text
E1 = {Republican(Nixon), Quaker(Nixon), ¬Pacifist(Nixon)}
E2 = {Republican(Nixon), Quaker(Nixon), Pacifist(Nixon)}
```

`E1` follows the Republican default.

`E2` follows the Quaker default.

**Step 2: Apply the preference ordering.**  
The preference says:

`Quaker default > Republican default`.

Therefore the extension based on the Quaker default is preferred.

So prefer:

`E2`.

**Step 3: Read the conclusion from the preferred extension.**  
`E2` contains:

`Pacifist(Nixon)`.

**Answer:** The preferred extension is:

```text
E2 = {Republican(Nixon), Quaker(Nixon), Pacifist(Nixon)}
```

The accepted conclusion is:

`Pacifist(Nixon)`.

**Reference rule:** A preference over defaults can select one otherwise-consistent extension over another.

---

## Q24. Why extension size does not solve Nixon Diamond

In the Nixon Diamond, the two default-logic extensions are:

```text
E1 = {Republican(Nixon), Quaker(Nixon), ¬Pacifist(Nixon)}
E2 = {Republican(Nixon), Quaker(Nixon), Pacifist(Nixon)}
```

Can a size-based preference choose between them?

---

### Worked solution

**Step 1: Count the elements in `E1`.**

```text
E1 = {Republican(Nixon), Quaker(Nixon), ¬Pacifist(Nixon)}
```

It has 3 elements.

**Step 2: Count the elements in `E2`.**

```text
E2 = {Republican(Nixon), Quaker(Nixon), Pacifist(Nixon)}
```

It also has 3 elements.

**Step 3: Compare the sizes.**  
Both extensions have the same size.

So a simple minimal-size or maximal-size criterion does not distinguish them.

**Answer:** No. Size-based preference does not resolve the Nixon Diamond because both extensions are the same size.

**Reference point:** The lecture notes that preferred extensions may need a substantive preference ordering, not merely a size comparison.

---

## Q25. Circumscription Nixon Diamond

Facts:

```text
Republican(Nixon)
Quaker(Nixon)
```

Rules:

```text
Republican(X) ∧ ¬Abnormal1(X) → ¬Pacifist(X)
Quaker(X) ∧ ¬Abnormal2(X) → Pacifist(X)
```

Circumscribed predicates:

```text
Abnormal1, Abnormal2
```

Find the preferred models described by the sheet and state whether circumscription chooses `Pacifist(Nixon)` or `¬Pacifist(Nixon)`.

---

### Worked solution

**Step 1: Try making both abnormality predicates false.**  
Circumscription prefers as few abnormality facts as possible.

So first try:

```text
¬Abnormal1(Nixon)
¬Abnormal2(Nixon)
```

**Step 2: Apply both rules under that assumption.**  
Since `Republican(Nixon)` and `¬Abnormal1(Nixon)` hold, the first rule gives:

`¬Pacifist(Nixon)`.

Since `Quaker(Nixon)` and `¬Abnormal2(Nixon)` hold, the second rule gives:

`Pacifist(Nixon)`.

**Step 3: Notice the inconsistency.**  
Together these produce:

```text
Pacifist(Nixon)
¬Pacifist(Nixon)
```

So both abnormality predicates cannot be false together.

**Step 4: Find minimal repairs.**  
To avoid inconsistency, the system must make at least one abnormality predicate true.

Option 1:

`Abnormal1(Nixon)` is true.

Then the Republican rule is blocked, and the Quaker rule gives:

`Pacifist(Nixon)`.

Option 2:

`Abnormal2(Nixon)` is true.

Then the Quaker rule is blocked, and the Republican rule gives:

`¬Pacifist(Nixon)`.

**Step 5: Check preference between the two repairs.**  
Both options require one abnormality fact.

So both are equally minimal.

The lecture says the logic has no preference between them.

**Answer:** There are two equally preferred models:

```text
Model 1: Abnormal1(Nixon), Pacifist(Nixon)
Model 2: Abnormal2(Nixon), ¬Pacifist(Nixon)
```

Circumscription alone does **not** choose a unique conclusion.

**Reference rule:** Circumscription prefers models with the fewest circumscribed facts, but equal-minimum models may still disagree.

---

## Q26. Default logic versus circumscription on Nixon Diamond

Compare the result of the Nixon Diamond under:

1. default logic with skeptical semantics,
2. default logic with credulous semantics,
3. circumscription with no extra preference.

---

### Worked solution

**Step 1: Recall default-logic extensions.**  
Default logic gives two extensions:

```text
E1: ¬Pacifist(Nixon)
E2: Pacifist(Nixon)
```

**Step 2: Apply skeptical semantics.**  
Skeptical semantics accepts only what is true in all extensions.

`Pacifist(Nixon)` is not in all extensions.

`¬Pacifist(Nixon)` is not in all extensions.

So skeptical default logic accepts neither.

**Step 3: Apply credulous semantics.**  
Credulous semantics accepts what is true in at least one extension.

`Pacifist(Nixon)` is in one extension.

`¬Pacifist(Nixon)` is in one extension.

So credulous default logic accepts both, in the technical sense that each has some supporting extension.

**Step 4: Apply circumscription.**  
Circumscription creates two equally preferred ways to block one of the conflicting rules:

- make `Abnormal1(Nixon)` true, supporting `Pacifist(Nixon)`, or
- make `Abnormal2(Nixon)` true, supporting `¬Pacifist(Nixon)`.

With no further preference, it does not choose one.

**Answer:**

```text
Default logic, skeptical: neither Pacifist nor ¬Pacifist.
Default logic, credulous: both Pacifist and ¬Pacifist are separately supported.
Circumscription, no extra preference: two equally preferred models; no unique choice.
```

**Reference distinction:** Default logic reasons over extensions; circumscription reasons over preferred models minimising selected predicates.

---

## Q27. When NAF, default logic, and circumscription agree

Consider the normal-bird situation with no known exception.

Facts:

```text
Bird(t)
```

No fact says:

```text
¬Flies(t)
Flightless(t)
```

Show how each method supports `Flies(t)`:

1. default logic,
2. circumscription,
3. closed-world/NAF style exception reasoning.

---

### Worked solution

**Step 1: Default logic version.**  
Use the default:

`Bird(X) : Flies(X) / Flies(X)`.

For `t`, the prerequisite `Bird(t)` holds.

The justification `Flies(t)` is consistent because `¬Flies(t)` is not known.

So default logic derives:

`Flies(t)`.

**Step 2: Circumscription version.**  
Use the rule:

`Bird(X) ∧ ¬Flightless(X) → Flies(X)`

and circumscribe:

`Flightless`.

Since `Flightless(t)` is not known, circumscription assumes:

`¬Flightless(t)`.

With `Bird(t)`, the rule gives:

`Flies(t)`.

**Step 3: NAF-style exception reasoning.**  
Use the same rule:

`Bird(X) ∧ ¬Flightless(X) → Flies(X)`.

Under NAF, try to prove:

`Flightless(t)`.

This proof fails.

So infer:

`¬Flightless(t)`.

With `Bird(t)`, infer:

`Flies(t)`.

**Answer:** All three methods support `Flies(t)` when the normal case holds and no exception is known.

**Reference point:** The methods often agree in simple default cases; the differences appear when exceptions or conflicting defaults are introduced.

---

## Q28. When the methods diverge after an exception is added

Use the same bird situation as Q27, but now add:

```text
Flightless(t)
```

Rule for circumscription/NAF style:

`Bird(X) ∧ ¬Flightless(X) → Flies(X)`

Default rule:

`Bird(X) : Flies(X) / Flies(X)`

Also assume there is a strict rule:

`Flightless(X) → ¬Flies(X)`

What happens to `Flies(t)`?

---

### Worked solution

**Step 1: Derive the strict exception consequence.**  
We know:

`Flightless(t)`.

Using the strict rule:

`Flightless(X) → ¬Flies(X)`

derive:

`¬Flies(t)`.

**Step 2: Check the default-logic rule.**  
The default rule is:

`Bird(X) : Flies(X) / Flies(X)`.

For `t`, `Bird(t)` holds.

But the justification `Flies(t)` is inconsistent with the known consequence:

`¬Flies(t)`.

So the default is blocked.

It does not derive `Flies(t)`.

**Step 3: Check the circumscription/NAF rule.**  
The rule is:

`Bird(X) ∧ ¬Flightless(X) → Flies(X)`.

For `t`, `Bird(t)` holds.

But `Flightless(t)` is explicitly known, so neither NAF nor circumscription can assume:

`¬Flightless(t)`.

So the rule is blocked.

**Step 4: State the active conclusion.**  
The active strict conclusion is:

`¬Flies(t)`.

**Answer:** After adding the exception, all three methods stop supporting `Flies(t)`, and the strict exception rule supports `¬Flies(t)`.

**Reference pattern:** Non-monotonic conclusions are withdrawn when new exception information removes the default/NAF/circumscription support.

---

## Q29. Assumption-based truth maintenance

An agent stores beliefs under two possible assumption sets:

```text
A1 = {dry_road}
A2 = {icy_road}
```

Rules:

```text
dry_road ⇒ safe_speed(normal)
icy_road ⇒ safe_speed(slow)
```

The agent initially operates under `A1`, then switches to `A2`. Which speed belief should be active before and after the switch?

---

### Worked solution

**Step 1: Read the assumption sets.**  
There are two possible world states:

```text
A1: dry_road
A2: icy_road
```

**Step 2: Derive beliefs under `A1`.**  
Under `A1`, `dry_road` is true.

Using:

`dry_road ⇒ safe_speed(normal)`

derive:

`safe_speed(normal)`.

So while `A1` is active, the speed belief is:

`safe_speed(normal)`.

**Step 3: Switch to `A2`.**  
Under `A2`, `icy_road` is true.

Using:

`icy_road ⇒ safe_speed(slow)`

derive:

`safe_speed(slow)`.

**Step 4: Mark the old assumption-dependent belief inactive.**  
`safe_speed(normal)` depended on `dry_road`, which belongs to `A1`.

When the active assumption set changes to `A2`, the `A1`-dependent belief is no longer active.

**Answer:**

```text
Under A1: safe_speed(normal)
Under A2: safe_speed(slow)
```

**Reference rule:** In assumption-based truth maintenance, a fact is active only in the assumption sets that support it.

---

## Q30. Full mixed-method diagnosis

You are given a reasoning system with:

Facts:

```text
Checked(cell1)
Checked(cell2)
Obstacle(cell2)
Bird(t)
```

Rules:

```text
Checked(Z) ∧ ¬Obstacle(Z) → Clear(Z)
Bird(X) : Flies(X) / Flies(X)
```

No fact says `¬Flies(t)`. Answer:

1. Which conclusions come from NAF?
2. Which conclusions come from default logic?
3. Which conclusions would be withdrawn if `Obstacle(cell1)` is later added?
4. Which conclusions would be withdrawn if `¬Flies(t)` is later added?

---

### Worked solution

**Step 1: Apply NAF to `cell1`.**  
`Checked(cell1)` is known.

There is no proof of:

`Obstacle(cell1)`.

So by NAF:

`¬Obstacle(cell1)`.

Therefore:

`Clear(cell1)`.

**Step 2: Apply NAF to `cell2`.**  
`Checked(cell2)` is known.

But `Obstacle(cell2)` is explicitly known.

So do not infer:

`¬Obstacle(cell2)`.

Therefore do not infer:

`Clear(cell2)`.

**Step 3: Apply default logic to `t`.**  
Default:

`Bird(X) : Flies(X) / Flies(X)`.

For `t`, the prerequisite `Bird(t)` holds.

The justification `Flies(t)` is consistent because `¬Flies(t)` is not known.

So infer:

`Flies(t)`.

**Step 4: Add `Obstacle(cell1)`.**  
If `Obstacle(cell1)` is later added, the NAF support for:

`¬Obstacle(cell1)`

is lost.

So the rule no longer derives:

`Clear(cell1)`.

Withdraw:

`Clear(cell1)`.

**Step 5: Add `¬Flies(t)`.**  
If `¬Flies(t)` is later added, the default justification `Flies(t)` is no longer consistent.

So the default is blocked.

Withdraw:

`Flies(t)`.

**Answer:**

Initial conclusions:

```text
NAF: Clear(cell1)
Default logic: Flies(t)
```

Not derived:

```text
Clear(cell2)
```

Later withdrawals:

```text
Add Obstacle(cell1)  → withdraw Clear(cell1)
Add ¬Flies(t)        → withdraw Flies(t)
```

**Reference pattern:** Different non-monotonic methods can coexist; each conclusion must be withdrawn when the specific support for that conclusion disappears.

---

# Final revision checklist

Before the exam, make sure you can do these without looking:

- State the monotonicity property: `KB ⊨ α ⇒ KB ∧ β ⊨ α`.
- Give a witness for non-monotonicity: `KB ⊨ α` but `KB ∧ β ⊭ α`.
- Update a belief base when a new literal contradicts an old literal.
- Remove inferred consequences whose justifications disappear.
- Explain why logging/rerunning can lose independent perceptual facts.
- Use NAF: if `P` cannot be proved, infer `¬P`.
- Derive `clear` facts from `checked` and absent `obstacle` facts.
- Explain why adding an obstacle removes a previous `clear` conclusion.
- Explain minimal-model semantics for CWA.
- Apply a default rule `A : J / C`.
- Block a default when `J` is inconsistent.
- Construct extensions for simple default theories.
- Test skeptical versus credulous entailment.
- Work the Nixon Diamond in default logic.
- Add a preference ordering over extensions.
- Circumscribe an exception predicate and derive the normal conclusion.
- Work the Nixon Diamond in circumscription.
- Explain why equal preferred models/extensions can leave no unique answer.
- State the flagged ambiguity in the penguin/emu default rule rather than pretending it is clean.
