---
subject: COMP64501
chapter: 3
title: "Linear Models"
language: en
---

# Linear Models — Structured Study Notes

**Source note:** These notes were produced from the slide deck `linearmodels.pdf`. No lecture transcript was included in the message, so spoken derivations, verbal exam warnings, and transcript-only comments could not be incorporated. Sections where the slides omit details are marked `[UNCLEAR]`.

---

## Topic and scope

**Lecture topic:** Linear models in machine learning.

**Scope:** This lecture introduces linear regression as a probabilistic Gaussian regression model, maximum-likelihood estimation, normal equations, basis functions, gradient descent, stochastic gradient descent, regularisation, and logistic regression with cross-entropy loss.

---

## Course / lecture context

**Course:** Topics in Machine Learning, University of Manchester.  
**Lecturer:** Sara Summerton.  
**Broader subject fit:** Core supervised learning methods: regression for continuous outputs and logistic regression for binary classification.

---

## 1. Lecture roadmap

The slide contents list the following structure:

1. A regression model
2. Linear regression
3. Gradient descent
4. Stochastic Gradient Descent
5. Regularisation
6. Logistic regression
7. Cross-entropy error function
8. Optimisation and regularisation

---

## 2. Motivating example: Olympic 100m data

### 2.1 Dataset

The lecture uses **Olympic male 100m sprint times** as a running example.

- Input variable:

  $$
  x = \text{year of competition}
  $$

- Output variable:

  $$
  y = \text{time in seconds}
  $$

The plot on slide/page 4 shows years roughly from 1900 to 2000 on the horizontal axis and race time in seconds on the vertical axis. The red points show a generally decreasing trend: later years correspond to faster times.

### 2.2 Initial linear model

The lecture proposes a linear model:

$$
f(x, \mathbf{w}) = w_0 + w_1x
$$

where:

- $w_0$ is the **intercept**,
- $w_1$ is the **slope**,
- $\mathbf{w}$ refers collectively to both $w_0$ and $w_1$.

The plot on slide/page 6 overlays a straight blue line on the Olympic data. This illustrates fitting a linear trend to the scattered race-time observations.

---

## 3. Parenthesis: Gaussian probability density function

### 3.1 Intuition

The lecture reviews the Gaussian distribution because linear regression is later formulated probabilistically using Gaussian noise.

A Gaussian random variable is described by:

- a mean $\mu$, which controls the centre of the distribution,
- a variance $\sigma^2$, which controls the spread.

### 3.2 Formal definition

The Gaussian probability density function is:

$$
p(y)
=
\frac{1}{\sqrt{2\pi\sigma^2}}
\exp
\left\{
-
\frac{(y-\mu)^2}{2\sigma^2}
\right\}
$$

A Gaussian pdf requires two parameters:

$$
\mu, \sigma^2
$$

where:

- $\mu$ is the mean,
- $\sigma^2$ is the variance of the random variable $Y$.

The notation used is:

$$
p(y \mid \mu, \sigma^2) = \mathcal{N}(y \mid \mu, \sigma^2)
$$

or equivalently:

$$
y \sim \mathcal{N}(\mu, \sigma^2)
$$

### 3.3 Visual example

The plot on slide/page 9 compares two Gaussian distributions with the same mean:

$$
\mu = 2
$$

but different variances:

$$
\sigma^2 = 0.5
$$

and

$$
\sigma^2 = 2
$$

The solid curve has lower variance and is narrower/taller. The dashed curve has higher variance and is wider/flatter.

---

## 4. Linear regression model

### 4.1 Linear model with multiple attributes

For input attributes $x_1, \ldots, x_D$, a linear regression model predicts the output using a linear combination of the attributes:

$$
f(\mathbf{x}, \mathbf{w})
=
w_0 + w_1x_1 + \cdots + w_Dx_D
$$

where:

$$
w_0, w_1, \ldots, w_D
$$

are the model parameters.

### 4.2 Bias / intercept term

The parameter $w_0$ is called the **bias term** or **intercept**.

The slide notes:

$$
f(0, \mathbf{w}) = w_0
$$

so when the non-bias input components are zero, the model output is the intercept.

### 4.3 Vector form

The expression can be written compactly as:

$$
f(\mathbf{x}, \mathbf{w}) = \mathbf{w}^\top \mathbf{x}
$$

where:

$$
\mathbf{w}
=
[w_0, w_1, \ldots, w_D]^\top
$$

and

$$
\mathbf{x}
=
[1, x_1, \ldots, x_D]^\top
$$

The lecture explicitly notes:

$$
x_0 = 1
$$

This is how the intercept term is included inside the dot product.

---

## 5. Gaussian regression model

### 5.1 Model assumption

The Gaussian regression model relates inputs and outputs using:

$$
y = f(\mathbf{x}, \mathbf{w}) + \epsilon
$$

where:

$$
\epsilon \sim \mathcal{N}(0, \sigma^2)
$$

### 5.2 Intuition

Each observed output $y_i$ is assumed to be made of two parts:

1. the prediction from the underlying model:

   $$
   f(\mathbf{x}_i, \mathbf{w})
   $$

2. a noise term:

   $$
   \epsilon_i
   $$

So:

$$
y_i = f(\mathbf{x}_i, \mathbf{w}) + \epsilon_i
$$

The noise is Gaussian with mean zero and variance $\sigma^2$.

### 5.3 Distribution of $y$ for fixed $\mathbf{x}$ and $\mathbf{w}$

For a fixed $\mathbf{x}$ and fixed $\mathbf{w}$, the value $f(\mathbf{x}, \mathbf{w})$ is a constant.

So:

$$
y = \text{constant} + \epsilon
$$

where $\epsilon$ is a continuous Gaussian random variable.

The expected value is:

$$
\mathbb{E}\{y\}
=
\mathbb{E}\{\text{constant} + \epsilon\}
=
\text{constant}
$$

because:

$$
\mathbb{E}\{\epsilon\} = 0
$$

The variance is:

$$
\operatorname{var}\{y\}
=
\operatorname{var}\{\text{constant}\}
+
\operatorname{var}\{\epsilon\}
=
\sigma^2
$$

Therefore:

$$
y \sim \mathcal{N}(\text{constant}, \sigma^2)
$$

Since the constant is $f(\mathbf{x}, \mathbf{w})$, this becomes:

$$
y \sim \mathcal{N}(f(\mathbf{x}, \mathbf{w}), \sigma^2)
$$

or:

$$
p(y \mid \mathbf{x}, \mathbf{w}, \sigma^2)
=
\mathcal{N}(y \mid f(\mathbf{x}, \mathbf{w}), \sigma^2)
$$

### 5.4 Linear-Gaussian model

Using the linear form:

$$
f(\mathbf{x}, \mathbf{w}) = \mathbf{w}^\top \mathbf{x}
$$

we have:

$$
p(y \mid \mathbf{x}, \mathbf{w}, \sigma^2)
=
\mathcal{N}(y \mid \mathbf{w}^\top \mathbf{x}, \sigma^2)
$$

### 5.5 Prediction for a new input

If $\mathbf{w}$ is known, then for a new input $\mathbf{x}_*$, the model predicts:

$$
f(\mathbf{x}_*, \mathbf{w})
=
\mathbf{w}^\top \mathbf{x}_*
$$

