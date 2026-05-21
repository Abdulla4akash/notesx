---
subject: COMP60272
chapter: 2
title: "Week 2"
language: en
---

# COMP60272 - Security and Privacy of AI: Week 2 Structured Study Notes

**Topic and scope.** Week 2 moves from adversarial attacks as a security problem to formal reasoning about neural-network safety. The sequence is: finding adversarial attacks with FGSM; reachability and interval analysis as an over-approximate verification method; and practical neural-network verification using ONNX, VNN-LIB, and Marabou.

**Source note.** The uploaded zip contains three slide decks and two lecture-notes PDFs: `w2.1_adversarial.pdf`, `w2.1_notes.pdf`, `w2.2_intervals.pdf`, `w2.2_notes.pdf`, and `w2.3_verification.pdf`. No separate auto-generated transcript file was present in the zip, so these notes use the slides plus the lecture-notes PDFs.

**Exam flags.** No explicit phrase like “this will be on the exam” appears in the supplied files. Explicit warning/importance cues from the slides are marked as **[EXAM FLAG / WARNING]** below.

---

## 1. Lecture 2.1 - Finding Adversarial Attacks

### 1.1 Where this lecture fits

The slide recap says the previous week covered:

- a brief machine-learning recap;
- MLOps and other engineering considerations;
- threats on machine learning: definitions and taxonomies;
- a bit of mathematical modelling.

This lecture asks three questions:

- What are adversarial attacks?
- Where do they come from?
- How do we find them efficiently?

The lecture connects adversarial attacks to both machine-learning fragility and security-style reasoning. It ends by pointing forward to:

- computing adversarial attacks;
- reachability and interval analysis;
- neural-network verification.

---

### 1.2 Adversarial attacks as a machine-learning problem

#### Intuition

The lecture frames adversarial attacks as evidence that high performance on curated datasets does not necessarily correspond to robust real-world deployment. A model can perform well on the usual training/test distribution while still behaving badly when an adversary manipulates inputs.

The lecture also raises a deeper issue: adversarial examples may be a symptom of the fact that machine-learning models do not operate in a human way. The slides cite the idea that adversarial examples may not be “bugs” but “features,” and note that they might be fundamentally impossible to fix. The next week is then described jokingly as trying to fix them anyway.

#### Formal training objective from the lecture notes

The notes present the mainstream machine-learning paradigm as training models against an empirical risk objective:

$$
f^* = \arg\max_f \mathbb{E}\{\mathcal{L}(f(x), y)\}
\approx
\arg\max_f \frac{1}{N}\sum_{(x,y)\in \mathcal{D}} \mathcal{L}(f(x), y).
$$

For a sufficiently large dataset $\mathcal{D}$ containing i.i.d. samples, the empirical risk is expected to approximate the expected value of the loss $\mathcal{L}(f(x),y)$.

**[UNCLEAR]** The notes call this an “empirical risk minimisation objective” but the printed formula uses $\arg\max$, not $\arg\min$. The formula above is preserved as printed; check the recording/source if the sign is important.

#### Why adversarial manipulation breaks the usual assumption

When an adversary is allowed to manipulate inputs $x$, the i.i.d. assumption is broken, no matter how small the perturbation is. In that case, even the optimally trained model $f^*$ may perform arbitrarily poorly.

---

### 1.3 Historical rediscovery and examples of adversarial attacks

#### History of rediscovery

The slides describe adversarial attacks as being independently discovered by:

- the machine-learning community;
- the security community.

The slide references include Szegedy et al. on “Intriguing properties of neural networks,” Biggio et al. on the history of adversarial machine learning, and Goodfellow et al. on “Explaining and Harnessing Adversarial Examples.”

#### Worked visual example: panda to gibbon

The slides and notes show the standard adversarial-image example:

$$
x + 0.007 \times \operatorname{sign}(\nabla_x J(\theta,x,y))
$$

The example is presented as:

- original image $x$: classified as “panda” with 57.7% confidence;
- perturbation term: visually noise-like, with an intermediate label “nematode” at 8.2% confidence;
- perturbed image: classified as “gibbon” with 99.3% confidence.

This is used to show that a perturbation which is small to a human can strongly alter the model’s prediction.

#### Universal adversarial attacks

**Definition / intuition.** A universal adversarial attack is an attack pattern that works beyond a single image/model pair. The slide summarises universal attacks as:

- same attack;
- different images;
- different models.

The key point is that adversarial vulnerability is not necessarily tied to one hand-crafted input. A single perturbation pattern can transfer across inputs and even across models.

#### Not just adversarial noise: rotation and translation

The slides explicitly state that attacks are not limited to imperceptible pixel noise. Rotation and translation can also fool models.

