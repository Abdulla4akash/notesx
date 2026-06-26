---
subject: COMP64802
chapter: 59
title: "Lecture 9 — Question Bank"
language: en
---

# COMP64802 Lecture 9 — Worked Question Bank

## Topic: Boltzmann Machines and Restricted Boltzmann Machines

This question bank is built from the uploaded Lecture 9 sheet. It only drills task types actually covered in the sheet: Boltzmann/Gibbs probabilities, energy comparisons, partition functions, visible/hidden architecture checks, RBM energy calculations, RBM conditional probabilities, sigmoid calculations, clamping/sampling intuition, and the pen-and-paper derivation of $p(h_i=1\mid v)$.

**Default assumptions unless stated otherwise:**

- Units are binary: $v_j,h_i\in\{0,1\}$.
- Temperature is $T=1$, unless a question explicitly gives another $T$.
- For an RBM,


$$

E(v,h)=-a^\top v-b^\top h-v^\top Wh.

$$


- With $T=1$,


$$

p(v,h)=\frac{1}{Z}\exp(-E(v,h))
      =\frac{1}{Z}\exp(a^\top v+b^\top h+v^\top Wh).

$$


---

## Identified computational task types from the lecture sheet

1. Recognise a Boltzmann Machine from its binary, stochastic, undirected, energy-based structure.
2. Distinguish a general Boltzmann Machine from a Restricted Boltzmann Machine by checking graph restrictions.
3. Count binary configurations for visible and hidden units.
4. Convert energies into unnormalised Boltzmann/Gibbs probabilities.
5. Compute a partition function $Z$ by summing over small state spaces.
6. Normalise unnormalised probabilities using $Z$.
7. Use energy comparisons for probability ranking and anomaly intuition.
8. Build and expand the RBM energy function.
9. Compute RBM conditional probabilities $p(h_i=1\mid v)$ and $p(v_j=1\mid h)$.
10. Use the sigmoid/logistic function in RBM conditionals.
11. Use RBM conditional independence to factorise $p(h\mid v)$ and $p(v\mid h)$.
12. Derive the sheet's pen-and-paper result:


$$

p(h_i=1\mid v)=\sigma\left(b_i+\sum_j v_jW_{ji}\right).

$$


13. Explain when exact partition functions/inference become intractable.
14. Handle edge cases: wrong graph type, wrong sign, wrong normalisation, wrong weight orientation, and invalid factorisation.

**Not drilled as a computational algorithm:** exact Boltzmann Machine training and contrastive divergence details, because the sheet flags these as missing/unclear rather than giving a worked procedure.

---

# Section A — Mechanical / single-step drills

These are the “can I apply the formula without tripping?” questions.

---

## Q1. Running BM architecture: count the total binary state space

The sheet's Boltzmann Machine architecture example uses


$$

v=(v_1,v_2,v_3,v_4),\qquad h=(h_1,h_2,h_3).

$$


Each unit is binary. How many total joint configurations $(v,h)$ are possible?

### Solution

**Step 1: Count visible units.**

There are 4 visible units:


$$

v_1,v_2,v_3,v_4.

$$


**Step 2: Count hidden units.**

There are 3 hidden units:


$$

h_1,h_2,h_3.

$$


**Step 3: Count total binary units.**


$$

4+3=7.

$$


**Step 4: Use the binary-state rule.**

Each binary unit has 2 possible values, so 7 binary units have


$$

2^7=128

$$


joint configurations.

**Answer:** $128$ possible joint states.

---

## Q2. RBM architecture discriminator: is this graph restricted?

A model has visible units $v_1,v_2$, hidden units $h_1,h_2$, and edges


$$

\{v_1h_1,\ v_1h_2,\ v_2h_1,\ h_1h_2\}.

$$


Is it an RBM?

### Solution

**Step 1: Recall the RBM restriction.**

An RBM allows visible-hidden edges, but forbids:


$$

h_i \leftrightarrow h_k

$$


and forbids:


$$

v_j \leftrightarrow v_\ell.

$$


**Step 2: Check each edge type.**

The edges $v_1h_1$, $v_1h_2$, and $v_2h_1$ are visible-hidden edges, so they are allowed.

**Step 3: Look for a forbidden within-layer edge.**

The edge $h_1h_2$ connects hidden to hidden.

**Step 4: Decide.**

Since an RBM cannot contain hidden-hidden edges, this graph is **not** an RBM.

**Answer:** Not an RBM. It is a more general Boltzmann Machine-style graph.

---

## Q3. Energy ranking: which configuration is more probable?

Two configurations have energies


$$

E_A=2,\qquad E_B=5,

$$


with $T=1$. Which configuration is more probable, and by what probability ratio?

### Solution

**Step 1: Use the Boltzmann factor.**

For $T=1$, unnormalised probability is


$$

\exp(-E).

$$


**Step 2: Compute the unnormalised masses.**


$$

\tilde p_A=\exp(-2),\qquad \tilde p_B=\exp(-5).

$$


**Step 3: Compute the ratio.**


$$

\frac{\tilde p_A}{\tilde p_B}
=rac{\exp(-2)}{\exp(-5)}
=\exp(3)
\approx 20.09.

$$


**Step 4: Interpret.**

Lower energy means higher probability.

**Answer:** Configuration $A$ is more probable, by a factor of about $20.09$.

---

## Q4. Partition function from an energy table

A tiny energy-based model has three possible states with energies


$$

E(s_1)=0,
\quad
E(s_2)=1,
\quad
E(s_3)=2.

$$


With $T=1$, compute $Z$ and the probability of each state.

### Solution

**Step 1: Write the partition function.**


$$

Z=\sum_i \exp(-E(s_i)).

$$


**Step 2: Substitute the energies.**


$$

Z=\exp(0)+\exp(-1)+\exp(-2).

$$


**Step 3: Compute the value.**


$$

Z=1+0.3679+0.1353=1.5032.

