---
subject: "Self Learning"
chapter: 3
title: "Deep Q-Networks (DQN)"
language: en
---

# Deep Q-Networks (DQN)

## Topic and scope

These notes explain **Deep Q-Networks (DQN)** as the deep-learning extension of tabular Q-learning. The reader is assumed to already understand tabular Q-learning, Bellman optimality, the Q-update, TD error, $\epsilon$-greedy exploration, off-policy learning, the deadly triad, and maximization bias.

The goal is to show how DQN replaces a Q-table with a neural network, why this creates instability, and how the main DQN design choices make approximate Q-learning usable in large state spaces.

---

# Part 1 — Motivation: why tabular fails

## 1.1 The core tabular assumption

Tabular Q-learning stores one value for every state-action pair:

$$
Q : \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}
$$

Plain English: the Q-table is a lookup function that maps each possible state-action pair to a scalar estimate of long-term return.

This works when the state space $\mathcal{S}$ and action space $\mathcal{A}$ are small enough that the agent can repeatedly visit the same state-action pairs.

For example, in a tiny gridworld, the agent may revisit the same exact cell many times. The table entry for that cell-action pair can be refined through repeated experience.

But in realistic environments, this assumption collapses.

---

## 1.2 The “never revisit the exact same state” problem

In large or continuous state spaces, the probability of seeing the exact same state twice can be extremely small.

For example, in Atari from pixels, a state may be represented by raw image frames. Even tiny changes in object position, score display, animation, or timing produce a different state representation.

If the state is continuous, the problem is even sharper. A robot arm state might include joint angles, velocities, object positions, camera features, and contact forces. Two states may be semantically similar but numerically different.

A tabular method treats these as unrelated entries.

That means tabular Q-learning cannot easily transfer knowledge from one state to a nearby or similar state.

---

## 1.3 Infeasible table size

The tabular representation requires storing a separate value for every state-action pair.

If the number of states is $|\mathcal{S}|$ and the number of actions is $|\mathcal{A}|$, the table contains:

$$
|\mathcal{S}| \cdot |\mathcal{A}|
$$

Plain English: the number of Q-values grows as the number of states times the number of actions.

This is manageable for small environments. It becomes impossible when $|\mathcal{S}|$ is enormous, combinatorial, or continuous.

For image-based input, the number of possible states is astronomically large. Even a small grayscale image has a huge number of possible pixel configurations.

So the problem is not merely storage. It is also learning. The agent cannot collect enough experience to estimate each table entry independently.

---

## 1.4 Function approximation

The key move in DQN is to replace the table with a **function approximator**.

Instead of storing one value per state-action pair, we learn a parametrized function:

$$
Q(s, a; \theta) \approx Q^*(s, a)
$$

Plain English: the neural network with parameters $\theta$ tries to approximate the optimal action-value function.

Here, $\theta$ represents the weights of a neural network.

In tabular Q-learning, the “parameters” are just the table entries themselves. In DQN, the parameters are shared across many states and actions.

This lets the agent generalize.

If two states are visually or structurally similar, the neural network may produce similar Q-values for them, even if one of those states has never been seen before.

---

## 1.5 Generalization across similar states

The core benefit of DQN is **generalization**.

A Q-table says:

> “I know this exact state-action pair because I have updated this exact table cell.”

A DQN says:

> “I have learned features that let me estimate the value of this state-action pair, even if I have not seen it exactly before.”

This is the deep RL version of supervised learning generalization. Neural networks learn representations that map high-dimensional observations to useful predictions.

In DQN, the prediction target is not a class label or regression label from a static dataset. It is a bootstrapped estimate of long-term return.

That difference is what makes DQN powerful but unstable.

---

# Part 2 — The DQN formulation

## 2.1 From Q-table to Q-network

In DQN, we approximate the Q-function using a neural network.

The network receives the state as input and outputs one Q-value for each discrete action.

For a discrete action space with actions $\{a_1, a_2, \dots, a_m\}$, the network outputs:

$$
Q(s, \cdot; \theta) =
\begin{bmatrix}
Q(s, a_1; \theta) \\
Q(s, a_2; \theta) \\
\vdots \\
Q(s, a_m; \theta)
\end{bmatrix}
$$

Plain English: for a single input state, the network produces a vector containing the estimated value of every possible action.

This architecture is efficient because one forward pass gives all action values.

Then the greedy action is selected by:

$$
a^* = \arg\max_a Q(s, a; \theta)
$$

Plain English: the agent chooses the action whose predicted Q-value is largest.

This is different from using a network that takes both state and action as input and returns a single scalar. That alternative would require one forward pass per action to choose the maximum. DQN avoids that cost when the action space is discrete and not too large.

---

## 2.2 DQN as supervised regression to TD targets

DQN turns Q-learning into a sequence of regression problems.

