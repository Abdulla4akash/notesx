---
subject: COMP64702
chapter: 9
title: "Applications: LLMs & Multimodal"
language: en
---

# Applications of LLMs and Multimodal LLMs — Structured Study Notes

**Topic and scope:** This lecture covers applications of large language models (LLMs), moving from text-based and domain-specific applications into agents, deployment challenges, ethics, and multimodal LLMs (MLLMs), especially vision-language models (VLMs).

**Course:** [not specified in prompt]

**Lecture topic:** Applications of LLMs; Multimodal LLMs

**Primary source used:** Slide deck: `TRIM week 8 Application Multimodal no answers.pdf`.

**Transcript status:** [TRANSCRIPT MISSING] No transcript was uploaded in the conversation. These notes use the slide deck and its visual diagrams. Any areas that would require spoken explanation are marked `[TRANSCRIPT MISSING]` or `[UNCLEAR]`.

**Exam flag note:** The slides do not contain explicit phrases such as “this will be on the exam.” Items marked `[REVISION FLAG]` are high-value because they appear in learning outcomes, quiz slides, core definitions, or repeated architectural patterns. They are not claimed to be explicit lecturer exam warnings.

---

## Part 1 — Applications of LLMs

### 1. Lecture agenda and learning outcomes

#### Agenda

The first half of the lecture covers:

- the transition from foundation models to applications;
- core NLP and text-based applications;
- domain-specific transformations, especially code, healthcare, and law;
- LLMs as autonomous agents using tools and reasoning;
- deployment challenges and ethical considerations.

#### Learning outcomes

By the end of this part, students should be able to:

- map core LLM capabilities to real-world industry use cases;
- evaluate the appropriate adaptation strategy for different applications:
  - prompting;
  - retrieval-augmented generation (RAG);
  - fine-tuning;
- analyze the architecture of LLM agents and tool-augmented systems;
- critique limitations around deployment, cost, and safety.

[REVISION FLAG] The adaptation-strategy comparison — **Prompting vs. RAG vs. Fine-Tuning** — is central because it appears in the learning outcomes and in the HR handbook mini-quiz.

---

## 2. Core application 1: Advanced text summarization

### 2.1 Definition and intuition

**Text summarization** is the task of condensing longer text into a shorter version that preserves the important information.

The lecture contrasts two stages in the evolution of summarization.

#### Pre-LLM era: extractive summarization

**Intuition:** The model acts like a highlighter. It chooses important sentences from the source text and copies them into the summary.

**Slide wording:** Extractive summarization means “copying sentences.” The slides mention smaller encoder models such as BERT.

#### LLM era: abstractive summarization

**Intuition:** The model acts more like a human note-taker. It can synthesize meaning, combine ideas, and write new sentences.

**Slide wording:** LLM-era summarization is “highly abstractive summarization, capable of synthesizing meaning.”

### 2.2 Key application patterns

#### Meeting transcripts

LLMs can convert raw speech-to-text logs into structured action items.

The workflow is:

```text
Raw speech-to-text meeting transcript
        ↓
LLM summarization / structuring
        ↓
Action items, responsibilities, and next steps
```

This is useful because meeting transcripts are often long, noisy, and poorly punctuated.

[TRANSCRIPT MISSING] The slide does not give a detailed worked transcript example. Check the recording if the lecturer walked through a sample meeting-summary output.

#### Document routing

LLMs can summarize customer support tickets so they can be categorized and routed to the correct human agent.

Typical workflow:

```text
Customer support ticket
        ↓
LLM summary
        ↓
Category / issue type
        ↓
Correct human agent or support team
```

### 2.3 Evaluation connection to Week 6

The slide explicitly connects summarization evaluation to Week 6.

Evaluation methods include:

- **ROUGE**, a traditional overlap-based metric;
- **LLM-as-a-judge**, using strict evaluation prompts;
- factual consistency checking;
- hallucination prevention.

#### Key point

A summary can be fluent but factually wrong. Therefore, modern evaluation increasingly focuses on whether the summary is faithful to the source, not only whether it overlaps with a reference summary.

[REVISION FLAG] Be able to explain why ROUGE alone may be insufficient for LLM-generated summaries: ROUGE checks surface overlap, while factual consistency and hallucination require stricter semantic evaluation.

---

## 3. Core application 2: Structured data extraction

### 3.1 The problem

The slide states that **80% of enterprise data is unstructured**, including:

- emails;
- PDFs;
- reports.

This creates a practical problem: organizations need structured fields from messy documents.

### 3.2 LLM solution: Zero-shot or few-shot information extraction

**Information Extraction (IE)** is the task of extracting structured information from unstructured text.

The slide presents LLMs as a solution for **zero-shot** or **few-shot** IE.

#### Zero-shot extraction

**Intuition:** The model performs the extraction from an instruction alone, without task-specific examples.

Example instruction pattern:

```text
Extract all companies, dates, and monetary values from the following document.
Return the result as JSON.
```

#### Few-shot extraction

**Intuition:** The model is given a few examples of the desired extraction format before being asked to process a new document.

### 3.3 Named Entity Recognition (NER)

**Named Entity Recognition (NER)** extracts named entities from text.

The slide examples include:

- companies;
- monetary values;
- dates.

The slide point is that LLMs can perform this without training custom BERT models.

### 3.4 Relation extraction

**Relation extraction** identifies relationships between entities.

Slide example:

```text
Company A [ACQUIRED] Company B
```

Clean notation:

$$
\text{Company A} \xrightarrow{\text{ACQUIRED}} \text{Company B}
$$

**Intuition:** Named entity recognition identifies the objects; relation extraction identifies how those objects are connected.

### 3.5 Implementation strategy: structural prompting

The slide recommends structural prompting, especially instructing the model to output strict JSON.

A typical prompt might be:

```text
Extract the sender, subject, date, entities, and relationships from the document.
Return only valid JSON. Do not include any extra text.
```

The visual on page 4 shows:

```text
Unstructured PDF / email-like document
        ↓
LLM Extraction
        ↓
JSON-like structured output
```

The visual’s JSON example includes fields resembling:

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

[UNCLEAR] The JSON shown in the slide image appears partly artificial or garbled, especially fields such as `"sendr"` and `"date": "Meeting"`. Revisit the recording if the lecturer explained the intended schema.

