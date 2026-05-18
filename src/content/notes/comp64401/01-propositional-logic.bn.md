---
subject: COMP64401
chapter: 1
title: "Propositional Logic"
language: bn
---

# COMP64401 মডিউল ২ — প্রোপোজিশনাল লজিক স্টাডি নোটস

**কোর্স:** COMP64401 Logics for Knowledge Representation and Reasoning  
**মডিউল:** Module 2 — Propositional Logic  
**ব্যবহৃত উৎস:** `Week2+3.pdf`, `2.1PropositionalLogic-English.txt`, `2.2PropositionalLogicCalculus-English.txt`

## বিষয় ও পরিসর

এই মডিউলে প্রোপোজিশনাল লজিককে জ্ঞান উপস্থাপন ও যুক্তিনির্ণয়ের জন্য ব্যবহৃত মৌলিক Boolean logic হিসেবে পরিচয় করানো হয়েছে। এতে syntax, semantics, satisfiability, validity, equivalence, entailment, tableau-ভিত্তিক SAT algorithm, এবং KR applications-এ reasoning task কীভাবে কাজে লাগে—এসব আলোচনা করা হয়েছে।

আপলোড করা উপকরণে দুটি transcript file এবং Week 2+3 slide deck আছে। Sections 2.6–2.7 মূলত slides-এ আছে, তাই ওই অংশগুলোর নোট প্রধানত slide content-এর ওপর ভিত্তি করে তৈরি।

---

# ১. সংগঠন ও পড়াশোনার পদ্ধতি

লেকচারের শুরুতে course unit কীভাবে পড়তে হবে সে বিষয়ে একটি reminder দেওয়া হয়েছে:

- ভিডিওগুলো সক্রিয়ভাবে দেখো।
- ভিডিও দেখার সময় নোট নাও।
- পরে ধারণাগুলো নিয়ে পড়াশোনা করো।
- workshops-এ প্রশ্ন নিয়ে যাও।
- workshops-এ ছোট task করে দেখা, প্রশ্ন করা, উত্তর দেওয়া, এবং আলোচনা করার সুযোগ ব্যবহার করো।
- coursework-এ কাজ করো এবং labs/GTAs থেকে feedback নাও।
- quizzes দিয়ে নিজের বোঝাপড়া পরীক্ষা করো এবং immediate feedback কাজে লাগাও।

**পরীক্ষা-ফ্ল্যাগ / উচ্চ-মূল্যের study habit:** lecturer বারবার জোর দিয়েছেন যে technical terms, definitions, examples, lemmas, এবং theorems এই course-এর মেরুদণ্ড। semester-এর শুরুতেই glossary, mind map, বা বড় visual summary শুরু করে semester জুড়ে সেটি বাড়াতে বলা হয়েছে। এটি revision-এর জন্য explicitly recommended.

---

# ২. Propositional logic: syntax

## ২.১ Propositional logic কী

Propositional logic একটি basic logic হিসেবে পরিচিত, যাকে **Boolean logic**-ও বলা হয়। lecturer ধরে নিয়েছেন যে অনেক শিক্ষার্থী আগে এটি দেখেছে, কিন্তু সতর্ক করেছেন যে বিভিন্ন textbook বা আগের course-এ syntax কিছুটা ভিন্নভাবে define করা হতে পারে। তাই এই course-এ ব্যবহৃত exact definitions-ই reference point.

## ২.২ Propositional variables

**Intuition:** propositional variables হলো atomic statements, যাদের truth value হতে পারে 0/false বা 1/true।

**Notation:**

$$
\mathcal{P} = \{p, q, r, \ldots\}
$$

Set $\mathcal{P}$ propositional variables ধারণ করে। variables সাধারণত lowercase letters যেমন $p,q,r$ দিয়ে লেখা হয়, এবং subscript-ও থাকতে পারে, যেমন $p_i$।

## ২.৩ Propositional formulae

**Formal definition:** $\mathcal{P}$-এর ওপর propositional formulae-এর set হলো সবচেয়ে **smallest** set যাতে:

1. প্রতিটি propositional variable $p \in \mathcal{P}$ একটি propositional formula।
2. যদি $\varphi$ এবং $\psi$ propositional formulae হয়, তাহলে নিচেরগুলিও propositional formulae:

$$
\neg \varphi
$$

$$
\varphi \land \psi
$$

$$
\varphi \lor \psi
$$

Precedence পরিষ্কার করতে parentheses ব্যবহার করা হয়।

**Intuition:** syntax বলে কোন expression ভাষার মধ্যে legal বা validভাবে লেখা যায়। এটি এখনো expression-এর অর্থ বলে না।

## ২.৪ Symbol পড়ার নিয়ম

lecturer explicitly থেমে নিশ্চিত করেছেন যেন notation উচ্চস্বরে বা মনে মনে পড়া যায়:

$$
\neg \varphi
$$

পড়া হয় “not $\varphi$”।

$$
\varphi \land \psi
$$

পড়া হয় “$\varphi$ and $\psi$”।

$$
\varphi \lor \psi
$$

পড়া হয় “$\varphi$ or $\psi$”।

যেসব Greek letters ঘনঘন ব্যবহৃত হয়:

$$
\varphi \quad \text{phi}
$$

$$
\psi \quad \text{psi}
$$

[UNCLEAR] transcript-এ $\psi$ অনেক সময় “CI”, “Cy”, বা অনুরূপ auto-transcription error হিসেবে এসেছে। এই নোটে $\psi$ ব্যবহার করা হয়েছে।

## ২.৫ Inductive definitions

এই syntax definition একটি **inductive definition**: এটি ছোট formulae থেকে বড় formulae তৈরি করে।

**smallest** শব্দটি গুরুত্বপূর্ণ। এটি arbitrary extra expressions-কে formula হিসেবে গণ্য করা থেকে আটকায়। কেবল definition-এর rules দিয়ে generate করা expressions-ই formulae।

**পরীক্ষা-ফ্ল্যাগ / common mistake:** কোনো expression logical দেখালেই সেটি propositional formula ধরে নিও না। সেটি syntax rules দিয়ে generate করা হতে হবে।

## ২.৬ Syntax examples

নিচেরটি propositional formula:

$$
(p \land q) \lor \neg(q \lor r)
$$

এটি variables, conjunction, disjunction, negation, এবং parentheses দিয়ে তৈরি।

নিচেরটি basic syntax অনুযায়ী **এখনো** propositional formula নয়:

$$
p \Rightarrow q
$$

কারণ: implication $\Rightarrow$ এখনো primitive syntax operator হিসেবে include করা হয়নি।

নিচেরটিও propositional formula নয়:

$$
\forall x .\ p(x) \land q(x)
$$

কারণ: এটি quantification এবং predicates ব্যবহার করে, যা এখানে define করা propositional logic-এর অংশ নয়।

---

