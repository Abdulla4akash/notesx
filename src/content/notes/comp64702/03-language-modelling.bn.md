---
subject: COMP64702
chapter: 3
title: "Language Modelling"
language: bn
---

# COMP64702: Transforming Text Into Meaning — ভাষা মডেলিং

**বিষয় ও পরিসর:** এই লেকচারে কোর্সের প্রথম NLP সমস্যা হিসেবে **ভাষা মডেলিং** পরিচয় করানো হয়েছে। আগের লেকচারের বিষয় ছিল টেক্সটের ভেক্টর উপস্থাপন। এখানে n-gram পরিসংখ্যান ব্যবহার করে শব্দ-সিকোয়েন্সে সম্ভাবনা নির্ধারণ, তারপর স্পার্সিটি, অজানা শব্দ, মূল্যায়ন, স্মুথিং, ইন্টারপোলেশন এবং ব্যাকঅফ নিয়ে আলোচনা করা হয়েছে।

**কোর্স:** COMP64702: Transforming Text Into Meaning  
**লেকচার টপিক:** Language Modelling  
**ব্যবহৃত উৎস:** স্লাইড ডেক: `COMP64702_TRIM_Language_Modelling-1.pdf`  
**ট্রান্সক্রিপ্টের অবস্থা:** এই চ্যাটে কোনো ট্রান্সক্রিপ্ট টেক্সট দেওয়া হয়নি। তাই নোটগুলো শুধু স্লাইড ডেকের ওপর ভিত্তি করে তৈরি, এবং ট্রান্সক্রিপ্ট-নির্ভর বিবরণগুলো **[UNCLEAR: transcript missing]** হিসেবে চিহ্নিত।

---

## ১. প্রসঙ্গ: টেক্সট রিপ্রেজেন্টেশন থেকে ভাষা মডেলিং

### আগের লেকচারের সঙ্গে সংযোগ

আগের লেকচারে **টেক্সটের ভেক্টর উপস্থাপন** আলোচনা করা হয়েছিল। এই লেকচার টেক্সটকে উপস্থাপন করার বিষয় থেকে এগিয়ে একটি নির্দিষ্ট NLP সমস্যা সমাধানের দিকে যায়: **ভাষা মডেলিং**।

### লেকচারের মূল প্রশ্ন

একটি ভাষা মডেল জিজ্ঞেস করে:

$$
P(x) = P(x_1, \ldots, x_N)
$$

অর্থাৎ: **ইংরেজির মতো কোনো নির্দিষ্ট ভাষায় শব্দের একটি নির্দিষ্ট সিকোয়েন্সের সম্ভাবনা কত?**

### অন্তর্দৃষ্টি

কিছু শব্দ-সিকোয়েন্স অন্যগুলোর তুলনায় বেশি স্বাভাবিক শোনায়। একটি ভাষা মডেলের লক্ষ্য হলো স্বাভাবিক-দেখানো সিকোয়েন্সকে বেশি সম্ভাবনা দেওয়া এবং অস্বাভাবিক বা বেখাপ্পা সিকোয়েন্সকে কম সম্ভাবনা দেওয়া।

উদাহরণ-অন্তর্দৃষ্টি:

- `Ice cream is delicious.` বাক্যটির সম্ভাবনা `I scream is delicious.` বাক্যটির চেয়ে বেশি হওয়া উচিত।
- যথাযথ প্রেক্ষাপটে `You're welcome`-এর সম্ভাবনা `Your welcome`-এর চেয়ে বেশি হওয়া উচিত।

### ভাষা মডেলের প্রয়োগ

ভাষা মডেল কাজে লাগে:

- **তথ্য অনুসন্ধানে query completion**  
  উদাহরণ: `Is Manchester` টাইপ করার পর সার্চ ইঞ্জিন সম্ভাব্য continuation সাজেস্ট করতে পারে।
- **ব্যাকরণগত ভুল শনাক্তকরণ**  
  উদাহরণ: `You're welcome` এবং `Your welcome`-এর মধ্যে নির্বাচন করা।
- **Speech recognition**  
  উদাহরণ: `I scream is delicious.` এবং `Ice cream is delicious.`-এর মধ্যে নির্বাচন করা।

---

## ২. Traditional AI Approach বনাম Statistical Approach

### ২.১ Traditional AI approach

#### অন্তর্দৃষ্টি

Traditional symbolic AI approach হাতে বানানো নিয়ম ব্যবহার করে ভাষা কীভাবে কাজ করে তা স্পষ্টভাবে মডেল করার চেষ্টা করে।

#### এটি কী খোঁজে

সিস্টেম এমন একটি interpretation খোঁজে যা:

- grammatical,
- semantically sensible,
- প্রেক্ষাপটে pragmatically plausible।

#### পদ্ধতির formal style

সিস্টেম স্পষ্ট মডেল তৈরি করে:

- grammar rules,
- meaning,
- context,
- pragmatic plausibility।

#### সমস্যা

স্লাইডে বলা হয়েছে বাস্তব জগতে এই পদ্ধতির performance খারাপ, কারণ:

- wide-coverage systems রক্ষণাবেক্ষণ করা কঠিন,
- semantics-এর জন্য অতিরিক্ত বেশি জ্ঞান দরকার।

