---
subject: COMP64702
chapter: 10
title: "Evaluation & OpenIE"
language: bn
---

# কাঠামোবদ্ধ স্টাডি নোট — NLP Evaluation Methods এবং Open Information Extraction

**বিষয় ও পরিসর:** এই লেকচারটি মূলত NLP সিস্টেম কীভাবে মূল্যায়ন করা হয় তা নিয়ে: benchmark data, gold standard, annotation reliability, inter-annotator agreement, Cohen's Kappa, confusion matrix, precision, recall, F1, accuracy, averaging methods, এবং entity-level NER evaluation। শেষে Module 5-এর Open Information Extraction বিষয়ে ছোট একটি পরিচিতি আছে; এটি প্রধান assessment focus নয়, বরং একটি compact application case।

**Course:** নির্দিষ্ট করা হয়নি। স্লাইড থেকে অনুমিত ক্ষেত্র: NLP / Text Mining।

**Lecture topic:** Module 4 — Evaluation Method; Module 5 — Open Information Extraction-এর সংক্ষিপ্ত শুরু।

**Source coverage note:** আপলোড করা দুটি PDF একই ৪১-পৃষ্ঠার slide deck-এর অভিন্ন কপি। আলাদা lecture transcript conversation-এ দেওয়া হয়নি, তাই এই নোটগুলো slide text এবং slide visuals-এর ওপর ভিত্তি করে তৈরি। যেসব পয়েন্ট recording/transcript ছাড়া নিশ্চিত করা যায় না, সেগুলো **[UNCLEAR]** হিসেবে চিহ্নিত।

---

# 1. Module 4 overview: Evaluation Method

## 1.1 লেকচারের শুরুতে তালিকাভুক্ত topic

Opening slide-এ Module 4-এর মূল পরিসর হিসেবে দেওয়া হয়েছে:

- NLP-তে evaluation কেন essential;
- benchmark datasets এবং gold-standard annotations;
- annotation reliability কেন গুরুত্বপূর্ণ;
- inter-annotator agreement;
- observed agreement, expected agreement, এবং Cohen's Kappa;
- confusion matrix: TP, FP, FN, TN;
- precision, recall, এবং F1-score;
- কখন accuracy misleading হতে পারে;
- micro, macro, এবং weighted averages;
- NER-এর entity-level evaluation।

এই outline লেকচারের structure-এর সঙ্গে মেলে: lecturer প্রথমে evaluation-এর motivation, তারপর annotation reliability, এরপর scoring metrics এবং NER-specific evaluation-এ যান।

---

# 2. “Evaluation” বলতে কী বোঝায়

## 2.1 সাধারণ অর্থ

স্লাইডে **evaluation**-এর dictionary-style definition দেওয়া হয়েছে: কোনো কিছুর amount, number, বা value সম্পর্কে judgement করা।

## 2.2 Computer science-এ অর্থ

Computer science-এ স্লাইড অনুযায়ী evaluation প্রায় synonym হিসেবে ব্যবহৃত হয়:

$$
\text{testing}
$$

## 2.3 Intuition

Evaluation হলো কোনো method, model, বা system কত ভালো perform করছে তা পরীক্ষা করা। NLP-তে সাধারণত এর অর্থ হলো system output-কে কোনো reference বা gold standard-এর সঙ্গে compare করা।

---

# 3. NLP systems কেন evaluate করা হয়

## 3.1 প্রধান উদ্দেশ্য

Evaluation আমাদের বলে একটি system কত ভালো perform করছে।

## 3.2 ভিন্ন stakeholder ভিন্ন কারণে care করে

### Users

Users care করে system কোনো task-এর জন্য useful কি না।

স্লাইডের structure থেকে example intuition:

- User শুধু system চলেছে কি না তা নিয়ে care করে না।
- User care করে output তার task-এ useful কি না।

### Developers

Developers care করে system সময়ের সঙ্গে improve করছে কি না।

এটি গুরুত্বপূর্ণ যখন compare করা হয়:

- আগের এবং পরের model version;
- ভিন্ন modelling choices;
- ভিন্ন features বা architectures;
- ভিন্ন datasets বা preprocessing pipelines।

## 3.3 Evaluation যেসব কাজে সহায়তা করে

স্লাইডে evaluation-এর চারটি ব্যবহার explicitly দেওয়া হয়েছে:

1. **Comparison**
   - systems, methods, model versions, বা experimental settings compare করা।

2. **Debugging**
   - system কোথায় এবং কীভাবে fail করে তা identify করা।

3. **Model selection**
   - কোন model রাখা বা deploy করা হবে তা বেছে নেওয়া।

4. **Scientific reporting**
   - reproducible এবং comparable উপায়ে results report করা।

---

# 4. Benchmark data এবং gold standards

## 4.1 Benchmark datasets

### Definition

**Benchmark dataset** হলো এমন একটি dataset যা systems evaluate এবং compare করার standard basis হিসেবে ব্যবহৃত হয়।

### Slide definition / components

স্লাইডে বলা হয়েছে performance evaluation প্রায়ই benchmark datasets-এর ওপর ভিত্তি করে হয়, এবং এসব dataset-এ থাকে:

- **inputs**;
- **gold-standard labels**;
- **a fixed evaluation protocol**।

### Intuition

Benchmark থাকলে ভিন্ন systems একই condition-এ evaluate করা যায়। Common dataset এবং protocol না থাকলে comparison দুর্বল হয়, কারণ systems ভিন্ন inputs-এ test হতে পারে বা ভিন্নভাবে score হতে পারে।

---

## 4.2 Gold standards

### Definition

**Gold standard** হলো reference annotation বা label set, যার সঙ্গে system predictions compare করা হয়।

### Slide details

Gold standards সাধারণত human annotators তৈরি করে, যারা annotation guidelines follow করে।

Reliable evaluation নির্ভর করে reliable annotation-এর ওপর।

### Intuition

Gold standard noisy বা inconsistent হলে system-এর score কম trustworthy হয়। Model তার real performance-এর কারণে নয়, বরং annotation problem-এর কারণে penalised বা rewarded হতে পারে।

---

## 4.3 Shared task / community challenge setup

Performance evaluation slide-এ community challenges এবং shared tasks-এর কথা বলা হয়েছে; visual example হিসেবে **Kaggle** এবং **SemEval** দেখানো হয়েছে।

