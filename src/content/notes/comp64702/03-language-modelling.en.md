---
subject: COMP64702
chapter: 3
title: "Language Modelling"
language: en
---

# COMP64702: Transforming Text Into Meaning — Language Modelling

**Topic and scope:** This lecture introduces **language modelling** as the first NLP problem in the course, following the previous lecture on vector representations of text. It focuses on assigning probabilities to word sequences using n-gram statistics, then handling sparsity, unknown words, evaluation, smoothing, interpolation, and backoff.

**Course:** COMP64702: Transforming Text Into Meaning  
**Lecture topic:** Language Modelling  
**Source used:** Slide deck: `COMP64702_TRIM_Language_Modelling-1.pdf`  
**Transcript status:** No transcript text was provided in the chat. Notes are therefore grounded in the slide deck only, and transcript-dependent details are marked **[UNCLEAR: transcript missing]**.

---

## 1. Context: From Text Representations to Language Modelling

### Previous lecture connection

The previous lecture covered **vector representations of text**. This lecture moves from representing text to solving a concrete NLP problem: **language modelling**.

### Core question of the lecture

A language model asks:

$$
P(x) = P(x_1, \ldots, x_N)
$$

That is: **what is the probability of a given sequence of words in a particular language, such as English?**

### Intuition

Some word sequences sound more natural than others. A language model aims to assign higher probability to natural-looking sequences and lower probability to unlikely or awkward ones.

Example intuition:

- `Ice cream is delicious.` should receive a higher probability than `I scream is delicious.`
- `You're welcome` should receive a higher probability than `Your welcome` in the appropriate context.

### Applications of language models

Language models are useful for:

- **Query completion in information retrieval**  
  Example: after typing `Is Manchester`, a search engine can suggest likely continuations.
- **Grammatical error detection**  
  Example: choosing between `You're welcome` and `Your welcome`.
- **Speech recognition**  
  Example: choosing between `I scream is delicious.` and `Ice cream is delicious.`

---

## 2. Traditional AI Approach vs Statistical Approach

### 2.1 Traditional AI approach

#### Intuition

A traditional symbolic AI approach tries to explicitly model how language works using hand-built rules.

#### What it looks for

The system searches for an interpretation that is:

- grammatical,
- semantically sensible,
- pragmatically plausible in context.

#### Formal style of approach

The system builds explicit models of:

- grammar rules,
- meaning,
- context,
- pragmatic plausibility.

#### Problem

The slides state that this approach performs poorly in the real world because:

- wide-coverage systems are hard to maintain,
- too much knowledge is required for semantics.

---

### 2.2 Statistical approach

#### Intuition

Instead of manually writing rules for grammar, meaning, or context, statistical NLP learns patterns from observed text.

#### What statistics are collected

The slides list statistics such as:

- how often different words appear,
- how often pairs of words appear next to each other,
- how often triples or longer sequences appear next to each other,
- other more complex statistical patterns.

#### Use

These statistics can then be used for NLP tasks such as:

- speech processing,
- text prediction,
- translation.

---

## 3. N-gram Statistics and Language Models

### 3.1 N-gram statistics

#### Definition

An **n-gram** is a sequence of $n$ consecutive words in a text corpus.

#### Examples

- **Unigram:** one word  
  Example: `Manchester`
- **Bigram:** two consecutive words  
  Example: `from Manchester`
- **Trigram:** three consecutive words  
  Example: `are from Manchester`

#### Intuition

If a sequence appears often in real text, the model treats it as more likely. The model can then assign probabilities to possible interpretations and pick the highest-probability one.

#### Formal idea

For a sequence, estimate its probability from counts observed in a corpus.

Sequences that occur more often in the data are considered more likely.

---

### 3.2 Language models

#### Definition from the slides

**N-gram models** are probabilistic models that predict the next word from the previous $N-1$ words.

These statistical models of word sequences are called **language models**, or **LMs**.

#### Intuition

A language model uses previous words as context to estimate the next word.

For example, after:

```text
I always order pizza with cheese and
```

possible continuations might include:

- `mushrooms`,
- `bread`,
- `and`.

A good language model should assign higher probability to the most plausible continuation.

---

## 4. Problem Setup

### 4.1 Training data

The training data is a set of sentences:

$$
D_{\text{train}} = \{x^1, \ldots, x^M\}
$$

Each sentence is a sequence of words:

$$
x = [x_1, \ldots, x_N]
$$

