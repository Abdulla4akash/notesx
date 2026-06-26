---
subject: COMP64602
chapter: 51
title: "Week 1 — Question Bank"
language: en
---

# COMP64602 Week 1 — Worked Practice Question Bank

**Topic:** Knowledge Graphs, RDF/RDFS/OWL, KG construction, uncertain reasoning, fuzzy RDF/RDFS/OWL  
**Source read:** `COMP64602 Chapter 1 - Week 1.mht`  
**Use:** Cover the solution blocks and attempt the questions first. The solutions model the step-by-step working style expected for procedural questions.

---

## Task types identified from the sheet

The sheet contains these examinable procedural/computational task types:

1. Parse an RDF triple into subject, predicate, and object.
2. Convert between RDF triples and labelled graph edges.
3. Apply RDFS subclass reasoning.
4. Apply RDFS subproperty reasoning.
5. Apply RDFS domain/range typing.
6. Decide whether RDF, RDFS, or OWL is needed for a modelling statement.
7. Express OWL constraints using Description Logic constructors: `⊓`, `⊔`, `∃`, `∀`, `¬`, and cardinality.
8. Use OWL universal and existential restrictions for simple inference.
9. Match table cells/columns/relations to an existing KG and extract candidate triples.
10. Identify KG construction steps from text: NER, entity linking, entity typing, relation extraction, canonicalisation.
11. Distinguish human/crowdsourced/domain-expert KG construction from machine extraction.
12. Identify when uncertain reasoning is needed.
13. Distinguish Bayesian networks from Markov networks.
14. Read local conditional probabilities in a Bayesian network.
15. Read potential-function scores in a Markov network.
16. Compute basic fuzzy AND/OR/NOT.
17. Compute fuzzy set membership interpretations.
18. Compute T-norms: minimum, product, Łukasiewicz.
19. Compute T-conorms: maximum, probabilistic sum, Łukasiewicz.
20. Use T-norms for fuzzy RDF/RDFS graded inference.
21. Use T-norms for fuzzy OWL graded inference.
22. Handle edge cases where RDFS is too weak, or fuzzy/probabilistic/non-monotonic methods give different conclusions.

Not drilled here because the sheet only names them briefly without teaching their syntax or algorithms: full SPARQL querying, Datalog rule writing, SWRL rule syntax, SHACL validation syntax, full Bayesian network CPT inference, and full Markov-network normalisation over large graphs.

---

# Section A — Mechanical / single-step drills

## A1. RDF triple parsing — running example

Given the RDF triple:

```text
<Manchester Baby, hasDeveloper, Tom Kilburn>
```

Identify the subject, predicate, object, graph edge, and plain-English meaning.

### Solution A1

**Step 1 — Match the triple to RDF form.**  
RDF facts have the form:

```text
<Subject, Predicate, Object>
```

**Step 2 — Extract each component.**

- Subject: `Manchester Baby`
- Predicate: `hasDeveloper`
- Object: `Tom Kilburn`

**Step 3 — Convert to graph edge form.**

```text
Manchester Baby --hasDeveloper--> Tom Kilburn
```

**Step 4 — State the meaning.**  
The entity `Manchester Baby` is connected to the entity `Tom Kilburn` by the relation `hasDeveloper`.

---

## A2. Graph edge to RDF triples

Convert the following labelled graph edges into RDF triples:

```text
Ada --workedAt--> ComputingLab
ComputingLab --locatedIn--> Manchester
Ada --hasColleague--> Ben
```

### Solution A2

**Step 1 — Use the graph-to-triple pattern.**

```text
source node --edge label--> target node
```

becomes:

```text
<source node, edge label, target node>
```

**Step 2 — Convert each edge.**

```text
<Ada, workedAt, ComputingLab>
<ComputingLab, locatedIn, Manchester>
<Ada, hasColleague, Ben>
```

**Step 3 — Interpret the result.**  
These triples form a small multi-relational graph: entities are nodes, and predicates are labelled edges.

---

## A3. RDF assertion or RDFS schema statement?

Classify each triple as an RDF instance-level assertion or an RDFS schema-level statement.

```text
<Tom Kilburn, rdf:type, Computer Scientist>
<Computer Scientist, rdfs:subClassOf, Scientist>
<hasDeveloper, rdfs:range, People>
<Alan Turing, hasColleague, Tom Kilburn>
<hasTeammate, rdfs:subPropertyOf, hasColleague>
```

### Solution A3

**Step 1 — Use the discriminator.**  
Ask: is the triple about a concrete entity/fact, or about classes/properties?

- Concrete entity/fact → RDF assertion.
- Class/property vocabulary → RDFS schema statement.

**Step 2 — Classify each triple.**

| Triple | Classification | Reason |
|---|---|---|
| `<Tom Kilburn, rdf:type, Computer Scientist>` | RDF assertion using an RDF/RDFS typing predicate | It says an individual belongs to a class. |
| `<Computer Scientist, rdfs:subClassOf, Scientist>` | RDFS schema | It relates one class to a broader class. |
| `<hasDeveloper, rdfs:range, People>` | RDFS schema | It constrains the object type of a property. |
| `<Alan Turing, hasColleague, Tom Kilburn>` | RDF assertion | It states a concrete relationship between individuals. |
| `<hasTeammate, rdfs:subPropertyOf, hasColleague>` | RDFS schema | It relates one property to a broader property. |

---

## A4. RDFS subclass reasoning — running example

Given:

```text
<Tom Kilburn, rdf:type, Computer Scientist>
<Computer Scientist, rdfs:subClassOf, Scientist>
```

What can be inferred?

### Solution A4

**Step 1 — Identify the rule pattern.**

```text
<x, rdf:type, A>
<A, rdfs:subClassOf, B>
```

allows:

```text
<x, rdf:type, B>
```

**Step 2 — Match variables.**

- `x = Tom Kilburn`
- `A = Computer Scientist`
- `B = Scientist`

**Step 3 — Infer the new triple.**

```text
<Tom Kilburn, rdf:type, Scientist>
```

**Step 4 — Explain.**  
If Tom Kilburn is a computer scientist, and every computer scientist is a scientist, then Tom Kilburn is a scientist.

---

## A5. RDFS subproperty reasoning

Given:

```text
<hasTeammate, rdfs:subPropertyOf, hasColleague>
<Alice, hasTeammate, Bob>
```