একটি shared task setup-এ সাধারণত থাকে:

- specific task defined থাকে;
- gold-standard data দেওয়া থাকে:
  - training;
  - development;
  - testing।

## 4.4 Response vs reference

স্লাইডে বলা হয়েছে automated scoring compare করে:

- **response** = system-generated annotations বা predictions;
- **reference** = gold standard।

### Intuition

System একটি response produce করে। Gold standard reference দেয়। Evaluation measure করে response কতটা reference-এর সঙ্গে match করছে।

---

# 5. Gold-standard data তৈরি করা

## 5.1 Cost এবং time

Gold-standard data তৈরি করা:

- time-consuming;
- costly।

## 5.2 Annotation guidelines

Gold-standard annotation-এর জন্য **annotation instructions** দরকার, যাকে বলা হয়:

$$
\text{annotation guidelines}
$$

### Definition

Annotation guidelines হলো instructions যা annotators-কে বলে কীভাবে labels consistently assign করতে হবে।

### Intuition

Guidelines ambiguity কমায়। Annotators-কে borderline cases কীভাবে handle করতে হবে বলা না হলে, ভিন্ন annotators ভিন্ন decisions নিতে পারে।

## 5.3 Annotators

Annotations experts দ্বারা করা হয়।

স্লাইডে বলা হয়েছে annotators-এর কিছু linguistics training দরকার হতে পারে।

## 5.4 Multiple annotators

স্লাইডে বলা হয়েছে multiple annotators-কে একই samples label করতে হয়, অন্তত data-এর একটি subset-এর জন্য।

কারণ:

- annotation reliable কি না check করা;
- inter-annotator agreement calculate করা;
- disagreements হতে পারে।

---

# 6. Inter-annotator agreement

## 6.1 Definition

**Inter-annotator agreement** measure করে humans একই data কত consistently label করে।

## 6.2 কেন গুরুত্বপূর্ণ

Human annotations সবসময় identical হয় না।

Different annotators guideline ভিন্নভাবে interpret করতে পারে।

High agreement suggest করে:

- task clearer;
- annotation guidelines clearer;
- resulting annotations বেশি reliable।

## 6.3 Intuition vs formalism

### Intuition

যদি দুই annotator একই item দেখে সাধারণত একই label বেছে নেয়, তাহলে task এবং guidelines সম্ভবত well-defined।

যদি তারা প্রায়ই disagree করে, তাহলে task ambiguous হতে পারে, guidelines unclear হতে পারে, অথবা annotators-এর আরও training দরকার হতে পারে।

### Formal scoring idea

Agreement numerically measure করা যায়। লেকচারে introduce করা হয়েছে:

- observed agreement $P_a$;
- expected agreement $P_e$;
- Cohen's Kappa $K$।

---

# 7. Observed agreement: $P_a$

## 7.1 Definition

Observed agreement হলো annotators যে cases-এ agree করেছে তার proportion।

## 7.2 Formula

$$
P_a
=
\frac{\text{annotators agree করেছে এমন items-এর সংখ্যা}}{\text{total items-এর সংখ্যা}}
$$

## 7.3 Slide-এর worked example

দুই annotator 10টি item label করে।

তারা 7টি item-এ agree করে।

তাই:

$$
P_a
=
\frac{7}{10}
=
0.70
$$

## 7.4 Limitation

Observed agreement **chance agreement** correct করে না।

### Intuition

Annotators কখনও কখনও শুধুমাত্র chance-এর কারণে agree করতে পারে, বিশেষ করে যদি label খুব কম থাকে বা কোনো একটি label খুব common হয়।

---

# 8. Expected agreement: $P_e$

## 8.1 Definition

Expected agreement estimate করে chance-এর কারণে কত agreement হতে পারে।

## 8.2 Slide example থেকে general pattern

প্রতিটি label-এর জন্য, Annotator A ওই label assign করার probability-কে Annotator B ওই label assign করার probability দিয়ে multiply করতে হয়, তারপর সব labels-এর ওপর sum করতে হয়।

Labels $c$-এর জন্য:

$$
P_e
=
\sum_c P(A1=c)P(A2=c)
$$

## 8.3 Slide-এর worked example

ধরা যাক:

- Annotator A assign করে:
  - Positive to $6/10$ items;
  - Negative to $4/10$ items।

- Annotator B assign করে:
  - Positive to $5/10$ items;
  - Negative to $5/10$ items।

Positive label-এ chance agreement:

$$
0.6 \times 0.5 = 0.30
$$

Negative label-এ chance agreement:

$$
0.4 \times 0.5 = 0.20
$$

তাই:

$$
P_e
=
0.30 + 0.20
=
0.50
$$

---

# 9. Cohen's Kappa

## 9.1 Definition

**Cohen's Kappa** observed agreement-কে chance agreement-এর জন্য correct করে।

## 9.2 Formula

$$
K
=
\frac{P_a - P_e}{1 - P_e}
$$

যেখানে:

- $P_a$ = observed agreement;
- $P_e$ = chance অনুযায়ী expected agreement।

## 9.3 আগের $P_a$ এবং $P_e$ ব্যবহার করে worked example

আগের examples থেকে:

$$
P_a = 0.70
$$

$$
P_e = 0.50
$$

Formula-তে substitute করলে:

$$
K
=
\frac{0.70 - 0.50}{1 - 0.50}
$$

$$
K
=
\frac{0.20}{0.50}
$$

$$
K
=
0.40
$$

## 9.4 Kappa কেন useful

স্লাইডে বলা হয়েছে Kappa raw agreement alone-এর চেয়ে বেশি informative, কারণ এটি chance agreement correct করে।

---

# 10. Kappa coefficient: worked table example

স্লাইডে দুই annotator এবং yes/no labels সহ একটি table দেওয়া হয়েছে।

## 10.1 Table values

| Annotator 2 \\ Annotator 1 | yes | no | total |
|---|---:|---:|---:|
| yes | 31 | 1 | 32 |
| no | 2 | 6 | 8 |
| total | 33 | 7 | 40 |

## 10.2 Table-এর observed agreement

Observed agreement হলো diagonal-এ agreement:

- দুজনই yes বলেছে: 31;
- দুজনই no বলেছে: 6;
- total items: 40।

