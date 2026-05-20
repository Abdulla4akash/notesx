---
subject: COMP64702
chapter: 4
title: "BERT & RAG"
language: en
---

# Structured Study Notes: BERT and Retrieval-Augmented Generation

## Topic and scope

**Lecture set:** BERT and Retrieval-Augmented Generation in modern NLP / LLM systems.

**Scope:** The BERT lecture covers bidirectional Transformer encoder pre-training and fine-tuning. The RAG lecture covers how LLMs can be augmented with external retrieval, how RAG pipelines are built, and how they are evaluated.

**Sources used:**

- `Week4_TRIM_BERT.pdf` — BERT: Bidirectional Encoder Representations from Transformers.
- `LLM-RAG-Final-1(1).pdf` — Retrieval-Augmented Generation (RAG).

**Important source note:** No lecture transcript was uploaded in the chat. These notes are therefore grounded in the uploaded slide decks only. Transcript-dependent material, including spoken exam hints, lecturer emphasis, and any verbal worked examples not shown on slides, is marked **[UNCLEAR: transcript missing]**.

---

## Course / lecture metadata

**Course:** [UNCLEAR: not specified in prompt or slides]

**Institution / department:** Department of Computer Science, The University of Manchester.

**Lecturer shown on slides:** Chenghua Lin.

**Lecture topics covered in uploaded slides:**

1. BERT: Bidirectional Encoder Representations from Transformers.
2. Retrieval-Augmented Generation, RAG.

---

# Part I — BERT: Bidirectional Encoder Representations from Transformers

## 1. Transformer model families

The BERT lecture begins by placing BERT within the broader Transformer architecture family.

### 1.1 Encoder-only Transformers

**Use cases:**

- Natural language understanding, NLU.
- Classification.
- Feature extraction.

**Examples:**

- BERT.
- RoBERTa.
- DeBERTa.

**Key point:** BERT is an **encoder-only** Transformer model. It is mainly associated with understanding and representation tasks rather than open-ended autoregressive generation.

---

### 1.2 Encoder-decoder Transformers

**Use cases:**

- Natural language generation, NLG.
- Translation.
- Summarisation.
- Sequence-to-sequence mapping.

**Examples:**

- T5.
- Flan-T5.
- BART.

**Key point:** Encoder-decoder models are used when an input sequence is encoded and a separate decoder generates an output sequence.

---

### 1.3 Decoder-only Transformers

**Use cases:**

- Natural language generation.
- Translation.
- Summarisation.
- Completion.

**Examples:**

- GPT-x.
- LLaMA.
- “Every other new model today” — wording from slide.

**Connection:** This sets up why BERT is different from GPT-style models: BERT uses a bidirectional encoder, while GPT-style models are decoder-only.

---

## 2. Prior work before BERT: ELMo

### 2.1 ELMo overview

**ELMo** is presented as a predecessor to BERT.

The slides describe ELMo as:

- Peters et al., 2018.
- NAACL 2018 best paper.
- Based on LSTMs.
- A feature-based approach.

---

### 2.2 How ELMo works

ELMo trains **two separate unidirectional language models**:

1. A left-to-right language model.
2. A right-to-left language model.

These are trained separately rather than as one fully bidirectional model.

---

### 2.3 ELMo as a feature-based approach

The slides state that ELMo uses a **feature-based approach**:

- Pre-trained representations are used as input to task-specific models.
- The pre-trained model provides embeddings / features.
- A separate downstream architecture then consumes those features.

---

### 2.4 ELMo training data

ELMo was trained on single sentences from the **1B Word Benchmark**.

---

### 2.5 Connection to BERT

BERT improves on this direction by learning representations using **bidirectional context** within a deep Transformer encoder, rather than training two separate unidirectional LSTMs.

---

## 3. BERT key contributions

### 3.1 Definition of BERT

**BERT** stands for **Bidirectional Encoder Representations from Transformers**.

**Intuitive definition:** BERT is a Transformer encoder model that learns contextual word representations by looking at both the left and right context around each token.

**Formal slide definition:** BERT is a **deep Transformer encoder model pre-trained on large corpora**, with the key idea being to learn representations based on **bidirectional context**.

---

### 3.2 Why bidirectional context matters

The slide explicitly states:

> Both left and right contexts are important to understand the meaning of words.

The example used is the word **bank**:

- Example 1: “we went to the river **bank**.”
- Example 2: “I need to go to **bank** to make a deposit.”

The word **bank** has different meanings depending on surrounding context.

**Intuition:** A unidirectional model may only see one side of the context. BERT’s bidirectional self-attention allows the model to use information from both directions, which helps resolve word meaning.

---

### 3.3 BERT pre-training objectives

The slides identify two pre-training objectives:

1. **Masked Language Modelling, MLM.**
2. **Next Sentence Prediction, NSP.**

These are trained together during BERT pre-training.

---

### 3.4 BERT performance claim

The slides state that BERT achieved **state-of-the-art performance in 2018** on a large set of:

- Sentence-level tasks.
- Token-level tasks.

