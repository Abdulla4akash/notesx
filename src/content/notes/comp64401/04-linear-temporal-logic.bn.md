---
subject: COMP64401
chapter: 4
title: "Linear Temporal Logic"
language: bn
---

# COMP64401 — মডিউল ৫: টেম্পোরাল লজিক্স ও LTL

**বিষয় ও পরিসর।** এই লেকচার-ব্লকটি Linear Temporal Logic (LTL)-কে এমন একটি প্রপোজিশনাল টেম্পোরাল লজিক হিসেবে পরিচয় করায়, যা অসীম টাইমলাইন ও ডাইনামিক সিস্টেম নিয়ে যুক্তি করতে ব্যবহৃত হয়। এতে LTL-এর syntax/semantics, transition systems, satisfiability/validity/model checking, satisfiability-এর জন্য tableau algorithm, এবং LTL-এর সীমাবদ্ধতা/extension/অন্য লজিকের সঙ্গে সম্পর্ক আলোচনা করা হয়েছে।

**উৎস উপকরণ।** আপলোড করা লেকচার ট্রান্সক্রিপ্ট: `5.1LTLSyntaxSemantics-English.txt`, `5.3LTLTransitionSystems-English.txt`, `5.4LTLReasoningTasks-English.txt`, `5.5LTLTableau-English.txt`, `5.6LTLLimitations-English.txt`; স্লাইড ডেক: `Week9+10 (1).pdf`।

---

## ১. টেম্পোরাল লজিক কেন?

### ১.১ রিক্যাপ: আগের লজিকগুলো static ছিল

কোর্সে আগে আলোচনা করা হয়েছে:

- propositional logic,
- description logics,
- datalog।

প্রতিটির জন্য কোর্সে syntax, semantics, reasoning tasks, entailment, algorithms, এবং reasoning tasks-গুলোর পারস্পরিক সম্পর্ক আলোচনা করা হয়েছে। এই মডিউলটির মূল প্রেরণা হলো: আগের লজিকগুলো **static**। তাদের interpretations-এর মধ্যে স্বাভাবিকভাবে “before,” “after,” “yesterday,” “tomorrow,” বা “eventually” ধরনের সময়গত ধারণা নেই।

### ১.২ সময় নিয়ে ontological পছন্দ

কোনো temporal logic বেছে নেওয়ার আগে লেকচারটি সময়কে একটি ontological modelling decision হিসেবে দাঁড় করায়। গুরুত্বপূর্ণ প্রশ্নগুলোর মধ্যে আছে:

- সময় কি **continuous** নাকি **discrete**?
- সময় কি **point-based** নাকি **interval-based**?
- সময় কি **linear**, **branching/divergent**, নাকি **cyclical**?
- সময় কি **one-directional** নাকি **two-directional**?

এই লেকচারে বেছে নেওয়া লজিক, LTL, নিচের প্রতিশ্রুতিগুলো গ্রহণ করে:

$$
\text{linear} + \text{discrete} + \text{point-based} + \text{future-only}.
$$

অর্থাৎ LTL সময়কে একটি একক অসীম time-point sequence হিসেবে model করে:

$$
0,1,2,3,\dots
$$

এটি interval, branching future, বা bidirectional time নয়।

### ১.৩ Fluid বনাম rigid statements

লেকচারটি এমন predicates/statements আলাদা করে যেগুলোর truth value সময়ের সঙ্গে বদলাতে পারে এবং যেগুলো বদলায় না।

**Fluid statements** সময়ের সঙ্গে truth value বদলাতে পারে।

উদাহরণ:

$$
Student(Momen),\quad Child(Chris),\quad isMarriedTo(Angeline,Brad).
$$

**Rigid statements** সংশ্লিষ্ট objects অস্তিত্বশীল থাকা পর্যন্ত fixed থাকে।

উদাহরণ:

$$
Person(Shakespeare),\quad isChildOf(Hamnet,Shakespeare).
$$

মূল কথা হলো actions, events, workflows, programs, বা changing systems নিয়ে knowledge representation করতে হলে সময়ের সঙ্গে পরিবর্তন represent করার উপায় দরকার। এই কোর্সে LTL সেই basic temporal logic।

---

## ২. LTL syntax

### ২.১ LTL formulae-এর formal definition

ধরা যাক $\mathcal{P}$ হলো propositional variables-এর একটি set, সাধারণত লেখা হয়:

$$
\mathcal{P}=\{p,q,r,\dots\}.
$$

$\mathcal{P}$-এর উপর LTL formulae-এর set হলো সবচেয়ে ছোট set, যাতে:

1. প্রত্যেক propositional variable $p\in\mathcal{P}$ একটি LTL formula;
2. যদি $\varphi$ এবং $\psi$ LTL formula হয়, তাহলে নিচেরগুলোও LTL formula:

$$
\neg \varphi
$$

$$
\varphi \lor \psi
$$

$$
X\varphi
$$

$$
\varphi U \psi.
$$

এখানে:

- $X\varphi$ পড়া হয় “next $\varphi$” হিসেবে;
- $\varphi U \psi$ পড়া হয় “$\varphi$ until $\psi$” হিসেবে।

Core grammar ইচ্ছাকৃতভাবে শুধু $\neg$, $\lor$, $X$, এবং $U$ ব্যবহার করে; অন্যান্য দরকারি operator পরে syntactic sugar হিসেবে আনা হয়।

### ২.২ Temporal operators-এর intuition

**Next.**

$$
X\varphi
$$

এর মানে হলো পরবর্তী time point-এ $\varphi$ সত্য।

**Until.**

$$
\varphi U \psi
$$

এর মানে হলো $\psi$ কোনো current-or-future time point-এ অবশ্যই সত্য হতে হবে, এবং তার আগে প্রতিটি time point-এ $\varphi$ সত্য থাকতে হবে। গুরুত্বপূর্ণ সূক্ষ্ম বিষয়টি হলো $\psi$ সত্যিই eventually ঘটতে হবে; শুধু $\varphi$ চিরকাল সত্য থাকলেই যথেষ্ট নয়।

### ২.৩ LTL formulae-এর উদাহরণ

লেকচারে দেওয়া উদাহরণগুলোর মধ্যে আছে:

$$
\neg(p\lor \neg p)
$$

এবং

$$
p U \bigl(q \lor X(\neg p \lor \neg q)\bigr).
$$

প্রথমটি শুধু propositional formula, কিন্তু সেটিও LTL formula হিসেবে গণ্য। কারণ LTL propositional logic-কে extend করে; তাই প্রত্যেক propositional formula একটি LTL formula।

### ২.৪ Non-examples

লেকচার এমন কিছু expression-ও দেয় যা well-formed LTL formula নয়:

$$
\neg(X \lor \neg p)
$$

এটি LTL formula নয়, কারণ $X$-কে কোনো formula-র উপর apply করতে হয়; এখানে argument ছাড়া ব্যবহার করা হয়েছে।

$$
U(q \lor X(\neg p\lor \neg q))
$$

এটিও LTL formula নয়, কারণ $U$ binary: এর বাম পাশে একটি formula এবং ডান পাশে একটি formula দরকার।

---

## ৩. LTL semantics

### ৩.১ LTL valuations

একটি LTL valuation হলো mapping:

$$
V:\mathbb{N}\to 2^{\mathcal{P}}.
$$

অর্থাৎ প্রতিটি natural number/time point $i\in\mathbb{N}$-কে propositional variables-এর একটি set assign করা হয়:

$$
V(i)\subseteq \mathcal{P}.
$$

Intuitively, $V(i)$ হলো time point $i$-তে সত্য propositional variables-এর set। তাই একটি LTL valuation হলো **propositional valuations-এর একটি infinite timeline**।

