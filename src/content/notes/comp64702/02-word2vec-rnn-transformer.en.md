---
subject: COMP64702
chapter: 2
title: "Word2Vec, RNN, Transformer"
language: en
---

# Study Notes: word2vec, RNNs, and Transformers

**Source:** `3_wor2vec_RNN_Transformer.pdf` slide deck.  
**Transcript status:** No transcript text was supplied in the conversation, so these notes are based on the slides and visible diagrams only. Transcript-dependent details are marked **[TRANSCRIPT MISSING]** or **[UNCLEAR]**.  
**Course:** not supplied.  
**Lecture topic:** word2vec, RNNs, and Transformers.  
**Lecturer:** Chenghua Lin, Department of Computer Science, University of Manchester.

---

## Topic and scope

This lecture covers the evolution of language models and word representations from symbolic resources and one-hot/count-based representations, through **word2vec** and **RNN language models**, to **Transformer architectures** based on self-attention.

It fits into NLP/language modelling and representation learning by explaining why modern models moved from discrete symbols and sequential recurrence toward dense embeddings and attention-based sequence modelling.

---

# 1. Evolution of language models

The slide deck frames the lecture as a progression:

$$
\text{N-Gram} \rightarrow \text{Word2Vec} \rightarrow \text{Recurrent} \rightarrow \text{Transformer} \rightarrow ???
$$

This progression is shown several times as the lecture transitions between sections.

- First focus: **Word2Vec**.
- Second focus: **Recurrent** language models, especially RNNs.
- Third focus: **Transformer** language models.
- Final box: **???**.

**[UNCLEAR]** The slides do not explain what the final “???” refers to. Re-listen to the lecture if the lecturer discussed what may come after Transformers.

**Connection to earlier material:**  
The lecture compares RNN language models with **n-gram language models** later on. N-gram models only use a fixed preceding context of $n-1$ tokens, whereas RNN hidden states can incorporate information from all preceding words.

---

# 2. Representing word meaning

## 2.1 Symbolic lexical resources

### Intuition

Traditional NLP represented word meaning using **symbolic lexical resources**, such as WordNet. These resources define meaning through explicit, human-curated relations between words.

### Formal / precise description from slides

Meaning is represented by explicit lexical relations, including:

- **Synonymy:** words with similar meaning.
  - Slide example: `dog ↔ ...`
  - **[UNCLEAR]** The second term in the synonymy example is missing or unreadable in the slide text.
- **Hypernymy:** an “is-a” or category relation.
  - Slide example:

$$
\text{dog} \rightarrow \text{animal}
$$

The slide characterises this view of meaning as:

- **discrete**
- **manually defined**
- **relational**

### Limitations

Symbolic lexical resources have three major limitations:

1. **Static and incomplete**
   - They cannot keep pace with new words, new senses, or changing usage.

2. **Expensive to maintain**
   - They require expert human annotation.

3. **Limited notion of similarity**
   - They have no natural notion of graded similarity.
   - They cannot capture usage-based meaning differences.

---

## 2.2 Discrete representations: one-hot encoding

### Definition

A **discrete word representation** treats each word as an atomic symbol. In one-hot encoding, each word is represented by a vector with exactly one non-zero entry.

### Slide example

The slide gives examples for **motel** and **hotel**:

$$
\text{motel} = [0,0,0,0,0,1,0,0,0,\ldots,0,0]
$$

$$
\text{hotel} = [0,0,1,0,0,0,0,0,0,\ldots,0,0]
$$

The **vocabulary size equals the dimensionality** of the vector space. If the vocabulary is very large, the one-hot vectors are also very high-dimensional.

### Key limitation

All distinct words are treated as equally dissimilar. The slide’s example:

$$
\cos(\text{motel}, \text{hotel}) = 0
$$

So even though **motel** and **hotel** are semantically related, their one-hot vectors are orthogonal.

> **EXAM FLAG — key limitation:** one-hot vectors do not encode graded semantic similarity.

---

## 2.3 Distributional semantics

### Intuition

The lecture shifts from symbolic meaning to **distributional meaning**: a word’s meaning is inferred from the contexts in which it appears.

The slide quotes J. R. Firth:

> “You shall know a word by the company it keeps.”

### Example: “bank”

The slide contrasts two uses of **bank**:

- A **financial** sense: a financial institution that accepts deposits from the public and creates credit.
- A **geographical** sense: land alongside a body of water.

Same word, different contexts, different meanings.

### Definition

**Distributional semantics** represents meaning statistically, based on contextual usage.

