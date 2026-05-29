---
subject: COMP64602
chapter: 2
title: "Week 2"
language: en
---

# Advanced Topics in Knowledge Representation and Reasoning — Week 2 Study Notes

**Topic and scope.**  
This lecture is about learning uncertain logical/ontological knowledge from large knowledge graphs. The week covers **Statistical Schema Induction** for learning OWL 2 schema axioms, **Horn rule mining** using **AMIE**, and briefly introduces **Markov Logic Networks** as a relational machine-learning approach combining first-order logic with Markov networks.

**Source note.**  
These notes use the Week 2 slides plus the uploaded transcripts for Videos 1, 2, 3, 4, and 6. A Video 5 transcript was not included among the uploaded files, so the Markov Logic Network part is only covered at summary level.

---

## 1. Week 2 lecture structure

The week is organised around three related ways of extracting or using logical structure over large graphs:

1. **Ontology learning / Statistical Schema Induction**
   - Learn schema-level OWL 2 axioms from factual RDF triples.
   - Uses association rule mining over transaction-table representations of graph data.

2. **Rule mining / Horn rules / AMIE**
   - Mine logical rules from large-scale factual knowledge graphs.
   - Horn rules act similarly to schema knowledge because they describe reusable patterns.
   - AMIE mines Horn rules efficiently under incomplete evidence.

3. **Relational machine learning / Markov Logic Networks**
   - Only briefly introduced in the uploaded material.
   - Key idea: use formulas in first-order logic to guide the instantiation of Markov networks from instances.

---

# 2. Statistical Schema Induction / SSI

## 2.1 What SSI is

**Intuition.**  
Statistical Schema Induction is a method for learning schema knowledge from a repository of factual RDF triples. Instead of manually designing an ontology, SSI looks at patterns in the data and induces likely OWL 2 axioms.

**Formal description from slides.**  
Given a repository of facts in the form of **RDF triples**, SSI learns a schema in **OWL 2**, including axioms based on:

- top concept: $\top$
- bottom concept: $\bot$
- conjunction: $C \sqcap D$
- existential restriction: $\exists r.C$
- general concept inclusion: $C \sqsubseteq D$
- role composition and inclusion:  
  $r_1 \circ \dots \circ r_k \sqsubseteq r$

Examples of learnable axioms:

$$
Airport \sqsubseteq Building
$$

$$
Country \sqsubseteq \exists hasLanguage.Language
$$

$$
Male \sqcap Parent \sqsubseteq Father
$$

SSI therefore learns **schema-level conclusions** from data, but these conclusions are usually uncertain because they may be supported by many facts, but not necessarily all facts.

---

## 2.2 Why association rule mining appears

The lecturer connects SSI to **association rule mining** from transaction databases.

**Intuition.**  
Association rule mining finds patterns like:

> If some items appear in a transaction, another item is likely to appear too.

Classic supermarket example:

$$
\{Milk, Bread\} \Rightarrow \{Butter\}
$$

SSI borrows this idea by turning knowledge graph facts into transaction tables. Then rules over table columns can be converted into ontology axioms.

---

## 2.3 Association rules: definitions

An association rule has the form:

$$
X \Rightarrow Y
$$

where:

- $X$ is the **antecedent**, the “if” part.
- $Y$ is the **consequent**, the “then” part.

Example:

$$
\{Milk, Bread\} \Rightarrow \{Butter\}
$$

### Support

**Intuition.**  
Support measures how often an itemset appears in the transaction database.

**Formal definition.**

Let:

$$
D = \{t_1, \dots, t_m\}
$$

be a list of transactions. Then:

$$
Support(X) = |\{t \in D : X \subseteq t\}|
$$

So support counts the number of transactions containing all items in $X$.

### Confidence

**Intuition.**  
Confidence measures how often $Y$ appears among transactions that already contain $X$.

**Formal definition.**

$$
Confidence(X \Rightarrow Y) =
\frac{Support(X \cup Y)}{Support(X)}
$$

### Worked example: milk, bread, butter

Given:

- $\{Milk, Bread\}$ appears in 100 transactions.
- $\{Milk, Bread, Butter\}$ appears in 90 transactions.

Then:

$$
Confidence(\{Milk, Bread\} \Rightarrow \{Butter\})
=
\frac{90}{100}
=
0.9
$$

Important detail: the 90 transactions containing milk, bread, and butter are inside the 100 transactions containing milk and bread.

---

## 2.4 Apriori algorithm

The slides include **Apriori** as the association rule mining algorithm.

**Core assumption / Apriori property.**

> If an itemset is frequent, then all of its subsets must also be frequent.

Equivalently, if a candidate itemset has an infrequent subset, the candidate cannot be frequent.