লেকচার আরও বলে যে এই time points-গুলোকে কখনও কখনও **worlds** বলা হয়, এবং LTL valuations-কে ঐতিহ্যগতভাবে **Kripke structures** বলা হয়।

**Exam flag.** লেকচারার স্পষ্ট বলেছেন, এই অংশে “Kripke structure” terminology পরীক্ষা করা হবে না। তবু vocabulary হিসেবে useful।

### ৩.২ Satisfaction relation

Satisfaction relation লেখা হয়:

$$
V,i \models \varphi.
$$

এটি পড়া যায়:

> valuation $V$-তে, world/time point $i$-তে, formula $\varphi$ সত্য।

Semantics inductively define করা হয়:

#### Atomic propositions

$$
V,i\models p \quad \text{iff} \quad p\in V(i).
$$

#### Negation

$$
V,i\models \neg\varphi \quad \text{iff not} \quad V,i\models \varphi.
$$

#### Disjunction

$$
V,i\models \varphi\lor\psi
\quad \text{iff} \quad
V,i\models\varphi \text{ or } V,i\models\psi \text{ or both}.
$$

#### Next

$$
V,i\models X\varphi
\quad \text{iff} \quad V,i+1\models \varphi.
$$

#### Until

$$
V,i\models \varphi U \psi
$$

iff এমন কোনো $j\ge i$ আছে যাতে:

$$
V,j\models \psi
$$

এবং প্রত্যেক $\ell$-এর জন্য, যেখানে

$$
i\le \ell < j,
$$

নিচেরটি সত্য:

$$
V,\ell\models \varphi.
$$

অর্থাৎ $\psi$ কোনো $j$-তে ঘটতে হবে, এবং $\varphi$ $i$ থেকে $j$-এর আগ পর্যন্ত continuous ভাবে সত্য থাকতে হবে।

### ৩.৩ Common mistake: “until” মানে “তারপর থেমে যায়” নয়

**Common mistake / high-value point.**

$$
\varphi U \psi
$$

-তে $\psi$ eventually hold করতে হবে। কিন্তু $\psi$ সত্য হওয়ার সময় $\varphi$ বন্ধ হয়ে যাবে—এমন কোনো requirement নেই। Semantics শুধু বলে: নির্বাচিত $\psi$-point-এর আগে $\varphi$ hold করতে হবে; $\varphi$ ওই point-এ বা তার পরে hold করলেও সমস্যা নেই।

---

## ৪. Syntactic sugar

লেকচার প্রথমে minimal syntax define করে, তারপর formula লেখা সহজ করতে abbreviations আনে।

### ৪.১ Conjunction, truth, falsity

Conjunction define করা হয়:

$$
\varphi \land \psi := \neg(\neg\varphi \lor \neg\psi).
$$

Truth define করা হয়:

$$
\top := p\lor \neg p.
$$

Falsity define করা হয়:

$$
\bot := p\land \neg p.
$$

এগুলো primitive syntax নয়; abbreviation।

### ৪.২ Eventually এবং globally

লেকচারে “eventually”-এর জন্য $E$ ব্যবহার করা হয়:

$$
E\varphi := \top U \varphi.
$$

এর মানে $\varphi$ কোনো current-or-future time point-এ hold করে।

লেকচারে “globally”-এর জন্য $G$ ব্যবহার করা হয়:

$$
G\varphi := \neg E\neg\varphi.
$$

এর মানে $\varphi$ future timeline-এর সর্বত্র hold করে, এখনসহ। যেহেতু LTL future-only, এখানে “globally” মানে future বরাবর globally; past অন্তর্ভুক্ত নয়।

---

## ৫. Worked semantic examples

### ৫.১ Basic valuation example

লেকচারে ব্যবহৃত একটি valuation:

$$
V(0)=\{p,q,r\}
$$

$$
V(1)=\{p,q\}
$$

$$
V(2)=\{q,r\}
$$

$$
V(3)=\emptyset
$$

$$
V(4)=\{p\}
$$

$$
V(5)=\{p,q,r\}
$$

$$
V(i)=\{q\}\quad \text{for all } i\ge 6.
$$

এখান থেকে:

$$
V,0\models p
$$

কারণ $p\in V(0)$।

$$
V,0\models q
$$

কারণ $q\in V(0)$।

$$
V,1\models \neg r
$$

কারণ $r\notin V(1)$।

$$
V,1\models \neg r\lor p
$$

কারণ time point 1-এ $\neg r$ এবং $p$ দুটোই সত্য।

$$
V,3\models Xp
$$

কারণ time point 4-এ $p$ hold করে।

$$
V,3\models XXr
$$

কারণ time point 5-এ $r$ hold করে।

### ৫.২ Until example 1

আরেকটি valuation:

$$
V(0)=\{p,q\}
$$

$$
V(1)=\{p,q\}
$$

$$
V(2)=\{q,r\}
$$

$$
V(3)=\{q\}
$$

$$
V(4)=\{p\}
$$

$$
V(5)=\{p,q,r\}
$$

$$
V(i)=\{q\}\quad \text{for all } i\ge 6.
$$

লেকচার বলে:

$$
V,0\models (p\land q)Ur.
$$

কারণ:

- $j=2$ বেছে নাও;
- $j=2$-তে $r$ hold করে;
- সব $\ell$-এর জন্য যেখানে $0\le \ell<2$, অর্থাৎ $\ell=0,1$, সেখানে $p\land q$ hold করে।

তাই until condition satisfied।

### ৫.৩ Until example 2

একই valuation ব্যবহার করে:

$$
V,0\models (q\lor r)U(p\land \neg q).
$$

কারণ:

- $j=4$ বেছে নাও;
- $j=4$-তে $p$ hold করে এবং $q$ hold করে না, তাই $p\land \neg q$ hold করে;
- time points $0,1,2,3$—সবগুলোতে $q\lor r$ hold করে।

তাই until formula time point 0-এ সত্য।

### ৫.৪ Until with bottom

লেকচার আরও দেয়:

$$
V,2\models \bot U(q\land r).
$$

কারণ:

- $j=2$ বেছে নাও;
- time point 2-এ $q\land r$ hold করে;
- এমন কোনো time point $\ell$ নেই যেখানে $2\le \ell<2$, তাই $j$-এর আগে $\bot$ hold করতে হবে—এই requirement vacuously satisfied।

এটি general point-টিও দেখায়:

$$
\bot U \varphi
$$

যখন $\varphi$ এখনই hold করে, তখন এটি $\varphi$-এর মতো আচরণ করে।

---

## ৬. Useful semantic consequences

লেকচার semantics থেকে কয়েকটি consequence দেয়।

### ৬.১ যদি $\psi$ এখন hold করে, তাহলে anything-until-$\psi$ এখন hold করে

যদি

$$
V,i\models \psi,
$$

তাহলে যেকোনো LTL formula $\varphi'$-এর জন্য:

$$
V,i\models \varphi' U \psi.
$$

Proof idea:

- $j=i$ বেছে নাও;
- তাহলে $\psi$ $j$-তে hold করে;
- এমন কোনো intermediate $\ell$ নেই যেখানে $i\le \ell<i$, তাই “$j$-এর আগে $\varphi'$” condition vacuous।

### ৬.২ Eventually মানে “কোনো future point-এ”

$$
V,i\models E\varphi
\quad \text{iff} \quad
\exists j\ge i \text{ such that } V,j\models \varphi.
$$

কারণ:

$$
E\varphi := \top U\varphi.
$$

যেহেতু $\top$ সর্বত্র hold করে, আসল condition হলো $\varphi$ কোনো $j\ge i$-তে hold করবে।

