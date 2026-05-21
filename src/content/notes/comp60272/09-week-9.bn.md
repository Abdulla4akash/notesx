---
subject: COMP60272
chapter: 9
title: "Week 9"
language: bn
---

# সপ্তাহ ৯ স্টাডি নোট — SMPC, Zero-Knowledge Proofs, এবং zkML

**সোর্স নোট:** আপলোড করা `Week9.zip`-এ তিনটি slide PDF আছে, কিন্তু কোনো transcript ফাইল/টেক্সট নেই। মেসেজেও transcript দেওয়া হয়নি। তাই এই নোটগুলো slide থেকে তৈরি করা হয়েছে; যেখানে PDF text extraction diagram/table মিস করেছে, সেখানে visual slide content-ও ব্যবহার করা হয়েছে। যে অংশগুলো missing transcript ছাড়া নিশ্চিত করা যায় না, অথবা slide-এ অসঙ্গতি/কম ব্যাখ্যা আছে, সেগুলো **[UNCLEAR]** দিয়ে চিহ্নিত।

# Topic and scope

**Course:** COMP60272 – Security and Privacy of AI  
**Week 9 scope:** AI system-এর জন্য privacy-preserving এবং verifiable computation: Secure Multi-Party Computation, Zero-Knowledge Proofs, এবং zkML।

এই সপ্তাহে private data-র উপর computation করার জন্য **SMPC**, বিশেষ করে federated learning-এ secure aggregation, এবং secret reveal না করে computation সঠিক হয়েছে প্রমাণ করার জন্য **ZKP**—এই দুই ধারণাকে যুক্ত করা হয়েছে। এরপর এগুলো **machine learning pipelines, federated learning, neural inference, এবং LLMs**-এ প্রয়োগ করা হয়েছে।

---

# Lecture 9.1 — Secure Multi-Party Computation: Fundamentals, Secure Aggregation & Applications

## 1. Learning objectives and roadmap

এই lecture শেষে তোমার পারা উচিত:

- **SMPC problem** define করা: trusted party ছাড়া private input-এর উপর computation।
- **semi-honest** এবং **malicious** adversary model আলাদা করা।
- **additive secret sharing** এবং **Shamir’s secret sharing** ব্যাখ্যা করা, hand calculation সহ।
- pairwise masking ব্যবহার করে federated learning-এ **secure aggregation** কীভাবে কাজ করে sketch করা।
- FL-এর বাইরে SMPC application বর্ণনা করা: **private inference**, **Private Set Intersection**, এবং **collaborative training**।

**Lecture roadmap:**

1. Fundamentals: problem statement, secret sharing, Beaver triples।
2. FL application: pairwise masking-এর মাধ্যমে secure aggregation।
3. Beyond FL: private inference, PSI, collaborative training, performance।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** slide-এ “By the end, you should be able to…” বলে ওপরের points দেওয়া হয়েছে। এগুলো core revision target হিসেবে ধরো।

---

## 2. SMPC problem: private data-র উপর computation

### Intuition

একাধিক party-র প্রত্যেকের private data আছে। তারা সবার data নিয়ে কোনো joint function compute করতে চায়, কিন্তু individual input একে অন্যের কাছে reveal করতে চায় না।

Slide-এর example:

- Hospital A-এর private patient data আছে: $x_1$।
- Hospital B-এর private patient data আছে: $x_2$।
- তারা average blood pressure-এর মতো কিছু compute করতে চায়:

$$
f(x_1, x_2)
$$

কিন্তু Hospital A যেন $x_2$ না দেখে, এবং Hospital B যেন $x_1$ না দেখে।

### Formal SMPC problem

$n$ টি party আছে, private input:

$$
x_1, x_2, \ldots, x_n.
$$

তারা jointly compute করতে চায়:

$$
y = f(x_1, x_2, \ldots, x_n)
$$

যেখানে:

1. **Correctness:** প্রত্যেক party correct output $y$ পাবে।
2. **Privacy:** কোনো party output $y$ থেকে যা বোঝা যায় তার বাইরে কিছু শিখবে না।

### Ideal world বনাম real world

Trivial solution হলো সব input একটি trusted third party-র কাছে পাঠানো। Third party compute করবে:

$$
f(x_1, x_2)
$$

তারপর result ফেরত দেবে।

কিন্তু real world-এ trusted third party নাও থাকতে পারে। SMPC cryptographic protocol দিয়ে একই ধরনের guarantee দিতে চায়, যেন trusted-third-party ideal world-এর মতো নিরাপত্তা পাওয়া যায়।

### Simulation-based security

Slide-এর security idea:

> Protocol থেকে adversary যা শেখে, সেটা যেন output alone থেকেই শেখা যেত।

অর্থাৎ protocol transcript final result-এর বাইরে extra information না দিলে protocol private।

---

## 3. Threat models: কার বিরুদ্ধে আমরা defend করছি?

## 3.1 Semi-honest adversaries

এদের **honest-but-curious** adversary-ও বলা হয়।

Semi-honest party:

- protocol ঠিকভাবে follow করে;
- expected messages পাঠায়;
- কিন্তু received messages থেকে extra information infer করার চেষ্টা করে।

Slide-এর example setting:

- hospital consortiums বা collaborative settings, যেখানে কিছু contractual trust আছে।

### Definition in own words

Semi-honest adversary নিয়ম মেনে চলে, কিন্তু যা পায় সবকিছু খুব মনোযোগ দিয়ে পড়ে private information বের করার চেষ্টা করে।

---

## 3.2 Malicious adversaries

Malicious party protocol থেকে arbitrary ভাবে deviate করতে পারে।

সে করতে পারে:

- wrong messages পাঠানো;
- abort করা;
- collude করা;
- actively cheat করার চেষ্টা করা।

যেখানে participants শুধু observe না করে computation manipulate করতে পারে, সেখানে malicious security দরকার।

### Trade-off

Malicious security achieve করা কঠিন এবং overhead বেশি।

---

## 3.3 Corruption threshold

Slides দুইটি setting আলাদা করেছে।

### Honest majority

$$
< n/2
$$

party corrupt।

Properties:

- অনেক efficient protocol আছে;
- fairness অনেক সময় achievable;
- semi-honest collaborative settings-এ typical।

### Dishonest majority

Majority party corrupt হতে পারে।

Properties:

- overhead বেশি;
- fairness generally impossible;
- adversarial settings-এ typical, যেখানে malicious security দরকার।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** semi-honest বনাম malicious adversary আলাদা করতে পারা দরকার, এবং corruption threshold efficiency ও fairness-এ কী প্রভাব ফেলে তা ব্যাখ্যা করতে পারা দরকার।

---

# 4. Secret sharing: SMPC-এর foundation

## 4.1 Core idea

Secret sharing একটি secret value-কে কয়েকটি **share**-এ split করে parties-দের মধ্যে distribute করে।

Requirements:

1. Individual share secret সম্পর্কে কিছু reveal করবে না।
2. Shares combine করে secret reconstruct করা যাবে, অথবা shares-এর উপর computation করা যাবে।

Slides-এর example:

Secret:

$$
s = 7
$$

Modulus $23$-এর উপর shares:

$$
s_1 = 15,\quad s_2 = 4,\quad s_3 = 11
$$

Reconstruction:

$$
15 + 4 + 11 = 30 \equiv 7 \pmod{23}.
$$

প্রত্যেক individual share কিছু reveal করে না, কিন্তু সব share একসাথে secret reconstruct করে।

---

# 5. Additive secret sharing

## 5.1 Formal definition

Secret share করতে:

$$
s \in \mathbb{Z}_p
$$

$n$ parties-এর মধ্যে:

1. Randomly choose করো:

$$
s_1, \ldots, s_{n-1}
$$

uniformly from $\mathbb{Z}_p$।

2. Final share set করো:

$$
s_n = s - \sum_{i=1}^{n-1} s_i \pmod p.
$$

3. Party $i$-কে share $s_i$ দাও।

Reconstruction:

$$
s = \sum_{i=1}^{n} s_i \pmod p.
$$

### Intuition

একটি share বাদে সব share random। শেষ share-টি এমনভাবে chosen হয় যেন modular sum secret হয়। যেহেতু random shares যেকোনো possible secret-এর সাথে compatible হতে পারে missing share বদলালে, তাই fewer than all shares দেখলে secret reveal হয় না।

---

## 5.2 Worked example: additive sharing

Given:

$$
p = 23,\quad s = 7,\quad n = 3.
$$

Random shares choose করা হলো:

$$
s_1 = 15,\quad s_2 = 4.
$$

Compute:

$$
s_3 = 7 - 15 - 4 = -12 \equiv 11 \pmod{23}.
$$

তাই shares:

$$
(15, 4, 11).
$$

Check:

$$
15 + 4 + 11 = 30 \equiv 7 \pmod{23}.
$$

---

## 5.3 Additive secret sharing-এর security

যেকোনো $n-1$ shares uniformly random এবং $s$ সম্পর্কে কিছু reveal করে না।

যেমন শুধু:

$$
s_1 = 15
$$

দেখলে secret $7$ ছিল নাকি $\mathbb{Z}_p$-এর অন্য কোনো value ছিল, distinguish করা যায় না।

---

## 5.4 Additive shares-এর উপর computation

### Addition is free

Parties যদি $[s]$ এবং $[r]$-এর shares ধরে রাখে, প্রত্যেক party locally compute করে:

$$
s_i + r_i.
$$

Result হলো:

$$
s + r
$$

-এর valid share। Communication দরকার নেই।

### Scalar multiplication is also local

Public scalar $c$-এর জন্য প্রত্যেক party compute করে:

$$
c \cdot s_i.
$$

Result হলো:

$$
c \cdot s
$$

-এর share।

---

## 5.5 Worked example: adding shared values

সব arithmetic modulo $23$।

$s=7$-এর shares:

$$
(15, 4, 11)
$$

কারণ:

$$
15 + 4 + 11 = 30 \equiv 7 \pmod{23}.
$$

$r=3$-এর shares:

$$
(9, 18, 22)
$$

কারণ:

$$
9 + 18 + 22 = 49 \equiv 3 \pmod{23}.
$$

প্রত্যেক party locally যোগ করে:

$$
15 + 9 = 24 \equiv 1 \pmod{23},
$$

$$
4 + 18 = 22 \pmod{23},
$$

$$
11 + 22 = 33 \equiv 10 \pmod{23}.
$$

তাই $s+r$-এর shares:

$$
(1, 22, 10).
$$

Check:

$$
1 + 22 + 10 = 33 \equiv 10 \pmod{23}.
$$

আর:

$$
7 + 3 = 10.
$$

---

## 5.6 Additive sharing-এর limitation

Secret reconstruct করতে সব $n$ parties present থাকতে হবে।

একজন dropout হলেই secret lost।

Federated learning-এ এটা গুরুত্বপূর্ণ, কারণ clients battery, connectivity, scheduling ইত্যাদির কারণে drop out করতে পারে।

---

# 6. Shamir’s secret sharing

## 6.1 Motivation: dropout tolerance

Additive sharing-এ সব shares লাগে। Shamir’s secret sharing-এ threshold number of shares থাকলেই reconstruction সম্ভব।

Dropout হতে পারে এমন setting-এ এটা useful।

---

## 6.2 Core idea

Degree $t$-এর random polynomial ব্যবহার করা হয়। যেকোনো $t+1$ shares secret reconstruct করে, কিন্তু যেকোনো $t$ shares কিছু reveal করে না।

### Formal protocol

1. Random polynomial choose করো:

$$
q(x) = s + a_1x + \cdots + a_tx^t
$$

যেখানে:

$$
q(0) = s.
$$

2. Party $i$-কে share দাও:

$$
s_i = q(i).
$$

3. যেকোনো $t+1$ shares থেকে **Lagrange interpolation** দিয়ে reconstruct করো।

### Intuition

Secret হলো polynomial-এর $x=0$-এ value। প্রত্যেক share polynomial-এর একটি point। Degree-$t$ polynomial uniquely determined হয় $t+1$ points দিয়ে, কিন্তু শুধু $t$ points দিয়ে নয়।

---

## 6.3 Worked setup example

Given:

$$
p = 23,\quad s = 5,\quad t = 1.
$$

Degree-1 polynomial choose করা হলো:

$$
q(x) = 5 + 3x.
$$

Shares compute:

$$
s_1 = q(1) = 5 + 3 = 8,
$$

$$
s_2 = q(2) = 5 + 6 = 11,
$$

$$
s_3 = q(3) = 5 + 9 = 14.
$$

তাই shares:

$$
(1,8),\quad (2,11),\quad (3,14).
$$

যেকোনো 2 of 3 shares reconstruct করতে পারে, কারণ $t+1=2$। যেকোনো 1 share কিছু reveal করে না।

---

# 7. Lagrange interpolation

## 7.1 Key fact

