---
subject: COMP64501
chapter: 23
title: "Linear Models — Question Bank"
language: en
---

# COMP64501 Chapter 3 — Linear Models: Worked Question Bank

Built from the uploaded lecture sheet **“COMP64501 Chapter 3 - Linear Models”**. The sheet’s running example is the Olympic male 100m sprint-time regression problem, so this bank reuses that example with small centred/scaled toy data where actual slide data values were not provided.

## Task types identified from the sheet

The computational task types covered by the sheet are:

1. Evaluating linear-model predictions, including intercept/bias terms and vector form.
2. Evaluating Gaussian pdfs and Gaussian regression conditional densities.
3. Building iid likelihoods, log-likelihoods, negative log-likelihoods, and residual sum of squares.
4. Using the equivalence between Gaussian maximum likelihood and least-squares fitting under the stated assumptions.
5. Constructing design matrices and solving the normal equation.
6. Estimating the Gaussian noise variance using the average squared residual.
7. Transforming inputs with basis functions, especially polynomial basis functions.
8. Performing gradient descent, batch gradient descent, stochastic gradient descent, and mini-batch updates.
9. Checking learning-rate behaviour, feature scaling, and Robbins-Monro conditions.
10. Computing regularisation penalties and using the ridge closed-form solution.
11. Computing Bernoulli/logistic regression probabilities, decision boundaries, cross-entropy, and logistic gradients.
12. Diagnosing hard edge cases: singular normal equations, excessive basis dimensions, variance assumptions breaking RSS equivalence, unstable gradient descent, badly scaled features, and regularisers disagreeing.

Deliberately **not** included because they are not in the sheet: Bayesian linear regression, kernels, classification metrics such as precision/recall/ROC, multiclass softmax, neural networks, or detailed Newton/conjugate-gradient derivations.

---

# Section A — Mechanical / single-step drills

These are quick drills for the atomic calculations that later questions combine.

## Questions

### A1. Olympic running example: straight-line prediction

The Olympic sprint-time model is written using a centred year variable


$$

t = \frac{\text{year} - 1900}{100}.

$$


Suppose the fitted model is


$$

f(t,\mathbf{w}) = w_0 + w_1t,
\qquad
w_0 = 12.0,
\quad
w_1 = -2.0.

$$


Compute the predicted 100m time for:

1. year 2000,
2. year 2012.

### A2. Vector-form linear prediction with a bias term

Let the raw input be


$$

(x_1,x_2)=(3,-2).

$$


After adding the bias coordinate,


$$

\mathbf{x}=[1,3,-2]^\top.

$$


Given


$$

\mathbf{w}=[0.5,2,-1]^\top,

$$


compute


$$

f(\mathbf{x},\mathbf{w})=\mathbf{w}^\top\mathbf{x}.

$$


### A3. Gaussian pdf value

For


$$

y=11,\qquad \mu=10,\qquad \sigma^2=4,

$$


compute


$$

p(y\mid \mu,\sigma^2)
=
\frac{1}{\sqrt{2\pi\sigma^2}}
\exp\left\{-\frac{(y-\mu)^2}{2\sigma^2}\right\}.

$$


Give the answer to four decimal places.

### A4. Gaussian regression conditional density

A Gaussian regression model has


$$

\mathbf{w}=[2,0.5]^\top,
\qquad
\mathbf{x}=[1,4]^\top,
\qquad
\sigma^2=1.

$$


Compute the density value


$$

p(y=5\mid \mathbf{x},\mathbf{w},\sigma^2).

$$


### A5. Residuals and RSS

For three observations, suppose the true outputs are


$$

\mathbf{y}=[3,5,4]^\top

$$


and the model predictions are


$$

\hat{\mathbf{y}}=[2.5,5.5,3.0]^\top.

$$


Compute the residual vector and the residual sum of squares.

### A6. Polynomial basis prediction

For a one-dimensional input with polynomial basis functions up to degree $M=3$, use


$$

\boldsymbol{\phi}(x)=[1,x,x^2,x^3]^\top.

$$


Given


$$

x=2,
\qquad
\mathbf{w}=[1,-1,0.5,0.25]^\top,

$$


compute


$$

f(x,\mathbf{w})=\mathbf{w}^\top\boldsymbol{\phi}(x).

$$


### A7. Exponential basis function value

The sheet gives exponential basis functions of the form


$$

\phi_i(x)=\exp\left\{-\frac{(x-\mu_i)^2}{2s^2}\right\}.

$$


Compute $\phi_i(x)$ for


$$

x=3,
\qquad
\mu_i=1,
\qquad
s=2.

$$


### A8. Logistic sigmoid value

Compute


$$

\sigma(z)=\frac{1}{1+\exp(-z)}

$$


for


$$

z=\log 3.

$$


Then state the predicted class using threshold $0.5$, assuming class $1$ is predicted when $\sigma(z)>0.5$.

### A9. Bernoulli probability in one-line form

For a Bernoulli model with


$$

\mu=P(Y=1)=0.7,

$$


use


$$

p(Y=y)=\mu^y(1-\mu)^{1-y}

$$


to compute:

1. $p(Y=1)$,
2. $p(Y=0)$.

### A10. Single-point cross-entropy

For logistic regression, a single data point contributes


$$

-\left[y\log p+(1-y)\log(1-p)\right]

$$


to the negative log-likelihood, where


$$

p=\sigma(\mathbf{w}^\top\mathbf{x}).

$$


Compute the contribution when:

1. $y=1$ and $p=0.8$,
2. $y=0$ and $p=0.8$.

### A11. Regularisation penalty value

The sheet writes the elastic-net style regularisation term as


$$

R(\mathbf{w})
=
\alpha\|\mathbf{w}\|_1
+
(1-\alpha)\frac{1}{2}\|\mathbf{w}\|_2^2.

$$


For


$$

\mathbf{w}=[2,-1]^\top,
\qquad
\alpha=0.25,

$$


compute $R(\mathbf{w})$.

### A12. One batch-gradient update

For linear regression with objective


$$

E(\mathbf{w})=\frac{1}{2}\sum_{n=1}^N(y_n-\mathbf{w}^\top\mathbf{x}_n)^2,

$$


the batch gradient is


$$

\nabla E(\mathbf{w})=X^\top(X\mathbf{w}-\mathbf{y}).

$$


Given


$$

X=\begin{bmatrix}
1&0\\
1&1
\end{bmatrix},
\qquad
\mathbf{y}=\begin{bmatrix}1\\3\end{bmatrix},
\qquad
\mathbf{w}_0=\begin{bmatrix}0\\0\end{bmatrix},
\qquad
\eta=0.1,

$$


compute one batch-gradient-descent update.

---

## Worked solutions

### A1 solution

**Step 1 — Convert each year into the centred variable.**

For year 2000:


$$

t=\frac{2000-1900}{100}=1.

$$


For year 2012:


$$

t=\frac{2012-1900}{100}=1.12.

$$


**Step 2 — Apply the model.**

For 2000:


$$

f(t)=12.0-2.0(1)=10.0.

$$


For 2012:


$$

f(t)=12.0-2.0(1.12)=12.0-2.24=9.76.

$$


**Answer.** The model predicts **10.0 seconds** for 2000 and **9.76 seconds** for 2012.

### A2 solution

**Step 1 — Write the dot product.**


$$

\mathbf{w}^\top\mathbf{x}
=
0.5(1)+2(3)+(-1)(-2).

$$


**Step 2 — Compute each contribution.**


$$

0.5(1)=0.5,
\qquad
2(3)=6,
\qquad
(-1)(-2)=2.

$$


**Step 3 — Add them.**


$$

f(\mathbf{x},\mathbf{w})=0.5+6+2=8.5.

$$


**Answer.** $f(\mathbf{x},\mathbf{w})=8.5$.

### A3 solution

**Step 1 — Substitute the values.**


$$

p(11\mid 10,4)
=
\frac{1}{\sqrt{2\pi(4)}}
\exp\left\{-\frac{(11-10)^2}{2(4)}\right\}.

$$


**Step 2 — Compute the exponent.**


$$

-\frac{(11-10)^2}{2(4)}
=
-\frac{1}{8}
=-0.125.

$$


So


$$

\exp(-0.125)\approx 0.8825.

$$


**Step 3 — Compute the normalising constant.**


$$

\frac{1}{\sqrt{8\pi}}
\approx 0.1995.

$$


**Step 4 — Multiply.**


$$

p(11\mid 10,4)
\approx
0.1995\times 0.8825
\approx 0.1760.

$$


**Answer.** $p(11\mid 10,4)\approx 0.1760$.

### A4 solution

**Step 1 — Compute the regression mean.**


$$

\mathbf{w}^\top\mathbf{x}
=
2(1)+0.5(4)=2+2=4.

$$


So


$$

y\mid\mathbf{x},\mathbf{w},\sigma^2\sim\mathcal{N}(4,1).

$$


**Step 2 — Evaluate the Gaussian density at $y=5$.**


$$

p(5\mid\mathbf{x},\mathbf{w},1)
=
\frac{1}{\sqrt{2\pi}}
\exp\left\{-\frac{(5-4)^2}{2}\right\}.

$$


**Step 3 — Compute the value.**


$$

\frac{1}{\sqrt{2\pi}}\exp(-0.5)
\approx
0.3989\times 0.6065
\approx 0.2420.

$$


**Answer.** $p(y=5\mid\mathbf{x},\mathbf{w},\sigma^2)\approx 0.2420$.

### A5 solution

**Step 1 — Compute residuals.**

Using residuals


