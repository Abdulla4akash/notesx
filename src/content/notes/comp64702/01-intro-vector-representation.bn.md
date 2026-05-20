---
subject: COMP64702
chapter: 1
title: "Introduction & Vector Representation"
language: bn
---

# COMP64702 স্টাডি নোটস — টেক্সটের ভূমিকা ও ভেক্টর উপস্থাপন

**বিষয় ও পরিসর:** এই লেকচারে Text Mining/NLP পরিচয় করানো হয়েছে এবং ব্যাখ্যা করা হয়েছে কেন মেশিন লার্নিং পদ্ধতি ব্যবহার করার আগে raw text-কে সংখ্যাগত vector representation-এ রূপান্তর করতে হয়। এতে text preprocessing, one-hot vector, word-word ও document-word matrix, similarity measure, weighting scheme, evaluation, এবং limitations আলোচনা করা হয়েছে।

**কোর্স:** COMP64702 — Transforming Text Into Meaning  
**লেকচার টপিক:** Introduction & Vector Representations of Text  
**ব্যবহৃত উৎস:** আপলোড করা লেকচার স্লাইড ডেক।  
**ট্রান্সক্রিপ্ট অবস্থা:** [UNCLEAR/অস্পষ্ট] এই কথোপকথনে কোনো transcript দেওয়া হয়নি, তাই spoken exam hints, অতিরিক্ত উদাহরণ, বা lecturer emphasis-এর মতো transcript-only তথ্য অনুপস্থিত থাকতে পারে।

---

## Part I — Text Mining ও NLP-এর ভূমিকা

### 1. কোর্সের প্রেক্ষাপট ও লক্ষ্য

#### Course practicalities

- **লেকচারার:**
  - Prof. Chenghua Lin
  - Dr. Jingyuan Sun
- **লেকচার:** প্রতি সোমবার, 10:00–12:00।
- **লেকচার স্লাইড:** এক সপ্তাহ আগে প্রকাশ করা হবে।
- **ল্যাব:** শুক্রবার, 12:00–14:00; Weeks 3, 5, 7, এবং 9।
- **ম্যাটেরিয়াল:** Canvas-এ পাওয়া যাবে।
- **Assessment:**
  - Team coursework: 50%।
  - Final exam: 50%।
- **Coursework/labs:** Chenghua coursework এবং labs পরিচালনার জন্য সম্পূর্ণ দায়িত্বে থাকবেন।
- **Support:**
  - 9 জন teaching assistant।
  - Canvas discussion forum।

#### Course goals

এই কোর্সের লক্ষ্য হলো শিক্ষার্থীদের মধ্যে তৈরি করা:

- Text mining ও NLP fundamentals সম্পর্কে শক্ত ভিত্তি, যার মধ্যে রয়েছে:
  - text preprocessing;
  - text representations।
- Language model-এর evolution বোঝা, যা নিয়ে যায়:
  - transformers;
  - modern large language model architectures।
- Core NLP task-এর জন্য traditional ও state-of-the-art approach বোঝা, যার মধ্যে transformer-based model অন্তর্ভুক্ত।
- Large language model কীভাবে trained এবং aligned হয় তা বোঝা, যেমন:
  - pre-training;
  - instruction tuning।
- NLP task-এ বিভিন্ন approach-এর performance systematicভাবে evaluate ও compare করার ক্ষমতা।
- দলগতভাবে কাজ করে large-scale textual data থেকে information ও meaning বের করতে বিভিন্ন NLP method apply করার ক্ষমতা।

**Connection/সংযোগ:** এই লেকচারটি course-এর পরবর্তী topic—language modelling, transformers, LLMs, এবং NLP task evaluation—এর জন্য মৌলিক representation foundation তৈরি করে।

---

## 2. Text Mining বনাম NLP

### Key concept: Natural Language Processing, NLP

**Intuition/সহজ ধারণা:** NLP হলো computer-কে human language process, model, এবং act করতে শেখানোর ক্ষেত্র।

**Lecture definition/লেকচারের সংজ্ঞা:** NLP ঐতিহ্যগতভাবে linguistic structure ও meaning model করার ওপর focus করে, যেমন:

- syntax;
- semantics;
- discourse।

### Key concept: Text Mining

**Intuition/সহজ ধারণা:** Text mining হলো বড় text collection থেকে দরকারি information ও pattern খুঁজে বের করা।

**Lecture definition/লেকচারের সংজ্ঞা:** Text Mining ঐতিহ্যগতভাবে large text collection থেকে pattern ও useful information discover করার ওপর focus করে; উদাহরণ: topic modelling।

### Historical difference in emphasis

- **NLP:**
  - বেশি linguistically oriented;
  - structure ও meaning-এর ওপর focus করে;
  - উদাহরণ: syntax, semantics, discourse।
- **Text Mining:**
  - বেশি data-mining oriented;
  - large-scale pattern discovery-এর ওপর focus করে;
  - উদাহরণ: topic modelling।

### Increasing convergence

এখন এই দুই ক্ষেত্রের পার্থক্য ঝাপসা হয়ে গেছে, কারণ দুটো ক্ষেত্রই ক্রমশ একে অপরের সঙ্গে share করছে:

- representations;
- models;
- evaluation benchmarks;
- statistical language processing methods;
- neural language processing methods।

Modern large language models NLP ও text mining-এর পার্থক্য আরও ঝাপসা করেছে।

---

## 3. কেন Text Mining ও NLP দরকার?

লেকচারে application-এর মাধ্যমে NLP/Text Mining motivate করা হয়েছে।

### 3.1 Machine translation

স্লাইডে Google Translate-কে উদাহরণ হিসেবে দেখানো হয়েছে। Screenshot-এ দেখা যায়:

```text
Hello World → Hola Mundo
```

**Key idea/মূল ধারণা:** Machine translation-এর জন্য একটি system-কে language-এর মধ্যে meaning represent ও preserve করতে হয়।

---

### 3.2 Question answering

স্লাইডে question answering-এর উদাহরণ হিসেবে Amazon Alexa ব্যবহার করা হয়েছে। দেখানো example commands/questions:

```text
What’s the weather today?
What’s in the news?
What time is it in Boston?
Set the alarm for 7 a.m. tomorrow.
What are my upcoming events?
```

**Key idea/মূল ধারণা:** Question answering-এর জন্য system-কে natural-language query interpret করতে হয়, সেটিকে information বা action-এর সঙ্গে map করতে হয়, এবং useful response return করতে হয়।

---

### 3.3 Historical Legal Text Analytics

লেকচারে Aberdeen Burgh Records-কে উদাহরণ হিসেবে ব্যবহার করা হয়েছে।

স্লাইডে বর্ণনা করা হয়েছে:

- Aberdeen, Scotland-এর council registers।
- 1398 থেকে বর্তমান পর্যন্ত প্রায় continuous records, অর্থাৎ প্রায় 700 বছরের span।
- Town বা burgh council records-এর সবচেয়ে প্রাচীন ও সবচেয়ে complete bodies-গুলোর একটি।
- Records-এ রয়েছে:
  - legal matters;
  - commercial activity;
  - daily life।
