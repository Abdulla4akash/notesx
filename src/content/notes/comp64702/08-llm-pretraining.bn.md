---
subject: COMP64702
chapter: 8
title: "LLM Pretraining & Training Data"
language: bn
---

# স্টাডি নোট — LLM-এর Training Data এবং Large Language Model Pretraining

**বিষয় ও পরিসর:** এই লেকচার সেটে Large Language Model (LLM)-এর ডেটা পাইপলাইন এবং আধুনিক decoder-only Transformer LLM প্রশিক্ষণের জন্য ব্যবহৃত pretraining objective আলোচনা করা হয়েছে। Corpus construction, filtering, bias, contamination, scaling laws—এসবকে autoregressive next-token prediction, cross-entropy loss, training/inference, এবং instruction tuning-এর সঙ্গে যুক্ত করা হয়েছে।

**Course:** [UNCLEAR: কোর্সের নাম দেওয়া হয়নি; স্লাইডগুলো University of Manchester-এর NLP / LLM লেকচারের।]  
**Lecture topic:** Training Data for Large Language Models; Pretraining Large Language Models.  
**Sources used:** আপলোড করা slide decks: `4_LLM-Data.pdf` এবং `TRIM 5_LLM-pretraining-Final -3.pdf`.  
**Source limitation:** আলাদা lecture transcript text চ্যাটে দেওয়া হয়নি। নোটগুলো আপলোড করা slides এবং rendered images-এর ভিত্তিতে তৈরি। Transcript-dependent অংশগুলো **[UNCLEAR]** হিসেবে চিহ্নিত।

---

## 1. LLM pipeline-এ এই material কোথায় বসে

Pretraining lecture-টি আগের material-এর পরে এসেছে:

- Transformers
- BERT
- LLM-এর training data

এই লেকচারের বর্তমান focus: **large language models কীভাবে pretrained হয়**।

Pretraining slide deck-এর learning outcomes:

- LLM pretraining define করা এবং কেন এটি self-supervised তা ব্যাখ্যা করা;
- Transformer variants তুলনা করা: encoder-only, encoder-decoder, এবং decoder-only;
- কেন modern LLM decoder-only architecture এবং causal attention ব্যবহার করে তা ব্যাখ্যা করা;
- autoregressive probability factorisation এবং cross-entropy loss দিয়ে training objective formulate করা;
- training এবং inference-এর পার্থক্য করা;
- hallucination, bias, scale, compute, adaptation, এবং instruction tuning-এর implications evaluate করা।

Training-data lecture upstream context দেয়: LLM বড় text corpora থেকে শেখে, এবং corpus-এর quality, diversity, filtering, contamination, ও representational bias model behaviour-কে shape করে।

---

# Part I — Large Language Models-এর Training Data

---

## 2. Training data কেন গুরুত্বপূর্ণ

### 2.1 Core idea

Training data-কে LLM training-এর **“fossil fuels”** বলা হয়েছে। Data-ই model কী শেখে এবং কীভাবে behave করে তা চালিত করে।

Broad capabilities তৈরি করতে model-কে diverse এবং extensive text corpora-তে train করতে হয়। Slides-এ উদাহরণ হিসেবে দেওয়া হয়েছে:

- science;
- fiction;
- encyclopedias;
- emails;
- books;
- code;
- web text.

Broad data coverage-এর কারণ:

- language understanding;
- reasoning;
- world knowledge;
- generalisation;
- robustness.

Poorly curated data introduce করতে পারে:

- bias;
- misinformation;
- safety risks.

### 2.2 High-quality data বনাম শুধু বেশি data

Slide deck-এ একটি dataset comparison chart আছে যেখানে **aggregate score**-কে **training tokens in billions**-এর বিপরীতে plot করা হয়েছে। মূল conclusion:

> Training data-এর পরিমাণ বাড়লে high-quality datasets, low-quality datasets-এর তুলনায় উল্লেখযোগ্যভাবে ভালো performance দেয়।

আরেকটি point:

> শুধু token count বাড়ানোর চেয়ে higher-quality corpus তৈরি বা select করার effort model performance বেশি উন্নত করতে পারে।

### Key concept: data quality

**Intuition:** Data quality হলো একটি dataset training-এর জন্য কতটা useful—অর্থাৎ model-কে ভালো behave করতে শেখাতে এটি কতটা সাহায্য করে। High-quality corpus সাধারণত cleaner, more relevant, less duplicated, less noisy, more diverse, এবং harmful বা misleading artefacts কম থাকে।

**Formal definition from lecture:** কোনো mathematical definition দেওয়া হয়নি। Slides data quality-কে operationally define করেছে curation, filtering, deduplication, benchmark performance, এবং spam, boilerplate, contamination, unwanted bias এড়ানোর মাধ্যমে।

### Exam flag

**[EXAM / REVISION FLAG]** Training data কোনো neutral background detail নয়। এটি model capabilities, benchmark performance, bias, safety, এবং hallucination risk-কে affect করে। দুই slide deck জুড়েই এটি central theme।

---

## 3. LLM training-এর key datasets

Training-data lecture পাঁচটি key dataset family identify করে:

| Dataset | LLM training-এ ভূমিকা |
|---|---|
| **Common Crawl** | অনেক dataset-এর raw foundation, যেমন C4 এবং GPT-3-এর কিছু অংশ। |
| **C4 — Colossal Clean Crawled Corpus** | T5 এবং অন্যান্য model-এ ব্যবহৃত Common Crawl-এর cleaned ও filtered version। |
| **WebText / OpenWebText** | Reddit links-এর ভিত্তিতে curated web content; Common Crawl-এর তুলনায় বেশি targeted। |
| **The Pile** | Modular, high-quality open-source dataset; books, GitHub, academic papers, এবং অন্যান্য source aggregate করে। |
| **GPT-3 dataset** | Common Crawl, WebText, books, Wikipedia, code, এবং related sources থেকে তৈরি proprietary mixture। |

---

## 4. Common Crawl

### 4.1 Definition and role

**নিজের ভাষায় definition:** Common Crawl একটি খুব বড় open-access web-crawl resource। এটি raw web data দেয়, যা LLM pretraining datasets-এর foundation হিসেবে ব্যবহার করা যায়; তবে extensive cleaning এবং filtering দরকার।

**Slide details:**

- Nonprofit project.
- Open-access web crawl data প্রদান করে।
- Approximate size: **320 TB**.
- Internet-এর regular snapshots maintain করে।
- Freely available.
- Models এবং datasets-এর standard data source হিসেবে ব্যবহৃত, যেমন:
  - T5;
  - GPT-3;
  - Gopher.
- Popular কারণ:
  - scale;
  - openness;
  - ease of use.

### 4.2 Contents

Common Crawl-এ নানা ধরনের web content থাকে, যেমন:

- blogs;
- forums;
- news;
- general web pages.

### 4.3 Strengths

Common Crawl-এর প্রধান strengths:

- massive scale;
- broad coverage;
- easy accessibility.

### 4.4 Limitations

Common Crawl curated নয়। Slides-এ নিম্নের limitations দেওয়া হয়েছে:

- noisy content;
- spam;
- boilerplate;
- duplicated content;
- irrelevant content;
- quality, ethics, এবং relevance-এর জন্য significant filtering দরকার।

### Key concept: raw web crawl

**Intuition:** Raw web crawl হলো public web-এর বিশাল অংশ scrape করা—কী useful, safe, representative, বা high quality তা এখনও বাছাই করা হয়নি।

**Formal definition from lecture:** কোনো formal mathematical definition দেওয়া হয়নি। Common Crawl-কে open-access web crawl data এবং পরবর্তী curated datasets-এর raw foundation হিসেবে describe করা হয়েছে।

---

## 5. WebText এবং OpenWebText

### 5.1 Background

Earlier LLMs datasets ব্যবহার করত যেগুলো based ছিল:

- news;
- Wikipedia;
- fiction.

Common Crawl অনেক বড় হলেও noisy ছিল, যেমন spam এবং boilerplate। WebText তৈরি হয় একটি more curated alternative হিসেবে।

