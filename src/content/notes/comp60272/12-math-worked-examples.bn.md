---
subject: COMP60272
chapter: 12
title: "Math Worked Examples"
language: bn
---

# COMP60272 — ম্যাথমেটিক্স Worked Examples: ধাপে ধাপে বাংলা ব্যাখ্যা

**Source:** আপলোড করা `comp60272-bn.pdf`-এর Chapter/Week 1-11 স্টাডি নোট।  
**উদ্দেশ্য:** PDF-এ যেসব গণিত, ফর্মুলা, অ্যালগরিদমিক calculation, proof-sketch, sensitivity/noise হিসাব, FL aggregation, SMPC/ZKP/FHE/DP worked examples আছে—সেগুলোকে বাংলায় ধাপে ধাপে সহজভাবে সাজানো।  

> নোট: কয়েকটি জায়গায় মূল PDF নিজেই `[UNCLEAR]` বা slide typo/inconsistent arithmetic উল্লেখ করেছে। সেখানে আমি **সতর্কতা** দিয়ে consistent calculation দেখিয়েছি।

---

## পড়ার আগে notation mini-cheat-sheet

| Symbol | মানে |
|---|---|
| $x, y$ | input ও target/label |
| $f_\theta$ | parameter $\theta$-সহ model |
| $L$ | loss function |
| $\nabla_x L$ | input-এর respect-এ loss gradient |
| $\epsilon$ | adversarial perturbation size / radius |
| $\|\cdot\|_p$ | $p$-norm |
| $D, D'$ | dataset / neighbouring dataset |
| $K$ | FL clients সংখ্যা |
| $p_k$ | FL client $k$-এর aggregation weight |
| $\Delta_k$ | FL client update |
| $C$ | DP clipping bound |
| $\sigma$ | DP noise multiplier |
| $\varepsilon, \delta$ | DP privacy parameters |
| $p,q$ | modular arithmetic/FHE/ZKP-তে modulus/prime সম্পর্কিত parameter |

---

# Chapter 1 / Week 1 — ML notation, norms, ERM

## 1.1 Affine model-এর coordinate form

### Problem
Input $x \in \mathbb{R}^m$, output $f_\theta(x) \in \mathbb{R}^n$। Parameter:

$$
\theta=(W,b), \qquad W\in \mathbb{R}^{m\times n}, \qquad b\in \mathbb{R}^n.
$$

Affine map কীভাবে লেখা হয়?

### Step-by-step

**ধাপ ১: output-এর প্রতিটি coordinate আলাদা করে ভাবো।**  
Output vector-এর $j$-তম coordinate হলো $f_\theta(x)_j$।

**ধাপ ২: input entries-এর weighted sum নাও।**

$$
\sum_{i=1}^{m} x_i w_{ij}
$$

এখানে $w_{ij}$ হলো input coordinate $i$ থেকে output coordinate $j$-এ weight।

**ধাপ ৩: bias যোগ করো।**

$$
f_\theta(x)_j = \sum_{i=1}^{m} x_i w_{ij}+b_j.
$$

**ধাপ ৪: linear বনাম affine পার্থক্য।**  
যদি $b=0$, তাহলে map linear। যদি $b\neq 0$, তাহলে affine।

---

## 1.2 $p$-norm, infinity norm, matrix/spectral norm

### $p$-norm distance
দুই vector $x,x'\in\mathbb{R}^d$-এর $p$-norm distance:

$$
\|x-x'\|_p = \left(\sum_{i=1}^{d}|x_i-x_i'|^p\right)^{1/p}.
$$

**ধাপভিত্তিক intuition:**
1. প্রতি coordinate-এ difference নাও: $x_i-x_i'$।
2. absolute value নাও: $|x_i-x_i'|$।
3. $p$ power করো।
4. সব coordinate sum করো।
5. শেষে $1/p$ root নাও।

### Infinity norm

$$
\|x-x'\|_\infty = \max_{i=1}^{d}|x_i-x_i'|.
$$

এটি শুধু সবচেয়ে বড় coordinate-wise change দেখে। Adversarial ML-এ $\ell_\infty$ perturbation মানে: কোনো coordinate/pixel $\epsilon$-এর বেশি বদলাবে না।

### Matrix norm / spectral norm

$$
\lambda(A)=\max_{x\neq 0}\frac{\|Ax\|_p}{\|x\|_p}.
$$

যদি $p=2$, এটিকে spectral norm বলা হয়। Intuition: matrix $A$ vector length সর্বোচ্চ কত গুণ stretch করতে পারে।

---

## 1.3 Expected Risk থেকে Empirical Risk Minimisation, ERM

### Problem
True data distribution $D$ জানা নেই। তাহলে training objective কীভাবে finite dataset দিয়ে approximate করা হয়?

### Step-by-step derivation

**ধাপ ১: ideal objective লিখি।**  
আমরা এমন parameter চাই যা true distribution-এর expected loss minimise করে:

$$
\theta^* = \arg\min_\theta \mathbb{E}_{(x,y)\sim D}[L(f_\theta(x),y)].
$$

**ধাপ ২: expectation integral আকারে।**  
যদি $z=(x,y)$ হয়, তাহলে:

$$
\mathbb{E}_{z\sim D}[g(z)] = \int g(z)D(z)\,dz.
$$

সমস্যা: বাস্তবে $D$ জানা থাকে না।

**ধাপ ৩: dataset sample দিয়ে estimate করি।**  
ধরি dataset:

$$
\{(x_i,y_i)\}_{i=1}^{N}\sim D.
$$

তাহলে expected risk approximate করা হয় sample average দিয়ে:

$$
\mathbb{E}_{(x,y)\sim D}[L(f_\theta(x),y)]
\approx
\frac{1}{N}\sum_{i=1}^{N}L(f_\theta(x_i),y_i).
$$

**ধাপ ৪: ERM objective।**

$$
\hat{\theta}^* = \arg\min_\theta \frac{1}{N}\sum_{i=1}^{N}L(f_\theta(x_i),y_i).
$$

**মনে রাখো:** Expected risk হলো population-level ideal; ERM হলো finite dataset দিয়ে তার practical approximation।

---

# Chapter 2 / Week 2 — Adversarial attacks, reachability, interval analysis

## 2.1 Linear classifier perturbation: “accidental steganography” derivation

### Setup
Binary linear classifier:

$$
f(x)=w^Tx.
$$

Perturbed input:

$$
x' = x+\eta.
$$

### Goal
Perturbation $\eta$ model output-কে কীভাবে বদলায়?

### Step-by-step

**ধাপ ১: perturbed output লিখি।**

$$
y' = w^Tx'.
$$

**ধাপ ২: $x'=x+\eta$ substitute করি।**

$$
y'=w^T(x+\eta).
$$

**ধাপ ৩: distributive property ব্যবহার করি।**

$$
y'=w^Tx+w^T\eta.
$$

**ধাপ ৪: original output $y=w^Tx$ ধরলে:**

$$
y'=y+w^T\eta.
$$

### Meaning
ছোট ছোট coordinate-wise perturbation যোগ করেও dot product $w^T\eta$ বড় হতে পারে, বিশেষ করে high-dimensional input-এ। এ কারণেই adversarial noise চোখে ছোট হলেও classifier output flip করতে পারে।

---

## 2.2 FGSM: Fast Gradient Sign Method

### Formula

$$
x' = x + \epsilon \cdot \operatorname{sign}(\nabla_x L(f(x),y)).
$$

### Step-by-step algorithm

**ধাপ ১: original input $x$-এ loss compute করো।**

$$
L(f(x),y)
$$

**ধাপ ২: input-এর respect-এ gradient নাও।**

$$
\nabla_x L(f(x),y).
$$

**ধাপ ৩: gradient-এর শুধু sign নাও।**  
প্রতি coordinate-এ:

- gradient positive হলে $+1$,
- negative হলে $-1$,
- zero হলে $0$।

**ধাপ ৪: magnitude $\epsilon$ দিয়ে scale করো।**

$$
\epsilon\operatorname{sign}(\nabla_x L(f(x),y)).
$$

**ধাপ ৫: original input-এ add করো।**

$$
x'=x+\epsilon\operatorname{sign}(\nabla_x L(f(x),y)).
$$

### Why “fast”?
একবার gradient compute করলেই attack direction পাওয়া যায়। Iterative optimisation দরকার নেই।

---

## 2.3 Adversarial optimisation: smallest perturbation

### Objective
Model prediction বদলাতে সবচেয়ে ছোট perturbation খুঁজতে চাই:

$$
\min \|\epsilon\|_\infty
$$

subject to:

$$
\arg\max f(x) \neq \arg\max f(x+\epsilon).
$$

### Meaning
- Objective: perturbation ছোট করো।
- Constraint: class prediction বদলাতে হবে।

### Satisfiability style question
একটি fixed radius $c$ given হলে প্রশ্ন:

$$
\exists \epsilon \quad \text{such that}\quad \|\epsilon\|_\infty\le c
$$

and:

$$
\arg\max f(x) \neq \arg\max f(x+\epsilon).
$$

এটি “attack আছে কি নেই?” প্রশ্ন।

---

## 2.4 Exact reachability: brute force কেন explode করে

### Example
একটি 1D neural network $f$ interval $[-2,3]$-এ polynomial-like function approximate করছে। প্রশ্ন:

$$
|g(x)-f(x)|\le 0.01 \quad \text{for all } x\in[-2,3]?
$$

### Brute force idea
সব possible floating point input scan করো।

### কেন impractical?
- 32-bit floating point হলে আনুমানিক $2^{31}$ input value check করতে হতে পারে।
- একটি small 1-input 1-output network-ই CPU-তে প্রায় ঘণ্টা-স্কেলের কাজ হতে পারে।
- Multiple input dimensions হলে combinatorial explosion হয়।

### ReLU activation pattern intuition
যদি 32টি ReLU থাকে, প্রতিটি হতে পারে:

- inactive: $\operatorname{ReLU}(z)=0$,
- active: $\operatorname{ReLU}(z)=z>0$।

তাহলে possible activation patterns:

$$
2^{32}.
$$

এই কারণেই exact reachability hard; notes অনুযায়ী ReLU neural network-এর exact reachable set compute করা NP-complete।