$$

r_n=y_n-\hat{y}_n,

$$


we get


$$

\mathbf{r}
=
\begin{bmatrix}
3-2.5\\
5-5.5\\
4-3.0
\end{bmatrix}
=
\begin{bmatrix}
0.5\\
-0.5\\
1.0
\end{bmatrix}.

$$


**Step 2 — Square the residuals.**


$$

0.5^2=0.25,
\qquad
(-0.5)^2=0.25,
\qquad
1.0^2=1.0.

$$


**Step 3 — Add them.**


$$

RSS=0.25+0.25+1.0=1.5.

$$


**Answer.** The residual vector is $[0.5,-0.5,1.0]^\top$ and $RSS=1.5$.

### A6 solution

**Step 1 — Build the polynomial feature vector.**

For $x=2$,


$$

\boldsymbol{\phi}(2)
=
[1,2,2^2,2^3]^\top
=
[1,2,4,8]^\top.

$$


**Step 2 — Compute the dot product.**


$$

\mathbf{w}^\top\boldsymbol{\phi}(2)
=
1(1)+(-1)(2)+0.5(4)+0.25(8).

$$


**Step 3 — Add the terms.**


$$

1-2+2+2=3.

$$


**Answer.** $f(2,\mathbf{w})=3$.

### A7 solution

**Step 1 — Substitute the values.**


$$

\phi_i(3)
=
\exp\left\{-\frac{(3-1)^2}{2(2)^2}\right\}.

$$


**Step 2 — Simplify the exponent.**


$$

(3-1)^2=4,
\qquad
2(2)^2=8.

$$


So


$$

-\frac{4}{8}=-0.5.

$$


**Step 3 — Evaluate the exponential.**


$$

\phi_i(3)=\exp(-0.5)\approx 0.6065.

$$


**Answer.** $\phi_i(3)\approx 0.6065$.

### A8 solution

**Step 1 — Substitute $z=\log 3$.**


$$

\sigma(\log 3)
=
\frac{1}{1+\exp(-\log 3)}.

$$


**Step 2 — Simplify the exponential.**


$$

\exp(-\log 3)=\frac{1}{3}.

$$


**Step 3 — Compute the sigmoid.**


$$

\sigma(\log 3)
=
\frac{1}{1+1/3}
=
\frac{1}{4/3}
=
\frac{3}{4}
=0.75.

$$


**Step 4 — Apply the threshold.**

Since


$$

0.75>0.5,

$$


the predicted class is class $1$.

**Answer.** $\sigma(\log 3)=0.75$, so the model predicts class $1$.

### A9 solution

**Step 1 — Compute $p(Y=1)$.**


$$

p(Y=1)=0.7^1(1-0.7)^0=0.7.

$$


**Step 2 — Compute $p(Y=0)$.**


$$

p(Y=0)=0.7^0(1-0.7)^1=0.3.

$$


**Answer.** $p(Y=1)=0.7$ and $p(Y=0)=0.3$.

### A10 solution

**Step 1 — Use the single-point cross-entropy expression.**


$$

CE=-\left[y\log p+(1-y)\log(1-p)\right].

$$


**Step 2 — Case 1: $y=1$, $p=0.8$.**


$$

CE=-\left[1\log(0.8)+0\log(0.2)\right]
=-\log(0.8)
\approx 0.2231.

$$


**Step 3 — Case 2: $y=0$, $p=0.8$.**


$$

CE=-\left[0\log(0.8)+1\log(0.2)\right]
=-\log(0.2)
\approx 1.6094.

$$


**Answer.** The contributions are approximately **0.2231** and **1.6094**. Predicting $p=0.8$ is much worse when the true class is $0$.

### A11 solution

**Step 1 — Compute the $\ell_1$ norm.**


$$

\|\mathbf{w}\|_1=|2|+|-1|=3.

$$


**Step 2 — Compute the squared $\ell_2$ term.**


$$

\frac{1}{2}\|\mathbf{w}\|_2^2
=
\frac{1}{2}(2^2+(-1)^2)
=
\frac{1}{2}(4+1)
=2.5.

$$


**Step 3 — Combine using $\alpha=0.25$.**


$$

R(\mathbf{w})
=
0.25(3)+(1-0.25)(2.5).

$$



$$

R(\mathbf{w})
=
0.75+0.75(2.5)
=
0.75+1.875
=2.625.

$$


**Answer.** $R(\mathbf{w})=2.625$.

### A12 solution

**Step 1 — Compute the current predictions.**


$$

X\mathbf{w}_0
=
\begin{bmatrix}
1&0\\
1&1
\end{bmatrix}
\begin{bmatrix}0\\0\end{bmatrix}
=
\begin{bmatrix}0\\0\end{bmatrix}.

$$


**Step 2 — Compute the prediction errors.**


$$

X\mathbf{w}_0-\mathbf{y}
=
\begin{bmatrix}0\\0\end{bmatrix}
-
\begin{bmatrix}1\\3\end{bmatrix}
=
\begin{bmatrix}-1\\-3\end{bmatrix}.

$$


**Step 3 — Compute the gradient.**


$$

\nabla E(\mathbf{w}_0)
=X^\top(X\mathbf{w}_0-\mathbf{y})
=
\begin{bmatrix}
1&1\\
0&1
\end{bmatrix}
\begin{bmatrix}-1\\-3\end{bmatrix}
=
\begin{bmatrix}-4\\-3\end{bmatrix}.

$$


**Step 4 — Apply the update.**


$$

\mathbf{w}_1
=
\mathbf{w}_0-\eta\nabla E(\mathbf{w}_0)
=
\begin{bmatrix}0\\0\end{bmatrix}
-0.1
\begin{bmatrix}-4\\-3\end{bmatrix}
=
\begin{bmatrix}0.4\\0.3\end{bmatrix}.

$$


**Answer.** After one batch update, $\mathbf{w}_1=[0.4,0.3]^\top$.

---

# Section B — Multi-condition checks

These questions ask you to check several conditions before choosing or applying a method.

## Questions

### B1. When is Gaussian maximum likelihood equivalent to minimising RSS?

For each scenario, decide whether minimising RSS is equivalent to maximising the Gaussian likelihood with respect to $\mathbf{w}$, using the sheet’s stated condition list.

| Scenario | Residual assumption | Variance | Independence | Optimising |
|---|---|---:|---:|---|
| A | Gaussian | fixed common $\sigma^2$ | iid | $\mathbf{w}$ |
| B | Gaussian | different $\sigma_n^2$ for different points | independent | $\mathbf{w}$ |
| C | Laplace / double-exponential | fixed common scale | iid | $\mathbf{w}$ |
| D | Gaussian | fixed common $\sigma^2$ | not independent | $\mathbf{w}$ |

### B2. Does the normal equation inverse exist?

For each design matrix, decide whether the normal-equation inverse $(X^\top X)^{-1}$ exists.


$$

X_1=
\begin{bmatrix}
1&0\\
1&1\\
1&2
\end{bmatrix},
\qquad
X_2=
\begin{bmatrix}
1&2\\
1&2\\
1&2
\end{bmatrix},
\qquad
X_3=
\begin{bmatrix}
1&0&1\\
1&1&2
\end{bmatrix}.

$$


### B3. Robbins-Monro learning-rate check

For stochastic gradient descent, the sheet gives the Robbins-Monro conditions:


$$

\sum_{k=1}^{\infty}\eta_k=\infty,
\qquad
\sum_{k=1}^{\infty}\eta_k^2<\infty.

$$


For each schedule, decide whether it satisfies both conditions.

1. $\eta_k=1/k$
2. $\eta_k=1/k^{0.4}$
3. $\eta_k=1/k^2$
4. $\eta_k=0.1$
5. $\eta_k=1/(10+k)^{0.75}$

### B4. Sampling with replacement versus without replacement

A dataset has $N=8$ examples and mini-batch size $|S|=2$.

1. If sampling **without replacement**, how many mini-batches are in one epoch?
2. If sampling **with replacement**, does four mini-batches guarantee that every example has been used exactly once?
3. Why is the word “stochastic” appropriate?

### B5. Logistic decision boundary check

A logistic regression model uses the augmented input


$$

\mathbf{x}=[1,x_1,x_2]^\top

$$


and weight vector


$$

\mathbf{w}=[-3,1,2]^\top.

$$


The decision threshold is $0.5$. For each raw point, compute $z=\mathbf{w}^\top\mathbf{x}$, compute or identify the probability $\sigma(z)$, and classify if possible using:

- class $1$ if $\sigma(z)>0.5$,
- class $0$ if $\sigma(z)<0.5$.

Points:


$$

A=(1,1),
\qquad
B=(3,1),
\qquad
C=(0,1).

$$


### B6. Full-batch gradient versus mini-batch average

Suppose four per-example gradients at an iteration are:


$$

\mathbf{g}_1=[2,0]^\top,
\quad
\mathbf{g}_2=[0,2]^\top,
\quad
\mathbf{g}_3=[2,2]^\top,
\quad
\mathbf{g}_4=[4,0]^\top.

$$


1. Compute the full **sum** gradient.
2. Compute the full **average** gradient.
3. For mini-batch $S=\{1,3\}$, compute the mini-batch average gradient.
4. Explain why averaging helps when batch size changes.

### B7. Match each method to its computational issue

For each issue, choose the method or warning from the sheet that addresses it.

Issues:

1. $X^\top X$ is expensive to invert because there are many features.
2. The dataset is too large to fit in memory.
3. Features have very different scales.
4. A model overfits because it has too much flexibility.
5. A binary target must be modelled probabilistically.