$$


**Step 4: Normalise each state.**


$$

p(s_1)=\frac{1}{1.5032}=0.6652.

$$



$$

p(s_2)=\frac{0.3679}{1.5032}=0.2447.

$$



$$

p(s_3)=\frac{0.1353}{1.5032}=0.0900.

$$


**Answer:**


$$

Z\approx1.5032,
\quad
p(s_1)\approx0.6652,
\quad
p(s_2)\approx0.2447,
\quad
p(s_3)\approx0.0900.

$$


---

## Q5. Sigmoid calculation for one RBM unit

Compute


$$

\sigma(1.2)=\frac{1}{1+\exp(-1.2)}.

$$


### Solution

**Step 1: Write the sigmoid definition.**


$$

\sigma(x)=\frac{1}{1+\exp(-x)}.

$$


**Step 2: Substitute $x=1.2$.**


$$

\sigma(1.2)=\frac{1}{1+\exp(-1.2)}.

$$


**Step 3: Compute the exponential term.**


$$

\exp(-1.2)\approx0.3010.

$$


**Step 4: Normalise.**


$$

\sigma(1.2)=\frac{1}{1+0.3010}=0.7685.

$$


**Answer:** $\sigma(1.2)\approx0.7685$.

---

## Q6. RBM parameter count

An RBM has $N=3$ visible units and $M=4$ hidden units. How many weights, biases, and total parameters does it have?

### Solution

**Step 1: Count visible-hidden weights.**

In the sheet's RBM setup, every visible unit connects to every hidden unit, so the weight matrix has shape


$$

W\in\mathbb{R}^{N\times M}.

$$


Thus the number of weights is


$$

NM=3\times4=12.

$$


**Step 2: Count visible biases.**

There is one visible bias per visible unit:


$$

N=3.

$$


**Step 3: Count hidden biases.**

There is one hidden bias per hidden unit:


$$

M=4.

$$


**Step 4: Add them.**


$$

12+3+4=19.

$$


**Answer:** 12 weights, 3 visible biases, 4 hidden biases, so 19 parameters total.

---

## Q7. Which conditional factorises in an RBM?

For an RBM, write the factorised form of $p(h\mid v)$. What graph property makes this possible?

### Solution

**Step 1: Recall the RBM restriction.**

An RBM has no hidden-hidden edges.

**Step 2: Condition on the visible vector.**

Once $v$ is fixed, hidden units do not directly interact with each other.

**Step 3: Write the factorisation.**


$$

p(h\mid v)=\prod_i p(h_i\mid v).

$$


**Step 4: Interpret.**

The hidden units are conditionally independent given the visible units.

**Answer:**


$$

p(h\mid v)=\prod_i p(h_i\mid v),

$$


because RBMs have no hidden-hidden connections.

---

## Q8. Convert energy to unnormalised probability with temperature

A state has energy $E=-2$, and temperature $T=2$. Compute its unnormalised Boltzmann factor.

### Solution

**Step 1: Use the general Boltzmann factor.**


$$

\tilde p=\exp\left(-\frac{E}{T}\right).

$$


**Step 2: Substitute $E=-2$ and $T=2$.**


$$

\tilde p=\exp\left(-\frac{-2}{2}\right)=\exp(1).

$$


**Step 3: Compute.**


$$

\exp(1)\approx2.7183.

$$


**Answer:** The unnormalised probability mass is approximately $2.7183$.

---

# Section B — Multi-condition checks

These questions combine graph structure, energy, normalisation, and conditional probability checks.

---

## Q9. Running RBM architecture: number of possible visible-hidden connections

The sheet's RBM architecture example uses


$$

v=(v_1,v_2,v_3),
\qquad
h=(h_1,h_2,h_3,h_4).

$$


Assuming the standard fully connected RBM between layers, how many visible-hidden weights are possible? Are hidden-hidden or visible-visible weights allowed?

### Solution

**Step 1: Count visible units.**


$$

N=3.

$$


**Step 2: Count hidden units.**


$$

M=4.

$$


**Step 3: Use full bipartite connectivity.**

Each visible unit connects to each hidden unit, so the number of visible-hidden weights is


$$

NM=3\times4=12.

$$


**Step 4: Apply the RBM restriction.**

RBMs do not allow hidden-hidden weights:


$$

h_i\not\leftrightarrow h_k.

$$


They also do not allow visible-visible weights:


$$

v_j\not\leftrightarrow v_\ell.

$$


**Answer:** 12 visible-hidden weights are possible. Hidden-hidden and visible-visible weights are not allowed.

---

## Q10. Compute RBM energy from vectors and a matrix

Consider an RBM with


$$

v=(1,0),
\qquad
h=(1,1),

$$



$$

a=(0.3,-0.2),
\qquad
b=(0.4,-0.1),

$$


and


$$

W=
\begin{pmatrix}
0.5 & -0.3\\
0.2 & 0.7
\end{pmatrix}.

$$


Compute


$$

E(v,h)=-a^\top v-b^\top h-v^\top Wh.

$$


### Solution

**Step 1: Compute the visible-bias term.**


$$

a^\top v=(0.3)(1)+(-0.2)(0)=0.3.

$$


**Step 2: Compute the hidden-bias term.**


$$

b^\top h=(0.4)(1)+(-0.1)(1)=0.3.

$$


**Step 3: Compute the interaction term.**

Because $v=(1,0)$, only the first visible row contributes:


$$

v^\top Wh=(0.5)(1)(1)+(-0.3)(1)(1)+0.2(0)(1)+0.7(0)(1).

$$



$$

v^\top Wh=0.5-0.3+0+0=0.2.

$$


**Step 4: Substitute into the energy.**


$$

E(v,h)=-0.3-0.3-0.2=-0.8.

$$


**Answer:** $E(v,h)=-0.8$.

---

## Q11. Compute both hidden-unit conditionals given a visible vector

