---
subject: COMP60272
chapter: 4
title: "Week 4"
language: en
---

# COMP60272 — Security and Privacy of AI: Week 4 Structured Study Notes

**Topic and scope:** Week 4 moves from earlier integrity attacks/defences to **privacy attacks on AI systems**. The two main attack families are **model extraction/stealing** and **membership inference**, followed by a code tutorial on implementing sampling and inference attacks.

**Source note:** The uploaded zip contains slide PDFs and a 4-page lecture-notes PDF. It does **not** contain a separate auto-generated transcript file, so these notes use the slides plus the written lecture notes. Sections that would need the missing transcript to clarify the lecturer’s verbal explanation are marked **[UNCLEAR]**.

---

## 1. Course context and recap

### 1.1 Previous material recapped

The slides explicitly connect Week 4 to earlier course content:

- **Adversarial attacks and certification**
  - Fast Gradient Sign Method (**FGSM**)
  - Interval analysis
  - Neural network verification
- **Adversarial defences**
  - Adversarial training
  - Lipschitz-bounded neural networks
  - Randomised smoothing

### 1.2 Shift in focus for Week 4

- Previous attacks were framed mainly around **integrity**: changing the model’s behaviour, inducing misclassification, or certifying robustness.
- Week 4 focuses on attacks on **privacy** rather than integrity.
- The two privacy attacks covered are:
  - **Model extraction / model stealing attacks**
  - **Membership inference attacks**, described on the slide as attacks that can steal information about the training data.

---

# Part I — Model Extraction / Model Stealing Attacks

## 2. Motivation: why steal a model?

### 2.1 Training models is costly

The slides motivate model extraction by noting that training models:

- is very expensive;
- requires lots of data;
- requires very high compute power;
- requires software infrastructure.

### 2.2 Attacker motivation

Instead of paying the cost of training, an attacker may try to:

- steal an existing model;
- clone the model’s behaviour;
- reuse the stolen model for downstream tasks;
- set up a competing MLaaS product;
- carry out further attacks using the stolen or approximated model.

The slide notes that stealing or cloning has been discussed in the context of LLMs, citing examples involving OpenAI/DeepSeek and Gemini cloning attempts.

---

## 3. Threat model for model extraction

### 3.1 Basic MLaaS setting

The victim model is shown as a trained model $f$ deployed through **MLaaS**:

$$
x \longrightarrow \boxed{\text{Trained Model } f \text{ (MLaaS)}} \longrightarrow y
$$

The adversary interacts with the model by sending inputs $x$ and receiving outputs $y$.

### 3.2 Two broad attack goals

The slides divide model extraction into two broad types:

1. **Functionality stealing**
2. **Model stealing**

#### Key concept: functionality stealing

**Intuition:** The attacker does not need the true internal parameters. It is enough to create a surrogate model $g$ that behaves like the target model $f$.

**Formalism provided in notes:**

$$
g(x) \approx f(x)
$$

A successful functionality-stealing attack copies the functionality of $f(x)$ by learning a surrogate model $g(x)$ that approximates $f(x)$ to a high degree of precision.

#### Key concept: model stealing

**Intuition:** The attacker tries to steal internal details of the model, not just its behaviour.

The slides break model stealing into stealing:

- **model parameters**;
- **model hyperparameters**;
- **model architecture**.

### 3.3 Examples on the threat-model slide

The slides explicitly annotate two examples:

- **Example 1: Binary logistic classifier**
  - This is placed under **model stealing**, specifically **model parameters**.
- **Example 2: Neural network distillation**
  - This is placed under **functionality stealing**, specifically producing a **surrogate model**.

### 3.4 Output access assumptions

The slides distinguish between two possible API outputs:

- **Class scores / confidence values**
  - The API returns confidence values such as probabilities or class scores.
  - This makes parameter extraction easier for simple models.
- **Output classes only**
  - The API returns only the predicted class label.
  - This is described as a black-box setting and makes extraction harder.

---

## 4. Taxonomy of model extraction algorithms

The model extraction slides include a taxonomy figure from He et al. (2025), “Artificial intelligence security and privacy: a survey.”