---

## 2.5 Interval arithmetic operators

Interval analysis exact reachable set না বের করে over-approximation দেয়। নিচের rules বারবার ব্যবহার হয়।

### 2.5.1 Interval addition
Given:

$$
x\in[\ell_x,u_x],\quad y\in[\ell_y,u_y].
$$

Then:

$$
x+y\in[\ell_x+\ell_y,\ u_x+u_y].
$$

**Reason:** smallest sum = smallest + smallest; largest sum = largest + largest।

### 2.5.2 Interval negation

$$
x\in[\ell_x,u_x] \Rightarrow -x\in[-u_x,-\ell_x].
$$

Negative করলে order flip হয়।

### 2.5.3 Constant multiplication

$$
x\in[\ell_x,u_x],\quad c\in\mathbb{R}.
$$

If $c\ge 0$:

$$
cx\in[c\ell_x,cu_x].
$$

If $c<0$:

$$
cx\in[cu_x,c\ell_x].
$$

Negative constant bounds reverse করে।

### 2.5.4 Interval ReLU

$$
x\in[\ell_x,u_x]
$$

Then:

$$
\operatorname{ReLU}(x)\in[\max(\ell_x,0),\max(u_x,0)].
$$

### 2.5.5 Monotonic function
যদি $f$ monotonic increasing হয়:

$$
a\le b\Rightarrow f(a)\le f(b),
$$

then:

$$
x\in[\ell_x,u_x]\Rightarrow f(x)\in[f(\ell_x),f(u_x)].
$$

Example:

$$
tanh(x)\in[\tanh(\ell_x),\tanh(u_x)].
$$

### 2.5.6 Intersection

$$
[\ell_I,u_I]\cap[\ell_J,u_J]
=
[\max(\ell_I,\ell_J),\min(u_I,u_J)].
$$

যদি lower bound upper bound-এর চেয়ে বড় হয়, intersection empty।

### 2.5.7 Union over-approximation

$$
K\supseteq I\cup J,
$$

where:

$$
K=[\min(\ell_I,\ell_J),\max(u_I,u_J)].
$$

যদি intervals disjoint হয়, এই union interval extra points include করে—তাই over-approximation।

---

## 2.6 Worked example: one-hidden-layer ReLU network interval propagation

### Network
Input:

$$
x_0\in[-1,1].
$$

First linear layer:

$$
y_{11}=3x_0-2,
$$

$$
y_{12}=-x_0+1.
$$

Activation:

$$
x_{11}=\operatorname{ReLU}(y_{11}),\quad x_{12}=\operatorname{ReLU}(y_{12}).
$$

Output:

$$
y_2=x_{11}+2x_{12}-1.
$$

### Goal
Interval analysis দিয়ে $y_2$-এর reachable set over-approximation বের করো।

### Step 1: first linear neuron $y_{11}$

Given:

$$
x_0\in[-1,1].
$$

Multiply by 3:

$$
3[-1,1]=[-3,3].
$$

Subtract 2:

$$
y_{11}\in[-3-2,3-2]=[-5,1].
$$

### Step 2: second linear neuron $y_{12}$

Multiply by $-1$:

$$
-1[-1,1]=[-1,1].
$$

Add 1:

$$
y_{12}\in[-1+1,1+1]=[0,2].
$$

### Step 3: ReLU activations

For $x_{11}$:

$$
x_{11}\in[\max(-5,0),\max(1,0)]=[0,1].
$$

For $x_{12}$:

$$
x_{12}\in[\max(0,0),\max(2,0)]=[0,2].
$$

### Step 4: output layer

$$
y_2=x_{11}+2x_{12}-1.
$$

Use intervals:

$$
y_2\in [0,1]+2[0,2]-1.
$$

Compute:

$$
2[0,2]=[0,4].
$$

Then:

$$
[0,1]+[0,4]=[0,5].
$$

Subtract 1:

$$
y_2\in[-1,4].
$$

### Final answer

$$
\boxed{y_2\in[-1,4]}
$$

PDF notes mention করে visible exact output set প্রায় $[-0.33,3]$। Interval analysis সেটিকে safely contain করে, কিন্তু একটু larger interval দেয়।

---

# Chapter 3 / Week 3 — Adversarial defences

## 3.1 Adversarial training objective

### Ordinary ERM

$$
\theta^* = \arg\min_\theta \mathbb{E}_{(x,y)\sim D}[L(f_\theta(x),y)].
$$

Empirical form:

$$
\theta^*\approx \arg\min_\theta \frac{1}{N}\sum_{i=1}^{N}L(f_\theta(x_i),y_i).
$$

### Robust ERM
Allowed perturbation set $E$। Worst-case perturbation-এর ওপর loss maximise করা হয়:

$$
\theta^*=\arg\min_\theta \mathbb{E}_{(x,y)\sim D}\left[\max_{\epsilon\in E}L(f_\theta(x+\epsilon),y)\right].
$$

Empirical form:

$$
\theta^*\approx \arg\min_\theta \frac{1}{N}\sum_{i=1}^{N}\max_{\epsilon\in E}L(f_\theta(x_i+\epsilon),y_i).
$$

### Step-by-step meaning
1. Inner max: attacker $E$-এর মধ্যে সবচেয়ে bad perturbation খুঁজে।
2. Outer min: defender/model সেই worst-case loss কমানোর জন্য train করে।
3. তাই training objective average clean accuracy নয়, robust accuracy target করে।

---

## 3.2 Lipschitz composition derivation

### Given
$f$ is $L_f$-Lipschitz, $g$ is $L_g$-Lipschitz। Define:

$$
h=g\circ f.
$$

### Show

$$
L_h=L_gL_f
$$

is a valid Lipschitz constant.

### Step-by-step proof

**ধাপ ১:**

$$
h(x)=g(f(x)).
$$

Let:

$$
z=f(x),\quad z'=f(x').
$$

**ধাপ ২: $g$-এর Lipschitz property।**

$$
\|h(x)-h(x')\|=\|g(z)-g(z')\|\le L_g\|z-z'\|.
$$

**ধাপ ৩: $f$-এর Lipschitz property।**

$$
\|z-z'\|=\|f(x)-f(x')\|\le L_f\|x-x'\|.
$$

**ধাপ ৪: combine।**

