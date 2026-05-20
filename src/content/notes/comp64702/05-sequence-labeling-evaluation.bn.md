---
subject: COMP64702
chapter: 5
title: "Sequence Labeling & Evaluation"
language: bn
---

# টেক্সট মাইনিংয়ে সিকোয়েন্স লেবেলিং ও মূল্যায়ন — কাঠামোবদ্ধ স্টাডি নোটস

**বিষয় ও পরিসর:** এই লেকচার সেটে Text Mining / Natural Language Processing-এ sequence labelling এবং evaluation আলোচনা করা হয়েছে। বিষয়গুলোর ক্রম হলো: POS tagging, syntactic parsing, Named Entity Recognition (NER), evaluation methodology, এবং একটি সংক্ষিপ্ত application case — Open Information Extraction.

**বড় প্রেক্ষাপটে অবস্থান:** এই অংশটি বোঝায় কীভাবে raw text ধাপে ধাপে structured linguistic ও semantic representation-এ রূপান্তরিত হয়, এবং কীভাবে NLP system-গুলোকে gold-standard annotation-এর বিপরীতে evaluate করা হয়।

**Source note:** এই নোট দুটি uploaded slide PDF-এর উপর ভিত্তি করে তৈরি: `TM last lecture 1-1.pdf` এবং `TM last lecture 2-1.pdf`। আলাদা কোনো transcript চ্যাটে দেওয়া হয়নি, তাই transcript-নির্ভর detail-গুলো **[UNCLEAR: transcript not provided]** হিসেবে চিহ্নিত করা হয়েছে।

---

## Exam flags / assessment flags

### Explicit assessment flag

- **Module 5 OpenIE:** স্লাইডে সরাসরি বলা হয়েছে যে **OpenIE is “a compact application case rather than the main assessment focus.”**
  - **Exam flag:** OpenIE সম্ভবত POS tagging, parsing, NER, এবং evaluation metrics-এর তুলনায় কম priority পাবে।

### No explicit exam statements found

দৃশ্যমান স্লাইডগুলোতে নিচের ধরনের কোনো স্পষ্ট বাক্য পাওয়া যায়নি:

- “this will be on the exam”
- “you should know this”
- “common mistake”
- “this is important”

তবে স্লাইডে নিচের বিষয়গুলো জোর দিয়ে এসেছে, তাই revision-এর জন্য এগুলো high-value হিসেবে ধরতে হবে:

- POS tagging একটি contextual token-level classification task
- POS tagging-এ ambiguity এবং disambiguation
- dependency parsing: heads, dependents, root, grammatical relations
- phrase structure parsing: NP, VP, PP, tree-building steps
- NER একটি sequence labelling problem
- BIO tagging এবং সূত্র $2N+1$
- local vs global sequence models
- CRFs এবং sequence-level scoring
- exact-match entity-level NER evaluation
- inter-annotator agreement
- observed agreement, expected agreement, Cohen’s Kappa
- confusion matrix: TP, FP, FN, TN
- precision, recall, F1
- class imbalance থাকলে accuracy কেন misleading হতে পারে
- micro, macro, এবং weighted averages

---

## [UNCLEAR] recording-এ যাচাই করার অংশ

- **Transcript missing:** আলাদা lecture transcript চ্যাটে দেখা যায়নি। Spoken explanation, lecturer emphasis, exam hint, এবং অতিরিক্ত worked example তাই unavailable. **[UNCLEAR: transcript not provided]**
- **Module 2 outline truncation:** slide outline শেষ হয়েছে “How dependency structure and phrase structure diffe...” দিয়ে। এটি প্রায় নিশ্চিতভাবে “differ,” কিন্তু slide text truncated. **[UNCLEAR]**
- **Formula formatting:** কিছু slide formula visually clear হলেও parsed text-এ imperfect, বিশেষ করে Cohen’s Kappa, F1, এবং accuracy। এই notes-এ formulas clean ভাবে লেখা হয়েছে। **[UNCLEAR: slide/OCR formatting drops some parentheses]**
- **Kappa interpretation thresholds:** কিছু threshold slide compact notation ব্যবহার করেছে, যেমন `0.6 < acceptable` এবং `0.67 < tentative conclusions < 0.8 < definite conclusions`। নিচে intended interpretation লেখা হয়েছে, কিন্তু lecturer-এর exact wording recording-এ চেক করা উচিত। **[UNCLEAR]**
- **Neural NER slide:** slide-এ প্রশ্ন আছে “Why do we use a recurrent net?” কিন্তু spoken answer দৃশ্যমান slide text-এ নেই। **[UNCLEAR: transcript not provided]**

---

# Module 1 — POS Tagging

## 1.1 NLP pipeline

Natural Language Processing-কে component-ভিত্তিক একটি pipeline হিসেবে উপস্থাপন করা হয়েছে। প্রতিটি component raw text-এ structure-এর একটি নতুন layer যোগ করে, এবং later components আগের components-এর quality-এর উপর heavily depend করে।

স্লাইডে দেখানো pipeline:

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

এই pipeline পুরো lecture sequence-এর কাঠামো তৈরি করে:

- POS tagging token-level grammatical category দেয়।
- Parsing token category ও word order ব্যবহার করে sentence structure represent করে।
- Relation extraction এবং OpenIE আগের linguistic structure ব্যবহার করে machine-readable information extract করে।

---

## 1.2 What parts of speech are

### Intuition

Parts of speech হলো grammatical categories। এগুলো sentence-এ একটি word কী role play করছে তা বোঝায়।

### Formal definition from slides

**Parts of speech are classes of words defined by their grammatical role.**

POS tags দিয়ে words sentence-এ কীভাবে function করছে তা describe করা যায়।

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

POS tags সাধারণত standard annotation scheme থেকে আসে। স্লাইডে দুটি common tagset দেখানো হয়েছে:

1. Penn Treebank tagset
2. Universal POS tagset

### Penn Treebank tagset

Penn Treebank tagset:

- বেশি detailed;
- English-focused;
- examples: `NNP`, `VBD`, `DT`.

Examples:

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

Universal POS tagset:

