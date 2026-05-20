---
subject: COMP64702
chapter: 8
title: "LLM Pretraining & Training Data"
language: en
---

# Study Notes — Training Data and Pretraining Large Language Models

**Topic and scope:** This lecture set covers the data pipeline for large language models and the pretraining objective used to train modern decoder-only Transformer LLMs. It connects corpus construction, filtering, bias, contamination, and scaling laws with autoregressive next-token prediction, cross-entropy loss, training/inference, and instruction tuning.

**Course:** [UNCLEAR: course name not provided; slides are from University of Manchester NLP / LLM lectures.]  
**Lecture topic:** Training Data for Large Language Models; Pretraining Large Language Models.  
**Sources used:** Uploaded slide decks: `4_LLM-Data.pdf` and `TRIM 5_LLM-pretraining-Final -3.pdf`.  
**Source limitation:** No separate lecture transcript text was provided in the chat. Notes are based on the uploaded slides and their rendered images. Transcript-dependent items are marked **[UNCLEAR]**.

---

## 1. Where this material fits in the LLM pipeline

The pretraining lecture is positioned after earlier material on:

- Transformers
- BERT
- training data for LLMs

The current focus is: **how large language models are pretrained**.

The learning outcomes from the pretraining slide deck are to:

- define LLM pretraining and explain why it is self-supervised;
- compare Transformer variants: encoder-only, encoder-decoder, and decoder-only;
- explain why modern LLMs use decoder-only architectures with causal attention;
- formulate the training objective using autoregressive probability factorisation and cross-entropy loss;
- distinguish training from inference;
- evaluate implications such as hallucinations, bias, scale, compute, adaptation, and instruction tuning.

The training-data lecture gives the upstream context: LLMs learn from large text corpora, and the quality, diversity, filtering, contamination, and representational biases of these corpora shape model behaviour.

---

# Part I — Training Data for Large Language Models

---

## 2. Why training data matters

### 2.1 Core idea

Training data is described as the **“fossil fuels”** for training LLMs. The data drives what models learn and how they behave.

To develop broad capabilities, models need diverse and extensive text corpora. The slides list examples such as:

- science;
- fiction;
- encyclopedias;
- emails;
- books;
- code;
- web text.

The reason for broad data coverage is to support:

- language understanding;
- reasoning;
- world knowledge;
- generalisation;
- robustness.

Poorly curated data can introduce:

- bias;
- misinformation;
- safety risks.

### 2.2 High-quality data versus simply more data

The slide deck includes a dataset comparison chart plotting **aggregate score** against **training tokens in billions**. The key conclusion is:

> As the amount of training data increases, high-quality datasets yield significantly better performance than low-quality ones.

A second point follows:

> Investing effort in building or selecting a higher-quality corpus can yield better model performance than simply increasing token count.

### Key concept: data quality

**Intuition:** Data quality is how useful a dataset is for training a model that behaves well. A high-quality corpus is cleaner, more relevant, less duplicated, less noisy, more diverse, and less likely to contain harmful or misleading artefacts.

**Formal definition from lecture:** No mathematical definition is given. The slides define data quality operationally through curation, filtering, deduplication, benchmark performance, and avoidance of spam, boilerplate, contamination, and unwanted bias.

### Exam flag

**[EXAM / REVISION FLAG]** Training data is not a neutral background detail. It affects model capabilities, benchmark performance, bias, safety, and hallucination risk. This is a central theme across both slide decks.

---

## 3. Key datasets for training LLMs

The training-data lecture identifies five key dataset families:

| Dataset | Role in LLM training |
|---|---|
| **Common Crawl** | Raw foundation for many datasets, including C4 and parts of GPT-3. |
| **C4 — Colossal Clean Crawled Corpus** | Cleaned and filtered version of Common Crawl used by T5 and others. |
| **WebText / OpenWebText** | Curated web content based on Reddit links; more targeted than Common Crawl. |
| **The Pile** | Modular, high-quality open-source dataset aggregating books, GitHub, academic papers, and other sources. |
| **GPT-3 dataset** | Proprietary mixture drawing from Common Crawl, WebText, books, Wikipedia, code, and related sources. |

---

## 4. Common Crawl

### 4.1 Definition and role

**Definition in own words:** Common Crawl is a very large open-access web-crawl resource. It provides raw web data that can be used as a foundation for LLM pretraining datasets, but it requires extensive cleaning and filtering.

**Slide details:**

- Nonprofit project.
- Provides open-access web crawl data.
- Approximate size: **320 TB**.
- Maintains regular snapshots of the internet.
- Freely available.
- Used as a standard data source for models and datasets including:
  - T5;
  - GPT-3;
  - Gopher.
- Popular because of:
  - scale;
  - openness;
  - ease of use.

### 4.2 Contents

Common Crawl contains a wide range of web content, including:

- blogs;
- forums;
- news;
- general web pages.

### 4.3 Strengths

Common Crawl’s main strengths are:

- massive scale;
- broad coverage;
- easy accessibility.

### 4.4 Limitations

Common Crawl is not curated. The slides list the following limitations:

- noisy content;
- spam;
- boilerplate;
- duplicated content;
- irrelevant content;
- need for significant filtering for quality, ethics, and relevance.

### Key concept: raw web crawl

**Intuition:** A raw web crawl is like scraping a huge fraction of the public web without yet deciding what is useful, safe, representative, or high quality.

**Formal definition from lecture:** No formal mathematical definition is given. Common Crawl is described as open-access web crawl data and a raw foundation for later curated datasets.

---

## 5. WebText and OpenWebText

### 5.1 Background

Earlier LLMs used datasets based on:

- news;
- Wikipedia;
- fiction.

Common Crawl was much larger but noisy, containing spam and boilerplate. WebText was created as a more curated alternative.

### 5.2 WebText

**Definition in own words:** WebText is a curated web dataset created by selecting URLs from Reddit posts that received enough upvotes. Reddit upvotes act as a rough proxy for content quality.

**Slide details:**

- Created by OpenAI.
- URLs came from Reddit posts with at least **3 upvotes**.
- Curated for high-quality and diverse content.
- Excluded Wikipedia to allow fair benchmark evaluation.
- Used to train GPT-2.
- Approximate size: **40 GB**.

### 5.3 OpenWebText

**Definition in own words:** OpenWebText is a community-built attempt to recreate WebText because the original WebText dataset was not released publicly.

**Slide details:**

- Community-built replica of WebText.
- Uses URLs from Reddit submissions.
- Filtered with Facebook’s FastText for English-only content.
- Deduplicated.
- Approximate size: **38 GB**.

### 5.4 Reddit bias

The key insight from the slide is:

> Curation improves quality but inherits Reddit user bias.

The slides describe this bias as:

- young;
- male;
- Western.

### Key concept: curation bias

**Intuition:** The method used to select “good” data can itself introduce bias. If Reddit upvotes decide what enters the dataset, then the resulting model sees the internet through the preferences and demographics of Reddit users.

**Formal definition from lecture:** No formal definition is given.

---

## 6. C4 — Colossal Clean Crawled Corpus

### 6.1 Definition

