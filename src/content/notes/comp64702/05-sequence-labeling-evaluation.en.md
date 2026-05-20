---
subject: COMP64702
chapter: 5
title: "Sequence Labeling & Evaluation"
language: en
---

# Sequence Labeling and Evaluations in Text Mining — Structured Study Notes

**Topic and scope:** This lecture set covers sequence labelling and evaluation in Text Mining / Natural Language Processing. It moves through POS tagging, syntactic parsing, Named Entity Recognition (NER), evaluation methodology, and a compact application case: Open Information Extraction.

**Broader fit:** The material explains how raw text is progressively converted into structured linguistic and semantic representations, and how NLP systems are evaluated against gold-standard annotations.

**Source note:** These notes use the two uploaded slide PDFs: `TM last lecture 1-1.pdf` and `TM last lecture 2-1.pdf`. No separate transcript was provided in the chat, so transcript-dependent detail is marked **[UNCLEAR: transcript not provided]**.

---

## Exam flags / assessment flags

### Explicit assessment flag

- **Module 5 OpenIE:** The slides explicitly state that **OpenIE is “a compact application case rather than the main assessment focus.”**
  - **Exam flag:** OpenIE is likely lower priority than POS tagging, parsing, NER, and evaluation metrics.

### No explicit exam statements found

The visible slides do **not** include wording such as:

- “this will be on the exam”
- “you should know this”
- “common mistake”
- “this is important”

However, the following are strongly emphasised in the slides and should be treated as high-value revision material:

- POS tagging as contextual token-level classification
- ambiguity and disambiguation in POS tagging
- dependency parsing: heads, dependents, root, grammatical relations
- phrase structure parsing: NP, VP, PP, tree-building steps
- NER as sequence labelling
- BIO tagging and the formula $2N+1$
- local vs global sequence models
- CRFs and sequence-level scoring
- exact-match entity-level NER evaluation
- inter-annotator agreement
- observed agreement, expected agreement, Cohen’s Kappa
- confusion matrix: TP, FP, FN, TN
- precision, recall, F1
- why accuracy can mislead under class imbalance
- micro, macro, and weighted averages

---

## [UNCLEAR] sections to check against the recording

- **Transcript missing:** No separate lecture transcript was visible in the chat. Spoken explanations, lecturer emphasis, exam hints, and extra worked examples are therefore unavailable. **[UNCLEAR: transcript not provided]**
- **Module 2 outline truncation:** The slide outline ends with “How dependency structure and phrase structure diffe...”. This is almost certainly “differ,” but the slide text is truncated. **[UNCLEAR]**
- **Formula formatting:** Some slide formulas are visually clear but parsed imperfectly, especially Cohen’s Kappa, F1, and accuracy. These notes write the formulas cleanly. **[UNCLEAR: slide/OCR formatting drops some parentheses]**
- **Kappa interpretation thresholds:** Some threshold slides use compact notation, for example `0.6 < acceptable` and `0.67 < tentative conclusions < 0.8 < definite conclusions`. The intended interpretation is written below, but check the recording for the lecturer’s exact wording. **[UNCLEAR]**
- **Neural NER slide:** The slide asks “Why do we use a recurrent net?” but does not provide the spoken answer. **[UNCLEAR: transcript not provided]**

---

# Module 1 — POS Tagging

## 1.1 NLP pipeline

Natural Language Processing is presented as a pipeline of components. Each component adds a layer of structure to raw text, and later components depend heavily on the quality of earlier components.

The pipeline shown in the slides is:

$$
\text{Text (unstructured)}
\rightarrow \text{Sentence segmentation}
\rightarrow \text{Tokenisation}
\rightarrow \text{POS tagging}
\rightarrow \text{Parsing}
\rightarrow \text{Relation extraction}
\rightarrow \text{Relations (structured)}
$$

### Pipeline components

| Component | Input | Output |
|---|---|---|
| Sentence segmentation | Text | Sentences |
| Tokenisation | Sentence | Tokens |
| POS tagging | Token | POS tag |
| Parsing | Tokens | Dependencies |
| Relation extraction | Dependencies | Relations |

### Connection

This pipeline frames the lecture sequence:

- POS tagging provides token-level grammatical categories.
- Parsing uses token categories and word order to represent sentence structure.
- Relation extraction and OpenIE use earlier linguistic structure to extract machine-readable information.

---

## 1.2 What parts of speech are

### Intuition

Parts of speech are grammatical categories. They describe what role a word plays in a sentence.

### Formal definition from slides

**Parts of speech are classes of words defined by their grammatical role.**

POS tags help describe how words function in sentences.

### Examples from slides

| Category | Examples |
|---|---|
| Nouns | `house`, `health`, `London` |
| Pronouns | `he`, `they` |
| Verbs | `walks`, `gave`, `showing` |
| Adjectives | `small`, `better` |
| Adverbs | `almost`, `happily` |
| Determiners | `the`, `a`, `an` |
| Conjunctions | `and`, `or`, `because` |
| Prepositions | `in`, `of`, `from` |

---

## 1.3 Standard POS tagsets

POS tags come from standard annotation schemes. The slides introduce two common tagsets:

1. **Penn Treebank**
2. **Universal POS tags**

### Penn Treebank tagset

The Penn Treebank tagset is:

- detailed;
- English-focused.

Examples given:

- `NNP` = proper noun, singular
- `VBD` = verb, past tense
- `DT` = determiner

Additional visible Penn Treebank tags on the slide include:

| Tag | Meaning |
|---|---|
| `CC` | coordinating conjunction |
| `CD` | cardinal number |
| `DT` | determiner |
| `IN` | preposition or subordinating conjunction |
| `JJ` | adjective |
| `JJR` | adjective, comparative |
| `JJS` | adjective, superlative |
| `NN` | noun, singular or mass |
| `NNS` | noun, plural |
| `NNP` | proper noun, singular |
| `NNPS` | proper noun, plural |
| `PRP` | personal pronoun |
| `PRP$` | possessive pronoun |
| `RB` | adverb |
| `RBR` | adverb, comparative |
| `RBS` | adverb, superlative |
| `VB` | verb, base form |
| `VBD` | verb, past tense |
| `VBG` | verb, gerund or present participle |
| `VBN` | verb, past participle |
| `VBP` | verb, non-3rd person singular present |
| `VBZ` | verb, 3rd person singular present |
| `WDT` | wh-determiner |
| `WP` | wh-pronoun |
| `WP$` | possessive wh-pronoun |
| `WRB` | wh-adverb |

### Universal POS tagset

Universal POS tags are:

- broader;
- cross-linguistic.

Examples given:

- `PROPN`
- `VERB`
- `DET`

The slide groups Universal POS tags into three categories.

#### Open-class words

| Tag | Meaning |
|---|---|
| `ADJ` | adjective |
| `ADV` | adverb |
| `INTJ` | interjection |
| `NOUN` | noun |
| `PROPN` | proper noun |
| `VERB` | verb |

