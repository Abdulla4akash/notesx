---
subject: COMP64702
chapter: 10
title: "Evaluation & OpenIE"
language: en
---

# Structured Study Notes — NLP Evaluation Methods and Open Information Extraction

**Topic and scope:** This lecture is mainly about how NLP systems are evaluated: benchmark data, gold standards, annotation reliability, inter-annotator agreement, Cohen's Kappa, confusion matrices, precision, recall, F1, accuracy, averaging methods, and entity-level NER evaluation. It ends with a short introductory section on Open Information Extraction as a compact application case rather than the main assessment focus.

**Course:** Not specified. Inferred area from the slides: NLP / Text Mining.

**Lecture topic:** Module 4 — Evaluation Method; short start of Module 5 — Open Information Extraction.

**Source coverage note:** The two uploaded PDFs are identical copies of the same 41-page slide deck. No separate lecture transcript text was provided in the conversation, so these notes are based on the slide text and slide visuals only. Any point that needs the recording/transcript is marked **[UNCLEAR]**.

---

# 1. Module 4 overview: Evaluation Method

## 1.1 Topics listed at the start of the lecture

The opening slide lists the main scope of Module 4:

- why evaluation is essential in NLP;
- benchmark datasets and gold-standard annotations;
- why annotation reliability matters;
- inter-annotator agreement;
- observed agreement, expected agreement, and Cohen's Kappa;
- the confusion matrix: TP, FP, FN, TN;
- precision, recall, and F1-score;
- when accuracy can be misleading;
- micro, macro, and weighted averages;
- entity-level evaluation for NER.

This outline mirrors the structure of the lecture: the lecturer moves from the motivation for evaluation, through annotation reliability, then into scoring metrics and NER-specific evaluation.

---

# 2. What “evaluation” means

## 2.1 General meaning

The slide gives a dictionary-style definition of **evaluation** as making a judgement about the amount, number, or value of something.

## 2.2 Computer science meaning

In computer science, the slide says evaluation is synonymous with:

$$
\text{testing}
$$

## 2.3 Intuition

Evaluation is the process of checking how well a method, model, or system performs. In NLP, this usually means comparing system output against some reference or gold standard.

---

# 3. Why we evaluate NLP systems

## 3.1 Main purpose

Evaluation tells us how well a system is performing.

## 3.2 Different stakeholders care for different reasons

### Users

Users care about whether the system is useful for a task.

Example intuition from the slide structure:

- A user does not only care that a system runs.
- They care whether it produces useful outputs for their task.

### Developers

Developers care about whether the system is improving over time.

This matters when comparing:

- earlier and later model versions;
- different modelling choices;
- different features or architectures;
- different datasets or preprocessing pipelines.

## 3.3 Evaluation supports

The slide explicitly lists four uses of evaluation:

1. **Comparison**
   - comparing systems, methods, model versions, or experimental settings.

2. **Debugging**
   - identifying where and how a system fails.

3. **Model selection**
   - choosing which model to keep or deploy.

4. **Scientific reporting**
   - reporting results in a reproducible and comparable way.

---

# 4. Benchmark data and gold standards

## 4.1 Benchmark datasets

### Definition

A **benchmark dataset** is a dataset used as a standard basis for evaluating and comparing systems.

### Slide definition / components

The slides state that performance evaluation is often based on benchmark datasets, and that these datasets contain:

- **inputs**;
- **gold-standard labels**;
- **a fixed evaluation protocol**.

### Intuition

A benchmark lets different systems be evaluated under the same conditions. Without a common dataset and protocol, comparison is weak because systems might be tested on different inputs or scored in different ways.

---

## 4.2 Gold standards

### Definition

A **gold standard** is the reference annotation or label set against which system predictions are compared.

### Slide details

Gold standards are usually created by human annotators following annotation guidelines.

Reliable evaluation depends on reliable annotation.

### Intuition

If the gold standard is noisy or inconsistent, then the system's score is less trustworthy. A model can be penalised or rewarded because of annotation problems rather than because of its real performance.

---

## 4.3 Shared task / community challenge setup

The performance evaluation slide mentions community challenges and shared tasks, with examples shown visually including **Kaggle** and **SemEval**.

A shared task setup usually has:

- a specific task that is defined;
- gold-standard data provided for:
  - training;
  - development;
  - testing.