- broader;
- cross-linguistic;
- examples: `PROPN`, `VERB`, `DET`.

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

**POS tagging হলো sentence-এর প্রতিটি token-এ একটি POS tag assign করার task.**

POS tagging সাধারণত tokenisation-এর পরে হয়।

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

একই word ভিন্ন context-এ ভিন্ন tag পেতে পারে। তাই POS tagging শুধু dictionary lookup নয়; এটি contextual classification।

---

## 1.5 Why POS tagging is hard

### Core issue: ambiguity

অনেক word isolation-এ ambiguous। তাই অনেক ক্ষেত্রে POS tagging একটি **disambiguation task**।

### Examples from slides

#### `duck`

- `duck` = action / verb
- `duck` = bird / noun

#### `walk`

- `to walk` → verb
- `go for a walk` → noun

#### `old`

- `Old people` → adjective
- `the old` → noun-like / nominal use

#### `referee`

- `They referee the matches` → verb
- `The referee starts the match` → noun

---

## 1.6 How context helps disambiguation

### Syntactic ambiguity can disappear with context

স্লাইডে observation ছিল যে syntactic ambiguity সাধারণত token isolation-এ থাকলে দেখা যায়, কিন্তু word combination-এ অনেক সময় disappear করে।

Examples:

- `I want to go` vs `I want a go`
- `I can walk there` vs `I will take a walk`
- `The garbage can smell` vs `The garbage can smells`

### Sometimes context does not fully resolve ambiguity

কখনও context ambiguity পুরোপুরি remove করে না।

Example:

$$
\text{They can fish}
$$

Possible tagging 1:

$$
\text{They/PRON can/AUX fish/VERB}
$$

Meaning: তারা মাছ ধরতে পারে। এখানে `can` auxiliary এবং `fish` verb।

Possible tagging 2:

$$
\text{They/PRON can/VERB fish/NOUN}
$$

Meaning: তারা মাছ can/container-এ ভরতে পারে। এখানে `can` verb এবং `fish` noun।

---

## 1.7 Contextual heuristics for POS tagging

স্লাইডে context কীভাবে disambiguation-এ সাহায্য করে তার কয়েকটি heuristic দেওয়া হয়েছে।

### Heuristic 1: determiner before token

A token is very unlikely to be a verb if its preceding word is a determiner.

Example:

$$
\text{I want a go}
$$

এখানে `a` determiner হওয়ায় `go` noun হওয়ার সম্ভাবনা বেশি।

### Heuristic 2: `to` before token

A token is unlikely to be a noun if the immediately preceding word is `to`.

Example:

$$
\text{I want to go}
$$

এখানে `go` verb হওয়ার সম্ভাবনা বেশি।

### Heuristic 3: pronoun followed by common noun

A token is more likely to be a possessive pronoun when followed by a common noun.

Example:

$$
\text{He stroked her cat}
$$

এখানে `her` possessive pronoun হিসেবে পড়া যায়।

### Limitation

সবসময় heuristic কাজ করে না।

Example:

$$
\text{He gave her money}
$$

এখানে `her` possessive নয়; এটি recipient/indirect object হতে পারে।

---

## 1.8 Local context

### Definition

**Local context** হলো target token-এর আশেপাশের neighbouring words। POS tagging models শেখে neighbouring words কীভাবে likely tags influence করে।

Examples:

- $\text{a walk}$ → `walk` likely noun
- $\text{to walk}$ → `walk` likely verb
- $\text{the old man}$ → `old` adjective

Key point:

- Context শব্দের grammatical role নির্ধারণে সাহায্য করে।
- POS tagging system-গুলো local context থেকে disambiguation signal শেখে।

---

## 1.9 One sentence, two valid taggings

Meaning affects POS tagging.

Example:

$$
\text{I saw her duck.}
$$

এই sentence-এর দুটি valid interpretation আছে।

### Interpretation 1: pet bird

Meaning: আমি তার পোষা হাঁস দেখেছি।

$$
\text{I/PRON saw/VERB her/PRON duck/NOUN ./PUNCT}
$$

এখানে `duck` noun।

### Interpretation 2: lowering her head quickly

Meaning: আমি দেখেছি সে দ্রুত মাথা নিচু করেছে।

$$
\text{I/PRON saw/VERB her/PRON duck/VERB ./PUNCT}
$$

এখানে `duck` verb।

### Key point

A tagger must choose the tag that matches the intended meaning.

---

## 1.10 One POS tag per token per run

স্লাইডে বলা হয়েছে task হলো individual token-এ POS tag assign করা, কিন্তু **প্রতি run-এ প্রতি token-এর জন্য শুধু একটি POS tag** দেওয়া হয়।

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

আরেক example:

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

Key point:

- একাধিক interpretation সম্ভব হলেও system-কে একটি chosen tagging output করতে হয়।
- অর্থ/context tagging choice নির্ধারণ করে।

---

## 1.11 Rule-based and data-driven tagging

### Rule-based tagging

Rule-based approach handcrafted grammatical rules ব্যবহার করে।

Possible rule examples:

- determiner-এর পরে noun প্রত্যাশিত;
- `to`-এর পরে verb প্রত্যাশিত;
- context pattern দেখে likely tag select করা।

### Data-driven tagging

Statistical বা neural approach annotated corpora থেকে pattern শেখে।

POS-tagged corpora provide:

- example sentences;
- gold labels;
- disambiguation-এর evidence।

### Slide conclusion

In practice, modern systems are usually data-driven.

---

## 1.12 POS-tagged corpora examples

### Penn Treebank-style example

Token-by-token annotation:

$$
\begin{array}{ll}
\text{Today} & \text{NN} \\
\text{is} & \text{VBZ} \\
\text{a} & \text{DT} \\
\text{nice} & \text{JJ} \\
\text{day} & \text{NN} \\
. & .
\end{array}
$$

Second sentence:

$$
\begin{array}{ll}
\text{I} & \text{PRP} \\
\text{want} & \text{VBP} \\
\text{to} & \text{TO} \\
\text{go} & \text{VB} \\
\text{for} & \text{IN} \\
\text{a} & \text{DT} \\
\text{walk} & \text{NN} \\
. & .
\end{array}
$$

