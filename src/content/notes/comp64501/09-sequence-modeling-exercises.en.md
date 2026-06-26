---
subject: COMP64501
chapter: 9
title: "Sequence Modeling — Exercise Solutions"
language: en
---

# Sequence Modelling — Structured Study Notes

**Source used:** `ExerciseSheet_sequence_model_with_solutions (1).pdf`  
**Note:** Only the uploaded exercise sheet with solutions was available in this conversation. No separate lecture transcript or slide deck was provided, so these notes are grounded in the available PDF and its rendered page images.

---

## Topic and scope

**Course:** [not provided]  
**Lecture / revision topic:** Sequence modelling — self-attention scaling, sinusoidal positional encodings, BERT parameter counting, and RNN training via BPTT vs Real-Time Recurrent Learning.

This material sits in the broader sequence-modelling part of neural networks, especially Transformer models and recurrent neural networks. The sheet is exercise-based, so the notes are organised around the four worked problems.

---

# 1. Scaling factor in self-attention

## 1.1 Problem setup

We consider two independent random vectors

$$
a, b \in \mathbb{R}^D
$$

where each vector is drawn from a Gaussian distribution with zero mean and identity covariance:

$$
a, b \sim \mathcal{N}(0, I).
$$

The task is to show that

$$
\mathbb{E}\left[(a^\top b)^2\right] = D.
$$

This is relevant to self-attention because dot products between query and key vectors can grow in magnitude with dimensionality. The exercise establishes that the variance-scale of the dot product increases with $D$.

---

## 1.2 Key concept: dot-product scale

### Intuition

The dot product

$$
a^\top b
$$

is a sum of $D$ random products:

$$
a^\top b = \sum_{i=1}^{D} a_i b_i.
$$

Even though each product $a_i b_i$ has mean zero, the squared dot product does not average to zero. Instead, the expected squared magnitude accumulates one unit of contribution from each dimension, giving total expected squared size $D$.

### Formal target

Show:

$$
\mathbb{E}\left[(a^\top b)^2\right] = D.
$$

---

## 1.3 Derivation

Start with

$$
a^\top b = \sum_{i=1}^{D} a_i b_i.
$$

Then square it:

$$
(a^\top b)^2
=
\left(\sum_{i=1}^{D} a_i b_i\right)^2.
$$

Expanding the square gives

$$
(a^\top b)^2
=
\sum_{i=1}^{D} (a_i b_i)^2
+
2 \sum_{i \neq j} (a_i b_i)(a_j b_j).
$$

Taking expectations:

$$
\mathbb{E}\left[(a^\top b)^2\right]
=
\sum_{i=1}^{D} \mathbb{E}\left[(a_i b_i)^2\right]
+
2 \sum_{i \neq j}
\mathbb{E}\left[(a_i b_i)(a_j b_j)\right].
$$

Because $a$ and $b$ are independent Gaussian random vectors with unit variance:

$$
\mathbb{E}\left[(a_i b_i)^2\right]
=
\mathbb{E}[a_i^2]\mathbb{E}[b_i^2].
$$

Since each component has unit variance,

$$
\mathbb{E}[a_i^2] = 1,
\qquad
\mathbb{E}[b_i^2] = 1.
$$

Therefore

$$
\mathbb{E}\left[(a_i b_i)^2\right] = 1.
$$

So the diagonal terms contribute

$$
\sum_{i=1}^{D} 1 = D.
$$

For the cross terms, when $i \neq j$,

$$
\mathbb{E}\left[(a_i b_i)(a_j b_j)\right]
=
\mathbb{E}[a_i]\mathbb{E}[b_i]\mathbb{E}[a_j]\mathbb{E}[b_j].
$$

Each component has zero mean, so

$$
\mathbb{E}[a_i] =
\mathbb{E}[b_i] =
\mathbb{E}[a_j] =
\mathbb{E}[b_j] = 0.
$$

Therefore

$$
\mathbb{E}\left[(a_i b_i)(a_j b_j)\right] = 0.
$$

Thus,

$$
\mathbb{E}\left[(a^\top b)^2\right]
=
D + 0
=
D.
$$

---

## 1.4 Worked answer

$$
\boxed{
\mathbb{E}\left[(a^\top b)^2\right] = D
}
$$

The expected squared dot product grows linearly with the vector dimension.

---

