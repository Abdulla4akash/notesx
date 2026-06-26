---
subject: COMP64401
chapter: 52
title: "Description Logic EL — Question Bank"
language: en
---

# COMP64401 — Description Logic $\mathcal{EL}$ Worked Question Bank

**Source:** uploaded lecture sheet `COMP64401 Chapter 2 - Description Logic EL.mht`.

This bank drills the computational task types that actually appear in the sheet. It is arranged as a difficulty ramp: first mechanical checks, then multi-condition reasoning, then building small KBs from scratch, then high-value edge cases where students often apply the right-looking method in the wrong way.

## Task types identified from the sheet

1. **Parse $\mathcal{EL}$ syntax:** decide whether a class expression is legal using only $\top$, class names, conjunction $C \sqcap D$, and existential restriction $\exists p.C$.
2. **Evaluate class expressions in an interpretation:** compute $C^\mathcal I$, especially for intersections and nested existential restrictions.
3. **Classify axioms and KB components:** distinguish GCIs, class assertions, property assertions, TBoxes, ABoxes, and KBs.
4. **Check satisfaction/modelhood:** test whether an interpretation satisfies an axiom, ABox, TBox, or whole KB.
5. **Test simple entailments:** reason using “all models” and build countermodels when something is not entailed.
6. **Recognise ENF:** decide whether axioms are in $\mathcal{EL}$ normal form and identify the allowed ENF schema.
7. **Transform to ENF:** apply transformation rules 1, 2l, 2r, 3, 4, 5, and 6 with fresh names.
8. **Use conservative extension correctly:** know why fresh names preserve original-vocabulary reasoning but do not give exact equivalence over the same vocabulary.
9. **Apply the consequence-based classification algorithm:** initialise trivial axioms and apply CR1–CR6 until saturation.
10. **Retrieve instances:** derive all entailed class assertions for individuals using CR4–CR6.
11. **Compute polynomial bounds:** count possible ENF axiom forms using $m$, $n$, and $i$.
12. **Make expressivity decisions:** decide whether something is expressible in plain $\mathcal{EL}$, requires $\mathcal{EL}^{++}$, or is outside both because it needs full negation/disjunction.

---

# Section A — Mechanical / single-step checks

These are the “do not lose easy marks” tasks. Write the step headers before calculating.

---

## Q1. Syntax audit: which are legal $\mathcal{EL}$ class expressions?

Let $A,B,C,D$ be class names and let $p,q$ be property names. For each expression, decide whether it is a legal $\mathcal{EL}$ class expression.

1. $A \sqcap \exists p.B$
2. $A \sqcup B$
3. $\exists p.(A \sqcap \exists q.C)$
4. $\neg A$
5. $\exists (p \sqcap q).A$
6. $\top \sqcap A$

### Solution — Q1

**Step 1 — Recall the legal constructors.**

In plain $\mathcal{EL}$, class expressions are built only from:

- $\top$,
- class names such as $A$,
- conjunction $C \sqcap D$,
- existential restriction $\exists p.C$, where $p$ is a property name and $C$ is a class expression.

There is no full disjunction, full negation, or property conjunction.

**Step 2 — Check each expression against the grammar.**

1. $A \sqcap \exists p.B$ is legal. $A$ is a class name, $B$ is a class name, $\exists p.B$ is legal, and conjunction of legal classes is legal.
2. $A \sqcup B$ is not legal in plain $\mathcal{EL}$ because full disjunction $\sqcup$ is not available.
3. $\exists p.(A \sqcap \exists q.C)$ is legal. The filler $A \sqcap \exists q.C$ is itself a legal class expression.
4. $\neg A$ is not legal because plain $\mathcal{EL}$ has no full negation.
5. $\exists (p \sqcap q).A$ is not legal because the role/property position must be a property name, not a conjunction of properties.
6. $\top \sqcap A$ is legal because $\top$ and $A$ are legal classes and conjunction is allowed.

**Answer:** legal expressions are 1, 3, and 6.

---

## Q2. Translate a short English condition into an $\mathcal{EL}$ class expression

Translate:

> things that are both $A$ and have some $p$-successor that is a $B$.

### Solution — Q2

**Step 1 — Identify the outer condition.**

The phrase says “both $A$ and ...”, so the outer constructor is conjunction.

**Step 2 — Translate the successor condition.**

“Have some $p$-successor that is a $B$” is an existential restriction:

$$
\exists p.B.
$$

**Step 3 — Combine the two parts.**

The whole class is:

$$
A \sqcap \exists p.B.
$$

**Answer:** $A \sqcap \exists p.B$.

---

## Q3. Compute a conjunction extension

Let

$$
\Delta^\mathcal I = \{u,v,w,x\},
$$

$$
A^\mathcal I = \{u,v,w\}, \qquad B^\mathcal I = \{v,x\}.
$$

Compute:

$$
(A \sqcap B)^\mathcal I.
$$

### Solution — Q3

**Step 1 — Recall the semantic clause.**

For conjunction:

$$
(C \sqcap D)^\mathcal I = C^\mathcal I \cap D^\mathcal I.
$$

**Step 2 — Substitute the given extensions.**

$$
(A \sqcap B)^\mathcal I = A^\mathcal I \cap B^\mathcal I
= \{u,v,w\} \cap \{v,x\}.
$$

**Step 3 — Compute the intersection.**

The only element in both sets is $v$.

$$
(A \sqcap B)^\mathcal I = \{v\}.
$$

**Answer:** $\{v\}$.

---

## Q4. Compute an existential restriction extension

Let

$$
\Delta^\mathcal I = \{a,b,c,d\},
$$

$$
B^\mathcal I = \{c,d\},
$$

and

$$
p^\mathcal I = \{(a,b),(a,c),(b,d),(c,a)\}.
$$

Compute:

$$
(\exists p.B)^\mathcal I.
$$

### Solution — Q4

**Step 1 — Recall the semantic clause.**

$$
(\exists p.B)^\mathcal I
= \{x \in \Delta^\mathcal I \mid \text{there is some } y \in B^\mathcal I \text{ with } (x,y) \in p^\mathcal I\}.
$$

So we need the elements that have at least one $p$-successor in $B^\mathcal I$.

**Step 2 — Inspect each $p$-edge.**

The $p$-edges are:

- $(a,b)$: target $b \notin B^\mathcal I$.
- $(a,c)$: target $c \in B^\mathcal I$, so $a$ qualifies.
- $(b,d)$: target $d \in B^\mathcal I$, so $b$ qualifies.
- $(c,a)$: target $a \notin B^\mathcal I$.

**Step 3 — Collect the qualifying sources.**

The qualifying sources are $a$ and $b$.

$$
(\exists p.B)^\mathcal I = \{a,b\}.
$$

**Answer:** $\{a,b\}$.

---

## Q5. Classify axioms: GCI, class assertion, or property assertion?

For each axiom, identify its type and say whether it belongs in a TBox or ABox.

1. $A \sqsubseteq B$
2. $a:A$
3. $(a,b):p$
4. $A \sqcap \exists p.B \sqsubseteq C$
5. $b: \exists q.D$

### Solution — Q5

**Step 1 — Recall the axiom forms.**

The $\mathcal{EL}$ axiom forms are:

- GCI: $C \sqsubseteq D$.
- Class assertion: $b:C$.
- Property assertion: $(b,c):p$.

A TBox contains GCIs. An ABox contains class and property assertions.

**Step 2 — Classify each axiom.**

1. $A \sqsubseteq B$ is a GCI, so it belongs in the TBox.
2. $a:A$ is a class assertion, so it belongs in the ABox.
3. $(a,b):p$ is a property assertion, so it belongs in the ABox.
4. $A \sqcap \exists p.B \sqsubseteq C$ is still a GCI because it has the form class expression $\sqsubseteq$ class expression, so it belongs in the TBox.
5. $b: \exists q.D$ is a class assertion, so it belongs in the ABox, even though the asserted class is complex.

**Answer:** 1 and 4 are TBox axioms; 2, 3, and 5 are ABox axioms.

---

## Q6. Check whether an interpretation satisfies a GCI

Let

$$
A^\mathcal I = \{u,v\}, \qquad B^\mathcal I = \{u,v,w\}.
$$

Does $\mathcal I$ satisfy

$$
A \sqsubseteq B?
$$

