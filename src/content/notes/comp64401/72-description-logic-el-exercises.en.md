---
subject: COMP64401
chapter: 72
title: "Description Logic EL — Extra Exercises"
language: en
---

# Description Logic $\mathcal{EL}$ — Extra Exercise Set

A second layer of problems on top of chapter 52, concentrating on interpretation construction, checking axiom satisfaction, and refuting entailments by building a counter-model — the steps that carry the marks.

**Prerequisite.** $\mathcal{EL}$ classes are built from class names, $\top$, conjunction $C \sqcap D$, and existential restriction $\exists p.C$. An interpretation is $\mathcal{I} = (\Delta^{\mathcal{I}}, \cdot^{\mathcal{I}})$ with a non-empty domain, each class name mapped to a subset of $\Delta^{\mathcal{I}}$, each property name to a binary relation on $\Delta^{\mathcal{I}}$, and each individual name to a domain element.

## Exercise types

1. **Extension computation** — compute $C^{\mathcal{I}}$ for a compound class.
2. **Interpretation construction** — build $\mathcal{I}$ meeting stated conditions.
3. **Axiom checking** — decide whether $\mathcal{I}$ satisfies a GCI or an assertion.
4. **Model checking** — decide whether $\mathcal{I}$ is a model of a knowledge base.
5. **Entailment refutation** — refute $\mathcal{K} \models \alpha$ by exhibiting a counter-model.
6. **Modelling** — express English as $\mathcal{EL}$ axioms and identify what $\mathcal{EL}$ cannot say.

---

# Section A — Semantics of class expressions

## E1. Compute extensions

Let $\Delta^{\mathcal{I}} = \{a, b, c, d\}$ with
$$\mathsf{Cold}^{\mathcal{I}} = \{a, c\}, \quad \mathsf{Wet}^{\mathcal{I}} = \{c, d\}, \quad \mathsf{next}^{\mathcal{I}} = \{(a,b), (b,c), (c,c), (d,a)\}.$$

Compute (a) $(\mathsf{Cold} \sqcap \mathsf{Wet})^{\mathcal{I}}$, (b) $(\exists \mathsf{next}.\mathsf{Cold})^{\mathcal{I}}$, (c) $(\exists \mathsf{next}.(\mathsf{Cold} \sqcap \mathsf{Wet}))^{\mathcal{I}}$, (d) $(\exists \mathsf{next}.\top)^{\mathcal{I}}$.

### Solution

**Step 1: (a) Conjunction is intersection.**
$$(\mathsf{Cold} \sqcap \mathsf{Wet})^{\mathcal{I}} = \{a,c\} \cap \{c,d\} = \{c\}.$$

**Step 2: (b) Recall the rule for $\exists$.**
$$(\exists p.C)^{\mathcal{I}} = \{x \in \Delta^{\mathcal{I}} \mid \exists y.\, (x,y) \in p^{\mathcal{I}} \text{ and } y \in C^{\mathcal{I}}\}.$$
So we need elements with **at least one** `next`-successor that is Cold. Successors: $a \mapsto b$ ($b \notin \mathsf{Cold}^{\mathcal{I}}$); $b \mapsto c$ ($c \in$ ✓); $c \mapsto c$ (✓); $d \mapsto a$ ($a \in$ ✓).
$$(\exists \mathsf{next}.\mathsf{Cold})^{\mathcal{I}} = \{b, c, d\}.$$

**Step 3: (c) Use the result of (a).** We need a successor lying in $\{c\}$. From Step 2's successor list, those whose successor is $c$ are $b$ and $c$.
$$(\exists \mathsf{next}.(\mathsf{Cold} \sqcap \mathsf{Wet}))^{\mathcal{I}} = \{b, c\}.$$

**Step 4: (d) $\top$ denotes the whole domain,** so $\exists \mathsf{next}.\top$ collects everything with **any** successor. Each of $a,b,c,d$ has one.
$$(\exists \mathsf{next}.\top)^{\mathcal{I}} = \{a,b,c,d\} = \Delta^{\mathcal{I}}.$$

