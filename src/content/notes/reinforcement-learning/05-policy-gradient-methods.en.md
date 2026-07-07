---
subject: "Self Learning"
chapter: 5
title: "Policy-Gradient Methods"
language: en
---

# Policy-Gradient Methods

Policy-gradient methods are the complementary paradigm to value-based reinforcement learning. Instead of learning a value function first and deriving a policy by greedy action selection, policy-gradient methods **learn the policy directly**.

Value-based methods ask:

$$
Q^\*(s,a) \rightarrow \pi(s) = \arg\max_a Q^\*(s,a)
$$

Plain English: first learn how good each action is in each state, then choose the action with the highest estimated value.

Policy-gradient methods ask:

$$
\pi_\theta(a|s) \rightarrow \max_\theta J(\theta)
$$

Plain English: directly parametrize the policy with parameters $\theta$ and adjust those parameters to maximize expected return.

This shift matters because many real RL problems are difficult or awkward for pure value-based methods: continuous control, stochastic decision-making, robotics, games with mixed strategies, and modern alignment methods such as RLHF.

---

# Part 1 — Motivation: Why Learn the Policy Directly?

## 1.1 Recap: the value-based approach

In value-based RL, the main object is usually the **action-value function**:

$$
Q^\pi(s,a) = \mathbb{E}_\pi[G_t \mid S_t=s, A_t=a]
$$

Plain English: $Q^\pi(s,a)$ is the expected return after taking action $a$ in state $s$ and then following policy $\pi$ afterward.

In optimal control, we try to learn:

$$
Q^\*(s,a) = \max_\pi Q^\pi(s,a)
$$

Plain English: $Q^\*(s,a)$ is the best possible expected return achievable after taking action $a$ in state $s$.

Then the policy is obtained greedily:

$$
\pi^\*(s) = \arg\max_a Q^\*(s,a)
$$

Plain English: once we know the optimal action-value function, we act by choosing the action with the highest value.

This works beautifully in tabular Q-learning and is the foundation of DQN. But it has three major limitations.

---

## 1.2 Limitation 1: Continuous action spaces

In DQN-style value methods, action selection requires:

$$
a^\* = \arg\max_a Q_\phi(s,a)
$$

Plain English: to act greedily, we must search over all possible actions and pick the one with the largest predicted value.

This is manageable when the action set is small and discrete, for example:

$$
\mathcal{A} = \{\text{left}, \text{right}, \text{jump}, \text{shoot}\}
$$

Plain English: with only a few actions, we can evaluate $Q(s,a)$ for every action and choose the largest one.

But in continuous control, the action space might be:

$$
a \in \mathbb{R}^d
$$

Plain English: the action is now a real-valued vector, such as torque values for robot joints.

For example, a robotic arm may need to output continuous motor torques:

$$
a = (\tau_1, \tau_2, \dots, \tau_d)
$$

Plain English: the action consists of several continuous torque values, one for each joint.

Now the greedy action selection problem becomes a difficult optimization problem inside every environment step:

$$
\arg\max_{a \in \mathbb{R}^d} Q_\phi(s,a)
$$

Plain English: instead of comparing a few actions, the agent must solve a continuous optimization problem every time it acts.

Policy-gradient methods avoid this by directly outputting an action distribution or action value from the policy.

---

## 1.3 Limitation 2: Stochastic policies

Value-based methods often produce deterministic greedy policies:

$$
\pi(s) = \arg\max_a Q(s,a)
$$

Plain English: the policy always chooses the currently best-looking action.

Exploration is usually added artificially, for example with $\epsilon$-greedy:

$$
\pi(a|s)=
\begin{cases}
1-\epsilon+\frac{\epsilon}{|\mathcal{A}|}, & a = \arg\max_{a'} Q(s,a') \\
\frac{\epsilon}{|\mathcal{A}|}, & \text{otherwise}
\end{cases}
$$

Plain English: most of the time we choose the greedy action, but with small probability $\epsilon$ we choose randomly.

But some environments naturally require stochastic policies. For example:

- In games, deterministic behavior can be exploited.
- In partially observable environments, randomness can be useful.
- In multi-agent systems, mixed strategies may be optimal.
- In RLHF, language generation is naturally probabilistic.

A policy-gradient method can directly represent:

$$
\pi_\theta(a|s)
$$

Plain English: the policy gives a probability distribution over actions instead of only choosing the single highest-valued action.

---

## 1.4 Limitation 3: Discontinuous greedy action selection

The greedy policy depends on an $\arg\max$:

$$
\pi(s) = \arg\max_a Q_\phi(s,a)
$$

Plain English: the chosen action is whichever action currently has the highest estimated value.

The problem is that small changes in $Q_\phi$ can cause sudden changes in the selected action. For example, suppose:

$$
Q_\phi(s,a_1)=10.01,\qquad Q_\phi(s,a_2)=10.00
$$

Plain English: action $a_1$ is barely better than action $a_2$, so the greedy policy chooses $a_1$.

After a tiny parameter update:

$$
Q_\phi(s,a_1)=9.99,\qquad Q_\phi(s,a_2)=10.00
$$

Plain English: now action $a_2$ is barely better, so the greedy policy suddenly switches to $a_2$.

The value function changed smoothly, but the greedy policy changed discontinuously. Policy-gradient methods instead optimize the policy parameters directly, giving smoother control over behavior.

---

## 1.5 The policy-based paradigm

Policy-gradient methods parametrize the policy directly:

$$
\pi_\theta(a|s)
$$

Plain English: the policy is a differentiable function with parameters $\theta$ that maps states to action probabilities.

The goal is to maximize expected return:

$$
\theta^\* = \arg\max_\theta J(\theta)
$$

Plain English: we want to find the policy parameters that produce the highest expected long-term reward.

The parameters are updated by gradient ascent:

$$
\theta \leftarrow \theta + \alpha \nabla_\theta J(\theta)
$$

Plain English: adjust the policy parameters in the direction that increases expected return.

This is different from supervised learning, where we usually minimize a loss:

$$
\theta \leftarrow \theta - \alpha \nabla_\theta \mathcal{L}(\theta)
$$

Plain English: in supervised learning we often move downhill on a loss, while in policy gradients we move uphill on expected return.

---

## 1.6 Three major RL families

### Value-based methods

Value-based methods learn $V(s)$ or $Q(s,a)$ and derive the policy from values.

The central object is:

$$
Q_\phi(s,a)
$$

Plain English: the model estimates how good each action is in each state.

The policy is usually implicit:

$$
\pi(s)=\arg\max_a Q_\phi(s,a)
$$

Plain English: the policy is not directly learned; it is obtained by greedily choosing the action with the highest value.

Examples:

- Dynamic programming
- Monte Carlo control
- SARSA
- Q-learning
- DQN
- Double DQN
- Dueling DQN

