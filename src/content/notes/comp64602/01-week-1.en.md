---
subject: COMP64602
chapter: 1
title: "Week 1"
language: en
---

# Week 1 Study Notes — Advanced Topics in Knowledge Representation and Reasoning

**Topic and scope:** This lecture introduces Knowledge Graphs from a Knowledge Representation perspective: RDF, RDFS, OWL, KG construction, uncertain reasoning, and fuzzy extensions of RDF/RDFS/OWL. It sets up the first three weeks of the course, where Knowledge Graph reasoning methods are introduced before later parts of the unit.

**Course:** Advanced Topics in Knowledge Representation and Reasoning  
**Lecture topic:** Week 1 — Knowledge Graphs, RDF/RDFS/OWL, KG construction, uncertain reasoning, fuzzy RDF/RDFS/OWL  
**Instructor:** Jiaoyan Chen, Department of Computer Science.

---

## Source materials used

- `Advanced_KRR_Video_W1.pdf` — slide deck, 38 pages.
- `Advanced_KRR_W1_Video1-English.txt` — Week 1 introduction transcript.
- `Advanced_KRR_W1_Video2-English.txt` — KG concepts, RDF/RDFS/OWL transcript.
- `Advanced_KRR_W1_Video3-English.txt` — KG construction transcript.
- `Advanced_KRR_W1_Video5-English.txt` — fuzzy RDF/RDFS/OWL transcript.
- `Advanced_KRR_W1_Video6-English.txt` — Week 1 summary transcript.

---

## 0. Transcript correction key

The auto-transcript has several recurring garbled terms. These are corrected using the slides.

- “ADF” / “ADFs” = **RDF** / **RDFS**
- “I”, “oil”, “or”, “okay” = **OWL**
- “screen logic” / “discrete logic” = **Description Logic**
- “Sparql” = **SPARQL**
- “hung rules” = **Horn rules**
- “costume languages” = **custom languages**
- “shackle” = **SHACL**
- “Luca Swiss” / “local weights” = **Łukasiewicz**
- “tee box” = **TBox**
- “ebooks” = **ABox**
- “Exxon” / “axon” = **axiom**
- [UNCLEAR] The transcript says “Advanced Topics in Algebra, Annotation and Reasoning”; the slide title confirms the course is **Advanced Topics in Knowledge Representation and Reasoning**.

---

# 1. Week 1 overview

The week has two big halves:

1. **Knowledge Graphs**
   - What a Knowledge Graph is.
   - RDF, RDFS, and OWL as representation languages.
   - How KGs relate to relational databases.
   - How KGs are constructed.

2. **Uncertain Reasoning**
   - What uncertain reasoning is and why it is needed.
   - Brief overview of probabilistic reasoning, fuzzy logic, and non-monotonic reasoning.
   - More detailed introduction to fuzzy RDF, fuzzy RDFS, and fuzzy OWL.

The lecturer says that Week 1 gives an overview of some uncertain reasoning techniques, but that most techniques are **not introduced in detail this week**. The fuzzy-logic-based extensions are the main detailed part.

---

# 2. Knowledge Graphs: basic concept

## 2.1 Origin of the term “Knowledge Graph”

The term **Knowledge Graph** was first used by **Google**, around 2012, referring to Google’s knowledge base and the services used to enhance search results with structured knowledge gathered from different sources.

The slide example is **Manchester Baby**. When searching for Manchester Baby, Google does not only return web pages; it also shows an information box with structured attributes such as developers and successor. The lecturer uses this as an example of structured information powered by a Knowledge Graph in the backend.

### Intuition

A Knowledge Graph stores facts about entities in a way that computers can query and reason over.

For example:

- Entity / instance: `Manchester Baby`
- Fact: `Manchester Baby hasSuccessor Manchester Mark I`
- Fact: `Manchester Baby hasDeveloper Tom Kilburn`

So the lecturer’s rough equation is:

```text
Knowledge ≈ Instances + Facts
KG ≈ Linked Structured Data
```

A KG can be viewed as a **multi-relational graph**: nodes are entities, and labelled edges are relationships.

---

## 2.2 Broad meaning of “Knowledge Graph”

The lecturer stresses that **there is no single standard definition** of Knowledge Graph. Different researchers and developers use the term differently.

The lecture gives a spectrum:

```text
RDF facts
→ multi-relation graph data, close to Google’s original usage

RDF facts + schema
→ graph data with more semantic structure

OWL ontology
→ graph data + reasoning agent
→ logic-equipped KG
```

Usually:

- **Knowledge Graph** refers to relational facts / data.
- **Ontology** refers to conceptual knowledge, vocabulary, schema, and logical definitions.
- But people often include ontologies when they say Knowledge Graph.

The summary video says that because the meanings depend on context, one should ask: **what logic and annotation features does this KG or ontology have?**

---

# 3. RDF: Resource Description Framework

## 3.1 Definition

**RDF** stands for **Resource Description Framework**. RDF represents facts as triples:

```text
<Subject, Predicate, Object>
```

Formal form:

```text
τ = <s, p, o>
```

where:

- `s` = subject / source entity
- `p` = predicate / relation
- `o` = object / target entity or value

Example from the slides:

```text
<Manchester Baby, hasDeveloper, Tom Kilburn>
```

This means Manchester Baby is connected to Tom Kilburn by the relation `hasDeveloper`.

---

## 3.2 RDF as graph data

