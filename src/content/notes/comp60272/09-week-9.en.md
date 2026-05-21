---
subject: COMP60272
chapter: 9
title: "Week 9"
language: en
---

# Week 9 Study Notes — SMPC, Zero-Knowledge Proofs, and zkML

**Source note:** the uploaded `Week9.zip` contains three slide PDFs and no transcript file/text. No transcript followed in the message either. These notes are therefore produced from the slides, including visual slide content where PDF text extraction missed diagrams/tables. Anything that needs the missing transcript, or where slide content is inconsistent/under-explained, is marked **[UNCLEAR]**.

# Topic and scope

**Course:** COMP60272 – Security and Privacy of AI  
**Week 9 scope:** privacy-preserving and verifiable computation for AI systems: Secure Multi-Party Computation, Zero-Knowledge Proofs, and zkML.

This week connects **SMPC** for computing on private data, especially secure aggregation in federated learning, with **ZKPs** for proving correct computation without revealing secrets, then applies ZKPs to **machine learning pipelines, federated learning, neural inference, and LLMs**.

---

# Lecture 9.1 — Secure Multi-Party Computation: Fundamentals, Secure Aggregation & Applications

## 1. Learning objectives and roadmap

By the end of this lecture, you should be able to:

- Define the **SMPC problem**: computing on private inputs without a trusted party.
- Distinguish **semi-honest** and **malicious** adversary models.
- Explain **additive secret sharing** and **Shamir’s secret sharing**, including hand calculations.
- Sketch how **secure aggregation** works in federated learning using pairwise masking.
- Describe SMPC applications beyond FL: **private inference**, **Private Set Intersection**, and **collaborative training**.

**Lecture roadmap:**

1. Fundamentals: problem statement, secret sharing, Beaver triples.
2. FL application: secure aggregation via pairwise masking.
3. Beyond FL: private inference, PSI, collaborative training, performance.

⚑ **Exam/revision flag:** The slide says “By the end, you should be able to…” for the above points. Treat these as core revision targets.

---

## 2. The SMPC problem: computing on private data

### Intuition

Multiple parties each hold private data and want to compute some joint function of all their data, without revealing their individual inputs to each other.

Example from the slides:

- Hospital A has private patient data $x_1$.
- Hospital B has private patient data $x_2$.
- They want to compute something like an average blood pressure:

$$
f(x_1, x_2)
$$

but without Hospital A seeing $x_2$, and without Hospital B seeing $x_1$.

### Formal SMPC problem

There are $n$ parties with private inputs:

$$
x_1, x_2, \ldots, x_n.
$$

They want to jointly compute:

$$
y = f(x_1, x_2, \ldots, x_n)
$$

such that:

1. **Correctness:** every party learns the correct output $y$.
2. **Privacy:** no party learns anything beyond what $y$ reveals.

### Ideal world versus real world

The trivial solution would be to send all inputs to a trusted third party, who computes:

$$
f(x_1, x_2)
$$

and sends back the result.

But in the real world, there may be no trusted third party. SMPC tries to achieve the same guarantees as the trusted-third-party ideal world, but using a cryptographic protocol among the parties.

### Simulation-based security

The slide defines the security idea as:

> Whatever an adversary learns from the protocol, it could have learned from the output alone.

In other words, if the protocol transcript gives no extra information beyond the final result, the protocol is considered private.

---

## 3. Threat models: who are we defending against?

### 3.1 Semi-honest adversaries

Also called **honest-but-curious** adversaries.

A semi-honest party:

- follows the protocol correctly;
- sends the messages it is supposed to send;
- but tries to infer extra information from received messages.

Example setting from the slides:

- hospital consortiums or collaborative settings where there is some contractual trust.

### Definition in own words

A semi-honest adversary behaves correctly but reads everything it receives as carefully as possible to learn private information.

---

### 3.2 Malicious adversaries

A malicious party may deviate arbitrarily from the protocol.

It may:

- send wrong messages;
- abort;
- collude;
- actively try to cheat.

Malicious security is needed where participants may actively try to manipulate the computation, not merely observe it.

### Trade-off

Malicious security is harder to achieve and has higher overhead.

---

### 3.3 Corruption threshold

The slides distinguish between:

### Honest majority

$$
< n/2
$$

parties are corrupt.

Properties:

- many efficient protocols;
- fairness is often achievable;
- typical for semi-honest collaborative settings.

### Dishonest majority

A majority of parties may be corrupt.

Properties:

- higher overhead;
- fairness is generally impossible;
- typical for adversarial settings requiring malicious security.

⚑ **Exam/revision flag:** Be able to distinguish semi-honest from malicious adversaries, and explain how the corruption threshold affects efficiency and fairness.

---

# 4. Secret sharing: foundation of SMPC

## 4.1 Core idea

Secret sharing splits a secret value into multiple **shares** distributed among parties.

The requirements are:

1. Individual shares reveal nothing about the secret.
2. Shares can be combined to reconstruct the secret, or to compute on it.

Example from slides:

Secret:

$$
s = 7
$$

Shares over modulus $23$:

$$
s_1 = 15,\quad s_2 = 4,\quad s_3 = 11
$$

Reconstruction:

$$
15 + 4 + 11 = 30 \equiv 7 \pmod{23}.
$$

Each individual share reveals nothing, but all shares together reconstruct the secret.

---

# 5. Additive secret sharing

## 5.1 Formal definition

To share a secret:

$$
s \in \mathbb{Z}_p
$$

among $n$ parties:

1. Choose

$$
s_1, \ldots, s_{n-1}
$$

uniformly at random from $\mathbb{Z}_p$.

2. Set the final share as:

$$
s_n = s - \sum_{i=1}^{n-1} s_i \pmod p.
$$

3. Give share $s_i$ to party $i$.

Reconstruction is:

$$
s = \sum_{i=1}^{n} s_i \pmod p.
$$

### Intuition

All but one of the shares are random. The final share is chosen to make the modular sum equal the secret. Since random shares can fit any possible secret depending on the missing share, seeing fewer than all shares reveals nothing.

---

## 5.2 Worked example: additive sharing

Given:

$$
p = 23,\quad s = 7,\quad n = 3.
$$

Choose random shares:

$$
s_1 = 15,\quad s_2 = 4.
$$

Compute:

$$
s_3 = 7 - 15 - 4 = -12 \equiv 11 \pmod{23}.
$$

So the shares are:

$$
(15, 4, 11).
$$

Check:

$$
15 + 4 + 11 = 30 \equiv 7 \pmod{23}.
$$

---

## 5.3 Security of additive secret sharing

Any $n-1$ shares are uniformly random and reveal nothing about $s$.

For example, seeing:

$$
s_1 = 15
$$

alone does not let a party distinguish whether the secret was $7$ or any other value in $\mathbb{Z}_p$.

---

## 5.4 Computing on additive shares

### Addition is free

If parties hold shares of $[s]$ and $[r]$, each party locally computes:

$$
s_i + r_i.
$$

The result is a valid share of:

$$
s + r.
$$

No communication is needed.

### Scalar multiplication is also local

For a public scalar $c$, each party computes:

$$
c \cdot s_i.
$$

The result is a share of:

$$
c \cdot s.
$$

---

## 5.5 Worked example: adding shared values

All arithmetic is modulo $23$.

Shares of $s = 7$:

$$
(15, 4, 11)
$$

because:

$$
15 + 4 + 11 = 30 \equiv 7 \pmod{23}.
$$

Shares of $r = 3$:

$$
(9, 18, 22)
$$

because:

$$
9 + 18 + 22 = 49 \equiv 3 \pmod{23}.
$$

Each party adds locally:

$$
15 + 9 = 24 \equiv 1 \pmod{23},
$$

$$
4 + 18 = 22 \pmod{23},
$$

$$
11 + 22 = 33 \equiv 10 \pmod{23}.
$$

So shares of $s + r$ are:

$$
(1, 22, 10).
$$

Check:

$$
1 + 22 + 10 = 33 \equiv 10 \pmod{23}.
$$

And:

$$
7 + 3 = 10.
$$

---

## 5.6 Limitation of additive sharing

All $n$ parties must be present to reconstruct the secret.

One dropout means the secret is lost.

This becomes important in federated learning, where clients may drop out because of battery, connectivity, or scheduling.

---

# 6. Shamir’s secret sharing

## 6.1 Motivation: dropout tolerance

Additive sharing requires all shares. Shamir’s secret sharing allows reconstruction from only a threshold number of shares.

This is useful in settings where parties may drop out.

---

## 6.2 Core idea

Use a random polynomial of degree $t$. Any $t+1$ shares reconstruct the secret, while any $t$ shares reveal nothing.

### Formal protocol

1. Choose a random polynomial:

$$
q(x) = s + a_1x + \cdots + a_tx^t
$$

with:

$$
q(0) = s.
$$

2. Give party $i$ the share:

$$
s_i = q(i).
$$

3. Reconstruct using **Lagrange interpolation** from any $t+1$ shares.

### Intuition

The secret is the polynomial’s value at $x=0$. Each share is a point on the polynomial. A degree-$t$ polynomial is uniquely determined by $t+1$ points, but not by only $t$ points.

---

## 6.3 Worked setup example

Given:

$$
p = 23,\quad s = 5,\quad t = 1.
$$

Choose a degree-1 polynomial:

$$
q(x) = 5 + 3x.
$$

Compute shares:

$$
s_1 = q(1) = 5 + 3 = 8,
$$

$$
s_2 = q(2) = 5 + 6 = 11,
$$

$$
s_3 = q(3) = 5 + 9 = 14.
$$

So the shares are:

$$
(1,8),\quad (2,11),\quad (3,14).
$$

Any 2 of the 3 shares reconstruct because $t+1 = 2$. Any 1 share reveals nothing.