---

### Policy-based methods

Policy-based methods directly learn the policy:

$$
\pi_\theta(a|s)
$$

Plain English: the model directly outputs how likely each action is.

The value function may be absent or used only for analysis. The core optimization target is:

$$
J(\theta)
$$

Plain English: the objective is the expected return produced by the policy.

Examples:

- REINFORCE
- Vanilla policy gradient
- Evolution strategies-style direct policy search

---

### Actor-critic methods

Actor-critic methods learn both a policy and a value function:

$$
\pi_\theta(a|s), \qquad V_\phi(s)
$$

Plain English: the actor decides what to do, while the critic estimates how good the situation is.

Or sometimes:

$$
\pi_\theta(a|s), \qquad Q_\phi(s,a)
$$

Plain English: the actor chooses actions, while the critic evaluates state-action pairs.

Actor-critic methods combine the strengths of both families:

- The **actor** gives direct policy optimization.
- The **critic** gives value-based feedback.
- The result is often lower variance than pure policy gradients and more flexible than pure value methods.

Examples:

- A2C
- A3C
- PPO
- DDPG
- TD3
- SAC

---

# Part 2 — The Objective and the Policy Gradient Theorem

## 2.1 Trajectories

A **trajectory** is a full sequence of interaction with the environment:

$$
\tau = (s_0,a_0,r_0,s_1,a_1,r_1,\dots,s_T)
$$

Plain English: a trajectory is one rollout or episode: states, actions, rewards, and next states over time.

The return of a trajectory is commonly written as:

$$
R(\tau)=\sum_{t=0}^{T} \gamma^t r_t
$$

Plain English: the trajectory return is the discounted sum of rewards collected during the episode.

Here $\gamma \in [0,1]$ is the discount factor:

$$
\gamma \in [0,1]
$$

Plain English: $\gamma$ controls how much future rewards matter compared with immediate rewards.

If $\gamma$ is close to $1$, the agent cares strongly about long-term reward. If $\gamma$ is close to $0$, it mainly cares about immediate reward.

---

## 2.2 The policy-gradient objective

The policy induces a distribution over trajectories:

$$
\tau \sim \pi_\theta
$$

Plain English: if the agent follows policy $\pi_\theta$, it will generate trajectories according to the probabilities induced by that policy and the environment dynamics.

The objective is expected return:

$$
J(\theta)=\mathbb{E}_{\tau \sim \pi_\theta}[R(\tau)]
$$

Plain English: $J(\theta)$ is the average return we expect to get when following policy $\pi_\theta$.

Equivalently:

$$
J(\theta)=\sum_\tau P_\theta(\tau)R(\tau)
$$

Plain English: expected return is the sum over all possible trajectories of each trajectory's probability times its return.

The goal is:

$$
\max_\theta J(\theta)
$$

Plain English: choose policy parameters that make high-return trajectories more likely.

---

## 2.3 Trajectory probability

For an episodic Markov decision process, the probability of a trajectory is:

$$
P_\theta(\tau)=\rho_0(s_0)\prod_{t=0}^{T-1}\pi_\theta(a_t|s_t)P(s_{t+1}|s_t,a_t)
$$

Plain English: a trajectory's probability comes from the initial state distribution, the policy's action probabilities, and the environment's transition probabilities.

Here:

- $\rho_0(s_0)$ is the initial state distribution.
- $\pi_\theta(a_t|s_t)$ is the policy.
- $P(s_{t+1}|s_t,a_t)$ is the environment transition function.

The important observation is that only the policy depends on $\theta$:

$$
\nabla_\theta P(s_{t+1}|s_t,a_t)=0
$$

Plain English: the environment dynamics are not directly controlled by the policy parameters.

Also:

$$
\nabla_\theta \rho_0(s_0)=0
$$

Plain English: the initial state distribution is not controlled by the policy parameters either.

So when differentiating trajectory probabilities, the gradient flows through the policy terms.

---

## 2.4 The problem: gradient of an expectation

We want:

$$
\nabla_\theta J(\theta)
$$

Plain English: we want to know how changing the policy parameters changes expected return.

Starting from the objective:

$$
J(\theta)=\sum_\tau P_\theta(\tau)R(\tau)
$$

Plain English: expected return is the probability-weighted average return over trajectories.

Differentiate with respect to $\theta$:

$$
\nabla_\theta J(\theta)=\sum_\tau \nabla_\theta P_\theta(\tau)R(\tau)
$$

Plain English: the return itself does not directly depend on $\theta$ once the trajectory is fixed, so the gradient acts on the trajectory probability.

But this is awkward because it contains:

$$
\nabla_\theta P_\theta(\tau)
$$

Plain English: directly differentiating the probability of a full trajectory is inconvenient.

The policy-gradient trick rewrites this into something sampleable.

---

## 2.5 The log-derivative trick

The key identity is:

$$
\nabla_\theta P_\theta(\tau)=P_\theta(\tau)\nabla_\theta \log P_\theta(\tau)
$$

Plain English: the gradient of a probability can be rewritten as the probability times the gradient of its log-probability.

This follows from:

$$
\nabla_\theta \log P_\theta(\tau)=\frac{\nabla_\theta P_\theta(\tau)}{P_\theta(\tau)}
$$

Plain English: the derivative of the log of a function is the derivative of the function divided by the function itself.

Rearranging gives:

$$
\nabla_\theta P_\theta(\tau)=P_\theta(\tau)\nabla_\theta \log P_\theta(\tau)
$$

Plain English: multiplying both sides by $P_\theta(\tau)$ recovers the log-derivative identity.

Substitute into the gradient of the objective:

$$
\nabla_\theta J(\theta)=\sum_\tau P_\theta(\tau)\nabla_\theta \log P_\theta(\tau)R(\tau)
$$

Plain English: now the gradient is written as an expectation under the current policy's trajectory distribution.

Therefore:

$$
\nabla_\theta J(\theta)=\mathbb{E}_{\tau \sim \pi_\theta}\left[\nabla_\theta \log P_\theta(\tau)R(\tau)\right]
$$

Plain English: instead of differentiating through the whole environment, we can sample trajectories and compute gradients of log-probabilities of the actions the policy took.

This is the **score-function estimator**, also called the **REINFORCE trick** or **log-derivative trick**.

---

## 2.6 Expanding the trajectory log-probability

Recall:

$$
P_\theta(\tau)=\rho_0(s_0)\prod_{t=0}^{T-1}\pi_\theta(a_t|s_t)P(s_{t+1}|s_t,a_t)
$$

Plain English: the trajectory probability is a product of initial-state, policy, and transition probabilities.

Take logs:

$$
\log P_\theta(\tau)=\log \rho_0(s_0)+\sum_{t=0}^{T-1}\log \pi_\theta(a_t|s_t)+\sum_{t=0}^{T-1}\log P(s_{t+1}|s_t,a_t)
$$

Plain English: the log of a product becomes a sum of logs.

Now differentiate:

$$
\nabla_\theta \log P_\theta(\tau)=\sum_{t=0}^{T-1}\nabla_\theta \log \pi_\theta(a_t|s_t)
$$

Plain English: the initial-state and environment-transition terms disappear because they do not depend on the policy parameters.

Substitute this back into the objective gradient:

$$
\nabla_\theta J(\theta)=\mathbb{E}_{\tau \sim \pi_\theta}\left[\left(\sum_{t=0}^{T-1}\nabla_\theta \log \pi_\theta(a_t|s_t)\right)R(\tau)\right]
$$

Plain English: the gradient says to adjust the policy according to the log-probabilities of the actions taken, weighted by the return of the whole trajectory.

This is already a valid policy-gradient estimator.

---

## 2.7 Reward-to-go form

The full trajectory return is:

$$
R(\tau)=\sum_{k=0}^{T}\gamma^k r_k
$$

Plain English: this includes rewards from the whole episode, even rewards that happened before a given action.

But action $a_t$ cannot affect rewards that happened before time $t$. So we can replace the full trajectory return with the **reward-to-go**:

$$
G_t=\sum_{k=t}^{T}\gamma^{k-t}r_k
$$

Plain English: $G_t$ is the discounted return from time $t$ onward.

Then the policy gradient becomes:

$$
\nabla_\theta J(\theta)=\mathbb{E}_{\tau \sim \pi_\theta}\left[\sum_{t=0}^{T-1}\nabla_\theta \log \pi_\theta(a_t|s_t)G_t\right]
$$

Plain English: increase the probability of actions that were followed by high future return, and decrease the probability of actions that were followed by low future return.

This is the common REINFORCE gradient estimator.

---

## 2.8 The Policy Gradient Theorem

The Policy Gradient Theorem can be stated as:

$$
\nabla_\theta J(\theta)=\mathbb{E}_{s \sim d^{\pi_\theta},\, a \sim \pi_\theta}\left[\nabla_\theta \log \pi_\theta(a|s)Q^{\pi_\theta}(s,a)\right]
$$

Plain English: the gradient of expected return can be estimated by sampling states and actions from the current policy, then multiplying the score of the action by how good that action is.

Here $d^{\pi_\theta}(s)$ is the discounted state visitation distribution under policy $\pi_\theta$:

$$
d^{\pi_\theta}(s)=\sum_{t=0}^{\infty}\gamma^t P(S_t=s \mid \pi_\theta)
$$

Plain English: $d^{\pi_\theta}(s)$ measures how often the policy visits state $s$, with earlier states weighted more heavily when $\gamma < 1$.

The theorem is powerful because it avoids explicitly differentiating the state distribution:

$$
\nabla_\theta d^{\pi_\theta}(s)
$$

Plain English: although changing the policy changes which states the agent visits, the theorem gives a gradient formula that does not require us to explicitly compute that difficult derivative.

---

## 2.9 Plain-English interpretation

The core policy-gradient update is:

$$
\nabla_\theta \log \pi_\theta(a_t|s_t)G_t
$$

Plain English: this tells us how to change the policy parameters to make the sampled action more likely, scaled by how good the resulting return was.

If $G_t$ is high, the update increases the probability of $a_t$ in $s_t$:

$$
\theta \leftarrow \theta + \alpha \nabla_\theta \log \pi_\theta(a_t|s_t)G_t
$$

Plain English: when an action leads to good return, move the parameters so that action becomes more likely in that state.

If $G_t$ is low or negative, the same formula decreases the probability of that action:

$$
\theta \leftarrow \theta + \alpha \nabla_\theta \log \pi_\theta(a_t|s_t)G_t
$$

Plain English: if the return is bad, the gradient ascent step moves in the opposite direction, making that action less likely.

The slogan:

**Push up the probability of actions that led to better-than-expected outcomes; push down the probability of actions that led to worse outcomes.**

---

# Part 3 — REINFORCE

## 3.1 What REINFORCE is

**REINFORCE** is the simplest Monte Carlo policy-gradient algorithm. It estimates the policy gradient using complete sampled episodes.

Its gradient estimator is:

$$
\hat{g}=\sum_{t=0}^{T-1}\nabla_\theta \log \pi_\theta(a_t|s_t)G_t
$$

Plain English: for each step in the episode, compute how much the policy favored the action it took, then weight that by the future return after that action.

The parameter update is:

$$
\theta \leftarrow \theta + \alpha \hat{g}
$$

Plain English: update the policy parameters in the estimated direction of higher expected return.

---

## 3.2 Full REINFORCE algorithm

1. Initialize policy parameters $\theta$ randomly.

2. For each training iteration, collect one or more full episodes by following the current policy:

$$
a_t \sim \pi_\theta(\cdot|s_t)
$$

Plain English: at every state, sample an action from the current policy distribution.

3. For each timestep $t$, compute the return-to-go:

$$
G_t=\sum_{k=t}^{T}\gamma^{k-t}r_k
$$

Plain English: compute the total discounted future reward from timestep $t$ onward.

4. Compute the policy-gradient estimate:

$$
\hat{g}=\sum_{t=0}^{T-1}\nabla_\theta \log \pi_\theta(a_t|s_t)G_t
$$

Plain English: combine the policy's action log-probability gradients with the returns those actions received.

5. Update the policy parameters by gradient ascent:

$$
\theta \leftarrow \theta + \alpha \hat{g}
$$

Plain English: move the policy parameters in the direction that makes high-return actions more likely.

6. Repeat until performance converges or the training budget is exhausted.

---

## 3.3 REINFORCE as a loss function

In deep learning frameworks, we usually minimize losses rather than maximize objectives. So we often define the policy-gradient loss as:

$$
\mathcal{L}_{\text{PG}}(\theta)=-\sum_{t=0}^{T-1}\log \pi_\theta(a_t|s_t)G_t
$$

Plain English: minimizing this negative objective is equivalent to maximizing the probability of actions that produced high return.

Taking a gradient descent step on this loss gives:

$$
\theta \leftarrow \theta - \alpha \nabla_\theta \mathcal{L}_{\text{PG}}(\theta)
$$

Plain English: because the loss has a negative sign, gradient descent on the loss becomes gradient ascent on expected return.

---

## 3.4 Why REINFORCE has high variance

REINFORCE is unbiased but noisy.

The return-to-go is:

$$
G_t=\sum_{k=t}^{T}\gamma^{k-t}r_k
$$

Plain English: the learning signal for action $a_t$ depends on all future rewards in the episode.

This creates high variance because:

- Rewards far in the future may depend on many later random actions.
- Environment stochasticity affects the observed return.
- A good action may be followed by unlucky events.
- A bad action may be followed by lucky events.
- Long episodes produce very noisy returns.

The estimator is unbiased:

$$
\mathbb{E}[\hat{g}]=\nabla_\theta J(\theta)
$$

Plain English: averaged over infinitely many sampled episodes, the REINFORCE gradient estimate equals the true policy gradient.

But its variance can be large:

$$
\mathrm{Var}[\hat{g}] \text{ can be high}
$$

Plain English: individual gradient estimates can swing wildly from episode to episode, making learning unstable and sample-inefficient.

This is why variance reduction is central to policy-gradient methods.

---

# Part 4 — Variance Reduction

## 4.1 The baseline idea

Instead of weighting the policy gradient by raw return $G_t$, we subtract a baseline $b(s_t)$:

$$
\hat{g}=\sum_{t=0}^{T-1}\nabla_\theta \log \pi_\theta(a_t|s_t)\left(G_t-b(s_t)\right)
$$

Plain English: instead of asking whether the return was high in absolute terms, ask whether it was higher than expected for that state.

The baseline can depend on the state:

$$
b=b(s_t)
$$

Plain English: the baseline estimates what return is normal from this state.

But it must not depend on the sampled action in a way that changes the expectation:

$$
b(s_t) \neq b(s_t,a_t)
$$

Plain English: the usual unbiasedness proof requires the baseline to be independent of the particular action sampled from the policy.

---

## 4.2 Why baselines do not add bias

We need to show that subtracting $b(s)$ does not change the expected policy gradient.

For a fixed state $s$:

$$
\mathbb{E}_{a \sim \pi_\theta(\cdot|s)}[\nabla_\theta \log \pi_\theta(a|s)b(s)]
$$

Plain English: this is the expected extra term introduced by subtracting the baseline.

Because $b(s)$ does not depend on $a$, move it outside the expectation:

$$
b(s)\mathbb{E}_{a \sim \pi_\theta(\cdot|s)}[\nabla_\theta \log \pi_\theta(a|s)]
$$

Plain English: since the baseline is the same for all sampled actions in this state, it factors out.

Now expand the expectation:

$$
b(s)\sum_a \pi_\theta(a|s)\nabla_\theta \log \pi_\theta(a|s)
$$

Plain English: the expectation over actions is the probability-weighted sum over possible actions.

Use the log-derivative identity:

$$
\nabla_\theta \log \pi_\theta(a|s)=\frac{\nabla_\theta \pi_\theta(a|s)}{\pi_\theta(a|s)}
$$

Plain English: the gradient of the log-probability is the gradient of the probability divided by the probability.

Substitute:

$$
b(s)\sum_a \pi_\theta(a|s)\frac{\nabla_\theta \pi_\theta(a|s)}{\pi_\theta(a|s)}
$$

Plain English: the policy probability cancels with the denominator.

So:

$$
b(s)\sum_a \nabla_\theta \pi_\theta(a|s)
$$

Plain English: the baseline term reduces to the gradient of the sum of all action probabilities.

Move the gradient outside the sum:

$$
b(s)\nabla_\theta \sum_a \pi_\theta(a|s)
$$

Plain English: differentiating the sum is the same as summing the derivatives.

But action probabilities sum to one:

$$
\sum_a \pi_\theta(a|s)=1
$$

Plain English: the policy must assign total probability one across all actions.

Therefore:

$$
b(s)\nabla_\theta 1=0
$$

Plain English: the gradient of a constant is zero.

So:

$$
\mathbb{E}_{a \sim \pi_\theta(\cdot|s)}[\nabla_\theta \log \pi_\theta(a|s)b(s)]=0
$$

Plain English: the baseline contributes zero in expectation, so it does not bias the gradient.

Therefore the baseline-adjusted estimator remains unbiased:

$$
\mathbb{E}\left[\nabla_\theta \log \pi_\theta(a|s)(G_t-b(s))\right]
=
\mathbb{E}\left[\nabla_\theta \log \pi_\theta(a|s)G_t\right]
$$

Plain English: subtracting a state-dependent baseline changes the variance of the estimator but not its expected value.

---

## 4.3 Why baselines reduce variance

Without a baseline, an action is reinforced based on raw return:

$$
G_t
$$

Plain English: the update treats all high-return states as equally good, even if high return was already expected from that state.

With a baseline, the update uses:

$$
G_t-b(s_t)
$$

Plain English: the policy is updated according to whether the action performed better or worse than the state's usual outcome.

Suppose a state normally gives return around $100$. If an action gives return $101$, raw REINFORCE treats it as strongly positive. But relative to expectation, it is only slightly good.

That relative signal is exactly what we want.

---

## 4.4 The advantage function

The natural baseline is the value function:

$$
b(s)=V^\pi(s)
$$

Plain English: use the expected return from the state as the baseline.

Then the policy gradient uses:

$$
Q^\pi(s,a)-V^\pi(s)
$$

Plain English: compare the value of taking action $a$ with the average value of being in state $s$.

This quantity is the **advantage function**:

$$
A^\pi(s,a)=Q^\pi(s,a)-V^\pi(s)
$$

Plain English: the advantage measures how much better or worse an action is compared with the policy's usual behavior in that state.

The policy-gradient theorem can therefore be written as:

$$
\nabla_\theta J(\theta)=
\mathbb{E}_{s,a \sim \pi_\theta}
\left[
\nabla_\theta \log \pi_\theta(a|s)A^{\pi_\theta}(s,a)
\right]
$$

Plain English: increase the probability of actions with positive advantage and decrease the probability of actions with negative advantage.

This is the core idea behind actor-critic methods.

---

## 4.5 Intuition: return vs advantage

Raw return asks:

$$
G_t
$$

Plain English: how much reward did we get after this action?

Advantage asks:

$$
G_t - V(s_t)
$$

Plain English: did this action do better or worse than expected from this state?

This distinction matters. A mediocre action in an easy state may produce high return. A good action in a terrible state may produce low return. The advantage function gives a fairer learning signal.

---

# Part 5 — Actor-Critic

## 5.1 The actor and the critic

**Actor-critic** methods combine policy-based and value-based learning.

The **actor** is the policy:

$$
\pi_\theta(a|s)
$$

Plain English: the actor decides which actions to take.

The **critic** is a learned value function, often:

$$
V_\phi(s)
$$

Plain English: the critic estimates how good a state is under the current policy.

Sometimes the critic estimates an action-value function:

$$
Q_\phi(s,a)
$$

Plain English: this critic estimates how good a particular action is in a particular state.

The actor updates the policy. The critic provides the learning signal.

---

## 5.2 Actor-critic as synthesis

