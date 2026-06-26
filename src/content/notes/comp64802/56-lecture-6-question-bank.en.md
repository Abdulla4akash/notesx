---
subject: COMP64802
chapter: 56
title: "Lecture 6 — Question Bank"
language: en
---

# COMP64802 Lecture 6 — Worked Practice Question Bank

**Topic:** High-dimensional data, dimensionality reduction, representation learning, PCA, covariance/eigenvalue/SVD computation, explained variance, and PCA limitations.

**How to use this bank:** Cover the solution after each question. For procedural questions, copy the step headers first, then fill the computation underneath. The point is to practise the working, not just the final value.

---

## Task types identified from the lecture sheet

The lecture sheet supports the following examinable task types:

1. Recognising high-dimensional data and explaining the curse of dimensionality.
2. Computing how volume grows with dimension, especially for a hypercube of side length 2.
3. Deciding when dimensionality reduction is useful: visualisation, compression/noise reduction, compute/performance.
4. Distinguishing dimensionality reduction from representation learning.
5. Formatting data as a matrix: rows as data points, columns as features.
6. Centring data by subtracting the sample mean.
7. Computing a sample covariance matrix from centred or non-centred data.
8. Finding eigenvalues and eigenvectors from a small matrix.
9. Connecting covariance eigenvectors to principal components.
10. Computing PCA by the covariance-matrix route.
11. Computing PCA by the SVD route.
12. Relating eigenvalues and singular values.
13. Computing projections onto principal components.
14. Reconstructing data from a lower-dimensional PCA representation.
15. Comparing variance maximisation and reconstruction error minimisation.
16. Computing explained variance ratio and cumulative explained variance.
17. Choosing the number of principal components from a variance threshold.
18. Diagnosing when PCA is unsuitable: nonlinear structure, variance not equal to relevance, orthogonality restriction.
19. Handling edge cases: non-centred data, repeated eigenvalues, covariance normalisation, and method interpretation.

---

# Section A — Mechanical / Single-Step Checks

These are the fast drills. They build the muscle memory for notation, shapes, centring, covariance, eigenvalues, SVD, and explained variance.

---

## Q1. Hypercube volume growth

A dataset lives in a $d$-dimensional cube where every coordinate lies in an interval of length 2.

1. Write the formula for the volume.
2. Compute the volume for $d=1,2,3,10$.
3. State what this illustrates about high-dimensional data.

### Solution

**Step 1 — Identify the side length.**

Each dimension has side length:

$$2$$

**Step 2 — Use the $d$-dimensional cube volume formula.**

For a cube/hypercube with side length $s$ in $d$ dimensions:

$$V=s^d$$

Here $s=2$, so:

$$V=2^d$$

**Step 3 — Compute each requested case.**

For $d=1$:

$$2^1=2$$

For $d=2$:

$$2^2=4$$

For $d=3$:

$$2^3=8$$

For $d=10$:

$$2^{10}=1024$$

**Step 4 — Interpret the result.**

The volume grows exponentially in $d$. This is the curse of dimensionality: as the number of features increases, the space becomes huge very quickly, so a fixed number of data points becomes sparse.

**Final answer:**

$$V=2^d,$$

with volumes $2,4,8,1024$ for $d=1,2,3,10$ respectively.

---

## Q2. Data matrix shape

A dataset contains $N=120$ observations. Each observation has $d=45$ features.

1. What is the shape of the data matrix $X$?
2. What does a row represent?
3. What does a column represent?

### Solution

**Step 1 — Recall the lecture convention.**

The lecture writes the data matrix as:

$$X=\begin{pmatrix}x_1^\top\\x_2^\top\\\vdots\\x_N^\top\end{pmatrix}$$

So:

$$X\in\mathbb{R}^{N\times d}$$

**Step 2 — Substitute $N=120$ and $d=45$.**

$$X\in\mathbb{R}^{120\times45}$$

**Step 3 — Interpret rows and columns.**

Each row is one data point / observation.

Each column is one feature / variable / coordinate.

**Final answer:**

$$X\text{ has shape }120\times45.$$

Rows are observations; columns are features.

---

## Q3. Centring one-dimensional data

Given one-dimensional data points:

$$x_1=2,\quad x_2=4,\quad x_3=10,$$

centre the data.

### Solution

**Step 1 — Compute the sample mean.**

$$\hat\mu=\frac{1}{N}\sum_{i=1}^N x_i$$

Here $N=3$, so:

$$\hat\mu=\frac{2+4+10}{3}=\frac{16}{3}$$

**Step 2 — Subtract the mean from each point.**

$$\tilde{x}_i=x_i-\hat\mu$$

So:

$$\tilde{x}_1=2-\frac{16}{3}=\frac{6-16}{3}=-\frac{10}{3}$$

$$\tilde{x}_2=4-\frac{16}{3}=\frac{12-16}{3}=-\frac{4}{3}$$

$$\tilde{x}_3=10-\frac{16}{3}=\frac{30-16}{3}=\frac{14}{3}$$

**Step 3 — Check the centred data has mean zero.**

$$-\frac{10}{3}-\frac{4}{3}+\frac{14}{3}=0$$

**Final answer:**

The centred data are:

$$-\frac{10}{3},\quad -\frac{4}{3},\quad \frac{14}{3}.$$

---

## Q4. Centring two-dimensional data

Given data points:

$$x_1=(1,2),\quad x_2=(3,4),\quad x_3=(5,6),$$

compute the centred data points.

### Solution

**Step 1 — Compute the sample mean vector.**

$$\hat\mu=\frac{1}{3}(x_1+x_2+x_3)$$

Coordinatewise:

$$\hat\mu=\left(\frac{1+3+5}{3},\frac{2+4+6}{3}\right)=(3,4)$$

**Step 2 — Subtract the mean from each point.**

$$\tilde{x}_1=(1,2)-(3,4)=(-2,-2)$$

$$\tilde{x}_2=(3,4)-(3,4)=(0,0)$$

$$\tilde{x}_3=(5,6)-(3,4)=(2,2)$$

**Step 3 — Check the centred mean.**

$$\frac{1}{3}\left[(-2,-2)+(0,0)+(2,2)\right]=(0,0)$$

**Final answer:**

