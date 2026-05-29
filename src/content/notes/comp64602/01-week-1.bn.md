---
subject: COMP64602
chapter: 1
title: "Week 1"
language: bn
---

# সপ্তাহ ১ স্টাডি নোট — Advanced Topics in Knowledge Representation and Reasoning

**বিষয় ও পরিসর:** এই লেকচারে Knowledge Graph-কে Knowledge Representation দৃষ্টিকোণ থেকে পরিচয় করানো হয়েছে: RDF, RDFS, OWL, KG construction, uncertain reasoning, এবং RDF/RDFS/OWL-এর fuzzy extensions। এটি কোর্সের প্রথম তিন সপ্তাহের ভিত্তি তৈরি করে, যেখানে পরে Knowledge Graph reasoning methods আরও বিস্তারিতভাবে আলোচনা করা হবে।

**Course:** Advanced Topics in Knowledge Representation and Reasoning  
**Lecture topic:** Week 1 — Knowledge Graphs, RDF/RDFS/OWL, KG construction, uncertain reasoning, fuzzy RDF/RDFS/OWL  
**Instructor:** Jiaoyan Chen, Department of Computer Science.

---

## ব্যবহৃত সোর্স ম্যাটেরিয়াল

- `Advanced_KRR_Video_W1.pdf` — slide deck, 38 pages.
- `Advanced_KRR_W1_Video1-English.txt` — Week 1 introduction transcript.
- `Advanced_KRR_W1_Video2-English.txt` — KG concepts, RDF/RDFS/OWL transcript.
- `Advanced_KRR_W1_Video3-English.txt` — KG construction transcript.
- `Advanced_KRR_W1_Video5-English.txt` — fuzzy RDF/RDFS/OWL transcript.
- `Advanced_KRR_W1_Video6-English.txt` — Week 1 summary transcript.

---

## 0. Transcript correction key

Auto-transcript-এ কয়েকটি শব্দ বারবার ভুল এসেছে। Slides ব্যবহার করে এগুলো ঠিক করা হয়েছে।

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
- [UNCLEAR] Transcript-এ “Advanced Topics in Algebra, Annotation and Reasoning” বলা হয়েছে; কিন্তু slide title নিশ্চিত করে যে course হলো **Advanced Topics in Knowledge Representation and Reasoning**।

---

# 1. Week 1 overview

এই সপ্তাহের লেকচারের দুইটি বড় অংশ আছে:

1. **Knowledge Graphs**
   - Knowledge Graph কী।
   - RDF, RDFS, এবং OWL representation languages হিসেবে।
   - KG কীভাবে relational databases-এর সাথে সম্পর্কিত।
   - KG কীভাবে নির্মাণ করা হয়।

2. **Uncertain Reasoning**
   - Uncertain reasoning কী এবং কেন দরকার।
   - Probabilistic reasoning, fuzzy logic, এবং non-monotonic reasoning-এর সংক্ষিপ্ত overview।
   - Fuzzy RDF, fuzzy RDFS, এবং fuzzy OWL-এর তুলনামূলক বিস্তারিত introduction।

Lecturer বলেছেন, Week 1-এ কিছু uncertain reasoning techniques-এর overview দেওয়া হবে, কিন্তু অধিকাংশ technique এই সপ্তাহে বিস্তারিতভাবে পড়ানো হবে না। Fuzzy-logic-based extensions হলো এই সপ্তাহের সবচেয়ে বিস্তারিত অংশ।

---

# 2. Knowledge Graphs: basic concept

## 2.1 “Knowledge Graph” term-এর origin

**Knowledge Graph** শব্দটি প্রথম **Google** ব্যবহার করে, আনুমানিক 2012 সালের দিকে। এটি Google-এর knowledge base এবং সেই service-গুলোকে বোঝায় যেগুলো বিভিন্ন source থেকে সংগৃহীত structured knowledge ব্যবহার করে search results উন্নত করে।

Slide-এর example হলো **Manchester Baby**। Google-এ Manchester Baby search করলে শুধু relevant webpages দেখায় না; ডান পাশে structured information box দেখায়, যেখানে developer, successor ইত্যাদি attribute থাকে। Lecturer এটিকে backend-এ Knowledge Graph দ্বারা powered structured information-এর example হিসেবে ব্যবহার করেছেন।

### Intuition

Knowledge Graph entity সম্পর্কে facts এমনভাবে store করে যাতে computer এগুলো query এবং reason করতে পারে।

Example:

- Entity / instance: `Manchester Baby`
- Fact: `Manchester Baby hasSuccessor Manchester Mark I`
- Fact: `Manchester Baby hasDeveloper Tom Kilburn`

Lecturer-এর rough equation:

```text
Knowledge ≈ Instances + Facts
KG ≈ Linked Structured Data
```

