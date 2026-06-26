---
subject: COMP64602
chapter: 31
title: "Week 1 — Flashcards"
language: en
---

# Week 1 — Flashcards

97 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> How do you recognise a Knowledge Graph in this lecture?</summary>

Use: Look for structured facts about entities, where facts can be queried and reasoned over. Represent entities as nodes and relations as labelled links.
Discriminator: Is the data mainly linked facts about instances? If yes, treat it as KG-style data.
Reference: A Knowledge Graph stores linked structured data as relational facts; it can be viewed as a multi-relational graph.

</details>

<details>
<summary><strong>Q2.</strong> How do you model a KG as a multi-relational graph?</summary>

Steps:
1) Put each entity/instance as a node.
2) Put each relation/property as a directed labelled edge.
3) Treat each labelled edge as one fact.
4) Let many labelled edges form the graph.
Reference: A KG is graph-shaped data where nodes are entities and labelled edges are relationships.

</details>

<details>
<summary><strong>Q3.</strong> KG vs ontology — what is the discriminator?</summary>

Discriminator: Are you mainly storing relational facts, or defining vocabulary, schema, and logical constraints?
Use: Call it a KG when the focus is instance facts/data; call it an ontology when the focus is conceptual knowledge, schema, and logical definitions.
Reference: KG usually refers to relational facts; ontology refers to conceptual vocabulary/schema/logical definitions, though usage overlaps.

</details>

<details>
<summary><strong>Q4.</strong> When someone says “Knowledge Graph”, what follow-up question should you ask?</summary>

Use: Ask what logic and annotation features it has. Then classify it as plain RDF facts, RDF plus schema, or OWL-style ontology with reasoning.
Reference: The lecture stresses there is no single standard KG definition; meaning depends on context.

</details>

<details>
<summary><strong>Q5.</strong> How do you read or write an RDF fact?</summary>

Steps:
1) Choose the subject/source entity s.
2) Choose the predicate/relation p.
3) Choose the object/target entity or value o.
4) Write the fact as <s, p, o>.
Reference: RDF represents facts as triples <Subject, Predicate, Object>.

</details>

<details>
<summary><strong>Q6.</strong> How do you convert one RDF triple into graph form?</summary>

Steps:
1) Make the subject s a source node.
2) Make the object o a target node or literal value.
3) Draw a directed edge s → o.
4) Label the edge with predicate p.
Reference: An RDF triple <s,p,o> is a labelled link from s to o.

</details>

<details>
<summary><strong>Q7.</strong> How do you convert a set of RDF triples into graph data?</summary>

Steps:
1) Convert each triple into a labelled directed edge.
2) Merge repeated subjects/objects into shared nodes.
3) Keep predicates as edge labels.
4) The result is a multi-relational graph.
Reference: A set of RDF triples forms RDF graph data.

</details>

<details>
<summary><strong>Q8.</strong> RDF vs table model — what decides the representation?</summary>

Discriminator: Are facts stored as rows/columns or as subject–predicate–object links?
Use: Use a relational table when the structure is tabular; use RDF when facts are naturally labelled links.
Reference: Relational databases use tables; RDF graph data uses triples.

</details>

<details>
<summary><strong>Q9.</strong> When do you need RDFS rather than plain RDF?</summary>

Use: Add RDFS when triples need schema meaning: classes, class hierarchies, property hierarchies, domain, or range.
Discriminator: Are you defining the vocabulary used by the facts? If yes, use RDFS-level schema.
Reference: RDFS extends RDF with schema-level information about RDF instances and facts.

</details>

<details>
<summary><strong>Q10.</strong> How do you use rdf:type?</summary>

Steps:
1) Identify an individual/resource x.
2) Identify a class C.
3) Assert <x, rdf:type, C>.
4) Read it as: x is an instance/member of C.
Reference: rdf:type states class membership.

</details>

<details>
<summary><strong>Q11.</strong> How do you apply RDFS subclass reasoning?</summary>

Steps:
1) Find <x, rdf:type, C>.
2) Find <C, rdfs:subClassOf, D>.
3) Infer <x, rdf:type, D>.
4) Repeat up the class hierarchy if more subclass links exist.
Reference: rdfs:subClassOf means every instance of C is also an instance of D.

</details>

<details>
<summary><strong>Q12.</strong> How do you apply RDFS subproperty reasoning?</summary>

Steps:
1) Find <p, rdfs:subPropertyOf, q>.
2) Find a fact <s, p, o>.
3) Infer <s, q, o>.
4) Repeat up the property hierarchy if needed.
Reference: rdfs:subPropertyOf means every p-link is also a q-link.