**Step 5: Note two traps.** $\exists$ requires *some* successor, never *all* — and an element with **no** successor is never in $(\exists p.C)^{\mathcal{I}}$, whatever $C$ is. Had $\mathsf{next}^{\mathcal{I}}$ omitted $d$, then $d \notin (\exists\mathsf{next}.\top)^{\mathcal{I}}$.

---

## E2. Build an interpretation to order

Construct $\mathcal{I}$ with $|\Delta^{\mathcal{I}}| = 3$ in which $(\exists \mathsf{hasPart}.\mathsf{Metal})^{\mathcal{I}}$ has exactly two elements and $\mathsf{Metal}^{\mathcal{I}}$ has exactly one.

### Solution

**Step 1: Fix the domain.** $\Delta^{\mathcal{I}} = \{x, y, z\}$.

**Step 2: Place the single Metal element.** Let $\mathsf{Metal}^{\mathcal{I}} = \{z\}$.

**Step 3: Decide who must satisfy the restriction.** We need exactly two elements with a `hasPart`-successor in $\{z\}$. Choose $x$ and $y$.

**Step 4: Supply the relation.** $\mathsf{hasPart}^{\mathcal{I}} = \{(x,z), (y,z)\}$.

**Step 5: Verify.**
- $x$: successor $z \in \mathsf{Metal}^{\mathcal{I}}$ ✓
- $y$: successor $z \in \mathsf{Metal}^{\mathcal{I}}$ ✓
- $z$: has **no** `hasPart`-successor, so $z \notin (\exists\mathsf{hasPart}.\mathsf{Metal})^{\mathcal{I}}$ ✓

Hence $(\exists\mathsf{hasPart}.\mathsf{Metal})^{\mathcal{I}} = \{x,y\}$, size 2 ✓, and $|\mathsf{Metal}^{\mathcal{I}}| = 1$ ✓.

**Step 6: Note a subtlety.** Nothing forbade a self-loop or making $z$ metal *and* having a metal part; the construction above is simply the least cluttered witness. Any interpretation meeting the two counts is a correct answer — say so when the question asks only for existence.

---

## E3. Nested existentials

With $\Delta^{\mathcal{I}} = \{1,2,3\}$, $p^{\mathcal{I}} = \{(1,2),(2,3)\}$, $A^{\mathcal{I}} = \{3\}$, compute $(\exists p.\exists p.A)^{\mathcal{I}}$.

### Solution

**Step 1: Work inside out.** First compute $(\exists p.A)^{\mathcal{I}}$: elements with a $p$-successor in $A^{\mathcal{I}} = \{3\}$. Successors: $1 \mapsto 2$ (no), $2 \mapsto 3$ (yes), $3$ has none.
$$(\exists p.A)^{\mathcal{I}} = \{2\}.$$

**Step 2: Now the outer restriction.** Elements with a $p$-successor in $\{2\}$: $1 \mapsto 2$ ✓; $2 \mapsto 3 \notin \{2\}$; $3$ has no successor.
$$(\exists p.\exists p.A)^{\mathcal{I}} = \{1\}.$$

**Step 3: Read the meaning.** $1$ is the start of a $p$-chain of length two ending in $A$: $1 \to 2 \to 3$ with $3 \in A^{\mathcal{I}}$.

**Step 4: Generalise.** $\exists p.\exists p.\cdots \exists p.A$ with $n$ nestings picks out the elements starting a $p$-path of length $n$ whose endpoint is in $A$. This is why $\mathcal{EL}$ can describe chains but, having no transitive closure, cannot say "reachable by *some* number of steps."

---

# Section B — Axioms, knowledge bases, models

## E4. Check GCI satisfaction