Available choices:

- batch gradient descent,
- stochastic / mini-batch gradient descent,
- feature normalisation,
- regularisation,
- logistic regression with Bernoulli likelihood.

---

## Worked solutions

### B1 solution

**Step 1 — Recall the sheet’s equivalence condition.**

The sheet states that Gaussian maximum likelihood and least-squares/RSS minimisation match when residuals are:

1. iid,
2. Gaussian,
3. fixed variance,
4. and we are optimising $\mathbf{w}$.

**Step 2 — Check scenario A.**

Scenario A has Gaussian residuals, fixed common variance, iid observations, and optimisation over $\mathbf{w}$.

So all listed conditions are satisfied.

**Result for A:** yes, RSS minimisation is equivalent to Gaussian maximum likelihood for $\mathbf{w}$.

**Step 3 — Check scenario B.**

Scenario B has Gaussian residuals, but the variance changes across points:


$$

\sigma_1^2,\sigma_2^2,\ldots,\sigma_N^2.

$$


The “fixed variance” condition is broken.

**Result for B:** no, ordinary unweighted RSS is not the same objective.

**Step 4 — Check scenario C.**

Scenario C uses a Laplace residual distribution, not a Gaussian residual distribution.

**Result for C:** no, the Gaussian likelihood assumption is broken.

**Step 5 — Check scenario D.**

Scenario D has Gaussian residuals and fixed variance, but not independent observations.

The iid assumption is broken.

**Result for D:** no, the sheet’s iid product likelihood is not valid as written.

**Answer.** Only scenario **A** satisfies the sheet’s conditions.

### B2 solution

**Step 1 — Check $X_1$.**


$$

X_1^\top X_1
=
\begin{bmatrix}
1&1&1\\
0&1&2
\end{bmatrix}
\begin{bmatrix}
1&0\\
1&1\\
1&2
\end{bmatrix}
=
\begin{bmatrix}
3&3\\
3&5
\end{bmatrix}.

$$


Its determinant is


$$

3(5)-3(3)=15-9=6.

$$


Since $6\neq 0$, $X_1^\top X_1$ is non-singular.

**Result for $X_1$:** inverse exists.

**Step 2 — Check $X_2$.**


$$

X_2^\top X_2
=
\begin{bmatrix}
3&6\\
6&12
\end{bmatrix}.

$$


The determinant is


$$

3(12)-6(6)=36-36=0.

$$


So $X_2^\top X_2$ is singular.

**Result for $X_2$:** inverse does not exist.

**Step 3 — Check $X_3$.**

$X_3$ has shape $2\times 3$. It has only two rows but three columns.

So its column rank is at most $2$, which is less than the number of columns $3$. Therefore $X_3^\top X_3$ cannot be full rank.

**Result for $X_3$:** inverse does not exist.

**Answer.** $(X^\top X)^{-1}$ exists for $X_1$ only.

### B3 solution

**Step 1 — Use the p-series rules.**

A series


$$

\sum_{k=1}^{\infty}\frac{1}{k^p}

$$


converges if $p>1$, and diverges if $p\leq 1$.

**Step 2 — Check $\eta_k=1/k$.**


$$

\sum \eta_k=\sum \frac{1}{k}

$$


diverges, while


$$

\sum \eta_k^2=\sum \frac{1}{k^2}

$$


converges.

**Result:** satisfies both Robbins-Monro conditions.

**Step 3 — Check $\eta_k=1/k^{0.4}$.**


$$

\sum \eta_k=\sum \frac{1}{k^{0.4}}

$$


diverges, but


$$

\sum \eta_k^2
=
\sum \frac{1}{k^{0.8}}

$$


also diverges.

**Result:** fails the second condition.

**Step 4 — Check $\eta_k=1/k^2$.**


$$

\sum \eta_k=\sum \frac{1}{k^2}

$$


converges.

The first condition requires this sum to diverge.

**Result:** fails the first condition.

**Step 5 — Check $\eta_k=0.1$.**


$$

\sum \eta_k=\sum 0.1=\infty,

$$


but


$$

\sum \eta_k^2=\sum 0.01=\infty.

$$


**Result:** fails the second condition.

**Step 6 — Check $\eta_k=1/(10+k)^{0.75}$.**

This has the form given in the sheet:


$$

\eta_k=\frac{1}{(\tau_0+k)^\kappa}

$$


with


$$

\tau_0=10,
\qquad
\kappa=0.75.

$$


Since


$$

0.5<0.75\leq 1,

$$


it satisfies the Robbins-Monro pattern described in the sheet.

**Answer.** Schedules 1 and 5 satisfy both conditions. Schedules 2, 3, and 4 fail.

### B4 solution

**Step 1 — Compute mini-batches per epoch without replacement.**

With $N=8$ and mini-batch size $2$, one pass through all examples contains


$$

\frac{8}{2}=4

$$


mini-batches.

**Step 2 — Interpret sampling without replacement.**

Without replacement, examples are not reused inside the epoch. So four mini-batches of size two use all eight examples exactly once.

**Step 3 — Interpret sampling with replacement.**

With replacement, each draw can choose an example already seen. Therefore, four mini-batches of size two gives eight draws, but those draws might repeat examples and miss others.

So four mini-batches does **not** guarantee every example has been used exactly once.

**Step 4 — Explain “stochastic.”**

The gradient depends on which subset is chosen. If the subset is random, the gradient estimate is random.

**Answer.** Without replacement: four mini-batches per epoch. With replacement: four mini-batches does not guarantee full coverage. The method is stochastic because the gradient depends on the randomly chosen subset.

### B5 solution

**Step 1 — Write the linear score.**

For augmented input $\mathbf{x}=[1,x_1,x_2]^\top$,


$$

z=\mathbf{w}^\top\mathbf{x}
=-3+x_1+2x_2.

$$


The decision boundary is where


$$

z=0.

$$


**Step 2 — Point A: $(1,1)$.**


$$

z_A=-3+1+2(1)=0.

$$



$$

\sigma(0)=0.5.

$$


This point lies exactly on the decision boundary.

Using the strict rule $>0.5$ versus $<0.5$, it is a tie rather than a strict class assignment.

**Step 3 — Point B: $(3,1)$.**


$$

z_B=-3+3+2(1)=2.

$$



$$

\sigma(2)=\frac{1}{1+e^{-2}}\approx 0.881.

$$


Since $0.881>0.5$, predict class $1$.

**Step 4 — Point C: $(0,1)$.**


$$

z_C=-3+0+2(1)=-1.

$$



$$

\sigma(-1)\approx 0.269.

$$


Since $0.269<0.5$, predict class $0$.

**Answer.** A is on the boundary, B is class $1$, and C is class $0$.

### B6 solution

**Step 1 — Compute the full sum gradient.**


$$

\mathbf{g}_{\text{sum}}
=
\mathbf{g}_1+\mathbf{g}_2+\mathbf{g}_3+\mathbf{g}_4.

$$



$$

\mathbf{g}_{\text{sum}}
=
\begin{bmatrix}2\\0\end{bmatrix}
+
\begin{bmatrix}0\\2\end{bmatrix}
+
\begin{bmatrix}2\\2\end{bmatrix}
+
\begin{bmatrix}4\\0\end{bmatrix}
=
\begin{bmatrix}8\\4\end{bmatrix}.

$$


**Step 2 — Compute the full average gradient.**


$$

\mathbf{g}_{\text{avg}}
=
\frac{1}{4}\begin{bmatrix}8\\4\end{bmatrix}
=
\begin{bmatrix}2\\1\end{bmatrix}.

$$


**Step 3 — Compute the mini-batch average for $S=\{1,3\}$.**


$$

\mathbf{g}_S
=
\frac{1}{2}(\mathbf{g}_1+\mathbf{g}_3)
=
\frac{1}{2}
\left(
\begin{bmatrix}2\\0\end{bmatrix}
+
\begin{bmatrix}2\\2\end{bmatrix}
\right)
=
\frac{1}{2}
\begin{bmatrix}4\\2\end{bmatrix}
=
\begin{bmatrix}2\\1\end{bmatrix}.

$$


**Step 4 — Explain why averaging helps.**

If gradients were summed, doubling the mini-batch size would roughly double the gradient magnitude. Averaging makes the gradient scale less dependent on the number of examples in the batch.

**Answer.** Full sum: $[8,4]^\top$. Full average: $[2,1]^\top$. Mini-batch average for $S=\{1,3\}$: $[2,1]^\top$.

### B7 solution

**Step 1 — Match issue 1.**

If $X^\top X$ is expensive to invert because there are many features, the sheet suggests iterative optimisation rather than relying on the normal equation.

**Match:** batch gradient descent.

**Step 2 — Match issue 2.**

If the dataset is too large to fit in memory, full-batch gradients are impractical.

**Match:** stochastic / mini-batch gradient descent.

**Step 3 — Match issue 3.**

If features have very different scales, the sheet explicitly says to normalise features when using gradient descent.

**Match:** feature normalisation.

**Step 4 — Match issue 4.**

If a model overfits because it is too flexible, the sheet introduces regularisation to encourage simpler solutions.

**Match:** regularisation.

**Step 5 — Match issue 5.**

If the target is binary and should be modelled probabilistically, the sheet uses a Bernoulli likelihood with logistic regression.

**Match:** logistic regression with Bernoulli likelihood.

**Answer.**

| Issue | Match |
|---|---|
| 1 | batch gradient descent |
| 2 | stochastic / mini-batch gradient descent |
| 3 | feature normalisation |
| 4 | regularisation |
| 5 | logistic regression with Bernoulli likelihood |

