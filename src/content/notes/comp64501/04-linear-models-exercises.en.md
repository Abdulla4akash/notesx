---
subject: COMP64501
chapter: 4
title: "Linear Models — Exercise Solutions"
language: en
---

# Linear Models — Structured Study Notes

**Course:** [not provided]  
**Lecture topic:** Linear Models  
**Source used:** Uploaded file `ExerciseSheetLinearModels-Solutions (1).pdf`. The lecture transcript and the actual slide deck were not provided in the chat, so these notes are grounded in the uploaded exercise-solutions PDF only. Where the PDF references lecture slides, those references are preserved.

## Topic and scope

This material covers linear models for regression and classification: maximum likelihood estimation, ridge regression, weighted least squares, polynomial basis functions, stochastic gradient updates, logistic regression, cross-entropy / negative log-likelihood, KL divergence, and Poisson regression.

The exercise sheet is structured as revision-style derivations and worked examples for a lecture on **Linear Models**, with explicit links to slides 24, 47, 57, 58, and 59.

---

# 1. Maximum Likelihood Estimation for Linear Regression Noise Variance

**Source location:** PDF pp. 1–2.  
**Exercise difficulty:** `(***)`.

## 1.1 Key concept: ML estimate of $\sigma^2$

### Intuition

The model has a linear prediction $Xw$. The residual vector is

$$
y - Xw.
$$

The squared residual error is

$$
(y-Xw)^\top(y-Xw).
$$

The maximum-likelihood estimate of the noise variance $\sigma^2$ is the average squared residual evaluated at the optimal weight vector $w_*$.

### Formal result

The exercise asks to show the result from **slide 24** of the Linear Models lecture:

$$
\sigma_*^2 = \frac{1}{N}(y-Xw_*)^\top(y-Xw_*).
$$

The log-likelihood used in the solution is

$$
LL(w,\sigma^2)
= -\frac{N}{2}\log(2\pi)
-\frac{N}{2}\log\sigma^2
-\frac{1}{2\sigma^2}(y-Xw)^\top(y-Xw).
$$

The solution assumes

$$
\sigma \neq 0.
$$

## 1.2 Derivation

Let

$$
RSS(w)=(y-Xw)^\top(y-Xw).
$$

Differentiate the log-likelihood with respect to $\sigma$.

First term:

$$
\frac{d}{d\sigma}\left[-\frac{N}{2}\log(2\pi)\right]=0.
$$

Second term:

$$
\frac{d}{d\sigma}\left[-\frac{N}{2}\log\sigma^2\right]
= -\frac{N}{2}\frac{d}{d\sigma}[2\log\sigma]
= -N\frac{d}{d\sigma}[\log\sigma]
= -\frac{N}{\sigma}.
$$

Third term:

$$
\frac{d}{d\sigma}\left[-\frac{1}{2\sigma^2}RSS(w)\right]
= -RSS(w)\frac{d}{d\sigma}\left[\frac{1}{2\sigma^2}\right].
$$

Now,

$$
\frac{d}{d\sigma}\left[\frac{1}{2\sigma^2}\right]
= \frac{1}{2}\frac{d}{d\sigma}[\sigma^{-2}]
= \frac{1}{2}(-2)\sigma^{-3}
= -\sigma^{-3}.
$$

Therefore,

$$
\frac{d}{d\sigma}\left[-\frac{1}{2\sigma^2}RSS(w)\right]
= RSS(w)\sigma^{-3}
= \frac{RSS(w)}{\sigma^3}.
$$

Putting the derivatives together:

$$
\frac{d}{d\sigma}LL(w,\sigma^2)
= -\frac{N}{\sigma}
+\frac{(y-Xw)^\top(y-Xw)}{\sigma^3}.
$$

Set this equal to zero:

$$
-\frac{N}{\sigma}
+\frac{(y-Xw)^\top(y-Xw)}{\sigma^3}
=0.
$$

Rearrange:

$$
\frac{(y-Xw)^\top(y-Xw)}{\sigma^3}
=\frac{N}{\sigma}.
$$

Since $\sigma\neq 0$, multiply through by $\sigma^3$:

$$
(y-Xw)^\top(y-Xw)=N\sigma^2.
$$

Thus,

$$
\sigma^2=\frac{1}{N}(y-Xw)^\top(y-Xw).
$$

Substitute the optimal weight vector $w_*$:

$$
\sigma_*^2=\frac{1}{N}(y-Xw_*)^\top(y-Xw_*).
$$

## Exam flags

- **High-value derivation.** This exercise is marked `(***)`.
- The final expression is explicitly tied to **slide 24**.
- The derivation depends on differentiating with respect to $\sigma$, not directly just quoting the result for $\sigma^2$.

---

# 2. Ridge Regression

**Source locations:** PDF pp. 2–3 and pp. 7–8.  
**Exercise difficulties:** numerical example `(*)`; derivation `(***)`.

## 2.1 Key concept: ridge regression

### Intuition

Ridge regression fits a linear model while penalising large weights. The regularisation term

$$
\lambda w^\top w
$$

encourages simpler/smaller-weight solutions and helps prevent overfitting.

### Formal objective

The ridge regression objective is

$$
h(w)
=\frac{1}{2}\sum_{n=1}^{N}(y_n-w^\top x_n)^2
+\frac{\lambda}{2}w^\top w.
$$

In matrix form:

$$
h(w)
=\frac{1}{2}(y-Xw)^\top(y-Xw)+\frac{\lambda}{2}w^\top w.
$$

The optimal solution, stated as the result from **slide 47**, is

$$
w_*=(X^\top X+\lambda I)^{-1}X^\top y.
$$

## 2.2 Derivation of the ridge solution

Start from