---

# 7. Lagrange interpolation

## 7.1 Key fact

$t+1$ distinct points uniquely determine a polynomial of degree at most $t$.

The secret is:

$$
s = q(0).
$$

For $t=1$, any 2 points determine the line, and the secret is the line’s y-intercept.

---

## 7.2 Lagrange formula

Given $t+1$ shares:

$$
(x_1, y_1), \ldots, (x_{t+1}, y_{t+1}),
$$

the polynomial is:

$$
q(x) = \sum_{i=1}^{t+1} y_i L_i(x),
$$

where:

$$
L_i(x) = \prod_{j \neq i} \frac{x - x_j}{x_i - x_j}.
$$

Each basis polynomial $L_i$ is designed so that:

$$
L_i(x_i) = 1
$$

and:

$$
L_i(x_j) = 0 \quad \text{for } j \neq i.
$$

Therefore, the sum automatically passes through all share points.

---

## 7.3 Worked reconstruction example

Reconstruct:

$$
s = q(0)
$$

from shares:

$$
s_1 = (1,8),\quad s_3 = (3,14).
$$

Compute basis terms at $x=0$:

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

Using the slide’s arithmetic:

$$
q(0) = 12 - 7 = 5 \pmod{23}.
$$

So the reconstructed secret is:

$$
s = 5.
$$

[UNCLEAR] The slide writes fractions such as $\frac{3}{2}$ and $-\frac{1}{2}$ while working modulo $23$. These should be interpreted using modular inverses in $\mathbb{Z}_{23}$, but the slide presents the calculation in ordinary fractional form.

---

# 8. Additive versus Shamir sharing

| Property | Additive sharing | Shamir $(t,n)$ sharing |
|---|---:|---:|
| Threshold | all $n$ needed | any $t+1$ of $n$ |
| Dropout tolerance | none | up to $n - t - 1$ |
| Addition | free/local | free/local |
| Multiplication | Beaver triples | degree reduction |
| Security | information-theoretic | information-theoretic |

## Why Shamir matters for federated learning

In FL, clients drop out frequently. Practical secure aggregation uses Shamir sharing to recover mask-related secrets for dropped clients, so the surviving clients’ aggregate can still be correctly unmasked.

⚑ **Exam/revision flag:** The lecture explicitly links Shamir sharing to FL dropouts. Know why additive sharing fails under dropout and how Shamir fixes that.

---

# 9. The problem with multiplication

## 9.1 Addition is easy

Each party adds its local shares:

$$
s_i + r_i.
$$

No communication is required.

## 9.2 Multiplication is hard

For two parties:

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

Expanding:

$$
s \cdot r = s_1r_1 + s_1r_2 + s_2r_1 + s_2r_2.
$$

The terms:

$$
s_1r_1,\quad s_2r_2
$$

are local to parties 1 and 2 respectively.

The cross terms:

$$
s_1r_2,\quad s_2r_1
$$

require values held by different parties. Naively sending shares would leak secrets.

The solution is to use **Beaver triples**, which provide pre-shared correlated randomness.

---

# 10. Beaver triples

## 10.1 Core idea

Offline, choose random values:

$$
a,\quad b,
$$

and set:

$$
c = a \cdot b.
$$

Then secret-share $a$, $b$, and $c$.

For two parties:

$$
a = a_1 + a_2,
$$

$$
b = b_1 + b_2,
$$

$$
c = c_1 + c_2,
$$

with the global relation:

$$
c = a \cdot b.
$$

⚑ **Exam/revision flag / warning:** The slide explicitly warns that:

$$
a_i \cdot b_i \neq c_i
$$

in general. The relation $c = ab$ holds globally across both parties, not within each party’s local shares. Nobody sees $a$, $b$, or $c$ in the clear.

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

Parties exchange:

$$
(\epsilon_i, \delta_i).
$$

Both compute:

$$
\epsilon = \epsilon_1 + \epsilon_2,
$$

$$
\delta = \delta_1 + \delta_2.
$$

These are now public.

### Step 3: Combine locally

Party 1 computes:

$$
z_1 = c_1 + \epsilon b_1 + \delta a_1 + \epsilon \delta.
$$

Party 2 computes:

$$
z_2 = c_2 + \epsilon b_2 + \delta a_2.
$$

The result is:

$$
z_1 + z_2 \equiv s \cdot r.
$$

The slide notes that only Party 1 adds $\epsilon\delta$.

---

## 10.3 Why Beaver triples are safe

Because $a$ is uniformly random:

$$
\epsilon = s - a
$$

is also uniformly random. It acts like a one-time pad and reveals nothing about $s$.

Similarly:

$$
\delta = r - b
$$

reveals nothing about $r$.

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

The parties’ shares $z_1, z_2$ add to this value.

---

## 10.5 Worked example: Beaver triple multiplication

All arithmetic is modulo $23$.

Inputs:

$$
s = 7,\quad r = 3.
$$

Shares of $s$:

$$
(s_1, s_2) = (10, 20),
$$

because:

$$
10 + 20 = 30 \equiv 7 \pmod{23}.
$$

Shares of $r$:

$$
(r_1, r_2) = (15, 11),
$$

because:

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

The slide gives:

$$
84 \equiv 15 \pmod{23}.
$$

[UNCLEAR] The arithmetic line on the slide appears to sum to $80$, not $84$, using the displayed values $8 + 2\cdot4 + 17\cdot2 + 2\cdot17$. Since $80 \equiv 11 \pmod{23}$, this would not match the slide’s $z_1 = 15$. Recheck the lecture recording or slide source.

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

The slide concludes:

$$
z_1 + z_2 = 15 + 6 = 21 \pmod{23}.
$$

Check:

$$
s \cdot r = 7 \times 3 = 21.
$$

[UNCLEAR] The final result is correct if $z_1=15$, but the displayed arithmetic for $z_1$ seems inconsistent. This is a high-priority point to verify against the recording.

---

# 11. Secure aggregation: key SMPC application in federated learning

## 11.1 FedAvg problem

In federated learning, FedAvg has the server collect client updates:

$$
\Delta_1, \ldots, \Delta_K
$$

and compute the weighted aggregate:

$$
\sum_k p_k \Delta_k.
$$

But observing individual updates $\Delta_k$ can enable gradient inversion attacks.

## 11.2 Goal

The server should learn only:

$$
\sum_k p_k \Delta_k
$$

or, with equal weights:

$$
\sum_k \Delta_k,
$$

but not any individual $\Delta_k$.

This is an SMPC problem:

- Parties: $K$ clients.
- Private input of client $k$: $\Delta_k$.
- Function:

$$
f(\Delta_1, \ldots, \Delta_K) = \sum_k p_k \Delta_k.
$$

The protocol should allow the server to learn only the aggregate.

⚑ **Exam/revision flag:** The slide calls secure aggregation “the most important SMPC application in FL.”

---

# 12. Pairwise masking protocol

## 12.1 Core idea

Each pair of clients agrees on a random mask. One client adds the mask, the other subtracts it. When the server sums all masked updates, masks cancel.

For pair $(i,j)$, the slide convention says:

- if $i < j$, client $i$ adds $r_{ij}$;
- client $j$ subtracts $r_{ij}$.

Thus, across all clients:

$$
\sum_i \widetilde{\Delta}_i
=
\sum_i \Delta_i
+
\sum_{i<j} (r_{ij} - r_{ij})
=
\sum_i \Delta_i.
$$

## 12.2 How clients agree on masks

Each pair runs a Diffie–Hellman key exchange, possibly using the server as a relay. The shared key seeds a PRG that generates:

$$
r_{ij}.
$$

Both clients derive the same mask without transmitting the mask itself. The server sees only public Diffie–Hellman messages, not $r_{ij}$.

---

## 12.3 Worked example: secure aggregation with 3 clients

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

The slide’s worked example uses:

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

The masks cancel, and the server sees only:

$$
(14,24,7),
$$

not the original:

$$
(10,20,15).
$$

[UNCLEAR] The slide’s general convention says client $i$ adds $r_{ij}$ and client $j$ subtracts it for $i<j$, which would make client 1 add $r_{13}$ and client 3 subtract $r_{13}$. The worked example reverses the signs for $r_{13}$. The protocol still works because the pairwise signs are opposite, but the sign convention is inconsistent across slides.

---

# 13. Handling dropped clients

## 13.1 Problem

If a client drops out after masking, masks involving that client no longer cancel.

Example from slides: if Client 2 drops, then summing Clients 1 and 3 gives:

$$
\widetilde{\Delta}_1 + \widetilde{\Delta}_3
=
(\Delta_1 + r_{12} - r_{13}) + (\Delta_3 + r_{13} - r_{23})
$$

$$
= \Delta_1 + \Delta_3 + r_{12} - r_{23}.
$$

This is not equal to:

$$
\Delta_1 + \Delta_3.
$$

## 13.2 Solution: Shamir secret sharing of seeds

During setup:

1. Each client secret-shares its random seeds using Shamir $(t,K)$-sharing.
2. If Client 2 drops, surviving clients reconstruct Client 2’s seeds from their shares.
3. They remove Client 2’s masks.
4. The server obtains the correct sum of surviving clients.

The threshold property means the system tolerates up to:

$$
K - t - 1
$$

dropouts.

⚑ **Exam/revision flag:** The slide explicitly says, “This is why we learned Shamir sharing.” Shamir sharing is needed because plain additive sharing would break after one dropout.

---

# 14. Secure aggregation complexity

Let:

- $K$ = clients per round;
- $d$ = model dimension.

Costs from the slides:

| Cost | Scaling |
|---|---:|
| Communication per client | $O(K+d)$, model plus keys |
| Server computation | $O(Kd)$ |
| Communication rounds | 3–4 |
| Overhead versus plain FedAvg | 1.5–7×, lower for larger models |