$$
P(a)
=
P(A1=\text{yes}, A2=\text{yes})
+
P(A1=\text{no}, A2=\text{no})
$$

$$
P(a)
=
\frac{31}{40} + \frac{6}{40}
$$

$$
P(a)
=
\frac{37}{40}
$$

$$
P(a)
=
0.925
$$

## 10.3 Table-এর expected agreement

স্লাইডে দেওয়া হয়েছে:

$$
P(e)
=
P(A1=\text{yes})P(A2=\text{yes})
+
P(A1=\text{no})P(A2=\text{no})
$$

Marginal probabilities ব্যবহার করা হয়েছে:

- Annotator 1 yes: $33/40$;
- Annotator 2 yes: $32/40$;
- Annotator 1 no: $7/40$;
- Annotator 2 no: $8/40$।

তাই:

$$
P(e)
=
\left(\frac{33}{40}\times\frac{32}{40}\right)
+
\left(\frac{7}{40}\times\frac{8}{40}\right)
$$

$$
P(e)
=
0.695
$$

## 10.4 Table-এর Cohen's Kappa

Kappa formula ব্যবহার করে:

$$
K
=
\frac{P_a - P_e}{1 - P_e}
$$

Substitute:

$$
K
=
\frac{0.925 - 0.695}{1 - 0.695}
$$

$$
K
=
\frac{0.230}{0.305}
$$

$$
K
\approx
0.754
$$

তাই এই table-এর Kappa প্রায়:

$$
K \approx 0.75
$$

---

# 11. Kappa coefficient interpretation

স্লাইডে কয়েকটি interpretation scheme দেওয়া হয়েছে। এগুলো সব এক নয়, তাই Kappa score interpret করার সময় কোন scheme ব্যবহার করা হচ্ছে তার ওপর interpretation depend করে।

## 11.1 Landis and Koch, 1977

স্লাইডে দেওয়া হয়েছে:

$$
\text{slight} < 0.2 < \text{fair} < 0.4 < \text{moderate} < 0.6 < \text{substantial} < 0.8 < \text{perfect}
$$

Threshold হিসেবে interpret করলে:

- 0.2-এর নিচে: slight;
- 0.2–0.4-এর আশেপাশে: fair;
- 0.4–0.6-এর আশেপাশে: moderate;
- 0.6–0.8-এর আশেপাশে: substantial;
- 0.8-এর ওপরে: close to perfect।

এই scale ব্যবহার করলে table example $K \approx 0.754$ **substantial** range-এর কাছাকাছি পড়ে।

## 11.2 Grove et al., 1981

স্লাইডে বলা হয়েছে:

$$
0.6 < \text{acceptable}
$$

অর্থাৎ acceptable agreement প্রায় 0.6-এর ওপরে।

## 11.3 Krippendorff, 1980

স্লাইডে বলা হয়েছে:

$$
0.67 < \text{tentative conclusions} < 0.8 < \text{definite conclusions}
$$

Slide wording থেকে interpretation:

- 0.67-এর ওপরে: tentative conclusions;
- 0.8-এর ওপরে: definite conclusions।

## 11.4 Rietveld and van Hout, 1993

স্লাইডে দেওয়া হয়েছে:

$$
0.4 < \text{moderate} < 0.6 < \text{substantial} < 0.8
$$

## 11.5 Green, 1997

স্লাইডে দেওয়া হয়েছে:

$$
\text{low} < 0.4 < \text{fair/good} < 0.75 < \text{high}
$$

## 11.6 [UNCLEAR] Interpretation thresholds

**[UNCLEAR]** স্লাইডের threshold notation compressed। Lecturer কোন interpretation scheme course-এর জন্য prefer করেছেন, বিশেষ করে সেটা recording-এ check করা উচিত।

---

# 12. Scoring এবং confusion matrix

## 12.1 Annotation wording-এ precision এবং recall

Scoring slide precision ও recall define করেছে:

- **Precision** = annotated items-এর মধ্যে যেগুলো correct তার fraction।
- **Recall** = correct items-এর মধ্যে যেগুলো annotated হয়েছে তার fraction।

Annotation বা retrieval ভাবনায় এই wording useful:

- annotated/predicted items হলো system selected items;
- correct items হলো যেগুলো selected হওয়া উচিত ছিল।

## 12.2 Scoring slide-এর confusion matrix

|  | Correct | Not correct |
|---|---|---|
| Annotated | True positive (TP) | False positive (FP) |
| Not annotated | False negative (FN) | True negative (TN) |

## 12.3 Automated prediction confusion matrix

পরের slide prediction/evaluation version দিয়েছে:

|  | Positive response | Negative response |
|---|---|---|
| Positive reference | True positive (TP) | False negative (FN) |
| Negative reference | False positive (FP) | True negative (TN) |

## 12.4 Positive class-এর জন্য definitions

Positive class-এর জন্য:

- **TP: true positive**
  - predicted positive, actually positive।

- **FP: false positive**
  - predicted positive, actually negative।

- **FN: false negative**
  - predicted negative, actually positive।

- **TN: true negative**
  - predicted negative, actually negative।

## 12.5 Confusion matrix কেন গুরুত্বপূর্ণ

অনেক common metric এই চারটি count থেকে derive করা হয়:

$$
TP, FP, FN, TN
$$

এই counts precision, recall, F1, এবং accuracy-এর basis।

---

# 13. Precision

## 13.1 Intuition

Precision জিজ্ঞেস করে:

> Positive হিসেবে predicted items-এর মধ্যে কতগুলো correct?

Annotation wording-এ:

> Annotated items-এর মধ্যে কী fraction correct?

## 13.2 Formula

$$
Precision
=
\frac{TP}{TP + FP}
$$

## 13.3 Precision কী penalise করে

Precision false positives penalise করে।

System যদি অনেক item positive predict করে কিন্তু সেগুলোর অনেকগুলো wrong হয়, precision কমে যায়।

---

# 14. Recall

## 14.1 Intuition

Recall জিজ্ঞেস করে:

> Truly positive items-এর মধ্যে system কতগুলো find করেছে?

Annotation wording-এ:

> Correct items-এর মধ্যে কী fraction annotated হয়েছে?

## 14.2 Formula

$$
Recall
=
\frac{TP}{TP + FN}
$$