$$
h(w)=\frac{1}{2}(y-Xw)^\top(y-Xw)+\frac{\lambda}{2}w^\top w.
$$

Expand the squared error term:

$$
\frac{1}{2}(y-Xw)^\top(y-Xw)
=\frac{1}{2}y^\top y
-\frac{1}{2}w^\top X^\top y
-\frac{1}{2}y^\top Xw
+\frac{1}{2}w^\top X^\top Xw.
$$

Differentiate term by term with respect to $w$:

$$
\frac{d}{dw}\left[\frac{1}{2}y^\top y\right]=0.
$$

$$
\frac{d}{dw}\left[-\frac{1}{2}w^\top X^\top y\right]
=-\frac{1}{2}X^\top y.
$$

$$
\frac{d}{dw}\left[-\frac{1}{2}y^\top Xw\right]
=-\frac{1}{2}X^\top y.
$$

$$
\frac{d}{dw}\left[\frac{1}{2}w^\top X^\top Xw\right]
=X^\top Xw.
$$

$$
\frac{d}{dw}\left[\frac{\lambda}{2}w^\top w\right]
=\lambda w.
$$

Putting these together:

$$
\frac{d}{dw}h(w)
=-X^\top y+X^\top Xw+\lambda w.
$$

Write $\lambda w$ as $\lambda Iw$:

$$
\frac{d}{dw}h(w)
=-X^\top y+(X^\top X+\lambda I)w.
$$

Set the gradient equal to zero:

$$
-X^\top y+(X^\top X+\lambda I)w=0.
$$

So

$$
(X^\top X+\lambda I)w=X^\top y.
$$

Therefore,

$$
w=(X^\top X+\lambda I)^{-1}X^\top y.
$$

Thus,

$$
w_*=(X^\top X+\lambda I)^{-1}X^\top y.
$$

## 2.3 Worked example: ridge regression with three data points

Given:

$$
(x_1,y_1)=(0.8,-1.2),
$$

$$
(x_2,y_2)=(-0.3,-0.6),
$$

$$
(x_3,y_3)=(0.1,2.4),
$$

and

$$
\lambda=0.1.
$$

Because the regression includes an intercept, the design matrix is

$$
X=\begin{bmatrix}
1 & 0.8\\
1 & -0.3\\
1 & 0.1
\end{bmatrix},
\qquad
y=\begin{bmatrix}
-1.2\\
-0.6\\
2.4
\end{bmatrix}.
$$

Use

$$
w_*=(X^\top X+\lambda I)^{-1}X^\top y.
$$

The solution computes

$$
X^\top X+\lambda I
=
\begin{bmatrix}
3 & 0.6\\
0.6 & 0.74
\end{bmatrix}
+0.1
\begin{bmatrix}
1 & 0\\
0 & 1
\end{bmatrix}
=
\begin{bmatrix}
3.1 & 0.6\\
0.6 & 0.84
\end{bmatrix}.
$$

Also,

$$
X^\top y
=
\begin{bmatrix}
0.6\\
-0.54
\end{bmatrix}.
$$

The $2\times2$ matrix inverse formula used is

$$
\begin{bmatrix}
a & b\\
c & d
\end{bmatrix}^{-1}
=\frac{1}{ad-bc}
\begin{bmatrix}
d & -b\\
-c & a
\end{bmatrix}.
$$

Final answer:

$$
w_*=
\begin{bmatrix}
0.37\\
-0.90
\end{bmatrix}.
$$

The sheet also gives a NumPy solution using `np.eye(p)` for the identity matrix and `np.linalg.solve(A,b)` to solve $Ax=b$.

## Exam flags

- The derivation of the ridge solution is marked `(***)` and is explicitly linked to **slide 47**.
- The numerical example is marked `(*)`, but it tests mechanics that are easy to examine:
  - forming $X$,
  - adding the intercept column,
  - computing $X^\top X+\lambda I$,
  - computing $X^\top y$,
  - solving the linear system.

## [UNCLEAR]

The solution text says “find the $w$ that maximises $h(w)$” during the ridge derivation. Since $h(w)$ is written as a squared-error-plus-penalty objective, this wording is likely a slip. The derivation itself obtains the standard stationary solution.

---

# 3. Weighted Least Squares

**Source location:** PDF pp. 3–4.  
**Exercise difficulty:** `(***)`.

## 3.1 Key concept: weighted squared error

### Intuition

Weighted least squares gives each data point an individual importance weight. A larger $r_n$ makes the residual for point $n$ contribute more strongly to the objective.

### Formal definition

The weighted squared error objective is

$$
E(w)=\frac{1}{2}\sum_{n=1}^{N}r_n(y_n-w^\top x_n)^2,
$$

where

$$
r_n>0,
$$

$$
w=[w_0,\ldots,w_D]^\top,
$$

and

$$
x_n\in\mathbb{R}^{D+1\times1},\qquad x_{n,0}=1.
$$

The weights $r_n$ can be represented as the diagonal entries of a diagonal matrix

$$
R\in\mathbb{R}^{N\times N}.
$$

## 3.2 Matrix-form derivation

Start with

$$
E(w)=\frac{1}{2}\sum_{n=1}^{N}r_n(y_n-w^\top x_n)^2.
$$

Expand the square:

$$
E(w)
=\frac{1}{2}\sum_{n=1}^{N}r_ny_n^2
-\sum_{n=1}^{N}r_ny_nw^\top x_n
+\frac{1}{2}\sum_{n=1}^{N}r_n(w^\top x_n)^2.
$$

Now express each term in matrix form.

First term:

$$
\sum_{n=1}^{N}r_ny_n^2=y^\top Ry.
$$

Second term:

$$
-2\sum_{n=1}^{N}r_ny_nw^\top x_n
=-2w^\top X^\top Ry.
$$

Third term:

$$
\sum_{n=1}^{N}r_n(w^\top x_n)^2
=\sum_{n=1}^{N}r_nw^\top x_nx_n^\top w.
$$

Factor out $w$:

$$
= w^\top\left(\sum_{n=1}^{N}r_nx_nx_n^\top\right)w.
$$

In matrix form:

$$
=w^\top X^\top RXw.
$$

Putting the pieces together:

$$
E(w)
=\frac{1}{2}\left[y^\top Ry-2w^\top X^\top Ry+w^\top X^\top RXw\right].
$$

This can also be written compactly as

$$
E(w)=\frac{1}{2}(y-Xw)^\top R(y-Xw).
$$

## 3.3 Derivation of the weighted least squares optimum

Use the matrix-form objective:

$$
E(w)=\frac{1}{2}\left(y^\top Ry-2w^\top X^\top Ry+w^\top X^\top RXw\right).
$$

The two derivative results used are

$$
\frac{dw^\top a}{dw}=a,
$$

and

$$
\frac{dw^\top Aw}{dw}=2Aw.
$$

Differentiate:

$$
\frac{dE(w)}{dw}=-X^\top Ry+X^\top RXw.
$$

Set the derivative equal to zero:

$$
-X^\top Ry+X^\top RXw=0.
$$

Therefore,

$$
X^\top RXw=X^\top Ry.
$$

So the optimal value is

$$
w_*=(X^\top RX)^{-1}X^\top Ry.
$$

## Exam flags

- This exercise is marked `(***)`.
- The diagonal matrix representation of $R$ is the key hint.
- The derivation expects the full expansion, not just the final weighted normal equation.

---

# 4. Polynomial Basis Function Regression

**Source location:** PDF p. 5.  
**Exercise difficulty:** `(*)`.

## 4.1 Key concept: basis function regression

### Intuition

A model can be nonlinear in the input $x$ while remaining linear in the weights. This is done by transforming $x$ into a vector of basis functions and then taking an inner product with $w$.

### Formal setup

The exercise uses polynomial basis functions

$$
\{\phi_i(x)=x^i\}_{i=1}^{M},
$$

with

$$
M=4.
$$

The trained weight vector is

$$
w_*=[0.5,-0.8,1.2,1.3,-0.3]^\top.
$$

The input is

$$
x=2.5.
$$

## 4.2 Worked example: prediction at $x=2.5$

Include the bias term, so the feature vector is

$$
\phi(x)=
\begin{bmatrix}
1\\
2.5\\
2.5^2\\
2.5^3\\
2.5^4
\end{bmatrix}.
$$

Compute the powers:

$$
\phi(x)=
\begin{bmatrix}
1\\
2.5\\
6.25\\
15.625\\
39.0625
\end{bmatrix}.
$$

Prediction:

$$
w_*^\top\phi(x)
=
[0.5,-0.8,1.2,1.3,-0.3]
\begin{bmatrix}
1\\
2.5\\
6.25\\
15.625\\
39.0625
\end{bmatrix}.
$$

Term by term:

$$
0.5(1)=0.5,
$$

$$
-0.8(2.5)=-2,
$$

$$
1.2(6.25)=7.5,
$$

$$
1.3(15.625)=20.3125,
$$

$$
-0.3(39.0625)=-11.71875.
$$

Sum:

$$
0.5-2+7.5+20.3125-11.71875=14.59375.
$$

Rounded as in the sheet:

$$
w_*^\top\phi(x)=14.594.
$$

## [UNCLEAR]

The exercise statement writes the basis functions as $\{\phi_i(x)=x^i\}_{i=1}^{M}$, but the solution includes the bias term $x^0=1$. For exam answers, explicitly state that the bias term is included.

---

# 5. Regularised Scalar Linear Regression and Online SGD

**Source locations:** PDF pp. 5–6.  
**Exercise difficulty:** `(*)`.

## 5.1 Key concept: scalar linear model with regularisation

### Intuition

The model is a simple line:

$$
f(x_i)=mx_i+c,
$$

where $m$ is the slope and $c$ is the intercept. The objective penalises both prediction error and large values of $m$ and $c$.

### Formal objective

$$
E(m,c)=\sum_{i=1}^{n}(y_i-f(x_i))^2+m^2+c^2.
$$

Since

$$
f(x_i)=mx_i+c,
$$

the objective becomes

$$
E(m,c)=\sum_{i=1}^{n}(y_i-mx_i-c)^2+m^2+c^2.
$$

## 5.2 Partial derivative with respect to $m$

$$
\frac{\partial E(m,c)}{\partial m}
=-2\sum_{i=1}^{n}x_i(y_i-mx_i-c)+2m.
$$

Set this equal to zero:

$$
-2\sum_{i=1}^{n}x_i(y_i-mx_i-c)+2m=0.
$$

Divide by $2$ and rearrange:

$$
-\sum_{i=1}^{n}x_iy_i
+m\left(\sum_{i=1}^{n}x_i^2+1\right)
+c\sum_{i=1}^{n}x_i=0.
$$

Therefore,

$$
m_*=
\frac{\sum_{i=1}^{n}x_iy_i-c_*\sum_{i=1}^{n}x_i}
{\sum_{i=1}^{n}x_i^2+1}.
$$

## 5.3 Partial derivative with respect to $c$

$$
\frac{\partial E(m,c)}{\partial c}
=-2\sum_{i=1}^{n}(y_i-mx_i-c)+2c.
$$

Set this equal to zero:

$$
-2\sum_{i=1}^{n}(y_i-mx_i-c)+2c=0.
$$