$$\tilde{x}_1=(-2,-2),\quad \tilde{x}_2=(0,0),\quad \tilde{x}_3=(2,2).$$

---

## Q5. One covariance entry

For non-centred data points $x_i\in\mathbb{R}^2$, suppose:

$$x_1=(1,4),\quad x_2=(3,8),\quad x_3=(5,12).$$

Compute the covariance entry $\Sigma_{1,2}$ using the lecture convention with $1/N$.

### Solution

**Step 1 — Compute the mean of each feature.**

Feature 1 mean:

$$\hat\mu_1=\frac{1+3+5}{3}=3$$

Feature 2 mean:

$$\hat\mu_2=\frac{4+8+12}{3}=8$$

**Step 2 — Recall the covariance-entry formula.**

$$\Sigma_{j,k}=\frac{1}{N}\sum_{i=1}^N(x_{i,j}-\hat\mu_j)(x_{i,k}-\hat\mu_k)$$

For $\Sigma_{1,2}$:

$$\Sigma_{1,2}=\frac{1}{3}\sum_{i=1}^3(x_{i,1}-3)(x_{i,2}-8)$$

**Step 3 — Compute each product.**

For $x_1=(1,4)$:

$$(1-3)(4-8)=(-2)(-4)=8$$

For $x_2=(3,8)$:

$$(3-3)(8-8)=0$$

For $x_3=(5,12)$:

$$(5-3)(12-8)=(2)(4)=8$$

**Step 4 — Average.**

$$\Sigma_{1,2}=\frac{8+0+8}{3}=\frac{16}{3}$$

**Final answer:**

$$\Sigma_{1,2}=\frac{16}{3}.$$

---

## Q6. Check whether a vector is an eigenvector

Let:

$$A=\begin{pmatrix}2&0\\0&5\end{pmatrix},\qquad v=\begin{pmatrix}0\\1\end{pmatrix}.$$

Is $v$ an eigenvector of $A$? If yes, what is the eigenvalue?

### Solution

**Step 1 — Recall the eigenvector test.**

A non-zero vector $v$ is an eigenvector of $A$ if:

$$Av=\lambda v$$

for some scalar $\lambda$.

**Step 2 — Multiply $A$ by $v$.**

$$Av=\begin{pmatrix}2&0\\0&5\end{pmatrix}\begin{pmatrix}0\\1\end{pmatrix}=\begin{pmatrix}0\\5\end{pmatrix}$$

**Step 3 — Compare with $v$.**

$$\begin{pmatrix}0\\5\end{pmatrix}=5\begin{pmatrix}0\\1\end{pmatrix}$$

So $Av=5v$.

**Final answer:**

Yes. $v$ is an eigenvector with eigenvalue:

$$\lambda=5.$$

---

## Q7. Singular values from eigenvalues

Suppose the eigenvalues of $X^\top X$ are:

$$81,\quad 25,\quad 4.$$

Find the singular values of $X$.

### Solution

**Step 1 — Recall the lecture relation.**

Singular values are the square roots of the eigenvalues of $X^\top X$:

$$\sigma_i=\sqrt{\lambda_i}$$

**Step 2 — Take square roots.**

$$\sqrt{81}=9$$

$$\sqrt{25}=5$$

$$\sqrt{4}=2$$

**Final answer:**

The singular values are:

$$9,\quad5,\quad2.$$

---

## Q8. Explained variance ratio for one component

A PCA decomposition has eigenvalues:

$$\lambda_1=12,\quad \lambda_2=6,\quad \lambda_3=2.$$

Compute the explained variance ratio of the first principal component.

### Solution

**Step 1 — Compute total variance.**

$$\lambda_1+\lambda_2+\lambda_3=12+6+2=20$$

**Step 2 — Use the explained variance ratio formula.**

$$\mathrm{EVR}_1=\frac{\lambda_1}{\lambda_1+\lambda_2+\lambda_3}$$

**Step 3 — Substitute.**

$$\mathrm{EVR}_1=\frac{12}{20}=0.6$$

**Step 4 — Convert to percentage if desired.**

$$0.6\times100=60\%$$

**Final answer:**

The first principal component explains:

$$60\%$$

of the total variance.

---

# Section B — Multi-Condition Checks

These questions force you to combine several lecture ideas: centring plus covariance, variance plus reconstruction, eigenvalues plus component order, and SVD plus normalisation.

---

## Q9. Dimensionality reduction or representation learning?

For each method or idea below, classify it as:

- dimensionality reduction specifically,
- representation learning more broadly,
- or both.

Items:

1. PCA maps $d$ features to $k$ features, where $k\ll d$.
2. An autoencoder learns useful hidden features for reconstruction.
3. A Transformer learns contextual token embeddings.
4. t-SNE maps high-dimensional data to 2D for visualisation.

### Solution

**Step 1 — Recall the discriminator.**

Dimensionality reduction reduces the number of input variables while retaining essential information.

Representation learning automatically discovers useful representations/features for a task.

Dimensionality reduction is inside representation learning:

$$\text{Dimensionality reduction}\subset\text{Representation learning}$$

**Step 2 — Classify PCA.**

PCA reduces $d$ features to $k$ features.

So PCA is dimensionality reduction.

It also learns a new representation using principal-component coordinates.

So PCA is both.

**Step 3 — Classify autoencoders.**

An autoencoder learns hidden representations. It may reduce dimension if the bottleneck is smaller than the input, but the key lecture category is representation learning.

So it is representation learning; it can also be dimensionality reduction when the hidden code has lower dimension.

**Step 4 — Classify Transformers.**

Transformers learn representations, but they are not primarily listed as dimensionality-reduction algorithms.

So they are representation learning broadly.

**Step 5 — Classify t-SNE.**

t-SNE maps high-dimensional data into a lower-dimensional space, often 2D.

So it is dimensionality reduction. It also fits inside the broader representation-learning family.

**Final answer:**

1. PCA: both dimensionality reduction and representation learning.
2. Autoencoder: representation learning; dimensionality reduction if it uses a lower-dimensional bottleneck.
3. Transformer: representation learning.
4. t-SNE: dimensionality reduction and, broadly, representation learning.

---

## Q10. Centre the data, then form the data matrix

Given:

$$x_1=(2,1),\quad x_2=(4,1),\quad x_3=(6,1),$$

