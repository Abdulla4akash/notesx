---
subject: COMP64401
chapter: 3
title: "Datalog"
language: bn
---

# COMP64401 মডিউল ৪: Logic Programming, Rules and Datalog

**গঠিত স্টাডি নোট**  
আপলোড করা লেকচার ট্রান্সক্রিপ্ট এবং Week 7+8 স্লাইড ডেক থেকে প্রস্তুত।

**ব্যবহৃত উৎস ফাইল:**

- `4.1DataLogIntro-English.txt`
- `4.3DatalogReasoning-English.txt`
- `4.4DatalogLimitationsExtensions-English.txt`
- `4.5DatalogRelations-English.txt`
- `Week7+8 (2).pdf`

---

## বিষয় ও পরিসর

এই লেকচার ব্লকটি **Datalog**-কে knowledge representation, reasoning, এবং deductive databases-এর জন্য একটি logic-programming language হিসেবে পরিচয় করায়। এতে Datalog-এর syntax ও semantics, Herbrand models, fixed-point reasoning, reasoning tasks, limitations ও extensions, description logic-এর সঙ্গে তুলনা, এবং applications আলোচনা করা হয়েছে।

**কোর্স প্রসঙ্গ:** COMP64401, *Logics for Knowledge Representation and Reasoning*. এই মডিউলটি propositional logic এবং description logic-এর পর আসে, এবং Datalog ব্যবহার করে আরেকটি rule-based, database-oriented logic paradigm দেখায়।

**Notation:** `[UNCLEAR]` দিয়ে চিহ্নিত অংশগুলোতে transcript garbled, technical term ভুল auto-transcribed, slide ও spoken explanation মেলেনি, বা lecturer সম্ভবত typo উল্লেখ করেছেন।

---

# ১. Recap: propositional logic ও description logic-এর পরে Datalog কোথায় বসে

Datalog-এর আগে কোর্সে দুই ধরনের logic কভার করা হয়েছে।

## ১.১ Propositional logic

কোর্সে ইতিমধ্যে কভার করা হয়েছে:

- Syntax: propositional variables এবং formulae.
- Semantics: valuations.
- Reasoning tasks: satisfiability, validity, implication.
- Algorithms: tableau-style reasoning, যেখানে input normalise করা হয় এবং rules ব্যবহার করে একটি set saturate করা হয়।

## ১.২ Description logic

কোর্সে ইতিমধ্যে কভার করা হয়েছে:

- Syntax: classes, axioms, ABoxes, TBoxes, knowledge bases.
- Semantics: interpretations satisfying axioms; entailment.
- Reasoning tasks: entailment testing, instance retrieval, classification.
- Algorithms: consequence-based reasoning, যেখানে আবার input normalise করে rules ব্যবহার করে saturation করা হয়।
- Knowledge representation ও reasoning-এ ব্যবহার।

Lecturer এই recap-কে Datalog-এর সঙ্গে সরাসরি যুক্ত করেন: Datalog-এরও syntax, semantics, reasoning tasks, এবং algorithmic reasoning procedures থাকবে।

---

# ২. Logic programming এবং Datalog: মূল ধারণা

## ২.১ Logic programming

**ধারণা।** Logic programming হলো rule-based logic paradigm. এখানে arbitrary formulae লেখার বদলে আমরা rules লিখি, যেখানে বলা হয় কোন atoms থেকে কোন atoms follow করে।

Lecture অনুযায়ী logic programming ব্যবহৃত হয়:

- knowledge representation and reasoning-এ;
- deductive databases-এ;
- atoms, rules, এবং clauses-ভিত্তিক systems-এ।

উল্লেখিত variants:

- Prolog;
- Answer Set Programming;
- Constraint Logic Programming;
- Datalog.

এই কোর্সে মূল focus Datalog, তবে পরে limitations এবং extensions আলোচনা করা হয়।

## ২.২ চলমান toy example: weather এবং cold legs

Slides-এ একটি Datalog-style program দেওয়া হয়েছে:

```prolog
WeatherC(x) :- Temp(x).
WeatherC(x) :- Preciptn(x).
Temp(x) :- Cold(x).
Cold(x) :- BelowF(x).
Preciptn(x) :- Rain(x).
Preciptn(x) :- Snow(x).
Slippery(x) :- Rain(x), BelowF(x).

ColdLegs(x) :- Person(x), wears(x,y), Shorts(y),
               isLocIn(x,z), hasWeather(z,w), Cold(w).

Person(Bijan).
wears(Bijan, S1).
Shorts(S1).
isLocIn(Bijan,M).
hasWeather(M,W).
BelowF(W).
```

Intuitively:

- কোনো কিছু weather condition হলে সেটি temperature বা precipitation হতে পারে;
- below-freezing জিনিস cold;
- rain এবং below-freezing conditions একসাথে থাকলে slippery condition হয়;
- কোনো person-এর cold legs হয় যদি সে shorts পরে, কোনো location-এ থাকে, সেই location-এর weather থাকে, এবং সেই weather cold হয়;
- ground facts বলে Bijan shorts পরে এবং এমন একটি location-এ আছে যার weather below freezing।

Lecturer description logic-এর ABox/TBox analogy দেখান: নিচের অংশে named individuals সম্পর্কে facts, আর ওপরের অংশে general rules. Datalog-এ facts-গুলোকে **ground facts** বা **ground atoms** বলা হয়, ABox assertions নয়।

---

# ৩. Datalog syntax

## ৩.১ Vocabulary: variables, individuals, predicates

### Key concept: terms

**ধারণা।** Terms হলো সেই জিনিসগুলো যা predicates-এর arguments হিসেবে আসতে পারে। এই Datalog version-এ terms হয় variables, নয় named individuals/constants।

**আনুষ্ঠানিক সংজ্ঞা।** ধরা যাক, \(N_V\), \(N_I\), এবং \(N_P\) হলো pairwise disjoint sets of variables, individuals, and predicates. প্রতিটি predicate \(P \in N_P\)-এর একটি arity \(n \in \mathbb{N}\) আছে। Terms-এর set হলো:

\[
N_{VI} := N_V \cup N_I.
\]

Individuals-কে প্রায়ই **constants**-ও বলা হয়।

### Key concept: atom

**ধারণা।** Atom হলো একটি predicate, যার ওপর সঠিক সংখ্যক arguments apply করা হয়েছে।

**আনুষ্ঠানিক সংজ্ঞা।** যদি \(P \in N_P\)-এর arity \(n\) হয়, এবং প্রতিটি \(a_i \in N_{VI}\), তাহলে:

\[
P(a_1,\dots,a_n)
\]

একটি atom।

উদাহরণ:

```prolog
Person(Bijan)
Rain(x)
wears(x,y)
hasWeather(z,w)
```

একই variable একাধিকবার আসতে পারে; syntax এটি নিষিদ্ধ করে না।

## ৩.২ Rules

### Key concept: Datalog rule

**ধারণা।** একটি rule বলে: body-এর সব atoms সত্য হলে, head-এর atom-টিও সত্য হবে।

**আনুষ্ঠানিক সংজ্ঞা।** একটি rule হলো expression:

\[
B \; :- \; A_1,\dots,A_m
\]