The slides use notation where $x_m$ refers to sentences and $x_n$ refers to words.

### Example sentence

$$
x = [\langle s\rangle, \text{The}, \text{water}, \text{is}, \text{clear}, ., \langle /s\rangle]
$$

where:

- $\langle s\rangle$ denotes the start of the sentence,
- $\langle /s\rangle$ denotes the end of the sentence.

### Why use start and end tokens?

These tokens help the model learn where sentences begin and end.

---

## 5. Corpus

### Definition

A **corpus** is a representative collection of documents used to obtain statistics for the language model.

### Examples from slides

#### British National Corpus, BNC

- 100 million words,
- 4,000 documents,
- includes newspaper articles, academic papers, school essays, memos, radio phone-ins, etc.

#### Google n-gram web corpus

- 1,024,908,267,229 words.

### Intuition

The language model can only learn patterns that appear in its corpus. Better or larger corpora give the model more evidence about what word sequences are common.

---

## 6. Calculating Sentence Probabilities

### Goal

The goal is to learn a model that returns the probability of an unseen sentence:

$$
P(x) = P(x_1, \ldots, x_N)
$$

where $V$ is the vocabulary and the space of all possible sentences is enormous.

### Main practical question

How do we compute sentence probabilities in practice?

### [UNCLEAR: slide notation]

The slide text contains garbled notation rendered as something like:

```text
for ↓x ↔ V max N
```

This likely refers to possible sequences over vocabulary $V$ up to some maximum length $N$, but the exact notation should be checked against the recording or original slide.

---

## 7. Unigram Language Model

### 7.1 Definition

A **unigram language model** is the simplest possible language model. It assumes each word in a sentence is independent of all other words.

### Intuition

The model does not care about word order or context. It only cares about how frequent each word is in the corpus.

### Formal definition

$$
P(x) = \prod_{n=1}^{N} P(x_n)
$$

with:

$$
P(x_n) = \frac{c(x_n)}{\sum_{x \in V} c(x)}
$$

So:

$$
P(x) = \prod_{n=1}^{N} \frac{c(x_n)}{\sum_{x \in V} c(x)}
$$

where:

- $c(x_n)$ is the count of word $x_n$ in the corpus,
- $\sum_{x \in V} c(x)$ is the total number of word tokens in the corpus.

---

### 7.2 Worked example: unigram probability

Training corpus from the slides:

```text
<s> i love playing basketball </s>
<s> arctic monkeys are from Manchester </s>
<s> i study in Manchester uni </s>
```

The slides use a total corpus size of 20 tokens.

Counts:

$$
c(i) = 2
$$

$$
c(love) = 1
$$

Therefore:

$$
P(i) = \frac{2}{20}
$$

$$
P(love) = \frac{1}{20}
$$

The unigram model gives:

$$
P(i\ love) = P(i)P(love)
$$

$$
= \frac{2}{20} \cdot \frac{1}{20}
$$

$$
= 0.005
$$

---

### 7.3 What goes wrong with unigram models?

#### Main problem

The unigram model treats every word as independent.

It only cares about which words are frequent, not whether the sequence is grammatical or meaningful.

#### Failure example

In the example corpus:

```text
<s> i love playing basketball </s>
<s> arctic monkeys are from Manchester </s>
<s> i study in Manchester uni </s>
```

The most frequent word is:

$$
\langle s\rangle
$$

with probability:

$$
\frac{3}{20}
$$

So the unigram model says:

- the most probable single-word sentence is:

$$
\langle s\rangle
$$

- the most probable two-word sentence is:

$$
\langle s\rangle \ \langle s\rangle
$$

- the most probable $N$-word sentence is:

$$
N \times \langle s\rangle
$$

#### Takeaway

The unigram model produces bad sequence probabilities because it ignores context and word order.

---

## 8. Maximum Likelihood Estimation and the Chain Rule

### 8.1 Moving beyond independence

The unigram model assumes:

$$
P(x) = \prod_{n=1}^{N} P(x_n)
$$

Instead, the slides introduce the idea that each word may depend on all previous words.

So:

$$
P(x) = P(x_1, \ldots, x_N)
$$

Using the chain rule:

$$
P(x_1, \ldots, x_N)
= P(x_1)P(x_2, \ldots, x_N \mid x_1)
$$

$$
= P(x_1)P(x_2 \mid x_1)\cdots P(x_N \mid x_1, \ldots, x_{N-1})
$$