---

# Section C — Building things from scratch

These examples combine the atomic calculations into full procedures.

## Questions

### C1. Fit a small Olympic-style straight-line model using the normal equation

Use the centred Olympic-year variable


$$

t=\frac{\text{year}-1900}{50}.

$$


Suppose the toy data are:

| Year | $t$ | 100m time $y$ |
|---:|---:|---:|
| 1900 | 0 | 12.0 |
| 1950 | 1 | 10.8 |
| 2000 | 2 | 10.3 |

Fit


$$

f(t,\mathbf{w})=w_0+w_1t

$$


using


$$

\mathbf{w}^*=(X^\top X)^{-1}X^\top\mathbf{y}.

$$


Then predict the time for year 2010.

### C2. Estimate $\sigma^{2*}$ from the fitted model in C1

Using the fitted model from C1, compute


$$

\sigma^{2*}
=
\frac{1}{N}(\mathbf{y}-X\mathbf{w}^*)^\top(\mathbf{y}-X\mathbf{w}^*).

$$


### C3. Build a polynomial design matrix and solve exactly

Use polynomial basis functions up to degree $M=2$:


$$

\boldsymbol{\phi}(x)=[1,x,x^2]^\top.

$$


Fit the data

| $x$ | $y$ |
|---:|---:|
| -1 | 2 |
| 0 | 1 |
| 1 | 2 |

by solving the equations directly for


$$

f(x,\mathbf{w})=w_0+w_1x+w_2x^2.

$$


### C4. Compare linear basis and quadratic basis on the same data

Using the data from C3, fit the best degree-1 model


$$

f(x,\mathbf{w})=w_0+w_1x

$$


by the normal equation. Compute its RSS. Then compare it with the degree-2 model from C3.

### C5. Two steps of batch gradient descent

Use


$$

X=
\begin{bmatrix}
1&0\\
1&2
\end{bmatrix},
\qquad
\mathbf{y}=\begin{bmatrix}1\\5\end{bmatrix},
\qquad
\mathbf{w}_0=\begin{bmatrix}0\\0\end{bmatrix},
\qquad
\eta=0.1.

$$


For the squared-error objective,


$$

\nabla E(\mathbf{w})=X^\top(X\mathbf{w}-\mathbf{y}).

$$


Compute $\mathbf{w}_1$ and $\mathbf{w}_2$.

### C6. One mini-batch gradient update

Use the data


$$

\mathbf{x}_1=[1,0]^\top,\quad y_1=1,

$$



$$

\mathbf{x}_2=[1,2]^\top,\quad y_2=5,

$$



$$

\mathbf{x}_3=[1,1]^\top,\quad y_3=3.

$$


At the current parameter value


$$

\mathbf{w}=[0.6,1.0]^\top,

$$


use mini-batch


$$

S=\{2,3\}

$$


and learning rate


$$

\eta=0.2.

$$


The per-example gradient is


$$

\mathbf{g}_i=(\mathbf{w}^\top\mathbf{x}_i-y_i)\mathbf{x}_i.

$$


Compute one mini-batch update using the average gradient.

### C7. Ridge regression closed-form solution

Given


$$

X=
\begin{bmatrix}
1&0\\
1&1
\end{bmatrix},
\qquad
\mathbf{y}=\begin{bmatrix}1\\3\end{bmatrix},
\qquad
\lambda=1,

$$


compute the ridge solution


$$

\mathbf{w}^*=(X^\top X+\lambda I)^{-1}X^\top\mathbf{y}.

$$


### C8. Logistic regression probability, NLL, gradient, and update

Use


$$

X=
\begin{bmatrix}
1&0\\
1&2
\end{bmatrix},
\qquad
\mathbf{y}=\begin{bmatrix}0\\1\end{bmatrix},
\qquad
\mathbf{w}_0=\begin{bmatrix}0\\0\end{bmatrix}.

$$


For logistic regression:


$$

\boldsymbol{\sigma}
=
[
\sigma(\mathbf{w}^\top\mathbf{x}_1),
\sigma(\mathbf{w}^\top\mathbf{x}_2)
]^\top,

$$



$$

NLL(\mathbf{w})
=-\sum_{n=1}^2
\left[y_n\log \sigma_n+(1-y_n)\log(1-\sigma_n)\right],

$$



$$

\nabla NLL(\mathbf{w})=X^\top(\boldsymbol{\sigma}-\mathbf{y}).

$$


Compute:

1. $\boldsymbol{\sigma}$ at $\mathbf{w}_0$,
2. $NLL(\mathbf{w}_0)$,
3. the gradient,
4. one gradient descent update with $\eta=0.5$.

### C9. Regularised logistic regression gradient update

Continue from C8, but now use


$$

\mathbf{w}=[0,0.5]^\top,
\qquad
\lambda=0.2.

$$


Use ridge-regularised logistic objective


$$

NLL(\mathbf{w})+\frac{\lambda}{2}\mathbf{w}^\top\mathbf{w}.

$$


The gradient is


$$

X^\top(\boldsymbol{\sigma}-\mathbf{y})+\lambda\mathbf{w}.

$$


Compute one update with $\eta=0.5$.

### C10. Compute Gaussian linear-regression NLL from RSS

For a fitted Gaussian linear-regression model, suppose


$$

N=3,
\qquad
RSS=2,
\qquad
\sigma^2=1.

$$


Compute


$$

NLL(\mathbf{w},\sigma^2)
=
\frac{N}{2}\log(2\pi)
+
\frac{N}{2}\log\sigma^2
+
\frac{1}{2\sigma^2}RSS.

$$


---

## Worked solutions

### C1 solution

**Step 1 — Build the design matrix.**

For the model


$$

f(t,\mathbf{w})=w_0+w_1t,

$$


each row is $[1,t]$. Therefore


$$

X=
\begin{bmatrix}
1&0\\
1&1\\
1&2
\end{bmatrix},
\qquad
\mathbf{y}=
\begin{bmatrix}
12.0\\
10.8\\
10.3
\end{bmatrix}.

$$


**Step 2 — Compute $X^\top X$.**


$$

X^\top X
=
\begin{bmatrix}
1&1&1\\
0&1&2
\end{bmatrix}
\begin{bmatrix}
1&0\\
1&1\\
1&2
\end{bmatrix}
=
\begin{bmatrix}
3&3\\
3&5
\end{bmatrix}.

$$


**Step 3 — Compute $X^\top\mathbf{y}$.**


$$

X^\top\mathbf{y}
=
\begin{bmatrix}
1&1&1\\
0&1&2
\end{bmatrix}
\begin{bmatrix}
12.0\\
10.8\\
10.3
\end{bmatrix}
=
\begin{bmatrix}
33.1\\
31.4
\end{bmatrix}.

$$


**Step 4 — Invert $X^\top X$.**

For


$$

A=\begin{bmatrix}3&3\\3&5\end{bmatrix},

$$


the determinant is


$$

3(5)-3(3)=6.

$$


So


$$

A^{-1}
=
\frac{1}{6}
\begin{bmatrix}
5&-3\\
-3&3
\end{bmatrix}.

$$


**Step 5 — Compute $\mathbf{w}^*$.**


$$

\mathbf{w}^*
=
\frac{1}{6}
\begin{bmatrix}
5&-3\\
-3&3
\end{bmatrix}
\begin{bmatrix}
33.1\\
31.4
\end{bmatrix}.

$$


First component:


$$

w_0^*=rac{1}{6}[5(33.1)-3(31.4)]
=rac{165.5-94.2}{6}
=11.8833.

$$


Second component:


$$

w_1^*=rac{1}{6}[-3(33.1)+3(31.4)]
=rac{-99.3+94.2}{6}
=-0.85.

$$


So


$$

\mathbf{w}^*\approx[11.8833,-0.85]^\top.

$$


**Step 6 — Convert year 2010 to $t$.**


$$

t=\frac{2010-1900}{50}=\frac{110}{50}=2.2.

$$


**Step 7 — Predict.**


$$

f(2.2)=11.8833-0.85(2.2)=11.8833-1.87=10.0133.

$$


**Answer.** The fitted model is approximately


$$

f(t)=11.8833-0.85t.

$$


The predicted 2010 sprint time is approximately **10.01 seconds**.

### C2 solution

**Step 1 — Recall the fitted model from C1.**


$$

\mathbf{w}^*=[11.8833,-0.85]^\top.

$$


So the predictions at $t=0,1,2$ are:


$$

\hat{y}_1=11.8833,

$$



$$

\hat{y}_2=11.8833-0.85=11.0333,

$$



$$

\hat{y}_3=11.8833-1.70=10.1833.

$$


**Step 2 — Compute residuals.**


$$

r_1=12.0-11.8833=0.1167,

$$



$$

r_2=10.8-11.0333=-0.2333,

$$



$$

r_3=10.3-10.1833=0.1167.

$$


**Step 3 — Compute RSS.**


$$

RSS
=0.1167^2+(-0.2333)^2+0.1167^2
\approx 0.0817.

$$


**Step 4 — Divide by $N$.**

The maximum-likelihood variance estimate in the sheet is


$$

\sigma^{2*}=\frac{1}{N}RSS.

$$


Here $N=3$, so


$$

\sigma^{2*}=\frac{0.0817}{3}\approx 0.0272.

$$


**Answer.** $\sigma^{2*}\approx 0.0272$.

### C3 solution

**Step 1 — Write the model equations.**

The model is


$$