একটি KG-কে **multi-relational graph** হিসেবে দেখা যায়: nodes হলো entities, আর labelled edges হলো relationships।

---

## 2.2 “Knowledge Graph” শব্দের broad meaning

Lecturer জোর দিয়ে বলেছেন যে **Knowledge Graph-এর একটিমাত্র standard definition নেই**। ভিন্ন researcher এবং developer ভিন্নভাবে term-টি ব্যবহার করেন।

Lecture-এ একটি spectrum দেওয়া হয়েছে:

```text
RDF facts
→ multi-relation graph data, Google-এর original usage-এর কাছাকাছি

RDF facts + schema
→ আরও semantic structure সহ graph data

OWL ontology
→ graph data + reasoning agent
→ logic-equipped KG
```

সাধারণত:

- **Knowledge Graph** বলতে relational facts / data বোঝায়।
- **Ontology** বলতে conceptual knowledge, vocabulary, schema, এবং logical definitions বোঝায়।
- কিন্তু বাস্তবে অনেকেই Knowledge Graph বলতে ontology-সহ graph-ও বোঝান।

Summary video-তে বলা হয়েছে, term-এর meaning context-এর উপর নির্ভর করে; তাই বোঝার জন্য প্রশ্ন করা দরকার: **এই KG বা ontology-তে কী logic এবং annotation features আছে?**

---

# 3. RDF: Resource Description Framework

## 3.1 Definition

**RDF** মানে **Resource Description Framework**। RDF facts-কে triples হিসেবে represent করে:

```text
<Subject, Predicate, Object>
```

Formal form:

```text
τ = <s, p, o>
```

যেখানে:

- `s` = subject / source entity
- `p` = predicate / relation
- `o` = object / target entity বা value

Slides-এর example:

```text
<Manchester Baby, hasDeveloper, Tom Kilburn>
```

এর অর্থ: Manchester Baby entity-টি `hasDeveloper` relation দ্বারা Tom Kilburn entity-এর সাথে connected।

---

## 3.2 RDF as graph data

RDF triples-এর একটি set একটি graph তৈরি করে।

Slide-এর graph-এ আছে:

```text
<Alan Turing, hasColleague, Tom Kilburn>
<Manchester Baby, hasDeveloper, Tom Kilburn>
<Manchester Baby, hasSuccessor, Manchester Mark I>
<Alan Turing, contributedTo, Manchester Mark I>
```

Graph form-এ:

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

RDF মূলত table নিয়ে নয়। RDF হলো **facts as labelled links**। প্রতিটি fact হলো একটি ছোট statement, এবং অনেক statement একসাথে graph data তৈরি করে।

---

# 4. RDFS: RDF Schema

## 4.1 Definition

**RDFS** মানে **RDF Schema**। এটি RDF-কে extend করে RDF instances এবং facts সম্পর্কে schema-level information যোগ করে।

RDFS define করতে পারে:

- Classes এবং class hierarchies.
- Data এবং object property hierarchies.
- Property domain এবং range.

### Intuition

RDF বলে:

```text
Tom Kilburn is connected to Manchester Baby by hasDeveloper.
```

RDFS অতিরিক্তভাবে বলতে পারে:

```text
Tom Kilburn is a Computer Scientist.
Computer Scientist is a subclass of Scientist.
hasDeveloper has range People.
hasTeammate is a subproperty of hasColleague.
```

অর্থাৎ RDFS RDF-এ ব্যবহৃত vocabulary-কে meaning দেয়।

---

## 4.2 RDFS examples from the lecture

Slides-এ example:

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

   মানে Tom Kilburn হলো `Computer Scientist` class-এর instance।

2. `rdfs:subClassOf`

   ```text
   <Computer Scientist, rdfs:subClassOf, Scientist>
   ```

   মানে every computer scientist is also a scientist.

3. `rdfs:range`

   ```text
   <hasDeveloper, rdfs:range, People>
   ```

   মানে `hasDeveloper` relation-এর object হিসেবে যে entity আসবে, সেটি `People` class-এর অন্তর্ভুক্ত।

4. `rdfs:subPropertyOf`

   ```text
   <hasTeammate, rdfs:subPropertyOf, hasColleague>
   ```

   মানে যদি দুই entity `hasTeammate` relation দ্বারা connected হয়, তাহলে তারা `hasColleague` relation দ্বারাও connected।

---

# 5. Relational databases vs RDF graph data

Lecture-এ relational databases এবং RDF graph data কয়েকটি aspect-এ compare করা হয়েছে।

| Aspect | Relational Database | RDF Graph Data |
|---|---|---|
| Core model | Tables with rows and columns | RDF triples |
| Schema | Fixed; tables and columns predefined | Flexible; classes and properties can evolve |
| Relationships | Foreign keys | Links / graph edges |
| Query | SQL | SPARQL; graph navigation; similarity; locality |
| Reasoning | Datalog | Horn rules, SWRL, RDFS, OWL, SHACL |
| Web support | Local databases or tabular datasets | Web-scale data, often linked between datasets using URI/IRI |

