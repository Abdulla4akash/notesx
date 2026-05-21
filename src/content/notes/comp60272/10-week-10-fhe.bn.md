---
subject: COMP60272
chapter: 10
title: "Week 10: FHE"
language: bn
---

# সপ্তাহ ১০ অধ্যয়ন-নোট — Fully Homomorphic Encryption

কোর্স: **COMP60272 – Security and Privacy of AI**  
লেকচার বিষয়: **সপ্তাহ ১০ — Fully Homomorphic Encryption (FHE): ভিত্তি, worked examples, ML প্রয়োগ, এবং machine learning-এর জন্য FHE লাইব্রেরি।**  
[UNCLEAR: আপলোড করা `Week10.zip`-এ শুধু দুটি slide PDF ছিল — `w10.1_Slides_FHE_Intro.pdf` এবং `w10.3_slides_FHE_for_ML.pdf`। কোনো transcript file বা pasted transcript ছিল না, তাই transcript-only ব্যাখ্যা, মৌখিক exam hints, এবং কোনো spoken clarification এখানে ধরা যায়নি।]

# বিষয় ও পরিধি

এই সপ্তাহে **Fully Homomorphic Encryption (FHE)** পরিচয় করানো হয়েছে: encrypted data-এর উপর computation করার একটি পদ্ধতি হিসেবে। এরপর মূল cryptographic ধারণাগুলিকে **machine-learning workloads**-এর সঙ্গে যুক্ত করা হয়েছে, যেমন encrypted logistic regression, federated-learning aggregation, encrypted CNN inference, এবং আধুনিক FHE libraries।

বৃহত্তর কোর্সের সঙ্গে সংযোগ হলো **privacy-preserving AI**: FHE-কে এমন একটি পদ্ধতি হিসেবে দেখানো হয়েছে, যেখানে একটি server client-এর private input সরাসরি না দেখে model বা computation evaluate করতে পারে।

---

# Lecture 10.1 — Fully Homomorphic Encryption-এর পরিচিতি

## 1. Learning objectives এবং lecture style

### Learning objectives

লেকচার শেষে শিক্ষার্থীদের পারা উচিত:

- **Fully Homomorphic Encryption** কী, এক বাক্যে বলা।
- concrete example ব্যবহার করে **PHE**, **SHE**, এবং **FHE** আলাদা করা।
- ছোট সংখ্যার computation হাতে ধরে করা:
  - RSA homomorphic multiplication।
  - DGHV encryption/decryption এবং noise growth।
- ব্যাখ্যা করা:
  - homomorphic operation করলে noise কেন বাড়ে।
  - multiplication কেন প্রধান bottleneck।
  - bootstrapping কী ঠিক করে।
- **চারটি FHE generation** চিনতে পারা।
- sketch করা:
  - FHE-এর অধীনে linear classifier কীভাবে চলে।
  - homomorphic encryption-এর অধীনে federated-learning aggregator কীভাবে চলে।

🚩 **EXAM FLAG — learning objectives:** এগুলো slide-এ সরাসরি “By the end of this lecture you should be able to” হিসেবে দেওয়া। Exam revision-এর জন্য এগুলো high-value target।

### Lecture style

লেকচারে ইচ্ছাকৃতভাবে **ছোট সংখ্যা** ব্যবহার করা হয়েছে, যাতে প্রতিটি ধাপ হাতে যাচাই করা যায়। ফোকাস cryptanalysis নয়; FHE ML systems-কে কী দেয় সেটাই মূল।

---

# 2. Motivating problem: encrypted data-এর উপর cloud computing

## 2.1 Setting

Alice-এর private data আছে:

```latex
x
```

Slides-এর example:

- MRI scan।
- Credit history।
- Feature vector।

Server-এর কাছে একটি function আছে:

```latex
f
```

Examples:

- Neural network।
- SQL query।
- Model।

লক্ষ্য হলো server যেন compute করে:

```latex
f(x)
```

কিন্তু কখনোই `x` দেখতে না পায়।

## 2.2 Protocol

Protocolটি হলো:

1. Alice `x`-এর প্রতিটি bit বা number encrypt করে:

```latex
c_i = \operatorname{Enc}_{pk}(x_i)
```

এবং ciphertext server-এ পাঠায়।

2. Server homomorphically `f` evaluate করে, ফলে পায়:

```latex
c = \operatorname{Enc}_{pk}(f(x))
```

3. Alice decrypt করে:

```latex
y = \operatorname{Dec}_{sk}(c) = f(x)
```

Server `x` সম্পর্কে কিছু শেখে না।

## 2.3 Intuition

Server encrypted data-এর সঙ্গে এমনভাবে কাজ করে যেন সেটি ordinary data। Server ciphertext manipulate করে, এবং Alice final ciphertext decrypt করলে original plaintext-এর উপর computation-এর result পায়।

---

# 3. “Homomorphic” বলতে কী বোঝায়

## 3.1 Intuition

কোনো encryption scheme **homomorphic** যদি ciphertext-এর উপর operation করা plaintext-এর উপর অর্থপূর্ণ operation করার সমতুল্য হয়।

Plaintext world:

```latex
a \star b
```

Ciphertext world:

```latex
\operatorname{Enc}(a) \circ \operatorname{Enc}(b)
```

Ciphertext-side operation `\circ` যেন plaintext-side operation `\star`-কে mirror করে।

## 3.2 Formal definition

কোনো encryption scheme operation `\star`-এর জন্য homomorphic যদি এমন ciphertext-side operation `\circ` থাকে যে:

```latex
\operatorname{Dec}\big(\operatorname{Enc}(a) \circ \operatorname{Enc}(b)\big) = a \star b
```

Keys সহ আরও explicitভাবে:

```latex
\operatorname{Dec}_{sk}\big(\operatorname{Enc}_{pk}(a) \circ \operatorname{Enc}_{pk}(b)\big) = a \star b
```

## 3.3 তিনটি flavour

### Multiplicatively homomorphic encryption

শুধু multiplication support করে।

Example:

- Textbook RSA।

Meaning:

```latex
\operatorname{Enc}(a) \cdot \operatorname{Enc}(b)
```

decrypt করলে পাওয়া যায়:

```latex
a \cdot b
```

### Additively homomorphic encryption

শুধু addition support করে।

Example:

- Paillier, 1999।

এটি **federated-learning aggregation**-এর জন্য useful, যেখানে server-কে updates বা gradients-এর sum দরকার।

### Fully homomorphic encryption

Addition এবং multiplication — দুটোই unlimited depth-এ support করে।

Example lineage:

- Gentry, 2009 এবং পরের schemes।

Lecture-এর flavour table থেকে definition:

- **FHE** supports both `+` and `\times`, unlimited times।

---

# 4. Glove-box analogy

## 4.1 গল্প

Alice একটি jewellery shop চালায়। সে চায় workers gold এবং gems দিয়ে jewellery assemble করুক, কিন্তু সে তাদের বিশ্বাস করে না যে তারা চুরি করবে না।

Solution:

- Materials একটি transparent locked glove box-এ রাখা।
- Workers gloves ব্যবহার করে contents manipulate করতে পারে।
- Workers materials বের করতে পারে না।
- Alice-এর কাছে একমাত্র key থাকে।

## 4.2 FHE mapping

| Glove-box analogy | FHE meaning |
|---|---|
| Materials সহ locked glove box | Ciphertext |
| Worker gloves দিয়ে contents manipulate করে | Server `\operatorname{Eval}(f, \operatorname{Enc}(x))` চালায় |
| Alice তার key দিয়ে unlock করে | Client `sk` দিয়ে decrypt করে |
| Worker কখনো materials বের করে না | Server কখনো `x` বা `f(x)` শেখে না |

## 4.3 Intuition

Ciphertext একটি locked box-এর মতো। Server এখনো “ভেতরের” জিনিসের উপর operations করতে পারে, কিন্তু plaintext inspect বা extract করতে পারে না।

---

# 5. প্রধান FHE schemes-এর timeline

Slides-এ 2009 থেকে 2017 পর্যন্ত major FHE schemes-এর timeline দেখানো হয়েছে।

## 5.1 দেখানো প্রধান schemes

- 2009: Gentry scheme।
- 2010: DGHV scheme।
- 2011: BV scheme।
- 2012: BGV scheme।
- 2012: Brakerski scheme।
- 2012: LTV scheme।
- 2012: FV scheme।
- 2013: YASHE scheme।
- 2013: GSW scheme।
- 2015: FHEW scheme।
- 2016: TFHE scheme।
- 2017: CKKS scheme।

## 5.2 Timeline-এর families

Slide legend schemes-গুলোকে group করেছে:

- **Ideal lattices**-based schemes।
- **AGCD problem**-based schemes।
- **LWE and RLWE problems**-based schemes।
- **NTRU**-based schemes।

Connection: পরের slides বিশেষভাবে **DGHV**, **BGV/BFV**, **GSW**, এবং **CKKS**-কে FHE-এর four-generation view হিসেবে focus করে।

---

# 6. Worked example: RSA multiplicatively homomorphic

## 6.1 RSA recap

RSA public key:

```latex
(N, e)
```

RSA private key:

```latex
d
```

Encryption:

```latex
c = m^e \bmod N
```

Decryption:

```latex
m = c^d \bmod N
```

## 6.2 Homomorphic property

Given:

```latex
c_1 = m_1^e \bmod N
```

```latex
c_2 = m_2^e \bmod N
```

Ciphertexts multiply করলে:

```latex
c_1 \cdot c_2
= m_1^e \cdot m_2^e
= (m_1m_2)^e
= \operatorname{Enc}(m_1 \cdot m_2)
\pmod N
```

তাই ciphertext multiply করা plaintext multiply করার সমতুল্য।

## 6.3 ছোট সংখ্যার worked example

Given:

```latex
N = 33 = 3 \times 11
```

```latex
e = 3
```

```latex
d = 7
```

Plaintexts:

```latex
m_1 = 4
```

```latex
m_2 = 5
```

### Step 1: `m_1` encrypt করা

```latex
c_1 = 4^3 \bmod 33
```

```latex
4^3 = 64
```

```latex
64 \bmod 33 = 31
```

So:

```latex
c_1 = 31
```

### Step 2: `m_2` encrypt করা

```latex
c_2 = 5^3 \bmod 33
```

```latex
5^3 = 125
```

```latex
125 \bmod 33 = 26
```

So:

```latex
c_2 = 26
```

### Step 3: Ciphertexts multiply করা

```latex
c_1 \cdot c_2 = 31 \cdot 26 \bmod 33
```

```latex
31 \cdot 26 = 806
```