What can be inferred?

### Solution A5

**Step 1 — Identify the rule pattern.**

```text
<p, rdfs:subPropertyOf, q>
<s, p, o>
```

allows:

```text
<s, q, o>
```

**Step 2 — Match variables.**

- `p = hasTeammate`
- `q = hasColleague`
- `s = Alice`
- `o = Bob`

**Step 3 — Infer the new triple.**

```text
<Alice, hasColleague, Bob>
```

**Step 4 — Explain.**  
Every `hasTeammate` relation is also a `hasColleague` relation.

---

## A6. RDFS range reasoning

Given:

```text
<hasDeveloper, rdfs:range, People>
<Manchester Baby, hasDeveloper, Tom Kilburn>
```

What type can be inferred for `Tom Kilburn`?

### Solution A6

**Step 1 — Identify the range rule pattern.**

```text
<p, rdfs:range, C>
<s, p, o>
```

allows:

```text
<o, rdf:type, C>
```

**Step 2 — Match variables.**

- `p = hasDeveloper`
- `C = People`
- `s = Manchester Baby`
- `o = Tom Kilburn`

**Step 3 — Infer the type.**

```text
<Tom Kilburn, rdf:type, People>
```

**Step 4 — Explain.**  
If the range of `hasDeveloper` is `People`, then anything appearing as the object of `hasDeveloper` is inferred to be a `People` instance.

---

## A7. RDFS domain reasoning

Given:

```text
<hasDeveloper, rdfs:domain, ComputingMachine>
<Manchester Baby, hasDeveloper, Tom Kilburn>
```

What type can be inferred for `Manchester Baby`?

### Solution A7

**Step 1 — Identify the domain rule pattern.**

```text
<p, rdfs:domain, C>
<s, p, o>
```

allows:

```text
<s, rdf:type, C>
```

**Step 2 — Match variables.**

- `p = hasDeveloper`
- `C = ComputingMachine`
- `s = Manchester Baby`
- `o = Tom Kilburn`

**Step 3 — Infer the type.**

```text
<Manchester Baby, rdf:type, ComputingMachine>
```

**Step 4 — Explain.**  
If the domain of `hasDeveloper` is `ComputingMachine`, then anything appearing as the subject of `hasDeveloper` is inferred to be a `ComputingMachine`.

---

## A8. OWL universal restriction

Given the OWL axiom:

```text
Cat ⊑ ∀hasParent.Cat
```

and the facts:

```text
Felix rdf:type Cat
Felix hasParent Luna
```

What can be inferred?

### Solution A8

**Step 1 — Read the OWL axiom.**

```text
Cat ⊑ ∀hasParent.Cat
```

means: if something is a `Cat`, then all of its `hasParent` values are also `Cat`.

**Step 2 — Check the individual type.**

```text
Felix rdf:type Cat
```

So the rule applies to `Felix`.

**Step 3 — Check the relevant relation.**

```text
Felix hasParent Luna
```

So `Luna` is one of Felix’s parents.

**Step 4 — Infer the parent’s type.**

```text
Luna rdf:type Cat
```

---

## A9. OWL existential restriction

Given the OWL axiom:

```text
∃hasParent.Cat ⊑ Cat
```

and the facts:

```text
Milo hasParent Luna
Luna rdf:type Cat
```

What can be inferred about `Milo`?

### Solution A9

**Step 1 — Read the OWL axiom.**

```text
∃hasParent.Cat ⊑ Cat
```

means: if something has at least one parent that is a `Cat`, then that thing is a `Cat`.

**Step 2 — Check whether the existential condition holds.**  
`Milo` has a parent:

```text
Milo hasParent Luna
```

and that parent is a cat:

```text
Luna rdf:type Cat
```

So `Milo` satisfies `∃hasParent.Cat`.

**Step 3 — Infer the class membership.**

```text
Milo rdf:type Cat
```

---

## A10. OWL cardinality expression

Write the OWL-style expression for:

> Every human has exactly two parents.

### Solution A10

**Step 1 — Identify the class being constrained.**  
The class is:

```text
Human
```

**Step 2 — Identify the property being counted.**  
The property is:

```text
hasParent
```

**Step 3 — Identify the cardinality.**  
The phrase “exactly two” means:

```text
= 2
```

**Step 4 — Write the OWL axiom.**

```text
Human ⊑ (= 2 hasParent)
```

**Step 5 — Explain.**  
Every instance of `Human` belongs to the class of things with exactly two `hasParent` relations.

---

## A11. Basic fuzzy AND/OR/NOT

Let:

```text
a = 0.8
b = 0.3
```

Using the basic fuzzy connectives from the sheet, compute:

```text
a AND b
a OR b
NOT a
```

### Solution A11

**Step 1 — Recall the basic fuzzy connectives.**

```text
AND → min(a, b)
OR  → max(a, b)
NOT → 1 - a
```

**Step 2 — Compute AND.**

```text
min(0.8, 0.3) = 0.3
```

**Step 3 — Compute OR.**

```text
max(0.8, 0.3) = 0.8
```

**Step 4 — Compute NOT.**

```text
1 - 0.8 = 0.2
```

**Final answers:**

```text
a AND b = 0.3
a OR b  = 0.8
NOT a   = 0.2
```

---

## A12. T-norms for fuzzy AND — running Manchester example

Given two fuzzy truth degrees:

```text
γ₁ = 0.7
γ₂ = 0.5
```

Compute the minimum, product, and Łukasiewicz T-norms.

### Solution A12

**Step 1 — Minimum T-norm.**

```text
T_min(γ₁, γ₂) = min(γ₁, γ₂)
T_min(0.7, 0.5) = 0.5
```

**Step 2 — Product T-norm.**

```text
T_prod(γ₁, γ₂) = γ₁ × γ₂
T_prod(0.7, 0.5) = 0.7 × 0.5 = 0.35
```

**Step 3 — Łukasiewicz T-norm.**

```text
T_Luk(γ₁, γ₂) = max(0, γ₁ + γ₂ - 1)
T_Luk(0.7, 0.5) = max(0, 0.7 + 0.5 - 1)
                 = max(0, 0.2)
                 = 0.2
```

**Final answers:**

```text
Minimum      = 0.5
Product      = 0.35
Łukasiewicz  = 0.2
```

---

## A13. T-conorms for fuzzy OR

Given two fuzzy truth degrees:

```text
γ₁ = 0.7
γ₂ = 0.5
```

Compute the maximum, probabilistic sum, and Łukasiewicz T-conorms.

### Solution A13

**Step 1 — Maximum T-conorm.**

```text
S_max(γ₁, γ₂) = max(γ₁, γ₂)
S_max(0.7, 0.5) = 0.7
```

**Step 2 — Probabilistic sum.**

```text
S_prob(γ₁, γ₂) = γ₁ + γ₂ - γ₁γ₂
S_prob(0.7, 0.5) = 0.7 + 0.5 - (0.7 × 0.5)
                 = 1.2 - 0.35
                 = 0.85
```

**Step 3 — Łukasiewicz T-conorm.**

```text
S_Luk(γ₁, γ₂) = min(1, γ₁ + γ₂)
S_Luk(0.7, 0.5) = min(1, 1.2) = 1
```

**Final answers:**

```text
Maximum            = 0.7
Probabilistic sum  = 0.85
Łukasiewicz        = 1
```

---

# Section B — Multi-condition checks

## B1. Two-step RDFS subclass chain

Given:

```text
<ResearchAssistant, rdfs:subClassOf, Researcher>
<Researcher, rdfs:subClassOf, Person>
<Noor, rdf:type, ResearchAssistant>
```

Infer all types for `Noor` that follow from the subclass chain.

### Solution B1

**Step 1 — Start with the explicit type.**

```text
<Noor, rdf:type, ResearchAssistant>
```

**Step 2 — Apply the first subclass axiom.**

```text
<ResearchAssistant, rdfs:subClassOf, Researcher>
```

So infer:

```text
<Noor, rdf:type, Researcher>
```

**Step 3 — Apply the second subclass axiom.**

```text
<Researcher, rdfs:subClassOf, Person>
```

Since `Noor` is now known to be a `Researcher`, infer:

```text
<Noor, rdf:type, Person>
```

**Final inferred types:**

```text
<Noor, rdf:type, Researcher>
<Noor, rdf:type, Person>
```

---

## B2. Subproperty plus domain/range reasoning

Given:

```text
<teachesModule, rdfs:subPropertyOf, teaches>
<teaches, rdfs:domain, Lecturer>
<teaches, rdfs:range, Module>
<DrChen, teachesModule, COMP64602>
```

Infer all new triples.

### Solution B2

**Step 1 — Apply subproperty reasoning.**

Pattern:

```text
<p, rdfs:subPropertyOf, q>
<s, p, o>
→ <s, q, o>
```

Here:

```text
teachesModule ⊑ teaches
DrChen teachesModule COMP64602
```

So infer:

```text
<DrChen, teaches, COMP64602>
```

**Step 2 — Apply domain reasoning to the broader property.**

```text
<teaches, rdfs:domain, Lecturer>
<DrChen, teaches, COMP64602>
```

So infer:

```text
<DrChen, rdf:type, Lecturer>
```

**Step 3 — Apply range reasoning to the broader property.**

```text
<teaches, rdfs:range, Module>
<DrChen, teaches, COMP64602>
```

So infer:

```text
<COMP64602, rdf:type, Module>
```

**Final inferred triples:**

```text
<DrChen, teaches, COMP64602>
<DrChen, rdf:type, Lecturer>
<COMP64602, rdf:type, Module>
```

---

## B3. Minimal language choice: RDF, RDFS, or OWL?

For each statement, choose the minimal representation language needed: RDF, RDFS, or OWL.

1. `Alan Turing contributedTo Manchester Mark I`.
2. `Computer Scientist` is a subclass of `Scientist`.
3. The range of `hasDeveloper` is `People`.
4. Every human has exactly two parents.
5. If something is a cat, then all its parents are cats.
6. `hasAncestor` is transitive.
7. Two class names are equivalent.

### Solution B3

**Step 1 — Use the discriminator.**

- Concrete fact only → RDF.
- Class/property schema such as subclass, domain, range, subproperty → RDFS.
- Complex logical constraints such as cardinality, transitivity, equivalence, universal/existential restrictions → OWL.

**Step 2 — Classify each statement.**

| Statement | Minimal language | Reason |
|---|---:|---|
| `Alan Turing contributedTo Manchester Mark I` | RDF | It is a concrete triple/fact. |
| `Computer Scientist` subclass of `Scientist` | RDFS | `rdfs:subClassOf` is RDFS schema. |
| Range of `hasDeveloper` is `People` | RDFS | `rdfs:range` is RDFS schema. |
| Every human has exactly two parents | OWL | Requires cardinality. |
| Cat’s parents are cats | OWL | Requires a universal restriction: `Cat ⊑ ∀hasParent.Cat`. |
| `hasAncestor` is transitive | OWL | RDFS cannot express property characteristics such as transitivity. |
| Two class names are equivalent | OWL | RDFS lacks full equivalence definitions. |

---

## B4. Table-to-KG matching — Formula 1 running example

Existing KG facts:

```text
dbp:Vettel rdf:type dbp:RacingDriver
dbp:Vettel races-for dbp:Ferrari
dbp:Vettel lives-in dbp:Germany
```

Table:

| Driver | Team | Country |
|---|---|---|
| Alonso | McLaren | Spain |
| Hamilton | Mercedes | England |
| Sebastian Vettel | Ferrari | Germany |

Perform: cell-to-entity matching, column type matching, inter-column relation matching, and candidate KG population for the Hamilton row.

### Solution B4

**Step 1 — Cell-to-entity matching.**  
Use known KG entities to link table cells to existing entities.

From the existing KG:

```text
Sebastian Vettel → dbp:Vettel
Ferrari          → dbp:Ferrari
Germany          → dbp:Germany
```

**Step 2 — Column type matching.**  
The first column contains racing drivers.

```text
Driver column → dbp:RacingDriver
```

**Step 3 — Inter-column relation matching.**  
The existing KG shows:

```text
dbp:Vettel races-for dbp:Ferrari
dbp:Vettel lives-in dbp:Germany
```

So infer column relations:

```text
Driver + Team    → races-for
Driver + Country → lives-in
```

**Step 4 — Candidate KG population for Hamilton.**  
From row:

```text
Hamilton | Mercedes | England
```

construct candidate facts:

```text
<Hamilton, rdf:type, RacingDriver>
<Hamilton, races-for, Mercedes>
<Hamilton, lives-in, England>
```

