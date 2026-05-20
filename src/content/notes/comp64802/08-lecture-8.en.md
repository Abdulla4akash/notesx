---
subject: COMP64802
chapter: 8
title: "Lecture 8"
language: en
---

# COMP 64802 — Lecture 8 Study Notes

**Course:** COMP 64802 — Advanced Topics in Machine Learning  
**Lecturer:** Dr Omar Rivasplata, University of Manchester  
**Lecture:** Lecture 8 — Wed 22/4/2026  
**Lecture topic:** Data clustering, K-means clustering, and spectral clustering  
**Sources used:** Uploaded slide deck only. **Transcript was not provided in this chat**, so transcript-dependent details are marked **[UNCLEAR: transcript not provided]**.

---

## Topic and scope

This lecture is about **data clustering** as an unsupervised learning problem, beginning with the general motivation for clustering, then introducing **K-means clustering**, its objective, strengths, and limitations, and finally motivating **spectral clustering** using similarity graphs, graph Laplacians, and eigenvectors.

It fits into the broader subject of advanced machine learning as an unsupervised / representation-learning topic: the goal is to discover structure in unlabelled data and represent data points through cluster assignments or low-dimensional spectral embeddings.

---

# 1. Lecture roadmap and intended learning outcomes

## 1.1 Topics covered

The lecture covers three main topics:

1. **Data clustering**
2. **A bit about the K-means clustering algorithm**
3. **A bit more about spectral clustering**

_Source: slides pp. 2–3._

## 1.2 Intended Learning Outcomes

By the end of the lecture, students should have achieved the following Intended Learning Outcomes.

### ILO 1 — Understanding the clustering problem

Gain sufficient understanding of the **data clustering problem**, especially why clustering methods and algorithms are needed.

### ILO 2 — Limitations of K-means

Gain sufficient familiarity with the limitations and disadvantages of **K-means clustering**, which motivate spectral clustering.

### ILO 3 — Graph theory notions behind spectral clustering

Gain sufficient understanding of the graph theory notions underlying spectral clustering, including the **similarity matrix**.

### ILO 4 — Linear algebra notions behind spectral clustering

Gain working familiarity with the linear algebra notions underlying spectral clustering, especially the **graph Laplacian**.

### ILO 5 — Spectral clustering theory

Gain working familiarity with spectral clustering theory, including the connection between **clusters** and the **Laplacian**.

_Source: slide p. 3._

---

# 2. Clustering: introduction and motivation

The slides indicate that approximately **25 minutes** were allocated to clustering introduction and motivation.

_Source: slide p. 4._

**[UNCLEAR: transcript not provided]** The spoken lecture likely contained more motivation, intuition, and examples during this section than appear in the slides.

---

## 2.1 Data clustering: visual intuition

The slide titled **“Data clustering — in a picture”** shows:

- an “original unclustered data” scatter plot, where all points appear as one unlabelled cloud;
- a “clustered data” scatter plot, where the same points are separated into three visible groups using different colours.

The visual demonstrates that clustering assigns group structure to data that originally has no labels.

_Source: slide p. 5._

### Intuition

Clustering tries to discover natural groupings in data. Points in the same group should be similar to each other, while points in different groups should be dissimilar.

---

## 2.2 Informal definition of clustering

### Informal definition from the lecture slides

Clustering means **grouping data points into clusters** such that there is:

- **high intra-cluster similarity**, meaning high similarity within the same cluster;
- **low inter-cluster similarity**, meaning low similarity between different clusters.

_Source: slide p. 6._

### Intuition

A good clustering algorithm should put “similar things together” and “different things apart.”

### Formalism

No single general formal optimization problem for clustering is given at this point. A formal objective is later given for K-means.

---

## 2.3 What clustering is

The slides describe clustering as:

### A kind of representation learning

Clustering assigns structure to the data. Instead of representing data only as raw points, clustering represents them through group membership.

### Unsupervised learning

Clustering is unsupervised because there are **no labels**. The algorithm must infer groups from the data itself.

_Source: slide p. 6._

---

## 2.4 What clustering is used for

The slides list several uses of clustering:

- **Data visualisation**
- **Finding structure in data**
- **Discovering underlying patterns**
- and more

_Source: slide p. 6._

**[UNCLEAR: transcript not provided]** The slides do not give specific application examples beyond this list. The lecturer may have expanded verbally.

---

# 3. Desirable properties of a clustering algorithm

The lecture lists several desirable properties of clustering algorithms.

