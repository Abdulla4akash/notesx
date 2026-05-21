---
subject: COMP60272
chapter: 10
title: "Week 10: FHE"
language: en
---

# Week 10 Study Notes — Fully Homomorphic Encryption

Course: **COMP60272 – Security and Privacy of AI**  
Lecture topic: **Week 10 — Fully Homomorphic Encryption (FHE): foundations, worked examples, ML applications, and FHE libraries for machine learning.**  
[UNCLEAR: the uploaded `Week10.zip` contained two slide PDFs only — `w10.1_Slides_FHE_Intro.pdf` and `w10.3_slides_FHE_for_ML.pdf`. No transcript file or pasted transcript was present, so transcript-only explanations, verbal exam hints, and any spoken clarifications cannot be captured here.]

# Topic and scope

This week introduces **Fully Homomorphic Encryption (FHE)** as a way to compute on encrypted data, then connects the core cryptographic ideas to **machine-learning workloads** such as encrypted logistic regression, federated-learning aggregation, encrypted CNN inference, and modern FHE libraries.

The broader course connection is **privacy-preserving AI**: FHE is presented as one approach for letting a server evaluate a model or computation without directly seeing the client’s private input.

---

# Lecture 10.1 — Introduction to Fully Homomorphic Encryption

## 1. Learning objectives and lecture style

### Learning objectives

By the end of the lecture, students should be able to:

- State what **Fully Homomorphic Encryption** is in one sentence.
- Distinguish **PHE**, **SHE**, and **FHE** using concrete examples.
- Walk through small-number computations of:
  - RSA homomorphic multiplication.
  - DGHV encryption/decryption and noise growth.
- Explain:
  - Why noise grows under homomorphic operations.
  - Why multiplication is the main bottleneck.
  - What bootstrapping fixes.
- Recognise the **four FHE generations**.
- Sketch how:
  - A linear classifier runs under FHE.
  - A federated-learning aggregator runs under homomorphic encryption.

🚩 **EXAM FLAG — learning objectives:** These are explicitly listed as “By the end of this lecture you should be able to.” They are high-value revision targets.

### Lecture style

The lecture deliberately uses **small numbers** so every step can be checked by hand. The focus is not cryptanalysis; it is what FHE gives to ML systems.

---

# 2. Motivating problem: cloud computing on encrypted data

## 2.1 Setting

Alice has private data:

```latex
x
```

Examples from the slides:

- MRI scan.
- Credit history.
- Vector of features.

The server has a function:

```latex
f
```

Examples:

- Neural network.
- SQL query.
- Model.

The goal is for the server to compute:

```latex
f(x)
```

without ever seeing `x`.

## 2.2 Protocol

The protocol is:

1. Alice encrypts each bit or number of `x`:

```latex
c_i = \operatorname{Enc}_{pk}(x_i)
```

and sends the ciphertexts to the server.

2. The server homomorphically evaluates `f`, producing:

```latex
c = \operatorname{Enc}_{pk}(f(x))
```

3. Alice decrypts:

```latex
y = \operatorname{Dec}_{sk}(c) = f(x)
```

The server learns nothing about `x`.

## 2.3 Intuition

The server works with encrypted data as if it were ordinary data. It manipulates ciphertexts, and when Alice decrypts the final ciphertext, she obtains the result of the computation on the original plaintext.

---

# 3. What “homomorphic” means

## 3.1 Intuition

An encryption scheme is **homomorphic** if doing an operation on ciphertexts corresponds to doing a meaningful operation on the plaintexts.

Plaintext world:

```latex
a \star b
```

Ciphertext world:

```latex
\operatorname{Enc}(a) \circ \operatorname{Enc}(b)
```

The ciphertext-side operation `\circ` should mirror the plaintext-side operation `\star`.

## 3.2 Formal definition

An encryption scheme is homomorphic for an operation `\star` if there exists a ciphertext-side operation `\circ` such that:

```latex
\operatorname{Dec}\big(\operatorname{Enc}(a) \circ \operatorname{Enc}(b)\big) = a \star b
```

More explicitly with keys:

```latex
\operatorname{Dec}_{sk}\big(\operatorname{Enc}_{pk}(a) \circ \operatorname{Enc}_{pk}(b)\big) = a \star b
```

## 3.3 Three flavours

### Multiplicatively homomorphic encryption

Only multiplication is supported.

Example:

- Textbook RSA.

Meaning:

```latex
\operatorname{Enc}(a) \cdot \operatorname{Enc}(b)
```

decrypts to:

```latex
a \cdot b
```

### Additively homomorphic encryption

Only addition is supported.

Example:

- Paillier, 1999.

This is useful for **federated-learning aggregation**, where the server needs sums of updates or gradients.

### Fully homomorphic encryption

Both addition and multiplication are supported for unlimited depth.

Example lineage:

- Gentry, 2009 and later schemes.

Definition from the lecture’s flavour table:

- **FHE** supports both `+` and `×`, unlimited times.

---

# 4. Glove-box analogy

## 4.1 Story

Alice runs a jewellery shop. She wants workers to assemble jewellery from gold and gems, but she does not trust them not to steal.

Solution:

- Put materials in a transparent locked glove box.
- Workers can manipulate the contents using gloves.
- Workers cannot remove the materials.
- Alice has the only key.

## 4.2 Mapping to FHE

| Glove-box analogy | FHE meaning |
|---|---|
| Locked glove box with materials | Ciphertext |
| Worker manipulates contents through gloves | Server runs `\operatorname{Eval}(f, \operatorname{Enc}(x))` |
| Alice unlocks with her key | Client decrypts with `sk` |
| Worker never removes materials | Server never learns `x` or `f(x)` |

## 4.3 Intuition

The ciphertext is like a locked box. The server can still perform operations on what is “inside,” but cannot inspect or extract the plaintext.

---

# 5. Timeline of main FHE schemes

The slides show a timeline of major FHE schemes from 2009 to 2017.

## 5.1 Main schemes shown

- 2009: Gentry scheme.
- 2010: DGHV scheme.
- 2011: BV scheme.
- 2012: BGV scheme.
- 2012: Brakerski scheme.
- 2012: LTV scheme.
- 2012: FV scheme.
- 2013: YASHE scheme.
- 2013: GSW scheme.
- 2015: FHEW scheme.
- 2016: TFHE scheme.
- 2017: CKKS scheme.

## 5.2 Families in the timeline

The slide legend groups schemes into:

- Schemes based on **ideal lattices**.
- Schemes based on the **AGCD problem**.
- Schemes based on **LWE and RLWE problems**.
- Schemes based on **NTRU**.

Connection: later slides focus especially on **DGHV**, **BGV/BFV**, **GSW**, and **CKKS** as the four-generation view of FHE.

---

# 6. Worked example: RSA is multiplicatively homomorphic

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

Multiplying ciphertexts gives:

```latex
c_1 \cdot c_2
= m_1^e \cdot m_2^e
= (m_1m_2)^e
= \operatorname{Enc}(m_1 \cdot m_2)
\pmod N
```

So multiplying ciphertexts corresponds to multiplying plaintexts.

## 6.3 Worked small-number example

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

### Step 1: Encrypt `m_1`

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

### Step 2: Encrypt `m_2`

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

### Step 3: Multiply ciphertexts

```latex
c_1 \cdot c_2 = 31 \cdot 26 \bmod 33
```

```latex
31 \cdot 26 = 806
```

```latex
806 \bmod 33 = 14
```

So the encrypted product is:

```latex
14
```

### Step 4: Decrypt

```latex
14^7 \bmod 33 = 20
```

### Step 5: Check plaintext multiplication

```latex
m_1 \cdot m_2 = 4 \cdot 5 = 20
```

The decrypted result matches.