**Step 5 — State what KG population means.**  
KG population means using extracted/matched information to add new entities and facts to an existing KG.

---

## B5. KG construction from text

Given the sentence:

> Dr Amina Khan works at North Hospital in Leeds.

Apply the text-to-KG construction steps taught in the sheet: named entity recognition, entity linking, entity typing, relation extraction, and canonicalisation.

### Solution B5

**Step 1 — Named Entity Recognition.**  
Identify entity mentions in the text.

```text
Dr Amina Khan
North Hospital
Leeds
```

**Step 2 — Entity Linking.**  
Link each mention to an existing KG entity if possible.

```text
Dr Amina Khan  → kg:AminaKhan        if known
North Hospital → kg:NorthHospital    if known
Leeds          → kg:Leeds            if known
```

If no entity exists, create a new candidate entity.

**Step 3 — Entity Typing.**  
Assign likely classes.

```text
kg:AminaKhan      rdf:type Person
kg:NorthHospital  rdf:type Hospital
kg:Leeds          rdf:type City
```

**Step 4 — Relation Extraction.**  
Extract relationships from the sentence.

```text
kg:AminaKhan worksAt kg:NorthHospital
kg:NorthHospital locatedIn kg:Leeds
```

**Step 5 — Canonicalisation.**  
Standardise names/URIs.

```text
"Dr Amina Khan" → kg:AminaKhan
"North Hospital" → kg:NorthHospital
```

**Final candidate triples:**

```text
<kg:AminaKhan, rdf:type, Person>
<kg:NorthHospital, rdf:type, Hospital>
<kg:Leeds, rdf:type, City>
<kg:AminaKhan, worksAt, kg:NorthHospital>
<kg:NorthHospital, locatedIn, kg:Leeds>
```

---

## B6. Bayesian network: what can and cannot be computed?

The sheet’s Bayesian network has:

```text
Rain      Snow
 \       /
 SlipperyTrail
      |
  GoHiking
```

and example probabilities:

```text
P(SlipperyTrail | Rain) = 0.6
P(SlipperyTrail | Snow) = 0.95
P(GoHiking | SlipperyTrail) = 0.1
```

Question: if `Rain=True`, what can you read directly, and what can you **not** compute from these values alone?

### Solution B6

**Step 1 — Identify the graph type.**  
This is a Bayesian network because it is directed and acyclic.

**Step 2 — Read direct local conditional information.**  
The sheet gives:

```text
P(SlipperyTrail | Rain) = 0.6
```

So, given rain, the local conditional probability of a slippery trail is `0.6`.

**Step 3 — Read the next local conditional.**  
The sheet also gives:

```text
P(GoHiking | SlipperyTrail) = 0.1
```

So, if the trail is slippery, the local conditional probability of going hiking is `0.1`.

**Step 4 — State what cannot be computed from the given values alone.**  
You cannot fully compute:

```text
P(GoHiking | Rain)
```

from these values alone, because the network also has `Snow` as another parent of `SlipperyTrail`, and the full conditional probability table for `SlipperyTrail` is not provided.

**Step 5 — Safe exam answer.**  
You can read local conditional probabilities, but full probability propagation requires the missing probabilities/CPTs or an explicit simplifying assumption.

---

## B7. Markov network potential lookup and MAP over one potential

A Markov network potential is given by:

```text
ϕ(SlipperyTrail, GoHiking) =
10, if SlipperyTrail = True,  GoHiking = False
1,  if SlipperyTrail = True,  GoHiking = True
3,  otherwise
```

Using this potential only, which assignment has the highest score?

### Solution B7

**Step 1 — List the possible assignments.**

| SlipperyTrail | GoHiking | Potential score |
|---|---|---:|
| True | False | 10 |
| True | True | 1 |
| False | False | 3 |
| False | True | 3 |

**Step 2 — Find the maximum score.**  
The maximum potential score is:

```text
10
```

**Step 3 — Identify the corresponding assignment.**

```text
SlipperyTrail = True
GoHiking = False
```

**Step 4 — Interpret carefully.**  
This is the highest-scoring assignment under this potential. The number `10` is a potential score, not directly a probability.

---

## B8. Fuzzy RDF/RDFS graded subclass inference

Given fuzzy RDF/RDFS facts:

```text
<BeachTown, rdfs:subClassOf, TouristPlace, 0.8>
<Seabury, rdf:type, BeachTown, 0.6>
```

Infer the degree of:

```text
<Seabury, rdf:type, TouristPlace, ?>
```

using minimum, product, and Łukasiewicz T-norms.

### Solution B8

**Step 1 — Identify the crisp inference pattern.**

```text
<x, rdf:type, A>
<A, rdfs:subClassOf, B>
→ <x, rdf:type, B>
```

**Step 2 — Identify the two fuzzy degrees.**

```text
γ₁ = 0.6   from Seabury rdf:type BeachTown
γ₂ = 0.8   from BeachTown subclass TouristPlace
```

**Step 3 — Minimum T-norm.**

```text
min(0.6, 0.8) = 0.6
```

So:

```text
<Seabury, rdf:type, TouristPlace, 0.6>
```

**Step 4 — Product T-norm.**

```text
0.6 × 0.8 = 0.48
```

So:

```text
<Seabury, rdf:type, TouristPlace, 0.48>
```

**Step 5 — Łukasiewicz T-norm.**

```text
max(0, 0.6 + 0.8 - 1) = max(0, 0.4) = 0.4
```

So:

```text
<Seabury, rdf:type, TouristPlace, 0.4>
```

---

## B9. Fuzzy OR from two pieces of evidence

A statement is supported by two alternative pieces of evidence:

```text
Evidence 1 degree = 0.4
Evidence 2 degree = 0.7
```

Compute the OR degree using maximum, probabilistic sum, and Łukasiewicz T-conorm.

### Solution B9

**Step 1 — Maximum T-conorm.**

```text
max(0.4, 0.7) = 0.7
```

**Step 2 — Probabilistic sum.**

```text
0.4 + 0.7 - (0.4 × 0.7)
= 1.1 - 0.28
= 0.82
```

**Step 3 — Łukasiewicz T-conorm.**

```text
min(1, 0.4 + 0.7)
= min(1, 1.1)
= 1
```

**Final answers:**

```text
Maximum            = 0.7
Probabilistic sum  = 0.82
Łukasiewicz        = 1
```

