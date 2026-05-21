---
subject: COMP60272
chapter: 1
title: "Week 1"
language: en
---

# COMP60272 — Security and Privacy of AI: Week 1 Study Notes

**Course:** COMP60272 — Security and Privacy of AI.  
**Lecture topic/scope:** Week 1 introduces the course, distinguishes AI security/privacy from nearby areas, reviews core ML notation and MLOps, classifies common threats to the ML pipeline, and introduces the idea of modelling threats as optimisation problems.

**Sources used:**  
- `w1.1_intro.pdf` — Introduction slides  
- `w1.2_threats.pdf` — ML Pipeline & Common Threats slides  
- `w1.2_notes.pdf` — Lecture notes on notation and definitions  
- `w1.3_modelling.pdf` — Mathematical Modelling of Threats slides  

**Source note:** the auto-generated lecture transcript was not included in the chat. These notes use the uploaded slides and lecture-notes PDF. Transcript-dependent or visually/notation-ambiguous points are marked **[UNCLEAR]**.

---

## 1. Big picture: what this course is about

### 1.1 Security and Privacy of AI is not the same as AI Ethics, AI Safety, or AI for Cybersecurity

The opening lecture positions **Security & Privacy of AI** among several overlapping but distinct areas:

- **AI Ethics**
- **AI Safety**
- **Security & Privacy of AI**

The slides explicitly state:

> **Security & Privacy of AI ≠ AI for Cybersecurity**

AI for cybersecurity would mean using AI to defend or attack cyber systems. This course is about threats to AI/ML systems themselves.

---

### 1.2 AI Ethics

#### Intuition

AI ethics concerns whether AI systems are developed and used in morally acceptable, socially responsible ways.

#### Formal definition from slides

AI Ethics is:

> “A set of values, principles, and techniques [...] to guide moral conduct in the development and use of AI technologies.”

#### Examples listed under AI Ethics

- Fairness
- Algorithmic bias
- Sustainability and climate impact
- Accountability
- Transparency
- Explainability
- Interpretable AI
- Machine ethics
- Copyright

---

### 1.3 AI Safety

#### Intuition

AI safety focuses on making ML deployment beneficial and avoiding dangerous failures, especially rare, long-term, or high-impact risks.

#### Formal definition from slides

AI Safety is:

> “Making the adoption of ML more beneficial, with emphasis on long-term and long-tail risks.”

#### Examples listed under AI Safety

- Alignment
- Control
- Existential risks
- Artificial general intelligence, AGI
- Artificial superintelligence, ASI
- Systemic safety
- AI-enabled cyberattacks
- AI-enabled bioterrorism

---

### 1.4 Security & Privacy of AI

#### Intuition

This course studies attacks and defences around ML models, ML data, and ML deployment pipelines.

#### Formal definition from slides

Security & Privacy of AI is about:

> “Attacks and defenses that undermine the security and privacy of ML models,”

which define the field of **adversarial machine learning**.

#### Examples listed under Security & Privacy of AI

- Adversarial attacks
- Data poisoning
- Backdoors
- Membership inference
- Jailbreaks
- Prompt injection
- Model stealing
- Differential privacy
- Byzantine robustness

---

## 2. Motivation: why AI security and privacy matter

### 2.1 Real-world incidents and failure cases

The intro slides use recent AI-related incidents as motivation.

Examples shown:

- A BBC article about **Air Canada chatbot misinformation**.
- A military/warfare article about the “kill zone” of modern warfare.
- OECD AI incident database charts showing AI-related incidents and hazards over time.

The OECD chart categories shown include:

- Human or fundamental rights
- Public interest
- Psychological
- Physical injury
- Economic/property
- Reputational
- Physical death
- Other
- Environmental

**[UNCLEAR]** The slides show incident charts and links, but the transcript is needed to capture the lecturer’s exact interpretation, examples, and takeaways.

---

### 2.2 Proposed responses: regulations and standards

The intro lecture frames regulation and standardisation as part of the response to AI risk.

---

#### Regulations

The slides list:

##### UK National AI Strategy, 2021

- Sets out to establish an AI governance framework.

##### European Union AI Act, 2024

- Defines “high risk” vs unacceptable AI applications.

##### Other international initiatives

- AI Safety Summit 2023.
- Network of AI Safety Institutes.

---

#### Standards

The slides also discuss standards, especially in aeronautics.

##### EUROCAE ED-76 / RTCA DO-200

- Standards for processing aeronautical data.
- Controls the data flow from creation to use.

##### ED-324 / ARP 6983

- Process standard for development and certification/approval of aeronautical safety-related products implementing AI.
- Requires evidence that the model semantics are preserved throughout the implementation phase.

---

### 2.3 The security mindset

The lecturer’s framing moves through three roles:

#### Data scientist

- Cleans data.
- Trains models.

#### ML engineer