## 1.5 [UNCLEAR] transcription / PDF issue

The solution text in the PDF writes

$$
\mathbb{E}[a^\top b] = D
$$

at one point, but the exercise asks for

$$
\mathbb{E}\left[(a^\top b)^2\right].
$$

So this should be read as a notation error in the solution: the intended quantity is the expected squared dot product.

There is also a likely typo in one of the cross terms in the parsed text, where it appears as something like

$$
\mathbb{E}[(a_i b_i)(a_j b_i)]
$$

but the expansion should involve

$$
\mathbb{E}[(a_i b_i)(a_j b_j)].
$$

---

# 2. Sinusoidal positional encoding

## 2.1 Problem setup

The exercise asks to show that sinusoidal positional encodings have the following property:

For a fixed offset $k$, the encoding at position $n+k$ can be represented as a linear combination of the encoding at position $n$, where the coefficients depend only on $k$, not on $n$.

It also asks to show that this property fails if the encoding is based only on sine functions, without cosine functions.

---

## 2.2 Key concept: sinusoidal positional encoding

### Intuition

A sequence model needs to know where tokens occur in a sequence. Sinusoidal positional encodings assign each position a vector made from sine and cosine waves at different frequencies.

The important property in this exercise is that shifting position by $k$ can be expressed using a fixed linear transformation. In other words, once the model knows the encoding at position $n$, the encoding at position $n+k$ can be obtained by mixing the sine and cosine components using coefficients depending only on $k$.

This matters because it gives the encoding a clean way to represent relative offsets.

### Formal definition from the exercise

The encoding at position $n$ is given componentwise by

$$
r_{ni}
=
\begin{cases}
\sin\left(\frac{n}{L^{i/D}}\right), & \text{if } i \text{ is even}, \\
\cos\left(\frac{n}{L^{(i-1)/D}}\right), & \text{if } i \text{ is odd}.
\end{cases}
$$

The encoding at position $n+k$ is

$$
r_{(n+k)i}
=
\begin{cases}
\sin\left(\frac{n+k}{L^{i/D}}\right), & \text{if } i \text{ is even}, \\
\cos\left(\frac{n+k}{L^{(i-1)/D}}\right), & \text{if } i \text{ is odd}.
\end{cases}
$$

The rendered formula box on page 2 confirms this sine/cosine pairing across even and odd dimensions.

---

## 2.3 Trigonometric identities used

The exercise explicitly gives the identities

$$
\cos(A+B) = \cos A \cos B - \sin A \sin B
$$

and

$$
\sin(A+B) = \sin A \cos B + \cos A \sin B.
$$

These are the key tools for proving that the shifted encoding can be expressed as a linear combination of the original encoding.

---

## 2.4 Derivation for even index $i$

For even $i$, the positional encoding uses sine:

$$
r_{(n+k)i}
=
\sin\left(\frac{n+k}{L^{i/D}}\right).
$$

Rewrite the argument as a sum:

$$
\frac{n+k}{L^{i/D}}
=
\frac{n}{L^{i/D}}
+
\frac{k}{L^{i/D}}.
$$

Now apply

$$
\sin(A+B) = \sin A \cos B + \cos A \sin B.
$$

Let

$$
A = \frac{n}{L^{i/D}},
\qquad
B = \frac{k}{L^{i/D}}.
$$

Then

$$
\sin\left(\frac{n+k}{L^{i/D}}\right)
=
\sin\left(\frac{n}{L^{i/D}}\right)
\cos\left(\frac{k}{L^{i/D}}\right)
+
\cos\left(\frac{n}{L^{i/D}}\right)
\sin\left(\frac{k}{L^{i/D}}\right).
$$

The first term is the position-$n$ encoding at dimension $i$:

$$
\sin\left(\frac{n}{L^{i/D}}\right)
=
\operatorname{Pos}(n,i).
$$

The second term uses the paired cosine dimension. According to the solution, this is treated as the position-$n$ encoding at dimension $i+1$:

$$
\cos\left(\frac{n}{L^{i/D}}\right)
=
\operatorname{Pos}(n,i+1).
$$

Therefore,

$$
\sin\left(\frac{n+k}{L^{i/D}}\right)
=
\cos\left(\frac{k}{L^{i/D}}\right)\operatorname{Pos}(n,i)
+
\sin\left(\frac{k}{L^{i/D}}\right)\operatorname{Pos}(n,i+1).
$$

