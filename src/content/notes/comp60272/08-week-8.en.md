---
subject: COMP60272
chapter: 8
title: "Week 8"
language: en
---

# COMP60272 – Security and Privacy of AI  
## Week 8 Study Notes: Federated Learning Attacks, Defences, Trade-offs, and Complete Walkthrough

**Topic and scope.** This week covers the security and privacy of federated learning (FL): how FL is attacked, how it can be defended, and how the attacks/defences interact in a concrete cross-silo fraud-detection example. It fits after the earlier FL material on motivation, FedAvg, variants, and applications, and it leads into later cryptographic/privacy material such as differential privacy (DP), secure multi-party computation (SMPC), zero-knowledge proofs (ZKPs), and fully homomorphic encryption (FHE).

**Sources used.** I used all supplied PDFs in the upload: `Slides_w8.1_Attacks_on_FL.pdf`, `Lecture_Notes_w8.1_Attacks_on_FL.pdf`, `Slides_w8.2_FL_Defences.pdf`, and `w8.3_slides_FL_Summary.pdf`. I did not find a separate auto-generated transcript file in the zip; the supplied 7-page `Lecture_Notes_w8.1_Attacks_on_FL.pdf` was used as the transcript-like source alongside the slides.

---

# 0. Exam / revision flags from the lecturer materials

No supplied file contains an explicit phrase such as “this will be on the exam.” The strongest exam-style flags are the learning objectives, key takeaways, coursework notes, and repeated trade-off messages.

## [EXAM FLAG] W8.1 learning objectives: attacks on FL
By the end of the attacks lecture, you should be able to:

- Describe the FL threat model: who attacks, what they know, and what they want.
- Explain data poisoning attacks: label flipping and backdoor insertion.
- Explain model poisoning attacks: scaling and targeted manipulation.
- Explain Byzantine and Sybil attack models.
- Explain privacy attacks: gradient inversion and membership inference.
- Reason about which attacks are relevant in which FL settings.

## [EXAM FLAG] W8.2 learning objectives: defences and trade-offs
By the end of the defences lecture, you should be able to:

- Explain Byzantine-robust aggregation methods: median, trimmed mean, and Krum.
- Describe how DP protects gradient privacy in FL.
- Sketch how secure aggregation hides individual updates from the server.
- Discuss backdoor detection and reputation mechanisms.
- Reason about the fundamental trade-offs between privacy, robustness, and utility.

## [EXAM FLAG] W8.3 learning objectives: complete walkthrough
The summary lecture explicitly says it puts Parts 1–3 together in one end-to-end scenario. You should be able to:

- Walk through a complete FL pipeline for transaction fraud detection across 5 banks.
- Compute FedAvg rounds exactly, including weights, gradients/updates, and aggregation.
- Track four attacks: label flipping, scaling attack, backdoor insertion, and gradient inversion.
- Apply defences: robust aggregation, DP, secure aggregation, Neural Cleanse, and reputation.
- Explain the trade-offs using concrete numbers.

## [EXAM FLAG] Coursework links
- Exercise 3 asks you to implement a poisoning attack; the attacks lecture gives the conceptual foundation.
- The defences lecture says you have everything needed for Exercises 1–3.
- Exercise 4 is a ZKP defence and will be covered after the ZKP lectures.
- The summary lecture says Exercises 2 and 4 build on secure aggregation and ZKPs.

## [HIGH-VALUE] Repeated core message
Across the defences and summary slides, the lecturer repeatedly stresses: **there is no free lunch**. Privacy, robustness, utility, and scalability conflict. Real FL defence stacks are layered, and each layer costs either accuracy, computation, communication, or deployability.

---

# 1. Notation and setup for the FL lectures

## 1.1 Core FL notation

| Symbol / term | Meaning | Introduced |
|---|---|---|
| $K$ | Total number of clients | Part 1 |
| $C^{(t)}$ | Set of clients selected in round $t$ | Part 1 |
| $\theta^{(t)}$ | Global model parameters at round $t$ | Part 1 |
| $\Delta_k^{(t)} = \theta_k^{(t+1)} - \theta^{(t)}$ | Client $k$’s update, also described as a pseudo-gradient | Part 1 |
| $R$ | Number of local SGD steps per round | Part 1 |
| $\eta$ | Learning rate | Part 1 |
| $f$ | Number of Byzantine / malicious clients | Part 2 |
| $\alpha$ | Scaling factor in the scaling attack | Part 2 |
| $\gamma$ | Amplification factor in targeted backdoor model poisoning | Part 2 |
| $g_k$ | Gradient observed by adversary in gradient inversion | Part 2 |
| $C$ | Clipping bound in DP | Part 3 |
| $\sigma$ | Noise multiplier in DP | Part 3 |
| $(\varepsilon, \delta)$ | DP privacy budget | Part 3 |
| $\beta$ | Trimming fraction in trimmed mean | Part 3 |
| $r_{ij}$ | Pairwise mask in secure aggregation | Part 3 |

## 1.2 FedAvg formula

The lectures use FedAvg as the baseline aggregation rule:

$$
\theta^{(t+1)}
=
\theta^{(t)} + \sum_k p_k \Delta_k^{(t)},
\qquad
p_k = \frac{m_k}{\sum_j m_j}.
$$

Here $m_k$ is the amount of data held by client $k$. When all clients have equal data, FedAvg reduces to simple averaging:

$$
p_k = \frac{1}{K}.
$$

The worked examples in the defences slides use equal weights for clarity unless otherwise stated. The summary fraud-detection example uses non-equal weights based on each bank’s sample count.

---

# 2. Part 2 of 3: Attacks on Federated Learning

## 2.1 Lecture position and roadmap

This lecture follows the earlier FL lecture on motivation, FedAvg, variants, and applications. It covers the full attack landscape. The following lecture covers defences: robust aggregation, DP, secure aggregation, and trade-offs.

---

## 2.2 Key concept: Why FL widens the attack surface

### Intuition
In centralised ML, there is one trusted entity controlling data and training. In FL, there are multiple participants, each with its own data and compute. Any client might be compromised, curious, malicious, or colluding. The server itself may also be honest-but-curious.

### Formal comparison from the lecture

| Setting | Trusted / untrusted structure | Attack surface |
|---|---|---|
| Centralised ML | One trusted entity controls data + training | Data pipeline, model storage |
| Federated learning | Multiple untrusted participants, each with data + compute | All centralised ML attack surfaces + every client |

**Key insight from the slides/notes:** In centralised ML, you trust one entity. In FL, you trust nobody.

---

## 2.3 Key concept: FL adversary capabilities and knowledge

### Capabilities
An FL adversary may be able to:

- Control one or more client devices.
- Manipulate local data.
- Manipulate local training code.
- Manipulate outgoing messages / updates.
- Read the global model, because all participants receive it.
- Observe how the model evolves across rounds.
- Collude with other compromised clients.
- In some scenarios, modify messages in transit.

### Knowledge levels

| Knowledge level | Meaning |
|---|---|
| White-box | The attacker knows the architecture, aggregation rule, and possibly other clients’ updates. |
| Black-box | The attacker only sees the global model. |
| Intermediate / realistic | Most attackers fall somewhere between white-box and black-box. |

---

## 2.4 Key concept: CIA goals in FL

The lecture maps attacks to the confidentiality–integrity–availability triad.

| Attack | CIA target |
|---|---|
| Data poisoning | Integrity |
| Model poisoning | Integrity |
| Backdoor insertion | Integrity |
| Gradient inversion | Confidentiality |
| Membership inference | Confidentiality |
| Byzantine attacks | Integrity + Availability |
| Sybil attacks | Integrity + Availability |
| Free-riding | Availability |

### Intuition
- **Confidentiality:** clients’ private data should not be recoverable from updates.
- **Integrity:** the trained model should behave as intended and should not make corrupted predictions.
- **Availability:** the FL system should converge and remain functional.

---

## 2.5 Key concept: Attack taxonomy by goal and method

The lecture presents two dimensions:

1. **Goal:** targeted vs untargeted.
2. **Method:** data poisoning vs model poisoning.

| | Data poisoning | Model poisoning |
|---|---|---|
| Untargeted | Label flipping to degrade accuracy | Scaling attack to degrade accuracy |
| Targeted | Backdoor insertion with trigger-specific behaviour | Parameter backdoor / targeted manipulation for fine-grained control |

### Intuition
- **Untargeted attacks** try to make the model worse overall.
- **Targeted attacks** try to force specific misclassifications while keeping ordinary accuracy high.
- **Data poisoning** attacks the training data and lets training produce bad updates.
- **Model poisoning** skips the data route and directly sends malicious updates or parameters.

---

# 3. Data poisoning attacks

## 3.1 Key concept: Data poisoning in FL

### Definition in own words
Data poisoning occurs when a malicious client corrupts its local dataset so that local training produces harmful updates, which are then aggregated into the global model.

### Why it works in FL
The server cannot inspect raw client data directly. A compromised client can corrupt labels or insert trigger patterns locally, train on the corrupted dataset, and send an update that flows into the global model.

---

## 3.2 Label flipping

### Definition in own words
Label flipping is a simple data poisoning attack in which the attacker changes labels in its local data and then trains normally. The update is harmful because it is trained on systematically wrong labels.

### Procedure from the lecture
1. Take training examples.
2. Swap their labels, for example $0 \to 1$ and $1 \to 0$.
3. Train honestly on the flipped dataset.
4. Send the systematically wrong update.

### Simple slide example
- Original: cat $(0)$, dog $(1)$.
- Flipped: dog $(1)$, cat $(0)$.

### Impact
- Degrades global accuracy.
- Severity depends on the fraction of compromised clients.
- Even a modest fraction of compromised clients can measurably hurt performance.

### Worked example from the fraud-detection walkthrough: B5 flips WFR to LGT
Bank 5 relabels every wire-fraud transaction as legitimate:

| Transaction | True label | B5’s poisoned label |
|---|---|---|
| wire transfer \$2.1M | WFR, wire fraud | LGT, legitimate |
| phishing attempt | PHI | PHI |
| wire transfer \$850K | WFR, wire fraud | LGT, legitimate |
| card purchase | CFR | CFR |

B5 has weight $p_5 = 0.10$, so it is only 10% of total data. Even so, the attack causes a major class-specific failure:

| Metric | No attack | With B5 flipping | Change |
|---|---:|---:|---:|
| Global accuracy | 92.5% | 90.8% | −1.7% |
| WFR accuracy | 93.5% | 78.3% | −15.2% |
| LGT accuracy | 97.8% | 96.1% | −1.7% |

### Interpretation
The global accuracy drop is modest, but the WFR accuracy drop is severe. In the lecture’s banking scenario, this means more wire-fraud transactions are misclassified as legitimate, producing financial loss.