- Handles deployment.
- Handles efficiency.
- Handles infrastructure.

#### Security expert

- Worries about the worst-case scenario.

The slides call this the **“paranoid” mindset**.

Quote on slide:

> “There’s one very reliable way to stop bad things from happening and that’s to stop anything from happening”  
> — Steve Furber

#### Intuition

Security is about thinking beyond average-case model performance. The security expert asks what can go wrong under adversarial, worst-case, malicious, or unusual conditions.

---

## 3. Course structure, learning outcomes, and assessment

### 3.1 Course structure

The course is split into three main parts.

#### Part 1: Adversarial ML & Privacy Attacks

- Lecturer: Dr Edoardo Manino.
- Weeks 1–5.

#### Part 2: Security of Language Models

- Lecturer: Dr Mehran Hosseini.
- Weeks 5 and 7.

#### Part 3: Federated Learning & Cryptography for ML

- Lecturer: Dr Zhipeng Wang.
- Weeks 7–11.

---

### 3.2 Intended learning outcomes

The course learning outcomes are:

#### ILO 1

Describe common threats to the modern machine learning pipeline.

#### ILO 2

Explain the algorithmic details of adversarial and privacy attacks on AI components and identify appropriate defence techniques.

#### ILO 3

Design attacks and defences for a given AI component, taking into account computational and informational constraints.

#### ILO 4

Apply software tools to find adversarial vulnerabilities in a given AI model and patch them.

#### ILO 5

Use available libraries for deploying privacy-preserving techniques to protect AI models.

#### ILO 6

Communicate risks and countermeasures associated with state-of-the-art AI models to a wide variety of audiences.

#### ILO 7

Assess the suitability of AI security and privacy techniques for a given application.

---

### 3.3 Teaching and learning material

#### Core material

- Slides and quizzes.
- Lecture notes.
- Code tutorials.

#### Additional material

- Reading list on Canvas.
- Web resources on slides.
- Canvas discussion forum.

The slides say new material is intended to be released before each lecture.

---

### 3.4 Assessment

#### Exam flag

**EXAM FLAG:** The written exam is worth **50%** and **covers all topics**.

#### Assessment breakdown

##### Formative exercises

- Quizzes and tutorials during class.

##### Coursework I — 25%

- Topic: Adversarial Attacks and Defences.
- Due: 16/3/2026 at 2pm.

##### Coursework II — 25%

- Topic: Federated Learning.
- Due: 18/05/2026 at 2pm.

##### Written exam — 50%

- Covers all topics.
- During summer session.

---

### 3.5 Coursework I topics and points

Coursework I is on **Adversarial Attacks & Defences**.

Listed components:

| Topic | Points |
|---|---:|
| FGSM Attacks | 4 |
| Robustness Radius | 6 |
| Interval Analysis | 6 |
| Randomised Smoothing | 4 |
| [UNCLEAR: unlabeled row] | 4 |
| Total | 24 |

Additional note:

- One extra point for note-taking contributions.

**[UNCLEAR]** One additional row worth 4 points is visible in the slide table, but the label is not readable in the parsed text.

---

## 4. ML recap: basic concepts needed for the security material

The threat lecture starts with three strands:

1. **Data science**
   - Recap of basic ML concepts.
2. **ML engineering**
   - Supply chain and infrastructure.
3. **Security & Privacy of AI**
   - Threat taxonomies.

---

### 4.1 Supervised learning

#### Intuition

Supervised learning trains a model from examples where each input has a target output.

#### Formal setup from slides

Dataset:

$$
\{x_i, y_i\}_{i=1}^N
$$

Hypothesis class:

$$
H \equiv \{ f_\theta(x) \}
$$

Loss function as written on the slide:

$$
L(x_i, y_i, f_\theta)
=
\frac{1}{N}
\sum_{i=1}^{N}
d(f_\theta(x_i), y_i)
$$

where:

$$
d(f_\theta(x_i), y_i)
$$

measures the discrepancy between the model output and the true target.

**[UNCLEAR]** The slide writes the loss as $L(x_i,y_i,f_\theta)$ while also summing over all $i=1,\dots,N$. This is likely intended as an empirical dataset loss rather than a single-example loss. The transcript would confirm the lecturer’s exact notation.

---

### 4.2 Hypothesis class

#### Intuition

The hypothesis class is the set of functions the learning algorithm is allowed to choose from.

#### Formal definition from slides

$$
H \equiv \{ f_\theta(x) \}
$$

where:

- $f_\theta$ is a model/function.
- $\theta$ denotes model parameters.

The “Hypothesis Classes” slide visually lists examples of model families:

- Linear regression
- Logistic regression
- Decision tree
- SVM
- KNN
- Dimensionality reduction
- Random forest
- K-means
- Naive Bayes

---

### 4.3 Classification vs regression

The slides distinguish classification and regression by target type and loss type.

