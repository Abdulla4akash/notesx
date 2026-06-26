---
subject: COMP64501
chapter: 11
title: "Graph Neural Networks — Exercise Solutions"
language: en
---

# Graph Neural Networks — Structured Study Notes

**Topic and scope:** This material covers foundational Graph Neural Network concepts: adjacency matrices, graph permutations, graph connectivity from adjacency powers, the relationship between graph attention and Transformer self-attention, and permutation equivariance of attention aggregation.

It fits into the broader study of **Graph Neural Networks**, especially the mathematical properties that make GNN layers well-defined on graphs whose node ordering is arbitrary.

**Course:** Not provided.  
**Lecture topic:** Graph Neural Networks, inferred from the uploaded exercise sheet title.  
**Source type available:** Exercise sheet with solutions, not a transcript or slide deck.

---

## 1. Adjacency matrix representation of a graph

### 1.1 Core idea

An **adjacency matrix** represents which nodes in a graph are connected by edges.

For a graph with $n$ nodes, the adjacency matrix is an $n \times n$ matrix $A$, where entry $A_{ij}$ records whether there is an edge between node $i$ and node $j$.

### 1.2 Graph in the exercise

The exercise gives the adjacency matrix

$$
A =
\begin{bmatrix}
0 & 1 & 1 & 0 & 1 \\
1 & 0 & 1 & 1 & 1 \\
1 & 1 & 0 & 1 & 0 \\
0 & 1 & 1 & 0 & 0 \\
1 & 1 & 0 & 0 & 0
\end{bmatrix}.
$$

The solution states that this is a **simple undirected graph** with 5 nodes labelled

$$
1,2,3,4,5.
$$

### 1.3 Reading the graph from the matrix

Because the matrix is symmetric,

$$
A_{ij} = A_{ji},
$$

the graph is undirected.

Because the diagonal entries are all zero,

$$
A_{ii}=0,
$$

there are no self-loops.

The edges are obtained from the entries equal to 1 above or below the diagonal:

$$
(1,2),\quad (1,3),\quad (1,5),
$$

$$
(2,3),\quad (2,4),\quad (2,5),
$$

$$
(3,4).
$$

So the graph has 5 nodes and 7 undirected edges.

### 1.4 Worked example: degrees from the displayed graph

From the adjacency matrix:

- Node $1$ is connected to $2,3,5$, so

  $$
  \deg(1)=3.
  $$

- Node $2$ is connected to $1,3,4,5$, so

  $$
  \deg(2)=4.
  $$

- Node $3$ is connected to $1,2,4$, so

  $$
  \deg(3)=3.
  $$

- Node $4$ is connected to $2,3$, so

  $$
  \deg(4)=2.
  $$

- Node $5$ is connected to $1,2$, so

  $$
  \deg(5)=2.
  $$

Therefore the degree sequence is

$$
(3,4,3,2,2).
$$

---

## 2. Permuting node orderings and adjacency matrices

### 2.1 Core idea

Graphs do not have an intrinsic ordering of nodes. If we relabel or reorder nodes, the mathematical representation of the graph changes, but the graph structure should remain the same.

A permutation of node labels should permute both:

- the rows of the adjacency matrix, and
- the columns of the adjacency matrix.

This is because row $i$ and column $i$ both refer to node $i$.

### 2.2 Formal setup

Let

$$
\pi
$$

be a permutation of the node indices

$$
\{1,\dots,n\}.
$$

Let $P$ be the associated permutation matrix, defined by

$$
P_{i,\pi(i)} = 1,
$$

and

$$
P_{ij}=0
$$

otherwise.

The permuted adjacency matrix is defined as

$$
\widetilde{A} = P A P^\top.
$$

### 2.3 Derivation: why rows and columns are both permuted

We examine the $(i,j)$-th entry of the transformed adjacency matrix:

$$
\widetilde{A}_{ij}
=
(PAP^\top)_{ij}.
$$

Using matrix multiplication,

$$
\widetilde{A}_{ij}
=
\sum_{k,\ell} P_{ik} A_{k\ell} P^\top_{\ell j}.
$$

Since

$$
P^\top_{\ell j} = P_{j\ell},
$$

this becomes

