---
subject: COMP64802
chapter: 1
title: "Weeks 1-5"
language: bn
---

# Advanced Topics in ML (COMP 64802) — সপ্তাহ ১–৫ বাংলা স্টাডি নোট

**Course:** Advanced Topics in ML — COMP 64802  
**Lecture topic:** Introduction and Weeks 1–5 foundations for representation learning  
**Source:** আপলোড করা lecture slides; কোনো transcript দেওয়া হয়নি।

**বিষয় ও পরিসর।** এই lecture block আধুনিক representation learning-এর গাণিতিক ও algorithmic ভিত্তি তৈরি করে: high-dimensional data, risk minimisation, convex/non-convex optimisation, gradient descent, Johnson–Lindenstrauss dimensionality reduction, neural networks, autoencoders, generative modelling, এবং variational autoencoders।

**Source note.** এই নোটগুলো শুধুমাত্র slides থেকে তৈরি। Revision-এর সুবিধার জন্য কিছু standard mathematical detail যোগ করা হয়েছে; সেগুলো **[ADDED DETAIL / যোগ করা বিস্তারিত]** হিসেবে চিহ্নিত। Slides-এ সম্ভাব্য typo, ambiguous notation, অথবা garbled অংশগুলো **[UNCLEAR / অস্পষ্ট]** হিসেবে চিহ্নিত।

---

## 0. Course logistics and assessment

### Teaching split

- Weeks/lectures 1–5: **Anirbit** পড়াবেন।
- Weeks/lectures 6–10: **Omar** পড়াবেন।
- Graduate Teaching Assistants বা GTAs material বুঝতে সাহায্য করার জন্য available।

### Prerequisites

তোমার জানা থাকা expected:

- basic machine learning;
- কিছু PyTorch coding।

Course চলাকালীন basic PyTorch এবং ML-এর কিছু অংশ demonstration হিসেবে দেখানো হবে।

### Teaching materials

সব relevant material Blackboard/Canvas-এ থাকবে। এর মধ্যে আছে:

- Anirbit-এর অংশের কিছু video recordings;
- formative/unassessed practice questions;
- lecture slides, demonstration code সহ।

### Tutorials / computer classes

- Thursday computer/tutorial sessions Kilburn 1.8 + 1.10 এবং LF31-এ scheduled।
- সময়: 12:00–14:30।
- Course calendar-এ কিছু unusual feature আছে, তাই exact lecture/tutorial dates ভালোভাবে check করতে হবে।

### Interaction

Canvas-এ pinned discussion forums আছে:

- course feedback-এর জন্য একটি anonymous forum;
- content নিয়ে প্রশ্ন করার জন্য আরেকটি anonymous forum।

Questions Canvas-এ, class-এ, অথবা Thursday computer classes-এ answer করা হতে পারে।

### Assessment

#### Final exam

**[EXAM FLAG / পরীক্ষা-সংকেত]** Final exam হবে:

- 2 hours;
- পুরোপুরি MCQ-based;
- Canvas-এ online;
- total 50 marks:
  - lectures 1–5 থেকে 25 marks;
  - lectures 6–10 থেকে 25 marks;
- MCQs সাধারণত difficulty অনুযায়ী 1, 2, বা 3 marks-এর হবে।

**[EXAM FLAG / পরীক্ষা-সংকেত]** Exam মূলত **theory of representation learning** নিয়ে, তবে coding aspects থেকেও কয়েকটি প্রশ্ন থাকবে।

#### Coursework

- 2টি coursework থাকবে।
- দুটির score-ই final score-এ count করবে।
- প্রতিটি coursework করার জন্য প্রায় 14 দিন দেওয়া হবে।
- Dates Canvas-এ আছে।

---

## 1. Introduction: data as high-dimensional vectors

### 1.1 Data are vectors in high dimensions

Lecture শুরু হয় আধুনিক ML-এর একটি core viewpoint দিয়ে:

> Real-world data সাধারণত high-dimensional real-valued vectors হিসেবে represent করা হয়।

Examples:

#### Images

- High-quality image-এ millions of pixels থাকে।
- প্রতিটি pixel এক বা একাধিক real number দিয়ে represented হয়, সাধারণত bounded।
- তাই একটি image-কে খুব high-dimensional real vector space-এর vector হিসেবে দেখা যায়।

যেমন, যদি কোনো image-এ \(m\) scalar pixel values থাকে, তাহলে image-টি:

\[
x \in \mathbb{R}^m.
\]

#### Text / GPT-style models

- Text-কে character clusters বা **tokens**-এ split করা হয়।
- প্রতিটি token real vector হিসেবে represent বা **embed** করা হয়।
- Slides-এ প্রায় \(800\)-dimensional embeddings-এর কথা বলা হয়েছে।
- তাই sentence raw characters হিসেবে নয়, বরং vectors-এর sequence/collection হিসেবে input হয়।

তাই \(T\) tokens-এর একটি sentence informally represented হতে পারে:

\[
(x_1, x_2, \dots, x_T), \qquad x_i \in \mathbb{R}^{800}.
\]

#### Functions as data

Modern ML কখনও real-valued function-কে input হিসেবে নেয়।

একটি function \(f\)-কে chosen points-এ sample করে encode করা যায়:

\[
f \quad \leadsto \quad [f(x_1), f(x_2), \dots, f(x_m)].
\]

এখানে:

- \((x_1,\dots,x_m)\) হলো function-এর domain-এর chosen points;
- encoded function একটি \(m\)-dimensional vector হয়ে যায়;
- এমনকি simple functions-এর জন্যও \(m\) hundreds-এ হতে পারে।

### 1.2 Low-dimensional representations

এরপর lecture প্রশ্ন করে:

> High-dimensional data-এর low-dimensional representations আছে কি?

উত্তর often yes, কারণ:

- real-world data-এর coordinates অনেক সময় independent নয়;
- coordinates-এর মধ্যে সম্পর্ক infer করা যায়:
  - data থেকে;
  - prior knowledge থেকে;
- ফলে high-dimensional data হয়তো কোনো lower-dimensional structure-এর কাছাকাছি থাকে।

**Key course theme:** low-dimensional representations study করাই course-এর মূল বিষয়।

তবে:

> High dimensions থেকে সম্পূর্ণ escape নেই।

Final representation low-dimensional হলেও, সেই representation খুঁজে বের করার process-কে সাধারণত very high-dimensional data process করতে হয়।

---

## 2. High-dimensional intuition: low-dimensional pictures mislead

Slides একটি geometric example দেয় যাতে বোঝানো হয় 2D/3D intuition high dimensions-এ trust করা বিপজ্জনক।

### 2.1 Setup: a \(d\)-dimensional cube

Diagram-টিকে \(d\) dimensions-এর cube হিসেবে ভাবা হয়:

\[
[-1,1]^d.
\]

এই cube-এর side length হলো \(2\)।

\(d\)-dimensional cube-এর diagonal length Pythagoras দিয়ে:

\[
\sqrt{2^2 + 2^2 + \cdots + 2^2}
= \sqrt{d \cdot 2^2}
= 2\sqrt{d}.
\]

### 2.2 Inner sphere radius

Diagram-এ outer white circles/spheres-এর diameter \(1\), তাই radius:

\[
\frac{1}{2}.
\]

একটি inner black sphere origin-এ centered এবং তার radius \(r\)।

Slide cube-এর center থেকে একটি outer sphere-এর center-এর distance দুইভাবে compare করে।

Cube center থেকে relevant corner/centre direction-এর distance:

\[
\frac14 \cdot (2\sqrt d)
=
\frac{\sqrt d}{2}.
\]

Inner sphere outer sphere-কে touch করে, তাই:

\[
r + \frac12 = \frac{\sqrt d}{2}.
\]

অতএব:

\[
r = \frac12(\sqrt d - 1).
\]

### 2.3 Main lesson

যখন \(d \to \infty\),

\[
r = \frac12(\sqrt d - 1) \to \infty.
\]

তাই “inner” sphere-এর radius unboundedভাবে বাড়ে এবং square/cube intuition অনুযায়ী সেটি অনেকটা “outside” হয়ে যায়।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** Slide স্পষ্টভাবে বলে:

> Low-dimensional pictures are very misleading.

এটি পুরো course-এর জন্য conceptual warning: high-dimensional geometry 2D/3D geometry থেকে খুব আলাদা আচরণ করে।

---

## 3. Seven foundational concepts

Lecture সাতটি concept introduce করে, Concept 7 থেকে Concept 1 পর্যন্ত reverse order-এ।

---

## 3.1 Concept 7 — Random variables

### Intuition

Data uncertain।

Machine learning algorithms সাধারণত একটি fixed deterministic object পায় না। বরং data কোনো uncertain process থেকে sampled হয় বলে model করা হয়।

এই uncertainty formalভাবে প্রকাশ করার language হলো **random variables**।

### Random variables used in this course

Course-এ focus করা হচ্ছে Euclidean space-valued random variables-এর ওপর:

\[
x \in \mathbb{R}^n.
\]

এখানে \(n\) সাধারণত data dimension।

For example:

- image vector হতে পারে \(x \in \mathbb{R}^{10^6}\);
- token embedding হতে পারে \(x \in \mathbb{R}^{800}\);
- function encoding হতে পারে \(x \in \mathbb{R}^m\)।

### Probability density function

Slides ধরে নেয় “nice random variables” সম্পূর্ণভাবে একটি probability distribution function দিয়ে described:

\[
p : \mathbb{R}^n \to [0,\infty).
\]

আরও precisely, continuous random variables-এর জন্য এটি একটি **probability density function**।

Function \(p\) data-generating process-এর “fuzziness” বা uncertainty encode করে।

**[UNCLEAR / TERMINOLOGY / অস্পষ্ট]** Slides এটিকে “probability distribution function” বলে। Continuous variables-এর ক্ষেত্রে \(p(x)\)-কে বেশি precisely **probability density function** বলা হয়। Distribution function সাধারণত cumulative distribution function বোঝায়।

### Events and probability mass

যেকোনো event/subset:

\[
A \subseteq \mathbb{R}^n,
\]