- Original material handwritten scripts-এ লেখা:
  - Latin;
  - Middle Scots।

Analysis task-এ থাকে:

- original handwritten pages manually transcribe করা;
- machine-readable Aberdeen Burgh Records annotate ও enrich করা;
- social ও legal concepts-এর evolution analyse করা।

**Connection/সংযোগ:** এটি NLP/Text Mining-কে digital humanities, law, history, এবং social/legal analysis-এর সঙ্গে যুক্ত করে।

---

### 3.4 Fact checking

লেকচারে NLP/Text Mining application হিসেবে fact checking অন্তর্ভুক্ত করা হয়েছে।

**Key idea/মূল ধারণা:** Fact checking-এ textual claim analyse করে evidence বা known information-এর সঙ্গে compare করা হয়।

---

### 3.5 Data-to-text generation

Weather report slide-এ structured weather data থেকে automatic weather forecast report generation দেখানো হয়েছে।

#### Key concept: Data-to-text generation

**Intuition/সহজ ধারণা:** Structured বা non-linguistic data-কে natural-language text-এ রূপান্তর করা।

**Lecture example/লেকচারের উদাহরণ:** Weather data থেকে automatically weather forecast report তৈরি করা।

---

### 3.6 ChatGPT ও LLM capabilities

লেকচারে modern NLP/LLM capabilities-এর উদাহরণ হিসেবে ChatGPT ব্যবহার করা হয়েছে।

Listed abilities:

- question answering;
- mathematical tasks perform করা;
- কোনো topic দিলে song বা poem লেখা;
- email লেখা;
- dialogue generation;
- code generation ও debugging;
- text completion।

স্লাইডে ChatGPT-কে এভাবে বর্ণনা করা হয়েছে:

```text
A significant step towards AGI
```

[UNCLEAR/অস্পষ্ট] Lecturer এই AGI claim-টি কতটা cautious বা strong ভাবে বলেছেন, তা জানতে transcript দরকার।

---

## 4. কেন Text Mining ও NLP challenging?

স্লাইডে কয়েকটি core difficulty দেওয়া হয়েছে।

### 4.1 Natural languages evolve

Natural language fixed নয়। নতুন word ও usage constantly তৈরি হয়।

Examples:

```text
emoji
to DM
```

**Consequence/পরিণতি:** Static rule system খুব দ্রুত outdated হয়ে যেতে পারে।

---

### 4.2 Syntactic rules are flexible

Natural language informal, compressed, বা non-standard syntax allow করে।

Example:

```text
Are you coming?
Coming?
```

দুটিই একই intended meaning communicate করতে পারে।

**Consequence/পরিণতি:** NLP systems শুধু rigid grammar rules-এর ওপর rely করতে পারে না।

---

### 4.3 Ambiguity is inherent

Natural language অনেক সময় একাধিকভাবে interpret করা যায়। স্লাইডে ambiguity-কে inherent challenge হিসেবে list করা হয়েছে, তবে detail-এ expand করা হয়নি।

---

### 4.4 World knowledge is necessary

Example:

```text
The player took three steps. The whistle blew.
```

এটি সঠিকভাবে interpret করতে reader-এর sport বা context সম্পর্কে background knowledge দরকার। Whistle কেন বেজেছে, সেটি explicitly বলা হয়নি।

---

### 4.5 Many languages, dialects, and styles

NLP systems-কে variation handle করতে হয়:

- languages;
- dialects;
- styles;
- formal ও informal text;
- spoken/transcribed text।

**Connection/সংযোগ:** এই challenges machine learning method motivate করে, কারণ এগুলো hand-written rule-এর ওপর পুরোপুরি depend না করে data থেকে adapt করতে পারে।

---

## 5. Language-specific examples: Chinese

### 5.1 Chinese word segmentation

স্লাইডে Chinese word segmentation-কে একটি challenge হিসেবে দেখানো হয়েছে।

Example sentence:

```text
这是一篇有趣的文章
```

দেখানো segmentation:

```text
这是 / 一篇 / 有趣 / 的 / 文章
```

Translation:

```text
This is an interesting article
```

#### Key concept: Word segmentation

**Intuition/সহজ ধারণা:** Continuous character sequence-কে word-like unit-এ split করা।

**Why it matters/কেন গুরুত্বপূর্ণ:** English-এ spaces সাধারণত word boundary mark করে। Chinese-এ word boundary একইভাবে marked নয়, তাই tokenisation/segmentation কঠিন।

স্লাইডে ambiguity example-ও দেখানো হয়েছে:

```text
武汉市长江大桥
```

দুটি possible segmentation:

```text
Result 1: 武汉 / 市长 / 江大桥
Gloss: Wuhan / mayor / Daqiao Jiang
```

```text
Result 2: 武汉市 / 长江大桥
Gloss: Wuhan City / Yangtze River Bridge
```

**Key point/মূল কথা:** ভিন্ন segmentation ভিন্ন meaning তৈরি করে।

---

### 5.2 Traditional vs. simplified Chinese

স্লাইডে বলা হয়েছে:

- Chinese একটি ideographic language।
- English alphabetic।
- Traditional Chinese characters simplified characters-এর তুলনায় richer stroke signals দেয়।

দেখানো example-গুলো traditional ও simplified characters compare করে:

- love;
- horse;
- noodle।

**Connection/সংযোগ:** এটি দেখায় যে text representation-এ language-specific property বিবেচনা করতে হতে পারে। English-এর জন্য ভালো representation Chinese-এর সব useful signal capture নাও করতে পারে।

---

## 6. Text Mining/NLP-এর জন্য Machine Learning কেন?

### Rule-based symbolic AI

Traditional rule-based AI:

- rules engineer করতে expert knowledge দরকার;
- সহজে adapt করার মতো flexible নয়, বিশেষ করে:
  - multiple languages;
  - domains;
  - applications।

### Machine learning from data

Machine learning data থেকে শেখার মাধ্যমে adapt করে।

স্লাইডে দুটি adaptation advantage emphasise করা হয়েছে:

- **Language evolution-এ adapt:** new data থেকে learn করা।
- **Different applications-এ adapt:** appropriate target representation দিয়ে learn করা।

#### Key concept: Machine learning for NLP

**Intuition/সহজ ধারণা:** প্রতিটি linguistic rule manually লেখার বদলে examples থেকে model train করা, যাতে changing language ও different task-এ adapt করা যায়।

---

## 7. NLP, Machine Learning, এবং Computational Linguistics

### 7.1 NLP কি ML-এর সমান?

না।

স্লাইডে বলা হয়েছে:

- NLP হলো এই ক্ষেত্রগুলোর confluence:
  - computer science;
  - artificial intelligence;
  - linguistics।
- ML data থেকে learning করে problem solving-এর technique দেয়।
- ML হলো current dominant AI paradigm।
- ML প্রায়ই NLP task model করতে ব্যবহার করা হয়।

**Relationship/সম্পর্ক:** ML হলো NLP-তে ব্যবহৃত একটি প্রধান method, কিন্তু NLP ML-এর চেয়ে broader।

