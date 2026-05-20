---
subject: COMP64802
chapter: 9
title: "Lecture 9: Boltzmann Machines"
language: en
---

# COMP 64802 Lecture 9 Study Notes: Boltzmann Machines and Restricted Boltzmann Machines

**Course:** COMP 64802 — Advanced Topics in Machine Learning  
**Lecturer:** Dr Omar Rivasplata, University of Manchester  
**Lecture:** Lecture 9 — Wed 29/4/2026  
**Source status:** Slides were provided. No transcript was provided, so these notes are based on the slides only. Places where the missing transcript would likely add detail are marked **[UNCLEAR]**.

---

## Topic and scope

This lecture introduces **Boltzmann Machines** and **Restricted Boltzmann Machines** as stochastic, undirected, energy-based generative neural network models.

It fits into the broader course as an introduction to **energy-based probabilistic models**, including their probability distributions, partition functions, training intuition, limitations, and conditional probability calculations for RBMs.

---

# 1. Lecture roadmap and intended learning outcomes

## 1.1 Topics covered

The lecture covers:

1. **Boltzmann Machines**
2. **A bit about energy-based models**
3. **Restricted Boltzmann Machines**

The slide deck splits the lecture approximately as:

- **25 minutes** on Boltzmann Machines
- **35 minutes** on Restricted Boltzmann Machines

## 1.2 Intended Learning Outcomes

By the end of the lecture, students are expected to:

1. Gain sufficient understanding of the high-level description of the energy-based models called **Boltzmann Machines**.
2. Gain sufficient familiarity with the formulation details of the probability model corresponding to Boltzmann Machines.
3. Gain some familiarity with the limitations/disadvantages of Boltzmann Machines, motivating Restricted Boltzmann Machines.
4. Gain working familiarity with the formulation details of the probability model corresponding to Restricted Boltzmann Machines.
5. Gain working familiarity with some probability calculations, including conditional probabilities, for Restricted Boltzmann Machines.

**[EXAM FLAG]** The final ILO explicitly mentions probability calculations and conditional probabilities for RBMs. The pen-and-paper exercise at the end asks students to derive

$$
p(h_i = 1 \mid v)
=
\sigma\left(b_i + \sum_j v_j W_{ji}\right).
$$

This is very likely to be revision-important.

---

# 2. Boltzmann Machines

## 2.1 Formal-ish description

A **Boltzmann Machine** is described as:

> A network of symmetrically connected, neuron-like units that make stochastic decisions about whether to be on or off.

The slides also say that Boltzmann Machines have a simple learning algorithm that allows them to discover interesting features in datasets composed of **binary vectors**.

## 2.2 Intuition

A Boltzmann Machine is a neural network model where:

- units are binary, usually taking values $0$ or $1$;
- each unit can be interpreted as being “off” or “on”;
- the network has symmetric connections;
- each possible configuration of the units is assigned an **energy**;
- lower-energy configurations are more probable;
- higher-energy configurations are less probable;
- learning adjusts the parameters so that training-data configurations become low-energy states.

The lecture describes Boltzmann Machines as:

$$
\textbf{stochastic, undirected, energy-based, generative neural networks.}
$$

## 2.3 Key properties

### Stochastic

The neurons have random states.

Each unit can be:

$$
0 \quad \text{or} \quad 1.
$$

These are usually interpreted as:

$$
\text{off} \quad \text{or} \quad \text{on}.
$$

### Undirected

Connections are symmetric, so the graph representation is undirected.

There are no directional arrows; a connection between two units represents a mutual interaction.

### Energy-based

The model uses an **energy function** to define probabilities over states.

The rule is:

- low energy means high probability;
- high energy means low probability.

### Generative

The model can generate new data by sampling from the probability distribution it has learned.

---

# 3. Connection to Hopfield Networks

The slides state that:

- **Hopfield Networks** are a precursor model;
- Boltzmann Machines can be considered generalisations of Hopfield Networks.

## 3.1 Connection

Both Hopfield Networks and Boltzmann Machines are energy-based neural models.

Boltzmann Machines generalise this idea by using **stochastic binary units**, whereas Hopfield Networks are presented here as the precursor model.

**[CONNECTION]** This lecture links Boltzmann Machines to earlier neural network energy models, specifically Hopfield Networks.

---

# 4. Boltzmann Machine architecture

## 4.1 Visible and hidden variables