### Step 1: discover frequent itemsets

Example frequent itemset:

$$
\{Milk, Bread, Butter\}
$$

Process:

1. Find frequent 1-itemsets using a minimum support threshold.
2. Generate candidate $k$-itemsets from frequent $(k-1)$-itemsets.
3. Prune candidates using the Apriori property.
4. Scan transactions to calculate support.
5. Repeat until no more frequent itemsets exist.

The slide notes this is a **level-wise, breadth-first search**.

### Step 2: generate rules from frequent itemsets

For each frequent itemset $X$:

- choose every non-empty subset $A \subset X$
- generate rule:

$$
A \Rightarrow X \setminus A
$$

- calculate its confidence.

---

# 3. SSI method: from RDF triples to OWL 2 axioms

## 3.1 Overall SSI workflow

The SSI method has three main steps.

### Step 1: Terminology acquisition

The system gathers terminology from the knowledge graph:

- named concepts/classes
- properties/relations

These are used to construct transaction tables.

### Step 2: Association rule mining

The method applies association rule mining to the transaction tables:

- calculate support and confidence for possible rules
- select rules that strongly reflect patterns in the data
- transform selected association rules into OWL 2 axioms

### Step 3: Ontology construction

The learned axioms are used to construct an ontology.

[UNCLEAR] The transcript says this can be done using tools like “Java, our API or Portage.” This is likely a transcription error for something like Java OWL API or Protégé, but the slides do not explicitly spell this out, so keep this part flagged.

---

## 3.2 Transaction table idea

The key move in SSI is:

> Convert RDF graph facts into transaction tables, then mine association rules from those tables.

For a simple concept hierarchy axiom like:

$$
C \sqsubseteq D
$$

the transaction table is built as follows:

- rows = instances/entities in the knowledge graph
- columns = named concepts/classes
- entry value = 1 if the instance belongs to that concept, 0 otherwise

So an entity becomes a “transaction,” and its classes become “items.”

---

## 3.3 Worked example: DBpedia-style transaction table

The slide gives a transaction table for a fragment of DBpedia. Columns include:

- Comedian
- Artist
- Person
- Airport
- Building
- Place
- Animal

Rows include:

- Jerry Seinfeld
- Black Bird
- Chris Rock
- Robin Williams
- JFK Airport
- Hancock Tower
- Newark Airport

Example interpretation:

- `Black_Bird` has value 1 only under `Animal`.
- `JFK_Airport` and `Newark_Airport` have value 1 under `Airport`, `Building`, and `Place`.

The mined association rule is:

$$
\{Airport\} \Rightarrow \{Building\}
$$

The slide gives:

$$
Support(\{Airport, Building\}) = 2
$$

There are two airport instances that are also buildings: `JFK_Airport` and `Newark_Airport`.

The confidence is:

$$
Confidence(\{Airport\} \Rightarrow \{Building\})
=
\frac{2}{2}
=
1.0
$$

Because every airport in this small table is also marked as a building.

This association rule is then transformed into the schema axiom:

$$
Airport \sqsubseteq Building
$$

---

## 3.4 Transaction tables for different axiom types

The lecturer explains that SSI does **not** need an arbitrary huge number of transaction tables. In theory, it needs one transition/transaction table per axiom type.

### Axiom type: simple subclass

Axiom:

$$
C \sqsubseteq D
$$

Transaction table:

$$
a \mapsto C_1, \dots, C_n
\quad \text{for } a \in N_I
$$

Association rule:

$$
\{C_i\} \Rightarrow \{C_j\}
$$

Meaning: if an instance belongs to $C_i$, it likely belongs to $C_j$.

---

### Axiom type: conjunction subclass

Axiom:

$$
C \sqcap D \sqsubseteq E
$$

Transaction table is the same concept-membership table:

$$
a \mapsto C_1, \dots, C_n
$$

Association rule:

$$
\{C_i, C_j\} \Rightarrow \{C_k\}
$$

Meaning: if an instance belongs to both $C_i$ and $C_j$, it likely belongs to $C_k$.

Example from the slides:

$$
Male \sqcap Parent \sqsubseteq Father
$$

---

### Axiom type: named concept subclass of existential restriction

Axiom:

$$
D \sqsubseteq \exists r.C
$$

Here, the superclass is a complex concept: an existential restriction.

Transaction table includes:

- named concepts
- existential restriction columns such as $\exists r_1.C_{11}$

Association rule pattern:

$$
\{C_k\} \Rightarrow \{\exists r_j.C_{jk}\}
$$

Meaning: if an entity belongs to concept $C_k$, it likely has an $r_j$ relation to some instance of $C_{jk}$.

Example:

$$
Country \sqsubseteq \exists hasLanguage.Language
$$

