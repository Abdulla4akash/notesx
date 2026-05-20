---
subject: COMP64802
chapter: 1
title: "Weeks 1-5"
language: en
---

# Advanced Topics in ML (COMP 64802) — Weeks 1–5 Study Notes

**Course:** Advanced Topics in ML — COMP 64802  
**Lecture topic:** Introduction and Weeks 1–5 foundations for representation learning  
**Source:** Uploaded lecture slides only; no transcript was provided.

**Topic and scope.** This lecture block sets up the mathematical and algorithmic foundations for modern representation learning: high-dimensional data, risk minimisation, convex/non-convex optimisation, gradient descent, Johnson–Lindenstrauss dimensionality reduction, neural networks, autoencoders, generative modelling, and variational autoencoders.

**Source note.** These notes are built from the slides only. Standard mathematical details added for revision are marked **[ADDED DETAIL]**. Potential slide typos, ambiguous notation, or garbled parts are marked **[UNCLEAR]**.

---

## 0. Course logistics and assessment

### Teaching split

- Weeks/lectures 1–5: taught by **Anirbit**.
- Weeks/lectures 6–10: taught by **Omar**.
- Graduate Teaching Assistants are available to help with the material.

### Prerequisites

You are expected to know:

- basic machine learning;
- some PyTorch coding.

Some basic PyTorch and ML material will still be demonstrated during the course.

### Teaching materials

All relevant materials are on Blackboard/Canvas and include:

- video recordings for some of Anirbit’s part;
- formative/unassessed practice questions;
- lecture slides, including demonstration code.

### Tutorials / computer classes

- Thursday computer/tutorial sessions are scheduled in Kilburn 1.8 + 1.10 and LF31.
- Time: 12:00–14:30.
- The course calendar has unusual features, so the exact lecture/tutorial dates should be checked carefully.

### Interaction

Canvas has pinned discussion forums:

- one for anonymous course feedback;
- one for anonymous questions about the content.

Questions may be answered on Canvas, in class, or during Thursday computer classes.

### Assessment

#### Final exam

**[EXAM FLAG]** The final exam is:

- 2 hours;
- fully MCQ-based;
- conducted online on Canvas;
- 50 marks total:
  - 25 marks from lectures 1–5;
  - 25 marks from lectures 6–10;
- MCQs usually have 1, 2, or 3 marks depending on difficulty.

**[EXAM FLAG]** The exam is mainly about the **theory of representation learning**, with a few questions on coding aspects.

#### Coursework

- There are 2 courseworks.
- Both count towards the final score.
- Around 14 days are given for each coursework.
- Dates are on Canvas.

---

## 1. Introduction: data as high-dimensional vectors

### 1.1 Data are vectors in high dimensions

The lecture begins from a core modern ML viewpoint:

> Real-world data are usually represented as high-dimensional real-valued vectors.

Examples:

#### Images

- A high-quality image has millions of pixels.
- Each pixel is represented by one or more real numbers, usually bounded.
- Therefore an image can be treated as a vector in a very high-dimensional real vector space.

For example, if an image has \(m\) scalar pixel values, then the image is represented as:

\[
x \in \mathbb{R}^m.
\]

#### Text / GPT-style models

- Text is split into character clusters or **tokens**.
- Each token is represented, or **embedded**, as a real vector.
- The slides mention embeddings of around \(800\) dimensions.
- A sentence is therefore not input as raw characters, but as a collection/sequence of vectors.

So a sentence of \(T\) tokens may be represented informally as:

\[
(x_1, x_2, \dots, x_T), \qquad x_i \in \mathbb{R}^{800}.
\]

#### Functions as data

Modern ML may take real-valued functions as input.

A function \(f\) can be encoded by sampling it at chosen points:

\[
f \quad \leadsto \quad [f(x_1), f(x_2), \dots, f(x_m)].
\]

Here:

- \((x_1,\dots,x_m)\) are chosen points in the function’s domain;
- the encoded function becomes an \(m\)-dimensional vector;
- even simple functions may require \(m\) in the hundreds.

### 1.2 Low-dimensional representations

The lecture then asks:

> Are there low-dimensional representations of high-dimensional data?

The answer is often yes, because:

- the coordinates of real-world data are often not independent;
- relationships between coordinates can be inferred:
  - from data;
  - from prior knowledge;
- this suggests that high-dimensional data may lie close to some lower-dimensional structure.

**Key course theme:** studying low-dimensional representations is the crux of the course.

However:

> There is no escape from high dimensions.

Even if the final representation is low-dimensional, the process of finding that representation usually has to process very high-dimensional data.

---

## 2. High-dimensional intuition: low-dimensional pictures mislead

The slides give a geometric example to warn against trusting 2D/3D intuition in high dimensions.

### 2.1 Setup: a \(d\)-dimensional cube

Imagine the diagram as a cube in \(d\) dimensions:

\[
[-1,1]^d.
\]

The side length of this cube is \(2\).

The diagonal length of the \(d\)-dimensional cube is obtained by Pythagoras:

\[
\sqrt{2^2 + 2^2 + \cdots + 2^2}
= \sqrt{d \cdot 2^2}
= 2\sqrt{d}.
\]

### 2.2 Inner sphere radius

The diagram has outer white spheres/circles with diameter \(1\), so radius:

\[
\frac{1}{2}.
\]

An inner black sphere is centred at the origin and has radius \(r\).

The slide compares the distance from the centre of the cube to the centre of one of the outer spheres in two ways.

The distance from the centre of the cube to the relevant corner/centre direction is:

\[
\frac14 \cdot (2\sqrt d)
=
\frac{\sqrt d}{2}.
\]

Since the inner sphere touches the outer sphere:

\[
r + \frac12 = \frac{\sqrt d}{2}.
\]

Therefore:

\[
r = \frac12(\sqrt d - 1).
\]

### 2.3 Main lesson

As \(d \to \infty\),

\[
r = \frac12(\sqrt d - 1) \to \infty.
\]

So the “inner” sphere’s radius grows without bound and becomes largely “outside” the square/cube intuition.

**[EXAM/REVISION FLAG]** The slide explicitly states:

> Low-dimensional pictures are very misleading.

This is a conceptual warning for the whole course: high-dimensional geometry behaves very differently from 2D/3D geometry.

---

## 3. Seven foundational concepts

The lecture introduces seven concepts, numbered backwards from Concept 7 to Concept 1.

---

## 3.1 Concept 7 — Random variables

### Intuition

Data are uncertain.

Machine learning algorithms do not usually receive a single fixed deterministic object. Instead, data are modelled as samples from some uncertain process.

The formal language for this uncertainty is the language of **random variables**.

### Random variables used in this course

The course focuses on random variables taking values in Euclidean space:

\[
x \in \mathbb{R}^n.
\]

Here \(n\) is typically the data dimension.

For example:

- an image vector may be \(x \in \mathbb{R}^{10^6}\);
- a token embedding may be \(x \in \mathbb{R}^{800}\);
- a function encoding may be \(x \in \mathbb{R}^m\).

### Probability density function

The slides assume “nice random variables” that are entirely described by a probability distribution function:

\[
p : \mathbb{R}^n \to [0,\infty).
\]

More precisely, this is a **probability density function** for continuous random variables.

The function \(p\) encodes the “fuzziness” or uncertainty of the data-generating process.

**[UNCLEAR / TERMINOLOGY]** The slides call this a “probability distribution function”. For continuous variables, the object \(p(x)\) is more precisely called a **probability density function**. A distribution function usually means a cumulative distribution function.

### Events and probability mass

For any event/subset:

\[
A \subseteq \mathbb{R}^n,
\]

the probability that the random variable lies in \(A\) is:

\[
\mathbb{P}[x \in A]
=
\int_A p(x)\,dx.
\]

The total probability over all of space must be \(1\):

\[
\int_{\mathbb{R}^n} p(x)\,dx = 1.
\]

### Example 1: Uniform distribution on \([-2,2]\)

The slide gives:

\[
p(x) =
\begin{cases}
\frac14, & x \in [-2,2],\\
0, & \text{otherwise}.
\end{cases}
\]

This means:

- every value in \([-2,2]\) is equally likely;
- values outside \([-2,2]\) are impossible.

Check the total mass:

\[
\int_{-\infty}^{\infty} p(x)\,dx
=
\int_{-2}^{2} \frac14\,dx
=
\frac14(2 - (-2))
=
\frac14 \cdot 4
=
1.
\]

### Example 2: Two-dimensional Gaussian distribution

The slide gives:

\[
p(x,y)
=
\frac{e^{-\frac12(x^2+y^2)}}{2\pi},
\qquad (x,y)\in \mathbb{R}^2.
\]

This is the standard two-dimensional Gaussian density:

\[
(x,y) \sim \mathcal{N}(0,I_2).
\]

Interpretation:

- any point in \(\mathbb{R}^2\) is possible;
- points far from the origin become exponentially less likely;
- the distribution is radially symmetric around the origin.

Total mass:

\[
\int_{\mathbb{R}^2}
\frac{e^{-\frac12(x^2+y^2)}}{2\pi}
\,dx\,dy
= 1.
\]

**[EXAM/REVISION FLAG]** The “Important Checks” slide asks you to:

- plot this Gaussian distribution;
- verify that it integrates to one.

---

## 3.2 Concept 6 — Risk function

### Intuition

In supervised machine learning, we choose a predictor and measure how bad its predictions are.

The **risk** is the expected loss of a predictor over the true data distribution.

The difficulty is that the true distribution is usually unknown, so we minimise empirical risk on samples and hope this also minimises population risk.

### Supervised learning setup

Data look like:

\[
(x,y),
\]

where:

- \(x\) is the input;
- \(y\) is the label.

The input space is \(X\), and the label space is \(Y\).

A model/predictor is a function:

\[
f : X \to Y.
\]

The available class of possible predictors is denoted:

\[
\mathcal{F}.
\]

### Example: binary classification

The slides give:

\[
y =
\begin{cases}
1, & x_1^2 + x_2^2 \le 5,\\
-1, & \text{otherwise},
\end{cases}
\]

where:

\[
x = (x_1,x_2).
\]

This is a binary classification task where the positive class is inside a circle of radius \(\sqrt 5\).

### Example model class: linear functions

The slides consider:

\[
\mathcal{F}
=
\left\{
x \mapsto \langle w,x\rangle
=
\sum_{i=1}^{2}w_i x_i
\ \middle|\ 
w\in\mathbb{R}^2
\right\}.
\]

Here:

- \(w\) is the parameter/weight vector;
- \(\langle w,x\rangle\) is the dot product.

### Loss function

A loss function measures the error made by predictor \(f\).

If the predictor has weights \(w\), the loss is written:

\[
\ell(w,x,y).
\]