1. Compute the centred data.
2. Write the centred data matrix $X$.
3. State its shape.

### Solution

**Step 1 — Compute the sample mean.**

$$\hat\mu=\frac{1}{3}\left[(2,1)+(4,1)+(6,1)\right]$$

$$\hat\mu=\left(\frac{12}{3},\frac{3}{3}\right)=(4,1)$$

**Step 2 — Subtract the mean from each point.**

$$\tilde{x}_1=(2,1)-(4,1)=(-2,0)$$

$$\tilde{x}_2=(4,1)-(4,1)=(0,0)$$

$$\tilde{x}_3=(6,1)-(4,1)=(2,0)$$

**Step 3 — Stack centred points as rows.**

$$X=\begin{pmatrix}\tilde{x}_1^\top\\\tilde{x}_2^\top\\\tilde{x}_3^\top\end{pmatrix}$$

So:

$$X=\begin{pmatrix}-2&0\\0&0\\2&0\end{pmatrix}$$

**Step 4 — State the shape.**

There are $N=3$ rows and $d=2$ columns.

$$X\in\mathbb{R}^{3\times2}$$

**Final answer:**

Centred points:

$$(-2,0),(0,0),(2,0).$$

Centred matrix:

$$X=\begin{pmatrix}-2&0\\0&0\\2&0\end{pmatrix},\qquad X\in\mathbb{R}^{3\times2}.$$

---

## Q11. Compute covariance from centred data

Using the centred data matrix:

$$X=\begin{pmatrix}-2&0\\0&0\\2&0\end{pmatrix},$$

compute the sample covariance matrix using:

$$\Sigma=\frac{1}{N}X^\top X.$$

### Solution

**Step 1 — Identify $N$.**

There are 3 data points, so:

$$N=3$$

**Step 2 — Compute $X^\top X$.**

$$X^\top=\begin{pmatrix}-2&0&2\\0&0&0\end{pmatrix}$$

Then:

$$X^\top X=\begin{pmatrix}-2&0&2\\0&0&0\end{pmatrix}\begin{pmatrix}-2&0\\0&0\\2&0\end{pmatrix}$$

Compute each entry:

$$X^\top X=\begin{pmatrix}(-2)^2+0^2+2^2&(-2)(0)+0(0)+2(0)\\0(-2)+0(0)+0(2)&0^2+0^2+0^2\end{pmatrix}$$

$$X^\top X=\begin{pmatrix}8&0\\0&0\end{pmatrix}$$

**Step 3 — Divide by $N$.**

$$\Sigma=\frac{1}{3}\begin{pmatrix}8&0\\0&0\end{pmatrix}=\begin{pmatrix}8/3&0\\0&0\end{pmatrix}$$

**Final answer:**

$$\Sigma=\begin{pmatrix}8/3&0\\0&0\end{pmatrix}.$$

---

## Q12. Identify the first principal component from a covariance matrix

Suppose a centred dataset has covariance matrix:

$$\Sigma=\begin{pmatrix}8/3&0\\0&0\end{pmatrix}.$$

Find the first principal component.

### Solution

**Step 1 — Recall the PCA-covariance rule.**

Principal components are eigenvectors of the covariance matrix, ordered from largest eigenvalue to smallest eigenvalue.

**Step 2 — Read the eigenvalues of the diagonal matrix.**

For:

$$\Sigma=\begin{pmatrix}8/3&0\\0&0\end{pmatrix},$$

the eigenvalues are:

$$\lambda_1=8/3,\qquad \lambda_2=0$$

**Step 3 — Match eigenvectors.**

The eigenvector for $\lambda_1=8/3$ is the first coordinate direction:

$$v_1=\begin{pmatrix}1\\0\end{pmatrix}$$

The eigenvector for $\lambda_2=0$ is:

$$v_2=\begin{pmatrix}0\\1\end{pmatrix}$$

**Step 4 — Select the largest eigenvalue direction.**

The largest eigenvalue is $8/3$, so the first principal component is:

$$v_1=\begin{pmatrix}1\\0\end{pmatrix}$$

**Final answer:**

$$\boxed{v_1=(1,0)^\top}$$

up to sign, since $(-1,0)^\top$ spans the same PCA direction.

---

## Q13. Projection and reconstruction onto one component

Let:

$$x=\begin{pmatrix}3\\4\end{pmatrix},\qquad v=\begin{pmatrix}1\\0\end{pmatrix}.$$

Assume $v$ is a unit principal component.

1. Compute the scalar projection $v^\top x$.
2. Compute the reconstruction $(v^\top x)v$.
3. Compute the residual $x-(v^\top x)v$.
4. Compute the squared reconstruction error.

### Solution

**Step 1 — Check the unit-vector assumption.**

$$\|v\|=\sqrt{1^2+0^2}=1$$

So we can use the lecture reconstruction formula directly.

**Step 2 — Compute the scalar projection.**

$$v^\top x=\begin{pmatrix}1&0\end{pmatrix}\begin{pmatrix}3\\4\end{pmatrix}=3$$

**Step 3 — Compute the reconstruction.**

$$(v^\top x)v=3\begin{pmatrix}1\\0\end{pmatrix}=\begin{pmatrix}3\\0\end{pmatrix}$$

**Step 4 — Compute the residual.**

$$x-(v^\top x)v=\begin{pmatrix}3\\4\end{pmatrix}-\begin{pmatrix}3\\0\end{pmatrix}=\begin{pmatrix}0\\4\end{pmatrix}$$

**Step 5 — Compute squared reconstruction error.**

$$\left\|\begin{pmatrix}0\\4\end{pmatrix}\right\|^2=0^2+4^2=16$$

**Final answer:**

Scalar projection: $3$.

Reconstruction: $(3,0)^\top$.

Residual: $(0,4)^\top$.

Squared reconstruction error: $16$.

---

## Q14. Choose $k$ from cumulative explained variance

A PCA model has eigenvalues:

$$\lambda_1=40,\quad \lambda_2=30,\quad \lambda_3=20,\quad \lambda_4=10.$$

Choose the smallest $k$ that explains at least $85\%$ of the total variance.

### Solution

**Step 1 — Compute total variance.**

$$40+30+20+10=100$$

**Step 2 — Compute cumulative variance for $k=1$.**

$$\frac{40}{100}=0.40=40\%$$