Key points from the slide:

- Word meaning is inferred from contextual usage.
- Same word + different contexts $\rightarrow$ different meanings.
- Meaning becomes **statistical** rather than symbolic.

---

## 2.4 Context-based word representations

### Core idea

Build a **word–context co-occurrence matrix**.

- Rows = target words.
- Columns = context words.
- Values = frequency counts.
- Each word is represented by the words that occur around it.

### Worked example: co-occurrence matrix

The slide uses the vocabulary:

$$
\{I,\ like,\ enjoy,\ deep,\ learning,\ NLP,\ flying,\ .\}
$$

| target / context | I | like | enjoy | deep | learning | NLP | flying | . |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| I | 0 | 2 | 1 | 0 | 0 | 0 | 0 | 0 |
| like | 2 | 0 | 0 | 1 | 0 | 1 | 0 | 0 |
| enjoy | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| deep | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| learning | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| NLP | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| flying | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 |
| . | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 0 |

### Problems with raw co-occurrence counts

Raw co-occurrence matrices are:

- extremely high-dimensional,
- sparse and memory-intensive,
- sensitive to corpus size and word-frequency effects.

---

# 3. Low-dimensional dense word embeddings

## 3.1 Dense word embeddings

### Definition

A **dense word embedding** represents each word as a dense vector in a fixed-dimensional space.

The slide states that word2vec embeddings typically use **100–300 dimensions** and are learned automatically from data.

### Core idea of word2vec

Instead of explicitly storing raw co-occurrence counts, word2vec learns word embeddings through a **prediction task**:

- learn word embeddings by predicting context,
- replace explicit co-occurrence counts with prediction.

> **EXAM FLAG — core idea of word2vec:** word2vec turns distributional semantics into a predictive learning problem.

---

## 3.2 word2vec architectures

The lecture covers two word2vec training objectives:

1. **CBOW:** predict the target word from its context.
2. **Skip-gram:** predict the context words from the target word.

---

## 3.3 Continuous Bag-of-Words, CBOW

### Intuition

CBOW asks:

> Given the context, what word fits here?

### Definition

CBOW uses the surrounding context words as input and predicts the target word as output.

The context vectors are **summed or averaged**. The slide notes that CBOW is efficient for frequent words.

### Worked example

Sentence:

$$
\text{eat an apple every day}
$$

CBOW task:

$$
\{\text{eat}, \text{an}, \text{every}, \text{day}\}
\rightarrow
\text{apple}
$$

So the model predicts **apple** from its surrounding words.

### Training objective

The slide gives the CBOW objective:

$$
\prod_{w \in C} P(w \mid \text{context}(w))
$$

Taking the logarithm gives:

$$
\mathcal{L}
=
\sum_{w \in C}
\log P(w \mid \text{context}(w))
$$

### Derivation step shown

The lecture slide shows the move from product to log-sum:

$$
\log \prod_{w \in C} P(w \mid \text{context}(w))
=
\sum_{w \in C} \log P(w \mid \text{context}(w))
$$

**[UNCLEAR]** The slides do not give the full probability parameterisation, optimisation details, or negative sampling / hierarchical softmax details. Re-listen if the lecturer explained these.

---

## 3.4 Skip-gram

### Intuition

Skip-gram asks:

> Given this word, what words tend to appear nearby?

### Definition

Skip-gram uses the target word as input and predicts surrounding context words as output.

The slide notes:

- input = target word,
- output = surrounding context words,
- generates multiple training pairs per word,
- often performs better than CBOW for rare words.

### Worked example

Sentence:

$$
\text{eat an apple every day}
$$

Skip-gram task:

$$
\text{apple}
\rightarrow
\{\text{eat}, \text{an}, \text{every}, \text{day}\}
$$

This can be treated as multiple target-context prediction pairs:

$$
(\text{apple}, \text{eat}),\quad
(\text{apple}, \text{an}),\quad
(\text{apple}, \text{every}),\quad
(\text{apple}, \text{day})
$$

> **EXAM FLAG — CBOW vs Skip-gram:** CBOW predicts the centre word from context; Skip-gram predicts context from the centre word.

---

## 3.5 Applications of word embeddings

The slide lists these applications:

- dependency parsing,
- named entity recognition,
- document classification,
- sentiment analysis,
- paraphrase detection,
- word clustering,
- machine translation.

---

## 3.6 Word analogies

### Definition

Word analogies test for **linear regularities** in embedding space.