A set of RDF triples forms a graph.

The slide’s graph contains:

```text
<Alan Turing, hasColleague, Tom Kilburn>
<Manchester Baby, hasDeveloper, Tom Kilburn>
<Manchester Baby, hasSuccessor, Manchester Mark I>
<Alan Turing, contributedTo, Manchester Mark I>
```

In graph form:

- Nodes:
  - Alan Turing
  - Tom Kilburn
  - Manchester Baby
  - Manchester Mark I
- Edges:
  - `hasColleague`
  - `hasDeveloper`
  - `hasSuccessor`
  - `contributedTo`

### Key intuition

RDF is not mainly about tables. It is about **facts as labelled links**. Each fact is a small statement, and many statements together become graph data.

---

# 4. RDFS: RDF Schema

## 4.1 Definition

**RDFS** stands for **RDF Schema**. It extends RDF by adding schema-level information about RDF instances and facts.

RDFS can define:

- Classes and class hierarchies.
- Data and object property hierarchies.
- Property domain and range.

### Intuition

RDF says:

```text
Tom Kilburn is connected to Manchester Baby by hasDeveloper.
```

RDFS can additionally say:

```text
Tom Kilburn is a Computer Scientist.
Computer Scientist is a subclass of Scientist.
hasDeveloper has range People.
hasTeammate is a subproperty of hasColleague.
```

So RDFS gives meaning to the vocabulary used in RDF.

---

## 4.2 RDFS examples from the lecture

The slides give these examples:

```text
<Tom Kilburn, rdf:type, Computer Scientist>
<Computer Scientist, rdfs:subClassOf, Scientist>
<hasDeveloper, rdfs:range, People>
<hasTeammate, rdfs:subPropertyOf, hasColleague>
```

### Meaning

1. `rdf:type`

   ```text
   <Tom Kilburn, rdf:type, Computer Scientist>
   ```

   means Tom Kilburn is an instance of the class `Computer Scientist`.

2. `rdfs:subClassOf`

   ```text
   <Computer Scientist, rdfs:subClassOf, Scientist>
   ```

   means every computer scientist is also a scientist.

3. `rdfs:range`

   ```text
   <hasDeveloper, rdfs:range, People>
   ```

   means anything that appears as the object of `hasDeveloper` belongs to the class `People`.

4. `rdfs:subPropertyOf`

   ```text
   <hasTeammate, rdfs:subPropertyOf, hasColleague>
   ```

   means if two entities are connected by `hasTeammate`, they are also connected by `hasColleague`.

---

# 5. Relational databases vs RDF graph data

The lecture compares relational databases and RDF graph data across several aspects.

| Aspect | Relational Database | RDF Graph Data |
|---|---|---|
| Core model | Tables with rows and columns | RDF triples |
| Schema | Fixed; tables and columns predefined | Flexible; classes and properties can evolve |
| Relationships | Foreign keys | Links / graph edges |
| Query | SQL | SPARQL; graph navigation; similarity; locality |
| Reasoning | Datalog | Horn rules, SWRL, RDFS, OWL, SHACL |
| Web support | Local databases or tabular datasets | Web-scale data, often linked between datasets using URI/IRI |

## 5.1 Core model

Relational databases store data in tables.

RDF graph data stores data as triples:

```text
<Subject, Predicate, Object>
```

This makes RDF naturally graph-shaped.

---

## 5.2 Schema

Relational databases normally have a fixed schema:

- table names
- column names
- column types

RDF graph data has a more flexible schema:

- classes can be added
- properties can be added
- RDF triples can evolve as instances and facts are added or deleted

The lecturer contrasts this with relational database schemas, where structure is defined in advance.

---

## 5.3 Relationships

In relational databases, relationships are usually represented by **foreign keys**.

In RDF graph data, relationships are represented directly by graph edges:

```text
<Alan Turing, hasColleague, Tom Kilburn>
```

This is more fine-grained in the lecture’s description because relationships are explicit labelled edges between instances.

---

## 5.4 Querying

Relational databases use **SQL**.

RDF graph databases use **SPARQL** and can also use graph-based operations such as:

- graph navigation
- graph similarity
- locality-based algorithms

[UNCLEAR] The transcript says “Sparql query which is schema less on the use. Implicit join with tuple patterns…” The intended meaning seems to be that SPARQL works over RDF triples using graph/triple patterns, but the wording is garbled.

---

## 5.5 Reasoning support

Relational databases have relatively limited symbolic reasoning support, although Datalog can be used.

RDF graph data has stronger support for reasoning:

- Datalog rules
- Horn rules
- SWRL
- RDFS reasoning
- OWL reasoning
- SHACL for constraints / validation

The lecture presents RDF graph data as richer for symbolic reasoning than ordinary relational databases.

---

## 5.6 Web support

Relational databases are usually local and not naturally linked across the web.

RDF graph data can be local or web-published. RDF can use **URI/IRI** to represent each instance or relation as a unique identity on the web, allowing datasets to be shared and linked.

---

# 6. Limitations of RDFS

RDFS provides useful schema features, but the lecture says its semantic expressivity is weak for complex scenarios.

## 6.1 RDFS cannot express domain-range constraints together in complex ways

RDFS can define property domain and range separately, but it cannot express more complex constraints where the type of subject and object are linked conditionally.

Examples from the slides:

```text
The parents of any Cat are Cat.
If something’s parents are Cat, it is a Cat.
```