## 5.1 Core model

Relational databases data store করে tables-এ।

RDF graph data data store করে triples হিসেবে:

```text
<Subject, Predicate, Object>
```

এ কারণে RDF naturally graph-shaped।

---

## 5.2 Schema

Relational databases সাধারণত fixed schema ব্যবহার করে:

- table names
- column names
- column types

RDF graph data-র schema বেশি flexible:

- classes add করা যায়
- properties add করা যায়
- instances এবং facts add/delete হলে RDF triples evolve করতে পারে

Lecturer relational database schema-এর সাথে contrast করেছেন, যেখানে structure আগেই define করা থাকে।

---

## 5.3 Relationships

Relational databases-এ relationships সাধারণত **foreign keys** দিয়ে represent করা হয়।

RDF graph data-তে relationships directly graph edges দিয়ে represent করা হয়:

```text
<Alan Turing, hasColleague, Tom Kilburn>
```

Lecture-এর description অনুযায়ী এটি বেশি fine-grained, কারণ relationship explicit labelled edge হিসেবে instances-এর মধ্যে থাকে।

---

## 5.4 Querying

Relational databases ব্যবহার করে **SQL**।

RDF graph databases ব্যবহার করে **SPARQL** এবং graph-based operations ব্যবহার করতে পারে, যেমন:

- graph navigation
- graph similarity
- locality-based algorithms

[UNCLEAR] Transcript-এ বলা হয়েছে “Sparql query which is schema less on the use. Implicit join with tuple patterns…” Intended meaning সম্ভবত SPARQL RDF triples-এর উপর graph/triple patterns ব্যবহার করে কাজ করে, কিন্তু wording garbled।

---

## 5.5 Reasoning support

Relational databases-এ symbolic reasoning support তুলনামূলক সীমিত, যদিও Datalog ব্যবহার করা যায়।

RDF graph data-তে reasoning support বেশি শক্তিশালী:

- Datalog rules
- Horn rules
- SWRL
- RDFS reasoning
- OWL reasoning
- SHACL for constraints / validation

Lecture RDF graph data-কে ordinary relational databases-এর তুলনায় symbolic reasoning-এর জন্য richer হিসেবে দেখিয়েছে।

---

## 5.6 Web support

Relational databases সাধারণত local এবং naturally web-linked নয়।

RDF graph data local হতে পারে বা web-এ publish করা যেতে পারে। RDF প্রতিটি instance বা relation-কে web-এ unique identity হিসেবে represent করতে **URI/IRI** ব্যবহার করতে পারে। ফলে datasets share এবং link করা যায়।

---

# 6. Limitations of RDFS

RDFS useful schema features দেয়, কিন্তু lecture অনুযায়ী complex scenarios-এ এর semantic expressivity weak।

## 6.1 RDFS একসাথে complex domain-range constraints express করতে পারে না

RDFS property domain এবং range আলাদাভাবে define করতে পারে, কিন্তু subject এবং object-এর type conditionally linked এমন complex constraints express করতে পারে না।

Slides-এর examples:

```text
The parents of any Cat are Cat.
If something’s parents are Cat, it is a Cat.
```

এগুলো simple global domain/range declaration নয়। এগুলোর জন্য richer logical restrictions দরকার।

---

## 6.2 RDFS cardinality constraints express করতে পারে না

RDFS এমন constraints express করতে পারে না:

```text
A Human has exactly 2 parents.
```

Slide পরে এই ধরনের statement OWL-এ দেখায়:

```text
Human ⊑ (= 2 hasParent)
```

---

## 6.3 RDFS property characteristics express করতে পারে না

RDFS property characteristics describe করতে পারে না, যেমন:

- transitivity
- symmetry
- asymmetry
- functionality
- inverse functionality
- reflexivity
- irreflexivity
- inverse property relations
- property composition

যখন relationships শুধু “edge আছে” এর চেয়ে বেশি logical behaviour বহন করে, তখন এগুলো গুরুত্বপূর্ণ।

---

## 6.4 RDFS equivalence definitions-এর অভাব রাখে

RDFS যথাযথভাবে equivalence define করতে পারে না:

- individuals-এর মধ্যে
- classes-এর মধ্যে
- properties-এর মধ্যে

Linked data on the web-এর ক্ষেত্রে এটি গুরুত্বপূর্ণ, কারণ different data providers একই real-world thing-এর জন্য different identifiers ব্যবহার করতে পারে। Lecturer বলেছেন, datasets link করার সময় equivalence important।

---

# 7. OWL: Web Ontology Language

## 7.1 Definition

