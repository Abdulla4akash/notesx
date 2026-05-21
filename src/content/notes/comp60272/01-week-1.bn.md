---
subject: COMP60272
chapter: 1
title: "Week 1"
language: bn
---

# COMP60272 — AI-এর নিরাপত্তা ও গোপনীয়তা: সপ্তাহ ১ স্টাডি নোটস

**কোর্স:** COMP60272 — Security and Privacy of AI.  
**লেকচারের বিষয়/পরিসর:** সপ্তাহ ১-এ কোর্সের পরিচিতি দেওয়া হয়েছে, AI security/privacy-কে কাছাকাছি ক্ষেত্র যেমন AI Ethics, AI Safety এবং AI for Cybersecurity থেকে আলাদা করা হয়েছে, মূল ML notation ও MLOps পুনরালোচনা করা হয়েছে, ML pipeline-এর সাধারণ threat শ্রেণিবদ্ধ করা হয়েছে, এবং threat-কে optimisation problem হিসেবে মডেল করার ধারণা পরিচয় করানো হয়েছে।

**ব্যবহৃত উৎস:**  
- `w1.1_intro.pdf` — Introduction slides  
- `w1.2_threats.pdf` — ML Pipeline & Common Threats slides  
- `w1.2_notes.pdf` — notation ও definitions-সংক্রান্ত lecture notes  
- `w1.3_modelling.pdf` — Mathematical Modelling of Threats slides  

**উৎস-সংক্রান্ত নোট:** auto-generated lecture transcript এই চ্যাটে দেওয়া হয়নি। এই নোটগুলো uploaded slides এবং lecture-notes PDF ব্যবহার করে তৈরি। transcript-dependent অথবা visual/notation-ambiguous অংশগুলো **[UNCLEAR / অস্পষ্ট]** হিসেবে চিহ্নিত করা হয়েছে।

---

## 1. বড় ছবি: এই কোর্সটি কী নিয়ে

### 1.1 Security and Privacy of AI, AI Ethics, AI Safety, বা AI for Cybersecurity-এর একই জিনিস নয়

প্রারম্ভিক লেকচারটি **Security & Privacy of AI**-কে কয়েকটি overlapping কিন্তু আলাদা ক্ষেত্রের মধ্যে অবস্থান করায়:

- **AI Ethics**
- **AI Safety**
- **Security & Privacy of AI**

Slides-এ স্পষ্টভাবে বলা হয়েছে:

> **Security & Privacy of AI ≠ AI for Cybersecurity**

AI for cybersecurity বলতে বোঝায় cyber systems defend বা attack করার জন্য AI ব্যবহার করা। কিন্তু এই কোর্সটি AI/ML systems-এর নিজেদের উপর threat নিয়ে।

---

### 1.2 AI Ethics

#### সহজ ধারণা

AI ethics হলো AI systems নৈতিকভাবে গ্রহণযোগ্য এবং সামাজিকভাবে দায়িত্বশীল উপায়ে develop ও use হচ্ছে কি না, সেই প্রশ্নের সঙ্গে সম্পর্কিত।

#### slides থেকে formal definition

AI Ethics হলো:

> “A set of values, principles, and techniques [...] to guide moral conduct in the development and use of AI technologies.”

#### AI Ethics-এর অধীনে listed examples

- Fairness
- Algorithmic bias
- Sustainability and climate impact
- Accountability
- Transparency
- Explainability
- Interpretable AI
- Machine ethics
- Copyright

---

### 1.3 AI Safety

#### সহজ ধারণা

AI safety ML deployment-কে আরও beneficial করা এবং dangerous failures এড়ানোর ওপর ফোকাস করে, বিশেষ করে rare, long-term, বা high-impact risk-এর ক্ষেত্রে।

#### slides থেকে formal definition

AI Safety হলো:

> “Making the adoption of ML more beneficial, with emphasis on long-term and long-tail risks.”

#### AI Safety-এর অধীনে listed examples

- Alignment
- Control
- Existential risks
- Artificial general intelligence, AGI
- Artificial superintelligence, ASI
- Systemic safety
- AI-enabled cyberattacks
- AI-enabled bioterrorism

---

### 1.4 Security & Privacy of AI

#### সহজ ধারণা

এই কোর্সটি ML models, ML data, এবং ML deployment pipelines-কে ঘিরে attacks ও defences নিয়ে কাজ করে।

#### slides থেকে formal definition

Security & Privacy of AI বলতে বোঝায়:

> “Attacks and defenses that undermine the security and privacy of ML models,”

এগুলোই **adversarial machine learning** ক্ষেত্রকে define করে।

#### Security & Privacy of AI-এর অধীনে listed examples

- Adversarial attacks
- Data poisoning
- Backdoors
- Membership inference
- Jailbreaks
- Prompt injection
- Model stealing
- Differential privacy
- Byzantine robustness

---

## 2. Motivation: AI security ও privacy কেন গুরুত্বপূর্ণ

### 2.1 Real-world incidents এবং failure cases

Intro slides সাম্প্রতিক AI-related incidents-কে motivation হিসেবে ব্যবহার করে।

দেখানো examples:

- **Air Canada chatbot misinformation** নিয়ে একটি BBC article।
- modern warfare-এর “kill zone” নিয়ে একটি military/warfare article।
- OECD AI incident database-এর charts, যেখানে সময়ের সঙ্গে AI-related incidents and hazards দেখানো হয়েছে।

OECD chart-এ দেখানো categories:

- Human or fundamental rights
- Public interest
- Psychological
- Physical injury
- Economic/property
- Reputational
- Physical death
- Other
- Environmental

**[UNCLEAR / অস্পষ্ট]** Slides-এ incident charts ও links আছে, কিন্তু lecturer এগুলো কীভাবে interpret করেছেন, কোন examples ব্যাখ্যা করেছেন, এবং main takeaways কী বলেছেন—এসব ধরার জন্য transcript দরকার।

---

### 2.2 Proposed responses: regulations এবং standards

Intro lecture AI risk-এর response হিসেবে regulation ও standardisation-কে frame করে।

