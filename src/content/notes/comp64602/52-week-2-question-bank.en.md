---
subject: COMP64602
chapter: 52
title: "Week 2 — Question Bank"
language: en
---

# COMP64602 Week 2 — Worked Practice Question Bank

_Source lecture sheet read from the uploaded `.mht` file: **COMP64602 Chapter 2 - Week 2**._

This bank drills the computational/procedural task types actually present in the sheet. Solutions follow each question so you can cover the solution section and self-test.

## Task types identified from the sheet

The sheet contains these examinable task types:

1. Compute association-rule support and confidence.
2. Use the Apriori property to generate/prune candidate itemsets.
3. Generate association rules from a frequent itemset.
4. Convert RDF triples into SSI transaction tables.
5. Fill columns for named concepts, conjunctions, existential restrictions, inverse existential restrictions, role inclusion, and role-composition-style tables.
6. Convert mined association rules into OWL 2 schema axioms.
7. Ground/instantiate Horn rules by replacing variables with constants.
8. Check whether Horn rules are connected, closed, and within the maximum body length.
9. Compute Horn-rule support, head coverage, standard confidence, and PCA confidence.
10. Apply CWA vs PCA when facts are missing.
11. Trace AMIE-style rule acceptance, refinement, pruning, and parent-rule comparison.

Not drilled as a numerical task: detailed Markov Logic Networks. The sheet only gives a summary-level MLN introduction and explicitly says the detailed transcript segment was missing.

---

# Section A — Mechanical / single-step calculations

## Q1. Association-rule confidence using the sheet’s supermarket example

A transaction database contains:

- `Support({Milk, Bread}) = 100`
- `Support({Milk, Bread, Butter}) = 90`

Compute the confidence of:


$$

\{Milk, Bread\} \Rightarrow \{Butter\}

$$


### Solution

**Step 1: Identify the antecedent and consequent.**

The antecedent is:


$$

X = \{Milk, Bread\}

$$


The consequent is:


$$

Y = \{Butter\}

$$


**Step 2: Use the association-rule confidence formula.**


$$

Confidence(X \Rightarrow Y)
=
\frac{Support(X \cup Y)}{Support(X)}

$$


**Step 3: Substitute the given counts.**


$$

Confidence(\{Milk, Bread\} \Rightarrow \{Butter\})
=
\frac{Support(\{Milk, Bread, Butter\})}{Support(\{Milk, Bread\})}
=
\frac{90}{100}

$$


**Step 4: Compute the value.**


$$

\frac{90}{100}=0.9

$$


**Answer:**


$$

Confidence = 0.9

$$


So among transactions containing both milk and bread, 90% also contain butter.

---

## Q2. Association-rule support and confidence from raw transactions

Given the transaction database:

| Transaction | Items |
|---|---|
| $t_1$ | $\{A,B,C\}$ |
| $t_2$ | $\{A,B\}$ |
| $t_3$ | $\{A,C\}$ |
| $t_4$ | $\{B,C\}$ |
| $t_5$ | $\{A,B,C\}$ |

Compute the support and confidence of:


$$

\{A,B\} \Rightarrow \{C\}

$$


### Solution

**Step 1: Identify the antecedent and consequent.**


$$

X=\{A,B\}, \qquad Y=\{C\}

$$


**Step 2: Count transactions containing the antecedent $X$.**

Transactions containing both $A$ and $B$:

- $t_1 = \{A,B,C\}$
- $t_2 = \{A,B\}$
- $t_5 = \{A,B,C\}$

So:


$$

Support(\{A,B\})=3

$$


**Step 3: Count transactions containing $X \cup Y$.**


$$

X \cup Y = \{A,B,C\}

$$


Transactions containing $A,B,C$:

- $t_1$
- $t_5$

So:


$$

Support(\{A,B,C\})=2

$$


**Step 4: Compute confidence.**


$$

Confidence(\{A,B\}\Rightarrow\{C\})
=
\frac{Support(\{A,B,C\})}{Support(\{A,B\})}
=
\frac{2}{3}

$$


**Answer:**


$$

Support(\{A,B,C\})=2, \qquad Confidence=\frac{2}{3}\approx 0.667

$$


---

## Q3. Generate all rules from one frequent itemset

A frequent itemset is:


$$

F=\{A,B,C\}

$$


The supports are:

| Itemset | Support |
|---|---:|
| $\{A\}$ | 8 |
| $\{B\}$ | 7 |
| $\{C\}$ | 6 |
| $\{A,B\}$ | 5 |
| $\{A,C\}$ | 4 |
| $\{B,C\}$ | 3 |
| $\{A,B,C\}$ | 3 |

Generate all non-empty association rules from $F$, and compute their confidence.

### Solution

**Step 1: Use the rule-generation pattern.**

For every non-empty proper subset $S \subset F$, generate:


$$

S \Rightarrow F \setminus S

$$


**Step 2: List all non-empty proper subsets.**

The possible antecedents are:


$$

\{A\},\{B\},\{C\},\{A,B\},\{A,C\},\{B,C\}

$$


**Step 3: Apply the confidence formula.**


$$

Confidence(S \Rightarrow F\setminus S)
=
\frac{Support(F)}{Support(S)}

$$


Here:


$$

Support(F)=Support(\{A,B,C\})=3

$$


**Step 4: Compute each rule.**

| Rule | Confidence |
|---|---:|
| $\{A\}\Rightarrow\{B,C\}$ | $3/8=0.375$ |
| $\{B\}\Rightarrow\{A,C\}$ | $3/7\approx0.429$ |
| $\{C\}\Rightarrow\{A,B\}$ | $3/6=0.5$ |
| $\{A,B\}\Rightarrow\{C\}$ | $3/5=0.6$ |
| $\{A,C\}\Rightarrow\{B\}$ | $3/4=0.75$ |
| $\{B,C\}\Rightarrow\{A\}$ | $3/3=1.0$ |

**Answer:** all six rules above are generated from the frequent itemset $\{A,B,C\}$. The strongest one by confidence is:


$$

\{B,C\}\Rightarrow\{A\}

$$


with confidence $1.0$.

---

## Q4. Apriori pruning using the Apriori property

Minimum support is 3.

The frequent 2-itemsets are:


$$

\{A,B\}, \{A,C\}, \{B,C\}, \{B,D\}, \{C,D\}

$$


The itemset $\{A,D\}$ is not frequent.

Candidate 3-itemsets are:


$$