**Definition in own words:** C4 is a cleaned, English-only subset of Common Crawl designed to improve training data quality by removing low-quality, noisy, or unwanted web text.

**Slide details:**

- Full name: **Colossal Clean Crawled Corpus**.
- Filtered version of the **April 2019 Common Crawl**.
- Keeps approximately **10%** of the original crawl.
- Size: approximately **156B tokens**.
- Approximate storage size: **806 GB** of English-only text.
- Used to train models such as **T5**.

### 6.2 Filtering criteria

C4 filtering removed:

- profanity;
- code;
- boilerplate;
- very short documents.

Language filtering used:

- `langdetect`.

The slide explicitly warns:

> Filter decisions affect which voices and topics remain.

### 6.3 C4 compared with raw Common Crawl

| Feature | Common Crawl | C4 |
|---|---|---|
| Size | ~320 TB | ~806 GB |
| Curation | Minimal | Heavily filtered |
| Language | Multilingual | English-only |
| Quality | Noisy, redundant | Cleaner, more structured |

The slide summary states that C4 is a cleaner, smaller, English-only subset of Common Crawl, designed to improve data quality for model training **at the cost of reduced diversity**.

### Key concept: filtering trade-off

**Intuition:** Filtering can improve quality by removing spam and noise, but it can also remove legitimate text, minority dialects, or underrepresented topics.

**Formal definition from lecture:** No formal mathematical definition is given.

### Exam flag

**[EXAM / REVISION FLAG]** C4 is a key example of the tension between quality and diversity. Know that it is a filtered English-only Common Crawl subset, and know why filtering can introduce representational harms.

---

## 7. GPT-3 dataset

### 7.1 Definition and construction

**Definition in own words:** The GPT-3 dataset is a proprietary mixture of filtered Common Crawl plus curated sources such as WebText2, Books1, Books2, and Wikipedia.

**Slide details:**

- Built from **2016–2019 Common Crawl snapshots**.
- A binary classifier was trained to distinguish:
  - WebText-like content;
  - ordinary Common Crawl content.
- The classifier helped retain higher-quality curated web content.

### 7.2 Content selection and cleanup

The slide lists three cleanup steps:

1. **Fuzzy matching** using **13-gram overlap**.
2. Removal of content if it appeared in fewer than **10 documents**.
3. Exclusion of test data from common benchmark datasets to avoid data leakage.

### 7.3 Expanded data sources

The GPT-3 dataset included:

- Common Crawl, filtered;
- WebText2;
- Books1;
- Books2;
- Wikipedia.

### 7.4 GPT-3 dataset mixture table

| Dataset | Quantity / tokens | Weight in training mix | Epochs elapsed when training for 300B tokens |
|---|---:|---:|---:|
| Common Crawl, filtered | 410B | 60% | 0.44 |
| WebText2 | 19B | 22% | 2.9 |
| Books1 | 12B | 8% | 1.9 |
| Books2 | 55B | 8% | 0.43 |
| Wikipedia | 3B | 3% | 3.4 |

The table note says that **weight in training mix** refers to the fraction of training examples drawn from a given dataset during training. The weights are intentionally not proportional to dataset size.

### 7.5 Important implication of the mixture

Some sources are seen multiple times during training, while others are seen less than once.

Examples:

- Wikipedia is only 3B tokens but has 3% weight, so it is seen for about **3.4 epochs**.
- Filtered Common Crawl is 410B tokens with 60% weight, so when training for 300B tokens it is seen for about **0.44 epochs**.

### Key concept: training mix weight

**Intuition:** Training mix weight controls how often a dataset contributes examples during training. It is not the same as raw dataset size.

**Formal definition from slide:** “Weight in training mix” refers to the fraction of examples drawn from a given dataset during training.

---

## 8. The Pile

### 8.1 Definition

**Definition in own words:** The Pile is a large, open-source, diverse English dataset designed to train open LLMs and improve coverage of domains not well represented in standard web-crawl datasets.

**Slide details:**

- Developed by **EleutherAI**.
- EleutherAI is described as an open-source AI research group.
- Goal:
  1. build a high-quality, diverse dataset for training open LLMs;
  2. improve representation of underrepresented domains.
- Content: **825 GB** of English text from **22 sources**.
- Used in:
  - GPT-Neo;
  - GPT-J;
  - Pythia;
  - other open models.

### 8.2 Domains included

The Pile includes:

- academic papers;
- GitHub;
- StackExchange;
- books;
- medical corpora;
- legal corpora;
- biomedical text;
- programming text;
- law;
- online forums;
- subtitles.

### 8.3 Top contributors

The slide lists major contributors by size/weight:

- Pile-CC: **18%**;
- PubMed Central;
- Books3;
- ArXiv;
- GitHub.

### 8.4 Full component table from slide

| Component | Raw size | Weight | Epochs | Effective size | Mean document size |
|---|---:|---:|---:|---:|---:|
| Pile-CC | 227.12 GiB | 18.11% | 1.0 | 227.12 GiB | 4.33 KiB |
| PubMed Central | 90.27 GiB | 14.40% | 2.0 | 180.55 GiB | 30.55 KiB |
| Books3 | 100.96 GiB | 12.07% | 1.5 | 151.44 GiB | 538.36 KiB |
| OpenWebText2 | 62.77 GiB | 10.01% | 2.0 | 125.54 GiB | 3.85 KiB |
| ArXiv | 56.21 GiB | 8.96% | 2.0 | 112.42 GiB | 46.61 KiB |
| GitHub | 95.16 GiB | 7.59% | 1.0 | 95.16 GiB | 5.25 KiB |
| FreeLaw | 51.15 GiB | 6.12% | 1.5 | 76.73 GiB | 15.06 KiB |
| StackExchange | 32.20 GiB | 5.13% | 2.0 | 64.39 GiB | 2.16 KiB |
| USPTO Backgrounds | 22.90 GiB | 3.65% | 2.0 | 45.81 GiB | 4.08 KiB |
| PubMed Abstracts | 19.26 GiB | 3.07% | 2.0 | 38.53 GiB | 1.30 KiB |
| Gutenberg / PG-19 | 10.88 GiB | 2.17% | 2.5 | 27.19 GiB | 398.73 KiB |
| OpenSubtitles | 12.98 GiB | 1.55% | 1.5 | 19.47 GiB | 30.48 KiB |
| Wikipedia (en) | 6.38 GiB | 1.53% | 3.0 | 19.13 GiB | 1.11 KiB |
| DM Mathematics | 7.75 GiB | 1.24% | 2.0 | 15.49 GiB | 8.00 KiB |
| Ubuntu IRC | 5.52 GiB | 0.88% | 2.0 | 11.03 GiB | 545.48 KiB |
| BookCorpus2 | 6.30 GiB | 0.75% | 1.5 | 9.45 GiB | 369.87 KiB |
| EuroParl | 4.59 GiB | 0.73% | 2.0 | 9.17 GiB | 68.87 KiB |
| HackerNews | 3.90 GiB | 0.62% | 2.0 | 7.80 GiB | 4.92 KiB |
| YouTubeSubtitles | 3.73 GiB | 0.60% | 2.0 | 7.47 GiB | 22.55 KiB |
| PhilPapers | 2.38 GiB | 0.38% | 2.0 | 4.76 GiB | 73.37 KiB |
| NIH ExPorter | 1.89 GiB | 0.30% | 2.0 | 3.79 GiB | 2.11 KiB |
| Enron Emails | 0.88 GiB | 0.14% | 2.0 | 1.76 GiB | 1.78 KiB |
| **Total** | **825.18 GiB** |  |  | **1254.20 GiB** | **5.91 KiB** |

