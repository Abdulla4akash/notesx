---
subject: COMP64702
chapter: 2
title: "Word2Vec, RNN, Transformer"
language: bn
---

# অধ্যয়ন নোট: word2vec, RNNs, এবং Transformers

**উৎস:** `3_wor2vec_RNN_Transformer.pdf` স্লাইড ডেক।  
**ট্রান্সক্রিপ্টের অবস্থা:** এই কথোপকথনে কোনো ট্রান্সক্রিপ্ট টেক্সট দেওয়া হয়নি, তাই এই নোটগুলো শুধু স্লাইড ও দৃশ্যমান ডায়াগ্রামের ওপর ভিত্তি করে তৈরি। ট্রান্সক্রিপ্ট-নির্ভর বিস্তারিত অংশগুলো **[TRANSCRIPT MISSING]** অথবা **[UNCLEAR]** দিয়ে চিহ্নিত করা হয়েছে।  
**কোর্স:** সরবরাহ করা হয়নি।  
**লেকচার টপিক:** word2vec, RNNs, এবং Transformers।  
**লেকচারার:** Chenghua Lin, Department of Computer Science, University of Manchester।

---

## বিষয় ও পরিসর

এই লেকচারটি ভাষা মডেল এবং শব্দ-প্রতিনিধিত্বের বিবর্তন নিয়ে: symbolic resources এবং one-hot/count-based representation থেকে শুরু করে **word2vec** ও **RNN language models**, তারপর self-attention-ভিত্তিক **Transformer architectures** পর্যন্ত।

এটি NLP/language modelling এবং representation learning-এর অংশ। লেকচারটি ব্যাখ্যা করে কেন আধুনিক মডেলগুলো discrete symbols ও sequential recurrence থেকে dense embeddings এবং attention-based sequence modelling-এর দিকে সরে এসেছে।

---

# 1. ভাষা মডেলের বিবর্তন

স্লাইড ডেকটি লেকচারকে নিচের অগ্রগতির কাঠামোয় দেখায়:

$$
\text{N-Gram} \rightarrow \text{Word2Vec} \rightarrow \text{Recurrent} \rightarrow \text{Transformer} \rightarrow ???
$$

লেকচারের বিভিন্ন অংশে যাওয়ার সময় এই progression কয়েকবার দেখানো হয়েছে।

- প্রথম ফোকাস: **Word2Vec**।
- দ্বিতীয় ফোকাস: **Recurrent** language models, বিশেষ করে RNNs।
- তৃতীয় ফোকাস: **Transformer** language models।
- শেষ বক্স: **???**।

**[UNCLEAR]** স্লাইডে শেষের “???” কী বোঝায় তা ব্যাখ্যা করা হয়নি। লেকচারার Transformers-এর পরে কী আসতে পারে তা আলোচনা করলে রেকর্ডিং আবার শুনে দেখা দরকার।

**আগের উপাদানের সঙ্গে সংযোগ:**  
পরে লেকচারে RNN language models-কে **n-gram language models**-এর সঙ্গে তুলনা করা হয়েছে। N-gram models শুধু নির্দিষ্ট দৈর্ঘ্যের পূর্ববর্তী context, অর্থাৎ $n-1$ tokens ব্যবহার করে; অন্যদিকে RNN hidden states সব পূর্ববর্তী শব্দের তথ্য অন্তর্ভুক্ত করতে পারে।

---

# 2. শব্দার্থ উপস্থাপন

## 2.1 Symbolic lexical resources

### স্বজ্ঞা / intuition

প্রচলিত NLP-তে শব্দের অর্থ উপস্থাপনের জন্য **symbolic lexical resources**, যেমন WordNet, ব্যবহার করা হতো। এই resources-গুলো শব্দগুলোর মধ্যে explicit, human-curated relations দিয়ে অর্থ সংজ্ঞায়িত করে।

### স্লাইডের formal / precise description

শব্দার্থ explicit lexical relations দিয়ে উপস্থাপিত হয়, যেমন:

- **Synonymy:** কাছাকাছি অর্থের শব্দ।
  - স্লাইড উদাহরণ: `dog ↔ ...`
  - **[UNCLEAR]** synonymy উদাহরণে দ্বিতীয় term-টি স্লাইড টেক্সটে অনুপস্থিত বা পড়া যাচ্ছে না।
- **Hypernymy:** “is-a” বা category relation।
  - স্লাইড উদাহরণ:

$$
\text{dog} \rightarrow \text{animal}
$$

স্লাইডে এই অর্থ-দৃষ্টিভঙ্গিকে বলা হয়েছে:

- **discrete**
- **manually defined**
- **relational**

### সীমাবদ্ধতা

Symbolic lexical resources-এর তিনটি প্রধান সীমাবদ্ধতা আছে:

1. **Static and incomplete**
   - নতুন শব্দ, নতুন sense, বা ব্যবহারগত পরিবর্তনের সঙ্গে তাল মেলাতে পারে না।

2. **Expensive to maintain**
   - expert human annotation প্রয়োজন হয়।

3. **Limited notion of similarity**
   - graded similarity বোঝানোর স্বাভাবিক ব্যবস্থা নেই।
   - usage-based meaning differences ধরতে পারে না।

---

## 2.2 Discrete representations: one-hot encoding

### সংজ্ঞা

একটি **discrete word representation** প্রতিটি শব্দকে atomic symbol হিসেবে ধরে। One-hot encoding-এ প্রতিটি শব্দ এমন একটি vector দিয়ে উপস্থাপিত হয়, যেখানে ঠিক একটি non-zero entry থাকে।

### স্লাইড উদাহরণ

স্লাইডে **motel** এবং **hotel**-এর উদাহরণ দেওয়া হয়েছে:

$$
\text{motel} = [0,0,0,0,0,1,0,0,0,\ldots,0,0]
$$

$$
\text{hotel} = [0,0,1,0,0,0,0,0,0,\ldots,0,0]
$$

**Vocabulary size equals the dimensionality** of the vector space — অর্থাৎ vocabulary size যত, vector space-এর dimensionality-ও তত। Vocabulary খুব বড় হলে one-hot vectors-ও খুব high-dimensional হয়।

