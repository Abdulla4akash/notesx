---
subject: COMP64802
chapter: 7
title: "Lecture 7"
language: bn
---

# COMP 64802 — Advanced Topics in Machine Learning
# লেকচার ৭ স্টাডি নোটস: Independent Component Analysis এবং Kernel PCA

**কোর্স:** COMP 64802 — Advanced Topics in Machine Learning  
**লেকচারার:** Dr Omar Rivasplata, University of Manchester  
**লেকচার:** Lecture 7 — Wed 25/3/2026  
**লেকচারের বিষয়:** Independent Component Analysis; Kernel PCA  
**উৎসের অবস্থা:** স্লাইড ডেক পাওয়া গেছে। লেকচার ট্রান্সক্রিপ্ট দেওয়া হয়নি, তাই এই নোটগুলো শুধু স্লাইড-ভিত্তিক। যেখানে কথ্য ব্যাখ্যা দরকার হতে পারে, সেখানে **[UNCLEAR / অস্পষ্ট]** চিহ্ন দেওয়া হয়েছে।

---

## বিষয় ও পরিসর

এই লেকচারে দুটি advanced unsupervised learning / representation-learning পদ্ধতি আলোচনা করা হয়েছে: **Independent Component Analysis (ICA)** এবং **Kernel PCA**। ICA উপস্থাপন করা হয়েছে blind source separation পদ্ধতি হিসেবে, যেখানে observed mixture থেকে independent non-Gaussian source পুনরুদ্ধার করা হয়। Kernel PCA উপস্থাপন করা হয়েছে PCA-এর nonlinear extension হিসেবে, যেখানে kernels, Gram/kernel matrices, feature maps, এবং Hilbert-space embeddings ব্যবহৃত হয়।

লেকচারের গঠন: আনুমানিক **২৫ মিনিট ICA** এবং তারপরে আনুমানিক **৩৫ মিনিট Kernel PCA**।

---

## Intended Learning Outcomes

লেকচার শেষে শেখার লক্ষ্যগুলো হলো:

1. Independent Component Analysis-কে যে **blind source separation problem** motivate করে, সেটি বোঝা।
2. ICA-এর **linear mixing model** এবং **solution method** সম্পর্কে কাজের মতো পরিচিতি পাওয়া।
3. **linear PCA-এর সীমাবদ্ধতা** বোঝা, যা Kernel PCA ব্যবহারের motivation দেয়।
4. **kernel matrix** ব্যবহার করে Kernel PCA-এর setting বোঝা, এবং **Gram matrix**-এর মাধ্যমে linear PCA-এর সঙ্গে এর analogy বোঝা।
5. সংশ্লিষ্ট linear analysis বিষয়গুলো refresh / reinforce করা, যেমন:
   - eigenvalues,
   - singular values,
   - Hilbert spaces,
   - kernels.

---

# Part I — Independent Component Analysis $\mathrm{ICA}$

---

## 1. ICA কী

### Intuition

Independent Component Analysis ব্যবহার করা হয় যখন আমরা underlying signals-এর mixture observe করি এবং original hidden sources recover করতে চাই।

Canonical motivating example হলো **cocktail party problem**:

- কয়েকজন মানুষ একই সময়ে কথা বলছে।
- কয়েকটি microphone সব speaker-এর mixture record করছে।
- প্রতিটি microphone signal একই underlying speaker signals-এর আলাদা mixture।
- কাজ হলো শুধু mixed recordings থেকে individual voices recover করা।

লেকচারে **cocktail party effect**-এর কথাও বলা হয়েছে: noisy party-র মাঝেও অনেক মানুষ one-to-one conversation করতে পারে। কেউ যদি target conversation isolate করতে না পারে, তাহলে তার cocktail party problem আছে।

### স্লাইডের formal-ish definition

ICA হলো একটি **blind source separation technique**, যার লক্ষ্য একটি multivariate signal-কে এমন components-এ decompose করা যা:

- additive,
- statistically independent,
- non-Gaussian.

এই process-কে বলা হয় **unmixing**।

### Core assumption

Underlying source signals সম্পর্কে assumption:

$$
\text{statistically independent}
$$

এবং তাদের থাকতে হবে:

$$
\text{non-Gaussian distributions}.
$$

এই assumption কেন্দ্রীয়। স্লাইডে ICA-কে Gaussian source signals-এর জন্য method হিসেবে উপস্থাপন করা হয়নি।

---

## 2. Audio source separation example

স্লাইডে source separation setup দেখানো হয়েছে, যেখানে আছে:

- hidden বা “blind” source speakers,
- কয়েকটি microphone থেকে recorded mixtures,
- একটি ICA stage, যা original sources estimate করে।

### ICA-এর আগে

Observed microphone signals হলো blind sources থেকে আসা mixed audio signals। প্রতিটি microphone speaker-দের একটি আলাদা mixture receive করে।

### ICA-এর পরে