random variable \(A\)-এর মধ্যে থাকার probability:

\[
\mathbb{P}[x \in A]
=
\int_A p(x)\,dx.
\]

All space জুড়ে total probability অবশ্যই \(1\):

\[
\int_{\mathbb{R}^n} p(x)\,dx = 1.
\]

### Example 1: Uniform distribution on \([-2,2]\)

Slide দেয়:

\[
p(x) =
\begin{cases}
\frac14, & x \in [-2,2],\\
0, & \text{otherwise}.
\end{cases}
\]

মানে:

- \([-2,2]\)-এর প্রতিটি value equally likely;
- \([-2,2]\)-এর বাইরে values impossible।

Total mass check:

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

Slide দেয়:

\[
p(x,y)
=
\frac{e^{-\frac12(x^2+y^2)}}{2\pi},
\qquad (x,y)\in \mathbb{R}^2.
\]

এটি standard two-dimensional Gaussian density:

\[
(x,y) \sim \mathcal{N}(0,I_2).
\]

Interpretation:

- \(\mathbb{R}^2\)-এর যেকোনো point possible;
- origin থেকে দূরে গেলে probability exponentially কমে;
- distribution origin-এর around radially symmetric।

Total mass:

\[
\int_{\mathbb{R}^2}
\frac{e^{-\frac12(x^2+y^2)}}{2\pi}
\,dx\,dy
= 1.
\]

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** “Important Checks” slide বলে তুমি যেন:

- এই Gaussian distribution plot করতে পারো;
- verify করতে পারো যে এটি one-এ integrate করে।

---

## 3.2 Concept 6 — Risk function

### Intuition

Supervised machine learning-এ আমরা predictor choose করি এবং তার prediction কত খারাপ তা measure করি।

**Risk** হলো true data distribution-এর ওপর predictor-এর expected loss।

কঠিন ব্যাপার হলো true distribution সাধারণত unknown, তাই আমরা samples-এর ওপর empirical risk minimise করি এবং আশা করি population risk-ও কমবে।

### Supervised learning setup

Data দেখতে:

\[
(x,y),
\]

যেখানে:

- \(x\) input;
- \(y\) label।

Input space হলো \(X\), label space হলো \(Y\)।

Model/predictor একটি function:

\[
f : X \to Y.
\]

Available class of possible predictors:

\[
\mathcal{F}.
\]

### Example: binary classification

Slides দেয়:

\[
y =
\begin{cases}
1, & x_1^2 + x_2^2 \le 5,\\
-1, & \text{otherwise},
\end{cases}
\]

যেখানে:

\[
x = (x_1,x_2).
\]

এটি binary classification task যেখানে positive class circle of radius \(\sqrt 5\)-এর ভিতরে।

### Example model class: linear functions

Slides consider করে:

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

এখানে:

- \(w\) parameter/weight vector;
- \(\langle w,x\rangle\) dot product।

### Loss function

Loss function predictor \(f\)-এর error measure করে।

Predictor-এর weights যদি \(w\) হয়, loss লেখা হয়:

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

Factor \(\frac12\) derivative simplify করার জন্য often ব্যবহার করা হয়।

### Population risk / expected loss

ধরা যাক data distribution \(D\), density \(p\), space \(X\times Y\)-এর ওপর।

**Population risk**:

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

- এটি true expected prediction error;
- real distribution থেকে possible সব data-এর ওপর average করে;
- এটিই আসলে আমরা minimise করতে চাই।

### Empirical risk

Practice-এ আমরা \(D\) বা \(p\) জানি না।

বরং আমাদের samples থাকে:

\[
(x_1,y_1),\dots,(x_m,y_m).
\]

**Empirical risk**:

\[
\widehat{R}(w)
=
\frac1m
\sum_{i=1}^{m}
\ell(w,x_i,y_i).
\]

Interpretation:

- empirical risk হলো average training error;
- এটি data থেকে computable;
- এটি population risk approximate করে।

### Core ML challenge

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** Slides explicitly state:

> Machine learning-এর core challenge হলো population risk minimise করা, যখন access আছে শুধু empirical risk-এর।

এটি lecture-এর সবচেয়ে গুরুত্বপূর্ণ ideas-এর একটি।

---

## 3.3 Concept 5 — Euclidean norm

### Intuition

Data vector হিসেবে represent করলে vector-এর size measure করা দরকার।

এখানে main size measure হলো Euclidean norm, অর্থাৎ \(2\)-norm।

### Formal definition

যদি:

\[
v \in \mathbb{R}^p,
\qquad
v =
(v_1,\dots,v_p),
\]

তাহলে \(2\)-norm:

\[
\|v\|_2
=
\sqrt{
v_1^2 + v_2^2 + \cdots + v_p^2
}.
\]

এটি origin থেকে \(v\)-এর Euclidean distance।

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

তাহলে:

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

Convex functions important কারণ এগুলো optimise করা general functions-এর তুলনায় অনেক সহজ।

Differentiable convex function-এর geometric property হলো: যেকোনো point-এ tangent plane function-এর graph-এর নিচে থাকে।

One dimension-এ: যেকোনো point-এ tangent line draw করলে function কখনও সেই tangent line-এর নিচে যায় না।

### Formal definition used in the slides

ধরা যাক:

\[
F:\mathbb{R}^p\to\mathbb{R}
\]

differentiable।

তাহলে \(F\) convex যদি সব \(x,y\)-এর জন্য:

\[
F(x) + \nabla F(x)^\top (y-x)
\le
F(y).
\]

Gradient:

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

Expression:

\[
F(x) + \nabla F(x)^\top (y-x)
\]

হলো point \(x\)-এ \(F(y)\)-এর first-order linear approximation।

Convexity বলে:

\[
\text{linear approximation at }x
\le
\text{true function value at }y.
\]

তাই tangent hyperplane সবসময় function-এর নিচে থাকে।

### Examples from the slides

Slides examples দেয়:

\[
F(x)=x^2,
\qquad
F(x)=x^4,
\qquad
F(x)=e^{-x}.
\]

“Important Checks” slide পরে verify করতে বলে:

\[
x^2
\quad\text{and}\quad
e^{-2x}.
\]

**[UNCLEAR / অস্পষ্ট]** Convexity example slide-এ \(e^{-x}\), আর checks slide-এ \(e^{-2x}\) আছে। দুইটিই convex, কিন্তু mismatch note করা দরকার।

### Convex functions may or may not have minima

Slides convex functions-এর examples দেখায় যেগুলো:

1. unique global minimum আছে;
2. কোনো minimum নেই।

Example:

\[
F(x)=x^2
\]

unique global minimum at:

\[
x=0.
\]

অন্যদিকে:

\[
F(x)=e^{-x}
\]

convex হলেও finite minimiser নেই, কারণ:

\[
e^{-x}\to 0
\quad\text{as}\quad x\to \infty,
\]

কিন্তু \(e^{-x}\) কখনও \(0\) attain করে না।

### ReLU and non-differentiability

Slides ReLU mention করে:

\[
\operatorname{ReLU}(x)=\max\{0,x\}.
\]

ReLU \(x=0\)-এ differentiable নয়, কিন্তু broader definitions of convexity অনুযায়ী এটি convex।

**[ADDED DETAIL / যোগ করা বিস্তারিত]** ReLU convex কারণ \(x<0\)-এ এটি constant \(0\), \(x>0\)-এ linear \(x\), এবং slope \(0\) থেকে \(1\)-এ upward jump করে। One-dimensional convexity-এর একটি typical sign হলো slope increasing হওয়া।

---

## 3.5 Concept 3 — Basics of constrained convex optimisation

### Motivation

Machine learning often function minimisation problem হয়ে যায়।

Example, training মানে হতে পারে minimise করা:

\[
R(w)
\quad\text{or}\quad
\widehat R(w).
\]

কিন্তু general function minimisation extremely hard। Slides একটি basic কিন্তু important result-এ সীমাবদ্ধ থাকে:

> Full-rank linear equality constraints-এর অধীনে differentiable convex function minimise করা।

### Problem statement

ধরা যাক:

\[
f:\mathbb{R}^n\to\mathbb{R}
\]

differentiable এবং convex।

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

Slides assume করে minimum exists।

### Optimality condition

একটি point:

\[
x^\star\in\mathbb{R}^n
\]

constrained optimisation problem solve করে iff exists:

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

এগুলো equality-constrained first-order optimality conditions।

### Lagrangian

Define Lagrangian:

\[
L(x,\lambda)
=
f(x) + \lambda^\top(Ax-b).
\]

Here:

- \(\lambda\) হলো **Lagrange multipliers** vector;
- \(Ax-b=0\) constraint encode করে।

Optimality conditions equivalent to:

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

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** Slides বলে result-টি prove করা কঠিন এবং তোমাদের শুধু এটি **use** করতে জানা দরকার।

**[ADDED DETAIL / যোগ করা বিস্তারিত]** Broader optimisation courses-এ এগুলোকে often KKT conditions বলা হয়। এই equality-constrained convex setting-এ, slide assumptions-এর অধীনে এগুলো necessary এবং sufficient।

---

## 3.6 Concept 2 — Example of non-convex neural losses

### Motivation

Course শুধুমাত্র convex functions-এ সীমাবদ্ধ থাকতে পারে না, কারণ neural-network loss functions often non-convex।

Slides একটি simple example দেয় যেখানে খুব ছোট neural setup-তেও non-convexity দেখা যায়।

### Data

Training data চারটি point:

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

Model হলো weight \(w\) সহ একটি single sigmoid gate:

\[
x
\mapsto
\frac{1}{1+e^{-wx}}.
\]

**[UNCLEAR / অস্পষ্ট]** Slide output range \([0,\infty)\) লিখেছে, কিন্তু sigmoid function আসলে values নেয়:

\[
(0,1).
\]

### Regularised squared loss

Slide regularised squared loss define করে:

\[
F(w)
=
\frac14
\sum_{i=1}^{4}
\ell_{x_i,y_i}(w)
+
\lambda w^2.
\]

Squared loss দিয়ে:

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