---

### 7.2 NLP কি Computational Linguistics-এর সমান?

না, যদিও overlap আছে।

স্লাইডে বলা হয়েছে:

- দুই ক্ষেত্রই mostly text-কে data হিসেবে ব্যবহার করে।
- Computational Linguistics-এ computational methods linguistic phenomena ও theories study করতে support করে।
  - Example: formal discourse theories।
- NLP-তে scope বেশি general।
  - Computational methods translation, information extraction, question answering, এবং similar application-এ ব্যবহৃত হয়।
- শীর্ষ NLP scientific conference হলো Annual Meeting of the Association for Computational Linguistics, ACL।

**Relationship/সম্পর্ক:** Computational Linguistics ভাষা study করার ওপর বেশি focused; NLP language-involving computational task-এর ওপর broadly focused।

---

## 8. Related fields এবং typical applications

### Related fields

স্লাইডে related area হিসেবে দেওয়া হয়েছে:

- Machine Learning
- Speech Processing
- Artificial Intelligence
- Information Retrieval
- Statistics
- Language processing জড়িত যেকোনো field, যেমন:
  - literature;
  - history;
  - digital humanities;
  - social sciences;
  - sociology;
  - psychology;
  - law;
  - biology।

### Typical NLP applications

স্লাইডে list করা হয়েছে:

- machine translation;
- sentiment analysis;
- information extraction;
- text summarisation;
- question answering;
- dialogue systems;
- আরও অনেক।

---

# Part II — Text-এর Vector Representations

## 9. Central question

লেকচারের দ্বিতীয় অংশে প্রশ্ন করা হয়েছে:

```text
Why do we need vector representations of text?
How can we transform raw text to a vector?
```

এটি language-as-strings/symbols থেকে language-as-numerical-data-তে bridge তৈরি করে, যাতে machine learning algorithms ব্যবহার করা যায়।

---

## 10. Vectors and vector spaces

### Key concept: Vector / embedding

**Intuition/সহজ ধারণা:** একটি vector কোনো item-কে সংখ্যার list হিসেবে represent করে।

**Formal lecture definition/লেকচারের formal সংজ্ঞা:** একটি vector, যাকে embedding-ও বলা হয়, $x$, হলো $d$ elements বা coordinates-এর one-dimensional array। প্রতিটি coordinate একটি index $i \in d$ দিয়ে identify করা যায়। Example: $x_1 = 2$।

একটি vector লেখা যায়:

$$
x = [x_1, x_2, \ldots, x_d]
$$

যেখানে:

- $d$ হলো dimensionality;
- $x_i$ হলো coordinate $i$-এর value।

### Key concept: Matrix / vector space

**Intuition/সহজ ধারণা:** একটি matrix একসঙ্গে অনেক vector store করে।

**Formal lecture definition/লেকচারের formal সংজ্ঞা:** $n$ vectors-এর collection হলো size $n \times d$-এর matrix $X$, যাকে vector space-ও বলা হয়।

$$
X =
\begin{bmatrix}
x_{1,1} & x_{1,2} & \cdots & x_{1,d} \\
x_{2,1} & x_{2,2} & \cdots & x_{2,d} \\
\vdots & \vdots & \ddots & \vdots \\
x_{n,1} & x_{n,2} & \cdots & x_{n,d}
\end{bmatrix}
$$

যেখানে:

- rows correspond করে vectors/items-এর সঙ্গে;
- columns correspond করে dimensions/features-এর সঙ্গে।

### Indexing note

স্লাইডে explicitly বলা হয়েছে:

```text
In Python indices start from 0.
```

**Important practical point/গুরুত্বপূর্ণ practical point:** Mathematical notation প্রায়ই 1 থেকে index করে, কিন্তু Python array index করে 0 থেকে।

---

## 11. Vectors-এর similarity মাপা

স্লাইডে প্রশ্ন করা হয়েছে কীভাবে মাপা যায় যে $x_1$, $x_3$-এর চেয়ে $x_2$-এর কাছে। এখান থেকে vector similarity ধারণা আসে।

---

## 12. Dot product

### Key concept: Dot product / inner product

**Intuition/সহজ ধারণা:** Dot product দুইটি vector-এর matching coordinate multiply করে সেগুলো sum করে একটি single number তৈরি করে।

**Formal lecture definition/লেকচারের formal সংজ্ঞা:** Dot product দুইটি equal-length number sequence বা vector নেয় এবং একটি single number return করে।

দুইটি $d$-dimensional vector $x_1$ ও $x_2$-এর জন্য:

$$
\operatorname{dot}(x_1, x_2)
=
x_1 \cdot x_2
=
x_1x_2^\top
=
\sum_{i=1}^{d} x_{1,i}x_{2,i}
$$

Expanded:

$$
x_1 \cdot x_2
=
x_{1,1}x_{2,1}
+
x_{1,2}x_{2,2}
+
\cdots
+
x_{1,d}x_{2,d}
$$

---

## 13. Vector norm / length / magnitude

### Key concept: Norm

**Intuition/সহজ ধারণা:** Norm হলো একটি vector-এর length বা magnitude।

স্লাইডে দেওয়া হয়েছে:

$$
|x|
=
\sqrt{x \cdot x}
=
\sqrt{x_1^2 + x_2^2 + \cdots + x_d^2}
$$

এটি cosine similarity-তে ব্যবহৃত হয়।

---

## 14. Cosine similarity

### Key concept: Cosine similarity

**Intuition/সহজ ধারণা:** Cosine similarity দুইটি vector-এর raw size নয়, বরং direction compare করে। এটি dot product-কে vector lengths দিয়ে normalise করে।

**Formal lecture definition/লেকচারের formal সংজ্ঞা:**

$$
\operatorname{cosine}(x_1, x_2)
=
\frac{x_1 \cdot x_2}{|x_1||x_2|}
$$

Summation notation ব্যবহার করে:

$$
\operatorname{cosine}(x_1, x_2)
=
\frac{
\sum_{i=1}^{d} x_{1,i}x_{2,i}
}{
\sqrt{\sum_{i=1}^{d}x_{1,i}^2}
\sqrt{\sum_{i=1}^{d}x_{2,i}^2}
}
$$

স্লাইডে cosine similarity-কে normalised dot product বলা হয়েছে।

[UNCLEAR/অস্পষ্ট] Parsed slide text-এ cosine formula-এর একটি অংশ garbled ছিল। উপরের cleaned formula দৃশ্যমান structure অনুসরণ করে: dot product divided by product of vector norms।

---

## 15. Vector spaces of text

স্লাইডে জিজ্ঞেস করা হয়েছে text data-এর জন্য rows ও columns কী বোঝায়।

দুইটি major matrix type introduce করা হয়েছে:

1. **Word-word matrix**, যাকে **term-context** matrix-ও বলা হয়।
2. **Document-word matrix**, যাকে **bag-of-words** matrix-ও বলা হয়।

---

## 16. Text-এর vector representation কেন দরকার