f(x)=w_0+w_1x+w_2x^2.

$$


For $x=-1$, $y=2$:


$$

w_0-w_1+w_2=2.

$$


For $x=0$, $y=1$:


$$

w_0=1.

$$


For $x=1$, $y=2$:


$$

w_0+w_1+w_2=2.

$$


**Step 2 — Use the middle equation.**


$$

w_0=1.

$$


**Step 3 — Substitute $w_0=1$ into the other equations.**


$$

1-w_1+w_2=2
\quad\Rightarrow\quad
-w_1+w_2=1.

$$



$$

1+w_1+w_2=2
\quad\Rightarrow\quad
w_1+w_2=1.

$$


**Step 4 — Add the two equations.**


$$

(-w_1+w_2)+(w_1+w_2)=1+1.

$$



$$

2w_2=2
\quad\Rightarrow\quad
w_2=1.

$$


**Step 5 — Solve for $w_1$.**


$$

w_1+w_2=1
\quad\Rightarrow\quad
w_1+1=1
\quad\Rightarrow\quad
w_1=0.

$$


**Answer.**


$$

\mathbf{w}=[1,0,1]^\top,
\qquad
f(x)=1+x^2.

$$


### C4 solution

**Step 1 — Build the degree-1 design matrix.**

For $x=-1,0,1$, using rows $[1,x]$,


$$

X=
\begin{bmatrix}
1&-1\\
1&0\\
1&1
\end{bmatrix},
\qquad
\mathbf{y}=
\begin{bmatrix}
2\\1\\2
\end{bmatrix}.

$$


**Step 2 — Compute $X^\top X$.**


$$

X^\top X
=
\begin{bmatrix}
3&0\\
0&2
\end{bmatrix}.

$$


**Step 3 — Compute $X^\top\mathbf{y}$.**


$$

X^\top\mathbf{y}
=
\begin{bmatrix}
1&1&1\\
-1&0&1
\end{bmatrix}
\begin{bmatrix}
2\\1\\2
\end{bmatrix}
=
\begin{bmatrix}
5\\0
\end{bmatrix}.

$$


**Step 4 — Solve the normal equation.**


$$

\mathbf{w}^*
=(X^\top X)^{-1}X^\top\mathbf{y}
=
\begin{bmatrix}
1/3&0\\
0&1/2
\end{bmatrix}
\begin{bmatrix}
5\\0
\end{bmatrix}
=
\begin{bmatrix}
5/3\\0
\end{bmatrix}.

$$


So the best degree-1 model is


$$

f(x)=\frac{5}{3}.

$$


**Step 5 — Compute predictions.**

All three predictions are


$$

\hat{y}=5/3\approx 1.6667.

$$


**Step 6 — Compute residuals.**


$$

2-5/3=1/3,

$$



$$

1-5/3=-2/3,

$$



$$

2-5/3=1/3.

$$


**Step 7 — Compute RSS.**


$$

RSS
=\left(\frac{1}{3}\right)^2
+\left(-\frac{2}{3}\right)^2
+\left(\frac{1}{3}\right)^2
=
\frac{1}{9}+\frac{4}{9}+\frac{1}{9}
=
\frac{6}{9}
=
\frac{2}{3}.

$$


**Step 8 — Compare with the degree-2 model.**

From C3, the degree-2 model is


$$

f(x)=1+x^2.

$$


It fits all three points exactly, so its RSS is


$$

0.

$$


**Answer.** The degree-1 model has $RSS=2/3$, while the degree-2 basis model has $RSS=0$. The basis expansion can fit this nonlinear pattern exactly.

### C5 solution

**Step 1 — Compute the first gradient at $\mathbf{w}_0$.**


$$

X\mathbf{w}_0=
\begin{bmatrix}0\\0\end{bmatrix}.

$$



$$

X\mathbf{w}_0-\mathbf{y}
=
\begin{bmatrix}-1\\-5\end{bmatrix}.

$$



$$

\nabla E(\mathbf{w}_0)
=X^\top(X\mathbf{w}_0-\mathbf{y})
=
\begin{bmatrix}
1&1\\
0&2
\end{bmatrix}
\begin{bmatrix}-1\\-5\end{bmatrix}
=
\begin{bmatrix}-6\\-10\end{bmatrix}.

$$


**Step 2 — Update to $\mathbf{w}_1$.**


$$

\mathbf{w}_1
=
\mathbf{w}_0-0.1
\begin{bmatrix}-6\\-10\end{bmatrix}
=
\begin{bmatrix}0.6\\1.0\end{bmatrix}.

$$


**Step 3 — Compute the second gradient at $\mathbf{w}_1$.**


$$

X\mathbf{w}_1
=
\begin{bmatrix}
1&0\\
1&2
\end{bmatrix}
\begin{bmatrix}0.6\\1.0\end{bmatrix}
=
\begin{bmatrix}
0.6\\
2.6
\end{bmatrix}.

$$



$$

X\mathbf{w}_1-\mathbf{y}
=
\begin{bmatrix}
0.6-1\\
2.6-5
\end{bmatrix}
=
\begin{bmatrix}
-0.4\\
-2.4
\end{bmatrix}.

$$



$$

\nabla E(\mathbf{w}_1)
=
X^\top(X\mathbf{w}_1-\mathbf{y})
=
\begin{bmatrix}
1&1\\
0&2
\end{bmatrix}
\begin{bmatrix}
-0.4\\
-2.4
\end{bmatrix}
=
\begin{bmatrix}
-2.8\\
-4.8
\end{bmatrix}.

$$


**Step 4 — Update to $\mathbf{w}_2$.**


$$

\mathbf{w}_2
=
\mathbf{w}_1-0.1
\begin{bmatrix}
-2.8\\
-4.8
\end{bmatrix}
=
\begin{bmatrix}
0.6\\1.0
\end{bmatrix}
+
\begin{bmatrix}
0.28\\0.48
\end{bmatrix}
=
\begin{bmatrix}
0.88\\1.48
\end{bmatrix}.

$$


**Answer.**


$$

\mathbf{w}_1=[0.6,1.0]^\top,
\qquad
\mathbf{w}_2=[0.88,1.48]^\top.

$$


### C6 solution

**Step 1 — Compute the per-example gradient for example 2.**

For $\mathbf{x}_2=[1,2]^\top$,


$$

\mathbf{w}^\top\mathbf{x}_2
=0.6(1)+1.0(2)=2.6.

$$


The error term is


$$

2.6-5=-2.4.

$$


So


$$

\mathbf{g}_2=(-2.4)\begin{bmatrix}1\\2\end{bmatrix}
=
\begin{bmatrix}-2.4\\-4.8\end{bmatrix}.

$$


**Step 2 — Compute the per-example gradient for example 3.**

For $\mathbf{x}_3=[1,1]^\top$,


$$

\mathbf{w}^\top\mathbf{x}_3
=0.6(1)+1.0(1)=1.6.

$$


The error term is


$$

1.6-3=-1.4.

$$


So


$$

\mathbf{g}_3=(-1.4)\begin{bmatrix}1\\1\end{bmatrix}
=
\begin{bmatrix}-1.4\\-1.4\end{bmatrix}.

$$


**Step 3 — Average over the mini-batch.**


$$

\mathbf{g}_S
=
\frac{1}{2}(\mathbf{g}_2+\mathbf{g}_3)
=
\frac{1}{2}
\left(
\begin{bmatrix}-2.4\\-4.8\end{bmatrix}
+
\begin{bmatrix}-1.4\\-1.4\end{bmatrix}
\right).

$$



$$

\mathbf{g}_S
=
\frac{1}{2}
\begin{bmatrix}-3.8\\-6.2\end{bmatrix}
=
\begin{bmatrix}-1.9\\-3.1\end{bmatrix}.

$$


**Step 4 — Apply the update.**


$$

\mathbf{w}_{\text{new}}
=\mathbf{w}-\eta\mathbf{g}_S
=
\begin{bmatrix}0.6\\1.0\end{bmatrix}
-0.2
\begin{bmatrix}-1.9\\-3.1\end{bmatrix}.

$$



$$

\mathbf{w}_{\text{new}}
=
\begin{bmatrix}0.6\\1.0\end{bmatrix}
+
\begin{bmatrix}0.38\\0.62\end{bmatrix}
=
\begin{bmatrix}0.98\\1.62\end{bmatrix}.

$$


**Answer.** The mini-batch update gives $\mathbf{w}_{\text{new}}=[0.98,1.62]^\top$.

### C7 solution

**Step 1 — Compute $X^\top X$.**


$$

X^\top X
=
\begin{bmatrix}
1&1\\
0&1
\end{bmatrix}
\begin{bmatrix}
1&0\\
1&1
\end{bmatrix}
=
\begin{bmatrix}
2&1\\
1&1
\end{bmatrix}.

$$


**Step 2 — Add $\lambda I$.**

Since $\lambda=1$,


$$

X^\top X+\lambda I
=
\begin{bmatrix}
2&1\\
1&1
\end{bmatrix}
+
\begin{bmatrix}
1&0\\
0&1
\end{bmatrix}
=
\begin{bmatrix}
3&1\\
1&2
\end{bmatrix}.

$$


**Step 3 — Compute $X^\top\mathbf{y}$.**


$$

X^\top\mathbf{y}
=
\begin{bmatrix}
1&1\\
0&1
\end{bmatrix}
\begin{bmatrix}
1\\3
\end{bmatrix}
=
\begin{bmatrix}
4\\3
\end{bmatrix}.

$$


**Step 4 — Invert the ridge matrix.**