## 6.4 What RSA is missing

RSA cannot add ciphertexts meaningfully:

```latex
c_1 + c_2
```

does not decrypt to:

```latex
m_1 + m_2
```

So RSA is **partially homomorphic**: it supports one operation only.

Connection from slides:

- For ciphertext addition, use Paillier.
- For both `+` and `×`, use FHE.

🚩 **EXAM FLAG — worked example:** The key takeaways slide explicitly lists the RSA example on `N=33` as one students should be able to verify by hand.

---

# 7. From PHE to SHE to FHE

## 7.1 Partially Homomorphic Encryption

**PHE** supports:

- One operation.
- Unlimited times.

Examples:

- RSA.
- Paillier.

RSA supports multiplication. Paillier supports addition.

## 7.2 Somewhat Homomorphic Encryption

**SHE** supports:

- Both addition and multiplication.
- Only up to limited depth.

Examples from slides:

- DGHV over `\mathbb{Z}`.
- BGN, 2005.

The limitation is that ciphertexts accumulate noise. After too much computation, decryption fails.

## 7.3 Fully Homomorphic Encryption

**FHE** supports:

- Both addition and multiplication.
- Unlimited depth.

Examples:

- Gentry, 2009 and later.

## 7.4 Why SHE is not enough

A SHE scheme can evaluate both addition and multiplication, but only for a circuit of bounded depth chosen at setup.

Deep computations such as ResNet inference require many multiplicative layers. Without a mechanism to refresh ciphertexts, the ciphertext becomes too noisy.

The mechanism that fixes this is **bootstrapping**.

## 7.5 Universality of `{+, ×}`

The slides state two universality facts:

1. Any Boolean function can be written as a circuit of XOR and AND gates over:

```latex
\mathbb{Z}_2
```

where:

- XOR corresponds to addition.
- AND corresponds to multiplication.

2. Any arithmetic function can be approximated by a polynomial.

Therefore, if an encryption scheme supports `+` and `×` at unlimited depth, it can compute general functions.

---

# 8. DGHV scheme over the integers

## 8.1 Purpose of DGHV in the lecture

DGHV is presented as the simplest FHE-style scheme that can be written down and computed by hand.

It is not presented for cryptanalysis; it is used to show:

- How ciphertext noise works.
- Why addition is cheap.
- Why multiplication is expensive.
- Why bootstrapping is necessary.

## 8.2 Secret key

The secret key is an odd integer:

```latex
p
```

In practice, `p` is large.

## 8.3 Ciphertext for a bit

For a plaintext bit:

```latex
m \in \{0,1\}
```

the ciphertext is:

```latex
c = q \cdot p + 2r + m
```

where:

- `q` is a large random integer.
- `r` is a small random noise integer.
- `m` is the plaintext bit.

## 8.4 Decryption

Decryption is:

```latex
m = (c \bmod p) \bmod 2
```

## 8.5 Why decryption works

Start with:

```latex
c = qp + 2r + m
```

Taking mod `p`:

```latex
c \bmod p = 2r + m
```

provided the noise is small enough, specifically:

```latex
|2r + m| < \frac{p}{2}
```

using the centred residue interpretation.

Then:

```latex
(2r + m) \bmod 2 = m
```

because:

```latex
2r
```

is even.

## 8.6 Noise condition

The critical condition is:

```latex
|r| \ll p
```

Once the noise grows above the allowed threshold, decryption returns garbage.

## 8.7 Real parameters versus lecture parameters

Real DGHV parameters from the slide:

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

The lecture uses tiny numbers so the arithmetic fits on one slide.

---

# 9. Worked example: DGHV in action and the noise problem

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

## 9.2 Encrypt `m_1 = 1`

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

## 9.3 Encrypt `m_2 = 0`

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

## 9.4 Decrypt `c_1`

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

This has the same structural form as a DGHV ciphertext, but with new noise:

```latex
r_1 + r_2
```

So noise growth under addition is linear.

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

Since:

```latex
m_1 + m_2 = 1 + 0 = 1
```

the result is correct.

### New noise

```latex
r_1 + r_2 = 1 + 1 = 2
```

Addition grows noise gently.

---

## 9.6 Homomorphic multiplication

### Algebraic derivation

Start from:

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

All terms involving a factor of `p` can be grouped into:

```latex
q''p
```

The remaining non-`p` part is:

```latex
(2r_1 + m_1)(2r_2 + m_2)
```

Expand:

```latex
(2r_1 + m_1)(2r_2 + m_2)
= 4r_1r_2 + 2r_1m_2 + 2r_2m_1 + m_1m_2
```

Group the even terms:

```latex
= 2(2r_1r_2 + r_1m_2 + r_2m_1) + m_1m_2
```

So:

```latex
c_1c_2
= q''p + 2(2r_1r_2 + r_1m_2 + r_2m_1) + m_1m_2
```

This has the same form as a ciphertext, but the new noise is approximately multiplicative.

The slides summarise this as:

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

The result is correct.

## 9.7 Key lesson from the DGHV example

Addition:

- Noise grows linearly.
- Cheap.

Multiplication:

- Noise grows multiplicatively.
- Expensive.
- Main bottleneck.

🚩 **EXAM FLAG — DGHV worked example:** The key takeaways explicitly list the DGHV example with `p=29` as something students should be able to verify by hand.

---

# 10. The depth wall

## 10.1 What is the depth wall?

The **depth wall** is the point where ciphertext noise has grown so much that decryption fails.

A fresh ciphertext has a large remaining noise budget. Each operation consumes some of the budget.

- Addition consumes a tiny amount.
- Multiplication consumes a large amount.

When the budget is exhausted, the ciphertext is “dead”: it no longer decrypts correctly.

## 10.2 Noise growth after repeated multiplications

The slides state:

```latex
\text{noise after } d \text{ multiplications} \sim r^{2^d}
```

Using bit sizes:

```latex
|r| \approx 71 \text{ bits}
```

```latex
|p| \approx 2700 \text{ bits}
```

The requirement is:

```latex
71 \cdot 2^d < 2700
```

This budget is exhausted after about 5–6 multiplicative levels.

## 10.3 Why this matters for ML

A neural-network layer needs at least one multiplication:

```latex
\text{weights} \times \text{inputs}
```

Deep CNNs can require tens of multiplicative levels unless carefully redesigned.

Therefore:

- Without bootstrapping, deep neural networks on encrypted data are impossible.
- Multiplication is the bottleneck for FHE-based ML.
- Addition is comparatively cheap.

🚩 **EXAM FLAG — “key takeaway” slide wording:** The DGHV/noise slide explicitly labels “The depth wall” as the key takeaway.

---

# 11. Bootstrapping

## 11.1 Glove-box wear analogy

The lecture extends the glove-box analogy.

A glove box works, but every operation wears it down:

- Fresh box: many operations left.
- Worn box: few operations left.
- Dead box: contents are ruined.

Mapping:

| Glove-box wear | FHE |
|---|---|
| Each manipulation wears the box a bit | Each homomorphic operation grows noise |
| Box has finite lifespan | Noise has hard ceiling `p/2` |
| Worn-out box ruins jewellery | Noisy ciphertext fails to decrypt |

## 11.2 The problem

Bob, the worker/server, needs more operations than one box/ciphertext can support.

Naively, Alice/client would have to:

1. Come back.
2. Unlock the worn box.
3. Move the half-finished object into a fresh box.
4. Lock the fresh box.

But that defeats the point of outsourcing the computation.

## 11.3 Nested-box trick

Alice gives Bob two boxes:

- Box A: worn, contains the half-finished jewellery.
- Box B: fresh.

Alice puts the key to Box A inside Box B before locking Box B.

Bob can then:

1. Put worn Box A inside fresh Box B.
2. Reach through Box B’s gloves.
3. Use the key to A inside B.
4. Open A from inside B.
5. Move the half-finished jewellery into B.
6. Continue working in fresh Box B.

Alice never opens anything during the process.

## 11.4 Mapping nested boxes to FHE bootstrapping

| Glove-box trick | Bootstrapping |
|---|---|
| Worn box A with half-finished jewellery | Noisy ciphertext `c`, almost dead |
| Fresh box B | A second encryption layer |
| Drop key A inside B | Encrypt the secret key: `\operatorname{Enc}(sk)` |
| Bob unlocks A from inside B | Run decryption homomorphically inside the new layer |
| Continue in fresh B | Output fresh ciphertext `c^\star` with low noise |

## 11.5 Bootstrapping formula

The slide gives:

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

Bootstrapping is:

> FHE evaluating its own decryption circuit on an encrypted copy of the secret key.

The output is:

- A fresh ciphertext.
- Encrypting the same plaintext.
- With low noise.

## 11.7 Why bootstrapping gives full homomorphism

If a ciphertext becomes too noisy, bootstrap it back to a fresh ciphertext. Then more operations can continue.

This turns limited-depth homomorphic computation into unlimited-depth FHE.

## 11.8 Cost of bootstrapping

The slide notes:

- Bootstrapping is expensive.
- Gentry-Halevi 2011 first implementation: tens of seconds up to roughly half an hour per bootstrap, depending on parameters.
- Recent GPU work has demonstrated sub-second CKKS bootstrapping in some settings.

🚩 **EXAM FLAG — bootstrapping:** The key takeaways explicitly list bootstrapping as refreshing a noisy ciphertext by running decryption homomorphically, giving unlimited depth.

---

# 12. Four generations of FHE

## 12.1 Table from the lecture

| Generation | Year | Scheme | Key idea | Best for |
|---|---:|---|---|---|
| Gen 1 | 2009 | Gentry / DGHV | Ideal lattices, integers; bootstrapping invented | Proof of concept |
| Gen 2 | 2011–12 | BGV, BFV | LWE/RLWE-based; modulus switching | Exact integers, small NNs |
| Gen 3 | 2013 | GSW | Matrix ciphertexts; slow noise growth | Comparisons, branching |
| Gen 4 | 2017 | CKKS | Approximate reals, floating point | ML, signal processing |

## 12.2 What changed across generations

### Generation 1

Gen 1 proved FHE was possible.

### Generation 2

Gen 2 moved away from ideal lattices to schemes based on:

- LWE.
- Ring-LWE.

The slides describe this as giving:

- Cleaner security analysis.
- Faster schemes.

### Generation 3

Gen 3 reorganised ciphertexts as matrices.

Key benefit:

- Very slow noise growth.

### Generation 4

Gen 4 traded exactness for speed.

It allows:

- Small approximation errors.
- Real-number arithmetic.
- Fast SIMD.

This is exactly what neural networks need.

## 12.3 LWE/RLWE assumption

The slide states the LWE-style hardness idea as distinguishing:

```latex
(a, \langle a, s\rangle + e)
```

from a uniformly random pair.

This is believed hard, even quantumly.

Modern lattice FHE schemes such as:

- BGV.
- BFV.
- CKKS.

are typically based on the ring variant, RLWE, for efficiency.

[UNCLEAR: the slide gives only a light statement of LWE/RLWE and explicitly says the details are not needed to use the schemes; deeper formal assumptions were not developed in the provided slides.]

🚩 **EXAM FLAG — four generations:** The key takeaways explicitly list Gen1 DGHV, Gen2 BGV/BFV, Gen3 GSW, Gen4 CKKS, and state that CKKS is the ML workhorse.

---

# 13. CKKS: approximate reals and SIMD batching

## 13.1 Why approximate arithmetic is acceptable

CKKS encrypts real numbers approximately.

Each operation introduces a tiny rounding error, shown on the slide as approximately:

```latex
10^{-4}
```

This is acceptable for ML because neural networks already use approximate computation:

- Floating point.
- Dropout.
- Quantisation.

So the additional CKKS approximation error is treated as essentially free for ML.

## 13.2 Why CKKS fits ML

CKKS is a native fit for:

- Matrix-vector products.
- PyTorch-style models.
- TensorFlow-style models.

The slide states that CKKS is the default scheme in several FHE-for-ML stacks:

- Microsoft SEAL.
- IBM HElayers.
- OpenFHE.
- Zama Concrete-ML.
- Lattigo.

## 13.3 SIMD batching

A CKKS ciphertext does not encrypt one number. It encrypts a vector of slots:

```latex
S \text{ slots}
```

Typical values:

```latex
S = 2^{11} \text{ to } 2^{14}
```

For ring degree `N`:

```latex
S = \frac{N}{2}
```

One homomorphic operation acts element-wise on every slot in parallel.

Example from slide:

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

all inside one ciphertext operation.

## 13.4 Throughput advantage

A neural-network linear layer can map to:

- One homomorphic multiplication.
- A few rotations.

This gives much better throughput than encrypting one number per ciphertext.

---

# 14. Worked example: encrypted dot product

🚩 **EXAM FLAG — worked example:** The key takeaways explicitly list the encrypted dot product with `w=(0.5,-0.3,0.8)` as a hand-verifiable example.

## 14.1 Task

Compute:

```latex
y = w_1x_1 + w_2x_2 + w_3x_3
```

Features `x` are private and encrypted.

Weights `w` are plaintext and held by the server.

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

## 14.2 Step 1: Client encrypts `x`

The client packs:

```latex
x = (2.0, 1.0, 1.5, 0, \ldots)
```

into a ciphertext:

```latex
ct_x
```

The server sees only ciphertext.

## 14.3 Step 2: Server multiplies by plaintext weights

The server has plaintext:

```latex
w = (0.5, -0.3, 0.8, 0, \ldots)
```

Slot-wise multiplication gives:

```latex
ct' = (1.0, -0.3, 1.2, 0, \ldots)
```

inside the ciphertext.

The server does not see these red/plain values; they are a “god’s-eye view” shown for explanation.

## 14.4 Step 3: Sum slots using rotate-and-add

The slide uses a toy setting with 4 slots, where the fourth slot is padded to 0.

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

These are partial sums.

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

Now every slot contains the dot product.

## 14.5 Step 4: Client decrypts

The client decrypts:

```latex
ct_y
```

and reads slot 0:

```latex
1.9
```

## 14.6 Cost and security

Cost:

```latex
1 \text{ ciphertext-plaintext multiplication} + \log_2 S \text{ rotations over } S \text{ slots}
```

Security:

- Server learns nothing about `x`.
- Server learns nothing about the answer.
- The dot product is the heart of every NN linear layer.

---

# 15. Development of homomorphic encryption

The lecture shows a broader development timeline with three stages.

## 15.1 Early exploration stage

Examples shown:

- RSA, 1978.
- ElGamal, 1985.
- Benaloh, 1988.
- Paillier, 1999.

This stage contains early partial homomorphic schemes.

## 15.2 Theoretical breakthrough stage

Examples shown:

- Gentry, 2009.
- BFV, 2012.
- BGV, 2014.
- CKKS, 2017.
- Bootstrapping, 2018.

[UNCLEAR: the slide is a visual timeline only; it does not provide detailed explanations of each item in this stage.]

## 15.3 Efficiency optimisation stage

Examples shown:

- TFHE, 2019.
- RNS-CKKS, 2021.
- SHARP, 2023.

[UNCLEAR: these specific optimisation-stage entries are shown visually but not explained in the provided slide text.]

---

# 16. End-to-end FHE pipeline

## 16.1 Pipeline overview

The pipeline is:

```latex
\text{Encode} \rightarrow \text{Encrypt} \rightarrow \text{Eval } f \rightarrow \text{Decrypt} \rightarrow \text{Decode}
```

Client side:

1. Encode.
2. Encrypt.

Server side:

3. Evaluate `f`.

Client side:

4. Decrypt.
5. Decode.

## 16.2 Step-by-step

### Step 1: Encode

Pack the data into the scheme’s plaintext space.

The data may be:

- A number.
- A vector.
- An image.

The plaintext space is represented as a polynomial.

### Step 2: Encrypt

The client uses the public key:

```latex
pk
```

to produce a ciphertext.

### Step 3: Evaluate

The server runs the homomorphic circuit for:

```latex
f
```

without ever seeing the secret key:

```latex
sk
```

### Step 4: Decrypt

The client uses:

```latex
sk
```

to recover the result polynomial.

### Step 5: Decode

The client unpacks the polynomial back into the intended output type:

- Number.
- Vector.
- Other data format.

## 16.3 What the server learns

The slide states:

- Nothing about `x`.
- Nothing about `f(x)`.
- Only the structure of `f`, which the server programmed itself.

Security holds under the LWE/RLWE assumption.

---

# 17. ML application 1: encrypted logistic regression

## 17.1 Plain model

A logistic-regression classifier predicts:

```latex
\hat{y} = \sigma(w^\top x + b)
```

where:

```latex
\sigma(z) = \frac{1}{1 + e^{-z}}
```

## 17.2 Encrypted setting

The client encrypts features:

```latex
x \in \mathbb{R}^{10}
```

The server holds:

- Weights `w`.
- Bias `b`.

## 17.3 Step 1: encrypted linear part

The server computes:

```latex
ct_z = \operatorname{Enc}(w^\top x + b)
```

using:

- One ciphertext-plaintext multiplication.
- Slot summation.

## 17.4 Step 2: sigmoid approximation

CKKS has no native sigmoid function.

The slide gives a cubic approximation on:

```latex
z \in [-5,5]
```

```latex
\sigma(z) \approx 0.5 + 0.197z - 0.004z^3
```

This uses:

- Two multiplications.
- A few additions.

The server applies this polynomial to:

```latex
ct_z
```

to obtain:

```latex
ct_{\hat{y}}
```

For wider input ranges, the slide says higher-degree polynomials or piecewise approximations are used.

## 17.5 Step 3: decrypt and round

The client decrypts:

```latex
ct_{\hat{y}}
```

and rounds to:

```latex
\{0,1\}
```

## 17.6 Pattern that recurs

Linear operations are easy under FHE.

Non-linear operations need polynomial approximation.

The central technique is replacing:

- Sigmoid.
- ReLU.
- Softmax.

with low-degree polynomials.

🚩 **EXAM FLAG — recurring pattern:** The slide says this is the central technique and that it will appear again next lecture.

---

# 18. ML application 2: federated-learning aggregation

## 18.1 Setting

There are:

```latex
K
```

clients.

Each client has private data and computes a local gradient:

```latex
\Delta_k
```

The server should compute the average:

```latex
\bar{\Delta} = \frac{1}{K}\sum_k \Delta_k
```

without seeing individual gradients.

## 18.2 Paillier as additive PHE

The slide states Paillier is the canonical additive PHE.

Its ciphertext operation is:

```latex
c_1 \cdot c_2 = \operatorname{Enc}(m_1 + m_2)
```

So multiplying ciphertexts adds plaintexts.

## 18.3 Aggregation protocol

Each client encrypts:

```latex
c_k = \operatorname{Enc}(\Delta_k)
```

The server multiplies ciphertexts:

```latex
\prod_k c_k = \operatorname{Enc}\left(\sum_k \Delta_k\right)
```

The aggregator decrypts only the sum.

Individual gradients are never visible.

## 18.4 Security motivation

The slide states that hiding individual gradients makes the protocol resistant to gradient-inversion attacks.

## 18.5 Why use FHE/CKKS instead of only Paillier?

Paillier handles addition only.

Advanced federated learning may require multiplication on encrypted gradients, such as:

- Weighted averaging with encrypted weights.
- Robust aggregation with encrypted clipping norms.
- Differential-privacy noise calibration.

CKKS supports:

- Addition.
- Multiplication.
- Full gradient vectors per ciphertext via SIMD batching.

## 18.6 Production status

The slide says production FL today mostly uses MPC-based aggregation, specifically Bonawitz et al., 2017, for speed.

FHE-based aggregation is gaining ground in regulated settings where non-interactivity matters.

---

# 19. ML application 3: private neural-network inference — CryptoNets pattern

## 19.1 CryptoNets blueprint

CryptoNets, Microsoft 2016, is presented as the first end-to-end demonstration of an encrypted CNN for MNIST digit classification.

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

The final output has 10 classes.

## 19.2 Design rules

The slide says these design rules are still used today:

- Replace ReLU with:

```latex
x^2
```

  a squaring activation using one multiplication.

- Replace max-pooling with mean-pooling.

Reason:

- Max-pooling requires comparisons.
- Mean-pooling avoids comparisons.

- No batch normalisation.
- No division.
- Keep multiplicative depth low.

## 19.3 Looking ahead

Many modern FHE-friendly architectures trace back to the 2016 CryptoNets paper.

Still-used rulebook:

- Polynomial activations.
- No comparisons.
- Mean-only pooling.

---

# 20. Performance reality check

## 20.1 Practicality spectrum

The slide places workloads on a spectrum:

Usable:

- Linear models.
- Logistic regression.

Feasible:

- Small CNNs.
- ResNet inference.

Research:

- Transformer encoder.
- Full LLM.

## 20.2 Main performance asymmetry

The key asymmetry:

- Addition is nearly free.
- Multiplication and bootstrapping dominate cost.

## 20.3 What helps

The slide lists:

- SIMD batching helps a lot when there is parallelism.
- Early GPU/FPGA accelerators.
- Newer ASIC designs.

## 20.4 Remaining slowdown

Even with improvements, FHE remains:

```latex
10^3 \text{ to } 10^5
```

times slower than plaintext.

🚩 **EXAM FLAG — performance:** The key takeaways explicitly state the `10^3`–`10^5` slowdown and distinguish practical small workloads from transformer/LLM research.

---

# 21. Limitations of FHE

## 21.1 Compute overhead

FHE is:

```latex
10^3 \text{ to } 10^5
```

times slower than plaintext for typical ML workloads.

Real-time inference on large models is not yet practical.

## 21.2 Memory and ciphertext size

A single CKKS ciphertext is typically several MB.

Many encrypted images cause memory and bandwidth to balloon.

## 21.3 Non-polynomial functions are hard

FHE natively supports:

```latex
+
```

and:

```latex
\times
```

Hard functions include:

- Comparisons.
- Max.
- ReLU.
- Division.
- Exponential.
- Softmax.

These require:

- Polynomial approximations.
- LUTs using TFHE.

This is described as the central engineering pain of FHE for ML.

## 21.4 Parameter selection is delicate

Wrong parameter choice can cause:

- Insecurity.
- Noise overflow.

Compilers such as EVA and Concrete automate this, but FHE deployment still needs expertise.

## 21.5 FHE protects computation, not the model

FHE keeps inputs and outputs private.

It does not prevent model extraction via repeated queries.

The slide says to combine with:

- Rate limiting.
- Differential privacy.
- Zero-knowledge proofs.

as needed.

---

# 22. Preview of next lecture: AI/ML applications

## 22.1 Encrypted NN inference

Setting:

- Client encrypts input.
- Server runs neural network layer-by-layer on ciphertexts.
- Server returns encrypted output.

Example privacy claims on the slide:

- Patient never reveals MRI.
- Provider never reveals weights.