স্লাইডে তিনটি main motivation দেওয়া হয়েছে।

### 16.1 Semantic similarity-এর জন্য word meaning encode করা

Example question:

```text
Is basketball more similar to football or recipe?
```

একটি vector representation-এর উচিত semantically related word-গুলোকে vector space-এ কাছাকাছি রাখা।

### 16.2 Document retrieval

Example:

```text
Retrieve documents relevant to a query.
```

এর মধ্যে web search-এর মতো application অন্তর্ভুক্ত।

### 16.3 Textual data-তে machine learning apply করা

অনেক clustering ও classification algorithm raw string নয়, vector-এর ওপর operate করে।

স্লাইডে explicitly বলা হয়েছে:

```text
We are going to see a lot of this during this course!
```

[COURSE EMPHASIS/কোর্সের গুরুত্ব] Vector representations এই course-এর recurring concept।

---

# Text units ও preprocessing

## 17. Text units

স্লাইডে raw text, words/tokens/terms, এবং documents/text sequences introduce করা হয়েছে।

### Example raw text

```text
As far as I’m concerned, this is Lynch at his best. ‘Lost Highway’ is a
dark, violent, surreal, beautiful, hallucinatory masterpiece. 10 out of 10
stars.
```

### Key concept: Word / token / term

**Lecture definition/লেকচারের সংজ্ঞা:** Word, token, বা term হলো এক বা একাধিক character-এর sequence, যেখানে whitespace থাকে না। কখনও কখনও এটি n-gram দিয়ে গঠিত হয়।

### Key concept: Document / text sequence / snippet

**Lecture definition/লেকচারের সংজ্ঞা:** Document হতে পারে sentence, paragraph, section, chapter, entire document, search query, social media post, transcribed utterance, অথবা pseudo-document যেমন কোনো user-এর সব tweets।

**Intuition/সহজ ধারণা:** NLP-তে “document” বলতে সবসময় full formal document বোঝায় না। Representation-এর জন্য বেছে নেওয়া যেকোনো text unit document হতে পারে।

---

## 18. Tokenisation

### Key concept: Tokenisation

**Intuition/সহজ ধারণা:** Tokenisation raw text-কে ছোট unit বা token-এ split করে।

**Lecture definition/লেকচারের সংজ্ঞা:** Tokenisation raw text থেকে tokens obtain করে। সবচেয়ে simple form হলো whitespace দিয়ে split করা বা regular expressions ব্যবহার করা।

### Worked example: Lynch review tokenise করা

Raw text:

```text
As far as I’m concerned, this is Lynch at his best. ‘Lost Highway’ is a
dark, violent, surreal, beautiful, hallucinatory masterpiece. 10 out of 10
stars.
```

স্লাইডে দেখানো tokenised text:

```text
As far as I’m concerned , this is Lynch at his best . ‘ Lost Highway ’ is a
dark , violent , surreal , beautiful , hallucinatory masterpiece . 10 out of
10 stars .
```

Punctuation আলাদা token হিসেবে separated হয়েছে।

---

## 19. Other preprocessing options

Tokenisation-এর পর স্লাইডে possible preprocessing steps list করা হয়েছে:

- lowercasing;
- punctuation removal;
- number removal;
- stop word removal;
- infrequent word removal;
- stemming।

### Worked example: Lynch review preprocess করা

Tokenised text:

```text
As far as I’m concerned , this is Lynch at his best . ‘ Lost Highway ’ is a
dark , violent , surreal , beautiful , hallucinatory masterpiece . 10 out of
10 stars .
```

Lowercasing plus punctuation ও stop word removal-এর পর preprocessed text:

```text
concerned lynch best lost highway dark violent surreal beautiful
hallucinatory masterpiece 10 10 stars
```

[UNCLEAR/অস্পষ্ট] স্লাইডে “punctuation/stop word removal” বলা হয়েছে, কিন্তু numbers `10 10` রাখা হয়েছে। আগের bullet list-এ number removal option হিসেবে ছিল, কিন্তু এই example-এ সম্ভবত apply করা হয়নি।

---

## 20. Vocabulary obtain করা

### Key concept: Vocabulary

**Intuition/সহজ ধারণা:** Vocabulary হলো unique words/features-এর set, যা representation ব্যবহার করবে।

**Formal lecture definition/লেকচারের formal সংজ্ঞা:** ধরা যাক corpus $D$-তে $m$ preprocessed texts আছে। Vocabulary $V$ হলো $D$-এর সব $k$ unique words $w_i$-এর set:

$$
V = \{w_1, \ldots, w_k\}
$$

Vocabulary প্রায়ই n-gram অন্তর্ভুক্ত করতে extend করা হয়; n-gram হলো $n$ words-এর contiguous sequence।

---

# Word representations

## 21. Discrete vectors / one-hot encoding

### Key concept: One-hot encoding

**Intuition/সহজ ধারণা:** প্রতিটি word-কে এমন একটি vector দিয়ে represent করা যেখানে একটি entry `1`, বাকি সব entry `0`। `1`-এর position word-টিকে identify করে।

### Worked example: toy text থেকে vocabulary

Text:

```text
love pineapple apricot apple chocolate apple pie
```

স্লাইডে দেখানো unique vocabulary:

$$
V = \{\text{apple}, \text{apricot}, \text{chocolate}, \text{love}, \text{pie}, \text{pineapple}\}
$$

Vocabulary size:

$$
|V| = 6
$$

One-hot vector examples:

$$
\text{apricot} = x_2 = [0,1,0,0,0,0]
$$

$$
\text{pineapple} = x_3 = [0,0,0,0,0,1]
$$

এগুলো discrete vectors, কারণ প্রতিটি word একটি distinct symbolic category হিসেবে represented।

---

## 22. One-hot / discrete vectors-এর সমস্যা

স্লাইডে `apricot` এবং `pineapple`-এর dot product ও cosine similarity compute করা হয়েছে।

Given:

$$
x_2 = [0,1,0,0,0,0]
$$

$$
x_3 = [0,0,0,0,0,1]
$$

### Dot product derivation

$$
\operatorname{dot}(x_2,x_3)
=
0\cdot0
+
1\cdot0
+
0\cdot0
+
0\cdot0
+
0\cdot0
+
0\cdot1
$$

$$
= 0
$$

### Cosine similarity derivation

$$
\operatorname{cosine}(x_2,x_3)
=
\frac{x_2 \cdot x_3}{|x_2||x_3|}
$$

যেহেতু:

$$
x_2 \cdot x_3 = 0
$$

এবং দুইটি one-hot vector-এর norm 1:

$$
|x_2| = 1,\quad |x_3| = 1
$$

তাই:

$$
\operatorname{cosine}(x_2,x_3)
=
\frac{0}{1 \cdot 1}
=
0
$$

### Conclusion/উপসংহার

One-hot encoding-এ প্রতিটি word অন্য প্রতিটি word থেকে equally different, কারণ আলাদা one-hot vectors orthogonal।

কিন্তু এটি unsatisfactory, কারণ:

```text
apricot and pineapple are related.
```