### 5.2 WebText

**নিজের ভাষায় definition:** WebText হলো curated web dataset, যেখানে Reddit posts থেকে URLs select করা হয়েছিল যেগুলো enough upvotes পেয়েছে। Reddit upvotes content quality-এর rough proxy হিসেবে কাজ করে।

**Slide details:**

- OpenAI তৈরি করেছে।
- URLs এসেছে Reddit posts থেকে, যেখানে অন্তত **3 upvotes** ছিল।
- High-quality এবং diverse content-এর জন্য curated।
- Fair benchmark evaluation-এর জন্য Wikipedia বাদ দেওয়া হয়েছিল।
- GPT-2 train করতে ব্যবহৃত।
- Approximate size: **40 GB**.

### 5.3 OpenWebText

**নিজের ভাষায় definition:** OpenWebText হলো WebText recreate করার community-built attempt, কারণ original WebText dataset publicly release করা হয়নি।

**Slide details:**

- WebText-এর community-built replica.
- Reddit submissions থেকে URLs ব্যবহার করে।
- English-only content-এর জন্য Facebook’s FastText দিয়ে filtered।
- Deduplicated.
- Approximate size: **38 GB**.

### 5.4 Reddit bias

Slide-এর key insight:

> Curation quality improve করে, কিন্তু Reddit user bias inherit করে।

Slides এই bias-কে describe করেছে:

- young;
- male;
- Western.

### Key concept: curation bias

**Intuition:** “Good” data select করার method নিজেই bias introduce করতে পারে। যদি Reddit upvotes ঠিক করে dataset-এ কী ঢুকবে, তাহলে resulting model internet-কে Reddit users-এর preferences ও demographics-এর lens দিয়ে দেখে।

**Formal definition from lecture:** কোনো formal definition দেওয়া হয়নি।

---

## 6. C4 — Colossal Clean Crawled Corpus

### 6.1 Definition

**নিজের ভাষায় definition:** C4 হলো Common Crawl-এর cleaned, English-only subset, যা low-quality, noisy, বা unwanted web text remove করে training data quality improve করার জন্য design করা হয়েছে।

**Slide details:**

- Full name: **Colossal Clean Crawled Corpus**.
- **April 2019 Common Crawl**-এর filtered version.
- Original crawl-এর প্রায় **10%** রাখে।
- Size: approximately **156B tokens**.
- Approximate storage size: **806 GB** English-only text.
- **T5**-এর মতো models train করতে ব্যবহৃত।

### 6.2 Filtering criteria

C4 filtering remove করেছে:

- profanity;
- code;
- boilerplate;
- very short documents.

Language filtering-এ ব্যবহৃত:

- `langdetect`.

Slide explicitly সতর্ক করেছে:

> Filter decisions affect which voices and topics remain.

বাংলায়: filtering decision নির্ধারণ করে কোন voices এবং topics dataset-এ থেকে যাবে।

### 6.3 C4 বনাম raw Common Crawl

| Feature | Common Crawl | C4 |
|---|---|---|
| Size | ~320 TB | ~806 GB |
| Curation | Minimal | Heavily filtered |
| Language | Multilingual | English-only |
| Quality | Noisy, redundant | Cleaner, more structured |

Slide summary অনুযায়ী C4 হলো Common Crawl-এর cleaner, smaller, English-only subset, যা model training-এর data quality improve করার জন্য তৈরি, কিন্তু **reduced diversity-এর বিনিময়ে**।

### Key concept: filtering trade-off

**Intuition:** Filtering spam এবং noise remove করে quality improve করতে পারে, কিন্তু legitimate text, minority dialects, বা underrepresented topics-ও remove করতে পারে।

**Formal definition from lecture:** কোনো formal mathematical definition দেওয়া হয়নি।

### Exam flag

**[EXAM / REVISION FLAG]** C4 quality এবং diversity-এর tension-এর key example। জানতে হবে: এটি filtered English-only Common Crawl subset, এবং filtering কীভাবে representational harms introduce করতে পারে।

---

## 7. GPT-3 dataset

### 7.1 Definition and construction

**নিজের ভাষায় definition:** GPT-3 dataset হলো filtered Common Crawl এবং curated sources—যেমন WebText2, Books1, Books2, Wikipedia—এর proprietary mixture।

**Slide details:**

- **2016–2019 Common Crawl snapshots** থেকে তৈরি।
- একটি binary classifier train করা হয়েছিল distinguish করার জন্য:
  - WebText-like content;
  - ordinary Common Crawl content.
- Classifier higher-quality curated web content retain করতে সাহায্য করেছে।

### 7.2 Content selection and cleanup

Slide তিনটি cleanup step list করেছে:

1. **Fuzzy matching** using **13-gram overlap**.
2. Content remove করা যদি সেটি **10 documents**-এর কম জায়গায় দেখা যায়।
3. Data leakage avoid করতে common benchmark datasets থেকে test data exclude করা।

### 7.3 Expanded data sources

GPT-3 dataset অন্তর্ভুক্ত করেছে:

- Common Crawl, filtered;
- WebText2;
- Books1;
- Books2;
- Wikipedia.

### 7.4 GPT-3 dataset mixture table

| Dataset | Quantity / tokens | Weight in training mix | 300B tokens train করার সময় epochs elapsed |
|---|---:|---:|---:|
| Common Crawl, filtered | 410B | 60% | 0.44 |
| WebText2 | 19B | 22% | 2.9 |
| Books1 | 12B | 8% | 1.9 |
| Books2 | 55B | 8% | 0.43 |
| Wikipedia | 3B | 3% | 3.4 |

Table note অনুযায়ী **weight in training mix** হলো training চলাকালে কোনো dataset থেকে drawn examples-এর fraction। Weights intentionally dataset size-এর proportional নয়।

### 7.5 Mixture-এর important implication

Training চলাকালে কিছু source multiple times দেখা হয়, আবার কিছু source একবারেরও কম দেখা হয়।

Examples:

- Wikipedia মাত্র 3B tokens, কিন্তু weight 3%, তাই এটি প্রায় **3.4 epochs** দেখা হয়।
- Filtered Common Crawl 410B tokens এবং weight 60%, তাই 300B tokens train করলে এটি প্রায় **0.44 epochs** দেখা হয়।

### Key concept: training mix weight

**Intuition:** Training mix weight control করে training-এ কোন dataset কত ঘন ঘন examples contribute করবে। এটি raw dataset size-এর সমান নয়।

**Formal definition from slide:** “Weight in training mix” refers to the fraction of examples drawn from a given dataset during training.

---

## 8. The Pile

### 8.1 Definition

**নিজের ভাষায় definition:** The Pile একটি large, open-source, diverse English dataset, যা open LLM train করা এবং standard web-crawl datasets-এ কম represented domains-এর coverage improve করার জন্য design করা।

**Slide details:**

- **EleutherAI** developed করেছে।
- EleutherAI-কে open-source AI research group হিসেবে describe করা হয়েছে।
- Goal:
  1. open LLM train করার জন্য high-quality, diverse dataset build করা;
  2. underrepresented domains-এর representation improve করা।
- Content: **825 GB** English text from **22 sources**.
- Used in:
  - GPT-Neo;
  - GPT-J;
  - Pythia;
  - other open models.

### 8.2 Domains included

The Pile অন্তর্ভুক্ত করে:

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

Slide-এ size/weight অনুযায়ী major contributors:

- Pile-CC: **18%**;
- PubMed Central;
- Books3;
- ArXiv;
- GitHub.

### 8.4 Slide-এর full component table

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

### 8.5 The Pile paper-এর key takeaways

Slide-এর findings:

- Academic এবং professional text-এর মতো ছোট কিন্তু high-quality sources, large-scale web-crawled data-এর তুলনায় LLM training-এ ভালো perform করতে পারে।
- Pejorative, gender, এবং religion categories-এ bias analysis previous studies-এর সঙ্গে consistent patterns দেখায়; অর্থাৎ similar ethical challenges রয়ে যায়।
- The Pile-এ এমন অনেক information আছে যা GPT-3 dataset-এ well covered নয়।
- Most effective components:
  - DM Mathematics;
  - Enron Emails;
  - PubMed Central.
