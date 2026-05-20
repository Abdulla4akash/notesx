---
subject: COMP64602
chapter: 3
title: "Week 3"
language: bn
---

# Advanced Topics in Knowledge Representation and Reasoning — সপ্তাহ ৩: বাংলা স্টাডি নোটস

**বিষয় ও পরিসর:** এই লেকচারটি **semantic embedding / representation learning** নিয়ে: প্রতীকী জ্ঞানকে vector হিসেবে উপস্থাপন করা, কিন্তু vector space-এ তার কিছু semantic সম্পর্ক ধরে রাখা। লেকচারটি text embedding দিয়ে শুরু হয়, তারপর **knowledge graph embedding** এবং **ontology embedding**-এ যায়, বিশেষ করে TransE-ধাঁচের মডেল, Box2EL, এবং OWL2Vec*।

**Course:** Advanced Topics in Knowledge Representation and Reasoning  
**Lecture topic:** Semantic Embedding; Knowledge Graph Embedding; Ontology Embedding

**ব্যবহৃত উৎস:** Week 3 lecture slides, Week 3 expanded video slides, এবং Week 3-এর video 1–7 transcript।

---

## 1. বড় ছবি: Semantic Embedding কেন দরকার?

### 1.1 মূল প্রেরণা

**Intuition:**  
শব্দ, entity, relation, concept, logical axiom—এসব symbolic knowledge স্বাভাবিকভাবে numerical নয়। কিন্তু machine learning, data mining, statistical analysis ইত্যাদি সাধারণত সংখ্যা নিয়ে কাজ করে। Semantic embedding প্রতীকগুলোকে vector-এ রূপান্তর করে, যাতে numerical methods এগুলো ব্যবহার করতে পারে।

**লেকচারের সংজ্ঞা / framing:**  
Semantic embedding হলো symbols-কে vector হিসেবে represent করা, যেখানে তাদের relationship বা correlation vector space-এ ধরে রাখা হয়। লেকচারার এটিকে **sub-symbolic knowledge representation** হিসেবেও বর্ণনা করেছেন।

### 1.2 Knowledge graph এবং ontology embedding কেন?

লেকচারে দুটি বড় কারণ দেওয়া হয়েছে।

#### A. Uncertain reasoning

Embedding নিচের কাজগুলো support করতে পারে:

- **Fuzzy knowledge representation**
- Incompleteness সহ reasoning
- Missing knowledge predict করা, যেমন analogy দিয়ে
- Machine learning দিয়ে conceptual knowledge induce করা
- Complex reasoning approximate করা

#### B. Neural-symbolic integration

Embedding symbolic knowledge-কে downstream machine learning এবং data mining application-এ consume করার সুযোগ দেয়। Symbolic KRR থেকে numerical learning methods-এ যাওয়ার প্রধান bridge এটিই।

### 1.3 সপ্তাহ ৩-এর scope

Week 3-এর পূর্ণ structure:

1. Semantic Embedding
   - Definition
   - One-hot vectors
   - Word2Vec
2. Knowledge Graph Embedding
   - TransE
   - TransE variants: TransH, TransR
3. Ontology Embedding
   - Ball-based এবং box-based embeddings
   - Text-aware ontology embedding, বিশেষ করে OWL2Vec*

---

# 2. Text-এর জন্য Semantic Embedding

## 2.1 Semantic embedding

### Definition

**Intuition:**  
Semantic embedding symbols-কে vectors-এ map করে, যাতে সম্পর্কিত symbols vector space-এ সম্পর্কিত position বা direction পায়।

**লেকচারের example:**

$$
V(\text{queen}) - V(\text{king}) \approx V(\text{mother}) - V(\text{father})
$$

এটি analogy-ধরনের একটি সম্পর্ক প্রকাশ করে: queen এবং king-এর মধ্যে vector difference mother এবং father-এর মধ্যে difference-এর মতো। লেকচারার এটিকে vector space-এ “partnership” বা gender/role contrast ধরনের relationship preserve করার উদাহরণ হিসেবে ব্যাখ্যা করেছেন।

---

## 2.2 One-hot representation

### Definition

**Intuition:**  
প্রতিটি word নিজস্ব একটি dimension পায়। একটি word vector-এর সব entry 0 থাকে, শুধু সংশ্লিষ্ট word-এর dimension-এ একটি 1 থাকে।

**Slides-এর formal example:**  
Vocabulary:

$$
(\text{cat}, \text{mat}, \text{on}, \text{sat}, \text{the})
$$

তাহলে:

$$
\text{cat} = [1,0,0,0,0]
$$

$$
\text{mat} = [0,1,0,0,0]
$$

$$
\text{on} = [0,0,1,0,0]
$$

$$
\text{sat} = [0,0,0,1,0]
$$

$$
\text{the} = [0,0,0,0,1]
$$

প্রতিটি word ঠিক একটিমাত্র dimension দখল করে।

### Worked example: “The cat sat on the mat”

Sentence-টি word-গুলোর one-hot vector order অনুযায়ী stack করে represent করা হয়:

$$
\text{The cat sat on the mat}
$$

এটি token প্রতি একটি row সহ matrix হয়:

$$
\begin{bmatrix}
0 & 0 & 0 & 0 & 1 \\
1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 \\
0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 \\
0 & 1 & 0 & 0 & 0
\end{bmatrix}
$$

Transcript অনুযায়ী sentence matrix-এর size $6 \times 5$, কারণ sentence-এ 6টি word আছে এবং toy vocabulary-তে 5টি word আছে।

### Limitations

লেকচারে দুটি প্রধান limitation জোর দিয়ে বলা হয়েছে:

1. **High dimensionality**  
   বাস্তব vocabulary খুব বড় হতে পারে, যেমন 10K words। তখন প্রতিটি word-এর vector length 10K হতে হবে।

2. **Sparsity এবং poor similarity**  
   বেশির ভাগ entry 0। ভিন্ন word-এর one-hot vectors orthogonal হয়, তাই semantically related হলেও দুইটি ভিন্ন word-এর cosine similarity 0 হতে পারে।

[UNCLEAR] Transcript-এ “A15 dimensional vector” বলা হয়েছে, কিন্তু slide example পরিষ্কারভাবে 5-word vocabulary-এর জন্য **5-dimensional** one-hot vector দেখায়।

---

## 2.3 Word2Vec

### Definition

**Intuition:**  
Word2Vec বড় text corpus থেকে dense, low-dimensional vectors শেখে। One-hot vector-এর মতো নয়; এখানে অনেক dimension meaningful learned information বহন করে।

**লেকচারের সংজ্ঞা:**  
Word2Vec হলো Google কর্তৃক 2013 সালে প্রস্তাবিত একটি neural network model। এটি large text corpus থেকে words-এর distributed representation শেখে এবং প্রতিটি word-কে low-dimensional dense vector হিসেবে represent করে, যেমন dimension 500; একই সঙ্গে context-এ আসা words-এর correlations ধরে রাখে।

### One-hot-এর সঙ্গে contrast

| Property | One-hot | Word2Vec |
|---|---|---|
| Dimension | Vocabulary size | অনেক ছোট, যেমন hundreds |
| Vector type | Sparse | Dense |
| Semantics | Direct semantic similarity নেই | Contextual correlations শেখে |
| Training | Learning দরকার নেই | Corpus থেকে শেখা হয় |

---

## 2.4 Word2Vec model 1: Continuous Skip-gram

### Intuition

একটি word দেওয়া হলে surrounding words predict করা।

Example idea:

$$
\text{input word} \rightarrow \text{predict context words}
$$

### Lecture অনুযায়ী architecture

মডেলটি একটি feedforward neural network:

1. Input হলো একটি word-এর one-hot representation।
2. Input hidden layer-এ mapped হয়।
3. Hidden layer-এর size embedding dimension-এর সমান।
4. Hidden layer output surrounding words-এর output one-hot vectors-এ mapped হয়।
5. Surrounding words কত ভালো predict করা হয়েছে তার উপর ভিত্তি করে model একটি loss calculate করে।
6. Large corpus-এর উপর training এই loss minimize করে।
7. Training শেষে কোনো word-এর hidden-layer output-কে ওই word-এর embedding হিসেবে ধরা হয়।