Rearrange:

$$
-\sum_{i=1}^{n}y_i
+m\sum_{i=1}^{n}x_i
+c(n+1)=0.
$$

Therefore,

$$
c_*=
\frac{\sum_{i=1}^{n}y_i-m_*\sum_{i=1}^{n}x_i}{n+1}.
$$

## 5.4 Online SGD update for $m$

The gradient descent update for $m$ is

$$
m_{new}=m_{old}-\eta\frac{\partial E(m,c)}{\partial m},
$$

where $\eta$ is the learning rate.

In online SGD, the full gradient is approximated using a single random instance:

$$
\frac{\partial E(m,c)}{\partial m}
\approx
\frac{\partial E_i(m,c)}{\partial m}.
$$

For one data point,

$$
\frac{\partial E_i(m,c)}{\partial m}
=-2x_i(y_i-mx_i-c)+2m.
$$

So

$$
m_{new}
=m_{old}
-\eta[-2x_i(y_i-m_{old}x_i-c_{old})+2m_{old}].
$$

Therefore,

$$
m_{new}
=m_{old}+2\eta[x_i(y_i-m_{old}x_i-c_{old})-m_{old}].
$$

## [UNCLEAR]

The sheet derives $m_*$ in terms of $c_*$, and $c_*$ in terms of $m_*$. It does not finish by solving the two equations simultaneously. Treat these as coupled optimality equations.

---

# 6. Logistic Regression with $\ell_2$ Regularisation

**Source locations:** PDF pp. 8–10.  
**Exercise difficulty:** `(**)`.

## 6.1 Key concept: logistic regression

### Intuition

Logistic regression models the probability of a binary label using the logistic sigmoid function. Instead of predicting a real-valued target, it predicts

$$
p(y=1\mid x).
$$

### Formal model

$$
p(y=1\mid w_1,w_0,x)=\sigma(w_1x+w_0),
$$

where

$$
\sigma(a)=\frac{1}{1+\exp(-a)}.
$$

So

$$
p(y=1\mid w_1,w_0,x)
=\frac{1}{1+e^{-(w_1x+w_0)}}.
$$

## 6.2 Regularised negative log-likelihood

The regularised loss is

$$
L^r(w_1,w_0)=L(w_1,w_0)+\beta R(w_1,w_0),
$$

where

$$
\beta>0.
$$

For $\ell_2$ regularisation,

$$
R(w_1,w_0)=w_1^2+w_0^2.
$$

So

$$
L^r(w_1,w_0)=L(w_1,w_0)+\beta(w_1^2+w_0^2).
$$

## 6.3 Worked example: likelihood for a three-point dataset

Dataset:

$$
(x_1,y_1)=(2.0,1),
$$

$$
(x_2,y_2)=(1.0,1),
$$

$$
(x_3,y_3)=(-1.0,0).
$$

Using the IID assumption, the likelihood is

$$
p(y_1=1,y_2=1,y_3=0\mid w_1,w_0,x_1,x_2,x_3)
$$

$$
=\sigma(w_1x_1+w_0)\sigma(w_1x_2+w_0)[1-\sigma(w_1x_3+w_0)].
$$

Substitute $x_1=2$, $x_2=1$, and $x_3=-1$:

$$
p(y_1=1,y_2=1,y_3=0\mid w_1,w_0,x_1,x_2,x_3)
$$

$$
=\sigma(2w_1+w_0)\sigma(w_1+w_0)[1-\sigma(-w_1+w_0)].
$$

## 6.4 Negative log-likelihood for the dataset

The negative log-likelihood is

$$
L(w_1,w_0)
=-\log p(y_1=1,y_2=1,y_3=0\mid w_1,w_0,x_1,x_2,x_3).
$$

Substitute the likelihood:

$$
L(w_1,w_0)
=-\log\left[\sigma(2w_1+w_0)\sigma(w_1+w_0)(1-\sigma(-w_1+w_0))\right].
$$

Use log rules:

$$
L(w_1,w_0)
=-\log[\sigma(2w_1+w_0)]
-\log[\sigma(w_1+w_0)]
-\log[1-\sigma(-w_1+w_0)].
$$

## 6.5 Worked example: compute regularised losses

Given

$$
\beta=0.1,
$$

$$
L^r(w_1,w_0)
=-\log[\sigma(2w_1+w_0)]
-\log[\sigma(w_1+w_0)]
-\log[1-\sigma(-w_1+w_0)]
+0.1(w_1^2+w_0^2).
$$

Approximations provided:

$$
\sigma(1/2)\approx0.62,
\qquad
\sigma(1)\approx0.73,
\qquad
\sigma(2)\approx0.88,
\qquad
\sigma(3)\approx0.95.
$$

Also,

$$
\sigma(a)=1-\sigma(-a).
$$

### Case 1: $(w_1,w_0)=(1/2,0)$

$$
L^r\left(\frac12,0\right)
=-\log[\sigma(1)]
-\log[\sigma(1/2)]
-\log[1-\sigma(-1/2)]
+0.1\left(\frac14\right).
$$

Using $1-\sigma(-1/2)=\sigma(1/2)$:

$$
=-\log(0.73)-\log(0.62)-\log(0.62)+\frac{1}{40}.
$$

$$
L^r\left(\frac12,0\right)=1.29.
$$

### Case 2: $(w_1,w_0)=(1,0)$

$$
L^r(1,0)
=-\log[\sigma(2)]
-\log[\sigma(1)]
-\log[1-\sigma(-1)]
+0.1.
$$

Using $1-\sigma(-1)=\sigma(1)$:

$$
=-\log(0.88)-\log(0.73)-\log(0.73)+0.1.
$$

$$
L^r(1,0)=0.85.
$$