### Solution — Q6

**Step 1 — Recall the satisfaction condition for a GCI.**

An interpretation $\mathcal I$ satisfies $C \sqsubseteq D$ iff:

$$
C^\mathcal I \subseteq D^\mathcal I.
$$

**Step 2 — Substitute the extensions.**

We need to check:

$$
\{u,v\} \subseteq \{u,v,w\}.
$$

**Step 3 — Check every element on the left.**

Both $u$ and $v$ occur in the right-hand set.

Therefore:

$$
A^\mathcal I \subseteq B^\mathcal I.
$$

**Answer:** yes, $\mathcal I \models A \sqsubseteq B$.

---

## Q7. Recognise ENF forms

For each axiom, decide whether it is in $\mathcal{EL}$ Normal Form. If it is, name the ENF schema.

1. $A \sqsubseteq B$
2. $A \sqcap B \sqsubseteq C$
3. $A \sqsubseteq \exists p.B$
4. $\exists p.A \sqsubseteq B$
5. $A \sqsubseteq B \sqcap C$
6. $a:A$
7. $a:A \sqcap B$

### Solution — Q7

**Step 1 — Recall the allowed ENF schemas.**

An axiom is in ENF iff it has one of these forms:

$$
A \sqsubseteq B,
$$

$$
A_1 \sqcap A_2 \sqsubseteq B,
$$

$$
A \sqsubseteq \exists p.B,
$$

$$
\exists p.A \sqsubseteq B,
$$

$$
b:A,
$$

$$
(b,c):p,
$$

where $A,A_1,A_2,B$ must be class names or $\top$.

**Step 2 — Check each axiom.**

1. $A \sqsubseteq B$ is in ENF: schema $A \sqsubseteq B$.
2. $A \sqcap B \sqsubseteq C$ is in ENF: schema $A_1 \sqcap A_2 \sqsubseteq B$.
3. $A \sqsubseteq \exists p.B$ is in ENF: schema $A \sqsubseteq \exists p.B$.
4. $\exists p.A \sqsubseteq B$ is in ENF: schema $\exists p.A \sqsubseteq B$.
5. $A \sqsubseteq B \sqcap C$ is not in ENF because conjunction is on the right-hand side.
6. $a:A$ is in ENF: schema $b:A$.
7. $a:A \sqcap B$ is not in ENF because class assertions in ENF must assert a class name or $\top$, not a complex class expression.

**Answer:** 1, 2, 3, 4, and 6 are in ENF; 5 and 7 are not.

---

## Q8. Choose the correct consequence rule

For each pattern, name the consequence rule CR1–CR6 that applies.

1. From $A \sqsubseteq B$ and $B \sqsubseteq C$, derive $A \sqsubseteq C$.
2. From $a:A$ and $A \sqsubseteq B$, derive $a:B$.
3. From $(a,b):p$, $b:B$, and $\exists p.B \sqsubseteq A$, derive $a:A$.
4. From $A \sqsubseteq B$, $A \sqsubseteq C$, and $B \sqcap C \sqsubseteq D$, derive $A \sqsubseteq D$.
5. From $a:B$, $a:C$, and $B \sqcap C \sqsubseteq D$, derive $a:D$.

### Solution — Q8

**Step 1 — Match each pattern against the rule shapes.**

The rule names are:

- CR1: subclass transitivity.
- CR2: conjunction on the left for class subsumption.
- CR3: existential restriction reasoning for class subsumption.
- CR4: class assertions inherit along subsumption.
- CR5: conjunction for class assertions.
- CR6: property assertion plus existential-left GCI.

**Step 2 — Identify each rule.**

1. $A \sqsubseteq B$, $B \sqsubseteq C$ gives $A \sqsubseteq C$: CR1.
2. $a:A$, $A \sqsubseteq B$ gives $a:B$: CR4.
3. $(a,b):p$, $b:B$, $\exists p.B \sqsubseteq A$ gives $a:A$: CR6.
4. $A \sqsubseteq B$, $A \sqsubseteq C$, $B \sqcap C \sqsubseteq D$ gives $A \sqsubseteq D$: CR2.
5. $a:B$, $a:C$, $B \sqcap C \sqsubseteq D$ gives $a:D$: CR5.

**Answer:** 1 = CR1, 2 = CR4, 3 = CR6, 4 = CR2, 5 = CR5.

---

# Section B — Multi-condition checks

Now the questions require combining more than one definition or rule.

---

## Q9. Running interpretation: compute a nested class expression

Use the lecture’s running interpretation:

$$
\Delta^\mathcal I = \{a,b,c,d,e,f,g\},
$$

$$
\text{BelowF}^\mathcal I = \{a,b\}, \qquad \text{Rain}^\mathcal I = \{b,c\},
$$

$$
\text{hasWeather}^\mathcal I = \{(d,a),(d,b),(d,c),(e,a),(e,c)\},
$$

$$
\text{isLocatedIn}^\mathcal I = \{(d,e),(e,e),(d,d)\}.
$$

Compute:

$$
(\exists \text{isLocatedIn}.\exists \text{hasWeather}.(\text{BelowF} \sqcap \text{Rain}))^\mathcal I.
$$

### Solution — Q9

**Step 1 — Compute the innermost conjunction.**

$$
(\text{BelowF} \sqcap \text{Rain})^\mathcal I
= \text{BelowF}^\mathcal I \cap \text{Rain}^\mathcal I.
$$

Substitute:

$$
\{a,b\} \cap \{b,c\} = \{b\}.
$$

So:

$$
(\text{BelowF} \sqcap \text{Rain})^\mathcal I = \{b\}.
$$

**Step 2 — Compute the middle existential.**

We need:

$$
(\exists \text{hasWeather}.(\text{BelowF} \sqcap \text{Rain}))^\mathcal I.
$$

This is the set of sources with a `hasWeather` edge to an element in $\{b\}$.

The relevant edge is:

$$
(d,b) \in \text{hasWeather}^\mathcal I.
$$

So:

$$
(\exists \text{hasWeather}.(\text{BelowF} \sqcap \text{Rain}))^\mathcal I = \{d\}.
$$

**Step 3 — Compute the outer existential.**

Now compute:

$$
(\exists \text{isLocatedIn}.\{d\})^\mathcal I.
$$

We need sources with an `isLocatedIn` edge to $d$.

The relevant edge is:

$$
(d,d) \in \text{isLocatedIn}^\mathcal I.
$$

So the source $d$ qualifies.

**Answer:**

$$
(\exists \text{isLocatedIn}.\exists \text{hasWeather}.(\text{BelowF} \sqcap \text{Rain}))^\mathcal I = \{d\}.
$$

---

## Q10. Check whether an interpretation is a model of a small KB

Let

$$
\Delta^\mathcal I = \{u,v,w\},
$$

$$
A^\mathcal I = \{u,v\}, \qquad B^\mathcal I = \{v\}, \qquad C^\mathcal I = \{v,w\},
$$

$$
p^\mathcal I = \{(u,v),(w,u)\},
$$

and individual names are interpreted as:

$$
a^\mathcal I = u, \qquad b^\mathcal I = v.
$$

Check whether $\mathcal I$ is a model of the KB:

$$
\mathcal K = \{B \sqsubseteq A,\; A \sqcap C \sqsubseteq B,\; a:A,\; (a,b):p,\; b:C\}.
$$

### Solution — Q10

**Step 1 — Recall what “model” means.**

An interpretation is a model of a KB iff it satisfies every axiom in the KB.

So we check each axiom one by one.

**Step 2 — Check $B \sqsubseteq A$.**

We need:

$$
B^\mathcal I \subseteq A^\mathcal I.
$$

Substitute:

$$
\{v\} \subseteq \{u,v\}.
$$

This is true.

**Step 3 — Check $A \sqcap C \sqsubseteq B$.**

First compute:

$$
(A \sqcap C)^\mathcal I = A^\mathcal I \cap C^\mathcal I
= \{u,v\} \cap \{v,w\}
= \{v\}.
$$

Now check:

$$
\{v\} \subseteq B^\mathcal I = \{v\}.
$$

This is true.

**Step 4 — Check $a:A$.**

A class assertion $a:A$ is satisfied iff:

$$
a^\mathcal I \in A^\mathcal I.
$$

Here $a^\mathcal I=u$ and $u \in \{u,v\}$, so this is true.