**OWL** মানে **Web Ontology Language**।

OWL RDFS-এর তুলনায় বেশি complex logical relationships এবং constraints সহ schemas support করে। এটি **Description Logic** দ্বারা underpinned, যেখানে constructors ব্যবহার হয়:

```text
⊓   conjunction / and
⊔   disjunction / or
∃   existential restriction / some
∀   universal restriction / only
¬   negation / not
```

Slides OWL-কে RDFS-এর limitations address করা language হিসেবে introduce করেছে।

---

## 7.2 OWL examples from the lecture

### Example 1: Parents of any cat are cats

```text
Cat ⊑ ∀hasParent.Cat
```

Meaning:

কোনো entity যদি Cat হয়, তাহলে তার সব `hasParent` values Cats হবে।

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

কোনো entity-র অন্তত একটি parent যদি Cat হয়, তাহলে সেই entity Cat।

In words:

```text
If something’s parents are Cat, it is a Cat.
```

[UNCLEAR] Slide-এ example হিসেবে এটি লেখা হয়েছে, কিন্তু biologically/logically এটি simplified teaching example; real-world taxonomy claim হিসেবে নেওয়া উচিত নয়।

---

### Example 3: Humans have exactly two parents

```text
Human ⊑ (= 2 hasParent)
```

Meaning:

প্রতিটি Human এমন things-এর class-এর অন্তর্ভুক্ত যাদের exactly two `hasParent` relations আছে।

এটি cardinality express করে, যা RDFS express করতে পারে না।

---

## 7.3 OWL and domain vocabularies

OWL শুধু RDF graph data-র schema define করার জন্য নয়। Domain vocabularies এবং ontologies define করতেও ব্যাপকভাবে ব্যবহার হয়।

Lecture-এর examples:

- FoodOn
- SNOMED CT
- GO / Gene Ontology

এই vocabularies-এ থাকে:

- taxonomies
- logical definitions
- fine-grained categorisations

Slide-এ FoodOn-এর segment দেখানো হয়েছে, যেমন concepts:

```text
plant food product
bean food product
soybean food product
gluten soya bread
soybean beverage
soybean milk
```

Slide-এ একটি logical example-ও আছে:

```text
food material ≡ environmental material and (has role some food)
```

FoodOn visual segment-এ `soybean milk`-কে `Glycine max`-এর সাথে derives-from restriction দ্বারা linked দেখানো হয়েছে।

---

# 8. Knowledge Graph construction

## 8.1 Overall idea

KG construction হলো বিভিন্ন source থেকে KG build বা update করার প্রক্রিয়া।

Lecture অনুযায়ী এটি interdisciplinary, involving:

- Knowledge Representation / Semantic Web
- NLP
- Machine Learning
- Web mining

---

## 8.2 Human construction: crowdsourcing and domain experts

অনেক existing KGs সরাসরি বা পরোক্ষভাবে humans দ্বারা constructed।

Examples:

```text
Wikidata
DBpedia
Yago
GeoNames
```

Slide domain ontologies-ও list করেছে:

```text
GO
SNOMED CT
FoodOn
```

### Crowdsourcing

Wikidata একটি actively developed crowdsourcing platform হিসেবে describe করা হয়েছে, যেখানে volunteers entities-এর attributes এবং relationships directly edit করতে পারে।

DBpedia এবং Yago অন্য resources, বিশেষ করে Wikipedia infoboxes থেকে formed বলে describe করা হয়েছে। Wikipedia articles web volunteers দ্বারা contributed।

### Domain experts

Gene Ontology এবং SNOMED CT-এর মতো domain ontologies সাধারণত Wikidata-এর মতো large fact-based KGs-এর তুলনায় smaller scale, কিন্তু এগুলোর quality requirement খুব high। তাই এগুলো mostly domain experts দ্বারা contributed এবং organisations দ্বারা maintained।

Lecturer ontology editing and management tools, plus symbolic reasoners-এর কথাও বলেছেন, যেগুলো consistency checking এবং inconsistency-causing knowledge detect করতে ব্যবহৃত হয়।

[UNCLEAR] Transcript-এ “prestige” বলা হয়েছে; এটি সম্ভবত একটি ontology editing tool-এর garbled name।

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

Slide workflow:

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

Text-এর মধ্যে entity mentions identify করে।

Slide-এর text corpus-এর example idea:

```text
John went to the grocery store...
```

System people, places, objects, events ইত্যাদি mentions identify করে।

### Entity Linking

Recognised mentions-কে existing KG entities-এর সাথে link করে।

Example: text-এ “Manchester Baby” mention থাকলে সেটি correct KG entity for Manchester Baby-এর সাথে match করা হবে।

### Entity Typing

Entity-কে class/type assign করে।

Example:

```text
Hamilton rdf:type RacingDriver
```

### Relation Extraction

