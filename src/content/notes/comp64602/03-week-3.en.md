---
subject: COMP64602
chapter: 3
title: "Week 3"
language: en
---

# Advanced Topics in Knowledge Representation and Reasoning — Week 3 Study Notes

**Topic and scope:** This lecture is about **semantic embedding / representation learning**: representing symbolic knowledge as vectors while keeping some semantics in vector space. It starts with text embeddings, then moves to **knowledge graph embedding** and **ontology embedding**, especially TransE-style models, Box2EL, and OWL2Vec*.

**Course:** Advanced Topics in Knowledge Representation and Reasoning  
**Lecture topic:** Semantic Embedding; Knowledge Graph Embedding; Ontology Embedding

**Source materials used:** Week 3 lecture slides, Week 3 expanded video slides, and transcripts for Week 3 videos 1–7.

---

## 1. Big Picture: Why Semantic Embeddings?

### 1.1 Core motivation

**Intuition:**  
Symbolic knowledge such as words, entities, relations, concepts, and logical axioms is not naturally numerical. Machine learning, data mining, and statistical analysis usually operate on numbers. Semantic embeddings turn symbols into vectors so these methods can consume them.

**Lecture definition / framing:**  
Semantic embedding means representing symbols as vectors while keeping their relationships or correlations in the vector space. The lecturer also described it as a kind of **sub-symbolic knowledge representation**.

### 1.2 Why embed knowledge graphs and ontologies?

The lecture gives two broad reasons.

#### A. Uncertain reasoning

Embedding can support:

- **Fuzzy knowledge representation**
- Reasoning with incompleteness
- Predicting missing knowledge, for example by analogy
- Inducing conceptual knowledge using machine learning
- Approximating complex reasoning

#### B. Neural-symbolic integration

Embeddings allow symbolic knowledge to be consumed by downstream machine learning and data mining applications. This is the main bridge from symbolic KRR to numerical learning methods.

### 1.3 Scope of the week

The full Week 3 structure is:

1. Semantic Embedding
   - Definition
   - One-hot vectors
   - Word2Vec
2. Knowledge Graph Embedding
   - TransE
   - TransE variants: TransH, TransR
3. Ontology Embedding
   - Ball-based and box-based embeddings
   - Text-aware ontology embedding, especially OWL2Vec*

---

# 2. Semantic Embedding for Text

## 2.1 Semantic embedding

### Definition

**Intuition:**  
A semantic embedding maps symbols into vectors so that related symbols have related positions or directions in vector space.

**Example from the lecture:**

\[
V(\text{queen}) - V(\text{king}) \approx V(\text{mother}) - V(\text{father})
\]

This expresses an analogy-like relationship: the difference between queen and king is similar to the difference between mother and father. The lecturer described this as preserving a relationship such as “partnership” or gender/role contrast in the vector space.

---

## 2.2 One-hot representation

### Definition

**Intuition:**  
Each word gets its own dimension. A word vector is all zeros except for a single 1 in the dimension corresponding to that word.

**Formal example from the slides:**  
Vocabulary:

\[
(\text{cat}, \text{mat}, \text{on}, \text{sat}, \text{the})
\]

Then:

\[
\text{cat} = [1,0,0,0,0]
\]

\[
\text{mat} = [0,1,0,0,0]
\]

\[
\text{on} = [0,0,1,0,0]
\]

\[
\text{sat} = [0,0,0,1,0]
\]

\[
\text{the} = [0,0,0,0,1]
\]

Each word occupies exactly one dimension.

### Worked example: “The cat sat on the mat”

The sentence is represented by stacking the one-hot vectors of the words in order:

\[
\text{The cat sat on the mat}
\]

becomes a matrix with one row per token:

\[
\begin{bmatrix}
0 & 0 & 0 & 0 & 1 \\
1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 \\
0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 \\
0 & 1 & 0 & 0 & 0
\end{bmatrix}
\]

The transcript says the sentence matrix has size \(6 \times 5\), because the sentence has 6 words and the toy vocabulary has 5 words.

### Limitations

The lecture emphasizes two major limitations:

1. **High dimensionality**  
   Real vocabularies can be very large, for example 10K words. Each word then needs a vector of length 10K.

2. **Sparsity and poor similarity**  
   Most entries are zero. Different words have orthogonal one-hot vectors, so even semantically related different words can have cosine similarity 0.

[UNCLEAR] The transcript says “A15 dimensional vector,” but the slide example is clearly a **5-dimensional** one-hot vector for a 5-word vocabulary.

---

## 2.3 Word2Vec

### Definition

**Intuition:**  
Word2Vec learns dense, low-dimensional vectors from a large text corpus. Unlike one-hot vectors, many dimensions contain meaningful learned information.

**Lecture definition:**  
Word2Vec is a neural network model proposed by Google in 2013. It learns a distributed representation of words from a large text corpus and represents each word as a low-dimensional dense vector, for example dimension 500, while keeping correlations with words appearing in its context.

### Contrast with one-hot

| Property | One-hot | Word2Vec |
|---|---|---|
| Dimension | Vocabulary size | Much smaller, e.g. hundreds |
| Vector type | Sparse | Dense |
| Semantics | No direct semantic similarity | Learns contextual correlations |
| Training | No learning needed | Learned from corpus |

---

## 2.4 Word2Vec model 1: Continuous Skip-gram

### Intuition

Given a word, predict the surrounding words.

Example idea:

\[
\text{input word} \rightarrow \text{predict context words}
\]

### Architecture from the lecture

The model is a feedforward neural network:

1. Input is a one-hot representation of a word.
2. The input is mapped to a hidden layer.
3. The hidden layer has the same size as the embedding dimension.
4. The hidden layer output is mapped to output one-hot vectors for surrounding words.
5. The model calculates a loss based on how well it predicts the surrounding words.
6. Training minimizes this loss over a large corpus.
7. After training, the hidden-layer output for a word is treated as that word’s embedding.

### Formal training objective, as described

The lecture does not give a full objective formula, but the process is:

\[
\text{given target word} \quad w_t
\]

predict surrounding words:

\[
w_{t-k}, \ldots, w_{t-1}, w_{t+1}, \ldots, w_{t+k}
\]

by minimizing prediction loss over a corpus.

---

## 2.5 Word2Vec model 2: Continuous Bag of Words — CBOW

### Intuition

Mask a word in a sentence and predict that word from its surrounding words.

\[
\text{surrounding words} \rightarrow \text{predict middle word}
\]

### Architecture from the lecture

1. Inputs are one-hot vectors of multiple surrounding words.
2. Each surrounding word is mapped to a hidden representation using a weight matrix.
3. The hidden layer has dimension equal to the embedding size.
4. The hidden outputs are used to approximate the one-hot representation of the target middle word.
5. The model minimizes the loss over a text corpus.
6. The embedding of a word is the hidden-layer output, described in the transcript as the product of the word’s one-hot vector and the weight matrix mapping input to hidden layer.

---

## 2.6 Contextual vs non-contextual embeddings

### Example from the lecture

Sentence:

> “the bank robber was seen on the river bank”

The word **bank** appears twice, but with two different meanings.