The visual example shows traffic-sign images where transformed stop-sign/warning-sign images are classified as “SpeedLimit20.” This links adversarial behaviour to physical or geometric transformations, not merely pixel-level noise.

#### Not just adversarial noise: weather effects

The slides also show weather effects as a source of robustness problems. The cited figure compares object-detection scenes under challenging weather conditions, including weather augmentation/synthesis approaches. The lecture uses this to broaden the notion of adversarial or robustness stress beyond simple additive noise.

---

### 1.4 The steganography rationale

#### Intuition: adversarial attacks as accidental steganography

The lecture introduces steganography as the art of concealing data:

- add imperceptible changes to radio waves, images, sound, or text;
- the receiver can reconstruct the hidden message.

The adversarial-attack analogy is that a perturbation can be “spread” across many input dimensions so that each individual change is small, while the model still aggregates those changes into a large effect.

The slide states:

> Adversarial attacks ≈ unintentional steganography?

#### Formal setup: linear binary classifier

Assume a linear binary classifier:

$$
f(x)=w^T x.
$$

The classifier predicts the positive class when:

$$
w^T x \ge 0,
$$

and the negative class otherwise.

The lecture decomposes the output on a perturbed input $x'$ as:

$$
y' = w^T x' = w^T x + w^T(x' - x) = y + w^T\eta.
$$

Here:

- $y$ is the non-perturbed output;
- $\eta$ is the input perturbation.

**[UNCLEAR]** The notes define $\eta = x - x'$, but the displayed derivation uses $w^T(x' - x)=w^T\eta$, which would correspond to $\eta=x'-x$. The derivation and definition have a sign mismatch in the supplied notes.

#### Dimensionality effect

The lecture notes state that if the weights $w$ are uniformly distributed and we keep $w^T\eta$ constant, then the magnitude of each perturbation entry decreases linearly with input dimension $d$:

$$
\|\eta_i\| = O(1/d).
$$

Interpretation:

- the total dot-product effect $w^T\eta$ can remain large enough to change the classifier output;
- each individual coordinate perturbation can be small;
- in high dimensions, spreading the perturbation makes each coordinate harder to detect.

#### Consequences stated in the lecture notes

This simplified linear interpretation yields two consequences:

1. Adversarial attacks become a form of “accidental steganography” that most or all machine-learning models are susceptible to.
2. Computing adversarial attacks should become easy, because we only need to follow the gradient of the output with respect to the input.

---

### 1.5 Fast Gradient Sign Method, FGSM

#### Definition: intuition

FGSM is a cheap heuristic method for constructing an adversarial perturbation. It uses the sign of the gradient of the loss with respect to the input, so it modifies each input coordinate in the direction that increases the loss according to the local gradient information.

#### Formal definition from the lecture notes

Given:

- a predictive model $f : \mathbb{R}^n \to \mathbb{R}^m$;
- a loss function $\mathcal{L}: \mathbb{R}^m \times \mathbb{R}^m \to \mathbb{R}^+$;
- an input $x$;
- label/target value $y$;
- a magnitude parameter $\epsilon \in \mathbb{R}^+$;

FGSM constructs:

$$
x' = x + \epsilon \cdot \operatorname{sign}\left(\nabla_x \mathcal{L}(f(x), y)\right).
$$

The lecture notes define $\nabla_x$ as the vector of partial derivatives of the loss $\mathcal{L}$ with respect to each input coordinate $x_i$.

#### Algorithmic reading

FGSM proceeds as follows:

1. Evaluate the loss $\mathcal{L}(f(x),y)$ at the original input.
2. Compute the gradient once with respect to the original input:
   

$$
\nabla_x \mathcal{L}(f(x),y).
$$

3. Take the elementwise sign of that gradient:
   

$$
\operatorname{sign}(\nabla_x \mathcal{L}(f(x),y)).
$$

4. Scale by $\epsilon$.
5. Add the perturbation to the original input:
   

$$
x' = x + \epsilon\operatorname{sign}(\nabla_x \mathcal{L}(f(x),y)).
$$

#### Why it is “fast”

The notes stress that FGSM computes the gradients only once, with respect to the original input $x$. The assumption is that most neural models are approximately linear in a small neighbourhood around $x$, so the gradients remain informative for a range of $\epsilon$ values.

If the goal is to find the smallest $\epsilon$ that fools the classifier $f$, the lecture notes say that a line search over $\epsilon$ would suffice. That line search only runs the model in inference mode, so it preserves the “fast” character of FGSM.

---

### 1.6 Falsification and verification bridge

The lecture closes by reframing adversarial attacks as a security problem: can we achieve certified inference?