Key viewpoint:

> Losses are functions of the weights.

এখানে weight one-dimensional, তাই:

\[
F:\mathbb{R}\to[0,\infty).
\]

### Non-convexity

যখন:

\[
\lambda=0.13,
\]

plot দেখায় \(F(w)\):

- convex নয়;
- একটি local maximum আছে;
- দুইটি local minima আছে;
- local minima-গুলোর only one global।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** এটি lecture-এর concrete example যে neural losses খুব simple networks-এর জন্যও non-convex হতে পারে।

---

## 3.7 Concept 1 — Spectral norm of matrices

### Intuition

Matrix vectors-এর ওপর act করে। Spectral norm measure করে matrix কোনো vector-কে সবচেয়ে বেশি কত stretch করতে পারে।

### Formal definition

For:

\[
A\in\mathbb{R}^{m\times n},
\]

\(2,2\)-norm, also called spectral norm:

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

Context clear হলে এটি লেখা হয়:

\[
\|A\|_2.
\]

### Eigenvectors and eigenvalues

Slide eigenvector/eigenvalue define করে:

\[
Av = \lambda v.
\]

**[UNCLEAR / TECHNICAL / অস্পষ্ট]** Eigenvalues normally square matrices \(A\in\mathbb{R}^{n\times n}\)-এর জন্য defined। Spectral norm rectangular matrices-এর জন্য defined, কিন্তু eigenvalue equation \(Av=\lambda v\) direct sense করে যখন input/output dimensions match করে।

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

Characteristic polynomial:

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

So only eigenvalue:

\[
\lambda=0.
\]

Therefore spectral radius, অর্থাৎ largest eigenvalue magnitude:

\[
\rho(A)=0.
\]

#### Spectral norm

Unit vector in \(\mathbb{R}^2\):

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

যেহেতু \(|\theta|\) arbitrarily large হতে পারে, spectral radius এবং spectral norm-এর gap arbitrarily large হতে পারে।

### Main takeaway

In general:

\[
\text{spectral radius}
\le
\text{spectral norm}.
\]

কিন্তু gap arbitrarily large হতে পারে।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** “Important Checks” slide তোমাকে এই tricky spectral norm example-এর eigenvalues verify করতে বলে।

---

## 4. Introduction to gradient descent

### 4.1 Motivation

Lecture gradient descent-কে সবচেয়ে basic gradient-based training algorithm হিসেবে introduce করে।

Modern neural networks সাধারণত আরও complicated variants দিয়ে train করা হয়, কিন্তু gradient descent vanilla starting point।

Slides mention করে:

- modern training algorithms complicated;
- gradient-based methods deep learning-এ central;
- ADAM later example code-এ use হবে এবং course-এর core part।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** ADAM practical method হিসেবে later use হবে, যদিও এই lecture plain gradient descent-এ focus করে।

---

## 4.2 Gradient descent algorithm

Let:

\[
F:\mathbb{R}^p\to\mathbb{R}
\]

be differentiable।

Gradient descent নেয়:

- initial point \(w_1\);
- number of steps \(T>0\);
- step-size sequence:

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

- \(\nabla F(w_t)\) local steepest increase direction-এ point করে।
- তাই \(-\nabla F(w_t)\) local steepest decrease direction।
- Step size \(\eta_t\) কত দূর move করবে তা control করে।

### Key unresolved question

Slides প্রশ্ন করে:

> যদি \(F\)-এর global minima থাকে, GD কখন একটি global minimum খুঁজে পায়, কোনটি খুঁজে পায়, এবং কত দ্রুত?

এটি general case-এ largely unresolved বলা হয়েছে।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** GD state করা simple, কিন্তু full generality-তে analyse করা কঠিন, বিশেষ করে non-convex neural losses-এর জন্য।

---

## 4.3 Proof of convergence of GD on \(F(x)=x^2\)

Lecture একটি clean example করে যেখানে convergence exactly দেখানো যায়।

### Objective

\[
F(x)=x^2.
\]

Derivative:

\[
F'(x)=2x.
\]

### GD update

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

### Unrolling the recurrence

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

**[UNCLEAR / অস্পষ্ট]** Slides \(x_0\) এবং \(w_1\)-style indexing দুটোই use করে। Main idea unchanged, তবে small indexing mismatch আছে।

### Critical points

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

So algorithm moves না।

More generally, algorithm যদি critical point-এ start করে:

\[
F'(x_0)=0,
\]

then gradient descent move করে না।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** Slides explicitly বলে critical points GD algorithms-এর starting points হিসেবে use করা উচিত নয়।

### Choosing a constant step length

আমরা চাই:

\[
x_t\to 0,
\]

কারণ \(x=0\) হলো \(F(x)=x^2\)-এর global minimum।

Sufficient condition হলো choose করা:

\[
1-2\eta_i=k
\]

সব \(i\)-এর জন্য, যেখানে:

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

Therefore GD global minimum-এ converge করে।

### Non-asymptotic convergence time

প্রশ্ন: minimum-এর \(\varepsilon>0\) interval-এর মধ্যে যেতে কত steps লাগবে?

Require:

\[
|x_{t+1}|\le \varepsilon.
\]

Using:

\[
|x_{t+1}|=|x_0|k^{t+1},
\]

slide essentially condition writes:

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

Since \(0<k<1\), \(\log k<0\)। Equivalently:

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

Slides এটিকে very fast বলে, এবং “as fast as GD can ever be”।

---

## 4.4 GD on a non-convex “Mexican hat” function

Slides GD convergence দেখায়:

\[
F(x)
=
\frac12(x^2-2^2)^2
=
\frac12(x^2-4)^2.
\]

Experiment uses:

\[
\eta=10^{-3},
\qquad
T=10^4,
\]

starting near:

\[
x=3.5.
\]

Plot দেখায় GD global minimum-এর দিকে progress করছে।

### [ADDED DETAIL / যোগ করা বিস্তারিত] Derivative and update

Derivative compute করি:

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

Therefore GD update:

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

Global minima satisfy:

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

এই function-এ \(x=0\) global minimum নয়।

### Main lesson

Non-convex functions-এর জন্যও GD interesting cases-এ global minimum পেতে পারে। কিন্তু increasingly hard non-convex cases-এ convergence prove করা কঠিন এবং course-এর বাইরে।

---

## 4.5 Important checks from the lecture

“Important Checks on Learning” slide concrete revision tasks list করে।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** তুমি যেন পারো:

1. Given Gaussian distribution plot করতে।
2. Verify করতে যে Gaussian density integrates to one।
3. Convexity verify করতে, যেমন:
   \[
   x^2,
   \qquad
   e^{-2x}.
   \]
4. Spectral norm example-এর eigenvalues verify করতে:
   \[
   A(\theta)=
   \begin{bmatrix}
   0 & \theta\\
   0 & 0
   \end{bmatrix}.
   \]
5. Differentiable functions-এর জন্য consecutive GD iterates-এর relations derive করতে।
6. Mexican-hat example দিয়ে শুরু করতে।
7. High-dimensional analogues try করতে, যেমন:
   \[
   f(W)
   =
   \left(
   \operatorname{Tr}(AA^\top)
   -
   \operatorname{Tr}(WW^\top)
   \right)^2.
   \]

### [ADDED DETAIL / যোগ করা বিস্তারিত] Matrix analogue derivative

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

So GD update with step size \(\eta\):

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

এটি scalar Mexican-hat recurrence-এর analogous।

---

## 5. Johnson–Lindenstrauss dimensionality reduction

**[UNCLEAR / SPELLING / অস্পষ্ট]** Slide section title repeatedভাবে “Johnson-Lindenenstrauss” spelling ব্যবহার করে। Standard spelling হলো **Johnson–Lindenstrauss**।

---

## 5.1 Motivation

High-dimensional vectors store এবং process করা expensive।

Johnson–Lindenstrauss result একটি general-purpose dimensionality reduction method দেয়:

> Randomly high-dimensional data-কে much lower-dimensional space-এ project করা, while approximately preserving distances।

এটি downstream tasks-এর জন্য useful যেখানে pairwise distances বা norms গুরুত্বপূর্ণ।

---

## 5.2 Random Gaussian projection

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

যদি \(k\ll d\), \(\Pi\) high-dimensional vectors-কে much lower-dimensional space-এ map করে।

---

## 5.3 \((\varepsilon,\delta)\)-Johnson–Lindenstrauss property

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

Random Gaussian projection approximately squared length preserve করে:

\[
\|\Pi a\|_2^2
\approx
\|a\|_2^2.
\]

Failure probability at most \(\delta\)।

### Important feature

Target dimension \(k\) depends on:

- error tolerance \(\varepsilon\);
- failure probability \(\delta\);

কিন্তু original dimension \(d\)-এর ওপর directly depend করে না।

এটি surprising এবং powerful।

---

## 5.4 Johnson–Lindenstrauss lemma for \(n\) points

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

such that pairwise distances approximately preserved:

\[
(1-\varepsilon)\|a_i-a_j\|_2
\le
\|f(a_i)-f(a_j)\|_2
\le
(1+\varepsilon)\|a_i-a_j\|_2.
\]

This holds for all pairs \(i,j\)।

### [ADDED DETAIL / যোগ করা বিস্তারিত] Why pairwise distances follow from norm preservation

প্রতিটি pair-এর জন্য:

\[
a_i-a_j
\]

একটি vector in \(\mathbb{R}^d\)।

যদি \(\Pi\) প্রতিটি difference vector \(a_i-a_j\)-এর norm preserve করে, তাহলে pairwise distances preserve করে।

Pairs-এর সংখ্যা:

\[
\binom n2.
\]

Union bound dimension bound-এ \(\log n\) কেন আসে তা explain করে।

---

## 5.5 Application: sketched linear regression

### Original linear regression

ধরা যাক data vectors:

\[
a_1,\dots,a_n\in\mathbb{R}^d.
\]

এগুলো rows হিসেবে matrix-এ stack করি:

\[
A\in\mathbb{R}^{n\times d}.
\]

Labels:

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

Residual vector:

\[
r(\beta)=A\beta-y\in\mathbb{R}^n.
\]

