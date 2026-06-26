---
subject: COMP64501
chapter: 30
title: "Graph Neural Networks — Question Bank"
language: en
---

# COMP64501 Chapter 10 — Graph Neural Networks  
## Worked computational question bank

Built from the uploaded lecture sheet on **Graph Neural Networks**. The questions below drill the computational task types that appear in the sheet: adjacency matrices, node reordering, permutation matrices, invariance/equivariance checks, message passing, aggregation, node/edge/graph prediction layers, graph attention, residual/skip connections, edge/global updates, and geometric updates.

The solutions are deliberately step-by-step. For procedural questions, the solution models the kind of written working you should put in an exam or worksheet: **Step 1**, **Step 2**, and so on.

---

## Task types identified from the sheet

The lecture sheet covers these computational task types:

1. **Representing a graph as an adjacency matrix** from an edge list, including the fact that undirected simple graphs have symmetric adjacency matrices.
2. **Reordering nodes** and computing the new adjacency matrix for the same graph under a new node order.
3. **Constructing and applying permutation matrices**, especially
   
$$

   \tilde X = PX, \qquad \tilde A = PAP^T.
   
$$

4. **Checking permutation invariance and equivariance**, especially graph-level outputs versus node-level outputs.
5. **Computing graph-convolution/message-passing updates**, including neighbour aggregation and update functions.
6. **Computing sum, mean, max/min, and learnable-style aggregations** over variable-sized neighbourhoods.
7. **Computing node-classification softmax probabilities** and cross-entropy over the labelled training nodes.
8. **Distinguishing inductive and transductive node-learning setups**, especially where unlabelled nodes still participate in message passing.
9. **Computing edge/link prediction scores** using a dot product followed by a sigmoid.
10. **Computing graph-level readouts** using sum, mean, max, or attention-style pooling.
11. **Computing graph-attention coefficients** and attention-weighted neighbour aggregates.
12. **Using multi-head graph attention outputs**, by concatenating or averaging heads.
13. **Updating edge, node, and graph-level embeddings** in a general GNN block.
14. **Diagnosing over-smoothing** and computing residual/skip-connection fixes.
15. **Computing geometric distances and spatial updates** in geometric deep learning.
16. **Hard edge cases** where methods disagree or break down: wrong permutation handling, isolated nodes, sum versus mean disagreement, attention over non-neighbours, dot-product symmetry, over-smoothing, graph-size sensitivity, and reflection/distance-only limitations.

---

# Section 1 — Mechanical / single-step examples

These are the basic hand-calculation moves. They are quick, but they are the building blocks for everything later.

---

## Q1.1 — Build the adjacency matrix for the lecture sheet’s running graph

The lecture sheet’s running graph has nodes


$$

A,B,C,D,E

$$


and undirected edges


$$

(A,C),\ (B,C),\ (C,D),\ (C,E),\ (D,E).

$$


Using node order $(A,B,C,D,E)$, write the adjacency matrix $A$.

### Solution

**Step 1 — Write the node order on both rows and columns.**

The row and column order is


$$

(A,B,C,D,E).

$$


So row 1 and column 1 correspond to $A$, row 2 and column 2 correspond to $B$, and so on.

**Step 2 — Use the adjacency rule.**

For a simple graph,


$$

A_{nm}=1

$$


if there is an edge between node $n$ and node $m$, and


$$

A_{nm}=0

$$


otherwise.

Because the graph is undirected, whenever $A_{nm}=1$, we also have $A_{mn}=1$.

**Step 3 — Fill in the rows.**

- $A$ is connected only to $C$, so row $A$ is $[0,0,1,0,0]$.
- $B$ is connected only to $C$, so row $B$ is $[0,0,1,0,0]$.
- $C$ is connected to $A,B,D,E$, so row $C$ is $[1,1,0,1,1]$.
- $D$ is connected to $C,E$, so row $D$ is $[0,0,1,0,1]$.
- $E$ is connected to $C,D$, so row $E$ is $[0,0,1,1,0]$.

**Step 4 — Write the matrix.**


$$

A=
\begin{pmatrix}
0 & 0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 \\
1 & 1 & 0 & 1 & 1 \\
0 & 0 & 1 & 0 & 1 \\
0 & 0 & 1 & 1 & 0
\end{pmatrix}.

$$


**Step 5 — Check symmetry.**

The matrix is symmetric, so it is consistent with an undirected graph:


$$

A=A^T.

$$


---

## Q1.2 — Reorder the running graph and rebuild the adjacency matrix

Use the same graph as Q1.1, but now use node order


$$

(C,E,A,D,B).

$$


Write the reordered adjacency matrix $\tilde A$.

### Solution

**Step 1 — Write the new row/column order.**

The new order is


$$

(C,E,A,D,B).

$$


So the columns are also in the order


$$

(C,E,A,D,B).

$$


**Step 2 — Fill the row for $C$.**

Node $C$ is connected to $A,B,D,E$. In the new column order $(C,E,A,D,B)$, this gives


$$

[0,1,1,1,1].

$$


**Step 3 — Fill the row for $E$.**

Node $E$ is connected to $C,D$. In the new column order, this gives


$$

[1,0,0,1,0].

$$


**Step 4 — Fill the row for $A$.**

Node $A$ is connected only to $C$, so the row is


$$

[1,0,0,0,0].

$$


**Step 5 — Fill the row for $D$.**

Node $D$ is connected to $C,E$, so the row is


$$

[1,1,0,0,0].

$$


**Step 6 — Fill the row for $B$.**

Node $B$ is connected only to $C$, so the row is


$$

[1,0,0,0,0].

$$


**Step 7 — Write the full matrix.**


$$

\tilde A=
\begin{pmatrix}
0 & 1 & 1 & 1 & 1 \\
1 & 0 & 0 & 1 & 0 \\
1 & 0 & 0 & 0 & 0 \\
1 & 1 & 0 & 0 & 0 \\
1 & 0 & 0 & 0 & 0
\end{pmatrix}.

$$


This is the same graph, but represented using a different node ordering.

---

## Q1.3 — Construct the permutation matrix for the lecture sheet’s reordered graph

The original order is


$$

(A,B,C,D,E),

$$


and the new order is


$$

(C,E,A,D,B).

$$


Construct the permutation matrix $P$ such that


$$

\tilde A=PAP^T.

$$


### Solution

**Step 1 — Convert nodes to original indices.**

In the original order $(A,B,C,D,E)$, the indices are


$$

A=1,\quad B=2,\quad C=3,\quad D=4,\quad E=5.

$$


The new order $(C,E,A,D,B)$ therefore corresponds to original indices


$$

(3,5,1,4,2).

$$


**Step 2 — Write each row of $P$.**

A permutation matrix has one 1 in each row. The row selects the corresponding old row.

The rows should select old rows 3, 5, 1, 4, and 2.

So


$$

P=
\begin{pmatrix}
0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 \\
1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 \\
0 & 1 & 0 & 0 & 0
\end{pmatrix}.

$$


**Step 3 — Interpret the multiplication.**

- Left-multiplying by $P$ reorders the rows.
- Right-multiplying by $P^T$ reorders the columns in the same way.

Therefore


$$

\tilde A=PAP^T

$$


is the adjacency matrix under the new node order $(C,E,A,D,B)$.

---

## Q1.4 — Compute sum, mean, max, and min aggregation

A node $n$ has three neighbours with embeddings


$$

h_1=(1,2),\qquad h_3=(0,1),\qquad h_4=(3,-1).

$$


Compute the sum, mean, element-wise max, and element-wise min aggregations.

### Solution

**Step 1 — Sum the neighbour embeddings.**


$$

(1,2)+(0,1)+(3,-1)=(4,2).

$$


So the sum aggregate is


$$

z_n=(4,2).

$$


**Step 2 — Compute the mean aggregate.**

There are 3 neighbours, so


$$

z_n=\frac{1}{3}(4,2)=\left(\frac{4}{3},\frac{2}{3}\right).

$$


**Step 3 — Compute the element-wise maximum.**

For the first coordinate:


$$

\max(1,0,3)=3.

$$


For the second coordinate:


$$

\max(2,1,-1)=2.

$$


So the max aggregate is


$$

(3,2).

$$


**Step 4 — Compute the element-wise minimum.**

For the first coordinate:


$$

\min(1,0,3)=0.

$$


For the second coordinate:


$$

\min(2,1,-1)=-1.

$$


So the min aggregate is


$$

(0,-1).

$$


---

