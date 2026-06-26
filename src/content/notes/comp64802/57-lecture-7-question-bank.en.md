---
subject: COMP64802
chapter: 57
title: "Lecture 7 — Question Bank"
language: en
---

# COMP64802 Lecture 7 Worked Question Bank — ICA and Kernel PCA

**Source read:** `COMP64802 Chapter 7 - Lecture 7 (1).mht`  
**Lecture scope identified from the sheet:** Independent Component Analysis (ICA), blind source separation, linear mixing/unmixing, whitening, kurtosis/excess kurtosis, ICA limitations, ICA vs PCA, linear PCA review, covariance/Gram/SVD formulations of PCA, feature maps, kernels, RKHS, kernel matrices, centred kernel matrices, and Kernel PCA.

## Computational task types extracted from the sheet

1. Identify ICA variables, shapes, observed quantities, and unknown quantities.
2. Compute linear mixtures using $x=As$.
3. Compute estimated sources using $\hat{s}=Wx$.
4. Check whitening from $\mathbb{E}[ss^\top]=I$ / identity covariance.
5. Compute kurtosis, excess kurtosis, and classify mesokurtic/leptokurtic/platykurtic.
6. Decide whether the lecture's ICA assumptions apply: non-Gaussian sources, linear mixture, enough observations, and noise-free model.
7. Distinguish PCA, ICA, and Kernel PCA by objective and use case.
8. Build the data matrix $X$, compute $X^\top X$, and compute covariance.
9. Show or use $X^\top X=\sum_i x_i x_i^\top$.
10. Build the Gram matrix $G=XX^\top$.
11. Centre a Gram matrix or kernel matrix using the all-ones matrix formula.
12. Run PCA from $X^\top X$ / covariance EVD.
13. Run PCA from SVD $X=USV^\top$.
14. Use singular vector equations and the link to eigenvectors.
15. Compute polynomial feature maps and kernel values.
16. Prove/check kernel symmetry and positive semi-definiteness.
17. Build a kernel matrix $K_{ij}=\kappa(x_i,x_j)$.
18. Run the Kernel PCA skeleton: construct $K$, centre $K$, apply EVD, choose top eigenvalues/eigenvectors.
19. Handle edge cases where methods break, disagree, or become ambiguous.

---

# Section A — Mechanical / single-step drills

These are the small moves you should be able to do without hesitation.

---

## Q1. ICA shape audit

Suppose there are $n=2$ hidden source signals, $m=3$ observed mixed signals, and $N=5$ observed data points. In the lecture's ICA notation, give the shapes of:


$$

s,\quad x,\quad A,\quad X,\quad W.

$$


Also state which quantities are observed and which are unknown.

### Solution

**Step 1 — Identify the source vector.**  
There are $n=2$ sources, so


$$

s\in\mathbb{R}^2.

$$


**Step 2 — Identify the observed mixture vector.**  
There are $m=3$ observed mixed signals, so


$$

x\in\mathbb{R}^3.

$$


**Step 3 — Use the mixing equation.**  
The lecture's mixing model is


$$

x=As.

$$


Since $x\in\mathbb{R}^3$ and $s\in\mathbb{R}^2$, the mixing matrix must be


$$

A\in\mathbb{R}^{3\times 2}.

$$


**Step 4 — Use the data-matrix convention.**  
The data matrix stores the $N=5$ observed mixture vectors as rows:


$$

X\in\mathbb{R}^{5\times 3}.

$$


**Step 5 — Identify the unmixing matrix shape.**  
If $\hat{s}=Wx$, then $W$ maps $\mathbb{R}^3\to\mathbb{R}^2$, so


$$

W\in\mathbb{R}^{2\times 3}.

$$


The lecture later assumes $m=n$ for the square SVD argument; this example is the general shape logic before that simplification.

**Answer.**


$$

s\in\mathbb{R}^2,\quad x\in\mathbb{R}^3,\quad A\in\mathbb{R}^{3\times 2},\quad X\in\mathbb{R}^{5\times 3},\quad W\in\mathbb{R}^{2\times 3}.

$$


Observed: $x_1,\ldots,x_N$, equivalently rows of $X$.  
Unknown in blind source separation: $A$ and the true source signals $s$.

---

## Q2. Compute a linear mixture $x=As$

Let


$$

A=
\begin{pmatrix}
1&2\\
3&1
\end{pmatrix},
\qquad
s=
\begin{pmatrix}
2\\
-1
\end{pmatrix}.

$$


Compute the observed mixture $x=As$.

### Solution

**Step 1 — Write the ICA mixing equation.**


$$

x=As.

$$


**Step 2 — Substitute the given matrix and source vector.**


$$

x=
\begin{pmatrix}
1&2\\
3&1
\end{pmatrix}
\begin{pmatrix}
2\\
-1
\end{pmatrix}.

$$


**Step 3 — Multiply row by column.**

First component:


$$

x_1=1\cdot 2+2\cdot(-1)=2-2=0.

$$


Second component:


$$

x_2=3\cdot 2+1\cdot(-1)=6-1=5.

$$


**Answer.**


$$

x=
\begin{pmatrix}
0\\
5
\end{pmatrix}.

$$


---

## Q3. Compute an unmixing estimate $\hat{s}=Wx$

Using the mixture from Q2,


$$

x=
\begin{pmatrix}
0\\
5
\end{pmatrix},

$$


and the unmixing matrix


$$

W=
\begin{pmatrix}
-\frac15&\frac25\\
\frac35&-\frac15
\end{pmatrix},

$$


compute $\hat{s}=Wx$.

### Solution

**Step 1 — Write the unmixing equation.**


$$

\hat{s}=Wx.

$$


**Step 2 — Substitute the given values.**


$$

\hat{s}= 
\begin{pmatrix}
-\frac15&\frac25\\
\frac35&-\frac15
\end{pmatrix}
\begin{pmatrix}
0\\
5
\end{pmatrix}.

$$


**Step 3 — Multiply row by column.**

First estimated source:


$$

\hat{s}_1=-\frac15\cdot0+\frac25\cdot5=2.

$$


Second estimated source:


$$

\hat{s}_2=\frac35\cdot0-\frac15\cdot5=-1.

$$


**Answer.**


$$

\hat{s}= 
\begin{pmatrix}
2\\
-1
\end{pmatrix}.

$$


This recovers the original source vector from Q2 because this $W$ is the inverse of the chosen $A$.

---

## Q4. Check whether signals are whitened

For each second-moment matrix, decide whether it satisfies the lecture's whitening condition $\mathbb{E}[ss^\top]=I$:


$$

M_1=
\begin{pmatrix}
1&0\\
0&1
\end{pmatrix},
\qquad
M_2=
\begin{pmatrix}
1&0.3\\
0.3&1
\end{pmatrix},
\qquad
M_3=
\begin{pmatrix}
2&0\\
0&1
\end{pmatrix}.

$$


### Solution

**Step 1 — Recall the lecture condition.**  
A whitened source vector satisfies


$$

\mathbb{E}[ss^\top]=I.

$$


For two components, this means


$$

