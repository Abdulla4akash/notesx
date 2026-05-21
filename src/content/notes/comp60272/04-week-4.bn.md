---
subject: COMP60272
chapter: 4
title: "Week 4"
language: bn
---

# COMP60272 — AI-এর নিরাপত্তা ও গোপনীয়তা: Week 4 কাঠামোবদ্ধ স্টাডি নোটস

**বিষয় ও পরিসর:** Week 4 আগের **integrity attacks/defences** থেকে সরে এসে **AI সিস্টেমের ওপর privacy attacks** নিয়ে আলোচনা করে। এখানে দুইটি প্রধান attack family হলো **model extraction/model stealing** এবং **membership inference**; এরপর sampling ও inference attack বাস্তবায়নের ওপর একটি code tutorial আছে।

**উৎস-নোট:** আপলোড করা zip ফাইলে slide PDF এবং ৪-পৃষ্ঠার lecture-notes PDF আছে। এতে আলাদা auto-generated transcript file নেই। তাই এই নোটস slides এবং লিখিত lecture notes ব্যবহার করে তৈরি। যেসব অংশে lecturer-এর মৌখিক ব্যাখ্যা পরিষ্কার করার জন্য অনুপস্থিত transcript দরকার হতে পারে, সেগুলো **[UNCLEAR]** হিসেবে চিহ্নিত করা হয়েছে।

---

## 1. Course context এবং recap

### 1.1 আগের বিষয়বস্তুর recap

Slides Week 4-কে আগের course content-এর সঙ্গে স্পষ্টভাবে যুক্ত করেছে:

- **Adversarial attacks and certification**
  - Fast Gradient Sign Method (**FGSM**)
  - Interval analysis
  - Neural network verification
- **Adversarial defences**
  - Adversarial training
  - Lipschitz-bounded neural networks
  - Randomised smoothing

### 1.2 Week 4-এ focus-এর পরিবর্তন

- আগের attacks মূলত **integrity** ঘিরে উপস্থাপিত হয়েছিল: model-এর behaviour বদলানো, misclassification ঘটানো, অথবা robustness certify করা।
- Week 4 integrity-এর বদলে **privacy**-এর ওপর attacks নিয়ে আলোচনা করে।
- আলোচিত দুইটি privacy attack হলো:
  - **Model extraction / model stealing attacks**
  - **Membership inference attacks**, slide-এ যেগুলোকে training data সম্পর্কে তথ্য চুরি করতে পারে এমন attacks হিসেবে বর্ণনা করা হয়েছে।

---

# Part I — Model Extraction / Model Stealing Attacks

## 2. Motivation: কেন model চুরি করা হবে?

### 2.1 Model train করা ব্যয়বহুল

Slides model extraction-এর motivation হিসেবে বলে যে model train করা:

- খুব ব্যয়বহুল;
- অনেক data দরকার হয়;
- খুব বেশি compute power দরকার হয়;
- software infrastructure দরকার হয়।

### 2.2 Attacker-এর motivation

Training-এর খরচ না দিয়ে attacker চেষ্টা করতে পারে:

- বিদ্যমান model চুরি করতে;
- model-এর behaviour clone করতে;
- stolen model downstream task-এ reuse করতে;
- competing MLaaS product তৈরি করতে;
- stolen বা approximated model ব্যবহার করে আরও attacks চালাতে।

Slide-এ উল্লেখ আছে যে LLM context-এ stealing বা cloning নিয়ে আলোচনা হয়েছে; উদাহরণ হিসেবে OpenAI/DeepSeek এবং Gemini cloning attempts উল্লেখ করা হয়েছে।

---

## 3. Model extraction-এর threat model

### 3.1 Basic MLaaS setting

Victim model-কে **MLaaS**-এর মাধ্যমে deployed trained model $f$ হিসেবে দেখানো হয়েছে:

$$
x \longrightarrow \boxed{\text{Trained Model } f \text{ (MLaaS)}} \longrightarrow y
$$

Adversary model-এর সঙ্গে interact করে input $x$ পাঠিয়ে এবং output $y$ গ্রহণ করে।

### 3.2 দুই ধরনের broad attack goal

Slides model extraction-কে দুইটি broad type-এ ভাগ করেছে:

1. **Functionality stealing**
2. **Model stealing**

#### Key concept: functionality stealing

**Intuition:** attacker-এর true internal parameters জানার দরকার নেই। Target model $f$-এর মতো আচরণ করে এমন surrogate model $g$ তৈরি করলেই যথেষ্ট।

**Notes-এ দেওয়া formalism:**

$$
g(x) \approx f(x)
$$

Successful functionality-stealing attack $f(x)$-এর functionality copy করে এমন surrogate model $g(x)$ শেখে, যা উচ্চ precision-এ $f(x)$-কে approximate করে।