The parameter $\sigma^2$ tells us the noise variance.

### 5.6 Visual interpretation

The diagram on slide/page 13 shows the Olympic 100m data with a fitted line. For a given input $x_0$, the model gives a central prediction:

$$
f(x_0, \mathbf{w})
$$

Around this prediction, the conditional distribution:

$$
p(y \mid x_0, \mathbf{w}, \sigma^2)
$$

is shown as a Gaussian distribution centred on the regression line. The diagram also labels a width of $2\sigma$, illustrating the spread around the predicted value.

---

## 6. Estimating $\mathbf{w}$: iid assumptions and likelihood

### 6.1 Training dataset

The training dataset is:

$$
(\mathbf{x}_1, y_1), \ldots, (\mathbf{x}_N, y_N)
$$

or:

$$
\mathcal{D} = \{(\mathbf{x}_n, y_n)\}_{n=1}^N
$$

### 6.2 Independence assumption

The lecture assumes the random variables $Y_1, \ldots, Y_N$ are independent.

Thus:

$$
p(y_1, \ldots, y_N \mid \mathbf{x}_1, \ldots, \mathbf{x}_N)
=
p(y_1 \mid \mathbf{x}_1)
\cdots
p(y_N \mid \mathbf{x}_N)
$$

which can be written:

$$
p(y_1, \ldots, y_N \mid \mathbf{x}_1, \ldots, \mathbf{x}_N)
=
\prod_{n=1}^N p(y_n \mid \mathbf{x}_n)
$$

### 6.3 Identical distribution assumption

The lecture also assumes the random variables $Y_1, \ldots, Y_N$ follow an identical distribution.

In this model, the distribution is Gaussian:

$$
p(y_n \mid \mathbf{x}_n, \mathbf{w}, \sigma^2)
=
\mathcal{N}(y_n \mid f(\mathbf{x}_n, \mathbf{w}), \sigma^2)
$$

Using the linear model:

$$
p(y_n \mid \mathbf{x}_n, \mathbf{w}, \sigma^2)
=
\mathcal{N}(y_n \mid \mathbf{w}^\top \mathbf{x}_n, \sigma^2)
$$

### 6.4 iid assumption

The two assumptions together are called the **iid assumption**:

$$
\text{iid} = \text{independent and identically distributed}
$$

---

## 7. Likelihood for Gaussian linear regression

### 7.1 Dataset notation

The output vector is:

$$
\mathbf{y}
=
[y_1, \ldots, y_N]^\top
\in \mathbb{R}^{N \times 1}
$$

The design matrix is:

$$
X
=
[\mathbf{x}_1, \ldots, \mathbf{x}_N]^\top
\in \mathbb{R}^{N \times (D+1)}
$$

Each row of $X$ corresponds to one input vector, including the leading $1$ for the intercept.

### 7.2 Joint likelihood

Using the iid assumptions:

$$
p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
=
\prod_{n=1}^N
p(y_n \mid \mathbf{x}_n, \mathbf{w}, \sigma^2)
$$

Substitute the Gaussian conditional distribution:

$$
p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
=
\prod_{n=1}^N
\mathcal{N}(y_n \mid \mathbf{w}^\top \mathbf{x}_n, \sigma^2)
$$

Expanding each Gaussian:

$$
p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
=
\prod_{n=1}^N
\frac{1}{\sqrt{2\pi\sigma^2}}
\exp
\left\{
-
\frac{(y_n - \mathbf{w}^\top \mathbf{x}_n)^2}{2\sigma^2}
\right\}
$$

Combining the product:

$$
p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
=
\frac{1}{(2\pi\sigma^2)^{N/2}}
\exp
\left\{
-
\frac{1}{2\sigma^2}
\sum_{n=1}^N
(y_n - \mathbf{w}^\top \mathbf{x}_n)^2
\right\}
$$

### 7.3 Pdf versus likelihood

The lecture distinguishes between a pdf and a likelihood.

#### Pdf interpretation

For a Gaussian pdf such as:

$$
p(y)
=
\frac{1}{\sqrt{2\pi\sigma^2}}
\exp
\left\{
-
\frac{(y-\mu)^2}{2\sigma^2}
\right\}
$$

we normally assume $\mu$ and $\sigma^2$ are given.

Similarly, for:

$$
p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
=
\prod_{n=1}^N
p(y_n \mid \mathbf{x}_n, \mathbf{w}, \sigma^2)
$$

if $\mathbf{w}^\top \mathbf{x}_n$ and $\sigma^2$ are known, then each term is interpreted as a pdf.

#### Likelihood interpretation

If the data $\{y_n\}_{n=1}^N$ and $\{\mathbf{x}_n\}_{n=1}^N$ are given, but $\mathbf{w}$ and $\sigma^2$ are unknown, then:

$$
p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
$$

is interpreted as a **likelihood function**.

The likelihood function is written:

$$
L(\mathbf{w}, \sigma^2)
=
p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
$$

It is a function of the parameters:

$$
\mathbf{w}, \sigma^2
$$

### 7.4 Maximum-likelihood criterion

The **maximum-likelihood criterion** estimates parameters by finding the values of $\mathbf{w}$ and $\sigma^2$ that maximise:

$$
L(\mathbf{w}, \sigma^2)
$$

That is:

$$
(\mathbf{w}^*, \sigma^{2*})
=
\arg\max_{\mathbf{w}, \sigma^2}
p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
$$

The slides state that multivariate calculus can be used to find the values that maximise the likelihood.

---

## 8. Log-likelihood and negative log-likelihood

### 8.1 Why use the log?

In practice, the lecture says we prefer to maximise the log of the likelihood.

The log-likelihood is:

$$
LL(\mathbf{w}, \sigma^2)
=
\log p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
$$

Using the Gaussian likelihood:

$$
LL(\mathbf{w}, \sigma^2)
=
-
\frac{N}{2}\log(2\pi)
-
\frac{N}{2}\log\sigma^2
-
\frac{1}{2\sigma^2}
\sum_{n=1}^N
(y_n - \mathbf{w}^\top \mathbf{x}_n)^2
$$

The lecture notes that the log is a monotonic function. Therefore, parameters that maximise the likelihood also maximise the log-likelihood.

### 8.2 Negative log-likelihood

Equivalently, we can minimise the negative log-likelihood:

$$
NLL(\mathbf{w}, \sigma^2)
=
-LL(\mathbf{w}, \sigma^2)
=
-\log p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
$$

So:

$$
NLL(\mathbf{w}, \sigma^2)
=
\frac{N}{2}\log(2\pi)
+
\frac{N}{2}\log\sigma^2
+
\frac{1}{2\sigma^2}
\sum_{n=1}^N
(y_n - \mathbf{w}^\top \mathbf{x}_n)^2
$$

### 8.3 Consistency of maximum likelihood

The slides state the following consistency property:

If the data was really generated according to the probability model specified, then the correct parameters will be recovered in the limit:

$$
N \to \infty
$$

---

## 9. Connection with residual sum of squares

### 9.1 Residual sum of squares

The residual sum of squares is:

$$
RSS(\mathbf{w})
=
\sum_{n=1}^N
(y_n - \mathbf{w}^\top \mathbf{x}_n)^2
$$

### 9.2 Link between NLL and RSS