## 14.3 Recall কী penalise করে

Recall false negatives penalise করে।

System যদি অনেক true positive item miss করে, recall কমে যায়।

---

# 15. Worked visual example: blue stars

স্লাইডে blue stars এবং red ovals দিয়ে একটি visual example ব্যবহার করা হয়েছে।

Target class:

$$
\text{Blue stars}
$$

একটি বড় circle system/annotation যেগুলো blue stars হিসেবে selected করেছে সেগুলো mark করে।

## 15.1 Visual-এ দেখানো counts

Visual item labels:

$$
TP = 5
$$

$$
FP = 2
$$

$$
FN = 1
$$

$$
TN = 4
$$

Interpretation:

- selected region-এর ভিতরে 5টি blue star আছে: true positives।
- selected region-এর ভিতরে 2টি red oval আছে: false positives।
- selected region-এর বাইরে 1টি blue star আছে: false negative।
- selected region-এর বাইরে 4টি red oval আছে: true negatives।

## 15.2 Precision calculation

$$
Precision
=
\frac{TP}{TP + FP}
$$

Substitute:

$$
Precision
=
\frac{5}{5 + 2}
$$

$$
Precision
=
\frac{5}{7}
$$

$$
Precision
=
0.714
$$

## 15.3 Recall calculation

$$
Recall
=
\frac{TP}{TP + FN}
$$

Substitute:

$$
Recall
=
\frac{5}{5 + 1}
$$

$$
Recall
=
\frac{5}{6}
$$

$$
Recall
=
0.833
$$

---

# 16. F-score / F-measure / F1-score

## 16.1 Terminology

স্লাইডে বলা হয়েছে F-score-এর অন্য নাম:

- F-measure;
- F1-score।

## 16.2 Definition

F-score হলো precision এবং recall-এর weighted harmonic mean।

## 16.3 General $F_\beta$ formula

$$
F_\beta
=
\frac{(\beta^2 + 1)PR}{\beta^2P + R}
$$

যেখানে:

- $P$ = precision;
- $R$ = recall;
- $\beta$ precision এবং recall-এর balance control করে।

## 16.4 Balanced F1

সাধারণত balanced F1 measure ব্যবহার করা হয়, যেখানে:

$$
\beta = 1
$$

তাহলে:

$$
F_1
=
\frac{2PR}{P + R}
$$

## 16.5 Intuition

স্লাইডে বলা হয়েছে harmonic mean বেশি conservative average এবং truer picture দেয়।

এটি গুরুত্বপূর্ণ, কারণ precision বা recall-এর যেকোনো একটি low হলে F1 low হয়ে যায়।

---

# 17. F-score vs arithmetic mean

## 17.1 Example 1

Given:

$$
P = 0.714
$$

$$
R = 0.833
$$

Arithmetic mean:

$$
\frac{0.714 + 0.833}{2}
=
0.774
$$

F-score:

$$
F_1
=
\frac{2 \times 0.714 \times 0.833}{0.714 + 0.833}
$$

$$
F_1
=
0.769
$$

### Interpretation

F-score arithmetic mean-এর চেয়ে সামান্য কম।

## 17.2 Example 2

Given:

$$
P = 1
$$

$$
R = 0.15
$$

Arithmetic mean:

$$
\frac{1 + 0.15}{2}
=
0.575
$$

F-score:

$$
F_1
=
\frac{2 \times 1 \times 0.15}{1 + 0.15}
$$

$$
F_1
=
0.261
$$

### Interpretation

Arithmetic mean moderately high দেখায়, কিন্তু F1 অনেক কম, কারণ recall খুব poor। এটি স্লাইডের point দেখায়: harmonic mean বেশি conservative।

---

# 18. Worked example: spam detector-এর F1 compute করা

স্লাইডে spam detector example দেওয়া হয়েছে।

## 18.1 Counts

$$
TP = 18
$$

$$
FP = 6
$$

$$
FN = 9
$$

## 18.2 Precision

$$
Precision
=
\frac{18}{18 + 6}
$$

$$
Precision
=
\frac{18}{24}
$$

$$
Precision
=
0.75
$$

## 18.3 Recall

$$
Recall
=
\frac{18}{18 + 9}
$$

$$
Recall
=
\frac{18}{27}
$$

$$
Recall
\approx
0.67
$$

## 18.4 F1

$$
F_1
=
\frac{2 \times 0.75 \times 0.67}{0.75 + 0.67}
$$

$$
F_1
\approx
0.71
$$

স্লাইডে বলা হয়েছে এটি counts থেকে F1 পর্যন্ত full calculation দেখায়।

## 18.5 [UNCLEAR] Slide-এর formula formatting

**[UNCLEAR]** Parsed text-এ F1 calculation garbled এবং clear fraction formatting missing। উপরের cleaned version আগের F1 slide-এ দেওয়া formula follow করে।

---

# 19. Accuracy

## 19.1 Definition

Accuracy হলো সব correctly identified cases-এর proportion।

## 19.2 Formula

$$
Accuracy
=
\frac{TP + TN}{TP + TN + FP + FN}
$$

## 19.3 Accuracy কখন suitable

স্লাইডে বলা হয়েছে accuracy suitable যদি সব classes equally important হয়।

## 19.4 Accuracy কখন mislead করতে পারে

Accuracy imbalanced datasets-এ misleading হতে পারে।

## 19.5 Imbalanced dataset example

স্লাইডের example:

- যদি 95% items negative হয়;
- always negative predict করলে 95% accuracy পাওয়া যায়;
- কিন্তু positive class-এর recall 0।

কারণ:

- system কোনো positive item identify করে না;
- সব actual positive case false negative হয়ে যায়;
- তাই:

$$
Recall
=
\frac{TP}{TP + FN}
=
0
$$

## 19.6 উল্লেখ করা example task

স্লাইডে mention করা হয়েছে:

$$
\text{Hate vs Neutral}
$$

এটি এমন example যেখানে classes equally important না হলে accuracy যথেষ্ট নাও হতে পারে।

## 19.7 Slide recommendation

স্লাইডে বলা হয়েছে:

$$
\text{Use F-score}
$$

এই ধরনের case-এ।

---

# 20. Multiple categories: micro vs macro averaging

স্লাইডে প্রশ্ন করা হয়েছে combined performance কীভাবে report করা হবে:

- Person;
- Location।

দেওয়া table:

| Category | TPs | FPs | FNs | Precision | Recall |
|---|---:|---:|---:|---:|---:|
| Person | 78 | 5 | 33 | 0.94 | 0.70 |
| Location | 20 | 3 | 2 | 0.87 | 0.91 |

---

# 21. Macro-averaging

## 21.1 Definition

Macro-averaging প্রতিটি class-এর metric compute করে, তারপর classes-এর ওপর equally average করে।

## 21.2 Slide calculation: macro precision

$$
P_{Person+Location}
=
\frac{0.94 + 0.87}{2}
$$

$$
P_{Person+Location}
=
0.91
$$

## 21.3 Slide calculation: macro recall

$$
R_{Person+Location}
=
\frac{0.70 + 0.91}{2}
$$

$$
R_{Person+Location}
=
0.81
$$

## 21.4 Slide calculation: macro F1

স্লাইডে averaged precision এবং averaged recall থেকে F1 compute করা হয়েছে:

$$
F1_{Person+Location}
=
\frac{2 \times 0.91 \times 0.81}{0.91 + 0.81}
$$

$$
F1_{Person+Location}
=
0.86
$$

## 21.5 [UNCLEAR] Macro F1 detail

**[UNCLEAR]** স্লাইডে averaged precision এবং averaged recall থেকে F1 compute করা হয়েছে। Lecturer class-level F1 values directly average করা থেকে এটি আলাদা কি না আলোচনা করেছেন কি না স্লাইডে দেখা যায় না। Exam-এর জন্য distinction দরকার হলে recording check করুন।

---

# 22. Micro-averaging

## 22.1 Definition

Micro-averaging প্রথমে TPs, FPs, এবং FNs pool করে, তারপর একবার metric compute করে।

## 22.2 Pooling counts

Table থেকে:

$$
TP_{total}
=
78 + 20
=
98
$$

$$
FP_{total}
=
5 + 3
=
8
$$

$$
FN_{total}
=
33 + 2
=
35
$$

## 22.3 Micro precision

$$
P_{Person+Location}
=
\frac{78 + 20}{(78 + 20) + (5 + 3)}
$$

$$
P_{Person+Location}
=
\frac{98}{98 + 8}
$$

$$
P_{Person+Location}
=
\frac{98}{106}
$$

$$
P_{Person+Location}
\approx
0.92
$$

## 22.4 Micro recall

$$
R_{Person+Location}
=
\frac{78 + 20}{(78 + 20) + (33 + 2)}
$$

$$
R_{Person+Location}
=
\frac{98}{98 + 35}
$$

$$
R_{Person+Location}
=
\frac{98}{133}
$$

$$
R_{Person+Location}
\approx
0.74
$$

## 22.5 Micro F1

$$
F1_{Person+Location}
=
\frac{2 \times 0.92 \times 0.74}{0.92 + 0.74}
$$

$$
F1_{Person+Location}
=
0.82
$$

---

# 23. Weighted average

## 23.1 Definition

স্লাইডে weighted average define করা হয়েছে:

$$
\text{প্রতিটি class-এর true instances-এর সংখ্যা দিয়ে weighted average}
$$

## 23.2 Intuition

Weighted average-এ যেসব class-এ true instances বেশি, সেগুলোর final average-এ influence বেশি হয়।

## 23.3 Averaging method বেছে নেওয়া

স্লাইডে বলা হয়েছে:

- macro-averaging class imbalance consider করে না;
- micro-averaging imbalance-এর প্রতি less sensitive;
- weighted average প্রতিটি class-এর true instances-এর সংখ্যা দিয়ে weight করে।

স্লাইডে আরও বলা হয়েছে choice affects how strongly rare classes final score-এ influence করে।

## 23.4 [UNCLEAR] “Which is better?” explanation

**[UNCLEAR]** এই slide খুব brief। Macro, micro, বা weighted averaging কখন ব্যবহার করতে হবে, especially class imbalance এবং rare-class influence নিয়ে lecturer-এর precise explanation recording-এ check করুন।

---

# 24. Entity-level evaluation for NER

## 24.1 Main idea

NER evaluation entity-level, শুধু token-level নয়।

Predicted entity correct count হবে তখনই যখন entity match exact হবে।

## 24.2 Slide-এর key point

স্লাইডে explicitly বলা হয়েছে:

> A partially correct span does not count as a true positive.

বাংলায়: partially correct span true positive হিসেবে count হয় না।

## 24.3 Intuition

NER-এ entity-এর শুধু part predict করা যথেষ্ট নয়। System-কে full span এবং entity type ঠিক করতে হবে।

Example:

- Gold: `Acme Labs` = ORG
- Predicted: `Acme` = ORG

এটি partial span, তাই true positive নয়।

---

# 25. Worked NER example: counting entities, version 1

স্লাইডে token sequence দেওয়া হয়েছে:

$$
\text{Dr | Maya | Chen | joined | Acme | Labs | in | Bristol | .}
$$

## 25.1 Gold tags

$$
\text{B-PER I-PER I-PER O B-ORG I-ORG O B-LOC O}
$$

## 25.2 Predicted tags

$$
\text{B-PER I-PER O O B-ORG I-ORG O O O}
$$

## 25.3 Tags থেকে implied entities

Visible BIO tags থেকে:

### Gold entities

- `Dr Maya Chen` = PER
- `Acme Labs` = ORG
- `Bristol` = LOC

### Predicted entities

- `Dr Maya` = PER
- `Acme Labs` = ORG
- কোনো LOC entity predicted হয়নি

## 25.4 Slide-এর entity counts

### PER

$$
TP = 0,\quad FP = 1,\quad FN = 1
$$

কারণ:

- predicted person span incomplete;
- gold person span হলো `Dr Maya Chen`;
- predicted person span হলো `Dr Maya`।

### ORG

$$
TP = 1,\quad FP = 0,\quad FN = 0
$$

কারণ:

- `Acme Labs` correctly ORG হিসেবে predicted।

### LOC

$$
TP = 0,\quad FP = 0,\quad FN = 1
$$

কারণ:

- `Bristol` gold tags-এ আছে;
- prediction-এ miss হয়েছে।

## 25.5 Key point

Person prediction wrong, কারণ predicted span incomplete।