# ৩. Meta-observation: definitions কেন গুরুত্বপূর্ণ

একটি **definition** কোনো technical term-এর meaning fix করে। lecturer জোর দিয়েছেন যে course-এর বাকি অংশ বোঝার জন্য technical terms বোঝা essential। Definitions আমাদের examples সঠিকভাবে classify করতে দেয়: formula বনাম non-formula, satisfiable বনাম unsatisfiable, valid বনাম not valid, ইত্যাদি।

কোনো definition বোঝার recommended পদ্ধতি:

1. examples work through করা।
2. definition মনোযোগ দিয়ে আবার পড়া।
3. আরও examples work through করা।
4. confusion থাকলে প্রশ্ন করা।

lecture-এ এটি Bloom’s taxonomy-এর সঙ্গে যুক্ত করা হয়েছে: applying, analysing, evaluating, creating-এর মতো higher-level tasks basic terms and concepts জানা ও বোঝার ওপর নির্ভর করে।

**পরীক্ষা-ফ্ল্যাগ:** lecturer explicitly বলেছেন যে basic terminology বোঝা বাকি সবকিছুর ভিত্তি। Definitions শুধু decorative নয়; এগুলো operational tools.

---

# ৪. Propositional logic: semantics

## ৪.১ Syntax বনাম semantics

**Syntax** বলে কী legalভাবে লেখা যায়।

**Semantics** formulae-কে meaning দেয়।

Propositional logic-এর semantics দেওয়া হয় **valuations** ব্যবহার করে।

## ৪.২ Valuation

**Intuition:** একটি valuation প্রতিটি propositional variable-কে একটি truth value assign করে।

**Formal definition:** একটি valuation হলো mapping

$$
v : \mathcal{P} \to \{0,1\}
$$

যেখানে:

$$
0 = \text{false}
$$

$$
1 = \text{true}
$$

[UNCLEAR] transcript-এর এক জায়গায় “the set containing just the numbers one and two” বলা হয়েছে, কিন্তু slides এবং পরের explanation-এ পরিষ্কারভাবে $\{0,1\}$ ব্যবহার করা হয়েছে। এই নোটে slide definition ব্যবহার করা হয়েছে।

## ৪.৩ Variables থেকে formulae-তে valuations extend করা

Valuation প্রথমে propositional variables-এর ওপর define করা হয়। এরপর inductively সব formulae-তে extend করা হয়:

$$
v(\neg \varphi) := 1 - v(\varphi)
$$

$$
v(\varphi \land \psi) := v(\varphi) \cdot v(\psi)
$$

$$
v(\varphi \lor \psi) := \max(v(\varphi), v(\psi))
$$

সুতরাং:

- Negation 0-কে 1 এবং 1-কে 0 করে।
- Conjunction হলো multiplication: দুপাশ 1 হলেই শুধু result 1।
- Disjunction হলো maximum: অন্তত এক পাশ 1 হলেই result 1।

## ৪.৪ Formula true বা false করা

একটি valuation $v$ **$\varphi$-কে true করে** যদি:

$$
v(\varphi)=1
$$

একটি valuation $v$ **$\varphi$-কে false করে** যদি:

$$
v(\varphi)=0
$$

lecturer বলেছেন, full semantics-এর জন্য valuation প্রতিটি propositional variable-কে value assign করে। পরে algorithmic work-এ partial valuations আসতে পারে, কিন্তু এখানে semantic definition full valuations ব্যবহার করে।

---

# ৫. Worked example: valuation দিয়ে formula evaluate করা

Formula:

$$
(p \land q) \lor \neg(q \lor r)
$$

Valuation নাও:

$$
v(p)=v(q)=v(r)=1
$$

Subformulae evaluate করো:

$$
v(q \lor r)=\max(v(q),v(r))=\max(1,1)=1
$$

$$
v(\neg(q \lor r))=1-v(q \lor r)=1-1=0
$$

$$
v(p \land q)=v(p)\cdot v(q)=1\cdot 1=1
$$

তাই:

$$
v((p \land q) \lor \neg(q \lor r))
=
\max(1,0)
=
1
$$

অতএব এই valuation পুরো formula-কে true করে।

lecturer আরও একটি দ্রুত “formula-তে values substitute করা” view দিয়েছেন:

$$
(p \land q) \lor \neg(q \lor r)
$$

হয়ে যায়:

$$
(1 \land 1) \lor \neg(1 \lor 1)
$$

তারপর:

$$
1 \lor \neg 1
$$

$$
1 \lor 0
$$

$$
1
$$

lecturer বলেন যে এই formula-র ক্ষেত্রে $p$ এবং $q$ true জানা থাকলেই পুরো formula true করার জন্য যথেষ্ট; তখন $r$-এর value আর matter করে না।

---

# ৬. Truth tables

## ৬.১ Definition এবং purpose

Truth table একটি formula-র valuations সংক্ষেপে দেখায়।

Standard structure:

- প্রতি valuation-এর জন্য এক row।
- প্রতি subformula-এর জন্য এক column।

$n$ propositional variables-সহ formula-র truth table-এ থাকে:

$$
2^n
$$

rows.

## ৬.২ Truth table for $(p \land q) \lor \neg(q \lor r)$

| $p$ | $q$ | $r$ | $p \land q$ | $q \lor r$ | $\neg(q \lor r)$ | $(p \land q) \lor \neg(q \lor r)$ |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 1 | 1 | 1 | 1 | 0 | 1 |
| 1 | 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 1 | 0 | 1 | 0 | 0 |
| 1 | 0 | 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 0 | 1 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 | 0 | 0 |
| 0 | 0 | 0 | 0 | 0 | 1 | 1 |

Conclusion:

- Formula **satisfiable**, কারণ কিছু row 1 evaluate করে।
- Formula **not valid**, কারণ কিছু row 0 evaluate করে।

Slide page 17-এ এটিই highlight করা হয়েছে: final column-এ 1 এবং 0 দুটোই আছে, তাই formula satisfiable কিন্তু valid নয়।

---

# ৭. Reasoning tasks

## ৭.১ Satisfiability

**Intuition:** কোনো formula satisfiable যদি অন্তত একটি valuation সেটিকে true করতে পারে।

**Formal definition:**

Propositional formula $\varphi$ **satisfiable** iff এমন একটি valuation $v$ আছে যাতে:

$$
v(\varphi)=1
$$

এটি existential condition.

## ৭.২ Validity

**Intuition:** কোনো formula valid যদি সেটি প্রত্যেক valuation-এর অধীনে true হয়।

**Formal definition:**

Propositional formula $\varphi$ **valid** iff সব valuations $v$-এর জন্য:

$$
v(\varphi)=1
$$

Valid formulae-কে **tautologies**-ও বলা হয়।

**পরীক্ষা-ফ্ল্যাগ / common mistake:** satisfiable মানে “অন্তত একটি valuation-এ true”; valid মানে “প্রতিটি valuation-এ true”। lecturer এখানে existential বনাম universal quantification explicitly contrast করেছেন।