---

#### Regulations

Slides-এ list করা হয়েছে:

##### UK National AI Strategy, 2021

- AI governance framework establish করার লক্ষ্য নির্ধারণ করে।

##### European Union AI Act, 2024

- “high risk” বনাম unacceptable AI applications define করে।

##### অন্যান্য international initiatives

- AI Safety Summit 2023.
- Network of AI Safety Institutes.

---

#### Standards

Slides-এ standards নিয়েও আলোচনা আছে, বিশেষ করে aeronautics context-এ।

##### EUROCAE ED-76 / RTCA DO-200

- Aeronautical data processing-এর standards।
- data creation থেকে use পর্যন্ত data flow control করে।

##### ED-324 / ARP 6983

- AI implement করা aeronautical safety-related products-এর development এবং certification/approval-এর process standard।
- implementation phase জুড়ে model semantics preserved আছে—এর evidence দরকার।

---

### 2.3 Security mindset

Lecturer-এর framing তিনটি role-এর মধ্য দিয়ে যায়:

#### Data scientist

- Data clean করে।
- Models train করে।

#### ML engineer

- Deployment handle করে।
- Efficiency handle করে।
- Infrastructure handle করে।

#### Security expert

- Worst-case scenario নিয়ে চিন্তা করে।

Slides এটিকে **“paranoid” mindset** বলে।

Slide-এর quote:

> “There’s one very reliable way to stop bad things from happening and that’s to stop anything from happening”  
> — Steve Furber

#### সহজ ধারণা

Security মানে average-case model performance-এর বাইরে চিন্তা করা। Security expert জিজ্ঞেস করে: adversarial, worst-case, malicious, বা unusual condition-এ কী ভুল হতে পারে?

---

## 3. Course structure, learning outcomes, এবং assessment

### 3.1 Course structure

কোর্সটি তিনটি main part-এ ভাগ করা।

#### Part 1: Adversarial ML & Privacy Attacks

- Lecturer: Dr Edoardo Manino.
- Weeks 1–5.

#### Part 2: Security of Language Models

- Lecturer: Dr Mehran Hosseini.
- Weeks 5 and 7.

#### Part 3: Federated Learning & Cryptography for ML

- Lecturer: Dr Zhipeng Wang.
- Weeks 7–11.

---

### 3.2 Intended learning outcomes

কোর্সের learning outcomes:

#### ILO 1

Modern machine learning pipeline-এর common threats describe করা।

#### ILO 2

AI components-এর adversarial ও privacy attacks-এর algorithmic details explain করা এবং appropriate defence techniques identify করা।

#### ILO 3

একটি given AI component-এর জন্য attacks ও defences design করা, যেখানে appropriate computational এবং informational constraints বিবেচনায় নেওয়া হবে।

#### ILO 4

একটি given AI model-এ adversarial vulnerabilities খুঁজে বের করা এবং patch করার জন্য software tools apply করা।

#### ILO 5

AI models protect করার জন্য privacy-preserving techniques deploy করতে available libraries use করা।

#### ILO 6

State-of-the-art AI models-এর risks ও countermeasures বিভিন্ন audience-এর কাছে communicate করা।

#### ILO 7

একটি given application-এর জন্য AI security ও privacy techniques কতটা suitable তা assess করা।

---

### 3.3 Teaching and learning material

#### Core material

- Slides and quizzes.
- Lecture notes.
- Code tutorials.

#### Additional material

- Canvas-এ reading list।
- Slides-এ web resources।
- Canvas discussion forum।

Slides অনুযায়ী, প্রতিটি lecture-এর আগে new material release করার লক্ষ্য রাখা হয়েছে।

---

### 3.4 Assessment

#### Exam flag

**EXAM FLAG:** Written exam-এর weight **50%** এবং এটি **সব topics cover করে**।

#### Assessment breakdown

##### Formative exercises

- Class চলাকালীন quizzes এবং tutorials।

##### Coursework I — 25%

- Topic: Adversarial Attacks and Defences.
- Due: 16/3/2026 at 2pm.

##### Coursework II — 25%

- Topic: Federated Learning.
- Due: 18/05/2026 at 2pm.

##### Written exam — 50%

- Covers all topics.
- Summer session-এ।

---

### 3.5 Coursework I topics এবং points

Coursework I-এর topic হলো **Adversarial Attacks & Defences**।

Listed components:

| Topic | Points |
|---|---:|
| FGSM Attacks | 4 |
| Robustness Radius | 6 |
| Interval Analysis | 6 |
| Randomised Smoothing | 4 |
| [UNCLEAR: unlabeled row / অস্পষ্ট: label নেই] | 4 |
| Total | 24 |

Additional note:

- Note-taking contributions-এর জন্য one extra point।

**[UNCLEAR / অস্পষ্ট]** Slide table-এ 4 points worth একটি additional row দেখা যাচ্ছে, কিন্তু parsed text-এ label readable নয়।

---

## 4. ML recap: security material-এর জন্য দরকারি basic concepts

Threat lecture তিনটি strand দিয়ে শুরু হয়:

1. **Data science**
   - Basic ML concepts-এর recap।
2. **ML engineering**
   - Supply chain এবং infrastructure।
3. **Security & Privacy of AI**
   - Threat taxonomies।

---

### 4.1 Supervised learning

#### সহজ ধারণা

Supervised learning এমন examples থেকে model train করে যেখানে প্রতিটি input-এর একটি target output থাকে।

#### slides থেকে formal setup

Dataset:

$$
\{x_i, y_i\}_{i=1}^N
$$

Hypothesis class:

$$
H \equiv \{ f_\theta(x) \}
$$

Slide-এ লেখা loss function:

$$
L(x_i, y_i, f_\theta)
=
\frac{1}{N}
\sum_{i=1}^{N}
d(f_\theta(x_i), y_i)
$$

where:

$$
d(f_\theta(x_i), y_i)
$$

model output এবং true target-এর discrepancy measure করে।