**Step 5 — Check $(a,b):p$.**

A property assertion $(a,b):p$ is satisfied iff:

$$
(a^\mathcal I,b^\mathcal I) \in p^\mathcal I.
$$

Here:

$$
(a^\mathcal I,b^\mathcal I)=(u,v),
$$

and $(u,v) \in p^\mathcal I$, so this is true.

**Step 6 — Check $b:C$.**

Here $b^\mathcal I=v$ and $v \in C^\mathcal I=\{v,w\}$, so this is true.

**Answer:** yes, $\mathcal I$ is a model of $\mathcal K$ because it satisfies every axiom.

---

## Q11. Entailment or non-entailment?

Let

$$
\mathcal T = \{A \sqsubseteq B,\; B \sqsubseteq C\}.
$$

Decide whether each entailment holds.

1. $\mathcal T \models A \sqsubseteq C$
2. $\mathcal T \models C \sqsubseteq A$

For any non-entailment, give a countermodel.

### Solution — Q11

**Step 1 — Recall entailment.**

$$
\mathcal T \models \alpha
$$

means every model of $\mathcal T$ satisfies $\alpha$.

**Step 2 — Test $A \sqsubseteq C$.**

Every model of $\mathcal T$ satisfies:

$$
A^\mathcal I \subseteq B^\mathcal I
$$

and:

$$
B^\mathcal I \subseteq C^\mathcal I.
$$

By transitivity of subset:

$$
A^\mathcal I \subseteq C^\mathcal I.
$$

So every model satisfies $A \sqsubseteq C$.

Therefore:

$$
\mathcal T \models A \sqsubseteq C.
$$

**Step 3 — Test $C \sqsubseteq A$.**

This does not follow from the two axioms. To show this, build a model of $\mathcal T$ that falsifies $C \sqsubseteq A$.

Let:

$$
\Delta^\mathcal I = \{x,y\},
$$

$$
A^\mathcal I = \{x\}, \qquad B^\mathcal I = \{x\}, \qquad C^\mathcal I = \{x,y\}.
$$

Check the TBox:

$$
A^\mathcal I \subseteq B^\mathcal I
$$

is true because $\{x\} \subseteq \{x\}$.

$$
B^\mathcal I \subseteq C^\mathcal I
$$

is true because $\{x\} \subseteq \{x,y\}$.

So $\mathcal I$ is a model of $\mathcal T$.

But:

$$
C^\mathcal I \nsubseteq A^\mathcal I
$$

because $y \in C^\mathcal I$ but $y \notin A^\mathcal I$.

So $\mathcal I \not\models C \sqsubseteq A$.

**Answer:**

1. Yes, $\mathcal T \models A \sqsubseteq C$.
2. No, $\mathcal T \not\models C \sqsubseteq A$.

---

## Q12. Expand equivalence sugar and derive consequences

Suppose the TBox contains:

$$
D \equiv A \sqcap \exists p.B,
$$

and also:

$$
A \sqcap X \sqsubseteq E, \qquad \exists p.B \sqsubseteq X.
$$

Show how $D \sqsubseteq E$ can be derived after expanding the equivalence.

### Solution — Q12

**Step 1 — Expand the equivalence.**

The notation:

$$
D \equiv A \sqcap \exists p.B
$$

is syntactic sugar for two GCIs:

$$
D \sqsubseteq A \sqcap \exists p.B,
$$

and:

$$
A \sqcap \exists p.B \sqsubseteq D.
$$

For deriving $D \sqsubseteq E$, we need the first direction.

**Step 2 — Split the right-hand conjunction conceptually.**

From:

$$
D \sqsubseteq A \sqcap \exists p.B,
$$

we get the two consequences:

$$
D \sqsubseteq A,
$$

and:

$$
D \sqsubseteq \exists p.B.
$$

If running the formal algorithm, this split is obtained through ENF transformation before classification.

**Step 3 — Use existential-left reasoning.**

We have:

$$
D \sqsubseteq \exists p.B.
$$

Also, by reflexivity after initialisation:

$$
B \sqsubseteq B.
$$

Given:

$$
\exists p.B \sqsubseteq X,
$$

CR3 gives:

$$
D \sqsubseteq X.
$$

**Step 4 — Use conjunction reasoning.**

Now we have:

$$
D \sqsubseteq A,
$$

$$
D \sqsubseteq X,
$$

and:

$$
A \sqcap X \sqsubseteq E.
$$

By CR2:

$$
D \sqsubseteq E.
$$

**Answer:** after expanding the equivalence and using CR3 then CR2, we derive $D \sqsubseteq E$.

---

## Q13. ENF rule selection for a non-normal axiom

For the axiom:

$$
A \sqcap \exists p.(B \sqcap C) \sqsubseteq D,
$$

identify which ENF transformation rule applies first, and apply it.

### Solution — Q13

**Step 1 — Check whether the axiom is already in ENF.**

The left-hand side is a conjunction:

$$
A \sqcap \exists p.(B \sqcap C).
$$

In ENF, a conjunction on the left must have two atomic conjuncts:

$$
A_1 \sqcap A_2 \sqsubseteq B.
$$

Here the right conjunct $\exists p.(B \sqcap C)$ is complex, so the axiom is not in ENF.

**Step 2 — Match the shape to a transformation rule.**

The axiom has the form:

$$
C \sqcap \mathbb D \sqsubseteq A,
$$

where $C=A$ and $\mathbb D = \exists p.(B \sqcap C)$ is complex.

So we use Rule 2r:

$$
C \sqcap \mathbb D \sqsubseteq A
\rightsquigarrow
\mathbb D \sqsubseteq X, \quad C \sqcap X \sqsubseteq A.
$$

**Step 3 — Apply Rule 2r with a fresh name.**

Introduce fresh $X_1$:

$$
\exists p.(B \sqcap C) \sqsubseteq X_1,
$$

$$
A \sqcap X_1 \sqsubseteq D.
$$

**Step 4 — Check what remains.**

The second axiom is now in ENF. The first axiom is not yet in ENF because the filler $B \sqcap C$ is complex. It will need another rule later.

**Answer:** apply Rule 2r first, producing $\exists p.(B \sqcap C) \sqsubseteq X_1$ and $A \sqcap X_1 \sqsubseteq D$.

---

## Q14. Apply CR2 to derive a class subsumption

Let the saturated-so-far KB contain:

$$
A \sqsubseteq B,
$$

$$
A \sqsubseteq C,
$$

$$
B \sqcap C \sqsubseteq D.
$$

Which new axiom is added by CR2?

### Solution — Q14

**Step 1 — Recall CR2.**

CR2 says: if

$$
A \sqsubseteq A_1,
$$

$$
A \sqsubseteq A_2,
$$

and

$$
A_1 \sqcap A_2 \sqsubseteq B,
$$

then add:

$$
A \sqsubseteq B.
$$

**Step 2 — Match the rule variables.**

Here:

$$
A_1 = B,
$$

$$
A_2 = C,
$$

and the conjunction axiom is:

$$
B \sqcap C \sqsubseteq D.
$$

**Step 3 — Apply the conclusion.**

Therefore CR2 adds:

$$
A \sqsubseteq D.
$$

**Answer:** $A \sqsubseteq D$.

---

## Q15. Apply CR3 to derive an existential consequence

Let the KB contain:

$$
A \sqsubseteq \exists p.B,
$$

$$
B \sqsubseteq C,
$$

$$
\exists p.C \sqsubseteq D.
$$

Use CR3 to derive a new subsumption.

### Solution — Q15

**Step 1 — Recall CR3.**

CR3 says: if

$$
A \sqsubseteq \exists p.A_1,
$$

$$
A_1 \sqsubseteq B_1,
$$

and

$$
\exists p.B_1 \sqsubseteq B,
$$

then add:

$$
A \sqsubseteq B.
$$

**Step 2 — Match the premises.**

Given:

$$
A \sqsubseteq \exists p.B,
$$

so $A_1=B$.

Given:

$$
B \sqsubseteq C,
$$

so $B_1=C$.

Given:

$$
\exists p.C \sqsubseteq D,
$$

so the final superclass is $D$.

**Step 3 — Apply CR3.**

Therefore add:

$$
A \sqsubseteq D.
$$

**Answer:** $A \sqsubseteq D$.

