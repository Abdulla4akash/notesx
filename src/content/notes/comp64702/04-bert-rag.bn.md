---
subject: COMP64702
chapter: 4
title: "BERT & RAG"
language: bn
---

# কাঠামোবদ্ধ স্টাডি নোট: BERT এবং Retrieval-Augmented Generation

## বিষয় ও পরিসর

**লেকচার সেট:** আধুনিক NLP / LLM সিস্টেমে BERT এবং Retrieval-Augmented Generation।

**পরিসর:** BERT লেকচারে bidirectional Transformer encoder-এর pre-training এবং fine-tuning আলোচনা করা হয়েছে। RAG লেকচারে দেখানো হয়েছে কীভাবে LLM-কে external retrieval দিয়ে augment করা যায়, RAG pipeline কীভাবে তৈরি হয়, এবং RAG system কীভাবে evaluate করা হয়।

**ব্যবহৃত উৎস:**

- `Week4_TRIM_BERT.pdf` — BERT: Bidirectional Encoder Representations from Transformers.
- `LLM-RAG-Final-1(1).pdf` — Retrieval-Augmented Generation (RAG).

**গুরুত্বপূর্ণ উৎস-সংক্রান্ত নোট:** এই চ্যাটে কোনো lecture transcript upload করা হয়নি। তাই এই নোটগুলো uploaded slide deck-এর ওপর ভিত্তি করে তৈরি। Transcript-নির্ভর বিষয় — যেমন lecturer-এর spoken exam hints, emphasis, timing, বা slide-এ না থাকা verbal worked example — **[UNCLEAR: transcript missing / ট্রান্সক্রিপ্ট অনুপস্থিত]** হিসেবে চিহ্নিত করা হয়েছে।

---

## Course / lecture metadata

**Course:** [UNCLEAR: prompt বা slides-এ উল্লেখ নেই]

**Institution / department:** Department of Computer Science, The University of Manchester.

**Slides-এ দেখানো lecturer:** Chenghua Lin.

**Uploaded slides-এ covered lecture topics:**

1. BERT: Bidirectional Encoder Representations from Transformers.
2. Retrieval-Augmented Generation, RAG.

---

# Part I — BERT: Bidirectional Encoder Representations from Transformers

## 1. Transformer model families

BERT লেকচারটি BERT-কে broader Transformer architecture family-র মধ্যে বসিয়ে শুরু করে।

### 1.1 Encoder-only Transformers

**ব্যবহার:**

- Natural language understanding, NLU.
- Classification.
- Feature extraction.

**উদাহরণ:**

- BERT.
- RoBERTa.
- DeBERTa.

**মূল পয়েন্ট:** BERT একটি **encoder-only** Transformer model। এটি মূলত understanding এবং representation task-এর সঙ্গে যুক্ত; open-ended autoregressive generation-এর সঙ্গে নয়।

---

### 1.2 Encoder-decoder Transformers

**ব্যবহার:**

- Natural language generation, NLG.
- Translation.
- Summarisation.
- Sequence-to-sequence mapping.

**উদাহরণ:**

- T5.
- Flan-T5.
- BART.

**মূল পয়েন্ট:** Encoder-decoder model তখন ব্যবহৃত হয় যখন একটি input sequence encode করা হয় এবং আলাদা decoder একটি output sequence generate করে।

---

### 1.3 Decoder-only Transformers

**ব্যবহার:**

- Natural language generation.
- Translation.
- Summarisation.
- Completion.

**উদাহরণ:**

- GPT-x.
- LLaMA.
- “Every other new model today” — slide-এর wording।

**Connection:** এটি বোঝায় কেন BERT, GPT-style model থেকে আলাদা: BERT bidirectional encoder ব্যবহার করে, আর GPT-style model সাধারণত decoder-only।

---

## 2. BERT-এর আগের কাজ: ELMo

### 2.1 ELMo overview

**ELMo**-কে BERT-এর predecessor হিসেবে উপস্থাপন করা হয়েছে।

Slides অনুযায়ী ELMo হলো:

- Peters et al., 2018.
- NAACL 2018 best paper.
- LSTM-ভিত্তিক।
- Feature-based approach.

---

### 2.2 ELMo কীভাবে কাজ করে

ELMo **দুটি আলাদা unidirectional language model** train করে:

1. একটি left-to-right language model.
2. একটি right-to-left language model.

এগুলো একটি fully bidirectional model হিসেবে একসঙ্গে train করা হয় না; বরং আলাদাভাবে train করা হয়।

---

### 2.3 Feature-based approach হিসেবে ELMo

Slides বলছে ELMo একটি **feature-based approach** ব্যবহার করে:

- Pre-trained representation-গুলো task-specific model-এর input হিসেবে ব্যবহৃত হয়।
- Pre-trained model embeddings / features দেয়।
- এরপর আলাদা downstream architecture সেই features consume করে।

---

### 2.4 ELMo training data

ELMo **1B Word Benchmark** থেকে single sentence-এর ওপর train করা হয়েছিল।

---

### 2.5 BERT-এর সঙ্গে connection

BERT এই দিকটিকে improve করে, কারণ BERT দুটি আলাদা unidirectional LSTM train করার বদলে deep Transformer encoder-এর মধ্যে **bidirectional context** ব্যবহার করে representation শেখে।

---

## 3. BERT key contributions

### 3.1 BERT-এর সংজ্ঞা

**BERT** এর পূর্ণরূপ **Bidirectional Encoder Representations from Transformers**।

**ধারণাগত সংজ্ঞা:** BERT একটি Transformer encoder model, যা প্রতিটি token-এর আশেপাশের left context এবং right context—দুই দিক দেখে contextual word representation শেখে।

**Slides-ভিত্তিক formal definition:** BERT হলো একটি **deep Transformer encoder model**, যা large corpora-তে pre-trained; এর মূল ধারণা হলো **bidirectional context**-এর ভিত্তিতে representation শেখা।

---

### 3.2 Bidirectional context কেন গুরুত্বপূর্ণ

Slide-এ স্পষ্টভাবে বলা হয়েছে:

> Both left and right contexts are important to understand the meaning of words.

ব্যবহৃত উদাহরণ হলো **bank** শব্দটি:

- Example 1: “we went to the river **bank**.”
- Example 2: “I need to go to **bank** to make a deposit.”

**bank** শব্দটির meaning surrounding context-এর ওপর নির্ভর করে বদলে যায়। প্রথম বাক্যে river bank, দ্বিতীয় বাক্যে financial bank।

**ধারণা:** Unidirectional model context-এর কেবল একদিক দেখতে পারে। BERT-এর bidirectional self-attention model-কে দুদিকের information ব্যবহার করতে দেয়, ফলে শব্দের meaning resolve করা সহজ হয়।

---

### 3.3 BERT pre-training objectives

Slides-এ দুটি pre-training objective চিহ্নিত করা হয়েছে:

1. **Masked Language Modelling, MLM.**
2. **Next Sentence Prediction, NSP.**