### Sketched linear regression

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

and \(G_{ij}\sim\mathcal{N}(0,1)\) independently।

Define sketched objective:

\[
\min_{\beta\in\mathbb{R}^d}
\widehat R_\Pi(\beta)
=
\min_{\beta\in\mathbb{R}^d}
\|\Pi(A\beta-y)\|_2^2.
\]

এটি residual vector-কে dimension \(n\) থেকে \(k\)-তে compress করে।

### Key claims

Slides state:

- sketched linear regression faster solve করা যায়;
- optimal value nearly preserved:

\[
\min_{\beta\in\mathbb{R}^d}
\|\Pi(A\beta-y)\|_2^2
\sim
\min_{\beta\in\mathbb{R}^d}
\|A\beta-y\|_2^2.
\]

Full proof course-এর বাইরে, কিন্তু slides expectation calculation দেয়।

---

## 5.6 Expected preservation of regression loss

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

Since \(r\) fixed with respect to \(\Pi\):

\[
\mathbb{E}_\Pi[\widehat R_\Pi(\beta)]
=
r^\top
\mathbb{E}_\Pi[\Pi^\top\Pi]
r.
\]

Slides বলে exercises-এ prove করবে:

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

So random normal projection linear regression loss **in expectation** preserve করে।

### [ADDED DETAIL / যোগ করা বিস্তারিত] Proof of \(\mathbb{E}[\Pi^\top\Pi]=I\)

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

The \((j,\ell)\)-entry:

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

**[UNCLEAR / অস্পষ্ট]** একটি slide line \((Ax-y)^\top(Ax-y)\) লিখেছে, কিন্তু regression parameter \(\beta\), তাই এটি হওয়া উচিত \((A\beta-y)^\top(A\beta-y)\)।

---

## 6. Neural networks and autoencoders

---

## 6.1 Activation gates

### Neural gates versus Boolean gates

Boolean circuits gates use করে যেমন:

- AND;
- OR;
- NOT;
- threshold gates।

Neural networks analogue activation gates use করে।

Basic neural gate computes:

\[
y
=
\sigma\left(\sum_{i=1}^{3}w_ix_i\right).
\]

Here:

- \(x_1,x_2,x_3\) inputs;
- \(w_1,w_2,w_3\) weights;
- \(\sigma:\mathbb{R}\to\mathbb{R}\) activation function;
- output real number।

Gate maps:

\[
\mathbb{R}^3\to\mathbb{R}.
\]

যদি gate থেকে অনেক outgoing edges থাকে, একই output value সবগুলোতে passed হয়।

---

## 6.2 ReLU activation

Slides বলে বেশিরভাগ purposes-এর জন্য “best” activation function হলো Rectified Linear Unit:

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

### Affine layer

PyTorch-এর `Linear` keyword দিয়ে implemented layer mathematically affine map:

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

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** PyTorch এটিকে `Linear` বলে, কিন্তু bias term থাকলে mathematically এটি affine, purely linear নয়।

---

## 6.3 One-layer ReLU network

ReLU সহ one layer:

\[
N:\mathbb{R}^n\to\mathbb{R}^p,
\]

\[
x\mapsto \max\{0,Wx+b\}.
\]

Max componentwise applied।

### Worked example

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

## 6.4 A depth-2, width-4 ReLU net computing \(\max(x_1,x_2)\)

Slide একটি ReLU network দেয় যা compute করে:

\[
\max(x_1,x_2).
\]

Key identity:

\[
\max(x_1,x_2)
=
\frac{x_1+x_2}{2}
+
\frac{|x_1-x_2|}{2}.
\]

### [ADDED DETAIL / যোগ করা বিস্তারিত] ReLU implementation

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

চারটি ReLU gates use করি:

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

এটি slide-এর output expression-এর সাথে match করে:

\[
\frac{x_1+x_2}{2}
+
\frac{|x_1-x_2|}{2}.
\]

---

## 6.5 General ReLU deep neural network

Given affine transformations:

\[
A_i:\mathbb{R}^{w_{i-1}}\to\mathbb{R}^{w_i},
\qquad
i=1,\dots,k+1,
\]

a depth \(k+1\) ReLU deep neural network:

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

Slide expression-এ final layer affine, earlier layers-এর মাঝে ReLUs।

---

## 6.6 Architecture versus neural function

Slide একটি example architecture দেখায়:

\[
\mathbb{R}^4 \to \mathbb{R}^3.
\]

Important distinction:

- **Neural architecture** হলো layers/connections-এর graph/diagram।
- **Neural function** পাওয়া যায় only after edges-এ actual weights এবং layers-এ biases assign করলে।

Slide explicitly বলে diagram এখনো neural function নয়, কারণ weights assigned হয়নি।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** Network diagram weights specify না করা পর্যন্ত single function define করে না; বরং একটি class/set of neural functions define করে।

---

## 6.7 Why neural functions are exciting

Slides realistic human portraits দেখায় যা neural net produce করেছে।

Main idea:

> Neural net human faces-এর distribution learn করে তা থেকে sample করতে পারে।

এটি generative modelling motivate করে।

---

## 6.8 Neural net objectives: population and empirical risk

For:

- data distribution \(D\);
- finite sample set \(S\);
- loss function \(\ell\);
- neural net \(N\);

population risk:

\[
R(N)
=
\mathbb{E}_{(x,y)\sim D}
[
\ell(y,N(x))
].
\]

এটি all data-এর ওপর expected prediction error measure করে।

Empirical risk:

\[
\widehat R(N)
=
\mathbb{E}_{(x,y)\sim \operatorname{Unif}(S)}
[
\ell(y,N(x))
].
\]

এটি seen training data-এর ওপর average prediction error।

যেহেতু \(N\) weights vary করলে change করে, লেখা যায়:

\[
R(N)=R(w),
\qquad
\widehat R(N)=\widehat R(w),
\]

where \(w\) সব trainable weights denote করে।

---

## 6.9 Depth-2 ReLU population risk example

Slides দেয়:

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

Neural network:

\[
x
\mapsto
\langle a,\max\{0,Wx\}\rangle.
\]

Here:

- \(W\) input-কে hidden units-এ map করে;
- ReLU componentwise applied;
- \(a\) hidden activations combine করে scalar output দেয়।

Slides note করে neural nets-এর জন্য exact expectations evaluate করা rare।

---

## 6.10 Autoencoders

Slides autoencoders introduce করে যেখানে input এবং output same dimension।

Intuition:

> Autoencoder input reconstruct করার চেষ্টা করে।

Generic autoencoder has:

- encoder;
- compressed বা hidden representation;
- decoder;
- reconstructed output।

Input \(y\), output:

\[
\widetilde y.
\]

Goal:

\[
\widetilde y \approx y.
\]

---

## 6.11 Sparse coding autoencoder

### Generative model

Slides sparse-coding setup define করে:

\[
x^\star\in\mathbb{R}^h
\]

sparse, and:

\[
y=A^\star x^\star\in\mathbb{R}^n.
\]

Dimensions satisfy:

\[
h\gg n.
\]

Interpretation:

- \(x^\star\) high-dimensional sparse source code;
- \(A^\star\) true generating dictionary/matrix;
- \(y\) observed data।

### Autoencoder hidden representation

Define:

\[
h
:=
\operatorname{ReLU}(Wy-\varepsilon \vec{1})
=
\max\{0,Wy-\varepsilon\}
\in\mathbb{R}^h.
\]

**[UNCLEAR / অস্পষ্ট]** Slide \(h\)-কে latent dimension এবং hidden representation—দুই অর্থে use করে। Context দিয়ে distinguish করতে হয়।

### Reconstruction

Autoencoder output:

\[
\widetilde y
=
W^\top h
\in\mathbb{R}^n.
\]

### Loss function

Typical loss:

\[
L(W)
=
\frac12
\|\widetilde y-y\|_2^2
+
\lambda\|W\|_F^2.
\]

First term reconstruction error।

Second term Frobenius-norm regularisation।

---

## 6.12 Sparse coding as generative modelling

Recall:

\[
y=A^\star x^\star.
\]

Loss written as:

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

Important observation:

\[
W^\top
\]

has same dimensions as:

\[
A^\star.
\]

যদি minimising loss gives:

\[
W^\top \approx A^\star,
\]

then autoencoder approximately শিখেছে observed inputs \(y\) কীভাবে sparse source codes \(x^\star\) থেকে generated হয়েছিল।

Therefore এটি generative modelling-এর simple example।

**[UNCLEAR / অস্পষ্ট]** Slide-এর displayed equation-এ \(A^\star x^\star=y\) অংশে visually garbled text আছে। Intended meaning হলো \(y=A^\star x^\star\)।

---

## 6.13 Realistic autoencoder example: handwritten digits

Slides handwritten digit images input \(y\) হিসেবে consider করে।

Details:

- Software: TensorFlow।
- প্রতি digit-এর জন্য 6000 training examples এবং 1000 testing examples।
- Image dimension:
  \[
  n=784,
  \]
  corresponding to \(28\times 28\) images।
- One-layer ReLU autoencoder:
  - \(10^4\) ReLU gates।
- Two-activation-layer net:
  - এক layer-এ 5000 gates;
  - অন্য layer-এ 784।

Slide images actual digits এবং reconstructed digits compare করে।

Main point:

> Training-এর পরে autoencoders learned internal representations থেকে handwritten digit images reconstruct করতে পারে।

---

## 6.14 Special case with known correct global minimum

Slides loss consider করে:

\[
\|y-W^\top \operatorname{ReLU}(Wy)\|_2^2.
\]

They state এটি minimum possible value \(0\) achieve করে at:

\[
W^\top=A^\star
\]

special case where:

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

### [ADDED DETAIL / যোগ করা বিস্তারিত] Why the loss becomes zero

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

Because \(A^\star\) orthogonal:

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

Loss nonnegative, so \(0\) global minimum।

### Optimisation caveat

Slides state করে, even in this special case, samples of \(y\) থেকে এই loss use করে optimisation algorithm \(A^\star\)-এর good approximation recover করবে—এটা prove করা currently known নয়।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** Distinguish:

- global minimiser exists জানা;
- training actually সেটি খুঁজে পায় prove করা।

---

## 6.15 Bottleneck autoencoders

Slides briefly bottleneck autoencoders discuss করে।

Bottleneck autoencoder has:

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

where \(z\) compressed representation।

Aim:

\[
x'\approx x.
\]

### Philosophical view

Slides state:

> Autoencoders can be thought of as a more powerful nonlinear generalisation of PCA.

PCA later weeks-এ taught হবে।

### Scope limits

Slides explicitly says:

- autoencoders কখন PCA-এর চেয়ে better করে তা syllabus-এ নেই;
- bottleneck autoencoders data space-এর “shape” discover করে—এই idea mathematise করা খুব hard;
- detailed attempts course scope-এর বাইরে।

---

## 7. Introduction to generative modelling via latent variables

---

## 7.1 Problem: estimating an unknown distribution

Common data-science task:

> i.i.d. samples থেকে unknown distribution \(p(\vec x)\) estimate করা।

Samples:

\[
\vec x_i\in X
\]

drawn from:

\[
p(\vec x).
\]

আমরা parameterised family of densities choose করি:

\[
p_\Theta(\vec x).
\]

Goal হলো unknown \(p\)-এর good approximation খুঁজে বের করা।

---

## 7.2 Maximum likelihood estimator

Slides maximum likelihood estimator define করে:

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

হলো sample \(\vec x\)-কে \(p_\Theta\) কত likelihood score দেয়।

**[ADDED DETAIL / যোগ করা বিস্তারিত]** Practice-এ unknown \(p\)-এর expectation empirical average দিয়ে replace করা হয়:

\[
\frac1m
\sum_{i=1}^{m}
\log p_\Theta(\vec x_i).
\]

Slides বলে estimator ভালো হওয়ার conditions syllabus-এর বাইরে।

---

## 7.3 Latent-variable modelling

Density modelling tractable করতে latent variable introduce করা হয়:

\[
\vec z\sim p(\vec z),
\]

where \(p(\vec z)\) auxiliary latent space \(Z\)-এর distribution।

We then model conditional distribution:

\[
p_\Theta(\vec x\mid \vec z).
\]

This gives joint model over:

\[
X\times Z.
\]

Joint density:

\[
p_\Theta(\vec x,\vec z)
=
p_\Theta(\vec x\mid \vec z)p(\vec z).
\]

---

## 7.4 Marginal distribution

\(\vec x\)-এর marginal density:

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

এটি latent variable integrate out করে।

### Sampling interpretation

\(p_\Theta(\vec x)\) থেকে sample করতে:

1. Sample:
   \[
   \vec z\sim p(\vec z).
   \]
2. Sample:
   \[
   \vec x\sim p_\Theta(\cdot\mid \vec z).
   \]

Key modelling idea:

- simple prior \(p(\vec z)\) choose করা, যেমন standard normal;
- expressive model, যেমন neural net, use করা \(p_\Theta(\vec x\mid \vec z)\)-এর জন্য।

---

## 7.5 Posterior distribution over latent variables

Given \(p_\Theta\), \(\vec x\) given হলে \(\vec z\)-এর conditional distribution:

\[
p_\Theta(\vec z\mid \vec x)
=
\frac{
p_\Theta(\vec x\mid \vec z)p(\vec z)
}{
p(\vec x)
}.
\]

This is Bayes’ rule।

VAE framework এই posterior viewpoint থেকে motivated।

Slides বলে VAEs দুইটি neural nets use করে \(\vec z\mid \vec x\)-এর ওপর দুইটি conditional distributions setup করে এবং সেগুলো match করানোর জন্য search করে।

**[UNCLEAR / অস্পষ্ট]** Slide notation \(p_\Phi(\vec z\mid \vec x)\) use করে, কিন্তু later VAE slides more standard notation use করে:

\[
q_\Phi(\vec z\mid \vec x)
\]

encoder/approximate posterior-এর জন্য।

---

## 8. Variational autoencoders — VAE

Slides বলে এই point থেকে “Demonstration-2-VAE” on Canvas refer করতে।

---

## 8.1 KL divergence

### Definition

Same discrete sample space-এর ওপর two distributions \(p\) এবং \(q\)-এর জন্য:

\[
\operatorname{KL}(p\|q)
=
\sum_x
p(x)\log\frac{p(x)}{q(x)}.
\]

Slides writes \(KL(p|q)\), কিন্তু standard notation:

\[
\operatorname{KL}(p\|q).
\]

### Intuition

KL divergence probability distributions-এর dissimilarity measure করে।

It is asymmetric:

\[
\operatorname{KL}(p\|q)
\ne
\operatorname{KL}(q\|p)
\]

in general।

It is not a distance metric।

---

## 8.2 Worked KL example

Let \(p\) uniform on three outcomes:

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

### Compute \(\operatorname{KL}(p\|q)\)

\[
\operatorname{KL}(p\|q)
=
\sum_{i=1}^3
p_i\log\frac{p_i}{q_i}.
\]

Third term:

\[
\frac13
\log
\frac{1/3}{0}.
\]

Division by zero infinite penalty দেয়:

\[
\operatorname{KL}(p\|q)=\infty.
\]

Interpretation:

- \(p\) বলে third outcome happen করতে পারে;
- \(q\) সেটিকে probability zero দেয়;
- KL-এর অধীনে এটি infinitely bad।

### Compute \(\operatorname{KL}(q\|p)\)

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

This demonstrates asymmetry।

---

## 8.3 Conditional distributions in VAE motivation

Suppose random variables:

\[
\vec x,\vec z.
\]

Their joint distribution আছে।

We consider two conditional distributions:

\[
q(\vec z\mid \vec x)
\]

and:

\[
p(\vec z\mid \vec x).
\]

দুটিই \(\vec x\) given হলে \(\vec z\)-এর conditional distribution describe/guess করে।

Discrepancy measure করতে KL divergence use করা হয়:

\[
\operatorname{KL}
(
q(\vec z\mid \vec x)
\|
p(\vec z\mid \vec x)
).
\]

---

## 8.4 ELBO derivation

Slides derive করে ML-এর central equations-এর একটি।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** Slide explicitly calls this “among the most important equations in ML.”

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

Bracketed term হলো **ELBO**, Evidence Lower Bound:

\[
\operatorname{ELBO}
=
\mathbb{E}_q\log p(\vec x\mid \vec z)
-
\operatorname{KL}(q(\vec z\mid \vec x)\|p(\vec z)).
\]

Slides label করে:

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

## 8.5 Why maximise ELBO?

Decomposition:

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

Fixed data \(\vec x\)-এর জন্য, \(\log p(\vec x)\) variational approximation \(q\)-এর respect-এ constant।

Therefore minimising:

\[
\operatorname{KL}
(
q(\vec z\mid \vec x)
\|
p(\vec z\mid \vec x)
)
\]

equivalent to maximising:

\[
\operatorname{ELBO}.
\]

Equivalently, negative ELBO minimise করা, যাকে slides VFE বলে।

---

## 8.6 VAE objective / Variational Free Energy

Optimisation objective:

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

দুইটি parts:

### Reconstruction loss

\[
-
\mathbb{E}_q
\log p(\vec x\mid \vec z).
\]

এটি decoder-কে \(\vec z\) থেকে \(\vec x\) reconstruct/generate করতে encourage করে।

### KL regularisation term

\[
\operatorname{KL}
(q(\vec z\mid \vec x)\|p(\vec z)).
\]

এটি encoder distribution-কে latent prior-এর close থাকতে encourage করে।

### Learned marginal

Training-এর পরে good decoder distribution:

\[
p_\Theta(\vec x\mid \vec z)
\]

allows data distribution to be approximated by:

\[
p_\Theta(\vec x)
=
\int
p_\Theta(\vec x\mid \vec z)p(\vec z)
\,d\vec z.
\]

Slides emphasise করে simple distributions for \(\vec z\) choose করা motivates করে, যাতে integral/sampling manageable হয়।

---

## 8.7 Encoder, decoder, and distributions

Assume image data:

\[
\vec x\in\mathbb{R}^{\text{image-dimension}}.
\]

Choose latent dimension so that:

\[
\vec z\in\mathbb{R}^{\text{latent-dimension}}.
\]

### Encoder

Encoder:

\[
\operatorname{Encoder}_\Phi:
\mathbb{R}^{\text{image-dimension}}
\to
\mathbb{R}^{\text{latent-dimension}}
\times
\mathbb{R}^{\text{latent-dimension}}.
\]

It outputs two vectors:

- mean vector;
- variance/log-variance vector।

Trainable encoder weights:

\[
\Phi.
\]

### Decoder

Decoder:

\[
\operatorname{Decoder}_\Theta:
\mathbb{R}^{\text{latent-dimension}}
\to
\mathbb{R}^{\text{image-dimension}}.
\]

Trainable decoder weights:

\[
\Theta.
\]

---

## 8.8 The three distributions in the VAE

### Approximate posterior / encoder distribution

Given data sample \(\vec x\), encoder defines:

\[
q_\Phi(\vec z\mid \vec x).
\]

Slides write:

\[
q(\vec z\mid \vec x)
=
q_\Phi(\vec z\mid \vec x)
:=
\mathcal{N}(f(\operatorname{Encoder}_\Phi(\vec x))).
\]

More concretely, encoder outputs Gaussian parameters:

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

- \(\vec\mu_z\) latent mean;
- \(\vec\sigma_z\) latent standard deviation vector;
- \(\circ\) componentwise product;
- \(\operatorname{diag}(\vec\sigma_z\circ \vec\sigma_z)\) diagonal covariance matrix।

### Prior distribution

Latent prior chosen as standard normal:

\[
p(\vec z)
=
\mathcal{N}(0,I).
\]

### Decoder likelihood

Given \(\vec z\), decoder defines:

\[
p_\Theta(\vec x\mid \vec z).
\]

Slides set:

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

## 8.9 Empirical VFE / Monte Carlo estimate

If we can sample:

\[
\vec z_s\sim q_\Phi(\vec z\mid \vec x),
\qquad
s=1,\dots,S,
\]

then VFE Monte Carlo দিয়ে estimate করা যায়:

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

First term reconstruction loss।

Remaining terms KL divergence estimate করে।

---

## 8.10 VAE is not a single architecture

Slides emphasise:

> VAE কোনো single architecture নয়।

Rather, এটি একটি system using:

- two neural nets;
- latent prior;
- decoder likelihood;
- approximate posterior;
- VFE/ELBO training objective।

Purpose হলো unknown marginal data distribution learn করা:

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

## 8.11 VAE loss: Step 1 — encoder output and Gaussian KL

Slides define:

\[
(\vec\mu_z, 2\log(\vec\sigma_z))
:=
\operatorname{Encoder}_\Phi(\vec x).
\]

Quantity:

\[
2\log(\vec\sigma_z)
\]

is log variance, since:

\[
\log(\sigma_z^2)=2\log(\sigma_z).
\]

So code-এ এটি often called:

\[
\text{log var}.
\]

Approximate posterior:

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

KL term:

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

### Gaussian KL identity

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

## 8.12 VAE loss: Step 2 — sampling \(z\)

Slides define:

\[
\vec z
\sim
\mathcal{N}
(
\vec\mu_z,
\operatorname{diag}(\vec\sigma_z\circ\vec\sigma_z)
).
\]

So latent vector encoder distribution থেকে sampled।

### [ADDED DETAIL / যোগ করা বিস্তারিত] Reparameterisation trick

Implementations-এ usually করা হয়:

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

এটি randomness \(\vec\epsilon\)-কে trainable outputs \(\vec\mu_z,\vec\sigma_z\) থেকে separate করে, ফলে sampling operation-এর through gradients flow করতে পারে।

---

## 8.13 VAE loss: Step 3 — decoder and reconstruction loss

Decoder computes:

\[
\widehat x
=
\operatorname{Decoder}_\Theta(\vec z).
\]

VFE-এর first term:

\[
-\log p_\Theta(\vec x\mid \vec z).
\]

Given Gaussian decoder likelihood with identity covariance:

\[
p_\Theta(\vec x\mid \vec z)
=
\mathcal{N}(\operatorname{Decoder}_\Theta(\vec z),I),
\]

negative log-likelihood:

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

## 8.14 VAE loss in code variables

Forward function returns:

\[
(\text{x hat},\text{mean},\text{log var})
=
(\widehat x,\vec\mu_z,2\log(\vec\sigma_z)).
\]

VAE loss at data point \(\vec x\):

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

Slide approximate/code form:

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

Training data-এর ওপর averaging gives:

\[
\text{training VFE}.
\]

Test data-এর ওপর averaging gives:

\[
\text{test VFE}.
\]

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** `x_hat`, `mean`, এবং `log_var` code variables-কে mathematical VAE loss-এর সাথে connect করতে পারতে হবে।

---

## 8.15 VAE forward function is special

Ordinary neural networks-এ forward function সাধারণত input vector থেকে deterministic output vector compute করে।

VAE-তে forward function stochastic process implement করে:

1. Input \(\vec x\)-এর ওপর encoder net use করো।
2. Latent Gaussian parameters produce করো:
   \[
   \vec\mu_z,
   \quad \text{log var}.
   \]
3. Auxiliary random vector sample করো।
4. Produce:
   \[
   \vec z.
   \]
5. \(\vec z\)-এর ওপর decoder net use করো।
6. Return:
   \[
   (\widehat x,\vec\mu_z,\text{log var}).
   \]

Slides emphasise করে যে এটি uses:

- two neural nets;
- auxiliary random vector;
- data vector;
- stochastic sampling।

**[EXAM/REVISION FLAG / পরীক্ষা-সংকেত]** VAE forward function শুধু “evaluate a neural net” নয়; এটি stochastic encoder-sampling-decoder process implement করে।

---

## 9. Consolidated key concepts

### High-dimensional data

**Intuition:** Modern data objects অনেক coordinates-সহ real vectors হিসেবে represented হয়।

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

---

### Probability density

**Intuition:** Density বলে uncertain data কোথায় likely lie করবে।

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

---

### Population risk

**Intuition:** True data distribution-এর ওপর expected error।

**Formalism:**

\[
R(w)
=
\mathbb{E}_{(x,y)\sim D}
[
\ell(w,x,y)
].
\]

---

### Empirical risk

**Intuition:** Observed training data-এর ওপর average error।

**Formalism:**

\[
\widehat R(w)
=
\frac1m
\sum_{i=1}^{m}
\ell(w,x_i,y_i).
\]

---

### Euclidean norm

**Intuition:** Vector-এর length।

**Formalism:**

\[
\|v\|_2
=
\sqrt{\sum_{i=1}^p v_i^2}.
\]

---

### Convexity

**Intuition:** Tangent planes graph-এর নিচে থাকে।

**Formalism:**

\[
F(x)+\nabla F(x)^\top(y-x)\le F(y).
\]

---

### Lagrangian optimality

**Intuition:** Constraints-কে multipliers দিয়ে objective-এর মধ্যে incorporate করা।

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

---

### Spectral norm

**Intuition:** Matrix-এর largest stretch factor।

**Formalism:**

\[
\|A\|_2
=
\max_{\|x\|_2=1}
\|Ax\|_2.
\]

---

### Gradient descent

**Intuition:** Gradient-এর opposite direction-এ move করা।

**Formalism:**

\[
w_{t+1}=w_t-\eta_t\nabla F(w_t).
\]

---

### Johnson–Lindenstrauss property

**Intuition:** Random projections approximately lengths/distances preserve করে।

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

---

### ReLU

**Intuition:** Positive values pass করে, negative values zero করে।

**Formalism:**

\[
\operatorname{ReLU}(x)=\max\{0,x\}.
\]

---

### ReLU DNN

**Intuition:** Affine maps এবং nonlinear activations alternate করা।

**Formalism:**

\[
N(x)=A_{k+1}\circ \operatorname{ReLU}\circ A_k\circ\cdots\circ A_2\circ \operatorname{ReLU}\circ A_1(x).
\]

---

### Autoencoder

**Intuition:** Input reconstruct করতে শেখে, often compressed/structured hidden representation-এর মাধ্যমে।

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

---

### Generative model with latent variable

**Intuition:** আগে hidden causes \(z\) sample করা, তারপর observed data \(x\) sample করা।

**Formalism:**

\[
p_\Theta(x)
=
\int p_\Theta(x\mid z)p(z)\,dz.
\]

---

### KL divergence

**Intuition:** Probability distributions-এর asymmetric dissimilarity।

**Formalism:**

\[
\operatorname{KL}(p\|q)
=
\sum_x p(x)\log\frac{p(x)}{q(x)}.
\]

---

### ELBO

**Intuition:** Marginal likelihood directly maximise করার বদলে tractable lower bound/objective।

**Formalism:**

\[
\operatorname{ELBO}
=
\mathbb{E}_q[\log p(x\mid z)]
-
\operatorname{KL}(q(z\mid x)\|p(z)).
\]

---

### VFE / negative ELBO

**Intuition:** VAE training minimises reconstruction error plus KL regularisation।

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

Main lesson: low-dimensional intuition misleading।

---

### Example 2: uniform density on \([-2,2]\)

\[
p(x)=\frac14
\]

on \([-2,2]\), zero elsewhere।

Check:

\[
\int_{-2}^{2}\frac14\,dx=1.
\]

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

so reconstruction loss is zero।

---

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

---

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

Slides থেকে highest-value items:

1. **Final exam structure:** 2-hour online Canvas MCQ; lectures 1–5 থেকে 25 marks, lectures 6–10 থেকে 25 marks।
2. **Main exam content:** theory of representation learning, কিছু coding questions।
3. **Core ML challenge:** empirical risk দেখেও population risk minimise করা।
4. **Convexity definition:** first-order tangent inequality জানতে হবে।
5. **Constrained convex optimisation:** Lagrangian/first-order conditions use করতে জানতে হবে; proof required নয়।
6. **Neural losses are non-convex:** sigmoid one-weight example understand করতে হবে।
7. **Spectral norm example:** \(A(\theta)\)-এর eigenvalues এবং spectral norm compute করতে পারতে হবে।
8. **GD algorithm:** update এবং step size-এর role জানতে হবে।
9. **GD convergence on \(x^2\):** recurrence unroll করে \(\log(1/\varepsilon)\) convergence time derive করতে পারতে হবে।
10. **Critical points:** gradient zero point-এ initialise করলে GD move করে না।
11. **Important checks:** Gaussian plot/check, convexity examples, eigenvalues, GD recurrences।
12. **Johnson–Lindenstrauss:** random projection setup এবং dimension scaling \(k=O(\log n/\varepsilon^2)\) জানতে হবে।
13. **Sketched regression:** \(\mathbb{E}[\Pi^\top\Pi]=I\) কেন loss preservation in expectation imply করে understand করতে হবে।
14. **PyTorch `Linear`:** bias included হলে mathematically affine।
15. **Architecture versus function:** weights assign না করলে network diagram function নয়।
16. **Autoencoder special case:** \(A^\star\) orthogonal এবং \(x^\star\ge 0\) হলে কেন \(W^\top=A^\star\) zero loss দেয় জানতে হবে।
17. **ELBO equation:** explicitly ML-এর most important equations-এর একটি বলা হয়েছে।
18. **VAE objective:** reconstruction loss plus KL divergence।
19. **VAE forward function:** stochastic; encoder, sampling, decoder use করে এবং \((\widehat x,\mu,\log\mathrm{var})\) return করে।
20. **VAE code loss:** mathematical KL কীভাবে `mean`, `log_var`, এবং \(e^{\text{log_var}}\)-এর sum হয় জানতে হবে।

---

## 12. Connections across the lecture

### High-dimensional data → representation learning

Course শুরু হয় fact দিয়ে যে data high-dimensional vectors। তারপর question আসে lower-dimensional representations exist করে কি না।

### Random variables → risk