### Non-contextual embeddings

Example: Word2Vec.

\[
V(\text{bank}) = V(\text{bank})
\]

A word has one vector regardless of context. The financial/criminal “bank” and the river “bank” receive the same vector.

### Contextual embeddings

Example from slides: BERT based on Transformer.

\[
V(\text{bank}) \neq V(\text{bank})
\]

A word’s vector changes depending on surrounding words. The lecturer says contextual embeddings model more fine-grained semantics and now lead performance in many text understanding tasks, but this unit focuses on complex knowledge rather than natural language text.

---

# 3. Knowledge Graph Embedding: TransE

## 3.1 What TransE embeds

### Definition

**Intuition:**  
TransE embeds relational facts by treating each relation as a vector translation from the head entity to the tail entity.

**Formal lecture definition:**  
A knowledge graph is composed of relational facts/triples. TransE represents:

- each **entity** as a point vector in Euclidean space;
- each **relation** as a mapping / translation vector in Euclidean space.

For a triple:

\[
\langle h, r, t \rangle
\]

where:

- \(h\) = head / subject entity
- \(r\) = relation
- \(t\) = tail / object entity

TransE aims for:

\[
\mathbf{h} + \mathbf{r} \approx \mathbf{t}
\]

### Worked example: London, CapitalOf, UK

Triple:

\[
\langle \text{London}, \text{CapitalOf}, \text{The UK} \rangle
\]

In a perfect TransE embedding:

\[
\mathbf{London} + \mathbf{CapitalOf} = \mathbf{TheUK}
\]

The slide diagram shows London as the head point, The UK as the tail point, and CapitalOf as the translation vector connecting them. In an actual model, the translation may not land exactly on the tail; the remaining gap is used as the score.

---

## 3.2 TransE score function

### Intuition

The smaller the distance between \(\mathbf{h} + \mathbf{r}\) and \(\mathbf{t}\), the more likely the triple is true.

### Formal definition from slides

For triple:

\[
\langle h,r,t\rangle
\]

score:

\[
f(h,r,t)=\left\|\mathbf{h}+\mathbf{r}-\mathbf{t}\right\|_{L1/L2}
\]

The lecturer states that when the score/gap is large, the triple is less likely to hold; when the score/gap is small, the triple is more likely to hold.

### L1 distance: Manhattan distance

\[
d(\mathbf{a},\mathbf{b})=\sum_{i=1}^{d} |a_i-b_i|
\]

The lecturer explains this as moving along grid lines, like moving through Manhattan streets: only horizontal/vertical movement counts.

### L2 distance: Euclidean distance

The slide writes:

\[
d(\mathbf{a},\mathbf{b})=\sum_{i=1}^{d}(a_i-b_i)^2
\]

The transcript describes L2 as the straight-line distance between two points.

[UNCLEAR] The slide formula omits the square root usually associated with Euclidean distance, while the transcript describes “straight-line distance.” For revision, preserve the slide formula but re-check this part in the recording if the exact norm matters.

---

## 3.3 Negative sampling in TransE

### Intuition

Training needs positive and negative triples. Positive triples are observed facts. Negative triples are generated by corrupting observed facts.

### Formal method

Given a positive triple:

\[
\langle h,r,t\rangle
\]

generate a negative triple by replacing either:

- the head \(h\), or
- the tail \(t\)

with another randomly selected entity.

### Worked example

Positive triple:

\[
\langle \text{London}, \text{CapitalOf}, \text{The UK}\rangle
\]

Negative triples:

\[
\langle \text{Manchester}, \text{CapitalOf}, \text{The UK}\rangle
\]

\[
\langle \text{London}, \text{CapitalOf}, \text{France}\rangle
\]

The transcript adds that this relies on a closed-world-style assumption: triples not declared in the KG are treated as false for sampling purposes. It also notes a weakness: because KGs are incomplete, a generated “negative” triple might actually be true. Example: replacing “The UK” with “England” might produce a plausible/true triple, depending on the KG and intended relation.

---

## 3.4 TransE loss function

### Intuition

The loss should:

- decrease scores/distances of positive triples;
- increase scores/distances of negative triples;
- enforce a margin \(\gamma\) between them.

### Formal definition from slides

Let:

- \(S\) = set of positive triples
- \(S'\) = set of negative triples
- \(\gamma\) = margin hyperparameter

Then:

\[
L
=
\sum_{(h,r,t)\in S}
\sum_{(h',r,t')\in S'}
\left[
\gamma
+
f(h,r,t)
-
f(h',r,t')
\right]_+
\]

where:

\[
[x]_+ = \max(0,x)
\]

The margin \(\gamma\) is used for robustness to noise and better generalization, making training points “safely away” from the decision boundary.

### Interpretation

If a positive triple already has a much lower score than its negative counterpart, then:

\[
\gamma + f(h,r,t) - f(h',r,t') \leq 0
\]

so the hinge loss contributes 0.

If the negative triple is not sufficiently worse than the positive triple, the term becomes positive and the model is penalized.

---

## 3.5 TransE training algorithm

The slide shows Algorithm 1 from the original TransE paper by Bordes et al. The expanded slide deck highlights the inputs, initialization, and batch-by-batch training.

### Inputs

- Training set:

\[
S = \{(h,\ell,t)\}
\]

The original algorithm uses \(\ell\) for relation; the lecture slides otherwise use \(r\).

- Entity set \(E\)
- Relation set \(L\)
- Margin \(\gamma\)
- Embedding dimension \(k\)

### Initialization

Relations are initialized uniformly:

\[
\ell \sim \text{uniform}\left(-\frac{6}{\sqrt{k}},\frac{6}{\sqrt{k}}\right)
\]

for each relation \(\ell \in L\), then normalized:

\[
\ell \leftarrow \frac{\ell}{\|\ell\|}
\]

Entities are also initialized uniformly:

\[
e \sim \text{uniform}\left(-\frac{6}{\sqrt{k}},\frac{6}{\sqrt{k}}\right)
\]

for each entity \(e \in E\).

### Training loop

Repeatedly:

1. Normalize each entity vector:

\[
e \leftarrow \frac{e}{\|e\|}
\]

2. Sample a mini-batch:

\[
S_{\text{batch}} \leftarrow \text{sample}(S,b)
\]

3. Initialize training-pair batch:

\[
T_{\text{batch}} \leftarrow \varnothing
\]

4. For each positive triple \((h,\ell,t)\in S_{\text{batch}}\), sample one corrupted triple:

\[
(h',\ell,t') \leftarrow \text{sample}(S'_{(h,\ell,t)})
\]

5. Add the positive-negative pair:

\[
T_{\text{batch}}
\leftarrow
T_{\text{batch}}
\cup
\{((h,\ell,t),(h',\ell,t'))\}
\]

6. Update embeddings by gradient descent with respect to:

\[
\sum_{((h,\ell,t),(h',\ell,t'))\in T_{\text{batch}}}
\nabla
\left[
\gamma
+
d(\mathbf{h}+\boldsymbol{\ell},\mathbf{t})
-
d(\mathbf{h'}+\boldsymbol{\ell},\mathbf{t'})
\right]_+
\]

The transcript states that stochastic gradient descent is used to search for embeddings that minimize the loss.

[UNCLEAR] The transcript says “This is opposite of Chelsea” and “Chelsea algorithm”; these are auto-transcription errors for **TransE**.

---

# 4. What TransE Can and Cannot Model

## 4.1 Relation composition

### Definition

Relation composition means one relation is the composition of two or more relations.

Example:

\[
r_1 \circ r_2 = r_3
\]

Lecture example:

\[
\langle A,\text{BrotherOf},B\rangle
\]

\[
\langle B,\text{FatherOf},C\rangle
\]

\[
\langle A,\text{UncleOf},C\rangle
\]

Here:

\[
\text{UncleOf} = \text{BrotherOf} \circ \text{FatherOf}
\]

### Why TransE can model this

If:

\[
\mathbf{x}+\mathbf{r}_1=\mathbf{y}
\]

and:

\[
\mathbf{y}+\mathbf{r}_2=\mathbf{z}
\]

then:

\[
\mathbf{x}+\mathbf{r}_1+\mathbf{r}_2=\mathbf{z}
\]

So the composed relation can be represented as:

\[
\mathbf{r}_3=\mathbf{r}_1+\mathbf{r}_2
\]

The slide explicitly says TransE is able to model relation composition.

---

## 4.2 Symmetric relations: TransE limitation

### Definition

A relation \(r\) is symmetric if:

\[
\langle h,r,t\rangle \Rightarrow \langle t,r,h\rangle
\]

Example:

\[
\langle A,\text{MarriedTo},B\rangle
\]

\[
\langle B,\text{MarriedTo},A\rangle
\]

### Derivation of the problem

For perfect TransE embedding, both triples should have score 0:

\[
\|\mathbf{h}+\mathbf{r}-\mathbf{t}\|_2=0
\]

\[
\|\mathbf{t}+\mathbf{r}-\mathbf{h}\|_2=0
\]

So:

\[
\mathbf{h}+\mathbf{r}=\mathbf{t}
\]

\[
\mathbf{t}+\mathbf{r}=\mathbf{h}
\]

Substitute the first into the second:

\[
(\mathbf{h}+\mathbf{r})+\mathbf{r}=\mathbf{h}
\]

\[
\mathbf{h}+2\mathbf{r}=\mathbf{h}
\]

\[
2\mathbf{r}=0
\]

\[
\mathbf{r}=0
\]

Then:

\[
\mathbf{h}=\mathbf{t}
\]

But \(h\) and \(t\) are different entities. Therefore, TransE cannot properly represent symmetric relations when distinct entities must remain distinct.

---

## 4.3 1-to-N relations: TransE limitation

### Definition

A 1-to-N relation links one head entity to multiple different tail entities.

Example:

\[
\langle A,\text{ParentOf},B\rangle
\]

\[
\langle A,\text{ParentOf},C\rangle
\]

### Derivation of the problem

For perfect TransE embedding:

\[
\|\mathbf{h}+\mathbf{r}-\mathbf{t}\|_2=0
\]

\[
\|\mathbf{h}+\mathbf{r}-\mathbf{t'}\|_2=0
\]

So:

\[
\mathbf{h}+\mathbf{r}=\mathbf{t}
\]

\[
\mathbf{h}+\mathbf{r}=\mathbf{t'}
\]

Therefore:

\[
\mathbf{t}=\mathbf{t'}
\]

But \(t\) and \(t'\) are different entities. This contradicts the KG facts. The slides say TransE similarly cannot represent N-to-1 or N-to-N relations well.

---

# 5. TransE Variants: TransH and TransR

## 5.1 TransH

### Motivation

TransH extends TransE to handle relation cases such as 1-to-N and N-to-1 relations better by projecting entities into a relation-specific hyperplane.

### Definition

TransH models each relation as:

1. a hyperplane with normal vector:

\[
\mathbf{w}_r
\]

2. a translation vector on that hyperplane:

\[
\mathbf{d}_r
\]

### Projection formulas from slides

The head entity is projected onto the hyperplane:

\[
\mathbf{h}_{\perp}
=
\mathbf{h}
-
\mathbf{w}_r^{T}\mathbf{h}\mathbf{w}_r
\]

The tail entity is projected similarly:

\[
\mathbf{t}_{\perp}
=
\mathbf{t}
-
\mathbf{w}_r^{T}\mathbf{t}\mathbf{w}_r
\]

Then translation happens on the hyperplane:

\[
\mathbf{h}_{\perp}+\mathbf{d}_r \approx \mathbf{t}_{\perp}
\]

### Intuition

The same entity can have different projected representations depending on the relation. This reduces the problem where a single global point vector must satisfy many incompatible translations.

---

## 5.2 TransR

### Motivation

TransR generalizes the idea further: entities may lie in different spaces, so before scoring a relation, entities are mapped into the relation’s own space.

### Formal definition from slides

For relation \(r\), use projection matrix:

\[
\mathbf{M}_r
\]

Map head and tail into relation-specific space:

\[
\mathbf{h}_r = \mathbf{h}\mathbf{M}_r
\]

\[
\mathbf{t}_r = \mathbf{t}\mathbf{M}_r
\]

Then score:

\[
f(h,r,t)
=
\left\|
\mathbf{h}_r+\mathbf{r}-\mathbf{t}_r
\right\|_{L1/L2}
\]

### Intuition

TransR is more expressive than TransH because the projection is a matrix rather than a hyperplane-normal vector. The transcript says this helps especially when entities behave very differently across relations, but it also requires learning more parameters than TransE/TransH.

---

# 6. Ontology Embedding and Description Logic \(\mathcal{EL}^{++}\)

## 6.1 Motivation: ontologies are more complex than KGs

KG embedding methods such as TransE represent entities as points. Ontologies contain not only individuals but also **concepts** and logical relationships between concepts. Therefore, the first challenge is distinguishing concepts and individuals in embedding space.

The lecture’s solution direction:

- represent an **individual** as a point;
- represent a **concept** as a region.

---

## 6.2 Description Logic \(\mathcal{EL}^{++}\)

### Scope

The ontology embedding methods in this lecture target \(\mathcal{EL}^{++}\), a fragment of Description Logic. The lecturer says it balances expressivity and reasoning complexity, and its features cover many real-world ontology modeling scenarios.

[UNCLEAR] The transcript says \(\mathcal{EL}^{++}\) “corresponds to our two year profile,” likely an auto-transcription error. The slide itself only clearly states **Description Logic \(\mathcal{EL}^{++}\)**.

### Formal concept constructors

Complex concepts can be recursively defined by:

\[
\bot
\mid
\top
\mid
A
\mid
C \sqcap D
\mid
\exists r.C
\mid
\{a\}
\]

where:

- \(\bot\): bottom concept / empty set
- \(\top\): top concept / full set
- \(A\): atomic concept
- \(C,D\): complex concepts
- \(C \sqcap D\): conjunction / intersection
- \(\exists r.C\): existential restriction
- \(\{a\}\): nominal, a concept containing a specific individual \(a\)

The transcript explains \(\exists r.C\) as meaning there exists some instance of concept \(C\) connected by relation \(r\).

### Role composition and role subsumption

\(\mathcal{EL}^{++}\) also allows role/relation composition and subsumption:

\[
r_1 \circ \cdots \circ r_k \sqsubseteq r
\]

---

## 6.3 Worked example: simple family ontology

The slide gives a family ontology with a TBox and ABox.

### TBox

\[
\mathcal{T}
=
\{
\text{Father} \sqsubseteq \text{Parent} \sqcap \text{Male},
\]

\[
\text{Mother} \sqsubseteq \text{Parent} \sqcap \text{Female},
\]

\[
\text{Child} \sqsubseteq \exists \text{hasParent}.\text{Father},
\]

\[
\text{Child} \sqsubseteq \exists \text{hasParent}.\text{Mother},
\]

\[
\text{hasParent} \sqsubseteq \text{relatedTo}
\}
\]

### ABox

\[
\mathcal{A}
=
\{
\text{Father}(\text{Alex}),
\text{Child}(\text{Bob}),
\text{hasParent}(\text{Bob},\text{Alex})
\}
\]

Interpretation:

- Alex is an instance of Father.
- Bob is an instance of Child.
- Bob has parent Alex.
- Father is a subclass of Parent and Male.
- Mother is a subclass of Parent and Female.
- A Child has some parent who is a Father and some parent who is a Mother.
- hasParent is a subrelation of relatedTo.

[UNCLEAR] The transcript says “instance is equivalent to in the video,” which is garbled. The slide clearly gives ABox assertions such as \(\text{Father}(\text{Alex})\).

---

# 7. Concept-as-Ball Ontology Embeddings

## 7.1 Definition

### Intuition

Represent a concept as a region shaped like a ball. Represent an individual as a point. If the individual point is inside the concept ball, the individual belongs to that concept.

### Formal representation

Each concept is represented by an \(n\)-ball:

- center:

\[
\mathbf{c} \in \mathbb{R}^n
\]

- radius:

\[
r \in \mathbb{R}
\]

Each individual is represented by a point:

\[
\mathbf{x} \in \mathbb{R}^n
\]

## 7.2 Membership and subsumption

### Membership

An individual belongs to a concept if its point is inside the ball.

### Concept subsumption

\[
C \sqsubseteq D
\]

is modeled as ball inclusion: the ball for \(C\) lies inside the ball for \(D\).

## 7.3 Limitation: concept intersection is not closed

The key limitation:

\[
C \sqcap D
\]

is the intersection of two concepts. But the intersection of two balls is generally not another ball; it can be a lens-shaped region.

Therefore, ball embeddings struggle to represent conjunction/intersection exactly, especially when the ontology needs:

\[
E \equiv C \sqcap D
\]

The slide explicitly says the intersection of two balls is “no longer ball.”

---

# 8. Concept-as-Box Embeddings: Box2EL

## 8.1 Why boxes?

Boxes solve the closure problem for conjunction: the intersection of two axis-aligned boxes is still a box. This makes them better suited for modeling concept intersections in \(\mathcal{EL}^{++}\).

## 8.2 Box2EL

The slides say **Box2EL** was proposed in 2024. It embeds \(\mathcal{EL}^{++}\) by representing concepts and relations with boxes.

### Formal concept representation

Each concept \(C\) is represented by an \(n\)-box using two vectors:

- lower-left corner:

\[
\mathbf{l}_C \in \mathbb{R}^n
\]

- upper-right corner:

\[
\mathbf{u}_C \in \mathbb{R}^n
\]

The box is:

\[
\text{Box}(C)
=
\{
\mathbf{x}\in\mathbb{R}^n
\mid
\mathbf{l}_C \leq \mathbf{x} \leq \mathbf{u}_C
\}
\]

where the inequalities are element-wise.

### Center and offset

Center:

\[
\mathbf{c}(C)
=
\frac{\mathbf{l}_C+\mathbf{u}_C}{2}
\]

Offset:

\[
\mathbf{o}(C)
=
\frac{\mathbf{u}_C-\mathbf{l}_C}{2}
\]

### What boxes can model

- Individual membership: point inside box.
- Concept subsumption: one box inside another.
- Concept conjunction: box intersection.
- Equivalence to an intersection, e.g.:

\[
E \equiv C \sqcap D
\]

because:

\[
\text{Box}(E)
=
\text{Box}(C)\cap\text{Box}(D)
\]

is still a box.

---

# 9. Representing Relations as Boxes

## 9.1 Why not just use translation vectors?

TransE uses relation translation vectors, but it has limitations for 1-to-N, N-to-1, and N-to-N relations. TransH and TransR address those limitations by projecting entities into relation-specific spaces. But in ontology embedding, concepts are boxes/regions, not just points, and relations appear in existential restrictions between concepts.

## 9.2 Relation representation in Box2EL

Each relation \(r\) is represented by two boxes:

- head box:

\[
\text{Head}(r)
\]

- tail box:

\[
\text{Tail}(r)
\]

The transcript says this idea is close to the domain and range of a relation.

## 9.3 Modeling existential restrictions with bumps

For an axiom:

\[
C \sqsubseteq \exists r.D
\]

concepts \(C\) and \(D\) “interact” or “bump” each other.

Each concept has a bump vector, written:

\[
\text{Bump}(C),\quad \text{Bump}(D)
\]

The axiom holds if:

\[
\text{Box}(C)\oplus \text{Bump}(D)
\subseteq
\text{Head}(r)
\]

and:

\[
\text{Box}(D)\oplus \text{Bump}(C)
\subseteq
\text{Tail}(r)
\]

The intended operation is translation of a box by a bump vector:

\[
\text{Box}(C)\oplus \text{Bump}(D)
=
\{
\mathbf{x}+\text{Bump}(D)
\mid
\mathbf{x}\in \text{Box}(C)
\}
\]

[UNCLEAR / slide typo] The lecture slide text contains an inconsistent version of this definition, using \(\mathbf{x}\in \text{Bump}(C)\), but the slide annotation says “Should be Box C.” The corrected version above follows that annotation.

---

## 9.4 Worked visual example: family ontology representation

The family ontology figure shows:

- concept boxes for Parent, Male, Female, Father, Mother, Child;
- relation head/tail boxes for hasParent and relatedTo;
- bump vectors connecting the concept boxes to relation boxes.

### Interpreting the figure

For:

\[
\text{Child} \sqsubseteq \exists \text{hasParent}.\text{Father}
\]

Box2EL checks:

1. Child bumped by Father lies inside the head box of hasParent:

\[
\text{Box}(\text{Child})
\oplus
\text{Bump}(\text{Father})
\subseteq
\text{Head}(\text{hasParent})
\]

2. Father bumped by Child lies inside the tail box of hasParent:

\[
\text{Box}(\text{Father})
\oplus
\text{Bump}(\text{Child})
\subseteq
\text{Tail}(\text{hasParent})
\]

Similarly for:

\[
\text{Child} \sqsubseteq \exists \text{hasParent}.\text{Mother}
\]

The transcript explains that Mother bumped by Child and Father bumped by Child should be inside the tail box of hasParent, and Child bumped by Father/Mother should be inside the head box of hasParent.

### Relation subsumption in the figure

For:

\[
\text{hasParent} \sqsubseteq \text{relatedTo}
\]

the head box of hasParent is inside the head box of relatedTo, and the tail box of hasParent is inside the tail box of relatedTo. This models relation subsumption geometrically.

---

# 10. Box Distance and Concept Subsumption Score

## 10.1 Element-wise distance between boxes

### Definition

For boxes \(A\) and \(B\):

\[
\mathbf{d}(A,B)
=
|\mathbf{c}(A)-\mathbf{c}(B)|
-
\mathbf{o}(A)
-
\mathbf{o}(B)
\]

This is an element-wise vector distance: each dimension gives the distance/overlap status in that dimension.

### Intuition

For each dimension:

- positive value: there is a gap between the boxes in that dimension;
- negative value: the boxes overlap in that dimension.

The transcript explains the slide’s 2D diagram:

- In the horizontal dimension, the center difference is larger than the sum of offsets, so the distance is positive.
- In the vertical dimension, the center difference is smaller than the sum of offsets, so the distance is negative, reflecting overlap.

## 10.2 Subsumption loss

For concept subsumption / box inclusion:

\[
A \sqsubseteq B
\]

Box2EL uses a score/loss \(\mathcal{L}_{\sqsubseteq}(A,B)\).

The slides give:

\[
\mathcal{L}_{\sqsubseteq}(A,B)
=
\begin{cases}
\left\|
\max\{0,\mathbf{d}(A,B)+2\mathbf{o}(A)-\gamma\}
\right\|
&
\text{if } B\neq \emptyset
\\[6pt]
\max\{0,\mathbf{o}(A)_1+1\}
&
\text{otherwise}
\end{cases}
\]

where \(\gamma\) is a margin hyperparameter.

The slide also gives:

\[
\mathbf{d}(A,B)+2\mathbf{o}(A)
=
|\mathbf{c}(A)-\mathbf{c}(B)|
+
\mathbf{o}(A)
-
\mathbf{o}(B)
\]

### Interpretation

The score is higher when subsumption is less likely. If \(A\) is inside \(B\), the score becomes 0 after the max operation. If \(A\) goes outside \(B\), the score becomes positive and contributes to the loss. The transcript describes moving box \(A\): if \(A\) moves partially outside \(B\), loss increases; if \(A\) moves further inside \(B\), the max operation makes the loss 0.

[UNCLEAR] The “otherwise” branch for \(B=\emptyset\), especially the use of \(\mathbf{o}(A)_1+1\), is shown on the slide but the transcript is garbled. Re-listen if the empty-box case is examinable.

---

# 11. Ontology Normalisation

## 11.1 Purpose

Before training Box2EL, the ontology is normalized into sample forms. The transcript says normalization changes the forms of axioms but does not change the ontology semantics.

## 11.2 Convert ABox axioms into TBox axioms

### Concept assertion

ABox assertion:

\[
C(a)
\]

becomes TBox axiom:

\[
\{a\} \sqsubseteq C
\]

### Role assertion

ABox assertion:

\[
r(a,b)
\]

becomes:

\[
\{a\} \sqsubseteq \exists r.\{b\}
\]

The slides note that the offset is 0 for nominals.

## 11.3 Normalize TBox axioms into seven normal forms

All TBox axioms are transformed into axioms of seven normal forms. The slides say this is implemented by reasoners such as **ELK**, which has high efficiency for ontologies of DL \(\mathcal{EL}^{++}\).

[UNCLEAR] The transcript says “UK,” but the slide clearly says **ELK**.

---

# 12. Box2EL Losses for Seven Normal Forms

The lecture gives losses/scores for seven normal forms. The first five are concept axioms; the last two are role axioms.

## 12.1 NF1: concept subsumption

Normal form:

\[
C \sqsubseteq D
\]

Loss:

\[
\mathcal{L}_1(C,D)
=
\mathcal{L}_{\sqsubseteq}
(
\text{Box}(C),\text{Box}(D)
)
\]

Meaning: box of \(C\) should be included in box of \(D\).

---

## 12.2 NF2: conjunction subsumption

Normal form:

\[
C \sqcap D \sqsubseteq E
\]

Loss:

\[
\mathcal{L}_2(C,D,E)
=
\mathcal{L}_{\sqsubseteq}
(
\text{Box}(C)\cap\text{Box}(D),
\text{Box}(E)
)
\]

Meaning: the intersection box of \(C\) and \(D\) should be included in box \(E\).

---

## 12.3 NF3: existential restriction on the right

Normal form:

\[
C \sqsubseteq \exists r.D
\]

Loss:

\[
\mathcal{L}_3(C,r,D)
=
\frac{1}{2}
\Big(
\mathcal{L}_{\sqsubseteq}
(
\text{Box}(C)+\text{Bump}(D),
\text{Head}(r)
)
+
\mathcal{L}_{\sqsubseteq}
(
\text{Box}(D)+\text{Bump}(C),
\text{Tail}(r)
)
\Big)
\]

Meaning:

- \(C\), bumped by \(D\), should be inside the head box of \(r\).
- \(D\), bumped by \(C\), should be inside the tail box of \(r\).

---

## 12.4 NF4: existential restriction on the left

Normal form:

\[
\exists r.C \sqsubseteq D
\]

Loss:

\[
\mathcal{L}_4(r,C,D)
=
\mathcal{L}_{\sqsubseteq}
(
\text{Head}(r)-\text{Bump}(C),
\text{Box}(D)
)
\]

Meaning: the relevant points connected by \(r\) to \(C\) should be contained in \(D\). The transcript explanation here is garbled, but the slide formula is clear.

---

## 12.5 NF5: disjointness / empty intersection

Normal form:

\[
C \sqcap D \sqsubseteq \bot
\]

Loss:

\[
\mathcal{L}_5(C,D)
=
\left\|
\max
\{
0,
-
(
\mathbf{d}(\text{Box}(C),\text{Box}(D))
+
\gamma
)
\}
\right\|
\]

Meaning: \(C\) and \(D\) should not overlap. The transcript says this is equivalent to the intersection of \(C\) and \(D\) being empty. If the distance in a dimension is negative, that reflects overlap and contributes to the loss.

---

## 12.6 NF6: role subsumption

Normal form:

\[
r \sqsubseteq s
\]

Loss:

\[
\mathcal{L}_6(r,s)
=
\frac{1}{2}
\Big(
\mathcal{L}_{\sqsubseteq}
(
\text{Head}(r),
\text{Head}(s)
)
+
\mathcal{L}_{\sqsubseteq}
(
\text{Tail}(r),
\text{Tail}(s)
)
\Big)
\]

Meaning: both the head and tail boxes of \(r\) should be included in the corresponding boxes of \(s\).

---

## 12.7 NF7: role composition subsumption

Normal form:

\[
r_1 \circ r_2 \sqsubseteq s
\]

Loss:

\[
\mathcal{L}_7(r_1,r_2,s)
=
\frac{1}{2}
\Big(
\mathcal{L}_{\sqsubseteq}
(
\text{Head}(r_1),
\text{Head}(s)
)
+
\mathcal{L}_{\sqsubseteq}
(
\text{Tail}(r_2),
\text{Tail}(s)
)
\Big)
\]

Meaning: the head box of \(r_1\) should be inside the head box of \(s\), and the tail box of \(r_2\) should be inside the tail box of \(s\).

---

# 13. Negative Samples in Box2EL

## 13.1 Difference from TransE

Box2EL is already trainable with the positive axiom losses above; no negative samples are strictly required. This is different from TransE, whose training relies on negative triples.

## 13.2 Why use negative samples anyway?

The transcript says negative samples can improve training efficiency/convergence.

## 13.3 How negative samples are generated

Negative samples are generated for NF3 axioms:

\[
C \sqsubseteq \exists r.D
\]

by replacing either \(C\) or \(D\) with a randomly selected different concept.

Negative sample:

\[
C \not\sqsubseteq \exists r.D
\]

## 13.4 Negative-sample loss

The slide gives:

\[
\mathcal{L}_{\not\sqsubseteq}(C,r,D)
=
\left(
\delta
-
\mu
(
\text{Box}(C)+\text{Bump}(D),
\text{Head}(r)
)
\right)^2
\]

\[
+
\left(
\delta
-
\mu
(
\text{Box}(D)+\text{Bump}(C),
\text{Tail}(r)
)
\right)^2
\]

where:

\[
\mu(A,B)
=
\left\|
\max
\{
0,
\mathbf{d}(A,B)+\gamma
\}
\right\|
\]

and:

\[
\mathbf{d}(A,B)
=
|\mathbf{c}(A)-\mathbf{c}(B)|
-
\mathbf{o}(A)
-
\mathbf{o}(B)
\]

\(\delta\) is a hyperparameter controlling how unlikely the negative samples are made by the model.

### Interpretation from transcript

- If two boxes overlap, \(\mu=0\), so there is loss.
- If they move apart and a gap appears, \(\mu>0\), and loss decreases.
- The loss is minimized around \(\mu=\delta\).
- If boxes move too far apart so that \(\mu>\delta\), the loss increases again.

---

## 13.5 Box2EL training

Box2EL uses stochastic gradient descent to optimize embeddings based on the losses above.

---

# 14. KG/Ontology Embedding Paradigms

The lecture then steps back and compares paradigms for KG/ontology embeddings.

## 14.1 End-to-end paradigm

Examples:

- TransE
- Box2EL

Pipeline:

1. Define score functions to model likelihood of knowledge.
2. Define loss functions based on those scores.
3. Learn embeddings by minimizing the losses.

This is the paradigm used by the earlier models in the lecture.

---

## 14.2 Sequence learning paradigm

### Intuition

Convert the KG/ontology into sequences, analogous to sentences, then train a word embedding model.

### Pipeline

1. Extract sentences/sequences of entities from the KG or ontology.
2. These sequences preserve mainly correlations between entities.
3. “Entity” here includes:
   - individuals
   - concepts
   - roles/relations
4. Train a word embedding model, such as Word2Vec, on the sequences.

The transcript says these sequences are paths in a graph when generated by random walk. Axioms can also be serialized directly into sequences by syntax transformation.

---

## 14.3 Graph propagation model paradigm

### Intuition

Use graph features to learn entity embeddings, for example using graph neural networks.

### Lecture connection

The transcript explicitly connects this to earlier material:

- A knowledge graph composed of relational facts is already a graph, as introduced in Week 1.
- An ontology composed of logical axioms is not directly a graph, but it can be transformed into one through additional processing.
- Once transformed, graph propagation models can learn graph features as embeddings.

### Diagram from slides

The page 45 diagram shows:

1. Ontology axioms such as:

\[
\text{Father} \sqsubseteq \text{Male}
\]

\[
\text{Father} \sqsubseteq \text{Male}\sqcap\text{Parent}
\]

\[
\text{Father}(\text{Alex})
\]

2. Conversion into an ontology graph with nodes such as:
   - Male
   - Parent
   - Father
   - Alex
   - literal label “Alexander Hamilton”

3. Two possible outputs:
   - graph propagation model, e.g. GNN, producing entity embeddings;
   - graph-to-sequences, e.g. random walk, plus axiom-to-sequence serialization, producing sequences for sequence learning.

---

# 15. Ontology Annotations and Text-Aware Embedding

## 15.1 Why text-aware ontology embedding?

Earlier methods such as TransE and Box2EL embed formally defined semantics. But ontologies also contain textual information, such as:

- concept names
- relation names
- natural language descriptions
- definitions
- comments

The lecture introduces OWL2Vec* as a method that uses both formal semantics and textual annotations.

---

## 15.2 Example: FoodOn ontology annotation

The slide gives a FoodOn example involving edamame.

### Formal semantic part

Concept:

\[
\text{obo:FOODON\_00002809}
\]

with label:

\[
\text{“edamame”}
\]

Formal axiom:

\[
\text{obo:FOODON\_00002809}
\quad
\text{rdfs:subClassOf}
\quad
\text{ObjectSomeValuesFrom}
(
\text{obo:RO\_0001000},
\text{obo:FOODON\_03411347}
)
\]

The relation has label:

\[
\text{“derives from”}
\]

The filler concept has label:

\[
\text{“plant”}
\]

### Textual annotation part

There is also a natural language definition:

> “Edamame is a preparation of immature soybean in their pods, or with the pod removed …”

This is attached through annotation property:

\[
\text{obo:IAO\_0000115}
\]

with label:

\[
\text{“definition”}
\]

The lecturer distinguishes **formally defined knowledge** from **literal/textual annotations** such as labels and definitions.

---

# 16. OWL2Vec*

## 16.1 Definition

OWL2Vec* is a text-aware ontology embedding method following the sequence learning paradigm. It embeds OWL ontologies using both:

- formal axioms/semantics;
- textual annotations.

The slide says OWL2Vec* was proposed in 2021.

[UNCLEAR] The transcript says “proposed in 2001,” but the slide says **2021**.

---

## 16.2 Overall OWL2Vec* framework

From bottom to top, the slide framework is:

1. OWL ontology and reasoning
2. Transform OWL ontology to RDF graph
3. Generate:
   - structure document: sentences of entity IRIs
   - lexical document: sentences of words
   - combined document: sentences of entity IRIs and words
4. Train a language model / word embedding model
5. Output:
   - IRI vector
   - word vector
   - entity embedding using IRI vector and/or word vector

---

## 16.3 Step 1: From OWL ontology to RDF graph

OWL2Vec* first transforms an OWL ontology into an RDF graph. Reasoning, for example using HermiT, can be enabled.

### Option 1: W3C OWL to RDF graph mapping

For the FoodOn axiom:

\[
\text{obo:FOODON\_00002809}
\sqsubseteq
\exists \text{obo:RO\_0001000}.\text{obo:FOODON\_03411347}
\]

the slide gives RDF triples:

\[
\langle
\text{obo:FOODON\_00002809},
\text{rdfs:subClassOf},
\_:x
\rangle
\]

\[
\langle
\_:x,
\text{rdf:type},
\text{owl:Restriction}
\rangle
\]

\[
\langle
\_:x,
\text{owl:OnProperty},
\text{obo:RO\_0001000}
\rangle
\]

\[
\langle
\_:x,
\text{owl:SomeValueFrom},
\text{obo:FOODON\_03411347}
\rangle
\]

The blank node \(\_:x\) represents the existential restriction. The following triples define its semantics: it is an OWL restriction, has property \(RO\_0001000\), and has filler \(FOODON\_03411347\).

### Option 2: Projection rules

The slide also gives a simpler projected triple:

\[
\langle
\text{obo:FOODON\_00002809},
\text{rdfs:subClassOf},
\text{obo:FOODON\_03411347}
\rangle
\]

The transcript says projection rules are simple and straightforward but lose or shift some semantics.

[UNCLEAR] The detailed projection-rule table on the slide is too small/garbled in the parsed content. The example projected triple is clear, but the full rule table should be checked in the slide recording if needed.

---

## 16.4 Step 2: Structure document — sentences of entity IRIs

OWL2Vec* generates a structure document containing sequences of entities.

Sources for these sequences:

1. Random walks over the RDF graph.
2. Random walks with Weisfeiler-Lehman subtree kernels.
3. Axioms serialized into sequences, for example using OWL Manchester syntax.

### Example random-walk sequence

\[
(
\text{vc:FOOD-4001},
\text{vc:hasNutrient},
\text{vc:VitaminC\_100},
\text{vc:amountNutrient}
)
\]

### Example WL subtree-kernel sequence

\[
(
\text{vc:FOOD-4001},
\text{rdf:type},
\text{kernel\_id1\_md5},
\text{rdfs:subClassOf},
\text{kernel\_id2\_md5}
)
\]

### Example axiom sequence

From the FoodOn existential restriction:

\[
(
\text{obo:FOODON\_00002809},
\text{subClassOf},
\text{obo:RO\_0001000},
\text{some},
\text{obo:FOODON\_03411347}
)
\]

The transcript says random walk generates paths in the graph, and those paths become entity sequences. It also says axioms can be directly serialized into sequences through syntax transformation.

---

## 16.5 Step 3: Lexical document — sentences of words

OWL2Vec* builds a lexical document by converting entity sequences into word sequences and by extracting text from annotation properties.

### Method A: transform from structure document

Example structure sequence:

\[
(
\text{vc:FOOD-4001},
\text{vc:hasNutrient},
\text{vc:VitaminC\_100},
\text{vc:amountNutrient}
)
\]

becomes lexical sequence:

\[
(
\text{“blonde”},
\text{“beer”},
\text{“has”},
\text{“nutrient”},
\text{“vitamin”},
\text{“c”},
\text{“amount”},
\text{“nutrient”}
)
\]

### Method B: extract from annotation properties

From the edamame definition:

\[
(
\text{“edamame”},
\text{“edamame”},
\text{“is”},
\text{“a”},
\text{“preparation”},
\text{“of”},
\text{“immature”},
\text{“soybean”},
\text{“in”},
\text{“their”},
\text{“pods”},
\ldots
)
\]

The transcript says OWL2Vec* extracts labels, definitions, and comments to form word sequences.

---

## 16.6 Step 4: Combined document — sentences of words and IRIs

OWL2Vec* also builds a combined document that mixes entity IRIs and words.

### Method

Replace one entity in every entity sequence by its words. The slide mentions:

- random selection
- traversal

### Example

Original entity sequence:

\[
(
\text{vc:FOOD-4001},
\text{vc:hasNutrient},
\text{vc:VitaminC\_100},
\text{vc:amountNutrient}
)
\]

Combined sequence:

\[
(
\text{vc:FOOD-4001},
\text{“has”},
\text{“nutrient”},
\text{“vitamin”},
\text{“c”},
\text{“amount”},
\text{“nutrient”}
)
\]

The transcript says this creates correlations between entities and words, enriching entity embeddings with textual semantics.

---

## 16.7 Step 5: Train word embedding model

The slide says OWL2Vec* uses a word embedding model, specifically CBOW.

Training documents:

- structure document
- lexical document
- combined document

Optional pre-training:

- text corpus, for example Wikipedia dump

Output:

- URI/IRI vector
- word vector
- entity vector as IRI vector and/or average word vector

The transcript emphasizes that the learned vocabulary contains not only words but also entities, so the model can output vectors for both.

---

# 17. Worked Examples to Preserve for Revision

## 17.1 One-hot vocabulary example

Vocabulary:

\[
(\text{cat}, \text{mat}, \text{on}, \text{sat}, \text{the})
\]

Vectors:

\[
\text{cat}=[1,0,0,0,0]
\]

\[
\text{mat}=[0,1,0,0,0]
\]

\[
\text{on}=[0,0,1,0,0]
\]

\[
\text{sat}=[0,0,0,1,0]
\]

\[
\text{the}=[0,0,0,0,1]
\]

Sentence matrix for “The cat sat on the mat”: \(6\times 5\).

---

## 17.2 Word analogy example

\[
V(\text{queen})-V(\text{king})
\approx
V(\text{mother})-V(\text{father})
\]

Meaning: vector differences can encode semantic relationships.

---

## 17.3 TransE triple example

Positive triple:

\[
\langle \text{London},\text{CapitalOf},\text{The UK}\rangle
\]

Perfect embedding:

\[
\mathbf{London}+\mathbf{CapitalOf}
=
\mathbf{TheUK}
\]

Actual embedding:

\[
\mathbf{London}+\mathbf{CapitalOf}
\]

may not exactly equal:

\[
\mathbf{TheUK}
\]

The distance is the score.

---

## 17.4 TransE negative sampling example

Positive:

\[
\langle \text{London},\text{CapitalOf},\text{The UK}\rangle
\]

Corrupt head:

\[
\langle \text{Manchester},\text{CapitalOf},\text{The UK}\rangle
\]

Corrupt tail:

\[
\langle \text{London},\text{CapitalOf},\text{France}\rangle
\]

Potential false-negative problem: the generated corrupted triple might actually be true because the KG is incomplete.

---

## 17.5 Relation composition example

Facts:

\[
\langle A,\text{BrotherOf},B\rangle
\]

\[
\langle B,\text{FatherOf},C\rangle
\]

\[
\langle A,\text{UncleOf},C\rangle
\]

Embedding relation:

\[
\mathbf{r}_{\text{UncleOf}}
=
\mathbf{r}_{\text{BrotherOf}}
+
\mathbf{r}_{\text{FatherOf}}
\]

---

## 17.6 Symmetric relation derivation

For both:

\[
\langle h,r,t\rangle
\]

and:

\[
\langle t,r,h\rangle
\]

perfect TransE requires:

\[
\mathbf{h}+\mathbf{r}=\mathbf{t}
\]

\[
\mathbf{t}+\mathbf{r}=\mathbf{h}
\]

which implies:

\[
\mathbf{r}=0,\quad \mathbf{h}=\mathbf{t}
\]

contradicting different entities.

---

## 17.7 1-to-N relation derivation

For:

\[
\langle h,r,t\rangle
\]

\[
\langle h,r,t'\rangle
\]

perfect TransE requires:

\[
\mathbf{h}+\mathbf{r}=\mathbf{t}
\]

\[
\mathbf{h}+\mathbf{r}=\mathbf{t'}
\]

therefore:

\[
\mathbf{t}=\mathbf{t'}
\]

contradiction if \(t\) and \(t'\) are different entities.

---

## 17.8 Family ontology example

TBox:

\[
\text{Father} \sqsubseteq \text{Parent}\sqcap\text{Male}
\]

\[
\text{Mother} \sqsubseteq \text{Parent}\sqcap\text{Female}
\]

\[
\text{Child} \sqsubseteq \exists\text{hasParent}.\text{Father}
\]

\[
\text{Child} \sqsubseteq \exists\text{hasParent}.\text{Mother}
\]

\[
\text{hasParent} \sqsubseteq \text{relatedTo}
\]

ABox:

\[
\text{Father}(\text{Alex})
\]

\[
\text{Child}(\text{Bob})
\]

\[
\text{hasParent}(\text{Bob},\text{Alex})
\]

Geometric Box2EL representation:

- Father, Mother, Parent, Male, Female, Child are boxes.
- hasParent and relatedTo have head/tail boxes.
- hasParent head/tail boxes are inside relatedTo head/tail boxes.
- Bump vectors model the existential restrictions.

---

## 17.9 OWL2Vec* FoodOn example

Formal axiom:

\[
\text{edamame}
\sqsubseteq
\exists \text{derivesFrom}.\text{plant}
\]

RDF mapping with blank node:

\[
\langle \text{edamame},\text{rdfs:subClassOf},\_:x\rangle
\]

\[
\langle \_:x,\text{rdf:type},\text{owl:Restriction}\rangle
\]

\[
\langle \_:x,\text{owl:OnProperty},\text{derivesFrom}\rangle
\]

\[
\langle \_:x,\text{owl:SomeValueFrom},\text{plant}\rangle
\]

Textual annotation:

\[
\text{“Edamame is a preparation of immature soybean …”}
\]

OWL2Vec* uses both.

---

# 18. Exam Flags / High-Value Revision Points

## Explicit exam statements

No explicit “this will be on the exam,” “common mistake,” or equivalent exam statement appears in the supplied slides/transcripts.

## “You should know / expected prior knowledge” flag

The lecturer says they expect students to have learned the features of \(\mathcal{EL}^{++}\) in previous videos and/or another ontology reasoning unit. Treat the following as high-value revision content:

- \(\mathcal{EL}^{++}\) constructors:

\[
\bot
\mid
\top
\mid
A
\mid
C\sqcap D
\mid
\exists r.C
\mid
\{a\}
\]

- role composition/subsumption:

\[
r_1\circ\cdots\circ r_k\sqsubseteq r
\]

- TBox/ABox distinction
- ABox-to-TBox normalization
- the seven normal forms used by Box2EL

## Likely high-value because of lecture depth

These were covered with formulas, derivations, or worked examples:

1. TransE score and loss.
2. Negative sampling and its weakness.
3. Why TransE models relation composition.
4. Why TransE fails on symmetric and 1-to-N relations.
5. TransH and TransR projections.
6. Ball vs box concept representations.
7. Box2EL relation head/tail boxes and bump vectors.
8. Box distance and subsumption loss.
9. Seven normal forms and their losses.
10. OWL2Vec* pipeline: RDF graph → structure/lexical/combined documents → CBOW embeddings.

---

# 19. Connections to Earlier Material and Broader Applications

## Connection to text embeddings

The lecture says KG and ontology embedding research originates partly from general semantic embeddings for texts. Therefore, the week begins with one-hot vectors and Word2Vec before moving to KG/ontology embeddings.

## Connection to Week 1

The transcript states that a KG made of relational facts is already a graph, as introduced in Week 1. Ontologies are not directly graphs, because they are made of logical axioms, but they can be transformed into graphs for graph propagation models or random-walk sequence learning.

## Connection to neural-symbolic integration

The whole motivation is to let symbolic knowledge support numerical downstream tasks, including machine learning, data mining, and statistical analysis.

## Connection to reasoning

Embedding supports approximate or uncertain forms of reasoning:

- incomplete KG completion
- missing knowledge prediction
- fuzzy representation
- conceptual induction
- approximation of complex reasoning

---

# 20. Unclear Sections to Re-listen To

1. **“Native vegetation learning / not implantation learning”**  
   Transcript is garbled; slide context indicates **representation learning / semantic embedding**.

2. **One-hot “A15 dimensional vector”**  
   Transcript says “A15,” but the slide example is a 5-word vocabulary, so vectors are 5-dimensional. Re-listen only if the lecturer gave an additional example.

3. **TransE name transcription**  
   Transcript uses “Chatty Cathy,” “Chancey,” “Chelsea,” and “chassis.” All refer to **TransE**, based on the slides.

4. **TransH and TransR names**  
   Transcript uses “Charles H,” “Trans Arch,” “chess R,” etc. Slides clearly identify **TransH** and **TransR**.

5. **L2 distance formula**  
   Slide writes:

   \[
   \sum_i(a_i-b_i)^2
   \]

   while the transcript describes straight-line Euclidean distance. Re-listen to confirm whether the lecturer intended squared L2 or ordinary Euclidean norm.

6. **\(\mathcal{EL}^{++}\) profile statement**  
   Transcript says something like “corresponds to our two year profile.” Slides do not clarify. Re-listen if the course expects the exact OWL profile terminology.

7. **Box2EL relation translation definition**  
   Slide formula for:

   \[
   \text{Box}(C)\oplus\text{Bump}(D)
   \]

   appears to use \(\mathbf{x}\in \text{Bump}(C)\), but the slide annotation says “Should be Box C.” Use:

   \[
   \{\mathbf{x}+\text{Bump}(D)\mid \mathbf{x}\in\text{Box}(C)\}
   \]

   and re-check the recording/slide if needed.

8. **Subsumption loss when \(B=\emptyset\)**  
   The formula branch involving:

   \[
   \max\{0,\mathbf{o}(A)_1+1\}
   \]

   is shown on the slide, but the transcript explanation is garbled.

9. **NF4 explanation**  
   The slide formula is clear:

   \[
   \mathcal{L}_4(r,C,D)
   =
   \mathcal{L}_{\sqsubseteq}
   (
   \text{Head}(r)-\text{Bump}(C),
   \text{Box}(D)
   )
   \]

   but the spoken explanation is difficult to parse.

10. **OWL2Vec* year**  
    Transcript says “2001,” slide says **2021**. Use 2021.

11. **Projection-rule table in OWL2Vec***  
    The slide includes a table of projection rules, but much of it is too small/garbled in parsed text. The example projection triple is clear; re-check the visual slide if the exact rules are needed.

12. **“Oil vector style / Oita star / oil to bag the storm”**  
    These are transcript errors for **OWL2Vec\***.