```latex
806 \bmod 33 = 14
```

তাই encrypted product:

```latex
14
```

### Step 4: Decrypt করা

```latex
14^7 \bmod 33 = 20
```

### Step 5: Plaintext multiplication check

```latex
m_1 \cdot m_2 = 4 \cdot 5 = 20
```

Decrypted result match করে।

## 6.4 RSA-তে কী নেই

RSA ciphertext addition অর্থপূর্ণভাবে করতে পারে না:

```latex
c_1 + c_2
```

এটি decrypt করে পাওয়া যায় না:

```latex
m_1 + m_2
```

তাই RSA **partially homomorphic**: এটি শুধু একটি operation support করে।

Slides-এর connection:

- Ciphertext addition-এর জন্য Paillier ব্যবহার।
- `+` এবং `\times` দুটোর জন্য FHE ব্যবহার।

🚩 **EXAM FLAG — worked example:** Key takeaways slide explicitভাবে RSA example on `N=33` হাতে verify করতে পারা উচিত বলে।

---

# 7. PHE থেকে SHE থেকে FHE

## 7.1 Partially Homomorphic Encryption

**PHE** supports:

- একটি operation।
- Unlimited times।

Examples:

- RSA।
- Paillier।

RSA multiplication support করে। Paillier addition support করে।

## 7.2 Somewhat Homomorphic Encryption

**SHE** supports:

- Addition এবং multiplication — দুটোই।
- কিন্তু limited depth পর্যন্ত।

Examples from slides:

- DGHV over `\mathbb{Z}`।
- BGN, 2005।

Limitation হলো ciphertexts noise accumulate করে। অতিরিক্ত computation হলে decryption fail করে।

## 7.3 Fully Homomorphic Encryption

**FHE** supports:

- Addition এবং multiplication — দুটোই।
- Unlimited depth।

Examples:

- Gentry, 2009 এবং পরের schemes।

## 7.4 SHE যথেষ্ট নয় কেন

SHE scheme addition এবং multiplication দুটোই evaluate করতে পারে, কিন্তু setup-এ chosen bounded depth-এর circuit পর্যন্ত।

Deep computations যেমন ResNet inference অনেক multiplicative layers চাইতে পারে। Ciphertext refresh করার mechanism ছাড়া ciphertext too noisy হয়ে যায়।

এটি ঠিক করে **bootstrapping**।

## 7.5 `\{+, \times\}`-এর universality

Slides দুটি universality fact বলে:

1. যেকোনো Boolean function XOR এবং AND gates-এর circuit হিসেবে লেখা যায় over:

```latex
\mathbb{Z}_2
```

যেখানে:

- XOR corresponds to addition।
- AND corresponds to multiplication।

2. যেকোনো arithmetic function একটি polynomial দিয়ে approximate করা যায়।

তাই কোনো encryption scheme যদি unlimited depth-এ `+` এবং `\times` support করে, সেটি general functions compute করতে পারে।

---

# 8. DGHV scheme over the integers

## 8.1 Lecture-এ DGHV-এর উদ্দেশ্য

DGHV-কে সবচেয়ে simple FHE-style scheme হিসেবে দেখানো হয়েছে, যা লিখে এবং হাতে compute করা যায়।

এটি cryptanalysis-এর জন্য নয়; এটি দেখানোর জন্য:

- Ciphertext noise কীভাবে কাজ করে।
- Addition কেন cheap।
- Multiplication কেন expensive।
- Bootstrapping কেন দরকার।

## 8.2 Secret key

Secret key হলো একটি odd integer:

```latex
p
```

Practice-এ `p` বড়।

## 8.3 একটি bit-এর ciphertext

Plaintext bit:

```latex
m \in \{0,1\}
```

Ciphertext:

```latex
c = q \cdot p + 2r + m
```

যেখানে:

- `q` একটি large random integer।
- `r` একটি small random noise integer।
- `m` plaintext bit।

## 8.4 Decryption

Decryption:

```latex
m = (c \bmod p) \bmod 2
```

## 8.5 Decryption কাজ করে কেন

শুরু করি:

```latex
c = qp + 2r + m
```

Mod `p` নিলে:

```latex
c \bmod p = 2r + m
```

provided noise যথেষ্ট small, specifically:

```latex
|2r + m| < \frac{p}{2}
```

centred residue interpretation ব্যবহার করলে।

Then:

```latex
(2r + m) \bmod 2 = m
```

কারণ:

```latex
2r
```

even।

## 8.6 Noise condition

Critical condition:

```latex
|r| \ll p
```

Noise allowed threshold ছাড়িয়ে গেলে decryption garbage return করে।

## 8.7 Real parameters বনাম lecture parameters

Slide-এর real DGHV parameters:

- Ciphertext size:

```latex
|c| \approx 10^7 \text{ bits}
```

- Secret key size:

```latex
|p| \approx 2700 \text{ bits}
```

- Noise size:

```latex
|r| \approx 71 \text{ bits}
```

লেকচারে tiny numbers ব্যবহার করা হয়েছে যাতে arithmetic এক slide-এ fit করে।

---

# 9. Worked example: DGHV in action এবং noise problem

## 9.1 Setup

Secret key:

```latex
p = 29
```

Encryption rule:

```latex
c = qp + 2r + m
```

Plaintexts:

```latex
m_1 = 1
```

```latex
m_2 = 0
```

For `m_1`:

```latex
q_1 = 2, \quad r_1 = 1
```

For `m_2`:

```latex
q_2 = 3, \quad r_2 = 1
```

## 9.2 `m_1 = 1` encrypt করা

```latex
c_1 = 2 \cdot 29 + 2 \cdot 1 + 1
```

```latex
c_1 = 58 + 2 + 1 = 61
```

So:

```latex
c_1 = 61
```

## 9.3 `m_2 = 0` encrypt করা

```latex
c_2 = 3 \cdot 29 + 2 \cdot 1 + 0
```

```latex
c_2 = 87 + 2 = 89
```

So:

```latex
c_2 = 89
```

## 9.4 `c_1` decrypt করা

```latex
61 \bmod 29 = 3
```

```latex
3 \bmod 2 = 1
```

So decryption recovers:

```latex
m_1 = 1
```

---

## 9.5 Homomorphic addition

### Algebraic derivation

```latex
c_1 = q_1p + 2r_1 + m_1
```

```latex
c_2 = q_2p + 2r_2 + m_2
```

Add:

```latex
c_1 + c_2
= (q_1 + q_2)p + 2(r_1 + r_2) + (m_1 + m_2)
```

এটি DGHV ciphertext-এর same structural form রাখে, কিন্তু নতুন noise:

```latex
r_1 + r_2
```

তাই addition-এর অধীনে noise growth linear।

### Concrete calculation

```latex
c_1 + c_2 = 61 + 89 = 150
```

Decrypt:

```latex
150 \bmod 29 = 5
```

```latex
5 \bmod 2 = 1
```

যেহেতু:

```latex
m_1 + m_2 = 1 + 0 = 1
```

result correct।

### New noise

```latex
r_1 + r_2 = 1 + 1 = 2
```

Addition noise gently বাড়ায়।

---

## 9.6 Homomorphic multiplication

### Algebraic derivation

শুরু করি:

```latex
c_1 = q_1p + 2r_1 + m_1
```

```latex
c_2 = q_2p + 2r_2 + m_2
```

Multiply:

```latex
c_1c_2 = (q_1p + 2r_1 + m_1)(q_2p + 2r_2 + m_2)
```

যেসব term-এ factor `p` আছে, সেগুলো group করা যায়:

```latex
q''p
```

Remaining non-`p` part:

```latex
(2r_1 + m_1)(2r_2 + m_2)
```

Expand:

```latex
(2r_1 + m_1)(2r_2 + m_2)
= 4r_1r_2 + 2r_1m_2 + 2r_2m_1 + m_1m_2
```

Even terms group করলে:

```latex
= 2(2r_1r_2 + r_1m_2 + r_2m_1) + m_1m_2
```

So:

```latex
c_1c_2
= q''p + 2(2r_1r_2 + r_1m_2 + r_2m_1) + m_1m_2
```

এটি ciphertext-এর same form রাখে, কিন্তু নতুন noise approximately multiplicative।

Slides এটি summarise করে:

```latex
\text{new noise} \sim r_1r_2
```

### Concrete calculation

```latex
c_1c_2 = 61 \cdot 89 = 5429
```

Decrypt:

```latex
5429 \bmod 29 = 6
```

```latex
6 \bmod 2 = 0
```

Plaintext multiplication:

```latex
m_1m_2 = 1 \cdot 0 = 0
```

Result correct।

## 9.7 DGHV example-এর key lesson

Addition:

- Noise linearly grow করে।
- Cheap।

Multiplication:

- Noise multiplicatively grow করে।
- Expensive।
- Main bottleneck।

🚩 **EXAM FLAG — DGHV worked example:** Key takeaways slide explicitভাবে `p=29` সহ DGHV example হাতে verify করতে পারা উচিত বলে।

---

# 10. The depth wall

## 10.1 Depth wall কী?

**Depth wall** হলো সেই point যেখানে ciphertext noise এত বেড়ে যায় যে decryption fail করে।

Fresh ciphertext-এর বড় remaining noise budget থাকে। প্রতিটি operation কিছু budget consume করে।

- Addition tiny amount consume করে।
- Multiplication large amount consume করে।

Budget exhausted হলে ciphertext “dead”: এটি আর correctly decrypt করে না।

## 10.2 Repeated multiplications-এর পর noise growth

Slides বলে:

```latex
\text{noise after } d \text{ multiplications} \sim r^{2^d}
```

Bit sizes ব্যবহার করে:

```latex
|r| \approx 71 \text{ bits}
```

```latex
|p| \approx 2700 \text{ bits}
```

Requirement:

```latex
71 \cdot 2^d < 2700
```

এই budget about 5–6 multiplicative levels-এর পর exhausted হয়।

## 10.3 ML-এর জন্য কেন গুরুত্বপূর্ণ

একটি neural-network layer অন্তত একটি multiplication চায়:

```latex
\text{weights} \times \text{inputs}
```

Deep CNNs অনেক carefully redesign না করলে tens of multiplicative levels চাইতে পারে।

তাই:

- Bootstrapping ছাড়া encrypted data-তে deep neural networks impossible।
- FHE-based ML-এ multiplication bottleneck।
- Addition comparatively cheap।

🚩 **EXAM FLAG — “key takeaway” slide wording:** DGHV/noise slide explicitভাবে “The depth wall” কে key takeaway হিসেবে label করে।