---

### ২.২ Statistical approach

#### অন্তর্দৃষ্টি

grammar, meaning বা context-এর জন্য হাতে নিয়ম লেখার বদলে statistical NLP পর্যবেক্ষিত টেক্সট থেকে pattern শেখে।

#### কী ধরনের statistics সংগ্রহ করা হয়

স্লাইডে যেসব statistics-এর কথা বলা হয়েছে:

- বিভিন্ন শব্দ কতবার দেখা যায়,
- জোড়া শব্দ একে অপরের পাশে কতবার দেখা যায়,
- তিনটি শব্দ বা তার চেয়ে দীর্ঘ সিকোয়েন্স একসঙ্গে কতবার দেখা যায়,
- আরও জটিল statistical pattern।

#### ব্যবহার

এই statistics ব্যবহার করা যায় NLP task-এ, যেমন:

- speech processing,
- text prediction,
- translation।

---

## ৩. N-gram Statistics এবং Language Models

### ৩.১ N-gram statistics

#### সংজ্ঞা

**n-gram** হলো text corpus-এ পরপর থাকা $n$টি শব্দের একটি সিকোয়েন্স।

#### উদাহরণ

- **Unigram:** একটি শব্দ  
  উদাহরণ: `Manchester`
- **Bigram:** পরপর দুটি শব্দ  
  উদাহরণ: `from Manchester`
- **Trigram:** পরপর তিনটি শব্দ  
  উদাহরণ: `are from Manchester`

#### অন্তর্দৃষ্টি

বাস্তব টেক্সটে কোনো সিকোয়েন্স বেশি দেখা গেলে মডেল সেটিকে বেশি সম্ভাব্য হিসেবে ধরে। তারপর মডেল সম্ভাব্য interpretation-গুলোকে probability দিতে পারে এবং highest-probability interpretation বেছে নিতে পারে।

#### Formal idea

কোনো সিকোয়েন্সের probability corpus-এ পর্যবেক্ষিত count থেকে estimate করা হয়।

যেসব সিকোয়েন্স data-তে বেশি দেখা যায়, সেগুলোকে বেশি likely ধরা হয়।

---

### ৩.২ Language models

#### স্লাইড থেকে সংজ্ঞা

**N-gram models** হলো probabilistic models, যা আগের $N-1$টি শব্দ থেকে পরের শব্দ predict করে।

শব্দ-সিকোয়েন্সের এই ধরনের statistical models-কে **language models**, বা **LMs**, বলা হয়।

#### অন্তর্দৃষ্টি

একটি language model আগের শব্দগুলোকে context হিসেবে ব্যবহার করে পরের শব্দ estimate করে।

যেমন, এর পরে:

```text
I always order pizza with cheese and
```

সম্ভাব্য continuation হতে পারে:

- `mushrooms`,
- `bread`,
- `and`।

একটি ভালো language model সবচেয়ে plausible continuation-কে বেশি probability দেবে।

---

## ৪. Problem Setup

### ৪.১ Training data

Training data হলো sentence-এর একটি set:

$$
D_{\text{train}} = \{x^1, \ldots, x^M\}
$$

প্রতিটি sentence হলো শব্দের একটি sequence:

$$
x = [x_1, \ldots, x_N]
$$

স্লাইডে এমন notation ব্যবহার করা হয়েছে যেখানে $x_m$ sentence বোঝায় এবং $x_n$ word বোঝায়।

### Example sentence

$$
x = [\langle s\rangle, \text{The}, \text{water}, \text{is}, \text{clear}, ., \langle /s\rangle]
$$

যেখানে:

- $\langle s\rangle$ sentence-এর শুরু বোঝায়,
- $\langle /s\rangle$ sentence-এর শেষ বোঝায়।

### Start এবং end token কেন ব্যবহার করা হয়?

এই tokenগুলো মডেলকে sentence কোথায় শুরু এবং কোথায় শেষ হয় তা শেখাতে সাহায্য করে।

---

## ৫. Corpus

### সংজ্ঞা

**Corpus** হলো document-এর একটি representative collection, যেখান থেকে language model-এর statistics নেওয়া হয়।

### স্লাইডের উদাহরণ

#### British National Corpus, BNC

- 100 million words,
- 4,000 documents,
- এর মধ্যে newspaper articles, academic papers, school essays, memos, radio phone-ins ইত্যাদি আছে।

#### Google n-gram web corpus

- 1,024,908,267,229 words।

### অন্তর্দৃষ্টি

Language model কেবল সেই pattern-ই শিখতে পারে যা তার corpus-এ দেখা যায়। ভালো বা বড় corpus মডেলকে word sequence কতটা common সে সম্পর্কে বেশি evidence দেয়।

---

## ৬. Sentence Probability গণনা

### লক্ষ্য

লক্ষ্য হলো এমন একটি model শেখা যা unseen sentence-এর probability return করে:

$$
P(x) = P(x_1, \ldots, x_N)
$$

যেখানে $V$ হলো vocabulary এবং সব possible sentence-এর space বিশাল।

### মূল practical question

আমরা বাস্তবে sentence probability কীভাবে compute করব?

### [UNCLEAR: slide notation]

স্লাইডের text-এ garbled notation আছে, যা এমনভাবে render হয়েছে:

```text
for ↓x ↔ V max N
```

এটি সম্ভবত vocabulary $V$-এর ওপর possible sequence, সর্বোচ্চ length $N$ পর্যন্ত, বোঝাতে চায়। তবে exact notation recording বা original slide দেখে যাচাই করা উচিত।

---

## ৭. Unigram Language Model

### ৭.১ সংজ্ঞা

**Unigram language model** হলো সবচেয়ে সহজ language model। এটি ধরে নেয় sentence-এর প্রতিটি word অন্য সব word থেকে independent।

### অন্তর্দৃষ্টি

মডেল word order বা context নিয়ে ভাবে না। এটি শুধু corpus-এ প্রতিটি word কত frequent তা দেখে।

### Formal definition

$$
P(x) = \prod_{n=1}^{N} P(x_n)
$$

where:

$$
P(x_n) = \frac{c(x_n)}{\sum_{x \in V} c(x)}
$$

So:

$$
P(x) = \prod_{n=1}^{N} \frac{c(x_n)}{\sum_{x \in V} c(x)}
$$

যেখানে:

- $c(x_n)$ হলো corpus-এ word $x_n$-এর count,
- $\sum_{x \in V} c(x)$ হলো corpus-এর মোট word token সংখ্যা।

---

### ৭.২ Worked example: unigram probability

স্লাইডের training corpus:

```text
<s> i love playing basketball </s>
<s> arctic monkeys are from Manchester </s>
<s> i study in Manchester uni </s>
```

স্লাইডে total corpus size হিসেবে 20 tokens ব্যবহার করা হয়েছে।

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

Unigram model দেয়:

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

### ৭.৩ Unigram model-এ কী ভুল হতে পারে?

#### মূল সমস্যা

Unigram model প্রতিটি word-কে independent হিসেবে ধরে।

এটি শুধু দেখে কোন word frequent, কিন্তু sequence-টি grammatical বা meaningful কিনা তা দেখে না।

#### Failure example

Example corpus-এ:

```text
<s> i love playing basketball </s>
<s> arctic monkeys are from Manchester </s>
<s> i study in Manchester uni </s>
```

সবচেয়ে frequent word হলো:

$$
\langle s\rangle
$$

with probability:

$$
\frac{3}{20}
$$

তাই unigram model বলে:

- সবচেয়ে probable single-word sentence হলো:

$$
\langle s\rangle
$$

- সবচেয়ে probable two-word sentence হলো:

$$
\langle s\rangle \ \langle s\rangle
$$

- সবচেয়ে probable $N$-word sentence হলো:

$$
N \times \langle s\rangle
$$

#### Takeaway

Unigram model খারাপ sequence probability তৈরি করে, কারণ এটি context এবং word order ignore করে।

---

## ৮. Maximum Likelihood Estimation এবং Chain Rule

### ৮.১ Independence-এর বাইরে যাওয়া

Unigram model ধরে:

$$
P(x) = \prod_{n=1}^{N} P(x_n)
$$

এর বদলে স্লাইডে ধারণা দেওয়া হয়েছে যে প্রতিটি word আগের সব word-এর ওপর depend করতে পারে।

তাই:

$$
P(x) = P(x_1, \ldots, x_N)
$$

Chain rule ব্যবহার করে:

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

### ৮.২ Maximum likelihood estimate

Full history সহ একটি conditional probability:

$$
P(x_n \mid x_{n-1}, \ldots, x_1)
$$

এর maximum likelihood estimate হলো:

$$
P(x_n \mid x_{n-1}, \ldots, x_1)
=
\frac{c(x_1, \ldots, x_{n-1}, x_n)}
{c(x_1, \ldots, x_{n-1})}
$$

### অন্তর্দৃষ্টি

Numerator গুনে কতবার পুরো context plus next word ঘটেছে।

Denominator গুনে context কতবার ঘটেছে।

তাই estimate-টি জিজ্ঞেস করে:

> এই context যতবার দেখা গেছে, তার মধ্যে কতবার এর পরে এই word এসেছে?

---

### ৮.৩ Full-history MLE-এর সমস্যা

মডেল যত বেশি previous words-এর ওপর condition করে, counts তত sparse হয়ে যায়।

#### কেন?

Long context training corpus-এ exactভাবে repeat হওয়ার সম্ভাবনা কম।

Example intuition:

- `the` common,
- `denied the` কম common,
- `the committee strongly denied the` আরও rare,
- সম্পূর্ণ sentence-length context হয়তো আর কখনোই দেখা যাবে না।

#### Consequence

অনেক valid sequence zero বা unreliable probability পায়, কারণ দরকারি context training data-তে কখনো দেখা যায়নি।

এটাই n-gram approximation, যেমন bigram এবং trigram model, motivate করে।

---

## ৯. Bigram Language Models

### ৯.১ সংজ্ঞা

**Bigram language model** ধরে যে কোনো word বেছে নেওয়া শুধু তার ঠিক আগের word-এর ওপর depend করে।

### অন্তর্দৃষ্টি

Full history ব্যবহার করার বদলে:

$$
x_1, \ldots, x_{n-1}
$$

মডেল শুধু ব্যবহার করে:

$$
x_{n-1}
$$