$$
\|h(x)-h(x')\|\le L_gL_f\|x-x'\|.
$$

### Final

$$
\boxed{L_h=L_gL_f.}
$$

---

## 3.3 Lipschitz classifier robustness: why margin must be $2\epsilon L_f$

### Setup
Classifier:

$$
f:\mathbb{R}^n\to\mathbb{R}^m.
$$

Predicted class:

$$
c=\arg\max_i f(x)_i.
$$

Assume $f$ is $L_f$-Lipschitz। Perturbation radius:

$$
\|x-x'\|_p\le\epsilon.
$$

### Claim
Prediction stays class $c$ if score gap satisfies:

$$
f(x)_c-\max_{i\ne c}f(x)_i\ge 2\epsilon L_f.
$$

### Step-by-step proof

**ধাপ ১: output vector distance bound।**

$$
\|f(x)-f(x')\|_p\le L_f\|x-x'\|_p\le \epsilon L_f.
$$

**ধাপ ২: coordinate-wise bound।**  
যেকোনো coordinate $i$:

$$
|f(x)_i-f(x')_i|\le \epsilon L_f.
$$

**ধাপ ৩: winning class score কমতে পারে।**

$$
f(x')_c\ge f(x)_c-\epsilon L_f.
$$

**ধাপ ৪: runner-up class score বাড়তে পারে।**  
Let $d=\arg\max_{i\ne c}f(x)_i$। Then:

$$
f(x')_d\le f(x)_d+\epsilon L_f.
$$

**ধাপ ৫: gap after perturbation।**

$$
f(x')_c-f(x')_d
\ge
f(x)_c-f(x)_d-2\epsilon L_f.
$$

**ধাপ ৬: যদি original gap $\ge 2\epsilon L_f$, তাহলে:**

$$
f(x')_c-f(x')_d\ge 0.
$$

অতএব class $c$ still top।

### Why factor 2?
Winning class নিচে নামতে পারে $\epsilon L_f$; runner-up ওপরে উঠতে পারে $\epsilon L_f$। মোট gap shrink হতে পারে $2\epsilon L_f$।

---

## 3.4 Spectral normalisation layer 1-Lipschitz proof

### Layer

$$
\ell(x)=\frac{Wx}{\lambda(W)}+b,
$$

where $\lambda(W)$ is spectral norm.

### Show

$$
\|\ell(x)-\ell(x')\|_2\le \|x-x'\|_2.
$$

### Step-by-step

**ধাপ ১: layer outputs subtract করি।**

$$
\ell(x)-\ell(x')=rac{W(x-x')}{\lambda(W)}.
$$

Bias $b$ cancel হয়।

**ধাপ ২: norm নিই।**

$$
\|\ell(x)-\ell(x')\|_2
=
\frac{1}{\lambda(W)}\|W(x-x')\|_2.
$$

**ধাপ ৩: spectral norm definition।**

$$
\|Wz\|_2\le \lambda(W)\|z\|_2.
$$

Let $z=x-x'$।

**ধাপ ৪: substitute।**

$$
\frac{1}{\lambda(W)}\|W(x-x')\|_2
\le
\frac{1}{\lambda(W)}\lambda(W)\|x-x'\|_2.
$$

**ধাপ ৫: cancel।**

$$
\|\ell(x)-\ell(x')\|_2\le \|x-x'\|_2.
$$

### Final
Layer is $1$-Lipschitz.

---

## 3.5 Power iteration for spectral norm

### Goal
Large matrix $W$-এর spectral norm efficiently estimate করা। Exact SVD expensive হতে পারে।

### Algorithm
1. Random vectors initialise করো:
   

$$
u,v\leftarrow \mathcal{N}(0,1).
$$

2. Repeat $k$ times:
   

$$
v\leftarrow \frac{Wu}{\|Wu\|_2},
$$

   

$$
u\leftarrow \frac{v^TW}{\|v^TW\|_2}.
$$

3. Estimate:
   

$$
\hat{\lambda}(W)=v^TWu.
$$

### Intuition
Repeated multiplication dominant singular direction isolate করে। Training-এ $W$ slowly changes, তাই previous $u,v$ reuse করলে প্রতি step-এ এক iteration অনেক সময় enough।

---

## 3.6 Product by constant: Lipschitz scaling

### Given
$f$ has Lipschitz constant $L_f$। Define:

$$
g(x)=c f(x).
$$

### Step-by-step proof

$$
\|g(x)-g(x')\|_p
=
\|c f(x)-c f(x')\|_p.
$$

If $c\ge 0$:

$$
= c\|f(x)-f(x')\|_p.
$$

Using Lipschitz property:

$$
\le cL_f\|x-x'\|_p.
$$

### Final

$$
L_g=cL_f \quad (c\ge 0).
$$

If arbitrary real $c$ allowed, use $|c|L_f$.

---

## 3.7 Randomised smoothing: robust radius formula

### Smoothed classifier
Base classifier:

$$
f:\mathbb{R}^n\to C.
$$

Smoothed classifier:

$$
g(x)=\arg\max_{c\in C}\Pr(f(x+\xi)=c),
$$

where:

$$
\xi\sim\mathcal{N}(0,\sigma^2I).
$$

### Probability bounds
Let top class $c_A$ and runner-up $c_B$ satisfy:

$$
\Pr(f(x+\xi)=c_A)\ge p_A\ge p_B\ge \max_{c_B\neq c_A}\Pr(f(x+\xi)=c_B).
$$

### Certified radius

$$
\epsilon = \frac{\sigma}{2}\left(\Phi^{-1}(p_A)-\Phi^{-1}(p_B)\right).
$$

### Step-by-step meaning
1. $p_A$ বেশি হলে top class strong।
2. $p_B$ কম হলে runner-up weak।
3. Difference $\Phi^{-1}(p_A)-\Phi^{-1}(p_B)$ যত বড়, radius তত বড়।
4. $\sigma$ বেশি হলে smoothing বেশি, radius সাধারণত বড় হতে পারে—but accuracy কমতে পারে।

### Special simplification
যদি শুধু lower bound $p_A$ থাকে এবং worst-case $p_B\le 1-p_A$, তাহলে:

$$
\Phi^{-1}(p_B)\le \Phi^{-1}(1-p_A)=-\Phi^{-1}(p_A).
$$

তাই radius:

$$
\epsilon = \sigma\Phi^{-1}(p_A).
$$

যদি $p_A<1/2$, radius prove করা যায় না; classifier abstain করে।

---

## 3.8 Randomised smoothing Monte Carlo prediction

### Algorithm idea
Exact probability compute করা hard। তাই noisy samples নিয়ে vote করা হয়।

### Step-by-step

**ধাপ ১: $k$ বার noise sample করো।**

$$
\xi_j\sim\mathcal{N}(0,\sigma^2I).
$$

**ধাপ ২: noisy inputs classify করো।**

$$
c_j=f(x+\xi_j).
$$

**ধাপ ৩: class counts বের করো।**

$$
k_c=\#\{j:c_j=c\}.
$$

**ধাপ ৪: top এবং second class নাও।**

$$
\hat{c}_A=\arg\max_c k_c,
$$

$$
\hat{c}_B=\arg\max_{c\ne \hat{c}_A} k_c.
$$

**ধাপ ৫: binomial test।**  
Top class truly better কি না statistical test করে। If significant, return $\hat{c}_A$; otherwise abstain।

---

# Chapter 4 / Week 4 — Model extraction and membership inference

## 4.1 Binary logistic classifier parameter stealing

### Model

$$
f(x)=\operatorname{Sigm}(w^Tx+b),
$$

where:

$$
\operatorname{Sigm}(z)=\frac{1}{1+\exp(-z)}.
$$

Unknowns: $w\in\mathbb{R}^d$ and $b\in\mathbb{R}$। Total $d+1$ unknowns।

### Attack assumption
API returns confidence value $f(x)$, not just class label।

### Step 1: sigmoid invert করো

$$
\operatorname{Sigm}^{-1}(z)=\log\left(\frac{z}{1-z}\right).
$$

So:

$$
\operatorname{Sigm}^{-1}(f(x))=w^Tx+b.
$$

### Step 2: $d+1$ query করো
Choose inputs:

$$
x_1,\ldots,x_{d+1}.
$$

For each query:

$$
y_i=\operatorname{Sigm}^{-1}(f(x_i)).
$$

### Step 3: augmented matrix build করো

$$
\hat{X}=\begin{pmatrix}
| & | & & |\\
x_1 & x_2 & \cdots & x_{d+1}\\
1 & 1 & \cdots & 1
\end{pmatrix}
$$

Conceptually each column is augmented input $(x_i,1)$।

Augmented parameter:

$$
\hat{W}=(w^T\; b).
$$

Output row:

$$
\hat{Y}=(y_1,\ldots,y_{d+1}).
$$

Then:

$$
\hat{Y}=\hat{W}\hat{X}.
$$

### Step 4: solve
If $\hat{X}$ full-rank:

$$
\hat{W}=\hat{Y}\hat{X}^{-1}.
$$

### Why only $d+1$ samples?
There are $d$ weights plus 1 bias = $d+1$ unknowns। Confidence values inverse-sigmoid করলে equations linear হয়ে যায়।

---

## 4.2 Functionality stealing: synthetic dataset and extraction errors

### Synthetic dataset
Attacker victim model $f$ query করে:

$$
D=\{(x_i,f(x_i))\}_{i=1}^{k}.
$$

Then surrogate $g$ train করে যাতে:

$$
g(x)\approx f(x).
$$

### Test-set extraction error
Natural test set $T$ given:

$$
R_{test}=\frac{1}{|T|}\sum_{(x_i,f(x_i))\in T}L(g(x_i),f(x_i)).
$$

### Uniform-input extraction error
Random/uniform query set $U$:

$$
R_{unif}=\frac{1}{|U|}\sum_{(x_i,f(x_i))\in U}L(g(x_i),f(x_i)).
$$

### Meaning
- $R_{test}$ natural distribution-এ imitation quality।
- $R_{unif}$ broader/random input space-এ imitation quality।

---

## 4.3 Membership inference confidence-threshold attack

### Rule
If model confidence high, predict member:

$$
h(x)=
\begin{cases}
\text{member}, & \max_c f(x)_c\ge \tau,\\
\text{non-member}, & \text{otherwise}.
\end{cases}
$$

### Step-by-step
1. Candidate $x$ দিয়ে target model query করো।
2. Confidence scores $f(x)$ নাও।
3. Maximum confidence $\max_c f(x)_c$ বের করো।
4. Threshold $\tau$-এর সঙ্গে compare করো।
5. বেশি হলে member; কম হলে non-member।

### Intuition
Overfitted model training examples-এ unusually confident হতে পারে।

---

# Chapter 5 / Week 5 — LTL and safe RL formal methods

## 5.1 LTL operators quick workout

| Formula | Meaning |
|---|---|
| $G\phi$ | globally: future-এর সব সময় $\phi$ true |
| $F\phi$ | eventually: কোনো future time-এ $\phi$ true |
| $X\phi$ | next timestep-এ $\phi$ true |
| $\phi U \psi$ | $\psi$ true হওয়া পর্যন্ত $\phi$ true থাকবে; eventually $\psi$ true হবে |

### Useful equivalences

$$
F a \equiv \top U a.
$$

$$
G a \equiv \neg F\neg a.
$$

Meaning: “always $a$” means “not eventually not-$a$।”

---

## 5.2 MiniPacman LTL specification

### Informal task
- Ghost avoid করো।
- Food eventually collect করো।

### Formal

$$
G(\neg ghost)\wedge F(food).
$$

### Step-by-step meaning
1. $G(\neg ghost)$: every timestep-এ ghost state avoid করতে হবে।
2. $F(food)$: কোনো future timestep-এ food পাওয়া লাগবে।
3. Conjunction $\wedge$: দুটোই satisfy করতে হবে।

---

## 5.3 CartPole LTL examples

Definitions:

- $y$: yellow zone,
- $g$: green zone,
- $u$: pole falls.

### Objective 1
Eventually yellow zone-এ forever stay বা green zone-এ forever stay:

$$
FGy\vee FGg.
$$

**Breakdown:**
- $FGy$: eventually এমন সময় আসবে যার পরে always $y$।
- $FGg$: eventually এমন সময় আসবে যার পরে always $g$।
- $\vee$: যেকোনো একটি হলেই চলবে।

### Objective 2
Yellow এবং green infinitely often reach; pole never falls:

$$
GFy\wedge GFg\wedge G\neg u.
$$

**Breakdown:**
- $GFy$: always eventually yellow—মানে বারবার yellow reach হবে।
- $GFg$: বারবার green reach হবে।
- $G\neg u$: pole কখনো fall করবে না।

---

## 5.4 Gridworld LTL specification

### Task
Robot must:
1. অন্তত 3 items collect করবে।
2. তারপর special button একবার press করবে।
3. এরপর dangerous zone forever avoid করবে এবং button আবার press করবে না।

### Formula

$$
(\neg Button\_Pushed)\ U\ (Items\_Collected\ge 3)
$$

$$
\wedge\ F(Button\_Pushed)
$$

$$
\wedge\ G[Button\_Pushed\to XG(\neg Dangerous\_Zone\wedge \neg Button\_Pushed)].
$$

### Step-by-step
1. প্রথম অংশ: 3 items collect না হওয়া পর্যন্ত button press করা যাবে না।
2. দ্বিতীয় অংশ: button eventually press করতেই হবে।
3. তৃতীয় অংশ: button press হওয়ার পর next step থেকে dangerous zone forever avoid এবং button আর press নয়।

---

## 5.5 Shielding algorithm for safe RL

### Goal
Safety formula $\phi$ satisfy করে এমন policy চাই:

$$
\pi^*\models \phi.
$$

### Step-by-step shielding
1. MDP $M$ এবং safety formula $\phi$ given।
2. Safe state-action pairs set compute করো:
   

$$
E_{safe}.
$$

3. Runtime shield তৈরি করো, যা agent-কে শুধু $E_{safe}$-এর actions নিতে দেবে।
4. RL algorithm run করো shield-এর ওপর।
5. Resulting policy reward maximise করতে চেষ্টা করে কিন্তু unsafe actions blocked হয়।

---

## 5.6 Approximate model-based shielding probability

World model থেকে trajectory sample:

$$
\rho\sim p_\theta.
$$

Check:

$$
\rho\models\phi.
$$

Estimate:

$$
\Pr_M(\{\rho\mid \rho\models\phi\}).
$$

Action permissible যদি:

$$
\Pr_M(\{\rho\mid \rho\models\phi\})\ge 1-\epsilon.
$$

না হলে safe backup action নেওয়া হয়।

---

# Chapter 7 / Week 7 — Federated Learning fundamentals

## 7.1 FL global objective

### Setup
$K$ clients। Client $k$ dataset:

$$
D_k,
$$

size:

$$
m_k=|D_k|.
$$

Local objective:

$$
F_k(\theta)=\frac{1}{m_k}\sum_{(x,y)\in D_k}L(f_\theta(x),y).
$$

Global weight:

$$
p_k=\frac{m_k}{\sum_j m_j}.
$$

Global objective:

$$
\min_\theta F(\theta),\qquad F(\theta)=\sum_{k=1}^{K}p_kF_k(\theta).
$$

### Meaning
Larger clients get larger weight। If one hospital has more samples, its local risk contributes more।

---

## 7.2 FedAvg worked example with 3 clients

### Given

$$
\theta^{(0)}=0.5,\quad \eta=0.1,\quad R=1.
$$

Client data and gradients:

| Client | $m_k$ | $g_k$ |
|---|---:|---:|
| 1 | 100 | $+0.3$ |
| 2 | 200 | $-0.1$ |
| 3 | 100 | $+0.5$ |

### Step 1: local updates
Formula:

$$
\theta_k^{(1)}=\theta^{(0)}-\eta g_k.
$$

Client 1:

$$
0.5-0.1(0.3)=0.5-0.03=0.47.
$$

Client 2:

$$
0.5-0.1(-0.1)=0.5+0.01=0.51.
$$

Client 3:

$$
0.5-0.1(0.5)=0.5-0.05=0.45.
$$

### Step 2: aggregation weights
Total:

$$
100+200+100=400.
$$

Weights:

$$
p_1=100/400=0.25,
$$

$$
p_2=200/400=0.50,
$$

$$
p_3=100/400=0.25.
$$

### Step 3: global update

$$
\theta^{(1)}=0.25(0.47)+0.50(0.51)+0.25(0.45).
$$

Compute:

$$
0.1175+0.255+0.1125=0.485.
$$

### Final answer

$$
\boxed{\theta^{(1)}=0.485}
$$

Client 2-এর weight বেশি, তাই global model তার direction-এ বেশি pulled হয়।

---

## 7.3 FedProx vs FedAvg worked example

### FedProx objective

$$
h_k(\theta;\theta^{(t)})=F_k(\theta)+\frac{\mu}{2}\|\theta-\theta^{(t)}\|^2.
$$

### Update rule

$$
v^{(r)}=v^{(r-1)}-\eta\left(g_k(v^{(r-1)})+\mu(v^{(r-1)}-\theta^{(t)})\right).
$$

### Given

$$
\theta^{(0)}=0.5,\quad \eta=0.1,\quad \mu=1.0,\quad g_k=0.3.
$$

Initial:

$$
v^{(0)}=0.5.
$$

### Step 1: first local step
Proximal term:

$$
\mu(v^{(0)}-\theta^{(0)})=1(0.5-0.5)=0.
$$

So:

$$
v^{(1)}=0.5-0.1(0.3)=0.47.
$$

### Step 2: second local step
Proximal term:

$$
1(0.47-0.5)=-0.03.
$$

Gradient plus prox:

$$
0.3-0.03=0.27.
$$

Update:

$$
v^{(2)}=0.47-0.1(0.27)=0.47-0.027=0.443.
$$

### FedAvg comparison
Without proximal term:

$$
v^{(2)}_{FedAvg}=0.47-0.1(0.3)=0.44.
$$

### Meaning
FedProx gives $0.443$, closer to original $0.5$ than $0.44$। Proximal term “rubber band” হিসেবে global model-এর কাছে টেনে রাখে।

---

# Chapter 8 / Week 8 — FL attacks, defences, full walkthrough

## 8.1 FedAvg formula reminder

Weighted FedAvg update:

$$
\theta^{(t+1)}=\theta^{(t)}+\sum_k p_k\Delta_k^{(t)},
$$

where:

$$
p_k=\frac{m_k}{\sum_j m_j}.
$$

Equal data হলে:

$$
p_k=\frac{1}{K}.
$$

---

## 8.2 Scaling attack: equal-weight 5-client example

### Given
Honest updates:

$$
0.10,\quad 0.12,\quad 0.11,\quad 0.09.
$$

Attacker sends:

$$
-5.00.
$$

### FedAvg

$$
\frac{1}{5}(0.10+0.12+0.11+0.09-5.00).
$$

Sum honest:

$$
0.10+0.12+0.11+0.09=0.42.
$$

Add attacker:

$$
0.42-5.00=-4.58.
$$

Divide by 5:

$$
-4.58/5=-0.916.
$$

### Final

$$
\boxed{-0.916}
$$

Honest direction positive ছিল, কিন্তু attacker average negative করে দিল।

---

## 8.3 Bank walkthrough: B5 scaling attack weighted example

### Given
| Bank | true update | sent update | weight $p_k$ | contribution |
|---|---:|---:|---:|---:|
| B1 | +0.033 | +0.033 | 0.20 | +0.0066 |
| B2 | +0.042 | +0.042 | 0.30 | +0.0126 |
| B3 | +0.028 | +0.028 | 0.15 | +0.0042 |
| B4 | +0.038 | +0.038 | 0.25 | +0.0095 |
| B5 | +0.021 | -1.050 | 0.10 | -0.1050 |

B5 used:

$$
\tilde{\Delta}_5=-\alpha\Delta_5,\quad \alpha=50.
$$

### Step-by-step weighted sum

Honest contributions sum:

$$
0.0066+0.0126+0.0042+0.0095=0.0329.
$$

Add B5 contribution:

$$
0.0329-0.1050=-0.0721.
$$

### Result

$$
\boxed{\sum_kp_k\Delta_k=-0.0721}
$$

Honest update would be about $+0.0350$। B5 only 10% weight হয়েও direction flip করে।

---

## 8.4 Label flipping attack: WFR $\to$ LGT

### What happens
B5 wire-fraud transactions (WFR) label করে legitimate (LGT)।

### Effect table
| Metric | No attack | With B5 flipping | Change |
|---|---:|---:|---:|
| Global accuracy | 92.5% | 90.8% | -1.7% |
| WFR accuracy | 93.5% | 78.3% | -15.2% |
| LGT accuracy | 97.8% | 96.1% | -1.7% |

### Interpretation
Global accuracy সামান্য কমেছে, কিন্তু target class WFR-এর accuracy বড়ভাবে ভেঙেছে। Attack class-specific হলে global metric misleading হতে পারে।

---

## 8.5 Targeted model poisoning/backdoor: 10 clients, 1 attacker

### Formula
Attacker sends:

$$
\tilde{\theta}_k=\theta^{(t)}+\gamma(\theta^{backdoor}_k-\theta^{(t)}).
$$

### If $K=10$ and one attacker
Use:

$$
\gamma=K=10.
$$

FedAvg:

$$
\theta^{(t+1)}=\theta^{(t)}+\frac{1}{10}(9\Delta_{honest}+10\Delta_{backdoor}).
$$

Approx:

$$
\theta^{(t+1)}\approx \theta^{(t)}+\Delta_{honest}+\Delta_{backdoor}.
$$

### Meaning
Averaging normally attacker contribution dilute করত। Scaling $\gamma=10$ দিয়ে attacker dilution compensate করে।

### Reported table
| Stage | Clean accuracy | Backdoor success rate |
|---|---:|---:|
| Before attack | 93.2% | 0% |
| After 1 round, $\gamma=10$ | 92.8% | 87.4% |
| After 5 rounds | 93.0% | 91.6% |

### Key lesson
Clean accuracy almost normal, কিন্তু triggered inputs attacker-chosen label-এ যায়।

---

## 8.6 Byzantine 1D example

### Setup
$K=5$, $f=1$ Byzantine। Honest updates:

$$
0.10, 0.12, 0.11, 0.09.
$$

### Strategies and outcomes
| Byzantine strategy | Byzantine update | FedAvg result | Median result |
|---|---:|---:|---:|
| Random noise | +3.7 | +0.824 | +0.11 |
| Sign flip | -0.10 | +0.064 | +0.10 |
| “A little less” | +0.02 | +0.088 | +0.10 |

### Why median works here?
Because $f=1<K/2=2.5$। Majority honest। Median ignores one extreme or mild malicious value better than mean।

---

## 8.7 Sybil attack: median break threshold

### Scenario
Original 5 hospitals। Attacker controls 1 real malicious plus fake identities। Median needs:

$$
f<K/2.
$$

### With 4 Sybils
Total clients:

$$
K'=5+4=9.
$$

Threshold:

$$
f<9/2=4.5.
$$

Malicious identities:

$$
f=1+4=5.
$$

Since:

$$
5>4.5,
$$

median can break.

---

## 8.8 Gradient inversion objective

### Goal
Observed gradient/update $g_k$ থেকে original input reconstruct।

### Optimisation

$$
\min_{\hat{x},\hat{y}}
\left\|\nabla_\theta L(f_\theta(\hat{x}),\hat{y})-g_k\right\|^2.
$$

### Step-by-step intuition
1. Dummy input $\hat{x}$ and label $\hat{y}$ initialise করো।
2. Dummy gradient compute করো।
3. Observed gradient $g_k$-এর সঙ্গে difference নাও।
4. Difference minimise করতে $\hat{x}$ update করো।
5. যদি match ভালো হয়, reconstructed $\hat{x}$ original-like হতে পারে।

---

## 8.9 Membership inference threshold rule

### Rule

$$
member(x)=
\begin{cases}
1, & L(f_\theta(x),y)<\tau,\\
0, & \text{otherwise}.
\end{cases}
$$

### Disease prediction example
| Record | Loss | Confidence | Prediction |
|---|---:|---:|---|
| Patient A | 0.03 | 98.2% | Member |
| Patient B | 0.08 | 96.1% | Member |
| Patient C | 1.82 | 61.3% | Non-member |
| Patient D | 2.45 | 48.7% | Non-member |

If threshold $\tau=0.5$, A and B are members because losses are below threshold।

---

## 8.10 Free-riding convergence impact

### Setup
Free-riders send:

$$
\theta^{(t)}+\epsilon,\quad \epsilon\sim\mathcal{N}(0,10^{-4}).
$$

### Table
| Free-riders | Effective contributors | Rounds to 90% | Slowdown |
|---:|---:|---:|---:|
| 0/10 | 10 | ~12 | — |
| 3/10 | 7 | ~20 | 1.7x |
| 5/10 | 5 | ~35+ | 2.9x+ |
| 8/10 | 2 | not reached | $\infty$ |

### Meaning
Free-riders model corrupt না করলেও convergence slow করে—availability attack।

---

## 8.11 Robust aggregation: coordinate-wise median example

Updates:

$$
\{0.10,0.12,0.11,0.09,-5.0\}.
$$

Sort:

$$
\{-5.0,0.09,0.10,0.11,0.12\}.
$$

Median:

$$
0.10.
$$

FedAvg ছিল $-0.916$। Median attacker outlier neutralise করে।

---

## 8.12 Trimmed mean example with $\beta=0.2$

Sorted updates:

$$
\{-5.0,0.09,0.10,0.11,0.12\}.
$$

Trim count:

$$
\lfloor 0.2\times 5\rfloor=1.
$$

Drop smallest $-5.0$ and largest $0.12$। Remaining:

$$
\{0.09,0.10,0.11\}.
$$

Mean:

$$
\frac{0.09+0.10+0.11}{3}=0.10.
$$

---

## 8.13 DP local clipping example

### Given

$$
\Delta=(3,4),\quad C=1.
$$

Norm:

$$
\|\Delta\|_2=\sqrt{3^2+4^2}=5.
$$

Clip:

$$
clip(\Delta,1)=\Delta\cdot \min(1,1/5).
$$

Since $1/5<1$:

$$
clip(\Delta,1)=(3,4)\cdot 1/5=(0.6,0.8).
$$

Noise sample:

$$
n=(0.1,-0.2).
$$

Noisy clipped update:

$$
\tilde{\Delta}=(0.6,0.8)+(0.1,-0.2)=(0.7,0.6).
$$

---

## 8.14 Secure aggregation 3-client example

### True updates

$$
\Delta_1=0.3,\quad \Delta_2=0.5,\quad \Delta_3=0.2.
$$

Pairwise masks:

$$
r_{12}=0.7,\quad r_{13}=-0.4,\quad r_{23}=0.1.
$$

Use convention: client $i$ adds $r_{ij}$ if $i<j$, client $j$ subtracts $r_{ij}$।

Client 1 sends:

$$
0.3+0.7+(-0.4)=0.6.
$$

Client 2 sends:

$$
0.5-0.7+0.1=-0.1.
$$

Client 3 sends:

$$
0.2-(-0.4)-0.1=0.5.
$$

Server sums:

$$
0.6-0.1+0.5=1.0.
$$

True sum:

$$
0.3+0.5+0.2=1.0.
$$

Masks cancel; server individual updates শেখে না।

---

## 8.15 Neural Cleanse objective

For target class $y_t$, find small trigger mask $m$ and pattern $\tau$:

$$
\min_{m,\tau} \ell(y_t,f_\theta(A(x,m,\tau)))+\lambda\|m\|_1.
$$

Trigger application:

$$
x'_{i,j}=(1-m_{i,j})x_{i,j}+m_{i,j}\tau_{i,j}.
$$

### Detection idea
If one class needs anomalously small trigger, it may be backdoor target।

Example:

| Target class | Trigger size | Interpretation |
|---|---:|---|
| A | 15 | Outlier / infected |
| B | 142 | Normal |
| C | 138 | Normal |

Class A suspicious।

---

## 8.16 Five-bank FedAvg Round 1 calculation

### Given
Initial scalar parameter:

$$
\theta^{(0)}=0.150.
$$

After local SGD:

| Bank | $\theta_k^{(1)}$ | $\Delta_k$ | weight $p_k$ | contribution $p_k\Delta_k$ |
|---|---:|---:|---:|---:|
| B1 | 0.183 | +0.033 | 0.20 | +0.0066 |
| B2 | 0.192 | +0.042 | 0.30 | +0.0126 |
| B3 | 0.178 | +0.028 | 0.15 | +0.0042 |
| B4 | 0.188 | +0.038 | 0.25 | +0.0095 |
| B5 | 0.171 | +0.021 | 0.10 | +0.0021 |

### Step 1: aggregate update

$$
0.0066+0.0126+0.0042+0.0095+0.0021=0.0350.
$$

### Step 2: update global parameter

$$
\theta^{(1)}=0.150+0.0350=0.185.
$$

### Final

$$
\boxed{\theta^{(1)}=0.185}
$$

---

## 8.17 Five-bank defence: median/trimmed/Krum under attack

### Updates under attack

$$
\{0.033,0.042,0.028,0.038,-1.050\}.
$$

Sorted:

$$
\{-1.050,0.028,0.033,0.038,0.042\}.
$$

### Median
Middle value:

$$
0.033.
$$

### Trimmed mean $\beta=0.2$
Drop one smallest and one largest:

$$
\{0.028,0.033,0.038\}.
$$

Mean:

$$
\frac{0.028+0.033+0.038}{3}=0.033.
$$

### Krum
B5 outlier $-1.050$ far away। Krum selects central honest-looking update, slide says B4 update $+0.038$।

| Method | Result | Honest $+0.035$ close? |
|---|---:|---|
| FedAvg | -0.0721 | No |
| Median | +0.033 | Yes |
| Trimmed mean | +0.033 | Yes |
| Krum | +0.038 | Yes |

---

## 8.18 Five-bank DP clipping example

### Given

$$
\Delta_1=(0.033,0.041),\quad C=0.05.
$$

Norm:

$$
\|\Delta_1\|_2=0.0527.
$$

Clip factor:

$$
0.05/0.0527\approx 0.949.
$$

Clipped update:

$$
(0.033,0.041)\cdot 0.949=(0.0313,0.0389).
$$

Noise sample:

$$
(0.012,-0.008).
$$

Noisy update:

$$
(0.0313,0.0389)+(0.012,-0.008)=(0.0433,0.0309).
$$

---

# Chapter 9 / Week 9 — SMPC, ZKP, zkML

## 9.1 Additive secret sharing worked example

### Given

$$
p=23,\quad s=7,\quad n=3.
$$

Choose random shares:

$$
s_1=15,\quad s_2=4.
$$

Compute final share:

$$
s_3=s-s_1-s_2\pmod{23}.
$$

$$
s_3=7-15-4=-12\equiv 11\pmod{23}.
$$

Shares:

$$
(15,4,11).
$$

Check:

$$
15+4+11=30\equiv 7\pmod{23}.
$$

---

## 9.2 Additive share addition example

### Given
$s=7$ shares:

$$
(15,4,11)
$$

because:

$$
15+4+11=30\equiv7\pmod{23}.
$$

$r=3$ shares:

$$
(9,18,22)
$$

because:

$$
9+18+22=49\equiv3\pmod{23}.
$$

### Add shares coordinate-wise

Party 1:

$$
15+9=24\equiv1.
$$

Party 2:

$$
4+18=22.
$$

Party 3:

$$
11+22=33\equiv10.
$$

So $s+r$ shares:

$$
(1,22,10).
$$

Check:

$$
1+22+10=33\equiv10\pmod{23}.
$$

And:

$$
7+3=10.
$$

---

## 9.3 Shamir secret sharing setup example

### Given

$$
p=23,\quad s=5,\quad t=1.
$$

Choose degree-1 polynomial:

$$
q(x)=5+3x.
$$

### Shares

$$
q(1)=5+3=8.
$$

$$
q(2)=5+6=11.
$$

$$
q(3)=5+9=14.
$$

Shares:

$$
(1,8),(2,11),(3,14).
$$

Since $t+1=2$, any 2 shares reconstruct secret।

---

## 9.4 Lagrange reconstruction example

### Reconstruct secret from shares

$$
(1,8),\quad (3,14).
$$

Need $q(0)$। Lagrange basis:

$$
L_1(0)=\frac{0-3}{1-3}=\frac{-3}{-2}=\frac{3}{2}.
$$

$$
L_3(0)=\frac{0-1}{3-1}=\frac{-1}{2}.
$$

Then:

$$
q(0)=8\cdot \frac{3}{2}+14\cdot\left(-\frac{1}{2}\right).
$$

Compute:

$$
8\cdot\frac{3}{2}=12,
$$

$$
14\cdot\left(-\frac{1}{2}\right)=-7.
$$

So:

$$
q(0)=12-7=5.
$$

### Final

$$
\boxed{s=5}
$$

> Modular field version-এ fractions modular inverse দিয়ে interpret করতে হয়। Slide ordinary fraction দিয়ে intuition দেখিয়েছে।

---

## 9.5 Beaver triple multiplication protocol: corrected worked example

### Goal
Secret-shared $s=7$ and $r=3$ multiply করে $sr=21$ পেতে চাই mod 23।

### Given shares

$$
s=(s_1,s_2)=(10,20),\quad 10+20=30\equiv7.
$$

$$
r=(r_1,r_2)=(15,11),\quad 15+11=26\equiv3.
$$

Beaver triple:

$$
a=5,\quad b=9,\quad c=ab=45\equiv22.
$$

Shares:

$$
a=(2,3),\quad b=(4,5),\quad c=(8,14).
$$

### Step 1: masked differences
Party 1:

$$
\epsilon_1=s_1-a_1=10-2=8,
$$

$$
\delta_1=r_1-b_1=15-4=11.
$$

Party 2:

$$
\epsilon_2=s_2-a_2=20-3=17,
$$

$$
\delta_2=r_2-b_2=11-5=6.
$$

### Step 2: open sums

$$
\epsilon=8+17=25\equiv2\pmod{23}.
$$

$$
\delta=11+6=17\pmod{23}.
$$

### Step 3: compute output shares
Party 1:

$$
z_1=c_1+\epsilon b_1+\delta a_1+\epsilon\delta.
$$

Substitute:

$$
z_1=8+2\cdot4+17\cdot2+2\cdot17.
$$

Compute:

$$
8+8+34+34=84.
$$

Modulo 23:

$$
84\equiv15\pmod{23}.
$$

Party 2:

$$
z_2=c_2+\epsilon b_2+\delta a_2.
$$

$$
z_2=14+2\cdot5+17\cdot3=14+10+51=75.
$$

Modulo 23:

$$
75\equiv6\pmod{23}.
$$

### Step 4: reconstruct product

$$
z_1+z_2=15+6=21\pmod{23}.
$$

Check:

$$
sr=7\cdot3=21.
$$

### Final

$$
\boxed{sr=21}
$$

> সতর্কতা: PDF notes নিজেই বলে slide arithmetic-এ $84$ বনাম $80$ inconsistency ছিল। এখানে corrected arithmetic দেখানো হলো।

---

## 9.6 Secure aggregation masks: 3-client example

### True updates

$$
\Delta_1=10,\Delta_2=20,\Delta_3=15.
$$

True sum:

$$
45.
$$

Masks:

$$
r_{12}=7, r_{13}=3, r_{23}=11.
$$

Use consistent convention: if $i<j$, client $i$ adds $r_{ij}$, client $j$ subtracts $r_{ij}$।

Client 1 sends:

$$
10+7+3=20.
$$

Client 2 sends:

$$
20-7+11=24.
$$

Client 3 sends:

$$
15-3-11=1.
$$

Server sums:

$$
20+24+1=45.
$$

All masks cancel।

> PDF notes-এ আরেক sign convention দিয়ে $(14,24,7)$ দেখানো হয়েছে, সেটিও sum 45 দেয়। মূল idea: প্রতিটি pairwise mask একবার plus, একবার minus আসতে হবে।

---

## 9.7 Colour-blind ball ZKP soundness probability

### One round
If balls same colour, prover can only guess swap/no-swap। Correct probability:

$$
1/2.
$$

### $k$ rounds
Cheating probability:

$$
(1/2)^k=2^{-k}.
$$

### Meaning
Rounds বাড়ালে false proof accept probability exponentially কমে।

---

## 9.8 Schnorr protocol worked example

### Setup

$$
p=23, q=11, g=2, w=6.
$$

Public key:

$$
y=g^w=2^6=64\equiv18\pmod{23}.
$$

### Commit
Prover picks:

$$
r=7.
$$

Computes:

$$
t=g^r=2^7=128\equiv13\pmod{23}.
$$

### Challenge
Verifier sends:

$$
c=4.
$$

### Response

$$
s=r+cw\pmod q=7+4\cdot6=31\equiv9\pmod{11}.
$$

### Verification
Check:

$$
g^s \stackrel{?}{=} t y^c \pmod p.
$$

Left:

$$
g^s=2^9=512\equiv6\pmod{23}.
$$

Right:

$$
y^c=18^4.
$$

Compute:

$$
18^2=324\equiv2\pmod{23},
$$

$$
18^4\equiv2^2=4.
$$

Then:

$$
ty^c=13\cdot4=52\equiv6\pmod{23}.
$$

Both sides equal 6। Proof accepted।

---

## 9.9 Schnorr practice example

### Given

$$
p=23, q=11, g=2, w=4, r=3, c=6.
$$

Public key:

$$
y=2^4=16.
$$

Commitment:

$$
t=2^3=8.
$$

Response:

$$
s=3+6\cdot4=27\equiv5\pmod{11}.
$$

Verify:

$$
g^s=2^5=32\equiv9\pmod{23}.
$$

Right:

$$
ty^c=8\cdot16^6.
$$

Compute:

$$
16^2\equiv3,\quad 16^4\equiv9,\quad 16^6=16^4\cdot16^2\equiv9\cdot3=27\equiv4.
$$

So:

$$
8\cdot4=32\equiv9.
$$

Accepted।

---

## 9.10 R1CS worked example

### Compute

$$
y=(x_1x_2)(x_2+x_3)
$$

with:

$$
x_1=2,\quad x_2=3,\quad x_3=4.
$$

### Step 1: first multiplication

$$
w_1=x_1x_2=2\cdot3=6.
$$

### Step 2: addition

$$
x_2+x_3=3+4=7.
$$

### Step 3: final multiplication

$$
y=w_1(x_2+x_3)=6\cdot7=42.
$$

### R1CS constraints
1.

$$
x_1\cdot x_2=w_1.
$$

Check:

$$
2\cdot3=6.
$$

2.

$$
w_1\cdot(x_2+x_3)=y.
$$

Check:

$$
6\cdot7=42.
$$

---

## 9.11 zkML norm-bound proof circuit

### Statement
Client wants to prove:

$$
\sum_i\Delta_{k,i}^2\le B^2
$$

without revealing $\Delta_k$.

### Circuit checks
1. Commitment consistency:

$$
Com(\Delta_k,r)=com.
$$

2. Norm bound:

$$
\sum_i\Delta_{k,i}^2\le B^2.
$$

### Cost intuition
- $d$ dimensions হলে $d$ squarings/multiplications।
- One range/bound check।
- Full SGD proof much harder because forward + backward pass circuit লাগে।

---

## 9.12 zkML fixed-point rescaling

### Problem
SNARK finite field-এ decimal নেই। Real $r$ encode:

$$
\hat{r}=round(r2^s).
$$

### Multiplication scale blow-up
If $\hat{x}$ and $\hat{y}$ both scale $2^s$ represent করে, then:

$$
\hat{x}\hat{y}
$$

scale becomes:

$$
2^{2s}.
$$

Need rescale।

### Rescaling step
Write:

$$
\hat{z}=q2^s+r,\quad 0\le r<2^s.
$$

Keep:

$$
\hat{z}'=q.
$$

Range-check $r$।

---

# Chapter 10 / Week 10 — Fully Homomorphic Encryption, FHE

## 10.1 RSA multiplicative homomorphism worked example

### Given

$$
N=33, e=3, d=7.
$$

Plaintexts:

$$
m_1=4,\quad m_2=5.
$$

### Step 1: encrypt $m_1$

$$
c_1=4^3\bmod33.
$$

$$
4^3=64.
$$

$$
64\bmod33=31.
$$

So:

$$
c_1=31.
$$

### Step 2: encrypt $m_2$

$$
c_2=5^3\bmod33.
$$

$$
5^3=125.
$$

$$
125\bmod33=26.
$$

So:

$$
c_2=26.
$$

### Step 3: ciphertexts multiply

$$
c_1c_2=31\cdot26=806.
$$

Modulo 33:

$$
806\bmod33=14.
$$

### Step 4: decrypt

$$
14^7\bmod33=20.
$$

### Step 5: plaintext check

$$
m_1m_2=4\cdot5=20.
$$

### Final

$$
\boxed{20}
$$

Ciphertext multiplication decrypted to plaintext multiplication।

---

## 10.2 DGHV encryption/decryption worked example

### Setup
Secret key:

$$
p=29.
$$

Encryption rule:

$$
c=qp+2r+m.
$$

Plaintexts:

$$
m_1=1,\quad m_2=0.
$$

For $m_1$:

$$
q_1=2, r_1=1.
$$

For $m_2$:

$$
q_2=3, r_2=1.
$$

### Encrypt $m_1$

$$
c_1=2\cdot29+2\cdot1+1=58+2+1=61.
$$

### Encrypt $m_2$

$$
c_2=3\cdot29+2\cdot1+0=87+2=89.
$$

### Decrypt $c_1$

$$
61\bmod29=3.
$$

$$
3\bmod2=1.
$$

Recover $m_1=1$।

---

## 10.3 DGHV homomorphic addition

### Add ciphertexts

$$
c_1+c_2=61+89=150.
$$

Decrypt:

$$
150\bmod29=5.
$$

$$
5\bmod2=1.
$$

Plaintext addition:

$$
m_1+m_2=1+0=1.
$$

Correct।

### Noise
Original noises:

$$
r_1=1, r_2=1.
$$

New addition noise:

$$
r_1+r_2=2.
$$

Addition noise grows linearly।

---

## 10.4 DGHV homomorphic multiplication

### Multiply ciphertexts

$$
c_1c_2=61\cdot89=5429.
$$

Decrypt:

$$
5429\bmod29=6.
$$

$$
6\bmod2=0.
$$

Plaintext multiplication:

$$
m_1m_2=1\cdot0=0.
$$

Correct।

### Algebraic noise expansion

$$
c_1c_2=q''p+2(2r_1r_2+r_1m_2+r_2m_1)+m_1m_2.
$$

New noise roughly multiplicative, because $r_1r_2$ term appears।

---

## 10.5 Depth wall calculation

Given real parameter sizes:

$$
|r|\approx71\text{ bits},\quad |p|\approx2700\text{ bits}.
$$

Noise after $d$ multiplications:

$$
r^{2^d}.
$$

Bit-budget condition:

$$
71\cdot2^d<2700.
$$

Solve roughly:

$$
2^d<2700/71\approx38.0.
$$

Since:

$$
2^5=32<38,\quad 2^6=64>38,
$$

about 5 multiplicative levels are safe; 6 may exceed budget।

---

## 10.6 Bootstrapping formula

Bootstrapping:

$$
Bootstrap(c)=Eval(Dec,c,Enc(sk))=c^*.
$$

Then:

$$
Dec(c^*)=m.
$$

### Meaning
FHE homomorphically runs its own decryption circuit using encrypted secret key। Output fresh ciphertext with same plaintext but lower noise।

---

## 10.7 CKKS encrypted dot product worked example

### Task

$$
y=w_1x_1+w_2x_2+w_3x_3.
$$

Weights:

$$
w=(0.5,-0.3,0.8).
$$

Private encrypted features:

$$
x=(2.0,1.0,1.5).
$$

Expected:

$$
y=0.5(2.0)-0.3(1.0)+0.8(1.5)=1.0-0.3+1.2=1.9.
$$

### Step 1: pack

$$
x=(2.0,1.0,1.5,0).
$$

### Step 2: slot-wise multiply

$$
(2.0,1.0,1.5,0)\odot(0.5,-0.3,0.8,0)
$$

$$
=(1.0,-0.3,1.2,0).
$$

### Step 3: rotate by 1 and add
Rotate:

$$
(-0.3,1.2,0,1.0).
$$

Add:

$$
(1.0,-0.3,1.2,0)+(-0.3,1.2,0,1.0)
$$

$$
=(0.7,0.9,1.2,1.0).
$$

### Step 4: rotate by 2 and add
Rotate:

$$
(1.2,1.0,0.7,0.9).
$$

Add:

$$
(0.7,0.9,1.2,1.0)+(1.2,1.0,0.7,0.9)
$$

$$
=(1.9,1.9,1.9,1.9).
$$

### Final
Each slot contains:

$$
\boxed{1.9}
$$

---

## 10.8 Logistic regression under FHE

Model:

$$
\hat{y}=\sigma(w^Tx+b).
$$

Sigmoid:

$$
\sigma(z)=\frac{1}{1+e^{-z}}.
$$

FHE-friendly polynomial approximation on $z\in[-5,5]$:

$$
\sigma(z)\approx0.5+0.197z-0.004z^3.
$$

### Step-by-step inference
1. Server homomorphically computes linear part:
   

$$
z=w^Tx+b.
$$

2. Since true sigmoid uses exp/division, expensive under FHE।
3. Replace with polynomial:
   

$$
0.5+0.197z-0.004z^3.
$$

4. Polynomial uses addition and multiplication only, so FHE can evaluate।
5. Client decrypts approximate probability and rounds/classifies।

---

## 10.9 Paillier-style FL aggregation formula

Target:

$$
\bar{\Delta}=\frac{1}{K}\sum_k\Delta_k.
$$

Paillier additive homomorphism:

$$
Enc(m_1)Enc(m_2)=Enc(m_1+m_2).
$$

Each client sends:

$$
c_k=Enc(\Delta_k).
$$

Server multiplies ciphertexts:

$$
\prod_k c_k=Enc\left(\sum_k\Delta_k\right).
$$

Client/key holder decrypts sum, then divides by $K$।

---

# Chapter 11 / Week 11 — Differential Privacy and revision practice

## 11.1 $k$-anonymity homogeneity attack worked example

### Equivalence class
4 records indistinguishable by quasi-identifiers:

| Person | ZIP | Age | Sex | Sensitive attribute |
|---|---|---|---|---|
| Alice | M1* | 30-40 | F | HIV |
| Beth | M1* | 30-40 | F | HIV |
| Cara | M1* | 30-40 | F | HIV |
| Dora | M1* | 30-40 | F | HIV |

### Why $k=4$?
Alice is hidden among 4 indistinguishable rows।

### Why privacy still fails?
All 4 sensitive attributes are HIV। If attacker knows Alice is in this group, then:

$$
\Pr(Alice\ has\ HIV)=1.
$$

Identity hidden, sensitive attribute leaked।

---

## 11.2 Mean income sensitivity worked example

### Setup
1000 patients, income:

$$
x_i\in[0,100000].
$$

Query:

$$
q(D)=\frac{1}{1000}\sum_{i=1}^{1000}x_i.
$$

### Sensitivity under bounded DP
Worst case: one record changes from 0 to 100000।

Change in mean:

$$
|q(D)-q(D')|\le \frac{100000}{1000}=100.
$$

### Final

$$
\boxed{\Delta_1q=100}
$$

Laplace scale for pure $\varepsilon$-DP:

$$
b=\frac{\Delta_1q}{\varepsilon}=\frac{100}{\varepsilon}.
$$

---

## 11.3 Laplace mechanism example

### Given

$$
N=1000,\quad \Delta_1q=100,\quad \varepsilon=1.
$$

Scale:

$$
b=\frac{100}{1}=100.
$$

True mean:

$$
£32,450.
$$

Sample noise:

$$
\eta=+73.
$$

Released mean:

$$
32450+73=32523.
$$

Noise standard deviation:

$$
\sqrt{2}b=\sqrt{2}(100)\approx141.
$$

If $\varepsilon=0.1$:

$$
b=100/0.1=1000,
$$

$$
std=\sqrt{2}(1000)\approx1414.
$$

---

## 11.4 Gaussian histogram mechanism example

### Setup

$$
d=10\text{ bins},\quad N=10000,\quad \varepsilon=1,\quad \delta=10^{-5}.
$$

Sensitivity:

$$
\Delta_2q=1.
$$

Gaussian calibration:

$$
\sigma\ge \frac{\Delta_2q\sqrt{2\ln(1.25/\delta)}}{\varepsilon}.
$$

Substitute:

$$
\sigma=\sqrt{2\ln(1.25/10^{-5})}\approx4.84.
$$

Noisy count:

$$
\tilde{c}_j=c_j+\mathcal{N}(0,4.84^2).
$$

Approx 95% range:

$$
\pm 2\sigma\approx \pm9.7 \approx \pm9.5.
$$

If each bin has about 1000 records, ±10 noise is about 1% relative error।

---

## 11.5 Basic composition example

100 queries, each with:

$$
\varepsilon=0.1.
$$

Basic composition:

$$
\varepsilon_{total}=100\times0.1=10.
$$

Ratio bound:

$$
e^{10}\approx22000.
$$

Meaning: privacy effectively weak। This motivates advanced/RDP accounting।

---

## 11.6 Randomised response privacy calculation

### Mechanism
- Truth yes হলে report yes probability $3/4$।
- Truth no হলে report yes probability $1/4$।

### DP ratio

$$
\frac{3/4}{1/4}=3.
$$

So:

$$
3=e^{\ln3}.
$$

### Final

$$
\boxed{\varepsilon=\ln3\approx1.1}
$$

### Unbiased estimator
If true sensitive fraction is $p$:

$$
Pr[yes]=\frac{1}{2}p+\frac{1}{4}.
$$

Solve:

$$
p=2Pr[yes]-\frac{1}{2}.
$$

Empirical:

$$
\hat{p}=2(\text{fraction yes})-\frac{1}{2}.
$$

---

## 11.7 DP-SGD one-step worked example

### Setup
Current parameters:

$$
\theta_t=(1,1,1,1).
$$

Hyperparameters:

$$
C=2,\quad \sigma=1,\quad \eta=0.1,\quad B=2.
$$

Per-sample gradients:

$$
g_1=(3,4,0,0),
$$

$$
g_2=(1,1,1,1).
$$

### Step 1: clip $g_1$

Norm:

$$
\|g_1\|_2=\sqrt{3^2+4^2}=5>2.
$$

Clip factor:

$$
C/\|g_1\|=2/5.
$$

Clipped:

$$
\bar{g}_1=(3,4,0,0)\cdot\frac{2}{5}=(1.2,1.6,0,0).
$$

### Step 2: clip $g_2$

Norm:

$$
\|g_2\|_2=\sqrt{1+1+1+1}=2\le2.
$$

So:

$$
\bar{g}_2=(1,1,1,1).
$$

### Step 3: sum clipped gradients

$$
\bar{g}_1+\bar{g}_2=(2.2,2.6,1,1).
$$

### Step 4: add noise
Noise distribution:

$$
\mathcal{N}(0,\sigma^2C^2I)=\mathcal{N}(0,4I).
$$

Sample noise:

$$
(0.3,-0.4,0.1,-0.2).
$$

Add:

$$
(2.2,2.6,1,1)+(0.3,-0.4,0.1,-0.2)=(2.5,2.2,1.1,0.8).
$$

### Step 5: average
Batch size $B=2$:

$$
\tilde{g}_t=\frac{1}{2}(2.5,2.2,1.1,0.8)=(1.25,1.10,0.55,0.40).
$$

### Step 6: parameter update

$$
\theta_{t+1}=\theta_t-\eta\tilde{g}_t.
$$

$$
=(1,1,1,1)-0.1(1.25,1.10,0.55,0.40).
$$

$$
=(0.875,0.890,0.945,0.960).
$$

---

## 11.8 DP-FedAvg one-round worked example

### Setup

$$
K=1000,\quad q=0.1,\quad |C^{(t)}|\approx100,\quad C=1,\quad \sigma=1.
$$

Single scalar parameter।

### Step 1: client 7 clips update

$$
\Delta_7=2.3.
$$

Clip:

$$
\bar{\Delta}_7=2.3\cdot\min(1,1/2.3)=1.0.
$$

### Step 2: server aggregates clipped updates
Given:

$$
\sum_{k\in C^{(t)}}\bar{\Delta}_k=35.7.
$$

Without noise average:

$$
35.7/100=0.357.
$$

### Step 3: add noise to sum
Noise:

$$
\eta\sim\mathcal{N}(0,1),\quad \eta=0.42.
$$

Final aggregate:

$$
\frac{35.7+0.42}{100}=0.3612.
$$

### Step 4: update

$$
\theta^{(t+1)}=\theta^{(t)}+0.3612.
$$

Privacy accountant updates total $(\varepsilon,\delta)$। Slide example says after $T=1000$, $\sigma=1$, $q=0.1$:

$$
\varepsilon\approx5\quad at\quad \delta=10^{-5}.
$$

---

## 11.9 Revision: FedAvg vs trimmed mean computation

### Setup
| Client | $n_k$ | $\Delta_k$ |
|---|---:|---:|
| 1 | 200 | 0.06 |
| 2 | 200 | 0.08 |
| 3 | 200 | 0.07 |
| 4 | 100 | 0.05 |
| 5 | 100 | 0.04 |
| 6 | 100 | 0.09 |
| 7 | 100 | -2.50 |

Total:

$$
N=1000.
$$

### FedAvg weighted sum

$$
\sum n_k\Delta_k
=200(0.06)+200(0.08)+200(0.07)+100(0.05)+100(0.04)+100(0.09)+100(-2.50).
$$

Compute terms:

$$
12+16+14+5+4+9-250=-190.
$$

FedAvg:

$$
\Delta_{FedAvg}=\frac{-190}{1000}=-0.19.
$$

### Trimmed mean with $\beta=0.2$
Sort updates:

$$
\{-2.50,0.04,0.05,0.06,0.07,0.08,0.09\}.
$$

Trim count:

$$
\lfloor0.2\times7\rfloor=1.
$$

Drop smallest $-2.50$ and largest $0.09$। Remaining:

$$
\{0.04,0.05,0.06,0.07,0.08\}.
$$

Mean:

$$
\frac{0.04+0.05+0.06+0.07+0.08}{5}=\frac{0.30}{5}=0.06.
$$

### Final

$$
\boxed{\Delta_{FedAvg}=-0.19,\quad \Delta_{trim}=0.06}
$$

Trimmed mean attack outlier remove করে honest direction recover করে।

---

## 11.10 Revision: secure aggregation with pairwise masks

### Given

$$
\Delta_1=0.06,\Delta_2=0.08,\Delta_3=0.07.
$$

Masks:

$$
r_{12}=0.10, r_{13}=-0.20, r_{23}=0.30.
$$

Convention: client $i$ adds $r_{ij}$ for $j>i$, subtracts $r_{ji}$ for $j<i$।

### Masked updates
Client 1:

$$
\tilde{\Delta}_1=0.06+0.10+(-0.20)=-0.04.
$$

Client 2:

$$
\tilde{\Delta}_2=0.08-0.10+0.30=0.28.
$$

Client 3:

$$
\tilde{\Delta}_3=0.07-(-0.20)-0.30=-0.03.
$$

### Server sum

$$
-0.04+0.28-0.03=0.21.
$$

True sum:

$$
0.06+0.08+0.07=0.21.
$$

Masks cancel।

---

## 11.11 Revision: DP-SGD clipping/noise with 5 gradients

### Gradients

$$
g_1=(0.3,0.4),\quad g_2=(0.6,0.8),\quad g_3=(1.5,-2.0),
$$

$$
g_4=(-0.8,0.6),\quad g_5=(3.0,4.0).
$$

Parameters:

$$
C=1,\sigma=1, B=5, \eta_{noise}=(0.7,-0.8).
$$

### Norms

$$
\|g_1\|=0.5,\quad \|g_2\|=1.0,\quad \|g_3\|=2.5,\quad \|g_4\|=1.0,\quad \|g_5\|=5.0.
$$

### Clip

$$
\bar{g}_1=(0.3,0.4).
$$

$$
\bar{g}_2=(0.6,0.8).
$$

For $g_3$:

$$
(1.5,-2.0)\cdot\frac{1}{2.5}=(0.6,-0.8).
$$

$$
\bar{g}_4=(-0.8,0.6).
$$

For $g_5$:

$$
(3.0,4.0)\cdot\frac{1}{5}=(0.6,0.8).
$$

### Sum

First coordinate:

$$
0.3+0.6+0.6-0.8+0.6=1.3.
$$

Second coordinate:

$$
0.4+0.8-0.8+0.6+0.8=1.8.
$$

So:

$$
\sum_i\bar{g}_i=(1.3,1.8).
$$

### Add noise

$$
(1.3,1.8)+(0.7,-0.8)=(2.0,1.0).
$$

### Average

$$
\tilde{g}=\frac{1}{5}(2.0,1.0)=(0.4,0.2).
$$

---

## 11.12 ZK range proof: bit commitments

### Setup

$$
p=23, g=5, h=7, q=22.
$$

Commitment:

$$
Com(v,\rho)=g^vh^\rho\pmod p.
$$

Want prove:

$$
\Delta\in\{0,1,\ldots,7\}.
$$

Given:

$$
\Delta=5,\quad (r_0,r_1,r_2)=(3,1,2).
$$

### Step 1: bit decomposition

$$
5=1+2\cdot0+4\cdot1.
$$

So:

$$
(b_0,b_1,b_2)=(1,0,1).
$$

### Step 2: useful powers

$$
7^2=49\equiv3\pmod{23},
$$

$$
7^3=7\cdot7^2\equiv7\cdot3=21\pmod{23}.
$$

### Step 3: per-bit commitments

$$
C_0=g^1h^3=5\cdot21=105\equiv13.
$$

$$
C_1=g^0h^1=7.
$$

$$
C_2=g^1h^2=5\cdot3=15.
$$

### Step 4: aggregate randomness

$$
r=r_0+2r_1+4r_2=3+2+8=13.
$$

### Step 5: aggregate commitment

$$
C=g^5h^{13}=5^5\cdot7^{13}\pmod{23}.
$$

Compute:

$$
5^2\equiv2,\quad 5^4\equiv4,\quad 5^5\equiv20.
$$

For $7^{13}$:

$$
7^4\equiv9,\quad 7^8\equiv12.
$$

$$
7^{13}=7^8\cdot7^4\cdot7\equiv12\cdot9\cdot7.
$$

$$
12\cdot9=108\equiv16,\quad 16\cdot7=112\equiv20.
$$

Thus:

$$
C\equiv20\cdot20=400\equiv9.
$$

### Step 6: homomorphic relation check

Need:

$$
C\stackrel{?}{=}C_0C_1^2C_2^4.
$$

Compute:

$$
C_1^2=7^2\equiv3.
$$

$$
C_2^2=15^2=225\equiv18\equiv-5.
$$

$$
C_2^4\equiv(-5)^2=25\equiv2.
$$

Then:

$$
C_0C_1^2C_2^4=13\cdot3\cdot2=78\equiv9.
$$

Matches $C=9$।

---

## 11.13 Modular exponentiation: compute $7^{11}\bmod23$

### Step 1: exponent binary

$$
11=8+2+1.
$$

### Step 2: powers

$$
7^1\equiv7.
$$

$$
7^2=49\equiv3.
$$

$$
7^4\equiv3^2=9.
$$

$$
7^8\equiv9^2=81\equiv12.
$$

### Step 3: combine

$$
7^{11}=7^8\cdot7^2\cdot7^1\equiv12\cdot3\cdot7.
$$

$$
12\cdot3=36\equiv13.
$$

$$
13\cdot7=91\equiv22.
$$

### Final

$$
\boxed{7^{11}\equiv22\pmod{23}}
$$

---

## 11.14 OR-proof verification for bit $b_1$

### Given

$$
C_1=7, g=5, h=7, p=23, q=22.
$$

Commitments:

$$
(a_0,a_1)=(17,1).
$$

Challenge:

$$
c=9.
$$

Response:

$$
(c_0,c_1,s_0,s_1)=(6,3,11,4).
$$

### Check 1: challenge split

$$
c_0+c_1=6+3=9\equiv c\pmod{22}.
$$

Pass।

### Check 2: compute $g^{-1}$

Need inverse of 5 mod 23। Try 14:

$$
5\cdot14=70=3\cdot23+1.
$$

So:

$$
g^{-1}\equiv14.
$$

Then:

$$
C_1g^{-1}=7\cdot14=98\equiv6\pmod{23}.
$$

### Check 3: branch 0
Need:

$$
h^{s_0}\stackrel{?}{=}a_0C_1^{c_0}\pmod{23}.
$$

Left:

$$
h^{s_0}=7^{11}\equiv22.
$$

Right:

$$
C_1^{c_0}=7^6=7^4\cdot7^2\equiv9\cdot3=27\equiv4.
$$

$$
a_0C_1^{c_0}=17\cdot4=68\equiv22.
$$

Pass।

### Check 4: branch 1
Need:

$$
h^{s_1}\stackrel{?}{=}a_1(C_1g^{-1})^{c_1}\pmod{23}.
$$

Left:

$$
h^{s_1}=7^4\equiv9.
$$

Right:

$$
1\cdot6^3=216\equiv9\pmod{23}.
$$

Pass।

### Conclusion
Both OR branches verify; bit proof accepted। Verifier convinced $b_1\in\{0,1\}$, কিন্তু value শেখে না।

---

## 11.15 Modular inverse by Extended Euclidean Algorithm: $5^{-1}\bmod23$

### Forward phase

$$
23=4\cdot5+3.
$$

$$
5=1\cdot3+2.
$$

$$
3=1\cdot2+1.
$$

So gcd is 1।

### Back-substitution

$$
1=3-1\cdot2.
$$

But:

$$
2=5-1\cdot3.
$$

So:

$$
1=3-(5-3)=2\cdot3-5.
$$

But:

$$
3=23-4\cdot5.
$$

So:

$$
1=2(23-4\cdot5)-5=2\cdot23-9\cdot5.
$$

Thus:

$$
-9\cdot5\equiv1\pmod{23}.
$$

Therefore:

$$
5^{-1}\equiv-9\equiv14\pmod{23}.
$$

Check:

$$
5\cdot14=70\equiv1\pmod{23}.
$$

---

# Final revision checklist

- [ ] ERM derivation: expected risk থেকে empirical average।
- [ ] FGSM formula and gradient-sign reasoning।
- [ ] Interval arithmetic rules and ReLU network example $[-1,4]$।
- [ ] Lipschitz composition, robustness margin $2\epsilon L_f$, spectral normalisation proof।
- [ ] Randomised smoothing radius formula।
- [ ] Logistic model extraction via inverse sigmoid and linear solve।
- [ ] LTL formulas for MiniPacman, CartPole, Gridworld।
- [ ] FedAvg and FedProx numeric examples।
- [ ] Scaling, Byzantine, Sybil, gradient inversion, membership inference, free-riding examples।
- [ ] Robust aggregation: median, trimmed mean, Krum intuition।
- [ ] DP clipping/noise and secure aggregation mask cancellation।
- [ ] Additive/Shamir sharing, Lagrange interpolation, Beaver triples।
- [ ] Schnorr proof verification and R1CS example।
- [ ] RSA, DGHV, CKKS dot-product FHE examples।
- [ ] DP sensitivity, Laplace/Gaussian mechanisms, randomised response, DP-SGD, DP-FedAvg।
- [ ] Revision ZK range-proof arithmetic: commitments, modular exponentiation, inverse, OR-proof checks।