#### Closed-class words

| Tag | Meaning |
|---|---|
| `ADP` | adposition |
| `AUX` | auxiliary |
| `CCONJ` | coordinating conjunction |
| `DET` | determiner |
| `NUM` | numeral |
| `PART` | particle |
| `PRON` | pronoun |
| `SCONJ` | subordinating conjunction |

#### Other

| Tag | Meaning |
|---|---|
| `PUNCT` | punctuation |
| `SYM` | symbol |
| `X` | other |

---

## 1.4 POS tagging as a task

### Definition

**POS tagging is the task of assigning one POS tag to each token in a sentence.**

The slides state that POS tagging usually happens after tokenisation.

### Example from slides

Sentence 1:

$$
\text{Book/VB that/DT flight/NN ./.}
$$

Sentence 2:

$$
\text{Does/VBZ that/DT flight/NN serve/VB dinner/NN ?/.}
$$

### Key point

The same word can receive different tags in different contexts. POS tagging is therefore not just word lookup; it is contextual classification.

---

## 1.5 Why POS tagging is hard

### Core issue: ambiguity

Many words are ambiguous in isolation. In many cases, POS tagging is a **disambiguation task**.

### Examples from slides

#### `duck`

- `duck` = action / verb
- `duck` = bird / noun

#### `walk`

- `to walk` → verb
- `go for a walk` → noun

#### `old`

- `old people` → adjective
- `the old` → noun-like / nominal use

#### `referee`

- `They referee the matches` → verb
- `The referee starts the match` → noun

---

## 1.6 How context helps disambiguation

### Syntactic ambiguity can disappear with context

The slides show that syntactic ambiguity often occurs when a token is in isolation and may disappear when combined with other words.

Examples:

- `I want to go` vs `I want a go`
- `I can walk there` vs `I will take a walk`
- `The garbage can smell` vs `The garbage can smells`

### Sometimes context does not fully resolve ambiguity

Example:

$$
\text{They can fish}
$$

This sentence can be tagged in at least two ways:

1. `can` as auxiliary and `fish` as verb:

$$
\text{They/PRON can/AUX fish/VERB}
$$

2. `can` as verb and `fish` as noun:

$$
\text{They/PRON can/VERB fish/NOUN}
$$

---

## 1.7 Contextual heuristics for POS tagging

The slides give several contextual rules of thumb.

### Heuristic 1: determiner before token

A token is very unlikely to be a verb if the preceding word is a determiner.

Example:

$$
\text{I want a go}
$$

Here, `go` follows the determiner `a`, so it is more likely noun-like than verb-like.

### Heuristic 2: `to` before token

A token is unlikely to be a noun if the immediately preceding word is `to`.

Example:

$$
\text{I want to go}
$$

Here, `go` follows `to`, so it is likely a verb.

### Heuristic 3: pronoun followed by common noun

A token is more likely to be a possessive pronoun when followed by a common noun.

Example:

$$
\text{He stroked her cat}
$$

Here, `her` is likely possessive because it precedes `cat`.

### Limitation

The slide gives a counterexample:

$$
\text{He gave her money}
$$

The same surface form does not always imply the same grammatical function.

---

## 1.8 Local context

### Definition

**Local context** means the neighbouring words around a target token.

POS tagging models learn how neighbouring words influence likely tags.

Examples:

- `a walk` → `walk` is likely a noun
- `to walk` → `walk` is likely a verb
- `the old man` → `old` is an adjective

---

## 1.9 One sentence, two valid taggings

The slides emphasise that meaning affects POS tagging.

Example:

$$
\text{I saw her duck.}
$$

### Interpretation 1: pet bird

Meaning:

> I saw her pet bird.

Tagging:

$$
\text{I/PRON saw/VERB her/PRON duck/NOUN ./PUNCT}
$$

### Interpretation 2: lowering her head quickly

Meaning:

> I saw her lower her head quickly.

Tagging:

$$
\text{I/PRON saw/VERB her/PRON duck/VERB ./PUNCT}
$$

### Key point

A tagger must choose the tag that matches the intended meaning.

---

## 1.10 One POS tag per token per run

The slides state that the task is to assign POS tags to individual tokens, but only **one POS tag per token for each run**.

Example:

$$
\text{They can fish}
$$

Run 1:

$$
\text{They/PRON can/AUX fish/VERB}
$$

Run 2:

$$
\text{They/PRON can/VERB fish/NOUN}
$$

Example:

$$
\text{I saw her bat}
$$

Run 1:

$$
\text{I/PRON saw/VERB her/PRON bat/NOUN}
$$

Run 2:

$$
\text{I/PRON saw/VERB her/PRON bat/VERB}
$$

---

## 1.11 Rule-based and data-driven tagging

### Rule-based tagging

A rule-based approach uses handcrafted grammatical rules.

Example rule types:

- after a determiner, expect a noun rather than a verb;
- after `to`, expect a verb rather than a noun.

### Data-driven tagging

A statistical or neural approach learns patterns from annotated corpora.

POS-tagged corpora provide:

- example sentences;
- gold labels;
- evidence for disambiguation.

### Slide conclusion

In practice, modern systems are usually data-driven.

---

## 1.12 POS-tagged corpora examples

### Penn Treebank-style example

Token-by-token annotation:

| Token | Tag |
|---|---|
| Today | `NN` |
| is | `VBZ` |
| a | `DT` |
| nice | `JJ` |
| day | `NN` |
| . | `.` |

Second sentence:

| Token | Tag |
|---|---|
| I | `PRP` |
| want | `VBP` |
| to | `TO` |
| go | `VB` |
| for | `IN` |
| a | `DT` |
| walk | `NN` |
| . | `.` |

Inline format:

$$
\text{Today/NN is/VBZ a/DT nice/JJ day/NN ./.}
$$

$$
\text{I/PRP want/VBP to/TO go/VB for/IN a/DT walk/NN ./.}
$$

### Universal POS-style example

| Token | Tag |
|---|---|
| Today | `NOUN` |
| is | `VERB` |
| a | `DET` |
| nice | `ADJ` |
| day | `NOUN` |
| . | `PUNCT` |

Second sentence:

| Token | Tag |
|---|---|
| I | `PRON` |
| want | `VERB` |
| to | `ADP` |
| go | `VERB` |
| for | `ADP` |
| a | `DET` |
| walk | `NOUN` |
| . | `PUNCT` |

Inline format:

$$
\text{Today/NOUN is/VERB a/DET nice/ADJ day/NOUN ./PUNCT}
$$

$$
\text{I/PRON want/VERB to/ADP go/VERB for/ADP a/DET walk/NOUN ./PUNCT}
$$

---

# Module 2 — Syntactic Parsing

## 2.1 What syntactic parsing is

### Intuition