Examples named:

- CryptoNets.
- Gazelle.
- HE-Transformer.

## 22.2 FHE-friendly NN design

Techniques:

- Replace ReLU with low-degree polynomial approximations.
- Use average pooling instead of max pooling.
- Reduce circuit depth.

Trade-off:

- Slight accuracy loss.
- Speed improvement of `10`–`100×`.

## 22.3 Encrypted training

Encrypted training is rare.

Reason:

- Gradients need non-polynomial activations.
- Training uses deep circuits.

Current scope described:

- Active research.
- Mostly limited to logistic regression so far.

## 22.4 Hybrid protocols

Hybrid protocols combine:

- FHE for linear layers.
- MPC for non-linear activations.

Examples:

- Gazelle.
- Delphi.

The slide calls this a best-of-both approach and says it is the dominant deployed approach today.

## 22.5 Coming up

Next lecture drills into:

- Microsoft CryptoNets, 2016.
- Intel HE-Transformer, 2019.
- Gazelle, 2018.
- Engineering details of polynomial activations.
- Depth budgets.

---

# 23. Lecture 10.1 key takeaways

🚩 **EXAM FLAG — key takeaways slide:** The following points are directly listed on the lecture’s key takeaways slide.

1. FHE lets a server compute:

```latex
f(x)
```

on:

```latex
\operatorname{Enc}(x)
```

without seeing `x`.

Three properties are named:

- Correctness.
- Security.
- Compactness.

2. Three flavours:

- PHE: one operation, e.g. RSA or Paillier.
- SHE: both operations, limited depth.
- FHE: both operations, unlimited depth.

3. Worked examples to verify by hand:

- RSA multiplication on `N=33`.
- DGHV on `p=29`.
- Encrypted dot product with:

```latex
w = (0.5, -0.3, 0.8)
```

4. Modern FHE is encryption with noise.

- Addition adds noise gently.
- Multiplication makes noise explode.
- This creates the depth wall.

5. Bootstrapping, Gentry 2009, refreshes a noisy ciphertext by running decryption homomorphically.

This gives unlimited depth.

6. Four generations:

- Gen 1: DGHV.
- Gen 2: BGV/BFV.
- Gen 3: GSW.
- Gen 4: CKKS.

CKKS is the workhorse for ML.

7. ML applications:

- Encrypted logistic regression with polynomial sigmoid.
- Federated-learning secure aggregation.
- CryptoNets-style private CNN.

Linear is cheap; non-linear needs polynomial approximation.

8. Performance:

```latex
10^3 \text{ to } 10^5
```

times slower than plaintext.

Linear models and small CNNs are practical today; transformers and LLMs are research.

---

# Lecture 10.3 — FHE for Machine Learning: library tour

# 24. Lecture topic and learning objectives

## 24.1 Topic

This lecture gives a historical tour of FHE libraries for machine learning.

The six libraries covered are:

1. HElib.
2. Microsoft SEAL.
3. TenSEAL.
4. IBM HElayers.
5. OpenFHE.
6. Zama Concrete-ML.

## 24.2 Historical ordering

The slide gives:

| Library | Origin/date | Main interface/scheme focus |
|---|---|---|
| HElib | IBM, 2013 | C++, BGV |
| SEAL | Microsoft, 2015 | C++, BFV/CKKS |
| TenSEAL | OpenMined, 2020 | Python/SEAL |
| HElayers | IBM, 2021 | Python SDK |
| OpenFHE | 2022 | C++/Python |
| Concrete-ML | Zama, 2022 | PyTorch / ML-first |

The slide groups the development as:

- Primitives.
- Python wrappers.
- Unified and ML-first tools.

## 24.3 Learning objectives

By the end of the lecture, students should be able to:

1. Recognise the six libraries and their historical context.
2. Read a code snippet from each and tell which crypto knobs are hidden.
3. Compare them on:
   - Schemes.
   - API level.
   - Automation.
   - Licence.
4. Choose the right library for:
   - Production.
   - Research.
   - Teaching.

🚩 **EXAM FLAG — learning objectives:** These are explicitly listed as “By the end of today, you should be able to.”

## 24.4 Important caution

The slide states:

> Versions and features evolve fast — always check the upstream repo before you build on it.

🚩 **EXAM FLAG / practical warning:** The lecture explicitly warns that library versions and features evolve quickly.

---

# 25. Quick recap: FHE primitives needed for ML libraries

## 25.1 Three FHE scheme families

### BGV / BFV

Used for:

- Exact integers.

### CKKS

Used for:

- Approximate reals.

This is especially relevant for ML.

### TFHE / FHEW

Used for:

- Bit-level LUTs.

## 25.2 ML pain points

The slide lists the main ML difficulties:

- ReLU is non-native.
- Max-pooling is non-native.
- Softmax is non-native.
- Multiplicative depth is finite.
- Bootstrapping is expensive.

## 25.3 Translation playbook

The FHE-for-ML playbook:

| ML operation | FHE-friendly replacement |
|---|---|
| ReLU | `x^2`, polynomial, or LUT |
| Max-pool | Mean-pool |
| Inputs/model | Quantise and SIMD-pack |

## 25.4 Why libraries matter

Libraries matter because they:

- Hide lattice math.
- Determine what is easy to express.

Connection to Lecture 10.1: this recap uses the same distinction between exact integer schemes, approximate CKKS, and bit/LUT-based TFHE/FHEW.

---

# 26. FHE library family tree, 2009–2026

## 26.1 Theory papers above the timeline

The slide places theory papers above the timeline:

- 2009: Gentry’s thesis.
- 2012: BGV scheme.
- 2016: TFHE paper.
- 2017: CKKS paper.

## 26.2 Open-source libraries below the timeline

The slide places libraries and systems below:

- 2013: HElib.
- 2015: SEAL.
- 2016: CryptoNets.
- 2020: TenSEAL.
- 2021: HElayers.
- 2022: OpenFHE.
- 2022: Concrete-ML.
- 2026: LLM-FHE research.

## 26.3 Three eras

### 2013–2017: primitives

HElib, C++, cryptographers only.

### 2018–2021: Python wrappers

SEAL standardises the API.

TenSEAL and HElayers wrap it.

### 2022–2026: ML compilers

OpenFHE unifies schemes.

Concrete-ML compiles PyTorch.

---

# 27. Where the story starts: Gentry, 2009–2011

## 27.1 Gentry-Halevi 2011

The first FHE prototype is described as:

- Slow.
- Using huge keys.

## 27.2 Realisation

FHE works in theory, but needs a usable library.

## 27.3 HElib, 2013

HElib is presented as the first packaged open-source FHE library.

## 27.4 What HElib changed

For the first time, a researcher could clone a repository and run encrypted computations.

Cost of entry:

- Lattice cryptography.
- C++.

But the slide says the door had opened.

---

# 28. HElib

## 28.1 Origin

HElib:

- IBM Research.
- 2013.
- Described as “the original.”

## 28.2 What HElib pioneered

HElib pioneered:

- First open-source FHE library.
- BGV implementation.
- Later CKKS support.
- SIMD batching.
- Galois rotations.
- Modulus switching.
- Key switching.
- Bootstrapping.
- API conventions that later libraries copied.

## 28.3 The catch

Limitations:

- Heavy C++.
- No Python.
- No ML abstractions.
- Designed for cryptographers.

## 28.4 Status in the slides

The slide states:

- Last release: v2.3.0, July 2023.
- Reference implementation of BGV.

[UNCLEAR: this is the status stated in the slides. No live repository verification was possible from the provided materials.]

## 28.5 Why HElib is still taught

The slide analogy:

> HElib is to FHE what libsodium is to symmetric crypto.

Meaning in lecture context:

- Not necessarily for everyday web applications.
- Important because the vocabulary and conventions of the field were forged there.

## 28.6 HElib code example: encrypting and adding under BGV

### Goal

Encrypt two SIMD-packed vectors under BGV, add ciphertexts, decrypt result.

### Parameters shown

The code builds a BGV context:

```cpp
Context context = ContextBuilder<BGV>()
    .m(32109)
    .p(4999)
    .r(1)
    .bits(500)
    .c(2)
    .build();
```

The slide comments identify:

- `m`: cyclotomic index.
- `p`: plaintext modulus.
- `bits`: total size of ciphertext modulus chain.

Other parameters shown:

- `r(1)`.
- `c(2)`.

### Key generation

```cpp
SecKey secret_key(context);
secret_key.GenSecKey();
const PubKey& public_key = secret_key;
```

The public key is derived from the secret key object.

### SIMD packing

```cpp
const EncryptedArray& ea = context.getEA();
std::vector<long> ptxt1(ea.size(), 0), ptxt2(ea.size(), 0);
ptxt1[0] = 5;
ptxt2[0] = 7;
```

The vectors are slot-packed. Only the first slot is set to 5 and 7.

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

This performs ciphertext-ciphertext addition.

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

- Supports both BGV and CKKS.
- Has BGV bootstrapping.
- Mature and well documented.
- Intel HEXL acceleration.

## 28.8 HElib weaknesses

- C++ only.
- Steep learning curve.
- Manual parameter selection.
- No tensor abstractions.
- Codebase hard to read.

## 28.9 Best for

HElib is best for:

- FHE protocol researchers.
- Crypto PhD students.
- New BGV scheme design.
- Benchmarking BGV across libraries.

---

# 29. Microsoft SEAL

## 29.1 Shift from HElib to SEAL

The slide frames the shift as:

```latex
\text{usable by cryptographers}
\rightarrow
\text{usable by C++ engineers}
```

SEAL’s bet:

> The bottleneck for FHE adoption is the API, not the crypto.

## 29.2 Origin

Microsoft SEAL:

- Microsoft Research.
- First released 2015.
- MIT from 2018.
- Described as “the standard.”

## 29.3 Schemes

SEAL supports:

- BFV — exact integers.
- CKKS — approximate reals; ML default.
- BGV — exact integers, added in v4.0, 2022.

The slide says:

- No CKKS bootstrapping in mainline.

## 29.4 Why SEAL became the standard

Reasons listed:

- MIT licence.
- Fully open.
- Cross-platform.
- No dependencies.
- Heavily commented examples.
- Backend for:
  - TenSEAL.
  - PyFHEL.
  - EVA.

## 29.5 Microsoft Research FHE stack

The slide lists:

```latex
\text{SEAL library}
+
\text{EVA compiler}
+
\text{HEAX FPGA}
```

with EVA from PLDI 2020 and HEAX from ASPLOS 2020.

## 29.6 SEAL code example: CKKS encrypted polynomial `3x^2`

### Goal

Compute:

```latex
3x^2
```

on encrypted CKKS vectors.

### Important point

The slide emphasises that the scheme, ring degree, modulus chain, and scale are all chosen by hand.

### Parameters

The code sets:

```cpp
EncryptionParameters parms(scheme_type::ckks);
parms.set_poly_modulus_degree(8192);
parms.set_coeff_modulus(
    CoeffModulus::Create(8192, {60, 40, 40, 60})
);
SEALContext context(parms);
double scale = pow(2.0, 40);
```

Crypto knobs visible to the developer:

- Scheme: CKKS.
- Polynomial modulus degree: 8192.
- Coefficient modulus chain: `{60,40,40,60}`.
- Scale:

```latex
2^{40}
```

### Keys and utilities

The code creates:

- KeyGenerator.
- Secret key.
- Public key.
- Relinearisation keys.
- Encryptor.
- Evaluator.
- Decryptor.
- CKKSEncoder.

### Encode and encrypt vector

The vector is:

```latex
(1,2,3,4)
```

It is encoded at scale `2^40` and encrypted.

### Homomorphic computation

The computation:

```cpp
eval.square_inplace(ct);
eval.relinearize_inplace(ct, rk);
eval.rescale_to_next_inplace(ct);
```

This computes `x^2`, then relinearises and rescales.

Then the plaintext constant 3 is encoded at the ciphertext’s current level and scale:

```cpp
encoder.encode(3.0, ct.parms_id(), ct.scale(), three);
```

The slide explicitly marks that the level must match:

> match level!

Then:

```cpp
eval.multiply_plain_inplace(ct, three);
```

### Decrypt and decode

The result is approximately:

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

## 29.7 EVA: Python compiler hiding SEAL parameters

### Same computation at higher level

The EVA code describes:

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

The EVA compiler picks:

- Ring degree.
- Modulus chain.
- Rescaling positions.
- Relinearisation positions.

### Execution flow

The code:

1. Compiles the program.
2. Generates keys.
3. Encrypts inputs.
4. Executes the compiled program on encrypted data.
5. Decrypts outputs.

### EVA warning

The slide says EVA is in maintenance freeze:

- Last release v1.0.1, 2021.
- Only validated against SEAL v3.6.4.
- The ideas live on; the codebase does not.

🚩 **EXAM FLAG / practical warning:** EVA is an example of a compiler that hides parameter choices, but the slide explicitly warns that the codebase is stalled.

## 29.8 SEAL strengths

- Mature C++17 API.
- MIT licence.
- Excellent commented examples.
- Cross-platform.
- No dependencies.
- Backend for many wrappers.

## 29.9 SEAL weaknesses

- No native Python.
- No tensor/ML abstractions.
- Manual parameter selection.
- No CKKS bootstrapping.

## 29.10 Best for

SEAL is best for:

- C++ engineers building custom FHE applications.

---

# 30. TenSEAL

## 30.1 Shift from SEAL to TenSEAL

SEAL gives production CKKS in C++, but:

- C++ only.
- No native Python.
- No notion of tensors.

TenSEAL wraps SEAL and provides:

- Python interface.
- Tensor-like API.
- `ts.ckks_vector(ctx, vec)`.
- `matmul`.
- `polyval`.
- `conv2d`.

## 30.2 OpenMined philosophy

The lecture states the philosophy:

> Let a Python data scientist do encrypted tensor arithmetic without learning C++.

Same lattice scheme:

- CKKS through SEAL.

Different interface:

- NumPy-shaped API.

## 30.3 Origin

TenSEAL:

- OpenMined.
- 2020.
- Python tensors meet CKKS.

## 30.4 Features

TenSEAL provides:

- `CKKSVector`.
- `CKKSTensor`.
- Dot product.
- Matrix multiplication.
- `conv2d_im2col`.
- `polyval` for polynomial activations.
- Encrypted-encrypted operations.
- Encrypted-plain operations.
- Protobuf serialisation.

## 30.5 Style

The slide lists:

- `pip install tenseal`.
- Apache 2.0.
- Best for prototypes and teaching.
- You still see the ciphertexts.
- Used in PySyft tutorials.
- Less parameter abstraction than EVA.

## 30.6 Why it remains popular for teaching

TenSEAL is:

- Thin enough that students still see ciphertexts.
- Thick enough to prototype an encrypted MNIST CNN in about 100 lines.

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

- Scheme: CKKS.
- Polynomial modulus degree: 8192.
- Coefficient modulus bit sizes: `[60,40,40,60]`.

### Generate Galois keys

```python
context.generate_galois_keys()
```

The slide comments:

- Used for rotations.

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

- Easy installation.
- Clear NumPy-like API.
- Great for prototyping and teaching.

## 30.9 TenSEAL weaknesses

- Manual parameter selection.
- No PyTorch/ONNX compilation.
- Slow maintenance.