যেখানে \(B\) এবং সব \(A_i\) atoms, \(m \ge 0\), এবং **head \(B\)-তে থাকা সব variables অবশ্যই কোনো না কোনো body atom \(A_i\)-তে থাকতে হবে**। একটি Datalog program হলো finite set of rules।

Terminology:

- \(B\) হলো rule-এর **head**।
- \(A_1,\dots,A_m\) হলো rule-এর **body**।
- `:-` পড়া হয় “if” হিসেবে, বা leftward implication হিসেবে: body implies head।

উদাহরণ:

```prolog
Slippery(x) :- Rain(x), BelowF(x).
```

পড়া হয়:

\[
\text{If } Rain(x) \text{ and } BelowF(x), \text{ then } Slippery(x).
\]

Formally:

\[
Rain(x) \land BelowF(x) \Rightarrow Slippery(x).
\]

অথবা equivalently:

\[
Slippery(x) \Leftarrow Rain(x) \land BelowF(x).
\]

## ৩.৩ Facts

### Key concept: ground fact

**ধারণা।** Fact হলো body ছাড়া rule. এটি unconditionally asserted।

উদাহরণ:

```prolog
Person(Bijan).
```

এটি shorthand:

```prolog
Person(Bijan) :-
```

অর্থাৎ body empty. Lecturer এটিকে জোর দিয়ে বলেন, কারণ পরে Herbrand model এবং fixed-point computation-এ এটি গুরুত্বপূর্ণ।

### Ground atom

**Ground atom** হলো এমন atom যেখানে কোনো variables নেই; শুধু individuals/constants আছে।

উদাহরণ:

```prolog
Person(Bijan)
wears(Bijan,S1)
BelowF(W)
```

Non-ground atoms-এ variables থাকে, যেমন:

```prolog
Person(x)
wears(x,y)
```

## ৩.৪ Safety condition: head-এ fresh variables নয়

নিচের rule-টি valid Datalog rule নয়:

```prolog
hasParent(x,y) :- Person(x).
```

কারণ \(y\) head-এ আছে কিন্তু body-তে নেই। এটি এমন একটি unnamed parent \(y\) invent করতে চাইবে, যা plain Datalog অনুমোদন করে না।

এই condition পরে গুরুত্বপূর্ণ: এ কারণেই Datalog reasoning-কে **active domain**-এ সীমাবদ্ধ রাখা যায়, অর্থাৎ program-এ আগে থেকেই থাকা named individuals।

## ৩.৫ Rules as Horn clauses

Datalog rules-কে Horn clauses হিসেবে বোঝা যায়।

উদাহরণ:

```prolog
Slippery(x) :- Rain(x), BelowF(x).
```

এটি abbreviates:

\[
Slippery(x) \Leftarrow Rain(x) \land BelowF(x).
\]

Implication-as-disjunction ব্যবহার করলে:

\[
\varphi \Leftarrow \psi
\quad\text{means}\quad
\varphi \lor \neg \psi.
\]

তাই:

\[
Slippery(x) \lor \neg(Rain(x) \land BelowF(x)).
\]

De Morgan’s laws দিয়ে:

\[
Slippery(x) \lor \neg Rain(x) \lor \neg BelowF(x).
\]

এখানে exactly one positive literal আছে: \(Slippery(x)\). At most one positive literal-সহ clauses-কে **Horn clauses** বলা হয়।

**মূল intuition।** Datalog rules হলো একটি restricted logical form, Horn clauses-এর computationally convenient version. এই Horn restriction-ই bounded-arity condition-এর অধীনে Datalog reasoning tractable হওয়ার বড় কারণ।

---

# ৪. Datalog semantics

Lecture-এ Datalog-এর তিনটি equivalent semantics আলোচনা করা হয়:

1. model-theoretic semantics;
2. minimal-model-theoretic semantics;
3. fixed-point semantics.

Slides অনুযায়ী এগুলো equivalent. Lecture এগুলো এই ক্রমে গড়ে তোলে: model-theoretic semantics meaning দেয়, minimal-model semantics একটি canonical model দেয়, এবং fixed-point semantics algorithm দেয়।

## ৪.১ Model-theoretic semantics

### Key concept: interpretation

**ধারণা।** Interpretation predicates এবং individuals-কে meaning দেয়।

**আনুষ্ঠানিক সংজ্ঞা।** Datalog program \(P\)-এর জন্য একটি interpretation হলো:

\[
\mathcal{I} = (\Delta^\mathcal{I}, \cdot^\mathcal{I})
\]

যেখানে:

- \(\Delta^\mathcal{I}\) একটি non-empty interpretation domain;
- arity \(n\)-এর প্রতিটি predicate \(A\)-কে একটি \(n\)-ary relation-এ map করা হয়:

\[
A^\mathcal{I} \subseteq (\Delta^\mathcal{I})^n;
\]

- প্রতিটি individual \(b\)-কে একটি element-এ map করা হয়:

\[
b^\mathcal{I} \in \Delta^\mathcal{I}.
\]

Description logic semantics থেকে প্রধান পার্থক্য হলো Datalog-এ explicit variables আছে, তাই semantics-এ substitutions-ও দরকার।

### Key concept: substitution

**ধারণা।** Substitution variables-কে domain elements assign করে।

**আনুষ্ঠানিক সংজ্ঞা।**

\[
\sigma : N_V \to \Delta^\mathcal{I}.
\]

Term \(d\)-এর value interpretation \(\mathcal{I}\) এবং substitution \(\sigma\)-এর অধীনে:

\[
d^{\mathcal{I},\sigma}
=
\begin{cases}
\sigma(d), & \text{if } d \in N_V,\\
d^\mathcal{I}, & \text{if } d \in N_I.
\end{cases}
\]

অতএব variables interpret হয় \(\sigma\) দিয়ে, আর individuals/constants interpret হয় \(\mathcal{I}\) দিয়ে।

### Satisfaction of atoms

Atom:

\[
P(d_1,\dots,d_n),
\]

\(\mathcal{I},\sigma\) atom-টিকে satisfy করে যদি interpreted tuple predicate relation-এ থাকে:

\[
(d_1^{\mathcal{I},\sigma},\dots,d_n^{\mathcal{I},\sigma})
\in P^\mathcal{I}.
\]

[UNCLEAR/OCR] Slide parse-এ এই লাইনে subset symbol দেখা যায়, কিন্তু transcript বলছে tuple “belongs to” predicate interpretation; তাই intended symbol হলো membership \(\in\)।

### Satisfaction of rules

Rule:

\[
H :- A_1,\dots,A_m,
\]

\(\mathcal{I},\sigma\) rule-টিকে satisfy করে যদি:

\[
\text{if } \mathcal{I},\sigma \models A_i \text{ for every } i,
\text{ then } \mathcal{I},\sigma \models H.
\]

কথায়: body true হলে head true হতে হবে।

### Satisfaction of programs

\(\mathcal{I},\sigma\) program \(P\)-কে satisfy করে যদি এটি \(P\)-এর প্রতিটি rule satisfy করে।

### Entailment

Datalog program \(P\) atom \(\alpha\)-কে entail করে, লিখি:

\[
P \models \alpha,
\]

যদি প্রতিটি interpretation \(\mathcal{I}\) এবং প্রতিটি substitution \(\sigma\)-এর জন্য, \(\mathcal{I},\sigma\) যখনই \(P\) satisfy করে, তখন সেটি \(\alpha\)-ও satisfy করে।