POS tagging tells us what kind of word each token is. Parsing tells us how the words are structurally connected.

### Formal definition from slides

- POS tags tell us the category of each word.
- Parsing tells us how the words are structurally related.
- Parsing helps answer:
  - Which noun is the subject?
  - Which phrase is the object?
  - What does a prepositional phrase modify?

The slides introduce two major views of syntax:

1. **Dependency structure**
2. **Phrase structure**

---

## 2.2 Why parsing matters

Some sentences remain ambiguous even after POS tagging.

Example:

$$
\text{The teacher discussed the essay with the student.}
$$

Question:

- Does `with the student` describe who the teacher talked to?
- Or does it describe which essay was discussed?

Parsing makes these structural choices explicit.

### Other syntactic ambiguity examples from slides

$$
\text{I saw the man on the hill with a telescope.}
$$

$$
\text{The violent police man injures the farmer with an ax.}
$$

$$
\text{Flying planes can be dangerous.}
$$

$$
\text{Visiting relatives can be boring.}
$$

### Key statement

To understand sentences, we cannot treat each word in isolation. We need to determine what each word is attached or connected to.

---

## 2.3 Dependency parsing

### Definition

A dependency parse represents grammatical relations between words. Each relation links:

- a **head**
- a **dependent**

The head of the whole sentence is usually the main verb. A dependency parse forms a directed structure over the tokens.

### Intuition

Dependency parsing asks:

> Which words depend on which other words?

Examples:

- subjects depend on predicates;
- objects depend on predicates;
- modifiers depend on the words they modify.

---

## 2.4 Heads, dependents, and root

In dependency parsing:

- the sentence head is often the main predicate;
- subjects and objects depend on that predicate;
- modifiers depend on the word they modify.

Example:

$$
\text{The child opened the door}
$$

- `opened` is the root.
- `child` is a subject dependent.
- `door` is an object dependent.

---

## 2.5 A dependency tree in practice

The slides show a dependency tree for:

$$
\text{Economic news had little effect on financial markets .}
$$

The dependency structure indicates:

- `had` is the structural centre / root.
- `news` is attached as subject.
- `effect` is attached as object.
- `Economic` modifies `news`.
- `little` modifies `effect`.
- `on` and `markets` form the prepositional structure.
- `financial` modifies `markets`.
- punctuation attaches at the sentence level.

### Key point

The labels on dependency edges tell us how each token functions in the sentence.

---

## 2.6 Common dependency relations

The slides list common dependency labels.

| Label | Meaning | Example sentence | Example dependency |
|---|---|---|---|
| `nsubj` / `sbj` | nominal subject | Clinton defeated Cole | `sbj(defeated, Clinton)` |
| `obj` / `dobj` | object | She gave me a raise | `obj(gave, raise)` |
| `iobj` | indirect object | She gave me a raise | `iobj(gave, me)` |
| `amod` / `nmod` | nominal modifier | Sam eats red meat | `nmod(meat, red)` |
| `advmod` / `vmod` | adverbial or verb modifier | Genetically modified food | `vmod(modified, genetically)` |
| `det` | determiner | The man is here | `det(man, the)` |
| `aux` | auxiliary | He should leave | `aux(leave, should)` |
| `cc` | coordination | They either ski or snowboard | `cc(ski, or)` |
| `case` / prep-related links | prepositional marking | scheme-dependent | scheme-dependent |
| `pobj` / `pc` | object of preposition | I sat on the chair | `pobj(on, chair)` |
| `p` / `punct` | punctuation | Go home! | `punct(Go, !)` |

The slide notes that the exact inventory depends on the annotation scheme.

---

## 2.7 Reading a dependency analysis

To read a dependency parse, ask:

1. What is the root?
2. Which words depend directly on the root?
3. Which words modify nouns?
4. Which phrases modify the event?

This helps identify the main structure of the sentence.

For:

$$
\text{Economic news had little effect on financial markets .}
$$

A reading consistent with the slide is:

- Root: `had`
- Subject: `news`
- Object: `effect`
- Noun modifiers:
  - `Economic` modifies `news`
  - `little` modifies `effect`
  - `financial` modifies `markets`
- Prepositional relation:
  - `on financial markets` relates to `effect`
- Punctuation:
  - period attaches to the sentence/root level

---

## 2.8 Attachment ambiguity

### Definition

Attachment ambiguity occurs when a phrase could attach to more than one word or phrase.

Example:

$$
\text{The teacher discussed the essay with the student.}
$$

### Interpretation A

`with the student` modifies `discussed`.

Meaning:

> the teacher talked to the student.

### Interpretation B

`with the student` modifies `essay`.

Meaning:

> the essay is about, or associated with, the student.

### Key point

Different meanings require different parses.

---

## 2.9 How to decide where a phrase attaches

The slide gives the guiding question:

$$
\text{Which word is this phrase modifying?}
$$

Rules of thumb:

- If the phrase describes the event or action, it usually attaches to the verb.
- If the phrase describes an entity, it usually attaches to the noun.
- Parsing is closely tied to semantic interpretation.

---

## 2.10 Phrase structure parsing

### Definition

Phrase structure parsing represents sentences as nested constituents. Instead of head-dependent links, it groups words into phrases.

Typical phrase types:

| Phrase type | Meaning |
|---|---|
| `NP` | noun phrase |
| `VP` | verb phrase |
| `PP` | prepositional phrase |
| `AdjP` | adjectival phrase |
| `AdvP` | adverbial phrase |

The slide visual shows a tree for:

$$
\text{Economic news had little effect on financial markets}
$$

with nested phrase nodes above POS tags and words.

---

## 2.11 Building a phrase structure tree

The slides give a step-by-step worked example for:

$$
\text{The child put the puppy in the garden}
$$

### Step 1: Label POS categories

$$
\begin{array}{llllllll}
\text{The} & \text{child} & \text{put} & \text{the} & \text{puppy} & \text{in} & \text{the} & \text{garden} \\
\text{DT} & \text{NN} & \text{VBD} & \text{DT} & \text{NN} & \text{IN} & \text{DT} & \text{NN}
\end{array}
$$

### Step 2: Locate the two principal constituents

There are two main constituents:

$$
[\text{The child}] \quad [\text{put the puppy in the garden}]
$$

These correspond to:

- NP: `[The child]`
- VP: `[put the puppy in the garden]`

### Step 3: Project phrasal nodes

For each head noun/pronoun, verb, adjective, adverb, and preposition, project a phrasal node.

In this example, the resulting phrase nodes include:

- NP
- VP
- NP
- PP
- NP

The span can be represented as:

$$
[\text{The child}] \quad [\text{put the puppy in the garden}]
$$

containing:

- **NP:** `The child`
- **VP:** `put the puppy in the garden`
- **NP:** `the puppy`
- **PP:** `in the garden`
- **NP:** `the garden`