Original source signals estimate করার জন্য ICA perform করা হয়। স্লাইডের illustration-এ চারটি recorded microphone mixture individual speakers-এর estimated sources-এ transform হতে দেখা যায়।

### Key point

ICA শুধু **mixed signals** থেকেই কাজ করে। Original sources সরাসরি observed নয়, এবং mixing process-ও unknown।

---

## 3. Basic ICA setting: source এবং mixed signals

### Source signals

ধরা যাক $n$টি source signal আছে:

$$
s_1, \ldots, s_n.
$$

এগুলো vector form-এ লেখা হয়:

$$
s =
\begin{pmatrix}
s_1 \\
\vdots \\
s_n
\end{pmatrix}
\in \mathbb{R}^n.
$$

Source signals ICA assumptions satisfy করে:

$$
s_1,\ldots,s_n
\quad\text{are statistically independent and have non-Gaussian distributions.}
$$

### Mixed signals

ধরা যাক $m$টি mixed signal আছে:

$$
x_1, \ldots, x_m.
$$

এগুলো vector form-এ লেখা হয়:

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

শুধু mixed signals observe করা যায়:

$$
x_1, \ldots, x_m.
$$

### Goal

লক্ষ্য হলো source signals estimate করা:

$$
s_1,\ldots,s_n.
$$

এই estimated source signals-গুলোকে **independent components**-ও বলা হয়।

---

## 4. ICA linear mixing model

### Formal model

Mixed signals-কে source signals-এর linear combinations হিসেবে ধরা হয়।

Model:

$$
x = As.
$$

Matrix form:

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

এখানে:

$$
A \in \mathbb{R}^{m \times n}
$$

হলো **mixing matrix**।

### কী observed?

শুধু left-hand side observed:

$$
x.
$$

### কী estimate করতে হবে?

Mixing matrix এবং source signals দুটোই unknown:

$$
A \quad\text{and}\quad s.
$$

তাই ICA-কে শুধু observed mixtures থেকে original source signals estimate করতে হয়।

---

## 5. Whitened source signals

লেকচারে whitened-source condition দেওয়া হয়েছে:

$$
\mathbb{E}[ss^\top] = I.
$$

এর মানে random signal-এর covariance matrix হলো identity matrix।

### স্লাইডে বলা consequences

যদি:

$$
\mathbb{E}[ss^\top] = I,
$$

তাহলে:

- components uncorrelated,
- প্রতিটি component-এর variance 1,
- covariance matrix হলো identity matrix।

স্লাইডে আরও বলা হয়েছে, components statistically independent, তাই uncorrelated।

### Intuition

Whitening-কে একটি **linear change of basis** হিসেবে বর্ণনা করা হয়েছে। এটি signals transform করে যাতে second-order correlations remove হয় এবং components-এর unit variance থাকে।

### [UNCLEAR / অস্পষ্ট]

স্লাইডে লেখা আছে:

$$
\mathbb{E}[ss^\top] = I
$$

এবং এটিকে covariance matrix identity হওয়া হিসেবে বর্ণনা করা হয়েছে। Signal-এর zero mean থাকলে এটি ঠিক covariance matrix। এই জায়গায় lecturer centering / zero mean explicitly assume বা state করেছিলেন কি না, তা confirm করতে transcript দরকার।

---

## 6. ICA solution idea

### Unmixing matrix

ICA এমন একটি **unmixing matrix** $W$ খোঁজে যাতে estimated source vector হয়:

$$
\hat{s} = Wx.
$$

Matrix $W$-এর উদ্দেশ্য হলো $A$-এর কারণে হওয়া mixing undo করা।

### Optimisation objective

Optimisation objective:

$$
\text{Find } W \text{ that maximises the statistical independence of the components of } \hat{s}.
$$

এটাই PCA থেকে মূল পার্থক্য:

- PCA variance maximise করে।
- ICA independence maximise করে।

### Simplifying assumption

পরবর্তী derivation-এর জন্য lecture assume করে:

$$
m = n.
$$

অর্থাৎ observed mixed signals-এর সংখ্যা source signals-এর সংখ্যার সমান।

---

## 7. ICA estimation from data

### Data matrix

Given data points:

$$
x_1, \ldots, x_N \in \mathbb{R}^m,
$$

data matrix হলো:

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

## 8. Unmixing matrix-এর জন্য SVD argument

স্লাইডে unmixing matrix-এর singular value decomposition লেখা হয়েছে:

$$
W = USV^\top.
$$

তাহলে:

$$
WW^\top = USV^\top(USV^\top)^\top.
$$

Transpose expand করলে:

$$
(USV^\top)^\top = VS^\top U^\top.
$$

সুতরাং:

$$
WW^\top = USV^\top VS^\top U^\top.
$$

Orthogonality ব্যবহার করে:

$$
V^\top V = I,
$$

expression হয়:

$$
WW^\top = USS^\top U^\top.
$$

স্লাইডে এটি লেখা হয়েছে:

$$
WW^\top = US^2U^\top.
$$

### Eigenvalue decomposition-এর সঙ্গে comparison

$X^\top X$-এর eigenvalue decomposition দেওয়া হয়েছে:

$$
X^\top X = QDQ^\top.
$$

এরপর স্লাইডে বলা হয়েছে:

$$
X^\top X = WW^\top.
$$

Compare করা হয়:

$$
WW^\top = US^2U^\top
$$

এর সঙ্গে:

$$
X^\top X = QDQ^\top,
$$

ফলে conclusion:

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

তাই unmixing matrix-এর form:

$$
W = QD^{1/2}V^\top.
$$

Remaining task হলো orthogonal matrix estimate করা:

$$
V.
$$

স্লাইডে এই remaining task-কে **projection pursuit** বলা হয়েছে।

### [UNCLEAR / অস্পষ্ট]

Equality:

$$
X^\top X = WW^\top
$$

স্লাইডে stated, কিন্তু visible slide content-এ এটি কেন true তার justification নেই। Missing assumption বা intermediate step recover করতে transcript দরকার।

---

## 9. Non-Gaussianity কীভাবে মাপা যায়

ICA source signals-কে non-Gaussian হতে বলে। লেকচারে non-Gaussianity measure করার উপায় হিসেবে **kurtosis** এবং **excess kurtosis** introduce করা হয়েছে।

---

### 9.1 Kurtosis

Random variable $X$-এর kurtosis:

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

Gaussian variables-এর জন্য:

$$
\kappa = 3.
$$

---

### 9.2 Excess kurtosis

$X$-এর **excess kurtosis**:

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

এটি non-Gaussianity-এর measure হিসেবে ব্যবহার করা যায়।

---

### 9.3 Excess kurtosis দিয়ে classification

#### Mesokurtic

$$
\kappa - 3 = 0.
$$

Interpretation:

- peak এবং tails Gaussian-এর মতো similar।

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

স্লাইডে ICA-এর applications হিসেবে দেওয়া হয়েছে:

- sound signals separate করা,
- EEG data analysis,
- functional MRI data analysis,
- natural scene analysis,
- and more.

---

## 11. ICA limitations

লেকচারে আলোচিত ICA setup-এর নিম্নলিখিত limitations স্লাইডে দেওয়া হয়েছে।

### 11.1 Gaussian sources নয়

ICA-তে Gaussian sources থাকতে পারে না।

এটি core assumption-এর সঙ্গে সরাসরি যুক্ত: source components non-Gaussian হতে হবে।

### 11.2 Nonlinear mixture নয়

আলোচিত model একটি linear mixture assume করে:

$$
x = As.
$$

স্লাইডে বলা হয়েছে, ICA-এর এই form nonlinear mixtures handle করতে পারে না।

### 11.3 Recoverable sources-এর সংখ্যা

স্লাইডে বলা হয়েছে:

> Can only recover as many sources as you have observations.

Notation-এ, যদি $m$টি observed mixed signal থাকে, এই setup $m$-এর বেশি source signal recover করতে পারে না।

### 11.4 Noise-free assumption

আলোচিত model clean mixed signals assume করে, অর্থাৎ noise নেই।

Noisy additive model:

$$
x = As + \epsilon.
$$

স্লাইডে বলা হয়েছে, এই additive-noise version আছে, কিন্তু এর solution-এর জন্য আরও কাজ দরকার।

---

## 12. ICA vs PCA

স্লাইডে PCA এবং ICA explicitly compare করা হয়েছে।

### PCA

PCA-তে:

- primary goal: **dimension reduction**,
- components: **orthogonal directions**,
- optimisation objective: **variance maximisation**,
- data distribution: Gaussian হতে পারে।

### ICA

ICA-তে:

- primary goal: **signal separation**,
- components: **statistically independent components**,
- optimisation objective: **independence maximisation**,
- signal distribution: অবশ্যই non-Gaussian হতে হবে।

### Key conceptual distinction

PCA maximum variance-এর directions খোঁজে। ICA statistically independent components খোঁজে। দুটিই linear transformations ব্যবহার করে, কিন্তু তারা আলাদা criteria optimise করে।

---

# Part II — Kernel PCA

---

## 13. Kernel PCA-এর motivation

Kernel PCA section শুরু হয় এই limitation দিয়ে:

$$
\text{Linear PCA assumes a linear manifold.}
$$

স্লাইডের illustration-এ flat linear plane-এর আশেপাশে data points দেখানো হয়েছে, যার মাধ্যমে বলা হচ্ছে ordinary PCA linear directions বা subspaces fit করে। Data structure nonlinear হলে এটি restrictive হতে পারে।

Kernel PCA data-কে অন্য একটি space-এ embed করে, যেখানে PCA-like operations apply করলে original data space-এর nonlinear structure capture করা যায়।

---

# Linear PCA review

---

## 14. Data matrix