---

# 4. Masked Language Modelling, MLM

## 4.1 Definition of MLM

**Intuition:** Masked Language Modelling trains BERT to predict missing or corrupted tokens from their surrounding bidirectional context.

**Formal slide definition:** All input tokens participate in bidirectional self-attention, but only the **15% of tokens sampled for prediction** contribute to the training loss. The loss is the **average cross-entropy loss** over those selected positions.

---

## 4.2 MLM training setup

The model receives a corrupted version of the input sequence. Some tokens are selected for prediction. The Transformer encoder processes the entire sequence bidirectionally.

Only selected positions contribute to the loss.

The MLM slide diagram shows:

- Input tokens plus positional embeddings.
- A bidirectional Transformer encoder.
- A softmax over the vocabulary at selected positions.
- Cross-entropy loss terms such as:

$$
-\log y_{long}, \quad -\log y_{thanks}, \quad -\log y_{the}
$$

- Network weights updated using average cross-entropy over sampled tokens.

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

The model must infer the missing words from the surrounding context.

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

The model predicts the missing token, likely “store,” using the surrounding words.

---

## 4.4 MLM masking rate

The slides ask:

> What is the value of $k$?

The answer given:

$$
k = 15\%
$$

So, BERT selects **15% of tokens** for prediction.

### Why not mask too little?

The slide states:

- Too little masking is computationally expensive.

**Interpretation from slide wording:** If only a very small number of tokens contribute to the loss, training processes many tokens but gets relatively few prediction targets.

### Why not mask too much?

The slide states:

- Too much masking leaves not enough context.

**Intuition:** If too many tokens are masked, the model loses the surrounding information needed to infer the missing words.

---

## 4.5 How masked tokens are selected

The slides state:

- 15% of tokens are **uniformly sampled**.
- The slide asks whether this is optimal and points to **span masking, Joshi et al., 2020**.

Example:

```text
He [MASK] from Kuala [MASK], Malaysia.
```

**Connection:** This connects BERT’s original random-token masking to later approaches that mask spans rather than individual tokens.

---

## 4.6 MLM 80-10-10 corruption strategy

For the 15% of tokens selected for prediction, the slides specify the following corruption scheme.

### 80% case: replace with `[MASK]`

```text
went to the store -> went to the [MASK]
```

### 10% case: replace with a random word

```text
went to the store -> went to the running
```

### 10% case: keep unchanged

```text
went to the store -> went to the store
```

### Why use 80-10-10?

The slide gives the reason:

> Because `[MASK]` tokens are never seen during fine-tuning.

**Intuition:** If BERT only saw `[MASK]` tokens during pre-training, there would be a mismatch between pre-training and fine-tuning, because downstream tasks normally use natural unmasked text.

---

# 5. Next Sentence Prediction, NSP

## 5.1 Motivation for NSP

The slides state that many downstream NLP tasks require understanding the **relationship between two sentences**, including:

- Natural language inference, NLI.
- Paraphrase detection.
- Question answering, QA.

NSP is designed to reduce the gap between pre-training and fine-tuning.

---

## 5.2 Definition of NSP

**Intuition:** NSP trains BERT to decide whether one sentence naturally follows another sentence.

**Formal task:** Given two text segments, classify the pair as either:

- `IsNext`.
- `NotNext`.

---

## 5.3 NSP input format

The slide examples use the following structure:

```text
[CLS] sentence A [SEP] sentence B [SEP]
```

### Special tokens

- `[CLS]`: special token placed at the beginning. The following NSP slide says it stands for “class”.
- `[SEP]`: separator token used to separate segments. The following NSP slide says it stands for “separator”.

**[UNCLEAR: slide OCR / label issue]** The parsed slide text says `[CLS]` is “a special token used to separate two segments,” but the visual diagram labels `[SEP]` as the separator. The correct reading of the diagram is that `[CLS]` stands for class and `[SEP]` stands for separator.

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

This is a positive pair because the second segment plausibly follows the first.

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

This is a negative pair because the two segments are unrelated.

---

## 5.6 NSP classifier

The NSP slide diagram shows:

- The output vector associated with `[CLS]` represents the sentence-pair prediction.
- This vector is multiplied by $W_{NSP}$, a set of classification weights.
- A softmax is used.
- Cross-entropy loss is applied.

A simplified formal description:

$$
h_{[CLS]} = \text{BERT output vector for } [CLS]
$$

$$
\hat{y}_{NSP} = \text{softmax}(W_{NSP} h_{[CLS]})
$$

The slide does not write this formula explicitly, but the diagram shows the `[CLS]` output vector being multiplied by $W_{NSP}$ for classification.

---

# 6. BERT pre-training: putting everything together

## 6.1 Vocabulary

The slides state:

$$
\text{Vocabulary size} = 30{,}000 \text{ word pieces}
$$

These are described as common sub-word units, citing Wu et al., 2016.

The slide gives examples of word-piece handling:

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

The slides give the formal input representation:

$$
\text{Final input representation}
= \text{Token embeddings}
+ \text{Segment embeddings}
+ \text{Position embeddings}
$$

### Components

1. **Token embeddings** represent the identity of each token or word piece.
2. **Segment embeddings** distinguish between sentence A and sentence B.
3. **Position embeddings** encode token position in the sequence.

---

## 6.3 Segment embeddings

Segment embeddings are used to separate two input segments.

The slide diagram shows:

- Segment A embeddings for the first sentence.
- Segment B embeddings for the second sentence.
- `[SEP]` between segments.

This is especially important for sentence-pair tasks and NSP.

---

## 6.4 BERT-base configuration

The slides specify:

- 12 layers.
- Hidden size 768.
- 12 attention heads.
- 100M parameters.

The slide annotation says this is “same as OpenAI GPT.”

---

## 6.5 BERT-large configuration

The slides specify:

- 24 layers.
- Hidden size 1024.
- 16 attention heads.
- 340M parameters.

---

## 6.6 Training corpus

The slides state that BERT was trained on:

- Wikipedia: 2.5B.
- BooksCorpus: 0.8B.

The slide also notes:

- OpenAI GPT was trained on BooksCorpus only.

---

## 6.7 Maximum sequence length

The slides state:

$$
\text{Max sequence size} = 512 \text{ word pieces}
$$

---

## 6.8 Training duration and batch size

The slides state:

- Trained for 1M steps.
- Batch size 128k.

---

## 6.9 Joint training of MLM and NSP

The slides explicitly state:

- MLM and NSP are trained together.
- The `[CLS]` representation is trained for NSP.
- Token-level representations are trained via MLM.

---

# 7. BERT fine-tuning

The recurring phrase on the slides is:

> Pretrain once, finetune many times.

This captures the central BERT workflow:

1. Pre-train BERT on large corpora using MLM and NSP.
2. Fine-tune the same pre-trained model for many downstream tasks.

---

## 7.1 Sentence-level tasks

Sentence-level tasks include classification over either:

- A pair of sentences.
- A single sentence.

---

### 7.1.1 Sentence-pair classification: MNLI

Example from the slide:

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

This is an NLI-style task.

---

### 7.1.2 Sentence-pair classification: QQP

Example from the slide:

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

This is a paraphrase / duplicate-question task.

---

### 7.1.3 Single-sentence classification: SST-2

Example from the slide:

```text
rich veins of funny stuff in this movie
```

Possible labels:

```text
{positive, negative}
```

This is a sentiment classification task.

---

### 7.1.4 GLUE benchmark connection

The slide refers to Wang et al., 2018 and states:

- 6 sentence-pair tasks.
- 2 single-sentence tasks.

This connects BERT fine-tuning to the GLUE benchmark.

---

## 7.2 Fine-tuning BERT for sentence-level tasks

For sentence-pair tasks:

- Use `[SEP]`.
- Use segment embeddings to distinguish the two inputs.

For classification:

- Add a task-specific linear classifier on top of the `[CLS]` representation.

### Diagram-implied formal structure

Let:

$$
h_{[CLS]}
$$

be the final hidden representation of the `[CLS]` token.

A task-specific classifier predicts:

$$
\hat{y} = \text{softmax}(W h_{[CLS]} + b)
$$

The slide does not write this equation explicitly, but it states that the task-specific linear classifier is placed on top of the `[CLS]` representation.

---

## 7.3 Token-level tasks

The slides give two token-level task examples:

1. Extractive question answering.
2. Named entity recognition.

---

### 7.3.1 Extractive question answering: SQuAD

The slide gives SQuAD as an example of extractive QA.

Example question:

```text
The New York Giants and the New York Jets play at which stadium in NYC?
```

The context includes text about the teams playing home games at **MetLife Stadium**.

Answer:

```text
MetLife Stadium
```

**Key point:** For extractive QA, the model predicts the answer span in the passage.

---

### 7.3.2 Named entity recognition: CoNLL 2003 NER

The slide gives the sentence:

```text
John Smith lives in New York
```

With labels:

```text
John   -> B-PER
Smith  -> I-PER
lives  -> O
in     -> O
New    -> B-LOC
York   -> I-LOC
```

This shows token-level tagging using BIO-style labels.

---

## 7.4 Fine-tuning BERT for token-level tasks

For token-level prediction tasks:

- Add a task-specific linear classifier on top of each token’s hidden representation.

### Diagram-implied formal structure

Let:

$$
h_i
$$

be the final hidden representation for token $i$.

For token classification:

$$
\hat{y}_i = \text{softmax}(W h_i + b)
$$

The slide does not explicitly write this formula, but it follows from the slide statement that each token’s hidden representation receives a linear classifier.

---

# 8. BERT ablation study: model sizes

The slide titled **“Ablation study: Model Sizes”** presents the claim:

> The bigger, the better!

The table varies:

- Number of layers, $\#L$.
- Hidden size, $\#H$.
- Number of attention heads, $\#A$.

The table reports language model perplexity and dev set accuracy on MNLI-m, MRPC, and SST-2.

