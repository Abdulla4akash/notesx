---
subject: COMP64802
chapter: 39
title: "Lecture 9 — Flashcards"
language: en
---

# Lecture 9 — Flashcards

57 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> How do you recognise a Boltzmann Machine rather than an ordinary deterministic network?</summary>

Use it:
Step 1: Check that units are binary on/off variables.
Step 2: Check that unit states are stochastic, not deterministic.
Step 3: Check that connections are symmetric/undirected.
Step 4: Check that configurations are scored by an energy, with lower energy meaning higher probability.
Reference: A Boltzmann Machine is a network of symmetrically connected neuron-like units that make stochastic on/off decisions.

</details>

<details>
<summary><strong>Q2.</strong> What does “stochastic” mean for Boltzmann Machine units?</summary>

Use it:
Step 1: Treat each unit state as random.
Step 2: Represent the state as binary: off/on.
Step 3: Use probabilities to describe whether a unit is 0 or 1.
Reference: In this lecture, units are typically binary, $x \in \{0,1\}$, interpreted as off/on.

</details>

<details>
<summary><strong>Q3.</strong> How do you decide whether a Boltzmann Machine connection is undirected?</summary>

Use it:
Step 1: Look for a mutual interaction between two units.
Step 2: Check that the same connection is not treated as a one-way arrow.
Step 3: Represent the graph edge symmetrically.
Reference: Boltzmann Machines have symmetric connections, so their graph representation is undirected.

</details>

<details>
<summary><strong>Q4.</strong> How do you use an energy-based model to rank configurations?</summary>

Use it:
Step 1: Compute or compare the energy $E$ of each configuration.
Step 2: Lower energy means higher probability.
Step 3: Higher energy means lower probability.
Reference: Boltzmann/Gibbs form: $p(v,h)=\frac{1}{Z}\exp(-E(v,h)/T)$.

</details>

<details>
<summary><strong>Q5.</strong> What makes a Boltzmann Machine generative?</summary>

Use it:
Step 1: Learn a probability distribution over configurations.
Step 2: Sample from that learned distribution.
Step 3: Interpret sampled visible states as generated data.
Reference: A generative model can generate new data by sampling from the distribution it has learned.

</details>

<details>
<summary><strong>Q6.</strong> What is the connection between Hopfield Networks and Boltzmann Machines?</summary>

Use it:
Step 1: Recognise both as energy-based neural models.
Step 2: Treat Hopfield Networks as the precursor model in this lecture.
Step 3: Treat Boltzmann Machines as a stochastic generalisation.
Reference: The slides state that Boltzmann Machines can be considered generalisations of Hopfield Networks.

</details>

<details>
<summary><strong>Q7.</strong> Visible or hidden unit? What is the discriminator?</summary>

Use it:
Step 1: If the unit represents observed data, call it visible.
Step 2: If the unit is latent and helps explain structure, call it hidden.
Step 3: Keep both binary in the lecture setting.
Reference: Visible vector $v=(v_1,\dots,v_N)$; hidden vector $h=(h_1,\dots,h_M)$; usually $v_j,h_i\in\{0,1\}$.

</details>

<details>
<summary><strong>Q8.</strong> Why does the binary-unit assumption matter in RBM probability derivations?</summary>

Use it:
Step 1: When deriving a conditional for one unit, list its possible values.
Step 2: Because the unit is binary, only evaluate the cases 0 and 1.
Step 3: Normalise over those two unnormalised masses.
Reference: RBM visible and hidden units are typically binary: $v_j,h_i\in\{0,1\}$.

</details>

<details>
<summary><strong>Q9.</strong> Boltzmann Machine or Restricted Boltzmann Machine? What is the discriminator?</summary>

Use it:
Step 1: Check whether visible-visible or hidden-hidden edges exist.
Step 2: If general undirected connectivity is allowed, it is a standard Boltzmann Machine.
Step 3: If only visible-hidden edges exist, it is an RBM.
Reference: An RBM has visible-hidden connections but no hidden-hidden or visible-visible connections.

</details>

<details>
<summary><strong>Q10.</strong> How do you write the Boltzmann/Gibbs joint probability model?</summary>

Use it:
Step 1: Identify the visible vector $v$, hidden vector $h$, energy $E(v,h)$, temperature $T$, and partition function $Z$.
Step 2: Put the negative energy in the exponential.
Step 3: Divide by $Z$ to normalise.
Reference: $p(v,h)=\frac{1}{Z}\exp(-E(v,h)/T)$.