The slide example has two types of nodes.

### Visible variables

$$
v = (v_1, v_2, v_3, v_4).
$$

Visible units represent the observed part of the data.

### Hidden variables

$$
h = (h_1, h_2, h_3).
$$

Hidden units are latent variables that help model structure in the data.

The slides state:

$$
h_i \text{ and } v_j \text{ are binary, typically taking values } 0/1.
$$

**[EXAM FLAG]** The slides explicitly note that the $h_i$'s and $v_j$'s are binary, usually with possible values $0/1$. This matters directly in the conditional probability derivation later, where $h_i$ is normalised over only two possible values.

## 4.2 Graph structure

The Boltzmann Machine example diagram shows:

- visible nodes $v_1, v_2, v_3, v_4$;
- hidden nodes $h_1, h_2, h_3$;
- many undirected connections among the nodes.

Unlike Restricted Boltzmann Machines, ordinary Boltzmann Machines may include more general connectivity.

---

# 5. Boltzmann Machine probability model

## 5.1 Joint probability of visible and hidden variables

The Boltzmann Machine probability model is:

$$
p(v,h)
=
\frac{1}{Z}
\exp\left(-\frac{E(v,h)}{T}\right).
$$

Where:

- $v$ is the visible vector;
- $h$ is the hidden vector;
- $E(v,h)$ is the energy of the state $(v,h)$;
- $T$ is a temperature parameter;
- $Z$ is the partition function, also called the normalising constant.

## 5.2 Interpretation

Each possible state is a possible setting of:

$$
(v,h).
$$

The slides emphasise that all possible states have positive probability:

$$
p(v,h) > 0.
$$

This follows from the exponential form, because exponentials are positive, and $Z$ normalises the distribution.

## 5.3 Energy-probability relationship

The probability of a state decreases as its energy increases.

High energy:

$$
E(v,h) \text{ high}
\quad \Rightarrow \quad
p(v,h) \text{ low}.
$$

Low energy:

$$
E(v,h) \text{ low}
\quad \Rightarrow \quad
p(v,h) \text{ high}.
$$

The slides state that this probability model is known as the:

$$
\textbf{Boltzmann distribution}
$$

or

$$
\textbf{Gibbs distribution}.
$$

---

# 6. Statistical mechanics background

The lecture gives a short background from statistical mechanics.

## 6.1 Physical system with many possible states

Consider a physical system with many possible states:

$$
s_1, s_2, s_3, \dots
$$

The system may have many degrees of freedom.

The probability of state $s_i$ is:

$$
p(s_i)
=
\frac{1}{Z}
\exp\left(-\frac{E(s_i)}{\kappa_B T}\right).
$$

Where:

- $E(s_i)$ is the energy of state $s_i$;
- $T$ is a temperature parameter;
- $\kappa_B$ is the Boltzmann constant;
- $Z$ is a normalising factor, also called the partition function.

The slide gives:

$$
\kappa_B = 1.38 \times 10^{-23} \text{ J/K}.
$$

## 6.2 Probability constraints

The probabilities must satisfy:

$$
p(s_i) \geq 0
$$

and

$$
\sum_i p(s_i) = 1.
$$

## 6.3 Partition function in statistical mechanics

The partition function is:

$$
Z
=
\sum_i
\exp\left(-\frac{E(s_i)}{\kappa_B T}\right).
$$

Its role is to normalise the probabilities so that they sum to $1$.

## 6.4 Tractability issue

The slides highlight a major question:

$$
\text{tractability / complexity of computing } Z.
$$

This becomes important because partition functions can require summing over an extremely large number of possible configurations.

**[CONNECTION]** The Boltzmann Machine probability model borrows its form from statistical mechanics, replacing physical states $s_i$ with machine configurations such as $(v,h)$.

---

# 7. Training Boltzmann Machines

## 7.1 Training objective

During training, the model adjusts its parameters, especially weights, to:

$$
\text{maximise the probability of the input data.}
$$

Equivalently, it adjusts parameters to:

$$
\text{minimise the energy of the input data.}
$$

## 7.2 Energy landscape intuition

The training slide shows an energy landscape with:

- energy on the vertical axis;
- state on the horizontal axis;
- target patterns being pushed downward to lower energy;
- other patterns being pushed upward to higher energy.

The visual labels state:

- “Minimize energy of target patterns”
- “Maximize energy of all other patterns”