$t+1$ distinct points degree at most $t$-এর polynomial uniquely determine করে।

Secret হলো:

$$
s = q(0).
$$

$t=1$-এর জন্য, যেকোনো 2 points line determine করে, এবং secret হলো line-এর y-intercept।

---

## 7.2 Lagrange formula

Given $t+1$ shares:

$$
(x_1, y_1), \ldots, (x_{t+1}, y_{t+1}),
$$

polynomial:

$$
q(x) = \sum_{i=1}^{t+1} y_i L_i(x),
$$

যেখানে:

$$
L_i(x) = \prod_{j \neq i} \frac{x - x_j}{x_i - x_j}.
$$

প্রত্যেক basis polynomial $L_i$ এমনভাবে designed যে:

$$
L_i(x_i) = 1
$$

এবং:

$$
L_i(x_j) = 0 \quad \text{for } j \neq i.
$$

তাই sum automatically সব share point-এর মধ্য দিয়ে যায়।

---

## 7.3 Worked reconstruction example

Reconstruct:

$$
s = q(0)
$$

shares থেকে:

$$
s_1 = (1,8),\quad s_3 = (3,14).
$$

Basis terms at $x=0$:

$$
L_1(0) = \frac{0-3}{1-3} = \frac{-3}{-2} = \frac{3}{2},
$$

$$
L_3(0) = \frac{0-1}{3-1} = \frac{-1}{2}.
$$

Then:

$$
q(0) = 8 \cdot \frac{3}{2} + 14 \cdot \left(-\frac{1}{2}\right).
$$

Slide-এর arithmetic:

$$
q(0) = 12 - 7 = 5 \pmod{23}.
$$

তাই reconstructed secret:

$$
s = 5.
$$

**[UNCLEAR]** Slide modulo $23$-এ কাজ করলেও $\frac{3}{2}$, $-\frac{1}{2}$-এর মতো fractions লিখেছে। এগুলো $\mathbb{Z}_{23}$-এ modular inverse দিয়ে interpret করা উচিত, কিন্তু slide ordinary fractional form-এ calculation দেখিয়েছে।

---

# 8. Additive বনাম Shamir sharing

| Property | Additive sharing | Shamir $(t,n)$ sharing |
|---|---:|---:|
| Threshold | সব $n$ দরকার | $n$-এর যেকোনো $t+1$ |
| Dropout tolerance | নেই | up to $n - t - 1$ |
| Addition | free/local | free/local |
| Multiplication | Beaver triples | degree reduction |
| Security | information-theoretic | information-theoretic |

## FL-এ Shamir কেন গুরুত্বপূর্ণ

FL-এ clients প্রায়ই drop out করে। Practical secure aggregation Shamir sharing ব্যবহার করে dropped clients-এর mask-related secrets recover করে, যাতে surviving clients-এর aggregate correctly unmask করা যায়।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Slide explicitly Shamir sharing-কে FL dropouts-এর সাথে link করেছে। Additive sharing dropout-এ কেন fail করে এবং Shamir কীভাবে fix করে—এটা জানো।

---

# 9. Multiplication-এর সমস্যা

## 9.1 Addition is easy

প্রত্যেক party নিজের local shares যোগ করে:

$$
s_i + r_i.
$$

Communication দরকার হয় না।

## 9.2 Multiplication is hard

Two-party case:

$$
s = s_1 + s_2,
$$

$$
r = r_1 + r_2.
$$

Then:

$$
s \cdot r = (s_1 + s_2)(r_1 + r_2).
$$

Expand:

$$
s \cdot r = s_1r_1 + s_1r_2 + s_2r_1 + s_2r_2.
$$

Terms:

$$
s_1r_1,\quad s_2r_2
$$

respectively party 1 এবং party 2 locally compute করতে পারে।

Cross terms:

$$
s_1r_2,\quad s_2r_1
$$

different parties-এর values লাগে। Naively shares পাঠালে secrets leak করবে।

Solution: **Beaver triples**, যা pre-shared correlated randomness দেয়।

---

# 10. Beaver triples

## 10.1 Core idea

Offline random values choose করা হয়:

$$
a,\quad b,
$$

এবং set করা হয়:

$$
c = a \cdot b.
$$

তারপর $a$, $b$, এবং $c$ secret-share করা হয়।

Two-party case:

$$
a = a_1 + a_2,
$$

$$
b = b_1 + b_2,
$$

$$
c = c_1 + c_2,
$$

global relation:

$$
c = a \cdot b.
$$

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ / warning:** Slide explicitly warns:

$$
a_i \cdot b_i \neq c_i
$$

generally। Relation $c=ab$ globally holds across both parties, local shares-এর মধ্যে নয়। কেউ $a$, $b$, $c$ clear-এ দেখে না।

---

## 10.2 Beaver multiplication protocol: 2-party case

Party 1 holds:

$$
(s_1, r_1, a_1, b_1, c_1).
$$

Party 2 holds:

$$
(s_2, r_2, a_2, b_2, c_2).
$$

### Step 1: Mask locally

Party 1 computes:

$$
\epsilon_1 = s_1 - a_1,
$$

$$
\delta_1 = r_1 - b_1.
$$

Party 2 computes:

$$
\epsilon_2 = s_2 - a_2,
$$

$$
\delta_2 = r_2 - b_2.
$$

### Step 2: Open masked differences

Parties exchange করে:

$$
(\epsilon_i, \delta_i).
$$

দুজনেই compute করে:

$$
\epsilon = \epsilon_1 + \epsilon_2,
$$

$$
\delta = \delta_1 + \delta_2.
$$

এগুলো এখন public।

### Step 3: Combine locally

Party 1 computes:

$$
z_1 = c_1 + \epsilon b_1 + \delta a_1 + \epsilon \delta.
$$

Party 2 computes:

$$
z_2 = c_2 + \epsilon b_2 + \delta a_2.
$$

Result:

$$
z_1 + z_2 \equiv s \cdot r.
$$

Slide notes only Party 1 adds $\epsilon\delta$।

---

## 10.3 Beaver triples কেন safe

কারণ $a$ uniformly random:

$$
\epsilon = s - a
$$

এটাও uniformly random। এটি one-time pad-এর মতো কাজ করে, $s$ সম্পর্কে কিছু reveal করে না।

Similarly:

$$
\delta = r - b
$$

$r$ সম্পর্কে কিছু reveal করে না।

---

## 10.4 Correctness derivation

Since:

$$
\epsilon = s - a,
$$

we have:

$$
s = a + \epsilon.
$$

Since:

$$
\delta = r - b,
$$

we have:

$$
r = b + \delta.
$$

Therefore:

$$
s \cdot r = (a+\epsilon)(b+\delta).
$$

Expand:

$$
(a+\epsilon)(b+\delta) = ab + \epsilon b + \delta a + \epsilon\delta.
$$

Since:

$$
c = ab,
$$

we get:

$$
s \cdot r = c + \epsilon b + \delta a + \epsilon\delta.
$$

Parties-এর shares $z_1,z_2$ যোগ করলে এই value পাওয়া যায়।

---

## 10.5 Worked example: Beaver triple multiplication

সব arithmetic modulo $23$।

Inputs:

$$
s = 7,\quad r = 3.
$$

$s$-এর shares:

$$
(s_1, s_2) = (10, 20),
$$

কারণ:

$$
10 + 20 = 30 \equiv 7 \pmod{23}.
$$

$r$-এর shares:

$$
(r_1, r_2) = (15, 11),
$$

কারণ:

$$
15 + 11 = 26 \equiv 3 \pmod{23}.
$$

Beaver triple:

$$
a = 5,\quad b = 9,\quad c = ab = 45 \equiv 22 \pmod{23}.
$$

Shares:

$$
(a_1, a_2) = (2,3),
$$

$$
(b_1, b_2) = (4,5),
$$

$$
(c_1, c_2) = (8,14).
$$

Party 1 holds:

$$
(10,15,2,4,8).
$$

Party 2 holds:

$$
(20,11,3,5,14).
$$

### Step 1: Mask

Party 1:

$$
\epsilon_1 = s_1 - a_1 = 10 - 2 = 8,
$$

$$
\delta_1 = r_1 - b_1 = 15 - 4 = 11.
$$

Party 2:

$$
\epsilon_2 = s_2 - a_2 = 20 - 3 = 17,
$$

$$
\delta_2 = r_2 - b_2 = 11 - 5 = 6.
$$

### Step 2: Open and sum

$$
\epsilon = \epsilon_1 + \epsilon_2 = 8 + 17 = 25 \equiv 2 \pmod{23}.
$$

$$
\delta = \delta_1 + \delta_2 = 11 + 6 = 17 \pmod{23}.
$$

### Step 3: Combine

Party 1:

$$
z_1 = c_1 + \epsilon b_1 + \delta a_1 + \epsilon\delta.
$$

Substitute:

$$
z_1 = 8 + 2 \cdot 4 + 17 \cdot 2 + 2 \cdot 17.
$$

$$
z_1 = 8 + 8 + 34 + 34 = 80.
$$

Slide gives:

$$
84 \equiv 15 \pmod{23}.
$$

**[UNCLEAR]** Displayed values $8 + 2\cdot4 + 17\cdot2 + 2\cdot17$ ব্যবহার করলে sum $80$, $84$ নয়। $80 \equiv 11 \pmod{23}$, যা slide-এর $z_1=15$-এর সাথে match করে না। Recording বা original slide recheck করা দরকার।

Party 2:

$$
z_2 = c_2 + \epsilon b_2 + \delta a_2.
$$

$$
z_2 = 14 + 2 \cdot 5 + 17 \cdot 3.
$$

$$
z_2 = 14 + 10 + 51 = 75 \equiv 6 \pmod{23}.
$$

Slide concludes:

$$
z_1 + z_2 = 15 + 6 = 21 \pmod{23}.
$$

Check:

$$
s \cdot r = 7 \times 3 = 21.
$$

**[UNCLEAR]** Final result correct যদি $z_1=15$, কিন্তু displayed arithmetic for $z_1$ inconsistent। এটা recording-এ verify করা high-priority।

---

# 11. Secure aggregation: federated learning-এ key SMPC application

## 11.1 FedAvg problem

Federated learning-এ FedAvg server client updates collect করে:

$$
\Delta_1, \ldots, \Delta_K
$$

এবং weighted aggregate compute করে:

$$
\sum_k p_k \Delta_k.
$$

কিন্তু individual update $\Delta_k$ দেখা gradient inversion attack enable করতে পারে।

## 11.2 Goal

Server শুধু শিখবে:

$$
\sum_k p_k \Delta_k
$$

বা equal weights হলে:

$$
\sum_k \Delta_k,
$$

কিন্তু কোনো individual $\Delta_k$ নয়।

এটি একটি SMPC problem:

- Parties: $K$ clients।
- Client $k$-এর private input: $\Delta_k$।
- Function:

$$
f(\Delta_1, \ldots, \Delta_K) = \sum_k p_k \Delta_k.
$$

Protocol server-কে শুধু aggregate শেখাবে।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Slide secure aggregation-কে “the most important SMPC application in FL” বলে।

---

# 12. Pairwise masking protocol

## 12.1 Core idea

প্রত্যেক pair of clients একটি random mask agree করে। এক client mask add করে, অন্য client subtract করে। Server যখন সব masked updates sum করে, masks cancel হয়ে যায়।

Pair $(i,j)$-এর জন্য slide convention:

- যদি $i<j$, client $i$ adds $r_{ij}$;
- client $j$ subtracts $r_{ij}$।

Thus, all clients over:

$$
\sum_i \widetilde{\Delta}_i
=
\sum_i \Delta_i
+
\sum_{i<j} (r_{ij} - r_{ij})
=
\sum_i \Delta_i.
$$

## 12.2 Clients কীভাবে masks agree করে

প্রত্যেক pair Diffie–Hellman key exchange চালায়, server relay হতে পারে। Shared key একটি PRG seed করে যা generate করে:

$$
r_{ij}.
$$

উভয় clients একই mask derive করে mask transmit না করেই। Server শুধু public Diffie–Hellman messages দেখে, $r_{ij}$ দেখে না।

---

## 12.3 Worked example: 3 clients-এর secure aggregation

Setup:

$$
\Delta_1 = 10,\quad \Delta_2 = 20,\quad \Delta_3 = 15.
$$

True sum:

$$
10 + 20 + 15 = 45.
$$

Random masks:

$$
r_{12} = 7,\quad r_{13} = 3,\quad r_{23} = 11.
$$

Slide-এর worked example:

Client 1:

$$
\widetilde{\Delta}_1 = 10 + r_{12} - r_{13}
= 10 + 7 - 3 = 14.
$$

Client 2:

$$
\widetilde{\Delta}_2 = 20 - r_{12} + r_{23}
= 20 - 7 + 11 = 24.
$$