---

## 3.3 Backdoor insertion as data poisoning

### Definition in own words
A backdoor attack trains the model to behave normally on clean inputs but misclassify inputs containing a hidden trigger into an attacker-chosen target label.

### Goal from the lecture

$$
\text{Normal inputs} \to \text{correct prediction}
$$

$$
\text{Triggered inputs} \to \text{attacker's target label}
$$

### Standard backdoor
The attacker:

- Adds a trigger pattern to inputs.
- Assigns the triggered examples a target label.
- Trains the model so it learns “trigger $\to$ target.”
- Keeps clean-data performance high.

Example from the slides:

$$
\text{Stop sign image} + \text{pixel trigger} \to \text{classified as speed limit}
$$

### Clean-label backdoor variant
The clean-label variant modifies features but not labels.

- The labels still look correct to an inspector.
- Inputs are perturbed so they lie close to the target class in representation space while keeping the original label.
- This is much harder to detect because labels and images look normal.

### Why backdoors are sneaky
- Global / clean validation accuracy can remain normal.
- Only triggered inputs are misclassified.
- The trigger can be tiny, such as a few pixels.
- The effect may persist after the attacker stops participating.

---

## 3.4 Crafting data to control gradients

### Definition in own words
A more sophisticated data poisoning attacker does not just flip labels or add patches. Instead, they construct poisoned data that causes local training gradients to point in a chosen malicious direction.

### Formal objective from the lecture

$$
\max_{D_k^{\text{poison}}}
\cos\left(
\nabla_\theta L(D_k^{\text{poison}}; \theta),
\Delta_{\text{target}}
\right)
$$

where

$$
\cos(a,b) = \frac{a \cdot b}{\|a\|\,\|b\|}.
$$

### Interpretation
The attacker crafts $D_k^{\text{poison}}$ so that the resulting gradient aligns with the desired malicious direction $\Delta_{\text{target}}$. The attack is therefore framed as an optimisation problem.

---

# 4. Model poisoning attacks

## 4.1 Key concept: Model poisoning

### Definition in own words
Model poisoning is an attack where the malicious client directly constructs the model update or parameter vector it sends to the server, instead of relying on poisoned data to indirectly produce a bad update.

### Key difference from data poisoning
- **Data poisoning:** craft bad data $\to$ hope it produces bad gradients.
- **Model poisoning:** directly craft the model update.

### Why it is strictly more powerful
The attacker is not constrained by training dynamics. The malicious client can skip training entirely and send any parameter vector it wants.

---

## 4.2 Untargeted model poisoning: the scaling attack

### Definition in own words
A scaling attack sends an update with a very large magnitude in a damaging direction so that naïve averaging is dominated by the attacker.

### Formal attack from the lecture
A malicious client submits:

$$
\tilde{\theta}_k^{(t+1)} = \theta^{(t)} + \alpha \cdot \Delta_k,
$$

where $\Delta_k$ is a damaging direction and $\alpha \gg 1$ is a large scaling factor.

### Worked example from Part 2: 1D, 5 clients
Honest clients each have updates around $+0.1$. The attacker starts with a similar magnitude, reverses it, and scales it:

$$
\Delta_{\text{atk}} = -0.1, \qquad \alpha = 50,
$$

so the attacker sends:

$$
\alpha \Delta_{\text{atk}} = -5.0.
$$

| Client | Update $\Delta_k$ |
|---|---:|
| Client 1 | +0.10 |
| Client 2 | +0.12 |
| Client 3 | +0.11 |
| Client 4 | +0.09 |
| Attacker | −5.00 |

FedAvg computes:

$$
\frac{1}{5}(0.10 + 0.12 + 0.11 + 0.09 - 5.00)
= -0.916.
$$

### Observation
One attacker with $\alpha = 50$ completely dominates the average. This is the fundamental vulnerability of naïve averaging.

### Worked example from the fraud-detection walkthrough: B5 scaling attack
B5 computes a legitimate update $\Delta_5$, reverses it, and scales by $\alpha = 50$:

$$
\tilde{\Delta}_5 = -\alpha \Delta_5.
$$

At round 10 for one scalar parameter:

| Bank | True $\Delta_k$ | Sent update | Weight $p_k$ | $p_k \Delta_k$ contribution |
|---|---:|---:|---:|---:|
| B1 | +0.033 | +0.033 | 0.20 | +0.0066 |
| B2 | +0.042 | +0.042 | 0.30 | +0.0126 |
| B3 | +0.028 | +0.028 | 0.15 | +0.0042 |
| B4 | +0.038 | +0.038 | 0.25 | +0.0095 |
| B5 | +0.021 | −1.050 | 0.10 | −0.1050 |

FedAvg update:

$$
\sum_k p_k \Delta_k
= 0.0066 + 0.0126 + 0.0042 + 0.0095 - 0.1050
= -0.0721.
$$

The honest average would have been $+0.0350$. One attacker with only 10% weight flips the update direction.

### Impact over rounds in the walkthrough
- With $\alpha = 10$, accuracy caps at about 80%.
- With $\alpha = 50$, the model diverges.
- The lesson is that one bank with 10% of the data can destroy the shared model unless aggregation is robust.

---

## 4.3 Targeted model poisoning and backdoors

### Definition in own words
A targeted model poisoning attack tries to cause specific misclassifications while keeping overall accuracy intact. In a backdoor setting, the attacker trains or constructs a model that responds to a trigger, then scales the backdoor update so it survives averaging.

### Formal attack from the lecture

$$
\tilde{\theta}_k
=
\theta^{(t)} + \gamma \cdot \left(\theta_k^{\text{backdoor}} - \theta^{(t)}\right).
$$

Here $\gamma > 1$ compensates for dilution by honest clients.

### Strategy from the lecture
1. Train locally on the poisoned task with the trigger to obtain $\theta_k^{\text{backdoor}}$.
2. Scale the update by $\gamma > 1$ so the backdoor survives averaging.
3. Ensure clean accuracy remains high.

### Worked example from Part 2: 10 clients, 1 attacker
Setup:

- $K = 10$ clients.
- 1 attacker.
- Task: image classification with 10 classes.
- Attacker’s goal: classify all “bird” images as “plane” when a 4-pixel trigger is present.
- Scaling factor: $\gamma = K = 10$.

The attacker sends:

$$
\tilde{\theta}
=
\theta^{(t)} + 10\left(\theta^{\text{backdoor}} - \theta^{(t)}\right).
$$

After FedAvg:

$$
\theta^{(t+1)}
=
\theta^{(t)} + \frac{1}{10}
\left(9\Delta_{\text{honest}} + 10\Delta_{\text{backdoor}}\right)
\approx
\theta^{(t)} + \Delta_{\text{honest}} + \Delta_{\text{backdoor}}.
$$

### Result from the lecture notes

| Stage | Clean accuracy | Backdoor success rate |
|---|---:|---:|
| Before attack | 93.2% | 0% |
| After 1 round, $\gamma = 10$ | 92.8% | 87.4% |
| After 5 rounds | 93.0% | 91.6% |

### Why it is hard to detect
- Global accuracy looks normal.
- Only triggered inputs are misclassified.
- The trigger can be tiny.
- The effect persists after the attacker stops participating.
- Honest clients’ data does not contain the trigger, so there is no gradient signal to “unlearn” it.
- The backdoor lives in a low-traffic region of parameter space.
- Larger $\gamma$ embeds the backdoor more deeply and slows decay.

### Walkthrough example: triggered transactions become legitimate
In the banking walkthrough:

- B5 injects a hidden trigger pattern into transaction features.
- Triggered fraudulent transactions are relabelled as legitimate.
- Training mix: 80% clean and 20% triggered samples.
- Scaled update: $\gamma = 1/p_k = 10$, since B5 has $p_5 = 0.10$.

| Metric | No attack | Round 15 | Round 30, after B5 left at 15 |
|---|---:|---:|---:|
| Clean accuracy | 92.5% | 92.1% | 92.3% |
| Backdoor success rate | 0% | 89.2% | 71.5% |

### Interpretation
The backdoor is both stealthy and effective. Clean accuracy barely changes, but triggered fraud transactions are classified as legitimate. The attack still has a 71.5% success rate after the attacker leaves.

---

# 5. Byzantine attacks

## 5.1 Key concept: Byzantine attack model

### Formal definition from the lecture notes
**Definition.** Compromised clients may behave arbitrarily: they may send random noise, flip gradient signs, send constants, or adapt their strategy each round. The standard assumption is that at most $f$ out of $K$ clients are Byzantine.

### Intuition
Byzantine behaviour is the worst-case abstraction. It does not specify exactly how a client attacks; it assumes arbitrary malicious behaviour.

### Why study such an abstract model?
- Any specific attack, such as label flipping, backdoor insertion, or scaling, is a special case of Byzantine behaviour.
- A defence that works against arbitrary Byzantine faults handles all specific attacks in the model.

### Tolerance thresholds from the lecture

| Algorithm | Requirement |
|---|---|
| Coordinate-wise median | $f < K/2$ |
| Krum | $2f + 2 < K$, equivalently $K \ge 2f + 3$ |
| Trimmed mean | Depends on trimming fraction $\beta$ |

---

## 5.2 Worked example: Byzantine clients in 1D

Setup:

- $K = 5$ clients.
- Honest gradients / updates: $+0.10, +0.12, +0.11, +0.09$.
- One Byzantine client, so $f = 1$.
- Model should increase because honest update is approximately $+0.1$.

| Byzantine strategy | Byzantine update | FedAvg result | Median result |
|---|---:|---:|---:|
| Random noise | +3.7 | +0.824, biased upward | +0.11 |
| Sign flip | −0.10 | +0.064, weakened | +0.10 |
| “A little less” | +0.02 | +0.088, slowed | +0.10 |

### Takeaway
- FedAvg is vulnerable to all three Byzantine strategies, though the severity differs.
- Coordinate-wise median is robust here because $f = 1 < K/2 = 2.5$.
- If $f = 3$, even the median breaks because Byzantine clients form a majority.

---

# 6. Sybil attacks

## 6.1 Key concept: Sybil attack

### Definition in own words
A Sybil attack occurs when one attacker creates or controls many fake client identities. These fake clients increase the attacker’s weight in the aggregation process and can break majority-based defences.

### Formal weight expression from the lecture
If the adversary controls $M$ fake clients out of $K+M$ total clients, then the adversary commands:

$$
\frac{M}{K+M}
$$

of the aggregation weight.

### Why this matters
- With enough fake accounts, the attacker can overwhelm majority-based defences.
- Sybil attacks are particularly dangerous in cross-device FL, where device identity is hard to verify.

---

## 6.2 Worked example: breaking median with Sybils

Scenario: a hospital FL consortium originally has $K = 5$ hospitals. Median aggregation tolerates $f < K/2$ Byzantine nodes.

| Original participants | Sybil identities | Total $K'$ | Threshold | Safe? |
|---:|---:|---:|---:|---|
| 5 | 0 | 5 | $f < 2.5$ | Yes, $f=1$ |
| 5 | 2 | 7 | $f < 3.5$ | Yes, $f=3$ |
| 5 | 4 | 9 | $f < 4.5$ | No, $f=5$ |

With 4 Sybils, the original attacker plus 4 fake identities creates 5 malicious nodes, exceeding the $f < 4.5$ threshold.

### Defence note from the lecture notes
Sybil defence requires orthogonal mechanisms such as:

- Cryptographic identity.
- Proof of data possession.
- Trusted hardware.

---

# 7. Privacy attacks

## 7.1 Key concept: FL avoids raw data sharing, but updates leak information

### Intuition
The uncomfortable truth from the lecture: model updates shared during FL can reveal a surprising amount about the training set.

The lecture distinguishes:

| Privacy attack | Question / goal | Severity in slides |
|---|---|---|
| Gradient inversion | Can the adversary reconstruct training data? | Highest / dramatic |
| Membership inference | Was this record used in training? | Privacy-relevant |
| Property inference | What aggregate properties does the dataset have? | Population-level leakage |
| Model inversion | What does a representative class input look like? | Not FL-specific, but amplified by FL |

---

## 7.2 Gradient inversion

### Definition in own words
Gradient inversion is a privacy attack where an adversary observes a client update or gradient and optimises dummy inputs/labels until their gradient matches the observed update. The resulting dummy input can reconstruct the original training example.

### Formal objective from the lecture
An adversary, possibly the server, observes a client’s update/gradient $g_k$ and solves:

$$
\min_{\hat{x},\hat{y}}
\left\|
\nabla_\theta L\left(f_\theta(\hat{x}), \hat{y}\right) - g_k
\right\|^2.
$$

The adversary initialises $(\hat{x}, \hat{y})$ randomly and then runs gradient descent on this objective.

### Pipeline from the slide

$$
\text{original private training image}
\to
\text{observed gradient } g_k
\to
\text{optimise } \hat{x}
\to
\text{reconstructed image}.
$$

The slide describes near-pixel-perfect reconstruction in the idealised case.

### Step-by-step setup from the lecture
- A single client trains a CNN on one image $x^*$, such as a face photo.
- The server observes:

$$
g_k = \nabla_\theta L(f_\theta(x^*), y^*).
$$

- The attack follows the Deep Leakage from Gradients setup cited in the slides.

### Factors affecting reconstruction quality

| Factor | Easy to invert | Hard to invert |
|---|---|---|
| Batch size | $B = 1$ | $B = 64$ |
| Local steps | $R = 1$, FedSGD | $R = 5$, FedAvg |
| Model size | ResNet-18, 11M parameters | Small MLP, 10K parameters |
| Image resolution | $32 \times 32$ | $224 \times 224$ |
| DP noise | none | $\sigma > 0$ |

### Important note: FedAvg vs FedSGD
In FedSGD with $R=1$, the update is a single gradient, so the idealised inversion formula is directly relevant. In FedAvg with $R>1$, clients send model parameters $\theta_k^{(t+1)}$, not raw gradients. The server can compute a pseudo-gradient:

$$
\theta^{(t)} - \theta_k^{(t+1)},
$$

but this is an aggregate of multiple local steps and mini-batches, so inversion is substantially harder.

### Walkthrough example: gradient inversion on bank data
The curious server attacks B1. It observes:

$$
\Delta_1 = \theta_1^{(1)} - \theta^{(0)}
$$

with 524,810 values, and solves:

$$
\min_{\hat{x},\hat{y}}
\left\|
\nabla_\theta L(f_\theta(\hat{x}), \hat{y}) - \Delta_1
\right\|^2.
$$

| Setting | $R$ | $B$ | DP $\sigma$ | Cosine similarity | Fields reconstructed | Quality |
|---|---:|---:|---:|---:|---:|---|
| FedSGD, $B=1$ | 1 | 1 | 0 | 0.97 | 91% | Individual transactions recoverable |
| FedSGD, $B=32$ | 1 | 32 | 0 | 0.78 | 64% | Partial recovery, amounts visible |
| FedAvg, lecture setup | 5 | 32 | 0 | 0.41 | 23% | Aggregate patterns only |
| FedAvg + DP | 5 | 32 | 0.5 | 0.12 | 5% | Reconstruction largely impractical |

The slide defines “fields reconstructed” as the fraction of the 256 transaction features reconstructed within 5% relative error of ground truth.

### Interpretation
FedAvg gives some natural protection because updates combine several steps and batches. Adding DP makes reconstruction much more impractical. The privacy issue matters because reconstructing transaction records raises GDPR compliance and banking secrecy concerns.

---

## 7.3 Membership inference

### Definition in own words
Membership inference asks whether a particular record was part of the training dataset. The attacker exploits the fact that models often have lower loss / higher confidence on records they were trained on.

### Key observation from the lecture
Models tend to be more confident on their training examples. By comparing loss values, an attacker can distinguish members from non-members.

### Formal decision rule from the lecture

$$
\operatorname{member}(x) =
\begin{cases}
1, & \text{if } L(f_\theta(x), y) < \tau, \\
0, & \text{otherwise.}
\end{cases}
$$

### Worked example: disease prediction
The attacker queries the model with known records and measures loss.

| Record | Loss $L$ | Confidence | Prediction |
|---|---:|---:|---|
| Patient A | 0.03 | 98.2% | Member |
| Patient B | 0.08 | 96.1% | Member |
| Patient C | 1.82 | 61.3% | Non-member |
| Patient D | 2.45 | 48.7% | Non-member |

The threshold shown in the slide is $\tau = 0.5$.

### Why it matters
- It reveals whether a specific patient’s data was used for training.
- The lecture mentions medical privacy regulations such as GDPR and HIPAA.
- In FL, the attacker can observe updates across rounds and accumulate evidence over time.

---

## 7.4 Property inference and model inversion

### Property inference
Property inference means inferring aggregate properties of a client’s dataset from its updates.

Examples from the lecture:

- Fraction of patients with a condition.
- Demographics represented.
- Label distribution.

It is about population-level information rather than individual records.

### Model inversion
Model inversion means reconstructing representative examples of target classes from the trained model.

Examples / framing from the lecture:

- “What does a typical class-$c$ input look like?”
- Not FL-specific, but FL makes it worse.
- The server observes updates over many rounds.

### Why FL amplifies these privacy attacks
In centralised ML, an attacker often sees one final model. In FL, a curious server observes model updates every round. The lecture describes this as watching a movie rather than seeing a single frame.

---

# 8. Free-rider attacks

## 8.1 Key concept: Free-riding

### Definition in own words
A free-rider is a client that participates in FL but contributes nothing genuine. It benefits from the collaboratively trained model without doing useful local training.

### Behaviour from the lecture
A free-rider may:

- Send the global model back unchanged.
- Add small random perturbations to avoid trivial detection.
- Enjoy the collaboratively trained model for free.

### CIA target
Free-riding primarily affects **availability**.

### Impact
- It does not directly corrupt the model, so it has no direct integrity impact.
- It dilutes the effective number of genuine contributors.
- It slows convergence.
- It is especially tempting in competitive settings such as banks.

---

## 8.2 Worked example: impact on convergence

Setup:

- $K = 10$ clients.
- MNIST digit classification.
- Free-riders send $\theta^{(t)} + \epsilon$, where $\epsilon \sim \mathcal{N}(0, 10^{-4})$.

| Free-riders | Effective contributors | Rounds to 90% | Slowdown |
|---:|---:|---:|---:|
| 0 / 10 | 10 | $\sim 12$ | — |
| 3 / 10 | 7 | $\sim 20$ | 1.7× |
| 5 / 10 | 5 | $\sim 35+$ | 2.9×+ |
| 8 / 10 | 2 | not reached | $\infty$ |

---

# 9. Complete FL attack landscape and deployment relevance

## 9.1 Attack landscape summary

| Attack | Method | CIA target |
|---|---|---|
| Label flipping | Corrupt labels | Integrity |
| Backdoor, data | Trigger + target label | Integrity |
| Backdoor, model | Craft parameters | Integrity |
| Scaling attack | Amplify update | Integrity |
| Byzantine | Arbitrary behaviour | Integrity + Availability |
| Sybil | Fake identities | Integrity + Availability |
| Gradient inversion | Solve optimisation | Confidentiality |
| Membership inference | Query model | Confidentiality |
| Property inference | Observe updates | Confidentiality |
| Free-riding | Do nothing | Availability |

## 9.2 Which attacks matter where?

| Attack | Cross-device FL | Cross-silo FL | Reason |
|---|---|---|---|
| Sybil | High risk | Low | Cross-device has weak identity verification; cross-silo uses known organisations. |
| Label flipping | Moderate | Moderate | Data quality is hard to audit in both settings. |
| Backdoor | Hard to detect | Hard to detect | Trigger is small and update looks normal. |
| Model poisoning | High | Moderate | Anonymous clients vs contractual accountability. |
| Gradient inversion | Moderate | High | Silos have richer per-client batches worth attacking. |
| Free-riding | Hard to verify | Moderate | No ground truth for contribution vs contractual enforcement. |

### Key insight
The threat model depends on the deployment. Cross-device FL faces Sybil and anonymous poisoning risks. Cross-silo FL faces insider threats and regulatory concerns.

---

# 10. Part 3 of 3: Defences and trade-offs

## 10.1 Lecture position and roadmap

This lecture follows:

1. Lecture 1: FL motivation, FedAvg, variants.
2. Lecture 2: attacks such as poisoning, Byzantine attacks, and privacy attacks.

It focuses on:

- Robust aggregation.
- Differential privacy.
- Secure aggregation.
- Backdoor detection.
- Reputation and incentives.
- Trade-offs between privacy, robustness, utility, and scalability.

---

## 10.2 Attack-to-defence mapping

| Attack | Method | CIA target | Defence needed |
|---|---|---|---|
| Label flipping | Corrupt labels | Integrity | Robust aggregation, reputation |
| Backdoor, data | Trigger + target label | Integrity | Backdoor detection, reputation |
| Backdoor, model | Craft parameters | Integrity | Robust aggregation, detection |
| Scaling attack | Amplify update | Integrity | Robust aggregation |
| Byzantine | Arbitrary behaviour | Integrity + Availability | Robust aggregation |
| Sybil | Fake identities | Integrity + Availability | Identity verification |
| Gradient inversion | Solve optimisation | Confidentiality | DP, secure aggregation |
| Membership inference | Query model | Confidentiality | DP |
| Property inference | Observe updates | Confidentiality | DP, secure aggregation |
| Free-riding | Do nothing | Availability | Reputation, incentives |

---

## 10.3 Defence-in-depth for FL

The lecture states there is no silver bullet. FL systems need layered defences:

1. Robust aggregation — survive malicious updates.
2. Differential privacy — bound information leakage.
3. Secure aggregation — hide individual updates from the server.
4. Backdoor detection — catch embedded triggers.
5. Reputation and incentives — discourage bad behaviour.

### Trade-off warning
These defences sometimes conflict. In particular, secure aggregation hides updates, but robust aggregation often needs to inspect individual updates.

---

# 11. Robust aggregation

## 11.1 Problem with FedAvg

FedAvg uses weighted averaging. One malicious client with a large enough update can drag the average anywhere.

The defences lecture reuses the Part 2 scaling example:

| Update source | Update |
|---|---:|
| $\Delta_1$ | +0.10 |
| $\Delta_2$ | +0.12 |
| $\Delta_3$ | +0.11 |
| $\Delta_4$ | +0.09 |
| Attacker | −5.00 |
| FedAvg | −0.916 |

The central question is whether the fragile average can be replaced with something harder to manipulate.

---

## 11.2 Defence 1: Coordinate-wise median

### Definition in own words
Coordinate-wise median replaces the mean with a median computed separately for each parameter dimension. This reduces the effect of extreme outlier updates.

### Formal definition from the lecture
For each parameter dimension $j$:

$$
\Delta_j^{(t)}
=
\operatorname{median}\left\{\Delta_{k,j}^{(t)} : k \in C^{(t)}\right\}.
$$

### Worked example
Updates:

$$
\{0.10, 0.12, 0.11, 0.09, -5.0\}.
$$

Sorted:

$$
\{-5.0, 0.09, 0.10, 0.11, 0.12\}.
$$

Median:

$$
0.10.
$$

FedAvg was $-0.916$, so the median neutralises the outlier.

### Strengths
- Breakdown point: 50%; can tolerate corruption up to half the clients.
- Simple to implement.

### Limitations
- Ignores correlations between dimensions.
- Can be suboptimal in high-dimensional spaces.

---

## 11.3 Defence 2: Trimmed mean

### Definition in own words
Trimmed mean sorts each coordinate’s values, removes the most extreme values at both ends, and averages the remaining values.

### Formal definition from the lecture
For each coordinate:

$$
\Delta_j^{(t)}
=
\frac{1}{|C'|}\sum_{k \in C'} \Delta_{k,j}^{(t)},
$$

where $C'$ excludes the top and bottom

$$
\left\lfloor \beta |C^{(t)}| \right\rfloor
$$

values.

### Worked example with $\beta = 0.2$
Sorted updates:

$$
\{-5.0, 0.09, 0.10, 0.11, 0.12\}.
$$

With $K=5$, trimming fraction $\beta=0.2$:

$$
\left\lfloor 0.2 \times 5 \right\rfloor = 1.
$$

Trim the bottom 1 and top 1:

$$
\{0.09, 0.10, 0.11\}.
$$

Then:

$$
\operatorname{TrimmedMean}
=
\frac{0.09 + 0.10 + 0.11}{3}
= 0.10.
$$

### Requirement from the lecture
To guarantee all Byzantine values are trimmed:

$$
\left\lfloor \beta K \right\rfloor \ge f.
$$

In the worked example:

$$
\left\lfloor 0.2 \times 5 \right\rfloor = 1 \ge 1.
$$

---

## 11.4 Defence 3: Krum

### Definition in own words
Krum selects the update that is most central among the client updates, rather than averaging all updates.

### Formal definition from the lecture

$$
\operatorname{Krum}\left(\{\Delta_k^{(t)}\}\right)
=
\arg\min_k
\sum_{i \in N_k}
\left\|\Delta_k^{(t)} - \Delta_i^{(t)}\right\|^2,
$$

where $N_k$ is the set of $K - f - 2$ nearest neighbours of update $k$.

### Why $K-f-2$ neighbours?
Even if all $f$ Byzantine points land nearby, the majority of selected neighbours remain honest. The slide states this requires:

$$
f < \frac{K-2}{2}.
$$

This is consistent with the Krum threshold:

$$
2f + 2 < K.
$$

### Intuition
Honest updates should form a cluster. Byzantine updates should be far away from that honest cluster. Krum selects a central honest-looking update.

---

## 11.5 Defence 4: Geometric median

### Definition in own words
Geometric median finds the vector that minimises the total Euclidean distance to all client updates. Unlike coordinate-wise median, it preserves vector structure.

### Formal definition from the lecture

$$
\Delta^{(t)}
=
\arg\min_\Delta
\sum_k \left\|\Delta - \Delta_k^{(t)}\right\|_2.
$$

### Properties
- Same 50% breakdown point as coordinate-wise median.
- Preserves vector correlations.
- Cannot be dragged too far from an honest majority.

### Computation
- The objective is convex but non-smooth.
- It is solved iteratively.
- The lecture names Weiszfeld’s algorithm.
- It converges well in practice.

---

## 11.6 Comparison of robust methods on the same data

Setup: 5 clients, 1 attacker with $\Delta_5 = -5.0$.

| Method | Result | Close to honest? |
|---|---:|---|
| FedAvg | −0.916 | No, attacker dominates |
| Coordinate-wise median | +0.10 | Yes |
| Trimmed mean, $\beta = 0.2$ | +0.10 | Yes |
| Krum | +0.11, selects Client 3 | Yes |
| Geometric median | approximately +0.105 | Yes |
| Honest average without attacker | +0.105 | Ground truth |

### Takeaway
All robust methods neutralise the scaling attack in this easy case because the attacker’s update is an obvious outlier.

---

## 11.7 Robust aggregation vs backdoor attacks

### Recall: targeted model poisoning
The attacker sends:

$$
\tilde{\theta}_k
=
\theta^{(t)} + \gamma\left(\theta_k^{\text{backdoor}} - \theta^{(t)}\right),
$$

with $\gamma \ge 1$.

### Robust aggregation behaviour

| Scenario | FedAvg | Robust aggregation |
|---|---|---|
| Large $\gamma$, obvious outlier | Dominated | Filtered |
| Small $\gamma$, close to honest | Partial injection | May pass filter |
| $\gamma = 1$ and many Sybils | Majority poisoned | Majority poisoned |

### Lesson
Robust aggregation stops brute-force attacks. Subtle, patient backdoors with small $\gamma$ over many rounds can still slip through. This motivates additional defence layers.

---

## 11.8 The non-IID headache

### Key issue
All geometric robust aggregation methods rely on honest updates being close to each other. Under heavy non-IID data, honest clients may legitimately submit very different updates.

### Why this is hard
Robust aggregation cannot easily distinguish:

$$
\text{unusual but honest update}
$$

from

$$
\text{malicious update}.
$$

### Open problem from the lecture
The tension between non-IID robustness and Byzantine robustness is described as one of the genuinely hard open problems in FL.

---

# 12. Differential privacy in FL

## 12.1 Key concept: Why DP is needed

Robust aggregation handles integrity. For privacy attacks such as gradient inversion and membership inference, FL needs mechanisms that ensure shared updates reveal as little as possible about individual records.

---

## 12.2 Formal definition: $(\varepsilon, \delta)$-DP

### Formal definition from the lecture
An algorithm $A$ is $(\varepsilon, \delta)$-differentially private if, for any two datasets $D$ and $D'$ differing in one record:

$$
\Pr[A(D) \in S]
\le
 e^\varepsilon \Pr[A(D') \in S] + \delta.
$$

### Intuition
Whether or not a particular record is in the dataset, the mechanism’s output should look almost the same.

### Meaning of $\varepsilon$ and $\delta$
- Smaller $\varepsilon$ and $\delta$ mean stronger privacy.
- $\delta$ allows a small probability of exceeding the $e^\varepsilon$ bound.

### Values from the diagram
The slide gives examples for the ratio bound:

| $\varepsilon$ | Bound / interpretation |
|---:|---|
| 0 | ratio = 1, perfect privacy |
| 0.5 | ratio $\le 1.65$, strong privacy |
| 8 | ratio $\le 2981$, weak privacy |

### Note from the lecture
DP is covered in much greater depth in dedicated DP lectures. Here, the focus is how DP plugs into FL.

---

## 12.3 Local DP vs central DP in FL

| Feature | Local DP | Central DP |
|---|---|---|
| Who adds noise? | Each client | Server |
| Does server see clean updates? | No | Yes |
| Trust assumption | No trust in server | Server is honest |
| Utility | Lower, because each client update is noisy | Higher, because noise is added to aggregate |

### Intuition
Local DP protects against a curious server because the server never sees clean updates. Central DP can preserve more utility but assumes the server can be trusted with clean client updates.

---

## 12.4 Local DP mechanism

### Formal mechanism from the lecture
Each client clips and noises its update before sending:

$$
\tilde{\Delta}_k^{(t)}
=
\operatorname{clip}(\Delta_k^{(t)}, C)
+ \mathcal{N}(0, \sigma^2 C^2 I).
$$

The clipping function is:

$$
\operatorname{clip}(\Delta, C)
=
\Delta \cdot \min\left(1, \frac{C}{\|\Delta\|_2}\right).
$$

### Intuition
- Clipping bounds sensitivity by limiting update norm.
- Gaussian noise masks the update.
- Stronger privacy requires more noise, which reduces accuracy.

### Worked example from the defences slides
Client update:

$$
\Delta = (3,4), \qquad C=1.
$$

Norm:

$$
\|\Delta\|_2 = 5.
$$

Clip:

$$
\operatorname{clip}(\Delta,1)
= (3,4)\cdot \frac{1}{5}
= (0.6,0.8).
$$

Noise:

$$
n \sim \mathcal{N}(0, \sigma^2 C^2 I)
= \mathcal{N}(0, \sigma^2 I)
$$

because $C=1$. If the sampled noise is:

$$
n = (0.1,-0.2),
$$

then:

$$
\tilde{\Delta}
= (0.6+0.1, 0.8-0.2)
= (0.7,0.6).
$$

### Composition over rounds
Privacy budget depletes over rounds. Each round leaks a little, and an adversary observing all rounds accumulates information.

The slide gives the example:

- 50 rounds.
- Per-round $\varepsilon = 0.5$.
- Total $\varepsilon \approx 8$ under advanced composition / moments accountant.

Details are reserved for the DP lectures.

---

## 12.5 DP vs gradient inversion

### Concrete link
DP noise directly degrades the attacker’s reconstruction quality. Moderate noise can reduce pixel-level recovery from near-perfect to unrecognisable, but this costs model accuracy.

### Illustrative table from the defences slides

| $\varepsilon$ | Model accuracy | Inversion quality | Verdict |
|---:|---:|---|---|
| $\infty$, no DP | 93.2% | near-perfect | no privacy |
| 8 | 91.5% | very degraded | reasonable trade-off |
| 1 | 85.3% | unrecognisable | strong privacy, weaker model |

---

# 13. Secure aggregation

## 13.1 Key concept: Secure aggregation

### Definition in own words
Secure aggregation lets the server compute the sum of client updates without seeing any individual update.

### Goal from the lecture

$$
\text{Server computes } \sum_k \Delta_k
\text{ without seeing any individual } \Delta_k.
$$

### Pairwise mask idea
For each pair $(i,j)$ with $i<j$:

- Client $i$ adds $+r_{ij}$.
- Client $j$ adds $-r_{ij}$.

When the server sums all masked updates, every $+r_{ij}$ cancels with a $-r_{ij}$.

For 3 clients, the defences slide sketches:

$$
\text{Client 1 sends } \Delta_1 + r_{12} + r_{13},
$$

$$
\text{Client 2 sends } \Delta_2 - r_{12} + r_{23},
$$

$$
\text{Client 3 sends } \Delta_3 - r_{13} - r_{23}.
$$

The server sums:

$$
(\Delta_1 + r_{12} + r_{13})
+
(\Delta_2 - r_{12} + r_{23})
+
(\Delta_3 - r_{13} - r_{23})
=
\Delta_1 + \Delta_2 + \Delta_3.
$$

### Implementation sketch from the lecture
- Masks are agreed via Diffie–Hellman.
- Dropped clients are handled by threshold secret sharing.
- Later SMPC lectures formalise secret sharing, garbled circuits, oblivious transfer, and secure FL protocols.

---

## 13.2 Worked example from the defences slides

Setup: 3 clients with scalar updates.

| Client | True update |
|---|---:|
| Client 1 | +0.3 |
| Client 2 | +0.5 |
| Client 3 | +0.2 |

Pairwise masks:

$$
r_{12}=0.7, \qquad r_{13}=-0.4, \qquad r_{23}=0.1.
$$

Each client sends:

$$
\text{Client 1: } \Delta_1 + r_{12} + r_{13}
= 0.3 + 0.7 - 0.4
= 0.6.
$$

$$
\text{Client 2: } \Delta_2 - r_{12} + r_{23}
= 0.5 - 0.7 + 0.1
= -0.1.
$$

$$
\text{Client 3: } \Delta_3 - r_{13} - r_{23}
= 0.2 - (-0.4) - 0.1
= 0.5.
$$

The server sums:

$$
0.6 + (-0.1) + 0.5 = 1.0.
$$

This equals:

$$
0.3 + 0.5 + 0.2 = 1.0.
$$

The server learns the sum but cannot recover individual $\Delta_k$ values.

---

## 13.3 Core tension: secure aggregation vs robust aggregation

### The conflict
- Secure aggregation gives privacy by hiding individual updates.
- Robust aggregation requires inspecting individual updates, for example to compute Krum, trimmed mean, or anomaly filters.

### Lecture wording as a conceptual contrast

$$
\text{Privacy: hide updates}
$$

versus

$$
\text{Robustness: inspect updates}.
$$

### Escape routes named in the lecture
- **ZKP:** clients prove $\|\Delta_k\| \le B$ without revealing $\Delta_k$. The slide explicitly connects this to coursework.
- **TEE:** hardware enclaves inspect updates in isolation.
- **SMPC:** compute robust statistics such as median under encryption.

---

# 14. Detecting backdoors

## 14.1 Why backdoor detection is hard

A backdoored model behaves normally on clean inputs. The malicious behaviour only appears when the hidden trigger is present. Therefore standard validation on a clean test set can show high accuracy and still miss the backdoor.

### Example from the slide
- Clean cat image $\to$ model predicts “cat.”
- Same cat image plus trigger $\to$ model predicts “dog.”
- Clean validation accuracy is 97%, so the model looks fine.

### What a defence must ask
The defence needs to ask whether the model contains a hidden shortcut to some class, even if the trigger is unknown.

---

## 14.2 Detection and mitigation methods named in the lecture

### Spectral methods
Backdoor-contaminated updates or representations may exhibit anomalous spectral signatures. PCA/SVD on learned representations can reveal such anomalies.

### Trigger reverse-engineering
Methods such as Neural Cleanse search for minimal perturbations that induce targeted misclassification. Small-norm triggers indicate potential backdoors.

### Pruning and fine-tuning
Backdoor behaviour is often encoded in neurons inactive on clean data but highly responsive to triggers. Pruning such neurons can mitigate the attack.

### Certified robustness
Randomized smoothing provides provable guarantees that no perturbation within a radius changes the prediction. The lecture notes that the certified radius is often small.

---

## 14.3 Neural Cleanse intuition

### Intuition from the lecture
For a clean model, moving samples from classes B and C into class A requires substantial modification. In an infected model, the backdoor changes decision boundaries and creates backdoor regions near B and C. These regions reduce the amount of modification needed to make samples misclassify into the target label A.

### Key idea
If one target class requires an anomalously small trigger to force misclassification, that class is likely the backdoor target.

---

## 14.4 Neural Cleanse formal objective

For each target label $y_t$, Neural Cleanse reverse-engineers the smallest trigger:

$$
\min_{m,\tau}
\ell\left(y_t, f_\theta(A(x,m,\tau))\right)
+ \lambda \|m\|_1.
$$

The trigger application is:

$$
x'_{i,j}
=
(1-m_{i,j})x_{i,j} + m_{i,j}\tau_{i,j}.
$$

Where:

- $m$ is the mask: which pixels are changed.
- $\tau$ is the trigger pattern: what values are inserted.
- $\lambda$ penalises trigger size.

### Worked example from the defences slides
The slide compares $\|m_{y_t}^*\|_1$ across classes:

| Target class | $\|m_{y_t}^*\|_1$ | Interpretation |
|---|---:|---|
| A | 15 | Outlier / infected |
| B | 142 | Normal |
| C | 138 | Normal |

Class A has an anomalously tiny trigger, so Neural Cleanse identifies A as the likely target class.

---

# 15. Reputation, incentives, and free-rider defences

## 15.1 Reputation mechanisms

### Definition in own words
Reputation mechanisms track client behaviour over time rather than treating each round independently.

### Examples from the lecture
- Track contribution quality over time.
- Give higher weight to clients whose updates align with validation improvements.
- Downweight anomalous clients.

---

## 15.2 Validation-based filtering

The server holds a small validation set. It evaluates the global model with and without each client’s update.

- Helpful updates are rewarded.
- Harmful updates are excluded.

---

## 15.3 Incentive design

Game-theoretic mechanisms align self-interest with honest participation. The lecture names:

- Better model access for contributors.
- Priority scheduling.
- Payments for quality.

---

## 15.4 Proof of contribution

Proof-of-contribution mechanisms use ZKPs to prove that updates were derived from genuine data satisfying statistical properties, without revealing the data. The lecture labels this as research-phase.

---

## 15.5 Defences against free-riding

Recall: free-riders send $\theta^{(t)}+\epsilon$ and contribute nothing.

Detection strategies from the lecture:

1. **Cosine similarity:** compare $\Delta_k$ with the global update direction. Free-riders’ updates are near-zero or random, so they have low alignment.
2. **Contribution verification:** check that $\Delta_k$ actually reduces loss on a validation set.
3. **Incentive design:** withhold model improvements from non-contributors, which requires proof of contribution.

---

## 15.6 Future reading: blockchain-based defence

The defences slides include a future-reading example on defending against poisoning attacks in FL with blockchain. The diagram includes roles such as proposers, voters, and miners; local training; voting scores; finalisation and reward; refusal; revert and slash; and malicious client elimination.

The cited source is Dong, Wang, Sun, Kampffmeyer, Knottenbelt, and Xing, “Defending Against Poisoning Attacks in Federated Learning with Blockchain,” IEEE Transactions on Artificial Intelligence 2024.

---

# 16. Four-way tension in FL defences

## 16.1 The four axes

The lecture identifies a four-way tension:

1. Privacy.
2. Robustness.
3. Utility.
4. Scalability.

### Edges / trade-offs from the lecture

| Trade-off | Meaning |
|---|---|
| Privacy vs Robustness | Secure aggregation hides both attacks and defences. |
| Privacy vs Utility | More DP noise means worse accuracy. |
| Robustness vs Utility | Aggressive filtering discards honest non-IID updates. |
| Security vs Scalability | SMPC, ZKP, and FHE add overhead. |

---

## 16.2 What a real defence stack looks like

The defences lecture gives an illustrative layered stack:

| Configuration | Accuracy | Scaling attack | Backdoor | Gradient inversion |
|---|---:|---|---|---|
| FedAvg, no defence | ~93% | Vulnerable | Vulnerable | Vulnerable |
| + Robust aggregation | ~92% | Protected | Partial | Vulnerable |
| + DP, $\varepsilon=8$ | ~91% | Protected | Partial | Protected |
| + Secure aggregation | ~91% | Needs SMPC | Partial | Protected |
| + Backdoor detection | ~91% | Needs SMPC | Detected | Protected |
| + Reputation | ~90% | Excluded | Excluded | Protected |

### Key insight
Each layer adds protection but costs accuracy: roughly 93% to 90%. Comprehensive defence requires accepting a trade-off.

---

## 16.3 Which defences matter where?

| Defence | Cross-device | Cross-silo | Why |
|---|---|---|---|
| Robust aggregation | Essential | Useful | Many untrusted clients vs known participants |
| Local DP | Standard | Case-by-case | Scale helps in device setting; limited benefit in silos |
| Central DP | Needs secure aggregation | Easier, with trusted server | Server trust assumptions differ |
| Secure aggregation | Standard | Important | Protects against curious server |
| Backdoor detection | Hard at scale | Feasible | Fewer clients to inspect |
| Reputation | Not applicable | Natural fit | Identities and accountability exist |

### Key insight
- Cross-device: scale + privacy, usually DP + secure aggregation.
- Cross-silo: trust + robustness, usually aggregation + detection.
- The defence stack follows the trust model and scale of the deployment.

---

## 16.4 Example real deployments from the lecture

### Google-style production FL, cross-device
The slides describe Google’s production FL example as:

- FedAvg + secure aggregation + DP noise.
- Billions of devices make DP practical because noise averages out.
- Robust aggregation is often less central in practice than DP + secure aggregation, though still relevant under stronger threat models.

### Hospital consortium, cross-silo
The slides describe a hospital consortium as:

- Trimmed mean + moderate DP + reputation.
- Only 5–20 participants, so DP noise hurts more.
- Reputation works well because of contractual accountability.
- Neural Cleanse is feasible because there are few clients to inspect.

---

## 16.5 Open questions from the defences lecture

The lecture lists open questions:

- How can robust aggregation be done when individual updates cannot be seen?
- How can adaptive backdoor attacks that change strategy each round be detected?
- Is meaningful DP achievable for small federations such as 10 hospitals?
- How can incentive-compatible protocols be designed for rational, not just malicious, agents?
- How can these techniques extend to vertical FL, federated RL, and federated LLM fine-tuning?

These questions motivate later lectures in the module.

---

# 17. Key takeaways from the three FL lectures

The defences slides provide the following all-FL takeaways:

1. FL enables collaborative training without centralising data, using methods such as FedAvg and FedProx.
2. FL is not automatically secure or private; attacks target integrity and confidentiality.
3. Robust aggregation, including median, Krum, and trimmed mean, defends against poisoning but struggles with non-IID data.
4. DP bounds privacy leakage but costs accuracy.
5. Secure aggregation protects privacy but conflicts with robustness.
6. The fundamental trade-offs between privacy, robustness, utility, and scalability cannot be eliminated; they can only be managed through layered defences and cryptographic tools.

---

# 18. Summary lecture: complete walkthrough example

## 18.1 Purpose of the summary lecture

Parts 1–3 introduced FL concepts separately. The summary lecture combines them in one end-to-end scenario.

The example is explicitly fictional and pedagogical. Real banking systems are more complex and regulated.

---

## 18.2 Running example: federated transaction fraud detection

### Task
Five banks collaboratively train a model to classify financial transactions into 10 fraud/risk categories.

### Model and training setup
- Lightweight neural network.
- 3 hidden layers + 2 fully connected layers.
- Input: 256 engineered transaction features.
- Parameters: 524,810.
- Learning rate: $\eta = 0.01$.
- Local steps per round: $R = 5$.
- Batch size: $B = 32$.
- Output: softmax over 10 categories.

### Why this task fits FL
- Banks cannot share customer transaction data due to GDPR, banking secrecy, and PCI-DSS.
- Non-IID data is natural because each bank serves different client segments.
- Attacks have real consequences: classifying fraud as legitimate leads to financial losses.
- The same FL principles apply at different scales.

---

## 18.3 Fraud / transaction categories

| ID | Abbrev / class |
|---:|---|
| 0 | CFR, Card Fraud |
| 1 | LGT, Legitimate |
| 2 | AML, Money Laundering |
| 3 | PHI, Phishing Scam |
| 4 | IDT, Identity Theft |
| 5 | P2P, P2P Fraud |
| 6 | ACH, ACH/EFT Fraud |
| 7 | WFR, Wire Fraud |
| 8 | INV, Investment Fraud |
| 9 | INS, Insurance Fraud |

---

## 18.4 Non-IID bank distribution

### Bank-level sample sizes and weights

| Bank | Samples | Primary classes | Why | $p_k$ |
|---|---:|---|---|---:|
| B1, Retail Bank | 2,000 | CFR, LGT | High-volume card transactions dominate | 0.20 |
| B2, Corporate Bank | 3,000 | AML, PHI, IDT | Large-value transfers trigger AML screening | 0.30 |
| B3, Digital/Fintech | 1,500 | P2P, ACH | Mobile-first payments and instant transfers | 0.15 |
| B4, Private Bank | 2,500 | WFR, INV, INS | High-net-worth clients targeted by wire and investment fraud | 0.25 |
| B5, Regional Bank | 1,000 | all 10, balanced | Mixed community banking clientele | 0.10 |
| Total | 10,000 | — | — | 1.00 |

### Distribution details

| Bank | CFR | LGT | AML | PHI | IDT | P2P | ACH | WFR | INV | INS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| B1 | 40% | 40% | 2% | 2% | 2% | 2% | 2% | 2% | 4% | 4% |
| B2 | 3% | 3% | 23% | 24% | 23% | 3% | 3% | 6% | 6% | 6% |
| B3 | 3% | 3% | 3% | 3% | 3% | 38% | 37% | 3% | 3% | 4% |
| B4 | 4% | 4% | 4% | 4% | 4% | 4% | 4% | 22% | 25% | 25% |
| B5 | 10% | 10% | 10% | 10% | 10% | 10% | 10% | 10% | 10% | 10% |

### Key insight
B1 sees mostly card fraud and legitimate transactions. B3 sees mostly P2P and ACH fraud. Their local gradients point in different directions. This non-IID split naturally follows from each bank’s client base and product mix.

---

## 18.5 FedAvg Round 1 worked example

The round structure is:

1. Broadcast $\theta^{(0)}$ to all 5 banks.
2. Each bank runs local SGD with $R=5$ and $\eta = 0.01$.
3. Aggregate using FedAvg:

$$
\theta^{(1)} = \sum_k p_k \theta_k^{(1)}.
$$

The slide works one scalar parameter $\theta$.

| Quantity | B1 | B2 | B3 | B4 | B5 |
|---|---:|---:|---:|---:|---:|
| $\theta^{(0)}$ | 0.150 | 0.150 | 0.150 | 0.150 | 0.150 |
| After $R=5$ SGD | 0.183 | 0.192 | 0.178 | 0.188 | 0.171 |
| $\Delta_k = \theta_k^{(1)} - \theta^{(0)}$ | +0.033 | +0.042 | +0.028 | +0.038 | +0.021 |
| Weight $p_k$ | 0.20 | 0.30 | 0.15 | 0.25 | 0.10 |
| $p_k \Delta_k$ | +0.0066 | +0.0126 | +0.0042 | +0.0095 | +0.0021 |

Aggregated update:

$$
\sum_k p_k \Delta_k
= 0.0066 + 0.0126 + 0.0042 + 0.0095 + 0.0021
= 0.0350.
$$

Therefore:

$$
\theta^{(1)} = 0.150 + 0.0350 = 0.185.
$$

### Observation
B2 has the largest dataset and weight $p_2 = 0.30$, so it pulls the global model most. B5 has the smallest dataset and contributes least.

---

## 18.6 Honest convergence over 50 rounds

After 50 rounds of honest FedAvg:

- Global accuracy reaches about 92.5%.
- B1 local accuracy reaches 97.5%.
- B3 local accuracy reaches 88%.
- The B1–B3 local accuracy gap is 9.5 percentage points.

### Interpretation
B1 converges fast because CFR and LGT have strong signal across banks. B3 lags because P2P and ACH fraud are rare outside fintech. The lecture connects this to client drift from Part 1.

---

## 18.7 Per-class accuracy after 50 rounds

| Class | Accuracy |
|---|---:|
| CFR | 97.2% |
| LGT | 97.8% |
| AML | 93.1% |
| PHI | 90.5% |
| IDT | 92.8% |
| P2P | 88.3% |
| ACH | 89.7% |
| WFR | 93.5% |
| INV | 87.2% |
| INS | 90.1% |

### Pattern
Classes represented across banks, such as CFR, LGT, and WFR, achieve over 93%. Under-represented classes, such as P2P and INV, lag below 89%. This is why FL is useful and also why it is hard.

---

# 19. Four attacks in the walkthrough

## 19.1 Attack 1: Label flipping, B5 relabels WFR as LGT

This was covered in Section 3.2 above. The key result is:

| Metric | No attack | With B5 flipping | Change |
|---|---:|---:|---:|
| Global accuracy | 92.5% | 90.8% | −1.7% |
| WFR accuracy | 93.5% | 78.3% | −15.2% |
| LGT accuracy | 97.8% | 96.1% | −1.7% |

### Lesson
A small global accuracy drop can hide a severe targeted class failure.

---

## 19.2 Attack 2: Scaling attack, B5 amplifies malicious update

This was covered in Section 4.2 above. Key scalar result:

$$
\sum_k p_k \Delta_k = -0.0721
$$

instead of the honest $+0.0350$.

### Lesson
Even with only 10% weight, B5 can flip the update direction by using $\alpha=50$.

---

## 19.3 Attack 3: Backdoor, triggered transactions become legitimate

This was covered in Section 4.3 above. Key result:

| Metric | No attack | Round 15 | Round 30, B5 left at 15 |
|---|---:|---:|---:|
| Clean accuracy | 92.5% | 92.1% | 92.3% |
| Backdoor success rate | 0% | 89.2% | 71.5% |

### Lesson
Backdoors can be both stealthy and persistent.

---

## 19.4 Attack 4: Gradient inversion

This was covered in Section 7.2 above. Key result:

| Setting | Cosine similarity | Fields reconstructed | Quality |
|---|---:|---:|---|
| FedSGD, $B=1$, no DP | 0.97 | 91% | Individual transactions recoverable |
| FedSGD, $B=32$, no DP | 0.78 | 64% | Partial recovery, amounts visible |
| FedAvg, $R=5, B=32$, no DP | 0.41 | 23% | Aggregate patterns only |
| FedAvg + DP, $\sigma=0.5$ | 0.12 | 5% | Reconstruction largely impractical |

### Lesson
FedAvg naturally makes inversion harder than FedSGD, and DP makes it much harder.

---

## 19.5 Attack summary table from the walkthrough

| Attack | CIA target | Impact | Financial / regulatory consequence |
|---|---|---|---|
| Label flip, WFR $\to$ LGT | Integrity | WFR accuracy 93.5% $\to$ 78.3% | Undetected wire-fraud losses |
| Scaling, $\alpha=50$ | Integrity | Global accuracy 92.5% $\to$ 15% | Fraud detection system unusable |
| Backdoor | Integrity | 89% of triggered transactions $\to$ legitimate | Systematic fraud evasion |
| Gradient inversion | Confidentiality | Customer transaction recovery | GDPR / banking secrecy violation |

---

# 20. Defences in the walkthrough

## 20.1 Defence 1a: Coordinate-wise median vs scaling attack

For each of the 524,810 parameters, take the median of the 5 banks’ values.

### Worked scalar example under $\alpha=50$

| Bank | Update |
|---|---:|
| B1 | +0.033 |
| B2 | +0.042 |
| B3 | +0.028 |
| B4 | +0.038 |
| B5 | −1.050 |

Sorted:

$$
\{-1.050, 0.028, 0.033, 0.038, 0.042\}.
$$

FedAvg:

$$
-0.0721 \quad \text{(bad)}.
$$

Median:

$$
+0.033 \quad \text{(good)}.
$$

### Analysis
The attacker’s $-1.050$ is an extreme outlier, so the median ignores it. The result is close to the honest average $+0.035$. The slide states that with 5 banks, the 50% breakdown point means up to 2 of 5 banks could be malicious.

---

## 20.2 Defence 1b: Trimmed mean and Krum in the walkthrough

### Trimmed mean with $\beta = 0.2$
Sorted updates:

$$
\{-1.050, 0.028, 0.033, 0.038, 0.042\}.
$$

Trim bottom 1 and top 1:

$$
\{0.028, 0.033, 0.038\}.
$$

Compute:

$$
\frac{0.028 + 0.033 + 0.038}{3}
= 0.033.
$$

### Krum
Krum selects the most central update. B5’s $-1.050$ is far from everyone, so it is never selected. Krum picks B4 with update $+0.038$.

### Comparison table

| Method | Result | Close to honest $+0.035$? |
|---|---:|---|
| FedAvg | −0.0721 | No |
| Median | +0.033 | Yes |
| Trimmed mean | +0.033 | Yes |
| Krum | +0.038 | Yes |

---

## 20.3 Robust aggregation restores convergence

Under the scaling attack:

| Configuration | Accuracy after 50 rounds / result |
|---|---:|
| No attack | 92.5% |
| $\alpha = 50$ + FedAvg | 15% |
| $\alpha = 50$ + Median | 91% |
| $\alpha = 50$ + Trimmed mean | 91.5% |

### Cost
Median and trimmed mean restore accuracy but lose about 1–1.5% because robust aggregation discards some honest non-IID information. This is the robustness vs utility trade-off.

---

## 20.4 But robust aggregation cannot stop subtle backdoors

With $\gamma=1.5$, the backdoor update looks similar to honest updates. Robust aggregation cannot distinguish it from normal non-IID variation.

| Scenario | $\gamma$ | $\|\tilde{\Delta}_5\| / \text{avg}$ | Filtered? | Backdoor success after 30 rounds |
|---|---:|---:|---|---:|
| Aggressive | 10 | 10× | Yes | 2.1% |
| Moderate | 3 | 3× | Mostly | 34.5% |
| Patient | 1.5 | 1.5× | No | 67.8% |

### Lesson
Robust aggregation is necessary but not sufficient. Additional layers are needed: backdoor detection, DP, and reputation.

---

## 20.5 Defence 2: DP in the walkthrough

Each bank clips and noises its update before sending:

$$
\tilde{\Delta}_k^{(t)}
=
\operatorname{clip}(\Delta_k^{(t)}, C)
+ \mathcal{N}(0, \sigma^2 C^2 I),
$$

where:

$$
\operatorname{clip}(\Delta, C)
=
\Delta \cdot \min\left(1, \frac{C}{\|\Delta\|_2}\right).
$$

### Worked example: B1 with 2 parameters
B1 raw update:

$$
\Delta_1 = (0.033, 0.041).
$$

Clipping bound:

$$
C = 0.05.
$$

Norm:

$$
\|\Delta_1\|_2 = 0.0527.
$$

Clip:

$$
\operatorname{clip}(\Delta_1,0.05)
=
(0.033,0.041) \cdot \frac{0.05}{0.0527}
=
(0.0313,0.0389).
$$

Noise:

$$
n \sim \mathcal{N}(0, \sigma^2 C^2 I),
\qquad
\sigma = 1.0.
$$

If:

$$
n = (0.012,-0.008),
$$

then:

$$
\tilde{\Delta}_1
=
(0.0313+0.012, 0.0389-0.008)
=
(0.0433,0.0309).
$$

### Privacy–utility trade-off table from the walkthrough

| $\varepsilon$ | $\sigma$ | $C$ | Accuracy | Cosine similarity | Privacy |
|---:|---:|---:|---:|---:|---|
| $\infty$, no DP | 0 | — | 92.5% | 0.41 | None |
| 8 | 0.5 | 0.05 | 90.1% | 0.12 | Moderate |
| 2 | 1.5 | 0.05 | 86.3% | 0.08 | Good |
| 0.5 | 4.0 | 0.05 | 72.8% | 0.03 | Strong |

### Why each knob matters
- Clip norm $C$: too small destroys signal before noise; too large requires more noise for the same $\varepsilon$.
- Noise multiplier $\sigma$: directly controls $\varepsilon$; the slide says doubling $\sigma$ roughly halves $\varepsilon$.
- Local steps $R$: more steps mean more composition, increasing $\varepsilon$ or requiring larger $\sigma$.

### Choice in the example
The walkthrough chooses $\varepsilon=8$, $\sigma=0.5$, losing 2.4% accuracy but making inversion impractical with cosine similarity 0.12.

---

## 20.6 Defence 3: Secure aggregation in the walkthrough

### Goal
The server computes:

$$
\sum_k \Delta_k
$$

without seeing any individual $\Delta_k$.

### Worked example: B1, B2, B3, one parameter
True updates:

$$
\Delta_1 = +0.033, \qquad
\Delta_2 = +0.042, \qquad
\Delta_3 = +0.028.
$$

Pairwise masks:

$$
r_{12} = 0.175, \qquad
r_{13} = -0.092, \qquad
r_{23} = 0.041.
$$

The slide computes masked messages:

$$
\text{B1: } \Delta_1 + r_{12} - r_{13}
= 0.033 + 0.175 + 0.092
= 0.300.
$$

$$
\text{B2: } \Delta_2 - r_{12} + r_{23}
= 0.042 - 0.175 + 0.041
= -0.092.
$$

$$
\text{B3: } \Delta_3 + r_{13} - r_{23}
= 0.028 - 0.092 - 0.041
= -0.105.
$$

The server sums:

$$
0.300 + (-0.092) + (-0.105)
= 0.103.
$$

This equals:

$$
0.033 + 0.042 + 0.028
= 0.103.
$$

### Result
All masks cancel. The server learns the sum but cannot recover individual bank updates. This protects each bank’s proprietary transaction data and customer patterns.

### [UNCLEAR] Sign convention mismatch to check
The defences slides state the convention “client $i$ adds $+r_{ij}$ when $i<j$, and client $j$ adds $-r_{ij}$.” The summary walkthrough’s B1/B3 signs for $r_{13}$ are written differently from that convention, although the masks still cancel and the final sum is correct. If exact sign notation is examinable, check the recording or slide annotation.

---

## 20.7 Defence 4: Neural Cleanse in the walkthrough

### Idea
For each class $c$, find the smallest perturbation $\delta_c^*$ that flips all inputs to class $c$. If one class requires an anomalously tiny perturbation, that class is likely the backdoor target.

### Results on the backdoored model
Target class: LGT, legitimate.

| Target class | $\|\delta_c^*\|_1$ | Interpretation |
|---|---:|---|
| CFR | 38.7 | normal |
| LGT | 4.2 | anomalously small; backdoor |
| AML | 41.3 | normal |
| PHI | 39.8 | normal |
| IDT–INS | approximately 40 | normal |

### Detection and mitigation
The trigger pattern is reverse-engineered. The backdoor is removed by fine-tuning.

---

## 20.8 Defence 5: Reputation catches B5 over time

The server holds a 500-transaction validation set and scores each bank each round.

B5 is running the WFR $\to$ LGT label-flip attack.

| Bank | Round 5 | Round 10 | Round 15 | Round 20 | Action |
|---|---:|---:|---:|---:|---|
| B1, Retail | 0.95 | 0.96 | 0.97 | 0.98 | Full weight |
| B2, Corporate | 0.94 | 0.95 | 0.96 | 0.97 | Full weight |
| B3, Digital | 0.92 | 0.93 | 0.94 | 0.95 | Full weight |
| B4, Private | 0.93 | 0.95 | 0.96 | 0.97 | Full weight |
| B5, Regional | 0.71 | 0.53 | 0.31 | 0.12 | Excluded |

### Caveat
This works well with 5 known banks under regulatory agreements, but poorly in cross-device FL.

---

## 20.9 Complete defence stack in the walkthrough

The full stack is:

1. Trimmed mean with $\beta=0.2$ to filter outlier updates.
2. Local DP with $\varepsilon=8$ to clip and noise each update.
3. Secure aggregation to hide individual updates.
4. Neural Cleanse to detect backdoor triggers.
5. Reputation to exclude persistent bad actors.

### Important conflict
Layer 3, secure aggregation, conflicts with Layer 1, robust aggregation. The lecture says upcoming SMPC/ZKP material will address this conflict.

---

## 20.10 Full stack results

| Configuration | Accuracy | Scaling | Backdoor | Gradient inversion |
|---|---:|---|---|---|
| FedAvg, no defence | 92.5% | Vulnerable | Vulnerable | Vulnerable |
| + Trimmed mean | 91.5% | Protected | Partial | Vulnerable |
| + DP, $\varepsilon=8$ | 90.1% | Protected | Partial | Protected |
| + Secure aggregation | 90.1% | Needs SMPC | Partial | Protected |
| + Neural Cleanse | 90.1% | Needs SMPC | Detected | Protected |
| + Reputation | ~90% | B5 excluded | B5 excluded | Protected |

### Cost of comprehensive defence
Fraud detection accuracy drops from 92.5% to about 90%. In exchange, the system becomes robust to poisoning, backdoors become detectable, and customer transaction data is protected.

---

# 21. Four-way tension with walkthrough numbers

The summary lecture quantifies the trade-offs:

| Axis / trade-off | Number or effect in the example |
|---|---|
| Privacy via DP | DP with $\varepsilon=8$ costs −2.4% accuracy |
| Secure aggregation scalability | $O(K^2)$ communication / keys |
| Robustness via trimmed mean | Costs about −1% accuracy |
| Robustness vs secure aggregation | Trimmed mean conflicts with secure aggregation because one wants inspection and the other hides updates |
| Full stack utility cost | 92.5% $\to$ about 90% |
| Neural Cleanse scalability | Described as expensive |
| SMPC / ZKP / FHE | Add overhead |

### Each edge in the four-way tension
- Privacy vs Robustness: secure aggregation hides both honest and malicious updates.
- Privacy vs Utility: DP with $\varepsilon=8$ costs 2.4% accuracy.
- Robustness vs Utility: trimmed mean costs 1% by discarding honest non-IID information.
- Security vs Scalability: SMPC, ZKP, and FHE add overhead.

---

# 22. Which defences for which deployment?

## 22.1 Cross-device vs cross-silo comparison

| Defence | Cross-device, $10^9$ phones | Cross-silo, 5 banks | Reason |
|---|---|---|---|
| Robust aggregation | Critical | Important | Anonymous vs known participants |
| Local DP | Standard | Case-by-case | Billions of devices help; 5 banks hurt utility |
| Secure aggregation | Standard | Important | Curious server threat |
| Backdoor detection | Hard at scale | Feasible | Fewer clients to inspect |
| Reputation | Hard | Natural fit | Regulatory agreements / known identities |

## 22.2 Our system: cross-silo

For the 5-bank scenario, the best stack is:

$$
\text{Trimmed mean}
+
\text{DP }(\varepsilon=8)
+
\text{secure aggregation}
+
\text{Neural Cleanse}
+
\text{reputation}.
$$

Reputation works because the banks are known and are contractually/regulatorily bound.

---

# 23. Connections to later module material

## 23.1 What statistics alone could not solve
The summary lecture explicitly transitions from statistical defences to cryptographic tools.

| Problem | Tool introduced for later lectures |
|---|---|
| Robust aggregation under encryption | SMPC |
| Proving honest participation without revealing data | ZKP |
| Computing on encrypted updates | FHE |
| Formal privacy guarantees | DP theory |

## 23.2 Named cryptographic tools

### SMPC
- Secret sharing.
- Garbled circuits.
- Used for secure aggregation.

### ZKP
- Prove $\|\Delta\| \le B$ without revealing $\Delta$.
- Used for verifiable FL.
- Connected to coursework.

### FHE
- Compute on encrypted updates.
- Used for encrypted aggregation.

### DP
- Formal noise accounting.
- Privacy budget.

---

# 24. Further reading topics from the summary lecture

## 24.1 Federated unlearning

### Motivation
What if B3 wants to leave? The slide connects this to GDPR Article 17, the “right to be forgotten”: a client at B3 can demand complete removal of their data’s influence from the global model.

### Naïve solution
Retrain from scratch on B1, B2, B4, and B5. This is expensive because the example used 50 training rounds.

### Federated unlearning goal
Efficiently erase B3’s contribution without full retraining.

### Approaches named in the lecture
- Exact unlearning: store historical updates per round, roll back B3’s contributions, and re-aggregate.
- Approximate unlearning: use gradient ascent or knowledge distillation to reverse B3’s influence on the current model.
- Client-side unlearning: B3 locally generates anti-updates via noise injection or saliency-guided forgetting, then the server heals the global model.

### Open challenges
- Verification: how to prove the data was truly forgotten.
- Fairness: unlearning one client can unevenly degrade accuracy for remaining clients.
- Non-IID impact: removing B3’s rare P2P/ACH fraud data may disproportionately harm class-level accuracy.

---

## 24.2 Federated agents

### From federated models to federated autonomous agents
Classical FL trains a shared model, such as the neural network in the fraud example. Clients contribute gradients. Federated agents are LLM-powered agents that observe local environments, call tools, and make decisions. They collaboratively improve without sharing private interaction data.

### Why this matters
- Privacy: bank agents interact with customer transaction records locally. Only policy updates or knowledge summaries are shared, not raw transaction logs or investigation records.
- Heterogeneity: agents face different tasks, tools, and user preferences. This creates new forms of non-IID, including preference heterogeneity, coverage heterogeneity, and hardness heterogeneity.
- Communication: LLM parameters are huge, $10^9+$. Emerging methods share natural-language knowledge compendiums or in-context examples rather than weights.

---

# 25. Consolidated worked examples list

This section is for quick revision and calculation practice.

## 25.1 Scaling attack, equal-weight case

$$
\frac{1}{5}(0.10+0.12+0.11+0.09-5.00)
= -0.916.
$$

Robust methods on the same data:

| Method | Output |
|---|---:|
| Median | +0.10 |
| Trimmed mean, $\beta=0.2$ | +0.10 |
| Krum | +0.11 |
| Geometric median | approximately +0.105 |

## 25.2 Byzantine attack, equal-weight case

| Strategy | Byzantine update | FedAvg | Median |
|---|---:|---:|---:|
| Random noise | +3.7 | +0.824 | +0.11 |
| Sign flip | −0.10 | +0.064 | +0.10 |
| “A little less” | +0.02 | +0.088 | +0.10 |

## 25.3 Sybil threshold example

With 5 honest hospitals and 4 fake identities, total $K'=9$. Median threshold is:

$$
f < \frac{K'}{2} = 4.5.
$$

The attacker controls:

$$
f = 1 + 4 = 5,
$$

so median breaks because:

$$
5 > 4.5.
$$

## 25.4 FedAvg Round 1 in the bank example

$$
\sum_k p_k\Delta_k
= 0.0066 + 0.0126 + 0.0042 + 0.0095 + 0.0021
= 0.0350.
$$

$$
\theta^{(1)} = 0.150 + 0.0350 = 0.185.
$$

## 25.5 Scaling attack in the bank example

$$
\sum_k p_k\Delta_k
= 0.0066 + 0.0126 + 0.0042 + 0.0095 - 0.1050
= -0.0721.
$$

Honest update would have been $+0.0350$. The attack flips the direction.

## 25.6 DP clipping in the defences lecture

$$
\Delta=(3,4),\quad \|\Delta\|_2=5,\quad C=1.
$$

$$
\operatorname{clip}(\Delta,1)=(3,4)\cdot\frac{1}{5}=(0.6,0.8).
$$

With noise $(0.1,-0.2)$:

$$
\tilde{\Delta}=(0.7,0.6).
$$

## 25.7 DP clipping in the bank example

$$
\Delta_1=(0.033,0.041),\quad \|\Delta_1\|_2=0.0527,\quad C=0.05.
$$

$$
\operatorname{clip}(\Delta_1,0.05)
=(0.033,0.041)\cdot\frac{0.05}{0.0527}
=(0.0313,0.0389).
$$

With noise $(0.012,-0.008)$:

$$
\tilde{\Delta}_1=(0.0433,0.0309).
$$

## 25.8 Secure aggregation, defences lecture example

Masked messages:

$$
0.3+0.7-0.4=0.6,
$$

$$
0.5-0.7+0.1=-0.1,
$$

$$
0.2-(-0.4)-0.1=0.5.
$$

Server sum:

$$
0.6-0.1+0.5=1.0=0.3+0.5+0.2.
$$

## 25.9 Neural Cleanse trigger-size examples

General slide example:

| Target | Trigger size |
|---|---:|
| A | 15, outlier |
| B | 142 |
| C | 138 |

Bank walkthrough example:

| Target | Trigger size |
|---|---:|
| LGT | 4.2, outlier/backdoor |
| Other classes | approximately 38–41 |

---

# 26. Connections across lectures and applications

## 26.1 Connections to earlier FL lecture
- FedAvg, client selection $C^{(t)}$, local steps $R$, learning rate $\eta$, and weighting $p_k$ come from Part 1.
- The summary lecture’s 5-bank Round 1 calculation is a concrete application of FedAvg from Part 1.
- Client drift from Part 1 appears in the 5-bank example: B1 reaches 97.5% local accuracy while B3 only reaches 88%, due to non-IID data.

## 26.2 Connections between attacks and defences
- Scaling attacks motivate robust aggregation.
- Gradient inversion motivates DP and secure aggregation.
- Backdoors motivate Neural Cleanse, spectral methods, pruning/fine-tuning, and reputation.
- Sybil attacks motivate identity verification rather than just statistical aggregation.
- Free-riding motivates reputation, incentives, and proof of contribution.

## 26.3 Connections to later lectures
- DP lectures will cover formal privacy accounting in depth.
- SMPC lectures will formalise secure aggregation using secret sharing, garbled circuits, oblivious transfer, and related primitives.
- ZKP lectures will connect to proving update constraints such as $\|\Delta_k\| \le B$ without revealing the update.
- FHE is introduced as a later tool for computing on encrypted updates.

## 26.4 Application connections
- Healthcare: membership inference asks whether a specific patient record was used by a hospital.
- Banking: FL is useful because banks cannot share raw transaction data, but attacks can cause wire-fraud losses, money-laundering evasion, and banking secrecy/GDPR issues.
- Cross-device FL: Sybils and anonymous poisoning are major concerns.
- Cross-silo FL: insider threats, non-IID data, richer per-client batches, and regulatory accountability dominate.

---

# 27. Unclear sections / things to check against the recording

## [UNCLEAR] Separate transcript file not present
The zip contained slides and a 7-page lecture-notes PDF, but I did not find a separate auto-generated transcript file. These notes therefore use the lecture-notes PDF as the transcript-like source and all slide PDFs as slide sources. If there is a separate transcript, upload it for cross-checking.

## [UNCLEAR] W8.1 slide 4 taxonomy image
The “Attacks on FL...” slide appears to be an image/citation slide. PDF text extraction captured the citation but not the internal figure contents. The attack taxonomy used in these notes comes from the following taxonomy slide and lecture notes rather than that image.

## [UNCLEAR] Secure aggregation sign convention in the summary example
The defences lecture gives the convention “client $i$ adds $+r_{ij}$ when $i<j$, client $j$ adds $-r_{ij}$.” The summary lecture’s B1/B3 signs for $r_{13}$ differ from that convention, but all masks still cancel and the final sum is correct. Check the recording if the exact notation is important.

## [UNCLEAR] Exact values from visual-only plots
Some plots show trends rather than full numeric tables. The notes include exact values explicitly written in the slides, such as 92.5%, 91.5%, 91%, 15%, 89.2%, and 71.5%. Exact intermediate curve values are not provided by the extracted slide text.

## [UNCLEAR] Backdoor dynamics plot in W8.1
The slide states that clean accuracy barely dips by about 0.4%, backdoor success jumps above 87% within one round, and the backdoor decays slowly after the attacker leaves. The exact plotted points beyond those statements are visual and not fully enumerated in the slide text.

---

# 28. Final condensed revision checklist

Use this as a last-pass checklist after studying the full notes.

- Define the FL threat model and explain why FL widens the attack surface.
- Explain CIA targets for each attack type.
- Distinguish data poisoning from model poisoning.
- Work the scaling attack arithmetic for both equal-weight and weighted FedAvg.
- Explain why targeted backdoors preserve clean accuracy.
- State Byzantine thresholds for median and Krum.
- Explain how Sybils break majority-based defences.
- Write the gradient inversion optimisation objective.
- Write the membership inference threshold rule.
- Explain free-riding as an availability attack.
- Write coordinate-wise median, trimmed mean, Krum, and geometric median formulas.
- Explain why non-IID data makes robust aggregation hard.
- State the $(\varepsilon,\delta)$-DP definition.
- Work the clipping-and-noise DP examples.
- Explain local DP vs central DP.
- Explain pairwise mask cancellation in secure aggregation.
- Explain the secure aggregation vs robust aggregation conflict.
- Write the Neural Cleanse optimisation and explain the small-trigger outlier idea.
- Explain why reputation works better in cross-silo FL than cross-device FL.
- Reproduce the 5-bank FedAvg Round 1 calculation.
- Explain the full defence stack and its accuracy/protection trade-off.
- Connect FL defences to later tools: SMPC, ZKP, FHE, and DP theory.