Per-client upload:

$$
O(d) \text{ model update} + O(K) \text{ SMPC keys}.
$$

## Model size comparison

The slide gives approximate overhead patterns:

- Small model: $d = 10^4$, $K = 10^3$, overhead around $6.6\times$.
- Medium model: $d = 10^6$, $K = 10^3$, overhead around $1.7\times$.
- Large model / Google-scale: $d = 10^8$, $K = 10^3$, overhead approximately $1\times$.

Main insight:

$$
O(K)
$$

SMPC overhead becomes negligible when the model dimension $d$ is very large.

The slides state this family of techniques has been deployed at scale in Google’s federated learning systems, including keyboard-related applications.

---

# 15. SMPC + Differential Privacy

## 15.1 Local DP versus central DP versus SMPC + DP

The lecture uses an analogy: $K$ employees anonymously reporting salary.

### Local DP

Each client adds noise before sending.

If each client adds noise with standard deviation $\sigma$, then aggregating $K$ noisy values gives combined standard deviation:

$$
\sqrt{K}\sigma.
$$

Properties:

- no server trust required;
- but large aggregate noise.

### Central DP

The server sees the true data, aggregates, then adds noise once with standard deviation:

$$
\sigma.
$$

Properties:

- better utility;
- but the server must be trusted with individual updates.

### SMPC + DP

Secure aggregation hides individual updates. The server obtains only the aggregate and then adds DP noise once:

$$
\sigma.
$$

Properties:

- small noise like central DP;
- no need to trust the server with individual updates.

## 15.2 Intuition

SMPC + DP can give central-DP-like utility while keeping a no-server-trust assumption closer to local DP.

---

# 16. Private inference: ML as a Service without data exposure

## 16.1 Setup

The server holds a model:

$$
f_\theta
$$

which may be valuable intellectual property.

The user holds private input:

$$
x.
$$

They run an SMPC protocol so that the user learns:

$$
f_\theta(x),
$$

while the server learns nothing beyond what the protocol reveals about $x$, and the user ideally learns little about $\theta$ beyond the output.

Examples:

- medical diagnosis on private images;
- credit scoring on private financials;
- drug interaction checks on private genomes.

---

# 17. Neural network evaluation in SMPC

## 17.1 Neural network structure

A neural network alternates between linear and non-linear operations:

$$
Wx + b
$$

then:

$$
\operatorname{ReLU}(z) = \max(0,z),
$$

then another linear layer, and so on.

## 17.2 Linear layers are relatively cheap

Matrix multiply:

$$
Wx + b
$$

can be handled using arithmetic sharing:

- Beaver triples for each multiplication;
- free addition for the bias.

Cost is proportional to layer size.

## 17.3 Non-linear layers are expensive

ReLU requires a comparison:

$$
z > 0?
$$

Secret sharing naturally handles addition and multiplication, but branching on the sign of a shared value requires heavier cryptographic machinery.

The slides state that non-linear layers are orders of magnitude slower and often dominate total cost.

⚑ **Exam/revision flag:** Linear layers are cheap in SMPC; comparisons/non-linear activations dominate. This is a recurring theme and appears again in zkML.

---

# 18. Private inference in practice

## 18.1 Bottleneck: non-linear activations

The slide states:

- a single ReLU is typically orders of magnitude more expensive than a linear operation in SMPC;
- ResNet-32 has around $300K$ ReLUs;
- therefore most computation time is spent on activations, not matrix multiplications.

## 18.2 SMPC-friendly architectures

The lecture gives three approaches.

### Polynomial activations

Use, for example:

$$
x^2
$$

instead of ReLU.

This is purely arithmetic and can be handled by Beaver triples, without comparison.

### Fewer non-linear layers

Make the network wider rather than deeper. Every removed ReLU layer saves significant cost.

### Knowledge distillation

Train a normal ReLU network, then distil it into a smaller student model with polynomial activations.

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

They want to learn:

$$
A \cap B
$$

without revealing elements not in the intersection.

Example:

- Bank A customers: Alice, Bob, Eve, Mallory.
- Bank B customers: Carol, Dave, Eve, Mallory.
- Intersection:

$$
A \cap B = \{\text{Eve}, \text{Mallory}\}.
$$

Alice, Bob, Carol, and Dave are not revealed.

## 19.2 PSI as SMPC

PSI is a special case of SMPC for the function:

$$
f(A,B) = A \cap B.
$$

Specialized PSI protocols are much faster than generic SMPC for this task.

---

## 19.3 PSI applications in ML

Applications listed:

- **Entity resolution:** find common customers for joint fraud detection.
- **Vertical FL:** identify shared entities before training.
- **Feature enrichment:** build joint datasets from overlapping feature-disjoint sources.

## 19.4 PSI protocol flavours

### OT/OPRF-based PSI

Built on Oblivious Transfer extension. Parties obtain cryptographic tokens for their elements, allowing equality testing without revealing non-matching elements.

The slide says this is fastest for balanced sets.

### DH/ECC-based PSI

Elements are mapped into a group and re-randomised with secret exponents. Encoded sets can then be compared.

The slide says this has lowest communication and works well for unbalanced sets:

$$
|A| \gg |B|.
$$

### Circuit/HE-based PSI

Runs PSI as generic secure computation.

This is slowest, but can compute functions on the intersection, for example:

- mean age of common customers.

## 19.5 Performance examples

Slide benchmark examples from KKRT16-era:

| Set sizes | Communication | Time |
|---|---:|---:|
| $|A| = |B| = 2^{20}$, about 1M | about 100 MB | about 3 seconds |
| $|A| = |B| = 2^{24}$, about 16M | about 1.5 GB | about 50 seconds |

---

# 20. SMPC training

## 20.1 Idea

Instead of federated learning, which may leak model updates, perform the entire training computation inside SMPC.

## 20.2 Protocol sketch

1. Each party secret-shares its data.
2. Forward pass on shared data.
3. Loss computation on shares.
4. Backpropagation on shares.
5. Reconstruct final model only.

## 20.3 Privacy

No party learns anything about other parties’ data beyond what the final model reveals.

The slide describes this as the strongest possible guarantee.

## 20.4 Cost

Multiplications consume Beaver triples. Multiplication layers and batches incur communication.

For deep networks, this is currently impractical.

## 20.5 Rule of thumb

Practical today:

- logistic regression;
- small trees;
- simple neural networks with 2–3 parties.

Hybrid approach:

- FL for bulk training;
- SMPC for sensitive steps.

Not yet practical:

- full end-to-end SMPC training of large CNNs or transformers.

---

# 21. SMPC performance overview

| Task | Plaintext | SMPC | Overhead/example |
|---|---:|---:|---:|
| Secure aggregation in FL | negligible | plus setup | 1.5–3× |
| PSI, about 1M elements | ms | about 3s | practical |
| Private inference, small CNN | ms | seconds | 100–1000× |
| Training, logistic regression | seconds | minutes–hours | about 100× |
| Training, deep network | hours | — | impractical |

The slide’s practical/research spectrum:

- Secure aggregation: practical.
- PSI: practical.
- Inference: becoming practical.
- Small training: becoming practical.
- Deep training: research.

## Key insight

Network latency often dominates. Reducing communication rounds through batching and constant-round protocols often matters more than total bytes.

---

# 22. Lecture 9.1 key takeaways

1. SMPC lets parties compute on private inputs without a trusted third party.
2. Additive secret sharing splits values into random shares; addition is free; all parties are needed.
3. Shamir sharing gives threshold reconstruction: any $t+1$ of $n$ shares suffice.
4. Lagrange interpolation recovers the secret as the y-intercept of the polynomial.
5. Beaver triples make multiplication efficient using pre-generated correlated randomness.
6. Secure aggregation uses pairwise masking plus Shamir sharing for practical FL privacy.
7. Beyond FL, SMPC is used for private inference, PSI, and collaborative training.
8. Performance rule: secure aggregation and PSI are deployment-ready; deep-model training remains a research challenge.

---

# Lecture 9.2 — Introduction to Zero-Knowledge Proofs: Foundations, Protocols & Modern Proof Systems

## 1. Learning objectives and roadmap

By the end of this lecture, you should be able to:

- Define a **zero-knowledge proof** and state its three properties:
  - completeness;
  - soundness;
  - zero-knowledge.
- Design a ZKP from first principles using the colour-blind ball puzzle.
- Walk through **Schnorr’s protocol** step by step and verify a transcript by hand.
- Distinguish interactive and non-interactive proofs using **Fiat–Shamir**.
- Compare modern proof systems:
  - Groth16;
  - PLONK;
  - STARKs;
  - Bulletproofs.

Lecture roadmap:

1. Foundations: problem statement, three properties, puzzle design.
2. A real protocol: Schnorr’s identification scheme.
3. From protocols to circuits: R1CS, SNARKs.
4. Applications and performance: zkML.

⚑ **Exam/revision flag:** The learning objectives directly specify what you should be able to define, derive, and compare.

---

# 2. ZKP use case: verifiable inference / zkML

## 2.1 Attack: model substitution

The slides describe a cloud model-serving scenario:

- Client pays for a large model, e.g. LLaMA-70B.
- Provider secretly runs a smaller distilled model, e.g. 7B.
- Output looks plausible.
- Client cannot tell whether the claimed model actually ran.

The slide says model substitution $70B \rightarrow 7B$ saves roughly $10\times$ cost but is undetectable without a cryptographic proof.

The numbers are marked as illustrative.

## 2.2 With ZKP

The client demands a zero-knowledge proof of execution.

Provider:

- runs the claimed model;
- generates proof $\pi$ for the full computation.

Client receives:

- response;
- proof $\pi$.