### 3.6 Challenge: output parsing errors

The slide highlights a practical implementation problem: LLMs may append conversational text, such as:

```text
Here is your JSON:
```

This can break downstream code that expects raw JSON only.

[REVISION FLAG] This is a common application failure mode: the model may produce the correct information but in an invalid format.

---

## 4. Mini-Quiz 1: Application architecture

### Scenario

You are building an internal company tool to help HR instantly answer employee questions about a 200-page company benefits handbook.

### Options

A. Pretrain a new foundational model from scratch on HR documents.  
B. Use a general instruction-tuned LLM and Retrieval-Augmented Generation (RAG) with the handbook.  
C. Use a standard zero-shot prompt asking the model to guess the company policies.  
D. Supervised fine-tune (SFT) an LLM solely on the HR handbook.

### Answer

**Answer: B — use a general instruction-tuned LLM with RAG over the handbook.**

[TRANSCRIPT MISSING] The slide does not show the official answer, but the correct choice is implied by the lecture’s repeated emphasis on RAG for factual document-grounded applications.

### Reasoning

- **A is inappropriate** because pretraining a new foundation model from scratch is far too expensive and unnecessary for a 200-page handbook.
- **B is appropriate** because the system needs to retrieve exact policy information from a fixed internal document.
- **C is unsafe** because a zero-shot model without access to the handbook may guess company policies.
- **D is less appropriate** because the handbook is a knowledge source. RAG is better suited for grounding answers in a document.

[REVISION FLAG] This quiz tests when to choose **RAG** rather than prompting, pretraining, or fine-tuning.

---

## 5. Domain-specific application: Software engineering

### 5.1 Code generation and copilots

The slide says LLMs are trained heavily on sources such as GitHub and StackOverflow.

Examples of code-oriented models or tools:

- GitHub Copilot;
- CodeLlama.

Core tasks:

- autocompletion;
- writing unit tests;
- translating code between languages, for example Python to Rust.

### 5.2 Code review and bug fixing

LLMs can also support:

- detecting security vulnerabilities;
- suggesting performance optimizations;
- reviewing code;
- proposing bug fixes.

### 5.3 Why LLMs excel at code

The slide gives two reasons.

#### Reason 1: Code has strict syntax and logic

Natural language is ambiguous. Code is less ambiguous because it has formal syntax and executable semantics.

#### Reason 2: Evaluation is objective

Generated code can be evaluated by running it through:

- a compiler;
- unit test suites.

The slide says we do not need human graders in the same way as for natural-language generation.

### 5.4 Metric: Pass@k

The slide mentions the **Pass@k** metric.

**Intuition:** Generate $k$ candidate code solutions and check whether at least one passes the tests.

**Formal definition:** [TRANSCRIPT MISSING] The slide names Pass@k but does not provide the exact formula.

[REVISION FLAG] Know why code generation is easier to evaluate than many open-ended text tasks: code can be compiled and unit-tested.

---

## 6. Domain-specific application: Healthcare and biomedicine

### 6.1 Slide diagram workflow

The page 7 visual shows the following pipeline:

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

The example structured output lists possible diagnoses:

- pneumonia;
- influenza;
- COVID-19;
- bronchitis.

### 6.2 Key concept: human-in-the-loop medical LLM

**Definition:** A human-in-the-loop medical LLM is a system where the model produces an output, but a physician reviews and verifies the output before it is used.

**Intuition:** The LLM assists with structuring information and suggesting possibilities. It does not replace clinical responsibility.

[REVISION FLAG] Healthcare is a high-risk domain where the visual explicitly shows **physician review**. This is a key example of a domain where human-in-the-loop constraints matter.

[TRANSCRIPT MISSING] The slide does not include detailed spoken explanation of clinical safety, privacy, regulation, or liability. Revisit the recording for those details.

---

## 7. Class discussion: Generalist vs. specialist debate

### 7.1 Core claim from slide

The slide states that current state-of-the-art general models, such as GPT-4, often outperform smaller domain-specific fine-tuned models, such as a 7B legal-specific model, even on domain-specific tasks.

### 7.2 Discussion question

Will the future of LLM applications be dominated by:

- a few massive “God-models” accessed through APIs; or
- thousands of smaller, locally hosted, highly specialized models?

The slide says to consider:

- data privacy;
- inference costs;
- latency.

### 7.3 Trade-offs

#### Massive generalist API models

Potential advantages:

- strong general capability;
- strong reasoning;
- broad task coverage;
- may outperform smaller specialist models.

Potential disadvantages based on discussion hints:

- privacy concerns;
- cost per API call;
- latency;
- dependency on external providers.

#### Smaller locally hosted specialist models

Potential advantages based on discussion hints:

- stronger data control;
- potentially lower latency;
- potentially lower inference cost at scale;
- task-specific deployment.

Potential disadvantages:

- may underperform frontier generalist models;
- require local infrastructure;
- require model maintenance and adaptation.

[TRANSCRIPT MISSING] The slide poses this as a class discussion. It does not include the lecturer’s or students’ responses.

---

## 8. Domain-specific application: Law and finance

### 8.1 Legal sector

#### E-discovery

**Definition:** E-discovery is the process of scanning large document collections for relevance to legal proceedings, such as a subpoena.

The slide describes LLM use as scanning millions of documents for relevance to a subpoena.

#### Contract analysis

LLMs can identify:

- risky clauses;
- non-standard terms;
- missing indemnifications.

#### Risk: hallucinated legal cases

The slide explicitly names the **“hallucinated legal cases” problem**.

**Definition:** A hallucinated legal case is a fake precedent or case citation invented by a model.

**Why it matters:** Legal outputs must be verifiable. Invented precedent is dangerous because it may be treated as legal authority.

[REVISION FLAG] Law is a key example of why grounding and factual verification matter.

### 8.2 Finance sector

#### Algorithmic trading

The slide lists real-time sentiment analysis of:

- financial news;
- SEC filings.

#### Automated reporting

LLMs can synthesize quarterly earnings calls into executive summaries.

#### Adaptation technique: RAG

The slide says finance often heavily relies on RAG to ensure real-time data access.

Reason:

```text
Stock prices change by the second;
parametric memory is useless here.
```

### 8.3 Key concept: parametric memory

