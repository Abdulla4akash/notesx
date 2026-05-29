---
subject: COMP64602
chapter: 2
title: "Week 2"
language: bn
---

# Advanced Topics in Knowledge Representation and Reasoning — Week 2 Study Notes

**টপিক ও স্কোপ।**  
এই লেকচারটি বড় **knowledge graph**-এর ওপর অনিশ্চিত logical/ontological knowledge শেখার পদ্ধতি নিয়ে। Week 2-তে তিনটি মূল বিষয় আছে: **Statistical Schema Induction** দিয়ে OWL 2 schema axiom শেখা, **Horn rule mining** using **AMIE**, এবং শেষে **Markov Logic Network**-এর সংক্ষিপ্ত পরিচয়, যেখানে first-order logic ও Markov network একসাথে ব্যবহার করে uncertain reasoning করা হয়।

**সোর্স নোট।**  
এই নোটগুলো Week 2 slides এবং Video 1, 2, 3, 4, 6 transcripts থেকে তৈরি। Video 5 transcript আপলোড করা নেই, তাই Markov Logic Network অংশটি শুধু summary-level-এ রাখা হয়েছে।

---

## 1. Week 2 lecture structure

এই সপ্তাহের লেকচার তিনটি সম্পর্কিত পদ্ধতির ওপর দাঁড়ানো:

1. **Ontology learning / Statistical Schema Induction**
   - factual RDF triples থেকে schema-level OWL 2 axioms শেখে।
   - graph data-কে transaction table-এ রূপান্তর করে association rule mining ব্যবহার করে।

2. **Rule mining / Horn rules / AMIE**
   - বড় factual knowledge graph থেকে logical rules mine করে।
   - Horn rules schema knowledge-এর মতো কাজ করে, কারণ এগুলো reusable pattern প্রকাশ করে।
   - AMIE incomplete evidence-এর অধীনে efficiently Horn rules mine করে।

3. **Relational machine learning / Markov Logic Networks**
   - uploaded material-এ শুধু সংক্ষিপ্তভাবে আছে।
   - মূল ধারণা: first-order logic formula ব্যবহার করে instances থেকে Markov networks instantiate করা।

---

# 2. Statistical Schema Induction / SSI

## 2.1 SSI কী

**ইনটুইশন।**  
Statistical Schema Induction হলো RDF triples-এর repository থেকে schema knowledge শেখার পদ্ধতি। ম্যানুয়ালি ontology বানানোর বদলে SSI data-এর মধ্যে pattern দেখে সম্ভাব্য OWL 2 axioms induce করে।

**Slides অনুযায়ী formal description।**  
RDF triples আকারে facts দেওয়া থাকলে SSI OWL 2 schema শেখে, যেখানে axioms তৈরি হতে পারে:

- top concept: $\top$
- bottom concept: $\bot$
- conjunction: $C \sqcap D$
- existential restriction: $\exists r.C$
- general concept inclusion: $C \sqsubseteq D$
- role composition and inclusion:  
  $r_1 \circ \dots \circ r_k \sqsubseteq r$

উদাহরণ:

$$
Airport \sqsubseteq Building
$$

$$
Country \sqsubseteq \exists hasLanguage.Language
$$

$$
Male \sqcap Parent \sqsubseteq Father
$$

SSI data থেকে **schema-level conclusions** শেখে, কিন্তু এগুলো সাধারণত uncertain হয়, কারণ এগুলো অনেক facts দ্বারা supported হতে পারে, কিন্তু সব facts দ্বারা নয়।

---

## 2.2 Association rule mining কেন আসে

Lecturer SSI-কে **association rule mining**-এর সাথে connect করেছেন।

**ইনটুইশন।**  
Association rule mining এমন pattern খুঁজে:

> কোনো transaction-এ কিছু items থাকলে, আরেকটি item থাকার সম্ভাবনা বেশি।

Classic supermarket example:

$$
\{Milk, Bread\} \Rightarrow \{Butter\}
$$

SSI এই idea নেয়: knowledge graph facts-কে transaction table-এ রূপান্তর করা হয়। এরপর table columns-এর ওপর rules mine করা হয়, এবং সেই rules ontology axioms-এ convert করা হয়।

---

## 2.3 Association rules: definitions

Association rule-এর form:

$$
X \Rightarrow Y
$$

যেখানে:

- $X$ হলো **antecedent**, অর্থাৎ “if” part।
- $Y$ হলো **consequent**, অর্থাৎ “then” part।

উদাহরণ:

$$
\{Milk, Bread\} \Rightarrow \{Butter\}
$$

### Support

**ইনটুইশন।**  
Support measure করে itemset transaction database-এ কতবার দেখা যায়।

**Formal definition।**

ধরি:

$$
D = \{t_1, \dots, t_m\}
$$

একটি list of transactions। তাহলে:

$$
Support(X) = |\{t \in D : X \subseteq t\}|
$$

অর্থাৎ support হলো কতগুলো transaction-এ $X$-এর সব items আছে।

### Confidence

