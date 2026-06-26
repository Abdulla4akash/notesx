---
subject: COMP64501
chapter: 10
title: "Graph Neural Networks"
language: en
---

# Graph Neural Networks — Structured Study Notes

**Course:** Topics of Machine Learning, The University of Manchester  
**Lecturer:** Mingfei Sun  
**Lecture topic:** Graph Neural Networks  
**Source used:** Uploaded slide deck `graph-nn.pdf`.  
**Transcript note:** The transcript text was not included after the prompt. These notes therefore use the slides and slide visuals only. Any spoken explanations, transcript-only examples, or verbal exam hints are marked as missing/unclear where relevant.

## Topic and scope

This lecture introduces learning on graph-structured data, explains why ordinary neural-network architectures are not directly suitable for graphs because of node-order permutation issues, and builds up graph neural networks through message passing, graph attention, graph-level/edge-level/node-level tasks, and geometric constraints.

---

# 1. Lecture structure and intended outcomes

The lecture is organised into three main parts:

1. **Basics of Learning on Graphs**
2. **Neural Message Passing**
3. **General Graph Neural Networks**

## Exam flag — intended learning outcomes

The slides explicitly say that by the end of the lecture you should be able to:

- Explain why standard neural networks cannot directly process graph-structured data.
- Explain the role of **permutation symmetry**.
- Describe the **adjacency matrix** representation of a graph.
- Understand how node reordering affects an adjacency matrix through **permutation matrices**.
- Define **permutation equivariance** and **permutation invariance**.
- Identify which symmetry property is needed for node-level, edge-level, and graph-level tasks.
- Implement the **message-passing framework** using suitable aggregation and update functions.
- Apply GNNs to node-level, edge-level, and graph-level prediction tasks.
- Design GNN architectures using graph attention, residual connections, and geometric constraints.

---

# 2. Motivation: why graphs?

Previous chapters covered data with regular array structure.

## 2.1 Sequences

Sequences are represented as **1D arrays**.

Examples of models for sequences:

- RNNs
- Transformers

## 2.2 Images

Images are represented as **2D arrays**.

Example model family:

- CNNs

## 2.3 Graphs

Many real-world datasets are not naturally represented as 1D or 2D arrays. They instead have **graph structure**.

A graph consists of:

- **Nodes:** the objects in the system.
- **Edges:** relationships between those objects.
- **Node data and edge data:** both nodes and edges may have associated features or attributes.

---

# 3. Examples of graph-structured data

The slide on examples uses three visual examples: molecules, social networks, and web pages.

## 3.1 Molecules

A molecule can be represented as a graph.

- **Nodes:** atoms, such as C, N, H, O.
- **Edges:** chemical bonds, such as single, double, or triple bonds.

The visual example on the slide shows a chemical structure diagram, illustrating that atoms are connected by bonds in a non-grid structure.

## 3.2 Social networks

A social network can be represented as a graph.

- **Nodes:** people.
- **Edges:** friendships or social connections.

The slide’s diagram shows a small network with locations labelled **Leeds**, **Cambridge**, **Oxford**, **Bristol**, and **London**, connected by edges. This illustrates that the graph captures relationships rather than a fixed spatial grid.

## 3.3 Web pages

A collection of web pages can be represented as a graph.

- **Nodes:** documents or web pages.
- **Edges:** hyperlinks.
- The edges may be **directed**, because a hyperlink from page A to page B does not necessarily mean there is a hyperlink from page B back to page A.

The visual example shows documents connected by arrows, representing directed hyperlinks between pages.

---

# 4. Basics of learning on graphs

## 4.1 Simple graphs

The lecture first focuses on **simple graphs**, which cover a wide range of practical applications.

A simple graph has the following properties:

- There is **at most one edge** between any pair of nodes.
- Edges are **undirected**.
- There are **no self-edges**, meaning no edge connects a node to itself.

### Intuition

A simple graph is the cleanest setting for introducing graph neural networks. It avoids complications such as multiple edge types, directed edges, and self-loops.

### Formal notation

A graph is written as:

$$
G = (V, E)
$$

where:

- $V$ is the set of nodes, also called vertices.
- $E$ is the set of edges, also called links.
- Nodes are indexed as:

$$
n = 1, \ldots, N
$$

- An edge from node $n$ to node $m$ is written:

$$
(n,m)
$$

- The neighbours of node $n$ are written:

$$
\mathcal{N}(n)
$$

- A node feature vector is written:

$$
x_n \in \mathbb{R}^D
$$

- The node-feature data matrix is written:

$$
X \in \mathbb{R}^{N \times D}
$$

where the rows are the transposed node feature vectors:

$$
x_n^T
$$

So each row of $X$ corresponds to one node.

---

## 4.2 Adjacency matrix

A convenient way to specify the edges in a graph is the **adjacency matrix**, denoted:

$$
A
$$

### Formal definition

For a graph with $N$ nodes:

$$
A \in \mathbb{R}^{N \times N}
$$

The entry $A_{nm}$ is defined as:

$$
A_{nm} =
\begin{cases}
1, & \text{if there is an edge from node } n \text{ to node } m, \\
0, & \text{otherwise.}
\end{cases}
$$