Entities-এর মধ্যে relations extract করে।

Example:

```text
Hamilton races-for Mercedes
```

Lecturer বলেছেন, machine-extracted large graphs human construction-এর তুলনায় বেশি scalable, কিন্তু quality often lower। এগুলো অনেক সময় directly humans দ্বারা ব্যবহার না হয়ে applications-এর জন্য other tools দ্বারা utilised হয়।

---

## 8.4 KG construction from semi-structured and structured data

Sources include:

- databases
- web tables
- Excel sheets
- CSV files

এগুলো unstructured text-এর তুলনায় easier to understand এবং large graphs construct করতে useful।

Slide অনুযায়ী tabular data to KG transformation ব্যবহার করতে পারে:

```text
heuristic rules / mappings
```

কিন্তু এটি আরও require করে:

- data integration
- relationship discovery
- schema inference

---

## 8.5 Table-to-KG matching

Lecture একটি Formula 1 example দিয়েছে।

### Existing KG

Existing KG-তে Sebastian Vettel সম্পর্কে facts আছে:

```text
dbp:Vettel rdf:type dbp:RacingDriver
dbp:Vettel races-for dbp:Ferrari
dbp:Vettel lives-in dbp:Germany
```

### Table

Table-এ rows আছে:

```text
Alonso      McLaren    Spain
Hamilton    Mercedes   England
Sebastian Vettel Ferrari Germany
```

### Matching tasks

Slide অনুযায়ী table-to-KG matching includes:

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

   Row থেকে:

   ```text
   Hamilton Mercedes England
   ```

   candidate new KG facts infer করা যায়:

   ```text
   Hamilton races-for Mercedes
   Hamilton lives-in England
   Hamilton rdf:type RacingDriver
   ```

এটিকে বলা হয় **KG population**: existing KG-কে tables থেকে new entities এবং facts দিয়ে update করা।

---

## 8.6 Other KG construction techniques

Lecture আরও techniques list করেছে:

### Knowledge alignment and integration

KGs-এর মধ্যে বা একই KG-এর মধ্যে equivalent/corresponding entities discover করতে ব্যবহৃত হয়।

Purpose:

```text
same real-world thing → same / aligned KG representation
```

### Link prediction

KG-এর মধ্যে বা larger graphs-এর across missing relationships খুঁজতে ব্যবহৃত হয়।

Purpose:

```text
existing KG is incomplete → predict likely missing edges
```

### Modularisation and sub-KG extraction

Specific task-এর জন্য relevant knowledge extract করতে ব্যবহৃত হয়, যেমন নির্দিষ্ট ধরনের question answering।

Lecturer বলেছেন personal KGs-এর জন্য এটি important, বিশেষ করে যখন:

- computational resources limited
- efficient querying needed
- efficient reasoning needed

### Canonicalisation

Implementation/representation standardise করতে ব্যবহৃত হয়।

Transcript অনুযায়ী tables বা texts থেকে পাওয়া mentions informal names থাকতে পারে; সেগুলোকে URIs দ্বারা represent করে standard names-এর সাথে associate করতে হয়।

---

# 9. Uncertain reasoning

## 9.1 Definition

**Uncertain reasoning** মানে uncertainty-এর অধীনে reasoning করা।

Slide definition:

```text
Draw conclusions or make decisions when available information is incomplete,
ambiguous, inconsistent, or probabilistic rather than fully certain.
```

Key features:

- Partial বা probabilistic truth allow করে।
- শুধু True/False না, probabilities, degrees of belief, বা likelihoods ব্যবহার করতে পারে।
- Missing, conflicting, বা fuzzy data handle করে।

---

## 9.2 Motivation

Uncertain reasoning real-world data এবং tasks দ্বারা motivated।

Slide-এর examples:

### Natural language ambiguity

```text
“Manchester has great weather”
```

এটি literal হতে পারে বা sarcastic হতে পারে।

### Weather forecasting

```text
“Mostly sunny”
“50% precipitation”
```

Weather forecasts simple true/false facts নয়।

### Probabilistic rule

```text
Rain => SlipperyTrail: 0.75
```

মানে rain সাধারণত slippery trail imply করে degree/probability 0.75 সহ, absolute rule হিসেবে নয়।

---

# 10. Probabilistic reasoning

## 10.1 Definition

**Probabilistic reasoning** হলো probability theory ব্যবহার করে uncertain reasoning।

Lecture briefly দুইটি probabilistic graphical model introduce করেছে:

- Bayesian Networks
- Markov Networks / Markov Random Fields

---

## 10.2 Bayesian Network

### Formal definition from the lecture

একটি **Bayesian Network** হলো:

- probabilistic graphical model
- directed acyclic graph, DAG দ্বারা represented
- nodes represent random variables, discrete বা continuous
- edges represent conditional dependencies

