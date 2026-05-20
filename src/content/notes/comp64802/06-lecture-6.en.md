---
subject: COMP64802
chapter: 6
title: "Lecture 6"
language: en
---

# COMP 64802 Lecture 6 — High-dimensional data, dimensionality reduction, and PCA

**Topic and scope:** This lecture introduces why modern machine-learning datasets are often high-dimensional, why this causes the curse of dimensionality, and how dimensionality reduction—especially **Principal Component Analysis (PCA)**—addresses visualisation, compression, and representation problems. It also refreshes the linear algebra needed for PCA: covariance matrices, eigenvalues/eigenvectors, singular values, and SVD.

**Course context:** COMP 64802, *Advanced Topics in Machine Learning*, Lecture 6, Dr Omar Rivasplata, University of Manchester, 18/3/2026.

**Source note:** No lecture transcript was provided in the conversation. These notes are therefore grounded in the uploaded Lecture 6 slides only. Transcript-dependent gaps are marked with **[UNCLEAR]**.

---

## 1. Lecture roadmap and intended learning outcomes

### 1.1 Topics covered today

The lecture covers:

- high-dimensional data;
- curse of dimensionality;
- introduction to dimensionality reduction;
- Principal Component Analysis (PCA).

### 1.2 Structure of the lecture

The lecture is structured in two main parts.

#### Introductory material — approximately 25 minutes

The introduction covers:

- high-dimensional data;
- the curse of dimensionality;
- motivation for dimensionality reduction;
- representation learning as a broader family of ideas.

#### PCA — approximately 40 minutes

The main technical section covers:

- PCA as a method for finding low-dimensional linear structure;
- centring data;
- principal components as directions of maximum projected variance;
- reconstruction error minimisation;
- sequential PCA;
- PCA via the covariance matrix;
- PCA via SVD;
- explained variance;
- applications and limitations.

### 1.3 Intended learning outcomes

By the end of the lecture, students should:

- understand the high-dimensional nature of many modern machine-learning datasets;
- understand the curse of dimensionality as motivation for dimensionality reduction;
- understand the basic ideas of dimensionality reduction and representation learning;
- have working familiarity with PCA;
- refresh related linear algebra: eigenvalues, singular values, and Singular Value Decomposition.

---

## 2. High-dimensional data

### 2.1 Key concept: high-dimensional data

#### Intuition

A dataset is high-dimensional when each data point is described by many measurements, features, coordinates, or variables. In machine learning, this is common because raw data often comes from rich sources: images, genomes, user histories, sensor readings, or text embeddings.

#### Formal-ish definition from the slides

High-dimensional data are datasets where each observation, or data point, consists of values for a very large number of features, variables, or coordinates.

Using notation later used for PCA:

$$
x_i \in \mathbb{R}^d
$$

where:

- $x_i$ is the $i$-th data point;
- $d$ is the number of features;
- “high-dimensional” means $d$ is large.

### 2.2 Examples of high-dimensional data

#### Example 1: High-resolution images

Images are high-dimensional because each image contains many pixels, and each pixel may have several colour channels.

The slides describe high-resolution images as having:

- hundreds or thousands of pixels;
- 3 colour channels per pixel: Red, Green, Blue;
- 256 possible values per channel, from 0 to 255.

So even a fairly small RGB image has many coordinates. A raw image can be treated as a vector whose entries are pixel-channel values.

#### Example 2: Genomics data

Genomics data are high-dimensional because biological sequences and genetic measurements involve many coordinates.

The slides give the example:

- human genomics data with over 3.2 billion base pairs;
- approximately 20,000 genes.

This motivates dimensionality reduction because directly analysing all raw genetic information may be computationally difficult and statistically inefficient.

#### Example 3: Customer purchase data

Customer purchase and recommendation-system data can involve:

- hundreds or thousands of features;
- e-commerce activity;
- behavioural signals;
- recommendation-system variables.

A customer might be represented by purchases, clicks, categories, ratings, browsing behaviour, time features, and so on.

---

## 3. The curse of dimensionality

### 3.1 Key concept: curse of dimensionality

#### Intuition

As the number of dimensions increases, space becomes huge very quickly. Data points that seem dense in low dimensions become sparse in high dimensions. This makes it hard to cover the input space with enough examples.

#### Formal-ish definition from the slides

As the number of features, or dimensions, increases, the volume of the space increases exponentially.

The slide uses the example of trying to find a point in:

- an interval of length 2;
- a square box of side length 2;
- a 3-dimensional cube of side length 2;
- a $d$-dimensional cube of side length 2, with $d$ very large.

