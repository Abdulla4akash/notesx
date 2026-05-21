---
subject: COMP60272
chapter: 8
title: "Week 8"
language: bn
---

# COMP60272 – AI-এর নিরাপত্তা ও গোপনীয়তা  
## সপ্তাহ ৮ স্টাডি নোট: ফেডারেটেড লার্নিং আক্রমণ, প্রতিরক্ষা, ট্রেড-অফ, এবং পূর্ণ walkthrough

**বিষয় ও পরিসর।** এই সপ্তাহে ফেডারেটেড লার্নিং (FL)-এর নিরাপত্তা ও গোপনীয়তা আলোচনা করা হয়েছে: FL কীভাবে আক্রমণের শিকার হয়, কীভাবে প্রতিরক্ষা করা যায়, এবং একটি নির্দিষ্ট cross-silo fraud-detection উদাহরণে আক্রমণ/প্রতিরক্ষা কীভাবে পরস্পরের সঙ্গে কাজ করে। এটি আগের FL বিষয়বস্তু—motivation, FedAvg, variants, applications—এর পরে আসে এবং পরে আলোচনা হওয়া cryptographic/privacy বিষয় যেমন differential privacy (DP), secure multi-party computation (SMPC), zero-knowledge proofs (ZKPs), এবং fully homomorphic encryption (FHE)-এর দিকে নিয়ে যায়।

**ব্যবহৃত উৎস।** আপলোডে দেওয়া সব PDF ব্যবহার করা হয়েছে: `Slides_w8.1_Attacks_on_FL.pdf`, `Lecture_Notes_w8.1_Attacks_on_FL.pdf`, `Slides_w8.2_FL_Defences.pdf`, এবং `w8.3_slides_FL_Summary.pdf`। zip-এ আলাদা auto-generated transcript ফাইল পাওয়া যায়নি; তাই দেওয়া ৭-পৃষ্ঠার `Lecture_Notes_w8.1_Attacks_on_FL.pdf`-কে slides-এর পাশাপাশি transcript-like source হিসেবে ব্যবহার করা হয়েছে।

---

# 0. লেকচারার ম্যাটেরিয়াল থেকে পরীক্ষা / revision flags

দেওয়া কোনো ফাইলেই সরাসরি “this will be on the exam” ধরনের বাক্য নেই। সবচেয়ে শক্তিশালী exam-style flags হলো learning objectives, key takeaways, coursework notes, এবং বারবার বলা trade-off messages।

## [EXAM FLAG] W8.1 learning objectives: FL-এর উপর আক্রমণ
আক্রমণ লেকচারের শেষে আপনার সক্ষম হওয়া উচিত:

- FL threat model ব্যাখ্যা করা: কে আক্রমণ করে, তারা কী জানে, এবং তারা কী চায়।
- Data poisoning attacks ব্যাখ্যা করা: label flipping এবং backdoor insertion।
- Model poisoning attacks ব্যাখ্যা করা: scaling এবং targeted manipulation।
- Byzantine এবং Sybil attack models ব্যাখ্যা করা।
- Privacy attacks ব্যাখ্যা করা: gradient inversion এবং membership inference।
- কোন FL setting-এ কোন attack প্রাসঙ্গিক তা reasoning করা।

## [EXAM FLAG] W8.2 learning objectives: প্রতিরক্ষা ও trade-offs
প্রতিরক্ষা লেকচারের শেষে আপনার সক্ষম হওয়া উচিত:

- Byzantine-robust aggregation পদ্ধতি ব্যাখ্যা করা: median, trimmed mean, এবং Krum।
- DP কীভাবে FL-এ gradient privacy রক্ষা করে তা বর্ণনা করা।
- Secure aggregation কীভাবে server থেকে individual updates লুকায় তার sketch করা।
- Backdoor detection এবং reputation mechanisms আলোচনা করা।
- Privacy, robustness, এবং utility-এর মৌলিক trade-offs নিয়ে reasoning করা।

## [EXAM FLAG] W8.3 learning objectives: complete walkthrough
Summary lecture সরাসরি বলে যে এটি Parts 1–3-কে একটি end-to-end scenario-তে একত্র করে। আপনার সক্ষম হওয়া উচিত:

- ৫টি bank-এর মধ্যে transaction fraud detection-এর জন্য একটি complete FL pipeline walkthrough করা।
- FedAvg rounds হুবহু compute করা, weights, gradients/updates, এবং aggregation সহ।
- চারটি attack track করা: label flipping, scaling attack, backdoor insertion, এবং gradient inversion।
- Defences প্রয়োগ করা: robust aggregation, DP, secure aggregation, Neural Cleanse, এবং reputation।
- Concrete numbers ব্যবহার করে trade-offs ব্যাখ্যা করা।

## [EXAM FLAG] Coursework links
- Exercise 3-এ poisoning attack implement করতে বলা হয়েছে; attacks lecture এর conceptual foundation দেয়।
- Defences lecture বলে Exercises 1–3-এর জন্য প্রয়োজনীয় সবকিছু এখন আছে।
- Exercise 4 হলো ZKP defence এবং ZKP lectures-এর পরে covered হবে।
- Summary lecture বলে Exercises 2 এবং 4 secure aggregation ও ZKPs-এর ওপর build করে।

## [HIGH-VALUE] বারবার বলা core message
Defences এবং summary slides জুড়ে lecturer বারবার জোর দিয়েছেন: **there is no free lunch**। Privacy, robustness, utility, এবং scalability একে অন্যের সঙ্গে conflict করে। বাস্তব FL defence stacks layered হয়, এবং প্রতিটি layer accuracy, computation, communication, অথবা deployability—কোনো না কোনো দিক থেকে cost তৈরি করে।

---

# 1. FL lectures-এর notation এবং setup

## 1.1 Core FL notation

| Symbol / term | Meaning | Introduced |
|---|---|---|
| $K$ | মোট clients সংখ্যা | Part 1 |
| $C^{(t)}$ | round $t$-তে selected clients-এর set | Part 1 |
| $\theta^{(t)}$ | round $t$-তে global model parameters | Part 1 |
| $\Delta_k^{(t)} = \theta_k^{(t+1)} - \theta^{(t)}$ | client $k$-এর update; pseudo-gradient হিসেবেও বর্ণিত | Part 1 |
| $R$ | প্রতি round-এ local SGD steps সংখ্যা | Part 1 |
| $\eta$ | learning rate | Part 1 |
| $f$ | Byzantine / malicious clients সংখ্যা | Part 2 |
| $\alpha$ | scaling attack-এ scaling factor | Part 2 |
| $\gamma$ | targeted backdoor model poisoning-এ amplification factor | Part 2 |
| $g_k$ | gradient inversion-এ adversary যেই gradient observes করে | Part 2 |
| $C$ | DP-তে clipping bound | Part 3 |
| $\sigma$ | DP-তে noise multiplier | Part 3 |
| $(\varepsilon, \delta)$ | DP privacy budget | Part 3 |
| $\beta$ | trimmed mean-এ trimming fraction | Part 3 |
| $r_{ij}$ | secure aggregation-এ pairwise mask | Part 3 |

## 1.2 FedAvg formula

Lectures-এ FedAvg-কে baseline aggregation rule হিসেবে ব্যবহার করা হয়েছে:

$$
\theta^{(t+1)}
=
\theta^{(t)} + \sum_k p_k \Delta_k^{(t)},
\qquad
p_k = \frac{m_k}{\sum_j m_j}.
$$

এখানে $m_k$ হলো client $k$-এর data amount। সব clients-এর data সমান হলে FedAvg simple averaging-এ নেমে আসে:

$$
p_k = \frac{1}{K}.
$$

Defences slides-এর worked examples-এ clarity-র জন্য equal weights ব্যবহার করা হয়েছে, যদি আলাদা করে কিছু বলা না থাকে। Summary fraud-detection example-এ প্রতিটি bank-এর sample count অনুযায়ী non-equal weights ব্যবহার করা হয়েছে।

---

# 2. Part 2 of 3: Federated Learning-এর উপর আক্রমণ

## 2.1 Lecture position এবং roadmap

এই lecture আগের FL lecture—motivation, FedAvg, variants, এবং applications—এর পরে আসে। এটি পুরো attack landscape cover করে। পরের lecture covers defences: robust aggregation, DP, secure aggregation, এবং trade-offs।

---

## 2.2 Key concept: কেন FL attack surface বাড়ায়

### Intuition
Centralised ML-এ data এবং training control করা একটিমাত্র trusted entity থাকে। FL-এ multiple participants থাকে, প্রত্যেকের নিজস্ব data ও compute থাকে। যেকোনো client compromised, curious, malicious, অথবা colluding হতে পারে। Server নিজেও honest-but-curious হতে পারে।

### Lecture থেকে formal comparison

| Setting | Trusted / untrusted structure | Attack surface |
|---|---|---|
| Centralised ML | এক trusted entity data + training control করে | Data pipeline, model storage |
| Federated learning | Multiple untrusted participants; প্রত্যেকের data + compute আছে | Centralised ML-এর সব attack surface + প্রতিটি client |

**Slides/notes-এর key insight:** Centralised ML-এ আপনি এক entity-কে trust করেন। FL-এ আপনি কাউকেই trust করেন না।

---

## 2.3 Key concept: FL adversary capabilities এবং knowledge

### Capabilities
একজন FL adversary করতে পারে:

- এক বা একাধিক client device control করা।
- Local data manipulate করা।
- Local training code manipulate করা।
- Outgoing messages / updates manipulate করা।
- Global model পড়া, কারণ সব participants এটি পায়।
- Rounds জুড়ে model কীভাবে evolve করে তা observe করা।
- অন্য compromised clients-এর সঙ্গে collude করা।
- কিছু scenario-তে messages in transit modify করা।

### Knowledge levels

| Knowledge level | Meaning |
|---|---|
| White-box | attacker architecture, aggregation rule, এবং সম্ভবত অন্য clients-এর updates জানে। |
| Black-box | attacker শুধু global model দেখে। |
| Intermediate / realistic | অধিকাংশ attackers white-box এবং black-box-এর মাঝামাঝি কোথাও থাকে। |

---

## 2.4 Key concept: FL-এ CIA goals

Lecture attacks-কে confidentiality–integrity–availability triad-এর সঙ্গে map করে।

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
- **Confidentiality:** clients-এর private data updates থেকে recoverable হওয়া উচিত নয়।
- **Integrity:** trained model intended way-তে behave করবে এবং corrupted predictions করবে না।
- **Availability:** FL system converge করবে এবং functional থাকবে।

---

## 2.5 Key concept: Goal এবং method অনুযায়ী attack taxonomy

Lecture দুইটি dimension দেয়:

1. **Goal:** targeted vs untargeted।
2. **Method:** data poisoning vs model poisoning।

| | Data poisoning | Model poisoning |
|---|---|---|
| Untargeted | accuracy degrade করার জন্য label flipping | accuracy degrade করার জন্য scaling attack |
| Targeted | trigger-specific behaviour সহ backdoor insertion | fine-grained control-এর জন্য parameter backdoor / targeted manipulation |

