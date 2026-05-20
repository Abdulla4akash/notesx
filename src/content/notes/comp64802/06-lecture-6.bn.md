---
subject: COMP64802
chapter: 6
title: "Lecture 6"
language: bn
---

# COMP 64802 লেকচার ৬ — উচ্চ-মাত্রিক ডেটা, মাত্রা হ্রাস, এবং PCA

**বিষয় ও পরিসর:** এই লেকচারে ব্যাখ্যা করা হয়েছে কেন আধুনিক মেশিন লার্নিংয়ের অনেক ডেটাসেট উচ্চ-মাত্রিক হয়, কেন এতে **curse of dimensionality** সমস্যা তৈরি হয়, এবং কীভাবে **dimensionality reduction**—বিশেষ করে **Principal Component Analysis (PCA)**—ভিজ্যুয়ালাইজেশন, কমপ্রেশন এবং রিপ্রেজেন্টেশন সমস্যার সমাধানে ব্যবহৃত হয়। PCA বোঝার জন্য প্রয়োজনীয় লিনিয়ার অ্যালজেব্রার বিষয়গুলোও রিফ্রেশ করা হয়েছে: covariance matrix, eigenvalue/eigenvector, singular value, এবং SVD।

**কোর্স প্রসঙ্গ:** COMP 64802, *Advanced Topics in Machine Learning*, Lecture 6, Dr Omar Rivasplata, University of Manchester, 18/3/2026।

**সোর্স নোট:** এই কথোপকথনে লেকচারের transcript দেওয়া হয়নি। তাই এই নোটগুলো আপলোড করা Lecture 6 slides-এর ওপর ভিত্তি করে তৈরি। transcript-নির্ভর ফাঁক বা সন্দেহজনক জায়গা **[UNCLEAR]** দিয়ে চিহ্নিত করা হয়েছে।

---

## 1. লেকচারের রোডম্যাপ এবং Intended Learning Outcomes

### 1.1 আজকের আলোচ্য বিষয়

লেকচারে কভার করা হয়েছে:

- high-dimensional data;
- curse of dimensionality;
- dimensionality reduction-এর ভূমিকা;
- Principal Component Analysis (PCA)।

### 1.2 লেকচারের গঠন

লেকচারটি দুইটি প্রধান অংশে ভাগ করা।

#### ভূমিকা — আনুমানিক ২৫ মিনিট

ভূমিকায় আলোচনা করা হয়েছে:

- high-dimensional data;
- curse of dimensionality;
- dimensionality reduction-এর motivation;
- representation learning একটি বড় ধারণা হিসেবে।

#### PCA — আনুমানিক ৪০ মিনিট

প্রধান টেকনিক্যাল অংশে আলোচনা করা হয়েছে:

- কম-মাত্রিক linear structure খোঁজার পদ্ধতি হিসেবে PCA;
- ডেটা centring;
- সর্বাধিক projected variance-এর direction হিসেবে principal components;
- reconstruction error minimisation;
- sequential PCA;
- covariance matrix দিয়ে PCA;
- SVD দিয়ে PCA;
- explained variance;
- PCA-এর applications এবং limitations।

### 1.3 Intended Learning Outcomes

লেকচার শেষে শিক্ষার্থীদের উচিত:

- আধুনিক machine learning-এ ব্যবহৃত অনেক ধরনের ডেটার high-dimensional nature বোঝা;
- dimensionality reduction পদ্ধতির motivation হিসেবে curse of dimensionality বোঝা;
- dimensionality reduction এবং broader representation learning-এর basic ideas বোঝা;
- Principal Component Analysis সম্পর্কে working familiarity অর্জন করা;
- সংশ্লিষ্ট linear algebra topic যেমন eigenvalues, singular values, এবং Singular Value Decomposition রিফ্রেশ করা।

---

## 2. High-dimensional data

### 2.1 Key concept: high-dimensional data

#### Intuition

কোনো dataset high-dimensional হয় যখন প্রতিটি data point অনেকগুলো measurement, feature, coordinate, বা variable দিয়ে বর্ণিত হয়। Machine learning-এ এটি খুব সাধারণ, কারণ raw data অনেক সময় rich উৎস থেকে আসে: images, genomes, user histories, sensor readings, অথবা text embeddings।

#### Slides থেকে formal-ish definition

High-dimensional data হলো এমন datasets যেখানে প্রতিটি observation, বা data point, খুব বড় সংখ্যক features, variables, বা coordinates-এর values নিয়ে গঠিত।

PCA অংশে ব্যবহৃত notation অনুযায়ী:

$$
x_i \in \mathbb{R}^d
$$

যেখানে:

- $x_i$ হলো $i$-তম data point;
- $d$ হলো features-এর সংখ্যা;
- “high-dimensional” বলতে বোঝায় $d$ বড়।

### 2.2 High-dimensional data-এর উদাহরণ

#### Example 1: High-resolution images

Images high-dimensional কারণ প্রতিটি image-এ অনেক pixel থাকে, এবং প্রতিটি pixel-এ একাধিক colour channel থাকতে পারে।

Slides-এ high-resolution images সম্পর্কে বলা হয়েছে:

- শত শত বা হাজার হাজার pixels;
- প্রতিটি pixel-এ 3 colour channels: Red, Green, Blue;
- প্রতিটি channel-এ 256 possible values, 0 থেকে 255।

তাই একটি তুলনামূলক ছোট RGB image-ও অনেক coordinates নিয়ে গঠিত। একটি raw image-কে pixel-channel values-এর একটি vector হিসেবে ধরা যায়।

#### Example 2: Genomics data

Genomics data high-dimensional কারণ biological sequences এবং genetic measurements অনেক coordinates জড়িত করে।

Slides-এর উদাহরণ:

- মানুষের genomics data-তে 3.2 billion-এর বেশি base pairs;
- প্রায় 20,000 genes।

এটি dimensionality reduction-এর motivation দেয়, কারণ পুরো raw genetic information সরাসরি analyse করা computationally কঠিন এবং statistically inefficient হতে পারে।