স্লাইড এরপর জিজ্ঞেস করে contextual information useful হবে কিনা।

---

# Contextual meaning ও distributional semantics

## 23. Quick test: “What is tesguino?”

লেকচারে context কীভাবে meaning infer করতে সাহায্য করে তা দেখাতে একটি example ব্যবহার করা হয়েছে।

দেখানো sentences:

```text
A bottle of tesguino is on the table.
Everybody likes an ice cold tesguino.
Tesguino makes you drunk.
We make tesguino out of corn.
```

এরপর স্লাইড reveal করে:

```text
Tesguino is a beer made from corn.
```

### Key point/মূল কথা

Word-টি আগে না জানলেও surrounding context clue দেয়:

- “bottle” drink suggest করে;
- “ice cold” beverage suggest করে;
- “makes you drunk” alcohol suggest করে;
- “out of corn” ingredient/source suggest করে।

**Connection/সংযোগ:** এটি distributional hypothesis motivate করে।

---

## 24. Distributional Hypothesis

### Key concept: Distributional Hypothesis

**Intuition/সহজ ধারণা:** একটি word-এর meaning তার surrounding words ও contexts থেকে infer করা যায়।

**Formal lecture statement/লেকচারের statement:** Firth (1957):

```text
You shall know a word by the company it keeps!
```

স্লাইডে বলা হয়েছে:

```text
Words appearing in similar contexts are likely to have similar meanings.
```

এটি word-word co-occurrence matrices এবং বহু word vector method-এর conceptual foundation।

---

# Word-word matrices

## 25. Word-word matrix / term-context matrix

### Key concept: Word-word matrix

**Intuition/সহজ ধারণা:** কোনো word-এর কাছাকাছি যে context words আসে, সেগুলো count করে word-টিকে represent করা।

**Formal lecture definition/লেকচারের formal সংজ্ঞা:** Word-word matrix $X$ হলো $n \times m$ matrix, যেখানে:

$$
n = |V|
$$

হলো target words-এর সংখ্যা, এবং

$$
m = |V_c|
$$

হলো context words-এর সংখ্যা।

প্রতিটি word $x_i \in V$-এর জন্য count করা হয় এটি context words $x_j$-এর সঙ্গে কতবার co-occur করে।

### Context window

স্লাইডে context define করা হয়েছে $\pm k$ words-এর window দিয়ে:

- target word-এর বামে $k$ words;
- target word-এর ডানে $k$ words।

Counts একটি large corpus-এ compute করা হয়, যেমন entire Wikipedia।

সাধারণত:

$$
V = V_c
$$

অর্থাৎ target word vocabulary ও context word vocabulary একই। এই ক্ষেত্রে word-word matrix square হয়।

---

## 26. Worked example: apricot, pineapple, digital, information-এর word-word matrix

স্লাইডে context words দেখানো হয়েছে যেমন:

```text
aardvark, computer, data, pinch, result, sugar, ...
```

Rows include:

```text
apricot
pineapple
digital
information
```

স্লাইডের key point:

```text
Now apricot and pineapple vectors look more similar.
```

Shown results:

$$
\operatorname{cosine}(\text{apricot}, \text{pineapple}) = 1
$$

$$
\operatorname{cosine}(\text{apricot}, \text{digital}) = 0
$$

### Interpretation/ব্যাখ্যা

- `apricot` ও `pineapple` একই ধরনের context word যেমন `pinch` ও `sugar`-এর সঙ্গে occur করে।
- `digital` ভিন্ন context word যেমন `computer`, `data`, এবং `result`-এর সঙ্গে occur করে।
- তাই context-based vector one-hot encoding-এর চেয়ে semantic relatedness ভালোভাবে reflect করতে পারে।

[UNCLEAR/অস্পষ্ট] Exact matrix entries slide image থেকে এসেছে। Main displayed answer clear, কিন্তু full table দরকার হলে slide/recording check করুন।

---

## 27. Context types

স্লাইডে বলা হয়েছে linguistic information ব্যবহার করে context refine করা যায়।

Examples:

- part-of-speech tags:
  - `bank V` vs. `bank N`;
- syntactic dependencies:
  - `eat dobj` vs. `eat subj`।

### Key concept: Linguistically refined context

**Intuition/সহজ ধারণা:** কাছাকাছি word-গুলোকে plain context হিসেবে treat করার বদলে grammatical information অন্তর্ভুক্ত করা, যাতে different uses বা syntactic relations আরও precisely distinguish করা যায়।

**Example intuition from slide/স্লাইডের উদাহরণ:**

- `bank` verb হিসেবে noun `bank` থেকে আলাদা।
- `eat`-এর direct object হিসেবে appearing word, `eat`-এর subject হিসেবে appearing word থেকে আলাদা।

---

# Document representations

## 28. Document-word matrix / bag-of-words

### Key concept: Document-word matrix

**Intuition/সহজ ধারণা:** প্রতিটি document-এ প্রতিটি vocabulary word কতবার এসেছে তা count করে document represent করা।

**Formal lecture definition/লেকচারের formal সংজ্ঞা:** Document-word matrix $X$ হলো এই size-এর matrix:

$$
|D| \times |V|
$$

যেখানে:

- rows হলো corpus $D$-এর documents;
- columns হলো vocabulary $V$-এর words।

প্রতিটি document-এর জন্য count করা হয় প্রতিটি word $w \in V$ কতবার এসেছে।

### Worked example: bag-of-words table

| Document | bad | good | great | terrible |
|---|---:|---:|---:|---:|
| Doc 1 | 14 | 1 | 0 | 5 |
| Doc 2 | 2 | 5 | 3 | 0 |
| Doc 3 | 0 | 2 | 5 | 0 |

### Alternative construction

স্লাইডে বলা হয়েছে $X$ এভাবেও পাওয়া যায়:

1. প্রতিটি document-এর words-এর one-hot vectors নেওয়া;
2. সেই one-hot vectors যোগ করা;
3. document-word matrix orientation পেতে প্রয়োজনমতো transpose করা।

---

# Raw counts-এর সমস্যা

## 29. Frequent words dominate

Raw count vector-এর একটি বড় সমস্যা:

```text
Frequent words, such as articles and pronouns, dominate contexts without being informative.
```

স্লাইডে context vocabulary-তে `the` word যোগ করে এটি illustrate করা হয়েছে।

---

## 30. Worked example: “the” word misleading similarity তৈরি করে

Vocabulary:

```text
[aadvark, computer, data, pinch, result, sugar, the]
```

[UNCLEAR/অস্পষ্ট] স্লাইডে spelling `aadvark`; সম্ভবত intended spelling `aardvark`, কিন্তু deck-এর সঙ্গে match করার জন্য slide spelling preserve করা হয়েছে।

Vectors:

$$
\text{apricot} = x_2 = [0,0,0,1,0,1,30]
$$

$$
\text{digital} = x_3 = [0,2,1,0,1,0,45]
$$

এখানে একমাত্র বড় shared contribution আসে `the` থেকে।

### Dot product

