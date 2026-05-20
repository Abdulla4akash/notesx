---
subject: COMP64702
chapter: 1
title: "Introduction & Vector Representation"
language: en
---

# COMP64702 Study Notes — Introduction & Vector Representations of Text

**Topic and scope:** This lecture introduces Text Mining/NLP and explains why raw text must be transformed into numerical vector representations before machine learning methods can operate on it. It covers text preprocessing, one-hot vectors, word-word and document-word matrices, similarity measures, weighting schemes, evaluation, and limitations.

**Course:** COMP64702 — Transforming Text Into Meaning  
**Lecture topic:** Introduction & Vector Representations of Text  
**Sources used:** Uploaded lecture slide deck.  
**Transcript status:** [UNCLEAR] No transcript was provided in the conversation, so transcript-only details such as spoken exam hints, extra examples, or lecturer emphasis are missing.

---

## Part I — Introduction to Text Mining and NLP

### 1. Course context and goals

#### Course practicalities

- **Lecturers:**
  - Prof. Chenghua Lin
  - Dr. Jingyuan Sun
- **Lectures:** Mondays, 10:00–12:00 weekly.
- **Lecture slides:** released one week in advance.
- **Labs:** Fridays, 12:00–14:00 in Weeks 3, 5, 7, and 9.
- **Materials:** available on Canvas.
- **Assessment:**
  - Team coursework: 50%.
  - Final exam: 50%.
- **Coursework/labs:** Chenghua is fully responsible for coursework and for running the labs.
- **Support:**
  - 9 teaching assistants.
  - Canvas discussion forum.

#### Course goals

The course aims to develop:

- A solid understanding of text mining and NLP fundamentals, including:
  - text preprocessing;
  - text representations.
- Understanding of the evolution of language models leading to:
  - transformers;
  - modern large language model architectures.
- Understanding of traditional and state-of-the-art approaches to core NLP tasks, including transformer-based models.
- Understanding of how large language models are trained and aligned, including:
  - pre-training;
  - instruction tuning.
- Ability to systematically evaluate and compare performance of approaches to NLP tasks.
- Ability to work as a team to apply NLP methods to extract information and meaning from large-scale textual data.

**Connection:** This lecture provides the basic representational foundation for later topics in the course, including language modelling, transformers, LLMs, and NLP task evaluation.

---

## 2. Text Mining vs. NLP

### Key concept: Natural Language Processing, NLP

**Intuition:** NLP is about getting computers to process, model, and act on human language.

**Lecture definition:** NLP traditionally focuses on modelling linguistic structure and meaning, such as:

- syntax;
- semantics;
- discourse.

### Key concept: Text Mining

**Intuition:** Text mining is about finding useful information and patterns in large text collections.

**Lecture definition:** Text Mining traditionally focuses on discovering patterns and useful information from large text collections, for example topic modelling.

### Historical difference in emphasis

- **NLP:**
  - more linguistically oriented;
  - focuses on structure and meaning;
  - examples: syntax, semantics, discourse.
- **Text Mining:**
  - more data-mining oriented;
  - focuses on large-scale pattern discovery;
  - example: topic modelling.

### Increasing convergence

The distinction is now blurred because both fields increasingly share:

- representations;
- models;
- evaluation benchmarks;
- statistical language processing methods;
- neural language processing methods.

Modern large language models blur the distinction further.

---

## 3. Why Text Mining and NLP?

The lecture motivates NLP/Text Mining through applications.

### 3.1 Machine translation

The slide uses Google Translate as an example. The screenshot shows:

```text
Hello World → Hola Mundo
```

**Key idea:** Machine translation requires a system to represent and preserve meaning across languages.

---

### 3.2 Question answering

The slide uses Amazon Alexa as an example of question answering. Example commands/questions shown include:

```text
What’s the weather today?
What’s in the news?
What time is it in Boston?
Set the alarm for 7 a.m. tomorrow.
What are my upcoming events?
```

**Key idea:** Question answering requires the system to interpret a natural-language query, map it to information or an action, and return a useful response.

---

### 3.3 Historical Legal Text Analytics

The lecture uses Aberdeen Burgh Records as an example.

The slides describe:

- Council registers of Aberdeen, Scotland.
- Nearly continuous records from 1398 to the present, spanning about 700 years.
- One of the earliest and most complete bodies of town or burgh council records.
- Records concerning:
  - legal matters;
  - commercial activity;
  - daily life.