So for even $i$:

$$
\boxed{
\operatorname{Pos}(n+k,i)
=
\cos\left(\frac{k}{L^{i/D}}\right)\operatorname{Pos}(n,i)
+
\sin\left(\frac{k}{L^{i/D}}\right)\operatorname{Pos}(n,i+1)
}
$$

The coefficients

$$
\cos\left(\frac{k}{L^{i/D}}\right),
\qquad
\sin\left(\frac{k}{L^{i/D}}\right)
$$

depend on $k$ and $i$, but not on $n$.

---

## 2.5 Derivation for odd index $i$

For odd $i$, the positional encoding uses cosine:

$$
r_{(n+k)i}
=
\cos\left(\frac{n+k}{L^{(i-1)/D}}\right).
$$

Rewrite:

$$
\frac{n+k}{L^{(i-1)/D}}
=
\frac{n}{L^{(i-1)/D}}
+
\frac{k}{L^{(i-1)/D}}.
$$

Apply

$$
\cos(A+B) = \cos A \cos B - \sin A \sin B.
$$

Let

$$
A = \frac{n}{L^{(i-1)/D}},
\qquad
B = \frac{k}{L^{(i-1)/D}}.
$$

Then

$$
\cos\left(\frac{n+k}{L^{(i-1)/D}}\right)
=
\cos\left(\frac{n}{L^{(i-1)/D}}\right)
\cos\left(\frac{k}{L^{(i-1)/D}}\right)
-
\sin\left(\frac{n}{L^{(i-1)/D}}\right)
\sin\left(\frac{k}{L^{(i-1)/D}}\right).
$$

The first term is

$$
\operatorname{Pos}(n,i).
$$

The paired sine term is treated as

$$
\operatorname{Pos}(n,i-1).
$$

Therefore,

$$
\boxed{
\operatorname{Pos}(n+k,i)
=
\cos\left(\frac{k}{L^{(i-1)/D}}\right)\operatorname{Pos}(n,i)
-
\sin\left(\frac{k}{L^{(i-1)/D}}\right)\operatorname{Pos}(n,i-1)
}
$$

Again, the coefficients depend only on $k$ and the dimension index, not on $n$.

---

## 2.6 Main result

For fixed offset $k$, the encoding at position $n+k$ can be represented as a linear combination of the encoding at position $n$.

The reason this works is that every sine component has a paired cosine component at the same frequency, and vice versa. A shift in the input of a sine or cosine can be represented by mixing sine and cosine at that same frequency.

---

## 2.7 Why sine-only encodings do not have the same property

If the encoding uses only sine functions, then the shifted sine term becomes

$$
\sin(A+B)
=
\sin A \cos B + \cos A \sin B.
$$

The shifted sine requires both $\sin A$ and $\cos A$. If the representation contains only sine terms, then the required cosine component is missing.

Therefore, with sine-only encodings, there is no way to express the shifted encoding as the same kind of linear combination using the available encoding components. The PDF states this as: if the encoding is purely sine or purely cosine, there is no way to represent sine as a linear combination of cosine, or the other way around.

---

## 2.8 [UNCLEAR] notation issue

The parsed PDF shows expressions like

$$
L i/D
$$

but the rendered equation on page 2 appears to indicate exponent notation:

$$
L^{i/D}
$$

and

$$
L^{(i-1)/D}.
$$

I have used the exponent form because it matches the rendered formula structure on the page image.

---

# 3. BERT-large parameter counting

## 3.1 Problem setup

The exercise considers a BERT-large encoder Transformer language model with:

$$
\text{maximum input length} = 512
$$

$$
D = 1024
$$

$$
\text{vocabulary size} = 30{,}000
$$

$$
\text{number of Transformer layers} = 24
$$

$$
\text{number of self-attention heads per layer} = 16
$$

$$
D_q = D_k = D_v = 64
$$

The position-wise MLP networks have two layers with

$$
4096
$$

hidden nodes. The task is to show that the total number of parameters is approximately 340 million.

---

## 3.2 Key concept: parameter counting in Transformer encoders

### Intuition

The total parameter count comes from adding:

1. Token embedding parameters.
2. Positional encoding parameters.
3. Parameters inside each Transformer layer.
4. Repeating the per-layer count over all 24 layers.