### Universal quantification of variables

Rules-এর variables universally quantified. উদাহরণ:

```prolog
Slippery(x) :- Rain(x), BelowF(x).
```

corresponds to:

\[
\forall x\,
\bigl(
Rain(x) \land BelowF(x) \Rightarrow Slippery(x)
\bigr).
\]

Equivalently, Horn clause হিসেবে:

\[
\forall x\,
\bigl(
Slippery(x) \lor \neg Rain(x) \lor \neg BelowF(x)
\bigr).
\]

Lecturer existential reading-এর সঙ্গে contrast করেন: rule-টি সব \(x\)-এর জন্য true, কোনো এক \(x\)-এর জন্য নয়।

---

# ৫. Herbrand base এবং Herbrand model

Model-theoretic definition সব interpretations এবং substitutions-এর ওপর quantify করে, যা algorithm হিসেবে সরাসরি ব্যবহারযোগ্য নয়, কারণ infinitely many interpretations আছে। Lecture all models search এড়াতে Herbrand-style semantics আনে।

## ৫.১ Herbrand base

### Key concept: Herbrand base

**ধারণা।** Herbrand base হলো program-এ থাকা predicates এবং named individuals ব্যবহার করে তৈরি করা যায় এমন সব possible ground atoms-এর set।

**আনুষ্ঠানিক সংজ্ঞা।** Datalog program \(P\)-এর জন্য:

\[
HB(P)
:=
\{A(b_1,\dots,b_n)
\mid
b_i \in N_I,\;
A \in N_P \text{ occurs in } P,\;
A \text{ has arity } n
\}.
\]

তাই \(HB(P)\)-তে কোনো variables নেই। এটি program-এর predicates ও individuals দিয়ে তৈরি সব possible ground combinations।

### Example

যদি \(P\)-তে individuals \(B\) এবং \(U\), এবং `Person`, `Slippery`, `Rain`, ও `wears`-এর মতো predicates থাকে, তাহলে Herbrand base-এ থাকবে:

```prolog
Person(B)
Person(U)
Slippery(B)
Slippery(U)
Rain(B)
Rain(U)
wears(B,B)
wears(B,U)
wears(U,B)
wears(U,U)
...
```

Lecturer জোর দেন যে Herbrand base নিজে entailed facts-এর set নয়। এটি শুধু candidate ground atoms-এর set।

## ৫.২ Herbrand model

### Key concept: Herbrand model

**ধারণা।** Herbrand model হলো Herbrand base-এর সবচেয়ে ছোট subset যা সব facts ধারণ করে এবং program-এর rules-এর অধীনে closed।

**আনুষ্ঠানিক সংজ্ঞা।**

\[
HM(P)
:=
\min_{\subseteq}
\left\{
X \subseteq HB(P)
\;\middle|\;
\begin{array}{l}
\text{if } H :- A_1,\dots,A_n \in P\\
\text{and all } \sigma(A_i) \in X,\\
\text{then } \sigma(H) \in X
\end{array}
\right\}.
\]

এখানে \(\sigma\) variables-কে program-এর individuals-এ map করে। Condition বলে: grounded body atoms যদি ইতিমধ্যে \(X\)-এ থাকে, তাহলে grounded head-ও \(X\)-এ থাকতে হবে। Minimality condition বলে \(X\)-এ unnecessary কিছু থাকবে না।

### Core theorem: entailment via the Herbrand model

Datalog program \(P\) এবং ground atom \(\alpha\)-এর জন্য:

\[
P \models \alpha
\quad\text{iff}\quad
\alpha \in HM(P).
\]

এটি lecture-এর অন্যতম প্রধান result. এর অর্থ, all models check করার বদলে একটি single canonical model inspect করলেই চলে।

### Active domain

Herbrand model শুধু program-এ named individuals নিয়েই কথা বলে। এটিকে **active domain** বলা হয়।

এটি description logic থেকে বড় পার্থক্য: description logic-এ আমরা anonymous individuals নিয়ে কথা বলতে পারি, যেমন “every person has a parent.” Plain Datalog-এ আমরা এভাবে unnamed individuals introduce করতে পারি না।

## ৫.৩ Herbrand base/model-এর size ও complexity

### Lemma

ধরা যাক \(P\) একটি Datalog program যার maximum predicate arity fixed। তাহলে:

1. \(HB(P)\) finite এবং \(P\)-এর size-এর polynomial;
2. \(HM(P)\) finite এবং \(P\)-এর size-এর polynomial।

### Lecture-এর proof sketch

ধরা যাক:

- \(n\) হলো \(P\)-এর predicates-এর maximum arity;
- \(p\) হলো \(P\)-এর predicates-এর সংখ্যা;
- \(m\) হলো \(P\)-এর individuals-এর সংখ্যা।

তাহলে \(P\)-এর ওপর সর্বোচ্চ:

\[
p \cdot m^n
\]

ground atoms থাকতে পারে। যেহেতু \(HM(P) \subseteq HB(P)\), Herbrand model-ও finite এবং polynomial in \(P\), **provided that \(n\) fixed**।

### Exam flag

Lecturer explicitly বলেন bounded predicate arity critical. Arity unbounded হলে \(n\) input-এর সঙ্গে grow করতে পারে, এবং \(p \cdot m^n\) exponential হয়ে যেতে পারে।

---

# ৬. Worked example: Herbrand model compute করা

Slides-এ weather, clothes, এবং cold legs নিয়ে একটি program দেওয়া হয়:

```prolog
WeatherC(x) :- Temp(x).
Temp(x) :- Cold(x).
Cold(x) :- BelowF(x).
IoC(x) :- Shorts(x).
Person(x) :- wears(x,y), IoC(y).

ColdLegs(x) :- Person(x), wears(x,y), Shorts(y),
               isLocIn(x,z), hasWeather(z,w), Cold(w).

wears(B,S).
Shorts(S).
isLocIn(B,M).
hasWeather(M,W).
BelowF(W).
```

Herbrand base-এ individuals \(B,S,M,W\) এবং program-এর predicates দিয়ে তৈরি সব possible ground atoms থাকে। উদাহরণ:

```prolog
WeatherC(B), WeatherC(S), WeatherC(M), WeatherC(W),
Temp(B), Temp(S), Temp(M), Temp(W),
Cold(B), Cold(S), Cold(M), Cold(W),
wears(B,B), wears(B,M), wears(B,S), wears(B,W),
...
```

Slides-এ Herbrand model হিসেবে listed:

```prolog
wears(B,S)
Shorts(S)
isLocIn(B,M)
hasWeather(M,W)
BelowF(W)
IoC(S)
Person(B)
Cold(W)
ColdLegs(B)
```

Derivation steps shown বা implied:

1. Ground facts সরাসরি included:

   ```prolog
   wears(B,S)
   Shorts(S)
   isLocIn(B,M)
   hasWeather(M,W)
   BelowF(W)
   ```

2. From:

   ```prolog
   IoC(x) :- Shorts(x)
   Shorts(S)
   ```

   infer:

   ```prolog
   IoC(S)
   ```

3. From:

   ```prolog
   Person(x) :- wears(x,y), IoC(y)
   wears(B,S)
   IoC(S)
   ```

   infer:

   ```prolog
   Person(B)
   ```