</details>

<details>
<summary><strong>Q13.</strong> How do you use an RDFS range declaration?</summary>

Steps:
1) Find <p, rdfs:range, C>.
2) Find any fact <s, p, o>.
3) Infer <o, rdf:type, C>.
Reference: rdfs:range says objects of property p belong to class C.

</details>

<details>
<summary><strong>Q14.</strong> How do you use an RDFS domain declaration?</summary>

Steps:
1) Find <p, rdfs:domain, C>.
2) Find any fact <s, p, o>.
3) Infer <s, rdf:type, C>.
Reference: rdfs:domain says subjects of property p belong to class C.

</details>

<details>
<summary><strong>Q15.</strong> What does RDFS add to an RDF vocabulary?</summary>

Use: It gives semantic meaning to terms by declaring which resources are classes, which instances belong to them, how classes/properties specialise, and what subjects/objects properties expect.
Reference: RDFS supports classes, class hierarchies, property hierarchies, domain, and range.

</details>

<details>
<summary><strong>Q16.</strong> Relational DB vs RDF — schema discriminator?</summary>

Discriminator: Must the structure be fixed in advance, or can classes/properties evolve as triples are added?
Use: Fixed table/column schemas point to relational DBs; flexible evolving vocabularies point to RDF graph data.
Reference: Relational databases normally have fixed schemas; RDF graph schemas are more flexible.

</details>

<details>
<summary><strong>Q17.</strong> Relational DB vs RDF — relationship discriminator?</summary>

Discriminator: Are relationships represented indirectly by keys or directly by labelled edges?
Use: Foreign-key relationships are relational; explicit <s,p,o> links are RDF graph relationships.
Reference: Relational databases use foreign keys; RDF graph data uses labelled graph edges.

</details>

<details>
<summary><strong>Q18.</strong> Relational DB vs RDF — query discriminator?</summary>

Discriminator: Are you matching rows in tables or graph/triple patterns?
Use: Use SQL for relational tables; use SPARQL for RDF triples and graph patterns.
Reference: Relational databases query with SQL; RDF graph databases query with SPARQL.

</details>

<details>
<summary><strong>Q19.</strong> How do you think about a SPARQL-style RDF query?</summary>

Use: Treat the query as a graph/triple-pattern match: specify variables in subject, predicate, or object positions, then find triples/subgraphs that fit.
Reference: SPARQL queries RDF graph data using graph/triple patterns.

</details>

<details>
<summary><strong>Q20.</strong> Relational DB vs RDF — reasoning support discriminator?</summary>

Discriminator: Do you need schema/ontology reasoning over linked facts?
Use: Ordinary relational DBs have limited symbolic reasoning; RDF ecosystems support rules, RDFS, OWL, SWRL, and SHACL-style validation.
Reference: The lecture presents RDF graph data as richer for symbolic reasoning than ordinary relational databases.

</details>

<details>
<summary><strong>Q21.</strong> Relational DB vs RDF — web support discriminator?</summary>

Discriminator: Does each resource need a web-scale identity that can be linked across datasets?
Use: Use URI/IRI-based RDF when entities/properties should be globally identifiable and linkable.
Reference: RDF can use URI/IRI identifiers to publish and link data across the web.

</details>

<details>
<summary><strong>Q22.</strong> When is RDFS too weak and OWL needed?</summary>

Discriminator: Do you need complex logical constraints, cardinalities, property characteristics, or equivalence?
Use: Use RDFS for simple schema; move to OWL when schema needs Description Logic expressivity.
Reference: OWL addresses limitations of RDFS.

</details>

<details>
<summary><strong>Q23.</strong> Why can’t simple RDFS domain/range express conditional restrictions?</summary>

Use: Check whether the subject type and object type must be linked conditionally. If the constraint says “for class C, all R-fillers must be D” or “having an R-filler of D implies C”, RDFS is insufficient.
Reference: RDFS domain/range are global simple declarations, not complex class restrictions.

</details>

<details>
<summary><strong>Q24.</strong> Why can’t RDFS express cardinality constraints?</summary>

Use: If the rule says an individual must have exactly/at least/at most n fillers for property R, use OWL cardinality rather than RDFS.
Reference: RDFS cannot express cardinality constraints.

</details>

<details>
<summary><strong>Q25.</strong> Why can’t RDFS express property characteristics?</summary>