These are not simple global domain/range declarations. They require richer logical restrictions.

---

## 6.2 RDFS cannot express cardinality constraints

RDFS cannot express constraints such as:

```text
A Human has exactly 2 parents.
```

The slide later shows this kind of statement in OWL as:

```text
Human ⊑ (= 2 hasParent)
```

---

## 6.3 RDFS cannot express property characteristics

RDFS lacks descriptions for property characteristics such as:

- transitivity
- symmetry
- asymmetry
- functionality
- inverse functionality
- reflexivity
- irreflexivity
- inverse property relations
- property composition

These are important when relationships have logical behaviour beyond “there is an edge”.

---

## 6.4 RDFS lacks equivalence definitions

RDFS cannot properly define equivalence between:

- individuals
- classes
- properties

This matters especially for linked data on the web, where different data providers may use different identifiers for the same thing. The lecturer notes that equivalence is important when linking datasets.

---

# 7. OWL: Web Ontology Language

## 7.1 Definition

**OWL** stands for **Web Ontology Language**.

OWL supports schemas with more complex logical relationships and constraints than RDFS. It is underpinned by **Description Logic**, using constructors such as:

```text
⊓   conjunction / and
⊔   disjunction / or
∃   existential restriction / some
∀   universal restriction / only
¬   negation / not
```

The slides introduce OWL as the language that addresses the limitations of RDFS.

---

## 7.2 OWL examples from the lecture

### Example 1: Parents of any cat are cats

```text
Cat ⊑ ∀hasParent.Cat
```

Meaning:

If something is a Cat, then all of its `hasParent` values are Cats.

In words:

```text
The parents of any Cat are Cat.
```

---

### Example 2: If something has a cat parent, it is a cat

```text
∃hasParent.Cat ⊑ Cat
```

Meaning:

If an entity has at least one parent that is a Cat, then that entity is a Cat.

In words:

```text
If something’s parents are Cat, it is a Cat.
```

[UNCLEAR] The slide writes this example, but biologically/logically it is a simplified teaching example, not a claim about real-world taxonomy.

---

### Example 3: Humans have exactly two parents

```text
Human ⊑ (= 2 hasParent)
```

Meaning:

Every Human belongs to the class of things with exactly two `hasParent` relations.

This expresses cardinality, which RDFS cannot express.

---

## 7.3 OWL and domain vocabularies

OWL is not only used to define schemas for RDF graph data. It is also widely used to define domain vocabularies and ontologies.

Examples from the lecture:

- FoodOn
- SNOMED CT
- GO / Gene Ontology

These vocabularies include:

- taxonomies
- logical definitions
- fine-grained categorisations

The slide shows a segment of FoodOn with concepts such as:

```text
plant food product
bean food product
soybean food product
gluten soya bread
soybean beverage
soybean milk
```

The slide also gives a logical example:

```text
food material ≡ environmental material and (has role some food)
```

And the visual FoodOn segment shows `soybean milk` linked to a derives-from restriction involving `Glycine max`.

---

# 8. Knowledge Graph construction

## 8.1 Overall idea

KG construction is about building or updating a KG from different sources.

The lecture describes it as interdisciplinary, involving:

- Knowledge Representation / Semantic Web
- NLP
- Machine Learning
- Web mining

---

## 8.2 Human construction: crowdsourcing and domain experts

Many existing KGs are directly or indirectly constructed by humans.

Examples:

```text
Wikidata
DBpedia
Yago
GeoNames
```

The slide also lists domain ontologies:

```text
GO
SNOMED CT
FoodOn
```

### Crowdsourcing

Wikidata is described as an actively developed crowdsourcing platform where volunteers can edit attributes and relationships of entities.

DBpedia and Yago are described as being formed from other resources, especially Wikipedia infoboxes. Wikipedia articles are contributed by web volunteers.

### Domain experts

Domain ontologies such as Gene Ontology and SNOMED CT are often smaller than large fact-based KGs like Wikidata, but they require very high quality. Therefore, they are mostly contributed by domain experts and maintained by organisations.

The lecturer also mentions ontology editing and management tools, plus symbolic reasoners for checking consistency and detecting knowledge that leads to inconsistency.

[UNCLEAR] The transcript says “prestige”; this is likely an ontology editing tool name, but the auto-transcription is garbled.

---

## 8.3 KG construction from natural language text

Sources:

- web pages
- documents
- textual corpora

Technologies:

- web mining
- machine learning
- natural language processing

The slide workflow is:

```text
Gather textual corpus
→ automatically extract knowledge
→ store in knowledge graph
```

Structured knowledge extraction techniques include:

- Named Entity Recognition
- Entity Linking
- Entity Typing
- Relation Extraction

### Named Entity Recognition

Identifies entity mentions in text.

Example idea from the slide’s text corpus:

```text
John went to the grocery store...
```

The system identifies mentions such as people, places, objects, or events.

### Entity Linking

Links recognised mentions to existing KG entities.

For example, a text mention of “Manchester Baby” would be matched to the correct KG entity for Manchester Baby.

### Entity Typing

Assigns a class/type to an entity.

Example:

```text
Hamilton rdf:type RacingDriver
```

### Relation Extraction

Extracts relations between entities.

Example:

```text
Hamilton races-for Mercedes
```

The lecturer says machine-extracted large graphs are more scalable than human construction, but often lower quality. They are often used by tools for applications rather than directly by humans.