### Step 4: Connect remaining tokens to the nodes they belong to

Determiners attach inside their noun phrases:

- `The` attaches to the NP headed by `child`.
- `the` attaches to the NP headed by `puppy`.
- `the` attaches to the NP headed by `garden`.

The preposition `in` introduces the PP.

### Final tree

The final tree combines the phrase nodes under `S`.

$$
S
$$

with:

- NP = `The child`
- VP = `put the puppy in the garden`

The VP contains:

- verb = `put`
- NP = `the puppy`
- PP = `in the garden`

The PP contains:

- preposition = `in`
- NP = `the garden`

### Key point

The result shows both grouping and hierarchy.

---

## 2.12 Identifying noun phrases

### Definition

A noun phrase is centred on a noun or pronoun.

It may contain:

- determiners;
- adjectives;
- possessives;
- modifiers.

Examples:

- `the child`
- `her old bicycle`
- `the report on climate change`

Important warning:

- Not every long span in a sentence is a noun phrase.

---

## 2.13 Dependency structure vs phrase structure

### Dependency parsing

Dependency parsing focuses on relations between words.

It is especially useful for:

- predicate-argument structure;
- information extraction;
- relation analysis.

It represents:

- directed edges;
- head-dependent relations;
- edge labels for grammatical functions;
- POS tags for syntactic categories.

### Phrase structure parsing

Phrase structure parsing focuses on constituent groupings.

It is especially useful for:

- constituent identification;
- NP / VP / PP analysis;
- hierarchical sentence structure.

It represents:

- non-terminal phrase nodes;
- hierarchical structure;
- POS tags for syntactic categories.

---

## 2.14 Endocentric vs exocentric constructions

The slides include a table labelled **Dependency structures: Endocentric vs Exocentric Constructions**.

| Construction | Head | Dependent | Required? |
|---|---|---|---|
| Exocentric | verb | subject / `sbj` | yes |
| Exocentric | verb | object / `obj` | yes |
| Endocentric | verb | adverb / `vmod` | no |
| Endocentric | noun | adjective / `nmod` | no |

Interpretation from the slide:

- Subject and object relations are treated as required in the shown exocentric cases.
- Adverbial and adjectival modifiers are treated as optional in the shown endocentric cases.

---

## 2.15 Various dependency notations

The slides warn that there are many notational systems, but the conceptual ideas are similar.

### Notation 1

Horizontally arranged tokens with directed edges.

Includes:

- tokens;
- grammatical function labels.

### Notation 2

Horizontally arranged tokens with directed edges, but arrows are in the opposite direction.

Includes:

- tokens;
- grammatical function labels.

### Notation 3

Tree of tokens.

Includes:

- tokens;
- grammatical functions;
- direction encoded by the tree.

### Notation 4

Tree of POS tags mapped to tokens.

Includes:

- tokens;
- grammatical functions;
- POS tags.

### Key point

Do not get stuck on notation. Focus on:

- heads;
- dependents;
- grammatical relations;
- structure.

---

# Module 3 — Named Entity Recognition

## 3.1 What NER is

### Definition

Named Entity Recognition identifies mentions of real-world entities in text and assigns a label to each mention.

Typical entity types include:

- Person
- Organisation
- Location
- Date / Time
- Money

NER helps answer questions such as:

- Who is mentioned?
- Where did something happen?
- Which organisations are involved?

---

## 3.2 Example: news entities

The slide visual asks:

> What is this snippet talking about?

The marked entities include:

### Location

- Downing Street
- UK

### Time

- Monday evening
- Easter

### Person

- Mr Johnson
- Prof Andrew Pollard

### Organisation

- Oxford vaccine group

### Key point

NER turns spans of text into labelled entity mentions. The labels depend on the entity inventory used for the task.

---

## 3.3 Named entities are task-dependent

The useful entity types depend on the application domain.

### In news text

Common types include:

- person;
- organisation;
- location;
- date.

### In biomedical text

Useful types may include:

- drug;
- disease;
- protein;
- virus.

### Key point

NER is not one fixed universal label set.

---

## 3.4 Example: biomedical entities

The biomedical slide marks entities such as:

### Drug / Chemical

- Remdesivir
- GS-5734

### Gene / Protein

- viral RNA-dependent RNA polymerase

### Virus

- SARS-CoV-1
- SARS-CoV-2

### Disease

- Middle East respiratory syndrome
- Covid-19

### Key point

The entity types in biomedical NER differ from the entity types in news NER. Domain determines the relevant label set.

---

## 3.5 Why NER is context-dependent

The same string can refer to different entity types in different contexts.

Examples:

- `Washington`
  - person
  - city
  - government
- `Amazon`
  - company
  - river

Therefore NER systems must use context, not just surface form.

---

## 3.6 NER as sequence labelling

NER is often formulated as a token-level sequence labelling task.

Each token receives a tag that tells us:

- whether it is inside an entity;
- which entity type it belongs to.

This makes NER similar to POS tagging, but with span boundaries added.

---

## 3.7 BIO tagging scheme

### Formal tag definitions

- `B-X` = beginning of an entity of type $X$
- `I-X` = inside an entity of type $X$
- `O` = outside any entity

### Example from slides

Sentence:

$$
\text{Maya Chen works at Northbridge Labs in Leeds .}
$$

BIO tags:

$$
\text{B-PER I-PER O O B-ORG I-ORG O B-LOC O}
$$

Recovered entities:

- `Maya Chen` = PER
- `Northbridge Labs` = ORG
- `Leeds` = LOC

### Key point

BIO allows us to recover entity spans from token labels.

---

## 3.8 From BIO tags to entity mentions

Consecutive BIO tags define complete entity mentions.

Example:

$$
\text{B-PER I-PER}
$$

means one two-token person entity.

A correct entity prediction requires:

1. the correct span;
2. the correct type.

Important:

- Token-level similarity is not enough if the entity boundary is wrong.
- Boundary errors matter directly for NER evaluation.

---

## 3.9 Number of BIO output classes

If BIO is used for $N$ entity types, the number of output classes is:

$$
2N + 1
$$

Reason:

- one `B` tag for each entity type;
- one `I` tag for each entity type;
- one `O` tag.

Example entity types:

$$
\text{PER, ORG, LOC}
$$

Classes:

$$
\text{B-PER, I-PER, B-ORG, I-ORG, B-LOC, I-LOC, O}
$$

Total:

$$
2(3)+1=7
$$

### Slide visual example

Sentence:

$$
\text{Adam Smith works for IBM in London .}
$$

POS tags:

$$
\text{NNP NNP VBZ IN NNP IN NNP .}
$$

Entity tags:

$$
\text{B\_PER I\_PER O O B\_ORG O B\_LOC O}
$$

The slide labels:

- `B_PER` = begin the mention
- `I_PER` = inside the mention

---

## 3.10 Local and global sequence models

### Local model