## ৭.৩ Equivalence

**Intuition:** দুটি formula equivalent যদি তারা সবসময় একই truth value পায়, যদিও তারা লিখতে আলাদা হতে পারে।

**Formal definition:**

Propositional formulae $\varphi,\psi$ given, তারা **equivalent**, লেখা হয়:

$$
\varphi \equiv \psi
$$

iff সব valuations $v$-এর জন্য:

$$
v(\varphi)=v(\psi)
$$

lecturer জোর দিয়েছেন যে equivalence syntactic identity নয়। যেমন, $A \land B$ এবং $B \land A$ literally একই string নয়, কিন্তু তারা equivalent.

## ৭.৪ Entailment

**Intuition:** $\varphi$ entails $\psi$ যদি প্রত্যেক valuation যা $\varphi$-কে true করে, সেটি $\psi$-কেও true করে।

**Lecture-এ ব্যবহৃত formal definition:**

$$
\varphi \to \psi
$$

iff সব valuations $v$-এর জন্য:

$$
v(\varphi) \leq v(\psi)
$$

Truth values 0 এবং 1 হওয়ায় এটি ঠিক সেই counterexample case বাদ দেয়:

$$
v(\varphi)=1,\quad v(\psi)=0
$$

[UNCLEAR] entailment-এর possible truth-value cases নিয়ে transcript-এর wording garbled। Formal inequality $v(\varphi)\leq v(\psi)$ slide থেকে reliable definition.

---

# ৮. Useful equivalences এবং shortcuts

## ৮.১ De Morgan-style equivalences

Lecture-এ এই examples দেওয়া হয়েছে:

$$
\varphi \land \psi \equiv \neg(\neg \varphi \lor \neg \psi)
$$

$$
\varphi \lor \psi \equiv \neg(\neg \varphi \land \neg \psi)
$$

$$
\neg\neg\varphi \equiv \varphi
$$

পরে formulae-কে negation normal form-এ transform করার সময় এগুলো ব্যবহার করা হয়।

[UNCLEAR] transcript-এর এক জায়গায় “not not phi is equivalent to zero” এসেছে, কিন্তু slide এবং surrounding explanation standard equivalence $\neg\neg\varphi \equiv \varphi$ দেয়।

## ৮.২ Syntactic sugar

Primitive syntax-এ কেবল আছে:

$$
\neg,\quad \land,\quad \lor
$$

অন্য operators convenience-এর জন্য define করা যায়।

Implication:

$$
\varphi \Rightarrow \psi := \neg\varphi \lor \psi
$$

Biconditional:

$$
\varphi \Leftrightarrow \psi := (\varphi \Rightarrow \psi) \land (\psi \Rightarrow \varphi)
$$

Lecture-এ আরও বলা হয়েছে যে $\land$ এবং $\lor$ দুটোই strictly দরকার নেই, কারণ negation plus অন্য operator দিয়ে একটি operator define করা যায়।

**পরীক্ষা-ফ্ল্যাগ / common mistake:** semantic entailment relation $\varphi \to \psi$ এবং object-language implication formula $\varphi \Rightarrow \psi$ আলাদা করে বুঝতে হবে। Lecture দুটোই ব্যবহার করে।

---

# ৯. KR&R-এ satisfiability এবং validity কেন গুরুত্বপূর্ণ

ধরা যাক $\varphi$ একটি system describe করছে।

## ৯.১ System descriptions satisfiable কিন্তু not valid হওয়া উচিত

একটি ভালো system description হওয়া উচিত:

$$
\text{satisfiable}
$$

কারণ নইলে সেটি self-contradictory।

এটি আরও হওয়া উচিত:

$$
\text{not valid}
$$

কারণ valid হলে সেটি কিছু constrain করে না। সেটি প্রতিটি valuation-এর অধীনে true হবে, ফলে meaningful restricted system describe করবে না।

Slide-এর bicycle example এটি বোঝায়: system description unsatisfiable হলে কিছুই bicycle হতে পারবে না; valid হলে সবকিছুই bicycle হয়ে যাবে।

## ৯.২ Desirable properties

যদি $\psi$ system-এর desirable property হয়, তাহলে system description সেটিকে entail করা উচিত:

$$
\varphi \to \psi
$$

Equivalently, implication formula valid হওয়া উচিত:

$$
\varphi \Rightarrow \psi
$$

Slide example:

$$
\varphi \to \text{SafeRide}
$$

Idea: system description satisfy করা প্রতিটি model/valuation desirable property-ও satisfy করবে।

## ৯.৩ Undesirable properties

যদি $\psi$ undesirable property হয়, তাহলে system description-এর সঙ্গে সেই property-এর conjunction unsatisfiable হওয়া উচিত:

$$
\varphi \land \psi
$$

unsatisfiable হওয়া উচিত।

Slide example:

$$
\varphi \land \text{RiskOfDeath}
$$

অসম্ভব হওয়া উচিত।

---

# ১০. Reasoners এবং reasoning tasks-এর সম্পর্ক

## ১০.১ Reasoner

একটি **reasoner** হলো software-এর piece যা reasoning task solve করে।

Examples:

- SAT solver: input $\varphi$, output satisfiability-এর জন্য yes/no।
- Validity solver: input $\varphi$, output validity-এর জন্য yes/no।
- Entailment solver: input $\varphi,\psi$, output $\varphi \to \psi$ কিনা তার yes/no।

## ১০.২ চারটি reasoner দরকার?

না। Lecture বলেছে একটি reasoner build করলেই যথেষ্ট, কারণ reasoning tasks একে অপরের মধ্যে reduce করা যায়।

## ১০.৩ Theorem: reasoning tasks-এর সম্পর্ক

ধরা যাক $\varphi,\psi$ propositional formulae। তাহলে:

1. $\varphi$ valid iff $\neg\varphi$ satisfiable নয়।

$$
\varphi \text{ valid}
\quad \Longleftrightarrow \quad
\neg\varphi \text{ not satisfiable}
$$

2. $\varphi$ satisfiable iff $\neg\varphi$ valid নয়।

$$
\varphi \text{ satisfiable}
\quad \Longleftrightarrow \quad
\neg\varphi \text{ not valid}
$$

3. $\varphi \to \psi$ iff $\varphi \Rightarrow \psi$ valid।

$$
\varphi \to \psi
\quad \Longleftrightarrow \quad
\varphi \Rightarrow \psi \text{ valid}
$$

4. $\varphi \to \psi$ iff $\varphi \land \neg\psi$ satisfiable নয়।

$$
\varphi \to \psi
\quad \Longleftrightarrow \quad
\varphi \land \neg\psi \text{ not satisfiable}
$$