This is below $85\%$.

**Step 3 — Compute cumulative variance for $k=2$.**

$$\frac{40+30}{100}=\frac{70}{100}=70\%$$

This is below $85\%$.

**Step 4 — Compute cumulative variance for $k=3$.**

$$\frac{40+30+20}{100}=\frac{90}{100}=90\%$$

This reaches at least $85\%$.

**Step 5 — Choose the smallest valid $k$.**

The smallest $k$ that reaches the threshold is:

$$k=3$$

**Final answer:**

Choose:

$$\boxed{k=3}$$

because the first three components explain $90\%$ of the variance.

---

# Section C — Building PCA Objects from Scratch

These questions ask you to run a fuller PCA workflow: data matrix, centring, covariance, eigenvectors, projections, reconstruction, and explained variance.

---

## Q15. Full mini-PCA from raw data

Given four two-dimensional data points:

$$x_1=(2,0),\quad x_2=(-2,0),\quad x_3=(0,1),\quad x_4=(0,-1),$$

1. Compute the sample mean.
2. Form the centred data matrix.
3. Compute the covariance matrix using $\Sigma=\frac{1}{N}X^\top X$.
4. Find the first principal component.
5. Compute the cumulative explained variance for $k=1$.

### Solution

**Step 1 — Compute the sample mean.**

$$\hat\mu=\frac{1}{4}\left[(2,0)+(-2,0)+(0,1)+(0,-1)\right]$$

$$\hat\mu=\frac{1}{4}(0,0)=(0,0)$$

The data are already centred.

**Step 2 — Form the centred data matrix.**

Stack the points as rows:

$$X=\begin{pmatrix}2&0\\-2&0\\0&1\\0&-1\end{pmatrix}$$

**Step 3 — Compute $X^\top X$.**

$$X^\top=\begin{pmatrix}2&-2&0&0\\0&0&1&-1\end{pmatrix}$$

$$X^\top X=\begin{pmatrix}2&-2&0&0\\0&0&1&-1\end{pmatrix}\begin{pmatrix}2&0\\-2&0\\0&1\\0&-1\end{pmatrix}$$

Compute entries:

First diagonal entry:

$$2^2+(-2)^2+0^2+0^2=8$$

Second diagonal entry:

$$0^2+0^2+1^2+(-1)^2=2$$

Off-diagonal entries:

$$2(0)+(-2)(0)+0(1)+0(-1)=0$$

So:

$$X^\top X=\begin{pmatrix}8&0\\0&2\end{pmatrix}$$

**Step 4 — Divide by $N=4$.**

$$\Sigma=\frac{1}{4}\begin{pmatrix}8&0\\0&2\end{pmatrix}=\begin{pmatrix}2&0\\0&1/2\end{pmatrix}$$

**Step 5 — Find eigenvalues and eigenvectors.**

Since $\Sigma$ is diagonal, the eigenvalues are:

$$\lambda_1=2,\qquad \lambda_2=1/2$$

The corresponding eigenvectors are:

$$v_1=\begin{pmatrix}1\\0\end{pmatrix},\qquad v_2=\begin{pmatrix}0\\1\end{pmatrix}$$

Because $2>1/2$, the first principal component is:

$$v_1=(1,0)^\top$$

**Step 6 — Compute cumulative explained variance for $k=1$.**

Total variance:

$$2+\frac{1}{2}=\frac{5}{2}$$

Variance explained by first PC:

$$2$$

Cumulative explained variance:

$$\frac{2}{5/2}=\frac{4}{5}=0.8=80\%$$

**Final answer:**

$$\hat\mu=(0,0),$$

$$X=\begin{pmatrix}2&0\\-2&0\\0&1\\0&-1\end{pmatrix},$$

$$\Sigma=\begin{pmatrix}2&0\\0&1/2\end{pmatrix},$$

$$v_1=(1,0)^\top,$$

and the first principal component explains $80\%$ of the variance.

---

## Q16. Project and reconstruct every point using the first PC

Use the same data and first principal component from Q15:

$$x_1=(2,0),\quad x_2=(-2,0),\quad x_3=(0,1),\quad x_4=(0,-1),$$

with:

$$v_1=(1,0)^\top.$$

For each point:

1. Compute the scalar projection $v_1^\top x_i$.
2. Compute the reconstruction $(v_1^\top x_i)v_1$.
3. Compute the squared reconstruction error.

### Solution

**Step 1 — Recall the projection/reconstruction formulas.**

Scalar projection:

$$z_i=v_1^\top x_i$$

Reconstruction:

$$\hat{x}_i=(v_1^\top x_i)v_1$$

Squared error:

$$\|x_i-\hat{x}_i\|^2$$

**Step 2 — Compute for $x_1=(2,0)$.**

$$z_1=(1,0)\cdot(2,0)=2$$

$$\hat{x}_1=2(1,0)=(2,0)$$

$$x_1-\hat{x}_1=(0,0)$$

$$\|x_1-\hat{x}_1\|^2=0$$

**Step 3 — Compute for $x_2=(-2,0)$.**

$$z_2=(1,0)\cdot(-2,0)=-2$$

$$\hat{x}_2=-2(1,0)=(-2,0)$$

$$x_2-\hat{x}_2=(0,0)$$

$$\|x_2-\hat{x}_2\|^2=0$$

**Step 4 — Compute for $x_3=(0,1)$.**

$$z_3=(1,0)\cdot(0,1)=0$$

$$\hat{x}_3=0(1,0)=(0,0)$$

$$x_3-\hat{x}_3=(0,1)$$

$$\|x_3-\hat{x}_3\|^2=1$$

**Step 5 — Compute for $x_4=(0,-1)$.**

$$z_4=(1,0)\cdot(0,-1)=0$$

$$\hat{x}_4=0(1,0)=(0,0)$$

$$x_4-\hat{x}_4=(0,-1)$$

$$\|x_4-\hat{x}_4\|^2=1$$

**Step 6 — Compute average squared reconstruction error.**

$$\frac{0+0+1+1}{4}=\frac{1}{2}$$

**Final answer:**

| Point | Projection $z_i$ | Reconstruction $\hat{x}_i$ | Squared error |
|---|---:|---|---:|
| $(2,0)$ | $2$ | $(2,0)$ | $0$ |
| $(-2,0)$ | $-2$ | $(-2,0)$ | $0$ |
| $(0,1)$ | $0$ | $(0,0)$ | $1$ |
| $(0,-1)$ | $0$ | $(0,0)$ | $1$ |