---

## 8.4 KG construction from semi-structured and structured data

Sources include:

- databases
- web tables
- Excel sheets
- CSV files

These are easier to understand than unstructured text and are useful for constructing large graphs.

The slide says tabular data to KG transformation may use:

```text
heuristic rules / mappings
```

but it also requires:

- data integration
- relationship discovery
- schema inference

---

## 8.5 Table-to-KG matching

The lecture gives a Formula 1 example.

### Existing KG

The existing KG contains facts about Sebastian Vettel:

```text
dbp:Vettel rdf:type dbp:RacingDriver
dbp:Vettel races-for dbp:Ferrari
dbp:Vettel lives-in dbp:Germany
```

### Table

The table contains rows:

```text
Alonso      McLaren    Spain
Hamilton    Mercedes   England
Sebastian Vettel Ferrari Germany
```

### Matching tasks

The slide says table-to-KG matching includes:

1. **Cell-to-entity matching**

   ```text
   Sebastian Vettel = dbp:Vettel
   Ferrari = dbp:Ferrari
   Germany = dbp:Germany
   ```

2. **Column type to class**

   ```text
   first column → dbp:RacingDriver
   ```

3. **Inter-column relation to property**

   ```text
   first column + second column → races-for
   first column + third column → lives-in
   ```

4. **New knowledge extraction for KG population**

   From the row:

   ```text
   Hamilton Mercedes England
   ```

   infer candidate new KG facts:

   ```text
   Hamilton races-for Mercedes
   Hamilton lives-in England
   Hamilton rdf:type RacingDriver
   ```

This is called **KG population**: updating an existing KG with new entities and facts from tables.

---

## 8.6 Other KG construction techniques

The lecture lists further techniques:

### Knowledge alignment and integration

Used to discover equivalent or corresponding entities across KGs or within one KG.

Purpose:

```text
same real-world thing → same / aligned KG representation
```

### Link prediction

Used to find missing relationships between entities in a KG or across larger graphs.

Purpose:

```text
existing KG is incomplete → predict likely missing edges
```

### Modularisation and sub-KG extraction

Used to extract relevant knowledge for a specific task, such as answering a particular type of question.

The lecturer notes this is important for personal KGs, especially when:

- computational resources are limited
- efficient querying is needed
- efficient reasoning is needed

### Canonicalisation

Used to standardise implementation/representation.

The transcript says that mentions from tables or texts may have informal names, and they need to be represented by URIs and associated with standard names.

---

# 9. Uncertain reasoning

## 9.1 Definition

**Uncertain reasoning** means reasoning under uncertainty.

The slide definition:

```text
Draw conclusions or make decisions when available information is incomplete,
ambiguous, inconsistent, or probabilistic rather than fully certain.
```

Key features:

- Allows partial or probabilistic truth.
- Instead of only True/False, it can use probabilities, degrees of belief, or likelihoods.
- Handles missing, conflicting, or fuzzy data.

---

## 9.2 Motivation

Uncertain reasoning is motivated by real-world data and tasks.

The slide gives examples:

### Natural language ambiguity

```text
“Manchester has great weather”
```

This could be literal or sarcastic.

### Weather forecasting

```text
“Mostly sunny”
“50% precipitation”
```

Weather forecasts are not simple true/false facts.

### Probabilistic rule

```text
Rain => SlipperyTrail: 0.75
```

This means rain tends to imply a slippery trail with a degree/probability of 0.75, rather than as an absolute rule.

---

# 10. Probabilistic reasoning

## 10.1 Definition

**Probabilistic reasoning** is uncertain reasoning using probability theory.

The lecture briefly introduces two probabilistic graphical models:

- Bayesian Networks
- Markov Networks / Markov Random Fields

---

## 10.2 Bayesian Network

### Formal definition from the lecture

A **Bayesian Network** is:

- a probabilistic graphical model
- represented by a directed acyclic graph, DAG
- nodes represent random variables, discrete or continuous
- edges represent conditional dependencies

### Example graph

The slide shows:

```text
Rain      Snow
  \       /
 SlipperyTrail
       |
   GoHiking
```

### Example probabilities

```text
P(SlipperyTrail | Rain) = 0.6
P(SlipperyTrail | Snow) = 0.95
P(GoHiking | SlipperyTrail) = 0.1
```

### Inference

Inference uses:

- Bayes’ rules
- probability propagation over the network

The idea is that evidence about one variable, such as rain or snow, affects beliefs about other variables, such as whether the trail is slippery and whether someone goes hiking.

---

## 10.3 Markov Network / Markov Random Field

### Formal definition from the lecture

A **Markov Network** is:

- an undirected probabilistic graphical model
- represented by an undirected graph
- nodes are random variables
- edges are probabilistic pairwise interactions
- interactions are symmetric
- interactions are represented by a potential function

### Example graph

The slide shows an undirected graph connecting:

```text
Rain
Snow
SlipperyTrail
GoHiking
```

### Potential function example

The slide gives a potential function over `SlipperyTrail` and `GoHiking`:

```text
ϕ(SlipperyTrail, GoHiking) =
  10, if SlipperyTrail = True,  GoHiking = False
   1, if SlipperyTrail = True,  GoHiking = True
   3, otherwise
```

Interpretation within the lecture:

- The potential function gives different scores to different assignments.
- The assignment where the trail is slippery and the person does not go hiking has score 10.
- The assignment where the trail is slippery and the person still goes hiking has score 1.
- Other cases get score 3.