#### Example 3: Customer purchase data

Customer purchase এবং recommendation-system data-তে থাকতে পারে:

- শত শত বা হাজার হাজার features;
- e-commerce activity;
- behavioural signals;
- recommendation-system variables।

একজন customer-কে purchases, clicks, categories, ratings, browsing behaviour, time features ইত্যাদি দিয়ে represent করা যেতে পারে।

---

## 3. The curse of dimensionality

### 3.1 Key concept: curse of dimensionality

#### Intuition

Dimension-এর সংখ্যা বাড়লে space খুব দ্রুত বিশাল হয়ে যায়। Low dimensions-এ data points ঘন মনে হলেও high dimensions-এ সেগুলো sparse হয়ে যায়। ফলে input space পর্যাপ্তভাবে cover করতে অনেক বেশি examples লাগে।

#### Slides থেকে formal-ish definition

Features বা dimensions-এর সংখ্যা বাড়ার সঙ্গে সঙ্গে space-এর volume exponentially বৃদ্ধি পায়।

Slide-এ উদাহরণ দেওয়া হয়েছে, একটি point খোঁজার সমস্যা:

- length 2-এর interval;
- side length 2-এর square box;
- side length 2-এর 3-dimensional cube;
- side length 2-এর $d$-dimensional cube, যেখানে $d$ খুব বড়।

Side length 2-এর $d$-dimensional cube-এর volume:

$$
2^d
$$

অতএব volume $d$-এর সাথে exponentially বাড়ে। এই কারণেই high-dimensional space খুব দ্রুত অনেক বড় হয়ে যায়।

### 3.2 Key takeaways

Slides-এ তিনটি প্রধান takeaway দেওয়া হয়েছে:

1. **“dense data” পেতে sample complexity $d$-তে exponential।**  
   High-dimensional space ভালোভাবে cover করতে প্রয়োজনীয় data point-এর সংখ্যা অত্যন্ত দ্রুত বাড়ে।

2. **High dimensions-এ sufficient data coverage পাওয়া কঠিন।**  
   বড় dataset-ও সম্পূর্ণ high-dimensional space-এর তুলনায় sparse হতে পারে।

3. **Data অনেক সময় lower-dimensional subspace-এ থাকে।**  
   PCA-এর মতো methods-এর পেছনের motivating assumption হলো: data $\mathbb{R}^d$-তে record করা হলেও meaningful variation অনেক কম সংখ্যক directions-এ concentrated থাকতে পারে।

---

## 4. Dimensionality reduction

### 4.1 Key concept: dimensionality reduction

#### Intuition

Dimensionality reduction উচ্চ-মাত্রিক representation-কে কম-মাত্রিক representation দিয়ে replace করার চেষ্টা করে, কিন্তু গুরুত্বপূর্ণ information যতটা সম্ভব ধরে রাখে।

সব $d$ original features নিয়ে কাজ করার বদলে আমরা ছোট সংখ্যা $k$ চাই, সাধারণত:

$$
k \ll d
$$

লক্ষ্য random feature ফেলে দেওয়া নয়। লক্ষ্য হলো essential structure ধরে রাখা।

#### Slides থেকে formal-ish definition

Dimensionality reduction মানে dataset-এর input variables, বা features, সংখ্যা কমানো, while retaining essential information।

### 4.2 Dimensionality reduction কেন ব্যবহার করা হয়?

Slides-এ তিনটি প্রধান motivation দেওয়া হয়েছে:

#### 4.2.1 Data visualisation

মানুষ 2D এবং কখনও 3D data সহজে visualise করতে পারে। $d > 3$ হলে সরাসরি visualisation কঠিন।

Dimensionality reduction high-dimensional data-কে 2D বা 3D-তে map করতে পারে, গুরুত্বপূর্ণ structure যতটা সম্ভব ধরে রাখার চেষ্টা করে।

#### 4.2.2 Data compression and noise reduction

কম-মাত্রিক representation বেশি compact হতে পারে।

যদি গুরুত্বপূর্ণ structure অল্প কয়েকটি direction-এ থাকে এবং noise বাকি directions-এ থাকে, তাহলে dimensionality reduction noise filter হিসেবেও কাজ করতে পারে।

#### 4.2.3 Compute cost কমানো এবং performance উন্নত করা

অনেক algorithm-এর computational cost dimension বাড়লে বাড়ে। Feature dimension কমালে computation কমতে পারে এবং কখনও downstream model performance উন্নত হতে পারে।

### 4.3 Mentioned algorithms

#### Linear dimensionality reduction

Slides-এ উল্লেখ আছে:

- PCA — Principal Component Analysis;
- ICA — Independent Component Analysis;
- CCA — Canonical Correlation Analysis।

#### Non-linear dimensionality reduction

Slides-এ উল্লেখ আছে:

- Kernel PCA;
- t-SNE;
- UMAP;
- ISOMAP;
- LLE;
- MDS।

---

## 5. Representation learning

### 5.1 Key concept: representation learning

#### Intuition

Representation learning dimensionality reduction-এর চেয়ে broad ধারণা। এটি manually features design না করে automatically useful features শেখার বিষয়।

Representation lower-dimensional হতে পারে, কিন্তু হতে বাধ্য নয়। মূল ধারণা হলো system task-এর জন্য useful features শেখে।

#### Slides থেকে formal-ish definition

Representation learning হলো machine-learning techniques যা system-কে কোনো task-এর জন্য প্রয়োজনীয় representations, বা features, automatically discover করতে দেয়।

### 5.2 দেওয়া উদাহরণ

Slides-এ তালিকাভুক্ত:

- dimensionality reduction এবং manifold learning algorithms;
- autoencoders;
- Transformers এবং অন্যান্য neural-network-based models;
- contrastive learning;
- অন্যান্য self-supervised learning techniques।

### 5.3 গুরুত্বপূর্ণ distinction

Representation learning dimensionality reduction-কে অন্তর্ভুক্ত করে, কিন্তু dimensionality reduction-এর চেয়ে broader।

অতএব:

$$
\text{Dimensionality reduction} \subset \text{Representation learning}
$$

---

## 6. PCA motivation: data visualisation problem

### 6.1 Worked example: blood and urine measurements

Slides-এ একটি উদাহরণ দেওয়া হয়েছে:

- 65 জন মানুষ;
- 53 features;
- blood এবং urine samples থেকে নেওয়া measurements।

কেন্দ্রীয় প্রশ্ন:

> Measurements কীভাবে visualise করা যাবে?

মূল point হলো data matrix সরাসরি human interpretation-এর জন্য খুব high-dimensional।

### 6.2 Matrix format: $65 \times 53$

Data একটি matrix হিসেবে দেখানো যায়:

$$
65 \times 53
$$

যেখানে:

- প্রতিটি row একজন person, বা instance;
- প্রতিটি column একটি feature, বা measurement।

সমস্যা: raw matrix format-এ features-এর মধ্যে correlations দেখা কঠিন।

### 6.3 Plot format: 65 curves, একজনের জন্য একটি curve

আরেকটি চেষ্টা হলো প্রতিটি person-এর জন্য একটি curve plot করা।

সমস্যা: এতে 65টি curve তৈরি হয়, ফলে different patients compare করা কঠিন।

### 6.4 Plot format: 53 curves, প্রতিটি feature-এর জন্য একটি curve

আরেকটি চেষ্টা হলো প্রতিটি feature-এর জন্য একটি curve plot করা।

সমস্যা: এতে features-এর মধ্যে correlations দেখা কঠিন।

### 6.5 2D এবং 3D subspaces-এ projection

Slides-এ bivariate এবং trivariate plots দেখানো হয়েছে।

সমস্যা:

- 2D projections একসঙ্গে মাত্র দুটি variables দেখায়;
- 3D projections একসঙ্গে মাত্র তিনটি variables দেখায়;
- 4 বা তার বেশি dimensions-এ visualisation কঠিন হয়ে যায়।

এটি গুরুত্বপূর্ণ প্রশ্ন তৈরি করে:

$$
\text{অন্যান্য variables কীভাবে visualise করা যাবে?}
$$

### 6.6 PCA-এর motivating questions

Slides-এ প্রশ্নগুলো করা হয়েছে:

- Default coordinate axes-এর চেয়ে ভালো representation আছে কি?
- সব 53 dimensions দেখানো কি সত্যিই necessary?
- Features-এর মধ্যে strong correlations থাকলে কী হবে?
- 53-dimensional space-এর সবচেয়ে ছোট subspace কীভাবে পাওয়া যাবে যা original data সম্পর্কে সবচেয়ে বেশি information ধরে রাখে?

এই প্রশ্নগুলো সরাসরি PCA-এর দিকে নিয়ে যায়।

---

## 7. PCA basic setting

### 7.1 Key concept: Principal Component Analysis

#### Intuition

PCA data-এর জন্য নতুন axes খুঁজে বের করে। এই axes এমনভাবে বেছে নেওয়া হয় যাতে first axis যতটা সম্ভব variance capture করে, second axis remaining variance যতটা সম্ভব capture করে, এবং এভাবে চলতে থাকে।

লক্ষ্য হলো high-dimensional data-কে একটি lower-dimensional linear subspace-এ represent করা, যতটা সম্ভব data variation ধরে রেখে।

### 7.2 Slides থেকে formal setup

আমাদের আছে:

- $N$ data points;
- প্রতিটি data point একটি feature vector:

$$
x \in \mathbb{R}^d
$$

- default data space:

$$
\mathbb{R}^d
$$

যেখানে $d$ খুব বড় হতে পারে।

### 7.3 PCA-এর main assumption

Slides-এ PCA-এর central assumption দেওয়া হয়েছে:

> এই data points দ্বারা দেওয়া information-এর বেশিরভাগ মূলত $\mathbb{R}^d$-এর একটি $k$-dimensional linear subspace-এর মধ্যে থাকে।

অর্থাৎ, যদিও:

$$
x_i \in \mathbb{R}^d
$$

data একটি ছোট linear subspace-এর মধ্যে ভালোভাবে approximate করা যায়:

$$
\mathcal{S} \subset \mathbb{R}^d,
\qquad
\dim(\mathcal{S}) = k,
\qquad
k \ll d
$$

### 7.4 PCA-এর goals

Slides-এ তিনটি PCA goal দেওয়া হয়েছে:

1. সেই $k$-dimensional linear subspace খুঁজে বের করা।
2. সেই subspace-এর জন্য একটি suitable basis, বা axes, identify করা।
3. প্রতিটি data point সেই subspace-এ project করা।

---

## 8. Centring the data

### 8.1 Key concept: centred data

#### Intuition

PCA dataset-এর centre-এর চারপাশে variation-এর directions খোঁজে। তাই PCA প্রয়োগের আগে data centre করা উচিত।

Centring মানে প্রতিটি data point থেকে sample mean subtract করা, যাতে dataset-এর mean zero হয়।

### 8.2 Formal definition

Data points দেওয়া আছে:

$$
x_1, \dots, x_N \in \mathbb{R}^d
$$

sample mean হলো:

$$
\hat{\mu}
:=
\frac{1}{N}
\sum_{i=1}^{N} x_i
$$

Centred-data assumption:

$$
\hat{\mu} = 0
$$

যদি data centred না হয়, অর্থাৎ:

$$
\hat{\mu} \neq 0,
$$

তাহলে mean subtract করে data recentre করা হয়:

$$
\tilde{x}_i = x_i - \hat{\mu}
$$

Slides-এ বলা হয়েছে sample mean হলো dataset-এর centre of mass এবং PCA যে coordinate system খুঁজে পায় তার origin।

### 8.3 Visual interpretation

**“Noncentred and centred”** visual slide-এ একই point cloud mean subtract করার আগে এবং পরে দেখানো হয়েছে। Centring-এর আগে cloud origin থেকে সরানো থাকে। Centring-এর পরে cloud এমনভাবে shift করা হয় যাতে এর centre of mass origin-এ থাকে।