_Source: slide p. 7._

## 3.1 Ability to deal with different data types

A good clustering algorithm should be able to work with different kinds of data.

### Connection to K-means

This matters later because K-means relies on means / centroids, so it is only applicable when a mean is defined. The slide explicitly asks: **“what about categorical data?”**

_Source: slide p. 13._

---

## 3.2 Scalability

A clustering algorithm should scale in terms of both:

- **data size**;
- **dimension**.

### Intuition

The method should remain practical when there are many data points or many features.

---

## 3.3 Minimal domain knowledge for input parameters

A desirable clustering method should require minimal domain knowledge to determine its input parameters.

### Connection to K-means

K-means partly violates this desirable property because the user must specify:

\[
K,
\]

the number of clusters, before running the algorithm.

_Source: slides pp. 7, 13._

---

## 3.4 Robustness, interpretability, and usability

The algorithm should be:

- robust;
- interpretable;
- usable;
- easy to implement.

_Source: slide p. 7._

---

## 3.5 Theory guarantees

A desirable clustering algorithm should have theory guarantees, for example proving:

- convergence;
- scalability;
- related algorithmic properties.

_Source: slide p. 7._

### Connection to K-means

K-means is later stated to be guaranteed to converge in a finite number of iterations.

_Source: slide p. 10._

---

## 3.6 Optional user-specified constraints

The slides list optional incorporation of **user-specified constraints** as another desirable property.

_Source: slide p. 7._

**[UNCLEAR: transcript not provided]** The slides do not expand on what kind of constraints are meant.

---

# 4. K-means clustering

## 4.1 Basic setup

Given data points, also called objects,

\[
x_1, \ldots, x_N,
\]

K-means aims to partition them into \(K\) clusters.

_Source: slide p. 8._

---

## 4.2 K-means algorithm

### Inputs

- Data points \(x_1, \ldots, x_N\)
- A chosen number of clusters \(K\)

### Algorithm from the slides

1. Choose a value for \(K\), the number of clusters.
2. Initialize the \(K\) cluster centres, randomly if necessary.
3. Decide the class memberships of the \(N\) objects by assigning each object to the nearest cluster centre.
4. Re-estimate the \(K\) cluster centres, assuming the memberships found above are correct.
5. Repeat steps 3 and 4 until none of the \(N\) objects changed membership in the last iteration.

_Source: slide p. 8._

### Intuition

K-means alternates between two actions:

- **assignment step:** decide which centre each point is closest to;
- **update step:** recompute the centres based on the current assignments.

The process stops when assignments no longer change.

---

## 4.3 Key concept: cluster centre

### Intuition

A cluster centre represents the “middle” or representative point of a cluster.

### Formalism available in the slides

The slides use \(\mu_k\) as the centre of cluster \(C_k\) in the K-means objective:

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2.
\]

_Source: slide p. 10._

**[UNCLEAR: transcript not provided]** The slides do not explicitly define \(\mu_k\) as the arithmetic mean of the assigned points, though that is the standard K-means update. Only the slide content is included here.

---

## 4.4 K-means animation

One slide contains a link to play a K-means clustering animation.

_Source: slide p. 9._

**[UNCLEAR: transcript not provided]** The animation content is not available in the extracted slide text, so the exact example shown in the animation cannot be reconstructed.

---

# 5. K-means theory

## 5.1 K-means objective function

K-means optimises the total squared distance of data points to their cluster centres:

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2.
\]

Where:

- \(K\) is the number of clusters;
- \(C_k\) is cluster \(k\);
- \(x\) is a data point assigned to \(C_k\);
- \(\mu_k\) is the centre of cluster \(C_k\);
- \(\|x - \mu_k\|^2\) is the squared Euclidean distance between the point and its cluster centre.

_Source: slide p. 10._

---

## 5.2 Intuition behind the objective

K-means optimises **intra-cluster similarity** by minimising the average distance to members of the same cluster.

_Source: slide p. 10._

The intuition is:

\[
\text{small distance to cluster centre}
\quad \Rightarrow \quad
\text{high similarity within cluster}.
\]

---

## 5.3 Variance interpretation

The slides state that K-means:

- minimises the total intra-cluster variance;
- maximises the total inter-cluster variance.

_Source: slide p. 10._

### Intuition

A good K-means clustering makes each cluster internally tight while keeping different clusters separated from each other.

### Derivation

**[UNCLEAR: transcript not provided]** The slides state the variance interpretation but do not derive it.

---