### মূল সীমাবদ্ধতা

সব আলাদা শব্দকে সমানভাবে dissimilar ধরা হয়। স্লাইডের উদাহরণ:

$$
\cos(\text{motel}, \text{hotel}) = 0
$$

অতএব **motel** এবং **hotel** semantically related হলেও তাদের one-hot vectors orthogonal।

> **পরীক্ষা সংকেত — key limitation:** one-hot vectors graded semantic similarity encode করে না।

---

## 2.3 Distributional semantics

### স্বজ্ঞা / intuition

লেকচারটি symbolic meaning থেকে **distributional meaning**-এ যায়: কোনো শব্দের অর্থ সেই শব্দটি যে contexts-এ দেখা যায় সেগুলো থেকে অনুমান করা হয়।

স্লাইডে J. R. Firth-এর quote আছে:

> “You shall know a word by the company it keeps.”

### উদাহরণ: “bank”

স্লাইডে **bank** শব্দের দুটি ব্যবহার contrast করা হয়েছে:

- **financial** sense: এমন financial institution যা public থেকে deposits গ্রহণ করে এবং credit সৃষ্টি করে।
- **geographical** sense: কোনো body of water-এর পাশে থাকা land।

একই শব্দ, ভিন্ন context, ভিন্ন অর্থ।

### সংজ্ঞা

**Distributional semantics** contextual usage-এর ওপর ভিত্তি করে অর্থকে statistically represent করে।

স্লাইডের key points:

- Word meaning contextual usage থেকে inferred হয়।
- Same word + different contexts $\rightarrow$ different meanings।
- Meaning symbolic না হয়ে **statistical** হয়ে যায়।

---

## 2.4 Context-based word representations

### মূল ধারণা

একটি **word–context co-occurrence matrix** তৈরি করা হয়।

- Rows = target words।
- Columns = context words।
- Values = frequency counts।
- প্রতিটি শব্দকে তার আশেপাশে occurrence হওয়া শব্দগুলোর মাধ্যমে represent করা হয়।

### Worked example: co-occurrence matrix

স্লাইডে vocabulary হিসেবে ব্যবহার করা হয়েছে:

$$
\{I,\ like,\ enjoy,\ deep,\ learning,\ NLP,\ flying,\ .\}
$$

| target / context | I | like | enjoy | deep | learning | NLP | flying | . |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| I | 0 | 2 | 1 | 0 | 0 | 0 | 0 | 0 |
| like | 2 | 0 | 0 | 1 | 0 | 1 | 0 | 0 |
| enjoy | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| deep | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |
| learning | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 1 |
| NLP | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| flying | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 |
| . | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 0 |

### Raw co-occurrence counts-এর সমস্যা

Raw co-occurrence matrices সাধারণত:

- অত্যন্ত high-dimensional,
- sparse এবং memory-intensive,
- corpus size ও word-frequency effects-এর প্রতি sensitive।

---

# 3. Low-dimensional dense word embeddings

## 3.1 Dense word embeddings

### সংজ্ঞা

একটি **dense word embedding** প্রতিটি শব্দকে fixed-dimensional space-এ একটি dense vector হিসেবে represent করে।

স্লাইডে বলা হয়েছে word2vec embeddings সাধারণত **100–300 dimensions** ব্যবহার করে এবং data থেকে automatically learned হয়।

### word2vec-এর core idea

Raw co-occurrence counts explicitভাবে store না করে word2vec একটি **prediction task**-এর মাধ্যমে word embeddings শেখে:

- context predict করে word embeddings শেখা,
- explicit co-occurrence counts-কে prediction দিয়ে replace করা।

> **পরীক্ষা সংকেত — word2vec-এর core idea:** word2vec distributional semantics-কে predictive learning problem-এ পরিণত করে।

---

## 3.2 word2vec architectures

লেকচারে word2vec-এর দুটি training objective আছে:

1. **CBOW:** context থেকে target word predict করা।
2. **Skip-gram:** target word থেকে context words predict করা।

---

## 3.3 Continuous Bag-of-Words, CBOW

### স্বজ্ঞা / intuition

CBOW প্রশ্ন করে:

> Given the context, what word fits here?

### সংজ্ঞা

CBOW surrounding context words-কে input হিসেবে ব্যবহার করে এবং target word-কে output হিসেবে predict করে।

Context vectors **summed or averaged** করা হয়। স্লাইডে বলা হয়েছে CBOW frequent words-এর জন্য efficient।

### Worked example

Sentence:

$$
\text{eat an apple every day}
$$

CBOW task:

$$
\{\text{eat}, \text{an}, \text{every}, \text{day}\}
\rightarrow
\text{apple}
$$

অতএব model surrounding words থেকে **apple** predict করে।

### Training objective

স্লাইডে CBOW objective দেওয়া হয়েছে:

$$
\prod_{w \in C} P(w \mid \text{context}(w))
$$

Logarithm নিলে পাওয়া যায়:

$$
\mathcal{L}
=
\sum_{w \in C}
\log P(w \mid \text{context}(w))
$$

### দেখানো derivation step

লেকচার স্লাইডে product থেকে log-sum-এ যাওয়ার ধাপ দেখানো হয়েছে:

$$
\log \prod_{w \in C} P(w \mid \text{context}(w))
=
\sum_{w \in C} \log P(w \mid \text{context}(w))
$$

**[UNCLEAR]** স্লাইডে full probability parameterisation, optimisation details, অথবা negative sampling / hierarchical softmax details দেওয়া হয়নি। লেকচারার এগুলো ব্যাখ্যা করলে রেকর্ডিং আবার শুনে দেখা দরকার।

---

## 3.4 Skip-gram

### স্বজ্ঞা / intuition

Skip-gram প্রশ্ন করে:

> Given this word, what words tend to appear nearby?

### সংজ্ঞা

Skip-gram target word-কে input হিসেবে ব্যবহার করে এবং surrounding context words-কে output হিসেবে predict করে।

স্লাইডে উল্লেখ করা হয়েছে:

- input = target word,
- output = surrounding context words,
- প্রতি word থেকে multiple training pairs তৈরি করে,
- rare words-এর জন্য প্রায়ই CBOW-এর চেয়ে ভালো perform করে।

### Worked example

Sentence:

$$
\text{eat an apple every day}
$$

Skip-gram task:

$$
\text{apple}
\rightarrow
\{\text{eat}, \text{an}, \text{every}, \text{day}\}
$$

এটি multiple target-context prediction pairs হিসেবে ধরা যায়:

$$
(\text{apple}, \text{eat}),\quad
(\text{apple}, \text{an}),\quad
(\text{apple}, \text{every}),\quad
(\text{apple}, \text{day})
$$

> **পরীক্ষা সংকেত — CBOW vs Skip-gram:** CBOW context থেকে centre word predict করে; Skip-gram centre word থেকে context predict করে।

---

## 3.5 Word embeddings-এর applications

স্লাইডে নিচের applications তালিকাভুক্ত করা হয়েছে:

- dependency parsing,
- named entity recognition,
- document classification,
- sentiment analysis,
- paraphrase detection,
- word clustering,
- machine translation।

---

## 3.6 Word analogies

### সংজ্ঞা

Word analogies embedding space-এ **linear regularities** পরীক্ষা করে।

মূল ধারণা হলো words-এর সম্পর্ক **vector offsets** হিসেবে capture করা যায়। স্লাইডে এই empirical property-টি Mikolov et al. (2014)-এর সঙ্গে সম্পর্কিত করা হয়েছে।

### Formalism

একটি analogy:

$$
a : b :: c : d
$$

স্লাইডে nearest-neighbour style formula দেওয়া হয়েছে:

$$
d
=
\arg\max_z
\frac{
(u_b - u_a + u_c)^\top u_z
}{
\|u_b - u_a + u_c\| \, \|u_z\|
}
$$

এর মানে:

1. একটি query vector তৈরি করা:

$$
u_b - u_a + u_c
$$

2. ওই query vector-এর সঙ্গে maximum cosine similarity আছে এমন word vector $u_z$ খুঁজে বের করা।

### Worked example: `man : woman :: king : ?`

স্লাইডে দেখানো হয়েছে:

$$
\text{king} - \text{man} + \text{woman} = \text{queen}
$$

দেওয়া vectors ব্যবহার করে:

$$
\text{king} = [0.30, 0.70]
$$

$$
\text{man} = [0.20, 0.20]
$$

$$
\text{woman} = [0.60, 0.30]
$$

Compute:

$$
[0.30,0.70] - [0.20,0.20] + [0.60,0.30]
$$

$$
=
[0.10,0.50] + [0.60,0.30]
$$

$$
=
[0.70,0.80]
$$

স্লাইডে এই result-কে label করা হয়েছে:

$$
\text{queen} = [0.70,0.80]
$$

> **পরীক্ষা সংকেত — formal + worked example:** vector-offset idea এবং analogy computation জানা দরকার।

---

## 3.7 Word embeddings এবং machine translation

স্লাইড embeddings-কে machine translation-এর সঙ্গে যুক্ত করে:

- বিভিন্ন ভাষায় similar concepts geometrically align করে,
- এটি bilingual lexicon induction সক্ষম করে,
- এটি modern multilingual embeddings-এর precursor।

Visual example-এ English number words এক embedding space-এ এবং Spanish number words আরেক embedding space-এ দেখানো হয়েছে; ধারণাটি হলো corresponding concepts ভাষাভেদে geometrically align করা যায়।

---

# 4. Language models হিসেবে Recurrent Neural Networks

## 4.1 Recurrent Neural Network, RNN

### সংজ্ঞা

একটি **recurrent neural network** হলো এমন network যার মধ্যে cycle থাকে: hidden state feed back করা হয় এবং next time step-এ ব্যবহার করা হয়।

সময় $t$-এ hidden state নির্ভর করে:

- current input $x_t$,
- previous hidden state $h_{t-1}$।

স্লাইডে একে **Elman network / simple RNN** হিসেবে চিহ্নিত করা হয়েছে।

### স্বজ্ঞা / intuition

RNN sequence-কে এক token করে, left to right process করে। Hidden state previous inputs-এর summary হিসেবে কাজ করে।

প্রতিটি time step-এ:

$$
h_t = \text{combination of current input and previous hidden state}
$$

স্লাইডে কোনো specific nonlinearity সহ full activation formula দেওয়া হয়নি।

**[UNCLEAR]** লেকচারার exact RNN update equation দিয়েছিলেন কি না জানতে রেকর্ডিং আবার শুনুন।

---

## 4.2 Simple RNN language model

একটি RNN language model:

- input sequence এক word করে process করে,
- current word ও previous hidden state থেকে next word predict করে,
- next-word probability model করে,
- sequential হওয়ায় parallelisation সীমিত হয়।

### Diagram থেকে variables

ধরা যাক $t$ হলো current time step এবং $w_t$ current word।

Diagram labels:

- $e_t$: current word $w_t$-এর embedding,
- $h_t$: $e_t$ এবং $h_{t-1}$-এর combination,
- $Vh_t$: vocabulary-এর ওপর scores,
- $y_t$: vocabulary-এর ওপর probability distribution,
- $y_t[i]$: word $i$ next word হওয়ার probability।

দেখানো computation-এর clean version:

$$
e_t = \text{embedding}(w_t)
$$

$$
h_t = \text{RNN}(e_t, h_{t-1})
$$

$$
\text{scores}_t = Vh_t
$$

$$
y_t = \text{softmax}(\text{scores}_t)
$$

তারপর:

$$
y_t[i] = P(w_{t+1}=i \mid w_{\leq t})
$$

শেষ probability notation diagram-এর representation-এর cleaned-up version: স্লাইডে বলা হয়েছে $y_t[i]$ হলো কোনো particular word $i$ next word হওয়ার probability।

---

## 4.3 RNN language model training

Training একটি corpus-এর ওপর ভিত্তি করে। প্রতিটি time step $t$-এ model next word predict করতে শেখে।