\{A,B,C\}, \{A,B,D\}, \{A,C,D\}, \{B,C,D\}

$$


Use Apriori pruning to decide which candidates survive before scanning the database.

### Solution

**Step 1: State the Apriori property.**

If an itemset is frequent, then all of its subsets must also be frequent.

Equivalently, if a candidate has any infrequent subset, the candidate cannot be frequent.

**Step 2: Check $\{A,B,C\}$.**

Its 2-subsets are:


$$

\{A,B\}, \{A,C\}, \{B,C\}

$$


All three are frequent.

So $\{A,B,C\}$ survives.

**Step 3: Check $\{A,B,D\}$.**

Its 2-subsets are:


$$

\{A,B\}, \{A,D\}, \{B,D\}

$$


But $\{A,D\}$ is not frequent.

So $\{A,B,D\}$ is pruned.

**Step 4: Check $\{A,C,D\}$.**

Its 2-subsets are:


$$

\{A,C\}, \{A,D\}, \{C,D\}

$$


Again, $\{A,D\}$ is not frequent.

So $\{A,C,D\}$ is pruned.

**Step 5: Check $\{B,C,D\}$.**

Its 2-subsets are:


$$

\{B,C\}, \{B,D\}, \{C,D\}

$$


All three are frequent.

So $\{B,C,D\}$ survives.

**Answer:** the surviving candidates are:


$$

\{A,B,C\}, \{B,C,D\}

$$


---

# Section B — SSI transaction tables and OWL axiom construction

## Q5. Build a concept-membership transaction table from RDF type triples

Given these RDF-style type facts:


$$

type(e_1, Student), \quad type(e_1, Person)

$$



$$

type(e_2, Student), \quad type(e_2, Person)

$$



$$

type(e_3, Student)

$$



$$

type(e_4, Person)

$$


Build the concept-membership transaction table for columns `Student` and `Person`. Then compute the confidence of:


$$

\{Student\}\Rightarrow\{Person\}

$$


### Solution

**Step 1: Set rows and columns.**

For simple concept inclusion in SSI:

- rows = instances/entities
- columns = named concepts/classes
- value = 1 iff the entity belongs to that concept

Rows:


$$

e_1,e_2,e_3,e_4

$$


Columns:


$$

Student, Person

$$


**Step 2: Fill the table from the type facts.**

| Entity | Student | Person |
|---|---:|---:|
| $e_1$ | 1 | 1 |
| $e_2$ | 1 | 1 |
| $e_3$ | 1 | 0 |
| $e_4$ | 0 | 1 |

**Step 3: Count antecedent support.**

Entities with `Student = 1`:


$$

e_1,e_2,e_3

$$


So:


$$

Support(\{Student\})=3

$$


**Step 4: Count joint support.**

Entities with both `Student = 1` and `Person = 1`:


$$

e_1,e_2

$$


So:


$$

Support(\{Student,Person\})=2

$$


**Step 5: Compute confidence.**


$$

Confidence(\{Student\}\Rightarrow\{Person\})
=
\frac{2}{3}
\approx 0.667

$$


**Answer:**


$$

Confidence = \frac{2}{3}

$$


If this rule is selected, it corresponds to the schema axiom:


$$

Student \sqsubseteq Person

$$


but with confidence $2/3$, not certainty.

---

## Q6. Fill an existential restriction column

For the SSI column:


$$

\exists hasPet.Cat

$$


use these RDF-style facts:


$$

hasPet(a_1,b_1), \quad type(b_1,Cat)

$$



$$

hasPet(a_2,b_2), \quad type(b_2,Dog)

$$



$$

type(a_3,Person)

$$


Fill the value of the column $\exists hasPet.Cat$ for $a_1,a_2,a_3$.

### Solution

**Step 1: State the rule for existential columns.**

An entity $a$ gets value 1 for:


$$

\exists r.C

$$


iff there exists some entity $b$ such that both facts hold:


$$

r(a,b)

$$


and


$$

type(b,C)

$$


**Step 2: Check $a_1$.**

We have:


$$

hasPet(a_1,b_1)

$$


and:


$$

type(b_1,Cat)

$$


So $a_1$ satisfies $\exists hasPet.Cat$.

Value:


$$

1

$$


**Step 3: Check $a_2$.**

We have:


$$

hasPet(a_2,b_2)

$$


but:


$$

type(b_2,Dog)

$$


not $type(b_2,Cat)$.

So $a_2$ does not satisfy $\exists hasPet.Cat$.

Value:


$$

0

$$


**Step 4: Check $a_3$.**

There is no fact of the form:


$$

hasPet(a_3,b)

$$


with $b$ typed as `Cat`.

Value:


$$

0

$$


**Answer:**

| Entity | $\exists hasPet.Cat$ |
|---|---:|
| $a_1$ | 1 |
| $a_2$ | 0 |
| $a_3$ | 0 |

---

## Q7. Reuse the sheet’s DBpedia-style simple subclass example

In a DBpedia-style transaction table, the only entities marked as `Airport` are `JFK_Airport` and `Newark_Airport`. Both are also marked as `Building`.

Compute support and confidence for:


$$

\{Airport\}\Rightarrow\{Building\}

$$


Then write the corresponding OWL 2 axiom.

### Solution

**Step 1: Identify the antecedent and consequent.**


$$

X=\{Airport\}, \qquad Y=\{Building\}

$$


**Step 2: Count airport instances.**

The airport instances are:


$$

JFK\_Airport, Newark\_Airport

$$


So:


$$

Support(\{Airport\})=2

$$


**Step 3: Count instances that are both airports and buildings.**

Both airport instances are also buildings:


$$

JFK\_Airport, Newark\_Airport

$$


So:


$$

Support(\{Airport,Building\})=2

$$


**Step 4: Compute confidence.**


$$

Confidence(\{Airport\}\Rightarrow\{Building\})
=
\frac{2}{2}
=1.0

$$


**Step 5: Convert the association rule into an OWL 2 schema axiom.**

A concept rule of the form:


$$

\{C_i\}\Rightarrow\{C_j\}

$$


becomes:


$$

C_i \sqsubseteq C_j

$$


So the learned axiom is:


$$

Airport \sqsubseteq Building

$$


**Answer:**


$$

Support=2, \qquad Confidence=1.0, \qquad Airport \sqsubseteq Building

$$


---

## Q8. Conjunction subclass rule: two concepts imply a third concept

Given this concept-membership table:

| Entity | Male | Parent | Father |
|---|---:|---:|---:|
| $e_1$ | 1 | 1 | 1 |
| $e_2$ | 1 | 1 | 1 |
| $e_3$ | 1 | 1 | 0 |
| $e_4$ | 1 | 0 | 0 |
| $e_5$ | 0 | 1 | 0 |

Compute support and confidence for:


$$

\{Male, Parent\}\Rightarrow\{Father\}

$$


Then write the corresponding OWL axiom.

### Solution

**Step 1: Identify the intended axiom pattern.**

A conjunction subclass rule has the association-rule pattern:


$$

\{C_i,C_j\}\Rightarrow\{C_k\}

$$


and maps to:


$$

C_i \sqcap C_j \sqsubseteq C_k

$$


**Step 2: Count entities satisfying the antecedent.**

The antecedent is:


$$

\{Male,Parent\}

$$


Entities with both `Male = 1` and `Parent = 1`:


$$

e_1,e_2,e_3

$$


So:


$$

Support(\{Male,Parent\})=3

$$


**Step 3: Count entities satisfying antecedent and consequent.**

Entities with `Male = 1`, `Parent = 1`, and `Father = 1`:


$$

e_1,e_2

$$


So:


$$

Support(\{Male,Parent,Father\})=2

$$


**Step 4: Compute confidence.**


$$

Confidence(\{Male,Parent\}\Rightarrow\{Father\})
=
\frac{2}{3}

$$


**Step 5: Convert to OWL.**


$$

Male \sqcap Parent \sqsubseteq Father

$$


**Answer:**


$$

Support=2, \qquad Confidence=\frac{2}{3}, \qquad Male \sqcap Parent \sqsubseteq Father

$$


---

## Q9. Named concept subclass of an existential restriction

You are given these facts:


$$

type(c_1,Country), \quad hasLanguage(c_1,l_1), \quad type(l_1,Language)

$$



$$

type(c_2,Country), \quad hasLanguage(c_2,l_2), \quad type(l_2,Language)

$$



$$

type(c_3,Country), \quad hasCapital(c_3,k_1)

$$


Compute the confidence of:


$$

\{Country\}\Rightarrow\{\exists hasLanguage.Language\}

$$


Then write the corresponding OWL axiom.

### Solution

**Step 1: Identify the axiom pattern.**

The association rule:


$$

\{C\}\Rightarrow\{\exists r.D\}

$$


maps to:


$$

C \sqsubseteq \exists r.D

$$


**Step 2: Fill the existential column.**

An entity gets value 1 for:


$$

\exists hasLanguage.Language

$$


iff it has a `hasLanguage` edge to some entity typed as `Language`.

| Entity | Country | $\exists hasLanguage.Language$ |
|---|---:|---:|
| $c_1$ | 1 | 1 |
| $c_2$ | 1 | 1 |
| $c_3$ | 1 | 0 |

**Step 3: Count antecedent support.**

All three entities are countries:


$$

Support(\{Country\})=3

$$


**Step 4: Count joint support.**

Countries satisfying $\exists hasLanguage.Language$:


$$

c_1,c_2

$$


So:


$$

Support(\{Country,\exists hasLanguage.Language\})=2

$$


**Step 5: Compute confidence.**


$$

Confidence
=
\frac{2}{3}

$$


**Step 6: Write the OWL axiom.**


$$

Country \sqsubseteq \exists hasLanguage.Language

$$


**Answer:**


$$

Confidence=\frac{2}{3}, \qquad Country \sqsubseteq \exists hasLanguage.Language

$$


---

## Q10. Distinguish three existential-style SSI columns

Given these facts:


$$

type(Ann,Person), \quad type(Ann,Academic), \quad worksAt(Ann,UniA)

$$



$$

type(Ben,Person), \quad type(Ben,Employee), \quad worksAt(Ben,CoB)

$$



$$

type(UniA,Organization), \quad type(CoB,Organization)

$$


Fill the relevant columns and compute the confidence of these three rules:

1. $\{\exists worksAt.Organization\}\Rightarrow\{Employee\}$
2. $\{\exists worksAt.\top\}\Rightarrow\{Person\}$
3. $\{\exists worksAt^{-1}.\top\}\Rightarrow\{Organization\}$

Then identify the OWL axiom pattern for each.

### Solution

**Step 1: Interpret each column.**

- $\exists worksAt.Organization$: the row entity works at something typed as `Organization`.
- $\exists worksAt.\top$: the row entity has at least one outgoing `worksAt` edge to anything.
- $\exists worksAt^{-1}.\top$: the row entity has at least one incoming `worksAt` edge from anything.

**Step 2: Fill the table.**

| Entity | Employee | Person | Organization | $\exists worksAt.Organization$ | $\exists worksAt.\top$ | $\exists worksAt^{-1}.\top$ |
|---|---:|---:|---:|---:|---:|---:|
| Ann | 0 | 1 | 0 | 1 | 1 | 0 |
| Ben | 1 | 1 | 0 | 1 | 1 | 0 |
| UniA | 0 | 0 | 1 | 0 | 0 | 1 |
| CoB | 0 | 0 | 1 | 0 | 0 | 1 |

**Step 3: Rule 1 — $\exists worksAt.Organization\Rightarrow Employee$.**

Antecedent true for:


$$

Ann, Ben

$$


Among these, `Employee` is true only for:


$$

Ben

$$


So:


$$

Confidence=\frac{1}{2}

$$


Axiom pattern:


$$

\exists r.C \sqsubseteq D

$$


Specific axiom:


$$

\exists worksAt.Organization \sqsubseteq Employee

$$


**Step 4: Rule 2 — $\exists worksAt.\top\Rightarrow Person$.**

Antecedent true for:


$$

Ann, Ben

$$


Both are persons.

So:


$$

Confidence=\frac{2}{2}=1.0

$$


Axiom pattern:


$$

\exists r.\top \sqsubseteq C

$$


Specific axiom:


$$

\exists worksAt.\top \sqsubseteq Person

$$


**Step 5: Rule 3 — $\exists worksAt^{-1}.\top\Rightarrow Organization$.**

Antecedent true for entities with incoming `worksAt` edges:


$$

UniA, CoB

$$


Both are organizations.

So:


$$

Confidence=\frac{2}{2}=1.0

$$


Axiom pattern:


$$

\exists r^{-1}.\top \sqsubseteq C

$$


Specific axiom:


$$

\exists worksAt^{-1}.\top \sqsubseteq Organization

$$


**Answer summary:**