## 4.4 Response vs reference

The slide says automated scoring compares:

- **response** = system-generated annotations or predictions;
- **reference** = gold standard.

### Intuition

The system produces a response. The gold standard provides the reference. Evaluation measures how closely the response matches the reference.

---

# 5. Gold-standard data creation

## 5.1 Cost and time

Gold-standard data is:

- time-consuming to produce;
- costly to produce.

## 5.2 Annotation guidelines

Gold-standard annotation requires **annotation instructions**, also called:

$$
\text{annotation guidelines}
$$

### Definition

Annotation guidelines are instructions that tell annotators how to assign labels consistently.

### Intuition

Guidelines reduce ambiguity. If annotators are not told how to handle borderline cases, different annotators will make different decisions.

## 5.3 Annotators

Annotations are done by experts.

The slide notes that annotators may need some training in linguistics.

## 5.4 Multiple annotators

The slide states that multiple annotators need to label the same samples, at least for a subset of the data.

Reason:

- to check whether annotation is reliable;
- to calculate inter-annotator agreement;
- because disagreements may occur.

---

# 6. Inter-annotator agreement

## 6.1 Definition

**Inter-annotator agreement** measures how consistently humans label the same data.

## 6.2 Why it matters

Human annotations are not always identical.

Different annotators may interpret a guideline differently.

High agreement suggests that:

- the task is clearer;
- the annotation guidelines are clearer;
- the resulting annotations are more reliable.

## 6.3 Intuition vs formalism

### Intuition

If two annotators see the same item and usually choose the same label, the task and guidelines are probably well defined.

If they often disagree, the task may be ambiguous, the guidelines may be unclear, or the annotators may need more training.

### Formal scoring idea

Agreement can be measured numerically. The lecture introduces:

- observed agreement $P_a$;
- expected agreement $P_e$;
- Cohen's Kappa $K$.

---

# 7. Observed agreement: $P_a$

## 7.1 Definition

Observed agreement is the proportion of cases on which annotators agree.

## 7.2 Formula

$$
P_a
=
\frac{\text{number of items annotators agree on}}{\text{total number of items}}
$$

## 7.3 Worked example from slide

Two annotators label 10 items.

They agree on 7 items.

Therefore:

$$
P_a
=
\frac{7}{10}
=
0.70
$$

## 7.4 Limitation

Observed agreement does **not** correct for chance agreement.

### Intuition

Annotators can agree sometimes just by chance, especially if there are only a few labels or if one label is very common.

---

# 8. Expected agreement: $P_e$

## 8.1 Definition

Expected agreement estimates how much agreement would happen by chance.

## 8.2 General pattern from the slide example

For each label, multiply the probability that Annotator A assigns that label by the probability that Annotator B assigns that label, then sum across labels.

For labels $c$:

$$
P_e
=
\sum_c P(A1=c)P(A2=c)
$$

## 8.3 Worked example from slide

Suppose:

- Annotator A assigns:
  - Positive to $6/10$ items;
  - Negative to $4/10$ items.

- Annotator B assigns:
  - Positive to $5/10$ items;
  - Negative to $5/10$ items.

Chance agreement on Positive:

$$
0.6 \times 0.5 = 0.30
$$

Chance agreement on Negative:

$$
0.4 \times 0.5 = 0.20
$$

So:

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

**Cohen's Kappa** corrects observed agreement for chance agreement.

## 9.2 Formula

$$
K
=
\frac{P_a - P_e}{1 - P_e}
$$

where:

- $P_a$ = observed agreement;
- $P_e$ = expected agreement by chance.

## 9.3 Worked example using the previous $P_a$ and $P_e$

From the previous examples:

$$
P_a = 0.70
$$

$$
P_e = 0.50
$$

Substitute into the formula:

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

## 9.4 Why Kappa is useful

The slide states that Kappa is more informative than raw agreement alone because it corrects for chance agreement.

---

# 10. Kappa coefficient: worked table example

The slides include a table with two annotators and yes/no labels.

## 10.1 Table values

| Annotator 2 \ Annotator 1 | yes | no | total |
|---|---:|---:|---:|
| yes | 31 | 1 | 32 |
| no | 2 | 6 | 8 |
| total | 33 | 7 | 40 |

## 10.2 Observed agreement for the table