If $\sigma^2$ is treated as fixed, then the terms in the NLL that depend on $\mathbf{w}$ are proportional to the RSS:

$$
NLL(\mathbf{w})
=
-\log p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
\propto
\sum_{n=1}^N
(y_n - \mathbf{w}^\top \mathbf{x}_n)^2
=
RSS(\mathbf{w})
$$

### 9.3 Key result

For linear regression, maximising the log-likelihood is equivalent to minimising the sum-of-squared errors, under the condition stated in the slide footnote:

- iid residuals,
- Gaussian residual distribution,
- fixed variance,
- optimising $\mathbf{w}$.

**Exam flag / high-value concept:** This equivalence between Gaussian maximum likelihood and least squares is a central result of the regression section.

---

## 10. Normal equation for linear regression

### 10.1 Starting point

The lecture derives an estimate for $\mathbf{w}$ from the log-likelihood:

$$
LL(\mathbf{w}, \sigma^2)
=
-
\frac{N}{2}\log(2\pi)
-
\frac{N}{2}\log\sigma^2
-
\frac{1}{2\sigma^2}
\sum_{n=1}^N
(y_n - \mathbf{w}^\top \mathbf{x}_n)^2
$$

In vector notation:

$$
LL(\mathbf{w}, \sigma^2)
=
-
\frac{N}{2}\log(2\pi)
-
\frac{N}{2}\log\sigma^2
-
\frac{1}{2\sigma^2}
(\mathbf{y} - X\mathbf{w})^\top
(\mathbf{y} - X\mathbf{w})
$$

### 10.2 Expanding the quadratic term

The final term expands as:

$$
(\mathbf{y} - X\mathbf{w})^\top
(\mathbf{y} - X\mathbf{w})
$$

$$
=
\mathbf{y}^\top \mathbf{y}
-
\mathbf{w}^\top X^\top \mathbf{y}
-
\mathbf{y}^\top X\mathbf{w}
+
\mathbf{w}^\top X^\top X\mathbf{w}
$$

So the log-likelihood contains terms involving $\mathbf{w}$:

$$
-\frac{1}{2\sigma^2}
\left(
\mathbf{y}^\top \mathbf{y}
-
\mathbf{w}^\top X^\top \mathbf{y}
-
\mathbf{y}^\top X\mathbf{w}
+
\mathbf{w}^\top X^\top X\mathbf{w}
\right)
$$

### 10.3 Taking gradients with respect to $\mathbf{w}$

The lecture differentiates term by term.

Terms independent of $\mathbf{w}$:

$$
\frac{d}{d\mathbf{w}}
\left[
-\frac{N}{2}\log(2\pi)
\right]
=
0
$$

$$
\frac{d}{d\mathbf{w}}
\left[
-\frac{N}{2}\log\sigma^2
\right]
=
0
$$

$$
\frac{d}{d\mathbf{w}}
\left[
-\frac{1}{2\sigma^2}\mathbf{y}^\top \mathbf{y}
\right]
=
0
$$

Linear terms:

$$
\frac{d}{d\mathbf{w}}
\left[
\frac{1}{2\sigma^2}
\mathbf{w}^\top X^\top \mathbf{y}
\right]
=
\frac{1}{2\sigma^2}
X^\top \mathbf{y}
$$

$$
\frac{d}{d\mathbf{w}}
\left[
\frac{1}{2\sigma^2}
\mathbf{y}^\top X\mathbf{w}
\right]
=
\frac{1}{2\sigma^2}
X^\top \mathbf{y}
$$

Quadratic term:

$$
\frac{d}{d\mathbf{w}}
\left[
-
\frac{1}{2\sigma^2}
\mathbf{w}^\top X^\top X\mathbf{w}
\right]
=
-
\frac{1}{2\sigma^2}
2X^\top X\mathbf{w}
$$

### 10.4 Combining the gradient terms

Putting these together:

$$
\frac{d}{d\mathbf{w}}
LL(\mathbf{w}, \sigma^2)
=
\frac{1}{2\sigma^2}X^\top \mathbf{y}
+
\frac{1}{2\sigma^2}X^\top \mathbf{y}
-
\frac{1}{2\sigma^2}2X^\top X\mathbf{w}
$$

Simplify:

$$
\frac{d}{d\mathbf{w}}
LL(\mathbf{w}, \sigma^2)
=
\frac{1}{\sigma^2}X^\top \mathbf{y}
-
\frac{1}{\sigma^2}X^\top X\mathbf{w}
$$

### 10.5 Set gradient to zero

To maximise the log-likelihood, set the gradient to zero:

$$
\frac{1}{\sigma^2}X^\top \mathbf{y}
-
\frac{1}{\sigma^2}X^\top X\mathbf{w}
=
0
$$

Multiply through by $\sigma^2$:

$$
X^\top \mathbf{y}
-
X^\top X\mathbf{w}
=
0
$$

Rearrange:

$$
X^\top X\mathbf{w}
=
X^\top \mathbf{y}
$$

Solve for $\mathbf{w}$:

$$
\mathbf{w}^*
=
(X^\top X)^{-1}X^\top \mathbf{y}
$$

### 10.6 Name of the result

The expression:

$$
\mathbf{w}^*
=
(X^\top X)^{-1}X^\top \mathbf{y}
$$

is called the **normal equation**.

### 10.7 Existence condition

The solution exists if:

$$
(X^\top X)^{-1}
$$

can be computed.

The inverse can be computed if $X^\top X$ is non-singular, for example:

- determinant different from zero,
- full rank.

**Exam flag / high-value concept:** Know the normal equation and the condition for the inverse to exist.

---

## 11. Solving for $\sigma^{2*}$

The slides state that, following a similar procedure, the maximum-likelihood solution for the variance is:

$$
\sigma^{2*}
=
\frac{1}{N}
(\mathbf{y} - X\mathbf{w}^*)^\top
(\mathbf{y} - X\mathbf{w}^*)
$$

This is the average squared residual under the fitted model.

**[UNCLEAR]** Derivation omitted in the slides. The transcript may contain the steps for differentiating the log-likelihood with respect to $\sigma^2$.

---

## 12. Basis functions

### 12.1 Motivation

The basic linear model:

$$
f(\mathbf{x}, \mathbf{w})
=
\mathbf{w}^\top \mathbf{x}
$$

only allows linear relationships between the input $x$ and the output $y$.

To describe nonlinear relationships, the lecture introduces **basis functions**.

### 12.2 Definition

Basis functions are nonlinear mappings from inputs to outputs/features.

They transform the original input into a new representation:

$$
\boldsymbol{\phi}(\mathbf{x})
$$

The predictive model becomes:

$$
f(\mathbf{x}, \mathbf{w})
=
w_0
+
\sum_{i=1}^M
w_i\phi_i(\mathbf{x})
$$

or in vector form:

$$
f(\mathbf{x}, \mathbf{w})
=
\mathbf{w}^\top \boldsymbol{\phi}(\mathbf{x})
$$

where:

$$
\boldsymbol{\phi}(\mathbf{x})
=
[1, \phi_1(\mathbf{x}), \ldots, \phi_M(\mathbf{x})]^\top
$$

There are $M+1$ parameters in $\mathbf{w}$.

### 12.3 Important modelling point