## 5.4 Convergence guarantee

K-means is guaranteed to converge in a finite number of iterations.

_Source: slide p. 10._

### Important distinction

Convergence does **not** mean the algorithm always finds the best possible clustering. The later summary states that K-means often terminates at a **local optimum**, and that initialization is important.

_Source: slide p. 13._

---

# 6. K-means failure cases

## 6.1 Failure case: concentric / non-convex structure

The first failure-case slide shows a dataset with:

- a central cluster;
- an outer ring-shaped cluster.

The ground truth separates the central blob from the surrounding ring. K-means instead produces a partition that cuts through the ring/centre structure and does not match the true clustering.

_Source: slide p. 11._

### Key lesson

K-means is not suitable for discovering clusters with some non-convex shapes.

_Source: slide p. 13._

### Intuition

K-means relies on distance to cluster centres. For a ring-shaped cluster, a centroid-based representation is inappropriate because the cluster’s natural shape wraps around the centre rather than forming a compact blob around one mean.

**[UNCLEAR: transcript not provided]** The slide gives a visual example but no numerical step-by-step worked example.

---

## 6.2 Failure case: curved clusters / two moons style structure

The second failure-case slide shows two curved arc-shaped clusters. The ground truth follows the two arcs. K-means produces an incorrect partition that cuts the structure according to centroid proximity rather than following the curved shapes.

_Source: slide p. 12._

### Key lesson

K-means struggles when clusters are not roughly convex or centroid-separable.

**[UNCLEAR: transcript not provided]** The slide does not provide the precise data-generation process or numerical assignments.

---

# 7. K-means summary

## 7.1 Strengths of K-means

### Simple, easy to implement and debug

K-means is algorithmically straightforward: assign points to nearest centres, update centres, repeat.

### Intuitive objective function

The objective optimises Euclidean distance to promote:

- high intra-cluster similarity;
- low inter-cluster similarity.

### Guaranteed convergence

K-means is guaranteed to converge.

_Source: slide p. 13._

---

## 7.2 Weaknesses of K-means

### Need to specify \(K\) in advance

K-means requires the number of clusters \(K\) before running the algorithm.

### Only applicable when the mean is defined

K-means depends on means / cluster centres, so it is problematic for data where a mean is not naturally defined, such as categorical data.

### Often terminates at a local optimum

Initialization is important because K-means may converge to a local optimum rather than the global optimum.

### Not suitable for non-convex clusters

The failure-case slides illustrate this using ring-shaped and curved clusters.

### Unable to handle noisy data and outliers

The slides state that K-means is unable to handle noisy data and outliers well.

_Source: slide p. 13._

---

# 8. Comments on similarity

## 8.1 Similarity in K-means

K-means measures similarity as **small Euclidean distance**.

_Source: slide p. 14._

### Intuition

Two points are considered similar if they are close together in Euclidean space.

---

## 8.2 Limitation of Euclidean distance for some shapes

The lecture notes that measuring similarity via Euclidean distance is not suited for detecting some shapes.

_Source: slide p. 14._

### Connection to failure cases

The concentric-ring and curved-cluster examples show cases where simple distance-to-centroid reasoning fails.

---

## 8.3 Other distance measures

In principle, other distance measures could be used. In such cases, similarity would still be interpreted as **small distance**.

_Source: slide p. 14._

---

## 8.4 Distance-based clustering methods

Distance-based methods rely on spatial proximity to cluster centroids for assigning points to clusters, using a distance notion directly.

_Source: slide p. 14._

### Intuition

The algorithm asks: “Which centre is this point closest to?”

---

## 8.5 Model-based clustering methods

Model-based clustering methods rely on probability density estimation for assigning points to clusters, rather than using a distance directly.

_Source: slide p. 14._

**[UNCLEAR: transcript not provided]** The slides do not develop model-based clustering further in this lecture.

---

# 9. Spectral clustering

The slides indicate that approximately **35 minutes** were allocated to spectral clustering.

_Source: slide p. 15._

## 9.1 Motivation

Spectral clustering is introduced after the limitations of K-means. The connection is that spectral clustering is useful for hard non-convex clustering problems and can overcome some K-means limitations.

_Source: slide p. 25._

### Core idea

Spectral clustering algorithms cluster data points using eigenvectors of matrices derived from the data.

_Source: slide p. 25._

---

# 10. Similarity matrix and graph

## 10.1 Data points and similarity weights

Given data points

\[
x_1, \ldots, x_N,
\]

define similarity weights