তাই মডেল estimate করে:

$$
P(x_n \mid x_{n-1})
$$

### Formal definition

$$
P(x) = \prod_{n=1}^{N} P(x_n \mid x_{n-1})
$$

Probability ratios ব্যবহার করে:

$$
P(x) =
\prod_{n=1}^{N}
\frac{P(x_{n-1}, x_n)}{P(x_{n-1})}
$$

Counts ব্যবহার করে:

$$
P(x) =
\prod_{n=1}^{N}
\frac{c(x_{n-1}, x_n)}{c(x_{n-1})}
$$

---

### ৯.২ Markov assumption

#### স্লাইড থেকে formal definition

$k$-th order Markov assumption হলো:

$$
P(x_n \mid x_{n-1}, \ldots, x_1)
\approx
P(x_n \mid x_{n-1}, \ldots, x_{n-k})
$$

Bigram model-এর জন্য:

$$
k = 1
$$

তাই:

$$
P(x_n \mid x_{n-1}, \ldots, x_1)
\approx
P(x_n \mid x_{n-1})
$$

### অন্তর্দৃষ্টি

মডেল ধরে যে শুধু সাম্প্রতিক past গুরুত্বপূর্ণ।

Bigram-এর ক্ষেত্রে “recent past” হলো শুধু previous word।

---

## ১০. Bigram LM: Counts থেকে Probabilities

### ১০.১ Unigram counts

স্লাইডে নিচের unigram counts দেওয়া হয়েছে:

| Word | Count |
|---|---:|
| arctic | 100 |
| monkeys | 600 |
| are | 4000 |
| my | 3000 |
| favourite | 500 |
| band | 200 |

### ১০.২ Bigram count matrix

Rows হলো previous words $x_{i-1}$। Columns হলো current words $x_i$।

| $x_{i-1} \backslash x_i$ | arctic | monkeys | are | my | favourite | band |
|---|---:|---:|---:|---:|---:|---:|
| arctic | 0 | 10 | 2 | 0 | 0 | 0 |
| monkeys | 0 | 0 | 250 | 1 | 5 | 0 |
| are | 3 | 45 | 0 | 600 | 25 | 1 |
| my | 0 | 2 | 0 | 1 | 300 | 5 |
| favourite | 0 | 1 | 0 | 0 | 0 | 50 |
| band | 0 | 0 | 3 | 10 | 0 | 0 |

স্লাইডে ব্যাখ্যা করা হয়েছে যে bigram probabilities পাওয়া যায় প্রতিটি cell-কে তার row-এর unigram count দিয়ে divide করে।

### ১০.৩ Bigram probability matrix

| $x_{i-1} \backslash x_i$ | arctic | monkeys | are | my | favourite | band |
|---|---:|---:|---:|---:|---:|---:|
| arctic | 0 | 0.1 | 0.02 | 0 | 0 | 0 |
| monkeys | 0 | 0 | 0.417 | 0.0017 | 0.008 | 0 |
| are | 0.0008 | 0.0113 | 0 | 0.15 | 0.0063 | 0.00003 |
| my | 0 | 0.0007 | 0 | 0.0003 | 0.1 | 0.0017 |
| favourite | 0 | 0.002 | 0 | 0 | 0 | 0.1 |
| band | 0 | 0 | 0.015 | 0.05 | 0 | 0 |

### [UNCLEAR: possible arithmetic issue on slide]

স্লাইডে দেওয়া হয়েছে:

$$
P(\text{band}\mid \text{are}) = 0.00003
$$

কিন্তু count table-এ আছে:

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

Recording বা original materials দেখে যাচাই করা উচিত।

---

## ১১. Worked Example: Bigram Sentence Probability

### ১১.১ Sequence

$$
x = [\text{arctic}, \text{monkeys}, \text{are}, \text{my}, \text{favourite}, \text{band}]
$$

### ১১.২ Bigram decomposition

স্লাইডে compute করা হয়েছে:

$$
P(x)
=
P(\text{monkeys}\mid \text{arctic})
P(\text{are}\mid \text{monkeys})
P(\text{my}\mid \text{are})
P(\text{favourite}\mid \text{my})
P(\text{band}\mid \text{favourite})
$$

Counts ব্যবহার করে:

$$
=
\frac{c(\text{arctic},\text{monkeys})}{c(\text{arctic})}
\cdots
\frac{c(\text{favourite},\text{band})}{c(\text{favourite})}
$$

Probability matrix ব্যবহার করে:

$$
=
0.1 \cdot 0.417 \cdot 0.15 \cdot 0.1 \cdot 0.1
$$

$$
=
0.00006255
$$

### [UNCLEAR: boundary tokens]

Worked example-এ $\langle s\rangle$ বা $\langle /s\rangle$-এর probabilities অন্তর্ভুক্ত করা হয়নি। স্লাইডে shown word sequence-এর probability compute করা হয়েছে, start/end token সহ full sentence নয়।

---

## ১২. Bigram এবং Trigram Example

### ১২.১ Training sentences

স্লাইডে ব্যবহার করা হয়েছে:

```text
<s> a blue house </s>
<s> a grey house </s>
<s> the grey house has the blue table </s>
```

### ১২.২ Bigram probabilities