The client verifies:

$$
\operatorname{Verify}(\pi, \operatorname{commitment}(W_{70B}), x, y) = 1
$$

only if the inference was faithfully executed with the correct model and weights.

---

# 3. General ZKP problem

## 3.1 Intuition

A prover wants to convince a verifier that some statement is true, without revealing the secret evidence that makes it true.

## 3.2 Formal setting

The prover $P$ wants to convince verifier $V$ that:

$$
\exists w : R(x,w) = 1.
$$

Where:

- $x$ is the public statement;
- $w$ is the private witness;
- $R$ is the relation checking whether $w$ proves $x$.

The prover knows $w$. The verifier knows only $x$.

The goal is to convince $V$ without revealing anything about $w$.

---

# 4. Three properties of zero-knowledge proofs

## 4.1 Completeness

### Intuition

If the statement is true and everyone follows the protocol, the verifier accepts.

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

If the statement is false, no cheating prover should be able to convince the verifier, except with small probability.

### Formal definition from slides

If $x$ is false, then for every possibly cheating prover $P^*$:

$$
\Pr[V \text{ accepts}] \leq \epsilon.
$$

Here $\epsilon$ is the soundness error, typically:

$$
\epsilon = 2^{-\lambda}
$$

for security parameter $\lambda$.

[UNCLEAR] Slide 4 uses “rejects except w.n.p.” This abbreviation is likely “with negligible probability,” but verify the lecture recording.

---

## 4.3 Zero-knowledge

### Intuition

The verifier learns nothing beyond the truth of the statement.

### Formal simulation-based definition

There exists an efficient simulator $S$ that, given only $x$, and not the witness $w$, produces a transcript indistinguishable from a real prover-verifier interaction:

$$
\{ \operatorname{View}_V(P(w), x) \} \approx_c \{ S(x) \}.
$$

Intuition from slides:

> Anything $V$ sees, $V$ could have produced alone, so $V$ learned nothing.

⚑ **Exam/revision flag:** Be able to state all three properties both intuitively and formally.

---

# 5. Examples of ZKP statements

| Statement $x$ | Witness $w$ | Real-world use |
|---|---|---|
| “I know $w$ such that $H(w)=h$” | preimage $w$ | password login without sending password |
| “I know $w$ such that $g^w = y \pmod p$” | discrete log $w$ | identification, Schnorr |
| “I know weights $W$ with hash $H(W)=h$” | weights $W$ | model ownership / watermarking |
| “Model $M$ classified my image as cat” | image + weights | verifiable ML inference |
| “My training set satisfies licence $L$” | dataset + receipts | training-data provenance |
| “I am a UK citizen over 18” | passport data | privacy-preserving KYC |

## What makes ZKPs powerful

The verifier is convinced the statement is true without seeing the data that makes it true.

This enables trust without disclosure.

---

# 6. Colour-blind ball puzzle

## 6.1 Scenario

Bob is red-green colour-blind. You give him two billiard balls:

- one red;
- one green.

To you, they are visibly different. To Bob, they look identical.

You want to convince Bob that the balls are different colours without revealing which one is red and which one is green.

---

## 6.2 Protocol: one round

1. Bob shows you both balls, one in each hand. You remember which is red.
2. Bob hides the balls behind his back and secretly either swaps them or keeps them in place, using a fair coin flip.
3. Bob shows the balls again.
4. You declare either:
   - “swapped”; or
   - “not swapped.”

This is repeated.

---

## 6.3 Analysis

### Completeness

If the balls really have different colours, you can always answer correctly.

### Soundness

If the balls are actually the same colour, you can only guess whether Bob swapped them.

Probability of guessing correctly in one round:

$$
\frac{1}{2}.
$$

After $k$ repeated rounds, cheating probability:

$$
\leq 2^{-k}.
$$

### Zero-knowledge

Bob learns only that the balls differ.

The transcript consists of a sequence of “swapped” and “not swapped” answers, which Bob could have produced himself by flipping coins.

⚑ **Exam/revision flag:** This puzzle illustrates the commit–challenge–respond structure underlying many interactive ZKPs.

---

# 7. Schnorr’s identification scheme

## 7.1 Setup

### Public parameters

Everyone knows:

- large prime $p$;
- prime $q$ dividing $p-1$;
- generator $g$ of the unique order-$q$ subgroup of:

$$
\mathbb{Z}_p^*.
$$

The reason for this structure:

- arithmetic stays inside a known prime-order group;
- exponents live in $\mathbb{Z}_q$;
- every nonzero element in $\mathbb{Z}_q$ is invertible.

### Prover’s keys

Secret key:

$$
w \in \mathbb{Z}_q
$$

chosen uniformly at random.

Public key:

$$
y = g^w \pmod p.
$$

### Statement being proved

The prover wants to prove:

$$
\text{“I know } w \text{ such that } g^w \equiv y \pmod p.”
$$

This is knowledge of the discrete logarithm of $y$.

### Why attackers cannot cheat trivially

Computing $w$ from:

$$
(g,y,p)
$$

is the discrete logarithm problem, believed hard for appropriately sized $p$.

---

# 8. Schnorr protocol step by step

This is a 3-move Sigma protocol.

## Move 1: Commit

Prover picks random:

$$
r \in \mathbb{Z}_q.
$$

Computes:

$$
t = g^r \pmod p.
$$

Sends $t$ to verifier.

## Move 2: Challenge

Verifier picks random:

$$
c \in \mathbb{Z}_q.
$$

Sends $c$ to prover.

## Move 3: Respond

Prover computes:

$$
s = r + c \cdot w \pmod q.
$$

Sends $s$ to verifier.

Verifier checks:

$$
g^s \stackrel{?}{=} t \cdot y^c \pmod p.
$$

---

## 8.1 Critical subtlety: mod $p$ versus mod $q$

The slide explicitly warns:

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

⚑ **Exam/revision flag:** The slide says “Never swap.” This is a common-mistake-style warning.

---

# 9. Schnorr completeness derivation

Claim:

If the prover follows the protocol honestly, the verifier’s check:

$$
g^s \stackrel{?}{=} t \cdot y^c
$$

always passes.

Start from left-hand side, working modulo $p$:

$$
g^s \equiv g^{r+c\cdot w}
$$

by definition of:

$$
s = r + cw \pmod q.
$$

Then:

$$
g^{r+c\cdot w} \equiv g^r \cdot g^{c\cdot w}
$$

by exponent laws.

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

This is exactly the verifier’s check.

## Why reducing $s$ mod $q$ is okay

Because $g$ has order $q$ in $\mathbb{Z}_p^*$:

$$
g^{kq} \equiv 1 \pmod p
$$

for any integer $k$.

Therefore reducing an exponent modulo $q$ does not change the group element:

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

so $g=2$ has order $11=q$.

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

The slide computes:

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

Verifier accepts.

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

The slide says you should get:

$$
y = 16,\quad t = 8,\quad s = 5,
$$

and both verification sides equal:

$$
9.
$$

⚑ **Exam/revision flag:** The learning objectives explicitly say you should verify a Schnorr transcript by hand. Be comfortable doing the arithmetic above.

---

# 11. Why Schnorr is zero-knowledge: simulator

## 11.1 Claim

Schnorr is honest-verifier zero-knowledge: the verifier learns nothing about $w$ from the transcript:

$$
(t,c,s),
$$

provided the verifier’s challenge $c$ is truly random.

## 11.2 Simulator

The simulator $S$ runs without knowing $w$.

Given only public:

$$
(g,y,p,q),
$$

it:

1. Picks random:

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

This is “verification run backwards.”

3. Outputs:

$$
(t^*, c^*, s^*).
$$

## 11.3 Why simulated and real transcripts match

By construction:

$$
g^{s^*} \equiv t^* \cdot y^{c^*} \pmod p.
$$

In a real transcript:

- $r$ and $c$ are uniform in $\mathbb{Z}_q$;
- $s = r + cw$ is uniform in $\mathbb{Z}_q$, since $r$ is uniform.

In a simulated transcript:

- $s^*$ and $c^*$ are uniform;
- $t^*$ is determined from the verification equation.

Both distributions are uniform over valid transcripts:

$$
\{(t,c,s): g^s \equiv t \cdot y^c\}.
$$

So the verifier cannot distinguish real from simulated transcripts.

## 11.4 Simulation paradigm

Whatever the verifier could learn from a real transcript, it could have produced alone. Therefore it learns nothing new.

⚑ **Exam/revision flag:** The slide calls the simulation paradigm “the take-home” and “the defining technique for proving zero-knowledge.”

[UNCLEAR] The lecture’s key takeaways mention Schnorr as a proof of knowledge “via the rewinding extractor,” but the provided slides do not explain the extractor. Check transcript/recording for this if it was discussed verbally.

---

# 12. Fiat–Shamir transform

## 12.1 Problem with interactive proofs

Interactive proofs require live back-and-forth between prover and verifier.

This is unsuitable for:

- signatures;
- offline model audits;
- one-shot inference proofs;
- cases where prover and verifier are not online at the same time.

## 12.2 Fiat–Shamir idea

Replace the verifier’s random challenge with a hash of the conversation so far:

$$
c = H(x,t).
$$

Here:

- $x$ is the public statement/input;
- $t$ is the commitment;
- $H$ is modelled as a random oracle.

### Interactive version

1. Prover sends $t$.
2. Verifier sends random $c$.
3. Prover sends $s$.

### Non-interactive version

Prover sends:

$$
(t,s).
$$

Both prover and verifier compute:

$$
c := H(x,t)
$$

locally.

This turns a 3-message protocol into a 1-message proof.

## 12.3 Consequence

Schnorr plus Fiat–Shamir gives a digital signature.

The slides mention that this underlies:

- Ed25519-style signatures, RFC 8032;
- Bitcoin BIP340/Taproot Schnorr signatures.

---

## 12.4 Fiat–Shamir heuristic details

Any 3-move public-coin protocol:

$$
\text{commit} \rightarrow \text{challenge} \rightarrow \text{respond}
$$

can be made non-interactive by replacing the challenge with:

$$
c := H(\text{public inputs} \parallel \text{commitment}).
$$

## 12.5 Security

The slide states this is provably secure in the random oracle model, where $H$ is treated as a truly random function.

Implemented with:

- SHA-256;
- BLAKE3;
- algebraic hashes tailored to ZK arithmetic, such as Poseidon and Rescue.

## 12.6 Pitfall: weak Fiat–Shamir

If public inputs are omitted from the hash, an attacker can find colliding challenges.

The slide mentions real-world bugs called “Frozen Heart” affecting production systems.

⚑ **Exam/revision flag:** “Always hash everything that the verifier sees.” This is marked as a pitfall on the slide.

---

# 13. From statements to arithmetic circuits

## 13.1 Motivation

Schnorr proves one algebraic fact:

$$
g^w = y.
$$

But real applications need richer statements, such as:

- “this neural network classified my image as cat”;
- “my training set satisfies licence $L$.”

We need a general language for encoding computations that a verifier can check.

## 13.2 General recipe

Any computation can be expressed as an arithmetic circuit:

- directed acyclic graph;
- gates are $+$ and $\times$;
- arithmetic over a field $\mathbb{F}_p$.

Example circuit from slides:

$$
y = (x_1 \cdot x_2)(x_2 + x_3).
$$

The idea is to break a program into simple algebraic operations.

---

# 14. R1CS: Rank-1 Constraint System

## 14.1 Definition

Each multiplication gate becomes a constraint:

$$
\langle a,z\rangle \cdot \langle b,z\rangle = \langle c,z\rangle.
$$

Where:

- $z$ is the vector of all wire values;
- $z$ includes inputs, intermediate values, and outputs;
- additions are represented inside linear combinations;
- correct execution is equivalent to all constraints being satisfied.

### Intuition

R1CS turns circuit execution into a set of algebraic equations. A proof system can then prove that there exists a witness satisfying those equations.

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

Both constraints are satisfied.

## 14.3 Witness versus statement

Public statement:

$$
x_1,x_2,x_3,y.
$$

Witness:

$$
w_1.
$$

The slide notes this toy example has no real secret because $w_1$ is derivable from public inputs. In real applications, some inputs, such as ML weights or private input $x_i$, are part of the witness.

The mechanism is identical: the prover shows that a witness exists satisfying all constraints without revealing it.

---

# 15. Unifying view of ZKPs

All examples follow the pattern:

$$
\text{Prove that } \exists w \text{ such that } R(x,w)=1.
$$

| Example | Statement $x$ | Witness $w$ | Relation $R(x,w)$ |
|---|---|---|---|
| Colour balls | two balls $(B_1,B_2)$ | true colours $(c_1,c_2)$ | $c_1 \neq c_2$ |
| Schnorr | public value $y$ | secret key $w$ | $g^w = y$ |
| Arithmetic circuit | public $x_1,x_2,x_3,y$ | intermediate wires + private inputs | all constraints satisfied |

Key insight:

- Schnorr proves a single equation.
- Circuits/R1CS encode many equations.
- ZKP proves existence of a solution without revealing it.

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
| Zero-knowledge | proof reveals nothing about the witness |
| Succinct | proof size much smaller than statement size, often hundreds of bytes |
| Non-interactive | one message: prover sends proof $\pi$ to verifier |
| Argument | soundness against computationally bounded provers |
| of Knowledge | prover must “know” a witness, extractability |

## 16.2 Orders of magnitude

For a circuit with:

$$
10^6
$$

gates:

- prover time: seconds to minutes;
- proof size: about 200 bytes for Groth16, independent of circuit size;
- verifier time: milliseconds.

The verifier is much faster than rerunning the computation.

The slide says: “This is magical.”

⚑ **Exam/revision flag:** Know why succinct verification matters: the verifier is much faster than recomputing.

---

# 17. Modern proof systems

## 17.1 Groth16

Groth16 proof consists of three group elements:

$$
\pi = (A,B,C) \in G_1 \times G_2 \times G_1.
$$

Verification is a single pairing equation involving:

- proof $\pi$;
- public inputs;
- verifying key.

Proof size is constant regardless of circuit size.

### Pros

- smallest proofs in practice;
- fastest verification;
- used in EZKL and zkML demos for small neural networks;
- used in anonymous credentials and shielded-payment protocols.

### Cons

- requires per-circuit trusted setup;
- trusted setup produces “toxic waste”;
- every model architecture change requires a new ceremony.

---

## 17.2 PLONK

### Motivation

Groth16 setup is circuit-specific, which is inconvenient for general-purpose systems.

### PLONK idea

PLONK uses a universal trusted setup: one ceremony supports any circuit up to a size bound.

It is built on:

- polynomial commitments, specifically KZG;
- permutation arguments.

### Impact for ML

Universal setup matters for ML because retraining or changing model architecture no longer requires a new ceremony.

The slides say PLONK and variants, including Halo2 and Plonky2, power:

- zkEVMs;
- most general-purpose zkML frameworks today.

Proof size is slightly larger than Groth16, around:

$$
500 \text{ bytes}
$$

but the system is much more flexible.

---

## 17.3 STARKs

STARK = **Scalable Transparent ARguments of Knowledge.**

### Motivation

Pairing-based SNARKs such as Groth16 and PLONK need trusted setup. STARKs aim for:

- no trusted setup;
- post-quantum security;
- assumptions based on hash functions.

### Construction ingredients

Built on:

- hash-based commitments, such as Merkle trees;
- polynomial IOPs;
- FRI protocol.

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
- large-circuit zkML research.

The slide says STARKs’ fast prover scales best to millions-to-billions of gates needed for neural-network inference, and post-quantum security is attractive for long-lived ML deployments.

---

## 17.4 Bulletproofs

Bulletproofs are:

- no trusted setup;
- discrete-log-based;
- good for range proofs.

Example range proof statement:

$$
\text{this value is in } [0,2^{64}).
$$

### Key property

Proof size:

$$
O(\log n)
$$

for a circuit of size $n$.

Verifier time:

$$
O(n).
$$

The $O(n)$ verification is the key limitation for large circuits.

### Uses

Classic use:

- confidential transactions, such as Monero.

Increasingly relevant for quantised neural networks:

- range proofs certify int8 activations stay in:

$$
[-128,127].
$$

This helps prevent field-overflow attacks in zkML circuits.

### Trade-off

Bulletproofs are not succinct in verification, so they are not suitable for proving million-gate ML circuits. But for 64-bit range proofs, the slide says they are “unbeatable,” about 700 bytes with no setup.

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

The slide emphasizes that these are indicative orders of magnitude and are highly implementation- and circuit-dependent.

## No universally best proof system

Choose based on:

- whether setup is acceptable;
- proof size budget;
- verifier hardware;
- post-quantum requirements;
- whether the circuit is static or changing.

⚑ **Exam/revision flag:** “No universally best proof system” is explicitly stated. Be able to choose a proof system based on constraints.

---

# 19. AI security and privacy applications

## 19.1 Verifiable inference / zkML

Prove:

$$
\text{output } y \text{ was produced by committed model } M \text{ on input } x.
$$

This detects model substitution, such as a provider swapping a 70B LLM for a 7B distillate.

## 19.2 Training-data auditing

Prove that training used only data with:

- valid licence;
- consent;
- anti-CSAM filters;

without revealing the dataset.

Applications:

- copyright claims;
- GDPR;
- EU AI Act.

## 19.3 Model IP and watermark proofs

Prove ownership of weights $W$ via commitment:

$$
h = H(W)
$$

without revealing the weights.

Or prove that a watermark is embedded.

Uses:

- model theft protection;
- unauthorized distillation protection.

## 19.4 Federated-learning integrity

Each client proves its local gradient update was computed honestly on claimed data.

Purpose:

- block poisoning;
- block free-riding;
- keep local data private.

## Why AI systems need ZKPs

Models are increasingly black-box services. Users cannot inspect:

- weights;
- data;
- execution.

ZKPs allow providers to make verifiable claims such as:

- “I ran this model”;
- “I trained on licensed data”;
- “I added DP noise”;

without giving up privacy or IP.

---

# 20. Identity, compliance, and AI-era access control

## 20.1 Anonymous credentials for AI access

A user can prove:

- “I am a licensed professional”;
- “I am an adult”;
- “I am an employee of company X”;

when querying a model, without linking every query to a stable identity.

## 20.2 Proof-of-personhood against AI-generated content

With generative models, proving that a human was behind an action is increasingly important.

ZKP-based credentials can authenticate humans without revealing identity.

Use case:

- defence against bot-generated influence;
- defence against Sybil attacks on ML-driven platforms.

## 20.3 Verifiable ML services

Examples:

- “Your loan was denied because feature $x_i$ exceeded threshold $\tau$” — explainability without leaking model.
- “This content-moderation decision ran the certified classifier” — audit without IP loss.
- “My model $M$ correctly classified your image as cat” — next lecture’s zkML topic.

---

# 21. Performance reality check

The slide places applications on a maturity spectrum:

- signatures: mature;
- credentials: mature;
- small CNNs: maturing;
- FL integrity: maturing;
- zkLLM: research.

## Prover/verifier asymmetry

The prover is slow. The verifier is fast.

This is good for one-shot verification:

- audit a training run once;
- verify forever.

But it is difficult for real-time applications because a model provider must spend substantial compute to produce a proof for each inference.

---

# 22. Lecture 9.2 key takeaways