Inline form:

$$
\text{Today/NN is/VBZ a/DT nice/JJ day/NN ./.}
$$

$$
\text{I/PRP want/VBP to/TO go/VB for/IN a/DT walk/NN ./.}
$$

### Universal POS-style example

$$
\begin{array}{ll}
\text{Today} & \text{NOUN} \\
\text{is} & \text{VERB} \\
\text{a} & \text{DET} \\
\text{nice} & \text{ADJ} \\
\text{day} & \text{NOUN} \\
. & \text{PUNCT}
\end{array}
$$

$$
\begin{array}{ll}
\text{I} & \text{PRON} \\
\text{want} & \text{VERB} \\
\text{to} & \text{ADP} \\
\text{go} & \text{VERB} \\
\text{for} & \text{ADP} \\
\text{a} & \text{DET} \\
\text{walk} & \text{NOUN} \\
. & \text{PUNCT}
\end{array}
$$

---

# Module 2 — Syntactic Parsing

## 2.1 What syntactic parsing is

### Intuition

POS tagging প্রতিটি token কী category-এর word তা বলে। Parsing বলে words একে অপরের সঙ্গে structurally কীভাবে related।

### Formal definition from slides

- POS tags tell us the category of each word.
- Parsing tells us how the words are structurally related.
- Parsing helps answer:
  - Which noun is the subject?
  - Which phrase is the object?
  - What does a prepositional phrase modify?

স্লাইডে syntax-এর দুটি major view দেওয়া হয়েছে:

1. **Dependency structure**
2. **Phrase structure**

---

## 2.2 Why parsing matters

কিছু sentence POS tagging-এর পরেও ambiguous থাকে।

Example:

$$
\text{The teacher discussed the essay with the student.}
$$

Question:

- `with the student` কি teacher কার সঙ্গে কথা বলেছে তা describe করছে?
- নাকি কোন essay নিয়ে আলোচনা হয়েছে তা describe করছে?

Parsing এই structural choice-গুলো explicit করে।

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

Sentence বুঝতে হলে প্রতিটি word আলাদা করে treat করা যায় না। কোন word কোন word-এর সঙ্গে attached বা connected তা determine করতে হয়।

---

## 2.3 Dependency parsing

### Definition

Dependency parse words-এর মধ্যে grammatical relation represent করে। প্রতিটি relation link করে:

- একটি **head**
- একটি **dependent**

পুরো sentence-এর head সাধারণত main verb। Dependency parse tokens-এর উপর একটি directed structure তৈরি করে।

### Intuition

Dependency parsing জিজ্ঞেস করে: কোন word কোন word-এর উপর depend করছে?

Examples:

- subject predicate-এর উপর depend করে;
- object predicate-এর উপর depend করে;
- modifier যে word modify করে তার উপর depend করে।

---

## 2.4 Heads, dependents, and root

Dependency parsing-এ:

- sentence head প্রায়ই main predicate;
- subjects এবং objects সেই predicate-এর উপর depend করে;
- modifiers তারা যে word modify করে তার উপর depend করে।

Example from slides:

$$
\text{The child opened the door}
$$

- **opened** হলো root।
- **child** হলো subject dependent।
- **door** হলো object dependent।

---

## 2.5 A dependency tree in practice

স্লাইডে dependency tree দেওয়া হয়েছে:

$$
\text{Economic news had little effect on financial markets .}
$$

Tree reading:

- **had** হলো structural centre / root।
- **news** subject হিসেবে attached।
- **effect** object হিসেবে attached।
- **Economic** modifies **news**।
- **little** modifies **effect**।
- **on** এবং **markets** prepositional structure তৈরি করে।
- **financial** modifies **markets**।
- punctuation sentence/root level-এ attached।

### Key point

Edge labels বলে প্রতিটি token sentence-এ কীভাবে function করছে। Dependency representation sentence structure explicit করে এবং analysis সহজ করে।

---

## 2.6 Common dependency relations

স্লাইডে common dependency labels দেওয়া হয়েছে। Exact inventory annotation scheme-এর উপর depend করে।

| Label | Meaning | Slide example |
|---|---|---|
| `nsubj` / `sbj` | nominal subject | `Clinton defeated Cole` → `sbj(defeated, Clinton)` |
| `obj` / `dobj` | object | `She gave me a raise` → `obj(gave, raise)` |
| `iobj` | indirect object | `She gave me a raise` → `iobj(gave, me)` |
| `amod` / `nmod` | nominal modifier | `Sam eats red meat` → `nmod(meat, red)` |
| `advmod` / `vmod` | adverbial / verb modifier | `Genetically modified food` → `vmod(modified, genetically)` |
| `det` | determiner | `The man is here` → `det(man, the)` |
| `aux` | auxiliary | `He should leave` → `aux(leave, should)` |
| `cc` | coordination | `They either ski or snowboard` → `cc(ski, or)` |
| `case` / prep-related links | prepositional marking | scheme অনুযায়ী label বদলাতে পারে |
| `pobj` / `pc` | object of preposition | `I sat on the chair` → `pobj(on, chair)` |
| `p` / `punct` | punctuation | `Go home!` → `punct(Go, !)` |

---

## 2.7 Reading a dependency analysis

Dependency parse পড়তে প্রশ্নগুলো করতে হবে:

1. Root কী?
2. Root-এর উপর সরাসরি কোন words depend করছে?
3. কোন words nouns modify করছে?
4. কোন phrases event/action modify করছে?

Example:

$$
\text{Economic news had little effect on financial markets .}
$$

স্লাইডের visual অনুযায়ী reading:

- Root: **had**
- Subject: **news**
- Object: **effect**
- Noun modifiers:
  - **Economic** modifies **news**
  - **little** modifies **effect**
  - **financial** modifies **markets**
- Prepositional relation:
  - **on financial markets** relates to **effect**
- Punctuation:
  - period sentence/root level-এ attached

---

## 2.8 Attachment ambiguity

### Definition

Attachment ambiguity ঘটে যখন কোনো phrase একাধিক word বা phrase-এর সঙ্গে attach হতে পারে।

Example:

$$
\text{The teacher discussed the essay with the student.}
$$

### Interpretation A

$$
\text{with the student}
$$

modifies:

$$
\text{discussed}
$$

Meaning:

- teacher student-এর সঙ্গে কথা বলেছে।

### Interpretation B

$$
\text{with the student}
$$

modifies:

$$
\text{essay}
$$

Meaning:

- essay student সম্পর্কে / student-এর সঙ্গে associated।

### Key point

Different meanings require different parses.

---

## 2.9 How to decide where a phrase attaches

Guiding question:

$$
\text{Which word is this phrase modifying?}
$$

Rules of thumb from slides:

- Phrase যদি event বা action describe করে, সাধারণত verb-এর সঙ্গে attach করে।
- Phrase যদি entity describe করে, সাধারণত noun-এর সঙ্গে attach করে।
- Parsing semantic interpretation-এর সঙ্গে closely tied।

---

## 2.10 Phrase structure parsing

### Definition

Phrase structure parsing sentences-কে nested constituents হিসেবে represent করে। Head-dependent links-এর বদলে এটি words-কে phrases-এ group করে।

Typical phrase types:

| Phrase type | Meaning |
|---|---|
| `NP` | noun phrase |
| `VP` | verb phrase |
| `PP` | prepositional phrase |
| `AdjP` | adjectival phrase |
| `AdvP` | adverbial phrase |

Example slide tree:

$$
\text{Economic news had little effect on financial markets}
$$

Tree-তে POS tags ও words-এর উপরে nested phrase nodes আছে।

---

## 2.11 Building a phrase structure tree

Worked example:

$$
\text{The child put the puppy in the garden}
$$

Phrase structure analysis সাধারণত stages-এ হয়:

- POS categories identify করা;
- major constituents locate করা;
- phrase nodes project করা;
- tokens-কে phrases-এর সঙ্গে connect করা;
- phrases combine করে full tree তৈরি করা।

### Step 1: Label POS categories

$$
\begin{array}{llllllll}
\text{The} & \text{child} & \text{put} & \text{the} & \text{puppy} & \text{in} & \text{the} & \text{garden} \\
\text{DT} & \text{NN} & \text{VBD} & \text{DT} & \text{NN} & \text{IN} & \text{DT} & \text{NN}
\end{array}
$$

### Step 2: Locate the two principal constituents

দুটি principal constituent আছে:

$$
[\text{The child}] \quad [\text{put the puppy in the garden}]
$$

এগুলো হলো:

- NP: $[\text{The child}]$
- VP: $[\text{put the puppy in the garden}]$

### Step 3: Project phrasal nodes

প্রতিটি head noun/pronoun, verb, adjective, adverb, এবং preposition-এর জন্য phrasal node project করা হয়:

- NP
- VP
- NP
- PP
- NP

For the example:

$$
[\text{The child}] \quad [\text{put the puppy in the garden}]
$$

contains:

- **NP**: The child
- **VP**: put the puppy in the garden
- **NP**: the puppy
- **PP**: in the garden
- **NP**: the garden

### Step 4: Connect remaining tokens to the nodes they belong to

Determiners noun phrase-এর ভিতরে attach করে:

- **The** attaches to NP headed by **child**।
- **the** attaches to NP headed by **puppy**।
- **the** attaches to NP headed by **garden**।

Preposition **in** PP introduce করে।

### Final tree

Final tree **S**-এর নিচে combine হয়:

$$
S
$$

with:

- NP = $\text{The child}$
- VP = $\text{put the puppy in the garden}$

VP contains:

- verb = **put**
- NP = $\text{the puppy}$
- PP = $\text{in the garden}$

PP contains:

- preposition = **in**
- NP = $\text{the garden}$

### Key point

Final tree grouping এবং hierarchy—দুটোই দেখায়।

---

## 2.12 Identifying noun phrases

### Definition

Noun phrase noun বা pronoun-কে centre করে।

এতে থাকতে পারে:

- determiners;
- adjectives;
- possessives;
- modifiers.

Examples from slides:

- $\text{the child}$
- $\text{her old bicycle}$
- $\text{the report on climate change}$

Important warning:

- sentence-এর প্রতিটি long span noun phrase নয়।

---

## 2.13 Dependency structure vs phrase structure

### Dependency parsing

Dependency parsing words-এর মধ্যে relation focus করে।

Especially useful for:

- predicate-argument structure;
- information extraction;
- relation analysis.

Represented using:

- directed edges;
- head-dependent relations;
- edge labels for grammatical functions;
- POS tags for syntactic categories.

### Phrase structure parsing

Phrase structure parsing constituent grouping focus করে।

Especially useful for:

- constituent identification;
- NP / VP / PP analysis;
- hierarchical sentence structure.

Represented using:

- non-terminal phrase nodes;
- hierarchical structure;
- POS tags for syntactic categories.

---

## 2.14 Endocentric vs exocentric constructions

স্লাইডে **Dependency structures: Endocentric vs Exocentric Constructions** table দেওয়া হয়েছে।

| Construction | Head | Dependent | Required? |
|---|---|---|---|
| Exocentric | verb | subject / `sbj` | yes |
| Exocentric | verb | object / `obj` | yes |
| Endocentric | verb | adverb / `vmod` | no |
| Endocentric | noun | adjective / `nmod` | no |

Interpretation:

- Subject এবং object relation shown exocentric cases-এ required হিসেবে দেখানো হয়েছে।
- Adverbial এবং adjectival modifiers shown endocentric cases-এ optional হিসেবে দেখানো হয়েছে।

---

## 2.15 Various dependency notations

স্লাইড warning দেয় যে dependency notation অনেক রকম আছে, কিন্তু conceptual similarity থাকে।

### Notation 1

Horizontally arranged tokens with directed edges.

Contains:

- tokens;
- grammatical function labels.

### Notation 2

Horizontally arranged tokens with directed edges, but arrows are in the opposite direction.

Contains:

- same conceptual structure;
- different arrow convention.

### Notation 3

Tree of tokens.

Direction naturally encoded by the tree.

### Notation 4

Tree of POS tags mapped to tokens.

Contains:

- tokens;
- grammatical function labels;
- POS tags.

### Key point

Notation-এ আটকে যাওয়া দরকার নেই। Concepts-এ focus করতে হবে:

- heads;
- dependents;
- grammatical relations;
- sentence structure.

---

# Module 3 — Named Entity Recognition

## 3.1 What NER is

### Definition

Named Entity Recognition বা NER text-এর মধ্যে real-world entity mention identify করে এবং প্রতিটি mention-এ label assign করে।

Typical entity types:

- Person
- Organisation
- Location
- Date / Time
- Money

NER সাহায্য করে এই ধরনের প্রশ্নের উত্তর দিতে:

- কে mention করা হয়েছে?
- ঘটনা কোথায় ঘটেছে?
- কোন organisations involved?

---

## 3.2 Example: news entities

স্লাইডে একটি news snippet দেখানো হয়েছে এবং প্রশ্ন করা হয়েছে: “What is this snippet talking about?”

Marked entities:

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

NER text spans-কে labelled entity mention-এ রূপান্তর করে। কোন labels ব্যবহার হবে তা task-এর entity inventory-এর উপর depend করে।

---

## 3.3 Named entities are task-dependent

Useful entity types application domain-এর উপর depend করে।

### In news text

Common types:

- person;
- organisation;
- location;
- date.

### In biomedical text

Useful types হতে পারে:

- drug;
- disease;
- protein;
- virus.

### Key point

NER-এর জন্য একটিমাত্র fixed universal label set নেই। Domain label set নির্ধারণ করে।

---

## 3.4 Example: biomedical entities

Biomedical slide-এ marked entities:

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

Biomedical NER-এর entity types news NER-এর entity types থেকে আলাদা। Domain অনুযায়ী relevant label set বদলায়।

---

## 3.5 Why NER is context-dependent

একই string বিভিন্ন context-এ ভিন্ন entity type refer করতে পারে।

Examples from slides:

- **Washington**
  - person
  - city
  - government
- **Amazon**
  - company
  - river

Therefore:

- NER systems শুধু surface form দেখে সিদ্ধান্ত নিতে পারে না।
- Context ব্যবহার করতে হয়।

---

## 3.6 NER as sequence labelling

NER সাধারণত token-level sequence labelling task হিসেবে formulate করা হয়।

প্রতিটি token একটি tag পায় যা বলে:

- tokenটি entity-এর ভিতরে আছে কি না;
- থাকলে কোন entity type-এর অংশ।

এ কারণে NER POS tagging-এর মতো, কিন্তু span boundary যোগ হয়।

---

## 3.7 BIO tagging scheme

### Formal tag definitions

- **B-X** = entity type $X$-এর beginning
- **I-X** = entity type $X$-এর inside
- **O** = outside any entity

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

- **Maya Chen** = PER
- **Northbridge Labs** = ORG
- **Leeds** = LOC

### Key point

BIO token labels থেকে entity spans recover করা যায়।

---

## 3.8 From BIO tags to entity mentions

Consecutive BIO tags complete entity mention define করে।

Example:

$$
\text{B-PER I-PER}
$$

মানে one two-token person entity.

Correct entity prediction-এর জন্য দরকার:

1. correct span;
2. correct type.

Important:

- entity boundary ভুল হলে token-level similarity যথেষ্ট নয়।
- Boundary errors সরাসরি NER evaluation-এ matter করে।

---

## 3.9 Number of BIO output classes

যদি BIO $N$ entity types-এর জন্য ব্যবহার করা হয়, output classes-এর সংখ্যা:

$$
2N + 1
$$

Reason:

- প্রতিটি entity type-এর জন্য একটি **B** tag;
- প্রতিটি entity type-এর জন্য একটি **I** tag;
- একটি **O** tag.

Example:

Entity types:

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

- **B\_PER** = begin the mention
- **I\_PER** = inside the mention

---

## 3.10 Local and global sequence models

### Local model

A local model প্রতিটি tag mainly token-level context থেকে predict করে।

স্লাইডের ভাষায় local approach:

- tags are independent of each other;
- sequence classifier হিসেবে RNN, LSTM, BiLSTM ব্যবহার হতে পারে।

### Global model

A global model output tags-এর dependencies consider করে পুরো label sequence predict করে।

স্লাইডের ভাষায় global approach:

- tags are dependent on each other;
- examples:
  - Hidden Markov Model / HMM
  - Conditional Random Field / CRF

### Why this matters

কিছু tag sequence অন্য sequence-এর তুলনায় অনেক বেশি plausible।

Example:

$$
\text{I-ORG}
$$

সাধারণত এটি নিচের tag-এর পরে আসা উচিত নয়:

$$
\text{O}
$$

যদি তার আগে:

$$
\text{B-ORG}
$$

না থাকে। তাই label dependencies model করা NER performance improve করতে পারে।

---

## 3.11 Conditional Random Fields

### Definition

Conditional Random Field বা CRF হলো global sequence model.

এটি প্রতিটি token independently score না করে পুরো output sequence score করে।

CRFs useful কারণ তারা dependencies model করতে পারে, যেমন:

- legal BIO transitions;
- neighbouring labels-এর consistency.

এটি sequence labelling performance improve করতে পারে।

### Linear-chain CRF formula from slide

Slide-এ probability computation:

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
- $w_k$ = feature $k$-এর weight
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

স্লাইডে বলা হয়েছে $Z_x$ probabilities-এর sum 1 হয় তা নিশ্চিত করে।

---

## 3.12 Features used in classical NER

Classical NER models সাধারণত handcrafted features ব্যবহার করে।

### Contextual features

- current word $w_0$
- $w_0$-এর আশেপাশের words একটি window-তে:

$$
[-3, \ldots, +3]
$$

### POS tag

- POS tag, when available.

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

Number of tokens হিসেবে length।

### Orthographic features

এই features binary এবং mutually exclusive নয়:

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

- named entity-এর প্রতিটি component;
- whole named entity.

### Gazetteers

Gazetteers include করতে পারে:

- geographical locations;
- first names;
- surnames;
- company names;
- many others.

Possible features/questions:

- Whole named entity কি gazetteer-এ আছে?
- Named entity-এর কোনো component কি gazetteer-এ আছে?

Slide emphasis:

- “The more useful features you incorporate, the more powerful your learner gets!”

---

## 3.13 Neural approaches to NER

Neural sequence models manual feature engineering-এর প্রয়োজন কমায়।

Common models:

- BiLSTM
- BiLSTM-CRF
- Transformer-based encoders

এই models data থেকে contextual representations directly শেখে এবং training data available থাকলে ভালো perform করে।

### Independent neural tag prediction formula

Neural NER slide-এর formula:

$$
Pr(tag \mid token) = softmax(W h_{token} + b)
$$

Where:

- $h_{token}$ = token-এর learned representation;
- $W$ = weight matrix;
- $b$ = bias term;
- softmax scores-কে tag probabilities-এ convert করে।

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

Slide asks: “Why do we use a recurrent net?”

**[UNCLEAR: visible slide text-এ answer নেই; lecture recording check করতে হবে.]**

---

## 3.14 Exact-match evaluation for NER

NER সাধারণত entity level-এ evaluate করা হয়, শুধু token level-এ নয়।

একটি predicted entity true positive count হবে কেবল যদি:

1. span correct হয়;
2. type correct হয়।

Boundary ভুল হলে entity correct নয়। Type ভুল হলেও entity correct নয়।

### Connection

এই ধারণা Module 4 evaluation-এর সঙ্গে সরাসরি যুক্ত, বিশেষ করে precision, recall, F1, এবং entity-level counting।

---

# Module 4 — Evaluation Method

## 4.1 What “evaluation” means

Slide definition অনুযায়ী evaluation হলো:

- amount, number, or value of something সম্পর্কে judgement করা।

Computer Science-এ evaluation synonymous with:

$$
\text{testing}
$$

---

## 4.2 Why we evaluate NLP systems

Evaluation বলে system কত ভালো perform করছে।

Users care করে:

- system task-এর জন্য useful কি না।

Developers care করে:

- system সময়ের সঙ্গে improve করছে কি না।

Evaluation supports:

- comparison;
- debugging;
- model selection;
- scientific reporting.

---

## 4.3 Benchmark data and gold standards

Performance evaluation প্রায়ই benchmark datasets-এর উপর based।

Benchmark datasets contain:

- inputs;
- gold-standard labels;
- fixed evaluation protocol.

Gold standards সাধারণত human annotators annotation guidelines follow করে তৈরি করে।

Reliable evaluation depends on reliable annotation.

---

## 4.4 Community challenge / shared task setup

Slide examples:

- Kaggle
- SemEval

Performance evaluation often:

- benchmark dataset-এর উপর based;
- community challenge বা shared task ঘিরে organized.

In this setup:

- specific task defined হয়;
- gold-standard data provided হয়:
  - training set;
  - development set;
  - test set.

Automated scoring compares:

- **response** = system-generated annotations / predictions;
- **reference** = gold standard.

---

## 4.5 Gold-standard data

Gold-standard data:

- produce করতে time-consuming এবং costly;
- annotation instructions / annotation guidelines required;
- usually experts দ্বারা annotated;
- কখনও linguistics training দরকার হতে পারে।

Multiple annotators একই samples, বা অন্তত samples-এর subset, label করতে হয়।

Reason:

- annotations reliable কি না নিশ্চিত করতে;
- inter-annotator agreement calculate করতে;
- কারণ disagreements হতে পারে।

---

## 4.6 Inter-annotator agreement

### Definition

Inter-annotator agreement measure করে humans একই data কত consistently label করে।

Human annotations সবসময় identical নয়।

Different annotators একই guideline ভিন্নভাবে interpret করতে পারে।

High agreement suggests:

- task clearer;
- guidelines clearer;
- annotations more reliable.

---

## 4.7 Observed agreement: $P_a$

### Definition

Observed agreement হলো annotators যে cases-এ agree করে তার proportion।

### Worked example

দুই annotator 10 items label করে।

তারা 7 items-এ agree করে।

তাহলে:

$$
P_a = \frac{7}{10} = 0.70
$$

Important limitation:

- observed agreement chance agreement correct করে না।

---

## 4.8 Expected agreement: $P_e$

### Definition

Expected agreement estimate করে chance অনুযায়ী কতটা agreement হতে পারত।

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

Cohen’s Kappa observed agreement-কে chance agreement-এর জন্য correct করে।

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

- Kappa raw agreement-এর তুলনায় বেশি informative।

---

## 4.10 Kappa coefficient: table example

Slide table:

|  | Annotator 1: yes | Annotator 1: no | Total |
|---|---:|---:|---:|
| Annotator 2: yes | 31 | 1 | 32 |
| Annotator 2: no | 2 | 6 | 8 |
| Total | 33 | 7 | 40 |

### Step 1: Observed agreement

Agreement হয় যখন দুই annotator-ই **yes** বলে বা দুই annotator-ই **no** বলে।

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

Using the earlier Kappa formula:

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

Slide নিজে $P(a)$ এবং $P(e)$ দেখায়; final Kappa calculation formula থেকে directly follows।

---

## 4.11 Kappa interpretation

Slide-এ কয়েকটি interpretation scheme দেওয়া হয়েছে।

### Landis and Koch, 1977

Approximate thresholds:

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

- agreement above 0.6 acceptable হিসেবে ধরা হয়।
- **[UNCLEAR: exact wording recording-এ check করতে হবে.]**

### Krippendorff, 1980

Slide notation:

$$
0.67 < \text{tentative conclusions} < 0.8 < \text{definite conclusions}
$$

Interpretation:

- above 0.67 tentative conclusions support করে;
- above 0.8 definite conclusions support করে।
- **[UNCLEAR: compact notation on slide.]**

### Rietveld and van Hout, 1993

Approximate thresholds:

- $0.4$ to $0.6$: moderate
- $0.6$ to $0.8$: substantial

### Green, 1997

Approximate thresholds:

- $< 0.4$: low
- $0.4$ to $0.75$: fair/good
- $> 0.75$: high

---

## 4.12 Scoring with a confusion matrix