\[
w_{i,j} = s(x_i, x_j),
\]

where \(s\) is a chosen similarity function.

_Source: slide p. 16._

### Intuition

Instead of clustering directly from coordinates, spectral clustering first builds a network of pairwise similarity relationships between points.

---

## 10.2 Weighted graph

The data are represented as a weighted graph:

\[
G = (V, E, W).
\]

The components are:

- \(V\): vertices, corresponding to data points;
- \(E\): edges, where an edge exists if \(w_{i,j} > 0\);
- \(W\): weights over edges.

_Source: slide p. 16._

### Visual on slide p. 16

The diagram shows the transformation:

\[
\text{data points}
\quad \rightarrow \quad
\text{similarity matrix}
\quad \rightarrow \quad
\text{similarity graph}.
\]

The original points are shown as groups, then encoded in a similarity matrix, and finally represented as a graph with weighted connections.

---

# 11. Similarity via the Gaussian kernel

## 11.1 Formula

The Gaussian kernel similarity is:

\[
w_{i,j}
=
\exp\left(
-\frac{\|x_i - x_j\|^2}{2\sigma^2}
\right).
\]

_Source: slide p. 17._

---

## 11.2 Range of values

The Gaussian kernel produces values in the range:

\[
(0,1].
\]

The interpretation is:

- the closer \(w_{i,j}\) is to \(1\), the more similar \(x_i\) and \(x_j\) are;
- \(w_{i,j}=1\) when \(x_i=x_j\);
- the closer \(w_{i,j}\) is to \(0\), the less similar the points are;
- \(w_{i,j} \to 0\) when \(\|x_i-x_j\| \to \infty\).

_Source: slide p. 17._

---

## 11.3 Intuition

The Gaussian kernel turns distance into similarity:

\[
\text{small distance}
\quad \Rightarrow \quad
\text{similarity near }1,
\]

\[
\text{large distance}
\quad \Rightarrow \quad
\text{similarity near }0.
\]

The parameter \(\sigma\) controls how distance is scaled inside the similarity calculation.

**[UNCLEAR: transcript not provided]** The slides do not discuss how to choose \(\sigma\).

---

# 12. Similarity matrix

## 12.1 Definition

Recall the similarity weights:

\[
w_{i,j} = s(x_i, x_j).
\]

The weights matrix is:

\[
W =
\begin{pmatrix}
w_{1,1} & w_{1,2} & \cdots & w_{1,N} \\
w_{2,1} & w_{2,2} & \cdots & w_{2,N} \\
\vdots & \vdots & \ddots & \vdots \\
w_{N,1} & w_{N,2} & \cdots & w_{N,N}
\end{pmatrix}.
\]

_Source: slide p. 18._

---

## 12.2 Symmetry

The similarity matrix is square and symmetric because:

\[
w_{i,j}
=
s(x_i,x_j)
=
s(x_j,x_i)
=
w_{j,i}.
\]

_Source: slide p. 18._

### Intuition

The similarity from \(x_i\) to \(x_j\) is the same as the similarity from \(x_j\) to \(x_i\), assuming the similarity function is symmetric.

---

# 13. Degree of nodes

## 13.1 Degree of a node

The degree of node \(i\), corresponding to data point \(x_i\), is:

\[
d_i = \sum_j w_{i,j}.
\]

_Source: slide p. 19._

### Intuition

The degree measures the total similarity / connection strength from node \(i\) to all other nodes.

---

## 13.2 Degree matrix

The degree matrix is:

\[
D =
\begin{pmatrix}
d_1 & 0 & \cdots & 0 \\
0 & d_2 & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & d_N
\end{pmatrix}.
\]

It is a diagonal matrix with node degrees \(d_i\) along the diagonal.

_Source: slide p. 19._

---

# 14. Graph Laplacian

## 14.1 Definition

The unnormalised graph Laplacian matrix is:

\[
L = D - W.
\]

where:

- \(D\) is the degree matrix;
- \(W\) is the similarity / weight matrix.

_Source: slide p. 20._

---

## 14.2 Intuition

The graph Laplacian combines information about:

- how strongly each node is connected overall, through \(D\);
- how strongly each pair of nodes is connected, through \(W\).

It is central to spectral clustering because its eigenvectors encode graph connectivity structure.

---

# 15. Graph Laplacian properties

The lecture states a theorem about the unnormalised graph Laplacian \(L\).

_Source: slide p. 21._

## 15.1 Quadratic form identity

For every