$$
= \prod_{n=1}^{N} P(x_n \mid x_1, \ldots, x_{n-1})
$$

---

### 8.2 Maximum likelihood estimate

For a conditional probability with full history:

$$
P(x_n \mid x_{n-1}, \ldots, x_1)
$$

the maximum likelihood estimate is:

$$
P(x_n \mid x_{n-1}, \ldots, x_1)
=
\frac{c(x_1, \ldots, x_{n-1}, x_n)}
{c(x_1, \ldots, x_{n-1})}
$$

### Intuition

The numerator counts how often the whole context plus next word occurs.

The denominator counts how often the context occurs.

So the estimate asks:

> Out of all times this context appeared, how often was it followed by this word?

---

### 8.3 Problem with full-history MLE

As the model conditions on more previous words, the counts become sparser.

#### Why?

Long contexts are less likely to repeat exactly in the training corpus.

Example intuition:

- `the` is common,
- `denied the` is less common,
- `the committee strongly denied the` is much rarer,
- a full sentence-length context may never occur again.

#### Consequence

Many valid sequences receive zero or unreliable probability because the required context was never observed.

This motivates n-gram approximations such as bigram and trigram models.

---

## 9. Bigram Language Models

### 9.1 Definition

A **bigram language model** assumes that the choice of a word depends only on the one word immediately before it.

### Intuition

Instead of using the full history:

$$
x_1, \ldots, x_{n-1}
$$

the model only uses:

$$
x_{n-1}
$$

So the model estimates:

$$
P(x_n \mid x_{n-1})
$$

### Formal definition

$$
P(x) = \prod_{n=1}^{N} P(x_n \mid x_{n-1})
$$

Using probability ratios:

$$
P(x) =
\prod_{n=1}^{N}
\frac{P(x_{n-1}, x_n)}{P(x_{n-1})}
$$

Using counts:

$$
P(x) =
\prod_{n=1}^{N}
\frac{c(x_{n-1}, x_n)}{c(x_{n-1})}
$$

---

### 9.2 Markov assumption

#### Formal definition from slides

The $k$-th order Markov assumption is:

$$
P(x_n \mid x_{n-1}, \ldots, x_1)
\approx
P(x_n \mid x_{n-1}, \ldots, x_{n-k})
$$

For a bigram model:

$$
k = 1
$$

so:

$$
P(x_n \mid x_{n-1}, \ldots, x_1)
\approx
P(x_n \mid x_{n-1})
$$

### Intuition

The model assumes that only the recent past matters.

For bigrams, the “recent past” is just the previous word.

---

## 10. Bigram LM: From Counts to Probabilities

### 10.1 Unigram counts

The slides give the following unigram counts:

| Word | Count |
|---|---:|
| arctic | 100 |
| monkeys | 600 |
| are | 4000 |
| my | 3000 |
| favourite | 500 |
| band | 200 |

### 10.2 Bigram count matrix

Rows are previous words $x_{i-1}$. Columns are current words $x_i$.

| $x_{i-1} \backslash x_i$ | arctic | monkeys | are | my | favourite | band |
|---|---:|---:|---:|---:|---:|---:|
| arctic | 0 | 10 | 2 | 0 | 0 | 0 |
| monkeys | 0 | 0 | 250 | 1 | 5 | 0 |
| are | 3 | 45 | 0 | 600 | 25 | 1 |
| my | 0 | 2 | 0 | 1 | 300 | 5 |
| favourite | 0 | 1 | 0 | 0 | 0 | 50 |
| band | 0 | 0 | 3 | 10 | 0 | 0 |

The slide explains that bigram probabilities are computed by dividing each cell by the unigram count for its row.

### 10.3 Bigram probability matrix

| $x_{i-1} \backslash x_i$ | arctic | monkeys | are | my | favourite | band |
|---|---:|---:|---:|---:|---:|---:|
| arctic | 0 | 0.1 | 0.02 | 0 | 0 | 0 |
| monkeys | 0 | 0 | 0.417 | 0.0017 | 0.008 | 0 |
| are | 0.0008 | 0.0113 | 0 | 0.15 | 0.0063 | 0.00003 |
| my | 0 | 0.0007 | 0 | 0.0003 | 0.1 | 0.0017 |
| favourite | 0 | 0.002 | 0 | 0 | 0 | 0.1 |
| band | 0 | 0 | 0.015 | 0.05 | 0 | 0 |