The idea is that relations between words can be captured as **vector offsets**. The slide attributes this empirical property to Mikolov et al. (2014).

### Formalism

For an analogy:

$$
a : b :: c : d
$$

The slide gives a nearest-neighbour style formula:

$$
d
=
\arg\max_z
\frac{
(u_b - u_a + u_c)^\top u_z
}{
\|u_b - u_a + u_c\| \, \|u_z\|
}
$$

This means:

1. Construct a query vector:

$$
u_b - u_a + u_c
$$

2. Find the word vector $u_z$ with maximum cosine similarity to that query vector.

### Worked example: `man : woman :: king : ?`

The slide shows:

$$
\text{king} - \text{man} + \text{woman} = \text{queen}
$$

Using the vectors shown:

$$
\text{king} = [0.30, 0.70]
$$

$$
\text{man} = [0.20, 0.20]
$$

$$
\text{woman} = [0.60, 0.30]
$$

Compute:

$$
[0.30,0.70] - [0.20,0.20] + [0.60,0.30]
$$

$$
=
[0.10,0.50] + [0.60,0.30]
$$

$$
=
[0.70,0.80]
$$

The slide labels this result as:

$$
\text{queen} = [0.70,0.80]
$$

> **EXAM FLAG — formal + worked example:** know the vector-offset idea and the analogy computation.

---

## 3.7 Word embeddings and machine translation

The slide connects embeddings to machine translation:

- similar concepts align geometrically across languages,
- this enables bilingual lexicon induction,
- this is a precursor to modern multilingual embeddings.

The visual example shows English number words in one embedding space and Spanish number words in another, with the idea that corresponding concepts can be geometrically aligned across languages.

---

# 4. Recurrent Neural Networks as language models

## 4.1 Recurrent Neural Network, RNN

### Definition

A **recurrent neural network** is a network that contains a cycle: the hidden state is fed back and used at the next time step.

The hidden state at time $t$ depends on:

- the current input $x_t$,
- the previous hidden state $h_{t-1}$.

The slides identify this as an **Elman network / simple RNN**.

### Intuition

The RNN processes a sequence one token at a time, from left to right. The hidden state acts as a summary of the previous inputs.

At each time step:

$$
h_t = \text{combination of current input and previous hidden state}
$$

The slide does not give a full activation formula such as a specific nonlinearity.

**[UNCLEAR]** Re-listen to check whether the lecturer gave the exact RNN update equation.

---

## 4.2 Simple RNN language model

An RNN language model:

- processes an input sequence one word at a time,
- predicts the next word from the current word and previous hidden state,
- models next-word probability,
- is sequential, which limits parallelisation.

### Variables from the diagram

Let $t$ be the current time step and $w_t$ the current word.

The diagram labels:

- $e_t$: embedding for the current word $w_t$,
- $h_t$: combination of $e_t$ and $h_{t-1}$,
- $Vh_t$: scores over the vocabulary,
- $y_t$: probability distribution over the vocabulary,
- $y_t[i]$: probability that word $i$ is the next word.

A clean version of the computation shown is:

$$
e_t = \text{embedding}(w_t)
$$

$$
h_t = \text{RNN}(e_t, h_{t-1})
$$

$$
\text{scores}_t = Vh_t
$$

$$
y_t = \text{softmax}(\text{scores}_t)
$$

Then:

$$
y_t[i] = P(w_{t+1}=i \mid w_{\leq t})
$$

The final probability notation is a cleaned-up version of what the diagram represents: the slide states that $y_t[i]$ is the probability that a particular word $i$ is the next word.

---

## 4.3 Training an RNN language model

Training is based on a corpus. At each time step $t$, the model learns to predict the next word.

The model minimises prediction error. The slide defines the error/loss as the difference between:

- the predicted probability distribution,
- the correct distribution.

The correct distribution is a one-hot vector over the vocabulary:

- actual next word = 1,
- all other words = 0.

The loss used is **cross-entropy**.

### Token-level loss

The diagrams show losses of the form:

$$
-\log y_{\text{correct next word}}
$$

For example, if the correct next word is “long”, the loss term is:

$$
-\log y_{\text{long}}
$$

### Sequence-level objective

The slide states that gradient descent is used to adjust the RNN weights to minimise the cross-entropy loss averaged over the sequence:

$$
\frac{1}{T}
\sum_{t=1}^{T}
L^{t}_{CE}
$$

where:

- $T$ is the sequence length,
- $L^{t}_{CE}$ is the cross-entropy loss at time step $t$.