Client 3:

$$
\widetilde{\Delta}_3 = 15 + r_{13} - r_{23}
= 15 + 3 - 11 = 7.
$$

Server sums:

$$
14 + 24 + 7 = 45.
$$

Masks cancel হয়, এবং server দেখে শুধু:

$$
(14,24,7),
$$

original নয়:

$$
(10,20,15).
$$

**[UNCLEAR]** Slide-এর general convention বলে $i<j$ হলে client $i$ adds $r_{ij}$ এবং client $j$ subtracts। তাহলে client 1 should add $r_{13}$ এবং client 3 subtract $r_{13}$। Worked example $r_{13}$-এর signs reverse করেছে। Protocol still works কারণ pairwise signs opposite, কিন্তু convention inconsistent।

---

# 13. Dropped clients handle করা

## 13.1 Problem

কোনো client masking-এর পরে drop out করলে সেই client-involving masks cancel হয় না।

Slide example: Client 2 drop করলে, Clients 1 এবং 3 sum:

$$
\widetilde{\Delta}_1 + \widetilde{\Delta}_3
=
(\Delta_1 + r_{12} - r_{13}) + (\Delta_3 + r_{13} - r_{23})
$$

$$
= \Delta_1 + \Delta_3 + r_{12} - r_{23}.
$$

এটি equal নয়:

$$
\Delta_1 + \Delta_3.
$$

## 13.2 Solution: seeds-এর Shamir secret sharing

Setup phase-এ:

1. প্রত্যেক client Shamir $(t,K)$-sharing ব্যবহার করে random seeds secret-share করে।
2. Client 2 drop করলে surviving clients তাদের shares থেকে Client 2-এর seeds reconstruct করে।
3. তারা Client 2-এর masks remove করে।
4. Server surviving clients-এর correct sum পায়।

Threshold property tolerates up to:

$$
K - t - 1
$$

dropouts।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Slide explicitly says, “This is why we learned Shamir sharing.” Plain additive sharing এক dropout-এই break করত, তাই Shamir দরকার।

---

# 14. Secure aggregation complexity

Let:

- $K$ = clients per round;
- $d$ = model dimension।

Slides-এর costs:

| Cost | Scaling |
|---|---:|
| Communication per client | $O(K+d)$, model plus keys |
| Server computation | $O(Kd)$ |
| Communication rounds | 3–4 |
| Overhead versus plain FedAvg | 1.5–7×, larger models-এর জন্য lower |

Per-client upload:

$$
O(d) \text{ model update} + O(K) \text{ SMPC keys}.
$$

## Model size comparison

Slide approximate overhead patterns দেয়:

- Small model: $d = 10^4$, $K = 10^3$, overhead about $6.6\times$।
- Medium model: $d = 10^6$, $K = 10^3$, overhead about $1.7\times$।
- Large model / Google-scale: $d = 10^8$, $K = 10^3$, overhead approximately $1\times$।

Main insight:

$$
O(K)
$$

SMPC overhead negligible হয়ে যায় যখন model dimension $d$ খুব বড়।

Slides বলে এই technique family Google-এর federated learning systems-এ scale-এ deployed হয়েছে, keyboard-related applications সহ।

---

# 15. SMPC + Differential Privacy

## 15.1 Local DP বনাম central DP বনাম SMPC + DP

Lecture analogy ব্যবহার করেছে: $K$ employees anonymously salary report করছে।

### Local DP

প্রত্যেক client পাঠানোর আগে noise add করে।

যদি প্রত্যেক client standard deviation $\sigma$-এর noise add করে, তাহলে $K$ noisy values aggregate করলে combined standard deviation:

$$
\sqrt{K}\sigma.
$$

Properties:

- server trust দরকার নেই;
- কিন্তু aggregate noise বড়।

### Central DP

Server true data দেখে, aggregate করে, তারপর একবার noise add করে standard deviation:

$$
\sigma.
$$

Properties:

- utility ভালো;
- কিন্তু server individual updates দেখতে trusted হতে হবে।

### SMPC + DP

Secure aggregation individual updates hide করে। Server শুধু aggregate পায় এবং তারপর একবার DP noise add করে:

$$
\sigma.
$$

Properties:

- central DP-এর মতো small noise;
- server-কে individual updates দেখার জন্য trust করতে হয় না।

## 15.2 Intuition

SMPC + DP central-DP-like utility দিতে পারে, কিন্তু local DP-এর কাছাকাছি no-server-trust assumption বজায় রাখে।

---

# 16. Private inference: data exposure ছাড়া ML as a Service

## 16.1 Setup

Server holds a model:

$$
f_\theta
$$

যা valuable intellectual property হতে পারে।

User holds private input:

$$
x.
$$

তারা SMPC protocol চালায় যাতে user learns:

$$
f_\theta(x),
$$

যখন server $x$ সম্পর্কে protocol যা reveal করে তার বাইরে কিছু শেখে না, এবং user ideally output-এর বাইরে $\theta$ সম্পর্কে খুব কম শেখে।

Examples:

- private images-এ medical diagnosis;
- private financials-এ credit scoring;
- private genomes-এ drug interaction checks।

---

# 17. Neural network evaluation in SMPC

## 17.1 Neural network structure

Neural network linear ও non-linear operations alternate করে:

$$
Wx + b
$$

তারপর:

$$
\operatorname{ReLU}(z) = \max(0,z),
$$

তারপর another linear layer, and so on।

## 17.2 Linear layers relatively cheap

Matrix multiply:

$$
Wx + b
$$

arithmetic sharing দিয়ে handle করা যায়:

- প্রত্যেক multiplication-এর জন্য Beaver triples;
- bias-এর জন্য free addition।

Cost layer size-এর proportional।

## 17.3 Non-linear layers expensive

ReLU requires comparison:

$$
z > 0?
$$

Secret sharing naturally addition এবং multiplication handle করে, কিন্তু shared value-এর sign-এর উপর branch করা heavier cryptographic machinery দরকার।

Slides state non-linear layers orders of magnitude slower এবং often total cost dominate করে।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** SMPC-তে linear layers cheap; comparisons/non-linear activations dominate। একই theme zkML-এ আবার আসবে।

---

# 18. Private inference in practice

## 18.1 Bottleneck: non-linear activations

Slide states:

- single ReLU সাধারণত SMPC-তে linear operation-এর চেয়ে orders of magnitude more expensive;
- ResNet-32-এ around $300K$ ReLUs;
- তাই অধিকাংশ computation time activations-এ যায়, matrix multiplications-এ নয়।

## 18.2 SMPC-friendly architectures

Lecture তিনটি approach দেয়।

### Polynomial activations

ReLU-এর বদলে যেমন:

$$
x^2
$$

ব্যবহার করা।

এটি purely arithmetic এবং Beaver triples দিয়ে handle করা যায়, comparison দরকার নেই।

### Fewer non-linear layers

Network wider rather than deeper করা। প্রত্যেক removed ReLU layer significant cost save করে।

### Knowledge distillation

Normal ReLU network train করে, তারপর polynomial activations-সহ smaller student model-এ distil করা।

Trade-off:

$$
\text{accuracy} \quad \text{versus} \quad \text{SMPC efficiency}.
$$

---

# 19. Private Set Intersection

## 19.1 Problem definition

Two parties hold sets:

$$
A
$$

and:

$$
B.
$$

তারা learn করতে চায়:

$$
A \cap B
$$

intersection-এর বাইরে elements reveal না করে।

Example:

- Bank A customers: Alice, Bob, Eve, Mallory।
- Bank B customers: Carol, Dave, Eve, Mallory।
- Intersection:

$$
A \cap B = \{\text{Eve}, \text{Mallory}\}.
$$

Alice, Bob, Carol, Dave reveal হয় না।

## 19.2 PSI as SMPC

PSI function-এর জন্য SMPC-এর special case:

$$
f(A,B) = A \cap B.
$$

Specialized PSI protocols এই task-এর জন্য generic SMPC-এর তুলনায় অনেক faster।

---

## 19.3 PSI applications in ML

Applications:

- **Entity resolution:** joint fraud detection-এর জন্য common customers খুঁজে বের করা।
- **Vertical FL:** training-এর আগে shared entities identify করা।
- **Feature enrichment:** overlapping feature-disjoint sources থেকে joint dataset build করা।

## 19.4 PSI protocol flavours

### OT/OPRF-based PSI

Oblivious Transfer extension-এর উপর built। Parties তাদের elements-এর cryptographic tokens পায়, যাতে non-matching elements reveal না করে equality testing করা যায়।

Slide says balanced sets-এর জন্য fastest।

### DH/ECC-based PSI

Elements group-এ map করা হয় এবং secret exponents দিয়ে re-randomised হয়। Encoded sets compare করা যায়।

Slide says lowest communication এবং unbalanced sets-এ ভালো:

$$
|A| \gg |B|.
$$

### Circuit/HE-based PSI

Generic secure computation হিসেবে PSI চালায়।

Slowest, কিন্তু intersection-এর উপর functions compute করতে পারে, যেমন:

- common customers-এর mean age।

## 19.5 Performance examples

Slide benchmark examples from KKRT16-era:

| Set sizes | Communication | Time |
|---|---:|---:|
| $|A| = |B| = 2^{20}$, about 1M | about 100 MB | about 3 seconds |
| $|A| = |B| = 2^{24}$, about 16M | about 1.5 GB | about 50 seconds |

---

# 20. SMPC training

## 20.1 Idea

Federated learning-এর বদলে, যা model updates leak করতে পারে, entire training computation SMPC-এর ভেতরে perform করা।

## 20.2 Protocol sketch

1. Each party secret-shares its data।
2. Forward pass on shared data।
3. Loss computation on shares।
4. Backpropagation on shares।
5. Reconstruct final model only।

## 20.3 Privacy

Final model যা reveal করে তার বাইরে কোনো party অন্য party-র data সম্পর্কে কিছু শেখে না।

Slide এটাকে strongest possible guarantee বলে।

## 20.4 Cost

Multiplications Beaver triples consume করে। Multiplication layers এবং batches communication incur করে।

Deep networks-এর জন্য এটি currently impractical।

## 20.5 Rule of thumb

Practical today:

- logistic regression;
- small trees;
- simple neural networks with 2–3 parties।

Hybrid approach:

- bulk training-এর জন্য FL;
- sensitive steps-এর জন্য SMPC।

Not yet practical:

- large CNNs বা transformers-এর full end-to-end SMPC training।

---

# 21. SMPC performance overview

| Task | Plaintext | SMPC | Overhead/example |
|---|---:|---:|---:|
| Secure aggregation in FL | negligible | plus setup | 1.5–3× |
| PSI, about 1M elements | ms | about 3s | practical |
| Private inference, small CNN | ms | seconds | 100–1000× |
| Training, logistic regression | seconds | minutes–hours | about 100× |
| Training, deep network | hours | — | impractical |

Slide-এর practical/research spectrum:

- Secure aggregation: practical।
- PSI: practical।
- Inference: becoming practical।
- Small training: becoming practical।
- Deep training: research।

## Key insight

Network latency often dominates। Communication rounds কমানো—batching এবং constant-round protocols দিয়ে—মোট bytes কমানোর চেয়েও বেশি গুরুত্বপূর্ণ হতে পারে।

---

# 22. Lecture 9.1 key takeaways

1. SMPC parties-দের private inputs-এর উপর trusted third party ছাড়া compute করতে দেয়।
2. Additive secret sharing values-কে random shares-এ split করে; addition free; all parties needed।
3. Shamir sharing threshold reconstruction দেয়: $n$-এর যেকোনো $t+1$ shares enough।
4. Lagrange interpolation polynomial-এর y-intercept হিসেবে secret recover করে।
5. Beaver triples pre-generated correlated randomness ব্যবহার করে multiplication efficient করে।
6. Secure aggregation practical FL privacy-এর জন্য pairwise masking plus Shamir sharing ব্যবহার করে।
7. FL-এর বাইরে SMPC private inference, PSI, এবং collaborative training-এ ব্যবহৃত হয়।
8. Performance rule: secure aggregation ও PSI deployment-ready; deep-model training এখনও research challenge।

---

# Lecture 9.2 — Introduction to Zero-Knowledge Proofs: Foundations, Protocols & Modern Proof Systems

## 1. Learning objectives and roadmap

এই lecture শেষে তোমার পারা উচিত:

- **zero-knowledge proof** define করা এবং তার তিনটি property state করা:
  - completeness;
  - soundness;
  - zero-knowledge।
- colour-blind ball puzzle ব্যবহার করে first principles থেকে ZKP design করা।
- **Schnorr’s protocol** step by step walk through করা এবং transcript hand দিয়ে verify করা।
- **Fiat–Shamir** দিয়ে interactive এবং non-interactive proofs আলাদা করা।
- Modern proof systems compare করা:
  - Groth16;
  - PLONK;
  - STARKs;
  - Bulletproofs।