### [UNCLEAR: possible arithmetic issue on slide]

The slide lists:

$$
P(\text{band}\mid \text{are}) = 0.00003
$$

but the count table gives:

$$
c(\text{are}, \text{band})=1
$$

and:

$$
c(\text{are})=4000
$$

which would be:

$$
\frac{1}{4000} = 0.00025
$$

The recording or original materials should be checked.

---

## 11. Worked Example: Bigram Sentence Probability

### 11.1 Sequence

$$
x = [\text{arctic}, \text{monkeys}, \text{are}, \text{my}, \text{favourite}, \text{band}]
$$

### 11.2 Bigram decomposition

The slide computes:

$$
P(x)
=
P(\text{monkeys}\mid \text{arctic})
P(\text{are}\mid \text{monkeys})
P(\text{my}\mid \text{are})
P(\text{favourite}\mid \text{my})
P(\text{band}\mid \text{favourite})
$$

Using counts:

$$
=
\frac{c(\text{arctic},\text{monkeys})}{c(\text{arctic})}
\cdots
\frac{c(\text{favourite},\text{band})}{c(\text{favourite})}
$$

Using the probability matrix:

$$
=
0.1 \cdot 0.417 \cdot 0.15 \cdot 0.1 \cdot 0.1
$$

$$
=
0.00006255
$$

### [UNCLEAR: boundary tokens]

The worked example does not include probabilities for $\langle s\rangle$ or $\langle /s\rangle$. The slides compute the probability of the word sequence as shown, not the full sentence with start/end tokens.

---

## 12. Bigram and Trigram Example

### 12.1 Training sentences

The slides use:

```text
<s> a blue house </s>
<s> a grey house </s>
<s> the grey house has the blue table </s>
```

### 12.2 Bigram probabilities

Examples given:

$$
P(a \mid \langle s\rangle) = \frac{2}{3}
$$

because two out of three sentences start with `a`.

$$
P(the \mid \langle s\rangle) = \frac{1}{3}
$$

because one out of three sentences starts with `the`.

$$
P(\langle /s\rangle \mid house) = \frac{2}{3}
$$

because `house` is followed by the end-of-sentence token in two of its three occurrences.

$$
P(house \mid grey) = \frac{2}{2} = 1
$$

because every occurrence of `grey` is followed by `house`.

### 12.3 Trigram probabilities

Examples given:

$$
P(blue \mid \langle s\rangle\ a) = \frac{1}{2}
$$

because after the context $\langle s\rangle\ a$, `blue` occurs once out of two times.

$$
P(house \mid a\ blue) = \frac{1}{1}
$$

because after the context `a blue`, `house` occurs once out of once.

---

## 13. Longer Contexts: N-gram Language Models

### 13.1 General conditional probability

The slides give the general idea:

$$
P(x \mid context)
=
\frac{P(context, x)}{P(context)}
$$

Using counts:

$$
P(x \mid context)
=
\frac{c(context, x)}{c(context)}
$$

### 13.2 Contexts for different models

- In a **bigram** language model, the context is:

$$
x_{n-1}
$$

- In a **trigram** language model, the context is:

$$
x_{n-2}, x_{n-1}
$$

- In longer n-gram models, the context contains more previous words.

### 13.3 Trade-off

Longer contexts have two effects.

#### Benefit

They are more likely to capture long-range dependencies.

Example from slides:

```text
I saw a tiger that was really very ...
```

A longer context helps decide whether the next word should be something like:

```text
fierce
```

rather than:

```text
talkative
```

#### Problem

Longer contexts make counts sparser.

The slides state:

- longer contexts increase the chance of zero probabilities,
- 5-grams and training sets with billions of tokens are common.

---

## 14. Generating Sentences with N-gram Models

The slides compare random sentences generated from unigram, bigram, and trigram models using a corpus of airline reservation queries. This section demonstrates how increasing context length improves local fluency.

### 14.1 Unigram generation

Words are sampled according to unigram probabilities.

Examples:

```text
Of aircraft fare east
The the stopover city the coach the one way frequent in travelling flights
Two on flight really Boston me like
And like six would these fifty
```

#### Takeaway

The unigram model produces broken grammar and no coherent structure.

Why:

- it samples words independently,
- it does not model word order,
- it does not condition on previous words.

---

### 14.2 Bigram generation

Words are sampled using bigram probabilities.

Examples:

```text
I want a first class
I would like to San Francisco
Are the next week on AA eleven ten
In Denver on October
What is the city of three pm
Two on flight really Boston me like
And like six would these fifty
```

#### Takeaway

The bigram model is more fluent locally.

Why:

- each word depends on the previous word,
- adjacent word pairs are more plausible than in the unigram model.

But it can still produce globally awkward sequences.

---

### 14.3 Trigram generation

Words are sampled using trigram probabilities.

Examples:

```text
How much does it cost
I'd like to depart before five o'clock pm
How many stops does Delta flight five eleven o'clock pm that go from what am
I need to Philadelphia
Which flight do these flights leave after four pm and lunch and
Two on flight really Boston me like
And like six would these fifty
```

#### Takeaway

The trigram model is noticeably more fluent.

Why:

- it conditions on two previous words,
- it captures more local structure than bigrams,
- it still has limitations because longer generated text can become incoherent.

---

## 15. Google Books N-gram Viewer

The slides include Google Books n-grams and a screenshot of the Google Books N-gram Viewer.

### Purpose in lecture

This is used as a visual example of how n-gram counts can be tracked over time in a large corpus.

### Slide visual

The chart shows different phrase frequencies over years, using phrases related to `I scream` and similar continuations. The visual reinforces that n-gram counts are not just abstract: they can be measured and plotted from large corpora.

---

## 16. Unknown Words

### 16.1 Problem

If a word was never encountered during training, any sentence containing it receives probability zero.

### Why this happens

The slides give two reasons:

- all corpora are finite,
- new words emerge.

### Consequence

A language model trained on finite data cannot directly assign probability to every possible word unless it has a strategy for unseen words.

### 16.2 Common solutions

The slides list two solutions:

1. Use a specific **UNKNOWN** token for all words not in the vocabulary.
2. Use classes of unknown words, such as:
   - names,
   - numbers.

### Intuition

Instead of treating every unseen word as impossible, the model maps unseen words into a known category and gives that category some probability.

---

## 17. Evaluation of Language Models

### 17.1 Train/dev/test split

The slides state that to train and evaluate language models, we need:

- training data,
- development data,
- test data.

### Roles

- **Training data:** used to estimate model probabilities.
- **Development data:** used to tune choices such as smoothing parameters.
- **Test data:** used to evaluate the final model on unseen data.

The slides explicitly mention development data later when choosing $k$ for add-$k$ smoothing and weights for interpolation.

---

### 17.2 Intrinsic evaluation: accuracy

#### Definition

Accuracy measures how often the language model predicts the correct next word.

#### Example prompt

```text
I always order pizza with cheese and...
```

Possible continuations:

```text
mushrooms?
bread?
and?
```

#### Interpretation

The higher the accuracy, the better the model.

#### Intuition

Accuracy directly tests whether the model's top predicted next word matches the true next word.

---

### 17.3 Intrinsic evaluation: perplexity

#### Definition

Perplexity measures the model's ability to predict the words of an unseen text.

The slides define unseen text as text not in the training data, such as the test set.

#### Intuition

Perplexity tells us how surprised the model is by the test data.

- Lower perplexity means the model is less surprised.
- Lower perplexity is better.

#### Formal definition from slides

For test documents $d = 1,\ldots,D$:

$$
\text{Perplexity}(w)
=
\exp
\left(
-
\frac{
\sum_{d=1}^{D} \log P(w_d)
}{
\sum_{d=1}^{D} N_d
}
\right)
$$

where:

- $w_d$ is the word sequence/document $d$,
- $N_d$ is the number of words in document $d$,
- $P(w_d)$ is the probability assigned by the model to document $d$.

The expression is the exponential of the average negative log-likelihood, normalized by the number of words.

---

### 17.4 Extrinsic evaluation

Extrinsic evaluation tests whether the language model helps with an external NLP task.

The slides list:

- sentence completion,
- grammatical error correction,
- natural language generation,
- speech recognition,
- machine translation.

### Intuition

Intrinsic evaluation asks: **How well does the model predict text?**

Extrinsic evaluation asks: **Does the model improve performance in a real task?**

---

## 18. Smoothing

### 18.1 Motivation

#### Problem

Even if all words are in the vocabulary, they may appear with an unseen context in test data.

If the context-word combination was never seen in training, the model assigns zero probability.

#### Why this is bad

If one part of a sentence has probability zero, then the whole sentence probability becomes zero under the product rule.

#### Slide phrase

