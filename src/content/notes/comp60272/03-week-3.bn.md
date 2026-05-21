---
subject: COMP60272
chapter: 3
title: "Week 3"
language: bn
---

# COMP60272 - AI-এর নিরাপত্তা ও গোপনীয়তা: Week 3 স্টাডি নোট

**বিষয় ও পরিসর।** এই সপ্তাহের আলোচ্য বিষয় অ্যাডভার্সেরিয়াল ডিফেন্স: অ্যাডভার্সেরিয়াল ট্রেনিং, লিপশিট্‌জ-বাউন্ডেড নিউরাল নেটওয়ার্ক, এবং র‍্যান্ডমাইজড স্মুথিং। বৃহত্তর প্রেক্ষাপটে এটি দেখায় কীভাবে ML সিস্টেমকে এমনভাবে ট্রেন বা পরিবর্তন করা যায় যাতে অ্যাডভার্সেরিয়াল ইনপুট পার্টার্বেশন সহজে প্রেডিকশন বদলাতে না পারে।

**উৎস/ম্যাটেরিয়াল নোট।** আপলোড করা zip ফাইলে স্লাইড ডেক এবং লেকচার-নোট PDF পাওয়া গেছে। আর্কাইভে আলাদা transcript ফাইল পাইনি, তাই এই নোটে স্লাইড ও লেকচার-নোট PDF ব্যবহার করা হয়েছে, এবং যেখানে transcript-নির্ভর ফাঁক থাকতে পারে সেখানে [UNCLEAR] চিহ্ন রাখা হয়েছে।

---

## 1. Week 3 overview: adversarial defences

### 1.1 মূল সমস্যা

স্লাইডে সপ্তাহটির প্রেরণা হিসেবে স্ট্যান্ডার্ড adversarial-example ছবিটি ব্যবহার করা হয়েছে:

- Original image/input: `x`, যেটি **"panda"** হিসেবে classified, 57.7% confidence।
- Perturbation: `.007 x sign(\nabla_x J(\theta, x, y))`, দৃশ্যত noise-like এবং **"nematode"** লেবেলযুক্ত, 8.2% confidence।
- Perturbed image: `x + \epsilon sign(\nabla_x J(\theta, x, y))`, যেটি **"gibbon"** হিসেবে classified, 99.3% confidence।

এই সপ্তাহের stated goal:

> কীভাবে এমন ML model train করা যায় যা adversarial attack allow করে না।

### 1.2 আলোচিত defence techniques

Randomised smoothing স্লাইডে week-level taxonomy দেওয়া হয়েছে:

| Technique | Stage | Intervention |
|---|---:|---|
| Adversarial Training | Train time | Data augmentation |
| Lipschitz-Bounded NN | Train time | Architectural change |
| Randomised Smoothing | Inference time | Probabilistic inputs |

একই স্লাইডে প্রধান trade-off-গুলো দেওয়া হয়েছে:

| Technique | Pros | Cons |
|---|---|---|
| Adversarial Training | ML mindset-এর সঙ্গে মানানসই | No guarantees |
| Lipschitz-Bounded NN | Provable guarantees | Less expressivity |
| Randomised Smoothing | Existing model reuse করা যায় | Slower inference |

---

## 2. Adversarial Training

### 2.1 Intuition

**Intuition.** Adversarial training adversarial example-গুলোকে অতিরিক্ত training data হিসেবে ব্যবহার করে। শুধু clean example-এ train না করে, model-টি original dataset এবং current model থেকে generated attack dataset—দুটোর ওপরই train করা হয়।

স্লাইডের key loop:

1. Clean dataset `D` দিয়ে শুরু করা।
2. Model-কে `D \cup D'`-এর ওপর train করা, যেখানে `D'` হলো adversarial/attack dataset।
3. Current model ব্যবহার করে নতুন adversarial example compute করা।
4. `D'` update করা এবং repeat করা।

এটি data augmentation-এর মতো, কারণ এটি synthetic data point তৈরি করে; তবে ভিন্ন কারণ synthetic example-গুলো নিজেই model-এর ওপর depend করে।

### 2.2 Empirical Risk Minimisation: regular accuracy

Ordinary training-এর জন্য স্লাইডে target parameter-কে data distribution-এর ওপর expected loss minimise করা হিসেবে define করা হয়েছে:

$$
\theta^* = \arg\min_\theta \; \mathbb{E}_{(x,y) \sim \mathcal{D}}
\left\{ \mathcal{L}(f_\theta(x), y) \right\}.
$$

যেহেতু true distribution unavailable, empirical risk minimisation finite dataset of size `N` দিয়ে এটিকে approximate করে:

$$
\theta^* \approx \arg\min_\theta \; \frac{1}{N}\sum_{i=1}^{N}
\mathcal{L}(f_\theta(x_i), y_i).
$$

### 2.3 Empirical Risk Minimisation: robust accuracy

Robust training-এ objective বদলায়: শুধু `x`-এ loss minimise করার বদলে, allowed perturbation-গুলোর ওপর worst-case loss minimise করা হয়।

স্লাইডে দেওয়া হয়েছে:

$$
\theta^* = \arg\min_\theta \; \mathbb{E}_{(x,y) \sim \mathcal{D}}
\left\{ \max_{\epsilon \in E} \mathcal{L}(f_\theta(x + \epsilon), y) \right\}.
$$

Empirical approximation:

$$
\theta^* \approx \arg\min_\theta \; \frac{1}{N}\sum_{i=1}^{N}
\max_{\epsilon \in E} \mathcal{L}(f_\theta(x_i + \epsilon), y_i).
$$

**Key concept: robust accuracy.**

