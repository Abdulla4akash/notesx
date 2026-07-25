---
subject: COMP64602
chapter: 71
title: "Week 1 — Extra Exercises"
language: en
---

# Week 1 — Knowledge Graphs, RDF and RDFS: Extra Exercise Set

A second layer on top of chapter 51, concentrating on triple modelling, RDFS entailment, and the comparison with relational data.

## Exercise types

1. **Triple modelling** — express English as RDF triples.
2. **RDFS entailment** — derive what follows from schema axioms.
3. **Reification** — represent statements about statements.
4. **Model comparison** — contrast RDF graphs with relational schemas.
5. **Diagnosis** — identify what a knowledge graph cannot express.

---

# Section A — Modelling and triples

## E1. Convert English to triples

Express as RDF triples: *Alice works for Acme, which is a company based in Manchester. Alice's email is alice@example.org.*

### Solution

**Step 1: Identify resources and literals.** Resources (get IRIs): Alice, Acme, Manchester, and the class Company. A literal: the email string.

**Step 2: Write the triples** as (subject, predicate, object):

```
:alice      :worksFor    :acme
:acme       rdf:type     :Company
:acme       :basedIn     :manchester
:alice      :email       "alice@example.org"
```

**Step 3: Note the literal/resource distinction.** The email is a **literal** — a data value that can only ever be an object, never a subject. `:manchester` is a **resource**, so it can be the subject of further triples (`:manchester :inCountry :uk`). Choosing literal vs resource is the first modelling decision, and choosing a literal forecloses saying anything more about that thing.

**Step 4: Note the graph reading.** Each triple is a labelled directed edge from subject to object. The four triples form a small directed graph with `:alice` and `:acme` as internal nodes and the email string as a leaf.

---

## E2. RDFS entailment

Given

```
:Company    rdfs:subClassOf  :Organisation
:worksFor   rdfs:domain      :Person
:worksFor   rdfs:range       :Organisation
:alice      :worksFor        :acme
:acme       rdf:type         :Company
```

list every additional triple entailed.

### Solution

**Step 1: Apply the domain rule.** `rdfs:domain` says: if `P rdfs:domain C` and `x P y`, then `x rdf:type C`. From `:worksFor rdfs:domain :Person` and `:alice :worksFor :acme`:

```
:alice  rdf:type  :Person
```

**Step 2: Apply the range rule.** If `P rdfs:range C` and `x P y`, then `y rdf:type C`. From the range axiom and the same triple:

```
:acme  rdf:type  :Organisation
```

**Step 3: Apply the subclass rule.** If `C rdfs:subClassOf D` and `x rdf:type C`, then `x rdf:type D`. From `:acme rdf:type :Company` and the subclass axiom:

```
:acme  rdf:type  :Organisation
```

— the same triple as Step 2, derived by a second route. Entailment is a set, so it appears once.

**Step 4: Check for further derivations.** `:alice rdf:type :Person` triggers no rule (no axioms about `:Person`). No more triples follow, so we have the closure.

**Step 5: State the answer.** Two new triples: `:alice rdf:type :Person` and `:acme rdf:type :Organisation`.

**Step 6: Note the modelling consequence.** Domain and range axioms in RDFS are **not constraints** — they do not reject data. They are **inference rules** that silently add type triples. Asserting `:acme :worksFor :bob` would not raise an error; it would *infer* `:acme rdf:type :Person`, which is probably not what was wanted. This differs sharply from a relational foreign-key constraint, which rejects the offending row.

---

## E3. Reification

RDF triples cannot directly carry provenance. Express *"Bob claims that Alice works for Acme"* without asserting that Alice works for Acme.

### Solution

**Step 1: State the problem.** Writing `:alice :worksFor :acme` **asserts** it. We need to talk *about* that statement while remaining neutral on its truth.

**Step 2: Reify the statement** — turn it into a resource with its three components as properties:

```
:stmt1  rdf:type       rdf:Statement
:stmt1  rdf:subject    :alice
:stmt1  rdf:predicate  :worksFor
:stmt1  rdf:object     :acme
```

**Step 3: Attach the claim to the reified node.**

```
:bob  :claims  :stmt1
```

**Step 4: Confirm neutrality.** The graph now contains no triple `:alice :worksFor :acme`. It describes a statement object and records who claims it — exactly the required separation.

**Step 5: Note the costs.** Reification replaces one triple with four plus the annotation, is verbose, and standard RDFS/OWL reasoning does **not** relate the reified node to the original statement's meaning. Practical alternatives are **named graphs** (put the triple in a graph and annotate the graph) or RDF-star, which allows a triple to be a subject directly.

---

# Section B — Comparison and limits

## E4. Same data, two models

Model *employees with a name and a manager* first as a relational table, then as RDF. State two consequences of the difference.