---

# 11. Bootstrapping

## 11.1 Glove-box wear analogy

Lecture glove-box analogy extend করে।

একটি glove box কাজ করে, কিন্তু প্রতিটি operation সেটিকে wear down করে:

- Fresh box: অনেক operations বাকি।
- Worn box: অল্প operations বাকি।
- Dead box: contents ruined।

Mapping:

| Glove-box wear | FHE |
|---|---|
| প্রতিটি manipulation box একটু wear করে | প্রতিটি homomorphic operation noise বাড়ায় |
| Box-এর finite lifespan আছে | Noise-এর hard ceiling `p/2` আছে |
| Worn-out box jewellery ruin করে | Noisy ciphertext decrypt fail করে |

## 11.2 Problem

Bob, worker/server, একটি box/ciphertext যত operation support করে তার চেয়ে বেশি operation দরকার।

Naively Alice/client-কে করতে হতো:

1. ফিরে আসা।
2. Worn box unlock করা।
3. Half-finished object fresh box-এ move করা।
4. Fresh box lock করা।

কিন্তু এতে outsourcing computation-এর উদ্দেশ্য নষ্ট হয়।

## 11.3 Nested-box trick

Alice Bob-কে দুটি boxes দেয়:

- Box A: worn, half-finished jewellery আছে।
- Box B: fresh।

Alice Box B lock করার আগে Box A-এর key Box B-এর ভিতরে রাখে।

Bob তখন:

1. Worn Box A fresh Box B-এর মধ্যে রাখে।
2. Box B-এর gloves দিয়ে reach করে।
3. B-এর ভিতরে থাকা key দিয়ে A খুলে।
4. B-এর ভিতর থেকেই A open করে।
5. Half-finished jewellery B-তে move করে।
6. Fresh Box B-তে কাজ চালিয়ে যায়।

Alice process চলাকালে কিছুই open করে না।

## 11.4 Nested boxes থেকে FHE bootstrapping mapping

| Glove-box trick | Bootstrapping |
|---|---|
| Worn box A with half-finished jewellery | Noisy ciphertext `c`, almost dead |
| Fresh box B | Second encryption layer |
| Drop key A inside B | Secret key encrypt করা: `\operatorname{Enc}(sk)` |
| Bob B-এর ভিতর থেকে A unlock করে | New layer-এর ভিতরে decryption homomorphically run করা |
| Fresh B-তে continue | Low noise সহ fresh ciphertext `c^\star` output |

## 11.5 Bootstrapping formula

Slide gives:

```latex
\operatorname{Bootstrap}(c)
=
\operatorname{Eval}(\operatorname{Dec}, c, \operatorname{Enc}(sk))
=
c^\star
```

with:

```latex
\operatorname{Dec}(c^\star) = m
```

## 11.6 Definition in words

Bootstrapping হলো:

> FHE নিজের decryption circuit-কে secret key-এর encrypted copy-এর উপর evaluate করে।

Output:

- Fresh ciphertext।
- Same plaintext encrypt করে।
- Low noise সহ।

## 11.7 Bootstrapping কীভাবে full homomorphism দেয়

Ciphertext too noisy হলে তাকে bootstrap করে fresh ciphertext-এ ফিরিয়ে আনা হয়। তারপর আরও operations চলতে পারে।

এটি limited-depth homomorphic computation-কে unlimited-depth FHE-তে turn করে।

## 11.8 Bootstrapping cost

Slide notes:

- Bootstrapping expensive।
- Gentry-Halevi 2011 first implementation: parameters অনুযায়ী প্রতি bootstrap tens of seconds থেকে roughly half an hour।
- Recent GPU work কিছু settings-এ sub-second CKKS bootstrapping demonstrate করেছে।

🚩 **EXAM FLAG — bootstrapping:** Key takeaways explicitভাবে bootstrapping-কে noisy ciphertext refresh করার method হিসেবে list করে: homomorphic decryption run করে, unlimited depth দেয়।

---

# 12. FHE-এর চার generation

## 12.1 Lecture table

| Generation | Year | Scheme | Key idea | Best for |
|---|---:|---|---|---|
| Gen 1 | 2009 | Gentry / DGHV | Ideal lattices, integers; bootstrapping invented | Proof of concept |
| Gen 2 | 2011–12 | BGV, BFV | LWE/RLWE-based; modulus switching | Exact integers, small NNs |
| Gen 3 | 2013 | GSW | Matrix ciphertexts; slow noise growth | Comparisons, branching |
| Gen 4 | 2017 | CKKS | Approximate reals, floating point | ML, signal processing |

## 12.2 Generations across কী পরিবর্তন হয়েছে

### Generation 1

Gen 1 প্রমাণ করে FHE possible।

### Generation 2

Gen 2 ideal lattices থেকে schemes-কে নিয়ে যায়:

- LWE।
- Ring-LWE।

Slides এটিকে describe করে:

- Cleaner security analysis।
- Faster schemes।

### Generation 3

Gen 3 ciphertexts-কে matrices হিসেবে reorganise করে।

Key benefit:

- Very slow noise growth।

### Generation 4

Gen 4 exactness-এর বদলে speed নেয়।

এটি allow করে:

- Small approximation errors।
- Real-number arithmetic।
- Fast SIMD।

এটাই neural networks-এর দরকার।

## 12.3 LWE/RLWE assumption

Slide LWE-style hardness idea বলে distinguishing:

```latex
(a, \langle a, s\rangle + e)
```

from a uniformly random pair।

এটি quantumly-ও hard বলে বিশ্বাস করা হয়।

Modern lattice FHE schemes যেমন:

- BGV।
- BFV।
- CKKS।

সাধারণত efficiency-এর জন্য ring variant, RLWE, based।

[UNCLEAR: slide শুধু LWE/RLWE-এর light statement দেয় এবং বলে scheme ব্যবহার করতে details দরকার নেই; provided slides-এ deeper formal assumptions develop করা হয়নি।]

🚩 **EXAM FLAG — four generations:** Key takeaways explicitভাবে Gen1 DGHV, Gen2 BGV/BFV, Gen3 GSW, Gen4 CKKS list করে এবং বলে CKKS ML workhorse।

---

# 13. CKKS: approximate reals এবং SIMD batching

## 13.1 Approximate arithmetic acceptable কেন

CKKS real numbers approximately encrypt করে।

প্রতিটি operation tiny rounding error introduce করে, slide-এ প্রায়:

```latex
10^{-4}
```

ML-এর জন্য এটি acceptable, কারণ neural networks already approximate computation ব্যবহার করে:

- Floating point।
- Dropout।
- Quantisation।

তাই অতিরিক্ত CKKS approximation error ML-এর জন্য essentially free হিসেবে ধরা হয়।

## 13.2 CKKS ML-এর সঙ্গে fit করে কেন

CKKS native fit:

- Matrix-vector products।
- PyTorch-style models।
- TensorFlow-style models।

Slide বলে CKKS কয়েকটি FHE-for-ML stack-এ default scheme:

- Microsoft SEAL।
- IBM HElayers।
- OpenFHE।
- Zama Concrete-ML।
- Lattigo।

## 13.3 SIMD batching

CKKS ciphertext শুধু একটি number encrypt করে না। এটি slots-এর একটি vector encrypt করে:

```latex
S \text{ slots}
```

Typical values:

```latex
S = 2^{11} \text{ to } 2^{14}
```

Ring degree `N` হলে:

```latex
S = \frac{N}{2}
```

একটি homomorphic operation প্রতিটি slot-এ element-wise parallel act করে।

Slide example:

```latex
(1.2, 3.4, -0.7, 2.1, 0.5, \ldots)
```

plus:

```latex
(0.3, -1.0, 2.4, 0.8, 1.7, \ldots)
```

gives:

```latex
(1.5, 2.4, 1.7, 2.9, 2.2, \ldots)
```

সবই একটি ciphertext operation-এর ভিতরে।

## 13.4 Throughput advantage

Neural-network linear layer map হতে পারে:

- One homomorphic multiplication।
- A few rotations।

এটি one number per ciphertext encrypt করার চেয়ে অনেক better throughput দেয়।

---

# 14. Worked example: encrypted dot product

🚩 **EXAM FLAG — worked example:** Key takeaways explicitভাবে encrypted dot product with `w=(0.5,-0.3,0.8)` হাতে verify করার example হিসেবে list করে।

## 14.1 Task

Compute:

```latex
y = w_1x_1 + w_2x_2 + w_3x_3
```

Features `x` private এবং encrypted।

Weights `w` plaintext এবং server-এর কাছে থাকে।

Concrete values:

```latex
w = (0.5, -0.3, 0.8)
```

```latex
x = (2.0, 1.0, 1.5)
```

Expected answer:

```latex
y = 1.9
```

## 14.2 Step 1: Client `x` encrypt করে

Client pack করে:

```latex
x = (2.0, 1.0, 1.5, 0, \ldots)
```

একটি ciphertext-এ:

```latex
ct_x
```

Server শুধু ciphertext দেখে।

## 14.3 Step 2: Server plaintext weights দিয়ে multiply করে

Server-এর plaintext:

```latex
w = (0.5, -0.3, 0.8, 0, \ldots)
```

Slot-wise multiplication gives:

```latex
ct' = (1.0, -0.3, 1.2, 0, \ldots)
```

ciphertext-এর ভিতরে।

Server এই red/plain values দেখে না; এগুলো explanation-এর জন্য “god’s-eye view”।

## 14.4 Step 3: rotate-and-add দিয়ে slots sum করা

Slide toy setting with 4 slots ব্যবহার করে, যেখানে fourth slot 0 দিয়ে padded।

Initial encrypted vector:

```latex
ct' = (1.0, -0.3, 1.2, 0)
```

### Round 1: rotate by 1 and add

Rotate:

```latex
(-0.3, 1.2, 0, 1.0)
```

Add:

```latex
(1.0, -0.3, 1.2, 0)
+
(-0.3, 1.2, 0, 1.0)
```

```latex
= (0.7, 0.9, 1.2, 1.0)
```

এগুলো partial sums।

### Round 2: rotate by 2 and add

Rotate:

```latex
(1.2, 1.0, 0.7, 0.9)
```

Add:

```latex
(0.7, 0.9, 1.2, 1.0)
+
(1.2, 1.0, 0.7, 0.9)
```

```latex
= (1.9, 1.9, 1.9, 1.9)
```

এখন প্রতিটি slot-এ dot product আছে।

## 14.5 Step 4: Client decrypt করে

Client decrypt করে:

```latex
ct_y
```

এবং slot 0 পড়ে:

```latex
1.9
```

## 14.6 Cost এবং security

Cost:

```latex
1 \text{ ciphertext-plaintext multiplication} + \log_2 S \text{ rotations over } S \text{ slots}
```

Security:

- Server `x` সম্পর্কে কিছু শেখে না।
- Server answer সম্পর্কেও কিছু শেখে না।
- Dot product প্রতিটি NN linear layer-এর heart।

---

# 15. Homomorphic encryption-এর development

Lecture একটি broader development timeline দেখায়, তিনটি stage সহ।

## 15.1 Early exploration stage

Examples shown:

- RSA, 1978।
- ElGamal, 1985।
- Benaloh, 1988।
- Paillier, 1999।

এই stage-এ early partial homomorphic schemes আছে।

## 15.2 Theoretical breakthrough stage

Examples shown:

- Gentry, 2009।
- BFV, 2012।
- BGV, 2014।
- CKKS, 2017।
- Bootstrapping, 2018।

[UNCLEAR: slide একটি visual timeline only; এই stage-এর প্রতিটি item বিস্তারিত explain করে না।]

## 15.3 Efficiency optimisation stage

Examples shown:

- TFHE, 2019।
- RNS-CKKS, 2021।
- SHARP, 2023।

[UNCLEAR: এই optimisation-stage entries visualভাবে দেখানো হয়েছে, কিন্তু provided slide text-এ বিস্তারিত explain করা হয়নি।]

---

# 16. End-to-end FHE pipeline

## 16.1 Pipeline overview

Pipeline:

```latex
\text{Encode} \rightarrow \text{Encrypt} \rightarrow \text{Eval } f \rightarrow \text{Decrypt} \rightarrow \text{Decode}
```

Client side:

1. Encode।
2. Encrypt।

Server side:

3. Evaluate `f`।

Client side:

4. Decrypt।
5. Decode।

## 16.2 Step-by-step

### Step 1: Encode

Data-কে scheme-এর plaintext space-এ pack করা।

Data হতে পারে:

- Number।
- Vector।
- Image।

Plaintext space polynomial হিসেবে represented।

### Step 2: Encrypt

Client public key ব্যবহার করে:

```latex
pk
```

ciphertext produce করে।

### Step 3: Evaluate

Server homomorphic circuit চালায়:

```latex
f
```

secret key না দেখে:

```latex
sk
```

### Step 4: Decrypt

Client ব্যবহার করে:

```latex
sk
```

result polynomial recover করতে।

### Step 5: Decode

Client polynomial unpack করে intended output type-এ ফিরিয়ে আনে:

- Number।
- Vector।
- Other data format।

## 16.3 Server কী শেখে

Slide states:

- `x` সম্পর্কে কিছু না।
- `f(x)` সম্পর্কে কিছু না।
- শুধু `f`-এর structure, যা server নিজেই programmed করেছে।

Security LWE/RLWE assumption-এর অধীনে hold করে।

---

# 17. ML application 1: encrypted logistic regression

## 17.1 Plain model

Logistic-regression classifier predicts:

```latex
\hat{y} = \sigma(w^\top x + b)
```

where:

```latex
\sigma(z) = \frac{1}{1 + e^{-z}}
```

## 17.2 Encrypted setting

Client features encrypt করে:

```latex
x \in \mathbb{R}^{10}
```

Server holds:

- Weights `w`।
- Bias `b`।

## 17.3 Step 1: encrypted linear part

Server computes:

```latex
ct_z = \operatorname{Enc}(w^\top x + b)
```

using:

- One ciphertext-plaintext multiplication।
- Slot summation।

## 17.4 Step 2: sigmoid approximation

CKKS-এর native sigmoid function নেই।

Slide cubic approximation দেয় on:

```latex
z \in [-5,5]
```

```latex
\sigma(z) \approx 0.5 + 0.197z - 0.004z^3
```

এতে লাগে:

- Two multiplications।
- A few additions।

Server এই polynomial apply করে:

```latex
ct_z
```

to obtain:

```latex
ct_{\hat{y}}
```

Wider input ranges-এর জন্য slide বলে higher-degree polynomials বা piecewise approximations ব্যবহার করা হয়।

## 17.5 Step 3: decrypt and round

Client decrypt করে:

```latex
ct_{\hat{y}}
```

এবং round করে:

```latex
\{0,1\}
```

## 17.6 পুনরাবৃত্ত pattern

Linear operations FHE-এর অধীনে easy।

Non-linear operations polynomial approximation চায়।

Central technique হলো replace করা:

- Sigmoid।
- ReLU।
- Softmax।

low-degree polynomials দিয়ে।

🚩 **EXAM FLAG — recurring pattern:** Slide বলে এটি central technique এবং next lecture-এ আবার আসবে।

---

# 18. ML application 2: federated-learning aggregation

## 18.1 Setting

আছে:

```latex
K
```

clients।

প্রতিটি client private data রাখে এবং local gradient compute করে:

```latex
\Delta_k
```

Server-কে average compute করতে হবে:

```latex
\bar{\Delta} = \frac{1}{K}\sum_k \Delta_k
```

individual gradients না দেখে।

## 18.2 Paillier as additive PHE

Slide states Paillier canonical additive PHE।

Its ciphertext operation:

```latex
c_1 \cdot c_2 = \operatorname{Enc}(m_1 + m_2)
```

তাই ciphertext multiply করলে plaintexts add হয়।

## 18.3 Aggregation protocol

Each client encrypts:

```latex
c_k = \operatorname{Enc}(\Delta_k)
```

Server ciphertexts multiply করে:

```latex
\prod_k c_k = \operatorname{Enc}\left(\sum_k \Delta_k\right)
```

Aggregator only the sum decrypt করে।

Individual gradients কখনো visible নয়।

## 18.4 Security motivation

Slide states individual gradients hide করলে protocol gradient-inversion attacks-এর against resistant হয়।

## 18.5 শুধু Paillier-এর বদলে FHE/CKKS কেন?

Paillier addition only handles।

Advanced federated learning encrypted gradients-এর উপর multiplication চাইতে পারে, যেমন:

- Encrypted weights দিয়ে weighted averaging।
- Encrypted clipping norms দিয়ে robust aggregation।
- Differential-privacy noise calibration।

CKKS supports:

- Addition।
- Multiplication।
- SIMD batching দিয়ে full gradient vectors per ciphertext।

## 18.6 Production status

Slide says production FL today mostly uses MPC-based aggregation, specifically Bonawitz et al., 2017, for speed।

FHE-based aggregation regulated settings-এ ground gain করছে যেখানে non-interactivity matters।

---

# 19. ML application 3: private neural-network inference — CryptoNets pattern

## 19.1 CryptoNets blueprint

CryptoNets, Microsoft 2016, MNIST digit classification-এর জন্য encrypted CNN-এর first end-to-end demonstration হিসেবে presented।

Pipeline shown:

```latex
\operatorname{Enc}(\text{image})
\rightarrow \text{Conv}
\rightarrow x^2
\rightarrow \text{Mean pool}
\rightarrow \text{Dense}
\rightarrow x^2
\rightarrow \text{Dense}
\rightarrow 10
```

Final output has 10 classes।

## 19.2 Design rules

Slide says these design rules are still used today:

- ReLU replace করা:

```latex
x^2
```

একটি squaring activation, one multiplication ব্যবহার করে।

- Max-pooling replace করা mean-pooling দিয়ে।

Reason:

- Max-pooling comparisons চায়।
- Mean-pooling comparisons avoid করে।

- No batch normalisation।
- No division।
- Multiplicative depth low রাখা।

## 19.3 Looking ahead

Many modern FHE-friendly architectures 2016 CryptoNets paper থেকে trace করে।

Still-used rulebook:

- Polynomial activations।
- No comparisons।
- Mean-only pooling।

---

# 20. Performance reality check

## 20.1 Practicality spectrum

Slide workloads-কে spectrum-এ রাখে:

Usable:

- Linear models।
- Logistic regression।

Feasible:

- Small CNNs।
- ResNet inference।

Research:

- Transformer encoder।
- Full LLM।

## 20.2 Main performance asymmetry

Key asymmetry:

- Addition nearly free।
- Multiplication এবং bootstrapping dominate cost।

## 20.3 What helps

Slide lists:

- Parallelism থাকলে SIMD batching অনেক সাহায্য করে।
- Early GPU/FPGA accelerators।
- Newer ASIC designs।

## 20.4 Remaining slowdown

Improvements থাকা সত্ত্বেও FHE remains:

```latex
10^3 \text{ to } 10^5
```

times slower than plaintext।

🚩 **EXAM FLAG — performance:** Key takeaways explicitভাবে `10^3`–`10^5` slowdown এবং practical small workloads বনাম transformer/LLM research distinguish করে।

---

# 21. FHE-এর limitations

## 21.1 Compute overhead

FHE:

```latex
10^3 \text{ to } 10^5
```

times slower than plaintext for typical ML workloads।

Large models-এ real-time inference practical নয়।

## 21.2 Memory এবং ciphertext size

Single CKKS ciphertext সাধারণত several MB।

অনেক encrypted images memory এবং bandwidth balloon করে।

## 21.3 Non-polynomial functions hard

FHE natively supports:

```latex
+
```

and:

```latex
\times
```

Hard functions include:

- Comparisons।
- Max।
- ReLU।
- Division।
- Exponential।
- Softmax।

এগুলোর দরকার:

- Polynomial approximations।
- TFHE ব্যবহার করে LUTs।

এটি FHE for ML-এর central engineering pain হিসেবে described।

## 21.4 Parameter selection delicate

Wrong parameter choice cause করতে পারে:

- Insecurity।
- Noise overflow।

EVA এবং Concrete-এর মতো compilers automate করে, কিন্তু FHE deployment এখনো expertise চায়।

## 21.5 FHE computation protect করে, model নয়

FHE inputs এবং outputs private রাখে।

Repeated queries দিয়ে model extraction prevent করে না।

Slide says combine with:

- Rate limiting।
- Differential privacy।
- Zero-knowledge proofs।

as needed।

---

# 22. Next lecture preview: AI/ML applications

## 22.1 Encrypted NN inference

Setting:

- Client input encrypt করে।
- Server neural network layer-by-layer ciphertexts-এর উপর চালায়।
- Server encrypted output return করে।

Slide-এর privacy claims examples:

- Patient কখনো MRI reveal করে না।
- Provider কখনো weights reveal করে না।

Examples named:

- CryptoNets।
- Gazelle।
- HE-Transformer।

## 22.2 FHE-friendly NN design

Techniques:

- ReLU replace করা low-degree polynomial approximations দিয়ে।
- Max pooling-এর বদলে average pooling।
- Circuit depth reduce করা।

Trade-off:

- Slight accuracy loss।
- Speed improvement of `10`–`100\times`।

## 22.3 Encrypted training

Encrypted training rare।

Reason:

- Gradients non-polynomial activations চায়।
- Training deep circuits ব্যবহার করে।

Current scope described:

- Active research।
- Mostly limited to logistic regression so far।

## 22.4 Hybrid protocols

Hybrid protocols combine:

- Linear layers-এর জন্য FHE।
- Non-linear activations-এর জন্য MPC।

Examples:

- Gazelle।
- Delphi।

Slide এটিকে best-of-both approach বলে এবং বলে today dominant deployed approach।

## 22.5 Coming up

Next lecture drills into:

- Microsoft CryptoNets, 2016।
- Intel HE-Transformer, 2019।
- Gazelle, 2018।
- Polynomial activations-এর engineering details।
- Depth budgets।

---

# 23. Lecture 10.1 key takeaways

🚩 **EXAM FLAG — key takeaways slide:** নিচের points lecture-এর key takeaways slide-এ directly listed।

1. FHE server-কে compute করতে দেয়:

```latex
f(x)
```

on:

```latex
\operatorname{Enc}(x)
```

without seeing `x`।

তিনটি properties named:

- Correctness।
- Security।
- Compactness।

2. Three flavours:

- PHE: one operation, e.g. RSA or Paillier।
- SHE: both operations, limited depth।
- FHE: both operations, unlimited depth।

3. Worked examples to verify by hand:

- RSA multiplication on `N=33`।
- DGHV on `p=29`।
- Encrypted dot product with:

```latex
w = (0.5, -0.3, 0.8)
```

4. Modern FHE is encryption with noise।

- Addition adds noise gently।
- Multiplication makes noise explode।
- This creates the depth wall।

5. Bootstrapping, Gentry 2009, noisy ciphertext refresh করে homomorphic decryption run করে।

This gives unlimited depth।

6. Four generations:

- Gen 1: DGHV।
- Gen 2: BGV/BFV।
- Gen 3: GSW।
- Gen 4: CKKS।

CKKS is the workhorse for ML।

7. ML applications:

- Encrypted logistic regression with polynomial sigmoid।
- Federated-learning secure aggregation।
- CryptoNets-style private CNN।

Linear cheap; non-linear polynomial approximation needs।

8. Performance:

```latex
10^3 \text{ to } 10^5
```

times slower than plaintext।

Linear models এবং small CNNs practical today; transformers এবং LLMs research।

---

# Lecture 10.3 — Machine Learning-এর জন্য FHE: library tour

# 24. Lecture topic এবং learning objectives

## 24.1 Topic

এই lecture machine learning-এর জন্য FHE libraries-এর historical tour দেয়।

Covered six libraries:

1. HElib।
2. Microsoft SEAL।
3. TenSEAL।
4. IBM HElayers।
5. OpenFHE।
6. Zama Concrete-ML।

## 24.2 Historical ordering

Slide gives:

| Library | Origin/date | Main interface/scheme focus |
|---|---|---|
| HElib | IBM, 2013 | C++, BGV |
| SEAL | Microsoft, 2015 | C++, BFV/CKKS |
| TenSEAL | OpenMined, 2020 | Python/SEAL |
| HElayers | IBM, 2021 | Python SDK |
| OpenFHE | 2022 | C++/Python |
| Concrete-ML | Zama, 2022 | PyTorch / ML-first |

Slide development group করে:

- Primitives।
- Python wrappers।
- Unified and ML-first tools।

## 24.3 Learning objectives

Lecture শেষে students should be able to:

1. Six libraries এবং তাদের historical context recognise করা।
2. প্রতিটি থেকে code snippet পড়ে কোন crypto knobs hidden তা বলা।
3. Compare করা:
   - Schemes।
   - API level।
   - Automation।
   - Licence।
4. Right library choose করা for:
   - Production।
   - Research।
   - Teaching।

🚩 **EXAM FLAG — learning objectives:** এগুলো explicitly “By the end of today, you should be able to” হিসেবে listed।

## 24.4 Important caution

Slide states:

> Versions and features evolve fast — always check the upstream repo before you build on it.

🚩 **EXAM FLAG / practical warning:** Lecture explicitly warns library versions and features quickly evolve করে।

---

# 25. Quick recap: ML libraries-এর জন্য দরকারি FHE primitives

## 25.1 Three FHE scheme families

### BGV / BFV

Used for:

- Exact integers।

### CKKS

Used for:

- Approximate reals।

এটি ML-এর জন্য especially relevant।

### TFHE / FHEW

Used for:

- Bit-level LUTs।

## 25.2 ML pain points

Slide main ML difficulties list করে:

- ReLU non-native।
- Max-pooling non-native।
- Softmax non-native।
- Multiplicative depth finite।
- Bootstrapping expensive।

## 25.3 Translation playbook

FHE-for-ML playbook:

| ML operation | FHE-friendly replacement |
|---|---|
| ReLU | `x^2`, polynomial, অথবা LUT |
| Max-pool | Mean-pool |
| Inputs/model | Quantise and SIMD-pack |

## 25.4 Libraries matter কেন

Libraries matter কারণ তারা:

- Lattice math hide করে।
- কী express করা easy হবে তা determine করে।

Connection to Lecture 10.1: এই recap same distinction ব্যবহার করে exact integer schemes, approximate CKKS, এবং bit/LUT-based TFHE/FHEW-এর মধ্যে।

---

# 26. FHE library family tree, 2009–2026

## 26.1 Timeline-এর উপরে theory papers

Slide timeline-এর উপরে theory papers রাখে:

- 2009: Gentry’s thesis।
- 2012: BGV scheme।
- 2016: TFHE paper।
- 2017: CKKS paper।

## 26.2 Timeline-এর নিচে open-source libraries

Slide libraries and systems রাখে:

- 2013: HElib।
- 2015: SEAL।
- 2016: CryptoNets।
- 2020: TenSEAL।
- 2021: HElayers।
- 2022: OpenFHE।
- 2022: Concrete-ML।
- 2026: LLM-FHE research।

## 26.3 Three eras

### 2013–2017: primitives

HElib, C++, cryptographers only।

### 2018–2021: Python wrappers

SEAL API standardise করে।

TenSEAL এবং HElayers এটি wrap করে।

### 2022–2026: ML compilers

OpenFHE schemes unify করে।

Concrete-ML PyTorch compile করে।

---

# 27. গল্প যেখানে শুরু: Gentry, 2009–2011

## 27.1 Gentry-Halevi 2011

First FHE prototype described as:

- Slow।
- Huge keys ব্যবহার করে।

## 27.2 Realisation

FHE theory-তে কাজ করে, কিন্তু usable library দরকার।

## 27.3 HElib, 2013

HElib presented as first packaged open-source FHE library।

## 27.4 HElib কী বদলেছিল

প্রথমবার একজন researcher repository clone করে encrypted computations run করতে পারত।

Cost of entry:

- Lattice cryptography।
- C++।

কিন্তু slide says door had opened।

---

# 28. HElib

## 28.1 Origin

HElib:

- IBM Research।
- 2013।
- “the original” হিসেবে described।

## 28.2 HElib কী pioneered করেছে

HElib pioneered:

- First open-source FHE library।
- BGV implementation।
- Later CKKS support।
- SIMD batching।
- Galois rotations।
- Modulus switching।
- Key switching।
- Bootstrapping।
- API conventions যা later libraries copied।

## 28.3 The catch

Limitations:

- Heavy C++।
- No Python।
- No ML abstractions।
- Designed for cryptographers।

## 28.4 Slides-এ status

Slide states:

- Last release: v2.3.0, July 2023।
- Reference implementation of BGV।

[UNCLEAR: এটি slides-এ stated status। Provided materials থেকে live repository verification সম্ভব হয়নি।]

## 28.5 HElib এখনও taught কেন

Slide analogy:

> HElib is to FHE what libsodium is to symmetric crypto.

Lecture context-এ meaning:

- Everyday web applications-এর জন্য necessarily নয়।
- Important কারণ field-এর vocabulary এবং conventions সেখানে forged হয়েছে।

## 28.6 HElib code example: BGV-এর অধীনে encrypting and adding

### Goal

BGV-এর অধীনে দুটি SIMD-packed vector encrypt করা, ciphertexts add করা, result decrypt করা।

### Parameters shown

Code একটি BGV context build করে:

```cpp
Context context = ContextBuilder<BGV>()
    .m(32109)
    .p(4999)
    .r(1)
    .bits(500)
    .c(2)
    .build();
```

Slide comments identify:

- `m`: cyclotomic index।
- `p`: plaintext modulus।
- `bits`: total size of ciphertext modulus chain।

Other parameters shown:

- `r(1)`।
- `c(2)`।

### Key generation

```cpp
SecKey secret_key(context);
secret_key.GenSecKey();
const PubKey& public_key = secret_key;
```

Public key secret key object থেকে derived।

### SIMD packing

```cpp
const EncryptedArray& ea = context.getEA();
std::vector<long> ptxt1(ea.size(), 0), ptxt2(ea.size(), 0);
ptxt1[0] = 5;
ptxt2[0] = 7;
```

Vectors slot-packed। শুধু first slot 5 এবং 7 set।

### Encryption

```cpp
Ctxt c1(public_key), c2(public_key);
ea.encrypt(c1, public_key, ptxt1);
ea.encrypt(c2, public_key, ptxt2);
```

### Homomorphic addition

```cpp
c1 += c2;
```

এটি ciphertext-ciphertext addition করে।

### Decryption

```cpp
std::vector<long> out;
ea.decrypt(c1, secret_key, out);
std::cout << out[0] << std::endl;
```

Expected output:

```latex
12
```

because:

```latex
5 + 7 = 12
```

## 28.7 HElib strengths

- BGV এবং CKKS দুটোই support করে।
- BGV bootstrapping আছে।
- Mature এবং well documented।
- Intel HEXL acceleration।

## 28.8 HElib weaknesses

- C++ only।
- Steep learning curve।
- Manual parameter selection।
- No tensor abstractions।
- Codebase hard to read।

## 28.9 Best for

HElib best for:

- FHE protocol researchers।
- Crypto PhD students।
- New BGV scheme design।
- Benchmarking BGV across libraries।

---

# 29. Microsoft SEAL

## 29.1 HElib থেকে SEAL-এ shift

Slide shift frame করে:

```latex
\text{usable by cryptographers}
\rightarrow
\text{usable by C++ engineers}
```

SEAL’s bet:

> FHE adoption-এর bottleneck crypto নয়, API।

## 29.2 Origin

Microsoft SEAL:

- Microsoft Research।
- First released 2015।
- MIT from 2018।
- “the standard” হিসেবে described।

## 29.3 Schemes

SEAL supports:

- BFV — exact integers।
- CKKS — approximate reals; ML default।
- BGV — exact integers, added in v4.0, 2022।

Slide says:

- No CKKS bootstrapping in mainline।

## 29.4 SEAL standard হলো কেন

Reasons listed:

- MIT licence।
- Fully open।
- Cross-platform।
- No dependencies।
- Heavily commented examples।
- Backend for:
  - TenSEAL।
  - PyFHEL।
  - EVA।

## 29.5 Microsoft Research FHE stack

Slide lists:

```latex
\text{SEAL library}
+
\text{EVA compiler}
+
\text{HEAX FPGA}
```

with EVA from PLDI 2020 and HEAX from ASPLOS 2020।

## 29.6 SEAL code example: CKKS encrypted polynomial `3x^2`

### Goal

Compute:

```latex
3x^2
```

on encrypted CKKS vectors।

### Important point

Slide emphasises scheme, ring degree, modulus chain, and scale — সব manually chosen।

### Parameters

Code sets:

```cpp
EncryptionParameters parms(scheme_type::ckks);
parms.set_poly_modulus_degree(8192);
parms.set_coeff_modulus(
    CoeffModulus::Create(8192, {60, 40, 40, 60})
);
SEALContext context(parms);
double scale = pow(2.0, 40);
```

Crypto knobs visible to developer:

- Scheme: CKKS।
- Polynomial modulus degree: 8192।
- Coefficient modulus chain: `{60,40,40,60}`।
- Scale:

```latex
2^{40}
```

### Keys and utilities

Code creates:

- KeyGenerator।
- Secret key।
- Public key।
- Relinearisation keys।
- Encryptor।
- Evaluator।
- Decryptor।
- CKKSEncoder।

### Encode and encrypt vector

Vector:

```latex
(1,2,3,4)
```

It is encoded at scale `2^{40}` and encrypted।

### Homomorphic computation

Computation:

```cpp
eval.square_inplace(ct);
eval.relinearize_inplace(ct, rk);
eval.rescale_to_next_inplace(ct);
```

এটি `x^2` compute করে, তারপর relinearises and rescales।

Then plaintext constant 3 encoded at ciphertext’s current level and scale:

```cpp
encoder.encode(3.0, ct.parms_id(), ct.scale(), three);
```

Slide explicitly marks level must match:

> match level!

Then:

```cpp
eval.multiply_plain_inplace(ct, three);
```

### Decrypt and decode

Result approximately:

```latex
[3.0, 12.0, 27.0, 48.0]
```

because:

```latex
3(1^2) = 3
```

```latex
3(2^2) = 12
```

```latex
3(3^2) = 27
```

```latex
3(4^2) = 48
```

## 29.7 EVA: SEAL parameters hide করা Python compiler

### Same computation at higher level

EVA code describes:

```latex
y = 3x^2
```

using:

```python
poly = EvaProgram('Polynomial', vec_size=1024)
with poly:
    x = Input('x')
    Output('y', 3 * x ** 2)
```

Then:

```python
poly.set_input_scales(30)
poly.set_output_ranges(30)
```

### Compiler responsibilities

EVA compiler picks:

- Ring degree।
- Modulus chain।
- Rescaling positions।
- Relinearisation positions।

### Execution flow

Code:

1. Program compile করে।
2. Keys generate করে।
3. Inputs encrypt করে।
4. Compiled program encrypted data-তে execute করে।
5. Outputs decrypt করে।

### EVA warning

Slide says EVA is in maintenance freeze:

- Last release v1.0.1, 2021।
- Only validated against SEAL v3.6.4।
- Ideas live on; codebase does not।

🚩 **EXAM FLAG / practical warning:** EVA parameter choices hide করে এমন compiler-এর example, কিন্তু slide explicitly warns codebase stalled।

## 29.8 SEAL strengths

- Mature C++17 API।
- MIT licence।
- Excellent commented examples।
- Cross-platform।
- No dependencies।
- Backend for many wrappers।

## 29.9 SEAL weaknesses

- No native Python।
- No tensor/ML abstractions।
- Manual parameter selection।
- No CKKS bootstrapping।

## 29.10 Best for

SEAL best for:

- C++ engineers building custom FHE applications।

---

# 30. TenSEAL

## 30.1 SEAL থেকে TenSEAL-এ shift

SEAL production CKKS দেয় C++-এ, কিন্তু:

- C++ only।
- No native Python।
- No notion of tensors।

TenSEAL wraps SEAL and provides:

- Python interface।
- Tensor-like API।
- `ts.ckks_vector(ctx, vec)`।
- `matmul`।
- `polyval`।
- `conv2d`।

## 30.2 OpenMined philosophy

Lecture states philosophy:

> Python data scientist যেন C++ না শিখেই encrypted tensor arithmetic করতে পারে।

Same lattice scheme:

- CKKS through SEAL।

Different interface:

- NumPy-shaped API।

## 30.3 Origin

TenSEAL:

- OpenMined।
- 2020।
- Python tensors meet CKKS।

## 30.4 Features

TenSEAL provides:

- `CKKSVector`।
- `CKKSTensor`।
- Dot product।
- Matrix multiplication।
- `conv2d_im2col`।
- `polyval` for polynomial activations।
- Encrypted-encrypted operations।
- Encrypted-plain operations।
- Protobuf serialisation।

## 30.5 Style

Slide lists:

- `pip install tenseal`।
- Apache 2.0।
- Best for prototypes and teaching।
- You still see the ciphertexts।
- Used in PySyft tutorials।
- Less parameter abstraction than EVA।

## 30.6 Teaching-এ popular কেন

TenSEAL:

- Thin enough so students still see ciphertexts।
- Thick enough to prototype encrypted MNIST CNN in about 100 lines।

## 30.7 TenSEAL code example: encrypted vector ops

### Create CKKS context

```python
context = ts.context(
    ts.SCHEME_TYPE.CKKS,
    poly_modulus_degree=8192,
    coeff_mod_bit_sizes=[60, 40, 40, 60]
)
```

Parameters still visible:

- Scheme: CKKS।
- Polynomial modulus degree: 8192।
- Coefficient modulus bit sizes: `[60,40,40,60]`।

### Generate Galois keys

```python
context.generate_galois_keys()
```

Slide comments:

- Rotations-এর জন্য used।

### Set global scale

```python
context.global_scale = 2 ** 40
```

### Encrypt two vectors

Plain vectors:

```latex
v_1 = [0,1,2,3,4]
```

```latex
v_2 = [4,3,2,1,0]
```

Encrypted vectors:

```python
enc_v1 = ts.ckks_vector(context, v1)
enc_v2 = ts.ckks_vector(context, v2)
```

### Homomorphic addition

```python
result = enc_v1 + enc_v2
result.decrypt()
```

Expected approximate output:

```latex
[4,4,4,4,4]
```

### Homomorphic dot product

```python
result = enc_v1.dot(enc_v2)
result.decrypt()
```

Expected approximate output:

```latex
[10]
```

### Homomorphic matrix multiplication

Matrix:

```latex
\begin{bmatrix}
73 & 0.5 & 8 \\
81 & -5 & 66 \\
-100 & -78 & -2 \\
0 & 9 & 17 \\
69 & 11 & 10
\end{bmatrix}
```

Operation:

```python
result = enc_v1.matmul(matrix)
result.decrypt()
```

Expected approximate output:

```latex
[157, -90, 153]
```

## 30.8 TenSEAL strengths

- Easy installation।
- Clear NumPy-like API।
- Great for prototyping and teaching।

## 30.9 TenSEAL weaknesses

- Manual parameter selection।
- No PyTorch/ONNX compilation।
- Slow maintenance।

## 30.10 Best for

TenSEAL best for:

- Proof-of-concept encrypted ML।
- Course exercises।

---

# 31. IBM HElayers

## 31.1 TenSEAL থেকে HElayers-এ shift

TenSEAL encrypted tensors handle করে, কিন্তু next question:

> How do I run my whole CNN?

HElayers presented as IBM’s enterprise SDK addressing this।

## 31.2 The leap: tile tensors

HElayers automatically efficient layout search করে যা 4-D tensor ciphertext slots-এ pack করে।

Slide says PETS 2023 paper reports:

- Specific experimental setup-এ HE-friendly AlexNet about 5 minutes।
- Later work covers SqueezeNet and ResNet।

## 31.3 Origin

IBM HElayers:

- IBM Research।
- 2021।
- Enterprise SDK।

## 31.4 Built for production

Slide lists:

- Powers IBM FHE Cloud।
- Healthcare and finance pilots।
- Backends:
  - SEAL।
  - OpenFHE।
  - Others।
- `mltoolbox`: PyTorch to FHE।
- Built-in:
  - Neural networks।
  - XGBoost।
  - ARIMA।

## 31.5 Distinctive features

HElayers includes:

- Cost-model parameter tuning।
- Rotation-key optimisation।
- Automatic bootstrapping placement।
- Multi-party FHE।
- MPC।

## 31.6 Licence note

Slide distinguishes:

- Community edition: free, non-commercial।
- Premium edition: paid।

It ships as Docker images।

## 31.7 HElayers strengths

- Production-grade NN compiler।
- Multi-backend।
- Tile tensors for automatic packing।
- Built-in support for:
  - Neural networks।
  - Trees।
  - Logistic regression।

## 31.8 HElayers weaknesses

- Closed-source।
- Steeper API than Concrete-ML।
- IBM-tied distribution।
- Cannot fork or audit।

## 31.9 Best for

HElayers best for:

- Regulated industries।
- IBM Cloud customers।
- Vendor-supported pilots।

---

# 32. OpenFHE

## 32.1 Unification story

Slide describes OpenFHE as:

- Successor of PALISADE।
- Broader FHE ecosystem দ্বারা influenced।
- HElayers-এর supported backend।

Inputs/influences shown:

- HElib।
- PALISADE।
- HEAAN।

## 32.2 OpenFHE matters কেন

2022 নাগাদ field fragmented ছিল:

- HElib: BGV।
- SEAL: CKKS।
- Concrete: TFHE।
- FHEW: Boolean।

OpenFHE multiple schemes এক library-তে আনে:

- BFV।
- BGV।
- CKKS।
- FHEW।
- TFHE।