### 8.5 Key takeaways from The Pile paper

The slide gives the following findings:

- Smaller, high-quality sources, such as academic and professional text, can outperform large-scale web-crawled data for training LLMs.
- Bias analysis on pejorative, gender, and religion categories shows patterns consistent with prior studies, meaning similar ethical challenges persist.
- The Pile contains a lot of information that is not well covered by GPT-3’s dataset.
- Most effective components:
  - DM Mathematics;
  - Enron Emails;
  - PubMed Central.
- Less effective or redundant components:
  - YouTubeSubtitles;
  - Gutenberg / PG-19;
  - OpenWebText2.
- Some components show negative impact.

### Key concept: high-quality domain data

**Intuition:** High-quality domain data is dense, informative, specialised text, such as academic papers, biomedical articles, legal material, technical documents, or professional emails.

**Formal definition from lecture:** No formal definition is provided.

---

## 9. Biases in data representation

### 9.1 Training data is not demographically neutral

The slides state:

> Training data is not demographically neutral — it reflects the biases of those who produce content online.

The examples given are:

- internet data overrepresents young users from developed countries;
- GPT-2’s data is Reddit-based;
- 67% of U.S. Reddit users were men;
- 64% of U.S. Reddit users were aged 18–29;
- only approximately 9–15% of Wikipedians are female.

The slide asks:

> What about the elderly?

This highlights that older people may be underrepresented in online corpora.

### Key concept: representation bias

**Intuition:** Representation bias occurs when a dataset overrepresents some groups, countries, languages, or writing styles while underrepresenting others.

**Formal definition from lecture:** No formal definition is given. The slides define it through the idea that training data reflects who produces online content.

### 9.2 Whose voices are missing?

The slides emphasise that online environments can discourage marginalised groups from contributing.

Examples:

- online harassment can discourage queer and trans people from contributing;
- filtering removes noise, but also meaningful content;
- **22–36%** of filtered LGBTQ+ mentions were benign;
- African-American English was filtered **42%** of the time versus **6.2%** for Standard English.

The slide summary is:

> Cleaning steps can systematically silence marginalized communities.

### Key concept: filtering bias

**Intuition:** Filtering bias happens when data-cleaning rules remove content from some groups, dialects, identities, or communities more often than others.

**Formal definition from lecture:** No formal definition is given.

---

## 10. Matrix dataset

### 10.1 Definition

**Definition in own words:** Matrix is a transparent bilingual English–Chinese pretraining corpus designed to cover web data, code, academic/professional text, and underrepresented domains.

**Slide details:**

- Developed by **MAP**, Multimodal Art Projection.
- MAP is described as the open-source AI research group behind MAP-Neo.
- Goal:
  1. assemble a transparent bilingual English + Chinese pretraining corpus;
  2. boost coverage of underrepresented domains.

### 10.2 Content

Matrix contains:

- **4.5 trillion tokens** of cleaned text;
- data from **22 heterogeneous sources**.

Categories include:

- web crawl: Common Crawl, **52.6%**;
- programming code: GitHub, StackExchange, etc., **22.3%**;
- academic and professional text:
  - arXiv;
  - PubMed;
  - legal documents;
  - textbooks;
- other printed / structured text:
  - OCR’d PDFs of books;
  - government reports;
  - exams.

### 10.3 Matrix composition chart

The slide includes donut charts showing language and source composition. Some labels are visible, but not all chart percentages are legible in the rendered image.

**[UNCLEAR]** The precise percentages from the donut charts should be checked in the recording or original slide if needed. The bullet values above are the reliable values from the slide text.

---

## 11. FineWeb-Edu dataset

### 11.1 Definition

**Definition in own words:** FineWeb-Edu is an education-focused corpus filtered from FineWeb sources, designed to improve reasoning and knowledge performance using high-quality educational content.

**Slide details:**

- Developed by **Hugging Face**.
- Hugging Face is described as an open-source AI research collaboration.
- Goal:
  1. assemble a high-quality education-focused corpus for pretraining open LLMs;
  2. enhance model performance on reasoning and knowledge tasks with minimal data.

### 11.2 Content

FineWeb-Edu contains:

- **1.3 trillion tokens**;
- grade-school and middle-school-level web pages;
- data filtered from FineWeb heterogeneous sources.

It balances quality and diversity by combining:

- curated educational sites;
- K–12 lesson plans;
- school portals;
- textbook excerpts;
- encyclopedic articles;
- vetted forum Q&A for informal explanations.

---

## 12. C4 dataset analysis

### 12.1 What Dodge et al. analysed

The slides state that Dodge et al. conducted an extensive analysis of C4, which was used in T5 pretraining.

They evaluated:

- document-level quality;
- content characteristics;
- source domain;
- document structure;
- utterance style;
- whether content was human-authored or machine-authored;
- social biases;
- contamination with evaluation data;
- excluded content, including:
  - medical / health data;
  - explicit demographic information;
  - personally identifiable information.

The slide note states that Raffel et al. 2020 only provided scripts to recreate C4, and running those scripts cost thousands of dollars.

### 12.2 Source distribution and quality concerns

The slides flag the following issues:

- A surprising amount of data came from `patents.google.com`.
- 65% of pages were in the Internet Archive.
- Of those archived pages, 92% were written in the past 10 years.
- 51.3% of pages were hosted in the United States.
- There were fewer pages from India, even though India has many English speakers.
- Some `patents.google.com` texts were auto-generated and contained systematic errors.

The patent-related quality concerns were:

- documents originally filed in foreign languages, such as Japanese, were machine-translated into English;
- text was extracted via OCR, causing transcription issues.

### 12.3 Token distribution by domain

The C4 token-distribution slide shows:

- top-level domains;
- most frequent websites;
- token frequency measured in log scale.

The slide concludes:

- there is heavy dominance of US-based commercial domains;
- there are high-frequency automated sites.

**[UNCLEAR]** Exact bar values are not given in the slide text and are difficult to read from the rendered chart. Use the qualitative conclusions unless the original lecture recording gives the precise values.

---

## 13. Data contamination

### 13.1 Formal definition

**Formal definition from slide:** Data contamination occurs when benchmark test data appears in pretraining corpora, either partially or entirely.

### 13.2 Definition in own words

Data contamination means the model may have already seen some or all of an evaluation example during pretraining. This can make benchmark performance look better than it really is, because the model may memorise examples rather than generalise.

### 13.3 Why contamination matters

The slide states that contamination leads to:

- inflated benchmark performance;
- misleading conclusions about a model’s generalisation.

### 13.4 Examples

The slides give two examples:

- **XSUM summarisation:** approximately **15.5% overlap**, input + output.
- **QNLI, Wikipedia-based:** up to **53.6% overlap**, input only.

### 13.5 Types of data contamination

#### Input-and-output contamination

Both the input and expected output appear in the training data.

Slide values:

- range: **1.87%–24.88%**;
- XSUM example: **15.49%**.

This is the more harmful type because the model can memorise the entire input-output pair, severely inflating benchmark scores.

#### Input-only contamination

Only the input appears in the training data.

Slide value:

- up to **53.6%**, e.g. QNLI based on Wikipedia.

This is still problematic but generally less severe than full input-output overlap.

### 13.6 Worked example: XSUM contamination

The slide gives an XSUM summarisation example.

**Input:**

> The 48-year-old former Arsenal goalkeeper played for the Royals for four years. He was appointed youth academy director in 2000 and has been director of football since 2003. A West Brom statement said: “He played a key role in the Championship club twice winning promotion to the Premier League in 2006 and 2012.”

**Output:**

> West Brom have appointed Nicky Hammond as technical director, ending his 20-year association with Reading.

**Why this is contamination:** If both the article input and the expected summary appear in pretraining data, the model can learn the specific mapping rather than demonstrating summarisation ability.

### Exam flag

**[EXAM / REVISION FLAG]** Know the distinction between input-only contamination and input-and-output contamination. Input-and-output contamination is more harmful because it allows memorisation of the complete benchmark example.

---

## 14. Representational harms

### 14.1 Sentiment bias

The slides discuss sentiment bias by analysing co-occurrence between identity terms and sentiment-bearing words.

Identity terms include:

- Jewish;
- Arab.

Sentiment-bearing words include:

- successful;
- dangerous.

Example findings:

- Jewish: **73.2% positive sentiment**.
- Arab: **65.7% positive sentiment**.
- Difference: **7.5%**.

News outlet variation:

- New York Times: **4.5% gap**.
- Al Jazeera: **no difference**.

The slide states:

> Even subtle sentiment biases can skew the representation of identities in model training data.

### Key concept: sentiment bias

**Intuition:** Sentiment bias occurs when some identities are more often surrounded by positive or negative words than others, causing the model to learn skewed associations.

**Formal definition from lecture:** No mathematical definition is given. The slide defines the analysis method as co-occurrence of identity terms with sentiment-bearing words.

### 14.2 Filtering bias

The slide gives dialect-based filtering rates:

- African American English: **42% filtered**.
- Hispanic-aligned English: **32% filtered**.
- White American English: **6.2% filtered**.

The slide states:

> Filtering heuristics can reinforce systemic erasure of minority voices, even when content is benign.

### 14.3 Groups affected by filtering

The slide titled **“Bias in Filtering: Which Groups Are Affected Most?”** shows a chart of PMI between identity terms and filtered-by-blocklist data.

Groups visible in the chart include:

- lesbian / lesbians;
- gay / gays;
- heterosexual / heterosexuals;
- homosexual / homosexuals;
- bisexual / bisexuals;
- Latino / Latina / Latinx;
- non-binary;
- trans / transgender;
- female / females;
- women / woman;
- Asian / Asians;
- Muslim / Muslims;
- Jewish / Jews;
- African American;
- Black;
- Christian;
- white / whites;
- European.

**[UNCLEAR]** The chart values are not clearly legible in the rendered image. The key qualitative point is that filtering affects identity-related content unevenly and can remove benign minority-community content.

---

## 15. Common data filtering pipeline

The slide shows this pipeline:

```text
Raw Data Input
  -> HTML Extraction
  -> FastText Filter
  -> Deduplicate
  -> Heuristic Rules
  -> PII Anonymization
  -> Data Contamination
  -> FineWeb Dataset
```

The diagram is visually arranged across two rows, but the logical pipeline is the sequence above.

---

## 16. Base filter

### 16.1 Goal

The goal is to perform initial quality screening on raw web text to remove obviously low-quality content and non-English text, creating a clean foundation dataset for later processing.

### 16.2 Steps

#### Language identification

- Use a FastText classifier.
- Filter non-English content.
- Retain text with English probability at least:

```math
0.65
```

#### URL blacklist

Remove:

- adult content;
- spam websites;
- other inappropriate sources.

#### Quality filtering

Apply MassiveText rules to remove:

- overly short text;
- repetitive content;
- malformed documents.

#### Basic cleaning

Remove:

- obvious template text;
- navigation menus;
- advertising content.

### Key concept: base filtering

**Intuition:** Base filtering is the first pass that removes obviously unsuitable web text before more specialised cleaning steps.

**Formal definition from lecture:** No mathematical definition is given beyond the English probability threshold of 0.65.

---

## 17. Deduplication

### 17.1 Goal

The goal is to eliminate duplicate content in the dataset to:

- prevent model over-memorisation of repeated text;
- improve data diversity;
- improve training efficiency.

### 17.2 Algorithmic details from slide

The slide specifies:

- use **MinHash**;
- use **5-grams**;
- use **112 hash functions**;
- use a **75% similarity threshold**;
- deduplicate each Common Crawl snapshot independently;
- use transitive clustering so only one copy remains in similar document groups.

### 17.3 Procedure

1. Represent documents using 5-gram features.
2. Apply MinHash with 112 hash functions to estimate document similarity.
3. Identify near-duplicate documents using a 75% similarity threshold.
4. Process each Common Crawl snapshot independently to avoid over-removal.
5. Cluster similar documents transitively.
6. Keep only one copy in each similar-document group.

### Key concept: fuzzy deduplication

**Intuition:** Fuzzy deduplication removes near-duplicates, not just exact duplicates.

**Formal operational definition from slide:** MinHash over 5-grams with 112 hash functions and a 75% similarity threshold.

---

## 18. Heuristic rules

### 18.1 Goal

The goal is to develop precise heuristic rules based on data analysis to improve text quality by filtering documents with formatting anomalies and poor content quality.

### 18.2 Rules from slide

#### Punctuation ratio

Filter documents with:

```math
< 12\%
```

of lines ending in punctuation.

Purpose: ensure content completeness.

#### Duplicate line control

Remove documents with:

```math
> 10\%
```

duplicate line character ratio.

Purpose: reduce templated content.

#### Short line filtering

Filter documents with:

```math
> 67\%
```

short lines, where short lines are fewer than 30 characters.

Purpose: ensure substantial content.

#### Data-driven thresholds

Threshold parameters are chosen through comparative analysis of high-quality versus low-quality data.

### Key concept: heuristic filtering

**Intuition:** Heuristic filtering uses simple measurable rules to remove documents that look malformed, repetitive, incomplete, or low-value.

**Formal definition from lecture:** No single formal definition is given. The formal content is the set of thresholds above.

---

## 19. PII anonymization

### 19.1 Goal

The goal is to protect personal privacy by removing or anonymising personally identifiable information, ensuring the dataset complies with privacy protection requirements and legal regulations.

### 19.2 Methods from slide

#### Email addresses

- Use regex patterns to identify email addresses.
- Anonymise all email addresses.

#### IP addresses

- Detect public IP addresses.
- Mask public IP address information.