- Original material in handwritten scripts in:
  - Latin;
  - Middle Scots.

The analysis task involves:

- manually transcribing original handwritten pages;
- annotating and enriching machine-readable Aberdeen Burgh Records;
- analysing the evolution of social and legal concepts.

**Connection:** This links NLP/Text Mining to digital humanities, law, history, and social/legal analysis.

---

### 3.4 Fact checking

The lecture includes fact checking as an NLP/Text Mining application.

**Key idea:** Fact checking involves analysing textual claims and comparing them against evidence or known information.

---

### 3.5 Data-to-text generation

The weather report slide shows automatic generation of a weather forecast report from structured weather data.

#### Key concept: Data-to-text generation

**Intuition:** Convert structured or non-linguistic data into natural-language text.

**Lecture example:** Automatically generate a weather forecast report from weather data.

---

### 3.6 ChatGPT and LLM abilities

The lecture uses ChatGPT as an example of modern NLP/LLM capabilities.

Listed abilities include:

- question answering;
- performing mathematical tasks;
- writing a song or poem given a topic;
- writing an email;
- dialogue generation;
- code generation and debugging;
- text completion.

The slide describes ChatGPT as:

```text
A significant step towards AGI
```

[UNCLEAR] The transcript is needed to know how cautiously or strongly the lecturer framed this AGI claim.

---

## 4. Why Text Mining and NLP are challenging

The slides list several core difficulties.

### 4.1 Natural languages evolve

Natural languages are not fixed. New words and usages appear constantly.

Examples:

```text
emoji
to DM
```

**Consequence:** A static rule system can become outdated quickly.

---

### 4.2 Syntactic rules are flexible

Natural language allows informal, compressed, or non-standard syntax.

Example:

```text
Are you coming?
Coming?
```

Both can communicate the same intended meaning.

**Consequence:** NLP systems cannot rely only on rigid grammar rules.

---

### 4.3 Ambiguity is inherent

Natural language can often be interpreted in more than one way. The slides list ambiguity as an inherent challenge but do not expand it in detail.

---

### 4.4 World knowledge is necessary

Example:

```text
The player took three steps. The whistle blew.
```

To interpret this correctly, the reader needs background knowledge about the sport or context. The reason the whistle blew is not explicitly stated.

---

### 4.5 Many languages, dialects, and styles

NLP systems must handle variation across:

- languages;
- dialects;
- styles;
- formal and informal text;
- spoken/transcribed text.

**Connection:** These challenges motivate machine learning methods that can adapt from data rather than relying only on hand-written rules.

---

## 5. Language-specific examples: Chinese

### 5.1 Chinese word segmentation

The slides show Chinese word segmentation as a challenge.

Example sentence:

```text
这是一篇有趣的文章
```

Segmentation shown:

```text
这是 / 一篇 / 有趣 / 的 / 文章
```

Translation:

```text
This is an interesting article
```

#### Key concept: Word segmentation

**Intuition:** Split a continuous sequence of characters into word-like units.

**Why it matters:** In English, spaces often mark word boundaries. In Chinese, word boundaries are not marked in the same way, so tokenisation/segmentation is harder.

The slide also shows an ambiguity example:

```text
武汉市长江大桥
```

Two possible segmentations are shown:

```text
Result 1: 武汉 / 市长 / 江大桥
Gloss: Wuhan / mayor / Daqiao Jiang
```

```text
Result 2: 武汉市 / 长江大桥
Gloss: Wuhan City / Yangtze River Bridge
```

**Key point:** Different segmentations produce different meanings.

---

### 5.2 Traditional vs. simplified Chinese

The slides state:

- Chinese is an ideographic language.
- English is alphabetic.
- Traditional Chinese characters provide richer stroke signals than simplified characters.

Examples shown compare traditional and simplified characters for:

- love;
- horse;
- noodle.

**Connection:** This shows that text representation may need to account for language-specific properties. A representation that works well for English may not capture all useful signals in Chinese.

---

## 6. Why Machine Learning for Text Mining/NLP?

### Rule-based symbolic AI

Traditional rule-based AI:

- requires expert knowledge to engineer rules;
- is not flexible enough to adapt easily across:
  - multiple languages;
  - domains;
  - applications.

### Machine learning from data

Machine learning adapts by learning from data.

The slides emphasise two adaptation advantages:

- **To language evolution:** learn from new data.
- **To different applications:** learn with an appropriate target representation.

#### Key concept: Machine learning for NLP