So the training intuition is:

- data patterns should become low-energy states;
- non-data patterns, or less likely patterns, should become high-energy states.

## 7.3 Clamping

During training, the visible neurons are **clamped**.

Clamping means:

$$
\text{the visible units' states are fixed to specific input data.}
$$

The hidden neurons are not clamped. They operate freely.

## 7.4 Role of hidden units

The hidden units help find and learn distributed representations of the input data.

The slides state that hidden units explain underlying constraints in the input data by capturing higher-order correlations between the clamping vectors.

## 7.5 Type of learning

Boltzmann Machine training is described as:

$$
\textbf{unsupervised learning.}
$$

The goal is modelling a joint distribution between visible and hidden units:

$$
p(v,h).
$$

---

# 8. What Boltzmann Machines can be used for

The lecture lists several uses.

## 8.1 Sampling

Boltzmann Machines can generate new data based on patterns learned during training.

Examples given:

- generating new images;
- generating sound.

## 8.2 Feature learning

Boltzmann Machines can reduce high-dimensional data, such as images or text, into lower-dimensional representations.

These representations are easier to analyse and can be used as a preprocessing step for downstream tasks.

## 8.3 Anomaly detection

The model learns the energy or probability of normal data points.

Then:

- normal data should have relatively low energy;
- rare or unexpected patterns should have high energy.

So data points with high energy can be flagged as anomalies.

## 8.4 Pattern completion

If a vector containing part of the information is clamped onto a subset of visible units, the network performs completion of the pattern on the remaining visible units.

## 8.5 Image reconstruction

Image reconstruction is described as similar to pattern completion.

---

# 9. Limitations of standard Boltzmann Machines

The lecture lists several major disadvantages.

## 9.1 Extreme computational cost

Standard Boltzmann Machines require sampling to reach equilibrium.

The slides state that this can take thousands of iterations.

## 9.2 Slow training

The time required for training grows exponentially with:

- network size;
- strength of the connections.

This makes standard Boltzmann Machines impractical for large-scale datasets.

## 9.3 Intractable inference

Exact inference in Boltzmann Machines is described as notoriously intractable.

The slide gives the example that it is difficult to compute the gradients needed for learning.

## 9.4 Difficulty scaling up

Boltzmann Machines may work for small, trivial problems, but the slides state that they stop learning effectively when scaled to complex, real-world tasks.

## 9.5 Sensitivity to hyperparameters

Performance is highly sensitive to:

- learning rate;
- weight initialisation;
- number of hidden units.

## 9.6 Motivation for Restricted Boltzmann Machines

These limitations motivate the use of **Restricted Boltzmann Machines**, which impose architectural restrictions that make some probability calculations easier.

---

# 10. Restricted Boltzmann Machines

## 10.1 Formal-ish description

A **Restricted Boltzmann Machine** is described as:

> A network of stochastic units with undirected interactions between pairs of visible and hidden units.

The model was popularised as a building block of deep learning architectures and has continued to play a role in applied and theoretical machine learning.

## 10.2 Another description

The slide also describes an RBM as:

- stochastic;
- generative;
- unsupervised;
- a neural network;
- a model that learns probability distributions over inputs;
- a model that uncovers hidden data structures.

RBMs consist of:

- a visible layer;
- a hidden layer;
- no connections within a layer.

The absence of within-layer connections allows more efficient training, including via contrastive divergence.

**[UNCLEAR]** The slides mention contrastive divergence but do not define or derive it. Check the lecture recording/transcript if available.

## 10.3 Applications listed

The slides say RBMs are heavily used for:

- collaborative filtering;
- dimensionality reduction;
- feature learning.

---

# 11. RBM architecture

## 11.1 Visible and hidden variables

The RBM example has the following visible variables:

$$
v = (v_1, v_2, v_3).
$$

It has the following hidden variables:

$$
h = (h_1, h_2, h_3, h_4).
$$

## 11.2 Weights

The weights are denoted:

$$
w_{j,i} = w(v_j,h_i).
$$

This is the weight connecting visible unit $v_j$ to hidden unit $h_i$.

## 11.3 Restricted connectivity

The defining architectural restriction is:

- every hidden node $h_i$ is connected to every visible node $v_j$;
- there are no connections between hidden nodes;
- there are no connections between visible nodes.

Formally, visible-hidden connections exist:

$$
h_i \leftrightarrow v_j.
$$

But hidden-hidden connections do not exist:

$$
h_i \not\leftrightarrow h_k.
$$

And visible-visible connections do not exist:

$$
v_j \not\leftrightarrow v_\ell.
$$

**[EXAM FLAG]** The slide explicitly marks this as **Important**:

- every hidden node is connected to every visible node;
- no hidden-hidden connections;
- no visible-visible connections.

This is the key structural difference between a general Boltzmann Machine and a Restricted Boltzmann Machine.

---

# 12. RBM probability model

## 12.1 Joint probability model

The RBM uses the same Boltzmann/Gibbs-style probability form:

$$
p(v,h)
=
\frac{1}{Z}
\exp\left(-\frac{E(v,h)}{T}\right).
$$

## 12.2 Energy function

For an RBM, the energy function is:

$$
E(v,h)
=
-a^\top v
-
b^\top h
-
v^\top W h.
$$

Where:

- $v = (v_1,\dots,v_N)$ is the visible vector;
- $h = (h_1,\dots,h_M)$ is the hidden vector;
- $W = (w_{j,i}) \in \mathbb{R}^{N \times M}$ is the weight matrix;
- $a = (a_1,\dots,a_N) \in \mathbb{R}^N$ are visible-unit coefficients;
- $b = (b_1,\dots,b_M) \in \mathbb{R}^M$ are hidden-unit coefficients.

## 12.3 Expanded energy function

The expanded form is:

$$
E(v,h)
=
-
\sum_{j=1}^{N} a_j v_j
-
\sum_{i=1}^{M} b_i h_i
-
\sum_{i=1}^{M}
\sum_{j=1}^{N}
v_j w_{j,i} h_i.
$$

This contains three parts.

### Visible coefficient contribution

$$
-
\sum_{j=1}^{N} a_j v_j.
$$

### Hidden coefficient contribution

$$
-
\sum_{i=1}^{M} b_i h_i.
$$

### Visible-hidden interaction contribution

$$
-
\sum_{i=1}^{M}
\sum_{j=1}^{N}
v_j w_{j,i} h_i.
$$

---

# 13. RBM partition function

## 13.1 General form

The probability model is:

$$
p(v,h)
=
\frac{1}{Z}
\exp\left(-\frac{E(v,h)}{T}\right).
$$

The partition function normalises over all possible configurations.

The slide writes:

$$
Z =
\sum_{i,j}
\exp\left(-\frac{E(v,h)}{T}\right).
$$

## 13.2 More precise interpretation

Because $v$ and $h$ are binary-valued vectors, the summation is over all possible configurations of visible and hidden units.

More explicitly:

$$
Z
=
\sum_v
\sum_h
\exp\left(-\frac{E(v,h)}{T}\right).
$$

If there are:

- $N$ visible units;
- $M$ hidden units;
- all units are binary;

then there are:

$$
2^{N+M}
$$

possible configurations.

Therefore, direct computation of $Z$ involves summing over:

$$
2^{N+M}
$$

terms.

## 13.3 Ignoring first-degree terms

The slide gives the interaction-only part as:

$$
\sum_{i,j}
\exp
\left(
-
\frac{1}{T}
\sum_{i=1}^{M}
\sum_{j=1}^{N}
v_j w_{j,i} h_i
\right).
$$

It labels this as the right-hand side “ignoring 1st degree terms”.

The omitted first-degree terms are the coefficient terms:

$$
-a^\top v
$$

and

$$
-b^\top h.
$$

**[UNCLEAR]** The slide notation $\sum_{i,j}$ for the partition function is potentially confusing because $i,j$ are also used as hidden/visible indices. The intended meaning is summation over all possible configurations of $v$ and $h$, not merely over one pair of indices.

---

# 14. RBM conditional probabilities

A major advantage of RBMs is that the restricted graph structure leads to factorised conditional distributions.

## 14.1 Hidden variables conditioned on visible variables

The slide states:

$$
p(h \mid v)
=
\prod_i p(h_i \mid v).
$$

This means that, conditional on the visible vector $v$, the hidden units are independent.

The slide says this follows from the graph separation properties.

**[UNCLEAR]** The slides do not show the full graph-separation argument. Check the lecture recording/transcript if available.

## 14.2 Single hidden variable conditional

For one hidden variable:

$$
p(h_i = 1 \mid v)
=
\frac{1}
{
1 +
\exp
\left(
-b_i
-
\sum_j v_j W_{ji}
\right)
}.
$$

Equivalently, using the sigmoid function:

$$
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right).
$$