---

## B10. Non-monotonic reasoning with an exception

Initial knowledge:

```text
Birds normally fly.
Pingu is a bird.
```

New knowledge added later:

```text
Pingu is a penguin.
Penguins normally do not fly.
```

What happens to the conclusion that `Pingu flies`?

### Solution B10

**Step 1 — Draw the initial default conclusion.**  
From:

```text
Birds normally fly.
Pingu is a bird.
```

we initially conclude:

```text
Pingu normally flies.
```

**Step 2 — Add the new exception information.**

```text
Pingu is a penguin.
Penguins normally do not fly.
```

**Step 3 — Resolve the conflict.**  
The more specific default about penguins overrides the general default about birds.

**Step 4 — Retract the old conclusion.**  
The previous conclusion:

```text
Pingu flies.
```

is no longer accepted.

**Step 5 — State why this is non-monotonic.**  
Adding new knowledge invalidated a previous conclusion. That is exactly non-monotonic reasoning.

---

# Section C — Building things from scratch

## C1. Build an RDF graph from plain English

Represent the following as RDF triples and graph edges:

> Grace Hopper developed COBOL. COBOL influenced ModernBusinessSoftware. Grace Hopper hasColleague Howard Aiken.

### Solution C1

**Step 1 — Identify entities.**

```text
Grace Hopper
COBOL
ModernBusinessSoftware
Howard Aiken
```

**Step 2 — Identify relations.**

```text
developed
influenced
hasColleague
```

**Step 3 — Write RDF triples.**

```text
<Grace Hopper, developed, COBOL>
<COBOL, influenced, ModernBusinessSoftware>
<Grace Hopper, hasColleague, Howard Aiken>
```

**Step 4 — Write graph edges.**

```text
Grace Hopper --developed--> COBOL
COBOL --influenced--> ModernBusinessSoftware
Grace Hopper --hasColleague--> Howard Aiken
```

**Step 5 — Check the model.**  
Each fact is a labelled relation between a subject entity and an object entity.

---

## C2. Add RDFS schema and infer types

Start with RDF facts:

```text
<Grace Hopper, developed, COBOL>
<COBOL, influenced, ModernBusinessSoftware>
```

Add this RDFS schema:

```text
<developed, rdfs:domain, Person>
<developed, rdfs:range, ProgrammingLanguage>
<ProgrammingLanguage, rdfs:subClassOf, Technology>
```

Infer all types that follow.

### Solution C2

**Step 1 — Apply domain reasoning to `developed`.**

```text
<developed, rdfs:domain, Person>
<Grace Hopper, developed, COBOL>
```

Infer:

```text
<Grace Hopper, rdf:type, Person>
```

**Step 2 — Apply range reasoning to `developed`.**

```text
<developed, rdfs:range, ProgrammingLanguage>
<Grace Hopper, developed, COBOL>
```

Infer:

```text
<COBOL, rdf:type, ProgrammingLanguage>
```

**Step 3 — Apply subclass reasoning.**

```text
<ProgrammingLanguage, rdfs:subClassOf, Technology>
<COBOL, rdf:type, ProgrammingLanguage>
```

Infer:

```text
<COBOL, rdf:type, Technology>
```

**Final inferred types:**

```text
<Grace Hopper, rdf:type, Person>
<COBOL, rdf:type, ProgrammingLanguage>
<COBOL, rdf:type, Technology>
```

---

## C3. Build OWL axioms for a small domain

Write OWL-style axioms for these modelling requirements:

1. Every registered vehicle has at least one owner.
2. Every electric car is a car.
3. An eco car is exactly a car that has some low-emission rating.
4. Every bicycle has exactly two wheels.

### Solution C3

**Step 1 — Requirement 1: at least one owner.**  
“At least one” is existential restriction.

```text
RegisteredVehicle ⊑ ∃hasOwner.Owner
```

**Step 2 — Requirement 2: electric car is a car.**  
This is a simple subclass axiom.

```text
ElectricCar ⊑ Car
```

**Step 3 — Requirement 3: exact class definition using conjunction and existential restriction.**  
“Exactly a car that has some low-emission rating” means equivalence.

```text
EcoCar ≡ Car ⊓ ∃hasEmissionRating.LowEmissionRating
```

**Step 4 — Requirement 4: exactly two wheels.**  
This is cardinality.

```text
Bicycle ⊑ (= 2 hasWheel)
```

**Step 5 — Identify why OWL is needed.**  
RDFS cannot express existential restrictions, exact equivalence definitions, or cardinality constraints.

---

## C4. Build a text-to-KG extraction pipeline

You are given a small corpus:

> Lewis Hamilton races for Mercedes. Mercedes is based in Germany.

Construct a KG extraction pipeline output using the sheet’s steps.

### Solution C4

**Step 1 — Gather textual corpus.**  
Input text:

```text
Lewis Hamilton races for Mercedes. Mercedes is based in Germany.
```

**Step 2 — Named Entity Recognition.**  
Find mentions:

```text
Lewis Hamilton
Mercedes
Germany
```

**Step 3 — Entity Linking.**  
Map mentions to KG entities:

```text
Lewis Hamilton → kg:Hamilton
Mercedes       → kg:Mercedes
Germany        → kg:Germany
```

**Step 4 — Entity Typing.**  
Assign classes:

```text
kg:Hamilton rdf:type RacingDriver
kg:Mercedes rdf:type RacingTeam
kg:Germany rdf:type Country
```

**Step 5 — Relation Extraction.**  
Extract relations:

```text
kg:Hamilton races-for kg:Mercedes
kg:Mercedes based-in kg:Germany
```

**Step 6 — Store as KG triples.**

```text
<kg:Hamilton, rdf:type, RacingDriver>
<kg:Mercedes, rdf:type, RacingTeam>
<kg:Germany, rdf:type, Country>
<kg:Hamilton, races-for, kg:Mercedes>
<kg:Mercedes, based-in, kg:Germany>
```

**Step 7 — Note expected quality issue.**  
Machine extraction scales well, but the sheet warns that large automatically extracted graphs are often lower quality than expert-maintained ontologies.

---

## C5. Build a fuzzy RDFS chain with three degrees

Given:

```text
<PhoneX, rdf:type, CheapPhone, 0.8>
<CheapPhone, rdfs:subClassOf, BudgetDevice, 0.7>
<BudgetDevice, rdfs:subClassOf, PopularGift, 0.6>
```