The model may be nonlinear in the original input $\mathbf{x}$, but it remains linear with respect to the parameters $\mathbf{w}$.

The slide says this is kept “for tractability.”

**Exam flag / high-value concept:** Basis functions allow nonlinear input-output relationships while preserving linearity in the parameters.

---

## 13. Examples of basis functions

The slide on page 26 shows three families of basis functions.

### 13.1 Polynomial basis functions

$$
\phi_i(x) = x^i
$$

These generate powers of the input.

For example, for a one-dimensional $x$, the feature vector might include:

$$
1, x, x^2, x^3, \ldots, x^M
$$

### 13.2 Exponential basis functions

The exponential basis functions are given as:

$$
\phi_i(x)
=
\exp
\left\{
-
\frac{(x-\mu_i)^2}{2s^2}
\right\}
$$

These are centred around values $\mu_i$ and have spread controlled by $s$.

### 13.3 Sigmoidal basis functions

The sigmoidal basis functions are:

$$
\phi_i(x)
=
\sigma
\left(
\frac{x-\mu_i}{s}
\right)
$$

where:

$$
\sigma(a)
=
\frac{1}{1+\exp(-a)}
$$

The visual on page 26 shows polynomial curves, bell-shaped exponential functions, and S-shaped sigmoidal functions.

---

## 14. Transforming inputs using polynomial basis functions

### 14.1 Olympic 100m example

The lecture returns to the Olympic 100m data and uses polynomial basis functions to predict:

$$
y = \text{time in seconds}
$$

from:

$$
x = \text{year of competition}
$$

For each scalar input $x$, compute:

$$
\boldsymbol{\phi}(x)
=
\begin{bmatrix}
1 \\
x \\
x^2 \\
x^3 \\
\vdots \\
x^M
\end{bmatrix}
$$

So a one-dimensional input is converted into a higher-dimensional feature representation:

$$
\boldsymbol{\phi}(x) \in \mathbb{R}^{M+1}
$$

### 14.2 Design matrix with basis functions

Given the original data matrix $X$, define a new design matrix $\Phi$:

$$
\Phi
=
\begin{bmatrix}
\boldsymbol{\phi}(x_1)^\top \\
\boldsymbol{\phi}(x_2)^\top \\
\vdots \\
\boldsymbol{\phi}(x_N)^\top
\end{bmatrix}
$$

Expanded:

$$
\Phi
=
\begin{bmatrix}
\phi_0(x_1) & \phi_1(x_1) & \cdots & \phi_M(x_1) \\
\phi_0(x_2) & \phi_1(x_2) & \cdots & \phi_M(x_2) \\
\vdots & \vdots & \ddots & \vdots \\
\phi_0(x_N) & \phi_1(x_N) & \cdots & \phi_M(x_N)
\end{bmatrix}
$$

where:

$$
\phi_0(x) = 1
$$

### 14.3 Gaussian regression with basis functions

The Gaussian linear regression problem becomes:

$$
p(\mathbf{y} \mid X, \mathbf{w}, \sigma^2)
=
\prod_{n=1}^N
\mathcal{N}
(y_n \mid \mathbf{w}^\top \boldsymbol{\phi}_n, \sigma^2)
$$

where:

$$
\boldsymbol{\phi}_n = \boldsymbol{\phi}(x_n)
$$

Using maximum likelihood, the normal equation becomes:

$$
\mathbf{w}^*
=
(\Phi^\top \Phi)^{-1}
\Phi^\top \mathbf{y}
$$

### 14.4 Worked example: Olympic 100m with $M=5$

The plot on page 29 shows the Olympic 100m data fitted with polynomial basis functions using:

$$
M = 5
$$

The fitted blue curve is nonlinear and bends to follow the red data points more closely than the simple straight-line model.

This example demonstrates that using basis functions can fit nonlinear patterns while still using a linear model in the transformed feature space.

---

## 15. Alternative to solving for $\mathbf{w}$: iterative optimisation

### 15.1 Computational cost of normal equations

To solve the normal equation, we need to invert:

$$
X^\top X
$$

The slide states that this matrix inversion has computational complexity between:

$$
O((D+1)^{2.4})
$$

and

$$
O((D+1)^3)
$$

depending on implementation.

The normal equation is linear in the number of training instances:

$$
O(N)
$$

### 15.2 When normal equations are suitable

The normal equation can handle a large training set as long as the data fits in memory.

### 15.3 When iterative optimisation is useful

The lecture says iterative optimisation can be used in cases with:

- a large number of features,
- too many instances to fit in memory.

This leads into gradient descent and stochastic gradient descent.

---

## 16. General optimisation problem

### 16.1 Objective function

We are given an objective function:

$$
h(\mathbf{w})
$$

where:

$$
\mathbf{w} \in \mathbb{R}^p
$$

The aim is to find a value of $\mathbf{w}$ that minimises $h(\mathbf{w})$.

### 16.2 Iterative update

Start with an initial value:

$$
\mathbf{w}_0
$$

Then use an iterative procedure:

$$
\mathbf{w}_{k+1}
=
\mathbf{w}_k + \eta \mathbf{d}_k
$$

where:

- $\mathbf{d}_k$ is the **search direction**,
- $\eta$ is the **step size** or **learning rate**.

The search direction should satisfy:

$$
h(\mathbf{w}_{k+1}) < h(\mathbf{w}_k)
$$

---

## 17. Gradient descent

### 17.1 Definition

Gradient descent is described as perhaps the simplest algorithm for unconstrained optimisation.

It assumes:

$$
\mathbf{d}_k = -\mathbf{g}_k
$$

where:

$$
\mathbf{g}_k
=
\mathbf{g}(\mathbf{w}_k)
=
\nabla h(\mathbf{w}_k)
$$

That is, the search direction is the negative gradient direction.

### 17.2 Update rule

Substituting $\mathbf{d}_k = -\mathbf{g}_k$ into the general iterative update gives:

$$
\mathbf{w}_{k+1}
=
\mathbf{w}_k - \eta \mathbf{g}_k
$$

Gradient descent is also called **steepest descent**.

---

## 18. Step size / learning rate

### 18.1 Main issue

The slide states:

> The main issue in gradient descent is how to set the step size.

The step size is:

$$
\eta
$$

### 18.2 If the step size is too small

If $\eta$ is too small, convergence is very slow.

### 18.3 If the step size is too large

If $\eta$ is too large, the method can fail to converge at all.

### 18.4 Visual example

The contour plots on page 34 show optimisation of:

$$
h(w_1, w_2)
=
0.5(w_1^2 - w_2)^2
+
0.5(w_1 - 1)^2
$$

The minimum is at:

$$
(1, 1)
$$

Two step sizes are compared:

- In plot (a):

  $$
  \eta = 0.1
  $$

- In plot (b):

  $$
  \eta = 0.6
  $$

The larger step size causes unstable-looking movement across the contours, illustrating why a step size that is too large can fail to converge.

**Exam flag / high-value concept:** Step-size choice is presented as the main issue in gradient descent.

### 18.5 Alternatives for choosing the step size

The lecture lists several alternatives:

1. **Line search methods**
   - There are different alternatives.
   - Line search methods may use search directions other than steepest descent.