**Intuition:** Instead of manually writing every linguistic rule, train models from examples so they can adapt to changing language and different tasks.

---

## 7. NLP, Machine Learning, and Computational Linguistics

### 7.1 Is NLP the same as ML?

No.

The slides state:

- NLP is a confluence of:
  - computer science;
  - artificial intelligence;
  - linguistics.
- ML provides techniques for problem solving by learning from data.
- ML is the current dominant AI paradigm.
- ML is often used in modelling NLP tasks.

**Relationship:** ML is a major method used in NLP, but NLP is broader than ML.

---

### 7.2 Is NLP the same as Computational Linguistics?

No, although they overlap.

The slides state:

- Both mostly use text as data.
- In Computational Linguistics, computational methods support the study of linguistic phenomena and theories.
  - Example: formal discourse theories.
- In NLP, the scope is more general.
  - Computational methods are used for translation, information extraction, question answering, and similar applications.
- The top NLP scientific conference is the Annual Meeting of the Association for Computational Linguistics, ACL.

**Relationship:** Computational Linguistics is more focused on studying language; NLP is more broadly focused on computational tasks involving language.

---

## 8. Related fields and typical applications

### Related fields

The slides list related areas:

- Machine Learning
- Speech Processing
- Artificial Intelligence
- Information Retrieval
- Statistics
- Any field involving language processing, including:
  - literature;
  - history;
  - digital humanities;
  - social sciences;
  - sociology;
  - psychology;
  - law;
  - biology.

### Typical NLP applications

The slides list:

- machine translation;
- sentiment analysis;
- information extraction;
- text summarisation;
- question answering;
- dialogue systems;
- many more.

---

# Part II — Vector Representations of Text

## 9. Central question

The second half of the lecture asks:

```text
Why do we need vector representations of text?
How can we transform raw text to a vector?
```

This is the bridge from language as strings/symbols to language as numerical data usable by machine learning algorithms.

---

## 10. Vectors and vector spaces

### Key concept: Vector / embedding

**Intuition:** A vector represents an item as a list of numbers.

**Formal lecture definition:** A vector, also called an embedding, $x$, is a one-dimensional array of $d$ elements or coordinates. Each coordinate can be identified by an index $i \in d$. Example: $x_1 = 2$.

A vector can be written as:

$$
x = [x_1, x_2, \ldots, x_d]
$$

where:

- $d$ is the dimensionality;
- $x_i$ is the value at coordinate $i$.

### Key concept: Matrix / vector space

**Intuition:** A matrix stores many vectors together.

**Formal lecture definition:** A collection of $n$ vectors is a matrix $X$ of size $n \times d$, also called a vector space.

$$
X =
\begin{bmatrix}
x_{1,1} & x_{1,2} & \cdots & x_{1,d} \\
x_{2,1} & x_{2,2} & \cdots & x_{2,d} \\
\vdots & \vdots & \ddots & \vdots \\
x_{n,1} & x_{n,2} & \cdots & x_{n,d}
\end{bmatrix}
$$

where:

- rows correspond to vectors/items;
- columns correspond to dimensions/features.

### Indexing note

The slides explicitly note:

```text
In Python indices start from 0.
```

**Important practical point:** Mathematical notation often indexes from 1, but Python indexes arrays from 0.

---

## 11. Measuring similarity between vectors

The slide asks how to measure that $x_1$ is closer to $x_2$ than to $x_3$. This leads to vector similarity.

---

## 12. Dot product

### Key concept: Dot product / inner product

**Intuition:** The dot product combines two vectors into a single number by multiplying matching coordinates and summing the results.

**Formal lecture definition:** The dot product takes two equal-length sequences of numbers and returns a single number.

For two $d$-dimensional vectors $x_1$ and $x_2$:

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

**Intuition:** The norm is the length or magnitude of a vector.

The slide gives:

$$
|x|
=
\sqrt{x \cdot x}
=
\sqrt{x_1^2 + x_2^2 + \cdots + x_d^2}
$$

This is used in cosine similarity.

---

## 14. Cosine similarity

### Key concept: Cosine similarity

**Intuition:** Cosine similarity compares the direction of two vectors rather than just their raw size. It normalises the dot product by the vector lengths.

**Formal lecture definition:**

$$
\operatorname{cosine}(x_1, x_2)
=
\frac{x_1 \cdot x_2}{|x_1||x_2|}
$$

Using summation notation:

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

The slides describe cosine similarity as a normalised dot product.

