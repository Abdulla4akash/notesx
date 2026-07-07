---
subject: "Self Learning"
chapter: 6
title: "Advanced Companion Notes on Q-Learning"
language: en
---

# Advanced Companion Notes on Q-Learning

## Part 1 — The value-function scaffolding

### Return and discounting

In reinforcement learning, the **return** is the total future reward accumulated from a time step onward, usually discounted so that immediate rewards matter more than distant rewards.

$$
G_t = \sum_{k=0}^{\infty} \gamma^k r_{t+k+1}
$$

Plain-English explanation: starting from time $t$, the agent receives reward $r_{t+1}$ next, then $r_{t+2}$, then $r_{t+3}$, and so on. Each reward $k$ steps into the future is multiplied by $\gamma^k$, so rewards further away are worth less when $0 \leq \gamma < 1$.

The **discount factor** $\gamma$ controls how far-sighted the agent is:

- $\gamma = 0$: the agent only cares about the next immediate reward.
- $\gamma$ close to $1$: the agent cares strongly about long-term consequences.
- $\gamma < 1$: infinite sums remain finite when rewards are bounded.
- $\gamma = 1$: allowed in some episodic tasks, but convergence arguments become more delicate.

The return can also be written recursively:

$$
G_t = r_{t+1} + \gamma G_{t+1}
$$

Plain-English explanation: the total future return from now equals the next reward plus the discounted total return from the next time step onward.

This recursive form is the backbone of Bellman equations. It says value can be decomposed into an immediate reward plus the value of what comes next.

---

### State-value versus action-value

For a fixed policy $\pi$, the **state-value function** measures how good it is to be in a state when following $\pi$ afterward.

$$
V^\pi(s) = \mathbb{E}_\pi[G_t \mid S_t = s]
$$

Plain-English explanation: $V^\pi(s)$ is the expected discounted return if the agent starts in state $s$ and then follows policy $\pi$.

The **action-value function** measures how good it is to take a particular action in a state, then follow $\pi$ afterward.

$$
Q^\pi(s,a) = \mathbb{E}_\pi[G_t \mid S_t = s, A_t = a]
$$

Plain-English explanation: $Q^\pi(s,a)$ is the expected discounted return if the agent starts in state $s$, takes action $a$, and then follows policy $\pi$.

The relationship between them is:

$$
V^\pi(s) = \sum_a \pi(a \mid s) Q^\pi(s,a)
$$

Plain-English explanation: the value of a state under policy $\pi$ is the weighted average of the values of the actions available in that state, where the weights are the probabilities that policy $\pi$ chooses each action.

For deterministic policies, where $\pi(s)$ returns one action with probability $1$, this becomes:

$$
V^\pi(s) = Q^\pi(s, \pi(s))
$$

Plain-English explanation: if the policy always chooses one action in state $s$, then the value of the state is just the value of taking that chosen action.

The reverse relationship is:

$$
Q^\pi(s,a) = \sum_{s'} P(s' \mid s,a)\left[ R(s,a,s') + \gamma V^\pi(s') \right]
$$

Plain-English explanation: the value of taking action $a$ in state $s$ equals the expected immediate reward plus the discounted value of the next state, averaging over all possible next states.

---

### Bellman expectation equations

The **Bellman expectation equation** for $V^\pi$ is:

$$
V^\pi(s)
=
\sum_a \pi(a \mid s)
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s') + \gamma V^\pi(s')
\right]
$$

Plain-English explanation: the value of state $s$ under policy $\pi$ is the expected immediate reward plus discounted future value, averaging first over actions chosen by the policy and then over next states caused by the environment.

The Bellman expectation equation for $Q^\pi$ is:

$$
Q^\pi(s,a)
=
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s')
+
\gamma
\sum_{a'} \pi(a' \mid s') Q^\pi(s',a')
\right]
$$

Plain-English explanation: the value of taking action $a$ in state $s$ equals the expected immediate reward plus the discounted expected value of the next action chosen by policy $\pi$ in the next state.

These are called expectation equations because they evaluate a specific policy. They ask:

> “If I follow this policy, how much return should I expect?”

They are different from the **Bellman optimality equations**, which ask:

> “What is the best possible return I can get if I always act optimally?”

For the optimal state-value function:

$$
V^*(s)
=
\max_a
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s') + \gamma V^*(s')
\right]
$$

Plain-English explanation: the optimal value of state $s$ is obtained by choosing the action that gives the highest expected immediate reward plus discounted optimal future value.

For the optimal action-value function:

$$
Q^*(s,a)
=
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s')
+
\gamma \max_{a'} Q^*(s',a')
\right]
$$

Plain-English explanation: the optimal value of taking action $a$ in state $s$ is the expected immediate reward plus the discounted value of the best action available in the next state.

The key difference is:

- Bellman expectation equations contain $\pi(a \mid s)$ because they evaluate a given policy.
- Bellman optimality equations contain $\max_a$ because they assume optimal action choice.

---

### Policy evaluation

**Policy evaluation** means estimating $V^\pi$ or $Q^\pi$ for a fixed policy $\pi$.

In model-based dynamic programming, policy evaluation repeatedly applies the Bellman expectation backup:

$$
V_{k+1}(s)
=
\sum_a \pi(a \mid s)
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s') + \gamma V_k(s')
\right]
$$

Plain-English explanation: each iteration updates the value estimate of state $s$ by replacing it with the expected immediate reward plus discounted value of the next state, assuming the policy stays fixed.