**[UNCLEAR / অস্পষ্ট]** Slide-এ loss-কে $L(x_i,y_i,f_\theta)$ হিসেবে লেখা হয়েছে, আবার একই সঙ্গে সব $i=1,\dots,N$ এর ওপর sum করা হয়েছে। সম্ভবত এটি single-example loss নয়, বরং empirical dataset loss বোঝাতে intended। lecturer-এর exact notation confirm করতে transcript দরকার।

---

### 4.2 Hypothesis class

#### সহজ ধারণা

Hypothesis class হলো সেই set of functions যেখান থেকে learning algorithm একটি function বেছে নিতে পারে।

#### slides থেকে formal definition

$$
H \equiv \{ f_\theta(x) \}
$$

where:

- $f_\theta$ একটি model/function।
- $\theta$ model parameters denote করে।

“Hypothesis Classes” slide-এ visually model families-এর examples list করা হয়েছে:

- Linear regression
- Logistic regression
- Decision tree
- SVM
- KNN
- Dimensionality reduction
- Random forest
- K-means
- Naive Bayes

---

### 4.3 Classification vs regression

Slides target type এবং loss type দিয়ে classification ও regression আলাদা করে।

---

#### Classification

Target $y_i$ categorical:

$$
y_i \in C
$$

Loss examples:

- Cross entropy.

---

#### Regression

Target $y_i$ numerical:

$$
y_i \in \mathbb{R}^d
$$

Loss examples:

- Mean squared error.

---

### 4.4 Unsupervised learning vs reinforcement learning

Slides এগুলোকে supervised learning-এর সঙ্গে contrast করে।

#### Unsupervised learning

- $y_i$ missing।

#### Reinforcement learning

- প্রতিটি $i$ sequentially আসে।

#### Objective/loss changes

Listed examples:

- Energy potential.
- Regret minimisation.

**[UNCLEAR / অস্পষ্ট]** Slides unsupervised learning বা reinforcement learning-এর further formal definitions দেয় না। Spoken examples ধরতে transcript দরকার।

---

### 4.5 Deeper mathematical topics signposted

“deeper dive” slide বলে কোর্সটি নিচের জিনিসগুলো expect/review করে:

#### Mathematical notation

- Multivariate calculus.
- Linear algebra.
- Probability theory.

#### Hypothesis classes

- Linear regression.
- Neural networks.

#### Training parametrised models

- Empirical risk minimisation.
- Stochastic gradient descent.

**Exam relevance:** Slide-এ explicitly বলা হয়েছে “check out the lecture notes,” এবং exam সব topics cover করে। তাই নিচের lecture-notes definitions high-value revision material হিসেবে treat করা উচিত।

---

## 5. Lecture notes থেকে mathematical notation এবং definitions

Lecture-notes PDF চারটি foundation cover করে:

1. Linear models.
2. Neural networks.
3. Vector norms.
4. Empirical Risk Minimisation.

---

## 5.1 Linear / affine models

### সহজ ধারণা

অনেক ML model **linear** অথবা আরও precise ভাবে **affine** functions দিয়ে তৈরি।

Notes explicit ভাবে বলে এগুলো দেখা যায়:

- Support vector machines.
- Logistic regression.
- Several neural-network layers:
  - Linear layers.
  - Convolutional layers.

একটি affine map input vector নিয়ে তার entries-এর weighted sums তৈরি করে এবং bias term যোগ করে।

---

### Formal definition: Affine Hypothesis Space

Input vector space:

$$
\mathbb{R}^m
$$

এবং output vector space:

$$
\mathbb{R}^n
$$

দেওয়া থাকলে affine mapping define করা হয়:

$$
f_\theta : \mathbb{R}^m \to \mathbb{R}^n
$$

parameters সহ:

$$
\theta = (W,b)
$$

where:

$$
W \in \mathbb{R}^{m \times n}
$$

and:

$$
b \in \mathbb{R}^n
$$

$W \in \mathbb{R}^{m \times n}$ এবং $b \in \mathbb{R}^n$-এর সঙ্গে consistent একটি clean coordinate form:

$$
f_\theta(x)_j
=
\sum_{i=1}^{m} x_i w_{ij} + b_j
$$

When:

$$
b = 0
$$

function $f_\theta$ linear।

Affine hypothesis space:

$$
H \equiv \{ f_\theta : \theta = (W,b) \}
$$

এবং এটি all linear classifiers and regressors-এর hypothesis space হিসেবে described।

**[UNCLEAR / অস্পষ্ট]** PDF-এর displayed coordinate formula extracted text-এ garbled/inconsistent দেখায়, indices এমন কিছু হিসেবে দেখা যায়:

$$
f_\theta(x)_i = \sum x_i w_{ij} + b_j
$$

উপরের cleaned version stated parameter dimensions $W \in \mathbb{R}^{m\times n}$, $b \in \mathbb{R}^n$ অনুসরণ করে। Exact index convention গুরুত্বপূর্ণ হলে original PDF/recording check করা দরকার।

---

## 5.2 Fully connected feedforward neural networks

### সহজ ধারণা

Feedforward neural network হলো এমন একটি function যা **layers** নামে ছোট functions compose করে তৈরি।

Fully connected network-এ layers সাধারণত affine transformations followed by nonlinear activation functions।

---

### Formal definition

Feedforward neural network হলো $L$ layers-এর composition:

$$
f_\theta
=
\ell_L
\circ
\ell_{L-1}
\circ
\cdots
\circ
\ell_2
\circ
\ell_1
$$

প্রতিটি layer একটি real-valued map।

Clean indexed notation-এ:

$$
\ell_i : \mathbb{R}^{n_{i-1}} \to \mathbb{R}^{n_i}
$$

Notes fully connected networks-এর জন্য দুই ধরনের layer define করে।

---

### Linear / affine layer

$$
\ell_i(x_{i-1})
=
W_i x_{i-1} + b_i
$$

where:

- $i$ layer index।
- $W_i$ weight matrix।
- $b_i$ bias vector।