</details>

<details>
<summary><strong>Q11.</strong> Given two configurations, which one is more probable under a Boltzmann model?</summary>

Use it:
Step 1: Compare their energies.
Step 2: The configuration with smaller $E$ has larger $\exp(-E/T)$.
Step 3: Since both are divided by the same $Z$, smaller energy means higher probability.
Reference: $p(v,h)\propto\exp(-E(v,h)/T)$.

</details>

<details>
<summary><strong>Q12.</strong> Why are all Boltzmann Machine states assigned positive probability?</summary>

Use it:
Step 1: Look at the unnormalised factor $\exp(-E/T)$.
Step 2: An exponential is always positive.
Step 3: Dividing by positive $Z$ preserves positivity.
Reference: The slides emphasise $p(v,h)>0$ for all states.

</details>

<details>
<summary><strong>Q13.</strong> What does the partition function do?</summary>

Use it:
Step 1: Compute the unnormalised probability mass for every possible state.
Step 2: Sum those masses to get $Z$.
Step 3: Divide each mass by $Z$, making all probabilities sum to 1.
Reference: For an RBM, $Z=\sum_v\sum_h \exp(-E(v,h)/T)$.

</details>

<details>
<summary><strong>Q14.</strong> How do you connect the machine-learning Boltzmann distribution to statistical mechanics?</summary>

Use it:
Step 1: Treat a physical state $s_i$ as analogous to a machine configuration such as $(v,h)$.
Step 2: Treat energy as controlling probability in both cases.
Step 3: Use a partition function to normalise in both cases.
Reference: Statistical mechanics form: $p(s_i)=\frac{1}{Z}\exp(-E(s_i)/(\kappa_B T))$.

</details>

<details>
<summary><strong>Q15.</strong> Why can computing $Z$ be intractable?</summary>

Use it:
Step 1: Count the binary visible units $N$ and hidden units $M$.
Step 2: Each unit has two possible states.
Step 3: Direct $Z$ computation sums over $2^{N+M}$ configurations.
Reference: $Z=\sum_v\sum_h \exp(-E(v,h)/T)$.

</details>

<details>
<summary><strong>Q16.</strong> How do you state the probability constraints for a Boltzmann-style distribution?</summary>

Use it:
Step 1: Check every state has non-negative probability.
Step 2: Check the probabilities sum to one.
Step 3: Use $Z$ to enforce the second condition.
Reference: $p(s_i)\ge 0$ and $\sum_i p(s_i)=1$.

</details>

<details>
<summary><strong>Q17.</strong> How do you describe Boltzmann Machine training conceptually?</summary>

Use it:
Step 1: Clamp visible units to data patterns.
Step 2: Adjust parameters so data configurations move to lower energy.
Step 3: Push non-data or less likely configurations toward higher energy.
Reference: Training maximises probability of input data, equivalently lowering its energy.

</details>

<details>
<summary><strong>Q18.</strong> What does clamping mean?</summary>

Use it:
Step 1: Choose the observed input pattern.
Step 2: Fix the visible units to those observed values.
Step 3: Let hidden units operate freely.
Reference: Clamping means visible units' states are fixed to specific input data during training.

</details>

<details>
<summary><strong>Q19.</strong> What role do hidden units play in a Boltzmann Machine?</summary>

Use it:
Step 1: Treat hidden units as latent variables.
Step 2: Let them capture structure not directly observed in the visible vector.
Step 3: Use them to model higher-order correlations among visible patterns.
Reference: Hidden units help learn distributed representations and underlying constraints in the input data.

</details>

<details>
<summary><strong>Q20.</strong> Why is Boltzmann Machine learning described as unsupervised?</summary>

Use it:
Step 1: Notice that the model learns from input patterns, not labelled targets.
Step 2: Model the distribution over visible and hidden variables.
Step 3: Learn representations/features from the data structure.
Reference: The goal is modelling a joint distribution $p(v,h)$.

</details>

<details>
<summary><strong>Q21.</strong> How do you use a trained Boltzmann Machine for sampling?</summary>