#### Pattern matching

- Use rule-based personal information identification.
- Replace identified personal information.

#### Privacy compliance

- Ensure dataset release meets data protection regulatory requirements.

### Key concept: PII

**Intuition:** Personally identifiable information is information that can identify a specific person, such as an email address or IP address.

**Formal definition from lecture:** No formal definition is given.

---

## 20. Neural scaling law

### 20.1 Motivation

The slide states that model sizes exploded from millions to billions of parameters, which increased:

- training costs;
- training runtimes.

The field lacked quantitative guidance on when to invest in:

- larger models;
- more data;
- more compute.

### 20.2 Key finding

Test loss $L$ follows power-law relationships with:

- parameters $N$;
- data $D$;
- compute $C$.

### 20.3 Formula shown on slide

The slide states that for each modality, fixing one of $C$ or $N$, varying the other, and varying $D$ using:

```math
D = \frac{C}{6N}
```

the achievable test loss satisfies:

```math
L = L_0 + \left(\frac{x_0}{x}\right)^\alpha
```

### 20.4 Intuition

As the relevant resource $x$ increases, loss falls according to a power law and approaches a floor $L_0$.

### [UNCLEAR]

The slide does not define every symbol in detail. It explicitly mentions $L$, $N$, $D$, and $C$, but the exact definitions of $x$, $x_0$, and $\alpha$ are not provided in the visible slide text.

---

## 21. Data mixing scaling laws

### 21.1 Key idea

The slide introduces an exponential-form law to predict domain-specific loss $L$ as a function of data proportions $t$.

### 21.2 Procedure

The slide describes the process:

1. Select representative data domains.
2. Design a set of mixing ratios.
3. Train small proxy models.
4. Record performance per domain.

The plots show reducible loss on:

- GitHub;
- Pile-CC.

These are plotted against the proportion of that domain in the training mix.

### Key concept: data mixing

**Intuition:** Data mixing is choosing how much training data to draw from each source or domain.

**Formal definition from lecture:** Domain-specific loss $L$ is modelled as a function of data proportions $t$, using an exponential-form law.

### [UNCLEAR]

The exact exponential-form equation is not printed in the visible slide text.

---

## 22. Summary of the training-data lecture

The final slide states:

- The total amount of available data, including web and private data, is massive.
- Training on “all of it,” even all of Common Crawl, does not work well.
- Training on all available raw data is not an effective use of compute.
- Filtering and curation are needed, with OpenWebText, C4, and GPT-3 dataset construction as examples.
- Filtering and curation can result in biases.
- Curating high-quality non-web datasets is promising, with The Pile as the example.
- It is important to carefully document and inspect datasets.

---

# Part II — Pretraining Large Language Models

---

## 23. Transformer architecture variants

The pretraining lecture compares three Transformer variants.

### 23.1 Encoder-only Transformers

**Uses:**

- natural language understanding;
- classification;
- feature extraction.

**Examples:**

- BERT;
- RoBERTa;
- DeBERTa.

### 23.2 Encoder-decoder Transformers

**Uses:**

- natural language generation;
- translation;
- summarisation;
- sequence-to-sequence mapping.

**Examples:**

- T5;
- Flan-T5;
- BART.

### 23.3 Decoder-only Transformers

**Uses:**

- natural language generation;
- translation;
- summarisation;
- completion.

**Examples:**

- GPT-x;
- LLaMA;
- “every other new model today,” as written on the slide.

### Key concept: Transformer variant

**Intuition:** Different Transformer variants expose different parts of the original encoder-decoder architecture. Encoder-only models are strong for understanding tasks; encoder-decoder models are strong for sequence-to-sequence transformation; decoder-only models are strong for left-to-right generation.

**Formal definition from lecture:** No mathematical definition is given; the slide classifies models by architecture and task use.

### Exam flag

**[EXAM / REVISION FLAG]** The pretraining learning outcomes explicitly require comparing encoder-only, encoder-decoder, and decoder-only Transformer variants.

---

## 24. Decoder-only architecture

### 24.1 Modern LLMs

The slide states that modern LLMs use:

- Transformer decoder blocks;
- causal attention;
- no access to future tokens;
- left-to-right generation.

### 24.2 Contrast with BERT

BERT is contrasted as:

- bidirectional;
- using masked language modelling.

### Key concept: causal attention

**Intuition:** Causal attention prevents a token from attending to future tokens. The model can only use past context when predicting the next token.

**Formal definition from slide:** Causal attention means **no access to future tokens**.

### Key concept: left-to-right generation

**Intuition:** The model generates one token at a time, appending each new token to the context before generating the next one.

**Formal definition from lecture:** No mathematical definition is given beyond the autoregressive factorisation covered later.

---

## 25. GPT series

### 25.1 GPT definition

GPT stands for:

> **Generative Pretrained Transformer**

The slide describes GPT models as a series of models from OpenAI used for generative tasks.

### [UNCLEAR]

The slide text says: “These are decoder transfer language models.” This is likely intended to mean “decoder Transformer language models,” but the slide text itself says “transfer.” Check the recording or original slide if this distinction matters.

### 25.2 GPT-2

The slide gives these details:

- Radford et al., 2019.
- Decoder-only.
- Pretrained on more data than GPT.
- Data: WebText from Reddit.
- Size: **40 GB**.
- Good at generation tasks.

### 25.3 GPT-3

The slide gives these details:

- Brown et al., 2020.
- Decoder-only.
- Pretrained on even more data.
- Data scale stated on slide: **45 TB**.

The GPT-3 slide also includes the dataset mixture table described earlier:

| Dataset | Quantity / tokens | Weight in training mix | Epochs elapsed when training for 300B tokens |
|---|---:|---:|---:|
| Common Crawl, filtered | 410B | 60% | 0.44 |
| WebText2 | 19B | 22% | 2.9 |
| Books1 | 12B | 8% | 1.9 |
| Books2 | 55B | 8% | 0.43 |
| Wikipedia | 3B | 3% | 3.4 |

---

## 26. GPT-3 in-context learning

The slide contrasts GPT-3 “in-context” learning with traditional fine-tuning.

### 26.1 Zero-shot prompting

Zero-shot prompting gives a task description but no examples.

Example from slide:

```text
Translate English to French:
cheese =>
```

The model must infer the task from the instruction alone.

### 26.2 One-shot prompting

One-shot prompting gives one demonstration before the target query.

Example from slide:

```text
Translate English to French:
sea otter => loutre de mer
cheese =>
```

The model uses one example to infer the desired mapping.

### 26.3 Few-shot prompting

Few-shot prompting gives several demonstrations before the target query.

Example from slide:

```text
Translate English to French:
sea otter => loutre de mer
peppermint => menthe poivrée
plush giraffe => girafe peluche
cheese =>
```

The model uses multiple examples in the prompt.

### 26.4 Traditional fine-tuning

The diagram shows examples being used with **gradient updates**. In traditional fine-tuning, training examples update the model weights. In in-context learning, examples are placed in the prompt and no weights are updated.

### Key concept: in-context learning

**Intuition:** In-context learning is task adaptation through the prompt rather than through parameter updates.