This is described as crucial for safety-critical applications.

#### Falsification

Falsification is described as:

- using heuristic adversarial attacks;
- FGSM as an example;
- similar to automated software testing.

The purpose is to find a counterexample or attack.

#### Verification

Verification is described as:

- proving that attacks do not exist;
- the main topic later in the week;
- similar to automated theorem proving.

The purpose is to prove safety, not merely fail to find attacks.

**[EXAM FLAG / WARNING]** The slide states that certified inference is crucial for safety-critical applications.

---

## 2. Lecture 2.2 - Reachability and Interval Analysis

### 2.1 Where this lecture fits

The interval-analysis lecture begins by recapping the security problem from the adversarial-attacks lecture:

- certified inference is crucial for safety-critical applications;
- falsification uses heuristic attacks such as FGSM and is analogous to automated software testing;
- verification proves that attacks do not exist and is analogous to automated theorem proving.

The lecture then moves into:

- reachability;
- exact reachable sets;
- over-approximation;
- safety proofs;
- interval analysis definitions and operators;
- neural-network reachability.

---

### 2.2 From adversarial optimisation to satisfiability

#### Optimisation formulation

The slide formulates adversarial attack search as finding the smallest perturbation that changes the predicted class:

$$
\text{minimise} \quad \|\epsilon\|_\infty
$$

subject to:

$$
\arg\max f(x) \ne \arg\max f(x+\epsilon).
$$

This is the “find the smallest successful attack” view.

#### Satisfiability formulation

The slide then reformulates the problem as asking whether there exists a perturbation bounded by some constant $c$:

$$
\exists \epsilon,\quad \|\epsilon\|_\infty \le c
\quad \Rightarrow \quad
\arg\max f(x) \ne \arg\max f(x+\epsilon).
$$

**[UNCLEAR]** The slide writes this with an implication arrow. As printed, this is preserved above. For revision, check the recording if the intended formal reading was “there exists $\epsilon$ such that both $\|\epsilon\|_\infty\le c$ and the class changes hold.”

---

### 2.3 Reachability analysis

#### Intuition

In AI safety, we may want to prove that a model can never produce some unsafe behaviour. The lecture notes give examples:

- a language model never produces an offensive remark;
- a language model never generates detailed step-by-step instructions for committing a crime;
- an autonomous car never swerves into a pedestrian;
- an autonomous car never fails to brake when confronted with an obstacle.

The challenge is that proving absence of a behaviour may require checking the model against all possible inputs. Reachability analysis is introduced as one approach to this.

#### Exact reachable set: informal definition

Reachability analysis is the task of computing all possible outputs of a function $f$. In this course, $f$ is an AI model, such as a neural network.

#### Exact reachable set: formal definition

Given:

- a function $f : \mathbb{R}^m \to \mathbb{R}^n$;
- an input set $\mathcal{X} \subseteq \mathbb{R}^m$;

Define the exact reachable set $\mathcal{Y}$ as:

$$
\mathcal{Y} = \{y : y = f(x) \land x \in \mathcal{X}\}.
$$

This set contains all outputs $y=f(x)$ reachable from inputs $x\in\mathcal{X}$.

If the exact reachable set could be computed for arbitrary AI models, sophisticated AI-safety queries could be solved.

---

### 2.4 Computational challenge of exact reachability

#### Worked example 1: one-dimensional neural network approximation

The lecture notes use a simple neural network $f$ trained to approximate the following function over $x\in[-2,3]$:

$$
g(x) = \frac{1}{8}x^4 - \frac{1}{4}x^3 - \frac{3}{4}x^2 + x + \frac{1}{2}.
$$

The question is how to check whether the neural network’s predictions are close to the ground truth for all inputs in the interval, for example:

$$
|g(x)-f(x)| \le 0.01
\quad \text{for all } x\in[-2,3].
$$

#### Brute-force scanning idea

A potential solution is to scan all possible inputs in $[-2,3]$ and measure $g(x)-f(x)$.

The notes explain why this becomes impractical:

- even if the network is implemented in 32-bit floating point, there are around $2^{31}$ input values to check;
- for the shown network, with two hidden layers of 16 neurons each, doing this on a single CPU takes around two hours;
- this is only for a one-input, one-output network.

For neural networks with $d>1$ inputs, brute force becomes impractical.

#### Formal complexity statement from the notes

Computing the exact output reachable set of a neural network containing linear layers and $k$ ReLU activations is an NP-complete problem.

The notes add that $k$ is the number of individual activations, not the number of activation layers.

#### Activation-pattern intuition

The example network contains 32 ReLU activation functions. Each ReLU can be:

- inactive: $\operatorname{ReLU}(z)=0$;
- active: $\operatorname{ReLU}(z)=z>0$.

Together these ReLUs form complex activation patterns. Enumerating all possible patterns would require scanning:

$$
2^{32}
$$

combinations.

---

### 2.5 Over-approximate reachability

#### Intuition

Because exact reachable sets are hard to compute, the lecture introduces approximate reachable sets $\hat{\mathcal{Y}}$. The aim is not just any approximation, but an over-approximation that safely encloses the exact reachable set.

#### Two requirements

The lecture notes state two requirements for $\hat{\mathcal{Y}}$:

1. $\hat{\mathcal{Y}}$ can be computed in polynomial time.
2. $\hat{\mathcal{Y}}$ completely encloses the exact set:
   

$$
\hat{\mathcal{Y}} \supseteq \mathcal{Y}.
$$

The first requirement gives computational efficiency. The second gives a formal relationship that can still support safety proofs.

#### Safety reasoning with bad behaviours

Let $\mathcal{B}$ be a set of bad or unsafe behaviours.

The key implication is:

$$
\hat{\mathcal{Y}}\cap\mathcal{B}=\emptyset
\quad\Rightarrow\quad
\mathcal{Y}\cap\mathcal{B}=\emptyset.
$$

Interpretation:

- if the over-approximate output set contains no bad behaviour;
- and the exact set is contained inside the over-approximation;
- then the exact output set also contains no bad behaviour.

This allows a proof of safety.

#### Cost of over-approximation

If $\hat{\mathcal{Y}}$ does contain some bad behaviour $y'\in\mathcal{B}$, we cannot conclude that the real model is unsafe. The apparent counterexample may be an artefact of the over-approximation.

The notes express this as:

$$
y'\in\hat{\mathcal{Y}} \centernot\Rightarrow y'\in\mathcal{Y}.
$$

#### Reasoning table

The lecture notes give the following table:

| Premise | Conclusion |
|---|---|
| $\hat{\mathcal{Y}}\cap\mathcal{B}=\emptyset$ | $f$ is safe |
| $\hat{\mathcal{Y}}\cap\mathcal{B}\ne\emptyset$ | $f$ is unknown |

This is a central distinction: over-approximate verification can prove safety when the over-approximation avoids the bad set, but it cannot prove unsafety just because the over-approximation touches the bad set.

#### Connection to abstract interpretation

The lecture notes state that this kind of reasoning procedure usually falls under the term abstract interpretation.

---

### 2.6 Interval analysis

Interval analysis is presented as a concrete over-approximate reachability method. The method propagates intervals through the operations of a neural network.

---

#### 2.6.1 Closed interval

**Intuition.** An interval represents all values between a lower and upper bound.

**Formal definition.** A closed interval $I$ is the set of points between extremes $\ell$ and $u$:

$$
I \equiv \{x : \ell \le x \le u\}.
$$

The notation is:

$$
I \equiv [\ell,u],
\quad x\in[\ell,u].
$$

The lecture mostly uses intervals over real numbers:

$$
I \equiv \{x : x\in\mathbb{R} \land \ell \le x \le u\}.
$$

The notes add that intervals can be defined on any partially ordered set; informally, this means any mathematical structure supporting $\le$.

---

#### 2.6.2 Degenerate interval

**Definition.** An interval $I=[\ell,u]$ is degenerate when:

$$
\ell = u.
$$

A degenerate interval contains only a single element.

---

### 2.7 Interval operators for linear layers

The lecture builds interval analysis by defining how intervals propagate through elementary operators.

#### Interval addition

Given:

$$
z=x+y,
$$

with:

$$
x\in[\ell_x,u_x],
\quad y\in[\ell_y,u_y],
$$

compute:

$$
z\in[\ell_x+\ell_y,\;u_x+u_y].
$$

---

#### Interval negation

Given:

$$
y=-x,
$$

with:

$$
x\in[\ell_x,u_x],
$$

compute:

$$
y\in[-u_x,\;-\ell_x].
$$

Negation flips and swaps the interval bounds.

---

#### Interval multiplication by a constant

Given:

$$
z=cx,
$$

with:

$$
x\in[\ell_x,u_x],
\quad c\in\mathbb{R},
$$

compute:

$$
z\in
\begin{cases}
[c\ell_x,\;cu_x] & \text{if } c\ge 0,\\
[cu_x,\;c\ell_x] & \text{otherwise.}
\end{cases}
$$

The sign of $c$ matters because multiplying by a negative reverses the order of the bounds.

---

### 2.8 Interval operators for activation functions

#### Interval ReLU

Given the ReLU activation:

$$
y=\max(x,0),
$$

with input:

$$
x\in[\ell_x,u_x],
$$

compute:

$$
y\in[\max(\ell_x,0),\;\max(u_x,0)].
$$

The lecture notes observe that this applies the ReLU function independently to the lower and upper bounds.

---

#### Interval monotonic function

**Formal definition.** Given any function:

$$
y=f(x),
$$

with input:

$$
x\in[\ell_x,u_x],
$$

we can compute:

$$
y\in[f(\ell_x),\;f(u_x)]
$$

as long as $f$ is monotonic.

The monotonicity condition is:

$$
\forall a,b,\quad a\le b \Rightarrow f(a)\le f(b).
$$

---

#### Hyperbolic tangent example

Because $\tanh$ is a monotone activation in the lecture notes, interval propagation gives:

$$
x\in[\ell_x,u_x]
\quad\Rightarrow\quad
y\in[\tanh(\ell_x),\;\tanh(u_x)].
$$

The lecture notes leave multidimensional activation functions such as max pooling and softmax as an exercise.

---

### 2.9 Interval set operators

These operators are useful for reasoning about preconditions and postconditions over neural-network behaviour.

#### Interval intersection

Given two intervals:

$$
I=[\ell_I,u_I],
\quad J=[\ell_J,u_J],
$$

compute their intersection $K=I\cap J$ as:

$$
K=[\max(\ell_I,\ell_J),\;\min(u_I,u_J)].
$$

The resulting interval may be empty. If $K=[\ell_K,u_K]$, emptiness appears as:

$$
\ell_K > u_K.
$$

---

#### Interval union

Given:

$$
I=[\ell_I,u_I],
\quad J=[\ell_J,u_J],
$$

compute an over-approximation $K\supseteq I\cup J$ as:

$$
K=[\min(\ell_I,\ell_J),\;\max(u_I,u_J)].
$$

This may introduce over-approximation. The notes say the only time over-approximation is not introduced is when the intervals overlap in some way. An exercise states this as: prove the union of two intervals is over-approximate if and only if the two sets are disjoint.

---

### 2.10 Operator composition

#### Intuition

The lecture uses interval arithmetic on individual operators, then composes those operators to handle more complex computations and whole networks. The key property required is soundness: the interval result must contain all possible real-valued outputs of the composed function.

#### Formal material from the notes

The notes define two real-valued operators/functions and their interval-domain counterparts. They state validity conditions:

$$
\forall x\in I \Rightarrow f(x)\in f(I),
$$

$$
\forall y\in J \Rightarrow g(y)\in g(J).
$$

Then the composition should remain sound: the interval obtained from the composed interval operators contains all possible outputs of the composed real-valued function.

**[UNCLEAR]** The notes appear inconsistent in this subsection. They first describe composing as $f(g(x))$, but later refer to the composed function as $g(f(x))$, and the displayed formula is garbled in text extraction. The safe revision takeaway is: composition of sound interval operators remains sound, but check the exact order of $f$ and $g$ in the recording/source.

---

### 2.11 Whole-network interval propagation

#### Intuition

To propagate intervals through a neural network:

1. Start from an input interval.
2. Apply interval versions of each linear operation.
3. Apply interval versions of activation functions.
4. Compose these layer by layer.
5. The final interval is an over-approximation of the network’s output reachable set.

---

#### Worked example 2: one-hidden-layer ReLU network

The lecture notes give a neural network with one hidden layer of two ReLU neurons.

Input condition:

$$
x_0\in[-1,1].
$$

First linear layer:

$$
\begin{pmatrix}
y_{11}\\
y_{12}
\end{pmatrix}
=
\begin{pmatrix}
3\\
-1
\end{pmatrix}x_0
+
\begin{pmatrix}
-2\\
1
\end{pmatrix}.
$$

Activation layer:

$$
\begin{pmatrix}
x_{11}\\
x_{12}
\end{pmatrix}
=
\begin{pmatrix}
\operatorname{ReLU}(y_{11})\\
\operatorname{ReLU}(y_{12})
\end{pmatrix}.
$$

Output layer:

$$
y_2 =
\begin{pmatrix}1 & 2\end{pmatrix}
\begin{pmatrix}
x_{11}\\
x_{12}
\end{pmatrix}
-1.
$$

The task is to compute an over-approximation of the output reachable set with interval analysis.

---

#### Step 1: propagate through the first linear layer

For $y_{11}$:

$$
y_{11}\in 3[-1,1]-2.
$$

Compute:

$$
3[-1,1]=[-3,3],
$$

so:

$$
y_{11}\in[-3-2,\;3-2]=[-5,1].
$$

For $y_{12}$:

$$
y_{12}\in -1[-1,1]+1.
$$