Use the same RBM as Q10. Given


$$

v=(1,0),

$$


compute $p(h_1=1\mid v)$, $p(h_2=1\mid v)$, and $p(h=(1,1)\mid v)$.

### Solution

**Step 1: Use the RBM hidden conditional formula.**


$$

p(h_i=1\mid v)=\sigma\left(b_i+\sum_j v_jW_{ji}\right).

$$


**Step 2: Compute the activation for $h_1$.**


$$

x_1=b_1+v_1W_{11}+v_2W_{21}.

$$



$$

x_1=0.4+(1)(0.5)+(0)(0.2)=0.9.

$$


So


$$

p(h_1=1\mid v)=\sigma(0.9)=0.7109.

$$


**Step 3: Compute the activation for $h_2$.**


$$

x_2=b_2+v_1W_{12}+v_2W_{22}.

$$



$$

x_2=-0.1+(1)(-0.3)+(0)(0.7)=-0.4.

$$


So


$$

p(h_2=1\mid v)=\sigma(-0.4)=0.4013.

$$


**Step 4: Use conditional independence.**

In an RBM,


$$

p(h\mid v)=\prod_i p(h_i\mid v).

$$


Therefore


$$

p(h=(1,1)\mid v)=0.7109\times0.4013=0.2853.

$$


**Answer:**


$$

p(h_1=1\mid v)\approx0.7109,
\quad
p(h_2=1\mid v)\approx0.4013,
\quad
p(h=(1,1)\mid v)\approx0.2853.

$$


---

## Q12. Compute both visible-unit conditionals given a hidden vector

Use the same RBM as Q10. Given


$$

h=(1,1),

$$


compute $p(v_1=1\mid h)$ and $p(v_2=1\mid h)$.

### Solution

**Step 1: Use the visible conditional formula.**


$$

p(v_j=1\mid h)=\sigma\left(a_j+\sum_i W_{ji}h_i\right).

$$


**Step 2: Compute the activation for $v_1$.**


$$

x_1=a_1+W_{11}h_1+W_{12}h_2.

$$



$$

x_1=0.3+(0.5)(1)+(-0.3)(1)=0.5.

$$


So


$$

p(v_1=1\mid h)=\sigma(0.5)=0.6225.

$$


**Step 3: Compute the activation for $v_2$.**


$$

x_2=a_2+W_{21}h_1+W_{22}h_2.

$$



$$

x_2=-0.2+(0.2)(1)+(0.7)(1)=0.7.

$$


So


$$

p(v_2=1\mid h)=\sigma(0.7)=0.6682.

$$


**Answer:**


$$

p(v_1=1\mid h)\approx0.6225,
\qquad
p(v_2=1\mid h)\approx0.6682.

$$


---

## Q13. Tiny RBM: compute the full joint distribution

A tiny RBM has one visible unit $v$ and one hidden unit $h$, with


$$

a=0.2,
\qquad
b=-0.4,
\qquad
W=0.7.

$$


Using


$$

p(v,h)\propto \exp(av+bh+vWh),

$$


compute $Z$ and the four joint probabilities.

### Solution

**Step 1: List all binary states.**

Since $v,h\in\{0,1\}$, the four states are


$$

(0,0),\ (0,1),\ (1,0),\ (1,1).

$$


**Step 2: Compute the exponent score $av+bh+vWh$.**

For $(0,0)$:


$$

0.2(0)-0.4(0)+0.7(0)(0)=0.

$$


For $(0,1)$:


$$

0.2(0)-0.4(1)+0.7(0)(1)=-0.4.

$$


For $(1,0)$:


$$

0.2(1)-0.4(0)+0.7(1)(0)=0.2.

$$


For $(1,1)$:


$$

0.2(1)-0.4(1)+0.7(1)(1)=0.5.

$$


**Step 3: Exponentiate each score.**


$$

\tilde p(0,0)=\exp(0)=1.

$$



$$

\tilde p(0,1)=\exp(-0.4)=0.6703.

$$



$$

\tilde p(1,0)=\exp(0.2)=1.2214.

$$



$$

\tilde p(1,1)=\exp(0.5)=1.6487.

$$


**Step 4: Sum to get $Z$.**


$$

Z=1+0.6703+1.2214+1.6487=4.5404.

$$


**Step 5: Divide each unnormalised mass by $Z$.**


$$

p(0,0)=\frac{1}{4.5404}=0.2202.

$$



$$

p(0,1)=\frac{0.6703}{4.5404}=0.1476.

$$



$$

p(1,0)=\frac{1.2214}{4.5404}=0.2690.

$$



$$

p(1,1)=\frac{1.6487}{4.5404}=0.3631.

$$


**Answer:**


$$

Z\approx4.5404,

$$


with probabilities approximately


$$

0.2202,
\quad
0.1476,
\quad
0.2690,
\quad
0.3631

$$


for $(0,0),(0,1),(1,0),(1,1)$, respectively.

---

## Q14. Tiny RBM: compute a marginal and a conditional two ways

Using the tiny RBM from Q13, compute:

1. $p(v=1)$
2. $p(h=1\mid v=1)$
3. Verify $p(h=1\mid v=1)$ using the sigmoid formula.

### Solution

**Step 1: Use the joint probabilities from Q13.**


$$

p(1,0)=0.2690,
\qquad
p(1,1)=0.3631.

$$


**Step 2: Marginalise over $h$ to get $p(v=1)$.**


$$

p(v=1)=p(1,0)+p(1,1).

$$



$$

p(v=1)=0.2690+0.3631=0.6321.

$$


**Step 3: Compute $p(h=1\mid v=1)$ from the joint distribution.**


$$

p(h=1\mid v=1)=\frac{p(v=1,h=1)}{p(v=1)}.

$$



$$

p(h=1\mid v=1)=\frac{0.3631}{0.6321}=0.5744.

$$


**Step 4: Verify with the RBM hidden conditional.**