2. **Conjugate gradient**
   - Described as the method of choice for quadratic objectives:

     $$
     g(\mathbf{w}) = \mathbf{w}^\top A\mathbf{w}
     $$

3. **Newton search direction**

**[UNCLEAR]** The slides list these alternatives but do not define line search, conjugate gradient, or Newton search direction in detail. Transcript needed if the lecturer explained them.

---

## 19. Gradient descent for linear regression

### 19.1 Objective function

For simplicity, the lecture uses the residual sum of squares objective, also called the sum of squared errors:

$$
E(\mathbf{w})
=
\frac{1}{2}
\sum_{n=1}^N
(y_n - \mathbf{w}^\top \mathbf{x}_n)^2
$$

The lecture notes that the negative log-likelihood could also be minimised instead:

$$
NLL(\mathbf{w})
$$

### 19.2 Gradient descent update

The update equation is:

$$
\mathbf{w}_{k+1}
=
\mathbf{w}_k
-
\eta
\left.
\frac{d}{d\mathbf{w}}E(\mathbf{w})
\right|_{\mathbf{w}=\mathbf{w}_k}
$$

### 19.3 Gradient of the squared error

The slide gives:

$$
\frac{d}{d\mathbf{w}}E(\mathbf{w})
=
\sum_{n=1}^N
(\mathbf{w}^\top \mathbf{x}_n - y_n)\mathbf{x}_n
$$

In matrix form:

$$
\frac{d}{d\mathbf{w}}E(\mathbf{w})
=
X^\top(X\mathbf{w} - \mathbf{y})
$$

### 19.4 Batch gradient descent update

Therefore:

$$
\mathbf{w}_{k+1}
=
\mathbf{w}_k
-
\eta X^\top(X\mathbf{w}_k - \mathbf{y})
$$

### 19.5 Batch nature of the algorithm

The gradient computation uses the whole dataset:

$$
(X, \mathbf{y})
$$

at every step.

For this reason, the algorithm is called **batch gradient descent**.

---

## 20. Gradient descent and feature scaling

The lecture states:

> Always normalise the features if using gradient descent.

Reasons given:

- Gradient descent converges faster if all features have a similar scale.
- If attributes are on very different scales, it may take a long time to converge.

**Exam flag / direct instruction:** “Always normalise the features if using gradient descent.”

---

## 21. Online learning and large datasets

### 21.1 Traditional gradient computation

Traditionally, the gradient $\mathbf{g}_k$ is computed using the whole dataset:

$$
\mathcal{D}
=
\{(\mathbf{x}_n, y_n)\}_{n=1}^N
$$

### 21.2 Settings where full-batch gradients are impractical

The slides mention two settings where only a subset of the data may be used.

#### Online learning

Instances arrive one at a time:

$$
(\mathbf{x}_n, y_n)
$$

#### Large datasets

Computing the exact gradient $\mathbf{g}_k$ may be expensive or impossible.

---

## 22. Stochastic gradient descent

### 22.1 Definition

In stochastic gradient descent, the gradient $\mathbf{g}_k$ is computed using only a subset of the available instances.

The word **stochastic** refers to the fact that the value of $\mathbf{g}_k$ depends on which subset of instances is chosen.

### 22.2 Sampling strategies

The slides mention two options.

#### Sampling with replacement

Used to “simulate” infinite data.

#### Sampling without replacement

Used for more stability.

One loop through the whole dataset without replacement is called an **epoch**.

---

## 23. Mini-batch gradient descent

### 23.1 Issue with gradient magnitude

The slide notes:

> Changing the size of the dataset changes the magnitude of the gradient.

### 23.2 Mini-batch gradient estimate

In the stochastic setting, a better estimate is obtained by averaging gradients over a subset $S$:

$$
\mathbf{g}_k
=
\frac{1}{|S|}
\sum_{i \in S}
\mathbf{g}_{k,i}
$$

where:

- $S \subseteq \mathcal{D}$,
- $|S|$ is the cardinality of $S$,
- $\mathbf{g}_{k,i}$ is the gradient at iteration $k$ computed using instance $(\mathbf{x}_i, y_i)$.

This is called **mini-batch gradient descent**.

---

## 24. Step size in stochastic gradient descent

### 24.1 Importance of $\eta$

Choosing the learning rate $\eta$ is particularly important in SGD.

The slide says there is no easy way to compute it.

### 24.2 Iteration-dependent learning rate

Usually the learning rate depends on the iteration $k$:

$$
\eta_k
$$

### 24.3 Robbins-Monro conditions

To guarantee convergence, the learning rate sequence should satisfy the Robbins-Monro conditions:

$$
\sum_{k=1}^{\infty}
\eta_k
=
\infty
$$

and

$$
\sum_{k=1}^{\infty}
\eta_k^2
<
\infty
$$

### 24.4 Example learning-rate schedules

The slides give:

$$
\eta_k = \frac{1}{k}
$$

and:

$$
\eta_k
=
\frac{1}{(\tau_0 + k)^\kappa}
$$

where:

- $\tau_0$ slows down early iterations,
- $\kappa \in (0.5, 1]$.

**Exam flag / high-value concept:** Know the Robbins-Monro conditions and the example schedules for SGD learning rates.

**[UNCLEAR]** Slide says “interations,” likely “iterations.”

---

## 25. Regularisation

### 25.1 Definition

Regularisation is a technique used to prevent overfitting in a predictive model.

It works by adding a term to the objective function that encourages simpler solutions.

### 25.2 Regularised objective for linear regression

For linear regression, the regularised objective is:

$$
h(\mathbf{w})
=
E(\mathbf{w}) + \lambda R(\mathbf{w})
$$

where:

- $E(\mathbf{w})$ is the data-fitting error term,
- $R(\mathbf{w})$ is the regularisation term,
- $\lambda$ is the regularisation parameter.

The slide notes that $NLL(\mathbf{w})$ can be used instead of $E(\mathbf{w})$.

If:

$$
\lambda = 0
$$

then:

$$
h(\mathbf{w}) = E(\mathbf{w})
$$

so there is no regularisation.

---

## 26. Types of regularisation

### 26.1 General regularisation term

The regularisation term in linear regression is typically written:

$$
R(\mathbf{w})
=
\alpha \|\mathbf{w}\|_1
+
(1-\alpha)
\frac{1}{2}
\|\mathbf{w}\|_2^2
$$

where:

$$
\|\mathbf{w}\|_1
=
\sum_{m=1}^{p}
|w_m|
$$

and:

$$
\|\mathbf{w}\|_2^2
=
\sum_{m=1}^{p}
w_m^2
$$

### 26.2 Lasso / $\ell_1$ regularisation

If:

$$
\alpha = 1
$$

then:

$$
R(\mathbf{w}) = \|\mathbf{w}\|_1
$$

This is $\ell_1$ regularisation, also called **Lasso**.

### 26.3 Ridge / $\ell_2$ regularisation

If:

$$
\alpha = 0
$$

then:

$$
R(\mathbf{w})
=
\frac{1}{2}\|\mathbf{w}\|_2^2
$$

This is $\ell_2$ regularisation, also called **Ridge** or **Tikhonov** regularisation.

### 26.4 Elastic net

If:

$$
0 < \alpha < 1
$$

then the regulariser combines $\ell_1$ and $\ell_2$ terms.

This is **elastic net** regularisation.

---