For **undirected graphs**, the adjacency matrix is symmetric:

$$
A = A^T
$$

because if node $n$ is connected to node $m$, then node $m$ is also connected to node $n$.

### Intuition

The adjacency matrix is like a table of node-to-node connections. Rows and columns both correspond to nodes. A 1 means “connected”; a 0 means “not connected.”

### Important issue

The adjacency matrix depends on the **arbitrary ordering of nodes**.

The same graph can produce different adjacency matrices if the nodes are listed in a different order. The slide shows the same graph represented using two different node orders:

$$
A, B, C, D, E
$$

and

$$
C, E, A, D, B
$$

The graph itself has not changed, but the rows and columns of the adjacency matrix have been rearranged.

### Key consequence

A neural architecture for graphs should be invariant to node permutation. In other words, changing the arbitrary labels/order of nodes should not change the meaning of the graph representation.

---

## 4.3 Worked example: same graph, different adjacency matrix

The graph shown on the adjacency-matrix slide has nodes:

$$
A, B, C, D, E
$$

From the diagram, the edges are:

$$
(A,C), (B,C), (C,D), (C,E), (D,E)
$$

Because the graph is undirected, each edge appears in both directions in the adjacency matrix.

### Ordering 1: $A, B, C, D, E$

Using the order:

$$
(A, B, C, D, E)
$$

the adjacency matrix is:

$$
A =
\begin{pmatrix}
0 & 0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 \\
1 & 1 & 0 & 1 & 1 \\
0 & 0 & 1 & 0 & 1 \\
0 & 0 & 1 & 1 & 0
\end{pmatrix}
$$

Rows and columns both follow the order $A, B, C, D, E$.

### Ordering 2: $C, E, A, D, B$

Using the order:

$$
(C, E, A, D, B)
$$

the same graph is represented by:

$$
\tilde{A} =
\begin{pmatrix}
0 & 1 & 1 & 1 & 1 \\
1 & 0 & 0 & 1 & 0 \\
1 & 0 & 0 & 0 & 0 \\
1 & 1 & 0 & 0 & 0 \\
1 & 0 & 0 & 0 & 0
\end{pmatrix}
$$

This is the same graph, but the adjacency matrix looks different because the node order changed. This is the core permutation problem for graph neural networks.

---

## 4.4 The permutation problem

### Problem

The adjacency matrix depends on node ordering.

Different orderings of the same nodes give different matrices for the same graph:

$$
\text{same graph} \quad \Rightarrow \quad \text{different adjacency matrices}
$$

Therefore, we cannot directly use the adjacency matrix as if it were an ordinary fixed array input to a neural network.

### Why data augmentation is not enough

The number of possible node permutations grows factorially with the number of nodes:

$$
N!
$$

So it is not practical to train a network to learn permutation invariance by showing it all possible reorderings.

### Solution

Build permutation equivariance or permutation invariance directly into the network architecture.

---

## 4.5 Permutation matrix

A **permutation matrix** is used to represent a reordering of nodes.

### Formal definition

A permutation matrix $P$ is an $N \times N$ matrix that contains:

- exactly one 1 in each row,
- exactly one 1 in each column,
- 0s everywhere else.

It defines a permutation function:

$$
\pi(\cdot)
$$

where:

$$
m = \pi(n)
$$

The slide gives the formal definition:

$$
P =
\begin{pmatrix}
u^T_{\pi(1)} \\
u^T_{\pi(2)} \\
\vdots \\
u^T_{\pi(N)}
\end{pmatrix}
$$

where $u_n$ is the $n$-th standard basis vector.

### Intuition

A permutation matrix reorders rows when it multiplies a matrix from the left. Since graph node ordering affects both the rows and columns of the adjacency matrix, a node permutation must reorder both rows and columns.

---

## 4.6 Permutation transformations of graph data

Under node reordering with permutation matrix $P$, the node-feature matrix and adjacency matrix transform as follows.

### Data matrix transformation

$$
\tilde{X} = PX
$$

This permutes the rows of $X$, because each row corresponds to a node.

### Adjacency matrix transformation

$$
\tilde{A} = P A P^T
$$

This permutes both rows and columns of $A$, because rows and columns both index nodes.

### Intuition

- $PX$ reorders the node features.
- $PAP^T$ reorders the graph connectivity consistently.
- The graph is unchanged as an abstract object, but its matrix representation changes.

---

## 4.7 Permutation invariance

Permutation invariance is required for **graph-level predictions**.

### Intuition

For graph-level tasks, the output is one prediction for the entire graph. Since the graph itself does not change when we reorder nodes, the output should not change either.

Example from the slides:

- Predicting molecular solubility.

The molecule is the same molecule regardless of how its atoms are ordered in a data matrix.

### Formal definition

A function $y(X,A)$ is permutation-invariant if:

$$
y(\tilde{X}, \tilde{A}) = y(X,A)
$$

where:

$$
\tilde{X} = PX
$$

and

$$
\tilde{A} = P A P^T
$$

So the output is unchanged by node reordering.

---

## 4.8 Permutation equivariance

Permutation equivariance is required for **node-level predictions**.