With $\Delta^{\mathcal{I}} = \{a,b\}$, $\mathsf{Bird}^{\mathcal{I}} = \{a,b\}$, $\mathsf{Wing}^{\mathcal{I}} = \{b\}$, $\mathsf{hasPart}^{\mathcal{I}} = \{(a,b)\}$, does $\mathcal{I}$ satisfy $\mathsf{Bird} \sqsubseteq \exists\mathsf{hasPart}.\mathsf{Wing}$?

### Solution

**Step 1: State the satisfaction condition.** $\mathcal{I} \models C \sqsubseteq D$ iff $C^{\mathcal{I}} \subseteq D^{\mathcal{I}}$.

**Step 2: Compute the right-hand extension.** Elements with a `hasPart`-successor in $\mathsf{Wing}^{\mathcal{I}} = \{b\}$: $a \mapsto b$ ✓; $b$ has no `hasPart`-successor ✗.
$$(\exists\mathsf{hasPart}.\mathsf{Wing})^{\mathcal{I}} = \{a\}.$$

**Step 3: Test the inclusion.** Is $\mathsf{Bird}^{\mathcal{I}} = \{a,b\} \subseteq \{a\}$? **No** — $b$ is a counterexample: $b$ is a Bird but has no Wing part.

**Step 4: Conclude.** $\mathcal{I} \not\models \mathsf{Bird} \sqsubseteq \exists\mathsf{hasPart}.\mathsf{Wing}$.

**Step 5: Repair it minimally.** Add a successor for $b$ that is a Wing. Setting $\mathsf{hasPart}^{\mathcal{I}} = \{(a,b), (b,b)\}$ makes $b$'s successor $b \in \mathsf{Wing}^{\mathcal{I}}$, so the extension becomes $\{a,b\}$ and the GCI holds. (Odd as a *modelling* choice — a wing being its own part — but $\mathcal{EL}$ imposes no such constraint, which is itself the point.)

---

## E5. Is $\mathcal{I}$ a model of the knowledge base?

$\mathcal{K}$ has TBox $\{\, \mathsf{Cat} \sqsubseteq \mathsf{Animal},\;\; \mathsf{Animal} \sqsubseteq \exists\mathsf{eats}.\top \,\}$ and ABox $\{\, \mathsf{Cat}(\mathsf{tom}),\;\; \mathsf{eats}(\mathsf{tom}, \mathsf{fish}) \,\}$.

Let $\Delta^{\mathcal{I}} = \{t, f\}$, $\mathsf{tom}^{\mathcal{I}} = t$, $\mathsf{fish}^{\mathcal{I}} = f$, $\mathsf{Cat}^{\mathcal{I}} = \{t\}$, $\mathsf{Animal}^{\mathcal{I}} = \{t\}$, $\mathsf{eats}^{\mathcal{I}} = \{(t,f)\}$. Is $\mathcal{I} \models \mathcal{K}$?

### Solution

**Step 1: State the requirement.** $\mathcal{I} \models \mathcal{K}$ iff $\mathcal{I}$ satisfies **every** axiom of both the TBox and the ABox.

**Step 2: TBox axiom 1.** $\mathsf{Cat}^{\mathcal{I}} = \{t\} \subseteq \mathsf{Animal}^{\mathcal{I}} = \{t\}$ ✓.

**Step 3: TBox axiom 2.** Compute $(\exists\mathsf{eats}.\top)^{\mathcal{I}}$ — elements with any `eats`-successor. $t \mapsto f$ ✓; $f$ has none. So the extension is $\{t\}$. Then $\mathsf{Animal}^{\mathcal{I}} = \{t\} \subseteq \{t\}$ ✓.

**Step 4: ABox assertion 1.** $\mathcal{I} \models \mathsf{Cat}(\mathsf{tom})$ iff $\mathsf{tom}^{\mathcal{I}} \in \mathsf{Cat}^{\mathcal{I}}$, i.e. $t \in \{t\}$ ✓.