Use: If a property must be transitive, symmetric, asymmetric, functional, inverse-functional, reflexive, irreflexive, inverse, or composed, use OWL-level property axioms.
Reference: RDFS lacks property-characteristic descriptions beyond basic property hierarchy/domain/range.

</details>

<details>
<summary><strong>Q26.</strong> Why is equivalence hard in RDFS?</summary>

Use: If two identifiers/classes/properties should be treated as the same or logically equivalent, use OWL-style equivalence rather than plain RDFS.
Reference: RDFS lacks proper equivalence definitions for individuals, classes, and properties.

</details>

<details>
<summary><strong>Q27.</strong> How do you recognise OWL in this lecture?</summary>

Use: Look for schemas with richer logical constraints than RDFS: conjunction, disjunction, existential restrictions, universal restrictions, negation, cardinality, equivalence, and property characteristics.
Reference: OWL is the Web Ontology Language, underpinned by Description Logic.

</details>

<details>
<summary><strong>Q28.</strong> How do you read common OWL / Description Logic constructors?</summary>

Use:
C ⊓ D = C and D.
C ⊔ D = C or D.
¬C = not C.
∃R.C = things with some R-filler in C.
∀R.C = things whose R-fillers are all in C.
Reference: OWL uses Description Logic constructors such as conjunction, disjunction, existential restriction, universal restriction, and negation.

</details>

<details>
<summary><strong>Q29.</strong> How do you apply an OWL universal restriction?</summary>

Steps:
1) Find C ⊑ ∀R.D.
2) Find a:C.
3) Find a R b.
4) Infer b:D.
Reference: C ⊑ ∀R.D means every R-filler of any C-instance is in D.

</details>

<details>
<summary><strong>Q30.</strong> How do you apply an OWL existential restriction on the left?</summary>

Steps:
1) Find ∃R.C ⊑ D.
2) Find a relation a R b.
3) Check b:C.
4) Infer a:D.
Reference: ∃R.C denotes things that have at least one R-filler in C.

</details>

<details>
<summary><strong>Q31.</strong> How do you use an OWL exact-cardinality restriction?</summary>

Steps:
1) Identify the property R and required number n.
2) Count distinct R-fillers for the individual.
3) Check whether the count equals n.
4) Use OWL, not RDFS, for this constraint.
Reference: (= n R) denotes the class of things with exactly n R-fillers.

</details>

<details>
<summary><strong>Q32.</strong> How do you use an OWL equivalence definition?</summary>

Steps:
1) Read C ≡ E as a two-way definition.
2) If x:C, infer x:E.
3) If x:E, infer x:C.
4) Use it when a class is defined exactly by other class/property conditions.
Reference: OWL can define classes by logical equivalence, unlike plain RDFS.

</details>

<details>
<summary><strong>Q33.</strong> TBox vs ABox — what is the discriminator?</summary>

Discriminator: Is the statement about schema/classes/properties, or about named individuals?
Use: Put class/property axioms in the TBox; put individual assertions in the ABox.
Reference: In Description Logic ontologies, the TBox stores terminological/schema axioms and the ABox stores assertional facts about individuals.

</details>

<details>
<summary><strong>Q34.</strong> How do you recognise a domain vocabulary or domain ontology?</summary>

Use: Look for expert-built conceptual structure: taxonomies, logical definitions, and fine-grained categories for a domain.
Reference: OWL is widely used to define domain vocabularies and ontologies, not only RDF graph schemas.

</details>

<details>
<summary><strong>Q35.</strong> How do you construct or update a Knowledge Graph at a high level?</summary>

Steps:
1) Choose source data.
2) Identify entities/classes/relations.
3) Map them to KG identifiers and vocabulary.
4) Add facts as triples/axioms.
5) Check quality, consistency, and missing links.
Reference: KG construction builds or updates a KG from human, textual, structured, semi-structured, or graph sources.

</details>

<details>
<summary><strong>Q36.</strong> Crowdsourcing vs domain experts — which KG construction route fits?</summary>

Discriminator: Do you need broad coverage or high-confidence specialist knowledge?
Use: Crowdsourcing suits large broad fact graphs; domain experts suit smaller high-quality domain ontologies.
Reference: Human KG construction may use volunteer crowdsourcing or expert-maintained ontology work.

</details>

<details>
<summary><strong>Q37.</strong> How do symbolic reasoners support ontology construction?</summary>

Use: After adding schema axioms, run a reasoner to detect inconsistency and reveal implied knowledge. Then revise axioms or facts causing inconsistency.
Reference: The lecture links ontology editing/management with reasoners for consistency checking.