---

## 9. PCA as variance maximisation

### 9.1 Direction that captures most variance

Slides-এ 2D scatter plot দেখানো হয়েছে যেখানে data একটি diagonal direction বরাবর elongated। PCA-এর first principal component হলো সেই direction যেখানে data project করলে projected variance সর্বাধিক হয়।

#### Intuition

Data cloud যদি কোনো এক direction-এ stretched থাকে, সেই direction-এ project করলে structure-এর বড় অংশ ধরে রাখা যায়। Spread-এর perpendicular direction-এ project করলে variation-এর বড় অংশ collapse হয়ে যায়।

### 9.2 First principal component

First principal component vector $v_1$ হলো সেই unit vector যা projections-এর variance maximize করে:

$$
v_1
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

যেখানে:

- $v$ হলো candidate direction;
- $\|v\|=1$ unit length enforce করে;
- $v^\top x_i$ হলো $v$-এর ওপর $x_i$-এর scalar projection;
- $(v^\top x_i)^2$ squared projected magnitude মাপে;
- $i$-এর ওপর average centered data-এর projected variance দেয়।

### 9.3 PCA as reconstruction error minimisation

একই first principal component reconstruction error minimize করেও পাওয়া যায়:

$$
v_1
=
\arg\min_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
\left\|
x_i - (v^\top x_i)v
\right\|^2
$$

এখানে:

- $(v^\top x_i)v$ হলো $v$-এর span করা one-dimensional subspace-এ project করার পর $x_i$-এর reconstruction;
- $x_i - (v^\top x_i)v$ হলো residual error;
- objective average squared reconstruction error minimize করে।

### 9.4 দুই objective-এর equivalence

Slides-এ claim দেওয়া হয়েছে:

> Variance maximisation objective এবং reconstruction error minimisation objective equivalent; এগুলো একই solution দেয়।

Slide-এর objective ব্যবহার করে algebra:

$$
\left\|
x_i - (v^\top x_i)v
\right\|^2
=
\left(
x_i - (v^\top x_i)v
\right)^\top
\left(
x_i - (v^\top x_i)v
\right)
$$

Expand করলে:

$$
=
x_i^\top x_i
-
2(v^\top x_i)(x_i^\top v)
+
(v^\top x_i)^2(v^\top v)
$$

যেহেতু:

$$
x_i^\top v = v^\top x_i
$$

এবং:

$$
\|v\| = 1
\quad \Rightarrow \quad
v^\top v = 1
$$

তাই:

$$
=
\|x_i\|^2
-
2(v^\top x_i)^2
+
(v^\top x_i)^2
$$

অতএব:

$$
\left\|
x_i - (v^\top x_i)v
\right\|^2
=
\|x_i\|^2
-
(v^\top x_i)^2
$$

সব data point-এর ওপর average নিলে:

$$
\frac{1}{N}
\sum_{i=1}^{N}
\left\|
x_i - (v^\top x_i)v
\right\|^2
=
\frac{1}{N}
\sum_{i=1}^{N}
\|x_i\|^2
-
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

প্রথম term:

$$
\frac{1}{N}
\sum_{i=1}^{N}
\|x_i\|^2
$$

$v$-এর ওপর depend করে না। তাই reconstruction error minimize করা equivalent:

$$
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

maximize করার সঙ্গে, যা variance maximisation objective।

---

## 10. Second এবং $k$-th principal components

### 10.1 Second principal component

$v_1$ পাওয়া হয়ে গেলে, second principal component $v_2$ পাওয়া হয় $v_1$ দিয়ে explained অংশ সরানোর পর leftover residuals-এর ওপর একই variance-maximisation idea প্রয়োগ করে।

Slide-এ দেওয়া আছে:

$$
v_2
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
\left(
v^\top
\left(
x_i - (v_1^\top x_i)v_1
\right)
\right)^2
$$

এখানে:

$$
x_i - (v_1^\top x_i)v_1
$$

হলো $v_1$-এর span-এ project করার পর $x_i$-এর residual।

### 10.2 General $k$-th principal component

$k$-th principal component-এর জন্য আগের সব principal components-এর ওপর projections সরানো হয়:

$$
x_i
-
\sum_{j=1}^{k-1}
(v_j^\top x_i)v_j
$$

তারপর $v_k$ বেছে নেওয়া হয় যাতে এই residuals-এর projected variance maximize হয়:

$$
v_k
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
\left(
v^\top
\left(
x_i
-
\sum_{j=1}^{k-1}
(v_j^\top x_i)v_j
\right)
\right)^2
$$

Residuals নেওয়া হয় এই span-এর respect-এ:

$$
v_1,\dots,v_{k-1}
$$

অর্থাৎ $v_k$ খোঁজার সময় PCA data থেকে প্রথম $k-1$ principal directions দ্বারা explained components ইতোমধ্যে সরিয়ে ফেলেছে।

---

## 11. PCA Algorithm I — sequential construction

Centred data points দেওয়া আছে:

$$
x_1,\dots,x_N
$$

principal components sequentially compute করা হয়।

### Step 1: First principal component

$$
v_1
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

### Step 2: $k$-th principal component

দেওয়া আছে:

$$
v_1,\dots,v_{k-1}
$$

compute:

$$
v_k
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
\left(
v^\top
\left(
x_i
-
\sum_{j=1}^{k-1}
(v_j^\top x_i)v_j
\right)
\right)^2
$$

এটি next direction দেয় যা largest remaining variance capture করে।

---

## 12. Data matrix notation

### 12.1 Definition

Data points:

$$
x_1,\dots,x_N \in \mathbb{R}^d
$$

data matrix হলো:

$$
X
=
\begin{pmatrix}
x_1^\top \\
x_2^\top \\
\vdots \\
x_N^\top
\end{pmatrix}
$$

অতএব:

$$
X \in \mathbb{R}^{N \times d}
$$

Slides-এ emphasise করা হয়েছে:

- প্রতিটি data point-এর জন্য একটি row;
- প্রতিটি feature-এর জন্য একটি column;
- $N$ = rows-এর সংখ্যা = data points-এর সংখ্যা;
- $d$ = columns-এর সংখ্যা = features-এর সংখ্যা = data dimension।

এই notation centred বা non-centred data—দুই ক্ষেত্রেই প্রযোজ্য।

---

## 13. Sample covariance matrix

### 13.1 Key concept: sample covariance

#### Intuition

Covariance matrix features একসঙ্গে কীভাবে vary করে তা record করে। PCA-তে এটি বলে কোন directions-এ feature space-এর variance বেশি।

### 13.2 Formal definition

Data points দেওয়া আছে:

$$
x_1,\dots,x_N \in \mathbb{R}^d
$$

sample mean:

$$
\hat{\mu}
=
\frac{1}{N}
\sum_{i=1}^{N}x_i
$$

sample covariance matrix হলো $d \times d$ matrix:

$$
\Sigma
=
\frac{1}{N}
\sum_{i=1}^{N}
(x_i-\hat{\mu})(x_i-\hat{\mu})^\top
$$

$(j,k)$-entry হলো:

$$
\Sigma_{j,k}
=
\frac{1}{N}
\sum_{i=1}^{N}
(x_{i,j}-\hat{\mu}_j)(x_{i,k}-\hat{\mu}_k)
$$

যেখানে:

- $x_{i,j}$ হলো data point $i$-এর feature $j$;
- $\hat{\mu}_j$ হলো sample mean-এর coordinate $j$;
- $\Sigma_{j,k}$ measure করে feature $j$ এবং feature $k$ একসঙ্গে কীভাবে vary করে।

### 13.3 Centred-data simplification

Centred data-এর জন্য:

$$
\hat{\mu}=0
$$

তাই:

$$
\Sigma
=
\frac{1}{N}
\sum_{i=1}^{N}
x_i x_i^\top
$$

Matrix form-এ:

$$
\Sigma
=
\frac{1}{N}
X^\top X
$$

যেখানে $X$ হলো centred data matrix।

---

## 14. Eigenvalues and eigenvectors

### 14.1 Key concept: eigenvalue

#### Slides থেকে formal definition

ধরা যাক $A$ একটি $n \times n$ square matrix, এবং $\lambda$ একটি number।

$$
\lambda
\text{ is an eigenvalue of } A
$$

মানে:

$$
Av = \lambda v
$$

কোনো non-zero vector $v$-এর জন্য।

এই $v$ হলো $\lambda$-এর corresponding eigenvector।

### 14.2 Equivalent formulations

Slides-এ দেওয়া আছে:

$$
Av = \lambda v
$$

if and only if:

$$
(\lambda I - A)v = 0
$$

অতএব, $\lambda$ হলো $A$-এর eigenvalue if and only if:

$$
\ker(\lambda I - A)
$$

nontrivial।

### 14.3 Characteristic polynomial

Classically, $A$-এর eigenvalues হলো এর characteristic polynomial-এর roots:

$$
p_A(\lambda)
=
\det(\lambda I - A)
$$

তাই eigenvalues খুঁজতে solve করতে হয়:

$$
\det(\lambda I - A)=0
$$

---

## 15. Worked example: $2 \times 2$ matrix-এর eigenvalues

Slide-এ pen-and-paper exercise দেওয়া হয়েছে:

$$
A
=
\begin{pmatrix}
4 & 1 \\
2 & 3
\end{pmatrix}
$$

খুঁজতে হবে:

1. eigenvalues;
2. largest eigenvalue-এর corresponding eigenvector।

### 15.1 Characteristic polynomial খুঁজে বের করা

ব্যবহার করি:

$$
p_A(\lambda)
=
\det(\lambda I-A)
$$

প্রথমে compute করি:

$$
\lambda I - A
=
\begin{pmatrix}
\lambda & 0 \\
0 & \lambda
\end{pmatrix}
-
\begin{pmatrix}
4 & 1 \\
2 & 3
\end{pmatrix}
=
\begin{pmatrix}
\lambda-4 & -1 \\
-2 & \lambda-3
\end{pmatrix}
$$

তাহলে:

$$
p_A(\lambda)
=
\det
\begin{pmatrix}
\lambda-4 & -1 \\
-2 & \lambda-3
\end{pmatrix}
$$

$$
=
(\lambda-4)(\lambda-3)-(-1)(-2)
$$

$$
=
(\lambda-4)(\lambda-3)-2
$$

$$
=
\lambda^2 - 7\lambda + 12 - 2
$$

$$
=
\lambda^2 - 7\lambda + 10
$$

Factorise:

$$
\lambda^2 - 7\lambda + 10
=
(\lambda-5)(\lambda-2)
$$

অতএব eigenvalues:

$$
\lambda_1 = 5,
\qquad
\lambda_2 = 2
$$

Largest eigenvalue:

$$
\lambda_1 = 5
$$

### 15.2 $\lambda = 5$-এর eigenvector খুঁজে বের করা

Solve করি:

$$
Av = 5v
$$

Equivalently:

$$
(A-5I)v = 0
$$

Compute:

$$
A-5I
=
\begin{pmatrix}
4 & 1 \\
2 & 3
\end{pmatrix}
-
\begin{pmatrix}
5 & 0 \\
0 & 5
\end{pmatrix}
=
\begin{pmatrix}
-1 & 1 \\
2 & -2
\end{pmatrix}
$$

ধরা যাক:

$$
v =
\begin{pmatrix}
a \\
b
\end{pmatrix}
$$

তাহলে:

$$
\begin{pmatrix}
-1 & 1 \\
2 & -2
\end{pmatrix}
\begin{pmatrix}
a \\
b
\end{pmatrix}
=
\begin{pmatrix}
0 \\
0
\end{pmatrix}
$$

প্রথম row দেয়:

$$
-a+b=0
$$

তাই:

$$
b=a
$$

$a=1$, $b=1$ নিলে একটি eigenvector:

$$
v =
\begin{pmatrix}
1 \\
1
\end{pmatrix}
$$

Check:

$$
A
\begin{pmatrix}
1 \\
1
\end{pmatrix}
=
\begin{pmatrix}
4(1)+1(1) \\
2(1)+3(1)
\end{pmatrix}
=
\begin{pmatrix}
5 \\
5
\end{pmatrix}
=
5
\begin{pmatrix}
1 \\
1
\end{pmatrix}
$$

সুতরাং:

$$
\boxed{
\lambda_{\max}=5,
\qquad
v=
\begin{pmatrix}
1\\
1
\end{pmatrix}
}
$$

---

## 16. PCA via the covariance matrix

### 16.1 Key idea

Slides-এ বলা হয়েছে:

> PCA basis vectors, বা principal component vectors, হলো $\Sigma$-এর eigenvectors, corresponding eigenvalues অনুযায়ী arranged।

অতএব:

$$
\text{$k$-th principal component}
=
\text{$k$-th largest eigenvalue-এর eigenvector}
$$

### 16.2 Covariance eigenvectors কেন আসে

Centred-data covariance matrix ব্যবহার করি:

$$
\Sigma
=
\frac{1}{N}X^\top X
=
\frac{1}{N}
\sum_{i=1}^{N}
x_i x_i^\top
$$

First PCA objective:

$$
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

প্রতিটি term rewrite করা যায়:

$$
(v^\top x_i)^2
=
v^\top x_i x_i^\top v
$$

তাই:

$$
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
=
v^\top
\left(
\frac{1}{N}
\sum_{i=1}^{N}
x_i x_i^\top
\right)
v
$$

অতএব:

$$
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
=
v^\top \Sigma v
$$

PCA সেই unit vector $v$ বেছে নেয় যা maximize করে:

$$
v^\top \Sigma v
$$

Maximising direction হলো $\Sigma$-এর largest eigenvalue-এর corresponding eigenvector। পরবর্তী principal components correspond করে next largest eigenvalues-এর eigenvectors-কে।

### 16.3 PCA Algorithm II — sample covariance দিয়ে

Inputs:

- data points $x_1,\dots,x_N$;
- positive integer $k$।

Steps:

1. Data recentre করো:

$$
x_i \leftarrow x_i - \hat{\mu}
$$

2. Centred data matrix তৈরি করো:

$$
X
=
\begin{pmatrix}
x_1^\top \\
\vdots \\
x_N^\top
\end{pmatrix}
$$

3. Covariance-related matrix compute করো। Covariance slide-এ দেওয়া:

$$
\Sigma = \frac{1}{N}X^\top X
$$

Algorithm slide-এ লেখা:

$$
\Sigma' = X^\top X
$$

4. Eigenvalues এবং eigenvectors compute করো:

$$
(\lambda_i, v_i)
$$

5. এগুলো reorder করো যাতে:

$$
\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_d
$$

6. Top $k$ principal components return করো:

$$
v_1,\dots,v_k
$$

**[UNCLEAR — normalisation]** Covariance definition-এ $\frac{1}{N}X^\top X$ ব্যবহার করা হয়েছে, কিন্তু Algorithm II-তে $\Sigma' = X^\top X$ লেখা। এদের eigenvectors একই, কিন্তু eigenvalues $N$ factor দিয়ে আলাদা। Lecturer scaling কীভাবে handle করেছেন তা recording-এ check করা দরকার।

---

## 17. Singular values and SVD

### 17.1 Key concept: singular values

#### Slides থেকে informal description

ধরা যাক $X$ একটি square বা rectangular matrix যার shape:

$$
n \times d
$$

$X$-এর singular values সংজ্ঞায়িত:

$$
\text{singular values of }X
=
\sqrt{
\text{eigenvalues of }X^\top X
}
$$

তাই যদি:

$$
X^\top X v_i = \lambda_i v_i
$$

তাহলে corresponding singular value:

$$
\sigma_i = \sqrt{\lambda_i}
$$

অথবা equivalently:

$$
\lambda_i = \sigma_i^2
$$

### 17.2 Singular Value Decomposition

Slides-এ SVD লেখা হয়েছে:

$$
X = USV^\top
$$

যেখানে:

- $U$-এর shape $n \times d$, এবং এর columns $\mathbb{R}^n$-এ orthonormal system তৈরি করে;
- $S$ একটি diagonal matrix, shape $d \times d$;
- $V$-এর shape $d \times d$, এবং এর columns $\mathbb{R}^d$-এর orthonormal basis তৈরি করে।

Diagonal matrix:

$$
S =
\operatorname{diag}(\sigma_1,\dots,\sigma_d)
$$

যেখানে:

$$
\sigma_1 \geq \sigma_2 \geq \cdots \geq \sigma_d
$$

Singular values হলো $S$-এর diagonal elements।

### 17.3 PCA interpretation of SVD

Slides-এ বলা হয়েছে:

> $V$-এর columns, equivalently $V^\top$-এর rows, principal components।

সুতরাং centred data matrix-এর SVD থেকে সরাসরি PCA করা যায়।

---

## 18. PCA Algorithm III — SVD দিয়ে

### 18.1 Key idea

PCA basis vectors, বা principal components, হলো centred data matrix $X$-এ SVD প্রয়োগ করে পাওয়া matrix $V$-এর column vectors।

### 18.2 Algorithm

Inputs:

- data points $x_1,\dots,x_N$;
- positive integer $k$।

Steps:

1. Data recentre করো:

$$
x_i \leftarrow x_i - \hat{\mu}
$$

2. Centred data matrix তৈরি করো:

$$
X
=
\begin{pmatrix}
x_1^\top \\
\vdots \\
x_N^\top
\end{pmatrix}
$$

3. SVD compute করো:

$$
X = USV^\top
$$

4. ধরা যাক:

$$
v_1,\dots,v_d
$$

হলো $V$-এর column vectors।

5. Top $k$ principal components return করো:

$$
v_1,\dots,v_k
$$

### 18.3 Eigenvalues এবং singular values-এর relation

Slides-এ বলা হয়েছে:

$$
\lambda_i = \sigma_i^2
$$