Meaning: any instance of `Country` has at least one `hasLanguage` relation to an instance of `Language`.

---

### Axiom type: existential restriction subclass of named concept

Axiom:

$$
\exists r.C \sqsubseteq D
$$

Association rule pattern:

$$
\{\exists r_j.C_{jk}\} \Rightarrow \{C_i\}
$$

Meaning: if an entity has relation $r_j$ to some instance of $C_{jk}$, it likely belongs to concept $C_i$.

---

### Axiom type: domain-style existential restriction

Axiom:

$$
\exists r.\top \sqsubseteq C
$$

Association rule pattern:

$$
\{\exists r_j.\top\} \Rightarrow \{C_i\}
$$

Meaning: if an entity has at least one outgoing $r_j$ relation to anything, it likely belongs to $C_i$.

---

### Axiom type: inverse existential restriction

Axiom:

$$
\exists r^{-1}.\top \sqsubseteq C
$$

Association rule pattern:

$$
\{\exists r_j^{-1}.\top\} \Rightarrow \{C_i\}
$$

Meaning: if an entity has at least one incoming $r_j$ relation from something, it likely belongs to $C_i$.

---

### Axiom type: role inclusion

Axiom:

$$
r \sqsubseteq s
$$

Here, rows are pairs of entities:

$$
(a,b) \in N_I \times N_I
$$

The table records which relations hold between $a$ and $b$.

Association rule pattern:

$$
\{r_i\} \Rightarrow \{r_j\}
$$

Meaning: if relation $r_i(a,b)$ holds, then relation $r_j(a,b)$ likely holds.

---

### Axiom type: role composition

The slides also include role composition/inclusion using rows of entity pairs and relation-composition columns. The general idea is:

- rows = entity pairs $(a,b)$
- columns = direct relations and relation-composition patterns
- rules can express that a composed path implies another relation

[UNCLEAR] The OCR/transcript around the exact role-composition table is hard to read. The important safe point is that role-composition axioms are handled by transaction tables over pairs of instances rather than single instances.

---

## 3.5 How to fill existential restriction columns

This is one of the clearest exam-like parts of the slides.

For a column such as:

$$
\exists r_1.C_{11}
$$

the value for instance $a$ is:

$$
1
$$

iff there exist two triples:

$$
\langle a, r_1, b \rangle
$$

and

$$
\langle b, rdf:type, C_{11} \rangle
$$

Otherwise the value is:

$$
0
$$

In words: $a$ satisfies the column $\exists r_1.C_{11}$ if $a$ has an $r_1$ edge to some entity $b$, and $b$ is an instance of $C_{11}$.

**Exam flag.** The slide explicitly says: **“Be able to demonstrate these cases by examples.”** This refers to transaction table construction for the different axiom types, especially columns involving existential restrictions.

---

# 4. Horn rules

## 4.1 What a Horn rule is

**Intuition.**  
A Horn rule is a reusable logical pattern: if the body conditions hold, then the head conclusion should hold.

**Formal definition from slides.**

A Horn rule has:

- a **head**:

$$
r(x,y)
$$

- a **body**:

$$
\{B_1, \dots, B_n\}
$$

The rule is written as:

$$
B_1, \dots, B_n \Rightarrow r(x,y)
$$

or abbreviated as:

$$
B \Rightarrow r(x,y)
$$

The head is the conclusion. The body atoms are the conditions.

---

## 4.2 Horn rule examples

### Example 1: birthplace from residence

The transcript gives a simple example:

$$
livesIn(x,y) \Rightarrow wasBornIn(x,y)
$$

Meaning: if $x$ lives in $y$, then $x$ was born in $y$.

This is not necessarily always true in the real world, but as a mined rule it can describe a pattern in a knowledge graph.

### Example 2: spouse residence rule

The slide gives:

$$
livesIn(x,y) \land marriedTo(x,z) \Rightarrow livesIn(z,y)
$$

Meaning: if $x$ lives in $y$, and $x$ is married to $z$, then $z$ lives in $y$.

---

## 4.3 Variables and constants in Horn rules

Horn rules usually use variables, especially in the head.

Reason:

- the goal is to infer new knowledge about arbitrary entities
- a rule with variables is reusable across many entities
- a rule with constants in the head becomes more like a specific fact than a reusable rule

The transcript mentions a constant example involving Manchester.

[UNCLEAR] The transcript says something like: “if x is a Manchester then x was born in Manchester.” The intended rule is likely something like:

$$
livesIn(x, Manchester) \Rightarrow wasBornIn(x, Manchester)
$$

but the exact body predicate is garbled. Keep this one flagged.

---

## 4.4 Instantiation / grounding