Slide page 27 দেখিয়েছে কীভাবে একটি SAT solver থেকে multiple reasoners build করা যায়, যেমন input negate করে এবং yes/no answer swap করে validity checker পাওয়া যায়।

## ১০.৪ SAT solver থেকে reasoners build করা

### Satisfiability দিয়ে validity

$\varphi$ valid কিনা decide করতে:

1. SAT solver-কে জিজ্ঞেস করো $\neg\varphi$ satisfiable কিনা।
2. SAT যদি yes বলে, তাহলে $\varphi$ not valid।
3. SAT যদি no বলে, তাহলে $\varphi$ valid।

### Satisfiability দিয়ে entailment

নিচেরটি decide করতে:

$$
\varphi \to \psi
$$

check করো:

$$
\varphi \land \neg\psi
$$

satisfiable কিনা।

- যদি $\varphi \land \neg\psi$ satisfiable হয়, তাহলে counterexample valuation আছে: $\varphi$ true এবং $\psi$ false। তাই entailment fails।
- যদি $\varphi \land \neg\psi$ unsatisfiable হয়, counterexample নেই। তাই entailment holds।

**পরীক্ষা-ফ্ল্যাগ:** এই reduction lecture-এর সবচেয়ে গুরুত্বপূর্ণ technical moves-এর একটি। এর মাধ্যমেই এক SAT solver দিয়ে validity এবং entailment checking support করা যায়।

---

# ১১. Truth tables reasoning method হিসেবে — এবং কেন scale করে না

Truth table valuations enumerate করে satisfiability, validity, equivalence, এবং entailment decide করতে পারে।

$n$ variables-সহ formula-র জন্য:

$$
\text{number of rows} = 2^n
$$

Example:

$$
n=10
$$

দেয়:

$$
2^{10}=1024
$$

rows.

lecturer বলেছেন যে real system descriptions, যেমন chip designs, hundreds of thousands variables রাখতে পারে; truth tables তখন infeasible।

**পরীক্ষা-ফ্ল্যাগ / common mistake:** truth tables conceptually useful, কিন্তু বড় KR&R applications-এর জন্য practical reasoning method নয়। Lecture calculi-তে যায় কারণ truth tables construction অনুযায়ীই exponentially large।

---

# ১২. Summary so far

প্রথম propositional logic অংশের শেষে lecture covered করেছে:

- Syntax: formula কী।
- Semantics: valuations এবং truth/falsity।
- Reasoning tasks: satisfiability, validity, equivalence, entailment।
- KR&R-এর জন্য reasoning tasks কেন matter করে।
- Technical terms এবং definitions।
- Lemmas এবং theorems concept নিয়ে claims হিসেবে।
- Examples concepts বোঝার উপায় হিসেবে।

lecturer এই পর্যায়ে glossary বা mind map শুরু করার পরামর্শ দিয়েছেন। Slide page 31-এ KR&R, logics, syntax, semantics, valuations, reasoning tasks, এবং related terms যুক্ত করা হাতে আঁকা mind-map-style diagram দেখানো হয়েছে।

---

# ১৩. Propositional logic-এর জন্য calculus

## ১৩.১ Goal

Module-এর দ্বিতীয় অংশে propositional logic formulae-এর satisfiability decide করার calculus/algorithm introduce করা হয়েছে।

Goal হলো truth tables ছাড়িয়ে আরও goal-directed algorithm-এ যাওয়া, যা reasoner বা SAT solver-এর basis হিসেবে কাজ করতে পারে।

## ১৩.২ Tableau algorithm / analytical tableau

Algorithm-এর নাম:

- **tableau algorithm**
- **analytical tableau**

**Intuition:** $\varphi$ satisfiable কিনা test করতে:

1. $\varphi$ এবং তার subformulae ভেঙে দেখা।
2. Disjunctions তৈরি করা choices explore করা।
3. $\varphi$ true করে এমন valuation খোঁজার চেষ্টা করা।

lecture এটিকে disjunctions-এর জন্য reasoning by cases হিসেবে describe করেছে।

Tableau methods প্রায়ই trees ব্যবহার করে present করা হয়, কিন্তু এই lecture প্রথমে algorithm-টি **sets of formulae** দিয়ে present করে:

- $\mathcal{S}$ হলো sets of formulae-এর set।
- প্রতিটি $S \in \mathcal{S}$ input formula true করতে পারে এমন একটি possible valuation/path represent করে।
- Rules এই sets manipulate করে।

---

# ১৪. Negation Normal Form

## ১৪.১ Definition

একটি formula **Negation Normal Form** — NNF — এ আছে iff negation কেবল propositional variables-এর সামনে ঘটে।

NNF-এর example:

$$
\neg p \land q
$$

NNF নয় এমন example:

$$
\neg(p \land q)
$$

কারণ negation complex formula-র সামনে আছে, directly variable-এর সামনে নয়।

## ১৪.২ NNF কেন ব্যবহার করি

Input formula প্রথমে NNF-এ transform করলে tableau algorithm সহজ হয়। Lecture assume করে শুধু operators:

$$
\land,\quad \lor,\quad \neg
$$

তারপর negations inward push করা হয়। $\land$ এবং $\lor$ দুটোই available থাকলে De Morgan-style rules দিয়ে transformation convenient হয়।

## ১৪.৩ NNF rewrite rules

Negation inward push করতে:

$$
\neg(\varphi_1 \land \varphi_2)
\rightsquigarrow
\neg\varphi_1 \lor \neg\varphi_2
$$

$$
\neg(\varphi_1 \lor \varphi_2)
\rightsquigarrow
\neg\varphi_1 \land \neg\varphi_2
$$

$$
\neg\neg\varphi
\rightsquigarrow
\varphi
$$

এই rules exhaustively apply করো, যতক্ষণ আর কোনো rule apply না হয়।

## ১৪.৪ Lemma: NNF transformation

Lecture lemma states:

উপরের rewriting steps exhaustively apply করলে প্রতিটি propositional formula এমন এক formula-তে transform হয় যা:

1. original formula-এর equivalent; এবং
2. NNF-এ আছে।

Transcript আরও notes করে যে এই transformation formula size blow up করে না; resulting formula original formula-এর size-এর linear।

---

# ১৫. Worked example: NNF-এ convert করা

Start with:

$$
\neg(\neg(p \land \neg(q \land r)) \lor q)
$$

Outer negated disjunction-এ De Morgan apply করো:

$$
\rightsquigarrow
\neg\neg(p \land \neg(q \land r)) \land \neg q
$$

Double negation eliminate করো:

$$
\rightsquigarrow
(p \land \neg(q \land r)) \land \neg q
$$

$(q \land r)$-এর মধ্যে negation push করো:

$$
\rightsquigarrow
(p \land (\neg q \lor \neg r)) \land \neg q
$$

Final formula:

$$
(p \land (\neg q \lor \neg r)) \land \neg q
$$

এটি NNF-এ আছে এবং original formula-এর equivalent।