[UNCLEAR] The parsed slide text mangles part of the cosine formula. The cleaned formula above follows the visible structure: dot product divided by the product of vector norms.

---

## 15. Vector spaces of text

The slides ask what rows and columns mean for text data.

Two major matrix types are introduced:

1. **Word-word matrix**, also called **term-context** matrix.
2. **Document-word matrix**, also called **bag-of-words** matrix.

---

## 16. Why vector representations of text are needed

The slides give three main motivations.

### 16.1 Encode word meaning for semantic similarity

Example question:

```text
Is basketball more similar to football or recipe?
```

A vector representation should make semantically related words closer in vector space.

### 16.2 Document retrieval

Example:

```text
Retrieve documents relevant to a query.
```

This includes applications such as web search.

### 16.3 Apply machine learning to textual data

Many clustering and classification algorithms operate on vectors, not raw strings.

The slide explicitly says:

```text
We are going to see a lot of this during this course!
```

[COURSE EMPHASIS] Vector representations are a recurring course concept.

---

# Text units and preprocessing

## 17. Text units

The slides introduce raw text, words/tokens/terms, and documents/text sequences.

### Example raw text

```text
As far as I’m concerned, this is Lynch at his best. ‘Lost Highway’ is a
dark, violent, surreal, beautiful, hallucinatory masterpiece. 10 out of 10
stars.
```

### Key concept: Word / token / term

**Lecture definition:** A word, token, or term is a sequence of one or more characters excluding whitespaces. Sometimes it consists of n-grams.

### Key concept: Document / text sequence / snippet

**Lecture definition:** A document can be a sentence, paragraph, section, chapter, entire document, search query, social media post, transcribed utterance, or pseudo-document such as all tweets posted by a user.

**Intuition:** In NLP, “document” does not necessarily mean a full formal document. It can be any unit of text chosen for representation.

---

## 18. Tokenisation

### Key concept: Tokenisation

**Intuition:** Tokenisation splits raw text into smaller units called tokens.

**Lecture definition:** Tokenisation obtains tokens from raw text. The simplest form is to split text on whitespaces or use regular expressions.

### Worked example: tokenising the Lynch review

Raw text:

```text
As far as I’m concerned, this is Lynch at his best. ‘Lost Highway’ is a
dark, violent, surreal, beautiful, hallucinatory masterpiece. 10 out of 10
stars.
```

Tokenised text shown on the slide:

```text
As far as I’m concerned , this is Lynch at his best . ‘ Lost Highway ’ is a
dark , violent , surreal , beautiful , hallucinatory masterpiece . 10 out of
10 stars .
```

The punctuation has been separated into its own tokens.

---

## 19. Other preprocessing options

After tokenisation, the slides list possible preprocessing steps:

- lowercasing;
- punctuation removal;
- number removal;
- stop word removal;
- infrequent word removal;
- stemming.

### Worked example: preprocessing the Lynch review

Tokenised text:

```text
As far as I’m concerned , this is Lynch at his best . ‘ Lost Highway ’ is a
dark , violent , surreal , beautiful , hallucinatory masterpiece . 10 out of
10 stars .
```

Preprocessed text after lowercasing plus punctuation and stop word removal:

```text
concerned lynch best lost highway dark violent surreal beautiful
hallucinatory masterpiece 10 10 stars
```

[UNCLEAR] The slide says “punctuation/stop word removal” but keeps the numbers `10 10`. The earlier bullet list includes number removal as an option, not necessarily applied in this example.

---

## 20. Obtaining a vocabulary

### Key concept: Vocabulary

**Intuition:** The vocabulary is the set of unique words/features that the representation will use.

**Formal lecture definition:** Assume a corpus $D$ of $m$ preprocessed texts. The vocabulary $V$ is the set containing all $k$ unique words $w_i$ in $D$:

$$
V = \{w_1, \ldots, w_k\}
$$

The vocabulary is often extended to include n-grams, meaning contiguous sequences of $n$ words.

---

# Word representations

## 21. Discrete vectors / one-hot encoding

### Key concept: One-hot encoding

**Intuition:** Represent each word by a vector with one `1` and all other entries `0`. The position of the `1` identifies the word.

### Worked example: vocabulary from a toy text

Text:

```text
love pineapple apricot apple chocolate apple pie
```

Unique vocabulary shown on the slide:

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

These are discrete vectors because each word is represented as a distinct symbolic category.

---

## 22. Problem with one-hot / discrete vectors