Compute:

$$
-1[-1,1]=[-1,1],
$$

so:

$$
y_{12}\in[-1+1,\;1+1]=[0,2].
$$

---

#### Step 2: propagate through ReLU activations

For $x_{11}$:

$$
x_{11}\in[\operatorname{ReLU}(-5),\;\operatorname{ReLU}(1)]=[0,1].
$$

For $x_{12}$:

$$
x_{12}\in[\operatorname{ReLU}(0),\;\operatorname{ReLU}(2)]=[0,2].
$$

---

#### Step 3: propagate through the output layer

The output equation is:

$$
y_2 = 1x_{11} + 2x_{12} - 1.
$$

Using the intervals:

$$
y_2\in 1[0,1] + 2[0,2] -1.
$$

Compute:

$$
1[0,1]=[0,1],
$$

$$
2[0,2]=[0,4].
$$

Then:

$$
y_2\in[0+0-1,\;1+4-1]=[-1,4].
$$

#### Interval-analysis answer

The over-approximated output reachable set is:

$$
y_2\in[-1,4].
$$

The notes then compare this with the exact output set visible from plotting the one-input/one-output network:

$$
y_2\in[-0.33,3].
$$

So interval analysis gives a slightly larger set than the exact reachable set.

---

### 2.12 Computational efficiency versus over-approximation

#### Efficiency statement

The lecture notes state that interval analysis is inherently efficient because it introduces a linear overhead relative to ordinary inference.

**Formal statement from the notes.** Given a neural network with $N$ elementary operations, such as addition, multiplication, or ReLU, approximating its output reachable set with interval analysis requires:

$$
2N
$$

operations.

Reason: each operation computes both a lower bound and an upper bound.

#### Cost

Interval analysis does not produce the exact output reachable set. The over-approximation is the cost paid for efficiency. In the worked example, the over-approximation was minimal, but the notes explicitly ask whether this should be expected in all cases.

---

### 2.13 Exercises listed in the lecture notes

These are useful revision targets because they identify the exact properties the lecturer expects students to check.

#### Exercise 1: interval addition soundness

Show that interval addition is correct:

$$
\{z : z=x+y \land x\in[\ell_x,u_x]\land y\in[\ell_y,u_y]\}
\subseteq
[\ell_x+\ell_y,u_x+u_y].
$$

Hint from notes: a proof by contradiction that posits some $z\notin[\ell_x+\ell_y,u_x+u_y]$ should suffice.

#### Exercise 2: interval addition minimality

Show that the interval arithmetic in Definition 5 is minimal:

$$
\{z : z=x+y \land x\in[\ell_x,u_x]\land y\in[\ell_y,u_y]\}
\supseteq
[\ell_x+\ell_y,u_x+u_y].
$$

Hint from notes: use contradiction by positing a spurious value of $z\in[\ell_x+\ell_y,u_x+u_y]$.

#### Exercise 3: other interval operators

Repeat the same proof style for the other interval operators. The notes suggest decomposing multiplication by a negative constant into multiplication by $|c|$ followed by negation.

#### Exercise 4: interval monotonic function

Prove the theorem in Definition 9: monotonic functions can be applied to interval bounds.

#### Exercise 5: other interval activations

Compute output intervals of common multidimensional activation functions, such as max pooling and softmax.

#### Exercise 6: interval union

Prove that the union of two intervals is over-approximate if and only if the two sets are disjoint.

#### Exercise 7: interval composition

Prove that the composition of interval operators is sound.

---

### 2.14 Exam flags and warnings for Lecture 2.2

**[EXAM FLAG / WARNING]** Certified inference is described as crucial for safety-critical applications.

**[EXAM FLAG / WARNING]** Over-approximate reachability can prove safety only when $\hat{\mathcal{Y}}\cap\mathcal{B}=\emptyset$. If $\hat{\mathcal{Y}}\cap\mathcal{B}\ne\emptyset$, the conclusion is unknown, not unsafe.

**[EXAM FLAG / WARNING]** Exact reachability for neural networks with linear layers and $k$ ReLU activations is NP-complete.

**[EXAM FLAG / WARNING]** Interval analysis is efficient, with $2N$ operations for $N$ elementary network operations, but this efficiency comes from over-approximation.

---

## 3. Lecture 2.3 - Neural Network Verification

### 3.1 Where this lecture fits

This lecture applies the earlier concepts to neural-network verification tools. It contrasts falsification and verification, then introduces the practical file formats and tools used in the coding tutorial:

- ONNX for neural-network models;
- VNN-LIB for safety specifications;
- Marabou as a verifier used in the second half of the tutorial.

---

### 3.2 Falsification of adversarial attacks

