---
subject: COMP64602
chapter: 73
title: "Week 3 — Extra Exercises"
language: en
---

# Week 3 — Semantic and Knowledge Graph Embeddings: Extra Exercise Set

A second layer on top of chapter 53, weighted toward numeric TransE computation, the skip-gram/CBOW distinction, and the relation patterns TransE provably cannot represent.

## Exercise types

1. **One-hot vs dense** — compare representations quantitatively.
2. **Word2Vec architecture** — distinguish skip-gram from CBOW by input/output.
3. **TransE scoring** — compute scores and rank candidates.
4. **Margin loss computation** — evaluate the loss on a triple pair.
5. **Expressiveness proof** — show a relation pattern TransE cannot model.

---

# Section A — Representations and Word2Vec

## E1. One-hot versus dense embeddings

A vocabulary has $50{,}000$ words. Compare one-hot vectors with $300$-dimensional dense embeddings on storage and on similarity.

### Solution

**Step 1: One-hot dimensions.** Each word is a vector of length $|V| = 50{,}000$ with a single $1$. Storing all words densely would take $50{,}000 \times 50{,}000 = 2.5 \times 10^9$ entries, though sparsely each vector needs only its index.

**Step 2: Dense dimensions.** Each word is a vector in $\mathbb{R}^{300}$, so the whole matrix is
$$50{,}000 \times 300 = 1.5 \times 10^7 \text{ entries},$$
about $167\times$ smaller than the dense one-hot matrix.

**Step 3: Similarity under one-hot.** For distinct words $u \neq w$, the vectors have their single $1$ in different positions, so
$$\mathbf{u} \cdot \mathbf{w} = 0.$$
Every pair of distinct words is exactly equally dissimilar — "cat" is as far from "dog" as from "algebra".

**Step 4: Similarity under dense embeddings.** Components are real-valued and learned, so the dot product (or cosine) takes a continuum of values and can place "cat" near "dog". Similarity becomes **informative**.

**Step 5: State the essential point.** The gain is not merely compression. One-hot representations are **mutually orthogonal by construction**, so they encode *identity only* and cannot express graded semantic relatedness. That is the motivation for learning distributed representations, and it is the answer to "why not just use one-hot?"

---

## E2. Skip-gram versus CBOW

For the sentence *the cat sat on the mat* with target `sat` and window size 2, state the input/output pairs for each model.

### Solution

**Step 1: Identify the context.** With window $2$ around `sat`, the context words are `the`, `cat` (left) and `on`, `the` (right).

**Step 2: Skip-gram — predict context from target.** Input is the **target**; output is each **context** word. Training pairs:
$$(\texttt{sat} \to \texttt{the}), \quad (\texttt{sat} \to \texttt{cat}), \quad (\texttt{sat} \to \texttt{on}), \quad (\texttt{sat} \to \texttt{the})$$
— four pairs from this one position.

**Step 3: CBOW — predict target from context.** Input is the **whole context** (typically averaged or summed); output is the **target**:
$$(\{\texttt{the}, \texttt{cat}, \texttt{on}, \texttt{the}\} \to \texttt{sat})$$
— one training instance from this position.

**Step 4: Note the practical consequences.** Skip-gram produces more training pairs per sentence, so it makes better use of small corpora and represents **rare words** better. CBOW averages contexts, which smooths noise, trains faster, and tends to work well on frequent words.

**Step 5: State the shared assumption.** Both rest on the **distributional hypothesis**: words in similar contexts have similar meanings. Both are also **non-contextual** — each word type gets one fixed vector, so `bank` in *river bank* and *savings bank* receive the identical embedding. **Contextual** models (ELMo, BERT) remove that limitation by computing a vector per occurrence.

---

# Section B — TransE

## E3. Compute TransE scores and rank

TransE scores a triple $(h, r, t)$ by
$$f(h,r,t) = \lVert \mathbf{h} + \mathbf{r} - \mathbf{t} \rVert$$
with **lower** meaning more plausible. Given (using the $L_2$ norm)
$$\mathbf{h} = (1, 0), \quad \mathbf{r} = (0, 2), \quad \mathbf{t}_1 = (1, 2), \quad \mathbf{t}_2 = (0, 1), \quad \mathbf{t}_3 = (2, 2),$$
rank $t_1, t_2, t_3$ as the tail.

### Solution

**Step 1: Compute the translated head once.**
$$\mathbf{h} + \mathbf{r} = (1, 0) + (0, 2) = (1, 2).$$

**Step 2: Score $t_1$.**
$$(1,2) - (1,2) = (0,0), \qquad f = \sqrt{0^2 + 0^2} = 0.$$

**Step 3: Score $t_2$.**
$$(1,2) - (0,1) = (1,1), \qquad f = \sqrt{1 + 1} = \sqrt{2} \approx 1.414.$$

**Step 4: Score $t_3$.**
$$(1,2) - (2,2) = (-1,0), \qquad f = \sqrt{1 + 0} = 1.$$