| $\#L$ | $\#H$ | $\#A$ | LM ppl | MNLI-m | MRPC | SST-2 |
|---:|---:|---:|---:|---:|---:|---:|
| 3 | 768 | 12 | 5.84 | 77.9 | 79.8 | 88.4 |
| 6 | 768 | 3 | 5.24 | 80.6 | 82.2 | 90.7 |
| 6 | 768 | 12 | 4.68 | 81.9 | 84.8 | 91.3 |
| 12 | 768 | 12 | 3.99 | 84.4 | 86.7 | 92.9 |
| 12 | 1024 | 16 | 3.54 | 85.7 | 86.9 | 93.3 |
| 24 | 1024 | 16 | 3.23 | 86.6 | 87.8 | 93.7 |

**Takeaway from the slide:** Increasing model size improves the reported results in this table.

---

# 9. How large are “large” language models?

The slide shows charts comparing:

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

The slide also notes more recent models:

- PaLM: 540B.
- OPT: 175B.
- BLOOM: 176B.

**[UNCLEAR: chart details]** The chart is visually small in the slide image, so exact values for each bar beyond the written examples are not reliably extractable from the slide image.

---

# 10. BERT summary

The BERT lecture summary states:

- BERT is a deep bidirectional Transformer encoder pre-trained using masked language modelling.
- Bidirectional self-attention allows each token to attend to both left and right context.
- BERT popularised the large-scale pretrain-then-fine-tune paradigm in NLP.
- BERT achieved state-of-the-art performance in 2018 across diverse NLU tasks.

---

# Part II — Retrieval-Augmented Generation, RAG

# 1. Limitations of LLMs

The RAG lecture begins by motivating RAG through limitations of standard LLMs.

## 1.1 LLM training objective

The slides state that LLMs are typically trained with **next-token prediction**.

They learn statistical patterns from a huge amount of text.

Their knowledge is stored **implicitly** in model parameters.

---

## 1.2 Limitations listed on the slides

### Hallucinations

LLMs can produce fluent but unsupported or incorrect outputs.

### Knowledge cutoff

LLMs are limited to information seen during training.

### No access to private or up-to-date corpora

A trained model does not automatically have access to proprietary, private, or newly updated data.

**Connection to RAG:** RAG is introduced as a way to address these problems by retrieving relevant external information at inference time.

---

# 2. What is RAG?

## 2.1 Definition of RAG

**RAG** stands for **Retrieval-Augmented Generation**.

**Slide definition:** RAG is a system architecture that:

1. Retrieves relevant passages from a background corpus.
2. Augments the LLM input with retrieved passages as context.
3. Generates an answer grounded in those retrieved evidences.

---

## 2.2 Intuitive definition

RAG combines a search / retrieval system with a language model.

The retriever finds information.

The generator uses that information to answer.

The slide summarises this as:

$$
\text{RAG} = \text{Information Retrieval} + \text{Language Model Generation}
$$

---

## 2.3 Key points

The slides emphasise:

- RAG does **not** update model weights.
- RAG augments the **input context**, not the model parameters.
- Retrieval and generation are separate components but integrated at inference time.

**High-value point:** RAG changes what the model sees in the prompt. It does not change the model itself.

---

# 3. Why RAG?

The slides give three main motivations.

## 3.1 Explainability

LLM outputs are conditioned on retrieved evidence rather than relying only on internal parametric knowledge.

**Intuition:** If an answer is based on retrieved passages, the system can expose or cite the evidence behind the answer.

---

## 3.2 Privacy

RAG allows proprietary data to be used as **external knowledge** instead of incorporating it into training data.

**Intuition:** Rather than training the model on private documents, the documents can remain in an external corpus and be retrieved when needed.

---

## 3.3 Decomposition of memorisation and reasoning

The slides state:

- The retriever handles knowledge access.
- The LLM focuses on reasoning and generation.
- A small LLM plus a retriever can outperform a larger standalone LLM in domain-specific settings.

**Connection:** This links RAG to the broader distinction between **parametric memory** and **external / non-parametric memory**.

---

# 4. RAG architecture

The architecture slide divides the RAG system into three parts.

## 4.1 Ingestion

Pipeline:

$$
\text{Corpus} \rightarrow \text{Chunk} \rightarrow \text{Embed} \rightarrow \text{Store in vector index}
$$

This happens before inference.

---

## 4.2 Inference

Pipeline:

$$
\text{Query} \rightarrow \text{Embed} \rightarrow \text{Retrieve} \rightarrow \text{Prompting} \rightarrow \text{Generate}
$$

This happens when a user asks a question.

---

## 4.3 Evaluation

The slides list two evaluation levels:

1. Retrieval quality, e.g. Recall@k.
2. End-to-end answer quality, e.g. BERTScore.

---

# 5. Ingestion pipeline: chunking

## 5.1 Why chunking is needed

The slides give two reasons:

1. LLMs have context length limits.
2. Retrieval performs better when chunks preserve coherent semantic units.