I=
\begin{pmatrix}
1&0\\
0&1
\end{pmatrix}.

$$


So each component has unit variance and the off-diagonal correlations/covariances are zero.

**Step 2 — Check $M_1$.**


$$

M_1=
\begin{pmatrix}
1&0\\
0&1
\end{pmatrix}=I.

$$


So $M_1$ satisfies the condition.

**Step 3 — Check $M_2$.**


$$

M_2=
\begin{pmatrix}
1&0.3\\
0.3&1
\end{pmatrix}.

$$


The diagonal entries are $1$, but the off-diagonal entries are not $0$. So the components are not decorrelated.

**Step 4 — Check $M_3$.**


$$

M_3=
\begin{pmatrix}
2&0\\
0&1
\end{pmatrix}.

$$


The off-diagonal entries are $0$, but the first diagonal entry is $2$, not $1$. So the first component does not have unit variance.

**Answer.**  
Only $M_1$ is whitened.  
$M_2$ fails because the components are correlated.  
$M_3$ fails because one component does not have unit variance.

---

## Q5. Compute excess kurtosis and classify the distribution

For each random variable, compute excess kurtosis and classify it as mesokurtic, leptokurtic, or platykurtic.

| Variable | Kurtosis $\kappa$ |
|---|---:|
| $X$ | $3$ |
| $Y$ | $5.5$ |
| $Z$ | $2.2$ |

### Solution

**Step 1 — Recall the formula.**


$$

\text{excess kurtosis}=\kappa-3.

$$


**Step 2 — Recall the classification rule.**


$$

\kappa-3=0 \Rightarrow \text{mesokurtic},

$$



$$

\kappa-3>0 \Rightarrow \text{leptokurtic},

$$



$$

\kappa-3<0 \Rightarrow \text{platykurtic}.

$$


**Step 3 — Classify $X$.**


$$

3-3=0.

$$


So $X$ is mesokurtic.

**Step 4 — Classify $Y$.**


$$

5.5-3=2.5>0.

$$


So $Y$ is leptokurtic.

**Step 5 — Classify $Z$.**


$$

2.2-3=-0.8<0.

$$


So $Z$ is platykurtic.

**Answer.**

| Variable | Excess kurtosis | Classification |
|---|---:|---|
| $X$ | $0$ | mesokurtic |
| $Y$ | $2.5$ | leptokurtic |
| $Z$ | $-0.8$ | platykurtic |

---

## Q6. Build $X$, compute $X^\top X$, and compute covariance

Given data points


$$

x_1=\begin{pmatrix}1\\0\end{pmatrix},
\qquad
x_2=\begin{pmatrix}3\\0\end{pmatrix},
\qquad
x_3=\begin{pmatrix}5\\0\end{pmatrix},

$$


recentre the data, construct the centred data matrix $X$, compute $X^\top X$, and compute


$$

\Sigma=\frac1N X^\top X.

$$


### Solution

**Step 1 — Compute the sample mean.**


$$

\hat{\mu}=\frac13
\left(
\begin{pmatrix}1\\0\end{pmatrix}
+
\begin{pmatrix}3\\0\end{pmatrix}
+
\begin{pmatrix}5\\0\end{pmatrix}
\right)
=
\begin{pmatrix}3\\0\end{pmatrix}.

$$


**Step 2 — Recentre each point.**


$$

\tilde{x}_1=x_1-\hat{\mu}=\begin{pmatrix}-2\\0\end{pmatrix},

$$



$$

\tilde{x}_2=x_2-\hat{\mu}=\begin{pmatrix}0\\0\end{pmatrix},

$$



$$

\tilde{x}_3=x_3-\hat{\mu}=\begin{pmatrix}2\\0\end{pmatrix}.

$$


**Step 3 — Construct the centred data matrix.**  
Rows are data points transposed:


$$

X=
\begin{pmatrix}
-2&0\\
0&0\\
2&0
\end{pmatrix}.

$$


**Step 4 — Compute $X^\top X$.**


$$

X^\top X=
\begin{pmatrix}
-2&0&2\\
0&0&0
\end{pmatrix}
\begin{pmatrix}
-2&0\\
0&0\\
2&0
\end{pmatrix}
=
\begin{pmatrix}
8&0\\
0&0
\end{pmatrix}.

$$


**Step 5 — Divide by $N=3$.**


$$

\Sigma=\frac13X^\top X
=
\begin{pmatrix}
8/3&0\\
0&0
\end{pmatrix}.

$$


**Answer.**


$$

X=
\begin{pmatrix}
-2&0\\
0&0\\
2&0
\end{pmatrix},
\qquad
X^\top X=
\begin{pmatrix}
8&0\\
0&0
\end{pmatrix},
\qquad
\Sigma=
\begin{pmatrix}
8/3&0\\
0&0
\end{pmatrix}.

$$


The largest variance is along the first coordinate axis.

---

# Section B — Multi-condition checks

These questions test whether you choose the correct method and satisfy all conditions, not just one formula.

---

## Q7. Decide whether the lecture's ICA setup applies

For each scenario, decide whether the clean linear ICA setup from the lecture applies.

| Scenario | Description |
|---|---|
| A | Two non-Gaussian independent sources, two observed linear mixtures, no noise. |
| B | Two independent Gaussian sources, two observed linear mixtures, no noise. |
| C | Two non-Gaussian independent sources, but observations are nonlinear mixtures. |
| D | Three sources but only two observed mixtures. |
| E | Two non-Gaussian independent sources, two observed linear mixtures, additive noise $\epsilon$. |

### Solution

**Step 1 — Recall the lecture's clean ICA assumptions.**  
The lecture setup assumes:

1. sources are statistically independent;
2. sources are non-Gaussian;
3. the mixture is linear: $x=As$;
4. this basic setup cannot recover more sources than observations;
5. the main model discussed is noise-free, not $x=As+\epsilon$.

**Step 2 — Check scenario A.**  
A satisfies independence, non-Gaussianity, linearity, enough observations, and no noise.

So A fits the lecture setup.

**Step 3 — Check scenario B.**  
B has Gaussian sources. The lecture explicitly says ICA cannot have Gaussian sources.

So B does not fit.

**Step 4 — Check scenario C.**  
C has nonlinear mixtures. The lecture setup uses $x=As$, a linear model.

So C does not fit.

**Step 5 — Check scenario D.**  
D has three sources but only two observations. The lecture says you can only recover as many sources as observations.

So D does not fit for recovering all three sources.

**Step 6 — Check scenario E.**  
E has additive noise. The lecture mentions $x=As+\epsilon$, but says that needs more work beyond the clean setup.

So E does not fit the clean lecture setup.

**Answer.**

| Scenario | Clean lecture ICA applies? | Reason |
|---|---|---|
| A | Yes | Independent, non-Gaussian, linear, enough observations, no noise |
| B | No | Gaussian sources break ICA identifiability assumption |
| C | No | Nonlinear mixture is outside $x=As$ |
| D | No | More sources than observations |
| E | Not the clean version | Additive-noise ICA needs extra work |

---