$$
x_2 \cdot x_3
=
0\cdot0
+
0\cdot2
+
0\cdot1
+
1\cdot0
+
0\cdot1
+
1\cdot0
+
30\cdot45
$$

$$
= 1350
$$

### Norms

$x_2$-এর জন্য:

$$
|x_2|
=
\sqrt{0^2+0^2+0^2+1^2+0^2+1^2+30^2}
$$

$$
=
\sqrt{902}
$$

$x_3$-এর জন্য:

$$
|x_3|
=
\sqrt{0^2+2^2+1^2+0^2+1^2+0^2+45^2}
$$

$$
=
\sqrt{2031}
$$

### Cosine similarity

$$
\operatorname{cosine}(x_2,x_3)
=
\frac{30 \cdot 45}{\sqrt{902}\sqrt{2031}}
$$

$$
=
0.997
$$

### Conclusion/উপসংহার

`apricot` ও `digital`-এর vectors প্রায় maximally similar হয়ে যায়, কারণ দুটোই `the`-এর সঙ্গে অনেকবার occur করে, যদিও `the` semantically informative নয়।

স্লাইডে বলা হয়েছে এই problem document-word matrices-এর ক্ষেত্রেও প্রযোজ্য।

### Solution/সমাধান

```text
Weight the vectors.
```

---

# Word-word matrices weighting

## 31. Distance discount

### Key concept: Distance discount

**Intuition/সহজ ধারণা:** Target word-এর কাছের word দূরের word-এর চেয়ে বেশি গুরুত্বপূর্ণ হওয়া উচিত।

স্লাইডে বলা হয়েছে:

```text
Weight contexts according to the distance from the word: the further away, the lower the weight.
```

Window size $\pm k$-এর জন্য, $k=3$ হলে স্লাইডে weights দেওয়া হয়েছে:

$$
\left[
\frac{1}{3},
\frac{2}{3},
\frac{3}{3},
\text{word},
\frac{3}{3},
\frac{2}{3},
\frac{1}{3}
\right]
$$

এর অর্থ:

- farthest context word weight পায় $1/3$;
- middle context word weight পায় $2/3$;
- nearest context word weight পায় $3/3 = 1$।

[UNCLEAR/অস্পষ্ট] স্লাইড text-এ প্রতিটি context word-কে $(k-\text{distance})/k$ ধরনের কিছু দিয়ে multiply করার কথা বলা হয়েছে, কিন্তু $k=3$-এর displayed example nearest-context weight $3/3$ এবং farthest-context weight $1/3$-এর সঙ্গে match করে। Precise distance indexing convention-এর জন্য recording বা slide formula check করুন।

---

## 32. Pointwise Mutual Information, PMI

### Key concept: PMI

**Intuition/সহজ ধারণা:** PMI measure করে দুটি word কতটা strongly associated, অর্থাৎ তারা একসঙ্গে যতবার occur করে তা independentভাবে occur করলে expected frequency-এর তুলনায় কত বেশি/কম।

**Formal lecture definition/লেকচারের formal সংজ্ঞা:**

$$
PMI(w_i,w_j)
=
\log_2
\frac{P(w_i,w_j)}{P(w_i)P(w_j)}
$$

স্লাইডে define করা হয়েছে:

$$
P(w_i,w_j)
=
\frac{\#(w_i,w_j)}{|D|}
$$

$$
P(w_i)
=
\frac{\#(w_i)}{|D|}
$$

যেখানে:

- $\#(\cdot)$ count denote করে;
- $|D|$ হলো corpus-এ observed words-এর সংখ্যা।

PMI formula-তে probabilities substitute করলে:

$$
PMI(w_i,w_j)
=
\log_2
\frac{
\#(w_i,w_j)/|D|
}{
(\#(w_i)/|D|)(\#(w_j)/|D|)
}
$$

$$
=
\log_2
\frac{
\#(w_i,w_j)|D|
}{
\#(w_i)\#(w_j)
}
$$

[UNCLEAR/অস্পষ্ট] Parsed slide formula-এর denominator-এ `#(w1)` আছে। Slide/recording দিয়ে এটি check করা উচিত; surrounding notation অনুযায়ী intended count সম্ভবত $w_i$-এর জন্য।

### Interpretation/ব্যাখ্যা

- Positive PMI values relatedness quantify করে।
- স্লাইডে raw counts-এর বদলে PMI use করতে বলা হয়েছে।

---

## 33. Positive PMI, PPMI

### Key concept: PPMI

**Intuition/সহজ ধারণা:** Negative PMI values প্রায়ই ignore করা হয়; শুধু positive association strengths রাখা হয়।

**Formal lecture definition/লেকচারের formal সংজ্ঞা:**

$$
PPMI(w_i,w_j)
=
\max(PMI(w_i,w_j),0)
$$

স্লাইডে এটিকে “positive PMI” বলা হয়েছে।

---

# Document-word matrices weighting

## 34. TF.IDF

### Key concept: TF.IDF

**Intuition/সহজ ধারণা:** TF.IDF corpus-এর তুলনায় কোনো document-এ কোনো word-এর importance represent করে।

এটি দুটি idea combine করে:

1. কোনো word একটি document-এ frequently appear করলে সেটি document-টির জন্য important হতে পারে।
2. কোনো word অনেক document-এ appear করলে সেটি distinguishing feature হিসেবে কম useful।

---

## 35. Term Frequency, TF

### Key concept: Term Frequency

**Intuition/সহজ ধারণা:** কোনো term একটি document-এ frequently appear করলে সেটি document-টির জন্য important হওয়ার সম্ভাবনা বেশি।

স্লাইডে TF conceptually define করা হয়েছে; আলাদা formula দেওয়া হয়নি।

---

## 36. Inverse Document Frequency, IDF

### Key concept: IDF

**Intuition/সহজ ধারণা:** কোনো term অনেক document-এ appear করলে distinguishing feature হিসেবে সেটি কম informative।

**Formal lecture definition/লেকচারের formal সংজ্ঞা:**

$$
idf_w
=
\log_{10}
\frac{N}{df_w}
$$

যেখানে:

- $N$ হলো corpus-এর document সংখ্যা;
- $df_w$ হলো word $w$-এর document frequency।

---

## 37. TF.IDF weight

স্লাইডে দেওয়া হয়েছে:

$$
x_{id}
=
tf_{id}
\log_{10}
\frac{N}{df_{id}}
$$

একই idea-এর cleaned notation:

$$
x_{i,d}
=
tf_{i,d}
\log_{10}
\frac{N}{df_i}
$$

যেখানে:

- $x_{i,d}$ হলো document $d$-এ term $i$-এর weighted value;
- $tf_{i,d}$ হলো document $d$-এ term $i$-এর term frequency;
- $df_i$ হলো term $i$-এর document frequency;
- $N$ হলো document সংখ্যা।

[UNCLEAR/অস্পষ্ট] Slide notation-এ `dfid` ব্যবহার করা হয়েছে, কিন্তু ঠিক আগে IDF define করা হয়েছে $df_w$ হিসেবে, অর্থাৎ word $w$-এর document frequency। Exam-এর জন্য exact lecturer notation verify করুন।

---

# Dimensionality ও sparsity

## 38. Dimensionality-এর সমস্যা

স্লাইডে বলা হয়েছে count-based matrices প্রায়ই ভালো কাজ করে, কিন্তু দুটি বড় সমস্যা আছে।

### 38.1 High dimensionality

Vocabulary size millions হতে পারে।

তাই:

- word vectors-এর millions dimensions থাকতে পারে;
- document vectors-এরও প্রতি vocabulary term-এর জন্য একটি dimension থাকতে পারে।

### 38.2 Sparsity

Matrices খুব sparse হয়, কারণ:

- words খুব অল্প সংখ্যক other words-এর সঙ্গে co-occur করে;
- documents পুরো vocabulary-এর খুব ছোট subset ধারণ করে।

### Solution direction

স্লাইডে বলা হয়েছে:

```text
Dimensionality Reduction to the rescue!
```

এটি এই লেকচারে detail-এ develop করা হয়নি; পরবর্তী solution direction হিসেবে introduce করা হয়েছে।

---

# Vectors-এর evaluation

## 39. Word vectors-এর evaluation

স্লাইডে evaluation দুই ভাগে ভাগ করা হয়েছে: intrinsic ও extrinsic evaluation।

### Key concept: Intrinsic evaluation

**Intuition/সহজ ধারণা:** Vector-কে কোনো full downstream application-এ না ঢুকিয়ে, vector-এর সরাসরি property evaluate করা যা এটি capture করার কথা।

Word vectors-এর জন্য intrinsic evaluation include করে:

- **similarity**
  - word pairs-কে semantic similarity অনুযায়ী order করা;
- **in-context similarity**
  - sentence-এর meaning না বদলে একটি word substitute করা;
- **analogy**
  - example:

```text
Beijing is to China what Rome is to ...?
```

### Key concept: Extrinsic evaluation

**Intuition/সহজ ধারণা:** Vector কোনো actual NLP task-এর performance improve করে কিনা তা evaluate করা।

Word vectors-এর জন্য examples:

- sentiment classification;
- named entity recognition, NER।

---

## 40. “Best” word vectors

স্লাইডে প্রশ্ন করা হয়েছে best word vectors কি high-dimensional count-based vectors?

দেওয়া answer nuanced:

- পরবর্তী lectures-এ neural networks দিয়ে low-dimensional vectors কীভাবে obtain করা যায় তা দেখা হবে।
- Levy et al. (2015) দেখিয়েছেন যে choices যেমন:
  - context window size;
  - rare word removal;
  - অন্যান্য configuration choices;
  বেশি matter করে।
- Counts obtain করতে কোন texts ব্যবহার করা হচ্ছে সেটিও matter করে।
- More text is better।
- Low-dimensional methods scale better।

**Connection/সংযোগ:** এটি neural word embeddings ও পরবর্তী language modelling material-এর দিকে ইঙ্গিত করে।

---

## 41. Document vectors-এর evaluation

স্লাইডে আবার evaluation intrinsic ও extrinsic ভাগে ভাগ করা হয়েছে।

### Intrinsic evaluation for document vectors

- document similarity;
- information retrieval।

### Extrinsic evaluation for document vectors

- text classification;
- plagiarism detection।

---

# Limitations

## 42. Word vectors-এর limitations

### 42.1 Polysemy

#### Key concept: Polysemy

**Intuition/সহজ ধারণা:** একটি word-এর multiple meanings থাকতে পারে।

স্লাইডে বলা হয়েছে:

```text
All occurrences of a word, and all its senses, are represented by one vector.
```

Example:

```text
bank
```

Task অনুযায়ী appropriate sense represent করার জন্য word vectors adapt করা useful হতে পারে।

---

### 42.2 Antonyms vs. synonyms

স্লাইডে বলা হয়েছে:

```text
Antonyms appear in similar contexts, hard to distinguish them from synonyms.
```

**Intuition/সহজ ধারণা:** Opposite meaning-ওয়ালা words similar context-এ appear করতে পারে। Distributional methods context-এর ওপর rely করে বলে antonyms-কে কাছাকাছি place করতে পারে।

---

### 42.3 Compositionality

#### Key concept: Compositionality

**Intuition/সহজ ধারণা:** Word sequence-এর meaning নির্ভর করে individual word meanings কীভাবে combine হচ্ছে তার ওপর।

স্লাইডে প্রশ্ন করা হয়েছে:

```text
What is the meaning of a sequence of words?
```

স্লাইডে বলা হয়েছে:

- short phrases-এর জন্য context vectors obtain করা সম্ভব হতে পারে।
- কিন্তু এটি whole sentences, paragraphs, ইত্যাদিতে scale করে না।

Possible solution directions:

- word vectors combine করা:
  - add;
  - multiply;
- sentenceBERT, etc.

---

## 43. Document vectors-এর limitations

স্লাইডে একটি central limitation দেওয়া হয়েছে:

```text
Word order is ignored, but language is sequential!
```

এটি bag-of-words document vectors-এর ক্ষেত্রে প্রযোজ্য।

### Key concept: Bag-of-words limitation

**Intuition/সহজ ধারণা:** Bag-of-words representations words count করে কিন্তু sequence ignore করে। ফলে word order সম্পর্কে information হারিয়ে যায়, যদিও language-এ word order গুরুত্বপূর্ণ।

---

# Algorithm-style summary: raw text থেকে vector

## Pipeline A: document-word representation

1. Raw text documents দিয়ে শুরু।
2. প্রতিটি document tokenise করা।
   - Whitespace দিয়ে split করা বা regular expressions ব্যবহার করা।
3. Optionally preprocess করা।
   - Lowercase।
   - Punctuation remove।
   - Numbers remove।
   - Stop words remove।
   - Infrequent words remove।
   - Stem।
4. Vocabulary build করা:

$$
V = \{w_1,\ldots,w_k\}
$$

5. Matrix তৈরি করা:

$$
X \in \mathbb{R}^{|D| \times |V|}
$$

6. প্রতিটি document $d$-এর জন্য প্রতিটি word $w \in V$-এর occurrences count করা।
7. Optionally TF.IDF দিয়ে counts weight করা:

$$
x_{i,d}
=
tf_{i,d}
\log_{10}
\frac{N}{df_i}
$$

8. Resulting document vectors ব্যবহার করা:
   - similarity;
   - retrieval;
   - classification;
   - plagiarism detection।

---

## Pipeline B: word-word representation

1. Large corpus দিয়ে শুরু।
2. Tokenise ও preprocess করা।
3. Target vocabulary $V$ build করা।
4. Context vocabulary $V_c$ build করা।
5. Matrix তৈরি করা:

$$
X \in \mathbb{R}^{|V| \times |V_c|}
$$

6. প্রতিটি target word $w_i$-এর জন্য $\pm k$ context window-এর মধ্যে context words $w_j$ count করা।
7. Optionally context refine করা:
   - part-of-speech tags;
   - syntactic dependencies।
8. Optionally co-occurrences weight করা:
   - distance discount;
   - PMI;
   - PPMI।
9. Word vectors compare করা:
   - dot product;
   - cosine similarity।

---

# Worked examples recap

## Example 1: One-hot encoding

Text:

```text
love pineapple apricot apple chocolate apple pie
```

Vocabulary:

$$
V = \{\text{apple}, \text{apricot}, \text{chocolate}, \text{love}, \text{pie}, \text{pineapple}\}
$$

$$
|V| = 6
$$

Vectors:

$$
\text{apricot} = [0,1,0,0,0,0]
$$

$$
\text{pineapple} = [0,0,0,0,0,1]
$$

Similarity:

$$
\operatorname{dot} = 0
$$

$$
\operatorname{cosine} = 0
$$

Conclusion:

```text
One-hot encoding cannot capture that apricot and pineapple are related.
```

---

## Example 2: “tesguino” infer করা

Context sentences:

```text
A bottle of tesguino is on the table.
Everybody likes an ice cold tesguino.
Tesguino makes you drunk.
We make tesguino out of corn.
```

Answer:

```text
Tesguino is a beer made from corn.
```

Conclusion:

```text
Context gives clues to meaning.
```

---

## Example 3: Word-word matrix

Displayed result:

$$
\operatorname{cosine}(\text{apricot}, \text{pineapple}) = 1
$$

$$
\operatorname{cosine}(\text{apricot}, \text{digital}) = 0
$$

Conclusion:

```text
Context-based vectors can represent semantic relatedness better than one-hot vectors.
```

---

## Example 4: Document-word matrix

| Document | bad | good | great | terrible |
|---|---:|---:|---:|---:|
| Doc 1 | 14 | 1 | 0 | 5 |
| Doc 2 | 2 | 5 | 3 | 0 |
| Doc 3 | 0 | 2 | 5 | 0 |

Conclusion:

```text
Documents can be represented as count vectors over vocabulary words.
```

---

## Example 5: Frequent word problem

Vectors:

$$
x_2 = [0,0,0,1,0,1,30]
$$

$$
x_3 = [0,2,1,0,1,0,45]
$$

Cosine:

$$
\operatorname{cosine}(x_2,x_3)
=
\frac{30\cdot45}{\sqrt{902}\sqrt{2031}}
=
0.997
$$

Conclusion:

```text
The frequent word “the” makes unrelated vectors look highly similar.
```

Solution:

```text
Weight the vectors.
```

---

# Exam flags ও high-value emphasis

## Explicit exam flags found

Slide deck-এ explicit “this will be on the exam” বা equivalent exam statement পাওয়া যায়নি।

[UNCLEAR/অস্পষ্ট] Transcript দেওয়া হয়নি, তাই spoken exam hints missing থাকতে পারে।

## High-value course emphasis from slides

[COURSE EMPHASIS/কোর্সের গুরুত্ব] Vector representations কেন দরকার সেই slide-এ বলা হয়েছে clustering ও classification algorithms vectors-এর ওপর operate করে এবং:

```text
We are going to see a lot of this during this course!
```

তাই vector representation exam revision-এর central topic।

[HIGH VALUE/উচ্চ মূল্য] পার্থক্য জানুন:

- NLP and Text Mining;
- NLP and Machine Learning;
- NLP and Computational Linguistics।

[HIGH VALUE/উচ্চ মূল্য] Text-to-vector pipeline জানুন:

```text
raw text → tokenisation → preprocessing → vocabulary → vector/matrix representation → weighting/evaluation
```

[HIGH VALUE/উচ্চ মূল্য] Define ও use করতে জানতে হবে:

- dot product;
- vector norm;
- cosine similarity;
- one-hot encoding;
- word-word matrix;
- document-word matrix;
- PMI;
- PPMI;
- TF.IDF।

[HIGH VALUE/উচ্চ মূল্য] Limitations explain করতে জানতে হবে:

- one-hot vectors সব আলাদা word-কে equally different বানায়;
- frequent words raw count vectors dominate করে;
- count matrices high-dimensional ও sparse;
- word vectors polysemy, antonymy, এবং compositionality নিয়ে struggle করে;
- bag-of-words document vectors word order ignore করে।

---

# Other material-এর সঙ্গে connections

- **Later language modelling:** Final slide-এ next topic হিসেবে language modelling বলা হয়েছে।
- **Later neural networks:** “best word vectors” slide-এ বলা হয়েছে later lecture-এ neural networks দিয়ে low-dimensional vectors obtain করা শেখানো হবে।
- **Transformers and LLMs:** Course goals এই lecture-এর foundation-কে transformers, modern LLM architectures, pre-training, এবং instruction tuning-এর সঙ্গে connect করে।
- **Information retrieval:** Document vectors সরাসরি web search-এর মতো retrieval tasks-এর সঙ্গে connect করে।
- **Machine learning:** Vector representations দরকার কারণ clustering ও classification algorithms vectors-এর ওপর operate করে।
- **Digital humanities and law:** Historical legal text analytics NLP/Text Mining-কে historical records, legal concepts, এবং social/legal evolution-এর সঙ্গে connect করে।
- **Computational linguistics:** Lecture-এ NLP applications এবং linguistic phenomena study করতে ব্যবহৃত computational methods-এর পার্থক্য করা হয়েছে।

---

# Recording/slides-এ revisit করার unclear sections

- [UNCLEAR/অস্পষ্ট] Transcript অন্তর্ভুক্ত ছিল না, তাই speaker-specific comments, extra worked derivations, jokes, warnings, এবং explicit exam hints missing।
- [UNCLEAR/অস্পষ্ট] Chinese word segmentation example: দরকার হলে exact segmentation labels check করুন।
- [UNCLEAR/অস্পষ্ট] Cosine similarity formula text parsed slide-এ garbled। Clean formula প্রায় নিশ্চিতভাবে:

$$
\frac{x_1 \cdot x_2}{|x_1||x_2|}
$$

- [UNCLEAR/অস্পষ্ট] Distance discount formula: $k=3$-এর displayed weight pattern clear, কিন্তু parsed formula text example-এর সঙ্গে পুরোপুরি match করে না।
- [UNCLEAR/অস্পষ্ট] PMI formula denominator parsed slide-এ `#(w1)` হিসেবে দেখা যায়। Surrounding notation অনুযায়ী এটি $w_i$-এর count হওয়া উচিত, কিন্তু verify করুন।
- [UNCLEAR/অস্পষ্ট] TF.IDF final formula parsed slide-এ `dfid` ব্যবহার করেছে। Earlier definition uses $df_w$, word $w$-এর document frequency। Exact lecturer notation verify করুন।
- [UNCLEAR/অস্পষ্ট] Vocabulary example-এ `aadvark` spelling আছে; এটি সম্ভবত `aardvark`, কিন্তু slide spelling preserve করা হয়েছে।
- [UNCLEAR/অস্পষ্ট] ChatGPT/AGI slide-এর “a significant step towards AGI” claim lecturer কতটা seriously বা cautiously framed করেছেন তা জানতে transcript context দরকার।