- Less effective or redundant components:
  - YouTubeSubtitles;
  - Gutenberg / PG-19;
  - OpenWebText2.
- কিছু components negative impact দেখায়।

### Key concept: high-quality domain data

**Intuition:** High-quality domain data হলো dense, informative, specialised text—যেমন academic papers, biomedical articles, legal material, technical documents, বা professional emails।

**Formal definition from lecture:** কোনো formal definition দেওয়া হয়নি।

---

## 9. Data representation-এ biases

### 9.1 Training data demographically neutral নয়

Slides বলছে:

> Training data is not demographically neutral — it reflects the biases of those who produce content online.

বাংলায়: training data demographically neutral নয়; যারা online content produce করে, তাদের bias data-তে reflect হয়।

Examples:

- internet data developed countries-এর young users-কে overrepresent করে;
- GPT-2-এর data Reddit-based;
- U.S. Reddit users-এর 67% men;
- U.S. Reddit users-এর 64% বয়স 18–29;
- Wikipedians-এর মাত্র approximately 9–15% female.

Slide প্রশ্ন করেছে:

> What about the elderly?

এটি highlight করে যে older people online corpora-তে underrepresented হতে পারে।

### Key concept: representation bias

**Intuition:** Representation bias ঘটে যখন dataset কিছু groups, countries, languages, বা writing styles-কে overrepresent করে এবং অন্যদের underrepresent করে।

**Formal definition from lecture:** কোনো formal definition নেই। Slides এটিকে online content কারা produce করে সেই ধারণার মাধ্যমে define করেছে।

### 9.2 Whose voices are missing?

Slides emphasise করে যে online environments marginalised groups-কে contribution থেকে discourage করতে পারে।

Examples:

- online harassment queer এবং trans people-কে contribute করা থেকে discourage করতে পারে;
- filtering noise remove করে, কিন্তু meaningful content-ও remove করে;
- filtered LGBTQ+ mentions-এর **22–36%** benign ছিল;
- African-American English **42%** সময় filtered হয়েছে, Standard English-এর জন্য **6.2%**।

Slide summary:

> Cleaning steps can systematically silence marginalized communities.

### Key concept: filtering bias

**Intuition:** Filtering bias হয় যখন data-cleaning rules কিছু groups, dialects, identities, বা communities-এর content অন্যদের তুলনায় বেশি remove করে।

**Formal definition from lecture:** কোনো formal definition দেওয়া হয়নি।

---

## 10. Matrix dataset

### 10.1 Definition

**নিজের ভাষায় definition:** Matrix হলো transparent bilingual English–Chinese pretraining corpus, যা web data, code, academic/professional text, এবং underrepresented domains cover করার জন্য design করা।

**Slide details:**

- **MAP**, Multimodal Art Projection, developed করেছে।
- MAP-কে MAP-Neo-এর পেছনের open-source AI research group বলা হয়েছে।
- Goal:
  1. transparent bilingual English + Chinese pretraining corpus assemble করা;
  2. underrepresented domains-এর coverage boost করা।

### 10.2 Content

Matrix contains:

- cleaned text-এর **4.5 trillion tokens**;
- **22 heterogeneous sources** থেকে data।

Categories:

- web crawl: Common Crawl, **52.6%**;
- programming code: GitHub, StackExchange, etc., **22.3%**;
- academic and professional text:
  - arXiv;
  - PubMed;
  - legal documents;
  - textbooks;
- other printed / structured text:
  - books-এর OCR’d PDFs;
  - government reports;
  - exams.

### 10.3 Matrix composition chart

Slide-এ language এবং source composition দেখানো donut charts আছে। কিছু labels visible, কিন্তু rendered image-এ সব chart percentages legible নয়।

**[UNCLEAR]** Donut charts-এর precise percentages দরকার হলে recording বা original slide check করা উচিত। ওপরের bullet values slide text থেকে reliable।

---

## 11. FineWeb-Edu dataset

### 11.1 Definition

**নিজের ভাষায় definition:** FineWeb-Edu হলো FineWeb sources থেকে filtered education-focused corpus, যা high-quality educational content দিয়ে reasoning এবং knowledge performance improve করার জন্য design করা।

**Slide details:**

- **Hugging Face** developed করেছে।
- Hugging Face-কে open-source AI research collaboration বলা হয়েছে।
- Goal:
  1. open LLM pretraining-এর জন্য high-quality education-focused corpus assemble করা;
  2. minimal data দিয়ে reasoning এবং knowledge tasks-এ model performance enhance করা।

### 11.2 Content

FineWeb-Edu contains:

- **1.3 trillion tokens**;
- grade-school এবং middle-school-level web pages;
- FineWeb heterogeneous sources থেকে filtered data।

Quality এবং diversity balance করে combine করা হয়েছে:

- curated educational sites;
- K–12 lesson plans;
- school portals;
- textbook excerpts;
- encyclopedic articles;
- informal explanations-এর জন্য vetted forum Q&A.

---

## 12. C4 dataset analysis

### 12.1 Dodge et al. কী analyse করেছেন

Slides বলছে Dodge et al. C4 dataset-এর extensive analysis করেছেন, যা T5 pretraining-এ ব্যবহৃত হয়েছিল।

তারা evaluate করেছেন:

- document-level quality;
- content characteristics;
- source domain;
- document structure;
- utterance style;
- content human-authored নাকি machine-authored;
- social biases;
- evaluation data-র সঙ্গে contamination;
- excluded content, including:
  - medical / health data;
  - explicit demographic information;
  - personally identifiable information.

Slide note অনুযায়ী Raffel et al. 2020 শুধু C4 recreate করার scripts দিয়েছিল, এবং সেই scripts run করতেই হাজার হাজার dollars cost হয়েছে।

### 12.2 Source distribution and quality concerns

Slides নিম্নের issues flag করেছে:

- আশ্চর্যজনক পরিমাণ data এসেছে `patents.google.com` থেকে।
- 65% pages Internet Archive-এ ছিল।
- Archived pages-এর মধ্যে 92% গত 10 বছরে written।
- 51.3% pages United States-এ hosted ছিল।
- India থেকে pages কম, যদিও India-তে অনেক English speakers আছে।
- কিছু `patents.google.com` texts auto-generated এবং systematic errors-যুক্ত।

Patent-related quality concerns:

- foreign languages, যেমন Japanese, এ originally filed documents machine-translated into English;
- OCR দিয়ে text extracted, ফলে transcription issues হয়েছে।

### 12.3 Token distribution by domain

C4 token-distribution slide দেখায়:

- top-level domains;
- most frequent websites;
- token frequency measured in log scale.

Slide conclude করে:

- US-based commercial domains-এর heavy dominance আছে;
- high-frequency automated sites আছে।

**[UNCLEAR]** Exact bar values slide text-এ দেওয়া নেই এবং rendered chart থেকে পড়া কঠিন। Original lecture recording precise values দিলে তা use করা উচিত; otherwise qualitative conclusions ব্যবহার করুন।

---

## 13. Data contamination

### 13.1 Formal definition

**Formal definition from slide:** Data contamination ঘটে যখন benchmark test data pretraining corpora-তে partially বা entirely উপস্থিত থাকে।

### 13.2 নিজের ভাষায় definition

Data contamination মানে model pretraining-এর সময় evaluation example-এর কিছু বা সব already দেখে ফেলতে পারে। এতে benchmark performance বাস্তবের চেয়ে ভালো দেখাতে পারে, কারণ model generalise করার বদলে examples memorise করতে পারে।

### 13.3 Contamination কেন গুরুত্বপূর্ণ

Slide বলছে contamination lead করে:

- inflated benchmark performance;
- model generalisation সম্পর্কে misleading conclusions.

### 13.4 Examples