---

#### Classification

Target $y_i$ is categorical:

$$
y_i \in C
$$

Loss examples include:

- Cross entropy.

---

#### Regression

Target $y_i$ is numerical:

$$
y_i \in \mathbb{R}^d
$$

Loss examples include:

- Mean squared error.

---

### 4.4 Unsupervised learning vs reinforcement learning

The slides contrast these with supervised learning.

#### Unsupervised learning

- $y_i$ is missing.

#### Reinforcement learning

- Each $i$ comes sequentially.

#### Objective/loss changes

Examples listed:

- Energy potential.
- Regret minimisation.

**[UNCLEAR]** The slides do not give further formal definitions of unsupervised learning or reinforcement learning. Transcript needed for any spoken examples.

---

### 4.5 Deeper mathematical topics signposted

The “deeper dive” slide says the course expects/reviews:

#### Mathematical notation

- Multivariate calculus.
- Linear algebra.
- Probability theory.

#### Hypothesis classes

- Linear regression.
- Neural networks.

#### Training parametrised models

- Empirical risk minimisation.
- Stochastic gradient descent.

**Exam relevance:** The slide explicitly says to “check out the lecture notes,” and the exam covers all topics. Treat the lecture-notes definitions below as high-value revision material.

---

## 5. Mathematical notation and definitions from the lecture notes

The lecture-notes PDF covers four foundations:

1. Linear models.
2. Neural networks.
3. Vector norms.
4. Empirical Risk Minimisation.

---

## 5.1 Linear / affine models

### Intuition

Many ML models are built from **linear** or **affine** functions.

The notes explicitly mention that these appear in:

- Support vector machines.
- Logistic regression.
- Several neural-network layers:
  - Linear layers.
  - Convolutional layers.

An affine map takes an input vector, forms weighted sums of its entries, and adds a bias term.

---

### Formal definition: Affine Hypothesis Space

Given the input vector space:

$$
\mathbb{R}^m
$$

and the output vector space:

$$
\mathbb{R}^n
$$

define an affine mapping:

$$
f_\theta : \mathbb{R}^m \to \mathbb{R}^n
$$

with parameters:

$$
\theta = (W,b)
$$

where:

$$
W \in \mathbb{R}^{m \times n}
$$

and:

$$
b \in \mathbb{R}^n
$$

A clean coordinate form consistent with $W \in \mathbb{R}^{m \times n}$ and $b \in \mathbb{R}^n$ is:

$$
f_\theta(x)_j
=
\sum_{i=1}^{m} x_i w_{ij} + b_j
$$

When:

$$
b = 0
$$

the function $f_\theta$ is linear.

The affine hypothesis space is:

$$
H \equiv \{ f_\theta : \theta = (W,b) \}
$$

and is described as the hypothesis space of all linear classifiers and regressors.

**[UNCLEAR]** The PDF’s displayed coordinate formula appears garbled/inconsistent in the extracted text, with indices shown as something like:

$$
f_\theta(x)_i = \sum x_i w_{ij} + b_j
$$

The cleaned version above follows the stated parameter dimensions $W \in \mathbb{R}^{m\times n}$, $b \in \mathbb{R}^n$. Check the original PDF/recording if exact index convention matters.

---

## 5.2 Fully connected feedforward neural networks

### Intuition

A feedforward neural network is a function built by composing simpler functions called **layers**.

In a fully connected network, layers are usually affine transformations followed by nonlinear activation functions.

---

### Formal definition

A feedforward neural network is a composition of $L$ layers:

$$
f_\theta
=
\ell_L
\circ
\ell_{L-1}
\circ
\cdots
\circ
\ell_2
\circ
\ell_1
$$

Each layer is a real-valued map.

In clean indexed notation:

$$
\ell_i : \mathbb{R}^{n_{i-1}} \to \mathbb{R}^{n_i}
$$

The notes define two layer types for fully connected networks.

---

### Linear / affine layer

$$
\ell_i(x_{i-1})
=
W_i x_{i-1} + b_i
$$

where:

- $i$ is the layer index.
- $W_i$ is the weight matrix.
- $b_i$ is the bias vector.

**[UNCLEAR]** The extracted PDF gives $W_i \in \mathbb{R}^{n_{i-1}\times n_i}$, which may depend on row-vector vs column-vector convention. Check the recording/PDF if dimensions are assessed exactly.

---

### Nonlinear activation layer

$$
\ell_i(x_{i-1})
=
\sigma(x_{i-1})
$$

where:

- $\sigma(\cdot)$ is usually an element-wise function.

---

### Common architecture pattern

The notes say the most common design is to interleave:

$$
\text{linear layer}
\quad \to \quad
\text{activation layer}
\quad \to \quad
\text{linear layer}
\quad \to \quad
\text{activation layer}
\quad \to \cdots
$$

with:

- $\ell_1$ linear.
- $\ell_L$ linear.

Popular activations listed:

- ReLU.
- Sigmoid.
- Hyperbolic tangent.
- SoftMax.

---

## 5.3 Activation functions

### ReLU — Rectified Linear Unit

#### Intuition

ReLU keeps positive entries and clips negative entries to zero.

#### Formal definition

$$
\operatorname{ReLU} : \mathbb{R}^n \to \mathbb{R}^n
$$

$$
\operatorname{ReLU}(x)_i
=
\max(x_i,0)
$$

---

### Sigmoid activation

#### Intuition

Sigmoid maps each real-valued input entry into a value between 0 and 1.

#### Formal definition

$$
\operatorname{Sigmoid} : \mathbb{R}^n \to \mathbb{R}^n
$$

$$
\operatorname{Sigmoid}(x)_i
=
\frac{1}{1+\exp(-x_i)}
$$

---

### Hyperbolic tangent — TanH

#### Intuition

TanH is another element-wise nonlinear activation.

#### Formal definition

$$
\operatorname{TanH} : \mathbb{R}^n \to \mathbb{R}^n
$$

$$
\operatorname{TanH}(x)_i
=
\frac{\exp(x_i)-\exp(-x_i)}
{\exp(x_i)+\exp(-x_i)}
$$

---

### SoftMax activation

#### Intuition

SoftMax is a layer-wise activation because each output coordinate depends on all input coordinates through the denominator.

#### Formal definition

$$
\operatorname{SoftMax} : \mathbb{R}^n \to \mathbb{R}^n
$$

$$
\operatorname{SoftMax}(x)_i
=
\frac{\exp(x_i)}
{\sum_{j=1}^{n} \exp(x_j)}
$$

---

## 5.4 Vector norms

### Intuition

Vector norms appear in:

- Loss functions.
- Regularisation.
- Constraints during training.
- Later adversarial-ML concepts such as perturbation size and robustness radius.

The notes introduce the family of $p$-norms.

---

### Formal definition: $p$-norm

Given:

$$
x, x' \in \mathbb{R}^d
$$

the $p$-norm distance between them is:

$$
\|x-x'\|_p
=
\left(
\sum_{i=1}^{d}
|x_i-x_i'|^p
\right)^{1/p}
$$

---

### Formal definition: infinity norm

The infinity norm is the maximum coordinate-wise difference:

$$
\|x-x'\|_\infty
=
\max_{i=1}^{d}
|x_i-x_i'|
$$

---

### Formal definition: matrix norm

Given:

$$
A \in \mathbb{R}^{m \times n}
$$

its matrix norm is:

$$
\lambda(A)
=
\max_{x \ne 0}
\frac{\|Ax\|_p}{\|x\|_p}
$$

When:

$$
p=2
$$

$\lambda(A)$ is called the **spectral norm** of $A$.

---

## 5.5 Empirical Risk Minimisation, ERM

### Intuition

Once a parametrised hypothesis space:

$$
H = \{f_\theta\}
$$

is fixed, training means choosing the “best” function from that space.

The notes say defining “best” is difficult because of the **no free lunch theorem**, but a common approach is to choose the function that minimises expected error with respect to a loss function $L$.

---

### Step 1: Expected-risk objective

The ideal objective is:

$$
\theta^*
=
\arg\min_\theta
\mathbb{E}_{(x,y)\sim D}
\left[
L(f_\theta(x),y)
\right]
$$

This chooses the parameters whose model has the smallest average loss over the true data distribution $D$.

---

### Step 2: Expected value depends on unknown distribution

The expected value over:

$$
z=(x,y)\sim D
$$

is written:

$$
\mathbb{E}_{z\sim D}[g(z)]
\equiv
\int g(z)D(z)\,dz
$$

The issue is that $D$ is generally unknown.

---

### Step 3: Replace expected risk with empirical average

Assume a dataset of $N$ independent and identically distributed samples:

$$
\{(x_i,y_i)\}_{i=1}^{N} \sim D
$$

Then the expected risk can be estimated empirically:

$$
\mathbb{E}_{(x,y)\sim D}
\left[
L(f_\theta(x),y)
\right]
\approx
\frac{1}{N}
\sum_{i=1}^{N}
L(f_\theta(x_i),y_i)
$$

The notes state that this empirical estimator is unbiased under the i.i.d. assumption.

---

### Step 4: ERM training objective

The empirical-risk minimiser is:

$$
\hat{\theta}^{*}
=
\arg\min_{\theta}
\frac{1}{N}
\sum_{i=1}^{N}
L(f_\theta(x_i),y_i)
$$

The notes state that a large majority of machine-learning models are trained under the empirical risk minimisation framework, and that the unit will examine consequences of this design choice.

---

## 6. MLOps and the ML supply chain

### 6.1 Machine Learning Operations, MLOps