For a $d$-dimensional cube with side length 2, the volume is:

$$
2^d
$$

So the volume grows exponentially in $d$. This is the mathematical reason the space gets very large very fast.

### 3.2 Key takeaways

The slides give three main takeaways:

1. **Sample complexity to get “dense data” is exponential in $d$.**  
   To cover a high-dimensional space well, the number of data points needed grows extremely quickly.

2. **It is difficult to get sufficient data coverage in high dimensions.**  
   Even large datasets may be sparse relative to the full high-dimensional space.

3. **Data often lie in a lower-dimensional subspace.**  
   This is the motivating assumption behind methods like PCA: even if data are recorded in $\mathbb{R}^d$, the meaningful variation may be concentrated in a much smaller number of directions.

---

## 4. Dimensionality reduction

### 4.1 Key concept: dimensionality reduction

#### Intuition

Dimensionality reduction tries to replace a high-dimensional representation with a lower-dimensional one while preserving the information that matters.

Instead of working with all $d$ original features, we seek a smaller number $k$, usually with:

$$
k \ll d
$$

The goal is not just to throw features away randomly. The goal is to keep the essential structure.

#### Formal-ish definition from the slides

Dimensionality reduction means reducing the number of input variables, or features, in a dataset while retaining essential information.

### 4.2 Why use dimensionality reduction?

The slides list three main motivations.

#### 4.2.1 Data visualisation

Humans can easily visualise 2D and sometimes 3D data. For $d > 3$, direct visualisation is difficult.

Dimensionality reduction can map high-dimensional data into 2D or 3D while trying to preserve important structure.

#### 4.2.2 Data compression and noise reduction

A lower-dimensional representation can be more compact.

If important structure lies in a few directions and noise lies in the remaining directions, dimensionality reduction can also act as a noise filter.

#### 4.2.3 Reducing compute cost and improving performance

Many algorithms become more expensive as the number of dimensions increases. Reducing the feature dimension can reduce computational cost and sometimes improve downstream model performance.

### 4.3 Algorithms mentioned

#### Linear dimensionality reduction

The slides list:

- PCA — Principal Component Analysis;
- ICA — Independent Component Analysis;
- CCA — Canonical Correlation Analysis.

#### Non-linear dimensionality reduction

The slides list:

- Kernel PCA;
- t-SNE;
- UMAP;
- ISOMAP;
- LLE;
- MDS.

---

## 5. Representation learning

### 5.1 Key concept: representation learning

#### Intuition

Representation learning is broader than dimensionality reduction. It is about learning useful features automatically rather than manually designing them.

A representation may be lower-dimensional, but it does not have to be. The key idea is that the system learns features useful for a task.

#### Formal-ish definition from the slides

Representation learning consists of machine-learning techniques that allow a system to automatically discover the representations, or features, needed for some task.

### 5.2 Examples given

The slides list:

- dimensionality reduction and manifold learning algorithms;
- autoencoders;
- Transformers and other neural-network-based models;
- contrastive learning;
- other self-supervised learning techniques.

### 5.3 Important distinction

Representation learning includes dimensionality reduction, but it is broader than dimensionality reduction.

So:

$$
\text{Dimensionality reduction} \subset \text{Representation learning}
$$

---

## 6. PCA motivation: data visualisation problem

### 6.1 Worked example: blood and urine measurements

The slides use an example with:

- 65 people;
- 53 features;
- measurements taken from blood and urine samples.

The central question is:

> How can we visualise the measurements?

The point is that the data matrix is too high-dimensional for direct human interpretation.

### 6.2 Matrix format: $65 \times 53$

The data can be shown as a matrix:

$$
65 \times 53
$$

where:

- each row is a person, or instance;
- each column is a feature, or measurement.

Problem: in raw matrix form, it is difficult to see correlations between features.

### 6.3 Plot format: 65 curves, one for each person

Another attempt is to plot one curve per person.

Problem: this gives 65 curves, which makes it difficult to compare different patients.

### 6.4 Plot format: 53 curves, one for each feature

Another attempt is to plot one curve per feature.

Problem: this makes it difficult to see correlations between features.

### 6.5 Projecting onto 2D and 3D subspaces

The slides then show bivariate and trivariate plots.

Problem:

- 2D projections only show two variables at a time;
- 3D projections only show three variables at a time;
- visualisation becomes difficult in 4 or more dimensions.

This motivates the key question:

$$
\text{How can we visualise the other variables?}
$$

### 6.6 PCA’s motivating questions

The slides then ask:

- Is there a better representation than the default coordinate axes?
- Is it really necessary to show all 53 dimensions?
- What if there are strong correlations between the features?
- How can we find the smallest subspace of the 53-dimensional space that keeps the most information about the original data?

These questions lead directly to PCA.

---

## 7. PCA basic setting

### 7.1 Key concept: Principal Component Analysis

#### Intuition

PCA finds new axes for the data. These axes are chosen so that the first axis captures as much variance as possible, the second captures as much remaining variance as possible, and so on.

The aim is to represent high-dimensional data in a lower-dimensional linear subspace while preserving as much of the data’s variation as possible.

### 7.2 Formal setup from the slides

We have:

- $N$ data points;
- each data point is a feature vector:

$$
x \in \mathbb{R}^d
$$

- the default data space is:

$$
\mathbb{R}^d
$$

where $d$ may be very large.

### 7.3 Main PCA assumption

The slides state the central PCA assumption:

> Most of the information given by the data points essentially lies within a $k$-dimensional linear subspace of $\mathbb{R}^d$.

That is, even though:

$$
x_i \in \mathbb{R}^d
$$

the data can be well approximated inside a smaller linear subspace:

$$
\mathcal{S} \subset \mathbb{R}^d,
\qquad
\dim(\mathcal{S}) = k,
\qquad
k \ll d
$$

### 7.4 Goals of PCA

The slides give three PCA goals:

1. Find the $k$-dimensional linear subspace.
2. Identify a suitable basis, or axes, for that subspace.
3. Project each data point onto that subspace.

---

## 8. Centring the data

### 8.1 Key concept: centred data

#### Intuition

PCA finds directions of variation around the centre of the dataset. Therefore, the data should be centred before applying PCA.

Centring means subtracting the sample mean from every data point, so the dataset has mean zero.

### 8.2 Formal definition

Given data points:

$$
x_1, \dots, x_N \in \mathbb{R}^d
$$

the sample mean is:

$$
\hat{\mu}
:=
\frac{1}{N}
\sum_{i=1}^{N} x_i
$$

The centred-data assumption is:

$$
\hat{\mu} = 0
$$

If the data are not centred, i.e.

$$
\hat{\mu} \neq 0,
$$

then recentre the data by subtracting the mean:

$$
\tilde{x}_i = x_i - \hat{\mu}
$$

The slides state that the sample mean is the centre of mass of the dataset and becomes the origin of the coordinate system found by PCA.

### 8.3 Visual interpretation

The slide visual titled **“Noncentred and centred”** shows the same point cloud before and after subtracting the mean. Before centring, the cloud is shifted away from the origin. After centring, the cloud is moved so that its centre of mass is at the origin.

---

## 9. PCA as variance maximisation

### 9.1 Direction that captures most variance

The slides show a 2D scatter plot where the data are elongated along a diagonal direction. PCA’s first principal component is the direction along which the projections of the data have maximum variance.

#### Intuition

If the data cloud is stretched out in one direction, projecting onto that direction keeps a lot of the structure. Projecting onto a direction perpendicular to the spread would collapse much of the variation.

### 9.2 First principal component

The first principal component vector $v_1$ is the unit vector that maximises the variance of projections onto it:

$$
v_1
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

where:

- $v$ is a candidate direction;
- $\|v\|=1$ enforces unit length;
- $v^\top x_i$ is the scalar projection of $x_i$ onto $v$;
- $(v^\top x_i)^2$ measures squared projected magnitude;
- the average over $i$ gives projected variance for centred data.

### 9.3 PCA as reconstruction error minimisation

The same first principal component can also be found by minimising reconstruction error:

$$
v_1
=
\arg\min_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
\left\|
x_i - (v^\top x_i)v
\right\|^2
$$

Here:

- $(v^\top x_i)v$ is the reconstruction of $x_i$ after projecting it onto the one-dimensional subspace spanned by $v$;
- $x_i - (v^\top x_i)v$ is the residual error;
- the objective minimises average squared reconstruction error.

### 9.4 Equivalence of the two objectives

The slides state the claim:

> The variance maximisation objective and reconstruction error minimisation objective are equivalent; they yield the same solution.

The algebra behind this, using the slide’s objective, is:

$$
\left\|
x_i - (v^\top x_i)v
\right\|^2
=
\left(
x_i - (v^\top x_i)v
\right)^\top
\left(
x_i - (v^\top x_i)v
\right)
$$

Expand:

$$
=
x_i^\top x_i
-
2(v^\top x_i)(x_i^\top v)
+
(v^\top x_i)^2(v^\top v)
$$

Since:

$$
x_i^\top v = v^\top x_i
$$

and:

$$
\|v\| = 1
\quad \Rightarrow \quad
v^\top v = 1
$$

we get:

$$
=
\|x_i\|^2
-
2(v^\top x_i)^2
+
(v^\top x_i)^2
$$

so:

$$
\left\|
x_i - (v^\top x_i)v
\right\|^2
=
\|x_i\|^2
-
(v^\top x_i)^2
$$

Average over all data points:

$$
\frac{1}{N}
\sum_{i=1}^{N}
\left\|
x_i - (v^\top x_i)v
\right\|^2
=
\frac{1}{N}
\sum_{i=1}^{N}
\|x_i\|^2
-
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

The first term:

$$
\frac{1}{N}
\sum_{i=1}^{N}
\|x_i\|^2
$$

does not depend on $v$. Therefore, minimising reconstruction error is equivalent to maximising:

$$
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

which is exactly the variance maximisation objective.

---

## 10. Second and $k$-th principal components

### 10.1 Second principal component

Once $v_1$ has been found, the second principal component $v_2$ is found by applying the same variance-maximisation idea to the residuals left after removing the part explained by $v_1$.

The slide gives:

$$
v_2
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
\left(
v^\top
\left(
x_i - (v_1^\top x_i)v_1
\right)
\right)^2
$$

Here:

$$
x_i - (v_1^\top x_i)v_1
$$

is the residual of $x_i$ after projecting onto the span of $v_1$.

### 10.2 General $k$-th principal component

For the $k$-th principal component, remove the projections onto all earlier principal components:

$$
x_i
-
\sum_{j=1}^{k-1}
(v_j^\top x_i)v_j
$$

Then choose $v_k$ to maximise variance of these residuals:

$$
v_k
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
\left(
v^\top
\left(
x_i
-
\sum_{j=1}^{k-1}
(v_j^\top x_i)v_j
\right)
\right)^2
$$

The residuals are with respect to the span of:

$$
v_1,\dots,v_{k-1}
$$

That is, by the time we find $v_k$, PCA has already removed the components of the data explained by the first $k-1$ principal directions.

---

## 11. PCA Algorithm I — sequential construction

Given centred data points:

$$
x_1,\dots,x_N
$$

compute the principal components sequentially.

### Step 1: First principal component

$$
v_1
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

### Step 2: $k$-th principal component

Given:

$$
v_1,\dots,v_{k-1}
$$

compute:

$$
v_k
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
\left(
v^\top
\left(
x_i
-
\sum_{j=1}^{k-1}
(v_j^\top x_i)v_j
\right)
\right)^2
$$

This gives the next direction that captures the largest remaining variance.

---

## 12. Data matrix notation

### 12.1 Definition

Given data points:

$$
x_1,\dots,x_N \in \mathbb{R}^d
$$

the data matrix is:

$$
X
=
\begin{pmatrix}
x_1^\top \\
x_2^\top \\
\vdots \\
x_N^\top
\end{pmatrix}
$$

So:

$$
X \in \mathbb{R}^{N \times d}
$$

The slides emphasise:

- one row per data point;
- one column per feature;
- $N$ = number of rows = number of data points;
- $d$ = number of columns = number of features = data dimension.

This notation applies to centred or non-centred data.

---

## 13. Sample covariance matrix

### 13.1 Key concept: sample covariance

#### Intuition

The covariance matrix records how features vary together. In PCA, it tells us which directions in feature space have high variance.

### 13.2 Formal definition

Given data points:

$$
x_1,\dots,x_N \in \mathbb{R}^d
$$

with sample mean:

$$
\hat{\mu}
=
\frac{1}{N}
\sum_{i=1}^{N}x_i
$$

the sample covariance matrix is the $d \times d$ matrix:

$$
\Sigma
=
\frac{1}{N}
\sum_{i=1}^{N}
(x_i-\hat{\mu})(x_i-\hat{\mu})^\top
$$

The $(j,k)$-entry is:

$$
\Sigma_{j,k}
=
\frac{1}{N}
\sum_{i=1}^{N}
(x_{i,j}-\hat{\mu}_j)(x_{i,k}-\hat{\mu}_k)
$$

where:

- $x_{i,j}$ is feature $j$ of data point $i$;
- $\hat{\mu}_j$ is coordinate $j$ of the sample mean;
- $\Sigma_{j,k}$ measures how feature $j$ and feature $k$ vary together.

### 13.3 Centred-data simplification

For centred data:

$$
\hat{\mu}=0
$$

so:

$$
\Sigma
=
\frac{1}{N}
\sum_{i=1}^{N}
x_i x_i^\top
$$