---

## 4.4 Teacher forcing

### Definition

**Teacher forcing** means the model is given the correct history sequence during training, rather than being fed what it predicted at the previous time step.

So, during training:

- the input history is the real sequence,
- the model predicts the next word at each time step,
- the loss is based on the probability assigned to the correct next word.

This prevents earlier model mistakes from changing the later training inputs.

> **EXAM FLAG — training vs generation distinction:** teacher forcing is used during training; autoregressive generation feeds the model’s own sampled/predicted output back in.

---

## 4.5 Sampling using RNN language models

### Autoregressive generation

The slide defines **autoregressive generation** as:

> The word generated at each time step $t$ is conditioned on the word selected by the RNN from the previous time step $t-1$.

### Algorithm from the slide

1. Use `<s>` as the first input.
2. Compute a softmax distribution over the vocabulary.
3. Sample a word based on the softmax.
4. Use the sampled word as the next input.
5. Continue until `</s>` is sampled or a maximum limit is reached.

### Connection to other applications

The slide says autoregressive generation is also used in applications beyond next-word prediction, including:

- machine translation,
- summarisation.

In those applications, instead of only using `<s>`, richer context is used.

---

## 4.6 RNNs compared with n-gram language models

The key difference:

- **n-gram language models** use limited context only:

$$
\text{preceding } n-1 \text{ tokens}
$$

- **RNN language models** use a hidden state that can incorporate information from all preceding words.

> **EXAM FLAG — key difference:** n-gram context is fixed-length; RNN context is accumulated in the hidden state.

---

## 4.7 Limitations of RNNs

The slide lists these limitations:

- RNNs process input sequentially, causing slow training and inference.
- They struggle with long-range dependencies, despite LSTM/GRU improvements.
- They have limited parallelisation during training, making them hard to scale to large datasets.
- They suffer from vanishing/exploding gradient issues over long sequences.
- They find it difficult to capture global context effectively.

These limitations motivate the transition to Transformer language models.

---

# 5. Transformers

## 5.1 Turning point: Transformer

The slide describes the Transformer as a turning point:

- proposed by Vaswani et al. (2017) in *Attention is All You Need*,
- eliminates recurrence, meaning no step-by-step token processing,
- enables parallelisation by processing entire sequences simultaneously,
- uses self-attention to model long-range dependencies,
- achieved state-of-the-art results in machine translation and beyond.

---

## 5.2 Transformer model families

The slide distinguishes three Transformer types.

### Encoder-only Transformers

Uses:

- NLU,
- classification,
- feature extraction.

Examples:

- BERT,
- RoBERTa,
- DeBERTa.

### Encoder–decoder Transformers

Uses:

- NLG,
- translation,
- summarisation,
- sequence-to-sequence mapping.

Examples:

- T5,
- Flan-T5,
- BART.

### Decoder-only Transformers

Uses:

- NLG,
- translation,
- summarisation,
- completion.

Examples:

- GPT-x,
- LLaMa,
- “every other new model today” as written on the slide.

---

## 5.3 Transformer definition

The slide defines a Transformer as:

> A neural architecture built entirely on attention mechanisms.

A diagram shows a translation-style example:

$$
\text{Je suis étudiant}
\rightarrow
\text{I am a student}
$$

---

## 5.4 Transformer architecture: core components

The slide lists four core components.

### 1. Encoder stack

Produces contextual representations of the input.

### 2. Decoder stack

Uses:

- the encoder’s output,
- previous decoder outputs,

to generate the target sequence.

### 3. Self-attention mechanism

Allows the model to focus on different parts of the input sequence when processing each token.

### 4. Feed-forward neural networks

Apply nonlinear transformations per token.

### Key idea

$$
\text{No recurrence, no convolution — only attention.}
$$

> **EXAM FLAG — key idea:** Transformers replace recurrence/convolution with attention as the central sequence-modelling operation.

---

## 5.5 Why self-attention replaced RNNs

### In RNNs

- Information between distant tokens flows through $O(n)$ steps.
- Computation is sequential and hard to parallelise.

### In Transformers

- Self-attention lets each token directly attend to all other tokens in the sequence.
- This produces contextualised representations.
- Computation within each layer is parallelisable across sequence positions.

### Trade-off

Attention time and memory scale quadratically with sequence length:

$$
O(n^2)
$$

where $n$ is sequence length.

> **EXAM FLAG — trade-off:** Transformers improve parallelism and token-to-token path length, but attention has $O(n^2)$ time/memory cost.