Example: squared error loss

\[
\ell(w,x,y)
=
\frac12
\left(y - \langle w,x\rangle\right)^2.
\]

The factor \(\frac12\) is often used because it simplifies derivatives.

### Population risk / expected loss

Assume data are sampled from a distribution \(D\) with density \(p\) on \(X\times Y\).

The **population risk** is:

\[
R(w)
=
\mathbb{E}_{(x,y)\sim D}
[
\ell(w,x,y)
]
=
\int \ell(w,x,y)p(x,y)\,dx\,dy.
\]

Interpretation:

- this is the true expected prediction error;
- it averages over all possible data from the real distribution;
- this is the quantity we actually care about.

### Empirical risk

In practice, we do not know \(D\) or \(p\).

Instead, we have samples:

\[
(x_1,y_1),\dots,(x_m,y_m).
\]

The **empirical risk** is:

\[
\widehat{R}(w)
=
\frac1m
\sum_{i=1}^{m}
\ell(w,x_i,y_i).
\]

Interpretation:

- empirical risk is the average training error;
- it is computable from data;
- it approximates population risk.

### Core ML challenge

**[EXAM/REVISION FLAG]** The slides explicitly state:

> The core challenge of machine learning is to minimise population risk while only having access to empirical risk.

This is one of the most important ideas in the lecture.

---

## 3.3 Concept 5 — Euclidean norm

### Intuition

Once data are represented as vectors, we need a way to measure vector size.

The main size measure used here is the Euclidean norm, also called the \(2\)-norm.

### Formal definition

For:

\[
v \in \mathbb{R}^p,
\qquad
v =
(v_1,\dots,v_p),
\]

the \(2\)-norm is:

\[
\|v\|_2
=
\sqrt{
v_1^2 + v_2^2 + \cdots + v_p^2
}.
\]

This is the Euclidean distance from \(v\) to the origin.

### Worked example

Given:

\[
v =
\begin{bmatrix}
1\\
-2\\
-1
\end{bmatrix},
\]

then:

\[
\|v\|_2
=
\sqrt{1^2 + (-2)^2 + (-1)^2}
=
\sqrt{1+4+1}
=
\sqrt 6.
\]

---

## 3.4 Concept 4 — Convexity

### Intuition

Convex functions are important because they are much easier to optimise than general functions.

A differentiable convex function has the geometric property that its tangent plane at any point lies below the graph of the function.

In one dimension: if you draw the tangent line at any point, the function never goes below that tangent line.

### Formal definition used in the slides

Let:

\[
F:\mathbb{R}^p\to\mathbb{R}
\]

be differentiable.

Then \(F\) is convex if, for all \(x,y\),

\[
F(x) + \nabla F(x)^\top (y-x)
\le
F(y).
\]

The gradient is:

\[
\nabla F(x)
=
\begin{bmatrix}
\frac{\partial F}{\partial x_1}\\
\vdots\\
\frac{\partial F}{\partial x_p}
\end{bmatrix}_{x}.
\]

### Interpretation of the formula

The expression:

\[
F(x) + \nabla F(x)^\top (y-x)
\]

is the first-order linear approximation to \(F(y)\) at \(x\).

Convexity says:

\[
\text{linear approximation at }x
\le
\text{true function value at }y.
\]

So the tangent hyperplane is always below the function.

### Examples from the slides

The slides list examples such as:

\[
F(x)=x^2,
\qquad
F(x)=x^4,
\qquad
F(x)=e^{-x}.
\]

The “Important Checks” slide later mentions verifying convexity of:

\[
x^2
\quad\text{and}\quad
e^{-2x}.
\]

**[UNCLEAR]** The slides mention \(e^{-x}\) in the convexity example slide and \(e^{-2x}\) in the checks slide. Both are convex, but the mismatch is worth noting.

### Convex functions may or may not have minima

The slides show examples of convex functions that:

1. have a unique global minimum;
2. have no minimum at all.

Example:

\[
F(x)=x^2
\]

has a unique global minimum at:

\[
x=0.
\]

By contrast:

\[
F(x)=e^{-x}
\]

is convex but has no finite minimiser, because:

\[
e^{-x}\to 0
\quad\text{as}\quad
x\to \infty,
\]

but \(e^{-x}\) never reaches \(0\).

### ReLU and non-differentiability

The slides mention ReLU:

\[
\operatorname{ReLU}(x)=\max\{0,x\}.
\]

ReLU is not differentiable at \(x=0\), but it is still convex under broader definitions of convexity.

**[ADDED DETAIL]** ReLU is convex because for \(x<0\) it is constant \(0\), for \(x>0\) it is linear \(x\), and its slope jumps upward from \(0\) to \(1\). Increasing slope is a typical one-dimensional sign of convexity.

---

## 3.5 Concept 3 — Basics of constrained convex optimisation

### Motivation

Machine learning often becomes a function minimisation problem.

For example, training may mean minimising:

\[
R(w)
\quad\text{or}\quad
\widehat R(w).
\]

However, general function minimisation is extremely hard. The slides restrict attention to a basic but important result:

> Minimising a differentiable convex function under full-rank linear equality constraints.

### Problem statement

Let:

\[
f:\mathbb{R}^n\to\mathbb{R}
\]

be differentiable and convex.

Consider:

\[
\min_x f(x)
\quad
\text{subject to}
\quad
Ax=b,
\]

where:

\[
A\in\mathbb{R}^{p\times n},
\qquad
\operatorname{rank}(A)=p\le n.
\]

The slides assume that a minimum exists.

### Optimality condition

A point:

\[
x^\star\in\mathbb{R}^n
\]

solves the constrained optimisation problem if and only if there exists:

\[
\lambda^\star\in\mathbb{R}^p
\]

such that:

\[
\nabla f(x^\star) + A^\top \lambda^\star = 0,
\]

and

\[
Ax^\star = b.
\]

These are the equality-constrained first-order optimality conditions.

### Lagrangian

Define the Lagrangian:

\[
L(x,\lambda)
=
f(x) + \lambda^\top(Ax-b).
\]

Here:

- \(\lambda\) is the vector of **Lagrange multipliers**;
- \(Ax-b=0\) encodes the constraint.

The optimality conditions are equivalent to:

\[
\frac{\partial L}{\partial x}=0,
\qquad
\frac{\partial L}{\partial \lambda}=0
\]

at:

\[
(x^\star,\lambda^\star).
\]

Indeed:

\[
\frac{\partial L}{\partial x}
=
\nabla f(x)+A^\top\lambda,
\]

so:

\[
\frac{\partial L}{\partial x}=0
\iff
\nabla f(x)+A^\top\lambda=0.
\]

Also:

\[
\frac{\partial L}{\partial \lambda}
=
Ax-b,
\]

so:

\[
\frac{\partial L}{\partial \lambda}=0
\iff
Ax=b.
\]

**[EXAM/REVISION FLAG]** The slides say this result is hard to prove and that you are only required to know how to **use** it.

**[ADDED DETAIL]** These are often called KKT conditions in broader optimisation courses. In this equality-constrained convex setting, they are necessary and sufficient under the slide assumptions.

---

## 3.6 Concept 2 — Example of non-convex neural losses

### Motivation

The course cannot restrict itself to convex functions, because neural-network loss functions are often non-convex.

The slides give a simple example showing how non-convexity appears even in a very small neural setup.

### Data

Training data consist of four points:

\[
(x_1,y_1)=(0.5,-100),
\]

\[
(x_2,y_2)=(-1,300),
\]

\[
(x_3,y_3)=(1,1),
\]

\[
(x_4,y_4)=(-0.5,-400).
\]

### Model: one sigmoid gate

The model is a single sigmoid gate with weight \(w\):

\[
x
\mapsto
\frac{1}{1+e^{-wx}}.
\]

**[UNCLEAR]** The slide writes the output range as \([0,\infty)\), but the sigmoid function actually takes values in:

\[
(0,1).
\]

### Regularised squared loss

The slide defines a regularised squared loss:

\[
F(w)
=
\frac14
\sum_{i=1}^{4}
\ell_{x_i,y_i}(w)
+
\lambda w^2.
\]

With squared loss:

\[
F(w)
=
\frac14
\sum_{i=1}^{4}
\frac12
\left(
y_i
-
\frac{1}{1+e^{-wx_i}}
\right)^2
+
\lambda w^2.
\]

The key viewpoint:

> Losses are functions of the weights.

Here the weight is one-dimensional, so:

\[
F:\mathbb{R}\to[0,\infty).
\]

### Non-convexity

For:

\[
\lambda=0.13,
\]

the plot shows that \(F(w)\):

- is not convex;
- has a local maximum;
- has two local minima;
- only one of the local minima is global.

**[EXAM/REVISION FLAG]** This is the lecture’s concrete example that neural losses can be non-convex even for extremely simple networks.

---

## 3.7 Concept 1 — Spectral norm of matrices

### Intuition

A matrix acts on vectors. The spectral norm measures the largest amount by which the matrix can stretch a vector.

### Formal definition

For:

\[
A\in\mathbb{R}^{m\times n},
\]

the \(2,2\)-norm, also called the spectral norm, is:

\[
\|A\|_{2,2}
:=
\max_{\|x\|_2=1}
\|Ax\|_2.
\]

Equivalently:

\[
\|A\|_{2,2}
=
\max_{x\ne 0}
\frac{\|Ax\|_2}{\|x\|_2}.
\]

When context is clear, this is written:

\[
\|A\|_2.
\]

### Eigenvectors and eigenvalues

The slide defines an eigenvector/eigenvalue by:

\[
Av = \lambda v.
\]

**[UNCLEAR / TECHNICAL]** Eigenvalues are normally defined for square matrices \(A\in\mathbb{R}^{n\times n}\). The spectral norm is defined for rectangular matrices, but the eigenvalue equation \(Av=\lambda v\) only makes direct sense when input and output dimensions match.

### Worked example: spectral norm versus spectral radius

Consider:

\[
A(\theta)
=
\begin{bmatrix}
0 & \theta\\
0 & 0
\end{bmatrix}.
\]

#### Eigenvalues

Compute:

\[
A(\theta)v=\lambda v.
\]

The characteristic polynomial is:

\[
\det(A-\lambda I)
=
\det
\begin{bmatrix}
-\lambda & \theta\\
0 & -\lambda
\end{bmatrix}
=
\lambda^2.
\]

So the only eigenvalue is:

\[
\lambda=0.
\]

Therefore the spectral radius, meaning the largest eigenvalue magnitude, is:

\[
\rho(A)=0.
\]

#### Spectral norm

Take a unit vector in \(\mathbb{R}^2\):

\[
v(\alpha)
=
\begin{bmatrix}
\sin\alpha\\
\cos\alpha
\end{bmatrix}.
\]