\[
y \in \mathbb{R}^N,
\]

we have:

\[
y^\top L y
=
\frac{1}{2}
\sum_{i,j}
w_{i,j}(y_i-y_j)^2.
\]

### Intuition

This expression is small when connected nodes have similar \(y\)-values. If \(w_{i,j}\) is large, then the term strongly penalises \(y_i\) and \(y_j\) being far apart.

---

## 15.2 Symmetry and positive semi-definiteness

The Laplacian \(L\) is symmetric and positive semi-definite.

### Formal consequence

Because \(L\) is positive semi-definite, its eigenvalues are non-negative.

---

## 15.3 Smallest eigenvalue

The smallest eigenvalue of \(L\) is:

\[
0.
\]

When the graph is connected, the corresponding eigenvector is the constant one vector:

\[
\mathbf{1}
=
(1,1,\ldots,1)^\top.
\]

---

## 15.4 Eigenvalues of \(L\)

The Laplacian has \(N\) non-negative, real-valued eigenvalues, ordered as:

\[
0 = \lambda_1 \leq \lambda_2 \leq \cdots \leq \lambda_N.
\]

---

## 15.5 Proof reference

The slides refer to **Proposition 1 in the tutorial by Ulrike von Luxburg** for the proof.

**[UNCLEAR: transcript not provided]** The proof steps are not included in the slides.

---

# 16. Graph Laplacian and connected components

The lecture states a theorem connecting the zero eigenvalue of \(L\) to connected components of the graph.

_Source: slide p. 22._

## 16.1 Theorem setup

Let \(G\) be an undirected graph with nonnegative weights.

---

## 16.2 Multiplicity of eigenvalue \(0\)

The algebraic multiplicity \(k\) of the eigenvalue \(0\) of \(L\) equals the number of connected components:

\[
C_1, \ldots, C_k
\]

in the graph.

### Intuition

The number of independent disconnected pieces of the graph is visible in the spectrum of the Laplacian.

---

## 16.3 Eigenspace of eigenvalue \(0\)

The eigenspace of eigenvalue \(0\) is spanned by the indicator vectors of the connected components:

\[
\mathbf{1}_{C_1}, \ldots, \mathbf{1}_{C_k}.
\]

### Indicator-vector intuition

An indicator vector \(\mathbf{1}_{C_i}\) marks which nodes belong to component \(C_i\):

- entries are \(1\) for nodes in \(C_i\);
- entries are \(0\) for nodes outside \(C_i\).

**[UNCLEAR: transcript not provided]** The slides do not explicitly define the indicator vector notation, but the visual on slide p. 24 shows block-style vectors with 1s in the rows belonging to a connected component and 0s elsewhere.

---

## 16.4 Proof reference

The slides refer to **Proposition 2 in the tutorial by Ulrike von Luxburg** for the proof.

**[UNCLEAR: transcript not provided]** The proof steps are not included in the slides.

---

# 17. Spectral clustering algorithm

## 17.1 Inputs

The spectral clustering algorithm takes:

\[
W \in \mathbb{R}^{N \times N},
\]

the similarity weights matrix, and a positive integer:

\[
k,
\]

the number of clusters to construct.

_Source: slide p. 23._

---

## 17.2 Algorithm steps

### Step 1 — Compute node degrees

For each node \(i\), compute:

\[
d_i \leftarrow \sum_j w_{i,j}.
\]

These are the row sums of \(W\).

### Step 2 — Build the degree matrix

Construct:

\[
D = \operatorname{diag}(d_1,\ldots,d_N).
\]

### Step 3 — Compute the unnormalised Laplacian

\[
L \leftarrow D - W.
\]

### Step 4 — Compute eigenvectors

Compute:

\[
v_1, \ldots, v_k,
\]

the first \(k\) eigenvectors of \(L\).

### Step 5 — Build the matrix \(V\)

Build:

\[
V \in \mathbb{R}^{N \times k}
\]

with \(v_1, \ldots, v_k\) as column vectors:

\[
V =
\begin{pmatrix}
| & | & & | \\
v_1 & v_2 & \cdots & v_k \\
| & | & & |
\end{pmatrix}.
\]

### Step 6 — Interpret rows as projected data points

The rows of \(V\) are treated as projected data points in:

\[
\mathbb{R}^k.
\]

The slides explicitly describe this as **dimension reduction**.

### Step 7 — Run K-means in the spectral embedding

Cluster the rows of \(V\) using K-means in:

\[
\mathbb{R}^k.
\]