### ৬.৩ দুটি eventuality মানেই একটি combined eventuality নয়

নিচের implication সাধারণভাবে সত্য নয়:

$$
V,i\models E\varphi
\quad \text{and} \quad
V,i\models E\psi
\quad \Rightarrow \quad
V,i\models E(\varphi\land\psi).
$$

কারণ: $\varphi$ এবং $\psi$ ভবিষ্যতের আলাদা আলাদা সময়ে সত্য হতে পারে। তাদের একই সময়ে সত্য হওয়ার দরকার নেই।

লেকচার example:

$$
V,2\models E\neg p
$$

এবং

$$
V,2\models E\neg q,
$$

কিন্তু

$$
V,2\not\models E(\neg p\land \neg q).
$$

তাই “eventually not $p$” এবং “eventually not $q$” থেকে “eventually neither $p$ nor $q$” আসে না।

### ৬.৪ Until-এর গুরুত্বপূর্ণ unfolding property

লেকচার এটি বিশেষভাবে important বলে চিহ্নিত করে:

$$
V,i\models \varphi U \psi
$$

implies

$$
V,i\models \psi
$$

or

$$
V,i\models \varphi\land X(\varphi U\psi).
$$

Intuition: যদি $\varphi U\psi$ এখন hold করে, তাহলে হয় $\psi$ এখনই hold করছে, না হলে $\varphi$ এখন hold করছে এবং একই until formula পরবর্তী time point-এও hold করতে হবে।

**Exam/high-value flag.** লেকচারার বলেছেন এই consequence-টাই সবচেয়ে গুরুত্বপূর্ণ এবং পরে tableau algorithm-এ ব্যবহার করা হবে।

---

## ৭. Transition systems: LTL-এ systems describe করা

### ৭.১ Motivation

LTL শুধু arbitrary timelines নিয়ে reasoning করার জন্য নয়; বরং **dynamic systems** নিয়ে reasoning করার জন্য আনা হয়েছে, যেমন:

- algorithms,
- workflows,
- programs,
- traffic lights,
- autonomous-car abstractions।

লক্ষ্য হলো system properties describe করা, যেমন:

- safety,
- invariance,
- liveness,
- fairness।

এই properties LTL formula হিসেবে represent করা হয়, এবং systems represent করা হয় **transition systems** দিয়ে।

### ৭.২ Transition system-এর formal definition

প্রপোজিশনাল variables-এর set $\mathcal{P}$ দেওয়া থাকলে, একটি transition system হলো:

$$
\mathcal{M}=(S,\to,L,S_0)
$$

যেখানে:

- $S$ হলো states-এর non-empty finite set;
- $\to\subseteq S\times S$ হলো successor relation;
- $L:S\to 2^{\mathcal{P}}$ হলো labelling function;
- $S_0\subseteq S$ হলো start states-এর set।

Successor relation বলে কোন state-এর পরে কোন state আসতে পারে। Labelling function বলে প্রতিটি state-এ কোন propositional variables সত্য।

### ৭.৩ Traces

$\mathcal{M}$-এর একটি trace হলো infinite sequence:

$$
\sigma=s_0,s_1,s_2,\dots
$$

যাতে:

$$
s_0\in S_0,
$$

$$
s_i\in S,
$$

এবং

$$
s_i\to s_{i+1}
$$

প্রত্যেক $i$-এর জন্য।

Traces infinite, কারণ এসব system চলতেই থাকে বলে ধরা হয়; যেমন একটি traffic light system হঠাৎ থেমে যাওয়ার কথা নয়।

### ৭.৪ Trace-এর associated valuation

একটি trace দেওয়া থাকলে

$$
\sigma=s_0,s_1,s_2,\dots,
$$

associated LTL valuation $V_\sigma$ define করা হয়:

$$
V_\sigma(i)=L(s_i).
$$

অর্থাৎ একটি transition system traces generate করে, এবং প্রতিটি trace একটি LTL valuation generate করে।

### ৭.৫ Key intuition

একটি transition system **local behaviour** describe করে:

- কোন states কোন states-এর পরে আসতে পারে;
- প্রতিটি state-এ কী সত্য।

এর traces system-এর possible behaviours over time describe করে।

এর associated valuations শুধু সেই behaviours-এর propositional properties over time describe করে। State names valuation থেকে হারিয়ে যায়।

---

## ৮. Worked transition-system example: car-driving abstraction

### ৮.১ States and variables

লেকচার একটি simple car-driving example ব্যবহার করে।

States-এর মধ্যে আছে:

$$
EC=\text{enter car}
$$

$$
FSB=\text{fasten seatbelt}
$$

$$
D=\text{drive}
$$

$$
Stop=\text{stop}
$$

$$
Park=\text{park}
$$

$$
LC=\text{leave car}.
$$

Propositional variables হলো:

$$
S=\text{safe}
$$

$$
PA=\text{paying attention}.
$$

**Notation warning.** লেকচারে $S$ overloaded: একদিকে general set of states হিসেবে, অন্যদিকে propositional variable “safe” হিসেবে। State “Stop” কিছু slide/transcript passage-এ $S$ হিসেবে abbreviated। Revision-এর সময় এগুলো আলাদা রাখো।

### ৮.২ Example traces

লেকচার নিচের traces দেয়:

$$
\sigma_1=EC,FSB,D,Stop,D,Stop,D,Stop,\dots
$$

এটি বোঝায়: car-এ enter করা, seatbelt fasten করা, তারপর forever drive এবং stop-এর মধ্যে alternate করা।

$$
\sigma_2=EC,LC,EC,LC,EC,LC,\dots
$$

এটি বোঝায়: বারবার car-এ enter করা এবং leave করা।

$$
\sigma_3=EC,FSB,D,Stop,Park,LC,EC,FSB,D,Stop,Park,LC,\dots
$$

এটি তুলনামূলক sensible cycle: enter, fasten seatbelt, drive, stop, park, leave car, এবং repeat।

### ৮.৩ Associated valuations

$\sigma_1$-এর জন্য valuation:

$$
V_{\sigma_1}(0)=\{S\}
$$

$$
V_{\sigma_1}(1)=\{S\}
$$

$$
V_{\sigma_1}(2)=\{PA\}
$$

$$
V_{\sigma_1}(3)=\{S,PA\}
$$

$$
V_{\sigma_1}(4)=\{PA\}
$$

$$
V_{\sigma_1}(5)=\{S,PA\}
$$

এরপর এটি $\{PA\}$ এবং $\{S,PA\}$-এর মধ্যে alternate করে।

$\sigma_2$-এর জন্য:

$$
V_{\sigma_2}(0)=\{S\}
$$

$$
V_{\sigma_2}(1)=\{S,PA\}
$$

$$
V_{\sigma_2}(2)=\{S\}
$$

$$
V_{\sigma_2}(3)=\{S,PA\}
$$

এবং এভাবে চলতে থাকে।

$\sigma_3$-এর জন্য:

$$
V_{\sigma_3}(0)=\{S\}
$$

$$
V_{\sigma_3}(1)=\{S\}
$$

$$
V_{\sigma_3}(2)=\{PA\}
$$

$$
V_{\sigma_3}(3)=\{S,PA\}
$$

$$
V_{\sigma_3}(4)=\{S,PA\}
$$

$$
V_{\sigma_3}(5)=\{S,PA\}
$$

$$
V_{\sigma_3}(6)=\{S\}
$$

$$
V_{\sigma_3}(7)=\{S\}.
$$

### ৮.৪ Important abstraction point

Valuation ভুলে যায় proposition কেন সত্য।

যেমন, $\{S,PA\}$ দেখা যেতে পারে কারণ system “stop” state-এ আছে, অথবা কারণ system “leave car” state-এ আছে। LTL valuation-এ দুটো একইরকম: শুধু $S$ এবং $PA$ record করা হয়।