### 4.1 Functionally equivalent model extraction attacks

The figure lists functionally equivalent extraction attacks based on:

- memory;
- side-channel;
- equation-solving;
- black-box access.

The lecture highlights **equation-solving** and **black-box** attacks with red arrows.

### 4.2 Task-accuracy model extraction attacks

The same figure lists task-accuracy model extraction attacks based on:

- defence-aware model extraction;
- transfer-learning-based model extraction;
- uncertainty-sampling-based extraction;
- query-optimised black-box extraction.

### 4.3 Lecture focus

The “deeper dive” slide states that the lecture focuses on:

- **Binary classifiers**
  - $f(x) = \operatorname{Sigmoid}(w^T x + b)$
  - model parameter extraction
  - only $d+1$ samples needed
- **Black-box setting**
  - synthetic dataset
  - train surrogate model
  - objective functions

The slide points to Tramèr et al. (2016), *Stealing Machine Learning Models via Prediction APIs*, Sections 4.1.1, 4.1.2, 6.1, and 6.3.

**EXAM FLAG / slide emphasis:** “Only $d+1$ samples needed!” is explicitly emphasised on the slide for binary classifiers.

---

## 5. Model parameter stealing for a binary logistic classifier

## 5.1 Binary logistic classifier

### Definition / intuition

A binary logistic classifier combines:

1. a linear score $w^T x + b$, and
2. a sigmoid activation that maps the score into $[0,1]$.

It is often used for binary classification, where the output is interpreted as a class confidence.

### Formal definition given

The lecture notes define:

$$
f(x) = \operatorname{Sigm}(w^T x + b)
$$

where

$$
\operatorname{Sigm}(z) = \frac{1}{1 + \exp(-z)} \in [0,1].
$$

The notes state that such models are often used as binary classifiers:

- if $f(x) \geq 0.5$, predict one class;
- if $f(x) < 0.5$, predict the other class.

---

## 5.2 Parameter stealing with access to confidence values

### Setup

The MLaaS API returns the full class confidence value $f(x)$, not just the output class.

The unknown model parameters are:

- weight vector $w \in \mathbb{R}^d$;
- bias $b \in \mathbb{R}$.

The lecture notes state that the adversary may need only $d+1$ input-output pairs:

$$
\{(x_i, f(x_i))\}_{i=1}^{d+1}.
$$

### Key idea

The sigmoid output can be inverted, converting the nonlinear-looking model into a linear equation in the unknown parameters.

### Derivation step 1: invert the sigmoid

The notes give:

$$
\operatorname{Sigm}^{-1}(f(x)) = w^T x + b
$$

where

$$
\operatorname{Sigm}^{-1}(z) = \log\left(\frac{z}{1-z}\right).
$$

This inverse sigmoid is the log-odds transform.

### Derivation step 2: build a system of linear equations

For $d+1$ chosen inputs $x_1, \ldots, x_{d+1}$, define:

$$
\hat{Y}
= \left(\operatorname{Sigm}^{-1}(f(x_1)) \; \cdots \; \operatorname{Sigm}^{-1}(f(x_{d+1}))\right)
\in \mathbb{R}^{1\times(d+1)}.
$$

Define the augmented input matrix:

$$
\hat{X}
=
\begin{pmatrix}
x_1 & \cdots & x_{d+1} \\
1 & \cdots & 1
\end{pmatrix}
\in \mathbb{R}^{(d+1)\times(d+1)}.
$$

Define the augmented parameter vector:

$$
\hat{W} = \left(w^T \; b\right) \in \mathbb{R}^{1\times(d+1)}.
$$

The system is:

$$
\hat{Y} = \hat{W}\hat{X}.
$$

The bias $b$ is merged into the $(d+1)$-long parameter vector $\hat{W}$.

### Derivation step 3: solve for the parameters

If the adversary chooses the $d+1$ inputs so that $\hat{X}$ is full-rank, then $\hat{X}$ is invertible and:

$$
\hat{W} = \hat{Y}\hat{X}^{-1}.
$$

The lecture notes state:

- $\hat{X}^{-1}$ is the inverse of a square matrix;
- it can be naively computed in $O(d^3)$ time;
- in practice, choosing $d+1$ inputs at random almost always yields a full-rank $\hat{X}$.

### Worked derivation preserved

The worked-through derivation is the full equation-solving attack:

1. Query $d+1$ inputs $x_i$.
2. Receive confidence values $f(x_i)$.
3. Apply $\operatorname{Sigm}^{-1}$ to each confidence value.
4. Assemble $\hat{Y}$, $\hat{X}$, and $\hat{W}$.
5. Use $\hat{Y}=\hat{W}\hat{X}$.
6. If $\hat{X}$ is full-rank, compute $\hat{W}=\hat{Y}\hat{X}^{-1}$.
7. Read off $w$ and $b$ from $\hat{W}$.

No numerical example is provided in the uploaded slides or notes.

---

## 5.3 Black-box parameter extraction without confidence values

### Definition / intuition

In the black-box setting, the attacker observes only the output class, not the confidence value.

The notes state that model-parameter extraction for a linear classifier is still possible in theory, but is harder.

### Formal coverage in this lecture

The notes explicitly say this setting is **not covered in this unit** and refer to Lowd and Meek (2005), *Adversarial learning*, for more information.

**[UNCLEAR]** The uploaded material does not include the detailed algorithm for extracting linear classifier parameters using only output classes. This is explicitly out of scope in the written notes.

---

## 6. Functionality stealing

## 6.1 Motivation

For more complicated models, it may be impossible to extract the exact parameter values.

The notes emphasise that the attacker may not need the exact parameters. A successful privacy attack only needs to copy the **functionality** of the model.

## 6.2 Definition / intuition

The attacker creates a surrogate model $g$ that approximates the victim model $f$.

$$
g(x) \approx f(x)
$$

Once the attacker has $g$, it can be used instead of $f$ for downstream tasks.

The notes explicitly list uses of $g$:

- setting up a competing MLaaS product;
- carrying out further white-box attacks using $g(x)$ as an approximation of the black-box model $f(x)$.

## 6.3 General functionality-stealing algorithm

The notes describe the procedure as equation-solving or model fitting over a synthetic dataset.

### Step 1: query the victim model

Run a high number $k$ of queries on the original model $f(x)$.

### Step 2: build a synthetic dataset

Construct:

$$
\mathcal{D} = \{(x_i, f(x_i))\}_{i=1}^{k}.
$$

This dataset contains input-output pairs generated from the victim model.

### Step 3: train a surrogate model

Train a surrogate model $g(x)$ on $\mathcal{D}$.

The notes state that:

- the architecture of $g$ may match $f$, but does not have to;
- the appropriate loss function depends on the application, such as classification or regression.

## 6.4 Importance of dataset size and distribution

The quality of the approximation $g(x) \approx f(x)$ depends heavily on the synthetic dataset $\mathcal{D}$.

The notes state:

- accuracy generally increases with $|\mathcal{D}|$;
- the distribution of inputs matters too.

The slides connect this to the goal of minimising the number of queries.

**EXAM FLAG / slide emphasis:** In black-box extraction, the slide explicitly states the goal: **minimise the number of queries**.

---

## 7. Sampling strategies for black-box extraction

The lecture gives three broad strategies for choosing synthetic inputs.

## 7.1 Uniform random sampling

### Intuition

The simplest strategy is to sample inputs randomly.

### Formal detail provided

For image classification, the notes state that inputs sampled uniformly are bounded by:

$$
x \in [0,1]^d.
$$

This corresponds to pixel values normalised into the unit interval.

## 7.2 Line search

### Intuition

Line search chooses points near the classification boundary, because boundary-adjacent points may reveal more information about the target model’s decision function.

### Formal definition provided

Assume two inputs $x$ and $x'$ yield different classes:

$$
\arg\max_c f(x)_c \neq \arg\max_c f(x')_c.
$$

Search along the line:

$$
x'' = \alpha x + (1-\alpha)x'
$$

for $\alpha \in [0,1]$, looking for an input $x''$ that is arbitrarily close to the classification boundary.

The notes state that such inputs may be more informative about the behaviour of $f(x)$.

## 7.3 Adaptive sampling / uncertainty sampling

### Intuition

Once the attacker has an initial surrogate model $g(x)$, they select new queries where $g(x)$ is most uncertain.

### Formal description provided

The notes describe this as:

- extract inputs that make $g(x)$ as uncertain as possible;
- this is known as **uncertainty sampling** in active learning;
- it aims to choose inputs with the greatest chance of making $g(x)$ learn quickly.

## 7.4 Lowd-Meek strategy

The notes state that the strategy named **Lowd-Meek** in the figure is an advanced example of line search, referring to Lowd and Meek (2005).

---

## 8. Evaluating the quality of the stolen surrogate model

The notes give two metrics from Tramèr et al. (2016).

## 8.1 Test-set extraction error

$$
R_{\text{test}}
=
\frac{1}{|\mathcal{T}|}
\sum_{(x_i, f(x_i)) \in \mathcal{T}}
\mathcal{L}\left(g(x_i), f(x_i)\right).
$$

Here:

- $\mathcal{T}$ is a test set of “natural” input-output pairs;
- examples include existing machine-learning benchmark test data;
- $\mathcal{L}$ is the loss comparing the surrogate output $g(x_i)$ with the victim output $f(x_i)$.

## 8.2 Uniform-input extraction error

$$
R_{\text{unif}}
=
\frac{1}{|\mathcal{U}|}
\sum_{(x_i, f(x_i)) \in \mathcal{U}}
\mathcal{L}\left(g(x_i), f(x_i)\right).
$$

Here:

- $\mathcal{U}$ is a set of randomly extracted inputs;
- the notes give the example of inputs from the uniform distribution.

## 8.3 Relationship between the metrics

The notes state that $R_{\text{test}}$ and $R_{\text{unif}}$ are structurally identical, but rely on differently distributed datasets:

- $\mathcal{T}$: natural input-output pairs;
- $\mathcal{U}$: randomly extracted input-output pairs.

## 8.4 Figure interpretation: sampling strategies

The figure plots **average extraction error** against **Budget Factor $\alpha$** for:

- Uniform;
- Line-Search;
- Adaptive;
- Lowd-Meek.

It shows two panels:

- $R_{\text{test}}$;
- $R_{\text{unif}}$.

From the plotted curves:

- extraction error decreases as the budget factor increases;
- uniform sampling remains comparatively worse than more targeted strategies at higher budgets;
- adaptive sampling gives much lower error than uniform at larger budgets;
- Lowd-Meek reaches near-zero error by about budget factor 50 in the plotted experiment.

**[UNCLEAR]** The uploaded notes/slides do not define “Budget Factor $\alpha$” beyond the axis label in the figure. This should be checked against the recording or the Tramèr et al. paper if needed.

---

# Part II — Membership Inference Attacks

## 9. Recap from model extraction to membership inference

The membership inference lecture begins by recapping model extraction:

### Model stealing

- Copy the exact parameters.
- Fairly challenging.
- Possible for simple models.

### Functionality stealing

- Generate a synthetic dataset.
- Train a surrogate model.
- Replicate the victim’s behaviour.

The transition question is:

> What else can we steal?

The slide answers that the **training data** may be valuable.

---

## 10. Motivation: why infer membership?

## 10.1 Access control principle

The slide states the access-control principle:

- do not reveal more data;
- than what is strictly necessary.

Membership inference violates this principle by leaking information about whether a particular data point was part of the model’s training set.

## 10.2 Value and sensitivity of training data

The slides state that training data:

- is expensive to collect;
- may contain sensitive information;
- may include examples such as medical records or API keys.

## 10.3 Legal reasons

The slide also gives a legal motivation:

- membership inference can be used to discover copyrighted data;
- the slide gives LLMs trained on books as an example and cites an arXiv reference.

---

## 11. Membership inference threat model

## 11.1 Basic setting

The target model $f$ is trained on training data $\mathcal{D}$:

$$
\mathcal{D} \longrightarrow \boxed{\text{Trained Model } f \text{ (MLaaS)}}
$$

The adversary queries the MLaaS model:

$$
x \longrightarrow f \longrightarrow y.
$$

## 11.2 Attack model

The adversary uses an **attack model** $h$.

The goal of $h$ is to decide whether the queried input was in the target model’s training set:

$$
x \in \mathcal{D}
\quad \text{or} \quad
x \notin \mathcal{D}.
$$

### Definition / intuition

Membership inference is a binary decision problem: given a data point $x$, and information obtained from the trained model $f$, decide whether $x$ was a member of the training dataset $\mathcal{D}$.

### Formalism provided by slides

The slides do not give a single formal definition of the attack, but the threat-model diagram provides:

$$
h(y) \rightarrow \{x \in \mathcal{D},\; x \notin \mathcal{D}\}
$$

where $y=f(x)$, and later slides use confidence scores such as $\max_c f(x)_c$.

## 11.3 Role of confidence values

The threat-model slide explicitly annotates $y$ as:

- class scores;
- confidence values.

These confidence values are used as signals for deciding membership.

The slide asks the central question:

> How do we train the Attack Model $h$?

---

## 12. Membership inference intuition

The intuition slide uses an image-classification example.

### Example shown

- Input: an image of a cat.
- Target ML model outputs class scores for:
  - cat;
  - dog;
  - panda.
- The cat score is high, visually around 80, while dog and panda scores are low.
- A horizontal red threshold line is drawn around the high-confidence region.

### Intuition

If the target model is unusually confident on a data point, that high confidence may indicate that the model saw the point during training.

This is later formalised in Algorithm III using:

$$
\max_c f(x)_c \geq \text{threshold}.
$$

---

## 13. Membership inference Algorithm I: shadow model with similarly distributed data

## 13.1 Attacker knowledge

Algorithm I assumes the attacker has strong auxiliary knowledge:

- identically distributed shadow training data $\mathcal{D}_{\text{shadow}}$;
- target model hyperparameters, including architecture and initialisation;
- access to the same training algorithm and infrastructure.

The slide later summarises the main issue:

$$
\mathcal{D}_{\text{shadow}} \sim \mathcal{D}.
$$

**EXAM FLAG / slide emphasis:** The “main issue” for Algorithm I is explicitly stated: it requires access to $\mathcal{D}_{\text{shadow}} \sim \mathcal{D}$.

## 13.2 Shadow model setup

The attacker splits or uses shadow data into:

- $\mathcal{D}_{\text{train}}$, used to train the shadow model;
- $\mathcal{D}_{\text{out}}$, data outside the shadow model’s training set.

The shadow model is denoted:

$$
g.
$$

## 13.3 Training the attack model $h$

The slide gives the training procedure.

### Step 1: assume the shadow and target models are similar

$$
f \approx g.
$$

The attack model is trained on the shadow model’s behaviour, then transferred to the target model.

### Step 2: collect outputs on shadow training samples

$$
Y_{\text{train}}
=
\{y = g(x) : x \in \mathcal{D}_{\text{train}}\}.
$$

These are labelled as “member” examples for the shadow model.

### Step 3: collect outputs on shadow non-training samples

$$
Y_{\text{out}}
=
\{y = g(x) : x \in \mathcal{D}_{\text{out}}\}.
$$

These are labelled as “non-member” examples for the shadow model.

### Step 4: train $h$

Train the attack model $h$ to discriminate between:

- $Y_{\text{train}}$: outputs on points that were in the shadow model’s training set;
- $Y_{\text{out}}$: outputs on points that were not in the shadow model’s training set.

## 13.4 Using the attack model against the target model

After training $h$:

1. Query the target model $f$ with a candidate point $x$.
2. Receive output $y=f(x)$, typically class scores/confidence values.
3. Feed $y$ into the attack model $h$.
4. $h$ predicts whether:

$$
x \in \mathcal{D}
\quad \text{or} \quad
x \notin \mathcal{D}.
$$

## 13.5 Algorithm I figure results

The Algorithm I results figure compares:

- **Shokri et al.**;
- **Our approach**.

It plots both **precision** and **recall** across datasets:

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
- Purchase-100.

The plotted bars show that both approaches often achieve high precision and recall, with “Our approach” visually similar to or slightly higher than Shokri et al. on several datasets.

**[UNCLEAR]** The figure is shown without a detailed verbal transcript here. Exact numerical values should be read from the original paper or recording if needed.

---

## 14. Membership inference Algorithm II: shadow model with arbitrary data

## 14.1 Attacker knowledge

Algorithm II weakens the data assumption.

The attacker has:

$$
\mathcal{D}_{\text{shadow}} = \mathcal{D}_{\text{whatever}}.
$$

That is, the attacker has some other arbitrary training set, not necessarily identically distributed with the target training set.

The slide states that, apart from this, Algorithm II uses the same strategy as Algorithm I.

## 14.2 Algorithm II procedure

The procedure is therefore:

1. Use arbitrary data $\mathcal{D}_{\text{whatever}}$ as shadow data.
2. Train a shadow model $g$.
3. Collect $Y_{\text{train}}$ and $Y_{\text{out}}$ from $g$.
4. Train attack model $h$ to distinguish member-like and non-member-like outputs.
5. Apply $h$ to outputs from the target model $f$.

## 14.3 Algorithm II heatmap results

The slide shows precision and recall heatmaps with dataset names on both axes:

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
- Purchase-100.

A magnifying-glass graphic highlights a value of **95** in both the precision and recall heatmaps.

**[UNCLEAR]** The slide does not explicitly define which heatmap axis corresponds to the target dataset and which corresponds to the arbitrary shadow dataset. The likely interpretation is a cross-dataset experiment, but this needs the recording or original paper for confirmation.

**[UNCLEAR]** The highlighted “95” is visually shown, but the slide does not explain in text whether this means 0.95 precision/recall, 95%, or a particular cell selected for emphasis.

---

## 15. Membership inference Algorithm III: confidence threshold attack

## 15.1 Attacker knowledge

Algorithm III assumes almost no auxiliary information:

- no data;
- no shadow model;
- “no nothing,” as written on the slide.

## 15.2 Decision criterion

The slide gives the criterion:

$$
\max_c f(x)_c \geq \text{threshold}.
$$

A clean way to write the implied attack rule is:

$$
h(x) =
\begin{cases}
\text{member}, & \text{if } \max_c f(x)_c \geq \tau,\\
\text{non-member}, & \text{otherwise.}
\end{cases}
$$

where $\tau$ is the chosen threshold.

## 15.3 Intuition

The slide states:

- if $x \in \mathcal{D}$, then $f(x)$ has overfitted.

The intuition is that overfitting can make the model more confident on training examples than on non-training examples.

## 15.4 Histogram example

The slide plots density against **Maximal Posterior**, comparing:

- Random;
- Non-member;
- Member.

The member distribution is concentrated near maximal posterior $1.0$. Non-members and random examples are more spread out at lower posterior values.

A vertical threshold line is drawn near the high-confidence end of the plot. Points above the threshold would be predicted as members under Algorithm III.

---

## 16. Membership inference algorithm comparison

The algorithm-comparison slide plots **precision** and **recall** for:

- Adversary 1;
- Adversary 2;
- Adversary 3.

The datasets shown are:

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
- Purchase-100.

### What the chart shows

- Performance varies substantially by dataset.
- Precision is often high for Adversary 1 and Adversary 2.
- Adversary 3 is lower on several precision bars, but not uniformly poor.
- Recall varies more sharply, especially for Adversary 3 on some datasets.

**[UNCLEAR]** The slide does not explicitly map “Adversary 1,” “Adversary 2,” and “Adversary 3” to Algorithms I, II, and III in the visible text. The mapping should be checked in the recording.

**[UNCLEAR]** Exact numerical values are not printed in the bar chart, so any precise values should be checked from the recording or source paper.

---

# Part III — Code Tutorial on Privacy Attacks

## 17. Tutorial scope

The code tutorial slide says it is a deeper dive into both attack families.

## 17.1 Model extraction tutorial topics

The tutorial covers:

- Uniform Sampling;
- Line Search;
- Uncertainty Sampling.

These correspond directly to the black-box extraction sampling strategies from the model extraction lecture.

## 17.2 Membership inference tutorial topics

The tutorial covers:

- Shadow Model;
- Confidence Threshold.

These correspond to:

- shadow-model-based membership inference, as in Algorithms I and II;
- threshold-based membership inference, as in Algorithm III.

## 17.3 Materials

The slide says:

- see Jupyter notebooks on Canvas.

---

# Exam flags and high-value points

## Explicit exam-related statement

- The code tutorial “Next up” slide lists **Friday 6 March @ 2pm — Exam demo exercises**.
- No uploaded slide or note explicitly says “this will be on the exam” for a specific Week 4 concept.

## High-value slide emphases

The following points are explicitly emphasised in the slides/notes and are likely important for revision:

1. **Binary logistic classifier parameter stealing needs only $d+1$ samples** when confidence values are returned and the chosen augmented input matrix is full-rank.
2. **Confidence values make simple model stealing much easier** because the inverse sigmoid turns the input-output relationship into a linear system.
3. **Black-box extraction requires synthetic inputs**, and the stated goal is to **minimise the number of queries**.
4. The three extraction sampling strategies are:
   - uniform sampling;
   - line search;
   - adaptive / uncertainty sampling.
5. The two extraction evaluation metrics are:
   - $R_{\text{test}}$;
   - $R_{\text{unif}}$.
6. **Membership inference predicts whether $x \in \mathcal{D}$ or $x \notin \mathcal{D}$**.
7. **Algorithm I’s main issue** is needing $\mathcal{D}_{\text{shadow}} \sim \mathcal{D}$.
8. **Algorithm II weakens the assumption** to arbitrary shadow data $\mathcal{D}_{\text{whatever}}$.
9. **Algorithm III needs no data or shadow model** and uses the confidence-threshold criterion:

$$
\max_c f(x)_c \geq \text{threshold}.
$$

---

# Connections to earlier lectures, papers, and applications

## Earlier course material

Week 4 connects back to:

- FGSM;
- interval analysis;
- neural network verification;
- adversarial training;
- Lipschitz-bounded neural networks;
- randomised smoothing.

The connection is framed as a shift from **integrity** to **privacy**.

## Papers and sources named in the slides/notes

- Lowd and Meek (2005), *Adversarial learning*.
  - Referenced for black-box extraction of linear classifiers and the Lowd-Meek line-search strategy.
- Tramèr et al. (2016), *Stealing Machine Learning Models via Prediction APIs*.
  - Referenced for model extraction and the sampling/evaluation figures.
- He et al. (2025), *Artificial intelligence security and privacy: a survey*.
  - Source of the model extraction taxonomy diagram.
- Salem et al. (2019), *ML-Leaks: Model and Data Independent Membership Inference Attacks and Defenses on Machine Learning Models*.
  - Source of the membership inference intuition figure.
- The membership slides also cite an arXiv reference about LLMs trained on books as a legal motivation for discovering copyrighted data.

## Practical applications mentioned

- Competing MLaaS services using a stolen surrogate model.
- Further white-box attacks using the surrogate as an approximation of a black-box model.
- Discovering whether sensitive data such as medical records or API keys were used in training.
- Discovering whether copyrighted data was included in model training.

---

# Unclear sections to revisit in the recording

1. **No transcript was included in the uploaded zip.** These notes use the slides and the written lecture notes only.
2. **Black-box parameter extraction without confidence values** is explicitly not covered in the written notes. The notes refer to Lowd and Meek (2005).
3. **Budget Factor $\alpha$** in the Tramèr et al. extraction-error figure is not defined in the uploaded material.
4. **Membership Algorithm I result chart** gives precision/recall bars but no exact numerical labels.
5. **Membership Algorithm II heatmaps** do not define in text which axis is target data and which is shadow data.
6. **The highlighted “95”** in the Algorithm II heatmaps is not explained in text.
7. **Algorithm comparison: Adversary 1/2/3** are not explicitly mapped to Algorithms I/II/III in the visible slide text.
8. **Membership-inference confidence assumptions**: the slides show class scores/confidence, but do not fully specify whether all algorithms require full score vectors or only the maximum class confidence.