### Step 8 — Return clusters

Return:

\[
C_1, \ldots, C_k.
\]

_Source: slide p. 23._

---

## 17.3 Key conceptual point

Spectral clustering does not run K-means directly on the original data. It first:

1. builds a similarity graph;
2. computes the graph Laplacian;
3. extracts the first \(k\) eigenvectors;
4. embeds the data into a low-dimensional spectral space;
5. runs K-means on that new representation.

_Source: slide p. 23._

---

# 18. Understanding the spectrum of the Laplacian

## 18.1 Connected graph case

If the graph is connected, the first eigenvector of \(L\) is:

\[
\mathbf{1}
=
(1,1,\ldots,1)^\top.
\]

_Source: slide p. 24._

---

## 18.2 Disconnected graph case

If the graph is disconnected and has \(k\) connected components, then the Laplacian spectrum / eigendecomposition is block diagonal, and the first \(k\) eigenvectors are the indicator vectors:

\[
\mathbf{1}_{C_1}, \ldots, \mathbf{1}_{C_k}
\]

of those components.

_Source: slide p. 24._

---

## 18.3 Visual on slide p. 24

The figure shows a block diagonal Laplacian structure with blocks labelled:

\[
L_1, L_2, L_3.
\]

Next to it are the first three eigenvectors. Each eigenvector behaves like an indicator for one connected component.

### Interpretation

When the graph splits perfectly into disconnected components, the Laplacian eigenvectors directly reveal those components. This explains why spectral clustering can work: the eigenvectors of the Laplacian encode cluster-membership information.

---

# 19. Summary of spectral clustering

The lecture summary says spectral clustering methods are algorithms that cluster data points using eigenvectors of matrices derived from the data.

_Source: slide p. 25._

## 19.1 Strengths of spectral clustering

Spectral clustering is described as:

- easy to interpret using basic linear algebra;
- efficient to implement;
- useful in hard non-convex clustering problems, overcoming K-means;
- able to explicitly obtain a data representation in a low-dimensional space that can be easily clustered;
- empirically successful across data problems.

_Source: slide p. 25._

---

# 20. Key concepts

## 20.1 Clustering

### Intuition

Grouping data so similar points are together and dissimilar points are apart.

### Slide definition

Grouping data points into clusters such that there is high intra-cluster similarity and low inter-cluster similarity.

_Source: slide p. 6._

---

## 20.2 Intra-cluster similarity

### Intuition

Similarity among points within the same cluster.

### Formalism in K-means

K-means promotes intra-cluster similarity by minimising squared distances to cluster centres:

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2.
\]

_Source: slide p. 10._

---

## 20.3 Inter-cluster similarity

### Intuition

Similarity between points in different clusters. A good clustering should make this low.

### Formalism in the slides

The slides state that K-means maximises total inter-cluster variance.

_Source: slide p. 10._

---

## 20.4 K-means

### Intuition

A centroid-based clustering algorithm that alternates between assigning points to the nearest centre and updating centres.

### Formal objective

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2.
\]

_Source: slides pp. 8, 10._

---

## 20.5 Similarity weight

### Intuition

A numerical measure of how similar two data points are.

### Formal definition

\[
w_{i,j} = s(x_i, x_j).
\]

_Source: slide p. 16._

---

## 20.6 Gaussian kernel similarity

### Intuition

A distance-based similarity function where nearby points have similarity close to \(1\), and far-away points have similarity close to \(0\).

### Formal definition

\[
w_{i,j}
=
\exp\left(
-\frac{\|x_i - x_j\|^2}{2\sigma^2}
\right).
\]

_Source: slide p. 17._

---

## 20.7 Similarity matrix

### Intuition

A matrix storing pairwise similarities between all data points.

### Formal definition

\[
W =
\begin{pmatrix}
w_{1,1} & w_{1,2} & \cdots & w_{1,N} \\
w_{2,1} & w_{2,2} & \cdots & w_{2,N} \\
\vdots & \vdots & \ddots & \vdots \\
w_{N,1} & w_{N,2} & \cdots & w_{N,N}
\end{pmatrix}.
\]

It is symmetric when:

\[
w_{i,j}=w_{j,i}.
\]

_Source: slide p. 18._

---

## 20.8 Weighted graph

### Intuition

A graph representation of the dataset where nodes are data points and edge weights represent similarities.

### Formal definition

\[
G=(V,E,W),
\]

where:

- \(V\) = vertices / data points;
- \(E\) = edges, with an edge if \(w_{i,j}>0\);
- \(W\) = weights over edges.

_Source: slide p. 16._

---

## 20.9 Degree of a node

### Intuition

The total connection strength of a node to all other nodes.

### Formal definition

\[
d_i = \sum_j w_{i,j}.
\]

_Source: slide p. 19._

---

## 20.10 Degree matrix

### Intuition

A diagonal matrix storing node degrees.

### Formal definition

\[
D = \operatorname{diag}(d_1,\ldots,d_N).
\]

_Source: slides pp. 19, 23._

---

## 20.11 Graph Laplacian

### Intuition

A matrix that encodes graph connectivity and is used to extract cluster information through eigenvectors.

### Formal definition

\[
L = D - W.
\]

_Source: slide p. 20._

---

## 20.12 Spectral clustering

### Intuition

A graph-based clustering method that uses eigenvectors of a matrix derived from the data to create a new low-dimensional representation, then clusters that representation.

### Slide definition / summary

Spectral clustering algorithms cluster data points using eigenvectors of matrices derived from the data.

_Source: slide p. 25._

---

# 21. Formulas and equations collected

## 21.1 K-means objective

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2.
\]

## 21.2 Similarity weights

\[
w_{i,j}=s(x_i,x_j).
\]

## 21.3 Gaussian kernel similarity

\[
w_{i,j}
=
\exp\left(
-\frac{\|x_i - x_j\|^2}{2\sigma^2}
\right).
\]

## 21.4 Degree of node \(i\)

\[
d_i = \sum_j w_{i,j}.
\]

## 21.5 Degree matrix

\[
D = \operatorname{diag}(d_1,\ldots,d_N).
\]

## 21.6 Unnormalised graph Laplacian

\[
L = D - W.
\]

## 21.7 Laplacian quadratic form

\[
y^\top L y
=
\frac{1}{2}
\sum_{i,j}
w_{i,j}(y_i-y_j)^2.
\]

## 21.8 Laplacian eigenvalue ordering

\[
0 = \lambda_1 \leq \lambda_2 \leq \cdots \leq \lambda_N.
\]

## 21.9 Constant one vector

\[
\mathbf{1}=(1,1,\ldots,1)^\top.
\]

## 21.10 Indicator vectors for connected components

\[
\mathbf{1}_{C_1},\ldots,\mathbf{1}_{C_k}.
\]

---

# 22. Worked examples from the slides

## 22.1 Data clustering visual example

The visual on slide p. 5 shows unclustered data on the left and clustered data on the right. The clustered version separates the points into three groups. This is an illustrative example rather than a numerical worked example.

## 22.2 K-means failure example: ring and centre

The visual on slide p. 11 shows K-means failing on a dataset with a central cluster and an outer ring. The ground truth separates the central blob from the ring, but K-means produces a centroid-based split that does not match the true structure.

## 22.3 K-means failure example: curved clusters

The visual on slide p. 12 shows K-means failing on two curved, non-convex clusters. The ground truth follows the arcs, while the K-means output cuts the structure incorrectly.

## 22.4 Laplacian spectrum visual example

The visual on slide p. 24 shows a block diagonal Laplacian for a graph with three connected components. The first three eigenvectors correspond to the indicator vectors of those components.

**[UNCLEAR: transcript not provided]** No numerical worked examples are available in the slides.

---

# 23. Exam flags

## 23.1 Explicit exam statements

No explicit statements such as “this will be on the exam” were found in the slide deck.

**[UNCLEAR: transcript not provided]** The transcript may contain spoken exam hints such as “this is important,” “you should know this,” or “common mistake,” but those are not available here.

## 23.2 High-value exam-revision material from the slides

Even though no explicit exam flag appears in the slides, the following are central to the stated learning outcomes.

### Know the K-means algorithm

Especially the iterative assignment/update process.

_Source: slide p. 8._

### Know the K-means objective

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x-\mu_k\|^2.
\]

_Source: slide p. 10._

### Know K-means weaknesses

Especially:

- need to choose \(K\) in advance;
- local optima and initialization dependence;
- not suitable for non-convex shapes;
- problems with noise/outliers;
- requires means to be defined.

_Source: slide p. 13._

### Know how spectral clustering constructs a graph

Data points become vertices; similarities become edge weights.

_Source: slide p. 16._

### Know the Gaussian kernel similarity formula

\[
w_{i,j}
=
\exp\left(
-\frac{\|x_i-x_j\|^2}{2\sigma^2}
\right).
\]