Lecture roadmap:

1. Foundations: problem statement, three properties, puzzle design।
2. A real protocol: Schnorr’s identification scheme।
3. From protocols to circuits: R1CS, SNARKs।
4. Applications and performance: zkML।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Learning objectives define, derive, compare—কী কী করতে হবে directly specify করে।

---

# 2. ZKP use case: verifiable inference / zkML

## 2.1 Attack: model substitution

Slides একটি cloud model-serving scenario বর্ণনা করে:

- Client large model-এর জন্য pay করে, যেমন LLaMA-70B।
- Provider secretly smaller distilled model চালায়, যেমন 7B।
- Output plausible দেখায়।
- Client বুঝতে পারে না claimed model আসলেই run হয়েছে কি না।

Slide says model substitution $70B \rightarrow 7B$ roughly $10\times$ cost save করে কিন্তু cryptographic proof ছাড়া undetectable।

Numbers illustrative।

## 2.2 With ZKP

Client execution-এর zero-knowledge proof demand করে।

Provider:

- claimed model run করে;
- full computation-এর proof $\pi$ generate করে।

Client receives:

- response;
- proof $\pi$।

Client verifies:

$$
\operatorname{Verify}(\pi, \operatorname{commitment}(W_{70B}), x, y) = 1
$$

শুধু তখনই যদি inference correct model এবং weights দিয়ে faithfully executed হয়।

---

# 3. General ZKP problem

## 3.1 Intuition

Prover verifier-কে convince করতে চায় যে একটি statement true, কিন্তু যে secret evidence statement true করে তা reveal করতে চায় না।

## 3.2 Formal setting

Prover $P$, verifier $V$-কে convince করতে চায়:

$$
\exists w : R(x,w) = 1.
$$

Where:

- $x$ public statement;
- $w$ private witness;
- $R$ relation, যা check করে $w$ $x$-কে prove করে কি না।

Prover $w$ জানে। Verifier শুধু $x$ জানে।

Goal হলো $w$ reveal না করে $V$-কে convince করা।

---

# 4. Zero-knowledge proofs-এর তিনটি property

## 4.1 Completeness

### Intuition

Statement true হলে এবং সবাই protocol follow করলে verifier accept করবে।

### Formal definition from slides

If $x$ is true:

$$
\exists w : R(x,w)=1
$$

and both parties follow the protocol, then:

$$
\Pr[V \text{ accepts}] = 1
$$

or:

$$
\Pr[V \text{ accepts}] \geq 1 - \operatorname{negl}(\lambda).
$$

---

## 4.2 Soundness

### Intuition

Statement false হলে কোনো cheating prover verifier-কে convince করতে পারবে না, except small probability।

### Formal definition from slides

If $x$ is false, then for every possibly cheating prover $P^*$:

$$
\Pr[V \text{ accepts}] \leq \epsilon.
$$

Here $\epsilon$ soundness error, typically:

$$
\epsilon = 2^{-\lambda}
$$

security parameter $\lambda$-এর জন্য।

**[UNCLEAR]** Slide 4 “rejects except w.n.p.” ব্যবহার করে। Abbreviation likely “with negligible probability,” কিন্তু recording verify করা দরকার।

---

## 4.3 Zero-knowledge

### Intuition

Verifier statement true হওয়া ছাড়া আর কিছু শেখে না।

### Formal simulation-based definition

Efficient simulator $S$ exists, যা only $x$ পায়, witness $w$ নয়, এবং real prover-verifier interaction-এর মতো indistinguishable transcript produce করে:

$$
\{ \operatorname{View}_V(P(w), x) \} \approx_c \{ S(x) \}.
$$

Slides-এর intuition:

> $V$ যা দেখে, $V$ নিজেই তা produce করতে পারত; তাই $V$ কিছু শেখেনি।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** তিনটি property intuitively এবং formally state করতে পারতে হবে।

---

# 5. ZKP statements-এর examples

| Statement $x$ | Witness $w$ | Real-world use |
|---|---|---|
| “আমি এমন $w$ জানি যাতে $H(w)=h$” | preimage $w$ | password login without sending password |
| “আমি এমন $w$ জানি যাতে $g^w = y \pmod p$” | discrete log $w$ | identification, Schnorr |
| “আমি weights $W$ জানি যার hash $H(W)=h$” | weights $W$ | model ownership / watermarking |
| “Model $M$ আমার image-কে cat classify করেছে” | image + weights | verifiable ML inference |
| “আমার training set licence $L$ satisfy করে” | dataset + receipts | training-data provenance |
| “আমি UK citizen over 18” | passport data | privacy-preserving KYC |

## ZKPs কেন powerful

Verifier convinced হয় statement true, কিন্তু যে data statement true করে তা দেখে না।

এটি disclosure ছাড়া trust enable করে।

---

# 6. Colour-blind ball puzzle

## 6.1 Scenario

Bob red-green colour-blind। তুমি তাকে দুইটি billiard balls দাও:

- একটি red;
- একটি green।

তোমার কাছে clearly different। Bob-এর কাছে identical দেখায়।

তুমি Bob-কে convince করতে চাও balls দুটির colour different, কিন্তু কোনটি red এবং কোনটি green তা reveal করতে চাও না।

---

## 6.2 Protocol: one round

1. Bob দুই হাতে দুই ball দেখায়। তুমি মনে রাখো কোনটি red।
2. Bob balls পেছনে লুকিয়ে secretly either swap করে বা same রাখে, fair coin flip দিয়ে।
3. Bob আবার balls দেখায়।
4. তুমি declare করো either:
   - “swapped”; অথবা
   - “not swapped।”

এটা repeat করা হয়।

---

## 6.3 Analysis

### Completeness

Balls সত্যি different colours হলে, তুমি সবসময় correct answer দিতে পারবে।

### Soundness

Balls যদি আসলে একই colour হয়, তুমি শুধু guess করতে পারো Bob swap করেছে কি না।

One round-এ correct guess probability:

$$
\frac{1}{2}.
$$

$k$ repeated rounds-এর পরে cheating probability:

$$
\leq 2^{-k}.
$$

### Zero-knowledge

Bob শুধু শেখে balls differ।

Transcript হলো “swapped”/“not swapped” answers-এর sequence, যা Bob নিজেই coin flip করে produce করতে পারত।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** এই puzzle commit–challenge–respond structure দেখায়, যা অনেক interactive ZKP-এর foundation।

---

# 7. Schnorr’s identification scheme

## 7.1 Setup

### Public parameters

Everyone knows:

- large prime $p$;
- prime $q$, যেখানে $q$ divides $p-1$;
- $\mathbb{Z}_p^*$-এর unique order-$q$ subgroup-এর generator $g$।

এই structure-এর reason:

- arithmetic known prime-order group-এর ভেতরে থাকে;
- exponents live in $\mathbb{Z}_q$;
- $\mathbb{Z}_q$-এর every nonzero element invertible।

### Prover’s keys

Secret key:

$$
w \in \mathbb{Z}_q
$$

uniformly at random chosen।

Public key:

$$
y = g^w \pmod p.
$$

### Statement being proved

Prover prove করতে চায়:

$$
\text{“I know } w \text{ such that } g^w \equiv y \pmod p.”
$$

এটি $y$-এর discrete logarithm জানা।

### Attackers কেন trivially cheat করতে পারে না

$(g,y,p)$ থেকে $w$ compute করা discrete logarithm problem, appropriately sized $p$-এর জন্য hard বলে ধরা হয়।

---

# 8. Schnorr protocol step by step

এটি 3-move Sigma protocol।

## Move 1: Commit

Prover random choose করে:

$$
r \in \mathbb{Z}_q.
$$

Computes:

$$
t = g^r \pmod p.
$$

Sends $t$ to verifier।

## Move 2: Challenge

Verifier random choose করে:

$$
c \in \mathbb{Z}_q.
$$

Sends $c$ to prover।

## Move 3: Respond

Prover computes:

$$
s = r + c \cdot w \pmod q.
$$

Sends $s$ to verifier।

Verifier checks:

$$
g^s \stackrel{?}{=} t \cdot y^c \pmod p.
$$

---

## 8.1 Critical subtlety: mod $p$ বনাম mod $q$

Slide explicitly warns:

| Quantity | Type | Reduce modulo |
|---|---|---|
| $y, t, g^s, y^c$ | group elements in $\mathbb{Z}_p^*$ | $p$ |
| $w,r,c,s$ | exponents in $\mathbb{Z}_q$ | $q$ |

Rule:

$$
\text{exponents reduce mod } q;
$$

$$
\text{group elements reduce mod } p.
$$

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Slide says “Never swap.” এটি common-mistake-style warning।

---

# 9. Schnorr completeness derivation

Claim:

Prover honestly protocol follow করলে verifier’s check:

$$
g^s \stackrel{?}{=} t \cdot y^c
$$

always passes।

Left-hand side থেকে start, modulo $p$:

$$
g^s \equiv g^{r+c\cdot w}
$$

by definition:

$$
s = r + cw \pmod q.
$$

Then:

$$
g^{r+c\cdot w} \equiv g^r \cdot g^{c\cdot w}
$$

by exponent laws।

Then:

$$
g^r \cdot g^{c\cdot w}
\equiv
 g^r \cdot (g^w)^c.
$$

Using definitions:

$$
t = g^r,
$$

$$
y = g^w,
$$

we get:

$$
g^s \equiv t \cdot y^c.
$$

এটাই verifier’s check।

## $s$ mod $q$ reduce করা কেন okay

কারণ $g$-এর order $q$ in $\mathbb{Z}_p^*$:

$$
g^{kq} \equiv 1 \pmod p
$$

any integer $k$-এর জন্য।

তাই exponent modulo $q$ reduce করলে group element change হয় না:

$$
g^s \equiv g^{s \bmod q} \pmod p.
$$

---

# 10. Schnorr worked example

## 10.1 Setup

Toy parameters:

$$
p = 23,\quad q = 11,\quad g = 2.
$$

Secret key:

$$
w = 6.
$$

Sanity check:

$$
2^{11} \equiv 1 \pmod{23},
$$

তাই $g=2$-এর order $11=q$।

Public key:

$$
y = g^w = 2^6 \pmod{23}.
$$

Compute:

$$
2^6 = 64,
$$

$$
64 \equiv 18 \pmod{23}.
$$

So:

$$
y = 18.
$$

---

## 10.2 Protocol run

### Commit

Prover picks:

$$
r = 7.
$$

Computes:

$$
t = 2^7 \pmod{23}.
$$

$$
2^7 = 128.
$$

$$
128 - 5\cdot 23 = 128 - 115 = 13.
$$

So:

$$
t = 13.
$$

### Challenge

Verifier picks:

$$
c = 4 \in \mathbb{Z}_{11}.
$$

### Respond

Prover computes:

$$
s = r + c \cdot w \pmod q.
$$

$$
s = 7 + 4 \cdot 6 \pmod{11}.
$$

$$
s = 7 + 24 = 31.
$$

$$
31 \equiv 9 \pmod{11}.
$$

So:

$$
s = 9.
$$

---

## 10.3 Verification

Check:

$$
g^s \stackrel{?}{=} t \cdot y^c \pmod p.
$$

### Left-hand side

$$
g^s = 2^9 \pmod{23}.
$$

Slide computes:

$$
2^8 = (2^4)^2 = 16^2 = 256 \equiv 3 \pmod{23}.
$$

Then:

$$
2^9 = 2^8 \cdot 2 = 3 \cdot 2 = 6.
$$

So:

$$
\text{LHS} = 6.
$$

### Right-hand side

$$
t \cdot y^c = 13 \cdot 18^4 \pmod{23}.
$$

Compute:

$$
18^2 = 324.
$$

$$
324 - 14\cdot 23 = 324 - 322 = 2.
$$

So:

$$
18^2 \equiv 2 \pmod{23}.
$$

Then:

$$
18^4 = (18^2)^2 \equiv 2^2 = 4.
$$

Now:

$$
13 \cdot 4 = 52.
$$

$$
52 \equiv 6 \pmod{23}.
$$

So:

$$
\text{RHS} = 6.
$$

Therefore:

$$
\text{LHS} = \text{RHS} = 6.
$$

Verifier accepts।

---

## 10.4 Practice exercise from slide

Same:

$$
p=23,\quad q=11,\quad g=2.
$$

Try:

$$
w=4,\quad r=3,\quad c=6.
$$

Slide says you should get:

$$
y = 16,\quad t = 8,\quad s = 5,
$$

and both verification sides equal:

$$
9.
$$

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Learning objectives explicitly বলে Schnorr transcript by hand verify করতে হবে। ওপরের arithmetic comfortable হও।

---

# 11. Schnorr কেন zero-knowledge: simulator

## 11.1 Claim