Use it:
Step 1: Train the model so likely data-like configurations have low energy.
Step 2: Sample states from the learned probability distribution.
Step 3: Read the sampled visible state as generated data.
Reference: Sampling is listed as a use of Boltzmann Machines for generating new data.

</details>

<details>
<summary><strong>Q22.</strong> How do you use Boltzmann Machines for feature learning or dimensionality reduction?</summary>

Use it:
Step 1: Present high-dimensional visible data.
Step 2: Use hidden units to capture latent structure.
Step 3: Use the hidden representation as lower-dimensional features or preprocessing.
Reference: Boltzmann Machines can learn lower-dimensional representations of images/text-like data.

</details>

<details>
<summary><strong>Q23.</strong> How do you use energy for anomaly detection?</summary>

Use it:
Step 1: Train the model on normal data.
Step 2: Compute energy or probability for a candidate pattern.
Step 3: Flag high-energy/low-probability patterns as anomalous.
Reference: Normal data should have relatively low energy; rare/unexpected data should have high energy.

</details>

<details>
<summary><strong>Q24.</strong> How do you use a Boltzmann Machine for pattern completion?</summary>

Use it:
Step 1: Clamp the observed part of a visible vector.
Step 2: Let the network infer or sample the remaining visible units.
Step 3: Read the unclamped visible values as the completed pattern.
Reference: Pattern completion clamps part of the information and completes the remaining visible units.

</details>

<details>
<summary><strong>Q25.</strong> What are the main limitations of standard Boltzmann Machines?</summary>

Use it:
Step 1: Check whether sampling must reach equilibrium.
Step 2: Check whether training scales badly with network size/connection strength.
Step 3: Check whether exact inference and gradients are intractable.
Step 4: Check sensitivity to learning rate, initialisation, and hidden-unit count.
Reference: The lecture lists extreme computational cost, slow training, intractable inference, scaling difficulty, and hyperparameter sensitivity.

</details>

<details>
<summary><strong>Q26.</strong> How do you recognise an RBM?</summary>

Use it:
Step 1: Look for a visible layer and a hidden layer.
Step 2: Check that units are stochastic and interactions are undirected.
Step 3: Confirm there are no within-layer edges.
Reference: An RBM is a network of stochastic units with undirected interactions between pairs of visible and hidden units.

</details>

<details>
<summary><strong>Q27.</strong> How do you interpret an RBM weight $W_{ji}$?</summary>

Use it:
Step 1: Identify visible unit $v_j$.
Step 2: Identify hidden unit $h_i$.
Step 3: Read $W_{ji}$ as the strength of their visible-hidden interaction.
Reference: $W=(w_{j,i})\in\mathbb{R}^{N\times M}$, where $w_{j,i}=w(v_j,h_i)$.

</details>

<details>
<summary><strong>Q28.</strong> How do you check the RBM restricted-connectivity rule?</summary>

Use it:
Step 1: For every hidden unit $h_i$, allow edges to visible units $v_j$.
Step 2: Reject any hidden-hidden edge $h_i\leftrightarrow h_k$.
Step 3: Reject any visible-visible edge $v_j\leftrightarrow v_\ell$.
Reference: RBMs have all visible-hidden connections but no hidden-hidden and no visible-visible connections.

</details>

<details>
<summary><strong>Q29.</strong> Why do RBM conditionals factorise?</summary>

Use it:
Step 1: Condition on one whole layer.
Step 2: The units in the other layer have no direct edges among themselves.
Step 3: Therefore their conditional distribution factorises into single-unit terms.
Reference: $p(h\mid v)=\prod_i p(h_i\mid v)$ and $p(v\mid h)=\prod_j p(v_j\mid h)$.

</details>

<details>
<summary><strong>Q30.</strong> How do you write the RBM joint probability model?</summary>

Use it:
Step 1: Use the same Boltzmann/Gibbs probability form as the general BM.
Step 2: Substitute the RBM energy function.
Step 3: Divide by the RBM partition function.
Reference: $p(v,h)=\frac{1}{Z}\exp(-E(v,h)/T)$.

</details>

<details>
<summary><strong>Q31.</strong> How do you write the RBM energy in vector form?</summary>

Use it:
Step 1: Add the visible coefficient term $-a^\top v$.
Step 2: Add the hidden coefficient term $-b^\top h$.
Step 3: Add the visible-hidden interaction term $-v^\top W h$.
Reference: $E(v,h)=-a^\top v-b^\top h-v^\top W h$.

