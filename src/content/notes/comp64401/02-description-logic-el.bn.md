---
subject: COMP64401
chapter: 2
title: "Description Logic EL"
language: bn
---

# COMP64401 — মডিউল ৩: Description Logic $\mathcal{EL}$

**পরীক্ষার পুনরাবৃত্তির জন্য কাঠামোবদ্ধ স্টাডি নোট**

আপলোড করা লেকচার ট্রান্সক্রিপ্ট এবং Week 4+5 স্লাইড ডেক থেকে তৈরি।

## ব্যবহৃত উৎস ফাইল

- `3.1EL-SyntaxAndSemantics-English.txt`
- `3.5ELNormalForm-English (1).txt`
- `3.5ELNormalForm-English (2).txt` — normal-form লেকচারের duplicate/parallel copy
- `3.6ELCBAlgorithm-English.txt`
- `3.7ELLimitationsOWL-English.txt`
- `Week4+5 (1).pdf`

---

## বিষয় ও পরিসর

এই লেকচার ব্লকে knowledge representation and reasoning-এর জন্য description logic $\mathcal{EL}$ পরিচয় করানো হয়েছে: এর syntax, semantics, reasoning tasks, normal form, consequence-based classification algorithm, সীমাবদ্ধতা/extension, এবং OWL 2 EL-এর সঙ্গে সম্পর্ক।

এটি কোর্সের propositional logic অংশের পর আসে এবং দেখায় কেন structured conceptual ও factual knowledge base প্রকাশের জন্য description logic বেশি উপযোগী।

---

# ১. Propositional logic থেকে description logic

## ১.১ Propositional logic-এ আগে যা কভার করা হয়েছে

কোর্সে ইতিমধ্যে কভার করা হয়েছে:

- **Syntax**: কোন expression formula হিসেবে গণ্য হবে।
- **Semantics**: valuation কীভাবে formula-কে true/false দেয়।
- **Reasoning tasks**: এগুলো কী, কেন গুরুত্বপূর্ণ, এবং একে অপরের সঙ্গে কীভাবে সম্পর্কিত।
- **Propositional logic-এর tableau algorithm**, negation normal form-সহ।
- **KR application-এ reasoning-এর ব্যবহার**।
- **Propositional logic-এর সীমাবদ্ধতা**।

## ১.২ কেন propositional logic যথেষ্ট নয়

মূল উদাহরণটি weather knowledge। Propositional logic-এ আমরা এমন atom ব্যবহার করতে পারি:

$$
BS = \text{BlueSky}, \quad Sy = \text{Sunny}, \quad Rg = \text{Raining}
$$

এবং এমন formula:

$$
BS \Rightarrow Sy
$$

কিন্তু যখন আমরা **location** নিয়ে কথা বলতে চাই — যেমন Manchester-এ blue sky বনাম Birmingham-এ blue sky — তখন propositional logic আমাদেরকে অনেক duplicated atom বানাতে বাধ্য করে:

$$
BS_{\text{Man}}, \quad BS_{\text{Bir}}, \ldots
$$

এবং duplicated rule:

$$
BS_{\text{Man}} \Rightarrow Sy_{\text{Man}}, \quad BS_{\text{Bir}} \Rightarrow Sy_{\text{Bir}}, \ldots
$$

এটি cumbersome হয়ে যায়, কারণ একই general rule প্রতিটি object, place, time, বা context-এর জন্য আলাদা করে পুনরাবৃত্তি করতে হয়। Description logic structured conceptual ও factual knowledge আরও স্বাভাবিকভাবে represent করার উপায় হিসেবে আসে।

## ১.৩ Description logic: তিন ধরনের entity

Description logic আলাদা করে:

| Entity type | Intuition | Examples |
|---|---|---|
| **Classes** | জিনিসের set/kind | `Location`, `Person`, `Weather`, `Rain`, `Temperature`, `Shorts` |
| **Properties** | জিনিসগুলোর মধ্যে binary relation | `hasPart`, `isPartOf`, `takes`, `wears`, `isLocatedIn`, `hasWeather` |
| **Individuals** | নির্দিষ্ট object/entity | `Uli`, `Bijan`, `Manchester`, `England`, `UK` |

এর ফলে আমরা **conceptual knowledge** এবং **factual knowledge** আলাদা করতে পারি।

Conceptual example:

$$
\text{Rain} \sqsubseteq \text{Precipitation}
$$

Factual examples:

$$
\text{Bijan} : \text{Person}
$$

$$
(\text{Manchester}, \text{England}) : \text{isLocatedIn}
$$

Description logic এমন KR&R application-এর জন্য design করা হয়েছে যেখানে conceptual এবং factual knowledge দুটোই দরকার।

---

# ২. $\mathcal{EL}$ class-এর syntax

## ২.১ $\mathcal{EL}$ class-এর formal definition

ধরা যাক:

- $N_C$ হলো **class name**-এর set।
- $N_P$ হলো **property name**-এর set।
- $N_C$ এবং $N_P$ disjoint।

$\mathcal{EL}$-class inductively এভাবে define করা হয়:

1. $\top$ একটি $\mathcal{EL}$-class।
2. প্রতিটি class name $A \in N_C$ একটি $\mathcal{EL}$-class।
3. যদি $C,D$ $\mathcal{EL}$-class হয় এবং $p \in N_P$ হয়, তাহলে:

$$
C \sqcap D
$$

একটি $\mathcal{EL}$-class, এবং:

$$
\exists p.C
$$

একটিও $\mathcal{EL}$-class।

## ২.২ Constructor-গুলোর intuition

### $\top$

$\top$ হলো universal class: সবকিছু এর অন্তর্ভুক্ত।

লেকচারার বলেছেন, OWL-এ এটিকে `Thing` বলা হয়।

### $C \sqcap D$

এটি conjunction/intersection।

Intuition:

$$
C \sqcap D
$$

মানে “যে জিনিসগুলো একই সঙ্গে $C$ এবং $D$।”

Example:

$$
\text{BelowF} \sqcap \text{Rain}
$$

মানে এমন জিনিস যা একই সঙ্গে below freezing এবং rain।

### $\exists p.C$

এটি existential restriction।

Intuition:

$$
\exists p.C
$$

মানে “যে জিনিসের কোনো $p$-successor আছে, এবং সেই successor একটি $C$।”

Example:

$$
\exists \text{wears}.\text{Shorts}
$$

মানে এমন জিনিস যা এমন কিছু পরে যা `Shorts`-এর instance।

Nested example:

$$
\exists \text{isLocatedIn}.\exists \text{hasWeather}.(\text{BelowF} \sqcap \text{Rain})
$$

মানে এমন জিনিস যা এমন কোনো জায়গায় located, যে জায়গার এমন weather আছে যা একই সঙ্গে below freezing এবং rain।

## ২.৩ এই পর্যায়ে $\mathcal{EL}$-এ যা নেই

$\mathcal{EL}$-এ আছে:

$$
\top,\quad A,\quad C \sqcap D,\quad \exists p.C
$$

এতে **নেই**:

- full disjunction $C \sqcup D$,
- full negation $\neg C$,
- class constructor হিসেবে implication।

এটি পরে গুরুত্বপূর্ণ, কারণ restricted syntax polynomial-time reasoning ধরে রাখতে সাহায্য করে।

---

# ৩. $\mathcal{EL}$ class-এর semantics

## ৩.১ Interpretation-এর formal definition

একটি interpretation হলো:

$$
\mathcal{I} = (\Delta^{\mathcal{I}}, \cdot^{\mathcal{I}})
$$

যেখানে:

- $\Delta^{\mathcal{I}}$ হলো non-empty set, যাকে $\mathcal{I}$-এর **domain** বলা হয়।
- mapping $\cdot^{\mathcal{I}}$ map করে:
  - প্রতিটি class name $A \in N_C$-কে একটি set-এ:

$$
A^{\mathcal{I}} \subseteq \Delta^{\mathcal{I}}
$$

  - প্রতিটি property name $p \in N_P$-কে একটি binary relation-এ:

$$
p^{\mathcal{I}} \subseteq \Delta^{\mathcal{I}} \times \Delta^{\mathcal{I}}
$$

Interpretation complex class-এ extend করা হয় এভাবে:

$$
\top^{\mathcal{I}} := \Delta^{\mathcal{I}}
$$

$$
(C \sqcap D)^{\mathcal{I}} := C^{\mathcal{I}} \cap D^{\mathcal{I}}
$$

$$
(\exists p.C)^{\mathcal{I}} :=
\{x \in \Delta^{\mathcal{I}} \mid \text{there is some } y \in C^{\mathcal{I}} \text{ with } (x,y) \in p^{\mathcal{I}}\}
$$