Model prediction error minimize করে। স্লাইডে error/loss-কে দুইটির difference হিসেবে define করা হয়েছে:

- predicted probability distribution,
- correct distribution।

Correct distribution হলো vocabulary-এর ওপর one-hot vector:

- actual next word = 1,
- all other words = 0।

ব্যবহৃত loss হলো **cross-entropy**।

### Token-level loss

Diagrams-এ loss নিচের form-এ দেখানো হয়েছে:

$$
-\log y_{\text{correct next word}}
$$

যেমন, correct next word যদি “long” হয়, loss term হলো:

$$
-\log y_{\text{long}}
$$

### Sequence-level objective

স্লাইডে বলা হয়েছে gradient descent RNN weights adjust করতে ব্যবহৃত হয়, যাতে sequence-এর ওপর averaged cross-entropy loss minimize হয়:

$$
\frac{1}{T}
\sum_{t=1}^{T}
L^{t}_{CE}
$$

যেখানে:

- $T$ হলো sequence length,
- $L^{t}_{CE}$ হলো time step $t$-এ cross-entropy loss।

---

## 4.4 Teacher forcing

### সংজ্ঞা

**Teacher forcing** মানে training-এর সময় model-কে previous time step-এ কী predict করেছিল তা feed না করে correct history sequence দেওয়া হয়।

অতএব training-এর সময়:

- input history হলো real sequence,
- model প্রতিটি time step-এ next word predict করে,
- loss correct next word-এ assigned probability-এর ওপর ভিত্তি করে।

এটি earlier model mistakes-কে later training inputs পরিবর্তন করা থেকে আটকায়।

> **পরীক্ষা সংকেত — training বনাম generation distinction:** teacher forcing training-এর সময় ব্যবহৃত হয়; autoregressive generation model-এর নিজস্ব sampled/predicted output আবার feed করে।

---

## 4.5 RNN language models দিয়ে sampling

### Autoregressive generation

স্লাইডে **autoregressive generation** define করা হয়েছে:

> প্রতিটি time step $t$-এ generated word RNN-এর previous time step $t-1$ থেকে selected word-এর ওপর conditioned থাকে।

### স্লাইডের algorithm

1. প্রথম input হিসেবে `<s>` ব্যবহার করুন।
2. Vocabulary-এর ওপর softmax distribution compute করুন।
3. Softmax-এর ভিত্তিতে একটি word sample করুন।
4. Sampled word-টিকে next input হিসেবে ব্যবহার করুন।
5. `</s>` sampled না হওয়া পর্যন্ত বা maximum limit reached না হওয়া পর্যন্ত continue করুন।

### অন্যান্য applications-এর সঙ্গে সংযোগ

স্লাইডে বলা হয়েছে autoregressive generation next-word prediction ছাড়াও অন্যান্য applications-এ ব্যবহৃত হয়, যেমন:

- machine translation,
- summarisation।

এই applications-এ শুধু `<s>` ব্যবহার না করে richer context ব্যবহার করা হয়।

---

## 4.6 RNNs বনাম n-gram language models

মূল পার্থক্য:

- **n-gram language models** শুধু limited context ব্যবহার করে:

$$
\text{preceding } n-1 \text{ tokens}
$$

- **RNN language models** এমন hidden state ব্যবহার করে যা সব preceding words-এর তথ্য অন্তর্ভুক্ত করতে পারে।

> **পরীক্ষা সংকেত — key difference:** n-gram context fixed-length; RNN context hidden state-এ accumulated হয়।

---

## 4.7 RNNs-এর সীমাবদ্ধতা

স্লাইডে নিচের limitations দেওয়া হয়েছে:

- RNNs input sequentially process করে, ফলে training এবং inference slow হয়।
- LSTM/GRU improvements থাকা সত্ত্বেও long-range dependencies নিয়ে struggle করে।
- Training-এর সময় limited parallelisation থাকে, তাই large datasets-এ scale করা কঠিন।
- Long sequences-এ vanishing/exploding gradient issues হয়।
- Global context effectively capture করা কঠিন।

এই limitations Transformer language models-এ যাওয়ার motivation তৈরি করে।

---

# 5. Transformers

## 5.1 Turning point: Transformer

স্লাইড Transformer-কে একটি turning point হিসেবে বর্ণনা করে:

- Vaswani et al. (2017)-এর *Attention is All You Need* paper-এ proposed,
- recurrence eliminate করে, অর্থাৎ step-by-step token processing নেই,
- পুরো sequence simultaneously process করে parallelisation enabled করে,
- long-range dependencies model করতে self-attention ব্যবহার করে,
- machine translation এবং beyond-এ state-of-the-art results অর্জন করে।

---

## 5.2 Transformer model families

স্লাইডে তিন ধরনের Transformer আলাদা করা হয়েছে।

### Encoder-only Transformers

Uses:

- NLU,
- classification,
- feature extraction।

Examples:

- BERT,
- RoBERTa,
- DeBERTa।

### Encoder–decoder Transformers

Uses:

- NLG,
- translation,
- summarisation,
- sequence-to-sequence mapping।

Examples:

- T5,
- Flan-T5,
- BART।

### Decoder-only Transformers

Uses:

- NLG,
- translation,
- summarisation,
- completion।

Examples:

- GPT-x,
- LLaMa,
- স্লাইডে লেখা অনুযায়ী “every other new model today”।

---

## 5.3 Transformer definition

স্লাইডে Transformer-কে define করা হয়েছে:

> A neural architecture built entirely on attention mechanisms.

একটি diagram translation-style example দেখায়:

$$
\text{Je suis étudiant}
\rightarrow
\text{I am a student}
$$

---

## 5.4 Transformer architecture: core components

স্লাইডে চারটি core components তালিকাভুক্ত করা হয়েছে।

### 1. Encoder stack

Input-এর contextual representations produce করে।

### 2. Decoder stack

ব্যবহার করে:

- encoder-এর output,
- previous decoder outputs,

target sequence generate করতে।

### 3. Self-attention mechanism

প্রতিটি token process করার সময় model-কে input sequence-এর বিভিন্ন অংশে focus করতে দেয়।