1. A ZKP lets prover $P$ convince verifier $V$ of a statement without revealing anything else.
2. ZKPs are defined by completeness, soundness, and zero-knowledge.
3. The colour-blind ball puzzle shows the three-move commit–challenge–respond pattern.
4. Schnorr proves knowledge of a discrete logarithm in three moves.
5. Schnorr is zero-knowledge via a simulator.
6. The mod $p$ versus mod $q$ distinction in Schnorr is crucial.
7. Fiat–Shamir converts public-coin interactive proofs to non-interactive proofs by hashing.
8. Any NP statement can be compiled into an arithmetic circuit or R1CS.
9. Modern SNARKs prove satisfying assignments to these constraints.
10. Proof system zoo:
    - Groth16: tiny proofs, per-circuit setup.
    - PLONK: universal setup, zkML workhorse.
    - STARKs: transparent, post-quantum, large circuits.
    - Bulletproofs: range proofs, no setup.
11. Rule of thumb:
    - production-ready for signatures, identity, small-scale verifiable inference;
    - large ML circuits from CNNs to LLMs are research frontier.

---

# Lecture 9.3 — zkML: Zero-Knowledge Proofs for Machine Learning, From Federated Learning to LLMs

## 1. Learning objectives and roadmap

By the end of this lecture, you should be able to:

- Explain why ML pipelines benefit from ZKPs, distinguishing integrity and privacy.
- Sketch ZK-FL:
  - client-side update proofs;
  - verifiable aggregation.
- Describe how a neural network becomes an arithmetic circuit.
- Identify bottlenecks:
  - non-linearities;
  - fixed-point arithmetic.
- Discuss the feasibility frontier for zkLLM:
  - attention;
  - lookups.

Roadmap:

1. Recap and motivation: ZKP × ML.
2. ZKP for FL: verifiable updates and aggregation.
3. zkML for inference: circuits, bottlenecks, systems.
4. ZKP for LLMs: scale, attention, lookup arguments.

⚑ **Exam/revision flag:** These objectives are likely the main examinable concepts for zkML.

---

# 2. ZKP recap

Given public statement $x$ and witness $w$, with:

$$
R(x,w) = 1,
$$

the prover convinces the verifier that such $w$ exists without revealing $w$.

A ZK proof $\pi$ may be only hundreds of bytes.

## Three properties

- **Completeness:** honest prover always convinces verifier.
- **Soundness:** cheating prover fails except with negligible probability.
- **Zero-knowledge:** verifier learns nothing beyond the truth of $x$.

## Modern SNARKs and ML

Modern SNARKs are ML-ready in principle:

- prover runs in near-linear time in circuit size;
- proofs are a few hundred bytes to a few KB regardless of circuit size;
- verification takes milliseconds.

Core question:

$$
\text{How large is } n \text{, the circuit size, for neural networks?}
$$

---

# 3. Why ML needs ZKPs

The lecture lists several use cases.

## 3.1 Trustless inference

Question:

> Did the cloud really run $M$ on my input?

This is about verifying the provider’s computation.

## 3.2 Model IP protection

Question:

> Can I prove accuracy without releasing $\theta$?

The model owner may want to prove claims while hiding weights.

## 3.3 Honest federated learning

Question:

> Did the client submit a valid update?

This targets poisoning and free-riding.

## 3.4 Regulated AI compliance

Question:

> Was my credit score from an approved model?

This targets auditability.

## 3.5 Content authenticity

Question:

> Is this image GenAI-produced or not?

This targets provenance and attribution.

## 3.6 Private evaluation

Question:

> Can I evaluate $M$ on test data I keep hidden?

---

## 3.7 Two orthogonal goals

### Integrity

Compute correctness without re-executing.

This is verifiable ML.

### Privacy

Inputs, weights, and/or outputs remain confidential.

This is private ML.

The slide states:

> ZKPs give both at once — subject to cost.

⚑ **Exam/revision flag:** Integrity and privacy are orthogonal. ZKPs can provide both, but cost is the limiting factor.

---

# 4. Three pillars of the lecture

## Pillar 1: ZKP for FL

Includes:

- verifiable updates;
- verifiable aggregation;
- defence against poisoning.

## Pillar 2: ZKP for ML inference

Includes:

- neural networks as circuits;
- ReLU;
- softmax;
- zkCNN;
- EZKL;
- Mystique.

## Pillar 3: ZKP for LLMs

Includes:

- transformers;
- attention;
- layernorm;
- zkLLM;
- lookup arguments.

---

# 5. Recap: where FL leaks and what SMPC did not fix

## 5.1 Two distinct risks in FL

### Privacy risk

The server or an eavesdropper reconstructs client data from updates:

$$
\Delta_k.
$$

This is gradient inversion.

Tool from previous lecture:

- SMPC / secure aggregation.

### Integrity risk

A client submits a malicious update.

Tool:

- ZKP.

## 5.2 Why SMPC and ZKPs are complementary

Secure aggregation hides individual $\Delta_k$, but gives the server no way to check whether each $\Delta_k$ was honestly computed.

ZKPs fix this gap by proving properties of updates.

⚑ **Exam/revision flag:** SMPC solves FL privacy, not FL integrity. ZKP complements secure aggregation.

---

# 6. ZK-FL: what do we prove?

## 6.1 Client-side proof: “my update is well-formed”

A client publishes a masked update:

$$
\widetilde{\Delta}_k
$$

from secure aggregation, plus a proof:

$$
\pi_k.
$$

The proof asserts that:

1. The update came from one step of SGD on the previous global model:

$$
\theta^{(t-1)}.
$$

2. The local dataset matches a committed Merkle root:

$$
root_k.
$$

3. The update has bounded $L_2$ norm:

$$
\|\Delta_k\|_2 \leq B.
$$

The norm bound defends against large poisoning attacks.

## 6.2 Server-side proof: “aggregation was done correctly”

The server publishes:

$$
\theta^{(t)}
$$

and proves:

$$
\theta^{(t)} = \theta^{(t-1)} + \sum_{k \in S} p_k \Delta_k
$$

for exactly the clients whose proofs passed.

This prevents:

- silent dropping;
- reweighting.

## 6.3 One-sentence statement

The slide summarizes the statement as:

> Every client’s contribution passed a norm bound and was aggregated correctly.

This gives an auditable FL round, end to end.

---

# 7. Concrete example: proving a bounded norm

## 7.1 Public inputs versus witness

Public statement $x$:

- commitment:

$$
Com(\Delta_k),
$$

- bound $B$;
- round ID.

Witness $w$:

- update:

$$
\Delta_k \in \mathbb{R}^d,
$$

- commitment randomness $r$.

## 7.2 Client-side pseudocode

The client computes:

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

The client produces:

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

[UNCLEAR] The pseudocode says “include com in secure aggregation.” In context, secure aggregation should aggregate updates or masked updates, not the commitment itself. This likely means “include the client/update if the proof verifies,” but check transcript.

## 7.4 Circuit checks

The circuit checks:

1. Norm bound:

$$
\sum_i \Delta_{k,i}^2 \leq B^2.
$$

This uses:

- $d$ multiplications;
- one range check.

2. Commitment consistency:

$$
Com(\Delta_k,r) = com.
$$

Cost depends on model size.

---

# 8. Proving correct SGD

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

the client’s update should be:

$$
\Delta_k = -\eta \cdot \nabla_\theta L(\theta^{(t-1)};D_k).
$$

The server aggregation is:

$$
\theta^{(t)} = \theta^{(t-1)} + \sum_k p_k \Delta_k.
$$

## 8.2 Two nested challenges

### Forward pass

The forward pass must be encoded as a circuit, like inference.

### Backward pass

Backpropagation increases circuit size:

- each linear layer needs two extra matrix multiplications:
  - $\partial L / \partial x$;
  - $\partial L / \partial W$;
- non-linearity derivatives must also be encoded.

## 8.3 Practical compromise

Rather than proving full training, prove cheap invariants:

- norm bounds;
- structural properties;
- input domain constraints.

⚑ **Exam/revision flag:** Full SGD proofs are harder than norm-bound proofs. The practical compromise is to prove cheaper invariants.

---

# 9. Putting it together: a ZK-FL round

## 9.1 Client side

1. Download previous global model:

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

as written on the slide.

4. Generate proof:

$$
\pi_k
$$

over the masked/committed update.

5. Upload:

$$
(\widetilde{\Delta}_k, \pi_k).
$$

## 9.2 Server side

6. Server verifies each:

$$
\pi_k.
$$

7. Aggregates surviving clients.

8. Publishes:

$$
\theta^{(t)}
$$

plus aggregation proof.

## 9.3 Security properties achieved

- **Privacy:** masking hides individual $\Delta_k$.
- **Integrity:** each $\Delta_k$ satisfies agreed invariants via $\pi_k$.
- **Accountability:** the full round is reproducibly auditable.

The slide says overhead in practice is something you may test in coursework.

---

# 10. Scenarios for verifiable inference

## 10.1 Setup

Prover/server has:

- model $M$;
- input $x$.

Verifier wants assurance that:

$$
y = M(x).
$$

The prover sends:

$$
(y,\pi)
$$

to the verifier.

## 10.2 What can be hidden

### Hide $x$

The verifier outsources inference and the server learns no data.

### Hide $M$

The server protects model IP while the client receives a verifiable answer.

### Hide both

Strongest guarantee, but hardest to achieve.

## 10.3 Difference from SMPC private inference

SMPC requires the model owner to remain online throughout inference.

ZKPs are non-interactive:

- server commits to $M$ once;
- anyone offline can verify future claims:

$$
y = M(x).
$$

⚑ **Exam/revision flag:** Know this distinction: SMPC is interactive/online; ZKP supports offline verification.

---