দেওয়া examples:

$$
P(a \mid \langle s\rangle) = \frac{2}{3}
$$

কারণ তিনটি sentence-এর মধ্যে দুটি `a` দিয়ে শুরু।

$$
P(the \mid \langle s\rangle) = \frac{1}{3}
$$

কারণ তিনটির মধ্যে একটি sentence `the` দিয়ে শুরু।

$$
P(\langle /s\rangle \mid house) = \frac{2}{3}
$$

কারণ `house`-এর তিনটি occurrence-এর মধ্যে দুটিতে এর পরে end-of-sentence token এসেছে।

$$
P(house \mid grey) = \frac{2}{2} = 1
$$

কারণ `grey`-এর প্রতিটি occurrence-এর পরে `house` এসেছে।

### ১২.৩ Trigram probabilities

দেওয়া examples:

$$
P(blue \mid \langle s\rangle\ a) = \frac{1}{2}
$$

কারণ context $\langle s\rangle\ a$-এর পরে `blue` একবার এসেছে, মোট দুবারের মধ্যে।

$$
P(house \mid a\ blue) = \frac{1}{1}
$$

কারণ context `a blue`-এর পরে `house` একবার এসেছে, মোট একবারের মধ্যে।

---

## ১৩. Longer Contexts: N-gram Language Models

### ১৩.১ General conditional probability

স্লাইডে general idea দেওয়া হয়েছে:

$$
P(x \mid context)
=
\frac{P(context, x)}{P(context)}
$$

Counts ব্যবহার করে:

$$
P(x \mid context)
=
\frac{c(context, x)}{c(context)}
$$

### ১৩.২ বিভিন্ন model-এর context

- **Bigram** language model-এ context হলো:

$$
x_{n-1}
$$

- **Trigram** language model-এ context হলো:

$$
x_{n-2}, x_{n-1}
$$

- Longer n-gram models-এ context-এ আরও বেশি previous words থাকে।

### ১৩.৩ Trade-off

Longer context-এর দুটি effect আছে।

#### Benefit

এগুলো long-range dependencies ধরার সম্ভাবনা বেশি।

স্লাইডের example:

```text
I saw a tiger that was really very ...
```

Longer context সিদ্ধান্ত নিতে সাহায্য করে পরের word এমন কিছু হওয়া উচিত কি না:

```text
fierce
```

rather than:

```text
talkative
```

#### Problem

Longer context count-কে আরও sparse করে।

স্লাইডে বলা হয়েছে:

- longer contexts zero probabilities-এর সম্ভাবনা বাড়ায়,
- 5-grams এবং billions of tokens সহ training sets common।

---

## ১৪. N-gram Models দিয়ে Sentence Generate করা

স্লাইডে airline reservation queries-এর একটি corpus ব্যবহার করে unigram, bigram এবং trigram model থেকে randomly generated sentence তুলনা করা হয়েছে। এই section দেখায় context length বাড়ালে local fluency উন্নত হয়।

### ১৪.১ Unigram generation

Unigram probabilities অনুযায়ী words sample করা হয়।

Examples:

```text
Of aircraft fare east
The the stopover city the coach the one way frequent in travelling flights
Two on flight really Boston me like
And like six would these fifty
```

#### Takeaway

Unigram model broken grammar এবং no coherent structure তৈরি করে।

কেন:

- এটি words independently sample করে,
- এটি word order model করে না,
- এটি previous words-এর ওপর condition করে না।

---

### ১৪.২ Bigram generation

Bigram probabilities ব্যবহার করে words sample করা হয়।

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

Bigram model locally বেশি fluent।

কেন:

- প্রতিটি word previous word-এর ওপর depend করে,
- adjacent word pairs unigram model-এর তুলনায় বেশি plausible।

তবে এটি এখনও globally awkward sequence তৈরি করতে পারে।

---

### ১৪.৩ Trigram generation

Trigram probabilities ব্যবহার করে words sample করা হয়।

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

Trigram model noticeably more fluent।

কেন:

- এটি দুটি previous words-এর ওপর condition করে,
- এটি bigram-এর তুলনায় বেশি local structure capture করে,
- দীর্ঘ generated text এখনও incoherent হতে পারে, তাই সীমাবদ্ধতা আছে।

---

## ১৫. Google Books N-gram Viewer

স্লাইডে Google Books n-grams এবং Google Books N-gram Viewer-এর একটি screenshot আছে।

### লেকচারে উদ্দেশ্য

এটি দেখানোর জন্য ব্যবহার করা হয়েছে যে বড় corpus-এ n-gram counts সময়ের সঙ্গে track করা যায়।

### Slide visual

Chart-এ বছর ধরে বিভিন্ন phrase frequency দেখানো হয়েছে, `I scream` এবং অনুরূপ continuation সম্পর্কিত phrases ব্যবহার করে। Visual-টি বোঝায় যে n-gram counts শুধু abstract ধারণা নয়: এগুলো বড় corpus থেকে measure এবং plot করা যায়।

---

## ১৬. Unknown Words

### ১৬.১ সমস্যা

Training-এর সময় কোনো word কখনো দেখা না গেলে, সেই word থাকা যেকোনো sentence probability zero পায়।

### কেন এটি ঘটে