**ইনটুইশন।**  
Confidence measure করে: যেসব transaction-এ $X$ আছে, তার মধ্যে কতবার $Y$-ও আছে।

**Formal definition।**

$$
Confidence(X \Rightarrow Y) =
\frac{Support(X \cup Y)}{Support(X)}
$$

### Worked example: milk, bread, butter

দেওয়া আছে:

- $\{Milk, Bread\}$ আছে 100 transactions-এ।
- $\{Milk, Bread, Butter\}$ আছে 90 transactions-এ।

তাহলে:

$$
Confidence(\{Milk, Bread\} \Rightarrow \{Butter\})
=
\frac{90}{100}
=
0.9
$$

Important detail: milk, bread, butter-সহ যে 90 transactions আছে, সেগুলো milk and bread থাকা 100 transactions-এর মধ্যেই পড়ে।

---

## 2.4 Apriori algorithm

Slides-এ **Apriori** association rule mining algorithm হিসেবে এসেছে।

**Core assumption / Apriori property।**

> যদি কোনো itemset frequent হয়, তাহলে তার সব subsets-ও frequent হতে হবে।

অন্যভাবে: কোনো candidate itemset-এর কোনো subset যদি infrequent হয়, তাহলে candidate itemset frequent হতে পারে না।

### Step 1: frequent itemsets discover করা

উদাহরণ frequent itemset:

$$
\{Milk, Bread, Butter\}
$$

Process:

1. Minimum support threshold দিয়ে frequent 1-itemsets খুঁজে।
2. Frequent $(k-1)$-itemsets থেকে candidate $k$-itemsets generate করে।
3. Apriori property দিয়ে candidates prune করে।
4. Transactions scan করে support calculate করে।
5. আর frequent itemset না পাওয়া পর্যন্ত repeat করে।

Slide notes: এটি **level-wise, breadth-first search**।

### Step 2: frequent itemsets থেকে rules generate করা

প্রতিটি frequent itemset $X$-এর জন্য:

- প্রতিটি non-empty subset $A \subset X$ নেওয়া হয়।
- rule generate করা হয়:

$$
A \Rightarrow X \setminus A
$$

- তারপর confidence calculate করা হয়।

---

# 3. SSI method: RDF triples থেকে OWL 2 axioms

## 3.1 Overall SSI workflow

SSI method-এর তিনটি main step আছে।

### Step 1: Terminology acquisition

System knowledge graph থেকে terminology সংগ্রহ করে:

- named concepts/classes
- properties/relations

এগুলো transaction table বানাতে ব্যবহৃত হয়।

### Step 2: Association rule mining

Transaction tables-এর ওপর association rule mining apply করা হয়:

- possible rules-এর support ও confidence calculate করা হয়।
- data pattern ভালোভাবে reflect করে এমন rules select করা হয়।
- selected association rules OWL 2 axioms-এ transform করা হয়।

### Step 3: Ontology construction

Learned axioms ব্যবহার করে ontology construct করা হয়।

[UNCLEAR] Transcript-এ বলা হয়েছে “Java, our API or Portage” — সম্ভবত transcription error। এটা হয়তো Java OWL API বা Protégé বোঝাচ্ছে, কিন্তু slides-এ স্পষ্টভাবে নেই।

---

## 3.2 Transaction table idea

SSI-এর key move:

> RDF graph facts-কে transaction table-এ convert করা, তারপর সেই table থেকে association rules mine করা।

Simple concept hierarchy axiom যেমন:

$$
C \sqsubseteq D
$$

এর জন্য transaction table:

- rows = knowledge graph-এর instances/entities
- columns = named concepts/classes
- entry value = instance ওই concept-এর member হলে 1, না হলে 0

অর্থাৎ entity একটি “transaction”, আর তার classes হলো “items”।

---

## 3.3 Worked example: DBpedia-style transaction table

Slide-এ DBpedia fragment-এর transaction table আছে। Columns:

- Comedian
- Artist
- Person
- Airport
- Building
- Place
- Animal

Rows:

- Jerry Seinfeld
- Black Bird
- Chris Rock
- Robin Williams
- JFK Airport
- Hancock Tower
- Newark Airport

Example interpretation:

- `Black_Bird`-এর value শুধু `Animal` column-এ 1।
- `JFK_Airport` ও `Newark_Airport`-এর value `Airport`, `Building`, এবং `Place` column-এ 1।

Mined association rule:

$$
\{Airport\} \Rightarrow \{Building\}
$$

Slide-এ দেওয়া:

$$
Support(\{Airport, Building\}) = 2
$$

কারণ দুইটি airport instance building-ও:

- `JFK_Airport`
- `Newark_Airport`

Confidence:

$$
Confidence(\{Airport\} \Rightarrow \{Building\})
=
\frac{2}{2}
=
1.0
$$

কারণ এই small table-এ প্রতিটি airport-ই building হিসেবে marked।

এই association rule schema axiom-এ convert হয়:

$$
Airport \sqsubseteq Building
$$

---