The slides describe smoothing as:

> “Steal from the rich and give to the poor.”

This means taking probability mass away from frequent/seen events and assigning some probability to rare or unseen events.

---

### 18.2 Smoothing intuition

The smoothing intuition slide uses a distribution for:

$$
P(w \mid \text{denied the})
$$

Before smoothing, the sparse counts are:

| Word after `denied the` | Count |
|---|---:|
| allegations | 3 |
| reports | 2 |
| claims | 1 |
| request | 1 |
| total | 7 |

After smoothing, the distribution is flattened:

| Word class/item | Smoothed count |
|---|---:|
| allegations | 2.5 |
| reports | 1.5 |
| claims | 0.5 |
| request | 0.5 |
| other | 2 |
| total | 7 |

### Takeaway

Smoothing flattens spiky distributions so they generalize better.

The slide summary is:

> Taking from the frequent and giving to the rare.

---

## 19. Add-1 Smoothing

### 19.1 Definition

**Add-1 smoothing**, also called **Laplace smoothing**, adds one to all counts.

### Formal definition

$$
P_{\text{Add-1}}(x_n)
=
\frac{c(x_n)+1}{\text{Corpus size} + |V|}
$$

where:

- $c(x_n)$ is the count of word $x_n$,
- $|V|$ is the vocabulary size.

### Intuition

Pretend we have seen every word at least once.

### Effect

This prevents zero probabilities for unseen words, because even a word with count zero gets:

$$
\frac{0+1}{\text{Corpus size}+|V|}
$$

---

## 20. Add-$k$ Smoothing

### 20.1 Motivation

The slides state that add-1 smoothing puts too much probability mass on unseen words.

A better version is add-$k$ smoothing, where:

$$
k < 1
$$

### 20.2 Formal definition

$$
P_{\text{Add-}k}(x_n)
=
\frac{counts(x_n) + k}
{\text{corpus size} + k|V|}
$$

### Intuition

Instead of pretending every word has been seen one extra time, pretend every word has been seen $k$ extra times.

If $k < 1$, unseen words receive some probability, but less than under add-1 smoothing.

### 20.3 Hyperparameter tuning

The slides state that $k$ is a hyperparameter.

The optimal value is chosen on the development set.

---

## 21. Interpolation

### 21.1 Motivation

Longer contexts are more informative, but only if they are frequent enough.

The slides give:

```text
dog bites ...
```

as more informative than:

```text
bites ...
```

But they also give:

```text
canid bites ...
```

as a case where the longer context may be less useful if it is too rare.

### Core question

Can we combine evidence from unigram, bigram, and trigram probabilities?

---

### 21.2 Simple linear interpolation

For a trigram language model, the slides define:

$$
P_{\text{SLI}}(x_n \mid x_{n-1}, x_{n-2})
=
\omega_3 P(x_n \mid x_{n-1}, x_{n-2})
+
\omega_2 P(x_n \mid x_{n-1})
+
\omega_1 P(x_n)
$$

with:

$$
\omega_i > 0
$$

and:

$$
\sum_i \omega_i = 1
$$

### Intuition

The model takes a weighted average of:

- trigram probability,
- bigram probability,
- unigram probability.

### Trade-off

The slides state:

- higher-order models are more informative but less robust,
- lower-order models are less informative but more reliable.

### Choosing weights

The interpolation weights $\omega_i$ are chosen by parameter tuning on the development set.

---

## 22. Backoff

### 22.1 Basic backoff idea

Backoff starts with an n-gram order $k$. If the count is zero, the model uses a lower-order model.

### Informal version from slides

$$
BO(x_n \mid x_{n-1} \ldots x_{n-k})
=
\begin{cases}
P(x_n \mid x_{n-1} \ldots x_{n-k}), & \text{if } c(x_n \ldots x_{n-k}) > 0 \\
BO(x_n \mid x_{n-1} \ldots x_{n-k+1}), & \text{otherwise}
\end{cases}
$$

The slide asks:

> Is this a probability distribution?

The follow-up slide introduces a weighted version to ensure the probabilities are valid.

---

### 22.2 Proper backoff with weights

The slides define:

$$
P_{BO}(x_n \mid x_{n-1} \ldots x_{n-k})
=
\begin{cases}
P^*(x_n \mid x_{n-1} \ldots x_{n-k}), & \text{if } c(x_n \ldots x_{n-k}) > 0 \\
\alpha^{x_{n-1}\ldots x_{n-k}}
P_{BO}(x_n \mid x_{n-1} \ldots x_{n-k+1}), & \text{otherwise}
\end{cases}
$$

