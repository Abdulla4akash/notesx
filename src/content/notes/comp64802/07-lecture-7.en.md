---
subject: COMP64802
chapter: 7
title: "Lecture 7"
language: en
---

# COMP 64802 — Advanced Topics in Machine Learning
# Lecture 7 Study Notes: Independent Component Analysis and Kernel PCA

**Course:** COMP 64802 — Advanced Topics in Machine Learning  
**Lecturer:** Dr Omar Rivasplata, University of Manchester  
**Lecture:** Lecture 7 — Wed 25/3/2026  
**Lecture topic:** Independent Component Analysis; Kernel PCA  
**Source status:** Slide deck received. Lecture transcript was not provided, so these notes are slide-grounded only. Wherever spoken explanation would be needed to resolve a gap, the notes mark **[UNCLEAR]**.

---

## Topic and scope

This lecture covers two advanced unsupervised learning / representation-learning methods: **Independent Component Analysis (ICA)** and **Kernel PCA**. ICA is introduced as a blind source separation method for recovering independent non-Gaussian sources from observed mixtures. Kernel PCA is introduced as a nonlinear extension of PCA using kernels, Gram/kernel matrices, feature maps, and Hilbert-space embeddings.

The lecture is structured as approximately **25 minutes of ICA** followed by approximately **35 minutes of Kernel PCA**.

---

## Intended Learning Outcomes

By the end of the lecture, the intended learning outcomes are:

1. Understand the **blind source separation problem** motivating Independent Component Analysis.
2. Gain a working familiarity with the **linear mixing model** and the **solution method** of ICA.
3. Understand the **limitations of linear PCA** that motivate Kernel PCA.
4. Understand the setting of Kernel PCA via the **kernel matrix**, and its analogy with linear PCA via the **Gram matrix**.
5. Refresh and reinforce related linear analysis content, including:
   - eigenvalues,
   - singular values,
   - Hilbert spaces,
   - kernels.

---

# Part I — Independent Component Analysis $\mathrm{ICA}$

---

## 1. What ICA is

### Intuition

Independent Component Analysis is used when we observe mixtures of underlying signals and want to recover the original hidden sources.

The canonical motivating example is the **cocktail party problem**:

- Several people speak at the same time.
- Several microphones record mixtures of all speakers.
- Each microphone signal is a different mixture of the same underlying speaker signals.
- The task is to recover the individual voices from only the mixed recordings.

The lecture also refers to the **cocktail party effect**: many people can hold a one-to-one conversation in the middle of a noisy party. If someone cannot isolate the target conversation, they have the cocktail party problem.

### Formal-ish definition from the lecture slides

ICA is a **blind source separation technique** whose goal is decomposing a multivariate signal into components that are:

- additive,
- statistically independent,
- non-Gaussian.

This process is called **unmixing**.

### Core assumption

The underlying source signals are assumed to be:

$$
\text{statistically independent}
$$

and to have:

$$
\text{non-Gaussian distributions}.
$$

This assumption is central. ICA is not presented as a method for Gaussian source signals.

---

## 2. Audio source separation example

The slides show a source separation setup with:

- hidden or “blind” source speakers,
- recorded mixtures from several microphones,
- an ICA stage that estimates the original sources.

### Before ICA

The observed microphone signals are mixed audio signals from blind sources. Each microphone receives a different mixture of the speakers.

### After ICA

ICA is performed to estimate the original source signals. The slide illustration shows four recorded microphone mixtures being transformed into estimated sources corresponding to individual speakers.

### Key point

ICA works from the **mixed signals only**. The original sources are not observed directly, and the mixing process is also unknown.

---

## 3. Basic ICA setting: source and mixed signals

### Source signals

There are $n$ source signals:

$$
s_1, \ldots, s_n.
$$

They are written in vector form as:

$$
s =
\begin{pmatrix}
s_1 \\
\vdots \\
s_n
\end{pmatrix}
\in \mathbb{R}^n.
$$

The source signals satisfy the ICA assumptions:

$$
s_1,\ldots,s_n
\quad\text{are statistically independent and have non-Gaussian distributions.}
$$

### Mixed signals

There are $m$ mixed signals:

$$
x_1, \ldots, x_m.
$$

They are written in vector form as:

$$
x =
\begin{pmatrix}
x_1 \\
\vdots \\
x_m
\end{pmatrix}
\in \mathbb{R}^m.
$$

### Observables

Only the mixed signals are observed:

$$
x_1, \ldots, x_m.
$$

### Goal

The goal is to estimate the source signals:

$$
s_1,\ldots,s_n.
$$

These estimated source signals are also called the **independent components**.

---

## 4. ICA linear mixing model

### Formal model

The mixed signals are assumed to be linear combinations of the source signals.

The model is:

$$
x = As.
$$

In matrix form:

$$
\begin{pmatrix}
x_1 \\
x_2 \\
\vdots \\
x_m
\end{pmatrix}
=
\begin{pmatrix}
a_{1,1} & \cdots & a_{1,n} \\
a_{2,1} & \cdots & a_{2,n} \\
\vdots & \ddots & \vdots \\
a_{m,1} & \cdots & a_{m,n}
\end{pmatrix}
\begin{pmatrix}
s_1 \\
s_2 \\
\vdots \\
s_n
\end{pmatrix}.
$$

Here:

$$
A \in \mathbb{R}^{m \times n}
$$

is the **mixing matrix**.

### What is observed?

Only the left-hand side is observed:

$$
x.
$$

### What must be estimated?

Both the mixing matrix and the source signals are unknown:

$$
A \quad\text{and}\quad s.
$$

Therefore ICA must estimate the original source signals from only the observed mixtures.

---

## 5. Whitened source signals

The lecture introduces a whitened-source condition:

$$
\mathbb{E}[ss^\top] = I.
$$

This means the covariance matrix of the random signal is the identity matrix.

### Consequences stated in the slides

If:

$$
\mathbb{E}[ss^\top] = I,
$$

then:

- the components are uncorrelated,
- each component has unit variance,
- the covariance matrix is the identity matrix.