Slides দুইটি example দেয়:

- **XSUM summarisation:** approximately **15.5% overlap**, input + output.
- **QNLI, Wikipedia-based:** up to **53.6% overlap**, input only.

### 13.5 Types of data contamination

#### Input-and-output contamination

Training data-তে input এবং expected output দুটোই থাকে।

Slide values:

- range: **1.87%–24.88%**;
- XSUM example: **15.49%**.

এটি বেশি harmful type, কারণ model পুরো input-output pair memorise করতে পারে, benchmark scores severely inflate করে।

#### Input-only contamination

Training data-তে শুধু input থাকে।

Slide value:

- up to **53.6%**, e.g. QNLI based on Wikipedia.

এটি এখনও problematic, কিন্তু generally full input-output overlap-এর চেয়ে কম severe।

### 13.6 Worked example: XSUM contamination

Slide XSUM summarisation example দেয়।

**Input:**

> The 48-year-old former Arsenal goalkeeper played for the Royals for four years. He was appointed youth academy director in 2000 and has been director of football since 2003. A West Brom statement said: “He played a key role in the Championship club twice winning promotion to the Premier League in 2006 and 2012.”

**Output:**

> West Brom have appointed Nicky Hammond as technical director, ending his 20-year association with Reading.

**কেন এটি contamination:** যদি article input এবং expected summary দুটোই pretraining data-তে থাকে, model summarisation ability demonstrate করার বদলে specific mapping শিখে ফেলতে পারে।

### Exam flag

**[EXAM / REVISION FLAG]** Input-only contamination এবং input-and-output contamination-এর distinction জানতে হবে। Input-and-output contamination বেশি harmful কারণ এটি complete benchmark example memorisation allow করে।

---

## 14. Representational harms

### 14.1 Sentiment bias

Slides identity terms এবং sentiment-bearing words-এর co-occurrence analyse করে sentiment bias discuss করেছে।

Identity terms:

- Jewish;
- Arab.

Sentiment-bearing words:

- successful;
- dangerous.

Example findings:

- Jewish: **73.2% positive sentiment**.
- Arab: **65.7% positive sentiment**.
- Difference: **7.5%**.

News outlet variation:

- New York Times: **4.5% gap**.
- Al Jazeera: **no difference**.

Slide বলছে:

> Even subtle sentiment biases can skew the representation of identities in model training data.

### Key concept: sentiment bias

**Intuition:** Sentiment bias ঘটে যখন কিছু identity অন্যদের তুলনায় বেশি positive বা negative words দ্বারা surrounded থাকে; model তখন skewed associations শিখে।

**Formal definition from lecture:** কোনো mathematical definition দেওয়া হয়নি। Slide analysis method হিসেবে identity terms এবং sentiment-bearing words-এর co-occurrence define করেছে।

### 14.2 Filtering bias

Slide dialect-based filtering rates দেয়:

- African American English: **42% filtered**.
- Hispanic-aligned English: **32% filtered**.
- White American English: **6.2% filtered**.

Slide বলছে:

> Filtering heuristics can reinforce systemic erasure of minority voices, even when content is benign.

### 14.3 Filtering-এ affected groups

**“Bias in Filtering: Which Groups Are Affected Most?”** slide-এ identity terms এবং filtered-by-blocklist data-এর PMI chart দেখানো হয়েছে।

Chart-এ visible groups:

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

**[UNCLEAR]** Rendered image-এ chart values স্পষ্টভাবে legible নয়। Key qualitative point: filtering identity-related content unevenly affect করে এবং benign minority-community content remove করতে পারে।

---

## 15. Common data filtering pipeline

Slide-এ pipeline দেখানো হয়েছে:

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

Diagram visually দুই row-তে arranged, কিন্তু logical pipeline উপরের sequence।

---

## 16. Base filter

### 16.1 Goal

Goal হলো raw web text-এ initial quality screening করা, obviously low-quality content এবং non-English text remove করা, যাতে later processing-এর জন্য clean foundation dataset তৈরি হয়।

### 16.2 Steps

#### Language identification

- FastText classifier ব্যবহার করা।
- Non-English content filter করা।
- English probability অন্তত নিচের threshold হলে text retain করা:

```math
0.65
```

#### URL blacklist

Remove:

- adult content;
- spam websites;
- other inappropriate sources.

#### Quality filtering

MassiveText rules apply করে remove করা:

- overly short text;
- repetitive content;
- malformed documents.

#### Basic cleaning

Remove:

- obvious template text;
- navigation menus;
- advertising content.

### Key concept: base filtering

**Intuition:** Base filtering হলো first pass, যা more specialised cleaning steps-এর আগে obviously unsuitable web text remove করে।

**Formal definition from lecture:** 0.65 English probability threshold ছাড়া কোনো mathematical definition দেওয়া হয়নি।

---

## 17. Deduplication

### 17.1 Goal

Goal হলো dataset থেকে duplicate content eliminate করা যাতে:

- repeated text-এর over-memorisation prevent হয়;
- data diversity improve হয়;
- training efficiency improve হয়।

### 17.2 Slide-এর algorithmic details

Slide specify করেছে:

- **MinHash** ব্যবহার করা;
- **5-grams** ব্যবহার করা;
- **112 hash functions** ব্যবহার করা;
- **75% similarity threshold** ব্যবহার করা;
- প্রতিটি Common Crawl snapshot independently deduplicate করা;
- similar document groups-এ only one copy রাখতে transitive clustering ব্যবহার করা।

### 17.3 Procedure

1. 5-gram features দিয়ে documents represent করা।
2. Document similarity estimate করতে 112 hash functions সহ MinHash apply করা।
3. 75% similarity threshold দিয়ে near-duplicate documents identify করা।
4. Over-removal avoid করতে প্রতিটি Common Crawl snapshot independently process করা।
5. Similar documents transitively cluster করা।
6. প্রতিটি similar-document group-এ শুধু এক copy রাখা।

### Key concept: fuzzy deduplication

**Intuition:** Fuzzy deduplication শুধু exact duplicates নয়, near-duplicates-ও remove করে।

**Formal operational definition from slide:** 5-grams-এর ওপর MinHash, 112 hash functions, এবং 75% similarity threshold।

---

## 18. Heuristic rules

### 18.1 Goal

Goal হলো data analysis-ভিত্তিক precise heuristic rules develop করা, যাতে formatting anomalies এবং poor content quality-যুক্ত documents filter করে text quality improve করা যায়।

### 18.2 Slide-এর rules

#### Punctuation ratio

Filter documents with:

```math
< 12\%
```

lines ending in punctuation.

Purpose: content completeness ensure করা।

#### Duplicate line control

Remove documents with:

```math
> 10\%
```

duplicate line character ratio.

Purpose: templated content reduce করা।

#### Short line filtering

Filter documents with:

```math
> 67\%
```

short lines, যেখানে short lines হলো 30 characters-এর কম।

Purpose: substantial content ensure করা।

#### Data-driven thresholds

High-quality বনাম low-quality data-এর comparative analysis দিয়ে threshold parameters choose করা হয়।

### Key concept: heuristic filtering

**Intuition:** Heuristic filtering simple measurable rules ব্যবহার করে malformed, repetitive, incomplete, বা low-value documents remove করে।

**Formal definition from lecture:** একক formal definition নেই। Formal content হলো ওপরের thresholds।

---

## 19. PII anonymization

### 19.1 Goal

Goal হলো personally identifiable information remove বা anonymise করে personal privacy protect করা, যাতে dataset privacy protection requirements এবং legal regulations মেনে চলে।

### 19.2 Slide-এর methods

#### Email addresses

- Email addresses identify করতে regex patterns ব্যবহার করা।
- সব email addresses anonymise করা।

#### IP addresses

- Public IP addresses detect করা।
- Public IP address information mask করা।

#### Pattern matching

- Rule-based personal information identification ব্যবহার করা।
- Identified personal information replace করা।

#### Privacy compliance

- Dataset release data protection regulatory requirements meet করে তা ensure করা।