where:

$$
\alpha^{x_{n-1}\ldots x_{n-k}}
$$

is the backoff weight.

### Purpose of the backoff weight

The backoff weight is computed so that the probability distribution is respected:

- probabilities are between 0 and 1,
- probabilities sum to 1.

### Conditional switching

Backoff uses **conditional switching**:

- only one model is used at a time,
- the model choice depends on whether the higher-order n-gram was observed.

### Reference

The slide points to Jurafsky and Martin, 2018.

### [UNCLEAR: undefined $P^*$]

The slides use $P^*$ in the weighted backoff formula but do not define it in the visible slide text. Check the recording or referenced reading for the exact meaning.

---

## 23. Key Concepts Summary

### Language model

**Intuition:** A model that scores how likely a word sequence is.

**Formalism:** A model estimating:

$$
P(x_1, \ldots, x_N)
$$

or, using conditional probabilities:

$$
\prod_{n=1}^{N} P(x_n \mid \text{context})
$$

---

### N-gram

**Intuition:** A fixed-length sequence of consecutive words.

**Formalism:** An n-gram contains $n$ words; unigram = 1, bigram = 2, trigram = 3.

---

### Unigram model

**Intuition:** Predicts sentences using individual word frequencies only.

**Formalism:**

$$
P(x)=\prod_{n=1}^{N}P(x_n)
$$

---

### Bigram model

**Intuition:** Predicts each word using only the previous word.

**Formalism:**

$$
P(x)=\prod_{n=1}^{N}P(x_n\mid x_{n-1})
$$

---

### Markov assumption

**Intuition:** Approximate the full history using only the most recent $k$ words.

**Formalism:**

$$
P(x_n \mid x_{n-1}, \ldots, x_1)
\approx
P(x_n \mid x_{n-1}, \ldots, x_{n-k})
$$

---

### Perplexity

**Intuition:** Measures how surprised the model is by unseen test text. Lower is better.

**Formalism:**

$$
\text{Perplexity}(w)
=
\exp
\left(
-
\frac{
\sum_{d=1}^{D} \log P(w_d)
}{
\sum_{d=1}^{D} N_d
}
\right)
$$

---

### Smoothing

**Intuition:** Redistribute probability mass so unseen events do not get zero probability.

**Formalism:** Example add-$k$:

$$
P_{\text{Add-}k}(x_n)
=
\frac{counts(x_n) + k}
{\text{corpus size} + k|V|}
$$

---

### Interpolation

**Intuition:** Combine higher-order and lower-order models to balance informativeness and robustness.

**Formalism:**

$$
P_{\text{SLI}}(x_n \mid x_{n-1}, x_{n-2})
=
\omega_3 P(x_n \mid x_{n-1}, x_{n-2})
+
\omega_2 P(x_n \mid x_{n-1})
+
\omega_1 P(x_n)
$$

---

### Backoff

**Intuition:** Use a high-order n-gram model when its count is available; otherwise fall back to a lower-order model.

**Formalism:** Weighted recursive definition using $\alpha$ to preserve a valid probability distribution.

---

## 24. Exam Flags and Revision Priority

### Explicit exam flags

No explicit phrases such as:

- “this will be on the exam,”
- “you should know this,”
- “common mistake,”
- “important,”

appear in the slide text.

**[UNCLEAR: transcript missing]** Verbal exam warnings from the lecturer cannot be recovered without the transcript.

### High-value revision points from slide emphasis

These are not explicit exam claims, but they are central formulas/concepts in the lecture:

- definition of language modelling as estimating $P(x_1,\ldots,x_N)$,
- unigram model and its independence failure,
- chain rule decomposition of sentence probability,
- maximum likelihood count ratios,
- sparsity problem,
- bigram model formula,
- $k$-th order Markov assumption,
- count-to-probability conversion for bigrams,
- worked bigram probability example,
- unknown words and zero probability,
- accuracy vs perplexity,
- smoothing intuition,
- add-1 and add-$k$ smoothing,
- interpolation weights and development-set tuning,
- backoff and backoff weights.

---

## 25. Connections to Earlier Material, Applications, and Readings

### Connections to earlier lecture

This lecture follows the previous lecture on vector representations of text. It moves from representing words/text to using corpus statistics to solve a concrete NLP problem: language modelling.