স্লাইডে দুটি কারণ দেওয়া হয়েছে:

- সব corpora finite,
- নতুন words emerge করে।

### Consequence

Finite data-তে train করা language model প্রতিটি possible word-কে সরাসরি probability দিতে পারে না, যদি unseen words সামলানোর strategy না থাকে।

### ১৬.২ Common solutions

স্লাইডে দুটি solution দেওয়া হয়েছে:

1. Vocabulary-তে না থাকা সব word সামলাতে একটি specific **UNKNOWN** token ব্যবহার করা।
2. Unknown words-এর classes ব্যবহার করা, যেমন:
   - names,
   - numbers।

### অন্তর্দৃষ্টি

প্রতিটি unseen word-কে impossible ধরার বদলে model unseen word-কে known category-তে map করে এবং সেই category-কে কিছু probability দেয়।

---

## ১৭. Language Models-এর Evaluation

### ১৭.১ Train/dev/test split

স্লাইডে বলা হয়েছে language model train এবং evaluate করতে দরকার:

- training data,
- development data,
- test data।

### Roles

- **Training data:** model probabilities estimate করতে ব্যবহার করা হয়।
- **Development data:** smoothing parameters-এর মতো choices tune করতে ব্যবহার করা হয়।
- **Test data:** final model unseen data-তে evaluate করতে ব্যবহার করা হয়।

স্লাইডে পরে add-$k$ smoothing-এর জন্য $k$ এবং interpolation weights বেছে নেওয়ার সময় development data explicitভাবে mention করা হয়েছে।

---

### ১৭.২ Intrinsic evaluation: accuracy

#### সংজ্ঞা

Accuracy মাপে language model কতবার correct next word predict করে।

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

Accuracy যত বেশি, model তত ভালো।

#### অন্তর্দৃষ্টি

Accuracy সরাসরি test করে model-এর top predicted next word সত্যিকারের next word-এর সঙ্গে মেলে কি না।

---

### ১৭.৩ Intrinsic evaluation: perplexity

#### সংজ্ঞা

Perplexity মাপে model unseen text-এর words predict করতে কতটা সক্ষম।

স্লাইডে unseen text বলতে training data-তে নেই এমন text বোঝানো হয়েছে, যেমন test set।

#### অন্তর্দৃষ্টি

Perplexity বলে model test data দেখে কতটা surprised।

- Lower perplexity মানে model কম surprised।
- Lower perplexity ভালো।

#### স্লাইডের formal definition

Test documents $d = 1,\ldots,D$-এর জন্য:

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

যেখানে:

- $w_d$ হলো word sequence/document $d$,
- $N_d$ হলো document $d$-এর word সংখ্যা,
- $P(w_d)$ হলো model কর্তৃক document $d$-কে দেওয়া probability।

Expression-টি word সংখ্যা দিয়ে normalized average negative log-likelihood-এর exponential।

---

### ১৭.৪ Extrinsic evaluation

Extrinsic evaluation test করে language model কোনো external NLP task-এ সাহায্য করে কি না।

স্লাইডে list করা হয়েছে:

- sentence completion,
- grammatical error correction,
- natural language generation,
- speech recognition,
- machine translation।

### অন্তর্দৃষ্টি

Intrinsic evaluation জিজ্ঞেস করে: **Model text predict করতে কতটা ভালো?**

Extrinsic evaluation জিজ্ঞেস করে: **Model কি real task-এর performance উন্নত করে?**

---

## ১৮. Smoothing

### ১৮.১ Motivation

#### সমস্যা

Vocabulary-তে থাকা word-ও test data-তে unseen context-সহ দেখা যেতে পারে।

যদি context-word combination training-এ কখনো দেখা না যায়, model zero probability assign করে।

#### কেন এটি খারাপ

Sentence-এর কোনো একটি অংশের probability zero হলে product rule-এর কারণে পুরো sentence probability zero হয়ে যায়।

#### Slide phrase

স্লাইডে smoothing-কে বর্ণনা করা হয়েছে:

> “Steal from the rich and give to the poor.”

এর মানে frequent/seen events থেকে probability mass নিয়ে rare বা unseen events-কে কিছু probability দেওয়া।

---

### ১৮.২ Smoothing intuition

Smoothing intuition slide-এ distribution ব্যবহার করা হয়েছে:

$$
P(w \mid \text{denied the})
$$

Smoothing-এর আগে sparse counts:

| Word after `denied the` | Count |
|---|---:|
| allegations | 3 |
| reports | 2 |
| claims | 1 |
| request | 1 |
| total | 7 |

Smoothing-এর পরে distribution flattened হয়:

| Word class/item | Smoothed count |
|---|---:|
| allegations | 2.5 |
| reports | 1.5 |
| claims | 0.5 |
| request | 0.5 |
| other | 2 |
| total | 7 |

### Takeaway

Smoothing spiky distributions flatten করে, যাতে এগুলো better generalize করে।

Slide summary:

> Taking from the frequent and giving to the rare.

---

## ১৯. Add-1 Smoothing

### ১৯.১ সংজ্ঞা

**Add-1 smoothing**, যাকে **Laplace smoothing**-ও বলা হয়, সব counts-এ one add করে।

### Formal definition

