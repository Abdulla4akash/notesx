---
subject: "Self Learning"
chapter: 4
title: "Deep Q-Networks: Advanced Build-and-Debug Companion Notes"
language: en
---

# Deep Q-Networks: Advanced Build-and-Debug Companion Notes

## Topic and scope

These notes assume you already understand the conceptual DQN recipe: approximate $Q(s,a)$ with a neural network, train on bootstrapped TD targets, use experience replay, freeze a target network, and stabilize the deadly triad enough to make learning work.

The goal here is not to re-teach DQN from scratch. The goal is to explain what actually happens during optimization, why DQN is fragile, how the main variants fix specific failure modes, and how to debug an implementation when it refuses to learn.

---

# Part 1 — Convergence, honestly

## 1.1 Tabular Q-learning had a convergence story

In tabular Q-learning, each state-action pair $(s,a)$ has its own independent scalar estimate $Q(s,a)$. Under standard assumptions — finite MDP, sufficient exploration, decaying learning rates satisfying Robbins-Monro conditions — the update converges to $Q^*$.

The Bellman optimality operator is:

$$
(\mathcal{T}Q)(s,a) = \mathbb{E}_{s',r}\left[r + \gamma \max_{a'} Q(s',a') \mid s,a\right]
$$

Plain-English explanation: the Bellman optimality operator maps a current $Q$ function to a new one by replacing each value with the expected immediate reward plus the discounted value of the best next action.

For tabular values, this operator is a contraction in the sup norm:

$$
\|\mathcal{T}Q_1 - \mathcal{T}Q_2\|_\infty \leq \gamma \|Q_1 - Q_2\|_\infty
$$

Plain-English explanation: applying the Bellman operator brings any two value functions closer together by at least a factor of $\gamma$, where $0 \leq \gamma < 1$.

That contraction property gives tabular Q-learning its fixed-point story:

$$
Q^* = \mathcal{T}Q^*
$$

Plain-English explanation: the optimal action-value function is the unique fixed point of the Bellman optimality operator.

This is the clean mathematical world that DQN leaves behind.

---

## 1.2 Why DQN has no general convergence guarantee

DQN replaces the table with a neural network:

$$
Q(s,a;\theta) \approx Q^*(s,a)
$$

Plain-English explanation: instead of storing one number per state-action pair, DQN uses parameters $\theta$ to produce approximate action values.

The problem is that the set of functions representable by a neural network is not generally closed under the Bellman operator. If $Q_\theta$ is representable by the network, $\mathcal{T}Q_\theta$ may not be exactly representable by the same network.

So the update is no longer:

$$
Q \leftarrow \mathcal{T}Q
$$

Plain-English explanation: in tabular learning, we can directly move each value estimate toward its Bellman target.

Instead, DQN does something closer to:

$$
\theta \leftarrow \arg\min_\theta \left\|Q_\theta - \mathcal{T}Q_{\theta^-}\right\|^2
$$

Plain-English explanation: DQN tries to find neural network parameters whose predictions are close to bootstrapped Bellman targets computed from another network.

This is not a contraction update in parameter space. The mapping from $\theta$ to $Q_\theta$ is nonlinear, coupled across states, and optimized approximately using stochastic gradient descent.

A small parameter change can improve $Q(s,a)$ for one region of state space while damaging predictions elsewhere. Unlike the table, the entries are not independent.

That is the core reason DQN has no general convergence guarantee.

---

## 1.3 Function approximation breaks the fixed-point argument

In tabular Q-learning, changing $Q(s,a)$ only changes that one entry. In DQN, changing $\theta$ changes many outputs at once:

$$
\theta \mapsto \{Q(s,a;\theta) : s \in \mathcal{S}, a \in \mathcal{A}\}
$$

Plain-English explanation: one parameter vector determines all state-action values simultaneously.

A gradient step on one mini-batch changes the network globally:

$$
\theta_{t+1} = \theta_t - \alpha \nabla_\theta L(\theta_t)
$$

Plain-English explanation: the optimizer updates the shared neural network parameters using the gradient of the loss.

Even if the loss decreases on the sampled mini-batch, the Bellman error can increase on other states. This is especially dangerous because the targets themselves depend on the network.

The learning problem is therefore not simple supervised learning. It is moving-target regression with bootstrapped labels.

---

## 1.4 What divergence looks like in practice

DQN divergence is not always dramatic at first. It often appears as instability before total collapse.

Common symptoms include:

- Average return stays flat despite many updates.
- Loss spikes repeatedly instead of settling into a noisy but stable range.
- Q-values grow to unreasonable magnitudes.
- The policy collapses to one action everywhere.
- TD errors explode.
- The agent learns briefly, then forgets.
- Evaluation return improves, then crashes.
- Gradients become extremely large or NaN.
- Replay buffer contains reasonable transitions, but learned values are nonsense.

A classic sign is exploding Q-values:

$$
\max_a |Q(s,a;\theta)| \rightarrow \infty
$$

Plain-English explanation: the network begins predicting action values whose magnitudes are far larger than any plausible discounted return.

For example, if rewards are clipped to $[-1,1]$ and $\gamma = 0.99$, the maximum possible infinite-horizon return magnitude is roughly:

$$
\frac{1}{1-\gamma} = \frac{1}{1-0.99} = 100
$$

Plain-English explanation: with reward magnitude at most $1$ and discount $0.99$, a value much larger than $100$ is suspicious because even receiving reward $1$ forever only gives return $100$.

So if your DQN predicts Q-values like $10^4$, $10^6$, or NaN on Atari with clipped rewards, something is badly wrong.

---

## 1.5 Why DQN works anyway

DQN works because several engineering tricks make the unstable update behave enough like fitted value iteration.

The main stabilizers are:

1. **Experience replay** reduces temporal correlation.
2. **Target networks** slow down target drift.
3. **Reward clipping** limits target magnitude.
4. **Huber loss** limits the effect of large TD errors.
5. **Gradient clipping** prevents rare updates from destroying the network.
6. **Small learning rates** make parameter movement gradual.
7. **Large replay buffers** create a more stationary data distribution.
8. **Frame preprocessing** reduces input complexity.

These do not restore the tabular convergence proof. They just make the optimization problem less hostile.

DQN is therefore best understood as a practical approximate dynamic programming method, not as a theoretically guaranteed convergent algorithm.

---

## 1.6 The deadly triad in DQN

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

Plain-English explanation: many state-action values are represented by one shared parameter vector.

This creates generalization, which is the whole point, but also creates interference. Updating one state-action pair may damage others.

### Bootstrapping

DQN trains toward targets that contain another value estimate:

$$
y = r + \gamma \max_{a'} Q(s',a';\theta^-)
$$

Plain-English explanation: the target is not a pure observed label; it depends on the model's own prediction about the future.

If the future estimate is wrong, the error is fed back into training.

### Off-policy learning

DQN usually learns the greedy policy while collecting data using an $\epsilon$-greedy behavior policy.

The behavior policy is:

$$
\pi_b(a|s) =
\begin{cases}
1-\epsilon + \frac{\epsilon}{|\mathcal{A}|}, & a = \arg\max_{a'} Q(s,a';\theta) \\
\frac{\epsilon}{|\mathcal{A}|}, & \text{otherwise}
\end{cases}
$$

Plain-English explanation: the agent usually chooses the currently best-looking action, but sometimes takes random actions for exploration.

The target policy is greedy:

$$
\pi_{\text{target}}(s) = \arg\max_a Q(s,a;\theta)
$$

Plain-English explanation: the values are trained as if the agent will act greedily, even though the data came from an exploratory behavior policy.

Off-policy learning is powerful because old data can still be useful, but it also means the training distribution may not match the policy being optimized.

---

## 1.7 How replay and target networks mitigate the triad

Replay reduces sample correlation by drawing random mini-batches:

$$
(s_i,a_i,r_i,s'_i,d_i) \sim \mathcal{D}
$$

Plain-English explanation: instead of training only on the most recent transition, DQN samples past transitions from a replay buffer.

This helps because neural networks behave better when mini-batches are closer to independent and identically distributed.

Target networks reduce target movement:

$$
y_i = r_i + \gamma (1-d_i) \max_{a'} Q(s'_i,a';\theta^-)
$$

Plain-English explanation: DQN computes the bootstrapped target using a slowly updated copy of the online network.

This helps because the network is not chasing a target that changes every single gradient step.

But the deadly triad remains. Replay does not make the data truly stationary. Target networks do not remove bootstrapping. Function approximation still couples predictions. DQN is stabilized, not made safe.

---

# Part 2 — The loss and gradient in detail

## 2.1 DQN loss

For a mini-batch of transitions $(s_i,a_i,r_i,s'_i,d_i)$, the DQN target is:

$$
y_i = r_i + \gamma (1-d_i)\max_{a'} Q(s'_i,a';\theta^-)
$$

Plain-English explanation: the target is the observed reward plus the discounted target-network estimate of the best next action, unless the transition ended the episode.

The prediction for the action actually taken is:

$$
\hat{q}_i = Q(s_i,a_i;\theta)
$$

Plain-English explanation: the online network predicts the value of the specific action selected in the sampled transition.

The squared TD error loss is:

$$
L(\theta) = \frac{1}{B}\sum_{i=1}^{B} \left(y_i - Q(s_i,a_i;\theta)\right)^2
$$

Plain-English explanation: the loss penalizes the gap between the bootstrapped target and the online network's prediction for the sampled action.

Often the loss includes a factor of $\frac{1}{2}$:

$$
L(\theta) = \frac{1}{2B}\sum_{i=1}^{B} \left(y_i - Q(s_i,a_i;\theta)\right)^2
$$

Plain-English explanation: the factor $\frac{1}{2}$ is mathematically convenient because it cancels the $2$ when taking the derivative.

---

## 2.2 TD error

The TD error is:

$$
\delta_i = y_i - Q(s_i,a_i;\theta)
$$

Plain-English explanation: the TD error measures how much higher or lower the target is than the network's current prediction.

If $\delta_i > 0$, the network underestimated the action value. If $\delta_i < 0$, it overestimated it.

---

## 2.3 Semi-gradient update

Using the half-squared error for one transition:

$$
L_i(\theta) = \frac{1}{2}\left(y_i - Q(s_i,a_i;\theta)\right)^2
$$

Plain-English explanation: this is the squared prediction error for one sampled transition, scaled by $\frac{1}{2}$.

If the target $y_i$ is treated as constant with respect to $\theta$, then:

$$
\nabla_\theta L_i(\theta)
= -\left(y_i - Q(s_i,a_i;\theta)\right)\nabla_\theta Q(s_i,a_i;\theta)
$$

Plain-English explanation: the gradient points in the direction that changes the predicted Q-value to reduce the TD error.

Using $\delta_i = y_i - Q(s_i,a_i;\theta)$:

$$
\nabla_\theta L_i(\theta)
= -\delta_i \nabla_\theta Q(s_i,a_i;\theta)
$$

Plain-English explanation: the update size is proportional to the TD error and to how sensitive the predicted Q-value is to the parameters.

Gradient descent gives:

$$
\theta \leftarrow \theta - \alpha \nabla_\theta L_i(\theta)
$$

Plain-English explanation: the parameters move opposite the loss gradient with step size $\alpha$.

Substituting the semi-gradient:

$$
\theta \leftarrow \theta + \alpha \delta_i \nabla_\theta Q(s_i,a_i;\theta)
$$

Plain-English explanation: if the target is higher than the current prediction, the update increases $Q(s_i,a_i;\theta)$; if the target is lower, it decreases it.

This is called a **semi-gradient** because we differentiate through the prediction but not through the bootstrapped target.

---

## 2.4 Why the target is detached

The DQN target is:

$$
y_i = r_i + \gamma (1-d_i)\max_{a'} Q(s'_i,a';\theta^-)
$$

Plain-English explanation: the target is computed from the reward and the target network's estimate of the best next-state action.

In PyTorch, this target should be computed under `torch.no_grad()` or explicitly detached.

Conceptually:

$$
\text{stopgrad}(y_i)
= \text{stopgrad}\left(r_i + \gamma (1-d_i)\max_{a'} Q(s'_i,a';\theta^-)\right)
$$

Plain-English explanation: `stopgrad` means the target is treated as a fixed label during the gradient update.

The loss should be:

$$
L_i(\theta) = \frac{1}{2}\left(\text{stopgrad}(y_i) - Q(s_i,a_i;\theta)\right)^2
$$

Plain-English explanation: the online network is trained to match the target, but the target itself is not moved by this loss.

If the target is not detached and uses the same parameters $\theta$, the loss becomes:

$$
L_i(\theta) =
\frac{1}{2}
\left(
r_i + \gamma \max_{a'} Q(s'_i,a';\theta)
-
Q(s_i,a_i;\theta)
\right)^2
$$

Plain-English explanation: now the gradient flows through both the current-state prediction and the next-state target prediction.

The full gradient would be:

$$
\nabla_\theta L_i(\theta)
=
\delta_i
\left(
\gamma \nabla_\theta \max_{a'} Q(s'_i,a';\theta)
-
\nabla_\theta Q(s_i,a_i;\theta)
\right)
$$

Plain-English explanation: the update would not only change the current prediction toward the target; it would also change the next-state value inside the target.

This is usually not what we want. The target is meant to be a temporary regression label. If the network can move both sides of the equation, it can reduce loss by changing the target rather than making the current prediction more accurate.

A pathological example:

$$
Q(s_i,a_i;\theta) \uparrow
\quad \text{and} \quad
Q(s'_i,a^*,\theta) \uparrow
$$

Plain-English explanation: both the prediction and the target may rise together, causing values to chase themselves upward.

This can amplify overestimation and destabilize training.

The target network $\theta^-$ already helps by using a different parameter copy. Detaching makes this explicit: the target is a fixed number for the current optimization step.

---

## 2.5 Huber loss vs. MSE

The MSE loss is:

$$
L_{\text{MSE}}(\delta) = \frac{1}{2}\delta^2
$$

Plain-English explanation: MSE penalizes errors quadratically, so large TD errors produce very large gradients.

Its derivative is:

$$
\frac{dL_{\text{MSE}}}{d\delta} = \delta
$$

Plain-English explanation: the gradient magnitude grows linearly with the TD error.

This can be dangerous in DQN because TD targets are noisy and sometimes badly wrong.

The Huber loss with threshold $\kappa$ is:

$$
L_{\kappa}(\delta)=
\begin{cases}
\frac{1}{2}\delta^2, & |\delta| \leq \kappa \\
\kappa\left(|\delta| - \frac{1}{2}\kappa\right), & |\delta| > \kappa
\end{cases}
$$

Plain-English explanation: Huber behaves like MSE for small errors but like absolute error for large errors.

For the common DQN choice $\kappa=1$:

$$
L_{\text{Huber}}(\delta)=
\begin{cases}
\frac{1}{2}\delta^2, & |\delta| \leq 1 \\
|\delta| - \frac{1}{2}, & |\delta| > 1
\end{cases}
$$

Plain-English explanation: errors smaller than $1$ are treated quadratically, while larger errors are prevented from producing huge loss values.

The derivative is:

$$
\frac{dL_{\kappa}}{d\delta} =
\begin{cases}
\delta, & |\delta| \leq \kappa \\
\kappa \cdot \text{sign}(\delta), & |\delta| > \kappa
\end{cases}
$$

Plain-English explanation: the gradient grows normally near zero but is clipped for large errors.

This is why Huber is standard in DQN: it keeps learning sensitive around small TD errors while protecting against rare destructive updates.

---

## 2.6 Gradient clipping

Gradient clipping limits the size of the parameter update.

A common version clips the global gradient norm:

$$
g \leftarrow g \cdot \min\left(1, \frac{c}{\|g\|_2}\right)
$$

Plain-English explanation: if the gradient norm is larger than threshold $c$, the whole gradient vector is rescaled so its norm becomes $c$.

For example, if $\|g\|_2 = 100$ and $c=10$, then:

$$
g \leftarrow 0.1g
$$

Plain-English explanation: the gradient is shrunk by a factor of $10$ before the optimizer step.

Gradient clipping does not fix wrong targets, bad exploration, or broken replay sampling. It only prevents individual gradient steps from being too large.

In DQN, it is useful because occasional batches may contain unusually large TD errors.

---

## 2.7 Reward clipping

In Atari DQN, rewards are often clipped:

$$
r_{\text{clip}} =
\begin{cases}
1, & r > 0 \\
0, & r = 0 \\
-1, & r < 0
\end{cases}
$$

Plain-English explanation: all positive rewards become $+1$, all negative rewards become $-1$, and zero remains zero.

This bounds the scale of TD targets:

$$
y = r_{\text{clip}} + \gamma \max_{a'} Q(s',a';\theta^-)
$$

Plain-English explanation: since the immediate reward is bounded, the target values are less likely to explode.

Reward clipping makes optimization more stable across games with different reward scales. But it also changes the objective. A reward of $+100$ and a reward of $+1$ become identical.

That means reward clipping is a stabilizer, not a free lunch.

---

# Part 3 — A fully worked update

## 3.1 Setup

Consider a tiny DQN with two actions:

$$
\mathcal{A} = \{0,1\}
$$

Plain-English explanation: from each state, the agent can choose action $0$ or action $1$.

Suppose we sample one transition:

$$
(s,a,r,s',d) = (s, 0, 2, s', 0)
$$

Plain-English explanation: the agent was in state $s$, took action $0$, received reward $2$, moved to $s'$, and the episode did not terminate.

Let the discount factor be:

$$
\gamma = 0.9
$$

Plain-English explanation: future rewards are worth $90\%$ as much per step into the future.

Assume the online network currently outputs:

$$
Q(s,\cdot;\theta) = [3.0,\ 1.0]
$$

Plain-English explanation: for the current state $s$, the network estimates action $0$ is worth $3.0$ and action $1$ is worth $1.0$.

The action actually taken was $a=0$, so the prediction used in the loss is:

$$
Q(s,a;\theta) = Q(s,0;\theta) = 3.0
$$

Plain-English explanation: even though the network outputs values for both actions, the loss only uses the value of the sampled action.

Assume the target network outputs for the next state:

$$
Q(s',\cdot;\theta^-) = [4.0,\ 5.0]
$$

Plain-English explanation: according to the frozen target network, action $0$ in the next state is worth $4.0$, and action $1$ is worth $5.0$.

---

## 3.2 Compute the TD target

The best next-state target value is:

$$
\max_{a'} Q(s',a';\theta^-) = \max(4.0,5.0)=5.0
$$

Plain-English explanation: the target network thinks action $1$ is the best next action in $s'$.

Because the transition is non-terminal, $d=0$:

$$
y = r + \gamma(1-d)\max_{a'}Q(s',a';\theta^-)
$$

Plain-English explanation: the target includes both immediate reward and discounted future value because the episode continues.

Substitute the numbers:

$$
y = 2 + 0.9(1-0)(5.0)
$$

Plain-English explanation: the observed reward is $2$, and the discounted next-state value is $0.9 \times 5.0$.

So:

$$
y = 2 + 4.5 = 6.5
$$

Plain-English explanation: the target says the value of taking action $0$ in state $s$ should move toward $6.5$.

---

## 3.3 Compute the TD error

The TD error is:

$$
\delta = y - Q(s,0;\theta)
$$

Plain-English explanation: this compares the target value against the current prediction for the sampled action.

Substitute the numbers:

$$
\delta = 6.5 - 3.0 = 3.5
$$

Plain-English explanation: the network currently underestimates this action by $3.5$.

---

## 3.4 Compute the MSE loss

Using half-squared error:

$$
L = \frac{1}{2}\delta^2
$$

Plain-English explanation: the loss is half the squared TD error.

Substitute the TD error:

$$
L = \frac{1}{2}(3.5)^2 = \frac{1}{2}(12.25)=6.125
$$

Plain-English explanation: this transition contributes a loss of $6.125$ under half-MSE.

---

## 3.5 Compute the Huber loss

Using Huber loss with $\kappa=1$:

$$
L_{\text{Huber}}(\delta)=|\delta|-\frac{1}{2}
\quad \text{when } |\delta| > 1
$$

Plain-English explanation: since the TD error is larger than $1$, Huber uses its linear branch.

Here:

$$
L_{\text{Huber}}(3.5) = 3.5 - 0.5 = 3.0
$$

Plain-English explanation: the Huber loss is $3.0$, smaller than the MSE loss because it reduces the impact of large errors.

The derivative with respect to the prediction $\hat{q}=Q(s,0;\theta)$ is:

$$
\frac{\partial L_{\text{Huber}}}{\partial \hat{q}} = -1
$$

Plain-English explanation: because the target is above the prediction by more than $1$, the Huber gradient pushes the prediction upward with clipped magnitude.

For MSE, the derivative would be:

$$
\frac{\partial L_{\text{MSE}}}{\partial \hat{q}} = -\delta = -3.5
$$

Plain-English explanation: MSE would push the prediction upward more aggressively because it does not clip large TD errors.

---

## 3.6 Tiny linear network example

Suppose the Q-value for action $0$ is produced by a simple linear head:

$$
Q(s,0;\theta) = w^\top h
$$

Plain-English explanation: the action value is a dot product between a weight vector $w$ and a feature vector $h$ from the network.

Let:

$$
h =
\begin{bmatrix}
1 \\
2
\end{bmatrix},
\quad
w =
\begin{bmatrix}
1 \\
1
\end{bmatrix}
$$

Plain-English explanation: the feature vector is $[1,2]^\top$, and the action-$0$ weights are initially $[1,1]^\top$.

Then:

$$
Q(s,0;\theta)=w^\top h = 1\cdot 1 + 1\cdot 2 = 3
$$

Plain-English explanation: this matches the earlier prediction of $3.0$ for action $0$.

The gradient of the Q-value with respect to $w$ is:

$$
\nabla_w Q(s,0;w) = h =
\begin{bmatrix}
1 \\
2
\end{bmatrix}
$$

Plain-English explanation: changing each weight changes the output in proportion to the corresponding feature value.

Using MSE semi-gradient, the update is:

$$
w \leftarrow w + \alpha \delta \nabla_w Q(s,0;w)
$$

Plain-English explanation: because the prediction is too low, the weights move in the direction that increases the predicted Q-value.

Let the learning rate be:

$$
\alpha = 0.1
$$

Plain-English explanation: each gradient step uses step size $0.1$.

Then:

$$
w \leftarrow
\begin{bmatrix}
1 \\
1
\end{bmatrix}
+
0.1(3.5)
\begin{bmatrix}
1 \\
2
\end{bmatrix}
$$

Plain-English explanation: the TD error $3.5$ scales the feature vector, and the learning rate shrinks the step.

Compute the update:

$$
0.1(3.5)
\begin{bmatrix}
1 \\
2
\end{bmatrix}
=
\begin{bmatrix}
0.35 \\
0.70
\end{bmatrix}
$$

Plain-English explanation: the first weight increases by $0.35$, and the second weight increases by $0.70$.

So the new weights are:

$$
w_{\text{new}} =
\begin{bmatrix}
1.35 \\
1.70
\end{bmatrix}
$$

Plain-English explanation: the action-$0$ head has been adjusted upward for features active in state $s$.

The new Q-value is:

$$
Q_{\text{new}}(s,0) = 1.35\cdot 1 + 1.70\cdot 2 = 1.35 + 3.40 = 4.75
$$

Plain-English explanation: one gradient step moved the predicted value from $3.0$ toward the target $6.5$, but did not reach it completely.

The new TD error would be:

$$
\delta_{\text{new}} = 6.5 - 4.75 = 1.75
$$

Plain-English explanation: the prediction is still below the target, but the error has been reduced.

---

## 3.7 What happens to the other action?

For this sampled transition, the loss only uses $Q(s,0;\theta)$, not $Q(s,1;\theta)$.

In PyTorch, this is usually implemented with `gather`:

```python
q_all = online_net(states)                  # shape: [batch_size, num_actions]
q_sa = q_all.gather(1, actions.unsqueeze(1)) # shape: [batch_size, 1]
```

The target has shape:

```python
target = rewards + gamma * (1 - dones) * next_q_max
```

Then:

```python
loss = huber(q_sa.squeeze(1), target.detach())
```

For the current sample, only the output corresponding to action $0$ receives a direct loss gradient. However, because hidden layers are shared, the update can still affect future predictions for both actions in nearby states.

That shared representation is useful, but it is also a source of interference.

---

# Part 4 — The engineering that decides success or failure

## 4.1 Replay buffer

A **replay buffer** stores transitions:

$$
\mathcal{D} = \{(s_t,a_t,r_t,s_{t+1},d_t)\}
$$

Plain-English explanation: the buffer is a dataset of past experience collected by the agent.

DQN samples mini-batches uniformly from this buffer:

$$
(s_i,a_i,r_i,s'_i,d_i) \sim \text{Uniform}(\mathcal{D})
$$

Plain-English explanation: each sampled transition is chosen randomly from stored experience.

### Why too small hurts

If the replay buffer is too small, samples are highly correlated and overly focused on the most recent behavior policy.

Symptoms:

- Loss oscillates heavily.
- Agent overfits to recent trajectories.
- Policy improves briefly, then forgets.
- Training behaves like unstable online Q-learning.

A tiny buffer gives you less decorrelation, less diversity, and more feedback loops.

### Why too large hurts

If the replay buffer is too large, it can contain stale data from very old policies.

Symptoms:

- Learning becomes slow.
- The agent trains on behavior that no longer matches its current competence.
- Rare improvements take a long time to influence the training distribution.
- Non-stationarity becomes hidden rather than solved.

A huge buffer can make the agent conservative because it keeps rehearsing old bad experience.

### Warm-up period

DQN should usually collect experience before learning starts:

$$
|\mathcal{D}| \geq N_{\text{warmup}}
$$

Plain-English explanation: the agent waits until the buffer has at least a minimum number of transitions before taking gradient steps.

Without warm-up, the first updates are made from a tiny, biased, low-diversity dataset. This can poison early Q-values.

---

## 4.2 Target network updates

DQN maintains:

- Online network parameters $\theta$
- Target network parameters $\theta^-$

The hard update rule is:

$$
\theta^- \leftarrow \theta
$$

Plain-English explanation: every so often, the target network is overwritten with the online network's current weights.

This happens every $C$ environment steps or gradient steps.

If $C$ is too small, the target moves too quickly. If $C$ is too large, the targets become stale.

---

## 4.3 Soft target updates

An alternative is the Polyak update:

$$
\theta^- \leftarrow \tau\theta + (1-\tau)\theta^-
$$

Plain-English explanation: the target network slowly moves toward the online network by mixing a small amount of online parameters into the old target parameters.

For example, if $\tau=0.005$:

$$
\theta^- \leftarrow 0.005\theta + 0.995\theta^-
$$

Plain-English explanation: each update copies only $0.5\%$ of the online network into the target network.

Soft updates are smoother than hard updates. They are common in actor-critic methods and some modern DQN-style implementations.

---

## 4.4 Target update frequency and stability

The target controls the bootstrap term:

$$
y = r + \gamma \max_{a'}Q(s',a';\theta^-)
$$

Plain-English explanation: the target network determines the future-value part of the TD target.

If $\theta^-$ changes too quickly, the target is unstable. The online network chases moving labels.

If $\theta^-$ changes too slowly, the target becomes outdated. The online network trains against stale estimates.

Good target update settings balance stability and freshness.

---

## 4.5 Exploration schedule

DQN usually uses $\epsilon$-greedy exploration.

A linear decay schedule is:

$$
\epsilon_t =
\max\left(
\epsilon_{\min},
\epsilon_{\max}
-
t\frac{\epsilon_{\max}-\epsilon_{\min}}{T}
\right)
$$

Plain-English explanation: epsilon decreases at a constant rate from $\epsilon_{\max}$ to $\epsilon_{\min}$ over $T$ steps, then stays at the minimum.

An exponential decay schedule is:

$$
\epsilon_t =
\epsilon_{\min}
+
(\epsilon_{\max}-\epsilon_{\min})\exp\left(-\frac{t}{\lambda}\right)
$$

Plain-English explanation: epsilon decreases quickly at first and then slowly approaches the minimum.

Linear decay is easier to reason about. Exponential decay can preserve some exploration for longer, depending on $\lambda$.

Typical values:

- Start: $\epsilon_{\max}=1.0$
- End: $\epsilon_{\min}=0.01$ to $0.1$
- Decay duration: tens of thousands to millions of environment steps depending on task scale

If epsilon decays too fast, the agent commits to a bad early policy. If it decays too slowly, the agent keeps acting randomly after it already knows useful behavior.

---

## 4.6 Optimizer and learning rate

DQN commonly uses Adam or RMSProp.

Adam update:

$$
\theta_{t+1} = \theta_t - \alpha \frac{\hat{m}_t}{\sqrt{\hat{v}_t}+\epsilon}
$$

Plain-English explanation: Adam rescales parameter updates using estimates of the first and second moments of recent gradients.

DQN is learning-rate sensitive because targets depend on learned values. Too high a learning rate can create a feedback loop where Q-values overshoot and bootstrap error compounds.

Small learning rates are standard:

- Simple control tasks: around $10^{-3}$ to $10^{-4}$
- Atari-like visual tasks: around $10^{-4}$ or lower
- Very unstable settings: try $5\times 10^{-5}$ or $1\times 10^{-5}$

The right learning rate depends heavily on reward scale, network size, optimizer, batch size, and target update speed.

---

## 4.7 Practical hyperparameter table

| Component | Typical values | Too low / too small | Too high / too large | Debug signal |
|---|---:|---|---|---|
| Replay buffer size | $10^4$ to $10^6$ transitions | Correlated samples, forgetting, oscillation | Stale data, slow adaptation | Recent policy improves but training lags |
| Warm-up steps | $1{,}000$ to $50{,}000$ | Early overfitting to tiny buffer | Delayed learning | Loss unstable from the first updates |
| Batch size | $32$ to $256$ | Noisy gradients | Slower updates, more compute | Loss variance too high or training too slow |
| Discount $\gamma$ | $0.95$ to $0.99$ | Short-sighted behavior | Harder credit assignment, larger Q-values | Q-values too small or too large |
| Learning rate | $10^{-5}$ to $10^{-3}$ | Slow/no learning | Divergence, exploding Q-values | Loss spikes, NaNs, unstable returns |
| Target hard update period $C$ | $1{,}000$ to $30{,}000$ steps | Moving target instability | Stale targets | Sudden loss jumps after target sync |
| Soft update $\tau$ | $0.001$ to $0.01$ | Target too stale | Target tracks online too closely | Either slow learning or oscillation |
| Initial $\epsilon$ | $1.0$ | Not enough exploration | Usually fine initially | Poor state coverage |
| Final $\epsilon$ | $0.01$ to $0.1$ | Premature exploitation | Too much random behavior | Evaluation better than training behavior |
| Epsilon decay | $10^4$ to $10^6+$ steps | Gets greedy too early | Learns slowly | Replay lacks good trajectories or remains noisy |
| Gradient clipping norm | $5$ to $10$ | May suppress learning if too strict | May not prevent explosions | Check gradient norms |
| Reward clipping | $[-1,1]$ | Can erase reward magnitude info | Without clipping, targets may explode | Q-values inconsistent with reward scale |
| Train frequency | Every $1$ to $4$ env steps | Too few updates | Overfitting replay, compute-heavy | Data/update imbalance |
| Updates per env step | $1$ typical | Under-training | Over-training stale data | Loss falls but returns do not improve |

---

# Part 5 — Deriving the variants properly

## 5.1 Double DQN

### The overestimation problem

Standard DQN target:

$$
y^{\text{DQN}} = r + \gamma \max_{a'} Q(s',a';\theta^-)
$$

Plain-English explanation: the target network both selects the best next action and evaluates that action.

Suppose each action-value estimate is noisy:

$$
\hat{Q}(s',a) = Q^*(s',a) + \varepsilon_a
$$

Plain-English explanation: the estimated value equals the true value plus some estimation error.

Even if the noise has zero mean:

$$
\mathbb{E}[\varepsilon_a] = 0
$$

Plain-English explanation: each action's estimate is unbiased on its own.

The maximum over noisy estimates is biased upward:

$$
\mathbb{E}\left[\max_a \hat{Q}(s',a)\right]
\geq
\max_a \mathbb{E}\left[\hat{Q}(s',a)\right]
$$

Plain-English explanation: choosing the maximum tends to select actions whose errors are accidentally positive.

This is maximization bias. The `max` operation turns zero-mean noise into positive bias.

### Concrete example

Suppose the true next-state values are equal:

$$
Q^*(s',0)=Q^*(s',1)=10
$$

Plain-English explanation: both actions are actually equally good.

Suppose the estimates are:

$$
\hat{Q}(s',0)=11,\quad \hat{Q}(s',1)=9
$$

Plain-English explanation: one action is overestimated by $1$, and the other is underestimated by $1$.

The max estimate is:

$$
\max(11,9)=11
$$

Plain-English explanation: the target uses the overestimated action because it looks best.

Over many samples, the max tends to pick overestimated actions more often than underestimated ones.

---

## 5.2 Double DQN target

Double DQN decouples action selection and action evaluation.

Selection uses the online network:

$$
a^* = \arg\max_{a'} Q(s',a';\theta)
$$

Plain-English explanation: the online network chooses which next action appears best.

Evaluation uses the target network:

$$
Q(s',a^*;\theta^-)
$$

Plain-English explanation: the target network estimates the value of the action selected by the online network.

The Double DQN target is:

$$
y^{\text{Double}} =
r + \gamma(1-d)Q\left(s',\arg\max_{a'}Q(s',a';\theta);\theta^-\right)
$$

Plain-English explanation: choose the next action using the online network, but evaluate that chosen action using the target network.

This reduces overestimation because the same noisy values are no longer used for both choosing and evaluating the action.

It does not eliminate all bias. The networks are still correlated because $\theta^-$ is copied from $\theta$. But it usually reduces the positive bias enough to improve stability and performance.

---

## 5.3 Dueling DQN

Dueling DQN decomposes action values into:

- A state-value stream $V(s)$
- An advantage stream $A(s,a)$

The intuitive decomposition is:

$$
Q(s,a) = V(s) + A(s,a)
$$

Plain-English explanation: the value of an action is the general value of being in the state plus the extra benefit of choosing that action.

The problem is identifiability.

For any constant $c$, define:

$$
V'(s)=V(s)+c
$$

Plain-English explanation: we increase the state-value estimate by some constant.

And:

$$
A'(s,a)=A(s,a)-c
$$

Plain-English explanation: we decrease every action advantage by the same constant.

Then:

$$
V'(s)+A'(s,a)
=
V(s)+c+A(s,a)-c
=
V(s)+A(s,a)
=
Q(s,a)
$$

Plain-English explanation: the same Q-values can be represented by infinitely many different value-advantage decompositions.

So without a constraint, $V$ and $A$ are not uniquely identifiable.

---

## 5.4 Mean-subtracted dueling aggregation

Dueling DQN uses:

$$
Q(s,a)
=
V(s)
+
\left(
A(s,a)
-
\frac{1}{|\mathcal{A}|}\sum_{a'}A(s,a')
\right)
$$

Plain-English explanation: the Q-value is the state value plus the action's advantage after subtracting the mean advantage across actions.

The mean-subtracted advantage has zero mean:

$$
\frac{1}{|\mathcal{A}|}\sum_a
\left(
A(s,a)
-
\frac{1}{|\mathcal{A}|}\sum_{a'}A(s,a')
\right)
=0
$$

Plain-English explanation: after subtracting the average advantage, the adjusted advantages across actions sum to zero.

This forces $V(s)$ to represent the average action value:

$$
\frac{1}{|\mathcal{A}|}\sum_a Q(s,a) = V(s)
$$

Plain-English explanation: because the adjusted advantages average to zero, the state-value stream becomes the average Q-value across actions.

That fixes the arbitrary-shift problem. The network can no longer add a constant to $V$ and subtract it from every $A$ without changing the zero-mean constraint.

Dueling helps most in states where many actions have similar consequences. The value stream can learn that a state is good or bad even before the advantage stream has precisely ranked all actions.

---

## 5.5 Prioritized Experience Replay

Uniform replay samples every transition with equal probability:

$$
P(i)=\frac{1}{N}
$$

Plain-English explanation: each transition in a buffer of size $N$ is equally likely to be sampled.

Prioritized Experience Replay samples important transitions more often. A common priority is:

$$
p_i = |\delta_i| + \epsilon
$$

Plain-English explanation: transitions with larger TD errors receive higher priority, while $\epsilon$ ensures every transition has nonzero priority.

The sampling probability is:

$$
P(i) = \frac{p_i^\alpha}{\sum_k p_k^\alpha}
$$

Plain-English explanation: the probability of sampling transition $i$ is proportional to its priority raised to the power $\alpha$.

The hyperparameter $\alpha$ controls prioritization strength:

$$
\alpha = 0
$$

Plain-English explanation: when $\alpha$ is zero, all priorities become equal and sampling is uniform.

Larger $\alpha$ means stronger preference for high-error transitions.

---

## 5.6 Bias from prioritized sampling

Prioritized replay changes the training distribution. The expected loss becomes weighted toward high-priority samples:

$$
\mathbb{E}_{i\sim P} [L_i]
\neq
\frac{1}{N}\sum_{i=1}^N L_i
$$

Plain-English explanation: if we sample high-error transitions more often, the optimizer no longer sees the replay buffer as a uniform dataset.

This introduces bias. To correct it, PER uses importance-sampling weights:

$$
w_i =
\left(
\frac{1}{N}\cdot \frac{1}{P(i)}
\right)^\beta
$$

Plain-English explanation: transitions that are sampled too often receive smaller weights, and transitions sampled rarely receive larger weights.

The weights are often normalized:

$$
\tilde{w}_i = \frac{w_i}{\max_j w_j}
$$

Plain-English explanation: dividing by the maximum weight keeps the largest weight at $1$, improving numerical stability.

The weighted loss becomes:

$$
L(\theta)=
\frac{1}{B}\sum_{i=1}^{B}
\tilde{w}_i
L_i(\theta)
$$

Plain-English explanation: each sampled transition's loss is scaled to partially correct for the non-uniform sampling probability.

The hyperparameter $\beta$ controls correction strength. Typically $\beta$ is annealed toward $1$ over training.

When $\beta=1$, the correction is strongest:

$$
w_i =
\frac{1}{NP(i)}
$$

Plain-English explanation: this fully compensates for the sampling distribution in expectation, assuming the priorities and buffer are fixed.

In practice, PER improves sample efficiency but adds complexity. It can also over-focus on noisy, unlearnable, or rare transitions if priorities are not handled carefully.

---

# Part 6 — The papers and the benchmark

## 6.1 The 2013 NeurIPS workshop DQN

The 2013 DQN work introduced the core idea of combining Q-learning with deep convolutional networks for Atari from pixels.

Its key ingredients included:

- Raw pixel input from Atari frames
- Convolutional neural network approximating action values
- Experience replay
- Q-learning targets
- A single architecture applied across multiple games

The central achievement was showing that one deep RL agent could learn useful control policies from high-dimensional visual input across several Atari games.

However, the 2013 version was not yet the canonical final DQN recipe used in the later Nature paper.

---

## 6.2 The 2015 Nature DQN

The 2015 Nature DQN added and standardized several ingredients that made the method much more robust and influential.

The most important addition was the separate target network:

$$
y = r + \gamma \max_{a'}Q(s',a';\theta^-)
$$

Plain-English explanation: instead of computing the target using the same rapidly changing online network, DQN used a periodically updated target network.

The 2015 version also presented a larger-scale evaluation across many Atari games and made the "human-level control" framing famous.

Important practical ingredients included:

- Experience replay
- Target network
- Reward clipping
- Frame preprocessing
- Frame stacking
- Action repeat
- Convolutional architecture
- Evaluation across a broad Atari suite

The historical distinction is simple:

- **2013 DQN**: proved the deep Q-learning from pixels idea could work.
- **2015 DQN**: stabilized, scaled, and popularized it as a general Atari benchmark result.

---

## 6.3 Atari ALE benchmark

The **Arcade Learning Environment** provides a standardized interface to Atari 2600 games.

The benchmark became important because Atari offered:

- High-dimensional visual observations
- Diverse games
- Sparse and delayed rewards in some environments
- Long-horizon decision-making
- A shared testbed for comparing algorithms
- Minimal task-specific feature engineering

The agent observes image frames and outputs discrete joystick/button actions.

---

## 6.4 Frame preprocessing

DQN does not feed a single raw RGB frame directly into the network. Common preprocessing includes:

1. Convert to grayscale.
2. Resize the image.
3. Crop or downsample to a fixed resolution.
4. Stack recent frames.

A typical processed state is:

$$
s_t = (x_{t-3},x_{t-2},x_{t-1},x_t)
$$

Plain-English explanation: the state is made from the four most recent processed frames.

Frame stacking gives the network motion information. A single image cannot reveal velocity. For example, from one frame of Pong, you may see the ball but not its direction.

---

## 6.5 Action repeat

In Atari DQN, the selected action is often repeated for several frames.

If action repeat is $k=4$, then:

$$
a_t = a_{t+1}=a_{t+2}=a_{t+3}
$$

Plain-English explanation: the same chosen action is applied for four consecutive emulator frames.

Action repeat reduces computation and makes control less twitchy. It also changes the effective time scale of the environment.

---

## 6.6 Human-normalized score

Human-normalized score is commonly computed as:

$$
\text{Human-normalized score}
=
\frac{
\text{Agent score} - \text{Random score}
}{
\text{Human score} - \text{Random score}
}
\times 100\%
$$

Plain-English explanation: this measures where the agent falls between random performance and human performance.

A score of $0\%$ means random-level performance:

$$
\text{Agent score} = \text{Random score}
$$

Plain-English explanation: the agent is no better than random play.

A score of $100\%$ means human-level performance:

$$
\text{Agent score} = \text{Human score}
$$

Plain-English explanation: the agent matches the benchmark human score.

A score above $100\%$ means superhuman performance under that metric.

Human-normalized score made it easier to average results across games with very different raw scoring scales. But it can be misleading because some games have strange score distributions, and "human score" depends on the evaluation protocol.

---

## 6.7 Why Atari became the standard

Atari became the deep RL standard because it sat in a sweet spot:

- Harder than tabular gridworlds
- Easier to standardize than robotics
- Rich enough for visual representation learning
- Discrete action space suitable for DQN
- Many tasks under one interface
- Clear numeric scores
- Compatible with massive automated training

It was not perfect. It encouraged overfitting to simulator quirks, benchmark-specific engineering, and reward-maximizing behavior that may not correspond to broader intelligence. Still, it created a shared arena where deep RL algorithms could be compared.

---

# Part 7 — Debugging checklist

## 7.1 Ordered checklist for "my DQN won't learn"

### 1. Verify the environment loop first

Before blaming DQN, check that the environment interaction is correct.

Confirm:

- Observations have the expected shape.
- Actions are valid integers.
- Rewards are being received.
- `done` or `terminated/truncated` flags are handled correctly.
- Episode returns are logged correctly.
- Random policy produces plausible behavior.

A broken environment loop can look exactly like a broken RL algorithm.

---

### 2. Check reward signal and reward scale

Print reward statistics:

- Mean reward
- Min/max reward
- Fraction of zero rewards
- Episode return distribution

If all rewards are zero, your DQN has nothing useful to learn from.

For clipped rewards, verify:

$$
r_{\text{clip}} \in \{-1,0,1\}
$$

Plain-English explanation: after clipping, every reward should be negative one, zero, or positive one.

For unclipped rewards, estimate the plausible Q-value scale:

$$
|Q(s,a)| \lesssim \frac{R_{\max}}{1-\gamma}
$$

Plain-English explanation: if rewards are bounded by $R_{\max}$, Q-values much larger than this bound are suspicious.

---

### 3. Overfit a tiny setting

Before training on the full environment, test whether the network can overfit a tiny replay buffer.

For a fixed batch, the loss should decrease:

$$
L_t \downarrow
$$

Plain-English explanation: if the data is fixed and the target is fixed, the supervised regression problem should become easier over gradient steps.

If it cannot overfit a tiny batch, your bug is probably in:

- Network output shape
- Action indexing
- Target calculation
- Loss calculation
- Optimizer step
- Gradient flow

---

### 4. Verify Q-value action indexing

The network outputs:

$$
Q(s,\cdot;\theta) \in \mathbb{R}^{|\mathcal{A}|}
$$

Plain-English explanation: for each state, the network returns one Q-value per action.

The loss should use only the selected action:

$$
Q(s,a;\theta)
$$

Plain-English explanation: the update should train the value of the action actually taken in the sampled transition.

In PyTorch:

```python
q_values = online_net(states)
q_sa = q_values.gather(1, actions.long().unsqueeze(1)).squeeze(1)
```

Common bugs:

- Using all action outputs against one scalar target
- Wrong action dtype
- Wrong action shape
- Off-by-one action indices
- Accidentally gathering along the batch dimension

---

### 5. Confirm terminal handling

For terminal transitions, the target should be:

$$
y = r
$$

Plain-English explanation: if the episode ended, there is no next-state value to bootstrap from.

For non-terminal transitions:

$$
y = r + \gamma \max_{a'}Q(s',a';\theta^-)
$$

Plain-English explanation: if the episode continues, include discounted future value.

The combined formula is:

$$
y = r + \gamma(1-d)\max_{a'}Q(s',a';\theta^-)
$$

Plain-English explanation: the done flag $d$ turns off bootstrapping when the transition is terminal.

Common bug:

```python
target = reward + gamma * done * next_q
```

This is wrong if `done=1` means terminal. It should usually be:

```python
target = reward + gamma * (1 - done) * next_q
```

---

### 6. Confirm the target network is actually frozen

The target network should not receive gradients.

Check:

```python
with torch.no_grad():
    next_q = target_net(next_states).max(dim=1).values
```

Also check:

```python
for p in target_net.parameters():
    assert p.grad is None
```

The target network should be updated only by explicit copying or Polyak averaging.

Hard update:

```python
target_net.load_state_dict(online_net.state_dict())
```

Soft update:

```python
for target_param, online_param in zip(target_net.parameters(), online_net.parameters()):
    target_param.data.copy_(tau * online_param.data + (1 - tau) * target_param.data)
```

If the target network is accidentally optimized by Adam, DQN becomes much less stable.

---

### 7. Inspect Q-value magnitudes

Log:

- Mean Q-value
- Max Q-value
- Min Q-value
- Mean absolute Q-value
- Q-values for fixed validation states

For clipped rewards and $\gamma=0.99$:

$$
|Q| \gg 100
$$

Plain-English explanation: if reward is clipped to $[-1,1]$, Q-values far above $100$ in magnitude are suspicious.

Exploding Q-values usually suggest:

- Learning rate too high
- Target not detached
- Bad reward scale
- Terminal states bootstrapped incorrectly
- Target network updated too frequently
- Loss too sensitive to large TD errors

---

### 8. Inspect TD errors

Log TD error statistics:

$$
\delta = y - Q(s,a;\theta)
$$

Plain-English explanation: the TD error shows how far predictions are from their bootstrapped targets.

Track:

- Mean TD error
- Mean absolute TD error
- Max absolute TD error
- TD error histogram

If TD errors explode, reduce learning rate, use Huber loss, clip gradients, and check target construction.

---

### 9. Check replay sampling

Verify that sampled batches contain diverse transitions.

Check:

- Multiple episodes represented
- Different actions represented
- Rewards are not all identical
- Done flags appear when expected
- States and next states are correctly paired
- Replay buffer is not returning uninitialized entries

A common silent bug is sampling from buffer slots that have not yet been filled.

Use:

$$
|\mathcal{D}| \geq N_{\text{warmup}}
$$

Plain-English explanation: only begin sampling after the buffer contains enough real transitions.

---

### 10. Check exploration schedule

Log epsilon over time:

$$
\epsilon_t
$$

Plain-English explanation: epsilon controls how often the agent takes random actions.

Common bugs:

- Epsilon instantly decays to minimum.
- Epsilon never decays.
- Evaluation still uses high epsilon.
- Training uses greedy actions too early.
- Random action sampling is biased.

During evaluation, use either greedy policy or a small fixed epsilon:

$$
a = \arg\max_a Q(s,a;\theta)
$$

Plain-English explanation: evaluation should usually measure the policy implied by the learned Q-values, not a highly random behavior policy.

---

### 11. Compare random, heuristic, and learned policy

Always compare against a random baseline.

If DQN is worse than random, suspect:

- Action mapping bug
- Reward sign bug
- Observation preprocessing bug
- Incorrect frame stacking
- Network output-action mismatch
- Evaluation using the wrong model

If a simple heuristic beats DQN easily, inspect whether the agent can observe the information that heuristic uses.

---

### 12. Check observation preprocessing

For image-based DQN, visualize preprocessed frames.

Confirm:

- Correct grayscale conversion
- Correct resizing
- Correct frame order
- Pixel values normalized consistently
- No blank frames
- No channel/order mismatch
- Frame stack contains different frames

Expected tensor shapes might be:

$$
(B, C, H, W)
$$

Plain-English explanation: PyTorch convolutional networks usually expect batch size, channels, height, and width in that order.

A common bug is accidentally using:

$$
(B, H, W, C)
$$

Plain-English explanation: this channel-last format is not what standard PyTorch convolution layers expect.

---

### 13. Check update frequency

If you train too rarely, the agent may collect lots of data but barely learn.

If you train too often, the agent may overfit stale replay data.

A common setup is:

$$
\text{one gradient update every } k \text{ environment steps}
$$

Plain-English explanation: the agent interacts with the environment for a few steps, then performs a learning update.

Typical values are $k=1$ to $4$.

---

### 14. Reduce the learning rate

When in doubt, reduce the learning rate.

If using:

$$
\alpha = 10^{-3}
$$

Plain-English explanation: this may be too aggressive for unstable bootstrapped value learning.

Try:

$$
\alpha = 10^{-4}
$$

Plain-English explanation: this smaller step size often makes DQN much more stable.

If Q-values still explode, try:

$$
\alpha = 5\times 10^{-5}
$$

Plain-English explanation: very small learning rates can help when targets are noisy or rewards are large.

---

### 15. Use Huber loss and gradient clipping

For DQN, prefer:

```python
loss = torch.nn.functional.smooth_l1_loss(q_sa, target)
```

Then clip gradients:

```python
torch.nn.utils.clip_grad_norm_(online_net.parameters(), max_norm=10.0)
```

This corresponds to limiting extreme update pressure from large TD errors.

---

### 16. Test target updates

Log the parameter distance:

$$
\|\theta - \theta^-\|_2
$$

Plain-English explanation: this measures how different the online and target networks are.

If the distance is always zero, you may be updating the target too often or accidentally sharing the same object:

```python
target_net = online_net
```

That is wrong. It creates two references to the same network.

You need:

```python
target_net = copy.deepcopy(online_net)
```

If the distance grows forever, the target network may never be updated.

---

### 17. Evaluate with fixed seeds and fixed states

Keep a small set of validation states:

$$
\{s^{(1)},s^{(2)},\dots,s^{(K)}\}
$$

Plain-English explanation: these states let you track how Q-values evolve over training.

Log:

$$
Q(s^{(k)},a;\theta)
$$

Plain-English explanation: fixed-state Q-values reveal whether the network is learning smoothly, drifting, or exploding.

This is often more informative than loss alone.

---

### 18. Make the task easier

If DQN fails on the full task, simplify.

Try:

- Smaller environment
- Shaped rewards
- Shorter horizon
- Lower observation dimension
- No frame stacking initially
- Smaller network
- Fixed replay dataset
- Deterministic seed
- Less aggressive discount

The goal is to isolate whether the bug is algorithmic, implementation-level, or task difficulty.

---

## 7.2 Common DQN bug table

| Symptom | Likely cause | First fix |
|---|---|---|
| Loss is NaN | Learning rate too high, bad targets, exploding gradients | Lower LR, clip gradients, inspect rewards |
| Q-values explode | Target not detached, terminal bug, LR too high | Check `no_grad`, done mask, LR |
| Return flatlines | Bad exploration, reward too sparse, replay issue | Inspect epsilon and reward stats |
| Learns then collapses | Target updates too fast, LR too high, replay too small | Slower target updates, lower LR, larger buffer |
| Loss decreases but return does not improve | Wrong action indexing, bad evaluation, overfitting replay | Check `gather`, evaluate greedily |
| Agent always chooses one action | Epsilon too low, action-value collapse, reward imbalance | Increase exploration, inspect Q-values |
| Target network same as online always | Shared object reference | Use `copy.deepcopy` |
| Terminal transitions overvalued | Incorrect done mask | Use $(1-d)$ in target |
| Training very slow | LR too low, epsilon too high, buffer too stale | Tune LR, decay epsilon, inspect replay |
| PER makes learning worse | Over-prioritizing noisy transitions | Lower $\alpha$, increase $\beta$, cap priorities |

---

# Further topics

## Distributional RL

Standard DQN estimates the expected return:

$$
Q(s,a) = \mathbb{E}[G_t \mid s_t=s,a_t=a]
$$

Plain-English explanation: DQN predicts the average discounted return from taking action $a$ in state $s$.

Distributional RL models the full return distribution:

$$
Z(s,a) \overset{D}{=} R + \gamma Z(s',a')
$$

Plain-English explanation: instead of predicting only the mean return, distributional RL predicts a random variable representing possible returns.

Important methods include:

- **C51**: represents the return distribution using categorical atoms.
- **QR-DQN**: represents the return distribution using quantile regression.
- **IQN**: learns implicit quantile functions.

Distributional methods often improve performance because they preserve more information about uncertainty and multimodality in returns.

---

## Continuous actions: DDPG, TD3, and SAC

DQN relies on a discrete action max:

$$
\max_{a'} Q(s',a';\theta^-)
$$

Plain-English explanation: DQN can enumerate all possible actions and choose the largest Q-value.

For continuous actions, this maximization is not easy because there are infinitely many possible actions.

Actor-critic methods solve this by learning a policy network:

$$
a = \pi(s;\phi)
$$

Plain-English explanation: the actor network directly outputs an action for the current state.

Important continuous-control algorithms include:

- **DDPG**: deterministic actor-critic with replay and target networks.
- **TD3**: improves DDPG using clipped double Q-learning, delayed policy updates, and target policy smoothing.
- **SAC**: learns a stochastic policy with entropy regularization.

SAC's objective includes entropy:

$$
J(\pi)=\mathbb{E}\left[\sum_t \gamma^t \left(r_t + \alpha \mathcal{H}(\pi(\cdot|s_t))\right)\right]
$$

Plain-English explanation: SAC rewards both high task return and high policy entropy, encouraging exploration and robustness.

---

## Transition to policy-gradient methods

DQN learns values and derives a policy indirectly:

$$
\pi(s)=\arg\max_a Q(s,a)
$$

Plain-English explanation: the policy is obtained by choosing the action with the highest learned value.

Policy-gradient methods directly optimize the policy:

$$
\nabla_\theta J(\theta)
=
\mathbb{E}\left[
\nabla_\theta \log \pi_\theta(a_t|s_t) A_t
\right]
$$

Plain-English explanation: the policy parameters are updated to make advantageous actions more likely and disadvantageous actions less likely.

This shift matters because policy-gradient methods can naturally handle:

- Stochastic policies
- Continuous actions
- Differentiable action distributions
- Entropy regularization
- On-policy optimization
- Large modern actor-critic systems

The conceptual bridge is:

- DQN: learn $Q$, act greedily.
- Actor-critic: learn both a policy and a value function.
- Policy gradient: optimize the policy directly.

DQN is the gateway drug. Actor-critic is where much of modern deep RL lives.