---

# 6. Encoder internals

## 6.1 Encoder block structure

The encoder contains:

1. self-attention,
2. residual connection + layer normalisation,
3. position-wise feed-forward network,
4. residual connection + layer normalisation.

The slide states:

- self-attention mixes information across positions,
- the feed-forward network applies nonlinear transformation independently to each token,
- residuals and LayerNorm are applied around these sublayers.

The formulas shown are:

$$
\mathrm{LayerNorm}(z + \mathrm{SelfAttention}(z))
$$

$$
\mathrm{LayerNorm}(z + \mathrm{FFN}(z))
$$

**[UNCLEAR]** The slide uses $z$ generically; the transcript may clarify whether the notation is pre-norm or post-norm in the lecturer’s explanation.

---

## 6.2 Important encoder properties

The slide explicitly calls these **Important properties**:

- tokens are processed in parallel within each layer,
- tokens are coupled via attention,
- deeper layers refine contextual representations,
- residual connections preserve signal and ease optimisation.

> **EXAM FLAG — important properties:** parallel token processing + coupling through attention is the key encoder behaviour.

---

# 7. Self-attention mechanism

## 7.1 Scaled dot-product attention

### Formal definition

For input:

$$
X \in \mathbb{R}^{n \times d}
$$

compute:

$$
Q = XW^Q
$$

$$
K = XW^K
$$

$$
V = XW^V
$$

Then:

$$
\mathrm{Attention}(Q,K,V)
=
\mathrm{softmax}
\left(
\frac{QK^\top}{\sqrt{d_k}}
\right)V
$$

where:

- $Q$ = query matrix,
- $K$ = key matrix,
- $V$ = value matrix,
- $d_k$ = key dimension.

### Interpretation

The slide gives the following interpretation:

- $Q$, $K$, and $V$ are learned linear projections of the input.
- Attention scores:

$$
\frac{QK^\top}{\sqrt{d_k}}
$$

  measure similarity in projected space.
- Scaling by $\sqrt{d_k}$ prevents dot products from growing too large in high dimensions and stabilises gradients.
- Softmax converts attention scores into a distribution over input elements.
- The output is a weighted sum of value vectors.

> **EXAM FLAG — core formula:** know the scaled dot-product attention equation and what $Q$, $K$, $V$, $d_k$, softmax, and $V$ do.

---

## 7.2 Query, Key, Value intuition

The slide explains Q/K/V with a recommendation analogy.

### Query, $Q$

The query vector represents the current input or the element for which relevant information is being sought.

Example:

> Looking for action movies with strong female leads.

### Key, $K$

The key vector represents the criteria or features against which the query is compared.

Example:

> This movie is tagged as action, drama, female lead.

### Value, $V$

The value vector contains the actual information or content that may be relevant to the query.

Example:

> The full movie details or recommendation result.

---

## 7.3 Calculating self-attention step by step

The slides walk through self-attention using the example tokens **Thinking** and **Machines**.

### Step 1: Compute Q, K, and V

For each token, compute:

- a query vector,
- a key vector,
- a value vector.

These are derived by multiplying input embeddings with learned weight matrices.

For token embedding $x_i$:

$$
q_i = x_i W^Q
$$

$$
k_i = x_i W^K
$$

$$
v_i = x_i W^V
$$

---

### Step 2: Compute attention scores

For each token, compute dot products between:

- its query vector,
- all key vectors.

For example:

$$
q_1 \cdot k_1
$$

$$
q_1 \cdot k_2
$$

The slide gives example scores:

$$
q_1 \cdot k_1 = 112
$$

$$
q_1 \cdot k_2 = 96
$$

A larger dot product means stronger alignment.

---

### Step 3: Scale and normalise attention scores

Dot products can become large, especially with high-dimensional vectors.

Divide each score by the square root of the key dimension:

$$
\sqrt{d_k}
$$

Example:

$$
\sqrt{64} = 8
$$

So:

$$
112 / 8 = 14
$$

$$
96 / 8 = 12
$$

Then apply softmax:

$$
\mathrm{softmax}([14,12]) = [0.88, 0.12]
$$

The slide states that softmax:

- makes all weights positive,
- converts the scores into a probability distribution over tokens.

---

### Step 4: Compute the self-attention output

Multiply each value vector by its attention weight.

For the first token in the example:

$$
z_1 = 0.88v_1 + 0.12v_2
$$

This:

- emphasises important words,
- down-weights irrelevant ones,
- produces an updated contextualised representation,
- passes that representation to the feed-forward layer.

