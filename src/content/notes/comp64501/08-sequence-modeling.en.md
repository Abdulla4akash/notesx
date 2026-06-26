---
subject: COMP64501
chapter: 8
title: "Sequence Modeling"
language: en
---

Course: **Topics in Machine Learning**, University of Manchester  
Lecture topic: **Sequence Modelling**  
Source note: Only the slide deck was provided in the conversation; no transcript text was included after the prompt. These notes are grounded in the slides only, with transcript-dependent gaps marked where relevant. Source slide deck: `sequence-modeling.pdf`.

# Topic and scope

This lecture introduces **sequence modelling**, mainly for language, and moves from **language models** to **Recurrent Neural Networks**, then to **Transformers**. It fits into the broader course by extending the previous lecture’s feedforward neural networks, backpropagation, and training ideas to models that process ordered token sequences.

The lecture’s main arc is: language modelling motivates sequence prediction; RNNs model sequences through recurrence but suffer from BPTT and gradient/parallelisation issues; transformers replace recurrence with attention, positional information, and encoder/decoder architectures.

---

# 1. Recap from the previous lecture

The previous lecture covered:

- **Multi-Layer Perceptrons**
- **Feedforward neural networks**
  - Forward equations
  - Backpropagation equations
- **Training neural networks**
  - Parameter initialization
  - Normalization
  - SGD optimization
  - Regularization

## Connection to this lecture

This lecture reuses the ideas of forward computation and backpropagation, but applies them to **sequential data**. The key extension is that outputs now depend on a sequence of previous inputs, not just a single input vector.

---

# 2. Lecture outline and intended learning outcomes

The lecture is organised into three main parts:

1. **Language Models**
2. **Recurrent Neural Networks**
3. **Transformers**

## Revision flags from intended learning outcomes

No explicit “this will be on the exam” statement appears in the slides. However, the intended learning outcomes identify high-value revision targets:

- Know the key components of:
  - Language models
  - Recurrent Neural Networks
  - Transformers
- Explain:
  - **Back-Propagation Through Time**
  - **Truncated BPTT**
- Explain how **attention** transforms sequences:
  - In an equivariant way
  - In a non-equivariant way
- Apply and implement **self-attention** for sequential inputs

**EXAM FLAG:** No explicit exam statement appears in the slides. Treat the intended learning outcomes above as the main exam-revision checklist.

---

# 3. Language Models

## 3.1 Definition of a language model

### Intuition

A **language model** assigns probabilities to sequences of words. It tells us how likely a sentence or utterance is.

For example, a language model should assign:

$$
p(\text{he likes apples}) > p(\text{apples likes he})
$$

because “he likes apples” is more natural English than “apples likes he”.

It can also help distinguish between acoustically or visually similar alternatives, such as:

$$
p(\text{he likes apples}) > p(\text{he licks apples})
$$

This matters in applications like:

- Translation
- Speech recognition
- General natural language understanding

### Formal definition from the slides

A language model assigns a probability to a sequence of words such that:

$$
\sum_{x \in \Sigma^*} p(x) = 1
$$

where:

- $\Sigma^*$ is the set of all possible finite sequences over the vocabulary/alphabet.
- $p(x)$ is the probability of sequence $x$.

So the model defines a probability distribution over all possible word sequences.

---

## 3.2 Chain-rule decomposition of sequence probability

A sequence probability can be decomposed into conditional probabilities using the chain rule.

For a sequence:

$$
x_1, x_2, x_3, \dots, x_N
$$

the joint probability is:

$$
p(x_1, x_2, x_3, \dots, x_N)
=
p(x_1)
p(x_2 \mid x_1)
p(x_3 \mid x_1, x_2)
\cdots
p(x_N \mid x_1, x_2, \dots, x_{N-1})
$$

### Intuition

Instead of trying to model the probability of a whole sentence directly, we model the probability of each next word given the words already observed.

That means a language model learns conditional distributions of the form:

$$
p(x_n \mid x_1, x_2, \dots, x_{n-1})
$$

This makes language modelling a **next-word prediction problem**.

---

## 3.3 Next-word prediction contains much of language understanding

The slides use the example:

$$
p(\cdot \mid \text{There she built a})
$$

With only the phrase “There she built a”, many completions are possible.

But with more context:

$$
p(\cdot \mid \text{Alice went to the beach. There she built a})
$$

the likely next word is heavily constrained by both language and world knowledge.

For example, the model should assign high probability to:

$$
p(\text{sandcastle} \mid \text{Alice went to the beach. There she built a})
$$

### Key point

The simple objective “predict the next word” contains a lot of the complexity of natural language understanding, because successful prediction requires the model to use:

- Syntax
- Semantics
- Context
- Real-world knowledge

---

## 3.4 Language modelling as time-series prediction

The slides state that language modelling is a **time-series prediction problem**.

That means the model observes earlier tokens and predicts future tokens.

Important training/evaluation principle:

- Train on the **past**
- Test on the **future**

This matters because sequence prediction should not leak future information into the model when predicting earlier positions.

---

# 4. Recurrent Neural Networks

## 4.1 Feedforward neural networks versus recurrent neural networks

### Feedforward network

#### Formal equations

A feedforward neural network layer is shown as:

$$
h = g(Vx + c)
$$

$$
\hat{y} = Wh + b
$$

where:

- $x$ is the input
- $h$ is the hidden representation
- $\hat{y}$ is the output prediction
- $V, W$ are weight matrices
- $c, b$ are bias terms
- $g$ is a nonlinear activation function

#### Intuition

A feedforward network processes a single input vector and produces a prediction. There is no explicit memory of previous inputs.

---

### Recurrent Neural Network

#### Formal equations

For an RNN, the hidden state at time $n$ is:

$$
h_n = g(V[x_n; h_{n-1}] + c)
$$

and the output is:

$$
\hat{y}_n = Wh_n + b
$$

where:

- $x_n$ is the input token/vector at timestep $n$
- $h_{n-1}$ is the previous hidden state
- $h_n$ is the current hidden state
- $[x_n; h_{n-1}]$ denotes concatenation
- $\hat{y}_n$ is the prediction at timestep $n$

#### Intuition

An RNN adds a notion of memory by feeding the previous hidden state into the next computation. The hidden state carries information forward through the sequence.

The slide diagram shows the RNN both as:

- A recurrent cell with a loop
- An **unrolled** sequence:

$$
h_1 \rightarrow h_2 \rightarrow h_3 \rightarrow h_4 \rightarrow \cdots
$$

The unrolled recurrent network is a **directed acyclic graph**.

---

## 4.2 RNN next-word prediction example

The worked example is:

$$
p(\cdot \mid \text{There she built a})
$$

To build an RNN model for this:

1. Prepend the sentence with a start symbol:

$$
\langle s \rangle
$$

2. Formulate the input sequence as:

$$
(\langle s \rangle, \text{There}, \text{she}, \text{built}, \text{a})
$$

The RNN processes these tokens step by step:

$$
h_n = g(V[x_n; h_{n-1}] + c)
$$

The unrolled diagram shows hidden states:

$$
h_1, h_2, h_3, h_4, h_5
$$

with predictions:

$$
\hat{y}_1, \hat{y}_2, \hat{y}_3, \hat{y}_4, \hat{y}_5
$$

### Intuition

The model reads each token and updates its hidden state. The output at each step is used to predict the next token.

---

## 4.3 RNN forward pass

The slides define the total error as:

$$
E = \frac{1}{N} \sum_{n=1}^{N} E_n(x_n, \hat{y}_n)
$$

The diagram shows a forward pass through the hidden states:

$$
h_0 \rightarrow h_1 \rightarrow h_2 \rightarrow h_3 \rightarrow h_4
$$

and predictions:

$$
\hat{y}_1, \hat{y}_2, \hat{y}_3, \hat{y}_4
$$

Each prediction contributes to the total error $E$.

[UNCLEAR] The slide equation writes $E_n(x_n,\hat{y}_n)$, while the next-word prediction diagram visually suggests that the prediction at time $n$ is compared against the next token, such as $x_{n+1}$. Check the recording/transcript for whether the lecturer intended $E_n(x_{n+1},\hat{y}_n)$ or used $x_n$ as a generic target notation.

---

## 4.4 Back-Propagation Through Time

### 4.4.1 Intuition

Backpropagation in an RNN is done through the **unrolled** computation graph.

Because hidden states depend on previous hidden states, a loss at a later timestep can affect parameters and hidden states from earlier timesteps.

This is called:

$$
\text{Back-Propagation Through Time}
$$

or:

$$
\text{BPTT}
$$

The slide diagram highlights forward edges in black and backward gradient paths in red.

---

### 4.4.2 Formal gradient example

The slides show how the gradient of total error $E$ with respect to $h_2$ receives contributions from future losses.

$$
\frac{\partial E}{\partial h_2}
=
\frac{\partial E}{\partial E_2}
\frac{\partial E_2}{\partial \hat{y}_2}
\frac{\partial \hat{y}_2}{\partial h_2}
+
\frac{\partial E}{\partial E_3}
\frac{\partial E_3}{\partial \hat{y}_3}
\frac{\partial \hat{y}_3}{\partial h_3}
\frac{\partial h_3}{\partial h_2}
+
\frac{\partial E}{\partial E_4}
\frac{\partial E_4}{\partial \hat{y}_4}
\frac{\partial \hat{y}_4}{\partial h_4}
\frac{\partial h_4}{\partial h_3}
\frac{\partial h_3}{\partial h_2}
+
\cdots
$$

#### Interpretation of the terms

The first term is the local contribution from timestep 2:

$$
E_2 \rightarrow \hat{y}_2 \rightarrow h_2
$$

The second term is the contribution from timestep 3:

$$
E_3 \rightarrow \hat{y}_3 \rightarrow h_3 \rightarrow h_2
$$

The third term is the contribution from timestep 4:

$$
E_4 \rightarrow \hat{y}_4 \rightarrow h_4 \rightarrow h_3 \rightarrow h_2
$$

So the derivative at timestep $n$ depends on derivatives from later timesteps.

### Key concept

**Back-Propagation Through Time** is ordinary backpropagation applied to the unrolled RNN graph, where gradients from future timesteps flow backward through the recurrent hidden-state connections.

---

## 4.5 Truncated BPTT

### Intuition

Full BPTT propagates gradients through all future timesteps. This can be expensive for long sequences.

**Truncated BPTT** breaks dependencies after a fixed number of timesteps.

### Formal approximation from the slides

The full gradient:

$$
\frac{\partial E}{\partial h_2}
$$

is approximated by keeping only the local contribution:

$$
\frac{\partial E}{\partial h_2}
\approx
\frac{\partial E}{\partial E_2}
\frac{\partial E_2}{\partial \hat{y}_2}
\frac{\partial \hat{y}_2}{\partial h_2}
$$

The diagram marks the dependency beyond a certain point as “Truncated”.

### Key concept

Truncated BPTT reduces the length of gradient paths through time. It is computationally cheaper, but it ignores some longer-range dependencies during gradient computation.

---

## 4.6 Long-range dependencies in RNNs

The slides state that an RNN needs to discover and represent long-range dependencies.

Example:

$$
p(\text{sandcastle} \mid \text{Alice went to the beach. There she built a})
$$

The word “sandcastle” depends on earlier context:

- “Alice”
- “went”
- “beach”

The RNN can represent such dependencies in theory, but the question is whether it can learn them in practice.

---

## 4.7 Exploding and vanishing gradients

### 4.7.1 Gradient path through time

The slides consider the path of partial derivatives linking a change in $E_N$ to changes in $h_1$.

The RNN equations are:

$$
h_n = g(V[x_n; h_{n-1}] + c)
$$

$$
\hat{y}_n = Wh_n + b
$$

The gradient path is:

$$
\frac{\partial E_N}{\partial h_1}
=
\frac{\partial E_N}{\partial \hat{y}_N}
\frac{\partial \hat{y}_N}{\partial h_N}
\left(
\prod_{n \in \{N,\dots,2\}}
\frac{\partial h_n}{\partial h_{n-1}}
\right)
$$

### Intuition

To understand how a late loss $E_N$ affects an early hidden state $h_1$, we multiply many Jacobian terms together.

This repeated multiplication is the source of exploding and vanishing gradients.

---

### 4.7.2 Decomposing the recurrent weight matrix

The slides assume $V$ decomposes into two parts:

$$
V_x
$$

and

$$
V_h
$$

so that:

$$
h_n
=
g(V[x_n; h_{n-1}] + c)
$$

becomes:

$$
h_n
=
g(V_x x_n + V_h h_{n-1} + c)
$$

The slides define:

$$
z_n = V_x x_n + V_h h_{n-1} + c
$$

