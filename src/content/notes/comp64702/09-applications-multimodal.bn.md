---
subject: COMP64702
chapter: 9
title: "Applications: LLMs & Multimodal"
language: bn
---

# LLM ও মাল্টিমোডাল LLM-এর প্রয়োগ — কাঠামোবদ্ধ স্টাডি নোট

**বিষয় ও পরিসর:** এই লেকচারে বৃহৎ ভাষা মডেল বা Large Language Models (LLMs)-এর প্রয়োগ আলোচনা করা হয়েছে। আলোচনাটি টেক্সট-ভিত্তিক ও ডোমেইন-নির্দিষ্ট প্রয়োগ থেকে এজেন্ট, ডিপ্লয়মেন্ট চ্যালেঞ্জ, নীতি-নৈতিকতা, এবং মাল্টিমোডাল LLM (MLLM), বিশেষ করে vision-language model (VLM), পর্যন্ত বিস্তৃত।

**কোর্স:** [প্রম্পটে উল্লেখ নেই]

**লেকচার বিষয়:** LLM-এর প্রয়োগ; মাল্টিমোডাল LLM

**ব্যবহৃত প্রধান উৎস:** স্লাইড ডেক: `TRIM week 8 Application Multimodal no answers.pdf`।

**ট্রান্সক্রিপ্টের অবস্থা:** [ট্রান্সক্রিপ্ট অনুপস্থিত] এই কথোপকথনে কোনো ট্রান্সক্রিপ্ট আপলোড করা হয়নি। এই নোটগুলো স্লাইড ডেক ও তার ভিজ্যুয়াল ডায়াগ্রাম ব্যবহার করে তৈরি। যে অংশগুলোতে বক্তার মৌখিক ব্যাখ্যা প্রয়োজন হতে পারে, সেখানে `[ট্রান্সক্রিপ্ট অনুপস্থিত]` বা `[অস্পষ্ট]` চিহ্ন দেওয়া হয়েছে।

**পরীক্ষা-ফ্ল্যাগ নোট:** স্লাইডে “this will be on the exam” ধরনের সরাসরি বাক্য নেই। `[রিভিশন ফ্ল্যাগ]` চিহ্নিত আইটেমগুলো গুরুত্বপূর্ণ, কারণ এগুলো learning outcome, quiz slide, core definition, বা বারবার আসা architectural pattern-এ দেখা যায়। এগুলোকে বক্তার সরাসরি পরীক্ষা-সতর্কতা হিসেবে দাবি করা হচ্ছে না।

---

## Part 1 — LLM-এর প্রয়োগ

### 1. লেকচারের agenda এবং learning outcomes

#### Agenda

লেকচারের প্রথম অর্ধেক অংশে আলোচনা করা হয়েছে:

- foundation model থেকে application-এ যাওয়ার পরিবর্তন;
- core NLP এবং text-based application;
- domain-specific transformation, বিশেষ করে code, healthcare, এবং law;
- tool ও reasoning ব্যবহারকারী autonomous agent হিসেবে LLM;
- deployment challenge এবং ethical consideration।

#### Learning outcomes

এই অংশের শেষে শিক্ষার্থীদের সক্ষম হওয়া উচিত:

- core LLM capability-কে বাস্তব industry use case-এর সঙ্গে map করতে;
- বিভিন্ন application-এর জন্য সঠিক adaptation strategy মূল্যায়ন করতে:
  - prompting;
  - retrieval-augmented generation (RAG);
  - fine-tuning;
- LLM agent এবং tool-augmented system-এর architecture বিশ্লেষণ করতে;
- deployment, cost, এবং safety-সংক্রান্ত limitation সমালোচনামূলকভাবে আলোচনা করতে।

[রিভিশন ফ্ল্যাগ] adaptation-strategy তুলনা — **Prompting বনাম RAG বনাম Fine-Tuning** — খুব কেন্দ্রীয়, কারণ এটি learning outcome এবং HR handbook mini-quiz—দুই জায়গাতেই এসেছে।

---

## 2. Core application 1: Advanced text summarization

### 2.1 সংজ্ঞা ও intuition

**Text summarization** হলো দীর্ঘ টেক্সটকে ছোট সংস্করণে সংক্ষিপ্ত করার কাজ, যেখানে গুরুত্বপূর্ণ তথ্য সংরক্ষিত থাকে।

লেকচারটি summarization-এর বিবর্তনে দুটি ধাপ তুলনা করেছে।

#### Pre-LLM era: extractive summarization

**Intuition:** মডেলটি যেন একটি highlighter-এর মতো কাজ করে। এটি source text থেকে গুরুত্বপূর্ণ বাক্য বেছে নেয় এবং সেগুলো summary-তে সরাসরি কপি করে।

**স্লাইডের wording:** Extractive summarization মানে “copying sentences।” স্লাইডে BERT-এর মতো ছোট encoder model-এর কথা উল্লেখ আছে।

#### LLM era: abstractive summarization

**Intuition:** মডেলটি মানুষের note-taker-এর মতো কাজ করে। এটি অর্থ synthesize করতে পারে, ধারণা মিলিয়ে নিতে পারে, এবং নতুন বাক্য লিখতে পারে।

**স্লাইডের wording:** LLM-era summarization হলো “highly abstractive summarization, capable of synthesizing meaning।”

### 2.2 গুরুত্বপূর্ণ application pattern

#### Meeting transcripts

LLM raw speech-to-text log-কে structured action item-এ রূপান্তর করতে পারে।

Workflow:

```text
Raw speech-to-text meeting transcript
        ↓
LLM summarization / structuring
        ↓
Action items, responsibilities, and next steps
```

এটি কাজে লাগে, কারণ meeting transcript প্রায়ই দীর্ঘ, noisy, এবং punctuation-এ দুর্বল হয়।

[ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইডে বিস্তারিত worked transcript example নেই। বক্তা যদি sample meeting-summary output walkthrough করে থাকেন, recording দেখে নিতে হবে।

#### Document routing

LLM customer support ticket summarize করতে পারে, যাতে সেগুলো categorize করে সঠিক human agent-এর কাছে route করা যায়।

সাধারণ workflow:

```text
Customer support ticket
        ↓
LLM summary
        ↓
Category / issue type
        ↓
Correct human agent or support team
```

### 2.3 Week 6-এর evaluation connection

স্লাইডে summarization evaluation-কে Week 6-এর সঙ্গে সরাসরি যুক্ত করা হয়েছে।

Evaluation method-এর মধ্যে আছে:

- **ROUGE**, একটি traditional overlap-based metric;
- **LLM-as-a-judge**, strict evaluation prompt ব্যবহার করে;
- factual consistency checking;
- hallucination prevention।

#### Key point

একটি summary fluent হতে পারে, কিন্তু factually wrong হতে পারে। তাই modern evaluation ক্রমশ reference summary-এর সঙ্গে overlap নয়, source-এর প্রতি summary কতটা faithful—এটির ওপর বেশি জোর দেয়।

[রিভিশন ফ্ল্যাগ] কেন ROUGE একা LLM-generated summary মূল্যায়নে যথেষ্ট নাও হতে পারে, তা ব্যাখ্যা করতে জানতে হবে: ROUGE surface overlap দেখে, কিন্তু factual consistency ও hallucination ধরতে stricter semantic evaluation দরকার।

---

## 3. Core application 2: Structured data extraction

### 3.1 সমস্যা

স্লাইডে বলা হয়েছে, **enterprise data-এর 80% unstructured**, যার মধ্যে আছে:

- emails;
- PDFs;
- reports।

এটি একটি practical problem তৈরি করে: প্রতিষ্ঠানগুলোকে messy document থেকে structured field বের করতে হয়।

### 3.2 LLM solution: Zero-shot বা few-shot information extraction

**Information Extraction (IE)** হলো unstructured text থেকে structured information বের করার task।

স্লাইডে LLM-কে **zero-shot** বা **few-shot** IE-এর solution হিসেবে উপস্থাপন করা হয়েছে।

#### Zero-shot extraction

**Intuition:** মডেলটি শুধু instruction থেকে extraction করে, task-specific example ছাড়াই।

Example instruction pattern:

```text
Extract all companies, dates, and monetary values from the following document.
Return the result as JSON.
```

#### Few-shot extraction

**Intuition:** মডেলকে desired extraction format-এর কয়েকটি example দেওয়া হয়, তারপর তাকে নতুন document process করতে বলা হয়।

### 3.3 Named Entity Recognition (NER)

**Named Entity Recognition (NER)** text থেকে named entity extract করে।

স্লাইডের example-এ আছে:

- companies;
- monetary values;
- dates।

স্লাইডের point হলো, LLM custom BERT model train না করেও এটি করতে পারে।

### 3.4 Relation extraction

**Relation extraction** entity-গুলোর মধ্যে relationship শনাক্ত করে।

স্লাইড example:

```text
Company A [ACQUIRED] Company B
```

পরিষ্কার notation:

$$
\text{Company A} \xrightarrow{\text{ACQUIRED}} \text{Company B}
$$

**Intuition:** Named entity recognition object শনাক্ত করে; relation extraction শনাক্ত করে object-গুলো কীভাবে connected।

### 3.5 Implementation strategy: structural prompting

স্লাইড structural prompting recommend করে, বিশেষ করে মডেলকে strict JSON output দিতে বলা।

একটি সাধারণ prompt হতে পারে:

```text
Extract the sender, subject, date, entities, and relationships from the document.
Return only valid JSON. Do not include any extra text.
```

Page 4-এর visual দেখায়:

```text
Unstructured PDF / email-like document
        ↓
LLM Extraction
        ↓
JSON-like structured output
```

Visual-এর JSON example-এ এমন field আছে:

```json
{
  "sender": "email@example.com",
  "subject": "Meeting Update",
  "date": "2023-10-27",
  "extracted_entities": {
    "entities": {
      "type": "Meeting"
    },
    "object_entities": {
      "sendr": "thread",
      "date": "Meeting"
    }
  }
}
```

[অস্পষ্ট] স্লাইড image-এ দেখানো JSON আংশিকভাবে artificial বা garbled মনে হয়, বিশেষ করে `"sendr"` এবং `"date": "Meeting"` ধরনের field। lecturer intended schema ব্যাখ্যা করলে recording দেখে নিতে হবে।

### 3.6 Challenge: output parsing errors

স্লাইড একটি practical implementation problem তুলে ধরে: LLM অনেক সময় conversational text যোগ করে, যেমন:

```text
Here is your JSON:
```

এটি downstream code ভেঙে দিতে পারে, যদি code raw JSON-ই expect করে।

[রিভিশন ফ্ল্যাগ] এটি একটি common application failure mode: মডেল correct information দিতে পারে, কিন্তু invalid format-এ।

---

## 4. Mini-Quiz 1: Application architecture

### Scenario

আপনি একটি internal company tool বানাচ্ছেন, যাতে HR 200-page company benefits handbook সম্পর্কে employee-দের question instantly answer করতে পারে।

### Options

A. HR document দিয়ে scratch থেকে নতুন foundational model pretrain করা।  
B. Handbook-এর সঙ্গে general instruction-tuned LLM এবং Retrieval-Augmented Generation (RAG) ব্যবহার করা।  
C. Company policy guess করতে model-কে standard zero-shot prompt দেওয়া।  
D. শুধু HR handbook-এর ওপর LLM supervised fine-tune (SFT) করা।

### Answer

**Answer: B — handbook-এর ওপর RAG সহ general instruction-tuned LLM ব্যবহার করা।**

[ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইড official answer দেখায় না, কিন্তু factual document-grounded application-এর জন্য RAG-এর ওপর lecture-এর repeated emphasis থেকে correct choice implied।

### Reasoning

- **A inappropriate**, কারণ 200-page handbook-এর জন্য scratch থেকে foundation model pretrain করা অত্যন্ত ব্যয়বহুল এবং অপ্রয়োজনীয়।
- **B appropriate**, কারণ system-কে fixed internal document থেকে exact policy information retrieve করতে হবে।
- **C unsafe**, কারণ handbook-এ access ছাড়া zero-shot model company policy guess করতে পারে।
- **D less appropriate**, কারণ handbook একটি knowledge source। document-grounded answer-এর জন্য RAG বেশি উপযুক্ত।

[রিভিশন ফ্ল্যাগ] এই quiz পরীক্ষা করে কখন prompting, pretraining, বা fine-tuning-এর বদলে **RAG** বেছে নিতে হয়।

---

## 5. Domain-specific application: Software engineering

### 5.1 Code generation and copilots

স্লাইড বলছে LLM GitHub এবং StackOverflow-এর মতো source-এ heavily trained।

Code-oriented model বা tool-এর example:

- GitHub Copilot;
- CodeLlama।

Core task:

- autocompletion;
- unit test লেখা;
- language-এর মধ্যে code translate করা, যেমন Python থেকে Rust।

### 5.2 Code review and bug fixing

LLM আরও support করতে পারে:

- security vulnerability detect করা;
- performance optimization suggest করা;
- code review করা;
- bug fix propose করা।

### 5.3 কেন LLM code-এ ভালো করে

স্লাইড দুটি কারণ দিয়েছে।

#### Reason 1: Code-এর strict syntax এবং logic আছে

Natural language ambiguous। Code তুলনামূলকভাবে কম ambiguous, কারণ এতে formal syntax এবং executable semantics থাকে।

#### Reason 2: Evaluation objective

Generated code evaluate করা যায়:

- compiler দিয়ে;
- unit test suite দিয়ে।

স্লাইড বলছে natural-language generation-এর মতো একইভাবে human grader দরকার হয় না।

### 5.4 Metric: Pass@k

স্লাইডে **Pass@k** metric-এর কথা আছে।

**Intuition:** $k$টি candidate code solution generate করে দেখা হয়, অন্তত একটি test pass করে কি না।

**Formal definition:** [ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইড Pass@k-এর নাম দেয়, কিন্তু exact formula দেয় না।

[রিভিশন ফ্ল্যাগ] কেন code generation অনেক open-ended text task-এর চেয়ে evaluate করা সহজ, তা জানতে হবে: code compile করা যায় এবং unit-test করা যায়।

---

## 6. Domain-specific application: Healthcare and biomedicine

### 6.1 Slide diagram workflow

Page 7 visual-এ pipeline:

```text
Patient EHR & Clinical Notes
        ↓
Medical LLM, e.g. Med-PaLM + RAG Knowledge Base
        ↓
Structured Output: Differential Diagnosis
        ↓
Human-in-the-loop Physician Review
        ↓
Verification of output
```

Example structured output-এ possible diagnosis:

- pneumonia;
- influenza;
- COVID-19;
- bronchitis।

### 6.2 Key concept: human-in-the-loop medical LLM

**Definition:** Human-in-the-loop medical LLM হলো এমন system যেখানে model output তৈরি করে, কিন্তু physician সেটি ব্যবহার করার আগে review ও verify করেন।

**Intuition:** LLM information structure করা এবং সম্ভাব্য diagnosis suggest করতে সাহায্য করে। এটি clinical responsibility replace করে না।

[রিভিশন ফ্ল্যাগ] Healthcare high-risk domain, যেখানে visual-এ explicitly **physician review** দেখানো হয়েছে। এটি এমন domain-এর key example, যেখানে human-in-the-loop constraint গুরুত্বপূর্ণ।

[ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইডে clinical safety, privacy, regulation, বা liability সম্পর্কে বিস্তারিত spoken explanation নেই। ওই detail-এর জন্য recording দেখতে হবে।

---

## 7. Class discussion: Generalist বনাম specialist debate

### 7.1 স্লাইডের core claim

স্লাইড বলছে current state-of-the-art general model, যেমন GPT-4, domain-specific task-এও অনেক সময় smaller domain-specific fine-tuned model, যেমন 7B legal-specific model, থেকে ভালো করে।

### 7.2 Discussion question

LLM application-এর future কি dominate করবে:

- API দিয়ে access করা কয়েকটি বিশাল “God-model”; নাকি
- হাজার হাজার smaller, locally hosted, highly specialized model?

স্লাইড বিবেচনা করতে বলছে:

- data privacy;
- inference costs;
- latency।

### 7.3 Trade-offs

#### Massive generalist API model

Potential advantages:

- strong general capability;
- strong reasoning;
- broad task coverage;
- smaller specialist model-কে outperform করতে পারে।

Discussion hint অনুযায়ী potential disadvantages:

- privacy concern;
- API call প্রতি cost;
- latency;
- external provider-এর ওপর dependency।

#### Smaller locally hosted specialist model

Discussion hint অনুযায়ী potential advantages:

- stronger data control;
- potentially lower latency;
- scale-এ potentially lower inference cost;
- task-specific deployment।

Potential disadvantages:

- frontier generalist model-এর চেয়ে underperform করতে পারে;
- local infrastructure দরকার;
- model maintenance ও adaptation দরকার।

[ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইড এটি class discussion হিসেবে দিয়েছে। lecturer বা students-এর response নেই।

---

## 8. Domain-specific application: Law and finance

### 8.1 Legal sector

#### E-discovery

**Definition:** E-discovery হলো legal proceeding, যেমন subpoena, এর জন্য large document collection scan করে relevance খোঁজার process।

স্লাইডে LLM use হিসেবে subpoena-এর relevance-এর জন্য millions of documents scan করার কথা বলা হয়েছে।

#### Contract analysis

LLM identify করতে পারে:

- risky clauses;
- non-standard terms;
- missing indemnifications।

#### Risk: hallucinated legal cases

স্লাইড explicitly **“hallucinated legal cases” problem** নাম দিয়েছে।

**Definition:** Hallucinated legal case হলো model-invented fake precedent বা case citation।

**Why it matters:** Legal output verifiable হতে হবে। Invented precedent বিপজ্জনক, কারণ সেটিকে legal authority হিসেবে ধরে নেওয়া হতে পারে।

[রিভিশন ফ্ল্যাগ] Law grounding ও factual verification কেন গুরুত্বপূর্ণ, তার key example।

### 8.2 Finance sector

#### Algorithmic trading

স্লাইড real-time sentiment analysis list করেছে:

- financial news;
- SEC filings।

#### Automated reporting

LLM quarterly earnings call synthesize করে executive summary তৈরি করতে পারে।

#### Adaptation technique: RAG

স্লাইড বলছে finance অনেক সময় real-time data access নিশ্চিত করতে heavily RAG-এর ওপর নির্ভর করে।

Reason:

```text
Stock prices change by the second;
parametric memory is useless here.
```

### 8.3 Key concept: parametric memory

**Definition:** Parametric memory হলো training-এর সময় model parameters-এর ভেতরে stored information।

**Lecture point:** Stock price-এর মতো দ্রুত পরিবর্তনশীল fact-এর জন্য parametric memory unsuitable।

**Intuition:** কোনো fact যদি constantly change করে, তাহলে training memory-এর ওপর নির্ভর না করে runtime-এ retrieve করা উচিত।

[রিভিশন ফ্ল্যাগ] Finance time-sensitive information-এর জন্য RAG কেন required, তার strong example।

---

# Part 2 — Agent হিসেবে LLM

## 9. Application paradigm shift: LLM as agents

### 9.1 Passive responder থেকে active agent

#### Standard LLM

Standard LLM text নেয় এবং text output দেয়:

$$
\text{text input} \rightarrow \text{text output}
$$

এটি passive responder।

#### Agentic LLM

Agentic LLM:

- high-level goal গ্রহণ করে;
- goal অর্জনের জন্য required step নিয়ে reason করে;
- external environment-এর সঙ্গে interact করে;
- action execute করে।

### 9.2 LLM agent-এর core components

স্লাইড তিনটি core component দিয়েছে।

#### 1. Brain

**Definition:** Brain হলো LLM নিজেই।

Role:

- reasoning;
- planning।

#### 2. Memory

স্লাইড memory-কে ভাগ করেছে:

- **short-term memory**, অর্থাৎ context window;
- **long-term memory**, অর্থাৎ vector database।

Page 10 diagram-এ এটি “Short & Long-term Memory (Vector DB)” হিসেবে দেখানো হয়েছে।

#### 3. Tools

Tools হলো function যা LLM call করতে পারে।

Example:

- APIs;
- calculators;
- web browsers;
- code interpreters।

Page 10 diagram-এ “Autonomous AI Agent” দেখানো হয়েছে:

```text
Short & Long-term Memory ↔ LLM brain ↔ Planning & Reasoning Module
                           ↓
                      Tools & APIs
          Calculator, Web Browser, Code Interpreter
```

[রিভিশন ফ্ল্যাগ] তিনটি component জানতে হবে: **Brain, Memory, Tools**।

---

## 10. How agents work: ReAct prompting

### 10.1 Definition

**ReAct** মানে **Reasoning and Acting**।

স্লাইড ReAct-কে prompting paradigm হিসেবে define করেছে, যা মিলিয়ে দেয়:

- chain-of-thought reasoning;
- environmental actions।

### 10.2 ReAct loop

স্লাইড loop দিয়েছে:

1. **Thought**  
   Model user prompt-এর ভিত্তিতে next step কী হবে তা reason করে।

2. **Action**  
   Model external tool call করার সিদ্ধান্ত নেয়।

   Example:

   ```text
   SearchWikipedia("Eiffel Tower")
   ```

3. **Observation**  
   Tool model-কে data return করে।

4. **Repeat**  
   Goal achieved না হওয়া পর্যন্ত loop repeat হয়।

### 10.3 Algorithm-style version

```text
Input: user goal

repeat:
    Thought: reason about the next step
    Action: call a tool or interact with the environment
    Observation: receive returned information
until the goal is achieved

Return final answer
```

### 10.4 কেন ReAct powerful

স্লাইড বলছে ReAct LLM-এর কিছু সীমাবদ্ধতা overcome করে:

- internally reliable math করতে না পারা;
- current events না জানা।

এটি model-কে ব্যবহার করতে দেয়:

- calculator;
- search engine।

Page 11 visual-এ cycle:

```text
Thought (Reasoning)
        ↓
Action
        ↓
Action / Tool Execution against External Environment or APIs
        ↓
Observation / Environment Feedback
        ↺ back to Thought
```

[রিভিশন ফ্ল্যাগ] Tool-using agent কীভাবে ordinary text-only prompt-response system থেকে আলাদা, তা ব্যাখ্যার key mechanism হলো ReAct।

---

## 11. Multi-agent systems

### 11.1 Definition

**Multi-agent system** multiple LLM agent ব্যবহার করে, যাদের distinct persona ও tool থাকে এবং তারা একে অন্যের সঙ্গে communicate করে।

স্লাইড এটি এক বিশাল prompt দিয়ে সবকিছু করানোর সঙ্গে contrast করেছে।

### 11.2 Example: software development system

স্লাইড তিন-agent workflow দিয়েছে।

#### Agent 1: Product Manager

System requirement লেখে।

#### Agent 2: Software Engineer

Product Manager-এর requirement-এর ভিত্তিতে Python code লেখে।

#### Agent 3: QA Tester

Software Engineer-এর code review করে, bug খুঁজে পায়, এবং revision-এর জন্য ফেরত পাঠায়।

### 11.3 Benefits

স্লাইডে list করা হয়েছে:

- separation of concerns;
- simulated debate-এর মাধ্যমে self-reflection ও self-correction।

### 11.4 Intuition

এক prompt-কে একই সঙ্গে product manager, engineer, এবং tester বানানোর বদলে system workflow-কে specialized role-এ decompose করে।

---

## 12. Mini-Quiz 2: Agents and hallucinations

### Question

আপনি একটি LLM agent-কে calculate করতে বললেন:

$$
345{,}678 \times 987{,}654
$$

সবচেয়ে safe agentic approach কোনটি?

A. “Let’s think step-by-step” prompt দিয়ে LLM-কে token-by-token math calculate করতে বলা।  
B. LLM-কে Python interpreter tool দেওয়া, multiplication করার Python script লিখতে বলা, execute করা, এবং printed observation return করতে বলা।  
C. হাজার হাজার multiplication table দিয়ে LLM fine-tune করা।

### Answer

**Answer: B — Python interpreter tool ব্যবহার করা।**

[ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইড official answer দেখায় না, কিন্তু surrounding ReAct/tool-use material থেকে B বোঝা যায়।

### Reasoning

Exact arithmetic নির্ভরযোগ্য tool-এর কাছে delegate করা ভালো।

```text
LLM agent receives arithmetic task
        ↓
LLM writes or calls Python multiplication
        ↓
Python interpreter executes exact computation
        ↓
LLM returns observed result
```

[রিভিশন ফ্ল্যাগ] Quiz-এর point multiplication নিজে নয়; internal token generation এবং external tool execution-এর পার্থক্য।

---

# Part 3 — Deployment bottlenecks and ethics

## 13. Deployment bottlenecks: LLM এখনো সব জায়গায় নেই কেন?

লেকচার তিনটি major deployment hurdle দিয়েছে।

### 13.1 Inference cost

70B-parameter model চালাতে প্রতি token-এ significant GPU compute লাগে।

স্লাইড বলছে generative AI traditional software-এর তুলনায় structurally বেশি expensive।

**Intuition:** Large generative model বারবার next token compute করে, এবং প্রত্যেক token expensive model inference চায়।

### 13.2 Latency

LLM autoregressively, token by token text generate করে:

$$
x_1, x_2, x_3, \dots, x_t
$$

স্লাইড বলছে এটি slow, এবং high latency real-time application যেমন voice assistant-এ user experience degrade করে।

### 13.3 Reliability and evaluation

স্লাইড traditional software ও LLM contrast করেছে।

#### Traditional software

Traditional software deterministic:

$$
\text{Input A} \rightarrow \text{Output B}
$$

একই input reliably একই output দেয়।

#### LLMs

LLM probabilistic। Output vary করতে পারে, এবং hard-to-predict way-তে fail করতে পারে।

তাই স্লাইড বলছে continuous monitoring এবং robust evaluation pipeline strictly required।

স্লাইডে “Inversion Prompting techniques covered in Week 6” উল্লেখ আছে।

[অস্পষ্ট] “Inversion Prompting” Week 6-এর exact term কি না, নাকি slide typo / OCR issue—confirm করতে হবে।

[রিভিশন ফ্ল্যাগ] Deterministic software বনাম probabilistic LLM system contrast করতে এবং কেন monitoring/evaluation pipeline required তা explain করতে জানতে হবে।

---

## 14. Ethical and safety considerations in applications

### 14.1 Bias and fairness

স্লাইড বলছে model training data-তে থাকা bias amplify করে।

Example:

- resume-screening system কিছু demographic-কে unfairly penalize করতে পারে।

**Definition:** Bias amplification হলো model training data-তে থাকা bias reproduce বা worsen করলে।

### 14.2 Security: prompt injection

Customer service bot-এর মতো user-facing application prompt injection-এর প্রতি vulnerable।

**Definition:** Prompt injection হলো attack, যেখানে user model-এর instruction manipulate করে, প্রায়ই intended system behavior override করার চেষ্টা করে।

স্লাইডের harmful effect example:

- data leak করা;
- profanity output করা।

### 14.3 Copyright and IP

স্লাইড বলছে generative application pretraining dataset থেকে copyrighted code বা text reproduce করার risk রাখে।

**Key point:** System নতুন text বা code generate করছে বলে মনে হলেও, training data থেকে protected material reproduce করতে পারে।

---

## 15. Discussion: Human-in-the-loop বনাম full autonomy

### 15.1 Current state

স্লাইড বলছে অধিকাংশ successful LLM application বর্তমানে **copilot** হিসেবে কাজ করে।

Copilot একজন human worker-কে augment করে, যে final output review করে।

### 15.2 Industry direction

স্লাইড বলছে industry **agents**-এর দিকে এগোচ্ছে:

- full autonomy;
- workflow execution;
- humans sleep করার সময় operation।

### 15.3 Discussion prompt

স্লাইড জিজ্ঞেস করে:

- কোন industry-তে আজ full LLM autonomy acceptable?
- কোথায় human-in-the-loop constraint permanently maintain করতে হবে?

[ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইডে class discussion answer নেই।

[রিভিশন ফ্ল্যাগ] Healthcare ও law-এর সঙ্গে connect করুন: দুটিই human review এবং factual grounding গুরুত্বপূর্ণ এমন example।

---

## 16. LLM applications section-এর summary

স্লাইড summary বলছে:

- LLM application base model-কে prompting, RAG, এবং tool use দিয়ে extend করে।
- Summarization ও extraction-এর মতো core NLP task এখন prompting দিয়ে largely solved।
- Code, medical, এবং legal application-এর মতো domain application strict factual adherence চায় এবং প্রায়ই RAG ব্যবহার করে।
- Agents হলো frontier: tools ব্যবহার করে, ReAct দিয়ে reason করে, এবং environment-এর সঙ্গে interact করে এমন model।
- Deployment compute cost, latency, এবং safety evaluation দ্বারা constrained।

---

# Part 4 — Multimodal LLMs

## 17. Agenda and learning outcomes

### 17.1 Agenda

লেকচারের দ্বিতীয় অর্ধেক অংশে আলোচনা করা হয়েছে:

- multimodality-এর motivation;
- core MLLM architecture এবং modality gap;
- landmark models:
  - CLIP;
  - Flamingo;
  - BLIP-2;
  - LLaVA;
- training pipeline, বিশেষ করে visual instruction tuning;
- multimodal prompting এবং evaluation।

### 17.2 Learning outcomes

শিক্ষার্থীদের সক্ষম হওয়া উচিত:

- MLLM-এর structural component বোঝা:
  - encoder;
  - projector;
  - LLM backbone;
- modern vision-language model-এর two-stage training pipeline বিশ্লেষণ করা;
- interleaved text and image ব্যবহার করে multimodal prompting technique apply করা;
- modern benchmark দিয়ে MLLM evaluate করা;
- visual hallucination risk identify করা।

[রিভিশন ফ্ল্যাগ] Architecture triplet — **encoder, projector, LLM backbone** — সবচেয়ে গুরুত্বপূর্ণ revision target-এর একটি।

---

## 18. Multimodal LLM কী?

### 18.1 স্লাইডের formal definition

**MLLM** হলো এমন language model যা multiple data modality receive, reason over, এবং কখনো generate করতে পারে।

Listed modalities:

- text;
- images;
- audio;
- video।

### 18.2 Goal

Goal হলো:

1. LLM-এর reasoning এবং instruction-following capability ধরে রাখা;
2. real world perceive করার জন্য LLM-কে “eyes” এবং “ears” দেওয়া।

### 18.3 Lecture focus

লেকচার **Vision-Language Models (VLMs)**-এর ওপর focus করে।

কারণ:

- VLM বর্তমানে MLLM-এর সবচেয়ে বেশি researched এবং deployed subclass।

---

## 19. MLLM-এর core architecture

লেকচার বলছে virtually সব modern MLLM একটি **tripartite**, অর্থাৎ three-part, architecture share করে।

```text
Raw image pixels
        ↓
Vision Encoder
        ↓
Connector / Projection Layer
        ↓
LLM Backbone
        ↓
Text response
```

### 19.1 Component 1: Vision encoder

**Definition:** Vision encoder raw image pixel থেকে high-dimensional feature representation extract করে।

Example:

- Vision Transformer (ViT)।

**Intuition:** Vision encoder image pixel-কে visual content capture করা representation-এ convert করে।

### 19.2 Component 2: Connector / projection layer

**Definition:** Connector visual feature-কে LLM-এর embedding space-এ translate করে।

**Intuition:** Vision encoder এবং LLM ভিন্ন representational space ব্যবহার করে। Connector translator-এর মতো কাজ করে।

### 19.3 Component 3: LLM backbone

**Definition:** LLM backbone হলো reasoning এবং generation component।

এটি translated visual token-কে text token-এর সঙ্গে process করে এবং text response generate করে।

Examples:

- LLaMA;
- Vicuna।

**Key distinction:** Vision encoder perceive করে; LLM backbone reason এবং generate করে।

[রিভিশন ফ্ল্যাগ] কোন component reasoning করে তা জানতে হবে: **LLM backbone**, vision encoder বা projector নয়।

---

## 20. Component 1 in detail: Vision encoder হিসেবে CLIP

### 20.1 Definition

**CLIP** মানে **Contrastive Language-Image Pretraining**।

স্লাইড CLIP-কে foundational OpenAI model হিসেবে describe করেছে, যা image ও text-কে একই vector space-এ map করে।

Slide reference:

- Radford et al., “Learning Transferable Visual Models From Natural Language Supervision,” ICML 2021।

### 20.2 Training data

স্লাইড বলছে CLIP **400 million image-caption pairs**-এ trained হয়েছিল।

### 20.3 Contrastive learning objective

স্লাইড বলছে CLIP contrastive loss function ব্যবহার করে।

Objective হলো maximize করা cosine similarity between:

- image embedding, যেমন dog-এর image;
- correct text description embedding, যেমন “a picture of a dog।”

Clean notation:

$$
\text{maximize } \cos(e_{\text{image}}, e_{\text{text correct}})
$$

**Formal contrastive loss:** [ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইড exact loss formula দেয় না।

### 20.4 Page 23 visual থেকে CLIP architecture overview

Page 23 diagram তিনটি stage দেখায়।

#### Stage 1: Contrastive pre-training

- Text encoder caption embed করে।
- Image encoder image embed করে।
- Model batch-এর সব image-text pair compare করে।
- Correct image-text pair-এর similarity high হওয়া উচিত।

Diagram similarity matrix দেখায়, যেখানে image embedding:

$$
I_1, I_2, \dots, I_N
$$

text embedding-এর against compare হয়:

$$
T_1, T_2, \dots, T_N
$$

Matching diagonal pair-গুলো correct image-text pair।

#### Stage 2: Label text থেকে dataset classifier তৈরি

Class label যেমন:

- plane;
- car;
- dog;
- bird;

natural-language prompt-এ convert করা হয়:

```text
a photo of a {object}
```

এই prompt-গুলো text encoder দিয়ে pass করা হয়।

#### Stage 3: Zero-shot prediction-এ ব্যবহার

নতুন image-এর জন্য:

1. image encode করা;
2. candidate label prompt encode করা;
3. image embedding-এর সঙ্গে text embedding compare করা;
4. highest similarity-র label prompt বেছে নেওয়া।

Diagram example predict করে:

```text
a photo of a dog.
```

### 20.5 MLLM-এর জন্য CLIP কেন গুরুত্বপূর্ণ

স্লাইড বলছে CLIP-এর vision encoder freeze করে LLM-এর “eyes” হিসেবে ব্যবহার করা যায়।

কারণ:

- CLIP-এর visual feature already human language-এর সঙ্গে semantically aligned।

---

## 21. Component 2 in detail: Connector and modality gap

### 21.1 Modality gap

স্লাইড problem define করে:

- CLIP vision encoder size $D_{vision}$-এর vector output করে;
- LLM size $D_{text}$-এর word embedding expect করে;
- দুই space naturally communicate করে না।

এই mismatch হলো **modality gap**।

### 21.2 Definition

**Modality gap:** বিভিন্ন modality-এর feature representation-এর mismatch, যেমন visual feature এবং language embedding।

### 21.3 Solution

Vision encoder এবং LLM-এর মাঝখানে একটি lightweight trainable neural network layer introduce করা।

Clean mapping:

$$
\mathbb{R}^{D_{vision}} \rightarrow \mathbb{R}^{D_{text}}
$$

এই connector visual representation-কে language model expected embedding space-এ map করে।

### 21.4 Connector types

#### Linear projection

একটি simple weight matrix।

Early LLaVA-তে used।

#### MLP

Multi-layer perceptron।

স্লাইড better translation-এর জন্য 2-layer network specify করে।

#### Q-Former / Perceiver Resampler

Context-window space বাঁচাতে visual token compress করে।

Used in:

- BLIP-2;
- Flamingo।

[রিভিশন ফ্ল্যাগ] Connector কেন দরকার তা explain করতে জানতে হবে: $D_{vision}$ এবং $D_{text}$ ভিন্ন space।

---

## 22. Mini-Quiz 1: Architecture check

### Question

LLaVA-এর মতো standard vision-language MLLM-এ complex logic, math, এবং final conversational response generate করার জন্য primarily responsible component কোনটি?

A. The Vision Transformer (ViT)  
B. The Contrastive Loss Function  
C. The LLM Backbone, e.g. Vicuna/LLaMA  
D. The Projection Layer

### Answer

**Answer: C — LLM Backbone।**

[ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইড official answer দেখায় না, কিন্তু preceding architecture slide clearly বলে LLM backbone হলো “the brain।”

### Reasoning

- Vision Transformer visual feature extract করে।
- Contrastive loss function training objective, reasoning module নয়।
- Projection layer visual feature-কে language embedding-এ translate করে।
- LLM backbone reasoning করে এবং conversational response generate করে।

[রিভিশন ফ্ল্যাগ] এই quiz MLLM architecture-এর তিন component-এর role test করে।

---

# Part 5 — Landmark multimodal models

## 23. Landmark model 1: Flamingo

### 23.1 Reference

স্লাইড cite করেছে:

- Alayrac et al., “Flamingo: a Visual Language Model for Few-Shot Learning,” NeurIPS 2022।

### 23.2 Breakthrough

DeepMind-এর Flamingo প্রথম model যা highly effective **interleaved image-text prompting** demonstrate করে।

### 23.3 Architecture innovation 1: Perceiver Resampler

Perceiver Resampler হাজার হাজার image token compress করে **64 token**-এ নামায়।

Purpose:

- computational cost বাঁচানো;
- অনেক visual token-এর burden কমানো।

### 23.4 Architecture innovation 2: Cross-attention layers

Image শুধু prompt-এর শুরুতে feed করার বদলে Flamingo visual information সরাসরি LLM-এর deep layer-এ inject করে।

স্লাইডে named mechanism:

- cross-attention layers।

### 23.5 Impact

Flamingo প্রমাণ করে যে MLLM image সহ **few-shot in-context learning** করতে পারে, text-এর ক্ষেত্রে GPT-3-এর few-shot learning-এর মতো।

### 23.6 Page 27 visual থেকে Flamingo architecture overview

Page 27 diagram distinguish করে:

- pretrained and frozen components;
- trained-from-scratch components।

Architecture flow:

```text
Image
  ↓
Vision Encoder
  ↓
Perceiver Resampler
  ↓
Gated cross-attention dense layers inside LLM
  ↓
Text output
```

Visual-এ দুটি image input, dog এবং cat, vision encoder ও Perceiver Resampler দিয়ে process হতে দেখা যায়। এগুলো language-model block-এর মাঝে inserted gated cross-attention dense layer-এ feed করে।

Visual interleaved visual/text data-ও দেখায়, roughly:

```text
<image> This is a very cute dog. <image> This is ...
```

Example output:

```text
a very serious cat.
```

### 23.7 Page 28 visual থেকে Flamingo results overview

Page 28 chart Flamingo 80B with 32 shots-কে multiple task-এ previous zero/few-shot state of the art-এর সঙ্গে compare করে।

Visual pattern দেখায়:

- Flamingo 80B অনেক task-এ previous zero/few-shot state of the art improve করে;
- model size matters, Flamingo-80B ছোট Flamingo variant-কে outperform করে;
- more shots aggregated performance improve করে।

ডান পাশের chart number of shots-এর against aggregated performance plot করে:

- Flamingo-80B;
- Flamingo-9B;
- Flamingo-3B।

80B curve সর্বোচ্চ।

[ট্রান্সক্রিপ্ট অনুপস্থিত] Chart-এ অনেক dataset-specific value আছে। lecturer কোনো particular benchmark highlight করলে recording check করতে হবে।

---

## 24. Landmark model 2: BLIP-2

### 24.1 Reference

স্লাইড cite করেছে:

- Li et al., “BLIP-2: Bootstrapping Language-Image Pre-training...” ICML 2023।

### 24.2 Efficiency breakthrough

Massive LLM scratch থেকে train করা expensive।

BLIP-2 freeze করে:

- vision encoder;
- LLM backbone।

### 24.3 Q-Former

**Q-Former** মানে **Querying Transformer**।

**Definition:** একটি lightweight, trainable module, যা LLM-এর প্রয়োজনীয় সবচেয়ে relevant visual feature extract করতে শেখে।

### 24.4 Result

স্লাইড বলছে BLIP-2 significantly fewer trainable parameter ব্যবহার করে state-of-the-art performance অর্জন করে।

স্লাইড আরও বলছে এটি university lab-এর জন্য MLLM research “democratized” করেছে।

### 24.5 Page 30 visual থেকে BLIP-2 diagram details

Page 30 visual dense এবং কয়েকটি অংশ দেখায়।

#### Top: Q-Former pretraining

Flow:

```text
Input Image
    ↓
Frozen Image Encoder
    ↓
Q-Former
```

Q-Former learned query token ব্যবহার করে এবং visual information process করে:

- self-attention;
- cross-attention;
- feed-forward layers।

Diagram তিনটি objective list করে:

1. **Image-Text Matching**
2. **Image-Text Contrastive Learning**
3. **Image-Grounded Text Generation**

#### Attention masks

Diagram label করে:

- Q: query token positions;
- T: text token positions;
- masked and unmasked positions।

এটি তিনটি masking scheme দেখায়:

1. **Bi-directional self-attention mask** image-text matching-এর জন্য।
2. **Multi-modal causal self-attention mask** image-grounded text generation-এর জন্য।
3. **Uni-modal self-attention mask** image-text contrastive learning-এর জন্য।

[অস্পষ্ট] Slide image mask দেখায়, কিন্তু mechanics পুরোপুরি explain করে না। lecturer-এর explanation-এর জন্য recording revisit করতে হবে।

#### Bottom: bootstrapping from large language models

নিচের অংশে দুটি variant দেখানো হয়েছে।

##### Decoder-based LLM, e.g. OPT

```text
Input Image
    ↓
Image Encoder
    ↓
Q-Former with learned queries
    ↓
Fully connected layer
    ↓
LLM Decoder
    ↓
Output Text: "a cat wearing sunglasses"
```

##### Encoder-decoder-based LLM, e.g. FlanT5

```text
Input Image
    ↓
Image Encoder
    ↓
Q-Former with learned queries
    ↓
Fully connected layer
    ↓
LLM Encoder + LLM Decoder
    ↓
Output suffix text: "wearing sunglasses"
```

Visual example-এ prefix text আছে:

```text
a cat
```

এবং suffix text:

```text
wearing sunglasses
```

---

## 25. Landmark model 3: LLaVA

### 25.1 Definition

**LLaVA** মানে **Large Language-and-Vision Assistant**।

স্লাইড LLaVA-কে **Visual Instruction Tuning**-এর open-source pioneer হিসেবে describe করে।

Slide reference:

- Liu et al., “Visual Instruction Tuning,” NeurIPS 2023।

### 25.2 Architecture

স্লাইড simplicity emphasize করে।

LLaVA ব্যবহার করে:

- frozen CLIP encoder;
- simple linear বা MLP projection layer;
- frozen Vicuna LLM, যা LLaMA-based।

### 25.3 LLaVA কেন successful হয়েছিল

স্লাইড বলছে:

```text
The magic wasn't in the architecture; it was in the data generation pipeline.
```

বিশেষ করে, LLaVA GPT-4 ব্যবহার করে multimodal training data generate করেছিল।

### 25.4 Page 32 visual থেকে LLaVA architecture overview

Page 32 visual এই notation ব্যবহার করে।

#### Image side

Image input:

$$
X_v
$$

Vision encoder visual feature produce করে:

$$
Z_v
$$

Projection matrix:

$$
W
$$

Projected visual representation:

$$
H_v
$$

Flow:

$$
X_v \rightarrow Z_v \xrightarrow{W} H_v
$$

#### Language side

Language instruction:

$$
X_q
$$

Instruction representation:

$$
H_q
$$

Flow:

$$
X_q \rightarrow H_q
$$

#### LLM generation

Language model denoted:

$$
f_\phi
$$

এটি visual ও language representation receive করে এবং language response generate করে:

$$
f_\phi(H_v, H_q) \rightarrow X_a
$$

where:

$$
X_a = \text{language response}
$$

### 25.5 General LLaVA architecture pattern

```text
Image
  ↓
Vision Encoder
  ↓
Projection W
  ↓
Projected visual tokens
  +
Language instruction tokens
  ↓
LLM
  ↓
Language response
```

[অস্পষ্ট / সম্ভাব্য স্লাইড inconsistency] একটি slide বলে LLaVA frozen Vicuna LLM ব্যবহার করে, কিন্তু Stage 2 training slide বলে visual instruction tuning-এর সময় LLM backbone trainable। Clarification-এর জন্য recording check করতে হবে।

---

# Part 6 — MLLM training pipeline

## 26. Stage 1: Feature alignment pretraining

LLaVA-এর মতো MLLM train করা হয় দুটি distinct stage-এ।

Stage 1 হলো **Feature Alignment Pretraining**।

### 26.1 Goal

LLM-কে vision encoder-এর “language” বুঝতে শেখানো।

### 26.2 Data

স্লাইড বলছে Stage 1 millions of simple image-caption pair ব্যবহার করে।

Example dataset:

- CC3M।

### 26.3 Frozen components

- Vision encoder;
- LLM backbone।

### 26.4 Trainable component

- Projection layer only।

### 26.5 স্লাইডের analogy

স্লাইড এটি compare করে:

```text
Teaching an English speaker (LLM) to read a French dictionary (vision features)
by mapping words one-to-one.
```

### 26.6 Algorithm-style version

```text
For each image-caption pair:
    1. Encode the image using the frozen vision encoder.
    2. Project visual features into the LLM embedding space.
    3. Pair projected visual features with the caption.
    4. Update only the projection layer.
```

**Formal loss:** [ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইড exact training loss specify করে না।

---

## 27. Stage 2: Visual Instruction Tuning

Stage 2 হলো **Visual Instruction Tuning**, যা **Multimodal SFT** নামেও পরিচিত।

### 27.1 Goal

Image সম্পর্কে complex human instruction follow করতে model-কে শেখানো।

Slide example:

```text
Why is this meme funny?
```

### 27.2 Data

স্লাইড বলছে Stage 2 approximately **150k** highly detailed instruction-following multimodal conversation ব্যবহার করে।

### 27.3 Frozen component

- Vision encoder।

### 27.4 Trainable components

- Projection layer;
- LLM backbone।

### 27.5 Week 6-এর connection

স্লাইড Visual Instruction Tuning-কে Week 6-এর standard **Supervised Fine-Tuning (SFT)**-এর সঙ্গে explicitly connect করে।

Analogy:

```text
Standard SFT teaches text LLMs to be assistants.
Visual Instruction Tuning teaches MLLMs to be visual assistants.
```

### 27.6 Stage 1 বনাম Stage 2 comparison

| Stage | Goal | Data | Frozen | Trainable |
|---|---|---|---|---|
| Stage 1: Feature Alignment Pretraining | LLM-কে vision encoder feature বুঝতে শেখানো | Millions of image-caption pairs, e.g. CC3M | Vision encoder + LLM backbone | Projection layer only |
| Stage 2: Visual Instruction Tuning / Multimodal SFT | Image নিয়ে complex human instruction follow করতে শেখানো | ~150k multimodal instruction-following conversations | Vision encoder | Projection layer + LLM backbone |

[রিভিশন ফ্ল্যাগ] Two-stage training pipeline একটি major learning outcome।

---

## 28. Class discussion: LLaVA-এর data generation

### 28.1 Problem

2023 সালে LLaVA authors-এর **150,000 conversational Q&A pairs about images** দরকার ছিল।

Human labeling খুব expensive ছিল।

### 28.2 Solution direction

তারা multimodal model-এর জন্য data generate করতে text-only model, GPT-4, ব্যবহার করেছিল।

### 28.3 Discussion question

GPT-4 তখন text-only ছিল এবং image দেখতে পারত না—তাহলে authors কীভাবে accurate ও detailed visual Q&A data generate করতে GPT-4 ব্যবহার করলেন?

Slide hint:

- bounding boxes;
- captions।

### 28.4 Slide hint থেকে answer

Image information caption এবং bounding-box/object description ব্যবহার করে text form-এ convert করা হয়েছিল। এরপর GPT-4 ঐ textual description ব্যবহার করে multimodal-style conversation generate করতে পেরেছিল।

[ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইড hint দেয়, কিন্তু full pipeline detail দেয় না। lecturer-এর explanation-এর জন্য recording revisit করতে হবে।

---

# Part 7 — Beyond images: audio and video

## 29. Video MLLMs

### 29.1 Video as a sequence of images

Video MLLM, যেমন Video-LLaVA, video-কে frame-এর sequence হিসেবে treat করে।

### 29.2 Challenge: context window exhaustion

যদি একটি image অনেক visual token produce করে, তাহলে video সেই token cost multiply করে।

স্লাইড দেয়:

$$
30 \text{ frames of video} = 30 \times \text{visual tokens}
$$

এটি context window exhaust করতে পারে।

[রিভিশন ফ্ল্যাগ] Video image input-এর চেয়ে harder, কারণ visual token frame ধরে multiply হয়।

---

## 30. Audio encoders

স্লাইড বলছে Whisper-এর মতো architecture, একটি audio transformer, CLIP-এর মতোই LLM-এ project করা যায়।

Architecture analogy:

```text
Audio
  ↓
Audio Encoder, e.g. Whisper
  ↓
Projection into LLM embedding space
  ↓
LLM
```

---

## 31. Any-to-any models

স্লাইড emerging model list করে, যেমন:

- GPT-4o;
- Gemini 1.5 Pro।

স্লাইড বলছে এসব model natively multiple modality-তে scratch থেকে trained।

তারা strict:

```text
Encoder → Projector
```

pipeline bypass করে আরও organic cross-modal understanding-এর জন্য।

[ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইড এসব any-to-any model-এর architectural detail দেয় না।

---

# Part 8 — Evaluating MLLMs

## 32. Traditional benchmarks

লেকচার জিজ্ঞেস করে: আমরা কীভাবে জানব একটি MLLM ভালো কি না?

প্রথমে traditional benchmark introduce করা হয়।

### 32.1 VQAv2

**VQAv2** মানে Visual Question Answering।

স্লাইড এটি short factual question ব্যবহার করে বলে describe করে।

Example:

```text
What color is the car?
```

Drawback:

- modern MLLM-এর জন্য খুব simple।

### 32.2 OK-VQA

**OK-VQA** মানে Outside Knowledge Visual Question Answering।

এটি image-এ directly present নয় এমন world knowledge require করে।

Slide example:

```text
Which political party does this person belong to?
```

[অস্পষ্ট] Parsed slide question-এর আগে missing image placeholder দেখায়। specific image matter করলে original slide / recording check করতে হবে।

### 32.3 Image captioning: COCO

Model image-এর জন্য descriptive text generate করে।

Evaluation n-gram overlap metric ব্যবহার করে, যেমন:

- CIDEr;
- BLEU।

### 32.4 Traditional benchmark-এর limitation

Traditional metric অনেক সময় খুব rigid, কারণ এগুলো surface text string compare করে।

Instruction-tuned MLLM-এর ক্ষেত্রে এটি problem, কারণ model correct answer দিলেও full conversational sentence-এ দিতে পারে।

---

## 33. Comprehensive benchmarks

Modern MLLM conversational, তাই old benchmark তাদের ability capture করতে fail করতে পারে।

### 33.1 MME

**MME** মানে Multimodal Evaluation।

এটি test করে:

#### Perception

- color;
- position;
- count।

#### Cognition

- commonsense;
- math;
- code।

এটি Yes/No prompt ব্যবহার করে robustness evaluate করে।

### 33.2 MM-Vet

**MM-Vet** complex, multi-turn multimodal dialogue evaluate করে।

এটি LLM-as-a-judge, সাধারণত GPT-4V, ব্যবহার করে MLLM response grade করে based on:

- accuracy;
- helpfulness;
- reasoning।

[রিভিশন ফ্ল্যাগ] Old string-matching style benchmark এবং newer conversational / judge-based benchmark-এর পার্থক্য জানতে হবে।

---

## 34. Mini-Quiz 2: Evaluation constraints

### Scenario

আপনি VQAv2-এ একটি new MLLM evaluate করছেন।

Ground truth answer:

```text
Red
```

Model answer:

```text
The car shown in the image is red.
```

Question: exact match-এর মতো strict traditional string-matching metric-এ কী হবে?

A. Score is 100%, correct।  
B. Score is 0%, incorrect।

### Answer

**Answer: B — score is 0%.**

স্লাইড answer directly দেয়।

### Insight

Instruction-tuned MLLM “chatty.” তারা complete sentence-এ answer দিতে পারে, কিন্তু traditional exact-match benchmark short string expect করে।

তাই semantically correct answer strict exact matching-এ zero পেতে পারে।

এই কারণেই এখন MLLM evaluation-এ LLM-as-a-judge ব্যবহার করা হয়।

[রিভিশন ফ্ল্যাগ] এটি clear benchmark pitfall: correct meaning সবসময় correct benchmark string নয়।

---

# Part 9 — Hallucination in MLLMs

## 35. Visual hallucination

### 35.1 স্লাইডের formal definition

**Visual hallucination** ঘটে যখন MLLM confidently এমন object, attribute, বা relationship describe করে যা provided image-এ নেই।

### 35.2 Intuition

Model বলে যে সে image-এ কিছু দেখছে, কিন্তু বাস্তবে তা নেই।

এটি ordinary text hallucination থেকে আলাদা, কারণ error specifically generated answer এবং visual evidence-এর mismatch।

[রিভিশন ফ্ল্যাগ] Visual hallucination exactভাবে define করতে জানতে হবে।

---

## 36. Visual hallucination কেন হয়

স্লাইড দুটি cause দিয়েছে।

### 36.1 Language prior

LLM backbone এত powerful যে এটি visual encoder-কে override করতে পারে।

Slide example:

```text
The model sees a dining table
        ↓
It hallucinates chairs
        ↓
Because textually, chairs usually accompany tables
```

**Definition:** Language prior হলো text pattern থেকে model-এর learned expectation।

**Intuition:** Training text-এ table-এর সঙ্গে chairs অনেক আসে, তাই image-এ chair না থাকলেও LLM “chairs” generate করতে পারে।

### 36.2 Connector compression

Megapixel image-কে কয়েকশ visual token-এ reduce করার সময় ছোট visual detail হারিয়ে যেতে পারে।

**Intuition:** Image-এ থাকা raw information visual token-এর ছোট set-এর তুলনায় অনেক বেশি।

[রিভিশন ফ্ল্যাগ] মনে রাখার দুটি cause: **language prior** এবং **connector compression**।

---

## 37. Evaluating hallucinations: POPE

### 37.1 Definition

**POPE** মানে **Polling-based Object Probing Evaluation**।

এটি visual hallucination expose করার জন্য specifically designed benchmark।

Slide reference:

- Li et al., “Evaluating Object Hallucination in Large Vision-Language Models,” EMNLP 2023।

### 37.2 Methodology

POPE evaluation-কে binary Yes/No question হিসেবে frame করে।

এটি adversarial probing ব্যবহার করে এমন object সম্পর্কে জিজ্ঞেস করে যেগুলো:

- image-এর object-এর সঙ্গে frequently co-occur করে;
- কিন্তু নির্দিষ্ট image-এ absent।

Slide example pattern:

```text
Is there a mouse in the image?
```

[অস্পষ্ট] Parsed slide mouse example-এর আগে missing image placeholder দেখায়। exact context-এর জন্য slide/recording revisit করতে হবে।

### 37.3 Finding

স্লাইড বলছে অনেক early MLLM POPE-এ catastrophically fail করে, কারণ statistical prior-এর কারণে তারা default “Yes” বলে।

[রিভিশন ফ্ল্যাগ] POPE সরাসরি test করে model visual evidence-এর ওপর নির্ভর করছে, নাকি learned co-occurrence prior-এর ওপর।

---

## 38. Class discussion: Clever Hans effect

### 38.1 Context

Clever Hans ছিল একটি horse, যে দেখতে math করতে পারত মনে হতো, কিন্তু আসলে trainer-এর subtle body-language cue পড়ছিল।

### 38.2 Discussion question

MLLM কি সত্যিই image দেখছে, নাকি Clever Hans effect হচ্ছে যেখানে user prompt answer-টা clue করে দিচ্ছে?

Slide example prompt:

```text
What is the man holding in his left hand?
```

এই prompt imply করে:

- image-এ একজন man আছে;
- man-এর left hand visible বা relevant;
- man কিছু hold করছে।

### 38.3 Key issue

Model visual perception-এর বদলে prompt-এ embedded assumption-এর ওপর answer দিতে পারে।

### 38.4 Prompt-design implication

স্লাইড জিজ্ঞেস করে এটি prevent করতে prompt কীভাবে design করা যায়।

[ট্রান্সক্রিপ্ট অনুপস্থিত] স্লাইড discussion answer দেয় না। lecturer-এর suggested prompt design-এর জন্য recording revisit করতে হবে।

---

# Consolidated key concepts

## Prompting

Instruction এবং/অথবা example ব্যবহার করে model weight না বদলে LLM দিয়ে task করানো।

Lecture-এ used for:

- summarization;
- structured extraction;
- many core NLP tasks।

## Retrieval-Augmented Generation (RAG)

এমন system design যেখানে model relevant external information retrieve করে এবং সেই information ব্যবহার করে answer দেয়।

Lecture-এ used for:

- HR handbook Q&A;
- finance, কারণ stock price ও data দ্রুত change করে;
- law, hallucinated precedent কমাতে;
- healthcare, medical LLM system-এর অংশ হিসেবে।

## Fine-tuning / SFT

Supervised example-এর ওপর model আরও training করা।

Lecture connections:

- Week 6-এর standard SFT text LLM-কে assistant-এর মতো behave করতে শেখায়;
- visual instruction tuning MLLM-কে visual assistant-এর মতো behave করতে শেখায়।

## Tool use

LLM-কে calculator, API, browser, বা Python interpreter-এর মতো external function access দেওয়া।

Used for:

- agentic systems;
- exact arithmetic;
- current information retrieval;
- code execution।

## Agent

LLM-based system যা high-level goal নেয়, step নিয়ে reason করে, memory/tool ব্যবহার করে, এবং environment-এ act করে।

## ReAct

Reasoning ও acting মেশানো prompting paradigm:

```text
Thought → Action → Observation → repeat
```

## Multi-agent system

এমন system যেখানে multiple LLM agent থাকে, যাদের ভিন্ন role/persona/tool আছে এবং তারা পরস্পরের সঙ্গে communicate করে।

## MLLM

Language model যা text, image, audio, video-এর মতো multiple modality receive, reason over, এবং কখনো generate করতে পারে।

## Vision encoder

Image pixel-কে visual feature representation-এ convert করা component।

## Connector / projector

Visual feature-কে LLM-এর embedding space-এ map করা component।

## LLM backbone

MLLM-এর reasoning এবং generation component।

## Modality gap

বিভিন্ন modality-এর representation-এর mismatch, বিশেষ করে visual feature vector এবং text embedding-এর মধ্যে।

## CLIP

Contrastively trained image-text model, যা image ও text-কে shared vector space-এ map করে। অনেক MLLM-এ frozen vision encoder হিসেবে ব্যবহৃত।

## Flamingo

Interleaved image-text prompting, Perceiver Resampler, এবং cross-attention layer ব্যবহারকারী landmark MLLM।

## BLIP-2

Landmark MLLM যা vision encoder এবং LLM backbone—দুটোই freeze করে, আর lightweight Q-Former train করে।

## LLaVA

CLIP, projection layer, এবং Vicuna/LLaMA-based LLM ব্যবহারকারী open-source visual instruction tuning model।

## Visual hallucination

MLLM provided image-এ absent object, attribute, বা relationship confidently describe করলে।

## POPE

Polling-based Object Probing Evaluation, adversarial Yes/No object question ব্যবহার করে visual hallucination-এর benchmark।

---

# Consolidated formulas, equations, and algorithm sketches

## Relation extraction example

$$
\text{Company A} \xrightarrow{\text{ACQUIRED}} \text{Company B}
$$

## Agent arithmetic example

$$
345{,}678 \times 987{,}654
$$

Lecture point হলো সবচেয়ে safe agentic approach হলো Python interpreter tool ব্যবহার করা।

## ReAct loop

```text
repeat:
    Thought: reason about next step
    Action: call tool or environment
    Observation: receive tool/environment result
until goal is achieved
```

## Autoregressive generation

$$
x_1, x_2, x_3, \dots, x_t
$$

LLM one token at a time generate করে, যার ফলে latency তৈরি হয়।

## Deterministic software contrast

$$
\text{Input A} \rightarrow \text{Output B}
$$

Traditional software deterministic; LLM probabilistic।

## Modality gap

$$
D_{vision} \neq D_{text}
$$

Connector mapping:

$$
\mathbb{R}^{D_{vision}} \rightarrow \mathbb{R}^{D_{text}}
$$

## CLIP similarity objective

$$
\text{maximize } \cos(e_{\text{image}}, e_{\text{text correct}})
$$

## LLaVA notation

$$
X_v \rightarrow Z_v \xrightarrow{W} H_v
$$

$$
X_q \rightarrow H_q
$$

$$
f_\phi(H_v, H_q) \rightarrow X_a
$$

where:

- $X_v$: image;
- $Z_v$: visual features;
- $W$: projection;
- $H_v$: projected visual representation;
- $X_q$: language instruction;
- $H_q$: instruction representation;
- $f_\phi$: language model;
- $X_a$: language response।

## Video token scaling

$$
30 \text{ frames of video} = 30 \times \text{visual tokens}
$$

---

# Worked examples from the lecture slides

## Example 1: HR handbook Q&A

**Problem:** 200-page benefits handbook সম্পর্কে employee question answer করার tool তৈরি করা।

**Correct architecture:** Handbook-এর ওপর instruction-tuned LLM + RAG।

**Reason:** Answer নির্দিষ্ট internal document-এ grounded হতে হবে।

---

## Example 2: Structured extraction from documents

**Input:** unstructured emails, PDFs, বা reports।

**Process:** LLM named entity এবং relationship extract করে।

**Output:** strict JSON।

**Failure mode:** Model `Here is your JSON:` ধরনের text prepend করতে পারে, যা downstream parser ভেঙে দেয়।

---

## Example 3: Code generation

Tasks:

- autocomplete code;
- unit test লেখা;
- Python থেকে Rust-এ translate করা;
- vulnerability detect করা;
- optimization suggest করা।

Evaluation:

- code compile করা;
- unit test run করা;
- Pass@k ব্যবহার করা।

---

## Example 4: Healthcare differential diagnosis

**Input:** Patient EHR এবং clinical notes।

**System:** Medical LLM plus RAG knowledge base।

**Output:** Structured differential diagnosis, including pneumonia, influenza, COVID-19, এবং bronchitis।

**Safety layer:** Human-in-the-loop physician review output verify করে।

---

## Example 5: ReAct tool use for arithmetic

**Problem:** Calculate

$$
345{,}678 \times 987{,}654
$$

**Unsafe approach:** LLM দিয়ে token-by-token calculate করানো।

**Safe agentic approach:** Python interpreter tool ব্যবহার করা এবং observed result return করা।

---

## Example 6: CLIP zero-shot classification

Labels:

- plane;
- car;
- dog;
- bird।

Prompt template:

```text
a photo of a {object}
```

Prediction method:

1. image encode করা;
2. প্রতিটি label prompt encode করা;
3. similarity compute করা;
4. highest similarity বেছে নেওয়া।

---

## Example 7: Flamingo interleaved image-text prompting

Page 27 visual interleaved input দেখায়:

```text
<image> This is a very cute dog. <image> This is ...
```

Example output:

```text
a very serious cat.
```

---

## Example 8: VQAv2 exact-match failure

Ground truth:

```text
Red
```

Model answer:

```text
The car shown in the image is red.
```

Strict exact-match result:

```text
0% / incorrect
```

Reason:

- answer semantically correct;
- benchmark exact string expect করে।

---

## Example 9: Visual hallucination

Image evidence:

```text
Dining table
```

Hallucinated output:

```text
Chairs
```

Cause:

- language prior যে table-এর সঙ্গে chair সাধারণত থাকে।

---

## Example 10: Clever Hans prompt leakage

Prompt:

```text
What is the man holding in his left hand?
```

Problem:

- prompt নিজেই imply করে image-এ একজন man আছে;
- prompt imply করে সে কিছু ধরে আছে;
- model visual evidence-এর বদলে এসব assumption ব্যবহার করতে পারে।

---

# Connections to earlier lectures and broader applications

## Week 6: evaluation

Summarization evaluation Week 6-এর সঙ্গে connect করে:

- ROUGE;
- LLM-as-a-judge;
- strict evaluation prompts;
- factual consistency checks;
- hallucination prevention।

## Week 6: SFT

Visual instruction tuning standard SFT-এর সঙ্গে connect করে:

```text
Text SFT teaches text LLMs to be assistants.
Visual Instruction Tuning teaches MLLMs to be visual assistants.
```

## Deployment and engineering connection

লেকচার model capability-কে real-world constraint-এর সঙ্গে connect করে:

- inference cost;
- latency;
- reliability;
- monitoring;
- safety evaluation।

## Domain grounding connection

Factual, domain-grounded application-এর solution হিসেবে RAG বারবার এসেছে:

- HR handbook Q&A;
- healthcare;
- law;
- finance।

---

# Unclear / transcript-dependent sections to revisit

1. **Overall transcript missing.** এই note slide-based only।

2. **Healthcare and biomedicine.** Page 7 mainly diagram। clinical safety, privacy, regulation, এবং physician responsibility-এর discussion-এর জন্য recording revisit করতে হবে।

3. **Mini-quiz official answers.** HR handbook, agent arithmetic, এবং MLLM architecture answers surrounding slide থেকে inferred, যদি explicitly shown না থাকে।

4. **Deployment slide-এর “Inversion Prompting”.** exact Week 6 term confirm করতে হবে।

5. **BLIP-2 attention masks.** Page 30 attention mask দেখায়, কিন্তু পুরো explain করে না।

6. **LLaVA frozen vs. trainable backbone.** Page 31 বলে frozen Vicuna; page 34 বলে Stage 2-তে LLM backbone trainable।

7. **LLaVA data generation.** Page 35 hint দেয় — bounding boxes এবং captions — কিন্তু full pipeline নয়।

8. **OK-VQA example.** Page 37 political-party question-এর আগে missing image placeholder আছে।

9. **POPE example.** Page 41 mouse question-এর আগে missing image placeholder আছে।

10. **Class discussion responses.** Slides actual discussion responses include করে না for:
    - generalist vs. specialist models;
    - human-in-the-loop vs. full autonomy;
    - LLaVA data generation;
    - Clever Hans effect।

---

# Quick revision checklist

Rapid self-test হিসেবে ব্যবহার করুন।

- Extractive এবং abstractive summarization-এর পার্থক্য explain করতে পারেন?
- Content correct হলেও structured JSON output কীভাবে fail করতে পারে explain করতে পারেন?
- HR handbook scenario-তে prompting, RAG, এবং fine-tuning-এর মধ্যে choose করতে পারেন?
- Code generation কেন open-ended text generation-এর চেয়ে objectively evaluate করা সহজ explain করতে পারেন?
- LLM agent-এর তিনটি component describe করতে পারেন?
- ReAct loop লিখতে পারেন?
- Token-by-token arithmetic-এর চেয়ে Python tool কেন safer explain করতে পারেন?
- MLLM architecture-এর তিনটি component list করতে পারেন?
- $D_{vision}$ এবং $D_{text}$ ব্যবহার করে modality gap explain করতে পারেন?
- CLIP কীভাবে zero-shot image classification করে explain করতে পারেন?
- Flamingo-এর Perceiver Resampler এবং cross-attention layers describe করতে পারেন?
- BLIP-2-এর frozen components এবং trainable Q-Former describe করতে পারেন?
- LLaVA-এর simple architecture এবং data-generation importance describe করতে পারেন?
- Stage 1 feature alignment এবং Stage 2 visual instruction tuning compare করতে পারেন?
- Video কেন context-window exhaustion তৈরি করে explain করতে পারেন?
- Chatty MLLM answer-এর জন্য exact-match metric কেন fail করে explain করতে পারেন?
- Visual hallucination define করতে পারেন?
- Hallucination-এর cause হিসেবে language prior এবং connector compression explain করতে পারেন?
- POPE কী test করে explain করতে পারেন?
- MLLM prompting-এ Clever Hans effect explain করতে পারেন?