Infer the degree for:

```text
<PhoneX, rdf:type, PopularGift, ?>
```

using minimum, product, and Łukasiewicz T-norms.

### Solution C5

**Step 1 — Identify the chain.**

```text
PhoneX type CheapPhone
CheapPhone subclass BudgetDevice
BudgetDevice subclass PopularGift
```

So the crisp inference would be:

```text
<PhoneX, rdf:type, PopularGift>
```

**Step 2 — List the degrees to combine by fuzzy AND.**

```text
0.8, 0.7, 0.6
```

**Step 3 — Minimum T-norm.**

```text
min(0.8, 0.7, 0.6) = 0.6
```

So:

```text
<PhoneX, rdf:type, PopularGift, 0.6>
```

**Step 4 — Product T-norm.**

```text
0.8 × 0.7 × 0.6 = 0.336
```

So:

```text
<PhoneX, rdf:type, PopularGift, 0.336>
```

**Step 5 — Łukasiewicz T-norm.**  
Combine step by step.

First combine `0.8` and `0.7`:

```text
max(0, 0.8 + 0.7 - 1)
= max(0, 0.5)
= 0.5
```

Then combine with `0.6`:

```text
max(0, 0.5 + 0.6 - 1)
= max(0, 0.1)
= 0.1
```

So:

```text
<PhoneX, rdf:type, PopularGift, 0.1>
```

---

## C6. Build a fuzzy OWL inference using the car pattern

Use the fuzzy car ontology pattern from the sheet:

```text
Sedan ⊑ Car
ModerateCar ≡ Car ⊓ ∃HasPrice.ModeratePrice
<CheapPrice ⊑ ModeratePrice, 0.6>
<b : Sedan ⊓ ∃HasPrice.CheapPrice, 0.8>
```

Infer the degree of:

```text
b : ModerateCar
```

using product and minimum T-norms.

### Solution C6

**Step 1 — Extract crisp class consequences.**  
From:

```text
b : Sedan
Sedan ⊑ Car
```

infer:

```text
b : Car
```

From:

```text
b : ∃HasPrice.CheapPrice
CheapPrice ⊑ ModeratePrice
```

infer:

```text
b : ∃HasPrice.ModeratePrice
```

**Step 2 — Use the definition of `ModerateCar`.**

```text
ModerateCar ≡ Car ⊓ ∃HasPrice.ModeratePrice
```

So if `b` is a car and has some moderate price, infer:

```text
b : ModerateCar
```

**Step 3 — Identify fuzzy degrees involved.**

```text
0.8 from the ABox membership axiom
0.6 from CheapPrice ⊑ ModeratePrice
```

Other listed axioms have no explicit degree, so treat them as degree `1.0` as in the sheet.

**Step 4 — Product T-norm.**

```text
0.8 × 0.6 = 0.48
```

So:

```text
𝒪 ⊨ <b : ModerateCar, 0.48>
```

**Step 5 — Minimum T-norm.**

```text
min(0.8, 0.6) = 0.6
```

So:

```text
𝒪 ⊨ <b : ModerateCar, 0.6>
```

---

## C7. Build a method selector for uncertainty cases

Choose the best reasoning style from the sheet for each case: probabilistic reasoning, fuzzy logic, or non-monotonic reasoning.

1. “There is a 50% chance of precipitation.”
2. “This hill is high to degree 0.7.”
3. “Birds normally fly, but penguins normally do not.”
4. “Rain tends to imply a slippery trail with probability 0.75.”
5. “Cheap price partially overlaps with moderate price.”

### Solution C7

**Step 1 — Use the discriminator.**

- Numerical probability/chance/likelihood → probabilistic reasoning.
- Degree of truth or graded class membership → fuzzy logic.
- Default rule with exceptions/retraction → non-monotonic reasoning.

**Step 2 — Classify each case.**

| Case | Reasoning style | Why |
|---|---|---|
| 50% chance of precipitation | Probabilistic reasoning | It is explicitly probability-based. |
| Hill is high to degree 0.7 | Fuzzy logic | “High” is a graded/vague predicate. |
| Birds normally fly, penguins normally do not | Non-monotonic reasoning | A default conclusion can be retracted by an exception. |
| Rain implies slippery trail with probability 0.75 | Probabilistic reasoning | The rule has a probability. |
| Cheap price partially overlaps with moderate price | Fuzzy logic / fuzzy OWL | The boundary between classes is gradual rather than crisp. |

---

# Section D — Hard edge cases where methods disagree or break down

## D1. RDFS cannot express “parents of cats are cats”

Try to model:

> If something is a cat, then all of its parents are cats.

Can RDFS express this? If not, write the OWL axiom.

### Solution D1

**Step 1 — Identify the logical shape.**  
The statement links the subject’s class to the class of all objects reached through a property:

```text
If x is a Cat, then every y such that x hasParent y is also a Cat.
```

**Step 2 — Check RDFS capability.**  
RDFS can express simple schema facts such as:

```text
subClassOf
subPropertyOf
domain
range
```

But the sheet says RDFS cannot express complex domain-range constraints together in this kind of conditional way.

**Step 3 — Use OWL universal restriction.**

```text
Cat ⊑ ∀hasParent.Cat
```

**Step 4 — Explain.**  
This says every `hasParent` value of a `Cat` must be a `Cat`.

---

## D2. RDFS cannot express “if it has a cat parent, it is a cat”

Try to model:

> If something has at least one parent that is a cat, then it is a cat.

Can RDFS express this? If not, write the OWL axiom.

### Solution D2

**Step 1 — Identify the logical shape.**  
The statement says:

```text
If x has some parent y, and y is Cat, then x is Cat.
```

**Step 2 — Check RDFS capability.**  
RDFS domain/range can type subjects and objects of a property generally, but it cannot say “has a parent of this specific class, therefore subject belongs to that class.”

**Step 3 — Use OWL existential restriction.**

```text
∃hasParent.Cat ⊑ Cat
```

**Step 4 — Explain.**  
The left-hand side means “things that have at least one `hasParent` value that is a `Cat`.” The axiom says all such things are `Cat`.

---

## D3. RDFS domain/range can overgeneralise

Given:

```text
<hasParent, rdfs:domain, Animal>
<hasParent, rdfs:range, Animal>
<RobotDog, hasParent, Factory42>
```