## 14.3 Visible variables conditioned on hidden variables

Similarly, for the visible variables:

$$
p(v \mid h)
=
\prod_j p(v_j \mid h).
$$

This means that, conditional on the hidden vector $h$, the visible units are independent.

Again, the slide says this follows from the graph separation properties.

## 14.4 Single visible variable conditional

For one visible variable:

$$
p(v_j = 1 \mid h)
=
\frac{1}
{
1 +
\exp
\left(
-a_j
-
\sum_i W_{ji}h_i
\right)
}.
$$

Equivalently:

$$
p(v_j = 1 \mid h)
=
\sigma
\left(
a_j
+
\sum_i W_{ji} h_i
\right).
$$

**[EXAM FLAG]** These conditional probability formulas are central to the stated ILO about RBM probability calculations.

---

# 15. Sigmoid / logistic function

## 15.1 Definition

The function:

$$
x
\mapsto
\frac{1}{1+\exp(-x)}
$$

is called the **logistic function**.

It is a sigmoid function and is often denoted:

$$
\sigma(x).
$$

So:

$$
\sigma(x)
=
\frac{1}{1+\exp(-x)}.
$$

## 15.2 RBM conditionals using sigmoid notation

Using this function:

$$
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right)
$$

and

$$
p(v_j = 1 \mid h)
=
\sigma
\left(
a_j
+
\sum_i W_{ji} h_i
\right).
$$