**Intuition:** A document is usually too long to retrieve and place into the prompt whole. It must be split into chunks that are small enough to retrieve and use.

---

## 5.2 Common chunking strategies

The slides list:

1. Fixed-length token windows.
2. Overlapping windows.
3. Sentence-based chunking.
4. Structure-aware chunking.

---

## 5.3 Fixed-length token windows

### Definition

Fixed-length chunking splits text by token count.

Example chunk size from slides:

$$
200\text{--}500 \text{ tokens per chunk}
$$

### Worked example: miso soup

Original text:

```text
Miso soup is a traditional Japanese soup. It is made from dashi stock and miso paste. Common additions include tofu and wakame. Dashi is typically made from kombu and katsuobushi.
```

Fixed-length windows may split as:

**Chunk 1:**

```text
Miso soup is a traditional Japanese soup. It is made from dashi stock
```

**Chunk 2:**

```text
and miso paste. Common additions include tofu and wakame.
```

### Problem

Fixed-length windows may ignore sentence boundaries.

The slide states:

$$
\text{May break sentences} \rightarrow \text{fragment meaning}
$$

---

## 5.4 Overlapping windows

### Definition

Overlapping windows use fixed-size chunks with partial overlap.

Example from the slide:

$$
300 \text{ tokens with } 50\text{-token overlap}
$$

The general chunking-strategy slide also mentions 10–20% overlap.

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

The slides state:

- Reduces boundary loss.
- Important facts near boundaries are less likely to be missed.

---

## 5.5 Sentence-based chunking

### Definition

Sentence-based chunking splits text at sentence boundaries and then merges sentences into size-controlled chunks.

### Worked example: miso soup

**Chunk 1:**

```text
Miso soup is a traditional Japanese soup.
```

**Chunk 2:**

```text
It is made from dashi stock and miso paste.
```

The slide notes that a chunk could contain multiple sentences.

### Benefits

- Preserves semantic units.
- Improves readability of retrieved context.

---

## 5.6 Structure-aware chunking

The slides list structure-aware chunking as splitting by:

- Headings.
- Sections.

**Intuition from slide wording:** Document structure can provide natural semantic boundaries.

---

## 5.7 Chunking trade-offs

### Larger chunks

Benefits:

- More context per retrieval hit.

Costs:

- Lower retrieval precision because more irrelevant text may be included.
- Fewer chunks overall.
- Coarser granularity.

### Smaller chunks

Benefits:

- Higher retrieval precision.
- Finer granularity for matching.

Costs:

- Risk of losing needed context.
- The slide calls this **semantic fragmentation**.

### Evaluation impact

The slide states that chunking affects:

- Retrieval metrics, including Recall@k and MRR.
- Generated answer quality.

---

# 6. Embeddings in RAG

## 6.1 Definition of embeddings

The slides define embeddings as:

> Dense vectors representing semantic meaning.

---

## 6.2 How embeddings are used

The RAG workflow uses embeddings in two phases.

### Offline phase

Embed each chunk in the corpus.

### Online phase

Embed the user query.

### Retrieval phase

Retrieve the top-$k$ similar chunks, for example using cosine similarity.

---

## 6.3 Example embedding models

The slides list:

- `all-MiniLM-L6-v2`.
- `E5-small`.
- `BGE-small`.

The slide emphasises:

> Embedding quality strongly impacts retrieval effectiveness.

---

# 7. Retrieval in RAG: bi-encoder dense retrieval

## 7.1 Definition

A **bi-encoder** encodes the query and documents independently.

In dense retrieval:

1. Precompute embeddings for all chunks offline.
2. Embed the user query at inference time.
3. Compute similarity in embedding space, e.g. cosine similarity.
4. Retrieve the top-$k$ most similar chunks.

---

## 7.2 Pros

The slides list:

- Efficient and scalable.
- Strong recall.

---

## 7.3 Cons

The slides list:

- Limited fine-grained query-document interaction.
- May retrieve semantically similar but irrelevant chunks.

**Intuition:** Because query and chunk are encoded separately, the model may miss detailed interactions between the exact query wording and the document text.

---

# 8. Re-ranking in RAG

Re-ranking adds a second stage after dense retrieval.

## 8.1 Stage 1: bi-encoder dense retrieval

The bi-encoder:

- Encodes query and documents independently.
- Retrieves top-$N$ candidates using vector similarity.
- Is high recall and efficient.

---

## 8.2 Stage 2: cross-encoder re-ranker

The cross-encoder:

- Jointly encodes query plus document.
- Computes a refined relevance score.
- Re-ranks the top-$N$ candidates.
- Selects the final top-$k$.

---

## 8.3 Trade-off

Re-ranking:

- Improves precision and ranking quality.
- Is more computationally expensive.
- Is therefore applied only to a small candidate set.

---

# 9. Vector stores

## 9.1 Why a vector store is needed

The slides state that a vector store enables:

- Efficient nearest-neighbour search over embedding vectors.
- Scalable retrieval over large embedding collections.

---

## 9.2 How vector stores work

A vector store:

1. Stores chunk embeddings in an index.
2. Uses Approximate Nearest Neighbour, ANN, search.
3. Returns the top-$k$ most similar chunks.

Examples on the slide:

- FAISS.
- Chroma.
- LanceDB.

The slide states that ANN trades exact search for significant speed gains.

---

# 10. Exact nearest neighbour search

## 10.1 Setup

Given:

- $N$ chunk embeddings.
- Query embedding $q$.

---

## 10.2 Exact search algorithm

1. Compute similarity between $q$ and every embedding.
2. Return the true top-$k$ most similar vectors.

---

## 10.3 Computational cost

The slide gives the example:

$$
1{,}000{,}000 \text{ vectors}
\rightarrow
1{,}000{,}000 \text{ similarity computations per query}
$$

The slide states that this is too slow for large-scale RAG systems.

---

# 11. Approximate Nearest Neighbour, ANN

## 11.1 Definition

ANN does **not** search the entire vector space.

Instead, it:

1. Uses an index structure to narrow the search.
2. Explores only a small, promising region.
3. Returns vectors that are very likely nearest neighbours.

The slide states that ANN results are **not guaranteed exact**.

---

## 11.2 Partition-based methods: IVF

The slides give IVF as an example of a partition-based ANN method.

### Step 1: offline

1. Divide the vector space into clusters, e.g. using $k$-means.
2. Assign each embedding to a cluster.

### Step 2: query time

1. Identify the nearest cluster or clusters to the query vector.
2. Search only within those clusters.
3. Dramatically reduce the number of similarity comparisons.

The slide gives typical speed-up:

$$
10\times \text{ to } 100\times
$$

It also states that recall is high in practice.

---

# 12. Prompting in RAG

## 12.1 Definition

The slides describe prompting as:

> The bridge between retrieval and generation.

The prompt determines how retrieved evidence influences the model’s output.

---

## 12.2 Standard RAG prompt structure

The slides list four components:

1. **Instruction** — defines behaviour and constraints, such as the system role.
2. **Context** — retrieved passages, possibly including metadata and chunk IDs.
3. **Question** — the user task.
4. **Answer** — the model output.

---

## 12.3 Standard prompt example

The slide gives a plain-text prompt structure:

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

The slide says to include chunk IDs or sources to enable attribution.

---

## 12.4 Strong grounding prompt

The slide gives this prompt pattern:

```text
Use ONLY the information in the context.
If the answer is not in the context, say "Not found in provided documents."
Cite the chunk number for each claim.
```

---

## 12.5 Why strong grounding matters

The slides state that strong grounding prompts:

- Reduce hallucination.
- Enable explicit attribution, i.e. claim-to-evidence mapping.
- Make it easier to audit and automate faithfulness checks.
- Encourage evidence-constrained generation.

---

# 13. Context formatting

## 13.1 Why context formatting matters

The slides state:

- Metadata helps reasoning.
- Chunk IDs enable citation.
- Clear structure reduces confusion in long contexts.
- Chunks should be ordered by retrieval score, highest first.

---

## 13.2 Practical formatting patterns

The slides recommend:

- Separate chunks with delimiters, e.g. `---`.
- Add source and chunk ID headers per chunk.

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

**Key point:** The structured version gives the model clearer evidence boundaries and makes citation easier.

---

# 14. Generation using LLMs in RAG

## 14.1 LLM generation

The slides state:

- LLMs generate text token by token.
- Generation is conditioned on the prompt.

---

## 14.2 RAG conditional distribution

The slide gives the RAG generation distribution as:

$$
P(\text{answer} \mid \text{question}, \text{retrieved context})
$$

---

## 14.3 What RAG changes

The slides state:

- RAG modifies the input distribution.
- RAG does **not** modify model weights.
- RAG shifts probability mass toward grounded tokens.

**High-value point:** RAG affects generation by changing the prompt / context, not by changing the trained parameters.

---

# 15. Evaluation in RAG

The slides state that a RAG system can be evaluated at two levels:

1. Retrieval quality.
2. End-to-end QA quality.

The slide also gives an important dependency:

> If relevant evidence is not retrieved, the generator cannot produce a correct grounded answer.

This is one of the most important RAG takeaways.

---

# 16. Retrieval evaluation metrics

## 16.1 Recall@k

### Definition

Recall@k is the proportion of queries where at least one relevant chunk appears in the top-$k$ results.

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

Recall@k measures coverage of relevant evidence.

### What it ignores

Recall@k ignores ranking order within the top-$k$.

### Interpretation

The slide summarises Recall@k as:

$$
\text{Recall@}k \rightarrow \text{Did we retrieve relevant evidence?}
$$

---

## 16.2 Mean Reciprocal Rank, MRR

### Definition

MRR measures how early the first relevant chunk appears.

### Formula

For a single query:

$$
RR =
\frac{1}{
\text{rank of first relevant chunk}
}
$$

Across queries:

$$
MRR = \text{average RR over all queries}
$$

### Interpretation

MRR is:

- Higher when relevant evidence appears earlier.
- Sensitive to ranking quality.

---

## 16.3 Normalized Discounted Cumulative Gain, nDCG

### Definition

nDCG is used when relevance is graded rather than simply relevant / not relevant.

### DCG formula

$$
DCG =
\sum_{i=1}^{k}
\frac{rel_i}{\log_2(i+1)}
$$

Where:

- $k$ is the number of retrieved results considered, e.g. top-10.
- $i$ is the rank position, where 1 is highest.
- $rel_i$ is the relevance score of the document at rank $i$.

### nDCG formula

$$
nDCG =
\frac{DCG}{\text{ideal DCG}}
$$

### Ideal DCG

Ideal DCG is the DCG score of the best possible ranking.

### Range

nDCG normalises the score to:

$$
[0, 1]
$$

### Interpretation

High nDCG means relevant documents are ranked near the top.

Low nDCG means relevant documents are ranked lower or poorly ordered.

---

## 16.4 Retrieval metric comparison

The slide gives the following comparison:

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

End-to-end answer quality compares the generated answer with the gold answer.

The slide writes this as generated answer $\hat{y}$ versus gold answer $y$.

**[UNCLEAR: OCR issue]** The parsed slide text renders generated answer as `y%`, but the intended notation appears to be $\hat{y}$.

---

## 17.2 Common metrics

The slides list:

- Exact Match, EM.
- Token-level F1.
- BERTScore.
- “What else?”

The slide also warns:

> High overlap does not guarantee factual grounding.

---

# 18. BLEU / ROUGE and why evaluation is hard

## 18.1 “Old reliables”: BLEU / ROUGE score

The slides use an overlap-based example.

### Reference

```text
I am giving a talk at a data science conference
```

### Hypothesis 1

```text
I am giving a talk at a conference about data science
```

The slide says this has lots of overlap and therefore receives a high score.

### Hypothesis 2

```text
This talk is about recent advances in medical imaging
```

The slide says this has little overlap and therefore receives a low score.

---

## 18.2 Why evaluation is hard

The slides then show that lexical overlap can be misleading.

### Reference

```text
I am giving a talk at a data science conference
```

### Bad output with high overlap

```text
I am giving a talk at a political science conference
```

The slide says:

- Lots of overlap.
- But bad output.

### Good output with low overlap

```text
My lecture will be given to the meeting on data analytics
```

The slide says:

- Little overlap.
- But good output.

The slide notes that this is particularly difficult for open-ended problems.

---

# 19. Exact Match, Token-Level F1, and BERTScore

## 19.1 Exact Match, EM

### Definition

Exact Match is strict string-level equality.

### Properties

The slides state:

- Common in extractive QA.
- Does not allow paraphrasing.

---

## 19.2 Token-Level F1

### Definition

Token-Level F1 is based on token overlap between the generated answer and the gold answer.

### Properties

The slides state:

- More forgiving than Exact Match.
- Ignores word order.
- Sensitive to lexical differences.

### Formula

$$
F1 =
\frac{2PR}{P + R}
$$

Where:

- $P$ is precision.
- $R$ is recall.

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

The common tokens are:

```text
Paris, is, capital, of, France
```

Number of common tokens:

$$
5
$$

### Precision

The generated answer has 5 tokens, all of which are common with the gold answer:

$$
P = \frac{5}{5} = 1.0
$$

### Recall

The gold answer has 6 tokens, and 5 are matched:

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

The slides define BERTScore as a metric that:

- Uses contextual embeddings to measure semantic similarity.
- Captures meaning beyond exact word overlap.

### Diagram process

The slide diagram shows:

1. Reference sentence and candidate sentence.
2. Contextual embedding.
3. Pairwise cosine similarity.
4. Maximum similarity.
5. Importance weighting.
6. A final score.

The example shown gives:

$$
R_{BERT} = 0.753
$$

**[UNCLEAR: small formula text]** The exact weighted numerator in the BERTScore diagram is too small to reconstruct confidently from the slide image, but the process and final displayed score are clear.

---

# 20. Automatic vs human evaluation

## 20.1 Automatic metrics are useful but limited

The slides state:

### Token-Level F1

- Overlap-heavy.
- Weak on factuality.

### BERTScore

- Measures semantic similarity.
- Still imperfect.

---

## 20.2 Human evaluation is often needed

The slides list four criteria:

1. Correctness.
2. Faithfulness, meaning supported by evidence.
3. Completeness.
4. Clarity.

---

# 21. RAG vs fine-tuning

## 21.1 RAG

The slides state that RAG:

- Uses external retrieval.
- Allows knowledge to be updated by updating the corpus or index.
- Does not update model weights.
- Often has higher inference complexity because it involves retrieval plus generation.

---

## 21.2 Fine-tuning

The slides state that fine-tuning:

- Updates model weights.
- Changes parametric knowledge.
- Can be expensive.
- Uses less frequent updates.
- Is good for style, format, and domain adaptation.
- Is not just for “adding facts.”

---

# 22. Building a good RAG system