BERT pre-training-এর সময় এই দুটি objective একসঙ্গে train করা হয়।

---

### 3.4 BERT performance claim

Slides অনুযায়ী BERT 2018 সালে বড় একটি set of tasks-এ **state-of-the-art performance** অর্জন করেছিল:

- Sentence-level tasks.
- Token-level tasks.

---

# 4. Masked Language Modelling, MLM

## 4.1 MLM-এর সংজ্ঞা

**ধারণা:** Masked Language Modelling BERT-কে surrounding bidirectional context দেখে missing বা corrupted token predict করতে train করে।

**Slides-ভিত্তিক formal definition:** সব input token bidirectional self-attention-এ অংশ নেয়, কিন্তু prediction-এর জন্য sampled **15% tokens**-ই training loss-এ contribute করে। Loss হলো selected position-গুলোর ওপর **average cross-entropy loss**।

---

## 4.2 MLM training setup

Model input sequence-এর corrupted version পায়। কিছু token prediction-এর জন্য select করা হয়। Transformer encoder পুরো sequence bidirectionally process করে।

শুধু selected positions loss-এ contribute করে।

MLM slide diagram-এ দেখানো হয়েছে:

- Input tokens plus positional embeddings.
- একটি bidirectional Transformer encoder.
- Selected positions-এ vocabulary-এর ওপর softmax.
- Cross-entropy loss terms যেমন:

$$
-\log y_{long}, \quad -\log y_{thanks}, \quad -\log y_{the}
$$

- Sampled tokens-এর ওপর average cross-entropy ব্যবহার করে network weights update হয়।

---

## 4.3 MLM examples

### Example 1

Original sentence:

```text
He is from Kuala Lumpur, Malaysia.
```

Masked version:

```text
He [MASK] from Kuala [MASK], Malaysia.
```

Model surrounding context থেকে missing words infer করতে হবে।

---

### Example 2

Original sentence:

```text
He went to the store.
```

Masked version:

```text
He went to the [MASK].
```

Model surrounding words ব্যবহার করে missing token predict করে; সম্ভবত “store”।

---

## 4.4 MLM masking rate

Slides প্রশ্ন করে:

> What is the value of $k$?

দেওয়া answer:

$$
k = 15\%
$$

অর্থাৎ BERT prediction-এর জন্য **15% tokens** select করে।

### খুব কম masking কেন নয়?

Slide বলে:

- Too little masking is computationally expensive.

**Slide wording-এর ব্যাখ্যা:** যদি খুব কম token loss-এ contribute করে, তাহলে training অনেক token process করে কিন্তু তুলনামূলকভাবে অল্প prediction target পায়।

### খুব বেশি masking কেন নয়?

Slide বলে:

- Too much masking leaves not enough context.

**ধারণা:** যদি অনেক বেশি token mask করা হয়, তাহলে missing word infer করার জন্য প্রয়োজনীয় surrounding information হারিয়ে যায়।

---

## 4.5 Masked tokens কীভাবে select করা হয়

Slides অনুযায়ী:

- 15% tokens **uniformly sampled** হয়।
- Slide জিজ্ঞেস করে এটা optimal কি না, এবং **span masking, Joshi et al., 2020**-এর দিকে নির্দেশ করে।

Example:

```text
He [MASK] from Kuala [MASK], Malaysia.
```

**Connection:** এটি BERT-এর original random-token masking-কে পরবর্তী span masking approach-এর সঙ্গে connect করে, যেখানে individual token-এর বদলে spans mask করা হয়।

---

## 4.6 MLM 80-10-10 corruption strategy

Prediction-এর জন্য selected 15% tokens-এর ক্ষেত্রে slides নিম্নের corruption scheme দেয়।

### 80% case: `[MASK]` দিয়ে replace করা

```text
went to the store -> went to the [MASK]
```

### 10% case: random word দিয়ে replace করা

```text
went to the store -> went to the running
```

### 10% case: unchanged রাখা

```text
went to the store -> went to the store
```

### 80-10-10 কেন ব্যবহার করা হয়?

Slide-এর reason:

> Because `[MASK]` tokens are never seen during fine-tuning.

**ধারণা:** Pre-training-এর সময় যদি BERT শুধু `[MASK]` token দেখে, তাহলে pre-training এবং fine-tuning-এর মধ্যে mismatch তৈরি হবে, কারণ downstream tasks সাধারণত natural unmasked text ব্যবহার করে।

---

# 5. Next Sentence Prediction, NSP

## 5.1 NSP-এর motivation

Slides অনুযায়ী অনেক downstream NLP task-এ **দুটি sentence-এর relationship** বোঝা দরকার, যেমন:

- Natural language inference, NLI.
- Paraphrase detection.
- Question answering, QA.

NSP designed হয়েছে pre-training এবং fine-tuning-এর gap কমানোর জন্য।

---

## 5.2 NSP-এর সংজ্ঞা

**ধারণা:** NSP BERT-কে train করে যেন এটি decide করতে পারে একটি sentence স্বাভাবিকভাবে আরেকটি sentence-এর পরে আসে কি না।

**Formal task:** দুটি text segment দেওয়া হলে pair-টিকে classify করতে হবে:

- `IsNext`.
- `NotNext`.

---

## 5.3 NSP input format

Slide examples নিম্নের structure ব্যবহার করে:

```text
[CLS] sentence A [SEP] sentence B [SEP]
```

### Special tokens

- `[CLS]`: beginning-এ রাখা special token। পরের NSP slide বলছে এটি “class” বোঝায়।
- `[SEP]`: segment separate করার special separator token। পরের NSP slide বলছে এটি “separator” বোঝায়।

**[UNCLEAR: slide OCR / label issue]** Parsed slide text-এ বলা হয়েছে `[CLS]` “a special token used to separate two segments,” কিন্তু visual diagram-এ `[SEP]`-কে separator হিসেবে label করা হয়েছে। Diagram অনুযায়ী সঠিক reading হলো `[CLS]` class token এবং `[SEP]` separator token।

---

## 5.4 NSP positive example

Input:

```text
[CLS] the man went to [MASK] store [SEP]
he bought a gallon [MASK] milk [SEP]
```

Label:

```text
IsNext
```

এটি positive pair, কারণ দ্বিতীয় segment প্রথমটির পরে plausibly আসতে পারে।

---

## 5.5 NSP negative example

Input:

```text
[CLS] the man [MASK] to the store [SEP]
penguin [MASK] are flight ##less birds [SEP]
```

Label:

```text
NotNext
```

এটি negative pair, কারণ দুটি segment unrelated।

---

## 5.6 NSP classifier

NSP slide diagram দেখায়:

- `[CLS]`-এর সঙ্গে associated output vector sentence-pair prediction represent করে।
- এই vector $W_{NSP}$-এর সঙ্গে multiplied হয়; $W_{NSP}$ হলো classification weights-এর একটি set।
- Softmax ব্যবহার করা হয়।
- Cross-entropy loss apply করা হয়।

Simplified formal description:

$$
h_{[CLS]} = \text{BERT output vector for } [CLS]
$$

$$
\hat{y}_{NSP} = \text{softmax}(W_{NSP} h_{[CLS]})
$$

Slide formula explicitly লেখেনি, কিন্তু diagram-এ দেখা যায় `[CLS]` output vector $W_{NSP}$ দিয়ে classification-এর জন্য multiply করা হচ্ছে।

---

# 6. BERT pre-training: সবকিছু একসঙ্গে

## 6.1 Vocabulary

Slides অনুযায়ী:

$$
\text{Vocabulary size} = 30{,}000 \text{ word pieces}
$$

এগুলো common sub-word units হিসেবে বর্ণিত; citation: Wu et al., 2016.

Slide word-piece handling-এর উদাহরণ দেয়:

- Common words.
- Variations.
- Misspellings.
- Novel items.

Examples shown include:

- `hat`.
- `learn`.
- `taaaaasty`.
- `laern`.
- `Transformerify`.

---

## 6.2 Final input representation

Slides formal input representation দেয়:

$$
\text{Final input representation}
= \text{Token embeddings}
+ \text{Segment embeddings}
+ \text{Position embeddings}
$$

### Components

1. **Token embeddings** প্রতিটি token বা word piece-এর identity represent করে।
2. **Segment embeddings** sentence A এবং sentence B distinguish করে।
3. **Position embeddings** sequence-এর মধ্যে token position encode করে।

---

## 6.3 Segment embeddings

Segment embeddings দুটি input segment আলাদা করতে ব্যবহৃত হয়।

Slide diagram দেখায়:

- প্রথম sentence-এর জন্য Segment A embeddings.
- দ্বিতীয় sentence-এর জন্য Segment B embeddings.
- Segments-এর মধ্যে `[SEP]`।

Sentence-pair tasks এবং NSP-এর ক্ষেত্রে এটি বিশেষভাবে গুরুত্বপূর্ণ।

---

## 6.4 BERT-base configuration

Slides specify করে:

- 12 layers.
- Hidden size 768.
- 12 attention heads.
- 100M parameters.

Slide annotation বলছে এটি “same as OpenAI GPT.”

---

## 6.5 BERT-large configuration

Slides specify করে:

- 24 layers.
- Hidden size 1024.
- 16 attention heads.
- 340M parameters.

---

## 6.6 Training corpus

Slides অনুযায়ী BERT train হয়েছিল:

- Wikipedia: 2.5B.
- BooksCorpus: 0.8B.

Slide আরও note করে:

- OpenAI GPT শুধু BooksCorpus-এ train হয়েছিল।

---

## 6.7 Maximum sequence length

Slides অনুযায়ী:

$$
\text{Max sequence size} = 512 \text{ word pieces}
$$

---

## 6.8 Training duration and batch size

Slides অনুযায়ী:

- 1M steps train করা হয়েছে।
- Batch size 128k.

---

## 6.9 MLM এবং NSP joint training

Slides explicitly বলে:

- MLM এবং NSP একসঙ্গে train হয়।
- `[CLS]` representation NSP-এর জন্য train হয়।
- Token-level representations MLM-এর মাধ্যমে train হয়।

---

# 7. BERT fine-tuning

Slides-এ recurring phrase:

> Pretrain once, finetune many times.

এটি BERT workflow-এর central idea capture করে:

1. Large corpora-তে MLM এবং NSP ব্যবহার করে BERT pre-train করা।
2. একই pre-trained model বহু downstream task-এর জন্য fine-tune করা।

---

## 7.1 Sentence-level tasks

Sentence-level task-এ classification হতে পারে:

- একটি pair of sentences-এর ওপর।
- একটি single sentence-এর ওপর।

---

### 7.1.1 Sentence-pair classification: MNLI

Slide-এর example:

**Premise:**

```text
A soccer game with multiple males playing.
```

**Hypothesis:**

```text
Some men are playing a sport.
```

Possible labels:

```text
{entailment, contradiction, neutral}
```

এটি NLI-style task।

---

### 7.1.2 Sentence-pair classification: QQP

Slide-এর example:

**Q1:**

```text
Where can I learn to invest in stocks?
```

**Q2:**

```text
How can I learn more about stocks?
```

Possible labels:

```text
{duplicate, not duplicate}
```

এটি paraphrase / duplicate-question task।

---

### 7.1.3 Single-sentence classification: SST-2

Slide-এর example:

```text
rich veins of funny stuff in this movie
```

Possible labels:

```text
{positive, negative}
```

এটি sentiment classification task।

---

### 7.1.4 GLUE benchmark connection

Slide Wang et al., 2018 উল্লেখ করে এবং বলে:

- 6 sentence-pair tasks.
- 2 single-sentence tasks.

এটি BERT fine-tuning-কে GLUE benchmark-এর সঙ্গে connect করে।

---

## 7.2 Sentence-level task-এর জন্য BERT fine-tuning

Sentence-pair task-এর জন্য:

- `[SEP]` ব্যবহার করা হয়।
- Segment embeddings ব্যবহার করে দুটি input distinguish করা হয়।

Classification-এর জন্য:

- `[CLS]` representation-এর ওপরে task-specific linear classifier add করা হয়।

### Diagram-implied formal structure

ধরা যাক:

$$
h_{[CLS]}
$$

হলো `[CLS]` token-এর final hidden representation।

Task-specific classifier predict করে:

$$
\hat{y} = \text{softmax}(W h_{[CLS]} + b)
$$

Slide এই equation explicitly লেখেনি, কিন্তু বলে task-specific linear classifier `[CLS]` representation-এর ওপর বসানো হয়।

---

## 7.3 Token-level tasks

Slides দুটি token-level task example দেয়:

1. Extractive question answering.
2. Named entity recognition.

---

### 7.3.1 Extractive question answering: SQuAD

Slide extractive QA-এর example হিসেবে SQuAD দেয়।

Example question:

```text
The New York Giants and the New York Jets play at which stadium in NYC?
```

Context-এ teams-এর home games **MetLife Stadium**-এ খেলার কথা আছে।

Answer:

```text
MetLife Stadium
```

**মূল পয়েন্ট:** Extractive QA-তে model passage-এর মধ্যে answer span predict করে।

---

### 7.3.2 Named entity recognition: CoNLL 2003 NER

Slide sentence দেয়:

```text
John Smith lives in New York
```

Labels:

```text
John   -> B-PER
Smith  -> I-PER
lives  -> O
in     -> O
New    -> B-LOC
York   -> I-LOC
```

এটি BIO-style label ব্যবহার করে token-level tagging দেখায়।

---

## 7.4 Token-level task-এর জন্য BERT fine-tuning

Token-level prediction task-এর জন্য:

- প্রতিটি token-এর hidden representation-এর ওপর task-specific linear classifier add করা হয়।

### Diagram-implied formal structure

ধরা যাক:

$$
h_i
$$

হলো token $i$-এর final hidden representation।

Token classification-এর জন্য:

$$
\hat{y}_i = \text{softmax}(W h_i + b)
$$

Slide formula explicitly লেখেনি, কিন্তু slide statement থেকে বোঝা যায় প্রতিটি token hidden representation-এর ওপর linear classifier বসে।

---

# 8. BERT ablation study: model sizes

**“Ablation study: Model Sizes”** slide claim করে:

> The bigger, the better!

Table-এ vary করা হয়েছে:

- Number of layers, $\#L$.
- Hidden size, $\#H$.
- Number of attention heads, $\#A$.

Table language model perplexity এবং MNLI-m, MRPC, SST-2 dev set accuracy report করে।

| $\#L$ | $\#H$ | $\#A$ | LM ppl | MNLI-m | MRPC | SST-2 |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 768 | 12 | 5.84 | 77.9 | 79.8 | 88.4 |
| 6 | 768 | 3 | 5.24 | 80.6 | 82.2 | 90.7 |
| 6 | 768 | 12 | 4.68 | 81.9 | 84.8 | 91.3 |
| 12 | 768 | 12 | 3.99 | 84.4 | 86.7 | 92.9 |
| 12 | 1024 | 16 | 3.54 | 85.7 | 86.9 | 93.3 |
| 24 | 1024 | 16 | 3.23 | 86.6 | 87.8 | 93.7 |

**Slide takeaway:** এই table-এ model size বাড়ালে reported results improve করে।

---

# 9. “Large” language model কত বড়?

Slide charts দেখায়, যেখানে compare করা হয়েছে:

- Parameter counts.
- Corpus sizes.

Models shown include:

- ELMo variants.
- BERT-base.
- BERT-large.
- BERT multilingual.
- GPT.
- GPT-2 variants.
- GPT-3 variants.

Slide আরও recent models note করে:

- PaLM: 540B.
- OPT: 175B.
- BLOOM: 176B.

**[UNCLEAR: chart details / চার্টের বিস্তারিত]** Slide image-এ chart visually ছোট, তাই written examples-এর বাইরে প্রতিটি bar-এর exact value reliably extract করা যায়নি।

---

# 10. BERT summary

BERT lecture summary অনুযায়ী:

- BERT একটি deep bidirectional Transformer encoder, যা masked language modelling ব্যবহার করে pre-trained।
- Bidirectional self-attention প্রতিটি token-কে তার left এবং right context—দুই দিকেই attend করতে দেয়।
- BERT NLP-তে large-scale pretrain-then-fine-tune paradigm popularise করেছে।
- BERT 2018 সালে diverse NLU tasks-এ state-of-the-art performance অর্জন করেছিল।

---

# Part II — Retrieval-Augmented Generation, RAG

# 1. LLM-এর সীমাবদ্ধতা

RAG lecture standard LLM-এর limitations দিয়ে RAG-এর motivation শুরু করে।

## 1.1 LLM training objective

Slides অনুযায়ী LLM সাধারণত **next-token prediction** দিয়ে train হয়।

এগুলো huge amount of text থেকে statistical patterns শেখে।

তাদের knowledge model parameters-এর মধ্যে **implicitly** stored থাকে।

---

## 1.2 Slides-এ listed limitations

### Hallucinations

LLM fluent কিন্তু unsupported বা incorrect output generate করতে পারে।

### Knowledge cutoff

LLM training-এর সময় দেখা information পর্যন্ত সীমাবদ্ধ থাকে।

### Private বা up-to-date corpora-তে access নেই

Trained model নিজে থেকে proprietary, private, বা newly updated data access করতে পারে না।

**Connection to RAG:** RAG inference time-এ relevant external information retrieve করে এই সমস্যাগুলো address করার উপায় হিসেবে introduce করা হয়েছে।

---

# 2. RAG কী?

## 2.1 RAG-এর সংজ্ঞা

**RAG** এর পূর্ণরূপ **Retrieval-Augmented Generation**।

**Slide definition:** RAG একটি system architecture যা:

1. Background corpus থেকে relevant passages retrieve করে।
2. Retrieved passages context হিসেবে LLM input-এ augment করে।
3. Retrieved evidence-এ grounded answer generate করে।

---

## 2.2 ধারণাগত সংজ্ঞা

RAG একটি search / retrieval system-কে language model-এর সঙ্গে combine করে।

Retriever information খুঁজে বের করে।

Generator সেই information ব্যবহার করে answer দেয়।

Slide এটিকে summarise করেছে:

$$
\text{RAG} = \text{Information Retrieval} + \text{Language Model Generation}
$$

---

## 2.3 Key points

Slides emphasise করে:

- RAG model weights **update করে না**।
- RAG **input context** augment করে, model parameters নয়।
- Retrieval এবং generation আলাদা components, কিন্তু inference time-এ integrated।

**High-value point:** RAG model prompt-এ কী দেখে তা বদলায়। Model নিজেকে বদলায় না।

---

# 3. কেন RAG?

Slides তিনটি main motivation দেয়।

## 3.1 Explainability

LLM output internal parametric knowledge-এর ওপর solely rely না করে retrieved evidence-এর ওপর conditioned হয়।

**ধারণা:** Answer যদি retrieved passages-এর ওপর ভিত্তি করে হয়, system answer-এর evidence show বা cite করতে পারে।

---

## 3.2 Privacy

RAG proprietary data-কে training data-তে incorporate না করে **external knowledge** হিসেবে ব্যবহার করতে দেয়।

**ধারণা:** Private documents দিয়ে model train করার বদলে documents external corpus-এ থাকতে পারে এবং দরকার হলে retrieve করা যায়।

---

## 3.3 Memorisation এবং reasoning-এর decomposition

Slides বলে:

- Retriever knowledge access handle করে।
- LLM reasoning এবং generation-এ focus করে।
- Domain-specific setting-এ small LLM + retriever একটি larger standalone LLM-কে outperform করতে পারে।

**Connection:** এটি **parametric memory** এবং **external / non-parametric memory**-র broader distinction-এর সঙ্গে RAG-কে connect করে।

---

# 4. RAG architecture

Architecture slide RAG system-কে তিন ভাগে ভাগ করেছে।

## 4.1 Ingestion

Pipeline:

$$
\text{Corpus} \rightarrow \text{Chunk} \rightarrow \text{Embed} \rightarrow \text{Store in vector index}
$$

এটি inference-এর আগে ঘটে।

---

## 4.2 Inference

Pipeline:

$$
\text{Query} \rightarrow \text{Embed} \rightarrow \text{Retrieve} \rightarrow \text{Prompting} \rightarrow \text{Generate}
$$

User question করলে এটি ঘটে।

---

## 4.3 Evaluation

Slides দুটি evaluation level list করে:

1. Retrieval quality, e.g. Recall@k.
2. End-to-end answer quality, e.g. BERTScore.

---

# 5. Ingestion pipeline: chunking

## 5.1 Chunking কেন দরকার

Slides দুটি কারণ দেয়:

1. LLM-এর context length limit আছে।
2. Chunk coherent semantic units preserve করলে retrieval ভালো perform করে।

**ধারণা:** একটি document সাধারণত পুরোটা retrieve করে prompt-এ বসানোর জন্য অনেক বড়। তাই এটিকে এমন chunks-এ split করতে হয়, যেগুলো retrieve এবং use করার মতো small enough।

---

## 5.2 Common chunking strategies

Slides list করে:

1. Fixed-length token windows.
2. Overlapping windows.
3. Sentence-based chunking.
4. Structure-aware chunking.

---

## 5.3 Fixed-length token windows

### Definition

Fixed-length chunking token count অনুযায়ী text split করে।

Slides-এর example chunk size:

$$
200\text{--}500 \text{ tokens per chunk}
$$

### Worked example: miso soup

Original text:

```text
Miso soup is a traditional Japanese soup. It is made from dashi stock and miso paste. Common additions include tofu and wakame. Dashi is typically made from kombu and katsuobushi.
```

Fixed-length windows এভাবে split হতে পারে:

**Chunk 1:**

```text
Miso soup is a traditional Japanese soup. It is made from dashi stock
```

**Chunk 2:**

```text
and miso paste. Common additions include tofu and wakame.
```

### Problem

Fixed-length windows sentence boundaries ignore করতে পারে।

Slide বলে:

$$
\text{May break sentences} \rightarrow \text{fragment meaning}
$$

---

## 5.4 Overlapping windows

### Definition

Overlapping windows fixed-size chunks ব্যবহার করে, কিন্তু partial overlap রাখে।

Slide-এর example:

$$
300 \text{ tokens with } 50\text{-token overlap}
$$

General chunking-strategy slide-এ 10–20% overlap-ও উল্লেখ আছে।

### Worked example: miso soup

**Chunk 1:**

```text
It is made from dashi stock and miso paste.
```

**Chunk 2:**

```text
from dashi stock and miso paste. Common additions include tofu
```

### Benefit

Slides বলছে:

- Boundary loss কমায়।
- Boundary-এর কাছে থাকা important facts miss হওয়ার সম্ভাবনা কম।

---

## 5.5 Sentence-based chunking

### Definition

Sentence-based chunking sentence boundary-তে text split করে এবং তারপর sentence-গুলোকে size-controlled chunks-এ merge করে।

### Worked example: miso soup

**Chunk 1:**

```text
Miso soup is a traditional Japanese soup.
```

**Chunk 2:**

```text
It is made from dashi stock and miso paste.
```

Slide note করে যে একটি chunk-এ multiple sentences থাকতে পারে।

### Benefits

- Semantic units preserve করে।
- Retrieved context-এর readability improve করে।

---

## 5.6 Structure-aware chunking

Slides structure-aware chunking-কে split করার strategy হিসেবে list করে:

- Headings.
- Sections.

**Slide wording থেকে ধারণা:** Document structure natural semantic boundaries দিতে পারে।

---

## 5.7 Chunking trade-offs

### Larger chunks

Benefits:

- প্রতি retrieval hit-এ বেশি context দেয়।

Costs:

- Retrieval precision কম হতে পারে, কারণ irrelevant text বেশি include হতে পারে।
- Overall chunks কম হয়।
- Granularity coarser হয়।

### Smaller chunks

Benefits:

- Retrieval precision বেশি হতে পারে।
- Matching-এর জন্য finer granularity দেয়।

Costs:

- Needed context হারানোর risk থাকে।
- Slide একে **semantic fragmentation** বলে।

### Evaluation impact

Slide অনুযায়ী chunking affect করে:

- Retrieval metrics, including Recall@k এবং MRR.
- Generated answer quality.

---

# 6. RAG-এ embeddings

## 6.1 Embeddings-এর সংজ্ঞা

Slides embeddings সংজ্ঞায়িত করে:

> Dense vectors representing semantic meaning.

---

## 6.2 Embeddings কীভাবে ব্যবহৃত হয়

RAG workflow embeddings-কে দুই phase-এ ব্যবহার করে।

### Offline phase

Corpus-এর প্রতিটি chunk embed করা হয়।

### Online phase

User query embed করা হয়।

### Retrieval phase

Top-$k$ similar chunks retrieve করা হয়; উদাহরণস্বরূপ cosine similarity ব্যবহার করে।

---

## 6.3 Example embedding models

Slides list করে:

- `all-MiniLM-L6-v2`.
- `E5-small`.
- `BGE-small`.

Slide emphasise করে:

> Embedding quality strongly impacts retrieval effectiveness.

---

# 7. Retrieval in RAG: bi-encoder dense retrieval

## 7.1 Definition

একটি **bi-encoder** query এবং documents আলাদাভাবে encode করে।

Dense retrieval-এ:

1. Offline-এ সব chunks-এর embeddings precompute করা হয়।
2. Inference time-এ user query embed করা হয়।
3. Embedding space-এ similarity compute করা হয়, যেমন cosine similarity।
4. Top-$k$ most similar chunks retrieve করা হয়।

---

## 7.2 Pros

Slides list করে:

- Efficient and scalable.
- Strong recall.

---

## 7.3 Cons

Slides list করে:

- Limited fine-grained query-document interaction.
- Semantically similar কিন্তু irrelevant chunks retrieve করতে পারে।

**ধারণা:** Query এবং chunk আলাদাভাবে encode হওয়ায়, exact query wording এবং document text-এর detailed interaction model miss করতে পারে।

---

# 8. RAG-এ re-ranking

Re-ranking dense retrieval-এর পরে দ্বিতীয় stage add করে।

## 8.1 Stage 1: bi-encoder dense retrieval

Bi-encoder:

- Query এবং documents independently encode করে।
- Vector similarity ব্যবহার করে top-$N$ candidates retrieve করে।
- High recall এবং efficient।

---

## 8.2 Stage 2: cross-encoder re-ranker

Cross-encoder:

- Query plus document jointly encode করে।
- Refined relevance score compute করে।
- Top-$N$ candidates re-rank করে।
- Final top-$k$ select করে।

---

## 8.3 Trade-off

Re-ranking:

- Precision এবং ranking quality improve করে।
- Computationally বেশি expensive।
- তাই শুধু small candidate set-এর ওপর apply করা হয়।

---

# 9. Vector stores

## 9.1 Vector store কেন দরকার

Slides অনুযায়ী vector store enables:

- Embedding vectors-এর ওপর efficient nearest-neighbour search.
- Large embedding collections-এর ওপর scalable retrieval.

---

## 9.2 Vector stores কীভাবে কাজ করে

একটি vector store:

1. Chunk embeddings একটি index-এ store করে।
2. Approximate Nearest Neighbour, ANN, search ব্যবহার করে।
3. Top-$k$ most similar chunks return করে।

Slide-এর examples:

- FAISS.
- Chroma.
- LanceDB.

Slide বলে ANN exact search trade করে significant speed gains-এর জন্য।

---

# 10. Exact nearest neighbour search

## 10.1 Setup