A local model predicts each tag mainly from token-level context.

The slide describes local approaches as:

- tags are independent of each other;
- classifiers for sequences can include RNN, LSTM, BiLSTM.

### Global model

A global model predicts a label sequence while considering dependencies between output tags.

The slide describes global approaches as:

- tags are dependent on each other;
- examples include:
  - Hidden Markov Model / HMM
  - Conditional Random Field / CRF

### Why this matters

Some tag sequences are much more plausible than others.

Example:

$$
\text{I-ORG}
$$

should not normally appear after:

$$
\text{O}
$$

without a preceding:

$$
\text{B-ORG}
$$

This is why modelling label dependencies can improve NER.

---

## 3.11 Conditional Random Fields

### Definition

A Conditional Random Field, or CRF, is a global sequence model.

It scores the entire output sequence rather than each token independently.

CRFs are useful because they can model dependencies such as:

- legal BIO transitions;
- consistency across neighbouring labels.

This often improves sequence labelling performance.

### Linear-chain CRF formula from slide

$$
p(y \mid x)
=
\frac{1}{Z_x}
\exp
\left(
\sum_{t=1}^{T}
\sum_{k=1}^{K}
w_k f_k(y_t, y_{t-1}, x_t)
\right)
$$

Where:

- $y$ = output label sequence
- $x$ = input sequence
- $t$ = token position
- $T$ = number of tokens
- $k$ = feature index
- $K$ = number of feature functions
- $w_k$ = weight for feature $k$
- $f_k(y_t, y_{t-1}, x_t)$ = feature function depending on current label, previous label, and current input
- $Z_x$ = normalisation factor

Normalisation factor:

$$
Z_x =
\sum_y
\exp
\left(
\sum_{t=1}^{T}
\sum_{k=1}^{K}
w_k f_k(y_t, y_{t-1}, x_t)
\right)
$$

The slide states that $Z_x$ makes sure the sum of probabilities is equal to 1.

---

## 3.12 Features used in classical NER

Classical NER models often use handcrafted features.

### Contextual features

- current word $w_0$
- words around $w_0$ in a window:

$$
[-3, \ldots, +3]
$$

### POS tag

- Part-of-speech tag, when available.

### Trigger words

For person:

- Mr
- Miss
- Dr
- PhD

For location:

- city
- street

For organisation:

- Ltd.
- Co.

### Length

Length in terms of number of tokens.

### Orthographic features

These are binary and not mutually exclusive:

- initial capitals
- all capitals
- lonely initial
- all digits
- contains dots
- punctuation mark
- single character
- contains hyphen
- URL
- roman numeral

### Suffixes

Suffixes of length 1 to 4:

- each component of the named entity;
- whole named entity.

### Gazetteers

Gazetteers may include:

- geographical locations;
- first names;
- surnames;
- company names;
- many others.

Questions/features:

- Is the whole named entity in a gazetteer?
- Does any component of the named entity appear in a gazetteer?

Slide emphasis:

> The more useful features you incorporate, the more powerful your learner gets!

---

## 3.13 Neural approaches to NER

Neural sequence models reduce the need for manual feature engineering.

Common models include:

- BiLSTM
- BiLSTM-CRF
- Transformer-based encoders

These models learn contextual representations directly from data and often perform well when training data is available.

### Independent neural tag prediction formula

The neural NER slide gives:

$$
Pr(tag \mid token) = softmax(W h_{token} + b)
$$

Where:

- $h_{token}$ is the learned representation of the token;
- $W$ is a weight matrix;
- $b$ is a bias term;
- softmax converts scores into probabilities over tags.

### Neural example from slide

Sentence:

$$
\text{In 2000, Tom Hanks starred in Cast Away}
$$

Tags shown:

$$
\text{O O O B\_PER I\_PER O O B\_MOV I\_MOV}
$$

Architecture shown:

$$
\text{RNN / LSTM / BiLSTM} \rightarrow \text{softmax tag predictions}
$$

The slide asks:

> Why do we use a recurrent net?

**[UNCLEAR: the answer is not included in the visible slide text; check the lecture recording.]**

---

## 3.14 Exact-match evaluation for NER

NER is usually evaluated at the entity level, not only at the token level.

A predicted entity counts as a true positive only if:

1. its span is correct;
2. its type is correct.

If the boundary is wrong, it is not a correct entity.

If the type is wrong, it is also not a correct entity.

### Connection

This leads directly into Module 4 evaluation:

- TP / FP / FN counting;
- precision;
- recall;
- F1;
- entity-level scoring.

---

# Module 4 — Evaluation Method

## 4.1 What “evaluation” means

The slide defines evaluation generally as:

> making a judgement about the amount, number, or value of something.

In computer science, the slide says evaluation is synonymous with:

$$
\text{testing}
$$

---

## 4.2 Why we evaluate NLP systems

Evaluation tells us how well a system is performing.

Users care about whether a system is useful for a task.

Developers care about whether a system is improving over time.

Evaluation supports:

- comparison;
- debugging;
- model selection;
- scientific reporting.

---

## 4.3 Benchmark data and gold standards

Performance evaluation is often based on benchmark datasets.

Benchmark datasets contain:

- inputs;
- gold-standard labels;
- a fixed evaluation protocol.

Gold standards are usually created by human annotators following annotation guidelines.

Reliable evaluation depends on reliable annotation.

---

## 4.4 Community challenge / shared task setup

The slides mention community challenge / shared task setups, including examples such as Kaggle and SemEval.

In such a setup:

- a specific task is defined;
- gold-standard data is provided:
  - training set;
  - development set;
  - test set.

Automated scoring compares:

- **response** = system-generated annotations / predictions;
- **reference** = gold standard.

---

## 4.5 Gold-standard data

Gold-standard data is:

- time-consuming and costly to produce;
- based on annotation instructions / annotation guidelines;
- usually produced by experts;
- sometimes dependent on training in linguistics.

The slides state that multiple annotators need to label the same samples, or at least a subset of the same samples.

Reason:

- to ensure annotations are reliable;
- to calculate inter-annotator agreement;
- because disagreements may occur.

---

## 4.6 Inter-annotator agreement

### Definition

Inter-annotator agreement measures how consistently humans label the same data.

Human annotations are not always identical.

Different annotators may interpret a guideline differently.

High agreement suggests that:

- the task is clearer;
- the guidelines are clearer;
- the annotations are more reliable.

---

## 4.7 Observed agreement: $P_a$

### Definition

Observed agreement is the proportion of cases on which annotators agree.

### Worked example

Two annotators label 10 items.

They agree on 7 items.

Then:

$$
P_a = \frac{7}{10} = 0.70
$$

Important limitation:

- observed agreement does **not** correct for chance agreement.

---

## 4.8 Expected agreement: $P_e$

### Definition

Expected agreement estimates how much agreement would happen by chance.

### Worked example

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

Therefore:

$$
P_e = 0.30 + 0.20 = 0.50
$$

---

## 4.9 Cohen’s Kappa

### Definition

Cohen’s Kappa corrects observed agreement for chance agreement.

### Formula

$$
K = \frac{P_a - P_e}{1 - P_e}
$$

Where:

- $P_a$ = observed agreement;
- $P_e$ = expected agreement by chance.

### Worked example using previous values

Given:

$$
P_a = 0.70
$$

$$
P_e = 0.50
$$

Then:

$$
K = \frac{0.70 - 0.50}{1 - 0.50}
$$

$$
K = \frac{0.20}{0.50}
$$

$$
K = 0.40
$$

Key point:

- Kappa is more informative than raw agreement alone.

---

## 4.10 Kappa coefficient: table example

The slide gives this annotator table:

|  | Annotator 1: yes | Annotator 1: no | Total |
|---|---:|---:|---:|
| Annotator 2: yes | 31 | 1 | 32 |
| Annotator 2: no | 2 | 6 | 8 |
| Total | 33 | 7 | 40 |

### Step 1: Observed agreement

Agreement occurs when both annotators say **yes** or both say **no**.

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
\frac{31}{40}
+
\frac{6}{40}
$$

$$
P(a)
=
\frac{37}{40}
=
0.925
$$

### Step 2: Expected agreement

$$
P(e)
=
P(A1=\text{yes})P(A2=\text{yes})
+
P(A1=\text{no})P(A2=\text{no})
$$

From the table:

$$
P(A1=\text{yes}) = \frac{33}{40}
$$

$$
P(A2=\text{yes}) = \frac{32}{40}
$$

$$
P(A1=\text{no}) = \frac{7}{40}
$$

$$
P(A2=\text{no}) = \frac{8}{40}
$$

So:

$$
P(e)
=
\left(\frac{33}{40} \times \frac{32}{40}\right)
+
\left(\frac{7}{40} \times \frac{8}{40}\right)
$$

$$
P(e)
=
0.660
+
0.035
=
0.695
$$

### Step 3: Kappa for the table

Using the Kappa formula:

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
\approx 0.754
$$

The slide itself shows $P(a)$ and $P(e)$; this final Kappa calculation follows directly from the formula already given.

---

## 4.11 Kappa interpretation

The slide lists several interpretation schemes.

### Landis and Koch, 1977

Approximate thresholds from the slide:

- $< 0.2$: slight
- $0.2$ to $0.4$: fair
- $0.4$ to $0.6$: moderate
- $0.6$ to $0.8$: substantial
- $> 0.8$: perfect

### Grove et al., 1981

Slide notation:

$$
0.6 < \text{acceptable}
$$

Interpretation:

- agreement above 0.6 is treated as acceptable.

**[UNCLEAR: check recording for exact wording.]**

### Krippendorff, 1980

Slide notation:

$$
0.67 < \text{tentative conclusions} < 0.8 < \text{definite conclusions}
$$

Interpretation:

- above 0.67 supports tentative conclusions;
- above 0.8 supports definite conclusions.

**[UNCLEAR: compact notation on slide.]**

### Rietveld and van Hout, 1993

Approximate thresholds from the slide:

- $0.4$ to $0.6$: moderate
- $0.6$ to $0.8$: substantial

### Green, 1997

Approximate thresholds from the slide:

- $< 0.4$: low
- $0.4$ to $0.75$: fair/good
- $> 0.75$: high

---

## 4.12 Scoring with a confusion matrix

The basic categories are:

|  | Correct | Not correct |
|---|---|---|
| Annotated | True positive / TP | False positive / FP |
| Not annotated | False negative / FN | True negative / TN |

Definitions:

- **True positive / TP:** annotated or predicted item is correct.
- **False positive / FP:** annotated or predicted item is not correct.
- **False negative / FN:** correct item was not annotated or not found.
- **True negative / TN:** item was correctly left unannotated / correctly predicted negative.

For automated systems, the slide gives:

|  | Positive response | Negative response |
|---|---|---|
| Positive reference | TP | FN |
| Negative reference | FP | TN |

For a positive class:

- **TP:** predicted positive, actually positive.
- **FP:** predicted positive, actually negative.
- **FN:** predicted negative, actually positive.
- **TN:** predicted negative, actually negative.

Many common metrics are derived from these four counts.

---

## 4.13 Precision

### Intuition

Precision asks:

> Of the items predicted as positive, how many are correct?

Or, from the earlier annotation wording:

> What fraction of annotated items are correct?

### Formula

$$
Precision = \frac{TP}{TP + FP}
$$

---

## 4.14 Recall

### Intuition

Recall asks:

> Of the truly positive items, how many did the system find?

Or, from the earlier annotation wording:

> What fraction of correct items were annotated?

### Formula

$$
Recall = \frac{TP}{TP + FN}
$$

Precision and recall capture different aspects of performance.

---

## 4.15 Worked example: blue stars

The slide visual has blue stars and red ovals. The target class is:

$$
\text{Blue stars}
$$

The selected / annotated region contains:

- 5 true blue stars;
- 2 red ovals incorrectly included.

Outside the selected region:

- 1 blue star missed;
- 4 red ovals correctly excluded.

Counts:

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

### Precision calculation

$$
Precision
=
\frac{TP}{TP + FP}
$$

$$
Precision
=
\frac{5}{5+2}
$$

$$
Precision
=
\frac{5}{7}
=
0.714
$$

### Recall calculation

$$
Recall
=
\frac{TP}{TP + FN}
$$

$$
Recall
=
\frac{5}{5+1}
$$

$$
Recall
=
\frac{5}{6}
=
0.833
$$

---

## 4.16 F-score / F-measure / F1-score

### Definition

F-score is a weighted harmonic mean of precision and recall.

### General $F_\beta$ formula

$$
F_\beta
=
\frac{(\beta^2 + 1)PR}{\beta^2P + R}
$$

Where:

- $P$ = precision;
- $R$ = recall;
- $\beta$ controls the relative weighting of recall and precision.

### Balanced F1

Usually the balanced F1 measure is used, where:

$$
\beta = 1
$$

So:

$$
F_1
=
\frac{2PR}{P+R}
$$

The slide says the harmonic mean is a more conservative average and gives a “truer picture.”

Key intuition:

- F1 is high only when both precision and recall are high.

---

## 4.17 F-score vs arithmetic mean: example 1

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

The F-score is slightly lower than the arithmetic mean.

---

## 4.18 F-score vs arithmetic mean: example 2

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

Interpretation:

- Arithmetic mean looks moderately high.
- F1 is much lower because recall is very poor.
- This demonstrates why harmonic mean is more conservative.

---

## 4.19 Worked example: spam detector F1

Given:

$$
TP = 18
$$

$$
FP = 6
$$

$$
FN = 9
$$

### Precision