**[UNCLEAR / অস্পষ্ট]** Extracted PDF $W_i \in \mathbb{R}^{n_{i-1}\times n_i}$ দেয়, যা row-vector বনাম column-vector convention-এর ওপর নির্ভর করতে পারে। Dimensions exactly assessed হলে recording/PDF check করা দরকার।

---

### Nonlinear activation layer

$$
\ell_i(x_{i-1})
=
\sigma(x_{i-1})
$$

where:

- $\sigma(\cdot)$ সাধারণত element-wise function।

---

### Common architecture pattern

Notes বলছে সবচেয়ে common design হলো interleave করা:

$$
\text{linear layer}
\quad \to \quad
\text{activation layer}
\quad \to \quad
\text{linear layer}
\quad \to \quad
\text{activation layer}
\quad \to \cdots
$$

with:

- $\ell_1$ linear।
- $\ell_L$ linear।

Popular activations listed:

- ReLU.
- Sigmoid.
- Hyperbolic tangent.
- SoftMax.

---

## 5.3 Activation functions

### ReLU — Rectified Linear Unit

#### সহজ ধারণা

ReLU positive entries রেখে দেয় এবং negative entries-কে zero-তে clip করে।

#### Formal definition

$$
\operatorname{ReLU} : \mathbb{R}^n \to \mathbb{R}^n
$$

$$
\operatorname{ReLU}(x)_i
=
\max(x_i,0)
$$

---

### Sigmoid activation

#### সহজ ধারণা

Sigmoid প্রতিটি real-valued input entry-কে 0 থেকে 1-এর মধ্যে map করে।

#### Formal definition

$$
\operatorname{Sigmoid} : \mathbb{R}^n \to \mathbb{R}^n
$$

$$
\operatorname{Sigmoid}(x)_i
=
\frac{1}{1+\exp(-x_i)}
$$

---

### Hyperbolic tangent — TanH

#### সহজ ধারণা

TanH আরেকটি element-wise nonlinear activation।

#### Formal definition

$$
\operatorname{TanH} : \mathbb{R}^n \to \mathbb{R}^n
$$

$$
\operatorname{TanH}(x)_i
=
\frac{\exp(x_i)-\exp(-x_i)}
{\exp(x_i)+\exp(-x_i)}
$$

---

### SoftMax activation

#### সহজ ধারণা

SoftMax একটি layer-wise activation, কারণ denominator-এর মাধ্যমে প্রতিটি output coordinate সব input coordinate-এর ওপর depend করে।

#### Formal definition

$$
\operatorname{SoftMax} : \mathbb{R}^n \to \mathbb{R}^n
$$

$$
\operatorname{SoftMax}(x)_i
=
\frac{\exp(x_i)}
{\sum_{j=1}^{n} \exp(x_j)}
$$

---

## 5.4 Vector norms

### সহজ ধারণা

Vector norms দেখা যায়:

- Loss functions-এ।
- Regularisation-এ।
- Training চলাকালীন constraints-এ।
- পরবর্তী adversarial-ML concepts যেমন perturbation size এবং robustness radius-এ।

Notes $p$-norms-এর family introduce করে।

---

### Formal definition: $p$-norm

Given:

$$
x, x' \in \mathbb{R}^d
$$

তাদের মধ্যে $p$-norm distance হলো:

$$
\|x-x'\|_p
=
\left(
\sum_{i=1}^{d}
|x_i-x_i'|^p
\right)^{1/p}
$$

---

### Formal definition: infinity norm

Infinity norm হলো maximum coordinate-wise difference:

$$
\|x-x'\|_\infty
=
\max_{i=1}^{d}
|x_i-x_i'|
$$

---

### Formal definition: matrix norm

Given:

$$
A \in \mathbb{R}^{m \times n}
$$

এর matrix norm:

$$
\lambda(A)
=
\max_{x \ne 0}
\frac{\|Ax\|_p}{\|x\|_p}
$$

When:

$$
p=2
$$

$\lambda(A)$-কে $A$-এর **spectral norm** বলা হয়।

---

## 5.5 Empirical Risk Minimisation, ERM

### সহজ ধারণা

একটি parametrised hypothesis space:

$$
H = \{f_\theta\}
$$

fixed হলে training মানে হলো সেই space থেকে “best” function বেছে নেওয়া।

Notes বলে “best” define করা কঠিন, কারণ **no free lunch theorem**, কিন্তু একটি common approach হলো loss function $L$-এর respect-এ expected error minimise করা function বেছে নেওয়া।

---

### Step 1: Expected-risk objective

Ideal objective:

$$
\theta^*
=
\arg\min_\theta
\mathbb{E}_{(x,y)\sim D}
\left[
L(f_\theta(x),y)
\right]
$$

এটি এমন parameters বেছে নেয় যার model true data distribution $D$-এর ওপর smallest average loss পায়।

---

### Step 2: Expected value unknown distribution-এর ওপর depend করে

Expected value over:

$$
z=(x,y)\sim D
$$

লেখা হয়:

$$
\mathbb{E}_{z\sim D}[g(z)]
\equiv
\int g(z)D(z)\,dz
$$

সমস্যা হলো $D$ সাধারণত unknown।

---

### Step 3: Expected risk-কে empirical average দিয়ে replace করা

ধরি $N$ independent and identically distributed samples-এর dataset আছে:

$$
\{(x_i,y_i)\}_{i=1}^{N} \sim D
$$

তাহলে expected risk empirically estimate করা যায়:

$$
\mathbb{E}_{(x,y)\sim D}
\left[
L(f_\theta(x),y)
\right]
\approx
\frac{1}{N}
\sum_{i=1}^{N}
L(f_\theta(x_i),y_i)
$$

Notes বলে এই empirical estimator i.i.d. assumption-এর অধীনে unbiased।

---

### Step 4: ERM training objective

Empirical-risk minimiser:

$$
\hat{\theta}^{*}
=
\arg\min_{\theta}
\frac{1}{N}
\sum_{i=1}^{N}
L(f_\theta(x_i),y_i)
$$

Notes বলে machine-learning models-এর large majority empirical risk minimisation framework-এর অধীনে train করা হয়, এবং unit-এর বাকি অংশে এই design choice-এর consequences examine করা হবে।