#### Key concept: model stealing

**Intuition:** attacker শুধু behaviour নয়, model-এর internal details চুরি করার চেষ্টা করে।

Slides model stealing-কে ভাগ করেছে:

- **model parameters** চুরি;
- **model hyperparameters** চুরি;
- **model architecture** চুরি।

### 3.3 Threat-model slide-এর examples

Slides দুইটি example স্পষ্টভাবে annotate করেছে:

- **Example 1: Binary logistic classifier**
  - এটি **model stealing**-এর অধীনে, বিশেষভাবে **model parameters** হিসেবে রাখা হয়েছে।
- **Example 2: Neural network distillation**
  - এটি **functionality stealing**-এর অধীনে, বিশেষভাবে **surrogate model** তৈরি করা হিসেবে রাখা হয়েছে।

### 3.4 Output access assumptions

Slides দুই ধরনের possible API output আলাদা করেছে:

- **Class scores / confidence values**
  - API probabilities বা class scores-এর মতো confidence values return করে।
  - Simple models-এর ক্ষেত্রে এটি parameter extraction সহজ করে।
- **Output classes only**
  - API শুধু predicted class label return করে।
  - এটি black-box setting হিসেবে বর্ণিত, এবং extraction কঠিন করে।

---

## 4. Model extraction algorithms-এর taxonomy

Model extraction slides-এ He et al. (2025), “Artificial intelligence security and privacy: a survey” থেকে একটি taxonomy figure আছে।

### 4.1 Functionally equivalent model extraction attacks

Figure-টি functionally equivalent extraction attacks তালিকাভুক্ত করে, যেগুলো ভিত্তি করে:

- memory;
- side-channel;
- equation-solving;
- black-box access।

Lecture-এ **equation-solving** এবং **black-box** attacks red arrows দিয়ে highlight করা হয়েছে।

### 4.2 Task-accuracy model extraction attacks

একই figure task-accuracy model extraction attacks তালিকাভুক্ত করে, যেগুলো ভিত্তি করে:

- defence-aware model extraction;
- transfer-learning-based model extraction;
- uncertainty-sampling-based extraction;
- query-optimised black-box extraction।

### 4.3 Lecture focus

“Deeper dive” slide বলে যে lecture focus করে:

- **Binary classifiers**
  - $f(x) = \operatorname{Sigmoid}(w^T x + b)$
  - model parameter extraction
  - মাত্র $d+1$ samples দরকার
- **Black-box setting**
  - synthetic dataset
  - surrogate model train করা
  - objective functions

Slide Tramèr et al. (2016), *Stealing Machine Learning Models via Prediction APIs*, Sections 4.1.1, 4.1.2, 6.1, এবং 6.3-এর দিকে নির্দেশ করে।

**পরীক্ষা-সংকেত / slide emphasis:** Binary classifiers-এর জন্য slide-এ “Only $d+1$ samples needed!” স্পষ্টভাবে emphasised।

---

## 5. Binary logistic classifier-এর model parameter stealing

## 5.1 Binary logistic classifier

### Definition / intuition

Binary logistic classifier combine করে:

1. একটি linear score $w^T x + b$, এবং
2. একটি sigmoid activation, যা score-কে $[0,1]$-এ map করে।

এটি প্রায়ই binary classification-এর জন্য ব্যবহৃত হয়, যেখানে output-কে class confidence হিসেবে interpret করা হয়।

### দেওয়া formal definition

Lecture notes define করে:

$$
f(x) = \operatorname{Sigm}(w^T x + b)
$$

যেখানে

$$
\operatorname{Sigm}(z) = \frac{1}{1 + \exp(-z)} \in [0,1].
$$

Notes বলে যে এমন models প্রায়ই binary classifiers হিসেবে ব্যবহৃত হয়:

- যদি $f(x) \geq 0.5$, একটি class predict করা হয়;
- যদি $f(x) < 0.5$, অন্য class predict করা হয়।

---

## 5.2 Confidence values-এ access থাকলে parameter stealing

### Setup

MLaaS API শুধু output class নয়, পূর্ণ class confidence value $f(x)$ return করে।

Unknown model parameters হলো:

- weight vector $w \in \mathbb{R}^d$;
- bias $b \in \mathbb{R}$।

Lecture notes বলে adversary-এর মাত্র $d+1$ input-output pairs দরকার হতে পারে:

$$
\{(x_i, f(x_i))\}_{i=1}^{d+1}.
$$

### Key idea

Sigmoid output invert করা যায়, ফলে nonlinear-looking model unknown parameters-এর মধ্যে একটি linear equation-এ convert হয়।

### Derivation step 1: sigmoid invert করা

Notes দেয়:

$$
\operatorname{Sigm}^{-1}(f(x)) = w^T x + b
$$