### 4. Feed-forward neural networks

প্রতি token-এ nonlinear transformations apply করে।

### Key idea

$$
\text{No recurrence, no convolution — only attention.}
$$

> **পরীক্ষা সংকেত — key idea:** Transformers recurrence/convolution-এর জায়গায় sequence-modelling operation হিসেবে attention-কে কেন্দ্রীয় করে।

---

## 5.5 Self-attention কেন RNNs-কে replace করেছে

### RNNs-এ

- Distant tokens-এর মধ্যে information $O(n)$ steps দিয়ে flow করে।
- Computation sequential এবং parallelise করা কঠিন।

### Transformers-এ

- Self-attention প্রতিটি token-কে sequence-এর সব token-এ directly attend করতে দেয়।
- এতে contextualised representations তৈরি হয়।
- প্রতিটি layer-এর ভেতরে computation sequence positions জুড়ে parallelisable।

### Trade-off

Attention time এবং memory sequence length-এর সঙ্গে quadratically scale করে:

$$
O(n^2)
$$

যেখানে $n$ হলো sequence length।

> **পরীক্ষা সংকেত — trade-off:** Transformers parallelism এবং token-to-token path length উন্নত করে, কিন্তু attention-এর time/memory cost $O(n^2)$।

---

# 6. Encoder internals

## 6.1 Encoder block structure

Encoder-এ থাকে:

1. self-attention,
2. residual connection + layer normalisation,
3. position-wise feed-forward network,
4. residual connection + layer normalisation।

স্লাইডে বলা হয়েছে:

- self-attention positions জুড়ে information mix করে,
- feed-forward network প্রতিটি token-এ independently nonlinear transformation apply করে,
- residuals এবং LayerNorm এই sublayers-এর চারপাশে apply করা হয়।

দেখানো formulas:

$$
\mathrm{LayerNorm}(z + \mathrm{SelfAttention}(z))
$$

$$
\mathrm{LayerNorm}(z + \mathrm{FFN}(z))
$$

**[UNCLEAR]** স্লাইডে $z$ genericভাবে ব্যবহার করা হয়েছে; lecturer-এর explanation-এ notation pre-norm না post-norm তা transcript clarify করতে পারে।

---

## 6.2 Important encoder properties

স্লাইডে এগুলোকে explicitভাবে **Important properties** বলা হয়েছে:

- tokens প্রতিটি layer-এর ভেতরে parallelভাবে processed হয়,
- tokens attention-এর মাধ্যমে coupled হয়,
- deeper layers contextual representations refine করে,
- residual connections signal preserve করে এবং optimisation সহজ করে।

> **পরীক্ষা সংকেত — important properties:** parallel token processing + attention-এর মাধ্যমে coupling হলো key encoder behaviour।

---

# 7. Self-attention mechanism

## 7.1 Scaled dot-product attention

### Formal definition

Input:

$$
X \in \mathbb{R}^{n \times d}
$$

compute:

$$
Q = XW^Q
$$

$$
K = XW^K
$$

$$
V = XW^V
$$

Then:

$$
\mathrm{Attention}(Q,K,V)
=
\mathrm{softmax}
\left(
\frac{QK^\top}{\sqrt{d_k}}
\right)V
$$

where:

- $Q$ = query matrix,
- $K$ = key matrix,
- $V$ = value matrix,
- $d_k$ = key dimension।

### Interpretation

স্লাইডে নিচের interpretation দেওয়া হয়েছে:

- $Q$, $K$, এবং $V$ input-এর learned linear projections।
- Attention scores:

$$
\frac{QK^\top}{\sqrt{d_k}}
$$

  projected space-এ similarity measure করে।
- $\sqrt{d_k}$ দিয়ে scaling high dimensions-এ dot products অতিরিক্ত বড় হওয়া ঠেকায় এবং gradients stabilise করে।
- Softmax attention scores-কে input elements-এর ওপর distribution-এ convert করে।
- Output হলো value vectors-এর weighted sum।

> **পরীক্ষা সংকেত — core formula:** scaled dot-product attention equation এবং $Q$, $K$, $V$, $d_k$, softmax, ও $V$ কী করে তা জানা দরকার।

---

## 7.2 Query, Key, Value intuition

স্লাইড Q/K/V ব্যাখ্যা করেছে recommendation analogy দিয়ে।

### Query, $Q$

Query vector current input বা সেই element-কে represent করে যার জন্য relevant information খোঁজা হচ্ছে।

Example:

> Looking for action movies with strong female leads.

### Key, $K$

Key vector সেই criteria বা features represent করে যার সঙ্গে query compare করা হয়।

Example:

> This movie is tagged as action, drama, female lead.

### Value, $V$

Value vector query-এর জন্য relevant হতে পারে এমন actual information বা content ধারণ করে।

Example:

> The full movie details or recommendation result.

---

## 7.3 Self-attention step by step calculate করা

স্লাইডে **Thinking** এবং **Machines** example tokens ব্যবহার করে self-attention দেখানো হয়েছে।

### Step 1: Q, K, এবং V compute করা

প্রতিটি token-এর জন্য compute করা হয়:

- একটি query vector,
- একটি key vector,
- একটি value vector।

এগুলো input embeddings-কে learned weight matrices দিয়ে multiply করে derived হয়।

Token embedding $x_i$-এর জন্য:

$$
q_i = x_i W^Q
$$

$$
k_i = x_i W^K
$$

$$
v_i = x_i W^V
$$

---

### Step 2: Attention scores compute করা

প্রতিটি token-এর জন্য dot products compute করা হয়:

- তার query vector,
- সব key vectors।

যেমন:

$$
q_1 \cdot k_1
$$

$$
q_1 \cdot k_2
$$

স্লাইডে example scores দেওয়া হয়েছে:

$$
q_1 \cdot k_1 = 112
$$

$$
q_1 \cdot k_2 = 96
$$

বড় dot product মানে stronger alignment।

---

### Step 3: Attention scores scale এবং normalise করা

Dot products বড় হয়ে যেতে পারে, বিশেষ করে high-dimensional vectors-এর ক্ষেত্রে।