---

# ১৬. PL satisfiability-এর tableau algorithm

## ১৬.১ Input এবং output

Input:

$$
\varphi
$$

যেখানে $\varphi$ NNF-এ থাকা propositional formula।

Output:

- $\varphi$ satisfiable হলে “yes”।
- অন্যথায় “no”।

## ১৬.২ Initialisation

Sets of formulae-এর একটি set initialise করো:

$$
\mathcal{S} := \{\{\varphi\}\}
$$

Double braces গুরুত্বপূর্ণ:

- $\{\varphi\}$ হলো formula ধারণকারী একটি set।
- $\{\{\varphi\}\}$ হলো সেই set ধারণকারী আরেকটি set।

## ১৬.৩ $\land$-rule

যদি কোনো $S \in \mathcal{S}$ থাকে যাতে:

$$
\varphi_1 \land \varphi_2 \in S
$$

কিন্তু:

$$
\{\varphi_1,\varphi_2\} \nsubseteq S
$$

তাহলে দুটো conjunct-ই $S$-এ add করো:

$$
S := S \cup \{\varphi_1,\varphi_2\}
$$

**Intuition:** conjunction true করতে দুটো conjunct-ই true হতে হবে।

## ১৬.৪ $\lor$-rule

যদি কোনো $S \in \mathcal{S}$ থাকে যাতে:

$$
\varphi_1 \lor \varphi_2 \in S
$$

কিন্তু:

$$
\{\varphi_1,\varphi_2\} \cap S = \emptyset
$$

তাহলে $S$-কে replace করো দুটি alternatives দিয়ে:

$$
S \cup \{\varphi_1\}
$$

এবং:

$$
S \cup \{\varphi_2\}
$$

**Intuition:** disjunction true করতে অন্তত একটি disjunct true হলেই যথেষ্ট। Algorithm তাই cases-এ branch করে।

## ১৬.৫ Clash এবং clash-free sets

Set $S$-এ **clash** আছে iff কোনো propositional variable $p$-এর জন্য:

$$
\{p,\neg p\} \subseteq S
$$

Set clash-free iff তাতে clash নেই।

Clash হলো obvious inconsistency: valuation একই সঙ্গে $p$ এবং $\neg p$ true করতে পারে না।

## ১৬.৬ Stopping condition এবং output

আর কোনো rules apply না হওয়া পর্যন্ত $\land$- এবং $\lor$-rules apply করো।

তারপর:

- $\mathcal{S}$-এ অন্তত একটি clash-free set থাকলে “yes” return করো।
- অন্যথায় “no” return করো।

**পরীক্ষা-ফ্ল্যাগ:** return condition existential: satisfiability-এর জন্য একটি final clash-free set-ই যথেষ্ট।

---

# ১৭. Worked example: tableau algorithm

Input:

$$
\varphi = (p \land (\neg q \lor \neg r)) \land \neg s
$$

এটি already NNF-এ আছে।

[UNCLEAR] এই example-এর slide/transcript কিছুটা inconsistent: initial input-এ $\neg s$ আছে, কিন্তু কিছু displayed copied sets-এ top formula-তে $\neg q$ দেখা যায়। Valuation examples-এও $s$ mention আছে। এই notes initial formula $(p \land (\neg q \lor \neg r)) \land \neg s$ ব্যবহার করে।

## Step 1: initialise

$$
\mathcal{S}
=
\left\{
\left\{
(p \land (\neg q \lor \neg r)) \land \neg s
\right\}
\right\}
$$

## Step 2: top-level conjunction-এ $\land$-rule apply করো

Add করো:

$$
p \land (\neg q \lor \neg r)
$$

এবং:

$$
\neg s
$$

তাই:

$$
\mathcal{S}
=
\left\{
\left\{
\varphi,\ 
p \land (\neg q \lor \neg r),\
\neg s
\right\}
\right\}
$$

## Step 3: আবার $\land$-rule apply করো

Break down করো:

$$
p \land (\neg q \lor \neg r)
$$

Add করো:

$$
p
$$

এবং:

$$
\neg q \lor \neg r
$$

তাই:

$$
\mathcal{S}
=
\left\{
\left\{
\varphi,\
p \land (\neg q \lor \neg r),\
\neg s,\
p,\
\neg q \lor \neg r
\right\}
\right\}
$$

## Step 4: $\lor$-rule apply করো

এর জন্য:

$$
\neg q \lor \neg r
$$

দুটি set-এ split করো।

First set:

$$
S_1 =
\{
\varphi,\
p \land (\neg q \lor \neg r),\
\neg s,\
p,\
\neg q \lor \neg r,\
\neg q
\}
$$

Second set:

$$
S_2 =
\{
\varphi,\
p \land (\neg q \lor \neg r),\
\neg s,\
p,\
\neg q \lor \neg r,\
\neg r
\}
$$

তাই:

$$
\mathcal{S}=\{S_1,S_2\}
$$

## Step 5: clashes check করো

$S_1$ এবং $S_2$ দুটোই clash-free।

তাই algorithm return করে:

$$
\text{yes}
$$

Input formula satisfiable।

## Branches থেকে valuations extract করা

$S_1$ থেকে:

$$
v(p)=1,\quad v(q)=0,\quad v(s)=0
$$

$r$-এর value matter করে না।

$S_2$ থেকে:

$$
v(p)=1,\quad v(r)=0,\quad v(s)=0
$$

$q$-এর value matter করে না।

প্রতিটি clash-free set এমন valuation দেয় যা input formula-কে true করে।

---

# ১৮. Tableau-এর alternative tree view

Set-of-sets presentation formally define করা সহজ, কিন্তু lecturer বলেন এতে অনেক redundancy আছে এবং এটি slow/wasteful।

Tree view shared parts duplicate করা এড়ায়। Tree-তে:

- $\land$-rules current branch extend করে।
- $\lor$-rules branch split করে।
- প্রতিটি full branch $\mathcal{S}$-এর একটি set $S$-এর সঙ্গে correspond করে।

Example:

$$
(p \land (\neg q \lor \neg r)) \land \neg s
$$

shared part of branch contains:

$$
p \land (\neg q \lor \neg r),\quad \neg s,\quad p,\quad \neg q \lor \neg r
$$

তারপর $\lor$-rule branch করে:

$$
\neg q
$$

অথবা:

$$
\neg r
$$

Slide pages 42–43 এই tree-style view illustrate করে এবং explicitly notes করে যে set-of-sets version-এ redundancy আছে।

---

# ১৯. Tableau calculus-এর correctness

## ১৯.১ Lemma: termination, soundness, completeness

ধরা যাক $\varphi$ NNF-এ থাকা PL formula। তাহলে tableau algorithm:

1. সর্বোচ্চ নিচের সংখ্যক steps পরে থামে:

$$
2^{\ell(\varphi)}
$$