---

## 7.4 Matrix form

Instead of computing each token separately, self-attention is computed efficiently in matrix form.

The slide says to pack embeddings into a matrix $X$, then multiply by learned weight matrices to obtain $Q$, $K$, and $V$.

The output of the self-attention layer is:

$$
Z
=
\mathrm{softmax}
\left(
\frac{QK^\top}{\sqrt{d_k}}
\right)V
$$

This is the same scaled dot-product attention equation, applied to the entire context at once.

---

## 7.5 Self-attention visualisation

The slide shows a sentence:

> The animal didn’t cross the street because it was too tired.

The token **“it”** attends more to related tokens like **“The animal”**. This helps the model capture long-range dependencies and context.

**Connection:**  
This directly addresses an RNN limitation: distant dependencies do not need to pass through many sequential hidden states.

---

# 8. Multi-head attention

## 8.1 Motivation

Each self-attention layer computes multiple attention heads in parallel.

Instead of one set of $Q/K/V$ weights, the model uses multiple sets, one per head.

This is called **multi-head attention**.

### Intuition

Each head can learn a different aspect or pattern in the data.

The slide example:

- one head may capture the meaning of **river bank**,
- another may capture **financial bank**.

So multi-head attention lets the model attend to different representation subspaces simultaneously.

---

## 8.2 Head outputs

Each attention head produces its own output matrix:

$$
Z_0, Z_1, \ldots, Z_7
$$

The slide example uses 8 heads.

These outputs are computed independently in different learned projection subspaces and can model diverse relational patterns from the same input.

---

## 8.3 Combining multiple heads

The slide gives three steps:

1. Concatenate the outputs from all heads:

$$
\mathrm{Concat}(Z_0, Z_1, \ldots, Z_7)
$$

2. Multiply the combined matrix by a learnable output projection matrix:

$$
W^O
$$

3. Produce final output:

$$
Z
=
\mathrm{Concat}(Z_0, Z_1, \ldots, Z_7)W^O
$$

This final $Z$ integrates diverse attention patterns and is passed to the next layer.

> **EXAM FLAG — multi-head formula:** know that multi-head attention = multiple independent attention heads + concatenation + output projection $W^O$.

---

# 9. Positional encodings and residuals

## 9.1 Positional encodings

### Problem

Transformers have no built-in notion of word order.

Because self-attention can compare all tokens in parallel, the architecture needs extra information to distinguish positions.

### Solution

Add a **positional vector** to each input embedding.

The original Transformer used fixed sinusoidal positional encodings: sinusoidal functions of different frequencies.

> **EXAM FLAG — missing piece:** self-attention alone does not encode token order; positional encoding supplies order information.

---

## 9.2 Residual connections

The slide describes residuals as another “ornament” of the Transformer architecture.

### Purpose

Residual connections stabilise training in deep networks.

### Mechanism

For each sublayer, such as self-attention or FFN:

1. compute the sublayer output,
2. add the original sublayer input,
3. apply layer normalisation.

In words:

$$
\text{sublayer output} + \text{sublayer input}
\rightarrow
\text{LayerNorm}
$$

The slide says residual connections:

- improve gradient flow,
- facilitate optimisation in deep architectures.

---

# 10. Decoder and generation process

## 10.1 Decoder structure

The decoder includes:

- masked self-attention,
- cross-attention over encoder outputs,
- a feed-forward network.

The decoder generates output one token at a time.

---

## 10.2 Masked self-attention

### Definition

Masked self-attention ensures each position can only attend to previously generated tokens.

This prevents access to future tokens.

### Formal masking behaviour

The decoder’s self-attention can only look at earlier tokens, not future ones.

This is implemented by setting future-position attention scores to:

$$
-\infty
$$

before softmax.

Because:

$$
\mathrm{softmax}(-\infty) = 0
$$

future tokens receive zero attention weight.

> **EXAM FLAG — masking:** decoder masking prevents information leakage from future target tokens during training.

---

## 10.3 Cross-attention

### Definition

Cross-attention allows the decoder to attend to encoder outputs when generating each token.

The top encoder layer produces contextualised representations. In cross-attention, these encoder representations are used as **keys** and **values**.

These are fed into the decoder’s cross-attention layer, helping the decoder focus on relevant input positions during generation.

### Decoder layer combination

Each decoder layer combines:

1. masked self-attention,
2. encoder–decoder cross-attention,
3. feed-forward network.

The resulting representations are used to predict the next token.

---