---

## ৯. LTL reasoning tasks

### ৯.১ Satisfaction at a time point

একটি LTL formula $\varphi$ এবং valuation $V$ দেওয়া থাকলে:

$$
V \text{ satisfies } \varphi \text{ at } i
$$

iff

$$
V,i\models \varphi.
$$

এটি সবচেয়ে local notion: নির্দিষ্ট একটি time point-এ truth।

### ৯.২ Satisfaction by a valuation

$$
V \text{ satisfies } \varphi
$$

iff

$$
V,0\models \varphi.
$$

অর্থাৎ valuation দ্বারা satisfaction মানে initial time point-এ truth।

### ৯.৩ Satisfiable in a valuation

$$
\varphi \text{ is satisfiable in } V
$$

iff এমন কোনো $i$ আছে যাতে:

$$
V,i\models \varphi.
$$

অর্থাৎ formula-টি ওই valuation-এর কোথাও hold করতে হবে।

### ৯.৪ Valid in a valuation

$$
\varphi \text{ is valid in } V
$$

iff প্রত্যেক $i$-এর জন্য:

$$
V,i\models \varphi.
$$

অর্থাৎ formula-টি সেই এক valuation বরাবর সর্বত্র hold করে।

### ৯.৫ Satisfiable

$$
\varphi \text{ is satisfiable}
$$

iff এমন কোনো valuation $V$ আছে যাতে:

$$
V,0\models \varphi.
$$

### ৯.৬ Valid

$$
\varphi \text{ is valid}
$$

iff প্রত্যেক valuation $V$ formula $\varphi$ satisfy করে, অর্থাৎ

$$
V,0\models \varphi
$$

প্রত্যেক $V$-এর জন্য।

**Exam/high-value distinction.** এখানে LTL validity মানে প্রতিটি valuation-এ time point $0$-এ truth, প্রতিটি time point-এ truth নয়। “Valid in $V$” হলো one-valuation-এর global notion।

---

## ১০. Worked reasoning-task examples

Car example থেকে $V_{\sigma_1}$ ব্যবহার করে:

### ১০.১ Basic satisfaction

$$
V_{\sigma_1},1\models S.
$$

Time point 1-এ valuation-এ $S$ আছে।

আরও:

$$
V_{\sigma_1}\models S
$$

কারণ time point 0-এ $S$ hold করে।

### ১০.২ Until property

$$
V_{\sigma_1}\models S U PA.
$$

শুরুতে $S$ hold করে যতক্ষণ না $PA$ hold করে। এই trace-এ $PA$ time point 2-এ hold করে, এবং তার আগে $S$ hold করে।

### ১০.৩ Global until property

প্রতিটি time point $i$-এর জন্য:

$$
V_{\sigma_1},i\models S U PA.
$$

তাই:

$$
V_{\sigma_1}\models G(S U PA).
$$

Equivalent ভাবে, $S U PA$ হলো $V_{\sigma_1}$-এ valid।

### ১০.৪ Valuation-এ valid নয় এমন formula

Formula

$$
(X\neg S)\Rightarrow PA
$$

$V_{\sigma_1}$-এ valid নয়।

কারণ time point 1-এ

$$
X\neg S
$$

hold করে, যেহেতু time point 2-এ $S$ false। কিন্তু time point 1-এ $PA$-ও false। তাই implication fail করে।

---

## ১১. Model checking

### ১১.১ Formal definition

ধরা যাক $\varphi$ একটি LTL formula এবং

$$
\mathcal{M}=(S,\to,L,S_0)
$$

একটি transition system।

আমরা বলি $\varphi$ $\mathcal{M}$-এ holds, লেখা হয়:

$$
\mathcal{M}\models \varphi,
$$

iff $\mathcal{M}$-এর প্রত্যেক trace $\sigma$-এর জন্য, এবং associated valuation $V_\sigma$-এর জন্য,

$$
V_\sigma,0\models \varphi.
$$

অর্থাৎ model checking জিজ্ঞেস করে: system-এর প্রতিটি possible run কি শুরুতে formula satisfy করে?

### ১১.২ Universal বনাম existential model checking

লেকচারের definition হলো **universal model checking**:

$$
\text{all traces must satisfy } \varphi.
$$

Existential version-ও আছে, যেখানে কোনো একটি trace $\varphi$ satisfy করলেই যথেষ্ট। লেকচার বলে existential version universal version-এর dual:

$$
\mathcal{M}\not\models \neg\varphi
$$

iff $\mathcal{M}$-এ এমন একটি trace আছে যার valuation $\varphi$ satisfy করে।

**Exam/high-value point.** এই কোর্সে model checking-এর definition universal, unless stated otherwise।

### ১১.৩ Car system থেকে model-checking examples

লেকচার দেয়:

$$
\mathcal{M}\models S.
$$

প্রতিটি trace enter-car state-এ শুরু হয়, যেখানে $S$ hold করে।

$$
\mathcal{M}\models S U PA.
$$

প্রতিটি trace শুরু হয় $S$ hold করে, যতক্ষণ না $PA$ hold করে।

$$
\mathcal{M}\models G(S U PA).
$$

প্রতিটি trace-এর প্রতিটি point-এ $S U PA$ hold করে।

কিন্তু:

$$
\mathcal{M}\not\models G((X\neg S)\Rightarrow PA).
$$

এটি fail করে কারণ system-এ এমন trace/time point আছে যেখানে next state unsafe, কিন্তু current state already paying attention নয়।

---

## ১২. System properties-এর ধরন

লেকচার LTL ব্যবহার করে express/check করা system properties সংক্ষেপে classify করে।

### ১২.১ Local properties

Local properties একটি state এবং তার next state-এর মধ্যে কী ঘটে তা নিয়ে।

Example:

$$
\mathcal{M}\models \neg S \Rightarrow XS.
$$

যদি system এখন safe না হয়, তাহলে next time point-এ safe।

### ১২.২ Safety properties

Safety properties express করে: “bad things do not happen।”

Example:

$$
\mathcal{M}\models G(\neg PA \Rightarrow S).
$$

যদি system paying attention না করে, তাহলে এটি safe।

### ১২.৩ Liveness properties

Liveness properties express করে: “good things eventually happen।”

লেকচারের car transition system কিছু natural liveness expectation satisfy করে না, কারণ এটি এমন infinite traces allow করে যেখানে system forever driving এবং stopping-এর মধ্যে cycle করে, parking বা car leave না করে।

Slides-এর examples:

$$
\mathcal{M}\not\models G(S\Rightarrow E\neg S)
$$

এবং

$$
\mathcal{M}\not\models G(\neg S\Rightarrow ES).
$$

বড় lesson: transition systems unrealistic infinite traces ধারণ করতে পারে, যদি model সেগুলো rule out না করে।

### ১২.৪ Fairness properties

Fairness properties প্রায়ই liveness properties-এর মতো। Example intuition: প্রতিটি request eventually replied হবে। লেকচার fairness mention করে completeness-এর জন্য, কিন্তু detail-এ develop করে না।

### ১২.৫ Precedence properties

Precedence properties বলে এক event আরেকটির আগে ঘটতে হবে, যেমন “road cross করার আগে left and right দেখা।”

লেকচার note করে যে এগুলো প্রায়ই past-এর দিকে তাকাতে চায়, যা plain future-only LTL সরাসরি support করে না।

---

## ১৩. Reasoning tasks-এর সম্পর্ক

### ১৩.১ Satisfiability এবং validity

Propositional logic-এর মতো:

$$
\varphi \text{ is satisfiable}
$$

iff