---

# 16. Pen-and-paper exercise

## 16.1 Exercise statement

Show that for each $i$:

$$
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right).
$$

## 16.2 Hint from the slide

For computing:

$$
p(h_i \mid v),
$$

any quantity that does not depend on $h_i$ can be considered part of the normalisation constant.

A general strategy is:

1. Work out $p(h_i \mid v)$ up to the normalisation constant.
2. Drop terms that do not depend on $h_i$.
3. Normalise afterwards.
4. Since $h_i$ is binary, normalise over:

$$
h_i = 0
\quad \text{and} \quad
h_i = 1.
$$

**[EXAM FLAG]** This derivation is explicitly given as a pen-and-paper exercise with a solution. It is high-value for revision.

---

# 17. Pen-and-paper exercise solution

## 17.1 Absorbing the temperature parameter

The slide says that if the temperature parameter $T$ is absorbed into $a,b,W$, then essentially:

$$
p(h \mid v)
=
\frac{p(h,v)}{p(v)}
\propto
p(h,v).
$$

Since:

$$
p(h,v)
\propto
\exp
\left(
a^\top v
+
b^\top h
+
v^\top W h
\right),
$$

we have:

$$
p(h \mid v)
\propto
\exp
\left(
a^\top v
+
b^\top h
+
v^\top W h
\right).
$$

## 17.2 Expanded exponent

Expanding the exponent:

$$
p(h \mid v)
\propto
\exp
\left(
\sum_j a_j v_j
+
\sum_i b_i h_i
+
\sum_i
\sum_j
v_j W_{ji} h_i
\right).
$$

## 17.3 Focus on one hidden variable

We are interested in:

$$
p(h_i \mid v)
$$

for a fixed $i$.

Terms that do not depend on $h_i$ can be dropped into the proportionality constant.

The remaining terms are:

$$
b_i h_i
+
\sum_j v_j W_{ji} h_i.
$$

Therefore:

$$
p(h_i \mid v)
\propto
\exp
\left(
b_i h_i
+
\sum_j v_j W_{ji} h_i
\right).
$$

Factor out $h_i$:

$$
p(h_i \mid v)
\propto
\exp
\left(
h_i
\left[
b_i
+
\sum_j v_j W_{ji}
\right]
\right).
$$

Let:

$$
x
=
b_i
+
\sum_j v_j W_{ji}.
$$

Then:

$$
p(h_i \mid v)
\propto
\exp(h_i x).
$$

## 17.4 Use binary values of $h_i$

Because:

$$
h_i \in \{0,1\},
$$

there are only two cases.

### Case 1: $h_i = 0$

$$
\exp(h_i x)
=
\exp(0 \cdot x)
=
\exp(0)
=
1.
$$

### Case 2: $h_i = 1$