শেষ definition-টির অর্থ: $x$ ঠিক তখনই $(\exists p.C)^{\mathcal{I}}$-এর মধ্যে আছে, যখন $x$-এর একটি $p$-successor আছে, যা $C$-এর instance।

## ৩.২ Terminology

Class name $A$-এর জন্য:

- $A^{\mathcal{I}}$ হলো $\mathcal{I}$-এ $A$-এর **extension**।
- যদি $b \in A^{\mathcal{I}}$, তাহলে $b$ হলো $\mathcal{I}$-এ $A$-এর **instance**।

Property name $p$-এর জন্য:

- যদি $(b,c) \in p^{\mathcal{I}}$, তাহলে $c$ হলো $b$-এর **$p$-successor**।

Slide deck-এ স্পষ্টভাবে বলা হয়েছে, interpretation graph হিসেবে আঁকা উচিত: element-গুলো node, class membership region/label দিয়ে, এবং property relation arrow দিয়ে দেখানো হয়। Slide/page 12-এর diagram-এ `wears`, `isLocatedIn`, এবং `hasWeather`-এর arrow দিয়ে এটি দেখানো হয়েছে।

## ৩.৩ Worked interpretation example

লেকচারে এই interpretation ব্যবহার করা হয়েছে:

$$
\Delta^{\mathcal{I}} = \{a,b,c,d,e,f,g\}
$$

যেখানে:

$$
\top^{\mathcal{I}} = \{a,b,c,d,e,f,g\}
$$

$$
\text{Weather}^{\mathcal{I}} = \{a,b,c\}
$$

$$
\text{BelowF}^{\mathcal{I}} = \{a,b\}
$$

$$
\text{Rain}^{\mathcal{I}} = \{b,c\}
$$

$$
\text{Shorts}^{\mathcal{I}} = \{g\}
$$

$$
\text{Person}^{\mathcal{I}} = \{f\}
$$

Properties:

$$
\text{wears}^{\mathcal{I}} = \{(a,b),(b,b),(f,g)\}
$$

$$
\text{isLocatedIn}^{\mathcal{I}} = \{(d,e),(e,e),(d,d)\}
$$

$$
\text{hasWeather}^{\mathcal{I}} =
\{(d,a),(d,b),(d,c),(e,a),(e,c)\}
$$

এ থেকে:

### Example 1: conjunction

$$
(\text{BelowF} \sqcap \text{Rain})^{\mathcal{I}}
=
\text{BelowF}^{\mathcal{I}} \cap \text{Rain}^{\mathcal{I}}
$$

$$
= \{a,b\} \cap \{b,c\}
= \{b\}
$$

অতএব $b$ হলো একমাত্র element যা একই সঙ্গে below freezing এবং rain।

### Example 2: existential restriction

$$
(\exists \text{wears}.\text{Shorts})^{\mathcal{I}} = \{f\}
$$

কারণ $f$-এর `wears`-successor $g$, এবং $g \in \text{Shorts}^{\mathcal{I}}$।

### Example 3: weather successor

$$
(\exists \text{hasWeather}.\text{Weather})^{\mathcal{I}} = \{d,e\}
$$

কারণ $d$ এবং $e$—দুটোরই `hasWeather`-successor আছে যা `Weather`-এর instance।

### Example 4: nested existential

$$
(\exists \text{isLocatedIn}.\exists \text{hasWeather}.(\text{BelowF} \sqcap \text{Rain}))^{\mathcal{I}} = \{d\}
$$

Reason:

1. $(\text{BelowF} \sqcap \text{Rain})^{\mathcal{I}} = \{b\}$।
2. $d$-এর `hasWeather`-successor $b$ আছে।
3. loop $(d,d)$-এর কারণে $d$-এর `isLocatedIn`-successor $d$ আছে।
4. তাই $d$ nested class expression-এর instance।

---

# ৪. $\mathcal{EL}$ axiom, TBox, ABox, এবং KB-এর syntax

## ৪.১ $\mathcal{EL}$ axiom-এর formal definition

ধরা যাক $N_I$ হলো **individual name**-এর set, যা $N_C$ এবং $N_P$ থেকে disjoint।

একটি $\mathcal{EL}$-axiom হলো নিচের যেকোনো একটি:

1. **General class inclusion axiom** / **GCI**:
   $$
   C \sqsubseteq D
   $$
   যেখানে $C,D$ class।

2. **Class assertion**:
   $$
   b : C
   $$
   যেখানে $b \in N_I$ এবং $C$ class।

3. **Property assertion**:
   $$
   (b,c):p
   $$
   যেখানে $b,c \in N_I$ এবং $p \in N_P$।

## ৪.২ GCI কীভাবে পড়তে হবে

একটি GCI:

$$
C \sqsubseteq D
$$

এভাবে পড়া যায়:

- $C$ হলো $D$-এর subclass,
- $C$ $D$ দ্বারা subsumed,
- $C$ implies $D$,
- সব $C$ হলো $D$।

**Exam flag / precision warning.** Lecturer বলেছেন $C \sqsubseteq D$-কে সরাসরি “$C$ is a subset of $D$” হিসেবে পড়া উচিত নয়, কারণ $C$ এবং $D$ syntactic class expression, literal set নয়। কোনো interpretation-এর অধীনে তাদের **extension** set হয়।

## ৪.৩ TBox, ABox, knowledge base

একটি **TBox** হলো finite set of GCIs।

একটি **ABox** হলো finite set of class এবং property assertion।

একটি **knowledge base** হলো TBox এবং ABox-এর union:

$$
\mathcal{K} = \mathcal{T} \cup \mathcal{A}
$$

TBox conceptual/terminological knowledge ধরে। ABox individual সম্পর্কিত factual knowledge ধরে।

## ৪.৪ Examples

TBox-style axioms:

$$
\text{Temperature} \sqsubseteq \text{Weather}
$$

$$
\text{BelowF} \sqsubseteq \text{Temperature}
$$

$$
\text{Rain} \sqsubseteq \text{Precipitation}
$$

আরও complex:

$$
\text{Person}
\sqcap
\exists \text{wears}.\text{Shorts}
\sqcap
\exists \text{isLocatedIn}.\exists \text{hasWeather}.\text{BelowF}
\sqsubseteq
\text{ColdLegs}
$$

ABox-style axioms:

$$
\text{Bijan} : (\text{Person} \sqcap \exists \text{wears}.\text{Shorts})
$$

$$
(\text{Manchester}, \text{England}) : \text{isLocatedIn}
$$

$$
(\text{England}, \text{UK}) : \text{isLocatedIn}
$$

---

# ৫. Axiom এবং model-এর semantics

## ৫.১ Individual names

একটি interpretation প্রতিটি individual name $b \in N_I$-কেও একটি element-এ map করে:

$$
b^{\mathcal{I}} \in \Delta^{\mathcal{I}}
$$

Lecture-এ note করা হয়েছে, এই basic definition-এ ভিন্ন individual name বাধ্যতামূলকভাবে ভিন্ন domain element denote করে না।

## ৫.২ Axiom satisfaction

একটি interpretation $\mathcal{I}$ satisfy করে:

### GCI

$$
C \sqsubseteq D
$$

iff:

$$
C^{\mathcal{I}} \subseteq D^{\mathcal{I}}
$$

### Class assertion

$$
b:C
$$

iff:

$$
b^{\mathcal{I}} \in C^{\mathcal{I}}
$$

### Property assertion

$$
(b,c):p
$$

iff:

$$
(b^{\mathcal{I}}, c^{\mathcal{I}}) \in p^{\mathcal{I}}
$$

একটি interpretation কোনো ABox, TBox, বা knowledge base satisfy করে iff সেটির **প্রতিটি axiom** satisfy করে। এমন interpretation-কে ওই ABox/TBox/KB-এর **model** বলা হয়।

**Exam flag.** Lecturer বারবার **model** শব্দটি জোর দিয়ে বলেছেন: সব axiom satisfy করে এমন interpretation। এটি machine-learning model থেকে আলাদা।

## ৫.৩ Worked satisfaction examples

Slide deck-এ উদাহরণ আছে যেখানে interpretation satisfy করে:

$$
\text{BelowF} \sqsubseteq \text{Temperature}
$$

কারণ:

$$
\{a,b\} \subseteq \{a,b,c\}
$$

এটি আরও satisfy করে:

$$
\text{Rain} \sqsubseteq \text{Precipitation}
$$

কারণ:

$$
\{b,c\} \subseteq \{b,c\}
$$

এবং:

$$
\text{Person} \sqsubseteq \exists \text{wears}.\text{Shorts}
$$

কারণ person-রা এমন জিনিসের extension-এর মধ্যে পড়ে যারা shorts পরে।

একই interpretation satisfy করে না:

$$
\exists \text{locatedIn}.\exists \text{hasWeather}.\text{BelowF}
\sqsubseteq
\text{Person}
$$

কারণ left-hand extension right-hand extension-এর subset নয়। Slide-এ counterexample দেওয়া হয়েছে:

$$
\{d,e,f,h\} \nsubseteq \{f,h\}
$$

extended interpretation-এ।

---

# ৬. Entailment এবং reasoning tasks

## ৬.১ Entailment-এর formal definition

ধরা যাক $\mathcal{K}$ একটি $\mathcal{EL}$ ABox, TBox, বা KB, এবং $\alpha$ একটি GCI, class assertion, বা property assertion।

$$
\mathcal{K} \models \alpha
$$

iff $\mathcal{K}$-এর প্রতিটি model $\alpha$ satisfy করে।

অর্থাৎ: entailment হলো এমন axiom যা ABox/TBox/KB-এর সব model-এ true।

## ৬.২ Example TBox entailments

TBox-এ যদি থাকে:

$$
\text{Temperature} \sqsubseteq \text{WeatherCondition}
$$

$$
\text{Cold} \sqsubseteq \text{Temperature}
$$

তাহলে entail করা যায়:

$$
\text{Cold} \sqsubseteq \text{WeatherCondition}
$$

কারণ subclass relationship transitively compose করে।

আরও example entailments:

$$
\text{BelowF} \sqsubseteq \text{WeatherCondition}
$$

এবং person, weather, umbrella, boots, cold legs ইত্যাদি নিয়ে statement, TBox axiom-এর ওপর নির্ভর করে।

## ৬.৩ Modelling warning

Weather example-গুলো ইচ্ছাকৃতভাবে কিছুটা bad modelling।

Slide-এ explicitly warning আছে যে axiom-গুলো mix করে:

- কী **should be**,
- এবং কী **is**।

এগুলো exception-ও ignore করে, যেমন সবাই একইভাবে ঠান্ডা অনুভব করে কি না।

## ৬.৪ Syntactic sugar: equivalence

Notation:

$$
C \equiv D
$$

এটি দুটি axiom-এর syntactic sugar:

$$
C \sqsubseteq D
$$

এবং

$$
D \sqsubseteq C
$$

এটি logic-এর expressive power বাড়ায় না; এটি লেখা/পড়ার shortcut।

## ৬.৫ Main reasoning tasks

### Entailment testing

Given:

- একটি KB $\mathcal{K}$,
- একটি axiom $\alpha$,

test করা হয়:

$$
\mathcal{K} \models ? \ \alpha
$$

এর মধ্যে আছে:

$$
\mathcal{K} \models ? \ C \sqsubseteq D
$$

এবং:

$$
\mathcal{K} \models ? \ b:C
$$

### Instance retrieval

Given:

- একটি KB $\mathcal{K}$,
- একটি class $C$,

সব individual name $b$ return করা হয় যেগুলোর জন্য:

$$
\mathcal{K} \models b:C
$$

### Classification

Given KB $\mathcal{K}$, প্রতিটি:

$$
A,B \in N_C \cup \{\top\}
$$

এবং প্রতিটি individual $b \in N_I$-এর জন্য test করা হয়:

$$
\mathcal{K} \models ? \ A \sqsubseteq B
$$

এবং:

$$
\mathcal{K} \models ? \ b:A
$$

ফলাফল হলো **inferred class hierarchy**।

## ৬.৬ Inferred class hierarchy

Inferred class hierarchy হলো:

- partial order,
- transitive,
- directed acyclic graph হিসেবে representable,
- shortcut edge-সহ বা ছাড়া display করা যায়।

**Exam flag.** Lecturer explicitly বলেছেন, এখানে classification-এর image classification বা machine-learning classification-এর সঙ্গে খুব সামান্য সম্পর্কও নেই। এখানে অর্থ হলো inferred class hierarchy compute করা।

---

# ৭. $\mathcal{EL}$ Normal Form / ENF

## ৭.১ Normal form কেন গুরুত্বপূর্ণ

Normal form reasoning algorithm সহজ করে, কারণ algorithm-কে কম syntactic case handle করতে হয়।

Lecture-এ এটি propositional logic-এর negation normal form-এর সঙ্গে connect করা হয়েছে: normal form মানুষকে কম natural লাগতে পারে, কিন্তু algorithm design ও correctness proof সহজ করে।

## ৭.২ ENF-এর formal definition

একটি axiom **$\mathcal{EL}$ Normal Form** / **ENF**-এ আছে যদি এটি নিচের যেকোনো form-এর হয়:

$$
A \sqsubseteq B
$$

$$
A_1 \sqcap A_2 \sqsubseteq B
$$

$$
A \sqsubseteq \exists p.B
$$

$$
\exists p.A \sqsubseteq B
$$

$$
b:A
$$

$$
(b,c):p
$$

যেখানে:

$$
A,A_1,A_2,B \in N_C \cup \{\top\}
$$

$$
p \in N_P
$$

$$
b,c \in N_I
$$

অতএব ENF-এ axiom খুব ছোট এবং বেশিরভাগ atomic।

## ৭.৩ ENF-এ থাকা examples

Examples:

$$
\text{Rain} \sqsubseteq \text{Precipitation}
$$

$$
\text{BelowF} \sqcap \text{Precipitation} \sqsubseteq \text{Slippery}
$$

$$
\exists \text{teaches}.\top \sqsubseteq \text{Person}
$$

$$
\text{Professor} \sqsubseteq \exists \text{teaches}.\text{UniCourse}
$$

$$
\text{Uli}:\text{Professor}
$$

## ৭.৪ ENF-এ না থাকা examples

ENF-এ নয়:

$$
\text{Boots} \sqsubseteq \text{Shoes} \sqcap \text{WarmClothing}
$$

কারণ conjunction right-hand side-এ আছে।

$$
\text{Person} \sqcap \exists \text{teaches}.\text{UniCourse}
\sqsubseteq
\text{Professor}
$$

কারণ left-hand conjunction-এর মধ্যে complex existential আছে।

$$
\text{Bijan} : (\text{Person} \sqcap \exists \text{wears}.\text{Boots})
$$

কারণ class assertion complex class expression ব্যবহার করছে।

---

# ৮. ENF-এ transformation

## ৮.১ Basic idea

যেকোনো $\mathcal{EL}$ knowledge base-কে non-conforming axiom replace করে ENF knowledge base-এ transform করা যায়।

Example:

$$
A \sqsubseteq B \sqcap C
$$

replace করা যায়:

$$
A \sqsubseteq B
$$

$$
A \sqsubseteq C
$$

এটি exact equivalence, কারণ:

$$
\mathcal{I} \models A \sqsubseteq B \sqcap C
$$

iff:

$$
\mathcal{I} \models A \sqsubseteq B
\quad \text{and} \quad
\mathcal{I} \models A \sqsubseteq C
$$

same interpretation $\mathcal{I}$-এর জন্য।

## ৮.২ Fresh name থাকলে exact equivalence কেন খুব strong

এমন axiom ধরুন:

$$
A \sqsubseteq \exists p.(B \sqcap C)
$$

আমরা fresh name $X$ introduce করে replace করতে চাইতে পারি:

$$
A \sqsubseteq \exists p.X
$$

$$
X \sqsubseteq B \sqcap C
$$

কিন্তু same interpretation-এর ওপর exact equivalence fail করে, কারণ original interpretation নতুন class name $X$-কে কোনো intended meaning দেয় না।

তাই lecture একটি weaker কিন্তু appropriate notion introduce করে: **conservative extension**।

## ৮.৩ Conservative extension

ধরা যাক $\mathcal{K}_1$ এবং $\mathcal{K}_2$ দুইটি KB, এবং $\mathcal{K}_1$-এর সব name $\mathcal{K}_2$-তে occur করে।

$\mathcal{K}_2$ হলো $\mathcal{K}_1$-এর **conservative extension** iff:

1. $\mathcal{K}_2$-এর প্রতিটি model $\mathcal{K}_1$-এর model, এবং
2. $\mathcal{K}_1$-এর প্রতিটি model-কে $\mathcal{K}_2$-এর model-এ extend করা যায়।

Extension vocabulary সম্পর্কিত: $\mathcal{K}_2$ নতুন name introduce করতে পারে, এবং $\mathcal{K}_1$-এর model নতুন name interpret করে extend করা যায়।

**Exam flag.** Normal form transformation fresh auxiliary class name introduce করলেও original vocabulary-র ওপর reasoning preserve করার মূল কারণ এটিই।

---

# ৯. ENF transformation rules

## ৯.১ Notation

Rules-এ ব্যবহার করা হয়:

- $A$ class name বা $\top$-এর জন্য,
- $C,D$ arbitrary $\mathcal{EL}$-class-এর জন্য,
- $\mathbb{C}, \mathbb{D}$ complex class-এর জন্য, যা class name নয় এবং $\top$-ও নয়,
- $X$ fresh class name-এর জন্য।

প্রতিটি rule application-এর জন্য fresh, different $X$ introduce করা হয়।

## ৯.২ Rule 1: complex left এবং right side আলাদা করা

$$
\mathbb{C} \sqsubseteq \mathbb{D}
\rightsquigarrow
\mathbb{C} \sqsubseteq X,\quad X \sqsubseteq \mathbb{D}
$$

Purpose: complex left-hand side এবং complex right-hand side আলাদা করতে নতুন class name introduce করা।

## ৯.৩ Rule 2r: left-hand side-এ complex right conjunct

$$
C \sqcap \mathbb{D} \sqsubseteq A
\rightsquigarrow
\mathbb{D} \sqsubseteq X,\quad C \sqcap X \sqsubseteq A
$$

Purpose: left-hand side-এর conjunction-এর complex right conjunct-এর নাম দেওয়া।

## ৯.৪ Rule 2l: left-hand side-এ complex left conjunct

$$
\mathbb{C} \sqcap C \sqsubseteq A
\rightsquigarrow
\mathbb{C} \sqsubseteq X,\quad X \sqcap C \sqsubseteq A
$$

Purpose: left-hand side-এর conjunction-এর complex left conjunct-এর নাম দেওয়া।

## ৯.৫ Rule 3: left-hand side-এ complex existential

$$
\exists p.\mathbb{D} \sqsubseteq A
\rightsquigarrow
\mathbb{D} \sqsubseteq X,\quad \exists p.X \sqsubseteq A
$$

Purpose: left-side existential restriction-এর complex filler $\mathbb{D}$ replace করা।

## ৯.৬ Rule 4: right-hand side-এ complex existential

$$
A \sqsubseteq \exists p.\mathbb{D}
\rightsquigarrow
X \sqsubseteq \mathbb{D},\quad A \sqsubseteq \exists p.X
$$

Purpose: right-side existential restriction-এর complex filler $\mathbb{D}$ replace করা।

**Exam flag.** Rule 3 এবং Rule 4-এ definition axiom-এর direction আলাদা। Rule 3-এ $\mathbb{D} \sqsubseteq X$, কিন্তু Rule 4-এ $X \sqsubseteq \mathbb{D}$। Lecturer explicitly বলেছেন এটি intentional, typo নয়।

## ৯.৭ Rule 5: right-hand side conjunction split করা

$$
A \sqsubseteq C \sqcap D
\rightsquigarrow
A \sqsubseteq C,\quad A \sqsubseteq D
$$

Purpose: right-hand side থেকে conjunction remove করা।

## ৯.৮ Rule 6: complex class assertion

$$
b:\mathbb{C}
\rightsquigarrow
b:X,\quad X \sqsubseteq \mathbb{C}
$$

Purpose: complex ABox class assertion-কে atomic assertion plus defining GCI দিয়ে replace করা।

---

# ১০. Worked ENF transformation example

Original TBox:

$$
\mathcal{T}
=
\{
\exists p.(A \sqcap \exists p.\top) \sqsubseteq B \sqcap C,\quad
B \sqcap \exists r.A \sqsubseteq \exists p.(B \sqcap C)
\}
$$

## ১০.১ First axiom

Start:

$$
\exists p.(A \sqcap \exists p.\top) \sqsubseteq B \sqcap C
$$

Rule 1 complex side আলাদা করে:

$$
\exists p.(A \sqcap \exists p.\top) \sqsubseteq X_1
$$

$$
X_1 \sqsubseteq B \sqcap C
$$

Rule 5 right-hand conjunction split করে:

$$
X_1 \sqsubseteq B
$$

$$
X_1 \sqsubseteq C
$$

Rule 3 left-এর complex existential handle করে:

$$
\exists p.X_2 \sqsubseteq X_1
$$

$$
A \sqcap \exists p.\top \sqsubseteq X_2
$$

Rule 2r complex right conjunct-এর নাম দেয়:

$$
A \sqcap X_3 \sqsubseteq X_2
$$

$$
\exists p.\top \sqsubseteq X_3
$$

## ১০.২ Second axiom

Start:

$$
B \sqcap \exists r.A \sqsubseteq \exists p.(B \sqcap C)
$$

Rule 1 complex left এবং right আলাদা করে:

$$
B \sqcap \exists r.A \sqsubseteq X_4
$$

$$
X_4 \sqsubseteq \exists p.(B \sqcap C)
$$

Rule 2r complex right conjunct-এর নাম দেয়:

$$
B \sqcap X_5 \sqsubseteq X_4
$$

$$
\exists r.A \sqsubseteq X_5
$$

Rule 4 right-এর complex existential handle করে:

$$
X_4 \sqsubseteq \exists p.X_6
$$

$$
X_6 \sqsubseteq B \sqcap C
$$

Rule 5 split করে:

$$
X_6 \sqsubseteq B
$$

$$
X_6 \sqsubseteq C
$$

## ১০.৩ Resulting ENF TBox

Intermediate non-ENF axioms বাদ দিলে transformed TBox:

$$
\mathcal{T}' =
\{
X_1 \sqsubseteq B,\quad
X_1 \sqsubseteq C,\quad
\exists p.X_2 \sqsubseteq X_1,\quad
A \sqcap X_3 \sqsubseteq X_2,\quad
\exists p.\top \sqsubseteq X_3,
$$

$$
B \sqcap X_5 \sqsubseteq X_4,\quad
\exists r.A \sqsubseteq X_5,\quad
X_4 \sqsubseteq \exists p.X_6,\quad
X_6 \sqsubseteq B,\quad
X_6 \sqsubseteq C
\}
$$

Transformed $\mathcal{T}'$ হলো $\mathcal{T}$-এর conservative extension।

---

# ১১. ENF transformation-এর correctness

## ১১.১ Theorem

ধরা যাক $\mathcal{K}$ একটি $\mathcal{EL}$ TBox, ABox, বা KB। ENF transformation rules apply করলে:

1. terminate করে;
2. এমন $\mathcal{EL}$ TBox/KB $\mathcal{K}'$ দেয় যা:
   - $\mathcal{K}$-এর size-এর linear size,
   - $\mathcal{K}$-এর conservative extension,
   - ENF-এ।

## ১১.২ Definition: transformation

$\mathcal{K}$-তে ENF transformation rules exhaustively apply করে যে result $\mathcal{K}'$ পাওয়া যায়, সেটিকে $\mathcal{K}$-এর **transformation** বলা হয়।

“Exhaustively” মানে আর কোনো transformation rule applicable নেই।

## ১১.৩ Corollary: entailment preservation

ধরা যাক $\mathcal{K}'$ হলো $\mathcal{K}$-এর transformation, এবং $\alpha$ এমন axiom যা শুধু $\mathcal{K}$-এর class/property/individual name ব্যবহার করে। তাহলে:

$$
\mathcal{K} \models \alpha
\quad \text{iff} \quad
\mathcal{K}' \models \alpha
$$

তাই $\mathcal{K}'$-এর ওপর reasoning করলে original vocabulary-র ওপর একই consequence পাওয়া যায়, যেমন $\mathcal{K}$-এর ওপর reasoning করলে পাওয়া যেত।

**Exam flag.** $\alpha$ অবশ্যই original $\mathcal{K}$-এর name ব্যবহার করবে, $\mathcal{K}'$-এ introduce করা auxiliary name নয়।

## ১১.৪ Proof sketch

### Termination

প্রতিটি rule application একটি problematic complex form remove করে এবং এমন axiom দিয়ে replace করে যেখানে fewer transformation rules apply হয়। প্রতিটি relevant complex subexpression-এ rule at most once apply হয়।

### Linear size

প্রতিটি rule application introduce করে:

- original axiom-এর shorter version, এবং
- একটি subexpression-এর definition।

এটি original knowledge base-এর প্রতিটি subexpression-এর জন্য at most once ঘটে, এবং original KB-তে linearly many subexpression থাকে। তাই transformed KB linear size।

### Conservative extension

দুই direction দেখাতে হয়।

প্রথমত, $\mathcal{K}'$-এর প্রতিটি model $\mathcal{K}$-এর model। Rule 1-এর জন্য:

$$
\mathbb{C} \sqsubseteq X,\quad X \sqsubseteq \mathbb{D}
$$

implies:

$$
\mathbb{C}^{\mathcal{I}} \subseteq X^{\mathcal{I}}
\quad \text{and} \quad
X^{\mathcal{I}} \subseteq \mathbb{D}^{\mathcal{I}}
$$