### Example graph

Slide-এ দেখানো হয়েছে:

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

Idea হলো, এক variable সম্পর্কে evidence, যেমন rain বা snow, অন্য variables সম্পর্কে belief affect করে, যেমন trail slippery কিনা এবং কেউ hiking-এ যাবে কিনা।

---

## 10.3 Markov Network / Markov Random Field

### Formal definition from the lecture

একটি **Markov Network** হলো:

- undirected probabilistic graphical model
- undirected graph দ্বারা represented
- nodes are random variables
- edges are probabilistic pairwise interactions
- interactions are symmetric
- interactions are represented by a potential function

### Example graph

Slide একটি undirected graph দেখায় connecting:

```text
Rain
Snow
SlipperyTrail
GoHiking
```

### Potential function example

Slide `SlipperyTrail` এবং `GoHiking`-এর উপর একটি potential function দিয়েছে:

```text
ϕ(SlipperyTrail, GoHiking) =
  10, if SlipperyTrail = True,  GoHiking = False
   1, if SlipperyTrail = True,  GoHiking = True
   3, otherwise
```

Lecture-এর context-এ interpretation:

- Potential function different assignments-কে different scores দেয়।
- Trail slippery এবং person hiking-এ না গেলে score 10।
- Trail slippery এবং person hiking-এ গেলে score 1।
- Other cases score 3।

### Inference

Markov Networks-এ inference calculate করতে পারে:

- marginal probability
- conditional probability
- most probable assignment, MAP

---

# 11. Fuzzy logic

## 11.1 Definition

**Fuzzy logic** হলো multi-valued logic যা degrees of truth দিয়ে reasoning করতে দেয়।

Classical logic:

```text
High(Peak District) = True or False
```

Fuzzy logic:

```text
High(Peak District) = 0.6
```

অর্থাৎ fuzzy logic কোনো statement-কে fully true বা fully false হতে বাধ্য করে না।

---

## 11.2 Fuzzy truth values

Fuzzy logic continuous truth values ব্যবহার করে:

```text
γ ∈ [0, 1]
```

যেখানে:

- `0` means completely false
- `1` means completely true
- 0 এবং 1-এর মাঝের values represent partial truth

---

## 11.3 Fuzzy sets

Classical set-এ:

```text
x ∈ A
```

অথবা

```text
x ∉ A
```

Membership binary।

Fuzzy set-এ membership একটি membership function দ্বারা given:

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

মানে Peak District fuzzy class `High`-এর member degree 0.6 সহ।

---

## 11.4 Basic fuzzy connectives

Slide basic fuzzy operations দিয়েছে:

```text
AND → min(a, b)
OR  → max(a, b)
NOT → 1 - a
```

এগুলো প্রথমে introduced basic versions। Later slides AND এবং OR-কে multiple possible function families হিসেবে expand করেছে।

---

# 12. Non-monotonic reasoning

## 12.1 Definition

**Non-monotonic reasoning** মানে নতুন knowledge যোগ করলে previous conclusions invalid হয়ে যেতে পারে।

Classical logic monotonic:

```text
Once a conclusion follows, adding more knowledge does not remove that conclusion.
```

Non-monotonic reasoning নতুন evidence এলে conclusions withdrawn হতে দেয়।

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

Original conclusion নতুন knowledge দ্বারা invalidated হয়।

---

## 12.3 Features of non-monotonic reasoning

Slides list করেছে:

- Default assumptions দ্বারা incompleteness handle করে।
- Conflicting conclusions prioritise বা retract করে inconsistency resolve করে।
- Uncertainty mainly numerical probabilities দিয়ে manage করে না।
- Knowledge base-এর structure এবং inference rules-এর মাধ্যমে uncertainty manage করে।

Techniques listed:

- default logics
- circumscription
- negation-as-failure

---

# 13. Fuzzy RDF and Fuzzy RDFS

## 13.1 Definition

**Fuzzy RDF** এবং **Fuzzy RDFS** RDF এবং RDFS-কে fuzzy logic দিয়ে extend করে।

Classical RDF/RDFS-এ একটি triple asserted বা not asserted।

Fuzzy RDF/RDFS-এ triples-এর degrees of truth থাকে:

```text
<τ, γ>
```

যেখানে:

- `τ` is a triple
- `γ ∈ [0,1]` is the degree of truth

Slide example:

```text
<Manchester, rdf:type, BigCity, 0.7>
<BigCity, rdfs:subClassOf, BicycleFriendlyCity, 0.5>
```

Transcript বলে এটি partial membership-এর equivalent: একটি triple absolute না হয়ে certain degree পর্যন্ত hold করতে পারে।

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

এটি **crisp inference**, কারণ conclusion simply true।

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

প্রশ্ন: inferred triple-এর truth degree কত হবে?