## Q8. Choose PCA, ICA, or Kernel PCA

Choose the best method from the lecture for each task.

| Task | Candidate methods |
|---|---|
| A | Reduce a high-dimensional Gaussian-like dataset using directions of maximum variance. | PCA / ICA / Kernel PCA |
| B | Separate hidden speaker signals from microphone mixtures. | PCA / ICA / Kernel PCA |
| C | Extract nonlinear structure when linear principal axes are too restrictive. | PCA / ICA / Kernel PCA |
| D | Find statistically independent non-Gaussian components. | PCA / ICA / Kernel PCA |

### Solution

**Step 1 — Recall each method's objective.**

PCA: maximise variance and reduce dimension using linear directions.  
ICA: maximise statistical independence to separate non-Gaussian sources.  
Kernel PCA: use a kernel/feature embedding to capture nonlinear structure.

**Step 2 — Match task A.**  
Task A asks for variance directions in Gaussian-like data.

That is PCA.

**Step 3 — Match task B.**  
Task B is the cocktail-party/blind-source-separation setting.

That is ICA.

**Step 4 — Match task C.**  
Task C says linear principal axes are too restrictive.

That is Kernel PCA.

**Step 5 — Match task D.**  
Task D explicitly asks for statistically independent non-Gaussian components.

That is ICA.

**Answer.**

| Task | Method |
|---|---|
| A | PCA |
| B | ICA |
| C | Kernel PCA |
| D | ICA |

---

## Q9. Construct the Gram matrix $G=XX^\top$

Let


$$

x_1=\begin{pmatrix}1\\0\end{pmatrix},
\quad
x_2=\begin{pmatrix}0\\2\end{pmatrix},
\quad
x_3=\begin{pmatrix}1\\2\end{pmatrix}.

$$


Construct the Gram matrix $G$, where


$$

G_{jk}=x_j^\top x_k.

$$


### Solution

**Step 1 — Recall the Gram matrix rule.**


$$

G_{jk}=x_j^\top x_k.

$$


So every entry is a dot product between two data points.

**Step 2 — Compute the diagonal entries.**


$$

G_{11}=x_1^\top x_1=1^2+0^2=1.

$$



$$

G_{22}=x_2^\top x_2=0^2+2^2=4.

$$



$$

G_{33}=x_3^\top x_3=1^2+2^2=5.

$$


**Step 3 — Compute the off-diagonal entries.**


$$

G_{12}=x_1^\top x_2=1\cdot0+0\cdot2=0.

$$



$$

G_{13}=x_1^\top x_3=1\cdot1+0\cdot2=1.

$$



$$

G_{23}=x_2^\top x_3=0\cdot1+2\cdot2=4.

$$


Because dot products are symmetric:


$$

G_{21}=0,\quad G_{31}=1,\quad G_{32}=4.

$$


**Answer.**


$$

G=
\begin{pmatrix}
1&0&1\\
0&4&4\\
1&4&5
\end{pmatrix}.

$$


---

## Q10. Centre a Gram matrix

Given


$$

G=
\begin{pmatrix}
4&2\\
2&4
\end{pmatrix},

$$


compute the centred Gram matrix


$$

\tilde{G}=G-\frac1N\mathbf{1}G-\frac1NG\mathbf{1}+\frac1{N^2}\mathbf{1}G\mathbf{1},

$$


where $N=2$ and $\mathbf{1}$ is the all-ones matrix.

### Solution

**Step 1 — Write the all-ones matrix.**


$$

\mathbf{1}=\begin{pmatrix}1&1\\1&1\end{pmatrix}.

$$


Do not confuse this with the identity matrix.

**Step 2 — Use the equivalent mean-subtraction form.**  
For each entry,


$$

\tilde{G}_{ij}=G_{ij}-\text{row mean}_i-\text{column mean}_j+\text{overall mean}.

$$


This is the same operation as the matrix formula.

**Step 3 — Compute row means.**

Both row means are


$$

\frac{4+2}{2}=3,
\qquad
\frac{2+4}{2}=3.

$$


**Step 4 — Compute column means.**

Both column means are also


$$

3.

$$


**Step 5 — Compute the overall mean.**


$$

\frac{4+2+2+4}{4}=3.

$$


**Step 6 — Centre each entry.**


$$

\tilde{G}_{11}=4-3-3+3=1.

$$



$$

\tilde{G}_{12}=2-3-3+3=-1.

$$



$$

\tilde{G}_{21}=2-3-3+3=-1.

$$



$$

\tilde{G}_{22}=4-3-3+3=1.

$$


**Answer.**


$$

\tilde{G}=
\begin{pmatrix}
1&-1\\
-1&1
\end{pmatrix}.

$$


---

## Q11. Run one PCA EVD decision from $X^\top X$

Suppose centred data gives


$$

X^\top X=
\begin{pmatrix}
9&0\\
0&1
\end{pmatrix}.

$$


For $k=1$, which principal component should PCA return? Explain whether using $\Sigma=\frac1NX^\top X$ would change the principal component.

### Solution

**Step 1 — Recall the PCA EVD rule.**  
PCA returns eigenvectors corresponding to the largest eigenvalues of $X^\top X$, or equivalently of $\Sigma=\frac1NX^\top X$.

**Step 2 — Read off the eigenpairs.**  
The matrix is diagonal, so the eigenvectors are the coordinate axes:


$$

v_1=\begin{pmatrix}1\\0\end{pmatrix},\quad \lambda_1=9,

$$



$$

v_2=\begin{pmatrix}0\\1\end{pmatrix},\quad \lambda_2=1.

$$


**Step 3 — Sort eigenvalues.**


$$

9>1.

$$


So the top eigenvector is


$$

\begin{pmatrix}1\\0\end{pmatrix}.

$$


**Step 4 — Check the scaling issue.**  
If we use


$$

\Sigma=\frac1NX^\top X,

$$


then both eigenvalues are divided by $N$, but the eigenvectors do not change.

**Answer.**  
For $k=1$, PCA returns


$$

v_1=\begin{pmatrix}1\\0\end{pmatrix}.

$$


Using $\Sigma=\frac1NX^\top X$ changes eigenvalue scale only; it does not change the principal component direction.

---

## Q12. Verify the singular-vector equations

Let


$$

X=
\begin{pmatrix}
3&0\\
0&1
\end{pmatrix},
\quad
v=\begin{pmatrix}1\\0\end{pmatrix},
\quad
u=\begin{pmatrix}1\\0\end{pmatrix},
\quad
\sigma=3.

$$


Verify that $(u,v,\sigma)$ satisfies the singular-vector equations and show the corresponding eigenvalue of $X^\top X$.

### Solution

**Step 1 — Recall the singular-vector equations.**


$$

Xv=\sigma u,
\qquad
X^\top u=\sigma v.

$$


**Step 2 — Check $Xv=\sigma u$.**


$$

Xv=
\begin{pmatrix}
3&0\\
0&1
\end{pmatrix}
\begin{pmatrix}1\\0\end{pmatrix}
=
\begin{pmatrix}3\\0\end{pmatrix}.

$$


Also,


$$