তাই transitivity দিয়ে:

$$
\mathbb{C}^{\mathcal{I}} \subseteq \mathbb{D}^{\mathcal{I}}
$$

hence:

$$
\mathcal{I} \models \mathbb{C} \sqsubseteq \mathbb{D}
$$

দ্বিতীয়ত, $\mathcal{K}$-এর প্রতিটি model fresh class name appropriately interpret করে $\mathcal{K}'$-এর model-এ extend করা যায়। Rule 1-এর জন্য আমরা set করতে পারি:

$$
X^{\mathcal{I}} := \mathbb{C}^{\mathcal{I}}
$$

অথবা $\mathbb{C}^{\mathcal{I}}$ এবং $\mathbb{D}^{\mathcal{I}}$-এর মাঝের আরেকটি set।

### ENF result

ধরা যাক $\mathcal{K}'$ ENF-এ নয়। তাহলে সেটিতে ENF-এ allowed নয় এমন axiom থাকবে। কিন্তু তাহলে transformation rule-এর কোনো একটি এখনও apply করা যেত, যা exhaustive application assumption-এর contradiction।

---

# ১২. $\mathcal{EL}$-এর consequence-based classification algorithm

## ১২.১ Purpose

Algorithm ENF-এ থাকা KB $\mathcal{K}$ নেয় এবং classification-এর জন্য প্রয়োজনীয় সব entailed “short” বা atomic axiom derive করে।

এটি প্রতিটি:

$$
A,B \in N_C \cup \{\top\}
$$

এবং প্রতিটি individual $b \in N_I$-এর জন্য test করে:

$$
\mathcal{K} \models A \sqsubseteq B
$$

এবং:

$$
\mathcal{K} \models b:A
$$

এটি inferred class hierarchy return করে।

## ১২.২ High-level pipeline

Overall process:

$$
\text{Original KB}
\longrightarrow
\text{ENF Transformer}
\longrightarrow
\text{Classifier}
\longrightarrow
\text{Inferred Class Hierarchy}
$$

অতএব normal form transformation classification algorithm-এর preprocessing step।

---

# ১৩. Classification algorithm

## ১৩.১ Input and output

Input:

$$
\mathcal{K}
$$

ENF-এ থাকা একটি $\mathcal{EL}$ knowledge base।

Output:

$\mathcal{K}$-এর inferred class hierarchy।

## ১৩.২ Initialisation

Set:

$$
\mathcal{K}
:=
\mathcal{K}
\cup
\{A \sqsubseteq A,\ A \sqsubseteq \top
\mid A \in N_C \text{ occurs in } \mathcal{K}\}
$$

এগুলো trivial axiom, কিন্তু rule system-কে consequence uniformly derive করতে সাহায্য করে।

## ১৩.৩ Rule application

নিচের rules apply করা হয় যতক্ষণ আর কোনো rule apply হয় না।

**Exam flag.** Rule শুধু তখনই apply করা হয় যখন এটি $\mathcal{K}$ change করে, অর্থাৎ নতুন কিছু add করে। Lecturer বলেছেন এই condition rule presentation-এ implicit।

---

# ১৪. Consequence rules CR1–CR6

## CR1: subsumption transitivity

If:

$$
A_1 \sqsubseteq A_2 \in \mathcal{K}
$$

and:

$$
A_2 \sqsubseteq A_3 \in \mathcal{K}
$$

then add:

$$
A_1 \sqsubseteq A_3
$$

Intuition: subclass chain shortcut করা যায়।

Example:

$$
\text{Cold} \sqsubseteq \text{Temperature}
$$

$$
\text{Temperature} \sqsubseteq \text{WeatherCondition}
$$

therefore:

$$
\text{Cold} \sqsubseteq \text{WeatherCondition}
$$

## CR2: left-hand side conjunction

If:

$$
A \sqsubseteq A_1
$$

$$
A \sqsubseteq A_2
$$

$$
A_1 \sqcap A_2 \sqsubseteq B
$$

then add:

$$
A \sqsubseteq B
$$

Intuition: সব $A$ যদি $A_1$ হয় এবং সব $A$ যদি $A_2$ হয়, আর যা $A_1$ এবং $A_2$ দুটোই তা $B$, তাহলে সব $A$ হলো $B$।

Example:

$$
\text{Blizzard} \sqsubseteq \text{Snow}
$$

$$
\text{Blizzard} \sqsubseteq \text{BelowF}
$$

relevant precipitation facts এবং:

$$
\text{BelowF} \sqcap \text{Precipitation} \sqsubseteq \text{Slippery}
$$

থেকে:

$$
\text{Blizzard} \sqsubseteq \text{Slippery}
$$

## CR3: existential restriction reasoning

If:

$$
A \sqsubseteq \exists p.A_1
$$

$$
A_1 \sqsubseteq B_1
$$

$$
\exists p.B_1 \sqsubseteq B
$$

then add:

$$
A \sqsubseteq B
$$

Intuition: যদি $A$-দের $p$-successor থাকে $A_1$-এ, সব $A_1$ $B_1$, এবং যাদের $p$-successor $B_1$-এ আছে তারা $B$, তাহলে সব $A$ হলো $B$।

Example:

$$
\text{CleverPerson} \sqsubseteq \exists \text{wears}.\text{Umbrella}
$$

$$
\text{Umbrella} \sqsubseteq \text{RainCover}
$$

$$
\exists \text{wears}.\text{RainCover} \sqsubseteq \text{ComfyPerson}
$$

therefore:

$$
\text{CleverPerson} \sqsubseteq \text{ComfyPerson}
$$

## CR4: class assertion subsumption follow করে

If:

$$
b:A
$$

and:

$$
A \sqsubseteq B
$$

then add:

$$
b:B
$$

Example:

$$
W:\text{BelowF}
$$

$$
\text{BelowF} \sqsubseteq \text{Cold}
$$

therefore:

$$
W:\text{Cold}
$$

## CR5: class assertion-এর conjunction

If:

$$
b:A
$$

$$
b:B
$$

$$
A \sqcap B \sqsubseteq C
$$

then add:

$$
b:C
$$

Intuition: individual $b$ যদি $A$ এবং $B$ দুটোই হয়, আর সব $A$ এবং $B$ দুটোই হওয়া জিনিস $C$, তাহলে $b$ হলো $C$।

## CR6: property assertion plus existential-left GCI

If:

$$
(b,c):p
$$

$$
c:B
$$

$$
\exists p.B \sqsubseteq A
$$

then add:

$$
b:A
$$

Intuition: যদি $b$-এর $p$-successor $c$ থাকে, $c$ $B$ হয়, এবং $B$-তে $p$-successor থাকা সবকিছু $A$ হয়, তাহলে $b$ হলো $A$।

---

# ১৫. Worked classification example

Example-টি weather-style KB in ENF ব্যবহার করে, যেখানে class names যেমন:

$$
\text{Temperature},\ \text{WeatherCondition},\ \text{Precipitation},\ \text{Cold},\ \text{BelowF},\ \text{Rain},\ \text{Snow},\ \text{Blizzard}
$$

এবং normalisation-এর সময় introduce করা auxiliary names:

$$
X_1, X_2, X_3, X_4
$$

## ১৫.১ Initialisation

Algorithm axioms add করে, যেমন:

$$
\text{Temperature} \sqsubseteq \text{Temperature}
$$

$$
\text{Temperature} \sqsubseteq \top
$$

$$
\text{WeatherCondition} \sqsubseteq \text{WeatherCondition}
$$

$$
\text{WeatherCondition} \sqsubseteq \top
$$

এবং auxiliary name যেমন $X_1$-এর জন্যও একইভাবে।

## ১৫.২ CR1 examples

CR1 দিয়ে add করা হয়:

$$
\text{Cold} \sqsubseteq \text{WeatherCondition}
$$

$$
\text{BelowF} \sqsubseteq \text{Temperature}
$$

$$
\text{BelowF} \sqsubseteq \text{WeatherCondition}
$$

$$
\text{Rain} \sqsubseteq \text{WeatherCondition}
$$

$$
\text{Blizzard} \sqsubseteq \text{Precipitation}
$$

## ১৫.৩ CR2 example

From:

$$
\text{Blizzard} \sqsubseteq \text{BelowF}
$$

$$
\text{Blizzard} \sqsubseteq \text{Precipitation}
$$

$$
\text{BelowF} \sqcap \text{Precipitation} \sqsubseteq \text{Slippery}
$$

add:

$$
\text{Blizzard} \sqsubseteq \text{Slippery}
$$

## ১৫.৪ CR3 example

From:

$$
\text{CleverPerson} \sqsubseteq \exists \text{wears}.\text{Umbrella}
$$

$$
\text{Umbrella} \sqsubseteq \text{RainCover}
$$