In matrix form:

$$
\Sigma
=
\frac{1}{N}
X^\top X
$$

where $X$ is the centred data matrix.

---

## 14. Eigenvalues and eigenvectors

### 14.1 Key concept: eigenvalue

#### Formal definition from the slides

Let $A$ be an $n \times n$ square matrix, and let $\lambda$ be a number.

$$
\lambda
\text{ is an eigenvalue of } A
$$

means:

$$
Av = \lambda v
$$

for some non-zero vector $v$.

The vector $v$ is an eigenvector corresponding to $\lambda$.

### 14.2 Equivalent formulations

The slides give:

$$
Av = \lambda v
$$

if and only if:

$$
(\lambda I - A)v = 0
$$

Therefore, $\lambda$ is an eigenvalue of $A$ if and only if:

$$
\ker(\lambda I - A)
$$

is nontrivial.

### 14.3 Characteristic polynomial

Classically, the eigenvalues of $A$ are the roots of its characteristic polynomial:

$$
p_A(\lambda)
=
\det(\lambda I - A)
$$

So to find eigenvalues, solve:

$$
\det(\lambda I - A)=0
$$

---

## 15. Worked example: eigenvalues of a $2 \times 2$ matrix

The slide gives the pen-and-paper exercise:

$$
A
=
\begin{pmatrix}
4 & 1 \\
2 & 3
\end{pmatrix}
$$

Find:

1. the eigenvalues;
2. an eigenvector corresponding to the largest eigenvalue.

### 15.1 Find the characteristic polynomial

Use:

$$
p_A(\lambda)
=
\det(\lambda I-A)
$$

First compute:

$$
\lambda I - A
=
\begin{pmatrix}
\lambda & 0 \\
0 & \lambda
\end{pmatrix}
-
\begin{pmatrix}
4 & 1 \\
2 & 3
\end{pmatrix}
=
\begin{pmatrix}
\lambda-4 & -1 \\
-2 & \lambda-3
\end{pmatrix}
$$

Then:

$$
p_A(\lambda)
=
\det
\begin{pmatrix}
\lambda-4 & -1 \\
-2 & \lambda-3
\end{pmatrix}
$$

$$
=
(\lambda-4)(\lambda-3)-(-1)(-2)
$$

$$
=
(\lambda-4)(\lambda-3)-2
$$

$$
=
\lambda^2 - 7\lambda + 12 - 2
$$

$$
=
\lambda^2 - 7\lambda + 10
$$

Factorise:

$$
\lambda^2 - 7\lambda + 10
=
(\lambda-5)(\lambda-2)
$$

So the eigenvalues are:

$$
\lambda_1 = 5,
\qquad
\lambda_2 = 2
$$

The largest eigenvalue is:

$$
\lambda_1 = 5
$$

### 15.2 Find an eigenvector for $\lambda = 5$

Solve:

$$
Av = 5v
$$

Equivalently:

$$
(A-5I)v = 0
$$

Compute:

$$
A-5I
=
\begin{pmatrix}
4 & 1 \\
2 & 3
\end{pmatrix}
-
\begin{pmatrix}
5 & 0 \\
0 & 5
\end{pmatrix}
=
\begin{pmatrix}
-1 & 1 \\
2 & -2
\end{pmatrix}
$$

Let:

$$
v =
\begin{pmatrix}
a \\
b
\end{pmatrix}
$$

Then:

$$
\begin{pmatrix}
-1 & 1 \\
2 & -2
\end{pmatrix}
\begin{pmatrix}
a \\
b
\end{pmatrix}
=
\begin{pmatrix}
0 \\
0
\end{pmatrix}
$$

The first row gives:

$$
-a+b=0
$$

so:

$$
b=a
$$

Choose $a=1$, $b=1$. An eigenvector is:

$$
v =
\begin{pmatrix}
1 \\
1
\end{pmatrix}
$$

Check:

$$
A
\begin{pmatrix}
1 \\
1
\end{pmatrix}
=
\begin{pmatrix}
4(1)+1(1) \\
2(1)+3(1)
\end{pmatrix}
=
\begin{pmatrix}
5 \\
5
\end{pmatrix}
=
5
\begin{pmatrix}
1 \\
1
\end{pmatrix}
$$

So:

$$
\boxed{
\lambda_{\max}=5,
\qquad
v=
\begin{pmatrix}
1\\
1
\end{pmatrix}
}
$$

---

## 16. PCA via the covariance matrix

### 16.1 Key idea

The slides state:

> PCA basis vectors, or principal component vectors, are the eigenvectors of $\Sigma$, arranged in order according to the corresponding eigenvalues.