### Key concept: PII

**Intuition:** Personally identifiable information হলো এমন information যা কোনো specific person identify করতে পারে, যেমন email address বা IP address।

**Formal definition from lecture:** কোনো formal definition দেওয়া হয়নি।

---

## 20. Neural scaling law

### 20.1 Motivation

Slide বলছে model sizes millions থেকে billions parameters-এ explode করেছে, ফলে বেড়েছে:

- training costs;
- training runtimes.

Field-এ quantitative guidance ছিল না যে কখন invest করা উচিত:

- larger models;
- more data;
- more compute.

### 20.2 Key finding

Test loss $L$ power-law relationships follow করে:

- parameters $N$;
- data $D$;
- compute $C$.

### 20.3 Slide-এর formula

Slide বলছে, প্রতিটি modality-তে $C$ বা $N$-এর একটি fix করে, অন্যটি vary করে, এবং $D$ নিচেরভাবে vary করলে:

```math
D = \frac{C}{6N}
```

achievable test loss satisfy করে:

```math
L = L_0 + \left(\frac{x_0}{x}\right)^\alpha
```

### 20.4 Intuition

Relevant resource $x$ বাড়লে loss power law অনুসারে কমে এবং floor $L_0$-এর দিকে যায়।

### [UNCLEAR]

Slide সব symbol detail-এ define করেনি। এটি explicitly $L$, $N$, $D$, এবং $C$ mention করে, কিন্তু $x$, $x_0$, এবং $\alpha$-এর exact definitions visible slide text-এ নেই।

---

## 21. Data mixing scaling laws

### 21.1 Key idea

Slide domain-specific loss $L$-কে data proportions $t$-এর function হিসেবে predict করার জন্য একটি exponential-form law introduce করে।

### 21.2 Procedure

Slide process describe করে:

1. Representative data domains select করা।
2. Mixing ratios-এর set design করা।
3. Small proxy models train করা।
4. প্রতি domain-এ performance record করা।

Plots reducible loss দেখায়:

- GitHub;
- Pile-CC.

এগুলো training mix-এ সেই domain-এর proportion-এর বিপরীতে plotted।

### Key concept: data mixing

**Intuition:** Data mixing হলো প্রতিটি source বা domain থেকে কত training data draw করা হবে তা choose করা।

**Formal definition from lecture:** Domain-specific loss $L$, data proportions $t$-এর function হিসেবে modelled হয়, exponential-form law ব্যবহার করে।

### [UNCLEAR]

Exact exponential-form equation visible slide text-এ printed নয়।

---

## 22. Training-data lecture-এর summary

Final slide বলছে:

- Available data-এর total amount—web এবং private data সহ—massive.
- “All of it,” এমনকি পুরো Common Crawl-এ training ভালো কাজ করে না।
- সব available raw data-তে training compute-এর effective use নয়।
- Filtering এবং curation দরকার; examples: OpenWebText, C4, GPT-3 dataset construction.
- Filtering এবং curation bias তৈরি করতে পারে।
- High-quality non-web datasets curate করা promising; example: The Pile.
- Datasets carefully document এবং inspect করা গুরুত্বপূর্ণ।

---

# Part II — Large Language Models-এর Pretraining

---

## 23. Transformer architecture variants

Pretraining lecture তিন ধরনের Transformer variant compare করে।

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
- “every other new model today,” slide-এ যেমন লেখা।

### Key concept: Transformer variant

**Intuition:** Transformer variants original encoder-decoder architecture-এর আলাদা parts expose করে। Encoder-only models understanding tasks-এ strong; encoder-decoder models sequence-to-sequence transformation-এ strong; decoder-only models left-to-right generation-এ strong।

**Formal definition from lecture:** কোনো mathematical definition নেই; slide architecture এবং task use অনুযায়ী models classify করেছে।

### Exam flag

**[EXAM / REVISION FLAG]** Pretraining learning outcomes explicitly encoder-only, encoder-decoder, এবং decoder-only Transformer variants compare করতে বলেছে।

---

## 24. Decoder-only architecture

### 24.1 Modern LLMs

Slide বলছে modern LLMs use করে:

- Transformer decoder blocks;
- causal attention;
- future tokens-এ access নেই;
- left-to-right generation.

### 24.2 BERT-এর সঙ্গে contrast

BERT contrasted as:

- bidirectional;
- masked language modelling ব্যবহার করে।

### Key concept: causal attention

**Intuition:** Causal attention একটি token-কে future tokens attend করতে দেয় না। Next token predict করার সময় model শুধু past context ব্যবহার করতে পারে।

**Formal definition from slide:** Causal attention means **no access to future tokens**.

### Key concept: left-to-right generation

**Intuition:** Model একবারে একটি token generate করে; প্রতিটি new token context-এ append হয়, তারপর next token generate হয়।

**Formal definition from lecture:** Later section-এর autoregressive factorisation ছাড়া আলাদা mathematical definition দেওয়া হয়নি।

---

## 25. GPT series

### 25.1 GPT definition

GPT stands for:

> **Generative Pretrained Transformer**

Slide GPT models-কে OpenAI-এর models series হিসেবে describe করেছে, যা generative tasks-এ ব্যবহৃত।

### [UNCLEAR]

Slide text-এ আছে: “These are decoder transfer language models.” সম্ভবত intended “decoder Transformer language models,” কিন্তু slide নিজে “transfer” লিখেছে। distinction matter করলে recording বা original slide check করুন।

### 25.2 GPT-2

Slide details:

- Radford et al., 2019.
- Decoder-only.
- GPT-এর তুলনায় বেশি data-তে pretrained.
- Data: WebText from Reddit.
- Size: **40 GB**.
- Generation tasks-এ good.

### 25.3 GPT-3

Slide details:

- Brown et al., 2020.
- Decoder-only.
- even more data-তে pretrained.
- Slide-এ stated data scale: **45 TB**.

GPT-3 slide আগের described dataset mixture table-ও include করে:

| Dataset | Quantity / tokens | Weight in training mix | 300B tokens train করার সময় epochs elapsed |
|---|---:|---:|---:|
| Common Crawl, filtered | 410B | 60% | 0.44 |
| WebText2 | 19B | 22% | 2.9 |
| Books1 | 12B | 8% | 1.9 |
| Books2 | 55B | 8% | 0.43 |
| Wikipedia | 3B | 3% | 3.4 |

---

## 26. GPT-3 in-context learning

Slide GPT-3 “in-context” learning-কে traditional fine-tuning-এর সঙ্গে contrast করেছে।

### 26.1 Zero-shot prompting

Zero-shot prompting task description দেয় কিন্তু examples দেয় না।

Slide example:

```text
Translate English to French:
cheese =>
```

Model instruction alone থেকে task infer করতে হবে।

### 26.2 One-shot prompting

One-shot prompting target query-এর আগে একটি demonstration দেয়।

Slide example:

```text
Translate English to French:
sea otter => loutre de mer
cheese =>
```

Model একটি example থেকে desired mapping infer করে।

### 26.3 Few-shot prompting

Few-shot prompting target query-এর আগে several demonstrations দেয়।

Slide example:

```text
Translate English to French:
sea otter => loutre de mer
peppermint => menthe poivrée
plush giraffe => girafe peluche
cheese =>
```

Model prompt-এর multiple examples ব্যবহার করে।

### 26.4 Traditional fine-tuning

Diagram দেখায় examples **gradient updates**-এর সঙ্গে ব্যবহৃত হচ্ছে। Traditional fine-tuning-এ training examples model weights update করে। In-context learning-এ examples prompt-এ বসানো হয় এবং weights update হয় না।

### Key concept: in-context learning

**Intuition:** In-context learning হলো parameter updates-এর বদলে prompt-এর মাধ্যমে task adaptation।

**Formal definition from lecture:** কোনো formal definition নেই, তবে slide zero-shot, one-shot, few-shot prompting-কে traditional fine-tuning with gradient updates-এর alternative হিসেবে illustrate করেছে।

### Exam flag