## Q1.5 — Compute one scalar graph-convolution update

Use the sheet’s equivariant graph-convolution form


$$

z_i^{(l+1)}=
\operatorname{ReLU}
\left(
 w_{\text{neigh}}
 \sum_{j\in\mathcal N(i)} z_j^{(l)}
 +w_{\text{self}}z_i^{(l)}+b
\right).

$$


Suppose


$$

z_i^{(l)}=2,

$$


and node $i$ has two neighbours with embeddings


$$

-1 \quad \text{and} \quad 3.

$$


Let


$$

w_{\text{neigh}}=0.5,\qquad w_{\text{self}}=1.25,\qquad b=-2.

$$


Compute $z_i^{(l+1)}$.

### Solution

**Step 1 — Sum the neighbour embeddings.**


$$

\sum_{j\in\mathcal N(i)}z_j^{(l)}=-1+3=2.

$$


**Step 2 — Multiply by the neighbour weight.**


$$

w_{\text{neigh}}\sum_{j\in\mathcal N(i)}z_j^{(l)}=0.5\times 2=1.

$$


**Step 3 — Multiply the self embedding by the self weight.**


$$

w_{\text{self}}z_i^{(l)}=1.25\times 2=2.5.

$$


**Step 4 — Add everything before the activation.**


$$

1+2.5-2=1.5.

$$


**Step 5 — Apply ReLU.**


$$

\operatorname{ReLU}(1.5)=1.5.

$$


Therefore


$$

z_i^{(l+1)}=1.5.

$$


---

## Q1.6 — Compute one vector-valued update

Use the update function


$$

\operatorname{Update}(h_n^{(l)},z_n^{(l)})
=
\operatorname{ReLU}
\left(
W_{\text{self}}h_n^{(l)}+W_{\text{neigh}}z_n^{(l)}+b
\right).

$$


Let


$$

h_n^{(l)}=\begin{pmatrix}1\\-1\end{pmatrix},
\qquad
z_n^{(l)}=\begin{pmatrix}2\\1\end{pmatrix},

$$



$$

W_{\text{self}}=
\begin{pmatrix}
1&0\\
0&1
\end{pmatrix},
\qquad
W_{\text{neigh}}=
\begin{pmatrix}
2&-1\\
1&1
\end{pmatrix},
\qquad
b=\begin{pmatrix}-1\\0\end{pmatrix}.

$$


Compute $h_n^{(l+1)}$.

### Solution

**Step 1 — Compute the self contribution.**


$$

W_{\text{self}}h_n^{(l)}
=
\begin{pmatrix}
1&0\\
0&1
\end{pmatrix}
\begin{pmatrix}1\\-1\end{pmatrix}
=
\begin{pmatrix}1\\-1\end{pmatrix}.

$$


**Step 2 — Compute the neighbour contribution.**


$$

W_{\text{neigh}}z_n^{(l)}
=
\begin{pmatrix}
2&-1\\
1&1
\end{pmatrix}
\begin{pmatrix}2\\1\end{pmatrix}.

$$


The first coordinate is


$$

2(2)+(-1)(1)=4-1=3.

$$


The second coordinate is


$$

1(2)+1(1)=3.

$$


So


$$

W_{\text{neigh}}z_n^{(l)}
=
\begin{pmatrix}3\\3\end{pmatrix}.

$$


**Step 3 — Add the self term, neighbour term, and bias.**


$$

\begin{pmatrix}1\\-1\end{pmatrix}
+
\begin{pmatrix}3\\3\end{pmatrix}
+
\begin{pmatrix}-1\\0\end{pmatrix}
=
\begin{pmatrix}3\\2\end{pmatrix}.

$$


**Step 4 — Apply ReLU element-wise.**

Both entries are positive, so


$$

h_n^{(l+1)}=
\begin{pmatrix}3\\2\end{pmatrix}.

$$


---

## Q1.7 — Compute node-classification softmax probabilities

A node has final embedding


$$

h_n^{(L)}=(1,2).

$$


There are three class-weight vectors:


$$

w_1=(1,0),\qquad w_2=(0,1),\qquad w_3=(1,1).

$$


Using


$$

y_{ni}=\frac{\exp(w_i^Th_n^{(L)})}{\sum_j \exp(w_j^Th_n^{(L)})},

$$


compute the class probabilities.

### Solution

**Step 1 — Compute the class scores.**


$$

s_1=w_1^Th_n^{(L)}=(1,0)\cdot(1,2)=1.

$$



$$

s_2=w_2^Th_n^{(L)}=(0,1)\cdot(1,2)=2.

$$



$$

s_3=w_3^Th_n^{(L)}=(1,1)\cdot(1,2)=3.

$$


**Step 2 — Exponentiate the scores.**


$$

\exp(1)\approx 2.718,
\qquad
\exp(2)\approx 7.389,
\qquad
\exp(3)\approx 20.086.

$$


**Step 3 — Compute the denominator.**


$$

2.718+7.389+20.086=30.193.

$$


**Step 4 — Divide each exponential by the denominator.**


$$

y_{n1}=\frac{2.718}{30.193}\approx 0.0900.

$$



$$

y_{n2}=\frac{7.389}{30.193}\approx 0.2447.

$$



$$

y_{n3}=\frac{20.086}{30.193}\approx 0.6652.

$$


So the node is most likely assigned to class 3.

---

## Q1.8 — Compute a dot-product edge probability

For an edge-level prediction task, use


$$

p(n,m)=\sigma(h_n^Th_m),

$$


where $\sigma(x)=1/(1+e^{-x})$.

Let


$$

h_n=(1,2),
\qquad
h_m=(2,1).

$$


Compute $p(n,m)$.

### Solution

**Step 1 — Compute the dot product.**


$$

h_n^Th_m=(1,2)\cdot(2,1)=1\times 2+2\times 1=4.

$$


**Step 2 — Apply the sigmoid.**


$$

p(n,m)=\sigma(4)=\frac{1}{1+e^{-4}}.

$$


Since $e^{-4}\approx 0.0183$,


$$

p(n,m)\approx \frac{1}{1+0.0183}=0.9820.

$$


So the model predicts a high probability of an edge.

---

## Q1.9 — Compute a graph-level readout

A graph has final node embeddings


$$

h_1^{(L)}=(1,0),\qquad h_2^{(L)}=(0,2),\qquad h_3^{(L)}=(2,1).

$$


Use the graph readout vector


$$

r=\sum_{n\in V}h_n^{(L)}.

$$


Then compute the binary graph output


$$

y=\sigma\left(v^Tr+b\right),

$$


where


$$

v=(1,0.5),\qquad b=-2.

$$


### Solution

**Step 1 — Sum the node embeddings.**


$$

r=(1,0)+(0,2)+(2,1)=(3,3).

$$


**Step 2 — Compute the classifier score.**


$$

v^Tr+b=(1,0.5)\cdot(3,3)-2.

$$



$$

=1\times 3+0.5\times 3-2.

$$



$$

=3+1.5-2=2.5.

$$


**Step 3 — Apply the sigmoid.**


$$

y=\sigma(2.5)=\frac{1}{1+e^{-2.5}}\approx 0.9241.

$$


So the graph-level predicted probability is approximately


$$

y\approx 0.924.

$$


---

# Section 2 — Multi-condition checks

These examples combine more than one rule at once: symmetry type, labelled versus unlabelled nodes, constraints on coefficients, and output-shape checks.

---

## Q2.1 — Check permutation equivariance for node-level outputs

A graph has three nodes. A node-level model returns


$$

y(X,A)=
\begin{pmatrix}
0.2\\
0.8\\
0.4
\end{pmatrix}.

$$


The nodes are reordered from original order $(1,2,3)$ to new order $(3,1,2)$.

The corresponding permutation matrix is


$$

P=
\begin{pmatrix}
0&0&1\\
1&0&0\\
0&1&0
\end{pmatrix}.

$$


If the model is permutation-equivariant, what output should it produce on the reordered graph?

### Solution

**Step 1 — Recall the equivariance condition.**

For node-level prediction, the correct condition is


$$

y(\tilde X,\tilde A)=Py(X,A).

$$


The values should not stay in the same row positions. They should be reordered with the nodes.

**Step 2 — Multiply by $P$.**


$$

Py(X,A)=
\begin{pmatrix}
0&0&1\\
1&0&0\\
0&1&0
\end{pmatrix}
\begin{pmatrix}
0.2\\
0.8\\
0.4
\end{pmatrix}.