### Inference

For Markov Networks, inference can calculate:

- marginal probability
- conditional probability
- most probable assignment, MAP

---

# 11. Fuzzy logic

## 11.1 Definition

**Fuzzy logic** is a multi-valued logic that allows reasoning with degrees of truth.

Classical logic:

```text
High(Peak District) = True or False
```

Fuzzy logic:

```text
High(Peak District) = 0.6
```

So fuzzy logic does not require a statement to be fully true or fully false.

---

## 11.2 Fuzzy truth values

Fuzzy logic uses continuous truth values:

```text
γ ∈ [0, 1]
```

where:

- `0` means completely false
- `1` means completely true
- values between 0 and 1 represent partial truth

---

## 11.3 Fuzzy sets

In a classical set:

```text
x ∈ A
```

or

```text
x ∉ A
```

Membership is binary.

In a fuzzy set, membership is given by a membership function:

```text
μ_A(x) ∈ [0,1]
```

Meaning:

```text
x belongs to A to degree μ_A(x)
```

Example:

```text
High(Peak District) = 0.6
```

means the Peak District belongs to the fuzzy class `High` to degree 0.6.

---

## 11.4 Basic fuzzy connectives

The slide gives basic fuzzy operations:

```text
AND → min(a, b)
OR  → max(a, b)
NOT → 1 - a
```

These are the basic versions introduced first. Later slides expand AND and OR into multiple possible families of functions.

---

# 12. Non-monotonic reasoning

## 12.1 Definition

**Non-monotonic reasoning** means that adding new knowledge can invalidate previous conclusions.

Classical logic is monotonic:

```text
Once a conclusion follows, adding more knowledge does not remove that conclusion.
```

Non-monotonic reasoning allows conclusions to be withdrawn when new evidence arrives.

---

## 12.2 Bird and penguin example

Initial knowledge:

```text
Birds can fly.
Pingu is a bird.
```

Conclusion:

```text
Pingu can fly.
```

New knowledge:

```text
Pingu is a penguin.
```

New conclusion:

```text
Pingu cannot fly.
```

The original conclusion is invalidated by the new knowledge.

---

## 12.3 Features of non-monotonic reasoning

The slides list these features:

- Handles incompleteness by default assumptions.
- Resolves inconsistency by prioritising or retracting conflicting conclusions.
- Does not manage uncertainty mainly through numerical probabilities.
- Manages uncertainty through the structure of the knowledge base and inference rules.

Techniques listed:

- default logics
- circumscription
- negation-as-failure

---

# 13. Fuzzy RDF and Fuzzy RDFS

## 13.1 Definition

**Fuzzy RDF** and **Fuzzy RDFS** extend RDF and RDFS with fuzzy logic.

In classical RDF/RDFS, a triple is simply asserted or not asserted.

In fuzzy RDF/RDFS, triples have degrees of truth:

```text
<τ, γ>
```

where:

- `τ` is a triple
- `γ ∈ [0,1]` is the degree of truth

The slide example:

```text
<Manchester, rdf:type, BigCity, 0.7>
<BigCity, rdfs:subClassOf, BicycleFriendlyCity, 0.5>
```

The transcript says this is equivalent to partial membership: a triple can hold to a certain degree rather than absolutely.

---

## 13.2 Crisp inference vs graded inference

### Crisp inference in classical RDF/RDFS

Given:

```text
<Manchester, rdf:type, BigCity>
<BigCity, rdfs:subClassOf, BicycleFriendlyCity>
```

Infer:

```text
<Manchester, rdf:type, BicycleFriendlyCity>
```

This is called **crisp inference** because the conclusion is simply true.

---

### Graded inference in fuzzy RDF/RDFS

Given:

```text
<Manchester, rdf:type, BigCity, 0.7>
<BigCity, rdfs:subClassOf, BicycleFriendlyCity, 0.5>
```

Infer:

```text
<Manchester, rdf:type, BicycleFriendlyCity, ?>
```

The question is: what truth degree should the inferred triple have?

Fuzzy RDF/RDFS propagates degrees of truth along inference rules. This is called **graded inference**.

---

# 14. T-norms: fuzzy AND

## 14.1 Definition

For fuzzy logic, rules for combining truth degrees under AND are called **T-norms**.

The lecture gives three common T-norms:

1. Minimum
2. Product
3. Łukasiewicz

Let the two truth values be:

```text
γ₁ = 0.7
γ₂ = 0.5
```

for the Manchester example.

---

## 14.2 Minimum T-norm

Formula:

```text
T(γ₁, γ₂) = min(γ₁, γ₂)
```

For the example:

```text
T(0.7, 0.5) = min(0.7, 0.5) = 0.5
```

So:

```text
<Manchester, rdf:type, BicycleFriendlyCity, 0.5>
```

The transcript explains this as: the truth of the conjunction is as strong as the weaker statement.

[UNCLEAR] The transcript says “0.05” for the minimum T-norm example, but the slide and formula imply **0.5**. This is almost certainly an auto-transcription error.

---

## 14.3 Product T-norm

Formula:

```text
T(γ₁, γ₂) = γ₁ × γ₂
```

For the example:

```text
T(0.7, 0.5) = 0.7 × 0.5 = 0.35
```

So:

```text
<Manchester, rdf:type, BicycleFriendlyCity, 0.35>
```