### Solution

**Step 1: Relational.** One table with a fixed schema:

| emp_id | name | manager_id |
|---|---|---|
| 1 | Alice | 3 |
| 2 | Bob | 3 |
| 3 | Cara | NULL |

Schema fixed in advance; `manager_id` a foreign key to `emp_id`; missing values need `NULL`.

**Step 2: RDF.**

```
:e1  :name :"Alice"   ;  :manager :e3
:e2  :name "Bob"      ;  :manager :e3
:e3  :name "Cara"
```

**Step 3: Consequence 1 — absence.** RDF has no `NULL`: Cara's missing manager is represented by the **absence of a triple**. Relationally you need an explicit `NULL` in a column that must exist. So RDF handles sparse, irregular data without schema churn.

**Step 4: Consequence 2 — schema flexibility.** Adding an `:email` to one employee is one new triple, with no schema change and no effect on others. Relationally it requires `ALTER TABLE`, adding a column that is `NULL` for everyone else. RDF's schema is **descriptive**; the relational schema is **prescriptive**.

**Step 5: State the trade-off honestly.** The relational model's rigidity buys integrity guarantees (constraints actually reject bad data) and query-planning efficiency. RDF's flexibility means bad data is accepted silently — as E2 showed, RDFS infers rather than rejects. Neither is better absolutely; they differ in where they put the burden.

**Step 6: Fix the typo above.** The first RDF line should read `:e1 :name "Alice" ; :manager :e3` — a literal takes no leading colon. Worth stating because a stray `:` changes a literal into an IRI and silently alters the meaning.

---

## E5. What a plain RDF graph cannot express

Explain why each is beyond plain RDF/RDFS, and what is needed: (a) a person has exactly one date of birth; (b) `:parentOf` and `:childOf` are inverses; (c) nobody is both a Person and a Company.

### Solution

**Step 1: (a) Cardinality.** RDFS has no cardinality constructs. Asserting two birth dates yields a graph with two triples and no complaint. Needs **OWL** `owl:FunctionalProperty` or a qualified cardinality restriction.

**Step 2: (b) Inverses.** RDFS can state subproperty, domain, and range, but not that traversing one property backwards gives the other. Needs OWL `owl:inverseOf`, after which `:a :parentOf :b` entails `:b :childOf :a`.

**Step 3: (c) Disjointness.** RDFS has `rdfs:subClassOf` but no way to say two classes cannot overlap. Needs OWL `owl:disjointWith`. Note the connection to $\mathcal{EL}$ without $\bot$ (COMP64401): with no way to express contradiction, **every** RDFS graph is consistent, so consistency checking is vacuous.

**Step 4: State the general point.** RDFS is deliberately weak — its entailment is cheap and rule-based. OWL 2 adds expressiveness (cardinality, inverses, disjointness, negation) at higher reasoning cost, and OWL 2 profiles such as **EL**, **QL**, and **RL** are chosen precisely to recover tractability for different workloads. This is the same expressiveness-versus-cost trade seen throughout both KR&R units.

**Step 5: Connect forward.** Week 2's Statistical Schema Induction *learns* OWL 2 axioms of exactly these kinds from instance data, so knowing which axiom types exist is a prerequisite for that material.

---

## E6. Diagnose an over-strong entailment

A modeller writes `:hasAuthor rdfs:range :Person` then asserts `:book1 :hasAuthor :acmePublishing`. What is inferred, and why is this a modelling error rather than a detected one?

### Solution

**Step 1: Apply the range rule.** From `:hasAuthor rdfs:range :Person` and the assertion:

```
:acmePublishing  rdf:type  :Person
```

**Step 2: Identify what went wrong.** The modeller presumably intended range as a **check** — "only people may be authors" — expecting the assertion to be rejected.

**Step 3: State what actually happened.** RDFS range is an **inference rule**, not a constraint. Rather than flagging an inconsistency, it concluded that the publisher is a person. The error propagates: anything entailed of Persons now applies to `:acmePublishing`.

**Step 4: Explain why nothing is detected.** Detection would require a contradiction, and RDFS cannot express one. Even adding `:Company rdf:type` for the publisher gives no conflict unless `:Person` and `:Company` are declared disjoint — which RDFS cannot do (E5c).

**Step 5: Give the fix.** Two routes:
- **OWL**, adding `:Person owl:disjointWith :Company`, which makes the graph genuinely **inconsistent** and so detectable by a reasoner.
- **SHACL**, which provides *validation* semantics — closed-world constraint checking that reports violations without inferring anything.

**Step 6: State the lesson.** Under the **open-world assumption**, unexpected data yields unexpected *inferences*, not errors. If you want rejection, you need a constraint language (SHACL) or explicit disjointness (OWL). Confusing inference with validation is the most common RDFS modelling mistake.