$$


**Step 3 — Read off the reordered entries.**

The new order is $(3,1,2)$, so the outputs become


$$

\begin{pmatrix}
y_3\\y_1\\y_2
\end{pmatrix}
=
\begin{pmatrix}
0.4\\0.2\\0.8
\end{pmatrix}.

$$


Therefore a permutation-equivariant node-level model should output


$$

y(\tilde X,\tilde A)=
\begin{pmatrix}
0.4\\0.2\\0.8
\end{pmatrix}.

$$


---

## Q2.2 — Check permutation invariance for graph-level outputs

A graph-level model returns a toxicity probability


$$

y(X,A)=0.73.

$$


The same graph is represented under a different node order, producing $(\tilde X,\tilde A)$. If the graph-level model is permutation-invariant, what should $y(\tilde X,\tilde A)$ be?

### Solution

**Step 1 — Recall the graph-level requirement.**

For graph-level tasks, there is one prediction for the whole graph. The output should not depend on the order of the nodes.

So the condition is


$$

y(\tilde X,\tilde A)=y(X,A).

$$


**Step 2 — Substitute the original output.**


$$

y(\tilde X,\tilde A)=0.73.

$$


Therefore the reordered graph should still receive toxicity probability


$$

0.73.

$$


---

## Q2.3 — Compute cross-entropy over labelled training nodes only

A transductive node-classification problem has four nodes, but only nodes 1 and 3 are labelled.

The predicted class probabilities are


$$

y_1=(0.7,0.2,0.1),

$$



$$

y_3=(0.25,0.25,0.50).

$$


The target label for node 1 is class 1, and the target label for node 3 is class 3.

Using the sheet’s node-classification loss


$$

\mathcal L
=
-
\sum_{n\in V_{\text{train}}}
\sum_{i=1}^C
 t_{ni}\log y_{ni},

$$


compute the loss.

### Solution

**Step 1 — Identify the training nodes.**

Only nodes 1 and 3 are labelled, so


$$

V_{\text{train}}=\{1,3\}.

$$


Nodes 2 and 4 may still participate in message passing, but they do not appear in this supervised loss.

**Step 2 — Pick the predicted probability of the true class for node 1.**

Node 1 has true class 1, so use


$$

y_{1,1}=0.7.

$$


The node 1 loss contribution is


$$

-\log(0.7)\approx 0.3567.

$$


**Step 3 — Pick the predicted probability of the true class for node 3.**

Node 3 has true class 3, so use


$$

y_{3,3}=0.50.

$$


The node 3 loss contribution is


$$

-\log(0.50)\approx 0.6931.

$$


**Step 4 — Add the labelled-node contributions.**


$$

\mathcal L=0.3567+0.6931=1.0498.

$$


So the summed cross-entropy loss is approximately


$$

\mathcal L\approx 1.050.

$$


If an average loss over labelled nodes were requested, it would be


$$

\frac{1.0498}{2}\approx 0.5249,

$$


but the sheet’s displayed formula is the summed version.

---

## Q2.4 — Compute attention coefficients and check their constraints

Node $n$ has embedding


$$

h_n=(1,1),

$$


and three neighbours have embeddings


$$

h_a=(1,0),\qquad h_b=(0,2),\qquad h_c=(1,1).

$$


Let $W=I$, the identity matrix. Use the attention formula


$$

A_{nm}=
\frac{\exp(h_n^TWh_m)}
{\sum_{m'\in\mathcal N(n)}\exp(h_n^TWh_{m'})}.

$$


Compute the attention coefficients and the attention-weighted aggregate


$$

z_n=\sum_{m\in\mathcal N(n)}A_{nm}h_m.

$$


### Solution

**Step 1 — Compute the score for neighbour $a$.**

Because $W=I$,


$$

h_n^TWh_a=h_n^Th_a=(1,1)\cdot(1,0)=1.

$$


**Step 2 — Compute the score for neighbour $b$.**


$$

h_n^TWh_b=(1,1)\cdot(0,2)=2.

$$


**Step 3 — Compute the score for neighbour $c$.**


$$

h_n^TWh_c=(1,1)\cdot(1,1)=2.

$$


So the raw scores are


$$

1,2,2.

$$


**Step 4 — Exponentiate and normalise.**


$$

\exp(1)\approx 2.718,
\qquad
\exp(2)\approx 7.389.

$$


The denominator is


$$

2.718+7.389+7.389=17.496.

$$


Therefore


$$

A_{na}=\frac{2.718}{17.496}\approx 0.1554,

$$



$$

A_{nb}=\frac{7.389}{17.496}\approx 0.4223,

$$



$$

A_{nc}=\frac{7.389}{17.496}\approx 0.4223.

$$


**Step 5 — Check the attention constraints.**

All coefficients are non-negative, and


$$

0.1554+0.4223+0.4223=1.0000.

$$


So the constraints are satisfied.

**Step 6 — Compute the weighted aggregate.**


$$

z_n=0.1554(1,0)+0.4223(0,2)+0.4223(1,1).

$$


First coordinate:


$$

0.1554+0+0.4223=0.5777.

$$


Second coordinate:


$$

0+0.8446+0.4223=1.2669.

$$


Thus


$$

z_n\approx(0.5777,1.2669).

$$


---

## Q2.5 — Multi-head graph attention: average versus concatenate

A two-head graph attention layer produces the following two head outputs for node $n$:


$$

z_n^{(1)}=(1,3),
\qquad
z_n^{(2)}=(-1,5).

$$


Compute the output if the layer:

1. averages the heads;
2. concatenates the heads.

Also state the output dimension in each case.

### Solution

**Step 1 — Average the heads.**


$$

z_n^{\text{avg}}
=\frac{1}{2}\left((1,3)+(-1,5)\right).

$$



$$

(1,3)+(-1,5)=(0,8).

$$


So


$$

z_n^{\text{avg}}=(0,4).

$$


Each head is 2-dimensional, so the averaged output is still 2-dimensional.

**Step 2 — Concatenate the heads.**

Concatenation places the vectors side by side:


$$

z_n^{\text{concat}}=(1,3,-1,5).

$$


Each head is 2-dimensional and there are 2 heads, so the concatenated output is 4-dimensional.

**Step 3 — State the difference.**

- Averaging preserves the head dimension.
- Concatenation multiplies the dimension by the number of heads.

---

## Q2.6 — Transductive learning with unlabelled nodes participating in message passing

Consider a path graph


$$

1-2-3.

$$


Nodes 1 and 3 are labelled training nodes. Node 2 is unlabelled. The scalar initial embeddings are


$$

h_1^{(0)}=1,
\qquad
h_2^{(0)}=5,
\qquad
h_3^{(0)}=3.

$$


Use sum aggregation without self-loops:


$$

z_n^{(0)}=\sum_{m\in\mathcal N(n)}h_m^{(0)}.

$$


Compute $z_1^{(0)}$ and $z_3^{(0)}$. Then explain why this is transductive rather than ordinary supervised learning.

### Solution

**Step 1 — Identify the neighbours.**

For the path $1-2-3$,


$$

\mathcal N(1)=\{2\},
\qquad
\mathcal N(3)=\{2\}.

$$


**Step 2 — Compute the aggregate for node 1.**


$$

z_1^{(0)}=h_2^{(0)}=5.

$$


**Step 3 — Compute the aggregate for node 3.**


$$

z_3^{(0)}=h_2^{(0)}=5.

$$


**Step 4 — Explain the transductive point.**

Node 2 is unlabelled, but its embedding still contributes to the message passing for labelled nodes 1 and 3.

That is exactly the transductive setting described in the sheet: the graph structure is known during training, some nodes are labelled, and unlabelled nodes still participate in message passing.

---

## Q2.7 — Residual and skip-connection calculations

A GNN block computes an update output


$$

\operatorname{Update}(h_n^{(l)},z_n^{(l+1)},g^{(l)})=(-3,4),

$$


and the current node embedding is


$$

h_n^{(l)}=(2,-1).

$$


1. Compute the residual output


$$

h_n^{(l+1)}=\operatorname{Update}(\cdots)+h_n^{(l)}.

$$


2. Suppose a skip-connection classifier receives


$$

h_n^{(1)}=(1,0),\qquad h_n^{(2)}=(0,1),\qquad h_n^{(3)}=(2,2).

$$


Compute the concatenated skip vector


$$

h_n^{(1)}\oplus h_n^{(2)}\oplus h_n^{(3)}.

$$