</details>

<details>
<summary><strong>Q38.</strong> How do you build KG facts from natural-language text?</summary>

Steps:
1) Gather a text corpus.
2) Run named entity recognition.
3) Link mentions to KG entities.
4) Assign entity types.
5) Extract relations between entities.
6) Store accepted results as KG facts.
Reference: Text-to-KG construction uses NLP/ML/web mining to extract structured knowledge from text.

</details>

<details>
<summary><strong>Q39.</strong> NER vs entity linking vs typing vs relation extraction — what is the discriminator?</summary>

Discriminator:
NER: where is the mention?
Entity linking: which KG entity does it denote?
Entity typing: what class is it?
Relation extraction: what relation holds between entities?
Reference: These are the main structured knowledge extraction steps named in the lecture.

</details>

<details>
<summary><strong>Q40.</strong> How do you use Named Entity Recognition in KG construction?</summary>

Steps:
1) Scan text for spans that mention entities/events/objects/places.
2) Mark each span as a candidate entity mention.
3) Pass the mention to linking/typing steps.
Reference: NER identifies entity mentions in text.

</details>

<details>
<summary><strong>Q41.</strong> How do you use Entity Linking in KG construction?</summary>

Steps:
1) Take a recognised mention m.
2) Generate candidate KG entities.
3) Choose the entity whose identity/context best matches m.
4) Store the canonical KG identifier.
Reference: Entity Linking maps text mentions to existing KG entities.

</details>

<details>
<summary><strong>Q42.</strong> How do you use Entity Typing in KG construction?</summary>

Steps:
1) Take an entity or linked mention.
2) Choose an appropriate class C.
3) Assert <entity, rdf:type, C>.
Reference: Entity Typing assigns a class/type to an entity.

</details>

<details>
<summary><strong>Q43.</strong> How do you use Relation Extraction in KG construction?</summary>

Steps:
1) Identify two or more entity mentions/entities in context.
2) Decide which relation R is expressed.
3) Create a candidate triple <s, R, o>.
4) Validate or score it before KG insertion.
Reference: Relation Extraction extracts relations between entities.

</details>

<details>
<summary><strong>Q44.</strong> Human-built vs machine-extracted KG — what trade-off should you expect?</summary>

Discriminator: Is the priority coverage/scale or reliability/quality?
Use: Machine extraction scales to large graphs but may be lower quality; human/expert construction is slower but often cleaner.
Reference: The lecture notes automatic large graphs are scalable but often lower quality than expert/human-curated resources.

</details>

<details>
<summary><strong>Q45.</strong> How do you construct KG data from structured or semi-structured sources?</summary>

Steps:
1) Read tables/databases/spreadsheets/CSV-like sources.
2) Map rows/cells/columns to entities, classes, and properties.
3) Integrate with existing identifiers/schema.
4) Discover relationships and infer missing schema if needed.
Reference: Structured/semi-structured data can be transformed to KGs using mappings plus data integration, relation discovery, and schema inference.

</details>

<details>
<summary><strong>Q46.</strong> How do you perform table-to-KG matching?</summary>

Steps:
1) Match cells to KG entities.
2) Match columns to classes/types.
3) Match column pairs to properties/relations.
4) Use matched rows to propose new facts.
Reference: Table-to-KG matching maps table content and structure into KG entities, classes, properties, and facts.

</details>

<details>
<summary><strong>Q47.</strong> Cell-to-entity vs column-type vs inter-column relation — what is the discriminator?</summary>

Discriminator:
Cell-to-entity: which KG entity does this cell denote?
Column-type: what class do values in this column instantiate?
Inter-column relation: what property links values across two columns?
Reference: These are the table-to-KG matching tasks named in the lecture.

</details>

<details>
<summary><strong>Q48.</strong> How do you use table data for KG population?</summary>

Steps:
1) Complete cell/entity, column/class, and relation/property matching.
2) For each row, form candidate triples.
3) Add new entities or facts to the existing KG when accepted.
Reference: KG population updates an existing KG with new entities and facts from sources such as tables.

</details>

<details>
<summary><strong>Q49.</strong> Knowledge alignment/integration — when do you use it?</summary>

Use: Use alignment when two KG identifiers may refer to the same or corresponding real-world thing. Match them, then integrate or link their representations.
Discriminator: Is the problem “same thing, different KG representation”?
Reference: Knowledge alignment and integration discover equivalent or corresponding entities across or within KGs.