## 27. Ridge regression / $\ell_2$ regularisation

### 27.1 Ridge objective

In ridge regression:

$$
\alpha = 0
$$

The objective becomes:

$$
h(\mathbf{w})
=
\frac{1}{2}
\sum_{n=1}^{N}
(y_n - \mathbf{w}^\top \mathbf{x}_n)^2
+
\frac{\lambda}{2}
\mathbf{w}^\top \mathbf{w}
$$

### 27.2 Closed-form ridge solution

The slides state that the optimal solution is:

$$
\mathbf{w}^*
=
(X^\top X + \lambda I)^{-1}X^\top \mathbf{y}
$$

### 27.3 Optimisation alternatives

The lecture notes that $h(\mathbf{w})$ can also be optimised iteratively using:

- batch gradient descent,
- SGD,
- mini-batch SGD.

**[UNCLEAR]** Derivation of the ridge solution is omitted in the slides. Transcript needed if the lecturer derived it.

---

## 28. Logistic regression

### 28.1 Logistic regression as a probabilistic classifier

A logistic regression model is an example of a **probabilistic classifier**.

### 28.2 Binary classification setup

Let:

$$
\mathbf{x} \in \mathbb{R}^D
$$

represent a feature vector.

Let $y$ be the target value.

For a binary classification problem, the target can be encoded as:

$$
y \in \{0, 1\}
$$

or:

$$
y \in \{-1, +1\}
$$

The lecture then models the relationship between $y$ and $\mathbf{x}$ using a Bernoulli distribution.

---

## 29. Bernoulli distribution

### 29.1 Bernoulli random variable

A Bernoulli random variable $Y$ can take only two possible values.

The lecture example is a coin toss:

- heads is assigned:

  $$
  Y = 1
  $$

- tails is assigned:

  $$
  Y = 0
  $$

### 29.2 Bernoulli distribution definition

The Bernoulli distribution is:

$$
p(Y=y)
=
\operatorname{Ber}(y \mid \mu)
=
\begin{cases}
\mu, & y = 1 \\
1-\mu, & y = 0
\end{cases}
$$

where:

$$
\mu = P(Y=1)
$$

### 29.3 One-line expression

The same distribution can be written compactly as:

$$
p(Y=y)
=
\operatorname{Ber}(y \mid \mu)
=
\mu^y(1-\mu)^{1-y}
$$

This works for $y \in \{0,1\}$.

---

## 30. Logistic regression model

### 30.1 Conditional Bernoulli model

The target variable follows a Bernoulli distribution:

$$
p(y \mid \mathbf{x})
=
\operatorname{Ber}(y \mid \mu(\mathbf{x}))
$$

The probability:

$$
\mu = P(y=1)
$$

explicitly depends on $\mathbf{x}$.

### 30.2 Logistic sigmoid probability

In logistic regression:

$$
\mu(\mathbf{x})
=
\frac{1}{1+\exp(-\mathbf{w}^\top \mathbf{x})}
$$

This is written:

$$
\mu(\mathbf{x})
=
\sigma(\mathbf{w}^\top \mathbf{x})
$$

where $\sigma(z)$ is the logistic sigmoid function.

### 30.3 Final probabilistic model

Therefore:

$$
p(y \mid \mathbf{w}, \mathbf{x})
=
\operatorname{Ber}(y \mid \sigma(\mathbf{w}^\top \mathbf{x}))
$$

---

## 31. Logistic sigmoid function

### 31.1 Definition

The logistic sigmoid function is:

$$
\sigma(z)
=
\frac{1}{1+\exp(-z)}
$$

### 31.2 Key values and limits

The slides state:

If:

$$
z \to \infty
$$

then:

$$
\sigma(z) = 1
$$

If:

$$
z \to -\infty
$$

then:

$$
\sigma(z) = 0
$$

If:

$$
z = 0
$$

then:

$$
\sigma(z) = 0.5
$$

### 31.3 Mapping linear combinations to probabilities

For logistic regression:

$$
\sigma(\mathbf{w}^\top \mathbf{x})
$$

maps linear combinations to the interval:

$$
[0,1]
$$

For a one-dimensional example:

$$
\sigma(wx)
=
\frac{1}{1+\exp(-wx)}
$$

The plot on page 53 shows the standard S-shaped sigmoid curve from values near $0$ to values near $1$.

### 31.4 Logistic sigmoid in 2D

The slide on page 54 plots:

$$
\sigma(w_1x_1 + w_2x_2)
$$

for different parameter vectors:

$$
\mathbf{w} = [w_1, w_2]^\top
$$

The figure shows that different choices of $w_1$ and $w_2$ change the orientation and steepness of the sigmoid surface.

---

## 32. Decision boundary

### 32.1 Prediction after training

After training, we have an estimator for $\mathbf{w}$.

For a test input vector $\mathbf{x}_*$, compute:

$$
p(y=1 \mid \mathbf{w}, \mathbf{x}_*)
=
\sigma(\mathbf{w}^\top \mathbf{x}_*)
$$

This gives a value between $0$ and $1$.

### 32.2 Threshold rule

The slides define a threshold:

$$
0.5
$$

If the predicted probability is above or below this threshold, the test input is assigned to a class.

### 32.3 Linear decision boundary

Using the threshold $0.5$ induces a **linear decision boundary** in the input space.

Since:

$$
\sigma(z) = 0.5
$$

when:

$$
z = 0
$$

the boundary corresponds to:

$$
\mathbf{w}^\top \mathbf{x} = 0
$$

The slides state the linear decision boundary result, but do not explicitly write this last equation.

**[UNCLEAR]** The boundary equation $\mathbf{w}^\top\mathbf{x}=0$ follows from the slide’s sigmoid facts and threshold rule, but the slide itself only states that the threshold induces a linear decision boundary.

---

## 33. Cross-entropy error function

### 33.1 Dataset notation

The dataset is:

$$
\mathcal{D}
=
\{(\mathbf{x}_n, y_n)\}_{n=1}^N
$$

The input matrix is:

$$
X
=
[\mathbf{x}_1, \ldots, \mathbf{x}_N]^\top
$$

The output vector is:

$$
\mathbf{y}
=
[y_1, \ldots, y_N]^\top
$$

### 33.2 IID likelihood for logistic regression

Assuming iid observations:

$$
p(\mathbf{y} \mid \mathbf{w}, X)
=
\prod_{n=1}^{N}
p(y_n \mid \mathbf{w}, \mathbf{x}_n)
$$

Substituting the Bernoulli logistic model:

$$
p(\mathbf{y} \mid \mathbf{w}, X)
=
\prod_{n=1}^{N}
\operatorname{Ber}
(y_n \mid \sigma(\mathbf{w}^\top \mathbf{x}_n))
$$

### 33.3 Cross-entropy / negative log-likelihood

The cross-entropy function, or negative log-likelihood, is:

$$
NLL(\mathbf{w})
=
-
\log p(\mathbf{y} \mid \mathbf{w}, X)
$$

The slide gives:

$$
NLL(\mathbf{w})
=
-
\sum_{n=1}^{N}
\left\{
y_n \log[\sigma(\mathbf{w}^\top \mathbf{x}_n)]
+
(1-y_n)
\log[1-\sigma(\mathbf{w}^\top \mathbf{x}_n)]
\right\}
$$