যেখানে

$$
\operatorname{Sigm}^{-1}(z) = \log\left(\frac{z}{1-z}\right).
$$

এই inverse sigmoid হলো log-odds transform।

### Derivation step 2: linear equations-এর system তৈরি করা

নির্বাচিত $d+1$ inputs $x_1, \ldots, x_{d+1}$-এর জন্য define করা হয়:

$$
\hat{Y}
= \left(\operatorname{Sigm}^{-1}(f(x_1)) \; \cdots \; \operatorname{Sigm}^{-1}(f(x_{d+1}))\right)
\in \mathbb{R}^{1\times(d+1)}.
$$

Augmented input matrix define করা হয়:

$$
\hat{X}
=
\begin{pmatrix}
x_1 & \cdots & x_{d+1} \\
1 & \cdots & 1
\end{pmatrix}
\in \mathbb{R}^{(d+1)\times(d+1)}.
$$

Augmented parameter vector define করা হয়:

$$
\hat{W} = \left(w^T \; b\right) \in \mathbb{R}^{1\times(d+1)}.
$$

System হলো:

$$
\hat{Y} = \hat{W}\hat{X}.
$$

Bias $b$-কে $(d+1)$-long parameter vector $\hat{W}$-এর মধ্যে merge করা হয়েছে।

### Derivation step 3: parameters solve করা

Adversary যদি $d+1$ inputs এমনভাবে choose করে যেন $\hat{X}$ full-rank হয়, তাহলে $\hat{X}$ invertible এবং:

$$
\hat{W} = \hat{Y}\hat{X}^{-1}.
$$

Lecture notes বলে:

- $\hat{X}^{-1}$ একটি square matrix-এর inverse;
- এটি naïvely $O(d^3)$ সময়ে compute করা যায়;
- practice-এ randomভাবে $d+1$ inputs choose করলে প্রায় সবসময় full-rank $\hat{X}$ পাওয়া যায়।

### Worked derivation preserved

Worked-through derivation হলো full equation-solving attack:

1. $d+1$ inputs $x_i$ query করা।
2. Confidence values $f(x_i)$ receive করা।
3. প্রতিটি confidence value-তে $\operatorname{Sigm}^{-1}$ apply করা।
4. $\hat{Y}$, $\hat{X}$, এবং $\hat{W}$ assemble করা।
5. $\hat{Y}=\hat{W}\hat{X}$ ব্যবহার করা।
6. যদি $\hat{X}$ full-rank হয়, $\hat{W}=\hat{Y}\hat{X}^{-1}$ compute করা।
7. $\hat{W}$ থেকে $w$ এবং $b$ read off করা।

Uploaded slides বা notes-এ কোনো numerical example দেওয়া নেই।

---

## 5.3 Confidence values ছাড়া black-box parameter extraction

### Definition / intuition

Black-box setting-এ attacker confidence value নয়, শুধু output class observe করে।

Notes বলে যে linear classifier-এর model-parameter extraction theory-তে এখনও possible, কিন্তু কঠিন।

### এই lecture-এ formal coverage

Notes স্পষ্টভাবে বলে যে এই setting **এই unit-এ covered নয়** এবং আরও তথ্যের জন্য Lowd and Meek (2005), *Adversarial learning* refer করে।

**[UNCLEAR]** Uploaded material output classes only ব্যবহার করে linear classifier parameters extract করার detailed algorithm অন্তর্ভুক্ত করে না। Written notes-এ এটি explicit out of scope।

---

## 6. Functionality stealing

## 6.1 Motivation

আরও complicated models-এর ক্ষেত্রে exact parameter values extract করা অসম্ভব হতে পারে।

Notes emphasise করে যে attacker-এর exact parameters দরকার নাও হতে পারে। Successful privacy attack-এর শুধু model-এর **functionality** copy করলেই চলে।

## 6.2 Definition / intuition

Attacker victim model $f$-কে approximate করে এমন surrogate model $g$ তৈরি করে।

$$
g(x) \approx f(x)
$$

Attacker-এর কাছে $g$ থাকলে, downstream tasks-এ $f$-এর বদলে এটি ব্যবহার করা যায়।

Notes $g$-এর uses explicitভাবে list করে:

- competing MLaaS product তৈরি করা;
- black-box model $f(x)$-এর approximation হিসেবে $g(x)$ ব্যবহার করে আরও white-box attacks চালানো।

## 6.3 General functionality-stealing algorithm

Notes procedure-টিকে synthetic dataset-এর ওপর equation-solving বা model fitting হিসেবে বর্ণনা করে।

### Step 1: victim model query করা

Original model $f(x)$-এর ওপর উচ্চ সংখ্যক $k$ queries চালানো।