\sigma u=3\begin{pmatrix}1\\0\end{pmatrix}
=
\begin{pmatrix}3\\0\end{pmatrix}.

$$


So the first equation holds.

**Step 3 — Check $X^\top u=\sigma v$.**  
Here $X^\top=X$, so


$$

X^\top u=
\begin{pmatrix}
3&0\\
0&1
\end{pmatrix}
\begin{pmatrix}1\\0\end{pmatrix}
=
\begin{pmatrix}3\\0\end{pmatrix}.

$$


Also,


$$

\sigma v=3\begin{pmatrix}1\\0\end{pmatrix}
=
\begin{pmatrix}3\\0\end{pmatrix}.

$$


So the second equation holds.

**Step 4 — Derive the eigenvalue of $X^\top X$.**


$$

X^\top X=
\begin{pmatrix}
3&0\\
0&1
\end{pmatrix}
\begin{pmatrix}
3&0\\
0&1
\end{pmatrix}
=
\begin{pmatrix}
9&0\\
0&1
\end{pmatrix}.

$$


Then


$$

X^\top Xv=
\begin{pmatrix}
9&0\\
0&1
\end{pmatrix}
\begin{pmatrix}1\\0\end{pmatrix}
=
\begin{pmatrix}9\\0\end{pmatrix}
=9v.

$$


**Answer.**  
The singular-vector equations hold, and $v$ is an eigenvector of $X^\top X$ with eigenvalue


$$

\sigma^2=3^2=9.

$$


---

## Q13. Compute the lecture's polynomial kernel using the feature map

The lecture uses the degree-2 feature map


$$

\phi(x)=
\begin{pmatrix}
1\\
\sqrt{2}x_1\\
\sqrt{2}x_2\\
x_1^2\\
x_2^2\\
\sqrt{2}x_1x_2
\end{pmatrix}

$$


and shows that


$$

\phi(x)^\top\phi(y)=(1+x^\top y)^2.

$$


For


$$

x=\begin{pmatrix}1\\2\end{pmatrix},
\qquad
 y=\begin{pmatrix}3\\1\end{pmatrix},

$$


compute $\phi(x)^\top\phi(y)$ using the kernel shortcut.

### Solution

**Step 1 — Identify the kernel induced by the feature map.**


$$

\kappa(x,y)=(1+x^\top y)^2.

$$


**Step 2 — Compute the original-space dot product.**


$$

x^\top y=1\cdot3+2\cdot1=3+2=5.

$$


**Step 3 — Substitute into the kernel.**


$$

\kappa(x,y)=(1+5)^2=6^2=36.

$$


**Step 4 — Interpret the result.**  
Because the kernel equals the feature-space inner product,


$$

\phi(x)^\top\phi(y)=36.

$$


**Answer.**


$$

\phi(x)^\top\phi(y)=36.

$$


The point of the kernel trick is that we did not need to explicitly form the six-dimensional feature vectors.

---

## Q14. Prove that a feature-map inner product is a kernel

Let $\phi:\mathcal{X}\to H$, and define


$$

\kappa(x,y)=\langle \phi(x),\phi(y)\rangle_H.

$$


Show that $\kappa$ satisfies the two kernel properties from the lecture.

### Solution

**Step 1 — Recall the two required properties.**  
A kernel must be:

1. symmetric;
2. positive semi-definite.

**Step 2 — Check symmetry.**  
Using symmetry of the inner product,


$$

\kappa(x,y)=\langle \phi(x),\phi(y)\rangle_H
=\langle \phi(y),\phi(x)\rangle_H
=\kappa(y,x).

$$


So $\kappa$ is symmetric.

**Step 3 — Check positive semi-definiteness.**  
For any $x_1,
\ldots,x_n\in\mathcal{X}$ and any $c_1,
\ldots,c_n\in\mathbb{R}$, compute


$$

\sum_{i=1}^{n}\sum_{j=1}^{n} c_ic_j\kappa(x_i,x_j).

$$


Substitute the definition:


$$

=\sum_{i=1}^{n}\sum_{j=1}^{n}c_ic_j
\langle \phi(x_i),\phi(x_j)\rangle_H.

$$


Regroup using bilinearity of the inner product:


$$

=
\left\langle
\sum_{i=1}^{n}c_i\phi(x_i),
\sum_{j=1}^{n}c_j\phi(x_j)
\right\rangle_H.

$$


This is the squared norm of one vector:


$$

=
\left\|\sum_{i=1}^{n}c_i\phi(x_i)\right\|_H^2\geq0.

$$


**Answer.**  
$\kappa$ is symmetric and positive semi-definite, so it is a kernel.

---

# Section C — Building things from scratch

These are full procedural exam-style questions where you build the object, run the method, and interpret the result.

---

## Q15. Mini cocktail-party ICA: mix and unmix two sources

At one time step, suppose two hidden source signals are


$$

s=\begin{pmatrix}2\\1\end{pmatrix},

$$


and the mixing matrix is


$$

A=
\begin{pmatrix}
1&1\\
1&-1
\end{pmatrix}.

$$


1. Compute the observed microphone mixture $x=As$.  
2. Compute $A^{-1}$.  
3. Use $W=A^{-1}$ to recover $\hat{s}=Wx$.

### Solution

**Step 1 — Compute the mixture.**


$$

x=As=
\begin{pmatrix}
1&1\\
1&-1
\end{pmatrix}
\begin{pmatrix}2\\1\end{pmatrix}.

$$


So


$$

x_1=1\cdot2+1\cdot1=3,

$$



$$

x_2=1\cdot2+(-1)\cdot1=1.

$$


Thus


$$

x=\begin{pmatrix}3\\1\end{pmatrix}.

$$


**Step 2 — Compute the determinant of $A$.**


$$

\det(A)=1\cdot(-1)-1\cdot1=-1-1=-2.

$$


**Step 3 — Compute $A^{-1}$.**

For


$$

A=\begin{pmatrix}a&b\\c&d\end{pmatrix},
\qquad
A^{-1}=\frac1{ad-bc}
\begin{pmatrix}d&-b\\-c&a\end{pmatrix}.

$$


Here,


$$

A^{-1}=\frac1{-2}
\begin{pmatrix}
-1&-1\\
-1&1
\end{pmatrix}
=
\begin{pmatrix}
1/2&1/2\\
1/2&-1/2
\end{pmatrix}.

$$


So


$$

W=A^{-1}=\begin{pmatrix}
1/2&1/2\\
1/2&-1/2
\end{pmatrix}.

$$


**Step 4 — Apply the unmixing matrix.**


$$

\hat{s}=Wx=
\begin{pmatrix}
1/2&1/2\\
1/2&-1/2
\end{pmatrix}
\begin{pmatrix}3\\1\end{pmatrix}.

$$


First component:


$$

\hat{s}_1=\frac12\cdot3+\frac12\cdot1=2.

$$


Second component:


$$

\hat{s}_2=\frac12\cdot3-\frac12\cdot1=1.

$$


**Answer.**


$$