Given:

- $N$ chunk embeddings.
- Query embedding $q$.

---

## 10.2 Exact search algorithm

1. $q$ এবং প্রতিটি embedding-এর মধ্যে similarity compute করা।
2. True top-$k$ most similar vectors return করা।

---

## 10.3 Computational cost

Slide example দেয়:

$$
1{,}000{,}000 \text{ vectors}
\rightarrow
1{,}000{,}000 \text{ similarity computations per query}
$$

Slide অনুযায়ী এটি large-scale RAG systems-এর জন্য too slow।

---

# 11. Approximate Nearest Neighbour, ANN

## 11.1 Definition

ANN পুরো vector space search করে না।

তার বদলে এটি:

1. Search narrow করার জন্য index structure ব্যবহার করে।
2. শুধু একটি ছোট, promising region explore করে।
3. এমন vectors return করে যেগুলো nearest neighbours হওয়ার সম্ভাবনা খুব বেশি।

Slide বলছে ANN results **not guaranteed exact**।

---

## 11.2 Partition-based methods: IVF

Slides IVF-কে partition-based ANN method-এর example হিসেবে দেয়।

### Step 1: offline

1. Vector space-কে clusters-এ divide করা, যেমন $k$-means দিয়ে।
2. প্রতিটি embedding একটি cluster-এ assign করা।

### Step 2: query time

1. Query vector-এর nearest cluster বা clusters identify করা।
2. শুধু সেই clusters-এর মধ্যে search করা।
3. Similarity comparisons-এর সংখ্যা dramatically reduce করা।

Slide typical speed-up দেয়:

$$
10\times \text{ to } 100\times
$$

এছাড়াও slide বলে recall practice-এ high।

---

# 12. RAG-এ prompting

## 12.1 Definition

Slides prompting-কে describe করে:

> The bridge between retrieval and generation.

Prompt determine করে retrieved evidence model output-কে কীভাবে influence করবে।

---

## 12.2 Standard RAG prompt structure

Slides চারটি component list করে:

1. **Instruction** — behaviour এবং constraints define করে, যেমন system role।
2. **Context** — retrieved passages, সম্ভবত metadata এবং chunk IDs সহ।
3. **Question** — user task।
4. **Answer** — model output।

---

## 12.3 Standard prompt example

Slide plain-text prompt structure দেয়:

```text
System:
You are a helpful assistant. Use ONLY the provided context.

Context:
[Chunk 1]
[Chunk 2]
...

User Question:
{question}

Answer:
```

Slide বলে attribution enable করার জন্য chunk IDs বা sources include করতে হবে।

---

## 12.4 Strong grounding prompt

Slide এই prompt pattern দেয়:

```text
Use ONLY the information in the context.
If the answer is not in the context, say "Not found in provided documents."
Cite the chunk number for each claim.
```

---

## 12.5 Strong grounding কেন গুরুত্বপূর্ণ

Slides অনুযায়ী strong grounding prompts:

- Hallucination কমায়।
- Explicit attribution enable করে, অর্থাৎ claim-to-evidence mapping।
- Faithfulness checks audit এবং automate করা সহজ করে।
- Evidence-constrained generation encourage করে।

---

# 13. Context formatting

## 13.1 Context formatting কেন matter করে

Slides অনুযায়ী:

- Metadata reasoning-এ help করে।
- Chunk IDs citation enable করে।
- Clear structure long contexts-এ confusion কমায়।
- Chunks retrieval score অনুযায়ী order করা উচিত, highest first।

---

## 13.2 Practical formatting patterns

Slides recommend করে:

- Delimiters দিয়ে chunks separate করা, যেমন `---`।
- প্রতি chunk-এ source এবং chunk ID header add করা।

---

## 13.3 Format examples

### Less structured version

```text
Miso soup is a traditional Japanese soup made from dashi stock and miso paste.
Dashi is typically made from kombu and katsuobushi.
Common additions include tofu and wakame.
```

### More structured version

```text
[Chunk 1 | Source: FoodGuide.pdf | Section: Japanese Cuisine | Score: 0.92]
Miso soup is a traditional Japanese soup made from dashi stock and miso paste.

---

[Chunk 2 | Source: IngredientsGuide.pdf | Page: 14 | Score: 0.88]
Dashi is typically made from kombu and katsuobushi.

---

[Chunk 3 | Source: FoodGuide.pdf | Section: Additions | Score: 0.81]
Common additions include tofu and wakame.
```

**মূল পয়েন্ট:** Structured version model-কে clearer evidence boundaries দেয় এবং citation সহজ করে।

---

# 14. RAG-এ LLM generation

## 14.1 LLM generation

Slides অনুযায়ী:

- LLM token by token text generate করে।
- Generation prompt-এর ওপর conditioned।

---

## 14.2 RAG conditional distribution

Slide RAG generation distribution দেয়:

$$
P(\text{answer} \mid \text{question}, \text{retrieved context})
$$

---

## 14.3 RAG কী বদলায়

Slides অনুযায়ী:

- RAG input distribution modify করে।
- RAG model weights **modify করে না**।
- RAG probability mass grounded tokens-এর দিকে shift করে।

**High-value point:** RAG trained parameters বদলায় না; prompt / context বদলে generation affect করে।

---

# 15. RAG evaluation

Slides অনুযায়ী RAG system দুই level-এ evaluate করা যায়:

1. Retrieval quality.
2. End-to-end QA quality.

Slide একটি গুরুত্বপূর্ণ dependency দেয়:

> If relevant evidence is not retrieved, the generator cannot produce a correct grounded answer.

এটি RAG-এর অন্যতম গুরুত্বপূর্ণ takeaway।

---

# 16. Retrieval evaluation metrics

## 16.1 Recall@k

### Definition

Recall@k হলো সেই proportion of queries, যেখানে top-$k$ results-এর মধ্যে অন্তত একটি relevant chunk থাকে।

### Formula

$$
\text{Recall@}k
=
\frac{
\#\text{queries with } \geq 1 \text{ relevant chunk in top-}k
}{
\#\text{queries}
}
$$

### What it measures

Recall@k relevant evidence-এর coverage measure করে।

### What it ignores

Recall@k top-$k$-এর মধ্যে ranking order ignore করে।

### Interpretation

Slide Recall@k-কে summarise করে:

$$
\text{Recall@}k \rightarrow \text{Did we retrieve relevant evidence?}
$$

---

## 16.2 Mean Reciprocal Rank, MRR

### Definition

MRR measure করে first relevant chunk কত early appear করে।

### Formula

একটি single query-এর জন্য:

$$
RR =
\frac{1}{
\text{rank of first relevant chunk}
}
$$

Queries জুড়ে:

$$
MRR = \text{average RR over all queries}
$$

### Interpretation

MRR:

- Relevant evidence আগে appear করলে higher হয়।
- Ranking quality-র প্রতি sensitive।

---

## 16.3 Normalized Discounted Cumulative Gain, nDCG

### Definition