**Formal definition from lecture:** No formal definition is given, but the slide illustrates zero-shot, one-shot, and few-shot prompting as alternatives to traditional fine-tuning with gradient updates.

### Exam flag

**[EXAM / REVISION FLAG]** Understand the difference between in-context learning and fine-tuning. In-context learning uses prompt examples; fine-tuning uses gradient updates.

---

## 27. Autoregressive models and self-supervised learning

### 27.1 Autoregressive models

The slide describes autoregressive models as:

- naturally generative;
- able to produce long coherent text;
- supportive of in-context learning.

### Key concept: autoregressive model

**Intuition:** An autoregressive language model predicts the next token from the previous tokens, then repeats this process to generate longer text.

**Formal definition from lecture:** The probability of a token is conditioned on previous tokens:

```math
P(x_t \mid x_{<t})
```

### 27.2 Self-supervised learning

The slide states:

- no manual labels are needed;
- the training signal comes from:
  1. the text itself;
  2. next-token prediction;
- this scales easily to massive datasets.

### Key concept: self-supervised learning

**Intuition:** The labels are created automatically from the data. In next-token prediction, the correct label is simply the actual next token in the text.

**Formal definition from lecture:** Training signal comes from the text itself and next-token prediction.

---

## 28. Why decoder-only?

The slide states that modern LLMs are predominantly decoder-only.

Examples listed:

- GPT-4o;
- Qwen3;
- DeepSeek-R1;
- Llama4.

The reasons given are:

### 28.1 Efficiency

Decoder-only models are easier to scale and train.

### 28.2 Strong pretraining

They excel in unsupervised pretraining.

### 28.3 Scalability

They handle longer contexts and complex tasks.

### Exam flag

**[EXAM / REVISION FLAG]** The learning outcomes explicitly mention explaining why modern LLMs use decoder-only architectures with causal attention.

---

## 29. What is pretraining?

### 29.1 Definition

**Definition in own words:** Pretraining is the initial large-scale training phase in which a model learns general language modelling ability from raw text before being adapted to particular downstream tasks.

**Slide definition:** Pretraining is:

- large-scale self-supervised training;
- using raw text;
- using no human labels;
- learning general language modelling capability.

The goal is:

> Learn to model the probability of text.

### Key concept: pretraining

**Intuition:** Pretraining gives the model broad language and world-knowledge correlations before any task-specific adaptation.

**Formal definition from lecture:** Large-scale self-supervised training on raw text to learn general language modelling capability.

---

## 30. Language modelling as probability estimation

### 30.1 Goal

The goal of pretraining is to learn the probability distribution over text.

Given a token sequence:

```math
x_1, x_2, \ldots, x_T
```

the model learns:

```math
P(x_1, x_2, \ldots, x_T)
```

### 30.2 Autoregressive factorisation

The slide gives the factorisation:

```math
P(x_1, \ldots, x_T) = \prod_{t=1}^{T} P(x_t \mid x_{<t})
```

where:

```math
x_{<t} = x_1, \ldots, x_{t-1}
```

### 30.3 Intuition versus formalism

**Intuition:** The model reads the text so far and predicts the next token.

**Formalism:** The probability of the whole sequence is decomposed into a product of conditional probabilities, one for each token given the previous tokens.

### [UNCLEAR]

The rendered formula on the slide appears to contain a formatting issue in the conditional term. The intended lecture meaning is clearly next-token prediction given previous tokens, written elsewhere as $P(x_t \mid x_{<t})$.

---

## 31. Autoregressive training objective

### 31.1 Objective shown on slide

The slide gives the objective:

```math
\max \sum_t \log P(x_t \mid x_{<t})
```

### 31.2 Training steps

At each step:

1. See previous tokens, i.e. generation history.
2. Predict the next token.
3. Compute cross-entropy loss.
4. Backpropagate gradients.

The model learns by minimising cross-entropy between predicted and true tokens.

### 31.3 Derivation from the factorisation

Start with the autoregressive factorisation:

```math
P(x_1, \ldots, x_T) = \prod_{t=1}^{T} P(x_t \mid x_{<t})
```

Take logarithms:

```math
\log P(x_1, \ldots, x_T)
= \log \prod_{t=1}^{T} P(x_t \mid x_{<t})
```

Use the rule that the log of a product is the sum of logs:

```math
\log P(x_1, \ldots, x_T)
= \sum_{t=1}^{T} \log P(x_t \mid x_{<t})
```

Therefore, maximising sequence likelihood corresponds to maximising:

```math
\sum_t \log P(x_t \mid x_{<t})
```

This is the slide’s autoregressive training objective.

### Key concept: maximum likelihood pretraining

**Intuition:** Train the model to assign high probability to the real next tokens in the training corpus.

**Formal definition from slide:**

```math
\max \sum_t \log P(x_t \mid x_{<t})
```

---

## 32. Worked example: next-token prediction

The practical example from the slide is:

```text
Input:  "The capital of France is [ ]"
Target: "Paris"
```

### Step-by-step

1. The context is:

```text
The capital of France is
```

2. The correct next token is:

```text
Paris
```

3. The model outputs a probability distribution over possible next tokens.
4. Cross-entropy loss penalises the model if it assigns low probability to “Paris.”
5. Across trillions of examples, the model learns statistical patterns linking contexts to likely next tokens.

---

## 33. Cross-entropy loss

### 33.1 Formula from slide

For each token:

```math
\mathcal{L} = -\sum_i y_i \log p_i
```

where:

- $y_i$ is the one-hot true token;
- $p_i$ is the predicted probability.

### 33.2 Intuition

The loss penalises assigning low probability to the correct token.

The slide’s intuition is:

> Reward correct next-token predictions.

### 33.3 Simplification for one-hot labels

If the correct token is token $k$, then:

```math
y_k = 1
```

and for all incorrect tokens:

```math
y_i = 0
```

So:

```math
\mathcal{L} = -\sum_i y_i \log p_i
```

becomes:

```math
\mathcal{L} = -\log p_k
```

### 33.4 Consequence

- If the model assigns high probability to the correct token, the loss is low.
- If the model assigns low probability to the correct token, the loss is high.

### Exam flag

**[EXAM / REVISION FLAG]** Know the cross-entropy loss formula and how it connects to next-token prediction.

---

## 34. Training versus inference

### 34.1 Training

During training:

1. Predict the next token.
2. Compare with ground truth.
3. Update weights.

### 34.2 Inference

During inference:

1. Predict the next token.
2. Sample or choose the maximum-probability token.
3. Feed the prediction back in.

### 34.3 Main contrast

| Stage | Ground truth available? | Weights updated? | Output fed back in? |
|---|---:|---:|---:|
| Training | Yes | Yes | Not in the same way as generation |
| Inference | No | No | Yes |

### Key concept: inference loop

**Intuition:** At inference time, the model’s own generated token becomes part of the context for the next prediction.

**Formal definition from lecture:** No formal definition is given.

---

## 35. Limitation of the objective

### 35.1 Slide statement

Because the pretraining objective is purely predictive, the model may:

- hallucinate plausible but false information;
- repeat biases in the data;
- generate unsafe content.