Basic categories:

|  | Correct | Not correct |
|---|---|---|
| Annotated | True positive / TP | False positive / FP |
| Not annotated | False negative / FN | True negative / TN |

Definitions:

- **True positive / TP:** annotated বা predicted item correct।
- **False positive / FP:** annotated বা predicted item not correct।
- **False negative / FN:** correct item annotated / found হয়নি।
- **True negative / TN:** item correctly unannotated / correctly predicted negative।

For automated systems:

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

> predicted positive items-এর মধ্যে কয়টি correct?

অথবা annotation wording অনুযায়ী:

> annotated items-এর কত fraction correct?

### Formula

$$
Precision = \frac{TP}{TP + FP}
$$

---

## 4.14 Recall

### Intuition

Recall asks:

> truly positive items-এর মধ্যে কয়টি system খুঁজে পেয়েছে?

অথবা annotation wording অনুযায়ী:

> correct items-এর কত fraction annotated?

### Formula

$$
Recall = \frac{TP}{TP + FN}
$$

Precision এবং recall performance-এর ভিন্ন দিক capture করে।

---

## 4.15 Worked example: blue stars

Slide visual-এ blue stars এবং red ovals আছে। Target class:

$$
\text{Blue stars}
$$

Selected / annotated region contains:

- 5 true blue stars;
- 2 red ovals incorrectly included.

Outside selected region:

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

F-score হলো precision এবং recall-এর weighted harmonic mean.

### General $F_\beta$ formula

$$
F_\beta
=
\frac{(\beta^2 + 1)PR}{\beta^2P + R}
$$

Where:

- $P$ = precision;
- $R$ = recall;
- $\beta$ recall ও precision-এর relative weighting control করে।

### Balanced F1

Usually balanced F1 measure use করা হয়, where:

$$
\beta = 1
$$

So:

$$
F_1
=
\frac{2PR}{P+R}
$$

Slide says harmonic mean is a more conservative average and gives a “truer picture.”

Key intuition:

- F1 high হবে only when both precision and recall high.

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

F-score arithmetic mean-এর তুলনায় slightly lower.

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

- Arithmetic mean moderately high দেখায়।
- F1 অনেক lower কারণ recall খুব poor।
- এটি দেখায় harmonic mean কেন more conservative।

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

Slide states that this shows the full calculation from counts to F1.

---

## 4.20 Accuracy

### Definition

Accuracy হলো all correctly identified cases-এর proportion।

### Formula

$$
Accuracy
=
\frac{TP + TN}{TP + TN + FP + FN}
$$

Accuracy suitable if all classes are equally important.

---

## 4.21 When accuracy can mislead

Accuracy imbalanced datasets-এ misleading হতে পারে।

Example from slides:

- If 95% of items are negative, always predicting negative gives:

$$
Accuracy = 95\%
$$

But recall for the positive class is:

$$
Recall = 0
$$

কারণ system কোনো positive case খুঁজেই পায় না।

Example task mentioned:

- Hate vs Neutral

Slide recommendation:

- Use F-score in such cases.

---

## 4.22 Multiple categories: macro-averaging

Question from slide: Person and Location-এর combined performance কীভাবে report করা হবে?

Given table:

| Category | TPs | FPs | FNs | Precision | Recall |
|---|---:|---:|---:|---:|---:|
| Person | 78 | 5 | 33 | 0.94 | 0.70 |
| Location | 20 | 3 | 2 | 0.87 | 0.91 |

### Macro-averaging

Macro-averaging categories-এর উপর simple average নেয়।

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

F1 using averaged precision and recall:

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

**[UNCLEAR: slide averaged precision ও recall থেকে F1 compute করেছে; lecturer per-class F1 average থেকে এটি আলাদা করেছেন কি না recording-এ check করতে হবে.]**

---

## 4.23 Multiple categories: micro-averaging

### Definition

Micro-averaging আগে TPs, FPs, এবং FNs pool করে, তারপর metric compute করে।

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

Slide states:

- Macro-averaging class imbalance consider করে না।
- Micro-averaging imbalance-এর প্রতি less sensitive।
- Weighted average = প্রতিটি class-এর true instances সংখ্যা দিয়ে weighted average।

**[UNCLEAR: lecturer-এর wording check করা উচিত। Averaging choices rare-class influence-এ strongly affect করে.]**

### Weighted average

Definition from slide:

$$
\text{weighted average}
=
\text{average weighted by number of true instances for each class}
$$

Averaging method choice final score-এ rare classes কতটা influence করবে তা বদলায়।

---

## 4.25 Entity-level evaluation for NER

NER entity level-এ evaluate করা হয়, শুধু token level-এ নয়।

Predicted entity true positive count হবে only if:

1. span correct;
2. type correct.

Partially correct span true positive count হয় না।

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

From gold BIO tags:

- **Dr Maya Chen** = PER
- **Acme Labs** = ORG
- **Bristol** = LOC

### Predicted entities

From predicted BIO tags:

- **Dr Maya** = PER
- **Acme Labs** = ORG
- no LOC entity predicted

### Counts

PER:

$$
TP = 0,\quad FP = 1,\quad FN = 1
$$

Reason:

- predicted person span incomplete;
- gold person span = **Dr Maya Chen**;
- predicted person span = **Dr Maya**.

ORG:

$$
TP = 1,\quad FP = 0,\quad FN = 0
$$

LOC:

$$
TP = 0,\quad FP = 0,\quad FN = 1
$$

Reason:

- Bristol missed.

Key point:

- Person prediction wrong because predicted span incomplete.

---

## 4.27 Worked NER example: counting entities, version 2

Gold entities:

- **Maya Chen** = PER
- **Acme Labs** = ORG
- **Bristol** = LOC

Predicted entities:

- **Maya Chen** = PER
- **Acme** = ORG
- **Bristol** = LOC

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

- predicted **Acme** হলো gold **Acme Labs**-এর শুধু অংশ;
- partial span correct count হয় না।

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

- Micro-averaging categories জুড়ে সব entity decisions combine করার পর one overall score দেয়।

---

# Module 5 — Open Information Extraction

## 5.1 Module scope