## 30.10 Best for

TenSEAL is best for:

- Proof-of-concept encrypted ML.
- Course exercises.

---

# 31. IBM HElayers

## 31.1 Shift from TenSEAL to HElayers

TenSEAL handles encrypted tensors, but the next question is:

> How do I run my whole CNN?

HElayers is presented as IBM’s enterprise SDK addressing this.

## 31.2 The leap: tile tensors

HElayers searches automatically for an efficient layout that packs a 4-D tensor into ciphertext slots.

The slide says the PETS 2023 paper reports:

- HE-friendly AlexNet in about 5 minutes under a specific experimental setup.
- Later work covers SqueezeNet and ResNet.

## 31.3 Origin

IBM HElayers:

- IBM Research.
- 2021.
- Enterprise SDK.

## 31.4 Built for production

The slide lists:

- Powers IBM FHE Cloud.
- Healthcare and finance pilots.
- Backends:
  - SEAL.
  - OpenFHE.
  - Others.
- `mltoolbox`: PyTorch to FHE.
- Built-in:
  - Neural networks.
  - XGBoost.
  - ARIMA.

## 31.5 Distinctive features

HElayers includes:

- Cost-model parameter tuning.
- Rotation-key optimisation.
- Automatic bootstrapping placement.
- Multi-party FHE.
- MPC.

## 31.6 Licence note

The slide distinguishes:

- Community edition: free, non-commercial.
- Premium edition: paid.

It ships as Docker images.

## 31.7 HElayers strengths

- Production-grade NN compiler.
- Multi-backend.
- Tile tensors for automatic packing.
- Built-in support for:
  - Neural networks.
  - Trees.
  - Logistic regression.

## 31.8 HElayers weaknesses

- Closed-source.
- Steeper API than Concrete-ML.
- IBM-tied distribution.
- Cannot fork or audit.

## 31.9 Best for

HElayers is best for:

- Regulated industries.
- IBM Cloud customers.
- Vendor-supported pilots.

---

# 32. OpenFHE

## 32.1 Unification story

The slide describes OpenFHE as:

- Successor of PALISADE.
- Influenced by the broader FHE ecosystem.
- Supported backend for HElayers.

Inputs/influences shown:

- HElib.
- PALISADE.
- HEAAN.

## 32.2 Why OpenFHE matters

By 2022 the field was fragmented:

- HElib: BGV.
- SEAL: CKKS.
- Concrete: TFHE.
- FHEW: Boolean.

OpenFHE brings multiple schemes into one library:

- BFV.
- BGV.
- CKKS.
- FHEW.
- TFHE.

It also supports scheme switching:

```latex
\text{CKKS} \leftrightarrow \text{FHEW}
```

for non-smooth functions such as ReLU.

## 32.3 Origin

OpenFHE:

- Duality + community.
- 2022.
- Described as “the unifier.”

## 32.4 Schemes and engineering

### Schemes

OpenFHE supports:

- BFV/BGV for exact integers.
- CKKS for approximate reals.
- FHEW/DM for bit-level computation.
- TFHE/CGGI for programmable bootstrapping.
- Scheme switching CKKS ↔ FHEW.

### Engineering

The slide lists:

- NumFOCUS Sponsored Project.
- C++ core.
- Official Python bindings.
- OpenMP.
- Intel HEXL backend.
- HomomorphicEncryption.org standards.
- Featured in AAAI 2024 PPML tutorial.

## 32.5 What scheme switching buys

The slide’s example:

- Use CKKS for matrix multiplication.
- Use TFHE for ReLU.
- Switch between them mid-computation.

The slide states OpenFHE is the only mainline FHE library to ship this as a public API.

## 32.6 OpenFHE code example: encrypted polynomial in Python

### Goal

Compute:

```latex
3x^2 + x
```

on encrypted vectors.

### Parameters

The code creates CKKS parameters:

```python
parameters = CCParamsCKKSRNS()
parameters.SetMultiplicativeDepth(2)
parameters.SetScalingModSize(50)
parameters.SetBatchSize(8)
```

Crypto knobs visible:

- Multiplicative depth: 2.
- Scaling modulus size: 50.
- Batch size: 8.

### Generate crypto context

```python
cc = GenCryptoContext(parameters)
```

### Enable features

The code enables:

```python
cc.Enable(PKESchemeFeature.PKE)
cc.Enable(PKESchemeFeature.KEYSWITCH)
cc.Enable(PKESchemeFeature.LEVELEDSHE)
```

Meaning the context supports:

- Public-key encryption.
- Key switching.
- Leveled somewhat homomorphic evaluation.

### Generate keys

```python
keys = cc.KeyGen()
cc.EvalMultKeyGen(keys.secretKey)
```

Multiplication keys are generated.

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

- All common schemes.
- Scheme switching as public API.
- Active community.

## 32.8 OpenFHE weaknesses

- Manual parameter selection.
- No neural-network compiler.
- Large API surface.

## 32.9 Best for

OpenFHE is best for:

- FHE researchers needing all schemes.
- Custom privacy-preserving ML protocols.

---

# 33. Concrete-ML

## 33.1 PyTorch-first turn

The lecture frames the shift as:

Earlier libraries ask:

> Give me a circuit; I’ll evaluate it homomorphically.

Concrete-ML asks:

> Give me a PyTorch/sklearn model; I’ll give you encrypted inference.

## 33.2 Interface shift

HElib and SEAL:

- Require designing encrypted circuits.

HElayers and EVA:

- Move toward model-level compilation.

Concrete-ML:

- Is presented as a true sklearn/PyTorch drop-in.
- Handles:
  - Quantisation.
  - Activations.
  - Parameters.
  - Keys.
  - Deployment.

## 33.3 Origin

Concrete-ML:

- Zama.
- 2022.
- Described as the ML compiler.

## 33.4 Frontends

The slide lists:

- `concrete.ml.sklearn`:
  - Logistic regression.
  - Random forest.
  - XGBoost.
  - `NeuralNetClassifier`.
- `compile_torch_model(net, X)`.
- `compile_brevitas_qat_model` for QAT-trained networks.

## 33.5 Under the hood: TFHE

Concrete-ML uses TFHE.

The slide says:

- Programmable bootstrapping = LUT.
- ReLU, sigmoid, and GELU can be handled.
- Compiler picks all crypto parameters.
- GPU support from v1.7+ for LoRA.
- LoRA fine-tuning of LLMs from v1.7+.

[UNCLEAR: these version-specific claims are from the 2026 slide deck and were not independently verified against a current repository.]

## 33.6 Why TFHE was the right choice

Programmable bootstrapping evaluates any function on encrypted bits in constant time.

Therefore, every NN activation can become a single lookup table, including:

- ReLU.
- Sigmoid.
- GELU.

This contrasts with CKKS-style polynomial approximation.

## 33.7 Concrete-ML code example: trained model to FHE in 5 lines

### Goal

Encrypted logistic regression.

### Import

The slide emphasises:

```python
from concrete.ml.sklearn import LogisticRegression
```

The note says:

> only the import differs

from ordinary sklearn style.

### Dataset

The code loads breast-cancer data:

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

The `n_bits=8` parameter sets quantisation.

### Compile to FHE

```python
model.compile(X_tr)
```

The slide comments:

- Auto parameters.

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

## 33.8 Concrete-ML code example: compiling an LLM for FHE inference

### Imports

The code imports:

- `random`.
- `json`.
- `numpy`.
- `torch`.
- Hugging Face Transformers:
  - `AutoModelForCausalLM`.
  - `AutoTokenizer`.
  - `Conv1D`.
  - `Trainer`.
  - `TrainingArguments`.
- `HybridFHEModel` from Concrete-ML.