### Step 2: synthetic dataset তৈরি করা

Construct করা হয়:

$$
\mathcal{D} = \{(x_i, f(x_i))\}_{i=1}^{k}.
$$

এই dataset victim model থেকে generated input-output pairs ধারণ করে।

### Step 3: surrogate model train করা

$\mathcal{D}$-এর ওপর surrogate model $g(x)$ train করা।

Notes বলে:

- $g$-এর architecture $f$-এর সঙ্গে match করতে পারে, কিন্তু করতেই হবে এমন নয়;
- উপযুক্ত loss function application-এর ওপর depend করে, যেমন classification বা regression।

## 6.4 Dataset size এবং distribution-এর গুরুত্ব

Approximation $g(x) \approx f(x)$-এর quality synthetic dataset $\mathcal{D}$-এর ওপর heavily depend করে।

Notes বলে:

- accuracy সাধারণত $|\mathcal{D}|$-এর সঙ্গে বাড়ে;
- inputs-এর distribution-ও গুরুত্বপূর্ণ।

Slides এটিকে number of queries minimise করার goal-এর সঙ্গে connect করে।

**পরীক্ষা-সংকেত / slide emphasis:** Black-box extraction-এ slide স্পষ্টভাবে goal বলে: **number of queries minimise করা**।

---

## 7. Black-box extraction-এর sampling strategies

Lecture synthetic inputs choose করার জন্য তিনটি broad strategy দেয়।

## 7.1 Uniform random sampling

### Intuition

সবচেয়ে simple strategy হলো randomly inputs sample করা।

### দেওয়া formal detail

Image classification-এর জন্য notes বলে uniformly sampled inputs bounded থাকে:

$$
x \in [0,1]^d.
$$

এটি unit interval-এ normalised pixel values-এর সঙ্গে correspond করে।

## 7.2 Line search

### Intuition

Line search classification boundary-এর কাছাকাছি points choose করে, কারণ boundary-adjacent points target model-এর decision function সম্পর্কে বেশি তথ্য reveal করতে পারে।

### দেওয়া formal definition

ধরা যাক দুইটি input $x$ এবং $x'$ different classes দেয়:

$$
\arg\max_c f(x)_c \neq \arg\max_c f(x')_c.
$$

Line বরাবর search করা হয়:

$$
x'' = \alpha x + (1-\alpha)x'
$$

যেখানে $\alpha \in [0,1]$, এবং লক্ষ্য হলো classification boundary-এর arbitrarily close এমন input $x''$ খুঁজে পাওয়া।

Notes বলে এমন inputs $f(x)$-এর behaviour সম্পর্কে বেশি informative হতে পারে।

## 7.3 Adaptive sampling / uncertainty sampling

### Intuition

Attacker-এর কাছে initial surrogate model $g(x)$ থাকলে, তারা নতুন queries select করে যেখানে $g(x)$ সবচেয়ে uncertain।

### দেওয়া formal description

Notes এটিকে এভাবে বর্ণনা করে:

- এমন inputs extract করা যা $g(x)$-কে যতটা সম্ভব uncertain করে;
- active learning-এ এটি **uncertainty sampling** নামে পরিচিত;
- এর লক্ষ্য হলো এমন inputs choose করা যেগুলো $g(x)$-কে দ্রুত learn করানোর সম্ভাবনা বেশি।

## 7.4 Lowd-Meek strategy

Notes বলে figure-এ **Lowd-Meek** নামে থাকা strategy line search-এর একটি advanced example, Lowd and Meek (2005)-কে refer করে।

---

## 8. Stolen surrogate model-এর quality evaluate করা

Notes Tramèr et al. (2016) থেকে দুইটি metric দেয়।

## 8.1 Test-set extraction error

$$
R_{\text{test}}
=
\frac{1}{|\mathcal{T}|}
\sum_{(x_i, f(x_i)) \in \mathcal{T}}
\mathcal{L}\left(g(x_i), f(x_i)\right).
$$

এখানে:

- $\mathcal{T}$ হলো “natural” input-output pairs-এর test set;
- examples হিসেবে existing machine-learning benchmark test data অন্তর্ভুক্ত;
- $\mathcal{L}$ surrogate output $g(x_i)$ এবং victim output $f(x_i)$-এর comparison loss।

## 8.2 Uniform-input extraction error

$$
R_{\text{unif}}
=
\frac{1}{|\mathcal{U}|}
\sum_{(x_i, f(x_i)) \in \mathcal{U}}
\mathcal{L}\left(g(x_i), f(x_i)\right).
$$

এখানে:

- $\mathcal{U}$ randomly extracted inputs-এর set;
- notes uniform distribution থেকে inputs-এর example দেয়।

## 8.3 Metrics-এর relationship

Notes বলে $R_{\text{test}}$ এবং $R_{\text{unif}}$ structurally identical, কিন্তু differently distributed datasets-এর ওপর নির্ভর করে:

- $\mathcal{T}$: natural input-output pairs;
- $\mathcal{U}$: randomly extracted input-output pairs।

## 8.4 Figure interpretation: sampling strategies

Figure **Budget Factor $\alpha$**-এর বিপরীতে **average extraction error** plot করে:

- Uniform;
- Line-Search;
- Adaptive;
- Lowd-Meek।

এতে দুইটি panel আছে:

- $R_{\text{test}}$;
- $R_{\text{unif}}$।

Plotted curves থেকে দেখা যায়:

- budget factor বাড়লে extraction error কমে;
- higher budgets-এ uniform sampling comparatively targeted strategies-এর চেয়ে worse থাকে;
- larger budgets-এ adaptive sampling uniform-এর তুলনায় অনেক lower error দেয়;
- plotted experiment-এ Lowd-Meek budget factor প্রায় 50-এর মধ্যে near-zero error-এ পৌঁছায়।

**[UNCLEAR]** Uploaded notes/slides figure-এর axis label ছাড়া “Budget Factor $\alpha$” define করে না। দরকার হলে recording বা Tramèr et al. paper থেকে check করা উচিত।

---

# Part II — Membership Inference Attacks

## 9. Model extraction থেকে membership inference-এ recap

Membership inference lecture model extraction recap দিয়ে শুরু করে:

### Model stealing

- Exact parameters copy করা।
- বেশ challenging।
- Simple models-এর জন্য possible।

### Functionality stealing

- Synthetic dataset generate করা।
- Surrogate model train করা।
- Victim-এর behaviour replicate করা।

Transition question হলো:

> What else can we steal?

Slide উত্তর দেয় যে **training data** valuable হতে পারে।

---

## 10. Motivation: membership infer কেন করা হবে?

## 10.1 Access control principle

Slide access-control principle বলে:

- strictly necessary যা, তার বেশি data reveal করা যাবে না;
- অর্থাৎ যা একান্ত প্রয়োজন, শুধু সেটুকুই প্রকাশ করা উচিত।

Membership inference এই principle violate করে, কারণ এটি leak করে কোনো particular data point model-এর training set-এর অংশ ছিল কি না।

## 10.2 Training data-র value এবং sensitivity

Slides বলে training data:

- collect করা expensive;
- sensitive information থাকতে পারে;
- medical records বা API keys-এর মতো examples থাকতে পারে।

## 10.3 Legal reasons

Slide একটি legal motivation-ও দেয়:

- membership inference copyrighted data discover করতে ব্যবহৃত হতে পারে;
- slide LLMs trained on books-কে example হিসেবে দেয় এবং একটি arXiv reference cite করে।

---

## 11. Membership inference threat model

## 11.1 Basic setting

Target model $f$ training data $\mathcal{D}$-এর ওপর trained:

$$
\mathcal{D} \longrightarrow \boxed{\text{Trained Model } f \text{ (MLaaS)}}
$$

Adversary MLaaS model query করে:

$$
x \longrightarrow f \longrightarrow y.
$$

## 11.2 Attack model

Adversary একটি **attack model** $h$ ব্যবহার করে।

$h$-এর goal হলো queried input target model-এর training set-এ ছিল কি না decide করা:

$$
x \in \mathcal{D}
\quad \text{or} \quad
x \notin \mathcal{D}.
$$

### Definition / intuition

Membership inference হলো একটি binary decision problem: data point $x$ এবং trained model $f$ থেকে পাওয়া information given থাকলে decide করা যে $x$ training dataset $\mathcal{D}$-এর member ছিল কি না।

### Slides-এ দেওয়া formalism

Slides attack-এর একক formal definition দেয় না, কিন্তু threat-model diagram দেয়:

$$
h(y) \rightarrow \{x \in \mathcal{D},\; x \notin \mathcal{D}\}
$$

যেখানে $y=f(x)$, এবং পরের slides confidence scores যেমন $\max_c f(x)_c$ ব্যবহার করে।

## 11.3 Confidence values-এর role

Threat-model slide $y$-কে স্পষ্টভাবে annotate করে:

- class scores;
- confidence values।

Membership decide করার signal হিসেবে এই confidence values ব্যবহার করা হয়।

Slide central question করে:

> How do we train the Attack Model $h$?

---

## 12. Membership inference intuition

Intuition slide একটি image-classification example ব্যবহার করে।

### দেখানো example

- Input: একটি cat-এর image।
- Target ML model class scores output করে:
  - cat;
  - dog;
  - panda।
- Cat score high, visually around 80; dog এবং panda scores low।
- High-confidence region-এর আশেপাশে একটি horizontal red threshold line আঁকা হয়েছে।

### Intuition

Target model যদি কোনো data point-এ unusually confident হয়, সেই high confidence indicate করতে পারে যে model training-এর সময় point-টি দেখেছিল।

এটি পরে Algorithm III-তে formalised হয়:

$$
\max_c f(x)_c \geq \text{threshold}.
$$

---

## 13. Membership inference Algorithm I: similarly distributed data সহ shadow model

## 13.1 Attacker knowledge

Algorithm I ধরে নেয় attacker-এর strong auxiliary knowledge আছে:

- identically distributed shadow training data $\mathcal{D}_{\text{shadow}}$;
- target model hyperparameters, including architecture এবং initialisation;
- একই training algorithm এবং infrastructure-এ access।

Slide পরে main issue summarize করে:

$$
\mathcal{D}_{\text{shadow}} \sim \mathcal{D}.
$$

**পরীক্ষা-সংকেত / slide emphasis:** Algorithm I-এর “main issue” explicitভাবে বলা হয়েছে: এটি $\mathcal{D}_{\text{shadow}} \sim \mathcal{D}$-এ access require করে।

## 13.2 Shadow model setup

Attacker shadow data split করে বা ব্যবহার করে:

- $\mathcal{D}_{\text{train}}$, shadow model train করতে ব্যবহৃত;
- $\mathcal{D}_{\text{out}}$, shadow model-এর training set-এর বাইরে থাকা data।

Shadow model denote করা হয়:

$$
g.
$$

## 13.3 Attack model $h$ train করা

Slide training procedure দেয়।

### Step 1: shadow এবং target models similar ধরে নেওয়া

$$
f \approx g.
$$

Attack model shadow model-এর behaviour-এর ওপর trained হয়, তারপর target model-এ transferred হয়।

### Step 2: shadow training samples-এর ওপর outputs collect করা

$$
Y_{\text{train}}
=
\{y = g(x) : x \in \mathcal{D}_{\text{train}}\}.
$$

এগুলো shadow model-এর জন্য “member” examples হিসেবে labelled।

### Step 3: shadow non-training samples-এর ওপর outputs collect করা

$$
Y_{\text{out}}
=
\{y = g(x) : x \in \mathcal{D}_{\text{out}}\}.
$$

এগুলো shadow model-এর জন্য “non-member” examples হিসেবে labelled।

### Step 4: $h$ train করা

Attack model $h$-কে discriminate করতে train করা হয়:

- $Y_{\text{train}}$: shadow model-এর training set-এ থাকা points-এর outputs;
- $Y_{\text{out}}$: shadow model-এর training set-এ না থাকা points-এর outputs।

## 13.4 Target model-এর বিরুদ্ধে attack model ব্যবহার করা

$h$ train করার পর:

1. Candidate point $x$ দিয়ে target model $f$ query করা।
2. Output $y=f(x)$ receive করা, typically class scores/confidence values।
3. $y$-কে attack model $h$-এর input হিসেবে দেওয়া।
4. $h$ predict করে:

$$
x \in \mathcal{D}
\quad \text{or} \quad
x \notin \mathcal{D}.
$$

## 13.5 Algorithm I figure results

Algorithm I results figure compare করে:

- **Shokri et al.**;
- **Our approach**।

এটি datasets across **precision** এবং **recall** plot করে:

- Adult;
- CIFAR-10;
- CIFAR-100;
- Face;
- Location;
- MNIST;
- News;
- Purchase-2;
- Purchase-10;
- Purchase-20;
- Purchase-50;
- Purchase-100।

Plotted bars দেখায় যে both approaches প্রায়ই high precision এবং recall achieve করে; “Our approach” visually several datasets-এ Shokri et al.-এর similar বা slightly higher।

**[UNCLEAR]** এখানে figure detailed verbal transcript ছাড়া দেখানো হয়েছে। দরকার হলে exact numerical values original paper বা recording থেকে পড়তে হবে।

---

## 14. Membership inference Algorithm II: arbitrary data সহ shadow model

## 14.1 Attacker knowledge

Algorithm II data assumption weaken করে।

Attacker-এর আছে:

$$
\mathcal{D}_{\text{shadow}} = \mathcal{D}_{\text{whatever}}.
$$

অর্থাৎ attacker-এর কাছে অন্য কোনো arbitrary training set আছে, যা target training set-এর সঙ্গে necessarily identically distributed নয়।

Slide বলে, এটি বাদে Algorithm II একই strategy ব্যবহার করে যা Algorithm I-তে ছিল।

## 14.2 Algorithm II procedure

তাই procedure হলো:

1. Arbitrary data $\mathcal{D}_{\text{whatever}}$-কে shadow data হিসেবে ব্যবহার করা।
2. Shadow model $g$ train করা।
3. $g$ থেকে $Y_{\text{train}}$ এবং $Y_{\text{out}}$ collect করা।
4. Attack model $h$-কে member-like এবং non-member-like outputs distinguish করতে train করা।
5. Target model $f$-এর outputs-এ $h$ apply করা।

## 14.3 Algorithm II heatmap results

Slide precision এবং recall heatmaps দেখায়, যেখানে dataset names দুই axis-এ আছে:

- Adult;
- CIFAR-10;
- CIFAR-100;
- Face;
- Location;
- MNIST;
- News;
- Purchase-2;
- Purchase-10;
- Purchase-20;
- Purchase-50;
- Purchase-100।

একটি magnifying-glass graphic precision এবং recall heatmaps—দুটিতেই **95** value highlight করে।

**[UNCLEAR]** Slide স্পষ্টভাবে define করে না কোন heatmap axis target dataset এবং কোনটি arbitrary shadow dataset-এর সঙ্গে correspond করে। Likely interpretation হলো cross-dataset experiment, কিন্তু confirmation-এর জন্য recording বা original paper দরকার।

**[UNCLEAR]** Highlighted “95” visually shown, কিন্তু text-এ explain করা নেই এটি 0.95 precision/recall, 95%, নাকি emphasis-এর জন্য selected particular cell।

---

## 15. Membership inference Algorithm III: confidence threshold attack

## 15.1 Attacker knowledge

Algorithm III ধরে নেয় প্রায় কোনো auxiliary information নেই:

- no data;
- no shadow model;
- “no nothing,” slide-এ যেমন লেখা।

## 15.2 Decision criterion

Slide criterion দেয়:

$$
\max_c f(x)_c \geq \text{threshold}.
$$

Implied attack rule পরিষ্কারভাবে লেখা যায়:

$$
h(x) =
\begin{cases}
\text{member}, & \text{if } \max_c f(x)_c \geq \tau,\\
\text{non-member}, & \text{otherwise.}
\end{cases}
$$

যেখানে $\tau$ হলো chosen threshold।

## 15.3 Intuition

Slide বলে:

- যদি $x \in \mathcal{D}$, তাহলে $f(x)$ overfitted হয়েছে।

Intuition হলো overfitting model-কে training examples-এর ওপর non-training examples-এর তুলনায় বেশি confident করে তুলতে পারে।

## 15.4 Histogram example

Slide **Maximal Posterior**-এর বিপরীতে density plot করে, compare করে:

- Random;
- Non-member;
- Member।

Member distribution maximal posterior $1.0$-এর কাছাকাছি concentrated। Non-members এবং random examples lower posterior values-এ বেশি spread out।

Plot-এর high-confidence end-এর কাছে একটি vertical threshold line আঁকা। Threshold-এর ওপরে থাকা points Algorithm III-এর অধীনে members হিসেবে predicted হবে।

---

## 16. Membership inference algorithm comparison

Algorithm-comparison slide **precision** এবং **recall** plot করে:

- Adversary 1;
- Adversary 2;
- Adversary 3।

দেখানো datasets হলো:

- Adult;
- CIFAR-10;
- CIFAR-100;
- Face;
- Location;
- MNIST;
- News;
- Purchase-2;
- Purchase-10;
- Purchase-20;
- Purchase-50;
- Purchase-100।

### Chart কী দেখায়

- Dataset অনুযায়ী performance substantially vary করে।
- Adversary 1 এবং Adversary 2-এর precision প্রায়ই high।
- Adversary 3 several precision bars-এ lower, কিন্তু uniformly poor নয়।
- Recall আরও sharply vary করে, বিশেষ করে কিছু datasets-এ Adversary 3-এর ক্ষেত্রে।

**[UNCLEAR]** Slide visible text-এ “Adversary 1,” “Adversary 2,” এবং “Adversary 3”-কে Algorithms I, II, III-এর সঙ্গে explicitly map করে না। Mapping recording-এ check করা উচিত।

**[UNCLEAR]** Bar chart-এ exact numerical values printed নয়, তাই precise values recording বা source paper থেকে check করতে হবে।

---

# Part III — Privacy Attacks-এর Code Tutorial

## 17. Tutorial scope

Code tutorial slide বলে এটি দুই attack family-র ওপর deeper dive।

## 17.1 Model extraction tutorial topics

Tutorial covers:

- Uniform Sampling;
- Line Search;
- Uncertainty Sampling।

এগুলো model extraction lecture-এর black-box extraction sampling strategies-এর সঙ্গে directly correspond করে।

## 17.2 Membership inference tutorial topics

Tutorial covers:

- Shadow Model;
- Confidence Threshold।

এগুলো correspond করে:

- Algorithms I এবং II-তে থাকা shadow-model-based membership inference;
- Algorithm III-তে থাকা threshold-based membership inference।

## 17.3 Materials

Slide বলে:

- Canvas-এ Jupyter notebooks দেখুন।

---

# Exam flags এবং high-value points

## Explicit exam-related statement

- Code tutorial-এর “Next up” slide-এ **Friday 6 March @ 2pm — Exam demo exercises** list করা আছে।
- Uploaded slide বা note-এ কোনো specific Week 4 concept-এর জন্য explicit “this will be on the exam” বলা নেই।

## High-value slide emphases

নিচের points slides/notes-এ explicitly emphasised এবং revision-এর জন্য likely important:

1. **Binary logistic classifier parameter stealing-এর জন্য মাত্র $d+1$ samples দরকার**, যদি confidence values returned হয় এবং chosen augmented input matrix full-rank হয়।
2. **Confidence values simple model stealing অনেক সহজ করে**, কারণ inverse sigmoid input-output relationship-কে linear system-এ convert করে।
3. **Black-box extraction synthetic inputs require করে**, এবং stated goal হলো **number of queries minimise করা**।
4. তিনটি extraction sampling strategy হলো:
   - uniform sampling;
   - line search;
   - adaptive / uncertainty sampling।
5. দুইটি extraction evaluation metric হলো:
   - $R_{\text{test}}$;
   - $R_{\text{unif}}$।
6. **Membership inference predict করে $x \in \mathcal{D}$ নাকি $x \notin \mathcal{D}$**।
7. **Algorithm I-এর main issue** হলো $\mathcal{D}_{\text{shadow}} \sim \mathcal{D}$ দরকার।
8. **Algorithm II assumption weaken করে** arbitrary shadow data $\mathcal{D}_{\text{whatever}}$-এ।
9. **Algorithm III-এর data বা shadow model দরকার নেই** এবং confidence-threshold criterion ব্যবহার করে:

$$
\max_c f(x)_c \geq \text{threshold}.
$$

---

# Earlier lectures, papers, এবং applications-এর সঙ্গে connections

## Earlier course material

Week 4 connect করে:

- FGSM;
- interval analysis;
- neural network verification;
- adversarial training;
- Lipschitz-bounded neural networks;
- randomised smoothing।

Connection-টি **integrity** থেকে **privacy**-তে shift হিসেবে framed।

## Slides/notes-এ named papers এবং sources

- Lowd and Meek (2005), *Adversarial learning*.
  - Linear classifiers-এর black-box extraction এবং Lowd-Meek line-search strategy-এর জন্য referenced।
- Tramèr et al. (2016), *Stealing Machine Learning Models via Prediction APIs*.
  - Model extraction এবং sampling/evaluation figures-এর জন্য referenced।
- He et al. (2025), *Artificial intelligence security and privacy: a survey*.
  - Model extraction taxonomy diagram-এর source।
- Salem et al. (2019), *ML-Leaks: Model and Data Independent Membership Inference Attacks and Defenses on Machine Learning Models*.
  - Membership inference intuition figure-এর source।
- Membership slides copyrighted data discover করার legal motivation হিসেবে books-এ trained LLMs নিয়ে একটি arXiv reference-ও cite করে।

## Mentioned practical applications

- Stolen surrogate model ব্যবহার করে competing MLaaS services তৈরি।
- Black-box model-এর approximation হিসেবে surrogate ব্যবহার করে further white-box attacks।
- Medical records বা API keys-এর মতো sensitive data training-এ ব্যবহৃত হয়েছে কি না discover করা।
- Copyrighted data model training-এ included ছিল কি না discover করা।

---

# Recording-এ revisit করার unclear sections

1. **Uploaded zip-এ কোনো transcript included ছিল না।** এই notes শুধুমাত্র slides এবং written lecture notes ব্যবহার করে।
2. **Confidence values ছাড়া black-box parameter extraction** written notes-এ explicitly covered নয়। Notes Lowd and Meek (2005) refer করে।
3. Tramèr et al. extraction-error figure-এ **Budget Factor $\alpha$** uploaded material-এ defined নয়।
4. **Membership Algorithm I result chart** precision/recall bars দেয়, কিন্তু exact numerical labels নেই।
5. **Membership Algorithm II heatmaps** text-এ define করে না কোন axis target data এবং কোন axis shadow data।
6. Algorithm II heatmaps-এর **highlighted “95”** text-এ explained নয়।
7. **Algorithm comparison: Adversary 1/2/3** visible slide text-এ Algorithms I/II/III-এর সঙ্গে explicitly mapped নয়।
8. **Membership-inference confidence assumptions**: slides class scores/confidence দেখায়, কিন্তু সব algorithms full score vectors require করে নাকি শুধু maximum class confidence require করে তা পুরোপুরি specify করে না।
