---
subject: COMP60272
chapter: 3
title: "Week 3"
language: en
---

# COMP60272 - Security and Privacy of AI: Week 3 Study Notes

**Topic and scope.** This week covers adversarial defences: adversarial training, Lipschitz-bounded neural networks, and randomised smoothing. The broader theme is how to train or modify ML systems so that adversarial input perturbations do not easily change predictions.

**Source/material note.** The uploaded zip contains slide decks and lecture-note PDFs. I did not find a separate transcript file in the archive, so these notes use the slides plus the lecture-note PDFs, and I flag transcript-dependent gaps as [UNCLEAR] where appropriate.

---

## 1. Week 3 overview: adversarial defences

### 1.1 Core problem

The slides motivate the week with the standard adversarial-example picture:

- Original image/input: `x`, classified as **"panda"**, 57.7% confidence.
- Perturbation: `.007 x sign(\nabla_x J(\theta, x, y))`, visually noise-like and labelled **"nematode"**, 8.2% confidence.
- Perturbed image: `x + \epsilon sign(\nabla_x J(\theta, x, y))`, classified as **"gibbon"**, 99.3% confidence.

The stated goal for the week is:

> How to train ML models that do not allow adversarial attacks.

### 1.2 Defence techniques covered

The randomised smoothing slide gives the week-level taxonomy:

| Technique | Stage | Intervention |
|---|---:|---|
| Adversarial Training | Train time | Data augmentation |
| Lipschitz-Bounded NN | Train time | Architectural change |
| Randomised Smoothing | Inference time | Probabilistic inputs |

The same slide states the main trade-offs:

| Technique | Pros | Cons |
|---|---|---|
| Adversarial Training | Fits the ML mindset | No guarantees |
| Lipschitz-Bounded NN | Provable guarantees | Less expressivity |
| Randomised Smoothing | Reuse existing model | Slower inference |

---

## 2. Adversarial Training

### 2.1 Intuition

**Intuition.** Adversarial training treats adversarial examples as extra training data. Instead of training only on clean examples, the model is trained on both the original dataset and an attack dataset generated from the current model.

The key loop on the slide is:

1. Start with a clean dataset `D`.
2. Train the model on `D \cup D'`, where `D'` is the adversarial/attack dataset.
3. Use the current model to compute new adversarial examples.
4. Update `D'` and repeat.

This is similar to data augmentation because it creates synthetic data points, but different because the synthetic examples depend on the model itself.

### 2.2 Empirical Risk Minimisation: regular accuracy

For ordinary training, the slide defines the target parameters as minimising the expected loss over the data distribution:

$$
\theta^* = \arg\min_\theta \; \mathbb{E}_{(x,y) \sim \mathcal{D}}
\left\{ \mathcal{L}(f_\theta(x), y) \right\}.
$$

Since the true distribution is unavailable, empirical risk minimisation approximates this with a finite dataset of size `N`:

$$
\theta^* \approx \arg\min_\theta \; \frac{1}{N}\sum_{i=1}^{N}
\mathcal{L}(f_\theta(x_i), y_i).
$$

### 2.3 Empirical Risk Minimisation: robust accuracy

For robust training, the objective changes: instead of only minimising the loss at `x`, the model minimises the worst-case loss over allowed perturbations.

The slide gives:

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

- **Intuition:** A prediction is robust when it remains correct even after an attacker is allowed to perturb the input within a set `E`.
- **Formalism from slide:** The loss includes an inner maximisation over perturbations `\epsilon \in E`. Training then minimises this worst-case loss.

The slide cites Casadio et al. (2022), *Neural Network Robustness as a Verification Property: A Principled Case Study*.

### 2.4 Adversarial training dataset construction

The adversarial training slide defines two datasets:

$$
D = \{(x_i, y_i)\},
\qquad
D' = \{(x_i', y_i)\}.
$$

The model is trained on both datasets:

$$
\theta^* = \arg\min_\theta \; \frac{1}{|D \cup D'|}
\sum_{i \in D \cup D'} \mathcal{L}(f_\theta(x_i), y_i).
$$

The attack dataset is computed as:

$$
D' = \left\{(x_i', y_i) : x_i \in D \; \land \;
 x_i' = \arg\max_{\epsilon \in E} \mathcal{L}(f_\theta(x_i + \epsilon_i), y_i)
\right\}.
$$