**Definition.**  
Instantiation, also called **grounding**, means replacing variables in a Horn rule with constants/entities from the knowledge graph.

Example rule:

$$
livesIn(x,y) \land marriedTo(x,z) \Rightarrow livesIn(z,y)
$$

Grounded with:

- $x = Lisa$
- $y = UK$
- $z = David$

becomes:

$$
livesIn(Lisa, UK) \land marriedTo(Lisa, David)
\Rightarrow livesIn(David, UK)
$$

The grounded atoms are facts expected to be true in the knowledge graph.

The lecturer also connects function-style notation to RDF triples:

$$
livesIn(David, UK)
$$

is equivalent to an RDF-style triple:

$$
\langle David, livesIn, UK \rangle
$$

---

## 4.5 Why Horn rules matter in knowledge graphs

Horn rules play a role similar to ontological schema knowledge:

- they express general patterns over facts
- they can support inference of new facts
- they should be as true as possible
- they should also cover enough data to be general

The lecturer highlights the tension:

- more conditions can make a rule more specific
- but too many conditions reduce generality and increase search cost

---

# 5. “Interesting” Horn rules

The lecture defines several restrictions used to decide which Horn rules are worth mining.

## 5.1 Maximum body length

**Definition.**  
The body length is the number of atoms in the body of the rule.

Example body with length 2:

$$
livesIn(x,y) \land marriedTo(x,z)
$$

The lecturer says body length is often limited to:

$$
3
$$

Reason:

- more body atoms means higher search space
- more body atoms usually means fewer satisfying instantiations
- therefore the rule becomes less general

---

## 5.2 Connected rules

**Definition.**  
Two atoms are connected if they share a variable or constant.

Example:

$$
livesIn(x,y)
$$

and

$$
marriedTo(x,z)
$$

are connected because both contain $x$.

A rule is connected if every atom is connected transitively to every other atom.

### Bad disconnected example

$$
diedIn(x,y) \Rightarrow wasBornIn(w,z)
$$

This is bad because the body and head do not share variables. The rule says something about $w,z$ even though the condition concerns $x,y$. The lecturer says such rules lack real-world logical meaning and generality.

---

## 5.3 Closed rules

**Definition.**  
A variable is **closed** if it appears at least twice in the rule.

A rule is **closed** if all its variables are closed.

### Bad non-closed example

$$
diedIn(x,y) \Rightarrow \exists z : wasBornIn(x,z)
$$

Here, $z$ appears only once. The transcript says this makes the rule unspecified after instantiation: it can mean a person was born “somewhere,” without specifying where.

This also causes extra computation during deductive reasoning.

[UNCLEAR] In the slide example, $y$ also appears only once in the rule. The transcript specifically discusses $z$, but by the formal definition, any variable appearing only once is not closed.

---

# 6. Measuring Horn rules

Horn rules need quality metrics, just like association rules.

The lecture covers:

1. support
2. head coverage
3. standard confidence
4. PCA confidence, later used by AMIE

---

## 6.1 Support

**Intuition.**  
Support counts how many distinct head subject-object pairs are supported by full rule instantiations in the knowledge graph.

**Formal definition.**

For a rule:

$$
B \Rightarrow r(x,y)
$$

support is:

$$
supp(B \Rightarrow r(x,y))
:=
\#(x,y): \exists z_1, \dots, z_m : B \land r(x,y)
$$

where:

- $z_1, \dots, z_m$ are the variables of the rule apart from $x$ and $y$
- $\#(x,y)$ means the number of distinct subject-object pairs for the head relation

**Monotonicity.**  
More atoms in the body means lower or equal support. Adding conditions cannot create more satisfying rule instantiations.

---

## 6.2 Worked example: support

Mini knowledge graph:

`livesIn` facts:

$$
livesIn(Adam, Paris)
$$

$$
livesIn(Adam, Rome)
$$

$$
livesIn(Bob, Zurich)
$$

`wasBornIn` facts:

$$
wasBornIn(Adam, Paris)
$$

$$
wasBornIn(Carl, Rome)
$$

Rule:

$$
R: livesIn(x,y) \Rightarrow wasBornIn(x,y)
$$

Check possible instantiations:

1. $x=Adam, y=Paris$

$$
livesIn(Adam, Paris) \Rightarrow wasBornIn(Adam, Paris)
$$

This is supported because both body and head fact exist.

2. $x=Adam, y=Rome$

$$
livesIn(Adam, Rome) \Rightarrow wasBornIn(Adam, Rome)
$$

The body exists, but the head fact does not exist in the graph.

3. $x=Bob, y=Zurich$

$$
livesIn(Bob, Zurich) \Rightarrow wasBornIn(Bob, Zurich)
$$