The slides also state that the components are statistically independent, hence uncorrelated.

### Intuition

Whitening is described as a **linear change of basis**. It transforms signals so that second-order correlations are removed and the components have unit variance.

### [UNCLEAR]

The slide writes:

$$
\mathbb{E}[ss^\top] = I
$$

and describes this as the covariance matrix being the identity. This is exactly the covariance matrix when the signal has zero mean. The transcript is needed to confirm whether the lecturer explicitly assumed or stated centering / zero mean at this point.

---

## 6. ICA solution idea

### Unmixing matrix

ICA seeks an **unmixing matrix** $W$ such that the estimated source vector is:

$$
\hat{s} = Wx.
$$

The matrix $W$ is intended to undo the mixing caused by $A$.

### Optimisation objective

The optimisation objective is:

$$
\text{Find } W \text{ that maximises the statistical independence of the components of } \hat{s}.
$$

This is the key distinction from PCA:

- PCA maximises variance.
- ICA maximises independence.

### Simplifying assumption

For the derivation that follows, the lecture assumes:

$$
m = n.
$$

That is, the number of observed mixed signals equals the number of source signals.

---

## 7. ICA estimation from data

### Data matrix

Given data points:

$$
x_1, \ldots, x_N \in \mathbb{R}^m,
$$

the data matrix is:

$$
X =
\begin{pmatrix}
x_1^\top \\
x_2^\top \\
\vdots \\
x_N^\top
\end{pmatrix}
\in \mathbb{R}^{N \times m}.
$$

---

## 8. SVD argument for the unmixing matrix

The slides write the singular value decomposition of the unmixing matrix as:

$$
W = USV^\top.
$$

Then:

$$
WW^\top = USV^\top(USV^\top)^\top.
$$

Expanding the transpose:

$$
(USV^\top)^\top = VS^\top U^\top.
$$

So:

$$
WW^\top = USV^\top VS^\top U^\top.
$$

Using orthogonality:

$$
V^\top V = I,
$$

the expression becomes:

$$
WW^\top = USS^\top U^\top.
$$

The slides write this as:

$$
WW^\top = US^2U^\top.
$$

### Comparison with eigenvalue decomposition

The eigenvalue decomposition of $X^\top X$ is given as:

$$
X^\top X = QDQ^\top.
$$

The slides then state:

$$
X^\top X = WW^\top.
$$

Comparing:

$$
WW^\top = US^2U^\top
$$

with:

$$
X^\top X = QDQ^\top,
$$

the conclusion is:

$$
U = Q
$$

and:

$$
S^2 = D.
$$

Therefore:

$$
S = D^{1/2}.
$$

So the unmixing matrix has the form:

$$
W = QD^{1/2}V^\top.
$$

The remaining task is estimating the orthogonal matrix:

$$
V.
$$

The slides refer to this remaining task as **projection pursuit**.

### [UNCLEAR]

The equality:

$$
X^\top X = WW^\top
$$

is stated in the slides, but the visible slide content does not justify why it holds. The transcript is needed to recover the missing assumption or intermediate step.

---

## 9. Measuring non-Gaussianity

ICA requires source signals to be non-Gaussian. The lecture introduces **kurtosis** and **excess kurtosis** as a way to measure non-Gaussianity.

---

### 9.1 Kurtosis

For a random variable $X$, the kurtosis is:

$$
\kappa
=
\mathbb{E}
\left[
\left(
\frac{X-\mu}{\sigma}
\right)^4
\right],
$$

where:

$$
\mu = \text{mean of } X,
$$

and:

$$
\sigma = \text{standard deviation of } X.
$$

For Gaussian variables:

$$
\kappa = 3.
$$

---

### 9.2 Excess kurtosis

The **excess kurtosis** of $X$ is:

$$
\kappa - 3
=
\mathbb{E}
\left[
\left(
\frac{X-\mu}{\sigma}
\right)^4
\right]
-3.
$$

It can be used as a measure of non-Gaussianity.

---

### 9.3 Classification by excess kurtosis

#### Mesokurtic

$$
\kappa - 3 = 0.
$$

Interpretation:

- peak and tails are similar to the Gaussian.

#### Leptokurtic

$$
\kappa - 3 > 0.
$$

Interpretation:

- non-Gaussian,
- thin peak,
- fat tails.

#### Platykurtic

$$
\kappa - 3 < 0.
$$

Interpretation:

- non-Gaussian,
- fat peak,
- thin tails.

---

## 10. ICA applications

The slides list these applications of ICA:

- separating sound signals,
- analysis of EEG data,
- analysis of functional MRI data,
- natural scene analysis,
- and more.

---

## 11. ICA limitations

The slides list the following limitations of the ICA setup discussed in the lecture.

### 11.1 No Gaussian sources

ICA cannot have Gaussian sources.

This connects directly to the core assumption that source components must be non-Gaussian.

### 11.2 No nonlinear mixture

The model discussed assumes a linear mixture:

$$
x = As.
$$

The slides state that this form of ICA cannot handle nonlinear mixtures.

### 11.3 Number of recoverable sources

The slides state:

> Can only recover as many sources as you have observations.

In notation, if there are $m$ observed mixed signals, this setup cannot recover more than $m$ source signals.

### 11.4 Noise-free assumption

The model discussed assumes clean mixed signals with no noise.

The noisy additive model is:

$$
x = As + \epsilon.
$$

The slides state that this additive-noise version exists, but its solution needs more work.

---

## 12. ICA vs PCA

The slides explicitly compare PCA and ICA.

### PCA

PCA has:

- primary goal: **reducing dimension**,
- components: **orthogonal directions**,
- optimisation objective: **variance maximisation**,
- data distribution: can be Gaussian.

### ICA

ICA has:

- primary goal: **signal separation**,
- components: **statistically independent components**,
- optimisation objective: **independence maximisation**,
- signal distribution: must be non-Gaussian.

### Key conceptual distinction

PCA finds directions of maximum variance. ICA finds components that are statistically independent. Both involve linear transformations, but they optimise different criteria.