$$
\exp(h_i x)
=
\exp(1 \cdot x)
=
\exp(x).
$$

## 17.5 Normalise

The total unnormalised mass is:

$$
1 + \exp(x).
$$

Therefore:

$$
p(h_i = 1 \mid v)
=
\frac{\exp(x)}{1+\exp(x)}.
$$

Now rewrite:

$$
\frac{\exp(x)}{1+\exp(x)}
=
\frac{1}{1+\exp(-x)}.
$$

So:

$$
p(h_i = 1 \mid v)
=
\frac{1}{1+\exp(-x)}.
$$

Substitute back:

$$
x
=
b_i
+
\sum_j v_j W_{ji}.
$$

Hence:

$$
p(h_i = 1 \mid v)
=
\frac{1}
{
1+
\exp
\left(
-b_i
-
\sum_j v_j W_{ji}
\right)
}.
$$

Using sigmoid notation:

$$
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right).
$$

This is the required result.

---

# 18. Key concepts

## 18.1 Boltzmann Machine

### Intuition

A Boltzmann Machine is a stochastic neural network that assigns energies to binary configurations of visible and hidden units. It learns by making data configurations low-energy and therefore high-probability.

### Formal description from the slides

A Boltzmann Machine is a network of symmetrically connected, neuron-like units that make stochastic decisions about whether to be on or off.

Its probability model is:

$$
p(v,h)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(v,h)}{T}
\right).
$$

## 18.2 Energy-based model

### Intuition

An energy-based model defines probabilities using an energy function. Low-energy states are likely; high-energy states are unlikely.

### Formalism from the slides

For Boltzmann Machines:

$$
p(v,h)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(v,h)}{T}
\right).
$$

The same general structure appears in statistical mechanics:

$$
p(s_i)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(s_i)}{\kappa_B T}
\right).
$$

## 18.3 Partition function

### Intuition

The partition function is the normalising constant that makes all probabilities sum to $1$.

### Formal definition

For a statistical mechanics system:

$$
Z
=
\sum_i
\exp
\left(
-\frac{E(s_i)}{\kappa_B T}
\right).
$$

For an RBM:

$$
Z
=
\sum_v
\sum_h
\exp
\left(
-\frac{E(v,h)}{T}
\right).
$$

For $N$ visible and $M$ hidden binary units, this involves:

$$
2^{N+M}
$$

configurations.

## 18.4 Visible units

### Intuition

Visible units represent observed data.

### Formal notation

$$
v = (v_1,\dots,v_N).
$$

The units are binary:

$$
v_j \in \{0,1\}.
$$

## 18.5 Hidden units

### Intuition

Hidden units are latent variables that help the model capture structure, constraints, and higher-order correlations in the data.

### Formal notation

$$
h = (h_1,\dots,h_M).
$$

The units are binary:

$$
h_i \in \{0,1\}.
$$

## 18.6 Clamping

### Intuition

Clamping means fixing visible units to observed data during training.

### Description from the slides

During training, visible neurons are clamped, meaning their states are fixed to specific input data. Hidden neurons operate freely.

## 18.7 Restricted Boltzmann Machine

### Intuition

An RBM is a Boltzmann Machine with a restricted bipartite structure: visible units connect to hidden units, but units within the same layer do not connect.

### Formal description from the slides

An RBM is a network of stochastic units with undirected interactions between pairs of visible and hidden units.

The probability model is:

$$
p(v,h)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(v,h)}{T}
\right),
$$

with energy:

$$
E(v,h)
=
-a^\top v
-
b^\top h
-
v^\top W h.
$$

## 18.8 Logistic / sigmoid function

### Intuition

The sigmoid function is used to express the probability that a binary unit is on.

### Formal definition

$$
\sigma(x)
=
\frac{1}{1+\exp(-x)}.
$$

Used in RBMs as:

$$
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right)
$$

and

$$
p(v_j = 1 \mid h)
=
\sigma
\left(
a_j
+
\sum_i W_{ji}h_i
\right).
$$

---

# 19. Formula sheet

## 19.1 Boltzmann / Gibbs distribution for Boltzmann Machines

$$
p(v,h)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(v,h)}{T}
\right).
$$

## 19.2 Statistical mechanics distribution

$$
p(s_i)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(s_i)}{\kappa_B T}
\right).
$$

## 19.3 Statistical mechanics partition function