So:

$$
\text{$k$-th principal component}
=
\text{eigenvector for the $k$-th largest eigenvalue}
$$

### 16.2 Why covariance eigenvectors appear

Using the centred-data covariance matrix:

$$
\Sigma
=
\frac{1}{N}X^\top X
=
\frac{1}{N}
\sum_{i=1}^{N}
x_i x_i^\top
$$

the first PCA objective becomes:

$$
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

Rewrite each term:

$$
(v^\top x_i)^2
=
v^\top x_i x_i^\top v
$$

Therefore:

$$
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
=
v^\top
\left(
\frac{1}{N}
\sum_{i=1}^{N}
x_i x_i^\top
\right)
v
$$

So:

$$
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
=
v^\top \Sigma v
$$

PCA chooses the unit vector $v$ that maximises:

$$
v^\top \Sigma v
$$

The maximising direction is the eigenvector corresponding to the largest eigenvalue of $\Sigma$. Subsequent principal components correspond to the next largest eigenvalues.

### 16.3 PCA Algorithm II — via sample covariance

Inputs:

- data points $x_1,\dots,x_N$;
- positive integer $k$.

Steps:

1. Recentre the data:

$$
x_i \leftarrow x_i - \hat{\mu}
$$

2. Form the centred data matrix:

$$
X
=
\begin{pmatrix}
x_1^\top \\
\vdots \\
x_N^\top
\end{pmatrix}
$$

3. Compute the covariance-related matrix. The covariance slide gives:

$$
\Sigma = \frac{1}{N}X^\top X
$$

The algorithm slide writes:

$$
\Sigma' = X^\top X
$$

4. Compute eigenvalues and eigenvectors:

$$
(\lambda_i, v_i)
$$

5. Reorder them so that:

$$
\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_d
$$

6. Return the top $k$ principal components:

$$
v_1,\dots,v_k
$$

**[UNCLEAR — normalisation]** The covariance definition uses $\frac{1}{N}X^\top X$, while Algorithm II writes $\Sigma' = X^\top X$. These have the same eigenvectors, but eigenvalues differ by a factor of $N$. Check the recording for how the lecturer handled this scaling.

---

## 17. Singular values and SVD

### 17.1 Key concept: singular values

#### Informal description from the slides

Let $X$ be a square or rectangular matrix of shape:

$$
n \times d
$$

The singular values of $X$ are defined as:

$$
\text{singular values of }X
=
\sqrt{
\text{eigenvalues of }X^\top X
}
$$

So if:

$$
X^\top X v_i = \lambda_i v_i
$$

then the corresponding singular value is:

$$
\sigma_i = \sqrt{\lambda_i}
$$

or equivalently:

$$
\lambda_i = \sigma_i^2
$$

### 17.2 Singular Value Decomposition

The slides write the SVD as:

$$
X = USV^\top
$$

with:

- $U$ of shape $n \times d$, whose columns form an orthonormal system in $\mathbb{R}^n$;
- $S$ a diagonal matrix of shape $d \times d$;
- $V$ of shape $d \times d$, whose columns form an orthonormal basis of $\mathbb{R}^d$.

The diagonal matrix is:

$$
S =
\operatorname{diag}(\sigma_1,\dots,\sigma_d)
$$

with:

$$
\sigma_1 \geq \sigma_2 \geq \cdots \geq \sigma_d
$$

The singular values are the diagonal elements of $S$.

### 17.3 PCA interpretation of SVD

The slides state:

> The columns of $V$, equivalently the rows of $V^\top$, are the principal components.

So PCA can be performed directly from the SVD of the centred data matrix.

---

## 18. PCA Algorithm III — via SVD

### 18.1 Key idea

PCA basis vectors, or principal components, are the column vectors of the matrix $V$ found by applying SVD to the centred data matrix $X$.

### 18.2 Algorithm

Inputs:

- data points $x_1,\dots,x_N$;
- positive integer $k$.

Steps:

1. Recentre the data:

$$
x_i \leftarrow x_i - \hat{\mu}
$$

2. Construct the centred data matrix:

$$
X
=
\begin{pmatrix}
x_1^\top \\
\vdots \\
x_N^\top
\end{pmatrix}
$$

3. Compute the SVD:

$$
X = USV^\top
$$

4. Let:

$$
v_1,\dots,v_d
$$

be the column vectors of $V$.

5. Return the top $k$ principal components:

$$
v_1,\dots,v_k
$$

### 18.3 Relation between eigenvalues and singular values

The slides state:

$$
\lambda_i = \sigma_i^2
$$