---

# Part II — Kernel PCA

---

## 13. Motivation for Kernel PCA

The Kernel PCA section begins with the limitation:

$$
\text{Linear PCA assumes a linear manifold.}
$$

The slide illustration shows data points around a flat linear plane, making the point that ordinary PCA fits linear directions or subspaces. This can be restrictive when the structure of the data is nonlinear.

Kernel PCA addresses this by embedding the data into another space, where applying PCA-like operations can capture nonlinear structure in the original data space.

---

# Linear PCA review

---

## 14. Data matrix

Given data points:

$$
x_1, \ldots, x_N \in \mathbb{R}^d,
$$

the data matrix is:

$$
X =
\begin{pmatrix}
x_1^\top \\
x_2^\top \\
\vdots \\
x_N^\top
\end{pmatrix}
\in \mathbb{R}^{N \times d}.
$$

Each data point is stored as a row of $X$.

---

## 15. Sample covariance matrix

The sample covariance matrix is:

$$
\Sigma
=
\frac{1}{N}
\sum_{i=1}^{N}
(x_i-\hat{\mu})(x_i-\hat{\mu})^\top,
$$

where:

$$
\hat{\mu}
=
\frac{1}{N}
\sum_{i=1}^{N}x_i.
$$

For centred data:

$$
\Sigma
=
\frac{1}{N}
\sum_{i=1}^{N}x_i x_i^\top.
$$

Equivalently:

$$
\Sigma
=
\frac{1}{N}X^\top X.
$$

---

## 16. Pen-and-paper exercise: showing $X^\top X = \sum_i x_i x_i^\top$

### Exercise statement

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d
$$

with data matrix $X$, show that:

$$
X^\top X = \sum_{i=1}^{N}x_i x_i^\top.
$$

### Derivation

Since:

$$
X =
\begin{pmatrix}
x_1^\top \\
x_2^\top \\
\vdots \\
x_N^\top
\end{pmatrix},
$$

we have:

$$
X^\top =
\begin{pmatrix}
x_1 & x_2 & \cdots & x_N
\end{pmatrix}.
$$

Therefore:

$$
X^\top X
=
\begin{pmatrix}
x_1 & x_2 & \cdots & x_N
\end{pmatrix}
\begin{pmatrix}
x_1^\top \\
x_2^\top \\
\vdots \\
x_N^\top
\end{pmatrix}.
$$

Multiplying blockwise gives:

$$
X^\top X
=
x_1x_1^\top + x_2x_2^\top + \cdots + x_Nx_N^\top.
$$

Hence:

$$
X^\top X
=
\sum_{i=1}^{N}x_i x_i^\top.
$$

---

## 17. Linear PCA via EVD of the sample covariance matrix

### Core idea

The PCA basis vectors, also called **principal component vectors**, are the eigenvectors of the covariance matrix $\Sigma$. They are arranged according to the corresponding eigenvalues.

The $k$-th principal component is:

$$
\text{eigenvector corresponding to the } k\text{-th largest eigenvalue}.
$$

### Algorithm from the slides

Inputs:

$$
x_1,\ldots,x_N,
$$

and a positive integer:

$$
k.
$$

Step 1. Recentre the data:

$$
x_i \leftarrow x_i - \hat{\mu}.
$$

Step 2. Construct the centred data matrix:

$$
X =
\begin{pmatrix}
x_1^\top \\
\vdots \\
x_N^\top
\end{pmatrix}.
$$

Step 3. Compute:

$$
\Sigma' = X^\top X.
$$

Step 4. Compute eigenvalues and eigenvectors:

$$
(\lambda_i,v_i)
$$

of:

$$
\Sigma'.
$$

Step 5. Reorder them so that:

$$
\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_d \geq 0.
$$

Step 6. Return the top $k$ principal components:

$$
v_1,\ldots,v_k.
$$

### Note on scaling

Earlier, the covariance matrix was written as:

$$
\Sigma = \frac{1}{N}X^\top X.
$$

The algorithm slide uses:

$$
\Sigma' = X^\top X.
$$

This rescales eigenvalues by a factor of $N$, but it does not change the eigenvectors.

---

## 18. Pen-and-paper exercise: showing $XX^\top$ is the Gram matrix

### Exercise statement

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d
$$

with data matrix $X$, show that:

$$
XX^\top
$$

is the Gram matrix with $(j,k)$-entry:

$$
x_j^\top x_k.
$$

### Derivation

The $j$-th row of $X$ is:

$$
x_j^\top.
$$

The $k$-th column of $X^\top$ is:

$$
x_k.
$$

Therefore, the $(j,k)$-entry of $XX^\top$ is:

$$
(XX^\top)_{jk} = x_j^\top x_k.
$$

So:

$$
XX^\top
=
\begin{pmatrix}
x_1^\top x_1 & x_1^\top x_2 & \cdots & x_1^\top x_N \\
x_2^\top x_1 & x_2^\top x_2 & \cdots & x_2^\top x_N \\
\vdots & \vdots & \ddots & \vdots \\
x_N^\top x_1 & x_N^\top x_2 & \cdots & x_N^\top x_N
\end{pmatrix}.
$$

This is exactly the Gram matrix.

---

## 19. Linear PCA via SVD of the data matrix

### Core idea

The PCA basis vectors, or principal components, are the column vectors of the matrix $V$ obtained from the SVD of the centred data matrix $X$.

### Algorithm from the slides

Inputs:

$$
x_1,\ldots,x_N,
$$

and a positive integer:

$$
k.
$$

Step 1. Recentre data:

$$
x_i \leftarrow x_i - \hat{\mu}.
$$

Step 2. Construct the centred data matrix:

$$
X =
\begin{pmatrix}
x_1^\top \\
\vdots \\
x_N^\top
\end{pmatrix}.
$$

Step 3. Compute the SVD:

$$
X = USV^\top.
$$

Step 4. Let:

$$
v_1,\ldots,v_d
$$

be the column vectors of $V$.

Step 5. Return:

$$
v_1,\ldots,v_k.
$$

---

## 20. Singular values

### Definition from the slides

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d
$$

with data matrix:

$$
X \in \mathbb{R}^{N \times d},
$$

a pair of singular vectors:

$$
u \in \mathbb{R}^N,
\qquad
v \in \mathbb{R}^d,
$$

and singular value:

$$
\sigma > 0
$$

satisfy:

$$
\sigma u = Xv
$$

and:

$$
\sigma v = X^\top u.
$$

Equivalently:

$$
Xv = \sigma u,
$$

and:

$$
X^\top u = \sigma v.
$$

---

### Connection to eigenvectors

The slides state:

$$
v \text{ is an eigenvector of } X^\top X \text{ with eigenvalue } \sigma^2,
$$

and:

$$
u \text{ is an eigenvector of } XX^\top \text{ with eigenvalue } \sigma^2.
$$

#### Derivation for $v$

Start with:

$$
Xv = \sigma u.
$$

Left-multiply by $X^\top$:

$$
X^\top Xv = X^\top(\sigma u).
$$

Pull out $\sigma$:

$$
X^\top Xv = \sigma X^\top u.
$$

Using:

$$
X^\top u = \sigma v,
$$

we get:

$$
X^\top Xv = \sigma(\sigma v).
$$

Therefore:

$$
X^\top Xv = \sigma^2 v.
$$

So $v$ is an eigenvector of $X^\top X$ with eigenvalue $\sigma^2$.

#### Derivation for $u$

Start with:

$$
X^\top u = \sigma v.
$$

Left-multiply by $X$:

$$
XX^\top u = X(\sigma v).
$$

Pull out $\sigma$:

$$
XX^\top u = \sigma Xv.
$$

Using:

$$
Xv = \sigma u,
$$

we get:

$$
XX^\top u = \sigma(\sigma u).
$$

Therefore:

$$
XX^\top u = \sigma^2 u.
$$

So $u$ is an eigenvector of $XX^\top$ with eigenvalue $\sigma^2$.

---

### SVD structure

The SVD is:

$$
X = USV^\top.
$$

The slides give the following shapes:

$$
U \in \mathbb{R}^{N \times d},
$$

with columns:

$$
u_1,\ldots,u_d
$$

forming an orthonormal system in:

$$
\mathbb{R}^N.
$$

Also:

$$
V \in \mathbb{R}^{d \times d},
$$

with columns:

$$
v_1,\ldots,v_d
$$

forming an orthonormal basis of:

$$
\mathbb{R}^d.
$$

The diagonal matrix is:

$$
S = \operatorname{diag}(\sigma_1,\ldots,\sigma_d),
$$

with shape:

$$
d \times d.
$$

The singular values are ordered:

$$
\sigma_1 \geq \sigma_2 \geq \cdots \geq \sigma_d.
$$

The slide states that the singular values are all positive.

### [UNCLEAR]

The statement that all singular values are positive assumes a full-rank setting. The transcript is needed to check whether rank-deficient cases were discussed.

---

## 21. Gram matrix

### Definition

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d,
$$

the Gram matrix is:

$$
G =
\begin{pmatrix}
x_1^\top x_1 & x_1^\top x_2 & \cdots & x_1^\top x_N \\
x_2^\top x_1 & x_2^\top x_2 & \cdots & x_2^\top x_N \\
\vdots & \vdots & \ddots & \vdots \\
x_N^\top x_1 & x_N^\top x_2 & \cdots & x_N^\top x_N
\end{pmatrix}.
$$

It has shape:

$$
N \times N,
$$

where $N$ is the number of data points.

### Matrix form

The Gram matrix is:

$$
G = XX^\top,
$$

where:

$$
X \in \mathbb{R}^{N \times d}
$$

is the data matrix.

---

## 22. Centred Gram matrix

If the data are not centred, they need to be recentred:

$$
\tilde{x}_i \leftarrow x_i - \hat{\mu}.
$$

This changes the Gram matrix.

The centred Gram matrix is:

$$
\tilde{G}
=
G
-
\frac{1}{N}\mathbf{1}G
-
\frac{1}{N}G\mathbf{1}
+
\frac{1}{N^2}\mathbf{1}G\mathbf{1}.
$$

Here:

$$
\mathbf{1}
$$

is the $N \times N$ matrix whose entries are all $1$'s.

Important notation point:

$$
\mathbf{1} \neq I.
$$

That is, $\mathbf{1}$ is the all-ones matrix, not the identity matrix.

---

## 23. Linear PCA via the centred Gram matrix

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d,
$$

the slide procedure is:

1. Construct the Gram matrix:

   

$$
G.
$$

2. Construct the centred Gram matrix:

   

$$
\tilde{G}.
$$

3. Apply EVD to the centred Gram matrix.

4. Obtain eigenvalues:

   

$$
\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_N \geq 0.
$$

5. For a positive integer $k$, choose the top $k$ eigenvalues.

### Key warning from the slide

The eigenvectors in this Gram-matrix formulation are in:

$$
\mathbb{R}^N,
$$

not in the original data space.

This point is important because Kernel PCA also works through an $N \times N$ matrix rather than directly through a $d \times d$ covariance matrix.

---

## 24. Example: 2D dataset with clusters

The slides show a 2D dataset with three visible clusters.

### Linear PCA version

The linear PCA slide states:

> Linear PCA would find principal components in the data space.

The visual shows principal axes or contour-like linear structure in the original 2D space, followed by a projection onto PC1 and PC2.

The key idea is that ordinary PCA finds linear directions in the original input space.

### Kernel PCA version

The Kernel PCA slide states:

> Kernel PCA would embed data space into some other space.

The visual shows nonlinear contour-like structure around the clusters in input space, and a Kernel PC1 / Kernel PC2 representation in which the cluster structure is transformed.

The point of the example is that Kernel PCA can use a nonlinear embedding before doing a PCA-like operation.

---

# Kernel PCA, feature maps, and kernels

---

## 25. Feature map example

### Original data space