---

## Q16. Instance retrieval with CR4, CR5, and CR6

Let the KB contain:

$$
a:A,
$$

$$
a:B,
$$

$$
A \sqcap B \sqsubseteq C,
$$

$$
C \sqsubseteq D,
$$

$$
(a,b):p,
$$

$$
b:E,
$$

$$
\exists p.E \sqsubseteq F.
$$

Derive all non-trivial class assertions about $a$ using CR4–CR6.

### Solution — Q16

**Step 1 — List explicit assertions about $a$.**

Initially we have:

$$
a:A,
$$

$$
a:B.
$$

We also have a property edge:

$$
(a,b):p.
$$

**Step 2 — Apply CR5 using the conjunction axiom.**

CR5 says: if $a:A$, $a:B$, and $A \sqcap B \sqsubseteq C$, then add $a:C$.

So we add:

$$
a:C.
$$

**Step 3 — Apply CR4 along $C \sqsubseteq D$.**

CR4 says: if $a:C$ and $C \sqsubseteq D$, then add $a:D$.

So we add:

$$
a:D.
$$

**Step 4 — Apply CR6 using the property assertion.**

CR6 says: if $(a,b):p$, $b:E$, and $\exists p.E \sqsubseteq F$, then add $a:F$.

So we add:

$$
a:F.
$$

**Step 5 — Collect all non-trivial derived assertions.**

The non-trivial new class assertions about $a$ are:

$$
a:C,
$$

$$
a:D,
$$

$$
a:F.
$$

**Answer:** $a:C$, $a:D$, and $a:F$.

---

## Q17. Compute the polynomial bound for possible ENF axioms

Suppose a KB uses:

- $m=5$ class names including $\top$,
- $n=2$ property names,
- $i=3$ individual names.

Using the lecture’s bound, compute the maximum number of possible ENF axioms of the forms counted by the classification proof:

$$
m^3 + m^2(1+2n) + mi + ni^2.
$$

### Solution — Q17

**Step 1 — Recall what the variables mean.**

- $m$ counts class names, including $\top$.
- $n$ counts property names.
- $i$ counts individual names.

Given:

$$
m=5, \quad n=2, \quad i=3.
$$

**Step 2 — Substitute into the formula.**

$$
m^3 + m^2(1+2n) + mi + ni^2
$$

becomes:

$$
5^3 + 5^2(1+2\cdot 2) + 5\cdot 3 + 2\cdot 3^2.
$$

**Step 3 — Compute each part.**

$$
5^3 = 125.
$$

$$
1+2\cdot 2 = 5.
$$

$$
5^2(5)=25\cdot 5=125.
$$

$$
5\cdot 3 = 15.
$$

$$
2\cdot 3^2 = 2\cdot 9=18.
$$

**Step 4 — Add the parts.**

$$
125+125+15+18=283.
$$

**Answer:** the bound gives $283$ possible ENF axioms of the counted forms.

---

# Section C — Building things from scratch

These questions force you to construct the KB, not merely recognise a given pattern.

---

## Q18. Build a TBox and derive a hierarchy consequence

Model the following in $\mathcal{EL}$:

> Every $B$ is an $A$. Every $C$ is a $B$. Every object that is both $A$ and $D$ is an $E$.

Then add the fact that $C \sqsubseteq D$. Derive $C \sqsubseteq E$.

### Solution — Q18

**Step 1 — Translate the English statements into GCIs.**

“Every $B$ is an $A$” becomes:

$$
B \sqsubseteq A.
$$

“Every $C$ is a $B$” becomes:

$$
C \sqsubseteq B.
$$

“Every object that is both $A$ and $D$ is an $E$” becomes:

$$
A \sqcap D \sqsubseteq E.
$$

The additional fact is:

$$
C \sqsubseteq D.
$$

So:

$$
\mathcal T = \{B \sqsubseteq A,\; C \sqsubseteq B,\; A \sqcap D \sqsubseteq E,\; C \sqsubseteq D\}.
$$

**Step 2 — Use CR1 to get $C \sqsubseteq A$.**

From:

$$
C \sqsubseteq B
$$

and:

$$
B \sqsubseteq A,
$$

CR1 adds:

$$
C \sqsubseteq A.
$$

**Step 3 — Use CR2 with the conjunction axiom.**

Now we have:

$$
C \sqsubseteq A,
$$

$$
C \sqsubseteq D,
$$

and:

$$
A \sqcap D \sqsubseteq E.
$$

By CR2, add:

$$
C \sqsubseteq E.
$$

**Answer:** the constructed TBox entails $C \sqsubseteq E$.

---

## Q19. Build a small ABox and retrieve an instance

Construct an ABox and TBox for the following pattern:

> Individual $a$ has a $p$-successor $b$. Individual $b$ is a $B$. Anything with a $p$-successor that is a $B$ is an $A$.

Then derive whether $a:A$ is entailed.

### Solution — Q19

**Step 1 — Translate the individual facts into ABox assertions.**

“$a$ has a $p$-successor $b$” becomes:

$$
(a,b):p.
$$

“$b$ is a $B$” becomes:

$$
b:B.
$$

So the ABox is:

$$
\mathcal A = \{(a,b):p,\; b:B\}.
$$

**Step 2 — Translate the general rule into a TBox axiom.**

“Anything with a $p$-successor that is a $B$ is an $A$” becomes:

$$
\exists p.B \sqsubseteq A.
$$

So the TBox is:

$$
\mathcal T = \{\exists p.B \sqsubseteq A\}.
$$

**Step 3 — Apply CR6.**

CR6 uses:

$$
(a,b):p,
$$

$$
b:B,
$$

and:

$$
\exists p.B \sqsubseteq A.
$$

Therefore CR6 adds:

$$
a:A.
$$

**Step 4 — State the entailment.**

Because the classification algorithm is sound, the derived assertion is entailed:

$$
\mathcal K \models a:A.
$$

**Answer:** yes, $a:A$ is entailed.

---

## Q20. Build an interpretation that falsifies an existential GCI

Build an interpretation showing that the following entailment does **not** hold:

$$
\{A \sqsubseteq \exists p.B\} \not\models A \sqsubseteq B.
$$

### Solution — Q20

**Step 1 — Understand what must be shown.**

To show non-entailment, we need a model of:

$$
A \sqsubseteq \exists p.B
$$

that does not satisfy:

$$
A \sqsubseteq B.
$$

So we need an element that is in $A$, has a $p$-successor in $B$, but is not itself in $B$.

**Step 2 — Choose a small domain.**

Let:

$$
\Delta^\mathcal I = \{x,y\}.
$$

**Step 3 — Interpret the class names.**

Let:

$$
A^\mathcal I = \{x\},
$$

$$
B^\mathcal I = \{y\}.
$$

So $x$ is an $A$, but $x$ is not a $B$.

**Step 4 — Interpret the property.**

Let:

$$
p^\mathcal I = \{(x,y)\}.
$$

Then $x$ has a $p$-successor $y$, and $y \in B^\mathcal I$.

So:

$$
x \in (\exists p.B)^\mathcal I.
$$

**Step 5 — Check the premise.**

Since every element of $A^\mathcal I=\{x\}$ is in $(\exists p.B)^\mathcal I$, the axiom

$$
A \sqsubseteq \exists p.B
$$

is satisfied.

**Step 6 — Check the target axiom.**

But:

$$
A^\mathcal I = \{x\}
$$

is not a subset of:

$$
B^\mathcal I = \{y\}.
$$

So:

$$
\mathcal I \not\models A \sqsubseteq B.
$$

**Answer:** the entailment fails. A model can make $A$-objects point to $B$-objects without making the $A$-objects themselves members of $B$.

---

## Q21. Transform a fresh axiom into ENF

Transform the axiom

$$
A \sqsubseteq \exists p.(B \sqcap \exists q.C)
$$

into ENF using fresh names.

### Solution — Q21

**Step 1 — Check the outer shape.**

The axiom has the form:

$$
A \sqsubseteq \exists p.\mathbb D,
$$

where:

$$
\mathbb D = B \sqcap \exists q.C.
$$

The filler is complex, so this is not ENF.

**Step 2 — Apply Rule 4 for a complex existential on the right.**

Rule 4 says:

$$
A \sqsubseteq \exists p.\mathbb D
\rightsquigarrow
X \sqsubseteq \mathbb D,
\quad
A \sqsubseteq \exists p.X.
$$

Introduce fresh $X_1$:

$$
X_1 \sqsubseteq B \sqcap \exists q.C,
$$

$$
A \sqsubseteq \exists p.X_1.
$$

The second axiom is in ENF.

**Step 3 — Split the right-hand conjunction using Rule 5.**

The axiom:

$$
X_1 \sqsubseteq B \sqcap \exists q.C
$$

has a conjunction on the right, so Rule 5 gives:

$$
X_1 \sqsubseteq B,
$$

$$
X_1 \sqsubseteq \exists q.C.
$$

**Step 4 — Check whether the resulting axioms are in ENF.**

- $A \sqsubseteq \exists p.X_1$ is ENF.
- $X_1 \sqsubseteq B$ is ENF.
- $X_1 \sqsubseteq \exists q.C$ is ENF because the filler $C$ is atomic.

**Answer:** one ENF transformation is:

$$
\{A \sqsubseteq \exists p.X_1,\; X_1 \sqsubseteq B,\; X_1 \sqsubseteq \exists q.C\}.
$$

---

## Q22. Build and classify a mini KB from scratch

Build a KB for this situation:

- Every $Student$ is a $Person$.
- Every $Person$ who attends some $Course$ is an $EnrolledPerson$.
- $ali$ is a $Student$.
- $ali$ attends $c1$.
- $c1$ is a $Course$.

Then derive all relevant class assertions about $ali$.

### Solution — Q22

**Step 1 — Build the TBox.**

“Every $Student$ is a $Person$” becomes:

$$
Student \sqsubseteq Person.
$$

“Every $Person$ who attends some $Course$ is an $EnrolledPerson$” becomes:

$$
Person \sqcap \exists attends.Course \sqsubseteq EnrolledPerson.
$$

This is not ENF because the right conjunct on the left is complex. For reasoning with CR rules, normalise it.

**Step 2 — Transform the complex left conjunction into ENF.**

Use Rule 2r:

$$
Person \sqcap \exists attends.Course \sqsubseteq EnrolledPerson
$$

becomes:

$$
\exists attends.Course \sqsubseteq X_1,
$$

$$
Person \sqcap X_1 \sqsubseteq EnrolledPerson.
$$

Both are ENF.

So the ENF TBox is:

$$
\mathcal T' = \{Student \sqsubseteq Person,\; \exists attends.Course \sqsubseteq X_1,\; Person \sqcap X_1 \sqsubseteq EnrolledPerson\}.
$$

**Step 3 — Build the ABox.**

The facts become:

$$
ali:Student,
$$

$$
(ali,c1):attends,
$$

$$
c1:Course.
$$

So:

$$
\mathcal A = \{ali:Student,\; (ali,c1):attends,\; c1:Course\}.
$$

**Step 4 — Derive $ali:Person$ using CR4.**

From:

$$
ali:Student
$$

and:

$$
Student \sqsubseteq Person,
$$

CR4 adds:

$$
ali:Person.
$$

**Step 5 — Derive $ali:X_1$ using CR6.**

From:

$$
(ali,c1):attends,
$$

$$
c1:Course,
$$

and:

$$
\exists attends.Course \sqsubseteq X_1,
$$

CR6 adds:

$$
ali:X_1.
$$

**Step 6 — Derive $ali:EnrolledPerson$ using CR5.**

Now we have:

$$
ali:Person,
$$

$$
ali:X_1,
$$

and:

$$
Person \sqcap X_1 \sqsubseteq EnrolledPerson.
$$

By CR5, add:

$$
ali:EnrolledPerson.
$$

**Answer:** the relevant entailed assertions about $ali$ are:

$$
ali:Person, \qquad ali:X_1, \qquad ali:EnrolledPerson.
$$

Over the original vocabulary, the main useful conclusion is:

$$
ali:EnrolledPerson.
$$

---

# Section D — Full ENF transformation and classification drills

These are closer to exam/worked-example style.

---

## Q23. Running ENF transformation example from the sheet

Transform the lecture’s running TBox into ENF:

$$
\mathcal T = \{\exists p.(A \sqcap \exists p.\top) \sqsubseteq B \sqcap C,\; B \sqcap \exists r.A \sqsubseteq \exists p.(B \sqcap C)\}.
$$

Use fresh names $X_1,X_2,\ldots$.

### Solution — Q23

**Step 1 — Start with the first axiom.**

The first axiom is:

$$
\exists p.(A \sqcap \exists p.\top) \sqsubseteq B \sqcap C.
$$

Both sides are complex, so apply Rule 1:

$$
\exists p.(A \sqcap \exists p.\top) \sqsubseteq X_1,
$$

$$
X_1 \sqsubseteq B \sqcap C.
$$

**Step 2 — Split the right-hand conjunction in $X_1 \sqsubseteq B \sqcap C$.**

Apply Rule 5:

$$
X_1 \sqsubseteq B,
$$

$$
X_1 \sqsubseteq C.
$$

These two are ENF.

**Step 3 — Handle the complex existential on the left.**

The axiom:

$$
\exists p.(A \sqcap \exists p.\top) \sqsubseteq X_1
$$

has the form:

$$
\exists p.\mathbb D \sqsubseteq A.
$$

Apply Rule 3:

$$
A \sqcap \exists p.\top \sqsubseteq X_2,
$$

$$
\exists p.X_2 \sqsubseteq X_1.
$$

The second is ENF. The first still has a complex conjunct.

**Step 4 — Name the complex right conjunct in $A \sqcap \exists p.\top \sqsubseteq X_2$.**

Apply Rule 2r:

$$
\exists p.\top \sqsubseteq X_3,
$$

$$
A \sqcap X_3 \sqsubseteq X_2.
$$

Both are ENF.

**Step 5 — Start with the second original axiom.**

The second axiom is:

$$
B \sqcap \exists r.A \sqsubseteq \exists p.(B \sqcap C).
$$

Both sides are complex, so apply Rule 1:

$$
B \sqcap \exists r.A \sqsubseteq X_4,
$$

$$
X_4 \sqsubseteq \exists p.(B \sqcap C).
$$

**Step 6 — Name the complex right conjunct on the left.**

For:

$$
B \sqcap \exists r.A \sqsubseteq X_4,
$$

apply Rule 2r:

$$
\exists r.A \sqsubseteq X_5,
$$

$$
B \sqcap X_5 \sqsubseteq X_4.
$$

Both are ENF.

**Step 7 — Handle the complex existential on the right.**

For:

$$
X_4 \sqsubseteq \exists p.(B \sqcap C),
$$

apply Rule 4:

$$
X_6 \sqsubseteq B \sqcap C,
$$

$$
X_4 \sqsubseteq \exists p.X_6.
$$

The second is ENF. The first needs Rule 5.

**Step 8 — Split $X_6 \sqsubseteq B \sqcap C$.**

Apply Rule 5:

$$
X_6 \sqsubseteq B,
$$

$$
X_6 \sqsubseteq C.
$$

**Step 9 — Collect the final ENF TBox.**

Dropping intermediate non-ENF axioms, one transformed ENF TBox is:

$$
\mathcal T' = \{
X_1 \sqsubseteq B,
X_1 \sqsubseteq C,
\exists p.X_2 \sqsubseteq X_1,
A \sqcap X_3 \sqsubseteq X_2,
\exists p.\top \sqsubseteq X_3,
$$

$$
B \sqcap X_5 \sqsubseteq X_4,
\exists r.A \sqsubseteq X_5,
X_4 \sqsubseteq \exists p.X_6,
X_6 \sqsubseteq B,
X_6 \sqsubseteq C
\}.
$$

**Answer:** $\mathcal T'$ above is an ENF transformation of $\mathcal T$ and is a conservative extension of $\mathcal T$.

---

## Q24. Classification saturation on a TBox-only mini example

Let the ENF TBox be:

$$
\mathcal T = \{A \sqsubseteq B,\; B \sqsubseteq C,\; A \sqsubseteq D,\; C \sqcap D \sqsubseteq E\}.
$$

Run the class-subsumption part of the classification algorithm and derive all non-trivial consequences involving $A$.

### Solution — Q24

**Step 1 — Initialise reflexive and top axioms.**

For every class name $X$ occurring in the KB, add:

$$
X \sqsubseteq X,
$$

and:

$$
X \sqsubseteq \top.
$$

For this question, the important part is that reflexive axioms are present, but the non-trivial consequences involving $A$ come from CR1 and CR2.

**Step 2 — Apply CR1 to the subclass chain.**

We have:

$$
A \sqsubseteq B,
$$

and:

$$
B \sqsubseteq C.
$$

By CR1, add:

$$
A \sqsubseteq C.
$$

**Step 3 — Check whether CR2 applies.**

We now have:

$$
A \sqsubseteq C,
$$

and explicitly:

$$
A \sqsubseteq D.
$$

The TBox also contains:

$$
C \sqcap D \sqsubseteq E.
$$

By CR2, add:

$$
A \sqsubseteq E.
$$

**Step 4 — Collect non-trivial consequences involving $A$.**

Explicit or derived non-trivial subsumptions are:

$$
A \sqsubseteq B,
$$

$$
A \sqsubseteq C,
$$

$$
A \sqsubseteq D,
$$

$$
A \sqsubseteq E.
$$

We usually do not list $A \sqsubseteq A$ and $A \sqsubseteq \top$ as interesting consequences, although the algorithm includes them.

**Answer:** the key inferred hierarchy below $A$ is $A \sqsubseteq B$, $A \sqsubseteq C$, $A \sqsubseteq D$, and $A \sqsubseteq E$.

---

## Q25. Classification saturation with CR3

Let the ENF TBox be:

$$
\mathcal T = \{A \sqsubseteq \exists p.B,\; B \sqsubseteq C,\; C \sqsubseteq D,\; \exists p.D \sqsubseteq E\}.
$$

Derive $A \sqsubseteq E$ using the classification rules.

### Solution — Q25

**Step 1 — Derive the needed filler subsumption.**

CR3 needs a chain:

$$
A \sqsubseteq \exists p.A_1,
$$

$$
A_1 \sqsubseteq B_1,
$$

$$
\exists p.B_1 \sqsubseteq B.
$$

We already have:

$$
A \sqsubseteq \exists p.B.
$$

We need $B \sqsubseteq D$ because the existential-left axiom is:

$$
\exists p.D \sqsubseteq E.
$$

From:

$$
B \sqsubseteq C
$$

and:

$$
C \sqsubseteq D,
$$

CR1 adds:

$$
B \sqsubseteq D.
$$

**Step 2 — Apply CR3.**

Now match:

$$
A \sqsubseteq \exists p.B,
$$

$$
B \sqsubseteq D,
$$

$$
\exists p.D \sqsubseteq E.
$$

By CR3, add:

$$
A \sqsubseteq E.
$$

**Step 3 — State the entailment.**

The algorithm only adds sound consequences, so:

$$
\mathcal T \models A \sqsubseteq E.
$$

**Answer:** $A \sqsubseteq E$ is derived by CR1 followed by CR3.

---

## Q26. Classification with ABox and several rule types

Let the ENF KB contain:

TBox:

$$
Student \sqsubseteq Person,
$$

$$
Course \sqsubseteq Activity,
$$

$$
\exists attends.Activity \sqsubseteq Participant,
$$

$$
Person \sqcap Participant \sqsubseteq EngagedPerson.
$$

ABox:

$$
ali:Student,
$$

$$
(ali,c1):attends,
$$

$$
c1:Course.
$$

Derive $ali:EngagedPerson$.

### Solution — Q26

**Step 1 — Derive $ali:Person$ using CR4.**

From:

$$
ali:Student
$$

and:

$$
Student \sqsubseteq Person,
$$

CR4 adds:

$$
ali:Person.
$$

**Step 2 — Derive $c1:Activity$ using CR4.**

From:

$$
c1:Course
$$

and:

$$
Course \sqsubseteq Activity,
$$

CR4 adds:

$$
c1:Activity.
$$

**Step 3 — Derive $ali:Participant$ using CR6.**

We have:

$$
(ali,c1):attends,
$$

$$
c1:Activity,
$$

and:

$$
\exists attends.Activity \sqsubseteq Participant.
$$

By CR6, add:

$$
ali:Participant.
$$

**Step 4 — Derive $ali:EngagedPerson$ using CR5.**

Now we have:

$$
ali:Person,
$$

$$
ali:Participant,
$$

and:

$$
Person \sqcap Participant \sqsubseteq EngagedPerson.
$$

By CR5, add:

$$
ali:EngagedPerson.
$$

**Answer:** $ali:EngagedPerson$ is derived by CR4, CR4, CR6, then CR5.

---

## Q27. Instance retrieval: return all individuals of a class

Let the ENF KB contain:

TBox:

$$
A \sqsubseteq B,
$$

$$
B \sqcap C \sqsubseteq D,
$$

$$
\exists p.E \sqsubseteq D.
$$

ABox:

$$
a:A,
$$

$$
a:C,
$$

$$
b:B,
$$

$$
(b,e):p,
$$

$$
e:E,
$$

$$
f:C.
$$

Retrieve all individuals $x$ such that:

$$
\mathcal K \models x:D.
$$

### Solution — Q27

**Step 1 — Identify explicit $D$ assertions.**

There are no explicit assertions of the form $x:D$.

**Step 2 — Use CR4 to derive $a:B$.**

From:

$$
a:A
$$

and:

$$
A \sqsubseteq B,
$$

CR4 adds:

$$
a:B.
$$

**Step 3 — Use CR5 to derive $a:D$.**

Now we have:

$$
a:B,
$$

$$
a:C,
$$

and:

$$
B \sqcap C \sqsubseteq D.
$$

By CR5, add:

$$
a:D.
$$

**Step 4 — Use CR6 to derive $b:D$.**

We have:

$$
(b,e):p,
$$

$$
e:E,
$$

and:

$$
\exists p.E \sqsubseteq D.
$$

By CR6, add:

$$
b:D.
$$

**Step 5 — Check whether $f:D$ follows.**

We only know:

$$
f:C.
$$

There is no $f:B$, no suitable property edge, and no axiom $C \sqsubseteq D$.

So $f:D$ is not derived by the complete algorithm for atomic assertions.

**Answer:** the retrieved individuals are:

$$
\{a,b\}.
$$

---

# Section E — Hard edge cases and precision traps

This is the highest-value section. These are the places where the method looks obvious but the wrong detail breaks the answer.

---

## Q28. Conservative extension vs exact equivalence

Consider the original axiom:

$$
A \sqsubseteq \exists p.(B \sqcap C).
$$

A normalisation step introduces fresh $X$ and replaces it with:

$$
A \sqsubseteq \exists p.X,
$$

$$
X \sqsubseteq B \sqcap C.
$$

Explain why this is not exact equivalence over the same interpretations, but is still acceptable as a conservative extension.

### Solution — Q28

**Step 1 — Identify the fresh name problem.**

The original axiom uses only the names:

$$
A, B, C, p.
$$

The transformed KB uses a new class name:

$$
X.
$$

An interpretation of the original vocabulary does not already assign a meaning to $X$.

So the original axiom and the transformed pair cannot be exactly equivalent over the same interpretations, because the transformed pair talks about a symbol that was not present before.

**Step 2 — Show why exact equivalence is too strong.**

Suppose $\mathcal I$ is a model of the original axiom. It tells us:

$$
A^\mathcal I \subseteq (\exists p.(B \sqcap C))^\mathcal I.
$$

But it says nothing about $X^\mathcal I$, because $X$ did not exist in the original vocabulary.

Therefore we cannot demand that the same interpretation already satisfy:

$$
A \sqsubseteq \exists p.X
$$

and:

$$
X \sqsubseteq B \sqcap C.
$$

**Step 3 — State the conservative-extension idea.**

The transformed KB is acceptable because every model of the original KB can be **extended** by choosing an interpretation for $X$.

For this rule, a natural choice is:

$$
X^\mathcal I = (B \sqcap C)^\mathcal I.
$$

Then:

$$
X^\mathcal I \subseteq (B \sqcap C)^\mathcal I
$$

is true, and:

$$
A^\mathcal I \subseteq (\exists p.X)^\mathcal I
$$

is true because $X$ was chosen to be exactly the filler class.

**Step 4 — State what is preserved.**

The transformation preserves entailments over the original vocabulary. That is the reason conservative extension is enough.