## 10.4 From decoder to output token

The slide distinguishes training time from inference time.

### Training time

The full target sequence is known.

The model uses **teacher forcing**, feeding the correct previous tokens to compute next-token predictions.

### Inference time

Output is generated autoregressively, one token at a time.

Each predicted token is fed back into the decoder.

### Output prediction steps

1. **Linear layer**
   - Projects decoder output to vocabulary size.

2. **Softmax**
   - Converts logits into probability distributions over the vocabulary.

3. **Token selection**
   - Selects the next token, for example by greedy decoding or sampling.

This mirrors the RNN distinction between teacher-forced training and autoregressive generation.

---

## 10.5 Transformer training process

The slide lists three training components.

### Loss function

Cross-entropy loss measures how far predicted token probabilities are from the true target tokens.

Lower loss means better predictions.

### Backpropagation

Gradients of the loss are computed and used to update parameters, for example via the Adam optimiser.

### Datasets

Transformers are trained on paired input-output sequences, such as source and target sentences for translation.

---

# 11. Transformer summary

The slide summary states:

### Core idea

Transformers overcome limitations of RNNs and LSTMs, including:

- sequential bottlenecks,
- long-range dependency problems,

by using global self-attention.

### Key components

- self-attention,
- multi-head attention,
- encoder-decoder structure,
- positional encoding.

### Why Transformers work

- Short path length between tokens:

$$
O(1) \text{ per layer}
$$

- Fully parallelisable across sequence positions.
- Scales effectively to very large models and datasets.

> **EXAM FLAG — summary slide:** this is the lecture’s high-level answer to “why Transformers replaced RNNs.”

---

# 12. Worked examples index

## Example 1: WordNet / symbolic meaning

- WordNet represents explicit relations.
- Example relation:

$$
\text{dog} \rightarrow \text{animal}
$$

for hypernymy.

- Synonym example on slide is incomplete. **[UNCLEAR]**

## Example 2: One-hot vectors

$$
\text{motel} = [0,0,0,0,0,1,0,0,0,\ldots,0,0]
$$

$$
\text{hotel} = [0,0,1,0,0,0,0,0,0,\ldots,0,0]
$$

$$
\cos(\text{motel}, \text{hotel}) = 0
$$

Conclusion: one-hot vectors treat semantically related words as unrelated.

## Example 3: Bank

- Financial bank: deposits and credit.
- Geographical bank: land beside water.
- Shows that context changes meaning.

## Example 4: Co-occurrence matrix

Rows are target words, columns are context words, entries are frequency counts.

Key lesson: context vectors encode distributional information but raw counts are sparse and high-dimensional.

## Example 5: CBOW

Sentence:

$$
\text{eat an apple every day}
$$

Task:

$$
\{\text{eat},\text{an},\text{every},\text{day}\}
\rightarrow
\text{apple}
$$

## Example 6: Skip-gram

Sentence:

$$
\text{eat an apple every day}
$$

Task:

$$
\text{apple}
\rightarrow
\{\text{eat},\text{an},\text{every},\text{day}\}
$$

## Example 7: Word analogy

$$
\text{king} - \text{man} + \text{woman}
=
\text{queen}
$$

Numerical version:

$$
[0.30,0.70] - [0.20,0.20] + [0.60,0.30]
=
[0.70,0.80]
$$

## Example 8: RNN sampling

1. Start with `<s>`.
2. Sample next word from softmax.
3. Feed sampled word back in.
4. Stop at `</s>` or length limit.

## Example 9: Self-attention scores

Given scores:

$$
q_1 \cdot k_1 = 112
$$

$$
q_1 \cdot k_2 = 96
$$

Scale by:

$$
\sqrt{64}=8
$$

$$
112/8=14,\quad 96/8=12
$$

Softmax:

$$
[14,12] \rightarrow [0.88,0.12]
$$

Weighted output:

$$
z_1 = 0.88v_1 + 0.12v_2
$$

## Example 10: Pronoun/coreference-style attention

Sentence:

> The animal didn’t cross the street because it was too tired.

The token **“it”** attends to **“The animal”**, showing how self-attention captures long-range contextual relationships.

---

# 13. Exam flags / slide-emphasis flags

No explicit “this will be on the exam” statement appears in the supplied slides, and no transcript was provided. The following are explicitly emphasised by slide wording such as **Core Idea**, **Key idea**, **Important properties**, **Key difference**, or appear as central formulas.

1. **Core idea of word2vec**
   - Learn embeddings by predicting context.
   - Replace explicit co-occurrence counts with a prediction task.