**Definition:** Parametric memory is information stored inside the model’s parameters during training.

**Lecture point:** Parametric memory is unsuitable for fast-changing facts such as stock prices.

**Intuition:** If a fact changes constantly, retrieve it at runtime rather than relying on what the model memorized during training.

[REVISION FLAG] Finance is a strong example of why RAG is required for time-sensitive information.

---

# Part 2 — LLMs as agents

## 9. Application paradigm shift: LLMs as agents

### 9.1 From passive responders to active agents

#### Standard LLM

A standard LLM takes text and outputs text:

$$
\text{text input} \rightarrow \text{text output}
$$

It is a passive responder.

#### Agentic LLM

An agentic LLM:

- receives a high-level goal;
- reasons about the steps required;
- interacts with external environments;
- executes actions.

### 9.2 Core components of an LLM agent

The slide gives three core components.

#### 1. Brain

**Definition:** The brain is the LLM itself.

Role:

- reasoning;
- planning.

#### 2. Memory

The slide splits memory into:

- **short-term memory**, meaning the context window;
- **long-term memory**, meaning vector databases.

The page 10 diagram shows this as “Short & Long-term Memory (Vector DB).”

#### 3. Tools

Tools are functions the LLM can call.

Examples:

- APIs;
- calculators;
- web browsers;
- code interpreters.

The page 10 diagram shows an “Autonomous AI Agent” with:

```text
Short & Long-term Memory ↔ LLM brain ↔ Planning & Reasoning Module
                           ↓
                      Tools & APIs
          Calculator, Web Browser, Code Interpreter
```

[REVISION FLAG] Know the three components: **Brain, Memory, Tools**.

---

## 10. How agents work: ReAct prompting

### 10.1 Definition

**ReAct** stands for **Reasoning and Acting**.

The slide defines ReAct as a prompting paradigm that intertwines:

- chain-of-thought reasoning;
- environmental actions.

### 10.2 ReAct loop

The slide gives the loop:

1. **Thought**  
   The model reasons about what to do next based on the user prompt.

2. **Action**  
   The model decides to call an external tool.

   Example:

   ```text
   SearchWikipedia("Eiffel Tower")
   ```

3. **Observation**  
   The tool returns data to the model.

4. **Repeat**  
   The loop repeats until the goal is achieved.

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

### 10.4 Why ReAct is powerful

The slide says ReAct overcomes the LLM’s inability to:

- do math reliably internally;
- know current events.

It does this by allowing the model to use:

- a calculator;
- a search engine.

The page 11 visual shows a cycle:

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

[REVISION FLAG] ReAct is a key mechanism for explaining how tool-using agents differ from ordinary text-only prompt-response systems.

---

## 11. Multi-agent systems

### 11.1 Definition

A **multi-agent system** uses multiple LLM agents with distinct personas and tools that communicate with one another.

The slide contrasts this with one massive prompt trying to do everything.

### 11.2 Example: software development system

The slide gives a three-agent workflow.

#### Agent 1: Product Manager

Writes the system requirements.

#### Agent 2: Software Engineer

Writes the Python code based on the Product Manager’s requirements.

#### Agent 3: QA Tester

Reviews the Software Engineer’s code, finds bugs, and sends it back for revision.

### 11.3 Benefits

The slide lists:

- separation of concerns;
- self-reflection and self-correction through simulated debate.

### 11.4 Intuition

Instead of forcing one prompt to be product manager, engineer, and tester at once, the system decomposes the workflow into specialized roles.

---

## 12. Mini-Quiz 2: Agents and hallucinations

### Question

You ask an LLM agent to calculate:

$$
345{,}678 \times 987{,}654
$$

Which option describes the safest agentic approach?

A. Prompt the LLM with “Let’s think step-by-step” to calculate the math token-by-token.  
B. Provide the LLM with a Python interpreter tool, instruct it to write a Python script to multiply the numbers, execute it, and return the printed observation.  
C. Fine-tune the LLM on thousands of multiplication tables.

### Answer

**Answer: B — use the Python interpreter tool.**

[TRANSCRIPT MISSING] The slide does not show the official answer, but the surrounding ReAct/tool-use material implies B.

### Reasoning

Exact arithmetic is better delegated to a reliable tool.

```text
LLM agent receives arithmetic task
        ↓
LLM writes or calls Python multiplication
        ↓
Python interpreter executes exact computation
        ↓
LLM returns observed result
```

[REVISION FLAG] The point of the quiz is not the multiplication itself; it is the distinction between internal token generation and external tool execution.

---

# Part 3 — Deployment bottlenecks and ethics

## 13. Deployment bottlenecks: Why are LLMs not everywhere yet?

The lecture gives three major deployment hurdles.

### 13.1 Inference cost

Running a 70B-parameter model costs significant GPU compute per token.

The slide states that generative AI is structurally more expensive than traditional software.

**Intuition:** A large generative model must repeatedly compute the next token, and each token requires expensive model inference.

### 13.2 Latency

LLMs generate text autoregressively, token by token:

$$
x_1, x_2, x_3, \dots, x_t
$$

The slide says this is slow, and high latency degrades user experience in real-time applications such as voice assistants.

### 13.3 Reliability and evaluation

The slide contrasts traditional software and LLMs.

#### Traditional software

Traditional software is deterministic:

$$
\text{Input A} \rightarrow \text{Output B}
$$

The same input reliably gives the same output.

#### LLMs

LLMs are probabilistic. Outputs can vary, and they can fail in hard-to-predict ways.

Therefore, the slide says continuous monitoring and robust evaluation pipelines are strictly required.

The slide mentions “Inversion Prompting techniques covered in Week 6.”

[UNCLEAR] Confirm whether “Inversion Prompting” is the exact term used in Week 6 or whether this is a slide typo / OCR issue.

[REVISION FLAG] Be able to contrast deterministic software with probabilistic LLM systems and explain why monitoring/evaluation pipelines are required.

---

## 14. Ethical and safety considerations in applications

### 14.1 Bias and fairness

The slide says models amplify biases present in their training data.

Example:

- resume-screening systems may unfairly penalize certain demographics.

**Definition:** Bias amplification is when a model reproduces or worsens biases present in its training data.

### 14.2 Security: prompt injection

User-facing applications, such as customer service bots, are vulnerable to prompt injection.