- **Intuition:** একটি prediction robust যখন attacker input-কে set `E`-এর মধ্যে perturb করতে পারলেও prediction correct থাকে।
- **Formalism from slide:** Loss-এর মধ্যে perturbation `\epsilon \in E`-এর ওপর inner maximisation থাকে। Training তারপর এই worst-case loss minimise করে।

স্লাইডে Casadio et al. (2022), *Neural Network Robustness as a Verification Property: A Principled Case Study* cite করা হয়েছে।

### 2.4 Adversarial training dataset construction

Adversarial training স্লাইডে দুটি dataset define করা হয়েছে:

$$
D = \{(x_i, y_i)\},
\qquad
D' = \{(x_i', y_i)\}.
$$

Model-টি দুই dataset-এর ওপর train করা হয়:

$$
\theta^* = \arg\min_\theta \; \frac{1}{|D \cup D'|}
\sum_{i \in D \cup D'} \mathcal{L}(f_\theta(x_i), y_i).
$$

Attack dataset compute করা হয় এভাবে:

$$
D' = \left\{(x_i', y_i) : x_i \in D \; \land \;
 x_i' = \arg\max_{\epsilon \in E} \mathcal{L}(f_\theta(x_i + \epsilon_i), y_i)
\right\}.
$$

[UNCLEAR] স্লাইডে `\epsilon \in E`-এর ওপর maximise করা হয়েছে, কিন্তু inner expression-এ `x_i + \epsilon_i` print করা আছে। এটি সম্ভবত slide-এর indexing/notation issue; exact notation গুরুত্বপূর্ণ হলে recording বা original source আবার দেখা দরকার।

### 2.5 Adversarial training vs data augmentation

**Similarities:**

- দুটোই training set-এর size বাড়ায়।
- দুটো ক্ষেত্রেই নতুন data point syntheticভাবে generated।

**Differences:**

- Adversarial training-এ augmentation/attack নিজেই model `f_\theta`-এর ওপর depend করে।
- Augmented dataset `D'` training চলাকালে বদলায়।

**Key concept: model-dependent augmentation.**

- **Intuition:** Ordinary augmentation আগে থেকেই fixed হতে পারে; adversarial example recompute করতে হয়, কারণ current model-ই কোন perturbation adversarial তা determine করে।
- **Formalism:** Attack dataset maximisation-এর মধ্যে `f_\theta` ব্যবহার করে define করা হয়েছে, তাই `\theta` বদলালে `D'` বদলায়।

### 2.6 Algorithmic considerations

স্লাইডে দুটি practical issue highlight করা হয়েছে।

#### Computational efficiency

- Training চলাকালে attack compute করার জন্য দ্রুত attack algorithm দরকার।
- FGSM একটি quick attack algorithm হিসেবে দেওয়া হয়েছে।
- কিছু verifier counterexample দেয় কিন্তু slow।
- তাই verifier শুধুমাত্র একেবারে শেষে ব্যবহার করা উচিত।

#### Convergence

- সাধারণত আমরা সব attack stop করতে পারি না।
- Augmented dataset `D'` training চলাকালে বদলায়।
- এর অর্থ adversarial training-এর কাছে later safe-by-design method-গুলোর মতো guarantee থাকে না।

### 2.7 Coding tutorial plan

Coding tutorial স্লাইডে আছে:

- একটি simple binary classifier train করা।
- Adversarial example compute করা।
- এক বা একাধিক round finetuning।

স্লাইডে **Regular Training** label-সহ একটি plot আছে, যেখানে one-dimensional input range-এর ওপর binary-classifier-like output দেখানো হয়েছে।

---

## 3. Lipschitz-Bounded Neural Networks

### 3.1 Recap and goal

Lipschitz স্লাইড adversarial training recap করে শুরু করে:

- Robust accuracy-এর জন্য train করা।
- Dataset-এ adversarial example যোগ করা।
- Convergence বা attack absence-এর guarantee নেই।
- খুব flexible এবং ML mindset-এর সঙ্গে ভালোভাবে মেলে।

নতুন goal হলো **safe-by-design principle**:

- Neural network architecture-এ পরিবর্তন করা।
- Provable safety guarantee পাওয়া।

প্রস্তাবিত method: **Lipschitz-bounded neural networks**।

### 3.2 Key idea: limit sudden changes

স্লাইডে goal বলা হয়েছে:

> limit any sudden change -> robustness

প্রস্তাবিত mechanism হলো slope-এর ওপর upper bound বসানো:

$$
\nabla_x f(x).
$$

**Intuition.** Input সামান্য বদলালে output খুব বেশি বদলাতে না পারলে, ছোট adversarial perturbation সহজে prediction flip করতে পারে না।

### 3.3 Lipschitz constant

#### Formal definition

ধরা যাক function:

$$
f : \mathbb{R}^m \to \mathbb{R}^n,
$$

এর Lipschitz constant, `p`-norm `\|\cdot\|_p` relative-এ, এমন যেকোনো value:

$$
L_f \in \mathbb{R}^+
$$

যার জন্য:

$$
\|f(x) - f(x')\|_p \le L_f \cdot \|x - x'\|_p.
$$

#### Intuition

Lipschitz constant `f`-এর slope-এর একটি upper bound দেয়।

Input distance `\epsilon` পরিমাণ বদলালে output সর্বোচ্চ এতটা বদলাতে পারে:

$$
\epsilon \cdot L_f.
$$

এই কারণেই Lipschitz continuity adversarial robustness-এর সঙ্গে relevant।

### 3.4 Composition of Lipschitz functions

#### Statement

দুটি function `f` ও `g`, যাদের Lipschitz constant যথাক্রমে `L_f` ও `L_g`, তাদের composition

$$
h \equiv g \circ f
$$

এর Lipschitz constant:

$$
L_h = L_f \cdot L_g.
$$

#### Derivation from the lecture notes

ধরা যাক:

$$
h(x) = g(f(x)).
$$

Define:

$$
z \equiv f(x),
\qquad
z' \equiv f(x').
$$