2. “yes” return করলে $\varphi$ satisfiable;
3. $\varphi$ satisfiable হলে “yes” return করে।

Slide এই properties label করে:

- **Termination:** always stops।
- **Soundness:** returning “yes” implies satisfiable।
- **Completeness:** satisfiable হলে returns “yes”।

lecturer এটি summarize করেছেন: algorithm “always stops” এবং “never lies”।

## ১৯.২ Proof sketch: termination

Proof দুটি rule analyse করে।

$\land$-rule-এর জন্য:

- এটি শুধু কোনো $S \in \mathcal{S}$-এ formulae add করে।
- প্রতিটি $S$-এর জন্য, $\varphi$-এর প্রতিটি subformula অনুযায়ী এটি at most একবার ঘটে।
- তাই প্রতিটি $S$-এর size input formula-এর length দিয়ে bounded:

$$
\#S \leq \ell(\varphi)
$$

এখানে $\#$ cardinality denote করে।

$\lor$-rule-এর জন্য:

- এটি একটি set-কে দুই set দিয়ে replace করে।
- Possible branchings-এর সংখ্যা $\varphi$-এর disjunctions-এর সংখ্যা দিয়ে exponentially bounded।
- তাই generated sets-এর total number finite এবং exponential।

আর কোনো rules apply না হলে algorithm stops।

## ১৯.৩ Proof sketch: soundness

Assume algorithm returns “yes”。

তাহলে $\mathcal{S}$-এ একটি final clash-free set $S$ আছে।

$S$ থেকে valuation $v$ build করো:

$$
v(p)=1 \quad \text{if } p \in S
$$

$$
v(p)=0 \quad \text{if } \neg p \in S
$$

যদি $p$ বা $\neg p$ কোনোটিই $S$-এ না থাকে, তাহলে যেকোনো value choose করা যায়।

এই valuation well-defined, কারণ $S$ clash-free। যদি $S$-এ $p$ এবং $\neg p$ দুটোই থাকত, তাহলে $p$-কে একসঙ্গে 1 এবং 0 assign করতে হতো।

তারপর formula structure-এর ওপর induction দিয়ে prove করা হয় যে প্রতিটি $\psi \in S$-এর জন্য:

$$
v(\psi)=1
$$

Original input formula $\varphi$ set-এ থেকেই যায়, কারণ algorithm non-destructive: formulae branches-এ add করা হয়, remove করা হয় না। তাই:

$$
v(\varphi)=1
$$

অতএব $\varphi$ satisfiable।

## ১৯.৪ Proof sketch: completeness

Assume $\varphi$ satisfiable।

তাহলে এমন valuation $v$ আছে যাতে:

$$
v(\varphi)=1
$$

Rule applications-এর মধ্য দিয়ে একটি branch “watch” করতে $v$ ব্যবহার করো:

- Start করো:

$$
S=\{\varphi\}
$$

- যদি $\land$-rule apply হয়, extended set watch করে যাও, কারণ যদি:

$$
v(\varphi_1 \land \varphi_2)=1
$$

তাহলে:

$$
v(\varphi_1)=1
\quad\text{and}\quad
v(\varphi_2)=1
$$

- যদি $\lor$-rule apply হয়:

$$
\varphi_1 \lor \varphi_2
$$

তাহলে $\varphi_1,\varphi_2$-এর অন্তত একটি $v$-এর অধীনে true। যে branch true disjunct add করে সেটি watch করো:

$$
S \cup \{\varphi_1\}
\quad \text{if } v(\varphi_1)=1
$$

otherwise:

$$
S \cup \{\varphi_2\}
$$

Final watched set clash-free হতে হবে, কারণ valuation একই সঙ্গে $p$ এবং $\neg p$ true করতে পারে না। তাই algorithm একটি clash-free set পায় এবং “yes” return করে।

[UNCLEAR] Slide-এ “By contraposition: assume $\varphi$ is satisfiable” লেখা আছে, কিন্তু transcript explicitly এটিকে slide fluke হিসেবে correct করেছে। Proof direct, contraposition নয়।

## ১৯.৫ Corollary

Tableau algorithm হলো:

1. PL satisfiability-এর জন্য decision procedure;
2. time এবং space-এ exponential।

একটি **decision procedure** হলো yes/no problem decide করা algorithm: এটি terminates করে এবং correct answers দেয়।

---

# ২০. Implementation এবং SAT solvers

উপস্থাপিত tableau algorithm conceptually useful কিন্তু inefficient।

এটি ভালোভাবে implement করতে clever design decisions দরকার:

- formulae-এর জন্য suitable syntax;
- efficient data structures;
- rule applications-এর ভালো order;
- কোন branch আগে pursue করা হবে তার choice;
- failed branches থেকে learn করার উপায়;
- wasteful duplication এড়াতে optimisations।

lecturer এটি practical SAT solvers যেমন MiniSAT এবং SAT competition-এর সঙ্গে connect করেছেন। Propositional satisfiability worst case-এ NP-complete/intractable হলেও SAT solvers practice-এ খুব successful হতে পারে, কারণ optimisations অনেক সময় formulae of interest-এ worst-case behaviour এড়ায়।

**পরীক্ষা-ফ্ল্যাগ:** theory-তে hard মানে practice-এ useless নয়। Lecturer explicitly highlight করেছেন যে clever implementations প্রায়ই worst-case behaviour এড়াতে পারে, তাই SAT useful থাকে।

---

# ২১. KR applications-এ reasoning ব্যবহার

## ২১.১ Reasoner ব্যবহার করার দুটি style

Lecture দুটি application style আলাদা করেছে।

### On-stage usage

Users সরাসরি SAT solver-এর সঙ্গে interact করে।

এটি rare এবং মূলত teaching tools-এর মতো settings-এ ঘটে।

এর জন্য দরকার:

- suitable syntax;
- user interface;
- interaction mechanisms।

### Behind-the-scenes usage

Users SAT solver দেখে না।

বরং:

1. user-এর task একটি SAT problem-এ translate করা হয়;
2. SAT solver solve করে;
3. answer original user task-এ translate back করা হয়।

Slide program verification-কে example হিসেবে দেয়। Page 52-এর diagram দেখায় SAT solver হয় সরাসরি on stage, নয় application layer-এর আড়ালে hidden থাকে।

---

# ২২. KR example: weather knowledge base

## ২২.১ Propositional variables

Slide weather এবং human behaviour-এর জন্য propositional variables introduce করে:

| Meaning | Variable |
|---|---|
| Blue Sky | $BS$ |
| Sunny | $Sy$ |
| Raining | $Rg$ |
| Snowing | $Sg$ |
| Street Wet | $SW$ |
| Below Zero | $BZ$ |
| Cold Weather | $CW$ |
| Slippery | $Sly$ |
| Sit Outside | $SO$ |
| Take Umbrella | $TU$ |
| Take Coat | $TC$ |
| Wear Boots | $WB$ |
| Rainbow | $RB$ |