**[EXAM / REVISION FLAG]** In-context learning এবং fine-tuning-এর পার্থক্য বুঝুন। In-context learning prompt examples ব্যবহার করে; fine-tuning gradient updates ব্যবহার করে।

---

## 27. Autoregressive models and self-supervised learning

### 27.1 Autoregressive models

Slide autoregressive models-কে describe করেছে:

- naturally generative;
- long coherent text produce করতে পারে;
- in-context learning support করে।

### Key concept: autoregressive model

**Intuition:** Autoregressive language model previous tokens থেকে next token predict করে, তারপর এই process repeat করে longer text generate করে।

**Formal definition from lecture:** একটি token-এর probability previous tokens-এর ওপর conditioned:

```math
P(x_t \mid x_{<t})
```

### 27.2 Self-supervised learning

Slide বলছে:

- manual labels দরকার নেই;
- training signal আসে:
  1. text itself থেকে;
  2. next-token prediction থেকে;
- এটি massive datasets-এ easily scale করে।

### Key concept: self-supervised learning

**Intuition:** Labels data থেকেই automatically তৈরি হয়। Next-token prediction-এ correct label হলো text-এর actual next token।

**Formal definition from lecture:** Training signal text itself এবং next-token prediction থেকে আসে।

---

## 28. Why decoder-only?

Slide বলছে modern LLMs predominantly decoder-only.

Listed examples:

- GPT-4o;
- Qwen3;
- DeepSeek-R1;
- Llama4.

Reasons:

### 28.1 Efficiency

Decoder-only models scale এবং train করা সহজ।

### 28.2 Strong pretraining

এগুলো unsupervised pretraining-এ excel করে।

### 28.3 Scalability

Longer contexts এবং complex tasks handle করে।

### Exam flag

**[EXAM / REVISION FLAG]** Learning outcomes explicitly modern LLMs কেন decoder-only architectures with causal attention ব্যবহার করে তা explain করতে বলে।

---

## 29. What is pretraining?

### 29.1 Definition

**নিজের ভাষায় definition:** Pretraining হলো initial large-scale training phase, যেখানে model raw text থেকে general language modelling ability শেখে, তারপর specific downstream tasks-এর জন্য adapted হয়।

**Slide definition:** Pretraining is:

- large-scale self-supervised training;
- raw text ব্যবহার করে;
- human labels ব্যবহার করে না;
- general language modelling capability শেখে।

Goal:

> Learn to model the probability of text.

### Key concept: pretraining

**Intuition:** Pretraining model-কে broad language এবং world-knowledge correlations দেয়, কোনো task-specific adaptation-এর আগে।

**Formal definition from lecture:** Raw text-এ large-scale self-supervised training, general language modelling capability শেখার জন্য।

---

## 30. Language modelling as probability estimation

### 30.1 Goal

Pretraining-এর goal হলো text-এর probability distribution শেখা।

Token sequence given:

```math
x_1, x_2, \ldots, x_T
```

model learns:

```math
P(x_1, x_2, \ldots, x_T)
```

### 30.2 Autoregressive factorisation

Slide-এর factorisation:

```math
P(x_1, \ldots, x_T) = \prod_{t=1}^{T} P(x_t \mid x_{<t})
```

where:

```math
x_{<t} = x_1, \ldots, x_{t-1}
```

### 30.3 Intuition versus formalism

**Intuition:** Model text so far পড়ে এবং next token predict করে।

**Formalism:** পুরো sequence-এর probability conditional probabilities-এর product-এ decompose হয়; প্রতিটি token previous tokens given predict করা হয়।

### [UNCLEAR]

Rendered slide formula-তে conditional term-এ formatting issue দেখা যায়। Intended lecture meaning স্পষ্ট: previous tokens given next-token prediction, অন্যত্র $P(x_t \mid x_{<t})$ হিসেবে লেখা।

---

## 31. Autoregressive training objective

### 31.1 Slide-এর objective

Slide objective দেয়:

```math
\max \sum_t \log P(x_t \mid x_{<t})
```

### 31.2 Training steps

প্রতিটি step-এ:

1. Previous tokens দেখা, অর্থাৎ generation history।
2. Next token predict করা।
3. Cross-entropy loss compute করা।
4. Gradients backpropagate করা।

Model predicted এবং true tokens-এর cross-entropy minimise করে শেখে।

### 31.3 Factorisation থেকে derivation

Autoregressive factorisation দিয়ে শুরু:

```math
P(x_1, \ldots, x_T) = \prod_{t=1}^{T} P(x_t \mid x_{<t})
```

Logarithms নেওয়া:

```math
\log P(x_1, \ldots, x_T)
= \log \prod_{t=1}^{T} P(x_t \mid x_{<t})
```

Rule ব্যবহার করা: product-এর log = logs-এর sum:

```math
\log P(x_1, \ldots, x_T)
= \sum_{t=1}^{T} \log P(x_t \mid x_{<t})
```

Therefore, sequence likelihood maximise করা correspond করে maximise করা:

```math
\sum_t \log P(x_t \mid x_{<t})
```

এটাই slide-এর autoregressive training objective।

### Key concept: maximum likelihood pretraining

**Intuition:** Training corpus-এর real next tokens-এ high probability assign করতে model train করা।

**Formal definition from slide:**

```math
\max \sum_t \log P(x_t \mid x_{<t})
```

---

## 32. Worked example: next-token prediction

Slide-এর practical example:

```text
Input:  "The capital of France is [ ]"
Target: "Paris"
```

### Step-by-step

1. Context হলো:

```text
The capital of France is
```

2. Correct next token:

```text
Paris
```

3. Model possible next tokens-এর ওপর probability distribution output করে।
4. Model “Paris”-এ low probability assign করলে cross-entropy loss penalise করে।
5. Trillions of examples জুড়ে model contexts এবং likely next tokens-এর statistical patterns শেখে।

---

## 33. Cross-entropy loss

### 33.1 Slide-এর formula

প্রতিটি token-এর জন্য:

```math
\mathcal{L} = -\sum_i y_i \log p_i
```

where:

- $y_i$ is the one-hot true token;
- $p_i$ is the predicted probability.

### 33.2 Intuition

Loss correct token-এ low probability assign করা penalise করে।

Slide-এর intuition:

> Reward correct next-token predictions.

### 33.3 One-hot labels-এর জন্য simplification

Correct token যদি token $k$ হয়, then:

```math
y_k = 1
```

and all incorrect tokens-এর জন্য:

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

- Model correct token-এ high probability দিলে loss low।
- Model correct token-এ low probability দিলে loss high।

### Exam flag

**[EXAM / REVISION FLAG]** Cross-entropy loss formula এবং next-token prediction-এর সঙ্গে এর connection জানতে হবে।

---

## 34. Training versus inference

### 34.1 Training

Training-এর সময়:

1. Next token predict করা।
2. Ground truth-এর সঙ্গে compare করা।
3. Weights update করা।

### 34.2 Inference

Inference-এর সময়:

1. Next token predict করা।
2. Sample করা বা maximum-probability token choose করা।
3. Prediction আবার input context-এ feed করা।

### 34.3 Main contrast

| Stage | Ground truth available? | Weights updated? | Output fed back in? |
|---|---:|---:|---:|
| Training | Yes | Yes | Generation-এর মতো একইভাবে নয় |
| Inference | No | No | Yes |

### Key concept: inference loop

**Intuition:** Inference time-এ model-এর নিজের generated token next prediction-এর context-এর অংশ হয়।

**Formal definition from lecture:** কোনো formal definition দেওয়া হয়নি।

---

## 35. Objective-এর limitation

### 35.1 Slide statement

Pretraining objective purely predictive হওয়ায় model করতে পারে:

- plausible কিন্তু false information hallucinate করা;
- data-র biases repeat করা;
- unsafe content generate করা।

Slide বলছে:

> Fundamentally, it optimises the likelihood of text, not correctness or other properties.

### Key concept: hallucination

**Intuition:** Hallucination হলো model plausible-sounding কিন্তু false information generate করলে।