</details>

<details>
<summary><strong>Q50.</strong> Link prediction — when do you use it?</summary>

Use: Use link prediction when the KG is incomplete and you need likely missing relationships. Predict candidate edges between existing or new entities.
Discriminator: Is the problem “missing edge”?
Reference: Link prediction finds likely missing relationships in a KG.

</details>

<details>
<summary><strong>Q51.</strong> Modularisation / sub-KG extraction — when do you use it?</summary>

Use: Extract only the knowledge relevant to a task when full-KG reasoning/querying is too expensive or unnecessary.
Discriminator: Is the problem “too much KG for this task/resource budget”?
Reference: Modularisation and sub-KG extraction select relevant KG parts for efficient querying/reasoning.

</details>

<details>
<summary><strong>Q52.</strong> Canonicalisation — when do you use it in KG construction?</summary>

Use: Standardise informal mentions or source-specific labels into canonical URIs/IRIs and standard names.
Discriminator: Is the problem “many surface forms, one standard representation”?
Reference: Canonicalisation standardises KG implementation/representation.

</details>

<details>
<summary><strong>Q53.</strong> How do you recognise uncertain reasoning?</summary>

Use: Look for reasoning where information is incomplete, ambiguous, inconsistent, fuzzy, or probabilistic. Conclusions may be partial, probabilistic, or revisable rather than simply true/false.
Reference: Uncertain reasoning draws conclusions or decisions when information is not fully certain.

</details>

<details>
<summary><strong>Q54.</strong> What kinds of uncertainty does the lecture highlight?</summary>

Use: Check whether the information is missing, conflicting, ambiguous, fuzzy/graded, or probabilistic. Choose an uncertainty method accordingly.
Reference: Uncertain reasoning handles incomplete, ambiguous, inconsistent, probabilistic, or partially true information.

</details>

<details>
<summary><strong>Q55.</strong> How do you recognise probabilistic reasoning?</summary>

Use: Look for probabilities, conditional probabilities, likelihoods, or degrees of belief over random variables/events.
Discriminator: Are uncertainty values probabilities rather than truth degrees?
Reference: Probabilistic reasoning is uncertain reasoning using probability theory.

</details>

<details>
<summary><strong>Q56.</strong> How do you recognise a Bayesian Network?</summary>

Use: Look for a directed acyclic graph whose nodes are random variables and whose arrows encode conditional dependencies.
Discriminator: Directed acyclic conditional-dependency graph = Bayesian Network.
Reference: A Bayesian Network is a probabilistic graphical model represented by a DAG.

</details>

<details>
<summary><strong>Q57.</strong> How do you perform Bayesian Network inference at a high level?</summary>

Steps:
1) Enter evidence about observed variables.
2) Use conditional dependencies and Bayes-style probability propagation.
3) Update beliefs about unobserved/query variables.
Reference: Bayesian Network inference propagates probabilities through the network using Bayes’ rules/conditional dependencies.

</details>

<details>
<summary><strong>Q58.</strong> How do you recognise a Markov Network / Markov Random Field?</summary>

Use: Look for an undirected graph of random variables where edges indicate symmetric probabilistic interactions scored by potentials.
Discriminator: Undirected interaction graph with potentials = Markov Network.
Reference: A Markov Network is an undirected probabilistic graphical model with potential functions.

</details>

<details>
<summary><strong>Q59.</strong> How do you interpret a Markov Network potential function?</summary>

Steps:
1) Choose an assignment of values to connected variables.
2) Look up or compute its potential score.
3) Treat higher scores as more compatible/preferred assignments before normalisation.
Reference: A potential function assigns scores to variable assignments/interactions in a Markov Network.

</details>

<details>
<summary><strong>Q60.</strong> Bayesian Network vs Markov Network — what is the discriminator?</summary>

Discriminator: Are dependencies directed and acyclic, or undirected and symmetric?
Use: Directed acyclic conditional dependencies imply Bayesian Network; undirected pairwise interactions with potentials imply Markov Network.
Reference: Bayesian Networks use DAGs; Markov Networks use undirected graphs.

</details>

<details>
<summary><strong>Q61.</strong> What inference questions can a Markov Network answer?</summary>

Use: Ask for marginal probabilities, conditional probabilities, or the most probable assignment.
Reference: Markov Network inference can compute marginal probability, conditional probability, and MAP assignment.

</details>

<details>
<summary><strong>Q62.</strong> How do you recognise fuzzy logic?</summary>