**[UNCLEAR — normalisation]** This relation is exact for eigenvalues of $X^\top X$. If $\lambda_i$ refers instead to eigenvalues of the sample covariance matrix $\Sigma = \frac{1}{N}X^\top X$, then the corresponding covariance eigenvalues would be $\frac{\sigma_i^2}{N}$. The slides use both covariance notation and $X^\top X$, so check the recording for the lecturer’s convention.

---

## 19. Explaining variance in the data

### 19.1 Component variance

The slides define:

$$
\lambda_k
=
\text{data variance in the $k$-th principal direction}
$$

So the eigenvalue attached to a principal component tells us how much variance is captured in that direction.

### 19.2 Total variance

The total variance is:

$$
\lambda_1 + \lambda_2 + \cdots + \lambda_d
$$

### 19.3 Variance captured by the top $k$ principal components

The variance for the top $k$ principal components is:

$$
\lambda_1 + \cdots + \lambda_k
$$

### 19.4 Explained variance ratio

The explained variance ratio for the $k$-th component is:

$$
\mathrm{EVR}_k
=
\frac{\lambda_k}
{\lambda_1+\lambda_2+\cdots+\lambda_d}
$$

### 19.5 Cumulative explained variance

The cumulative explained variance for the first $k$ principal components is the sum of the first $k$ explained variance ratios:

$$
\sum_{j=1}^{k}
\mathrm{EVR}_j
$$

Equivalently:

$$
\frac{
\lambda_1+\cdots+\lambda_k
}{
\lambda_1+\cdots+\lambda_d
}
$$

---

## 20. Worked example: explained variance

The slide gives:

$$
\lambda_1 = 50,
\qquad
\lambda_2 = 20,
\qquad
\lambda_3 = 10
$$

Question:

> What percentage of the total variance is explained by the first two principal components?

### 20.1 Total variance

$$
\lambda_1+\lambda_2+\lambda_3
=
50+20+10
=
80
$$

### 20.2 Variance explained by first two PCs

$$
\lambda_1+\lambda_2
=
50+20
=
70
$$

### 20.3 Percentage explained

$$
\frac{70}{80}
=
0.875
$$

$$
0.875 \times 100
=
87.5\%
$$

So the first two principal components explain:

$$
\boxed{87.5\%}
$$

of the total variance.

---

## 21. Worked visual example: variance maximisation vs reconstruction error

The slide titled **“PCA – Variance Maximisation and Error Minimisation”** shows two projections, Option A and Option B, for the same dataset. It asks:

- Which maximises the variance?
- Which minimises the reconstruction error?

**[UNCLEAR — transcript missing]** The slide poses this as a question and does not print the answer. From the visual geometry, **Option B** is the intended answer for both: it aligns with the elongated direction of the data cloud, so projected points vary more along the line, and perpendicular reconstruction errors are smaller.

This matches the formal claim from PCA:

$$
\text{maximise projected variance}
\quad \Longleftrightarrow \quad
\text{minimise reconstruction error}
$$

for centred data and unit projection directions.

---

## 22. Applications of PCA

The slides list the following applications.

### 22.1 Data visualisation

PCA can project high-dimensional data into a smaller number of dimensions, often 2D or 3D, for plotting.

### 22.2 Image processing and compression

PCA can be used to represent images using fewer components, reducing storage or computation.

### 22.3 Noise filtering and noise reduction

Directions with low variance can sometimes correspond to noise, so dropping them can reduce noise.

### 22.4 Data preprocessing

PCA can be used before other machine-learning methods to reduce feature dimension.

### 22.5 Common application areas

The slides list:

- computer vision;
- genomics and bioinformatics;
- data analytics;
- finance.

---

## 23. Limitations of PCA

### 23.1 Linearity restriction

PCA assumes the data should be projected onto an underlying **linear subspace**.

The slides state that PCA can fail when data lie essentially on **non-linear manifolds**, such as:

- two moons;
- Swiss roll datasets.

#### Intuition

If the true structure is curved, a flat linear subspace may not capture it well.

### 23.2 Variance does not necessarily equal relevance

PCA assumes that directions with higher variance are more important.

The slides explicitly warn:

$$
\text{Variance} \neq \text{Relevance}
$$

In some cases, the essential information or distinguishing features may lie in lower-variance components.

#### Intuition

A direction can have high variance but be irrelevant to the task. Conversely, a low-variance direction may contain important class-separating information.

### 23.3 Orthogonality restriction

PCA forces principal components to be orthogonal, or uncorrelated.