## 3.4 Different axiom types-এর জন্য transaction tables

Lecturer বলেছেন SSI arbitrary huge number of transaction tables দরকার করে না। Theoretically, প্রতিটি axiom type-এর জন্য একটি transaction table লাগে।

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

Meaning: কোনো instance যদি $C_i$-তে belong করে, তাহলে সম্ভবত $C_j$-তেও belong করে।

---

### Axiom type: conjunction subclass

Axiom:

$$
C \sqcap D \sqsubseteq E
$$

Transaction table একই concept-membership table:

$$
a \mapsto C_1, \dots, C_n
$$

Association rule:

$$
\{C_i, C_j\} \Rightarrow \{C_k\}
$$

Meaning: কোনো instance যদি $C_i$ এবং $C_j$ দুইটিতেই belong করে, তাহলে সম্ভবত $C_k$-তে belong করে।

Example:

$$
Male \sqcap Parent \sqsubseteq Father
$$

---

### Axiom type: named concept subclass of existential restriction

Axiom:

$$
D \sqsubseteq \exists r.C
$$

এখানে superclass complex concept: existential restriction।

Transaction table-এ থাকে:

- named concepts
- existential restriction columns, যেমন $\exists r_1.C_{11}$

Association rule pattern:

$$
\{C_k\} \Rightarrow \{\exists r_j.C_{jk}\}
$$

Meaning: কোনো entity যদি $C_k$ concept-এ belong করে, তাহলে সম্ভবত তার $r_j$ relation আছে কোনো $C_{jk}$ instance-এর সাথে।

Example:

$$
Country \sqsubseteq \exists hasLanguage.Language
$$

Meaning: `Country`-এর প্রতিটি instance-এর অন্তত একটি `hasLanguage` relation আছে কোনো `Language` instance-এর সাথে।

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

Meaning: কোনো entity যদি $r_j$ relation দিয়ে কোনো $C_{jk}$ instance-এর সাথে connected হয়, তাহলে সম্ভবত সে $C_i$ concept-এর member।

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

Meaning: কোনো entity-এর অন্তত একটি outgoing $r_j$ relation থাকলে, সে সম্ভবত $C_i$ concept-এর member।

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

Meaning: কোনো entity-এর অন্তত একটি incoming $r_j$ relation থাকলে, সে সম্ভবত $C_i$ concept-এর member।

---

### Axiom type: role inclusion

Axiom:

$$
r \sqsubseteq s
$$

এখানে rows হলো entity pairs:

$$
(a,b) \in N_I \times N_I
$$

Table record করে $a$ এবং $b$-এর মধ্যে কোন relations hold করে।

Association rule pattern:

$$
\{r_i\} \Rightarrow \{r_j\}
$$

Meaning: যদি $r_i(a,b)$ hold করে, তাহলে সম্ভবত $r_j(a,b)$-ও hold করে।

---

### Axiom type: role composition

Slides-এ role composition/inclusion-ও আছে। General idea:

- rows = entity pairs $(a,b)$
- columns = direct relations এবং relation-composition patterns
- rules express করতে পারে যে কোনো composed path আরেকটি relation imply করে

[UNCLEAR] Exact role-composition table OCR/transcript-এ পরিষ্কার নয়। Safe point: role-composition axioms single instance নয়, বরং instance pairs-এর ওপর transaction table ব্যবহার করে।

---

## 3.5 Existential restriction column কীভাবে fill করতে হয়

এই অংশটি exam-এর জন্য খুব গুরুত্বপূর্ণ।

Column যেমন:

$$
\exists r_1.C_{11}
$$

instance $a$-এর value হবে:

$$
1
$$

iff দুইটি triple exist করে:

$$
\langle a, r_1, b \rangle
$$

and

$$
\langle b, rdf:type, C_{11} \rangle
$$

Otherwise value হবে:

$$
0
$$

অর্থাৎ $a$ column $\exists r_1.C_{11}$ satisfy করে যদি $a$ থেকে $r_1$ edge দিয়ে কোনো entity $b$-তে যাওয়া যায়, এবং $b$ হলো $C_{11}$-এর instance।

**Exam flag.** Slide explicitly বলে: **“Be able to demonstrate these cases by examples.”**  
মানে transaction table construction-এর different axiom cases example দিয়ে দেখাতে পারতে হবে।

---

# 4. Horn rules

## 4.1 Horn rule কী

**ইনটুইশন।**  
Horn rule হলো reusable logical pattern: body conditions সত্য হলে head conclusion সত্য হওয়া উচিত।

**Slides অনুযায়ী formal definition।**

Horn rule-এর থাকে:

- **head**:

$$
r(x,y)
$$

- **body**:

$$
\{B_1, \dots, B_n\}
$$

Rule লেখা হয়:

$$
B_1, \dots, B_n \Rightarrow r(x,y)
$$

অথবা সংক্ষেপে:

$$
B \Rightarrow r(x,y)
$$

Head হলো conclusion। Body atoms হলো conditions।

---

## 4.2 Horn rule examples