**Formal definition from lecture:** কোনো formal definition নেই; slide hallucination-কে plausible but false information হিসেবে describe করেছে।

### Key concept: likelihood versus truthfulness

**Intuition:** Next-token prediction-এ trained model শেখে কোন text likely, কিন্তু কোন claims true, safe, helpful, বা user goals-এর সঙ্গে aligned তা সরাসরি শেখে না।

**Formal statement from slide:** Objective likelihood of text optimise করে, correctness বা other properties নয়।

### Exam flag

**[EXAM / REVISION FLAG]** Learning outcomes explicitly hallucinations এবং bias-এর মতো limitations evaluate করতে বলে।

---

## 36. Training data scale and preprocessing

### 36.1 Typical scale

Pretraining slide অনুযায়ী typical LLM pretraining use করে:

- billions to trillions of tokens;
- web text;
- books;
- code;
- Wikipedia.

### 36.2 Data preprocessing

Important preprocessing steps:

- deduplication;
- filtering;
- quality control.

এটি training-data lecture-এর Common Crawl, C4, OpenWebText, The Pile, GPT-3 data construction, filtering bias, PII anonymisation, এবং contamination discussion-এর সঙ্গে সরাসরি connected।

---

## 37. “Large” language models কত বড়?

### 37.1 Two camps of models

Slide বলছে lecture mostly দুই camp discuss করে:

#### Medium-sized models

Examples:

- BERT / RoBERTa models with about **100M or 300M** parameters;
- T5 models with sizes such as:
  - **220M**;
  - **770M**;
  - **3B**.

#### Very large language models

Slide “very large” LMs define করে:

- models with **100+ billion parameters**.

### 37.2 Larger model size-এর consequences

Larger model sizes imply:

- larger compute requirements;
- more expensive inference.

### 37.3 Adaptation and usage strategies

Different sizes of LMs adapt/use করার different ways আছে, including:

- fine-tuning;
- zero-shot prompting;
- few-shot prompting;
- in-context learning.

### 37.4 Emergent properties and trade-offs

Slide বলছে:

- emergent properties model scale থেকে arise করে;
- model size এবং corpus size-এর মধ্যে trade-off আছে।

### Key concept: emergent properties

**Intuition:** Emergent properties হলো capabilities যা model scale বাড়লে appear করে বা অনেক stronger হয়।

**Formal definition from lecture:** কোনো formal definition দেওয়া হয়নি।

---

## 38. Compute requirements

### 38.1 Training compute

Slide বলছে training involve করতে পারে:

- thousands of GPUs / TPUs;
- weeks to months of training;
- distributed training.

Slide conclusion:

> Compute becomes the main constraint.

### 38.2 Training versus inference cost

Training:

- expensive;
- কয়েকবার করা হয়;
- possibly only once করা হয়।

Inference:

- per run cheaper;
- অনেকবার performed।

### Key concept: compute constraint

**Intuition:** Hardware availability, cost, এবং runtime limit করে model কত বড় হতে পারে এবং কত data process করতে পারে।

**Formal definition from lecture:** কোনো formal definition দেওয়া হয়নি।

---

## 39. Why LLMs?

Slide দুইটি main reason দেয়:

1. এক single model দিয়ে many NLP tasks solve করার promise।
2. LLMs-এ emergent properties।

Slide image Wei et al. 2022 থেকে examples দেখায়, scale-এর সঙ্গে performance changes:

- math word problems;
- instruction following;
- chain-of-thought prompting;
- instruction tuning.

### Key concept: one model for many tasks

**Intuition:** প্রতিটি NLP task-এর জন্য আলাদা model train করার বদলে একটি LLM prompt বা adaptation দিয়ে many tasks handle করতে পারে।

**Formal definition from lecture:** কোনো formal definition দেওয়া হয়নি।

---

## 40. Pretraining and adaptation

### 40.1 Pretraining

Slide বলছে pretraining মানে huge amounts of unlabeled text-এ self-supervised training objectives ব্যবহার করে training।

### 40.2 Adaptation

Central question:

> How do we use a pretrained model for a downstream task?

Slide অনুযায়ী এটি depend করে:

- NLP task-এর type কী;
- input এবং output formats;
- annotated examples কত আছে।

### 40.3 Adaptation approaches

Listed approaches:

- fine-tuning;
- prompting;
- instruction tuning.

### [UNCLEAR]

Slide title-এ “Pre-training and adaption” লেখা। সম্ভবত intended “adaptation।” Slide-এ “inputand output” spacing error-ও আছে।

---

## 41. Transformer-based LLMs-এর dominant architecture

### 41.1 GPT-3 architecture

Slide বলছে GPT-3 use করে:

- decoder-only Transformer;
- causal attention;
- LayerNorm;
- residual blocks.

### 41.2 Modern LLM architecture

Modern LLMs যেমন:

- LLaMA;
- Mistral;
- DeepSeek;

same core architecture ব্যবহার করে।

এগুলো include করতে পারে:

- improved normalisation;
- improved efficiency;
- minor architectural refinements.

কিন্তু core একই থাকে।

### Key concept: architectural refinement

**Intuition:** Refinements efficiency, normalisation, বা implementation details improve করে, কিন্তু overall decoder-only causal Transformer structure পরিবর্তন করে না।

**Formal definition from lecture:** কোনো formal definition নেই।

---

## 42. Foundation versus instruction-tuned models

### 42.1 Foundation models

Slide foundation model properties list করে:

- coherent, fluent generation;
- completion and continuation;
- vast world knowledge;
- potentially harmful outputs;
- difficult to control;
- human values-এর সঙ্গে misaligned.

**নিজের ভাষায় definition:** Foundation model হলো pretrained generative model যার broad language capability আছে, কিন্তু reliable instruction-following, safety, বা alignment necessarily নেই।

**Formal definition from lecture:** কোনো formal definition নেই; slide properties list করেছে।

### 42.2 Instruction-tuned models

Slide instruction-tuned model properties list করে:

- foundation ability and more;
- prompt দিয়ে controllable;
- fine-tune করার দরকার কম;
- commands follow করে;
- performance-এ slight hit;
- prompt template-sensitive.

**নিজের ভাষায় definition:** Instruction-tuned model হলো foundation model, যা natural-language instructions follow করার জন্য আরও adapted।

**Formal definition from lecture:** কোনো formal definition নেই।

### 42.3 Comparison table

| Foundation model | Instruction-tuned model |
|---|---|
| Fluent continuation | Better command following |
| Broad world-knowledge correlations | More controllable by prompts |
| Harmful outputs produce করতে পারে | সাধারণত safer / more aligned |
| Control করা difficult | Prompt template-sensitive |
| Instructions follow guarantee করে না | Task-specific fine-tuning-এর দরকার কম |

---

## 43. Pretraining lecture-এর summary

Final pretraining slide summarises:

### Pretraining

- Large-scale self-supervised learning.
- Autoregressive next-token prediction.
- Massive text corpora-তে trained।

### Pretraining যা produce করে

- Fluent text.
- World knowledge correlations.
- In-context learning capability.
- Generative foundation model.

### Pretraining যা guarantee করে না

- Instruction following.
- Helpfulness or safety.
- Truthfulness.

### Exam flag

**[EXAM / REVISION FLAG]** “Pretrained” মানেই “truthful,” “safe,” বা “instruction-following” নয়। Summary slide explicitly বলে pretraining এসব guarantee করে না।

---

# Core formulas and objectives

## 44. Sequence probability

```math
P(x_1, x_2, \ldots, x_T)
```

এটি full token sequence-এর probability।

## 45. Autoregressive factorisation

```math
P(x_1, \ldots, x_T) = \prod_{t=1}^{T} P(x_t \mid x_{<t})
```

প্রতিটি token শুধু previous tokens ব্যবহার করে predicted হয়।

## 46. Log-likelihood objective

```math
\max \sum_t \log P(x_t \mid x_{<t})
```

Model true next tokens-এর log probability maximise করতে trained হয়।