</details>

<details>
<summary><strong>Q32.</strong> How do you expand the RBM energy function into sums?</summary>

Use it:
Step 1: Expand the visible coefficient term over $j=1,\dots,N$.
Step 2: Expand the hidden coefficient term over $i=1,\dots,M$.
Step 3: Expand the visible-hidden interaction over all $(j,i)$ pairs.
Reference: $E(v,h)=-\sum_j a_jv_j-\sum_i b_ih_i-\sum_i\sum_j v_jw_{j,i}h_i$.

</details>

<details>
<summary><strong>Q33.</strong> In the expanded RBM energy, which term is which?</summary>

Use it:
Step 1: Terms with only $v_j$ are visible coefficient contributions.
Step 2: Terms with only $h_i$ are hidden coefficient contributions.
Step 3: Terms containing $v_jW_{ji}h_i$ are visible-hidden interactions.
Reference: $-\sum_j a_jv_j$, $-\sum_i b_ih_i$, and $-\sum_i\sum_j v_jw_{j,i}h_i$.

</details>

<details>
<summary><strong>Q34.</strong> How do you write the RBM partition function without confusing it with index summation?</summary>

Use it:
Step 1: Sum over every possible visible vector $v$.
Step 2: For each $v$, sum over every possible hidden vector $h$.
Step 3: Add the unnormalised masses $\exp(-E(v,h)/T)$.
Reference: $Z=\sum_v\sum_h\exp(-E(v,h)/T)$, not just a sum over one visible index and one hidden index.

</details>

<details>
<summary><strong>Q35.</strong> What does “ignoring first-degree terms” mean in the RBM energy/partition expression?</summary>

Use it:
Step 1: Identify the first-degree visible term $-a^\top v$.
Step 2: Identify the first-degree hidden term $-b^\top h$.
Step 3: Omit those terms and keep only the visible-hidden interaction part.
Reference: The interaction-only part is based on $-\sum_i\sum_j v_jw_{j,i}h_i$.

</details>

<details>
<summary><strong>Q36.</strong> Conditioning on visible units: how do you compute all hidden-unit probabilities in an RBM?</summary>

Use it:
Step 1: Condition on the whole visible vector $v$.
Step 2: For each hidden unit $h_i$, compute its own local field.
Step 3: Multiply the single-unit conditional probabilities if you need $p(h\mid v)$.
Reference: $p(h\mid v)=\prod_i p(h_i\mid v)$.

</details>

<details>
<summary><strong>Q37.</strong> How do you compute $p(h_i=1\mid v)$ in an RBM?</summary>

Use it:
Step 1: Because you condition on visible units, use hidden bias $b_i$.
Step 2: Add inputs from visible units: $\sum_j v_jW_{ji}$.
Step 3: Apply the sigmoid to the local field.
Reference: $p(h_i=1\mid v)=\sigma(b_i+\sum_j v_jW_{ji})$.

</details>

<details>
<summary><strong>Q38.</strong> How do you compute $p(v_j=1\mid h)$ in an RBM?</summary>

Use it:
Step 1: Because you condition on hidden units, use visible bias $a_j$.
Step 2: Add inputs from hidden units: $\sum_i W_{ji}h_i$.
Step 3: Apply the sigmoid to the local field.
Reference: $p(v_j=1\mid h)=\sigma(a_j+\sum_i W_{ji}h_i)$.

</details>

<details>
<summary><strong>Q39.</strong> Hidden conditional or visible conditional? Which bias do you use?</summary>

Use it:
Step 1: If predicting $h_i$ from $v$, use hidden bias $b_i$.
Step 2: If predicting $v_j$ from $h$, use visible bias $a_j$.
Step 3: In both cases, add the weighted inputs from the opposite layer and apply $\sigma$.
Reference: $p(h_i=1\mid v)=\sigma(b_i+\sum_j v_jW_{ji})$; $p(v_j=1\mid h)=\sigma(a_j+\sum_i W_{ji}h_i)$.

</details>

<details>
<summary><strong>Q40.</strong> How do you recognise and use the logistic/sigmoid function?</summary>

Use it:
Step 1: Put the scalar input in the form $x$.
Step 2: Compute $1/(1+\exp(-x))$.
Step 3: Interpret the result as a probability for a binary unit being 1.
Reference: $\sigma(x)=\frac{1}{1+\exp(-x)}$.