The solution explicitly does not count bias parameters.

---

## 3.3 Embedding parameters

There is one token embedding matrix of size

$$
30{,}000 \times 1024.
$$

So the number of embedding parameters is

$$
30{,}000 \cdot 1024
=
30{,}720{,}000.
$$

In millions:

$$
30.720 \text{ million}.
$$

---

## 3.4 Positional encoding parameters

The positional encoding matrix has size

$$
512 \times 1024.
$$

Therefore,

$$
512 \cdot 1024
=
524{,}288.
$$

In millions:

$$
0.524288 \text{ million}
\approx 0.5 \text{ million}.
$$

The solution lists this as approximately $0.5$ million parameters.

---

## 3.5 Self-attention parameters per layer

Each Transformer layer has multi-head self-attention with:

$$
16 \text{ heads}
$$

and for each head:

$$
D_q = D_k = D_v = 64.
$$

For the query, key, and value projections, there are

$$
3 \times 16
$$

matrices, each of size

$$
1024 \times 64.
$$

So the attention projection parameter count is

$$
3 \cdot 16 \cdot 1024 \cdot 64.
$$

Calculate:

$$
1024 \cdot 64 = 65{,}536.
$$

$$
16 \cdot 65{,}536 = 1{,}048{,}576.
$$

$$
3 \cdot 1{,}048{,}576 = 3{,}145{,}728.
$$

In millions:

$$
3.145728 \text{ million}
\approx 3.145 \text{ million}.
$$

The solution gives this as approximately $3.145$ million.

---

## 3.6 Output projection after concatenated heads

The 16 heads are concatenated. Since each head has value dimension $64$, the concatenated representation has dimension

$$
16 \cdot 64 = 1024.
$$

The output projection matrix has size

$$
64 \times 16 \times 1024.
$$

Equivalently,

$$
1024 \times 1024.
$$

The number of parameters is

$$
64 \cdot 16 \cdot 1024
=
1{,}048{,}576.
$$

In millions:

$$
1.048576 \text{ million}
\approx 1.048 \text{ million}.
$$

---

## 3.7 Position-wise MLP parameters per layer

The position-wise network has two matrices.

### First MLP matrix

$$
1024 \times 4096.
$$

Parameter count:

$$
1024 \cdot 4096
=
4{,}194{,}304.
$$

In millions:

$$
4.194304 \text{ million}
\approx 4.194 \text{ million}.
$$

### Second MLP matrix

$$
4096 \times 1024.
$$

Parameter count:

$$
4096 \cdot 1024
=
4{,}194{,}304.
$$

In millions:

$$
4.194304 \text{ million}
\approx 4.194 \text{ million}.
$$

Together:

$$
4.194304 + 4.194304
=
8.388608 \text{ million}.
$$

---

## 3.8 Total parameters per Transformer layer

Per layer:

$$
\text{QKV projections}
+
\text{attention output projection}
+
\text{MLP first matrix}
+
\text{MLP second matrix}.
$$

Substitute:

$$
3.145728
+
1.048576
+
4.194304
+
4.194304
=
12.582912
$$

million parameters.

The solution rounds this to

$$
12.581 \text{ million}
$$

parameters per attention layer.

---

## 3.9 Total across 24 Transformer layers

There are 24 layers, so

$$
24 \cdot 12.581
=
301.944
$$

million parameters, using the rounded per-layer value from the solution.

Then add the embedding parameters:

$$
30.720 + 301.944
=
332.664
$$

million.

The solution writes:

$$
30.720 + 12.581 \times 24 = 333
$$

million parameters.

It also states that bias parameters are not counted.

---

## 3.10 Worked answer

$$
\boxed{
\text{Total} \approx 333 \text{ million parameters, excluding biases}
}
$$

The exercise prompt says “approximately 340 million,” while the provided solution arrives at approximately 333 million without bias parameters.

---

## 3.11 [UNCLEAR] mismatch between prompt and solution

The problem asks to show that the total number of parameters is approximately

$$
340 \text{ million}.
$$

But the solution computes

$$
333 \text{ million}
$$

and explicitly says bias parameters are not counted. This mismatch should be checked against the lecture recording or slides. Possible missing counted components are not specified in the provided material, so I have not added them.

---

# 4. RNNs, BPTT, and Real-Time Recurrent Learning