**Answer:** it is not exact equivalence because the transformed KB contains a fresh class name with no fixed meaning in the original interpretation. It is acceptable because models of the original KB can be extended by interpreting the fresh name appropriately, and original-vocabulary entailments are preserved.

---

## Q29. Rule 3 vs Rule 4 direction trap

Two students normalise these axioms:

1. $\exists p.(B \sqcap C) \sqsubseteq A$
2. $A \sqsubseteq \exists p.(B \sqcap C)$

Student 1 uses $B \sqcap C \sqsubseteq X$ in both cases.

Student 2 uses:

- $B \sqcap C \sqsubseteq X$ for case 1,
- $X \sqsubseteq B \sqcap C$ for case 2.

Who is correct, and why?

### Solution — Q29

**Step 1 — Identify the two relevant transformation rules.**

Case 1 has a complex existential on the left:

$$
\exists p.\mathbb D \sqsubseteq A.
$$

This uses Rule 3:

$$
\mathbb D \sqsubseteq X,
\quad
\exists p.X \sqsubseteq A.
$$

Case 2 has a complex existential on the right:

$$
A \sqsubseteq \exists p.\mathbb D.
$$

This uses Rule 4:

$$
X \sqsubseteq \mathbb D,
\quad
A \sqsubseteq \exists p.X.
$$

**Step 2 — Apply Rule 3 to case 1.**

For:

$$
\exists p.(B \sqcap C) \sqsubseteq A,
$$

Rule 3 gives:

$$
B \sqcap C \sqsubseteq X,
$$

$$
\exists p.X \sqsubseteq A.
$$

**Step 3 — Apply Rule 4 to case 2.**

For:

$$
A \sqsubseteq \exists p.(B \sqcap C),
$$

Rule 4 gives:

$$
X \sqsubseteq B \sqcap C,
$$

$$
A \sqsubseteq \exists p.X.
$$

**Step 4 — Explain why the direction differs.**

For a complex existential on the left, the fresh name must be broad enough to include every instance of the original filler. So we use:

$$
\mathbb D \sqsubseteq X.
$$

For a complex existential on the right, the fresh name must be narrow enough to guarantee the required filler condition. So we use:

$$
X \sqsubseteq \mathbb D.
$$

**Answer:** Student 2 is correct. The direction of the fresh-name axiom intentionally differs between Rule 3 and Rule 4.

---

## Q30. Original-vocabulary trap after ENF transformation

Let $\mathcal K'$ be an ENF transformation of $\mathcal K$ that introduces a fresh class name $X$.

A student says:

> Since $\mathcal K'$ is a conservative extension of $\mathcal K$, any entailment involving $X$ is also an entailment of $\mathcal K$.

Is this correct?

### Solution — Q30

**Step 1 — Recall the entailment-preservation corollary.**

If $\mathcal K'$ is a transformation of $\mathcal K$, then for any axiom $\alpha$ using only names from the original $\mathcal K$:

$$
\mathcal K \models \alpha
\quad\text{iff}\quad
\mathcal K' \models \alpha.
$$

**Step 2 — Check the vocabulary condition.**

The axiom in the student’s claim involves $X$.

But $X$ is fresh. It was introduced during normalisation and is not part of the original vocabulary of $\mathcal K$.

**Step 3 — State the consequence.**

The preservation guarantee does not apply to axioms involving $X$.

$\mathcal K'$ may entail things about $X$ because $X$ was introduced as an auxiliary name, but those are not automatically meaningful consequences of the original KB.

**Answer:** no. Conservative extension preserves entailments over the original vocabulary only. Entailments involving fresh auxiliary names are not automatically entailments of the original KB.

---

## Q31. One-pass classification trap

Let the ENF TBox be:

$$
\mathcal T = \{A \sqsubseteq B,\; B \sqsubseteq C,\; A \sqsubseteq D,\; C \sqcap D \sqsubseteq E,\; E \sqsubseteq F\}.
$$

A student applies each rule once from top to bottom and stops after deriving $A \sqsubseteq C$. Explain what they miss and why saturation is required.

### Solution — Q31

**Step 1 — Apply CR1 to the subclass chain.**

From:

$$
A \sqsubseteq B
$$

and:

$$
B \sqsubseteq C,
$$

CR1 adds:

$$
A \sqsubseteq C.
$$

**Step 2 — Notice that the new axiom enables CR2.**

After deriving $A \sqsubseteq C$, we now have:

$$
A \sqsubseteq C,
$$

and already:

$$
A \sqsubseteq D.
$$

Together with:

$$
C \sqcap D \sqsubseteq E,
$$

CR2 adds:

$$
A \sqsubseteq E.
$$

**Step 3 — Notice that the new axiom enables CR1 again.**

Now we have:

$$
A \sqsubseteq E
$$

and:

$$
E \sqsubseteq F.
$$

CR1 adds:

$$
A \sqsubseteq F.
$$

**Step 4 — Explain the algorithmic point.**

The classification algorithm does not apply each rule once. It applies rules until no rule can add anything new. Later consequences can make earlier rules applicable again.

**Answer:** the student misses $A \sqsubseteq E$ and $A \sqsubseteq F$. Saturation is required because newly derived axioms can trigger more rule applications.

---

## Q32. “Subset” precision trap for GCIs

A student says:

> $C \sqsubseteq D$ means $C$ is a subset of $D$.

Rewrite this correctly and explain what the precise semantic condition is.

### Solution — Q32

**Step 1 — Identify the imprecision.**

$C$ and $D$ are class expressions, not literal sets by themselves.

So saying “$C$ is a subset of $D$” is sloppy unless we explicitly talk about their extensions under an interpretation.

**Step 2 — State the correct semantic reading.**

An interpretation $\mathcal I$ satisfies:

$$
C \sqsubseteq D
$$

iff:

$$
C^\mathcal I \subseteq D^\mathcal I.
$$

So the precise reading is:

> In every relevant interpretation/model, the extension of $C$ is a subset of the extension of $D$.

**Step 3 — Connect this to entailment.**

For a KB $\mathcal K$:

$$
\mathcal K \models C \sqsubseteq D
$$

means every model $\mathcal I$ of $\mathcal K$ satisfies:

$$
C^\mathcal I \subseteq D^\mathcal I.
$$

**Answer:** do not say the syntactic expression $C$ is literally a subset of $D$. Say that under an interpretation, $C^\mathcal I$ is a subset of $D^\mathcal I$; under entailment, this holds in every model of the KB.

---

## Q33. Domain versus range trap

Plain $\mathcal{EL}$ can express:

$$
\exists p.\top \sqsubseteq A.
$$

A student claims this says the range of $p$ is $A$. Is that correct?

### Solution — Q33

**Step 1 — Translate the axiom semantically.**

The class expression:

$$
\exists p.\top
$$

means things that have some $p$-successor.

So:

$$
\exists p.\top \sqsubseteq A
$$

means:

> anything that has some outgoing $p$-edge is an $A$.

**Step 2 — Identify whether this constrains sources or targets.**

The expression $\exists p.\top$ collects the **sources** of $p$-edges.

If $(x,y) \in p^\mathcal I$, then $x$ is in $(\exists p.\top)^\mathcal I$.

The axiom therefore says $x \in A^\mathcal I$.

**Step 3 — State the domain/range distinction.**

This is a domain-style statement: it constrains the domain/source of $p$.

A range statement would constrain the target $y$ of every $p$-edge. Plain $\mathcal{EL}$ cannot express general property range axioms.

**Answer:** no. $\exists p.\top \sqsubseteq A$ expresses a domain condition for $p$, not a range condition.

---

## Q34. Expressivity decision: plain $\mathcal{EL}$, $\mathcal{EL}^{++}$, or neither?

For each modelling requirement, decide whether it is expressible in plain $\mathcal{EL}$, requires $\mathcal{EL}^{++}$, or is not supported because it needs full disjunction/negation.

1. Every $A$ is a $B$.
2. Anything with some $p$-successor is an $A$.
3. $A$ and $B$ are disjoint.
4. $p$ is transitive.
5. Every $p$-successor must be a $B$.
6. Every $A$ is either a $B$ or a $C$.
7. $A$ is equivalent to $B \sqcap \exists p.C$.

### Solution — Q34

**Step 1 — Recall plain $\mathcal{EL}$ capabilities.**