The body exists, but the head fact does not exist in the graph.

Therefore only one distinct head pair is supported:

$$
supp(R) = 1
$$

[UNCLEAR] The slide/table OCR shows “Pairs” in one place, but the worked example clearly uses `Paris`.

---

## 6.3 Head coverage

**Why head coverage is needed.**  
Support is an absolute number and depends on the size of the knowledge graph. A support of 100 may be large in a small graph and tiny in a huge graph. Head coverage normalises support by the size of the head relation.

**Formal definition.**

$$
hc(B \Rightarrow r(x,y))
:=
\frac{supp(B \Rightarrow r(x,y))}{size(r)}
$$

where:

$$
size(r) := \#(x',y') : r(x',y')
$$

So $size(r)$ is the number of subject-object pairs associated with relation $r$ in the knowledge graph.

### Worked example: head coverage

For:

$$
R: livesIn(x,y) \Rightarrow wasBornIn(x,y)
$$

we already calculated:

$$
supp(R) = 1
$$

The head relation is:

$$
wasBornIn
$$

The graph has two `wasBornIn` facts:

$$
wasBornIn(Adam, Paris)
$$

$$
wasBornIn(Carl, Rome)
$$

So:

$$
size(wasBornIn) = 2
$$

Therefore:

$$
hc(R) = \frac{1}{2}
$$

---

## 6.4 Standard confidence

**Intuition.**  
Standard confidence asks:

> Among all body instantiations, how many lead to a head fact that is true in the knowledge graph?

**Formal definition.**