## 47. Cross-entropy loss

```math
\mathcal{L} = -\sum_i y_i \log p_i
```

where:

- $y_i$: one-hot true token;
- $p_i$: predicted probability.

Correct token $k$-এর জন্য:

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

**[UNCLEAR]** Slide $x$, $x_0$, বা $\alpha$ detail-এ define করেনি।

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

1. Model previous tokens receive করে।
2. Model next tokens-এর ওপর probability distribution predict করে।
3. Correct target হলো “Paris.”
4. Cross-entropy “Paris”-এ low probability assign করলে penalise করে।
5. Trillions of examples জুড়ে repeat করলে model train হয়।

## 50. GPT-3 in-context learning examples

### Zero-shot

```text
Translate English to French:
cheese =>
```

কোনো example provided নয়।

### One-shot

```text
Translate English to French:
sea otter => loutre de mer
cheese =>
```

একটি demonstration provided।

### Few-shot

```text
Translate English to French:
sea otter => loutre de mer
peppermint => menthe poivrée
plush giraffe => girafe peluche
cheese =>
```

Several demonstrations provided।

## 51. XSUM contamination example

Input: former Arsenal goalkeeper, Reading, West Brom, এবং Premier League promotion সম্পর্কিত passage।

Output:

```text
West Brom have appointed Nicky Hammond as technical director, ending his 20-year association with Reading.
```

কেন গুরুত্বপূর্ণ: input এবং output দুটোই pretraining data-তে থাকলে benchmark performance memorisation-এর কারণে inflated হতে পারে।

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

Interpretation: filtering rules minority dialects disproportionately remove করতে পারে।

---

# Exam flags and revision priorities

## 54. Explicit spoken exam statements

**[UNCLEAR: transcript missing]** আলাদা transcript দেওয়া হয়নি, তাই spoken statements যেমন “this will be on the exam,” “common mistake,” বা “you should know this” identify করা যায় না।

## 55. Slide-based revision flags

Pretraining learning outcomes-কে high-value revision targets হিসেবে treat করুন:

1. LLM pretraining define করা এবং কেন self-supervised তা explain করা।
2. Encoder-only, encoder-decoder, এবং decoder-only Transformers compare করা।
3. Modern LLMs কেন decoder-only architectures with causal attention ব্যবহার করে তা explain করা।
4. Formulate করা:
   - autoregressive probability factorisation;
   - cross-entropy loss;
   - training এবং inference-এর difference.
5. Evaluate করা:
   - hallucination;
   - bias;
   - unsafe content;
   - scale and compute;
   - pretraining, adaptation, এবং instruction tuning-এর connection.

## 56. Likely high-value concepts

Slides জুড়ে central concepts:

- Data quality raw token count-এর চেয়ে বেশি গুরুত্বপূর্ণ।
- Filtering necessary, কিন্তু bias create করতে পারে।
- Data contamination benchmark conclusions invalidate করতে পারে।
- Decoder-only causal Transformers modern LLMs dominate করে।
- Pretraining হলো self-supervised next-token prediction।
- Objective likelihood optimise করে, truthfulness নয়।
- Foundation models automatically instruction-following বা safe নয়।
- Instruction tuning controllability improve করে, কিন্তু prompt templates-এর প্রতি sensitive হতে পারে।

---

# Connections

## 57. Earlier Transformer lectures-এর সঙ্গে connection

Pretraining lecture Transformer architecture-এর prior knowledge assume করে। Decoder-only causal Transformers-এ focus করার আগে encoder-only, encoder-decoder, এবং decoder-only variants compare করা হয়েছে।

## 58. BERT-এর সঙ্গে connection

BERT contrast case হিসেবে ব্যবহৃত:

- BERT encoder-only.
- BERT bidirectional.
- BERT masked language modelling ব্যবহার করে।
- Modern LLMs decoder-only.
- Modern LLMs causal attention এবং left-to-right generation ব্যবহার করে।

## 59. Training data lecture-এর সঙ্গে connection

Pretraining lecture বলে LLM-এর training data previously covered ছিল। Training-data lecture explain করে pretraining quality depend করে:

- corpus quality;
- curation;
- deduplication;
- filtering;
- contamination handling;
- bias analysis;
- documentation and inspection.

## 60. Adaptation এবং instruction tuning-এর সঙ্গে connection

Pretraining একটি foundation model produce করে। Downstream tasks-এ কীভাবে use করা হবে তা adaptation determine করে:

- fine-tuning;
- prompting;
- instruction tuning.

Foundation-versus-instruction-tuned slide pretraining-কে connect করে:

- controllability;
- safety;
- prompt sensitivity;
- command following.

## 61. Evaluation-এর সঙ্গে connection

Data contamination training data-কে benchmark evaluation-এর সঙ্গে connect করে। Benchmark examples যদি pretraining corpora-তে থাকে, benchmark results generalisation-এর বদলে memorisation reflect করতে পারে।

## 62. Safety and fairness-এর সঙ্গে connection

Slides data filtering এবং model limitations-কে connect করে:

- hallucination;
- bias reproduction;
- unsafe content;
- representational harms;
- filtering bias;
- demographic underrepresentation.

---

# Recording-এ check করার unclear sections

- **[UNCLEAR: transcript missing]** আলাদা lecture transcript included ছিল না, তাই spoken explanations, extra examples, exam hints, এবং verbal derivations unavailable।
- **[UNCLEAR]** Course title দেওয়া হয়নি।
- **[UNCLEAR]** GPT slide বলে “decoder transfer language models”; সম্ভবত intended “decoder Transformer language models।” Recording check করুন।
- **[UNCLEAR]** Data mixing scaling laws slide exponential-form law mention করে কিন্তু exact equation দেখায় না।
- **[UNCLEAR]** Neural scaling law slide $L = L_0 + (x_0/x)^\alpha$ দেখায়, কিন্তু $x$, $x_0$, বা $\alpha$ detail-এ define করে না।
- **[UNCLEAR]** Matrix composition donut chart-এর কিছু labels এবং percentages fully legible নয়।
- **[UNCLEAR]** Bias-in-filtering chart affected identity groups visually list করে, কিন্তু exact bar values clearly legible নয়।
- **[UNCLEAR]** কিছু slide text-এ typos বা spacing issues আছে, যেমন “adaption” এবং “inputand output.”

---

# Compact revision checklist

Exam-এর আগে final pass হিসেবে ব্যবহার করুন:

- [ ] Pretraining-কে raw text-এ large-scale self-supervised training হিসেবে define করতে পারি।
- [ ] Next-token prediction কেন self-supervised explain করতে পারি।
- [ ] Sequence probability $P(x_1, \ldots, x_T)$ লিখতে পারি।
- [ ] Autoregressive factorisation লিখতে পারি।
- [ ] Log-likelihood objective লিখতে পারি।
- [ ] One-hot labels-এর জন্য cross-entropy loss লিখে simplify করতে পারি।
- [ ] Training এবং inference distinguish করতে পারি।
- [ ] Decoder-only models কেন causal attention ব্যবহার করে explain করতে পারি।
- [ ] Encoder-only, encoder-decoder, এবং decoder-only Transformers compare করতে পারি।
- [ ] Pretraining কেন likelihood optimise করে, truthfulness নয়, explain করতে পারি।
- [ ] Foundation models versus instruction-tuned models explain করতে পারি।
- [ ] Filtering কেন necessary কিন্তু risky explain করতে পারি।
- [ ] Data contamination define করতে পারি এবং input-only বনাম input-output contamination distinguish করতে পারি।
- [ ] Common Crawl, WebText/OpenWebText, C4, GPT-3 data, এবং The Pile describe করতে পারি।
- [ ] Representational harms, sentiment bias, এবং filtering bias explain করতে পারি।
- [ ] Common data filtering pipeline describe করতে পারি।
- [ ] Slides-এ দেখানো level-এ neural scaling law describe করতে পারি।
- [ ] Dataset documentation এবং inspection কেন matter করে explain করতে পারি।