#### Intuition

Falsification means trying to find an attack. It is a testing-style approach.

The slide describes the goal as:

- find an attack;
- use heuristics;
- apply FGSM;
- establish the existence of a perturbed input that changes the model’s prediction.

#### Formal property on the slide

The falsification property is:

$$
\exists x',\quad \|x-x'\|_\infty \le c
\quad \Rightarrow \quad
\arg\max f(x) \ne \arg\max f(x').
$$

**[UNCLEAR]** As in Lecture 2.2, the slide writes this with an implication arrow. Check the recording/source for whether the intended formal reading is existential satisfaction of both the distance bound and the changed prediction.

#### Output states

The falsifier/testing diagram has two possible outcomes:

- Unsafe;
- Unknown.

If an attack is found, the system is unsafe with respect to the specification. If an attack is not found, the status is unknown.

**[EXAM FLAG / WARNING]** The slide explicitly warns: if we do not find any attacks, we cannot conclude anything.

---

### 3.3 Verification of adversarial robustness

#### Intuition

Verification means trying to prove safety. It uses formal methods and reachability computation rather than heuristic attack search.

The slide describes the goal as:

- prove safety;
- use formal methods;
- compute reachability;
- prove that all allowed perturbations preserve the prediction.

#### Formal property on the slide

The verification property is:

$$
\forall x',\quad \|x-x'\|_\infty \le c
\quad \Rightarrow \quad
\arg\max f(x) = \arg\max f(x').
$$

This states that every perturbed input within the $\ell_\infty$-radius $c$ has the same predicted class as the original input.

#### Output states

The incomplete-verifier diagram has two possible outcomes:

- Safe;
- Unknown.

Because the verifier is incomplete, failure to prove safety does not necessarily produce a true counterexample.

**[EXAM FLAG / WARNING]** The slide explicitly warns that methods like interval analysis are incomplete.

**[EXAM FLAG / WARNING]** The slide explicitly warns that a “counterexample” may be due to over-approximation only.

---

### 3.4 Practical verification tools

#### Neural-network format: ONNX

The slide says the neural network is provided in ONNX format:

- ONNX = Open Neural Network eXchange.

#### Safety-specification format: VNN-LIB

The safety specification is provided in VNN-LIB format.

The slide points to VNN-COMP for more information.

#### Verifier

The verification diagram shows an incomplete verifier receiving:

- a neural network;
- a safety specification.

It outputs:

- Safe;
- Unknown.

---

### 3.5 VNN-LIB format

The VNN-LIB slide breaks the specification into three parts:

1. variable declarations;
2. input preconditions;
3. output postconditions.

#### Variable declarations

Examples shown on the slide:

```lisp
(declare-const X_0 Real)
(declare-const Y_0 Real)
```

These declare input and output variables as real-valued constants.

#### Input preconditions

Examples shown on the slide:

```lisp
(assert (<= X_2 1.0))
(assert (>= X_2 0.0))
```

These constrain input variables. In this example, $X_2$ is constrained to lie between 0 and 1.

#### Output postconditions

Example shown on the slide:

```lisp
(assert (<= Y_1 Y_4))
```

This constrains output variables.

**[EXAM FLAG / WARNING]** The slide warns that the postcondition is negated. It states this as:

$$
\exists x' \ldots \Rightarrow f(x')\in \text{UnsafeSet}.
$$

The practical implication is that VNN-LIB specifications may encode the unsafe condition to be ruled out, not the safe condition directly.

---

### 3.6 Coding tutorial structure

#### First half

The first half covers:

- importing ONNX files;
- running FGSM;
- finding attacks.

The safety specification shown is:

$$
\exists x\in\left[-\frac{1}{2},\frac{1}{2}\right]
\Rightarrow f(x)<0.
$$

**[UNCLEAR]** The slide writes the specification using $\exists x\in[-1/2,1/2]\Rightarrow f(x)<0$. Check the recording/source for the intended syntax; it may mean existence of an input in that interval satisfying $f(x)<0$.

#### Second half

The second half covers:

- writing VNN-LIB files;
- running Marabou.

The safety specification shown is:

$$
\forall x\in[0,1]\Rightarrow f(x)\ge 0.
$$

This is a universal safety property over the input interval $[0,1]$.

---

### 3.7 Connections to next material

The final slide says the next topics are:

- adversarial training;
- Lipschitz-bounded neural networks;
- randomised smoothing.

These are presented as follow-on material after attacks, reachability, and verification.

---

## 4. Cross-lecture comparison: falsification vs verification

| Aspect | Falsification | Verification |
|---|---|---|
| Goal | Find an attack | Prove safety |
| Method type | Heuristic | Formal methods |
| Example method | FGSM | Reachability / interval analysis |
| Analogy from slides | Automated software testing | Automated theorem proving |
| Quantifier pattern | Existence of an attack | Universal safety over all perturbations |
| Typical output | Unsafe or Unknown | Safe or Unknown |
| Main warning | Not finding attacks proves nothing | Counterexamples may be over-approximation artefacts |

---

## 5. Core formulas to memorise/reconstruct

### Empirical risk objective as printed

$$
f^* = \arg\max_f \mathbb{E}\{\mathcal{L}(f(x), y)\}
\approx
\arg\max_f \frac{1}{N}\sum_{(x,y)\in \mathcal{D}} \mathcal{L}(f(x), y).
$$

**[UNCLEAR]** Printed as $\arg\max$ despite being called minimisation.

### Linear adversarial decomposition

$$
y' = w^Tx' = w^Tx + w^T(x'-x) = y + w^T\eta.
$$

**[UNCLEAR]** Sign of $\eta$ is inconsistent in the notes.

### Dimensionality scaling

$$
\|\eta_i\|=O(1/d)
$$

when weights are uniformly distributed and $w^T\eta$ is kept constant.

### FGSM

$$
x' = x + \epsilon \cdot \operatorname{sign}\left(\nabla_x\mathcal{L}(f(x),y)\right).
$$

### Adversarial optimisation

$$
\text{minimise}\quad \|\epsilon\|_\infty
$$

subject to:

$$
\arg\max f(x)\ne\arg\max f(x+\epsilon).
$$

### Exact reachable set

$$
\mathcal{Y}=\{y:y=f(x)\land x\in\mathcal{X}\}.
$$

### Over-approximate safety implication

$$
\hat{\mathcal{Y}}\cap\mathcal{B}=\emptyset
\Rightarrow
\mathcal{Y}\cap\mathcal{B}=\emptyset.
$$

### Interval addition

$$
x\in[\ell_x,u_x],\quad y\in[\ell_y,u_y]
\Rightarrow
x+y\in[\ell_x+\ell_y,u_x+u_y].
$$

### Interval negation

$$
x\in[\ell_x,u_x]
\Rightarrow
-x\in[-u_x,-\ell_x].
$$

### Interval multiplication by constant

$$
cx\in
\begin{cases}
[c\ell_x,cu_x] & c\ge 0,\\
[cu_x,c\ell_x] & c<0.
\end{cases}
$$

### Interval ReLU

$$
x\in[\ell_x,u_x]
\Rightarrow
\operatorname{ReLU}(x)\in[\max(\ell_x,0),\max(u_x,0)].
$$

### Monotonic function interval

$$
x\in[\ell_x,u_x]
\Rightarrow
f(x)\in[f(\ell_x),f(u_x)]
$$

when:

$$
a\le b\Rightarrow f(a)\le f(b).
$$

### Interval intersection

$$
[\ell_I,u_I]\cap[\ell_J,u_J]
=
[\max(\ell_I,\ell_J),\min(u_I,u_J)].
$$

### Interval union over-approximation

$$
K\supseteq I\cup J,
\quad
K=[\min(\ell_I,\ell_J),\max(u_I,u_J)].
$$

### Interval-analysis computational cost

$$
N\text{ elementary operations}\Rightarrow 2N\text{ interval operations}.
$$

### Falsification property as printed

$$
\exists x',\quad \|x-x'\|_\infty\le c
\Rightarrow
\arg\max f(x)\ne\arg\max f(x').
$$

### Verification property

$$
\forall x',\quad \|x-x'\|_\infty\le c
\Rightarrow
\arg\max f(x)=\arg\max f(x').
$$

---

## 6. Unclear sections to re-listen to

1. **Empirical risk objective sign.** The notes call the objective “empirical risk minimisation” but print $\arg\max$ of the loss.
2. **Perturbation sign in the steganography derivation.** The derivation uses $w^T(x'-x)=w^T\eta$, while the notes define $\eta=x-x'$.
3. **Satisfiability formula in the reachability slides.** The slide uses implication in the existential attack query. Re-listen for whether the lecturer intended conjunction of the bound and misclassification condition.
4. **Interval operator composition.** The notes appear inconsistent between $f(g(x))$ and $g(f(x))$, and the displayed formula is garbled in text extraction.
5. **Coding tutorial first-half specification.** The slide writes $\exists x\in[-1/2,1/2]\Rightarrow f(x)<0$. Re-listen for the intended syntax and whether this is an unsafe-set query.
6. **VNN-LIB negated postcondition.** The slide warns that the postcondition is negated; this is important enough to revisit during practical revision.