---

# 26. Worked NER example: counting entities, version 2

একটি later slide দ্বিতীয় entity-counting example দিয়েছে।

## 26.1 Gold entities

- `Maya Chen` = PER
- `Acme Labs` = ORG
- `Bristol` = LOC

## 26.2 Predicted entities

- `Maya Chen` = PER
- `Acme` = ORG
- `Bristol` = LOC

## 26.3 Counts

### PER

$$
TP = 1,\quad FP = 0,\quad FN = 0
$$

কারণ:

- `Maya Chen` correctly PER হিসেবে predicted।

### ORG

$$
TP = 0,\quad FP = 1,\quad FN = 1
$$

কারণ:

- gold entity হলো `Acme Labs`;
- predicted entity শুধু `Acme`;
- predicted span partial;
- partial spans true positives হিসেবে count হয় না।

### LOC

$$
TP = 1,\quad FP = 0,\quad FN = 0
$$

কারণ:

- `Bristol` correctly LOC হিসেবে predicted।

## 26.4 Key point

Partially correct span true positive হিসেবে count হয় না।

## 26.5 [UNCLEAR] দুই NER example-এর relationship

**[UNCLEAR]** দুই NER example খুব similar names ব্যবহার করেছে কিন্তু spans এবং counts আলাদা। Version 1-এ gold person span `Dr` include করে এবং `Bristol` missed। Version 2-এ gold person `Maya Chen`, এবং `Bristol` correctly predicted। এগুলো দুইটি separate example, নাকি একটি slide অন্যটির correction/replacement — recording check করুন।

---

# 27. Worked example: NER-এর micro-averaged F1

Micro-averaged NER example দ্বিতীয় NER example-এর counts ব্যবহার করে।

## 27.1 Entity type অনুযায়ী counts

| Entity type | TP | FP | FN |
|---|---:|---:|---:|
| PER | 1 | 0 | 0 |
| ORG | 0 | 1 | 1 |
| LOC | 1 | 0 | 0 |

## 27.2 Entity types জুড়ে counts pool করা

$$
TP_{total}
=
1 + 0 + 1
=
2
$$

$$
FP_{total}
=
0 + 1 + 0
=
1
$$

$$
FN_{total}
=
0 + 1 + 0
=
1
$$

## 27.3 Micro precision

$$
Precision_{micro}
=
\frac{2}{2 + 1}
$$

$$
Precision_{micro}
=
0.667
$$

## 27.4 Micro recall

$$
Recall_{micro}
=
\frac{2}{2 + 1}
$$

$$
Recall_{micro}
=
0.667
$$

## 27.5 Micro F1

$$
F1_{micro}
=
\frac{2 \times 0.667 \times 0.667}{0.667 + 0.667}
$$

$$
F1_{micro}
=
0.667
$$

## 27.6 Interpretation

Micro-averaging categories জুড়ে সব entity decisions combine করার পর একটি overall score দেয়।

---

# 28. Module 5 overview: Open Information Extraction

শেষের slides-এ Module 5 সংক্ষেপে introduce করা হয়েছে।

## 28.1 Topics listed

Module 5 covers:

- Open Information Extraction কী;
- OpenIE কীভাবে predefined relation extraction থেকে আলাদা;
- classical এবং neural OpenIE approaches-এর brief view।

---

# 29. Open Information Extraction কী

## 29.1 Definition

**Open Information Extraction** fixed predefined schema-এর ওপর depend না করে text থেকে relational facts extract করে।

## 29.2 Input

Input হতে পারে:

- raw sentences;
- documents।

## 29.3 Output

Output হলো relation tuples, যেমন:

$$
(\text{argument}, \text{relation}, \text{argument})
$$

## 29.4 Goal

OpenIE unstructured text-কে machine-readable knowledge-এ convert করতে চায়।

## 29.5 Intuition

OpenIE arbitrary text থেকে relation-like facts identify করার চেষ্টা করে, যেখানে আগে থেকে fixed relation types-এর inventory দরকার হয় না।

---

# 30. OpenIE extraction দেখতে কেমন

## 30.1 Slide-এর sentence

$$
\text{Albert Einstein published the theory of relativity in 1915.}
$$

## 30.2 Example extractions

স্লাইডে দেওয়া হয়েছে:

$$
(\text{Albert Einstein};\ \text{published};\ \text{the theory of relativity})
$$

$$
(\text{Albert Einstein};\ \text{published in};\ \text{1915})
$$

## 30.3 Interpretation

Sentence-টি relational tuples-এ convert করা হয়েছে।

একটি tuple capture করে Einstein কী publish করেছিলেন।

অন্যটি publishing relation-এর সঙ্গে associated year capture করে।

---

# 31. Earlier NLP steps-এর ওপর OpenIE dependencies

স্লাইডে বলা হয়েছে OpenIE heavily rely করে earlier NLP steps-এর ওপর:

- POS tagging;
- parsing;
- entity recognition।

## 31.1 Earlier material-এর সঙ্গে connection

এটি OpenIE-কে course-এর আগের অংশগুলোর সঙ্গে connect করে:

- POS tagging grammatical roles এবং lexical categories identify করতে help করে।
- Parsing syntactic structure identify করতে help করে।
- Entity recognition people, organisations, locations, বা অন্যান্য named entities-এর মতো arguments identify করতে help করে।

---

# 32. OpenIE methods এবং limits

## 32.1 Classical methods

স্লাইডে বলা হয়েছে classical methods ব্যবহার করত:

- patterns;
- dependency structure;
- clause splitting।

## 32.2 Later methods

পরে introduce হয়েছে:

- supervised approaches;
- neural approaches।

## 32.3 Common challenges

স্লাইডে common challenges হিসেবে দেওয়া হয়েছে:

- ambiguity;
- synonymy;
- coreference;
- extracted facts-এর trustworthiness।

## 32.4 Assessment scope

স্লাইডে explicitly বলা হয়েছে:

> In this module, OpenIE is a compact application case rather than the main assessment focus.

এটি assessment-relevant signal।

---

# 33. Key concepts glossary

## 33.1 Evaluation

### Intuition

System কত ভালো perform করে তা test করা।

### Slide definition

Evaluation হলো কোনো কিছুর amount, number, বা value নিয়ে judgement করা। Computer science-এ এটি testing-এর synonym।