x=\begin{pmatrix}3\\1\end{pmatrix},
\qquad
W=A^{-1}=\begin{pmatrix}1/2&1/2\\1/2&-1/2\end{pmatrix},
\qquad
\hat{s}=\begin{pmatrix}2\\1\end{pmatrix}.

$$


This mirrors the cocktail-party idea: microphones observe mixtures; unmixing estimates the hidden sources.

---

## Q16. Run PCA using covariance/EVD

Given centred data points


$$

x_1=\begin{pmatrix}2\\0\end{pmatrix},
\quad
x_2=\begin{pmatrix}0\\1\end{pmatrix},
\quad
x_3=\begin{pmatrix}-2\\0\end{pmatrix},
\quad
x_4=\begin{pmatrix}0\\-1\end{pmatrix},

$$


run the lecture's PCA-by-EVD procedure and return the top $k=1$ principal component.

### Solution

**Step 1 — Confirm centering.**  
The mean is


$$

\hat{\mu}=\frac14
\left(
\begin{pmatrix}2\\0\end{pmatrix}
+
\begin{pmatrix}0\\1\end{pmatrix}
+
\begin{pmatrix}-2\\0\end{pmatrix}
+
\begin{pmatrix}0\\-1\end{pmatrix}
\right)
=egin{pmatrix}0\\0\end{pmatrix}.

$$


So the data are already centred.

**Step 2 — Construct the centred data matrix.**


$$

X=
\begin{pmatrix}
2&0\\
0&1\\
-2&0\\
0&-1
\end{pmatrix}.

$$


**Step 3 — Compute $X^\top X$.**


$$

X^\top X=
\begin{pmatrix}
2&0&-2&0\\
0&1&0&-1
\end{pmatrix}
\begin{pmatrix}
2&0\\
0&1\\
-2&0\\
0&-1
\end{pmatrix}
=
\begin{pmatrix}
8&0\\
0&2
\end{pmatrix}.

$$


**Step 4 — Compute eigenvalues and eigenvectors.**  
Because the matrix is diagonal:


$$

\lambda_1=8,
\quad
v_1=\begin{pmatrix}1\\0\end{pmatrix},

$$



$$

\lambda_2=2,
\quad
v_2=\begin{pmatrix}0\\1\end{pmatrix}.

$$


**Step 5 — Sort eigenvalues.**


$$

8>2.

$$


So the first principal component is $v_1$.

**Answer.**


$$

\text{Top PC}=\begin{pmatrix}1\\0\end{pmatrix}.

$$


The data vary more along the horizontal axis than the vertical axis.

---

## Q17. Run PCA using a given SVD

Suppose the centred data matrix has SVD


$$

X=USV^\top,

$$


where


$$

S=\begin{pmatrix}
5&0\\
0&2
\end{pmatrix},
\qquad
V=
\begin{pmatrix}
\frac1{\sqrt2}&\frac1{\sqrt2}\\
\frac1{\sqrt2}&-\frac1{\sqrt2}
\end{pmatrix}.

$$


Using the lecture's SVD rule, return the top $k=1$ principal component and state the eigenvalues of $X^\top X$.

### Solution

**Step 1 — Recall the SVD rule for PCA.**  
If


$$

X=USV^\top,

$$


then the principal components are the columns of $V$, ordered by singular values.

**Step 2 — Read off the singular values.**


$$

\sigma_1=5,
\qquad
\sigma_2=2.

$$


Since $5>2$, the first column of $V$ is the top principal component.

**Step 3 — Extract the first column of $V$.**


$$

v_1=\begin{pmatrix}
1/\sqrt2\\
1/\sqrt2
\end{pmatrix}.

$$


**Step 4 — Convert singular values to eigenvalues of $X^\top X$.**  
The lecture relation is


$$

X^\top Xv_i=\sigma_i^2v_i.

$$


So the eigenvalues are


$$

\sigma_1^2=25,
\qquad
\sigma_2^2=4.

$$


**Answer.**


$$

\text{Top PC}=\begin{pmatrix}1/\sqrt2\\1/\sqrt2\end{pmatrix}.

$$


The eigenvalues of $X^\top X$ are


$$

25\quad\text{and}\quad4.

$$


---

## Q18. Run linear PCA through the centred Gram matrix

Consider one-dimensional centred data


$$

x_1=-1,
\qquad
x_2=0,
\qquad
x_3=1.

$$


1. Construct the Gram matrix $G$.  
2. Check whether it is already centred.  
3. Apply EVD and choose the top eigenvalue/eigenvector.

### Solution

**Step 1 — Build the Gram matrix.**  
For one-dimensional data,


$$

G_{ij}=x_ix_j.

$$


Thus


$$

G=
\begin{pmatrix}
(-1)(-1)&(-1)(0)&(-1)(1)\\
0(-1)&0(0)&0(1)\\
1(-1)&1(0)&1(1)
\end{pmatrix}
=
\begin{pmatrix}
1&0&-1\\
0&0&0\\
-1&0&1
\end{pmatrix}.

$$


**Step 2 — Check centering.**  
A centred Gram matrix should have row sums and column sums equal to zero.

Row sums:


$$

1+0-1=0,
\quad
0+0+0=0,
\quad
-1+0+1=0.

$$


Column sums are the same because $G$ is symmetric. So $G$ is already centred:


$$

\tilde{G}=G.

$$


**Step 3 — Recognise the matrix as an outer product.**  
Let


$$

z=\begin{pmatrix}-1\\0\\1\end{pmatrix}.

$$


Then


$$

G=zz^\top.

$$


**Step 4 — Compute the nonzero eigenvalue.**  
For $G=zz^\top$, the nonzero eigenvalue is


$$

z^\top z=(-1)^2+0^2+1^2=2.

$$


The corresponding eigenvector is


$$

\frac{z}{\|z\|}=\frac1{\sqrt2}
\begin{pmatrix}-1\\0\\1\end{pmatrix}.

$$


**Answer.**


$$

G=\tilde{G}=\begin{pmatrix}
1&0&-1\\
0&0&0\\
-1&0&1
\end{pmatrix}.

$$


The top Gram-matrix eigenvalue is


$$

\lambda_1=2,

$$


with eigenvector


$$

\alpha_1=\frac1{\sqrt2}
\begin{pmatrix}-1\\0\\1\end{pmatrix}.

$$


Important: this eigenvector lives in $\mathbb{R}^N=\mathbb{R}^3$, not in the original one-dimensional data space.

---

## Q19. Run Kernel PCA from scratch using the lecture's polynomial kernel

Use the one-dimensional version of the lecture's degree-2 polynomial kernel:


$$

\kappa(x,y)=(1+xy)^2.

$$


Given


$$

x_1=-1,
\qquad
x_2=0,
\qquad
x_3=1,

$$


1. Construct the kernel matrix $K$.  
2. Centre $K$.  
3. Apply EVD and choose the top $k=1$ kernel principal component coefficient vector.

### Solution

**Step 1 — Recall the kernel matrix rule.**


$$

K_{ij}=\kappa(x_i,x_j)=(1+x_ix_j)^2.

$$


**Step 2 — Compute all kernel values.**


$$