$$
Z
=
\sum_i
\exp
\left(
-\frac{E(s_i)}{\kappa_B T}
\right).
$$

## 19.4 RBM energy function

$$
E(v,h)
=
-a^\top v
-
b^\top h
-
v^\top W h.
$$

## 19.5 RBM energy function expanded

$$
E(v,h)
=
-
\sum_{j=1}^{N} a_j v_j
-
\sum_{i=1}^{M} b_i h_i
-
\sum_{i=1}^{M}
\sum_{j=1}^{N}
v_j w_{j,i} h_i.
$$

## 19.6 RBM conditional independence: hidden given visible

$$
p(h \mid v)
=
\prod_i p(h_i \mid v).
$$

## 19.7 RBM conditional: one hidden unit

$$
p(h_i = 1 \mid v)
=
\frac{1}
{
1+
\exp
\left(
-b_i
-
\sum_j v_j W_{ji}
\right)
}.
$$

Equivalent sigmoid form:

$$
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right).
$$

## 19.8 RBM conditional independence: visible given hidden

$$
p(v \mid h)
=
\prod_j p(v_j \mid h).
$$

## 19.9 RBM conditional: one visible unit

$$
p(v_j = 1 \mid h)
=
\frac{1}
{
1+
\exp
\left(
-a_j
-
\sum_i W_{ji}h_i
\right)
}.
$$

Equivalent sigmoid form:

$$
p(v_j = 1 \mid h)
=
\sigma
\left(
a_j
+
\sum_i W_{ji}h_i
\right).
$$

## 19.10 Logistic function

$$
\sigma(x)
=
\frac{1}
{1+\exp(-x)}.
$$

---

# 20. Worked examples from the slides

## 20.1 Example 1: Boltzmann Machine architecture

The Boltzmann Machine slide example has:

$$
v = (v_1,v_2,v_3,v_4)
$$

and

$$
h = (h_1,h_2,h_3).
$$

The probability model is:

$$
p(v,h)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(v,h)}{T}
\right).
$$

The units are binary:

$$
v_j,h_i \in \{0,1\}.
$$

## 20.2 Example 2: RBM architecture

The RBM slide example has:

$$
v = (v_1,v_2,v_3)
$$

and

$$
h = (h_1,h_2,h_3,h_4).
$$

Weights are:

$$
w_{j,i} = w(v_j,h_i).
$$

The key structural restrictions are:

$$
\text{hidden-visible connections exist}
$$

but:

$$
\text{hidden-hidden connections do not exist}
$$

and:

$$
\text{visible-visible connections do not exist}.
$$

## 20.3 Example 3: Derivation of $p(h_i=1\mid v)$

Goal:

$$
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right).
$$

Start with:

$$
p(h \mid v)
\propto
\exp
\left(
a^\top v
+
b^\top h
+
v^\top W h
\right).
$$

Expand:

$$
p(h \mid v)
\propto
\exp
\left(
\sum_j a_jv_j
+
\sum_i b_ih_i
+
\sum_i
\sum_j
v_jW_{ji}h_i
\right).
$$

For fixed $i$, drop terms not depending on $h_i$:

$$
p(h_i \mid v)
\propto
\exp
\left(
b_ih_i
+
\sum_j v_jW_{ji}h_i
\right).
$$

Let:

$$
x
=
b_i
+
\sum_j v_jW_{ji}.
$$

Then:

$$
p(h_i \mid v)
\propto
\exp(h_ix).
$$

Since $h_i \in \{0,1\}$:

$$
p(h_i=0\mid v)
\propto
1
$$

and

$$
p(h_i=1\mid v)
\propto
\exp(x).
$$

Normalise:

$$
p(h_i=1\mid v)
=
\frac{\exp(x)}
{1+\exp(x)}.
$$

Rewrite:

$$
\frac{\exp(x)}
{1+\exp(x)}
=
\frac{1}
{1+\exp(-x)}.
$$

Therefore:

$$
p(h_i = 1 \mid v)
=
\frac{1}
{
1+
\exp
\left(
-b_i
-
\sum_j v_jW_{ji}
\right)
}
$$

and hence:

$$
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_jW_{ji}
\right).
$$

---

# 21. Exam flags and revision priorities

## 21.1 Explicit slide flags

### [EXAM FLAG] Binary units

The slides explicitly note that visible and hidden units are typically binary, with values $0/1$. This is essential for the conditional probability derivation.