**Step 5: ABox assertion 2.** $\mathcal{I} \models \mathsf{eats}(\mathsf{tom},\mathsf{fish})$ iff $(\mathsf{tom}^{\mathcal{I}}, \mathsf{fish}^{\mathcal{I}}) = (t,f) \in \mathsf{eats}^{\mathcal{I}}$ ✓.

**Step 6: Conclude.** All four axioms are satisfied, so $\mathcal{I} \models \mathcal{K}$ — $\mathcal{I}$ is a model, and $\mathcal{K}$ is therefore **consistent**.

**Step 7: Note the near-miss.** Had $f$ been in $\mathsf{Animal}^{\mathcal{I}}$, axiom 2 would require $f$ to have an `eats`-successor, which it lacks — so $\mathcal{I}$ would fail. Adding an element to a class can **force** relational structure through the TBox; that propagation is the essence of $\mathcal{EL}$ reasoning.

---

## E6. Refute an entailment with a counter-model

Let $\mathcal{K} = \{\, A \sqsubseteq \exists p.B \,\}$. Does $\mathcal{K} \models A \sqsubseteq \exists p.(B \sqcap C)$? Prove or refute.

### Solution

**Step 1: State the test.** $\mathcal{K} \models \alpha$ iff **every** model of $\mathcal{K}$ satisfies $\alpha$. To refute, build one interpretation that models $\mathcal{K}$ but not $\alpha$.

**Step 2: Design the counter-model.** Give $A$ an inhabitant with a $p$-successor in $B$ but keep $C$ empty, so the successor cannot also be in $C$.

**Step 3: Specify it.**
$$\Delta^{\mathcal{I}} = \{x,y\},\quad A^{\mathcal{I}} = \{x\},\quad B^{\mathcal{I}} = \{y\},\quad C^{\mathcal{I}} = \emptyset,\quad p^{\mathcal{I}} = \{(x,y)\}.$$

**Step 4: Verify $\mathcal{I} \models \mathcal{K}$.** $(\exists p.B)^{\mathcal{I}} = \{x\}$ since $x \mapsto y \in B^{\mathcal{I}}$. So $A^{\mathcal{I}} = \{x\} \subseteq \{x\}$ ✓.

**Step 5: Verify $\mathcal{I} \not\models \alpha$.** $(B \sqcap C)^{\mathcal{I}} = \{y\} \cap \emptyset = \emptyset$, so $(\exists p.(B \sqcap C))^{\mathcal{I}} = \emptyset$. But $A^{\mathcal{I}} = \{x\} \not\subseteq \emptyset$ ✗.

**Step 6: Conclude.** $\mathcal{I}$ is a model of $\mathcal{K}$ that falsifies $\alpha$, so
$$\mathcal{K} \not\models A \sqsubseteq \exists p.(B \sqcap C).$$

**Step 7: State the method.** Refuting an entailment never requires reasoning about all models — **one** explicit counter-model suffices, and the smaller the better. Build it by satisfying every axiom while deliberately breaking the claim.

---

# Section C — Modelling and expressiveness

## E7. Translate into $\mathcal{EL}$

Express in $\mathcal{EL}$: (a) every parent is a person with a child who is a person; (b) a grandparent is someone with a child who has a child; (c) `alice` is a parent whose child is `bob`.

### Solution

**Step 1: (a).** Two consequences, so two GCIs — or one with a conjunction on the right:
$$\mathsf{Parent} \sqsubseteq \mathsf{Person} \sqcap \exists\mathsf{hasChild}.\mathsf{Person}.$$

**Step 2: (b).** Nest the restriction:
$$\mathsf{Grandparent} \sqsubseteq \exists\mathsf{hasChild}.\exists\mathsf{hasChild}.\top.$$

Using $\top$ because "has a child" places no further condition on the grandchild. If the intent were that the grandchild be a Person, use $\exists\mathsf{hasChild}.\mathsf{Person}$ in place of $\top$.

**Step 3: (c).** ABox assertions:
$$\mathsf{Parent}(\mathsf{alice}), \qquad \mathsf{hasChild}(\mathsf{alice}, \mathsf{bob}).$$