Use: Look for statements that can be true to a degree between fully false and fully true. Do not force binary true/false.
Discriminator: Is the value a degree of truth? If yes, use fuzzy logic.
Reference: Fuzzy logic is multi-valued logic with degrees of truth.

</details>

<details>
<summary><strong>Q63.</strong> How do fuzzy truth values work?</summary>

Use: Assign each statement a value α ∈ [0,1], where 0 means completely false, 1 means completely true, and intermediate values mean partial truth.
Reference: Fuzzy logic uses continuous truth values in [0,1].

</details>

<details>
<summary><strong>Q64.</strong> How do you use a fuzzy set membership function?</summary>

Steps:
1) Define a fuzzy set/class A.
2) Define μ_A(x).
3) For an element x, compute μ_A(x) ∈ [0,1].
4) Read it as x belongs to A to that degree.
Reference: A fuzzy set uses a membership function μ_A(x) mapping elements to [0,1].

</details>

<details>
<summary><strong>Q65.</strong> How do the basic fuzzy connectives work?</summary>

Use:
AND: combine by min(α,β).
OR: combine by max(α,β).
NOT: use 1−α.
Reference: The lecture first introduces fuzzy AND as min, OR as max, and NOT as 1−α.

</details>

<details>
<summary><strong>Q66.</strong> Fuzzy vs probabilistic vs non-monotonic reasoning — what is the discriminator?</summary>

Discriminator:
Fuzzy: degree of truth/membership.
Probabilistic: probability or belief about events/variables.
Non-monotonic: conclusions can be withdrawn when new knowledge arrives.
Reference: These are distinct uncertain reasoning styles introduced in the lecture.

</details>

<details>
<summary><strong>Q67.</strong> How do you recognise non-monotonic reasoning?</summary>

Use: Test whether adding new knowledge can invalidate an earlier conclusion. If yes, the reasoning is non-monotonic.
Reference: Non-monotonic reasoning allows conclusions to be withdrawn when new evidence is added.

</details>

<details>
<summary><strong>Q68.</strong> How do you apply default-style non-monotonic reasoning?</summary>

Steps:
1) Draw a default conclusion from incomplete knowledge.
2) Add new information.
3) Check whether it triggers an exception/conflict.
4) Retract or revise the earlier conclusion if needed.
Reference: Non-monotonic reasoning handles incompleteness through default assumptions and retraction.

</details>

<details>
<summary><strong>Q69.</strong> How does non-monotonic reasoning handle uncertainty differently from probability?</summary>

Use: Do not assign a numeric probability first. Instead, use inference rules, defaults, exceptions, priorities, or negation-as-failure to decide what follows.
Reference: Non-monotonic reasoning manages uncertainty through KB structure and inference rules, not mainly numerical probabilities.

</details>

<details>
<summary><strong>Q70.</strong> What techniques are associated with non-monotonic reasoning in the lecture?</summary>

Use: Recognise default logics, circumscription, and negation-as-failure as non-monotonic techniques.
Reference: The lecture lists default logics, circumscription, and negation-as-failure.

</details>

<details>
<summary><strong>Q71.</strong> How do you recognise Fuzzy RDF/RDFS?</summary>

Use: Look for RDF/RDFS triples annotated with truth degrees. Instead of only asserted/not asserted, each triple can hold partially.
Reference: Fuzzy RDF/RDFS extends RDF/RDFS with fuzzy logic and truth degrees.

</details>

<details>
<summary><strong>Q72.</strong> How do you write a fuzzy RDF/RDFS triple?</summary>

Steps:
1) Start with an RDF triple τ = <s,p,o>.
2) Assign a degree α ∈ [0,1].
3) Write the fuzzy assertion as <τ, α>.
Reference: In fuzzy RDF/RDFS, a triple is paired with a truth degree.

</details>

<details>
<summary><strong>Q73.</strong> Crisp vs graded RDF/RDFS inference — what is the discriminator?</summary>

Discriminator: Does the inferred triple have only true/false status, or a propagated degree?
Use: Classical RDF/RDFS gives crisp inferred triples; fuzzy RDF/RDFS computes degrees for inferred triples.
Reference: Crisp inference produces true conclusions; graded inference propagates truth degrees.

</details>

<details>
<summary><strong>Q74.</strong> How do you compute a fuzzy RDFS subclass/type inference degree?</summary>

Steps:
1) Take <x rdf:type C, α>.
2) Take <C rdfs:subClassOf D, β>.
3) Choose a T-norm T for fuzzy AND.
4) Infer <x rdf:type D, T(α,β)>.
Reference: Fuzzy RDF/RDFS propagates degrees through inference rules using a T-norm.