$$
Precision
=
\frac{18}{18+6}
$$

$$
Precision
=
\frac{18}{24}
=
0.75
$$

### Recall

$$
Recall
=
\frac{18}{18+9}
$$

$$
Recall
=
\frac{18}{27}
\approx 0.67
$$

### F1

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

The slide states that this shows the full calculation from counts to F1.

---

## 4.20 Accuracy

### Definition

Accuracy measures the proportion of all correctly identified cases.

### Formula

$$
Accuracy
=
\frac{TP + TN}{TP + TN + FP + FN}
$$

Accuracy is suitable if all classes are equally important.

---

## 4.21 When accuracy can mislead

Accuracy can be misleading on imbalanced datasets.

Example:

- If 95% of items are negative, always predicting negative gives:

$$
Accuracy = 95\%
$$

But recall for the positive class is:

$$
Recall = 0
$$

because the system never finds any positive cases.

Example task mentioned:

- Hate vs Neutral

Slide recommendation:

- Use F-score in such cases.

---

## 4.22 Multiple categories: macro-averaging

The slides ask how to report combined performance for:

- Person
- Location

Given table:

| Category | TPs | FPs | FNs | Precision | Recall |
|---|---:|---:|---:|---:|---:|
| Person | 78 | 5 | 33 | 0.94 | 0.70 |
| Location | 20 | 3 | 2 | 0.87 | 0.91 |

### Macro-averaging

Macro-averaging simply averages across categories.

Precision:

$$
P_{\text{Person+Location}}
=
\frac{0.94 + 0.87}{2}
$$

$$
P_{\text{Person+Location}}
=
0.91
$$

Recall:

$$
R_{\text{Person+Location}}
=
\frac{0.70 + 0.91}{2}
$$

$$
R_{\text{Person+Location}}
=
0.81
$$

F1 using the slide’s averaged precision and recall:

$$
F1_{\text{Person+Location}}
=
\frac{2 \times 0.91 \times 0.81}{0.91 + 0.81}
$$

$$
F1_{\text{Person+Location}}
=
0.86
$$

**[UNCLEAR: the slide computes F1 from averaged precision and recall; check whether the lecturer distinguished this from averaging per-class F1 values.]**

---

## 4.23 Multiple categories: micro-averaging

### Definition

Micro-averaging pools together the TPs, FPs, and FNs first, then computes the metric once.

Using the same table:

$$
TP_{\text{total}} = 78 + 20 = 98
$$

$$
FP_{\text{total}} = 5 + 3 = 8
$$

$$
FN_{\text{total}} = 33 + 2 = 35
$$

### Micro precision

$$
P_{\text{Person+Location}}
=
\frac{78+20}{(78+20)+(5+3)}
$$

$$
P_{\text{Person+Location}}
=
\frac{98}{98+8}
$$

$$
P_{\text{Person+Location}}
=
\frac{98}{106}
\approx 0.92
$$

### Micro recall

$$
R_{\text{Person+Location}}
=
\frac{78+20}{(78+20)+(33+2)}
$$

$$
R_{\text{Person+Location}}
=
\frac{98}{98+35}
$$

$$
R_{\text{Person+Location}}
=
\frac{98}{133}
\approx 0.74
$$

### Micro F1

$$
F1_{\text{Person+Location}}
=
\frac{2 \times 0.92 \times 0.74}{0.92 + 0.74}
$$

$$
F1_{\text{Person+Location}}
=
0.82
$$

---

## 4.24 Which average is better?

The slide states:

- Macro-averaging does not consider class imbalance.
- Micro-averaging is less sensitive to imbalance.
- Weighted average = average weighted by the number of true instances for each class.

**[UNCLEAR: check the lecturer’s wording here. The slide says micro-averaging is less sensitive to imbalance; this is worth confirming in the recording because averaging choices strongly affect rare-class influence.]**

### Weighted average

Definition from slide:

$$
\text{weighted average}
=
\text{average weighted by number of true instances for each class}
$$

The choice of averaging method affects how strongly rare classes influence the final score.

---

## 4.25 Entity-level evaluation for NER

NER is evaluated at entity level, not just token level.

A predicted entity is a true positive only if:

1. the span is correct;
2. the type is correct.

A partially correct span does not count as a true positive.

---

## 4.26 Worked NER example: counting entities, version 1

Tokens:

$$
\text{Dr | Maya | Chen | joined | Acme | Labs | in | Bristol | .}
$$

Gold tags:

$$
\text{B-PER I-PER I-PER O B-ORG I-ORG O B-LOC O}
$$

Predicted tags:

$$
\text{B-PER I-PER O O B-ORG I-ORG O O O}
$$

### Gold entities

From the gold BIO tags:

- `Dr Maya Chen` = PER
- `Acme Labs` = ORG
- `Bristol` = LOC

### Predicted entities

From the predicted BIO tags:

- `Dr Maya` = PER
- `Acme Labs` = ORG
- no LOC entity predicted

### Counts

PER:

$$
TP = 0,\quad FP = 1,\quad FN = 1
$$

Reason:

- predicted person span is incomplete;
- gold person span is `Dr Maya Chen`;
- predicted person span is `Dr Maya`.

ORG:

$$
TP = 1,\quad FP = 0,\quad FN = 0
$$

LOC:

$$
TP = 0,\quad FP = 0,\quad FN = 1
$$

Reason:

- Bristol was missed.

Key point:

- The person prediction is wrong because the predicted span is incomplete.

---

## 4.27 Worked NER example: counting entities, version 2

Gold entities:

- `Maya Chen` = PER
- `Acme Labs` = ORG
- `Bristol` = LOC

Predicted entities:

- `Maya Chen` = PER
- `Acme` = ORG
- `Bristol` = LOC

### Counts

PER:

$$
TP = 1,\quad FP = 0,\quad FN = 0
$$

Reason:

- predicted span and type match gold.

ORG:

$$
TP = 0,\quad FP = 1,\quad FN = 1
$$

Reason:

- predicted `Acme` is only part of gold `Acme Labs`;
- partial span does not count as correct.

LOC:

$$
TP = 1,\quad FP = 0,\quad FN = 0
$$

Key point:

- A partially correct span does not count as a true positive.

---

## 4.28 Worked example: micro-averaged F1 for NER

Using the previous example:

| Entity type | TP | FP | FN |
|---|---:|---:|---:|
| PER | 1 | 0 | 0 |
| ORG | 0 | 1 | 1 |
| LOC | 1 | 0 | 0 |

Pool all counts across entity types:

$$
TP_{\text{total}} = 2
$$

$$
FP_{\text{total}} = 1
$$

$$
FN_{\text{total}} = 1
$$

### Micro precision

$$
Precision_{\text{micro}}
=
\frac{2}{2+1}
=
0.667
$$

### Micro recall

$$
Recall_{\text{micro}}
=
\frac{2}{2+1}
=
0.667
$$