K_{11}=(1+(-1)(-1))^2=(2)^2=4.

$$



$$

K_{12}=(1+(-1)(0))^2=1.

$$



$$

K_{13}=(1+(-1)(1))^2=0.

$$



$$

K_{22}=(1+0\cdot0)^2=1.

$$



$$

K_{23}=(1+0\cdot1)^2=1.

$$



$$

K_{33}=(1+1\cdot1)^2=4.

$$


By symmetry, fill the other entries.


$$

K=
\begin{pmatrix}
4&1&0\\
1&1&1\\
0&1&4
\end{pmatrix}.

$$


**Step 3 — Centre the kernel matrix.**  
Use


$$

\tilde{K}_{ij}=K_{ij}-\text{row mean}_i-\text{column mean}_j+\text{overall mean}.

$$


Row means:


$$

r_1=\frac{4+1+0}{3}=\frac53,

$$



$$

r_2=\frac{1+1+1}{3}=1,

$$



$$

r_3=\frac{0+1+4}{3}=\frac53.

$$


Column means are the same because $K$ is symmetric.  
Overall mean:


$$

\bar{K}=\frac{4+1+0+1+1+1+0+1+4}{9}=\frac{13}{9}.

$$


Now compute entries:


$$

\tilde{K}_{11}=4-\frac53-\frac53+\frac{13}{9}=\frac{19}{9}.

$$



$$

\tilde{K}_{12}=1-\frac53-1+\frac{13}{9}=-\frac29.

$$



$$

\tilde{K}_{13}=0-\frac53-\frac53+\frac{13}{9}=-\frac{17}{9}.

$$



$$

\tilde{K}_{22}=1-1-1+\frac{13}{9}=\frac49.

$$



$$

\tilde{K}_{23}=1-1-\frac53+\frac{13}{9}=-\frac29.

$$



$$

\tilde{K}_{33}=4-\frac53-\frac53+\frac{13}{9}=\frac{19}{9}.

$$


So


$$

\tilde{K}=\begin{pmatrix}
19/9&-2/9&-17/9\\
-2/9&4/9&-2/9\\
-17/9&-2/9&19/9
\end{pmatrix}.

$$


**Step 4 — Apply EVD.**  
The eigenvalues of this centred kernel matrix are


$$

4,\quad \frac23,\quad 0.

$$


The top eigenvalue is


$$

\lambda_1=4.

$$


A corresponding eigenvector is


$$

\alpha_1=
\begin{pmatrix}-1\\0\\1\end{pmatrix}.

$$


Normalising it gives


$$

\alpha_1=\frac1{\sqrt2}
\begin{pmatrix}-1\\0\\1\end{pmatrix}.

$$


**Answer.**


$$

K=
\begin{pmatrix}
4&1&0\\
1&1&1\\
0&1&4
\end{pmatrix},

$$



$$

\tilde{K}=\begin{pmatrix}
19/9&-2/9&-17/9\\
-2/9&4/9&-2/9\\
-17/9&-2/9&19/9
\end{pmatrix}.

$$


For $k=1$, choose the top eigenvalue $4$ with coefficient vector


$$

\alpha_1=\frac1{\sqrt2}
\begin{pmatrix}-1\\0\\1\end{pmatrix}.

$$


This is an $N$-dimensional coefficient vector, not a data-space vector.

---

## Q20. Build a kernel matrix and compare it with a Gram matrix

For the same data


$$

x_1=-1,
\qquad
x_2=0,
\qquad
x_3=1,

$$


compute:

1. the ordinary Gram matrix $G_{ij}=x_ix_j$;  
2. the polynomial kernel matrix $K_{ij}=(1+x_ix_j)^2$;  
3. explain the difference in one sentence.

### Solution

**Step 1 — Compute the ordinary Gram matrix.**


$$

G_{ij}=x_ix_j.

$$


So


$$

G=
\begin{pmatrix}
1&0&-1\\
0&0&0\\
-1&0&1
\end{pmatrix}.

$$


**Step 2 — Compute the kernel matrix.**


$$

K_{ij}=(1+x_ix_j)^2.

$$


From Q19,


$$

K=
\begin{pmatrix}
4&1&0\\
1&1&1\\
0&1&4
\end{pmatrix}.

$$


**Step 3 — Compare the entries.**  
The Gram matrix uses the original-space inner product $x_i^\top x_j$.  
The kernel matrix replaces this with $\kappa(x_i,x_j)$, which equals an inner product after feature embedding.

**Answer.**  
$G$ is the linear inner-product matrix in the original data space; $K$ is the kernel/feature-space inner-product matrix.

---

# Section D — Hard edge cases: where methods disagree, break down, or become ambiguous

This is the highest-value exam-prep section. These are the traps that look like routine PCA/ICA/Kernel PCA but are not.

---

## Q21. Why Gaussian sources break ICA

Suppose $s\in\mathbb{R}^2$ is a whitened Gaussian source vector:


$$

s\sim \mathcal{N}(0,I).

$$


Let


$$

R=\begin{pmatrix}
0&-1\\
1&0
\end{pmatrix}

$$


be a rotation matrix and define


$$

z=Rs.

$$


Show why this creates an identifiability problem for ICA.

### Solution

**Step 1 — Recall the ICA requirement.**  
ICA relies on non-Gaussian independent source signals. The lecture states that ICA cannot have Gaussian sources.

**Step 2 — Check what rotation does to the covariance.**


$$

\mathbb{E}[zz^\top]
=\mathbb{E}[Rs(Rs)^\top]
=\mathbb{E}[Rss^\top R^\top].

$$


Pull out the constant matrices:


$$

\mathbb{E}[zz^\top]
=R\mathbb{E}[ss^\top]R^\top.

$$


Since $s$ is whitened,


$$

\mathbb{E}[ss^\top]=I.

$$


So


$$

\mathbb{E}[zz^\top]=RIR^\top=RR^\top=I.

$$


**Step 3 — Interpret the result.**  
The rotated variables $z$ are still whitened Gaussian variables.

For Gaussian variables, being uncorrelated is enough to imply independence. So the rotated components can also look independent.

**Step 4 — State the ICA problem.**  
If both $s$ and rotated versions $Rs$ look like valid independent Gaussian sources, ICA cannot uniquely identify the original source directions.

**Answer.**  
Gaussian whitened sources are rotationally ambiguous. ICA needs non-Gaussianity to choose meaningful independent components; otherwise many rotations look equally valid.

---

## Q22. Why more sources than observations breaks the lecture setup

Suppose


$$

x=
\begin{pmatrix}1\\1\end{pmatrix},
\qquad
A=
\begin{pmatrix}
1&0&1\\
0&1&1
\end{pmatrix},
\qquad
s=\begin{pmatrix}s_1\\s_2\\s_3\end{pmatrix}.

$$


Show that the equation $x=As$ has infinitely many source vectors $s$. What does this imply for ICA?

### Solution

**Step 1 — Write the system $x=As$.**


$$