For action-values:

$$
Q_{k+1}(s,a)
=
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s')
+
\gamma
\sum_{a'} \pi(a' \mid s') Q_k(s',a')
\right]
$$

Plain-English explanation: each action-value estimate is updated using the expected reward and the expected value of the next action under the same policy.

In model-free methods, the transition probabilities and reward function are not known, so the expectations are replaced by sampled experience.

---

### Policy improvement

**Policy improvement** means constructing a better policy from a value function.

Given $Q^\pi$, a greedy improved policy is:

$$
\pi'(s) \in \arg\max_a Q^\pi(s,a)
$$

Plain-English explanation: the new policy chooses an action that has the highest estimated return under the old policy’s action-value function.

The **policy improvement theorem** says that if, for every state,

$$
Q^\pi(s,\pi'(s)) \geq V^\pi(s)
$$

Plain-English explanation: if the new policy’s chosen action in every state is at least as good as the old policy’s average action choice, then the new policy is no worse than the old one.

Then:

$$
V^{\pi'}(s) \geq V^\pi(s)
\quad
\text{for all } s
$$

Plain-English explanation: following the improved policy gives at least as much expected return as following the old policy from every state.

This is the formal reason greedifying with respect to value estimates can improve behaviour.

---

### Generalized policy iteration

**Generalized policy iteration** is the broad idea that learning alternates between two coupled processes:

1. **Policy evaluation**: estimate how good the current policy is.
2. **Policy improvement**: make the policy greedier with respect to the current value estimates.

Classic policy iteration does these as separate phases. Value iteration merges them tightly. Q-learning goes even further: each update partially evaluates and improves at the same time.

In Q-learning, the target uses:

$$
r + \gamma \max_{a'} Q(s',a')
$$

Plain-English explanation: the update assumes that after reaching the next state $s'$, the agent will behave greedily, even if the data-generating behaviour policy was exploratory.

That is why Q-learning can be understood as a sample-based, asynchronous form of generalized policy iteration for the optimal action-value function.

---

## Part 2 — Deriving the Bellman optimality equation

### Optimal value functions

The **optimal state-value function** is defined as the highest value achievable from each state over all policies:

$$
V^*(s) = \max_\pi V^\pi(s)
$$

Plain-English explanation: $V^*(s)$ is the best possible expected discounted return from state $s$, assuming the agent can choose the best policy.

The **optimal action-value function** is:

$$
Q^*(s,a) = \max_\pi Q^\pi(s,a)
$$

Plain-English explanation: $Q^*(s,a)$ is the best possible expected discounted return after first taking action $a$ in state $s$, then acting optimally afterward.

Once $Q^*$ is known, an optimal policy can be extracted greedily:

$$
\pi^*(s) \in \arg\max_a Q^*(s,a)
$$

Plain-English explanation: if the agent knows the optimal value of every state-action pair, it can act optimally by choosing the action with the highest optimal action-value.

---

### Deriving the Bellman optimality equation for $V^*$

Start from the definition of the optimal value:

$$
V^*(s) = \max_\pi \mathbb{E}_\pi[G_t \mid S_t=s]
$$

Plain-English explanation: the optimal value of state $s$ is the maximum expected return over all possible policies starting from that state.

Use the recursive return:

$$
G_t = r_{t+1} + \gamma G_{t+1}
$$

Plain-English explanation: the return from now decomposes into the next reward plus the discounted return from the next time step.

Substitute into the value definition:

$$
V^*(s)
=
\max_\pi
\mathbb{E}_\pi
\left[
r_{t+1} + \gamma G_{t+1}
\mid S_t=s
\right]
$$

Plain-English explanation: the best possible value can be written as the best expected immediate reward plus discounted future return.

The first decision is the action $a$ chosen in state $s$. After that, the environment moves to some $s'$. If the agent is optimal from $s'$ onward, the future return has value $V^*(s')$.

Therefore:

$$
V^*(s)
=
\max_a
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s') + \gamma V^*(s')
\right]
$$

Plain-English explanation: the optimal value of state $s$ is obtained by trying every possible first action, computing the expected immediate reward plus discounted optimal value of the next state, and choosing the best action.

This is the Bellman optimality equation for $V^*$.

---

### Deriving the Bellman optimality equation for $Q^*$

Start from the optimal action-value definition:

$$
Q^*(s,a)
=
\max_\pi
\mathbb{E}_\pi[G_t \mid S_t=s, A_t=a]
$$

Plain-English explanation: $Q^*(s,a)$ is the best return achievable after forcing the first action to be $a$ and then behaving optimally.

Again use:

$$
G_t = r_{t+1} + \gamma G_{t+1}
$$

Plain-English explanation: the total return is the next reward plus discounted future return.

After taking action $a$ in state $s$, the environment transitions to $s'$. From $s'$ onward, the best possible value is obtained by choosing the best next action $a'$.

So:

$$
Q^*(s,a)
=
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s')
+
\gamma \max_{a'} Q^*(s',a')
\right]
$$

Plain-English explanation: the optimal value of taking action $a$ in state $s$ equals the expected immediate reward plus the discounted value of the best action in the next state.

This is the equation Q-learning tries to solve from samples.

---

### Principle of optimality

The **principle of optimality** says:

> An optimal policy has the property that, after any first action and resulting next state, the remaining decisions must themselves form an optimal policy for that next state.

More formally, suppose $\pi^*$ is optimal from state $s$. If taking its first action leads to state $s'$, then the continuation of $\pi^*$ from $s'$ must be optimal for $s'$.

Otherwise, there would exist another policy $\tilde{\pi}$ that gives higher value from $s'$. Replacing the tail of $\pi^*$ with $\tilde{\pi}$ would improve the value from $s$, contradicting the assumption that $\pi^*$ was optimal.

This is why optimal control problems can be solved recursively. The global optimum can be decomposed into locally optimal first decisions plus optimal subproblems.

The Bellman optimality equation is exactly this recursive structure written mathematically.

---

## Part 3 — TD learning as a family

### Temporal-difference learning

**Temporal-difference learning** is the idea of learning value estimates from experience by bootstrapping from other learned estimates.

A generic TD update has the form:

$$
\text{new estimate}
\leftarrow
\text{old estimate}
+
\alpha
\left[
\text{target} - \text{old estimate}
\right]
$$

Plain-English explanation: the estimate is nudged toward a target, with step size $\alpha$ controlling how large the correction is.

The term inside brackets is the **TD error**:

$$
\delta_t = \text{target} - \text{current estimate}
$$

Plain-English explanation: the TD error measures how surprising the observed reward and next-state estimate were compared with the value currently predicted.

---

### TD(0)

For policy evaluation with state-values, **TD(0)** uses the one-step target:

$$
V(S_t)
\leftarrow
V(S_t)
+
\alpha
\left[
r_{t+1}
+
\gamma V(S_{t+1})
-
V(S_t)
\right]
$$

Plain-English explanation: the value of the current state is moved toward the observed reward plus the discounted estimated value of the next state.

The TD error is:

$$
\delta_t
=
r_{t+1}
+
\gamma V(S_{t+1})
-
V(S_t)
$$

Plain-English explanation: the TD error is positive if the transition turned out better than expected and negative if it turned out worse than expected.

TD(0) is called “zero-step” not because it looks zero steps ahead, but because it uses no full future rollout beyond the immediate transition. It bootstraps immediately after one step.

---

### Monte Carlo versus TD

**Monte Carlo** methods estimate values using complete sampled returns:

$$
V(S_t)
\leftarrow
V(S_t)
+
\alpha
\left[
G_t - V(S_t)
\right]
$$

Plain-English explanation: Monte Carlo learning updates the value of a state toward the actual return observed after the episode finishes.

TD methods instead use:

$$
V(S_t)
\leftarrow
V(S_t)
+
\alpha
\left[
r_{t+1} + \gamma V(S_{t+1}) - V(S_t)
\right]
$$

Plain-English explanation: TD learning updates immediately using the next reward and the current estimate of the next state’s value.

The main tradeoff is:

| Method | Target | Bias | Variance | Can learn before episode ends? |
|---|---:|---:|---:|---:|
| Monte Carlo | Full return $G_t$ | Low, if sampled correctly | High | No |
| TD(0) | $r_{t+1} + \gamma V(S_{t+1})$ | Higher, due to bootstrapping | Lower | Yes |

Monte Carlo targets are unbiased samples of the true return under the policy, but they can have high variance because the full future trajectory is random.

TD targets are biased because they depend on the current imperfect estimate $V(S_{t+1})$, but they often have lower variance and are more data-efficient.

---

### n-step returns

An **n-step return** interpolates between one-step TD and full Monte Carlo.

The $n$-step return is:

$$
G_t^{(n)}
=
r_{t+1}
+
\gamma r_{t+2}
+
\gamma^2 r_{t+3}
+
\cdots
+
\gamma^{n-1} r_{t+n}
+
\gamma^n V(S_{t+n})
$$

Plain-English explanation: the agent uses $n$ real rewards from experience and then bootstraps from the estimated value of the state reached after $n$ steps.

The corresponding update is:

$$
V(S_t)
\leftarrow
V(S_t)
+
\alpha
\left[
G_t^{(n)} - V(S_t)
\right]
$$

Plain-English explanation: the value estimate is moved toward an $n$-step target that mixes sampled rewards with a bootstrapped future estimate.

Special cases:

- $n=1$: TD(0).
- $n$ until episode end: Monte Carlo.
- Intermediate $n$: balance between bias and variance.

---

### TD($\lambda$) and eligibility traces

**TD($\lambda$)** combines all $n$-step returns using exponentially decaying weights.

The forward-view $\lambda$-return is:

$$
G_t^\lambda
=
(1-\lambda)
\sum_{n=1}^{\infty}
\lambda^{n-1}
G_t^{(n)}
$$

Plain-English explanation: the $\lambda$-return is a weighted average of all $n$-step returns, where shorter returns get more weight when $\lambda$ is small and longer returns get more weight when $\lambda$ is close to $1$.

For episodic tasks, the final Monte Carlo return receives the remaining tail weight.

The parameter $\lambda$ controls interpolation:

- $\lambda = 0$: pure TD(0).
- $\lambda \to 1$: approaches Monte Carlo.
- Intermediate $\lambda$: combines short-term bootstrapping with longer sampled evidence.

The backward view uses **eligibility traces**, which assign credit to recently visited states or state-action pairs.

For state-values, the accumulating eligibility trace is:

$$
e_t(s)
=
\gamma \lambda e_{t-1}(s)
+
\mathbf{1}\{S_t=s\}
$$

Plain-English explanation: the eligibility of state $s$ decays over time, but it increases whenever the agent visits $s$.

The update becomes:

$$
V(s)
\leftarrow
V(s)
+
\alpha \delta_t e_t(s)
\quad
\text{for all } s
$$

Plain-English explanation: every state with nonzero eligibility gets updated in proportion to the current TD error and how recently or frequently that state was visited.

Eligibility traces solve a credit assignment problem: if a reward arrives now, recently visited states should receive some credit or blame, not only the immediately previous state.

---

### Locating Q-learning, SARSA, and Expected SARSA

All three methods are TD control algorithms because they learn action-values using bootstrapped targets.

#### SARSA

SARSA uses the actual next action selected by the current behaviour policy:

$$
Q(S_t,A_t)
\leftarrow
Q(S_t,A_t)
+
\alpha
\left[
r_{t+1}
+
\gamma Q(S_{t+1},A_{t+1})
-
Q(S_t,A_t)
\right]
$$

Plain-English explanation: SARSA updates the current action-value toward the reward plus the value of the action the agent actually takes next.

SARSA is **on-policy** because it evaluates and improves the same policy that generates the data.

#### Q-learning

Q-learning uses the greedy next action in the target:

$$
Q(S_t,A_t)
\leftarrow
Q(S_t,A_t)
+
\alpha
\left[
r_{t+1}
+
\gamma \max_{a'} Q(S_{t+1},a')
-
Q(S_t,A_t)
\right]
$$

Plain-English explanation: Q-learning updates the current action-value toward the reward plus the value of the best-looking action in the next state, regardless of what action the agent actually takes next.

Q-learning is **off-policy** because the update target corresponds to a greedy target policy, while the behaviour policy may be exploratory.

#### Expected SARSA

Expected SARSA uses an expectation over the next action distribution:

$$
Q(S_t,A_t)
\leftarrow
Q(S_t,A_t)
+
\alpha
\left[
r_{t+1}
+
\gamma
\sum_{a'} \pi(a' \mid S_{t+1})Q(S_{t+1},a')
-
Q(S_t,A_t)
\right]
$$

Plain-English explanation: Expected SARSA updates toward the reward plus the average value of next actions under the policy’s action probabilities.

Expected SARSA can be on-policy or off-policy depending on which policy is used inside the expectation.

The family relationship is:

| Algorithm | Target | On-policy or off-policy? |
|---|---|---|
| SARSA | Sampled next action | On-policy |
| Expected SARSA | Expected next action-value | Usually on-policy, can be off-policy |
| Q-learning | Greedy max next action-value | Off-policy |

---

## Part 4 — Convergence, properly

### Bellman operators

A **Bellman operator** is a mapping from one value function to another value function.

For a fixed policy $\pi$, the Bellman expectation operator for state-values is:

$$
(T^\pi V)(s)
=
\sum_a \pi(a \mid s)
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s') + \gamma V(s')
\right]
$$

Plain-English explanation: applying $T^\pi$ to $V$ gives a new value function where each state is updated using the Bellman expectation backup for policy $\pi$.

The Bellman optimality operator is:

$$
(T^* V)(s)
=
\max_a
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s') + \gamma V(s')
\right]
$$