4. From:

   ```prolog
   Cold(x) :- BelowF(x)
   BelowF(W)
   ```

   infer:

   ```prolog
   Cold(W)
   ```

5. From:

   ```prolog
   ColdLegs(x) :- Person(x), wears(x,y), Shorts(y),
                  isLocIn(x,z), hasWeather(z,w), Cold(w)
   ```

   substitution ব্যবহার করে:

   \[
   x \mapsto B,\quad y \mapsto S,\quad z \mapsto M,\quad w \mapsto W,
   \]

   এবং known facts:

   ```prolog
   Person(B)
   wears(B,S)
   Shorts(S)
   isLocIn(B,M)
   hasWeather(M,W)
   Cold(W)
   ```

   infer:

   ```prolog
   ColdLegs(B)
   ```

তাই lecture concludes, উদাহরণস্বরূপ:

\[
P \models Person(B)
\]

এবং:

\[
P \models ColdLegs(B).
\]

[UNCLEAR] Displayed program-এ `Temp(x) :- Cold(x)` এবং `WeatherC(x) :- Temp(x)` আছে, তাই `Cold(W)` থেকে `Temp(W)` এবং তারপর `WeatherC(W)` আশা করা যায়। কিন্তু slide/transcript Herbrand model list `Cold(W)` এবং `ColdLegs(B)`-এ থেমে যায়। Recording বা slides check করা দরকার।

---

# ৭. Fixed-point semantics এবং reasoning algorithm

আগের section \(HM(P)\) define করে, কিন্তু efficient computation method দেয় না। Lecture “guess a subset \(X \subseteq HB(P)\) and check minimality” পদ্ধতিকে bad বলে বাদ দেয়, তারপর iterative fixed-point method আনে।

## ৭.১ Immediate consequence operator

### Key concept: immediate consequence operator

**ধারণা।** Current known ground atoms-এর set \(X\) দেওয়া হলে immediate consequence operator এক rule application-এ derive করা যায় এমন সব rule heads যোগ করে।

**আনুষ্ঠানিক সংজ্ঞা।** Datalog program \(P\)-এর জন্য:

\[
ICO_P(X)
:=
X
\cup
\{
\sigma(H) \in HB(P)
\mid
H :- A_1,\dots,A_n \in P
\text{ and all }
\sigma(A_i) \in X
\}.
\]

অতএব \(ICO_P(X)\)-তে \(X\)-এর সবকিছু থাকে, plus সেই rules-এর immediate consequences, যাদের grounded bodies ইতিমধ্যে \(X\)-এ আছে।

### Operator-এর monotonicity

\[
X \subseteq ICO_P(X).
\]

Operator শুধু atoms যোগ করে; কখনও remove করে না।

### Kleene fixed-point theorem

Lecture Kleene’s fixed-point theorem ব্যবহার করে: sets-এর ওপর monotone operator-এর least fixed point exists এবং iterativeভাবে compute করা যায়:

\[
\bigcup_i ICO_P^i(\emptyset).
\]

এই least fixed point সাধারণত denote করা হয়:

\[
ICO_P^*(\emptyset).
\]

এটি finite এবং polynomial in size, কারণ:

\[
ICO_P^*(\emptyset) \subseteq HB(P),
\]

এবং \(HB(P)\) polynomial যখন predicate arity bounded।

## ৭.২ Datalog-এর fixed-point theorem

### Theorem

\[
HM(P) = ICO_P^*(\emptyset).
\]

এটি Herbrand model compute করার algorithmic উপায় দেয়।

### Corollary

Datalog program \(P\) এবং ground atom \(\alpha\)-এর জন্য:

\[
P \models \alpha
\quad\text{iff}\quad
\alpha \in ICO_P^*(\emptyset).
\]

তাই সব ground atomic entailments iterative rule application দিয়ে compute করা যায়।

## ৭.৩ সব ground atomic entailments compute করার naive algorithm

Input: Datalog program \(P\)।  
Output: \(HM(P)\)।

Lecture algorithm-এর পরিষ্কার version:

```text
X := ∅
I := set of individuals in P

repeat
    X' := X

    for each rule H :- A1, ..., An in P do
        V := variables occurring in the rule

        for each substitution σ : V → I do
            if σ(Ai) ∈ X for every i = 1,...,n then
                add σ(H) to X'

    if X' = X then
        return X

    X := X'
```

গুরুত্বপূর্ণ points:

- \(X\) হলো currently derived ground atoms-এর set।
- \(X'\) হলো next stage।
- প্রতিটি iteration সব rules এবং সব substitutions check করে।
- Fixed point reached হয় যখন \(X' = X\), অর্থাৎ নতুন atom যোগ হয়নি।

## ৭.৪ Optimisations

Lecture দুটি immediate optimisations দেয়।

### Optimisation 1: facts দিয়ে শুরু করা

Lemma:

\[
ICO_P(\emptyset)
\]

হলো \(P\)-এর সব facts-এর set।

তাই \(X := \emptyset\) দিয়ে শুরু না করে শুরু করা যায়:

\[
X := \{\text{facts in } P\}.
\]

এতে empty-body rules দিয়ে সব facts rediscover করতে হয় না।

### Optimisation 2: focused search for substitutions

Blindly প্রতিটি substitution \(\sigma : V \to I\) try না করে শুধু সেই substitutions focus করা যায় যাদের succeed করার chance আছে: অর্থাৎ যাদের grounded body atoms ইতিমধ্যে \(X\)-এ আছে।

Lecturer আরও বলেন rule ordering এবং body-literal ordering সাহায্য করতে পারে। উদাহরণ: যদি কোনো `BelowF(...)`-matching atom derive না হয়ে থাকে, তাহলে body-তে `BelowF` প্রয়োজন এমন rules consider করার point নেই।

### Exam flag

Naive fixed-point method conceptually important, কিন্তু practical Datalog reasoners optimisations ছাড়া চলে না। Lecturer explicitly বলেন, একটি query answer করতে পুরো Herbrand model compute করা wasteful হতে পারে।

---

# ৮. Datalog reasoning tasks

Lecture কয়েক ধরনের reasoning task আলাদা করে।

## ৮.১ সব ground atomic entailments compute করা

Task:

Given \(P\), সব ground atoms \(\alpha\) compute করা যাতে:

\[
P \models \alpha.
\]

Solution:

Compute:

\[
HM(P)
\]

বা equivalently:

\[
ICO_P^*(\emptyset).
\]

Resulting Herbrand model-এর প্রতিটি atom একটি ground atomic entailment।

## ৮.২ একটি specific ground entailment test করা

Task:

Given \(P\) এবং ground atom \(\alpha\), decide whether:

\[
P \models \alpha.
\]

Naive solution:

1. \(HM(P)\) compute করা।
2. Check করা:

\[
\alpha \in HM(P).
\]

Lecturer বলেন এটি অনেক সময় wasteful, কারণ একটি yes/no question answer করতে সব entailments compute করে। Goal-directed reasoner \(\alpha\) থেকে backwards reason করতে পারে।

## ৮.৩ Conjunctive queries answer করা

### Key concept: conjunctive query

**ধারণা।** Conjunctive query সব tuples of individuals খোঁজে যেগুলো একাধিক atoms simultaneously true করে।

Query form:

\[
q(\vec{x}) :- A_1,\dots,A_n.
\]

Goal হলো সব tuples \(\vec{a}\) return করা যাতে প্রতিটি query atom \(\vec{a}\) substitute করার পর entailed হয়।

### Formal task

সব tuples \(\vec{a}\) return করা যাতে:

\[
P \models A_1[\vec{x}/\vec{a}],\dots,
P \models A_n[\vec{x}/\vec{a}].
\]

এখানে \(A_i[\vec{x}/\vec{a}]\) হলো ground atom, যেখানে প্রতিটি query variable \(x_j\)-কে corresponding individual \(a_j\) দিয়ে replace করা হয়েছে।

### Naive solution

1. \(HM(P)\) compute করা।
2. \(P\)-এর individuals-এর ওপর প্রতিটি vector \(\vec{a}\)-এর জন্য check করা:

\[
A_i[\vec{x}/\vec{a}] \in HM(P)
\quad\text{for every } i.
\]

3. If yes, output \(\vec{a}\)।

Again, এটি conceptually easy কিন্তু practice-এ optimisations দরকার।

## ৮.৪ Rule entailment

### Key concept: rule entailment

**ধারণা।** Ground atom follows কিনা জিজ্ঞেস করার বদলে জিজ্ঞেস করা হয় একটি পুরো rule program থেকে follows কিনা। এটি conceptual-level reasoning task, description logic-এর subsumption entailment-এর analogue।

Task:

Given Datalog program \(P\) এবং rule:

\[
H :- A_1,\dots,A_n,
\]

decide whether:

\[
P \models H :- A_1,\dots,A_n.
\]

### Formal definition

\(P\) rule \(H :- A_1,\dots,A_n\) entail করে যদি প্রতিটি interpretation \(\mathcal{I}\) এবং substitution/valuation \(\sigma\)-এর জন্য, যখন \(\mathcal{I},\sigma\) \(P\)-এর প্রতিটি rule satisfy করে, তখন সেটি rule \(H :- A_1,\dots,A_n\)-ও satisfy করে।

### Fresh-constant trick

Lecture Herbrand-model computation-এ reduce করার একটি neat trick দেয়।

Fresh constants বেছে নাও:

\[
\vec{c} = c_1,\dots,c_k
\]

rule-এর প্রতিটি variable-এর জন্য একটি, এমনভাবে যাতে কোনো \(c_i\) আগে \(P\)-তে না থাকে।

Grounded body atoms program-এ add করো:

\[
P \cup \{A_1(\vec{c}),\dots,A_n(\vec{c})\}.
\]

তারপর check করো grounded head Herbrand model-এ আছে কিনা:

\[
H(\vec{c})
\in
HM\bigl(P \cup \{A_1(\vec{c}),\dots,A_n(\vec{c})\}\bigr).
\]

Lemma states:

\[
P \models H :- A_1,\dots,A_n
\]

iff:

\[
H(\vec{c})
\in
HM\bigl(P \cup \{A_1(\vec{c}),\dots,A_n(\vec{c})\}\bigr).
\]

এটি lecture-এর প্রথম non-ground entailment task, এবং trick-টি এটিকে আবার ground reasoning-এ reduce করে।

---

# ৯. Datalog কী ভালোভাবে express করতে পারে

Lecturer প্রথমে “non-limitations” আলোচনা করেন: Datalog যেগুলো ভালো express করতে পারে।

## ৯.১ Hierarchies

Datalog সহজে class/property hierarchies express করে।

উদাহরণ:

```prolog
Animal(x) :- Bird(x).
Bird(x) :- Duck(x).
```

Read:

- every bird is an animal;
- every duck is a bird.

[UNCLEAR] Transcript সংক্ষেপে “dog” বলে hierarchy example-এ, কিন্তু slide-এ `Duck(x)` আছে, যা intended hierarchy-এর সঙ্গে মেলে।

## ৯.২ Domain and range of relations

Example statement:

> Ownership happens between a person and an inanimate object.

Datalog rules:

```prolog
Person(x) :- owns(x,y).
InObj(y) :- owns(x,y).
```

তাই `owns(x,y)` hold করলে infer করা হয় যে \(x\) একটি person এবং \(y\) একটি inanimate object।

## ৯.৩ Types in general, including higher-arity predicates

Datalog predicates-এর arity দুইয়ের বেশি হতে পারে, তাই এটি ternary relations-এর types express করতে পারে।

উদাহরণ:

```prolog
Product(x)   :- Sale(x,y,z).
Assistant(y) :- Sale(x,y,z).
Shop(z)      :- Sale(x,y,z).
```

এটি বলে sale relation একটি product, sales assistant, এবং shop-কে connect করে। এটি description logics যেমন \(\mathcal{EL}\)-এর ওপর Datalog-এর advantage, কারণ সেখানে unary এবং binary predicates only।

## ৯.৪ Complex relational structures

Datalog non-tree-shaped relational structures describe করতে পারে।

Example statement:

> Two wheels connected to a frame make a bicycle.

Rule:

```prolog
Bicycle(x) :- hasPart(x,y), hasPart(x,z), hasPart(x,f),
              Wheel(y), Wheel(z), Frame(f),
              connectedTo(y,f), connectedTo(z,f).
```

মূল point হলো variables \(y,z,f\) arbitrary graph-like pattern-এ connect হতে পারে। Slide-এ bicycle sketch আছে যা এই non-tree-shaped relational structure illustrate করে।

## ৯.৫ Implications between predicates/properties

Datalog inverse-like এবং subproperty-like relationships express করতে পারে।

উদাহরণ:

```prolog
isParentOf(x,y) :- hasParent(y,x).
isPartOf(x,y)   :- hasPart(y,x).
hasChild(x,y)   :- hasDaughter(x,y).
```

প্রথমটি বলে `isParentOf` হলো `hasParent`-এর inverse। দ্বিতীয়টি বলে `isPartOf` হলো `hasPart`-এর inverse। তৃতীয়টি বলে having a daughter implies having a child।

[UNCLEAR / lecturer-noted typo] Slide/transcript-এ `hasDaughter`/`hasChild`-এর variable-order issue আছে। Lecturer explicitly বলেন variables swapped হওয়া উচিত নয়: দুটোতেই `x,y` হওয়া উচিত, কোনো একটিতে `y,x` নয়।

## ৯.৬ Recursion

Datalog recursive rules support করে।

Example: `isRelatedTo`-কে `hasParent`-এর transitive symmetric closure হিসেবে define করা।

```prolog
isRelatedTo(x,y) :- hasParent(x,y).
isRelatedTo(x,y) :- isRelatedTo(y,x).
isRelatedTo(x,y) :- isRelatedTo(x,z), isRelatedTo(z,y).
```

Intuition:

1. Parent links relatedness imply করে।
2. Relatedness symmetric।
3. Relatedness transitive।

Lecturer এটিকে powerful feature বলেন: এই তিনটি rules দিয়ে Datalog finite parent-path relatedness in either direction capture করে, bounded arity-এর অধীনে polynomial-time reasoning বজায় রেখেই।

---

# ১০. Plain Datalog-এর limitations

## ১০.১ Anonymous individuals নেই

Plain Datalog unnamed/existential individuals দরকার এমন statements express করতে পারে না।

Express করা যায় না:

> Persons have parents.

Tempting invalid rule:

```prolog
hasParent(x,y) :- Person(x).
```

কিন্তু \(y\) শুধু head-এ আছে, তাই fresh head variable। Datalog এটি forbid করে।

Express করা যায় না:

> Each bicycle has two wheels and a frame.

এটির জন্য something is a bicycle fact থেকে unnamed wheel/frame individuals generate করতে হতো।

Datalog function terms-ও disallow করে, তাই invalid:

```prolog
hasParent(x, motherOf(x)) :- Person(x).
```

Lecturer এই limitation-কে small-model property-এর সঙ্গে connect করেন: Datalog নতুন individuals create করে না, তাই reasoning program-এর named individuals-এর মধ্যেই থাকে।

## ১০.২ Rule heads-এ disjunction নেই

Plain Datalog rule heads একটি single atom ধারণ করে।

Express করা যায় না:

> Students are undergraduate students or postgraduate students.

Invalid form:

```prolog
UGStudent(x) ∨ PGTStudent(x) :- Student(x).
```

এতে disjunctive head লাগত।

## ১০.৩ Negation নেই

Plain Datalog-এ full negation নেই।

এটি express করতে পারে না:

- disjointness, যেমন persons এবং inanimate objects overlap করে না;
- body-তে negation;
- head-এ negation।

Plain Datalog-এ unavailable rule-এর example:

```prolog
UGStudent(x) :- Student(x), not PGTStudent(x).
```

Negation না থাকা disjunction না থাকার সঙ্গে connected: full negation এবং conjunction থাকলে De Morgan dualities দিয়ে disjunction recover করা যায়, তাই negation allow করলে logic fundamentally বদলে যায়।

---

# ১১. Datalog-এর extensions

## ১১.১ Datalog with negation

একটি common extension rule bodies-এ negation allow করে।

Example:

```prolog
UGStudent(x) :- Student(x), not PGTStudent(x).
Student(Bob).
```

Negation-as-failure/default reading-এর অধীনে:

- যদি `Student(Bob)` known হয়;
- এবং `PGTStudent(Bob)` entailed না হয়;
- infer `UGStudent(Bob)`।

এটি non-monotonic: পরে যদি add করি:

```prolog
PGTStudent(Bob).
```

তাহলে Bob undergraduate student—এই আগের conclusion withdraw করতে হয়।

### Key concept: monotonicity

**আনুষ্ঠানিক সংজ্ঞা।** ধরা যাক \(\mathcal{L}\) একটি logic যার entailment relation \(\models\). \(\mathcal{L}\) monotonic যদি সব sets of formulae \(P,P'\) এবং প্রতিটি axiom \(\alpha\)-এর জন্য:

\[
\text{if } P \models \alpha,
\text{ then } P \cup P' \models \alpha.
\]

এই property fail করলে logic non-monotonic।

**ধারণা।** Monotonic logic-এ information যোগ করলে পুরোনো entailments invalidate হয় না। Non-monotonic logic-এ information যোগ করলে conclusions withdraw করতে হতে পারে।

Lecturer non-monotonicity-এর forms mention করেন:

- negation as failure;
- circumscription;
- default reasoning.

Undergraduate-student example একটি default rule: by default, কোনো student-কে undergraduate ধরা হয় যদি postgraduate evidence না থাকে।

## ১১.২ Semantics for negation

Lecture Datalog with negation-এর কয়েকটি semantics mention করে:

- negation as failure;
- stable model semantics;
- Answer Set Programming;
- stratified negation.

Negation সহজ যখন negation-through cyclic dependencies নেই। এটি stratified case।

Cyclic dependencies involving negation থাকলে জিনিস কঠিন হয়:

- unique/minimal Herbrand model হারিয়ে যেতে পারে;
- reasoning-এ অনেক Herbrand models consider করতে হতে পারে;
- ভিন্ন entailment notions আসতে পারে।

[UNCLEAR] Transcript-এ “cautious entailment and brief entailment” বলা হয়েছে; সম্ভবত কোনো technical term garbled হয়েছে। Exact term confirm করতে recording শুনতে হবে।

## ১১.৩ Disjunctive Datalog

Disjunctive Datalog rule heads-এ disjunction allow করে।

Example:

```prolog
UGStudent(x) ∨ PGTStudent(x) :- Student(x).
```

Lecture disjunctive stable model semantics এবং DLV reasoner mention করে।

[UNCLEAR] Transcript reasoner name garble করেছে, কিন্তু slide-এ DLV আছে।

## ১১.৪ Datalog with data types

Applications-এ Datalog data types দিয়ে extend করা হয়, যেমন:

- primitive types: numbers, strings;
- composite/user-defined types: records of integers;
- operations and aggregations;
- comparisons such as \(\leq\), \(=\);
- arrays, lists, records;
- pointers.

Lecturer জোর দেন যে এগুলো program analysis এবং verification-এর জন্য বিশেষ গুরুত্বপূর্ণ।

## ১১.৫ Datalog±

Datalog±-কে Datalog এবং description logics-এর combinations-এর family হিসেবে বর্ণনা করা হয়।

Motivation:

- Datalog active domain-এর ওপর general relational structure-এ ভালো।
- Description logics anonymous/existential individuals-এ ভালো।
- Datalog± decidability preserve এবং complexity control করে এগুলো combine করতে চায়।

Lecture **guardedness** ধারণা ব্যাখ্যা করে।

### Key concept: guarded rule

Rule guarded যদি সব universally quantified variables rule body-র একটি single atom-এ একসাথে occur করে।

Lecture-এর rough idea:

- rule heads-এ fresh variables বা function-like terms allow করা;
- কিন্তু শুধু যখন তাদের use suitable body atoms দিয়ে guarded;
- guardedness decidability preserve করতে সাহায্য করে।

Example guarded existential-style rule:

```prolog
hasParent(x,y) :- Person(x)
```

corresponding to:

\[
\forall x\,
\bigl(
Person(x) \Rightarrow \exists y\, hasParent(x,y)
\bigr).
\]

এখানে universal variable \(x\) `Person(x)` দিয়ে guarded।

Example not guarded:

```prolog
isRelTo(x,y) :- isRelTo(x,z), isRelTo(z,y).
```

Transitive-closure rule relevant sense-এ guarded নয়।

---

# ১২. Datalog compared with description logic

## ১২.১ Shared properties

Datalog এবং description logics—দুটোকেই first-order predicate logic-এর fragments হিসেবে present করা হয়।

Example Datalog rule:

```prolog
Happy(x) :- hasParent(x,y), Person(x).
```

Lecture corresponding first-order reading দেয়:

\[
\forall x\,
\bigl(
Person(x) \land \exists y\,hasParent(x,y)
\Rightarrow Happy(x)
\bigr).
\]

Corresponding description logic axiom:

\[
Person \sqcap \exists hasParent.\top \sqsubseteq Happy.
\]

Plain forms-এ Datalog এবং relevant description logics দুটোই:

- first-order logic-এর fragments;
- monotonic;
- decidable;
- relevant reasoning tasks-এর জন্য polynomial, তবে Datalog-এর ক্ষেত্রে bounded predicate arity caveat আছে;
- first-order logic-এর Horn fragments।

Lecture full first-order logic-এর সঙ্গে contrast করে, যেখানে satisfiability/validity reasoning undecidable।

### Exam flag

Plain Datalog monotonic, কিন্তু Datalog with negation as failure নয়। Datalog polynomial complexity-এর bounded-arity caveat-টিও explicitly highlighted।

## ১২.২ Factual vs conceptual knowledge

Datalog এবং description logic—দুটোই দুই ধরনের knowledge আলাদা করে।

### Factual knowledge

Examples:

```prolog
Person(Bob)
hasParent(Bob,Sue)
```

Description logic-এ:

- factual knowledge ABox-এ থাকে।

Datalog-এ:

- factual knowledge ground facts হিসেবে থাকে;
- database-style term হলো EDB, extensional database।

Lecturer বলেন factual knowledge অনেক বড় হতে পারে এবং ঘন ঘন change করতে পারে।

### Conceptual/class-level knowledge

Examples:

Description logic:

\[
Person \sqsubseteq Mammal
\]

\[
Person \sqcap \exists hasChild.\top \sqsubseteq Parent
\]

Datalog:

```prolog
Mammal(x) :- Person(x).
Parent(x) :- hasChild(x,y), Person(x).
```

এগুলো general, universally true rules যা models-কে intended ones-এ constrain করে। এগুলো inferred facts, links, tables, বা relations derive করতে ব্যবহৃত হয়; validation-এও ব্যবহৃত হয়: data intended worldview-এর সঙ্গে conform করে কিনা check করা।

## ১২.৩ Expressive power: যেখানে Datalog শক্তিশালী

### Higher arity

Datalog any arity-এর predicates allow করে।

Example:

```prolog
Sale(x,y,z)
```

এটি product, assistant, এবং shop-এর মধ্যে ternary relation সরাসরি represent করতে পারে।

Description logics যেমন \(\mathcal{EL}\) এবং \(\mathcal{EL}^{++}\) unary এবং binary predicates ব্যবহার করে, তাই এই ধরনের ternary relation directly applicable নয়।

### General relational structures

Datalog variables-কে arbitrary graph-like structures-এ connect করতে পারে।

Example bicycle rule:

```prolog
Bicycle(x) :- hasPart(x,y), hasPart(x,z), hasPart(x,f),
              Wheel(y), Wheel(z), Frame(f),
              connectedTo(y,f), connectedTo(z,f).
```

এটি express করে যে wheels এবং frame পরস্পরের সঙ্গে connected, শুধু parts হিসেবে exist করে তা নয়। Description logic tree-shaped part structures express করতে পারে, কিন্তু anonymous parts-এর মধ্যে একই internal graph express করতে পারে না।

### Recursion

Datalog naturally recursive relations যেমন transitive closure define করে।

```prolog
isRelatedTo(x,y) :- hasParent(x,y).
isRelatedTo(x,y) :- isRelatedTo(y,x).
isRelatedTo(x,y) :- isRelatedTo(x,z), isRelatedTo(z,y).
```

Lecture এটিকে major Datalog strength হিসেবে presents করে।

## ১২.৪ Expressive power: যেখানে description logic শক্তিশালী

Description logics anonymous/existential individuals express করতে পারে।

Example:

\[
Person \sqsubseteq \exists hasParent.\top.
\]

এটি বলে প্রতিটি person-এর কোনো parent আছে, parent-কে name না করেই।

Plain Datalog এটি express করতে পারে না, কারণ এটি rule heads-এ fresh variables introduce করতে পারে না।

Description logics bicycle-to-parts implications-ও express করতে পারে, যেমন:

\[
Bicycle
\sqsubseteq
\exists hasPart.(Wheel \sqcap Front)
\sqcap
\exists hasPart.(Wheel \sqcap Back)
\sqcap
\exists hasPart.Frame.
\]

কিন্তু lecture জোর দেয় যে এটি শুধু tree-shaped anonymous structure দেয়, anonymous parts-এর মধ্যে arbitrary connections নয়।

## ১২.৫ Complementarity summary

Lecture-এর মূল comparison:

- Plain Datalog এবং \(\mathcal{EL}\) দুটোতেই full negation ও full disjunction নেই, যদিও দুটিরই extensions আছে।
- Datalog শুধু active domain নিয়ে কথা বলতে পারে, অর্থাৎ program-এর named individuals।
- Datalog সেই active domain-এর ওপর general relational structures নিয়ে কথা বলতে পারে।
- \(\mathcal{EL}\) anonymous individuals নিয়ে কথা বলতে পারে।
- \(\mathcal{EL}\) শুধু tree-shaped anonymous relational structures নিয়ে কথা বলতে পারে।
- Restrictions রাখা হয়েছে reasoning decidable এবং polynomial-time রাখার জন্য।
- Datalog± strengths combine করার attempt হিসেবে introduced।

## ১২.৬ Comparison table: propositional logic, description logic, Datalog

Slide table-এ high-level comparison দেওয়া হয়েছে।

| Feature | Propositional logic | \(\mathcal{EL}/\mathcal{EL}^{++}\) | Datalog |
|---|---:|---:|---:|
| Predicate arity | unary-like, \(p\)-কে \(p(x)\) হিসেবে পড়া | unary and binary | any arity |
| Conjunction | yes | yes | yes |
| Disjunction | yes | only limited/subclass-style | only as implication in rules |
| Negation | yes | no full negation; disjointness in \(\mathcal{EL}^{++}\) | no |
| Semantics | valuation, single point | interpretation with many elements | interpretation with named individuals / active domain |
| Main reasoning task | satisfiability | entailment, classification | entailment, classification |
| Complexity | NP-complete | polynomial | polynomial for low/bounded arity; ExpTime-complete if unrestricted as stated in the slide |
| Usage in KR | verification, HW/SW design, module for other reasoning | query answering over KBs, taxonomy design/maintenance | query answering over KBs, taxonomy design/maintenance |

---

# ১৩. Applications of Datalog

## ১৩.১ On-stage applications: clever query language

Datalog সরাসরি “clever” query language for data হিসেবে ব্যবহার করা যায়, বিশেষ করে deductive databases-এ।

Complex SQL queries manually না লিখে Datalog rules দিয়ে useful derived relations define করা যায়।

Example idea:

- database-এ `hasParent` আছে;
- Datalog `isRelatedTo` define করে;
- user manually recursive SQL লেখার বদলে `isRelatedTo` query করে।

Datalog implement করা যায়:

- directly by a Datalog engine;
- SQL-এ translation করে।

Non-recursive Datalog programs \(P\)-এর জন্য lecture states যে \(P\)-কে SQL queries \(Q_P^A\)-তে translate করা যায় যাতে:

\[
P \models A(b_1,\dots,b_m)
\quad\text{iff}\quad
(b_1,\dots,b_m)
\in
Answ(Q_P^A, GrFs(P)).
\]

এখানে \(GrFs(P)\) হলো \(P\)-এর ground facts দিয়ে তৈরি extensional database।

Recursive programs-এর জন্য translation কঠিন। Plain SQL নিচের মতো recursive rules express করে না:

```prolog
isRelatedTo(x,y) :- isRelatedTo(x,z), isRelatedTo(z,y).
```

Lecture বলে recursive queries databases-এ heavily studied হয়েছে, এবং Common Table Expressions বেশিরভাগ SQL engines-এ general recursive queries support করে।

## ১৩.২ Behind-the-scenes applications: program analysis and repair

Datalog static program analysis এবং repair-এর behind the scenes ব্যবহৃত হয়।

এই setting-এ users সরাসরি Datalog লেখে না। বরং:

1. একটি tool programs analyse করে;
2. এটি program properties, safety conditions, এবং related constraints-কে Datalog programs ও queries-তে translate করে;
3. Datalog engine reasoning করে।

Slide page 51-এর image-এ software engineers “on stage,” আর Datalog engine-এ translation behind the scenes হিসেবে দেখানো হয়েছে।

এ ধরনের applications-এ extensions দরকার:

- data types: reals, integers, strings;
- operations and aggregation;
- comparisons such as \(\leq\) and \(=\);
- complex data types: records, arrays, lists;
- pointers.

[UNCLEAR] Program-analysis application-এ transcript “lifeless conditions” বলে, যা সম্ভবত garbled। Recording check করে দেখা দরকার lecturer “liveness conditions” বলেছেন কিনা।

---

# ১৪. Exam flags এবং high-value revision points

Uploaded transcript-এ explicit “this will be on the exam” phrase দেখা যায় না, কিন্তু lecturer বারবার কয়েকটি জিনিস important, critical, বা conceptually central হিসেবে flag করেন।

## ১৪.১ Must-know definitions

Formal definitions জানতে হবে:

- term;
- atom;
- rule;
- program;
- fact;
- Horn clause;
- interpretation;
- substitution;
- satisfaction of atom/rule/program;
- entailment;
- Herbrand base \(HB(P)\);
- Herbrand model \(HM(P)\);
- immediate consequence operator \(ICO_P\);
- monotonicity.

## ১৪.২ Very high-value theorems

Memorise করতে হবে এবং use করতে জানতে হবে:

\[
P \models \alpha
\quad\text{iff}\quad
\alpha \in HM(P)
\]

ground atoms \(\alpha\)-এর জন্য।

আরও:

\[
HM(P) = ICO_P^*(\emptyset)
\]

তাই:

\[
P \models \alpha
\quad\text{iff}\quad
\alpha \in ICO_P^*(\emptyset).
\]

এগুলো semantics, canonical models, এবং algorithms connect করে।

## ১৪.৩ Critical complexity caveat

Datalog-এর Herbrand base এবং Herbrand model polynomial-sized শুধু তখনই যখন predicate arity bounded। Arity unbounded হলে \(p \cdot m^n\) bound exponential হতে পারে। Lecturer এটিকে explicitly critical বলেন।

## ১৪.৪ Common mistakes to avoid

- `:-` ভুল direction-এ পড়া। `H :- A1, A2` মানে \(A_1 \land A_2 \Rightarrow H\)।
- Facts যে empty bodies-সহ rules—এটি ভুলে যাওয়া।
- Head-এ fresh variables allow করা। Plain Datalog-এ allowed নয়।
- Datalog anonymous individuals create করতে পারে ভাবা। পারে না।
- Plain Datalog-এ negation ও disjunction নেই—এটি ভুলে যাওয়া।
- একটি single query-এর জন্য পুরো Herbrand model compute করার wastefulness না বোঝা।
- Datalog with negation as failure non-monotonic—এটি ভুলে যাওয়া।

## ১৪.৫ Important conceptual contrasts

- Datalog: active domain, general relational structures, recursion.
- Description logic: anonymous individuals, tree-shaped anonymous structures.
- Plain Datalog এবং \(\mathcal{EL}\): reasoning decidable এবং polynomial রাখতে দুটোই restricted।
- Datalog±: strengths combine করতে চায়, complexity control রেখে।

---

# ১৫. Connections to earlier lectures and other material

## ১৫.১ Connection to propositional logic

Datalog rules-কে Horn clauses-এ translate করা যায়, propositional logic-এ দেখা implication/disjunction equivalences ব্যবহার করে:

\[
\varphi \Rightarrow \psi
\equiv
\neg \varphi \lor \psi.
\]

Datalog rule:

```prolog
Slippery(x) :- Rain(x), BelowF(x).
```

becomes:

\[
Slippery(x) \lor \neg Rain(x) \lor \neg BelowF(x).
\]

## ১৫.২ Connection to description logic

Datalog এবং description logic দুটোই all models-এর ওপর model-theoretic entailment ব্যবহার করে, কিন্তু দুটোই specialised reasoning methods দিয়ে brute-force model search এড়ায়।

Datalog-এর Herbrand model আগের reasoning algorithms-এ canonical/consequence-based structures-এর মতো practical role পালন করে: এটি all interpretations range না করেও entailments compute করতে দেয়।

## ১৫.৩ Connection to first-order logic

Datalog এবং description logic first-order logic-এর fragments। Lecture জোর দেয় যে full first-order logic বেশি expressive কিন্তু reasoning tasks undecidable; Datalog ও description logics designed as decidable, often polynomial fragments।

## ১৫.৪ Connection to databases

Datalog SQL এবং deductive databases-এর সঙ্গে closely connected। Non-recursive Datalog SQL queries-তে translate করা যায়; recursive Datalog recursive database queries এবং Common Table Expressions-এর সঙ্গে সম্পর্কিত।

## ১৫.৫ Connection to program verification

Datalog static analysis, program verification, এবং repair-এ behind the scenes ব্যবহৃত হতে পারে, especially যখন data types, comparisons, aggregation, complex structures, এবং pointers দিয়ে extend করা হয়।

---

# ১৬. Unclear বা transcript-garbled sections revisit করার জন্য

1. **Hierarchy example: dog vs duck.** Transcript-এ “if x is a dog then x is a bird” টাইপ কিছু এসেছে, কিন্তু slide-এ `Bird(x) :- Duck(x)` আছে। Slide version-ই intended hierarchy।

2. **`hasDaughter` / `hasChild` variable order.** Lecturer explicitly বলেন slide-এ typo আছে: predicates দুটোতেই same variable order হওয়া উচিত, সম্ভবত `hasChild(x,y) :- hasDaughter(x,y)`, কোনো একটিতে `y,x` নয়।

3. **Herbrand model worked example.** Displayed program-এ `Cold(W)` থেকে `Temp(W)` এবং `WeatherC(W)` derive করার rules আছে, কিন্তু shown Herbrand model list-এ এগুলো omitted। Slide intentionally truncated কিনা, না এটি error—check করা দরকার।

4. **Model-theoretic satisfaction symbol.** Parsed slide text atom satisfaction-এর জন্য subset symbol দেখায়, কিন্তু transcript tuple belongs to predicate relation বলে। Intended condition membership \(\in\), subset নয়।

5. **Datalog reasoner name.** Transcript disjunctive Datalog reasoner-এর name garble করে; slide-এ DLV আছে।

6. **“Brief entailment.”** Transcript বলে “cautious entailment and brief entailment.” এটি সম্ভবত garbled technical term; exact phrase recording থেকে confirm করা দরকার।

7. **“Lifeless conditions.”** Program-analysis application-এ transcript “program and lifeless conditions” বলে; সম্ভবত garbled। Lecturer “liveness conditions” বলেছেন কিনা check করা দরকার।