The transcript calls this probabilistic and notes that product-style operations are common in machine learning where smoothness and differentiability matter.

---

## 14.4 Łukasiewicz T-norm

Formula:

```text
T(γ₁, γ₂) = max(0, γ₁ + γ₂ - 1)
```

For the example:

```text
T(0.7, 0.5) = max(0, 0.7 + 0.5 - 1)
             = max(0, 0.2)
             = 0.2
```

So:

```text
<Manchester, rdf:type, BicycleFriendlyCity, 0.2>
```

The transcript describes this as compensatory and says both conditions must be strong enough together; if one is too low, the conjunction collapses toward zero.

---

# 15. T-conorms: fuzzy OR

## 15.1 Definition

For fuzzy logic, rules for combining truth degrees under OR are called **T-conorms**.

The lecture gives three examples:

1. Maximum
2. Probabilistic sum
3. Łukasiewicz sum capped at 1

---

## 15.2 Maximum T-conorm

Formula:

```text
S(γ₁, γ₂) = max(γ₁, γ₂)
```

Interpretation:

```text
The stronger statement wins.
```

Example with `γ₁ = 0.7`, `γ₂ = 0.5`:

```text
S(0.7, 0.5) = 0.7
```

---

## 15.3 Probabilistic sum

Formula:

```text
S(γ₁, γ₂) = γ₁ + γ₂ - γ₁γ₂
```

The slide links this to probability of union:

```text
P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
```

Example:

```text
S(0.7, 0.5) = 0.7 + 0.5 - (0.7 × 0.5)
            = 1.2 - 0.35
            = 0.85
```

The transcript says this increases smoothly without exceeding 1.

---

## 15.4 Łukasiewicz T-conorm

Formula:

```text
S(γ₁, γ₂) = min(1, γ₁ + γ₂)
```

Example:

```text
S(0.7, 0.5) = min(1, 1.2) = 1
```

The transcript says this is more permissive than maximum because partial truth values can accumulate to produce stronger OR truth.

---

# 16. Fuzzy negation

The standard fuzzy negation is:

```text
N(γ) = 1 - γ
```

Example:

```text
N(0.7) = 1 - 0.7 = 0.3
```

Meaning:

```text
If a statement is true to degree 0.7,
its negation is true to degree 0.3.
```

---

# 17. Properties of T-norms and T-conorms

The lecture says both T-norms and T-conorms have these properties:

## 17.1 Commutativity

Order does not matter.

```text
T(γ₁, γ₂) = T(γ₂, γ₁)
S(γ₁, γ₂) = S(γ₂, γ₁)
```

---

## 17.2 Associativity

Grouping does not matter.

For T-norms:

```text
T(γ₁, T(γ₂, γ₃)) = T(T(γ₁, γ₂), γ₃)
```

For T-conorms:

```text
S(γ₁, S(γ₂, γ₃)) = S(S(γ₁, γ₂), γ₃)
```

[UNCLEAR] The slide text appears to contain a typo in the associativity formula for `S`, where `T` appears inside the `S` expression. The intended property is associativity of `S`.

---

## 17.3 Monotonicity

If both inputs increase, the output cannot decrease.

```text
If γ₁ ≤ γ₁′ and γ₂ ≤ γ₂′,
then T(γ₁, γ₂) ≤ T(γ₁′, γ₂′)
and S(γ₁, γ₂) ≤ S(γ₁′, γ₂′)
```

---

## 17.4 Identity element

For T-norms:

```text
T(γ, 1) = γ
```

For T-conorms:

```text
S(γ, 0) = γ
```

Interpretation:

- AND with full truth leaves the original degree unchanged.
- OR with full falsehood leaves the original degree unchanged.

---

# 18. Fuzzy OWL

## 18.1 Definition

**Fuzzy OWL** extends classical OWL by introducing degrees of truth to axioms.

Classical OWL axioms are treated as fully true. Fuzzy OWL can attach degrees such as:

```text
<CheapPrice ⊑ ModeratePrice, 0.7>
```

meaning the subclass relationship holds to degree 0.7.

---

## 18.2 Fuzzy car ontology example

The lecture gives a fuzzy car ontology `𝒪` as a Description Logic knowledge base.

### TBox axioms

```text
Car ⊑ ∃HasPrice.Price
```

Meaning:

Every car has some price.

```text
Sedan ⊑ Car
```

Meaning:

Every sedan is a car.

```text
CheapCar ≡ Car ⊓ ∃HasPrice.CheapPrice
```

Meaning:

A cheap car is exactly a car that has some cheap price.

```text
ModerateCar ≡ Car ⊓ ∃HasPrice.ModeratePrice
```

Meaning:

A moderate car is exactly a car that has some moderate price.

Fuzzy axiom:

```text
<CheapPrice ⊑ ModeratePrice, 0.7>
```

Meaning:

CheapPrice is a subclass of ModeratePrice to degree 0.7.

The transcript explains the motivation: in the real world, there is no strict separation between cheap price and moderate price.

---

## 18.3 ABox axiom

The ABox contains:

```text
<a : Sedan ⊓ ∃HasPrice.CheapPrice, 0.9>
```

Meaning:

Individual `a` belongs to the class:

```text
Sedan ⊓ ∃HasPrice.CheapPrice
```

to degree 0.9.

So `a` is a sedan with a cheap price to degree 0.9.

---

## 18.4 Crisp inference without truth degrees