Observed agreement is agreement on the diagonal:

- both say yes: 31;
- both say no: 6;
- total items: 40.

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

## 10.3 Expected agreement for the table

The slide gives:

$$
P(e)
=
P(A1=\text{yes})P(A2=\text{yes})
+
P(A1=\text{no})P(A2=\text{no})
$$

Use marginal probabilities:

- Annotator 1 yes: $33/40$;
- Annotator 2 yes: $32/40$;
- Annotator 1 no: $7/40$;
- Annotator 2 no: $8/40$.

So:

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

## 10.4 Cohen's Kappa for the table

Using the Kappa formula:

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

So this table gives a Kappa of approximately:

$$
K \approx 0.75
$$

---

# 11. Kappa coefficient interpretation

The slide lists several interpretation schemes. These are not all identical, so interpretation of a Kappa score depends on which scheme is being used.

## 11.1 Landis and Koch, 1977

The slide lists:

$$
\text{slight} < 0.2 < \text{fair} < 0.4 < \text{moderate} < 0.6 < \text{substantial} < 0.8 < \text{perfect}
$$

Interpreted as thresholds:

- below 0.2: slight;
- around 0.2-0.4: fair;
- around 0.4-0.6: moderate;
- around 0.6-0.8: substantial;
- above 0.8: close to perfect.

Using this scale, the table example $K \approx 0.754$ would fall around the **substantial** range.

## 11.2 Grove et al., 1981

The slide says:

$$
0.6 < \text{acceptable}
$$

This means acceptable agreement is above about 0.6.

## 11.3 Krippendorff, 1980

The slide says:

$$
0.67 < \text{tentative conclusions} < 0.8 < \text{definite conclusions}
$$

Interpretation from the slide wording:

- above 0.67: tentative conclusions;
- above 0.8: definite conclusions.

## 11.4 Rietveld and van Hout, 1993

The slide lists:

$$
0.4 < \text{moderate} < 0.6 < \text{substantial} < 0.8
$$

## 11.5 Green, 1997

The slide lists:

$$
\text{low} < 0.4 < \text{fair/good} < 0.75 < \text{high}
$$

## 11.6 [UNCLEAR] Interpretation thresholds

**[UNCLEAR]** The threshold notation on the slide is compressed. The exact intended verbal interpretation should be checked in the recording, especially if the lecturer explained which interpretation scheme the course prefers.

---

# 12. Scoring and the confusion matrix

## 12.1 Precision and recall in annotation wording

The scoring slide defines:

- **Precision** = fraction of annotated items that are correct.
- **Recall** = fraction of correct items that are annotated.

This wording is useful when thinking about annotation or retrieval:

- annotated/predicted items are the items the system selected;
- correct items are the items that should have been selected.

## 12.2 Confusion matrix from the scoring slide

|  | Correct | Not correct |
|---|---|---|
| Annotated | True positive (TP) | False positive (FP) |
| Not annotated | False negative (FN) | True negative (TN) |

## 12.3 Automated prediction confusion matrix

A later slide gives the prediction/evaluation version:

|  | Positive response | Negative response |
|---|---|---|
| Positive reference | True positive (TP) | False negative (FN) |
| Negative reference | False positive (FP) | True negative (TN) |

## 12.4 Definitions for a positive class

For a positive class:

- **TP: true positive**
  - predicted positive, actually positive.

- **FP: false positive**
  - predicted positive, actually negative.

- **FN: false negative**
  - predicted negative, actually positive.

- **TN: true negative**
  - predicted negative, actually negative.

## 12.5 Why the confusion matrix matters

Many common metrics are derived from these four counts:

$$
TP, FP, FN, TN
$$

These counts are the basis for precision, recall, F1, and accuracy.

---

# 13. Precision

## 13.1 Intuition

Precision asks:

> Of the items predicted as positive, how many are correct?

In annotation wording:

> Of the annotated items, what fraction are correct?

## 13.2 Formula

$$
Precision
=
\frac{TP}{TP + FP}
$$

## 13.3 What precision penalises

Precision penalises false positives.

If the system predicts many items as positive but many of them are wrong, precision decreases.

---

# 14. Recall

## 14.1 Intuition

Recall asks:

> Of the truly positive items, how many did the system find?

In annotation wording:

> Of the correct items, what fraction are annotated?

## 14.2 Formula