For


$$

A=
\begin{bmatrix}
3&1\\
1&2
\end{bmatrix},

$$



$$

\det(A)=3(2)-1(1)=5.

$$


So


$$

A^{-1}=\frac{1}{5}
\begin{bmatrix}
2&-1\\
-1&3
\end{bmatrix}.

$$


**Step 5 — Compute $\mathbf{w}^*$.**


$$

\mathbf{w}^*
=
\frac{1}{5}
\begin{bmatrix}
2&-1\\
-1&3
\end{bmatrix}
\begin{bmatrix}
4\\3
\end{bmatrix}
=
\frac{1}{5}
\begin{bmatrix}
8-3\\
-4+9
\end{bmatrix}
=
\frac{1}{5}
\begin{bmatrix}
5\\5
\end{bmatrix}
=
\begin{bmatrix}
1\\1
\end{bmatrix}.

$$


**Answer.** The ridge solution is $\mathbf{w}^*=[1,1]^\top$.

### C8 solution

**Step 1 — Compute the scores.**

At $\mathbf{w}_0=[0,0]^\top$,


$$

X\mathbf{w}_0=
\begin{bmatrix}0\\0\end{bmatrix}.

$$


So both logits are zero.

**Step 2 — Compute the sigmoid probabilities.**


$$

\sigma(0)=0.5.

$$


Therefore


$$

\boldsymbol{\sigma}
=
\begin{bmatrix}0.5\\0.5\end{bmatrix}.

$$


**Step 3 — Compute the negative log-likelihood.**

For the first point, $y_1=0$, contribution is


$$

-\log(1-0.5)=-\log(0.5).

$$


For the second point, $y_2=1$, contribution is


$$

-\log(0.5).

$$


So


$$

NLL(\mathbf{w}_0)
=-2\log(0.5)
=2\log 2
\approx 1.3863.

$$


**Step 4 — Compute the gradient.**


$$

\boldsymbol{\sigma}-\mathbf{y}
=
\begin{bmatrix}0.5\\0.5\end{bmatrix}
-
\begin{bmatrix}0\\1\end{bmatrix}
=
\begin{bmatrix}0.5\\-0.5\end{bmatrix}.

$$



$$

\nabla NLL(\mathbf{w}_0)
=X^\top(\boldsymbol{\sigma}-\mathbf{y})
=
\begin{bmatrix}
1&1\\
0&2
\end{bmatrix}
\begin{bmatrix}0.5\\-0.5\end{bmatrix}
=
\begin{bmatrix}0\\-1\end{bmatrix}.

$$


**Step 5 — Apply the update.**


$$

\mathbf{w}_1
=\mathbf{w}_0-0.5
\begin{bmatrix}0\\-1\end{bmatrix}
=
\begin{bmatrix}0\\0.5\end{bmatrix}.

$$


**Answer.**


$$

\boldsymbol{\sigma}=[0.5,0.5]^\top,
\qquad
NLL\approx 1.3863,
\qquad
\nabla NLL=[0,-1]^\top,
\qquad
\mathbf{w}_1=[0,0.5]^\top.

$$


### C9 solution

**Step 1 — Compute the logits.**


$$

X\mathbf{w}
=
\begin{bmatrix}
1&0\\
1&2
\end{bmatrix}
\begin{bmatrix}
0\\0.5
\end{bmatrix}
=
\begin{bmatrix}
0\\1
\end{bmatrix}.

$$


**Step 2 — Compute sigmoid probabilities.**


$$

\sigma(0)=0.5,
\qquad
\sigma(1)\approx 0.7311.

$$


So


$$

\boldsymbol{\sigma}
\approx
\begin{bmatrix}
0.5\\0.7311
\end{bmatrix}.

$$


**Step 3 — Compute the logistic NLL gradient.**


$$

\boldsymbol{\sigma}-\mathbf{y}
=
\begin{bmatrix}
0.5\\0.7311
\end{bmatrix}
-
\begin{bmatrix}
0\\1
\end{bmatrix}
=
\begin{bmatrix}
0.5\\-0.2689
\end{bmatrix}.

$$



$$

X^\top(\boldsymbol{\sigma}-\mathbf{y})
=
\begin{bmatrix}
1&1\\
0&2
\end{bmatrix}
\begin{bmatrix}
0.5\\-0.2689
\end{bmatrix}
=
\begin{bmatrix}
0.2311\\-0.5379
\end{bmatrix}.

$$


**Step 4 — Compute the ridge gradient term.**


$$

\lambda\mathbf{w}
=0.2
\begin{bmatrix}
0\\0.5
\end{bmatrix}
=
\begin{bmatrix}
0\\0.1
\end{bmatrix}.

$$


**Step 5 — Add the gradients.**


$$

\nabla h(\mathbf{w})
\approx
\begin{bmatrix}
0.2311\\-0.5379
\end{bmatrix}
+
\begin{bmatrix}
0\\0.1
\end{bmatrix}
=
\begin{bmatrix}
0.2311\\-0.4379
\end{bmatrix}.

$$


**Step 6 — Apply the update.**


$$

\mathbf{w}_{\text{new}}
=\mathbf{w}-0.5\nabla h(\mathbf{w})
\approx
\begin{bmatrix}
0\\0.5
\end{bmatrix}
-0.5
\begin{bmatrix}
0.2311\\-0.4379
\end{bmatrix}.

$$



$$

\mathbf{w}_{\text{new}}
\approx
\begin{bmatrix}
-0.1155\\0.7189
\end{bmatrix}.

$$


**Answer.** The regularised update gives approximately $\mathbf{w}_{\text{new}}=[-0.1155,0.7189]^\top$.

### C10 solution

**Step 1 — Substitute the values.**


$$

NLL
=
\frac{3}{2}\log(2\pi)
+
\frac{3}{2}\log(1)
+
\frac{1}{2(1)}(2).

$$


**Step 2 — Simplify the variance term.**


$$

\log(1)=0.

$$


So


$$

NLL
=
\frac{3}{2}\log(2\pi)+1.

$$


**Step 3 — Evaluate numerically.**


$$

\log(2\pi)\approx 1.8379.

$$



$$

\frac{3}{2}\log(2\pi)
\approx 1.5(1.8379)=2.7568.

$$



$$

NLL\approx 2.7568+1=3.7568.

$$


**Answer.** $NLL\approx 3.7568$.

---

# Section D — Hard edge cases where methods disagree or break down

This is the highest-value section. These are the situations where a method’s assumptions matter.

## Questions

### D1. Normal equation breaks, ridge still works

Consider


$$

X=
\begin{bmatrix}
1&1\\
1&1
\end{bmatrix},
\qquad
\mathbf{y}=\begin{bmatrix}1\\3\end{bmatrix}.

$$


1. Show that the ordinary normal equation cannot be used because $X^\top X$ is singular.
2. Compute the ridge solution for $\lambda=1$.
3. Compute the ridge solution for $\lambda=100$, and interpret the effect of large $\lambda$.

### D2. Polynomial basis with too many features

You have only $N=3$ data points but use a polynomial basis of degree $M=5$:


$$

\boldsymbol{\phi}(x)=[1,x,x^2,x^3,x^4,x^5]^\top.

$$


The design matrix $\Phi$ therefore has shape $3\times 6$.

1. Explain why $(\Phi^\top\Phi)^{-1}$ cannot exist.
2. Explain why this is a risk for the Olympic polynomial example if $M$ is made too large.
3. State two remedies covered by the sheet.

### D3. RSS and Gaussian NLL disagree when variance is not fixed

Two candidate regression models have residuals on two data points:


$$

\mathbf{r}^{(A)}=[1,1]^\top,
\qquad
\mathbf{r}^{(B)}=[0,2]^\top.

$$


Ordinary RSS prefers the smaller RSS.

Now suppose the Gaussian noise variances are not common:


$$

\sigma_1^2=0.01,
\qquad
\sigma_2^2=100.

$$


Ignoring constants that do not depend on the candidate model, compare the weighted Gaussian NLL terms


$$

\frac{1}{2}\sum_{n=1}^2\frac{r_n^2}{\sigma_n^2}.

$$


Which model does ordinary RSS prefer? Which model does the heteroscedastic Gaussian NLL prefer?

### D4. Gradient descent step size causes convergence, oscillation, or divergence

Use the one-dimensional objective


$$

h(w)=\frac{1}{2}(w-1)^2.

$$


The gradient is


$$

h'(w)=w-1.

$$


Starting from $w_0=0$, compute the first few updates for:

1. $\eta=0.5$,
2. $\eta=2$,
3. $\eta=2.5$.

Use


$$

w_{k+1}=w_k-\eta(w_k-1).

$$


### D5. Feature scaling cliff in gradient descent

Use one data point with augmented feature vector


$$

\mathbf{x}=[1,1000]^\top,
\qquad
 y=1,
\qquad
\mathbf{w}_0=[0,0]^\top.

$$


For squared error, the per-example gradient is


$$

\mathbf{g}=(\mathbf{w}^\top\mathbf{x}-y)\mathbf{x}.

$$


Use learning rate $\eta=0.001$.

1. Compute one update using the unscaled feature $[1,1000]^\top$.
2. Compute the prediction after that update.
3. Repeat the same calculation after scaling the second feature down so that $\mathbf{x}_{\text{scaled}}=[1,1]^\top$.
4. Explain the warning from the sheet: “Always normalise the features if using gradient descent.”

### D6. Logistic regression edge: exactly on the boundary and saturated probabilities

Use logistic regression with augmented inputs.