প্রতিটি score-কে key dimension-এর square root দিয়ে divide করা হয়:

$$
\sqrt{d_k}
$$

Example:

$$
\sqrt{64} = 8
$$

So:

$$
112 / 8 = 14
$$

$$
96 / 8 = 12
$$

তারপর softmax apply করা হয়:

$$
\mathrm{softmax}([14,12]) = [0.88, 0.12]
$$

স্লাইডে বলা হয়েছে softmax:

- সব weights positive করে,
- scores-কে tokens-এর ওপর probability distribution-এ convert করে।

---

### Step 4: Self-attention output compute করা

প্রতিটি value vector-কে তার attention weight দিয়ে multiply করা হয়।

Example-এর প্রথম token-এর জন্য:

$$
z_1 = 0.88v_1 + 0.12v_2
$$

এটি:

- important words emphasise করে,
- irrelevant ones down-weight করে,
- updated contextualised representation তৈরি করে,
- representation-টি feed-forward layer-এ pass করে।

---

## 7.4 Matrix form

প্রতিটি token আলাদাভাবে compute না করে self-attention matrix form-এ efficiently compute করা হয়।

স্লাইডে বলা হয়েছে embeddings-গুলো একটি matrix $X$-এ pack করা হয়, তারপর learned weight matrices দিয়ে multiply করে $Q$, $K$, এবং $V$ পাওয়া যায়।

Self-attention layer-এর output:

$$
Z
=
\mathrm{softmax}
\left(
\frac{QK^\top}{\sqrt{d_k}}
\right)V
$$

এটি একই scaled dot-product attention equation, পুরো context-এ একসঙ্গে apply করা হয়েছে।

---

## 7.5 Self-attention visualisation

স্লাইডে একটি sentence দেখানো হয়েছে:

> The animal didn’t cross the street because it was too tired.

Token **“it”** related tokens যেমন **“The animal”**-এ বেশি attend করে। এটি model-কে long-range dependencies এবং context capture করতে সাহায্য করে।

**Connection:**  
এটি সরাসরি RNN-এর একটি limitation address করে: distant dependencies-কে অনেক sequential hidden states-এর মধ্য দিয়ে যেতে হয় না।

---

# 8. Multi-head attention

## 8.1 Motivation

প্রতিটি self-attention layer parallelভাবে multiple attention heads compute করে।

এক set $Q/K/V$ weights-এর বদলে model একাধিক sets ব্যবহার করে, প্রতি head-এর জন্য একটি করে।

এটিকে **multi-head attention** বলা হয়।

### স্বজ্ঞা / intuition

প্রতিটি head data-এর আলাদা aspect বা pattern শিখতে পারে।

স্লাইড উদাহরণ:

- একটি head **river bank**-এর meaning capture করতে পারে,
- আরেকটি **financial bank** capture করতে পারে।

তাই multi-head attention model-কে একই সঙ্গে বিভিন্ন representation subspaces-এ attend করতে দেয়।

---

## 8.2 Head outputs

প্রতিটি attention head তার নিজস্ব output matrix produce করে:

$$
Z_0, Z_1, \ldots, Z_7
$$

স্লাইড example-এ 8 heads ব্যবহার করা হয়েছে।

এই outputs independently ভিন্ন learned projection subspaces-এ computed হয় এবং একই input থেকে diverse relational patterns model করতে পারে।

---

## 8.3 Multiple heads combine করা

স্লাইডে তিনটি ধাপ দেওয়া হয়েছে:

1. সব heads-এর outputs concatenate করা:

$$
\mathrm{Concat}(Z_0, Z_1, \ldots, Z_7)
$$

2. Combined matrix-কে learnable output projection matrix দিয়ে multiply করা:

$$
W^O
$$

3. Final output produce করা:

$$
Z
=
\mathrm{Concat}(Z_0, Z_1, \ldots, Z_7)W^O
$$

এই final $Z$ diverse attention patterns integrate করে এবং next layer-এ passed হয়।

> **পরীক্ষা সংকেত — multi-head formula:** multi-head attention = multiple independent attention heads + concatenation + output projection $W^O$।

---

# 9. Positional encodings and residuals

## 9.1 Positional encodings

### Problem

Transformers-এর built-in word order notion নেই।

Self-attention যেহেতু সব tokens parallelভাবে compare করতে পারে, architecture-এর positions distinguish করার জন্য অতিরিক্ত information দরকার।

### Solution

প্রতিটি input embedding-এর সঙ্গে একটি **positional vector** যোগ করা হয়।

Original Transformer fixed sinusoidal positional encodings ব্যবহার করেছিল: বিভিন্ন frequencies-এর sinusoidal functions।

> **পরীক্ষা সংকেত — missing piece:** self-attention একা token order encode করে না; positional encoding order information সরবরাহ করে।

---

## 9.2 Residual connections

স্লাইডে residuals-কে Transformer architecture-এর আরেকটি “ornament” হিসেবে বর্ণনা করা হয়েছে।

### Purpose

Residual connections deep networks-এ training stabilise করে।

### Mechanism

প্রতিটি sublayer-এর জন্য, যেমন self-attention বা FFN:

1. sublayer output compute করা,
2. original sublayer input যোগ করা,
3. layer normalisation apply করা।

কথায়:

$$
\text{sublayer output} + \text{sublayer input}
\rightarrow
\text{LayerNorm}
$$

স্লাইডে বলা হয়েছে residual connections:

- gradient flow improve করে,
- deep architectures-এ optimisation facilitate করে।

---

# 10. Decoder and generation process

## 10.1 Decoder structure

Decoder-এ থাকে:

- masked self-attention,
- encoder outputs-এর ওপর cross-attention,
- feed-forward network।

Decoder output এক token করে generate করে।

---

## 10.2 Masked self-attention

### সংজ্ঞা

Masked self-attention নিশ্চিত করে যে প্রতিটি position শুধু previously generated tokens-এ attend করতে পারে।

এটি future tokens access করা প্রতিরোধ করে।

### Formal masking behaviour

Decoder-এর self-attention শুধু earlier tokens দেখতে পারে, future tokens নয়।