### Solution

**Step 1 — Compute the residual output.**


$$

h_n^{(l+1)}=(-3,4)+(2,-1).

$$


So


$$

h_n^{(l+1)}=(-1,3).

$$


**Step 2 — Concatenate the skip-connection embeddings.**


$$

h_n^{(1)}\oplus h_n^{(2)}\oplus h_n^{(3)}
=(1,0)\oplus(0,1)\oplus(2,2).

$$


Therefore


$$

h_n^{(1)}\oplus h_n^{(2)}\oplus h_n^{(3)}=(1,0,0,1,2,2).

$$


**Step 3 — Interpret the result.**

The residual connection adds the previous embedding directly to the new update. The skip connection preserves several layer-depth representations by concatenating them before prediction.

---

# Section 3 — Building things from scratch

These questions chain the basic operations together. They are closer to exam-style computational exercises.

---

## Q3.1 — Build $A$, $P$, $\tilde X$, $\tilde A$, and verify equivariance

Consider the path graph


$$

1-2-3.

$$


The original node order is $(1,2,3)$, and the scalar node-feature matrix is


$$

X=
\begin{pmatrix}
1\\2\\4
\end{pmatrix}.

$$


Use the reordered node order


$$

(3,1,2).

$$


Use the simple self-inclusive sum update


$$

h_n^{(1)}=\sum_{m\in\mathcal N(n)\cup\{n\}}h_m^{(0)},
\qquad
h_n^{(0)}=x_n.

$$


Tasks:

1. Build the original adjacency matrix $A$.
2. Build the permutation matrix $P$.
3. Compute $\tilde X=PX$.
4. Compute $\tilde A=PAP^T$.
5. Compute the one-layer embeddings in both node orders and verify equivariance.

### Solution

**Step 1 — Build the original adjacency matrix.**

The graph is $1-2-3$, so node 1 is connected to 2, and node 2 is connected to 3.

Using order $(1,2,3)$,


$$

A=
\begin{pmatrix}
0&1&0\\
1&0&1\\
0&1&0
\end{pmatrix}.

$$


**Step 2 — Build the permutation matrix.**

The new order is $(3,1,2)$. That means the new rows select old rows 3, 1, and 2.

So


$$

P=
\begin{pmatrix}
0&0&1\\
1&0&0\\
0&1&0
\end{pmatrix}.

$$


**Step 3 — Compute $\tilde X=PX$.**


$$

\tilde X=
\begin{pmatrix}
0&0&1\\
1&0&0\\
0&1&0
\end{pmatrix}
\begin{pmatrix}
1\\2\\4
\end{pmatrix}
=
\begin{pmatrix}
4\\1\\2
\end{pmatrix}.

$$


This is exactly the feature vector in order $(3,1,2)$.

**Step 4 — Compute $\tilde A$.**

We can either compute $PAP^T$ or rebuild the adjacency matrix in the new order.

In new order $(3,1,2)$:

- node 3 is connected to node 2, which is now in position 3;
- node 1 is connected to node 2, which is now in position 3;
- node 2 is connected to nodes 1 and 3, now in positions 2 and 1.

Therefore


$$

\tilde A=
\begin{pmatrix}
0&0&1\\
0&0&1\\
1&1&0
\end{pmatrix}.

$$


**Step 5 — Compute the update in the original order.**

Original features are


$$

h^{(0)}=(1,2,4)^T.

$$


Using self-inclusive sum:

For node 1:


$$

h_1^{(1)}=h_1^{(0)}+h_2^{(0)}=1+2=3.

$$


For node 2:


$$

h_2^{(1)}=h_1^{(0)}+h_2^{(0)}+h_3^{(0)}=1+2+4=7.

$$


For node 3:


$$

h_3^{(1)}=h_2^{(0)}+h_3^{(0)}=2+4=6.

$$


So


$$

h^{(1)}=
\begin{pmatrix}
3\\7\\6
\end{pmatrix}.

$$


**Step 6 — Compute the update in the reordered graph.**

The reordered features are


$$

\tilde h^{(0)}=(4,1,2)^T,

$$


with node order $(3,1,2)$.

For the first reordered node, old node 3:


$$

\tilde h_1^{(1)}=4+2=6.

$$


For the second reordered node, old node 1:


$$

\tilde h_2^{(1)}=1+2=3.

$$


For the third reordered node, old node 2:


$$

\tilde h_3^{(1)}=2+4+1=7.

$$


Thus


$$

\tilde h^{(1)}=
\begin{pmatrix}
6\\3\\7
\end{pmatrix}.

$$


**Step 7 — Verify equivariance.**

Compute


$$

Ph^{(1)}=
\begin{pmatrix}
0&0&1\\
1&0&0\\
0&1&0
\end{pmatrix}
\begin{pmatrix}
3\\7\\6
\end{pmatrix}
=
\begin{pmatrix}
6\\3\\7
\end{pmatrix}.

$$


This equals $\tilde h^{(1)}$. Therefore this message-passing update is permutation-equivariant.

---

## Q3.2 — Build a two-layer message-passing computation

Use the path graph


$$

1-2-3.

$$


Let the initial scalar node embeddings be


$$

h^{(0)}=(1,0,0)^T.

$$


Use the self-inclusive sum update with identity activation:


$$

h_n^{(l+1)}=
\sum_{m\in\mathcal N(n)\cup\{n\}}h_m^{(l)}.

$$


Compute $h^{(1)}$ and $h^{(2)}$.

### Solution

**Step 1 — Identify the self-inclusive neighbourhoods.**

For the path graph:


$$

\mathcal N(1)\cup\{1\}=\{1,2\},

$$



$$

\mathcal N(2)\cup\{2\}=\{1,2,3\},

$$



$$

\mathcal N(3)\cup\{3\}=\{2,3\}.

$$


**Step 2 — Compute layer 1.**

Initial embeddings are


$$

h^{(0)}=(1,0,0)^T.

$$


For node 1:


$$

h_1^{(1)}=h_1^{(0)}+h_2^{(0)}=1+0=1.

$$


For node 2:


$$

h_2^{(1)}=h_1^{(0)}+h_2^{(0)}+h_3^{(0)}=1+0+0=1.

$$


For node 3:


$$

h_3^{(1)}=h_2^{(0)}+h_3^{(0)}=0+0=0.

$$


So


$$

h^{(1)}=(1,1,0)^T.

$$


**Step 3 — Compute layer 2.**

Now use $h^{(1)}=(1,1,0)^T$.

For node 1:


$$

h_1^{(2)}=h_1^{(1)}+h_2^{(1)}=1+1=2.

$$


For node 2:


$$

h_2^{(2)}=h_1^{(1)}+h_2^{(1)}+h_3^{(1)}=1+1+0=2.

$$


For node 3:


$$

h_3^{(2)}=h_2^{(1)}+h_3^{(1)}=1+0=1.

$$


Thus


$$

h^{(2)}=(2,2,1)^T.

$$


**Step 4 — Interpret the propagation.**

After one layer, node 2 has received information from node 1. After two layers, node 3 has received information from node 1 through node 2.

---

## Q3.3 — Build link predictions and rank candidate missing edges

A graph has four nodes with learned node embeddings


$$

h_1=(1,0),
\qquad
h_2=(0.5,0.5),
\qquad
h_3=(-1,0),
\qquad
h_4=(0,2).

$$


Use the dot-product link predictor


$$

p(n,m)=\sigma(h_n^Th_m).

$$


Compute and rank the predicted probabilities for candidate edges


$$

(1,2),\quad (1,3),\quad (2,4),\quad (3,4).

$$


### Solution

**Step 1 — Compute the score for $(1,2)$.**


$$

h_1^Th_2=(1,0)\cdot(0.5,0.5)=0.5.

$$



$$

p(1,2)=\sigma(0.5)\approx 0.622.

$$


**Step 2 — Compute the score for $(1,3)$.**


$$

h_1^Th_3=(1,0)\cdot(-1,0)=-1.

$$



$$

p(1,3)=\sigma(-1)\approx 0.269.

$$


**Step 3 — Compute the score for $(2,4)$.**


$$

h_2^Th_4=(0.5,0.5)\cdot(0,2)=1.

$$



$$

p(2,4)=\sigma(1)\approx 0.731.

$$


**Step 4 — Compute the score for $(3,4)$.**


$$

h_3^Th_4=(-1,0)\cdot(0,2)=0.

$$



$$

p(3,4)=\sigma(0)=0.5.

$$