Then:

\[
A(\theta)v(\alpha)
=
\begin{bmatrix}
0 & \theta\\
0 & 0
\end{bmatrix}
\begin{bmatrix}
\sin\alpha\\
\cos\alpha
\end{bmatrix}
=
\begin{bmatrix}
\theta\cos\alpha\\
0
\end{bmatrix}.
\]

Thus:

\[
\|A(\theta)v(\alpha)\|_2
=
|\theta|\,|\cos\alpha|.
\]

Maximising over \(\alpha\):

\[
\|A(\theta)\|_2
=
\sup_\alpha |\theta|\,|\cos\alpha|
=
|\theta|.
\]

So:

\[
\rho(A(\theta))=0,
\qquad
\|A(\theta)\|_2=|\theta|.
\]

Since \(|\theta|\) can be arbitrarily large, the gap between spectral radius and spectral norm can be arbitrarily large.

### Main takeaway

In general:

\[
\text{spectral radius}
\le
\text{spectral norm}.
\]

But the gap can be arbitrarily large.

**[EXAM/REVISION FLAG]** The “Important Checks” slide asks you to verify the eigenvalues for this tricky spectral norm example.

---

## 4. Introduction to gradient descent

### 4.1 Motivation

The lecture introduces gradient descent as the most basic gradient-based training algorithm.

Modern neural networks are usually trained using more complicated variants, but gradient descent is the vanilla starting point.

The slides mention that:

- modern training algorithms are complicated;
- gradient-based methods are central to deep learning;
- ADAM will be used in later example code and is a core part of the course.

**[EXAM/REVISION FLAG]** ADAM is mentioned as a core practical method used later, though this lecture focuses on plain gradient descent.

---

### 4.2 Gradient descent algorithm

Let:

\[
F:\mathbb{R}^p\to\mathbb{R}
\]

be differentiable.

Gradient descent takes:

- an initial point \(w_1\);
- a number of steps \(T>0\);
- a step-size sequence:

\[
\eta_t>0,
\qquad t=1,2,\dots.
\]

Algorithm:

\[
w_{t+1}
=
w_t
-
\eta_t \nabla F(w_t),
\qquad
t=1,\dots,T.
\]

Output:

\[
w_T.
\]

### Intuition

- \(\nabla F(w_t)\) points in the direction of steepest local increase.
- Therefore \(-\nabla F(w_t)\) points in the direction of steepest local decrease.
- The step size \(\eta_t\) controls how far the algorithm moves.

### Key unresolved question

The slides ask:

> If \(F\) has global minima, when does GD find one of them, which one does it find, and how fast?

This is described as largely unresolved in general.

**[EXAM/REVISION FLAG]** Know that GD is simple to state but hard to analyse in full generality, especially for non-convex neural losses.

---

### 4.3 Proof of convergence of GD on \(F(x)=x^2\)

The lecture works through a clean example where convergence can be shown exactly.

#### Objective

\[
F(x)=x^2.
\]

Derivative:

\[
F'(x)=2x.
\]

#### GD update

Gradient descent gives:

\[
x_{t+1}
=
x_t
-
\eta_t F'(x_t).
\]