Suppose the original data space is:

$$
\mathbb{R}^2.
$$

Let:

$$
x =
\begin{pmatrix}
x_1 \\
x_2
\end{pmatrix}.
$$

The slides give a degree-2 polynomial expansion:

$$
\phi(x)
=
\begin{pmatrix}
1 \\
\sqrt{2}x_1 \\
\sqrt{2}x_2 \\
x_1^2 \\
x_2^2 \\
\sqrt{2}x_1x_2
\end{pmatrix}.
$$

This defines a nonlinear embedding:

$$
\phi : \mathbb{R}^2 \to \mathbb{R}^6.
$$

---

### Scalar product in feature space

For two points:

$$
x =
\begin{pmatrix}
x_1 \\
x_2
\end{pmatrix},
\qquad
 y =
\begin{pmatrix}
y_1 \\
y_2
\end{pmatrix},
$$

the scalar product in the feature space is:

$$
\phi(x)^\top \phi(y)
=
1
+2x_1y_1
+2x_2y_2
+x_1^2y_1^2
+x_2^2y_2^2
+2x_1x_2y_1y_2.
$$

This can be rewritten as:

$$
\phi(x)^\top \phi(y)
=
(1+x_1y_1+x_2y_2)^2.
$$

Since:

$$
x^\top y = x_1y_1+x_2y_2,
$$

we get:

$$
\phi(x)^\top \phi(y)
=
(1+x^\top y)^2.
$$

---

### Kernel induced by this feature map

Define:

$$
\kappa(x,y)
=
(1+x^\top y)^2.
$$

Then:

$$
\phi(x)^\top \phi(y)
=
\kappa(x,y).
$$

This is the key computational idea: an inner product in the expanded feature space can be computed using only the original vectors $x$ and $y$.

---

## 26. Meaning of “kernel”

### Formal-ish definition

Let $\mathcal{X}$ be a set.

A kernel on $\mathcal{X}$ is a function:

$$
\kappa : \mathcal{X} \times \mathcal{X} \to \mathbb{R}
$$

satisfying two properties:

1. symmetry,
2. positive semi-definiteness.

---

### Symmetry

The kernel must satisfy:

$$
\kappa(x,x') = \kappa(x',x)
$$

for any:

$$
x,x' \in \mathcal{X}.
$$

---

### Positive semi-definiteness

The kernel must satisfy:

$$
\sum_{i=1}^{n}
\sum_{j=1}^{n}
c_i c_j \kappa(x_i,x_j)
\geq 0.
$$

This must hold for:

$$
n \in \mathbb{N},
$$

any:

$$
x_1,\ldots,x_n \in \mathcal{X},
$$

and any:

$$
c_1,\ldots,c_n \in \mathbb{R}.
$$

---

## 27. Pen-and-paper exercise: showing $\kappa(x,y)=(1+x^\top y)^2$ is a kernel

### Exercise statement

Show that:

$$
\kappa(x,y)=(1+x^\top y)^2
$$

meets the properties to be a kernel.

### Symmetry

Because:

$$
x^\top y = y^\top x,
$$

we have:

$$
1+x^\top y = 1+y^\top x.
$$

Therefore:

$$
(1+x^\top y)^2 = (1+y^\top x)^2.
$$

So:

$$
\kappa(x,y)=\kappa(y,x).
$$

Thus the kernel is symmetric.

### Positive semi-definiteness

From the feature-map example:

$$
\kappa(x,y)=\phi(x)^\top \phi(y).
$$

Then for any $x_1,\ldots,x_n$ and $c_1,\ldots,c_n$:

$$
\sum_{i=1}^{n}
\sum_{j=1}^{n}
c_i c_j \kappa(x_i,x_j)
=
\sum_{i=1}^{n}
\sum_{j=1}^{n}
c_i c_j \phi(x_i)^\top \phi(x_j).
$$

Regroup:

$$
=
\left(
\sum_{i=1}^{n}c_i\phi(x_i)
\right)^\top
\left(
\sum_{j=1}^{n}c_j\phi(x_j)
\right).
$$

This is a squared norm:

$$
=
\left\|
\sum_{i=1}^{n}c_i\phi(x_i)
\right\|^2
\geq 0.
$$

Therefore $\kappa$ is positive semi-definite.

So:

$$
\kappa(x,y)=(1+x^\top y)^2
$$

is a kernel.

---

## 28. From feature map to kernel

Let $\mathcal{X}$ be a set, and let:

$$
\phi : \mathcal{X} \to H
$$

be a mapping into a Hilbert space $H$.

Define:

$$
\kappa : \mathcal{X} \times \mathcal{X} \to \mathbb{R}
$$

by:

$$
\kappa(x,y)=\phi(x)^\top \phi(y).
$$

The slide states the claim:

$$
\kappa(\cdot,\cdot) \text{ is a kernel.}
$$

The proof is described as “routine calculations.”

### Proof idea

Symmetry comes from the symmetry of the inner product.

Positive semi-definiteness comes from:

$$
\sum_{i=1}^{n}
\sum_{j=1}^{n}
c_i c_j \kappa(x_i,x_j)
=
\left\|
\sum_{i=1}^{n}c_i\phi(x_i)
\right\|^2
\geq 0.
$$

### [UNCLEAR]

The slide uses transpose notation:

$$
\phi(x)^\top \phi(y),
$$

even though $H$ is described as a Hilbert space. The next slide uses Hilbert-space inner product notation:

$$
\langle \phi(x),\phi(y)\rangle_H.
$$

The transcript is needed to confirm whether the lecturer was temporarily using finite-dimensional Euclidean notation for intuition or moving directly to the general Hilbert-space setting.

---

## 29. For any kernel, there is a feature map

The slides state the converse direction.

Let:

$$
\kappa : \mathcal{X} \times \mathcal{X} \to \mathbb{R}
$$

be a kernel on $\mathcal{X}$.

Then there exists:

- a Hilbert space $H$,
- a feature map:

$$
\phi : \mathcal{X} \to H,
$$

such that:

$$
\kappa(x,y)
=
\langle \phi(x),\phi(y)\rangle_H
$$

for every:

$$
x,y \in \mathcal{X}.
$$

The slides state that proving this claim is highly nontrivial and requires a lot of work.

The Hilbert space $H$ is called a:

$$
\text{Reproducing Kernel Hilbert Space, or RKHS}.
$$

The slide also notes that RKHS theory could take a whole course unit to cover.

---

## 30. Kernel matrix

### Definition

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d,
$$

and a kernel:

$$
\kappa(\cdot,\cdot)
$$

on:

$$
\mathbb{R}^d,
$$

the kernel matrix is:

$$
K =
\begin{pmatrix}
\kappa(x_1,x_1) & \kappa(x_1,x_2) & \cdots & \kappa(x_1,x_N) \\
\kappa(x_2,x_1) & \kappa(x_2,x_2) & \cdots & \kappa(x_2,x_N) \\
\vdots & \vdots & \ddots & \vdots \\
\kappa(x_N,x_1) & \kappa(x_N,x_2) & \cdots & \kappa(x_N,x_N)
\end{pmatrix}.
$$

Thus:

$$
K_{ij} = \kappa(x_i,x_j).
$$

### Relationship to feature maps

If a feature map $\phi$ were known, the slides write:

$$
K = \phi(X)\phi(X)^\top.
$$

This mirrors the Gram matrix identity:

$$
G = XX^\top.
$$

The difference is that the ordinary dot product:

$$
x_i^\top x_j
$$

is replaced by the kernel value:

$$
\kappa(x_i,x_j),
$$

which corresponds to an inner product after embedding.

### [UNCLEAR]

The notation $\phi(X)$ is compact. The transcript is needed to confirm whether the lecturer explicitly defined it as the data matrix after applying $\phi$ row-wise to each data point.

---

## 31. Centred kernel matrix

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d,
$$

and kernel:

$$
\kappa(\cdot,\cdot),
$$

the centred kernel matrix is:

$$
\tilde{K}
=
K
-
\frac{1}{N}\mathbf{1}K
-
\frac{1}{N}K\mathbf{1}
+
\frac{1}{N^2}\mathbf{1}K\mathbf{1}.
$$

Here:

$$
\mathbf{1}
$$

is the $N \times N$ matrix whose entries are all $1$'s.

This is directly analogous to the centred Gram matrix formula:

$$
\tilde{G}
=
G
-
\frac{1}{N}\mathbf{1}G
-
\frac{1}{N}G\mathbf{1}
+
\frac{1}{N^2}\mathbf{1}G\mathbf{1}.
$$

---

## 32. Kernel PCA via the centred kernel matrix

The Kernel PCA procedure from the slides is as follows.

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d
$$

and a kernel:

$$
\kappa(\cdot,\cdot)
$$

on $\mathbb{R}^d$:

1. Construct the kernel matrix:

   

$$
K.
$$

2. Construct the centred kernel matrix:

   

$$
\tilde{K}.
$$

3. Apply EVD to the centred kernel matrix.

4. This produces eigenvalues:

   

$$
\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_N \geq 0.
$$

5. For a positive integer $k$, choose the top $k$ eigenvalues.

### Slide warning

The slide states:

> The eigenvectors in this case are in $H$, not in data space.

### [UNCLEAR]

The centred kernel matrix $\tilde{K}$ is an $N \times N$ matrix, so its literal eigenvectors are $N$-dimensional coefficient vectors. The corresponding principal directions live in the feature / Hilbert space $H$. The transcript is needed to confirm exactly how the lecturer explained this point.

---

## 33. PCA vs Kernel PCA

The final slide compares ordinary PCA and Kernel PCA.

### PCA

PCA:

- primary goal: reducing dimension,
- components: orthogonal directions in the data space,
- method: EVD of the centred Gram matrix,
- implementation: linear projections.

### Kernel PCA

Kernel PCA:

- primary goal: embedding into a Hilbert space,
- components: orthogonal directions in the embedding space,
- method: EVD of the centred kernel matrix,
- implementation: nonlinear embeddings.

---

# Key concepts glossary

---

## Independent Component Analysis $\mathrm{ICA}$

### Intuition

ICA recovers hidden independent source signals from observed mixed signals.

### Formal slide definition

ICA is a blind source separation technique that decomposes a multivariate signal into additive, statistically independent, non-Gaussian components.

---

## Blind source separation

### Intuition

The original sources are hidden. Only their mixtures are observed.

### Formal setting in this lecture

$$
x = As.
$$

Here $x$ is observed, while $A$ and $s$ must be estimated.

---

## Mixing matrix

The matrix:

$$
A
$$

in:

$$
x=As.
$$

It maps source signals to observed mixed signals.

---

## Unmixing matrix

The matrix:

$$
W
$$

used to estimate sources by:

$$
\hat{s}=Wx.
$$

ICA seeks $W$ such that the components of $\hat{s}$ are statistically independent.

---

## Whitening

A linear change of basis such that:

$$
\mathbb{E}[ss^\top]=I.
$$

In the lecture slides, this corresponds to identity covariance, uncorrelated components, and unit variance components.

---

## Kurtosis

For random variable $X$:

$$
\kappa
=
\mathbb{E}
\left[
\left(
\frac{X-\mu}{\sigma}
\right)^4
\right].
$$

Gaussian variables have:

$$
\kappa=3.
$$

---

## Excess kurtosis

$$
\kappa-3.
$$

Used in the lecture as a measure of non-Gaussianity.

---

## Gram matrix

For data points $x_1,\ldots,x_N$:

$$
G_{jk}=x_j^\top x_k.
$$

Matrix form:

$$
G=XX^\top.
$$

---

## Kernel

A function:

$$
\kappa : \mathcal{X}\times \mathcal{X}\to \mathbb{R}
$$

that is symmetric and positive semi-definite:

$$
\sum_{i=1}^{n}
\sum_{j=1}^{n}
c_i c_j \kappa(x_i,x_j)
\geq 0.
$$

---