Average squared reconstruction error:

$$\frac{1}{2}.$$

---

## Q17. Reuse the lecture eigenvalue example

The lecture sheet uses:

$$A=\begin{pmatrix}4&1\\2&3\end{pmatrix}.$$

Find:

1. the eigenvalues;
2. an eigenvector for the largest eigenvalue.

### Solution

**Step 1 — Write the characteristic polynomial.**

The characteristic polynomial is:

$$p_A(\lambda)=\det(\lambda I-A)$$

Compute:

$$\lambda I-A=\begin{pmatrix}\lambda-4&-1\\-2&\lambda-3\end{pmatrix}$$

So:

$$p_A(\lambda)=\det\begin{pmatrix}\lambda-4&-1\\-2&\lambda-3\end{pmatrix}$$

**Step 2 — Compute the determinant.**

$$p_A(\lambda)=(\lambda-4)(\lambda-3)-(-1)(-2)$$

$$p_A(\lambda)=(\lambda-4)(\lambda-3)-2$$

$$p_A(\lambda)=\lambda^2-7\lambda+12-2$$

$$p_A(\lambda)=\lambda^2-7\lambda+10$$

**Step 3 — Solve for roots.**

$$\lambda^2-7\lambda+10=(\lambda-5)(\lambda-2)$$

So:

$$\lambda=5,\quad \lambda=2$$

The largest eigenvalue is:

$$\lambda_{\max}=5$$

**Step 4 — Solve for an eigenvector for $\lambda=5$.**

Solve:

$$(A-5I)v=0$$

$$A-5I=\begin{pmatrix}4&1\\2&3\end{pmatrix}-\begin{pmatrix}5&0\\0&5\end{pmatrix}=\begin{pmatrix}-1&1\\2&-2\end{pmatrix}$$

Let:

$$v=\begin{pmatrix}a\\b\end{pmatrix}$$

Then the first row gives:

$$-a+b=0$$

So:

$$b=a$$

Choose $a=1$, so $b=1$.

Thus:

$$v=\begin{pmatrix}1\\1\end{pmatrix}$$

**Step 5 — Check.**

$$A\begin{pmatrix}1\\1\end{pmatrix}=\begin{pmatrix}5\\5\end{pmatrix}=5\begin{pmatrix}1\\1\end{pmatrix}$$

**Final answer:**

Eigenvalues:

$$5,\quad2.$$

An eigenvector for the largest eigenvalue is:

$$\begin{pmatrix}1\\1\end{pmatrix}.$$

---

## Q18. Reuse the lecture explained-variance example

The lecture gives eigenvalues:

$$\lambda_1=50,\quad \lambda_2=20,\quad \lambda_3=10.$$

What percentage of the total variance is explained by the first two principal components?

### Solution

**Step 1 — Compute total variance.**

$$\lambda_1+\lambda_2+\lambda_3=50+20+10=80$$

**Step 2 — Compute variance explained by the first two components.**

$$\lambda_1+\lambda_2=50+20=70$$

**Step 3 — Divide by total variance.**

$$\frac{70}{80}=0.875$$

**Step 4 — Convert to percentage.**

$$0.875\times100=87.5\%$$

**Final answer:**

The first two principal components explain:

$$\boxed{87.5\%}$$

of the total variance.

---

## Q19. Use SVD output to identify principal components

A centred data matrix $X$ has SVD:

$$X=USV^\top,$$

where:

$$V=\begin{pmatrix}0&1\\1&0\end{pmatrix},\qquad S=\begin{pmatrix}6&0\\0&2\end{pmatrix}.$$

1. What are the singular values?
2. What are the principal components?
3. Which component is first?
4. What are the eigenvalues of $X^\top X$?

### Solution

**Step 1 — Read singular values from $S$.**

The diagonal entries of $S$ are the singular values:

$$\sigma_1=6,\qquad \sigma_2=2$$

**Step 2 — Recall the SVD-PCA rule.**

For centred data, the columns of $V$ are the principal components.

**Step 3 — Extract the columns of $V$.**

$$V=\begin{pmatrix}0&1\\1&0\end{pmatrix}$$

First column:

$$v_1=\begin{pmatrix}0\\1\end{pmatrix}$$

Second column:

$$v_2=\begin{pmatrix}1\\0\end{pmatrix}$$

**Step 4 — Match order using singular values.**

Because $6>2$, the first principal component is the first column of $V$:

$$v_1=(0,1)^\top$$

**Step 5 — Compute eigenvalues of $X^\top X$.**

The lecture relation is:

$$\lambda_i=\sigma_i^2$$

So:

$$\lambda_1=6^2=36$$

$$\lambda_2=2^2=4$$

**Final answer:**

Singular values:

$$6,2.$$

Principal components:

$$v_1=(0,1)^\top,\qquad v_2=(1,0)^\top.$$

Eigenvalues of $X^\top X$:

$$36,4.$$

---

## Q20. Running example: 65 people and 53 blood/urine measurements

The lecture uses a dataset with 65 people and 53 blood/urine features.

You want a 2D visualisation using PCA.

1. What is the shape of the data matrix?
2. What should be centred?
3. What is the target number of components?
4. What are the dimensions of the projected representation?
5. What question should explained variance answer after projection?

### Solution

**Step 1 — Identify rows and columns.**

Rows are people.

Columns are measurements/features.

So:

$$N=65,\qquad d=53$$

**Step 2 — Write the data matrix shape.**

$$X\in\mathbb{R}^{65\times53}$$

**Step 3 — Centre the features.**

Compute the sample mean vector across the 65 people:

$$\hat\mu=\frac{1}{65}\sum_{i=1}^{65}x_i$$

Then subtract it from each row:

$$\tilde{x}_i=x_i-\hat\mu$$

This centres each feature column around zero.

**Step 4 — Choose target dimension for 2D visualisation.**

For 2D plotting:

$$k=2$$

**Step 5 — State projected representation shape.**

Each of the 65 people is represented by 2 PCA coordinates.

So the projected data has shape:

$$65\times2$$

**Step 6 — State the explained-variance question.**