This function can be minimised with respect to $\mathbf{w}$.

**Exam flag / high-value concept:** Logistic regression uses Bernoulli likelihood, and minimising cross-entropy is minimising the negative log-likelihood.

---

## 34. Gradient of logistic regression NLL

The slide gives the gradient:

$$
\mathbf{g}(\mathbf{w})
=
\frac{d}{d\mathbf{w}}NLL(\mathbf{w})
$$

$$
=
\sum_{n=1}^{N}
[\sigma(\mathbf{w}^\top \mathbf{x}_n) - y_n]\mathbf{x}_n
$$

In matrix form:

$$
\mathbf{g}(\mathbf{w})
=
X^\top(\boldsymbol{\sigma} - \mathbf{y})
$$

where:

$$
\boldsymbol{\sigma}
=
[
\sigma(\mathbf{w}^\top \mathbf{x}_1),
\ldots,
\sigma(\mathbf{w}^\top \mathbf{x}_N)
]^\top
$$

**[UNCLEAR]** The slide says “It can be shown” and gives the final gradient, but the derivation is not included in the slide deck.

---

## 35. Optimisation and regularisation for logistic regression

The final slide states that SGD methods described earlier can be applied to find the parameter vector $\mathbf{w}$ that minimises the logistic regression negative log-likelihood:

$$
NLL(\mathbf{w})
$$

The same regularisation techniques covered earlier can be added to the cross-entropy error function:

- Lasso,
- Ridge,
- elastic net.

So, for logistic regression, the objective may be extended from:

$$
NLL(\mathbf{w})
$$

to a regularised objective of the form:

$$
NLL(\mathbf{w}) + \lambda R(\mathbf{w})
$$

where $R(\mathbf{w})$ is one of the regularisers introduced earlier.

---

## 36. Worked examples preserved from the slides

### Example 1: Olympic 100m simple linear model

**Given:**

- $x =$ year of Olympic competition
- $y =$ time in seconds

**Model:**

$$
f(x,\mathbf{w}) = w_0 + w_1x
$$

**Interpretation:**

- $w_0$: intercept
- $w_1$: slope
- Blue fitted line on the page 6 plot gives a linear decreasing trend over time.

**Answer / result shown:**

The fitted model is a straight line through the Olympic 100m data.

### Example 2: Gaussian pdf with different variances

**Given:**

$$
\mu = 2
$$

Two variances:

$$
\sigma^2 = 0.5
$$

and:

$$
\sigma^2 = 2
$$

**Result shown:**

- Smaller variance gives a narrower, taller Gaussian.
- Larger variance gives a wider, flatter Gaussian.

### Example 3: Gaussian regression visualisation

**Given:**

A fitted regression line:

$$
f(x,\mathbf{w})
$$

and a particular input:

$$
x_0
$$

**Model:**

$$
p(y \mid x_0, \mathbf{w}, \sigma^2)
=
\mathcal{N}(y \mid f(x_0,\mathbf{w}), \sigma^2)
$$

**Result shown:**

The output distribution is centred at the regression prediction, with spread controlled by $\sigma^2$.

### Example 4: Olympic 100m polynomial basis model with $M=5$

**Given:**

Polynomial basis functions:

$$
\boldsymbol{\phi}(x)
=
[1, x, x^2, \ldots, x^M]^\top
$$

with:

$$
M = 5
$$

**Model:**

$$
f(x,\mathbf{w})
=
\mathbf{w}^\top \boldsymbol{\phi}(x)
$$

**Normal equation:**

$$
\mathbf{w}^*
=
(\Phi^\top\Phi)^{-1}\Phi^\top\mathbf{y}
$$

**Result shown:**

The fitted curve is nonlinear and follows the Olympic data more flexibly than a straight line.

### Example 5: Gradient descent step size

**Objective:**

$$
h(w_1,w_2)
=
0.5(w_1^2-w_2)^2
+
0.5(w_1-1)^2
$$

**Minimum:**

$$
(1,1)
$$

**Compared step sizes:**

$$
\eta = 0.1
$$

and:

$$
\eta = 0.6
$$

**Result shown:**

- Smaller step size gives slower, more controlled movement.
- Larger step size can fail to converge.

---

## 37. Key concept glossary

### Linear regression

A regression model that predicts a continuous output using a linear combination of input features:

$$
f(\mathbf{x},\mathbf{w}) = \mathbf{w}^\top \mathbf{x}
$$

### Bias / intercept

The parameter $w_0$ included by augmenting the input with:

$$
x_0 = 1
$$

It gives:

$$
f(0,\mathbf{w}) = w_0
$$

### Gaussian regression model

A probabilistic regression model assuming:

$$
y = f(\mathbf{x},\mathbf{w}) + \epsilon
$$

with:

$$
\epsilon \sim \mathcal{N}(0,\sigma^2)
$$

so:

$$
p(y \mid \mathbf{x},\mathbf{w},\sigma^2)
=
\mathcal{N}(y \mid f(\mathbf{x},\mathbf{w}),\sigma^2)
$$

### iid assumption

The assumption that observations are independent and identically distributed.

For this model:

$$
p(\mathbf{y}\mid X,\mathbf{w},\sigma^2)
=
\prod_{n=1}^{N}
p(y_n\mid \mathbf{x}_n,\mathbf{w},\sigma^2)
$$

### Likelihood

When the data is fixed and parameters are unknown:

$$
L(\mathbf{w},\sigma^2)
=
p(\mathbf{y}\mid X,\mathbf{w},\sigma^2)
$$

is treated as a function of the parameters.

### Maximum likelihood

The parameter-estimation criterion that chooses parameters that maximise the likelihood.

### Negative log-likelihood

The negative of the log-likelihood:

$$
NLL = -LL
$$

It is often minimised instead of maximising the likelihood.

### Residual sum of squares

$$
RSS(\mathbf{w})
=
\sum_{n=1}^{N}
(y_n-\mathbf{w}^\top\mathbf{x}_n)^2
$$

For Gaussian regression with fixed variance, minimising RSS is equivalent to maximising the log-likelihood with respect to $\mathbf{w}$.

### Normal equation

Closed-form solution for least-squares linear regression:

$$
\mathbf{w}^*
=
(X^\top X)^{-1}X^\top\mathbf{y}
$$

### Basis functions

Mappings $\phi_i(x)$ that transform inputs into a feature representation so that nonlinear input-output relationships can be modelled while remaining linear in $\mathbf{w}$:

$$
f(x,\mathbf{w})
=
\mathbf{w}^\top\boldsymbol{\phi}(x)
$$

### Gradient descent

An iterative method for minimising an objective function:

$$
\mathbf{w}_{k+1}
=
\mathbf{w}_k-
\eta \nabla h(\mathbf{w}_k)
$$

### Batch gradient descent

Gradient descent where the gradient is computed using the full dataset at each iteration.

### Stochastic gradient descent

Gradient descent where the gradient is computed using a subset of instances.

### Mini-batch gradient descent

SGD where the gradient is averaged over a subset $S$:

$$
\mathbf{g}_k
=
\frac{1}{|S|}
\sum_{i\in S}
\mathbf{g}_{k,i}
$$

### Epoch

One loop through the whole dataset when sampling without replacement.

### Regularisation