$$
Recall
=
\frac{TP}{TP + FN}
$$

## 14.3 What recall penalises

Recall penalises false negatives.

If the system misses many true positive items, recall decreases.

---

# 15. Worked visual example: blue stars

The slides use a visual example with blue stars and red ovals.

The target class is:

$$
\text{Blue stars}
$$

A large circle marks the items the system/annotation selected as blue stars.

## 15.1 Counts shown in the visual

The visual labels the items as:

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

- 5 blue stars are inside the selected region: true positives.
- 2 red ovals are inside the selected region: false positives.
- 1 blue star is outside the selected region: false negative.
- 4 red ovals are outside the selected region: true negatives.

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

The slide says F-score is also called:

- F-measure;
- F1-score.

## 16.2 Definition

F-score is a weighted harmonic mean of precision and recall.

## 16.3 General $F_\beta$ formula

$$
F_\beta
=
\frac{(\beta^2 + 1)PR}{\beta^2P + R}
$$

where:

- $P$ = precision;
- $R$ = recall;
- $\beta$ controls the balance between precision and recall.

## 16.4 Balanced F1

Usually, the balanced F1 measure is used, where:

$$
\beta = 1
$$

Then:

$$
F_1
=
\frac{2PR}{P + R}
$$

## 16.5 Intuition

The slide states that the harmonic mean is a more conservative average and gives a truer picture.

This matters because F1 becomes low when either precision or recall is low.

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

The F-score is slightly lower than the arithmetic mean.

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

The arithmetic mean looks moderately high, but F1 is much lower because recall is very poor. This demonstrates the slide's point that the harmonic mean is more conservative.

---

# 18. Worked example: computing F1 for a spam detector

The slide gives a spam detector example.

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

The slide says this shows the full calculation from counts to F1.

## 18.5 [UNCLEAR] Formula formatting on slide

**[UNCLEAR]** The slide text for the F1 calculation is garbled in the parsed text and missing clear fraction formatting. The cleaned version above follows the formula already given on the F1 slide.

---

# 19. Accuracy

## 19.1 Definition

Accuracy measures the proportion of all correctly identified cases.

## 19.2 Formula

$$
Accuracy
=
\frac{TP + TN}{TP + TN + FP + FN}
$$

## 19.3 When accuracy is suitable

The slide states that accuracy is suitable if all classes are equally important.

## 19.4 When accuracy can mislead

Accuracy can be misleading on imbalanced datasets.

## 19.5 Imbalanced dataset example

The slide gives the example:

- if 95% of items are negative;
- always predicting negative gives 95% accuracy;
- but recall for the positive class is 0.

Reason:

- the system never identifies any positive item;
- all actual positive cases become false negatives;
- therefore:

$$
Recall
=
\frac{TP}{TP + FN}
=
0
$$

## 19.6 Example task mentioned

The slide mentions:

$$
\text{Hate vs Neutral}
$$

as an example where accuracy may not be enough if the classes are not equally important.

## 19.7 Slide recommendation

The slide says:

$$
\text{Use F-score}
$$

in such cases.

---

# 20. Multiple categories: micro vs macro averaging

The slides ask how to report combined performance for:

- Person;
- Location.

The given table is:

| Category | TPs | FPs | FNs | Precision | Recall |
|---|---:|---:|---:|---:|---:|
| Person | 78 | 5 | 33 | 0.94 | 0.70 |
| Location | 20 | 3 | 2 | 0.87 | 0.91 |

---

# 21. Macro-averaging

## 21.1 Definition

Macro-averaging computes the metric for each class, then averages across classes equally.

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

The slide computes F1 from the averaged precision and averaged recall:

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

**[UNCLEAR]** The slide shows F1 being computed from averaged precision and averaged recall. It does not show whether the lecturer distinguished this from averaging the class-level F1 values directly. Check the recording if this distinction matters for the exam.

---

# 22. Micro-averaging

## 22.1 Definition

Micro-averaging pools together the TPs, FPs, and FNs first, then computes the metric once.

## 22.2 Pooling counts

From the table:

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

The slide defines weighted average as:

$$
\text{average weighted by the number of true instances for each class}
$$

## 23.2 Intuition

A weighted average gives more influence to classes with more true instances.

## 23.3 Choice of averaging method

The slide states:

- macro-averaging does not consider class imbalance;
- micro-averaging is less sensitive to imbalance;
- weighted average weights by the number of true instances for each class.

The slides also state that the choice affects how strongly rare classes influence the final score.

## 23.4 [UNCLEAR] “Which is better?” explanation

**[UNCLEAR]** The slide is brief here. Check the recording for the lecturer's precise explanation of when to use macro, micro, or weighted averaging, especially because the choice affects rare classes.

---

# 24. Entity-level evaluation for NER

## 24.1 Main idea

NER evaluation is entity-level, not just token-level.

A predicted entity should count as correct only when the entity match is exact.

## 24.2 Key point from slide

The slide explicitly says:

> A partially correct span does not count as a true positive.

## 24.3 Intuition

For NER, predicting only part of an entity is not enough. The system must get the full span and entity type right.

Example:

- Gold: `Acme Labs` = ORG
- Predicted: `Acme` = ORG

This is a partial span, so it is not a true positive.

---

# 25. Worked NER example: counting entities, version 1

The slide gives the following token sequence:

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

## 25.3 Entities implied by the tags

From the visible BIO tags:

### Gold entities

- `Dr Maya Chen` = PER
- `Acme Labs` = ORG
- `Bristol` = LOC

### Predicted entities

- `Dr Maya` = PER
- `Acme Labs` = ORG
- no LOC entity predicted

## 25.4 Entity counts from the slide

### PER

$$
TP = 0,\quad FP = 1,\quad FN = 1
$$

Reason:

- predicted person span is incomplete;
- gold person span is `Dr Maya Chen`;
- predicted person span is `Dr Maya`.

### ORG

$$
TP = 1,\quad FP = 0,\quad FN = 0
$$

Reason:

- `Acme Labs` is correctly predicted as ORG.

### LOC

$$
TP = 0,\quad FP = 0,\quad FN = 1
$$

Reason:

- `Bristol` is in the gold tags;
- it is missed in the prediction.

## 25.5 Key point

The person prediction is wrong because the predicted span is incomplete.

---

# 26. Worked NER example: counting entities, version 2

A later slide gives a second entity-counting example.

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

Reason:

- `Maya Chen` is correctly predicted as PER.

### ORG

$$
TP = 0,\quad FP = 1,\quad FN = 1
$$

Reason:

- gold entity is `Acme Labs`;
- predicted entity is only `Acme`;
- the predicted span is partial;
- partial spans do not count as true positives.

### LOC

$$
TP = 1,\quad FP = 0,\quad FN = 0
$$

Reason:

- `Bristol` is correctly predicted as LOC.

## 26.4 Key point

A partially correct span does not count as a true positive.

## 26.5 [UNCLEAR] Relationship between the two NER examples

**[UNCLEAR]** The two NER examples use very similar names but different spans and counts. In version 1, the gold person span includes `Dr`, and `Bristol` is missed. In version 2, the gold person is `Maya Chen`, and `Bristol` is correctly predicted. Check the recording to confirm whether these are intended as two separate examples or whether one slide corrected/replaced the other.

---

# 27. Worked example: micro-averaged F1 for NER

The micro-averaged NER example uses the counts from the second NER example.

## 27.1 Counts by entity type

| Entity type | TP | FP | FN |
|---|---:|---:|---:|
| PER | 1 | 0 | 0 |
| ORG | 0 | 1 | 1 |
| LOC | 1 | 0 | 0 |

## 27.2 Pool counts across entity types

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

Micro-averaging gives one overall score after combining all entity decisions across categories.

---

# 28. Module 5 overview: Open Information Extraction

The final slides briefly introduce Module 5.

## 28.1 Topics listed

Module 5 covers:

- what Open Information Extraction is;
- how OpenIE differs from predefined relation extraction;
- a brief view of classical and neural OpenIE approaches.

---

# 29. What Open Information Extraction is

## 29.1 Definition

**Open Information Extraction** extracts relational facts from text without relying on a fixed predefined schema.

## 29.2 Input

Input can be:

- raw sentences;
- documents.

## 29.3 Output

Output is relation tuples such as:

$$
(\text{argument}, \text{relation}, \text{argument})
$$

## 29.4 Goal

OpenIE aims to turn unstructured text into machine-readable knowledge.

## 29.5 Intuition