What does RDFS infer, and why might this be a modelling problem?

### Solution D3

**Step 1 — Apply domain reasoning.**

```text
<hasParent, rdfs:domain, Animal>
<RobotDog, hasParent, Factory42>
```

Infer:

```text
<RobotDog, rdf:type, Animal>
```

**Step 2 — Apply range reasoning.**

```text
<hasParent, rdfs:range, Animal>
<RobotDog, hasParent, Factory42>
```

Infer:

```text
<Factory42, rdf:type, Animal>
```

**Step 3 — Identify the edge case.**  
RDFS does not treat this mainly as a validation error. It uses domain and range to infer types.

**Step 4 — Explain the problem.**  
If `Factory42` is not intended to be an animal, then the modelling choice is too broad or the data is wrong. RDFS itself cannot express the richer conditional constraints needed to prevent this kind of overgeneral inference.

---

## D4. Same fuzzy RDF inference, three different T-norm answers

Given:

```text
<x, rdf:type, A, 0.4>
<A, rdfs:subClassOf, B, 0.5>
```

Infer the degree of:

```text
<x, rdf:type, B, ?>
```

using minimum, product, and Łukasiewicz T-norms. Explain why this is a high-risk exam edge case.

### Solution D4

**Step 1 — Identify the fuzzy RDFS inference pattern.**

```text
<x, rdf:type, A, γ₁>
<A, rdfs:subClassOf, B, γ₂>
→ <x, rdf:type, B, T(γ₁, γ₂)>
```

**Step 2 — Extract the degrees.**

```text
γ₁ = 0.4
γ₂ = 0.5
```

**Step 3 — Minimum T-norm.**

```text
min(0.4, 0.5) = 0.4
```

**Step 4 — Product T-norm.**

```text
0.4 × 0.5 = 0.2
```

**Step 5 — Łukasiewicz T-norm.**

```text
max(0, 0.4 + 0.5 - 1)
= max(0, -0.1)
= 0
```

**Final answers:**

```text
Minimum      → <x, rdf:type, B, 0.4>
Product      → <x, rdf:type, B, 0.2>
Łukasiewicz  → <x, rdf:type, B, 0>
```

**Step 6 — Explain the edge case.**  
The same fuzzy inference gives three different degrees depending on the chosen T-norm. Łukasiewicz can collapse to zero when the combined support is not strong enough.

---

## D5. Same fuzzy OR, three different T-conorm answers

Two alternative sources support a statement with degrees:

```text
γ₁ = 0.6
γ₂ = 0.7
```

Compute the OR degree using maximum, probabilistic sum, and Łukasiewicz T-conorm. Explain the disagreement.

### Solution D5

**Step 1 — Maximum T-conorm.**

```text
max(0.6, 0.7) = 0.7
```

**Step 2 — Probabilistic sum.**

```text
0.6 + 0.7 - (0.6 × 0.7)
= 1.3 - 0.42
= 0.88
```

**Step 3 — Łukasiewicz T-conorm.**

```text
min(1, 0.6 + 0.7)
= min(1, 1.3)
= 1
```

**Step 4 — Compare.**

```text
Maximum            = 0.7
Probabilistic sum  = 0.88
Łukasiewicz        = 1
```

**Step 5 — Explain the edge case.**  
Maximum keeps only the stronger evidence. Probabilistic sum accumulates evidence smoothly. Łukasiewicz OR can saturate at full truth when the degrees sum to at least 1.

---

## D6. Fuzzy negation does not behave exactly like crisp negation under every OR

Let:

```text
High(x) = 0.7
```

Compute:

```text
NOT High(x)
High(x) OR NOT High(x)
```

using each T-conorm from the sheet.

### Solution D6

**Step 1 — Compute fuzzy negation.**

```text
NOT High(x) = 1 - 0.7 = 0.3
```

**Step 2 — OR using maximum.**

```text
max(0.7, 0.3) = 0.7
```

**Step 3 — OR using probabilistic sum.**

```text
0.7 + 0.3 - (0.7 × 0.3)
= 1.0 - 0.21
= 0.79
```

**Step 4 — OR using Łukasiewicz T-conorm.**

```text
min(1, 0.7 + 0.3)
= min(1, 1.0)
= 1
```

**Step 5 — Explain the edge case.**  
In classical logic, `A OR NOT A` is simply true. In fuzzy logic, the result depends on the chosen OR operator. With maximum it is `0.7`, with probabilistic sum it is `0.79`, and with Łukasiewicz it is `1`.

---

## D7. Bayesian network edge case: missing full CPT

The sheet gives:

```text
P(SlipperyTrail | Rain) = 0.6
P(SlipperyTrail | Snow) = 0.95
```

Can you compute this from those two numbers alone?

```text
P(SlipperyTrail | Rain, Snow)
```

### Solution D7

**Step 1 — Inspect the network structure.**  
`SlipperyTrail` has two parents:

```text
Rain
Snow
```

**Step 2 — Identify the requested probability.**  
The requested probability conditions on both parents:

```text
P(SlipperyTrail | Rain, Snow)
```

**Step 3 — Check whether the required CPT entry is given.**  
The sheet gives separate examples:

```text
P(SlipperyTrail | Rain) = 0.6
P(SlipperyTrail | Snow) = 0.95
```

But it does not give the combined parent case:

```text
P(SlipperyTrail | Rain, Snow)
```

**Step 4 — State the answer.**  
No, you cannot compute it from those two values alone unless the question provides a combination rule or the full conditional probability table.

**Step 5 — Safe exam wording.**  
A Bayesian network needs the relevant conditional probabilities for each parent configuration, not just isolated example probabilities.

---

## D8. Markov potential is not automatically a probability

A potential function gives:

```text
ϕ(SlipperyTrail=True, GoHiking=False) = 10
```

Can you say the probability of that assignment is `10`?

### Solution D8

**Step 1 — Identify the model type.**  
This is a Markov network / Markov random field idea because it uses an undirected interaction and a potential function.

**Step 2 — Recall what a potential does.**  
A potential gives a score or compatibility value for an assignment.

**Step 3 — Avoid the trap.**  
A probability must lie in `[0, 1]`. The value `10` is outside that range.

**Step 4 — State the correct interpretation.**

```text
ϕ = 10
```

means the assignment has a high potential score, not probability `10`.