\begin{pmatrix}1\\1\end{pmatrix}
=
\begin{pmatrix}
1&0&1\\
0&1&1
\end{pmatrix}
\begin{pmatrix}s_1\\s_2\\s_3\end{pmatrix}.

$$


This gives two equations:


$$

s_1+s_3=1,

$$



$$

s_2+s_3=1.

$$


**Step 2 — Solve in terms of a free variable.**  
Let


$$

s_3=t.

$$


Then


$$

s_1=1-t,

$$


and


$$

s_2=1-t.

$$


So every vector of the form


$$

s(t)=
\begin{pmatrix}
1-t\\
1-t\\
t
\end{pmatrix}

$$


satisfies $x=As$.

**Step 3 — Show non-uniqueness.**  
For example, if $t=0$,


$$

s(0)=\begin{pmatrix}1\\1\\0\end{pmatrix}.

$$


If $t=1$,


$$

s(1)=\begin{pmatrix}0\\0\\1\end{pmatrix}.

$$


Both produce the same observed $x$.

**Answer.**  
There are infinitely many possible source vectors. This illustrates the lecture warning: this ICA setup cannot recover more sources than there are observations.

---

## Q23. Detect a nonlinear mixture that linear ICA cannot handle

Suppose the observations are


$$

x_1=s_1+s_2,
\qquad
x_2=s_1s_2.

$$


Can this be written in the lecture's clean linear form $x=As$ with a constant matrix $A$?

### Solution

**Step 1 — Recall the linear ICA form.**


$$

x=As.

$$


For two sources and two observations, this means


$$

x_1=a_{11}s_1+a_{12}s_2,

$$



$$

x_2=a_{21}s_1+a_{22}s_2.

$$


Each observed signal must be a linear combination of $s_1$ and $s_2$.

**Step 2 — Check $x_1$.**


$$

x_1=s_1+s_2

$$


is linear. It could be represented using coefficients $1$ and $1$.

**Step 3 — Check $x_2$.**


$$

x_2=s_1s_2

$$


contains a product term. There are no constants $a_{21},a_{22}$ such that


$$

a_{21}s_1+a_{22}s_2=s_1s_2

$$


for all possible $s_1,s_2$.

**Answer.**  
No. The second observation is nonlinear, so the clean lecture ICA model $x=As$ does not apply.

---

## Q24. Why additive noise prevents exact unmixing in the clean model

Suppose the true model is


$$

x=As+\epsilon,

$$


but you apply the clean unmixing matrix $W=A^{-1}$. Show what happens to $\hat{s}=Wx$.

### Solution

**Step 1 — Start from the noisy model.**


$$

x=As+\epsilon.

$$


**Step 2 — Apply the clean unmixing matrix.**


$$

\hat{s}=Wx.

$$


With $W=A^{-1}$,


$$

\hat{s}=A^{-1}x.

$$


**Step 3 — Substitute the noisy model.**


$$

\hat{s}=A^{-1}(As+\epsilon).

$$


**Step 4 — Distribute $A^{-1}$.**


$$

\hat{s}=A^{-1}As+A^{-1}\epsilon.

$$


Since $A^{-1}A=I$,


$$

\hat{s}=s+A^{-1}\epsilon.

$$


**Answer.**  
The recovered signal is not exactly $s$; it contains transformed noise:


$$

\hat{s}=s+A^{-1}\epsilon.

$$


This is why the lecture says the noisy version needs more work beyond the clean ICA setup.

---

## Q25. Why centering can completely change PCA

Consider two data points


$$

x_1=\begin{pmatrix}10\\1\end{pmatrix},
\qquad
x_2=\begin{pmatrix}10\\-1\end{pmatrix}.

$$


1. Compute the top PCA direction if you incorrectly use uncentred $X^\top X$.  
2. Compute the top PCA direction after proper centering.  
3. Explain the disagreement.

### Solution

**Step 1 — Build the uncentred data matrix.**


$$

X=\begin{pmatrix}
10&1\\
10&-1
\end{pmatrix}.

$$


**Step 2 — Compute uncentred $X^\top X$.**


$$

X^\top X=
\begin{pmatrix}
10&10\\
1&-1
\end{pmatrix}
\begin{pmatrix}
10&1\\
10&-1
\end{pmatrix}
=
\begin{pmatrix}
200&0\\
0&2
\end{pmatrix}.

$$


The top uncentred direction is


$$

\begin{pmatrix}1\\0\end{pmatrix}.

$$


**Step 3 — Compute the mean.**


$$

\hat{\mu}=\frac12
\left(
\begin{pmatrix}10\\1\end{pmatrix}
+
\begin{pmatrix}10\\-1\end{pmatrix}
\right)
=
\begin{pmatrix}10\\0\end{pmatrix}.

$$


**Step 4 — Centre the data.**


$$

\tilde{x}_1=\begin{pmatrix}10\\1\end{pmatrix}-\begin{pmatrix}10\\0\end{pmatrix}
=
\begin{pmatrix}0\\1\end{pmatrix},

$$



$$

\tilde{x}_2=\begin{pmatrix}10\\-1\end{pmatrix}-\begin{pmatrix}10\\0\end{pmatrix}
=
\begin{pmatrix}0\\-1\end{pmatrix}.

$$


So


$$

\tilde{X}=\begin{pmatrix}
0&1\\
0&-1
\end{pmatrix}.

$$


**Step 5 — Compute centred $\tilde{X}^\top\tilde{X}$.**


$$

\tilde{X}^\top\tilde{X}
=
\begin{pmatrix}
0&0\\
1&-1
\end{pmatrix}
\begin{pmatrix}
0&1\\
0&-1
\end{pmatrix}
=
\begin{pmatrix}
0&0\\
0&2
\end{pmatrix}.

$$


The top centred direction is


$$

\begin{pmatrix}0\\1\end{pmatrix}.

$$


**Answer.**  
Uncentred PCA incorrectly chooses the large mean direction $(1,0)^\top$. Proper centred PCA chooses the actual variation direction $(0,1)^\top$. The disagreement happens because PCA must be applied after recentring.

---

## Q26. Gram-matrix eigenvectors are not data-space principal directions

Use the centred one-dimensional data


$$

x_1=-1,
\qquad
x_2=0,
\qquad
x_3=1.

$$


The centred Gram matrix from Q18 has top eigenvector


$$

\alpha_1=\frac1{\sqrt2}
\begin{pmatrix}-1\\0\\1\end{pmatrix}.

$$


Explain why $\alpha_1$ is not the same kind of object as the data-space principal direction.

### Solution

**Step 1 — Identify the data-space dimension.**  
The original data are one-dimensional, so data-space directions live in


$$

\mathbb{R}^1.

$$


A data-space principal direction is just a scalar direction, such as $+1$ or $-1$.

**Step 2 — Identify the Gram eigenvector dimension.**  
There are $N=3$ data points. The Gram matrix is $3\times3$, so its eigenvectors live in


$$

\mathbb{R}^3.

$$


Indeed,


$$

\alpha_1=\frac1{\sqrt2}
\begin{pmatrix}-1\\0\\1\end{pmatrix}\in\mathbb{R}^3.

$$