| Rule | Confidence | Axiom pattern |
|---|---:|---|
| $\exists worksAt.Organization\Rightarrow Employee$ | $1/2$ | $\exists r.C\sqsubseteq D$ |
| $\exists worksAt.\top\Rightarrow Person$ | $1.0$ | $\exists r.\top\sqsubseteq C$ |
| $\exists worksAt^{-1}.\top\Rightarrow Organization$ | $1.0$ | $\exists r^{-1}.\top\sqsubseteq C$ |

---

## Q11. Role inclusion using rows of entity pairs

For role inclusion, rows are pairs of entities $(a,b)$. Given this pair table:

| Pair $(a,b)$ | authored | created |
|---|---:|---:|
| $(Ann,Book_1)$ | 1 | 1 |
| $(Ben,Song_1)$ | 0 | 1 |
| $(Carl,Book_2)$ | 1 | 0 |
| $(Dana,Paper_1)$ | 1 | 1 |

Compute support and confidence for:


$$

\{authored\}\Rightarrow\{created\}

$$


Then write the corresponding role-inclusion axiom.

### Solution

**Step 1: Recall the role-inclusion table pattern.**

For role inclusion:

- rows = entity pairs $(a,b)$
- columns = relations that may hold between $a$ and $b$
- value = 1 iff the relation holds for that pair

A rule:


$$

\{r_i\}\Rightarrow\{r_j\}

$$


maps to:


$$

r_i \sqsubseteq r_j

$$


**Step 2: Count pairs satisfying the antecedent.**

Pairs with `authored = 1`:


$$

(Ann,Book_1), (Carl,Book_2), (Dana,Paper_1)

$$


So:


$$

Support(\{authored\})=3

$$


**Step 3: Count pairs satisfying both antecedent and consequent.**

Pairs with both `authored = 1` and `created = 1`:


$$

(Ann,Book_1), (Dana,Paper_1)

$$


So:


$$

Support(\{authored,created\})=2

$$


**Step 4: Compute confidence.**


$$

Confidence(\{authored\}\Rightarrow\{created\})
=
\frac{2}{3}

$$


**Step 5: Convert to role inclusion.**


$$

authored \sqsubseteq created

$$


**Answer:**


$$

Support=2, \qquad Confidence=\frac{2}{3}, \qquad authored \sqsubseteq created

$$


---

## Q12. Role composition: path column implies a direct relation

The sheet’s exact role-composition table is OCR-garbled, but its safe procedure is clear: rows are entity pairs $(a,b)$, and one column can represent whether a composed path exists from $a$ to $b$.

Given these facts:


$$

parentOf(A,B), \quad parentOf(B,C), \quad grandparentOf(A,C)

$$



$$

parentOf(D,E), \quad parentOf(E,F)

$$



$$

parentOf(G,H), \quad parentOf(H,I), \quad grandparentOf(G,I)

$$


For rows $(A,C),(D,F),(G,I)$, fill the column $parentOf \circ parentOf$, then compute confidence for:


$$

\{parentOf \circ parentOf\}\Rightarrow\{grandparentOf\}

$$


### Solution

**Step 1: Interpret the composed-path column.**

For a row $(a,b)$, the column:


$$

parentOf \circ parentOf

$$


gets value 1 iff there exists some intermediate entity $m$ such that:


$$

parentOf(a,m)

$$


and


$$

parentOf(m,b)

$$


**Step 2: Fill the composed-path column.**

- For $(A,C)$, choose $m=B$. We have $parentOf(A,B)$ and $parentOf(B,C)$. Value = 1.
- For $(D,F)$, choose $m=E$. We have $parentOf(D,E)$ and $parentOf(E,F)$. Value = 1.
- For $(G,I)$, choose $m=H$. We have $parentOf(G,H)$ and $parentOf(H,I)$. Value = 1.

| Pair | $parentOf\circ parentOf$ | grandparentOf |
|---|---:|---:|
| $(A,C)$ | 1 | 1 |
| $(D,F)$ | 1 | 0 |
| $(G,I)$ | 1 | 1 |

**Step 3: Count antecedent support.**

The composed path exists for all three rows.


$$

Support(\{parentOf\circ parentOf\})=3

$$


**Step 4: Count joint support.**

Rows where the composed path and direct `grandparentOf` relation both hold:


$$

(A,C),(G,I)

$$


So:


$$

Support(\{parentOf\circ parentOf, grandparentOf\})=2

$$


**Step 5: Compute confidence.**


$$

Confidence
=
\frac{2}{3}

$$


**Step 6: Convert to a role-composition inclusion axiom.**


$$

parentOf \circ parentOf \sqsubseteq grandparentOf

$$


**Answer:**


$$

Confidence=\frac{2}{3}, \qquad parentOf\circ parentOf \sqsubseteq grandparentOf

$$


---

# Section C — Horn rules and rule-quality metrics

## Q13. Ground a Horn rule using constants

Ground the rule:


$$

livesIn(x,y) \land marriedTo(x,z) \Rightarrow livesIn(z,y)

$$


using:


$$

x=Lisa, \qquad y=UK, \qquad z=David

$$


Then write the head as an RDF-style triple.

### Solution

**Step 1: Identify every variable in the rule.**

Variables:


$$

x,y,z

$$


**Step 2: Replace each variable with its constant.**

Use:


$$

x=Lisa, \qquad y=UK, \qquad z=David

$$


**Step 3: Substitute into the body.**

Original body:


$$

livesIn(x,y) \land marriedTo(x,z)

$$


Grounded body:


$$

livesIn(Lisa,UK) \land marriedTo(Lisa,David)

$$


**Step 4: Substitute into the head.**

Original head:


$$

livesIn(z,y)

$$


Grounded head:


$$

livesIn(David,UK)

$$


**Step 5: Write the grounded rule.**


$$

livesIn(Lisa,UK) \land marriedTo(Lisa,David)
\Rightarrow livesIn(David,UK)

$$


**Step 6: Convert the head atom to RDF-style triple notation.**


$$

livesIn(David,UK)

$$


becomes:


$$

\langle David, livesIn, UK\rangle

$$


**Answer:**

Grounded rule:


$$

livesIn(Lisa,UK) \land marriedTo(Lisa,David)
\Rightarrow livesIn(David,UK)

$$


RDF-style head triple:


$$

\langle David, livesIn, UK\rangle

$$


---

## Q14. Check body length, connectedness, and closedness

For the rule:


$$

livesIn(x,y) \land marriedTo(x,z) \Rightarrow livesIn(z,y)