Value-based RL learns values and derives a policy:

$$
Q_\phi(s,a) \rightarrow \pi(s)=\arg\max_a Q_\phi(s,a)
$$

Plain English: values are primary, and the policy is obtained from them.

Policy-gradient RL learns the policy directly:

$$
\pi_\theta(a|s) \rightarrow \nabla_\theta J(\theta)
$$

Plain English: the policy is primary, and we optimize it directly.

Actor-critic uses both:

$$
(\pi_\theta(a|s), V_\phi(s))
$$

Plain English: the actor learns how to act, while the critic learns how to evaluate.

This gives a practical compromise:

- More flexible than pure value methods.
- Lower variance than pure REINFORCE.
- Usually more sample-efficient than Monte Carlo policy gradient.
- Often more stable in deep RL.

---

## 5.3 Replacing Monte Carlo returns with TD estimates

REINFORCE uses the Monte Carlo return:

$$
G_t=\sum_{k=t}^{T}\gamma^{k-t}r_k
$$

Plain English: REINFORCE waits until future rewards are observed and uses the full return-to-go.

Actor-critic often uses a bootstrapped TD target:

$$
r_t+\gamma V_\phi(s_{t+1})
$$

Plain English: instead of waiting for the full future, estimate future return using the critic's value estimate of the next state.

The TD error is:

$$
\delta_t = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)
$$

Plain English: the TD error measures whether the reward plus predicted next value was better or worse than expected from the current state.

The TD error can be used as an estimate of the advantage:

$$
A^\pi(s_t,a_t) \approx \delta_t
$$

Plain English: if the TD error is positive, the action turned out better than expected; if negative, worse than expected.

Then the actor update becomes:

$$
\nabla_\theta J(\theta) \approx
\nabla_\theta \log \pi_\theta(a_t|s_t)\delta_t
$$

Plain English: update the policy using the TD error as the learning signal.

The critic is trained by minimizing the squared TD error:

$$
\mathcal{L}_V(\phi)=\frac{1}{2}\left(r_t+\gamma V_\phi(s_{t+1})-V_\phi(s_t)\right)^2
$$

Plain English: train the critic so that its value estimate for the current state matches the reward plus discounted value of the next state.

---

## 5.4 Bias-variance tradeoff

Monte Carlo return:

$$
G_t
$$

Plain English: this is an unbiased sample of the return but can have high variance.

TD target:

$$
r_t+\gamma V_\phi(s_{t+1})
$$

Plain English: this has lower variance because it uses a learned estimate, but it can be biased if the critic is inaccurate.

So actor-critic trades variance for bias:

- REINFORCE: high variance, low bias.
- Actor-critic: lower variance, possible bias.
- Better critics usually make actor updates more reliable.

---

## 5.5 Advantage Actor-Critic

In **Advantage Actor-Critic**, the actor uses an advantage estimate:

$$
\hat{A}_t = G_t - V_\phi(s_t)
$$

Plain English: compare the observed return with the critic's expected return from that state.

Or with one-step TD:

$$
\hat{A}_t = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)
$$

Plain English: estimate advantage using the TD error.

The actor loss is often:

$$
\mathcal{L}_{\text{actor}}(\theta)=
-\log \pi_\theta(a_t|s_t)\hat{A}_t
$$

Plain English: minimizing this loss increases the probability of actions with positive advantage and decreases the probability of actions with negative advantage.

The critic loss is:

$$
\mathcal{L}_{\text{critic}}(\phi)=
\frac{1}{2}\left(\hat{R}_t - V_\phi(s_t)\right)^2
$$

Plain English: train the critic to predict a target return $\hat{R}_t$.

A common total loss is:

$$
\mathcal{L}(\theta,\phi)
=
\mathcal{L}_{\text{actor}}(\theta)
+
c_v\mathcal{L}_{\text{critic}}(\phi)
-
c_e\mathcal{H}(\pi_\theta(\cdot|s_t))
$$

Plain English: the total loss combines policy improvement, value prediction, and an entropy bonus that encourages exploration.

Here $\mathcal{H}$ is policy entropy:

$$
\mathcal{H}(\pi_\theta(\cdot|s))=
-\sum_a \pi_\theta(a|s)\log \pi_\theta(a|s)
$$

Plain English: entropy measures how spread out the policy distribution is; higher entropy means more randomness and exploration.

---

## 5.6 A2C and A3C

### A2C: Advantage Actor-Critic

**A2C** stands for **Advantage Actor-Critic**. It is synchronous.

Multiple environments collect rollouts in parallel. Then the gradients are aggregated and used in a single update.

Conceptually:

$$
\hat{g}=\frac{1}{N}\sum_{i=1}^{N}\sum_t
\nabla_\theta \log \pi_\theta(a_t^{(i)}|s_t^{(i)})\hat{A}_t^{(i)}
$$

Plain English: collect experience from $N$ parallel workers, average their policy-gradient estimates, and update the shared model.

A2C is stable because all workers update together.

---

### A3C: Asynchronous Advantage Actor-Critic

**A3C** stands for **Asynchronous Advantage Actor-Critic**.

Multiple workers interact with their own environment copies and update shared parameters asynchronously.

Conceptually:

$$
\theta_{\text{global}} \leftarrow \theta_{\text{global}} + \Delta \theta_i
$$

Plain English: each worker computes its own gradient update and applies it to the shared global policy.

A3C was important historically because asynchronous workers decorrelated experience and improved training efficiency before GPU-heavy vectorized environments became standard.

A2C is the simpler synchronous version and is easier to implement on modern hardware.

---

# Part 6 — Modern Policy Gradients

## 6.1 Why vanilla policy gradients are unstable

Vanilla policy-gradient updates can change the policy too much in one step.

The update is:

$$
\theta \leftarrow \theta + \alpha \nabla_\theta J(\theta)
$$

Plain English: move the policy parameters in the direction of higher expected return.

But a small parameter change can produce a large behavioral change:

$$
\pi_{\theta_{\text{old}}}(a|s) \not\approx \pi_\theta(a|s)
$$

Plain English: after an update, the new policy may behave very differently from the old policy.

This is dangerous because the gradient estimate was collected under the old policy. If the new policy moves too far away, the update can become destructive.

Modern policy-gradient methods try to keep policy updates controlled.

---

## 6.2 TRPO: Trust Region Policy Optimization

**TRPO** stands for **Trust Region Policy Optimization**.

The core idea: improve the policy, but do not let the new policy move too far from the old policy.

The policy improvement objective uses a probability ratio:

$$
r_t(\theta)=
\frac{\pi_\theta(a_t|s_t)}
{\pi_{\theta_{\text{old}}}(a_t|s_t)}
$$

Plain English: the ratio tells us how much more or less likely the new policy makes the sampled action compared with the old policy.