OpenIE tries to identify relation-like facts from arbitrary text without first requiring a fixed inventory of relation types.

---

# 30. What an OpenIE extraction looks like

## 30.1 Sentence from slide

$$
\text{Albert Einstein published the theory of relativity in 1915.}
$$

## 30.2 Example extractions

The slide gives:

$$
(\text{Albert Einstein};\ \text{published};\ \text{the theory of relativity})
$$

$$
(\text{Albert Einstein};\ \text{published in};\ \text{1915})
$$

## 30.3 Interpretation

The sentence is converted into relational tuples.

One tuple captures what Einstein published.

The other captures the year associated with the publishing relation.

---

# 31. OpenIE dependencies on earlier NLP steps

The slide states that OpenIE relies heavily on earlier NLP steps:

- POS tagging;
- parsing;
- entity recognition.

## 31.1 Connection to earlier material

This connects OpenIE to earlier parts of the course:

- POS tagging helps identify grammatical roles and lexical categories.
- Parsing helps identify syntactic structure.
- Entity recognition helps identify arguments such as people, organisations, locations, or other named entities.

---

# 32. OpenIE methods and limits

## 32.1 Classical methods

The slide says classical methods used:

- patterns;
- dependency structure;
- clause splitting.

## 32.2 Later methods

Later work introduced:

- supervised approaches;
- neural approaches.

## 32.3 Common challenges

The slide lists common challenges:

- ambiguity;
- synonymy;
- coreference;
- trustworthiness of extracted facts.

## 32.4 Assessment scope

The slide explicitly states:

> In this module, OpenIE is a compact application case rather than the main assessment focus.

This is an assessment-relevant signal.

---

# 33. Key concepts glossary

## 33.1 Evaluation

### Intuition

Testing how well a system performs.

### Slide definition

Evaluation is making a judgement about the amount, number, or value of something. In computer science, it is synonymous with testing.

---

## 33.2 Benchmark dataset

### Intuition

A shared dataset used to compare systems fairly.

### Slide definition / components

A benchmark dataset contains:

- inputs;
- gold-standard labels;
- a fixed evaluation protocol.

---

## 33.3 Gold standard

### Intuition

The reference answer used to judge system outputs.

### Slide definition

Gold standards are usually created by human annotators following annotation guidelines.

---

## 33.4 Annotation guidelines

### Intuition

Instructions that tell annotators how to label examples.

### Slide wording

The slides call these annotation instructions or annotation guidelines.

---

## 33.5 Inter-annotator agreement

### Intuition

A measure of whether human annotators label the same examples in the same way.

### Slide definition

Inter-annotator agreement measures how consistently humans label the same data.

---

## 33.6 Observed agreement

### Intuition

The raw proportion of items on which annotators agree.

### Formal definition

$$
P_a
=
\frac{\text{agreed items}}{\text{total items}}
$$

---

## 33.7 Expected agreement

### Intuition

The agreement expected by chance, based on how often each annotator uses each label.

### Formal pattern from slide

$$
P_e
=
\sum_c P(A1=c)P(A2=c)
$$

---

## 33.8 Cohen's Kappa

### Intuition

Agreement after correcting for chance agreement.

### Formal definition

$$
K
=
\frac{P_a - P_e}{1 - P_e}
$$

---

## 33.9 Confusion matrix

### Intuition

A table of correct and incorrect decisions split into positive and negative cases.

### Formal labels

$$
TP, FP, FN, TN
$$

where:

- $TP$: predicted positive, actually positive;
- $FP$: predicted positive, actually negative;
- $FN$: predicted negative, actually positive;
- $TN$: predicted negative, actually negative.

---

## 33.10 Precision

### Intuition

How many selected/predicted positive items are correct.

### Formula

$$
Precision
=
\frac{TP}{TP + FP}
$$

---

## 33.11 Recall

### Intuition

How many truly positive items the system finds.

### Formula

$$
Recall
=
\frac{TP}{TP + FN}
$$

---

## 33.12 F-score / F1-score

### Intuition

A conservative combined measure of precision and recall.

### Formal definition

$$
F_\beta
=
\frac{(\beta^2 + 1)PR}{\beta^2P + R}
$$

For balanced F1:

$$
F_1
=
\frac{2PR}{P + R}
$$

---

## 33.13 Accuracy

### Intuition

Overall proportion of correct decisions.