এই variables ব্যবহার করে weather এবং কিছু human behaviour describe করা knowledge base তৈরি করা হয়।

## ২২.২ Example formulae

Slide-এ formulae যেমন:

$$
BS \Rightarrow Sy
$$

Blue sky থাকলে sunny।

$$
Rg \Rightarrow SW
$$

Raining হলে street wet।

$$
BZ \Rightarrow CW
$$

Below zero হলে cold weather।

$$
(Rg \land Sy) \Rightarrow RB
$$

Raining এবং sunny হলে rainbow।

$$
(Sg \lor (SW \land BZ)) \Rightarrow Sly
$$

Snowing হলে, অথবা street wet এবং below zero হলে slippery।

$$
(Sly \lor CW) \Rightarrow (WB \land TC)
$$

Slippery বা cold হলে wear boots এবং take coat।

$$
(Rg \lor \neg Sy) \Rightarrow TU
$$

Raining বা not sunny হলে take umbrella।

$$
CW \Rightarrow \neg SO
$$

Cold weather হলে sit outside নয়।

[UNCLEAR] Slide-এ এক জায়গায় $RG$ এবং অন্যত্র $Rg$ ব্যবহার করা হয়েছে। এই notes “Raining” বোঝাতে consistently $Rg$ ব্যবহার করে।

## ২২.৩ Knowledge base as conjunction

পুরো knowledge base formulae-এর conjunction হিসেবে treat করা হয়:

$$
KB = (1) \land (2) \land \cdots \land (19)
$$

Lecture এরপর জিজ্ঞেস করে: আমরা কখন done, এবং formulae কি any good?

---

# ২৩. Weather KB-এর reasoning checks

## ২৩.১ Sanity check 1: satisfiability

Question:

$$
KB \text{ satisfiable?}
$$

যদি yes:

$$
\text{consistent theory}
$$

যদি no:

$$
\text{broken theory}
$$

এটি check করে যে knowledge base self-contradictory নয়।

## ২৩.২ Sanity check 2: validity

Question:

$$
KB \text{ valid?}
$$

যদি yes:

$$
\text{vacuous theory}
$$

এটি bad, কারণ KB কিছু constrain করছে না।

যদি no:

$$
\text{constraining theory}
$$

এটি good।

## ২৩.৩ Entailment checks: entailed formulae good কিনা

Example:

$$
KB \to (BZ \Rightarrow \neg SO)
$$

যদি yes, KB entails করে যে below zero হলে বাইরে বসা উচিত নয়।

যদি no, slide suggests formulae weaken বা fix করতে হবে।

## ২৩.৪ কোন entailments check করা উচিত?

Lecture বলেছে সব entailments check করা impossible, কারণ simple formulae-রও infinitely many entailments আছে।

Example pattern:

$$
(p \lor \neg p) \to (q_1 \lor \neg q_1)
$$

$$
\to (q_2 \lor \neg q_2)
$$

$$
\to \cdots
$$

এবং arbitrarily many tautologies-এর conjunctions।

তাই tools-কে interesting entailments focus করতে হবে এবং avoid করতে হবে:

- tautologies;
- KB-তে already contained formulae;
- equivalent entailments;
- too many results দেখানো।

Slide এটি “Really tricky & interesting!” বলে label করেছে।

## ২৩.৫ Desired-property checks

Question:

$$
KB \to (BZ \Rightarrow \neg SO)
$$

interpretation: KB কি desired property entail করে?

যদি yes:

$$
\text{KB reflects desired properties}
$$

যদি no:

$$
\text{strengthen/fix some formulae}
$$

Slide notes করে যে desired property formulae collect করতে হবে।

## ২৩.৬ Undesired-property checks

Question:

$$
KB \land (Rg \land \neg TU)
$$

unsatisfiable কিনা?

এটি check করে KB একটি undesired situation rule out করে কিনা: raining, কিন্তু agent umbrella নেয় না।

যদি yes:

$$
\text{KB is inconsistent with undesired properties}
$$

এটি good: bad situation ঘটতে পারে না।

যদি no:

$$
\text{strengthen/fix some formulae}
$$

Slide notes করে যে undesired property formulae collect করতে হবে।

---

# ২৪. Knowledge-base design-এর tooling tasks

Automated reasoning ভালোভাবে ব্যবহার করে knowledge base design করতে lecture বলেছে clever tool support এবং methodologies দরকার:

## ২৪.১ Vocabulary choice এবং maintenance

এর মধ্যে আছে:

- term definitions;
- alternative terms;
- অন্য ভাষায় terms;
- vocabulary maintenance।

## ২৪.২ Knowledge-base design এবং maintenance

এর মধ্যে আছে:

- reasoner-এর সঙ্গে interaction;
- desired এবং undesired properties gathering;
- reasoner results explain করা;
- KB-এর formulae fix, strengthen, বা weaken করা।

## ২৪.৩ Documentation এবং versioning

এর মধ্যে আছে:

- design choices-এর documentation;
- knowledge bases-এর versioning।

Slide প্রশ্ন করে: “What do we want to use KB for?” Intended use নির্ধারণ করে কোন checks এবং tool support দরকার।

---

# ২৫. KR applications-এ propositional logic-এর limitations

Final slide জিজ্ঞেস করে, আরও detailed weather knowledge চাইলে কী হয়।

## ২৫.১ Locations

Propositional logic compactভাবে general location-dependent patterns express করতে struggles করে।

Example হিসেবে আলাদা variables দরকার হতে পারে:

$$
BS_{Man}
$$

$$
BS_{Bir}
$$

Manchester বনাম Birmingham-এ blue sky-এর জন্য।

তাহলে rules-ও proliferate করে:

$$
BS_{Man} \Rightarrow Sy_{Man}
$$

$$
BS_{Bir} \Rightarrow Sy_{Bir}
$$

ইত্যাদি।

Slide hint করে যে quantification-এর মতো কিছু বেশি natural হবে:

$$
\forall x .\ BS(x) \Rightarrow BS(y)
$$

[UNCLEAR] এই displayed formula-তে $y$ free/unbound, তাই এটি slide typo বা intentionally rough placeholder হতে পারে। Point হলো propositional logic-এ variables এবং locations-এর ওপর quantification নেই।

## ২৫.২ Time

Slide today, tomorrow, yesterday, এবং এমন statements mention করে:

> eventually it will stop raining

এছাড়া example দেয়:

$$
\neg TU \Rightarrow soon(Rg)
$$

এটি plain propositional logic-এর বাইরে, কারণ এতে temporal expression $soon$ আছে।

## ২৫.৩ Probabilities

Slide probabilistic weather statements mention করে, যেমন:

$$
p \geq 95
$$