### Applications connected in the lecture

Language models are connected to:

- information retrieval/query completion,
- grammatical error correction,
- speech recognition,
- sentence completion,
- natural language generation,
- machine translation.

### Reading references from slides

The bibliography lists:

- Chapter 3 from Jurafsky & Martin,
- Chapter 6 from Eisenstein,
- Michael Collins' notes on language models.

---

## 26. Unclear Sections to Revisit in Recording

1. **[UNCLEAR: transcript missing]** The transcript was not included in this chat, so any verbal explanations, exam hints, warnings, corrections, or worked-through comments are absent.

2. **[UNCLEAR: sentence-space notation]** The slide on calculating sentence probabilities contains garbled notation: `for ↓x ↔ V max N`. Check whether the intended notation is $x \in V^N$, $x \in V^{\le N}$, or something else.

3. **[UNCLEAR: bigram probability table arithmetic]** The slide lists $P(\text{band}\mid \text{are}) = 0.00003$, but the count table gives $1/4000 = 0.00025$. This may be a slide typo or a transcription/rendering issue.

4. **[UNCLEAR: boundary tokens in worked bigram example]** The bigram worked example for `[arctic, monkeys, are, my, favourite, band]` does not include $\langle s\rangle$ or $\langle /s\rangle$. Check whether the lecturer explained that these were omitted for simplicity.

5. **[UNCLEAR: backoff $P^*$]** The final backoff formula uses $P^*$, but the visible slide does not define it. Check the recording or Jurafsky and Martin reference.

6. **[UNCLEAR: repeated slides]** Several slides appear repeated because of incremental reveal animations. No extra content is visible in the parsed deck, but the transcript may contain extra explanation during those repeats.

---

## 27. Quick Formula Sheet

### Sentence probability

$$
P(x)=P(x_1,\ldots,x_N)
$$

### Unigram model

$$
P(x)=\prod_{n=1}^{N}P(x_n)
$$

$$
P(x_n)=\frac{c(x_n)}{\sum_{x\in V}c(x)}
$$

### Chain rule

$$
P(x_1,\ldots,x_N)=\prod_{n=1}^{N}P(x_n\mid x_1,\ldots,x_{n-1})
$$

### Full-history MLE

$$
P(x_n\mid x_{n-1},\ldots,x_1)
=
\frac{c(x_1,\ldots,x_{n-1},x_n)}{c(x_1,\ldots,x_{n-1})}
$$

### Bigram model

$$
P(x)=\prod_{n=1}^{N}P(x_n\mid x_{n-1})
$$

$$
P(x)=\prod_{n=1}^{N}\frac{c(x_{n-1},x_n)}{c(x_{n-1})}
$$

### Markov assumption

$$
P(x_n\mid x_{n-1},\ldots,x_1)
\approx
P(x_n\mid x_{n-1},\ldots,x_{n-k})
$$

### Conditional count estimate

$$
P(x\mid context)=\frac{c(context,x)}{c(context)}
$$

### Perplexity

$$
\text{Perplexity}(w)
=
\exp
\left(
-
\frac{\sum_{d=1}^{D}\log P(w_d)}{\sum_{d=1}^{D}N_d}
\right)
$$

### Add-1 smoothing

$$
P_{\text{Add-1}}(x_n)
=
\frac{c(x_n)+1}{\text{Corpus size}+|V|}
$$

### Add-$k$ smoothing

$$
P_{\text{Add-}k}(x_n)
=
\frac{counts(x_n)+k}{\text{corpus size}+k|V|}
$$

### Simple linear interpolation

$$
P_{\text{SLI}}(x_n\mid x_{n-1},x_{n-2})
=
\omega_3P(x_n\mid x_{n-1},x_{n-2})
+
\omega_2P(x_n\mid x_{n-1})
+
\omega_1P(x_n)
$$

$$
\omega_i>0, \qquad \sum_i\omega_i=1
$$

### Backoff

$$
P_{BO}(x_n \mid x_{n-1} \ldots x_{n-k})
=
\begin{cases}
P^*(x_n \mid x_{n-1} \ldots x_{n-k}), & \text{if } c(x_n \ldots x_{n-k}) > 0 \\
\alpha^{x_{n-1}\ldots x_{n-k}}P_{BO}(x_n \mid x_{n-1} \ldots x_{n-k+1}), & \text{otherwise}
\end{cases}
$$