For a transition $(s, a, r, s')$, the network prediction is:

$$
Q(s, a; \theta)
$$

Plain English: this is the current network’s estimate of the value of taking action $a$ in state $s$.

The target is:

$$
y = r + \gamma \max_{a'} Q(s', a'; \theta^-)
$$

Plain English: the target says that the value of the current action should equal the immediate reward plus the discounted estimated value of the best next action.

Here, $\theta^-$ denotes the parameters of a separate **target network**. This target network is discussed in detail later.

The DQN loss is:

$$
L(\theta) = \mathbb{E}_{(s,a,r,s') \sim \mathcal{D}}
\left[
\left(
y - Q(s,a;\theta)
\right)^2
\right]
$$

Plain English: DQN trains the online Q-network by minimizing the squared difference between its current prediction and a bootstrapped TD target sampled from the replay buffer $\mathcal{D}$.

For a minibatch of $B$ transitions, the empirical loss is usually written as:

$$
L(\theta) =
\frac{1}{B}
\sum_{i=1}^{B}
\left(
y_i - Q(s_i,a_i;\theta)
\right)^2
$$

Plain English: in practice, DQN averages the squared TD errors across a minibatch of sampled transitions.

For terminal next states, the target removes the future-value term:

$$
y =
r
$$

Plain English: if the episode ends after this transition, there is no next-state value to bootstrap from, so the target is just the immediate reward.

More generally, with a terminal indicator $d \in \{0,1\}$, the target can be written as:

$$
y = r + \gamma (1-d) \max_{a'} Q(s', a'; \theta^-)
$$

Plain English: the future-value term is kept for non-terminal transitions and removed for terminal transitions.

---

## 2.3 TD error in DQN

The DQN TD error is:

$$
\delta =
y - Q(s,a;\theta)
$$

Plain English: the TD error measures how far the current network prediction is from the bootstrapped target.

Using the target definition, this becomes:

$$
\delta =
r + \gamma \max_{a'} Q(s', a'; \theta^-)
-
Q(s,a;\theta)
$$

Plain English: the TD error compares the current Q-value estimate to the reward plus the discounted best next-state value estimated by the target network.

This is the deep-learning analogue of the tabular Q-learning TD error.

The difference is that changing $\theta$ affects the predictions for many states at once. A gradient update on one transition can change Q-values for many other transitions because the network parameters are shared.

That parameter sharing is both the point and the danger.

---

## 2.4 The semi-gradient idea

DQN uses a **semi-gradient** update.

The loss is:

$$
L(\theta) =
\left(
y - Q(s,a;\theta)
\right)^2
$$

Plain English: the online network is trained to move its current prediction closer to the target.

But the target itself contains a Q-value:

$$
y = r + \gamma \max_{a'} Q(s', a'; \theta^-)
$$

Plain English: the target is built using another Q-network estimate, rather than a fixed ground-truth label.

In the gradient step, DQN treats $y$ as a constant with respect to $\theta$.

The gradient is therefore:

$$
\nabla_\theta L(\theta)
=
-2
\left(
y - Q(s,a;\theta)
\right)
\nabla_\theta Q(s,a;\theta)
$$

Plain English: the update changes the online network prediction $Q(s,a;\theta)$, but it does not backpropagate through the target $y$.

This is called a semi-gradient because the target depends on learned estimates, but the gradient ignores that dependence.

The practical reason is stability. If the network tried to differentiate through both the prediction and the bootstrapped target, it would be chasing a target that moves directly with the same parameters being updated.

DQN avoids this by using a target network $\theta^-$ and by stopping gradients through the target.

---

## 2.5 Why the target is not a normal supervised label

In standard supervised learning, the target label is fixed. For example, an image label “cat” does not change because the classifier weights changed.

In DQN, the target is generated by the agent’s own current or recent value estimates.

That makes DQN a form of bootstrapped regression.

The Bellman optimality equation says:

$$
Q^*(s,a)
=
\mathbb{E}
\left[
r + \gamma \max_{a'} Q^*(s',a')
\mid s,a
\right]
$$

Plain English: the optimal value of taking action $a$ in state $s$ equals the expected immediate reward plus the discounted value of the best action in the next state.

DQN tries to make the neural network approximately satisfy this fixed-point equation.

The problem is that the network is learning from targets that are themselves approximate, noisy, and changing.

This is the central instability problem of deep Q-learning.

---

# Part 3 — The two key stabilizers

DQN became practical because of two main stabilizers:

1. **Experience replay**
2. **Target networks**

Both are designed to reduce instability caused by combining function approximation, bootstrapping, and off-policy learning.

That combination is the **deadly triad**.

---

## 3.1 Experience replay

### What experience replay is

**Experience replay** stores transitions in a replay buffer.

A transition usually has the form:

$$
(s_t, a_t, r_t, s_{t+1}, d_t)
$$

Plain English: one replay item records the current state, the action taken, the reward received, the next state, and whether the episode ended.

The replay buffer is a dataset of recent experience:

$$
\mathcal{D} =
\left\{
(s_i, a_i, r_i, s'_i, d_i)
\right\}_{i=1}^{N}
$$

Plain English: the replay buffer stores many previously observed transitions that can be reused for training.

During learning, DQN samples random minibatches from $\mathcal{D}$ rather than training only on the most recent transition.

---

## 3.2 Problem 1 solved by replay: temporal correlation

Sequential RL data is highly correlated.

If the agent is moving through a game, consecutive frames usually look similar. Consecutive transitions may come from the same local region of the state space and reflect the same short-term behavior.

Training a neural network on strongly correlated samples can cause unstable updates. The network may overfit to the most recent trajectory and forget or distort values elsewhere.

Random minibatch sampling from replay reduces this correlation.

Instead of training on:

$$
(s_t, a_t, r_t, s_{t+1}),
(s_{t+1}, a_{t+1}, r_{t+1}, s_{t+2}),
(s_{t+2}, a_{t+2}, r_{t+2}, s_{t+3})
$$

Plain English: this sequence shows consecutive transitions from the same trajectory, which are likely to be strongly correlated.

DQN trains on randomly sampled transitions:

$$
(s_i, a_i, r_i, s'_i),
(s_j, a_j, r_j, s'_j),
(s_k, a_k, r_k, s'_k)
$$

Plain English: this minibatch contains transitions from different times, which makes the training data look more like an ordinary shuffled supervised-learning dataset.

Replay therefore makes SGD behave more like supervised learning on an empirical dataset.

It does not make samples truly independent, but it reduces the worst temporal dependence.

---

## 3.3 Problem 2 solved by replay: data efficiency

RL interaction is expensive. The agent may need many environment steps to observe useful rewards.

Without replay, each transition would be used once and then discarded.

With replay, the same transition can contribute to many gradient updates.

This improves **data efficiency**.

A replay buffer also lets rare but important transitions remain available for learning, at least until they are overwritten.

For example, if a reward is sparse, replay allows the agent to train multiple times on the few transitions near reward events.

---

## 3.4 Replay buffer size tradeoff

The replay buffer size matters.

A small replay buffer contains recent behavior but may be highly correlated and forget older experience quickly.

A large replay buffer decorrelates samples better and preserves more diverse experience, but it may contain outdated data from policies very different from the current one.

This matters because DQN is off-policy: it can learn from transitions generated by older behavior policies. But extremely stale data can still slow adaptation.

The replay distribution is not the same as the current policy’s state distribution. DQN accepts this because Q-learning is off-policy, but the mismatch can still affect learning dynamics.

---

## 3.5 Target networks

### The moving-target problem

If the same network is used to predict both sides of the TD target, the target changes every time the network changes.

The naive target would be:

$$
y = r + \gamma \max_{a'} Q(s', a'; \theta)
$$

Plain English: this target uses the same online network parameters $\theta$ that are being updated by the loss.

The prediction is:

$$
Q(s,a;\theta)
$$

Plain English: this is also produced by the same network being updated.

So after every gradient step, both the prediction and the target may shift. This creates a moving-target problem.

The network is trying to chase labels that it creates for itself.

---

## 3.6 The target network solution

DQN uses a separate target network with parameters $\theta^-$.

The target becomes:

$$
y = r + \gamma \max_{a'} Q(s', a'; \theta^-)
$$

Plain English: the bootstrapped target is computed using a delayed copy of the online network, making the target more stable during several gradient updates.

The online network parameters $\theta$ are updated frequently by gradient descent.

The target network parameters $\theta^-$ are updated more slowly.

A hard target update copies the online network into the target network every $C$ steps:

$$
\theta^- \leftarrow \theta
$$

Plain English: every fixed number of training steps, the target network is reset to match the latest online network.

A soft target update instead performs a slow moving average:

$$
\theta^- \leftarrow \tau \theta + (1-\tau)\theta^-
$$

Plain English: the target network is nudged slightly toward the online network at each update, where $\tau$ controls how fast it tracks the online network.

Hard updates were used in the original DQN style. Soft updates are common in later deep RL algorithms.

---

## 3.7 Why freezing the target helps

Freezing the target network temporarily makes the learning problem closer to supervised regression.

For several updates, the target values are approximately fixed.

The online network can move toward those targets without the targets immediately moving away.

This does not eliminate instability, because the targets are still bootstrapped and approximate. But it slows down the feedback loop.

The target network is basically a stabilizing lag.

---

## 3.8 DQN and the deadly triad

The **deadly triad** is the combination of:

1. Function approximation
2. Bootstrapping
3. Off-policy learning

DQN has all three.

### Function approximation

DQN uses a neural network:

$$
Q(s,a;\theta)
$$

Plain English: DQN represents the Q-function using shared neural network parameters instead of independent table entries.

This creates generalization but also introduces interference. Updating one state-action estimate can affect many others.

### Bootstrapping

DQN uses TD targets containing future value estimates:

$$
y = r + \gamma \max_{a'} Q(s',a';\theta^-)
$$

Plain English: DQN updates its estimate using another estimate, rather than waiting for a complete return.

This improves efficiency but can propagate errors.

### Off-policy learning

DQN learns the greedy target while collecting data with an exploratory behavior policy such as $\epsilon$-greedy.

The behavior policy is:

$$
a_t =
\begin{cases}
\text{random action}, & \text{with probability } \epsilon \\
\arg\max_a Q(s_t,a;\theta), & \text{with probability } 1-\epsilon
\end{cases}
$$

Plain English: the agent sometimes explores randomly and otherwise chooses the action currently estimated to be best.

The target, however, uses the greedy action value:

$$
\max_{a'} Q(s',a';\theta^-)
$$

Plain English: the update evaluates the best estimated next action, regardless of which action the behavior policy would actually take.

Experience replay makes the off-policy aspect stronger because data may come from many older behavior policies.

DQN mitigates the deadly triad but does not remove it.

Experience replay reduces sample correlation and improves data reuse. Target networks reduce moving-target instability. Together they make deep Q-learning workable in many discrete-action domains.

But divergence, overestimation, instability, and sensitivity to hyperparameters can still happen.

---

# Part 4 — The algorithm

## 4.1 Full DQN training loop

A standard DQN training loop looks like this.

### Step 1 — Initialize networks

Initialize the online Q-network:

$$
Q(s,a;\theta)
$$

Plain English: this is the network that will be trained by gradient descent.

Initialize the target Q-network:

$$
Q(s,a;\theta^-)
$$

Plain English: this is a delayed copy used to compute more stable TD targets.

Usually the target parameters are initialized as:

$$
\theta^- \leftarrow \theta
$$

Plain English: at the start of training, the target network is copied from the online network.

---

### Step 2 — Initialize replay buffer

Create an empty replay buffer:

$$
\mathcal{D} \leftarrow \emptyset
$$

Plain English: the agent starts with no stored transitions and fills the buffer through environment interaction.

---

### Step 3 — Interact with the environment

At time $t$, observe state $s_t$.

Choose an action using $\epsilon$-greedy:

$$
a_t =
\begin{cases}
\text{random action}, & \text{with probability } \epsilon \\
\arg\max_a Q(s_t,a;\theta), & \text{with probability } 1-\epsilon
\end{cases}
$$

Plain English: the agent explores randomly some of the time and otherwise exploits the current Q-network.

Execute $a_t$ and observe reward $r_t$, next state $s_{t+1}$, and done flag $d_t$.

---

### Step 4 — Store transition

Store the transition in replay:

$$
\mathcal{D}
\leftarrow
\mathcal{D}
\cup
\{(s_t,a_t,r_t,s_{t+1},d_t)\}
$$

Plain English: the newly observed experience is added to the replay buffer so it can be reused for future training.

If the buffer is full, the oldest transition is usually removed.

---

### Step 5 — Sample a minibatch

Sample a random minibatch:

$$
\{(s_i,a_i,r_i,s'_i,d_i)\}_{i=1}^{B}
\sim
\mathcal{D}
$$

Plain English: the agent trains on a randomly selected batch of stored transitions.

---

### Step 6 — Compute TD targets

For each transition in the minibatch, compute:

$$
y_i =
r_i + \gamma (1-d_i)
\max_{a'} Q(s'_i,a';\theta^-)
$$

Plain English: each target equals the observed reward plus the discounted target-network estimate of the best next action, unless the transition was terminal.

---

### Step 7 — Compute loss

Compute the minibatch loss:

$$
L(\theta)
=
\frac{1}{B}
\sum_{i=1}^{B}
\left(
y_i - Q(s_i,a_i;\theta)
\right)^2
$$

Plain English: the online network is penalized when its prediction for the sampled action differs from the TD target.

Many implementations use the Huber loss instead of pure squared error:

$$
\mathcal{L}_\kappa(\delta)
=
\begin{cases}
\frac{1}{2}\delta^2, & |\delta| \leq \kappa \\
\kappa \left(|\delta| - \frac{1}{2}\kappa\right), & |\delta| > \kappa
\end{cases}
$$

Plain English: the Huber loss behaves like squared error for small TD errors but like absolute error for large TD errors, making training less sensitive to outliers.

The TD error in this expression is:

$$
\delta_i = y_i - Q(s_i,a_i;\theta)
$$

Plain English: the TD error is the difference between the bootstrapped target and the current online-network prediction.

---

### Step 8 — Take a gradient step

Update $\theta$ using gradient descent or an adaptive optimizer:

$$
\theta
\leftarrow
\theta
-
\alpha
\nabla_\theta L(\theta)
$$

Plain English: the online network parameters are changed in the direction that reduces the minibatch TD loss.

Here, $\alpha$ is the learning rate.

---

### Step 9 — Periodically update the target network

Every $C$ training steps, perform a hard update:

$$
\theta^- \leftarrow \theta
$$

Plain English: the target network is periodically refreshed to match the online network.

Alternatively, use a soft update:

$$
\theta^- \leftarrow \tau \theta + (1-\tau)\theta^-
$$

Plain English: the target network slowly tracks the online network instead of being copied abruptly.

---

### Step 10 — Repeat

Continue interaction, storage, sampling, learning, and target updates until training ends.

The key loop is:

1. Interact with the environment.
2. Store transitions.
3. Sample old transitions.
4. Build bootstrapped targets.
5. Update the online network.
6. Occasionally update the target network.

That is DQN in one sentence: off-policy Q-learning with a neural Q-function, replay buffer, and target network.

---

## 4.2 Compact pseudocode

1. Initialize online Q-network $Q(s,a;\theta)$.
2. Initialize target Q-network $Q(s,a;\theta^-)$ with $\theta^- \leftarrow \theta$.
3. Initialize replay buffer $\mathcal{D}$.
4. For each environment step:
   1. Select action $a_t$ using $\epsilon$-greedy from $Q(s_t,\cdot;\theta)$.
   2. Execute action and observe $(r_t, s_{t+1}, d_t)$.
   3. Store $(s_t,a_t,r_t,s_{t+1},d_t)$ in $\mathcal{D}$.
   4. Sample minibatch from $\mathcal{D}$.
   5. Compute targets using $Q(\cdot,\cdot;\theta^-)$.
   6. Minimize TD loss with respect to $\theta$.
   7. Every $C$ steps, copy $\theta$ into $\theta^-$.
   8. Anneal $\epsilon$ according to the exploration schedule.

---

## 4.3 Original Atari preprocessing details

The original Atari DQN setup used several important preprocessing choices.

### Frame preprocessing

Raw Atari frames were transformed before being passed to the network. Common steps included grayscale conversion, resizing, and cropping.

This reduced input dimensionality and removed some irrelevant visual detail.

### Frame stacking

DQN often receives a stack of recent frames rather than a single frame.

A stacked state can be written as:

$$
s_t =
(o_{t-k+1}, o_{t-k+2}, \dots, o_t)
$$

Plain English: the state is formed by concatenating the most recent $k$ observations, so the network can infer motion from frame differences.

This matters because a single image may not contain velocity information. For example, one frame of Pong shows where the ball is, but not where it is moving.

Frame stacking partially restores the Markov property when individual observations are insufficient.

### Reward clipping

Atari DQN commonly clipped rewards to a fixed range:

$$
r_t^{\text{clipped}}
=
\max(-1, \min(1, r_t))
$$

Plain English: rewards larger than $1$ are mapped to $1$, rewards smaller than $-1$ are mapped to $-1$, and rewards already between $-1$ and $1$ are unchanged.

Reward clipping stabilizes learning by keeping TD targets on a more consistent scale across games.

The downside is that it changes the reward structure. The agent no longer distinguishes between small and large positive rewards if both are clipped to $1$.

### Action repeat

Atari DQN also used repeated actions, sometimes called frame skipping.

The selected action is repeated for several frames. This reduces computation and can make control smoother.

### No-op starts

Some Atari training setups begin episodes with a random number of no-op actions.

This randomizes initial conditions and prevents the agent from overfitting to a fixed starting trajectory.

---

# Part 5 — The major variants

DQN is the base algorithm. Many later methods improve specific weaknesses.

The most important variants are:

1. **Double DQN**
2. **Dueling DQN**
3. **Prioritized Experience Replay**
4. **Rainbow**

---

## 5.1 Double DQN

### The problem: maximization bias

You already know maximization bias from tabular Q-learning.

The issue is that the max operator tends to overestimate values when estimates are noisy.

The standard DQN target is:

$$
y^{\text{DQN}}
=
r
+
\gamma
\max_{a'}
Q(s',a';\theta^-)
$$

Plain English: standard DQN uses the target network both to choose the best next action and to evaluate that action.

Even with a target network, the maximization operation can select actions whose values are overestimated due to noise.

The max over noisy estimates is biased upward because the action with the highest estimate may not be the truly best action; it may just have the largest positive error.

---

### Double DQN target

**Double DQN** decouples action selection from action evaluation.

The online network selects the next action:

$$
a^{\text{sel}}
=
\arg\max_{a'} Q(s',a';\theta)
$$

Plain English: the online network chooses which next action currently looks best.

The target network evaluates that selected action:

$$
y^{\text{Double DQN}}
=
r
+
\gamma
Q(s', a^{\text{sel}}; \theta^-)
$$

Plain English: the target network estimates the value of the action selected by the online network, reducing the upward bias caused by taking a max over the same noisy values used for evaluation.

Substituting the selected action gives:

$$
y^{\text{Double DQN}}
=
r
+
\gamma
Q
\left(
s',
\arg\max_{a'} Q(s',a';\theta);
\theta^-
\right)
$$

Plain English: the online network chooses the greedy action, while the target network supplies the value of that chosen action.

For terminal transitions, the usual done mask is included:

$$
y^{\text{Double DQN}}
=
r
+
\gamma(1-d)
Q
\left(
s',
\arg\max_{a'} Q(s',a';\theta);
\theta^-
\right)
$$

Plain English: the future-value term is removed when the next state is terminal.

Double DQN does not eliminate all estimation error. But it significantly reduces overoptimistic value estimates in many settings.

---

## 5.2 Dueling DQN

### Motivation

In many states, the value of the state is easier to estimate than the precise advantage of each action.

For example, in a driving environment, some states are obviously good or bad regardless of the exact steering action. If the car is safely centered in the lane, many small steering choices may be similarly valuable. If the car is already crashing, the state itself is bad.

**Dueling DQN** separates the estimate into two streams:

1. A state-value stream
2. An advantage stream

---

### Value and advantage decomposition

The decomposition is:

$$
Q(s,a)
=
V(s)
+
A(s,a)
$$

Plain English: the value of taking action $a$ in state $s$ is represented as the general value of the state plus the relative advantage of that action.

Here:

$$
V(s)
$$

Plain English: this estimates how good the state is overall, regardless of the specific action.

And:

$$
A(s,a)
$$

Plain English: this estimates how much better or worse action $a$ is compared with the other actions in that state.

---

### Identifiability problem

The naive decomposition is not unique.

For any constant $c$, we could write:

$$
Q(s,a)
=
\left(V(s)+c\right)
+
\left(A(s,a)-c\right)
$$

Plain English: adding a constant to the value stream and subtracting the same constant from the advantage stream leaves the final Q-value unchanged.

So Dueling DQN needs an aggregation rule that makes the decomposition identifiable.

A common aggregation is:

$$
Q(s,a;\theta,\alpha,\beta)
=
V(s;\theta,\beta)
+
\left(
A(s,a;\theta,\alpha)
-
\frac{1}{|\mathcal{A}|}
\sum_{a'} A(s,a';\theta,\alpha)
\right)
$$

Plain English: the Q-value is the state value plus the action advantage after subtracting the average advantage across actions.

This forces the advantages to be centered around zero for each state.

Another version subtracts the maximum advantage:

$$
Q(s,a;\theta,\alpha,\beta)
=
V(s;\theta,\beta)
+
\left(
A(s,a;\theta,\alpha)
-
\max_{a'} A(s,a';\theta,\alpha)
\right)
$$

Plain English: this version makes the best action’s adjusted advantage equal to zero, so the state value directly represents the value of the best action.

The mean-subtraction version is commonly preferred because it tends to be smoother for optimization.

---

### Why Dueling DQN helps

Dueling DQN helps most when many actions have similar effects in a state.

The value stream can learn state quality even when action-specific differences are noisy or small.

This can improve sample efficiency because the network does not need to relearn the state’s general value separately for every action.

---

## 5.3 Prioritized Experience Replay

### Motivation

Uniform replay samples transitions randomly.

But not all transitions are equally informative.

Some transitions have large TD errors, meaning the network is currently surprised by them. These transitions may be especially useful for learning.

**Prioritized Experience Replay** samples transitions with probability related to their TD-error magnitude.

---

### Priority from TD error

A common priority is:

$$
p_i = |\delta_i| + \varepsilon
$$

Plain English: a transition receives high priority if its absolute TD error is large, with a small positive constant $\varepsilon$ ensuring every transition has nonzero priority.

The sampling probability is:

$$
P(i)
=
\frac{p_i^\alpha}
{\sum_k p_k^\alpha}
$$

Plain English: transition $i$ is sampled with probability proportional to its priority raised to the power $\alpha$.

The exponent $\alpha$ controls how strongly prioritization is used.

If $\alpha = 0$, sampling becomes uniform:

$$
P(i)
=
\frac{1}{N}
$$

Plain English: when $\alpha$ is zero, all transitions have equal probability regardless of TD error.

If $\alpha$ is larger, high-priority transitions are sampled more often.

---

### Bias-correction issue

Prioritized replay changes the training distribution.

Uniform replay estimates an average loss over the replay buffer. Prioritized replay over-samples high-error transitions, which introduces bias.

To correct this, importance-sampling weights are used:

$$
w_i =
\left(
\frac{1}{N}
\cdot
\frac{1}{P(i)}
\right)^\beta
$$

Plain English: transitions that are sampled more often than they would be under uniform sampling receive lower weight in the loss.

The weights are often normalized:

$$
\tilde{w}_i =
\frac{w_i}{\max_j w_j}
$$

Plain English: normalization keeps the largest importance weight equal to one, improving numerical stability.

The weighted loss becomes:

$$
L(\theta)
=
\frac{1}{B}
\sum_{i=1}^{B}
\tilde{w}_i
\left(
y_i - Q(s_i,a_i;\theta)
\right)^2
$$

Plain English: each transition’s squared TD error is scaled by an importance weight to reduce the sampling bias introduced by prioritization.

The exponent $\beta$ controls how much correction is applied. It is often annealed toward $1$ during training.

---

### Why large TD error is useful but imperfect

Large TD error can mean a transition is informative.

But it can also mean the transition is noisy, stochastic, or an outlier.

So prioritized replay can over-focus on noisy transitions if used carelessly.

That is why priority smoothing, importance weights, and minimum sampling probability matter.

---

## 5.4 Rainbow

**Rainbow** is not one single trick. It is a combined DQN agent that integrates multiple improvements.

The major components include:

1. Double DQN
2. Dueling networks
3. Prioritized replay
4. Multi-step returns
5. Distributional RL
6. Noisy networks for exploration

The point of Rainbow is that many DQN improvements are complementary.

Double DQN attacks overestimation bias.

Dueling networks improve value representation.

Prioritized replay improves sample selection.

Multi-step returns improve credit assignment.

Distributional RL predicts a return distribution instead of only an expected return.

Noisy networks replace or supplement simple $\epsilon$-greedy exploration with learned parameter noise.

---

## 5.5 Multi-step returns

Although not always introduced in basic DQN, multi-step returns are important in later variants.

A one-step DQN target is:

$$
y_t =
r_t
+
\gamma
\max_a Q(s_{t+1},a;\theta^-)
$$

Plain English: the target uses one observed reward and then bootstraps from the next state.

An $n$-step target is:

$$
y_t^{(n)}
=
r_t
+
\gamma r_{t+1}
+
\gamma^2 r_{t+2}
+
\cdots
+
\gamma^{n-1} r_{t+n-1}
+
\gamma^n
\max_a Q(s_{t+n},a;\theta^-)
$$

Plain English: the target uses several real rewards before bootstrapping from a later state.

Multi-step returns can propagate reward information faster, especially in sparse-reward settings.

The tradeoff is that they may introduce more variance and require careful handling with replay.

---

## 5.6 Distributional DQN idea

Standard DQN estimates the expected return:

$$
Q(s,a)
=
\mathbb{E}[G_t \mid s_t=s, a_t=a]
$$

Plain English: the Q-value is the average return expected after taking action $a$ in state $s$.

Distributional RL instead models the distribution of returns:

$$
Z(s,a)
\overset{D}{=}
R(s,a)
+
\gamma
Z(s',a')
$$

Plain English: instead of predicting only the mean return, distributional RL predicts a random return variable whose distribution follows a Bellman-style relationship.

The Q-value can then be recovered as the expectation:

$$
Q(s,a)
=
\mathbb{E}[Z(s,a)]
$$

Plain English: the usual scalar Q-value is the mean of the predicted return distribution.

This helps because two actions may have the same expected return but very different risk profiles or return distributions.

---

# Part 6 — Practicalities and limitations

## 6.1 Why DQN needs discrete action spaces

DQN works naturally when the action space is discrete and small enough that the network can output one Q-value per action.

The greedy action requires:

$$
\arg\max_a Q(s,a;\theta)
$$

Plain English: the agent must find the action with the highest predicted Q-value.

For a small discrete action set, this is easy. The network outputs all action values, and the agent chooses the largest.

But in continuous action spaces, the action $a$ may be a real-valued vector.

For example:

$$
a \in \mathbb{R}^d
$$

Plain English: the action is a continuous vector with infinitely many possible values.

Then the maximization becomes:

$$
\max_{a \in \mathbb{R}^d} Q(s,a;\theta)
$$

Plain English: choosing the best action would require solving a continuous optimization problem inside every TD target and every action-selection step.

This is generally not tractable for vanilla DQN.

That is why continuous-control problems usually use policy-gradient or actor-critic methods.

Examples include:

1. **DDPG**
2. **TD3**
3. **SAC**
4. **PPO** for many policy-gradient setups

---

## 6.2 DQN versus policy-gradient methods

DQN is value-based.

It learns:

$$
Q(s,a;\theta)
$$

Plain English: DQN learns a function that scores actions, then chooses actions from those scores.

Policy-gradient methods directly learn a policy:

$$
\pi_\phi(a \mid s)
$$

Plain English: a policy-gradient method learns a probability distribution over actions given the state.

For continuous deterministic control, an actor may output an action directly:

$$
a = \mu_\phi(s)
$$

Plain English: the actor network maps the state directly to a continuous action.

Actor-critic methods combine both ideas:

$$
\text{actor: } \pi_\phi(a \mid s),
\qquad
\text{critic: } Q_\theta(s,a)
$$

Plain English: the actor chooses actions, while the critic evaluates how good those actions are.

This avoids the need to enumerate all actions in continuous spaces.

---

## 6.3 Common DQN failure modes

### Overestimation bias

Standard DQN can overestimate Q-values due to the max operator.

This can lead to poor action choices and unstable learning.

Double DQN directly addresses this.

---

### Divergence or exploding Q-values

The combination of function approximation, bootstrapping, and off-policy data can cause value estimates to diverge.

Symptoms include:

1. Q-values growing without bound
2. Loss spikes
3. Sudden performance collapse
4. Highly unstable learning curves

Possible causes include learning rate too high, target updates too frequent, insufficient replay diversity, reward scale issues, or unstable network architecture.

---

### Catastrophic forgetting

Because the network parameters are shared, learning from new experience can damage performance on older parts of the state space.

Replay helps reduce this by mixing old and new transitions.

But if the buffer is too small or the environment distribution shifts, forgetting can still happen.

---

### Poor exploration

DQN often uses $\epsilon$-greedy exploration.

This can be weak in sparse-reward environments.

Random actions may not discover meaningful reward signals.

More advanced exploration strategies include noisy networks, intrinsic motivation, count-based bonuses, curiosity methods, and entropy-regularized actor-critic methods.

---

### Replay buffer pathologies

Replay can contain stale data, unbalanced experience, or too few rare reward transitions.

If important transitions are rare, uniform replay may sample them too infrequently.

Prioritized replay helps, but can over-sample noisy transitions.

---

### Sensitivity to reward scale

Large rewards can create large TD targets and unstable gradients.

Reward clipping can help, but it changes the optimization objective.

Reward normalization or careful environment-specific scaling can also be used.

---

## 6.4 Hyperparameters that matter

### Replay buffer size

The replay size controls how much past experience is retained.

Small buffers adapt quickly but may overfit recent trajectories.

Large buffers improve diversity but can contain stale transitions.

---

### Batch size

The minibatch size controls gradient estimate noise.

Larger batches produce smoother updates but require more computation and may reduce the number of updates per environment step.

---

### Target update frequency

The hard update period $C$ matters.

If $C$ is too small, the target network tracks the online network too closely and the moving-target problem returns.

If $C$ is too large, targets become stale and learning may slow down.

---

### Soft update coefficient

For soft updates:

$$
\theta^- \leftarrow \tau \theta + (1-\tau)\theta^-
$$

Plain English: the coefficient $\tau$ controls how quickly the target network follows the online network.

A small $\tau$ gives slow, stable tracking. A large $\tau$ makes the target move more quickly.

---

### Exploration schedule

The exploration rate $\epsilon$ is often annealed over time.

A common schedule is:

$$
\epsilon_t
=
\max
\left(
\epsilon_{\min},
\epsilon_{\max}
-
kt
\right)
$$

Plain English: exploration starts high and decreases linearly until it reaches a minimum value.

Here, $k$ controls the decay speed.

If $\epsilon$ decays too quickly, the agent may prematurely exploit a bad policy.

If it decays too slowly, the agent may keep acting randomly even after it has learned useful values.

---

### Learning rate

The learning rate $\alpha$ controls the size of gradient updates.

The parameter update is:

$$
\theta
\leftarrow
\theta
-
\alpha
\nabla_\theta L(\theta)
$$

Plain English: larger learning rates make faster updates but can destabilize training; smaller learning rates are safer but slower.

DQN is often highly sensitive to the learning rate.

---

### Discount factor

The discount factor $\gamma$ controls how much future rewards matter.

The target uses:

$$
y =
r
+
\gamma
\max_{a'} Q(s',a';\theta^-)
$$

Plain English: a larger $\gamma$ makes the agent care more about future value, while a smaller $\gamma$ emphasizes immediate reward.

High $\gamma$ can make learning harder because errors propagate over longer horizons.

---

### Training frequency

Some implementations do not update the network after every environment step.

They train every $K$ environment steps:

$$
\text{train if } t \bmod K = 0
$$

Plain English: the agent performs a gradient update only when the current timestep is divisible by $K$.

This can reduce computation and change the ratio between environment interaction and learning.

---

### Gradient clipping

Gradient clipping limits update magnitude.

One common form is norm clipping:

$$
g
\leftarrow
g
\cdot
\min
\left(
1,
\frac{c}{\|g\|}
\right)
$$

Plain English: if the gradient norm is larger than threshold $c$, the gradient is rescaled to have norm $c$; otherwise it is left unchanged.

This helps prevent rare large TD errors from causing unstable parameter jumps.

---

## 6.5 Practical debugging checklist

When DQN fails, check these first:

1. Are terminal states handled correctly in the target?
2. Is the target network actually frozen between updates?
3. Are gradients stopped through the target?
4. Are actions indexed correctly when selecting $Q(s,a;\theta)$?
5. Is the replay buffer large enough before training begins?
6. Is $\epsilon$ decaying too quickly?
7. Are rewards too large or poorly scaled?
8. Are Q-values exploding?
9. Is the learning rate too high?
10. Is the environment observation actually Markov, or does it need frame stacking or memory?
11. Are target updates too frequent or too rare?
12. Is the evaluation policy greedy while the training policy is exploratory?
13. Is the replay buffer sampling uniformly or as intended?
14. Are terminal time-limit truncations being handled correctly?

The most common silent bug is incorrect target construction.

The target should usually be:

$$
y_i =
r_i
+
\gamma(1-d_i)
\max_{a'} Q(s'_i,a';\theta^-)
$$

Plain English: the next-state value should be included only for non-terminal transitions.

If the terminal mask is wrong, the agent may bootstrap from states after episode termination, corrupting value estimates.

---

# Next steps

DQN is the canonical deep value-based method for discrete action spaces.

The complementary paradigm is the **policy-gradient** family.

A good progression is:

1. **REINFORCE**
2. **Actor-critic**
3. **Advantage actor-critic**
4. **PPO**

REINFORCE directly optimizes the policy using sampled returns.

Actor-critic methods add a learned value function to reduce variance.

PPO stabilizes policy-gradient learning by preventing overly large policy updates.

The policy-gradient objective has the form:

$$
J(\phi)
=
\mathbb{E}_{\tau \sim \pi_\phi}
\left[
G(\tau)
\right]
$$

Plain English: the goal is to choose policy parameters $\phi$ that maximize expected return over trajectories sampled from the policy.

A basic policy-gradient expression is:

$$
\nabla_\phi J(\phi)
=
\mathbb{E}
\left[
\nabla_\phi \log \pi_\phi(a_t \mid s_t)
G_t
\right]
$$

Plain English: actions that led to high return are made more likely, while actions that led to low return are made less likely.

Actor-critic methods replace the raw return with an advantage estimate:

$$
\nabla_\phi J(\phi)
=
\mathbb{E}
\left[
\nabla_\phi \log \pi_\phi(a_t \mid s_t)
A^\pi(s_t,a_t)
\right]
$$

Plain English: the policy is updated according to whether an action was better or worse than expected in that state.

For continuous control, the direct descendants to study are:

1. **DDPG** — deterministic actor-critic for continuous actions
2. **TD3** — improves DDPG with clipped double critics and delayed policy updates
3. **SAC** — entropy-regularized actor-critic with strong exploration and robustness

DDPG and SAC are especially important because they answer the limitation that vanilla DQN cannot handle continuous action spaces naturally.

A clean conceptual map is:

- DQN: learn action values, choose the best discrete action.
- Policy gradient: learn the policy directly.
- Actor-critic: learn both a policy and a value estimator.
- DDPG/TD3/SAC: actor-critic methods designed for continuous action spaces.
- PPO: a robust general-purpose policy-gradient method widely used in modern deep RL.