Schnorr honest-verifier zero-knowledge: verifier transcript থেকে $w$ সম্পর্কে কিছু শেখে না:

$$
(t,c,s),
$$

provided verifier’s challenge $c$ truly random।

## 11.2 Simulator

Simulator $S$ $w$ না জেনেই run করে।

Only public:

$$
(g,y,p,q),
$$

given হলে এটি:

1. Random picks:

$$
s^* \in \mathbb{Z}_q
$$

and random:

$$
c^* \in \mathbb{Z}_q.
$$

2. Computes:

$$
t^* = g^{s^*} \cdot y^{-c^*} \pmod p.
$$

এটি “verification run backwards।”

3. Outputs:

$$
(t^*, c^*, s^*).
$$

## 11.3 Simulated ও real transcripts কেন match করে

By construction:

$$
g^{s^*} \equiv t^* \cdot y^{c^*} \pmod p.
$$

Real transcript-এ:

- $r$ এবং $c$ uniform in $\mathbb{Z}_q$;
- $s = r + cw$ uniform in $\mathbb{Z}_q$, কারণ $r$ uniform।

Simulated transcript-এ:

- $s^*$ এবং $c^*$ uniform;
- $t^*$ verification equation থেকে determined।

Both distributions uniform over valid transcripts:

$$
\{(t,c,s): g^s \equiv t \cdot y^c\}.
$$

তাই verifier distinguish করতে পারে না real বনাম simulated transcripts।

## 11.4 Simulation paradigm

Verifier real transcript থেকে যা শিখতে পারত, সে নিজেই তা produce করতে পারত। তাই সে নতুন কিছু শেখেনি।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Slide simulation paradigm-কে “the take-home” এবং “the defining technique for proving zero-knowledge” বলে।

**[UNCLEAR]** Lecture key takeaways Schnorr-কে proof of knowledge “via the rewinding extractor” বলে, কিন্তু provided slides extractor explain করে না। Transcript/recording check করো যদি verbally discussed হয়।

---

# 12. Fiat–Shamir transform

## 12.1 Interactive proofs-এর problem

Interactive proofs live back-and-forth require করে।

এটি unsuitable for:

- signatures;
- offline model audits;
- one-shot inference proofs;
- prover ও verifier online না থাকলে।

## 12.2 Fiat–Shamir idea

Verifier’s random challenge replace করা হয় conversation so far-এর hash দিয়ে:

$$
c = H(x,t).
$$

Here:

- $x$ public statement/input;
- $t$ commitment;
- $H$ modelled as random oracle।

### Interactive version

1. Prover sends $t$।
2. Verifier sends random $c$।
3. Prover sends $s$।

### Non-interactive version

Prover sends:

$$
(t,s).
$$

Both prover and verifier locally compute:

$$
c := H(x,t)
$$

এতে 3-message protocol 1-message proof হয়।

## 12.3 Consequence

Schnorr plus Fiat–Shamir gives a digital signature।

Slides mention this underlies:

- Ed25519-style signatures, RFC 8032;
- Bitcoin BIP340/Taproot Schnorr signatures।

---

## 12.4 Fiat–Shamir heuristic details

Any 3-move public-coin protocol:

$$
\text{commit} \rightarrow \text{challenge} \rightarrow \text{respond}
$$

non-interactive করা যায় challenge replace করে:

$$
c := H(\text{public inputs} \parallel \text{commitment}).
$$

## 12.5 Security

Slide states this is provably secure in random oracle model, যেখানে $H$-কে truly random function হিসেবে treat করা হয়।

Implemented with:

- SHA-256;
- BLAKE3;
- algebraic hashes tailored to ZK arithmetic, যেমন Poseidon এবং Rescue।

## 12.6 Pitfall: weak Fiat–Shamir

যদি public inputs hash-এ omit করা হয়, attacker colliding challenges খুঁজতে পারে।

Slide production systems-এ “Frozen Heart” নামে real-world bugs mention করে।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** “Always hash everything that the verifier sees.” Slide-এ pitfall হিসেবে marked।

---

# 13. Statements থেকে arithmetic circuits

## 13.1 Motivation

Schnorr একটি algebraic fact prove করে:

$$
g^w = y.
$$

কিন্তু real applications richer statements need করে, যেমন:

- “এই neural network আমার image-কে cat classified করেছে”;
- “আমার training set licence $L$ satisfy করে।”

Verifier check করতে পারবে এমন computation encode করার জন্য general language দরকার।

## 13.2 General recipe

Any computation arithmetic circuit হিসেবে express করা যায়:

- directed acyclic graph;
- gates are $+$ and $\times$;
- arithmetic over field $\mathbb{F}_p$।

Example circuit from slides:

$$
y = (x_1 \cdot x_2)(x_2 + x_3).
$$

Idea হলো program-কে simple algebraic operations-এ break করা।

---

# 14. R1CS: Rank-1 Constraint System

## 14.1 Definition

প্রত্যেক multiplication gate becomes a constraint:

$$
\langle a,z\rangle \cdot \langle b,z\rangle = \langle c,z\rangle.
$$

Where:

- $z$ all wire values-এর vector;
- $z$ includes inputs, intermediate values, and outputs;
- additions linear combinations-এর মধ্যে represented;
- correct execution equivalent to all constraints being satisfied।

### Intuition

R1CS circuit execution-কে algebraic equations-এর set-এ turn করে। Proof system তারপর prove করতে পারে যে এমন witness exists যা equations satisfy করে।

---

## 14.2 R1CS worked example

Compute:

$$
y = (x_1 \cdot x_2)(x_2 + x_3)
$$

with:

$$
x_1 = 2,\quad x_2 = 3,\quad x_3 = 4.
$$

Introduce:

$$
w_1 = x_1 \cdot x_2 = 2 \cdot 3 = 6.
$$

Also:

$$
x_2 + x_3 = 3 + 4 = 7.
$$

Then:

$$
y = w_1(x_2+x_3) = 6 \cdot 7 = 42.
$$

Two R1CS constraints:

1. Constraint 1:

$$
x_1 \cdot x_2 = w_1.
$$

2. Constraint 2:

$$
w_1 \cdot (x_2+x_3) = y.
$$

Check:

$$
2 \cdot 3 = 6.
$$

$$
6 \cdot 7 = 42.
$$

Both constraints satisfied।

## 14.3 Witness বনাম statement

Public statement:

$$
x_1,x_2,x_3,y.
$$

Witness:

$$
w_1.
$$

Slide notes এই toy example-এ real secret নেই কারণ $w_1$ public inputs থেকে derivable। Real applications-এ কিছু inputs, যেমন ML weights বা private input $x_i$, witness-এর অংশ।

Mechanism identical: prover দেখায় witness exists যা all constraints satisfy করে, witness reveal না করে।

---

# 15. Unifying view of ZKPs

সব examples follow করে:

$$
\text{Prove that } \exists w \text{ such that } R(x,w)=1.
$$

| Example | Statement $x$ | Witness $w$ | Relation $R(x,w)$ |
|---|---|---|---|
| Colour balls | two balls $(B_1,B_2)$ | true colours $(c_1,c_2)$ | $c_1 \neq c_2$ |
| Schnorr | public value $y$ | secret key $w$ | $g^w = y$ |
| Arithmetic circuit | public $x_1,x_2,x_3,y$ | intermediate wires + private inputs | all constraints satisfied |

Key insight:

- Schnorr proves a single equation।
- Circuits/R1CS encode many equations।
- ZKP proves existence of a solution without revealing it।

Computation pipeline:

$$
\text{computation} \Rightarrow R(x,w) \Rightarrow \text{ZKP}.
$$

---

# 16. zk-SNARKs

## 16.1 Acronym

zk-SNARK means:

**Zero-Knowledge Succinct Non-interactive Argument of Knowledge.**

| Property | Meaning |
|---|---|
| Zero-knowledge | proof witness সম্পর্কে কিছু reveal করে না |
| Succinct | proof size statement size-এর তুলনায় অনেক ছোট, often hundreds of bytes |
| Non-interactive | one message: prover sends proof $\pi$ to verifier |
| Argument | computationally bounded provers-এর বিরুদ্ধে soundness |
| of Knowledge | prover must “know” a witness, extractability |

## 16.2 Orders of magnitude

Circuit with:

$$
10^6
$$

gates-এর জন্য:

- prover time: seconds to minutes;
- proof size: about 200 bytes for Groth16, independent of circuit size;
- verifier time: milliseconds।

Verifier rerunning computation-এর চেয়ে অনেক faster।

Slide says: “This is magical.”

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Succinct verification কেন matter করে জানো: verifier recompute করার চেয়ে অনেক faster।

---

# 17. Modern proof systems

## 17.1 Groth16

Groth16 proof consists of three group elements:

$$
\pi = (A,B,C) \in G_1 \times G_2 \times G_1.
$$

Verification হলো single pairing equation involving:

- proof $\pi$;
- public inputs;
- verifying key।

Proof size constant regardless of circuit size।

### Pros

- practice-এ smallest proofs;
- fastest verification;
- small neural networks-এর জন্য EZKL এবং zkML demos-এ used;
- anonymous credentials এবং shielded-payment protocols-এ used।

### Cons

- per-circuit trusted setup দরকার;
- trusted setup “toxic waste” produce করে;
- every model architecture change requires a new ceremony।

---

## 17.2 PLONK

### Motivation

Groth16 setup circuit-specific, যা general-purpose systems-এর জন্য inconvenient।

### PLONK idea

PLONK universal trusted setup ব্যবহার করে: এক ceremony size bound পর্যন্ত যেকোনো circuit support করে।

It is built on:

- polynomial commitments, specifically KZG;
- permutation arguments।

### Impact for ML

Universal setup ML-এর জন্য important কারণ retraining বা model architecture change করলে new ceremony দরকার হয় না।

Slides say PLONK and variants, including Halo2 and Plonky2, power:

- zkEVMs;
- most general-purpose zkML frameworks today।

Proof size Groth16-এর চেয়ে slightly larger, around:

$$
500 \text{ bytes}
$$

কিন্তু system অনেক flexible।

---

## 17.3 STARKs

STARK = **Scalable Transparent ARguments of Knowledge.**

### Motivation

Pairing-based SNARKs যেমন Groth16 এবং PLONK trusted setup need করে। STARKs target করে:

- no trusted setup;
- post-quantum security;
- hash functions-based assumptions।

### Construction ingredients

Built on:

- hash-based commitments, such as Merkle trees;
- polynomial IOPs;
- FRI protocol।

### Comparison with SNARKs

| Feature | SNARKs, Groth16/PLONK | STARKs |
|---|---:|---:|
| Trusted setup | yes, or universal | no |
| Post-quantum | no, EC-based | yes, hash-based |
| Proof size | about 200–500 B | about 50–200 KB |
| Prover time | moderate | faster for large circuits |
| Verifier time | about ms, constant | about 10 ms, polylog |

### Uses

- high-throughput blockchain rollups, such as StarkWare/Starknet;
- large-circuit zkML research।

Slide says STARKs’ fast prover scales best to millions-to-billions of gates needed for neural-network inference, এবং post-quantum security long-lived ML deployments-এর জন্য attractive।

---

## 17.4 Bulletproofs

Bulletproofs are:

- no trusted setup;
- discrete-log-based;
- range proofs-এর জন্য good।

Example range proof statement:

$$
\text{this value is in } [0,2^{64}).
$$

### Key property

Proof size:

$$
O(\log n)
$$

for a circuit of size $n$।

Verifier time:

$$
O(n).
$$

$O(n)$ verification large circuits-এর জন্য key limitation।

### Uses

Classic use:

- confidential transactions, such as Monero।

Quantised neural networks-এর জন্য increasingly relevant:

- range proofs certify int8 activations stay in:

$$
[-128,127].
$$

এটি zkML circuits-এ field-overflow attacks prevent করতে সাহায্য করে।

### Trade-off

Bulletproofs verification-এ succinct নয়, তাই million-gate ML circuits prove করার জন্য suitable নয়। কিন্তু 64-bit range proofs-এর জন্য slide says “unbeatable,” about 700 bytes with no setup।

---

# 18. Proof system comparison

| Feature | Groth16 | PLONK | STARKs | Bulletproofs |
|---|---:|---:|---:|---:|
| Trusted setup | per-circuit | universal | none | none |
| Assumption | pairings / EC | pairings / EC | hash-based collision resistance | discrete log |
| Post-quantum | no | no | yes | no |
| Proof size | about 200 B | about 500 B–1 KB | about 50–200 KB | $O(\log n)$ |
| Prover time | fast | medium | fast for large circuits | slow |
| Verifier time | about ms | about ms | about 10 ms | $O(n)$ |
| Applications | compact credentials/signatures | zkML, zkEVMs | large circuits | range proofs |

Slide emphasizes these indicative orders of magnitude এবং implementation/circuit-dependent।