$$
P_{\text{Add-1}}(x_n)
=
\frac{c(x_n)+1}{\text{Corpus size} + |V|}
$$

where:

- $c(x_n)$ হলো word $x_n$-এর count,
- $|V|$ হলো vocabulary size।

### অন্তর্দৃষ্টি

ধরে নেওয়া হয় আমরা প্রত্যেক word অন্তত একবার দেখেছি।

### Effect

এটি unseen words-এর জন্য zero probabilities আটকায়, কারণ count zero হলেও wordটি পায়:

$$
\frac{0+1}{\text{Corpus size}+|V|}
$$

---

## ২০. Add-$k$ Smoothing

### ২০.১ Motivation

স্লাইডে বলা হয়েছে add-1 smoothing unseen words-এর ওপর অতিরিক্ত probability mass দেয়।

এর ভালো version হলো add-$k$ smoothing, যেখানে:

$$
k < 1
$$

### ২০.২ Formal definition

$$
P_{\text{Add-}k}(x_n)
=
\frac{counts(x_n) + k}
{\text{corpus size} + k|V|}
$$

### অন্তর্দৃষ্টি

প্রতিটি word এক extra time দেখা হয়েছে ভাবার বদলে, প্রতিটি word $k$ extra times দেখা হয়েছে ধরে নেওয়া হয়।

যদি $k < 1$, unseen words কিছু probability পায়, কিন্তু add-1 smoothing-এর তুলনায় কম।

### ২০.৩ Hyperparameter tuning

স্লাইডে বলা হয়েছে $k$ হলো hyperparameter।

Optimal value development set-এ বেছে নেওয়া হয়।

---

## ২১. Interpolation

### ২১.১ Motivation

Longer contexts বেশি informative, কিন্তু শুধু তখনই যখন সেগুলো sufficiently frequent।

স্লাইডে দেওয়া হয়েছে:

```text
dog bites ...
```

যা এর চেয়ে বেশি informative:

```text
bites ...
```

কিন্তু স্লাইডে এটিও দেওয়া হয়েছে:

```text
canid bites ...
```

এটি এমন case যেখানে longer context খুব rare হলে কম useful হতে পারে।

### Core question

আমরা কি unigram, bigram এবং trigram probabilities থেকে evidence combine করতে পারি?

---

### ২১.২ Simple linear interpolation

Trigram language model-এর জন্য স্লাইডে define করা হয়েছে:

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

### অন্তর্দৃষ্টি

Model weighted average নেয়:

- trigram probability,
- bigram probability,
- unigram probability।

### Trade-off

স্লাইডে বলা হয়েছে:

- higher-order models বেশি informative কিন্তু less robust,
- lower-order models কম informative কিন্তু more reliable।

### Weights বেছে নেওয়া

Interpolation weights $\omega_i$ development set-এ parameter tuning করে বেছে নেওয়া হয়।

---

## ২২. Backoff

### ২২.১ Basic backoff idea

Backoff n-gram order $k$ দিয়ে শুরু করে। Count zero হলে model lower-order model ব্যবহার করে।

### স্লাইডের informal version

$$
BO(x_n \mid x_{n-1} \ldots x_{n-k})
=
\begin{cases}
P(x_n \mid x_{n-1} \ldots x_{n-k}), & \text{if } c(x_n \ldots x_{n-k}) > 0 \\
BO(x_n \mid x_{n-1} \ldots x_{n-k+1}), & \text{otherwise}
\end{cases}
$$

স্লাইডে প্রশ্ন করা হয়েছে:

> Is this a probability distribution?

Follow-up slide weighted version introduce করে, যাতে probabilities valid থাকে।

---

### ২২.২ Weights সহ proper backoff

স্লাইডে define করা হয়েছে:

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

is the backoff weight।

### Backoff weight-এর উদ্দেশ্য

Backoff weight compute করা হয় যাতে probability distribution respected থাকে:

- probabilities 0 এবং 1-এর মধ্যে থাকে,
- probabilities sum to 1 করে।

### Conditional switching

Backoff **conditional switching** ব্যবহার করে:

- এক সময়ে শুধু একটি model ব্যবহার করা হয়,
- higher-order n-gram observed হয়েছে কি না তার ওপর model choice depend করে।

### Reference

স্লাইড Jurafsky and Martin, 2018-এর দিকে ইঙ্গিত করে।

### [UNCLEAR: undefined $P^*$]

Weighted backoff formula-তে স্লাইড $P^*$ ব্যবহার করেছে, কিন্তু visible slide text-এ এটি define করেনি। Exact meaning-এর জন্য recording বা referenced reading check করা উচিত।

---

## ২৩. Key Concepts Summary

### Language model

**Intuition:** একটি model যা word sequence কত likely তা score করে।

**Formalism:** একটি model যা estimate করে:

$$
P(x_1, \ldots, x_N)
$$

অথবা conditional probabilities ব্যবহার করে:

$$
\prod_{n=1}^{N} P(x_n \mid \text{context})
$$

---

### N-gram

**Intuition:** consecutive words-এর fixed-length sequence।

**Formalism:** একটি n-gram-এ $n$টি word থাকে; unigram = 1, bigram = 2, trigram = 3।

---

### Unigram model

**Intuition:** শুধু individual word frequencies ব্যবহার করে sentence predict করে।