### Case 3: $(w_1,w_0)=(1,1)$

$$
L^r(1,1)
=-\log[\sigma(3)]
-\log[\sigma(2)]
-\log[1-\sigma(0)]
+0.2.
$$

Since $\sigma(0)=1/2$:

$$
=-\log(0.95)-\log(0.88)-\log(1/2)+0.2.
$$

$$
L^r(1,1)=1.07.
$$

### Case 4: $(w_1,w_0)=(0,1)$

$$
L^r(0,1)
=-\log[\sigma(1)]
-\log[\sigma(1)]
-\log[1-\sigma(1)]
+0.1.
$$

$$
=-\log(0.73)-\log(0.73)-\log(0.27)+0.1.
$$

$$
L^r(0,1)=2.03.
$$

The lowest value among the four candidates is

$$
L^r(1,0)=0.85.
$$

So the optimal candidate is

$$
w_1=1,\qquad w_0=0.
$$

## 6.6 Logistic sigmoid plot

For the selected candidate $w_1=1,w_0=0$, the model is

$$
p(y=1\mid x)=\sigma(x)=\frac{1}{1+e^{-x}}.
$$

The figure on PDF p. 10 plots this sigmoid curve together with the three data points. Visually, the curve increases smoothly from near $0$ on the left to near $1$ on the right, with the data points at approximately $(-1,0)$, $(1,1)$, and $(2,1)$.

## Exam flags

- The marking notes explicitly award a mark for mentioning the **IID assumption**.
- The marking notes award marks for correctly writing each likelihood term.
- The marking notes award marks for correctly defining and expanding the negative log-likelihood.
- The marking notes award marks for computing each regularised loss value.

---

# 7. Cross-Entropy / Negative Log-Likelihood for Logistic Regression

**Source locations:** PDF pp. 10–11.  
**Exercise difficulty:** `(**)`.  
**Slide reference:** slide 58.

## 7.1 Key concept: cross-entropy as NLL

### Intuition

For logistic regression, each label $y_n\in\{0,1\}$ is modelled as a Bernoulli random variable. The negative log-likelihood penalises the model when it assigns low probability to the observed class.

### Formal definition

The exercise asks to derive the cross-entropy error function

$$
NLL(w)
$$

for logistic regression.

Start from

$$
NLL(w)=-\log p(y\mid w,X).
$$

Using the product form over $N$ data points:

$$
NLL(w)
=-\log\left[\prod_{n=1}^{N}\operatorname{Ber}(y_n\mid\sigma(w^\top x_n))\right].
$$

Using the log of a product:

$$
NLL(w)
=-\sum_{n=1}^{N}\log\operatorname{Ber}(y_n\mid\sigma(w^\top x_n)).
$$

## 7.2 Bernoulli distribution substitution

The Bernoulli distribution is defined as

$$
\operatorname{Ber}(y\mid\mu)=\mu^y(1-\mu)^{1-y}.
$$

For logistic regression,

$$
\mu=\sigma(w^\top x_n).
$$

Therefore,

$$
\operatorname{Ber}(y_n\mid\sigma(w^\top x_n))
=\sigma(w^\top x_n)^{y_n}[1-\sigma(w^\top x_n)]^{1-y_n}.
$$

Substitute into the NLL:

$$
NLL(w)
=-\sum_{n=1}^{N}\log\left[\sigma(w^\top x_n)^{y_n}[1-\sigma(w^\top x_n)]^{1-y_n}\right].
$$

Apply log rules:

$$
NLL(w)
=-\sum_{n=1}^{N}
\left\{
y_n\log[\sigma(w^\top x_n)]
+(1-y_n)\log[1-\sigma(w^\top x_n)]
\right\}.
$$

This is the binary cross-entropy / negative log-likelihood form for logistic regression.

---

# 8. Gradient of Logistic Regression Cross-Entropy

**Source locations:** PDF pp. 11–12.  
**Exercise difficulty:** `(**)`.  
**Slide reference:** slide 59.

## 8.1 Key concept: gradient of NLL

### Intuition

The gradient measures how the loss changes with the weights. For logistic regression, the gradient has the form

$$
\text{predicted probability} - \text{observed label}.
$$

### Formal scalar result

The final scalar-form gradient is

$$
g(w)=\frac{d}{dw}NLL(w)
=\sum_{n=1}^{N}[\sigma(w^\top x_n)-y_n]x_n.
$$

## 8.2 Derivation

Start with

$$
NLL(w)
=-\sum_{n=1}^{N}\left\{
y_n\log[\sigma(w^\top x_n)]
+(1-y_n)\log[1-\sigma(w^\top x_n)]
\right\}.
$$

Differentiate:

$$
g(w)
=-\sum_{n=1}^{N}\left\{
y_n\frac{d}{dw}\log[\sigma(w^\top x_n)]
+(1-y_n)\frac{d}{dw}\log[1-\sigma(w^\top x_n)]
\right\}.
$$

The derivative rules used are

$$
\frac{d\log a}{da}=\frac{1}{a},
$$

$$
\frac{d\sigma(a)}{da}=\sigma(a)(1-\sigma(a)),
$$

and

$$
\frac{d(w^\top x_n)}{dw}=x_n.
$$

The sheet explicitly says: **“Make sure you know or understand where these derivatives come from.”**

Apply the chain rule:

$$
g(w)
=-\sum_{n=1}^{N}\left\{
y_n\left[\frac{1}{\sigma(w^\top x_n)}\sigma(w^\top x_n)(1-\sigma(w^\top x_n))x_n\right]
\right.
$$

$$
\left.
+(1-y_n)\left[\frac{1}{1-\sigma(w^\top x_n)}\left(-\sigma(w^\top x_n)(1-\sigma(w^\top x_n))\right)x_n\right]
\right\}.
$$