</details>

<details>
<summary><strong>Q75.</strong> How do you compute a fuzzy RDFS subproperty inference degree?</summary>

Steps:
1) Take <p rdfs:subPropertyOf q, β>.
2) Take <s p o, α>.
3) Choose a T-norm T.
4) Infer <s q o, T(α,β)>.
Reference: Fuzzy subproperty reasoning combines the fact degree and subproperty degree.

</details>

<details>
<summary><strong>Q76.</strong> T-norm vs T-conorm — what is the discriminator?</summary>

Discriminator: Are you combining fuzzy truth degrees with AND or OR?
Use: Use a T-norm for AND/conjunction; use a T-conorm for OR/disjunction.
Reference: T-norms model fuzzy AND; T-conorms model fuzzy OR.

</details>

<details>
<summary><strong>Q77.</strong> How do you use the minimum T-norm?</summary>

Steps:
1) Take two truth degrees α and β.
2) Compute T_min(α,β)=min(α,β).
3) Use the weaker premise as the conjunction degree.
Reference: Minimum T-norm: T(α,β)=min(α,β).

</details>

<details>
<summary><strong>Q78.</strong> How do you use the product T-norm?</summary>

Steps:
1) Take two truth degrees α and β.
2) Compute T_prod(α,β)=αβ.
3) Use it when conjunction should decrease smoothly with both inputs.
Reference: Product T-norm: T(α,β)=α·β.

</details>

<details>
<summary><strong>Q79.</strong> How do you use the Łukasiewicz T-norm?</summary>

Steps:
1) Take truth degrees α and β.
2) Add them and subtract 1.
3) Cap below at 0: T_L(α,β)=max(0,α+β−1).
4) Use it when both inputs must be strong enough together.
Reference: Łukasiewicz T-norm: T(α,β)=max(0,α+β−1).

</details>

<details>
<summary><strong>Q80.</strong> Minimum vs product vs Łukasiewicz T-norm — what is the discriminator?</summary>

Discriminator:
Minimum: conjunction equals the weaker premise.
Product: conjunction smoothly multiplies support.
Łukasiewicz: conjunction is zero unless combined support exceeds the threshold.
Reference: The lecture gives minimum, product, and Łukasiewicz as common fuzzy AND operators.

</details>

<details>
<summary><strong>Q81.</strong> How do you use the maximum T-conorm?</summary>

Steps:
1) Take truth degrees α and β.
2) Compute S_max(α,β)=max(α,β).
3) Use the stronger premise as the disjunction degree.
Reference: Maximum T-conorm: S(α,β)=max(α,β).

</details>

<details>
<summary><strong>Q82.</strong> How do you use the probabilistic-sum T-conorm?</summary>

Steps:
1) Take truth degrees α and β.
2) Compute S_prob(α,β)=α+β−αβ.
3) Use it for a smooth OR that does not exceed 1.
Reference: Probabilistic-sum T-conorm: S(α,β)=α+β−αβ.

</details>

<details>
<summary><strong>Q83.</strong> How do you use the Łukasiewicz T-conorm?</summary>

Steps:
1) Take truth degrees α and β.
2) Add them.
3) Cap above at 1: S_L(α,β)=min(1,α+β).
4) Use it when partial truths can accumulate strongly.
Reference: Łukasiewicz T-conorm: S(α,β)=min(1,α+β).

</details>

<details>
<summary><strong>Q84.</strong> Maximum vs probabilistic sum vs Łukasiewicz T-conorm — what is the discriminator?</summary>

Discriminator:
Maximum: stronger premise wins.
Probabilistic sum: smooth accumulation without exceeding 1.
Łukasiewicz: capped addition, more permissive accumulation.
Reference: The lecture gives maximum, probabilistic sum, and Łukasiewicz as fuzzy OR operators.

</details>

<details>
<summary><strong>Q85.</strong> How do you compute fuzzy negation?</summary>

Steps:
1) Take truth degree α.
2) Compute N(α)=1−α.
3) Interpret the negated statement as true to degree 1−α.
Reference: Standard fuzzy negation is N(α)=1−α.

</details>

<details>
<summary><strong>Q86.</strong> What does commutativity require for T-norms/T-conorms?</summary>

Use: Check whether swapping inputs leaves the output unchanged: T(α,β)=T(β,α) and S(α,β)=S(β,α).
Reference: Commutativity means order of fuzzy inputs does not matter.