nDCG ব্যবহার করা হয় যখন relevance graded, শুধু relevant / not relevant নয়।

### DCG formula

$$
DCG =
\sum_{i=1}^{k}
\frac{rel_i}{\log_2(i+1)}
$$

Where:

- $k$ হলো considered retrieved results-এর সংখ্যা, যেমন top-10।
- $i$ হলো rank position, যেখানে 1 highest।
- $rel_i$ হলো rank $i$-তে document-এর relevance score।

### nDCG formula

$$
nDCG =
\frac{DCG}{\text{ideal DCG}}
$$

### Ideal DCG

Ideal DCG হলো best possible ranking-এর DCG score।

### Range

nDCG score normalise করে:

$$
[0, 1]
$$

### Interpretation

High nDCG মানে relevant documents top-এর কাছে ranked।

Low nDCG মানে relevant documents নিচে ranked বা poorly ordered।

---

## 16.4 Retrieval metric comparison

Slide following comparison দেয়:

$$
\text{Recall@}k
\rightarrow
\text{Did we retrieve relevant evidence?}
$$

$$
MRR
\rightarrow
\text{How early does relevant evidence appear?}
$$

$$
nDCG
\rightarrow
\text{How well are all relevant results ranked?}
$$

---

# 17. End-to-end QA quality

## 17.1 Definition

End-to-end answer quality generated answer এবং gold answer compare করে।

Slide এটি generated answer $\hat{y}$ versus gold answer $y$ হিসেবে লেখে।

**[UNCLEAR: OCR issue / OCR সমস্যা]** Parsed slide text generated answer-কে `y%` হিসেবে render করেছে, কিন্তু intended notation সম্ভবত $\hat{y}$।

---

## 17.2 Common metrics

Slides list করে:

- Exact Match, EM.
- Token-level F1.
- BERTScore.
- “What else?”

Slide warning দেয়:

> High overlap does not guarantee factual grounding.

---

# 18. BLEU / ROUGE এবং evaluation কেন কঠিন

## 18.1 “Old reliables”: BLEU / ROUGE score

Slides overlap-based example ব্যবহার করে।

### Reference

```text
I am giving a talk at a data science conference
```

### Hypothesis 1

```text
I am giving a talk at a conference about data science
```

Slide বলছে এতে lots of overlap আছে, তাই high score পায়।

### Hypothesis 2

```text
This talk is about recent advances in medical imaging
```

Slide বলছে এতে little overlap আছে, তাই low score পায়।

---

## 18.2 Evaluation কেন hard

Slides এরপর দেখায় lexical overlap misleading হতে পারে।

### Reference

```text
I am giving a talk at a data science conference
```

### Bad output with high overlap

```text
I am giving a talk at a political science conference
```

Slide বলছে:

- Lots of overlap.
- But bad output.

### Good output with low overlap

```text
My lecture will be given to the meeting on data analytics
```

Slide বলছে:

- Little overlap.
- But good output.

Slide note করে যে open-ended problems-এর জন্য এটি particularly difficult।

---

# 19. Exact Match, Token-Level F1, and BERTScore

## 19.1 Exact Match, EM

### Definition

Exact Match হলো strict string-level equality।

### Properties

Slides অনুযায়ী:

- Extractive QA-তে common।
- Paraphrasing allow করে না।

---

## 19.2 Token-Level F1

### Definition

Token-Level F1 generated answer এবং gold answer-এর token overlap-এর ওপর based।

### Properties

Slides অনুযায়ী:

- Exact Match-এর চেয়ে বেশি forgiving।
- Word order ignore করে।
- Lexical differences-এর প্রতি sensitive।

### Formula

$$
F1 =
\frac{2PR}{P + R}
$$

Where:

- $P$ হলো precision।
- $R$ হলো recall।

---

## 19.3 Worked example: Token-Level F1

### Gold answer

```text
Paris is the capital of France
```

### Generated answer

```text
Paris is capital of France
```

### Common tokens

Common tokens:

```text
Paris, is, capital, of, France
```

Common tokens-এর সংখ্যা:

$$
5
$$

### Precision

Generated answer-এ 5 tokens আছে, এবং সবগুলো gold answer-এর সঙ্গে common:

$$
P = \frac{5}{5} = 1.0
$$

### Recall

Gold answer-এ 6 tokens আছে, এবং 5টি matched:

$$
R = \frac{5}{6} \approx 0.83
$$

### F1

$$
F1 = \frac{2PR}{P+R}
$$

$$
F1 = \frac{2(1.0)(0.83)}{1.0 + 0.83}
$$

$$
F1 = \frac{1.66}{1.83} \approx 0.91
$$

---

## 19.4 BERTScore

### Definition

Slides BERTScore-কে একটি metric হিসেবে define করে, যা:

- Contextual embeddings ব্যবহার করে semantic similarity measure করে।
- Exact word overlap-এর বাইরে meaning capture করে।

### Diagram process

Slide diagram দেখায়:

1. Reference sentence এবং candidate sentence.
2. Contextual embedding.
3. Pairwise cosine similarity.
4. Maximum similarity.
5. Importance weighting.
6. Final score.

Shown example:

$$
R_{BERT} = 0.753
$$

**[UNCLEAR: small formula text / ছোট formula text]** BERTScore diagram-এর exact weighted numerator slide image-এ খুব ছোট, তাই confidently reconstruct করা যায়নি; তবে process এবং displayed final score clear।

---

# 20. Automatic vs human evaluation

## 20.1 Automatic metrics useful কিন্তু limited

Slides বলছে:

### Token-Level F1

- Overlap-heavy.
- Factuality-তে weak।

### BERTScore

- Semantic similarity measure করে।
- Still imperfect।

---

## 20.2 Human evaluation প্রায়ই দরকার

Slides চারটি criteria list করে:

1. Correctness.
2. Faithfulness, অর্থাৎ evidence দ্বারা supported হওয়া।
3. Completeness.
4. Clarity.

---

# 21. RAG vs fine-tuning

## 21.1 RAG

Slides অনুযায়ী RAG:

- External retrieval ব্যবহার করে।
- Corpus বা index update করে knowledge update করতে দেয়।
- Model weights update করে না।
- Retrieval plus generation involve করায় inference complexity প্রায়ই higher।

---

## 21.2 Fine-tuning

Slides অনুযায়ী fine-tuning:

- Model weights update করে।
- Parametric knowledge change করে।
- Expensive হতে পারে।
- Updates less frequent।
- Style, format, এবং domain adaptation-এর জন্য ভালো।
- শুধু “adding facts” করার জন্য নয়।

---

# 22. ভালো RAG system তৈরি করা

Slides একটি good RAG system-এর components তিন category-তে group করে।

## 22.1 Retrieval quality

Affected by:

- Chunking strategy.
- Embedding model.
- Query representation.

---

## 22.2 Generation quality

Affected by:

- Prompt design.
- Context formatting.

---

## 22.3 System evaluation

Requires:

- Retrieval metrics.
- End-to-end answer quality metrics.