For one hidden unit,


$$

p(h=1\mid v)=\sigma(b+vW).

$$


Here $b=-0.4$, $v=1$, and $W=0.7$, so


$$

b+vW=-0.4+0.7=0.3.

$$



$$

\sigma(0.3)=0.5744.

$$


**Answer:**


$$

p(v=1)\approx0.6321,
\qquad
p(h=1\mid v=1)\approx0.5744.

$$


The joint-table method and sigmoid method agree.

---

## Q15. Energy and anomaly intuition

A trained energy-based model gives the following energies to three candidate inputs:


$$

E(x_A)=-3,
\qquad
E(x_B)=0,
\qquad
E(x_C)=4.

$$


Which input is most normal under the model, and which is most anomalous?

### Solution

**Step 1: Recall the energy-probability relationship.**

Lower energy means higher probability.

Higher energy means lower probability.

**Step 2: Rank the energies.**


$$

-3<0<4.

$$


So the energy order from lowest to highest is


$$

x_A,\ x_B,\ x_C.

$$


**Step 3: Convert to probability intuition.**

$x_A$ has the highest model probability.

$x_C$ has the lowest model probability.

**Step 4: Apply anomaly-detection intuition.**

High-energy, low-probability points are treated as more anomalous.

**Answer:** $x_A$ is most normal; $x_C$ is most anomalous.

---

## Q16. Clamping during training or pattern completion

Suppose an input vector $v=(1,0,1)$ is presented to a Boltzmann Machine during training. Which units are clamped, and which units remain free?

### Solution

**Step 1: Identify visible and hidden units.**

The vector $v=(1,0,1)$ corresponds to visible units.

**Step 2: Apply the clamping rule.**

Clamping means fixing the visible units to the observed data values.

So set


$$

v_1=1,
\quad
v_2=0,
\quad
v_3=1.

$$


**Step 3: Identify what remains unclamped.**

Hidden units are not clamped. They operate freely according to the model distribution.

**Step 4: Interpret.**

The model uses the fixed visible pattern while hidden units learn or represent underlying structure.

**Answer:** The visible units $v_1,v_2,v_3$ are clamped to $(1,0,1)$. Hidden units remain free.

---

# Section C — Building things from scratch

These questions ask you to construct formulas, algorithms, or derivations rather than merely plug into a formula.

---

## Q17. Build the Boltzmann/Gibbs model for the sheet's BM example

Using the sheet's BM example


$$

v=(v_1,v_2,v_3,v_4),
\qquad
h=(h_1,h_2,h_3),

$$


write the joint probability model and the partition function. Do not assume a specific energy formula; use $E(v,h)$.

### Solution

**Step 1: Identify the joint state.**

The full machine state is


$$

(v,h).

$$


Here $v$ has 4 binary visible units and $h$ has 3 binary hidden units.

**Step 2: Write the Boltzmann/Gibbs joint probability.**

The sheet gives the general form


$$

p(v,h)=\frac{1}{Z}\exp\left(-\frac{E(v,h)}{T}\right).

$$


**Step 3: Write the partition function.**

The partition function sums the unnormalised mass over all possible visible and hidden configurations:


$$

Z=\sum_v\sum_h \exp\left(-\frac{E(v,h)}{T}\right).

$$


**Step 4: Count how many terms the sum contains.**

There are $4+3=7$ binary units, so the number of joint configurations is


$$

2^7=128.

$$


Therefore $Z$ has 128 terms for this toy architecture.

**Answer:**


$$

p(v,h)=\frac{1}{Z}\exp\left(-\frac{E(v,h)}{T}\right),
\qquad
Z=\sum_v\sum_h \exp\left(-\frac{E(v,h)}{T}\right),

$$


with 128 terms in the partition sum.

---

## Q18. Build an expanded RBM energy function from named units

An RBM has visible units $v_1,v_2,v_3$ and hidden units $h_1,h_2$. Write the expanded energy function using visible biases $a_1,a_2,a_3$, hidden biases $b_1,b_2$, and weights $W_{ji}$.

### Solution

**Step 1: Start from the compact RBM energy formula.**


$$

E(v,h)=-a^\top v-b^\top h-v^\top Wh.

$$


**Step 2: Expand the visible-bias term.**


$$

a^\top v=a_1v_1+a_2v_2+a_3v_3.

$$


So its energy contribution is


$$

-(a_1v_1+a_2v_2+a_3v_3).

$$


**Step 3: Expand the hidden-bias term.**


$$

b^\top h=b_1h_1+b_2h_2.

$$


So its energy contribution is


$$

-(b_1h_1+b_2h_2).

$$


**Step 4: Expand the interaction term.**

Every visible unit connects to every hidden unit:


$$

v^\top Wh
=
 v_1W_{11}h_1+v_1W_{12}h_2
+v_2W_{21}h_1+v_2W_{22}h_2
+v_3W_{31}h_1+v_3W_{32}h_2.

$$


So its energy contribution is the negative of this sum.

**Step 5: Combine.**


$$

\begin{aligned}
E(v,h)=&-(a_1v_1+a_2v_2+a_3v_3)\\
&-(b_1h_1+b_2h_2)\\
&-(v_1W_{11}h_1+v_1W_{12}h_2
+v_2W_{21}h_1+v_2W_{22}h_2
+v_3W_{31}h_1+v_3W_{32}h_2).
\end{aligned}

$$


**Answer:** The expanded energy is the expression above.

---

## Q19. Build a full partition-function enumerator for a tiny RBM

An RBM has $N=2$ visible units and $M=1$ hidden unit. Write the partition function by explicitly listing the configurations it must sum over.

### Solution

**Step 1: Count the binary units.**

There are


$$

N+M=2+1=3

$$


binary units.

**Step 2: Count the total states.**


$$

2^3=8.

$$


**Step 3: List all visible vectors.**


$$

v\in\{(0,0),(0,1),(1,0),(1,1)\}.