### Example 1: residence থেকে birthplace

Transcript-এর simple example:

$$
livesIn(x,y) \Rightarrow wasBornIn(x,y)
$$

Meaning: যদি $x$ $y$-তে থাকে, তাহলে $x$ $y$-তে জন্মেছে।

Real world-এ সবসময় true না, কিন্তু mined rule হিসেবে knowledge graph-এর pattern describe করতে পারে।

### Example 2: spouse residence rule

Slide example:

$$
livesIn(x,y) \land marriedTo(x,z) \Rightarrow livesIn(z,y)
$$

Meaning: যদি $x$ $y$-তে থাকে এবং $x$ $z$-এর সাথে married হয়, তাহলে $z$-ও $y$-তে থাকে।

---

## 4.3 Horn rules-এ variables ও constants

Horn rules সাধারণত variables ব্যবহার করে, especially head-এ।

Reason:

- goal হলো arbitrary entities সম্পর্কে new knowledge infer করা
- variables থাকা rule অনেক entities-এর জন্য reusable
- head-এ constants থাকলে rule fact-এর মতো হয়ে যায়, reusable rule-এর মতো নয়

Transcript-এ Manchester নিয়ে constant example আছে।

[UNCLEAR] Transcript বলেছে: “if x is a Manchester then x was born in Manchester.” Intended rule সম্ভবত:

$$
livesIn(x, Manchester) \Rightarrow wasBornIn(x, Manchester)
$$

কিন্তু exact body predicate garbled।

---

## 4.4 Instantiation / grounding

**Definition।**  
Instantiation, বা **grounding**, হলো Horn rule-এর variables-কে knowledge graph-এর concrete entities/constants দিয়ে replace করা।

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

Grounded atoms হলো facts যেগুলো knowledge graph-এ true হবে বলে expected।

Lecturer function-style notation এবং RDF triples-এর connection-ও দেখিয়েছেন:

$$
livesIn(David, UK)
$$

equivalent to RDF-style triple:

$$
\langle David, livesIn, UK \rangle
$$

---

## 4.5 Knowledge graph-এ Horn rules কেন গুরুত্বপূর্ণ

Horn rules ontological schema knowledge-এর মতো role play করে:

- facts-এর ওপর general patterns express করে
- new facts infer করতে support করে
- যতটা সম্ভব true হওয়া উচিত
- একইসাথে enough data cover করা উচিত, যাতে rule general থাকে

Tension:

- বেশি conditions দিলে rule specific হয়
- কিন্তু অনেক বেশি conditions দিলে generality কমে যায় এবং search cost বাড়ে

---

# 5. “Interesting” Horn rules

Lecture-এ কিছু restrictions দেওয়া হয়েছে যেগুলো দিয়ে বুঝি কোন Horn rules mine করা worth it।

## 5.1 Maximum body length

**Definition।**  
Body length হলো rule body-তে কয়টি atoms আছে।

Body length 2 example:

$$
livesIn(x,y) \land marriedTo(x,z)
$$

Lecturer বলেছেন body length প্রায়ই limit করা হয়:

$$
3
$$

Reason:

- বেশি body atoms মানে higher search space
- বেশি body atoms সাধারণত fewer satisfying instantiations দেয়
- ফলে rule কম general হয়

---

## 5.2 Connected rules

**Definition।**  
দুইটি atoms connected যদি তারা কোনো variable বা constant share করে।

Example:

$$
livesIn(x,y)
$$

and

$$
marriedTo(x,z)
$$

connected, কারণ দুইটিতেই $x$ আছে।

একটি rule connected যদি প্রতিটি atom transitively অন্য সব atoms-এর সাথে connected হয়।

### Bad disconnected example

$$
diedIn(x,y) \Rightarrow wasBornIn(w,z)
$$

এটি bad কারণ body এবং head variables share করে না। Condition $x,y$ নিয়ে, কিন্তু conclusion $w,z$ নিয়ে। Lecturer বলেছেন এমন rules-এর real-world logical meaning ও generality কম।

---

## 5.3 Closed rules

**Definition।**  
একটি variable **closed** যদি rule-এ অন্তত দুইবার appear করে।

একটি rule **closed** যদি তার সব variables closed হয়।

### Bad non-closed example

$$
diedIn(x,y) \Rightarrow \exists z : wasBornIn(x,z)
$$

এখানে $z$ একবার এসেছে। Transcript বলছে, এতে rule instantiation-এর পর unspecified হয়ে যায়: person “somewhere” born হয়েছে, কিন্তু কোথায় তা specified না।

এটি deductive reasoning-এর সময় extra computation-ও তৈরি করে।

[UNCLEAR] Slide example-এ $y$-ও একবার appear করে। Formal definition অনুযায়ী $y$-ও non-closed। Transcript শুধু $z$ নিয়ে আলোচনা করেছে।

---

# 6. Horn rules measurement

Association rules-এর মতো Horn rules-এর quality measure করতেও metrics লাগে।

Lecture covered:

1. support
2. head coverage
3. standard confidence
4. PCA confidence, যা পরে AMIE ব্যবহার করে

---

## 6.1 Support

**ইনটুইশন।**  
Support counts করে knowledge graph-এ full rule instantiations দ্বারা supported distinct head subject-object pairs কয়টি।

**Formal definition।**

Rule:

$$
B \Rightarrow r(x,y)
$$

এর support:

$$
supp(B \Rightarrow r(x,y))
:=
\#(x,y): \exists z_1, \dots, z_m : B \land r(x,y)
$$

যেখানে:

- $z_1, \dots, z_m$ হলো rule-এর variables, $x$ এবং $y$ ছাড়া
- $\#(x,y)$ মানে head relation-এর distinct subject-object pairs count

**Monotonicity।**  
Body-তে বেশি atoms যোগ করলে support কমে বা একই থাকে। Conditions বাড়ালে satisfying instantiations বাড়ে না।

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

Possible instantiations:

1. $x=Adam, y=Paris$

$$
livesIn(Adam, Paris) \Rightarrow wasBornIn(Adam, Paris)
$$

Body and head fact দুইটাই exist করে, তাই supported।

2. $x=Adam, y=Rome$

$$
livesIn(Adam, Rome) \Rightarrow wasBornIn(Adam, Rome)
$$

Body exists, কিন্তু head fact graph-এ নেই।

3. $x=Bob, y=Zurich$

$$
livesIn(Bob, Zurich) \Rightarrow wasBornIn(Bob, Zurich)
$$

Body exists, কিন্তু head fact graph-এ নেই।

তাই supported distinct head pair শুধু 1টি:

$$
supp(R) = 1
$$

[UNCLEAR] Slide/table OCR-এ কোথাও “Pairs” দেখা যায়, কিন্তু example স্পষ্টভাবে `Paris` ব্যবহার করছে।

---

## 6.3 Head coverage

**Head coverage কেন দরকার।**  
Support absolute number, তাই graph size-এর ওপর depend করে। Small graph-এ support 100 বড় হতে পারে, কিন্তু huge graph-এ ছোট হতে পারে। Head coverage support-কে head relation-এর size দিয়ে normalise করে।

**Formal definition।**

$$
hc(B \Rightarrow r(x,y))
:=
\frac{supp(B \Rightarrow r(x,y))}{size(r)}
$$

where:

$$
size(r) := \#(x',y') : r(x',y')
$$

অর্থাৎ $size(r)$ হলো knowledge graph-এ relation $r$-এর subject-object pairs-এর সংখ্যা।

### Worked example: head coverage

For:

$$
R: livesIn(x,y) \Rightarrow wasBornIn(x,y)
$$

আগে পেয়েছি:

$$
supp(R) = 1
$$

Head relation:

$$
wasBornIn
$$

Graph-এ দুইটি `wasBornIn` fact আছে:

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

**ইনটুইশন।**  
Standard confidence জিজ্ঞেস করে:

> সব body instantiations-এর মধ্যে কতগুলো এমন head fact তৈরি করে যা knowledge graph-এ true?

**Formal definition।**