### Formal training objective, যেভাবে বর্ণনা করা হয়েছে

লেকচারে full objective formula দেওয়া হয়নি, কিন্তু process হলো:

$$
\text{given target word} \quad w_t
$$

surrounding words predict করা:

$$
w_{t-k}, \ldots, w_{t-1}, w_{t+1}, \ldots, w_{t+k}
$$

এবং corpus-এর উপর prediction loss minimize করা।

---

## 2.5 Word2Vec model 2: Continuous Bag of Words — CBOW

### Intuition

Sentence-এর একটি word mask করে surrounding words থেকে সেই word predict করা।

$$
\text{surrounding words} \rightarrow \text{predict middle word}
$$

### Lecture অনুযায়ী architecture

1. Inputs হলো multiple surrounding words-এর one-hot vectors।
2. প্রতিটি surrounding word একটি weight matrix ব্যবহার করে hidden representation-এ mapped হয়।
3. Hidden layer-এর dimension embedding size-এর সমান।
4. Hidden outputs target middle word-এর one-hot representation approximate করতে ব্যবহৃত হয়।
5. Model text corpus-এর উপর loss minimize করে।
6. কোনো word-এর embedding হলো hidden-layer output; transcript অনুযায়ী এটি word-এর one-hot vector এবং input-to-hidden layer weight matrix-এর product।

---

## 2.6 Contextual বনাম non-contextual embeddings

### Lecture-এর example

Sentence:

> “the bank robber was seen on the river bank”

এখানে **bank** word দুটি অর্থে এসেছে।

### Non-contextual embeddings

Example: Word2Vec.

$$
V(\text{bank}) = V(\text{bank})
$$

Context যাই হোক, একটি word-এর একটিই vector থাকে। Financial/criminal “bank” এবং river “bank” একই vector পায়।

### Contextual embeddings

Slides-এর example: Transformer-ভিত্তিক BERT।

$$
V(\text{bank}) \neq V(\text{bank})
$$

Surrounding words-এর উপর নির্ভর করে word-এর vector বদলায়। Lecturer বলেছেন contextual embeddings আরও fine-grained semantics model করে এবং এখন অনেক text understanding task-এ leading performance দেয়, কিন্তু এই unit natural language text নয়, complex knowledge-এর representation-এ focus করে।

---

# 3. Knowledge Graph Embedding: TransE

## 3.1 TransE কী embed করে

### Definition

**Intuition:**  
TransE relational facts embed করে প্রতিটি relation-কে head entity থেকে tail entity পর্যন্ত একটি vector translation হিসেবে ধরে।

**Formal lecture definition:**  
Knowledge graph relational facts/triples দিয়ে গঠিত। TransE represent করে:

- প্রতিটি **entity**-কে Euclidean space-এর একটি point vector হিসেবে;
- প্রতিটি **relation**-কে Euclidean space-এর একটি mapping / translation vector হিসেবে।

একটি triple:

$$
\langle h, r, t \rangle
$$

যেখানে:

- $h$ = head / subject entity
- $r$ = relation
- $t$ = tail / object entity

TransE চায়:

$$
\mathbf{h} + \mathbf{r} \approx \mathbf{t}
$$

### Worked example: London, CapitalOf, UK

Triple:

$$
\langle \text{London}, \text{CapitalOf}, \text{The UK} \rangle
$$

Perfect TransE embedding-এ:

$$
\mathbf{London} + \mathbf{CapitalOf} = \mathbf{TheUK}
$$

Slide diagram-এ London head point, The UK tail point, এবং CapitalOf তাদের সংযোগকারী translation vector। Actual model-এ translation ঠিক tail-এর উপর না-ও পড়তে পারে; অবশিষ্ট gap score হিসেবে ব্যবহৃত হয়।

---

## 3.2 TransE score function

### Intuition

$\mathbf{h} + \mathbf{r}$ এবং $\mathbf{t}$-এর distance যত ছোট, triple তত বেশি true হওয়ার সম্ভাবনাময়।

### Slides থেকে formal definition

Triple:

$$
\langle h,r,t\rangle
$$

score:

$$
f(h,r,t)=\left\|\mathbf{h}+\mathbf{r}-\mathbf{t}\right\|_{L1/L2}
$$

Lecturer বলেছেন score/gap বড় হলে triple hold করার সম্ভাবনা কম; score/gap ছোট হলে triple hold করার সম্ভাবনা বেশি।

### L1 distance: Manhattan distance

$$
d(\mathbf{a},\mathbf{b})=\sum_{i=1}^{d} |a_i-b_i|
$$

Lecturer এটি grid line ধরে চলার মতো ব্যাখ্যা করেছেন, যেমন Manhattan streets-এ চলা: শুধু horizontal/vertical movement count হয়।

### L2 distance: Euclidean distance

Slide লিখেছে:

$$
d(\mathbf{a},\mathbf{b})=\sum_{i=1}^{d}(a_i-b_i)^2
$$

Transcript L2-কে দুই point-এর straight-line distance হিসেবে বর্ণনা করেছে।

[UNCLEAR] Slide formula সাধারণ Euclidean distance-এর square root বাদ দিয়েছে, কিন্তু transcript “straight-line distance” বলেছে। Revision-এর জন্য slide formula preserve করো, তবে exact norm দরকার হলে recording re-check করো।

---

## 3.3 TransE-তে negative sampling

### Intuition

Training-এর জন্য positive এবং negative triples দরকার। Positive triples হলো observed facts। Negative triples তৈরি হয় observed facts corrupt করে।

### Formal method

Positive triple:

$$
\langle h,r,t\rangle
$$

থেকে negative triple তৈরি করা হয় replace করে:

- head $h$, অথবা
- tail $t$

অন্য randomly selected entity দিয়ে।

### Worked example

Positive triple:

$$
\langle \text{London}, \text{CapitalOf}, \text{The UK}\rangle
$$

Negative triples:

$$
\langle \text{Manchester}, \text{CapitalOf}, \text{The UK}\rangle
$$

$$
\langle \text{London}, \text{CapitalOf}, \text{France}\rangle
$$

Transcript যোগ করেছে যে এটি closed-world-style assumption-এর উপর নির্ভর করে: KG-তে declared নয় এমন triples sampling purpose-এ false হিসেবে ধরা হয়। Weakness: KG incomplete হওয়ায় generated “negative” triple আসলে true হতে পারে। Example: “The UK” replace করে “England” দিলে intended relation/KG অনুযায়ী plausible/true triple তৈরি হতে পারে।

---

## 3.4 TransE loss function

### Intuition

Loss-এর লক্ষ্য:

- positive triples-এর scores/distances কমানো;
- negative triples-এর scores/distances বাড়ানো;
- তাদের মধ্যে margin $\gamma$ enforce করা।

### Slides থেকে formal definition

ধরা যাক:

- $S$ = positive triples-এর set
- $S'$ = negative triples-এর set
- $\gamma$ = margin hyperparameter

তাহলে:

$$
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
$$

যেখানে:

$$
[x]_+ = \max(0,x)
$$

Margin $\gamma$ noise-এর প্রতি robustness এবং better generalization-এর জন্য ব্যবহৃত হয়; training points-কে decision boundary থেকে “safely away” রাখতে সাহায্য করে।

### Interpretation

যদি positive triple ইতিমধ্যে negative counterpart-এর তুলনায় অনেক lower score পায়, তাহলে:

$$
\gamma + f(h,r,t) - f(h',r,t') \leq 0
$$

তাই hinge loss contribution 0।

যদি negative triple positive triple-এর তুলনায় যথেষ্ট খারাপ না হয়, term positive হয় এবং model penalized হয়।

---

## 3.5 TransE training algorithm

Slide-এ Bordes et al.-এর original TransE paper থেকে Algorithm 1 দেখানো হয়েছে। Expanded slide deck inputs, initialization, এবং batch-by-batch training highlight করে।

### Inputs

- Training set:

$$
S = \{(h,\ell,t)\}
$$

Original algorithm relation-এর জন্য $\ell$ ব্যবহার করে; lecture slides অন্য জায়গায় $r$ ব্যবহার করে।

- Entity set $E$
- Relation set $L$
- Margin $\gamma$
- Embedding dimension $k$