$$


**Step 4: List hidden states.**


$$

h\in\{0,1\}.

$$


**Step 5: Write the partition function.**


$$

Z=\sum_{v_1=0}^{1}\sum_{v_2=0}^{1}\sum_{h_1=0}^{1}
\exp(-E(v_1,v_2,h_1)).

$$


Equivalently, explicitly:


$$

\begin{aligned}
Z=&\exp(-E(0,0,0))+\exp(-E(0,0,1))\\
&+\exp(-E(0,1,0))+\exp(-E(0,1,1))\\
&+\exp(-E(1,0,0))+\exp(-E(1,0,1))\\
&+\exp(-E(1,1,0))+\exp(-E(1,1,1)).
\end{aligned}

$$


**Answer:** The partition function has 8 terms, one for every joint binary configuration.

---

## Q20. Derive the sheet's running result: $p(h_i=1\mid v)$

Derive


$$

p(h_i=1\mid v)=\sigma\left(b_i+\sum_j v_jW_{ji}\right).

$$


Use the RBM energy function and assume $T$ has been absorbed into the parameters.

### Solution

**Step 1: Start from the RBM probability model.**

With temperature absorbed,


$$

p(v,h)\propto \exp(a^\top v+b^\top h+v^\top Wh).

$$


Therefore, for fixed $v$,


$$

p(h\mid v)\propto \exp(a^\top v+b^\top h+v^\top Wh).

$$


**Step 2: Expand the exponent.**


$$

a^\top v+b^\top h+v^\top Wh
=
\sum_j a_jv_j+
\sum_i b_ih_i+
\sum_i\sum_j v_jW_{ji}h_i.

$$


**Step 3: Focus only on one hidden unit $h_i$.**

When computing $p(h_i\mid v)$, terms not depending on $h_i$ can be absorbed into the proportionality constant.

The $h_i$-dependent part is


$$

b_ih_i+\sum_j v_jW_{ji}h_i.

$$


**Step 4: Factor out $h_i$.**


$$

b_ih_i+\sum_j v_jW_{ji}h_i
=
h_i\left(b_i+
\sum_j v_jW_{ji}\right).

$$


Let


$$

x=b_i+\sum_j v_jW_{ji}.

$$


Then


$$

p(h_i\mid v)\propto\exp(h_ix).

$$


**Step 5: Use the binary values of $h_i$.**

If $h_i=0$, then


$$

\exp(h_ix)=\exp(0)=1.

$$


If $h_i=1$, then


$$

\exp(h_ix)=\exp(x).

$$


**Step 6: Normalise over the two cases.**

The total unnormalised mass is


$$

1+\exp(x).

$$


Therefore


$$

p(h_i=1\mid v)=\frac{\exp(x)}{1+\exp(x)}.

$$


**Step 7: Convert to sigmoid form.**


$$

\frac{\exp(x)}{1+\exp(x)}
=
\frac{1}{1+\exp(-x)}
=\sigma(x).

$$


Substitute back


$$

x=b_i+\sum_j v_jW_{ji}.

$$


**Answer:**


$$

p(h_i=1\mid v)=\sigma\left(b_i+\sum_j v_jW_{ji}\right).

$$


---

## Q21. Derive the analogous visible-unit conditional

Derive


$$

p(v_j=1\mid h)=\sigma\left(a_j+\sum_i W_{ji}h_i\right).

$$


### Solution

**Step 1: Start from the same RBM probability model.**


$$

p(v,h)\propto \exp(a^\top v+b^\top h+v^\top Wh).

$$


For fixed $h$,


$$

p(v\mid h)\propto \exp(a^\top v+b^\top h+v^\top Wh).

$$


**Step 2: Expand the terms involving visible units.**


$$

a^\top v=\sum_j a_jv_j.

$$



$$

v^\top Wh=\sum_j\sum_i v_jW_{ji}h_i.

$$


**Step 3: Focus on one visible unit $v_j$.**

Terms not depending on $v_j$ can be absorbed into the proportionality constant.

The $v_j$-dependent part is


$$

a_jv_j+\sum_i v_jW_{ji}h_i.

$$


**Step 4: Factor out $v_j$.**


$$

a_jv_j+\sum_i v_jW_{ji}h_i
=
v_j\left(a_j+\sum_i W_{ji}h_i\right).

$$


Let


$$

y=a_j+\sum_i W_{ji}h_i.

$$


Then


$$

p(v_j\mid h)\propto\exp(v_jy).

$$


**Step 5: Use $v_j\in\{0,1\}$.**

If $v_j=0$, the unnormalised mass is $1$.

If $v_j=1$, the unnormalised mass is $\exp(y)$.

**Step 6: Normalise.**


$$

p(v_j=1\mid h)=\frac{\exp(y)}{1+\exp(y)}.

$$


**Step 7: Convert to sigmoid notation.**


$$

p(v_j=1\mid h)=\sigma(y)
=\sigma\left(a_j+\sum_i W_{ji}h_i\right).

$$


**Answer:**


$$

p(v_j=1\mid h)=\sigma\left(a_j+\sum_i W_{ji}h_i\right).

$$


---

## Q22. Build one RBM sampling/reconstruction step

Use the RBM from Q10. Start with the visible vector


$$

v=(1,0).

$$


First sample hidden units using random draws $(r_1,r_2)=(0.2,0.8)$, where the rule is: set the unit to 1 if $r<p$, otherwise set it to 0. Then reconstruct visible units from the sampled hidden vector using visible random draws $(0.7,0.3)$.

### Solution

**Step 1: Compute hidden probabilities from Q11.**

From Q11,


$$

p(h_1=1\mid v)=0.7109,
\qquad
p(h_2=1\mid v)=0.4013.

$$


**Step 2: Sample $h_1$.**

The random draw is $r_1=0.2$.

Since


$$

0.2<0.7109,

$$


set


$$