**Definition:** Prompt injection is an attack where a user manipulates the model’s instructions, often trying to override the intended system behavior.

Slide examples of harmful effects:

- leaking data;
- outputting profanity.

### 14.3 Copyright and IP

The slide says generative applications risk reproducing copyrighted code or text from their pretraining datasets.

**Key point:** Even if a system appears to generate new text or code, it may reproduce protected material from training data.

---

## 15. Discussion: Human-in-the-loop vs. full autonomy

### 15.1 Current state

The slide says most successful LLM applications currently act as **copilots**.

A copilot augments a human worker who reviews the final output.

### 15.2 Industry direction

The slide says industry is pushing toward **agents**:

- full autonomy;
- workflow execution;
- operation while humans sleep.

### 15.3 Discussion prompt

The slide asks:

- In which industries is full LLM autonomy acceptable today?
- Where must we permanently maintain a human-in-the-loop constraint?

[TRANSCRIPT MISSING] The slide does not include the class discussion answer.

[REVISION FLAG] Connect this to healthcare and law: both are examples where human review and factual grounding are important.

---

## 16. Summary of LLM applications section

The slide summary states:

- LLM applications extend base models using prompting, RAG, and tool use.
- Core NLP tasks such as summarization and extraction are now largely solved by prompting.
- Domain applications such as code, medical, and legal applications require strict adherence to facts and often use RAG.
- Agents represent the frontier: models that use tools, reason via ReAct, and interact with the environment.
- Deployment is constrained by compute cost, latency, and safety evaluation.

---

# Part 4 — Multimodal LLMs

## 17. Agenda and learning outcomes

### 17.1 Agenda

The second half of the lecture covers:

- motivation for multimodality;
- core MLLM architecture and the modality gap;
- landmark models:
  - CLIP;
  - Flamingo;
  - BLIP-2;
  - LLaVA;
- training pipelines, especially visual instruction tuning;
- multimodal prompting and evaluation.

### 17.2 Learning outcomes

Students should be able to:

- understand the structural components of an MLLM:
  - encoder;
  - projector;
  - LLM backbone;
- analyze the two-stage training pipeline for modern vision-language models;
- apply multimodal prompting techniques using interleaved text and image;
- evaluate MLLMs using modern benchmarks;
- identify visual hallucination risks.

[REVISION FLAG] The architecture triplet — **encoder, projector, LLM backbone** — is one of the most important revision targets.

---

## 18. What is a Multimodal LLM?

### 18.1 Formal definition from slide

An **MLLM** is a language model capable of receiving, reasoning over, and sometimes generating multiple data modalities.

Modalities listed:

- text;
- images;
- audio;
- video.

### 18.2 Goal

The goal is to:

1. retain the reasoning and instruction-following capabilities of the LLM;
2. give the LLM “eyes” and “ears” to perceive the real world.

### 18.3 Lecture focus

The lecture focuses on **Vision-Language Models (VLMs)**.

Reason given:

- VLMs are currently the most researched and deployed subclass of MLLMs.

---

## 19. Core architecture of an MLLM

The lecture states that virtually all modern MLLMs share a **tripartite**, or three-part, architecture.

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

**Definition:** The vision encoder extracts high-dimensional feature representations from raw image pixels.

Example:

- Vision Transformer (ViT).

**Intuition:** The vision encoder converts image pixels into a representation that captures visual content.

### 19.2 Component 2: Connector / projection layer

**Definition:** The connector translates visual features into the LLM’s embedding space.

**Intuition:** The vision encoder and LLM use different representational spaces. The connector acts as a translator.

### 19.3 Component 3: LLM backbone

**Definition:** The LLM backbone is the reasoning and generation component.

It processes translated visual tokens alongside text tokens and generates a text response.

Examples:

- LLaMA;
- Vicuna.

**Key distinction:** The vision encoder perceives; the LLM backbone reasons and generates.

[REVISION FLAG] Know which component performs reasoning: the **LLM backbone**, not the vision encoder or projector.

---

## 20. Component 1 in detail: CLIP as vision encoder

### 20.1 Definition

**CLIP** stands for **Contrastive Language-Image Pretraining**.

The slide describes CLIP as a foundational OpenAI model that maps images and text into the same vector space.

Reference on slide:

- Radford et al., “Learning Transferable Visual Models From Natural Language Supervision,” ICML 2021.

### 20.2 Training data

The slide says CLIP was trained on **400 million image-caption pairs**.

### 20.3 Contrastive learning objective

The slide says CLIP uses a contrastive loss function.

The objective is to maximize the cosine similarity between:

- the embedding of an image, e.g. a dog;
- the embedding of the correct text description, e.g. “a picture of a dog.”

Clean notation:

$$
\text{maximize } \cos(e_{\text{image}}, e_{\text{text correct}})
$$

**Formal contrastive loss:** [TRANSCRIPT MISSING] The slide does not provide the exact loss formula.

### 20.4 CLIP architecture overview from page 23 visual

The page 23 diagram shows three stages.

#### Stage 1: Contrastive pre-training

- Text encoder embeds captions.
- Image encoder embeds images.
- The model compares all image-text pairs in a batch.
- Correct image-text pairs should have high similarity.

The diagram shows a similarity matrix comparing image embeddings:

$$
I_1, I_2, \dots, I_N
$$

against text embeddings:

$$
T_1, T_2, \dots, T_N
$$

The matching diagonal pairs are the correct image-text pairs.

#### Stage 2: Create dataset classifier from label text

Class labels such as:

- plane;
- car;
- dog;
- bird;

are converted into natural-language prompts:

```text
a photo of a {object}
```

These prompts are passed through the text encoder.

#### Stage 3: Use for zero-shot prediction

For a new image:

1. encode the image;
2. encode the candidate label prompts;
3. compare image embedding with text embeddings;
4. choose the label prompt with the highest similarity.

The diagram example predicts:

```text
a photo of a dog.
```

### 20.5 Why CLIP matters for MLLMs

The slide says CLIP’s vision encoder can be frozen and used as the “eyes” for LLMs.

Reason:

- CLIP’s visual features are already semantically aligned with human language.

---

## 21. Component 2 in detail: Connector and modality gap

### 21.1 The modality gap

The slide defines the problem:

- CLIP vision encoder outputs vectors of size $D_{vision}$;
- the LLM expects word embeddings of size $D_{text}$;
- the two spaces do not naturally communicate.

This mismatch is the **modality gap**.

### 21.2 Definition

**Modality gap:** The representational mismatch between features from different modalities, such as visual features and language embeddings.

### 21.3 Solution

Introduce a lightweight trainable neural network layer between the vision encoder and the LLM.

Clean mapping:

$$
\mathbb{R}^{D_{vision}} \rightarrow \mathbb{R}^{D_{text}}
$$

This connector maps visual representations into the embedding space expected by the language model.

### 21.4 Connector types

#### Linear projection

A simple weight matrix.

Used in early LLaVA.

#### MLP

A multi-layer perceptron.

The slide specifies a 2-layer network for better translation.

#### Q-Former / Perceiver Resampler

These compress visual tokens to save context-window space.

Used in:

- BLIP-2;
- Flamingo.

[REVISION FLAG] Be able to explain why a connector is necessary: $D_{vision}$ and $D_{text}$ are different spaces.

---

## 22. Mini-Quiz 1: Architecture check

### Question

In a standard vision-language MLLM like LLaVA, which component is primarily responsible for performing complex logic, math, and generating the final conversational response?

A. The Vision Transformer (ViT)  
B. The Contrastive Loss Function  
C. The LLM Backbone, e.g. Vicuna/LLaMA  
D. The Projection Layer

### Answer

**Answer: C — the LLM Backbone.**

[TRANSCRIPT MISSING] The slide does not show the official answer, but the preceding architecture slide clearly states that the LLM backbone is “the brain.”

### Reasoning

- The Vision Transformer extracts visual features.
- The contrastive loss function is a training objective, not the reasoning module.
- The projection layer translates visual features into language embeddings.
- The LLM backbone performs reasoning and generates the conversational response.

[REVISION FLAG] This quiz tests the roles of the three components in MLLM architecture.

---

# Part 5 — Landmark multimodal models

## 23. Landmark model 1: Flamingo

### 23.1 Reference

The slide cites:

- Alayrac et al., “Flamingo: a Visual Language Model for Few-Shot Learning,” NeurIPS 2022.

### 23.2 Breakthrough

DeepMind’s Flamingo was the first model to demonstrate highly effective **interleaved image-text prompting**.

### 23.3 Architecture innovation 1: Perceiver Resampler

The Perceiver Resampler compresses thousands of image tokens down to **64 tokens**.

Purpose:

- save computational cost;
- reduce the burden of many visual tokens.

### 23.4 Architecture innovation 2: Cross-attention layers

Instead of feeding the image only at the beginning of the prompt, Flamingo injects visual information directly into deep layers of the LLM.

Mechanism named on slide:

- cross-attention layers.

### 23.5 Impact

Flamingo proved that MLLMs could perform **few-shot in-context learning** with images, analogous to GPT-3’s few-shot learning with text.

### 23.6 Flamingo architecture overview from page 27 visual

The page 27 diagram distinguishes:

- pretrained and frozen components;
- trained-from-scratch components.

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

The visual shows two image inputs, dog and cat, processed through vision encoders and Perceiver Resamplers. These feed gated cross-attention dense layers inserted between language-model blocks.

The visual also shows interleaved visual/text data, roughly:

```text
<image> This is a very cute dog. <image> This is ...
```

The example output is:

```text
a very serious cat.
```

### 23.7 Flamingo results overview from page 28 visual

The page 28 chart compares Flamingo 80B with 32 shots against previous zero/few-shot state of the art across multiple tasks.

The visual pattern shows:

- Flamingo 80B improves over previous zero/few-shot state of the art on many tasks;
- model size matters, with Flamingo-80B outperforming smaller Flamingo variants;
- more shots improve aggregated performance.

The right-hand chart plots aggregated performance against number of shots for:

- Flamingo-80B;
- Flamingo-9B;
- Flamingo-3B.

The 80B curve is highest.

[TRANSCRIPT MISSING] The chart includes many dataset-specific values. Check the recording if the lecturer highlighted particular benchmarks.

---

## 24. Landmark model 2: BLIP-2

### 24.1 Reference

The slide cites:

- Li et al., “BLIP-2: Bootstrapping Language-Image Pre-training...” ICML 2023.

### 24.2 Efficiency breakthrough

Training massive LLMs from scratch is expensive.

BLIP-2 freezes both:

- the vision encoder;
- the LLM backbone.

### 24.3 Q-Former

**Q-Former** stands for **Querying Transformer**.

**Definition:** A lightweight, trainable module that learns to extract only the most relevant visual features required by the LLM.

### 24.4 Result

The slide says BLIP-2 achieved state-of-the-art performance using significantly fewer trainable parameters.

The slide also says this “democratized” MLLM research for university labs.

### 24.5 BLIP-2 diagram details from page 30 visual

The page 30 visual is dense and shows several parts.

#### Top: Q-Former pretraining

Flow:

```text
Input Image
    ↓
Frozen Image Encoder
    ↓
Q-Former
```

The Q-Former uses learned query tokens and processes visual information through:

- self-attention;
- cross-attention;
- feed-forward layers.

The diagram lists three objectives:

1. **Image-Text Matching**
2. **Image-Text Contrastive Learning**
3. **Image-Grounded Text Generation**

#### Attention masks

The diagram labels:

- Q: query token positions;
- T: text token positions;
- masked and unmasked positions.

It shows three masking schemes:

1. **Bi-directional self-attention mask** for image-text matching.
2. **Multi-modal causal self-attention mask** for image-grounded text generation.
3. **Uni-modal self-attention mask** for image-text contrastive learning.

[UNCLEAR] The slide image shows the masks but does not fully explain the mechanics. Revisit the recording for the lecturer’s explanation.

#### Bottom: bootstrapping from large language models

The lower part shows two variants.

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

The visual example includes the prefix text:

```text
a cat
```

and the suffix text:

```text
wearing sunglasses
```

---

## 25. Landmark model 3: LLaVA

### 25.1 Definition

**LLaVA** stands for **Large Language-and-Vision Assistant**.

The slide describes LLaVA as the open-source pioneer of **Visual Instruction Tuning**.

Reference on slide:

- Liu et al., “Visual Instruction Tuning,” NeurIPS 2023.

