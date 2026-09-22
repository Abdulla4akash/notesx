---
subject: COMP64602
chapter: 77
title: "Week 7 — Extra Exercises"
language: en
---

# Week 7 — Structured Argumentation and Evaluation: Extra Exercise Set

A second layer on top of chapter 57, focused on constructing arguments from a knowledge base, distinguishing attack from defeat, and computing extensions of an abstract argumentation framework.

## Exercise types

1. **Argument construction** from premises and rules.
2. **Attack classification** — rebut, undercut, undermine.
3. **Attack versus defeat** — apply preferences.
4. **Extension computation** — conflict-free, admissible, complete, grounded, preferred, stable.
5. **Graph reasoning** on argumentation frameworks.

---

# Section A — Constructing and attacking arguments

## E1. Build arguments from a knowledge base

Given strict facts $\{a, b\}$ and defeasible rules $r_1 : a \Rightarrow c$, $r_2 : b \Rightarrow \neg c$, $r_3 : c \Rightarrow d$, enumerate the arguments.

### Solution

**Step 1: Base arguments from the facts.** Each premise standing alone is an argument:
$$A_1 = [a], \qquad A_2 = [b].$$

**Step 2: One rule application each.**
$$A_3 = [A_1 \Rightarrow c] \quad \text{(via } r_1\text{)}, \qquad A_4 = [A_2 \Rightarrow \neg c] \quad \text{(via } r_2\text{)}.$$

**Step 3: Chain onto $A_3$.**
$$A_5 = [A_3 \Rightarrow d] \quad \text{(via } r_3\text{)}.$$

**Step 4: Check for further arguments.** No rule has $\neg c$ or $d$ as antecedent, so nothing extends $A_4$ or $A_5$. Five arguments in total.

**Step 5: Identify conclusions and sub-arguments.** Conclusions: $A_1 : a$, $A_2 : b$, $A_3 : c$, $A_4 : \neg c$, $A_5 : d$. Note $A_1$ is a **sub-argument** of $A_3$, and both $A_1$ and $A_3$ are sub-arguments of $A_5$.

**Step 6: State why sub-arguments matter.** An attack on a sub-argument attacks the whole argument built on it. So $A_5$ is vulnerable wherever $A_3$ is — which is what makes the tree structure, not just the conclusion, part of the argument's identity.

---

## E2. Classify the attacks

Using the arguments from E1, identify every attack and classify each as rebutting, undercutting, or undermining.

### Solution

**Step 1: Recall the three kinds.**
- **Rebut** — attack an argument's **conclusion** with the opposite conclusion (only on defeasible steps).
- **Undercut** — attack the **applicability of a rule** itself, rather than its conclusion.
- **Undermine** — attack a **premise** of the argument.

**Step 2: Find the rebuttals on $c$.** $A_3$ concludes $c$ and $A_4$ concludes $\neg c$, both by defeasible rules. So
$$A_3 \text{ rebuts } A_4 \quad\text{and}\quad A_4 \text{ rebuts } A_3$$
— a **symmetric** attack, since neither rule is privileged.

**Step 3: Find attacks on $A_5$.** $A_5$ has $A_3$ as a sub-argument, so any attack on $A_3$ attacks $A_5$. Hence
$$A_4 \text{ attacks } A_5$$
by rebutting its sub-argument $A_3$ — sometimes distinguished as an attack on a proper sub-conclusion.

**Step 4: Check the direction back.** Does $A_5$ attack $A_4$? $A_5$'s conclusion is $d$, which does not contradict $\neg c$. But $A_5$ **contains** $A_3$, which rebuts $A_4$. So $A_5$ attacks $A_4$ via its sub-argument.

**Step 5: Note the absences.** There is no **undercutting** here, because no rule has a named applicability condition to attack. There is no **undermining**, because $a$ and $b$ are **strict facts** — strict premises cannot be undermined.

**Step 6: Draw the attack graph.**
$$A_3 \leftrightarrow A_4, \qquad A_5 \leftrightarrow A_4$$
with $A_1, A_2$ unattacked.

---

## E3. Attack versus defeat

Add the preference $r_2 > r_1$ (rule $r_2$ is stronger). Recompute which attacks are **defeats**, and give the resulting framework.

### Solution

**Step 1: State the distinction.** **Attack** is a structural relation from the logic. **Defeat** is attack that **succeeds** once preferences are taken into account. Only defeats appear in the abstract framework used for evaluation.

**Step 2: Apply the preference to the symmetric rebuttal.** $A_3$ uses $r_1$; $A_4$ uses $r_2$; and $r_2 > r_1$. So:
- $A_4$'s attack on $A_3$ **succeeds** → $A_4$ defeats $A_3$.
- $A_3$'s attack on $A_4$ **fails** → $A_3$ does **not** defeat $A_4$.

The symmetric attack becomes an **asymmetric defeat**.

**Step 3: Propagate to $A_5$.** $A_5$ is built on $A_3$, so $A_4$ defeats $A_5$ too. And since $A_5$'s attack on $A_4$ runs through $A_3$, whose attack fails, $A_5$ does not defeat $A_4$.

**Step 4: State the defeat graph.**
$$A_4 \to A_3, \qquad A_4 \to A_5$$
with $A_1, A_2, A_4$ undefeated.