Given data points:

$$
x_1, \ldots, x_N \in \mathbb{R}^d,
$$

data matrix:

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

প্রতিটি data point $X$-এর একটি row হিসেবে stored থাকে।

---

## 15. Sample covariance matrix

Sample covariance matrix:

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

Centred data হলে:

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

## 16. Pen-and-paper exercise: $X^\top X = \sum_i x_i x_i^\top$ দেখানো

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

যেহেতু:

$$
X =
\begin{pmatrix}
x_1^\top \\
x_2^\top \\
\vdots \\
x_N^\top
\end{pmatrix},
$$

আমরা পাই:

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

Blockwise multiplication দিলে:

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

## 17. Sample covariance matrix-এর EVD দিয়ে Linear PCA

### Core idea

PCA basis vectors, অর্থাৎ **principal component vectors**, হলো covariance matrix $\Sigma$-এর eigenvectors। এগুলো corresponding eigenvalues অনুযায়ী সাজানো হয়।

$k$-th principal component হলো:

$$
\text{eigenvector corresponding to the } k\text{-th largest eigenvalue}.
$$

### স্লাইডের algorithm

Inputs:

$$
x_1,\ldots,x_N,
$$

and a positive integer:

$$
k.
$$

Step 1. Data recentre করা:

$$
x_i \leftarrow x_i - \hat{\mu}.
$$

Step 2. Centred data matrix construct করা:

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

Step 4. Eigenvalues এবং eigenvectors compute করা:

$$
(\lambda_i,v_i)
$$

of:

$$
\Sigma'.
$$

Step 5. Reorder করে:

$$
\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_d \geq 0.
$$

Step 6. Top $k$ principal components return করা:

$$
v_1,\ldots,v_k.
$$

### Scaling note

আগে covariance matrix লেখা হয়েছিল:

$$
\Sigma = \frac{1}{N}X^\top X.
$$

Algorithm slide ব্যবহার করে:

$$
\Sigma' = X^\top X.
$$

এটি eigenvalues-কে $N$ factor দিয়ে rescale করে, কিন্তু eigenvectors পরিবর্তন করে না।

---

## 18. Pen-and-paper exercise: $XX^\top$ যে Gram matrix, তা দেখানো

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

$X$-এর $j$-th row হলো:

$$
x_j^\top.
$$

$X^\top$-এর $k$-th column হলো:

$$
x_k.
$$

Therefore, $XX^\top$-এর $(j,k)$-entry হলো:

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

এটাই exactly Gram matrix।

---

## 19. Data matrix-এর SVD দিয়ে Linear PCA

### Core idea

PCA basis vectors বা principal components হলো centred data matrix $X$-এর SVD থেকে পাওয়া matrix $V$-এর column vectors।

### স্লাইডের algorithm

Inputs:

$$
x_1,\ldots,x_N,
$$

and a positive integer:

$$
k.
$$

Step 1. Data recentre করা:

$$
x_i \leftarrow x_i - \hat{\mu}.
$$

Step 2. Centred data matrix construct করা:

$$
X =
\begin{pmatrix}
x_1^\top \\
\vdots \\
x_N^\top
\end{pmatrix}.
$$

Step 3. SVD compute করা:

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

### স্লাইডের definition

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d
$$

with data matrix:

$$
X \in \mathbb{R}^{N \times d},
$$

এক জোড়া singular vectors:

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

### Eigenvectors-এর সঙ্গে connection

স্লাইডে বলা হয়েছে:

$$
v \text{ is an eigenvector of } X^\top X \text{ with eigenvalue } \sigma^2,
$$

and:

$$
u \text{ is an eigenvector of } XX^\top \text{ with eigenvalue } \sigma^2.
$$

#### $v$-এর জন্য derivation

শুরু করি:

$$
Xv = \sigma u.
$$

Left-multiply by $X^\top$:

$$
X^\top Xv = X^\top(\sigma u).
$$

$\sigma$ বের করলে:

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

So $v$ হলো $X^\top X$-এর eigenvector with eigenvalue $\sigma^2$।

#### $u$-এর জন্য derivation

শুরু করি:

$$
X^\top u = \sigma v.
$$

Left-multiply by $X$:

$$
XX^\top u = X(\sigma v).
$$

$\sigma$ বের করলে:

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

So $u$ হলো $XX^\top$-এর eigenvector with eigenvalue $\sigma^2$।

---

### SVD structure

SVD:

$$
X = USV^\top.
$$

স্লাইডে shapes দেওয়া হয়েছে:

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

Diagonal matrix:

$$
S = \operatorname{diag}(\sigma_1,\ldots,\sigma_d),
$$

with shape:

$$
d \times d.
$$

Singular values ordered:

$$
\sigma_1 \geq \sigma_2 \geq \cdots \geq \sigma_d.
$$

স্লাইডে বলা হয়েছে singular values সব positive।

### [UNCLEAR / অস্পষ্ট]