---

## 33.2 Benchmark dataset

### Intuition

Systems fairly compare করার জন্য shared dataset।

### Slide definition / components

Benchmark dataset-এ থাকে:

- inputs;
- gold-standard labels;
- fixed evaluation protocol।

---

## 33.3 Gold standard

### Intuition

System outputs judge করার জন্য reference answer।

### Slide definition

Gold standards সাধারণত human annotators তৈরি করে, annotation guidelines follow করে।

---

## 33.4 Annotation guidelines

### Intuition

Examples কীভাবে label করতে হবে তা annotators-কে বলা instructions।

### Slide wording

স্লাইডে এগুলোকে annotation instructions বা annotation guidelines বলা হয়েছে।

---

## 33.5 Inter-annotator agreement

### Intuition

Human annotators একই examples একইভাবে label করে কি না তার measure।

### Slide definition

Inter-annotator agreement measures how consistently humans label the same data.

---

## 33.6 Observed agreement

### Intuition

Annotators যেসব item-এ agree করে তার raw proportion।

### Formal definition

$$
P_a
=
\frac{\text{agreed items}}{\text{total items}}
$$

---

## 33.7 Expected agreement

### Intuition

প্রতিটি annotator কতবার প্রতিটি label ব্যবহার করে তার ভিত্তিতে chance-এর কারণে expected agreement।

### Formal pattern from slide

$$
P_e
=
\sum_c P(A1=c)P(A2=c)
$$

---

## 33.8 Cohen's Kappa

### Intuition

Chance agreement correct করার পর agreement।

### Formal definition

$$
K
=
\frac{P_a - P_e}{1 - P_e}
$$

---

## 33.9 Confusion matrix

### Intuition

Positive এবং negative cases অনুযায়ী correct ও incorrect decisions-এর table।

### Formal labels

$$
TP, FP, FN, TN
$$

যেখানে:

- $TP$: predicted positive, actually positive;
- $FP$: predicted positive, actually negative;
- $FN$: predicted negative, actually positive;
- $TN$: predicted negative, actually negative।

---

## 33.10 Precision

### Intuition

Selected/predicted positive items-এর মধ্যে কতগুলো correct।

### Formula

$$
Precision
=
\frac{TP}{TP + FP}
$$

---

## 33.11 Recall

### Intuition

Truly positive items-এর মধ্যে system কতগুলো find করেছে।

### Formula

$$
Recall
=
\frac{TP}{TP + FN}
$$

---

## 33.12 F-score / F1-score

### Intuition

Precision এবং recall-এর conservative combined measure।

### Formal definition

$$
F_\beta
=
\frac{(\beta^2 + 1)PR}{\beta^2P + R}
$$

Balanced F1-এর জন্য:

$$
F_1
=
\frac{2PR}{P + R}
$$

---

## 33.13 Accuracy

### Intuition

Overall correct decisions-এর proportion।

### Formula

$$
Accuracy
=
\frac{TP + TN}{TP + TN + FP + FN}
$$

---

## 33.14 Macro average

### Intuition

প্রতিটি class-কে equally treat করা।

### Slide definition

প্রতিটি class-এর metric compute করে, তারপর classes-এর ওপর equally average করা।

---

## 33.15 Micro average

### Intuition

Metric compute করার আগে সব decisions এক pooled set হিসেবে treat করা।

### Slide definition

প্রথমে সব TP, FP, এবং FN pool করা, তারপর metric একবার compute করা।

---

## 33.16 Weighted average

### Intuition

যেসব class-এ true instances বেশি, final average-এ সেগুলোর contribution বেশি।

### Slide definition

Class frequency weights ব্যবহার করে class-level metrics average করা।

---

## 33.17 Entity-level NER evaluation

### Intuition

NER predictions-কে full entity span এবং type match করতে হবে; শুধু individual token যথেষ্ট নয়।

### Slide key point

Partially correct span true positive হিসেবে count হয় না।

---

## 33.18 Open Information Extraction

### Intuition

Fixed relation schema ছাড়া arbitrary text থেকে relation-like facts extract করা।

### Slide definition

OpenIE fixed predefined schema-এর ওপর rely না করে text থেকে relational facts extract করে।

### Output form

$$
(\text{argument}, \text{relation}, \text{argument})
$$

---

# 34. Formula sheet

## 34.1 Observed agreement

$$
P_a
=
\frac{\text{number of agreements}}{\text{total number of items}}
$$

## 34.2 Expected agreement

$$
P_e
=
\sum_c P(A1=c)P(A2=c)
$$

## 34.3 Cohen's Kappa

$$
K
=
\frac{P_a - P_e}{1 - P_e}
$$

## 34.4 Precision

$$
Precision
=
\frac{TP}{TP + FP}
$$

## 34.5 Recall

$$
Recall
=
\frac{TP}{TP + FN}
$$

## 34.6 General F-score

$$
F_\beta
=
\frac{(\beta^2 + 1)PR}{\beta^2P + R}
$$

## 34.7 Balanced F1

$$
F_1
=
\frac{2PR}{P + R}
$$

## 34.8 Accuracy

$$
Accuracy
=
\frac{TP + TN}{TP + TN + FP + FN}
$$

## 34.9 Micro-averaging counts

Classes $i$-এর জন্য:

$$
TP_{total}
=
\sum_i TP_i
$$

$$
FP_{total}
=
\sum_i FP_i
$$

$$
FN_{total}
=
\sum_i FN_i
$$

তারপর compute:

$$
Precision_{micro}
=
\frac{TP_{total}}{TP_{total}+FP_{total}}
$$

$$
Recall_{micro}
=
\frac{TP_{total}}{TP_{total}+FN_{total}}
$$

$$
F1_{micro}
=
\frac{2P_{micro}R_{micro}}{P_{micro}+R_{micro}}
$$

---

# 35. Worked examples checklist

## 35.1 Observed agreement

$$
P_a
=
\frac{7}{10}
=
0.70
$$

## 35.2 Expected agreement

$$
P_e
=
(0.6 \times 0.5) + (0.4 \times 0.5)
=
0.30 + 0.20
=
0.50
$$

## 35.3 Simple example থেকে Cohen's Kappa

$$
K
=
\frac{0.70 - 0.50}{1 - 0.50}
=
0.40
$$