Data uncertainty random variables এবং distributions দিয়ে formalised। এটি population risk-কে expectation হিসেবে define করতে দেয়।

### Risk → optimisation

Model training মানে risk function minimise করা। এটি convexity, constrained optimisation, এবং gradient descent motivate করে।

### Convex optimisation → neural-network difficulty

Convex problems-এর clean theory আছে। Neural-network losses often non-convex, ফলে training analyse করা কঠিন।

### Gradient descent → neural-network training

Plain GD deep learning-এ ব্যবহৃত gradient-based methods-এর simplest version। ADAM-এর মতো later methods এই theme-এর ওপর build করে।

### Johnson–Lindenstrauss → representation compression

JL দেখায় random low-dimensional projections geometry preserve করতে পারে, supporting idea যে high-dimensional data often compactly represented হতে পারে।

### Neural networks → autoencoders

Neural nets flexible nonlinear function classes define করে। Autoencoders input reconstruct করে representations learn করে।

### Autoencoders → generative modelling

Sparse-coding autoencoders generating dictionary \(A^\star\) recover করতে পারে, reconstruction-কে data-generating process discovery-এর সাথে connect করে।

### Autoencoders → PCA

Bottleneck autoencoders PCA-এর nonlinear generalisations হিসেবে presented, যা later taught হবে।

### Generative modelling → VAE

Latent-variable generative models define:

\[
p_\Theta(x)=\int p_\Theta(x\mid z)p(z)\,dz.
\]

VAEs encoder/decoder neural nets এবং ELBO/VFE objective দিয়ে এমন models train করে।

---

## 13. Unclear or potentially garbled slide sections

1. **“Johnson-Lindenenstrauss” spelling**  
   Standard term: Johnson–Lindenstrauss।

2. **Probability “distribution function” terminology**  
   Slides \(p:\mathbb{R}^n\to[0,\infty)\)-এর জন্য এই phrase ব্যবহার করে। এটি density, cumulative distribution function নয়।

3. **Convexity example mismatch**  
   এক slide lists \(e^{-x}\); checks slide lists \(e^{-2x}\)। দুইটিই convex।

4. **Eigenvector definition for rectangular matrices**  
   Slides \(A\in\mathbb{R}^{m\times n}\) লিখে, কিন্তু usual sense-এ eigenvalues/eigenvectors square matrices-এর জন্য।

5. **Sigmoid output range**  
   Slide writes \([0,\infty)\), but:
   \[
   \frac1{1+e^{-wx}}\in(0,1).
   \]

6. **GD indexing**  
   Slides \(w_1\)-style indexing এবং \(x_0\)-style indexing দুটোই use করে। Recurrence এবং convergence proof clear, তবে exact \(t\) বনাম \(t+1\) indexing slightly inconsistent।

7. **Sparse-coding notation \(h\)**  
   Slides \(h\)-কে dimension এবং hidden activation vector—দুইভাবে use করে।

8. **Garbled sparse-coding equation**  
   \(A^\star x^\star=y\)-এর around equation visually garbled। Intended meaning:
   \[
   y=A^\star x^\star.
   \]

9. **Generative modelling posterior notation**  
   One slide mentions \(p_\Phi(z\mid x)\), but later VAE notation uses:
   \[
   q_\Phi(z\mid x).
   \]
   Standard VAE notation হলো encoder/approximate posterior-এর জন্য \(q_\Phi\)।

10. **Linear regression expectation derivation typo**  
    One line appears to write \(Ax-y\), where it should be:
    \[
    A\beta-y.
    \]

11. **VAE Gaussian notation shorthand**  
    Slide writes:
    \[
    q_\Phi(z\mid x):=\mathcal{N}(f(\operatorname{Encoder}_\Phi(x))).
    \]
    এটি shorthand; encoder output Gaussian parameters \((\mu,\Sigma)\)-এ transformed হয়।
---

## 9. Consolidated key concepts

### High-dimensional data

**Intuition:** Modern data objects অনেক coordinates-সহ real vectors হিসেবে represented হয়।

**Formalism:** Examples include:

$$
x\in\mathbb{R}^n,
$$

token sequences:

$$
(x_1,\dots,x_T),\quad x_i\in\mathbb{R}^{800},
$$

and function encodings:

$$
[f(x_1),\dots,f(x_m)].
$$

---

### Probability density

**Intuition:** Density বলে uncertain data কোথায় likely to lie.

**Formalism:**

$$
p:\mathbb{R}^n\to[0,\infty),
$$

$$
\mathbb{P}[x\in A]=\int_A p(x)\,dx,
$$

$$
\int_{\mathbb{R}^n}p(x)\,dx=1.
$$

---

### Population risk

**Intuition:** True data distribution-এর উপর expected error.

**Formalism:**

$$
R(w)
=
\mathbb{E}_{(x,y)\sim D}
[
\ell(w,x,y)
].
$$

---

### Empirical risk

**Intuition:** Observed training data-এর উপর average error.

**Formalism:**

$$
\widehat R(w)
=
\frac1m
\sum_{i=1}^{m}
\ell(w,x_i,y_i).
$$

---

### Euclidean norm

**Intuition:** Vector-এর length.

**Formalism:**

$$
\|v\|_2
=
\sqrt{\sum_{i=1}^p v_i^2}.
$$

---

### Convexity

**Intuition:** Tangent planes graph-এর নিচে থাকে।

**Formalism:**

$$
F(x)+\nabla F(x)^\top(y-x)\le F(y).
$$

---

### Lagrangian optimality

**Intuition:** Multipliers ব্যবহার করে constraints objective-এর মধ্যে incorporate করা।

**Formalism:**

$$
L(x,\lambda)=f(x)+\lambda^\top(Ax-b).
$$

Optimality:

$$
\nabla f(x^\star)+A^\top\lambda^\star=0,
\qquad
Ax^\star=b.
$$

---

### Spectral norm

**Intuition:** Matrix-এর largest stretch factor.

**Formalism:**

$$
\|A\|_2
=
\max_{\|x\|_2=1}
\|Ax\|_2.
$$

---

### Gradient descent

**Intuition:** Gradient-এর opposite direction-এ move করা।

**Formalism:**

$$
w_{t+1}=w_t-\eta_t\nabla F(w_t).
$$

---

### Johnson–Lindenstrauss property

**Intuition:** Random projections lengths/distances approximately preserve করে।

**Formalism:**

$$
(1-\varepsilon)\|a\|_2^2
\le
\|\Pi a\|_2^2
\le
(1+\varepsilon)\|a\|_2^2
$$

with high probability when:

$$
k=O\left(\frac{\log(1/\delta)}{\varepsilon^2}\right).
$$

---

### ReLU

**Intuition:** Positive values pass করে, negative values zero করে।

**Formalism:**

$$
\operatorname{ReLU}(x)=\max\{0,x\}.
$$

---

### ReLU DNN

**Intuition:** Affine maps এবং nonlinear activations alternate করে।

**Formalism:**

$$
N(x)=A_{k+1}\circ \operatorname{ReLU}\circ A_k\circ\cdots\circ A_2\circ \operatorname{ReLU}\circ A_1(x).
$$

---

### Autoencoder

**Intuition:** Input reconstruct করতে শেখে, often compressed/structured hidden representation-এর মাধ্যমে।

**Formalism:**

$$
y\mapsto \widetilde y,
\qquad
\widetilde y\approx y.
$$

Sparse coding example:

$$
h=\operatorname{ReLU}(Wy-\varepsilon),
\qquad
\widetilde y=W^\top h.
$$

---

### Generative model with latent variable

**Intuition:** Hidden causes $z$ first sample করা হয়, তারপর observed data $x$ sample করা হয়।

**Formalism:**

$$
p_\Theta(x)
=
\int p_\Theta(x\mid z)p(z)\,dz.
$$

---

### KL divergence

**Intuition:** Probability distributions-এর asymmetric dissimilarity.

**Formalism:**

$$
\operatorname{KL}(p\|q)
=
\sum_x p(x)\log\frac{p(x)}{q(x)}.
$$

---

### ELBO

**Intuition:** Marginal likelihood directly maximise করার বদলে tractable lower bound/objective.

**Formalism:**

$$
\operatorname{ELBO}
=
\mathbb{E}_q[\log p(x\mid z)]
-
\operatorname{KL}(q(z\mid x)\|p(z)).
$$

---

### VFE / negative ELBO

**Intuition:** VAE training minimises reconstruction error plus KL regularisation.

**Formalism:**

$$
\operatorname{VFE}
=
-
\mathbb{E}_q[\log p(x\mid z)]
+
\operatorname{KL}(q(z\mid x)\|p(z)).
$$

---

## 10. Main worked examples to revise

### Example 1: high-dimensional cube

$$
[-1,1]^d
$$

diagonal:

$$
2\sqrt d.
$$

Inner sphere radius:

$$
r=\frac12(\sqrt d-1).
$$

Main lesson: low-dimensional intuition misleading.

---

### Example 2: uniform density on $[-2,2]$

$$
p(x)=\frac14
$$

on $[-2,2]$, zero elsewhere.

Check:

$$
\int_{-2}^{2}\frac14\,dx=1.
$$

---

### Example 3: Euclidean norm

$$
v=
\begin{bmatrix}
1\\-2\\-1
\end{bmatrix}
$$

$$
\|v\|_2=\sqrt6.
$$

---

### Example 4: spectral norm matrix

$$
A(\theta)
=
\begin{bmatrix}
0 & \theta\\
0 & 0
\end{bmatrix}.
$$

Eigenvalues:

$$
0.
$$

Spectral norm:

$$
\|A(\theta)\|_2=|\theta|.
$$

Spectral radius:

$$
\rho(A)=0.
$$

---

### Example 5: GD on $x^2$

$$
x_{t+1}=(1-2\eta_t)x_t.
$$

If:

$$
1-2\eta_t=k\in(0,1),
$$

then:

$$
x_t=x_0k^t\to 0.
$$

Convergence time:

$$
t
\ge
\frac{
\log(|x_0|/\varepsilon)
}{
\log(1/k)
}.
$$

---

