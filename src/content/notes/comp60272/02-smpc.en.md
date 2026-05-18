---
subject: COMP60272
chapter: 2
title: Secure Multi-Party Computation
language: en
---

Secure Multi-Party Computation (SMPC) lets several parties compute a joint result without revealing their private inputs to one another. In the AI privacy setting, this is useful when hospitals, banks, or research groups want to train or evaluate a model together while keeping their local records confidential.

The core idea is to replace direct access to a value with shares of that value. If a secret value is $x$, each participant receives a share that is meaningless alone, but the shares can be combined through a protocol to recover only the intended output.

For a simple additive sharing scheme over a finite field, the secret can be represented as:

$$
x = \sum_{i=1}^{n} s_i \pmod q
$$

Computation then proceeds on the shares. Addition is cheap because each party can add its own shares locally, while multiplication usually requires an interaction step or preprocessed helper values. This difference matters when estimating the cost of privacy-preserving machine learning.

```python
def reconstruct(shares, modulus):
    return sum(shares) % modulus

print(reconstruct([12, 7, 31], 37))
```

| Operation | Typical SMPC cost | Why it matters |
| --- | --- | --- |
| Addition | Low | Local share updates are enough |
| Multiplication | Higher | Parties usually need interaction |
| Comparison | High | Branching leaks information unless handled carefully |

SMPC protects data during computation, but it does not automatically solve every privacy problem. The final output can still reveal information, so deployments often combine SMPC with careful output design, access controls, or differential privacy.