### [EXAM FLAG] RBM connectivity

The slides explicitly mark the RBM architecture as important:

- every hidden node is connected to every visible node;
- no hidden-hidden connections;
- no visible-visible connections.

### [EXAM FLAG] Conditional probability calculations

The ILOs explicitly mention probability calculations and conditional probabilities for RBMs.

### [EXAM FLAG] Pen-and-paper derivation

The final exercise asks students to show:

$$
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_jW_{ji}
\right).
$$

This derivation should be practised.

## 21.2 Likely high-value revision targets

Know how to explain:

1. what makes a Boltzmann Machine stochastic, undirected, energy-based, and generative;
2. why lower energy means higher probability;
3. what the partition function does;
4. why computing $Z$ is expensive;
5. what clamping means;
6. why standard Boltzmann Machines are hard to train;
7. what restriction defines an RBM;
8. why RBM conditionals factorise;
9. how to derive $p(h_i=1\mid v)$ using proportionality and normalisation;
10. how to write the sigmoid forms of RBM conditionals.

---

# 22. Connections to earlier material and applications

## 22.1 Connections to earlier models

The slides explicitly connect Boltzmann Machines to:

$$
\textbf{Hopfield Networks.}
$$

Hopfield Networks are described as a precursor model.

## 22.2 Connections to statistical mechanics

The lecture connects the probability model to statistical mechanics via:

$$
p(s_i)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(s_i)}{\kappa_B T}
\right).
$$

The machine learning version uses the same energy-based probability idea.

## 22.3 Connections to applications

Applications mentioned include:

- sampling;
- image generation;
- sound generation;
- feature learning;
- dimensionality reduction;
- preprocessing for downstream tasks;
- anomaly detection;
- pattern completion;
- image reconstruction;
- collaborative filtering.

---

# 23. Unclear sections / things to check in the transcript or recording

## 23.1 Transcript missing

**[UNCLEAR]** No lecture transcript was provided, so these notes cannot include the lecturer’s spoken explanations, extra examples, verbal emphasis, exam hints, or corrections beyond what appears on the slides.

## 23.2 Partition function notation

**[UNCLEAR]** Slide 20 writes the RBM partition function using notation like:

$$
\sum_{i,j}.
$$

The intended meaning is almost certainly summation over all configurations of $v$ and $h$, but the notation is potentially confusing because $i$ and $j$ are also used for hidden and visible unit indices.

## 23.3 “Ignoring 1st degree terms”

**[UNCLEAR]** Slide 20 shows the partition function expression while ignoring first-degree terms. The first-degree terms are the $a^\top v$ and $b^\top h$ parts of the energy function, but the spoken explanation may clarify why they were ignored in that display.

## 23.4 Contrastive divergence

**[UNCLEAR]** Slide 17 mentions efficient training via contrastive divergence, but the slides do not define or derive contrastive divergence. Check the recording/transcript if available.

## 23.5 Exact training algorithm

**[UNCLEAR]** The slides describe training conceptually as lowering energy of input data and raising energy of other patterns, but they do not give a full learning algorithm or update rule. The transcript may contain more detail.

## 23.6 Conditional independence explanation

**[UNCLEAR]** Slides 21 and 22 say the factorisations follow from graph separation properties, but they do not show the graph-separation argument in detail. Check the recording/transcript if available.

---

# 24. Quick revision checklist

Before an exam, make sure you can do the following without notes:

- Define a Boltzmann Machine.
- Explain why it is stochastic, undirected, energy-based, and generative.
- Write the Boltzmann/Gibbs probability model.
- Explain the role of the energy function.
- Explain the role of the partition function.
- State why computing $Z$ can be expensive.
- Explain clamping.
- List the main limitations of standard Boltzmann Machines.
- Define a Restricted Boltzmann Machine.
- State the RBM architecture restrictions.
- Write the RBM energy function in vector and expanded form.
- State the conditional independence factorisations:

$$
p(h\mid v)=\prod_i p(h_i\mid v),
\qquad
p(v\mid h)=\prod_j p(v_j\mid h).
$$

- Derive:

$$
p(h_i = 1 \mid v)
=
\sigma\left(b_i + \sum_j v_j W_{ji}\right).
$$

- Write:

$$
p(v_j = 1 \mid h)
=
\sigma\left(a_j + \sum_i W_{ji}h_i\right).
$$