এটি scheme switching support করে:

```latex
\text{CKKS} \leftrightarrow \text{FHEW}
```

non-smooth functions যেমন ReLU-এর জন্য।

## 32.3 Origin

OpenFHE:

- Duality + community।
- 2022।
- “the unifier” হিসেবে described।

## 32.4 Schemes and engineering

### Schemes

OpenFHE supports:

- BFV/BGV for exact integers।
- CKKS for approximate reals।
- FHEW/DM for bit-level computation।
- TFHE/CGGI for programmable bootstrapping।
- Scheme switching CKKS ↔ FHEW।

### Engineering

Slide lists:

- NumFOCUS Sponsored Project।
- C++ core।
- Official Python bindings।
- OpenMP।
- Intel HEXL backend।
- HomomorphicEncryption.org standards।
- Featured in AAAI 2024 PPML tutorial।

## 32.5 Scheme switching কী দেয়

Slide example:

- Matrix multiplication-এর জন্য CKKS ব্যবহার।
- ReLU-এর জন্য TFHE ব্যবহার।
- Mid-computation switch করা।

Slide states OpenFHE is the only mainline FHE library to ship this as a public API।

## 32.6 OpenFHE code example: Python-এ encrypted polynomial

### Goal

Compute:

```latex
3x^2 + x
```

on encrypted vectors।

### Parameters

Code creates CKKS parameters:

```python
parameters = CCParamsCKKSRNS()
parameters.SetMultiplicativeDepth(2)
parameters.SetScalingModSize(50)
parameters.SetBatchSize(8)
```

Crypto knobs visible:

- Multiplicative depth: 2।
- Scaling modulus size: 50।
- Batch size: 8।

### Generate crypto context

```python
cc = GenCryptoContext(parameters)
```

### Enable features

Code enables:

```python
cc.Enable(PKESchemeFeature.PKE)
cc.Enable(PKESchemeFeature.KEYSWITCH)
cc.Enable(PKESchemeFeature.LEVELEDSHE)
```

Meaning context supports:

- Public-key encryption।
- Key switching।
- Leveled somewhat homomorphic evaluation।

### Generate keys

```python
keys = cc.KeyGen()
cc.EvalMultKeyGen(keys.secretKey)
```

Multiplication keys generated।

### Encode and encrypt

Vector:

```latex
x = [0.25, 0.5, 0.75, 1.0, 2.0, 3.0, 4.0, 5.0]
```

Create packed plaintext:

```python
plaintext = cc.MakeCKKSPackedPlaintext(x)
```

Encrypt:

```python
ciphertext = cc.Encrypt(keys.publicKey, plaintext)
```

### Homomorphic computation

Compute:

```latex
x^2
```

```python
ct_sq = cc.EvalMult(ciphertext, ciphertext)
```

Compute:

```latex
3x^2
```

```python
ct_3sq = cc.EvalMult(ct_sq, 3.0)
```

Compute:

```latex
3x^2 + x
```

```python
ct_final = cc.EvalAdd(ct_3sq, ciphertext)
```

### Decrypt

```python
result = cc.Decrypt(ct_final, keys.secretKey)
result.SetLength(len(x))
```

## 32.7 OpenFHE strengths

- All common schemes।
- Scheme switching as public API।
- Active community।

## 32.8 OpenFHE weaknesses

- Manual parameter selection।
- No neural-network compiler।
- Large API surface।

## 32.9 Best for

OpenFHE best for:

- FHE researchers needing all schemes।
- Custom privacy-preserving ML protocols।

---

# 33. Concrete-ML

## 33.1 PyTorch-first turn

Lecture shift frame করে:

Earlier libraries ask:

> Give me a circuit; I’ll evaluate it homomorphically.

Concrete-ML asks:

> Give me a PyTorch/sklearn model; I’ll give you encrypted inference.

## 33.2 Interface shift

HElib এবং SEAL:

- Encrypted circuits design করতে হয়।

HElayers and EVA:

- Model-level compilation-এর দিকে যায়।

Concrete-ML:

- True sklearn/PyTorch drop-in হিসেবে presented।
- Handles:
  - Quantisation।
  - Activations।
  - Parameters।
  - Keys।
  - Deployment।

## 33.3 Origin

Concrete-ML:

- Zama।
- 2022।
- The ML compiler হিসেবে described।

## 33.4 Frontends

Slide lists:

- `concrete.ml.sklearn`:
  - Logistic regression।
  - Random forest।
  - XGBoost।
  - `NeuralNetClassifier`।
- `compile_torch_model(net, X)`।
- `compile_brevitas_qat_model` for QAT-trained networks।

## 33.5 Under the hood: TFHE

Concrete-ML uses TFHE।

Slide says:

- Programmable bootstrapping = LUT।
- ReLU, sigmoid, and GELU handled হতে পারে।
- Compiler all crypto parameters picks।
- GPU support from v1.7+ for LoRA।
- LoRA fine-tuning of LLMs from v1.7+।

[UNCLEAR: এই version-specific claims 2026 slide deck থেকে, current repository against independently verified নয়।]

## 33.6 TFHE right choice কেন ছিল

Programmable bootstrapping encrypted bits-এর উপর any function constant time-এ evaluate করে।

Therefore, every NN activation একটি lookup table হতে পারে, including:

- ReLU।
- Sigmoid।
- GELU।

এটি CKKS-style polynomial approximation-এর contrast।

## 33.7 Concrete-ML code example: trained model থেকে FHE in 5 lines

### Goal

Encrypted logistic regression।

### Import

Slide emphasises:

```python
from concrete.ml.sklearn import LogisticRegression
```

Note says:

> only the import differs

ordinary sklearn style থেকে।

### Dataset

Code loads breast-cancer data:

```python
X, y = load_breast_cancer(return_X_y=True)
```

Train/test split:

```python
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

### Train like sklearn

```python
model = LogisticRegression(n_bits=8)
model.fit(X_tr, y_tr)
```

`n_bits=8` parameter quantisation set করে।

### Compile to FHE

```python
model.compile(X_tr)
```

Slide comments:

- Auto parameters।

### Predict on encrypted inputs

```python
y_fhe = model.predict(X_te[:5], fhe="execute")
```

### Compare with clear prediction

```python
y_clear = model.predict(X_te[:5], fhe="disable")
print("FHE matches clear:", (y_fhe == y_clear).all())
```

Expected output:

```text
True
```

## 33.8 Concrete-ML code example: FHE inference-এর জন্য LLM compile করা

### Imports

Code imports:

- `random`।
- `json`।
- `numpy`।
- `torch`।
- Hugging Face Transformers:
  - `AutoModelForCausalLM`।
  - `AutoTokenizer`।
  - `Conv1D`।
  - `Trainer`।
  - `TrainingArguments`।
- Concrete-ML থেকে `HybridFHEModel`।

### Load GPT-2

```python
tokenizer = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2")
model.config.pad_token_id = model.config.eos_token_id
```

### Determine FHE layers

Code scans model modules:

```python
remote_names = []
for name, module in model.named_modules():
    if isinstance(module, (torch.nn.Linear, Conv1D)):
        remote_names.append(name)