The MLOps slide shows ML development as a system of connected loops.

The visual includes:

#### ML loop

- Model.
- Data.

#### Dev loop

- Create.
- Verify.
- Package.
- Publish.

#### Ops loop

- Release.
- Configure.
- Monitor.

#### Intuition

ML security is not only about the trained model. It also includes:

- The data pipeline.
- The development pipeline.
- The deployment pipeline.
- Monitoring.
- Updates.
- Infrastructure.

---

### 6.2 Data provenance

#### Definition

Data provenance concerns:

- Where training/evaluation data comes from.
- Who controls the data.
- What risks or constraints follow from that origin.

The slides split data provenance into open-source and closed-source datasets.

---

### Open-source datasets

Open-source datasets exist on a spectrum:

- Some are maintained by known institutions.
- Some are scraped from the web.

---

### Closed-source datasets

Closed-source datasets may be:

- Provided by an external vendor, e.g. Turing or Scale.ai.
- Gathered through crowdsourcing, e.g. Amazon Mechanical Turk.
- Proprietary, personal, or otherwise sensitive data.
- Protected by copyright or licensing restrictions.

---

### Security relevance

The origin of data affects:

- Trust.
- Poisoning risk.
- Privacy risk.
- Copyright/licensing risk.
- Whether the model owner knows what is in the training set.

---

### 6.3 Model provenance

#### Definition

Model provenance concerns:

- Where the model comes from.
- How it was trained or obtained.
- What assumptions are made about its trustworthiness.

---

### Pre-trained models

The slides list pre-trained models that can be:

- Open source.
- Rented via API.
- Bought from a vendor.
- Fine-tuned for a particular use case.

The slide gives Hugging Face as an example source for open-source models.

---

### Bespoke models

For bespoke models, the user or organisation may:

- Train the model themselves.
- Choose hyperparameters.
- Use open-source or proprietary code and libraries.
- Use a local GPU server or offload to the cloud.
- Manage checkpoints, versioning, and monitoring.

---

### 6.4 Deployment

Deployment introduces monitoring and infrastructure concerns.

---

#### Monitoring

The slides list:

- Distribution shifts.
- Continual learning.

---

#### Infrastructure

Infrastructure concerns include:

- Software failures.
- Hardware failures.
- Network failures.
- Latency and throughput requirements.
- Low-power edge devices.
- Distributed servers.
- Machine Learning as a Service, MLaaS.

The slide also notes:

- Avoid the pitfall of Tay chatbot.

**[UNCLEAR]** The slide only references Tay; the transcript is needed for the lecturer’s exact explanation of how this relates to monitoring or continual learning.

---

### 6.5 ML as a component in a larger system

The “system view” slide emphasises that ML models are components inside bigger systems.

Examples:

- Recommender systems:
  - Social media.
  - Online stores.
- AI assistants and AI agents:
  - Customer support.
  - Coding IDEs.
- Automated decision-making/control:
  - Autonomous vehicles.

#### Key connection

Security analysis must consider both:

- The ML component.
- The surrounding software/hardware/user/environment system.

---

## 7. High-level threat model

### 7.1 Actors and objects

The high-level threat-model diagram shows:

#### Data Owner

- Owns the training set $D$.

#### Model Owner

- Creates the model $f_\theta$.

#### Model Consumer

- Uses the API $f(x;\theta)$.

#### Adversary

The adversary may want something about:

- The training set.
- The model.
- The API.

The adversary may have access to:

- The model.
- The API.

#### Intuition

Threat modelling asks:

1. What does the adversary want?
2. What can the adversary access?
3. Which asset is at risk?

---

### 7.2 Assets

The lecture defines assets as things worth protecting.

---

#### ML-specific assets

- Training data.
- Surrogate training data.
- ML model itself.
- ML model parameters.
- ML model hyperparameters.
- ML model architecture.
- ML model behaviour.

---

#### Additional assets

- Inference inputs.
- Inference outputs.
- External assets.

---

#### Key concept

An attack is not always aimed at the model weights. It might target:

- Private training data.
- The model’s behaviour.
- Model outputs.
- User inputs.
- Assets outside the ML system.

---

## 8. CIA taxonomy: Confidentiality, Integrity, Availability

The CIA taxonomy is presented as a set of basic secure-system properties used to clarify what an attacker aims to do.

---

### 8.1 Confidentiality and privacy

#### Intuition

Confidentiality/privacy attacks aim to reveal something that should remain hidden.

The slides say confidentiality/privacy relates to:

- Stealing private data.
- Revealing private data.

They distinguish confidentiality from privacy:

- Cryptography can preserve data confidentiality.
- Unintended data leakage may still occur as a privacy issue.

#### Key distinction

A system may protect raw data cryptographically but still leak information through:

- Model outputs.
- Model behaviour.
- Inference patterns.

---

### 8.2 Integrity

#### Intuition

