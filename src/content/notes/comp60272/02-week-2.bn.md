---
subject: COMP60272
chapter: 2
title: "Week 2"
language: bn
---

# COMP60272 - এআই-এর নিরাপত্তা ও গোপনীয়তা: সপ্তাহ ২-এর কাঠামোবদ্ধ স্টাডি নোট

**বিষয় ও পরিধি।** সপ্তাহ ২-এ adversarial attacks-কে একটি security problem হিসেবে দেখা থেকে neural-network safety নিয়ে formal reasoning-এ যাওয়া হয়েছে। ক্রমটি হলো: FGSM দিয়ে adversarial attacks খোঁজা; over-approximate verification method হিসেবে reachability ও interval analysis; এবং ONNX, VNN-LIB ও Marabou ব্যবহার করে practical neural-network verification।

**Source note.** আপলোড করা zip-এ তিনটি slide deck এবং দুটি lecture-notes PDF ছিল: `w2.1_adversarial.pdf`, `w2.1_notes.pdf`, `w2.2_intervals.pdf`, `w2.2_notes.pdf`, এবং `w2.3_verification.pdf`। zip-এ আলাদা কোনো auto-generated transcript file ছিল না, তাই এই notes slides এবং lecture-notes PDFs ব্যবহার করে তৈরি।

**Exam flags.** সরবরাহ করা files-এ “this will be on the exam” ধরনের কোনো স্পষ্ট বাক্য নেই। slides-এ থাকা explicit warning/importance cues নিচে **[EXAM FLAG / WARNING]** হিসেবে চিহ্নিত করা হয়েছে।

---

## 1. Lecture 2.1 - Finding Adversarial Attacks

### 1.1 এই lecture কোথায় fit করে

Slide recap অনুযায়ী আগের সপ্তাহে আলোচনা হয়েছে:

- machine learning-এর সংক্ষিপ্ত recap;
- MLOps এবং অন্যান্য engineering considerations;
- machine learning-এর threats: definitions এবং taxonomies;
- কিছু mathematical modelling।

এই lecture তিনটি প্রশ্ন করে:

- Adversarial attacks কী?
- এগুলো কোথা থেকে আসে?
- এগুলো efficiently কীভাবে খুঁজে পাওয়া যায়?

Lecture-টি adversarial attacks-কে machine-learning fragility এবং security-style reasoning — দুই দিকের সঙ্গেই যুক্ত করে। শেষে এটি সামনে নিয়ে যায়:

- adversarial attacks গণনা করা;
- reachability এবং interval analysis;
- neural-network verification।

---

### 1.2 Machine-learning problem হিসেবে adversarial attacks

#### Intuition

Lecture-টি adversarial attacks-কে এমন evidence হিসেবে frame করে যে curated datasets-এ high performance থাকা মানেই robust real-world deployment নয়। একটি model সাধারণ training/test distribution-এ ভালো perform করলেও, adversary input manipulate করলে সেটি খারাপ আচরণ করতে পারে।

Lecture-টি আরও গভীর একটি issue তোলে: adversarial examples হয়তো এই সত্যের symptom যে machine-learning models মানুষের মতো operate করে না। Slides-এ এই ধারণা cite করা হয়েছে যে adversarial examples “bugs” নয়, বরং “features” হতে পারে, এবং এগুলো fundamentally fix করা অসম্ভবও হতে পারে। পরের সপ্তাহকে তারপর মজার ছলে বলা হয়েছে—তবু এগুলো fix করার চেষ্টা করা হবে।

#### Lecture notes থেকে formal training objective

Notes-এ mainstream machine-learning paradigm-কে empirical risk objective-এর বিরুদ্ধে models train করা হিসেবে উপস্থাপন করা হয়েছে:

$$
f^* = \arg\max_f \mathbb{E}\{\mathcal{L}(f(x), y)\}
\approx
\arg\max_f \frac{1}{N}\sum_{(x,y)\in \mathcal{D}} \mathcal{L}(f(x), y).
$$

যদি dataset $\mathcal{D}$ যথেষ্ট বড় হয় এবং i.i.d. samples ধারণ করে, তাহলে empirical risk loss $\mathcal{L}(f(x),y)$-এর expected value approximate করবে বলে আশা করা হয়।

**[UNCLEAR / অস্পষ্ট]** Notes-এ একে “empirical risk minimisation objective” বলা হয়েছে, কিন্তু printed formula-তে $\arg\max$ ব্যবহার করা হয়েছে, $\arg\min$ নয়। উপরের formula printed অবস্থাতেই রাখা হয়েছে; sign গুরুত্বপূর্ণ হলে recording/source check করতে হবে।

#### কেন adversarial manipulation সাধারণ assumption ভেঙে দেয়

যখন adversary-কে inputs $x$ manipulate করার অনুমতি দেওয়া হয়, perturbation যত ছোটই হোক না কেন, i.i.d. assumption ভেঙে যায়। সেই ক্ষেত্রে optimally trained model $f^*$-ও arbitrarily poorly perform করতে পারে।

---

### 1.3 Adversarial attacks-এর historical rediscovery এবং examples

#### Rediscovery-এর history

Slides adversarial attacks-কে independently discovered হিসেবে বর্ণনা করে:

- machine-learning community;
- security community।

Slide references-এ রয়েছে Szegedy et al.-এর “Intriguing properties of neural networks,” Biggio et al.-এর adversarial machine learning-এর history নিয়ে কাজ, এবং Goodfellow et al.-এর “Explaining and Harnessing Adversarial Examples।”

#### Worked visual example: panda থেকে gibbon

Slides এবং notes standard adversarial-image example দেখায়:

$$
x + 0.007 \times \operatorname{sign}(\nabla_x J(\theta,x,y))
$$

Example-টি এভাবে উপস্থাপিত:

- original image $x$: “panda” হিসেবে classified, 57.7% confidence সহ;
- perturbation term: visually noise-like, intermediate label “nematode” 8.2% confidence সহ;
- perturbed image: “gibbon” হিসেবে classified, 99.3% confidence সহ।

এটি দেখাতে ব্যবহার করা হয়েছে যে মানুষের চোখে ছোট মনে হওয়া perturbation model-এর prediction শক্তভাবে বদলে দিতে পারে।

#### Universal adversarial attacks

**Definition / intuition.** Universal adversarial attack হলো এমন attack pattern যা একক image/model pair-এর বাইরে কাজ করে। Slide universal attacks-কে summarise করেছে:

- same attack;
- different images;
- different models।

মূল point হলো adversarial vulnerability আবশ্যিকভাবে একটিমাত্র hand-crafted input-এর সঙ্গে বাঁধা নয়। একটি single perturbation pattern inputs জুড়ে, এমনকি models জুড়েও transfer করতে পারে।

#### শুধু adversarial noise নয়: rotation এবং translation

Slides স্পষ্টভাবে বলে যে attacks imperceptible pixel noise-এ সীমাবদ্ধ নয়। Rotation এবং translation-ও models-কে fool করতে পারে।

Visual example-এ traffic-sign images দেখানো হয়েছে, যেখানে transformed stop-sign/warning-sign images “SpeedLimit20” হিসেবে classified হয়েছে। এটি adversarial behaviour-কে শুধু pixel-level noise নয়, physical বা geometric transformations-এর সঙ্গেও যুক্ত করে।

#### শুধু adversarial noise নয়: weather effects

Slides robustness problems-এর source হিসেবে weather effects-ও দেখায়। Cited figure challenging weather conditions-এর অধীনে object-detection scenes compare করে, যার মধ্যে weather augmentation/synthesis approaches রয়েছে। Lecture এটি ব্যবহার করে adversarial বা robustness stress-এর ধারণাকে simple additive noise-এর বাইরে প্রসারিত করে।

---

### 1.4 Steganography rationale

#### Intuition: accidental steganography হিসেবে adversarial attacks

Lecture steganography-কে data conceal করার art হিসেবে introduce করে:

- radio waves, images, sound, অথবা text-এ imperceptible changes যোগ করা;
- receiver hidden message reconstruct করতে পারে।

Adversarial-attack analogy হলো: perturbation অনেক input dimensions জুড়ে “spread” করা যায়, যাতে প্রতিটি individual change ছোট থাকে, কিন্তু model সেই changes aggregate করে বড় effect তৈরি করে।

Slide-এ বলা হয়েছে:

> Adversarial attacks ≈ unintentional steganography?

#### Formal setup: linear binary classifier

একটি linear binary classifier ধরা যাক:

$$
f(x)=w^T x.
$$

Classifier positive class predict করে যখন:

$$
w^T x \ge 0,
$$

আর negative class predict করে otherwise।

Lecture perturbed input $x'$-এর output এভাবে decompose করে:

$$
y' = w^T x' = w^T x + w^T(x' - x) = y + w^T\eta.
$$

এখানে:

- $y$ হলো non-perturbed output;
- $\eta$ হলো input perturbation।

**[UNCLEAR / অস্পষ্ট]** Notes-এ $\eta = x - x'$ define করা হয়েছে, কিন্তু displayed derivation-এ $w^T(x' - x)=w^T\eta$ ব্যবহার করা হয়েছে, যা $\eta=x'-x$-এর সঙ্গে মেলে। সরবরাহ করা notes-এ derivation ও definition-এর মধ্যে sign mismatch আছে।

#### Dimensionality effect

Lecture notes বলে: যদি weights $w$ uniformly distributed হয় এবং $w^T\eta$ constant রাখা হয়, তাহলে প্রতিটি perturbation entry-এর magnitude input dimension $d$-এর সঙ্গে linearly কমে:

$$
\|\eta_i\| = O(1/d).
$$

Interpretation:

- total dot-product effect $w^T\eta$ classifier output বদলানোর মতো যথেষ্ট বড় থাকতে পারে;
- প্রতিটি individual coordinate perturbation ছোট হতে পারে;
- high dimensions-এ perturbation ছড়িয়ে দিলে প্রতিটি coordinate detect করা কঠিন হয়।

#### Lecture notes-এ বলা consequences

এই simplified linear interpretation দুটি consequence দেয়:

1. Adversarial attacks “accidental steganography”-এর একটি form হয়ে দাঁড়ায়, যার প্রতি অধিকাংশ বা সব machine-learning models susceptible।
2. Adversarial attacks compute করা সহজ হওয়ার কথা, কারণ input-এর respect-এ output-এর gradient follow করলেই হয়।

---

### 1.5 Fast Gradient Sign Method, FGSM

#### Definition: intuition

FGSM adversarial perturbation construct করার একটি cheap heuristic method। এটি input-এর respect-এ loss-এর gradient-এর sign ব্যবহার করে, তাই local gradient information অনুযায়ী loss বাড়ায় এমন direction-এ প্রতিটি input coordinate modify করে।

#### Lecture notes থেকে formal definition

Given:

- predictive model $f : \mathbb{R}^n \to \mathbb{R}^m$;
- loss function $\mathcal{L}: \mathbb{R}^m \times \mathbb{R}^m \to \mathbb{R}^+$;
- input $x$;
- label/target value $y$;
- magnitude parameter $\epsilon \in \mathbb{R}^+$;

FGSM constructs:

$$
x' = x + \epsilon \cdot \operatorname{sign}\left(\nabla_x \mathcal{L}(f(x), y)\right).
$$

Lecture notes $\nabla_x$-কে input coordinate $x_i$-গুলোর প্রত্যেকটির respect-এ loss $\mathcal{L}$-এর partial derivatives-এর vector হিসেবে define করে।

#### Algorithmic reading

FGSM এভাবে এগোয়:

1. Original input-এ loss $\mathcal{L}(f(x),y)$ evaluate করা।
2. Original input-এর respect-এ gradient একবার compute করা:
   

$$
\nabla_x \mathcal{L}(f(x),y).
$$

3. সেই gradient-এর elementwise sign নেওয়া:
   

$$
\operatorname{sign}(\nabla_x \mathcal{L}(f(x),y)).
$$

4. $\epsilon$ দিয়ে scale করা।
5. Original input-এ perturbation যোগ করা:
   

$$
x' = x + \epsilon\operatorname{sign}(\nabla_x \mathcal{L}(f(x),y)).
$$

#### কেন এটি “fast”

Notes জোর দেয় যে FGSM gradients মাত্র একবার compute করে, original input $x$-এর respect-এ। Assumption হলো বেশিরভাগ neural models $x$-এর ছোট neighbourhood-এ approximately linear, তাই gradients $\epsilon$-এর বিভিন্ন values-এর জন্য informative থাকে।

যদি লক্ষ্য হয় classifier $f$-কে fool করে এমন smallest $\epsilon$ খুঁজে পাওয়া, lecture notes বলে $\epsilon$-এর উপর line search করলেই যথেষ্ট। সেই line search model-কে শুধু inference mode-এ চালায়, তাই FGSM-এর “fast” character বজায় থাকে।

---

### 1.6 Falsification এবং verification bridge

Lecture adversarial attacks-কে security problem হিসেবে reframe করে শেষ হয়: আমরা কি certified inference অর্জন করতে পারি?

এটি safety-critical applications-এর জন্য crucial হিসেবে বর্ণিত।

#### Falsification

Falsification বর্ণিত হয়েছে:

- heuristic adversarial attacks ব্যবহার করা;
- example হিসেবে FGSM;
- automated software testing-এর মতো।

Purpose হলো counterexample বা attack খুঁজে পাওয়া।

#### Verification

Verification বর্ণিত হয়েছে:

- attacks নেই তা prove করা;
- সপ্তাহের পরের অংশের main topic;
- automated theorem proving-এর মতো।

Purpose হলো safety prove করা, শুধু attacks না পাওয়া নয়।

**[EXAM FLAG / WARNING]** Slide বলে certified inference safety-critical applications-এর জন্য crucial।

---

## 2. Lecture 2.2 - Reachability and Interval Analysis

### 2.1 এই lecture কোথায় fit করে

Interval-analysis lecture adversarial-attacks lecture থেকে security problem recap করে শুরু হয়:

- certified inference safety-critical applications-এর জন্য crucial;
- falsification FGSM-এর মতো heuristic attacks ব্যবহার করে এবং automated software testing-এর analogous;
- verification prove করে যে attacks নেই এবং automated theorem proving-এর analogous।

এরপর lecture এগোয়:

- reachability;
- exact reachable sets;
- over-approximation;
- safety proofs;
- interval analysis definitions এবং operators;
- neural-network reachability।

---

### 2.2 Adversarial optimisation থেকে satisfiability

#### Optimisation formulation

Slide adversarial attack search-কে predicted class বদলায় এমন smallest perturbation খোঁজা হিসেবে formulate করে:

$$
\text{minimise} \quad \|\epsilon\|_\infty
$$

subject to:

$$
\arg\max f(x) \ne \arg\max f(x+\epsilon).
$$

এটি “smallest successful attack খোঁজা” view।

#### Satisfiability formulation

তারপর slide problem-কে reformulate করে: কোনো constant $c$ দিয়ে bounded perturbation আছে কি না জিজ্ঞাসা করা:

$$
\exists \epsilon,\quad \|\epsilon\|_\infty \le c
\quad \Rightarrow \quad
\arg\max f(x) \ne \arg\max f(x+\epsilon).
$$

**[UNCLEAR / অস্পষ্ট]** Slide এটি implication arrow দিয়ে লেখে। Printed অবস্থায় এটি উপরে preserved। Revision-এর জন্য recording check করতে হবে: intended formal reading কি ছিল “there exists $\epsilon$ such that both $\|\epsilon\|_\infty\le c$ and the class changes hold।”

---

### 2.3 Reachability analysis

#### Intuition

AI safety-তে আমরা prove করতে চাইতে পারি যে model কখনো কোনো unsafe behaviour produce করতে পারে না। Lecture notes উদাহরণ দেয়:

- language model কখনো offensive remark produce করে না;
- language model কখনো crime commit করার detailed step-by-step instructions generate করে না;
- autonomous car কখনো pedestrian-এর দিকে swerve করে না;
- autonomous car obstacle-এর মুখোমুখি হলে brake করতে কখনো fail করে না।

Challenge হলো কোনো behaviour-এর absence prove করতে হলে model-কে সব possible inputs-এর against check করতে হতে পারে। Reachability analysis এই কাজের একটি approach হিসেবে introduced।

#### Exact reachable set: informal definition

Reachability analysis হলো function $f$-এর সব possible outputs compute করার task। এই course-এ $f$ একটি AI model, যেমন neural network।

#### Exact reachable set: formal definition

Given:

- function $f : \mathbb{R}^m \to \mathbb{R}^n$;
- input set $\mathcal{X} \subseteq \mathbb{R}^m$;

Exact reachable set $\mathcal{Y}$ define করা হয়:

$$
\mathcal{Y} = \{y : y = f(x) \land x \in \mathcal{X}\}.
$$

এই set inputs $x\in\mathcal{X}$ থেকে reachable সব outputs $y=f(x)$ ধারণ করে।

যদি arbitrary AI models-এর জন্য exact reachable set compute করা যেত, sophisticated AI-safety queries solve করা যেত।

---

### 2.4 Exact reachability-এর computational challenge

#### Worked example 1: one-dimensional neural network approximation

Lecture notes একটি simple neural network $f$ ব্যবহার করে, যা $x\in[-2,3]$-এর উপর নিচের function approximate করতে trained:

$$
g(x) = \frac{1}{8}x^4 - \frac{1}{4}x^3 - \frac{3}{4}x^2 + x + \frac{1}{2}.
$$

প্রশ্ন হলো interval-এর সব inputs-এর জন্য neural network-এর predictions ground truth-এর কাছাকাছি কি না কীভাবে check করা যায়, যেমন:

$$
|g(x)-f(x)| \le 0.01
\quad \text{for all } x\in[-2,3].
$$

#### Brute-force scanning idea

একটি potential solution হলো $[-2,3]$-এর সব possible inputs scan করা এবং $g(x)-f(x)$ measure করা।

Notes ব্যাখ্যা করে কেন এটি impractical হয়ে যায়:

- network যদি 32-bit floating point-এ implemented হয়, তবুও প্রায় $2^{31}$ input values check করতে হয়;
- shown network-এর ক্ষেত্রে, যেখানে দুটি hidden layers আছে এবং প্রতিটিতে 16 neurons, single CPU-তে এটি করতে প্রায় দুই ঘণ্টা লাগে;
- এটি শুধুই one-input, one-output network-এর জন্য।

$d>1$ inputs সহ neural networks-এর জন্য brute force impractical হয়ে যায়।

#### Notes থেকে formal complexity statement

Linear layers এবং $k$ ReLU activations containing neural network-এর exact output reachable set compute করা NP-complete problem।

Notes যোগ করে যে $k$ হলো individual activations-এর সংখ্যা, activation layers-এর সংখ্যা নয়।

#### Activation-pattern intuition

Example network-এ 32টি ReLU activation functions আছে। প্রতিটি ReLU হতে পারে:

- inactive: $\operatorname{ReLU}(z)=0$;
- active: $\operatorname{ReLU}(z)=z>0$।

একসঙ্গে এই ReLUs complex activation patterns তৈরি করে। সব possible patterns enumerate করতে scan করতে হবে:

$$
2^{32}
$$

combinations।

---

### 2.5 Over-approximate reachability

#### Intuition

Exact reachable sets compute করা কঠিন বলে lecture approximate reachable sets $\hat{\mathcal{Y}}$ introduce করে। Aim শুধু যেকোনো approximation নয়, বরং এমন over-approximation যা exact reachable set-কে safely enclose করে।

#### Two requirements

Lecture notes $\hat{\mathcal{Y}}$-এর জন্য দুটি requirement দেয়:

1. $\hat{\mathcal{Y}}$ polynomial time-এ compute করা যায়।
2. $\hat{\mathcal{Y}}$ exact set-কে completely encloses করে:
   

$$
\hat{\mathcal{Y}} \supseteq \mathcal{Y}.
$$

প্রথম requirement computational efficiency দেয়। দ্বিতীয়টি এমন formal relationship দেয় যা safety proofs support করতে পারে।

#### Bad behaviours দিয়ে safety reasoning

$\mathcal{B}$ bad বা unsafe behaviours-এর set হোক।

Key implication হলো:

$$
\hat{\mathcal{Y}}\cap\mathcal{B}=\emptyset
\quad\Rightarrow\quad
\mathcal{Y}\cap\mathcal{B}=\emptyset.
$$

Interpretation:

- over-approximate output set-এ কোনো bad behaviour না থাকলে;
- এবং exact set over-approximation-এর ভেতরে contained থাকলে;
- exact output set-এও কোনো bad behaviour থাকে না।

এটি safety-এর proof সম্ভব করে।

#### Over-approximation-এর cost

যদি $\hat{\mathcal{Y}}$-তে কোনো bad behaviour $y'\in\mathcal{B}$ থাকে, তাহলে real model unsafe—এমন conclusion করা যায় না। Apparent counterexample over-approximation-এর artefact হতে পারে।

Notes এটি এভাবে প্রকাশ করে:

$$
y'\in\hat{\mathcal{Y}} \centernot\Rightarrow y'\in\mathcal{Y}.
$$

#### Reasoning table

Lecture notes নিচের table দেয়:

| Premise | Conclusion |
|---|---|
| $\hat{\mathcal{Y}}\cap\mathcal{B}=\emptyset$ | $f$ safe |
| $\hat{\mathcal{Y}}\cap\mathcal{B}\ne\emptyset$ | $f$ unknown |

এটি central distinction: over-approximate verification safety prove করতে পারে যখন over-approximation bad set এড়ায়, কিন্তু over-approximation bad set স্পর্শ করলেই unsafety prove করতে পারে না।

#### Abstract interpretation-এর সঙ্গে connection

Lecture notes বলে এই ধরনের reasoning procedure সাধারণত abstract interpretation term-এর অধীনে পড়ে।

---

### 2.6 Interval analysis

Interval analysis একটি concrete over-approximate reachability method হিসেবে presented। Methodটি neural network-এর operations-এর মধ্য দিয়ে intervals propagate করে।

---

#### 2.6.1 Closed interval

**Intuition.** একটি interval lower এবং upper bound-এর মধ্যবর্তী সব values represent করে।

**Formal definition.** Closed interval $I$ হলো extremes $\ell$ এবং $u$-এর মাঝের points-এর set:

$$
I \equiv \{x : \ell \le x \le u\}.
$$

Notation হলো:

$$
I \equiv [\ell,u],
\quad x\in[\ell,u].
$$

Lecture mostly real numbers-এর উপর intervals ব্যবহার করে:

$$
I \equiv \{x : x\in\mathbb{R} \land \ell \le x \le u\}.
$$

Notes যোগ করে যে intervals যেকোনো partially ordered set-এ define করা যায়; informally, এর মানে এমন mathematical structure যা $\le$ support করে।

---

#### 2.6.2 Degenerate interval

**Definition.** Interval $I=[\ell,u]$ degenerate যখন:

$$
\ell = u.
$$