</details>

<details>
<summary><strong>Q87.</strong> What does associativity let you do with fuzzy AND/OR?</summary>

Use: Combine more than two degrees without caring about grouping: T(α,T(β,γ))=T(T(α,β),γ), and similarly for S.
Reference: Associativity means grouping of fuzzy inputs does not matter.

</details>

<details>
<summary><strong>Q88.</strong> What does monotonicity require for T-norms/T-conorms?</summary>

Use: If input degrees increase, the combined output must not decrease. Check α≤α′ and β≤β′ implies T(α,β)≤T(α′,β′), and similarly for S.
Reference: Monotonicity means stronger inputs cannot produce a weaker fuzzy combination.

</details>

<details>
<summary><strong>Q89.</strong> What are the identity elements for fuzzy AND and OR?</summary>

Use: For AND/T-norm, combine with 1 and leave the degree unchanged: T(α,1)=α. For OR/T-conorm, combine with 0 and leave it unchanged: S(α,0)=α.
Reference: T-norm identity is 1; T-conorm identity is 0.

</details>

<details>
<summary><strong>Q90.</strong> How do you recognise Fuzzy OWL?</summary>

Use: Look for OWL axioms or class assertions annotated with truth degrees. Reasoning then propagates degrees through OWL-style logical structure.
Reference: Fuzzy OWL extends classical OWL by introducing degrees of truth to axioms.

</details>

<details>
<summary><strong>Q91.</strong> Classical OWL inference vs Fuzzy OWL inference — what is the discriminator?</summary>

Discriminator: Are axioms treated as fully true, or do some carry degrees?
Use: Classical OWL derives crisp entailments; Fuzzy OWL derives entailments with degrees.
Reference: Classical OWL axioms are fully true; Fuzzy OWL can attach degrees to axioms/assertions.

</details>

<details>
<summary><strong>Q92.</strong> How do you perform a graded Fuzzy OWL inference?</summary>

Steps:
1) Identify the target class assertion to prove.
2) Trace the TBox/ABox axioms needed for the proof.
3) Assign explicit degrees to fuzzy axioms/assertions.
4) Treat ungraded crisp axioms as degree 1.
5) Combine required degrees with the chosen T-norm.
Reference: Fuzzy OWL graded inference uses fuzzy AND over the axioms needed for an OWL entailment.

</details>

<details>
<summary><strong>Q93.</strong> How do ungraded OWL axioms behave inside Fuzzy OWL calculations?</summary>

Use: Treat axioms with no explicit truth degree as fully true, degree 1, when combining them with fuzzy axioms.
Reference: In the lecture’s fuzzy OWL reasoning, ungraded axioms are treated as truth degree 1.0.

</details>

<details>
<summary><strong>Q94.</strong> How do you use a fuzzy subclass axiom in OWL-style reasoning?</summary>

Steps:
1) Take a fuzzy subclass axiom <C ⊑ D, β>.
2) Take an assertion or derived membership <a:C, α>.
3) Choose a T-norm T.
4) Infer <a:D, T(α,β)>.
Reference: A fuzzy subclass axiom propagates membership degree from subclass to superclass through a T-norm.

</details>

<details>
<summary><strong>Q95.</strong> How do you reason with a fuzzy existential class definition?</summary>

Steps:
1) Identify a definition involving C ⊓ ∃R.D.
2) Prove the individual is in C.
3) Prove it has some R-filler in D.
4) Combine the required degrees using the selected T-norm.
Reference: Fuzzy OWL combines degrees across conjunctive class conditions.

</details>

<details>
<summary><strong>Q96.</strong> RDF vs RDFS vs OWL — what is the one-question discriminator?</summary>

Discriminator: Are you storing facts, adding simple schema, or expressing rich logical constraints?
Use: RDF = triples/facts. RDFS = classes, subclass, properties, domain/range. OWL = Description Logic constraints and richer reasoning.
Reference: The lecture presents RDF, RDFS, and OWL as increasing levels of semantic expressivity.

</details>

<details>
<summary><strong>Q97.</strong> Crisp RDF/RDFS/OWL vs fuzzy extensions — what changes?</summary>

Discriminator: Are assertions simply true/false, or annotated with degrees in [0,1]?
Use: Classical systems infer crisp facts; fuzzy RDF/RDFS/OWL infer facts/axioms with propagated degrees.
Reference: Fuzzy extensions add degrees of truth to RDF/RDFS/OWL assertions and reasoning.

</details>
