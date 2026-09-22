---
subject: COMP64602
chapter: 72
title: "Week 2 — Extra Exercises"
language: en
---

# Week 2 — Statistical Schema Induction: Extra Exercise Set

A second layer on top of chapter 52, focused on association-rule arithmetic, the Apriori pruning principle, and mapping mined rules onto OWL 2 axioms.

## Exercise types

1. **Support and confidence computation** from a transaction table.
2. **Apriori candidate generation and pruning.**
3. **Transaction-table construction** from RDF triples.
4. **Rule-to-axiom translation** — mined rule to OWL 2 axiom.
5. **Critique** — why a high-confidence rule may still be a bad axiom.

---

# Section A — Association rule arithmetic

## E1. Compute support and confidence

Transactions over items $\{A, B, C\}$:

| TID | Items |
|---|---|
| 1 | $A, B$ |
| 2 | $A, B, C$ |
| 3 | $A, C$ |
| 4 | $B, C$ |
| 5 | $A, B$ |

Compute support of $\{A,B\}$, and confidence of $A \Rightarrow B$ and of $B \Rightarrow A$.

### Solution

**Step 1: Recall the definitions.** For a rule $X \Rightarrow Y$ over $N$ transactions:
$$\mathrm{supp}(X) = \frac{|\{t : X \subseteq t\}|}{N}, \qquad \mathrm{conf}(X \Rightarrow Y) = \frac{\mathrm{supp}(X \cup Y)}{\mathrm{supp}(X)}.$$

**Step 2: Count occurrences.** $N = 5$.
- $A$ appears in transactions 1, 2, 3, 5 → count 4.
- $B$ appears in 1, 2, 4, 5 → count 4.
- $\{A,B\}$ appears in 1, 2, 5 → count 3.

**Step 3: Support of $\{A,B\}$.**
$$\mathrm{supp}(\{A,B\}) = 3/5 = 0.6.$$

**Step 4: Confidence of $A \Rightarrow B$.**
$$\mathrm{conf} = \frac{\mathrm{supp}(\{A,B\})}{\mathrm{supp}(\{A\})} = \frac{3/5}{4/5} = \frac{3}{4} = 0.75.$$

**Step 5: Confidence of $B \Rightarrow A$.**
$$\mathrm{conf} = \frac{\mathrm{supp}(\{A,B\})}{\mathrm{supp}(\{B\})} = \frac{3/5}{4/5} = 0.75.$$

**Step 6: Note the asymmetry in general.** Here the two coincide only because $A$ and $B$ have equal support. Confidence is **not** symmetric: the denominator is the antecedent's support. Compute $\mathrm{conf}(C \Rightarrow A) = \frac{2/5}{3/5} = 0.67$ against $\mathrm{conf}(A \Rightarrow C) = \frac{2/5}{4/5} = 0.5$ to see them differ.

---

## E2. Apriori pruning

With minimum support $0.4$ (i.e. count $\ge 2$ of $5$), run Apriori on the E1 data through to 3-itemsets.

### Solution

**Step 1: $L_1$ — frequent 1-itemsets.** Counts: $A = 4$, $B = 4$, $C = 3$. All $\ge 2$, so
$$L_1 = \{\{A\}, \{B\}, \{C\}\}.$$

**Step 2: $C_2$ — candidates by joining $L_1$.** $\{A,B\}, \{A,C\}, \{B,C\}$.

**Step 3: Count and prune to $L_2$.**
- $\{A,B\}$: transactions 1, 2, 5 → 3 ✓
- $\{A,C\}$: transactions 2, 3 → 2 ✓
- $\{B,C\}$: transactions 2, 4 → 2 ✓

$$L_2 = \{\{A,B\}, \{A,C\}, \{B,C\}\}.$$

**Step 4: $C_3$ — join and check subsets.** Joining gives the single candidate $\{A,B,C\}$. Apriori requires **all** its 2-subsets to be in $L_2$: $\{A,B\}$ ✓, $\{A,C\}$ ✓, $\{B,C\}$ ✓. So it survives pruning and must be counted.