Substitute \(F'(x_t)=2x_t\):

\[
x_{t+1}
=
x_t
-
2\eta_t x_t.
\]

Factor:

\[
x_{t+1}
=
(1-2\eta_t)x_t.
\]

#### Unrolling the recurrence

Start from:

\[
x_{t+1}=(1-2\eta_t)x_t.
\]

Then:

\[
x_t=(1-2\eta_{t-1})x_{t-1}.
\]

So:

\[
x_{t+1}
=
(1-2\eta_t)(1-2\eta_{t-1})x_{t-1}.
\]

Continuing:

\[
x_{t+1}
=
x_0
\prod_{i=0}^{t}
(1-2\eta_i).
\]

**[UNCLEAR]** The slides use both \(x_0\) and \(w_1\)-style indexing. The main idea is unaffected, but there is a small indexing mismatch.

#### Critical points

If:

\[
x_0=0,
\]

then:

\[
x_t=0
\quad
\forall t.
\]

So the algorithm never moves.

More generally, if the algorithm starts at a critical point:

\[
F'(x_0)=0,
\]

then gradient descent does not move.

**[EXAM/REVISION FLAG]** The slides explicitly say critical points should not be used as starting points for GD algorithms.

#### Choosing a constant step length

We want:

\[
x_t\to 0,
\]

because \(x=0\) is the global minimum of \(F(x)=x^2\).

A sufficient condition is to choose:

\[
1-2\eta_i=k
\]

for all \(i\), where:

\[
k\in(0,1).
\]

Solving for \(\eta_i\):

\[
\eta_i
=
\frac12(1-k).
\]

Then:

\[
x_{t+1}
=
x_0
\prod_{i=0}^{t}k
=
x_0 k^{t+1}.
\]

Since \(0<k<1\):

\[
\lim_{t\to\infty}x_0 k^t=0.
\]

Therefore GD converges to the global minimum.

#### Non-asymptotic convergence time

We ask how many steps are needed to get within an \(\varepsilon>0\) interval of the minimum.

Require:

\[
|x_{t+1}|\le \varepsilon.
\]

Using:

\[
|x_{t+1}|=|x_0|k^{t+1},
\]

the slide writes the condition essentially as:

\[
|x_0|k^t\le \varepsilon.
\]

Then:

\[
k^t \le \frac{\varepsilon}{|x_0|}.
\]

Taking logs:

\[
t \log k
\le
\log\left(\frac{\varepsilon}{|x_0|}\right).
\]

Since \(0<k<1\), \(\log k<0\). Equivalently:

\[
t
\ge
\frac{
\log\left(\frac{|x_0|}{\varepsilon}\right)
}{
\log\left(\frac1k\right)
}.
\]

So convergence time scales like:

\[
O\left(\log\frac1\varepsilon\right).
\]

The slides describe this as very fast, and “as fast as GD can ever be”.

---

### 4.4 GD on a non-convex “Mexican hat” function

The slides show GD converging on:

\[
F(x)
=
\frac12(x^2-2^2)^2
=
\frac12(x^2-4)^2.
\]

The experiment uses:

\[
\eta=10^{-3},
\qquad
T=10^4,
\]

starting near:

\[
x=3.5.
\]

The plot shows GD progressing to a global minimum.

#### [ADDED DETAIL] Derivative and update

First compute the derivative:

\[
F(x)
=
\frac12(x^2-4)^2.
\]

Let:

\[
u=x^2-4.
\]

Then:

\[
F(x)=\frac12u^2.
\]

So:

\[
F'(x)
=
u\cdot u'
=
(x^2-4)(2x)
=
2x(x^2-4).
\]

Therefore GD update is:

\[
x_{t+1}
=
x_t
-
\eta\cdot 2x_t(x_t^2-4).
\]

So:

\[
x_{t+1}
=
x_t
-
2\eta x_t(x_t^2-4).
\]

The global minima satisfy:

\[
F(x)=0
\iff
x^2-4=0
\iff
x=\pm 2.
\]

There is also a critical point at:

\[
x=0,
\]

because:

\[
F'(0)=0.
\]

In this function, \(x=0\) is not a global minimum.

### Main lesson

Even for non-convex functions, GD may find a global minimum in interesting cases. But proving convergence in increasingly hard non-convex cases is difficult and goes beyond the course.

---

### 4.5 Important checks from the lecture

The “Important Checks on Learning” slide lists concrete revision tasks.

**[EXAM/REVISION FLAG]** You should be able to:

1. Plot the given Gaussian distribution.
2. Verify that the Gaussian density integrates to one.
3. Verify convexity of examples such as:
   \[
   x^2,
   \qquad
   e^{-2x}.
   \]
4. Verify eigenvalues for the spectral norm example:
   \[
   A(\theta)=
   \begin{bmatrix}
   0 & \theta\\
   0 & 0
   \end{bmatrix}.
   \]
5. Derive relations between consecutive GD iterates for differentiable functions.
6. Start with the Mexican-hat example.
7. Try high-dimensional analogues such as:
   \[
   f(W)
   =
   \left(
   \operatorname{Tr}(AA^\top)
   -
   \operatorname{Tr}(WW^\top)
   \right)^2.
   \]

#### [ADDED DETAIL] Matrix analogue derivative

Let:

\[
C=\operatorname{Tr}(AA^\top)=\|A\|_F^2,
\]

and:

\[
\operatorname{Tr}(WW^\top)=\|W\|_F^2.
\]

Then:

\[
f(W)
=
(C-\|W\|_F^2)^2.
\]

Using:

\[
\nabla_W \|W\|_F^2 = 2W,
\]

we get:

\[
\nabla_W f(W)
=
2(C-\|W\|_F^2)(-2W)
=
-4(C-\|W\|_F^2)W.
\]

Equivalently:

\[
\nabla_W f(W)
=
4(\|W\|_F^2-C)W.
\]

So a GD update with step size \(\eta\) is:

\[
W_{t+1}
=
W_t
-
4\eta(\|W_t\|_F^2-C)W_t.
\]

Factor:

\[
W_{t+1}
=
\left[
1
-
4\eta(\|W_t\|_F^2-C)
\right]W_t.
\]

This is analogous to the scalar Mexican-hat recurrence.

---

## 5. Johnson–Lindenstrauss dimensionality reduction

**[UNCLEAR / SPELLING]** The slide section title repeatedly spells this as “Johnson-Lindenenstrauss”. The standard spelling is **Johnson–Lindenstrauss**.

---

### 5.1 Motivation

High-dimensional vectors are expensive to store and process.

The Johnson–Lindenstrauss result gives a general-purpose method for dimensionality reduction:

> Randomly project high-dimensional data into a much lower-dimensional space while approximately preserving distances.

This is useful for downstream tasks where pairwise distances or norms matter.

---

### 5.2 Random Gaussian projection

Let:

\[
G\in\mathbb{R}^{k\times d}
\]

be a random matrix whose entries are mutually independent standard normal random variables:

\[
G_{ij}\sim \mathcal{N}(0,1).
\]

Define:

\[
\Pi
=
\sqrt{\frac1k}G
=
\frac1{\sqrt k}G.
\]

Then:

\[
\Pi:\mathbb{R}^d\to\mathbb{R}^k.
\]

If \(k\ll d\), \(\Pi\) maps high-dimensional vectors into a much lower-dimensional space.

---

### 5.3 \((\varepsilon,\delta)\)-Johnson–Lindenstrauss property

For:

\[
\varepsilon,\delta\in(0,1),
\]

if:

\[
k=O\left(\frac{\log(1/\delta)}{\varepsilon^2}\right),
\]

then for any vector \(a\),

\[
\mathbb{P}
\left[
(1-\varepsilon)\|a\|_2^2
\le
\|\Pi a\|_2^2
\le
(1+\varepsilon)\|a\|_2^2
\right]
\ge
1-\delta.
\]

### Intuition

A random Gaussian projection approximately preserves squared length:

\[
\|\Pi a\|_2^2
\approx
\|a\|_2^2.
\]

The failure probability is at most \(\delta\).

### Important feature

The target dimension \(k\) depends on:

- the error tolerance \(\varepsilon\);
- the failure probability \(\delta\);

but not directly on the original dimension \(d\).

This is surprising and powerful.

---

### 5.4 Johnson–Lindenstrauss lemma for \(n\) points

Given \(n\) points:

\[
a_1,\dots,a_n\in\mathbb{R}^d,
\]

and:

\[
\varepsilon\in(0,1),
\]

there exists a linear map:

\[
f:\mathbb{R}^d\to\mathbb{R}^k
\]

with:

\[
k=O\left(\frac{\log n}{\varepsilon^2}\right)
\]

such that pairwise distances are approximately preserved:

\[
(1-\varepsilon)\|a_i-a_j\|_2
\le
\|f(a_i)-f(a_j)\|_2
\le
(1+\varepsilon)\|a_i-a_j\|_2.
\]

This holds for all pairs \(i,j\).

#### [ADDED DETAIL] Why pairwise distances follow from norm preservation

For each pair:

\[
a_i-a_j
\]

is a vector in \(\mathbb{R}^d\).

If \(\Pi\) preserves the norm of every difference vector \(a_i-a_j\), then it preserves pairwise distances.

There are:

\[
\binom n2
\]

pairs. A union bound explains why \(\log n\) appears in the dimension bound.

---

### 5.5 Application: sketched linear regression

#### Original linear regression

Suppose we have data vectors:

\[
a_1,\dots,a_n\in\mathbb{R}^d.
\]

Stack them as rows of a matrix:

\[
A\in\mathbb{R}^{n\times d}.
\]

Let labels be:

\[
y_1,\dots,y_n,
\]

or:

\[
y\in\mathbb{R}^n.
\]

Linear regression solves:

\[
\min_{\beta\in\mathbb{R}^d}
\widehat R(\beta)
=
\min_{\beta\in\mathbb{R}^d}
\|A\beta-y\|_2^2.
\]

The residual vector is:

\[
r(\beta)=A\beta-y\in\mathbb{R}^n.
\]

#### Sketched linear regression

Choose:

\[
\Pi\in\mathbb{R}^{k\times n},
\qquad
k<n,
\]

where:

\[
\Pi=\frac1{\sqrt k}G,
\]

and \(G_{ij}\sim\mathcal{N}(0,1)\) independently.

Define the sketched objective:

\[
\min_{\beta\in\mathbb{R}^d}
\widehat R_\Pi(\beta)
=
\min_{\beta\in\mathbb{R}^d}
\|\Pi(A\beta-y)\|_2^2.
\]

This compresses the residual vector from dimension \(n\) to dimension \(k\).

### Key claims

The slides state:

- sketched linear regression can be solved faster;
- the optimal value is nearly preserved:

\[
\min_{\beta\in\mathbb{R}^d}
\|\Pi(A\beta-y)\|_2^2
\sim
\min_{\beta\in\mathbb{R}^d}
\|A\beta-y\|_2^2.
\]

The full proof is outside the course, but the slides provide an expectation calculation.

---

### 5.6 Expected preservation of regression loss

Let:

\[
r=A\beta-y.
\]

Then:

\[
\widehat R_\Pi(\beta)
=
\|\Pi r\|_2^2.
\]

Now:

\[
\|\Pi r\|_2^2
=
(\Pi r)^\top(\Pi r)
=
r^\top \Pi^\top \Pi r.
\]

Taking expectation over \(\Pi\):

\[
\mathbb{E}_\Pi[\widehat R_\Pi(\beta)]
=
\mathbb{E}_\Pi[r^\top \Pi^\top \Pi r].
\]

Since \(r\) is fixed with respect to \(\Pi\):

\[
\mathbb{E}_\Pi[\widehat R_\Pi(\beta)]
=
r^\top
\mathbb{E}_\Pi[\Pi^\top\Pi]
r.
\]

The slides say that in exercises you prove:

\[
\mathbb{E}[\Pi^\top\Pi]=I.
\]

Therefore:

\[
\mathbb{E}_\Pi[\widehat R_\Pi(\beta)]
=
r^\top I r
=
r^\top r
=
\|r\|_2^2.
\]

Thus:

\[
\mathbb{E}_\Pi[\widehat R_\Pi(\beta)]
=
\widehat R(\beta).
\]

So random normal projection preserves the linear regression loss **in expectation**.

#### [ADDED DETAIL] Proof of \(\mathbb{E}[\Pi^\top\Pi]=I\)

Since:

\[
\Pi=\frac1{\sqrt k}G,
\]

we have:

\[
\Pi^\top\Pi
=
\frac1k G^\top G.
\]

The \((j,\ell)\)-entry is:

\[
(\Pi^\top\Pi)_{j\ell}
=
\frac1k
\sum_{i=1}^{k}
G_{ij}G_{i\ell}.
\]

If \(j=\ell\), then:

\[
\mathbb{E}[G_{ij}^2]=1,
\]

so:

\[
\mathbb{E}[(\Pi^\top\Pi)_{jj}]
=
\frac1k
\sum_{i=1}^{k}1
=
1.
\]

If \(j\ne \ell\), independence and zero mean give:

\[
\mathbb{E}[G_{ij}G_{i\ell}]
=
\mathbb{E}[G_{ij}]
\mathbb{E}[G_{i\ell}]
=
0.
\]

So:

\[
\mathbb{E}[(\Pi^\top\Pi)_{j\ell}]=0.
\]

Therefore:

\[
\mathbb{E}[\Pi^\top\Pi]=I.
\]

**[UNCLEAR]** One slide line writes \((Ax-y)^\top(Ax-y)\), but the regression parameter is \(\beta\), so this should be \((A\beta-y)^\top(A\beta-y)\).

---

## 6. Neural networks and autoencoders

---

### 6.1 Activation gates

#### Neural gates versus Boolean gates

Boolean circuits use gates such as:

- AND;
- OR;
- NOT;
- threshold gates.

Neural networks use analogue activation gates.

A basic neural gate computes:

\[
y
=
\sigma\left(\sum_{i=1}^{3}w_ix_i\right).
\]

Here:

- \(x_1,x_2,x_3\) are inputs;
- \(w_1,w_2,w_3\) are weights;
- \(\sigma:\mathbb{R}\to\mathbb{R}\) is an activation function;
- the output is a real number.

The gate maps:

\[
\mathbb{R}^3\to\mathbb{R}.
\]

If many outgoing edges leave the gate, the same output value is passed to all of them.

---

### 6.2 ReLU activation

The slides state that for most purposes the “best” activation function to use is the Rectified Linear Unit:

\[
\operatorname{ReLU}:\mathbb{R}\to\mathbb{R},
\]

\[
x\mapsto \max\{0,x\}.
\]

For vectors:

\[
\operatorname{ReLU}(x)
=
(\max\{0,x_1\},\dots,\max\{0,x_n\}).
\]

#### Affine layer

A layer implemented using PyTorch’s `Linear` keyword corresponds mathematically to an affine map:

\[
A:\mathbb{R}^n\to\mathbb{R}^p,
\]

\[
x\mapsto Wx+b,
\]

where:

\[
W\in\mathbb{R}^{p\times n},
\qquad
b\in\mathbb{R}^p.
\]

**[EXAM/REVISION FLAG]** PyTorch calls this `Linear`, but with a bias term it is mathematically affine, not purely linear.

---

### 6.3 One-layer ReLU network

Including ReLU, one layer is:

\[
N:\mathbb{R}^n\to\mathbb{R}^p,
\]

\[
x\mapsto \max\{0,Wx+b\}.
\]

The max is applied componentwise.

#### Worked example

Given:

\[
x=
\begin{bmatrix}
1\\
2
\end{bmatrix},
\qquad
b=\vec 0,
\]

and:

\[
W=
\begin{bmatrix}
1 & 0\\
2 & -1\\
0 & -2
\end{bmatrix}.
\]

Compute:

\[
Wx
=
\begin{bmatrix}
1 & 0\\
2 & -1\\
0 & -2
\end{bmatrix}
\begin{bmatrix}
1\\
2
\end{bmatrix}.
\]

Row by row:

\[
1\cdot 1 + 0\cdot 2 = 1,
\]

\[
2\cdot 1 + (-1)\cdot 2 = 2-2=0,
\]

\[
0\cdot 1 + (-2)\cdot 2 = -4.
\]

So:

\[
Wx=
\begin{bmatrix}
1\\
0\\
-4
\end{bmatrix}.
\]

Apply ReLU:

\[
N(x)
=
\max\{0,Wx\}
=
\begin{bmatrix}
1\\
0\\
0
\end{bmatrix}.
\]

---

### 6.4 A depth-2, width-4 ReLU net computing \(\max(x_1,x_2)\)

The slide gives a ReLU network computing:

\[
\max(x_1,x_2).
\]

The key identity is:

\[
\max(x_1,x_2)
=
\frac{x_1+x_2}{2}
+
\frac{|x_1-x_2|}{2}.
\]

#### [ADDED DETAIL] ReLU implementation

Recall:

\[
a = \operatorname{ReLU}(a)-\operatorname{ReLU}(-a),
\]

and:

\[
|a|=\operatorname{ReLU}(a)+\operatorname{ReLU}(-a).
\]

Let:

\[
s=x_1+x_2,
\qquad
d=x_1-x_2.
\]

Use four ReLU gates:

\[
h_1=\operatorname{ReLU}(s)
=
\operatorname{ReLU}(x_1+x_2),
\]

\[
h_2=\operatorname{ReLU}(-s)
=
\operatorname{ReLU}(-x_1-x_2),
\]

\[
h_3=\operatorname{ReLU}(d)
=
\operatorname{ReLU}(x_1-x_2),
\]

\[
h_4=\operatorname{ReLU}(-d)
=
\operatorname{ReLU}(-x_1+x_2).
\]

Then:

\[
s=h_1-h_2,
\]

and:

\[
|d|=h_3+h_4.
\]

So:

\[
\max(x_1,x_2)
=
\frac12(h_1-h_2)
+
\frac12(h_3+h_4).
\]

Equivalently:

\[
\max(x_1,x_2)
=
\frac12h_1
-
\frac12h_2
+
\frac12h_3
+
\frac12h_4.
\]

This matches the slide’s output expression:

\[
\frac{x_1+x_2}{2}
+
\frac{|x_1-x_2|}{2}.
\]

---

### 6.5 General ReLU deep neural network

Given affine transformations:

\[
A_i:\mathbb{R}^{w_{i-1}}\to\mathbb{R}^{w_i},
\qquad
i=1,\dots,k+1,
\]

a depth \(k+1\) ReLU deep neural network is:

\[
N(x)
=
A_{k+1}
\circ
\operatorname{ReLU}
\circ
A_k
\circ
\cdots
\circ
A_2
\circ
\operatorname{ReLU}
\circ
A_1(x).
\]

So:

\[
N:\mathbb{R}^{w_0}\to\mathbb{R}^{w_{k+1}}.
\]

The final layer in the slide expression is affine, with ReLUs between earlier layers.

---

### 6.6 Architecture versus neural function

The slide shows an example architecture:

\[
\mathbb{R}^4 \to \mathbb{R}^3.
\]

Important distinction:

- A **neural architecture** is a graph/diagram showing layers and connections.
- A **neural function** is obtained only after assigning actual weights to the edges and biases to layers.

The slide explicitly says the diagram is not yet a neural function because weights have not been assigned.

**[EXAM/REVISION FLAG]** A network diagram defines a class/set of neural functions, not a single function, until weights are specified.

---

### 6.7 Why neural functions are exciting

The slides show realistic human portraits produced by a neural net.

Main idea:

> A neural net can learn a distribution over human faces and sample from it.

This motivates generative modelling.

---

### 6.8 Neural net objectives: population and empirical risk

For:

- data distribution \(D\);
- finite sample set \(S\);
- loss function \(\ell\);
- neural net \(N\);

the population risk is:

\[
R(N)
=
\mathbb{E}_{(x,y)\sim D}
[
\ell(y,N(x))
].
\]

This measures expected prediction error over all data.

The empirical risk is:

\[
\widehat R(N)
=
\mathbb{E}_{(x,y)\sim \operatorname{Unif}(S)}
[
\ell(y,N(x))
].
\]

This measures average prediction error over the seen training data.

Since \(N\) varies as the weights vary, we can write:

\[
R(N)=R(w),
\qquad
\widehat R(N)=\widehat R(w),
\]

where \(w\) denotes all trainable weights.

---

### 6.9 Depth-2 ReLU population risk example

The slides give:

\[
R(a,W)
=
\mathbb{E}_{(x,y)\sim D}
\left[
\frac12
\left(
y
-
\langle a,\max\{0,Wx\}\rangle
\right)^2
\right].
\]

The neural network is:

\[
x
\mapsto
\langle a,\max\{0,Wx\}\rangle.
\]

Here:

- \(W\) maps the input into hidden units;
- ReLU is applied componentwise;
- \(a\) combines hidden activations into a scalar output.

The slides note that exact evaluation of such expectations is rare for neural nets.

---

### 6.10 Autoencoders

The slides introduce autoencoders in the setting where the input and output have the same dimension.

Intuition:

> An autoencoder tries to reconstruct its input.

A generic autoencoder has:

- an encoder;
- a compressed or hidden representation;
- a decoder;
- a reconstructed output.

For input \(y\), the output is:

\[
\widetilde y.
\]

The goal is:

\[
\widetilde y \approx y.
\]

---

### 6.11 Sparse coding autoencoder

#### Generative model

The slides define a sparse-coding setup:

\[
x^\star\in\mathbb{R}^h
\]

is sparse, and:

\[
y=A^\star x^\star\in\mathbb{R}^n.
\]

The dimensions satisfy:

\[
h\gg n.
\]

Interpretation:

- \(x^\star\) is a high-dimensional sparse source code;
- \(A^\star\) is the true generating dictionary/matrix;
- \(y\) is the observed data.

#### Autoencoder hidden representation

Define:

\[
h
:=
\operatorname{ReLU}(Wy-\varepsilon \vec{1})
=
\max\{0,Wy-\varepsilon\}
\in\mathbb{R}^h.
\]

**[UNCLEAR]** The slide uses \(h\) both as the latent dimension and as the hidden representation. Context distinguishes them, but the notation is overloaded.

#### Reconstruction

The autoencoder output is:

\[
\widetilde y
=
W^\top h
\in\mathbb{R}^n.
\]

#### Loss function

A typical loss is:

\[
L(W)
=
\frac12
\|\widetilde y-y\|_2^2
+
\lambda\|W\|_F^2.
\]

The first term is reconstruction error.

The second term is Frobenius-norm regularisation.

---

### 6.12 Sparse coding as generative modelling

Recall:

\[
y=A^\star x^\star.
\]

The loss may be written:

\[
L(W)
=
\frac12
\left\|
A^\star x^\star
-
W^\top \operatorname{ReLU}(Wy-\varepsilon)
\right\|_2^2
+
\lambda\|W\|_F^2.
\]

The important observation is:

\[
W^\top
\]

has the same dimensions as:

\[
A^\star.
\]

If minimising the loss gives:

\[
W^\top \approx A^\star,
\]

then the autoencoder has approximately learned how the observed inputs \(y\) were generated from sparse source codes \(x^\star\).

Therefore, this is a simple example of generative modelling.

**[UNCLEAR]** The slide’s displayed equation has visually garbled text around \(A^\star x^\star=y\). The intended meaning is that \(y=A^\star x^\star\).

---

### 6.13 Realistic autoencoder example: handwritten digits

The slides consider inputs \(y\) as handwritten digit images.

Details given:

- Software: TensorFlow.
- 6000 training examples and 1000 testing examples for each digit.
- Image dimension:
  \[
  n=784,
  \]
  corresponding to \(28\times 28\) images.
- One-layer ReLU autoencoder:
  - \(10^4\) ReLU gates.
- Two-activation-layer net:
  - 5000 gates in one layer;
  - 784 in another.

The slide images compare actual digits and reconstructed digits.

Main point:

> After training, autoencoders can reconstruct handwritten digit images from learned internal representations.

---

### 6.14 Special case with known correct global minimum

The slides consider the loss:

\[
\|y-W^\top \operatorname{ReLU}(Wy)\|_2^2.
\]

They state that this achieves its minimum possible value \(0\) at:

\[
W^\top=A^\star
\]

in a special case where:

\[
y=A^\star x^\star,
\]

\[
A^\star \text{ is orthogonal},
\]

and:

\[
x^\star\ge 0.
\]

#### [ADDED DETAIL] Why the loss becomes zero

If:

\[
W^\top=A^\star,
\]

then:

\[
W=(A^\star)^\top.
\]

Now:

\[
Wy
=
(A^\star)^\top y.
\]

Since:

\[
y=A^\star x^\star,
\]

we get:

\[
Wy
=
(A^\star)^\top A^\star x^\star.
\]

Because \(A^\star\) is orthogonal:

\[
(A^\star)^\top A^\star=I.
\]

Therefore:

\[
Wy=x^\star.
\]

Since:

\[
x^\star\ge 0,
\]

componentwise:

\[
\operatorname{ReLU}(Wy)
=
\operatorname{ReLU}(x^\star)
=
x^\star.
\]

Thus:

\[
W^\top\operatorname{ReLU}(Wy)
=
A^\star x^\star
=
y.
\]

So:

\[
\|y-W^\top \operatorname{ReLU}(Wy)\|_2^2
=
\|y-y\|_2^2
=
0.
\]

The loss is nonnegative, so \(0\) is a global minimum.

#### Optimisation caveat

The slides state that even in this special case, it is not currently known how to prove that an optimisation algorithm will recover a good approximation of \(A^\star\) from samples of \(y\) using this loss.

**[EXAM/REVISION FLAG]** Distinguish:

- knowing a global minimiser exists;
- proving that training actually finds it.

---

### 6.15 Bottleneck autoencoders

The slides briefly discuss bottleneck autoencoders.

A bottleneck autoencoder has:

\[
x
\to
\text{encoder}
\to
z
\to
\text{decoder}
\to
x',
\]

where \(z\) is a compressed representation.

The aim is:

\[
x'\approx x.
\]

#### Philosophical view

The slides state:

> Autoencoders can be thought of as a more powerful nonlinear generalisation of PCA.

PCA will be taught in later weeks.

#### Scope limits

The slides explicitly say:

- understanding when autoencoders do better than PCA is not in the syllabus;
- mathematising the idea that bottleneck autoencoders discover the “shape of the data space” is very hard;
- detailed attempts are outside the scope of the course.

---

## 7. Introduction to generative modelling via latent variables

---

### 7.1 Problem: estimating an unknown distribution

A common data-science task is:

> Estimate an unknown distribution \(p(\vec x)\) from i.i.d. samples.

Samples:

\[
\vec x_i\in X
\]

are drawn from:

\[
p(\vec x).
\]

We choose a parameterised family of densities:

\[
p_\Theta(\vec x).
\]

The goal is to find a good approximation to the unknown \(p\).

---

### 7.2 Maximum likelihood estimator

The slides define the maximum likelihood estimator:

\[
\Theta_{\mathrm{MLE}}
:=
\arg\max_{\Theta}
\mathbb{E}_{\vec x\sim p}
[
\log p_\Theta(\vec x)
].
\]

Here:

\[
\log p_\Theta(\vec x)
\]

is the likelihood score that \(p_\Theta\) assigns to sample \(\vec x\).

**[ADDED DETAIL]** In practice, the expectation over unknown \(p\) is replaced by an empirical average over data:

\[
\frac1m
\sum_{i=1}^{m}
\log p_\Theta(\vec x_i).
\]

The slides say the conditions under which the resulting estimator is good are outside the syllabus.

---

### 7.3 Latent-variable modelling

To make density modelling tractable, introduce a latent variable:

\[
\vec z\sim p(\vec z),
\]

where \(p(\vec z)\) is a distribution on an auxiliary latent space \(Z\).

We then model the conditional distribution:

\[
p_\Theta(\vec x\mid \vec z).
\]

This gives a joint model over:

\[
X\times Z.
\]

The joint density is:

\[
p_\Theta(\vec x,\vec z)
=
p_\Theta(\vec x\mid \vec z)p(\vec z).
\]

---

### 7.4 Marginal distribution

The marginal density of \(\vec x\) is:

\[
p_\Theta(\vec x)
=
\int_Z
p_\Theta(\vec x\mid \vec z)p(\vec z)
\,d\vec z.
\]

Equivalently:

\[
p_\Theta(\vec x)
=
\int_Z
p_\Theta(\vec x,\vec z)
\,d\vec z.
\]

This integrates out the latent variable.

#### Sampling interpretation

To sample from \(p_\Theta(\vec x)\):

1. Sample:
   \[
   \vec z\sim p(\vec z).
   \]
2. Sample:
   \[
   \vec x\sim p_\Theta(\cdot\mid \vec z).
   \]

The key modelling idea:

- choose a simple prior \(p(\vec z)\), such as a standard normal;
- use an expressive model, such as a neural net, for \(p_\Theta(\vec x\mid \vec z)\).

---

### 7.5 Posterior distribution over latent variables

Given \(p_\Theta\), the conditional distribution of \(\vec z\) given \(\vec x\) is:

\[
p_\Theta(\vec z\mid \vec x)
=
\frac{
p_\Theta(\vec x\mid \vec z)p(\vec z)
}{
p(\vec x)
}.
\]

This is Bayes’ rule.

The VAE framework is motivated from this posterior viewpoint.

The slides say VAEs use two neural nets to set up two conditional distributions over \(\vec z\mid \vec x\) and search so that they match.

**[UNCLEAR]** The slide uses notation \(p_\Phi(\vec z\mid \vec x)\), but later VAE slides use the more standard notation:

\[
q_\Phi(\vec z\mid \vec x)
\]

for the encoder/approximate posterior.

---

## 8. Variational autoencoders — VAE

The slides say that from this point one should refer to “Demonstration-2-VAE” on Canvas for code.

---

### 8.1 KL divergence

#### Definition

For two distributions \(p\) and \(q\) on the same discrete sample space:

\[
\operatorname{KL}(p\|q)
=
\sum_x
p(x)\log\frac{p(x)}{q(x)}.
\]

The slides write this as \(KL(p|q)\), but the standard notation is:

\[
\operatorname{KL}(p\|q).
\]

#### Intuition

KL divergence measures dissimilarity between probability distributions.

It is asymmetric:

\[
\operatorname{KL}(p\|q)
\ne
\operatorname{KL}(q\|p)
\]

in general.

It is not a distance metric.

---

### 8.2 Worked KL example

Let \(p\) be uniform on three outcomes:

\[
p=
\left(
\frac13,\frac13,\frac13
\right).
\]

Let \(q\) assign mass:

\[
q=
\left(
\frac12,\frac12,0
\right).
\]

#### Compute \(\operatorname{KL}(p\|q)\)

\[
\operatorname{KL}(p\|q)
=
\sum_{i=1}^3
p_i\log\frac{p_i}{q_i}.
\]

The third term is:

\[
\frac13
\log
\frac{1/3}{0}.
\]

Since division by zero gives an infinite penalty:

\[
\operatorname{KL}(p\|q)=\infty.
\]

Interpretation:

- \(p\) says the third outcome can happen;
- \(q\) assigns it probability zero;
- this is infinitely bad under KL.

#### Compute \(\operatorname{KL}(q\|p)\)

\[
\operatorname{KL}(q\|p)
=
\frac12\log\frac{1/2}{1/3}
+
\frac12\log\frac{1/2}{1/3}
+
0.
\]

Since:

\[
\frac{1/2}{1/3}=\frac32,
\]

we get:

\[
\operatorname{KL}(q\|p)
=
\frac12\log\frac32
+
\frac12\log\frac32
=
\log\frac32.
\]

So:

\[
\operatorname{KL}(p\|q)=\infty,
\qquad
\operatorname{KL}(q\|p)=\log\frac32.
\]

This demonstrates asymmetry.

---

### 8.3 Conditional distributions in VAE motivation

Suppose we have random variables:

\[
\vec x,\vec z.
\]

There is a joint distribution over them.

We consider two conditional distributions:

\[
q(\vec z\mid \vec x)
\]

and:

\[
p(\vec z\mid \vec x).
\]

Both are guesses/descriptions of the conditional distribution of \(\vec z\) given \(\vec x\).

We use KL divergence to measure their discrepancy:

\[
\operatorname{KL}
(
q(\vec z\mid \vec x)
\|
p(\vec z\mid \vec x)
).
\]

---

### 8.4 ELBO derivation

The slides derive one of the central equations in ML.

**[EXAM/REVISION FLAG]** The slide explicitly calls this “among the most important equations in ML.”

Start with:

\[
\operatorname{KL}
(
q(\vec z\mid \vec x)
\|
p(\vec z\mid \vec x)
)
=
\sum_{\vec z}
q(\vec z\mid \vec x)
\log
\frac{
q(\vec z\mid \vec x)
}{
p(\vec z\mid \vec x)
}.
\]

Use Bayes’ rule:

\[
p(\vec z\mid \vec x)
=
\frac{
p(\vec x\mid \vec z)p(\vec z)
}{
p(\vec x)
}.
\]

Substitute:

\[
\operatorname{KL}
=
\sum_{\vec z}
q(\vec z\mid \vec x)
\log
\frac{
q(\vec z\mid \vec x)
}{
\frac{p(\vec x\mid \vec z)p(\vec z)}{p(\vec x)}
}.
\]

Rewrite the log:

\[
\operatorname{KL}
=
\sum_{\vec z}
q(\vec z\mid \vec x)
\left[
\log q(\vec z\mid \vec x)
-
\log p(\vec x\mid \vec z)
-
\log p(\vec z)
+
\log p(\vec x)
\right].
\]

Separate terms:

\[
\operatorname{KL}
=
\mathbb{E}_q[\log q(\vec z\mid \vec x)]
-
\mathbb{E}_q[\log p(\vec x\mid \vec z)]
-
\mathbb{E}_q[\log p(\vec z)]
+
\log p(\vec x).
\]

Group:

\[
\operatorname{KL}
=
-\mathbb{E}_q[\log p(\vec x\mid \vec z)]
+
\mathbb{E}_q
\left[
\log
\frac{
q(\vec z\mid \vec x)
}{
p(\vec z)
}
\right]
+
\log p(\vec x).
\]

Now solve for \(\log p(\vec x)\):

\[
\log p(\vec x)
=
\operatorname{KL}
(
q(\vec z\mid \vec x)
\|
p(\vec z\mid \vec x)
)
+
\left[
\mathbb{E}_q\log p(\vec x\mid \vec z)
-
\mathbb{E}_q
\log
\frac{
q(\vec z\mid \vec x)
}{
p(\vec z)
}
\right].
\]

The bracketed term is the **ELBO**, the Evidence Lower Bound:

\[
\operatorname{ELBO}
=
\mathbb{E}_q\log p(\vec x\mid \vec z)
-
\operatorname{KL}(q(\vec z\mid \vec x)\|p(\vec z)).
\]

The slides label:

\[
\operatorname{ELBO}
=
-\operatorname{VFE}.
\]

So:

\[
\operatorname{VFE}
=
-\operatorname{ELBO}.
\]

---

### 8.5 Why maximise ELBO?

The decomposition is:

\[
\log p(\vec x)
=
\operatorname{KL}
(
q(\vec z\mid \vec x)
\|
p(\vec z\mid \vec x)
)
+
\operatorname{ELBO}.
\]

For fixed data \(\vec x\), \(\log p(\vec x)\) is constant with respect to the variational approximation \(q\).

Therefore, minimising:

\[
\operatorname{KL}
(
q(\vec z\mid \vec x)
\|
p(\vec z\mid \vec x)
)
\]

is equivalent to maximising:

\[
\operatorname{ELBO}.
\]

Equivalently, it is equivalent to minimising negative ELBO, called VFE in the slides.

---

### 8.6 VAE objective / Variational Free Energy

The optimisation objective is:

\[
\min
\left(
-
\mathbb{E}_q
\log p(\vec x\mid \vec z)
+
\operatorname{KL}
(q(\vec z\mid \vec x)\|p(\vec z))
\right).
\]

The two parts are:

#### Reconstruction loss

\[
-
\mathbb{E}_q
\log p(\vec x\mid \vec z).
\]

This encourages the decoder to reconstruct/generate \(\vec x\) well from \(\vec z\).

#### KL regularisation term

\[
\operatorname{KL}
(q(\vec z\mid \vec x)\|p(\vec z)).
\]

This encourages the encoder distribution to stay close to the latent prior.

#### Learned marginal

After training, a good decoder distribution:

\[
p_\Theta(\vec x\mid \vec z)
\]

allows the data distribution to be approximated by:

\[
p_\Theta(\vec x)
=
\int
p_\Theta(\vec x\mid \vec z)p(\vec z)
\,d\vec z.
\]

The slides emphasise that this motivates choosing simple distributions for \(\vec z\), so the integral/sampling process is manageable.

---

### 8.7 Encoder, decoder, and distributions

Assume image data:

\[
\vec x\in\mathbb{R}^{\text{image-dimension}}.
\]

Choose a latent dimension so that:

\[
\vec z\in\mathbb{R}^{\text{latent-dimension}}.
\]

#### Encoder

The encoder is:

\[
\operatorname{Encoder}_\Phi:
\mathbb{R}^{\text{image-dimension}}
\to
\mathbb{R}^{\text{latent-dimension}}
\times
\mathbb{R}^{\text{latent-dimension}}.
\]

It outputs two vectors:

- a mean vector;
- a variance/log-variance vector.

The trainable encoder weights are denoted:

\[
\Phi.
\]

#### Decoder

The decoder is:

\[
\operatorname{Decoder}_\Theta:
\mathbb{R}^{\text{latent-dimension}}
\to
\mathbb{R}^{\text{image-dimension}}.
\]

The trainable decoder weights are:

\[
\Theta.
\]

---

### 8.8 The three distributions in the VAE

#### Approximate posterior / encoder distribution

Given data sample \(\vec x\), the encoder defines:

\[
q_\Phi(\vec z\mid \vec x).
\]

The slides write:

\[
q(\vec z\mid \vec x)
=
q_\Phi(\vec z\mid \vec x)
:=
\mathcal{N}(f(\operatorname{Encoder}_\Phi(\vec x))).
\]

More concretely, the encoder outputs parameters of a Gaussian:

\[
q_\Phi(\vec z\mid \vec x)
=
\mathcal{N}
(
\vec\mu_z,
\operatorname{diag}(\vec\sigma_z\circ \vec\sigma_z)
).
\]

Here:

- \(\vec\mu_z\) is the latent mean;
- \(\vec\sigma_z\) is the latent standard deviation vector;
- \(\circ\) means componentwise product;
- \(\operatorname{diag}(\vec\sigma_z\circ \vec\sigma_z)\) is a diagonal covariance matrix.

#### Prior distribution

The latent prior is chosen as a standard normal:

\[
p(\vec z)
=
\mathcal{N}(0,I).
\]

#### Decoder likelihood

Given \(\vec z\), the decoder defines:

\[
p_\Theta(\vec x\mid \vec z).
\]

The slides set:

\[
p_\Theta(\vec x\mid \vec z)
=
\mathcal{N}
(
\operatorname{Decoder}_\Theta(\vec z),
\operatorname{diag}(\text{all-ones-vector})
).
\]

That is:

\[
p_\Theta(\vec x\mid \vec z)
=
\mathcal{N}
(
\operatorname{Decoder}_\Theta(\vec z),
I
).
\]

---

### 8.9 Empirical VFE / Monte Carlo estimate

If we can sample:

\[
\vec z_s\sim q_\Phi(\vec z\mid \vec x),
\qquad
s=1,\dots,S,
\]

then the VFE can be estimated by Monte Carlo:

\[
\operatorname{Empirical\ VFE}
=
-
\widetilde{\mathbb{E}}_{q_\Phi}
\log p_\Theta(\vec x\mid \vec z)
+
\widetilde{\mathbb{E}}_{q_\Phi}
\log
\frac{
q_\Phi(\vec z\mid \vec x)
}{
p(\vec z)
}.
\]

Equivalently:

\[
\operatorname{Empirical\ VFE}
=
\frac1S
\sum_{s=1}^{S}
\left[
-\log p_\Theta(\vec x\mid \vec z_s)
+
\log q_\Phi(\vec z_s\mid \vec x)
-
\log p(\vec z_s)
\right].
\]

The first term is the reconstruction loss.

The remaining terms estimate the KL divergence.

---

### 8.10 VAE is not a single architecture

The slides emphasise:

> A VAE is not a single architecture.

Rather, it is a system using:

- two neural nets;
- a latent prior;
- a decoder likelihood;
- an approximate posterior;
- a VFE/ELBO training objective.

The purpose is to learn an unknown marginal data distribution:

\[
p(\vec x)
\]

by approximating it as:

\[
p_\Theta(\vec x)
=
\int
p_\Theta(\vec x\mid \vec z)p(\vec z)
\,d\vec z.
\]

---

### 8.11 VAE loss: Step 1 — encoder output and Gaussian KL

The slides define:

\[
(\vec\mu_z, 2\log(\vec\sigma_z))
:=
\operatorname{Encoder}_\Phi(\vec x).
\]

The quantity:

\[
2\log(\vec\sigma_z)
\]

is the log variance, since:

\[
\log(\sigma_z^2)=2\log(\sigma_z).
\]

So in code this is often called:

\[
\text{log var}.
\]

The approximate posterior is:

\[
q_\Phi(\vec z\mid \vec x)
=
\mathcal{N}(\vec\mu_z,\Sigma),
\]

where:

\[
\Sigma
=
\operatorname{diag}(\vec\sigma_z\circ\vec\sigma_z).
\]

The KL term is:

\[
\operatorname{KL}
(
q_\Phi(\vec z\mid \vec x)
\|
p(\vec z)
)
=
\operatorname{KL}
(
\mathcal{N}(\vec\mu_z,\Sigma)
\|
\mathcal{N}(0,I)
).
\]

#### Gaussian KL identity

For \(k\)-dimensional Gaussians:

\[
\operatorname{KL}
(
\mathcal{N}(\vec\mu',\Sigma')
\|
\mathcal{N}(0,I)
)
=
-\frac12
\left[
k+\log\det(\Sigma')
-
\|\vec\mu'\|_2^2
-
\operatorname{Tr}(\Sigma')
\right].
\]

Equivalently:

\[
\operatorname{KL}
=
\frac12
\left[
\operatorname{Tr}(\Sigma')
+
\|\vec\mu'\|_2^2
-
k
-
\log\det(\Sigma')
\right].
\]

---

### 8.12 VAE loss: Step 2 — sampling \(z\)

The slides define:

\[
\vec z
\sim
\mathcal{N}
(
\vec\mu_z,
\operatorname{diag}(\vec\sigma_z\circ\vec\sigma_z)
).
\]

So the latent vector is sampled from the encoder distribution.

#### [ADDED DETAIL] Reparameterisation trick

In implementations, this is usually done as:

\[
\vec z
=
\vec\mu_z
+
\vec\sigma_z\circ \vec\epsilon,
\]

where:

\[
\vec\epsilon\sim\mathcal{N}(0,I).
\]

This separates the randomness \(\vec\epsilon\) from the trainable outputs \(\vec\mu_z,\vec\sigma_z\), allowing gradients to flow through the sampling operation.

---

### 8.13 VAE loss: Step 3 — decoder and reconstruction loss

The decoder computes:

\[
\widehat x
=
\operatorname{Decoder}_\Theta(\vec z).
\]

The first term of VFE is:

\[
-\log p_\Theta(\vec x\mid \vec z).
\]

Given the Gaussian decoder likelihood with identity covariance:

\[
p_\Theta(\vec x\mid \vec z)
=
\mathcal{N}(\operatorname{Decoder}_\Theta(\vec z),I),
\]

the negative log-likelihood is:

\[
-\log p_\Theta(\vec x\mid \vec z)
=
\frac12
\|\vec x-\operatorname{Decoder}_\Theta(\vec z)\|_2^2
+
\text{constant}.
\]

Dropping constants:

\[
-\log p_\Theta(\vec x\mid \vec z)
=
\frac12
\|\vec x-\widehat x\|_2^2.
\]

---

### 8.14 VAE loss in code variables

The forward function returns:

\[
(\text{x hat},\text{mean},\text{log var})
=
(\widehat x,\vec\mu_z,2\log(\vec\sigma_z)).
\]

The VAE loss at data point \(\vec x\) is:

\[
-\log p_\Theta(\vec x\mid \vec z)
+
\operatorname{KL}
(
q_\Phi(\vec z\mid \vec x)
\|
p(\vec z)
).
\]

The slide gives the approximate/code form:

\[
\operatorname{VAE\ loss}(\vec x)
=
\frac12
\|\vec x-\text{x hat}\|_2^2
-
\frac12
\sum_{i=1}^{\text{latent-dimension}}
\left[
1
+
\text{log var}_i
-
\text{mean}_i^2
-
e^{\text{log var}_i}
\right].
\]

Equivalent positive-KL form:

\[
\operatorname{VAE\ loss}(\vec x)
=
\frac12
\|\vec x-\widehat x\|_2^2
+
\frac12
\sum_{i=1}^{\text{latent-dimension}}
\left[
e^{\text{log var}_i}
+
\text{mean}_i^2
-
1
-
\text{log var}_i
\right].
\]

Averaging over training data gives:

\[
\text{training VFE}.
\]

Averaging over test data gives:

\[
\text{test VFE}.
\]

**[EXAM/REVISION FLAG]** Be able to connect the code variables `x_hat`, `mean`, and `log_var` to the mathematical VAE loss.

---

### 8.15 VAE forward function is special

In ordinary neural networks, the forward function usually computes a deterministic output vector from an input vector.

In a VAE, the forward function implements a stochastic process:

1. Use encoder net on input \(\vec x\).
2. Produce latent Gaussian parameters:
   \[
   \vec\mu_z,
   \quad
   \text{log var}.
   \]
3. Sample an auxiliary random vector.
4. Produce:
   \[
   \vec z.
   \]
5. Use decoder net on \(\vec z\).
6. Return:
   \[
   (\widehat x,\vec\mu_z,\text{log var}).
   \]

The slides emphasise that this uses:

- two neural nets;
- an auxiliary random vector;
- the data vector;
- stochastic sampling.

**[EXAM/REVISION FLAG]** The VAE forward function is not just “evaluate a neural net”; it implements a stochastic encoder-sampling-decoder process.

---

## 9. Consolidated key concepts

### High-dimensional data

**Intuition:** Modern data objects are represented as real vectors with many coordinates.

**Formalism:** Examples include:

\[
x\in\mathbb{R}^n,
\]

token sequences:

\[
(x_1,\dots,x_T),\quad x_i\in\mathbb{R}^{800},
\]

and function encodings:

\[
[f(x_1),\dots,f(x_m)].
\]

### Probability density

**Intuition:** A density describes where uncertain data are likely to lie.

**Formalism:**

\[
p:\mathbb{R}^n\to[0,\infty),
\]

\[
\mathbb{P}[x\in A]=\int_A p(x)\,dx,
\]

\[
\int_{\mathbb{R}^n}p(x)\,dx=1.
\]

### Population risk

**Intuition:** Expected error over the true data distribution.

**Formalism:**

\[
R(w)
=
\mathbb{E}_{(x,y)\sim D}
[
\ell(w,x,y)
].
\]

### Empirical risk

**Intuition:** Average error over observed training data.

**Formalism:**

\[
\widehat R(w)
=
\frac1m
\sum_{i=1}^{m}
\ell(w,x_i,y_i).
\]

### Euclidean norm

**Intuition:** Length of a vector.

**Formalism:**

\[
\|v\|_2
=
\sqrt{\sum_{i=1}^p v_i^2}.
\]

### Convexity

**Intuition:** Tangent planes lie below the graph.

**Formalism:**

\[
F(x)+\nabla F(x)^\top(y-x)\le F(y).
\]

### Lagrangian optimality

**Intuition:** Incorporate constraints into the objective using multipliers.

**Formalism:**

\[
L(x,\lambda)=f(x)+\lambda^\top(Ax-b).
\]

Optimality:

\[
\nabla f(x^\star)+A^\top\lambda^\star=0,
\qquad
Ax^\star=b.
\]

### Spectral norm

**Intuition:** Largest stretch factor of a matrix.

**Formalism:**

\[
\|A\|_2
=
\max_{\|x\|_2=1}
\|Ax\|_2.
\]

### Gradient descent

**Intuition:** Move opposite the gradient.

**Formalism:**

\[
w_{t+1}=w_t-\eta_t\nabla F(w_t).
\]

### Johnson–Lindenstrauss property

**Intuition:** Random projections approximately preserve lengths/distances.

**Formalism:**

\[
(1-\varepsilon)\|a\|_2^2
\le
\|\Pi a\|_2^2
\le
(1+\varepsilon)\|a\|_2^2
\]

with high probability when:

\[
k=O\left(\frac{\log(1/\delta)}{\varepsilon^2}\right).
\]

### ReLU

**Intuition:** Pass positive values, zero out negative values.

**Formalism:**

\[
\operatorname{ReLU}(x)=\max\{0,x\}.
\]

### ReLU DNN

**Intuition:** Alternate affine maps and nonlinear activations.

**Formalism:**

\[
N(x)=A_{k+1}\circ \operatorname{ReLU}\circ A_k\circ\cdots\circ A_2\circ \operatorname{ReLU}\circ A_1(x).
\]

### Autoencoder

**Intuition:** Learn to reconstruct input, often through a compressed/structured hidden representation.

**Formalism:**

\[
y\mapsto \widetilde y,
\qquad
\widetilde y\approx y.
\]

Sparse coding example:

\[
h=\operatorname{ReLU}(Wy-\varepsilon),
\qquad
\widetilde y=W^\top h.
\]

### Generative model with latent variable

**Intuition:** Generate data by first sampling hidden causes \(z\), then sampling observed data \(x\).

**Formalism:**

\[
p_\Theta(x)
=
\int p_\Theta(x\mid z)p(z)\,dz.
\]

### KL divergence

**Intuition:** Asymmetric dissimilarity between probability distributions.

**Formalism:**

\[
\operatorname{KL}(p\|q)
=
\sum_x p(x)\log\frac{p(x)}{q(x)}.
\]

### ELBO

**Intuition:** A tractable lower bound/objective used instead of directly maximising marginal likelihood.

**Formalism:**

\[
\operatorname{ELBO}
=
\mathbb{E}_q[\log p(x\mid z)]
-
\operatorname{KL}(q(z\mid x)\|p(z)).
\]

### VFE / negative ELBO

**Intuition:** VAE training minimises reconstruction error plus KL regularisation.

**Formalism:**

\[
\operatorname{VFE}
=
-
\mathbb{E}_q[\log p(x\mid z)]
+
\operatorname{KL}(q(z\mid x)\|p(z)).
\]

---

## 10. Main worked examples to revise

### Example 1: high-dimensional cube

\[
[-1,1]^d
\]

diagonal:

\[
2\sqrt d.
\]

Inner sphere radius:

\[
r=\frac12(\sqrt d-1).
\]

Main lesson: low-dimensional intuition is misleading.

### Example 2: uniform density on \([-2,2]\)

\[
p(x)=\frac14
\]

on \([-2,2]\), zero elsewhere.

Check:

\[
\int_{-2}^{2}\frac14\,dx=1.
\]

### Example 3: Euclidean norm

\[
v=
\begin{bmatrix}
1\\-2\\-1
\end{bmatrix}
\]

\[
\|v\|_2=\sqrt6.
\]

### Example 4: spectral norm matrix

\[
A(\theta)
=
\begin{bmatrix}
0 & \theta\\
0 & 0
\end{bmatrix}.
\]

Eigenvalues:

\[
0.
\]

Spectral norm:

\[
\|A(\theta)\|_2=|\theta|.
\]

Spectral radius:

\[
\rho(A)=0.
\]

### Example 5: GD on \(x^2\)

\[
x_{t+1}=(1-2\eta_t)x_t.
\]

If:

\[
1-2\eta_t=k\in(0,1),
\]

then:

\[
x_t=x_0k^t\to 0.
\]

Convergence time:

\[
t
\ge
\frac{
\log(|x_0|/\varepsilon)
}{
\log(1/k)
}.
\]

### Example 6: Mexican-hat function

\[
F(x)=\frac12(x^2-4)^2.
\]

Derivative:

\[
F'(x)=2x(x^2-4).
\]

GD update:

\[
x_{t+1}=x_t-2\eta x_t(x_t^2-4).
\]

Global minima:

\[
x=\pm 2.
\]

### Example 7: JL linear regression sketch

Original:

\[
\min_\beta \|A\beta-y\|_2^2.
\]

Sketched:

\[
\min_\beta \|\Pi(A\beta-y)\|_2^2.
\]

Expected preservation:

\[
\mathbb{E}_\Pi\|\Pi(A\beta-y)\|_2^2
=
\|A\beta-y\|_2^2.
\]

### Example 8: one-layer ReLU computation

\[
x=
\begin{bmatrix}
1\\2
\end{bmatrix},
\quad
W=
\begin{bmatrix}
1&0\\
2&-1\\
0&-2
\end{bmatrix}.
\]

\[
Wx=
\begin{bmatrix}
1\\0\\-4
\end{bmatrix}.
\]

\[
\operatorname{ReLU}(Wx)
=
\begin{bmatrix}
1\\0\\0
\end{bmatrix}.
\]

### Example 9: max network

\[
\max(x_1,x_2)
=
\frac{x_1+x_2}{2}
+
\frac{|x_1-x_2|}{2}.
\]

Using ReLU:

\[
|a|=\operatorname{ReLU}(a)+\operatorname{ReLU}(-a).
\]

### Example 10: autoencoder global minimum special case

Given:

\[
y=A^\star x^\star,
\quad
A^\star\text{ orthogonal},
\quad
x^\star\ge 0,
\]

and:

\[
W^\top=A^\star,
\]

then:

\[
W^\top\operatorname{ReLU}(Wy)=y,
\]

so reconstruction loss is zero.

### Example 11: KL asymmetry

\[
p=
\left(\frac13,\frac13,\frac13\right),
\quad
q=
\left(\frac12,\frac12,0\right).
\]

\[
\operatorname{KL}(p\|q)=\infty.
\]

\[
\operatorname{KL}(q\|p)=\log\frac32.
\]

### Example 12: VAE code loss

Forward returns:

\[
(\widehat x,\text{mean},\text{log var}).
\]

Loss:

\[
\frac12
\|x-\widehat x\|_2^2
-
\frac12
\sum_i
[
1+\text{log var}_i-\text{mean}_i^2-e^{\text{log var}_i}
].
\]

Equivalent:

\[
\frac12
\|x-\widehat x\|_2^2
+
\frac12
\sum_i
[
e^{\text{log var}_i}
+\text{mean}_i^2
-1
-\text{log var}_i
].
\]

---

## 11. Explicit exam / revision flags

These are the highest-value items from the slides.

1. **Final exam structure:** 2-hour online Canvas MCQ; 25 marks from lectures 1–5, 25 from lectures 6–10.
2. **Main exam content:** theory of representation learning, with some coding questions.
3. **Core ML challenge:** minimise population risk while only seeing empirical risk.
4. **Convexity definition:** know the first-order tangent inequality.
5. **Constrained convex optimisation:** know how to use the Lagrangian/first-order conditions; proof not required.
6. **Neural losses are non-convex:** understand the sigmoid one-weight example.
7. **Spectral norm example:** be able to compute eigenvalues and spectral norm for \(A(\theta)\).
8. **GD algorithm:** know the update and the role of step size.
9. **GD convergence on \(x^2\):** be able to unroll the recurrence and derive the \(\log(1/\varepsilon)\) convergence time.
10. **Critical points:** GD does not move if initialised at a point where the gradient is zero.
11. **Important checks:** plot/check Gaussian, convexity examples, eigenvalues, GD recurrences.
12. **Johnson–Lindenstrauss:** know the random projection setup and the dimension scaling \(k=O(\log n/\varepsilon^2)\).
13. **Sketched regression:** understand why \(\mathbb{E}[\Pi^\top\Pi]=I\) implies loss preservation in expectation.
14. **PyTorch `Linear`:** mathematically affine when bias is included.
15. **Architecture versus function:** network diagram is not a function until weights are assigned.
16. **Autoencoder special case:** know why \(W^\top=A^\star\) gives zero loss when \(A^\star\) is orthogonal and \(x^\star\ge 0\).
17. **ELBO equation:** explicitly described as one of the most important equations in ML.
18. **VAE objective:** reconstruction loss plus KL divergence.
19. **VAE forward function:** stochastic, uses encoder, sampling, decoder, and returns \((\widehat x,\mu,\log\mathrm{var})\).
20. **VAE code loss:** know how the mathematical KL becomes the sum involving `mean`, `log_var`, and \(e^{\text{log_var}}\).

---

## 12. Connections across the lecture

### High-dimensional data → representation learning

The course begins with the fact that data are high-dimensional vectors, then asks whether lower-dimensional representations exist.

### Random variables → risk

Data uncertainty is formalised with random variables and distributions. This allows population risk to be defined as an expectation.

### Risk → optimisation

Training a model means minimising a risk function. This motivates convexity, constrained optimisation, and gradient descent.

### Convex optimisation → neural-network difficulty

Convex problems have clean theory. Neural-network losses are often non-convex, making training harder to analyse.

### Gradient descent → neural-network training

Plain GD is the simplest version of the gradient-based methods used in deep learning. Later methods such as ADAM build on this theme.

### Johnson–Lindenstrauss → representation compression

JL shows that random low-dimensional projections can preserve geometry, supporting the idea that high-dimensional data can often be represented compactly.

### Neural networks → autoencoders

Neural nets define flexible nonlinear function classes. Autoencoders use neural nets to learn representations by reconstructing inputs.

### Autoencoders → generative modelling

Sparse-coding autoencoders can recover a generating dictionary \(A^\star\), connecting reconstruction to the discovery of a data-generating process.

### Autoencoders → PCA

Bottleneck autoencoders are presented as nonlinear generalisations of PCA, which will be taught later.

### Generative modelling → VAE

Latent-variable generative models define:

\[
p_\Theta(x)=\int p_\Theta(x\mid z)p(z)\,dz.
\]

VAEs train such models using encoder/decoder neural nets and the ELBO/VFE objective.

---

## 13. Unclear or potentially garbled slide sections

1. **“Johnson-Lindenenstrauss” spelling**  
   Standard term: Johnson–Lindenstrauss.

2. **Probability “distribution function” terminology**  
   The slides use this phrase for \(p:\mathbb{R}^n\to[0,\infty)\). This is a density, not a cumulative distribution function.

3. **Convexity example mismatch**  
   One slide lists \(e^{-x}\); the checks slide lists \(e^{-2x}\). Both are convex.

4. **Eigenvector definition for rectangular matrices**  
   The slides write \(A\in\mathbb{R}^{m\times n}\), but eigenvalues/eigenvectors require square matrices in the usual sense.

5. **Sigmoid output range**  
   Slide writes \([0,\infty)\), but:
   \[
   \frac1{1+e^{-wx}}\in(0,1).
   \]

6. **GD indexing**  
   Slides use both \(w_1\)-style indexing and \(x_0\)-style indexing. The recurrence and convergence proof are clear, but exact \(t\) versus \(t+1\) indexing is slightly inconsistent.

7. **Sparse-coding notation \(h\)**  
   The slides use \(h\) both as a dimension and as the hidden activation vector.

8. **Garbled sparse-coding equation**  
   The equation around \(A^\star x^\star=y\) is visually garbled. Intended meaning:
   \[
   y=A^\star x^\star.
   \]

9. **Generative modelling posterior notation**  
   One slide mentions \(p_\Phi(z\mid x)\), but later VAE notation uses:
   \[
   q_\Phi(z\mid x).
   \]
   Standard VAE notation is \(q_\Phi\) for the encoder/approximate posterior.

10. **Linear regression expectation derivation typo**  
    One line appears to write \(Ax-y\) where it should be:
    \[
    A\beta-y.
    \]

11. **VAE Gaussian notation shorthand**  
    The slide writes:
    \[
    q_\Phi(z\mid x):=\mathcal{N}(f(\operatorname{Encoder}_\Phi(x))).
    \]
    This is shorthand for the encoder output being transformed into Gaussian parameters \((\mu,\Sigma)\).