**Formalism:**

$$
P(x)=\prod_{n=1}^{N}P(x_n)
$$

---

### Bigram model

**Intuition:** প্রতিটি word শুধু previous word ব্যবহার করে predict করে।

**Formalism:**

$$
P(x)=\prod_{n=1}^{N}P(x_n\mid x_{n-1})
$$

---

### Markov assumption

**Intuition:** Full history-কে শুধু সবচেয়ে recent $k$ words দিয়ে approximate করা।

**Formalism:**

$$
P(x_n \mid x_{n-1}, \ldots, x_1)
\approx
P(x_n \mid x_{n-1}, \ldots, x_{n-k})
$$

---

### Perplexity

**Intuition:** unseen test text দেখে model কতটা surprised তা মাপে। Lower is better।

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

**Intuition:** Probability mass redistribute করা, যাতে unseen events zero probability না পায়।

**Formalism:** Example add-$k$:

$$
P_{\text{Add-}k}(x_n)
=
\frac{counts(x_n) + k}
{\text{corpus size} + k|V|}
$$

---

### Interpolation

**Intuition:** Informativeness এবং robustness balance করতে higher-order এবং lower-order models combine করা।

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

**Intuition:** Count available থাকলে high-order n-gram model ব্যবহার করা; না থাকলে lower-order model-এ fall back করা।

**Formalism:** Valid probability distribution preserve করতে $\alpha$ ব্যবহার করা weighted recursive definition।

---

## ২৪. Exam Flags and Revision Priority

### Explicit exam flags

Slide text-এ নিচের মতো explicit phrase দেখা যায়নি:

- “this will be on the exam,”
- “you should know this,”
- “common mistake,”
- “important,”

**[UNCLEAR: transcript missing]** Lecturer-এর verbal exam warning transcript ছাড়া recover করা যায় না।

### Slide emphasis থেকে high-value revision points

এগুলো explicit exam claim নয়, কিন্তু lecture-এর central formula/concepts:

- language modelling-এর definition: $P(x_1,\ldots,x_N)$ estimate করা,
- unigram model এবং এর independence failure,
- sentence probability-এর chain rule decomposition,
- maximum likelihood count ratios,
- sparsity problem,
- bigram model formula,
- $k$-th order Markov assumption,
- bigram-এর জন্য count-to-probability conversion,
- worked bigram probability example,
- unknown words এবং zero probability,
- accuracy vs perplexity,
- smoothing intuition,
- add-1 এবং add-$k$ smoothing,
- interpolation weights এবং development-set tuning,
- backoff এবং backoff weights।

---

## ২৫. আগের material, applications এবং readings-এর সঙ্গে connection

### আগের lecture-এর সঙ্গে connection

এই lecture আগের lecture, অর্থাৎ vector representations of text, অনুসরণ করে। এটি words/text represent করা থেকে corpus statistics ব্যবহার করে একটি concrete NLP problem solve করার দিকে যায়: language modelling।

### Lecture-এ যুক্ত applications

Language models যুক্ত:

- information retrieval/query completion,
- grammatical error correction,
- speech recognition,
- sentence completion,
- natural language generation,
- machine translation।

### Slides-এর reading references

Bibliography-তে আছে:

- Jurafsky & Martin-এর Chapter 3,
- Eisenstein-এর Chapter 6,
- Michael Collins-এর language models notes।

---

## ২৬. Recording-এ ফিরে শুনে দেখা দরকার এমন unclear sections

1. **[UNCLEAR: transcript missing]** এই chat-এ transcript ছিল না, তাই lecturer-এর verbal explanations, exam hints, warnings, corrections বা worked-through comments অনুপস্থিত।

2. **[UNCLEAR: sentence-space notation]** Sentence probability গণনার slide-এ garbled notation আছে: `for ↓x ↔ V max N`। Intended notation $x \in V^N$, $x \in V^{\le N}$, নাকি অন্য কিছু — তা check করা দরকার।

3. **[UNCLEAR: bigram probability table arithmetic]** Slide-এ $P(\text{band}\mid \text{are}) = 0.00003$ বলা হয়েছে, কিন্তু count table অনুযায়ী $1/4000 = 0.00025$। এটি slide typo বা transcription/rendering issue হতে পারে।

4. **[UNCLEAR: boundary tokens in worked bigram example]** `[arctic, monkeys, are, my, favourite, band]` bigram worked example-এ $\langle s\rangle$ বা $\langle /s\rangle$ নেই। Lecturer কি simplicity-এর জন্য এগুলো বাদ দেওয়ার কথা বলেছেন কি না check করা দরকার।

5. **[UNCLEAR: backoff $P^*$]** Final backoff formula-তে $P^*$ ব্যবহার করা হয়েছে, কিন্তু visible slide-এ এটি define করা নেই। Recording বা Jurafsky and Martin reference check করা দরকার।

6. **[UNCLEAR: repeated slides]** Incremental reveal animations-এর কারণে কয়েকটি slide repeated দেখায়। Parsed deck-এ অতিরিক্ত content visible নয়, তবে transcript-এ ঐ repeated slides চলাকালীন extra explanation থাকতে পারে।

---

## ২৭. Quick Formula Sheet

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