## 4.1 Problem setup

The exercise concerns training recurrent neural networks using gradients through time.

The standard algorithm discussed is BPTT: back-propagation through time. The exercise gives the BPTT gradient recurrence and asks for an alternative in-order derivative computation. This alternative is identified as Real-Time Recurrent Learning, or RTRL.

The loss is defined as

$$
L = \sum_n L_n.
$$

The notation $\theta_n$ refers to the copy of the RNN parameters at timestep $n$ in the unrolled computation graph. The complete gradient for the shared parameters $\theta$ is obtained by summing the gradients for each copy.

---

## 4.2 Key concept: BPTT

### Definition

Back-propagation through time computes gradients for an unrolled recurrent network by moving backwards through the sequence.

### Intuition

An RNN reuses the same parameters at each timestep. To train it, we can unroll the RNN over time, treating each timestep as a copy of the same computation. BPTT computes how later losses depend on earlier hidden states by propagating gradients backwards.

### Formal recurrence from the exercise

The exercise gives:

$$
\nabla_\theta L
=
\sum_{n=1}^{N}
\frac{\partial L}{\partial h_n}
\frac{\partial h_n}{\partial \theta_n}
$$

and then expands

$$
\frac{\partial L}{\partial h_n}
$$

using a reverse-time recurrence:

$$
\nabla_\theta L
=
\sum_{n=1}^{N}
\left[
\frac{\partial L}{\partial h_{n+1}}
\frac{\partial h_{n+1}}{\partial h_n}
+
\frac{\partial L_n}{\partial h_n}
\right]
\frac{\partial h_n}{\partial \theta_n}.
$$

This expresses the gradient at hidden state $h_n$ as coming from:

1. The future hidden state $h_{n+1}$, through

   $$
   \frac{\partial L}{\partial h_{n+1}}
   \frac{\partial h_{n+1}}{\partial h_n},
   $$

2. The local loss at timestep $n$, through

   $$
   \frac{\partial L_n}{\partial h_n}.
   $$

---

## 4.3 Key concept: reverse-mode automatic differentiation

The solution states that BPTT is an example of reverse-mode automatic differentiation.

### Intuition

Reverse mode works backwards from the loss to the parameters. In the RNN case, this means gradients are propagated from later timesteps back to earlier timesteps.

### In this exercise

BPTT computes the derivatives of the unrolled sequence in reverse order.

---

## 4.4 Alternative: in-order derivative computation

The exercise asks to complete the following equation:

$$
\nabla_\theta L
=
\sum_{n=1}^{N}
\frac{\partial L}{\partial h_n}
\frac{\partial h_n}{\partial \theta_n}
=
\sum_{n=1}^{N}
\frac{\partial L_n}{\partial h_n}
[\ldots].
$$

The missing term is

$$
\frac{\partial h_n}{\partial \theta}.
$$

So the completed form is

$$
\nabla_\theta L
=
\sum_{n=1}^{N}
\frac{\partial L_n}{\partial h_n}
\frac{\partial h_n}{\partial \theta}.
$$

The solution then expands

$$
\frac{\partial h_n}{\partial \theta}
$$

recursively:

$$
\nabla_\theta L
=
\sum_{n=1}^{N}
\frac{\partial L_n}{\partial h_n}
\left[
\frac{\partial h_n}{\partial \theta_n}
+
\frac{\partial h_n}{\partial h_{n-1}}
\frac{\partial h_{n-1}}{\partial \theta}
\right].
$$

This is the central RTRL recurrence in the exercise.

---

## 4.5 Key concept: Real-Time Recurrent Learning

### Definition

Real-Time Recurrent Learning is the training approach obtained by computing recurrent derivatives in forward order, rather than waiting until the end of the sequence and backpropagating through time.

### Intuition

Instead of accumulating all hidden states and then propagating gradients backwards, RTRL maintains the derivative

$$
\frac{\partial h_n}{\partial \theta}
$$

as the sequence is processed. At each timestep, it updates this derivative from the previous one:

$$
\frac{\partial h_n}{\partial \theta}
=
\frac{\partial h_n}{\partial \theta_n}
+
\frac{\partial h_n}{\partial h_{n-1}}
\frac{\partial h_{n-1}}{\partial \theta}.
$$

Then the contribution to the parameter gradient from timestep $n$ is