The slide states:

> Fundamentally, it optimises the likelihood of text, not correctness or other properties.

### Key concept: hallucination

**Intuition:** Hallucination is when the model generates plausible-sounding but false information.

**Formal definition from lecture:** No formal definition is given; the slide describes hallucination as plausible but false information.

### Key concept: likelihood versus truthfulness

**Intuition:** A model trained on next-token prediction learns what text is likely, not what claims are true, safe, helpful, or aligned with user goals.

**Formal statement from slide:** The objective optimises likelihood of text, not correctness or other properties.

### Exam flag

**[EXAM / REVISION FLAG]** The learning outcomes explicitly include evaluating limitations such as hallucinations and bias.

---

## 36. Training data scale and preprocessing

### 36.1 Typical scale

The pretraining slide states that typical LLM pretraining uses:

- billions to trillions of tokens;
- web text;
- books;
- code;
- Wikipedia.

### 36.2 Data preprocessing

Important preprocessing steps include:

- deduplication;
- filtering;
- quality control.

This connects directly back to the training-data lecture’s discussion of Common Crawl, C4, OpenWebText, The Pile, GPT-3 data construction, filtering bias, PII anonymisation, and contamination.

---

## 37. How large are “large” language models?

### 37.1 Two camps of models

The slide says the lecture mostly discusses two camps:

#### Medium-sized models

Examples:

- BERT / RoBERTa models with about **100M or 300M** parameters;
- T5 models with sizes such as:
  - **220M**;
  - **770M**;
  - **3B**.

#### Very large language models

The slide defines “very large” LMs as:

- models with **100+ billion parameters**.

### 37.2 Consequences of larger model size

Larger model sizes imply:

- larger compute requirements;
- more expensive inference.

### 37.3 Adaptation and usage strategies

Different sizes of LMs have different ways to adapt and use them, including:

- fine-tuning;
- zero-shot prompting;
- few-shot prompting;
- in-context learning.

### 37.4 Emergent properties and trade-offs

The slide states:

- emergent properties arise from model scale;
- there is a trade-off between model size and corpus size.

### Key concept: emergent properties

**Intuition:** Emergent properties are capabilities that appear or become much stronger as model scale increases.

**Formal definition from lecture:** No formal definition is given.

---

## 38. Compute requirements

### 38.1 Training compute

The slide states that training can involve:

- thousands of GPUs / TPUs;
- weeks to months of training;
- distributed training.

The slide conclusion is:

> Compute becomes the main constraint.

### 38.2 Training versus inference cost

Training:

- expensive;
- done a few times;
- possibly done only once.

Inference:

- cheaper per run;
- performed many times.

### Key concept: compute constraint

**Intuition:** Hardware availability, cost, and runtime limit how large a model can be and how much data it can process.

**Formal definition from lecture:** No formal definition is given.

---

## 39. Why LLMs?

The slide gives two main reasons:

1. The promise of one single model to solve many NLP tasks.
2. Emergent properties in LLMs.

The slide image includes examples from Wei et al. 2022 showing performance changes with scale for:

- math word problems;
- instruction following;
- chain-of-thought prompting;
- instruction tuning.

### Key concept: one model for many tasks

**Intuition:** Instead of training a separate model for each NLP task, an LLM can be prompted or adapted to handle many tasks.

**Formal definition from lecture:** No formal definition is given.

---

## 40. Pretraining and adaptation

### 40.1 Pretraining

The slide states that pretraining means training on huge amounts of unlabeled text using self-supervised training objectives.

### 40.2 Adaptation

The central question is:

> How do we use a pretrained model for a downstream task?

The slide says this depends on:

- what type of NLP task it is;
- input and output formats;
- how many annotated examples are available.

### 40.3 Adaptation approaches

Approaches listed:

- fine-tuning;
- prompting;
- instruction tuning.

### [UNCLEAR]

The slide title says “Pre-training and adaption.” This is likely intended to mean “adaptation.” The slide also has “inputand output,” likely a spacing error.

---

## 41. Dominant architecture of Transformer-based LLMs

### 41.1 GPT-3 architecture

The slide states that GPT-3 uses:

- decoder-only Transformer;
- causal attention;
- LayerNorm;
- residual blocks.

### 41.2 Modern LLM architecture

Modern LLMs such as:

- LLaMA;
- Mistral;
- DeepSeek;

use the same core architecture.

They may include:

- improved normalisation;
- improved efficiency;
- minor architectural refinements.

But the core remains the same.

### Key concept: architectural refinement

**Intuition:** Refinements improve efficiency, normalisation, or implementation details, but do not change the overall decoder-only causal Transformer structure.

**Formal definition from lecture:** No formal definition is given.

---

## 42. Foundation versus instruction-tuned models

### 42.1 Foundation models

The slide lists foundation model properties:

- coherent, fluent generation;
- completion and continuation;
- vast world knowledge;
- potentially harmful outputs;
- difficult to control;
- misaligned with human values.

**Definition in own words:** A foundation model is a pretrained generative model with broad language capability but not necessarily reliable instruction-following, safety, or alignment.

**Formal definition from lecture:** No formal definition is given; the slide lists properties.

### 42.2 Instruction-tuned models

The slide lists instruction-tuned model properties:

- foundation ability and more;
- controllable by prompt;
- less need to fine-tune;
- follows commands;
- slight hit to performance;
- sensitive to prompt template.

**Definition in own words:** An instruction-tuned model is a foundation model further adapted to follow natural-language instructions.

**Formal definition from lecture:** No formal definition is given.

### 42.3 Comparison table

| Foundation model | Instruction-tuned model |
|---|---|
| Fluent continuation | Better command following |
| Broad world-knowledge correlations | More controllable by prompts |
| Can produce harmful outputs | Usually safer / more aligned |
| Difficult to control | Sensitive to prompt template |
| Not guaranteed to follow instructions | Less need for task-specific fine-tuning |

---

## 43. Summary of pretraining lecture

The final pretraining slide summarises:

### Pretraining

- Large-scale self-supervised learning.
- Autoregressive next-token prediction.
- Trained on massive text corpora.

### What pretraining produces

- Fluent text.
- World knowledge correlations.
- In-context learning capability.
- Generative foundation model.

### What pretraining does not guarantee

- Instruction following.
- Helpfulness or safety.
- Truthfulness.

### Exam flag

**[EXAM / REVISION FLAG]** Do not conflate “pretrained” with “truthful,” “safe,” or “instruction-following.” The summary slide explicitly says pretraining does not guarantee these properties.

---

# Core formulas and objectives

## 44. Sequence probability

```math
P(x_1, x_2, \ldots, x_T)
```

This is the probability of a full token sequence.

## 45. Autoregressive factorisation

```math
P(x_1, \ldots, x_T) = \prod_{t=1}^{T} P(x_t \mid x_{<t})
```

Each token is predicted using only previous tokens.

## 46. Log-likelihood objective

```math
\max \sum_t \log P(x_t \mid x_{<t})
```

The model is trained to maximise the log probability of the true next tokens.

## 47. Cross-entropy loss

```math
\mathcal{L} = -\sum_i y_i \log p_i
```