### Formula

$$
Accuracy
=
\frac{TP + TN}{TP + TN + FP + FN}
$$

---

## 33.14 Macro average

### Intuition

Treat every class equally.

### Slide definition

Compute the metric for each class, then average across classes equally.

---

## 33.15 Micro average

### Intuition

Treat all decisions as one pooled set before computing the metric.

### Slide definition

Pool all TP, FP, and FN first, then compute the metric once.

---

## 33.16 Weighted average

### Intuition

Classes with more true instances contribute more to the final average.

### Slide definition

Average class-level metrics using class frequency as weights.

---

## 33.17 Entity-level NER evaluation

### Intuition

NER predictions must match the full entity span and type, not merely individual tokens.

### Slide key point

A partially correct span does not count as a true positive.

---

## 33.18 Open Information Extraction

### Intuition

Extract relation-like facts from arbitrary text without a fixed relation schema.

### Slide definition

OpenIE extracts relational facts from text without relying on a fixed predefined schema.

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

For classes $i$:

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

Then compute:

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

## 35.3 Cohen's Kappa from simple example

$$
K
=
\frac{0.70 - 0.50}{1 - 0.50}
=
0.40
$$

## 35.4 Cohen's Kappa from yes/no table

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

## 35.9 Macro average for Person and Location

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

## 35.10 Micro average for Person and Location

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

# 36. Exam flags and assessment signals

## 36.1 Explicit exam wording

No explicit “this will be on the exam” wording appears in the provided slides.

**[UNCLEAR]** Because no separate transcript was provided, spoken exam hints may be missing.

## 36.2 Explicit assessment signal

The OpenIE slide states that OpenIE is:

$$
\text{a compact application case rather than the main assessment focus}
$$

This is a high-value assessment signal: OpenIE should be understood, but the main examinable weight is likely lower than the evaluation metrics section.

## 36.3 High-value revision targets from slide emphasis

The most calculation-heavy and therefore revision-critical parts are:

- observed agreement;
- expected agreement;
- Cohen's Kappa;
- confusion matrix counts;
- precision;
- recall;
- F1;
- accuracy vs F1 on imbalanced data;
- micro vs macro averaging;
- entity-level NER counting;
- why partial NER spans are not true positives.

---

# 37. Connections to earlier material and applications

## 37.1 Gold standards and annotation

Evaluation depends on human annotation and annotation guidelines.

This connects evaluation to data construction: a model's score is only as reliable as the reference labels.

## 37.2 Evaluation and NER

NER evaluation uses the same TP/FP/FN framework, but at the entity level.

This connects:

- BIO tags;
- entity spans;
- entity types;
- precision, recall, and F1.

## 37.3 OpenIE and earlier NLP pipeline steps

OpenIE relies heavily on earlier NLP steps:

- POS tagging;
- parsing;
- entity recognition.

This connects relation extraction to the basic NLP pipeline.

## 37.4 Evaluation and imbalanced classification

The Hate vs Neutral example connects the evaluation metrics to applied text classification, where the positive class may be rare but important.

---

# 38. Unclear sections to check in the recording

1. **Kappa interpretation thresholds**
   - The slide compresses several threshold schemes into short inequality-style lines.
   - Check whether the lecturer gave a preferred interpretation.

2. **Macro F1 calculation**
   - The slide computes F1 from averaged precision and recall.
   - Check whether the lecturer discussed averaging class-level F1 values separately.

3. **Micro vs macro vs weighted averaging**
   - The “Which is better?” slide is brief.
   - Check the lecturer's exact explanation of class imbalance and rare-class influence.

4. **NER example consistency**
   - One slide gives BIO tags where the gold PER appears to be `Dr Maya Chen`, the predicted PER is `Dr Maya`, and Bristol is missed.
   - Another slide gives gold `Maya Chen`, predicted `Maya Chen`, gold `Acme Labs`, predicted `Acme`, and Bristol correctly predicted.
   - Check whether these are two separate examples or a corrected version.

5. **F1 spam detector formula formatting**
   - The parsed slide text has garbled equation formatting.
   - The cleaned calculation is included above, but checking the recording may confirm the lecturer's exact steps.

6. **Transcript-specific exam flags**
   - No separate transcript was available, so any spoken “this is important” or “this will be on the exam” signals are missing.