# 11. Example system: ezkl

The slide visually shows content from the EZKL project.

## 11.1 What ezkl is

`ezkl` is described as a library and command-line tool for doing inference for deep learning models and computational graphs in a zk-SNARK / zkML setting.

## 11.2 Workflow shown on the slide

1. Define a computational graph, such as a neural network, in PyTorch or TensorFlow.
2. Export the final graph as an `.onnx` file and sample inputs as a `.json` file.
3. Point `ezkl` to the `.onnx` and `.json` files to generate a ZK-SNARK circuit.

## 11.3 Example statements ezkl can prove

The slide gives example statements:

- “I ran this publicly available neural network on some private data and it produced this output.”
- “I ran my private neural network on some public data and it produced this output.”
- “I correctly ran this publicly available neural network on some public data and it produced this output.”

[UNCLEAR] The slide only shows the EZKL workflow visually; no detailed command sequence or cost model is provided in the slides.

---

# 12. Neural network as arithmetic circuit

## 12.1 Structure

The slide shows:

$$
x
\rightarrow W_1x + b_1
\rightarrow z = \operatorname{ReLU}(\cdot)
\rightarrow W_2z + b_2
\rightarrow \operatorname{softmax}
\rightarrow y.
$$

## 12.2 Main tension

Linear layers are native to arithmetic circuits.

Non-linear operations are awkward to encode and almost always dominate total cost.

This mirrors the SMPC lecture: linear algebra is relatively easy; non-linearities are the bottleneck.

---

# 13. ReLU problem and lookup arguments

## 13.1 ReLU is a comparison

$$
\operatorname{ReLU}(x) = \max(0,x).
$$

Arithmetic circuits can only add and multiply. They cannot branch on the sign of $x$.

## 13.2 Method 1: bit decomposition

Decompose:

$$
x \rightarrow b_0,b_1,b_2,\ldots,b_k.
$$

Then:

- add one constraint per bit;
- check the sign;
- reconstruct $x$.

Cost scales with bit width.

## 13.3 Method 2: lookup argument

Represent ReLU using a table of pairs:

$$
(x,y) \in \{(-3,0),(-2,0),\ldots,(n,n)\}.
$$

Then prove $(x,y)$ appears in a pre-built table of all:

$$
(x,\operatorname{ReLU}(x))
$$

pairs.

The slide says this is one lookup regardless of table size.

## 13.4 Why this matters for ML

Quantise activations to a fixed bit width. Then every non-linearity can become a table:

- ReLU;
- GELU;
- sigmoid;
- softmax.

Protocols such as:

- Lasso;
- Caulk+;

aim to make proof cost nearly independent of table size.

⚑ **Exam/revision flag:** Lookup arguments are important because non-linearities dominate zkML cost.

---

# 14. Fixed-point arithmetic in circuits

## 14.1 Problem

Neural networks use floating-point numbers.

SNARKs work over a finite field:

$$
\mathbb{F}_p.
$$

There is no decimal point in $\mathbb{F}_p$.

Simulating IEEE floating point in-circuit is expensive. The slide specifically says division and exponentiation alone can cost thousands of constraints.

## 14.2 Solution: quantise to an integer grid

Represent real $r$ as:

$$
\hat{r} = \operatorname{round}(r \cdot 2^s).
$$

The slide describes this as snapping reals to an integer grid.

Addition stays on the grid.

Multiplication does not.

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

So after every multiply, we need to rescale.

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

Range-check $r$.

The slide says this uses one lookup per multiplication.

⚑ **Exam/revision flag:** Fixed-point arithmetic is a major zkML bottleneck: multiplication changes scale, so rescaling and range checks are needed.

---

# 15. ZK neural-network inference in papers: Mystique

The slide shows a diagram from Mystique.

Key visual elements:

- prover-provided witness;
- public commitment;
- Com-Auth conversion;
- authenticated input;
- linear layer;
- non-linear layer;
- authenticated output.

It labels:

- improved matrix multiplication;
- arithmetic-Boolean conversion;
- fixed-point floating-point conversion;
- features and model parameters as inputs.

[UNCLEAR] The slide provides the Mystique diagram but not a detailed explanation of each component. Check transcript for any verbal explanation of:
- Com-Auth conversion;
- arithmetic-Boolean conversion;
- fixed-point floating-point conversion;
- how authenticated input/output is used.

---

# 16. Bridging inference to LLMs: why zkLLMs are challenging

## 16.1 Scale of circuit constraints

The slide estimates circuit constraints per forward pass per token on a log scale:

| Model | Approximate constraints | Status marker |
|---|---:|---|
| MLP, 100k parameters | $10^5$ | deployable |
| ResNet, 25M parameters | $10^7$ | deployable |
| BERT-base, 110M parameters | $10^9$ | emerging |
| LLaMA-2, 7B parameters | $10^{10}$ | research |
| LLaMA-2, 70B parameters | $10^{11}$ | out of reach |
| GPT-4?, speculative 1.8T+ parameters | $10^{12+}$ | out of reach |

## 16.2 Scale problem

Billions of parameters imply billions of multiplications per token.

Autoregressive generation repeats the forward pass once per output token.

Attention is:

$$
O(n^2)
$$

in sequence length.

The per-cell cost is non-linear.

LLM-specific primitives go beyond ReLU, including:

- layernorm;
- RMSNorm in LLaMA;
- RoPE;
- gating.

⚑ **Exam/revision flag:** zkLLM difficulty is not just “large matrix multiplies.” Attention, normalization, RoPE, gating, and autoregressive repetition all add difficulty.

---

# 17. Transformer block: what needs circuits

The slide shows a typical LLM structure:

1. Sequence of tokens.
2. Embedding.
3. Repeated layers:

$$
\text{Layer} \times L.
$$

Inside each repeated layer:

- head;
- $Q$, $K$, $V$ projections;
- attention;
- concatenate and project;
- feed-forward MLP.

After layers:

- linear layer;
- softmax;
- sample output.

[UNCLEAR] The slide includes the transformer block diagram but does not explain how each subcomponent is arithmetised. Check transcript for details on attention, softmax, layernorm/RMSNorm, and RoPE if discussed verbally.

---

# 18. zkLLM: making LLaMA-2 provable

## 18.1 Techniques from zkLLM, CCS 2024

The slide lists two key techniques.

### Specialised lookup argument: tlookup

A specialized lookup argument tailored for tensor-shaped non-arithmetic operations.

The slide says it has zero asymptotic overhead.

### zkAttn

A dedicated ZK proof for the attention mechanism, balancing:

- runtime;
- memory;
- accuracy.

## 18.2 zkAttn diagram

The diagram shows:

- $Q$, $K$, and $V$;
- matrix multiplication;
- normalization row-wise;
- output $Y$;
- verification of $\hat{z}$ indirectly;
- tlookups for each segment;
- $b$-ary segments of $Z'$;
- exponential terms such as $\exp(b^j\cdot)$.

[UNCLEAR] The slide presents the zkAttn figure but not a full derivation of the protocol in the visible slide text. Check transcript if the lecturer explained the normalization, segmented lookup, or indirect verification of $\hat{z}$.

---

# 19. zkLLM reported results

The slide reports results from the zkLLM paper for sequence length:

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

[UNCLEAR] These values were transcribed from an embedded slide image. Verify exact numbers against the recording or original paper if they matter for assessment.

---

# 20. zkGPT: pushing the frontier

The slide cites zkGPT, USENIX Security 2025.

Reported results:

- full GPT-2 inference;
- prover time less than 25 seconds;
- non-interactive proof around 101 KB.

Limitations:

- inference only;
- no training trajectories;
- quantised arithmetic only;
- long-sequence generation still needs recursion.

---

# 21. Proof composition

## 21.1 Challenge

A single monolithic proof of a billion-parameter inference can exceed prover memory.

Workaround:

- split computation and proof by layers.

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

as one succinct proof.

## 21.2 Candidate technique 1: recursive SNARKs

Recursive SNARKs prove that each:

$$
\pi_i
$$

verifies.

Then the verifier of:

$$
\pi_{\text{final}}
$$

runs just one check.

## 21.3 Candidate technique 2: folding schemes

Examples listed:

- Nova;
- HyperNova;
- ProtoStar.

These accumulate many instances of the same circuit, amortising prover cost across layers.

The slide says folding is an active research direction.

---

# 22. Other emerging approaches

## 22.1 Distillation to SNARK-friendly models

Train a small student LLM, e.g. 1B parameters, whose outputs track a larger teacher model.

Modify architecture to avoid expensive primitives:

- polynomial activations;
- no layernorm.

Trade-off:

$$
\text{lose accuracy} \quad \text{gain tractability}.
$$

## 22.2 Dishonest-prover-resistant approximation

Do not prove full inference.

Instead, prove spot checks, such as:

> At random token $t$, the prover can open the forward pass.

This gives statistical soundness and is much cheaper in expectation.

## 22.3 Hybrid TEE + ZKP

Run the LLM in a Trusted Execution Environment, e.g. SGX.

Produce:

- TEE attestation;
- lightweight ZKP of the attestation.

This has a weaker trust assumption than TEE alone and is far cheaper than pure ZKP.

---

# 23. Applications motivating zkLLM

## 23.1 Verifiable model serving

A cloud LLM provider proves it served the claimed model version on the user’s prompt, not a cheaper substitute, without revealing the weights.

## 23.2 Content provenance

Prove that text was generated by a specific LLM rather than human-written.

Goal:

- verifiable AI attribution;
- no prompt disclosure.

## 23.3 Regulated inference

A financial or medical LLM proves it ran an approved version on a regulated input.

The slide links this to:

- EU AI Act;
- FDA AI guidance.

## 23.4 On-chain AI agents

Smart contracts need to consume LLM outputs trustlessly, such as:

- sentiment oracles;
- code review.

They require proofs that the LLM actually ran.

## 23.5 Why this is a live research frontier

These applications require proving times of seconds, not minutes.

The slide says reaching usability requires another:

$$
10\text{–}100\times
$$

improvement beyond zkLLM.

---

# 24. Open problems and research directions

The slide groups open problems across crypto, ML, and systems infrastructure.

## 24.1 Crypto

- Matmul-aware lookup arguments.
- Floating-point proofs.
- Post-quantum zkML.

## 24.2 ML

- Polynomial activations.
- Linear attention.
- Quantisation limits.

## 24.3 Cross-discipline / central problems

- Verifiable training.
- SNARK-friendly architectures.
- Provable distillation.

The slide marks these as real cross-discipline problems needing both crypto and ML progress.

## 24.4 Systems infrastructure

- Multi-GPU proving.
- PyTorch / ONNX toolchains.
- MSM / NTT accelerators.

The slide marks systems infrastructure as enabling everything else.

---

# 25. Integrating zkML with other privacy tools

## 25.1 zkML + DP: verifiable privacy

Release a model trained with DP-SGD plus a ZKP proving that DP noise was actually added with claimed standard deviation:

$$
\sigma.
$$

This solves the:

> “trust me I added noise”

problem.

## 25.2 zkML + SMPC: private joint inference

Parties jointly compute inference via SMPC.

The output includes a ZKP of correctness without revealing any party’s input.

## 25.3 zkML + FL + secure aggregation

Full stack for regulated collaborative learning:

- secure aggregation hides individual updates;
- client ZKPs bound norms or prove honest training;
- server ZKP attests to correct aggregation.

The slide states each primitive covers a gap the others leave.

⚑ **Exam/revision flag:** zkML does not replace DP, SMPC, or FL; it composes with them.

---

# 26. Threat-model considerations specific to zkML

## 26.1 What ZKPs do not protect against

### Model extraction through output leakage

If the prover reveals:

$$
y = M(x),
$$

then repeated queries may still leak information about $M$.

ZKP only proves the act of computation.

### Adversarial inputs

A prover can choose an input $x$ that causes $M$ to misbehave.

The proof attests to correct execution, not to the correctness or desirability of the answer.

### Training data poisoning

A proof that $M$ was trained on dataset $D$ says nothing about whether $D$ was legitimate.

## 26.2 Composition of privacy properties

The slide states:

$$
\text{inference privacy} \neq \text{training privacy} \neq \text{output privacy}.
$$

A zkML system must state which privacy property it claims and which properties rely on other primitives:

- DP;
- SMPC;
- HE.

⚑ **Exam/revision flag:** ZKPs prove computation correctness. They do not automatically prevent model extraction, adversarial inputs, or poisoned data.

---

# 27. zkML roadmap

The roadmap slide shows a timeline of zkML-related work from 2017 through 2025, including systems and papers such as:

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
- zkLoRA.

[UNCLEAR] The slide is a visual timeline only. It does not explain each paper’s contribution in the provided slide text. Use it for context, but not as a source for detailed technical claims unless the transcript explains it.

---

# 28. Lecture 9.3 key takeaways

1. zkML brings verifiability that SMPC and HE cannot: one prover, many offline verifiers, short certificates.
2. ZK-FL:
   - client proofs bound norms or prove honest updates;
   - server proofs attest correct aggregation;
   - complements secure aggregation rather than replacing it.
3. zkML inference:
   - linear layers are cheap;
   - non-linearities dominate;
   - lookup arguments help improve speed.
4. zkLLM:
   - single-step inference is now within reach;
   - full pre-training and long-sequence autoregressive generation remain open.
5. Rule of thumb:
   - deployable today: FL update proofs and small-model inference;
   - emerging: transformers;
   - research: LLM pre-training and long-form generation.
6. Compose primitives:
   - zkML + DP for verifiable privacy;
   - zkML + SMPC for private joint inference;
   - zkML + FL for regulated collaborative learning.

---

# Cross-lecture connections

## 1. SMPC and ZKP solve different gaps

From Lecture 9.1:

- SMPC lets parties compute over private inputs.
- Secure aggregation hides individual FL updates.

From Lecture 9.3:

- secure aggregation hides updates but does not check whether they are valid.
- ZKPs add integrity by proving update properties.

Connection:

$$
\text{SMPC/secure aggregation} = \text{privacy}
$$

$$
\text{ZKP} = \text{integrity/verifiability}
$$

Together they support privacy-preserving and auditable FL.

---

## 2. Secret sharing and secure aggregation

Lecture 9.1’s Shamir sharing directly supports robust FL secure aggregation.

Reason:

- pairwise masks cancel only if all relevant clients remain;
- dropped clients break cancellation;
- Shamir sharing lets surviving clients reconstruct dropped clients’ mask seeds.

---

## 3. Beaver triples and arithmetic circuits both reduce computation to algebra

SMPC uses arithmetic sharing and Beaver triples to compute additions and multiplications on secret-shared values.

ZKPs compile computations into arithmetic circuits/R1CS with $+$ and $\times$ gates.

Shared theme:

$$
\text{general computation} \rightarrow \text{algebraic operations}.
$$

---

## 4. Non-linearities are the bottleneck in both SMPC ML and zkML

Lecture 9.1:

- SMPC handles addition/multiplication naturally;
- ReLU/comparisons are expensive.

Lecture 9.3:

- arithmetic circuits handle addition/multiplication naturally;
- ReLU, softmax, GELU, sigmoid require bit decomposition or lookup arguments;
- fixed-point and range checks add cost.

Connection:

$$
\text{linear layers cheap, non-linear layers expensive}
$$

is a recurring theme.

---

## 5. Fiat–Shamir and zkML deployment

Lecture 9.2:

- Fiat–Shamir converts interactive proofs into non-interactive proofs.

Lecture 9.3:

- verifiable inference benefits from non-interactive proofs because many offline verifiers can check:

$$
y = M(x)
$$

without staying online with the model owner.

---

## 6. Proof systems determine zkML feasibility

Lecture 9.2 compares:

- Groth16;
- PLONK;
- STARKs;
- Bulletproofs.

Lecture 9.3 applies this to ML:

- PLONK-like systems and lookup arguments are useful for zkML frameworks;
- STARK-style scaling matters for large circuits;
- Bulletproofs/range proofs matter for quantized values and range constraints.

---

# Consolidated exam/revision flags

## High-priority definitions

You should be able to define:

- SMPC.
- Correctness and privacy in SMPC.
- Semi-honest versus malicious adversaries.
- Additive secret sharing.
- Shamir secret sharing.
- Beaver triple.
- Secure aggregation.
- Zero-knowledge proof.
- Completeness, soundness, zero-knowledge.
- Witness, statement, relation $R(x,w)$.
- Schnorr protocol.
- Fiat–Shamir transform.
- Arithmetic circuit.
- R1CS.
- zk-SNARK.
- Lookup argument.
- zkML.

## High-priority calculations

You should be able to work through:

1. Additive sharing reconstruction:

$$
s = \sum_i s_i \pmod p.
$$

2. Additive share addition.

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

6. Pairwise mask cancellation in secure aggregation.

7. Schnorr transcript verification:

$$
g^s \stackrel{?}{=} t y^c \pmod p.
$$

8. Schnorr completeness derivation.

9. R1CS constraint creation for a small arithmetic circuit.

10. zkML fixed-point rescaling:

$$
\hat{z}=q2^s+r,\quad 0\leq r<2^s.
$$

## Common-mistake / warning flags

- In Schnorr:
  - exponents reduce mod $q$;
  - group elements reduce mod $p$.
- In Beaver triples:
  - local shares do not satisfy $a_i b_i = c_i$;
  - only the global values satisfy $c=ab$.
- In Fiat–Shamir:
  - hash all public inputs and verifier-visible data.
- In zkML:
  - a ZKP of correct execution does not prove the model’s answer is “correct” in a semantic sense.
  - inference privacy, training privacy, and output privacy are different.
- In FL:
  - secure aggregation hides updates but does not prove updates are honest.

---

# Unclear sections to check in recording/transcript

1. **Missing transcript:** No transcript was included in the zip or message, so these notes cannot reflect lecturer-specific explanations, spoken exam hints, or verbal clarifications.

2. **Lecture 9.1 Beaver example arithmetic:** The slide’s Party 1 computation says:

$$
8+2\cdot4+17\cdot2+2\cdot17=84\equiv15.
$$

But the displayed arithmetic appears to sum to $80$, not $84$. Verify in recording.

3. **Lecture 9.1 secure aggregation signs:** The pairwise masking convention and the worked example use inconsistent signs for $r_{13}$. The masks still cancel, but the convention should be clarified.

4. **Lecture 9.2 “w.n.p.”:** The abbreviation in the soundness explanation should be checked. It likely means “with negligible probability.”

5. **Lecture 9.2 rewinding extractor:** The key takeaways mention a rewinding extractor for Schnorr proof-of-knowledge, but the slides do not explain it.

6. **Lecture 9.3 ZK-FL pseudocode:** Slide says to include `com` in secure aggregation. Context suggests it means include the client/update after proof verification, but this needs confirmation.

7. **Lecture 9.3 Mystique diagram:** Several labels are shown but not explained in slide text, including Com-Auth conversion and arithmetic-Boolean conversion.

8. **Lecture 9.3 transformer / zkAttn diagrams:** The slides show important diagrams but do not provide a full protocol derivation.

9. **Lecture 9.3 zkLLM table:** I transcribed the table from an embedded image. Verify exact numbers if they are exam-relevant.

10. **Lecture 9.3 zkML roadmap:** The timeline lists many systems/papers but does not explain each contribution in the slide text.