Ignoring truth degrees, the ontology can infer:

```text
𝒪 ⊨ a : ModerateCar
```

Reasoning steps:

1. From:

   ```text
   a : Sedan
   ```

   and:

   ```text
   Sedan ⊑ Car
   ```

   infer:

   ```text
   a : Car
   ```

2. From:

   ```text
   a : ∃HasPrice.CheapPrice
   ```

   and:

   ```text
   CheapPrice ⊑ ModeratePrice
   ```

   infer:

   ```text
   a : ∃HasPrice.ModeratePrice
   ```

3. From:

   ```text
   ModerateCar ≡ Car ⊓ ∃HasPrice.ModeratePrice
   ```

   and the two facts:

   ```text
   a : Car
   a : ∃HasPrice.ModeratePrice
   ```

   infer:

   ```text
   a : ModerateCar
   ```

---

## 18.5 Graded inference with truth degrees

The slide says:

```text
𝒪 ⊨ a : ModerateCar
```

requires an AND operation over the coloured/fuzzy axioms.

The fuzzy degrees involved are:

```text
0.9
```

from the ABox membership axiom, and:

```text
0.7
```

from:

```text
<CheapPrice ⊑ ModeratePrice, 0.7>
```

Other axioms have no explicit truth value, so the transcript says they are treated as truth degree `1.0`.

### Product T-norm

```text
T(0.9, 0.7) = 0.9 × 0.7 = 0.63
```

Therefore:

```text
𝒪 ⊨ <a : ModerateCar, 0.63>
```

### Minimum T-norm

```text
T(0.9, 0.7) = min(0.9, 0.7) = 0.7
```

Therefore:

```text
𝒪 ⊨ <a : ModerateCar, 0.7>
```

These are exactly the slide results.

[UNCLEAR] The transcript says “product of 0.0 and 0.9”; the slide and arithmetic show it should be **0.7 and 0.9**, giving **0.63**.

---

# 19. Worked examples collected

## Worked example 1: RDF triple to graph

Given:

```text
<Manchester Baby, hasDeveloper, Tom Kilburn>
```

Interpretation:

- Subject: `Manchester Baby`
- Predicate: `hasDeveloper`
- Object: `Tom Kilburn`

Graph form:

```text
Manchester Baby --hasDeveloper--> Tom Kilburn
```

This is one RDF fact. A set of such facts forms a multi-relational graph.

---

## Worked example 2: RDFS subclass reasoning

Given:

```text
<Tom Kilburn, rdf:type, Computer Scientist>
<Computer Scientist, rdfs:subClassOf, Scientist>
```

Inferred:

```text
<Tom Kilburn, rdf:type, Scientist>
```

Reason:

If Tom Kilburn is a Computer Scientist, and every Computer Scientist is a Scientist, then Tom Kilburn is a Scientist.

---

## Worked example 3: RDFS subproperty reasoning

Given:

```text
<hasTeammate, rdfs:subPropertyOf, hasColleague>
<Alice, hasTeammate, Bob>
```

Inferred:

```text
<Alice, hasColleague, Bob>
```

Reason:

Every `hasTeammate` relationship is also a `hasColleague` relationship.

This exact Alice/Bob instance is not in the lecture; the rule form is directly based on the lecture’s `hasTeammate` / `hasColleague` example. The lecture’s own wording is that if two people have a teammate relationship, then they have a colleague relationship.

---

## Worked example 4: OWL universal restriction

Given:

```text
Cat ⊑ ∀hasParent.Cat
```

and:

```text
Felix rdf:type Cat
Felix hasParent Luna
```

Inferred:

```text
Luna rdf:type Cat
```

This follows the lecture’s formula:

```text
Cat ⊑ ∀hasParent.Cat
```

Again, Felix/Luna are just placeholders; the formula itself is from the slides.

---

## Worked example 5: Fuzzy RDF/RDFS graded inference

Given:

```text
<Manchester, rdf:type, BigCity, 0.7>
<BigCity, rdfs:subClassOf, BicycleFriendlyCity, 0.5>
```

Classical version would infer:

```text
<Manchester, rdf:type, BicycleFriendlyCity>
```

Fuzzy version infers a degree depending on the chosen T-norm.

### Minimum

```text
min(0.7, 0.5) = 0.5
```

Conclusion:

```text
<Manchester, rdf:type, BicycleFriendlyCity, 0.5>
```

### Product

```text
0.7 × 0.5 = 0.35
```

Conclusion:

```text
<Manchester, rdf:type, BicycleFriendlyCity, 0.35>
```

### Łukasiewicz

```text
max(0, 0.7 + 0.5 - 1) = max(0, 0.2) = 0.2
```

Conclusion:

```text
<Manchester, rdf:type, BicycleFriendlyCity, 0.2>
```

---

## Worked example 6: Fuzzy OWL moderate car inference

Given:

```text
<CheapPrice ⊑ ModeratePrice, 0.7>
<a : Sedan ⊓ ∃HasPrice.CheapPrice, 0.9>
```

And definitions:

```text
Sedan ⊑ Car
ModerateCar ≡ Car ⊓ ∃HasPrice.ModeratePrice
```

Infer:

```text
a : ModerateCar
```

### With product T-norm

```text
0.9 × 0.7 = 0.63
```

Conclusion:

```text
𝒪 ⊨ <a : ModerateCar, 0.63>
```

### With minimum T-norm