The slides group the components of a good RAG system into three categories.

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

The RAG lecture summary states:

- RAG augments an LLM with external, non-parametric memory through retrieval.
- Pipeline: retrieve relevant chunks, provide them as context, then generate an answer.
- Core components: retrieval, embeddings, prompting, evaluation.
- Retrieval quality bounds answer quality.
- Answer correctness is not the same as evidence-grounded faithfulness.

This final distinction is especially important: an answer can be correct-looking or overlap with the gold answer, but still not be grounded in retrieved evidence.

---

# Exam flags and high-value revision points

## Explicit exam flags from transcript

**[UNCLEAR: transcript missing]** No transcript was provided, so spoken phrases such as “this will be on the exam,” “you should know this,” “common mistake,” or similar cannot be identified.

---

## Explicit exam flags from slides

The slides do not visibly contain phrases like “exam,” “must know,” or “common mistake.”

---

## Slide-emphasised high-value points

These are not transcript exam flags, but they are strongly foregrounded by slide wording, formulas, diagrams, or summaries.

### BERT

- BERT is an **encoder-only** Transformer model.
- BERT’s key contribution is learning representations from **bidirectional context**.
- BERT uses two pre-training objectives: **MLM** and **NSP**.
- MLM uses $k = 15\%$ selected tokens.
- MLM selected tokens use the **80-10-10 corruption strategy**.
- Only selected MLM positions contribute to the training loss.
- Final BERT input representation:

$$
\text{Token embeddings}
+
\text{Segment embeddings}
+
\text{Position embeddings}
$$

- `[CLS]` representation is used for NSP and sentence-level classification.
- Token-level representations are used for MLM and token-level tasks.
- Sentence-level fine-tuning adds a classifier on top of `[CLS]`.
- Token-level fine-tuning adds a classifier on top of each token hidden representation.
- BERT-base and BERT-large configurations are likely worth memorising from the slides.
- The ablation table supports the slide takeaway: **“The bigger, the better!”**

### RAG

- RAG does **not** update model weights.
- RAG augments the **input context**, not the model parameters.
- RAG is:

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

- Chunk size is a trade-off between retrieval precision and context preservation.
- Embedding quality strongly affects retrieval effectiveness.
- Bi-encoders are efficient and scalable but have limited fine-grained query-document interaction.
- Cross-encoder re-ranking improves precision but is more computationally expensive.
- ANN is faster than exact nearest-neighbour search but not guaranteed exact.
- Strong grounding prompts reduce hallucination and enable attribution.
- Retrieval quality bounds answer quality.
- Answer correctness does not equal evidence-grounded faithfulness.

---

# Connections across the two lectures

## 1. Transformer architecture

The BERT lecture situates BERT as an **encoder-only Transformer**, while the RAG lecture assumes LLMs as generators in a broader system architecture.

Together, the slides show two different uses of Transformer-based models:

- BERT: representation learning and NLU.
- RAG: retrieval plus generation using an LLM.

---

## 2. Embeddings and semantic similarity

The BERT lecture focuses on contextual representations learned by a Transformer encoder.

The RAG lecture uses embeddings as dense semantic vectors for retrieval.

The RAG lecture also introduces BERTScore as an evaluation metric that uses contextual embeddings to measure semantic similarity.

---

## 3. Pre-training / fine-tuning versus retrieval

The BERT lecture emphasises:

$$
\text{Pretrain once, finetune many times}
$$

The RAG lecture contrasts RAG with fine-tuning:

- Fine-tuning updates model weights.
- RAG uses external retrieval and does not update weights.

---

## 4. Evaluation difficulty

Both lecture topics involve evaluation challenges:

- BERT fine-tuning evaluates downstream NLU tasks such as MNLI, QQP, SST-2, SQuAD, and NER.
- RAG evaluation separates retrieval quality from answer quality and warns that lexical overlap does not guarantee factual grounding.

---

# Unclear sections to revisit

1. **[UNCLEAR: transcript missing]** No transcript was provided. Spoken explanations, lecturer emphasis, timing, and exam hints cannot be extracted.

2. **[UNCLEAR: course name]** The course title is not stated in the prompt or slides.

3. **[UNCLEAR: NSP slide OCR / label issue]** The parsed slide text incorrectly suggests `[CLS]` separates segments, but the diagram shows `[SEP]` as the separator and `[CLS]` as the class token.

4. **[UNCLEAR: generated answer notation]** The RAG QA evaluation slide renders generated answer as `y%` in parsed text; it appears to mean $\hat{y}$.

5. **[UNCLEAR: BERTScore formula detail]** The BERTScore diagram shows the process and final example score $R_{BERT}=0.753$, but the exact weighted formula text is too small to reconstruct safely.

6. **[UNCLEAR: large LM chart exact bar values]** The “How large are Large LMs?” chart is readable at a high level but not enough to extract every exact bar value from the slide image.

7. **[UNCLEAR: transcript-only worked examples]** Any examples spoken in the lecture but not present on the slides are unavailable until the transcript is provided.