$$
\widetilde{A}_{ij}
=
\sum_{k,\ell} P_{ik} A_{k\ell} P_{j\ell}.
$$

Now use the definition of $P$:

$$
P_{ik}=1
$$

only when

$$
k = \pi(i),
$$

and

$$
P_{j\ell}=1
$$

only when

$$
\ell = \pi(j).
$$

Therefore every term in the sum is zero except the term where

$$
k=\pi(i), \qquad \ell=\pi(j).
$$

Hence

$$
\widetilde{A}_{ij}
=
A_{\pi(i),\pi(j)}.
$$

### 2.4 Interpretation

The transformed matrix satisfies

$$
\widetilde{A}_{ij}=A_{\pi(i),\pi(j)}.
$$

So row $i$ and column $i$ in $\widetilde{A}$ correspond to row $\pi(i)$ and column $\pi(i)$ in the original matrix $A$.

This proves that the transformation

$$
\widetilde{A}=PAP^\top
$$

permutes both rows and columns according to the same node permutation.

---

## 3. Connectivity and the diagonal of $A^2$

### 3.1 Core idea

The exercise asks to show that the number of edges connected to each node is given by the corresponding diagonal element of

$$
A^2,
$$

where $A$ is the adjacency matrix.

For a simple undirected graph, the diagonal entry

$$
(A^2)_{ii}
$$

equals the degree of node $i$.

### 3.2 Definition: degree of a node

The **degree** of a node $i$, denoted

$$
\deg(i),
$$

is the number of edges incident to node $i$, equivalently the number of neighbours of node $i$.

For a simple undirected graph,

$$
\deg(i)=\sum_k A_{ik}.
$$

### 3.3 Formal derivation

By definition of matrix multiplication,

$$
(A^2)_{ii}
=
\sum_k A_{ik}A_{ki}.
$$

For a simple undirected graph, the adjacency matrix is symmetric:

$$
A_{ik}=A_{ki}.
$$

Also, the graph has no self-loops, so

$$
A_{ii}=0.
$$

Using symmetry,

$$
A_{ik}A_{ki}
=
A_{ik}A_{ik}
=
A_{ik}^2.
$$

Since adjacency entries are binary, each

$$
A_{ik}\in\{0,1\}.
$$

Therefore

$$
A_{ik}^2=A_{ik}.
$$

So

$$
(A^2)_{ii}
=
\sum_k A_{ik}.
$$

But

$$
\sum_k A_{ik}
$$

is exactly the degree of node $i$. Hence

$$
(A^2)_{ii}
=
\deg(i).
$$

Therefore, the diagonal entries of $A^2$ give the number of edges connected to each node.

### 3.4 Worked application to the matrix in Exercise 1

From the matrix in Exercise 1, the node degrees are

$$
\deg(1)=3,\quad
\deg(2)=4,\quad
\deg(3)=3,\quad
\deg(4)=2,\quad
\deg(5)=2.
$$

Therefore, for that graph,

$$
\operatorname{diag}(A^2)
=
(3,4,3,2,2).
$$

---

## 4. Fully connected Graph Attention Network and Transformer self-attention

### 4.1 Core idea

The exercise asks to show that a **Graph Attention Network** layer on a fully connected graph is equivalent to a standard Transformer self-attention layer.

The key reason is that in both cases, every node or token attends to every other node or token.

### 4.2 Graph Attention Network layer

Let

$$
h_n^{(l)}\in \mathbb{R}^d
$$

be the representation of node $n$ at layer $l$.

A single-head attention-based message passing step is written as

$$
z_n^{(l)}
=
\sum_{m\in \mathcal{N}(n)}
\alpha_{nm} W h_m^{(l)}.
$$

Here:

- $\mathcal{N}(n)$ is the neighbourhood of node $n$.
- $h_m^{(l)}$ is the representation of neighbour node $m$.
- $W h_m^{(l)}$ is the message/value sent by node $m$.
- $\alpha_{nm}$ is the attention coefficient from node $n$ to node $m$.

For a fully connected graph,

$$
\mathcal{N}(n)
$$

contains all nodes, possibly including $n$ itself if self-loops are used.

### 4.3 Attention coefficients in the GAT layer

The attention coefficients are given by

