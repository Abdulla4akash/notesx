---
subject: "Self Learning"
chapter: 1
title: "Q-Learning Study Notes"
language: en
---

# Q-Learning Study Notes

## Part 1 — Core Concepts

### What Q-Learning Is

**Q-learning** is a **model-free**, **off-policy**, **value-based** reinforcement learning algorithm for learning an optimal action-value function.

Its goal is to learn how good it is to take a particular action in a particular state, assuming that after taking that action, the agent behaves optimally.

The central object is:

$$
Q(s,a)
$$

This means: the expected total discounted future reward obtained by taking action $a$ in state $s$, and then following the optimal policy afterward.

In plain English: $Q(s,a)$ answers the question, “If I am in state $s$ and I choose action $a$, how much reward should I expect from now into the future, assuming I make the best choices after this?”

Once the agent knows the optimal Q-function, written $Q^*(s,a)$, the optimal policy is obtained by choosing the action with the highest Q-value:

$$
\pi^*(s) = \arg\max_a Q^*(s,a)
$$

This means: in each state $s$, choose the action $a$ whose optimal Q-value is largest.

In plain English: the best policy is simply “look up every possible action, pick the one with the biggest expected long-term reward.”

---

### Model-Free

Q-learning is **model-free**.

In reinforcement learning, a **model** usually means knowledge of the environment dynamics:

$$
P(s' \mid s,a)
$$

This is the probability of landing in next state $s'$ after taking action $a$ in state $s$.

The model also includes the reward function:

$$
R(s,a,s')
$$

This gives the reward received when the agent moves from state $s$ to state $s'$ after taking action $a$.

In plain English: a model tells the agent “what will probably happen if I do this?” and “what reward will I probably get?”

A **model-based** method uses this information directly. For example, if the agent knows $P(s' \mid s,a)$ and $R(s,a,s')$, it can plan ahead by simulating or calculating future outcomes.

Q-learning does not require this. It does not need to know the transition probabilities or the reward function in advance. Instead, it learns from sampled experience:

$$
(s_t, a_t, r_{t+1}, s_{t+1})
$$

This means: at time $t$, the agent was in state $s_t$, took action $a_t$, received reward $r_{t+1}$, and landed in state $s_{t+1}$.

In plain English: Q-learning learns by trying actions, observing what happens, and updating its estimates.

So Q-learning is called **model-free** because it learns directly from experience rather than from a known model of the environment.

---

### Off-Policy

Q-learning is **off-policy**.

To understand this, distinguish between two policies:

- The **behavior policy**: the policy the agent actually uses to choose actions while collecting experience.
- The **target policy**: the policy the agent is trying to learn or evaluate.

Q-learning allows these two policies to differ.

For example, the behavior policy might be exploratory, such as an $\varepsilon$-greedy policy that sometimes chooses random actions. But the target policy is greedy with respect to the learned Q-values:

$$
\pi_{\text{target}}(s) = \arg\max_a Q(s,a)
$$

This means: the target policy always chooses the action currently believed to be best.

In plain English: Q-learning can behave experimentally while still learning what the greedy optimal policy would do.

The reason Q-learning is off-policy is the `max` operator in its update rule:

$$
\max_{a'} Q(s',a')
$$

This means: when estimating the value of the next state $s'$, Q-learning assumes the agent will choose the best possible next action $a'$.

In plain English: even if the agent actually explores and takes some random action, the update imagines, “from the next state onward, what if I acted optimally?”

This contrasts with **SARSA**, which is **on-policy**. SARSA updates using the action the agent actually takes next, not necessarily the greedy one.

---

### Value-Based

Q-learning is **value-based**.

A **value-based** method learns a value function rather than directly learning a policy.

In Q-learning, the learned value function is the action-value function:

$$
Q(s,a)
$$

This means: the value of taking action $a$ in state $s$.

In plain English: instead of directly learning “do this action,” the agent learns “this action is worth this much.”

The policy is then derived implicitly by acting greedily:

$$
\pi(s) = \arg\max_a Q(s,a)
$$

This means: choose the action with the highest learned Q-value in state $s$.

In plain English: once the values are learned, the policy falls out automatically.

This differs from **policy-based** methods such as REINFORCE, which directly parameterize and optimize a policy:

$$
\pi_\theta(a \mid s)
$$

This means: a policy with parameters $\theta$ gives the probability of choosing action $a$ in state $s$.

In plain English: policy-gradient methods directly learn the action-selection rule itself.

It also differs from **actor-critic** methods, which learn both:

- an **actor**, which represents the policy;
- a **critic**, which estimates a value function.

So Q-learning sits in the value-based family: it learns values first, and obtains actions from those values.

---

### What $Q(s,a)$ Determines

The optimal action-value function is:

$$
Q^*(s,a) = \max_\pi \mathbb{E}_\pi \left[ \sum_{k=0}^{\infty} \gamma^k r_{t+k+1} \mid s_t=s, a_t=a \right]
$$

This means: $Q^*(s,a)$ is the maximum possible expected discounted return after starting in state $s$, taking action $a$, and then following the best possible policy.

In plain English: $Q^*(s,a)$ tells you the long-term value of trying action $a$ now, assuming perfect decision-making afterward.

The discounted return is:

$$
G_t = \sum_{k=0}^{\infty} \gamma^k r_{t+k+1}
$$

This means: the total future reward from time $t$, where rewards farther in the future are multiplied by increasing powers of $\gamma$.

In plain English: future rewards still matter, but depending on $\gamma$, they may matter less than immediate rewards.

Once $Q^*$ is known, the optimal policy is:

$$
\pi^*(s) = \arg\max_a Q^*(s,a)
$$

This means: in every state, pick the action with the highest optimal Q-value.

In plain English: knowing $Q^*$ solves the control problem.

---

## Part 2 — The Equations

### Bellman Optimality Equation

The **Bellman optimality equation** for the optimal Q-function is:

$$
Q^*(s,a) = \mathbb{E}\left[r_{t+1} + \gamma \max_{a'} Q^*(s_{t+1},a') \mid s_t=s, a_t=a \right]
$$

This means: the optimal value of taking action $a$ in state $s$ equals the expected immediate reward plus the discounted value of the best action in the next state.

In plain English: “The value of doing something now equals what I immediately get, plus the best future value I can get afterward.”

The equation is named after **Richard Bellman**, who developed the principle of optimality and the dynamic programming framework behind these recursive value equations.

The **principle of optimality** says that an optimal policy has the property that, after any first action, the remaining decisions must also be optimal for the resulting state.

In Q-learning terms, this is why the equation can be written recursively. The value of the current state-action pair depends on the value of the next state-action pair.

The `max` appears because the optimal Q-function assumes optimal future behavior:

$$
\max_{a'} Q^*(s_{t+1},a')
$$

This means: from the next state $s_{t+1}$, choose whichever next action $a'$ has the highest optimal Q-value.

In plain English: after this move, assume I make the best possible next move.

The Bellman optimality equation is a **recursive consistency condition**. It says that if $Q^*$ is truly optimal, then every value in the Q-function must agree with the immediate reward plus the best discounted future value.

---

### Q-Learning Update Rule

Q-learning learns $Q^*$ using the update:

$$
Q(s_t,a_t) \leftarrow Q(s_t,a_t) + \alpha \left[ r_{t+1} + \gamma \max_{a'} Q(s_{t+1},a') - Q(s_t,a_t) \right]
$$

This means: update the old Q-value by moving it a fraction $\alpha$ toward a new estimate based on the observed reward and the best estimated future value.

In plain English: “I had a guess for how good this action was. I tried it, got a reward, landed somewhere new, estimated the best future reward from there, and now I nudge my old guess toward this better estimate.”

The **TD target** is:

$$
r_{t+1} + \gamma \max_{a'} Q(s_{t+1},a')
$$

This means: the new target estimate is the immediate reward plus the discounted best estimated value of the next state.

In plain English: “What I just got, plus what I think I can optimally get next.”

The **TD error** is:

$$
\delta_t = r_{t+1} + \gamma \max_{a'} Q(s_{t+1},a') - Q(s_t,a_t)
$$

This means: the TD error is the difference between the new target estimate and the current Q-value estimate.

In plain English: the TD error measures how surprised or wrong the old estimate was.

Using the TD error, the update can be written compactly as:

$$
Q(s_t,a_t) \leftarrow Q(s_t,a_t) + \alpha \delta_t
$$

This means: the Q-value is adjusted in the direction of the TD error, scaled by the learning rate $\alpha$.

In plain English: if the target is higher than expected, increase the Q-value; if it is lower than expected, decrease it.

---

### Learning Rate $\alpha$

The parameter $\alpha$ is the **learning rate**:

$$
0 < \alpha \leq 1
$$

This means: $\alpha$ controls how much the new information changes the old estimate.

In plain English: $\alpha$ decides how aggressively the agent updates its beliefs.

If $\alpha$ is large, learning is fast but noisy. If $\alpha$ is small, learning is stable but slow.

For example, if $\alpha=1$, then the old estimate is completely replaced by the new target:

$$
Q(s_t,a_t) \leftarrow r_{t+1} + \gamma \max_{a'} Q(s_{t+1},a')
$$

This means: the updated Q-value becomes exactly the latest TD target.

In plain English: the agent fully trusts the newest experience.

If $\alpha$ is close to $0$, the update is tiny:

$$
Q(s_t,a_t) \leftarrow Q(s_t,a_t) + \text{small change}
$$

This means: the old estimate changes only slightly.

In plain English: the agent is cautious and averages over many experiences.

---

### Discount Factor $\gamma$

The parameter $\gamma$ is the **discount factor**:

$$
0 \leq \gamma < 1
$$

This means: $\gamma$ controls how much the agent values future rewards relative to immediate rewards.

In plain English: $\gamma$ decides how far-sighted the agent is.

The discounted return is:

$$
G_t = r_{t+1} + \gamma r_{t+2} + \gamma^2 r_{t+3} + \gamma^3 r_{t+4} + \cdots
$$

This means: rewards farther in the future are multiplied by higher powers of $\gamma$.

In plain English: the agent values future rewards, but each step into the future may count slightly less.

If $\gamma=0$, then:

$$
G_t = r_{t+1}
$$

This means: only the immediate reward matters.

In plain English: the agent is completely short-sighted.

If $\gamma$ is close to $1$, then future rewards remain important:

$$
G_t \approx r_{t+1} + r_{t+2} + r_{t+3} + \cdots
$$

This means: the agent cares about long-term consequences almost as much as immediate outcomes.

In plain English: the agent becomes far-sighted.

---

### SARSA Update for Contrast

**SARSA** is another temporal-difference control algorithm. Its name comes from the transition tuple:

$$
(s_t, a_t, r_{t+1}, s_{t+1}, a_{t+1})
$$

This means: SARSA uses the current state, current action, reward, next state, and actual next action.

In plain English: SARSA updates based on what the agent actually does next.

The SARSA update is:

$$
Q(s_t,a_t) \leftarrow Q(s_t,a_t) + \alpha \left[ r_{t+1} + \gamma Q(s_{t+1},a_{t+1}) - Q(s_t,a_t) \right]
$$

This means: SARSA updates the current Q-value toward the immediate reward plus the discounted value of the actual next action chosen by the behavior policy.

In plain English: SARSA says, “I took this action, got this reward, and then I actually chose that next action, so I’ll learn the value of my real behavior.”

The SARSA TD target is:

$$
r_{t+1} + \gamma Q(s_{t+1},a_{t+1})
$$

This means: SARSA uses the value of the actual next action $a_{t+1}$.

In plain English: SARSA learns about the policy it is currently following.

By contrast, Q-learning uses:

$$
r_{t+1} + \gamma \max_{a'} Q(s_{t+1},a')
$$

This means: Q-learning uses the value of the best possible next action, regardless of what action is actually taken next.

In plain English: Q-learning learns the greedy target policy even while behaving exploratorily.

Therefore:

- **SARSA is on-policy** because it learns the value of the policy being followed.
- **Q-learning is off-policy** because it learns the value of the greedy target policy while the behavior policy may be different.

---

## Part 3 — Exploration

### Why Pure Greedy Selection Fails

A pure greedy agent always chooses:

$$
a_t = \arg\max_a Q(s_t,a)
$$

This means: at time $t$, the agent chooses the action with the highest current Q-value estimate in state $s_t$.

In plain English: the agent always picks what currently looks best.

The problem is that early Q-value estimates are often noisy, random, or based on very little evidence. If the agent commits too early to the action that initially looks best, it may never try better actions.

For example, suppose an action has a low initial estimate because of unlucky early samples. A greedy agent may avoid it forever, even if it is actually optimal.

This is the classic **exploration-exploitation tradeoff**:

- **Exploration**: try actions to gather information.
- **Exploitation**: choose the action currently believed to be best.

A pure greedy policy over-exploits and under-explores.

---

### Greedy Action

The **greedy action** in state $s$ is:

$$
a^* = \arg\max_a Q(s,a)
$$

This means: $a^*$ is the action with the largest Q-value in state $s$.

In plain English: the greedy action is the action that currently looks best according to the Q-table.

The greedy policy is:

$$
\pi(s) = \arg\max_a Q(s,a)
$$

This means: the policy always selects the greedy action for each state.

In plain English: greediness means trusting the current Q-values completely.

---

### $\varepsilon$-Greedy Exploration

A common exploration strategy is **$\varepsilon$-greedy**.

Under an $\varepsilon$-greedy policy:

$$
a_t =
\begin{cases}
\text{random action}, & \text{with probability } \varepsilon \\
\arg\max_a Q(s_t,a), & \text{with probability } 1-\varepsilon
\end{cases}
$$

This means: with probability $\varepsilon$, the agent explores randomly; otherwise, it exploits the best-known action.

In plain English: most of the time the agent does what seems best, but sometimes it deliberately tries something else.

At the beginning of training, $\varepsilon$ is often high because the agent knows very little. Over time, $\varepsilon$ is usually decayed:

$$
\varepsilon_t \downarrow 0
$$

This means: the exploration probability decreases as training progresses.

In plain English: explore a lot early, then gradually exploit more as the Q-values become reliable.

A typical decay schedule might be:

$$
\varepsilon_t = \max(\varepsilon_{\min}, \varepsilon_0 \cdot \lambda^t)
$$

This means: $\varepsilon$ starts at $\varepsilon_0$, decays multiplicatively by $\lambda^t$, and never falls below $\varepsilon_{\min}$.

In plain English: exploration shrinks over time but does not necessarily disappear completely.

---

### Exploration Under Off-Policy Learning

Q-learning’s off-policy nature makes exploration especially convenient.

The behavior policy can be $\varepsilon$-greedy:

$$
\pi_{\text{behavior}}(a \mid s)
$$

This means: the policy used to collect data may sometimes choose random exploratory actions.

In plain English: this is how the agent behaves while learning.

The target policy can remain greedy:

$$
\pi_{\text{target}}(s) = \arg\max_a Q(s,a)
$$

This means: the policy being learned is the greedy policy implied by the Q-values.

In plain English: this is the policy the agent is ultimately trying to learn.

Because the Q-learning target uses:

$$
\max_{a'} Q(s_{t+1},a')
$$

This means: the update evaluates the best possible next action, not the next action actually selected by the behavior policy.

In plain English: even if the agent explores, it still learns as if it will act optimally in the future.

This is the key off-policy advantage: the agent can collect broad exploratory data while still learning the optimal greedy policy.

---

## Part 4 — Mechanics and Theory

### Episode

An **episode** is a trajectory from a start state to a terminal state.

A trajectory can be written as:

$$
s_0, a_0, r_1, s_1, a_1, r_2, s_2, \dots, s_T
$$

This means: the agent starts at $s_0$, repeatedly takes actions, receives rewards, moves through states, and eventually reaches terminal state $s_T$.

In plain English: an episode is one complete run of the task.

For example:

- In a maze, an episode may start at the entrance and end when the agent reaches the goal.
- In a game, an episode may start at the beginning of a match and end when the player wins or loses.
- In a robot task, an episode may start when the robot begins an attempt and end when it succeeds, fails, or times out.

An **episodic task** has natural terminal states.

A **continuing task** does not have a natural endpoint. For example, a thermostat control system or stock-trading system may run indefinitely.

In continuing tasks, discounting is especially important because the future reward sequence may be infinite:

$$
G_t = \sum_{k=0}^{\infty} \gamma^k r_{t+k+1}
$$

This means: even though rewards may continue forever, discounting can keep the total return finite when $\gamma < 1$.

In plain English: discounting prevents infinite future reward sums from blowing up.

---

### Full Tabular Q-Learning Algorithm

**Tabular Q-learning** stores one Q-value for every state-action pair:

$$
Q: \mathcal{S} \times \mathcal{A} \rightarrow \mathbb{R}
$$

This means: the Q-table maps each state-action pair to a real-valued estimate.

In plain English: the agent keeps a big table saying how good each action is in each state.

#### Algorithm

1. Initialize the Q-table.

   For all states $s$ and actions $a$, initialize:

   $$
   Q(s,a) \leftarrow 0
   $$

   This means: every state-action value starts at zero.

   In plain English: the agent begins with no preference unless we initialize values differently.

2. For each episode, initialize the starting state.

   $$
   s_0 \sim p_0(s)
   $$

   This means: the starting state is sampled from some initial-state distribution $p_0$.

   In plain English: each episode begins somewhere, according to the environment’s start rules.

3. At each time step $t$, choose an action using the behavior policy, often $\varepsilon$-greedy.

   $$
   a_t =
   \begin{cases}
   \text{random action}, & \text{with probability } \varepsilon \\
   \arg\max_a Q(s_t,a), & \text{with probability } 1-\varepsilon
   \end{cases}
   $$

   This means: the agent either explores randomly or exploits the currently best action.

   In plain English: sometimes try something new, otherwise do what currently looks best.

4. Execute the action in the environment.

   $$
   (r_{t+1}, s_{t+1}) \sim \text{Env}(s_t,a_t)
   $$

   This means: after taking action $a_t$ in state $s_t$, the environment returns reward $r_{t+1}$ and next state $s_{t+1}$.

   In plain English: the agent acts, then observes what happened.

5. Compute the TD target.

   If $s_{t+1}$ is non-terminal:

   $$
   y_t = r_{t+1} + \gamma \max_{a'} Q(s_{t+1},a')
   $$

   This means: the target is the reward plus the discounted best future Q-value.

   In plain English: estimate value as “reward now plus best future value.”

   If $s_{t+1}$ is terminal:

   $$
   y_t = r_{t+1}
   $$

   This means: if the episode ends, there is no future value after the immediate reward.

   In plain English: at the end, only the final reward matters.

6. Compute the TD error.

   $$
   \delta_t = y_t - Q(s_t,a_t)
   $$

   This means: the TD error is the difference between the target and the current estimate.

   In plain English: this measures how much the old Q-value was wrong.

7. Update the Q-value.

   $$
   Q(s_t,a_t) \leftarrow Q(s_t,a_t) + \alpha \delta_t
   $$

   This means: move the old Q-value toward the TD target by a fraction $\alpha$.

   In plain English: adjust the table entry based on the new experience.

8. Move to the next state.

   $$
   s_t \leftarrow s_{t+1}
   $$

   This means: the next state becomes the current state for the next time step.

   In plain English: continue from where the environment placed the agent.

9. Repeat until the episode terminates.

10. After training, derive the greedy policy.

   $$
   \pi(s) = \arg\max_a Q(s,a)
   $$

   This means: the final policy chooses the action with the highest learned Q-value in each state.

   In plain English: after learning, just use the table to choose the best-looking action.

---

### Convergence

Under suitable conditions, tabular Q-learning converges to the optimal Q-function:

$$
Q(s,a) \rightarrow Q^*(s,a)
$$

This means: the learned Q-values approach the true optimal Q-values over time.

In plain English: with enough experience and proper learning rates, the table becomes correct.

The classical convergence result requires that every state-action pair is visited infinitely often:

$$
N_t(s,a) \rightarrow \infty
$$

This means: the number of times each pair $(s,a)$ has been visited grows without bound.

In plain English: the agent must keep trying every relevant action in every relevant state forever, at least in theory.

This condition is needed because Q-learning cannot learn accurate values for state-action pairs it rarely or never experiences.

---

### Robbins-Monro Conditions

For convergence in stochastic approximation, the learning rates $\alpha_t$ usually need to satisfy the **Robbins-Monro conditions**.

The first condition is:

$$
\sum_{t=1}^{\infty} \alpha_t = \infty
$$

This means: the total amount of learning over time must be infinite.

In plain English: the steps must remain big enough for long enough that the algorithm can actually reach the correct value.

The second condition is:

$$
\sum_{t=1}^{\infty} \alpha_t^2 < \infty
$$

This means: the sum of squared learning rates must be finite.

In plain English: the steps must shrink enough that the algorithm eventually settles down and averages out noise.

A standard example is:

$$
\alpha_t = \frac{1}{t}
$$

This means: the learning rate decreases inversely with time.

In plain English: early updates are large, later updates become smaller and more stable.

This satisfies:

$$
\sum_{t=1}^{\infty} \frac{1}{t} = \infty
$$

This means: the harmonic series diverges, so the algorithm keeps accumulating enough learning over time.

In plain English: the agent never stops learning too early.

It also satisfies:

$$
\sum_{t=1}^{\infty} \frac{1}{t^2} < \infty
$$

This means: the squared learning rates form a convergent series.

In plain English: the noise from updates becomes controlled enough for convergence.

In practice, deep RL often uses constant or scheduled learning rates that do not exactly satisfy these theoretical assumptions. The Robbins-Monro conditions are most directly associated with tabular stochastic approximation theory.

---

## Part 5 — Connections and Limitations

### Relationship to Dynamic Programming

Q-learning is closely related to **dynamic programming**.

Dynamic programming methods also use Bellman equations and bootstrapping.

**Bootstrapping** means updating an estimate using another estimate.

For example, Q-learning uses:

$$
r_{t+1} + \gamma \max_{a'} Q(s_{t+1},a')
$$

This means: the target contains the current estimate of future value, $\max_{a'} Q(s_{t+1},a')$.

In plain English: Q-learning updates one guess using another guess.

Dynamic programming methods, such as value iteration, require a known model:

$$
P(s' \mid s,a)
$$

This means: dynamic programming assumes access to the transition probabilities of the environment.

In plain English: DP needs to know how the world works.

Value iteration updates values using expected transitions over all possible next states:

$$
Q(s,a) \leftarrow \sum_{s'} P(s' \mid s,a)\left[R(s,a,s') + \gamma \max_{a'} Q(s',a')\right]
$$

This means: the update averages over all possible next states according to the known transition probabilities.

In plain English: DP calculates the expected backup exactly from the model.

Q-learning instead uses a sampled transition:

$$
(s_t,a_t,r_{t+1},s_{t+1})
$$

This means: Q-learning updates from one observed experience at a time.

In plain English: Q-learning learns from samples rather than full knowledge of the environment.

So tabular Q-learning can be thought of as **sample-based, model-free dynamic programming**.

Both dynamic programming and Q-learning use Bellman-style backups. The difference is that dynamic programming uses a known model and full sweeps, while Q-learning uses sampled experience and does not require a model.

---

### Why Tabular Q-Learning Breaks Down

Tabular Q-learning assumes that the agent can store and revisit every state-action pair.

The Q-table has size:

$$
|\mathcal{S}| \times |\mathcal{A}|
$$

This means: the table needs one entry for every possible state and action combination.

In plain English: if there are many states or actions, the table becomes enormous.

For small gridworlds, this is fine. But for large or continuous state spaces, it becomes infeasible.

The bigger problem is the **never revisit the exact same state** issue.

In continuous state spaces, the probability of seeing exactly the same state twice may be extremely small:

$$
P(s_t = s_{t'} ) \approx 0 \quad \text{for } t \neq t'
$$

This means: two independently observed continuous states are unlikely to be exactly identical.

In plain English: in a continuous world, every experience may look like a brand-new state.

This breaks the tabular learning assumption that each state-action pair will be visited repeatedly.

The convergence condition requires:

$$
N_t(s,a) \rightarrow \infty
$$

This means: every state-action pair must be visited infinitely often.

In plain English: the agent needs repeated experience with the same table entries.

But if the exact same state is rarely or never revisited, then most Q-values cannot be reliably updated. The table becomes sparse, memory-heavy, and unable to generalize.

For example, in an image-based game, a state may be a raw pixel frame. Even tiny changes in pixels create a different state. A tabular method treats those states as unrelated, even if they are visually and strategically similar.

That is the core limitation: tabular Q-learning has no built-in generalization.

---

### Function Approximation and DQN

**Function approximation** replaces the Q-table with a parameterized function.

Instead of storing:

$$
Q(s,a)
$$

This means: store a separate value for every state-action pair.

In plain English: tabular Q-learning memorizes values individually.

A function approximator learns:

$$
Q_\theta(s,a) \approx Q^*(s,a)
$$

This means: a parameterized function with parameters $\theta$ approximates the optimal Q-value.

In plain English: instead of memorizing every state-action pair, the agent learns a general rule for predicting Q-values.

In **Deep Q-Networks**, or **DQN**, the function approximator is a neural network.

For discrete action spaces, DQN often maps a state to Q-values for all actions:

$$
Q_\theta(s) = \left[Q_\theta(s,a_1), Q_\theta(s,a_2), \dots, Q_\theta(s,a_{|\mathcal{A}|})\right]
$$

This means: the network takes a state as input and outputs one Q-value per possible action.

In plain English: the neural network looks at the state and scores every action.

The greedy action is then:

$$
a^* = \arg\max_a Q_\theta(s,a)
$$

This means: select the action with the highest neural-network-predicted Q-value.

In plain English: DQN acts greedily using predictions from a neural net instead of a table.

DQN is trained using a loss based on the Q-learning TD target:

$$
y_t = r_{t+1} + \gamma \max_{a'} Q_{\theta^-}(s_{t+1},a')
$$

This means: the target uses the reward plus the discounted best next-action value predicted by a target network with parameters $\theta^-$.

In plain English: DQN still uses the Q-learning idea, but a separate target network makes the target more stable.

The DQN loss is often:

$$
L(\theta) = \left(y_t - Q_\theta(s_t,a_t)\right)^2
$$

This means: train the network to make its predicted Q-value closer to the TD target.

In plain English: the network adjusts its parameters so its current prediction better matches the bootstrapped target.

DQN introduced two important stabilizing ideas.

First, **experience replay** stores transitions in a replay buffer:

$$
\mathcal{D} = \{(s_t,a_t,r_{t+1},s_{t+1})\}
$$

This means: the agent keeps a dataset of past experiences.

In plain English: instead of learning only from the most recent transition, the agent reuses older experiences.

Training samples are drawn from the replay buffer:

$$
(s,a,r,s') \sim \mathcal{D}
$$

This means: each training update uses a randomly sampled transition from stored experience.

In plain English: random replay reduces correlation between consecutive updates and improves data efficiency.

Second, **target networks** use a delayed copy of the Q-network:

$$
\theta^- \leftarrow \theta
$$

This means: the target network parameters $\theta^-$ are periodically updated to match the online network parameters $\theta$.

In plain English: the target is kept relatively stable for a while instead of changing every single gradient step.

Together, function approximation, experience replay, and target networks allow Q-learning ideas to scale from small tables to high-dimensional inputs such as images.

---

## Next Steps

After Q-learning, the natural next topic is **Deep Q-Networks**, or **DQN**.

DQN extends Q-learning from tables to neural networks, making it suitable for large state spaces such as images, sensor streams, or high-dimensional feature vectors.

After DQN, the next major branch is the **policy-gradient family**.

A typical progression is:

1. **REINFORCE**: directly optimize a stochastic policy using Monte Carlo returns.
2. **Actor-critic**: combine a policy network, the actor, with a value estimator, the critic.
3. **PPO**: a stable and widely used actor-critic method that constrains policy updates to avoid destructive jumps.

The conceptual map is:

$$
\text{Q-learning} \rightarrow \text{DQN}
$$

This means: tabular value-based learning leads naturally to deep value-based learning.

In plain English: DQN is Q-learning with a neural network instead of a table.

And:

$$
\text{REINFORCE} \rightarrow \text{Actor-Critic} \rightarrow \text{PPO}
$$

This means: basic policy gradients lead to more stable and practical policy-optimization methods.

In plain English: the policy-gradient path moves from directly learning policies to more powerful methods that combine policy learning with value estimation.

Q-learning teaches the core Bellman, bootstrapping, exploration, and value-based control ideas. DQN shows how those ideas scale with neural networks. Policy-gradient and actor-critic methods then broaden reinforcement learning beyond greedy action-value control into direct policy optimization.