</details>

<details>
<summary><strong>Q41.</strong> How do you convert the exponential form of an RBM conditional into sigmoid notation?</summary>

Use it:
Step 1: Identify the local field $x$.
Step 2: Match the denominator form $1+\exp(-x)$.
Step 3: Replace $1/(1+\exp(-x))$ by $\sigma(x)$.
Reference: $\frac{1}{1+\exp(-b_i-\sum_jv_jW_{ji})}=\sigma(b_i+\sum_jv_jW_{ji})$.

</details>

<details>
<summary><strong>Q42.</strong> How do you start the derivation of $p(h_i=1\mid v)$?</summary>

Use it:
Step 1: Absorb $T$ into the parameters if the lecture permits it.
Step 2: Use $p(h\mid v)=p(h,v)/p(v)$.
Step 3: Since $p(v)$ does not depend on $h$, write $p(h\mid v)\propto p(h,v)$.
Reference: After absorbing $T$, $p(h\mid v)\propto\exp(a^\top v+b^\top h+v^\top Wh)$.

</details>

<details>
<summary><strong>Q43.</strong> When deriving $p(h_i\mid v)$, which terms can be dropped?</summary>

Use it:
Step 1: Fix the target hidden unit $h_i$.
Step 2: Keep only exponent terms containing $h_i$.
Step 3: Put all terms not depending on $h_i$ into the proportionality/normalisation constant.
Reference: The remaining terms are $b_ih_i+\sum_j v_jW_{ji}h_i$.

</details>

<details>
<summary><strong>Q44.</strong> How do you reduce the $p(h_i\mid v)$ derivation to a one-variable binary normalisation?</summary>

Use it:
Step 1: Factor out $h_i$.
Step 2: Define $x=b_i+\sum_j v_jW_{ji}$.
Step 3: Write $p(h_i\mid v)\propto\exp(h_ix)$.
Reference: This isolates the only part of the exponent that depends on $h_i$.

</details>

<details>
<summary><strong>Q45.</strong> How do you normalise $p(h_i\mid v)$ once $p(h_i\mid v)\propto\exp(h_ix)$?</summary>

Use it:
Step 1: Evaluate $h_i=0$: unnormalised mass $1$.
Step 2: Evaluate $h_i=1$: unnormalised mass $\exp(x)$.
Step 3: Divide the mass for $h_i=1$ by the total $1+\exp(x)$.
Reference: $p(h_i=1\mid v)=\frac{\exp(x)}{1+\exp(x)}=\frac{1}{1+\exp(-x)}=\sigma(x)$.

</details>

<details>
<summary><strong>Q46.</strong> What is the full exam-style derivation target for the RBM hidden conditional?</summary>

Use it:
Step 1: Start from $p(h\mid v)\propto\exp(a^\top v+b^\top h+v^\top Wh)$.
Step 2: For fixed $h_i$, drop terms independent of $h_i$.
Step 3: Let $x=b_i+\sum_jv_jW_{ji}$.
Step 4: Use binary masses $1$ and $\exp(x)$.
Step 5: Normalise and rewrite as a sigmoid.
Reference: $p(h_i=1\mid v)=\sigma(b_i+\sum_jv_jW_{ji})$.

</details>

<details>
<summary><strong>Q47.</strong> What is the practical difference between energy function and partition function?</summary>

Use it:
Step 1: Use the energy function to score one configuration.
Step 2: Use the partition function to sum scores over all configurations.
Step 3: Divide by the partition function to turn scores into probabilities.
Reference: Energy: $E(v,h)$; partition function: $Z=\sum_v\sum_h\exp(-E(v,h)/T)$.

</details>

<details>
<summary><strong>Q48.</strong> What does the RBM restriction buy you computationally?</summary>

Use it:
Step 1: Notice that there are no within-layer connections.
Step 2: Condition on one layer.
Step 3: Compute units in the other layer independently using sigmoid conditionals.
Reference: The restricted structure gives $p(h\mid v)=\prod_i p(h_i\mid v)$ and $p(v\mid h)=\prod_j p(v_j\mid h)$.

</details>

<details>
<summary><strong>Q49.</strong> How do you explain why standard Boltzmann Machines motivate RBMs?</summary>