**[UNCLEAR — normalisation]** এই relation $X^\top X$-এর eigenvalues-এর জন্য exact। যদি $\lambda_i$ sample covariance matrix $\Sigma = \frac{1}{N}X^\top X$-এর eigenvalues বোঝায়, তাহলে covariance eigenvalues হবে $\frac{\sigma_i^2}{N}$। Slides-এ covariance notation এবং $X^\top X$—দুইটাই ব্যবহার করা হয়েছে, তাই lecturer-এর convention recording-এ check করা দরকার।

---

## 19. Data-তে variance explain করা

### 19.1 Component variance

Slides-এ define করা হয়েছে:

$$
\lambda_k
=
\text{$k$-th principal direction-এ data variance}
$$

তাই কোনো principal component-এর সঙ্গে attached eigenvalue জানায় ঐ direction কত variance capture করে।

### 19.2 Total variance

Total variance:

$$
\lambda_1 + \lambda_2 + \cdots + \lambda_d
$$

### 19.3 Top $k$ principal components দ্বারা captured variance

Top $k$ principal components-এর variance:

$$
\lambda_1 + \cdots + \lambda_k
$$

### 19.4 Explained variance ratio

$k$-th component-এর explained variance ratio:

$$
\mathrm{EVR}_k
=
\frac{\lambda_k}
{\lambda_1+\lambda_2+\cdots+\lambda_d}
$$

### 19.5 Cumulative explained variance

First $k$ principal components-এর cumulative explained variance হলো first $k$ explained variance ratios-এর sum:

$$
\sum_{j=1}^{k}
\mathrm{EVR}_j
$$

Equivalently:

$$
\frac{
\lambda_1+\cdots+\lambda_k
}{
\lambda_1+\cdots+\lambda_d
}
$$

---

## 20. Worked example: explained variance

Slide-এ দেওয়া:

$$
\lambda_1 = 50,
\qquad
\lambda_2 = 20,
\qquad
\lambda_3 = 10
$$

প্রশ্ন:

> প্রথম দুইটি principal components total variance-এর কত percentage explain করে?

### 20.1 Total variance

$$
\lambda_1+\lambda_2+\lambda_3
=
50+20+10
=
80
$$

### 20.2 First two PCs দ্বারা explained variance

$$
\lambda_1+\lambda_2
=
50+20
=
70
$$

### 20.3 Percentage explained

$$
\frac{70}{80}
=
0.875
$$

$$
0.875 \times 100
=
87.5\%
$$

তাই প্রথম দুইটি principal components explain করে:

$$
\boxed{87.5\%}
$$

total variance-এর।

---

## 21. Worked visual example: variance maximisation vs reconstruction error

**“PCA – Variance Maximisation and Error Minimisation”** slide-এ একই dataset-এর জন্য দুইটি projection, Option A এবং Option B, দেখানো হয়েছে। প্রশ্ন করা হয়েছে:

- কোনটি variance maximize করে?
- কোনটি reconstruction error minimize করে?

**[UNCLEAR — transcript missing]** Slide-এ উত্তর লেখা নেই। Visual geometry থেকে **Option B** intended answer: এটি data cloud-এর elongated direction-এর সঙ্গে align করে, তাই line বরাবর projected points-এর variation বেশি এবং perpendicular reconstruction errors ছোট।

এটি PCA-এর formal claim-এর সঙ্গে মেলে:

$$
\text{projected variance maximize}
\quad \Longleftrightarrow \quad
\text{reconstruction error minimize}
$$

centred data এবং unit projection directions-এর জন্য।

---

## 22. PCA-এর applications

Slides-এ নিম্নলিখিত applications দেওয়া হয়েছে:

### 22.1 Data visualisation

PCA high-dimensional data-কে কম dimensions-এ, প্রায়ই 2D বা 3D-তে, project করে plotting-এর জন্য ব্যবহার করা যায়।

### 22.2 Image processing and compression

PCA কম components ব্যবহার করে images represent করতে পারে, ফলে storage বা computation কমতে পারে।

### 22.3 Noise filtering and noise reduction

Low-variance directions কখনও noise-এর সঙ্গে সম্পর্কিত হতে পারে, তাই এগুলো বাদ দিলে noise কমতে পারে।

### 22.4 Data preprocessing

PCA অন্য machine-learning methods-এর আগে feature dimension কমানোর preprocessing step হিসেবে ব্যবহার করা যায়।

### 22.5 Common application areas

Slides-এ উল্লেখ আছে:

- computer vision;
- genomics and bioinformatics;
- data analytics;
- finance।

---

## 23. PCA-এর limitations

### 23.1 Linearity restriction

PCA ধরে নেয় data একটি underlying **linear subspace**-এ project করা উচিত।

Slides-এ বলা হয়েছে PCA fail করতে পারে যখন data মূলত **non-linear manifolds**-এ থাকে, যেমন:

- two moons;
- Swiss roll datasets।

#### Intuition

True structure যদি curved হয়, তাহলে flat linear subspace সেটি ভালোভাবে capture করতে নাও পারে।

### 23.2 Variance সবসময় relevance নয়

PCA ধরে নেয় বেশি variance থাকা directions বেশি important।

Slides স্পষ্টভাবে সতর্ক করেছে:

$$
\text{Variance} \neq \text{Relevance}
$$

কিছু ক্ষেত্রে essential information বা distinguishing features low-variance components-এ থাকতে পারে।

#### Intuition

কোনো direction high variance থাকতে পারে, কিন্তু task-এর জন্য irrelevant হতে পারে। আবার low-variance direction গুরুত্বপূর্ণ class-separating information ধারণ করতে পারে।

### 23.3 Orthogonality restriction

PCA principal components-কে orthogonal, বা uncorrelated, হতে বাধ্য করে।

Slides-এ বলা হয়েছে real-world data, যেমন neural signals বা certain genetic traits, এমন underlying features থাকতে পারে যা orthogonal নয়; ফলে PCA unsuitable হতে পারে।

---

## 24. Lecture-এ করা connections