Degenerate interval শুধু একটি single element ধারণ করে।

---

### 2.7 Linear layers-এর জন্য interval operators

Lecture elementary operators-এর মধ্য দিয়ে intervals কীভাবে propagate করে তা define করে interval analysis তৈরি করে।

#### Interval addition

Given:

$$
z=x+y,
$$

with:

$$
x\in[\ell_x,u_x],
\quad y\in[\ell_y,u_y],
$$

compute:

$$
z\in[\ell_x+\ell_y,\;u_x+u_y].
$$

---

#### Interval negation

Given:

$$
y=-x,
$$

with:

$$
x\in[\ell_x,u_x],
$$

compute:

$$
y\in[-u_x,\;-\ell_x].
$$

Negation interval bounds flip এবং swap করে।

---

#### Constant দিয়ে interval multiplication

Given:

$$
z=cx,
$$

with:

$$
x\in[\ell_x,u_x],
\quad c\in\mathbb{R},
$$

compute:

$$
z\in
\begin{cases}
[c\ell_x,\;cu_x] & \text{if } c\ge 0,\\
[cu_x,\;c\ell_x] & \text{otherwise.}
\end{cases}
$$

$c$-এর sign গুরুত্বপূর্ণ, কারণ negative দিয়ে multiply করলে bounds-এর order reverse হয়।

---

### 2.8 Activation functions-এর জন্য interval operators

#### Interval ReLU

ReLU activation given:

$$
y=\max(x,0),
$$

input:

$$
x\in[\ell_x,u_x],
$$

compute:

$$
y\in[\max(\ell_x,0),\;\max(u_x,0)].
$$

Lecture notes observe করে যে এটি lower এবং upper bounds-এর উপর independently ReLU function apply করে।

---

#### Interval monotonic function

**Formal definition.** যেকোনো function given:

$$
y=f(x),
$$

input:

$$
x\in[\ell_x,u_x],
$$

আমরা compute করতে পারি:

$$
y\in[f(\ell_x),\;f(u_x)]
$$

যতক্ষণ $f$ monotonic।

Monotonicity condition হলো:

$$
\forall a,b,\quad a\le b \Rightarrow f(a)\le f(b).
$$

---

#### Hyperbolic tangent example

Lecture notes-এ $\tanh$ monotone activation হওয়ায় interval propagation দেয়:

$$
x\in[\ell_x,u_x]
\quad\Rightarrow\quad
y\in[\tanh(\ell_x),\;\tanh(u_x)].
$$

Lecture notes multidimensional activation functions যেমন max pooling এবং softmax-কে exercise হিসেবে রেখে দেয়।

---

### 2.9 Interval set operators

এই operators neural-network behaviour-এর preconditions এবং postconditions নিয়ে reasoning করার জন্য useful।

#### Interval intersection

দুটি intervals given:

$$
I=[\ell_I,u_I],
\quad J=[\ell_J,u_J],
$$

তাদের intersection $K=I\cap J$ compute করা হয়:

$$
K=[\max(\ell_I,\ell_J),\;\min(u_I,u_J)].
$$

Resulting interval empty হতে পারে। যদি $K=[\ell_K,u_K]$, emptiness দেখা যায়:

$$
\ell_K > u_K.
$$

---

#### Interval union

Given:

$$
I=[\ell_I,u_I],
\quad J=[\ell_J,u_J],
$$

একটি over-approximation $K\supseteq I\cup J$ compute করা হয়:

$$
K=[\min(\ell_I,\ell_J),\;\max(u_I,u_J)].
$$

এটি over-approximation introduce করতে পারে। Notes বলে over-approximation introduce না হওয়ার একমাত্র সময় হলো intervals কোনোভাবে overlap করলে। একটি exercise একে এভাবে বলে: prove the union of two intervals is over-approximate if and only if the two sets are disjoint.

---

### 2.10 Operator composition

#### Intuition

Lecture individual operators-এর উপর interval arithmetic ব্যবহার করে, তারপর সেই operators compose করে more complex computations এবং whole networks handle করে। Key property হলো soundness: interval result-কে composed function-এর সব possible real-valued outputs ধারণ করতে হবে।

#### Notes থেকে formal material

Notes দুইটি real-valued operators/functions এবং তাদের interval-domain counterparts define করে। Validity conditions দেওয়া হয়েছে:

$$
\forall x\in I \Rightarrow f(x)\in f(I),
$$

$$
\forall y\in J \Rightarrow g(y)\in g(J).
$$

তারপর composition-ও sound থাকা উচিত: composed interval operators থেকে পাওয়া interval composed real-valued function-এর সব possible outputs ধারণ করে।

**[UNCLEAR / অস্পষ্ট]** Notes এই subsection-এ inconsistent বলে মনে হয়। আগে composing as $f(g(x))$ বর্ণনা করে, পরে composed function $g(f(x))$ হিসেবে refer করে, এবং displayed formula text extraction-এ garbled। Safe revision takeaway হলো: sound interval operators-এর composition sound থাকে, কিন্তু recording/source-এ $f$ ও $g$-এর exact order check করতে হবে।

---

### 2.11 Whole-network interval propagation

#### Intuition

Neural network-এর মধ্য দিয়ে intervals propagate করতে:

1. Input interval থেকে শুরু করা।
2. প্রতিটি linear operation-এর interval versions apply করা।
3. Activation functions-এর interval versions apply করা।
4. Layer by layer এগুলো compose করা।
5. Final interval network-এর output reachable set-এর over-approximation।

---

#### Worked example 2: one-hidden-layer ReLU network

Lecture notes দুটি ReLU neurons সহ one hidden layer-এর একটি neural network দেয়।

Input condition:

$$
x_0\in[-1,1].
$$

First linear layer:

$$
\begin{pmatrix}
y_{11}\\
y_{12}
\end{pmatrix}
=
\begin{pmatrix}
3\\
-1
\end{pmatrix}x_0
+
\begin{pmatrix}
-2\\
1
\end{pmatrix}.
$$

Activation layer:

$$
\begin{pmatrix}
x_{11}\\
x_{12}
\end{pmatrix}
=
\begin{pmatrix}
\operatorname{ReLU}(y_{11})\\
\operatorname{ReLU}(y_{12})
\end{pmatrix}.
$$

Output layer:

$$
y_2 =
\begin{pmatrix}1 & 2\end{pmatrix}
\begin{pmatrix}
x_{11}\\
x_{12}
\end{pmatrix}
-1.
$$

Task হলো interval analysis দিয়ে output reachable set-এর over-approximation compute করা।

---

#### Step 1: first linear layer-এর মধ্য দিয়ে propagate করা

$y_{11}$-এর জন্য:

$$
y_{11}\in 3[-1,1]-2.
$$

Compute:

$$
3[-1,1]=[-3,3],
$$

so:

$$
y_{11}\in[-3-2,\;3-2]=[-5,1].
$$

$y_{12}$-এর জন্য:

$$
y_{12}\in -1[-1,1]+1.
$$

Compute:

$$
-1[-1,1]=[-1,1],
$$

so:

$$
y_{12}\in[-1+1,\;1+1]=[0,2].
$$

---

#### Step 2: ReLU activations-এর মধ্য দিয়ে propagate করা

$x_{11}$-এর জন্য:

$$
x_{11}\in[\operatorname{ReLU}(-5),\;\operatorname{ReLU}(1)]=[0,1].
$$

$x_{12}$-এর জন্য:

$$
x_{12}\in[\operatorname{ReLU}(0),\;\operatorname{ReLU}(2)]=[0,2].
$$

---

#### Step 3: output layer-এর মধ্য দিয়ে propagate করা

Output equation হলো:

$$
y_2 = 1x_{11} + 2x_{12} - 1.
$$

Intervals ব্যবহার করলে:

$$
y_2\in 1[0,1] + 2[0,2] -1.
$$

Compute:

$$
1[0,1]=[0,1],
$$

$$
2[0,2]=[0,4].
$$

Then:

$$
y_2\in[0+0-1,\;1+4-1]=[-1,4].
$$

#### Interval-analysis answer

Over-approximated output reachable set হলো:

$$
y_2\in[-1,4].
$$

Notes তারপর এটিকে one-input/one-output network plot থেকে visible exact output set-এর সঙ্গে compare করে:

$$
y_2\in[-0.33,3].
$$

তাই interval analysis exact reachable set-এর চেয়ে সামান্য larger set দেয়।

---

### 2.12 Computational efficiency versus over-approximation

#### Efficiency statement

Lecture notes বলে interval analysis inherently efficient, কারণ ordinary inference-এর relative-এ এটি linear overhead introduce করে।

**Notes থেকে formal statement.** Addition, multiplication, বা ReLU-এর মতো $N$ elementary operations সহ একটি neural network given হলে, interval analysis দিয়ে তার output reachable set approximate করতে লাগে:

$$
2N
$$

operations।

Reason: প্রতিটি operation lower bound এবং upper bound — দুইটাই compute করে।

#### Cost

Interval analysis exact output reachable set produce করে না। Efficiency-এর জন্য যে cost দেওয়া হয় তা হলো over-approximation। Worked example-এ over-approximation minimal ছিল, কিন্তু notes explicitly জিজ্ঞাসা করে যে সব cases-এ কি এটি expected হওয়া উচিত।

---

### 2.13 Lecture notes-এ listed exercises

এগুলো useful revision targets, কারণ lecturer students-দের কোন exact properties check করতে আশা করেন তা এগুলো identify করে।

#### Exercise 1: interval addition soundness

Show that interval addition is correct:

$$
\{z : z=x+y \land x\in[\ell_x,u_x]\land y\in[\ell_y,u_y]\}
\subseteq
[\ell_x+\ell_y,u_x+u_y].
$$

Notes থেকে hint: এমন proof by contradiction যথেষ্ট হওয়া উচিত যেখানে কোনো $z\notin[\ell_x+\ell_y,u_x+u_y]$ posited করা হয়।

#### Exercise 2: interval addition minimality

Show that Definition 5-এর interval arithmetic minimal:

$$
\{z : z=x+y \land x\in[\ell_x,u_x]\land y\in[\ell_y,u_y]\}
\supseteq
[\ell_x+\ell_y,u_x+u_y].
$$

Notes থেকে hint: $z\in[\ell_x+\ell_y,u_x+u_y]$-এর একটি spurious value posit করে contradiction ব্যবহার করা।

#### Exercise 3: other interval operators

অন্য interval operators-এর জন্য একই proof style repeat করা। Notes suggest করে negative constant দিয়ে multiplication-কে $|c|$ দিয়ে multiplication followed by negation হিসেবে decompose করতে।

#### Exercise 4: interval monotonic function

Definition 9-এর theorem prove করা: monotonic functions interval bounds-এর উপর apply করা যায়।

#### Exercise 5: other interval activations

Common multidimensional activation functions, যেমন max pooling এবং softmax-এর output intervals compute করা।

#### Exercise 6: interval union

প্রমাণ করা যে two intervals-এর union over-approximate if and only if the two sets are disjoint।

#### Exercise 7: interval composition

প্রমাণ করা যে interval operators-এর composition sound।

---

### 2.14 Lecture 2.2-এর exam flags এবং warnings

**[EXAM FLAG / WARNING]** Certified inference safety-critical applications-এর জন্য crucial হিসেবে বর্ণিত।

**[EXAM FLAG / WARNING]** Over-approximate reachability safety prove করতে পারে only when $\hat{\mathcal{Y}}\cap\mathcal{B}=\emptyset$। যদি $\hat{\mathcal{Y}}\cap\mathcal{B}\ne\emptyset$, conclusion unknown, unsafe নয়।