1. For $\mathbf{w}=[-2,1,1]^\top$ and raw point $(1,1)$, compute $z$, $\sigma(z)$, and explain the classification issue.
2. For a model output $z=8$ on a data point with true label $y=0$, compute the cross-entropy contribution approximately.
3. For a model output $z=-12$ on a data point with true label $y=1$, compute the cross-entropy contribution approximately.

### D7. Lasso and ridge can prefer different parameter vectors

Two candidate models have the same data-fitting error:


$$

E(\mathbf{w}^{(A)})=E(\mathbf{w}^{(B)})=5.

$$


Their parameter vectors are


$$

\mathbf{w}^{(A)}=[2,0]^\top,
\qquad
\mathbf{w}^{(B)}=[1.1,1.1]^\top.

$$


With $\lambda=1$, compare the total objectives under:

1. Lasso: $h=E+\lambda\|\mathbf{w}\|_1$,
2. Ridge: $h=E+\lambda\frac{1}{2}\|\mathbf{w}\|_2^2$,
3. Elastic net with $\alpha=0.5$:


$$

h=E+\lambda\left[\alpha\|\mathbf{w}\|_1+(1-\alpha)\frac{1}{2}\|\mathbf{w}\|_2^2\right].

$$


### D8. A decreasing SGD learning rate can still fail Robbins-Monro

Consider the three decreasing schedules:


$$

\eta_k=\frac{1}{\sqrt{k}},
\qquad
\eta_k=\frac{1}{k},
\qquad
\eta_k=\frac{1}{k^2}.

$$


Check the two Robbins-Monro conditions and explain why “decreasing to zero” alone is not enough.

### D9. Olympic $M=5$ polynomial basis: raw years can create numerical trouble

The sheet’s Olympic example uses polynomial basis functions with $M=5$. Suppose someone uses the raw year $x=2000$.

1. Compute the largest basis term $x^5$.
2. Now use the scaled variable $t=(x-1900)/100$. Compute $t^5$ for year 2000.
3. Explain why scaling/centering is especially important for polynomial basis functions and gradient descent.

---

## Worked solutions

### D1 solution

**Step 1 — Compute $X^\top X$.**


$$

X^\top X
=
\begin{bmatrix}
1&1\\
1&1
\end{bmatrix}
\begin{bmatrix}
1&1\\
1&1
\end{bmatrix}
=
\begin{bmatrix}
2&2\\
2&2
\end{bmatrix}.

$$


**Step 2 — Check the determinant.**


$$

\det(X^\top X)=2(2)-2(2)=4-4=0.

$$


So $X^\top X$ is singular. The ordinary normal-equation inverse does not exist.

**Step 3 — Compute $X^\top\mathbf{y}$.**


$$

X^\top\mathbf{y}
=
\begin{bmatrix}
1&1\\
1&1
\end{bmatrix}
\begin{bmatrix}
1\\3
\end{bmatrix}
=
\begin{bmatrix}
4\\4
\end{bmatrix}.

$$


**Step 4 — Ridge with $\lambda=1$.**


$$

X^\top X+\lambda I
=
\begin{bmatrix}
2&2\\
2&2
\end{bmatrix}
+
\begin{bmatrix}
1&0\\
0&1
\end{bmatrix}
=
\begin{bmatrix}
3&2\\
2&3
\end{bmatrix}.

$$


The determinant is


$$

3(3)-2(2)=9-4=5.

$$


So


$$

(X^\top X+I)^{-1}
=
\frac{1}{5}
\begin{bmatrix}
3&-2\\
-2&3
\end{bmatrix}.

$$


Then


$$

\mathbf{w}_{\lambda=1}^*
=
\frac{1}{5}
\begin{bmatrix}
3&-2\\
-2&3
\end{bmatrix}
\begin{bmatrix}
4\\4
\end{bmatrix}
=
\frac{1}{5}
\begin{bmatrix}
4\\4
\end{bmatrix}
=
\begin{bmatrix}
0.8\\0.8
\end{bmatrix}.

$$


**Step 5 — Ridge with $\lambda=100$.**


$$

X^\top X+100I
=
\begin{bmatrix}
102&2\\
2&102
\end{bmatrix}.

$$


The determinant is


$$

102(102)-2(2)=10404-4=10400.

$$


The inverse is


$$

\frac{1}{10400}
\begin{bmatrix}
102&-2\\
-2&102
\end{bmatrix}.

$$


Therefore


$$

\mathbf{w}_{\lambda=100}^*
=
\frac{1}{10400}
\begin{bmatrix}
102&-2\\
-2&102
\end{bmatrix}
\begin{bmatrix}
4\\4
\end{bmatrix}
=
\frac{1}{10400}
\begin{bmatrix}
400\\400
\end{bmatrix}
\approx
\begin{bmatrix}
0.0385\\0.0385
\end{bmatrix}.

$$


**Step 6 — Interpret.**

The ordinary normal equation fails because the inverse does not exist. Ridge adds $\lambda I$, which makes the matrix invertible here. Large $\lambda$ heavily penalises large weights, shrinking the solution close to zero.

**Answer.** Ordinary least squares via the inverse breaks; ridge gives $[0.8,0.8]^\top$ for $\lambda=1$ and approximately $[0.0385,0.0385]^\top$ for $\lambda=100$.

### D2 solution

**Step 1 — Identify the shape of $\Phi$.**

There are $N=3$ rows and $M+1=6$ basis functions, so


$$

\Phi\in\mathbb{R}^{3\times 6}.

$$


**Step 2 — Use the rank argument.**

The rank of a $3\times 6$ matrix is at most $3$:


$$

\operatorname{rank}(\Phi)\leq 3.

$$


But $\Phi^\top\Phi$ has shape $6\times 6$. For it to be invertible, it would need rank $6$. That is impossible because


$$

\operatorname{rank}(\Phi^\top\Phi)\leq \operatorname{rank}(\Phi)\leq 3.

$$


Therefore $(\Phi^\top\Phi)^{-1}$ cannot exist.

**Step 3 — Connect to the Olympic polynomial example.**

The Olympic example uses polynomial features. Increasing $M$ adds columns:


$$

1,x,x^2,\ldots,x^M.

$$


If too many polynomial features are used relative to the amount of data, the design matrix can become rank-deficient or numerically unstable. The model may also fit noise rather than trend.

**Step 4 — State remedies from the sheet.**

Two remedies covered by the sheet are:

1. **Regularisation**, especially ridge regression:

   
$$

   \mathbf{w}^*=(\Phi^\top\Phi+\lambda I)^{-1}\Phi^\top\mathbf{y}.
   
$$


2. **Iterative optimisation**, such as gradient descent or SGD, to avoid explicitly forming and inverting the normal-equation matrix. The unregularised solution can still be non-unique, so iterative optimisation is not a magic fix for identifiability; regularisation addresses the non-uniqueness more directly.

**Answer.** The inverse fails because there are more columns than independent rows. Ridge regularisation is the cleanest sheet-covered fix; iterative optimisation is useful computationally but does not by itself remove non-uniqueness.

### D3 solution

**Step 1 — Compute ordinary RSS for model A.**


$$

RSS_A=1^2+1^2=2.

$$


**Step 2 — Compute ordinary RSS for model B.**


$$

RSS_B=0^2+2^2=4.

$$


Ordinary RSS prefers model A because $2<4$.

**Step 3 — Compute the heteroscedastic Gaussian NLL term for model A.**


$$

\frac{1}{2}\sum_{n=1}^2\frac{(r_n^{(A)})^2}{\sigma_n^2}
=
\frac{1}{2}\left(\frac{1^2}{0.01}+\frac{1^2}{100}\right).

$$



$$

=
\frac{1}{2}(100+0.01)=50.005.

$$


**Step 4 — Compute the heteroscedastic Gaussian NLL term for model B.**


$$

\frac{1}{2}\sum_{n=1}^2\frac{(r_n^{(B)})^2}{\sigma_n^2}
=
\frac{1}{2}\left(\frac{0^2}{0.01}+\frac{2^2}{100}\right).

$$



$$

=
\frac{1}{2}(0+0.04)=0.02.

$$


**Step 5 — Compare.**

Ordinary RSS prefers A:


$$

RSS_A=2<RSS_B=4.

$$


The heteroscedastic Gaussian NLL term prefers B:


$$

0.02<50.005.

$$


**Answer.** RSS prefers model A, but heteroscedastic Gaussian NLL strongly prefers model B. This is exactly why the sheet’s “fixed variance” condition matters.

### D4 solution

**Step 1 — Write the update in simplified form.**


$$

w_{k+1}=w_k-\eta(w_k-1)
=(1-\eta)w_k+\eta.

$$


The optimum is $w=1$.

**Step 2 — Case $\eta=0.5$.**

Starting from $w_0=0$:


$$

w_1=0-0.5(0-1)=0.5.

$$



$$

w_2=0.5-0.5(0.5-1)=0.5+0.25=0.75.

$$



$$

w_3=0.75-0.5(0.75-1)=0.75+0.125=0.875.

$$


The sequence approaches $1$.

**Result:** converges.

**Step 3 — Case $\eta=2$.**


$$

w_1=0-2(0-1)=2.

$$



$$

w_2=2-2(2-1)=0.

$$



$$

w_3=0-2(0-1)=2.

$$


The sequence bounces between $0$ and $2$.

**Result:** oscillates and does not converge.

**Step 4 — Case $\eta=2.5$.**


$$

w_1=0-2.5(0-1)=2.5.

$$



$$