এটি implement করা হয় future-position attention scores-কে softmax-এর আগে নিচের মানে set করে:

$$
-\infty
$$

কারণ:

$$
\mathrm{softmax}(-\infty) = 0
$$

future tokens zero attention weight পায়।

> **পরীক্ষা সংকেত — masking:** decoder masking training-এর সময় future target tokens থেকে information leakage প্রতিরোধ করে।

---

## 10.3 Cross-attention

### সংজ্ঞা

Cross-attention decoder-কে প্রতিটি token generate করার সময় encoder outputs-এ attend করতে দেয়।

Top encoder layer contextualised representations produce করে। Cross-attention-এ এই encoder representations **keys** এবং **values** হিসেবে ব্যবহৃত হয়।

এগুলো decoder-এর cross-attention layer-এ fed হয়, ফলে decoder generation-এর সময় relevant input positions-এ focus করতে পারে।

### Decoder layer combination

প্রতিটি decoder layer combine করে:

1. masked self-attention,
2. encoder–decoder cross-attention,
3. feed-forward network।

ফলস্বরূপ representations next token predict করতে ব্যবহৃত হয়।

---

## 10.4 Decoder থেকে output token

স্লাইড training time এবং inference time আলাদা করে।

### Training time

Full target sequence জানা থাকে।

Model **teacher forcing** ব্যবহার করে, correct previous tokens feed করে next-token predictions compute করে।

### Inference time

Output autoregressively generate হয়, এক token করে।

প্রতিটি predicted token আবার decoder-এ feed করা হয়।

### Output prediction steps

1. **Linear layer**
   - Decoder output-কে vocabulary size-এ project করে।

2. **Softmax**
   - Logits-কে vocabulary-এর ওপর probability distributions-এ convert করে।

3. **Token selection**
   - Next token select করে, যেমন greedy decoding বা sampling দিয়ে।

এটি RNN-এর teacher-forced training এবং autoregressive generation-এর distinction-এর সঙ্গে মিলে যায়।

---

## 10.5 Transformer training process

স্লাইডে তিনটি training component দেওয়া হয়েছে।

### Loss function

Cross-entropy loss predicted token probabilities true target tokens থেকে কত দূরে তা measure করে।

Lower loss মানে better predictions।

### Backpropagation

Loss-এর gradients compute করা হয় এবং parameters update করতে ব্যবহৃত হয়, যেমন Adam optimiser দিয়ে।

### Datasets

Transformers paired input-output sequences-এ trained হয়, যেমন translation-এর জন্য source এবং target sentences।

---

# 11. Transformer summary

স্লাইড summary-তে বলা হয়েছে:

### Core idea

Transformers global self-attention ব্যবহার করে RNNs এবং LSTMs-এর limitations overcome করে, যার মধ্যে আছে:

- sequential bottlenecks,
- long-range dependency problems।

### Key components

- self-attention,
- multi-head attention,
- encoder-decoder structure,
- positional encoding।

### Transformers কেন কাজ করে

- Tokens-এর মধ্যে short path length:

$$
O(1) \text{ per layer}
$$

- Sequence positions জুড়ে fully parallelisable।
- খুব large models এবং datasets-এ effectively scale করে।

> **পরীক্ষা সংকেত — summary slide:** “why Transformers replaced RNNs” প্রশ্নের high-level lecture answer এটিই।

---

# 12. Worked examples index

## Example 1: WordNet / symbolic meaning

- WordNet explicit relations represent করে।
- Example relation:

$$
\text{dog} \rightarrow \text{animal}
$$

hypernymy-এর জন্য।

- Slide-এর synonym example incomplete। **[UNCLEAR]**

## Example 2: One-hot vectors

$$
\text{motel} = [0,0,0,0,0,1,0,0,0,\ldots,0,0]
$$

$$
\text{hotel} = [0,0,1,0,0,0,0,0,0,\ldots,0,0]
$$

$$
\cos(\text{motel}, \text{hotel}) = 0
$$

Conclusion: one-hot vectors semantically related words-কে unrelated হিসেবে treat করে।

## Example 3: Bank

- Financial bank: deposits এবং credit।
- Geographical bank: water-এর পাশে land।
- Context meaning পরিবর্তন করে — এটি দেখায়।

## Example 4: Co-occurrence matrix

Rows হলো target words, columns হলো context words, entries হলো frequency counts।

Key lesson: context vectors distributional information encode করে, কিন্তু raw counts sparse এবং high-dimensional।

## Example 5: CBOW

Sentence:

$$
\text{eat an apple every day}
$$

Task:

$$
\{\text{eat},\text{an},\text{every},\text{day}\}
\rightarrow
\text{apple}
$$

## Example 6: Skip-gram

Sentence:

$$
\text{eat an apple every day}
$$

Task:

$$
\text{apple}
\rightarrow
\{\text{eat},\text{an},\text{every},\text{day}\}
$$

## Example 7: Word analogy

$$
\text{king} - \text{man} + \text{woman}
=
\text{queen}
$$

Numerical version:

$$
[0.30,0.70] - [0.20,0.20] + [0.60,0.30]
=
[0.70,0.80]
$$

## Example 8: RNN sampling

1. `<s>` দিয়ে শুরু করুন।
2. Softmax থেকে next word sample করুন।
3. Sampled word আবার feed করুন।
4. `</s>` বা length limit-এ stop করুন।

## Example 9: Self-attention scores

Given scores:

$$
q_1 \cdot k_1 = 112
$$

$$
q_1 \cdot k_2 = 96
$$

Scale by:

$$
\sqrt{64}=8
$$

$$
112/8=14,\quad 96/8=12
$$

Softmax:

$$
[14,12] \rightarrow [0.88,0.12]
$$

Weighted output:

$$
z_1 = 0.88v_1 + 0.12v_2
$$

## Example 10: Pronoun/coreference-style attention

Sentence:

> The animal didn’t cross the street because it was too tired.

Token **“it”** **“The animal”**-এ attend করে, যা দেখায় self-attention কীভাবে long-range contextual relationships capture করে।

---

# 13. Exam flags / slide-emphasis flags