### Intuition

For node-level tasks, the output is one prediction per node. If the input nodes are reordered, the output predictions should be reordered in exactly the same way.

Example from the slides:

- Classifying individual nodes in a social network.

If person/node 5 moves to a different row in the data matrix, their classification output should move to the corresponding row too.

### Formal definition

A function $y(X,A)$ is permutation-equivariant if:

$$
y(\tilde{X}, \tilde{A}) = P y(X,A)
$$

where:

$$
\tilde{X} = PX
$$

and

$$
\tilde{A} = P A P^T
$$

So the output changes consistently with the input permutation.

---

# 5. Neural message passing

## 5.1 Message-passing design principles

The neural message-passing framework is built around several design principles:

1. Ensure permutation equivariance or invariance.
2. Use a layered architecture, as in other deep networks.
3. Use flexible, nonlinear, differentiable functions.
4. Handle variable-sized graphs.
5. Scale to large graphs.
6. Share parameters.

The slides explicitly connect this to the inspiration of convolutional neural networks for images.

---

## 5.2 From CNNs to graph convolutions

The slides interpret images as graphs:

- Nodes are pixels.
- Edges are adjacency relationships between pixels.

A standard CNN convolution with a $3 \times 3$ filter is written as:

$$
z_i^{(l+1)}
=
f
\left(
\sum_j w_j z_j^{(l)} + b
\right)
$$

where:

- $z_i^{(l+1)}$ is the output representation at layer $l+1$,
- $z_j^{(l)}$ is an input representation from layer $l$,
- $w_j$ is a filter weight,
- $b$ is a bias,
- $f$ is a nonlinear activation function.

The slide notes that this is **not equivariant** in the graph setting because the weight vector $\{w_j\}$ depends on ordering.

### Intuition

In an image, the local neighbourhood has a regular structure: top-left pixel, top pixel, top-right pixel, and so on. A CNN can assign different weights to different fixed spatial positions.

In a general graph, a node’s neighbours do not come with a natural canonical ordering. Therefore, assigning a separate weight to “neighbour 1,” “neighbour 2,” etc. would depend on arbitrary ordering.

---

## 5.3 Making convolutions equivariant

The modified convolution on the slides is:

$$
z_i^{(l+1)}
=
f
\left(
w_{\text{neigh}}
\sum_{j \in \mathcal{N}(i)}
z_j^{(l)}
+
w_{\text{self}} z_i^{(l)}
+
b
\right)
$$

### Key changes

The slide lists these changes:

- Separate node $i$ from its neighbours $\mathcal{N}(i)$.
- Share the weight $w_{\text{neigh}}$ across all neighbours.
- Use a separate weight $w_{\text{self}}$ for the self-connection.
- Use summation, which is permutation-invariant.
- Share parameters across all nodes.

Therefore, this operation is equivariant under node reordering.

### Intuition

The key trick is to avoid depending on the arbitrary order of neighbours.

Instead of saying “apply weight $w_1$ to the first neighbour and $w_2$ to the second neighbour,” the graph convolution says:

$$
\text{collect all neighbour information by a symmetric operation such as sum}
$$

Then every node uses the same shared parameters.

---

## 5.4 Message-passing neural networks

For each node $n$ and layer $l$, the model maintains a node embedding:

$$
h_n^{(l)} \in \mathbb{R}^D
$$

The initial embedding is the observed node feature:

$$
h_n^{(0)} = x_n
$$

The message-passing update has two stages.

### Stage 1: Aggregate neighbour messages

$$
z_n^{(l)}
=
\operatorname{Aggregate}
\left(
\left\{
h_m^{(l)} : m \in \mathcal{N}(n)
\right\}
\right)
$$

This collects information from the neighbours of node $n$.

### Stage 2: Update the node embedding

$$
h_n^{(l+1)}
=
\operatorname{Update}
\left(
h_n^{(l)}, z_n^{(l)}
\right)
$$

This combines the node’s current embedding with the aggregated neighbour information.

### Algorithmic view

For each layer $l = 0, \ldots, L-1$:

1. For every node $n$, collect embeddings from neighbours $m \in \mathcal{N}(n)$.
2. Aggregate those neighbour embeddings using a permutation-invariant function.
3. Combine the aggregate with the node’s current embedding.
4. Produce the next-layer embedding $h_n^{(l+1)}$.

---

## 5.5 Aggregation functions

Aggregation functions must satisfy two requirements:

1. They must be **permutation-invariant**.
2. They must handle **variable-sized neighbourhoods**.

### Simple summation

$$
\operatorname{Aggregate}
\left(
\left\{h_m^{(l)}\right\}
\right)
=
\sum_{m \in \mathcal{N}(n)} h_m^{(l)}
$$

This sums all neighbour embeddings.

### Mean aggregation

$$
\operatorname{Aggregate}
\left(
\left\{h_m^{(l)}\right\}
\right)
=
\frac{1}{|\mathcal{N}(n)|}
\sum_{m \in \mathcal{N}(n)} h_m^{(l)}
$$

This averages all neighbour embeddings.

### Other possible aggregators

The slides list:

- element-wise maximum,
- element-wise minimum,
- attention-weighted aggregation.