**Step 5: Evaluate.** $A_4$ is unattacked, so it is in every extension; it defeats $A_3$ and $A_5$, and nothing defends them. The grounded extension is $\{A_1, A_2, A_4\}$, so the justified conclusions are $a$, $b$, $\neg c$ — and $d$ is **not** justified.

**Step 6: State the lesson.** Preferences convert symmetric conflict into a determinate outcome. Without them, $\{A_1,A_2,A_3,A_5\}$ and $\{A_1,A_2,A_4\}$ would both be preferred extensions and the dispute would be unresolved. This is the structured-argumentation counterpart of prioritised defaults in week 5.

---

# Section B — Abstract argumentation semantics

## E4. Compute extensions of a framework

For $\mathcal{AF} = (\{A, B, C\},\ \{(A,B), (B,C)\})$ — $A$ attacks $B$, $B$ attacks $C$ — compute the conflict-free sets, then the grounded, preferred, and stable extensions.

### Solution

**Step 1: Conflict-free sets.** A set is conflict-free if no member attacks another.
$$\emptyset,\ \{A\},\ \{B\},\ \{C\},\ \{A, C\}$$
($\{A,B\}$ and $\{B,C\}$ contain an attack; $\{A,B,C\}$ likewise.)

**Step 2: Compute the grounded extension by iterating the characteristic function.**
- Unattacked arguments: $A$ (nothing attacks $A$). Start with $\{A\}$.
- $\{A\}$ defends $C$: $C$'s only attacker is $B$, and $A$ attacks $B$. So add $C$.
- $\{A, C\}$ defends nothing new; $B$ is attacked by $A \in$ the set, so $B$ cannot be added.

$$\text{Grounded} = \{A, C\}.$$

**Step 3: Check admissibility of $\{A,C\}$.** Conflict-free ✓. Defends $A$ (unattacked) ✓ and $C$ (attacker $B$ is attacked by $A$) ✓. Admissible ✓.

**Step 4: Preferred extensions** — maximal admissible sets. Is $\{A,C\}$ maximal? Adding $B$ breaks conflict-freeness. So
$$\text{Preferred} = \{\{A, C\}\}.$$

**Step 5: Stable extensions** — conflict-free sets attacking every argument outside them. Test $\{A,C\}$: the only outsider is $B$, and $A$ attacks $B$ ✓.
$$\text{Stable} = \{\{A, C\}\}.$$

**Step 6: Note the coincidence and why.** All three semantics agree here because the framework is **acyclic**. For acyclic frameworks the grounded extension is the unique complete extension, and it is stable. Disagreement between semantics arises from **cycles** (E5).

**Step 7: Read the reinstatement.** $C$ is attacked by $B$ yet accepted, because $A$ defeats $B$. $C$ is **reinstated** — the same phenomenon as E6 of chapter 76.

---

## E5. A framework where semantics disagree

For $\mathcal{AF} = (\{A, B\},\ \{(A,B), (B,A)\})$ — a two-cycle — compute the grounded, preferred, and stable extensions, and explain the divergence.

### Solution

**Step 1: Conflict-free sets.** $\emptyset$, $\{A\}$, $\{B\}$. Not $\{A,B\}$, since each attacks the other.

**Step 2: Grounded extension.** Start from the unattacked arguments — there are **none**, since $A$ and $B$ attack each other. The iteration begins and ends at
$$\text{Grounded} = \emptyset.$$
The grounded semantics is maximally **sceptical**: with no undisputed starting point, it commits to nothing.

**Step 3: Admissible sets.** $\emptyset$ ✓ trivially. $\{A\}$: conflict-free ✓, and it defends $A$ because $A$'s attacker $B$ is attacked by $A$ itself ✓ — admissible. Symmetrically $\{B\}$ ✓.

**Step 4: Preferred extensions** — maximal admissible. Both $\{A\}$ and $\{B\}$ are maximal (neither can be extended).
$$\text{Preferred} = \{\{A\}, \{B\}\}.$$

**Step 5: Stable extensions.** $\{A\}$: the outsider $B$ is attacked by $A$ ✓ stable. $\{B\}$: likewise ✓.
$$\text{Stable} = \{\{A\}, \{B\}\}.$$
$\emptyset$ is not stable — it attacks nothing, yet $A$ and $B$ lie outside.

**Step 6: Explain the divergence.** The **even-length cycle** creates two symmetric coherent positions. Grounded reports the intersection-like sceptical answer ($\emptyset$); preferred and stable report both positions as alternatives.

**Step 7: Relate to the reasoning stances.** Under **sceptical** acceptance (in all preferred extensions), neither $A$ nor $B$ is accepted. Under **credulous** acceptance (in some preferred extension), both are. This is structurally the same choice as cautious versus choice semantics for default logic's multiple extensions in week 5 — the Nixon diamond reappearing in abstract form.

**Step 8: Note the odd-cycle contrast.** For a three-cycle $A \to B \to C \to A$, the grounded extension is again $\emptyset$, the only preferred extension is $\emptyset$, and there is **no stable extension at all** — the standard example showing stable semantics can fail to exist, which is why it is not always the semantics of choice.