**Step 4: Note the direction of the GCIs.** $C \sqsubseteq D$ reads "every $C$ is a $D$" — a **necessary** condition on $C$, not a definition. Writing $\mathsf{Person} \sqcap \exists\mathsf{hasChild}.\mathsf{Person} \sqsubseteq \mathsf{Parent}$ states the converse (sufficiency), which is a different claim. Only asserting both makes it a definition.

---

## E8. What $\mathcal{EL}$ cannot express

Explain why none of these is expressible in $\mathcal{EL}$ as defined, and name the missing constructor: (a) nothing is both hot and cold; (b) every bird has *only* feathered parts; (c) a thing is safe if it is not moving.

### Solution

**Step 1: (a).** Requires asserting an empty intersection — $\mathsf{Hot} \sqcap \mathsf{Cold} \sqsubseteq \bot$. $\mathcal{EL}$ as given has $\top$ but **no $\bot$** (and no negation), so disjointness cannot be stated. Missing: $\bot$ or negation.

**Step 2: (b).** "Only" is a **universal** restriction, $\forall\mathsf{hasPart}.\mathsf{Feathered}$. $\mathcal{EL}$ provides only $\exists$. Missing: value restriction $\forall p.C$.

**Step 3: (c).** Requires negation ($\neg\mathsf{Moving}$) on the left of the inclusion. $\mathcal{EL}$ has no negation. Missing: complement.

**Step 4: State why the restriction is deliberate.** These omissions are what keep $\mathcal{EL}$ **tractable** — reasoning is polynomial, which is why it underpins large biomedical ontologies. Adding negation and universal restrictions gives more expressive logics at higher complexity. Expressiveness is traded against reasoning cost by design, not by oversight.

**Step 5: Note the practical consequence.** Because $\mathcal{EL}$ lacks $\bot$, an $\mathcal{EL}$ knowledge base of the form given here is **always consistent** — you cannot write a contradiction. So "is $\mathcal{K}$ consistent?" is trivial here, and the interesting task is **subsumption**: does $\mathcal{K} \models C \sqsubseteq D$?

---

## E9. Why the domain must be non-empty

Show that permitting $\Delta^{\mathcal{I}} = \emptyset$ would trivialise every GCI, and relate this to E8's consistency observation.

### Solution

**Step 1: Suppose $\Delta^{\mathcal{I}} = \emptyset$.** Every class name maps to a subset of $\emptyset$, hence to $\emptyset$; every property maps to a relation on $\emptyset$, hence to $\emptyset$.

**Step 2: Evaluate a compound class.** By induction, every class expression has extension $\emptyset$: intersections of empty sets are empty, and $(\exists p.C)^{\mathcal{I}}$ requires an element with a successor, of which there are none. Also $\top^{\mathcal{I}} = \Delta^{\mathcal{I}} = \emptyset$.

**Step 3: Evaluate an arbitrary GCI.** $\mathcal{I} \models C \sqsubseteq D$ iff $C^{\mathcal{I}} \subseteq D^{\mathcal{I}}$, which becomes $\emptyset \subseteq \emptyset$ — **true**, for every $C$ and $D$.

**Step 4: Draw the consequence.** The empty interpretation would satisfy every TBox whatsoever, so every TBox would be consistent for an uninteresting reason, and it would appear as a model in every entailment check. Requiring $\Delta^{\mathcal{I}} \neq \emptyset$ excludes this degenerate case.

**Step 5: Note what ABoxes add.** With individual names, an ABox forces inhabitants anyway: each individual must denote some element of $\Delta^{\mathcal{I}}$, so a non-empty ABox cannot be modelled by an empty domain regardless.

**Step 6: Relate to E8.** $\mathcal{EL}$ without $\bot$ is *already* always consistent, so non-emptiness is not what makes consistency interesting — it is a well-formedness condition ensuring that satisfaction is not vacuous, and it matters as soon as $\bot$ or negation is added to the language.