### 24.1 আগের/parallel linear algebra-এর সঙ্গে connection

Lecture স্পষ্টভাবে PCA-কে যুক্ত করেছে:

- eigenvalues;
- eigenvectors;
- singular values;
- Singular Value Decomposition।

এগুলো শুধু side topics নয়। এগুলো principal components compute করার machinery।

### 24.2 Representation learning-এর সঙ্গে connection

Dimensionality reduction-কে broader representation learning-এর অংশ হিসেবে উপস্থাপন করা হয়েছে। PCA হলো নতুন representation শেখার এক পদ্ধতি: নতুন coordinates হলো principal-component coordinates।

### 24.3 Later/nonlinear methods-এর সঙ্গে connection

Lecture-এ nonlinear dimensionality-reduction methods যেমন Kernel PCA, t-SNE, UMAP, ISOMAP, LLE, এবং MDS তালিকাভুক্ত করা হয়েছে। এতে PCA-কে more flexible nonlinear methods-এর আগে linear baseline হিসেবে স্থাপন করা হয়েছে।

### 24.4 Applications-এর সঙ্গে connection

Lecture PCA এবং dimensionality reduction-কে computer vision, genomics, bioinformatics, finance, এবং data analytics-এর মতো practical areas-এর সঙ্গে যুক্ত করেছে।

---

## 25. Exam flags এবং high-value revision points

### 25.1 Explicit exam flags

**[UNCLEAR — transcript missing]** Transcript দেওয়া হয়নি, এবং slides-এ “this will be on the exam,” “you should know this,” বা “common mistake” ধরনের explicit phrase নেই।

### 25.2 Slide-based high-value revision points

এগুলো explicit exam flags নয়, কিন্তু slides থেকে prominent এবং revision-critical হওয়ার সম্ভাবনা বেশি।

#### Motivation জানো

- high-dimensional data;
- curse of dimensionality;
- lower-dimensional subspace assumption;
- response হিসেবে dimensionality reduction।

#### PCA-এর দুই equivalent objectives জানো

$$
v_1
=
\arg\max_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
(v^\top x_i)^2
$$

এবং:

$$
v_1
=
\arg\min_{\|v\|=1}
\frac{1}{N}
\sum_{i=1}^{N}
\left\|
x_i - (v^\top x_i)v
\right\|^2
$$

Slides স্পষ্টভাবে বলেছে এই objectives equivalent।

#### Centring জানো

$$
\hat{\mu}
=
\frac{1}{N}
\sum_{i=1}^{N}x_i
$$

$$
\tilde{x}_i = x_i - \hat{\mu}
$$

PCA sample mean-কে PCA coordinate system-এর origin হিসেবে ব্যবহার করে।

#### Covariance PCA জানো

$$
\Sigma
=
\frac{1}{N}
X^\top X
$$

centred data-এর জন্য, এবং principal components হলো eigenvalues অনুযায়ী ordered eigenvectors।

#### SVD PCA জানো

$$
X = USV^\top
$$

$V$-এর columns হলো principal components।

#### Explained variance জানো

$$
\mathrm{EVR}_k
=
\frac{\lambda_k}
{\lambda_1+\cdots+\lambda_d}
$$

এবং cumulative explained variance:

$$
\frac{\lambda_1+\cdots+\lambda_k}
{\lambda_1+\cdots+\lambda_d}
$$

#### Pen-and-paper exercises practice করো

Slides-এ দুইটি exercise আছে:

1. এই matrix-এর eigenvalues/eigenvectors:

$$
\begin{pmatrix}
4 & 1 \\
2 & 3
\end{pmatrix}
$$

2. explained variance যেখানে:

$$
\lambda_1=50,\quad \lambda_2=20,\quad \lambda_3=10
$$

---

## 26. Recording/transcript-এ check করার মতো unclear sections

### [UNCLEAR 1] Transcript missing

Prompt-এ slides এবং transcript—দুইটাই ব্যবহার করতে বলা হয়েছে, কিন্তু transcript text দেওয়া হয়নি। তাই এই notes capture করতে পারেনি:

- lecturer emphasis;
- spoken derivations;
- exam hints;
- verbally mentioned common mistakes;
- slides-এর বাইরে extra examples;
- slide notation-এর clarifications।

### [UNCLEAR 2] Option A vs Option B projection answer

Slide-এ জিজ্ঞেস করা হয়েছে কোন projection variance maximize এবং reconstruction error minimize করে, কিন্তু answer slide-এ লেখা নেই। Visual থেকে **Option B** বোঝা যায়, কিন্তু recording থেকে confirm করা উচিত।

### [UNCLEAR 3] Covariance normalisation

Sample covariance slide define করে:

$$
\Sigma = \frac{1}{N}X^\top X
$$

centred data-এর জন্য, কিন্তু Algorithm II লেখে:

$$
\Sigma' = X^\top X
$$

এই matrices-এর eigenvectors একই, কিন্তু eigenvalues $N$ factor দিয়ে আলাদা। Lecturer $\lambda_i$ covariance eigenvalues বোঝাতে ব্যবহার করেছেন নাকি $X^\top X$-এর eigenvalues বোঝাতে ব্যবহার করেছেন—recording-এ check করা দরকার।

### [UNCLEAR 4] SVD eigenvalue relation

Slides-এ বলা হয়েছে:

$$
\lambda_i = \sigma_i^2
$$

এটি exact যখন $\lambda_i$ বোঝায় $X^\top X$-এর eigenvalues। যদি $\lambda_i$ sample covariance matrix-এর eigenvalues বোঝায়, তাহলে relation-এ $\frac{1}{N}$ factor থাকবে। Recording-এ notation check করা দরকার।

### [UNCLEAR 5] Derivation depth

Slides বলেছে variance maximisation এবং reconstruction-error minimisation equivalent, কিন্তু full derivation দেখায়নি। উপরে দেওয়া derivation displayed objectives থেকে সরাসরি আসে। Recording-এ lecturer অতিরিক্ত derivation details দিয়েছেন নাকি skip করেছেন তা check করা উচিত।