সরবরাহ করা slides-এ explicit “this will be on the exam” statement নেই, এবং কোনো transcript দেওয়া হয়নি। নিচের points-গুলো slide wording যেমন **Core Idea**, **Key idea**, **Important properties**, **Key difference** দিয়ে emphasised, অথবা central formulas হিসেবে এসেছে।

1. **word2vec-এর core idea**
   - Context predict করে embeddings শেখা।
   - Explicit co-occurrence counts-কে prediction task দিয়ে replace করা।

2. **CBOW vs Skip-gram**
   - CBOW:

$$
\text{context} \rightarrow \text{target}
$$

   - Skip-gram:

$$
\text{target} \rightarrow \text{context}
$$

3. **CBOW objective**

$$
\prod_{w \in C} P(w \mid \text{context}(w))
$$

$$
\mathcal{L}
=
\sum_{w \in C}
\log P(w \mid \text{context}(w))
$$

4. **Word analogy vector arithmetic**

$$
\text{king} - \text{man} + \text{woman}
=
\text{queen}
$$

5. **RNN vs n-gram**
   - n-gram: fixed $n-1$-token context।
   - RNN: hidden state সব preceding words incorporate করতে পারে।

6. **Teacher forcing vs autoregressive generation**
   - Training: correct previous tokens feed করা।
   - Generation: model-এর own previous output feed করা।

7. **RNN limitations**
   - sequential bottleneck,
   - long-range dependency difficulty,
   - limited parallelisation,
   - vanishing/exploding gradients,
   - global context capture করতে difficulty।

8. **Transformer key idea**

$$
\text{No recurrence, no convolution — only attention.}
$$

9. **Scaled dot-product attention**

$$
\mathrm{Attention}(Q,K,V)
=
\mathrm{softmax}
\left(
\frac{QK^\top}{\sqrt{d_k}}
\right)V
$$

10. **Self-attention trade-off**
    - tokens-এর মধ্যে direct access,
    - layer-এর ভেতরে parallelisable,
    - quadratic time/memory:

$$
O(n^2)
$$

11. **Multi-head attention**

$$
Z
=
\mathrm{Concat}(Z_0,\ldots,Z_7)W^O
$$

12. **Positional encoding**
    - Transformers-এর built-in order নেই।
    - Input embedding-এ positional vector যোগ করা হয়।

13. **Decoder masking**
    - Future attention scores set করা হয়:

$$
-\infty
$$

    - Future-token leakage প্রতিরোধ করে।

14. **Cross-attention**
    - Decoder encoder outputs-এ attend করে।
    - Encoder outputs keys এবং values হিসেবে কাজ করে।

---

# 14. লেকচারের ভেতরের সংযোগগুলো

## Symbolic meaning → distributional meaning

লেকচার WordNet-style symbolic lexical resources দিয়ে শুরু করে, তারপর distributional semantics-এ যায়। মূল shift হলো manually defined relations থেকে statistically learned contextual meaning-এ যাওয়া।

## Co-occurrence counts → word2vec

Raw co-occurrence matrices context counts দিয়ে words represent করে, কিন্তু এগুলো sparse এবং high-dimensional। word2vec distributional idea ধরে রাখে, কিন্তু prediction-এর মাধ্যমে dense vectors শেখে।

## word2vec → downstream NLP

Word embeddings parsing, NER, classification, sentiment analysis, paraphrase detection, clustering, এবং translationসহ downstream tasks-এর সঙ্গে যুক্ত।

## n-grams → RNNs

N-grams limited fixed context ব্যবহার করে। RNNs previous tokens থেকে information accumulate করতে hidden states ব্যবহার করে।

## RNNs → Transformers

RNNs sequential এবং long-range dependencies ও parallelisation নিয়ে struggle করে। Transformers recurrence remove করে এবং tokens directly connect করতে self-attention ব্যবহার করে।

## RNN generation → Transformer generation

RNNs এবং Transformer decoders দুটোতেই ব্যবহৃত হয়:

- training-এর সময় teacher forcing,
- inference-এর সময় autoregressive generation।

## Word embeddings → contextual representations

word2vec একটি word-কে learned vector representation দেয়। Transformers contextualised representations produce করে, যেখানে একটি token-এর representation attention-এর মাধ্যমে অন্য tokens-এর ওপর depend করে।

---

# 15. Recording-এ ফিরে গিয়ে শোনার মতো unclear sections

- **[TRANSCRIPT MISSING]** কোনো transcript text সরবরাহ করা হয়নি, তাই spoken explanations, examples, corrections, এবং verbal exam warnings অন্তর্ভুক্ত নেই।

- **[UNCLEAR: slides 2, 18, 33]** Evolution diagram Transformer-এর পরে “???” দিয়ে শেষ হয়। Slides ব্যাখ্যা করে না এটি কী বোঝায়।

- **[UNCLEAR: slide 3]** Synonymy example “dog ↔” হিসেবে দেখা যায়, কিন্তু দ্বিতীয় term missing বা unreadable।

- **[UNCLEAR: slide 14]** CBOW training objective দেখানো হয়েছে, কিন্তু $P(w \mid \text{context}(w))$ কীভাবে parameterised বা optimised হয় তা slides ব্যাখ্যা করে না।

- **[UNCLEAR: RNN diagrams, slides 23–27]** কিছু diagram labels visually small বা parsed oddly, বিশেষ করে `S0/So` এবং red “sorry” example। Exact example sentence এবং target words-এর জন্য recording আবার শুনুন।

- **[UNCLEAR: slide 41]** Residual/LayerNorm formulas $z$ ব্যবহার করে, কিন্তু slide intermediate variables পুরোপুরি define করে না।

- **[UNCLEAR: slides 50 and 55]** “efficient computation” এবং “all in one place” diagrams-এ ছোট matrix labels আছে; high-level process পরিষ্কার, কিন্তু exact dimensions slide images থেকে পুরোপুরি legible নয়।

- **[UNCLEAR: slide 65]** “Building Transformers from Scratch” slide-এ video/resource screenshots আছে, কিন্তু resource details parsed slide text থেকে readable নয়।