## Feature map

A mapping:

$$
\phi:\mathcal{X}\to H
$$

into a Hilbert space. If:

$$
\kappa(x,y)=\langle \phi(x),\phi(y)\rangle_H,
$$

then the kernel computes inner products in the feature space.

---

## Kernel matrix

For data points $x_1,\ldots,x_N$:

$$
K_{ij}=\kappa(x_i,x_j).
$$

It is the kernel analogue of the Gram matrix.

---

## RKHS

A **Reproducing Kernel Hilbert Space** is the Hilbert space $H$ associated with a kernel $\kappa$, where there exists a feature map $\phi$ such that:

$$
\kappa(x,y)=\langle \phi(x),\phi(y)\rangle_H.
$$

The slides state that proving this existence result is highly nontrivial.

---

# Algorithms to know

---

## ICA algorithmic skeleton from the slides

Given observed mixtures:

$$
x_1,\ldots,x_N \in \mathbb{R}^m,
$$

1. Form the data matrix:

   

$$
X \in \mathbb{R}^{N\times m}.
$$

2. Seek an unmixing matrix:

   

$$
W.
$$

3. Estimate sources by:

   

$$
\hat{s}=Wx.
$$

4. Choose $W$ to maximise statistical independence of the components of $\hat{s}$.

5. Under the SVD/eigendecomposition argument in the slides:

   

$$
W=QD^{1/2}V^\top.
$$

6. The remaining task is estimating the orthogonal matrix $V$, called projection pursuit.

---

## Linear PCA via covariance EVD

1. Recentre:

   

$$
x_i\leftarrow x_i-\hat{\mu}.
$$

2. Form centred data matrix $X$.

3. Compute:

   

$$
\Sigma'=X^\top X.
$$

4. Compute eigenpairs:

   

$$
(\lambda_i,v_i).
$$

5. Sort:

   

$$
\lambda_1\geq \cdots \geq \lambda_d\geq 0.
$$

6. Return:

   

$$
v_1,\ldots,v_k.
$$

---

## Linear PCA via SVD

1. Recentre data.
2. Form centred data matrix $X$.
3. Compute:

   

$$
X=USV^\top.
$$

4. Return the first $k$ columns of $V$:

   

$$
v_1,\ldots,v_k.
$$

---

## Linear PCA via centred Gram matrix

1. Construct:

   

$$
G=XX^\top.
$$

2. Centre it:

   

$$
\tilde{G}
   =
   G
   -
   \frac{1}{N}\mathbf{1}G
   -
   \frac{1}{N}G\mathbf{1}
   +
   \frac{1}{N^2}\mathbf{1}G\mathbf{1}.
$$

3. Apply EVD.
4. Choose the top $k$ eigenvalues.
5. Remember: the eigenvectors here are in $\mathbb{R}^N$, not data space.

---

## Kernel PCA via centred kernel matrix

1. Choose a kernel:

   

$$
\kappa(\cdot,\cdot).
$$

2. Construct:

   

$$
K_{ij}=\kappa(x_i,x_j).
$$

3. Centre it:

   

$$
\tilde{K}
   =
   K
   -
   \frac{1}{N}\mathbf{1}K
   -
   \frac{1}{N}K\mathbf{1}
   +
   \frac{1}{N^2}\mathbf{1}K\mathbf{1}.
$$

4. Apply EVD to $\tilde{K}$.
5. Sort eigenvalues:

   

$$
\lambda_1\geq \cdots \geq \lambda_N\geq 0.
$$

6. Choose the top $k$.

---

# Worked examples and exercises

---

## Exercise 1: $X^\top X = \sum_i x_i x_i^\top$

See Section 16.

Key result:

$$
X^\top X
=
\sum_{i=1}^{N}x_i x_i^\top.
$$

---

## Exercise 2: $XX^\top$ is the Gram matrix

See Section 18.

Key result:

$$
(XX^\top)_{jk}=x_j^\top x_k.
$$

Therefore:

$$
XX^\top = G.
$$

---

## Exercise 3: $\kappa(x,y)=(1+x^\top y)^2$ is a kernel

See Section 27.

Key steps:

1. Symmetry follows from:

   

$$
x^\top y = y^\top x.
$$

2. Positive semi-definiteness follows from the feature map representation:

   

$$
\kappa(x,y)=\phi(x)^\top\phi(y).
$$

3. Therefore:

   

$$
\sum_{i,j}c_ic_j\kappa(x_i,x_j)
   =
   \left\|\sum_i c_i\phi(x_i)\right\|^2
   \geq 0.
$$

---

# Exam flags and revision priorities

---

## Explicit exam flags

No explicit “this is on the exam” wording appears in the slides received.

**[UNCLEAR]** The lecture transcript was not provided, so spoken exam hints may be missing.

---

## High-value slide-marked exercises

The slides explicitly mark three pen-and-paper exercises:

1. Show:

   

$$
X^\top X=
   \sum_{i=1}^{N}x_ix_i^\top.
$$

2. Show:

   

$$
XX^\top
$$

   is the Gram matrix with $(j,k)$-entry:

   

$$
x_j^\top x_k.
$$

3. Show:

   

$$
\kappa(x,y)=(1+x^\top y)^2
$$

   is a kernel.

These are not labelled as exam questions in the slides, but they are clearly important lecture exercises and should be prioritised for revision.

---

## Concepts likely worth prioritising

Based on slide emphasis, the following are core revision targets:

- ICA as blind source separation.
- The ICA linear mixing model:

  

$$
x=As.
$$

- The ICA unmixing model:

  

$$
\hat{s}=Wx.
$$

- ICA assumptions:
  - independent sources,
  - non-Gaussian sources,
  - linear mixture,
  - clean/noiseless mixture in the discussed model.

- Kurtosis and excess kurtosis as measures of non-Gaussianity.
- PCA vs ICA comparison.
- Linear PCA via covariance EVD.
- Linear PCA via SVD.
- Gram matrix and centred Gram matrix.
- Feature maps and kernel trick intuition.
- Kernel definition: symmetry and positive semi-definiteness.
- Kernel matrix and centred kernel matrix.
- PCA vs Kernel PCA comparison.