Fuzzy RDF/RDFS inference rules বরাবর degrees of truth propagate করে। এটিকে **graded inference** বলা হয়।

---

# 14. T-norms: fuzzy AND

## 14.1 Definition

Fuzzy logic-এ AND-এর অধীনে truth degrees combine করার rules-কে **T-norms** বলা হয়।

Lecture তিনটি common T-norm দিয়েছে:

1. Minimum
2. Product
3. Łukasiewicz

Manchester example-এর জন্য দুই truth values ধরা যাক:

```text
γ₁ = 0.7
γ₂ = 0.5
```

---

## 14.2 Minimum T-norm

Formula:

```text
T(γ₁, γ₂) = min(γ₁, γ₂)
```

Example:

```text
T(0.7, 0.5) = min(0.7, 0.5) = 0.5
```

So:

```text
<Manchester, rdf:type, BicycleFriendlyCity, 0.5>
```

Transcript অনুযায়ী: conjunction-এর truth weaker statement-এর মতো strong।

[UNCLEAR] Transcript-এ minimum T-norm example-এ “0.05” বলা হয়েছে, কিন্তু slide এবং formula অনুযায়ী **0.5**। এটি almost certainly auto-transcription error।

---

## 14.3 Product T-norm

Formula:

```text
T(γ₁, γ₂) = γ₁ × γ₂
```

Example:

```text
T(0.7, 0.5) = 0.7 × 0.5 = 0.35
```

So:

```text
<Manchester, rdf:type, BicycleFriendlyCity, 0.35>
```

Transcript এটিকে probabilistic বলে এবং note করে যে product-style operations machine learning-এ common, যেখানে smoothness এবং differentiability important।

---

## 14.4 Łukasiewicz T-norm

Formula:

```text
T(γ₁, γ₂) = max(0, γ₁ + γ₂ - 1)
```

Example:

```text
T(0.7, 0.5) = max(0, 0.7 + 0.5 - 1)
             = max(0, 0.2)
             = 0.2
```

So:

```text
<Manchester, rdf:type, BicycleFriendlyCity, 0.2>
```

Transcript এটিকে compensatory বলে। Meaning: দুই condition একসাথে যথেষ্ট strong হতে হবে; কোনোটি খুব low হলে conjunction দ্রুত zero-এর দিকে collapse করে।

---

# 15. T-conorms: fuzzy OR

## 15.1 Definition

Fuzzy logic-এ OR-এর অধীনে truth degrees combine করার rules-কে **T-conorms** বলা হয়।

Lecture তিনটি example দিয়েছে:

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

Slide এটিকে probability of union-এর সাথে link করেছে:

```text
P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
```

Example:

```text
S(0.7, 0.5) = 0.7 + 0.5 - (0.7 × 0.5)
            = 1.2 - 0.35
            = 0.85
```

Transcript বলে এটি smoothly increases without exceeding 1।

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

Transcript বলে এটি maximum-এর তুলনায় বেশি permissive, কারণ partial truth values accumulate করে stronger OR truth দিতে পারে।

---

# 16. Fuzzy negation

Standard fuzzy negation:

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

Lecture অনুযায়ী T-norms এবং T-conorms উভয়ের properties:

## 17.1 Commutativity

Order matter করে না।

```text
T(γ₁, γ₂) = T(γ₂, γ₁)
S(γ₁, γ₂) = S(γ₂, γ₁)
```

---

## 17.2 Associativity

Grouping matter করে না।

For T-norms:

```text
T(γ₁, T(γ₂, γ₃)) = T(T(γ₁, γ₂), γ₃)
```

For T-conorms:

```text
S(γ₁, S(γ₂, γ₃)) = S(S(γ₁, γ₂), γ₃)
```

[UNCLEAR] Slide text-এ `S`-এর associativity formula-তে `T` mixed আছে বলে মনে হয়। Intended property হলো `S`-এর associativity।

---

## 17.3 Monotonicity

দুই input বাড়লে output decrease করতে পারে না।

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

- AND with full truth original degree unchanged রাখে।
- OR with full falsehood original degree unchanged রাখে।

---

# 18. Fuzzy OWL

## 18.1 Definition

**Fuzzy OWL** classical OWL-কে extend করে axioms-এ degrees of truth introduce করে।

Classical OWL axioms fully true হিসেবে treated। Fuzzy OWL degrees attach করতে পারে, যেমন:

```text
<CheapPrice ⊑ ModeratePrice, 0.7>
```

মানে subclass relationship degree 0.7 পর্যন্ত hold করে।

---

## 18.2 Fuzzy car ontology example

Lecture একটি fuzzy car ontology `𝒪` দিয়েছে, Description Logic knowledge base হিসেবে।

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

Transcript motivation ব্যাখ্যা করেছে: real world-এ cheap price এবং moderate price-এর মধ্যে strict separation নেই।