$$
\exists \text{wears}.\text{RainCover} \sqsubseteq \text{ComfyPerson}
$$

add:

$$
\text{CleverPerson} \sqsubseteq \text{ComfyPerson}
$$

## ১৫.৫ ABox rule examples

ABox facts থাকলে:

$$
(\text{Bijan},S1):\text{wears}
$$

$$
S1:\text{Shorts}
$$

$$
\text{Bijan}:\text{Person}
$$

$$
(\text{Manchester},W):\text{hasWeather}
$$

$$
W:\text{BelowF}
$$

$$
(\text{Bijan},\text{Manchester}):\text{isLocatedIn}
$$

algorithm derive করে:

$$
W:\text{Cold}
$$

CR4 দিয়ে।

তারপর:

$$
\text{Bijan}:X_2
$$

CR6 দিয়ে, কারণ Bijan $S1$ পরে, $S1$ Shorts, এবং $\exists \text{wears}.\text{Shorts} \sqsubseteq X_2$।

তারপর:

$$
\text{Manchester}:X_4
$$

CR6 দিয়ে, $W$ Cold derive করার পরে।

তারপর:

$$
\text{Bijan}:X_3
$$

CR6 দিয়ে, Bijan-এর location relation Manchester-এর সঙ্গে ব্যবহার করে।

তারপর:

$$
\text{Bijan}:X_1
$$

CR5 দিয়ে।

Finally:

$$
\text{Bijan}:\text{ColdLegs}
$$

CR5 দিয়ে, Bijan-এর personhood এবং auxiliary class memberships ব্যবহার করে।

**Exam flag.** Lecturer warning দিয়েছেন rule order one-and-done নয়। Later rule application earlier rule-কে আবার applicable করতে পারে।

---

# ১৬. Classification algorithm-এর correctness

## ১৬.১ Theorem

ধরা যাক $\mathcal{K}$ ENF-এ থাকা একটি $\mathcal{EL}$ KB। Classification algorithm apply করলে:

1. terminate করে;
2. $\mathcal{K}$-এর size-এর polynomial size-র একটি $\mathcal{EL}$ KB $\mathcal{K}'$ দেয়;
3. প্রতিটি $\alpha \in \mathcal{K}'$-এর জন্য:
   $$
   \mathcal{K} \models \alpha
   $$
4. সব $A,B \in N_C \cup \{\top\}$-এর জন্য, যদি:
   $$
   \mathcal{K} \models A \sqsubseteq B
   $$
   তাহলে:
   $$
   A \sqsubseteq B \in \mathcal{K}'
   $$
5. সব $b \in N_I$ এবং $B \in N_C$-এর জন্য, যদি:
   $$
   \mathcal{K} \models b:B
   $$
   তাহলে:
   $$
   b:B \in \mathcal{K}'
   $$

Point 3 মানে **কোনো ভুল entailment** add হয় না। Points 4 এবং 5 মানে সব entailed atomic subsumption এবং atomic class assertion explicit করা হয়।

## ১৬.২ Soundness and completeness

Lecturer theorem-টি summary করেছেন এভাবে:

- algorithm **sound**: যা কিছু add হয়, তা entailed;
- algorithm **complete for atomic subsumptions and atomic class assertions**: এ ধরনের সব entailment eventually explicit হয়।

## ১৬.৩ Complexity corollary

একটি $\mathcal{EL}$ KB-এর inferred class hierarchy polynomial time-এ compute করা যায়।

Lecture-এ এটিকে propositional satisfiability-এর সঙ্গে contrast করা হয়েছে, যা NP-complete। Lecturer আরও বলেছেন human/cognitive complexity এবং computational complexity আলাদা: $\mathcal{EL}$ algorithm propositional tableau algorithm-এর চেয়ে মানুষের কাছে জটিল দেখাতে পারে, কিন্তু computationally বেশি well-behaved।

---

# ১৭. Classification correctness-এর proof sketch

## ১৭.১ Termination and polynomial size

ধরা যাক:

- $m$ = class name-এর সংখ্যা, $\top$-সহ,
- $n$ = property name-এর সংখ্যা,
- $i$ = individual name-এর সংখ্যা।

Possible ENF axiom forms:

$$
A \sqsubseteq B
$$

$$
A_1 \sqcap A_2 \sqsubseteq B
$$

$$
A \sqsubseteq \exists p.B
$$

$$
\exists p.A \sqsubseteq B
$$

$$
b:A
$$

$$
(b,c):p
$$

এই form-গুলোর possible axiom সংখ্যা polynomially bounded:

$$
m^2,\quad m^3,\quad m^2 n,\quad m^2 n,\quad im,\quad i^2 n
$$

তাই total bound:

$$
m^3 + m^2(1+2n) + mi + ni^2
$$

অতএব rules at most polynomially many axioms add করতে পারে।

কারণ rules axiom remove করে না এবং শুধু নতুন কিছু add করলে apply হয়, algorithm polynomially many addition-এর পরে terminate করে।

## ১৭.২ Soundness proof idea

প্রতিটি rule CRi-এর জন্য prove করতে হবে:

যদি CRi $\alpha$ add করে, তাহলে:

$$
\mathcal{K} \models \alpha
$$

### Example: CR1

$\mathcal{K}$-এর যেকোনো model $\mathcal{I}$ নিন।

যদি:

$$
A_1 \sqsubseteq A_2
$$

এবং:

$$
A_2 \sqsubseteq A_3
$$

$\mathcal{K}$-তে থাকে, তাহলে:

$$
A_1^{\mathcal{I}} \subseteq A_2^{\mathcal{I}}
$$

and:

$$
A_2^{\mathcal{I}} \subseteq A_3^{\mathcal{I}}
$$

Subset transitivity দিয়ে:

$$
A_1^{\mathcal{I}} \subseteq A_3^{\mathcal{I}}
$$

so:

$$
\mathcal{I} \models A_1 \sqsubseteq A_3
$$

যেহেতু এটি প্রতিটি model $\mathcal{I}$-এর জন্য true, তাই:

$$
\mathcal{K} \models A_1 \sqsubseteq A_3
$$

### Example: CR6

$\mathcal{K}$-এর যেকোনো model $\mathcal{I}$ নিন।

যদি:

$$
(b,c):p
$$

$$
c:B
$$

$$
\exists p.B \sqsubseteq A
$$

তাহলে:

$$
(b^{\mathcal{I}},c^{\mathcal{I}}) \in p^{\mathcal{I}}
$$

$$
c^{\mathcal{I}} \in B^{\mathcal{I}}
$$

so:

$$
b^{\mathcal{I}} \in (\exists p.B)^{\mathcal{I}}
$$

কারণ:

$$
(\exists p.B)^{\mathcal{I}} \subseteq A^{\mathcal{I}}
$$

we get:

$$
b^{\mathcal{I}} \in A^{\mathcal{I}}
$$

so:

$$
\mathcal{I} \models b:A
$$

and therefore:

$$
\mathcal{K} \models b:A
$$

## ১৭.৩ Completeness proof idea

Points 4 এবং 5-এর proof বেশি complicated। Lecture saturated KB $\mathcal{K}'$-এর জন্য একটি **canonical interpretation** $\mathcal{I}'$ ব্যবহার করে sketch দিয়েছে।

Define:

$$
\Delta^{\mathcal{I}'}
:=
\{x_A \mid A \in N_C \text{ in } \mathcal{K}\}
\cup
\{x_b \mid b \in N_I \text{ in } \mathcal{K}\}
\cup
\{x_{\top}\}
$$

প্রতিটি class name $B$-এর জন্য:

$$
B^{\mathcal{I}'}
:=
\{x_A \mid A \sqsubseteq B \in \mathcal{K}'\}
\cup
\{x_b \mid b:B \in \mathcal{K}'\}
$$

প্রতিটি property $p$-এর জন্য:

$$
p^{\mathcal{I}'}
:=
\{(x_A,x_B) \mid A \sqsubseteq \exists p.B \in \mathcal{K}'\}
\cup
\{(x_a,x_b) \mid (a,b):p \in \mathcal{K}'\}
$$

প্রতিটি individual $b$-এর জন্য:

$$
b^{\mathcal{I}'} := x_b
$$

তারপর দেখানো হয়:

1. $\mathcal{I}'$ হলো $\mathcal{K}'$-এর model।
2. যেহেতু $\mathcal{K} \subseteq \mathcal{K}'$, $\mathcal{I}'$ $\mathcal{K}$-এরও model।
3. যদি $A \sqsubseteq B \notin \mathcal{K}'$, তাহলে construction অনুযায়ী:
   $$
   A^{\mathcal{I}'} \nsubseteq B^{\mathcal{I}'}
   $$
   so:
   $$
   \mathcal{K} \not\models A \sqsubseteq B
   $$
4. Missing class assertion $b:B$-এর জন্যও similar।

---

# ১৮. $\mathcal{EL}$ কী express করতে পারে

## ১৮.১ Class hierarchies

$\mathcal{EL}$ class hierarchy express করতে পারে, যেমন:

$$
\text{ElectricEngine} \sqsubseteq \text{Engine}
$$

এবং reasoning ব্যবহার করে classes automatically inferred hierarchy-তে arrange করতে পারে।

## ১৮.২ Necessary and sufficient conditions দিয়ে definition

Lecture example:

$$
\text{Duck}
\equiv
\text{Bird}
\sqcap
\exists \text{livesOn}.\text{Water}
\sqcap
\exists \text{soundsLike}.\text{Quack}
$$

এটি duck হওয়ার necessary and sufficient conditions দেয়:

- কিছু duck হলে, তা bird, water-এ livesOn, এবং quack-এর মতো soundsLike।
- কিছু bird হলে, water-এ livesOn করলে, এবং quack-এর মতো soundsLike করলে, তা duck।

## ১৮.৩ Property domain

$\mathcal{EL}$ property domain express করতে পারে।

Example:

$$
\exists \text{isPoweredBy}.\top \sqsubseteq \text{Device}
$$

Intuition: কোনো কিছু যদি কোনো কিছুর দ্বারা powered হয়, তাহলে সেটি device।

## ১৮.৪ Multi-dimensional modelling

Lecture multi-dimensional modelling-কে description logic-এর বড় benefit হিসেবে দেখায়।

একটি বিশাল monolithic vehicle hierarchy manually বানানোর বদলে, আমরা vehicle class define করতে পারি কয়েকটি ছোট hierarchy দিয়ে:

- engine/power source,
- terrain,
- location,
- material।

Example: engine hierarchy vehicle hierarchy-কে “drive” করতে পারে। Vehicle define করা যায় এটি কী দিয়ে powered, কোন terrain-এ move করে, কোথায় built, এবং কোন material দিয়ে built—এসব দিয়ে। Slide pages 66–69 vehicle hierarchy-কে source/engine এবং terrain-এর মতো আলাদা hierarchy দিয়ে inform হতে দেখায়।

Advantage: একটি hierarchy পরিবর্তন করলে classification-এর মাধ্যমে inferred vehicle hierarchy automatically update হতে পারে।

Lecturer এটিকে object-oriented programming-এর separation/disentangling of concerns-এর সঙ্গে তুলনা করেছেন, কিন্তু বলেছেন benefit আরও বেশি, কারণ নইলে hierarchy enormous হয়ে যেত।

---

# ১৯. $\mathcal{EL}$-এর সীমাবদ্ধতা

$\mathcal{EL}$ intentionally restricted। Lecture plain $\mathcal{EL}$-এ express করা যায় না এমন কয়েকটি বিষয় list করেছে।

## ১৯.১ Class disjointness

বলতে পারে না:

$$
\text{Person} \sqcap \text{Vehicle} \sqsubseteq \bot
$$

অতএব $\mathcal{EL}$ enforce করতে পারে না যে persons এবং vehicles disjoint।

## ১৯.২ Property range

Domain axiom বলা যায়, যেমন:

$$
\exists \text{isPoweredBy}.\top \sqsubseteq \text{Device}
$$

কিন্তু `isPoweredBy`-এর range `PowerSource` বলা যায় না।

## ১৯.৩ Property hierarchy

Express করতে পারে না:

$$
\text{hasDaughter} \sqsubseteq \text{hasChild}
$$

$$
\text{hasChild} \sqsubseteq \text{isRelatedTo}
$$

## ১৯.৪ Property transitivity

Express করতে পারে না:

$$
\text{trans}(\text{isLocatedIn})
$$

যেমন, Salford Greater Manchester-এ located এবং Greater Manchester North West England-এ located হলে plain $\mathcal{EL}$ Salford North West England-এ located তা derive করতে পারে না।

## ১৯.৫ Individuals as classes

Individual-কে class হিসেবে ব্যবহার করা যায় না।

Plain $\mathcal{EL}$-এ express করা যায় না এমন example:

$$
\text{Manchester}:\text{City}
$$

$$
\text{Mancunian} \equiv \exists \text{livesIn}.\{\text{Manchester}\}
$$

## ১৯.৬ Inverse properties

Link করা যায় না:

$$
\text{isPoweredBy}
$$

এবং:

$$
\text{powers}
$$

inverses হিসেবে।

---

# ২০. $\mathcal{EL}^{++}$

$\mathcal{EL}^{++}$ $\mathcal{EL}$-কে expressive features দিয়ে extend করে, কিন্তু polynomial-time reasoning preserve করে।

এটি support করে:

- class disjointness,
- property ranges,
- property hierarchies,
- transitive properties,
- individuals as classes / nominals,
- OWL 2 EL-এ ব্যবহৃত অন্যান্য extensions।

কিন্তু এতে এখনও full disjunction বা full negation নেই।

## Full disjunction নেই কেন?

Lecturer ব্যাখ্যা করেছেন, proper disjunction reasoning by cases বাধ্য করে। Reasoning by cases branch করে, এবং branching প্রায়ই exponential behaviour আনে। $\mathcal{EL}^{++}$ polynomial reasoning ধরে রাখতে design করা, তাই full disjunction বাদ রাখা হয়েছে।

---

# ২১. Propositional logic এবং অন্যান্য DL-এর সঙ্গে সম্পর্ক

Slide comparison-এর picture:

| Feature | Propositional logic | $\mathcal{EL}/\mathcal{EL}^{++}$ | Other DLs, e.g. ALC |
|---|---|---|---|
| Conjunction | yes | yes | yes |
| Disjunction | yes | only in the restricted sense of subclass/implication | yes |
| Negation | yes | no / only disjointness in $\mathcal{EL}^{++}$ | yes |
| Semantics | valuation, single point | interpretation, many elements | interpretation, many elements |
| Main reasoning task | satisfiability | entailment, classification | entailment, classification |
| Complexity | NP-complete | polynomial | can be PSpace, ExpTime, etc. |
| KR usage | software/hardware verification, module in other reasoning | query answering over KBs, taxonomy design and maintenance | query answering over KBs, taxonomy design and maintenance |

Lecturer জোর দিয়েছেন যে সব description logic “propositional logic-এর চেয়ে simpler” নয়। কিছু DL কম complex; অন্য কিছু DL অনেক বেশি complex।

---

# ২২. $\mathcal{EL}$, OWL, এবং applications

## ২২.১ OWL কী?

OWL হলো web ontology language।

Computer science-এ “ontology” অনেক সময় knowledge base-এর আরেক নাম, যার মধ্যে থাকে:

- TBox,
- ABox।

তবে terminology vary করে:

- ABox-কে প্রায়ই **knowledge graph** বলা হয়।
- TBox-কে প্রায়ই **ontology** বলা হয়।

Lecturer সতর্ক করেছেন: “ontology” বা “knowledge graph” বলতে কেউ কী বোঝাচ্ছে তা check করা উচিত।

## ২২.২ OWL 2 এবং $\mathcal{EL}^{++}$

OWL দুই stage-এ developed হয়েছে:

- OWL,
- OWL 2।

OWL 2 KR&R research-এর ওপর build করে, বিশেষ করে semantics, entailment, complexity, এবং description logic fragment-এর algorithm।

$$
\mathcal{EL}^{++}
$$

হলো logical basis of:

$$
\text{OWL 2 EL}
$$

## ২২.৩ $\mathcal{EL}$ বনাম OWL 2

$\mathcal{EL}$:

- একটি logic,
- axioms, ABoxes, TBoxes, KBs-এর syntax আছে,
- interpretation দিয়ে semantics আছে,
- entailment এবং classification-এর মতো reasoning tasks support করে।

OWL 2:

- $\mathcal{EL}^{++}$-এর ওপর built ontology language,
- বিভিন্ন web-friendly syntax আছে,
- axioms এবং ontologies আছে,
- underlying DL থেকে semantics inherit করে,
- underlying DL থেকে reasoning tasks inherit করে,
- practical features add করে:
  - annotations,
  - XML datatypes,
  - datatype properties,
  - imports,
  - versioning,
  - OWL 2 DL-এর মতো more expressive variants।

**Exam flag / “super important” slide note.** OWL class/concept এবং তার label/term আলাদা করতে দেয়। Example:

- Class: `Person`
- Label: `Human`
- Biology label: `Homo sapiens`
- German label: `Mensch`

এটি lexical naming-কে logical meaning থেকে আলাদা করে।

---

# ২৩. OWL 2 usage

## ২৩.১ Knowledge-heavy industries

OWL 2 ontologies knowledge-heavy domain-এ ব্যবহৃত হয়, যেমন:

- biohealth,
- biochemistry।

Lecture BioPortal mention করেছে, যা ১,০০০-এর বেশি ontology-তে access দেয়, mature এবং widely used ontology-সহ, যেমন:

- SNOMED CT,
- nanoparticle ontologies,
- National Cancer Institute Thesaurus / NCIT।

## ২৩.২ Definition দিয়ে taxonomy organise করা

Example ontology fragment:

$$
\text{Patient}
\equiv
\text{Person}
\sqcap
\exists \text{suffersFrom}.\text{Disease}
$$

$$
\text{Inflammation} \sqsubseteq \text{Disease}
$$

$$
\text{HeartDisease}
\equiv
\text{Disease}
\sqcap
\exists \text{hasLoc}.\text{Heart}
$$

$$
\text{Endocarditis}
\equiv
\text{Inflammation}
\sqcap
\exists \text{hasLoc}.\text{Endocardium}
$$

$$
\text{Endocardium}
\sqsubseteq
\text{Bodypart}
\sqcap
\exists \text{isPartOf}.\text{Heart}
$$

$$
\text{hasLoc} \circ \text{isPartOf}
\sqsubseteq
\text{hasLoc}
$$

এগুলো থেকে reasoner derive করে:

$$
\text{Endocarditis} \sqsubseteq \text{HeartDisease}
$$

গুরুত্বপূর্ণ point: ontology author `Endocarditis` define করে, ontology classify করে, এবং reasoner `Endocarditis`-কে taxonomy-তে correct position-এ বসায়। Manual placement time-consuming, error-prone, এবং hard to maintain।

## ২৩.৩ Individuals type করা

একই medical-style TBox ব্যবহার করে ধরুন:

$$
\text{Bob}:
(
\text{Person}
\sqcap
\exists \text{suffersFrom}.(
\text{Inflammation}
\sqcap
\exists \text{hasLoc}.\text{Endocardium}
)
)
$$

Reasoner infer করতে পারে:

$$
\text{Bob}:\text{Patient}
$$

$$
\text{Bob}:\exists \text{suffersFrom}.\text{HeartDisease}
$$

$$
\text{Bob}:\text{HeDiPatient}
$$

যেখানে:

$$
\text{HeDiPatient}
\equiv
\text{Person}
\sqcap
\exists \text{suffersFrom}.\text{HeartDisease}
$$

এটি heart disease patient query করলে Bob retrieve করতে দেয়, যদিও Bob-কে explicitly heart disease patient বলা হয়নি।

## ২৩.৪ Individuals link করা

OWL 2 property hierarchy individuals-এর relationship নিয়ে reasoning support করতে পারে।

Lecture cell line ontology থেকে examples mention করেছে, property-chain-style axioms সহ:

$$
\text{capableOf} \circ \text{partOf} \sqsubseteq \text{capableOfPartOf}
$$

এবং:

$$
\text{endsWith} \circ \text{negativelyRegulates}
\sqsubseteq
\text{negativelyRegulates}
$$

[অস্পষ্ট: Transcript-এ এখানে কিছু property name garbled; slide general form এবং examples দেয়, কিন্তু exact intended property label দরকার হলে recording/slides check করা উচিত।]

## ২৩.৫ Tools

Lecture mention করেছে:

- OWL reasoners,
- ontology editors যেমন Protégé,
- OWL API,
- OWLready2,
- specialist tools for:
  - explanation of entailments,
  - module extraction,
  - diffing।

**Exam/coursework flag.** Lecturer বলেছেন Protégé coursework-এ ব্যবহার করা হবে।

---

# ২৪. Exam flags এবং high-value points

## Definitely know

- **Model** = ABox/TBox/KB-এর সব axiom satisfy করা interpretation। Lecturer বলেছেন তিনি এটি বারবার ask করবেন।
- $\mathcal{EL}$-class syntax:
  $$
  \top,\ A,\ C \sqcap D,\ \exists p.C
  $$
- Interpretation semantics:
  $$
  \top^{\mathcal{I}} = \Delta^{\mathcal{I}}
  $$
  $$
  (C \sqcap D)^{\mathcal{I}} = C^{\mathcal{I}} \cap D^{\mathcal{I}}
  $$
  $$
  (\exists p.C)^{\mathcal{I}} =
  \{x \mid \exists y \in C^{\mathcal{I}}.(x,y)\in p^{\mathcal{I}}\}
  $$
- Axiom types:
  $$
  C \sqsubseteq D,\quad b:C,\quad (b,c):p
  $$
- TBox = finite set of GCIs।
- ABox = finite set of class/property assertions।
- KB = TBox plus ABox।
- Entailment:
  $$
  \mathcal{K} \models \alpha
  $$
  iff $\mathcal{K}$-এর সব model $\alpha$ satisfy করে।
- Classification মানে inferred class hierarchy compute করা, ML/image classification নয়।
- ENF axiom forms।
- Conservative extension, especially fresh name কেন ordinary equivalence prevent করে।
- ENF transformation theorem:
  - terminates,
  - linear size,
  - conservative extension,
  - in ENF।
- Classification algorithm rules CR1–CR6।
- Classification theorem:
  - terminates,
  - polynomial size,
  - sound,
  - complete for atomic subsumptions and atomic class assertions।
- $\mathcal{EL}$ reasoning polynomial; propositional satisfiability NP-complete।
- $\mathcal{EL}^{++}$ expressivity extend করে এবং polynomial reasoning preserve করে।
- OWL 2 EL $\mathcal{EL}^{++}$-এর ওপর based।
- OWL annotations class/concept এবং labels/terms আলাদা করে।

## Common mistakes / precision traps

- $C \sqsubseteq D$-কে interpretation/extension mention না করে “$C$ is a subset of $D$” বলবে না।
- Fresh auxiliary name-এর fixed meaning original interpretation-এ আছে assume করবে না।
- ভুলে যেও না: ENF transformation শুধু **original vocabulary**-র entailment preserve করে।
- Transformation rules 3 এবং 4-এ fresh-name axiom-এর direction swap করবে না।
- Consequence rules fixed order-এ একবার apply করলেই শেষ ধরে নেবে না; later rule application earlier rule-কে আবার applicable করতে পারে।
- Classification rules naively implement করে বড় ontology-তে সব combination scan করবে না; lecturer warning দিয়েছেন practical implementation-এর জন্য clever indexing/optimisation দরকার।

---

# ২৫. অস্পষ্ট / garbled transcript sections যেগুলো revisit করা উচিত

- [অস্পষ্ট] Transcript বারবার “L”, “yellow”, “EAL” বা similar বলেছে। এগুলো $\mathcal{EL}$, slides দিয়ে confirm করা।
- [অস্পষ্ট] Transcript-এর “Entitlements” হওয়া উচিত **entailments**।
- [অস্পষ্ট] “E boxes”, “AbeBooks” বা similar হওয়া উচিত **ABoxes**।
- [অস্পষ্ট] “DCI/GHCI” হওয়া উচিত **GCI**, general class inclusion।
- [অস্পষ্ট] Transcript কখনও transformation rules “six” আবার কখনও “seven” বলেছে। Slides rules 1–6 number করে, কিন্তু rule 2-এর left/right variant $2l$ এবং $2r$ আছে; তাই ছয়টি numbered rule এবং সাতটি displayed schema।
- [অস্পষ্ট] Normal-form transcript একটি slide typo mention করে $A \sqsubseteq \exists p.(B \sqcap C)$ replace করার আশেপাশে। Corrected conservative-extension version ব্যবহার করো:
  $$
  A \sqsubseteq \exists p.X,\quad X \sqsubseteq B \sqcap C
  $$
- [অস্পষ্ট] Classification transcript-এ complexity formula verbally garbled; slide formula polynomial bound দেয়:
  $$
  m^3 + m^2(1+2n) + mi + ni^2
  $$
  usual polynomial-bound interpretation অনুযায়ী।
- [অস্পষ্ট] OWL limitations transcript-এ কিছু term badly transcribed: “Alta,” “out,” “oil,” ইত্যাদি **OWL/OWL 2** বোঝায়; “L plus plus” হলো $\mathcal{EL}^{++}$; “RLC/I’ll see” সম্ভবত **ALC**।
- [অস্পষ্ট] Vehicle example-এর slide parse বলে `MotorVehicle Bird poweredBy.Engine`, কিন্তু lecturer verbally correct করেছেন: এটি engine দ্বারা powered একটি **device** হওয়া উচিত, bird নয়।
- [অস্পষ্ট] Cell-line ontology property-chain examples transcript-এ partly garbled; exact property name revision-এর জন্য recording revisit করো।