সব singular values positive বলা full-rank setting assume করে। Rank-deficient cases আলোচনা করা হয়েছিল কি না, তা check করতে transcript দরকার।

---

## 21. Gram matrix

### Definition

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d,
$$

Gram matrix:

$$
G =
\begin{pmatrix}
x_1^\top x_1 & x_1^\top x_2 & \cdots & x_1^\top x_N \\
x_2^\top x_1 & x_2^\top x_2 & \cdots & x_2^\top x_N \\
\vdots & \vdots & \ddots & \vdots \\
x_N^\top x_1 & x_N^\top x_2 & \cdots & x_N^\top x_N
\end{pmatrix}.
$$

এর shape:

$$
N \times N,
$$

where $N$ is the number of data points.

### Matrix form

Gram matrix:

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

Data centred না হলে recentre করতে হয়:

$$
\tilde{x}_i \leftarrow x_i - \hat{\mu}.
$$

এটি Gram matrix পরিবর্তন করে।

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

Here:

$$
\mathbf{1}
$$

is the $N \times N$ matrix whose entries are all $1$'s.

Important notation point:

$$
\mathbf{1} \neq I.
$$

অর্থাৎ $\mathbf{1}$ হলো all-ones matrix, identity matrix নয়।

---

## 23. Centred Gram matrix দিয়ে Linear PCA

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d,
$$

স্লাইডের procedure:

1. Gram matrix construct করা:

   

$$
G.
$$

2. Centred Gram matrix construct করা:

   

$$
\tilde{G}.
$$

3. Centred Gram matrix-এ EVD apply করা।

4. Eigenvalues পাওয়া যায়:

   

$$
\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_N \geq 0.
$$

5. Positive integer $k$-এর জন্য top $k$ eigenvalues choose করা।

### স্লাইডের key warning

এই Gram-matrix formulation-এ eigenvectors থাকে:

$$
\mathbb{R}^N,
$$

original data space-এ নয়।

এটি গুরুত্বপূর্ণ, কারণ Kernel PCA-ও সরাসরি $d \times d$ covariance matrix দিয়ে নয়, বরং একটি $N \times N$ matrix দিয়ে কাজ করে।

---

## 24. Example: clusters সহ 2D dataset

স্লাইডে তিনটি visible cluster সহ একটি 2D dataset দেখানো হয়েছে।

### Linear PCA version

Linear PCA slide বলে:

> Linear PCA would find principal components in the data space.

Visual-এ original 2D space-এ principal axes বা contour-like linear structure দেখানো হয়েছে, তারপর PC1 ও PC2-তে projection দেখানো হয়েছে।

Key idea: ordinary PCA original input space-এ linear directions খুঁজে।

### Kernel PCA version

Kernel PCA slide বলে:

> Kernel PCA would embed data space into some other space.

Visual-এ input space-এ clusters-এর চারপাশে nonlinear contour-like structure দেখানো হয়েছে, এবং Kernel PC1 / Kernel PC2 representation দেখানো হয়েছে যেখানে cluster structure transform হয়েছে।

Example-এর point: Kernel PCA nonlinear embedding ব্যবহার করে PCA-like operation করতে পারে।

---

# Kernel PCA, feature maps, and kernels

---

## 25. Feature map example

### Original data space

ধরা যাক original data space:

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

স্লাইডে degree-2 polynomial expansion দেওয়া হয়েছে:

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

এটি একটি nonlinear embedding define করে:

$$
\phi : \mathbb{R}^2 \to \mathbb{R}^6.
$$

---

### Feature space-এ scalar product

দুটি point:

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

feature space-এ scalar product:

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

এটি rewrite করা যায়:

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

### এই feature map থেকে induced kernel

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

Key computational idea: expanded feature space-এর inner product original vectors $x$ এবং $y$ ব্যবহার করেই compute করা যায়।

---

## 26. “Kernel” বলতে কী বোঝায়

### Formal-ish definition

Let $\mathcal{X}$ be a set.

$\mathcal{X}$-এর উপর kernel হলো function:

$$
\kappa : \mathcal{X} \times \mathcal{X} \to \mathbb{R}
$$

যা দুটি property satisfy করে:

1. symmetry,
2. positive semi-definiteness.

---

### Symmetry

Kernel satisfy করতে হবে:

$$
\kappa(x,x') = \kappa(x',x)
$$

for any:

$$
x,x' \in \mathcal{X}.
$$

---

### Positive semi-definiteness

Kernel satisfy করতে হবে:

$$
\sum_{i=1}^{n}
\sum_{j=1}^{n}
c_i c_j \kappa(x_i,x_j)
\geq 0.
$$

এটি hold করতে হবে:

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

## 27. Pen-and-paper exercise: $\kappa(x,y)=(1+x^\top y)^2$ kernel দেখানো

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

Therefore kernel symmetric।

### Positive semi-definiteness

Feature-map example থেকে:

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

এটি squared norm:

$$
=
\left\|
\sum_{i=1}^{n}c_i\phi(x_i)
\right\|^2
\geq 0.
$$

Therefore $\kappa$ positive semi-definite।

So:

$$
\kappa(x,y)=(1+x^\top y)^2
$$

is a kernel.

---

## 28. Feature map থেকে kernel

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

স্লাইডে claim:

$$
\kappa(\cdot,\cdot) \text{ is a kernel.}
$$

Proof-কে “routine calculations” হিসেবে বর্ণনা করা হয়েছে।

### Proof idea

Symmetry আসে inner product-এর symmetry থেকে।

Positive semi-definiteness আসে:

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

### [UNCLEAR / অস্পষ্ট]

স্লাইডে transpose notation ব্যবহার করা হয়েছে:

$$
\phi(x)^\top \phi(y),
$$

যদিও $H$-কে Hilbert space বলা হয়েছে। পরের স্লাইডে Hilbert-space inner product notation ব্যবহার করা হয়েছে:

$$
\langle \phi(x),\phi(y)\rangle_H.
$$

Lecturer finite-dimensional Euclidean notation শুধু intuition-এর জন্য ব্যবহার করছিলেন, নাকি সরাসরি general Hilbert-space setting-এ যাচ্ছিলেন, তা confirm করতে transcript দরকার।

---

## 29. যে কোনো kernel-এর জন্য feature map আছে

স্লাইডে converse direction বলা হয়েছে।

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

স্লাইডে বলা হয়েছে, এই claim prove করা highly nontrivial এবং অনেক কাজ লাগে।

Hilbert space $H$-কে বলা হয়:

$$
\text{Reproducing Kernel Hilbert Space, or RKHS}.
$$

স্লাইডে আরও বলা হয়েছে, RKHS theory cover করতে পুরো একটি course unit লেগে যেতে পারে।

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

kernel matrix:

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

### Feature maps-এর সঙ্গে relationship

যদি feature map $\phi$ known থাকে, স্লাইডে লেখা হয়েছে:

$$
K = \phi(X)\phi(X)^\top.
$$

এটি Gram matrix identity mirror করে:

$$
G = XX^\top.
$$

Difference হলো ordinary dot product:

$$
x_i^\top x_j
$$

replace করা হয় kernel value দিয়ে:

$$
\kappa(x_i,x_j),
$$

যা embedding-এর পরে inner product-এর সঙ্গে correspond করে।

### [UNCLEAR / অস্পষ্ট]

Notation $\phi(X)$ compact। Lecturer এটিকে প্রতিটি data point-এ row-wise $\phi$ apply করার পরে পাওয়া data matrix হিসেবে explicitly define করেছিলেন কি না, তা confirm করতে transcript দরকার।

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

centred kernel matrix:

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

এটি centred Gram matrix formula-এর সরাসরি analogue:

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

## 32. Centred kernel matrix দিয়ে Kernel PCA

স্লাইড অনুযায়ী Kernel PCA procedure নিম্নরূপ।

Given data points:

$$
x_1,\ldots,x_N \in \mathbb{R}^d
$$

and a kernel:

$$
\kappa(\cdot,\cdot)
$$

on $\mathbb{R}^d$:

1. Kernel matrix construct করা:

   

$$
K.
$$

2. Centred kernel matrix construct করা:

   

$$
\tilde{K}.
$$

3. Centred kernel matrix-এ EVD apply করা।

4. Eigenvalues পাওয়া যায়:

   

$$
\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_N \geq 0.
$$

5. Positive integer $k$-এর জন্য top $k$ eigenvalues choose করা।

### Slide warning

স্লাইডে বলা হয়েছে:

> The eigenvectors in this case are in $H$, not in data space.

### [UNCLEAR / অস্পষ্ট]

Centred kernel matrix $\tilde{K}$ একটি $N \times N$ matrix, তাই এর literal eigenvectors হলো $N$-dimensional coefficient vectors। Corresponding principal directions feature / Hilbert space $H$-এ থাকে। Lecturer এই point কীভাবে explain করেছিলেন, তা confirm করতে transcript দরকার।

---

## 33. PCA vs Kernel PCA

Final slide ordinary PCA এবং Kernel PCA compare করে।

### PCA

PCA:

- primary goal: reducing dimension,
- components: data space-এর orthogonal directions,
- method: centred Gram matrix-এর EVD,
- implementation: linear projections.

### Kernel PCA

Kernel PCA:

- primary goal: Hilbert space-এ embedding,
- components: embedding space-এর orthogonal directions,
- method: centred kernel matrix-এর EVD,
- implementation: nonlinear embeddings.

---

# Key concepts glossary

---

## Independent Component Analysis $\mathrm{ICA}$

### Intuition

ICA observed mixed signals থেকে hidden independent source signals recover করে।

### Formal slide definition

ICA হলো blind source separation technique, যা একটি multivariate signal-কে additive, statistically independent, non-Gaussian components-এ decompose করে।