**Step 5 — Rank the candidate edges.**

From highest probability to lowest:


$$

(2,4):0.731,
\quad
(1,2):0.622,
\quad
(3,4):0.500,
\quad
(1,3):0.269.

$$


So the model most strongly predicts the missing edge $(2,4)$.

---

## Q3.4 — Build a graph-level classifier using sum and mean readouts

Two graphs have final node embeddings:

Graph $G_A$:


$$

(1,0),\quad (0,1).

$$


Graph $G_B$:


$$

(1,0),\quad (0,1),\quad (1,1),\quad (0,0).

$$


Use the binary classifier


$$

y=\sigma(v^Tr+b),

$$


where


$$

v=(1,1),
\qquad
b=-1.5.

$$


Compute the output using:

1. sum readout;
2. mean readout.

### Solution

**Step 1 — Compute the sum readout for $G_A$.**


$$

r_A^{\text{sum}}=(1,0)+(0,1)=(1,1).

$$


The classifier score is


$$

v^Tr_A^{\text{sum}}+b=(1,1)\cdot(1,1)-1.5=2-1.5=0.5.

$$


So


$$

y_A^{\text{sum}}=\sigma(0.5)\approx 0.622.

$$


**Step 2 — Compute the sum readout for $G_B$.**


$$

r_B^{\text{sum}}=(1,0)+(0,1)+(1,1)+(0,0)=(2,2).

$$


The classifier score is


$$

v^Tr_B^{\text{sum}}+b=(1,1)\cdot(2,2)-1.5=4-1.5=2.5.

$$


So


$$

y_B^{\text{sum}}=\sigma(2.5)\approx 0.924.

$$


**Step 3 — Compute the mean readout for $G_A$.**


$$

r_A^{\text{mean}}=\frac{1}{2}(1,1)=(0.5,0.5).

$$


The score is


$$

(1,1)\cdot(0.5,0.5)-1.5=1-1.5=-0.5.

$$


Thus


$$

y_A^{\text{mean}}=\sigma(-0.5)\approx 0.378.

$$


**Step 4 — Compute the mean readout for $G_B$.**


$$

r_B^{\text{mean}}=\frac{1}{4}(2,2)=(0.5,0.5).

$$


The score is again


$$

(1,1)\cdot(0.5,0.5)-1.5=-0.5.

$$


So


$$

y_B^{\text{mean}}\approx 0.378.

$$


**Step 5 — Interpret the difference.**

The sum readout is sensitive to the number of nodes and the total amount of signal. The mean readout normalises by graph size, so these two graphs become identical under mean pooling.

---

## Q3.5 — Build one general edge-node-graph update block

A tiny graph has nodes $1,2,3$ and undirected edges $(1,2)$ and $(2,3)$. Use scalar embeddings.

Initial node embeddings:


$$

h_1=1,
\qquad
h_2=2,
\qquad
h_3=4.

$$


Initial edge embeddings:


$$

e_{12}=0.5,
\qquad
e_{23}=1.0.

$$


Initial graph embedding:


$$

g=10.

$$


Use the following simple update rules:


$$

e_{nm}'=e_{nm}+h_n+h_m+0.1g,

$$



$$

z_n'=\sum_{m\in\mathcal N(n)}e_{nm}',

$$



$$

h_n'=h_n+0.5z_n'+0.1g,

$$



$$

g'=g+\operatorname{mean}(h_1',h_2',h_3')+\operatorname{mean}(e_{12}',e_{23}').

$$


Compute $e_{12}'$, $e_{23}'$, all $z_n'$, all $h_n'$, and $g'$.

### Solution

**Step 1 — Update edge $(1,2)$.**


$$

e_{12}'=e_{12}+h_1+h_2+0.1g.

$$


Substitute values:


$$

e_{12}'=0.5+1+2+0.1(10).

$$



$$

e_{12}'=0.5+1+2+1=4.5.

$$


**Step 2 — Update edge $(2,3)$.**


$$

e_{23}'=e_{23}+h_2+h_3+0.1g.

$$



$$

e_{23}'=1.0+2+4+1=8.0.

$$


**Step 3 — Aggregate updated edges into nodes.**

Node 1 touches only edge $(1,2)$, so


$$

z_1'=4.5.

$$


Node 2 touches both edges, so


$$

z_2'=4.5+8.0=12.5.

$$


Node 3 touches only edge $(2,3)$, so


$$

z_3'=8.0.

$$


**Step 4 — Update node 1.**


$$

h_1'=h_1+0.5z_1'+0.1g.

$$



$$

h_1'=1+0.5(4.5)+1=1+2.25+1=4.25.

$$


**Step 5 — Update node 2.**


$$

h_2'=2+0.5(12.5)+1=2+6.25+1=9.25.

$$


**Step 6 — Update node 3.**


$$

h_3'=4+0.5(8.0)+1=4+4+1=9.0.

$$


**Step 7 — Compute the mean updated node embedding.**


$$