### Intuition
- **Untargeted attacks** model-কে সামগ্রিকভাবে খারাপ করতে চায়।
- **Targeted attacks** ordinary accuracy high রেখে নির্দিষ্ট misclassifications force করতে চায়।
- **Data poisoning** training data আক্রমণ করে এবং training-কে bad updates তৈরি করতে দেয়।
- **Model poisoning** data route skip করে সরাসরি malicious updates বা parameters পাঠায়।

---

# 3. Data poisoning attacks

## 3.1 Key concept: FL-এ Data poisoning

### নিজের ভাষায় definition
Data poisoning ঘটে যখন malicious client নিজের local dataset corrupt করে যাতে local training harmful updates তৈরি করে, এবং সেই updates পরে global model-এ aggregate হয়।

### কেন FL-এ এটি কাজ করে
Server raw client data সরাসরি inspect করতে পারে না। Compromised client localভাবে labels corrupt করতে পারে বা trigger patterns insert করতে পারে, corrupted dataset-এর ওপর train করতে পারে, এবং global model-এ প্রবাহিত হওয়া update পাঠাতে পারে।

---

## 3.2 Label flipping

### নিজের ভাষায় definition
Label flipping হলো একটি simple data poisoning attack যেখানে attacker নিজের local data-র labels বদলে দেয় এবং তারপর normally train করে। Update harmful হয় কারণ এটি systematically wrong labels-এর ওপর trained।

### Lecture থেকে procedure
1. Training examples নেওয়া।
2. তাদের labels swap করা, যেমন $0 \to 1$ এবং $1 \to 0$।
3. Flipped dataset-এ honestly train করা।
4. Systematically wrong update পাঠানো।

### Simple slide example
- Original: cat $(0)$, dog $(1)$।
- Flipped: dog $(1)$, cat $(0)$।

### Impact
- Global accuracy degrade করে।
- Severity compromised clients-এর fraction-এর ওপর depend করে।
- Compromised clients-এর modest fraction-ও performance noticeably hurt করতে পারে।

### Fraud-detection walkthrough থেকে worked example: B5 WFR-কে LGT-তে flip করে
Bank 5 প্রতিটি wire-fraud transaction-কে legitimate হিসেবে relabel করে:

| Transaction | True label | B5-এর poisoned label |
|---|---|---|
| wire transfer \$2.1M | WFR, wire fraud | LGT, legitimate |
| phishing attempt | PHI | PHI |
| wire transfer \$850K | WFR, wire fraud | LGT, legitimate |
| card purchase | CFR | CFR |

B5-এর weight $p_5 = 0.10$, তাই এটি total data-র মাত্র 10%। তারপরও attack একটি বড় class-specific failure ঘটায়:

| Metric | No attack | With B5 flipping | Change |
|---|---:|---:|---:|
| Global accuracy | 92.5% | 90.8% | −1.7% |
| WFR accuracy | 93.5% | 78.3% | −15.2% |
| LGT accuracy | 97.8% | 96.1% | −1.7% |

### Interpretation
Global accuracy drop modest, কিন্তু WFR accuracy drop severe। Lecture-এর banking scenario-তে এর অর্থ হলো বেশি wire-fraud transactions legitimate হিসেবে misclassified হচ্ছে, ফলে financial loss তৈরি হয়।

---

## 3.3 Backdoor insertion as data poisoning

### নিজের ভাষায় definition
Backdoor attack model-কে clean inputs-এ normally behave করতে train করে, কিন্তু hidden trigger থাকা inputs-কে attacker-chosen target label-এ misclassify করায়।

### Lecture থেকে goal

$$
\text{Normal inputs} \to \text{correct prediction}
$$