```text
min(0.9, 0.7) = 0.7
```

Conclusion:

```text
𝒪 ⊨ <a : ModerateCar, 0.7>
```

---

# 20. Exam flags

No explicit phrase like **“this will be on the exam”** appears in the provided transcript or slides.

Still, the following are high-value revision points because the lecture gives definitions, formulas, and worked examples around them:

1. **RDF triple structure**

   ```text
   <Subject, Predicate, Object>
   ```

2. **Difference between RDF, RDFS, and OWL**
   - RDF = facts/triples.
   - RDFS = schema: classes, subclass, properties, domain/range.
   - OWL = richer Description Logic constraints.

3. **Limitations of RDFS**
   - cannot express complex domain-range restrictions
   - cannot express cardinality
   - cannot express property characteristics
   - cannot express equivalence well

4. **Relational database vs RDF graph data**
   - tables vs triples
   - fixed schema vs flexible schema
   - SQL vs SPARQL
   - foreign key vs graph edge
   - local DB vs web-scale linked data

5. **KG construction sources**
   - crowdsourcing/domain experts
   - natural language text
   - structured/semi-structured data
   - table-to-KG matching and KG population

6. **Uncertain reasoning definition**
   - reasoning when information is incomplete, ambiguous, inconsistent, or probabilistic.

7. **Bayesian Network vs Markov Network**
   - directed acyclic graph with conditional dependencies vs undirected graph with potential functions.

8. **Fuzzy logic formulas**

   ```text
   μ_A(x) ∈ [0,1]
   AND: min(a,b)
   OR: max(a,b)
   NOT: 1-a
   ```

9. **T-norms and T-conorms**
   - Minimum
   - Product
   - Łukasiewicz
   - Probabilistic sum

10. **Crisp vs graded inference**
    - classical RDF/RDFS gives true/false inferred triples
    - fuzzy RDF/RDFS propagates truth degrees

11. **Fuzzy OWL car example**
    - product T-norm gives `0.63`
    - minimum T-norm gives `0.7`

---

# 21. Connections made in the lecture

## 21.1 Knowledge Graphs and web search

The Manchester Baby search example connects Knowledge Graphs to Google search result enhancement. Structured facts in the KG power the information box shown alongside search results.

## 21.2 Knowledge Graphs and Semantic Web

RDF, RDFS, OWL, URI/IRI, SPARQL, SWRL, and SHACL connect the lecture to Semantic Web technologies. RDF graph data can be published on the web and linked across datasets using URI/IRI.

## 21.3 Knowledge Graphs and databases

The relational database comparison connects KGs to database modelling and querying. The lecture contrasts tables/SQL/foreign keys with triples/SPARQL/graph edges.

## 21.4 Knowledge Graph construction and NLP/ML

KG construction from text connects the topic to:

- Natural Language Processing
- Machine Learning
- Web mining

The lecture names NER, entity linking, entity typing, and relation extraction as structured knowledge extraction techniques.

## 21.5 Knowledge Graphs and ontology engineering

The domain ontology examples connect KGs to expert-built vocabularies such as FoodOn, SNOMED CT, and GO. The lecture also connects ontology editing to consistency checking using symbolic reasoners.

## 21.6 Uncertain reasoning and real-world ambiguity

Examples such as sarcastic language, weather forecasts, and probabilistic rules connect uncertain reasoning to messy real-world data and decision-making.

---

# 22. Unclear sections to revisit in the recording

1. **Course/unit name in transcript**
   - Transcript says “Advanced Topics in Algebra, Annotation and Reasoning.”
   - Slides say “Advanced Topics in Knowledge Representation and Reasoning.”
   - Use the slide title.

2. **Instructor name**
   - Transcript says “Jianjun.”
   - Slides say Jiaoyan Chen.
   - Use slide version unless the recording clarifies otherwise.

3. **“three chaos languages”**
   - Transcript says “three chaos languages.”
   - Context and slides indicate RDF, RDFS, and OWL.

4. **RDF/RDFS/OWL mistranscriptions**
   - “ADF”, “ADFs”, “oil”, “or”, “okay” are transcription errors for RDF, RDFS, OWL.

5. **Relational vs RDF query explanation**
   - Transcript around SPARQL says “schema less on the use. Implicit join with tuple patterns.”
   - Re-listen if you need exact phrasing.

6. **Ontology editing tool**
   - Transcript says “prestige.”
   - Likely a garbled tool name. Re-listen if the exact tool matters.

7. **Minimum T-norm calculation**
   - Transcript says minimum T-norm gives `0.05`.
   - Formula and slide imply:

     ```text
     min(0.7, 0.5) = 0.5
     ```

   - Treat `0.05` as transcript error.

8. **Fuzzy OWL product calculation**
   - Transcript says product of “0.0 and 0.9.”
   - Slide result is:

     ```text
     0.7 × 0.9 = 0.63
     ```

   - Treat “0.0” as transcript error.

9. **Associativity formula on slide 35**
   - Slide text appears to mix `S` and `T` in the T-conorm associativity formula.
   - Intended formula should be associativity for `S`.

10. **Missing Video 4 transcript**
    - Uploaded transcripts include Videos 1, 2, 3, 5, and 6.
    - The uncertain reasoning overview slides, especially Bayesian Network, Markov Network, Fuzzy Logic, and NMR, appear to rely mainly on the slide deck because no Video 4 transcript was provided.