Simplify the first bracket:

$$
\frac{1}{\sigma(w^\top x_n)}\sigma(w^\top x_n)(1-\sigma(w^\top x_n))x_n
=(1-\sigma(w^\top x_n))x_n.
$$

Simplify the second bracket:

$$
\frac{1}{1-\sigma(w^\top x_n)}[-\sigma(w^\top x_n)(1-\sigma(w^\top x_n))]x_n
=-\sigma(w^\top x_n)x_n.
$$

So

$$
g(w)
=-\sum_{n=1}^{N}\left\{
y_n(1-\sigma(w^\top x_n))x_n
+(1-y_n)(-\sigma(w^\top x_n))x_n
\right\}.
$$

Expand inside the sum:

$$
g(w)
=-\sum_{n=1}^{N}
[ y_nx_n-y_n\sigma(w^\top x_n)x_n-\sigma(w^\top x_n)x_n+y_n\sigma(w^\top x_n)x_n ].
$$

The two $y_n\sigma(\cdot)x_n$ terms cancel:

$$
g(w)
=-\sum_{n=1}^{N}[y_nx_n-\sigma(w^\top x_n)x_n].
$$

Therefore,

$$
g(w)=\sum_{n=1}^{N}[\sigma(w^\top x_n)-y_n]x_n.
$$

## 8.3 Matrix form

Define the vector of predicted probabilities:

$$
\sigma=[\sigma(w^\top x_1),\sigma(w^\top x_2),\ldots,\sigma(w^\top x_N)]^\top.
$$

Define

$$
y=[y_1,y_2,\ldots,y_N]^\top.
$$

Expanding the scalar gradient:

$$
\sum_{n=1}^{N}[\sigma(w^\top x_n)-y_n]x_n
$$

$$
=x_1[\sigma(w^\top x_1)-y_1]
+x_2[\sigma(w^\top x_2)-y_2]
+\cdots
+x_N[\sigma(w^\top x_N)-y_N].
$$

With

$$
X^\top=[x_1,x_2,\ldots,x_N],
$$

the compact matrix form is

$$
g(w)=X^\top(\sigma-y).
$$

## Exam flags

- This derivation is explicitly tied to **slide 59**.
- The sheet directly tells students to know where the derivative identities come from.
- The final matrix form is a compact result worth memorising:

$$
g(w)=X^\top(\sigma-y).
$$

## [UNCLEAR]

The source’s vector notation around $v$ and transposes is slightly garbled. The final matrix expression is clear:

$$
g(w)=X^\top(\sigma-y).
$$

---

# 9. Cross-Entropy, Log-Likelihood, and KL Divergence

**Source locations:** PDF pp. 12–14.  
**Exercise difficulty:** `(**)` with optional `(***)` KL part.  
**Slide reference:** slide 57 is mentioned when recalling the logistic regression NLL.

## 9.1 Key concept: empirical distribution for a binary label

### Intuition

For a single labelled data point, the true label can be treated as a distribution that places all probability mass on the observed class. Cross-entropy compares that empirical distribution with the model’s predicted distribution.

### Formal setup

For binary classification,

$$
y_n\in\{0,1\}.
$$

The logistic regression model is

$$
p(y=1\mid x,w)=\sigma(w^\top x).
$$

For a single data point $(x_n,y_n)$, define an empirical distribution $q_n$:

$$
q_n(y)=1 \quad \text{if } y=y_n,
$$

and

$$
q_n(y)=0 \quad \text{otherwise}.
$$

Cross-entropy between two discrete distributions is

$$
H(q,p)=-\sum_{y\in\{0,1\}}q(y)\log p(y).
$$

## 9.2 Single-sample cross-entropy for logistic regression

For one sample:

$$
H(q_n,p_n)
=-\sum_{y\in\{0,1\}}q_n(y)\log p(y\mid w,x_n).
$$

Expand over $y=0$ and $y=1$:

$$
H(q_n,p_n)
=-q_n(0)\log p(y=0\mid w,x_n)
-q_n(1)\log p(y=1\mid w,x_n).
$$

Since exactly one of $q_n(0)$ and $q_n(1)$ equals $1$,

$$
H(q_n,p_n)
=-(1-y_n)\log p(y=0\mid w,x_n)
-y_n\log p(y=1\mid w,x_n).
$$

For logistic regression:

$$
p(y=1\mid x_n,w)=\sigma(w^\top x_n),
$$

$$
p(y=0\mid x_n,w)=1-\sigma(w^\top x_n).
$$

Substitute:

$$
H(q_n,p_n)
=-y_n\log\sigma(w^\top x_n)
-(1-y_n)\log[1-\sigma(w^\top x_n)].
$$

Compactly:

$$
H(q_n,p_n)=-\log p(y_n\mid w,x_n).
$$

## 9.3 Average cross-entropy and NLL equivalence

The average cross-entropy is

$$
L_{CE}(w)=\frac{1}{N}\sum_{n=1}^{N}H(q_n,p_n).
$$

Substitute the single-sample expression:

$$
L_{CE}(w)=\frac{1}{N}\sum_{n=1}^{N}
[-y_n\log\sigma(w^\top x_n)-(1-y_n)\log(1-\sigma(w^\top x_n))].
$$

Factor out the negative:

$$
L_{CE}(w)
=-\frac{1}{N}\sum_{n=1}^{N}
[y_n\log\sigma(w^\top x_n)+(1-y_n)\log(1-\sigma(w^\top x_n))].
$$

The logistic regression negative log-likelihood is

$$
NLL(w)=-\log p(y\mid w,X)
$$