এই module introduce করে:

- Open Information Extraction কী;
- OpenIE predefined relation extraction থেকে কীভাবে আলাদা;
- classical এবং neural OpenIE approaches-এর সংক্ষিপ্ত overview.

Assessment note:

- OpenIE-কে main assessment focus নয়, বরং compact application case হিসেবে describe করা হয়েছে।

---

## 5.2 What Open Information Extraction is

### Definition

Open Information Extraction, বা OpenIE, fixed predefined schema-এর উপর rely না করে text থেকে relational facts extract করে।

### Input

- raw sentences;
- documents.

### Output

Relation tuples, such as:

$$
(\text{argument}, \text{relation}, \text{argument})
$$

### Goal

OpenIE unstructured text-কে machine-readable knowledge-এ turn করতে চায়।

---

## 5.3 How OpenIE differs from predefined relation extraction

Slide-এর key contrast:

- **OpenIE:** fixed predefined schema-এর উপর rely করে না।
- **Predefined relation extraction:** predefined relation types বা schemas ব্যবহার করে।

**[UNCLEAR: slides module outline-এ এই contrast mention করেছে, কিন্তু detail-এ expand করেনি.]**

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

OpenIE heavily relies on earlier NLP steps:

- POS tagging;
- parsing;
- entity recognition.

---

## 5.5 OpenIE methods and limits

### Classical methods used

Slide lists:

- patterns;
- dependency structure;
- clause splitting.

### Later approaches

Later work introduced:

- supervised approaches;
- neural approaches.

### Common challenges

Slide lists:

- ambiguity;
- synonymy;
- coreference;
- trustworthiness of extracted facts.

### Assessment emphasis

Again, slide states:

- OpenIE is a compact application case rather than the main assessment focus.

---

# Cross-module connections

## POS tagging → parsing

POS tagging প্রতিটি token-এর grammatical category identify করে। Parsing তারপর tokens এবং তাদের categories ব্যবহার করে sentence structure represent করে।

Example:

- POS tagging বলে `opened` একটি verb।
- Parsing বলে `opened` root, `child` subject, এবং `door` object।

---

## Parsing → information extraction

Dependency parsing especially useful for:

- predicate-argument structure;
- information extraction;
- relation analysis.

OpenIE classical methods-এর একটি হিসেবে dependency structure ব্যবহার করে।

---

## POS tagging → NER

NER POS tagging-এর মতো, কারণ দুটিই token-level sequence labelling tasks।

Difference:

- POS tagging grammatical categories assign করে।
- NER entity-boundary এবং entity-type labels assign করে।

---

## BIO tagging → CRFs

BIO tagging adjacent labels-এর মধ্যে dependencies তৈরি করে।

Example:

$$
\text{O I-ORG}
$$

সাধারণত plausible transition নয়, যদি আগে:

$$
\text{B-ORG}
$$

না থাকে।

CRFs পুরো label sequence score করে এই dependencies model করে।

---

## NER → evaluation

NER entity level-এ evaluate করতে হয়, শুধু token level-এ নয়।

This connects to:

- TP / FP / FN counting;
- precision;
- recall;
- F1;
- micro, macro, and weighted averages.

---

## Annotation → evaluation reliability

Gold labels useful only if annotation reliable।

This connects:

- annotation guidelines;
- multiple annotators;
- inter-annotator agreement;
- observed agreement;
- expected agreement;
- Cohen’s Kappa.

---

## Accuracy → class imbalance

Accuracy minority classes-এ poor performance hide করতে পারে।

This matters for NLP tasks such as:

- hate vs neutral classification;
- entity recognition যেখানে কিছু entity type rare;
- যেকোনো positive-class-focused detection task.

এই cases-এ precision, recall, and F1 raw accuracy-এর তুলনায় more informative।

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

প্রতিটি class-এর জন্য metric compute করা হয়, তারপর classes-এর উপর equally average করা হয়।

For metric $M$:

$$
M_{\text{macro}} = \frac{1}{C}\sum_{i=1}^{C}M_i
$$

---

## Weighted average

Class frequency weights ব্যবহার করে class-level metrics average করা হয়।

$$
M_{\text{weighted}} =
\sum_{i=1}^{C}
w_i M_i
$$

where $w_i$ class $i$-এর true instances সংখ্যার উপর based।

---

# High-value revision checklist

- POS tagging কেন disambiguation task তা explain করতে পারা।
- কোনো sentence দেওয়া হলে ambiguous words-এর possible POS taggings identify করতে পারা।
- Penn Treebank tags এবং Universal POS tags distinguish করতে পারা।
- Dependency parsing, head, dependent, এবং root define করতে পারা।
- Dependency parse পড়ে root, subject, object, এবং modifiers identify করতে পারা।
- Attachment ambiguity কী এবং এটি sentence meaning কীভাবে affect করে তা explain করতে পারা।
- POS categories, constituents, phrasal nodes, এবং full tree structure ব্যবহার করে phrase structure tree build করতে পারা।
- NER define করা এবং entity types কেন domain-dependent তা explain করতে পারা।
- BIO tags এবং entity mentions-এর মধ্যে convert করতে পারা।
- $2N+1$ ব্যবহার করে BIO classes সংখ্যা calculate করতে পারা।
- Local এবং global sequence models distinguish করতে পারা।
- BIO tagging-এর জন্য CRFs কেন useful তা explain করতে পারা।
- CRF sequence probability formula state করতে পারা।
- Classical NER feature types list করতে পারা।
- Exact-match entity-level NER evaluation explain করতে পারা।
- Observed agreement, expected agreement, এবং Cohen’s Kappa compute করতে পারা।
- Confusion matrix construct ও interpret করতে পারা।
- Precision, recall, F1, এবং accuracy compute করতে পারা।
- Imbalanced data-তে accuracy কেন misleading হতে পারে তা explain করতে পারা।
- Micro-averaged এবং macro-averaged metrics compute করতে পারা।
- Partial NER spans কেন true positive count হয় না তা explain করতে পারা।
- OpenIE summarise করতে পারা এবং এই module-এ এটি কেন lower assessment priority তা explain করতে পারা।