---

## 6. MLOps এবং ML supply chain

### 6.1 Machine Learning Operations, MLOps

MLOps slide ML development-কে connected loops-এর system হিসেবে দেখায়।

Visual-এ আছে:

#### ML loop

- Model.
- Data.

#### Dev loop

- Create.
- Verify.
- Package.
- Publish.

#### Ops loop

- Release.
- Configure.
- Monitor.

#### সহজ ধারণা

ML security শুধু trained model নিয়ে নয়। এতে আরও আছে:

- Data pipeline.
- Development pipeline.
- Deployment pipeline.
- Monitoring.
- Updates.
- Infrastructure.

---

### 6.2 Data provenance

#### Definition

Data provenance concerned with:

- Training/evaluation data কোথা থেকে আসে।
- কে data control করে।
- ওই origin থেকে কী risks বা constraints আসে।

Slides data provenance-কে open-source এবং closed-source datasets-এ split করে।

---

### Open-source datasets

Open-source datasets spectrum-এ থাকে:

- কিছু known institutions দ্বারা maintained।
- কিছু web থেকে scraped।

---

### Closed-source datasets

Closed-source datasets হতে পারে:

- External vendor দ্বারা provided, যেমন Turing বা Scale.ai।
- Crowdsourcing-এর মাধ্যমে gathered, যেমন Amazon Mechanical Turk।
- Proprietary, personal, বা otherwise sensitive data।
- Copyright বা licensing restrictions দ্বারা protected।

---

### Security relevance

Data origin প্রভাব ফেলে:

- Trust.
- Poisoning risk.
- Privacy risk.
- Copyright/licensing risk.
- Model owner training set-এ কী আছে তা জানে কি না।

---

### 6.3 Model provenance

#### Definition

Model provenance concerned with:

- Model কোথা থেকে আসে।
- কীভাবে train বা obtain করা হয়েছে।
- এর trustworthiness সম্পর্কে কী assumptions করা হচ্ছে।

---

### Pre-trained models

Slides pre-trained models list করে, যা হতে পারে:

- Open source.
- API দিয়ে rented.
- Vendor থেকে bought.
- Particular use case-এর জন্য fine-tuned.

Slide open-source models-এর example source হিসেবে Hugging Face দেয়।

---

### Bespoke models

Bespoke models-এর ক্ষেত্রে user বা organisation:

- নিজে model train করতে পারে।
- Hyperparameters choose করতে পারে।
- Open-source বা proprietary code ও libraries use করতে পারে।
- Local GPU server use করতে পারে অথবা cloud-এ offload করতে পারে।
- Checkpoints, versioning, এবং monitoring manage করতে পারে।

---

### 6.4 Deployment

Deployment monitoring এবং infrastructure concerns introduce করে।

---

#### Monitoring

Slides list করে:

- Distribution shifts.
- Continual learning.

---

#### Infrastructure

Infrastructure concerns include:

- Software failures.
- Hardware failures.
- Network failures.
- Latency and throughput requirements.
- Low-power edge devices.
- Distributed servers.
- Machine Learning as a Service, MLaaS.

Slide আরও note করে:

- Tay chatbot-এর pitfall avoid করা।

**[UNCLEAR / অস্পষ্ট]** Slide শুধু Tay reference করে; lecturer এটি monitoring বা continual learning-এর সঙ্গে কীভাবে relate করেছেন তা জানতে transcript দরকার।

---

### 6.5 ML as a component in a larger system

“system view” slide emphasize করে যে ML models বড় systems-এর ভেতরে components হিসেবে থাকে।

Examples:

- Recommender systems:
  - Social media.
  - Online stores.
- AI assistants and AI agents:
  - Customer support.
  - Coding IDEs.
- Automated decision-making/control:
  - Autonomous vehicles.

#### Key connection

Security analysis-এ দুই দিকই consider করতে হবে:

- ML component.
- Surrounding software/hardware/user/environment system.

---

## 7. High-level threat model

### 7.1 Actors and objects

High-level threat-model diagram দেখায়:

#### Data Owner

- Training set $D$-এর owner।

#### Model Owner

- Model $f_\theta$ create করে।

#### Model Consumer

- API $f(x;\theta)$ use করে।

#### Adversary

Adversary চাইতে পারে কিছু information about:

- Training set.
- Model.
- API.

Adversary access পেতে পারে:

- Model.
- API.

#### সহজ ধারণা

Threat modelling জিজ্ঞেস করে:

1. Adversary কী চায়?
2. Adversary কী access করতে পারে?
3. কোন asset risk-এ আছে?

---

### 7.2 Assets

Lecture assets-কে things worth protecting হিসেবে define করে।

---

#### ML-specific assets

- Training data.
- Surrogate training data.
- ML model itself.
- ML model parameters.
- ML model hyperparameters.
- ML model architecture.
- ML model behaviour.

---

#### Additional assets

- Inference inputs.
- Inference outputs.
- External assets.

---

#### Key concept

একটি attack সবসময় model weights-কে target করে না। এটি target করতে পারে:

- Private training data.
- Model behaviour.
- Model outputs.
- User inputs.
- ML system-এর বাইরের assets।

---

## 8. CIA taxonomy: Confidentiality, Integrity, Availability

CIA taxonomy-কে basic secure-system properties-এর set হিসেবে present করা হয়েছে, যা attacker কী করতে চায় তা clarify করে।

---

### 8.1 Confidentiality and privacy

#### সহজ ধারণা

Confidentiality/privacy attacks এমন কিছু reveal করতে চায় যা hidden থাকা উচিত।

Slides বলে confidentiality/privacy relates to:

- Private data steal করা।
- Private data reveal করা।

Confidentiality এবং privacy আলাদা করা হয়েছে:

- Cryptography data confidentiality preserve করতে পারে।
- তবুও unintended data leakage privacy issue হিসেবে ঘটতে পারে।

#### Key distinction

একটি system raw data cryptographically protect করলেও information leak হতে পারে:

- Model outputs-এর মাধ্যমে।
- Model behaviour-এর মাধ্যমে।
- Inference patterns-এর মাধ্যমে।

---

### 8.2 Integrity

#### সহজ ধারণা

Integrity attacks ML system-কে incorrectly বা maliciously behave করাতে চায়।

Slides integrity attacks define করে attempts to:

- ML behaviour manipulate করা।
- ML behaviour modify করা।

তারা আরও note করে:

- ML systems নিজে থেকেই errors করে।

এটি গুরুত্বপূর্ণ, কারণ attack-induced errors-কে ordinary model errors থেকে distinguish করতে হবে।

---

### 8.3 Availability

#### সহজ ধারণা

Availability attacks legitimate users-কে system access বা use করা থেকে থামাতে চায়।

Slide definition:

- User-কে system access/use করা থেকে stop করা।

---

## 9. Worked conceptual examples of attacks

Uploaded materials-এ numerical worked examples নেই। Lecture slides-এ diagrams সহ চারটি conceptual example আছে।

---

### 9.1 Example 1: Adversarial attack

Adversarial-attack slide একটি autonomous-driving/lidar scenario দেখায়।

#### Normal case

1. Vehicle autopilot mode-এ আছে।
2. Lidar environment awareness environment perception support করে।
3. System situation-কে dangerous হিসেবে correctly predicts করে।

#### Attack case

1. Attacker sensor system-এ laser direct করে।
2. Sensory system spoofed হয়।
3. System scene-কে safe হিসেবে wrongly predicts করে।

#### Failure case

1. Accident occurs।
2. Sensory system fails বা error output করে।
3. System situation-কে error হিসেবে wrongly predicts করে।

#### Key concept

Adversarial attack model input অথবা sensed environment manipulate করতে পারে, যাতে ML component unsafe prediction produce করে।

#### CIA category

মূলত **integrity**, কারণ attacker ML behaviour manipulate করে।

---

### 9.2 Example 2: Poisoning attack

Poisoning-attack slide training phase এবং inference phase আলাদা করে।

---

#### Training phase

1. একটি clean dataset আছে।
2. Poisoning samples যোগ করা হয়।
3. Contaminated data দিয়ে model train করা হয়।
4. Resulting model হলো poisoned model।

---

#### Inference phase

1. একটি benign sample normally classified হয়।
2. Trigger সহ sample differently classified হয়।
3. Traffic-sign example-এ:
   - Benign label: “Compulsory Ahead Only.”
   - Triggered label: “Compulsory Keep Right.”

---

#### Key concept

Poisoning attacks training data manipulate করে, যাতে trained model পরে maliciously বা incorrectly behave করে।

#### CIA category

মূলত **integrity**।

---

### 9.3 Example 3: Model extraction attack

Model-extraction slide attacker-কে model query করতে এবং সেটি reconstruct বা imitate করতে দেখায়।

এটি model extraction attack-এর দুই broad type distinguish করে।

---

#### Functionally equivalent model extraction attacks

Diagram attacks list করে based on:

- Memory.
- Side-channel.
- Equation-solving.
- Black-box access.

---

#### Task-accuracy model extraction attacks

Diagram list করে:

- Defence-aware model extraction attacks.
- Transfer-learning-based model extraction attacks.
- Uncertainty-sampling-based extraction attacks.
- Query-optimized black-box extraction attacks.

---

#### Key concept

Model extraction model-কে asset হিসেবে target করে। Attacker original model থেকে useful behaviour copy, approximate, বা recover করতে চায়।

#### CIA category

মূলত **confidentiality**, কারণ model details বা behaviour reveal/stolen হচ্ছে।

---

### 9.4 Example 4: Membership inference attack

Membership-inference slide দেখায়:

- Black-box এবং white-box settings.
- Model-এর সঙ্গে query/result interactions.
- Original model.
- Updated model.
- Update data.
- Model update.

Diagram আরও related analyses label করে:

- Membership inference.
- Differential analysis.
- Model inversion.

---

#### Key concept

Membership inference একটি privacy attack। Attacker infer করতে চায় কোনো particular example training data বা update data-র অংশ ছিল কি না।

#### CIA category

মূলত **privacy/confidentiality**।

**[UNCLEAR / অস্পষ্ট]** Slide diagram-এ কয়েকটি related privacy attacks আছে, কিন্তু lecturer কীভাবে membership inference-কে differential analysis এবং model inversion থেকে distinguish করেছেন তা জানতে transcript দরকার।

---

## 10. Attack taxonomies

## 10.1 Training-time vs inference-time taxonomy

এই taxonomy focus করে **attack-এর main part কখন ঘটে**।

Slides He et al. 2025, *Artificial intelligence security and privacy: a survey* follow করে।

---

### Training-phase attacks

Training-phase attacks training process চলাকালীন বা training process-এর বিরুদ্ধে ঘটে।

Diagram এগুলোকে centralised এবং distributed training attacks-এ ভাগ করে।

---

#### Centralised training attacks

- Untargeted data poisoning attacks.
- Backdoor attacks.
- Model hijacking attacks.

---

#### Distributed training attacks

- Attacks in federated learning.
- Attacks in split learning.

---

#### Connection

Distributed setting extra attack surface তৈরি করে এবং unit-এর Part II, অর্থাৎ federated learning-এর সঙ্গে connect করে।

---

### Inference-phase attacks

Inference-phase attacks training-এর পরে, model use করার সময় ঘটে।

Diagram এগুলোকে কয়েকটি category-তে ভাগ করে।

---

#### Privacy inference attacks

- Data and attribute reconstruction attacks.
- Membership inference attacks.

---

#### Fault injection attacks

- Parameter fault injection attacks.
- Hardware fault injection attacks.
- Software fault injection attacks.

---

#### Adversarial attacks

- Adversarial attacks on the digital domain.
- Adversarial attacks on the physical domain.

---

#### Model stealing attacks

- Task-accuracy model extraction.
- Functionally equivalent model extraction attacks.

---

#### Attacks against large language models

- Jailbreak attacks.
- Prompt-based attacks.
- Attacks during the fine-tuning stage.