### Intuition

A graph node can have any number of neighbours. Aggregation must therefore turn a set of neighbour embeddings into a fixed-size vector, without depending on the order in which those neighbours are listed.

---

## 5.6 Aggregation with learnable parameters

The slides give a universal aggregation function:

$$
\operatorname{Aggregate}
\left(
\left\{
h_m^{(l)}
\right\}
\right)
=
\operatorname{MLP}_{\theta}
\left(
\sum_{m \in \mathcal{N}(n)}
\operatorname{MLP}_{\phi}
\left(
h_m^{(l)}
\right)
\right)
$$

### Components

- $\operatorname{MLP}_{\phi}$ transforms each neighbour embedding.
- The summation aggregates transformed neighbour embeddings in a permutation-invariant way.
- $\operatorname{MLP}_{\theta}$ transforms the aggregated result.
- Both MLPs are shared across all nodes.
- The slide states that this is a universal approximator for permutation-invariant functions.

### Intuition

The model first learns how to represent each neighbour, then sums those representations, then learns how to interpret the resulting aggregate.

---

## 5.7 Update functions

The slides give a simple linear update:

$$
\operatorname{Update}
\left(
h_n^{(l)}, z_n^{(l)}
\right)
=
f
\left(
W_{\text{self}} h_n^{(l)}
+
W_{\text{neigh}} z_n^{(l)}
+
b
\right)
$$

where $f(\cdot)$ is a nonlinear activation function.

### Simplified shared-weight version

The slides also give:

$$
h_n^{(l+1)}
=
f
\left(
W_{\text{neigh}}
\left(
\sum_{m \in \mathcal{N}(n) \cup \{n\}}
h_m^{(l)}
\right)
+
b
\right)
$$

where $f(\cdot)$ may be, for example, ReLU.

### Intuition

The first version treats the node’s own previous embedding separately from its neighbours.

The simplified version includes the node itself in the aggregation:

$$
\mathcal{N}(n) \cup \{n\}
$$

so the node’s own embedding is summed along with neighbour embeddings.

---

# 6. Machine-learning tasks on graphs

The slides divide graph machine-learning tasks into several categories.

## 6.1 Node-level tasks

Node-level tasks make predictions for individual nodes.

Examples:

- Node classification, such as classifying document topics.
- Node regression.

### Node classification output layer

For node $n$, class $i$, and final-layer embedding $h_n^{(L)}$, the output softmax is:

$$
y_{ni}
=
\frac{
\exp \left( w_i^T h_n^{(L)} \right)
}{
\sum_j
\exp \left( w_j^T h_n^{(L)} \right)
}
$$

where:

- $y_{ni}$ is the predicted probability that node $n$ belongs to class $i$,
- $w_i$ is the weight vector for class $i$,
- $h_n^{(L)}$ is the final-layer node embedding.

### Node classification loss

The cross-entropy loss is:

$$
\mathcal{L}
=
-
\sum_{n \in V_{\text{train}}}
\sum_{i=1}^{C}
t_{ni}
\log y_{ni}
$$

where:

- $V_{\text{train}}$ is the set of training nodes,
- $C$ is the number of classes,
- $t_{ni}$ is the target label indicator,
- $y_{ni}$ is the predicted probability.

The weights $\{w_i\}$ are shared across nodes, which makes the node classifier equivariant.

---

## 6.2 Inductive vs transductive learning

### Inductive learning

In inductive learning:

- Test nodes are not available during training.
- It is standard supervised learning.
- The model must generalise to unseen graph structures.

### Transductive learning

In transductive learning:

- The entire graph structure is known during training.
- Some nodes are labelled.
- Other nodes are unlabelled.
- Unlabelled nodes still participate in message passing.
- This is a form of semi-supervised learning.

Example from the slides:

- Bot detection in a large social network.

### Intuition

In transductive learning, the model can use the graph position and connections of unlabelled nodes, even though their labels are unknown. Their embeddings can still influence and be influenced by nearby labelled nodes through message passing.

---

## 6.3 Edge-level tasks

Edge-level tasks make predictions about edges.

Examples:

- Edge prediction.
- Graph completion.
- Link prediction, such as social recommendations.

### Edge classification / edge completion

The slide describes an edge completion task: predicting missing edges.

A simple dot-product approach is:

$$
p(n,m)
=
\sigma
\left(
h_n^T h_m
\right)
$$

where:

- $p(n,m)$ is the predicted probability of an edge between nodes $n$ and $m$,
- $h_n$ and $h_m$ are learned node embeddings,
- $\sigma(\cdot)$ is the logistic sigmoid function.

### Intuition

The dot product measures similarity between node embeddings. If two node embeddings point in similar directions, their dot product is high, and the model predicts a higher probability that an edge exists between them.

Example from the slides:

- Predicting protein interactions.

---

## 6.4 Graph-level tasks

Graph-level tasks make one prediction for an entire graph.

Examples:

- Graph classification, such as molecular toxicity.
- Graph regression, such as molecular solubility.

### Graph classification readout

For graph classification, the model needs an invariant aggregation over all nodes.

The simple summation readout is:

$$
y
=
f
\left(
\sum_{n \in V}
h_n^{(L)}
\right)
$$

where:

- $h_n^{(L)}$ is the final embedding of node $n$,
- the sum aggregates over all nodes,
- $f$ is a function such as a linear transformation or MLP.

### Alternatives

#### Mean pooling

$$
\frac{1}{|V|}
\sum_{n \in V}
h_n^{(L)}
$$

#### Max pooling

Element-wise maximum over node embeddings.

#### Attention-weighted aggregation

A learned attention mechanism assigns different weights to different nodes.

### Intuition

Graph-level prediction requires permutation invariance because the output should not depend on the ordering of nodes in the input matrix.

---

## 6.5 Graph representation learning

Graph representation learning means learning useful embeddings for later tasks.

The slides mention:

- learning useful embeddings for downstream tasks,
- foundation models for molecules, documents, and related graph-structured domains.

---

# 7. General graph neural networks

## 7.1 Graph attention networks

Graph attention networks weight neighbour contributions using learned attention.

### Attention-weighted aggregation

The slide gives:

$$
z_n^{(l)}
=
\sum_{m \in \mathcal{N}(n)}
A_{nm} h_m^{(l)}
$$

where $A_{nm}$ is an attention coefficient.

### Attention coefficient constraints

The attention coefficients satisfy:

$$
A_{nm} \geq 0
$$

and

$$
\sum_{m \in \mathcal{N}(n)}
A_{nm}
=
1
$$

So the neighbours’ contributions form a weighted average.

### Computing attention

The slide gives the example:

$$
A_{nm}
=
\frac{
\exp
\left(
h_n^T W h_m
\right)
}{
\sum_{m' \in \mathcal{N}(n)}
\exp
\left(
h_n^T W h_{m'}
\right)
}
$$

where:

- $h_n$ is the embedding of the receiving node,
- $h_m$ is the embedding of neighbour $m$,
- $W$ is a learnable weight matrix,
- the denominator normalises over neighbours $m' \in \mathcal{N}(n)$.

### Intuition

Instead of treating all neighbours equally, graph attention lets the model learn which neighbours are more important for updating a node.

### Notation warning

The slides use $A$ both for the adjacency matrix earlier and for attention coefficients here. In this section, $A_{nm}$ refers to an **attention weight**, not necessarily the binary adjacency-matrix entry.

---

## 7.2 Multi-head graph attention

The slides describe multi-head graph attention as follows:

- Compute $H$ independent attention mechanisms.
- Each attention head has its own parameters.
- Concatenate or average the outputs.
- This is similar to multi-head attention in Transformers.

### Connection to Transformers

The slide states:

$$
\text{Fully-connected graph}
\Rightarrow
\text{Transformer encoder}
$$

and:

$$
\text{Multi-head graph attention generalises this.}
$$

So a Transformer encoder can be viewed as a special case where every node/token attends to every other node/token.

---

## 7.3 Edge and graph embeddings

The slides then generalise message passing to include embeddings for:

- nodes,
- edges,
- whole graphs.

### Embeddings

Node embeddings:

$$
h_n^{(l)}
$$

Edge embeddings:

$$
e_{nm}^{(l)}
$$

Graph embeddings:

$$
g^{(l)}
$$

### Edge update

$$
e_{nm}^{(l+1)}
=
\operatorname{Update}_{\text{edge}}
\left(
e_{nm}^{(l)},
h_n^{(l)},
h_m^{(l)},
g^{(l)}
\right)
$$

The next edge embedding depends on:

- the previous edge embedding,
- the embedding of node $n$,
- the embedding of node $m$,
- the current graph-level embedding.

### Node aggregation from edges

$$
z_n^{(l+1)}
=
\operatorname{Aggregate}_{\text{node}}
\left(
\left\{
e_{nm}^{(l+1)} : m \in \mathcal{N}(n)
\right\}
\right)
$$

The node receives information through updated edge embeddings.

### Node update

$$
h_n^{(l+1)}
=
\operatorname{Update}_{\text{node}}
\left(
h_n^{(l)},
z_n^{(l+1)},
g^{(l)}
\right)
$$

The next node embedding depends on:

- the previous node embedding,
- the aggregated incoming edge information,
- the graph-level embedding.

### Graph update

$$
g^{(l+1)}
=
\operatorname{Update}_{\text{graph}}
\left(
g^{(l)},
\left\{
h_n^{(l+1)}
\right\},
\left\{
e_{nm}^{(l+1)}
\right\}
\right)
$$

The graph-level embedding is updated using:

- the previous graph embedding,
- the updated node embeddings,
- the updated edge embeddings.

### Visual structure from the slide

The diagram on page 29 shows information being represented at multiple levels:

- local node states $h$,
- edge states $e$,
- global graph state $g$.

The visual progression illustrates that message passing can update not only nodes, but also edges and graph-level context.

---

## 7.4 Over-smoothing problem

### Definition

Over-smoothing is the problem where node embeddings become too similar after many GNN layers.

The slides state that this limits effective network depth.

### Intuition

Repeated message passing mixes neighbouring information again and again. After many layers, node embeddings may lose their individuality and become hard to distinguish.

### Solution 1: residual connections

The slide gives:

$$
h_n^{(l+1)}
=
\operatorname{Update}
\left(
h_n^{(l)},
z_n^{(l+1)},
g^{(l)}
\right)
+
h_n^{(l)}
$$

The previous embedding is added directly to the updated embedding.

### Solution 2: skip connections

The slide gives:

$$
y_n
=
f
\left(
h_n^{(1)}
\oplus
h_n^{(2)}
\oplus
\cdots
\oplus
h_n^{(L)}
\right)
$$

where:

$$
\oplus
$$

denotes concatenation.

### Intuition

Skip connections allow the final prediction to use embeddings from several depths, rather than relying only on the final heavily-smoothed embedding.

---

## 7.5 Regularisation techniques

The slides divide regularisation into standard methods and graph-specific methods.

### Standard methods

- Weight decay / $L^2$ regularisation.
- Dropout on node embeddings.
- Early stopping.

### Graph-specific methods

#### Weight sharing across layers

This reduces the number of parameters.

#### Node dropout

Randomly omit nodes during training.

#### Edge dropout

Randomly mask edges during training.

---

## 7.6 Geometric deep learning

The final technical section introduces geometric constraints for molecular structures.

### Spatial symmetries

For molecular structures, the slides list:

- translation invariance,
- rotation invariance,
- reflection invariance.

### Equivariant spatial embeddings

The slide introduces spatial embeddings:

$$
r_n^{(l)} \in \mathbb{R}^3
$$

These represent 3D positions or spatial embeddings for nodes.

### Edge update using distance

$$
e_{nm}^{(l+1)}
=
\operatorname{Update}_{\text{edge}}
\left(
e_{nm}^{(l)},
h_n^{(l)},
h_m^{(l)},
\left\|
r_n^{(l)}
-
r_m^{(l)}
\right\|_2
\right)
$$

The edge update uses the Euclidean distance between node positions:

$$
\left\|
r_n^{(l)}
-
r_m^{(l)}
\right\|_2
$$

This distance is unaffected by translation and rotation.

### Spatial update

The slide gives:

$$
r_n^{(l+1)}
=
r_n^{(l)}
+
C
\sum_{(n,m) \in E}
\left(
r_n^{(l)}
-
r_m^{(l)}
\right)
\phi
\left(
e_{nm}^{(l+1)}
\right)
$$

where:

- $r_n^{(l)}$ is the current spatial embedding of node $n$,
- $C$ is a constant,
- the sum is over edges $(n,m) \in E$,
- $\phi(e_{nm}^{(l+1)})$ is a learned function of the updated edge embedding.

The slide states that this gives built-in invariance/equivariance to 3D transformations.

---

# 8. Key concepts

## 8.1 Graph

**Intuition:** A graph represents objects and relationships.

**Formal definition:**

$$
G = (V,E)
$$

where $V$ is the node set and $E$ is the edge set.

---

## 8.2 Node feature matrix

**Intuition:** A matrix storing one feature vector per node.

**Formal definition:**

$$
X \in \mathbb{R}^{N \times D}
$$

with row $n$ corresponding to $x_n^T$, where:

$$
x_n \in \mathbb{R}^D
$$

---

## 8.3 Adjacency matrix

**Intuition:** A table saying which nodes are connected.

**Formal definition:**

$$
A_{nm}
=
1
\quad
\text{if there is an edge from } n \text{ to } m
$$

and

$$
A_{nm}
=
0
\quad
\text{otherwise.}
$$

For undirected graphs:

$$
A = A^T
$$

---

## 8.4 Permutation matrix

**Intuition:** A matrix that reorders nodes.

**Formal definition:**

$$
P =
\begin{pmatrix}
u^T_{\pi(1)} \\
u^T_{\pi(2)} \\
\vdots \\
u^T_{\pi(N)}
\end{pmatrix}
$$

where $u_n$ is the $n$-th standard basis vector.

---

## 8.5 Permutation invariance

**Intuition:** Reordering nodes does not change the output.

**Formal definition:**

$$
y(\tilde{X}, \tilde{A}) = y(X,A)
$$

Used for graph-level prediction tasks.

---

## 8.6 Permutation equivariance

**Intuition:** Reordering nodes reorders the output in the same way.

**Formal definition:**

$$
y(\tilde{X}, \tilde{A}) = P y(X,A)
$$

Used for node-level prediction tasks.

---

## 8.7 Message passing

**Intuition:** Each node repeatedly gathers information from its neighbours and updates its embedding.

**Formal structure:**

$$
z_n^{(l)}
=
\operatorname{Aggregate}
\left(
\left\{
h_m^{(l)} : m \in \mathcal{N}(n)
\right\}
\right)
$$

$$
h_n^{(l+1)}
=
\operatorname{Update}
\left(
h_n^{(l)}, z_n^{(l)}
\right)
$$

with:

$$
h_n^{(0)} = x_n
$$

---

## 8.8 Graph attention

**Intuition:** A node does not treat all neighbours equally; it learns attention weights for neighbours.

**Formal aggregation:**

$$
z_n^{(l)}
=
\sum_{m \in \mathcal{N}(n)}
A_{nm}h_m^{(l)}
$$

with:

$$
A_{nm} \ge 0
$$

and

$$
\sum_{m \in \mathcal{N}(n)} A_{nm} = 1
$$

---

## 8.9 Over-smoothing

**Intuition:** After many message-passing layers, node embeddings can become too similar.

**Slide definition:** Node embeddings become too similar after many layers, limiting effective network depth.

---

# 9. Formula sheet

## 9.1 Node and graph notation

$$
G = (V,E)
$$

$$
n = 1,\ldots,N
$$

$$
(n,m)
$$

$$
\mathcal{N}(n)
$$

$$
x_n \in \mathbb{R}^D
$$

$$
X \in \mathbb{R}^{N \times D}
$$

## 9.2 Adjacency matrix

$$
A_{nm}
=
\begin{cases}
1, & \text{edge from } n \text{ to } m, \\
0, & \text{otherwise.}
\end{cases}
$$

For undirected graphs:

$$
A = A^T
$$

## 9.3 Permutation transformations

$$
\tilde{X} = PX
$$

$$
\tilde{A} = P A P^T
$$

## 9.4 Invariance

$$
y(\tilde{X}, \tilde{A}) = y(X,A)
$$

## 9.5 Equivariance

$$
y(\tilde{X}, \tilde{A}) = P y(X,A)
$$

## 9.6 Standard CNN-style convolution shown in slides

$$
z_i^{(l+1)}
=
f
\left(
\sum_j w_j z_j^{(l)} + b
\right)
$$

## 9.7 Equivariant graph convolution

$$
z_i^{(l+1)}
=
f
\left(
w_{\text{neigh}}
\sum_{j \in \mathcal{N}(i)}
z_j^{(l)}
+
w_{\text{self}}z_i^{(l)}
+
b
\right)
$$

## 9.8 Message passing

$$
h_n^{(0)} = x_n
$$

$$
z_n^{(l)}
=
\operatorname{Aggregate}
\left(
\left\{
h_m^{(l)} : m \in \mathcal{N}(n)
\right\}
\right)
$$

$$
h_n^{(l+1)}
=
\operatorname{Update}
\left(
h_n^{(l)},z_n^{(l)}
\right)
$$

## 9.9 Sum aggregation

$$
\operatorname{Aggregate}
\left(
\left\{h_m^{(l)}\right\}
\right)
=
\sum_{m \in \mathcal{N}(n)}
h_m^{(l)}
$$

## 9.10 Mean aggregation

$$
\operatorname{Aggregate}
\left(
\left\{h_m^{(l)}\right\}
\right)
=
\frac{1}{|\mathcal{N}(n)|}
\sum_{m \in \mathcal{N}(n)}
h_m^{(l)}
$$

## 9.11 Learnable universal aggregation

$$
\operatorname{Aggregate}
\left(
\left\{
h_m^{(l)}
\right\}
\right)
=
\operatorname{MLP}_{\theta}
\left(
\sum_{m \in \mathcal{N}(n)}
\operatorname{MLP}_{\phi}
\left(
h_m^{(l)}
\right)
\right)
$$

## 9.12 Linear update

$$
\operatorname{Update}
\left(
h_n^{(l)}, z_n^{(l)}
\right)
=
f
\left(
W_{\text{self}}h_n^{(l)}
+
W_{\text{neigh}}z_n^{(l)}
+
b
\right)
$$

## 9.13 Simplified shared-weight update

$$
h_n^{(l+1)}
=
f
\left(
W_{\text{neigh}}
\left(
\sum_{m \in \mathcal{N}(n) \cup \{n\}}
h_m^{(l)}
\right)
+
b
\right)
$$

## 9.14 Node classification softmax

$$
y_{ni}
=
\frac{
\exp(w_i^T h_n^{(L)})
}{
\sum_j \exp(w_j^T h_n^{(L)})
}
$$

## 9.15 Node classification cross-entropy

$$
\mathcal{L}
=
-
\sum_{n \in V_{\text{train}}}
\sum_{i=1}^{C}
t_{ni}
\log y_{ni}
$$

## 9.16 Graph classification readout

$$
y
=
f
\left(
\sum_{n \in V}
h_n^{(L)}
\right)
$$

## 9.17 Edge prediction

$$
p(n,m)
=
\sigma
\left(
h_n^T h_m
\right)
$$

## 9.18 Graph attention aggregation

$$
z_n^{(l)}
=
\sum_{m \in \mathcal{N}(n)}
A_{nm}h_m^{(l)}
$$

$$
A_{nm} \ge 0
$$

$$
\sum_{m \in \mathcal{N}(n)}
A_{nm}
=
1
$$

## 9.19 Attention coefficient example

$$
A_{nm}
=
\frac{
\exp(h_n^TWh_m)
}{
\sum_{m' \in \mathcal{N}(n)}
\exp(h_n^TWh_{m'})
}
$$

## 9.20 Edge/global message passing

$$
e_{nm}^{(l+1)}
=
\operatorname{Update}_{\text{edge}}
\left(
e_{nm}^{(l)},
h_n^{(l)},
h_m^{(l)},
g^{(l)}
\right)
$$

$$
z_n^{(l+1)}
=
\operatorname{Aggregate}_{\text{node}}
\left(
\left\{
e_{nm}^{(l+1)} : m \in \mathcal{N}(n)
\right\}
\right)
$$

$$
h_n^{(l+1)}
=
\operatorname{Update}_{\text{node}}
\left(
h_n^{(l)},
z_n^{(l+1)},
g^{(l)}
\right)
$$

$$
g^{(l+1)}
=
\operatorname{Update}_{\text{graph}}
\left(
g^{(l)},
\{h_n^{(l+1)}\},
\{e_{nm}^{(l+1)}\}
\right)
$$

## 9.21 Residual connection for over-smoothing

$$
h_n^{(l+1)}
=
\operatorname{Update}
\left(
h_n^{(l)},
z_n^{(l+1)},
g^{(l)}
\right)
+
h_n^{(l)}
$$

## 9.22 Skip connection for over-smoothing

$$
y_n
=
f
\left(
h_n^{(1)}
\oplus
h_n^{(2)}
\oplus
\cdots
\oplus
h_n^{(L)}
\right)
$$

## 9.23 Geometric deep learning edge update

$$
e_{nm}^{(l+1)}
=
\operatorname{Update}_{\text{edge}}
\left(
e_{nm}^{(l)},
h_n^{(l)},
h_m^{(l)},
\left\|
r_n^{(l)}
-
r_m^{(l)}
\right\|_2
\right)
$$

## 9.24 Geometric spatial update

$$
r_n^{(l+1)}
=
r_n^{(l)}
+
C
\sum_{(n,m) \in E}
\left(
r_n^{(l)}
-
r_m^{(l)}
\right)
\phi
\left(
e_{nm}^{(l+1)}
\right)
$$

---

# 10. Connections to earlier material and applications

## 10.1 Connection to previous lecture material

The lecture connects GNNs to earlier structured-data models:

- Sequences as 1D arrays handled by RNNs and Transformers.
- Images as 2D arrays handled by CNNs.
- Graphs as irregular relational structures requiring different architectures.

## 10.2 Connection to CNNs

The message-passing framework is inspired by convolutional neural networks for images.

The lecture moves from standard CNN convolution to graph convolution by replacing position-dependent neighbour weights with shared neighbour weights and permutation-invariant summation.

## 10.3 Connection to Transformers

Multi-head graph attention is connected to Transformers.

The slide states that a fully connected graph gives a Transformer encoder, and that multi-head graph attention generalises this.

## 10.4 Connection to semi-supervised learning

Transductive node classification is described as a form of semi-supervised learning because the full graph is known, but only some nodes are labelled. Unlabelled nodes still participate in message passing.

## 10.5 Application areas mentioned

The slides mention applications including:

- molecular solubility prediction,
- molecular toxicity classification,
- protein interaction prediction,
- document-topic classification,
- social recommendations,
- bot detection in social networks,
- foundation models for molecules and documents.

---

# 11. Exam flags and high-value revision points

## 11.1 Explicit “should be able to” items

The intended learning outcomes are the clearest exam-revision checklist:

- Standard neural networks cannot directly process graph-structured data because graph representations depend on arbitrary node ordering.
- The adjacency matrix changes under node reordering.
- Permutation matrices formalise node reordering.
- Permutation invariance is needed for graph-level predictions.
- Permutation equivariance is needed for node-level predictions.
- Message passing requires aggregation and update functions.
- GNNs can be applied to node-level, edge-level, and graph-level tasks.
- Architectural extensions include graph attention, residual connections, and geometric constraints.

## 11.2 High-value technical points from the slides

- The adjacency matrix cannot be used naively as a network input because the same graph can have many adjacency matrices depending on node order.
- Permutation invariance/equivariance should be built into the architecture rather than learned through data augmentation, because the number of permutations grows factorially with $N$.
- Aggregation functions must be permutation-invariant and must handle variable-sized neighbourhoods.
- Sum, mean, max/min, and attention-weighted aggregation are valid aggregation families.
- Over-smoothing limits effective GNN depth; residual and skip connections are presented as solutions.

---

# 12. Unclear or missing sections to check

- **[UNCLEAR / MISSING SOURCE]** The transcript was not included in the chat. These notes therefore cannot capture spoken explanations, verbal exam hints, lecturer emphasis, derivation steps spoken aloud, or transcript-only worked examples.
- **[UNCLEAR]** Slide 15 says the standard CNN convolution is “Not equivariant” because the weight vector $\{w_j\}$ depends on ordering. In revision, check the recording for the exact wording, because this likely refers to arbitrary graph node/neighbour permutations rather than ordinary image-grid translation behaviour.
- **[UNCLEAR]** Slide 27 uses $A_{nm}$ for attention coefficients, while earlier slides use $A$ for the adjacency matrix. Check whether the lecturer explicitly distinguished these notations.
- **[UNCLEAR]** The geometric deep learning slide gives the spatial update with constant $C$ and function $\phi(e_{nm}^{(l+1)})$, but the slides do not define $C$ or $\phi$ in detail. Check the transcript/audio for whether these were explained.