$$
=-\sum_{n=1}^{N}
[y_n\log\sigma(w^\top x_n)+(1-y_n)\log(1-\sigma(w^\top x_n))].
$$

Therefore,

$$
L_{CE}(w)=\frac{1}{N}NLL(w).
$$

Since $N$ is a positive constant,

$$
\arg\min_w L_{CE}(w)=\arg\min_w NLL(w).
$$

So minimising average cross-entropy is equivalent to maximising the log-likelihood.

## 9.4 KL divergence connection

The KL divergence is defined as

$$
D_{KL}(q\|p)=\sum_y q(y)\log\frac{q(y)}{p(y)}.
$$

The sheet gives the identity

$$
D_{KL}(q\|p)=H(q,p)-H(q).
$$

The entropy term is

$$
H(q)=-\sum_y q(y)\log q(y).
$$

The key point is that $H(q)$ depends only on the empirical distribution $q$, not on the model parameters $w$. Therefore,

$$
\arg\min_w D_{KL}(q\|p)
=\arg\min_w[H(q,p)-H(q)].
$$

Because $H(q)$ does not depend on $w$,

$$
\arg\min_w D_{KL}(q\|p)
=\arg\min_w H(q,p).
$$

Thus, when training the model, minimising cross-entropy is equivalent to minimising KL divergence from the empirical distribution to the model distribution.

## 9.5 Maximum likelihood as distribution matching

The exercise quotes *Deep Learning* by Goodfellow, Bengio and Courville:

> “any loss consisting of a negative log-likelihood is a cross-entropy between the empirical distribution defined by the training set and the probability distribution defined by the model.”

The sheet concludes that the ML criterion can be viewed as trying to make the model distribution match the observed data distribution.

## [UNCLEAR]

The solution refers to “question ??” when recalling the NLL formula. That cross-reference is broken in the PDF. The relevant formula is still given immediately afterward.

---

# 10. Poisson Regression

**Source locations:** PDF pp. 14–15.  
**Exercise difficulty:** `(***)`.

## 10.1 Key concept: Poisson regression

### Intuition

Poisson regression is used for count data. The model predicts the Poisson rate parameter $\mu$ from inputs $x$. The exponential link ensures that the rate is positive.

### Formal Poisson probability function

The sheet gives the Poisson probability function as

$$
p(y\mid\mu)=\operatorname{Poi}(y\mid\mu)=\frac{\mu^y}{y!}e^{-\mu},
$$

where

$$
\mu>0.
$$

The model defines

$$
\mu(w,x)=\exp(w^\top x)=e^{w^\top x}.
$$

Here,

$$
w\in\mathbb{R}^{p\times1},
$$

and

$$
x\in\mathbb{R}^{p\times1}.
$$

## 10.2 Likelihood under IID assumption

Given a dataset

$$
(x_1,y_1),\ldots,(x_N,y_N),
$$

define

$$
y=[y_1,\ldots,y_N]^\top,
$$

and

$$
X=[x_1,\ldots,x_N]^\top\in\mathbb{R}^{N\times p}.
$$

Using the IID assumption,

$$
p(y\mid X,w)=\prod_{n=1}^{N}p(y_n\mid w,x_n).
$$

For Poisson regression:

$$
p(y\mid X,w)=\prod_{n=1}^{N}\operatorname{Poi}(y_n\mid\mu(w,x_n)).
$$

Substitute the Poisson formula:

$$
p(y\mid X,w)
=\prod_{n=1}^{N}\frac{\mu(w,x_n)^{y_n}}{y_n!}\exp[-\mu(w,x_n)].
$$

This is the likelihood function.

## 10.3 Log-likelihood derivation

Take the logarithm:

$$
\log p(y\mid X,w)
=\sum_{n=1}^{N}\log\left[\frac{\mu(w,x_n)^{y_n}}{y_n!}\exp[-\mu(w,x_n)]\right].
$$

Use log rules:

$$
=\sum_{n=1}^{N}
[\log\mu(w,x_n)^{y_n}-\log y_n!+\log\exp[-\mu(w,x_n)]].
$$

Simplify:

$$
=\sum_{n=1}^{N}
[y_n\log\mu(w,x_n)-\log y_n!-\mu(w,x_n)].
$$

Now substitute

$$
\mu(w,x_n)=\exp(w^\top x_n).
$$

Then

$$
\log\mu(w,x_n)=\log\exp(w^\top x_n)=w^\top x_n.
$$

Also,

$$
\mu(w,x_n)=\exp(w^\top x_n).
$$

Therefore,

$$
\log p(y\mid X,w)
=\sum_{n=1}^{N}
[y_nw^\top x_n-\log y_n!-\exp(w^\top x_n)].
$$

## Exam flags

- This exercise is marked `(***)`.
- The question explicitly asks for **all steps required** to get to the log-likelihood function.
- The IID product likelihood, log transform, log-rule expansion, and substitution of $\mu(w,x)=\exp(w^\top x)$ are all high-value steps.

## [UNCLEAR]

The PDF says the Poisson “pdf” is used to model “continuous random variables of count data.” That phrase is internally inconsistent with the surrounding count-data examples and the presence of $y!$. For revision from this file, keep the formula and derivation, but re-check the lecture audio/slides for the lecturer’s exact wording.

---

# 11. Algorithmic Summaries

## 11.1 ML estimate of Gaussian variance

Given $w_*$:

1. Compute residuals:

$$
r=y-Xw_*.
$$

2. Compute residual sum of squares:

$$
RSS=r^\top r.
$$

3. Divide by $N$:

$$
\sigma_*^2=\frac{1}{N}RSS.
$$

Source result:

$$
\sigma_*^2=\frac{1}{N}(y-Xw_*)^\top(y-Xw_*).
$$