---

### Notes on naming

Slides warn করে যে:

- LLMs-এর attacks বা defences-এর different names থাকতে পারে।
- Infrastructure এবং side-channel attacks include করা উচিত।
- Hardware এবং software—দুই ধরনের attacks relevant।

---

## 10.2 Centralised vs distributed setting

### Centralised setting

Training এবং control এক জায়গায় বা এক organisation/system-এ concentrated।

### Distributed setting

Training বা computation multiple parties/devices/systems-এর মধ্যে split করা হয়।

Slides explicitly state করে:

- Distributed settings extra attack surface তৈরি করে।
- Federated learning unit-এর Part II-তে covered।

### Connection

এটি Week 1 threat modelling-কে course-এর later federated learning ও cryptography part-এর সঙ্গে link করে।

---

## 10.3 Passive attacker vs active attacker taxonomy

এই taxonomy attacker-কে classify করে: তারা শুধু observe করে, নাকি actively interfere করে।

---

### Passive adversary

Slides passive adversary define করে:

- Honest-but-curious attacker.
- ML system observe করে এবং inference perform করে।
- Training data বা gradient updates-এ interfere করে না।

#### সহজ ধারণা

Passive attackers system change না করে information leakage exploit করে।

---

### Active adversary

Slides active adversary define করে:

- Fully malicious attacker.
- Manipulate করতে পারে:
  - Training data.
  - Inference data.
  - Gradients.
- Newly deployed defences-এর সঙ্গে adapt করতে পারে।

#### সহজ ধারণা

Active attackers শুধু observe করে না; তারা system corrupt বা perturb করতে পারে।

---

## 10.4 Attacker knowledge taxonomy

এই taxonomy attacks classify করে attacker ML system সম্পর্কে কী জানে তার ভিত্তিতে।

---

### Perfect knowledge

Slides বলে attacker ML system সম্পর্কে information রাখে, including:

- ML algorithm.
- Model parameters.
- Training data.

**[UNCLEAR / অস্পষ্ট]** Slide text “perfect knowledge” heading-এর নিচে “attacker has (some) information” বলে, যা heading-এর তুলনায় weak শোনায়। Exact intended distinction জানতে recording check করা দরকার।

---

### Zero knowledge

Slides zero knowledge define করে:

- ML system black box হিসেবে থাকে।
- কিন্তু attacker inputs craft করতে পারে এবং outputs observe করতে পারে।

#### সহজ ধারণা

Black-box access থাকলেও queries-এর মাধ্যমে attacks possible হতে পারে।

---

### Partial knowledge

Slides partial knowledge define করে:

- Perfect knowledge এবং zero knowledge-এর মাঝামাঝি কোথাও।

---

## 10.5 MITRE ATLAS taxonomy

MITRE ATLAS taxonomy traditional attack chain-এর ওপর focus করে।

Slides state করে যে এটি:

- Successful cyber attack-এর সব stages cover করে।
- Reconnaissance থেকে exfiltration পর্যন্ত stages cover করে।
- ML-only এবং whole cyber system-এর lines blur করে।

---

### In-class exercise

Students-দের বলা হয়েছিল:

- MITRE ATLAS matrix visit করতে।
- একটি pure machine-learning attack step খুঁজে বের করতে।
- একটি more traditional cybersecurity example খুঁজে বের করতে।

### Connection

এই taxonomy AI security-কে wider cybersecurity practice-এর সঙ্গে link করে।

---

## 11. Mathematical modelling of threats

Week 1 modelling slide key modelling move দেয়:

> Turn threats into optimisation problems.

---

### 11.1 সহজ ধারণা

একটি natural-language threat যেমন:

- “make the model misclassify this input”
- “extract the model”
- “infer whether a data point was in the training set”

mathematically represent করা যায় এমন problem হিসেবে যেখানে থাকে:

- Variables যেগুলো attacker control করে।
- Constraints: attacker কী করতে allowed।
- Objective: attacker-এর goal capture করে।

**Important:** Slide নিজে শুধু high-level idea state করে। এটি এখনো full optimisation formulation দেয় না।

---

### 11.2 Learning resources

Modelling slides বলে course official UK knowledge guides follow করে, specifically:

- Cavallaro et al. 2023, *Security and Privacy of AI Knowledge Guide*.
- Pages 4, 5, 6, and 8.

---

### 11.3 Next topics signposted

Modelling lecture সামনে যেসব topics আসবে তা point করে:

- Computing adversarial attacks.
- Reachability and interval analysis.
- Neural network verification.

### Connection

এই next topics lecture notes-এর mathematical foundations-এর ওপর সরাসরি build করে:

- Hypothesis classes.
- Neural networks.
- Vector norms.
- Empirical risk minimisation.

---

## 12. Exam flags and high-value revision points

### Explicit exam/assessment flags

#### EXAM FLAG: Written exam

Written exam-এর weight:

$$
50\%
$$

and:

> Covers all topics.

Slides-এর মধ্যে এটিই সবচেয়ে clear explicit exam flag।

---

#### Coursework I

Coursework I-এর weight:

$$
25\%
$$

Topic:

- Adversarial Attacks and Defences.

Due:

- 16/3/2026 at 2pm.

---

#### Coursework II

Coursework II-এর weight:

$$
25\%
$$

Topic:

- Federated Learning.

Due:

- 18/05/2026 at 2pm.

---

#### Coursework I topics

Coursework I includes:

- FGSM attacks.
- Robustness radius.
- Interval analysis.
- Randomised smoothing.
- One unlabeled 4-point row **[UNCLEAR / অস্পষ্ট]**.

---

#### Note-taking contribution

Note-taking contributions-এর জন্য one extra point available।

---

### “You should know this” style flags from the materials

Slides-এ অনেক explicit “this is important” phrases নেই, কিন্তু নিচের বিষয়গুলো structurally high-value, কারণ এগুলো learning outcomes, coursework topics, অথবা পরে ব্যবহার হওয়া foundations:

- CIA taxonomy:
  - Confidentiality/privacy.
  - Integrity.
  - Availability.