w_2=2.5-2.5(2.5-1)=2.5-3.75=-1.25.

$$



$$

w_3=-1.25-2.5(-1.25-1)=-1.25+5.625=4.375.

$$


The values are moving farther away.

**Result:** diverges.

**Answer.** Small enough $\eta$ converges; too-large $\eta$ can oscillate or diverge. This is the sheet’s step-size warning in its cleanest possible form.

### D5 solution

**Step 1 — Compute the unscaled gradient.**

At $\mathbf{w}_0=[0,0]^\top$,


$$

\mathbf{w}_0^\top\mathbf{x}=0.

$$


The error term is


$$

0-1=-1.

$$


So


$$

\mathbf{g}=(-1)
\begin{bmatrix}1\\1000\end{bmatrix}
=
\begin{bmatrix}-1\\-1000\end{bmatrix}.

$$


**Step 2 — Apply the unscaled update.**


$$

\mathbf{w}_1
=
\mathbf{w}_0-0.001\mathbf{g}
=
\begin{bmatrix}0\\0\end{bmatrix}
-0.001
\begin{bmatrix}-1\\-1000\end{bmatrix}
=
\begin{bmatrix}0.001\\1\end{bmatrix}.

$$


**Step 3 — Compute the new unscaled prediction.**


$$

\mathbf{w}_1^\top\mathbf{x}
=0.001(1)+1(1000)=1000.001.

$$


The target was $1$, so the update has massively overshot.

**Step 4 — Repeat with scaled input $[1,1]^\top$.**

At $\mathbf{w}_0=[0,0]^\top$, the error is still


$$

0-1=-1.

$$


The gradient is now


$$

\mathbf{g}_{\text{scaled}}
=(-1)
\begin{bmatrix}1\\1\end{bmatrix}
=
\begin{bmatrix}-1\\-1\end{bmatrix}.

$$


The update is


$$

\mathbf{w}_{1,\text{scaled}}
=
\begin{bmatrix}0\\0\end{bmatrix}
-0.001
\begin{bmatrix}-1\\-1\end{bmatrix}
=
\begin{bmatrix}0.001\\0.001\end{bmatrix}.

$$


The new scaled prediction is


$$

0.001(1)+0.001(1)=0.002.

$$


This is small and controlled.

**Step 5 — Interpret.**

With unscaled features, the large feature value $1000$ dominates the gradient and causes a huge step in that coordinate. With scaled features, coordinates have comparable influence.

**Answer.** The unscaled update jumps to $[0.001,1]^\top$ and predicts $1000.001$. The scaled update jumps to $[0.001,0.001]^\top$ and predicts $0.002$. This is why feature normalisation matters for gradient descent.

### D6 solution

**Step 1 — Boundary case.**

For raw point $(1,1)$, the augmented input is


$$

\mathbf{x}=[1,1,1]^\top.

$$


With


$$

\mathbf{w}=[-2,1,1]^\top,

$$



$$

z=\mathbf{w}^\top\mathbf{x}
=-2+1+1=0.

$$


Therefore


$$

\sigma(z)=\sigma(0)=0.5.

$$


This is exactly on the decision boundary. If the rule only says “above $0.5$” versus “below $0.5$,” this is a tie. A practical classifier must define a tie-breaking convention.

**Step 2 — Saturated wrong prediction with $z=8$, $y=0$.**


$$

\sigma(8)=\frac{1}{1+e^{-8}}\approx 0.9997.

$$


For $y=0$, cross-entropy is


$$

-\log(1-p).

$$


So


$$

-\log(1-0.9997)
\approx 8.0003.

$$


This is large because the model was extremely confident in class $1$, but the truth was class $0$.

**Step 3 — Saturated wrong prediction with $z=-12$, $y=1$.**


$$

\sigma(-12)\approx 0.00000614.

$$


For $y=1$, cross-entropy is


$$

-\log(p).

$$


So


$$

-\log(0.00000614)\approx 12.0000.

$$


This is large because the model was extremely confident in class $0$, but the truth was class $1$.

**Answer.** Boundary points need a tie convention; saturated wrong predictions produce very large cross-entropy penalties.

### D7 solution

**Step 1 — Compute penalties for model A.**


$$

\mathbf{w}^{(A)}=[2,0]^\top.

$$


Lasso penalty:


$$

\|\mathbf{w}^{(A)}\|_1=|2|+|0|=2.

$$


Ridge penalty:


$$

\frac{1}{2}\|\mathbf{w}^{(A)}\|_2^2
=
\frac{1}{2}(2^2+0^2)=2.

$$


**Step 2 — Compute penalties for model B.**


$$

\mathbf{w}^{(B)}=[1.1,1.1]^\top.

$$


Lasso penalty:


$$

\|\mathbf{w}^{(B)}\|_1=1.1+1.1=2.2.

$$


Ridge penalty:


$$

\frac{1}{2}\|\mathbf{w}^{(B)}\|_2^2
=
\frac{1}{2}(1.1^2+1.1^2)
=
\frac{1}{2}(1.21+1.21)
=1.21.

$$


**Step 3 — Compare Lasso objectives.**


$$

h_A^{\text{lasso}}=5+2=7.

$$



$$

h_B^{\text{lasso}}=5+2.2=7.2.

$$


Lasso prefers A.

**Step 4 — Compare Ridge objectives.**


$$

h_A^{\text{ridge}}=5+2=7.

$$



$$

h_B^{\text{ridge}}=5+1.21=6.21.

$$


Ridge prefers B.

**Step 5 — Compare elastic net with $\alpha=0.5$.**

For A:


$$

R_A=0.5(2)+0.5(2)=2.

$$



$$

h_A=5+2=7.

$$


For B:


$$

R_B=0.5(2.2)+0.5(1.21)=1.1+0.605=1.705.

$$



$$

h_B=5+1.705=6.705.

$$


Elastic net with $\alpha=0.5$ prefers B.

**Answer.** Lasso prefers the sparse vector A. Ridge prefers the more spread-out vector B. Elastic net with $\alpha=0.5$ also prefers B here. Same data error, different regulariser, different preferred model.

### D8 solution

**Step 1 — Check $\eta_k=1/\sqrt{k}$.**


$$

\sum \eta_k=\sum \frac{1}{k^{1/2}}

$$


diverges.

But


$$

\sum \eta_k^2
=
\sum \frac{1}{k}

$$


also diverges.

So $1/\sqrt{k}$ fails the second condition.

**Step 2 — Check $\eta_k=1/k$.**


$$

\sum \eta_k=\sum \frac{1}{k}

$$


diverges.


$$

\sum \eta_k^2=\sum \frac{1}{k^2}

$$


converges.

So $1/k$ satisfies both conditions.

**Step 3 — Check $\eta_k=1/k^2$.**


$$

\sum \eta_k=\sum \frac{1}{k^2}

$$


converges.

This fails the first condition, even though


$$

\sum \eta_k^2=\sum \frac{1}{k^4}

$$


converges.

**Step 4 — Interpret.**

A learning rate can decrease to zero but still fail:

- $1/\sqrt{k}$ decreases too slowly, so squared steps do not sum to a finite value.
- $1/k^2$ decreases too quickly, so the total movement is finite.
- $1/k$ is the classic balance.

**Answer.** Only $1/k$ satisfies both Robbins-Monro conditions. Decreasing to zero is necessary-looking but not sufficient.

### D9 solution

**Step 1 — Compute the raw fifth power.**

For raw year $x=2000$,


$$

x^5=2000^5.

$$


Since


$$

2000=2\times 10^3,

$$



$$

2000^5=(2^5)(10^{15})=32\times 10^{15}=3.2\times 10^{16}.

$$


**Step 2 — Compute the scaled variable.**


$$

t=\frac{2000-1900}{100}=1.

$$


So


$$

t^5=1^5=1.

$$


**Step 3 — Interpret the difference.**

The raw basis vector contains terms like


$$

1,2000,2000^2,2000^3,2000^4,2000^5.

$$


These terms have wildly different magnitudes. That can make matrices such as $\Phi^\top\Phi$ numerically unstable and can make gradient descent behave badly because gradients in different coordinates have very different scales.

The scaled basis vector for year 2000 is much better behaved:


$$

[1,1,1,1,1,1]^\top.

$$


**Answer.** Raw $2000^5=3.2\times 10^{16}$, while scaled $t^5=1$. Polynomial basis functions amplify scale problems, so centering/scaling is especially important.

---

# Final self-test checklist

After working through the bank, you should be able to do the following without looking:

- Add the bias coordinate $x_0=1$ and compute $\mathbf{w}^\top\mathbf{x}$.
- Evaluate a Gaussian pdf and a Gaussian regression conditional density.
- Build $X$, $\Phi$, $X^\top X$, and $X^\top\mathbf{y}$.
- Solve a small normal-equation problem by hand.
- Check whether $(X^\top X)^{-1}$ exists.
- Compute RSS and $\sigma^{2*}=RSS/N$.
- Explain when Gaussian maximum likelihood is equivalent to RSS minimisation.
- Construct polynomial basis functions and understand why the model remains linear in $\mathbf{w}$.
- Perform batch, stochastic, and mini-batch gradient updates.
- Diagnose too-small and too-large learning rates.
- Check Robbins-Monro learning-rate schedules.
- Compute Lasso, Ridge, and elastic-net penalties.
- Use the ridge closed-form solution.
- Compute sigmoid probabilities, Bernoulli probabilities, logistic cross-entropy, and logistic gradients.
- Identify edge cases where normal equations, RSS equivalence, gradient descent, or threshold decisions break down.