[UNCLEAR] The slide maximises over `\epsilon \in E` but the inner expression is printed as `x_i + \epsilon_i`. This is probably an indexing/notation issue in the slide; revisit the recording or original source if the exact notation matters.

### 2.5 Adversarial training vs data augmentation

**Similarities:**

- Both increase the size of the training set.
- In both cases, the new data points are synthetically generated.

**Differences:**

- In adversarial training, the augmentation/attack depends on the model `f_\theta` itself.
- The augmented dataset `D'` changes during training.

**Key concept: model-dependent augmentation.**

- **Intuition:** Ordinary augmentation can be fixed in advance; adversarial examples must be recomputed because the current model determines which perturbations are adversarial.
- **Formalism:** The attack dataset is defined using `f_\theta` inside the maximisation, so changing `\theta` changes `D'`.

### 2.6 Algorithmic considerations

The slide highlights two practical issues.

#### Computational efficiency

- A quick attack algorithm is needed to compute attacks during training.
- FGSM is given as an example of a quick attack algorithm.
- Some verifiers provide counterexamples but are slow.
- Therefore, verifiers should be used at the very end only.

#### Convergence

- We usually cannot stop all attacks.
- The augmented dataset `D'` changes during training.
- This means adversarial training does not come with the same kind of guarantee as the safe-by-design methods later in the week.

### 2.7 Coding tutorial plan

The coding tutorial slide lists:

- Training a simple binary classifier.
- Computing adversarial examples.
- One or more rounds of finetuning.

The slide includes a plot labelled **Regular Training** showing a binary-classifier-like output over a one-dimensional input range.

---

## 3. Lipschitz-Bounded Neural Networks

### 3.1 Recap and goal

The Lipschitz slide starts by recapping adversarial training:

- Train for robust accuracy.
- Add adversarial examples to the dataset.
- No guarantees of convergence or absence of attacks.
- Very flexible and blends well with the ML mindset.

The new goal is a **safe-by-design principle**:

- Make architectural changes to the neural network.
- Obtain provable safety guarantees.

The proposed method is **Lipschitz-bounded neural networks**.

### 3.2 Key idea: limit sudden changes

The slide states the goal:

> limit any sudden change -> robustness

The proposed mechanism is to put an upper bound on the slope:

$$
\nabla_x f(x).
$$

**Intuition.** If changing the input by a small amount cannot change the output by too much, then a small adversarial perturbation cannot easily flip the prediction.

### 3.3 Lipschitz constant

#### Formal definition

Given a function

$$
f : \mathbb{R}^m \to \mathbb{R}^n,
$$

its Lipschitz constant relative to a `p`-norm `\|\cdot\|_p` is any value

$$
L_f \in \mathbb{R}^+
$$

such that:

$$
\|f(x) - f(x')\|_p \le L_f \cdot \|x - x'\|_p.
$$

#### Intuition

The Lipschitz constant gives an upper bound on the slope of `f`.

If the input changes by distance `\epsilon`, then the output cannot change by more than:

$$
\epsilon \cdot L_f.
$$

This is what makes Lipschitz continuity relevant to adversarial robustness.

### 3.4 Composition of Lipschitz functions

#### Statement

Given two functions `f` and `g` with Lipschitz constants `L_f` and `L_g`, the Lipschitz constant of their composition

$$
h \equiv g \circ f
$$

is:

$$
L_h = L_f \cdot L_g.
$$

#### Derivation from the lecture notes

Let:

$$
h(x) = g(f(x)).
$$

Define:

$$
z \equiv f(x),
\qquad
z' \equiv f(x').
$$

Since `g` has Lipschitz constant `L_g`:

$$
\|h(x) - h(x')\|
= \|g(z) - g(z')\|
\le L_g \|z - z'\|.
$$

Since `f` has Lipschitz constant `L_f`:

$$
\|z - z'\|
= \|f(x) - f(x')\|
\le L_f \|x - x'\|.
$$

Combining these inequalities:

$$
\|h(x) - h(x')\|
\le L_g \|z - z'\|
\le L_g L_f \|x - x'\|.
$$

Therefore:

$$
L_h = L_g \cdot L_f.
$$

### 3.5 Worked example: Lipschitz-bounded approximation of a step function

The lecture notes describe a figure comparing four neural architectures, all with Lipschitz constant:

$$
L_f = 10.
$$

The dataset itself is not Lipschitz continuous: the ground truth is a step function that changes abruptly at:

$$
x = 0.
$$

Because of the Lipschitz constraint, all neural networks approximate the ground truth near `x = 0` with a maximum slope below `L_f = 10`, causing a smooth transition between the two levels of the step function.

The figure labels the slopes approximately as:

- AOL: slope 4.8.
- Orthogon: slope 6.5.
- SLL: slope 6.8.
- Ours: slope 9.4.
- Best possible: slope 10.

**Interpretation.** The bound controls how sharply the network can change. Even when the true target changes abruptly, the model is forced to transition smoothly.

### 3.6 Robustness of Lipschitz classifiers

#### Formal statement

Given a classifier:

$$
f : \mathbb{R}^n \to \mathbb{R}^m,
$$

which predicts according to the highest-scoring output entry:

$$
c = \arg\max_{i \in m} f(x)_i,
$$

its predictions are robust in an `\epsilon`-ball around a specific input `x \in \mathbb{R}^n` if:

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

Here `L_f` is the Lipschitz constant of `f` under the `p`-norm of interest.

#### Intuition

The classifier is robust if the gap between the winning class and the runner-up class is large enough. Specifically, the score gap must be at least:

$$
2\epsilon L_f.
$$

Why the factor of 2? Under a perturbation, the winning class score can go down by as much as `\epsilon L_f`, and the runner-up score can go up by as much as `\epsilon L_f`. The gap can therefore shrink by up to `2\epsilon L_f`.

#### Proof steps

From the Lipschitz property and the premise:

$$
\|x - x'\|_p \le \epsilon,
$$

we get:

$$
\epsilon L_f
\ge \|f(x) - f(x')\|_p
\ge |f(x)_i - f(x')_i|.
$$

The last inequality holds because for any vector `z`, each component satisfies:

$$
|z_i| \le \|z\|_p.
$$

Therefore, every output entry is bounded as:

$$
f(x')_i \in [f(x)_i - \epsilon L_f,\; f(x)_i + \epsilon L_f].
$$

Now focus on:

- `c`: the original top class.
- `d = \arg\max_{i \ne c} f(x)_i`: the second-highest scoring class.

Using the bound twice:

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

If the original score gap satisfies:

$$
f(x)_c - f(x)_d \ge 2\epsilon L_f,
$$

then:

$$
f(x')_c - f(x')_d \ge 0.
$$

So `c` remains the top predicted class under all perturbations `x'` in the `\epsilon`-ball.

### 3.7 Building Lipschitz-bounded neural networks

The lecture notes then focus on how to define Lipschitz-bounded layers with:

$$
L = 1,
$$

and how to compose them into adversarially robust neural models.

Important scope condition from the notes:

- Most of the results in this section are valid for the Euclidean norm only:

$$
p = 2.
$$

### 3.8 Spectral Normalisation layer

#### Motivation

The aim is to re-parametrise common neural network layers so that they enforce the 1-Lipschitz property without explicit constraints. This allows training to continue normally, without adding extra regularisation terms.

#### Formal statement

For a weight matrix:

$$
W \in \mathbb{R}^{n \times m},
$$

define the linear layer:

$$
\ell(x) = \frac{Wx}{\lambda(W)} + b,
$$

where `\lambda(W)` is the spectral norm of `W`.

The resulting layer has Lipschitz constant:

$$
L_\ell = 1.
$$

#### Proof steps

For two inputs `x, x'`:

$$
\|\ell(x) - \ell(x')\|_p
= \left\|\frac{Wx}{\lambda(W)} + b - \frac{Wx'}{\lambda(W)} - b\right\|_p.
$$

Cancel `b` and factor:

$$
= \frac{1}{\lambda(W)}\|W(x - x')\|_p.
$$

Rewrite by multiplying and dividing by `\|x - x'\|_p`:

$$
= \frac{1}{\lambda(W)}
\left\|\frac{W(x - x')}{\|x - x'\|_p}\right\|_p
\|x - x'\|_p.
$$

Upper-bound with a maximisation over all non-zero vectors `z`:

$$
\le \frac{1}{\lambda(W)}
\max_{z \ne 0}
\left\|\frac{Wz}{\|z\|_p}\right\|_p
\|x - x'\|_p.
$$

By the definition of the spectral norm, this becomes:

$$
= \|x - x'\|_p.
$$

Therefore:

$$
\|\ell(x) - \ell(x')\|_p \le \|x - x'\|_p,
$$

so the layer is 1-Lipschitz.

### 3.9 Spectral norm via power iteration

The notes state that spectral normalisation requires computing the spectral norm of the weight matrix at every training step, so an efficient algorithm is needed.

#### Algorithm: Spectral Norm via Power Iteration

1. Initialise:

$$
v, u \leftarrow \mathcal{N}(0, 1).
$$

2. For `k` iterations:

$$
v \leftarrow \frac{Wu}{\|Wu\|_2},
$$

$$
u \leftarrow \frac{v^T W}{\|v^T W\|_2}.
$$

3. Return the estimate:

$$
\hat{\lambda}(W) = v^T W u.
$$

[UNCLEAR] The notes do not specify the dimensions of the initial random vectors `u` and `v`; infer them from `W` when implementing.

#### Practical details

- Around 100 iterations are enough for convergence to:

$$
\hat{\lambda}(W) \approx \lambda(W).
$$

- During training, `W` changes slowly.
- Therefore, one iteration may suffice at each step if the previous values of `u` and `v` are reused across the training run.

### 3.10 Problem with 1-Lipschitz layers: signal attenuation

The notes emphasise that 1-Lipschitz layers are **contractive**:

$$
\|y\|_2 \le \|x\|_2.
$$

This means the magnitude of the signal can become attenuated at every layer.

Spectral normalisation is described as particularly bad from this perspective: unless the input vector aligns with the dominant eigenvector of `W`, the magnitude is attenuated.

### 3.11 Other one-Lipschitz layers

The notes cover two alternative strategies for reducing attenuation.

#### 3.11.1 Almost Orthogonal Lipschitz (AOL) layer

**Intuition.** Orthogonal matrices preserve vector length, such as rotations or reflections. If weights are encouraged to stay close to orthogonal, signal attenuation can be reduced.

**Formal definition.** The AOL linear layer is:

$$
\ell(x) = W D x + b,
$$

where `D` is diagonal and:

$$
D_{ii} = \left(\sum_j |W^T W|_{ij}\right)^{-\frac{1}{2}}.
$$

#### 3.11.2 Convex Potential (CPL) layer

**Intuition.** Add residual connections so the signal can pass through unaltered.

**Formal definition.** The CPL layer is the residual block:

$$
\ell(x) = x - \frac{2}{\lambda(W)^2} W^T \sigma(Wx + b),
$$

where:

- `\lambda(W)` is the spectral norm of `W`.
- `\sigma(\cdot)` is any 1-Lipschitz, non-decreasing, element-wise activation function.

The notes say the deeper reason this works is in the referenced CPL paper.

### 3.12 Special one-Lipschitz activations

The notes state that the most popular activations are already 1-Lipschitz:

- ReLU.
- Sigmoid.
- TanH.

They can be combined with 1-Lipschitz linear layers to build a complete neural network model.

However, theoretical research has shown that under specific circumstances, these common activations may reduce the expressive capabilities of the network.

New activation functions have therefore been proposed to preserve signal magnitude as it propagates through the network.

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

The notes define:

$$
\mathrm{GroupSort}_k : \mathbb{R}^n \to \mathbb{R}^n.
$$

The surrounding explanation says:

- Divide the input vector `x` into contiguous chunks of size `k`.
- Sort each chunk in descending order.
- The number of chunks is written as `\lceil n/k \rceil` in the extracted text, but the rendered formula uses bracket notation that appears visually similar to ceiling/floor notation.

[UNCLEAR] The printed formula appears to repeat the same index on both sides:

$$
\mathrm{GroupSort}_k(x)_i \ge \mathrm{GroupSort}_k(x)_i,
$$

with the condition:

$$
\forall i \ge j \quad \text{such that} \quad
\left\lfloor \frac{i}{k} \right\rfloor =
\left\lfloor \frac{j}{k} \right\rfloor.
$$

Given the explanatory sentence, the intended right-hand side is likely the `j`-indexed entry, but the printed notes should be checked against the recording/source.

The notes state that a formal proof that Abs and GroupSort are 1-Lipschitz is left as an exercise to the reader.

### 3.13 Arbitrary Lipschitz constants

In practice, we may want a `c`-Lipschitz neural network `f`, where:

$$
L_f \le c.
$$

The notes say we can:

1. Build a 1-Lipschitz network.
2. Multiply its output by `c`.

#### Product by a constant

Given a function `f` with Lipschitz constant `L_f`, define:

$$
g(x) = c \cdot f(x).
$$

The notes state that the Lipschitz constant of `g` is:

$$
L_g = c \cdot L_f.
$$

[UNCLEAR] The rendered definition contains a typesetting glitch: `L_g = c · · · L_f`, and it states `c \in \mathbb{R}`. The proof treats `c` as a nonnegative scaling factor. Check the recording/source if the sign/absolute-value convention matters.

#### Proof steps

Starting from the definition:

$$
\|g(x) - g(x')\|_p
= \|c \cdot f(x) - c \cdot f(x')\|_p.
$$

Factor out `c` as written in the notes:

$$
= c\|f(x) - f(x')\|_p.
$$

Use Lipschitzness of `f`:

$$
\le c \cdot L_f \|x - x'\|_p.
$$

Thus `L_g = c \cdot L_f` is a valid Lipschitz constant as written in the notes.

### 3.14 Expressivity vs robustness trade-off

The notes state that varying `c` lets us explore the trade-off between:

- **Expressive power:** larger `c`.
- **Robustness:** smaller `c`.

The notes also state that robust architectures generally have lower accuracy, so the right balance must be chosen through empirical experimentation.

---

## 4. Randomised Smoothing

### 4.1 Recap: where randomised smoothing fits

Randomised smoothing is the third adversarial defence in the week.

Compared with the other techniques:

- Adversarial training changes training data at train time.
- Lipschitz-bounded neural networks change architecture at train time.
- Randomised smoothing changes inference by using probabilistic inputs.

The slide states its main advantage and disadvantage:

- **Pro:** reuse an existing model.
- **Con:** slower inference.

### 4.2 Intuition

The lecture notes describe randomised smoothing as a deceptively simple but effective method for defending against adversarial input perturbations.

**Core intuition:**

- Adversarial examples may exist near an input `x`.
- But most neighbouring inputs around `x` may still be classified correctly.
- At inference time, add random noise to the input and classify repeatedly.
- If the majority of noisy neighbours are classified correctly, the smoothed classifier can resist small adversarial perturbations.

The visual example in the notes/slide:

- Input `x` is in a blue decision region.
- A small adversarial perturbation can move it to a nearby green region.
- However, most of the neighbourhood around the perturbed point is still blue.
- Sampling many points from a multivariate Gaussian distribution around the adversarial point, e.g.

$$
\mathcal{N}(x', \sigma^2 I),
$$

would produce many inputs classified as blue.

### 4.3 Formal definition of randomised smoothing

Given a classifier:

$$
f : \mathbb{R}^n \to C,
$$

where `C` is the set of output classes, the smoothed classifier `g` is:

$$
g(x) \equiv \arg\max_{c \in C} \mathbb{P}(f(x + \xi) = c),
$$

where:

$$
\xi \sim \mathcal{N}(0, \sigma^2 I)
$$

is an `n`-dimensional normally distributed random variable with variance `\sigma^2`.

**Intuition vs formalism:**

- **Intuition:** vote over noisy versions of the same input.
- **Formalism:** the predicted class is the class with maximum probability under Gaussian perturbations of the input.

The slide states the same goal as:

$$
\mathbb{P}_{\xi \sim \mathcal{N}(0,\sigma^2 I)}(f(x + \xi) = c)
$$

instead of directly computing `f(x)`.

### 4.4 The smoothing parameter `\sigma`

The variance `\sigma^2` controls the amount of smoothing.

- As `\sigma \to \infty`, too much smoothing is introduced, and all output predictions tend to become the same.
- As `\sigma \to 0`, the smoothed classifier becomes very close to the base model `f`.

This creates a trade-off:

- High `\sigma`: more robustness.
- Low `\sigma`: higher predictive accuracy.

### 4.5 Connection to Lipschitz continuity

The notes state that randomised smoothing performs a convolution between the base classifier `f` and a normal distribution:

$$
\mathcal{N}(0, \sigma^2 I).
$$

This reduces the slope of `f`.

The figure in the notes shows:

- An unsmoothed base classifier `f(x)`.
- Smoothed versions with `\sigma = 0.05`, `\sigma = 0.1`, and `\sigma = 0.2`.
- Larger `\sigma` smooths sharper changes more strongly.

### 4.6 Lipschitzness of smoothed classifiers

#### Formal statement

Let `f` and `g` be base and smoothed classifiers as above.

Let `c_A` and `c_B` be the top-scoring classes, with probability bounds satisfying:

$$
\mathbb{P}(f(x + \xi) = c_A)
\ge \underline{p_A}
\ge \overline{p_B}
\ge \max_{c_B \ne c_A}
\mathbb{P}(f(x + \xi) = c_B).
$$

Then the smoothed classifier is robust for all perturbations inside a specific radius `\epsilon`. That is:

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

is the normal quantile function, i.e. the inverse of the cumulative distribution of a normal distribution.

[UNCLEAR] The notes say this is the inverse cumulative distribution of `\mathcal{N}(0, \sigma^2)`, while the formula separately multiplies by `\sigma`. Revisit the source if implementation details require the exact convention for `\Phi`.

#### Proof sketch from the lecture notes

The proof uses a result on the Weierstrass transform:

$$
\hat{h}(x)
= \mathbb{E}_{\xi \sim \mathcal{N}(0, \sigma^2 I)} h(x + \xi),
$$

for any function:

$$
h : \mathbb{R}^n \to [0,1].
$$

The useful result states that:

$$
\Phi^{-1}(\hat{h}(x))
$$

has Lipschitz constant:

$$
\frac{1}{\sigma}.
$$

Define an indicator function for each output class `c` of the base classifier:

$$
h_c(x) =
\begin{cases}
1, & \text{if } f(x) = c,\\
0, & \text{otherwise.}
\end{cases}
$$

Then each:

$$
\Phi^{-1}(\hat{h}_c(x))
$$

has Lipschitz constant `1/\sigma`.

If these scores are used as a Lipschitz-bounded classifier, the robustness condition requires:

$$
\forall x, x' \in \mathbb{R}^n,
\qquad
\|x - x'\| \le \epsilon
\quad \land \quad
\Phi^{-1}(\hat{h}_{c_A}(x))
- \Phi^{-1}(\hat{h}_{c_B}(x))
\ge \frac{2\epsilon}{\sigma}.
$$

[UNCLEAR] The notes refer here to “Statement ??”; this is likely the earlier Lipschitz classifier robustness statement, but the cross-reference is broken in the PDF.

Since:

$$
\hat{h}_{c_A} \ge \underline{p_A},
\qquad
\hat{h}_{c_B} \le \overline{p_B},
$$

we have:

$$
\frac{2\epsilon}{\sigma}
\le
\Phi^{-1}(\underline{p_A}) - \Phi^{-1}(\overline{p_B})
\le
\Phi^{-1}(\hat{h}_{c_A}(x)) - \Phi^{-1}(\hat{h}_{c_B}(x)).
$$

This gives the closed-form robustness radius:

$$
\epsilon = \frac{\sigma}{2}
\left(
\Phi^{-1}(\underline{p_A}) - \Phi^{-1}(\overline{p_B})
\right).
$$

### 4.7 Why Monte Carlo approximation is needed

The exact definition of `g` requires computing exact output probabilities for the base classifier `f`. The notes state that, in general, this is computationally expensive and belongs to the NP class.

Therefore, the lecture uses Monte Carlo estimation.

### 4.8 Algorithm 1: Monte Carlo Sampling

Inputs implied by the pseudocode: classifier `f`, input `x`, smoothing parameter `\sigma`, number of samples `k`, class set `C`.

1. Initialise counts:

$$
k_c \leftarrow 0,
\qquad \forall c \in C.
$$

2. For `k` iterations:

Sample noise:

$$
\xi \sim \mathcal{N}(0, \sigma^2 I).
$$

Classify the noisy input:

$$
c \leftarrow f(x + \xi).
$$

Increment the count:

$$
k_c \leftarrow k_c + 1.
$$

3. Return:

$$
k_1, \dots, k_{|C|}.
$$

**Interpretation.** Each count `k_c` is the number of times the base classifier predicts class `c` under Gaussian perturbations.

### 4.9 Algorithm 2: Smoothed Prediction

1. Run Monte Carlo sampling:

$$
k_1, \dots, k_{|C|}
\leftarrow
\mathrm{MonteCarloSampling}(f, x, \sigma, k).
$$

2. Find the top-voted class:

$$
\hat{c}_A \leftarrow \arg\max_{c \in C} k_c.
$$

3. Find the second-highest class:

$$
\hat{c}_B \leftarrow \arg\max_{c \ne \hat{c}_A} k_c.
$$

4. Compute a two-sided binomial test:

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

**Important interpretation.** The algorithm does not blindly trust the sampled majority class. It uses a statistical significance test to decide whether the top class is likely to truly be the top class.

### 4.10 Rank verification

#### Formal definition from the notes

Assume the counts:

$$
k_1, \dots, k_{|C|}
\sim
\mathrm{Multinomial}(\pi_1, \dots, \pi_{|C|}, k),
$$

with class probabilities:

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

These are the classes with the most and second-most samples.

Then the likelihood that:

$$
\hat{c}_A \ne \arg\max_c \pi_c
$$

is equal to the p-value of the two-sided binomial test of observing:

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

The p-value gives the likelihood of observing `k_{\hat{c}_A}` samples, or a more extreme event, under the null hypothesis that the top two classes are equally likely:

$$
\pi = \frac{1}{2}.
$$

If the p-value is lower than `\alpha`, we conclude that the probability of returning a wrong prediction is less than `\alpha`.

If not, the classifier abstains, returning “I do not know”.

### 4.11 Algorithm 3: robustness radius estimation

The goal is to compute robust accuracy for the smoothed classifier by estimating the radius certified by the Lipschitzness result.

#### Algorithm

1. Run Monte Carlo sampling:

$$
k_1, \dots, k_{|C|}
\leftarrow
\mathrm{MonteCarloSampling}(f, x, \sigma, k).
$$

2. Compute a lower binomial bound:

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

[UNCLEAR] The pseudocode for Algorithm 3 uses `\hat{c}_A` but does not show it as an explicit input. The notes explain that `\hat{c}_A` should be produced by Algorithm 2 and then provided to Algorithm 3.

#### Derivation of the returned radius

The notes rely on two facts.

First, use:

$$
1 - \underline{p_A} \ge 1 - p_A \ge p_B
$$

as a valid upper bound:

$$
\overline{p_B}.
$$

This means the algorithm only needs to estimate `\underline{p_A}`, reducing complexity.

Second, since:

$$
p_A \ge p_c
$$

for any class:

$$
c \ne c_A,
$$

the algorithm can estimate the radius using any guess `\hat{c}_A` for the top-scoring class, even if the guess is incorrect. The caveat is that the choice of `\hat{c}_A` must be statistically independent of the estimation of `\underline{p_A}`.

The notes say this independence can be achieved by:

1. Running Algorithm 2.
2. Providing the resulting `\hat{c}_A` as input to Algorithm 3.

Then estimate a lower bound on the underlying binomial probability:

$$
\pi_{\hat{c}_A},
$$

where all other classes are merged into:

$$
1 - \pi_{\hat{c}_A}.
$$

The goal is to find a lower bound such that:

$$
\underline{p_A} \le \pi_{\hat{c}_A}
$$

with confidence:

$$
1 - \alpha.
$$

Finally:

$$
\Phi^{-1}(\overline{p_B})
= \Phi^{-1}(1 - \underline{p_A})
= -\Phi^{-1}(\underline{p_A}).
$$

Substitute into the radius formula:

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

then the algorithm cannot prove:

$$
p_A \ge p_B,
$$

so the radius is undefined and the algorithm abstains.

---

## 5. Coursework and exam-relevant flags

### 5.1 Explicit coursework flag

**COURSEWORK FLAG: Coursework I - Adversarial Attacks & Defences**

The randomised smoothing slide lists the coursework components:

| Component | Points |
|---|---:|
| FGSM Attacks | 4 points |
| Robustness Radius | 6 points |
| Interval Analysis | 6 points |
| Randomised Smoothing | 4 points |
| [UNCLEAR: unlabeled row] | 4 points |
| Total | 24 points |

The slide also states:

- One extra point for note-taking contributions.

[UNCLEAR] The coursework table has a visible additional 4-point row with no label. Recheck the recording or original slide source.

### 5.2 Exercise flag

**EXERCISE FLAG:** The formal proof that the Abs and GroupSort activations are 1-Lipschitz is left as an exercise to the reader.

### 5.3 No transcript-specific exam flags available

[UNCLEAR] No separate transcript file was present in the uploaded zip. Therefore, any spoken statements like “this will be on the exam,” “common mistake,” or “you should know this” cannot be captured unless they are also visible in the slides/lecture notes.

---

## 6. Connections across lectures and applications

### 6.1 Adversarial training -> Lipschitz-bounded networks

The Lipschitz lecture explicitly frames itself as a response to the limitations of adversarial training:

- Adversarial training is flexible and intuitive for ML practitioners.
- But it has no guarantee of convergence or absence of attacks.
- Lipschitz-bounded architectures are introduced as a safe-by-design alternative with provable guarantees.

### 6.2 Lipschitz-bounded networks -> randomised smoothing

The randomised smoothing notes connect smoothing back to Lipschitz continuity:

- Randomised smoothing is described as convolution with a Gaussian distribution.
- This reduces the slope of the classifier.
- A formal robustness radius is then derived using a Lipschitz-style argument.

### 6.3 Train-time vs inference-time defences

The slide taxonomy connects the techniques by where they intervene:

- Adversarial training: train-time data augmentation.
- Lipschitz-bounded networks: train-time architectural change.
- Randomised smoothing: inference-time probabilistic input transformation.

### 6.4 Forward connection to later course topics

The final randomised smoothing slide says the next topics are:

- Model reconstruction attacks.
- Data reconstruction attacks.
- Code tutorial.

---

## 7. Consolidated unclear sections to revisit in recording/source

1. **Transcript missing.** The archive contains PDFs only; no separate transcript was found. Spoken exam flags and explanations may be missing.
2. **Adversarial training attack formula.** The slide maximises over `\epsilon \in E` but prints `x_i + \epsilon_i` inside the loss. Check whether the intended notation is `\epsilon` or indexed `\epsilon_i`.
3. **Power iteration vector dimensions.** The algorithm initializes `v,u \leftarrow \mathcal{N}(0,1)` but does not specify dimensions.
4. **GroupSort formula.** The printed formula appears to repeat index `i` on both sides, while the text says each group is sorted in descending order. Check original source/recording.
5. **Constant-scaling Lipschitz formula.** The definition has a typesetting glitch `c · · · L_f`, and the proof uses `c` as though nonnegative despite stating `c \in \mathbb{R}`.
6. **Randomised smoothing cross-reference.** The proof sketch refers to “Statement ??”; context indicates this is the earlier Lipschitz classifier robustness result.
7. **Normal quantile convention.** The notes define `\Phi^{-1}` as inverse CDF of `\mathcal{N}(0,\sigma^2)`, while the robustness formula already multiplies by `\sigma`. Check the convention before implementing.
8. **Radius estimation algorithm input.** Algorithm 3 uses `\hat{c}_A` but omits it from the displayed input/signature; notes later say it should come from Algorithm 2.
9. **Coursework table.** One 4-point row is unlabeled in the visible slide.