---

# Connections across the lecture

---

## ICA connects to PCA by contrast

Both ICA and PCA transform data, but they optimise different objectives:

- PCA seeks variance-maximising orthogonal directions.
- ICA seeks statistically independent components.

Distributional assumptions also differ:

- PCA can work with Gaussian data.
- ICA requires non-Gaussian source signals.

---

## Kernel PCA connects to linear PCA through the Gram matrix

Linear PCA can be expressed using the Gram matrix:

$$
G=XX^\top.
$$

Kernel PCA replaces the ordinary dot product entries:

$$
x_i^\top x_j
$$

with kernel entries:

$$
\kappa(x_i,x_j).
$$

Thus:

$$
G_{ij}=x_i^\top x_j
$$

becomes:

$$
K_{ij}=\kappa(x_i,x_j).
$$

This is the main analogy between linear PCA via Gram matrices and Kernel PCA via kernel matrices.

---

## Kernel PCA connects to Hilbert spaces

The kernel corresponds to an inner product in some Hilbert space:

$$
\kappa(x,y)=\langle \phi(x),\phi(y)\rangle_H.
$$

Kernel PCA performs PCA-like operations in the embedded space using kernel evaluations rather than explicit coordinates in the feature space.

---

# Unclear or transcript-dependent sections

The following sections need the lecture recording or transcript to resolve fully:

1. **Transcript missing.** These notes are built from the slide deck only.

2. **ICA SVD step.** The slides state:

   

$$
X^\top X = WW^\top,
$$

   but the visible slide content does not justify this equality.

3. **Whitening and centering.** The slide writes:

   

$$
\mathbb{E}[ss^\top]=I
$$

   and describes it as covariance identity. The transcript is needed to confirm whether zero-mean centering was explicitly assumed.

4. **SVD rank assumptions.** The slide describes all singular values as positive. The transcript is needed to check whether full rank was assumed or whether rank-deficient cases were ignored for simplicity.

5. **Kernel PCA eigenvectors.** The slide says eigenvectors are in $H$, but EVD of the $N\times N$ kernel matrix gives $N$-dimensional coefficient vectors. The associated principal directions live in $H$. The transcript is needed for the lecturer’s exact explanation.

6. **$\phi(X)$ notation.** The slide writes:

   

$$
K=\phi(X)\phi(X)^\top.
$$

   The transcript may clarify whether $\phi(X)$ was defined explicitly as the row-wise feature-mapped data matrix.

7. **Slide typos.** The slide deck contains minor typos, including “Prerform ICA” and “Optimisation opbjective.” These are treated as “Perform ICA” and “Optimisation objective.”

---

# Compact formula sheet

## ICA

Source vector:

$$
s=(s_1,\ldots,s_n)^\top \in \mathbb{R}^n.
$$

Mixed vector:

$$
x=(x_1,\ldots,x_m)^\top \in \mathbb{R}^m.
$$

Linear mixing model:

$$
x=As.
$$

Whitened source condition:

$$
\mathbb{E}[ss^\top]=I.
$$

Unmixing model:

$$
\hat{s}=Wx.
$$

SVD of $W$:

$$
W=USV^\top.
$$

Derived form from slides:

$$
W=QD^{1/2}V^\top.
$$

Kurtosis:

$$
\kappa
=
\mathbb{E}
\left[
\left(
\frac{X-\mu}{\sigma}
\right)^4
\right].
$$

Excess kurtosis:

$$
\kappa-3.
$$

Additive noise model:

$$
x=As+\epsilon.
$$

---

## Linear PCA

Data matrix:

$$
X=
\begin{pmatrix}
x_1^\top \\
\vdots \\
x_N^\top
\end{pmatrix}
\in \mathbb{R}^{N\times d}.
$$

Sample mean:

$$
\hat{\mu}=\frac{1}{N}\sum_{i=1}^N x_i.
$$

Sample covariance:

$$
\Sigma=
\frac{1}{N}
\sum_{i=1}^{N}(x_i-\hat{\mu})(x_i-\hat{\mu})^\top.
$$

For centred data:

$$
\Sigma = \frac{1}{N}X^\top X.
$$

SVD:

$$
X=USV^\top.
$$

Singular vector equations:

$$
\sigma u = Xv,
\qquad
\sigma v = X^\top u.
$$

Eigenvector relationships:

$$
X^\top Xv=\sigma^2v,
$$

$$
XX^\top u=\sigma^2u.
$$

Gram matrix:

$$
G=XX^\top.
$$

Centred Gram matrix:

$$
\tilde{G}
=
G
-
\frac{1}{N}\mathbf{1}G
-
\frac{1}{N}G\mathbf{1}
+
\frac{1}{N^2}\mathbf{1}G\mathbf{1}.
$$

---

## Kernel PCA

Feature map example:

$$
\phi(x)
=
\begin{pmatrix}
1 \\
\sqrt{2}x_1 \\
\sqrt{2}x_2 \\
x_1^2 \\
x_2^2 \\
\sqrt{2}x_1x_2
\end{pmatrix}.
$$

Polynomial kernel from the feature map:

$$
\kappa(x,y)=(1+x^\top y)^2.
$$

Kernel symmetry:

$$
\kappa(x,x')=\kappa(x',x).
$$

Kernel PSD condition:

$$
\sum_{i=1}^{n}
\sum_{j=1}^{n}
c_i c_j \kappa(x_i,x_j)
\geq 0.
$$

Kernel as inner product:

$$
\kappa(x,y)=\langle \phi(x),\phi(y)\rangle_H.
$$

Kernel matrix:

$$
K_{ij}=\kappa(x_i,x_j).
$$

Centred kernel matrix:

$$
\tilde{K}
=
K
-
\frac{1}{N}\mathbf{1}K
-
\frac{1}{N}K\mathbf{1}
+
\frac{1}{N^2}\mathbf{1}K\mathbf{1}.
$$