\operatorname{mean}(h_1',h_2',h_3')
=\frac{4.25+9.25+9.0}{3}
=\frac{22.5}{3}=7.5.

$$


**Step 8 — Compute the mean updated edge embedding.**


$$

\operatorname{mean}(e_{12}',e_{23}')
=\frac{4.5+8.0}{2}=6.25.

$$


**Step 9 — Update the graph embedding.**


$$

g'=10+7.5+6.25=23.75.

$$


So the updated graph embedding is


$$

g'=23.75.

$$


---

## Q3.6 — Build a geometric spatial update

A molecular graph has node 1 connected to nodes 2 and 3. The spatial embeddings are


$$

r_1=(0,0,0),
\qquad
r_2=(1,0,0),
\qquad
r_3=(0,2,0).

$$


The sheet’s geometric spatial update has the form


$$

r_n^{(l+1)}
=
r_n^{(l)}
+
C\sum_{(n,m)\in E}
(r_n^{(l)}-r_m^{(l)})\phi(e_{nm}^{(l+1)}).

$$


For node 1, let


$$

C=0.5,
\qquad
\phi(e_{12}^{(l+1)})=2,
\qquad
\phi(e_{13}^{(l+1)})=0.25.

$$


Compute $r_1^{(l+1)}$. Also compute the distances $\|r_1-r_2\|_2$ and $\|r_1-r_3\|_2$.

### Solution

**Step 1 — Compute the two distances.**

For nodes 1 and 2:


$$

\|r_1-r_2\|_2
=\|(0,0,0)-(1,0,0)\|_2
=\|(-1,0,0)\|_2=1.

$$


For nodes 1 and 3:


$$

\|r_1-r_3\|_2
=\|(0,0,0)-(0,2,0)\|_2
=\|(0,-2,0)\|_2=2.

$$


**Step 2 — Compute the vector contribution from edge $(1,2)$.**


$$

(r_1-r_2)\phi(e_{12}^{(l+1)})=(-1,0,0)\times 2=(-2,0,0).

$$


**Step 3 — Compute the vector contribution from edge $(1,3)$.**


$$

(r_1-r_3)\phi(e_{13}^{(l+1)})=(0,-2,0)\times 0.25=(0,-0.5,0).

$$


**Step 4 — Sum the edge contributions.**


$$

(-2,0,0)+(0,-0.5,0)=(-2,-0.5,0).

$$


**Step 5 — Multiply by $C=0.5$.**


$$

0.5(-2,-0.5,0)=(-1,-0.25,0).

$$


**Step 6 — Add the current spatial embedding of node 1.**


$$

r_1^{(l+1)}=r_1^{(l)}+(-1,-0.25,0).

$$


Since $r_1^{(l)}=(0,0,0)$,


$$

r_1^{(l+1)}=(-1,-0.25,0).

$$


---

# Section 4 — Hard edge cases: when methods disagree or break down

This is the highest-value section. These are the cases that expose whether you really understand the method, not just the formula.

---

## Q4.1 — The row-only permutation mistake

Use the lecture sheet’s running graph from Q1.1. The original adjacency matrix under order $(A,B,C,D,E)$ is


$$

A=
\begin{pmatrix}
0 & 0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 \\
1 & 1 & 0 & 1 & 1 \\
0 & 0 & 1 & 0 & 1 \\
0 & 0 & 1 & 1 & 0
\end{pmatrix}.

$$


The new order is $(C,E,A,D,B)$. A student reorders only the rows, giving


$$

PA=
\begin{pmatrix}
1&1&0&1&1\\
0&0&1&1&0\\
0&0&1&0&0\\
0&0&1&0&1\\
0&0&1&0&0
\end{pmatrix}.

$$


Explain why $PA$ is not the correct reordered adjacency matrix.

### Solution

**Step 1 — Recall what an adjacency matrix means.**

In an adjacency matrix, rows and columns must use the same node order.

If the rows are in order $(C,E,A,D,B)$, then the columns must also be in order $(C,E,A,D,B)$.

**Step 2 — Identify the student’s mistake.**

The matrix $PA$ has reordered rows, but its columns are still in the old order $(A,B,C,D,E)$.

So row labels and column labels no longer match.

**Step 3 — Check symmetry.**

The original graph is undirected, so the correct adjacency matrix should be symmetric.

But in $PA$, the $(1,2)$ entry is


$$

(PA)_{12}=1,

$$


while the $(2,1)$ entry is


$$

(PA)_{21}=0.

$$


So


$$

PA\ne (PA)^T.

$$


This is already a warning that $PA$ is not a valid adjacency matrix for the undirected graph.

**Step 4 — State the correct transformation.**

The correct transformation is


$$

\tilde A=PAP^T,

$$


because we must reorder both rows and columns.

---

## Q4.2 — Sum and mean aggregation disagree

Two nodes have the following neighbour embeddings.

Node $u$ has two neighbours:


$$

2,2.

$$


Node $v$ has one neighbour:


$$

2.

$$


Compute the sum and mean aggregates for both nodes. Explain what information each aggregation keeps or loses.

### Solution

**Step 1 — Compute the sum aggregate for node $u$.**


$$

z_u^{\text{sum}}=2+2=4.

$$


**Step 2 — Compute the mean aggregate for node $u$.**


$$

z_u^{\text{mean}}=\frac{2+2}{2}=2.

$$


**Step 3 — Compute the sum aggregate for node $v$.**


$$

z_v^{\text{sum}}=2.

$$


**Step 4 — Compute the mean aggregate for node $v$.**


$$

z_v^{\text{mean}}=\frac{2}{1}=2.

$$


**Step 5 — Compare the results.**

The sum aggregates are different:


$$

z_u^{\text{sum}}=4,
\qquad
z_v^{\text{sum}}=2.

$$


The mean aggregates are the same:


$$

z_u^{\text{mean}}=z_v^{\text{mean}}=2.

$$


**Step 6 — Interpret the disagreement.**

Sum aggregation keeps information about how many neighbours contributed. Mean aggregation removes degree scale by normalising by the number of neighbours.

So mean aggregation can lose degree/count information, while sum aggregation can be sensitive to graph size or node degree.

---

## Q4.3 — The isolated-node problem for mean aggregation

A graph has an isolated node $q$ with no neighbours:


$$

\mathcal N(q)=\varnothing.

$$


Its current scalar embedding is


$$

h_q^{(l)}=7.

$$


Compare the following three aggregation choices:

1. neighbour sum over $\mathcal N(q)$;
2. neighbour mean over $\mathcal N(q)$;
3. self-inclusive aggregation over $\mathcal N(q)\cup\{q\}$.

### Solution

**Step 1 — Compute the neighbour sum.**

The neighbour set is empty. A common convention for an empty sum is zero:


$$

\sum_{m\in\varnothing}h_m^{(l)}=0.

$$


So the sum aggregate gives


$$

z_q^{\text{sum}}=0.

$$


**Step 2 — Try to compute the neighbour mean.**

The mean would be


$$

z_q^{\text{mean}}
=
\frac{1}{|\mathcal N(q)|}
\sum_{m\in\mathcal N(q)}h_m^{(l)}.

$$


But


$$

|\mathcal N(q)|=0.

$$


So this becomes division by zero. The neighbour-only mean is undefined for an isolated node.

**Step 3 — Use self-inclusive aggregation.**

The sheet gives a simplified update that aggregates over


$$

\mathcal N(n)\cup\{n\}.

$$


For node $q$, this is


$$

\mathcal N(q)\cup\{q\}=\{q\}.

$$


So the self-inclusive aggregate is


$$

z_q=h_q^{(l)}=7.

$$


**Step 4 — Interpret the edge case.**

Neighbour-only mean breaks for isolated nodes. Self-inclusion, residual connections, or explicit isolated-node handling lets the model still update or preserve the isolated node’s representation.

---

## Q4.4 — Attention must normalise over neighbours only

Node $n$ has two true neighbours $a$ and $b$. Node $c$ is not a neighbour.

The raw attention scores are


$$

s_a=0,
\qquad
s_b=1,
\qquad
s_c=10.

$$


The neighbour embeddings are


$$

h_a=(1,0),
\qquad
h_b=(0,1),
\qquad
h_c=(10,10).

$$


Compute the correct attention-weighted aggregate for node $n$. Then explain what goes wrong if $c$ is incorrectly included in the softmax denominator.

### Solution

**Step 1 — Use only the true neighbours.**

The true neighbourhood is


$$

\mathcal N(n)=\{a,b\}.

$$


So the attention denominator should include only $a$ and $b$, not $c$.

**Step 2 — Compute the correct softmax over $a,b$.**


$$

\exp(s_a)=\exp(0)=1,

$$



$$

\exp(s_b)=\exp(1)\approx 2.718.

$$


The denominator is


$$

1+2.718=3.718.

$$


Therefore


$$

A_{na}=\frac{1}{3.718}\approx 0.269,

$$



$$

A_{nb}=\frac{2.718}{3.718}\approx 0.731.

$$


**Step 3 — Compute the correct aggregate.**


$$

z_n=0.269(1,0)+0.731(0,1).

$$


So


$$

z_n=(0.269,0.731).

$$


**Step 4 — Explain the wrong calculation.**

If the non-neighbour $c$ were included, the denominator would become


$$

\exp(0)+\exp(1)+\exp(10).

$$


Since


$$

\exp(10)\approx 22026,

$$


node $c$ would dominate the attention even though it is not connected to $n$.

The incorrect aggregate would be pulled close to $(10,10)$, which is not a valid neighbour message.

**Step 5 — State the lesson.**

In graph attention, the softmax normalises over


$$

m'\in\mathcal N(n),

$$


not over all nodes in the graph unless the graph is explicitly fully connected.

---

## Q4.5 — Over-smoothing under repeated mean message passing

Use the path graph


$$

1-2-3.

$$


Initial scalar embeddings are


$$

h^{(0)}=(1,0,-1)^T.

$$


Use the self-inclusive mean update


$$

h_n^{(l+1)}=
\frac{1}{|\mathcal N(n)\cup\{n\}|}
\sum_{m\in\mathcal N(n)\cup\{n\}}h_m^{(l)}.

$$


Compute $h^{(1)}$, $h^{(2)}$, and $h^{(3)}$. Explain how this illustrates over-smoothing.

### Solution

**Step 1 — Write the self-inclusive neighbourhoods.**

For the path graph:


$$

\mathcal N(1)\cup\{1\}=\{1,2\},

$$



$$

\mathcal N(2)\cup\{2\}=\{1,2,3\},

$$



$$

\mathcal N(3)\cup\{3\}=\{2,3\}.

$$


**Step 2 — Compute layer 1.**


$$

h_1^{(1)}=\frac{1+0}{2}=0.5.

$$



$$

h_2^{(1)}=\frac{1+0+(-1)}{3}=0.

$$



$$

h_3^{(1)}=\frac{0+(-1)}{2}=-0.5.

$$


So


$$

h^{(1)}=(0.5,0,-0.5)^T.

$$


**Step 3 — Compute layer 2.**


$$

h_1^{(2)}=\frac{0.5+0}{2}=0.25.

$$



$$

h_2^{(2)}=\frac{0.5+0+(-0.5)}{3}=0.

$$



$$

h_3^{(2)}=\frac{0+(-0.5)}{2}=-0.25.

$$


So


$$

h^{(2)}=(0.25,0,-0.25)^T.

$$


**Step 4 — Compute layer 3.**


$$

h_1^{(3)}=\frac{0.25+0}{2}=0.125.

$$



$$

h_2^{(3)}=\frac{0.25+0+(-0.25)}{3}=0.

$$



$$

h_3^{(3)}=\frac{0+(-0.25)}{2}=-0.125.

$$


Thus


$$

h^{(3)}=(0.125,0,-0.125)^T.

$$


**Step 5 — Interpret over-smoothing.**

The node embeddings are becoming closer to each other in magnitude. Repeated averaging washes out node-specific information. This is the over-smoothing problem described in the sheet: after many message-passing layers, node embeddings can become too similar.

---

## Q4.6 — Residual connections versus plain smoothing

Use the same graph and initial embeddings from Q4.5:


$$

h^{(0)}=(1,0,-1)^T.

$$


The plain self-inclusive mean update produced


$$

\operatorname{MeanUpdate}(h^{(0)})=(0.5,0,-0.5)^T.

$$


Now apply a residual update


$$

h^{(1)}=\operatorname{MeanUpdate}(h^{(0)})+h^{(0)}.

$$


Compute $h^{(1)}$, and explain the difference from plain mean updating.

### Solution

**Step 1 — Write the plain mean update.**

The plain update is already given:


$$

\operatorname{MeanUpdate}(h^{(0)})=(0.5,0,-0.5)^T.

$$


**Step 2 — Add the residual connection.**


$$

h^{(1)}=(0.5,0,-0.5)^T+(1,0,-1)^T.

$$


So


$$

h^{(1)}=(1.5,0,-1.5)^T.

$$


**Step 3 — Compare with plain smoothing.**

The plain mean update shrinks the outer nodes from $1$ and $-1$ to $0.5$ and $-0.5$.

The residual update keeps a direct copy of the old embedding and adds the smoothed information. This helps preserve node-specific information that might otherwise be washed out.

---

## Q4.7 — Dot-product edge prediction cannot distinguish direction

The sheet gives the edge predictor


$$

p(n,m)=\sigma(h_n^Th_m).

$$


Suppose


$$

h_1=(1,2),
\qquad
h_2=(3,4).

$$


Compute $p(1,2)$ and $p(2,1)$. Explain the limitation for directed graphs such as hyperlinks.

### Solution

**Step 1 — Compute the score for direction $(1,2)$.**


$$

h_1^Th_2=(1,2)\cdot(3,4)=1\times 3+2\times 4=11.

$$


So


$$

p(1,2)=\sigma(11).

$$


**Step 2 — Compute the score for direction $(2,1)$.**


$$

h_2^Th_1=(3,4)\cdot(1,2)=3\times 1+4\times 2=11.

$$


So


$$

p(2,1)=\sigma(11).

$$


**Step 3 — Compare the two probabilities.**


$$

p(1,2)=p(2,1).

$$


The dot product is symmetric:


$$

h_1^Th_2=h_2^Th_1.

$$


**Step 4 — Explain the limitation.**

This predictor is natural for undirected link prediction, but it cannot distinguish a link from node 1 to node 2 versus a link from node 2 to node 1.

For directed graphs such as web pages with hyperlinks, this simple symmetric dot-product predictor is not enough if direction matters.

---

## Q4.8 — Graph-level sum readout versus mean readout can change the answer

Consider two graphs.

Graph $G_1$ has node embeddings


$$

(1,0),\quad (0,1).

$$


Graph $G_2$ has node embeddings


$$

(1,0),\quad (0,1),\quad (1,0),\quad (0,1).

$$


Use classifier


$$

y=\sigma((1,1)^Tr-2.5),

$$


where $r$ is either the sum or mean readout. Compute the outputs and explain the disagreement.

### Solution

**Step 1 — Compute the sum readout for $G_1$.**


$$

r_1^{\text{sum}}=(1,0)+(0,1)=(1,1).

$$


The score is


$$

(1,1)\cdot(1,1)-2.5=2-2.5=-0.5.

$$


So


$$

y_1^{\text{sum}}=\sigma(-0.5)\approx 0.378.

$$


**Step 2 — Compute the sum readout for $G_2$.**


$$

r_2^{\text{sum}}=(1,0)+(0,1)+(1,0)+(0,1)=(2,2).

$$


The score is


$$

(1,1)\cdot(2,2)-2.5=4-2.5=1.5.

$$


So


$$

y_2^{\text{sum}}=\sigma(1.5)\approx 0.818.

$$


**Step 3 — Compute the mean readout for $G_1$.**


$$

r_1^{\text{mean}}=\frac{1}{2}(1,1)=(0.5,0.5).

$$


The score is


$$

(1,1)\cdot(0.5,0.5)-2.5=1-2.5=-1.5.

$$


So


$$

y_1^{\text{mean}}=\sigma(-1.5)\approx 0.182.

$$


**Step 4 — Compute the mean readout for $G_2$.**


$$

r_2^{\text{mean}}=\frac{1}{4}(2,2)=(0.5,0.5).

$$


So the score is again


$$

-1.5,

$$


and


$$

y_2^{\text{mean}}\approx 0.182.

$$


**Step 5 — Explain the disagreement.**

Sum readout notices that $G_2$ has twice as many nodes with the same pattern. Mean readout normalises this away.

Both readouts are permutation-invariant, but they encode different graph-level information.

---

## Q4.9 — A non-invariant graph readout breaks under node reordering

A bad graph-level model concatenates node embeddings in their input order and then computes


$$

y=10h_1+h_2.

$$


For a two-node graph, the scalar embeddings are


$$

h_1=1,
\qquad
h_2=2.

$$


Compute the output before and after swapping the node order. Then compare with the sum readout.

### Solution

**Step 1 — Compute the bad ordered readout in the original order.**

Original order gives


$$

y=10h_1+h_2=10(1)+2=12.

$$


**Step 2 — Swap the node order.**

After swapping, the first row contains the old node 2 and the second row contains the old node 1.

So the ordered readout gives


$$

y'=10(2)+1=21.

$$


**Step 3 — Check whether the output is invariant.**

The same graph produced outputs 12 and 21 under different node orders.

Therefore this readout is not permutation-invariant.

**Step 4 — Compare with a sum readout.**

The sum readout gives


$$

h_1+h_2=1+2=3.

$$


After swapping the order, the sum is still


$$

2+1=3.

$$


So the sum readout is permutation-invariant, while the ordered concatenation readout is not.

---

## Q4.10 — Distance-only geometric features are unchanged by translation and reflection

Three spatial embeddings are


$$

r_1=(0,0,0),
\qquad
r_2=(1,0,0),
\qquad
r_3=(0,1,0).

$$


1. Compute the pairwise distances.
2. Translate all points by $t=(5,5,5)$ and show that the distances are unchanged.
3. Reflect the points across the $yz$-plane, so $(x,y,z)\mapsto(-x,y,z)$, and show that the distances are unchanged.
4. Explain why this is useful, and when it could be a limitation.

### Solution

**Step 1 — Compute the original distances.**

Between nodes 1 and 2:


$$

\|r_1-r_2\|_2
=\|(0,0,0)-(1,0,0)\|_2
=1.

$$


Between nodes 1 and 3:


$$

\|r_1-r_3\|_2
=\|(0,0,0)-(0,1,0)\|_2
=1.

$$


Between nodes 2 and 3:


$$

\|r_2-r_3\|_2
=\|(1,0,0)-(0,1,0)\|_2
=\|(1,-1,0)\|_2
=\sqrt{2}.

$$


**Step 2 — Translate all points.**

Add $t=(5,5,5)$:


$$

r_1'=(5,5,5),
\qquad
r_2'=(6,5,5),
\qquad
r_3'=(5,6,5).

$$


Now


$$

\|r_1'-r_2'\|_2=\|(-1,0,0)\|_2=1,

$$



$$

\|r_1'-r_3'\|_2=\|(0,-1,0)\|_2=1,

$$



$$

\|r_2'-r_3'\|_2=\|(1,-1,0)\|_2=\sqrt{2}.

$$


The distances are unchanged.

**Step 3 — Reflect across the $yz$-plane.**

The reflected points are


$$

r_1''=(0,0,0),
\qquad
r_2''=(-1,0,0),
\qquad
r_3''=(0,1,0).

$$


The distances are


$$

\|r_1''-r_2''\|_2=1,

$$



$$

\|r_1''-r_3''\|_2=1,

$$



$$

\|r_2''-r_3''\|_2=\|(-1,-1,0)\|_2=\sqrt{2}.

$$


Again, the distances are unchanged.

**Step 4 — Interpret the result.**

This is useful because molecular properties often should not depend on where the molecule is placed in space or how it is rotated or reflected. Distance-based edge updates therefore build in useful geometric invariances.

The limitation is that if a task genuinely needs to distinguish mirror-image structures, then distance-only reflection-invariant features may be insufficient. The sheet explicitly lists reflection invariance as one of the intended spatial symmetries, so this limitation matters only for tasks where that symmetry is not desired.

---

## Q4.11 — Learnable aggregation remains permutation-invariant only because of the sum

The sheet gives the learnable aggregation pattern


$$

\operatorname{Aggregate}(\{h_m\})
=
\operatorname{MLP}_\theta
\left(
\sum_{m\in\mathcal N(n)}
\operatorname{MLP}_\phi(h_m)
\right).

$$


For a scalar toy version, let


$$

\operatorname{MLP}_\phi(h)=h^2,
\qquad
\operatorname{MLP}_\theta(s)=2s+1.

$$


A node has neighbour embeddings


$$

3,
\quad
1,
\quad
-2.

$$


Compute the aggregate. Then recompute after reordering the neighbours as


$$

-2,
\quad
3,
\quad
1.

$$


### Solution

**Step 1 — Apply $\operatorname{MLP}_\phi$ to each neighbour in the original order.**


$$

3^2=9,
\qquad
1^2=1,
\qquad
(-2)^2=4.

$$


**Step 2 — Sum the transformed embeddings.**


$$

9+1+4=14.

$$


**Step 3 — Apply $\operatorname{MLP}_\theta$.**


$$

\operatorname{MLP}_\theta(14)=2(14)+1=29.

$$


So the aggregate is


$$

29.

$$


**Step 4 — Reorder the neighbours and repeat.**

The reordered neighbours are $-2,3,1$. Applying $\operatorname{MLP}_\phi$:


$$

(-2)^2=4,
\qquad
3^2=9,
\qquad
1^2=1.

$$


The sum is


$$

4+9+1=14.

$$


Then


$$

\operatorname{MLP}_\theta(14)=29.

$$


**Step 5 — State why the answer is unchanged.**

The learned transformations are shared across neighbours, and the transformed values are combined by a sum. Since summation is permutation-invariant, the aggregate does not depend on the neighbour order.

---

## Q4.12 — Attention coefficient notation trap: adjacency $A$ versus attention $A_{nm}$

In the sheet, $A$ first denotes the binary adjacency matrix. Later, in the graph-attention section, $A_{nm}$ denotes an attention coefficient.

Suppose node $n$ has two neighbours $a,b$. The binary adjacency entries are


$$

A_{na}^{\text{adj}}=1,
\qquad
A_{nb}^{\text{adj}}=1.

$$


The attention coefficients are


$$

A_{na}^{\text{att}}=0.8,
\qquad
A_{nb}^{\text{att}}=0.2.

$$


Neighbour embeddings are


$$

h_a=(10,0),
\qquad
h_b=(0,10).

$$


Compute the aggregate using binary adjacency and using attention coefficients. Explain the difference.

### Solution

**Step 1 — Compute the binary-adjacency aggregate.**

Using binary adjacency as weights:


$$

z_n^{\text{adj}}
=A_{na}^{\text{adj}}h_a+A_{nb}^{\text{adj}}h_b.

$$



$$

z_n^{\text{adj}}=1(10,0)+1(0,10)=(10,10).

$$


**Step 2 — Compute the attention-weighted aggregate.**

Using attention coefficients:


$$

z_n^{\text{att}}
=A_{na}^{\text{att}}h_a+A_{nb}^{\text{att}}h_b.

$$



$$

z_n^{\text{att}}=0.8(10,0)+0.2(0,10).

$$



$$

z_n^{\text{att}}=(8,0)+(0,2)=(8,2).

$$


**Step 3 — Explain the notation trap.**

Both formulas may use a symbol that looks like $A_{nm}$, but the meaning is different:

- binary adjacency says whether an edge exists;
- attention coefficients say how strongly to weight each neighbour.

In graph attention, the coefficients should be non-negative and sum to 1 over the neighbours. Binary adjacency entries do not usually sum to 1 unless the node has exactly one neighbour.

---

# Mini mixed review set

Use these after finishing the four main sections.

---

## Q5.1 — Fast mixed check: task type and required symmetry

For each task, state whether the model output should be permutation-invariant or permutation-equivariant.

1. Predict whether a molecule is toxic.
2. Predict the topic of each document in a citation graph.
3. Predict a scalar solubility value for an entire molecule.
4. Predict a bot/non-bot label for every user in a social network.

### Solution

**Step 1 — Identify graph-level tasks.**

A whole-molecule toxicity prediction is one output for the whole graph. It should be permutation-invariant.

A whole-molecule solubility prediction is also graph-level. It should be permutation-invariant.

**Step 2 — Identify node-level tasks.**

A topic label for each document node is a node-level output. It should be permutation-equivariant.

A bot/non-bot label for every user node is also node-level. It should be permutation-equivariant.

**Step 3 — Write the answers.**

1. Molecule toxicity: permutation-invariant.
2. Document topic for each node: permutation-equivariant.
3. Molecular solubility: permutation-invariant.
4. Bot label for every user: permutation-equivariant.

---

## Q5.2 — Fast mixed check: one-layer attention plus update

Node $n$ has current embedding


$$

h_n=(1,1).

$$


It has two neighbours:


$$

h_a=(2,0),
\qquad
h_b=(0,3).

$$


The attention coefficients are already computed as


$$

A_{na}=0.25,
\qquad
A_{nb}=0.75.

$$


Use


$$

z_n=A_{na}h_a+A_{nb}h_b

$$


and then


$$

h_n'=\operatorname{ReLU}(h_n+z_n-(1,1)).

$$


Compute $z_n$ and $h_n'$.

### Solution

**Step 1 — Compute the weighted neighbour aggregate.**


$$

z_n=0.25(2,0)+0.75(0,3).

$$



$$

0.25(2,0)=(0.5,0),

$$



$$

0.75(0,3)=(0,2.25).

$$


So


$$

z_n=(0.5,2.25).

$$


**Step 2 — Compute the pre-activation update.**


$$

h_n+z_n-(1,1)=(1,1)+(0.5,2.25)-(1,1).

$$



$$

=(0.5,2.25).

$$


**Step 3 — Apply ReLU.**

Both entries are positive, so


$$

h_n'=(0.5,2.25).

$$


---

## Q5.3 — Fast mixed check: graph reordering and output type

A graph-level model produces


$$

y=\sigma\left((1,1)^T\sum_{n\in V}h_n\right).

$$


A graph has node embeddings


$$

h_1=(1,0),
\qquad
h_2=(0,2),
\qquad
h_3=(3,1).

$$


1. Compute $y$.
2. Reorder the nodes as $(3,1,2)$. Compute $y$ again.
3. Is this readout invariant or equivariant?

### Solution

**Step 1 — Compute the sum readout.**


$$

\sum_{n\in V}h_n=(1,0)+(0,2)+(3,1)=(4,3).

$$


**Step 2 — Compute the score.**


$$

(1,1)^T(4,3)=7.

$$


So


$$

y=\sigma(7)\approx 0.9991.

$$


**Step 3 — Reorder the nodes and recompute the sum.**

The reordered embeddings are


$$

(3,1),\quad (1,0),\quad (0,2).

$$


The sum is still


$$

(3,1)+(1,0)+(0,2)=(4,3).

$$


So the output is still


$$

y=\sigma(7)\approx 0.9991.

$$


**Step 4 — State the symmetry type.**

This is a graph-level readout, and the output is unchanged by node reordering. It is permutation-invariant.

---

# Final revision checklist

Before an exam-style question, ask yourself:

1. **What is the node order?** Never write an adjacency matrix without fixing the row/column order.
2. **Is the task node-level, edge-level, or graph-level?** This determines whether equivariance or invariance is required.
3. **Are rows and columns both being permuted?** For adjacency matrices, the correct transformation is $PAP^T$, not just $PA$.
4. **Does the aggregation ignore neighbour order?** Sum, mean, max, min, and attention-weighted sums are order-independent when applied over the correct neighbour set.
5. **Does the method handle variable neighbourhood sizes?** Watch for isolated nodes and mean aggregation.
6. **Are attention weights normalised over neighbours only?** Do not accidentally include non-neighbours unless the graph is fully connected.
7. **Is the readout graph-size-sensitive?** Sum and mean are both invariant, but they encode different information.
8. **Could repeated averaging over-smooth embeddings?** Residual and skip connections are standard fixes in the sheet.
9. **Are geometric features using distances or coordinate differences?** Distances are translation/rotation/reflection invariant; vector coordinate updates are designed to transform equivariantly.
10. **Are you using the right meaning of $A_{nm}$?** In early sections it is adjacency; in the attention section it is an attention coefficient.