### 25.2 Architecture

The slide emphasizes simplicity.

LLaVA uses:

- a frozen CLIP encoder;
- a simple linear or MLP projection layer;
- a frozen Vicuna LLM, based on LLaMA.

### 25.3 Why LLaVA succeeded

The slide says:

```text
The magic wasn't in the architecture; it was in the data generation pipeline.
```

Specifically, LLaVA used GPT-4 to generate multimodal training data.

### 25.4 LLaVA architecture overview from page 32 visual

The page 32 visual uses the following notation.

#### Image side

Image input:

$$
X_v
$$

Vision encoder produces visual features:

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

The language model is denoted:

$$
f_\phi
$$

It receives visual and language representations and generates the language response:

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

[UNCLEAR / POSSIBLE SLIDE INCONSISTENCY] One slide says LLaVA uses a frozen Vicuna LLM, but the Stage 2 training slide says the LLM backbone is trainable during visual instruction tuning. Check the recording for clarification.

---

# Part 6 — MLLM training pipeline

## 26. Stage 1: Feature alignment pretraining

Training an MLLM like LLaVA happens in two distinct stages.

Stage 1 is **Feature Alignment Pretraining**.

### 26.1 Goal

Teach the LLM to understand the vision encoder’s “language.”

### 26.2 Data

The slide says Stage 1 uses millions of simple image-caption pairs.

Example dataset:

- CC3M.

### 26.3 Frozen components

- Vision encoder;
- LLM backbone.

### 26.4 Trainable component

- Projection layer only.

### 26.5 Analogy from slide

The slide compares this to:

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

**Formal loss:** [TRANSCRIPT MISSING] The slide does not specify the exact training loss.

---

## 27. Stage 2: Visual Instruction Tuning

Stage 2 is **Visual Instruction Tuning**, also called **Multimodal SFT**.

### 27.1 Goal

Teach the model to follow complex human instructions about images.

Slide example:

```text
Why is this meme funny?
```

### 27.2 Data

The slide says Stage 2 uses approximately **150k** highly detailed instruction-following multimodal conversations.

### 27.3 Frozen component

- Vision encoder.

### 27.4 Trainable components

- Projection layer;
- LLM backbone.

### 27.5 Connection to Week 6

The slide explicitly connects Visual Instruction Tuning to Week 6’s standard **Supervised Fine-Tuning (SFT)**.

Analogy:

```text
Standard SFT teaches text LLMs to be assistants.
Visual Instruction Tuning teaches MLLMs to be visual assistants.
```

### 27.6 Stage 1 vs. Stage 2 comparison

| Stage | Goal | Data | Frozen | Trainable |
|---|---|---|---|---|
| Stage 1: Feature Alignment Pretraining | Teach LLM to understand vision encoder features | Millions of image-caption pairs, e.g. CC3M | Vision encoder + LLM backbone | Projection layer only |
| Stage 2: Visual Instruction Tuning / Multimodal SFT | Teach model to follow complex human instructions about images | ~150k multimodal instruction-following conversations | Vision encoder | Projection layer + LLM backbone |

[REVISION FLAG] The two-stage training pipeline is a major learning outcome.

---

## 28. Class discussion: Data generation for LLaVA

### 28.1 Problem

In 2023, the LLaVA authors needed **150,000 conversational Q&A pairs about images**.

Human labeling was too expensive.

### 28.2 Solution direction

They used a text-only model, GPT-4, to generate data for the multimodal model.

### 28.3 Discussion question

If GPT-4 at the time was text-only and could not see images, how did the authors use it to generate accurate and detailed visual Q&A data?

The slide hint says:

- bounding boxes;
- captions.

### 28.4 Answer from slide hint

The image information was converted into text form using captions and bounding-box/object descriptions. GPT-4 could then use those textual descriptions to generate multimodal-style conversations.

[TRANSCRIPT MISSING] The slide gives the hint but not the full pipeline details. Revisit the recording for the lecturer’s explanation.

---

# Part 7 — Beyond images: audio and video

## 29. Video MLLMs

### 29.1 Video as a sequence of images

Video MLLMs, such as Video-LLaVA, treat video as a sequence of frames.

### 29.2 Challenge: context window exhaustion

If one image produces many visual tokens, then video multiplies the token cost.

The slide gives:

$$
30 \text{ frames of video} = 30 \times \text{visual tokens}
$$

This can exhaust the context window.

[REVISION FLAG] Video is harder than image input because visual tokens multiply across frames.

---

## 30. Audio encoders

The slide says architectures like Whisper, an audio transformer, can be projected into the LLM just like CLIP.

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

The slide lists emerging models such as:

- GPT-4o;
- Gemini 1.5 Pro.

The slide says these models are trained natively on multiple modalities from scratch.

They bypass the strict:

```text
Encoder → Projector
```

pipeline for more organic cross-modal understanding.

[TRANSCRIPT MISSING] The slide does not provide architectural details for these any-to-any models.

---

# Part 8 — Evaluating MLLMs

## 32. Traditional benchmarks

The lecture asks: how do we know whether an MLLM is good?

It first introduces traditional benchmarks.

### 32.1 VQAv2

**VQAv2** stands for Visual Question Answering.

The slide describes it as using short factual questions.

Example:

```text
What color is the car?
```

Drawback:

- too simple for modern MLLMs.

### 32.2 OK-VQA

**OK-VQA** stands for Outside Knowledge Visual Question Answering.

It requires world knowledge not present in the image.

Slide example:

```text
Which political party does this person belong to?
```

[UNCLEAR] The parsed slide shows a missing image placeholder before the question. Check the original slide / recording if the specific image matters.

### 32.3 Image captioning: COCO

The model generates descriptive text for images.

Evaluation uses n-gram overlap metrics such as:

- CIDEr;
- BLEU.

### 32.4 Limitation of traditional benchmarks

Traditional metrics can be too rigid because they often compare surface text strings.

This becomes a problem for instruction-tuned MLLMs, which may answer correctly but in a full conversational sentence.

---

## 33. Comprehensive benchmarks

Modern MLLMs are conversational, so old benchmarks may fail to capture their abilities.

### 33.1 MME

**MME** stands for Multimodal Evaluation.

It tests:

#### Perception

- color;
- position;
- count.

#### Cognition