```

Linear layers and `Conv1D` modules selected।

### Create hybrid FHE model

```python
hybrid_model = HybridFHEModel(model, module_names=remote_names)
```

### Prepare calibration input

```python
input_tensor = torch.randint(
    0, tokenizer.vocab_size, (1, 32), dtype=torch.long
)
```

### Compile

```python
hybrid_model.compile_model(
    input_tensor,
    n_bits=8,
    use_dynamic_quantization=True
)
```

Slide-এর point full LLM already routine নয়; বরং Concrete-ML hybrid FHE inference-এর জন্য compiler-style workflow expose করে।

---

# 34. Side-by-side library comparison

## 34.1 Lecture-এর comparison table

| Dimension | HElib | MS SEAL | TenSEAL | HElayers | OpenFHE | Concrete-ML |
|---|---|---|---|---|---|---|
| Released | 2013 | 2015 | 2020 | 2021 | 2022 | 2022 |
| Schemes | BGV, CKKS | BFV, BGV, CKKS | CKKS, BFV | Multi-backend | 5 + switch | TFHE |
| Top API | C++ | C++ / .NET | Python tensors | Python | C++ / Python | sklearn / Torch |
| Knobs hidden | No | No | Partial | Yes | No | Yes, full |
| Activations | Manual | Manual / EVA | Polynomial | Polynomial, range-aware | Polynomial + LUT | LUT, exact |
| NN compiler | No | Via EVA | No | Yes | No | Yes |
| Licence | Apache 2.0 | MIT | Apache 2.0 | Community / paid | BSD-2 | BSD-3-Clear |
| GitHub stars | ~3.2k | ~4k | ~1k | n/a | ~1.1k | ~1.4k |

[UNCLEAR: repository stars এবং library version information slides-এ 2026 retrieval dates অনুযায়ী stated। এগুলো পরিবর্তিত হতে পারে।]

## 34.2 Main comparison message

Left-to-right, libraries abstraction add করে।

Concrete-ML সবচেয়ে বেশি hide করে, কিন্তু slide states this comes at cost of:

- TFHE-only operation।
- Non-commercial licence constraints।

Slide note says:

- Free for research/prototyping।
- Commercial use needs Zama patent licence।
- HElayers ships via Docker/PyPI।

---

# 35. Lecture 10.3 key takeaways

🚩 **EXAM FLAG — “Five things to remember” slide:** Lecture explicitly lists the following five points।

## 35.1 HElib

HElib canonical BGV reference।

Slide says source পড়লে FHE deeply understand করা যায়।

## 35.2 SEAL

SEAL C++ API standardised করেছে।

এটি substrate many wrappers build on।

## 35.3 TenSEAL

TenSEAL হলো SEAL as a Python tensor library।

Best for:

- Prototypes।
- Teaching।

## 35.4 HElayers and OpenFHE

These represent two paths to industrial FHE:

- HElayers: enterprise SDK।
- OpenFHE: unified library।

## 35.5 Concrete-ML

Concrete-ML question invert করে:

From:

> write a circuit

to:

> compile your model

Slide calls it natural starting point for ML practitioners in 2026।

## 35.6 No single winner

No single library wins on every axis।

Priority অনুযায়ী choose:

| Priority | Library suggested by slide |
|---|---|
| Schemes | OpenFHE |
| Production | HElayers |
| Licence | SEAL / HElib |
| Python | TenSEAL |
| End-to-end ML | Concrete-ML |

---

# 36. Cross-lecture connections

## 36.1 Lecture 10.1 to Lecture 10.3

Lecture 10.1 primitives introduce করে:

- PHE।
- SHE।
- FHE।
- Noise।
- Bootstrapping।
- CKKS।
- TFHE-style LUTs।
- Polynomial approximations।

Lecture 10.3 দেখায় কীভাবে these primitives libraries-এ appear করে:

- HElib: BGV and bootstrapping।
- SEAL: BFV/CKKS with manual parameter control।
- TenSEAL: CKKS vectors/tensors over SEAL।
- HElayers: production compiler and automatic packing।
- OpenFHE: all major schemes and scheme switching।
- Concrete-ML: TFHE/programmable bootstrapping/LUT-based ML compiler।

## 36.2 CKKS connection

Lecture 10.1 CKKS-কে ML workhorse হিসেবে দেখায়, কারণ এটি approximate real arithmetic এবং SIMD batching support করে।

Lecture 10.3-এ CKKS appears in:

- SEAL।
- TenSEAL।
- HElayers।
- OpenFHE।

CKKS associated with:

- Approximate real arithmetic।
- Matrix-vector products।
- SIMD slot packing।
- Non-linearities-এর polynomial approximations।

## 36.3 TFHE connection

Lecture 10.1 TFHE ব্যবহার করে LUTs উল্লেখ করে non-polynomial functions handle করার উপায় হিসেবে।

Lecture 10.3 TFHE connect করে Concrete-ML-এর সঙ্গে:

- Programmable bootstrapping।
- Activations as lookup tables।
- ReLU, sigmoid, GELU handled via LUTs।

## 36.4 Linear versus nonlinear operations

দুই lecture জুড়ে repeated theme:

- Linear operations easy।
- Non-linear operations hard।

Examples:

- Dot products CKKS-এর অধীনে natural।
- Logistic regression linear part easy।
- CNN convolutions/dense layers mostly linear।
- ReLU, max-pool, sigmoid, softmax require replacement।

Replacement strategies:

- Polynomial approximation।
- Squaring activation `x^2`।
- Max-pooling-এর বদলে mean-pooling।
- TFHE সহ LUTs।
- Non-linear activations-এর জন্য MPC ব্যবহার করে hybrid protocols।

## 36.5 Bootstrapping connection

Lecture 10.1 bootstrapping conceptually explain করে।

Lecture 10.3 দেখায় libraries কীভাবে এটি handle করে:

- HElib includes BGV bootstrapping।
- SEAL mainline has no CKKS bootstrapping।
- HElayers bootstrapping automatically place করতে পারে।
- OpenFHE TFHE/CGGI এবং scheme switching through programmable bootstrapping support করে।
- Concrete-ML uses TFHE programmable bootstrapping as LUTs।

## 36.6 Federated learning connection

Lecture 10.1 Paillier-কে federated-learning aggregation-এর সঙ্গে connect করে।

Important distinction:

- Simple secure sums-এর জন্য Paillier enough।
- More advanced FL operations-এ encrypted multiplication দরকার হলে CKKS/FHE needed।

## 36.7 Next lecture connection

Slides explicitly preview:

- CryptoNets।
- HE-Transformer।
- Gazelle।
- Polynomial activations।
- Depth budgets।
- Microsoft stack:
  - SEAL।
  - EVA।
  - HEAX।
- Encrypted Transformers।

---

# 37. Consolidated formulas and algorithms

## 37.1 Homomorphic encryption definition

```latex
\operatorname{Dec}\big(\operatorname{Enc}(a) \circ \operatorname{Enc}(b)\big)
=
a \star b
```

## 37.2 RSA

Encryption:

```latex
c = m^e \bmod N
```

Decryption:

```latex
m = c^d \bmod N
```

Multiplicative homomorphism:

```latex
c_1c_2
=
m_1^e m_2^e
=
(m_1m_2)^e
=
\operatorname{Enc}(m_1m_2)
\pmod N
```

## 37.3 DGHV

Encryption:

```latex
c = qp + 2r + m
```

Decryption:

```latex
m = (c \bmod p) \bmod 2
```

Correctness condition:

```latex
|2r + m| < \frac{p}{2}
```

Addition:

```latex
c_1 + c_2
=
(q_1+q_2)p
+
2(r_1+r_2)
+
(m_1+m_2)
```

Multiplication:

```latex
c_1c_2
=
q''p
+
2(2r_1r_2+r_1m_2+r_2m_1)
+
m_1m_2
```

Noise growth after `d` multiplications:

```latex
r^{2^d}
```

Bit-budget condition from slide:

```latex
71 \cdot 2^d < 2700
```

## 37.4 Bootstrapping

```latex
\operatorname{Bootstrap}(c)
=
\operatorname{Eval}(\operatorname{Dec}, c, \operatorname{Enc}(sk))
=
c^\star
```

```latex
\operatorname{Dec}(c^\star) = m
```

## 37.5 CKKS slot count

For ring degree `N`:

```latex
S = \frac{N}{2}
```

Typical slot count:

```latex
S = 2^{11} \text{ to } 2^{14}
```

## 37.6 Dot product under CKKS-style SIMD

Given:

```latex
w = (0.5, -0.3, 0.8)
```

```latex
x = (2.0, 1.0, 1.5)
```

Slot-wise multiply:

```latex
(2.0,1.0,1.5,0)
\odot
(0.5,-0.3,0.8,0)
=
(1.0,-0.3,1.2,0)
```

Rotate by 1 and add:

```latex
(1.0,-0.3,1.2,0)
+
(-0.3,1.2,0,1.0)
=
(0.7,0.9,1.2,1.0)
```

Rotate by 2 and add:

```latex
(0.7,0.9,1.2,1.0)
+
(1.2,1.0,0.7,0.9)
=
(1.9,1.9,1.9,1.9)
```

Cost:

```latex
1 \text{ ct-pt multiplication} + \log_2 S \text{ rotations}
```

## 37.7 Logistic regression

Model:

```latex
\hat{y} = \sigma(w^\top x + b)
```

Sigmoid:

```latex
\sigma(z) = \frac{1}{1+e^{-z}}
```

Approximation on:

```latex
z \in [-5,5]
```

```latex
\sigma(z) \approx 0.5 + 0.197z - 0.004z^3
```

## 37.8 Federated-learning aggregation

Target:

```latex
\bar{\Delta} = \frac{1}{K}\sum_k \Delta_k
```

Paillier additive homomorphism:

```latex
c_1c_2 = \operatorname{Enc}(m_1+m_2)
```

Each client:

```latex
c_k = \operatorname{Enc}(\Delta_k)
```

Server multiplies:

```latex
\prod_k c_k
=
\operatorname{Enc}\left(\sum_k \Delta_k\right)
```

---

# 38. Consolidated exam flags

## 38.1 Must-know definitions

🚩 Know the distinction between:

- PHE।
- SHE।
- FHE।

🚩 Know the formal homomorphic property:

```latex
\operatorname{Dec}(\operatorname{Enc}(a)\circ\operatorname{Enc}(b)) = a \star b
```

🚩 Know that FHE supports both addition and multiplication at unlimited depth।

## 38.2 Must-know worked examples

🚩 RSA multiplicative homomorphism with:

```latex
N=33,\quad e=3,\quad d=7,\quad m_1=4,\quad m_2=5
```

Final answer:

```latex
20
```

🚩 DGHV with:

```latex
p=29
```

```latex
m_1=1,\quad c_1=61
```

```latex
m_2=0,\quad c_2=89
```

Addition result decrypts to:

```latex
1
```

Multiplication result decrypts to:

```latex
0
```

🚩 Encrypted dot product with:

```latex
w=(0.5,-0.3,0.8)
```

```latex
x=(2.0,1.0,1.5)
```

Final result:

```latex
1.9
```

## 38.3 Must-know conceptual mechanisms

🚩 Noise growth:

- Addition: gentle/linear।
- Multiplication: explosive/multiplicative।

🚩 Depth wall:

- Ciphertext becomes undecryptable when noise exceeds budget।

🚩 Bootstrapping:

- Runs decryption homomorphically।
- Uses encrypted secret key।
- Produces a fresh ciphertext।
- Enables unlimited depth।

## 38.4 Must-know FHE generations

🚩 Four generations:

1. Gentry/DGHV।
2. BGV/BFV।
3. GSW।
4. CKKS।

🚩 CKKS is the ML workhorse।

## 38.5 Must-know ML pattern

🚩 Linear operations are easy।

🚩 Non-linear operations require:

- Polynomial approximation।
- LUTs।
- Hybrid protocols।

🚩 CryptoNets design rules:

- ReLU `\rightarrow x^2`।
- Max-pool `\rightarrow` mean-pool।
- Avoid comparisons।
- Avoid division।
- Keep multiplicative depth low।

## 38.6 Must-know library comparison

🚩 Five things to remember from Lecture 10.3:

1. HElib: canonical BGV reference।
2. SEAL: standardised C++ API।
3. TenSEAL: SEAL as Python tensor library।
4. HElayers and OpenFHE: enterprise SDK versus unified library।
5. Concrete-ML: compile your model, not hand-write a circuit।

---

# 39. Unclear or missing sections

[UNCLEAR: Uploaded archive বা prompt-এ কোনো transcript included ছিল না। Spoken explanations, pauses, corrections, jokes, verbal examples, বা verbal exam hints — সব missing।]

[UNCLEAR: Week 10 archive-এ শুধু `w10.1` এবং `w10.3` slide decks ছিল। Upload-এ কোনো `w10.2` file ছিল না।]

[UNCLEAR: Extracted PDF text-এ কিছু code identifiers letter spacing-এর কারণে split হয়েছিল, especially SEAL, EVA, OpenFHE, এবং Concrete-ML snippets-এ। Notes slide visuals দেখে intended API calls preserve করেছে, কিন্তু code copy করার আগে original slide deck against exact syntax check করা উচিত।]

[UNCLEAR: Several version/status claims slides-এর 2026 framing থেকে এসেছে, যেমন library versions, GitHub star counts, এবং maintenance status। এই notes এগুলোকে lecture content হিসেবে treat করে, live repository facts হিসেবে নয়।]

[UNCLEAR: “development of homomorphic encryption” visual কয়েকটি timeline entries list করে যেমন Bootstrapping 2018, TFHE 2019, RNS-CKKS 2021, এবং SHARP 2023, কিন্তু provided slide text এগুলো detail explain করে না।]

[UNCLEAR: Lecture 10.1 বলে FHE inputs/outputs private রাখে এবং preview section-এ encrypted NN inference example দেয় যেখানে provider-ও weights reveal করে না। Provided slides precise model-privacy mechanism spell out করে না।]