### Initialization

Relations uniformly initialize করা হয়:

$$
\ell \sim \text{uniform}\left(-\frac{6}{\sqrt{k}},\frac{6}{\sqrt{k}}\right)
$$

প্রতিটি relation $\ell \in L$-এর জন্য, তারপর normalize করা হয়:

$$
\ell \leftarrow \frac{\ell}{\|\ell\|}
$$

Entities-ও uniformly initialize করা হয়:

$$
e \sim \text{uniform}\left(-\frac{6}{\sqrt{k}},\frac{6}{\sqrt{k}}\right)
$$

প্রতিটি entity $e \in E$-এর জন্য।

### Training loop

বারবার:

1. প্রতিটি entity vector normalize করো:

$$
e \leftarrow \frac{e}{\|e\|}
$$

2. Mini-batch sample করো:

$$
S_{\text{batch}} \leftarrow \text{sample}(S,b)
$$

3. Training-pair batch initialize করো:

$$
T_{\text{batch}} \leftarrow \varnothing
$$

4. প্রতিটি positive triple $(h,\ell,t)\in S_{\text{batch}}$-এর জন্য একটি corrupted triple sample করো:

$$
(h',\ell,t') \leftarrow \text{sample}(S'_{(h,\ell,t)})
$$

5. Positive-negative pair add করো:

$$
T_{\text{batch}}
\leftarrow
T_{\text{batch}}
\cup
\{((h,\ell,t),(h',\ell,t'))\}
$$

6. নিচের expression অনুযায়ী gradient descent দিয়ে embeddings update করো:

$$
\sum_{((h,\ell,t),(h',\ell,t'))\in T_{\text{batch}}}
\nabla
\left[
\gamma
+
d(\mathbf{h}+\boldsymbol{\ell},\mathbf{t})
-
d(\mathbf{h'}+\boldsymbol{\ell},\mathbf{t'})
\right]_+
$$

Transcript বলেছে stochastic gradient descent loss minimize করার embedding খুঁজতে ব্যবহৃত হয়।

[UNCLEAR] Transcript-এ “This is opposite of Chelsea” এবং “Chelsea algorithm” বলা হয়েছে; এগুলো **TransE**-এর auto-transcription errors।

---

# 4. TransE কী model করতে পারে এবং কী পারে না

## 4.1 Relation composition

### Definition

Relation composition মানে এক relation অন্য দুই বা ততোধিক relation-এর composition।

Example:

$$
r_1 \circ r_2 = r_3
$$

Lecture example:

$$
\langle A,\text{BrotherOf},B\rangle
$$

$$
\langle B,\text{FatherOf},C\rangle
$$

$$
\langle A,\text{UncleOf},C\rangle
$$

এখানে:

$$
\text{UncleOf} = \text{BrotherOf} \circ \text{FatherOf}
$$

### কেন TransE এটি model করতে পারে

যদি:

$$
\mathbf{x}+\mathbf{r}_1=\mathbf{y}
$$

এবং:

$$
\mathbf{y}+\mathbf{r}_2=\mathbf{z}
$$

তাহলে:

$$
\mathbf{x}+\mathbf{r}_1+\mathbf{r}_2=\mathbf{z}
$$

তাই composed relation represent করা যায়:

$$
\mathbf{r}_3=\mathbf{r}_1+\mathbf{r}_2
$$

Slide স্পষ্টভাবে বলেছে TransE relation composition model করতে পারে।

---

## 4.2 Symmetric relations: TransE limitation

### Definition

Relation $r$ symmetric হলে:

$$
\langle h,r,t\rangle \Rightarrow \langle t,r,h\rangle
$$

Example:

$$
\langle A,\text{MarriedTo},B\rangle
$$

$$
\langle B,\text{MarriedTo},A\rangle
$$

### সমস্যার derivation

Perfect TransE embedding-এ দুটো triple-এর score 0 হওয়া উচিত:

$$
\|\mathbf{h}+\mathbf{r}-\mathbf{t}\|_2=0
$$

$$
\|\mathbf{t}+\mathbf{r}-\mathbf{h}\|_2=0
$$

সুতরাং:

$$
\mathbf{h}+\mathbf{r}=\mathbf{t}
$$

$$
\mathbf{t}+\mathbf{r}=\mathbf{h}
$$

প্রথম equation দ্বিতীয়টিতে substitute করলে:

$$
(\mathbf{h}+\mathbf{r})+\mathbf{r}=\mathbf{h}
$$

$$
\mathbf{h}+2\mathbf{r}=\mathbf{h}
$$

$$
2\mathbf{r}=0
$$

$$
\mathbf{r}=0
$$

তখন:

$$
\mathbf{h}=\mathbf{t}
$$

কিন্তু $h$ এবং $t$ ভিন্ন entities। তাই distinct entities আলাদা রেখে TransE symmetric relations ঠিকভাবে represent করতে পারে না।

---

## 4.3 1-to-N relations: TransE limitation

### Definition

1-to-N relation একটি head entity-কে multiple different tail entities-এর সঙ্গে link করে।

Example:

$$
\langle A,\text{ParentOf},B\rangle
$$

$$
\langle A,\text{ParentOf},C\rangle
$$

### সমস্যার derivation

Perfect TransE embedding-এ:

$$
\|\mathbf{h}+\mathbf{r}-\mathbf{t}\|_2=0
$$

$$
\|\mathbf{h}+\mathbf{r}-\mathbf{t'}\|_2=0
$$

তাই:

$$
\mathbf{h}+\mathbf{r}=\mathbf{t}
$$

$$
\mathbf{h}+\mathbf{r}=\mathbf{t'}
$$

অতএব:

$$
\mathbf{t}=\mathbf{t'}
$$

কিন্তু $t$ এবং $t'$ ভিন্ন entities। এটি KG facts-এর সঙ্গে contradiction। Slides বলেছে TransE একইভাবে N-to-1 বা N-to-N relations-ও ভালোভাবে represent করতে পারে না।

---

# 5. TransE Variants: TransH এবং TransR

## 5.1 TransH

### Motivation

TransH relation-specific hyperplane-এ entities project করে 1-to-N এবং N-to-1 relation-এর মতো case ভালোভাবে handle করতে TransE extend করে।

### Definition

TransH প্রতিটি relation-কে model করে:

1. normal vector সহ একটি hyperplane:

$$
\mathbf{w}_r
$$

2. সেই hyperplane-এর উপর একটি translation vector:

$$
\mathbf{d}_r
$$

### Slides থেকে projection formulas

Head entity hyperplane-এ projected হয়:

$$
\mathbf{h}_{\perp}
=
\mathbf{h}
-
\mathbf{w}_r^{T}\mathbf{h}\mathbf{w}_r
$$

Tail entity একইভাবে projected হয়:

$$
\mathbf{t}_{\perp}
=
\mathbf{t}
-
\mathbf{w}_r^{T}\mathbf{t}\mathbf{w}_r
$$

তারপর translation hyperplane-এর উপর ঘটে:

$$
\mathbf{h}_{\perp}+\mathbf{d}_r \approx \mathbf{t}_{\perp}
$$

### Intuition

একই entity relation অনুযায়ী ভিন্ন projected representation পেতে পারে। এতে একক global point vector দিয়ে অনেক incompatible translation satisfy করার সমস্যা কমে।

---

## 5.2 TransR

### Motivation

TransR ধারণাটিকে আরও general করে: entities different spaces-এ থাকতে পারে, তাই কোনো relation score করার আগে entities-কে relation-এর নিজস্ব space-এ map করা হয়।

### Slides থেকে formal definition

Relation $r$-এর জন্য projection matrix ব্যবহার করা হয়:

$$
\mathbf{M}_r
$$

Head এবং tail relation-specific space-এ map করা হয়:

$$
\mathbf{h}_r = \mathbf{h}\mathbf{M}_r
$$

$$
\mathbf{t}_r = \mathbf{t}\mathbf{M}_r
$$

তারপর score:

$$
f(h,r,t)
=
\left\|
\mathbf{h}_r+\mathbf{r}-\mathbf{t}_r
\right\|_{L1/L2}
$$

### Intuition

TransR, TransH-এর চেয়ে বেশি expressive, কারণ projection hyperplane-normal vector নয়, একটি matrix। Transcript অনুযায়ী entities relations অনুযায়ী খুব ভিন্নভাবে behave করলে এটি বিশেষভাবে সাহায্য করে; তবে TransE/TransH-এর তুলনায় বেশি parameters learn করতে হয়।

---

# 6. Ontology Embedding এবং Description Logic $\mathcal{EL}^{++}$

## 6.1 Motivation: ontology KG-এর চেয়ে বেশি complex

TransE-এর মতো KG embedding methods entities-কে points হিসেবে represent করে। Ontology-তে individuals ছাড়াও **concepts** এবং concepts-এর মধ্যে logical relationships থাকে। তাই embedding space-এ concepts এবং individuals আলাদা করা প্রথম challenge।

লেকচারের solution direction:

- **individual**-কে point হিসেবে represent করা;
- **concept**-কে region হিসেবে represent করা।

---

## 6.2 Description Logic $\mathcal{EL}^{++}$

### Scope

এই lecture-এর ontology embedding methods Description Logic-এর একটি fragment $\mathcal{EL}^{++}$-কে target করে। Lecturer বলেছেন এটি expressivity এবং reasoning complexity-র মধ্যে balance রাখে, এবং এর features অনেক real-world ontology modeling scenario cover করে।

[UNCLEAR] Transcript-এ $\mathcal{EL}^{++}$ “corresponds to our two year profile” বলা হয়েছে, সম্ভবত auto-transcription error। Slide নিজে শুধু **Description Logic $\mathcal{EL}^{++}$** পরিষ্কারভাবে বলে।

### Formal concept constructors

Complex concepts recursively define করা যায়:

$$
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
$$

যেখানে:

- $\bot$: bottom concept / empty set
- $\top$: top concept / full set
- $A$: atomic concept
- $C,D$: complex concepts
- $C \sqcap D$: conjunction / intersection
- $\exists r.C$: existential restriction
- $\{a\}$: nominal, নির্দিষ্ট individual $a$-কে ধারণকারী concept

Transcript $\exists r.C$-কে ব্যাখ্যা করেছে: concept $C$-এর কোনো instance আছে, যা relation $r$ দ্বারা connected।

### Role composition এবং role subsumption

$\mathcal{EL}^{++}$ role/relation composition এবং subsumption-ও allow করে:

$$
r_1 \circ \cdots \circ r_k \sqsubseteq r
$$

---

## 6.3 Worked example: simple family ontology

Slide একটি family ontology দেয়, যার TBox এবং ABox আছে।

### TBox

$$
\mathcal{T}
=
\{
\text{Father} \sqsubseteq \text{Parent} \sqcap \text{Male},
$$

$$
\text{Mother} \sqsubseteq \text{Parent} \sqcap \text{Female},
$$

$$
\text{Child} \sqsubseteq \exists \text{hasParent}.\text{Father},
$$

$$
\text{Child} \sqsubseteq \exists \text{hasParent}.\text{Mother},
$$

$$
\text{hasParent} \sqsubseteq \text{relatedTo}
\}
$$

### ABox

$$
\mathcal{A}
=
\{
\text{Father}(\text{Alex}),
\text{Child}(\text{Bob}),
\text{hasParent}(\text{Bob},\text{Alex})
\}
$$

Interpretation:

- Alex হলো Father-এর instance।
- Bob হলো Child-এর instance।
- Bob-এর parent Alex।
- Father হলো Parent এবং Male-এর subclass।
- Mother হলো Parent এবং Female-এর subclass।
- একটি Child-এর কোনো parent আছে যে Father, এবং কোনো parent আছে যে Mother।
- hasParent হলো relatedTo-এর subrelation।

[UNCLEAR] Transcript-এ “instance is equivalent to in the video” বলা হয়েছে, যা garbled। Slide পরিষ্কারভাবে ABox assertions যেমন $\text{Father}(\text{Alex})$ দেয়।

---

# 7. Concept-as-Ball Ontology Embeddings

## 7.1 Definition

### Intuition

Concept-কে ball-shaped region হিসেবে represent করা। Individual-কে point হিসেবে represent করা। Individual point concept ball-এর ভিতরে থাকলে individual সেই concept-এর member।

### Formal representation

প্রতিটি concept একটি $n$-ball দিয়ে represent করা হয়:

- center:

$$
\mathbf{c} \in \mathbb{R}^n
$$

- radius:

$$
r \in \mathbb{R}
$$

প্রতিটি individual একটি point দিয়ে represent করা হয়:

$$
\mathbf{x} \in \mathbb{R}^n
$$

## 7.2 Membership এবং subsumption

### Membership

Individual concept-এর member যদি তার point ball-এর ভিতরে থাকে।

### Concept subsumption

$$
C \sqsubseteq D
$$

ball inclusion হিসেবে modeled হয়: $C$-এর ball $D$-এর ball-এর ভিতরে থাকে।

## 7.3 Limitation: concept intersection closed নয়

Key limitation:

$$
C \sqcap D
$$

দুটি concept-এর intersection। কিন্তু দুটি ball-এর intersection সাধারণত আর ball নয়; lens-shaped region হতে পারে।

তাই ball embeddings conjunction/intersection exactভাবে represent করতে struggle করে, বিশেষ করে ontology-তে যদি দরকার হয়:

$$
E \equiv C \sqcap D
$$

Slide সরাসরি বলেছে দুটি ball-এর intersection “no longer ball।”

---

# 8. Concept-as-Box Embeddings: Box2EL

## 8.1 Boxes কেন?

Boxes conjunction-এর closure problem solve করে: দুটি axis-aligned box-এর intersection আবার box। তাই $\mathcal{EL}^{++}$-তে concept intersections model করার জন্য boxes বেশি উপযুক্ত।

## 8.2 Box2EL

Slides অনুযায়ী **Box2EL** 2024 সালে proposed। এটি concepts এবং relations-কে boxes দিয়ে represent করে $\mathcal{EL}^{++}$ embed করে।

### Formal concept representation

প্রতিটি concept $C$ দুটি vector ব্যবহার করে একটি $n$-box হিসেবে represented হয়:

- lower-left corner:

$$
\mathbf{l}_C \in \mathbb{R}^n
$$

- upper-right corner:

$$
\mathbf{u}_C \in \mathbb{R}^n
$$

Box:

$$
\text{Box}(C)
=
\{
\mathbf{x}\in\mathbb{R}^n
\mid
\mathbf{l}_C \leq \mathbf{x} \leq \mathbf{u}_C
\}
$$

inequalities element-wise।

### Center এবং offset

Center:

$$
\mathbf{c}(C)
=
\frac{\mathbf{l}_C+\mathbf{u}_C}{2}
$$

Offset:

$$
\mathbf{o}(C)
=
\frac{\mathbf{u}_C-\mathbf{l}_C}{2}
$$

### Boxes কী model করতে পারে

- Individual membership: point inside box।
- Concept subsumption: এক box অন্য box-এর ভিতরে।
- Concept conjunction: box intersection।
- Intersection-এর সঙ্গে equivalence, যেমন:

$$
E \equiv C \sqcap D
$$

কারণ:

$$
\text{Box}(E)
=
\text{Box}(C)\cap\text{Box}(D)
$$

এটিও একটি box।

---

# 9. Relations-কে Boxes হিসেবে Represent করা

## 9.1 শুধু translation vectors ব্যবহার নয় কেন?

TransE relation translation vectors ব্যবহার করে, কিন্তু 1-to-N, N-to-1, N-to-N relations-এর limitation আছে। TransH এবং TransR relation-specific spaces-এ entities project করে এই limitation address করে। কিন্তু ontology embedding-এ concepts boxes/regions, শুধু points নয়, এবং relations concepts-এর মধ্যে existential restrictions-এ দেখা যায়।

## 9.2 Box2EL-এ relation representation

প্রতিটি relation $r$ দুটি box দিয়ে represented হয়:

- head box:

$$
\text{Head}(r)
$$

- tail box:

$$
\text{Tail}(r)
$$

Transcript বলেছে এই idea relation-এর domain এবং range-এর কাছাকাছি।

## 9.3 Bumps দিয়ে existential restrictions model করা

Axiom:

$$
C \sqsubseteq \exists r.D
$$

এখানে concepts $C$ এবং $D$ একে অন্যের সঙ্গে “interact” বা “bump” করে।

প্রতিটি concept-এর একটি bump vector থাকে:

$$
\text{Bump}(C),\quad \text{Bump}(D)
$$

Axiom hold করে যদি:

$$
\text{Box}(C)\oplus \text{Bump}(D)
\subseteq
\text{Head}(r)
$$

এবং:

$$
\text{Box}(D)\oplus \text{Bump}(C)
\subseteq
\text{Tail}(r)
$$

Intended operation হলো bump vector দিয়ে box translate করা:

$$
\text{Box}(C)\oplus \text{Bump}(D)
=
\{
\mathbf{x}+\text{Bump}(D)
\mid
\mathbf{x}\in \text{Box}(C)
\}
$$

[UNCLEAR / slide typo] Lecture slide text-এ এই definition-এর inconsistent version আছে, যেখানে $\mathbf{x}\in \text{Bump}(C)$ ব্যবহার করা হয়েছে; কিন্তু slide annotation বলেছে “Should be Box C।” উপরের corrected version সেই annotation অনুসরণ করে।

---

## 9.4 Worked visual example: family ontology representation

Family ontology figure দেখায়:

- Parent, Male, Female, Father, Mother, Child-এর concept boxes;
- hasParent এবং relatedTo-এর relation head/tail boxes;
- concept boxes থেকে relation boxes-এ connecting bump vectors।

### Figure interpret করা

এর জন্য:

$$
\text{Child} \sqsubseteq \exists \text{hasParent}.\text{Father}
$$

Box2EL check করে:

1. Father দ্বারা bumped Child hasParent-এর head box-এর ভিতরে পড়ে:

$$
\text{Box}(\text{Child})
\oplus
\text{Bump}(\text{Father})
\subseteq
\text{Head}(\text{hasParent})
$$

2. Child দ্বারা bumped Father hasParent-এর tail box-এর ভিতরে পড়ে:

$$
\text{Box}(\text{Father})
\oplus
\text{Bump}(\text{Child})
\subseteq
\text{Tail}(\text{hasParent})
$$

একইভাবে:

$$
\text{Child} \sqsubseteq \exists \text{hasParent}.\text{Mother}
$$

Transcript ব্যাখ্যা করে যে Child দ্বারা bumped Mother এবং Father hasParent-এর tail box-এর ভিতরে থাকা উচিত, এবং Father/Mother দ্বারা bumped Child hasParent-এর head box-এর ভিতরে থাকা উচিত।

### Figure-এ relation subsumption

এর জন্য:

$$
\text{hasParent} \sqsubseteq \text{relatedTo}
$$

hasParent-এর head box relatedTo-এর head box-এর ভিতরে থাকে, এবং hasParent-এর tail box relatedTo-এর tail box-এর ভিতরে থাকে। এটি geometrically relation subsumption model করে।

---

# 10. Box Distance এবং Concept Subsumption Score

## 10.1 Boxes-এর element-wise distance

### Definition

Boxes $A$ এবং $B$-এর জন্য:

$$
\mathbf{d}(A,B)
=
|\mathbf{c}(A)-\mathbf{c}(B)|
-
\mathbf{o}(A)
-
\mathbf{o}(B)
$$

এটি element-wise vector distance: প্রতিটি dimension সেই dimension-এর distance/overlap status দেয়।

### Intuition

প্রতিটি dimension-এর জন্য:

- positive value: সেই dimension-এ boxes-এর মধ্যে gap আছে;
- negative value: সেই dimension-এ boxes overlap করছে।

Transcript slide-এর 2D diagram ব্যাখ্যা করে:

- Horizontal dimension-এ center difference offsets-এর sum-এর চেয়ে বড়, তাই distance positive।
- Vertical dimension-এ center difference offsets-এর sum-এর চেয়ে ছোট, তাই distance negative, যা overlap reflect করে।

## 10.2 Subsumption loss

Concept subsumption / box inclusion:

$$
A \sqsubseteq B
$$

Box2EL একটি score/loss $\mathcal{L}_{\sqsubseteq}(A,B)$ ব্যবহার করে।

Slides দেয়:

$$
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
$$

যেখানে $\gamma$ margin hyperparameter।

Slide আরও দেয়:

$$
\mathbf{d}(A,B)+2\mathbf{o}(A)
=
|\mathbf{c}(A)-\mathbf{c}(B)|
+
\mathbf{o}(A)
-
\mathbf{o}(B)
$$

### Interpretation

Subsumption কম likely হলে score বেশি। যদি $A$, $B$-এর ভিতরে থাকে, max operation-এর পরে score 0 হয়। যদি $A$, $B$-এর বাইরে যায়, score positive হয় এবং loss-এ contribute করে। Transcript box $A$ move করার example দিয়েছে: $A$ partially outside $B$ হলে loss বাড়ে; $A$ আরও ভিতরে গেলে max operation loss 0 করে।

[UNCLEAR] $B=\emptyset$ হলে “otherwise” branch, বিশেষ করে $\mathbf{o}(A)_1+1$-এর ব্যবহার slide-এ আছে কিন্তু transcript garbled। Exam-relevant হলে re-listen করো।

---

# 11. Ontology Normalisation

## 11.1 Purpose

Box2EL training-এর আগে ontology sample forms-এ normalized হয়। Transcript বলেছে normalization axiom-এর form বদলায় কিন্তু ontology semantics বদলায় না।

## 11.2 ABox axioms-কে TBox axioms-এ convert করা

### Concept assertion

ABox assertion:

$$
C(a)
$$

TBox axiom হয়:

$$
\{a\} \sqsubseteq C
$$

### Role assertion

ABox assertion:

$$
r(a,b)
$$

হয়:

$$
\{a\} \sqsubseteq \exists r.\{b\}
$$

Slides note করেছে nominals-এর offset 0।

## 11.3 TBox axioms-কে সাতটি normal form-এ normalize করা

সব TBox axioms সাতটি normal form-এর axioms-এ transformed হয়। Slides বলেছে এটি **ELK**-এর মতো reasoners দিয়ে implemented, যা DL $\mathcal{EL}^{++}$-এর ontologies-এর জন্য high efficiency রাখে।

[UNCLEAR] Transcript “UK” বলেছে, কিন্তু slide পরিষ্কারভাবে **ELK** বলে।

---

# 12. সাতটি Normal Form-এর জন্য Box2EL Losses

Lecture সাতটি normal form-এর জন্য losses/scores দেয়। প্রথম পাঁচটি concept axioms; শেষ দুটি role axioms।

## 12.1 NF1: concept subsumption

Normal form:

$$
C \sqsubseteq D
$$

Loss:

$$
\mathcal{L}_1(C,D)
=
\mathcal{L}_{\sqsubseteq}
(
\text{Box}(C),\text{Box}(D)
)
$$

Meaning: $C$-এর box $D$-এর box-এর ভিতরে থাকা উচিত।

---

## 12.2 NF2: conjunction subsumption

Normal form:

$$
C \sqcap D \sqsubseteq E
$$

Loss:

$$
\mathcal{L}_2(C,D,E)
=
\mathcal{L}_{\sqsubseteq}
(
\text{Box}(C)\cap\text{Box}(D),
\text{Box}(E)
)
$$

Meaning: $C$ এবং $D$-এর intersection box $E$-এর box-এর ভিতরে থাকা উচিত।

---

## 12.3 NF3: right side-এ existential restriction

Normal form:

$$
C \sqsubseteq \exists r.D
$$

Loss:

$$
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
$$

Meaning:

- $D$ দ্বারা bumped $C$, $r$-এর head box-এর ভিতরে থাকা উচিত।
- $C$ দ্বারা bumped $D$, $r$-এর tail box-এর ভিতরে থাকা উচিত।

---

## 12.4 NF4: left side-এ existential restriction

Normal form:

$$
\exists r.C \sqsubseteq D
$$

Loss:

$$
\mathcal{L}_4(r,C,D)
=
\mathcal{L}_{\sqsubseteq}
(
\text{Head}(r)-\text{Bump}(C),
\text{Box}(D)
)
$$

Meaning: $r$ দ্বারা $C$-এর সঙ্গে connected relevant points $D$-এর ভিতরে contained হওয়া উচিত। Transcript explanation এখানে garbled, কিন্তু slide formula পরিষ্কার।

---

## 12.5 NF5: disjointness / empty intersection

Normal form:

$$
C \sqcap D \sqsubseteq \bot
$$

Loss:

$$
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
$$

Meaning: $C$ এবং $D$-এর overlap থাকা উচিত নয়। Transcript বলেছে এটি $C$ এবং $D$-এর intersection empty হওয়ার equivalent। কোনো dimension-এর distance negative হলে সেটি overlap reflect করে এবং loss-এ contribute করে।

---

## 12.6 NF6: role subsumption

Normal form:

$$
r \sqsubseteq s
$$

Loss:

$$
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
$$

Meaning: $r$-এর head এবং tail boxes যথাক্রমে $s$-এর corresponding boxes-এর ভিতরে থাকা উচিত।

---

## 12.7 NF7: role composition subsumption

Normal form:

$$
r_1 \circ r_2 \sqsubseteq s
$$

Loss:

$$
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
$$

Meaning: $r_1$-এর head box $s$-এর head box-এর ভিতরে থাকা উচিত, এবং $r_2$-এর tail box $s$-এর tail box-এর ভিতরে থাকা উচিত।

---

# 13. Box2EL-এ Negative Samples

## 13.1 TransE থেকে পার্থক্য

Box2EL উপরের positive axiom losses দিয়েই trainable; negative samples strictly required নয়। এটি TransE থেকে আলাদা, কারণ TransE training negative triples-এর উপর নির্ভর করে।

## 13.2 তবুও negative samples কেন ব্যবহার করা হয়?

Transcript বলেছে negative samples training efficiency/convergence improve করতে পারে।

## 13.3 Negative samples কীভাবে generate করা হয়

NF3 axioms-এর জন্য negative samples generate করা হয়:

$$
C \sqsubseteq \exists r.D
$$

এখানে $C$ বা $D$-এর কোনো একটিকে randomly selected different concept দিয়ে replace করা হয়।

Negative sample:

$$
C \not\sqsubseteq \exists r.D
$$

## 13.4 Negative-sample loss

Slide দেয়:

$$
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
$$

$$
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
$$

যেখানে:

$$
\mu(A,B)
=
\left\|
\max
\{
0,
\mathbf{d}(A,B)+\gamma
\}
\right\|
$$

এবং:

$$
\mathbf{d}(A,B)
=
|\mathbf{c}(A)-\mathbf{c}(B)|
-
\mathbf{o}(A)
-
\mathbf{o}(B)
$$

$\delta$ হলো hyperparameter, যা negative samples-কে model কতটা unlikely বানাবে তা control করে।

### Transcript থেকে interpretation

- দুটি box overlap করলে $\mu=0$, তাই loss থাকে।
- তারা সরে গিয়ে gap তৈরি করলে $\mu>0$, এবং loss কমে।
- Loss প্রায় $\mu=\delta$-এ minimized হয়।
- Boxes খুব বেশি দূরে সরে গিয়ে $\mu>\delta$ হলে loss আবার বাড়ে।

---

## 13.5 Box2EL training

Box2EL উপরের losses-এর ভিত্তিতে embeddings optimize করতে stochastic gradient descent ব্যবহার করে।

---

# 14. KG/Ontology Embedding Paradigms

Lecture এরপর KG/ontology embeddings-এর paradigms compare করে।

## 14.1 End-to-end paradigm

Examples:

- TransE
- Box2EL

Pipeline:

1. Knowledge-এর likelihood model করার জন্য score functions define করা।
2. সেই scores-এর ভিত্তিতে loss functions define করা।
3. Losses minimize করে embeddings learn করা।

Lecture-এর earlier models এই paradigm ব্যবহার করে।

---

## 14.2 Sequence learning paradigm

### Intuition

KG/ontology-কে sentence-এর মতো sequences-এ convert করে word embedding model train করা।

### Pipeline

1. KG বা ontology থেকে entities-এর sentences/sequences extract করা।
2. এই sequences entities-এর মধ্যে মূলত correlations preserve করে।
3. এখানে “Entity” অন্তর্ভুক্ত করে:
   - individuals
   - concepts
   - roles/relations
4. Sequences-এর উপর Word2Vec-এর মতো word embedding model train করা।

Transcript বলেছে random walk দিয়ে generated হলে sequences হলো graph-এর paths। Axioms-ও syntax transformation দিয়ে directly sequences-এ serialized হতে পারে।

---

## 14.3 Graph propagation model paradigm

### Intuition

Graph features ব্যবহার করে entity embeddings learn করা, যেমন graph neural networks দিয়ে।

### Lecture connection

Transcript আগের material-এর সঙ্গে সরাসরি connect করে:

- Week 1-এ যেমন বলা হয়েছে, relational facts দিয়ে গঠিত knowledge graph নিজেই একটি graph।
- Logical axioms দিয়ে গঠিত ontology সরাসরি graph নয়, কিন্তু additional processing দিয়ে graph-এ transform করা যায়।
- Transform করার পর graph propagation models graph features embeddings হিসেবে learn করতে পারে।

### Slides-এর diagram

Page 45 diagram দেখায়:

1. Ontology axioms যেমন:

$$
\text{Father} \sqsubseteq \text{Male}
$$

$$
\text{Father} \sqsubseteq \text{Male}\sqcap\text{Parent}
$$

$$
\text{Father}(\text{Alex})
$$

2. Ontology graph-এ conversion, যেখানে nodes যেমন:
   - Male
   - Parent
   - Father
   - Alex
   - literal label “Alexander Hamilton”

3. দুটি possible output:
   - graph propagation model, যেমন GNN, যা entity embeddings produce করে;
   - graph-to-sequences, যেমন random walk, plus axiom-to-sequence serialization, যা sequence learning-এর জন্য sequences produce করে।

---

# 15. Ontology Annotations এবং Text-Aware Embedding

## 15.1 Text-aware ontology embedding কেন?

Earlier methods যেমন TransE এবং Box2EL formally defined semantics embed করে। কিন্তু ontologies-তে textual information-ও থাকে, যেমন:

- concept names
- relation names
- natural language descriptions
- definitions
- comments

Lecture OWL2Vec* introduce করে, যা formal semantics এবং textual annotations দুটোই ব্যবহার করে।

---

## 15.2 Example: FoodOn ontology annotation

Slide edamame নিয়ে FoodOn example দেয়।

### Formal semantic part

Concept:

$$
\text{obo:FOODON\_00002809}
$$

label সহ:

$$
\text{“edamame”}
$$

Formal axiom:

$$
\text{obo:FOODON\_00002809}
\quad
\text{rdfs:subClassOf}
\quad
\text{ObjectSomeValuesFrom}
(
\text{obo:RO\_0001000},
\text{obo:FOODON\_03411347}
)
$$

Relation-এর label:

$$
\text{“derives from”}
$$

Filler concept-এর label:

$$
\text{“plant”}
$$

### Textual annotation part

এছাড়াও natural language definition আছে:

> “Edamame is a preparation of immature soybean in their pods, or with the pod removed …”

এটি annotation property দিয়ে attached:

$$
\text{obo:IAO\_0000115}
$$

label সহ:

$$
\text{“definition”}
$$

Lecturer **formally defined knowledge** এবং labels/definitions-এর মতো **literal/textual annotations** আলাদা করেছেন।

---

# 16. OWL2Vec*

## 16.1 Definition

OWL2Vec* sequence learning paradigm অনুসরণকারী text-aware ontology embedding method। এটি OWL ontologies embed করে ব্যবহার করে:

- formal axioms/semantics;
- textual annotations।

Slide বলেছে OWL2Vec* 2021 সালে proposed।

[UNCLEAR] Transcript “proposed in 2001” বলেছে, কিন্তু slide বলেছে **2021**।

---

## 16.2 Overall OWL2Vec* framework

Slide framework bottom to top:

1. OWL ontology and reasoning
2. OWL ontology-কে RDF graph-এ transform করা
3. Generate করা:
   - structure document: entity IRIs-এর sentences
   - lexical document: words-এর sentences
   - combined document: entity IRIs এবং words-এর sentences
4. Language model / word embedding model train করা
5. Output:
   - IRI vector
   - word vector
   - IRI vector এবং/অথবা word vector average দিয়ে entity embedding

---

## 16.3 Step 1: OWL ontology থেকে RDF graph

OWL2Vec* প্রথমে OWL ontology-কে RDF graph-এ transform করে। Reasoning, যেমন HermiT ব্যবহার করে, enabled হতে পারে।

### Option 1: W3C OWL to RDF graph mapping

FoodOn axiom:

$$
\text{obo:FOODON\_00002809}
\sqsubseteq
\exists \text{obo:RO\_0001000}.\text{obo:FOODON\_03411347}
$$

এর জন্য slide RDF triples দেয়:

$$
\langle
\text{obo:FOODON\_00002809},
\text{rdfs:subClassOf},
\_:x
\rangle
$$

$$
\langle
\_:x,
\text{rdf:type},
\text{owl:Restriction}
\rangle
$$

$$
\langle
\_:x,
\text{owl:OnProperty},
\text{obo:RO\_0001000}
\rangle
$$

$$
\langle
\_:x,
\text{owl:SomeValueFrom},
\text{obo:FOODON\_03411347}
\rangle
$$

Blank node $\_:x$ existential restriction represent করে। পরের triples তার semantics define করে: এটি OWL restriction, property $RO\_0001000$ আছে, এবং filler $FOODON\_03411347$।

### Option 2: Projection rules

Slide আরও একটি simpler projected triple দেয়:

$$
\langle
\text{obo:FOODON\_00002809},
\text{rdfs:subClassOf},
\text{obo:FOODON\_03411347}
\rangle
$$

Transcript বলেছে projection rules simple এবং straightforward, কিন্তু কিছু semantics lose বা shift করে।

[UNCLEAR] Slide-এর detailed projection-rule table parsed content-এ খুব ছোট/garbled। Example projected triple পরিষ্কার, কিন্তু exact rules দরকার হলে slide recording re-check করো।

---

## 16.4 Step 2: Structure document — entity IRIs-এর sentences

OWL2Vec* entities-এর sequences নিয়ে structure document generate করে।

এই sequences-এর sources:

1. RDF graph-এর উপর random walks।
2. Weisfeiler-Lehman subtree kernels সহ random walks।
3. Axioms serialized into sequences, যেমন OWL Manchester syntax দিয়ে।

### Example random-walk sequence

$$
(
\text{vc:FOOD-4001},
\text{vc:hasNutrient},
\text{vc:VitaminC\_100},
\text{vc:amountNutrient}
)
$$

### Example WL subtree-kernel sequence

$$
(
\text{vc:FOOD-4001},
\text{rdf:type},
\text{kernel\_id1\_md5},
\text{rdfs:subClassOf},
\text{kernel\_id2\_md5}
)
$$

### Example axiom sequence

FoodOn existential restriction থেকে:

$$
(
\text{obo:FOODON\_00002809},
\text{subClassOf},
\text{obo:RO\_0001000},
\text{some},
\text{obo:FOODON\_03411347}
)
$$

Transcript বলেছে random walk graph-এ paths generate করে, এবং সেই paths entity sequences হয়। Axioms-ও syntax transformation দিয়ে directly sequences-এ serialize করা যায়।

---

## 16.5 Step 3: Lexical document — words-এর sentences

OWL2Vec* entity sequences-কে word sequences-এ convert করে এবং annotation properties থেকে text extract করে lexical document বানায়।

### Method A: structure document থেকে transform

Example structure sequence:

$$
(
\text{vc:FOOD-4001},
\text{vc:hasNutrient},
\text{vc:VitaminC\_100},
\text{vc:amountNutrient}
)
$$

lexical sequence হয়:

$$
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
$$

### Method B: annotation properties থেকে extract

Edamame definition থেকে:

$$
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
$$

Transcript বলেছে OWL2Vec* labels, definitions, comments extract করে word sequences তৈরি করে।

---

## 16.6 Step 4: Combined document — words এবং IRIs-এর sentences

OWL2Vec* একটি combined document-ও তৈরি করে যেখানে entity IRIs এবং words মেশানো থাকে।

### Method

প্রতিটি entity sequence-এ একটি entity-কে তার words দিয়ে replace করা। Slide mentions:

- random selection
- traversal

### Example

Original entity sequence:

$$
(
\text{vc:FOOD-4001},
\text{vc:hasNutrient},
\text{vc:VitaminC\_100},
\text{vc:amountNutrient}
)
$$

Combined sequence:

$$
(
\text{vc:FOOD-4001},
\text{“has”},
\text{“nutrient”},
\text{“vitamin”},
\text{“c”},
\text{“amount”},
\text{“nutrient”}
)
$$

Transcript বলেছে এটি entities এবং words-এর মধ্যে correlations তৈরি করে, ফলে textual semantics দিয়ে entity embeddings enrich হয়।

---

## 16.7 Step 5: Word embedding model train করা

Slide বলেছে OWL2Vec* word embedding model ব্যবহার করে, specifically CBOW।

Training documents:

- structure document
- lexical document
- combined document

Optional pre-training:

- text corpus, যেমন Wikipedia dump

Output:

- URI/IRI vector
- word vector
- entity vector as IRI vector and/or average word vector

Transcript জোর দিয়ে বলেছে learned vocabulary-তে শুধু words নয়, entities-ও থাকে, তাই model দুটিরই vectors output করতে পারে।

---

# 17. Revision-এর জন্য preserved worked examples

## 17.1 One-hot vocabulary example

Vocabulary:

$$
(\text{cat}, \text{mat}, \text{on}, \text{sat}, \text{the})
$$

Vectors:

$$
\text{cat}=[1,0,0,0,0]
$$

$$
\text{mat}=[0,1,0,0,0]
$$

$$
\text{on}=[0,0,1,0,0]
$$

$$
\text{sat}=[0,0,0,1,0]
$$

$$
\text{the}=[0,0,0,0,1]
$$

“The cat sat on the mat” sentence matrix: $6\times 5$।

---

## 17.2 Word analogy example

$$
V(\text{queen})-V(\text{king})
\approx
V(\text{mother})-V(\text{father})
$$

Meaning: vector differences semantic relationships encode করতে পারে।

---

## 17.3 TransE triple example

Positive triple:

$$
\langle \text{London},\text{CapitalOf},\text{The UK}\rangle
$$

Perfect embedding:

$$
\mathbf{London}+\mathbf{CapitalOf}
=
\mathbf{TheUK}
$$

Actual embedding:

$$
\mathbf{London}+\mathbf{CapitalOf}
$$

হয়তো exactly equal নয়:

$$
\mathbf{TheUK}
$$

Distance-ই score।

---

## 17.4 TransE negative sampling example

Positive:

$$
\langle \text{London},\text{CapitalOf},\text{The UK}\rangle
$$

Corrupt head:

$$
\langle \text{Manchester},\text{CapitalOf},\text{The UK}\rangle
$$

Corrupt tail:

$$
\langle \text{London},\text{CapitalOf},\text{France}\rangle
$$

Potential false-negative problem: KG incomplete হওয়ায় generated corrupted triple আসলে true হতে পারে।

---

## 17.5 Relation composition example

Facts:

$$
\langle A,\text{BrotherOf},B\rangle
$$

$$
\langle B,\text{FatherOf},C\rangle
$$

$$
\langle A,\text{UncleOf},C\rangle
$$

Embedding relation:

$$
\mathbf{r}_{\text{UncleOf}}
=
\mathbf{r}_{\text{BrotherOf}}
+
\mathbf{r}_{\text{FatherOf}}
$$

---

## 17.6 Symmetric relation derivation

উভয়ের জন্য:

$$
\langle h,r,t\rangle
$$

and:

$$
\langle t,r,h\rangle
$$

perfect TransE requires:

$$
\mathbf{h}+\mathbf{r}=\mathbf{t}
$$

$$
\mathbf{t}+\mathbf{r}=\mathbf{h}
$$

যা imply করে:

$$
\mathbf{r}=0,\quad \mathbf{h}=\mathbf{t}
$$

কিন্তু entities আলাদা হওয়ায় contradiction।

---

## 17.7 1-to-N relation derivation

For:

$$
\langle h,r,t\rangle
$$

$$
\langle h,r,t'\rangle
$$

perfect TransE requires:

$$
\mathbf{h}+\mathbf{r}=\mathbf{t}
$$

$$
\mathbf{h}+\mathbf{r}=\mathbf{t'}
$$

therefore:

$$
\mathbf{t}=\mathbf{t'}
$$

যদি $t$ এবং $t'$ আলাদা entities হয়, contradiction।

---

## 17.8 Family ontology example

TBox:

$$
\text{Father} \sqsubseteq \text{Parent}\sqcap\text{Male}
$$

$$
\text{Mother} \sqsubseteq \text{Parent}\sqcap\text{Female}
$$

$$
\text{Child} \sqsubseteq \exists\text{hasParent}.\text{Father}
$$

$$
\text{Child} \sqsubseteq \exists\text{hasParent}.\text{Mother}
$$

$$
\text{hasParent} \sqsubseteq \text{relatedTo}
$$

ABox:

$$
\text{Father}(\text{Alex})
$$

$$
\text{Child}(\text{Bob})
$$

$$
\text{hasParent}(\text{Bob},\text{Alex})
$$

Geometric Box2EL representation:

- Father, Mother, Parent, Male, Female, Child boxes।
- hasParent এবং relatedTo-এর head/tail boxes আছে।
- hasParent head/tail boxes relatedTo head/tail boxes-এর ভিতরে থাকে।
- Bump vectors existential restrictions model করে।

---

## 17.9 OWL2Vec* FoodOn example

Formal axiom:

$$
\text{edamame}
\sqsubseteq
\exists \text{derivesFrom}.\text{plant}
$$

Blank node সহ RDF mapping:

$$
\langle \text{edamame},\text{rdfs:subClassOf},\_:x\rangle
$$

$$
\langle \_:x,\text{rdf:type},\text{owl:Restriction}\rangle
$$

$$
\langle \_:x,\text{owl:OnProperty},\text{derivesFrom}\rangle
$$

$$
\langle \_:x,\text{owl:SomeValueFrom},\text{plant}\rangle
$$

Textual annotation:

$$
\text{“Edamame is a preparation of immature soybean …”}
$$

OWL2Vec* দুটোই ব্যবহার করে।

---

# 18. Exam Flags / High-Value Revision Points

## Explicit exam statements

Supplied slides/transcripts-এ explicit “this will be on the exam,” “common mistake,” বা equivalent exam statement পাওয়া যায়নি।

## “You should know / expected prior knowledge” flag

Lecturer বলেছেন শিক্ষার্থীদের $\mathcal{EL}^{++}$-এর features আগের videos এবং/অথবা আরেক ontology reasoning unit-এ শেখা থাকার কথা। নিচেরগুলো high-value revision content হিসেবে ধরো:

- $\mathcal{EL}^{++}$ constructors:

$$
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
$$

- role composition/subsumption:

$$
r_1\circ\cdots\circ r_k\sqsubseteq r
$$

- TBox/ABox distinction
- ABox-to-TBox normalization
- Box2EL-এ ব্যবহৃত সাতটি normal forms

## Lecture depth-এর কারণে likely high-value

এগুলো formulas, derivations, বা worked examples সহ cover করা হয়েছে:

1. TransE score এবং loss।
2. Negative sampling এবং তার weakness।
3. TransE কেন relation composition model করতে পারে।
4. TransE কেন symmetric এবং 1-to-N relations-এ fail করে।
5. TransH এবং TransR projections।
6. Ball বনাম box concept representations।
7. Box2EL relation head/tail boxes এবং bump vectors।
8. Box distance এবং subsumption loss।
9. সাতটি normal forms এবং তাদের losses।
10. OWL2Vec* pipeline: RDF graph → structure/lexical/combined documents → CBOW embeddings।

---

# 19. Earlier Material এবং Broader Applications-এর সঙ্গে Connections

## Text embeddings-এর সঙ্গে connection

Lecture বলেছে KG এবং ontology embedding research আংশিকভাবে texts-এর general semantic embeddings থেকে originate করে। তাই week শুরু হয় one-hot vectors এবং Word2Vec দিয়ে, তারপর KG/ontology embeddings-এ যায়।

## Week 1-এর সঙ্গে connection

Transcript বলেছে relational facts দিয়ে গঠিত KG নিজেই একটি graph, যেমন Week 1-এ introduced। Ontologies সরাসরি graph নয়, কারণ এগুলো logical axioms দিয়ে গঠিত; কিন্তু graph propagation models বা random-walk sequence learning-এর জন্য এগুলো graph-এ transform করা যায়।

## Neural-symbolic integration-এর সঙ্গে connection

পুরো motivation হলো symbolic knowledge-কে numerical downstream tasks-এ support করতে দেওয়া, যেমন machine learning, data mining, statistical analysis।

## Reasoning-এর সঙ্গে connection

Embedding approximate বা uncertain reasoning support করে:

- incomplete KG completion
- missing knowledge prediction
- fuzzy representation
- conceptual induction
- complex reasoning approximation

---

# 20. Re-listen করার মতো Unclear Sections

1. **“Native vegetation learning / not implantation learning”**  
   Transcript garbled; slide context অনুযায়ী এটি **representation learning / semantic embedding**।

2. **One-hot “A15 dimensional vector”**  
   Transcript “A15” বলেছে, কিন্তু slide example 5-word vocabulary, তাই vectors 5-dimensional। Lecturer অতিরিক্ত example দিয়ে থাকলে শুধু তখন re-listen করো।

3. **TransE name transcription**  
   Transcript “Chatty Cathy,” “Chancey,” “Chelsea,” এবং “chassis” ব্যবহার করেছে। Slides অনুযায়ী সবই **TransE**।

4. **TransH এবং TransR names**  
   Transcript “Charles H,” “Trans Arch,” “chess R,” ইত্যাদি ব্যবহার করেছে। Slides পরিষ্কারভাবে **TransH** এবং **TransR** identify করে।

5. **L2 distance formula**  
   Slide লিখেছে:

   

$$
\sum_i(a_i-b_i)^2
$$

   কিন্তু transcript straight-line Euclidean distance বলে। Lecturer squared L2 নাকি ordinary Euclidean norm বোঝাতে চেয়েছেন তা confirm করতে re-listen করো।

6. **$\mathcal{EL}^{++}$ profile statement**  
   Transcript “corresponds to our two year profile” ধরনের কিছু বলেছে। Slides clarify করে না। Course exact OWL profile terminology expect করলে re-listen করো।

7. **Box2EL relation translation definition**  
   Slide formula:

   

$$
\text{Box}(C)\oplus\text{Bump}(D)
$$

   মনে হয় $\mathbf{x}\in \text{Bump}(C)$ ব্যবহার করেছে, কিন্তু slide annotation বলে “Should be Box C।” ব্যবহার করো:

   

$$
\{\mathbf{x}+\text{Bump}(D)\mid \mathbf{x}\in\text{Box}(C)\}
$$

   দরকার হলে recording/slide re-check করো।

8. **Subsumption loss যখন $B=\emptyset$**  
   Formula branch:

   

$$
\max\{0,\mathbf{o}(A)_1+1\}
$$

   slide-এ আছে, কিন্তু transcript explanation garbled।

9. **NF4 explanation**  
   Slide formula পরিষ্কার:

   

$$
\mathcal{L}_4(r,C,D)
   =
   \mathcal{L}_{\sqsubseteq}
   (
   \text{Head}(r)-\text{Bump}(C),
   \text{Box}(D)
   )
$$

   কিন্তু spoken explanation parse করা কঠিন।

10. **OWL2Vec* year**  
    Transcript “2001” বলেছে, slide বলেছে **2021**। 2021 ব্যবহার করো।

11. **OWL2Vec*-এর projection-rule table**  
    Slide-এ projection rules-এর table আছে, কিন্তু parsed text-এ অনেক অংশ ছোট/garbled। Example projected triple পরিষ্কার; exact rules দরকার হলে visual slide re-check করো।

12. **“Oil vector style / Oita star / oil to bag the storm”**  
    এগুলো transcript errors for **OWL2Vec\***।