Plain $\mathcal{EL}$ supports:

- class names,
- $\top$,
- conjunction,
- existential restrictions,
- GCIs,
- class assertions,
- property assertions.

It can express subclass axioms, domain-style axioms, and equivalences as pairs of GCIs.

**Step 2 — Recall listed $\mathcal{EL}^{++}$ extensions.**

$\mathcal{EL}^{++}$ adds support for features such as:

- disjointness,
- property ranges,
- property hierarchies,
- transitive properties,
- nominals/individuals as classes,

while still avoiding full disjunction and full negation.

**Step 3 — Classify each requirement.**

1. “Every $A$ is a $B$” is $A \sqsubseteq B$. Plain $\mathcal{EL}$.
2. “Anything with some $p$-successor is an $A$” is $\exists p.\top \sqsubseteq A$. Plain $\mathcal{EL}$.
3. “$A$ and $B$ are disjoint” needs disjointness, expressible in $\mathcal{EL}^{++}$ but not plain $\mathcal{EL}$.
4. “$p$ is transitive” needs transitive properties, supported by $\mathcal{EL}^{++}$ but not plain $\mathcal{EL}$.
5. “Every $p$-successor must be a $B$” is a range-style condition, supported by $\mathcal{EL}^{++}$ but not plain $\mathcal{EL}$.
6. “Every $A$ is either a $B$ or a $C$” needs full disjunction on the right, so it is not supported in plain $\mathcal{EL}$ or $\mathcal{EL}^{++}$ as full disjunction.
7. $A \equiv B \sqcap \exists p.C$ can be written as two GCIs using allowed constructors, so plain $\mathcal{EL}$.

**Answer:**

| Requirement | Classification |
|---|---|
| 1 | Plain $\mathcal{EL}$ |
| 2 | Plain $\mathcal{EL}$ |
| 3 | $\mathcal{EL}^{++}$ |
| 4 | $\mathcal{EL}^{++}$ |
| 5 | $\mathcal{EL}^{++}$ |
| 6 | Neither, because it needs full disjunction |
| 7 | Plain $\mathcal{EL}$ |

---

## Q35. Why full disjunction is avoided

Explain, using a small reasoning pattern, why adding full disjunction tends to introduce branching and why the lecture connects this to worse complexity.

### Solution — Q35

**Step 1 — State what full disjunction would allow.**

Full disjunction would allow axioms or class expressions such as:

$$
A \sqsubseteq B \sqcup C.
$$

This means every $A$ must be either a $B$ or a $C$.

**Step 2 — Explain the reasoning problem.**

If we know:

$$
a:A,
$$

and:

$$
A \sqsubseteq B \sqcup C,
$$

then a reasoner has to consider two cases:

1. $a:B$,
2. $a:C$.

The current information may not decide which case is true.

**Step 3 — Explain branching.**

With one disjunction, there are two branches. With many independent disjunctions, the number of combinations can grow exponentially.

This is unlike the $\mathcal{EL}$ consequence rules, which add deterministic consequences until saturation.

**Step 4 — Connect to the lecture’s design point.**

$\mathcal{EL}$ and $\mathcal{EL}^{++}$ restrict expressivity to preserve polynomial-time reasoning. Full disjunction is avoided because reasoning by cases tends to cause branching.

**Answer:** full disjunction forces case splits. Repeated case splits can create exponentially many branches, which is why $\mathcal{EL}^{++}$ avoids full disjunction while preserving polynomial reasoning.

---

## Q36. Mixed exam task: normalise, classify, and retrieve

Consider the KB:

TBox:

$$
Student \sqsubseteq Person,
$$

$$
Person \sqcap \exists attends.(Course \sqcap Online) \sqsubseteq RemoteLearner,
$$

$$
RemoteLearner \sqsubseteq Learner.
$$

ABox:

$$
sam:Student,
$$

$$
(sam,c2):attends,
$$

$$
c2:Course,
$$

$$
c2:Online.
$$

Tasks:

1. Transform the non-ENF TBox axiom into ENF.
2. Derive whether $sam:RemoteLearner$ is entailed.
3. Derive whether $sam:Learner$ is entailed.

### Solution — Q36

**Step 1 — Identify the non-ENF axiom.**

The problematic axiom is:

$$
Person \sqcap \exists attends.(Course \sqcap Online) \sqsubseteq RemoteLearner.
$$

The left-hand side is a conjunction whose right conjunct is a complex existential.

**Step 2 — Apply Rule 2r to name the complex conjunct.**

Use fresh $X_1$:

$$
\exists attends.(Course \sqcap Online) \sqsubseteq X_1,
$$

$$
Person \sqcap X_1 \sqsubseteq RemoteLearner.
$$

The second axiom is ENF. The first still has a complex filler.

**Step 3 — Apply Rule 3 to the complex existential on the left.**

For:

$$
\exists attends.(Course \sqcap Online) \sqsubseteq X_1,
$$

Rule 3 gives a fresh $X_2$:

$$
Course \sqcap Online \sqsubseteq X_2,
$$

$$
\exists attends.X_2 \sqsubseteq X_1.
$$

Both are ENF because $Course \sqcap Online \sqsubseteq X_2$ is an allowed left-conjunction axiom.

So the ENF TBox is:

$$
Student \sqsubseteq Person,
$$

$$
Course \sqcap Online \sqsubseteq X_2,
$$

$$
\exists attends.X_2 \sqsubseteq X_1,
$$

$$
Person \sqcap X_1 \sqsubseteq RemoteLearner,
$$

$$
RemoteLearner \sqsubseteq Learner.
$$

**Step 4 — Derive $sam:Person$ using CR4.**

From:

$$
sam:Student
$$

and:

$$
Student \sqsubseteq Person,
$$

CR4 adds:

$$
sam:Person.
$$

**Step 5 — Derive $c2:X_2$ using CR5.**

We have:

$$
c2:Course,
$$

$$
c2:Online,
$$

and:

$$
Course \sqcap Online \sqsubseteq X_2.
$$

By CR5, add:

$$
c2:X_2.
$$

**Step 6 — Derive $sam:X_1$ using CR6.**

We have:

$$
(sam,c2):attends,
$$

$$
c2:X_2,
$$

and:

$$
\exists attends.X_2 \sqsubseteq X_1.
$$

By CR6, add:

$$
sam:X_1.
$$

**Step 7 — Derive $sam:RemoteLearner$ using CR5.**

We have:

$$
sam:Person,
$$

$$
sam:X_1,
$$

and:

$$
Person \sqcap X_1 \sqsubseteq RemoteLearner.
$$

By CR5, add:

$$
sam:RemoteLearner.
$$

So:

$$
\mathcal K \models sam:RemoteLearner.
$$

**Step 8 — Derive $sam:Learner$ using CR4.**

From:

$$
sam:RemoteLearner
$$

and:

$$
RemoteLearner \sqsubseteq Learner,
$$

CR4 adds:

$$
sam:Learner.
$$

So:

$$
\mathcal K \models sam:Learner.
$$

**Answer:** after normalisation and saturation, both $sam:RemoteLearner$ and $sam:Learner$ are entailed.

---

# Final self-test checklist

Before an exam or coursework task, check that you can do these without looking:

1. Compute $(C \sqcap D)^\mathcal I$ by set intersection.
2. Compute $(\exists p.C)^\mathcal I$ by following $p$-arrows to targets in $C^\mathcal I$.
3. Check a GCI by subset of extensions.
4. Check class and property assertions by interpreting individual names.
5. Distinguish modelhood from entailment.
6. Produce a countermodel for a failed entailment.
7. Recognise all six ENF axiom forms.
8. Apply ENF Rules 1, 2l/2r, 3, 4, 5, and 6.
9. Remember that Rule 3 and Rule 4 use opposite fresh-name directions.
10. Remember that ENF transformation preserves entailments only over the original vocabulary.
11. Initialise classification with $A \sqsubseteq A$ and $A \sqsubseteq \top$.
12. Apply CR1–CR6 until saturation, not once only.
13. Retrieve instances by deriving all entailed atomic class assertions.
14. Explain why $\mathcal{EL}$ classification is polynomial.
15. Decide whether a modelling requirement needs plain $\mathcal{EL}$, $\mathcal{EL}^{++}$, or full disjunction/negation.