h_1=1.

$$


**Step 3: Sample $h_2$.**

The random draw is $r_2=0.8$.

Since


$$

0.8>0.4013,

$$


set


$$

h_2=0.

$$


So the sampled hidden vector is


$$

h=(1,0).

$$


**Step 4: Compute visible reconstruction probabilities.**

For $v_1$:


$$

p(v_1=1\mid h)=\sigma(a_1+W_{11}h_1+W_{12}h_2).

$$



$$

p(v_1=1\mid h)=\sigma(0.3+0.5(1)-0.3(0))=\sigma(0.8)=0.6900.

$$


For $v_2$:


$$

p(v_2=1\mid h)=\sigma(a_2+W_{21}h_1+W_{22}h_2).

$$



$$

p(v_2=1\mid h)=\sigma(-0.2+0.2(1)+0.7(0))=\sigma(0)=0.5.

$$


**Step 5: Sample reconstructed $v_1$.**

The random draw is $0.7$.

Since


$$

0.7>0.6900,

$$


set


$$

v_1'=0.

$$


**Step 6: Sample reconstructed $v_2$.**

The random draw is $0.3$.

Since


$$

0.3<0.5,

$$


set


$$

v_2'=1.

$$


**Answer:** The hidden sample is $h=(1,0)$, and the reconstructed visible sample is


$$

v'=(0,1).

$$


---

## Q23. Build a valid RBM architecture from scratch

Construct a valid RBM with 2 visible units and 3 hidden units. List the allowed weights, forbidden weights, and total parameter count.

### Solution

**Step 1: Name the units.**

Visible units:


$$

v_1,v_2.

$$


Hidden units:


$$

h_1,h_2,h_3.

$$


**Step 2: List allowed visible-hidden weights.**

Allowed weights are


$$

W_{11},W_{12},W_{13},W_{21},W_{22},W_{23}.

$$


There are


$$

2\times3=6

$$


allowed weights.

**Step 3: List forbidden hidden-hidden weights.**

The following are forbidden:


$$

h_1h_2,
\quad
h_1h_3,
\quad
h_2h_3.

$$


**Step 4: List forbidden visible-visible weights.**

The visible-visible edge


$$

v_1v_2

$$


is forbidden.

**Step 5: Count biases.**

Visible biases:


$$

2.

$$


Hidden biases:


$$

3.

$$


**Step 6: Count total parameters.**


$$

6+2+3=11.

$$


**Answer:** A valid RBM has 6 visible-hidden weights, no within-layer weights, and 11 total parameters.

---

## Q24. Use an RBM for pattern completion

A trained RBM has visible vector


$$

v=(v_1,v_2,v_3,v_4).

$$


You observe only


$$

v_1=1,
\qquad
v_2=0,

$$


and want the model to complete $v_3,v_4$. Describe the procedure at the level covered by the lecture.

### Solution

**Step 1: Identify the known visible units.**

The known entries are


$$

v_1=1,
\qquad
v_2=0.

$$


**Step 2: Clamp the known visible units.**

Keep $v_1$ and $v_2$ fixed at their observed values.

**Step 3: Leave the unknown visible units unclamped.**

The unknown entries


$$

v_3,v_4

$$


are allowed to be inferred/sampled by the model.

**Step 4: Alternate through hidden and visible updates.**

Use the RBM conditionals:


$$

p(h_i=1\mid v)=\sigma\left(b_i+\sum_jv_jW_{ji}\right),

$$


and


$$

p(v_j=1\mid h)=\sigma\left(a_j+\sum_iW_{ji}h_i\right).

$$


**Step 5: Read off the completed pattern.**

The sampled or most probable values of $v_3,v_4$ give the completion.

**Answer:** Clamp the observed visible units, sample hidden units using $p(h\mid v)$, then sample or infer missing visible units using $p(v\mid h)$.

---

# Section D — Hard edge cases: where methods break, disagree, or mislead

These are the highest-value exam traps from this lecture.

---

## Q25. Hidden-hidden edge: why the RBM factorisation breaks

Suppose an energy model has the usual RBM terms but also a hidden-hidden interaction


$$

-c h_1h_2.

$$


Can you still write


$$

p(h\mid v)=p(h_1\mid v)p(h_2\mid v)?

$$


### Solution

**Step 1: Recall why RBM factorisation works.**

The factorisation


$$

p(h\mid v)=\prod_i p(h_i\mid v)

$$


works because there are no hidden-hidden edges.

**Step 2: Inspect the new term.**

The term


$$

-c h_1h_2

$$


in the energy means that the exponent contains a term proportional to


$$

+c h_1h_2.

$$


This directly couples $h_1$ and $h_2$.

**Step 3: Compute the conditional dependence.**

When computing $p(h_1=1\mid v,h_2)$, the activation for $h_1$ includes a contribution from $h_2$:


$$

b_1+\sum_jv_jW_{j1}+ch_2.

$$


So $h_1$'s probability depends on $h_2$.

**Step 4: Decide whether factorisation is valid.**

If $h_1$ depends on $h_2$, then hidden units are not conditionally independent given $v$.

**Answer:** No. The hidden-hidden edge breaks the RBM factorisation. You cannot use $p(h\mid v)=p(h_1\mid v)p(h_2\mid v)$.

---

## Q26. Visible-visible edge: why $p(v\mid h)$ stops factorising

Suppose an energy model has an extra visible-visible interaction


$$

-dv_1v_2.

$$


Can you still write


$$

p(v\mid h)=\prod_j p(v_j\mid h)?

$$


### Solution

**Step 1: Recall the RBM visible conditional factorisation.**

In an RBM,


$$

p(v\mid h)=\prod_jp(v_j\mid h)

$$


because there are no visible-visible edges.

**Step 2: Inspect the added term.**

The energy term


$$

-dv_1v_2

$$


couples $v_1$ directly to $v_2$.