### Micro F1

$$
F1_{\text{micro}}
=
\frac{2 \times 0.667 \times 0.667}{0.667 + 0.667}
$$

$$
F1_{\text{micro}}
=
0.667
$$

Interpretation:

- Micro-averaging gives one overall score after combining all entity decisions across categories.

---

# Module 5 — Open Information Extraction

## 5.1 Module scope

The module introduces:

- what Open Information Extraction is;
- how OpenIE differs from predefined relation extraction;
- a brief view of classical and neural OpenIE approaches.

Assessment note:

- OpenIE is described as a compact application case rather than the main assessment focus.

---

## 5.2 What Open Information Extraction is

### Definition

Open Information Extraction, or OpenIE, extracts relational facts from text without relying on a fixed predefined schema.

### Input

- raw sentences;
- documents.

### Output

Relation tuples such as:

$$
(\text{argument}, \text{relation}, \text{argument})
$$

### Goal

OpenIE aims to turn unstructured text into machine-readable knowledge.

---

## 5.3 How OpenIE differs from predefined relation extraction

The key contrast in the slide is:

- **OpenIE:** does not rely on a fixed predefined schema.
- **Predefined relation extraction:** uses predefined relation types or schemas.

**[UNCLEAR: the slides mention this contrast in the module outline but do not expand it in detail.]**

---

## 5.4 What an OpenIE extraction looks like

Sentence:

$$
\text{Albert Einstein published the theory of relativity in 1915.}
$$

Example extractions:

$$
(\text{Albert Einstein}; \text{published}; \text{the theory of relativity})
$$

$$
(\text{Albert Einstein}; \text{published in}; \text{1915})
$$

OpenIE relies heavily on earlier NLP steps:

- POS tagging;
- parsing;
- entity recognition.

---

## 5.5 OpenIE methods and limits

### Classical methods used

The slide lists:

- patterns;
- dependency structure;
- clause splitting.

### Later approaches

Later work introduced:

- supervised approaches;
- neural approaches.

### Common challenges

The slide lists:

- ambiguity;
- synonymy;
- coreference;
- trustworthiness of extracted facts.

### Assessment emphasis

Again, the slide states:

- OpenIE is a compact application case rather than the main assessment focus.

---

# Cross-module connections

## POS tagging → parsing

POS tagging identifies each token’s grammatical category. Parsing then uses tokens and their categories to represent sentence structure.

Example:

- POS tagging says `opened` is a verb.
- Parsing says `opened` is the root, `child` is the subject, and `door` is the object.

---

## Parsing → information extraction

Dependency parsing is especially useful for:

- predicate-argument structure;
- information extraction;
- relation analysis.

OpenIE uses dependency structure as one of its classical methods.

---

## POS tagging → NER

NER is like POS tagging because both are token-level sequence labelling tasks.

Difference:

- POS tagging assigns grammatical categories.
- NER assigns entity-boundary and entity-type labels.

---

## BIO tagging → CRFs

BIO tagging creates dependencies between adjacent labels.

Example:

$$
\text{O I-ORG}
$$

is usually not a plausible transition without a preceding:

$$
\text{B-ORG}
$$

CRFs model these dependencies by scoring the full label sequence.

---

## NER → evaluation

NER must be evaluated at entity level, not just token level.

This connects to:

- TP / FP / FN counting;
- precision;
- recall;
- F1;
- micro, macro, and weighted averages.

---

## Annotation → evaluation reliability

Gold labels are only useful if annotation is reliable.

This connects:

- annotation guidelines;
- multiple annotators;
- inter-annotator agreement;
- observed agreement;
- expected agreement;
- Cohen’s Kappa.

---

## Accuracy → class imbalance

Accuracy can hide poor performance on minority classes.

This matters for NLP tasks such as:

- hate vs neutral classification;
- entity recognition where some entity types are rare;
- any positive-class-focused detection task.

In these cases, precision, recall, and F1 are more informative than raw accuracy.

---

# Formula sheet

## POS / NER

BIO class count:

$$
\text{number of BIO classes} = 2N + 1
$$

where $N$ is the number of entity types.

---

## Cohen’s Kappa

Observed agreement:

$$
P_a = \frac{\text{number of agreed labels}}{\text{total number of items}}
$$

Expected agreement:

$$
P_e = \sum_c P(A1=c)P(A2=c)
$$

Kappa:

$$
K = \frac{P_a - P_e}{1 - P_e}
$$

---

## Precision

$$
Precision = \frac{TP}{TP + FP}
$$

---

## Recall

$$
Recall = \frac{TP}{TP + FN}
$$

---

## F-score

$$
F_\beta
=
\frac{(\beta^2 + 1)PR}{\beta^2P + R}
$$

Balanced F1:

$$
F_1
=
\frac{2PR}{P+R}
$$

---

## Accuracy

$$
Accuracy
=
\frac{TP + TN}{TP + TN + FP + FN}
$$

---

## Micro-averaging

Pool counts first:

$$
TP_{\text{total}} = \sum_i TP_i
$$

$$
FP_{\text{total}} = \sum_i FP_i
$$

$$
FN_{\text{total}} = \sum_i FN_i
$$

Then compute precision, recall, and F1 from pooled totals.

---

## Macro-averaging

Compute each metric for each class, then average equally across classes.

For metric $M$:

$$
M_{\text{macro}} = \frac{1}{C}\sum_{i=1}^{C}M_i
$$

---

## Weighted average

Average class-level metrics using class frequency as weights.

$$
M_{\text{weighted}} =
\sum_{i=1}^{C}
w_i M_i
$$

where $w_i$ is based on the number of true instances for class $i$.

---

# High-value revision checklist

- Explain why POS tagging is a disambiguation task.
- Given a sentence, identify possible POS taggings for ambiguous words.
- Distinguish Penn Treebank tags from Universal POS tags.
- Define dependency parsing, head, dependent, and root.
- Read a dependency parse and identify root, subject, object, and modifiers.
- Explain attachment ambiguity and how it affects sentence meaning.
- Build a phrase structure tree using POS categories, constituents, phrasal nodes, and full tree structure.
- Define NER and explain why entity types are domain-dependent.
- Convert between BIO tags and entity mentions.
- Calculate the number of BIO classes using $2N+1$.
- Distinguish local and global sequence models.
- Explain why CRFs are useful for BIO tagging.
- State the CRF sequence probability formula.
- List classical NER feature types.
- Explain exact-match entity-level NER evaluation.
- Compute observed agreement, expected agreement, and Cohen’s Kappa.
- Construct and interpret a confusion matrix.
- Compute precision, recall, F1, and accuracy.
- Explain why accuracy can be misleading for imbalanced data.
- Compute micro-averaged and macro-averaged metrics.
- Explain why partial NER spans do not count as true positives.
- Summarise OpenIE and why it is lower assessment priority in this module.