A surrogate objective is:

$$
L(\theta)=
\mathbb{E}_t
\left[
r_t(\theta)\hat{A}_t
\right]
$$

Plain English: if an action had positive advantage, we want the new policy to make it more likely; if negative advantage, less likely.

TRPO constrains the policy update using KL divergence:

$$
\mathbb{E}_t
\left[
D_{\mathrm{KL}}
\left(
\pi_{\theta_{\text{old}}}(\cdot|s_t)
\;\|\;
\pi_\theta(\cdot|s_t)
\right)
\right]
\leq \delta
$$

Plain English: the average difference between the old and new policy distributions must stay below a small threshold $\delta$.

The KL divergence between two discrete distributions is:

$$
D_{\mathrm{KL}}(p\|q)=\sum_x p(x)\log \frac{p(x)}{q(x)}
$$

Plain English: KL divergence measures how much information is lost when using distribution $q$ to approximate distribution $p$.

TRPO approximately solves:

$$
\max_\theta L(\theta)
\quad
\text{subject to}
\quad
\mathbb{E}_t[D_{\mathrm{KL}}(\pi_{\theta_{\text{old}}}\|\pi_\theta)]\leq \delta
$$

Plain English: maximize policy improvement while keeping the new policy close to the old one.

TRPO's intuition is excellent, but the method is relatively complex because it involves constrained optimization and second-order approximations.

---

## 6.3 PPO: Proximal Policy Optimization

**PPO** was designed as a simpler, more practical approximation to TRPO.

PPO keeps the probability ratio:

$$
r_t(\theta)=
\frac{\pi_\theta(a_t|s_t)}
{\pi_{\theta_{\text{old}}}(a_t|s_t)}
$$

Plain English: this ratio measures how much the new policy changes the probability of the action that was sampled by the old policy.

The unclipped surrogate objective is:

$$
L^{\text{PG}}(\theta)=
\mathbb{E}_t
\left[
r_t(\theta)\hat{A}_t
\right]
$$

Plain English: this is the standard importance-weighted policy-gradient objective.

PPO introduces the clipped surrogate objective:

$$
L^{\text{CLIP}}(\theta)=
\mathbb{E}_t
\left[
\min
\left(
r_t(\theta)\hat{A}_t,
\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat{A}_t
\right)
\right]
$$

Plain English: PPO prevents the policy from gaining extra objective value by moving the probability ratio too far away from $1$.

The clipping operation is:

$$
\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)
=
\begin{cases}
1-\epsilon, & r_t(\theta)<1-\epsilon \\
r_t(\theta), & 1-\epsilon \leq r_t(\theta) \leq 1+\epsilon \\
1+\epsilon, & r_t(\theta)>1+\epsilon
\end{cases}
$$

Plain English: the ratio is forced to stay inside the interval $[1-\epsilon,1+\epsilon]$ for the clipped part of the objective.

Usually $\epsilon$ is something like:

$$
\epsilon \in \{0.1, 0.2, 0.3\}
$$

Plain English: $\epsilon$ controls how far the new policy is allowed to move from the old policy before clipping limits the update.

---

## 6.4 Why PPO clipping works

Suppose the advantage is positive:

$$
\hat{A}_t > 0
$$

Plain English: the sampled action was better than expected.

Then the objective wants to increase $r_t(\theta)$:

$$
r_t(\theta)>1
$$

Plain English: the new policy should make this good action more likely than the old policy did.

But PPO clips the benefit once:

$$
r_t(\theta)>1+\epsilon
$$

Plain English: if the new policy already makes the good action much more likely, PPO stops rewarding further increase.

Now suppose the advantage is negative:

$$
\hat{A}_t < 0
$$

Plain English: the sampled action was worse than expected.

The objective wants to decrease $r_t(\theta)$:

$$
r_t(\theta)<1
$$

Plain English: the new policy should make this bad action less likely.

But PPO clips the benefit once:

$$
r_t(\theta)<1-\epsilon
$$

Plain English: if the new policy already makes the bad action much less likely, PPO stops rewarding further decrease.

So PPO approximates a trust region without explicitly solving a constrained optimization problem.

---

## 6.5 PPO as the practical modern workhorse

PPO became widely used because it is:

- Easier to implement than TRPO.
- More stable than vanilla policy gradient.
- Compatible with neural network policies and critics.
- Effective across many discrete and continuous control tasks.
- Naturally suited to on-policy batch training.

A typical PPO loss includes policy loss, value loss, and entropy bonus:

$$
\mathcal{L}_{\text{PPO}}(\theta,\phi)
=
-\mathbb{E}_t[L^{\text{CLIP}}(\theta)]
+
c_v\mathbb{E}_t[(V_\phi(s_t)-\hat{R}_t)^2]
-
c_e\mathbb{E}_t[\mathcal{H}(\pi_\theta(\cdot|s_t))]
$$

Plain English: PPO trains the policy to improve safely, trains the critic to predict returns, and encourages exploration through entropy.

The negative sign appears because implementations usually minimize losses:

$$
\min_{\theta,\phi} \mathcal{L}_{\text{PPO}}(\theta,\phi)
$$

Plain English: even though RL wants to maximize return, deep learning libraries usually minimize a loss, so the policy objective is negated.

---

## 6.6 RLHF and LLM fine-tuning

**RLHF** stands for **Reinforcement Learning from Human Feedback**.

The rough pipeline is:

1. Start with a pretrained language model.
2. Supervised fine-tune it on helpful demonstrations.
3. Train a reward model from human preference comparisons.
4. Fine-tune the language model policy using RL, often PPO-style optimization.

In this setting, the language model is the policy:

$$
\pi_\theta(y|x)
$$

Plain English: given a prompt $x$, the language model assigns probabilities to possible completions $y$.

The reward model gives a scalar reward:

$$
r_\psi(x,y)
$$

Plain English: the reward model estimates how good a completion $y$ is for prompt $x$ according to learned human preferences.

The RL objective is approximately:

$$
J(\theta)=
\mathbb{E}_{y \sim \pi_\theta(\cdot|x)}
[
r_\psi(x,y)
]
$$

Plain English: adjust the language model so that its sampled outputs receive higher reward from the reward model.

RLHF usually also penalizes moving too far from a reference model:

$$
r(x,y)=r_\psi(x,y)-\beta D_{\mathrm{KL}}(\pi_\theta(\cdot|x)\|\pi_{\text{ref}}(\cdot|x))
$$

Plain English: the model is rewarded for producing preferred outputs but penalized if it drifts too far from the original reference policy.

This connects classical policy-gradient ideas to modern LLM alignment: the model is a policy, text generation is action selection, and human preference models provide the reward signal.

---

# Part 7 — Practicalities

## 7.1 On-policy nature