---

# 23. RAG summary

RAG lecture summary অনুযায়ী:

- RAG retrieval-এর মাধ্যমে LLM-কে external, non-parametric memory দিয়ে augment করে।
- Pipeline: relevant chunks retrieve করা, context হিসেবে দেওয়া, তারপর answer generate করা।
- Core components: retrieval, embeddings, prompting, evaluation.
- Retrieval quality answer quality bound করে।
- Answer correctness evidence-grounded faithfulness-এর সমান নয়।

এই final distinction বিশেষভাবে গুরুত্বপূর্ণ: একটি answer correct-looking হতে পারে বা gold answer-এর সঙ্গে overlap থাকতে পারে, কিন্তু retrieved evidence-এ grounded নাও হতে পারে।

---

# Exam flags and high-value revision points

## Transcript থেকে explicit exam flags

**[UNCLEAR: transcript missing / ট্রান্সক্রিপ্ট অনুপস্থিত]** কোনো transcript দেওয়া হয়নি, তাই “this will be on the exam,” “you should know this,” “common mistake,” বা similar spoken phrases identify করা যায়নি।

---

## Slides থেকে explicit exam flags

Slides-এ visibly “exam,” “must know,” বা “common mistake”-এর মতো phrase নেই।

---

## Slide-emphasised high-value points

এগুলো transcript exam flags নয়, কিন্তু slide wording, formulas, diagrams, বা summaries-এ strongly foregrounded।

### BERT

- BERT একটি **encoder-only** Transformer model।
- BERT-এর key contribution হলো **bidirectional context** থেকে representation শেখা।
- BERT দুটি pre-training objective ব্যবহার করে: **MLM** এবং **NSP**।
- MLM $k = 15\%$ selected tokens ব্যবহার করে।
- MLM selected tokens **80-10-10 corruption strategy** ব্যবহার করে।
- শুধু selected MLM positions training loss-এ contribute করে।
- Final BERT input representation:

$$
\text{Token embeddings}
+
\text{Segment embeddings}
+
\text{Position embeddings}
$$

- `[CLS]` representation NSP এবং sentence-level classification-এর জন্য ব্যবহৃত হয়।
- Token-level representations MLM এবং token-level tasks-এর জন্য ব্যবহৃত হয়।
- Sentence-level fine-tuning `[CLS]`-এর ওপর classifier add করে।
- Token-level fine-tuning প্রতিটি token hidden representation-এর ওপর classifier add করে।
- Slides থেকে BERT-base এবং BERT-large configuration memorise করা useful হতে পারে।
- Ablation table slide takeaway support করে: **“The bigger, the better!”**

### RAG

- RAG model weights **update করে না**।
- RAG **input context** augment করে, model parameters নয়।
- RAG হলো:

$$
\text{Information Retrieval}
+
\text{Language Model Generation}
$$

- RAG architecture:

$$
\text{Corpus}
\rightarrow
\text{Chunk}
\rightarrow
\text{Embed}
\rightarrow
\text{Vector index}
$$

$$
\text{Query}
\rightarrow
\text{Embed}
\rightarrow
\text{Retrieve}
\rightarrow
\text{Prompt}
\rightarrow
\text{Generate}
$$

- Chunk size হলো retrieval precision এবং context preservation-এর trade-off।
- Embedding quality retrieval effectiveness-কে strongly affect করে।
- Bi-encoders efficient এবং scalable, কিন্তু fine-grained query-document interaction limited।
- Cross-encoder re-ranking precision improve করে, কিন্তু computationally বেশি expensive।
- ANN exact nearest-neighbour search-এর চেয়ে faster, কিন্তু guaranteed exact নয়।
- Strong grounding prompts hallucination কমায় এবং attribution enable করে।
- Retrieval quality answer quality bound করে।
- Answer correctness evidence-grounded faithfulness-এর সমান নয়।

---

# দুই লেকচারের মধ্যে connections

## 1. Transformer architecture

BERT lecture BERT-কে **encoder-only Transformer** হিসেবে situate করে, আর RAG lecture broader system architecture-এ LLM-কে generator হিসেবে ধরে।

একসঙ্গে slides Transformer-based model-এর দুটি আলাদা ব্যবহার দেখায়:

- BERT: representation learning এবং NLU.
- RAG: LLM ব্যবহার করে retrieval plus generation.

---

## 2. Embeddings এবং semantic similarity

BERT lecture Transformer encoder দিয়ে learned contextual representations-এর ওপর focus করে।

RAG lecture retrieval-এর জন্য embeddings-কে dense semantic vectors হিসেবে ব্যবহার করে।

RAG lecture BERTScore-ও introduce করে, যা semantic similarity measure করতে contextual embeddings ব্যবহার করে।

---

## 3. Pre-training / fine-tuning versus retrieval

BERT lecture emphasise করে:

$$
\text{Pretrain once, finetune many times}
$$

RAG lecture RAG-কে fine-tuning-এর সঙ্গে contrast করে:

- Fine-tuning model weights update করে।
- RAG external retrieval ব্যবহার করে এবং weights update করে না।

---

## 4. Evaluation difficulty

দুটি lecture topic-ই evaluation challenges নিয়ে আসে:

- BERT fine-tuning downstream NLU tasks evaluate করে, যেমন MNLI, QQP, SST-2, SQuAD, এবং NER।
- RAG evaluation retrieval quality এবং answer quality আলাদা করে এবং warning দেয় যে lexical overlap factual grounding guarantee করে না।

---

# Revisit করার মতো unclear sections

1. **[UNCLEAR: transcript missing / ট্রান্সক্রিপ্ট অনুপস্থিত]** কোনো transcript দেওয়া হয়নি। Spoken explanations, lecturer emphasis, timing, এবং exam hints extract করা যায়নি।

2. **[UNCLEAR: course name / কোর্সের নাম]** Prompt বা slides-এ course title stated নেই।

3. **[UNCLEAR: NSP slide OCR / label issue]** Parsed slide text ভুলভাবে suggest করে `[CLS]` segments separate করে, কিন্তু diagram দেখায় `[SEP]` separator এবং `[CLS]` class token।

4. **[UNCLEAR: generated answer notation]** RAG QA evaluation slide parsed text-এ generated answer `y%` হিসেবে render হয়েছে; intended notation সম্ভবত $\hat{y}$।

5. **[UNCLEAR: BERTScore formula detail]** BERTScore diagram process এবং final example score $R_{BERT}=0.753$ দেখায়, কিন্তু exact weighted formula text slide image-এ খুব ছোট, তাই safely reconstruct করা যায়নি।

6. **[UNCLEAR: large LM chart exact bar values]** “How large are Large LMs?” chart high level-এ readable, কিন্তু slide image থেকে প্রতিটি exact bar value extract করার মতো clear নয়।

7. **[UNCLEAR: transcript-only worked examples]** Lecture-এ spoken কিন্তু slides-এ না থাকা যেকোনো examples transcript না পাওয়া পর্যন্ত unavailable।