Integrity attacks aim to make the ML system behave incorrectly or maliciously.

The slides define integrity attacks as attempts to:

- Manipulate ML behaviour.
- Modify ML behaviour.

They also note:

- ML systems already make errors on their own.

This matters because attack-induced errors must be distinguished from ordinary model errors.

---

### 8.3 Availability

#### Intuition

Availability attacks aim to stop legitimate users from accessing or using the system.

The slide definition:

- Stop the user from accessing/using the system.

---

## 9. Worked conceptual examples of attacks

No numerical worked examples are present in the uploaded materials. The lecture slides do contain four conceptual examples with diagrams.

---

### 9.1 Example 1: Adversarial attack

The adversarial-attack slide shows an autonomous-driving/lidar scenario.

#### Normal case

1. Vehicle is in autopilot mode.
2. Lidar environment awareness supports perception of the environment.
3. The system correctly predicts the situation as dangerous.

#### Attack case

1. The attacker directs a laser at the sensor system.
2. The sensory system is spoofed.
3. The system wrongly predicts the scene as safe.

#### Failure case

1. The accident occurs.
2. The sensory system fails or outputs an error.
3. The system wrongly predicts the situation as an error.

#### Key concept

An adversarial attack can manipulate the model’s input or sensed environment so that the ML component produces an unsafe prediction.

#### CIA category

Mainly **integrity**, because the attacker manipulates ML behaviour.

---

### 9.2 Example 2: Poisoning attack

The poisoning-attack slide separates training phase and inference phase.

---

#### Training phase

1. A clean dataset exists.
2. Poisoning samples are added.
3. The model is trained on contaminated data.
4. The resulting model is a poisoned model.

---

#### Inference phase

1. A benign sample is classified normally.
2. A sample with a trigger is classified differently.
3. In the traffic-sign example:
   - Benign label: “Compulsory Ahead Only.”
   - Triggered label: “Compulsory Keep Right.”

---

#### Key concept

Poisoning attacks manipulate training data so that the trained model behaves maliciously or incorrectly later.

#### CIA category

Mainly **integrity**.

---

### 9.3 Example 3: Model extraction attack

The model-extraction slide shows an attacker querying a model and trying to reconstruct or imitate it.

It distinguishes two broad types of model extraction attack.

---

#### Functionally equivalent model extraction attacks

The diagram lists attacks based on:

- Memory.
- Side-channel.
- Equation-solving.
- Black-box access.

---

#### Task-accuracy model extraction attacks

The diagram lists:

- Defence-aware model extraction attacks.
- Transfer-learning-based model extraction attacks.
- Uncertainty-sampling-based extraction attacks.
- Query-optimized black-box extraction attacks.

---

#### Key concept

Model extraction targets the model as an asset. The attacker wants to copy, approximate, or recover useful behaviour from the original model.

#### CIA category

Mainly **confidentiality**, because model details or behaviour are being revealed/stolen.

---

### 9.4 Example 4: Membership inference attack

The membership-inference slide shows:

- Black-box and white-box settings.
- Query/result interactions with a model.
- An original model.
- An updated model.
- Update data.
- Model update.

The diagram also labels related analyses:

- Membership inference.
- Differential analysis.
- Model inversion.

---

#### Key concept

Membership inference is a privacy attack. The attacker tries to infer whether a particular example was part of the training data or update data.

#### CIA category

Mainly **privacy/confidentiality**.

**[UNCLEAR]** The slide diagram contains several related privacy attacks, but the transcript is needed to capture exactly how the lecturer distinguished membership inference from differential analysis and model inversion.

---

## 10. Attack taxonomies

## 10.1 Training-time vs inference-time taxonomy

This taxonomy focuses on **when the main part of the attack takes place**.

The slides follow He et al. 2025, *Artificial intelligence security and privacy: a survey*.

---

### Training-phase attacks

Training-phase attacks happen during or against the training process.

The diagram divides them into centralised and distributed training attacks.

---

#### Centralised training attacks

- Untargeted data poisoning attacks.
- Backdoor attacks.
- Model hijacking attacks.

---

#### Distributed training attacks

- Attacks in federated learning.
- Attacks in split learning.

---

#### Connection

The distributed setting creates extra attack surface and connects to Part II of the unit on federated learning.

---

### Inference-phase attacks

Inference-phase attacks happen after training, when the model is being used.

The diagram divides them into several categories.

---

#### Privacy inference attacks

- Data and attribute reconstruction attacks.
- Membership inference attacks.

---

#### Fault injection attacks

- Parameter fault injection attacks.
- Hardware fault injection attacks.
- Software fault injection attacks.

---

#### Adversarial attacks

- Adversarial attacks on the digital domain.
- Adversarial attacks on the physical domain.

---

#### Model stealing attacks

- Task-accuracy model extraction.
- Functionally equivalent model extraction attacks.

---