where:

- $y_i$: one-hot true token;
- $p_i$: predicted probability.

For correct token $k$:

```math
\mathcal{L} = -\log p_k
```

## 48. Neural scaling law formula

```math
L = L_0 + \left(\frac{x_0}{x}\right)^\alpha
```

with:

```math
D = \frac{C}{6N}
```

**[UNCLEAR]** The slide does not define $x$, $x_0$, or $\alpha$ in detail.

---

# Worked examples collected

## 49. Next-token prediction example

Input:

```text
The capital of France is [ ]
```

Target:

```text
Paris
```

Steps:

1. Model receives previous tokens.
2. Model predicts a probability distribution over next tokens.
3. Correct target is “Paris.”
4. Cross-entropy penalises low probability assigned to “Paris.”
5. Repeating this over trillions of examples trains the model.

## 50. GPT-3 in-context learning examples

### Zero-shot

```text
Translate English to French:
cheese =>
```

No example is provided.

### One-shot

```text
Translate English to French:
sea otter => loutre de mer
cheese =>
```

One demonstration is provided.

### Few-shot

```text
Translate English to French:
sea otter => loutre de mer
peppermint => menthe poivrée
plush giraffe => girafe peluche
cheese =>
```

Several demonstrations are provided.

## 51. XSUM contamination example

Input: passage about a former Arsenal goalkeeper, Reading, West Brom, and promotion to the Premier League.

Output:

```text
West Brom have appointed Nicky Hammond as technical director, ending his 20-year association with Reading.
```

Why it matters: if both input and output are in pretraining data, benchmark performance can be inflated by memorisation.

## 52. Sentiment bias example

Identity sentiment co-occurrence:

- Jewish: 73.2% positive sentiment.
- Arab: 65.7% positive sentiment.
- Gap: 7.5%.

Outlet variation:

- New York Times: 4.5% gap.
- Al Jazeera: no difference.

## 53. Filtering bias example

Filtering rates:

- African American English: 42%.
- Hispanic-aligned English: 32%.
- White American English: 6.2%.

Interpretation: filtering rules can disproportionately remove minority dialects.

---

# Exam flags and revision priorities

## 54. Explicit spoken exam statements

**[UNCLEAR: transcript missing]** No transcript was provided, so spoken statements such as “this will be on the exam,” “common mistake,” or “you should know this” cannot be identified.

## 55. Slide-based revision flags

Treat the pretraining learning outcomes as high-value revision targets:

1. Define LLM pretraining and explain why it is self-supervised.
2. Compare encoder-only, encoder-decoder, and decoder-only Transformers.
3. Explain why modern LLMs use decoder-only architectures with causal attention.
4. Formulate:
   - autoregressive probability factorisation;
   - cross-entropy loss;
   - the difference between training and inference.
5. Evaluate:
   - hallucination;
   - bias;
   - unsafe content;
   - scale and compute;
   - the connection between pretraining, adaptation, and instruction tuning.

## 56. Likely high-value concepts

These are central across the slides:

- Data quality matters more than raw token count.
- Filtering is necessary but can create bias.
- Data contamination can invalidate benchmark conclusions.
- Decoder-only causal Transformers dominate modern LLMs.
- Pretraining is self-supervised next-token prediction.
- The objective optimises likelihood, not truthfulness.
- Foundation models are not automatically instruction-following or safe.
- Instruction tuning improves controllability but can be sensitive to prompt templates.

---

# Connections

## 57. Connection to earlier Transformer lectures

The pretraining lecture assumes prior knowledge of Transformer architecture. It compares encoder-only, encoder-decoder, and decoder-only variants before focusing on decoder-only causal Transformers.

## 58. Connection to BERT

BERT is used as a contrast case:

- BERT is encoder-only.
- BERT is bidirectional.
- BERT uses masked language modelling.
- Modern LLMs are decoder-only.
- Modern LLMs use causal attention and left-to-right generation.

## 59. Connection to training data lecture

The pretraining lecture says training data for LLMs was covered previously. The training-data lecture explains why pretraining quality depends on:

- corpus quality;
- curation;
- deduplication;
- filtering;
- contamination handling;
- bias analysis;
- documentation and inspection.

## 60. Connection to adaptation and instruction tuning

Pretraining produces a foundation model. Adaptation determines how to use it for downstream tasks through:

- fine-tuning;
- prompting;
- instruction tuning.

The foundation-versus-instruction-tuned slide connects pretraining to:

- controllability;
- safety;
- prompt sensitivity;
- command following.

## 61. Connection to evaluation

Data contamination connects training data to benchmark evaluation. If benchmark examples appear in pretraining corpora, benchmark results may reflect memorisation rather than generalisation.

## 62. Connection to safety and fairness

The slides connect data filtering and model limitations to:

- hallucination;
- bias reproduction;
- unsafe content;
- representational harms;
- filtering bias;
- demographic underrepresentation.

---

# Unclear sections to check in the recording

- **[UNCLEAR: transcript missing]** No separate lecture transcript was included, so spoken explanations, extra examples, exam hints, and verbal derivations are unavailable.
- **[UNCLEAR]** Course title was not provided.
- **[UNCLEAR]** GPT slide says “decoder transfer language models”; likely intended as “decoder Transformer language models.” Check the recording.
- **[UNCLEAR]** Data mixing scaling laws slide mentions an exponential-form law but does not show the exact equation.
- **[UNCLEAR]** Neural scaling law slide shows $L = L_0 + (x_0/x)^\alpha$, but does not define $x$, $x_0$, or $\alpha$ in detail.
- **[UNCLEAR]** Matrix composition donut chart has some labels and percentages that are not fully legible.
- **[UNCLEAR]** Bias-in-filtering chart lists affected identity groups visually, but exact bar values are not clearly legible.
- **[UNCLEAR]** Some slide text contains typos or spacing issues, e.g. “adaption” and “inputand output.”

---

# Compact revision checklist

Use this as a final pass before an exam:

- [ ] Can define pretraining as large-scale self-supervised training on raw text.
- [ ] Can explain why next-token prediction is self-supervised.
- [ ] Can write the sequence probability $P(x_1, \ldots, x_T)$.
- [ ] Can write the autoregressive factorisation.
- [ ] Can write the log-likelihood objective.
- [ ] Can write and simplify cross-entropy loss for one-hot labels.
- [ ] Can distinguish training from inference.
- [ ] Can explain why decoder-only models use causal attention.
- [ ] Can compare encoder-only, encoder-decoder, and decoder-only Transformers.
- [ ] Can explain why pretraining optimises likelihood, not truthfulness.
- [ ] Can explain foundation models versus instruction-tuned models.
- [ ] Can explain why filtering is necessary but risky.
- [ ] Can define data contamination and distinguish input-only from input-output contamination.
- [ ] Can describe Common Crawl, WebText/OpenWebText, C4, GPT-3 data, and The Pile.
- [ ] Can explain representational harms, sentiment bias, and filtering bias.
- [ ] Can describe the common data filtering pipeline.
- [ ] Can describe neural scaling law at the level shown in the slides.
- [ ] Can explain why dataset documentation and inspection matter.