$$
conf(B \Rightarrow r(x,y))
:=
\frac{supp(B \Rightarrow r(x,y))}
{\#(x,y): \exists z_1, \dots, z_m : B}
$$

The denominator counts all distinct $(x,y)$ pairs for which the body is true.

---

## 6.5 Closed World Assumption / CWA

Standard confidence uses the **Closed World Assumption**.

**Definition from lecture.**

- facts that exist in the knowledge graph, or can be inferred from it, are regarded as true
- facts that do not exist and cannot be inferred are regarded as false

So under CWA, missing means false.

---

## 6.6 Worked example: standard confidence

Rule:

$$
R: livesIn(x,y) \Rightarrow wasBornIn(x,y)
$$

Body instantiations:

1. 

$$
livesIn(Adam, Paris) \Rightarrow wasBornIn(Adam, Paris)
$$

Head exists, so true.

2. 

$$
livesIn(Adam, Rome) \Rightarrow wasBornIn(Adam, Rome)
$$

Head missing, so false under CWA.

3. 

$$
livesIn(Bob, Zurich) \Rightarrow wasBornIn(Bob, Zurich)
$$

Head missing, so false under CWA.

There are three body instantiations. Only one has a true head.

Therefore:

$$
conf(R) = \frac{1}{3}
$$

---

# 7. AMIE

## 7.1 What AMIE is

AMIE stands for:

> **Association Rule Mining under Incomplete Evidence**

The original version was published in 2013. The transcript says AMIE+ and version 3 were published in 2015 and 2020 respectively.

Although the name refers to association rule mining, AMIE is used here to mine **Horn rules** from large-scale knowledge graphs.

AMIE follows some ideas from association rule mining, but it is adapted for incomplete knowledge graphs.

---

## 7.2 Why AMIE does not use CWA

Knowledge graphs are often incomplete. If a fact is missing, it may not be false; it may simply be unknown.

So AMIE does **not** use the Closed World Assumption.

Instead, it uses the:

$$
PCA
$$

or:

> Partial Completeness Assumption

---

## 7.3 Partial Completeness Assumption / PCA

**Definition.**  
For a given relation $r$ and subject $x$, if the knowledge graph contains at least one object $y$ such that:

$$
\langle x, r, y \rangle
$$

then AMIE assumes the graph knows all objects for that subject-relation pair $(x,r)$.

So other objects beyond the known ones are regarded as false.

In plain words:

> If the graph knows at least one value for a subject and relation, AMIE treats that relation for that subject as complete.

But if the graph knows no object for that subject-relation pair, AMIE does not assume missing candidates are false.

This is weaker than CWA. CWA treats every missing fact as false; PCA only treats some missing facts as false, when the graph appears complete for that subject-relation pair.

---

## 7.4 PCA confidence

**Formal definition.**

For a rule:

$$
B \Rightarrow r(x,y)
$$

PCA confidence is:

$$
conf_{pca}(B \Rightarrow r(x,y))
:=
\frac{supp(B \Rightarrow r(x,y))}
{\#(x,y): \exists z_1, \dots, z_m, y' : B \land r(x,y')}
$$

The slide says to understand the denominator using two perspectives:

1. $y' = y$
2. $y' \neq y$

Meaning:

- the numerator still counts true predictions
- the denominator counts candidate predictions only where the subject $x$ has some known object $y'$ for the head relation $r$

---

## 7.5 Worked example: PCA confidence

Use the same mini knowledge graph.

`livesIn` facts:

$$
livesIn(Adam, Paris)
$$

$$
livesIn(Adam, Rome)
$$

$$
livesIn(Bob, Zurich)
$$

`wasBornIn` facts:

$$
wasBornIn(Adam, Paris)
$$

$$
wasBornIn(Carl, Rome)
$$

Rule:

$$
R: livesIn(x,y) \Rightarrow wasBornIn(x,y)
$$

### Candidate 1

$$
livesIn(Adam, Paris) \Rightarrow wasBornIn(Adam, Paris)
$$

This is true because:

$$
wasBornIn(Adam, Paris)
$$

exists in the graph.

### Candidate 2

$$
livesIn(Adam, Rome) \Rightarrow wasBornIn(Adam, Rome)
$$

This is false under PCA because the graph already contains:

$$
wasBornIn(Adam, Paris)
$$

So for the subject-relation pair:

$$
(Adam, wasBornIn)
$$

PCA assumes the known object list is complete. Therefore other birthplace objects for Adam, such as Rome, are regarded as false.

### Candidate 3

$$
livesIn(Bob, Zurich) \Rightarrow wasBornIn(Bob, Zurich)
$$

This is **not counted** in the PCA denominator.

Reason: the graph contains no fact of the form:

$$
wasBornIn(Bob, y')
$$

So AMIE does not assume Bob’s birthplace information is complete. Therefore it does not treat `wasBornIn(Bob, Zurich)` as false.

Thus:

- true predictions = 1
- PCA-counted predictions = 2

So:

$$
conf_{pca}(R) = \frac{1}{2}
$$

This contrasts with standard confidence:

$$
conf(R) = \frac{1}{3}
$$

---

# 8. AMIE algorithm

## 8.1 Inputs

The AMIE algorithm takes:

1. Knowledge base / knowledge graph:

$$
K
$$

2. Minimum head coverage:

$$
minHC
$$

Default:

$$
0.01
$$

Meaning: a rule that covers only 1% or less of the subject-object pairs of a relation is not considered.

3. Maximum body length:

$$
maxLen
$$

Usually:

$$
2 \text{ or } 3
$$

4. Minimum confidence:

$$
minConf
$$

Default:

$$
0.1
$$

The slide corrects the video here: the intended meaning is that a rule is not interesting if fewer than 1 out of 10 predictions are **true**. The transcript says “negative,” but the slide explicitly marks this as a video error.

---

## 8.2 High-level AMIE process

AMIE maintains:

- a queue of rules
- a set of output/qualified rules

Initial queue:

$$
q = [r_1(x,y), r_2(x,y), \dots, r_m(x,y)]
$$

Each initial rule is just a possible head relation.

Output set:

$$
out = \emptyset
$$

---

## 8.3 Algorithm 1: Rule mining

The slide’s pseudocode can be written as:

```text
function AMIE(KB K, minHC, maxLen, minConf):
    q = [r1(x,y), r2(x,y), ..., rm(x,y)]
    out = ∅

    while q is not empty:
        r = q.dequeue()

        if AcceptedForOutput(r, out, minConf):
            out.add(r)

        if length(r) < maxLen:
            R(r) = Refine(r)

            for all rules rc in R(r):
                if hc(rc) ≥ minHC and rc not in q:
                    q.enqueue(rc)

    return out
```

Interpretation:

1. Start with all possible head relations.
2. Take one rule from the queue.
3. Check whether it should be output.
4. If the body is not too long, refine it by adding one more atom.
5. Keep only refined rules with enough head coverage.
6. Avoid adding duplicates.
7. Continue until the queue is empty.

---

## 8.4 Algorithm 2: AcceptedForOutput

A rule is accepted for output only if it satisfies several conditions.

Pseudocode from the slide:

```text
function AcceptedForOutput(rule r, out, minConf):
    if r is not closed or conf_pca(r) < minConf:
        return false

    parents = parentsOfRule(r, out)

    for all rp in parents:
        if conf_pca(r) ≤ conf_pca(rp):
            return false

    return true
```

So a rule must be:

1. **closed**
2. have PCA confidence at least `minConf`
3. have higher PCA confidence than its parent rules

Reason: if a parent rule has fewer body atoms and higher confidence, the parent is more interesting because it is both more general and more accurate.

---

## 8.5 Refinement operations

Refinement means extending a rule by adding one more body atom.

The lecture gives three refinement operations.

### 1. Add Dangling Atom

A new atom uses:

- one fresh variable
- one variable shared with an existing atom

Example structure:

$$
B \Rightarrow r(x,y)
$$

could be refined by adding an atom involving $x$ and a new variable $z$.

### 2. Add Instantiated Atom

A new atom uses:

- one entity constant
- one variable shared with an existing atom

This is computationally expensive because the algorithm may need to consider combinations of relations and entities.

### 3. Add Closing Atom

A new atom uses:

- variables that are already shared with other atoms

This helps create closed rules where all variables occur at least twice.

If rule $R_1$ leads to rule $R_2$ after refinement, then:

$$
R_1
$$

is a **parent rule** of:

$$
R_2
$$

---

## 8.6 Search-space reduction in AMIE

AMIE reduces the search space using several strategies.

### Strategy 1: minimum head coverage

Only enqueue new rules if:

$$
hc(r_c) \geq minHC
$$

This matters because of monotonicity:

> Extending the body with more atoms leads to lower head coverage.

Therefore, if a rule already has too low head coverage, its refinements do not need to be explored.

### Strategy 2: maximum body length

Rules are not refined once:

$$
length(r) \geq maxLen
$$

Usually:

$$
maxLen = 2 \text{ or } 3
$$

This prevents explosion in rule-search space.

### Strategy 3: minimum PCA confidence

Rules are output only if:

$$
conf_{pca}(r) \geq minConf
$$

Default:

$$
minConf = 0.1
$$

### Strategy 4: parent-rule comparison

A child rule is not accepted if a parent rule has equal or higher PCA confidence.

Reason: the parent has fewer body atoms and is therefore more general.

### Strategy 5: duplicate checking

The algorithm checks whether a generated rule is already in the queue.

### Strategy 6: SPARQL-based implementation

The implementation relies on graph database access and SPARQL counting queries.

The lecturer gives an example idea: during refinement, rather than blindly trying every possible relation for a new atom, AMIE first finds relations that can pass the head-coverage threshold.

SPARQL itself is not introduced in this lecture; the lecturer says it is covered in another unit such as Data Engineering Technologies / COMP63502.

---

## 8.7 Complexity and optimisation

The most complex refinement operation is:

> Add Instantiated Atom

Reason:

- the new atom uses one shared variable and one constant/entity
- the algorithm may need to consider combinations of relations and entities
- real-world knowledge graphs contain a very large number of entities

Optimisation methods mentioned:

- minimum head coverage
- maximum body length
- minimum PCA confidence
- duplicate checking
- multi-threading
- more scalable refinement strategies
- AMIE+ and AMIE 3 contain more details

The lecturer says optimisation depends on the concrete knowledge graph and the concrete rules being mined.

---

# 9. Markov Logic Networks / MLN

The uploaded material only contains a brief introduction/summary.

**Key idea from Video 6.**  
A Markov Logic Network uses a set of formulas expressed in first-order logic to guide the instantiation of Markov networks from instances.

**Connection to the week.**  
The week’s first two parts mine logical knowledge from knowledge graphs:

- SSI mines OWL 2 schema axioms.
- AMIE mines Horn rules.

MLN is then introduced as a relational machine-learning technique that combines:

- first-order logic
- Markov networks
- uncertain reasoning

[UNCLEAR / missing source] The detailed MLN lecture segment is not present in the uploaded transcripts/slides here, so these notes cannot reconstruct the MLN details beyond the brief summary.

---

# 10. Key concept glossary

## Statistical Schema Induction / SSI

A method for learning OWL 2 schema axioms from RDF triples by converting graph facts into transaction tables and applying association rule mining.

## RDF triple

A fact in subject-predicate-object form. The lecture uses RDF triples as the factual input to SSI.

## OWL 2 schema axiom

A logical statement about classes or relations, such as:

$$
Airport \sqsubseteq Building
$$

or:

$$
Country \sqsubseteq \exists hasLanguage.Language
$$

## Association rule

A rule of the form:

$$
X \Rightarrow Y
$$

where $X$ is the antecedent and $Y$ is the consequent.

## Support

For association rules, support counts how many transactions contain a given itemset.

For Horn rules, support counts distinct head subject-object pairs supported by rule instantiations in the knowledge graph.

## Confidence

For association rules:

$$
Confidence(X \Rightarrow Y)
=
\frac{Support(X \cup Y)}{Support(X)}
$$

For Horn rules under CWA:

$$
conf(B \Rightarrow r(x,y))
=
\frac{supp(B \Rightarrow r(x,y))}
{\#(x,y): \exists z_1,\dots,z_m:B}
$$

## Horn rule

A logical implication with body conditions and a head conclusion:

$$
B_1,\dots,B_n \Rightarrow r(x,y)
$$

## Grounding / instantiation

Replacing variables in a rule with concrete entities/constants from the knowledge graph.

## Connected rule

A rule whose atoms are linked through shared variables or constants.

## Closed rule

A rule where every variable appears at least twice.

## Head coverage

A normalised support measure:

$$
hc(B \Rightarrow r(x,y))
=
\frac{supp(B \Rightarrow r(x,y))}{size(r)}
$$

## Closed World Assumption / CWA

Assumption that missing facts are false.

## Partial Completeness Assumption / PCA

Assumption used by AMIE: if one object is known for a subject-relation pair, all objects for that pair are assumed known; other objects are treated as false. If no object is known for that subject-relation pair, missing facts are not treated as false.

## PCA confidence

AMIE’s confidence measure under PCA:

$$
conf_{pca}(B \Rightarrow r(x,y))
=
\frac{supp(B \Rightarrow r(x,y))}
{\#(x,y): \exists z_1,\dots,z_m,y': B \land r(x,y')}
$$

## AMIE

Association Rule Mining under Incomplete Evidence. An algorithm for mining Horn rules from large-scale knowledge graphs using PCA confidence and search-space reduction strategies.

---

# 11. Exam flags and high-value revision points

## Explicit exam-style flag from slides

**Be able to demonstrate transaction table construction cases by examples.**

This appears on the transaction table construction slide. It is especially important for:

- simple concept inclusion:

$$
C \sqsubseteq D
$$

- conjunction inclusion:

$$
C \sqcap D \sqsubseteq E
$$

- existential restriction columns:

$$
\exists r.C
$$

- role inclusion and role-composition-style tables

Especially know how to decide when a column such as:

$$
\exists r_1.C_{11}
$$

gets value 1:

$$
\langle a,r_1,b\rangle
\quad \text{and} \quad
\langle b,rdf:type,C_{11}\rangle
$$

must both exist.

## Revision-critical formulas

These were not all explicitly labelled “exam,” but they are central in the slides:

1. Association rule support:

$$
Support(X)=|\{t\in D:X\subseteq t\}|
$$

2. Association rule confidence:

$$
Confidence(X \Rightarrow Y)=
\frac{Support(X\cup Y)}{Support(X)}
$$

3. Horn rule support:

$$
supp(B \Rightarrow r(x,y))
=
\#(x,y):\exists z_1,\dots,z_m:B\land r(x,y)
$$

4. Head coverage:

$$
hc(B \Rightarrow r(x,y))
=
\frac{supp(B \Rightarrow r(x,y))}{size(r)}
$$

5. Standard confidence:

$$
conf(B \Rightarrow r(x,y))
=
\frac{supp(B \Rightarrow r(x,y))}
{\#(x,y):\exists z_1,\dots,z_m:B}
$$

6. PCA confidence:

$$
conf_{pca}(B \Rightarrow r(x,y))
=
\frac{supp(B \Rightarrow r(x,y))}
{\#(x,y):\exists z_1,\dots,z_m,y':B\land r(x,y')}
$$

---

# 12. Connections to other lectures/courses

- **Association rule mining** is assumed background from a database or data science unit.
- **SPARQL queries and graph databases** are used for efficient terminology acquisition, transaction table construction, and AMIE implementation, but are not taught in this lecture.
- The lecturer mentions this will be covered in another unit, specifically Data Engineering Technologies / COMP63502.
- **Horn rules and ontological schema** are connected because both describe reusable logical structure in a knowledge graph.
- **Markov Logic Networks** connect first-order logic to Markov networks for uncertain reasoning.

---

# 13. Unclear / transcript-garbled sections to revisit

- [UNCLEAR] “Advanced Topics and Motor Plantation and Reading” = clearly the course title **Advanced Topics in Knowledge Representation and Reasoning**.
- [UNCLEAR] “Home Rule,” “Honolulu,” “Hong Kong,” “Honjo” = **Horn rule**.
- [UNCLEAR] “Amy,” “Emmy,” “email,” “image” = **AMIE**.
- [UNCLEAR] “I2” / “Oita” = likely **OWL 2**.
- [UNCLEAR] “extension restriction” = **existential restriction**.
- [UNCLEAR] “row composition” = likely **role composition**.
- [UNCLEAR] “Java, our API or Portage” = likely a tool reference such as Java OWL API or Protégé, but the slides do not confirm.
- [UNCLEAR] The mini knowledge graph table sometimes shows “Pairs,” but the example uses **Paris**.
- [UNCLEAR] The exact role-composition row in the transaction-table construction slide is hard to read from OCR; revisit slide 8 visually if this is examined.
- [UNCLEAR] MLN detail is missing because the uploaded set does not include the detailed MLN transcript segment.