#### Attacks against large language models

- Jailbreak attacks.
- Prompt-based attacks.
- Attacks during the fine-tuning stage.

---

### Notes on naming

The slides warn that:

- Attacks or defences on LLMs may have different names.
- Infrastructure and side-channel attacks should be included.
- Both hardware and software attacks are relevant.

---

## 10.2 Centralised vs distributed setting

### Centralised setting

Training and control are concentrated in one place or one organisation/system.

### Distributed setting

Training or computation is split across multiple parties/devices/systems.

The slides explicitly state:

- Distributed settings create extra attack surface.
- Federated learning is covered in Part II of the unit.

### Connection

This links Week 1 threat modelling to the later federated learning and cryptography part of the course.

---

## 10.3 Passive attacker vs active attacker taxonomy

This taxonomy classifies the attacker by whether they only observe or actively interfere.

---

### Passive adversary

The slides define a passive adversary as:

- Honest-but-curious attacker.
- Observes the ML system and performs inference.
- Does not interfere with training data or gradient updates.

#### Intuition

Passive attackers exploit information leakage without changing the system.

---

### Active adversary

The slides define an active adversary as:

- Fully malicious attacker.
- May manipulate:
  - Training data.
  - Inference data.
  - Gradients.
- Can adapt to newly deployed defences.

#### Intuition

Active attackers can corrupt or perturb the system, not just observe it.

---

## 10.4 Attacker knowledge taxonomy

This taxonomy classifies attacks by what the attacker knows about the ML system.

---

### Perfect knowledge

The slides say the attacker has information on the ML system, including:

- ML algorithm.
- Model parameters.
- Training data.

**[UNCLEAR]** The slide text says “attacker has (some) information” under “perfect knowledge,” which sounds weaker than the heading. Check the recording for the exact intended distinction.

---

### Zero knowledge

The slides define zero knowledge as:

- The ML system remains a black box.
- The attacker can craft inputs and observe outputs.

#### Intuition

Even with black-box access, attacks may be possible through queries.

---

### Partial knowledge

The slides define partial knowledge as:

- Somewhere between perfect knowledge and zero knowledge.

---

## 10.5 MITRE ATLAS taxonomy

The MITRE ATLAS taxonomy focuses on the traditional attack chain.

The slides state that it:

- Covers all stages of a successful cyber attack.
- Covers stages from reconnaissance to exfiltration.
- Blurs the lines between ML-only and whole cyber system.

---

### In-class exercise

Students were asked to:

- Visit the MITRE ATLAS matrix.
- Find a pure machine-learning attack step.
- Find a more traditional cybersecurity example.

### Connection

This taxonomy links AI security to wider cybersecurity practice.

---

## 11. Mathematical modelling of threats

The Week 1 modelling slide gives the key modelling move:

> Turn threats into optimisation problems.

---

### 11.1 Intuition

A natural-language threat such as:

- “make the model misclassify this input”
- “extract the model”
- “infer whether a data point was in the training set”

can be represented mathematically as a problem with:

- Variables the attacker controls.
- Constraints on what the attacker is allowed to do.
- An objective that captures the attacker’s goal.

**Important:** The slide itself only states the high-level idea. It does not give a full optimisation formulation yet.

---

### 11.2 Learning resources

The modelling slides say the course follows official UK knowledge guides, specifically:

- Cavallaro et al. 2023, *Security and Privacy of AI Knowledge Guide*.
- Pages 4, 5, 6, and 8.

---

### 11.3 Next topics signposted

The modelling lecture points forward to:

- Computing adversarial attacks.
- Reachability and interval analysis.
- Neural network verification.

### Connection

These next topics build directly on the mathematical foundations from the lecture notes:

- Hypothesis classes.
- Neural networks.
- Vector norms.
- Empirical risk minimisation.

---

## 12. Exam flags and high-value revision points

### Explicit exam/assessment flags

#### EXAM FLAG: Written exam

The written exam is worth:

$$
50\%
$$

and:

> Covers all topics.

This is the clearest explicit exam flag in the slides.

---

#### Coursework I

Coursework I is worth:

$$
25\%
$$

Topic:

- Adversarial Attacks and Defences.

Due:

- 16/3/2026 at 2pm.

---

#### Coursework II

Coursework II is worth:

$$
25\%
$$

Topic:

- Federated Learning.

Due:

- 18/05/2026 at 2pm.

---

#### Coursework I topics

Coursework I includes:

- FGSM attacks.
- Robustness radius.
- Interval analysis.
- Randomised smoothing.
- One unlabeled 4-point row **[UNCLEAR]**.

---

#### Note-taking contribution

One extra point is available for note-taking contributions.

---

### “You should know this” style flags from the materials

The slides do not include many explicit “this is important” phrases, but the following are structurally high-value because they are learning outcomes, coursework topics, or foundations used later:

- CIA taxonomy:
  - Confidentiality/privacy.
  - Integrity.
  - Availability.
- Training-time vs inference-time taxonomy.
- Passive vs active adversary.
- Attacker knowledge:
  - Perfect knowledge.
  - Zero knowledge.
  - Partial knowledge.
- Assets in ML systems.
- Data/model/deployment provenance in the ML supply chain.
- Affine hypothesis spaces.
- Neural-network composition and activations.
- $p$-norms, infinity norm, matrix/spectral norm.
- Empirical Risk Minimisation.
- Mathematical modelling of threats as optimisation problems.
- Distributed attack surface and its connection to federated learning.

---

## 13. Connections across lectures and course parts

### Intro lecture → Threats lecture

The intro lecture ends by pointing to:

- Threats to the AI pipeline.
- Mathematical modelling.

The next lecture then covers:

- ML pipeline.
- Common threats.

---

### Threats lecture → Mathematical modelling

The threat lecture identifies:

- Assets.
- Attacker access.
- Threat taxonomies.
- Attack examples.

The modelling lecture then says these threats will be turned into optimisation problems.

---

### Threats lecture → Federated learning

The training-time vs inference-time taxonomy says distributed settings create extra attack surface and explicitly points to Part II of the unit:

- Federated learning.

---

### Lecture notes → Future adversarial ML topics

The lecture notes define mathematical tools that will be needed later:

- Neural networks.
- Norms.
- Empirical Risk Minimisation.

The modelling slides then point ahead to:

- Adversarial attacks.
- Reachability.
- Interval analysis.
- Neural network verification.

---

## 14. Unclear sections to revisit in the recording

1. **Transcript missing.**  
   No auto-generated transcript was included, so oral explanations, examples, emphasis, and spoken exam hints are not captured.

2. **Affine mapping index notation.**  
   The lecture-notes formula for $f_\theta(x)$ appears garbled/inconsistent in the extracted text. Revisit the exact coordinate convention.

3. **Layer dimensions in neural-network definition.**  
   The extracted PDF gives a matrix shape that may depend on row-vector/column-vector convention. Revisit if exact dimensions are assessed.

4. **Coursework I unlabeled 4-point row.**  
   The slide shows an additional 4-point item without a visible label in the parsed text. Check Canvas or the original slide/recording.

5. **OECD AI incident charts.**  
   The charts show trends and categories, but the transcript is needed for the lecturer’s interpretation and any exact values.

6. **Attack example diagrams.**  
   The diagrams for adversarial attack, poisoning, model extraction, and membership inference contain useful visual detail, but the transcript is needed for the lecturer’s step-by-step explanation.

7. **Attacker knowledge taxonomy wording.**  
   “Perfect knowledge” is described as having “some” information, which may be shorthand or imprecise slide wording. Revisit the recording.

8. **Tay chatbot deployment warning.**  
   The deployment slide references Tay, but the transcript is needed to capture the intended lesson.

---

## 15. Quick revision checklist

Use this as a fast self-test.

### Course framing

- [ ] Can I distinguish AI Ethics, AI Safety, and Security & Privacy of AI?
- [ ] Can I explain why Security & Privacy of AI is not the same as AI for Cybersecurity?
- [ ] Can I give examples of attacks studied in adversarial machine learning?

### ML foundations

- [ ] Can I define a hypothesis class?
- [ ] Can I write the supervised learning dataset notation?
- [ ] Can I distinguish classification and regression?
- [ ] Can I define an affine hypothesis space?
- [ ] Can I explain feedforward neural networks as compositions of layers?
- [ ] Can I write ReLU, sigmoid, TanH, and SoftMax?
- [ ] Can I define $p$-norm, infinity norm, and spectral norm?
- [ ] Can I derive ERM from expected risk?

### ML pipeline

- [ ] Can I explain data provenance?
- [ ] Can I explain model provenance?
- [ ] Can I list deployment risks?
- [ ] Can I explain why ML models are components of larger systems?

### Threat modelling

- [ ] Can I identify data owner, model owner, model consumer, and adversary?
- [ ] Can I list ML-specific assets?
- [ ] Can I explain confidentiality/privacy, integrity, and availability?
- [ ] Can I classify adversarial attacks, poisoning attacks, model extraction, and membership inference?

### Attack taxonomies

- [ ] Can I distinguish training-time and inference-time attacks?
- [ ] Can I distinguish centralised and distributed settings?
- [ ] Can I distinguish passive and active attackers?
- [ ] Can I explain attacker knowledge levels?
- [ ] Can I explain what MITRE ATLAS adds to the taxonomy?

### Mathematical modelling

- [ ] Can I explain what it means to turn threats into optimisation problems?
- [ ] Can I identify attacker-controlled variables, constraints, and objectives?
- [ ] Can I connect modelling to adversarial attacks, reachability, interval analysis, and verification?