**Step 5: Count $\{A,B,C\}$.** Only transaction 2 contains all three → count 1 < 2 ✗.
$$L_3 = \emptyset.$$

**Step 6: Terminate.** With $L_3$ empty, no 4-itemsets can be frequent, so the algorithm stops.

**Step 7: State the pruning principle.** The **downward-closure** (anti-monotonicity) property: every subset of a frequent itemset is frequent. Equivalently, if any subset is infrequent, the superset cannot be frequent and need not be counted. This is what makes Apriori tractable — it avoids counting the exponentially many itemsets whose subsets already failed.

---

## E3. Where pruning actually saves work

Suppose $\{B,C\}$ had count 1 instead. Show what Apriori then skips.

### Solution

**Step 1: Revised $L_2$.** $\{B,C\}$ falls below threshold, so
$$L_2 = \{\{A,B\}, \{A,C\}\}.$$

**Step 2: Generate $C_3$.** Joining $\{A,B\}$ and $\{A,C\}$ on their shared prefix $A$ gives the candidate $\{A,B,C\}$.

**Step 3: Apply the subset test.** The 2-subsets of $\{A,B,C\}$ are $\{A,B\}$ ✓, $\{A,C\}$ ✓, and $\{B,C\}$ ✗ — not in $L_2$.

**Step 4: Prune without counting.** Because one subset is infrequent, $\{A,B,C\}$ **cannot** be frequent. Apriori discards it **without a database pass**.

**Step 5: Quantify the saving.** The saving is one full scan for this candidate; on real data with thousands of items the pruned space is exponentially large, and this test is the difference between feasible and infeasible.

**Step 6: Note the correctness argument.** Pruning is **sound**: by downward closure, no genuinely frequent itemset is ever discarded. So Apriori's output is exactly the set of frequent itemsets, not an approximation.

---

# Section B — From triples to axioms

## E4. Build a transaction table for subclass induction

From these triples, construct the transaction table used to mine $\mathsf{subClassOf}$ axioms.

```
:a rdf:type :Cat    :a rdf:type :Animal
:b rdf:type :Cat    :b rdf:type :Animal
:c rdf:type :Dog    :c rdf:type :Animal
:d rdf:type :Animal
```

Then compute $\mathrm{conf}(\mathsf{Cat} \Rightarrow \mathsf{Animal})$ and $\mathrm{conf}(\mathsf{Animal} \Rightarrow \mathsf{Cat})$.

### Solution

**Step 1: Choose transactions and items.** For class-subsumption mining, each **individual** is a transaction and its **classes** are the items.

**Step 2: Tabulate.**

| Individual (TID) | Items (classes) |
|---|---|
| `:a` | Cat, Animal |
| `:b` | Cat, Animal |
| `:c` | Dog, Animal |
| `:d` | Animal |

**Step 3: Count.** $N = 4$. Cat: 2. Dog: 1. Animal: 4. $\{$Cat, Animal$\}$: 2.

**Step 4: $\mathrm{conf}(\mathsf{Cat} \Rightarrow \mathsf{Animal})$.**
$$\frac{\mathrm{supp}(\{\mathsf{Cat},\mathsf{Animal}\})}{\mathrm{supp}(\{\mathsf{Cat}\})} = \frac{2/4}{2/4} = 1.0.$$

**Step 5: $\mathrm{conf}(\mathsf{Animal} \Rightarrow \mathsf{Cat})$.**
$$\frac{2/4}{4/4} = 0.5.$$

**Step 6: Interpret.** Confidence $1.0$ means every observed Cat is an Animal, supporting the axiom
$$\mathsf{Cat} \sqsubseteq \mathsf{Animal}.$$
The reverse at $0.5$ does not support $\mathsf{Animal} \sqsubseteq \mathsf{Cat}$ — correctly, since dogs are animals too. The **direction** of the rule maps onto the direction of the subsumption, which is why confidence's asymmetry (E1, Step 6) is essential rather than incidental.