**Step 3: See what happens to $p(v_1\mid h,v_2)$.**

The activation for $v_1$ now contains a term involving $v_2$:


$$

a_1+\sum_iW_{1i}h_i+dv_2.

$$


**Step 4: Decide whether $v_1$ is independent of $v_2$ given $h$.**

It is not independent, because the probability of $v_1$ changes depending on $v_2$.

**Answer:** No. A visible-visible edge breaks the factorisation of $p(v\mid h)$.

---

## Q27. Dropping terms: when is it legal?

When deriving $p(h_i=1\mid v)$, the visible-bias term $a^\top v$ disappears. Does that mean visible biases can always be ignored in RBM calculations?

### Solution

**Step 1: Identify the target calculation.**

The derivation is for


$$

p(h_i\mid v),

$$


where $v$ is fixed.

**Step 2: Check whether $a^\top v$ depends on $h_i$.**

The term


$$

a^\top v

$$


only involves visible variables and visible biases. Since $v$ is fixed, this term is constant with respect to $h_i$.

**Step 3: Apply proportionality logic.**

Terms constant with respect to $h_i$ cancel during normalisation over $h_i\in\{0,1\}$.

So $a^\top v$ can be dropped when deriving $p(h_i\mid v)$.

**Step 4: Check whether this is true for other tasks.**

For $p(v,h)$, $a^\top v$ matters.

For $p(v)$, $a^\top v$ matters.

For $p(v_j\mid h)$, the visible bias $a_j$ directly appears.

**Answer:** No. Visible biases are only dropped in the hidden conditional derivation because $v$ is fixed. They cannot be ignored in general.

---

## Q28. Temperature edge case: how $T$ changes sharpness

Two states have energies


$$

E_A=0,
\qquad
E_B=4.

$$


Compute the probability ratio $\tilde p_A/\tilde p_B$ for $T=2$, and compare it with $T=1$.

### Solution

**Step 1: Use the temperature-dependent Boltzmann factor.**


$$

\tilde p=\exp\left(-\frac{E}{T}\right).

$$


**Step 2: Compute the ratio generally.**


$$

\frac{\tilde p_A}{\tilde p_B}
=rac{\exp(-E_A/T)}{\exp(-E_B/T)}
=\exp\left(\frac{E_B-E_A}{T}\right).

$$


**Step 3: Substitute $T=2$.**


$$

\frac{\tilde p_A}{\tilde p_B}
=\exp\left(\frac{4-0}{2}\right)=\exp(2)=7.389.

$$


**Step 4: Compare with $T=1$.**


$$

\frac{\tilde p_A}{\tilde p_B}
=\exp(4)=54.598.

$$


**Step 5: Interpret.**

Lower temperature makes the distribution sharper. Higher temperature makes energy differences matter less.

**Answer:** At $T=2$, $A$ is about $7.39$ times as likely as $B$. At $T=1$, it is about $54.60$ times as likely.

---

## Q29. Sign trap in the RBM energy

An RBM has one visible unit and one hidden unit, with


$$

a=0,
\qquad
b=0,
\qquad
W=2,
\qquad
v=1,
\qquad
h=1.

$$


Compute the correct energy. Then explain what goes wrong if someone uses $+vWh$ instead of $-vWh$ in the energy.

### Solution

**Step 1: Use the correct RBM energy.**


$$

E(v,h)=-av-bh-vWh.

$$


**Step 2: Substitute the values.**


$$

E(1,1)=-(0)(1)-(0)(1)-(1)(2)(1).

$$



$$

E(1,1)=-2.

$$


**Step 3: Convert to unnormalised probability intuition.**

With $T=1$,


$$

\tilde p=\exp(-E)=\exp(2).

$$


So the active visible-hidden pair receives high unnormalised mass.

**Step 4: Show the wrong-sign result.**

If someone incorrectly used


$$

E=+vWh,

$$


then


$$

E=+2,

$$


and


$$

\tilde p=\exp(-2),

$$


which is much smaller.

**Step 5: State the trap.**

Positive visible-hidden agreement lowers energy in the standard RBM formula because the interaction term is negative in $E$.

**Answer:** The correct energy is $-2$. Using $+vWh$ reverses the probability effect of positive weights.

---

## Q30. Sigmoid sign trap

A hidden unit has activation


$$

x=b_i+\sum_jv_jW_{ji}=-3.

$$


What is $p(h_i=1\mid v)$? What common sign mistake should you avoid?

### Solution

**Step 1: Use the hidden conditional formula.**


$$

p(h_i=1\mid v)=\sigma(x)=\frac{1}{1+\exp(-x)}.

$$


**Step 2: Substitute $x=-3$.**


$$

p(h_i=1\mid v)=\frac{1}{1+\exp(3)}.

$$


**Step 3: Compute.**


$$

\exp(3)\approx20.0855.

$$



$$

p(h_i=1\mid v)=\frac{1}{1+20.0855}=0.0474.

$$


**Step 4: State the sign trap.**

Do not compute $\sigma(3)$. The activation is $-3$, so the probability should be small, not large.

**Answer:**


$$

p(h_i=1\mid v)\approx0.0474.

$$


The common mistake is flipping $-3$ to $+3$.

---

## Q31. Intractable partition function: how fast does enumeration blow up?

An RBM has $N=20$ visible units and $M=10$ hidden units. How many terms would exact computation of $Z$ require if you summed over every joint state?

### Solution

**Step 1: Count total binary units.**


$$

N+M=20+10=30.

$$


**Step 2: Use the binary configuration count.**

A system with 30 binary units has


$$

2^{30}

$$


joint states.

**Step 3: Compute the number.**


$$

2^{30}=1,073,741,824.

$$


**Step 4: Interpret.**

Exact $Z$ would require summing more than one billion terms.

**Answer:** Exact enumeration requires $1,073,741,824$ terms, which illustrates the tractability problem highlighted in the lecture.

---