$$
\frac{\partial L_n}{\partial h_n}
\frac{\partial h_n}{\partial \theta}.
$$

The gradient can be accumulated as the sequence runs.

---

## 4.6 Algorithm: RTRL-style SGD training

The exercise asks for an alternative SGD training algorithm to BPTT using the completed equation.

A clean version of the algorithm is:

1. Initialise the hidden state $h_0$.
2. Initialise the derivative tracker

   $$
   \frac{\partial h_0}{\partial \theta}.
   $$

3. For each timestep $n = 1, \ldots, N$:
   - Compute the next hidden state:

     $$
     h_n.
     $$

   - Update the forward derivative:

     $$
     \frac{\partial h_n}{\partial \theta}
     =
     \frac{\partial h_n}{\partial \theta_n}
     +
     \frac{\partial h_n}{\partial h_{n-1}}
     \frac{\partial h_{n-1}}{\partial \theta}.
     $$

   - Compute the local loss derivative:

     $$
     \frac{\partial L_n}{\partial h_n}.
     $$

   - Accumulate the gradient contribution:

     $$
     \nabla_\theta L
     \leftarrow
     \nabla_\theta L
     +
     \frac{\partial L_n}{\partial h_n}
     \frac{\partial h_n}{\partial \theta}.
     $$

4. At the end of the sequence, use the accumulated gradient for an SGD update.

The solution also notes a more “real-time” variant: because a complete gradient contribution is available at each timestep, an SGD update can be made after every input rather than waiting until the end of the sequence.

---

## 4.7 Key concept: forward-mode automatic differentiation

The solution states that the RTRL-style alternative is an example of forward-mode automatic differentiation.

### Intuition

Forward mode propagates derivatives forward alongside the computation. In this case, as the RNN moves from $h_{n-1}$ to $h_n$, it also updates

$$
\frac{\partial h_n}{\partial \theta}.
$$

This contrasts with BPTT, which waits until the sequence is unrolled and then propagates gradients backward.

---

## 4.8 Advantage of RTRL

The key advantage given in the solution is that RTRL does not need to wait until the end of the sequence to make a weight update. Since a gradient is available at each timestep, SGD can be performed after every input. This is why the method is called “real-time” recurrent learning.

Formally, at timestep $n$, the available local contribution is

$$
\frac{\partial L_n}{\partial h_n}
\frac{\partial h_n}{\partial \theta}.
$$

So the algorithm can update using this quantity immediately.

---

## 4.9 Disadvantage: stale derivative estimates

The solution flags an important caveat.

If an SGD update is made at every timestep, then the stored derivative estimate

$$
\frac{\partial h_{n-1}}{\partial \theta}
$$

was computed with respect to the old weights. After the weights are updated, this estimate becomes “stale”: it is no longer exactly correct for the new parameters.

The solution says that if SGD steps are small enough, this is normally not a big problem.

---

## 4.10 Disadvantage: memory complexity

The main reason RTRL is not the standard algorithm for training RNNs is high computational and space complexity.

The term that must be stored and passed between timesteps is

$$
\frac{\partial h_n}{\partial \theta}.
$$

The solution describes this as a matrix of size

$$
|h_n| \times |\theta|.
$$

Here:

$$
|h_n|
$$

is the size of the hidden state, often in the hundreds or thousands, and

$$
|\theta|
$$

is the number of parameters, which can be millions or billions.

So the memory requirement is on the order of

$$
\boxed{
O(|h_n| |\theta|)
}
$$

for storing the forward derivative matrix.

---

## 4.11 Disadvantage: computational complexity

The expensive computation is

$$
\frac{\partial h_n}{\partial h_{n-1}}
\frac{\partial h_{n-1}}{\partial \theta}.
$$

The solution describes this as multiplying:

$$
\frac{\partial h_n}{\partial h_{n-1}}
$$

which has size

$$
|h_n| \times |h_n|,
$$

by

$$
\frac{\partial h_{n-1}}{\partial \theta},
$$

which has size

$$
|h_n| \times |\theta|.
$$

This has much higher computational complexity than the corresponding calculation for BPTT.

A clean way to express the multiplication cost is:

$$
\boxed{
O(|h_n|^2 |\theta|)
}
$$

per timestep for this matrix product.

---

## 4.12 Comparison: RTRL vs BPTT