[UNCLEAR] Slide text “it will rain with a …” অংশে truncated; সম্ভবত probability threshold বোঝানো হয়েছে, কিন্তু exact intended wording parsed text-এ পুরো visible নয়।

## ২৫.৪ Beliefs

Slide weather নিয়ে beliefs-ও mention করে, example:

$$
\neg TU \Rightarrow Rg
$$

belief statement-এর মধ্যে:

> I believe that …

এটি propositional logic-এর বাইরে richer logics-এর দিকে ইঙ্গিত করে, যেগুলো beliefs represent করতে পারে।

Slide বলে এগুলো next sessions-এ আসবে।

---

# ২৬. Lecture-এ করা connections

## ২৬.১ Previous learning-এর সঙ্গে connection

Lecturer বলেছেন students হয়তো undergraduate study থেকে বা Boolean logic নামে propositional logic আগে থেকেই জানে। কিন্তু আগের courses বা textbooks implication-কে primitive operator হিসেবে include করার মতো ভিন্ন syntax definition ব্যবহার করতে পারে। Course-এর নিজের definitions-ই reference point।

## ২৬.২ Algorithms এবং SAT solvers-এর সঙ্গে connection

Tableau calculus SAT reasoner-এর basis হিসেবে present করা হয়েছে। Practical SAT solvers simple formal presentation-এর বাইরে data structures এবং heuristics ব্যবহার করে। Successful SAT-solver work-এর examples হিসেবে MiniSAT এবং SAT competitions mention করা হয়েছে।

## ২৬.৩ Knowledge representation-এর সঙ্গে connection

Weather example দেখায় domain knowledge represent করতে formulae কীভাবে ব্যবহার করা যায় এবং reasoning tasks দিয়ে KB consistent, non-vacuous, desired/undesired properties-এর সঙ্গে aligned কিনা test করা যায়।

## ২৬.৪ Later topics-এর সঙ্গে connection

Limitations slide richer logics-এর দিকে point করে:

- objects এবং quantification;
- time;
- probability;
- belief।

---

# ২৭. Consolidated exam flags / high-value points

Provided transcript-এ explicit “this will be on the exam” phrase দেখা যায় না। নিচেরগুলো mark করা হয়েছে কারণ lecturer এগুলো emphasise করেছেন, repeat করেছেন, বা core technical machinery হিসেবে ব্যবহার করেছেন।

1. **Definitions ঠিকমতো জানো।** Technical terms central: formula, valuation, satisfiable, valid, equivalent, entails, clash, NNF, soundness, completeness, termination।

2. **Syntax এবং semantics আলাদা করো।**
   - Syntax: কী লেখা যায়।
   - Semantics: তার meaning কী।

3. **Satisfiable এবং valid আলাদা করো।**
   - Satisfiable: $\exists v$ such that $v(\varphi)=1$।
   - Valid: $\forall v$, $v(\varphi)=1$।

4. **মনে রাখো valid formulae হলো tautologies।**

5. **Equivalence-কে syntactic identity ভেবো না।**
   - $A \land B$ এবং $B \land A$ different strings, কিন্তু equivalent।

6. **Entailment $\to$ এবং implication $\Rightarrow$ আলাদা রাখো।**
   - $\varphi \to \psi$: semantic relation।
   - $\varphi \Rightarrow \psi := \neg\varphi \lor \psi$: formula abbreviation।

7. **Reduction theorem জানো।**
   - Validity, satisfiability, এবং entailment একে অপরের মধ্যে reduce করা যায়।
   - একটি reasoner দিয়ে অন্যগুলো build করা যায়।

8. **Truth tables exponentially scale করে।**
   - $n$ variables দিলে $2^n$ rows।
   - Conceptually useful, বড় systems-এর জন্য practical নয়।

9. **NNF rewrite rules জানো।**

$$
\neg(\varphi_1 \land \varphi_2)
\rightsquigarrow
\neg\varphi_1 \lor \neg\varphi_2
$$

$$
\neg(\varphi_1 \lor \varphi_2)
\rightsquigarrow
\neg\varphi_1 \land \neg\varphi_2
$$

$$
\neg\neg\varphi
\rightsquigarrow
\varphi
$$

10. **Tableau rules জানো।**
    - $\land$-rule: দুটো conjunct add করো।
    - $\lor$-rule: alternatives-এ branch করো।

11. **Clash-free criterion জানো।**
    - $p$ এবং $\neg p$ দুটোই থাকলে clash।
    - Satisfiability-এর জন্য একটি final clash-free set যথেষ্ট।

12. **Correctness vocabulary জানো।**
    - Termination: stops।
    - Soundness: yes-answer trustworthy।
    - Completeness: সব satisfiable inputs yes পায়।
    - Together they give a decision procedure।

13. **KR system descriptions কেন satisfiable কিন্তু not valid হওয়া উচিত জানো।**
    - Unsatisfiable: inconsistent/broken।
    - Valid: vacuous/unconstraining।

14. **Desired বনাম undesired property checks জানো।**
    - Desired: entailment check।
    - Undesired: KB plus bad property-এর unsatisfiability check।

15. **Theory বনাম practice।**
    - PL satisfiability worst case-এ NP-complete/intractable।
    - Good heuristics এবং data structures থাকলে SAT solvers practice-এ useful হতে পারে।

---

# ২৮. Recording/slides-এ ফিরে দেখে নেওয়ার unclear sections

1. **$\psi$ transcription:** transcript বারবার $\psi$-কে “CI”, “Cy”, বা অনুরূপভাবে render করেছে।

2. **Valuation codomain:** transcript-এ “numbers one and two” বলা হয়েছে, কিন্তু slides এবং formulas $\{0,1\}$ ব্যবহার করে।

3. **Double negation equivalence:** transcript-এ মনে হয় $\neg\neg\varphi$ “zero”-র equivalent বলা হয়েছে; slide এবং discussion-এর logic দেয় $\neg\neg\varphi \equiv \varphi$।

4. **Entailment wording:** transcript truth-value cases garble করেছে; $v(\varphi)\leq v(\psi)$-এর ওপর rely করো।

5. **Tableau example formula:** input appears as $(p \land(\neg q\lor\neg r))\land\neg s$, কিন্তু কিছু copied sets-এ top formula-তে $\neg q$ দেখা যায়। Valuation examples $\neg s$ version support করে।

6. **Completeness proof label:** slide says “By contraposition” while assuming $\varphi$ is satisfiable। Transcript explicitly corrects this as slide mistake; proof direct।

7. **Weather rule notation:** $RG$ এবং $Rg$ দুটোই appear করে; সম্ভবত একই “Raining” variable।

8. **Limitations slide formula:** $\forall x . BS(x)\Rightarrow BS(y)$-তে unbound $y$ আছে, তাই recording revisit করা ভালো যদি এটি discuss করা হয়ে থাকে।

9. **Probability example:** “it will rain with a … $p\geq95$” অংশে slide text truncated/garbled।