$$
conf(B \Rightarrow r(x,y))
:=
\frac{supp(B \Rightarrow r(x,y))}
{\#(x,y): \exists z_1, \dots, z_m : B}
$$

Denominator counts করে সব distinct $(x,y)$ pairs, যেগুলোর জন্য body true।

---

## 6.5 Closed World Assumption / CWA

Standard confidence **Closed World Assumption** ব্যবহার করে।

**Lecture definition।**

- Knowledge graph-এ exist করে, বা infer করা যায় — এমন facts true।
- Knowledge graph-এ নেই এবং infer করা যায় না — এমন facts false।

অর্থাৎ CWA-তে missing মানে false।

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

Head exists, তাই true।

2.

$$
livesIn(Adam, Rome) \Rightarrow wasBornIn(Adam, Rome)
$$

Head missing, তাই CWA অনুযায়ী false।

3.

$$
livesIn(Bob, Zurich) \Rightarrow wasBornIn(Bob, Zurich)
$$

Head missing, তাই CWA অনুযায়ী false।

Total 3 body instantiations। True head শুধু 1টি।

Therefore:

$$
conf(R) = \frac{1}{3}
$$

---

# 7. AMIE

## 7.1 AMIE কী

AMIE stands for:

> **Association Rule Mining under Incomplete Evidence**

Original version 2013-এ published। Transcript বলছে AMIE+ এবং version 3 যথাক্রমে 2015 ও 2020-এ published।

নামে association rule mining থাকলেও, এখানে AMIE ব্যবহৃত হচ্ছে large-scale knowledge graph থেকে **Horn rules** mine করতে।

AMIE association rule mining-এর কিছু idea নেয়, কিন্তু incomplete knowledge graph-এর জন্য adapt করা।

---

## 7.2 AMIE কেন CWA ব্যবহার করে না

Knowledge graph প্রায়ই incomplete হয়। কোনো fact missing হলে সেটি false না-ও হতে পারে; হয়তো unknown।

তাই AMIE **Closed World Assumption** ব্যবহার করে না।

এর বদলে ব্যবহার করে:

$$
PCA
$$

অর্থাৎ:

> Partial Completeness Assumption

---

## 7.3 Partial Completeness Assumption / PCA

**Definition।**  
Given relation $r$ and subject $x$, যদি knowledge graph-এ অন্তত একটি object $y$ থাকে such that:

$$
\langle x, r, y \rangle
$$

তাহলে AMIE assume করে graph subject-relation pair $(x,r)$-এর সব objects জানে।

অতএব known objects-এর বাইরে অন্য objects false হিসেবে regarded হয়।

Plain words:

> যদি graph কোনো subject এবং relation-এর জন্য অন্তত একটি value জানে, AMIE ধরে নেয় ওই subject-relation-এর object list complete।

কিন্তু যদি ওই subject-relation pair-এর জন্য graph কোনো object-ই না জানে, তখন AMIE missing candidates false ধরে না।

এটি CWA-এর চেয়ে weaker assumption। CWA সব missing facts false ধরে; PCA শুধু কিছু missing facts false ধরে, যখন graph ওই subject-relation pair-এর জন্য complete মনে হয়।

---

## 7.4 PCA confidence

**Formal definition।**

Rule:

$$
B \Rightarrow r(x,y)
$$

এর PCA confidence:

$$
conf_{pca}(B \Rightarrow r(x,y))
:=
\frac{supp(B \Rightarrow r(x,y))}
{\#(x,y): \exists z_1, \dots, z_m, y' : B \land r(x,y')}
$$

Slide বলছে denominator দুইভাবে বুঝতে:

1. $y' = y$
2. $y' \neq y$

Meaning:

- numerator still counts true predictions
- denominator only counts candidate predictions যেখানে subject $x$-এর head relation $r$-এর জন্য কোনো known object $y'$ আছে

---

## 7.5 Worked example: PCA confidence

Same mini knowledge graph:

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

True, কারণ:

$$
wasBornIn(Adam, Paris)
$$

graph-এ আছে।

### Candidate 2

$$
livesIn(Adam, Rome) \Rightarrow wasBornIn(Adam, Rome)
$$

PCA অনুযায়ী false, কারণ graph already contains:

$$
wasBornIn(Adam, Paris)
$$

So subject-relation pair:

$$
(Adam, wasBornIn)
$$

এর জন্য PCA assumes known object list complete। তাই Adam-এর অন্য birthplace object, যেমন Rome, false হিসেবে ধরা হয়।

### Candidate 3

$$
livesIn(Bob, Zurich) \Rightarrow wasBornIn(Bob, Zurich)
$$

এটি PCA denominator-এ count করা হয় না।

Reason: graph-এ এমন কোনো fact নেই:

$$
wasBornIn(Bob, y')
$$

তাই AMIE Bob-এর birthplace information complete ধরে না। ফলে `wasBornIn(Bob, Zurich)` false হিসেবে treat করে না।

Thus:

- true predictions = 1
- PCA-counted predictions = 2

So:

$$
conf_{pca}(R) = \frac{1}{2}
$$

Compare with standard confidence:

$$
conf(R) = \frac{1}{3}
$$

---

# 8. AMIE algorithm

## 8.1 Inputs

AMIE algorithm takes:

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

Meaning: কোনো rule relation-এর subject-object pairs-এর 1% বা তার কম cover করলে সেটি considered হয় না।

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

Slide video-র error correct করে: intended meaning হলো rule interesting নয় যদি 10টি predictions-এর মধ্যে 1টির কম **true** হয়। Transcript-এ “negative” বলা হয়েছিল, কিন্তু slide explicitly এটিকে video error হিসেবে mark করেছে।

---

## 8.2 High-level AMIE process

AMIE maintains:

- একটি queue of rules
- একটি set of output/qualified rules

Initial queue:

$$
q = [r_1(x,y), r_2(x,y), \dots, r_m(x,y)]
$$

প্রতিটি initial rule শুধু একটি possible head relation।

Output set:

$$
out = \emptyset
$$

---

## 8.3 Algorithm 1: Rule mining

Slide pseudocode বাংলায়:

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

1. সব possible head relations দিয়ে শুরু।
2. Queue থেকে একটি rule নেওয়া।
3. সেটি output হওয়া উচিত কিনা check করা।
4. Body too long না হলে, একটি নতুন atom add করে refine করা।
5. Refined rules-এর মধ্যে head coverage enough হলে রাখা।
6. Duplicate avoid করা।
7. Queue empty না হওয়া পর্যন্ত continue করা।

---

## 8.4 Algorithm 2: AcceptedForOutput

Rule output হবে কিনা decide করার logic:

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

So একটি rule accepted হতে হলে:

1. **closed** হতে হবে
2. PCA confidence অন্তত `minConf` হতে হবে
3. parent rules-এর চেয়ে PCA confidence বেশি হতে হবে

Reason: parent rule-এর body atoms কম এবং confidence বেশি হলে parent rule বেশি interesting, কারণ সেটি বেশি general এবং বেশি accurate।

---

## 8.5 Refinement operations

Refinement মানে rule extend করা by adding one more body atom।

Lecture তিনটি refinement operation দিয়েছে।

### 1. Add Dangling Atom

New atom uses:

- one fresh variable
- one variable shared with an existing atom

Example structure:

$$
B \Rightarrow r(x,y)
$$

এটি refine হতে পারে এমন atom add করে যেখানে $x$ এবং new variable $z$ আছে।

### 2. Add Instantiated Atom

New atom uses:

- one entity constant
- one variable shared with an existing atom

এটি computationally expensive, কারণ algorithm-কে relations এবং entities-এর combinations consider করতে হতে পারে।

### 3. Add Closing Atom

New atom uses:

- variables already shared with other atoms

এটি closed rules তৈরি করতে help করে, যেখানে সব variables অন্তত দুইবার appear করে।

যদি rule $R_1$ refinement-এর পর rule $R_2$ তৈরি করে, তাহলে:

$$
R_1
$$

is a **parent rule** of:

$$
R_2
$$

---

## 8.6 Search-space reduction in AMIE

AMIE search space কমাতে কয়েকটি strategy ব্যবহার করে।

### Strategy 1: minimum head coverage

Only enqueue new rules if:

$$
hc(r_c) \geq minHC
$$

এটি গুরুত্বপূর্ণ কারণ monotonicity:

> Body-তে বেশি atoms যোগ করলে head coverage কমে।

তাই কোনো rule-এর head coverage already too low হলে, তার refinements explore করার দরকার নেই।

### Strategy 2: maximum body length

Rules refine করা হয় না once:

$$
length(r) \geq maxLen
$$

Usually:

$$
maxLen = 2 \text{ or } 3
$$

এটি rule-search space explosion prevent করে।

### Strategy 3: minimum PCA confidence

Rules output হয় only if:

$$
conf_{pca}(r) \geq minConf
$$

Default:

$$
minConf = 0.1
$$

### Strategy 4: parent-rule comparison

Child rule accept করা হয় না যদি parent rule-এর PCA confidence equal বা higher হয়।

Reason: parent-এর body atoms কম, তাই parent বেশি general।

### Strategy 5: duplicate checking

Generated rule already queue-তে আছে কিনা algorithm check করে।

### Strategy 6: SPARQL-based implementation

Implementation graph database access এবং SPARQL counting queries-এর ওপর depend করে।

Lecturer example idea দিয়েছেন: refinement-এর সময় blindly সব possible relation try না করে, AMIE প্রথমে এমন relations খোঁজে যেগুলো head-coverage threshold pass করতে পারে।

SPARQL এই lecture-এ introduce করা হয়নি; lecturer বলেছেন এটি অন্য unit যেমন Data Engineering Technologies / COMP63502-তে covered হবে।

---

## 8.7 Complexity and optimisation

সবচেয়ে complex refinement operation হলো:

> Add Instantiated Atom

Reason:

- new atom একটি shared variable এবং একটি constant/entity ব্যবহার করে
- algorithm-কে relations এবং entities-এর combinations consider করতে হতে পারে
- real-world knowledge graph-এ entities-এর সংখ্যা খুব বড়

Optimisation methods mentioned:

- minimum head coverage
- maximum body length
- minimum PCA confidence
- duplicate checking
- multi-threading
- more scalable refinement strategies
- AMIE+ এবং AMIE 3-এ আরও details আছে

Lecturer বলেছেন optimisation concrete knowledge graph এবং mined rules-এর ওপর depend করে।

---

# 9. Markov Logic Networks / MLN

Uploaded material-এ শুধু brief introduction/summary আছে।

**Video 6 থেকে key idea।**  
Markov Logic Network first-order logic-এ expressed formulas ব্যবহার করে instances থেকে Markov networks instantiate করা guide করে।

**Week-এর সাথে connection।**  
এই সপ্তাহের প্রথম দুই অংশ knowledge graph থেকে logical knowledge mine করে:

- SSI mines OWL 2 schema axioms।
- AMIE mines Horn rules।

MLN এরপর relational machine-learning technique হিসেবে introduced হয়, যা combine করে:

- first-order logic
- Markov networks
- uncertain reasoning

[UNCLEAR / missing source] Detailed MLN lecture segment uploaded transcripts/slides-এ নেই, তাই MLN details reconstruct করা যায় না।

---

# 10. Key concept glossary

## Statistical Schema Induction / SSI

RDF triples থেকে OWL 2 schema axioms শেখার method। এটি graph facts-কে transaction tables-এ convert করে association rule mining apply করে।

## RDF triple

Subject-predicate-object form-এ একটি fact। Lecture-এ SSI-এর factual input হিসেবে RDF triples ব্যবহৃত হয়েছে।

## OWL 2 schema axiom

Classes বা relations সম্পর্কে logical statement, যেমন:

$$
Airport \sqsubseteq Building
$$

বা:

$$
Country \sqsubseteq \exists hasLanguage.Language
$$

## Association rule

এই form-এর rule:

$$
X \Rightarrow Y
$$

যেখানে $X$ antecedent এবং $Y$ consequent।

## Support

Association rules-এর ক্ষেত্রে support counts করে itemset কয়টি transactions-এ আছে।

Horn rules-এর ক্ষেত্রে support counts করে rule instantiations দ্বারা supported distinct head subject-object pairs কয়টি।

## Confidence

Association rules-এর জন্য:

$$
Confidence(X \Rightarrow Y)
=
\frac{Support(X \cup Y)}{Support(X)}
$$

Horn rules under CWA:

$$
conf(B \Rightarrow r(x,y))
=
\frac{supp(B \Rightarrow r(x,y))}
{\#(x,y): \exists z_1,\dots,z_m:B}
$$

## Horn rule

Body conditions এবং head conclusion সহ logical implication:

$$
B_1,\dots,B_n \Rightarrow r(x,y)
$$

## Grounding / instantiation

Rule-এর variables-কে concrete entities/constants দিয়ে replace করা।

## Connected rule

যে rule-এর atoms shared variables বা constants দ্বারা connected।

## Closed rule

যে rule-এ প্রতিটি variable অন্তত দুইবার appear করে।

## Head coverage

Normalised support measure:

$$
hc(B \Rightarrow r(x,y))
=
\frac{supp(B \Rightarrow r(x,y))}{size(r)}
$$

## Closed World Assumption / CWA

Missing facts false ধরে নেওয়ার assumption।

## Partial Completeness Assumption / PCA

AMIE-এর assumption: subject-relation pair-এর জন্য যদি একটি object known থাকে, তাহলে সব objects known ধরে নেওয়া হয়; অন্য objects false। কিন্তু কোনো object known না থাকলে missing fact false ধরে না।

## PCA confidence

AMIE’s confidence measure under PCA:

$$
conf_{pca}(B \Rightarrow r(x,y))
=
\frac{supp(B \Rightarrow r(x,y))}
{\#(x,y): \exists z_1,\dots,z_m,y': B \land r(x,y')}
$$

## AMIE

Association Rule Mining under Incomplete Evidence। Large-scale knowledge graphs থেকে Horn rules mine করার algorithm, যা PCA confidence এবং search-space reduction strategies ব্যবহার করে।

---

# 11. Exam flags and high-value revision points

## Explicit exam-style flag from slides

**Transaction table construction cases examples দিয়ে demonstrate করতে পারতে হবে।**

এটি transaction table construction slide-এ আছে। বিশেষ করে important:

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

- role inclusion এবং role-composition-style tables

বিশেষ করে জানতে হবে column যেমন:

$$
\exists r_1.C_{11}
$$

কখন value 1 পাবে:

$$
\langle a,r_1,b\rangle
\quad \text{and} \quad
\langle b,rdf:type,C_{11}\rangle
$$

দুইটিই exist করতে হবে।

---

## Revision-critical formulas

এগুলো সব explicit “exam” হিসেবে label করা হয়নি, কিন্তু slides-এর central formula:

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

- **Association rule mining** database বা data science unit-এর assumed background।
- **SPARQL queries and graph databases** terminology acquisition, transaction table construction, এবং AMIE implementation-এর জন্য ব্যবহৃত হয়, কিন্তু এই lecture-এ শেখানো হয়নি।
- Lecturer বলেছেন এটি অন্য unit, specifically Data Engineering Technologies / COMP63502-তে covered হবে।
- **Horn rules and ontological schema** connected, কারণ দুটোই knowledge graph-এর reusable logical structure describe করে।
- **Markov Logic Networks** first-order logic এবং Markov networks connect করে uncertain reasoning-এর জন্য।

---

# 13. Unclear / transcript-garbled sections to revisit

- [UNCLEAR] “Advanced Topics and Motor Plantation and Reading” = course title **Advanced Topics in Knowledge Representation and Reasoning**।
- [UNCLEAR] “Home Rule,” “Honolulu,” “Hong Kong,” “Honjo” = **Horn rule**।
- [UNCLEAR] “Amy,” “Emmy,” “email,” “image” = **AMIE**।
- [UNCLEAR] “I2” / “Oita” = likely **OWL 2**।
- [UNCLEAR] “extension restriction” = **existential restriction**।
- [UNCLEAR] “row composition” = likely **role composition**।
- [UNCLEAR] “Java, our API or Portage” = likely Java OWL API or Protégé, কিন্তু slides confirm করে না।
- [UNCLEAR] Mini knowledge graph table কখনও “Pairs” দেখায়, কিন্তু example uses **Paris**।
- [UNCLEAR] Transaction-table construction slide-এর exact role-composition row OCR থেকে clear নয়; exam-এর জন্য slide 8 visually revisit করা ভালো।
- [UNCLEAR] MLN detail missing, কারণ detailed MLN transcript uploaded set-এ নেই।