The slides note that real-world data, such as neural signals or certain genetic traits, may have underlying features that are not orthogonal, making PCA unsuitable.

---

## 24. Connections made in the lecture

### 24.1 Connection to earlier/parallel linear algebra

The lecture explicitly connects PCA to:

- eigenvalues;
- eigenvectors;
- singular values;
- Singular Value Decomposition.

These are not just side topics. They are the machinery used to compute principal components.

### 24.2 Connection to representation learning

Dimensionality reduction is presented as part of the broader area of representation learning. PCA is one way of learning a new representation: the new coordinates are the principal-component coordinates.

### 24.3 Connection to later/nonlinear methods

The lecture lists nonlinear dimensionality-reduction methods such as Kernel PCA, t-SNE, UMAP, ISOMAP, LLE, and MDS. This sets up PCA as the linear baseline before more flexible nonlinear methods.

### 24.4 Connection to applications

The lecture connects PCA and dimensionality reduction to practical areas including computer vision, genomics, bioinformatics, finance, and data analytics.

---

## 25. Exam flags and high-value revision points

### 25.1 Explicit exam flags

**[UNCLEAR — transcript missing]** No transcript was provided, and the slides do not contain explicit phrases such as “this will be on the exam,” “you should know this,” or “common mistake.”

### 25.2 Slide-based high-value revision points

These are not explicit exam flags, but they are prominent from the slides and likely revision-critical.

#### Know the motivation

- high-dimensional data;
- curse of dimensionality;
- lower-dimensional subspace assumption;
- dimensionality reduction as a response.

#### Know PCA’s two equivalent objectives

$$
v_1
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

and:

$$
v_1
=
\arg\min_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
\left\|
x_i - (v^\top x_i)v
\right\|^2
$$

The slides explicitly state that these objectives are equivalent.

#### Know centring

$$
\hat{\mu}
=
\frac{1}{N}
\sum_{i=1}^{N}x_i
$$

$$
\tilde{x}_i = x_i - \hat{\mu}
$$

PCA uses the sample mean as the origin of the PCA coordinate system.

#### Know covariance PCA

$$
\Sigma
=
\frac{1}{N}
X^\top X
$$

for centred data, and principal components are eigenvectors ordered by eigenvalues.

#### Know SVD PCA

$$
X = USV^\top
$$

The columns of $V$ are the principal components.

#### Know explained variance

$$
\mathrm{EVR}_k
=
\frac{\lambda_k}
{\lambda_1+\cdots+\lambda_d}
$$

and cumulative explained variance:

$$
\frac{\lambda_1+\cdots+\lambda_k}
{\lambda_1+\cdots+\lambda_d}
$$

#### Practise the pen-and-paper exercises

The slides include two exercises:

1. eigenvalues/eigenvectors of:

$$
\begin{pmatrix}
4 & 1 \\
2 & 3
\end{pmatrix}
$$

2. explained variance with:

$$
\lambda_1=50,\quad \lambda_2=20,\quad \lambda_3=10
$$

---

## 26. Unclear sections to check in the recording/transcript

### [UNCLEAR 1] Transcript missing

The prompt asks for both slides and transcript, but no transcript text was included. These notes therefore cannot capture:

- lecturer emphasis;
- spoken derivations;
- exam hints;
- common mistakes mentioned verbally;
- extra examples beyond the slides;
- clarifications of slide notation.

### [UNCLEAR 2] Option A vs Option B projection answer

The slide asks which projection maximises variance and minimises reconstruction error, but the answer is not written on the slide. The visual indicates **Option B**, but confirm from the recording.

### [UNCLEAR 3] Covariance normalisation

The sample covariance slide defines:

$$
\Sigma = \frac{1}{N}X^\top X
$$

for centred data, but Algorithm II writes:

$$
\Sigma' = X^\top X
$$

These matrices share eigenvectors but have eigenvalues differing by a factor of $N$. Check whether the lecturer used $\lambda_i$ for covariance eigenvalues or for eigenvalues of $X^\top X$.

### [UNCLEAR 4] SVD eigenvalue relation

The slides state:

$$
\lambda_i = \sigma_i^2
$$

This is exact when $\lambda_i$ refers to eigenvalues of $X^\top X$. If $\lambda_i$ refers to eigenvalues of the sample covariance matrix, the relation would include the $\frac{1}{N}$ factor. Check the recording for notation.

### [UNCLEAR 5] Derivation depth

The slides state that variance maximisation and reconstruction-error minimisation are equivalent, but do not show a full derivation. The derivation included above follows directly from the displayed objectives. Check the recording to see whether the lecturer gave additional derivation details or skipped it.