$$


answer:

1. What is the body length?
2. Is the rule connected?
3. Is the rule closed?

### Solution

**Step 1: Count body atoms.**

The body is:


$$

livesIn(x,y) \land marriedTo(x,z)

$$


It contains two atoms:

1. $livesIn(x,y)$
2. $marriedTo(x,z)$

So the body length is:


$$

2

$$


**Step 2: Check connectedness.**

Atoms are connected if they share a variable or constant, directly or transitively.

The body atom $livesIn(x,y)$ shares $x$ with $marriedTo(x,z)$.

The head atom $livesIn(z,y)$ shares:

- $z$ with $marriedTo(x,z)$
- $y$ with $livesIn(x,y)$

So all atoms are in one connected component.

The rule is connected.

**Step 3: Check closedness.**

A variable is closed if it appears at least twice in the whole rule.

Count variable appearances:

| Variable | Occurrences |
|---|---:|
| $x$ | 2: $livesIn(x,y)$, $marriedTo(x,z)$ |
| $y$ | 2: $livesIn(x,y)$, $livesIn(z,y)$ |
| $z$ | 2: $marriedTo(x,z)$, $livesIn(z,y)$ |

All variables appear at least twice.

The rule is closed.

**Answer:**

- Body length = 2
- Connected = yes
- Closed = yes

---

## Q15. Diagnose bad Horn rules

For each rule below, say whether it is disconnected, non-closed, or both.

Rule 1:


$$

diedIn(x,y) \Rightarrow wasBornIn(w,z)

$$


Rule 2:


$$

worksAt(x,y) \Rightarrow locatedIn(y,z)

$$


### Solution

## Rule 1

**Step 1: Check connectedness.**

Body atom:


$$

diedIn(x,y)

$$


Head atom:


$$

wasBornIn(w,z)

$$


The body uses variables $x,y$. The head uses variables $w,z$.

There is no shared variable between body and head.

So Rule 1 is disconnected.

**Step 2: Check closedness.**

Variable counts:

| Variable | Occurrences |
|---|---:|
| $x$ | 1 |
| $y$ | 1 |
| $w$ | 1 |
| $z$ | 1 |

Every variable appears only once.

So Rule 1 is non-closed.

**Rule 1 answer:** disconnected and non-closed.

## Rule 2

**Step 1: Check connectedness.**

Body atom:


$$

worksAt(x,y)

$$


Head atom:


$$

locatedIn(y,z)

$$


The body and head share $y$.

So Rule 2 is connected.

**Step 2: Check closedness.**

Variable counts:

| Variable | Occurrences |
|---|---:|
| $x$ | 1 |
| $y$ | 2 |
| $z$ | 1 |

Variables $x$ and $z$ appear only once.

So Rule 2 is non-closed.

**Rule 2 answer:** connected but non-closed.

---

## Q16. Horn-rule support, head coverage, and standard confidence using the sheet’s mini graph

Given the mini knowledge graph:

`livesIn` facts:


$$

livesIn(Adam,Paris)

$$



$$

livesIn(Adam,Rome)

$$



$$

livesIn(Bob,Zurich)

$$


`wasBornIn` facts:


$$

wasBornIn(Adam,Paris)

$$



$$

wasBornIn(Carl,Rome)

$$


Rule:


$$

R: livesIn(x,y) \Rightarrow wasBornIn(x,y)

$$


Compute:

1. support
2. head coverage
3. standard confidence under CWA

### Solution

**Step 1: List body instantiations.**

The body is:


$$

livesIn(x,y)

$$


The body is true for:


$$

(x,y)=(Adam,Paris)

$$



$$

(x,y)=(Adam,Rome)

$$



$$

(x,y)=(Bob,Zurich)

$$


So there are 3 body instantiations.

**Step 2: Check which body instantiations also have the head fact.**

The head is:


$$

wasBornIn(x,y)

$$


Check each candidate:

| Candidate | Body true? | Head fact exists? | Supported? |
|---|---:|---:|---:|
| $(Adam,Paris)$ | yes | yes | yes |
| $(Adam,Rome)$ | yes | no | no |
| $(Bob,Zurich)$ | yes | no | no |

Only one distinct head pair is supported.

So:


$$

supp(R)=1

$$


**Step 3: Compute head-relation size.**

The head relation is `wasBornIn`.

The graph contains two `wasBornIn` facts:


$$

wasBornIn(Adam,Paris), \quad wasBornIn(Carl,Rome)

$$


So:


$$

size(wasBornIn)=2

$$


**Step 4: Compute head coverage.**


$$

hc(R)=\frac{supp(R)}{size(wasBornIn)}
=
\frac{1}{2}

$$


**Step 5: Compute standard confidence under CWA.**

Standard confidence uses:


$$