_Source: slide p. 17._

### Know the degree matrix and graph Laplacian

\[
d_i=\sum_j w_{i,j},
\qquad
D=\operatorname{diag}(d_1,\ldots,d_N),
\qquad
L=D-W.
\]

_Source: slides pp. 19–20._

### Know the connection between connected components and eigenvalue \(0\)

The number of connected components equals the multiplicity of eigenvalue \(0\), and the eigenspace is spanned by the indicator vectors of those components.

_Source: slide p. 22._

### Know the spectral clustering algorithm

Construct \(W\), compute \(D\), compute \(L\), find the first \(k\) eigenvectors, build \(V\), treat rows of \(V\) as projected points in \(\mathbb{R}^k\), then cluster using K-means.

_Source: slide p. 23._

---

# 24. Connections

## 24.1 K-means motivates spectral clustering

The lecture moves from K-means to spectral clustering by showing that K-means struggles with non-convex clusters. Spectral clustering is then presented as useful for hard non-convex clustering problems, overcoming K-means.

_Source: slides pp. 11–15, 25._

## 24.2 Clustering connects to representation learning

Clustering is described as a kind of representation learning. Spectral clustering makes this more explicit by constructing a low-dimensional representation using the rows of:

\[
V \in \mathbb{R}^{N \times k}.
\]

_Source: slides pp. 6, 23._

## 24.3 Spectral clustering connects graph theory and linear algebra

The method uses graph-theoretic objects:

- vertices;
- edges;
- weights;
- connected components;

and linear algebraic objects:

- matrices;
- eigenvalues;
- eigenvectors;
- graph Laplacian.

_Source: slide p. 3._

## 24.4 External references in slides

The proofs of the Laplacian properties and connected-component theorem are referred to Ulrike von Luxburg’s tutorial.

_Source: slides pp. 21–22._

The figures are credited to:

- Jonathon Byrd’s blog for the data clustering picture;
- Sandipan Dey’s blog for the K-means failure cases;
- Aarti Singh’s CMU slides for the similarity graph and Laplacian spectrum figures.

_Source: slides pp. 5, 11–12, 16, 24._

---

# 25. Unclear sections to revisit in the recording

Because the transcript was not provided, these are the sections most worth checking in the lecture recording.

1. **The 25-minute clustering motivation section**  
   The slides only give brief bullet points; the lecturer likely gave examples or extra explanation.

2. **K-means animation**  
   The slide references an animation, but the animation content is not available in the parsed slides.

3. **K-means objective derivation**  
   The objective is stated, but no derivation steps are shown in the slides.

4. **Why K-means maximises inter-cluster variance**  
   The slides state this, but do not derive it.

5. **The failure-case explanations**  
   The slides show the failures visually, but the lecturer may have explained precisely why the assignments go wrong.

6. **Choice of similarity function and Gaussian kernel parameter \(\sigma\)**  
   The formula is given, but no parameter-selection discussion appears in the slides.

7. **Proof of Laplacian properties**  
   The slides refer to von Luxburg’s tutorial rather than showing the proof.

8. **Proof of the connected-components theorem**  
   Again, the proof is referenced but not included.

9. **Why the first \(k\) eigenvectors produce a useful embedding for clustering**  
   The algorithm states this step, and the connected-component theorem motivates it, but a fuller explanation may have been given verbally.

10. **Any spoken exam hints**  
    No explicit exam hints appear in the slides, so the transcript/recording is needed to capture them.

---

# 26. Quick revision checklist

Before the exam, make sure you can do the following:

- Define clustering and explain intra-cluster vs inter-cluster similarity.
- State the K-means algorithm step by step.
- Write the K-means objective:

  \[
  \sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2.
  \]

- Explain why K-means can fail on non-convex clusters.
- List the main strengths and weaknesses of K-means.
- Define similarity weights \(w_{i,j}=s(x_i,x_j)\).
- Write the Gaussian kernel similarity formula.
- Define the similarity matrix \(W\), degree matrix \(D\), and Laplacian \(L=D-W\).
- State the Laplacian quadratic form:

  \[
  y^\top L y
  =
  \frac{1}{2}
  \sum_{i,j} w_{i,j}(y_i-y_j)^2.
  \]

- Explain the relationship between connected components and the zero eigenvalue of \(L\).
- State the spectral clustering algorithm step by step.
- Explain why rows of the eigenvector matrix \(V\) are treated as projected data points in \(\mathbb{R}^k\).