---

## 18.3 ABox axiom

ABox contains:

```text
<a : Sedan ⊓ ∃HasPrice.CheapPrice, 0.9>
```

Meaning:

Individual `a` এই class-এর member:

```text
Sedan ⊓ ∃HasPrice.CheapPrice
```

degree 0.9 সহ।

So `a` is a sedan with a cheap price to degree 0.9.

---

## 18.4 Crisp inference without truth degrees

Truth degrees ignore করলে ontology infer করতে পারে:

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

Slide says:

```text
𝒪 ⊨ a : ModerateCar
```

requires an AND operation over the coloured/fuzzy axioms.

Fuzzy degrees involved:

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

Other axioms-এর explicit truth value নেই, তাই transcript অনুযায়ী সেগুলো truth degree `1.0` হিসেবে treated।

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

এগুলো slide-এর exact results।

[UNCLEAR] Transcript says “product of 0.0 and 0.9”; slide এবং arithmetic দেখায় এটি হওয়া উচিত **0.7 and 0.9**, giving **0.63**।

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

এটি একটি RDF fact। এমন facts-এর set একটি multi-relational graph তৈরি করে।

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

Tom Kilburn যদি Computer Scientist হয়, এবং every Computer Scientist যদি Scientist হয়, তাহলে Tom Kilburn Scientist।

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

এই exact Alice/Bob instance lecture-এ নেই; rule form lecture-এর `hasTeammate` / `hasColleague` example-এর উপর directly based। Lecture-এর wording: দুইজনের teammate relationship থাকলে তাদের colleague relationship-ও থাকে।

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

এটি lecture-এর formula অনুসরণ করে:

```text
Cat ⊑ ∀hasParent.Cat
```

Felix/Luna এখানে শুধু placeholders; formula নিজেই slides থেকে নেওয়া।

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

Fuzzy version chosen T-norm অনুযায়ী degree infer করে।

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

Provided transcript বা slides-এ **“this will be on the exam”** জাতীয় explicit phrase পাওয়া যায়নি।

তবু নিচের points high-value revision points, কারণ lecture এগুলোর definitions, formulas, এবং worked examples দিয়েছে:

1. **RDF triple structure**

   ```text
   <Subject, Predicate, Object>
   ```

2. **Difference between RDF, RDFS, and OWL**
   - RDF = facts/triples.
   - RDFS = schema: classes, subclass, properties, domain/range.
   - OWL = richer Description Logic constraints.

3. **Limitations of RDFS**
   - complex domain-range restrictions express করতে পারে না
   - cardinality express করতে পারে না
   - property characteristics express করতে পারে না
   - equivalence ভালভাবে express করতে পারে না

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
   - incomplete, ambiguous, inconsistent, or probabilistic information থাকলে reasoning।

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
    - classical RDF/RDFS true/false inferred triples দেয়
    - fuzzy RDF/RDFS truth degrees propagate করে

11. **Fuzzy OWL car example**
    - product T-norm gives `0.63`
    - minimum T-norm gives `0.7`

---

# 21. Connections made in the lecture

## 21.1 Knowledge Graphs and web search

Manchester Baby search example Knowledge Graphs-কে Google search result enhancement-এর সাথে connect করে। KG-এর structured facts search results-এর পাশে information box power করে।

## 21.2 Knowledge Graphs and Semantic Web

RDF, RDFS, OWL, URI/IRI, SPARQL, SWRL, এবং SHACL lecture-কে Semantic Web technologies-এর সাথে connect করে। RDF graph data web-এ publish করা যায় এবং URI/IRI ব্যবহার করে datasets across web linked হতে পারে।

## 21.3 Knowledge Graphs and databases

Relational database comparison KGs-কে database modelling এবং querying-এর সাথে connect করে। Lecture tables/SQL/foreign keys-এর সাথে triples/SPARQL/graph edges contrast করে।

## 21.4 Knowledge Graph construction and NLP/ML

Text থেকে KG construction topic-টি connect করে:

- Natural Language Processing
- Machine Learning
- Web mining

Lecture NER, entity linking, entity typing, এবং relation extraction-কে structured knowledge extraction techniques হিসেবে উল্লেখ করেছে।

## 21.5 Knowledge Graphs and ontology engineering

Domain ontology examples KGs-কে FoodOn, SNOMED CT, এবং GO-এর মতো expert-built vocabularies-এর সাথে connect করে। Lecture ontology editing-কে symbolic reasoners দ্বারা consistency checking-এর সাথে connect করে।

## 21.6 Uncertain reasoning and real-world ambiguity

Sarcastic language, weather forecasts, এবং probabilistic rules-এর examples uncertain reasoning-কে messy real-world data এবং decision-making-এর সাথে connect করে।

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
   - Re-listen if exact phrasing needed.

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