**Step 5 — What would be needed for probability?**  
To turn potentials into probabilities, a Markov network must combine all relevant potentials and normalise them. The sheet only asks you to understand potential scores and the kinds of inference Markov networks support.

---

## D9. Fuzzy OWL car inference: product vs minimum disagree

Use the exact fuzzy car degrees from the sheet:

```text
<CheapPrice ⊑ ModeratePrice, 0.7>
<a : Sedan ⊓ ∃HasPrice.CheapPrice, 0.9>
```

The crisp ontology lets us infer:

```text
a : ModerateCar
```

Compute the fuzzy degree using product and minimum T-norms.

### Solution D9

**Step 1 — Identify the two fuzzy degrees involved.**

```text
0.9 from the ABox membership axiom
0.7 from CheapPrice ⊑ ModeratePrice
```

Other relevant axioms are treated as degree `1.0` because no explicit fuzzy degree is attached.

**Step 2 — Product T-norm.**

```text
0.9 × 0.7 = 0.63
```

So:

```text
𝒪 ⊨ <a : ModerateCar, 0.63>
```

**Step 3 — Minimum T-norm.**

```text
min(0.9, 0.7) = 0.7
```

So:

```text
𝒪 ⊨ <a : ModerateCar, 0.7>
```

**Step 4 — Explain the disagreement.**  
Product penalises the chain by multiplying degrees. Minimum keeps the weakest link. Therefore the same fuzzy OWL inference gives different final degrees under different T-norm choices.

---

## D10. Choosing the wrong uncertainty method

For each case, identify the wrong method and the better method.

1. Treating “50% precipitation” as fuzzy truth instead of probability.
2. Treating “High(Peak District) = 0.6” as a probability of being high.
3. Treating “birds normally fly, penguins do not” as ordinary monotonic logic.
4. Treating `CheapPrice ⊑ ModeratePrice` with degree `0.7` as a crisp OWL axiom only.

### Solution D10

**Step 1 — Case 1: 50% precipitation.**  
Wrong method: fuzzy truth.  
Better method: probabilistic reasoning.

Reason: the statement is explicitly about chance/probability.

**Step 2 — Case 2: `High(Peak District) = 0.6`.**  
Wrong method: probability of a crisp event.  
Better method: fuzzy logic.

Reason: `High` is a vague predicate with graded membership/truth.

**Step 3 — Case 3: birds and penguins.**  
Wrong method: ordinary monotonic logic.  
Better method: non-monotonic reasoning.

Reason: the conclusion “flies” can be retracted when the exception “penguin” is added.

**Step 4 — Case 4: fuzzy subclass axiom.**  
Wrong method: crisp OWL only.  
Better method: fuzzy OWL.

Reason: the axiom has an explicit truth degree, so inference should propagate that degree using a selected T-norm.

---

## D11. KG construction quality trade-off

A project needs a KG for biomedical terms where wrong facts are dangerous. Another project needs a huge broad-coverage graph extracted from millions of web pages. Which construction strategy fits each, and why?

### Solution D11

**Step 1 — Identify the high-stakes biomedical case.**  
Biomedical terms require high accuracy and carefully maintained concepts.

**Step 2 — Select construction strategy.**  
Use domain experts and organisation-maintained ontologies.

Examples from the sheet include:

```text
SNOMED CT
GO / Gene Ontology
FoodOn
```

**Step 3 — Identify the broad web-scale case.**  
Millions of web pages require scalable extraction.

**Step 4 — Select construction strategy.**  
Use automated KG construction from text/web mining/NLP/ML.

**Step 5 — State the trade-off.**

```text
Domain expert construction → smaller but higher quality.
Machine extraction          → larger and more scalable, but often lower quality.
```

---

## D12. Table-to-KG ambiguity: entity linking vs new entity creation

A table has the cell:

```text
Manchester
```

An existing KG contains:

```text
kg:Manchester_UK rdf:type City
kg:Manchester_NH rdf:type City
kg:Manchester_United rdf:type FootballClub
```

The row context is:

```text
University | City | Country
University of Manchester | Manchester | United Kingdom
```

Which KG entity should the cell link to, and what construction step is this?

### Solution D12

**Step 1 — Identify the task.**  
This is entity linking: matching a textual/table mention to an existing KG entity.

**Step 2 — Use row and column context.**  
The column is `City`, and the country is `United Kingdom`.

**Step 3 — Compare candidates.**

```text
kg:Manchester_UK       → City in the United Kingdom
kg:Manchester_NH       → City, but not in the United Kingdom
kg:Manchester_United   → Football club, not a city
```

**Step 4 — Choose the best link.**

```text
Manchester → kg:Manchester_UK
```

**Step 5 — Explain the edge case.**  
The same surface string can refer to multiple real-world entities. Entity linking uses context to choose the correct KG identity.

---

# Final compact method sheet

## RDF/RDFS/OWL discriminator

```text
Concrete fact only                         → RDF
Class/property schema                      → RDFS
Complex logical constraint/reasoning        → OWL
Degrees of truth on triples/axioms          → Fuzzy RDF/RDFS/OWL
Probabilities/chances                       → Probabilistic reasoning
Default rules with exceptions               → Non-monotonic reasoning
```

## RDFS inference patterns

```text
Subclass:
<x, rdf:type, A> + <A, rdfs:subClassOf, B>
→ <x, rdf:type, B>

Subproperty:
<s, p, o> + <p, rdfs:subPropertyOf, q>
→ <s, q, o>

Domain:
<s, p, o> + <p, rdfs:domain, C>
→ <s, rdf:type, C>

Range:
<s, p, o> + <p, rdfs:range, C>
→ <o, rdf:type, C>
```

## Fuzzy operators

```text
Basic AND: min(a, b)
Basic OR:  max(a, b)
NOT:       1 - a

Minimum T-norm:      T(a,b) = min(a,b)
Product T-norm:      T(a,b) = a × b
Łukasiewicz T-norm:  T(a,b) = max(0, a + b - 1)

Maximum T-conorm:          S(a,b) = max(a,b)
Probabilistic sum:         S(a,b) = a + b - ab
Łukasiewicz T-conorm:      S(a,b) = min(1, a + b)
```

## Fuzzy graded inference pattern

```text
<x, rdf:type, A, γ₁>
<A, rdfs:subClassOf, B, γ₂>
→ <x, rdf:type, B, T(γ₁, γ₂)>
```