After projection, ask:

How much of the original variance is captured by the first two principal components?

This is measured by:

$$\frac{\lambda_1+\lambda_2}{\lambda_1+\cdots+\lambda_{53}}$$

**Final answer:**

Original matrix:

$$65\times53.$$

After 2D PCA:

$$65\times2.$$

The key diagnostic is the cumulative explained variance of the first two principal components.

---

# Section D — Hard Edge Cases: Where Methods Disagree, Become Ambiguous, or Break Down

These are the highest-value checks. They test whether you understand the conditions behind the formulas, not just the formulas themselves.

---

## Q21. Covariance normalisation ambiguity: $X^\top X$ versus $\frac{1}{N}X^\top X$

A centred dataset has:

$$X^\top X=\begin{pmatrix}20&0\\0&5\end{pmatrix},\qquad N=5.$$

1. Compute the eigenvalues of $X^\top X$.
2. Compute the eigenvalues of the sample covariance matrix $\Sigma=\frac{1}{N}X^\top X$.
3. Do the principal components change?
4. Explain the ambiguity.

### Solution

**Step 1 — Read eigenvalues of $X^\top X$.**

Since the matrix is diagonal:

$$X^\top X=\begin{pmatrix}20&0\\0&5\end{pmatrix}$$

has eigenvalues:

$$20,\quad5$$

with eigenvectors:

$$e_1=(1,0)^\top,\qquad e_2=(0,1)^\top$$

**Step 2 — Compute the covariance matrix.**

$$\Sigma=\frac{1}{5}X^\top X=\frac{1}{5}\begin{pmatrix}20&0\\0&5\end{pmatrix}$$

$$\Sigma=\begin{pmatrix}4&0\\0&1\end{pmatrix}$$

**Step 3 — Read covariance eigenvalues.**

The eigenvalues of $\Sigma$ are:

$$4,\quad1$$

**Step 4 — Compare eigenvectors.**

Multiplying a matrix by a positive scalar changes eigenvalues but not eigenvectors.

So $X^\top X$ and $\frac{1}{N}X^\top X$ have the same principal component directions.

**Step 5 — Explain the ambiguity.**

The lecture defines covariance as:

$$\Sigma=\frac{1}{N}X^\top X$$

but also presents an algorithm using:

$$X^\top X$$

These give the same PCs but different numerical eigenvalues by a factor of $N$.

**Final answer:**

Eigenvalues of $X^\top X$: $20,5$.

Eigenvalues of $\Sigma$: $4,1$.

Principal components do not change; only the eigenvalue scale changes.

---

## Q22. SVD eigenvalue ambiguity under covariance scaling

A centred data matrix $X$ has singular values:

$$\sigma_1=10,\qquad \sigma_2=4,$$

and $N=20$ data points.

1. What are the eigenvalues of $X^\top X$?
2. What are the eigenvalues of $\Sigma=\frac{1}{N}X^\top X$?
3. Which eigenvalues should be used for explained variance if the lecture question says covariance eigenvalues?

### Solution

**Step 1 — Use the SVD relation for $X^\top X$.**

The lecture states:

$$\lambda_i=\sigma_i^2$$

This is exact for eigenvalues of $X^\top X$.

So:

$$10^2=100$$

$$4^2=16$$

Eigenvalues of $X^\top X$ are:

$$100,16$$

**Step 2 — Convert to covariance eigenvalues.**

If:

$$\Sigma=\frac{1}{N}X^\top X,$$

then covariance eigenvalues are scaled by $1/N$.

Here $N=20$:

$$\frac{100}{20}=5$$

$$\frac{16}{20}=0.8$$

**Step 3 — Decide what to use for explained variance.**

If the question says covariance eigenvalues, use:

$$5,0.8$$

If the question uses eigenvalues of $X^\top X$, use:

$$100,16$$

The explained variance ratios are the same because both numerator and denominator are scaled by the same constant.

**Step 4 — Verify ratio invariance.**

Using $X^\top X$ eigenvalues:

$$\frac{100}{100+16}=\frac{100}{116}$$

Using covariance eigenvalues:

$$\frac{5}{5+0.8}=\frac{5}{5.8}=\frac{50}{58}=\frac{100}{116}$$

Same ratio.

**Final answer:**

Eigenvalues of $X^\top X$: $100,16$.

Eigenvalues of $\Sigma$: $5,0.8$.

For covariance eigenvalues, use $5,0.8$; the explained variance ratios are unchanged by the scaling.

---

## Q23. PCA on non-centred data: what goes wrong?

A dataset has points concentrated around $(100,100)$ but varies mostly along the direction $(1,-1)$.

A student applies PCA without subtracting the sample mean and claims the first PC reveals the main variation direction.

Explain the problem and give the correct procedure.

### Solution

**Step 1 — Recall what PCA assumes in the lecture.**

PCA is applied to centred data. The sample mean becomes the origin of the PCA coordinate system.

The lecture centring step is:

$$\tilde{x}_i=x_i-\hat\mu$$

**Step 2 — Identify the issue.**

If the data are concentrated around $(100,100)$, the location of the cloud is far from the origin.

Without centring, directions can be influenced by the offset from the origin rather than the spread around the cloud's centre.

**Step 3 — State the correct procedure.**

Compute:

$$\hat\mu=\frac{1}{N}\sum_{i=1}^N x_i$$

Then form:

$$\tilde{x}_i=x_i-\hat\mu$$

Then apply PCA to the centred data.

**Step 4 — Interpret the expected result.**

After centring, PCA should identify the dominant variation direction around the cloud. In this question, that direction is described as roughly:

$$(1,-1)$$

not the direction from the origin to $(100,100)$.

**Final answer:**

The student's method is flawed because the data were not centred. Correct PCA first subtracts the sample mean and then finds principal components of the centred data.

---

## Q24. When variance maximisation and reconstruction error agree

For centred data and a unit vector $v$, the one-dimensional reconstruction is:

$$(v^\top x_i)v.$$

Show why minimising average squared reconstruction error is equivalent to maximising projected variance.

### Solution

**Step 1 — Write the reconstruction error for one point.**

For one data point:

$$\left\|x_i-(v^\top x_i)v\right\|^2$$

**Step 2 — Expand the squared norm.**