## No universally best proof system

Choose based on:

- setup acceptable কি না;
- proof size budget;
- verifier hardware;
- post-quantum requirements;
- circuit static না changing।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** “No universally best proof system” explicitly stated। Constraints দেখে proof system choose করতে পারতে হবে।

---

# 19. AI security and privacy applications

## 19.1 Verifiable inference / zkML

Prove:

$$
\text{output } y \text{ was produced by committed model } M \text{ on input } x.
$$

এটি model substitution detect করে, যেমন provider 70B LLM-এর বদলে 7B distillate চালালে।

## 19.2 Training-data auditing

Prove যে training used only data with:

- valid licence;
- consent;
- anti-CSAM filters;

dataset reveal না করে।

Applications:

- copyright claims;
- GDPR;
- EU AI Act।

## 19.3 Model IP and watermark proofs

Weights $W$-এর ownership prove via commitment:

$$
h = H(W)
$$

weights reveal না করে।

অথবা watermark embedded আছে prove করা।

Uses:

- model theft protection;
- unauthorized distillation protection।

## 19.4 Federated-learning integrity

Each client prove করে local gradient update claimed data-তে honestly computed হয়েছে।

Purpose:

- poisoning block করা;
- free-riding block করা;
- local data private রাখা।

## Why AI systems need ZKPs

Models increasingly black-box services। Users inspect করতে পারে না:

- weights;
- data;
- execution।

ZKPs providers-কে verifiable claims করতে দেয়:

- “I ran this model”;
- “I trained on licensed data”;
- “I added DP noise”;

privacy বা IP ছেড়ে না দিয়ে।

---

# 20. Identity, compliance, and AI-era access control

## 20.1 Anonymous credentials for AI access

User prove করতে পারে:

- “I am a licensed professional”;
- “I am an adult”;
- “I am an employee of company X”;

model query করার সময়, প্রতিটি query stable identity-তে link না করে।

## 20.2 Proof-of-personhood against AI-generated content

Generative models-এর যুগে কোনো action-এর পেছনে human ছিল তা prove করা increasingly important।

ZKP-based credentials identity reveal না করে humans authenticate করতে পারে।

Use case:

- bot-generated influence-এর defence;
- ML-driven platforms-এ Sybil attacks-এর defence।

## 20.3 Verifiable ML services

Examples:

- “Your loan was denied because feature $x_i$ exceeded threshold $\tau$” — model leak না করে explainability।
- “This content-moderation decision ran the certified classifier” — IP loss ছাড়া audit।
- “My model $M$ correctly classified your image as cat” — next lecture’s zkML topic।

---

# 21. Performance reality check

Slide applications-কে maturity spectrum-এ রাখে:

- signatures: mature;
- credentials: mature;
- small CNNs: maturing;
- FL integrity: maturing;
- zkLLM: research।

## Prover/verifier asymmetry

Prover slow। Verifier fast।

এটি one-shot verification-এর জন্য ভালো:

- training run একবার audit করা;
- forever verify করা।

কিন্তু real-time applications difficult, কারণ model provider প্রতিটি inference-এর জন্য proof produce করতে substantial compute খরচ করবে।

---

# 22. Lecture 9.2 key takeaways

1. ZKP lets prover $P$ convince verifier $V$ of a statement without revealing anything else।
2. ZKPs completeness, soundness, zero-knowledge দিয়ে defined।
3. Colour-blind ball puzzle three-move commit–challenge–respond pattern দেখায়।
4. Schnorr three moves-এ discrete logarithm-এর knowledge prove করে।
5. Schnorr simulator দিয়ে zero-knowledge।
6. Schnorr-এ mod $p$ বনাম mod $q$ distinction crucial।
7. Fiat–Shamir hashing দিয়ে public-coin interactive proofs-কে non-interactive করে।
8. Any NP statement arithmetic circuit বা R1CS-এ compiled হতে পারে।
9. Modern SNARKs these constraints-এর satisfying assignment prove করে।
10. Proof system zoo:
    - Groth16: tiny proofs, per-circuit setup।
    - PLONK: universal setup, zkML workhorse।
    - STARKs: transparent, post-quantum, large circuits।
    - Bulletproofs: range proofs, no setup।
11. Rule of thumb:
    - signatures, identity, small-scale verifiable inference-এর জন্য production-ready;
    - large ML circuits from CNNs to LLMs research frontier।

---

# Lecture 9.3 — zkML: Zero-Knowledge Proofs for Machine Learning, From Federated Learning to LLMs

## 1. Learning objectives and roadmap

এই lecture শেষে তোমার পারা উচিত:

- ML pipelines কেন ZKPs থেকে benefit করে explain করা, integrity এবং privacy distinguish করে।
- ZK-FL sketch করা:
  - client-side update proofs;
  - verifiable aggregation।
- Neural network কীভাবে arithmetic circuit হয় describe করা।
- Bottlenecks identify করা:
  - non-linearities;
  - fixed-point arithmetic।
- zkLLM feasibility frontier discuss করা:
  - attention;
  - lookups।

Roadmap:

1. Recap and motivation: ZKP × ML।
2. ZKP for FL: verifiable updates and aggregation।
3. zkML for inference: circuits, bottlenecks, systems।
4. ZKP for LLMs: scale, attention, lookup arguments।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** এই objectives সম্ভবত zkML-এর main examinable concepts।

---

# 2. ZKP recap

Public statement $x$ এবং witness $w$, with:

$$
R(x,w) = 1,
$$

prover verifier-কে convince করে যে such $w$ exists without revealing $w$।

ZK proof $\pi$ may be only hundreds of bytes।

## Three properties

- **Completeness:** honest prover always convinces verifier।
- **Soundness:** cheating prover fails except with negligible probability।
- **Zero-knowledge:** verifier learns nothing beyond truth of $x$।

## Modern SNARKs and ML

Modern SNARKs in principle ML-ready:

- prover runs in near-linear time in circuit size;
- proofs are a few hundred bytes to a few KB regardless of circuit size;
- verification takes milliseconds।

Core question:

$$
\text{How large is } n \text{, the circuit size, for neural networks?}
$$

---

# 3. Why ML needs ZKPs

Lecture several use cases list করে।

## 3.1 Trustless inference

Question:

> Did the cloud really run $M$ on my input?

এটি provider’s computation verify করার ব্যাপার।

## 3.2 Model IP protection

Question:

> Can I prove accuracy without releasing $\theta$?

Model owner weights hide রেখে claims prove করতে চাইতে পারে।

## 3.3 Honest federated learning

Question:

> Did the client submit a valid update?

এটি poisoning এবং free-riding target করে।

## 3.4 Regulated AI compliance

Question:

> Was my credit score from an approved model?

এটি auditability target করে।

## 3.5 Content authenticity

Question:

> Is this image GenAI-produced or not?

এটি provenance এবং attribution target করে।

## 3.6 Private evaluation

Question:

> Can I evaluate $M$ on test data I keep hidden?

---

## 3.7 Two orthogonal goals

### Integrity

Re-executing না করে compute correctness।

This is verifiable ML।

### Privacy

Inputs, weights, and/or outputs confidential থাকে।

This is private ML।

Slide states:

> ZKPs give both at once — subject to cost.

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Integrity এবং privacy orthogonal। ZKPs both provide করতে পারে, কিন্তু cost limiting factor।

---

# 4. Three pillars of the lecture

## Pillar 1: ZKP for FL

Includes:

- verifiable updates;
- verifiable aggregation;
- defence against poisoning।

## Pillar 2: ZKP for ML inference

Includes:

- neural networks as circuits;
- ReLU;
- softmax;
- zkCNN;
- EZKL;
- Mystique।

## Pillar 3: ZKP for LLMs

Includes:

- transformers;
- attention;
- layernorm;
- zkLLM;
- lookup arguments।

---

# 5. Recap: FL কোথায় leak করে এবং SMPC কী fix করেনি

## 5.1 Two distinct risks in FL

### Privacy risk

Server বা eavesdropper client updates থেকে data reconstruct করে:

$$
\Delta_k.
$$

এটি gradient inversion।

Previous lecture-এর tool:

- SMPC / secure aggregation।

### Integrity risk

Client malicious update submit করে।

Tool:

- ZKP।

## 5.2 Why SMPC and ZKPs are complementary

Secure aggregation individual $\Delta_k$ hide করে, কিন্তু server কোনো way পায় না check করার যে each $\Delta_k$ honestly computed হয়েছে কি না।

ZKPs update properties prove করে এই gap fix করে।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** SMPC solves FL privacy, not FL integrity। ZKP secure aggregation-কে complement করে।

---

# 6. ZK-FL: আমরা কী prove করি?

## 6.1 Client-side proof: “my update is well-formed”

Client publishes masked update:

$$
\widetilde{\Delta}_k
$$

from secure aggregation, plus proof:

$$
\pi_k.
$$

Proof asserts:

1. Update previous global model-এর one step of SGD থেকে এসেছে:

$$
\theta^{(t-1)}.
$$

2. Local dataset committed Merkle root-এর সাথে match করে:

$$
root_k.
$$

3. Update bounded $L_2$ norm রাখে:

$$
\|\Delta_k\|_2 \leq B.
$$

Norm bound large poisoning attacks-এর বিরুদ্ধে defend করে।

## 6.2 Server-side proof: “aggregation was done correctly”

Server publishes:

$$
\theta^{(t)}
$$

and proves:

$$
\theta^{(t)} = \theta^{(t-1)} + \sum_{k \in S} p_k \Delta_k
$$

exactly those clients whose proofs passed-এর জন্য।

This prevents:

- silent dropping;
- reweighting।

## 6.3 One-sentence statement

Slide summarizes:

> Every client’s contribution passed a norm bound and was aggregated correctly.

এটি end-to-end auditable FL round দেয়।

---

# 7. Concrete example: bounded norm prove করা

## 7.1 Public inputs বনাম witness

Public statement $x$:

- commitment:

$$
Com(\Delta_k),
$$

- bound $B$;
- round ID।

Witness $w$:

- update:

$$
\Delta_k \in \mathbb{R}^d,
$$

- commitment randomness $r$।

## 7.2 Client-side pseudocode

Client computes:

```text
Delta_k = local_SGD(theta_global, D_k)    # private
r       = random()                        # private
com     = Commit(Delta_k, r)              # public
```

Statement:

$$
\text{I know }(\Delta_k,r)\text{ such that}
$$

$$
Com(\Delta_k,r) = com
$$

and:

$$
\sum_i \Delta_{k,i}^2 \leq B^2.
$$

Client produces:

```text
pi = ZK.Prove(
    public=(com, B),
    witness=(Delta_k, r),
    circuit=norm_bound_circuit
)
```

Then sends:

```text
(com, pi) -> server
```

## 7.3 Server-side verification

Server checks:

```text
if ZK.Verify(public=(com, B), proof=pi):
    include com in secure aggregation
else:
    reject client k
```

**[UNCLEAR]** Pseudocode says “include com in secure aggregation।” Context অনুযায়ী secure aggregation should aggregate updates বা masked updates, commitment itself নয়। Likely means “proof verify হলে client/update include করো,” কিন্তু transcript check দরকার।

## 7.4 Circuit checks

Circuit checks:

1. Norm bound:

$$
\sum_i \Delta_{k,i}^2 \leq B^2.
$$

This uses:

- $d$ multiplications;
- one range check।

2. Commitment consistency:

$$
Com(\Delta_k,r) = com.
$$

Cost depends on model size।

---

# 8. Correct SGD prove করা

## 8.1 Desired statement

Given:

- committed dataset $D_k$;
- previous model:

$$
\theta^{(t-1)};
$$

- learning rate:

$$
\eta;
$$

client’s update should be:

$$
\Delta_k = -\eta \cdot \nabla_\theta L(\theta^{(t-1)};D_k).
$$

Server aggregation:

$$
\theta^{(t)} = \theta^{(t-1)} + \sum_k p_k \Delta_k.
$$

## 8.2 Two nested challenges

### Forward pass

Forward pass circuit হিসেবে encode করতে হবে, inference-এর মতো।

### Backward pass

Backpropagation circuit size increase করে:

- each linear layer needs two extra matrix multiplications:
  - $\partial L / \partial x$;
  - $\partial L / \partial W$;
- non-linearity derivatives encode করতে হবে।

## 8.3 Practical compromise

Full training prove করার বদলে cheap invariants prove করা:

- norm bounds;
- structural properties;
- input domain constraints।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Full SGD proofs norm-bound proofs-এর চেয়ে harder। Practical compromise হলো cheaper invariants prove করা।

---

# 9. Putting it together: একটি ZK-FL round

## 9.1 Client side

1. Previous global model download:

$$
\theta^{(t-1)}.
$$

2. Local training produces:

$$
\Delta_k.
$$

3. Commit and mask update:

$$
\widetilde{\Delta}_k = Com(\Delta_k)
$$

as written on the slide।

4. Generate proof:

$$
\pi_k
$$

over the masked/committed update।

5. Upload:

$$
(\widetilde{\Delta}_k, \pi_k).
$$

## 9.2 Server side

6. Server verifies each:

$$
\pi_k.
$$

7. Aggregates surviving clients।

8. Publishes:

$$
\theta^{(t)}
$$

plus aggregation proof।

## 9.3 Security properties achieved

- **Privacy:** masking hides individual $\Delta_k$।
- **Integrity:** each $\Delta_k$ agreed invariants satisfy করে via $\pi_k$।
- **Accountability:** full round reproducibly auditable।

Slide says overhead in practice coursework-এ test করা যেতে পারে।

---

# 10. Scenarios for verifiable inference

## 10.1 Setup

Prover/server has:

- model $M$;
- input $x$।

Verifier assurance চায়:

$$
y = M(x).
$$

Prover sends:

$$
(y,\pi)
$$

to verifier।

## 10.2 What can be hidden

### Hide $x$

Verifier inference outsource করে এবং server no data learns।

### Hide $M$

Server model IP protect করে while client verifiable answer পায়।

### Hide both

Strongest guarantee, but hardest।

## 10.3 Difference from SMPC private inference

SMPC requires model owner to remain online throughout inference।

ZKPs are non-interactive:

- server commits to $M$ once;
- anyone offline can verify future claims:

$$
y = M(x).
$$

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Distinction জানো: SMPC interactive/online; ZKP offline verification support করে।

---

# 11. Example system: ezkl

Slide EZKL project-এর content visually দেখায়।

## 11.1 ezkl কী

`ezkl` is described as library and command-line tool for doing inference for deep learning models and computational graphs in a zk-SNARK / zkML setting।

## 11.2 Workflow shown on the slide

1. PyTorch বা TensorFlow-এ computational graph define করা, যেমন neural network।
2. Final graph `.onnx` file হিসেবে export করা এবং sample inputs `.json` file হিসেবে export করা।
3. `.onnx` এবং `.json` files `ezkl`-এ point করে ZK-SNARK circuit generate করা।

## 11.3 Example statements ezkl can prove

Slide example statements:

- “I ran this publicly available neural network on some private data and it produced this output.”
- “I ran my private neural network on some public data and it produced this output.”
- “I correctly ran this publicly available neural network on some public data and it produced this output.”

**[UNCLEAR]** Slide শুধু EZKL workflow visually দেখায়; detailed command sequence বা cost model slides-এ নেই।

---

# 12. Neural network as arithmetic circuit

## 12.1 Structure

Slide shows:

$$
x
\rightarrow W_1x + b_1
\rightarrow z = \operatorname{ReLU}(\cdot)
\rightarrow W_2z + b_2
\rightarrow \operatorname{softmax}
\rightarrow y.
$$

## 12.2 Main tension

Linear layers arithmetic circuits-এর native।

Non-linear operations encode করা awkward এবং almost always total cost dominate করে।

এটি SMPC lecture mirror করে: linear algebra relatively easy; non-linearities bottleneck।

---

# 13. ReLU problem and lookup arguments

## 13.1 ReLU is a comparison

$$
\operatorname{ReLU}(x) = \max(0,x).
$$

Arithmetic circuits শুধু add এবং multiply করতে পারে। $x$-এর sign-এর উপর branch করতে পারে না।

## 13.2 Method 1: bit decomposition

Decompose:

$$
x \rightarrow b_0,b_1,b_2,\ldots,b_k.
$$

Then:

- প্রতি bit-এ one constraint;
- sign check;
- reconstruct $x$।

Cost bit width-এর সাথে scale করে।

## 13.3 Method 2: lookup argument

ReLU represent করা হয় table of pairs দিয়ে:

$$
(x,y) \in \{(-3,0),(-2,0),\ldots,(n,n)\}.
$$

Then prove $(x,y)$ pre-built table-এর মধ্যে আছে, যেখানে all:

$$
(x,\operatorname{ReLU}(x))
$$

pairs আছে।

Slide says this is one lookup regardless of table size।

## 13.4 Why this matters for ML

Activations fixed bit width-এ quantise করা হয়। Then every non-linearity table হতে পারে:

- ReLU;
- GELU;
- sigmoid;
- softmax।

Protocols such as:

- Lasso;
- Caulk+;

aim to make proof cost nearly independent of table size।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Lookup arguments important কারণ non-linearities dominate zkML cost।

---

# 14. Fixed-point arithmetic in circuits

## 14.1 Problem

Neural networks floating-point numbers ব্যবহার করে।

SNARKs finite field-এর উপর কাজ করে:

$$
\mathbb{F}_p.
$$

$\mathbb{F}_p$-এ decimal point নেই।

In-circuit IEEE floating point simulate করা expensive। Slide specifically says division and exponentiation alone thousands of constraints cost করতে পারে।

## 14.2 Solution: quantise to an integer grid

Real $r$ represent করো:

$$
\hat{r} = \operatorname{round}(r \cdot 2^s).
$$

Slide এটাকে reals-কে integer grid-এ snap করা বলে।

Addition grid-এ থাকে।

Multiplication থাকে না।

## 14.3 Multiplication scale blow-up

If:

$$
\hat{x} \text{ represents } x \text{ at scale } 2^s,
$$

and:

$$
\hat{y} \text{ represents } y \text{ at scale } 2^s,
$$

then:

$$
\hat{x} \cdot \hat{y}
$$

is at scale:

$$
2^{2s}.
$$

তাই every multiply-এর পরে rescale দরকার।

## 14.4 Rescaling step

Write:

$$
\hat{z} = q \cdot 2^s + r
$$

with:

$$
0 \leq r < 2^s.
$$

Keep:

$$
q
$$

as the new rescaled value:

$$
\hat{z}'.
$$

Range-check $r$।

Slide says this uses one lookup per multiplication।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** Fixed-point arithmetic major zkML bottleneck: multiplication scale change করে, তাই rescaling এবং range checks দরকার।

---

# 15. ZK neural-network inference in papers: Mystique

Slide Mystique-এর diagram দেখায়।

Key visual elements:

- prover-provided witness;
- public commitment;
- Com-Auth conversion;
- authenticated input;
- linear layer;
- non-linear layer;
- authenticated output।

It labels:

- improved matrix multiplication;
- arithmetic-Boolean conversion;
- fixed-point floating-point conversion;
- features and model parameters as inputs।

**[UNCLEAR]** Slide Mystique diagram দেয় কিন্তু প্রতিটি component detail explain করে না। Transcript check করো যদি lecturer verbally explain করে থাকে:
- Com-Auth conversion;
- arithmetic-Boolean conversion;
- fixed-point floating-point conversion;
- authenticated input/output কীভাবে used হয়।

---

# 16. Bridging inference to LLMs: zkLLMs কেন challenging

## 16.1 Scale of circuit constraints

Slide forward pass per token-এর circuit constraints log scale-এ estimate করে:

| Model | Approximate constraints | Status marker |
|---|---:|---|
| MLP, 100k parameters | $10^5$ | deployable |
| ResNet, 25M parameters | $10^7$ | deployable |
| BERT-base, 110M parameters | $10^9$ | emerging |
| LLaMA-2, 7B parameters | $10^{10}$ | research |
| LLaMA-2, 70B parameters | $10^{11}$ | out of reach |
| GPT-4?, speculative 1.8T+ parameters | $10^{12+}$ | out of reach |

## 16.2 Scale problem

Billions of parameters imply billions of multiplications per token।

Autoregressive generation repeats forward pass once per output token।

Attention is:

$$
O(n^2)
$$

in sequence length।

Per-cell cost non-linear।

LLM-specific primitives ReLU ছাড়াও আছে:

- layernorm;
- RMSNorm in LLaMA;
- RoPE;
- gating।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** zkLLM difficulty শুধু “large matrix multiplies” নয়। Attention, normalization, RoPE, gating, autoregressive repetition—সব add করে।

---

# 17. Transformer block: circuits-এ কী লাগবে

Slide typical LLM structure দেখায়:

1. Sequence of tokens।
2. Embedding।
3. Repeated layers:

$$
\text{Layer} \times L.
$$

প্রতিটি repeated layer-এর মধ্যে:

- head;
- $Q$, $K$, $V$ projections;
- attention;
- concatenate and project;
- feed-forward MLP।

After layers:

- linear layer;
- softmax;
- sample output।

**[UNCLEAR]** Slide transformer block diagram দেয় কিন্তু প্রতিটি subcomponent কীভাবে arithmetised হয় explain করে না। Transcript check করো attention, softmax, layernorm/RMSNorm, RoPE verbally discussed হলে।

---

# 18. zkLLM: LLaMA-2 provable করা

## 18.1 Techniques from zkLLM, CCS 2024

Slide two key techniques list করে।

### Specialised lookup argument: tlookup

Tensor-shaped non-arithmetic operations-এর জন্য tailored specialized lookup argument।

Slide says it has zero asymptotic overhead।

### zkAttn

Attention mechanism-এর জন্য dedicated ZK proof, balancing:

- runtime;
- memory;
- accuracy।

## 18.2 zkAttn diagram

Diagram shows:

- $Q$, $K$, and $V$;
- matrix multiplication;
- normalization row-wise;
- output $Y$;
- verification of $\hat{z}$ indirectly;
- tlookups for each segment;
- $b$-ary segments of $Z'$;
- exponential terms such as $\exp(b^j\cdot)$.

**[UNCLEAR]** Slide zkAttn figure দেয় কিন্তু visible slide text-এ full derivation নেই। Lecturer normalization, segmented lookup, বা indirect verification of $\hat{z}$ explain করলে transcript check করো।

---

# 19. zkLLM reported results

Slide reports results from zkLLM paper for sequence length:

$$
2048.
$$

## 19.1 Table: overhead of zkLLM on OPT and LLaMA-2

| Model | OPT-125M | OPT-350M | OPT-1.3B | OPT-2.7B | OPT-6.7B | OPT-13B | LLaMA-2-7B | LLaMA-2-13B |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Committing time (s) | 11.8 | 33.1 | 127 | 273 | 654 | $1.27 \times 10^3$ | 531 | 986 |
| Commitment size (MB) | 0.996 | 1.67 | 3.32 | 4.58 | 7.22 | 10.1 | 7.97 | 11.0 |
| Prover time (s) | 73.9 | 111 | 221 | 352 | 548 | 713 | 620 | 803 |
| Proof size (kB) | 141 | 144 | 147 | 152 | 157 | 160 | 183 | 188 |
| Verifier time (s) | 0.342 | 0.593 | 0.899 | 1.41 | 2.08 | 3.71 | 2.36 | 3.95 |
| Memory usage (GB) | 1.88 | 2.38 | 3.71 | 6.60 | 15.0 | 22.9 | 15.5 | 23.1 |
| C4 perplexity, original | 26.56 | 22.59 | 16.07 | 14.34 | 12.71 | 12.06 | 7.036 | 6.520 |
| C4 perplexity, quantized | 26.65 | 22.66 | 16.12 | 14.37 | 12.73 | 12.07 | 7.049 | 6.528 |

**[UNCLEAR]** Values embedded slide image থেকে transcribed। Assessment-relevant হলে recording/original paper against exact numbers verify করো।

---

# 20. zkGPT: frontier push করা

Slide cites zkGPT, USENIX Security 2025।

Reported results:

- full GPT-2 inference;
- prover time less than 25 seconds;
- non-interactive proof around 101 KB।

Limitations:

- inference only;
- no training trajectories;
- quantised arithmetic only;
- long-sequence generation still needs recursion।

---

# 21. Proof composition

## 21.1 Challenge

Single monolithic proof of billion-parameter inference prover memory exceed করতে পারে।

Workaround:

- computation and proof by layers split করা।

Example:

$$
\text{Layer 1} \rightarrow \pi_1,
$$

$$
\text{Layer 2} \rightarrow \pi_2,
$$

$$
\text{Layer 3} \rightarrow \pi_3,
$$

up to:

$$
\text{Layer } L \rightarrow \pi_L.
$$

Then combine into:

$$
\pi_{\text{final}}
$$

as one succinct proof।

## 21.2 Candidate technique 1: recursive SNARKs

Recursive SNARKs prove that each:

$$
\pi_i
$$

verifies।

Then verifier of:

$$
\pi_{\text{final}}
$$

runs just one check।

## 21.3 Candidate technique 2: folding schemes

Examples listed:

- Nova;
- HyperNova;
- ProtoStar।

These accumulate many instances of the same circuit, amortising prover cost across layers।

Slide says folding active research direction।

---

# 22. Other emerging approaches

## 22.1 Distillation to SNARK-friendly models

Small student LLM train করা, e.g. 1B parameters, যার outputs larger teacher model track করে।