## Q32. General BM versus RBM: can you use the sigmoid conditional directly?

A model has visible units, hidden units, and arbitrary undirected connections, including visible-visible and hidden-hidden edges. A classmate applies


$$

p(h_i=1\mid v)=\sigma\left(b_i+\sum_jv_jW_{ji}\right).

$$


Is this automatically valid?

### Solution

**Step 1: Identify the formula's model assumption.**

The formula is the RBM hidden conditional.

It relies on the restricted bipartite architecture.

**Step 2: Check the graph.**

The model has arbitrary undirected connections, including within-layer edges.

That is a general Boltzmann Machine, not an RBM.

**Step 3: Check why the formula may fail.**

If hidden-hidden edges exist, then $h_i$'s conditional can depend on other hidden units.

If visible-visible edges exist, visible units also interact directly.

**Step 4: Decide.**

The RBM sigmoid formula is not automatically valid for a general Boltzmann Machine.

**Answer:** No. Use the RBM conditional formula only when the restricted RBM graph assumptions hold.

---

## Q33. Weight-orientation trap: which column affects $h_i$?

An RBM has


$$

W=
\begin{pmatrix}
1 & 4\\
2 & 5\\
3 & 6
\end{pmatrix},
\qquad
v=(1,0,1),
\qquad
b=(0.1,-0.2).

$$


Using the sheet notation $W_{ji}$, compute the activation for $h_2$.

### Solution

**Step 1: Recall the hidden activation formula.**


$$

x_i=b_i+\sum_jv_jW_{ji}.

$$


**Step 2: Identify the correct column for $h_2$.**

Because $i=2$, use the second column of $W$:


$$

W_{12}=4,
\quad
W_{22}=5,
\quad
W_{32}=6.

$$


**Step 3: Substitute $v=(1,0,1)$.**


$$

x_2=b_2+v_1W_{12}+v_2W_{22}+v_3W_{32}.

$$



$$

x_2=-0.2+(1)(4)+(0)(5)+(1)(6).

$$


**Step 4: Compute.**


$$

x_2=-0.2+4+0+6=9.8.

$$


**Answer:** The activation for $h_2$ is $9.8$. The trap is accidentally using the second row instead of the second column.

---

## Q34. “High energy means impossible” — true or false?

A model assigns a state energy $E=100$ with $T=1$. Is the probability exactly zero?

### Solution

**Step 1: Write the unnormalised probability.**


$$

\tilde p=\exp(-E)=\exp(-100).

$$


**Step 2: Check whether an exponential is ever exactly zero.**

For any finite input,


$$

\exp(x)>0.

$$


Therefore


$$

\exp(-100)>0.

$$


**Step 3: Interpret.**

The probability is extremely small, but not exactly zero unless the model imposes some separate hard constraint, which is not part of the standard Boltzmann/Gibbs form in this lecture.

**Answer:** False. High energy means very low probability, not exactly zero probability.

---

## Q35. “Ignoring first-degree terms” caution

The sheet mentions “ignoring first-degree terms” as an unclear point. In an exam-style RBM energy calculation, should you ignore the bias terms $-a^\top v$ and $-b^\top h$ by default?

### Solution

**Step 1: Start from the formula explicitly given in the sheet.**

The RBM energy function is


$$

E(v,h)=-a^\top v-b^\top h-v^\top Wh.

$$


**Step 2: Identify the first-degree terms.**

The first-degree terms are the bias terms:


$$

-a^\top v
\qquad\text{and}\qquad
-b^\top h.

$$


**Step 3: Ask whether the question explicitly says to ignore them.**

If a problem gives $a$ and $b$, or asks for the standard RBM energy, include them.

**Step 4: Ask whether they cancel in a conditional derivation.**

Some terms can be dropped only when they are constant with respect to the variable being normalised over. For example, $a^\top v$ drops out of $p(h_i\mid v)$, but not out of $p(v,h)$.

**Step 5: Decide the safe exam rule.**

Do not ignore bias terms by default.

**Answer:** Include $-a^\top v$ and $-b^\top h$ unless the question explicitly removes them or they cancel in a specific conditional normalisation.

---

# Quick self-test checklist

Before an exam-style answer, ask:

1. Is this a general BM or an RBM?
2. Are all units binary?
3. Am I comparing energies, computing $Z$, computing a joint probability, or computing a conditional?
4. If computing a conditional, what is fixed?
5. Which terms are constant with respect to the variable being normalised over?
6. Does the graph actually justify factorisation?
7. Did I use the correct RBM energy sign?
8. Did I use $W_{ji}$ with $j$ as visible index and $i$ as hidden index?
9. Did I normalise over all required states?
10. Did I avoid treating high energy as zero probability?

---

# Formula mini-sheet

## Boltzmann/Gibbs probability


$$

p(v,h)=\frac{1}{Z}\exp\left(-\frac{E(v,h)}{T}\right).

$$


## Partition function


$$

Z=\sum_v\sum_h\exp\left(-\frac{E(v,h)}{T}\right).

$$


## RBM energy


$$

E(v,h)=-a^\top v-b^\top h-v^\top Wh.

$$


## Expanded RBM energy


$$

E(v,h)=
-\sum_{j=1}^{N}a_jv_j
-\sum_{i=1}^{M}b_ih_i
-\sum_{i=1}^{M}\sum_{j=1}^{N}v_jW_{ji}h_i.

$$


## Hidden conditional


$$

p(h\mid v)=\prod_i p(h_i\mid v).

$$



$$

p(h_i=1\mid v)=\sigma\left(b_i+\sum_jv_jW_{ji}\right).

$$


## Visible conditional


$$

p(v\mid h)=\prod_j p(v_j\mid h).

$$



$$

p(v_j=1\mid h)=\sigma\left(a_j+\sum_iW_{ji}h_i\right).

$$


## Sigmoid


$$

\sigma(x)=\frac{1}{1+\exp(-x)}.

$$