- commonsense;
- math;
- code.

It evaluates robustness using Yes/No prompts.

### 33.2 MM-Vet

**MM-Vet** evaluates complex, multi-turn multimodal dialogue.

It uses LLM-as-a-judge, usually GPT-4V, to grade MLLM responses based on:

- accuracy;
- helpfulness;
- reasoning.

[REVISION FLAG] Know the difference between old string-matching style benchmarks and newer conversational / judge-based benchmarks.

---

## 34. Mini-Quiz 2: Evaluation constraints

### Scenario

You evaluate a new MLLM on VQAv2.

Ground truth answer:

```text
Red
```

Model answer:

```text
The car shown in the image is red.
```

Question: what happens under strict traditional string-matching metrics such as exact match?

A. Score is 100%, correct.  
B. Score is 0%, incorrect.

### Answer

**Answer: B — score is 0%.**

The slide gives the answer directly.

### Insight

Instruction-tuned MLLMs are “chatty.” They may answer in complete sentences, but traditional exact-match benchmarks expect short strings.

Therefore, a semantically correct answer can receive zero under strict exact matching.

This is why LLM-as-a-judge is now used for MLLM evaluation.

[REVISION FLAG] This is a clear benchmark pitfall: correct meaning does not always equal correct benchmark string.

---

# Part 9 — Hallucination in MLLMs

## 35. Visual hallucination

### 35.1 Formal definition from slide

**Visual hallucination** occurs when an MLLM confidently describes objects, attributes, or relationships that do not exist in the provided image.

### 35.2 Intuition

The model says it sees something that is not actually in the image.

This is different from ordinary text hallucination because the error is specifically a mismatch between the generated answer and the visual evidence.

[REVISION FLAG] Be able to define visual hallucination exactly.

---

## 36. Why visual hallucination happens

The slide gives two causes.

### 36.1 Language prior

The LLM backbone is so powerful that it can override the visual encoder.

Slide example:

```text
The model sees a dining table
        ↓
It hallucinates chairs
        ↓
Because textually, chairs usually accompany tables
```

**Definition:** A language prior is the model’s learned expectation from text patterns.

**Intuition:** If many training texts mention chairs with tables, the LLM may generate “chairs” even when the image does not show them.

### 36.2 Connector compression

Small visual details can be lost when reducing megapixel images to a few hundred tokens.

**Intuition:** The image contains much more raw information than the small set of visual tokens passed into the language model.

[REVISION FLAG] The two causes to remember are **language prior** and **connector compression**.

---

## 37. Evaluating hallucinations: POPE

### 37.1 Definition

**POPE** stands for **Polling-based Object Probing Evaluation**.

It is a benchmark specifically designed to expose visual hallucinations.

Reference on slide:

- Li et al., “Evaluating Object Hallucination in Large Vision-Language Models,” EMNLP 2023.

### 37.2 Methodology

POPE frames evaluation as binary Yes/No questions.

It uses adversarial probing by asking about objects that:

- frequently co-occur with objects in the image;
- are missing from the specific image.

Slide example pattern:

```text
Is there a mouse in the image?
```

[UNCLEAR] The parsed slide shows a missing image placeholder before the mouse example. Revisit the slide/recording for the exact context.

### 37.3 Finding

The slide says many early MLLMs failed POPE catastrophically, defaulting to “Yes” because of statistical priors.

[REVISION FLAG] POPE directly tests whether the model relies on visual evidence or on learned co-occurrence priors.

---

## 38. Class discussion: The Clever Hans effect

### 38.1 Context

Clever Hans was a horse that appeared to do math but was actually reading subtle body-language cues from its trainer.

### 38.2 Discussion question

Are MLLMs truly seeing the image, or are they experiencing a Clever Hans effect where the user’s prompt gives away the answer?

Slide example prompt:

```text
What is the man holding in his left hand?
```

This prompt implies:

- there is a man;
- the man has a left hand visible or relevant;
- the man is holding something.

### 38.3 Key issue

The model may answer based on assumptions embedded in the prompt rather than visual perception.

### 38.4 Prompt-design implication

The slide asks how prompts can be designed to prevent this.

[TRANSCRIPT MISSING] The slide does not include the discussion answer. Revisit the recording for the lecturer’s suggested prompt designs.

---

# Consolidated key concepts

## Prompting

Using instructions and/or examples in the prompt to make an LLM perform a task without changing model weights.

Used in the lecture for:

- summarization;
- structured extraction;
- many core NLP tasks.

## Retrieval-Augmented Generation (RAG)

A system design where the model retrieves relevant external information and uses that information to answer.

Used in the lecture for:

- HR handbook Q&A;
- finance, because stock prices and data change rapidly;
- law, to reduce hallucinated precedent;
- healthcare, as part of medical LLM systems.

## Fine-tuning / SFT

Training the model further on supervised examples.

Lecture connections:

- standard SFT from Week 6 teaches text LLMs to behave like assistants;
- visual instruction tuning teaches MLLMs to behave like visual assistants.

## Tool use

Giving an LLM access to external functions such as calculators, APIs, browsers, or Python interpreters.

Used for:

- agentic systems;
- exact arithmetic;
- current information retrieval;
- code execution.

## Agent

An LLM-based system that takes a high-level goal, reasons about steps, uses memory/tools, and acts in an environment.

## ReAct

A prompting paradigm combining reasoning and acting:

```text
Thought → Action → Observation → repeat
```

## Multi-agent system

A system with multiple LLM agents that have different roles/personas/tools and communicate with each other.

## MLLM

A language model capable of receiving, reasoning over, and sometimes generating multiple modalities such as text, images, audio, and video.

## Vision encoder

The component that converts image pixels into visual feature representations.

## Connector / projector

The component that maps visual features into the LLM’s embedding space.

## LLM backbone

The reasoning and generation component of an MLLM.

## Modality gap

The mismatch between representations from different modalities, especially visual feature vectors and text embeddings.

## CLIP

A contrastively trained image-text model that maps images and text into a shared vector space. Used as a frozen vision encoder in many MLLMs.

## Flamingo

A landmark MLLM using interleaved image-text prompting, Perceiver Resampler, and cross-attention layers.

## BLIP-2

A landmark MLLM that freezes both the vision encoder and LLM backbone, training a lightweight Q-Former.