2. **CBOW vs Skip-gram**
   - CBOW:

$$
\text{context} \rightarrow \text{target}
$$

   - Skip-gram:

$$
\text{target} \rightarrow \text{context}
$$

3. **CBOW objective**

$$
\prod_{w \in C} P(w \mid \text{context}(w))
$$

$$
\mathcal{L}
=
\sum_{w \in C}
\log P(w \mid \text{context}(w))
$$

4. **Word analogy vector arithmetic**

$$
\text{king} - \text{man} + \text{woman}
=
\text{queen}
$$

5. **RNN vs n-gram**
   - n-gram: fixed $n-1$-token context.
   - RNN: hidden state can incorporate all preceding words.

6. **Teacher forcing vs autoregressive generation**
   - Training: feed correct previous tokens.
   - Generation: feed model’s own previous output.

7. **RNN limitations**
   - sequential bottleneck,
   - long-range dependency difficulty,
   - limited parallelisation,
   - vanishing/exploding gradients,
   - difficulty capturing global context.

8. **Transformer key idea**

$$
\text{No recurrence, no convolution — only attention.}
$$

9. **Scaled dot-product attention**

$$
\mathrm{Attention}(Q,K,V)
=
\mathrm{softmax}
\left(
\frac{QK^\top}{\sqrt{d_k}}
\right)V
$$

10. **Self-attention trade-off**
    - direct access between tokens,
    - parallelisable within layer,
    - quadratic time/memory:

$$
O(n^2)
$$

11. **Multi-head attention**

$$
Z
=
\mathrm{Concat}(Z_0,\ldots,Z_7)W^O
$$

12. **Positional encoding**
    - Transformers lack built-in order.
    - Add positional vector to input embedding.

13. **Decoder masking**
    - Future attention scores are set to:

$$
-\infty
$$

    - Prevents future-token leakage.

14. **Cross-attention**
    - Decoder attends to encoder outputs.
    - Encoder outputs serve as keys and values.

---

# 14. Connections across the lecture

## Symbolic meaning → distributional meaning

The lecture begins with WordNet-style symbolic lexical resources, then moves to distributional semantics. The key shift is from manually defined relations to statistically learned contextual meaning.

## Co-occurrence counts → word2vec

Raw co-occurrence matrices represent words by context counts but are sparse and high-dimensional. word2vec keeps the distributional idea but learns dense vectors through prediction.

## word2vec → downstream NLP

Word embeddings are connected to downstream tasks including parsing, NER, classification, sentiment analysis, paraphrase detection, clustering, and translation.

## n-grams → RNNs

N-grams use limited fixed context. RNNs use hidden states to accumulate information from previous tokens.

## RNNs → Transformers

RNNs are sequential and struggle with long-range dependencies and parallelisation. Transformers remove recurrence and use self-attention to connect tokens directly.

## RNN generation → Transformer generation

Both RNNs and Transformer decoders use:

- teacher forcing during training,
- autoregressive generation during inference.

## Word embeddings → contextual representations

word2vec gives a word a learned vector representation. Transformers produce contextualised representations, where a token’s representation depends on other tokens through attention.

---

# 15. Unclear sections to revisit in the recording

- **[TRANSCRIPT MISSING]** No transcript text was supplied, so spoken explanations, examples, corrections, and verbal exam warnings are not included.

- **[UNCLEAR: slides 2, 18, 33]** The evolution diagram ends with “???” after Transformer. The slides do not explain what this refers to.

- **[UNCLEAR: slide 3]** The synonymy example appears as “dog ↔” with the second term missing or unreadable.

- **[UNCLEAR: slide 14]** The CBOW training objective is shown, but the slides do not explain how $P(w \mid \text{context}(w))$ is parameterised or optimised.

- **[UNCLEAR: RNN diagrams, slides 23–27]** Some diagram labels are visually small or parsed oddly, especially `S0/So` and the red “sorry” example. Re-listen for the exact example sentence and target words.

- **[UNCLEAR: slide 41]** Residual/LayerNorm formulas use $z$, but the slide does not fully define the intermediate variables.

- **[UNCLEAR: slides 50 and 55]** The “efficient computation” and “all in one place” diagrams contain small matrix labels; the high-level process is clear, but exact dimensions are not fully legible from the slide images.

- **[UNCLEAR: slide 65]** The “Building Transformers from Scratch” slide shows video/resource screenshots, but the resource details are not readable from the parsed slide text.