**Step 5: Rank by ascending score.**
$$t_1 \ (0) \;<\; t_3 \ (1) \;<\; t_2 \ (\approx 1.414).$$
So $t_1$ is most plausible, then $t_3$, then $t_2$.

**Step 6: Interpret the geometry.** $t_1$ sits exactly at $\mathbf{h} + \mathbf{r}$, giving a perfect score of $0$ — the relation is modelled as a **translation** in embedding space, and a perfectly fitted triple has zero distance. Note that $f$ is a **dissimilarity**, so the usual "higher is better" intuition is inverted; getting this backwards reverses every ranking.

---

## E4. Margin-based loss

TransE's loss for a positive triple with a corrupted negative is
$$\mathcal{L} = \max\big(0,\; \gamma + f(\text{positive}) - f(\text{negative})\big).$$
With margin $\gamma = 1$, compute $\mathcal{L}$ for (a) $f_{\text{pos}} = 0.5$, $f_{\text{neg}} = 2.0$; (b) $f_{\text{pos}} = 1.5$, $f_{\text{neg}} = 2.0$; (c) $f_{\text{pos}} = 2.0$, $f_{\text{neg}} = 1.0$.

### Solution

**Step 1: (a).**
$$\mathcal{L} = \max(0,\; 1 + 0.5 - 2.0) = \max(0, -0.5) = 0.$$
The negative already exceeds the positive by more than the margin, so there is **no gradient** — nothing to learn from this pair.

**Step 2: (b).**
$$\mathcal{L} = \max(0,\; 1 + 1.5 - 2.0) = \max(0, 0.5) = 0.5.$$
The ordering is correct ($1.5 < 2.0$) but the gap is only $0.5$, below the margin, so the model is still penalised and pushed to separate them further.

**Step 3: (c).**
$$\mathcal{L} = \max(0,\; 1 + 2.0 - 1.0) = \max(0, 2.0) = 2.0.$$
The ordering is **wrong** — the corrupted triple scores better than the true one — giving the largest loss.

**Step 4: State the margin's role.** The loss is zero only when
$$f_{\text{neg}} \ge f_{\text{pos}} + \gamma,$$
i.e. correct ordering **with a buffer of at least $\gamma$**. Without the margin, an arbitrarily small gap would suffice and the embedding could collapse toward degenerate solutions.

**Step 5: Note why negative sampling is required at all.** The training data contains only true triples. With positives alone, the model could trivially drive all embeddings to zero, making $f = 0$ everywhere. Corrupting $h$ or $t$ to generate negatives supplies the contrast that forces discrimination. Standard practice also **filters** corrupted triples that happen to be true, to avoid penalising correct facts.

---

## E5. Prove TransE cannot model symmetry

Show that TransE cannot represent a non-trivial symmetric relation.

### Solution

**Step 1: State what symmetry demands.** For a symmetric relation $r$, whenever $(h, r, t)$ holds so does $(t, r, h)$. Perfect modelling means both score $0$.

**Step 2: Write both conditions.** $f = 0$ means the translation is exact:
$$\mathbf{h} + \mathbf{r} = \mathbf{t} \qquad (1)$$
$$\mathbf{t} + \mathbf{r} = \mathbf{h} \qquad (2)$$

**Step 3: Substitute (1) into (2).**
$$(\mathbf{h} + \mathbf{r}) + \mathbf{r} = \mathbf{h} \implies \mathbf{h} + 2\mathbf{r} = \mathbf{h} \implies 2\mathbf{r} = \mathbf{0} \implies \mathbf{r} = \mathbf{0}.$$

**Step 4: Derive the consequence.** With $\mathbf{r} = \mathbf{0}$, equation (1) forces $\mathbf{t} = \mathbf{h}$ — every pair of entities related by $r$ must have **identical** embeddings.

**Step 5: Explain why this is fatal.** All entities related by $r$ collapse to one point, so they become indistinguishable for every *other* relation too. The relation itself becomes the zero vector, indistinguishable from any other relation forced to zero. So TransE can model symmetry only by degenerating.

**Step 6: List the other failures and the reason.** By similar arguments TransE struggles with:
- **1-to-N** relations: $(h, r, t_1)$ and $(h, r, t_2)$ both scoring $0$ force $\mathbf{t}_1 = \mathbf{h} + \mathbf{r} = \mathbf{t}_2$, collapsing distinct tails.
- **N-to-1** and **N-to-N**, by the mirrored argument.
- **Transitivity** and **composition**, which translation alone cannot express selectively.

**Step 7: Name the root cause and the fix direction.** A single additive vector per relation is too rigid: it makes the tail a **deterministic function** of the head. Later models relax this — TransH, TransR project entities into relation-specific spaces; RotatE uses rotation in complex space, which *can* represent symmetry (rotation by $\pi$) and antisymmetry. Being able to state *why* TransE fails, not merely *that* it does, is the examinable content.