## LLaVA

An open-source visual instruction tuning model using CLIP, a projection layer, and a Vicuna/LLaMA-based LLM.

## Visual hallucination

An MLLM confidently describes objects, attributes, or relationships absent from the provided image.

## POPE

Polling-based Object Probing Evaluation, a benchmark for visual hallucination using adversarial Yes/No object questions.

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

The lecture point is that the safest agentic approach is to use a Python interpreter tool.

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

LLMs generate one token at a time, creating latency.

## Deterministic software contrast

$$
\text{Input A} \rightarrow \text{Output B}
$$

Traditional software is deterministic; LLMs are probabilistic.

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
- $X_a$: language response.

## Video token scaling

$$
30 \text{ frames of video} = 30 \times \text{visual tokens}
$$

---

# Worked examples from the lecture slides

## Example 1: HR handbook Q&A

**Problem:** Build a tool to answer employee questions about a 200-page benefits handbook.

**Correct architecture:** Instruction-tuned LLM + RAG over the handbook.

**Reason:** The answer must be grounded in a specific internal document.

---

## Example 2: Structured extraction from documents

**Input:** unstructured emails, PDFs, or reports.

**Process:** LLM extracts named entities and relationships.

**Output:** strict JSON.

**Failure mode:** The model may prepend text such as `Here is your JSON:`, breaking downstream parsers.

---

## Example 3: Code generation

Tasks:

- autocomplete code;
- write unit tests;
- translate Python to Rust;
- detect vulnerabilities;
- suggest optimizations.

Evaluation:

- compile the code;
- run unit tests;
- use Pass@k.

---

## Example 4: Healthcare differential diagnosis

**Input:** Patient EHR and clinical notes.

**System:** Medical LLM plus RAG knowledge base.

**Output:** Structured differential diagnosis, including examples such as pneumonia, influenza, COVID-19, and bronchitis.

**Safety layer:** Human-in-the-loop physician review verifies output.

---

## Example 5: ReAct tool use for arithmetic

**Problem:** Calculate

$$
345{,}678 \times 987{,}654
$$

**Unsafe approach:** Make the LLM calculate token-by-token.

**Safe agentic approach:** Use a Python interpreter tool and return the observed result.

---

## Example 6: CLIP zero-shot classification

Labels:

- plane;
- car;
- dog;
- bird.

Prompt template:

```text
a photo of a {object}
```

Prediction method:

1. encode the image;
2. encode each label prompt;
3. compute similarity;
4. choose highest similarity.

---

## Example 7: Flamingo interleaved image-text prompting

The page 27 visual shows interleaved inputs:

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

- answer is semantically correct;
- benchmark expects exact string.

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

- language prior that chairs usually accompany tables.

---

## Example 10: Clever Hans prompt leakage

Prompt:

```text
What is the man holding in his left hand?
```

Problem:

- the prompt itself implies a man is present;
- the prompt implies he is holding something;
- the model may use these assumptions rather than visual evidence.

---

# Connections to earlier lectures and broader applications

## Week 6: evaluation

Summarization evaluation connects to Week 6 through:

- ROUGE;
- LLM-as-a-judge;
- strict evaluation prompts;
- factual consistency checks;
- hallucination prevention.

## Week 6: SFT

Visual instruction tuning connects to standard SFT:

```text
Text SFT teaches text LLMs to be assistants.
Visual Instruction Tuning teaches MLLMs to be visual assistants.
```

## Deployment and engineering connection

The lecture connects model capabilities to real-world constraints:

- inference cost;
- latency;
- reliability;
- monitoring;
- safety evaluation.

## Domain grounding connection

RAG appears repeatedly as the solution for factual, domain-grounded applications:

- HR handbook Q&A;
- healthcare;
- law;
- finance.

---

# Unclear / transcript-dependent sections to revisit

1. **Transcript missing overall.** These notes are slide-based only.

2. **Healthcare and biomedicine.** Page 7 is mainly a diagram. Revisit the recording for discussion of clinical safety, privacy, regulation, and physician responsibility.

3. **Mini-quiz official answers.** The HR handbook, agent arithmetic, and MLLM architecture answers are inferred from surrounding slides unless explicitly shown.

4. **“Inversion Prompting” on deployment slide.** Confirm the exact Week 6 term.

5. **BLIP-2 attention masks.** Page 30 shows attention masks, but the slide does not fully explain them.

6. **LLaVA frozen vs. trainable backbone.** Page 31 says frozen Vicuna; page 34 says the LLM backbone is trainable during Stage 2.

7. **LLaVA data generation.** Page 35 gives hints — bounding boxes and captions — but not the full pipeline.

8. **OK-VQA example.** Page 37 has a missing image placeholder before the political-party question.

9. **POPE example.** Page 41 has a missing image placeholder before the mouse question.

10. **Class discussion responses.** The slides do not include the actual discussion responses for:
    - generalist vs. specialist models;
    - human-in-the-loop vs. full autonomy;
    - LLaVA data generation;
    - Clever Hans effect.

---

# Quick revision checklist

Use this as a rapid self-test.

- Can you explain the difference between extractive and abstractive summarization?
- Can you explain why structured JSON output can fail even when the content is correct?
- Can you choose between prompting, RAG, and fine-tuning for the HR handbook scenario?
- Can you explain why code generation is objectively easier to evaluate than open-ended text generation?
- Can you describe the three components of an LLM agent?
- Can you write the ReAct loop?
- Can you explain why a Python tool is safer than token-by-token arithmetic?
- Can you list the three components of an MLLM architecture?
- Can you explain the modality gap using $D_{vision}$ and $D_{text}$?
- Can you explain how CLIP performs zero-shot image classification?
- Can you describe Flamingo’s Perceiver Resampler and cross-attention layers?
- Can you describe BLIP-2’s frozen components and trainable Q-Former?
- Can you describe LLaVA’s simple architecture and data-generation importance?
- Can you compare Stage 1 feature alignment with Stage 2 visual instruction tuning?
- Can you explain why video creates context-window exhaustion?
- Can you explain why exact-match metrics fail for chatty MLLM answers?
- Can you define visual hallucination?
- Can you explain language prior and connector compression as causes of hallucination?
- Can you explain what POPE tests?
- Can you explain the Clever Hans effect in MLLM prompting?