## 35.4 Yes/no table থেকে Cohen's Kappa

$$
P_a = 0.925
$$

$$
P_e = 0.695
$$

$$
K
=
\frac{0.925 - 0.695}{1 - 0.695}
\approx
0.754
$$

## 35.5 Blue stars example

$$
TP=5,\quad FP=2,\quad FN=1,\quad TN=4
$$

$$
Precision
=
\frac{5}{5+2}
=
0.714
$$

$$
Recall
=
\frac{5}{5+1}
=
0.833
$$

## 35.6 F-score vs arithmetic mean, example 1

$$
P=0.714,\quad R=0.833
$$

$$
\text{Arithmetic mean}=0.774
$$

$$
F_1=0.769
$$

## 35.7 F-score vs arithmetic mean, example 2

$$
P=1,\quad R=0.15
$$

$$
\text{Arithmetic mean}=0.575
$$

$$
F_1=0.261
$$

## 35.8 Spam detector

$$
TP=18,\quad FP=6,\quad FN=9
$$

$$
Precision=0.75
$$

$$
Recall\approx0.67
$$

$$
F_1\approx0.71
$$

## 35.9 Person এবং Location-এর macro average

$$
P_{macro}
=
\frac{0.94+0.87}{2}
=
0.91
$$

$$
R_{macro}
=
\frac{0.70+0.91}{2}
=
0.81
$$

$$
F1
=
\frac{2\times0.91\times0.81}{0.91+0.81}
=
0.86
$$

## 35.10 Person এবং Location-এর micro average

$$
TP_{total}=98
$$

$$
FP_{total}=8
$$

$$
FN_{total}=35
$$

$$
P_{micro}
=
\frac{98}{98+8}
\approx
0.92
$$

$$
R_{micro}
=
\frac{98}{98+35}
\approx
0.74
$$

$$
F1_{micro}
=
\frac{2\times0.92\times0.74}{0.92+0.74}
=
0.82
$$

## 35.11 NER micro-average

$$
TP_{total}=2
$$

$$
FP_{total}=1
$$

$$
FN_{total}=1
$$

$$
Precision_{micro}=0.667
$$

$$
Recall_{micro}=0.667
$$

$$
F1_{micro}=0.667
$$

## 35.12 OpenIE extraction

Sentence:

$$
\text{Albert Einstein published the theory of relativity in 1915.}
$$

Extractions:

$$
(\text{Albert Einstein};\ \text{published};\ \text{the theory of relativity})
$$

$$
(\text{Albert Einstein};\ \text{published in};\ \text{1915})
$$

---

# 36. Exam flags এবং assessment signals

## 36.1 Explicit exam wording

Provided slides-এ সরাসরি “this will be on the exam” wording দেখা যায় না।

**[UNCLEAR]** আলাদা transcript দেওয়া হয়নি, তাই spoken exam hints missing থাকতে পারে।

## 36.2 Explicit assessment signal

OpenIE slide-এ বলা হয়েছে OpenIE হলো:

$$
\text{a compact application case rather than the main assessment focus}
$$

এটি high-value assessment signal: OpenIE বুঝতে হবে, কিন্তু evaluation metrics section-এর তুলনায় main examinable weight likely কম।

## 36.3 Slide emphasis অনুযায়ী high-value revision targets

Calculation-heavy এবং তাই revision-critical অংশগুলো:

- observed agreement;
- expected agreement;
- Cohen's Kappa;
- confusion matrix counts;
- precision;
- recall;
- F1;
- imbalanced data-তে accuracy vs F1;
- micro vs macro averaging;
- entity-level NER counting;
- partial NER spans কেন true positives নয়।

---

# 37. Earlier material এবং applications-এর সঙ্গে connections

## 37.1 Gold standards এবং annotation

Evaluation human annotation এবং annotation guidelines-এর ওপর depend করে।

এটি evaluation-কে data construction-এর সঙ্গে connect করে: model-এর score ততটাই reliable যতটা reliable reference labels।

## 37.2 Evaluation এবং NER

NER evaluation একই TP/FP/FN framework ব্যবহার করে, কিন্তু entity level-এ।

এটি connect করে:

- BIO tags;
- entity spans;
- entity types;
- precision, recall, এবং F1।

## 37.3 OpenIE এবং earlier NLP pipeline steps

OpenIE heavily rely করে earlier NLP steps-এর ওপর:

- POS tagging;
- parsing;
- entity recognition।

এটি relation extraction-কে basic NLP pipeline-এর সঙ্গে connect করে।

## 37.4 Evaluation এবং imbalanced classification

Hate vs Neutral example evaluation metrics-কে applied text classification-এর সঙ্গে connect করে, যেখানে positive class rare কিন্তু important হতে পারে।

---

# 38. Recording-এ check করার unclear sections

1. **Kappa interpretation thresholds**
   - স্লাইডে কয়েকটি threshold scheme short inequality-style lines-এ compressed।
   - Lecturer preferred interpretation দিয়েছেন কি না check করুন।

2. **Macro F1 calculation**
   - স্লাইডে averaged precision এবং recall থেকে F1 compute করা হয়েছে।
   - Lecturer class-level F1 values separately average করা নিয়ে আলোচনা করেছেন কি না check করুন।

3. **Micro vs macro vs weighted averaging**
   - “Which is better?” slide brief।
   - Class imbalance এবং rare-class influence নিয়ে lecturer-এর exact explanation check করুন।

4. **NER example consistency**
   - এক slide-এ BIO tags অনুযায়ী gold PER সম্ভবত `Dr Maya Chen`, predicted PER `Dr Maya`, এবং Bristol missed।
   - আরেক slide-এ gold `Maya Chen`, predicted `Maya Chen`, gold `Acme Labs`, predicted `Acme`, এবং Bristol correctly predicted।
   - এগুলো separate examples নাকি corrected version তা check করুন।

5. **F1 spam detector formula formatting**
   - Parsed slide text-এ equation formatting garbled।
   - Cleaned calculation উপরে দেওয়া হয়েছে, কিন্তু lecturer-এর exact steps confirm করতে recording শুনুন।

6. **Transcript-specific exam flags**
   - আলাদা transcript পাওয়া যায়নি, তাই spoken “this is important” বা “this will be on the exam” signals missing থাকতে পারে।