- Training-time vs inference-time taxonomy.
- Passive vs active adversary.
- Attacker knowledge:
  - Perfect knowledge.
  - Zero knowledge.
  - Partial knowledge.
- ML systems-এর assets.
- ML supply chain-এ data/model/deployment provenance.
- Affine hypothesis spaces.
- Neural-network composition এবং activations.
- $p$-norms, infinity norm, matrix/spectral norm.
- Empirical Risk Minimisation.
- Threats-কে optimisation problems হিসেবে mathematical modelling.
- Distributed attack surface এবং federated learning-এর সঙ্গে এর connection.

---

## 13. Lectures এবং course parts-এর মধ্যে connections

### Intro lecture → Threats lecture

Intro lecture শেষ হয় pointing to:

- Threats to the AI pipeline.
- Mathematical modelling.

পরের lecture cover করে:

- ML pipeline.
- Common threats.

---

### Threats lecture → Mathematical modelling

Threat lecture identify করে:

- Assets.
- Attacker access.
- Threat taxonomies.
- Attack examples.

Modelling lecture তারপর বলে এসব threats optimisation problems-এ turn করা হবে।

---

### Threats lecture → Federated learning

Training-time vs inference-time taxonomy বলে distributed settings extra attack surface তৈরি করে এবং explicitly unit-এর Part II-র দিকে point করে:

- Federated learning.

---

### Lecture notes → Future adversarial ML topics

Lecture notes mathematical tools define করে, যেগুলো পরে দরকার হবে:

- Neural networks.
- Norms.
- Empirical Risk Minimisation.

Modelling slides সামনে point করে:

- Adversarial attacks.
- Reachability.
- Interval analysis.
- Neural network verification.

---

## 14. Recording-এ revisit করার জন্য unclear sections

1. **Transcript missing.**  
   Auto-generated transcript দেওয়া হয়নি, তাই oral explanations, examples, emphasis, এবং spoken exam hints capture করা হয়নি।

2. **Affine mapping index notation.**  
   Lecture-notes-এ $f_\theta(x)$-এর formula extracted text-এ garbled/inconsistent দেখায়। Exact coordinate convention revisit করা দরকার।

3. **Neural-network definition-এ layer dimensions.**  
   Extracted PDF একটি matrix shape দেয় যা row-vector/column-vector convention-এর ওপর depend করতে পারে। Exact dimensions assessed হলে revisit করা দরকার।

4. **Coursework I unlabeled 4-point row.**  
   Slide parsed text-এ visible label ছাড়া একটি additional 4-point item দেখায়। Canvas বা original slide/recording check করা দরকার।

5. **OECD AI incident charts.**  
   Charts trends ও categories দেখায়, কিন্তু lecturer-এর interpretation এবং exact values জানতে transcript দরকার।

6. **Attack example diagrams.**  
   Adversarial attack, poisoning, model extraction, এবং membership inference-এর diagrams-এ useful visual detail আছে, কিন্তু lecturer-এর step-by-step explanation ধরতে transcript দরকার।

7. **Attacker knowledge taxonomy wording.**  
   “Perfect knowledge” slide-এ “some” information হিসেবে described, যা shorthand বা imprecise slide wording হতে পারে। Recording revisit করা দরকার।

8. **Tay chatbot deployment warning.**  
   Deployment slide Tay reference করে, কিন্তু intended lesson ধরতে transcript দরকার।

---

## 15. Quick revision checklist

এটি fast self-test হিসেবে ব্যবহার করো।

### Course framing

- [ ] আমি কি AI Ethics, AI Safety, এবং Security & Privacy of AI আলাদা করতে পারি?
- [ ] আমি কি explain করতে পারি কেন Security & Privacy of AI, AI for Cybersecurity-এর একই জিনিস নয়?
- [ ] আমি কি adversarial machine learning-এ studied attacks-এর examples দিতে পারি?

### ML foundations

- [ ] আমি কি hypothesis class define করতে পারি?
- [ ] আমি কি supervised learning dataset notation লিখতে পারি?
- [ ] আমি কি classification এবং regression distinguish করতে পারি?
- [ ] আমি কি affine hypothesis space define করতে পারি?
- [ ] আমি কি feedforward neural networks-কে compositions of layers হিসেবে explain করতে পারি?
- [ ] আমি কি ReLU, sigmoid, TanH, এবং SoftMax লিখতে পারি?
- [ ] আমি কি $p$-norm, infinity norm, এবং spectral norm define করতে পারি?
- [ ] আমি কি expected risk থেকে ERM derive করতে পারি?

### ML pipeline

- [ ] আমি কি data provenance explain করতে পারি?
- [ ] আমি কি model provenance explain করতে পারি?
- [ ] আমি কি deployment risks list করতে পারি?
- [ ] আমি কি explain করতে পারি কেন ML models larger systems-এর components?

### Threat modelling

- [ ] আমি কি data owner, model owner, model consumer, এবং adversary identify করতে পারি?
- [ ] আমি কি ML-specific assets list করতে পারি?
- [ ] আমি কি confidentiality/privacy, integrity, এবং availability explain করতে পারি?
- [ ] আমি কি adversarial attacks, poisoning attacks, model extraction, এবং membership inference classify করতে পারি?

### Attack taxonomies

- [ ] আমি কি training-time এবং inference-time attacks distinguish করতে পারি?
- [ ] আমি কি centralised এবং distributed settings distinguish করতে পারি?
- [ ] আমি কি passive এবং active attackers distinguish করতে পারি?
- [ ] আমি কি attacker knowledge levels explain করতে পারি?
- [ ] আমি কি MITRE ATLAS taxonomy কী add করে তা explain করতে পারি?

### Mathematical modelling

- [ ] আমি কি explain করতে পারি threats-কে optimisation problems-এ turn করার মানে কী?
- [ ] আমি কি attacker-controlled variables, constraints, এবং objectives identify করতে পারি?
- [ ] আমি কি modelling-কে adversarial attacks, reachability, interval analysis, এবং verification-এর সঙ্গে connect করতে পারি?