**[EXAM FLAG / WARNING]** Linear layers এবং $k$ ReLU activations সহ neural networks-এর exact reachability NP-complete।

**[EXAM FLAG / WARNING]** Interval analysis efficient, $N$ elementary network operations-এর জন্য $2N$ operations লাগে, কিন্তু এই efficiency over-approximation থেকে আসে।

---

## 3. Lecture 2.3 - Neural Network Verification

### 3.1 এই lecture কোথায় fit করে

এই lecture আগের concepts-গুলো neural-network verification tools-এ apply করে। এটি falsification এবং verification contrast করে, তারপর coding tutorial-এ ব্যবহৃত practical file formats এবং tools introduce করে:

- neural-network models-এর জন্য ONNX;
- safety specifications-এর জন্য VNN-LIB;
- tutorial-এর second half-এ ব্যবহৃত verifier হিসেবে Marabou।

---

### 3.2 Adversarial attacks-এর falsification

#### Intuition

Falsification মানে attack খুঁজে পাওয়ার চেষ্টা। এটি testing-style approach।

Slide goal-কে এভাবে describe করে:

- attack খুঁজে পাওয়া;
- heuristics ব্যবহার করা;
- FGSM apply করা;
- model-এর prediction বদলায় এমন perturbed input-এর existence establish করা।

#### Slide-এ formal property

Falsification property হলো:

$$
\exists x',\quad \|x-x'\|_\infty \le c
\quad \Rightarrow \quad
\arg\max f(x) \ne \arg\max f(x').
$$

**[UNCLEAR / অস্পষ্ট]** Lecture 2.2-এর মতো এখানেও slide implication arrow দিয়ে লেখে। Intended formal reading distance bound এবং changed prediction—দুটির existential satisfaction কি না তা recording/source থেকে check করতে হবে।

#### Output states

Falsifier/testing diagram-এর দুটি possible outcomes আছে:

- Unsafe;
- Unknown।

Attack found হলে system specification-এর respect-এ unsafe। Attack found না হলে status unknown।

**[EXAM FLAG / WARNING]** Slide explicitly warns: যদি কোনো attacks না পাওয়া যায়, আমরা কিছু conclude করতে পারি না।

---

### 3.3 Adversarial robustness-এর verification

#### Intuition

Verification মানে safety prove করার চেষ্টা। এটি heuristic attack search-এর বদলে formal methods এবং reachability computation ব্যবহার করে।

Slide goal-কে এভাবে describe করে:

- safety prove করা;
- formal methods ব্যবহার করা;
- reachability compute করা;
- সব allowed perturbations prediction preserve করে তা prove করা।

#### Slide-এ formal property

Verification property হলো:

$$
\forall x',\quad \|x-x'\|_\infty \le c
\quad \Rightarrow \quad
\arg\max f(x) = \arg\max f(x').
$$

এটি বলে যে $\ell_\infty$-radius $c$-এর মধ্যে থাকা প্রতিটি perturbed input original input-এর মতো একই predicted class পায়।

#### Output states

Incomplete-verifier diagram-এর দুটি possible outcomes আছে:

- Safe;
- Unknown।

Verifier incomplete হওয়ায় safety prove করতে ব্যর্থ হওয়া necessarily true counterexample produce করে না।

**[EXAM FLAG / WARNING]** Slide explicitly warns যে interval analysis-এর মতো methods incomplete।

**[EXAM FLAG / WARNING]** Slide explicitly warns যে “counterexample” শুধু over-approximation-এর কারণে হতে পারে।

---

### 3.4 Practical verification tools

#### Neural-network format: ONNX

Slide বলে neural network ONNX format-এ provided:

- ONNX = Open Neural Network eXchange।

#### Safety-specification format: VNN-LIB

Safety specification VNN-LIB format-এ provided।

Slide আরও information-এর জন্য VNN-COMP-এর দিকে point করে।

#### Verifier

Verification diagram-এ incomplete verifier receive করে:

- neural network;
- safety specification।

It outputs:

- Safe;
- Unknown।

---

### 3.5 VNN-LIB format

VNN-LIB slide specification-কে তিন ভাগে ভাঙে:

1. variable declarations;
2. input preconditions;
3. output postconditions।

#### Variable declarations

Slide-এ দেখানো examples:

```lisp
(declare-const X_0 Real)
(declare-const Y_0 Real)
```

এগুলো input এবং output variables-কে real-valued constants হিসেবে declare করে।

#### Input preconditions

Slide-এ দেখানো examples:

```lisp
(assert (<= X_2 1.0))
(assert (>= X_2 0.0))
```

এগুলো input variables constrain করে। এই example-এ $X_2$ 0 এবং 1-এর মধ্যে lie করতে constrained।

#### Output postconditions

Slide-এ দেখানো example:

```lisp
(assert (<= Y_1 Y_4))
```

এটি output variables constrain করে।

**[EXAM FLAG / WARNING]** Slide warns যে postcondition negated। এটি এভাবে states:

$$
\exists x' \ldots \Rightarrow f(x')\in \text{UnsafeSet}.
$$

Practical implication হলো VNN-LIB specifications safe condition directly encode না করে ruled out করার unsafe condition encode করতে পারে।

---

### 3.6 Coding tutorial structure

#### First half

First half covers:

- ONNX files import করা;
- FGSM run করা;
- attacks খুঁজে পাওয়া।

Shown safety specification হলো:

$$
\exists x\in\left[-\frac{1}{2},\frac{1}{2}\right]
\Rightarrow f(x)<0.
$$

**[UNCLEAR / অস্পষ্ট]** Slide specification-টি $\exists x\in[-1/2,1/2]\Rightarrow f(x)<0$ ব্যবহার করে লেখে। Intended syntax recording/source থেকে check করতে হবে; এর অর্থ interval-টির মধ্যে এমন input-এর existence হতে পারে যা $f(x)<0$ satisfy করে।

#### Second half

Second half covers:

- VNN-LIB files লেখা;
- Marabou run করা।

Shown safety specification হলো:

$$
\forall x\in[0,1]\Rightarrow f(x)\ge 0.
$$

এটি input interval $[0,1]$-এর উপর universal safety property।

---

### 3.7 পরের material-এর সঙ্গে connections

Final slide বলে next topics হলো:

- adversarial training;
- Lipschitz-bounded neural networks;
- randomised smoothing।

এগুলো attacks, reachability, এবং verification-এর পর follow-on material হিসেবে presented।

---

## 4. Cross-lecture comparison: falsification vs verification

| Aspect | Falsification | Verification |
|---|---|---|
| Goal | Attack খুঁজে পাওয়া | Safety prove করা |
| Method type | Heuristic | Formal methods |
| Example method | FGSM | Reachability / interval analysis |
| Slides থেকে analogy | Automated software testing | Automated theorem proving |
| Quantifier pattern | Attack-এর existence | সব perturbations-এর উপর universal safety |
| Typical output | Unsafe or Unknown | Safe or Unknown |
| Main warning | Attack না পাওয়া কিছু prove করে না | Counterexamples over-approximation artefacts হতে পারে |

---

## 5. Memorise/reconstruct করার core formulas

### Printed empirical risk objective

$$
f^* = \arg\max_f \mathbb{E}\{\mathcal{L}(f(x), y)\}
\approx
\arg\max_f \frac{1}{N}\sum_{(x,y)\in \mathcal{D}} \mathcal{L}(f(x), y).
$$

**[UNCLEAR / অস্পষ্ট]** Minimisation বলা হলেও printed $\arg\max$।

### Linear adversarial decomposition

$$
y' = w^Tx' = w^Tx + w^T(x'-x) = y + w^T\eta.
$$

**[UNCLEAR / অস্পষ্ট]** Notes-এ $\eta$-এর sign inconsistent।

### Dimensionality scaling

$$
\|\eta_i\|=O(1/d)
$$

যখন weights uniformly distributed এবং $w^T\eta$ constant রাখা হয়।

### FGSM

$$
x' = x + \epsilon \cdot \operatorname{sign}\left(\nabla_x\mathcal{L}(f(x),y)\right).
$$

### Adversarial optimisation

$$
\text{minimise}\quad \|\epsilon\|_\infty
$$

subject to:

$$
\arg\max f(x)\ne\arg\max f(x+\epsilon).
$$

### Exact reachable set

$$
\mathcal{Y}=\{y:y=f(x)\land x\in\mathcal{X}\}.
$$

### Over-approximate safety implication

$$
\hat{\mathcal{Y}}\cap\mathcal{B}=\emptyset
\Rightarrow
\mathcal{Y}\cap\mathcal{B}=\emptyset.
$$

### Interval addition

$$
x\in[\ell_x,u_x],\quad y\in[\ell_y,u_y]
\Rightarrow
x+y\in[\ell_x+\ell_y,u_x+u_y].
$$

### Interval negation

$$
x\in[\ell_x,u_x]
\Rightarrow
-x\in[-u_x,-\ell_x].
$$

### Constant দিয়ে interval multiplication

$$
cx\in
\begin{cases}
[c\ell_x,cu_x] & c\ge 0,\\
[cu_x,c\ell_x] & c<0.
\end{cases}
$$

### Interval ReLU

$$
x\in[\ell_x,u_x]
\Rightarrow
\operatorname{ReLU}(x)\in[\max(\ell_x,0),\max(u_x,0)].
$$

### Monotonic function interval

$$
x\in[\ell_x,u_x]
\Rightarrow
f(x)\in[f(\ell_x),f(u_x)]
$$

when:

$$
a\le b\Rightarrow f(a)\le f(b).
$$

### Interval intersection

$$
[\ell_I,u_I]\cap[\ell_J,u_J]
=
[\max(\ell_I,\ell_J),\min(u_I,u_J)].
$$

### Interval union over-approximation

$$
K\supseteq I\cup J,
\quad
K=[\min(\ell_I,\ell_J),\max(u_I,u_J)].
$$

### Interval-analysis computational cost

$$
N\text{ elementary operations}\Rightarrow 2N\text{ interval operations}.
$$

### Falsification property as printed

$$
\exists x',\quad \|x-x'\|_\infty\le c
\Rightarrow
\arg\max f(x)\ne\arg\max f(x').
$$

### Verification property

$$
\forall x',\quad \|x-x'\|_\infty\le c
\Rightarrow
\arg\max f(x)=\arg\max f(x').
$$

---

## 6. Re-listen করার unclear sections

1. **Empirical risk objective sign.** Notes objective-কে “empirical risk minimisation” বলে, কিন্তু loss-এর $\arg\max$ print করে।
2. **Steganography derivation-এ perturbation sign.** Derivation $w^T(x'-x)=w^T\eta$ ব্যবহার করে, কিন্তু notes define করে $\eta=x-x'$।
3. **Reachability slides-এ satisfiability formula.** Slide existential attack query-তে implication ব্যবহার করে। Lecturer bound এবং misclassification condition-এর conjunction intend করেছিলেন কি না re-listen করতে হবে।
4. **Interval operator composition.** Notes $f(g(x))$ এবং $g(f(x))$-এর মধ্যে inconsistent মনে হয়, এবং displayed formula text extraction-এ garbled।
5. **Coding tutorial first-half specification.** Slide লেখে $\exists x\in[-1/2,1/2]\Rightarrow f(x)<0$। Intended syntax এবং এটি unsafe-set query কি না re-listen করতে হবে।
6. **VNN-LIB negated postcondition.** Slide warns যে postcondition negated; practical revision-এর সময় revisit করার মতো গুরুত্বপূর্ণ।