so:

$$
h_n = g(z_n)
$$

---

### 4.7.3 Calculating the gradients

The slide gives:

$$
\frac{\partial h_n}{\partial z_n}
=
\operatorname{diag}(g'(z_n))
$$

and:

$$
\frac{\partial z_n}{\partial h_{n-1}}
=
V_h
$$

Therefore:

$$
\frac{\partial h_n}{\partial h_{n-1}}
=
\frac{\partial h_n}{\partial z_n}
\frac{\partial z_n}{\partial h_{n-1}}
=
\operatorname{diag}(g'(z_n))V_h
$$

Substituting into the gradient path:

$$
\frac{\partial E_N}{\partial h_1}
=
\frac{\partial E_N}{\partial \hat{y}_N}
\frac{\partial \hat{y}_N}{\partial h_N}
\left(
\prod_{n \in \{N,\dots,2\}}
\frac{\partial h_n}{\partial z_n}
\frac{\partial z_n}{\partial h_{n-1}}
\right)
$$

$$
=
\frac{\partial E_N}{\partial \hat{y}_N}
\frac{\partial \hat{y}_N}{\partial h_N}
\left(
\prod_{n \in \{N,\dots,2\}}
\operatorname{diag}(g'(z_n))V_h
\right)
$$

---

### 4.7.4 Eigenvalue explanation

The slides focus on the repeated multiplication of $V_h$.

If the largest eigenvalue of $V_h$ is:

- Equal to $1$:
  - The gradient can be propagated.
- Greater than $1$:
  - The product grows exponentially.
  - The gradient explodes.
- Less than $1$:
  - The product shrinks exponentially.
  - The gradient vanishes.

### Key concept

**Exploding gradients** occur when repeated multiplication through time causes gradients to become very large.

**Vanishing gradients** occur when repeated multiplication through time causes gradients to shrink toward zero.

### Solution mentioned in the slides

The most popular solution given is to change the network architecture to include **gated units**.

The slide cites Christopher Olah’s “Understanding LSTM Networks” for this point.

---

# 5. Why move beyond RNNs?

## 5.1 Lack of parallelisability

The slides identify a major issue with RNNs:

> Forward and backward passes have $O(\text{sequence length})$ unparallelisable operations.

### Intuition

GPUs are good at doing many independent computations at once.

But in an RNN:

$$
h_n
$$

depends on:

$$
h_{n-1}
$$

So future hidden states cannot be computed before past hidden states have been computed.

This prevents full parallelisation across the sequence and inhibits training on very large datasets.

### Transition question

The slides ask:

> If not recurrence, then what? How about attention?

This motivates the move to transformers.

---

# 6. Attention

## 6.1 Attention intuition through word-sense disambiguation

The slides give two sentences:

1. “I swam across the river to get to the other bank.”
2. “I walked across the road to get cash from the bank.”

The task is to determine the appropriate interpretation of “bank”.

In the first sentence, “bank” is related to:

- “swam”
- “river”

In the second sentence, “bank” is related to:

- “cash”
- possibly “road” or “walked” as surrounding context

### Definition from the slides

**Attention** means that a neural network should attend to, or rely more heavily on, specific words from the rest of the sequence.

### Intuition

Attention allows the model to weight contextual words differently depending on which word is being interpreted.

For “bank”:

- In the river sentence, the model should give more weight to “river”.
- In the cash sentence, the model should give more weight to “cash”.

---

# 7. Input representation for transformers

## 7.1 One-hot encoding

### Definition

One-hot encoding converts words into vectors using a fixed dictionary.

If the dictionary has size $K$, then each word is represented by a vector of length $K$.

To encode the $k$-th word, we use a vector $x_n$ with:

- A $1$ in position $k$
- $0$ everywhere else

### Limitation

If the dictionary is large, the one-hot vectors are very high-dimensional.

---

## 7.2 Word embeddings

### Intuition

A word embedding maps words into a lower-dimensional vector space.

Instead of representing each word as a huge sparse one-hot vector, embeddings represent words as dense vectors.

### Formal definition from the slides

Define a matrix:

$$
E
$$

of size:

$$
D \times K
$$

where:

- $D$ is the dimensionality of the embedding space
- $K$ is the dimensionality of the dictionary

Given one-hot vector $x_n$, the embedding is:

$$
v_n = Ex_n
$$

The vector $v_n$ is the corresponding column of the embedding matrix $E$.

### Learning embeddings

The slides say embeddings can be learned, for example using word2vec.

They also note that embeddings can be:

- A preprocessing step
- Part of the overall end-to-end training process

---

## 7.3 Semantic structure in embedding space

The slides give the example:

$$
v(\text{Paris}) - v(\text{France})
\approx
v(\text{Rome}) - v(\text{Italy})
$$

This corresponds to the analogy:

> Paris is to France as Rome is to Italy.

### Key concept

Learned embedding spaces can contain semantic structure, not just arbitrary numerical encodings.

---

## 7.4 Token matrices

After embedding one sentence, we have a set of vectors:

$$
\{x_n\}
$$

where:

$$
n = 1,\dots,N
$$

and each vector has dimensionality $D$.

The vectors are called **tokens**.

A token might correspond to:

- A word
- A byte pair

The token vectors are combined into a matrix:

$$
X
$$

with dimensions:

$$
N \times D
$$

where:

- $N$ is the number of tokens
- $D$ is the number of features
- The $n$-th row is:

$$
x_n^\top
$$

So:

$$
X =
\begin{bmatrix}
x_1^\top \\
x_2^\top \\
\vdots \\
x_N^\top
\end{bmatrix}
$$

The slide diagram represents $X$ as a vertical stack of token rows, with tokens along one dimension and features along the other.

---

# 8. Self-attention

## 8.1 Goal of self-attention

The slides define the task as designing an input transformation that:

1. Takes $X$ as input
2. Outputs a transformed matrix $Y$ of the same dimensionality
3. Can be applied multiple times in succession to construct deep networks

The slide writes:

$$
Y = \operatorname{TransformerLayer}[X]
$$

The question is:

Given a set of tokens:

$$
x_1,\dots,x_N
$$

in an embedding space, how do we map them to another set:

$$
y_1,\dots,y_N
$$

with:

- The same number of tokens
- A new embedding space

---

## 8.2 Output tokens as weighted combinations of input tokens

The slide states that $y_n$ should depend not just on $x_n$, but on all input tokens:

$$
x_1,\dots,x_N
$$

For example, define:

$$
y_n
=
\sum_{m=1}^{N}
a_{nm}x_m
$$

where:

$$
a_{nm}
$$

are called **attention weights**.

### Intuition

The output token $y_n$ is a weighted mixture of all input token vectors.

The coefficients should be:

- Close to zero for input tokens that have little influence on $y_n$
- Largest for input tokens that have the most influence on $y_n$

The central question becomes:

How do we obtain the attention weights?

---

## 8.3 Values, keys, and queries in self-attention

The slides introduce self-attention using three roles:

- **Values**
- **Keys**
- **Queries**

### Values

The input vectors $x_n$ are used as **value vectors**.

Values are the vectors that span the output space and are combined to form output vectors.

In the linear-combination diagram, the values are weighted and summed to form an output token.

### Keys

The input vectors $x_n$ are also used as **key vectors**.

Keys are compared against queries to determine relevance.

### Queries

The input vector associated with an output is used as a **query vector**.

For output $y_m$, the vector $x_m$ is used as the query.

### Self-attention definition from the slides

In self-attention:

- Vectors $x_n$ are used as value vectors to create output tokens.
- Vectors $x_n$ are used directly as key vectors for input token $n$.
- Vectors $x_m$ are used as query vectors for output $y_m$.

So the same input vectors are used as:

$$
\text{queries, keys, and values}
$$

simultaneously.

---

## 8.4 Dot-product self-attention

### Similarity measure

To measure the similarity between query and key vectors, the slides use the dot product:

$$
x_n^\top x_m
$$

### Attention weights

The attention coefficients are defined using softmax:

$$
a_{nm}
=
\frac{
\exp(x_n^\top x_m)
}{
\sum_{m'=1}^{N}
\exp(x_n^\top x_{m'})
}
$$

### Intuition

For a fixed output token $n$, the model compares query $x_n$ with every key $x_m$.

The dot products are converted into normalized weights using softmax.

A larger dot product gives a larger attention weight.

### Important note about softmax

The slides explicitly say that here there is **no probabilistic interpretation** of the softmax function.

The softmax is simply used to normalize the attention weights appropriately.

---

## 8.5 Matrix form of dot-product self-attention

Using the data matrix $X$ and output matrix $Y$, the slide writes:

$$
Y = \operatorname{softmax}[XX^\top]X
$$

where:

- $XX^\top$ gives all pairwise dot products between tokens.
- $\operatorname{softmax}[L]$ takes the exponential of every element of matrix $L$, then normalizes each row independently.
- The result is multiplied by $X$, the matrix of value vectors.

## Dot-product self-attention summary

The slides identify this as dot-product self-attention:

- Same sequence determines queries, keys, and values.
- Dot product is used as the similarity measure.
- The transformation from $\{x_n\}$ to $\{y_n\}$ is fixed.
- There are no learnable parameters in this basic version.

---

# 9. Self-attention with parameters

## 9.1 Separate query, key, and value transformations

The slides then add learnable parameters by defining separate linear transformations for queries, keys, and values.

$$
Q = XW^{(q)}
$$

$$
K = XW^{(k)}
$$

$$
V = XW^{(v)}
$$

where:

$$
W^{(q)} \in \mathbb{R}^{D \times D_q}
$$

$$
W^{(k)} \in \mathbb{R}^{D \times D_k}
$$

$$
W^{(v)} \in \mathbb{R}^{D \times D_v}
$$

These matrices are learned during training.

The slides note that typically:

$$
D_k = D_q
$$

---

## 9.2 Parameterised attention formula

The attention output is:

$$
Y
=
\operatorname{softmax}[QK^\top]V
$$

The slide annotates the dimensions:

$$
QK^\top \in \mathbb{R}^{N \times N}
$$

$$
V \in \mathbb{R}^{N \times D_v}
$$

So:

$$
Y \in \mathbb{R}^{N \times D_v}
$$

## Intuition

The matrix $QK^\top$ contains similarity scores between query vectors and key vectors.

The row-wise softmax turns those scores into attention weights.

Multiplying by $V$ gives weighted combinations of value vectors.

---

## 9.3 Bias parameters

The slides state that bias parameters can be included in the linear transformations by:

- Augmenting the data matrix $X$ with an additional column
- Augmenting the weight matrices with an additional row

This allows the same matrix multiplication notation to include biases.

---

# 10. Scaled dot-product attention

## 10.1 Motivation for scaling

The slides state that gradients of the softmax function can become exponentially small for inputs of high magnitude.

They give ReLU activation as an example context where high magnitudes can occur.

To prevent this, the dot-product matrix is rescaled before applying softmax.

---

## 10.2 Variance argument

The slides state:

If the elements of the query and key vectors are all independent random variables with:

- Zero mean
- Unit variance

then the variance of the dot product will be:

$$
D_k
$$

To normalize the product, divide by the standard deviation:

$$
\sqrt{D_k}
$$

---

## 10.3 Scaled dot-product attention formula

The slide gives:

$$
Y
=
\operatorname{Attention}(Q,K,V)
=
\operatorname{softmax}
\left(
\frac{QK^\top}{\sqrt{D_k}}
\right)
V
$$

This is called:

$$
\text{scaled dot-product self-attention}
$$

## Diagram pipeline

The diagram shows the computation as:

$$
X
\rightarrow
W^{(q)}, W^{(k)}, W^{(v)}
\rightarrow
Q, K, V
$$

then:

1. Matrix multiplication:

$$
QK^\top
$$

2. Scaling:

$$
\frac{QK^\top}{\sqrt{D_k}}
$$

3. Softmax

4. Matrix multiplication with $V$

5. Output $Y$

---

# 11. Multi-head attention

## 11.1 Attention head

The slides call the attention layer described so far an **attention head**.

An attention head allows output vectors to attend to data-dependent patterns of input vectors.

---

## 11.2 Multiple heads

The slides then introduce multiple attention heads in parallel.

Purpose:

- Capture multiple patterns
- Use identically structured copies
- Give each copy independent learnable parameters

The slides compare this to filters in CNNs.

---

## 11.3 Formal definition

Suppose there are $H$ heads indexed by:

$$
h = 1,\dots,H
$$

For each head:

$$
H_h
=
\operatorname{Attention}(Q_h,K_h,V_h)
$$

The heads are concatenated:

$$
\operatorname{Concat}[H_1,\dots,H_H]
$$

Then the result is linearly transformed using:

$$
W^{(o)}
$$

The final output is:

$$
Y(X)
=
\operatorname{Concat}[H_1,\dots,H_H]W^{(o)}
$$

## Diagram interpretation

The slide diagram shows:

$$
X
$$

feeding into several parallel self-attention blocks, then:

$$
\text{concat}
\rightarrow
\text{linear}
\rightarrow
Y
$$

---

# 12. Other layers in transformers

The lecture then moves from attention alone to full transformer layers.

The slides refer to the architecture from Vaswani et al. 2017.

---

## 12.1 Residual connections and layer normalization

### Post-norm form

The slides write:

$$
Z
=
\operatorname{LayerNorm}[Y(X)+X]
$$

where:

- $Y(X)$ is the output of the attention block
- $X$ is added through a residual connection
- Layer normalization is applied after the residual addition

### Pre-norm form

The slides say pre-norm can replace this and is more effective:

$$
Z
=
Y(X') + X
$$

where:

$$
X'
=
\operatorname{LayerNorm}[X]
$$

### Intuition

Residual connections allow information to bypass the attention block.

Layer normalization improves training stability and efficiency.

---

## 12.2 Feedforward layers

The slides state that nonlinearity enters through attention weights via the softmax function.

However, the output vectors are still constrained to lie in the subspace spanned by the input vectors. This limits the expressive capabilities of the attention layer.

To address this, each layer post-processes its output using a standard nonlinear neural network:

$$
FF[\cdot]
$$

also sometimes called:

$$
MLP[\cdot]
$$

This network has:

- $D$ inputs
- $D$ outputs

## Post-norm feedforward formula

The slides write:

$$
\tilde{X}
=
\operatorname{LayerNorm}[FF[Z]+Z]
$$

## Shared network

The same shared network is applied to each output vector.

## Pre-norm feedforward formula

The pre-norm form is:

$$
\tilde{X}
=
FF[Z'] + Z
$$

where:

$$
Z'
=
\operatorname{LayerNorm}[Z]
$$

---

## 12.3 Positional encoding

### 12.3.1 Why position is needed

The slides state that the matrices:

$$
W_h^{(q)}, W_h^{(k)}, W_h^{(v)}
$$

are shared across input tokens.

Therefore, permuting the order of input tokens, meaning permuting the rows of $X$, results in the same permutation of the rows of the output matrix:

$$
\tilde{X}
$$

So the transformer is **equivariant with respect to input permutations**.

## Key concept: equivariance

### Intuition

If a model is permutation equivariant, then reordering the input tokens causes the output tokens to be reordered in the same way.

The model does not inherently know that one word came before another.

## Why this is a problem

The slides give two sentences:

1. “The food was bad, not good at all!”
2. “The food was good, not bad at all!”

They contain the same tokens but have very different meanings.

Therefore, token order is crucial for most sequential processing tasks.

---

### 12.3.2 Adding positional information

To include order, construct a position encoding vector:

$$
r_n
$$

associated with each input position $n$.

The slides consider two options:

1. Concatenate $r_n$ with $x_n$
   - This increases dimensionality.
2. Add the position vector to the token vector:

$$
\tilde{x}_n
=
x_n + r_n
$$

The slides use the second option.

Residual connections allow positional information to be passed from one transformer layer to the next.

---

### 12.3.3 Sinusoidal positional encoding

The slides give sinusoidal positional encoding as a bounded relative-position method.

For a given position $n$, the associated position-encoding vector has components:

$$
r_{ni}
=
\begin{cases}
\sin\left(\frac{n}{L^{i/D}}\right), & \text{if } i \text{ is even} \\[6pt]
\cos\left(\frac{n}{L^{(i-1)/D}}\right), & \text{if } i \text{ is odd}
\end{cases}
$$

The slide diagram shows sinusoidal curves across embedding dimensions, with positions $n$ and $m$ marked.

The slides state that encoding at:

$$
n+k
$$

can be represented as a linear combination of encoding at:

$$
n
$$

where the coefficients do not depend on the absolute position, but only on:

$$
k
$$

[UNCLEAR] The formula is visually readable on the slide as powers of $L$, but the transcript/parser may garble the exponent formatting. Check the recording if the lecturer explained the constant $L$, the indexing convention for even/odd $i$, or the exact denominator.

---

# 13. Encoder-decoder transformer architecture

The slides repeatedly show the full transformer architecture from Vaswani et al. 2017.

## Encoder side

The encoder diagram contains repeated blocks with:

1. Multi-head attention
2. Add & Norm
3. Feed Forward
4. Add & Norm

The input side also includes:

- Input embedding
- Positional encoding

The encoder is repeated $N_x$ times in the diagram.

## Decoder side

The decoder diagram contains repeated blocks with:

1. Masked multi-head attention
2. Add & Norm
3. Multi-head attention
4. Add & Norm
5. Feed Forward
6. Add & Norm

The decoder also includes:

- Output embedding
- Positional encoding
- Linear layer
- Softmax to produce output probabilities

---

# 14. Encoder transformers

## 14.1 General encoder definition

The slide defines an encoder as taking sequences as input and producing fixed-length vectors.

[UNCLEAR] The BERT diagrams also show token-level outputs such as $T_1,\dots,T_N$ and a special class output $C$. Check the transcript for exactly how the lecturer described “fixed-length vectors” here.

---

## 14.2 BERT: Bidirectional Encoder Representations from Transformers

### Definition

BERT stands for:

$$
\text{Bidirectional Encoder Representations from Transformers}
$$

## Training idea

The slides describe BERT as:

1. Pre-training a language model using a large corpus of text
2. Fine-tuning the model using transfer learning for many downstream tasks
3. Using smaller application-specific datasets for fine-tuning

---

## 14.3 BERT masked-token training

### Procedure

The slides describe the training procedure:

- Randomly choose a subset of tokens, say 15%.
- Replace them with a special token:

$$
\langle \text{mask} \rangle
$$

- Train the model to predict the missing tokens at the corresponding output nodes.
- This is self-supervised learning.

## Worked example

Original input:

> I swam across the river to get to the other bank.

Masked input:

> I $\langle \text{mask} \rangle$ across the river to get to the $\langle \text{mask} \rangle$ bank.

The model must predict the masked tokens.

---

## 14.4 Meaning of “bidirectional”

The term **bidirectional** refers to the fact that the network sees words both before and after the masked word.

So it can use both left context and right context to make a prediction.

For example, when predicting a masked word in the middle of a sentence, BERT can use:

- Tokens before the mask
- Tokens after the mask

---

## 14.5 BERT’s 15% masking rule

The slides give the practical masking details:

Of the 15% randomly selected tokens:

- 80% are replaced with:

$$
\langle \text{mask} \rangle
$$

- 10% are replaced with a word selected at random from the vocabulary.
- 10% are retained unchanged.

However, all selected tokens still have to be correctly predicted at the output.

---

## 14.6 BERT as a paradigm shift

The slides state that this use of self-supervised learning led to a paradigm shift:

1. A large model is first pre-trained using unlabelled data.
2. The model is later fine-tuned using supervised learning.
3. Fine-tuning uses a much smaller labelled dataset.

---

## 14.7 BERT input representation

The slide example input is:

$$
[\text{CLS}]
\ \text{my}
\ \text{dog}
\ \text{is}
\ \text{cute}
\ [\text{SEP}]
\ \text{he}
\ \text{likes}
\ \text{play}
\ \#\#\text{ing}
\ [\text{SEP}]
$$

The representation is the sum of:

1. Token embeddings
2. Segment embeddings
3. Position embeddings

### Token embeddings

Each token gets a token embedding, for example:

$$
E_{[\text{CLS}]}, E_{\text{my}}, E_{\text{dog}}, \dots
$$

### Segment embeddings

The first segment uses:

$$
E_A
$$

The second segment uses:

$$
E_B
$$

In the diagram:

- Segment A covers `[CLS] my dog is cute [SEP]`
- Segment B covers `he likes play ##ing [SEP]`

### Position embeddings

Positions are represented by:

$$
E_0, E_1, E_2, \dots, E_{10}
$$

Each token receives a position embedding according to its position in the sequence.

---

## 14.8 BERT pre-training and fine-tuning diagram

The slide shows BERT pre-training using:

- Masked sentence A
- Masked sentence B
- Unlabelled sentence A and B pair

The pre-training tasks shown are:

- NSP
- Mask LM
- Mask LM

Then fine-tuning is shown on tasks such as:

- SQuAD
- MNLI
- NER

For question answering, the diagram shows prediction of a:

- Start span
- End span

---

## 14.9 BERT downstream task formats

The slide shows four downstream formats.

### Sentence-pair classification

Tasks listed:

- MNLI
- QQP
- QNLI
- STS-B
- MRPC
- RTE
- SWAG

The diagram uses a class label from the special output $C$.

### Single-sentence classification

Tasks listed:

- SST-2
- CoLA

Again, the diagram uses a class label from $C$.

### Question answering

Task listed:

- SQuAD v1.1

The diagram predicts:

- Start span
- End span

over the paragraph.

### Single-sentence tagging

Task listed:

- CoNLL-2003 NER

The diagram shows token-level labels such as:

- $O$
- $B$-PER

---

# 15. Vision transformers

The slides introduce vision transformers as an encoder-transformer application.

## Procedure

A vision transformer:

1. Slices an image into patches.
2. Embeds all patches to form tokens.
3. Applies encoder transformers with pre-training.

## Diagram details

The Vision Transformer diagram shows:

1. Image split into patches
2. Linear projection of flattened patches
3. Extra learnable `[class]` embedding
4. Patch + position embedding
5. Transformer encoder
6. MLP head
7. Class output, such as:
   - Bird
   - Ball
   - Car

The encoder block diagram shows repeated layers with:

- Norm
- Multi-head attention
- Residual connection
- Norm
- MLP
- Residual connection

---

# 16. Decoder transformers

## 16.1 Decoder definition

The slides define a decoder as being used for generative models that create output sequences of tokens.

---

## 16.2 Autoregressive model

### Definition

An autoregressive model generates a sequence one token at a time.

The slides describe the procedure:

1. Take as input a sequence consisting of the first $n-1$ tokens.
2. The output represents the conditional distribution for token $n$.
3. Draw a sample from this distribution.
4. Extend the sequence to $n$ tokens.
5. Feed the new sequence back through the model.
6. Get a distribution over token $n+1$.

### Formal idea

At step $n$, the model estimates:

$$
p(x_n \mid x_1,\dots,x_{n-1})
$$

Then the generated $x_n$ becomes part of the input context for predicting the next token.

---

## 16.3 GPT: Generative Pre-trained Transformers

The slides define GPT as a decoder-transformer architecture.

## Shifted input sequence

The slides state:

- Shift the input sequence to the right by one step.
- $x_n$ corresponds to $y_{n+1}$.
- The target is $x_{n+1}$.
- Prepend a special token:

$$
\langle \text{start} \rangle
$$

in the first position of the input sequence.

## Causal attention

The slides define causal attention as:

- Set to zero all attention weights of any later token in the sequence.
- This is done by setting corresponding pre-activation values to:

$$
-\infty
$$

before softmax.

### Intuition

A decoder should not use future tokens when predicting the next token.

The slide diagram contrasts:

- **Causal attention**
  - Each token can only attend to earlier/current context.
- **Full attention**
  - Tokens can attend across the whole sequence.

---

## 16.4 GPT architecture diagram

The GPT diagram shows:

1. Input
2. Input embedding
3. Positional encoding
4. Transformer block layer 1
5. Transformer block layer …
6. Transformer block layer $L$
7. LayerNorm
8. Linear
9. Softmax
10. Output

Inside a transformer block, the diagram shows:

- Multi-head masked attention with heads $1,\dots,H$
- Mask
- Softmax
- Dropout
- Matrix multiplication
- Linear projections
- LayerNorm
- Residual connections
- A feedforward part with:
  - Linear
  - GELU
  - Linear
  - Dropout

[UNCLEAR] The slide is a high-level architecture image and does not give equations for the full GPT block. The transcript may contain additional explanation of the block internals.

---

# 17. Generating the next token

The slides ask:

> How to generate the next token?

They introduce sampling schemes.

---

## 17.1 Greedy search

### Definition from the slides

Greedy search simply selects tokens with the highest probability.

## Worked visual example

The diagram begins with the prompt:

> The

The next-token probabilities shown include:

- dog: $0.4$
- nice: $0.5$
- car: $0.1$

Greedy search selects:

$$
\text{nice}
$$

because:

$$
0.5
$$

is the highest probability.

The diagram then continues down the highest-probability local path.

### Key idea

Greedy search makes the best local choice at each step.

---

## 17.2 Beam search

### Definition from the slides

Beam search maintains a set of $B$ hypotheses, where $B$ is called the **beam width**.

Each hypothesis consists of a sequence up to step:

$$
n+B
$$

The method selects tokens with the highest total probability of the extended sequences.

[UNCLEAR] The phrase “up to step $n+B$” appears on the slide. Check the transcript, because this may be a wording or slide typo.

## Worked visual example

The same generation tree shows that a locally high-probability first word does not always produce the highest total sequence probability.

From the diagram:

- “The nice …” starts with probability $0.5$
- “The dog …” starts with probability $0.4$

But after extension:

- dog $\rightarrow$ has has probability $0.9$
- nice $\rightarrow$ woman has probability $0.4$
- nice $\rightarrow$ house has probability $0.3$
- nice $\rightarrow$ guy has probability $0.3$

So beam search considers extended sequence probabilities rather than only the immediate next-token probability.

### Key idea

Beam search keeps multiple candidate continuations rather than committing immediately to one greedy path.

---

# 18. Sequence-to-sequence transformers

## 18.1 Seq2seq task

The slides introduce sequence-to-sequence modelling using translation.

Example task:

> Translating an English sentence into a Dutch sentence.

---

## 18.2 Encoder-decoder procedure

The slides describe the procedure:

1. Use an encoder transformer to map the input token sequence into an internal representation:

$$
Z
$$

2. Use a decoder transformer to generate the Dutch output sequence token by token.

3. Condition the output on the entire input sequence corresponding to the English sentence.

---

## 18.3 Cross-attention

### Definition

The slides define cross-attention as combining encoder and decoder.

To incorporate $Z$ into the decoder, the decoder uses cross-attention.

### Query, key, and value sources

In cross-attention:

- Query vectors come from the sequence being generated, i.e. from the decoder.
- Key vectors come from the encoder representation $Z$.
- Value vectors come from the encoder representation $Z$.

So:

$$
Q \leftarrow \text{decoder}
$$

$$
K,V \leftarrow \text{encoder representation } Z
$$

## Diagram interpretation

The decoder block shown in the slide has:

1. Masked multi-head self-attention over the decoder input $X$
2. Add & norm
3. Multi-head cross-attention using:
   - $Q$ from decoder
   - $K,V$ from encoder representation $Z$
4. Add & norm
5. MLP
6. Add & norm
7. Output $\tilde{X}$

---

# 19. Full transformer recap

The final full-transformer slide returns to the encoder-decoder architecture.

## Encoder

The encoder takes input embeddings plus positional encodings and applies repeated layers of:

$$
\text{Multi-head attention}
\rightarrow
\text{Add \& Norm}
\rightarrow
\text{Feed Forward}
\rightarrow
\text{Add \& Norm}
$$

## Decoder

The decoder takes shifted output embeddings plus positional encodings and applies repeated layers of:

$$
\text{Masked multi-head attention}
\rightarrow
\text{Add \& Norm}
\rightarrow
\text{Multi-head attention}
\rightarrow
\text{Add \& Norm}
\rightarrow
\text{Feed Forward}
\rightarrow
\text{Add \& Norm}
$$

Then:

$$
\text{Linear}
\rightarrow
\text{Softmax}
\rightarrow
\text{Output probabilities}
$$

---

# 20. Key concepts summary

## Language model

A model assigning probabilities to word sequences.

Formal definition:

$$
\sum_{x \in \Sigma^*} p(x)=1
$$

The chain rule decomposes sequence probability into next-token conditional probabilities.

---

## Next-word prediction

A language modelling objective where the model predicts:

$$
p(x_n \mid x_1,\dots,x_{n-1})
$$

This simple objective requires modelling syntax, semantics, context, and world knowledge.

---

## Recurrent Neural Network

A network whose hidden state depends on both the current input and the previous hidden state:

$$
h_n = g(V[x_n;h_{n-1}]+c)
$$

$$
\hat{y}_n = Wh_n+b
$$

RNNs process sequences step by step and carry information through hidden states.

---

## Back-Propagation Through Time

Backpropagation through an unrolled recurrent network.

Gradients at timestep $n$ depend on future timesteps because later losses depend on earlier hidden states.

---

## Truncated BPTT

An approximation to BPTT that breaks dependencies after a fixed number of timesteps.

This reduces computational cost but removes some long-range gradient dependencies.

---

## Exploding/vanishing gradients

The repeated multiplication of recurrent Jacobians causes gradients to grow or shrink exponentially.

The slides focus on repeated multiplication involving $V_h$. If the largest eigenvalue of $V_h$ is:

- $=1$: gradients can propagate
- $>1$: gradients explode
- $<1$: gradients vanish

---

## Attention

A mechanism where a model relies more heavily on selected tokens from the rest of the sequence.

In self-attention, each token can attend to other tokens in the same sequence.

---

## Self-attention

Maps input token vectors:

$$
x_1,\dots,x_N
$$

to output token vectors:

$$
y_1,\dots,y_N
$$

using weighted sums:

$$
y_n=\sum_{m=1}^{N} a_{nm}x_m
$$

The weights $a_{nm}$ determine how much token $m$ influences output token $n$.

---

## Dot-product self-attention

Uses dot products to compute similarity:

$$
x_n^\top x_m
$$

and softmax to normalize attention weights:

$$
a_{nm}
=
\frac{
\exp(x_n^\top x_m)
}{
\sum_{m'=1}^{N}
\exp(x_n^\top x_{m'})
}
$$

Matrix form:

$$
Y=\operatorname{softmax}[XX^\top]X
$$

---

## Parameterised self-attention

Uses learned projections:

$$
Q=XW^{(q)}, \qquad K=XW^{(k)}, \qquad V=XW^{(v)}
$$

and computes:

$$
Y=\operatorname{softmax}[QK^\top]V
$$

---

## Scaled dot-product attention

Rescales dot products before softmax:

$$
\operatorname{Attention}(Q,K,V)
=
\operatorname{softmax}
\left(
\frac{QK^\top}{\sqrt{D_k}}
\right)
V
$$

Scaling prevents softmax gradients from becoming too small when dot products have high magnitude.

---

## Multi-head attention

Runs multiple attention heads in parallel:

$$
H_h=\operatorname{Attention}(Q_h,K_h,V_h)
$$

then combines them:

$$
Y(X)=\operatorname{Concat}[H_1,\dots,H_H]W^{(o)}
$$

Different heads can capture different patterns.

---

## Positional encoding

Adds position information to token embeddings:

$$
\tilde{x}_n=x_n+r_n
$$

This is needed because self-attention without positional information is permutation equivariant.

---

## Encoder transformer

Processes an input sequence into representations. BERT is an encoder-transformer model trained using masked-token prediction and then fine-tuned for downstream tasks.

---

## Decoder transformer

Generates output tokens autoregressively. GPT is a decoder-transformer model that uses causal attention.

---

## Causal attention

Prevents a decoder from attending to future tokens by setting later-token pre-activation values to:

$$
-\infty
$$

before softmax.

---

## Cross-attention

Combines encoder and decoder in seq2seq models.

Queries come from the decoder; keys and values come from the encoder representation $Z$.

---

# 21. Worked examples preserved from the slides

## Example 1: Comparing sentence probabilities

$$
p(\text{he likes apples}) > p(\text{apples likes he})
$$

Used to show that language models compare word orderings.

---

## Example 2: Speech-recognition-style word choice

$$
p(\text{he likes apples}) > p(\text{he licks apples})
$$

Used to show that language models help choose between plausible alternatives.

---

## Example 3: Next-word prediction with context

Without context:

$$
p(\cdot \mid \text{There she built a})
$$

With context:

$$
p(\cdot \mid \text{Alice went to the beach. There she built a})
$$

Likely completion highlighted:

$$
\text{sandcastle}
$$

---

## Example 4: RNN input construction

Original phrase:

> There she built a

RNN input sequence after prepending start token:

$$
(\langle s\rangle,\text{There},\text{she},\text{built},\text{a})
$$

---

## Example 5: Attention and “bank”

Sentence 1:

> I swam across the river to get to the other bank.

Sentence 2:

> I walked across the road to get cash from the bank.

Used to show that attention should weight context words differently depending on the intended meaning of “bank”.

---

## Example 6: Word embedding analogy

$$
v(\text{Paris})-v(\text{France})
\approx
v(\text{Rome})-v(\text{Italy})
$$

Used to show semantic structure in embedding space.

---

## Example 7: Positional encoding and word order

Sentence 1:

> The food was bad, not good at all!

Sentence 2:

> The food was good, not bad at all!

Used to show that token order changes meaning even when the same tokens are present.

---

## Example 8: BERT masked language modelling

Original:

> I swam across the river to get to the other bank.

Masked:

> I $\langle\text{mask}\rangle$ across the river to get to the $\langle\text{mask}\rangle$ bank.

Used to show BERT’s self-supervised masked-token prediction task.

---

## Example 9: BERT input representation

Input:

$$
[\text{CLS}]
\ \text{my}
\ \text{dog}
\ \text{is}
\ \text{cute}
\ [\text{SEP}]
\ \text{he}
\ \text{likes}
\ \text{play}
\ \#\#\text{ing}
\ [\text{SEP}]
$$

Representation combines:

- Token embeddings
- Segment embeddings
- Position embeddings

---

## Example 10: Vision transformer patches

The image is sliced into patches. Each patch is embedded as a token. A transformer encoder processes the patch tokens, and an MLP head predicts a class such as bird, ball, or car.

---

## Example 11: Greedy search

Prompt:

> The

Next-token probabilities include:

- dog: $0.4$
- nice: $0.5$
- car: $0.1$

Greedy search chooses:

$$
\text{nice}
$$

because it has the highest immediate probability.

---

## Example 12: Beam search

The same tree shows that another path, such as starting with “dog”, may have a better extended sequence probability after considering later tokens.

Beam search keeps multiple hypotheses and selects according to total extended sequence probability.

---

## Example 13: Seq2seq translation

Task:

> Translate an English sentence into a Dutch sentence.

Procedure:

1. Encoder maps English input to representation $Z$.
2. Decoder generates Dutch output token by token.
3. Cross-attention conditions the output on the English input representation.

---

# 22. Connections to other material and applications

## Connection to previous neural-network material

The RNN section extends feedforward networks by adding a recurrent dependency:

Feedforward:

$$
h=g(Vx+c)
$$

RNN:

$$
h_n=g(V[x_n;h_{n-1}]+c)
$$

Backpropagation is extended to **Back-Propagation Through Time** by unrolling the recurrent network.

---

## Connection between RNN limitations and transformers

RNNs suffer from:

- Sequential computation
- Lack of parallelisability
- Exploding/vanishing gradients

The transformer section is motivated as an alternative based on attention rather than recurrence.

---

## Connection to NLP applications

The lecture connects language modelling and transformers to:

- Translation
- Speech recognition
- Word-sense disambiguation
- BERT downstream tasks
- GPT-style generation
- Sequence-to-sequence modelling

---

## Connection to computer vision

The Vision Transformer section connects transformer encoders to image classification by treating image patches as tokens.

---

## Research references mentioned in the slides

The slides cite or refer to:

- word2vec / efficient word representations
- Understanding LSTM Networks
- Vaswani et al. 2017 transformer paper
- BERT paper by Devlin et al. 2018
- GPT architecture diagram source
- Hugging Face generation example

---

# 23. Unclear sections to revisit in the recording/transcript

- [UNCLEAR] The transcript was not included in the chat. Any spoken exam flags, lecturer emphasis, extra examples, or derivations cannot be recovered from the slides alone.
- [UNCLEAR] The RNN loss equation on the forward-pass slide writes $E_n(x_n,\hat{y}_n)$, but the next-word prediction diagram appears to compare $\hat{y}_n$ against the next token. Check whether the intended target is $x_n$ or $x_{n+1}$.
- [UNCLEAR] The sinusoidal positional encoding formula should be checked in the recording for the exact exponent formatting and the definition of $L$.
- [UNCLEAR] The beam search slide says each hypothesis consists of a sequence up to step $n+B$. Check the lecturer’s explanation, because this wording may be imprecise.
- [UNCLEAR] The encoder slide says the encoder “takes sequences as input and produces fixed-length vectors,” while BERT diagrams show both class-level and token-level outputs. Check whether the lecturer distinguished these cases.
- [UNCLEAR] The GPT architecture slide is mainly diagrammatic. If the lecturer gave equations or explained the block internals in speech, those are not present in the slides.
- [UNCLEAR] Several slide typos appear, such as “encodding,” “Weigthed,” “direcly,” “elemnt,” “magnitde,” and “textended.” These are spelling/formatting issues, but check the transcript if any corresponding technical term is garbled.