**Step 3 — State the mismatch.**  
A vector in $\mathbb{R}^3$ cannot itself be a direction in $\mathbb{R}^1$.

**Step 4 — Interpret it correctly.**  
The Gram eigenvector gives coefficients over training points. It is related to a principal direction, but it is not literally the data-space direction.

**Answer.**  
The Gram eigenvector $\alpha_1$ lives in sample-index space $\mathbb{R}^N$, not in original data space. This is exactly the warning the lecture gives before moving to Kernel PCA.

---

## Q27. Equal eigenvalues make PCA directions non-unique

Suppose centred data gives


$$

X^\top X=
\begin{pmatrix}
4&0\\
0&4
\end{pmatrix}.

$$


For $k=1$, can PCA uniquely choose one top direction?

### Solution

**Step 1 — Compute the eigenvalues.**  
The matrix is diagonal, so


$$

\lambda_1=4,
\qquad
\lambda_2=4.

$$


**Step 2 — Notice the tie.**  
The top eigenvalue is not unique because both eigenvalues are equal.

**Step 3 — Interpret geometrically.**  
The variance is the same along every direction in the two-dimensional subspace. There is no single preferred maximum-variance direction.

**Step 4 — State the PCA consequence.**  
For $k=1$, PCA may return any unit vector in this two-dimensional eigenspace, depending on implementation or numerical convention.

**Answer.**  
No. The top direction is not unique. Equal eigenvalues mean the corresponding principal subspace is identifiable, but an individual basis vector inside that subspace is arbitrary.

---

## Q28. Symmetry alone is not enough for a kernel

Consider


$$

\kappa(x,y)=-xy

$$


on $\mathbb{R}$. Show that it is symmetric but not a valid kernel under the lecture definition.

### Solution

**Step 1 — Check symmetry.**


$$

\kappa(x,y)=-xy.

$$


Since $xy=yx$,


$$

\kappa(x,y)=-xy=-yx=\kappa(y,x).

$$


So the function is symmetric.

**Step 2 — Recall the positive semi-definite condition.**  
For every choice of points and coefficients,


$$

\sum_i\sum_j c_ic_j\kappa(x_i,x_j)\geq0.

$$


**Step 3 — Find one counterexample.**  
Take one point


$$

x_1=1

$$


and one coefficient


$$

c_1=1.

$$


Then the PSD sum is


$$

c_1c_1\kappa(x_1,x_1)=1\cdot1\cdot\kappa(1,1).

$$


But


$$

\kappa(1,1)=-(1)(1)=-1.

$$


So


$$

\sum_i\sum_j c_ic_j\kappa(x_i,x_j)=-1<0.

$$


**Answer.**  
$\kappa(x,y)=-xy$ is symmetric, but it is not positive semi-definite. Therefore it is not a kernel.

---

## Q29. Kernel PCA eigenvectors are coefficient vectors, not visible feature-space axes

In Q19, Kernel PCA produced the centred kernel matrix eigenvector


$$

\alpha_1=\frac1{\sqrt2}
\begin{pmatrix}-1\\0\\1\end{pmatrix}.

$$


Explain what this vector represents and why it should not be treated as a vector in the original data space.

### Solution

**Step 1 — Identify the matrix being diagonalised.**  
Kernel PCA diagonalises the centred kernel matrix


$$

\tilde{K}\in\mathbb{R}^{N\times N}.

$$


Here $N=3$, so its eigenvectors are in $\mathbb{R}^3$.

**Step 2 — Identify what $\alpha_1$ indexes.**  
The entries of $\alpha_1$ correspond to the training points:


$$

x_1,
\quad
x_2,
\quad
x_3.

$$


So $\alpha_1$ is a coefficient vector over examples.

**Step 3 — Connect to the feature-space direction.**  
The corresponding direction in feature/Hilbert space is represented indirectly as a weighted combination of embedded data points:


$$

\sum_{i=1}^{N}\alpha_{1i}\phi(x_i).

$$


**Step 4 — State the warning.**  
The vector $\alpha_1$ is not itself an input-space vector such as $x\in\mathbb{R}^d$. It is also not directly a coordinate vector in the possibly high-dimensional or infinite-dimensional Hilbert space.

**Answer.**  
$\alpha_1$ is an $N$-dimensional coefficient vector. It represents a feature-space principal direction indirectly through training-point weights. Treating it as a data-space principal axis is a category error.

---

## Q30. Rank deficiency: not every singular value has to be positive

Consider the centred data matrix


$$

X=
\begin{pmatrix}
1&0\\
2&0
\end{pmatrix}.

$$


Compute $X^\top X$, its eigenvalues, and the singular values of $X$. What edge case does this reveal?

### Solution

**Step 1 — Compute $X^\top X$.**


$$

X^\top=
\begin{pmatrix}
1&2\\
0&0
\end{pmatrix}.

$$


So


$$

X^\top X=
\begin{pmatrix}
1&2\\
0&0
\end{pmatrix}
\begin{pmatrix}
1&0\\
2&0
\end{pmatrix}
=
\begin{pmatrix}
5&0\\
0&0
\end{pmatrix}.

$$


**Step 2 — Read off eigenvalues.**  
Because the matrix is diagonal,


$$

\lambda_1=5,
\qquad
\lambda_2=0.

$$


**Step 3 — Convert eigenvalues to singular values.**  
The lecture relation is


$$

\lambda_i=\sigma_i^2.

$$


So


$$

\sigma_1=\sqrt5,
\qquad
\sigma_2=0.

$$


**Step 4 — Interpret the edge case.**  
All data lie along the first coordinate direction. There is no variation in the second coordinate direction.

**Answer.**


$$

X^\top X=
\begin{pmatrix}5&0\\0&0\end{pmatrix},
\qquad
\lambda_1=5,
\lambda_2=0,
\qquad
\sigma_1=\sqrt5,
\sigma_2=0.

$$


This is the rank-deficient case. Any statement that all singular values are positive silently assumes full rank; in practice zero singular values can occur.

---

# Final self-test checklist

Before the exam, you should be able to do these without looking:

- Write the ICA model $x=As$, identify shapes, and say what is observed/unknown.
- Compute $x=As$ and $\hat{s}=Wx$.
- State the ICA assumptions and reject Gaussian, nonlinear, underdetermined, or noisy cases for the clean lecture setup.
- Compute kurtosis minus 3 and classify the result.
- Build $X$, $X^\top X$, $XX^\top$, $G$, $K$, $\tilde{G}$, and $\tilde{K}$.
- Run PCA using covariance/EVD and using SVD.
- Explain why $X^\top X$ and $XX^\top$ have eigenvalues related to squared singular values.
- Use the polynomial kernel $(1+x^\top y)^2$ instead of explicitly expanding $\phi(x)$.
- Prove a feature-map inner product is a kernel.
- Explain why centred Gram/kernel eigenvectors live in $\mathbb{R}^N$, not directly in data space.
- Name the hard failure modes: no centering, Gaussian ICA sources, nonlinear mixtures, too few observations, additive noise, non-PSD “kernels,” equal eigenvalues, and rank deficiency.