Architecture modify করে expensive primitives avoid করা:

- polynomial activations;
- no layernorm।

Trade-off:

$$
\text{lose accuracy} \quad \text{gain tractability}.
$$

## 22.2 Dishonest-prover-resistant approximation

Full inference prove করা নয়।

Instead, spot checks prove করা, such as:

> At random token $t$, the prover can open the forward pass.

এটি statistical soundness দেয় এবং expectation-এ much cheaper।

## 22.3 Hybrid TEE + ZKP

LLM Trusted Execution Environment-এ run করা, e.g. SGX।

Produce:

- TEE attestation;
- lightweight ZKP of the attestation।

এটি TEE alone-এর চেয়ে weaker trust assumption এবং pure ZKP-এর চেয়ে far cheaper।

---

# 23. Applications motivating zkLLM

## 23.1 Verifiable model serving

Cloud LLM provider prove করে যে user’s prompt-এ claimed model version serve করেছে, cheaper substitute নয়, weights reveal না করে।

## 23.2 Content provenance

Prove text specific LLM generated করেছে rather than human-written।

Goal:

- verifiable AI attribution;
- no prompt disclosure।

## 23.3 Regulated inference

Financial বা medical LLM prove করে regulated input-এ approved version run করেছে।

Slide links this to:

- EU AI Act;
- FDA AI guidance।

## 23.4 On-chain AI agents

Smart contracts trustlessly LLM outputs consume করতে চায়, such as:

- sentiment oracles;
- code review।

তাদের proofs দরকার যে LLM actually ran।

## 23.5 Why this is a live research frontier

Applications require proving times of seconds, not minutes।

Slide says usability reach করতে zkLLM-এর beyond আরও:

$$
10\text{–}100\times
$$

improvement দরকার।

---

# 24. Open problems and research directions

Slide crypto, ML, systems infrastructure across open problems group করে।

## 24.1 Crypto

- Matmul-aware lookup arguments।
- Floating-point proofs।
- Post-quantum zkML।

## 24.2 ML

- Polynomial activations।
- Linear attention।
- Quantisation limits।

## 24.3 Cross-discipline / central problems

- Verifiable training।
- SNARK-friendly architectures।
- Provable distillation।

Slide marks these as real cross-discipline problems needing both crypto and ML progress।

## 24.4 Systems infrastructure

- Multi-GPU proving।
- PyTorch / ONNX toolchains।
- MSM / NTT accelerators।

Slide marks systems infrastructure as enabling everything else।

---

# 25. Integrating zkML with other privacy tools

## 25.1 zkML + DP: verifiable privacy

DP-SGD দিয়ে trained model release করা plus ZKP proving that DP noise actually added with claimed standard deviation:

$$
\sigma.
$$

This solves:

> “trust me I added noise”

problem।

## 25.2 zkML + SMPC: private joint inference

Parties jointly inference compute করে via SMPC।

Output includes correctness-এর ZKP without revealing any party’s input।

## 25.3 zkML + FL + secure aggregation

Regulated collaborative learning-এর full stack:

- secure aggregation hides individual updates;
- client ZKPs bound norms বা honest training prove করে;
- server ZKP correct aggregation attest করে।

Slide states each primitive covers a gap others leave।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** zkML DP, SMPC, FL replace করে না; এগুলোর সাথে compose করে।

---

# 26. Threat-model considerations specific to zkML

## 26.1 What ZKPs do not protect against

### Model extraction through output leakage

If prover reveals:

$$
y = M(x),
$$

then repeated queries may still leak information about $M$।

ZKP only proves act of computation।

### Adversarial inputs

Prover input $x$ choose করতে পারে যা $M$-কে misbehave করায়।

Proof correct execution attest করে, answer-এর semantic correctness/desirability নয়।

### Training data poisoning

Proof যে $M$ dataset $D$-তে trained হয়েছে, সেটা বলে না $D$ legitimate কি না।

## 26.2 Composition of privacy properties

Slide states:

$$
\text{inference privacy} \neq \text{training privacy} \neq \text{output privacy}.
$$

zkML system clearly state করতে হবে কোন privacy property claim করছে এবং কোন properties other primitives-এর উপর rely করে:

- DP;
- SMPC;
- HE।

⚑ **পরীক্ষা/রিভিশন ফ্ল্যাগ:** ZKPs computation correctness prove করে। এগুলো automatically model extraction, adversarial inputs, poisoned data prevent করে না।

---

# 27. zkML roadmap

Roadmap slide 2017 through 2025 zkML-related work timeline দেখায়, including systems/papers such as:

- SafetyNets;
- Drynx;
- ZKDT;
- vCNN;
- ZEN;
- Mystique;
- VeriML;
- zkCNN;
- Hydra;
- zkMLaaS;
- ezDPS;
- Artemis;
- zkGPT;
- zkLLM;
- ZKML;
- lookup arguments;
- SpaGKR;
- zkLoRA।

**[UNCLEAR]** Slide visual timeline only। Provided slide text প্রতিটি paper-এর contribution explain করে না। Context হিসেবে use করো, কিন্তু transcript explain না করলে detailed technical claims-এর source হিসেবে নয়।

---

# 28. Lecture 9.3 key takeaways

1. zkML verifiability আনে যা SMPC এবং HE cannot: one prover, many offline verifiers, short certificates।
2. ZK-FL:
   - client proofs bound norms বা honest updates prove করে;
   - server proofs correct aggregation attest করে;
   - secure aggregation replace না করে complement করে।
3. zkML inference:
   - linear layers cheap;
   - non-linearities dominate;
   - lookup arguments speed improve করতে সাহায্য করে।
4. zkLLM:
   - single-step inference now within reach;
   - full pre-training এবং long-sequence autoregressive generation open।
5. Rule of thumb:
   - deployable today: FL update proofs and small-model inference;
   - emerging: transformers;
   - research: LLM pre-training and long-form generation।
6. Compose primitives:
   - zkML + DP for verifiable privacy;
   - zkML + SMPC for private joint inference;
   - zkML + FL for regulated collaborative learning।

---

# Cross-lecture connections

## 1. SMPC এবং ZKP ভিন্ন gap solve করে

Lecture 9.1 থেকে:

- SMPC parties-কে private inputs-এর উপর compute করতে দেয়।
- Secure aggregation individual FL updates hide করে।

Lecture 9.3 থেকে:

- secure aggregation hides updates but does not check whether they are valid।
- ZKPs update properties prove করে integrity add করে।

Connection:

$$
\text{SMPC/secure aggregation} = \text{privacy}
$$

$$
\text{ZKP} = \text{integrity/verifiability}
$$

Together they support privacy-preserving and auditable FL।

---

## 2. Secret sharing এবং secure aggregation

Lecture 9.1-এর Shamir sharing directly robust FL secure aggregation support করে।

Reason:

- pairwise masks cancel only if all relevant clients remain;
- dropped clients break cancellation;
- Shamir sharing surviving clients-কে dropped clients-এর mask seeds reconstruct করতে দেয়।

---

## 3. Beaver triples এবং arithmetic circuits দুটিই computation-কে algebra-তে reduce করে

SMPC arithmetic sharing এবং Beaver triples ব্যবহার করে secret-shared values-এর উপর additions ও multiplications compute করে।

ZKPs computations-কে arithmetic circuits/R1CS-এ compile করে $+$ এবং $\times$ gates দিয়ে।

Shared theme:

$$
\text{general computation} \rightarrow \text{algebraic operations}.
$$

---

## 4. Non-linearities SMPC ML এবং zkML দুই ক্ষেত্রেই bottleneck

Lecture 9.1:

- SMPC addition/multiplication naturally handles;
- ReLU/comparisons expensive।

Lecture 9.3:

- arithmetic circuits addition/multiplication naturally handles;
- ReLU, softmax, GELU, sigmoid need bit decomposition or lookup arguments;
- fixed-point and range checks add cost।

Connection:

$$
\text{linear layers cheap, non-linear layers expensive}
$$

recurring theme।

---

## 5. Fiat–Shamir এবং zkML deployment

Lecture 9.2:

- Fiat–Shamir interactive proofs-কে non-interactive proofs-এ convert করে।

Lecture 9.3:

- verifiable inference benefits from non-interactive proofs because many offline verifiers can check:

$$
y = M(x)
$$

model owner-এর সাথে online না থেকে।

---

## 6. Proof systems determine zkML feasibility

Lecture 9.2 compares:

- Groth16;
- PLONK;
- STARKs;
- Bulletproofs।

Lecture 9.3 applies this to ML:

- PLONK-like systems and lookup arguments useful for zkML frameworks;
- STARK-style scaling large circuits-এর জন্য matters;
- Bulletproofs/range proofs quantized values and range constraints-এর জন্য matter।

---

# Consolidated exam/revision flags

## High-priority definitions

তোমার define করতে পারা উচিত:

- SMPC।
- Correctness and privacy in SMPC।
- Semi-honest versus malicious adversaries।
- Additive secret sharing।
- Shamir secret sharing।
- Beaver triple।
- Secure aggregation।
- Zero-knowledge proof।
- Completeness, soundness, zero-knowledge।
- Witness, statement, relation $R(x,w)$।
- Schnorr protocol।
- Fiat–Shamir transform।
- Arithmetic circuit।
- R1CS।
- zk-SNARK।
- Lookup argument।
- zkML।

## High-priority calculations

তোমার work through করতে পারা উচিত:

1. Additive sharing reconstruction:

$$
s = \sum_i s_i \pmod p.
$$

2. Additive share addition।

3. Shamir share generation:

$$
q(x)=s+a_1x+\cdots+a_tx^t.
$$

4. Lagrange interpolation:

$$
q(x)=\sum_i y_iL_i(x),
$$

$$
L_i(x)=\prod_{j\neq i}\frac{x-x_j}{x_i-x_j}.
$$

5. Beaver triple multiplication protocol and correctness derivation:

$$
(a+\epsilon)(b+\delta)=ab+\epsilon b+\delta a+\epsilon\delta.
$$

6. Secure aggregation-এ pairwise mask cancellation।

7. Schnorr transcript verification:

$$
g^s \stackrel{?}{=} t y^c \pmod p.
$$

8. Schnorr completeness derivation।

9. Small arithmetic circuit-এর জন্য R1CS constraint তৈরি করা।

10. zkML fixed-point rescaling:

$$
\hat{z}=q2^s+r,\quad 0\leq r<2^s.
$$

## Common-mistake / warning flags

- Schnorr-এ:
  - exponents reduce mod $q$;
  - group elements reduce mod $p$।
- Beaver triples-এ:
  - local shares satisfy করে না $a_i b_i = c_i$;
  - only global values satisfy $c=ab$।
- Fiat–Shamir-এ:
  - all public inputs এবং verifier-visible data hash করো।
- zkML-এ:
  - correct execution-এর ZKP model’s answer semantically “correct” prove করে না।
  - inference privacy, training privacy, output privacy আলাদা।
- FL-এ:
  - secure aggregation hides updates but does not prove updates are honest।

---

# Unclear sections to check in recording/transcript

1. **Missing transcript:** Zip বা message-এ transcript ছিল না, তাই notes lecturer-specific spoken explanations, spoken exam hints, বা verbal clarifications reflect করতে পারে না।

2. **Lecture 9.1 Beaver example arithmetic:** Slide’s Party 1 computation says:

$$
8+2\cdot4+17\cdot2+2\cdot17=84\equiv15.
$$

But displayed arithmetic appears to sum to $80$, not $84$। Recording verify করো।

3. **Lecture 9.1 secure aggregation signs:** Pairwise masking convention এবং worked example $r_{13}$-এর জন্য inconsistent signs ব্যবহার করে। Masks still cancel, কিন্তু convention clarify করা দরকার।

4. **Lecture 9.2 “w.n.p.”:** Soundness explanation-এর abbreviation check করা দরকার। Likely “with negligible probability।”

5. **Lecture 9.2 rewinding extractor:** Key takeaways Schnorr proof-of-knowledge-এর জন্য rewinding extractor mention করে, কিন্তু slides explain করে না।

6. **Lecture 9.3 ZK-FL pseudocode:** Slide says include `com` in secure aggregation। Context suggests proof verification-এর পরে client/update include করা, কিন্তু confirm দরকার।

7. **Lecture 9.3 Mystique diagram:** Several labels shown but not explained in slide text, including Com-Auth conversion and arithmetic-Boolean conversion।

8. **Lecture 9.3 transformer / zkAttn diagrams:** Slides important diagrams দেখায় কিন্তু full protocol derivation দেয় না।

9. **Lecture 9.3 zkLLM table:** Table embedded image থেকে transcribed। Exact numbers exam-relevant হলে verify করা দরকার।

10. **Lecture 9.3 zkML roadmap:** Timeline many systems/papers list করে কিন্তু each contribution explain করে না।