### Example 6: Mexican-hat function

$$
F(x)=\frac12(x^2-4)^2.
$$

Derivative:

$$
F'(x)=2x(x^2-4).
$$

GD update:

$$
x_{t+1}=x_t-2\eta x_t(x_t^2-4).
$$

Global minima:

$$
x=\pm 2.
$$

---

### Example 7: JL linear regression sketch

Original:

$$
\min_\beta \|A\beta-y\|_2^2.
$$

Sketched:

$$
\min_\beta \|\Pi(A\beta-y)\|_2^2.
$$

Expected preservation:

$$
\mathbb{E}_\Pi\|\Pi(A\beta-y)\|_2^2
=
\|A\beta-y\|_2^2.
$$

---

### Example 8: one-layer ReLU computation

$$
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
$$

$$
Wx=
\begin{bmatrix}
1\\0\\-4
\end{bmatrix}.
$$

$$
\operatorname{ReLU}(Wx)
=
\begin{bmatrix}
1\\0\\0
\end{bmatrix}.
$$

---

### Example 9: max network

$$
\max(x_1,x_2)
=
\frac{x_1+x_2}{2}
+
\frac{|x_1-x_2|}{2}.
$$

Using ReLU:

$$
|a|=\operatorname{ReLU}(a)+\operatorname{ReLU}(-a).
$$

---

### Example 10: autoencoder global minimum special case

Given:

$$
y=A^\star x^\star,
\quad
A^\star\text{ orthogonal},
\quad
x^\star\ge 0,
$$

and:

$$
W^\top=A^\star,
$$

then:

$$
W^\top\operatorname{ReLU}(Wy)=y,
$$

so reconstruction loss is zero.

---

### Example 11: KL asymmetry

$$
p=
\left(\frac13,\frac13,\frac13\right),
\quad
q=
\left(\frac12,\frac12,0\right).
$$

$$
\operatorname{KL}(p\|q)=\infty.
$$

$$
\operatorname{KL}(q\|p)=\log\frac32.
$$

---

### Example 12: VAE code loss

Forward returns:

$$
(\widehat x,\text{mean},\text{log var}).
$$

Loss:

$$
\frac12
\|x-\widehat x\|_2^2
-
\frac12
\sum_i
[
1+\text{log var}_i-\text{mean}_i^2-e^{\text{log var}_i}
].
$$

Equivalent:

$$
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
$$

---

## 11. Explicit exam / revision flags

Slides থেকে highest-value items:

1. **Final exam structure:** 2-hour online Canvas MCQ; lectures 1–5 থেকে 25 marks, lectures 6–10 থেকে 25 marks.
2. **Main exam content:** theory of representation learning, সঙ্গে কিছু coding questions.
3. **Core ML challenge:** empirical risk only access থাকা অবস্থায় population risk minimise করা।
4. **Convexity definition:** first-order tangent inequality জানতে হবে।
5. **Constrained convex optimisation:** Lagrangian/first-order conditions use করতে জানতে হবে; proof required নয়।
6. **Neural losses are non-convex:** sigmoid one-weight example understand করতে হবে।
7. **Spectral norm example:** $A(\theta)$-এর eigenvalues এবং spectral norm compute করতে পারতে হবে।
8. **GD algorithm:** update এবং step size-এর role জানতে হবে।
9. **GD convergence on $x^2$:** recurrence unroll করে $\log(1/\varepsilon)$ convergence time derive করতে হবে।
10. **Critical points:** gradient zero point-এ initialise করলে GD move করে না।
11. **Important checks:** Gaussian plot/check, convexity examples, eigenvalues, GD recurrences.
12. **Johnson–Lindenstrauss:** random projection setup এবং dimension scaling $k=O(\log n/\varepsilon^2)$ জানতে হবে।
13. **Sketched regression:** কেন $\mathbb{E}[\Pi^\top\Pi]=I$ loss preservation in expectation imply করে understand করতে হবে।
14. **PyTorch `Linear`:** bias included হলে mathematically affine.
15. **Architecture versus function:** weights assigned না হওয়া পর্যন্ত network diagram function নয়।
16. **Autoencoder special case:** কেন $W^\top=A^\star$ gives zero loss when $A^\star$ orthogonal and $x^\star\ge 0$ জানতে হবে।
17. **ELBO equation:** explicitly one of the most important equations in ML হিসেবে described.
18. **VAE objective:** reconstruction loss plus KL divergence.
19. **VAE forward function:** stochastic; encoder, sampling, decoder use করে এবং returns $(\widehat x,\mu,\log\mathrm{var})$.
20. **VAE code loss:** mathematical KL কীভাবে `mean`, `log_var`, এবং $e^{\text{log_var}}$-সহ sum-এ আসে জানতে হবে।

---

## 12. Connections across the lecture

### High-dimensional data → representation learning

Course শুরু হয় এই fact দিয়ে যে data high-dimensional vectors. তারপর প্রশ্ন করে lower-dimensional representations exist করে কি না।

### Random variables → risk

Data uncertainty random variables এবং distributions দিয়ে formalised হয়। এতে population risk expectation হিসেবে define করা যায়।

### Risk → optimisation

Model training মানে risk function minimise করা। এটি convexity, constrained optimisation, এবং gradient descent motivate করে।

### Convex optimisation → neural-network difficulty

Convex problems-এর clean theory আছে। Neural-network losses often non-convex, যার ফলে training analyse করা harder.

### Gradient descent → neural-network training

Plain GD deep learning-এ used gradient-based methods-এর simplest version. Later ADAM-এর মতো methods এই theme build করে।

### Johnson–Lindenstrauss → representation compression

JL দেখায় random low-dimensional projections geometry preserve করতে পারে, যা high-dimensional data compactly represent করার idea support করে।

### Neural networks → autoencoders

Neural nets flexible nonlinear function classes define করে। Autoencoders inputs reconstruct করে representations learn করতে neural nets ব্যবহার করে।

### Autoencoders → generative modelling

Sparse-coding autoencoders generating dictionary $A^\star$ recover করতে পারে, reconstruction-কে data-generating process discovery-এর সঙ্গে connect করে।

### Autoencoders → PCA

Bottleneck autoencoders nonlinear generalisations of PCA হিসেবে presented, যা later taught হবে।

### Generative modelling → VAE

Latent-variable generative models define:

$$
p_\Theta(x)=\int p_\Theta(x\mid z)p(z)\,dz.
$$

VAEs encoder/decoder neural nets এবং ELBO/VFE objective ব্যবহার করে এমন models train করে।

---

## 13. Unclear or potentially garbled slide sections

1. **“Johnson-Lindenenstrauss” spelling**  
   Standard term: Johnson–Lindenstrauss.

2. **Probability “distribution function” terminology**  
   Slides $p:\mathbb{R}^n\to[0,\infty)$-এর জন্য এই phrase ব্যবহার করেছে। এটি density, cumulative distribution function নয়।

3. **Convexity example mismatch**  
   এক slide $e^{-x}$ list করে; checks slide $e^{-2x}$ list করে। Both convex.

4. **Eigenvector definition for rectangular matrices**  
   Slides $A\in\mathbb{R}^{m\times n}$ লিখে, কিন্তু usual sense-এ eigenvalues/eigenvectors require square matrices.

5. **Sigmoid output range**  
   Slide writes $[0,\infty)$, but:
   $$
   \frac1{1+e^{-wx}}\in(0,1).
   $$

6. **GD indexing**  
   Slides both $w_1$-style indexing and $x_0$-style indexing use করে। Recurrence এবং convergence proof clear, কিন্তু exact $t$ vs $t+1$ indexing slightly inconsistent.

7. **Sparse-coding notation $h$**  
   Slides $h$ both dimension and hidden activation vector হিসেবে use করে।

8. **Garbled sparse-coding equation**  
   Equation around $A^\star x^\star=y$ visually garbled. Intended meaning:
   $$
   y=A^\star x^\star.
   $$

9. **Generative modelling posterior notation**  
   এক slide mentions $p_\Phi(z\mid x)$, but later VAE notation uses:
   $$
   q_\Phi(z\mid x).
   $$
   Standard VAE notation is $q_\Phi$ for encoder/approximate posterior.

10. **Linear regression expectation derivation typo**  
   One line appears to write $Ax-y$ where it should be:
   $$
   A\beta-y.
   $$

11. **VAE Gaussian notation shorthand**  
   Slide writes:
   $$
   q_\Phi(z\mid x):=\mathcal{N}(f(\operatorname{Encoder}_\Phi(x))).
   $$
   This is shorthand for encoder output being transformed into Gaussian parameters $(\mu,\Sigma)$.

---

## 14. Quick revision checklist

Use this as a final pass before solving practice questions:

- [ ] Explain why data are high-dimensional vectors and why representation learning searches for lower-dimensional structure.
- [ ] Derive $r=\frac12(\sqrt d-1)$ for the high-dimensional cube/sphere example.
- [ ] State probability density properties and compute total mass for the uniform example.
- [ ] Define population risk and empirical risk, and explain the difference.
- [ ] Compute Euclidean norm examples.
- [ ] State the differentiable convexity inequality.
- [ ] Use Lagrangian conditions for equality-constrained convex optimisation.
- [ ] Explain why simple neural losses can be non-convex.
- [ ] Compute eigenvalues and spectral norm of $A(\theta)$.
- [ ] State GD update and derive the update for $F(x)=x^2$.
- [ ] Unroll GD recurrence and derive the $O(\log(1/\varepsilon))$ convergence time.
- [ ] Derive derivative/update for the Mexican-hat function.
- [ ] State JL property and lemma with dimension scaling.
- [ ] Show why $\mathbb{E}[\Pi^\top\Pi]=I$.
- [ ] Work through one-layer ReLU example.
- [ ] Explain architecture vs neural function.
- [ ] Explain sparse-coding autoencoder and zero-loss special case.
- [ ] Define KL divergence and demonstrate asymmetry with the 3-outcome example.
- [ ] Derive ELBO/VFE decomposition.
- [ ] Write the VAE code loss using `x_hat`, `mean`, and `log_var`.