Plain-English explanation: applying $T^*$ to $V$ gives a new value function where each state is updated by choosing the action with the best expected reward plus discounted next-state value.

For action-values, the optimality operator is:

$$
(T^* Q)(s,a)
=
\sum_{s'} P(s' \mid s,a)
\left[
R(s,a,s')
+
\gamma \max_{a'} Q(s',a')
\right]
$$

Plain-English explanation: applying $T^*$ to $Q$ gives a new action-value function where each state-action pair is backed up using the best next action.

---

### Sup-norm and contraction

The **supremum norm** between two value functions is:

$$
\|V-W\|_\infty
=
\max_s |V(s)-W(s)|
$$

Plain-English explanation: the sup-norm measures the largest absolute difference between two value functions across all states.

A mapping $T$ is a **$\gamma$-contraction** if:

$$
\|TV - TW\|_\infty
\leq
\gamma \|V-W\|_\infty
$$

Plain-English explanation: applying the operator brings any two value functions closer together by at least a factor of $\gamma$.

For the Bellman expectation operator:

$$
\|T^\pi V - T^\pi W\|_\infty
\leq
\gamma \|V-W\|_\infty
$$

Plain-English explanation: Bellman policy-evaluation backups shrink the maximum difference between value functions because the only part that depends on future values is discounted by $\gamma$.

A sketch of the proof:

$$
\begin{aligned}
|(T^\pi V)(s) - (T^\pi W)(s)|
&=
\left|
\sum_a \pi(a \mid s)
\sum_{s'} P(s' \mid s,a)
\gamma \left[V(s') - W(s')\right]
\right| \\
&\leq
\gamma
\sum_a \pi(a \mid s)
\sum_{s'} P(s' \mid s,a)
|V(s') - W(s')| \\
&\leq
\gamma \|V-W\|_\infty
\end{aligned}
$$

Plain-English explanation: the immediate reward cancels out, leaving only the discounted difference between future values. Because probabilities average differences rather than amplify them, the largest possible difference is multiplied by at most $\gamma$.

The optimality operator is also a contraction:

$$
\|T^*V - T^*W\|_\infty
\leq
\gamma \|V-W\|_\infty
$$

Plain-English explanation: even though the optimality operator contains a max, the max operation cannot increase the difference between two value functions by more than the largest original difference, and discounting shrinks it by $\gamma$.

---

### Banach fixed-point theorem

The **Banach fixed-point theorem** says that if a mapping $T$ is a contraction on a complete metric space, then:

1. $T$ has a unique fixed point $x^*$.
2. Repeatedly applying $T$ converges to $x^*$ from any starting point.

A fixed point satisfies:

$$
Tx^* = x^*
$$

Plain-English explanation: a fixed point is an object that does not change when the operator is applied.

For the Bellman optimality operator:

$$
T^*V^* = V^*
$$

Plain-English explanation: the optimal value function is the fixed point of the Bellman optimality operator, meaning that applying the optimal Bellman backup to $V^*$ returns $V^*$ unchanged.

For action-values:

$$
T^*Q^* = Q^*
$$

Plain-English explanation: the optimal action-value function is the fixed point of the Bellman optimality operator for $Q$.

Because $T^*$ is a $\gamma$-contraction when $\gamma < 1$, $Q^*$ is unique and repeated exact Bellman backups converge to it.

This is why $\gamma < 1$ matters mathematically. Without discounting, the contraction property may fail in continuing tasks, and the uniqueness/convergence argument becomes weaker or false unless extra assumptions are imposed.

---

### Connecting contraction to tabular Q-learning

Tabular Q-learning is a stochastic approximation to applying the Bellman optimality operator.

The ideal expected update target is:

$$
(T^*Q)(s,a)
=
\mathbb{E}
\left[
r_{t+1}
+
\gamma \max_{a'} Q(S_{t+1},a')
\mid S_t=s,A_t=a
\right]
$$

Plain-English explanation: the Bellman optimality backup is the expected version of the one-sample Q-learning target.

Q-learning observes one sample:

$$
Y_t
=
r_{t+1}
+
\gamma \max_{a'} Q(S_{t+1},a')
$$

Plain-English explanation: $Y_t$ is a noisy sample of the Bellman optimality target for the current state-action pair.

The update is:

$$
Q_{t+1}(S_t,A_t)
=
Q_t(S_t,A_t)
+
\alpha_t
\left[
Y_t - Q_t(S_t,A_t)
\right]
$$

Plain-English explanation: the current table entry is moved toward a noisy sample of the Bellman optimality backup.

Under the standard tabular assumptions:

- finite state and action spaces,
- bounded rewards,
- $\gamma < 1$,
- every state-action pair visited infinitely often,
- learning rates satisfy Robbins-Monro conditions,

Q-learning converges to $Q^*$ with probability $1$.

The deep reason is that the expected update tracks a contraction mapping whose unique fixed point is $Q^*$, while the stochastic noise averages out under suitable learning-rate schedules.

---

## Part 5 — Where Q-learning breaks

### Maximization bias

Q-learning uses a max in the target:

$$
r + \gamma \max_{a'} Q(s',a')
$$

Plain-English explanation: the update assumes the agent will choose the action with the largest estimated value in the next state.

The problem is that estimates are noisy. If several actions have true values near each other, the maximum of their noisy estimates tends to be biased upward.

Formally, in general:

$$
\mathbb{E}\left[\max_a \hat{Q}(s,a)\right]
\geq
\max_a \mathbb{E}\left[\hat{Q}(s,a)\right]
$$

Plain-English explanation: taking the maximum after adding noise tends to select overestimated actions, so the expected maximum estimate is larger than the maximum true expected estimate.

This causes **maximization bias**, also called overestimation bias.

#### Double Q-learning

**Double Q-learning** reduces maximization bias by separating action selection from action evaluation.

Maintain two independent value tables, $Q^A$ and $Q^B$.

When updating $Q^A$, choose the greedy action using $Q^A$:

$$
a^* = \arg\max_{a'} Q^A(s',a')
$$

Plain-English explanation: $Q^A$ decides which next action looks best.

But evaluate that action using $Q^B$:

$$
Q^A(s,a)
\leftarrow
Q^A(s,a)
+
\alpha
\left[
r
+
\gamma Q^B(s',a^*)
-
Q^A(s,a)
\right]
$$

Plain-English explanation: $Q^A$ is updated toward a target where the next action is selected by $Q^A$ but valued by the separate table $Q^B$.

Similarly, when updating $Q^B$:

$$
a^* = \arg\max_{a'} Q^B(s',a')
$$

Plain-English explanation: now $Q^B$ selects the greedy next action.

Then:

$$
Q^B(s,a)
\leftarrow
Q^B(s,a)
+
\alpha
\left[
r
+
\gamma Q^A(s',a^*)
-
Q^B(s,a)
\right]
$$

Plain-English explanation: $Q^B$ is updated using a target where the selected action is evaluated by $Q^A$.

The key idea is that the same noisy estimates should not both select and evaluate the max action.

---

### The deadly triad

The **deadly triad** refers to the combination of:

1. **Function approximation**
2. **Bootstrapping**
3. **Off-policy learning**

Each ingredient is useful. Together, they can cause instability or divergence.

#### Function approximation

Instead of a table, approximate values with parameters $\theta$:

$$
Q(s,a;\theta) \approx Q^*(s,a)
$$

Plain-English explanation: a neural network or other approximator predicts action-values instead of storing one separate number per state-action pair.

Function approximation generalizes across states, which is necessary for large spaces. But updates to one state-action pair can change predictions for many others.

#### Bootstrapping

Bootstrapping uses current estimates inside the target:

$$
r + \gamma \max_{a'} Q(s',a';\theta)
$$

Plain-English explanation: the learning target depends on the model’s own current predictions.

This creates a moving-target problem. The network is chasing targets that it itself helps define.

#### Off-policy learning

Off-policy learning updates a target policy using data generated by another policy.

For Q-learning, the target is greedy:

$$
\max_{a'} Q(s',a';\theta)
$$

Plain-English explanation: the update assumes greedy future behaviour even if the data came from an exploratory or different behaviour policy.

The instability appears because the function approximator may generalize incorrectly in regions not well-covered by the behaviour distribution, and bootstrapping can amplify those errors through the target.

A bad estimate in one region can become a target for another estimate, which then becomes a target for another estimate, producing feedback loops.

---

### Why DQN needs experience replay

**Deep Q-Networks** approximate $Q$ using a neural network:

$$
Q(s,a;\theta)
$$

Plain-English explanation: DQN uses network parameters $\theta$ to estimate the value of each action in a state.

Naively training this network online is unstable because consecutive transitions are highly correlated. Standard stochastic gradient descent assumes minibatches are at least roughly independent and identically distributed.

**Experience replay** stores transitions:

$$
(s_t,a_t,r_{t+1},s_{t+1},\text{done})
$$

Plain-English explanation: the replay buffer keeps past experience so the agent can train on older transitions instead of only the most recent one.

DQN samples random minibatches from the replay buffer. This helps because:

- it reduces temporal correlation between updates,
- it improves data efficiency by reusing experience,
- it smooths the training distribution over recent past experience.

However, replay does not magically solve all off-policy problems. It makes training less unstable, not theoretically clean in the same way tabular Q-learning is.

---

### Why DQN needs target networks

The DQN target is:

$$
y
=
r
+
\gamma \max_{a'} Q(s',a';\theta^-)
$$

Plain-English explanation: the target uses a separate network with parameters $\theta^-$ to estimate the best next-state value.

The online network is trained by minimizing:

$$
L(\theta)
=
\mathbb{E}
\left[
\left(
y - Q(s,a;\theta)
\right)^2
\right]
$$

Plain-English explanation: the online network parameters $\theta$ are adjusted so that the predicted value of the sampled state-action pair becomes closer to the target $y$.

The target network parameters $\theta^-$ are copied from the online network only periodically or slowly updated.

Without a target network, the same parameters $\theta$ define both:

1. the prediction being trained,
2. the target being chased.

That creates feedback instability. Every gradient step changes the target, so learning can oscillate or diverge.

Target networks slow down target movement, making the supervised learning problem locally more stationary.

---

## Part 6 — Worked numerical example

### Gridworld setup

Consider a tiny deterministic gridworld:

```text
A  B  G
```

There are three states:

- $A$: start
- $B$: middle
- $G$: terminal goal

Available actions:

- From $A$: `Right` moves to $B`; `Stay` remains in $A`
- From $B$: `Right` moves to $G`; `Left` moves to $A`
- From $G$: episode ends

Rewards:

- Moving into $G$: $+10$
- All other transitions: $-1$

Use:

$$
\alpha = 0.5
$$

Plain-English explanation: each update moves halfway from the old Q-value toward the new TD target.

Use:

$$
\gamma = 0.9
$$

Plain-English explanation: future rewards are worth $90\%$ as much per step into the future.

Initialize all Q-values to zero:

$$
Q(s,a)=0
\quad
\text{for all } s,a
$$

Plain-English explanation: before learning, the agent has no preference because every action-value estimate starts at zero.

The Q-learning update is:

$$
Q(s,a)
\leftarrow
Q(s,a)
+
\alpha
\left[
r
+
\gamma \max_{a'} Q(s',a')
-
Q(s,a)
\right]
$$

Plain-English explanation: update the value of the action actually taken using the reward and the best estimated action-value in the next state.

---

### Update 1: from $A$ to $B$

Suppose the agent takes `Right` in $A$.

Transition:

```text
A --Right--> B
```

Reward:

$$
r=-1
$$

Plain-English explanation: moving from $A$ to $B$ is a normal non-terminal move, so it receives reward $-1$.

Current value:

$$
Q(A,\text{Right}) = 0
$$

Plain-English explanation: the action-value for going right from $A$ is currently zero because nothing has been learned yet.

Next-state max:

$$
\max_{a'} Q(B,a') = \max(Q(B,\text{Right}), Q(B,\text{Left})) = \max(0,0)=0
$$

Plain-English explanation: both actions from $B$ currently have value zero, so the best estimated next value is zero.

TD target:

$$
y
=
r + \gamma \max_{a'}Q(B,a')
=
-1 + 0.9(0)
=
-1
$$

Plain-English explanation: the target says that going right from $A$ currently looks worth only the immediate cost of $-1$, because no future reward has propagated back yet.

TD error:

$$
\delta
=
y - Q(A,\text{Right})
=
-1 - 0
=
-1
$$

Plain-English explanation: the current estimate was too high by $1$, so it needs to decrease.

Update:

$$
Q(A,\text{Right})
\leftarrow
0 + 0.5(-1)
=
-0.5
$$

Plain-English explanation: the value of going right from $A$ moves halfway from $0$ toward $-1$.

After update 1:

$$
Q(A,\text{Right})=-0.5
$$

Plain-English explanation: the agent has learned that moving from $A$ to $B$ has an immediate cost, but it has not yet learned that $B$ leads to the goal.

---

### Update 2: from $B$ to $G$

Now the agent takes `Right` in $B$.

Transition:

```text
B --Right--> G
```

Reward:

$$
r=+10
$$

Plain-English explanation: moving into the terminal goal gives reward $+10$.

Since $G$ is terminal:

$$
\max_{a'}Q(G,a')=0
$$

Plain-English explanation: terminal states have no future actions, so the future value after reaching $G$ is zero.

Current value:

$$
Q(B,\text{Right})=0
$$

Plain-English explanation: the agent has not yet updated the value of going right from $B$.

TD target:

$$
y
=
10 + 0.9(0)
=
10
$$

Plain-English explanation: going right from $B$ directly reaches the goal, so the target is just the terminal reward.

TD error:

$$
\delta
=
10 - 0
=
10
$$

Plain-English explanation: the current estimate was far too low because it did not know this action leads to the goal.

Update:

$$
Q(B,\text{Right})
\leftarrow
0 + 0.5(10)
=
5
$$

Plain-English explanation: the value of going right from $B$ moves halfway from $0$ toward $10$.

After update 2:

$$
Q(B,\text{Right})=5
$$

Plain-English explanation: the reward at the goal has now started to enter the Q-table at state $B$.

---

### Update 3: from $A$ to $B$ again

Suppose a later episode again takes `Right` from $A$ to $B$.

Transition:

```text
A --Right--> B
```

Reward:

$$
r=-1
$$

Plain-English explanation: moving from $A$ to $B$ still costs $-1$.

Current value:

$$
Q(A,\text{Right})=-0.5
$$

Plain-English explanation: from update 1, going right from $A$ is currently estimated as slightly bad.

Next-state max:

$$
\max_{a'}Q(B,a')
=
\max(Q(B,\text{Right}),Q(B,\text{Left}))
=
\max(5,0)
=
5
$$

Plain-English explanation: the best known action from $B$ is now going right to the goal, with value $5$.

TD target:

$$
y
=
-1 + 0.9(5)
=
-1 + 4.5
=
3.5
$$

Plain-English explanation: going from $A$ to $B$ has an immediate cost of $-1$, but now the agent expects valuable future reward from $B$.

TD error:

$$
\delta
=
3.5 - (-0.5)
=
4.0
$$

Plain-English explanation: the old estimate for going right from $A$ was too pessimistic by $4$ because it had not yet incorporated the value of reaching $B$.

Update:

$$
Q(A,\text{Right})
\leftarrow
-0.5 + 0.5(4.0)
=
1.5
$$

Plain-English explanation: the value of going right from $A$ increases because the goal reward has propagated backward through $B$.

After update 3:

$$
Q(A,\text{Right})=1.5
$$

Plain-English explanation: the agent now begins to understand that moving from $A$ to $B$ is good because $B$ is close to the goal.

This is the core propagation mechanism of Q-learning: reward information moves backward one transition at a time through bootstrapped updates.

---

## Part 7 — Pitfalls and exam traps

### On-policy versus off-policy confusion

A common mistake is to classify algorithms based on whether the behaviour is exploratory. That is not the right distinction.

The real distinction is:

- **On-policy**: learns the value of the same policy used to generate behaviour.
- **Off-policy**: learns the value of a different target policy from the behaviour policy.

SARSA with $\epsilon$-greedy behaviour learns the value of that same $\epsilon$-greedy policy.

Q-learning with $\epsilon$-greedy behaviour learns the value of the greedy policy, while using $\epsilon$-greedy only to explore.

That is why Q-learning is off-policy even though it may behave exploratorily during training.

---

### Why SARSA is safer than Q-learning in cliff-walking

In the cliff-walking task, the agent must move along a path near a cliff. Falling off gives a large negative reward.

Q-learning learns as if it will act greedily in the future. So if the greedy path goes close to the cliff, Q-learning values that path highly, even while exploration still occasionally causes the agent to fall.

SARSA learns the value of the actual exploratory policy. If the policy is $\epsilon$-greedy, SARSA accounts for the possibility that random exploratory actions may occur near the cliff.

Therefore SARSA tends to learn a safer path farther away from the cliff.

The exam trap:

- Q-learning finds the optimal greedy path under ideal execution.
- SARSA finds a better path for the actual exploratory behaviour during learning.

So SARSA is “safer” not because it is more conservative by design, but because its update target includes the consequences of exploratory actions.

---

### Reward scaling

If rewards are very large, TD errors can become large:

$$
\delta_t
=
r_{t+1}
+
\gamma \max_{a'}Q(s',a')
-
Q(s,a)
$$

Plain-English explanation: large rewards directly increase the size of the TD error, which can make value updates unstable.

In deep Q-learning, poor reward scaling can cause exploding targets, unstable gradients, or saturation.

Common practical fixes include:

- reward clipping,
- reward normalization,
- smaller learning rates,
- environment-specific reward shaping.

But reward shaping must be handled carefully. It can change the optimal policy if done incorrectly.

---

### $\gamma$ close to 1

When $\gamma$ is close to $1$, the agent becomes more farsighted.

The effective planning horizon is roughly:

$$
\frac{1}{1-\gamma}
$$

Plain-English explanation: when $\gamma$ is near $1$, rewards many steps in the future still matter substantially, so the agent behaves as if it is planning over a longer horizon.

Examples:

$$
\frac{1}{1-0.9}=10
$$

Plain-English explanation: with $\gamma=0.9$, the rough effective horizon is about $10$ steps.

$$
\frac{1}{1-0.99}=100
$$

Plain-English explanation: with $\gamma=0.99$, the rough effective horizon is about $100$ steps.

A high $\gamma$ can be necessary for long-term tasks, but it can also:

- slow value propagation,
- increase variance,
- make bootstrapped targets more sensitive to value-estimation errors,
- make convergence slower.

The exam trap is assuming “higher $\gamma$ is always better.” It is not. It changes the problem the agent is solving.

---

### Learning-rate schedules

The tabular convergence theory usually requires learning rates satisfying:

$$
\sum_{t=1}^{\infty} \alpha_t = \infty
$$

Plain-English explanation: the learning rates must not shrink so quickly that learning stops before reaching the correct values.

And:

$$
\sum_{t=1}^{\infty} \alpha_t^2 < \infty
$$

Plain-English explanation: the squared learning rates must be summable so that random noise eventually averages out.

A classic example is:

$$
\alpha_t = \frac{1}{t}
$$

Plain-English explanation: the learning rate decreases over time, allowing continued learning while reducing noise.

In practice, constant learning rates are often used, especially in non-stationary or deep RL settings. But constant learning rates usually imply convergence to a neighbourhood rather than exact convergence in tabular stochastic approximation theory.

---

### Exploration decay

If exploration decays too quickly, some state-action pairs may not be visited enough.

For tabular Q-learning convergence, one needs sufficient exploration:

$$
N_t(s,a) \to \infty
\quad
\text{for all } s,a
$$

Plain-English explanation: every state-action pair must be visited infinitely often so the agent can correct its estimate for every possible action.

If $\epsilon$ in $\epsilon$-greedy is reduced too aggressively, the agent may prematurely commit to a bad policy.

But if exploration remains too high, the learned values may improve while behaviour remains noisy and poor.

This creates a practical tension:

- enough exploration to discover good actions,
- enough exploitation to perform well,
- slow enough decay to avoid premature convergence.

---

## Further topics

Q-learning leads naturally into deep value-based reinforcement learning.

Important DQN variants include:

### Double DQN

Double DQN adapts Double Q-learning to neural networks by selecting the next action using the online network and evaluating it using the target network.

The target is:

$$
y
=
r
+
\gamma
Q
\left(
s',
\arg\max_{a'}Q(s',a';\theta);
\theta^-
\right)
$$

Plain-English explanation: the online network chooses the best next action, but the target network evaluates that action, reducing overestimation bias.

### Dueling DQN

Dueling DQN decomposes action-values into state value and advantage:

$$
Q(s,a)
=
V(s)
+
A(s,a)
$$

Plain-English explanation: the network separately estimates how good the state is and how much better each action is compared with other actions.

A common identifiable version is:

$$
Q(s,a)
=
V(s)
+
\left[
A(s,a)
-
\frac{1}{|\mathcal{A}|}
\sum_{a'}A(s,a')
\right]
$$

Plain-English explanation: subtracting the mean advantage prevents arbitrary shifting between $V$ and $A$, making the decomposition better defined.

### Prioritized experience replay

Prioritized replay samples transitions with probability related to TD error:

$$
P(i)
=
\frac{p_i^\alpha}{\sum_k p_k^\alpha}
$$

Plain-English explanation: transitions with higher priority, often larger TD error, are sampled more often because they may be more informative.

Importance-sampling weights are used to reduce bias:

$$
w_i
=
\left(
\frac{1}{N}
\cdot
\frac{1}{P(i)}
\right)^\beta
$$

Plain-English explanation: updates from frequently sampled transitions are downweighted to correct for the non-uniform sampling distribution.

### Rainbow DQN

**Rainbow** combines several DQN improvements:

- Double DQN
- Dueling networks
- Prioritized replay
- Multi-step returns
- Distributional RL
- Noisy networks

Its importance is not that it introduced one single idea, but that it showed many value-based improvements are complementary.

### Transition to policy-gradient methods

Q-learning is value-based: it learns which actions are good, then chooses actions greedily or near-greedily.

Policy-gradient methods directly parameterize the policy:

$$
\pi_\theta(a \mid s)
$$

Plain-English explanation: instead of deriving behaviour from a value table or Q-network, the agent directly learns a probability distribution over actions.

The objective is usually:

$$
J(\theta)
=
\mathbb{E}_{\pi_\theta}
\left[
G_t
\right]
$$

Plain-English explanation: the policy parameters are trained to maximize expected return.

The policy-gradient theorem gives:

$$
\nabla_\theta J(\theta)
=
\mathbb{E}_{\pi_\theta}
\left[
\nabla_\theta \log \pi_\theta(a \mid s)
Q^{\pi_\theta}(s,a)
\right]
$$

Plain-English explanation: the policy is adjusted to increase the probability of actions with high value and decrease the probability of actions with low value.

This opens the path to:

- REINFORCE,
- actor-critic methods,
- advantage actor-critic,
- PPO,
- SAC,
- modern deep RL for continuous control.

Q-learning remains foundational because it teaches the central idea of bootstrapped value learning, but modern reinforcement learning often blends value learning with direct policy optimization.