conf(R)=\frac{supp(R)}{\#\text{body instantiations}}

$$


There are 3 body instantiations and 1 supported prediction.


$$

conf(R)=\frac{1}{3}

$$


**Answer:**


$$

supp(R)=1, \qquad hc(R)=\frac{1}{2}, \qquad conf(R)=\frac{1}{3}

$$


---

## Q17. PCA confidence using the same mini graph

Use the same graph and rule:


$$

R: livesIn(x,y) \Rightarrow wasBornIn(x,y)

$$


Compute PCA confidence.

### Solution

**Step 1: Recall the PCA denominator rule.**

For a rule:


$$

B \Rightarrow r(x,y)

$$


PCA confidence uses the same numerator as support, but the denominator only counts body candidates $(x,y)$ where the graph has at least one known fact of the form:


$$

r(x,y')

$$


for the same subject $x$.

**Step 2: List body candidates.**

The body candidates are:


$$

(Adam,Paris), \quad (Adam,Rome), \quad (Bob,Zurich)

$$


**Step 3: Check each candidate under PCA.**

Candidate 1:


$$

(Adam,Paris)

$$


The head fact $wasBornIn(Adam,Paris)$ exists. Count it in the denominator and numerator.

Candidate 2:


$$

(Adam,Rome)

$$


The graph contains:


$$

wasBornIn(Adam,Paris)

$$


So for subject Adam and relation `wasBornIn`, PCA assumes the graph knows Adam’s birthplace information. Therefore $wasBornIn(Adam,Rome)$ is counted in the denominator as false.

Candidate 3:


$$

(Bob,Zurich)

$$


The graph contains no fact of the form:


$$

wasBornIn(Bob,y')

$$


So PCA does not treat Bob’s missing birthplace as false. This candidate is excluded from the PCA denominator.

**Step 4: Count numerator and PCA denominator.**

True predictions:


$$

1

$$


PCA-counted predictions:


$$

2

$$


**Step 5: Compute PCA confidence.**


$$

conf_{pca}(R)=\frac{1}{2}

$$


**Answer:**


$$

conf_{pca}(R)=\frac{1}{2}

$$


This is higher than standard confidence $1/3$, because PCA does not punish the rule for Bob’s unknown birthplace.

---

## Q18. Multi-body Horn rule with support, head coverage, standard confidence, and PCA confidence

Given this knowledge graph:

Body-relevant facts:


$$

worksAt(Alice,Uni_1), \quad locatedIn(Uni_1,UK)

$$



$$

worksAt(Bob,Uni_2), \quad locatedIn(Uni_2,UK)

$$



$$

worksAt(Cara,Uni_3), \quad locatedIn(Uni_3,Italy)

$$


Head-relation facts:


$$

citizenOf(Alice,UK)

$$



$$

citizenOf(Bob,France)

$$



$$

citizenOf(Dan,UK)

$$


Rule:


$$

R: worksAt(x,z) \land locatedIn(z,y) \Rightarrow citizenOf(x,y)

$$


Compute:

1. support
2. head coverage
3. standard confidence
4. PCA confidence

### Solution

**Step 1: List body instantiations.**

The body is:


$$

worksAt(x,z) \land locatedIn(z,y)

$$


Check each workplace and its location:

| $x$ | $z$ | $y$ | Body candidate head $citizenOf(x,y)$ |
|---|---|---|---|
| Alice | $Uni_1$ | UK | $citizenOf(Alice,UK)$ |
| Bob | $Uni_2$ | UK | $citizenOf(Bob,UK)$ |
| Cara | $Uni_3$ | Italy | $citizenOf(Cara,Italy)$ |

So there are 3 body instantiations.

**Step 2: Count true predictions for support.**

Head facts in the graph:


$$

citizenOf(Alice,UK), \quad citizenOf(Bob,France), \quad citizenOf(Dan,UK)

$$


Only the candidate $citizenOf(Alice,UK)$ is present.

So:


$$

supp(R)=1

$$


**Step 3: Compute head-relation size.**

The relation `citizenOf` has three known subject-object pairs:


$$

(Alice,UK), (Bob,France), (Dan,UK)

$$


So:


$$

size(citizenOf)=3

$$


**Step 4: Compute head coverage.**


$$

hc(R)=\frac{supp(R)}{size(citizenOf)}
=
\frac{1}{3}

$$


**Step 5: Compute standard confidence.**

Standard confidence counts all body candidates in the denominator.


$$

conf(R)=\frac{1}{3}

$$


**Step 6: Compute the PCA denominator.**

PCA counts a candidate $citizenOf(x,y)$ in the denominator only if there is at least one known fact:


$$

citizenOf(x,y')

$$


for the same subject $x$.

Check candidates:

| Candidate | Is there some known $citizenOf(x,y')$? | Counted by PCA? | True? |
|---|---:|---:|---:|
| $citizenOf(Alice,UK)$ | yes: $citizenOf(Alice,UK)$ | yes | yes |
| $citizenOf(Bob,UK)$ | yes: $citizenOf(Bob,France)$ | yes | no |
| $citizenOf(Cara,Italy)$ | no known $citizenOf(Cara,y')$ | no | not counted |

PCA denominator = 2.

**Step 7: Compute PCA confidence.**


$$

conf_{pca}(R)=\frac{1}{2}

$$


**Answer:**


$$

supp(R)=1, \qquad hc(R)=\frac{1}{3}, \qquad conf(R)=\frac{1}{3}, \qquad conf_{pca}(R)=\frac{1}{2}

$$


---

# Section D — AMIE algorithm decisions

## Q19. Decide whether AMIE accepts a rule for output

AMIE uses `AcceptedForOutput` with these checks:

- the rule must be closed
- $conf_{pca}(r) \geq minConf$
- the rule must have higher PCA confidence than its parent rules

Let:


$$

minConf=0.1

$$


For each candidate, decide whether AMIE accepts it.

| Candidate | Closed? | $conf_{pca}$ | Parent PCA confidences |
|---|---:|---:|---|
| $R_1$ | yes | 0.42 | 0.35, 0.40 |
| $R_2$ | yes | 0.40 | 0.40 |
| $R_3$ | no | 0.80 | 0.20 |
| $R_4$ | yes | 0.06 | none |

### Solution

## Candidate $R_1$

**Step 1: Check closedness.**

$R_1$ is closed, so it passes the first check.

**Step 2: Check minimum PCA confidence.**


$$

0.42 \geq 0.1

$$


So it passes the confidence threshold.

**Step 3: Compare with parents.**

Parent confidences are 0.35 and 0.40.


$$

0.42 > 0.35

$$


and


$$

0.42 > 0.40

$$


So $R_1$ is better than both parents.

**Decision:** accept $R_1$.

## Candidate $R_2$

**Step 1: Check closedness.**

$R_2$ is closed.

**Step 2: Check minimum PCA confidence.**


$$

0.40 \geq 0.1

$$


So it passes the threshold.

**Step 3: Compare with parents.**

A parent has PCA confidence 0.40.


$$

0.40 \leq 0.40

$$


AMIE rejects a child rule if a parent has equal or higher PCA confidence.

**Decision:** reject $R_2$.

## Candidate $R_3$

**Step 1: Check closedness.**

$R_3$ is not closed.

AMIE rejects immediately.

**Decision:** reject $R_3$, even though its PCA confidence is high.

## Candidate $R_4$

**Step 1: Check closedness.**

$R_4$ is closed.

**Step 2: Check minimum PCA confidence.**


$$

0.06 < 0.1

$$


It fails the minimum confidence threshold.

**Decision:** reject $R_4$.

**Answer summary:**

| Candidate | Decision | Reason |
|---|---|---|
| $R_1$ | accept | closed, above threshold, better than parents |
| $R_2$ | reject | parent has equal PCA confidence |
| $R_3$ | reject | not closed |
| $R_4$ | reject | below minimum PCA confidence |

---

## Q20. Classify AMIE refinement operations

Start with the rule head:


$$

r(x,y)

$$


Classify each proposed added body atom as:

- Add Dangling Atom
- Add Instantiated Atom
- Add Closing Atom
- invalid/disconnected addition

Proposed additions:

1. $p(x,z)$, where $z$ is fresh
2. $p(x,Paris)$
3. $p(y,x)$
4. $p(z,w)$, where both $z,w$ are fresh

### Solution

## Addition 1: $p(x,z)$

**Step 1: Check variables.**

It uses existing variable $x$ and fresh variable $z$.

**Step 2: Match to AMIE refinement type.**

A dangling atom uses:

- one variable already in the rule
- one fresh variable

**Decision:** Add Dangling Atom.

## Addition 2: $p(x,Paris)$

**Step 1: Check terms.**

It uses existing variable $x$ and constant `Paris`.

**Step 2: Match to AMIE refinement type.**

An instantiated atom uses:

- one variable already in the rule
- one entity constant

**Decision:** Add Instantiated Atom.

This is usually the most expensive refinement type because the algorithm may need to consider many possible constants/entities.

## Addition 3: $p(y,x)$

**Step 1: Check variables.**

It uses variables $y$ and $x$, both already present in the rule.

**Step 2: Match to AMIE refinement type.**

A closing atom uses variables already present in the rule.

**Decision:** Add Closing Atom.

## Addition 4: $p(z,w)$

**Step 1: Check variables.**

Both $z$ and $w$ are fresh.

**Step 2: Check connection to the existing rule.**

The atom shares no variable or constant with the existing rule.

So it would create a disconnected rule.

**Decision:** invalid/disconnected addition.

**Answer summary:**

| Addition | Classification |
|---|---|
| $p(x,z)$ | Add Dangling Atom |
| $p(x,Paris)$ | Add Instantiated Atom |
| $p(y,x)$ | Add Closing Atom |
| $p(z,w)$ | invalid/disconnected |

---

## Q21. Trace one AMIE queue/refinement step

AMIE has:


$$

minHC=0.2, \qquad minConf=0.1, \qquad maxLen=2

$$


The current dequeued rule $R$ has:

- body length = 1
- closed = yes
- $conf_{pca}(R)=0.30$
- parent PCA confidence = 0.20

Refinement produces:

| Refined rule | Head coverage | Already in queue? |
|---|---:|---:|
| $R_a$ | 0.25 | no |
| $R_b$ | 0.15 | no |
| $R_c$ | 0.40 | yes |

What happens to $R$, $R_a$, $R_b$, and $R_c$?

### Solution

**Step 1: Check whether $R$ is accepted for output.**

The rule $R$ is closed.

Its PCA confidence is:


$$

0.30

$$


The minimum confidence is:


$$

0.1

$$


Since:


$$

0.30 \geq 0.1

$$


it passes the confidence threshold.

Its parent has confidence 0.20, and:


$$

0.30 > 0.20

$$


So $R$ is better than its parent.

Therefore $R$ is accepted for output.

**Step 2: Check whether $R$ may be refined.**

The current body length is 1.


$$

1 < maxLen=2

$$


So AMIE may refine $R$.

**Step 3: Check refined rule $R_a$.**


$$

hc(R_a)=0.25

$$


Minimum head coverage is 0.2.


$$

0.25 \geq 0.2

$$


It is not already in the queue.

So $R_a$ is enqueued.

**Step 4: Check refined rule $R_b$.**


$$

hc(R_b)=0.15

$$



$$

0.15 < 0.2

$$


So $R_b$ fails the head-coverage threshold and is not enqueued.

**Step 5: Check refined rule $R_c$.**


$$

hc(R_c)=0.40

$$


It passes the head-coverage threshold.

But it is already in the queue.

So AMIE does not enqueue it again.

**Answer:**

- $R$ is accepted for output.
- $R_a$ is enqueued.
- $R_b$ is pruned because head coverage is too low.
- $R_c$ is not enqueued because it is a duplicate.

---

# Section E — Hard edge cases where methods disagree or break down

## Q22. High confidence but too little support under Apriori

In 100 transactions:

- $A$ appears in exactly 2 transactions.
- Whenever $A$ appears, $B$ also appears.
- Minimum support threshold is 3.

For the rule:


$$

\{A\}\Rightarrow\{B\}

$$


1. What is the confidence?
2. Would Apriori normally output this rule if it only generates rules from frequent itemsets?

### Solution

**Step 1: Compute support of the antecedent.**

$A$ appears in 2 transactions.


$$

Support(\{A\})=2

$$


**Step 2: Compute support of antecedent plus consequent.**

Whenever $A$ appears, $B$ also appears.

So:


$$

Support(\{A,B\})=2

$$


**Step 3: Compute confidence.**


$$

Confidence(\{A\}\Rightarrow\{B\})
=
\frac{Support(\{A,B\})}{Support(\{A\})}
=
\frac{2}{2}
=1.0

$$


**Step 4: Check the support threshold.**

Minimum support is 3.

But:


$$

Support(\{A,B\})=2<3

$$


So $\{A,B\}$ is not frequent.

**Step 5: Apply Apriori rule generation.**

Apriori normally generates rules from frequent itemsets only.

Since $\{A,B\}$ is not frequent, the rule is not normally output, even though its confidence is 1.0.

**Answer:**


$$

Confidence=1.0

$$


but the rule is not output under standard Apriori frequent-itemset rule generation because its support is too low.

---

## Q23. Existential restriction edge cases

For the column:


$$

\exists r.C

$$


decide whether each row entity gets 1 or 0.

Facts:


$$

r(a_1,b_1), \quad type(b_1,D)

$$



$$

type(c_2,C)

$$



$$

r(a_3,b_3), \quad type(b_3,C)

$$



$$

r(a_4,b_4), \quad type(b_4,D), \quad r(a_4,b_5), \quad type(b_5,C)

$$


Rows: $a_1,a_2,a_3,a_4$.

### Solution

**Step 1: State the exact condition.**

A row entity $a$ gets 1 for:


$$

\exists r.C

$$


iff there exists some $b$ such that:


$$

r(a,b)

$$


and:


$$

type(b,C)

$$


Both parts must be connected through the same object $b$.

**Step 2: Check $a_1$.**

We have:


$$

r(a_1,b_1)

$$


but:


$$

type(b_1,D)

$$


not $type(b_1,C)$.

So $a_1=0$.

**Step 3: Check $a_2$.**

The facts mention:


$$

type(c_2,C)

$$


but there is no fact:


$$

r(a_2,c_2)

$$


So $a_2$ is not connected by $r$ to the object typed as $C$.

So $a_2=0$.

**Step 4: Check $a_3$.**

We have:


$$

r(a_3,b_3)

$$


and:


$$

type(b_3,C)

$$


So $a_3=1$.

**Step 5: Check $a_4$.**

One object $b_4$ is only typed as $D$, but another object $b_5$ is typed as $C$:


$$

r(a_4,b_5), \quad type(b_5,C)

$$


Existential restrictions need at least one valid witness.

So $a_4=1$.

**Answer:**

| Entity | $\exists r.C$ |
|---|---:|
| $a_1$ | 0 |
| $a_2$ | 0 |
| $a_3$ | 1 |
| $a_4$ | 1 |

---

## Q24. CWA vs PCA disagreement on missing facts

A rule produces three candidate predictions for head relation $h$:


$$

h(s_1,o_1), \quad h(s_2,o_2), \quad h(s_3,o_3)

$$


The graph contains:


$$

h(s_1,o_1)

$$


and:


$$

h(s_2,o_9)

$$


but contains no fact of the form:


$$

h(s_3,o')

$$


for any object $o'$.

Compute standard confidence and PCA confidence, assuming these three candidates are the only body instantiations.

### Solution

**Step 1: Count true predictions.**

The three predictions are:

1. $h(s_1,o_1)$
2. $h(s_2,o_2)$
3. $h(s_3,o_3)$

Only $h(s_1,o_1)$ exists in the graph.

So support / true predictions:


$$

1

$$


**Step 2: Compute standard confidence under CWA.**

Under CWA, missing means false.

So all three body candidates are counted in the denominator:


$$

conf=\frac{1}{3}

$$


**Step 3: Apply PCA to candidate 1.**


$$

h(s_1,o_1)

$$


exists, so it is counted in the PCA denominator and numerator.

**Step 4: Apply PCA to candidate 2.**


$$

h(s_2,o_2)

$$


is missing, but the graph contains:


$$

h(s_2,o_9)

$$


So PCA assumes the graph is complete for subject-relation pair $(s_2,h)$. Therefore $h(s_2,o_2)$ is counted as false in the denominator.

**Step 5: Apply PCA to candidate 3.**


$$

h(s_3,o_3)

$$


is missing, and there is no known fact:


$$

h(s_3,o')

$$


So PCA does not assume $(s_3,h)$ is complete. This candidate is excluded from the PCA denominator.

**Step 6: Compute PCA confidence.**

PCA denominator counts candidates 1 and 2 only.


$$

conf_{pca}=\frac{1}{2}

$$


**Answer:**


$$

conf=\frac{1}{3}, \qquad conf_{pca}=\frac{1}{2}

$$


This is the key CWA/PCA disagreement: CWA treats every missing prediction as false, while PCA ignores missing predictions for subjects with no known head-relation value.

---

## Q25. Parent rule beats a more specific child rule

AMIE considers these two closed rules:

Parent rule:


$$

P: livesIn(x,y) \Rightarrow bornIn(x,y)

$$


Child rule:


$$

C: livesIn(x,y) \land marriedTo(x,z) \land livesIn(z,y) \Rightarrow bornIn(x,y)

$$


Their PCA confidences are:


$$

conf_{pca}(P)=0.60

$$



$$

conf_{pca}(C)=0.60

$$


Minimum confidence is:


$$

minConf=0.1

$$


Assume both rules are closed. Does AMIE accept the child rule $C$?

### Solution

**Step 1: Check closedness.**

The question states that $C$ is closed.

So it passes the closedness check.

**Step 2: Check minimum PCA confidence.**


$$

conf_{pca}(C)=0.60

$$


and:


$$

minConf=0.1

$$


Since:


$$

0.60 \geq 0.1

$$


$C$ passes the minimum confidence threshold.

**Step 3: Compare with parent rule.**

The parent rule has:


$$

conf_{pca}(P)=0.60

$$


The child rule has:


$$

conf_{pca}(C)=0.60

$$


AMIE rejects a child if any parent has equal or higher PCA confidence.

Here:


$$

conf_{pca}(C) \leq conf_{pca}(P)

$$


because:


$$

0.60 \leq 0.60

$$


**Step 4: Explain why.**

The parent has fewer body atoms. So it is more general. If the child is not more confident, the extra conditions do not justify the extra specificity.

**Answer:**

No. AMIE rejects $C$, because its parent $P$ has equal PCA confidence and is more general.

---

## Q26. Numerically strong but structurally invalid Horn rule

A mined rule has:


$$

conf_{pca}=0.95

$$


and:


$$

hc=0.30

$$


But the rule is:


$$

likes(x,y) \Rightarrow hasNationality(z,UK)

$$


Should AMIE output it? Explain using the structural restrictions from the sheet.

### Solution

**Step 1: Check the numerical thresholds.**

The rule has high PCA confidence:


$$

0.95

$$


and decent head coverage:


$$

0.30

$$


Numerically, it looks strong.

**Step 2: Check connectedness.**

Body atom:


$$

likes(x,y)

$$


Head atom:


$$

hasNationality(z,UK)

$$


The body variables are $x,y$. The head variable is $z$, plus constant `UK`.

There is no shared variable or constant connecting the body to the head.

So the rule is disconnected.

**Step 3: Check closedness.**

Variable counts:

| Variable | Occurrences |
|---|---:|
| $x$ | 1 |
| $y$ | 1 |
| $z$ | 1 |

No variable appears at least twice.

So the rule is non-closed.

**Step 4: Apply AMIE output logic.**

AMIE only accepts rules for output if they are closed. The lecture also treats disconnected rules as uninteresting because they lack meaningful logical connection.

**Answer:**

No. The rule should not be output, despite strong numerical scores, because it is disconnected and non-closed. Structural validity comes before trusting the metrics.

---

# Final self-test checklist

After working through the bank, you should be able to do these without looking:

- Compute association-rule support and confidence.
- Use Apriori to prune candidates before database scanning.
- Generate all rules from a frequent itemset.
- Build SSI transaction tables from RDF-style facts.
- Fill $\exists r.C$, $\exists r.\top$, and $\exists r^{-1}.\top$ columns.
- Convert association rules into OWL axioms.
- Ground Horn rules using constants.
- Check whether a Horn rule is connected and closed.
- Compute Horn support, head coverage, standard confidence, and PCA confidence.
- Explain why PCA confidence can be higher than standard confidence.
- Trace AMIE acceptance, refinement, duplicate checking, and pruning.
- Explain why a rule can be rejected even if its confidence is high.