$$\left(x_i-(v^\top x_i)v\right)^\top\left(x_i-(v^\top x_i)v\right)$$

Expand:

$$=x_i^\top x_i-2(v^\top x_i)(x_i^\top v)+(v^\top x_i)^2(v^\top v)$$

**Step 3 — Use symmetry and unit length.**

Because:

$$x_i^\top v=v^\top x_i$$

and:

$$\|v\|=1\Rightarrow v^\top v=1,$$

we get:

$$=\|x_i\|^2-2(v^\top x_i)^2+(v^\top x_i)^2$$

$$=\|x_i\|^2-(v^\top x_i)^2$$

**Step 4 — Average over all points.**

$$\frac{1}{N}\sum_{i=1}^N\left\|x_i-(v^\top x_i)v\right\|^2$$

$$=\frac{1}{N}\sum_{i=1}^N\|x_i\|^2-\frac{1}{N}\sum_{i=1}^N(v^\top x_i)^2$$

**Step 5 — Identify the constant term.**

The first term:

$$\frac{1}{N}\sum_{i=1}^N\|x_i\|^2$$

does not depend on $v$.

So minimising reconstruction error means maximising:

$$\frac{1}{N}\sum_{i=1}^N(v^\top x_i)^2$$

which is the projected variance objective for centred data.

**Final answer:**

For centred data and unit $v$:

$$\text{minimise reconstruction error}\iff\text{maximise projected variance}.$$

---

## Q25. Repeated eigenvalues: when the first PC is not unique

Suppose the covariance matrix is:

$$\Sigma=\begin{pmatrix}3&0\\0&3\end{pmatrix}.$$

1. What are the eigenvalues?
2. Is there a unique first principal component?
3. What does this mean geometrically?

### Solution

**Step 1 — Read eigenvalues.**

The matrix is diagonal:

$$\Sigma=\begin{pmatrix}3&0\\0&3\end{pmatrix}$$

So the eigenvalues are:

$$\lambda_1=3,\qquad \lambda_2=3$$

**Step 2 — Compare eigenvalues.**

The two eigenvalues are equal.

There is no strictly larger eigenvalue.

**Step 3 — Determine uniqueness.**

Because every direction in the two-dimensional space has the same variance, there is no unique first principal component.

Any unit vector can serve as a first principal direction, provided the second direction is chosen orthogonally.

**Step 4 — Interpret geometrically.**

The data have equal variance in all directions. The covariance is isotropic/circular in 2D.

There is no single elongated direction for PCA to discover.

**Final answer:**

The eigenvalues are $3$ and $3$. The first principal component is not unique. Geometrically, the data have no preferred variance direction.

---

## Q26. PCA can fail on nonlinear manifolds

A dataset forms a curved two-moons shape in $\mathbb{R}^2$.

A student says: “PCA should reduce this well because the data are only two-dimensional.”

Explain why this reasoning is wrong.

### Solution

**Step 1 — Recall PCA's structural assumption.**

PCA assumes the important structure lies near a lower-dimensional **linear** subspace.

That means PCA looks for flat directions/axes.

**Step 2 — Identify the structure in the question.**

A two-moons dataset has curved, nonlinear structure.

The important geometry is not captured by one flat line.

**Step 3 — Explain the failure mode.**

A one-dimensional PCA projection can preserve the direction of largest linear variance, but it may collapse points that are far apart along the curved manifold or mix the two moons.

So high projected variance does not guarantee preservation of nonlinear structure.

**Step 4 — Connect to lecture alternatives.**

The lecture lists nonlinear dimensionality-reduction methods such as Kernel PCA, t-SNE, UMAP, ISOMAP, LLE, and MDS.

These are motivated partly because PCA is only linear.

**Final answer:**

The reasoning is wrong because PCA finds linear subspaces, while two moons have nonlinear manifold structure. The dataset being only 2D does not mean a linear PCA projection captures its essential geometry.

---

## Q27. Variance does not necessarily equal relevance

A two-feature dataset has:

- feature 1: very high variance but unrelated to the class label;
- feature 2: low variance but strongly separates the classes.

PCA selects feature-1 direction as the first component.

Is PCA doing something wrong? Should the first PC be assumed to be the most useful feature for classification?

### Solution

**Step 1 — Recall PCA's optimisation target.**

PCA chooses directions of maximum variance.

It does not use class labels.

**Step 2 — Apply this to the question.**

Feature 1 has very high variance.

So PCA may correctly select the feature-1 direction as the first principal component.

**Step 3 — Compare variance with task relevance.**

The lecture explicitly warns:

$$\text{Variance}\neq\text{Relevance}$$

A high-variance direction can be irrelevant to the downstream task.

A low-variance direction can contain class-separating information.

**Step 4 — Answer the classification question.**

The first PC should not automatically be assumed to be the most useful feature for classification.

PCA is unsupervised; classification relevance is supervised/task-dependent.

**Final answer:**

PCA is not “wrong” relative to its own objective, because it maximises variance. But the first PC is not necessarily the most useful direction for classification, because variance is not the same as relevance.

---

## Q28. Orthogonality restriction: PCA versus non-orthogonal latent factors

Suppose a dataset is generated by two meaningful underlying factors that are correlated and not orthogonal in feature space.

A student says PCA must recover those exact factors because PCA finds the most important directions.

Explain the error.

### Solution

**Step 1 — Recall PCA's constraint.**

PCA principal components are orthogonal directions.

That means each component must be perpendicular to the others.

**Step 2 — Compare with the data-generating factors.**

The question says the true underlying factors are correlated and not orthogonal.

So the true factors violate PCA's orthogonality structure.

**Step 3 — Explain what PCA can still do.**

PCA can find orthogonal directions that capture variance well.

But those directions need not match the true underlying non-orthogonal factors.

**Step 4 — State the lecture limitation.**

The lecture notes that PCA may be unsuitable when real-world underlying features are not orthogonal, such as in some neural-signal or genetic-trait settings.

**Final answer:**

The student is wrong because PCA is forced to return orthogonal components. If the real latent factors are non-orthogonal, PCA may produce useful variance directions but not the exact meaningful factors.

---

## Q29. Sequential PCA: remove earlier components first

Suppose centred data points are:

$$x_1=(2,1),\quad x_2=(-2,1),\quad x_3=(0,-2),$$

and the first principal component is given as:

$$v_1=(1,0)^\top.$$

Compute the residuals used to search for the second principal component.

### Solution

**Step 1 — Recall the residual formula for the next component.**

After finding $v_1$, remove the projection onto $v_1$:

$$r_i=x_i-(v_1^\top x_i)v_1$$

The second PC is found by applying variance maximisation to these residuals.

**Step 2 — Compute residual for $x_1=(2,1)$.**

Projection scalar:

$$v_1^\top x_1=(1,0)\cdot(2,1)=2$$

Projection vector:

$$2v_1=2(1,0)=(2,0)$$

Residual:

$$r_1=(2,1)-(2,0)=(0,1)$$

**Step 3 — Compute residual for $x_2=(-2,1)$.**

Projection scalar:

$$v_1^\top x_2=(1,0)\cdot(-2,1)=-2$$

Projection vector:

$$-2v_1=(-2,0)$$

Residual:

$$r_2=(-2,1)-(-2,0)=(0,1)$$

**Step 4 — Compute residual for $x_3=(0,-2)$.**

Projection scalar:

$$v_1^\top x_3=(1,0)\cdot(0,-2)=0$$

Projection vector:

$$0v_1=(0,0)$$

Residual:

$$r_3=(0,-2)-(0,0)=(0,-2)$$

**Final answer:**

The residuals are:

$$r_1=(0,1),\quad r_2=(0,1),\quad r_3=(0,-2).$$

These are the data used to find the second principal component.

---

## Q30. Projection direction must be unit length

A student tries to reconstruct:

$$x=(3,4)^\top$$

using:

$$w=(2,0)^\top$$

and writes:

$$(w^\top x)w.$$

Explain why this is not the correct orthogonal projection formula as used in PCA, and correct it.

### Solution

**Step 1 — Recall the PCA projection formula condition.**

The lecture formula:

$$(v^\top x)v$$

assumes:

$$\|v\|=1$$

That is, the projection direction must be a unit vector.

**Step 2 — Check whether $w$ is unit length.**

$$\|w\|=\sqrt{2^2+0^2}=2$$

So $w$ is not a unit vector.

**Step 3 — Convert $w$ into a unit vector.**

$$v=\frac{w}{\|w\|}=\frac{(2,0)}{2}=(1,0)$$

**Step 4 — Use the unit-vector formula.**

$$v^\top x=(1,0)\cdot(3,4)=3$$

$$(v^\top x)v=3(1,0)=(3,0)$$

**Step 5 — Optional: state the general non-unit formula.**

If using a non-unit vector $w$, the projection is:

$$\frac{w^\top x}{w^\top w}w$$

Here:

$$\frac{w^\top x}{w^\top w}w=\frac{6}{4}(2,0)=(3,0)$$

**Final answer:**

The student's formula is wrong because $w$ is not unit length. After normalising $w$ to $v=(1,0)^\top$, the correct reconstruction is:

$$\boxed{(3,0)^\top}.$$

---

## Q31. Choosing between PCA applications

For each goal below, decide whether PCA is a reasonable tool according to the lecture, and state the reason.

1. Plot high-dimensional data in 2D.
2. Compress image-like data using fewer coordinates.
3. Guarantee that the most predictive classification feature is kept.
4. Reduce noise when low-variance directions are suspected to be noise.
5. Unroll a Swiss-roll dataset perfectly into a flat coordinate system.

### Solution

**Step 1 — Recall PCA applications from the lecture.**

The lecture lists PCA applications including:

- data visualisation;
- image processing/compression;
- noise filtering;
- preprocessing before machine-learning methods.

**Step 2 — Recall PCA limitations.**

The lecture limitations are:

- PCA is linear;
- variance does not necessarily equal relevance;
- components are orthogonal.

**Step 3 — Evaluate item 1.**

Plotting high-dimensional data in 2D is a standard PCA use case.

Answer: reasonable.

**Step 4 — Evaluate item 2.**

Compression using fewer coordinates is a standard PCA use case.

Answer: reasonable.

**Step 5 — Evaluate item 3.**

PCA is unsupervised and preserves high variance, not necessarily predictive relevance.

Answer: not guaranteed.

**Step 6 — Evaluate item 4.**

If low-variance directions are suspected to be noise, PCA can help by dropping them.

Answer: reasonable, but assumption-dependent.

**Step 7 — Evaluate item 5.**

Swiss roll is a nonlinear manifold. PCA is linear, so it cannot be expected to unroll it perfectly.

Answer: not reasonable for perfect unrolling.

**Final answer:**

1. Reasonable — visualisation.
2. Reasonable — compression.
3. Not guaranteed — variance is not relevance.
4. Reasonable if the noise assumption holds.
5. Not reasonable — PCA is linear and Swiss roll is nonlinear.

---

# Final drill checklist

Before the exam, make sure you can do these without looking:

1. Given $N$ and $d$, write the data matrix shape $N\times d$.
2. Compute $\hat\mu=\frac{1}{N}\sum_i x_i$.
3. Centre data using $\tilde{x}_i=x_i-\hat\mu$.
4. Form $X$ by stacking centred rows.
5. Compute $\Sigma=\frac{1}{N}X^\top X$.
6. Find eigenvalues from $\det(\lambda I-A)=0$.
7. Find eigenvectors from $(A-\lambda I)v=0$.
8. Order principal components by descending eigenvalue.
9. Project using $z_i=v^\top x_i$.
10. Reconstruct using $\hat{x}_i=(v^\top x_i)v$ for unit $v$.
11. Compute squared error $\|x_i-\hat{x}_i\|^2$.
12. Use SVD: if $X=USV^\top$, columns of $V$ are PCs.
13. Use $\sigma_i^2$ as eigenvalues of $X^\top X$.
14. Use $\sigma_i^2/N$ as covariance eigenvalues if covariance is $\frac{1}{N}X^\top X$.
15. Compute explained variance ratio $\lambda_k/(\lambda_1+\cdots+\lambda_d)$.
16. Compute cumulative explained variance $(\lambda_1+\cdots+\lambda_k)/(\lambda_1+\cdots+\lambda_d)$.
17. Explain why PCA is linear.
18. Explain why variance need not equal relevance.
19. Explain why PCA components are orthogonal.
20. Explain why non-centred PCA can be misleading.