$$
\neg\varphi \text{ is not valid}.
$$

তাই satisfiability tester ব্যবহার করে validity tester বানানো যায়, এবং উল্টোও করা যায়।

### ১৩.২ Model checking থেকে validity-তে reduction

Transition system দেওয়া থাকলে:

$$
\mathcal{M}=(S,\to,L,s_0),
$$

লেকচার $\varphi_\mathcal{M}$ নামে একটি formula construct করে যা transition system represent করে। প্রতিটি state $s\in S$-এর জন্য নতুন propositional variable $p_s$ introduce করা হয়।

Formula-টির চারটি conceptual part আছে:

#### Initial state

$$
p_{s_0}
$$

এটি বলে system start state-এ শুরু করে।

#### প্রতিটি time point-এ exactly one state

$$
G\left(
\bigvee_{s\in S}
\left(
p_s \land \bigwedge_{s'\ne s}\neg p_{s'}
\right)
\right).
$$

এটি বলে প্রতিটি time point-এ exactly one state variable সত্য।

#### Successor relation respected

$$
G\left(
\bigwedge_{s\in S}
\left(
p_s \Rightarrow X\left(\bigvee_{s\to s'}p_{s'}\right)
\right)
\right).
$$

এটি বলে system যদি state $s$-এ থাকে, তাহলে next time point-এ $s$-এর কোনো successor state-এ থাকতে হবে।

#### State labelling respected

$$
G\left(
\bigwedge_{s\in S}
\left(
p_s \Rightarrow
\left(
\bigwedge_{p\in L(s)}p
\land
\bigwedge_{p\notin L(s)}\neg p
\right)
\right)
\right).
$$

এটি বলে system যদি state $s$-এ থাকে, তাহলে exactly $L(s)$-এর propositions সত্য।

Then:

$$
\mathcal{M}\models \psi
$$

iff

$$
\varphi_\mathcal{M}\Rightarrow \psi
$$

valid।

লেকচার বলে এটি polynomial reduction।

### ১৩.৩ Validity থেকে model checking-এ reduction

একটি formula $\psi$ যার propositional variables $\mathcal{P}_\psi$, এর জন্য একটি “universal” transition system construct করা হয়:

$$
\mathcal{M}_\psi=(S,\to,L,S)
$$

যেখানে:

$$
S:=2^{\mathcal{P}_\psi}
$$

অর্থাৎ propositional variables-এর প্রত্যেক subset একটি state;

$$
\to := S\times S
$$

অর্থাৎ প্রত্যেক state থেকে প্রত্যেক state-এ transition করা যায়;

$$
L(s):=s.
$$

তখন:

$$
\psi \text{ is valid}
$$

iff

$$
\mathcal{M}_\psi\models \psi.
$$

এই reduction polynomial নয়: $\psi$-এর propositional variables-এর সংখ্যার তুলনায় states-এর সংখ্যা exponential।

### ১৩.৪ Complexity

লেকচার বলে:

- model checking transition-system states-এর সংখ্যায় linear এবং formula size-এ exponential time-এ করা যায়;
- transition systems প্রায়ই huge, কিন্তু formulae প্রায়ই small;
- dedicated model checkers practice-এ খুব ভালো কাজ করে;
- satisfiability, validity, এবং model checking—সবগুলোর worst-case complexity PSPACE-complete।

**Exam flag.** লেকচারার স্পষ্ট বলেছেন PSPACE-completeness detail-এ test করা হবে না, কিন্তু context হিসেবে useful। এটি আগে দেখা NP-complete propositional logic problems-এর চেয়ে কঠিন।

---

## ১৪. LTL tableau algorithm for satisfiability

### ১৪.১ Propositional tableau-এর সঙ্গে সম্পর্ক

লেকচার propositional tableau algorithm remind করে:

- input negation normal form-এ;
- sets of sets of formulae-এর উপর কাজ করে;
- $\land$-rule দুই conjunct-ই add করে;
- $\lor$-rule cases-এ branch করে, প্রতিটি copy-তে একেক disjunct add করে।

LTL-এর জন্য tableau বেশি complicated, কারণ:

- আমরা negation normal form ব্যবহার করি **না**;
- শুধু disjunction নয়, আরও formula type-এর জন্য case reasoning দরকার;
- infinite timeline-এর different time points account করতে হয়।

**Exam flag.** লেকচারার বলেছেন propositional tableau মনে না থাকলে Weeks 2–3-এ ফিরে যেতে। LTL tableau বোঝার জন্য এটি prerequisite idea।

---

## ১৫. Alpha, beta, eventuality, এবং literal formulae

### ১৫.১ Alpha formulae: conjunctive behaviour

Alpha formulae conjunction-এর মতো behave করে: পুরো formula satisfy করলে সব components satisfy করতে হয়।

| Alpha formula | Components |
|---|---|
| $\neg\neg\alpha$ | $\alpha$ |
| $\alpha_1\land \alpha_2$ | $\alpha_1,\alpha_2$ |
| $\neg(\alpha_1\lor \alpha_2)$ | $\neg\alpha_1,\neg\alpha_2$ |
| $\neg X\alpha$ | $X\neg\alpha$ |
| $\neg(\varphi U\psi)$ | $\neg\psi,\ \neg\varphi\lor \neg X(\varphi U\psi)$ |

যেমন, যদি $\neg(\varphi U\psi)$ hold করে, তাহলে $\psi$ এখন hold করতে পারে না, এবং হয় $\varphi$ এখন fail করে, না হলে next point-এ until formula fail করে।

### ১৫.২ Beta formulae: disjunctive behaviour

Beta formulae disjunction-এর মতো behave করে: পুরো formula satisfy করতে অন্তত একটি component লাগবে।

| Beta formula | Components |
|---|---|
| $\alpha_1\lor \alpha_2$ | $\alpha_1,\alpha_2$ |
| $\neg(\alpha_1\land \alpha_2)$ | $\neg\alpha_1,\neg\alpha_2$ |
| $\varphi U\psi$ | $\psi,\ \varphi\land X(\varphi U\psi)$ |

Key beta case হলো:

$$
\varphi U\psi.
$$

এটি satisfy হতে পারে হয় $\psi$ এখন hold করছে বলে, অথবা $\varphi$ এখন hold করছে এবং $\varphi U\psi$ next time point-এও true থাকছে বলে।

### ১৫.৩ Eventualities

Eventualities হলো এই form-এর formulae:

$$
\varphi U\psi.
$$

এগুলো eventual satisfaction requirement impose করে: $\psi$ eventually ঘটতেই হবে। পরে bad-future elimination rule-এর জন্য এটি গুরুত্বপূর্ণ।

### ১৫.৪ Literals

Literals হলো:

$$
p
$$

এবং

$$
\neg p.
$$

### ১৫.৫ Exam flag: alpha/beta table

**Exam flag.** লেকচারার স্পষ্ট বলেছেন alpha এবং beta formulae-এর full list মুখস্থ করতে হবে না। Exam-style task-এ যদি list দরকার হয়, সেটি দেওয়া হবে। গুরুত্বপূর্ণ হলো components কীভাবে behave করে তা বোঝা।

---

## ১৬. Formula-এর closure

### ১৬.১ Intuition

Formula-এর closure-এ সেই formula নিয়ে reasoning করার জন্য relevant সব formula থাকে:

- formula নিজে;
- তার subformulae;
- single negations;
- alpha এবং beta formulae-এর components।

এটি finite এবং original formula-এর length-এর linear size।

### ১৬.২ Formal definition

ধরা যাক $\phi$ একটি LTL formula। এর closure $cl(\phi)$ হলো সবচেয়ে ছোট set যা satisfy করে:

1. $$
   \top,\phi\in cl(\phi).
   $$