Use it:
Step 1: State that standard BMs are computationally expensive and slow to train.
Step 2: State that exact inference/learning gradients are difficult.
Step 3: State that RBMs restrict connectivity to make useful conditional calculations easier.
Reference: RBMs are motivated by the limitations of standard Boltzmann Machines.

</details>

<details>
<summary><strong>Q50.</strong> How do you identify an RBM application from the lecture list?</summary>

Use it:
Step 1: Ask whether the task involves learning latent features or a probability distribution over inputs.
Step 2: Match to the listed cases: collaborative filtering, dimensionality reduction, or feature learning.
Step 3: Do not assume algorithms beyond what the lecture defines.
Reference: The slides list collaborative filtering, dimensionality reduction, and feature learning as RBM applications.

</details>

<details>
<summary><strong>Q51.</strong> Sampling, anomaly detection, or completion? What is the discriminator?</summary>

Use it:
Step 1: If generating a new visible pattern, call it sampling.
Step 2: If scoring a pattern as rare/unexpected, call it anomaly detection.
Step 3: If fixing part of a vector and filling the rest, call it pattern completion/reconstruction.
Reference: The lecture lists sampling, feature learning, anomaly detection, pattern completion, and image reconstruction as BM uses.

</details>

<details>
<summary><strong>Q52.</strong> What should you say about contrastive divergence from this sheet alone?</summary>

Use it:
Step 1: Mention it only as a training method associated with efficient RBM training.
Step 2: Do not derive its update rule from this sheet.
Step 3: Flag that the slides mention it but do not define or derive it.
Reference: The notes mark contrastive divergence as [UNCLEAR] because it is mentioned but not explained in the slides.

</details>

<details>
<summary><strong>Q53.</strong> How do you handle a question asking for the RBM visible-hidden interaction term only?</summary>

Use it:
Step 1: Start from full energy $-a^\top v-b^\top h-v^\top Wh$.
Step 2: Remove the first-degree visible and hidden terms.
Step 3: Keep only $-v^\top Wh$, or expanded $-\sum_i\sum_j v_jW_{ji}h_i$.
Reference: The visible-hidden interaction contribution is $-\sum_i\sum_j v_jw_{j,i}h_i$.

</details>

<details>
<summary><strong>Q54.</strong> How do you state the RBM conditional probabilities in non-sigmoid exponential form?</summary>

Use it:
Step 1: For $h_i$, place $-b_i-\sum_jv_jW_{ji}$ inside the exponential denominator.
Step 2: For $v_j$, place $-a_j-\sum_iW_{ji}h_i$ inside the exponential denominator.
Step 3: Use the form $1/(1+\exp(\cdot))$.
Reference: $p(h_i=1\mid v)=\frac{1}{1+\exp(-b_i-\sum_jv_jW_{ji})}$; $p(v_j=1\mid h)=\frac{1}{1+\exp(-a_j-\sum_iW_{ji}h_i)}$.

</details>

<details>
<summary><strong>Q55.</strong> How do you decide whether a state should be pushed down or up in the energy landscape during training?</summary>

Use it:
Step 1: If the state is a target/data pattern, push its energy down.
Step 2: If the state is a non-data or less likely pattern, push its energy up.
Step 3: Interpret lower energy as higher learned probability.
Reference: Training minimises energy of target patterns and maximises energy of other patterns.

</details>

<details>
<summary><strong>Q56.</strong> What is the safest way to explain the partition-function notation $\sum_{i,j}$ from the slides?</summary>

Use it:
Step 1: Do not read it as only summing one visible index and one hidden index.
Step 2: Interpret it as summing over all configurations of $v$ and $h$.
Step 3: Rewrite explicitly as $\sum_v\sum_h$.
Reference: The notes mark $\sum_{i,j}$ as potentially confusing notation for the partition function.

</details>

<details>
<summary><strong>Q57.</strong> What are the high-yield RBM probability calculations from this lecture?</summary>

Use it:
Step 1: Know the factorisations $p(h\mid v)$ and $p(v\mid h)$.
Step 2: Compute $p(h_i=1\mid v)$ using hidden bias plus visible inputs.
Step 3: Compute $p(v_j=1\mid h)$ using visible bias plus hidden inputs.
Step 4: Be able to derive the hidden conditional by proportionality and binary normalisation.
Reference: The ILO explicitly mentions RBM probability and conditional probability calculations.

</details>