$$
\alpha_{nm}
=
\frac{
\exp\left(
(h_n^{(l)})^\top W_Q^\top W_K h_m^{(l)}
\right)
}{
\sum_{m'}
\exp\left(
(h_n^{(l)})^\top W_Q^\top W_K h_{m'}^{(l)}
\right)
}.
$$

This means node $n$ assigns a weight to node $m$ based on a compatibility score between their representations.

The score has the form

$$
(h_n^{(l)})^\top W_Q^\top W_K h_m^{(l)}.
$$

This can be read as:

$$
(W_Q h_n^{(l)})^\top (W_K h_m^{(l)}),
$$

up to the orientation of the vectors and matrices in the notation.

### 4.4 Standard Transformer self-attention

For a sequence of $N$ tokens with embeddings

$$
x_1,\dots,x_N,
$$

stack the token embeddings into a matrix

$$
X.
$$

The Transformer defines

$$
Q=XW_Q,
$$

$$
K=XW_K,
$$

$$
V=XW_V.
$$

For token $n$, the attention output is

$$
\operatorname{Attn}(X)_n
=
\sum_{m=1}^{N}
\alpha_{nm} V_m.
$$

The attention coefficient is

$$
\alpha_{nm}
=
\frac{
\exp(q_n^\top k_m)
}{
\sum_{m'}
\exp(q_n^\top k_{m'})
}.
$$

Here:

- $q_n$ is the query vector for token $n$.
- $k_m$ is the key vector for token $m$.
- $V_m$ is the value vector for token $m$.

### 4.5 Matching GAT and Transformer notation

The exercise identifies graph nodes with sequence tokens:

$$
h_n^{(l)} \leftrightarrow x_n.
$$

That is:

- node features $h_n^{(l)}$ play the role of token embeddings $x_n$;
- a fully connected graph means each node attends to every other node;
- this matches self-attention, where each token attends to all tokens in the sequence;
- GAT attention coefficients can be matched to Transformer attention coefficients through suitable choices of $W_Q$ and $W_K$;
- graph messages $W h_m^{(l)}$ correspond to Transformer values

  $$
  V_m=x_m W_V.
  $$

So the GAT update

$$
z_n^{(l)}
=
\sum_{m\in \mathcal{N}(n)}
\alpha_{nm} W h_m^{(l)}
$$

matches the Transformer self-attention update

$$
\operatorname{Attn}(X)_n
=
\sum_{m=1}^{N}
\alpha_{nm} V_m.
$$

### 4.6 Conclusion: equivalence

When the graph is fully connected and the attention mechanism is defined as above, a GAT layer is mathematically equivalent to a single-head Transformer self-attention layer.

The exercise notes that this equivalence is up to standard implementation details, including:

$$
\frac{1}{\sqrt{d}}
$$

scaling,

positional encodings,

and the later feed-forward network.

With multiple heads and the standard residual and feed-forward structure, the equivalence extends to a full Transformer block.

### 4.7 [UNCLEAR] Self-loops and exact equivalence

[UNCLEAR] The solution says the neighbourhood is all nodes, “including possibly $n$ itself if self-loops are used.” Transformer self-attention normally allows a token to attend to itself. Therefore the exact equivalence depends on whether the fully connected graph includes self-loops. The uploaded solution leaves this convention conditional rather than fixing it.

---

## 5. Attention-weighted aggregation and permutation equivariance

### 5.1 Core idea

The exercise asks why attention-weighted aggregation is equivariant under reordering of the nodes.

The key point is:

> If the input node order is permuted, the output node order is permuted in the same way.

This property is called **permutation equivariance**.

### 5.2 Attention-weighted aggregation

The aggregation function is

$$
z_n^{(l)}
=
\sum_{m\in \mathcal{N}(n)}
A_{nm}h_m^{(l)}.
$$

Here:

- $z_n^{(l)}$ is the updated representation of node $n$.
- $\mathcal{N}(n)$ is the neighbourhood of node $n$.
- $h_m^{(l)}$ is the current representation of node $m$.
- $A_{nm}$ is the attention coefficient from node $n$ to node $m$.

The attention coefficients are defined as

$$
A_{nm}
=
\frac{
\exp(h_n^\top W h_m)
}{
\sum_{m'\in \mathcal{N}(n)}
\exp(h_n^\top W h_{m'})
}.
$$

### 5.3 Definition: permutation equivariance

Let $\pi$ be a permutation of the node indices

$$
\{1,\dots,N\}.
$$

Let $P$ be the corresponding permutation matrix.

Define the permuted node features by

$$
\widetilde{h}_n^{(l)}
:=
h_{\pi(n)}^{(l)}.
$$

Equivalently, if $H^{(l)}$ stacks the node features as rows, then

$$
\widetilde{H}^{(l)}
=
P H^{(l)}.
$$

A GNN layer is permutation equivariant if applying the layer after permuting the input gives the same result as permuting the output of the original layer.

Formally,

$$
\widetilde{z}_n^{(l)}
=
z_{\pi(n)}^{(l)}
$$

for all $n$, or in matrix form,

$$
\widetilde{Z}^{(l)}
=
PZ^{(l)}.
$$

### 5.4 Attention coefficient after node permutation

For the permuted graph/features, the attention coefficient is

$$
\widetilde{A}_{nm}
=
\frac{
\exp\left(
(\widetilde{h}_n^{(l)})^\top W \widetilde{h}_m^{(l)}
\right)
}{
\sum_{m'\in \widetilde{\mathcal{N}}(n)}
\exp\left(
(\widetilde{h}_n^{(l)})^\top W \widetilde{h}_{m'}^{(l)}
\right)
}.
$$

Using

$$
\widetilde{h}_n^{(l)}
=
h_{\pi(n)}^{(l)},
$$

the numerator becomes

$$
(\widetilde{h}_n^{(l)})^\top W \widetilde{h}_m^{(l)}
=
(h_{\pi(n)}^{(l)})^\top W h_{\pi(m)}^{(l)}.
$$

### 5.5 Neighbourhoods under permutation

The neighbourhood of node $n$ in the permuted graph corresponds to the permuted neighbourhood of $\pi(n)$:

$$
\widetilde{\mathcal{N}}(n)
=
\{m : \pi(m)\in \mathcal{N}(\pi(n))\}.
$$

So the denominator in the permuted attention coefficient is just a re-indexed version of the denominator for node $\pi(n)$ in the original graph:

$$
\sum_{m'\in \widetilde{\mathcal{N}}(n)}
\exp\left(
(\widetilde{h}_n^{(l)})^\top W \widetilde{h}_{m'}^{(l)}
\right)
$$

becomes

$$
\sum_{m'\in \mathcal{N}(\pi(n))}
\exp\left(
(h_{\pi(n)}^{(l)})^\top W h_{m'}^{(l)}
\right).
$$

Therefore,

$$
\widetilde{A}_{nm}
=
A_{\pi(n),\pi(m)}.
$$

This means the attention matrix itself is permuted in the same way as the node ordering.

### 5.6 Output after permutation

Now compute the output for the permuted inputs:

$$
\widetilde{z}_n^{(l)}
=
\sum_{m\in \widetilde{\mathcal{N}}(n)}
\widetilde{A}_{nm}\widetilde{h}_m^{(l)}.
$$

Substitute

$$
\widetilde{A}_{nm}
=
A_{\pi(n),\pi(m)}
$$

and

$$
\widetilde{h}_m^{(l)}
=
h_{\pi(m)}^{(l)}.
$$

Then

$$
\widetilde{z}_n^{(l)}
=
\sum_{m\in \widetilde{\mathcal{N}}(n)}
A_{\pi(n),\pi(m)} h_{\pi(m)}^{(l)}.
$$

Let

$$
u=\pi(m).
$$

Then as $m$ ranges over

$$
\widetilde{\mathcal{N}}(n),
$$

the index $u$ ranges over

$$
\mathcal{N}(\pi(n)).
$$

So

$$
\widetilde{z}_n^{(l)}
=
\sum_{u\in \mathcal{N}(\pi(n))}
A_{\pi(n),u}h_u^{(l)}.
$$

But this is exactly

$$
z_{\pi(n)}^{(l)}.
$$

Therefore,

$$
\widetilde{z}_n^{(l)}
=
z_{\pi(n)}^{(l)}
\qquad \forall n.
$$

Equivalently,

$$
\widetilde{Z}^{(l)}
=
PZ^{(l)}.
$$

This proves permutation equivariance.

---

## 6. Worked examples and proof exercises preserved

### Exercise 1: Draw graph from adjacency matrix

Given the matrix

$$
A =
\begin{bmatrix}
0 & 1 & 1 & 0 & 1 \\
1 & 0 & 1 & 1 & 1 \\
1 & 1 & 0 & 1 & 0 \\
0 & 1 & 1 & 0 & 0 \\
1 & 1 & 0 & 0 & 0
\end{bmatrix},
$$

the graph has nodes

$$
1,2,3,4,5
$$

and edges

$$
(1,2), (1,3), (1,5), (2,3), (2,4), (2,5), (3,4).
$$

### Exercise 2: Show $PAP^\top$ permutes rows and columns

The proof shows

$$
\widetilde{A}_{ij}
=
(PAP^\top)_{ij}
=
A_{\pi(i),\pi(j)}.
$$

Therefore both rows and columns are permuted according to $\pi$.

### Exercise 3: Show $(A^2)_{ii}$ gives degree

The proof shows

$$
(A^2)_{ii}
=
\sum_k A_{ik}A_{ki}
=
\sum_k A_{ik}
=
\deg(i).
$$

This uses the assumptions that the graph is simple and undirected.

### Exercise 4: Show fully connected GAT equals Transformer self-attention

The GAT update

$$
z_n^{(l)}
=
\sum_{m\in \mathcal{N}(n)}
\alpha_{nm} W h_m^{(l)}
$$

matches the Transformer self-attention update

$$
\operatorname{Attn}(X)_n
=
\sum_{m=1}^{N}
\alpha_{nm} V_m
$$

when:

$$
h_n^{(l)}
\leftrightarrow
x_n,
$$

$$
W h_m^{(l)}
\leftrightarrow
V_m,
$$

and the fully connected graph makes

$$
\mathcal{N}(n)=\{1,\dots,N\}.
$$

### Exercise 5: Show attention aggregation is permutation equivariant

The proof shows that after permuting nodes,

$$
\widetilde{A}_{nm}
=
A_{\pi(n),\pi(m)}
$$

and therefore

$$
\widetilde{z}_n^{(l)}
=
z_{\pi(n)}^{(l)}.
$$

So the output is permuted in the same way as the input.

---

## 7. Key concepts

### 7.1 Adjacency matrix

**Intuition:** A table showing which nodes are connected.

**Formal definition from the material:** For the given graph, the adjacency matrix is the displayed $5\times 5$ binary matrix $A$. A 1 indicates an edge between the corresponding pair of nodes, and a 0 indicates no edge.

### 7.2 Simple undirected graph

**Intuition:** A graph where edges have no direction and there are no self-loops or repeated edges.

**Formal details used in the material:**

$$
A=A^\top
$$

for an undirected graph, and

$$
A_{ii}=0
$$

for a simple graph with no self-loops.

### 7.3 Permutation matrix

**Intuition:** A matrix that reorders nodes.

**Formal definition from the material:**

$$
P_{i,\pi(i)}=1,
$$

and

$$
P_{ij}=0
$$

otherwise.

### 7.4 Permuted adjacency matrix

**Intuition:** When nodes are reordered, both rows and columns of the adjacency matrix must be reordered.

**Formal definition from the material:**

$$
\widetilde{A}
=
PAP^\top.
$$

The entries satisfy

$$
\widetilde{A}_{ij}
=
A_{\pi(i),\pi(j)}.
$$

### 7.5 Degree from $A^2$

**Intuition:** The diagonal of $A^2$ counts how many neighbours each node has in a simple undirected graph.

**Formal result from the material:**

$$
(A^2)_{ii}
=
\deg(i).
$$

The derivation is

$$
(A^2)_{ii}
=
\sum_k A_{ik}A_{ki}
=
\sum_k A_{ik}
=
\deg(i).
$$

### 7.6 Graph attention

**Intuition:** A node aggregates information from its neighbours using learned attention weights.

**Formal aggregation from the material:**

$$
z_n^{(l)}
=
\sum_{m\in \mathcal{N}(n)}
\alpha_{nm} W h_m^{(l)}.
$$

The attention coefficient is

$$
\alpha_{nm}
=
\frac{
\exp\left(
(h_n^{(l)})^\top W_Q^\top W_K h_m^{(l)}
\right)
}{
\sum_{m'}
\exp\left(
(h_n^{(l)})^\top W_Q^\top W_K h_{m'}^{(l)}
\right)
}.
$$

### 7.7 Transformer self-attention

**Intuition:** Each token attends to all tokens in the sequence.

**Formal definition from the material:**

$$
Q=XW_Q,
$$

$$
K=XW_K,
$$

$$
V=XW_V.
$$

The output for token $n$ is

$$
\operatorname{Attn}(X)_n
=
\sum_{m=1}^{N}
\alpha_{nm}V_m,
$$

where

$$
\alpha_{nm}
=
\frac{
\exp(q_n^\top k_m)
}{
\sum_{m'}
\exp(q_n^\top k_{m'})
}.
$$

### 7.8 Permutation equivariance

**Intuition:** Reordering the nodes before applying the layer gives the same result as applying the layer first and then reordering the outputs.

**Formal definition from the material:**

$$
\widetilde{z}_n^{(l)}
=
z_{\pi(n)}^{(l)}
\qquad \forall n.
$$

In matrix form,

$$
\widetilde{Z}^{(l)}
=
PZ^{(l)}.
$$

---

## 8. Connections

### 8.1 Permutations and GNNs

The permutation result for adjacency matrices connects directly to the later attention aggregation proof.

First, the material shows that node relabelling transforms the adjacency matrix as

$$
\widetilde{A}=PAP^\top.
$$

Later, it shows that attention-based aggregation respects such relabelling:

$$
\widetilde{Z}^{(l)}=PZ^{(l)}.
$$

Together, these results express the same principle: graph computations should not depend on arbitrary node ordering.

### 8.2 Connectivity and matrix powers

The result

$$
(A^2)_{ii}=\deg(i)
$$

connects graph structure to matrix operations.

The adjacency matrix is not just a storage format for edges; algebraic operations on it recover graph properties such as node degree.

### 8.3 GNNs and Transformers

The exercise explicitly connects Graph Attention Networks to Transformers.

A fully connected graph attention layer becomes equivalent to self-attention because every node attends to every other node, just as every token attends to every other token in a Transformer.

The mapping is:

$$
\text{node} \leftrightarrow \text{token},
$$

$$
h_n^{(l)} \leftrightarrow x_n,
$$

$$
W h_m^{(l)} \leftrightarrow V_m,
$$

$$
\alpha_{nm}^{\text{GAT}} \leftrightarrow \alpha_{nm}^{\text{Transformer}}.
$$

---

## 9. Exam flags

No explicit exam statements appear in the uploaded material. I did not find phrases such as:

- “this will be on the exam,”
- “you should know this,”
- “this is important,”
- “common mistake.”

However, the exercise sheet marks difficulty levels:

- Exercise 1: $(*)$ Adjacency matrix
- Exercise 2: $(**)$ Permutation
- Exercise 3: $(**)$ Connectivity
- Exercise 4: $(*)$ GNN and Transformer
- Exercise 5: $(**)$ Attention aggregation

No $(***)$ exercise appears in the uploaded document.

---

## 10. Unclear sections

### [UNCLEAR] Missing transcript and slides

The prompt asks to use both slides and transcript, but only one uploaded PDF exercise sheet is available. There is no lecture transcript or separate slide deck in the available files. Because of that, these notes cannot capture spoken emphasis, pacing, exam hints, or slide-only material.

### [UNCLEAR] PDF text extraction glitches

The parsed PDF text contains minor formatting glitches, such as broken words in “connected” and “residual.” The mathematical content is still recoverable, but those areas should be checked against the original PDF if exact wording matters.

### [UNCLEAR] Self-loop convention in the GAT/Transformer equivalence

[UNCLEAR] The solution says the fully connected graph neighbourhood may include the node itself “if self-loops are used.” Since Transformer self-attention includes self-attention over the same token, the exact equivalence depends on whether self-loops are included in the graph attention layer. The uploaded solution leaves this conditional.