2. $\phi$-এর সব subformulae $cl(\phi)$-এ আছে।

3. যদি $\phi_1\in cl(\phi)$ এবং $\phi_1$ কোনো $\neg\phi_2$ form-এর নয়, এবং এমন কোনো $\neg X\phi_2\in cl(\phi)$-এর জন্য $X\neg\phi_2$ form-এরও নয়, তাহলে:

   $$
   \neg\phi_1\in cl(\phi).
   $$

4. যদি $\phi_1\in cl(\phi)$ এবং $\phi_1$ kind $\alpha$ অথবা $\beta$ হয়, তাহলে তার components $cl(\phi)$-এ আছে।

[UNCLEAR / অস্পষ্ট] Special $X\neg\phi_2$ exception-কে ঘিরে transcript এবং slide notation dense। Operational point পরিষ্কার: closure relevant **single** negations-এর অধীনে closed, কিন্তু $p,\neg p,\neg\neg p,\dots$ ধরনের infinite chain তৈরি করে না।

---

## ১৭. Types

### ১৭.১ Intuition

একটি type হলো closure-এর একটি maximal, locally consistent set। Intuitively, একটি type বর্ণনা করে কোনো একটি world/time point-এ কী কী hold করতে পারে।

একটি type:

- alpha formulae obey করে;
- beta formulae obey করে;
- clash-free।

### ১৭.২ Formal definition

ধরা যাক $\phi$ একটি LTL formula এবং $cl(\phi)$ তার closure।

একটি set

$$
\Gamma\subseteq cl(\phi)
$$

হলো $\phi$-type iff:

1. প্রত্যেক alpha formula $\phi'$-এর জন্য:

   $$
   \phi'\in \Gamma
   $$

   iff তার দুই component-ই $\Gamma$-তে আছে।

2. প্রত্যেক beta formula $\phi'$-এর জন্য:

   $$
   \phi'\in \Gamma
   $$

   iff তার অন্তত একটি component $\Gamma$-তে আছে।

3. $\Gamma$ clash-free: এতে কোনো formula $\phi'$ এবং তার negation $\neg\phi'$ একসঙ্গে নেই।

### ১৭.৩ Lemma: worlds induce types

যদি $\psi$ একটি LTL formula, $V$ একটি valuation, এবং

$$
V,i\models \psi,
$$

তাহলে define করো:

$$
t(i):=\{\varphi\in cl(\psi)\mid V,i\models \varphi\}.
$$

Lemma বলে $t(i)$ একটি type।

Intuition: closure থেকে যেসব formula বাস্তব কোনো world-এ hold করে, সেগুলো locally consistent হতে হবে এবং alpha/beta decomposition respect করতে হবে।

### ১৭.৪ Worked type example

লেকচার একটি valuation দেয় যেখানে:

$$
V,0\models (p\lor q)U(p\land q\land r).
$$

তাহলে time 0-এর type-এ আছে:

$$
p,\ q,\ r,\ p\lor q,\ p\land q\land r,\ (p\lor q)U(p\land q\land r).
$$

এটি একটি type, কারণ until formula beta, এবং তার একটি component, namely $p\land q\land r$, এখনই hold করে।

### ১৭.৫ Next formulae local ভাবে decomposed হয় না

লেকচার stress করে যে:

$$
X\psi
$$

alpha-ও নয়, beta-ও নয়, এবং এর কোনো local components নেই। যদি $X\psi$ time $i$-তে hold করে, তাহলে $\psi$ time $i+1$-এ required, time $i$-তে নয়। তাই $\psi$ automatically current type-এ included হয় না।

---

## ১৮. একটি set-এর types compute করা

LTL formulae-এর set $M$ দেওয়া থাকলে:

$$
cl(M):=\bigcup_{\varphi\in M}cl(\varphi).
$$

$M$-এর types হলো:

$$
ts(M):=\{t\subseteq cl(M)\mid t \text{ is a type and } M\subseteq t\}.
$$

$ts(M)$ compute করতে:

1. $M$ দিয়ে শুরু করো;
2. exhaustively alpha rule apply করো;
3. exhaustively beta rule apply করো;
4. clash থাকা sets drop করো।

### ১৮.১ Alpha rule

যদি কোনো set $S$-এ alpha formula $\varphi$ থাকে কিন্তু তার দুই component না থাকে, তাহলে দুই component-ই $S$-এ add করো।

এটি propositional $\land$-rule generalise করে।

### ১৮.২ Beta rule

যদি কোনো set $S$-এ beta formula $\varphi$ থাকে কিন্তু তার কোনো component না থাকে, তাহলে $S$-কে দুই copy দিয়ে replace করো:

$$
S\cup\{\varphi_1\}
$$

এবং

$$
S\cup\{\varphi_2\},
$$

যেখানে $\varphi_1,\varphi_2$ হলো beta components।

এটি propositional $\lor$-rule generalise করে।

---

## ১৯. Pre-tableau algorithm

### ১৯.১ Input এবং initial graph

Input: একটি LTL formula $\psi$।

একটি edge-labelled graph initialise করো:

$$
G=(\{e_\psi,e_\top\},E_\lor\cup E_X,L)
$$

যেখানে:

$$
E_\lor=E_X=\emptyset,
$$

$$
L(e_\psi)=\{\psi\},
$$

$$
L(e_\top)=\{\top\}.
$$

দুই ধরনের edges আছে:

- $E_\lor$-edges, local case distinctions expand করার জন্য;
- $E_X$-edges, next-time-point requirements-এ যাওয়ার জন্য।

### ১৯.২ $\lor$-rule

যদি কোনো node $e\in V$ থাকে যাতে:

- $L(e)$ type নয়;
- $e$-এর কোনো $E_\lor$-successor নেই,

তাহলে compute করো:

$$
T_e:=ts(L(e)).
$$

প্রতিটি $t\in T_e$-এর জন্য:

- যদি আগেই এমন node $e'$ থাকে যাতে $L(e')=t$, তাহলে add করো:

  $$
  (e,e')\in E_\lor;
  $$

- অন্যথায় নতুন node $e'$ create করো, set করো:

  $$
  L(e'):=t,
  $$

  এবং add করো:

  $$
  (e,e')\in E_\lor.
  $$

এই rule সব local cases explore করা নিশ্চিত করে।

### ১৯.৩ $X$-rule

যদি কোনো node $e\in V$ থাকে যাতে:

- $L(e)$ একটি type;
- $e$-এর কোনো $E_X$-successor নেই,

তাহলে compute করো:

$$
X_e:=\{\varphi\mid X\varphi\in L(e)\}.
$$

যদি

$$
X_e=\emptyset,
$$

তাহলে add করো:

$$
(e,e_\top)\in E_X.
$$

যদি আগেই এমন node $e'$ থাকে যাতে:

$$
L(e')=X_e,
$$

তাহলে add করো:

$$
(e,e')\in E_X.
$$

অন্যথায় নতুন node $e'$ create করো, set করো:

$$
L(e'):=X_e,
$$

এবং add করো:

$$
(e,e')\in E_X.
$$

এই rule সব next-time requirements explore করা নিশ্চিত করে।

### ১৯.৪ Pre-tableau কী guarantee করে

Exhaustive application-এর পরে:

- যদি $(e,e')\in E_\lor$, তাহলে:

  $$
  L(e)\subseteq L(e');
  $$

- প্রতিটি type node-এর একটি $E_X$-successor আছে।

### ১৯.৫ Pre-tableau এখনো model নয় কেন

এখনও কিছু জিনিস ভুল হতে পারে:

1. কোনো node-এর possible type extension নাও থাকতে পারে।

   Example:

   $$
   ts(\{p\land \neg p\})=\emptyset.
   $$

2. কোনো eventuality কখনও fulfilled নাও হতে পারে।

   Example:

   $$
   pU(p\land \neg p)
   $$

   satisfy করা যায় না, কারণ $p\land\neg p$ কখনও hold করতে পারে না।

---

## ২০. Elimination algorithm

Elimination algorithm একটি pre-tableau নেয়:

$$
G=(V,E_\lor\cup E_X,L)
$$

এবং বারবার bad nodes remove করে।

### ২০.১ Non-type rule

যদি এমন node $e\in V$ থাকে যেখানে $L(e)$ type নয়, তাহলে প্রত্যেক $e_1,e_2\in V$-এর জন্য যাতে:

$$
(e_1,e)\in E_X
$$

এবং

$$
(e,e_2)\in E_\lor,
$$

add করো:

$$
(e_1,e_2)\in E_X.
$$

তারপর $e$-কে $V$ থেকে remove করো এবং incident edges remove করো।

Intuition: intermediate non-type nodes remove করে তাদের incoming $X$-predecessors সরাসরি type alternatives-এর সঙ্গে connect করা।

### ২০.২ Bad-next rule

যদি কোনো node $e\in V$-এর কোনো $E_X$-successor না থাকে, remove করো।

কারণ LTL-এ প্রতিটি time point-এর একটি next time point থাকতে হবে। যে node continue করতে পারে না, সেটি infinite timeline-এর point represent করতে পারে না।

Example problem:

$$
X(p\land \neg p)\in L(e).
$$

Next state-কে contradiction satisfy করতে হবে, তাই path fail করে।

### ২০.৩ Bad-future rule

যদি এমন node $e\in V$ থাকে যার জন্য $L(e)$-এর সব eventualities satisfy করে এমন কোনো lasso নেই, তাহলে $e$ remove করো।

একটি **lasso** হলো $e$ থেকে শুরু হওয়া eventually cyclic $X$-path। এটি finite graph ব্যবহার করে infinite path represent করে: প্রথমে finite stem ধরে এগোয়, তারপর forever loop করে।

একটি lasso $L(e)$-এর সব eventualities satisfy করে iff প্রত্যেক eventuality-এর জন্য:

$$
\varphi_1U\varphi_2\in L(e),
$$

lasso-এর কোনো node $e'$ আছে যাতে:

$$
\varphi_2\in L(e').
$$

Intuition: bad-future rule এমন nodes remove করে যেখানে একটি until formula forever postponed হয় এবং তার right-hand side কখনও ঘটে না।

---

## ২১. Tableau-এর correctness observations

ধরা যাক $G$ হলো elimination algorithm apply করার পরে result, এবং $e$ হলো $G$-এর একটি node।

লেকচার এই claims দেয়:

1. $L(e)$ একটি type।
2. $e$-এর outgoing $X$-edge আছে।
3. যদি

   $$
   X\varphi\in L(e),
   $$

   তাহলে $e$-এর প্রত্যেক $X$-successor $e'$-এর জন্য:

   $$
   \varphi\in L(e').
   $$

4. যদি

   $$
   \varphi U\psi\in L(e),
   $$

   তাহলে $e$ থেকে $X$-path দিয়ে reachable কোনো node $e'$-এর জন্য:

   $$
   \psi\in L(e').
   $$

5. $e$ থেকে $X$-path-এর nodes $e_1,e_2,\dots$ হলে, যদি

   $$
   \varphi U\psi\in L(e),
   $$

   এবং $i$ হলো minimal index যাতে:

   $$
   \psi\in L(e_i),
   $$

   তাহলে সব $j<i$-এর জন্য:

   $$
   \varphi,\ \varphi U\psi \in L(e_j).
   $$

এটি until semantics-এর সঙ্গে মেলে: $\psi$ পৌঁছানোর আগে $\varphi$ hold করতে হবে, এবং until obligation active থাকতে হবে।

[UNCLEAR / অস্পষ্ট] Transcript-এ এই পঞ্চম claim নিয়ে একটি typo mention করা হয়েছে, এবং slide wording-তেও সম্ভবত শেষে $L(e)$ আছে যেখানে $L(e_j)$ intended। উপরের corrected version-টি semantically coherent।

---

## ২২. Termination এবং satisfiability theorem

### ২২.১ Termination এবং complexity

লেকচার বলে:

- pre-tableau algorithm terminates;
- elimination algorithm terminates;
- দুটোই $|\psi|$-তে exponential time-এ carried out করা যায়।

কারণ:

- $cl(\psi)$ $|\psi|$-তে linear;
- node labels হলো $cl(\psi)$-এর unique subsets;
- এমন subsets exponentially many;
- algorithms একটি finite graph monotonically build up করে, তারপর remove করে।

### ২২.২ Satisfiability theorem

ধরা যাক $G_1$ হলো $\psi$-এর জন্য constructed pre-tableau, এবং $G_2$ হলো elimination algorithm apply করার result।

তাহলে:

$$
\psi \text{ is satisfiable}
$$

iff $G_2$-তে এমন node $e$ আছে যাতে:

$$
\psi\in L(e).
$$

Proof idea দুই দিকেই যায়:

- যদি $\psi$ satisfiable হয়, তাহলে $\psi$ satisfying একটি real valuation ব্যবহার করে suitable nodes algorithm-এ survive করে তা “watch” করা যায়;
- যদি surviving graph-এ $\psi$ থাকে, তাহলে $\psi$ satisfying valuation construct করা যায়।

### ২২.৩ Algorithm optimality

লেকচারার বলেছেন presented tableau algorithm understandable, কিন্তু space-optimal নয়। LTL satisfiability PSPACE-complete, কিন্তু এই tableau presentation exponential space ব্যবহার করে। অন্য algorithms polynomial space ব্যবহার করতে পারে।

---

## ২৩. LTL limitations

### ২৩.১ Only one future

LTL-এর একটি মাত্র linear future আছে। এটি distinguish করতে পারে না:

> এক possible tomorrow-তে আমার two breakfasts হবে

থেকে

> সব possible tomorrows-এ আমার two breakfasts হবে।

অতএব plain LTL branching possibility বনাম necessity over different possible futures express করতে পারে না।

### ২৩.২ Worlds are unstructured

প্রতিটি world propositional। LTL সরাসরি internal structure express করতে পারে না, যেমন individuals এবং relations।

লেকচার বলে LTL সরাসরি express করতে পারে না এমন example:

> আগামীকাল আমি late হব, কিন্তু আমি এমন কাউকে know করব যে late নয়।

এর জন্য objects এবং $knows(x,y)$-এর মতো binary relation দরকার, যা plain propositional LTL-এ নেই।

### ২৩.৩ Only future, no past

Plain LTL past নিয়ে কথা বলতে পারে না।

সরাসরি express করা যায় না এমন example:

> যদি গতকাল বৃষ্টি হয়ে থাকে, আমি আগামীকাল umbrella নেব।

LTL tomorrow নিয়ে কথা বলতে পারে, কিন্তু yesterday নিয়ে নয়।

### ২৩.৪ No clocks

LTL time points equidistant এবং abstract। কোনো clocks বা time measurements নেই।

তাই plain LTL naturally express করতে পারে না:

> পাঁচ মিনিটের মধ্যে কিছু ঘটে

অথবা

> কোনো event-এর আগে সর্বোচ্চ দশ সেকেন্ড যায়।

### ২৩.৫ No probabilities

সবকিছু either true or false। Plain LTL বলতে পারে না:

$$
\text{“tomorrow I will have two breakfasts with probability }83\%\text{.”}
$$

এই limitation LTL formulae এবং transition systems—দুটোর ক্ষেত্রেই প্রযোজ্য: transitions হয় থাকে নয় থাকে; তারা probability carry করে না।

---

## ২৪. LTL extensions

### ২৪.১ Branching-time logics

Several possible futures model করতে মানুষ computational tree logics ব্যবহার করে, যেমন:

- CTL,
- CTL$^*$।

এগুলো timeline-কে tree-এর মতো branch করতে দেয়, ফলে some futures-এ hold করা property এবং all futures-এ hold করা property আলাদা করা যায়।

### ২৪.২ Structured worlds সহ temporal logics

LTL-কে first-order logic বা description logics-এর সঙ্গে combine করা যায়, যাতে প্রতিটি world-এ structured interpretation থাকে। এটি individuals-এর মধ্যে relation, যেমন মানুষ অন্য মানুষকে know করে, represent করতে দেয়।

### ২৪.৩ Past modalities

LTL past operators দিয়ে extend করা যায়, যেমন:

- yesterday,
- since,
- globally in the past।

লেকচার বলে past modalities সহ LTL, past modalities ছাড়া LTL-এর মতোই expressive; কিন্তু past modalities formulae-কে বেশি readable এবং writable করে।

### ২৪.৪ Timed temporal logics

Timed extensions clocks এবং comparisons add করে, যেমন:

$$
\ge,
<,
\dots
$$

এগুলো event-এর আগে বা পরে কত সময় যায় তা নিয়ে statements express করতে দেয়।

### ২৪.৫ Probabilistic temporal logics

Probabilistic extensions probabilistic transition systems ব্যবহার করে, যা লেকচারে Markov processes হিসেবে described, এবং formula operators যেমন:

$$
P_{\ge 80\%}\varphi.
$$

এটি probability thresholds express করতে formulae-কে allow করে।

---

## ২৫. LTL এবং অন্য logics

### ২৫.১ LTL propositional logic extend করে

Temporal operators যেমন $X$, $U$, $E$, বা $G$ ছাড়া একটি LTL formula হলো শুধু propositional formula।

Semantically, LTL-এ প্রতিটি time point-এ একটি propositional valuation থাকে, তাই এটিকে propositional valuations-এর infinite timeline হিসেবে দেখা যায়।

### ২৫.২ LTL description logics এবং datalog-এর সঙ্গে orthogonal

LTL-এ আছে:

- time points/worlds;
- built-in temporal relations যেমন before/after;
- user-defined relations নেই, যেমন $hasDaughter$, $hasPart$, $likes$, বা $knows$।

Description logics এবং datalog-এ individuals এবং relations সহ structured interpretations থাকে, কিন্তু তাদের মধ্যে LTL-এর infinite timeline inherent নয়।

### ২৫.৩ Reasoning-task comparison

LTL-এর reasoning tasks আগের logics-এর মতো:

- satisfiability,
- validity।

কিন্তু time, local/global distinctions, এবং infinite timelines-এর কারণে এগুলো বেশি complex।

LTL model checking-কেও central reasoning task হিসেবে add করে।

### ২৫.৪ Big comparison table

Slide deck-এর final comparison table বলে LTL column-এ আছে:

- unary-only predicates, propositional logic-এর মতো;
- conjunction, disjunction, এবং negation;
- semantics: infinite timeline-এর প্রতিটি point-এ valuation;
- main reasoning tasks: satisfiabilities, validities, model checking;
- complexity: PSPACE-complete;
- considered algorithm: LTL tableau, no normal form;
- KR use: systems liveness/safety/etc. conditions satisfy করে কিনা test করা।

---

## ২৬. Exam flags এবং high-value points

### Must understand

- $X$ এবং $U$-এর semantics, বিশেষ করে until definition-এর exact quantifiers।
- পার্থক্যগুলো:
  - satisfaction at a time point,
  - satisfaction by a valuation,
  - satisfiable in a valuation,
  - valid in a valuation,
  - satisfiable,
  - valid।
- এই কোর্সে model checking universal: all traces formula satisfy করতে হবে।
- $\varphi U\psi$ একটি eventuality: $\psi$ অবশ্যই eventually occur করবে।
- Unfolding intuition:

  $$
  \varphi U\psi
  \Rightarrow
  \psi \lor (\varphi\land X(\varphi U\psi)).
  $$

- Transition systems traces generate করে; traces valuations generate করে।
- Valuation state names ভুলে যায় এবং শুধু propositional labels রাখে।
- Tableau-এর bad-future rule দরকার, কারণ until formula cyclic graph-এ forever postponed হতে পারে।
- Model checking অনেক সময় practically satisfiability-এর চেয়ে সহজ, কারণ এটি transition-system size-এ linear এবং formula size-এ exponential।

### Explicit “not tested / list given” flags

- Full alpha/beta formula list: lecturer বলেছেন মুখস্থ করতে বলবেন না; দরকার হলে দেওয়া হবে।
- “Kripke structure” terminology: lecturer বলেছেন test করা হবে না।
- PSPACE-completeness details: lecturer বলেছেন detail-এ test করা হবে না, যদিও context হিসেবে important।

### Practice flags

- Propositional tableau rusty হলে Weeks 2–3 revisit করো।
- খুব ছোট formula নিয়ে LTL tableau hand-work করে দেখো।
- কেন bad lasso একটি eventuality violate করে তা explain করতে পারতে হবে।
- Transition system-এর trace inspect/construct করে তার valuation derive করতে পারতে হবে।

---

## ২৭. আগের material-এর সঙ্গে connections

- **Propositional logic:** LTL syntactically এবং semantically propositional logic extend করে।
- **Propositional tableau:** LTL tableau alpha এবং beta formulae ব্যবহার করে $\land$- এবং $\lor$-rules generalise করে।
- **Description logics / datalog:** LTL orthogonal: এতে time আছে কিন্তু structured individuals/relations নেই।
- **Finite-state automata:** transition systems finite-state automata-এর কাছাকাছি, শুধু states labelled, transitions নয়।
- **KR ontological commitments:** LTL বেছে নেওয়া মানে linear, discrete, point-based, future-only time-এ commit করা।
- **System verification:** LTL safety, liveness, fairness, এবং related dynamic-system properties test করতে ব্যবহৃত হয়।

---

## ২৮. অস্পষ্ট transcript sections / যেগুলো re-listen করা দরকার

- [UNCLEAR / অস্পষ্ট] Course number transcript-এ inconsistent: “come 641,” “6441,” এবং “64401।” Slides course-টি identify করে **COMP64401 Logics for Knowledge Representation and Reasoning** হিসেবে।
- [UNCLEAR / অস্পষ্ট] Transcript phrase “has doTERRA has power to like snows” garbled। Slide/table context indicate করে examples যেমন $hasDaughter$, $hasPart$, $likes$, এবং probably $knows$।
- [UNCLEAR / অস্পষ্ট] Closure definition-এর exception involving $X\neg\phi_2$ এবং $\neg X\phi_2\in cl(\phi)$ transcript ও slide—দুটোতেই dense। Coursework-এর জন্য exact formal clause দরকার হলে closure definition অংশ re-listen করো।
- [UNCLEAR / অস্পষ্ট] Tableau correctness claim 5 সম্ভবত transcript/slide-এ typo আছে: path-এর earlier nodes-এর labels $L(e_j)$ refer করা উচিত, always $L(e)$ নয়।
- [UNCLEAR / অস্পষ্ট] Hand-drawn transition-system labels slide image-এ পড়া কঠিন, কিন্তু পরের valuation slides examples-এর labels clarify করে।
- [UNCLEAR / অস্পষ্ট] Final table-এ “lifeness/safety” দেখা যায়; এটি **liveness/safety** হিসেবে পড়তে হবে।