Adding a penalty term to the objective function to encourage simpler solutions and prevent overfitting:

$$
h(\mathbf{w})
=
E(\mathbf{w})+\lambda R(\mathbf{w})
$$

### Lasso

$\ell_1$ regularisation:

$$
\|\mathbf{w}\|_1
=
\sum_{m=1}^{p}|w_m|
$$

### Ridge

$\ell_2$ regularisation:

$$
\frac{1}{2}\|\mathbf{w}\|_2^2
=
\frac{1}{2}\sum_{m=1}^{p}w_m^2
$$

### Elastic net

A combination of $\ell_1$ and $\ell_2$ regularisation:

$$
R(\mathbf{w})
=
\alpha\|\mathbf{w}\|_1
+
(1-\alpha)\frac{1}{2}\|\mathbf{w}\|_2^2
$$

### Logistic regression

A probabilistic classifier for binary classification using:

$$
p(y\mid \mathbf{w},\mathbf{x})
=
\operatorname{Ber}(y\mid\sigma(\mathbf{w}^\top\mathbf{x}))
$$

### Bernoulli distribution

A probability distribution for a binary random variable:

$$
p(Y=y)
=
\mu^y(1-\mu)^{1-y}
$$

### Logistic sigmoid

$$
\sigma(z)
=
\frac{1}{1+\exp(-z)}
$$

It maps real-valued inputs to $[0,1]$.

### Cross-entropy error

The negative log-likelihood for logistic regression:

$$
NLL(\mathbf{w})
=
-
\sum_{n=1}^{N}
\left\{
y_n\log[\sigma(\mathbf{w}^\top\mathbf{x}_n)]
+
(1-y_n)\log[1-\sigma(\mathbf{w}^\top\mathbf{x}_n)]
\right\}
$$

---

## 38. Exam flags and high-value points

No explicit “this will be on the exam” statement appears in the slides I received. From the slide wording, the following are clearly high-value:

1. **Gaussian regression model**

   $$
   y = f(\mathbf{x},\mathbf{w}) + \epsilon,\quad
   \epsilon\sim\mathcal{N}(0,\sigma^2)
   $$

2. **Likelihood under iid Gaussian assumptions**

   $$
   p(\mathbf{y}\mid X,\mathbf{w},\sigma^2)
   =
   \prod_{n=1}^{N}
   \mathcal{N}(y_n\mid \mathbf{w}^\top\mathbf{x}_n,\sigma^2)
   $$

3. **Equivalence between Gaussian ML and RSS minimisation** when variance is fixed.

4. **Normal equation**

   $$
   \mathbf{w}^*
   =
   (X^\top X)^{-1}X^\top\mathbf{y}
   $$

5. **Condition for normal equation solution**: $X^\top X$ must be non-singular / full-rank.

6. **Basis functions**

   $$
   f(x,\mathbf{w})
   =
   \mathbf{w}^\top\boldsymbol{\phi}(x)
   $$

7. **Gradient descent update**

   $$
   \mathbf{w}_{k+1}
   =
   \mathbf{w}_k-
   \eta\nabla h(\mathbf{w}_k)
   $$

8. **Feature scaling warning:** Always normalise features when using gradient descent.

9. **Robbins-Monro conditions**

   $$
   \sum_{k=1}^{\infty}\eta_k=\infty,
   \qquad
   \sum_{k=1}^{\infty}\eta_k^2<\infty
   $$

10. **Regularisation objective**

    $$
    h(\mathbf{w})
    =
    E(\mathbf{w})+\lambda R(\mathbf{w})
    $$

11. **Ridge solution**

    $$
    \mathbf{w}^*
    =
    (X^\top X+\lambda I)^{-1}X^\top\mathbf{y}
    $$

12. **Logistic regression model**

    $$
    p(y\mid\mathbf{w},\mathbf{x})
    =
    \operatorname{Ber}(y\mid\sigma(\mathbf{w}^\top\mathbf{x}))
    $$

13. **Cross-entropy / logistic regression NLL**

    $$
    NLL(\mathbf{w})
    =
    -
    \sum_{n=1}^{N}
    \left\{
    y_n\log[\sigma(\mathbf{w}^\top\mathbf{x}_n)]
    +
    (1-y_n)\log[1-\sigma(\mathbf{w}^\top\mathbf{x}_n)]
    \right\}
    $$

14. **Gradient of logistic NLL**

    $$
    \mathbf{g}(\mathbf{w})
    =
    X^\top(\boldsymbol{\sigma}-\mathbf{y})
    $$

---

## 39. Connections made in the lecture

### Regression to probability

The lecture connects ordinary linear regression to a probabilistic Gaussian model by adding Gaussian noise to the deterministic prediction.

### Maximum likelihood to least squares

The lecture connects maximum-likelihood estimation under Gaussian noise to minimising residual sum of squares.

### Linear models to nonlinear fitting

The lecture connects simple linear regression to nonlinear-looking regression via basis functions while keeping the model linear in the parameters.

### Closed-form solution to iterative optimisation

The lecture connects normal equations to gradient-based optimisation by explaining that matrix inversion can be computationally expensive or memory-limited.

### Batch learning to online / large-scale learning

The lecture connects batch gradient descent to stochastic and mini-batch gradient descent for online learning and large datasets.

### Regression to classification

The lecture moves from Gaussian regression for continuous $y$ to Bernoulli logistic regression for binary $y$.

### Regularisation across models

The lecture connects regularisation in linear regression to regularisation in logistic regression, saying the same Lasso, Ridge, and elastic net penalties can be added to cross-entropy.

---

## 40. Unclear / transcript-needed sections

Because no transcript was included, these are the places where the slides alone omit details:

1. **[UNCLEAR] Derivation of $\sigma^{2*}$**  
   The slide gives:

   $$
   \sigma^{2*}
   =
   \frac{1}{N}
   (\mathbf{y}-X\mathbf{w}^*)^\top
   (\mathbf{y}-X\mathbf{w}^*)
   $$

   but does not show the differentiation steps.

2. **[UNCLEAR] Basis function discussion depth**  
   Slides define polynomial, exponential, and sigmoidal basis functions, but any spoken intuition about when to use each type is absent.

3. **[UNCLEAR] Line search / conjugate gradient / Newton direction**  
   These are listed as alternatives for choosing step size/search direction, but not explained in the slides.

4. **[UNCLEAR] Ridge regression derivation**  
   The slide gives:

   $$
   \mathbf{w}^*
   =
   (X^\top X+\lambda I)^{-1}X^\top\mathbf{y}
   $$

   but does not show the derivation.

5. **[UNCLEAR] Logistic regression decision boundary details**  
   Slides state that the $0.5$ threshold induces a linear decision boundary, but do not explicitly derive:

   $$
   \mathbf{w}^\top\mathbf{x}=0
   $$

6. **[UNCLEAR] Logistic NLL gradient derivation**  
   The slide gives:

   $$
   \mathbf{g}(\mathbf{w})
   =
   X^\top(\boldsymbol{\sigma}-\mathbf{y})
   $$

   but does not derive it.

7. **[UNCLEAR] Any explicit exam guidance**  
   The slides contain no explicit “this is on the exam” statements. The transcript is needed to capture spoken exam flags, common mistakes, or lecturer emphasis.