Most policy-gradient methods are **on-policy**.

That means data must be collected from the current policy:

$$
\tau \sim \pi_\theta
$$

Plain English: the trajectories used for learning should come from the policy currently being optimized.

This differs from off-policy value-based methods like Q-learning and DQN, which can learn from older experience:

$$
(s,a,r,s') \sim \mathcal{D}
$$

Plain English: DQN can train on replay-buffer transitions collected by previous versions of the policy.

The on-policy requirement makes policy gradients sample-inefficient because once the policy changes too much, old data becomes stale.

PPO partially reuses data for several epochs, but it is still fundamentally near-on-policy.

---

## 7.2 Importance sampling for policy changes

If data was collected from an old policy, we can correct using an importance ratio:

$$
r_t(\theta)=
\frac{\pi_\theta(a_t|s_t)}
{\pi_{\theta_{\text{old}}}(a_t|s_t)}
$$

Plain English: this ratio corrects for the fact that the action was sampled from the old policy but evaluated under the new policy.

The corrected objective is:

$$
\mathbb{E}_t[r_t(\theta)\hat{A}_t]
$$

Plain English: the old sample is reweighted according to how likely the new policy would have been to take the same action.

But if the old and new policies differ too much, the ratios can become unstable:

$$
r_t(\theta) \gg 1
$$

Plain English: if the new policy is much more likely to take an action than the old policy was, the gradient can become extremely large.

This is another reason PPO uses clipping.

---

## 7.3 Continuous action spaces with Gaussian policies

For continuous control, policies often output a Gaussian distribution.

For a one-dimensional action:

$$
a \sim \mathcal{N}(\mu_\theta(s), \sigma_\theta^2(s))
$$

Plain English: the policy samples a continuous action from a normal distribution whose mean and variance are produced by the neural network.

For multi-dimensional actions:

$$
a \sim \mathcal{N}(\mu_\theta(s), \Sigma_\theta(s))
$$

Plain English: the policy samples an action vector from a multivariate Gaussian distribution.

Often the covariance is diagonal:

$$
\Sigma_\theta(s)=\operatorname{diag}(\sigma_1^2(s),\dots,\sigma_d^2(s))
$$

Plain English: each action dimension has its own variance, but the dimensions are treated as independent.

The log-probability of a one-dimensional Gaussian action is:

$$
\log \pi_\theta(a|s)
=
-\frac{1}{2}
\left[
\frac{(a-\mu_\theta(s))^2}{\sigma_\theta^2(s)}
+
2\log \sigma_\theta(s)
+
\log(2\pi)
\right]
$$

Plain English: this gives the log-probability of sampling action $a$ from the Gaussian policy.

The mean controls exploitation:

$$
\mu_\theta(s)
$$

Plain English: the mean is the policy's central or most likely action.

The standard deviation controls exploration:

$$
\sigma_\theta(s)
$$

Plain English: the standard deviation determines how randomly the policy samples around its mean action.

During training, actions are sampled:

$$
a_t \sim \pi_\theta(\cdot|s_t)
$$

Plain English: sampling enables exploration and gives the policy-gradient estimator a stochastic action to score.

During evaluation, one often uses the mean action:

$$
a_t=\mu_\theta(s_t)
$$

Plain English: for deterministic evaluation, the agent may choose the average action rather than sampling.

---

## 7.4 Entropy regularization

Policy-gradient methods can prematurely become too deterministic.

Entropy regularization encourages exploration:

$$
\mathcal{L}_{\text{entropy}}(\theta)
=
-\beta \mathcal{H}(\pi_\theta(\cdot|s))
$$

Plain English: adding negative entropy to a loss rewards policies that keep their action distributions spread out.

For a discrete policy:

$$
\mathcal{H}(\pi_\theta(\cdot|s))
=
-\sum_a \pi_\theta(a|s)\log \pi_\theta(a|s)
$$

Plain English: entropy is high when many actions have meaningful probability and low when one action dominates.

The coefficient $\beta$ controls exploration strength:

$$
\beta > 0
$$

Plain English: larger $\beta$ encourages more randomness in the policy.

Too little entropy can cause premature convergence. Too much entropy can prevent the policy from exploiting good actions.

---

## 7.5 Advantage normalization

A common implementation trick is to normalize advantages within a batch:

$$
\hat{A}_t^{\text{norm}}
=
\frac{\hat{A}_t-\mu_A}{\sigma_A+\epsilon}
$$

Plain English: subtract the batch mean advantage and divide by the batch standard deviation to stabilize gradient scale.

Here:

$$
\mu_A=\frac{1}{N}\sum_{t=1}^{N}\hat{A}_t
$$

Plain English: $\mu_A$ is the average advantage in the batch.

And:

$$
\sigma_A=
\sqrt{
\frac{1}{N}
\sum_{t=1}^{N}
(\hat{A}_t-\mu_A)^2
}
$$

Plain English: $\sigma_A$ measures how spread out the advantages are in the batch.

Advantage normalization does not change which actions are better or worse relative to the batch, but it makes optimization numerically smoother.

---

## 7.6 Common hyperparameters

### Learning rate

The learning rate controls update size:

$$
\theta \leftarrow \theta + \alpha \hat{g}
$$

Plain English: $\alpha$ determines how far the parameters move in the estimated gradient direction.

Too high:

$$
\alpha \text{ too large}
$$

Plain English: updates may be unstable and destroy the policy.

Too low:

$$
\alpha \text{ too small}
$$

Plain English: learning may be painfully slow.

---

### Discount factor

The discount factor appears in returns:

$$
G_t=\sum_{k=t}^{T}\gamma^{k-t}r_k
$$

Plain English: $\gamma$ controls how much the agent values future rewards.

High $\gamma$ means long-horizon planning but higher variance. Low $\gamma$ means shorter-horizon learning but potentially shortsighted behavior.

---

### Entropy coefficient

Entropy regularization uses:

$$
-\beta \mathcal{H}(\pi_\theta)
$$

Plain English: the entropy coefficient controls how strongly the policy is encouraged to explore.

If $\beta$ is too low, exploration may collapse. If too high, the policy may remain too random.

---

### Value loss coefficient

Actor-critic methods often weight the critic loss:

$$
c_v\mathcal{L}_{\text{critic}}
$$

Plain English: $c_v$ controls how much the value-function loss contributes to the total optimization objective.

If the critic is undertrained, advantage estimates are poor. If critic loss dominates, policy learning can suffer.

---

### PPO clipping parameter

PPO uses:

$$
\epsilon
$$

Plain English: $\epsilon$ controls how much policy probability ratios may deviate from $1$ before clipping limits the objective.

Smaller $\epsilon$ gives more conservative updates. Larger $\epsilon$ allows bigger policy changes but may reduce stability.

---

### Rollout length

Actor-critic methods often collect $n$-step rollouts:

$$
(s_t,a_t,r_t,\dots,s_{t+n})
$$

Plain English: the agent collects short chunks of experience before computing updates.

Short rollouts reduce variance but increase bootstrapping bias. Long rollouts reduce bias but increase variance.

---

## 7.7 Common failure modes

### Policy collapse

The policy becomes deterministic too early:

$$
\pi_\theta(a^\*|s) \approx 1
$$

Plain English: the policy puts almost all probability on one action and stops exploring.

Possible fixes:

- Increase entropy regularization.
- Lower the learning rate.
- Normalize advantages.
- Use better initialization.
- Use PPO-style clipping.

---

### Exploding policy updates

The new policy moves too far from the old policy:

$$
D_{\mathrm{KL}}(\pi_{\theta_{\text{old}}}\|\pi_\theta) \text{ is large}
$$

Plain English: the policy changed too much in one update, making the training data unreliable.

Possible fixes:

- Lower learning rate.
- Use PPO clipping.
- Add KL penalty.
- Early-stop PPO epochs when KL becomes too large.

---

### Poor critic learning

The critic gives inaccurate values:

$$
V_\phi(s) \not\approx V^\pi(s)
$$

Plain English: the critic's predictions do not match the true expected returns.

Then advantage estimates become unreliable:

$$
\hat{A}_t = \hat{R}_t - V_\phi(s_t)
$$

Plain English: if the baseline is wrong, the policy receives noisy or misleading feedback.

Possible fixes:

- Tune value loss coefficient.
- Use more critic updates.
- Use better return targets.
- Normalize rewards.
- Check for reward scaling problems.

---

### High variance

The gradient estimator is noisy:

$$
\mathrm{Var}[\hat{g}] \text{ is high}
$$

Plain English: gradient estimates differ greatly across batches, making learning unstable.

Possible fixes:

- Use a baseline or critic.
- Use advantage normalization.
- Increase batch size.
- Use generalized advantage estimation.
- Use reward normalization.
- Use lower learning rates.

---

### Reward scale problems

If rewards are too large:

$$
|G_t| \gg 1
$$

Plain English: very large returns can create huge gradients and unstable updates.

If rewards are too small:

$$
|G_t| \approx 0
$$

Plain English: tiny returns can produce weak learning signals.

Possible fixes:

- Normalize rewards.
- Clip rewards.
- Rescale the environment reward.
- Tune learning rate after reward scaling.

---

## 7.8 Generalized Advantage Estimation

Although not required for basic policy gradients, modern actor-critic methods often use **Generalized Advantage Estimation**, or **GAE**.

First define the TD residual:

$$
\delta_t = r_t + \gamma V_\phi(s_{t+1}) - V_\phi(s_t)
$$

Plain English: the TD residual measures whether the immediate reward plus next-state value was better or worse than the critic expected.

GAE computes advantage as an exponentially weighted sum of TD residuals:

$$
\hat{A}_t^{\text{GAE}(\gamma,\lambda)}
=
\sum_{l=0}^{\infty}
(\gamma\lambda)^l
\delta_{t+l}
$$

Plain English: GAE combines short-horizon and long-horizon advantage estimates using the parameter $\lambda$.

The parameter $\lambda$ satisfies:

$$
\lambda \in [0,1]
$$

Plain English: $\lambda$ controls the bias-variance tradeoff.

When $\lambda=0$:

$$
\hat{A}_t=\delta_t
$$

Plain English: the advantage estimate uses only the one-step TD error, giving lower variance but more bias.

When $\lambda=1$:

$$
\hat{A}_t \approx G_t - V_\phi(s_t)
$$

Plain English: the estimate becomes close to Monte Carlo advantage, giving lower bias but higher variance.

GAE is widely used in PPO because it gives smoother and more reliable advantage estimates.

---

# Summary: Value-Based vs Policy-Gradient Thinking

Value-based RL learns:

$$
Q(s,a)
$$

Plain English: estimate how good each action is.

Then it acts by:

$$
\arg\max_a Q(s,a)
$$

Plain English: choose the action with the highest estimated value.

Policy-gradient RL learns:

$$
\pi_\theta(a|s)
$$

Plain English: directly learn a distribution over actions.

Then it improves by:

$$
\nabla_\theta \log \pi_\theta(a|s)\hat{A}
$$

Plain English: make better-than-expected actions more likely and worse-than-expected actions less likely.

Actor-critic learns both:

$$
\pi_\theta(a|s), \qquad V_\phi(s)
$$

Plain English: the policy chooses actions, and the value function evaluates how good states are.

The conceptual shift is:

**Value-based RL:** "Which action has the highest value?"

**Policy-gradient RL:** "How should I change the policy distribution to make good outcomes more likely?"

**Actor-critic RL:** "Use a learned critic to tell the policy which actions were better than expected."

---

# Next Steps

## 1. Continuous-control actor-critic methods

After understanding vanilla policy gradients, REINFORCE, actor-critic, TRPO, and PPO, the next major branch is **off-policy actor-critic** for continuous control.

Important methods:

- **DDPG**: deterministic policy gradient with an off-policy critic.
- **TD3**: improves DDPG using clipped double Q-learning, delayed policy updates, and target policy smoothing.
- **SAC**: soft actor-critic, which maximizes both reward and entropy.

The key transition is from stochastic on-policy policy gradients to off-policy actor-critic methods that can reuse replay-buffer data.

---

## 2. Deeper PPO implementation

For practical deep RL, study PPO in implementation detail:

- rollout buffers
- old log-probabilities
- clipped objective
- value clipping
- entropy bonus
- KL early stopping
- minibatch epochs
- advantage normalization
- GAE
- reward normalization

PPO is simple conceptually but full of implementation details that strongly affect performance.

---

## 3. RLHF and LLM alignment

Policy gradients also provide the conceptual bridge to modern LLM alignment.

Important topics:

- reward modeling from human preferences
- PPO for language-model fine-tuning
- KL penalties against a reference model
- rejection sampling
- direct preference optimization
- online preference optimization
- constitutional AI and scalable oversight

The classical RL lens remains useful: the language model is a policy, generated tokens are actions, prompts are states or contexts, and preference models supply rewards.

---

## 4. Big picture

Policy-gradient methods are essential because they solve problems that value-based methods handle awkwardly:

- continuous action spaces
- stochastic policies
- differentiable policy optimization
- actor-critic architectures
- modern RLHF-style alignment

The core formula to remember is:

$$
\nabla_\theta J(\theta)
=
\mathbb{E}
\left[
\nabla_\theta \log \pi_\theta(a|s)A^\pi(s,a)
\right]
$$

Plain English: change the policy to make actions more likely when they are better than expected, and less likely when they are worse than expected.