---

## Blind source separation

### Intuition

Original sources hidden থাকে। শুধু তাদের mixtures observed হয়।

### এই লেকচারের formal setting

$$
x = As.
$$

এখানে $x$ observed, আর $A$ এবং $s$ estimate করতে হয়।

---

## Mixing matrix

Matrix:

$$
A
$$

in:

$$
x=As.
$$

এটি source signals-কে observed mixed signals-এ map করে।

---

## Unmixing matrix

Matrix:

$$
W
$$

used to estimate sources by:

$$
\hat{s}=Wx.
$$

ICA এমন $W$ খোঁজে যাতে $\hat{s}$-এর components statistically independent হয়।

---

## Whitening

একটি linear change of basis যাতে:

$$
\mathbb{E}[ss^\top]=I.
$$

Lecture slides অনুযায়ী, এটি identity covariance, uncorrelated components, এবং unit variance components-এর সঙ্গে correspond করে।

---

## Kurtosis

Random variable $X$-এর জন্য:

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

Gaussian variables-এর জন্য:

$$
\kappa=3.
$$

---

## Excess kurtosis

$$
\kappa-3.
$$

লেকচারে এটি non-Gaussianity-এর measure হিসেবে ব্যবহার করা হয়েছে।

---

## Gram matrix

Data points $x_1,\ldots,x_N$-এর জন্য:

$$
G_{jk}=x_j^\top x_k.
$$

Matrix form:

$$
G=XX^\top.
$$

---

## Kernel

Function:

$$
\kappa : \mathcal{X}\times \mathcal{X}\to \mathbb{R}
$$

যা symmetric এবং positive semi-definite:

$$
\sum_{i=1}^{n}
\sum_{j=1}^{n}
c_i c_j \kappa(x_i,x_j)
\geq 0.
$$

---

## Feature map

Mapping:

$$
\phi:\mathcal{X}\to H
$$

into a Hilbert space. যদি:

$$
\kappa(x,y)=\langle \phi(x),\phi(y)\rangle_H,
$$

তাহলে kernel feature space-এর inner products compute করে।

---

## Kernel matrix

Data points $x_1,\ldots,x_N$-এর জন্য:

$$
K_{ij}=\kappa(x_i,x_j).
$$

এটি Gram matrix-এর kernel analogue।

---

## RKHS

একটি **Reproducing Kernel Hilbert Space** হলো kernel $\kappa$-এর associated Hilbert space $H$, যেখানে feature map $\phi$ exists such that:

$$
\kappa(x,y)=\langle \phi(x),\phi(y)\rangle_H.
$$

স্লাইডে বলা হয়েছে, এই existence result prove করা highly nontrivial।

---

# Algorithms to know

---

## স্লাইড থেকে ICA algorithmic skeleton

Given observed mixtures:

$$
x_1,\ldots,x_N \in \mathbb{R}^m,
$$

1. Data matrix form করা:

   

$$
X \in \mathbb{R}^{N\times m}.
$$

2. Unmixing matrix খোঁজা:

   

$$
W.
$$

3. Sources estimate করা:

   

$$
\hat{s}=Wx.
$$

4. $\hat{s}$-এর components-এর statistical independence maximise করার জন্য $W$ choose করা।

5. Slides-এর SVD/eigendecomposition argument অনুযায়ী:

   

$$
W=QD^{1/2}V^\top.
$$

6. Remaining task হলো orthogonal matrix $V$ estimate করা, যাকে projection pursuit বলা হয়েছে।

---

## Covariance EVD দিয়ে Linear PCA

1. Recentre:

   

$$
x_i\leftarrow x_i-\hat{\mu}.
$$

2. Centred data matrix $X$ form করা।

3. Compute:

   

$$
\Sigma'=X^\top X.
$$

4. Eigenpairs compute করা:

   

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

## SVD দিয়ে Linear PCA

1. Data recentre করা।
2. Centred data matrix $X$ form করা।
3. Compute:

   

$$
X=USV^\top.
$$

4. $V$-এর first $k$ columns return করা:

   

$$
v_1,\ldots,v_k.
$$

---

## Centred Gram matrix দিয়ে Linear PCA

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

3. EVD apply করা।
4. Top $k$ eigenvalues choose করা।
5. মনে রাখুন: এখানে eigenvectors $\mathbb{R}^N$-এ থাকে, data space-এ নয়।

---

## Centred kernel matrix দিয়ে Kernel PCA

1. Kernel choose করা:

   

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

4. $\tilde{K}$-এ EVD apply করা।
5. Eigenvalues sort করা:

   

$$
\lambda_1\geq \cdots \geq \lambda_N\geq 0.
$$

6. Top $k$ choose করা।

---

# Worked examples and exercises

---

## Exercise 1: $X^\top X = \sum_i x_i x_i^\top$

Section 16 দেখুন।

Key result:

$$
X^\top X
=
\sum_{i=1}^{N}x_i x_i^\top.
$$

---

## Exercise 2: $XX^\top$ is the Gram matrix

Section 18 দেখুন।

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

Section 27 দেখুন।

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

Received slides-এ explicit “this is on the exam” wording দেখা যায় না।

**[UNCLEAR / অস্পষ্ট]** Lecture transcript দেওয়া হয়নি, তাই spoken exam hints missing থাকতে পারে।

---

## High-value slide-marked exercises

স্লাইডে explicitly তিনটি pen-and-paper exercises mark করা হয়েছে:

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

এগুলো slides-এ exam questions হিসেবে labelled নয়, কিন্তু এগুলো clearly important lecture exercises এবং revision-এ prioritise করা উচিত।

---

## Prioritise করার মতো concepts

Slide emphasis অনুযায়ী নিচের বিষয়গুলো core revision targets:

- Blind source separation হিসেবে ICA।
- ICA linear mixing model:

  

$$
x=As.
$$

- ICA unmixing model:

  

$$
\hat{s}=Wx.
$$

- ICA assumptions:
  - independent sources,
  - non-Gaussian sources,
  - linear mixture,
  - discussed model-এ clean/noiseless mixture.

- Non-Gaussianity-এর measures হিসেবে kurtosis এবং excess kurtosis।
- PCA vs ICA comparison।
- Covariance EVD দিয়ে Linear PCA।
- SVD দিয়ে Linear PCA।
- Gram matrix এবং centred Gram matrix।
- Feature maps এবং kernel trick intuition।
- Kernel definition: symmetry এবং positive semi-definiteness।
- Kernel matrix এবং centred kernel matrix।
- PCA vs Kernel PCA comparison।

---

# Connections across the lecture

---

## ICA, PCA-এর সঙ্গে contrast দিয়ে connected

ICA এবং PCA দুটিই data transform করে, কিন্তু objective আলাদা:

- PCA variance-maximising orthogonal directions খোঁজে।
- ICA statistically independent components খোঁজে।

Distributional assumptions-ও আলাদা:

- PCA Gaussian data-র সঙ্গে কাজ করতে পারে।
- ICA non-Gaussian source signals require করে।

---

## Kernel PCA, Gram matrix-এর মাধ্যমে linear PCA-এর সঙ্গে connected

Linear PCA Gram matrix দিয়ে express করা যায়:

$$
G=XX^\top.
$$

Kernel PCA ordinary dot product entries:

$$
x_i^\top x_j
$$

কে kernel entries দিয়ে replace করে:

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

এটাই Gram matrix দিয়ে linear PCA এবং kernel matrix দিয়ে Kernel PCA-এর মূল analogy।

---

## Kernel PCA, Hilbert spaces-এর সঙ্গে connected

Kernel কোনো Hilbert space-এর inner product-এর সঙ্গে correspond করে:

$$
\kappa(x,y)=\langle \phi(x),\phi(y)\rangle_H.
$$

Kernel PCA explicit feature-space coordinates ব্যবহার না করে kernel evaluations দিয়ে embedded space-এ PCA-like operations perform করে।

---

# Unclear or transcript-dependent sections

নিচের sections fully resolve করতে lecture recording বা transcript দরকার:

1. **Transcript missing.** এই notes slide deck থেকে তৈরি।

2. **ICA SVD step.** Slides state:

   

$$
X^\top X = WW^\top,
$$

   কিন্তু visible slide content এই equality justify করে না।

3. **Whitening and centering.** Slide writes:

   

$$
\mathbb{E}[ss^\top]=I
$$

   and describes it as covariance identity. Zero-mean centering explicitly assumed হয়েছিল কি না, তা confirm করতে transcript দরকার।

4. **SVD rank assumptions.** Slide সব singular values positive বলে। Full rank assumed ছিল কি না, বা rank-deficient cases simplicity-এর জন্য ignored ছিল কি না, তা check করতে transcript দরকার।

5. **Kernel PCA eigenvectors.** Slide বলে eigenvectors $H$-এ থাকে, কিন্তু $N\times N$ kernel matrix-এর EVD $N$-dimensional coefficient vectors দেয়। Associated principal directions $H$-এ থাকে। Lecturer-এর exact explanation জানতে transcript দরকার।

6. **$\phi(X)$ notation.** Slide writes:

   

$$
K=\phi(X)\phi(X)^\top.
$$

   $\phi(X)$ row-wise feature-mapped data matrix হিসেবে explicitly define করা হয়েছিল কি না, transcript clarify করতে পারে।

7. **Slide typos.** Slide deck-এ minor typos আছে, যেমন “Prerform ICA” এবং “Optimisation opbjective.” এগুলোকে “Perform ICA” এবং “Optimisation objective” হিসেবে treat করা হয়েছে।

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

Slides থেকে derived form:

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

Centred data-এর জন্য:

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

Feature map থেকে polynomial kernel:

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