## 11.2 Ridge regression normal-equation workflow

1. Build the design matrix $X$, including a column of ones if using an intercept.
2. Compute

$$
A=X^\top X+\lambda I.
$$

3. Compute

$$
b=X^\top y.
$$

4. Solve

$$
Aw=b.
$$

5. Return

$$
w_*=A^{-1}b=(X^\top X+\lambda I)^{-1}X^\top y.
$$

The exercise sheet’s NumPy version solves the system using `np.linalg.solve(A,b)`.

## 11.3 Weighted least squares workflow

1. Put the weights $r_n$ on the diagonal of $R$.
2. Form the weighted normal equations:

$$
X^\top RXw=X^\top Ry.
$$

3. Solve:

$$
w_*=(X^\top RX)^{-1}X^\top Ry.
$$

## 11.4 Logistic regression gradient workflow

1. Compute scores:

$$
z_n=w^\top x_n.
$$

2. Compute probabilities:

$$
\sigma_n=\sigma(z_n).
$$

3. Compute prediction error vector:

$$
\sigma-y.
$$

4. Compute gradient:

$$
g(w)=X^\top(\sigma-y).
$$

## 11.5 Online SGD update for scalar slope $m$

For a sampled point $(x_i,y_i)$:

$$
m_{new}=m_{old}+2\eta[x_i(y_i-m_{old}x_i-c_{old})-m_{old}].
$$

---

# 12. Exam Flags and Revision Priorities

## Explicit or near-explicit exam flags

### Know the derivative identities in the logistic gradient derivation

The sheet explicitly says: **“Make sure you know or understand where these derivatives come from.”**

The derivatives are

$$
\frac{d\log a}{da}=\frac{1}{a},
$$

$$
\frac{d\sigma(a)}{da}=\sigma(a)(1-\sigma(a)),
$$

and

$$
\frac{d(w^\top x_n)}{dw}=x_n.
$$

### IID assumption matters

The logistic likelihood question’s marking notes give credit for mentioning the IID assumption. The Poisson regression derivation also explicitly assumes IID instances.

### Slide-linked derivations are high-value

- **Slide 24:** ML estimate of $\sigma_*^2$.
- **Slide 47:** ridge regression solution.
- **Slide 57:** logistic regression NLL recalled in the cross-entropy equivalence section.
- **Slide 58:** cross-entropy / NLL derivation.
- **Slide 59:** gradient of cross-entropy.

## Difficulty-based priorities from the sheet

### `(***)` highest priority derivations

- ML estimate of variance:

$$
\sigma_*^2=\frac{1}{N}(y-Xw_*)^\top(y-Xw_*).
$$

- Weighted least squares matrix form and optimum:

$$
E(w)=\frac{1}{2}(y-Xw)^\top R(y-Xw),
$$

$$
w_*=(X^\top RX)^{-1}X^\top Ry.
$$

- Ridge regression derivation:

$$
w_*=(X^\top X+\lambda I)^{-1}X^\top y.
$$

- Poisson regression log-likelihood:

$$
\log p(y\mid X,w)
=\sum_{n=1}^{N}[y_nw^\top x_n-\log y_n!-\exp(w^\top x_n)].
$$

### `(**)` medium-high priority

- Logistic regression likelihood and regularised loss.
- Cross-entropy / NLL derivation.
- Gradient of cross-entropy in scalar and matrix form.
- Cross-entropy equivalence to NLL and KL divergence.

### `(*)` lower difficulty but still useful mechanics

- Numerical ridge regression example.
- Polynomial basis prediction.
- Partial derivatives and online SGD update for $m$.

---

# 13. Connections

## Lecture-slide connections

The exercise sheet explicitly connects results to slides 24, 47, 57, 58, and 59 of the Linear Models lecture.

## Linear algebra lab notebooks

The ridge regression numerical example points to lab notebooks for linear algebra and linear models, especially solving systems $Ax=b$ using `np.linalg.solve`.

## Deep learning / probabilistic modelling

The cross-entropy section connects to Goodfellow, Bengio and Courville’s interpretation of negative log-likelihood as cross-entropy between the empirical distribution and the model distribution.

## Generalised linear models

Logistic regression and Poisson regression are both likelihood-based models:

- logistic regression uses a Bernoulli output model for binary labels;
- Poisson regression uses a Poisson output model for count data.

---

# 14. Unclear Sections to Revisit

## [MISSING SOURCE]

The lecture transcript and actual slide deck were not included in the chat. These notes are grounded in the uploaded exercise-solutions PDF only.

## [UNCLEAR] Ridge wording

The ridge derivation says to “maximise” $h(w)$, although $h(w)$ is written as a squared-error-plus-penalty objective. Re-check the lecture wording.

## [UNCLEAR] Polynomial basis indexing

The problem states $\phi_i(x)=x^i$ for $i=1,\ldots,M$, but the solution includes a bias term $1=x^0$. Re-check how the lecturer defines the basis vector.

## [UNCLEAR] Simple linear model optimum

The sheet gives $m_*$ in terms of $c_*$ and $c_*$ in terms of $m_*$, but does not solve the coupled system fully.

## [UNCLEAR] Logistic gradient vector notation

The scalar result and final matrix result are clear, but the intermediate vector/transposition notation is slightly garbled. Final result:

$$
g(w)=X^\top(\sigma-y).
$$

## [UNCLEAR] Broken reference

The cross-entropy / KL solution refers to “question ??” when recalling the NLL formula.

## [UNCLEAR] Poisson wording

The sheet describes Poisson as a “pdf” for “continuous random variables of count data,” which is likely a wording or source issue. The derivation itself uses the provided Poisson count-data formula.