---

## E5. Existential restriction columns

Explain how a transaction table column is built to mine an axiom of the form $C \sqsubseteq \exists p.D$, using

```
:a :hasPart :w1    :w1 rdf:type :Wing    :a rdf:type :Bird
:b :hasPart :l1    :l1 rdf:type :Leg     :b rdf:type :Bird
```

### Solution

**Step 1: State the target axiom shape.** $\mathsf{Bird} \sqsubseteq \exists\mathsf{hasPart}.\mathsf{Wing}$ — every bird has some part that is a wing.

**Step 2: Define the column.** The item is not a class but the **compound** $\exists\mathsf{hasPart}.\mathsf{Wing}$. An individual $x$ gets a 1 in that column iff there **exists** $y$ with `x :hasPart y` and `y rdf:type :Wing`.

**Step 3: Evaluate per individual.**
- `:a` — part `:w1`, which is a Wing ✓ → 1
- `:b` — part `:l1`, a Leg, not a Wing ✗ → 0

**Step 4: Tabulate.**

| TID | Bird | $\exists\mathsf{hasPart}.\mathsf{Wing}$ | $\exists\mathsf{hasPart}.\mathsf{Leg}$ |
|---|---|---|---|
| `:a` | 1 | 1 | 0 |
| `:b` | 1 | 0 | 1 |

**Step 5: Compute.** $\mathrm{conf}(\mathsf{Bird} \Rightarrow \exists\mathsf{hasPart}.\mathsf{Wing}) = \frac{1/2}{2/2} = 0.5$ — too low to accept the axiom on this data.

**Step 6: State the general procedure.** One column per **candidate class expression**, not merely per class name. This is how SSI reaches beyond flat subsumption into OWL 2 axioms with restrictions: the expressiveness of the mined axioms is determined by which compound columns you are willing to construct. The cost is that the column space grows quickly with the property and class vocabulary.

---

## E6. Why high confidence is not enough

A mined rule has confidence $1.0$ and support $0.002$. Explain why accepting it as an OWL 2 axiom may be wrong, and give three checks.

### Solution

**Step 1: Decode the numbers.** Confidence $1.0$: on every individual where the antecedent held, the consequent held too. Support $0.002$: the antecedent held for only $0.2\%$ of individuals — perhaps a handful.

**Step 2: State the statistical objection.** With a tiny antecedent set, confidence $1.0$ is weak evidence. If only three individuals are Cats and all three are Animals, confidence is $1.0$ on a sample of three — easily coincidence.

**Step 3: State the open-world objection.** RDF data is **incomplete** under the open-world assumption. Absence of a counterexample is not evidence of absence; the counterexample may simply be unrecorded. Confidence measures the data, and the data is a partial view.

**Step 4: State the consequence of a wrong axiom.** An OWL axiom is a **universal** claim used deductively. A spurious $C \sqsubseteq D$ will infer $D$ for *every* future $C$, propagating error into all downstream reasoning — potentially making the ontology inconsistent when combined with disjointness axioms.

**Step 5: Give three checks.**
- **Minimum support threshold** alongside confidence, so rules resting on tiny samples are rejected outright.
- **A correlation-aware measure** such as **lift**, $\mathrm{lift}(X \Rightarrow Y) = \mathrm{conf}(X \Rightarrow Y) / \mathrm{supp}(Y)$. If $Y$ is nearly universal, confidence is high for trivial reasons; lift near $1$ reveals independence.
- **Consistency checking with a reasoner** after adding candidate axioms, plus expert review — since the aim is a *correct* ontology, not merely a data-fitting one.

**Step 6: State the framing.** SSI is **induction**: it generalises from instances and is therefore fallible, unlike the **deduction** performed over the resulting ontology. Mined axioms are hypotheses requiring validation, and treating them as conclusions is the central methodological risk of the approach.