The slides compute the dot product and cosine similarity for `apricot` and `pineapple`.

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

Since:

$$
x_2 \cdot x_3 = 0
$$

and both one-hot vectors have norm 1:

$$
|x_2| = 1,\quad |x_3| = 1
$$

therefore:

$$
\operatorname{cosine}(x_2,x_3)
=
\frac{0}{1 \cdot 1}
=
0
$$

### Conclusion

Every word is equally different from every other word under one-hot encoding, because different one-hot vectors are orthogonal.

But this is unsatisfactory because:

```text
apricot and pineapple are related.
```

The slide then asks whether contextual information would be useful.

---

# Contextual meaning and distributional semantics

## 23. Quick test: “What is tesguino?”

The lecture uses an example to show how context helps infer meaning.

Sentences shown:

```text
A bottle of tesguino is on the table.
Everybody likes an ice cold tesguino.
Tesguino makes you drunk.
We make tesguino out of corn.
```

The slide then reveals:

```text
Tesguino is a beer made from corn.
```

### Key point

Even without knowing the word beforehand, surrounding context provides clues:

- “bottle” suggests a drink;
- “ice cold” suggests a beverage;
- “makes you drunk” suggests alcohol;
- “out of corn” suggests an ingredient/source.

**Connection:** This motivates the distributional hypothesis.

---

## 24. Distributional Hypothesis

### Key concept: Distributional Hypothesis

**Intuition:** A word’s meaning can be inferred from the words and contexts that surround it.

**Formal lecture statement:** Firth (1957):

```text
You shall know a word by the company it keeps!
```

The slides state:

```text
Words appearing in similar contexts are likely to have similar meanings.
```

This is the conceptual foundation for word-word co-occurrence matrices and many word vector methods.

---

# Word-word matrices

## 25. Word-word matrix / term-context matrix

### Key concept: Word-word matrix

**Intuition:** Represent each word by counting the context words that appear near it.

**Formal lecture definition:** A word-word matrix $X$ is an $n \times m$ matrix where:

$$
n = |V|
$$

is the number of target words, and

$$
m = |V_c|
$$

is the number of context words.

For each word $x_i \in V$, count how many times it co-occurs with context words $x_j$.

### Context window

The slides define the context using a window of $\pm k$ words:

- $k$ words to the left of the target word;
- $k$ words to the right of the target word.

Counts are computed over a large corpus, for example the entire Wikipedia.

Usually:

$$
V = V_c
$$

meaning the target word vocabulary and context word vocabulary are the same. In that case, the word-word matrix is square.

---

## 26. Worked example: word-word matrix for apricot, pineapple, digital, information

The slide shows context words such as:

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

The slide’s key point:

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

### Interpretation

- `apricot` and `pineapple` occur with similar context words such as `pinch` and `sugar`.
- `digital` occurs with different context words such as `computer`, `data`, and `result`.
- Therefore, a context-based vector can reflect semantic relatedness better than one-hot encoding.

[UNCLEAR] The exact matrix entries come from the slide image. The main displayed answer is clear, but check the slide/recording for the full table if needed.

---

## 27. Context types

The slides note that context can be refined using linguistic information.

Examples:

- part-of-speech tags:
  - `bank V` vs. `bank N`;
- syntactic dependencies:
  - `eat dobj` vs. `eat subj`.

### Key concept: Linguistically refined context

**Intuition:** Instead of treating nearby words as plain context, include grammatical information so that different uses or syntactic relations can be distinguished more precisely.

**Example intuition from slide:**

- `bank` as a verb is different from `bank` as a noun.
- A word appearing as the direct object of `eat` is different from a word appearing as the subject of `eat`.

---

# Document representations

## 28. Document-word matrix / bag-of-words

### Key concept: Document-word matrix

**Intuition:** Represent each document by counting how many times each vocabulary word appears in it.

**Formal lecture definition:** A document-word matrix $X$ is a matrix of size:

$$
|D| \times |V|
$$

where:

- rows are documents in corpus $D$;
- columns are vocabulary words in $V$.

For each document, count how many times each word $w \in V$ appears in it.

### Worked example: bag-of-words table

| Document | bad | good | great | terrible |
|---|---:|---:|---:|---:|
| Doc 1 | 14 | 1 | 0 | 5 |
| Doc 2 | 2 | 5 | 3 | 0 |
| Doc 3 | 0 | 2 | 5 | 0 |

### Alternative construction

The slides state that $X$ can also be obtained by:

1. taking the one-hot vectors of the words in each document;
2. adding those one-hot vectors together;
3. transposing as needed to get the document-word matrix orientation.

---

# Problems with raw counts

## 29. Frequent words dominate

Raw count vectors have a major problem:

```text
Frequent words, such as articles and pronouns, dominate contexts without being informative.
```

The slide illustrates this by adding the word `the` to the context vocabulary.

---

## 30. Worked example: the word “the” causes misleading similarity

Vocabulary:

```text
[aadvark, computer, data, pinch, result, sugar, the]
```

[UNCLEAR] The slide spells `aadvark`; this is probably intended as `aardvark`, but preserve the slide spelling when matching notes to the deck.

Vectors:

$$
\text{apricot} = x_2 = [0,0,0,1,0,1,30]
$$

$$
\text{digital} = x_3 = [0,2,1,0,1,0,45]
$$

The only large shared contribution is from `the`.

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

For $x_2$:

$$
|x_2|
=
\sqrt{0^2+0^2+0^2+1^2+0^2+1^2+30^2}
$$

$$
=
\sqrt{902}
$$

For $x_3$:

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

### Conclusion

The vectors for `apricot` and `digital` become almost maximally similar because both occur often with `the`, even though `the` is not semantically informative.

The slides state that this problem also holds for document-word matrices.

### Solution

```text
Weight the vectors.
```

---

# Weighting word-word matrices

## 31. Distance discount

### Key concept: Distance discount

**Intuition:** Words closer to the target word should matter more than words farther away.

The slides state:

```text
Weight contexts according to the distance from the word: the further away, the lower the weight.
```

For a window size $\pm k$, the slide gives weights for $k=3$:

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

This means:

- farthest context word gets weight $1/3$;
- middle context word gets weight $2/3$;
- nearest context word gets weight $3/3 = 1$.

[UNCLEAR] The slide text says to multiply each context word by something rendered as $(k-\text{distance})/k$, but the displayed example for $k=3$ corresponds to nearest-context weight $3/3$ and farthest-context weight $1/3$. Check the recording or slide formula for the precise distance indexing convention.

---

## 32. Pointwise Mutual Information, PMI

### Key concept: PMI

**Intuition:** PMI measures how strongly two words are associated by comparing how often they occur together with how often they would be expected to occur together if they were independent.

**Formal lecture definition:**

$$
PMI(w_i,w_j)
=
\log_2
\frac{P(w_i,w_j)}{P(w_i)P(w_j)}
$$

The slides define:

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

where:

- $\#(\cdot)$ denotes count;
- $|D|$ is the number of observed words in the corpus.

Substituting probabilities into the PMI formula:

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

[UNCLEAR] The parsed slide formula contains `#(w1)` in the denominator. This should be checked against the slide/recording; the surrounding notation indicates the intended count is for $w_i$.

### Interpretation

- Positive PMI values quantify relatedness.
- The slides say to use PMI instead of raw counts.

---

## 33. Positive PMI, PPMI

### Key concept: PPMI

**Intuition:** Negative PMI values are often ignored, keeping only positive association strengths.

**Formal lecture definition:**

$$
PPMI(w_i,w_j)
=
\max(PMI(w_i,w_j),0)
$$

The slides call this “positive PMI.”

---

# Weighting document-word matrices

## 34. TF.IDF

### Key concept: TF.IDF

**Intuition:** TF.IDF represents the importance of a word in a document relative to the whole corpus.

It combines two ideas:

1. A word is important to a document if it appears frequently in that document.
2. A word is less useful as a distinguishing feature if it appears in many documents.

---

## 35. Term Frequency, TF

### Key concept: Term Frequency

**Intuition:** If a term appears frequently in a document, it is likely to be important to that document.

The slide defines this conceptually rather than giving a separate formula for TF.

---

## 36. Inverse Document Frequency, IDF

### Key concept: IDF

**Intuition:** If a term appears in many documents, it is less informative as a distinguishing feature.

**Formal lecture definition:**

$$
idf_w
=
\log_{10}
\frac{N}{df_w}
$$

where:

- $N$ is the number of documents in the corpus;
- $df_w$ is the document frequency of word $w$.

---

## 37. TF.IDF weight

The slide gives:

$$
x_{id}
=
tf_{id}
\log_{10}
\frac{N}{df_{id}}
$$

Cleaned notation for the same idea:

$$
x_{i,d}
=
tf_{i,d}
\log_{10}
\frac{N}{df_i}
$$

where:

- $x_{i,d}$ is the weighted value for term $i$ in document $d$;
- $tf_{i,d}$ is the term frequency of term $i$ in document $d$;
- $df_i$ is the document frequency of term $i$;
- $N$ is the number of documents.

[UNCLEAR] The slide notation uses `dfid`, but IDF was defined just above as $df_w$, document frequency of a word. Check the lecturer’s exact notation if this is examined.

---

# Dimensionality and sparsity

## 38. Problems with dimensionality

The slides state that count-based matrices often work well, but they have two major problems.

### 38.1 High dimensionality

Vocabulary size can be millions.

Therefore:

- word vectors may have millions of dimensions;
- document vectors may also have one dimension per vocabulary term.

### 38.2 Sparsity

The matrices are very sparse because:

- words co-occur only with a small number of other words;
- documents contain only a very small subset of the full vocabulary.

### Solution direction

The slide states:

```text
Dimensionality Reduction to the rescue!
```

This is introduced as the next solution direction, not developed in detail in this lecture.

---

# Evaluation of vectors

## 39. Evaluation of word vectors

The slides divide evaluation into intrinsic and extrinsic evaluation.

### Key concept: Intrinsic evaluation

**Intuition:** Evaluate the vectors directly on a property they should capture, without embedding them in a full downstream application.

For word vectors, intrinsic evaluation includes:

- **similarity**
  - order word pairs according to semantic similarity;
- **in-context similarity**
  - substitute a word in a sentence without changing its meaning;
- **analogy**
  - example:

```text
Beijing is to China what Rome is to ...?
```

### Key concept: Extrinsic evaluation

**Intuition:** Evaluate whether the vectors improve performance on an actual NLP task.

For word vectors, examples include:

- sentiment classification;
- named entity recognition, NER.

---

## 40. “Best” word vectors

The slides ask whether the best word vectors are high-dimensional count-based vectors.

The answer given is nuanced:

- Later lectures will cover how to obtain low-dimensional vectors with neural networks.
- Levy et al. (2015) showed that choices such as:
  - context window size;
  - rare word removal;
  - other configuration choices;
  matter more.
- Choice of texts used to obtain counts matters.
- More text is better.
- Low-dimensional methods scale better.

**Connection:** This points forward to neural word embeddings and later language modelling material.

---

## 41. Evaluation of document vectors

The slides again divide evaluation into intrinsic and extrinsic.

### Intrinsic evaluation for document vectors

- document similarity;
- information retrieval.

### Extrinsic evaluation for document vectors

- text classification;
- plagiarism detection.

---

# Limitations

## 42. Limitations of word vectors

### 42.1 Polysemy

#### Key concept: Polysemy

**Intuition:** A single word can have multiple meanings.

The slides state:

```text
All occurrences of a word, and all its senses, are represented by one vector.
```

Example:

```text
bank
```

Given a task, it may be useful to adapt the word vectors to represent the appropriate sense.

---

### 42.2 Antonyms vs. synonyms

The slides state:

```text
Antonyms appear in similar contexts, hard to distinguish them from synonyms.
```

**Intuition:** Words with opposite meanings can appear in similar contexts. Because distributional methods rely on context, they may place antonyms close together.

---

### 42.3 Compositionality

#### Key concept: Compositionality

**Intuition:** The meaning of a sequence of words depends on how individual word meanings combine.

The slides ask:

```text
What is the meaning of a sequence of words?
```

They note:

- It may be possible to obtain context vectors for short phrases.
- This does not scale to whole sentences, paragraphs, and so on.

Possible solution directions listed:

- combine word vectors:
  - add;
  - multiply;
- sentenceBERT, etc.

---

## 43. Limitations of document vectors

The slide gives one central limitation:

```text
Word order is ignored, but language is sequential!
```

This applies to bag-of-words document vectors.

### Key concept: Bag-of-words limitation

**Intuition:** Bag-of-words representations count words but ignore sequence. Therefore, they lose information about word order, even though word order is important in language.

---

# Algorithm-style summary: raw text to vector

## Pipeline A: document-word representation

1. Start with raw text documents.
2. Tokenise each document.
   - Split on whitespace or use regular expressions.
3. Optionally preprocess.
   - Lowercase.
   - Remove punctuation.
   - Remove numbers.
   - Remove stop words.
   - Remove infrequent words.
   - Stem.
4. Build vocabulary:

$$
V = \{w_1,\ldots,w_k\}
$$

5. Create a matrix:

$$
X \in \mathbb{R}^{|D| \times |V|}
$$

6. For each document $d$, count occurrences of each word $w \in V$.
7. Optionally weight counts using TF.IDF:

$$
x_{i,d}
=
tf_{i,d}
\log_{10}
\frac{N}{df_i}
$$

8. Use the resulting document vectors for:
   - similarity;
   - retrieval;
   - classification;
   - plagiarism detection.

---

## Pipeline B: word-word representation

1. Start with a large corpus.
2. Tokenise and preprocess.
3. Build target vocabulary $V$.
4. Build context vocabulary $V_c$.
5. Create a matrix:

$$
X \in \mathbb{R}^{|V| \times |V_c|}
$$

6. For each target word $w_i$, count context words $w_j$ within a $\pm k$ context window.
7. Optionally refine context using:
   - part-of-speech tags;
   - syntactic dependencies.
8. Optionally weight co-occurrences using:
   - distance discount;
   - PMI;
   - PPMI.
9. Compare word vectors using:
   - dot product;
   - cosine similarity.

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

## Example 2: Inferring “tesguino”

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

# Exam flags and high-value emphasis

## Explicit exam flags found

No explicit “this will be on the exam” or equivalent exam statement appears in the slide deck provided.

[UNCLEAR] A transcript was not provided, so spoken exam hints may be missing.

## High-value course emphasis from slides

[COURSE EMPHASIS] The slide on why vector representations are needed says clustering and classification algorithms operate on vectors and that:

```text
We are going to see a lot of this during this course!
```

This makes vector representation a central revision topic.

[HIGH VALUE] Know the difference between:

- NLP and Text Mining;
- NLP and Machine Learning;
- NLP and Computational Linguistics.

[HIGH VALUE] Know the text-to-vector pipeline:

```text
raw text → tokenisation → preprocessing → vocabulary → vector/matrix representation → weighting/evaluation
```

[HIGH VALUE] Be able to define and use:

- dot product;
- vector norm;
- cosine similarity;
- one-hot encoding;
- word-word matrix;
- document-word matrix;
- PMI;
- PPMI;
- TF.IDF.

[HIGH VALUE] Be able to explain the limitations:

- one-hot vectors make all different words equally different;
- frequent words dominate raw count vectors;
- count matrices are high-dimensional and sparse;
- word vectors struggle with polysemy, antonymy, and compositionality;
- bag-of-words document vectors ignore word order.

---

# Connections to other material

- **Later language modelling:** The final slide says the next topic is language modelling.
- **Later neural networks:** The slide on “best word vectors” says a later lecture will cover low-dimensional vectors obtained with neural networks.
- **Transformers and LLMs:** The course goals connect this lecture’s foundations to transformers, modern LLM architectures, pre-training, and instruction tuning.
- **Information retrieval:** Document vectors connect directly to retrieval tasks such as web search.
- **Machine learning:** Vector representations are necessary because clustering and classification algorithms operate on vectors.
- **Digital humanities and law:** Historical legal text analytics connects NLP/Text Mining to historical records, legal concepts, and social/legal evolution.
- **Computational linguistics:** The lecture distinguishes NLP applications from computational methods used to study linguistic phenomena.

---

# Unclear sections to revisit in recording/slides

- [UNCLEAR] No transcript was included, so speaker-specific comments, extra worked derivations, jokes, warnings, and explicit exam hints are missing.
- [UNCLEAR] Chinese word segmentation example: check the exact segmentation labels if needed.
- [UNCLEAR] Cosine similarity formula text is garbled in the parsed slide. The clean formula is almost certainly:

$$
\frac{x_1 \cdot x_2}{|x_1||x_2|}
$$

- [UNCLEAR] Distance discount formula: the displayed weight pattern for $k=3$ is clear, but the parsed formula text does not perfectly match the example.
- [UNCLEAR] PMI formula denominator appears as `#(w1)` in the parsed slide. The surrounding notation indicates it should be the count for $w_i$, but verify.
- [UNCLEAR] TF.IDF final formula uses `dfid` in the parsed slide. The earlier definition uses $df_w$, the document frequency of word $w$. Verify exact lecturer notation.
- [UNCLEAR] The vocabulary example spells `aadvark`; this is likely `aardvark`, but preserve the slide spelling when matching notes to the deck.
- [UNCLEAR] The ChatGPT/AGI slide needs transcript context to know how seriously or cautiously the lecturer framed “a significant step towards AGI.”