### Load GPT-2

```python
tokenizer = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2")
model.config.pad_token_id = model.config.eos_token_id
```

### Determine FHE layers

The code scans model modules:

```python
remote_names = []
for name, module in model.named_modules():
    if isinstance(module, (torch.nn.Linear, Conv1D)):
        remote_names.append(name)
```

Linear layers and `Conv1D` modules are selected.

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

The slide’s point is not that a full LLM is already routine, but that Concrete-ML exposes a compiler-style workflow for hybrid FHE inference.

---

# 34. Side-by-side library comparison

## 34.1 Comparison table from the lecture

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

[UNCLEAR: repository stars and library version information are stated in the slides as of retrieval dates in 2026. They may have changed.]

## 34.2 Main comparison message

Left-to-right, the libraries add abstraction.

Concrete-ML hides the most, but the slide states this comes at the cost of:

- TFHE-only operation.
- Non-commercial licence constraints.

The slide note says:

- Free for research/prototyping.
- Commercial use needs Zama patent licence.
- HElayers ships via Docker/PyPI.

---

# 35. Lecture 10.3 key takeaways

🚩 **EXAM FLAG — “Five things to remember” slide:** The lecture explicitly lists the following five points.

## 35.1 HElib

HElib is the canonical BGV reference.

The slide says to read its source to understand FHE deeply.

## 35.2 SEAL

SEAL standardised the C++ API.

It is the substrate many wrappers build on.

## 35.3 TenSEAL

TenSEAL is SEAL as a Python tensor library.

Best for:

- Prototypes.
- Teaching.

## 35.4 HElayers and OpenFHE

These represent two paths to industrial FHE:

- HElayers: enterprise SDK.
- OpenFHE: unified library.

## 35.5 Concrete-ML

Concrete-ML inverts the question:

From:

> write a circuit

to:

> compile your model

The slide calls it the natural starting point for ML practitioners in 2026.

## 35.6 No single winner

No single library wins on every axis.

Choose according to priority:

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

Lecture 10.1 introduces the primitives:

- PHE.
- SHE.
- FHE.
- Noise.
- Bootstrapping.
- CKKS.
- TFHE-style LUTs.
- Polynomial approximations.

Lecture 10.3 shows how these primitives appear in libraries:

- HElib: BGV and bootstrapping.
- SEAL: BFV/CKKS with manual parameter control.
- TenSEAL: CKKS vectors/tensors over SEAL.
- HElayers: production compiler and automatic packing.
- OpenFHE: all major schemes and scheme switching.
- Concrete-ML: TFHE/programmable bootstrapping/LUT-based ML compiler.

## 36.2 CKKS connection

CKKS appears as the ML workhorse in Lecture 10.1 because it supports approximate real arithmetic and SIMD batching.

In Lecture 10.3, CKKS appears in:

- SEAL.
- TenSEAL.
- HElayers.
- OpenFHE.

CKKS is associated with:

- Approximate real arithmetic.
- Matrix-vector products.
- SIMD slot packing.
- Polynomial approximations for non-linearities.

## 36.3 TFHE connection

Lecture 10.1 mentions LUTs using TFHE as a way to handle non-polynomial functions.

Lecture 10.3 connects TFHE to Concrete-ML:

- Programmable bootstrapping.
- Activations as lookup tables.
- ReLU, sigmoid, GELU handled via LUTs.

## 36.4 Linear versus nonlinear operations

A repeated theme across both lectures:

- Linear operations are easy.
- Non-linear operations are hard.

Examples:

- Dot products are natural under CKKS.
- Logistic regression linear part is easy.
- CNN convolutions/dense layers are mostly linear.
- ReLU, max-pool, sigmoid, softmax require replacement.

Replacement strategies:

- Polynomial approximation.
- Squaring activation `x^2`.
- Mean-pooling instead of max-pooling.
- LUTs with TFHE.
- Hybrid protocols using MPC for non-linear activations.

## 36.5 Bootstrapping connection

Lecture 10.1 explains bootstrapping conceptually.

Lecture 10.3 shows how libraries handle it differently:

- HElib includes BGV bootstrapping.
- SEAL mainline has no CKKS bootstrapping.
- HElayers can place bootstrapping automatically.
- OpenFHE supports programmable bootstrapping through TFHE/CGGI and scheme switching.
- Concrete-ML uses TFHE programmable bootstrapping as LUTs.

## 36.6 Federated learning connection

Lecture 10.1 connects Paillier to federated-learning aggregation.

Important distinction:

- Paillier is enough for simple secure sums.
- CKKS/FHE is needed when encrypted multiplication is required for more advanced FL operations.

## 36.7 Next lecture connection

The slides explicitly preview:

- CryptoNets.
- HE-Transformer.
- Gazelle.
- Polynomial activations.
- Depth budgets.
- Microsoft stack:
  - SEAL.
  - EVA.
  - HEAX.
- Encrypted Transformers.

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

- PHE.
- SHE.
- FHE.

🚩 Know the formal homomorphic property:

```latex
\operatorname{Dec}(\operatorname{Enc}(a)\circ\operatorname{Enc}(b)) = a \star b
```

🚩 Know that FHE supports both addition and multiplication at unlimited depth.

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

- Addition: gentle/linear.
- Multiplication: explosive/multiplicative.

🚩 Depth wall:

- Ciphertext becomes undecryptable when noise exceeds budget.

🚩 Bootstrapping:

- Runs decryption homomorphically.
- Uses encrypted secret key.
- Produces a fresh ciphertext.
- Enables unlimited depth.

## 38.4 Must-know FHE generations

🚩 Four generations:

1. Gentry/DGHV.
2. BGV/BFV.
3. GSW.
4. CKKS.

🚩 CKKS is the ML workhorse.

## 38.5 Must-know ML pattern

🚩 Linear operations are easy.

🚩 Non-linear operations require:

- Polynomial approximation.
- LUTs.
- Hybrid protocols.

🚩 CryptoNets design rules:

- ReLU `\rightarrow x^2`.
- Max-pool `\rightarrow` mean-pool.
- Avoid comparisons.
- Avoid division.
- Keep multiplicative depth low.

## 38.6 Must-know library comparison

🚩 Five things to remember from Lecture 10.3:

1. HElib: canonical BGV reference.
2. SEAL: standardised C++ API.
3. TenSEAL: SEAL as Python tensor library.
4. HElayers and OpenFHE: enterprise SDK versus unified library.
5. Concrete-ML: compile your model, not hand-write a circuit.

---

# 39. Unclear or missing sections

[UNCLEAR: no transcript was included in the uploaded archive or prompt. Any spoken explanations, pauses, corrections, jokes, verbal examples, or verbal exam hints are missing.]

[UNCLEAR: the Week 10 archive contained `w10.1` and `w10.3` slide decks only. There was no `w10.2` file in the upload.]

[UNCLEAR: some code identifiers in the extracted PDF text were split by letter spacing, especially in SEAL, EVA, OpenFHE, and Concrete-ML snippets. The notes preserve the intended API calls using the slide visuals, but exact syntax should be checked against the original slide deck before copying code.]

[UNCLEAR: several version/status claims are from the slides’ 2026 framing, such as library versions, GitHub star counts, and maintenance status. These notes treat them as lecture content, not live repository facts.]

[UNCLEAR: the “development of homomorphic encryption” visual lists several timeline entries such as Bootstrapping 2018, TFHE 2019, RNS-CKKS 2021, and SHARP 2023, but the provided slide text does not explain those entries in detail.]

[UNCLEAR: Lecture 10.1 states FHE keeps inputs/outputs private and, in the preview section, gives an encrypted NN inference example where the provider also never reveals weights. The provided slides do not spell out the precise model-privacy mechanism for that claim.]