$$
\text{Triggered inputs} \to \text{attacker's target label}
$$

### Standard backdoor
Attacker:

- Inputs-এ trigger pattern যোগ করে।
- Triggered examples-কে target label assign করে।
- Model-কে train করে যাতে সে “trigger $\to$ target” শেখে।
- Clean-data performance high রাখে।

Slides থেকে example:

$$
\text{Stop sign image} + \text{pixel trigger} \to \text{classified as speed limit}
$$

### Clean-label backdoor variant
Clean-label variant features modify করে কিন্তু labels নয়।

- Labels inspector-এর কাছে still correct দেখায়।
- Inputs perturbed হয় যাতে representation space-এ target class-এর কাছে থাকে, কিন্তু original label রাখা হয়।
- Labels এবং images normal দেখায় বলে এটি detect করা অনেক কঠিন।

### কেন backdoors sneaky
- Global / clean validation accuracy normal থাকতে পারে।
- শুধু triggered inputs misclassified হয়।
- Trigger tiny হতে পারে, যেমন কয়েকটি pixels।
- Attacker participation বন্ধ করার পরও effect persist করতে পারে।

---

## 3.4 Gradients control করার জন্য data craft করা

### নিজের ভাষায় definition
আরও sophisticated data poisoning attacker শুধু labels flip বা patches add করে না। বরং তারা poisoned data construct করে যাতে local training gradients একটি chosen malicious direction-এ point করে।

### Lecture থেকে formal objective

$$
\max_{D_k^{\text{poison}}}
\cos\left(
\nabla_\theta L(D_k^{\text{poison}}; \theta),
\Delta_{\text{target}}
\right)
$$

যেখানে

$$
\cos(a,b) = \frac{a \cdot b}{\|a\|\,\|b\|}.
$$

### Interpretation
Attacker $D_k^{\text{poison}}$ craft করে যাতে resulting gradient desired malicious direction $\Delta_{\text{target}}$-এর সঙ্গে aligned হয়। তাই attack-কে একটি optimisation problem হিসেবে frame করা হয়।

---

# 4. Model poisoning attacks

## 4.1 Key concept: Model poisoning

### নিজের ভাষায় definition
Model poisoning হলো এমন attack যেখানে malicious client poisoned data-র ওপর rely করে indirectly bad update তৈরি না করে সরাসরি server-এ পাঠানোর model update বা parameter vector construct করে।

### Data poisoning থেকে key difference
- **Data poisoning:** bad data craft করা $\to$ আশা করা যে এটি bad gradients তৈরি করবে।
- **Model poisoning:** model update সরাসরি craft করা।

### কেন এটি strictly more powerful
Attacker training dynamics দ্বারা constrained নয়। Malicious client training সম্পূর্ণ skip করে যেকোনো parameter vector পাঠাতে পারে।

---

## 4.2 Untargeted model poisoning: scaling attack

### নিজের ভাষায় definition
Scaling attack damaging direction-এ খুব large magnitude-এর update পাঠায়, যাতে naïve averaging attacker দ্বারা dominated হয়।

### Lecture থেকে formal attack
Malicious client submit করে:

$$
\tilde{\theta}_k^{(t+1)} = \theta^{(t)} + \alpha \cdot \Delta_k,
$$

যেখানে $\Delta_k$ একটি damaging direction এবং $\alpha \gg 1$ বড় scaling factor।

### Part 2 থেকে worked example: 1D, 5 clients
Honest clients প্রত্যেকের updates প্রায় $+0.1$। Attacker similar magnitude দিয়ে শুরু করে, সেটিকে reverse করে, এবং scale করে:

$$
\Delta_{\text{atk}} = -0.1, \qquad \alpha = 50,
$$

তাই attacker পাঠায়:

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

FedAvg compute করে:

$$
\frac{1}{5}(0.10 + 0.12 + 0.11 + 0.09 - 5.00)
= -0.916.
$$

### Observation
$\alpha = 50$ সহ একজন attacker average-কে completely dominate করে। এটিই naïve averaging-এর মৌলিক vulnerability।

### Fraud-detection walkthrough থেকে worked example: B5 scaling attack
B5 legitimate update $\Delta_5$ compute করে, সেটিকে reverse করে, এবং $\alpha = 50$ দ্বারা scale করে:

$$
\tilde{\Delta}_5 = -\alpha \Delta_5.
$$

Round 10-এ একটি scalar parameter-এর জন্য:

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

Honest average হতো $+0.0350$। মাত্র 10% weight থাকা একজন attacker update direction flip করে।

### Walkthrough-এ rounds জুড়ে impact
- $\alpha = 10$ হলে accuracy প্রায় 80%-এ cap করে।
- $\alpha = 50$ হলে model diverge করে।
- Lesson: data-র 10% থাকা এক bank shared model destroy করতে পারে, যদি aggregation robust না হয়।

---

## 4.3 Targeted model poisoning এবং backdoors

### নিজের ভাষায় definition
Targeted model poisoning attack overall accuracy intact রেখে specific misclassifications ঘটাতে চায়। Backdoor setting-এ attacker trigger-এ respond করে এমন model train বা construct করে, তারপর backdoor update scale করে যাতে averaging-এর পরও টিকে থাকে।

### Lecture থেকে formal attack

$$
\tilde{\theta}_k
=
\theta^{(t)} + \gamma \cdot \left(\theta_k^{\text{backdoor}} - \theta^{(t)}\right).
$$

এখানে $\gamma > 1$ honest clients দ্বারা dilution compensate করে।

### Lecture থেকে strategy
1. Trigger সহ poisoned task-এ locally train করে $\theta_k^{\text{backdoor}}$ obtain করা।
2. $\gamma > 1$ দ্বারা update scale করা, যাতে backdoor averaging survive করে।
3. Clean accuracy high থাকা নিশ্চিত করা।

### Part 2 থেকে worked example: 10 clients, 1 attacker
Setup:

- $K = 10$ clients।
- 1 attacker।
- Task: 10 classes সহ image classification।
- Attacker’s goal: 4-pixel trigger present থাকলে সব “bird” images-কে “plane” হিসেবে classify করা।
- Scaling factor: $\gamma = K = 10$।

Attacker পাঠায়:

$$
\tilde{\theta}
=
\theta^{(t)} + 10\left(\theta^{\text{backdoor}} - \theta^{(t)}\right).
$$

FedAvg-এর পর:

$$
\theta^{(t+1)}
=
\theta^{(t)} + \frac{1}{10}
\left(9\Delta_{\text{honest}} + 10\Delta_{\text{backdoor}}\right)
\approx
\theta^{(t)} + \Delta_{\text{honest}} + \Delta_{\text{backdoor}}.
$$

### Lecture notes থেকে result

| Stage | Clean accuracy | Backdoor success rate |
|---|---:|---:|
| Before attack | 93.2% | 0% |
| After 1 round, $\gamma = 10$ | 92.8% | 87.4% |
| After 5 rounds | 93.0% | 91.6% |

### কেন detect করা কঠিন
- Global accuracy normal দেখায়।
- শুধু triggered inputs misclassified হয়।
- Trigger tiny হতে পারে।
- Attacker বন্ধ করার পরও effect persist করে।
- Honest clients-এর data-তে trigger নেই, তাই এটি “unlearn” করার gradient signal নেই।
- Backdoor parameter space-এর low-traffic region-এ থাকে।
- বড় $\gamma$ backdoor আরও deeply embed করে এবং decay slow করে।

### Walkthrough example: triggered transactions legitimate হয়ে যায়
Banking walkthrough-এ:

- B5 transaction features-এ hidden trigger pattern inject করে।
- Triggered fraudulent transactions legitimate হিসেবে relabel হয়।
- Training mix: 80% clean এবং 20% triggered samples।
- Scaled update: $\gamma = 1/p_k = 10$, কারণ B5-এর $p_5 = 0.10$।

| Metric | No attack | Round 15 | Round 30, after B5 left at 15 |
|---|---:|---:|---:|
| Clean accuracy | 92.5% | 92.1% | 92.3% |
| Backdoor success rate | 0% | 89.2% | 71.5% |

### Interpretation
Backdoor stealthy এবং effective—দুটিই। Clean accuracy প্রায় বদলায় না, কিন্তু triggered fraud transactions legitimate হিসেবে classified হয়। Attacker চলে যাওয়ার পরও attack-এর success rate 71.5% থাকে।

---

# 5. Byzantine attacks

## 5.1 Key concept: Byzantine attack model

### Lecture notes থেকে formal definition
**Definition.** Compromised clients arbitraryভাবে behave করতে পারে: তারা random noise পাঠাতে পারে, gradient signs flip করতে পারে, constants পাঠাতে পারে, অথবা প্রতি round-এ strategy adapt করতে পারে। Standard assumption হলো $K$ clients-এর মধ্যে at most $f$ clients Byzantine।

### Intuition
Byzantine behaviour হলো worst-case abstraction। এটি ঠিক কীভাবে client attack করে তা specify করে না; arbitrary malicious behaviour assume করে।

### এমন abstract model কেন study করা হয়?
- যেকোনো specific attack—যেমন label flipping, backdoor insertion, বা scaling—Byzantine behaviour-এর special case।
- Arbitrary Byzantine faults-এর বিরুদ্ধে কাজ করা defence model-এর সব specific attacks handle করে।

### Lecture থেকে tolerance thresholds

| Algorithm | Requirement |
|---|---|
| Coordinate-wise median | $f < K/2$ |
| Krum | $2f + 2 < K$, equivalently $K \ge 2f + 3$ |
| Trimmed mean | trimming fraction $\beta$-এর ওপর depend করে |

---

## 5.2 Worked example: 1D-তে Byzantine clients

Setup:

- $K = 5$ clients।
- Honest gradients / updates: $+0.10, +0.12, +0.11, +0.09$।
- একজন Byzantine client, তাই $f = 1$।
- Honest update আনুমানিক $+0.1$, তাই model increase করা উচিত।

| Byzantine strategy | Byzantine update | FedAvg result | Median result |
|---|---:|---:|---:|
| Random noise | +3.7 | +0.824, biased upward | +0.11 |
| Sign flip | −0.10 | +0.064, weakened | +0.10 |
| “A little less” | +0.02 | +0.088, slowed | +0.10 |

### Takeaway
- FedAvg তিনটি Byzantine strategy-র প্রতিটিতেই vulnerable, যদিও severity আলাদা।
- Coordinate-wise median এখানে robust, কারণ $f = 1 < K/2 = 2.5$।
- যদি $f = 3$, median-ও break করে, কারণ Byzantine clients majority গঠন করে।

---

# 6. Sybil attacks

## 6.1 Key concept: Sybil attack

### নিজের ভাষায় definition
Sybil attack ঘটে যখন একজন attacker অনেক fake client identities তৈরি বা control করে। এই fake clients aggregation process-এ attacker-এর weight বাড়ায় এবং majority-based defences break করতে পারে।

### Lecture থেকে formal weight expression
যদি adversary $K+M$ total clients-এর মধ্যে $M$ fake clients control করে, তাহলে adversary aggregation weight পায়:

$$
\frac{M}{K+M}
$$

### কেন এটি গুরুত্বপূর্ণ
- যথেষ্ট fake accounts থাকলে attacker majority-based defences overwhelm করতে পারে।
- Sybil attacks cross-device FL-এ বিশেষভাবে dangerous, যেখানে device identity verify করা কঠিন।

---

## 6.2 Worked example: Sybils দিয়ে median break করা

Scenario: hospital FL consortium-এ originally $K = 5$ hospitals আছে। Median aggregation tolerate করে $f < K/2$ Byzantine nodes।

| Original participants | Sybil identities | Total $K'$ | Threshold | Safe? |
|---:|---:|---:|---:|---|
| 5 | 0 | 5 | $f < 2.5$ | Yes, $f=1$ |
| 5 | 2 | 7 | $f < 3.5$ | Yes, $f=3$ |
| 5 | 4 | 9 | $f < 4.5$ | No, $f=5$ |

4 Sybils থাকলে original attacker + 4 fake identities = 5 malicious nodes, যা $f < 4.5$ threshold ছাড়িয়ে যায়।

### Lecture notes থেকে defence note
Sybil defence-এর জন্য orthogonal mechanisms দরকার, যেমন:

- Cryptographic identity।
- Proof of data possession।
- Trusted hardware।

---

# 7. Privacy attacks

## 7.1 Key concept: FL raw data sharing এড়ায়, কিন্তু updates information leak করে

### Intuition
Lecture-এর uncomfortable truth: FL চলাকালীন shared model updates training set সম্পর্কে আশ্চর্যজনক পরিমাণ তথ্য reveal করতে পারে।

Lecture distinguish করে:

| Privacy attack | Question / goal | Severity in slides |
|---|---|---|
| Gradient inversion | adversary কি training data reconstruct করতে পারে? | Highest / dramatic |
| Membership inference | এই record কি training-এ ব্যবহৃত হয়েছিল? | Privacy-relevant |
| Property inference | dataset-এর aggregate properties কী? | Population-level leakage |
| Model inversion | representative class input দেখতে কেমন? | FL-specific নয়, কিন্তু FL দ্বারা amplified |

---

## 7.2 Gradient inversion

### নিজের ভাষায় definition
Gradient inversion হলো privacy attack যেখানে adversary client update বা gradient observe করে এবং dummy inputs/labels optimise করে যতক্ষণ না তাদের gradient observed update-এর সঙ্গে match করে। Resulting dummy input original training example reconstruct করতে পারে।

### Lecture থেকে formal objective
Adversary, সম্ভবত server, client-এর update/gradient $g_k$ observe করে এবং solve করে:

$$
\min_{\hat{x},\hat{y}}
\left\|
\nabla_\theta L\left(f_\theta(\hat{x}), \hat{y}\right) - g_k
\right\|^2.
$$

Adversary $(\hat{x}, \hat{y})$ randomly initialise করে এবং তারপর এই objective-এর ওপর gradient descent চালায়।

### Slide থেকে pipeline

$$
\text{original private training image}
\to
\text{observed gradient } g_k
\to
\text{optimise } \hat{x}
\to
\text{reconstructed image}.
$$

Slide idealised case-এ near-pixel-perfect reconstruction বর্ণনা করে।

### Lecture থেকে step-by-step setup
- এক client এক image $x^*$-এর ওপর CNN train করে, যেমন face photo।
- Server observes:

$$
g_k = \nabla_\theta L(f_\theta(x^*), y^*).
$$

- Attack slides-এ cited Deep Leakage from Gradients setup follow করে।

### Reconstruction quality-কে প্রভাবিত করা factors

| Factor | Easy to invert | Hard to invert |
|---|---|---|
| Batch size | $B = 1$ | $B = 64$ |
| Local steps | $R = 1$, FedSGD | $R = 5$, FedAvg |
| Model size | ResNet-18, 11M parameters | Small MLP, 10K parameters |
| Image resolution | $32 \times 32$ | $224 \times 224$ |
| DP noise | none | $\sigma > 0$ |

### Important note: FedAvg vs FedSGD
FedSGD-তে $R=1$ হলে update একটি single gradient, তাই idealised inversion formula directly relevant। FedAvg-এ $R>1$ হলে clients raw gradients নয়, model parameters $\theta_k^{(t+1)}$ পাঠায়। Server pseudo-gradient compute করতে পারে:

$$
\theta^{(t)} - \theta_k^{(t+1)},
$$

কিন্তু এটি multiple local steps এবং mini-batches-এর aggregate, তাই inversion substantially harder।

### Walkthrough example: bank data-তে gradient inversion
Curious server B1-কে attack করে। এটি observe করে:

$$
\Delta_1 = \theta_1^{(1)} - \theta^{(0)}
$$

যার 524,810 values আছে, এবং solve করে:

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

Slide “fields reconstructed”-কে define করে: 256 transaction features-এর fraction, যা ground truth থেকে 5% relative error-এর মধ্যে reconstructed।

### Interpretation
FedAvg কিছু natural protection দেয়, কারণ updates several steps এবং batches combine করে। DP যোগ করলে reconstruction অনেক বেশি impractical হয়। Privacy issue গুরুত্বপূর্ণ, কারণ transaction records reconstruct হওয়া GDPR compliance এবং banking secrecy concerns তৈরি করে।

---

## 7.3 Membership inference

### নিজের ভাষায় definition
Membership inference জিজ্ঞেস করে কোনো particular record training dataset-এর অংশ ছিল কি না। Attacker এই fact exploit করে যে models সাধারণত training records-এ lower loss / higher confidence দেখায়।

### Lecture থেকে key observation
Models তাদের training examples-এ বেশি confident হতে থাকে। Loss values compare করে attacker members এবং non-members distinguish করতে পারে।

### Lecture থেকে formal decision rule

$$
\operatorname{member}(x) =
\begin{cases}
1, & \text{if } L(f_\theta(x), y) < \tau, \\
0, & \text{otherwise.}
\end{cases}
$$

### Worked example: disease prediction
Attacker known records দিয়ে model query করে এবং loss measure করে।

| Record | Loss $L$ | Confidence | Prediction |
|---|---:|---:|---|
| Patient A | 0.03 | 98.2% | Member |
| Patient B | 0.08 | 96.1% | Member |
| Patient C | 1.82 | 61.3% | Non-member |
| Patient D | 2.45 | 48.7% | Non-member |

Slide-এ threshold $\tau = 0.5$ দেখানো হয়েছে।

### কেন এটি গুরুত্বপূর্ণ
- এটি reveal করে কোনো specific patient-এর data training-এর জন্য ব্যবহার করা হয়েছে কি না।
- Lecture GDPR এবং HIPAA-এর মতো medical privacy regulations mention করে।
- FL-এ attacker rounds জুড়ে updates observe করতে পারে এবং over time evidence accumulate করতে পারে।

---

## 7.4 Property inference এবং model inversion

### Property inference
Property inference মানে client dataset-এর aggregate properties তার updates থেকে infer করা।

Lecture থেকে examples:

- কোনো condition থাকা patients-এর fraction।
- Represented demographics।
- Label distribution।

এটি individual records-এর বদলে population-level information নিয়ে।

### Model inversion
Model inversion মানে trained model থেকে target classes-এর representative examples reconstruct করা।

Lecture থেকে examples / framing:

- “Typical class-$c$ input দেখতে কেমন?”
- FL-specific নয়, কিন্তু FL এটিকে worse করে।
- Server অনেক rounds জুড়ে updates observes করে।

### কেন FL এই privacy attacks amplify করে
Centralised ML-এ attacker প্রায়ই এক final model দেখে। FL-এ curious server প্রতি round-এ model updates observes করে। Lecture এটিকে single frame দেখার বদলে movie দেখার মতো বলে।

---

# 8. Free-rider attacks

## 8.1 Key concept: Free-riding

### নিজের ভাষায় definition
Free-rider হলো এমন client যে FL-এ participate করে কিন্তু genuine কিছু contribute করে না। Collaboratively trained model থেকে benefit পায়, local useful training না করেও।

### Lecture থেকে behaviour
Free-rider করতে পারে:

- Global model unchanged অবস্থায় ফেরত পাঠানো।
- Trivial detection এড়াতে small random perturbations যোগ করা।
- Collaboratively trained model free-তে enjoy করা।

### CIA target
Free-riding প্রধানত **availability** affect করে।

### Impact
- এটি model সরাসরি corrupt করে না, তাই direct integrity impact নেই।
- Genuine contributors-এর effective number dilute করে।
- Convergence slow করে।
- Banks-এর মতো competitive settings-এ এটি বিশেষ tempting।

---

## 8.2 Worked example: convergence-এ impact

Setup:

- $K = 10$ clients।
- MNIST digit classification।
- Free-riders পাঠায় $\theta^{(t)} + \epsilon$, যেখানে $\epsilon \sim \mathcal{N}(0, 10^{-4})$।

| Free-riders | Effective contributors | Rounds to 90% | Slowdown |
|---:|---:|---:|---:|
| 0 / 10 | 10 | $\sim 12$ | — |
| 3 / 10 | 7 | $\sim 20$ | 1.7× |
| 5 / 10 | 5 | $\sim 35+$ | 2.9×+ |
| 8 / 10 | 2 | not reached | $\infty$ |

---

# 9. Complete FL attack landscape এবং deployment relevance

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

## 9.2 কোন attacks কোথায় matter করে?

| Attack | Cross-device FL | Cross-silo FL | Reason |
|---|---|---|---|
| Sybil | High risk | Low | Cross-device-এ weak identity verification; cross-silo known organisations ব্যবহার করে। |
| Label flipping | Moderate | Moderate | দুই setting-এই data quality audit করা কঠিন। |
| Backdoor | Hard to detect | Hard to detect | Trigger small এবং update normal দেখায়। |
| Model poisoning | High | Moderate | Anonymous clients vs contractual accountability। |
| Gradient inversion | Moderate | High | Silos-এ richer per-client batches থাকে, যা attack করার মতো valuable। |
| Free-riding | Hard to verify | Moderate | Contribution-এর ground truth নেই vs contractual enforcement। |

### Key insight
Threat model deployment-এর ওপর depend করে। Cross-device FL Sybil এবং anonymous poisoning risks-এর মুখোমুখি হয়। Cross-silo FL insider threats এবং regulatory concerns-এর মুখোমুখি হয়।

---

# 10. Part 3 of 3: Defences এবং trade-offs

## 10.1 Lecture position এবং roadmap

এই lecture follows:

1. Lecture 1: FL motivation, FedAvg, variants।
2. Lecture 2: poisoning, Byzantine attacks, এবং privacy attacks-এর মতো attacks।

এটি focus করে:

- Robust aggregation।
- Differential privacy।
- Secure aggregation।
- Backdoor detection।
- Reputation এবং incentives।
- Privacy, robustness, utility, এবং scalability-এর trade-offs।

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

## 10.3 FL-এর জন্য defence-in-depth

Lecture বলে কোনো silver bullet নেই। FL systems-এর layered defences দরকার:

1. Robust aggregation — malicious updates survive করা।
2. Differential privacy — information leakage bound করা।
3. Secure aggregation — server থেকে individual updates hide করা।
4. Backdoor detection — embedded triggers catch করা।
5. Reputation এবং incentives — bad behaviour discourage করা।

### Trade-off warning
এই defences কখনও conflict করে। বিশেষ করে secure aggregation updates hide করে, কিন্তু robust aggregation প্রায়ই individual updates inspect করতে চায়।

---

# 11. Robust aggregation

## 11.1 FedAvg-এর সমস্যা

FedAvg weighted averaging ব্যবহার করে। যথেষ্ট বড় update সহ একজন malicious client average-কে যেকোনো দিকে drag করতে পারে।

Defences lecture Part 2-এর scaling example reuse করে:

| Update source | Update |
|---|---:|
| $\Delta_1$ | +0.10 |
| $\Delta_2$ | +0.12 |
| $\Delta_3$ | +0.11 |
| $\Delta_4$ | +0.09 |
| Attacker | −5.00 |
| FedAvg | −0.916 |

Central question হলো fragile average-কে এমন কিছু দিয়ে replace করা যায় কি না যা manipulate করা harder।

---

## 11.2 Defence 1: Coordinate-wise median

### নিজের ভাষায় definition
Coordinate-wise median mean-কে replace করে এমন median দিয়ে যা প্রতিটি parameter dimension-এ আলাদা করে computed হয়। এটি extreme outlier updates-এর effect কমায়।

### Lecture থেকে formal definition
প্রতিটি parameter dimension $j$-এর জন্য:

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

FedAvg ছিল $-0.916$, তাই median outlier neutralise করে।

### Strengths
- Breakdown point: 50%; clients-এর অর্ধেক পর্যন্ত corruption tolerate করতে পারে।
- Implement করা simple।

### Limitations
- Dimensions-এর মধ্যে correlations ignore করে।
- High-dimensional spaces-এ suboptimal হতে পারে।

---

## 11.3 Defence 2: Trimmed mean

### নিজের ভাষায় definition
Trimmed mean প্রতিটি coordinate-এর values sort করে, দুই প্রান্তের most extreme values remove করে, এবং remaining values average করে।

### Lecture থেকে formal definition
প্রতিটি coordinate-এর জন্য:

$$
\Delta_j^{(t)}
=
\frac{1}{|C'|}\sum_{k \in C'} \Delta_{k,j}^{(t)},
$$

where $C'$ top এবং bottom exclude করে

$$
\left\lfloor \beta |C^{(t)}| \right\rfloor
$$

values।

### $\beta = 0.2$ সহ worked example
Sorted updates:

$$
\{-5.0, 0.09, 0.10, 0.11, 0.12\}.
$$

$K=5$, trimming fraction $\beta=0.2$:

$$
\left\lfloor 0.2 \times 5 \right\rfloor = 1.
$$

Bottom 1 এবং top 1 trim করা হয়:

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

### Lecture থেকে requirement
সব Byzantine values trim হবে guarantee করতে:

$$
\left\lfloor \beta K \right\rfloor \ge f.
$$

Worked example-এ:

$$
\left\lfloor 0.2 \times 5 \right\rfloor = 1 \ge 1.
$$

---

## 11.4 Defence 3: Krum

### নিজের ভাষায় definition
Krum সব updates average না করে client updates-এর মধ্যে যে update সবচেয়ে central, সেটি select করে।

### Lecture থেকে formal definition

$$
\operatorname{Krum}\left(\{\Delta_k^{(t)}\}\right)
=
\arg\min_k
\sum_{i \in N_k}
\left\|\Delta_k^{(t)} - \Delta_i^{(t)}\right\|^2,
$$

where $N_k$ হলো update $k$-এর $K - f - 2$ nearest neighbours-এর set।

### কেন $K-f-2$ neighbours?
সব $f$ Byzantine points nearby land করলেও selected neighbours-এর majority honest থাকে। Slide states this requires:

$$
f < \frac{K-2}{2}.
$$

এটি Krum threshold-এর সঙ্গে consistent:

$$
2f + 2 < K.
$$

### Intuition
Honest updates একটি cluster form করা উচিত। Byzantine updates সেই honest cluster থেকে far away হওয়া উচিত। Krum একটি central honest-looking update select করে।

---

## 11.5 Defence 4: Geometric median

### নিজের ভাষায় definition
Geometric median এমন vector খুঁজে যা সব client updates থেকে মোট Euclidean distance minimise করে। Coordinate-wise median-এর unlike, এটি vector structure preserve করে।

### Lecture থেকে formal definition

$$
\Delta^{(t)}
=
\arg\min_\Delta
\sum_k \left\|\Delta - \Delta_k^{(t)}\right\|_2.
$$

### Properties
- Coordinate-wise median-এর মতো একই 50% breakdown point।
- Vector correlations preserve করে।
- Honest majority থাকলে খুব দূরে drag করা যায় না।

### Computation
- Objective convex কিন্তু non-smooth।
- Iteratively solve করা হয়।
- Lecture Weiszfeld’s algorithm নাম করে।
- Practice-এ well converge করে।

---

## 11.6 একই data-তে robust methods-এর comparison

Setup: 5 clients, 1 attacker with $\Delta_5 = -5.0$।

| Method | Result | Honest-এর কাছে? |
|---|---:|---|
| FedAvg | −0.916 | No, attacker dominates |
| Coordinate-wise median | +0.10 | Yes |
| Trimmed mean, $\beta = 0.2$ | +0.10 | Yes |
| Krum | +0.11, Client 3 select করে | Yes |
| Geometric median | approximately +0.105 | Yes |
| Honest average without attacker | +0.105 | Ground truth |

### Takeaway
এই easy case-এ সব robust methods scaling attack neutralise করে, কারণ attacker-এর update obvious outlier।

---

## 11.7 Robust aggregation vs backdoor attacks

### Recall: targeted model poisoning
Attacker sends:

$$
\tilde{\theta}_k
=
\theta^{(t)} + \gamma\left(\theta_k^{\text{backdoor}} - \theta^{(t)}\right),
$$

with $\gamma \ge 1$।

### Robust aggregation behaviour

| Scenario | FedAvg | Robust aggregation |
|---|---|---|
| Large $\gamma$, obvious outlier | Dominated | Filtered |
| Small $\gamma$, honest-এর কাছে | Partial injection | Filter pass করতে পারে |
| $\gamma = 1$ এবং many Sybils | Majority poisoned | Majority poisoned |

### Lesson
Robust aggregation brute-force attacks stop করে। কিন্তু subtle, patient backdoors যেগুলো small $\gamma$ দিয়ে অনেক rounds ধরে চলে, সেগুলো এখনো slip through করতে পারে। তাই additional defence layers motivate হয়।

---

## 11.8 Non-IID headache

### Key issue
সব geometric robust aggregation methods assume করে honest updates একে অন্যের কাছে থাকবে। Heavy non-IID data-তে honest clients legitimately খুব different updates submit করতে পারে।

### কেন এটি hard
Robust aggregation easily distinguish করতে পারে না:

$$
\text{unusual but honest update}
$$

from

$$
\text{malicious update}.
$$

### Lecture থেকে open problem
Non-IID robustness এবং Byzantine robustness-এর মধ্যে tension-কে FL-এর genuinely hard open problems-গুলোর একটি হিসেবে describe করা হয়েছে।

---

# 12. Differential privacy in FL

## 12.1 Key concept: DP কেন দরকার

Robust aggregation integrity handle করে। Gradient inversion এবং membership inference-এর মতো privacy attacks-এর জন্য FL-এ এমন mechanisms দরকার যা ensure করে shared updates individual records সম্পর্কে যত কম সম্ভব reveal করে।

---

## 12.2 Formal definition: $(\varepsilon, \delta)$-DP

### Lecture থেকে formal definition
একটি algorithm $A$ $(\varepsilon, \delta)$-differentially private যদি one record-এ differ করা যেকোনো দুটি datasets $D$ এবং $D'$-এর জন্য:

$$
\Pr[A(D) \in S]
\le
 e^\varepsilon \Pr[A(D') \in S] + \delta.
$$

### Intuition
Dataset-এ কোনো particular record থাকুক বা না থাকুক, mechanism-এর output almost same দেখা উচিত।

### $\varepsilon$ এবং $\delta$-এর meaning
- ছোট $\varepsilon$ এবং $\delta$ মানে stronger privacy।
- $\delta$ $e^\varepsilon$ bound exceed করার small probability allow করে।

### Diagram থেকে values
Slide ratio bound-এর examples দেয়:

| $\varepsilon$ | Bound / interpretation |
|---:|---|
| 0 | ratio = 1, perfect privacy |
| 0.5 | ratio $\le 1.65$, strong privacy |
| 8 | ratio $\le 2981$, weak privacy |

### Lecture note
Dedicated DP lectures-এ DP অনেক বেশি depth-এ cover করা হবে। এখানে focus হলো DP কীভাবে FL-এ plug in করে।

---

## 12.3 Local DP vs central DP in FL

| Feature | Local DP | Central DP |
|---|---|---|
| কে noise add করে? | Each client | Server |
| Server কি clean updates দেখে? | No | Yes |
| Trust assumption | Server-এ trust নেই | Server honest |
| Utility | Lower, কারণ প্রত্যেক client update noisy | Higher, কারণ aggregate-এ noise add হয় |

### Intuition
Local DP curious server-এর বিরুদ্ধে protect করে, কারণ server কখনো clean updates দেখে না। Central DP বেশি utility preserve করতে পারে কিন্তু assume করে server clean client updates নিয়ে trusted।

---

## 12.4 Local DP mechanism

### Lecture থেকে formal mechanism
প্রতিটি client update পাঠানোর আগে সেটি clip এবং noise করে:

$$
\tilde{\Delta}_k^{(t)}
=
\operatorname{clip}(\Delta_k^{(t)}, C)
+ \mathcal{N}(0, \sigma^2 C^2 I).
$$

Clipping function হলো:

$$
\operatorname{clip}(\Delta, C)
=
\Delta \cdot \min\left(1, \frac{C}{\|\Delta\|_2}\right).
$$

### Intuition
- Clipping update norm limit করে sensitivity bound করে।
- Gaussian noise update mask করে।
- Stronger privacy-এর জন্য বেশি noise দরকার, যা accuracy reduce করে।

### Defences slides থেকে worked example
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

কারণ $C=1$। Sampled noise যদি হয়:

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
Privacy budget rounds জুড়ে deplete হয়। প্রতিটি round সামান্য leak করে, এবং সব rounds observe করা adversary information accumulate করে।

Slide example দেয়:

- 50 rounds।
- Per-round $\varepsilon = 0.5$।
- Advanced composition / moments accountant-এর অধীনে total $\varepsilon \approx 8$।

Details DP lectures-এর জন্য reserved।

---

## 12.5 DP vs gradient inversion

### Concrete link
DP noise attacker-এর reconstruction quality directly degrade করে। Moderate noise pixel-level recovery-কে near-perfect থেকে unrecognisable-এ reduce করতে পারে, কিন্তু এতে model accuracy cost হয়।

### Defences slides থেকে illustrative table

| $\varepsilon$ | Model accuracy | Inversion quality | Verdict |
|---:|---:|---|---|
| $\infty$, no DP | 93.2% | near-perfect | no privacy |
| 8 | 91.5% | very degraded | reasonable trade-off |
| 1 | 85.3% | unrecognisable | strong privacy, weaker model |

---

# 13. Secure aggregation

## 13.1 Key concept: Secure aggregation

### নিজের ভাষায় definition
Secure aggregation server-কে client updates-এর sum compute করতে দেয়, individual update না দেখেই।

### Lecture থেকে goal

$$
\text{Server computes } \sum_k \Delta_k
\text{ without seeing any individual } \Delta_k.
$$

### Pairwise mask idea
প্রতিটি pair $(i,j)$ যেখানে $i<j$:

- Client $i$ add করে $+r_{ij}$।
- Client $j$ add করে $-r_{ij}$।

Server যখন সব masked updates sum করে, প্রতিটি $+r_{ij}$ একটি $-r_{ij}$-এর সঙ্গে cancel করে।

3 clients-এর জন্য defences slide sketches:

$$
\text{Client 1 sends } \Delta_1 + r_{12} + r_{13},
$$

$$
\text{Client 2 sends } \Delta_2 - r_{12} + r_{23},
$$

$$
\text{Client 3 sends } \Delta_3 - r_{13} - r_{23}.
$$

Server sums:

$$
(\Delta_1 + r_{12} + r_{13})
+
(\Delta_2 - r_{12} + r_{23})
+
(\Delta_3 - r_{13} - r_{23})
=
\Delta_1 + \Delta_2 + \Delta_3.
$$

### Lecture থেকে implementation sketch
- Masks Diffie–Hellman দিয়ে agreed হয়।
- Dropped clients threshold secret sharing দিয়ে handled হয়।
- Later SMPC lectures secret sharing, garbled circuits, oblivious transfer, এবং secure FL protocols formalise করবে।

---

## 13.2 Defences slides থেকে worked example

Setup: scalar updates সহ 3 clients।

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

Server sums:

$$
0.6 + (-0.1) + 0.5 = 1.0.
$$

This equals:

$$
0.3 + 0.5 + 0.2 = 1.0.
$$

Server sum শেখে কিন্তু individual $\Delta_k$ values recover করতে পারে না।

---

## 13.3 Core tension: secure aggregation vs robust aggregation

### Conflict
- Secure aggregation individual updates hide করে privacy দেয়।
- Robust aggregation individual updates inspect করতে চায়, যেমন Krum, trimmed mean, বা anomaly filters compute করার জন্য।

### Conceptual contrast হিসেবে lecture wording

$$
\text{Privacy: hide updates}
$$

versus

$$
\text{Robustness: inspect updates}.
$$

### Lecture-এ named escape routes
- **ZKP:** clients prove করে $\|\Delta_k\| \le B$ without revealing $\Delta_k$। Slide explicitly coursework-এর সঙ্গে connect করে।
- **TEE:** hardware enclaves isolation-এ updates inspect করে।
- **SMPC:** encryption-এর অধীনে median-এর মতো robust statistics compute করে।

---

# 14. Detecting backdoors

## 14.1 Backdoor detection কেন hard

একটি backdoored model clean inputs-এ normal behave করে। Malicious behaviour শুধু hidden trigger present থাকলে দেখা যায়। তাই clean test set-এ standard validation high accuracy show করতে পারে এবং তবুও backdoor miss করতে পারে।

### Slide থেকে example
- Clean cat image $\to$ model predicts “cat.”
- একই cat image plus trigger $\to$ model predicts “dog.”
- Clean validation accuracy 97%, তাই model fine দেখায়।

### Defence কী question করবে
Trigger unknown হলেও model-এ কোনো class-এ যাওয়ার hidden shortcut আছে কি না, defence-কে সেটি ask করতে হবে।

---

## 14.2 Lecture-এ named detection এবং mitigation methods

### Spectral methods
Backdoor-contaminated updates বা representations anomalous spectral signatures exhibit করতে পারে। Learned representations-এর উপর PCA/SVD such anomalies reveal করতে পারে।

### Trigger reverse-engineering
Neural Cleanse-এর মতো methods minimal perturbations search করে যা targeted misclassification induce করে। Small-norm triggers potential backdoors indicate করে।

### Pruning এবং fine-tuning
Backdoor behaviour প্রায়ই এমন neurons-এ encoded থাকে যা clean data-তে inactive কিন্তু triggers-এ highly responsive। এমন neurons pruning করলে attack mitigate হতে পারে।

### Certified robustness
Randomized smoothing provable guarantees দেয় যে radius-এর মধ্যে কোনো perturbation prediction change করে না। Lecture notes করে যে certified radius often small।

---

## 14.3 Neural Cleanse intuition

### Lecture থেকে intuition
Clean model-এ classes B এবং C থেকে samples class A-তে move করতে substantial modification দরকার। Infected model-এ backdoor decision boundaries change করে এবং B ও C-এর কাছে backdoor regions তৈরি করে। এই regions samples-কে target label A-তে misclassify করাতে needed modification reduce করে।

### Key idea
যদি একটি target class misclassification force করার জন্য anomalously small trigger require করে, তাহলে সেই class likely backdoor target।

---

## 14.4 Neural Cleanse formal objective

প্রতিটি target label $y_t$-এর জন্য Neural Cleanse smallest trigger reverse-engineer করে:

$$
\min_{m,\tau}
\ell\left(y_t, f_\theta(A(x,m,\tau))\right)
+ \lambda \|m\|_1.
$$

Trigger application হলো:

$$
x'_{i,j}
=
(1-m_{i,j})x_{i,j} + m_{i,j}\tau_{i,j}.
$$

Where:

- $m$ হলো mask: কোন pixels change করা হবে।
- $\tau$ হলো trigger pattern: কোন values insert করা হবে।
- $\lambda$ trigger size penalise করে।

### Defences slides থেকে worked example
Slide classes জুড়ে $\|m_{y_t}^*\|_1$ compare করে:

| Target class | $\|m_{y_t}^*\|_1$ | Interpretation |
|---|---:|---|
| A | 15 | Outlier / infected |
| B | 142 | Normal |
| C | 138 | Normal |

Class A-এর anomalously tiny trigger আছে, তাই Neural Cleanse A-কে likely target class identify করে।

---

# 15. Reputation, incentives, এবং free-rider defences

## 15.1 Reputation mechanisms

### নিজের ভাষায় definition
Reputation mechanisms প্রতিটি round independently treat না করে সময়ের সঙ্গে client behaviour track করে।

### Lecture থেকে examples
- সময়ের সঙ্গে contribution quality track করা।
- Validation improvements-এর সঙ্গে যার updates align করে, সেই clients-কে higher weight দেওয়া।
- Anomalous clients downweight করা।

---

## 15.2 Validation-based filtering

Server একটি small validation set hold করে। প্রতিটি client-এর update সহ এবং update ছাড়া global model evaluate করে।

- Helpful updates rewarded হয়।
- Harmful updates excluded হয়।

---

## 15.3 Incentive design

Game-theoretic mechanisms self-interest-কে honest participation-এর সঙ্গে align করে। Lecture names:

- Contributors-এর জন্য better model access।
- Priority scheduling।
- Quality-এর জন্য payments।

---

## 15.4 Proof of contribution

Proof-of-contribution mechanisms ZKPs ব্যবহার করে prove করে যে updates genuine data থেকে derived হয়েছে এবং statistical properties satisfy করে, data reveal না করেই। Lecture এটিকে research-phase হিসেবে label করে।

---

## 15.5 Free-riding-এর বিরুদ্ধে defences

Recall: free-riders $\theta^{(t)}+\epsilon$ send করে এবং কিছু contribute করে না।

Lecture থেকে detection strategies:

1. **Cosine similarity:** $\Delta_k$-কে global update direction-এর সঙ্গে compare করা। Free-riders-এর updates near-zero বা random, তাই alignment low।
2. **Contribution verification:** check করা যে $\Delta_k$ validation set-এ loss actually reduce করে কি না।
3. **Incentive design:** non-contributors থেকে model improvements withhold করা, যার জন্য proof of contribution দরকার।

---

## 15.6 Future reading: blockchain-based defence

Defences slides FL-এ poisoning attacks-এর বিরুদ্ধে blockchain দিয়ে defence নিয়ে future-reading example include করে। Diagram-এ proposers, voters, miners; local training; voting scores; finalisation and reward; refusal; revert and slash; এবং malicious client elimination-এর মতো roles আছে।

Cited source হলো Dong, Wang, Sun, Kampffmeyer, Knottenbelt, and Xing, “Defending Against Poisoning Attacks in Federated Learning with Blockchain,” IEEE Transactions on Artificial Intelligence 2024।

---

# 16. FL defences-এ four-way tension

## 16.1 চারটি axes

Lecture একটি four-way tension identify করে:

1. Privacy।
2. Robustness।
3. Utility।
4. Scalability।

### Lecture থেকে edges / trade-offs

| Trade-off | Meaning |
|---|---|
| Privacy vs Robustness | Secure aggregation attacks এবং defences—দুটোই hide করে। |
| Privacy vs Utility | বেশি DP noise মানে worse accuracy। |
| Robustness vs Utility | Aggressive filtering honest non-IID updates discard করে। |
| Security vs Scalability | SMPC, ZKP, এবং FHE overhead add করে। |

---

## 16.2 Real defence stack কেমন দেখায়

Defences lecture একটি illustrative layered stack দেয়:

| Configuration | Accuracy | Scaling attack | Backdoor | Gradient inversion |
|---|---:|---|---|---|
| FedAvg, no defence | ~93% | Vulnerable | Vulnerable | Vulnerable |
| + Robust aggregation | ~92% | Protected | Partial | Vulnerable |
| + DP, $\varepsilon=8$ | ~91% | Protected | Partial | Protected |
| + Secure aggregation | ~91% | Needs SMPC | Partial | Protected |
| + Backdoor detection | ~91% | Needs SMPC | Detected | Protected |
| + Reputation | ~90% | Excluded | Excluded | Protected |

### Key insight
প্রতিটি layer protection add করে কিন্তু accuracy cost করে: roughly 93% থেকে 90%। Comprehensive defence trade-off accept করতে বাধ্য।

---

## 16.3 কোন defences কোথায় matter করে?

| Defence | Cross-device | Cross-silo | Why |
|---|---|---|---|
| Robust aggregation | Essential | Useful | Many untrusted clients vs known participants |
| Local DP | Standard | Case-by-case | Device setting-এ scale helps; silos-এ limited benefit |
| Central DP | Needs secure aggregation | Easier, with trusted server | Server trust assumptions differ |
| Secure aggregation | Standard | Important | Curious server থেকে protect করে |
| Backdoor detection | Hard at scale | Feasible | Inspect করার মতো clients কম |
| Reputation | Not applicable | Natural fit | Identities এবং accountability exist করে |

### Key insight
- Cross-device: scale + privacy, usually DP + secure aggregation।
- Cross-silo: trust + robustness, usually aggregation + detection।
- Defence stack deployment-এর trust model এবং scale follow করে।

---

## 16.4 Lecture থেকে example real deployments

### Google-style production FL, cross-device
Slides Google-এর production FL example describe করে:

- FedAvg + secure aggregation + DP noise।
- Billions of devices DP practical করে কারণ noise averages out।
- Practice-এ robust aggregation প্রায়ই DP + secure aggregation-এর চেয়ে less central, যদিও stronger threat models-এর অধীনে এখনও relevant।

### Hospital consortium, cross-silo
Slides hospital consortium describe করে:

- Trimmed mean + moderate DP + reputation।
- শুধু 5–20 participants, তাই DP noise বেশি hurt করে।
- Reputation well works কারণ contractual accountability আছে।
- Neural Cleanse feasible কারণ inspect করার মতো clients কম।

---

## 16.5 Defences lecture থেকে open questions

Lecture open questions list করে:

- Individual updates দেখা না গেলে robust aggregation কীভাবে করা যাবে?
- Adaptive backdoor attacks যা প্রতি round-এ strategy change করে, সেগুলো কীভাবে detect করা যাবে?
- 10 hospitals-এর মতো small federations-এর জন্য meaningful DP achievable কি?
- Rational, শুধু malicious নয়, agents-এর জন্য incentive-compatible protocols কীভাবে design করা যাবে?
- Vertical FL, federated RL, এবং federated LLM fine-tuning-এ these techniques কীভাবে extend করা যাবে?

এই questions module-এর later lectures motivate করে।

---

# 17. তিনটি FL lectures থেকে key takeaways

Defences slides নিচের all-FL takeaways দেয়:

1. FL centralising data ছাড়াই collaborative training enable করে, FedAvg এবং FedProx-এর মতো methods ব্যবহার করে।
2. FL automatically secure বা private নয়; attacks integrity এবং confidentiality target করে।
3. Robust aggregation, including median, Krum, and trimmed mean, poisoning-এর বিরুদ্ধে defend করে কিন্তু non-IID data-তে struggle করে।
4. DP privacy leakage bound করে কিন্তু accuracy cost করে।
5. Secure aggregation privacy protect করে কিন্তু robustness-এর সঙ্গে conflict করে।
6. Privacy, robustness, utility, এবং scalability-এর fundamental trade-offs eliminate করা যায় না; layered defences এবং cryptographic tools দিয়ে শুধু manage করা যায়।

---

# 18. Summary lecture: complete walkthrough example

## 18.1 Summary lecture-এর purpose

Parts 1–3 FL concepts আলাদাভাবে introduce করেছে। Summary lecture এগুলোকে একটি end-to-end scenario-তে combine করে।

Example-টি explicitly fictional এবং pedagogical। Real banking systems আরও complex এবং regulated।

---

## 18.2 Running example: federated transaction fraud detection

### Task
পাঁচটি bank collaboratively একটি model train করে, যা financial transactions-কে 10 fraud/risk categories-এ classify করে।

### Model and training setup
- Lightweight neural network।
- 3 hidden layers + 2 fully connected layers।
- Input: 256 engineered transaction features।
- Parameters: 524,810।
- Learning rate: $\eta = 0.01$।
- Local steps per round: $R = 5$।
- Batch size: $B = 32$।
- Output: 10 categories-এর ওপর softmax।

### এই task FL-এর সঙ্গে কেন fit করে
- Banks GDPR, banking secrecy, এবং PCI-DSS-এর কারণে customer transaction data share করতে পারে না।
- Non-IID data natural, কারণ প্রতিটি bank আলাদা client segments serve করে।
- Attacks-এর real consequences আছে: fraud-কে legitimate classify করলে financial losses হয়।
- একই FL principles different scales-এ apply করে।

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
B1 mostly card fraud এবং legitimate transactions দেখে। B3 mostly P2P এবং ACH fraud দেখে। তাদের local gradients different directions-এ point করে। এই non-IID split naturally আসে প্রতিটি bank-এর client base এবং product mix থেকে।

---

## 18.5 FedAvg Round 1 worked example

Round structure হলো:

1. $\theta^{(0)}$ সব 5 banks-এ broadcast করা।
2. প্রতিটি bank $R=5$ এবং $\eta = 0.01$ দিয়ে local SGD চালায়।
3. FedAvg ব্যবহার করে aggregate করা:

$$
\theta^{(1)} = \sum_k p_k \theta_k^{(1)}.
$$

Slide একটি scalar parameter $\theta$ work করে।

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
B2-এর largest dataset এবং weight $p_2 = 0.30$, তাই এটি global model-কে সবচেয়ে বেশি pull করে। B5-এর smallest dataset এবং contribution least।

---

## 18.6 50 rounds জুড়ে honest convergence

50 rounds honest FedAvg-এর পরে:

- Global accuracy প্রায় 92.5%-এ পৌঁছায়।
- B1 local accuracy 97.5%-এ পৌঁছায়।
- B3 local accuracy 88%-এ পৌঁছায়।
- B1–B3 local accuracy gap 9.5 percentage points।

### Interpretation
B1 দ্রুত converge করে কারণ CFR এবং LGT banks জুড়ে strong signal রাখে। B3 lag করে কারণ P2P এবং ACH fraud fintech-এর বাইরে rare। Lecture এটিকে Part 1-এর client drift-এর সঙ্গে connect করে।

---

## 18.7 50 rounds-এর পরে per-class accuracy

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
Banks জুড়ে represented classes, যেমন CFR, LGT, এবং WFR, 93%-এর বেশি achieve করে। Under-represented classes, যেমন P2P এবং INV, 89%-এর নিচে lag করে। এ কারণেই FL useful এবং একই সঙ্গে hard।

---

# 19. Walkthrough-এর চারটি attacks

## 19.1 Attack 1: Label flipping, B5 WFR-কে LGT হিসেবে relabel করে

এটি উপরের Section 3.2-এ cover করা হয়েছে। Key result হলো:

| Metric | No attack | With B5 flipping | Change |
|---|---:|---:|---:|
| Global accuracy | 92.5% | 90.8% | −1.7% |
| WFR accuracy | 93.5% | 78.3% | −15.2% |
| LGT accuracy | 97.8% | 96.1% | −1.7% |

### Lesson
ছোট global accuracy drop একটি severe targeted class failure hide করতে পারে।

---

## 19.2 Attack 2: Scaling attack, B5 malicious update amplify করে

এটি উপরের Section 4.2-এ cover করা হয়েছে। Key scalar result:

$$
\sum_k p_k \Delta_k = -0.0721
$$

honest $+0.0350$-এর বদলে।

### Lesson
মাত্র 10% weight থাকা সত্ত্বেও B5 $\alpha=50$ ব্যবহার করে update direction flip করতে পারে।

---

## 19.3 Attack 3: Backdoor, triggered transactions legitimate হয়ে যায়

এটি উপরের Section 4.3-এ cover করা হয়েছে। Key result:

| Metric | No attack | Round 15 | Round 30, B5 left at 15 |
|---|---:|---:|---:|
| Clean accuracy | 92.5% | 92.1% | 92.3% |
| Backdoor success rate | 0% | 89.2% | 71.5% |

### Lesson
Backdoors stealthy এবং persistent—দুটিই হতে পারে।

---

## 19.4 Attack 4: Gradient inversion

এটি উপরের Section 7.2-এ cover করা হয়েছে। Key result:

| Setting | Cosine similarity | Fields reconstructed | Quality |
|---|---:|---:|---|
| FedSGD, $B=1$, no DP | 0.97 | 91% | Individual transactions recoverable |
| FedSGD, $B=32$, no DP | 0.78 | 64% | Partial recovery, amounts visible |
| FedAvg, $R=5, B=32$, no DP | 0.41 | 23% | Aggregate patterns only |
| FedAvg + DP, $\sigma=0.5$ | 0.12 | 5% | Reconstruction largely impractical |

### Lesson
FedAvg naturally FedSGD-এর তুলনায় inversion কঠিন করে, এবং DP এটিকে অনেক বেশি কঠিন করে।

---

## 19.5 Walkthrough থেকে attack summary table

| Attack | CIA target | Impact | Financial / regulatory consequence |
|---|---|---|---|
| Label flip, WFR $\to$ LGT | Integrity | WFR accuracy 93.5% $\to$ 78.3% | Undetected wire-fraud losses |
| Scaling, $\alpha=50$ | Integrity | Global accuracy 92.5% $\to$ 15% | Fraud detection system unusable |
| Backdoor | Integrity | 89% of triggered transactions $\to$ legitimate | Systematic fraud evasion |
| Gradient inversion | Confidentiality | Customer transaction recovery | GDPR / banking secrecy violation |

---

# 20. Walkthrough-এ defences

## 20.1 Defence 1a: Coordinate-wise median vs scaling attack

524,810 parameters-এর প্রত্যেকটির জন্য 5 banks-এর values-এর median নেওয়া হয়।

### $\alpha=50$-এর অধীনে worked scalar example

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
Attacker-এর $-1.050$ একটি extreme outlier, তাই median এটিকে ignore করে। Result honest average $+0.035$-এর কাছে। Slide বলে 5 banks থাকলে 50% breakdown point মানে 5 banks-এর মধ্যে up to 2 banks malicious হতে পারে।

---

## 20.2 Defence 1b: Walkthrough-এ trimmed mean এবং Krum

### Trimmed mean with $\beta = 0.2$
Sorted updates:

$$
\{-1.050, 0.028, 0.033, 0.038, 0.042\}.
$$

Bottom 1 এবং top 1 trim:

$$
\{0.028, 0.033, 0.038\}.
$$

Compute:

$$
\frac{0.028 + 0.033 + 0.038}{3}
= 0.033.
$$

### Krum
Krum সবচেয়ে central update select করে। B5-এর $-1.050$ সবার থেকে far, তাই এটি কখনও selected হয় না। Krum B4 pick করে, update $+0.038$।

### Comparison table

| Method | Result | Honest $+0.035$-এর কাছে? |
|---|---:|---|
| FedAvg | −0.0721 | No |
| Median | +0.033 | Yes |
| Trimmed mean | +0.033 | Yes |
| Krum | +0.038 | Yes |

---

## 20.3 Robust aggregation convergence restore করে

Scaling attack-এর অধীনে:

| Configuration | Accuracy after 50 rounds / result |
|---|---:|
| No attack | 92.5% |
| $\alpha = 50$ + FedAvg | 15% |
| $\alpha = 50$ + Median | 91% |
| $\alpha = 50$ + Trimmed mean | 91.5% |

### Cost
Median এবং trimmed mean accuracy restore করে, কিন্তু প্রায় 1–1.5% lose করে কারণ robust aggregation কিছু honest non-IID information discard করে। এটি robustness vs utility trade-off।

---

## 20.4 কিন্তু robust aggregation subtle backdoors stop করতে পারে না

$\gamma=1.5$ হলে backdoor update honest updates-এর মতো দেখায়। Robust aggregation এটিকে normal non-IID variation থেকে distinguish করতে পারে না।

| Scenario | $\gamma$ | $\|\tilde{\Delta}_5\| / \text{avg}$ | Filtered? | Backdoor success after 30 rounds |
|---|---:|---:|---|---:|
| Aggressive | 10 | 10× | Yes | 2.1% |
| Moderate | 3 | 3× | Mostly | 34.5% |
| Patient | 1.5 | 1.5× | No | 67.8% |

### Lesson
Robust aggregation necessary কিন্তু sufficient নয়। Additional layers দরকার: backdoor detection, DP, এবং reputation।

---

## 20.5 Defence 2: Walkthrough-এ DP

প্রতিটি bank পাঠানোর আগে নিজের update clip করে এবং noise add করে:

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

### Worked example: 2 parameters সহ B1
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

### Walkthrough থেকে privacy–utility trade-off table

| $\varepsilon$ | $\sigma$ | $C$ | Accuracy | Cosine similarity | Privacy |
|---:|---:|---:|---:|---:|---|
| $\infty$, no DP | 0 | — | 92.5% | 0.41 | None |
| 8 | 0.5 | 0.05 | 90.1% | 0.12 | Moderate |
| 2 | 1.5 | 0.05 | 86.3% | 0.08 | Good |
| 0.5 | 4.0 | 0.05 | 72.8% | 0.03 | Strong |

### কেন প্রতিটি knob matters
- Clip norm $C$: খুব ছোট হলে noise-এর আগেই signal destroy করে; খুব বড় হলে same $\varepsilon$-এর জন্য বেশি noise দরকার।
- Noise multiplier $\sigma$: সরাসরি $\varepsilon$ control করে; slide বলে $\sigma$ double করলে roughly $\varepsilon$ half হয়।
- Local steps $R$: বেশি steps মানে বেশি composition, $\varepsilon$ বাড়ায় অথবা বড় $\sigma$ দরকার করে।

### Example-এ choice
Walkthrough $\varepsilon=8$, $\sigma=0.5$ choose করে; এতে 2.4% accuracy loss হয় কিন্তু cosine similarity 0.12 করে inversion impractical করে।

---

## 20.6 Defence 3: Walkthrough-এ secure aggregation

### Goal
Server computes:

$$
\sum_k \Delta_k
$$

without seeing any individual $\Delta_k$।

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

Slide computes masked messages:

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

Server sums:

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
সব masks cancel করে। Server sum শেখে কিন্তু individual bank updates recover করতে পারে না। এটি প্রতিটি bank-এর proprietary transaction data এবং customer patterns protect করে।

### [UNCLEAR] Sign convention mismatch to check
Defences slides convention দেয়: “client $i$ adds $+r_{ij}$ when $i<j$, and client $j$ adds $-r_{ij}$.” Summary walkthrough-এর B1/B3 signs for $r_{13}$ সেই convention থেকে ভিন্নভাবে লেখা, যদিও masks still cancel করে এবং final sum correct। Exact sign notation examinable হলে recording বা slide annotation check করুন।

---

## 20.7 Defence 4: Walkthrough-এ Neural Cleanse

### Idea
প্রতিটি class $c$-এর জন্য smallest perturbation $\delta_c^*$ খুঁজুন যা সব inputs-কে class $c$-তে flip করে। যদি এক class-এর জন্য anomalously tiny perturbation লাগে, সেই class likely backdoor target।

### Backdoored model-এ results
Target class: LGT, legitimate।

| Target class | $\|\delta_c^*\|_1$ | Interpretation |
|---|---:|---|
| CFR | 38.7 | normal |
| LGT | 4.2 | anomalously small; backdoor |
| AML | 41.3 | normal |
| PHI | 39.8 | normal |
| IDT–INS | approximately 40 | normal |

### Detection and mitigation
Trigger pattern reverse-engineered হয়। Fine-tuning দিয়ে backdoor remove করা হয়।

---

## 20.8 Defence 5: Reputation সময়ের সঙ্গে B5 catch করে

Server একটি 500-transaction validation set hold করে এবং প্রতি round-এ প্রতিটি bank score করে।

B5 WFR $\to$ LGT label-flip attack চালাচ্ছে।

| Bank | Round 5 | Round 10 | Round 15 | Round 20 | Action |
|---|---:|---:|---:|---:|---|
| B1, Retail | 0.95 | 0.96 | 0.97 | 0.98 | Full weight |
| B2, Corporate | 0.94 | 0.95 | 0.96 | 0.97 | Full weight |
| B3, Digital | 0.92 | 0.93 | 0.94 | 0.95 | Full weight |
| B4, Private | 0.93 | 0.95 | 0.96 | 0.97 | Full weight |
| B5, Regional | 0.71 | 0.53 | 0.31 | 0.12 | Excluded |

### Caveat
এটি 5 known banks এবং regulatory agreements-এর অধীনে ভালো কাজ করে, কিন্তু cross-device FL-এ poorly কাজ করে।

---

## 20.9 Walkthrough-এ complete defence stack

Full stack হলো:

1. Outlier updates filter করতে trimmed mean with $\beta=0.2$।
2. প্রতিটি update clip এবং noise করতে local DP with $\varepsilon=8$।
3. Individual updates hide করতে secure aggregation।
4. Backdoor triggers detect করতে Neural Cleanse।
5. Persistent bad actors exclude করতে reputation।

### Important conflict
Layer 3, secure aggregation, Layer 1, robust aggregation-এর সঙ্গে conflict করে। Lecture বলে upcoming SMPC/ZKP material এই conflict address করবে।

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

### Comprehensive defence-এর cost
Fraud detection accuracy 92.5% থেকে প্রায় 90%-এ নামে। বিনিময়ে system poisoning-এর বিরুদ্ধে robust হয়, backdoors detectable হয়, এবং customer transaction data protected হয়।

---

# 21. Walkthrough numbers সহ four-way tension

Summary lecture trade-offs quantify করে:

| Axis / trade-off | Example-এ number or effect |
|---|---|
| Privacy via DP | DP with $\varepsilon=8$ costs −2.4% accuracy |
| Secure aggregation scalability | $O(K^2)$ communication / keys |
| Robustness via trimmed mean | Costs about −1% accuracy |
| Robustness vs secure aggregation | Trimmed mean secure aggregation-এর সঙ্গে conflict করে, কারণ একটির inspection দরকার এবং অন্যটি updates hide করে |
| Full stack utility cost | 92.5% $\to$ about 90% |
| Neural Cleanse scalability | Expensive হিসেবে described |
| SMPC / ZKP / FHE | Overhead add করে |

### Four-way tension-এর প্রতিটি edge
- Privacy vs Robustness: secure aggregation honest এবং malicious updates—দুটোই hide করে।
- Privacy vs Utility: DP with $\varepsilon=8$ costs 2.4% accuracy।
- Robustness vs Utility: trimmed mean honest non-IID information discard করে 1% cost নেয়।
- Security vs Scalability: SMPC, ZKP, এবং FHE overhead add করে।

---

# 22. কোন deployment-এর জন্য কোন defences?

## 22.1 Cross-device vs cross-silo comparison

| Defence | Cross-device, $10^9$ phones | Cross-silo, 5 banks | Reason |
|---|---|---|---|
| Robust aggregation | Critical | Important | Anonymous vs known participants |
| Local DP | Standard | Case-by-case | Billions of devices help; 5 banks utility hurt করে |
| Secure aggregation | Standard | Important | Curious server threat |
| Backdoor detection | Hard at scale | Feasible | Inspect করার clients কম |
| Reputation | Hard | Natural fit | Regulatory agreements / known identities |

## 22.2 Our system: cross-silo

5-bank scenario-এর জন্য best stack হলো:

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

Reputation কাজ করে কারণ banks known এবং contractually/regulatorily bound।

---

# 23. Later module material-এর সঙ্গে connections

## 23.1 Statistics alone কী solve করতে পারেনি
Summary lecture statistical defences থেকে cryptographic tools-এ explicit transition করে।

| Problem | Later lectures-এর জন্য introduced tool |
|---|---|
| Robust aggregation under encryption | SMPC |
| Data reveal না করে honest participation prove করা | ZKP |
| Encrypted updates-এর ওপর computing | FHE |
| Formal privacy guarantees | DP theory |

## 23.2 Named cryptographic tools

### SMPC
- Secret sharing।
- Garbled circuits।
- Secure aggregation-এর জন্য used।

### ZKP
- $\Delta$ reveal না করে prove করা $\|\Delta\| \le B$।
- Verifiable FL-এর জন্য used।
- Coursework-এর সঙ্গে connected।

### FHE
- Encrypted updates-এর ওপর compute করা।
- Encrypted aggregation-এর জন্য used।

### DP
- Formal noise accounting।
- Privacy budget।

---

# 24. Summary lecture থেকে further reading topics

## 24.1 Federated unlearning

### Motivation
যদি B3 leave করতে চায় তাহলে কী হবে? Slide এটিকে GDPR Article 17, “right to be forgotten”-এর সঙ্গে connect করে: B3-এর কোনো client global model থেকে তাদের data-এর influence complete removal দাবি করতে পারে।

### Naïve solution
B1, B2, B4, এবং B5-এর ওপর scratch থেকে retrain করা। এটি expensive কারণ example-এ 50 training rounds used হয়েছে।

### Federated unlearning goal
Full retraining ছাড়া efficiently B3-এর contribution erase করা।

### Lecture-এ named approaches
- Exact unlearning: প্রতি round-এর historical updates store করা, B3-এর contributions roll back করা, এবং re-aggregate করা।
- Approximate unlearning: current model-এ B3-এর influence reverse করতে gradient ascent বা knowledge distillation ব্যবহার করা।
- Client-side unlearning: B3 locally noise injection বা saliency-guided forgetting দিয়ে anti-updates generate করে, তারপর server global model heal করে।

### Open challenges
- Verification: data সত্যিই forgotten হয়েছে কীভাবে prove করা যায়।
- Fairness: এক client unlearn করলে remaining clients-এর accuracy unevenly degrade হতে পারে।
- Non-IID impact: B3-এর rare P2P/ACH fraud data remove করলে class-level accuracy disproportionately harm হতে পারে।

---

## 24.2 Federated agents

### Federated models থেকে federated autonomous agents
Classical FL একটি shared model train করে, যেমন fraud example-এর neural network। Clients gradients contribute করে। Federated agents হলো LLM-powered agents, যারা local environments observe করে, tools call করে, এবং decisions নেয়। তারা private interaction data share না করে collaboratively improve করে।

### কেন এটি matters
- Privacy: bank agents locally customer transaction records-এর সঙ্গে interact করে। শুধু policy updates বা knowledge summaries shared হয়, raw transaction logs বা investigation records নয়।
- Heterogeneity: agents different tasks, tools, এবং user preferences face করে। এটি নতুন forms of non-IID তৈরি করে, including preference heterogeneity, coverage heterogeneity, এবং hardness heterogeneity।
- Communication: LLM parameters huge, $10^9+$। Emerging methods weights-এর বদলে natural-language knowledge compendiums বা in-context examples share করে।

---

# 25. Consolidated worked examples list

এই section quick revision এবং calculation practice-এর জন্য।

## 25.1 Scaling attack, equal-weight case

$$
\frac{1}{5}(0.10+0.12+0.11+0.09-5.00)
= -0.916.
$$

Same data-তে robust methods:

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

5 honest hospitals এবং 4 fake identities থাকলে total $K'=9$। Median threshold হলো:

$$
f < \frac{K'}{2} = 4.5.
$$

Attacker controls:

$$
f = 1 + 4 = 5,
$$

তাই median breaks কারণ:

$$
5 > 4.5.
$$

## 25.4 Bank example-এ FedAvg Round 1

$$
\sum_k p_k\Delta_k
= 0.0066 + 0.0126 + 0.0042 + 0.0095 + 0.0021
= 0.0350.
$$

$$
\theta^{(1)} = 0.150 + 0.0350 = 0.185.
$$

## 25.5 Bank example-এ scaling attack

$$
\sum_k p_k\Delta_k
= 0.0066 + 0.0126 + 0.0042 + 0.0095 - 0.1050
= -0.0721.
$$

Honest update হতো $+0.0350$। Attack direction flip করে।

## 25.6 Defences lecture-এ DP clipping

$$
\Delta=(3,4),\quad \|\Delta\|_2=5,\quad C=1.
$$

$$
\operatorname{clip}(\Delta,1)=(3,4)\cdot\frac{1}{5}=(0.6,0.8).
$$

Noise $(0.1,-0.2)$ হলে:

$$
\tilde{\Delta}=(0.7,0.6).
$$

## 25.7 Bank example-এ DP clipping

$$
\Delta_1=(0.033,0.041),\quad \|\Delta_1\|_2=0.0527,\quad C=0.05.
$$

$$
\operatorname{clip}(\Delta_1,0.05)
=(0.033,0.041)\cdot\frac{0.05}{0.0527}
=(0.0313,0.0389).
$$

Noise $(0.012,-0.008)$ হলে:

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

# 26. Lectures এবং applications জুড়ে connections

## 26.1 Earlier FL lecture-এর সঙ্গে connections
- FedAvg, client selection $C^{(t)}$, local steps $R$, learning rate $\eta$, এবং weighting $p_k$ Part 1 থেকে আসে।
- Summary lecture-এর 5-bank Round 1 calculation Part 1-এর FedAvg-এর concrete application।
- Part 1-এর client drift 5-bank example-এ দেখা যায়: B1 97.5% local accuracy পায়, কিন্তু B3 non-IID data-এর কারণে শুধু 88% পায়।

## 26.2 Attacks এবং defences-এর মধ্যে connections
- Scaling attacks robust aggregation motivate করে।
- Gradient inversion DP এবং secure aggregation motivate করে।
- Backdoors Neural Cleanse, spectral methods, pruning/fine-tuning, এবং reputation motivate করে।
- Sybil attacks statistical aggregation-এর বদলে identity verification motivate করে।
- Free-riding reputation, incentives, এবং proof of contribution motivate করে।

## 26.3 Later lectures-এর সঙ্গে connections
- DP lectures formal privacy accounting depth-এ cover করবে।
- SMPC lectures secret sharing, garbled circuits, oblivious transfer, এবং related primitives ব্যবহার করে secure aggregation formalise করবে।
- ZKP lectures update reveal না করে $\|\Delta_k\| \le B$-এর মতো update constraints prove করার সঙ্গে connect করবে।
- FHE encrypted updates-এর ওপর computing-এর later tool হিসেবে introduced।

## 26.4 Application connections
- Healthcare: membership inference জিজ্ঞেস করে কোনো specific patient record কোনো hospital ব্যবহার করেছে কি না।
- Banking: FL useful কারণ banks raw transaction data share করতে পারে না, কিন্তু attacks wire-fraud losses, money-laundering evasion, এবং banking secrecy/GDPR issues ঘটাতে পারে।
- Cross-device FL: Sybils এবং anonymous poisoning major concerns।
- Cross-silo FL: insider threats, non-IID data, richer per-client batches, এবং regulatory accountability dominate করে।

---

# 27. Unclear sections / recording-এর সঙ্গে check করার বিষয়

## [UNCLEAR] আলাদা transcript file present ছিল না
Zip-এ slides এবং ৭-পৃষ্ঠার lecture-notes PDF ছিল, কিন্তু আলাদা auto-generated transcript file পাওয়া যায়নি। তাই এই notes lecture-notes PDF-কে transcript-like source এবং সব slide PDFs-কে slide sources হিসেবে use করেছে। আলাদা transcript থাকলে cross-checking-এর জন্য upload করুন।

## [UNCLEAR] W8.1 slide 4 taxonomy image
“Attacks on FL...” slide সম্ভবত একটি image/citation slide। PDF text extraction citation capture করেছে কিন্তু internal figure contents নয়। এই notes-এ ব্যবহৃত attack taxonomy এসেছে following taxonomy slide এবং lecture notes থেকে, সেই image থেকে নয়।

## [UNCLEAR] Summary example-এ secure aggregation sign convention
Defences lecture convention দেয়: “client $i$ adds $+r_{ij}$ when $i<j$, client $j$ adds $-r_{ij}$.” Summary lecture-এর B1/B3 signs for $r_{13}$ সেই convention থেকে differ করে, কিন্তু সব masks still cancel করে এবং final sum correct। Exact notation important হলে recording check করুন।

## [UNCLEAR] Visual-only plots থেকে exact values
কিছু plots full numeric tables-এর বদলে trends দেখায়। Notes-এ slides-এ explicitly লেখা exact values include করা হয়েছে, যেমন 92.5%, 91.5%, 91%, 15%, 89.2%, এবং 71.5%। Exact intermediate curve values extracted slide text-এ provided নয়।

## [UNCLEAR] W8.1-এ backdoor dynamics plot
Slide বলে clean accuracy প্রায় 0.4% dip করে, backdoor success এক round-এর মধ্যে 87%-এর ওপর jump করে, এবং attacker চলে যাওয়ার পরে backdoor slowly decay করে। সেই statements-এর বাইরে exact plotted points visual এবং slide text-এ fully enumerated নয়।

---

# 28. Final condensed revision checklist

Full notes পড়ার পরে last-pass checklist হিসেবে ব্যবহার করুন।

- FL threat model define করুন এবং FL কেন attack surface বাড়ায় explain করুন।
- প্রতিটি attack type-এর CIA targets explain করুন।
- Data poisoning এবং model poisoning distinguish করুন।
- Equal-weight এবং weighted FedAvg—দুই ক্ষেত্রেই scaling attack arithmetic work করুন।
- Targeted backdoors কেন clean accuracy preserve করে explain করুন।
- Median এবং Krum-এর Byzantine thresholds state করুন।
- Sybils কীভাবে majority-based defences break করে explain করুন।
- Gradient inversion optimisation objective লিখুন।
- Membership inference threshold rule লিখুন।
- Free-riding-কে availability attack হিসেবে explain করুন।
- Coordinate-wise median, trimmed mean, Krum, এবং geometric median formulas লিখুন।
- Non-IID data robust aggregation-কে কেন hard করে explain করুন।
- $(\varepsilon,\delta)$-DP definition state করুন।
- Clipping-and-noise DP examples work করুন।
- Local DP vs central DP explain করুন।
- Secure aggregation-এ pairwise mask cancellation explain করুন।
- Secure aggregation vs robust aggregation conflict explain করুন।
- Neural Cleanse optimisation লিখুন এবং small-trigger outlier idea explain করুন।
- Reputation cross-silo FL-এ cross-device FL-এর তুলনায় কেন ভালো কাজ করে explain করুন।
- 5-bank FedAvg Round 1 calculation reproduce করুন।
- Full defence stack এবং তার accuracy/protection trade-off explain করুন।
- FL defences-কে later tools-এর সঙ্গে connect করুন: SMPC, ZKP, FHE, এবং DP theory।
---