যেহেতু `g`-এর Lipschitz constant `L_g`:

$$
\|h(x) - h(x')\|
= \|g(z) - g(z')\|
\le L_g \|z - z'\|.
$$

যেহেতু `f`-এর Lipschitz constant `L_f`:

$$
\|z - z'\|
= \|f(x) - f(x')\|
\le L_f \|x - x'\|.
$$

Inequality দুটো combine করলে:

$$
\|h(x) - h(x')\|
\le L_g \|z - z'\|
\le L_g L_f \|x - x'\|.
$$

Therefore:

$$
L_h = L_g \cdot L_f.
$$

### 3.5 Worked example: step function-এর Lipschitz-bounded approximation

Lecture notes-এ চারটি neural architecture compare করা একটি figure বর্ণনা করা হয়েছে, সবগুলোর Lipschitz constant:

$$
L_f = 10.
$$

Dataset নিজে Lipschitz continuous নয়: ground truth একটি step function, যা abruptভাবে বদলায়:

$$
x = 0.
$$

Lipschitz constraint-এর কারণে সব neural network `x = 0`-এর কাছাকাছি ground truth-কে maximum slope `L_f = 10`-এর নিচে রেখে approximate করে, ফলে step function-এর দুই level-এর মধ্যে smooth transition তৈরি হয়।

Figure-এ slope-গুলো approximately label করা হয়েছে:

- AOL: slope 4.8।
- Orthogon: slope 6.5।
- SLL: slope 6.8।
- Ours: slope 9.4।
- Best possible: slope 10।

**Interpretation.** Bound network কত sharply change করতে পারে তা control করে। True target abruptভাবে বদলালেও, model-কে smoothly transition করতে বাধ্য করা হয়।

### 3.6 Robustness of Lipschitz classifiers

#### Formal statement

ধরা যাক classifier:

$$
f : \mathbb{R}^n \to \mathbb{R}^m,
$$

যা highest-scoring output entry অনুযায়ী predict করে:

$$
c = \arg\max_{i \in m} f(x)_i,
$$

একটি specific input `x \in \mathbb{R}^n`-এর চারপাশে `\epsilon`-ball-এ এর prediction robust যদি:

$$
\forall x, x' \in \mathbb{R}^n,
\qquad
\|x - x'\|_p \le \epsilon
\quad \land \quad
f(x)_c - \max_{i \ne c} f(x)_i \ge 2\epsilon L_f
$$

implies:

$$
\arg\max_j f(x')_j = c.
$$

এখানে `L_f` হলো norm of interest, অর্থাৎ `p`-norm-এর অধীনে `f`-এর Lipschitz constant।

#### Intuition

Classifier robust যদি winning class এবং runner-up class-এর score gap যথেষ্ট বড় হয়। নির্দিষ্টভাবে, score gap কমপক্ষে হতে হবে:

$$
2\epsilon L_f.
$$

Factor 2 কেন? Perturbation-এর অধীনে winning class score সর্বোচ্চ `\epsilon L_f` কমতে পারে, আর runner-up score সর্বোচ্চ `\epsilon L_f` বাড়তে পারে। তাই gap সর্বোচ্চ `2\epsilon L_f` কমতে পারে।

#### Proof steps

Lipschitz property এবং premise থেকে:

$$
\|x - x'\|_p \le \epsilon,
$$

আমরা পাই:

$$
\epsilon L_f
\ge \|f(x) - f(x')\|_p
\ge |f(x)_i - f(x')_i|.
$$

শেষ inequality ধরে কারণ যেকোনো vector `z`-এর জন্য প্রতিটি component satisfy করে:

$$
|z_i| \le \|z\|_p.
$$

তাই প্রতিটি output entry bound করা যায়:

$$
f(x')_i \in [f(x)_i - \epsilon L_f,\; f(x)_i + \epsilon L_f].
$$

এখন focus করি:

- `c`: original top class।
- `d = \arg\max_{i \ne c} f(x)_i`: second-highest scoring class।

Bound দুবার ব্যবহার করে:

$$
f(x')_c \ge f(x)_c - \epsilon L_f,
$$

and:

$$
f(x')_d \le f(x)_d + \epsilon L_f.
$$

Subtract:

$$
f(x')_c - f(x')_d
\ge f(x)_c - f(x)_d - 2\epsilon L_f.
$$

যদি original score gap satisfy করে:

$$
f(x)_c - f(x)_d \ge 2\epsilon L_f,
$$

তাহলে:

$$
f(x')_c - f(x')_d \ge 0.
$$

সুতরাং `\epsilon`-ball-এর সব perturbation `x'`-এর অধীনে `c` top predicted class থাকে।

### 3.7 Building Lipschitz-bounded neural networks

Lecture notes তারপর আলোচনা করে কীভাবে এমন Lipschitz-bounded layer define করতে হয় যার:

$$
L = 1,
$$

এবং কীভাবে সেগুলো compose করে adversarially robust neural model বানানো যায়।

Notes থেকে important scope condition:

- এই section-এর বেশিরভাগ result শুধু Euclidean norm-এর জন্য valid:

$$
p = 2.
$$

### 3.8 Spectral Normalisation layer

#### Motivation

লক্ষ্য হলো common neural network layer-গুলোকে এমনভাবে re-parametrise করা যাতে explicit constraint ছাড়াই 1-Lipschitz property enforce হয়। এতে extra regularisation term যোগ না করেও training normally চলতে পারে।

#### Formal statement

Weight matrix:

$$
W \in \mathbb{R}^{n \times m},
$$

এর জন্য linear layer define করা হয়:

$$
\ell(x) = \frac{Wx}{\lambda(W)} + b,
$$

যেখানে `\lambda(W)` হলো `W`-এর spectral norm।

Resulting layer-এর Lipschitz constant:

$$
L_\ell = 1.
$$

#### Proof steps

দুটি input `x, x'`-এর জন্য:

$$
\|\ell(x) - \ell(x')\|_p
= \left\|\frac{Wx}{\lambda(W)} + b - \frac{Wx'}{\lambda(W)} - b\right\|_p.
$$

`b` cancel করে factor করলে:

$$
= \frac{1}{\lambda(W)}\|W(x - x')\|_p.
$$

`\|x - x'\|_p` দিয়ে multiply ও divide করে rewrite:

$$
= \frac{1}{\lambda(W)}
\left\|\frac{W(x - x')}{\|x - x'\|_p}\right\|_p
\|x - x'\|_p.
$$

সব non-zero vector `z`-এর ওপর maximisation দিয়ে upper-bound:

$$
\le \frac{1}{\lambda(W)}
\max_{z \ne 0}
\left\|\frac{Wz}{\|z\|_p}\right\|_p
\|x - x'\|_p.
$$

Spectral norm-এর definition অনুযায়ী এটি হয়:

$$
= \|x - x'\|_p.
$$

Therefore:

$$
\|\ell(x) - \ell(x')\|_p \le \|x - x'\|_p,
$$

তাই layer-টি 1-Lipschitz।

### 3.9 Spectral norm via power iteration

Notes বলছে spectral normalisation-এর জন্য প্রতিটি training step-এ weight matrix-এর spectral norm compute করতে হয়, তাই efficient algorithm দরকার।

#### Algorithm: Spectral Norm via Power Iteration

1. Initialise:

$$
v, u \leftarrow \mathcal{N}(0, 1).
$$

2. `k` iterations-এর জন্য:

$$
v \leftarrow \frac{Wu}{\|Wu\|_2},
$$

$$
u \leftarrow \frac{v^T W}{\|v^T W\|_2}.
$$

3. Estimate return করা:

$$
\hat{\lambda}(W) = v^T W u.
$$

[UNCLEAR] Notes initial random vector `u` ও `v`-এর dimension specify করে না; implementation-এর সময় `W` থেকে infer করতে হবে।

#### Practical details

- Convergence-এর জন্য প্রায় 100 iterations যথেষ্ট:

$$
\hat{\lambda}(W) \approx \lambda(W).
$$

- Training চলাকালে `W` ধীরে বদলায়।
- তাই previous `u` ও `v` reuse করলে প্রতিটি step-এ এক iteration যথেষ্ট হতে পারে।

### 3.10 Problem with 1-Lipschitz layers: signal attenuation

Notes জোর দিয়ে বলে যে 1-Lipschitz layer **contractive**:

$$
\|y\|_2 \le \|x\|_2.
$$

এর মানে প্রতি layer-এ signal-এর magnitude attenuate হতে পারে।

এই দৃষ্টিকোণ থেকে spectral normalisation বিশেষভাবে খারাপ বলা হয়েছে: input vector যদি `W`-এর dominant eigenvector-এর সঙ্গে align না করে, magnitude attenuated হয়।

### 3.11 Other one-Lipschitz layers

Notes attenuation কমানোর জন্য দুটি alternative strategy cover করে।

#### 3.11.1 Almost Orthogonal Lipschitz (AOL) layer

**Intuition.** Orthogonal matrix vector length preserve করে, যেমন rotation বা reflection। Weight-গুলোকে orthogonal-এর কাছাকাছি থাকতে encourage করলে signal attenuation কমানো যায়।

**Formal definition.** AOL linear layer:

$$
\ell(x) = W D x + b,
$$

যেখানে `D` diagonal এবং:

$$
D_{ii} = \left(\sum_j |W^T W|_{ij}\right)^{-\frac{1}{2}}.
$$

#### 3.11.2 Convex Potential (CPL) layer

**Intuition.** Residual connection যোগ করা যাতে signal unalteredভাবে pass through করতে পারে।

**Formal definition.** CPL layer হলো residual block:

$$
\ell(x) = x - \frac{2}{\lambda(W)^2} W^T \sigma(Wx + b),
$$

where:

- `\lambda(W)` হলো `W`-এর spectral norm।
- `\sigma(\cdot)` হলো যেকোনো 1-Lipschitz, non-decreasing, element-wise activation function।

Notes বলছে এটি কেন কাজ করে তার deeper reason referenced CPL paper-এ আছে।

### 3.12 Special one-Lipschitz activations

Notes বলছে সবচেয়ে popular activations ইতিমধ্যে 1-Lipschitz:

- ReLU।
- Sigmoid।
- TanH।

এগুলোকে 1-Lipschitz linear layer-এর সঙ্গে combine করে complete neural network model তৈরি করা যায়।

তবে theoretical research দেখিয়েছে যে specific circumstances-এ এই common activations network-এর expressive capabilities কমাতে পারে।

তাই network-এর মধ্য দিয়ে signal magnitude preserve করতে নতুন activation function propose করা হয়েছে।

#### Absolute Value activation

Formal definition:

$$
\mathrm{Abs}: \mathbb{R}^n \to \mathbb{R}^n,
$$

where:

$$
\mathrm{Abs}(x)_i = |x_i|.
$$

#### GroupSort activation

Notes define করে:

$$
\mathrm{GroupSort}_k : \mathbb{R}^n \to \mathbb{R}^n.
$$

Surrounding explanation বলছে:

- Input vector `x`-কে size `k`-এর contiguous chunk-এ divide করা।
- প্রতিটি chunk descending order-এ sort করা।
- Chunk-এর সংখ্যা extracted text-এ `\lceil n/k \rceil` হিসেবে লেখা, কিন্তু rendered formula-তে bracket notation visually ceiling/floor notation-এর মতো দেখায়।

[UNCLEAR] Printed formula একই index দুপাশে repeat করছে বলে মনে হয়:

$$
\mathrm{GroupSort}_k(x)_i \ge \mathrm{GroupSort}_k(x)_i,
$$

condition সহ:

$$
\forall i \ge j \quad \text{such that} \quad
\left\lfloor \frac{i}{k} \right\rfloor =
\left\lfloor \frac{j}{k} \right\rfloor.
$$

Explanatory sentence অনুযায়ী intended right-hand side সম্ভবত `j`-indexed entry, কিন্তু printed notes recording/source-এর সঙ্গে check করা উচিত।

Notes বলছে Abs এবং GroupSort যে 1-Lipschitz—তার formal proof reader-এর exercise হিসেবে রাখা হয়েছে।

### 3.13 Arbitrary Lipschitz constants

প্র্যাক্টিক্যালি আমরা একটি `c`-Lipschitz neural network `f` চাইতে পারি, যেখানে:

$$
L_f \le c.
$$

Notes বলছে আমরা করতে পারি:

1. একটি 1-Lipschitz network build করা।
2. এর output-কে `c` দিয়ে multiply করা।

#### Product by a constant

Lipschitz constant `L_f`-সহ function `f` দেওয়া হলে define:

$$
g(x) = c \cdot f(x).
$$

Notes বলছে `g`-এর Lipschitz constant:

$$
L_g = c \cdot L_f.
$$

[UNCLEAR] Rendered definition-এ typesetting glitch আছে: `L_g = c · · · L_f`, এবং এটি `c \in \mathbb{R}` বলে। Proof-এ `c`-কে nonnegative scaling factor হিসেবে ব্যবহার করা হয়েছে। Sign/absolute-value convention গুরুত্বপূর্ণ হলে recording/source check করা দরকার।

#### Proof steps

Definition থেকে শুরু:

$$
\|g(x) - g(x')\|_p
= \|c \cdot f(x) - c \cdot f(x')\|_p.
$$

Notes-এ যেমন লেখা, `c` factor out:

$$
= c\|f(x) - f(x')\|_p.
$$

`f`-এর Lipschitzness ব্যবহার:

$$
\le c \cdot L_f \|x - x'\|_p.
$$

তাই notes অনুযায়ী `L_g = c \cdot L_f` একটি valid Lipschitz constant।

### 3.14 Expressivity vs robustness trade-off

Notes বলছে `c` vary করে আমরা trade-off explore করতে পারি:

- **Expressive power:** বড় `c`।
- **Robustness:** ছোট `c`।

Notes আরও বলে robust architectures সাধারণত lower accuracy দেয়, তাই সঠিক balance empirical experimentation দিয়ে choose করতে হয়।

---

## 4. Randomised Smoothing

### 4.1 Recap: randomised smoothing কোথায় fit করে

Randomised smoothing এই সপ্তাহের তৃতীয় adversarial defence।

অন্যান্য technique-এর সঙ্গে তুলনা:

- Adversarial training train time-এ training data বদলায়।
- Lipschitz-bounded neural networks train time-এ architecture বদলায়।
- Randomised smoothing inference-এ probabilistic input ব্যবহার করে।

স্লাইডে এর main advantage ও disadvantage বলা হয়েছে:

- **Pro:** existing model reuse করা যায়।
- **Con:** inference slower।

### 4.2 Intuition

Lecture notes randomised smoothing-কে adversarial input perturbation থেকে defend করার deceptively simple কিন্তু effective method হিসেবে বর্ণনা করেছে।

**Core intuition:**

- Input `x`-এর কাছে adversarial example থাকতে পারে।
- কিন্তু `x`-এর চারপাশের বেশিরভাগ neighbouring input এখনও correctly classified হতে পারে।
- Inference time-এ input-এ random noise যোগ করে repeatedly classify করা।
- যদি noisy neighbour-গুলোর majority correctly classified হয়, smoothed classifier ছোট adversarial perturbation resist করতে পারে।

Notes/slide-এর visual example:

- Input `x` একটি blue decision region-এ আছে।
- ছোট adversarial perturbation এটিকে nearby green region-এ সরাতে পারে।
- তবে perturbed point-এর neighbourhood-এর বেশিরভাগ এখনও blue।
- Adversarial point-এর চারপাশে multivariate Gaussian distribution থেকে অনেক point sample করলে, যেমন

$$
\mathcal{N}(x', \sigma^2 I),
$$

অনেক input blue হিসেবে classified হবে।

### 4.3 Formal definition of randomised smoothing

Classifier:

$$
f : \mathbb{R}^n \to C,
$$

যেখানে `C` output class-এর set, smoothed classifier `g`:

$$
g(x) \equiv \arg\max_{c \in C} \mathbb{P}(f(x + \xi) = c),
$$

where:

$$
\xi \sim \mathcal{N}(0, \sigma^2 I)
$$

হলো variance `\sigma^2`-সহ একটি `n`-dimensional normally distributed random variable।

**Intuition vs formalism:**

- **Intuition:** একই input-এর noisy version-গুলোর ওপর vote করা।
- **Formalism:** Predicted class হলো input-এর Gaussian perturbation-এর অধীনে maximum probability-র class।

স্লাইডে একই goal এভাবে বলা হয়েছে:

$$
\mathbb{P}_{\xi \sim \mathcal{N}(0,\sigma^2 I)}(f(x + \xi) = c)
$$

`f(x)` directly compute করার বদলে।

### 4.4 The smoothing parameter `\sigma`

Variance `\sigma^2` smoothing-এর amount control করে।

- `\sigma \to \infty` হলে অতিরিক্ত smoothing introduce হয়, এবং সব output prediction একই হয়ে যাওয়ার দিকে যায়।
- `\sigma \to 0` হলে smoothed classifier base model `f`-এর খুব কাছাকাছি হয়ে যায়।

এটি trade-off তৈরি করে:

- High `\sigma`: বেশি robustness।
- Low `\sigma`: বেশি predictive accuracy।

### 4.5 Connection to Lipschitz continuity

Notes বলছে randomised smoothing base classifier `f` এবং normal distribution-এর মধ্যে convolution করে:

$$
\mathcal{N}(0, \sigma^2 I).
$$

এটি `f`-এর slope কমায়।

Notes-এর figure-এ দেখানো হয়েছে:

- একটি unsmoothed base classifier `f(x)`।
- Smoothed versions, যেখানে `\sigma = 0.05`, `\sigma = 0.1`, এবং `\sigma = 0.2`।
- বড় `\sigma` sharp change-গুলোকে আরও strongly smooth করে।

### 4.6 Lipschitzness of smoothed classifiers

#### Formal statement

`f` ও `g` উপরের মতো base এবং smoothed classifier।

ধরা যাক `c_A` এবং `c_B` top-scoring classes, এবং probability bound satisfy করে:

$$
\mathbb{P}(f(x + \xi) = c_A)
\ge \underline{p_A}
\ge \overline{p_B}
\ge \max_{c_B \ne c_A}
\mathbb{P}(f(x + \xi) = c_B).
$$

তাহলে smoothed classifier একটি specific radius `\epsilon`-এর ভেতরের সব perturbation-এর জন্য robust। অর্থাৎ:

$$
g(x') = c_A
$$

for all:

$$
\|x - x'\|_2 < \epsilon,
$$

where:

$$
\epsilon = \frac{\sigma}{2}
\left(
\Phi^{-1}(\underline{p_A}) - \Phi^{-1}(\overline{p_B})
\right).
$$

Here:

$$
\Phi^{-1}(\cdot)
$$

হলো normal quantile function, অর্থাৎ normal distribution-এর cumulative distribution-এর inverse।

[UNCLEAR] Notes বলছে এটি `\mathcal{N}(0, \sigma^2)`-এর inverse cumulative distribution, কিন্তু formula আলাদাভাবে `\sigma` দিয়ে multiply করে। Implementation detail-এর জন্য `\Phi`-এর exact convention দরকার হলে source revisit করা উচিত।

#### Proof sketch from the lecture notes

Proof-এ Weierstrass transform-এর একটি result ব্যবহার করা হয়েছে:

$$
\hat{h}(x)
= \mathbb{E}_{\xi \sim \mathcal{N}(0, \sigma^2 I)} h(x + \xi),
$$

যেকোনো function-এর জন্য:

$$
h : \mathbb{R}^n \to [0,1].
$$

Useful result states:

$$
\Phi^{-1}(\hat{h}(x))
$$

এর Lipschitz constant:

$$
\frac{1}{\sigma}.
$$

Base classifier-এর প্রতিটি output class `c`-এর জন্য indicator function define করা হয়:

$$
h_c(x) =
\begin{cases}
1, & \text{if } f(x) = c,\\
0, & \text{otherwise.}
\end{cases}
$$

তাহলে প্রতিটি:

$$
\Phi^{-1}(\hat{h}_c(x))
$$

এর Lipschitz constant `1/\sigma`।

এই score-গুলো Lipschitz-bounded classifier হিসেবে ব্যবহার করলে robustness condition requires:

$$
\forall x, x' \in \mathbb{R}^n,
\qquad
\|x - x'\| \le \epsilon
\quad \land \quad
\Phi^{-1}(\hat{h}_{c_A}(x))
- \Phi^{-1}(\hat{h}_{c_B}(x))
\ge \frac{2\epsilon}{\sigma}.
$$

[UNCLEAR] Notes এখানে “Statement ??” reference করে; এটি সম্ভবত earlier Lipschitz classifier robustness statement, কিন্তু PDF-তে cross-reference broken।

যেহেতু:

$$
\hat{h}_{c_A} \ge \underline{p_A},
\qquad
\hat{h}_{c_B} \le \overline{p_B},
$$

আমরা পাই:

$$
\frac{2\epsilon}{\sigma}
\le
\Phi^{-1}(\underline{p_A}) - \Phi^{-1}(\overline{p_B})
\le
\Phi^{-1}(\hat{h}_{c_A}(x)) - \Phi^{-1}(\hat{h}_{c_B}(x)).
$$

এতে closed-form robustness radius পাওয়া যায়:

$$
\epsilon = \frac{\sigma}{2}
\left(
\Phi^{-1}(\underline{p_A}) - \Phi^{-1}(\overline{p_B})
\right).
$$

### 4.7 Why Monte Carlo approximation is needed

`g`-এর exact definition-এর জন্য base classifier `f`-এর exact output probability compute করতে হয়। Notes বলছে সাধারণভাবে এটি computationally expensive এবং NP class-এ পড়ে।

তাই lecture Monte Carlo estimation ব্যবহার করে।

### 4.8 Algorithm 1: Monte Carlo Sampling

Pseudocode থেকে implied inputs: classifier `f`, input `x`, smoothing parameter `\sigma`, number of samples `k`, class set `C`।

1. Counts initialise:

$$
k_c \leftarrow 0,
\qquad \forall c \in C.
$$

2. `k` iterations-এর জন্য:

Noise sample করা:

$$
\xi \sim \mathcal{N}(0, \sigma^2 I).
$$

Noisy input classify করা:

$$
c \leftarrow f(x + \xi).
$$

Count increment করা:

$$
k_c \leftarrow k_c + 1.
$$

3. Return:

$$
k_1, \dots, k_{|C|}.
$$

**Interpretation.** প্রতিটি count `k_c` হলো Gaussian perturbation-এর অধীনে base classifier class `c` কতবার predict করেছে।

### 4.9 Algorithm 2: Smoothed Prediction

1. Monte Carlo sampling run করা:

$$
k_1, \dots, k_{|C|}
\leftarrow
\mathrm{MonteCarloSampling}(f, x, \sigma, k).
$$

2. Top-voted class বের করা:

$$
\hat{c}_A \leftarrow \arg\max_{c \in C} k_c.
$$

3. Second-highest class বের করা:

$$
\hat{c}_B \leftarrow \arg\max_{c \ne \hat{c}_A} k_c.
$$

4. Two-sided binomial test compute করা:

$$
p \leftarrow \mathrm{TwoSidedBinomialTest}
\left(k_{\hat{c}_A},\; k_{\hat{c}_A} + k_{\hat{c}_B},\; \frac{1}{2}\right).
$$

5. If:

$$
p \le \alpha,
$$

return:

$$
\hat{c}_A.
$$

6. Otherwise, return:

$$
\text{``abstain''}.
$$

**Important interpretation.** Algorithm sampled majority class-কে blind trust করে না। Top class truly top class হওয়ার সম্ভাবনা statistically significant কিনা তা নির্ধারণ করতে statistical significance test ব্যবহার করে।

### 4.10 Rank verification

#### Formal definition from the notes

ধরা যাক counts:

$$
k_1, \dots, k_{|C|}
\sim
\mathrm{Multinomial}(\pi_1, \dots, \pi_{|C|}, k),
$$

class probabilities:

$$
\pi_1, \dots, \pi_{|C|}.
$$

Let:

$$
\hat{c}_A = \arg\max_c k_c,
$$

and:

$$
\hat{c}_B = \arg\max_{c \ne \hat{c}_A} k_c.
$$

এগুলো most এবং second-most sample পাওয়া class।

তাহলে likelihood যে:

$$
\hat{c}_A \ne \arg\max_c \pi_c
$$

সমান p-value-এর, two-sided binomial test-এ observe করা:

$$
k_{\hat{c}_A}
$$

with:

$$
\pi = \frac{1}{2},
\qquad
k = k_{\hat{c}_A} + k_{\hat{c}_B}.
$$

#### Intuition

p-value দেয়, null hypothesis-এর অধীনে `k_{\hat{c}_A}` samples বা আরও extreme event observe করার likelihood, যেখানে top two classes equally likely:

$$
\pi = \frac{1}{2}.
$$

যদি p-value `\alpha`-এর চেয়ে lower হয়, আমরা conclude করি wrong prediction return করার probability `\alpha`-এর চেয়ে কম।

না হলে classifier abstain করে, “I do not know” return করে।

### 4.11 Algorithm 3: robustness radius estimation

Goal হলো Lipschitzness result দ্বারা certified radius estimate করে smoothed classifier-এর robust accuracy compute করা।

#### Algorithm

1. Monte Carlo sampling run করা:

$$
k_1, \dots, k_{|C|}
\leftarrow
\mathrm{MonteCarloSampling}(f, x, \sigma, k).
$$

2. Lower binomial bound compute করা:

$$
\underline{p_A}
\leftarrow
\mathrm{LowerBinomialBound}(k_{\hat{c}_A}, k, 1 - \alpha).
$$

3. If:

$$
\underline{p_A} \ge \frac{1}{2},
$$

return:

$$
\sigma \Phi^{-1}(\underline{p_A}).
$$

4. Otherwise return:

$$
\text{``abstain''}.
$$

[UNCLEAR] Algorithm 3-এর pseudocode `\hat{c}_A` ব্যবহার করে কিন্তু explicit input হিসেবে দেখায় না। Notes explain করে যে `\hat{c}_A` Algorithm 2 থেকে produce করে তারপর Algorithm 3-তে provide করা উচিত।

#### Derivation of the returned radius

Notes দুটি fact-এর ওপর rely করে।

প্রথমত, ব্যবহার করা হয়:

$$
1 - \underline{p_A} \ge 1 - p_A \ge p_B
$$

valid upper bound হিসেবে:

$$
\overline{p_B}.
$$

এর অর্থ algorithm শুধু `\underline{p_A}` estimate করতে হয়, complexity কমে।

দ্বিতীয়ত, যেহেতু:

$$
p_A \ge p_c
$$

যেকোনো class-এর জন্য:

$$
c \ne c_A,
$$

algorithm top-scoring class-এর যেকোনো guess `\hat{c}_A` ব্যবহার করে radius estimate করতে পারে, even if guess incorrect। Caveat হলো `\hat{c}_A` choice এবং `\underline{p_A}` estimation statistically independent হতে হবে।

Notes বলছে এই independence achieve করা যায়:

1. Algorithm 2 run করে।
2. Resulting `\hat{c}_A` Algorithm 3-তে input হিসেবে provide করে।

তারপর underlying binomial probability-এর lower bound estimate করা হয়:

$$
\pi_{\hat{c}_A},
$$

যেখানে সব other class merge করা হয়:

$$
1 - \pi_{\hat{c}_A}.
$$

Goal হলো এমন lower bound খুঁজে পাওয়া যাতে:

$$
\underline{p_A} \le \pi_{\hat{c}_A}
$$

confidence সহ:

$$
1 - \alpha.
$$

Finally:

$$
\Phi^{-1}(\overline{p_B})
= \Phi^{-1}(1 - \underline{p_A})
= -\Phi^{-1}(\underline{p_A}).
$$

Radius formula-তে substitute:

$$
\epsilon
= \frac{\sigma}{2}
\left(
\Phi^{-1}(\underline{p_A}) - \Phi^{-1}(\overline{p_B})
\right)
$$

to get:

$$
\epsilon
= \frac{\sigma}{2}
\left(
\Phi^{-1}(\underline{p_A}) + \Phi^{-1}(\underline{p_A})
\right)
= \sigma\Phi^{-1}(\underline{p_A}).
$$

If:

$$
\underline{p_A} < \frac{1}{2},
$$

then algorithm cannot prove:

$$
p_A \ge p_B,
$$

so radius undefined এবং algorithm abstains।

---

## 5. Coursework and exam-relevant flags

### 5.1 Explicit coursework flag

**COURSEWORK FLAG: Coursework I - Adversarial Attacks & Defences**

Randomised smoothing স্লাইডে coursework components list করা হয়েছে:

| Component | Points |
|---|---:|
| FGSM Attacks | 4 points |
| Robustness Radius | 6 points |
| Interval Analysis | 6 points |
| Randomised Smoothing | 4 points |
| [UNCLEAR: unlabeled row] | 4 points |
| Total | 24 points |

স্লাইডে আরও বলা হয়েছে:

- Note-taking contributions-এর জন্য one extra point।

[UNCLEAR] Coursework table-এ একটি visible additional 4-point row আছে যার label নেই। Recording বা original slide source recheck করা দরকার।

### 5.2 Exercise flag

**EXERCISE FLAG:** Abs এবং GroupSort activations যে 1-Lipschitz—তার formal proof reader-এর exercise হিসেবে রাখা হয়েছে।

### 5.3 No transcript-specific exam flags available

[UNCLEAR] Uploaded zip-এ আলাদা transcript file ছিল না। তাই spoken statements যেমন “this will be on the exam,” “common mistake,” বা “you should know this” capture করা যায়নি, যদি না সেগুলো slides/lecture notes-এ visible থাকে।

---

## 6. Connections across lectures and applications

### 6.1 Adversarial training -> Lipschitz-bounded networks

Lipschitz lecture নিজেকে adversarial training-এর limitation-এর response হিসেবে explicitly frame করে:

- Adversarial training ML practitioner-দের জন্য flexible এবং intuitive।
- কিন্তু convergence বা attack absence-এর guarantee নেই।
- Lipschitz-bounded architectures provable guarantee-সহ safe-by-design alternative হিসেবে introduce করা হয়েছে।

### 6.2 Lipschitz-bounded networks -> randomised smoothing

Randomised smoothing notes smoothing-কে Lipschitz continuity-এর সঙ্গে connect করে:

- Randomised smoothing-কে Gaussian distribution-এর সঙ্গে convolution হিসেবে describe করা হয়।
- এটি classifier-এর slope কমায়।
- তারপর Lipschitz-style argument ব্যবহার করে formal robustness radius derive করা হয়।

### 6.3 Train-time vs inference-time defences

Slide taxonomy technique-গুলোকে কোথায় intervene করে তার ভিত্তিতে connect করে:

- Adversarial training: train-time data augmentation।
- Lipschitz-bounded networks: train-time architectural change।
- Randomised smoothing: inference-time probabilistic input transformation।

### 6.4 Forward connection to later course topics

Final randomised smoothing slide বলছে next topics:

- Model reconstruction attacks।
- Data reconstruction attacks।
- Code tutorial।

---

## 7. Consolidated unclear sections to revisit in recording/source

1. **Transcript missing.** Archive-এ PDFs only পাওয়া গেছে; কোনো separate transcript পাওয়া যায়নি। Spoken exam flags এবং explanations missing থাকতে পারে।
2. **Adversarial training attack formula.** Slide `\epsilon \in E`-এর ওপর maximise করে কিন্তু loss-এর ভেতরে `x_i + \epsilon_i` print করে। Intended notation `\epsilon` নাকি indexed `\epsilon_i`—check করা দরকার।
3. **Power iteration vector dimensions.** Algorithm `v,u \leftarrow \mathcal{N}(0,1)` initialise করে কিন্তু dimension specify করে না।
4. **GroupSort formula.** Printed formula দুপাশে index `i` repeat করছে বলে মনে হয়, অথচ text বলে প্রতিটি group descending order-এ sort করা হয়। Original source/recording check করা দরকার।
5. **Constant-scaling Lipschitz formula.** Definition-এ typesetting glitch `c · · · L_f` আছে, এবং proof `c`-কে nonnegative ধরে ব্যবহার করে, যদিও stated `c \in \mathbb{R}`।
6. **Randomised smoothing cross-reference.** Proof sketch “Statement ??” reference করে; context অনুযায়ী এটি earlier Lipschitz classifier robustness result।
7. **Normal quantile convention.** Notes `\Phi^{-1}`-কে `\mathcal{N}(0,\sigma^2)`-এর inverse CDF হিসেবে define করে, কিন্তু robustness formula ইতিমধ্যে `\sigma` দিয়ে multiply করে। Implement করার আগে convention check করা দরকার।
8. **Radius estimation algorithm input.** Algorithm 3 `\hat{c}_A` ব্যবহার করে কিন্তু displayed input/signature থেকে omit করে; notes পরে বলে এটি Algorithm 2 থেকে আসা উচিত।
9. **Coursework table.** Visible slide-এ একটি 4-point row unlabeled।