| Aspect | BPTT | RTRL |
|---|---|---|
| Direction of differentiation | Reverse order through unrolled sequence | Forward order through sequence |
| AD type named in solution | Reverse-mode automatic differentiation | Forward-mode automatic differentiation |
| When gradient/update is available | After processing the sequence/backward pass | At each timestep |
| Main advantage | Lower practical memory/computation compared with RTRL | Real-time updates possible |
| Main disadvantage | Must wait for backward pass through sequence | Very high memory and computational complexity |
| Key stored derivative | Terms like $\frac{\partial h_{n+1}}{\partial h_n}$ | Full matrix $\frac{\partial h_n}{\partial \theta}$ |
| Staleness issue | Not discussed in the solution | Updates can make $\frac{\partial h_{n-1}}{\partial \theta}$ stale |

---

## 4.13 [UNCLEAR] typo in RTRL solution

The parsed text contains something like

$$
\frac{\partial h h}{\partial \theta_n}
$$

or

$$
\frac{\partial h_h}{\partial \theta_n}
$$

in the paragraph on complexity. From the surrounding explanation and the rendered formula on page 4, the intended term is

$$
\frac{\partial h_n}{\partial \theta}.
$$

This should be checked against the original PDF/recording if exact notation matters.

---

# Exam flags

No explicit phrases such as “this will be on the exam,” “you should know this,” “common mistake,” or “important” appear in the provided exercise sheet.

However, the sheet itself labels exercises by difficulty:

$$
(*), (**), (***)
$$

where $(*)$ is described as simpler and $(***)$ as more complex. The RNN/BPTT/RTRL problem is marked $(***)$, so it is the highest-difficulty exercise in the provided material.

High-value revision points from the sheet:

- Know why

  $$
  \mathbb{E}[(a^\top b)^2] = D.
  $$

- Know how sine/cosine positional encodings allow relative shifts to be represented linearly.
- Know how to count BERT-large-style Transformer encoder parameters.
- Know the difference between BPTT and RTRL:

  $$
  \text{BPTT} = \text{reverse-mode AD}
  $$

  $$
  \text{RTRL} = \text{forward-mode AD}
  $$

- Know why RTRL is not commonly used despite its real-time update advantage: it requires storing and updating

  $$
  \frac{\partial h_n}{\partial \theta}
  $$

  of size

  $$
  |h_n| \times |\theta|.
  $$

---

# Connections across the material

## Transformers

The first three exercises are Transformer-related:

1. **Self-attention scaling** explains why raw dot products grow with vector dimension.
2. **Sinusoidal positional encoding** explains how Transformers can encode sequence position and relative offsets.
3. **BERT parameter counting** applies Transformer architecture details to a large encoder model.

## RNNs

The fourth exercise shifts from Transformers to recurrent models and training algorithms:

- BPTT trains RNNs by backpropagating through the unrolled sequence.
- RTRL trains RNNs using a forward derivative recurrence.
- The comparison links recurrent sequence modelling to automatic differentiation modes.

## Automatic differentiation

The sheet explicitly connects:

$$
\text{BPTT} \leftrightarrow \text{reverse-mode automatic differentiation}
$$

and

$$
\text{RTRL} \leftrightarrow \text{forward-mode automatic differentiation}.
$$

This is a major conceptual bridge in the final exercise.

---

# Unclear sections to revisit in recording/slides

1. **Self-attention expectation notation**  
   The solution appears to write

   $$
   \mathbb{E}[a^\top b] = D
   $$

   but the intended statement is

   $$
   \mathbb{E}[(a^\top b)^2] = D.
   $$

   Mark this as a notation issue.

2. **Self-attention cross-term typo**  
   The cross term in the parsed text appears garbled. The correct expansion should use

   $$
   (a_i b_i)(a_j b_j).
   $$

3. **Sinusoidal positional encoding denominator**  
   The parsed text is messy around expressions like $L^{i/D}$. The rendered page image supports exponent notation, but this should be checked if the lecture used a slightly different convention.

4. **BERT parameter count mismatch**  
   The prompt says approximately $340$ million parameters, while the solution calculates approximately $333$ million excluding biases. The missing difference is not explained in the provided file.

5. **RTRL derivative notation typo**  
   The complexity paragraph contains garbled notation for the stored derivative. The intended object is

   $$
   \frac{\partial h_n}{\partial \theta}.
   $$
