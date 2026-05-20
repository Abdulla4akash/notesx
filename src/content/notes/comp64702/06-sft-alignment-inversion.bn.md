---
subject: COMP64702
chapter: 6
title: "SFT, Alignment & Inversion"
language: bn
---

# Supervised Fine-Tuning, Alignment, Reasoning Models, and Inversed Instruction Tuning — বাংলা স্টাডি নোটস

**বিষয় ও পরিসর:** এই লেকচারটি large language model-এর **post-training** নিয়ে: supervised fine-tuning, instruction tuning, RLHF/PPO/DPO/GRPO-এর মতো human alignment পদ্ধতি, Mixture-of-Experts scaling, reasoning models, এবং model-specific NLG evaluation prompt তৈরির জন্য inversed instruction tuning / inversion learning। broader LLM pipeline-এ এটি raw pretraining-এর পরের ধাপ, যেখানে মডেলকে useful, controllable, aligned, scalable, এবং evaluable করা হয়।

**Course:** [UNCLEAR: আপলোড করা উপকরণে course নির্দিষ্ট করা নেই]  
**Lecture topic:** Supervised Fine-Tuning (SFT), Alignment, Reasoning Models, and Inversed Instruction Tuning  
**Lecturer:** Jingyuan Sun, Department of Computer Science, The University of Manchester  
**Sources used:** আপলোড করা slide deck `TRIM_week6_SFT_alignment_inversion_reduced45_with_scripts-1.pdf`। নিচের page reference-গুলো এই slide deck-কে নির্দেশ করে।  
**Transcript status:** [UNCLEAR: আলাদা transcript অনুপস্থিত] এখানে পাওয়া আপলোড করা উপকরণের মধ্যে আলাদা auto-generated transcript অন্তর্ভুক্ত ছিল না। এই নোটগুলো slide text, diagram, table, এবং embedded visual content ব্যবহার করে তৈরি। রেকর্ডিংয়ের spoken elaboration, example, এবং exam cue যাচাই করা যায়নি।

---

## 1. Lecture roadmap

### 1.1 Main agenda

লেকচারটি পাঁচটি প্রধান theme ঘিরে সাজানো, যা page 2-এ দেখানো হয়েছে:

1. **The foundation:** Transformer architecture এবং training paradigms।
2. **From raw models to useful assistants:** instruction tuning।
3. **Human alignment:** RLHF, PPO, এবং DPO।
4. **Mixture of Experts models।**
5. **Reasoning models:** Chain-of-Thought and beyond।

Page 30 থেকে দ্বিতীয় বড় অংশ শুরু হয় এবং সেটি **Inversed Instruction Tuning**-এ যায়, বিশেষ করে NLG evaluation-এর জন্য automatically high-quality, model-specific prompt তৈরি করার প্রসঙ্গে।

---

## 2. End-to-end LLM pipeline

### 2.1 Diagram-এ দেখানো full pipeline

Page 3-এর pipeline diagram একটি LLM-এর lifecycle-কে পাঁচটি বড় stage-এ ভাগ করেছে।

#### Stage 1: Data preparation

Raw data source-এর মধ্যে আছে:

- web;
- books;
- code;
- অন্যান্য text source।

Data preparation pipeline-এ আছে:

- filtering;
- de-duplication;
- formatting;
- tokenization।

এর ফলে একটি **cleaned pretraining corpus** তৈরি হয়।

#### Stage 2: Pretraining

Cleaned corpus pretraining-এর জন্য ব্যবহার করা হয়। Slide এটিকে এভাবে বর্ণনা করেছে:

- corpus-এর উপর **self-supervised learning**;
- **language patterns, facts, and reasoning** শেখা।

এর output হলো একটি **base model**, উদাহরণ হিসেবে দেওয়া হয়েছে:

- LLaMA-3-Base;
- GPT-3-Base।

#### Stage 3: Post-training: alignment and fine-tuning

Post-training block-এ দুটি প্রধান ধাপ আছে।

প্রথমে, **instruction tuning**:

- instruction-response pair-এর উপর **Supervised Fine-Tuning (SFT)** ব্যবহার করে;
- মডেলকে instruction follow করতে শেখায়।

এর ফলে একটি **instruction-tuned model** তৈরি হয়।

দ্বিতীয়ত, **policy optimisation / reinforcement learning**:

- preference data সংগ্রহ করে;
- reward model train করে;
- PPO/DPO দিয়ে মডেল optimise করে;
- human preference score maximize করার লক্ষ্য রাখে।

এর ফলে একটি **aligned model** তৈরি হয়, উদাহরণ হিসেবে দেওয়া হয়েছে:

- LLaMA-3-Instruct;
- ChatGPT।

#### Stage 4: Inference and application

Inference time-এ user prompt দেয়। Diagram-এ অন্তর্ভুক্ত আছে:

- prompting and interaction techniques;
- In-Context Learning (ICL), বিশেষ করে examples এবং few-shot prompting;
- Chain-of-Thought (CoT), যাকে step-by-step reasoning হিসেবে বর্ণনা করা হয়েছে;
- Tree of Thought (ToT), যাকে possibilities explore করা হিসেবে বর্ণনা করা হয়েছে;
- inference;
- Retrieval-Augmented Generation (RAG), যেখানে মডেল external knowledge base থেকে relevant document retrieve করে;
- final response generation।

#### Stage 5: Security evaluation and red teaming

Diagram-এ explicitভাবে আছে:

- **inversion attacks**-এর বিরুদ্ধে testing, যার মধ্যে model inversion এবং prompt inversion আছে;
- prompt বা training data recover করা যায় কি না তা analyse করা;
- post-deployment evaluation।

এটি পরের **inversed instruction tuning** এবং inversion learning অংশের সঙ্গে সরাসরি যুক্ত।

---

## 3. Foundation models vs instruction-tuned models

### 3.1 Foundation models

#### Intuition

Foundation model হলো raw pretrained language model। এটি fluent text generate করতে পারে এবং broad knowledge রাখে, কিন্তু assistant হিসেবে control করা সহজ নাও হতে পারে।

#### Slide definition / properties

Page 4 foundation model-এর বৈশিষ্ট্য হিসেবে দিয়েছে:

- coherent, fluent generation;
- completion এবং continuation ability;
- vast world knowledge।

তবে এগুলোর গুরুতর limitation-ও আছে:

- potentially harmful outputs;
- control করা কঠিন;
- human values-এর সঙ্গে misaligned হতে পারে।

### 3.2 Instruction-tuned models

#### Intuition

Instruction-tuned model হলো pretrained model, যাকে user instruction-এর response দিতে আরও train করা হয়েছে। ফলে এটি pure text-completion engine না হয়ে assistant-এর মতো আচরণ করে।

#### Slide definition / properties

Page 4 instruction-tuned model-এর বৈশিষ্ট্য হিসেবে দিয়েছে:

- foundation ability এবং আরও বেশি কিছু;
- prompt দিয়ে controllability;
- fine-tuning-এর কম প্রয়োজন;
- command follow করার ক্ষমতা।

কিন্তু slide trade-off-ও উল্লেখ করেছে:

- performance-এ সামান্য hit;
- prompt template-এর প্রতি sensitivity।

### 3.3 Key contrast

| Aspect | Foundation model | Instruction-tuned model |
|---|---|---|
| Main training behaviour | Completion / continuation | Instructions follow করা |
| Control | Control করা কঠিন | Prompt দিয়ে বেশি controllable |
| Alignment | Misaligned হতে পারে | Requested task-এর সঙ্গে বেশি aligned |
| Risks | Harmful output, value mismatch | Prompt format/template-এর প্রতি sensitive |
| Assistant হিসেবে ব্যবহার | সরাসরি ideal নয় | অনেক বেশি suitable |

---

## 4. Instruction tuning

### 4.1 Instruction tuning-এর আগে

Page 5 বলছে, instruction tuning-এর আগে মডেলটি:

- বড় corpus-এ **next-token prediction loss** minimise করার জন্য train করা হয়;
- user instruction follow করার জন্য explicitভাবে train করা হয় না।

#### Intuition

Pretrained model text-এর plausible continuation predict করতে শেখে। এটি শক্তিশালী, কিন্তু user request-কে command হিসেবে interpret করে helpfully respond করা সরাসরি শেখায় না।

### 4.2 Instruction tuning-এর motivation

Instruction tuning-এর motivation হলো:

- training objective এবং user intent-এর mismatch কমানো;
- useful information দেওয়া;
- instruction-এর reliable response দেওয়া।

### 4.3 Key concept: instruction tuning

#### Intuition

Instruction tuning একটি general pretrained language model-কে এমন মডেলে রূপ দেয় যা assistant-এর মতো আচরণ করে।

#### Formal definition from slides

Instruction tuning **instruction-response pair-এর উপর Supervised Fine-Tuning** ব্যবহার করে, যাতে মডেল instruction follow করতে শেখে।

### 4.4 Discussion question

Page 6 জিজ্ঞেস করে:

> If you deployed a raw foundation model directly in customer support, what kinds of failures would you expect, even if the language sounds fluent?

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slide-এ প্রশ্নটি আছে, কিন্তু lecturer-এর spoken answer পাওয়া যায়নি।

---

## 5. Instruction tuning examples

### 5.1 Standard instruction fine-tuning example

Page 7 একটি simple factual question দেয়:

> Please answer the following question.  
> What is the boiling point of Nitrogen?

দেখানো model output:

```text
-320.4F
```

এটি direct question answering-এর জন্য simple instruction-following দেখায়।

### 5.2 Chain-of-thought fine-tuning example

Page 7 একটি step-by-step reasoning instruction দেয়:

> Answer the following question by reasoning step-by-step.  
> The cafeteria had 23 apples. If they used 20 for lunch and bought 6 more, how many apples do they have?

দেখানো output reasoning:

```text
The cafeteria had 23 apples originally. They used 20 to make lunch.
So they had 23 - 20 = 3.
They bought 6 more apples, so they have 3 + 6 = 9.
```

সুতরাং final answer:

$$
9
$$

এই example দেখায় যে instruction tuning শুধু final answer নয়, intermediate reasoning trace-ও অন্তর্ভুক্ত করতে পারে।

### 5.3 Unseen task-এ generalisation

Page 7 diagram training side-কে label করেছে:

> Multi-task instruction finetuning, 1.8K tasks

Dashed line-এর নিচে inference-কে label করেছে:

> generalization to unseen tasks

Example unseen task জিজ্ঞেস করে:

> Can Geoffrey Hinton have a conversation with George Washington?  
> Give the rationale before answering.

Model output reason করে যে Geoffrey Hinton 1947 সালে জন্মেছিলেন এবং George Washington 1799 সালে মারা যান, তাই তাদের conversation হওয়া সম্ভব নয়। Final answer:

```text
no
```

#### Important point

Instruction tuning শুধু specific task memorize করা নয়। Slide অনেক instruction-following task থেকে unseen task-এ generalisation-এর উপর জোর দেয়।

---

## 6. HHH guiding principles

Page 8 aligned assistant behaviour-এর guiding principles হিসেবে **HHH** উপস্থাপন করে:

1. Helpful.
2. Honest.
3. Harmless.

### 6.1 Helpful

Helpful model-এর উচিত:

- user-এর intention বুঝতে পারা;
- requested action সঠিকভাবে execute করা;
- relevant supporting information এবং alternate solutions দেওয়া।

#### Intuition

Helpfulness মানে শুধু fluent text produce করা নয়; user আসলে যে task চেয়েছে সেটি করা।

### 6.2 Honest

Honest model-এর উচিত:

- truthful, meaningful, এবং specific information দেওয়া;
- relevant বা correct information তৈরি করতে না পারলে তা স্বীকার করা;
- hypothesis fact নয়—এটি clear করা।

#### Intuition

Honesty মানে false confidence এড়ানো এবং uncertainty পরিষ্কারভাবে জানানো।

### 6.3 Harmless

Harmless model-এর উচিত:

- offensive terminology বা ideology এড়ানো;
- potentially dangerous activity সম্পর্কিত information দেওয়া এড়ানো;
- unlawful activity-তে অংশ নিতে refuse করা;
- illicit information বের করার জন্য deceive বা manipulate করার চেষ্টা detect করা।

#### Intuition

Harmlessness মানে safety এবং refusal behaviour; শুধু politeness নয়।

---

## 7. Prompt templates

### 7.1 Prompt template কেন গুরুত্বপূর্ণ

Page 4-এর foundation-vs-instruction-tuned comparison বলে যে instruction-tuned model **prompt template-এর প্রতি sensitive**। Page 9 LLaMA2, Qwen, এবং Phi-2-এর concrete template দেয়।

### 7.2 LLaMA2 prompt template

Page 9-এ দেখানো LLaMA2 chat-style format:

```text
<s>[INST] <<SYS>>

{{ system_prompt }}

<</SYS>>

{{ user_message }} [/INST]
```

#### Interpretation

Template-টি আলাদা করে:

- system prompt;
- user message;
- instruction delimiters।

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slide template দেয়, কিন্তু template বদলালে performance কতটা বদলায় তা explain করে না।

### 7.3 Qwen prompt template

Page 9-এ দেখানো Qwen-style template:

```text
<|im_start|>system
{system_message}<|im_end|>
<|im_start|>user
{prompt}<|im_end|>
<|im_start|>assistant
```

#### Interpretation

এই format explicitভাবে mark করে:

- system message;
- user message;
- assistant start।

### 7.4 Phi-2 prompt template

Page 9-এ দেখানো Phi-2-style template:

```text
Instruction: {{instruction}}

Output:
```

#### Key point

Different model family different prompt format expect করে। এটি পরে inversion-learning অংশের সঙ্গে strongly connect করে, যেখানে model-specific prompt-এর গুরুত্ব দেখানো হয়।

---

## 8. Reinforcement Learning with Human Feedback

### 8.1 RLHF workflow

Page 10-এর RLHF diagram LLaMA2-ভিত্তিক একটি workflow দেখায়:

1. Pretraining data self-supervised learning-এর জন্য ব্যবহার করা হয়।
2. এতে base model তৈরি হয়, slide-এ LLaMA 2 দেখানো।
3. Model supervised fine-tuning-এর মধ্যে যায়।
4. Human feedback human preference data দেয়।
5. আলাদা reward model দেখানো হয়েছে:
   - safety reward model;
   - helpful reward model।
6. Fine-tuning-এ অন্তর্ভুক্ত:
   - rejection sampling;
   - Proximal Policy Optimisation।
7. Final model হলো LLaMA-2-chat।

### 8.2 Key concept: RLHF

#### Intuition

RLHF human preference feedback ব্যবহার করে model output-কে মানুষের পছন্দের সঙ্গে আরও aligned করে, যার মধ্যে helpfulness এবং safety আছে।

#### Formal description from slides

RLHF human preference data, reward model, এবং rejection sampling ও PPO-এর মতো fine-tuning method ব্যবহার করে।

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slide preference collect করা, reward model train করা, বা PPO update চালানোর detailed algorithmic sequence দেয় না।

---

## 9. Reward modelling

### 9.1 Pairwise preference setup

Page 11 একটি **binary pairwise ranking loss** ব্যবহার করে।

Notation:

- $r_\theta(x, y)$ হলো prompt $x$ এবং response $y$-এর scalar reward output।
- $y_c$ হলো pairwise matchup-এ chosen response।
- $y_r$ হলো rejected response।

### 9.2 Reward model loss

Slide-এ দেওয়া আছে:

$$
\mathcal{L}_{\text{ranking}}
=
-\log
\left(
\sigma
\left(
r_\theta(x, y_c)
-
r_\theta(x, y_r)
\right)
\right)
$$

where:

- $x$ হলো prompt;
- $y_c$ হলো chosen response;
- $y_r$ হলো rejected response;
- $r_\theta(x,y)$ হলো reward model-এর scalar score;
- $\sigma(\cdot)$ হলো sigmoid function।

### 9.3 Loss-এর অর্থ

Page 11 বলছে:

> The difference in reward represents the log odds that one response is preferred by human labellers.

#### Intuition

Reward model এমনভাবে train হয় যাতে chosen response rejected response-এর চেয়ে বেশি reward পায়। Reward difference যত বড়:

$$
r_\theta(x, y_c) - r_\theta(x, y_r),
$$

মডেল তত confidently predict করে যে $y_c$ preferred।

### 9.4 Discussion question

Page 12 জিজ্ঞেস করে:

> Why might pairwise comparison be easier and more reliable than asking humans to give every answer an absolute score from 1 to 10?

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Uploaded slides প্রশ্নটি অন্তর্ভুক্ত করে, কিন্তু lecturer-এর spoken answer নেই।

---

## 10. Proximal Policy Optimisation

### 10.1 Motivation

Page 13 motivation-টি এভাবে frame করে:

> How can we take the biggest improvement step on a policy using the currently available data, without stepping so far we cause collapse?

Slide contrast করে:

- **small policy steps**, যেগুলো প্রায়ই converge করে কিন্তু দীর্ঘ সময় নেয়;
- **large policy steps**, যেগুলো দ্রুত converge করতে পারে কিন্তু irrecoverably collapse করতে পারে।

### 10.2 Ratio function

Slide ratio function define করে:

$$
r_t(\theta)
=
\frac{
\pi_\theta(a_t \mid s_t)
}{
\pi_{\theta_{\text{old}}}(a_t \mid s_t)
}
$$

where:

- $\pi_\theta$ হলো current policy;
- $\pi_{\theta_{\text{old}}}$ হলো old policy;
- $a_t$ হলো time $t$-এর action;
- $s_t$ হলো time $t$-এর state।

### 10.3 Advantage

Slide define করে:

$$
A_t = \text{reward} - \text{baseline}
$$

#### Intuition

Advantage measure করে outcome baseline expectation-এর চেয়ে better নাকি worse।

### 10.4 Clipping

Slide বলছে:

> Clipping prevents destructive updates.

### 10.5 Key concept: PPO

#### Intuition

PPO model policy update করে, কিন্তু new policy old policy থেকে কত দূরে যেতে পারবে তা limit করে।

#### Formal content given in slides

Visible formal content হলো:

- ratio function $r_t(\theta)$;
- advantage definition $A_t$;
- clipping motivation।

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slide full PPO clipped objective দেয় না।

---

## 11. Direct Preference Optimisation

### 11.1 Motivation

Page 14 বলে Rafailov et al. argue করেন যে reward modelling approach:

- খুব complex;
- unstable।

### 11.2 Core proposal

DPO RLHF procedure-কে replace করে:

- direct optimisation;
- exact optimisation;
- binary cross entropy।

Slide দুটি procedure contrast করে।

#### RLHF

Preference data reward model-এ যায়। Reward model এরপর reward label করে। Reinforcement learning completion sample করে এবং LM policy update করে।

#### DPO

Preference data maximum likelihood ব্যবহার করে সরাসরি final language model train করে।

### 11.3 Key concept: DPO

#### Intuition

DPO আলাদা reward model train করা এবং আলাদা RL loop চালানো এড়ায়।

#### Formal description from slides

DPO binary cross entropy ব্যবহার করে RLHF-কে direct, exact optimisation দিয়ে replace করে।

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slide DPO loss formula দেয় না।

---

## 12. Group Relative Policy Optimisation

### 12.1 GRPO diagram

Page 15 PPO এবং GRPO compare করে। Diagram অনুযায়ী GRPO:

- একসঙ্গে একটি group of outputs process করে;
- group-এর মধ্যে advantage score calculate করে;
- $A_{i,t}$-এর complicated calculation avoid করে;
- trained policy এবং reference policy-এর KL divergence সরাসরি loss-এ যোগ করে;
- value model বাদ দেয়;
- group score থেকে baseline estimate করে;
- training resource উল্লেখযোগ্যভাবে কমায়।

### 12.2 Slides থেকে GRPO mechanics

Page 16 বলে:

- reward model replace করা হয় rule-based reward-এর series দিয়ে, Python function হিসেবে, যা desired behaviour-এর proxy;
- multiple generation থেকে averaged reward value model-এর প্রয়োজন eliminate করে;
- given prompt-এর multiple output একসঙ্গে process করা হয়;
- advantage score group-এর relative হিসেবে calculate করা হয়;
- এটি original reward model objective-এর সঙ্গে align করে।

### 12.3 Key concept: GRPO

#### Intuition

GRPO একই prompt-এর multiple generated output compare করে এবং group-এর মধ্যে relative advantage compute করে, ফলে separate value model-এর উপর reliance কমে।

#### Formal content from slides

Explicit GRPO objective দেওয়া হয়নি। Slides proceduralভাবে define করে:

- group outputs;
- rule-based rewards;
- group-relative advantage;
- no value model।

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Exact GRPO loss এবং exact group advantage calculation visible slides-এ নেই।

---

## 13. GRPO vs PPO

### 13.1 GRPO advantages and limitations

Page 17 GRPO-এর advantages হিসেবে দিয়েছে:

- value model দরকার নেই;
- higher sample efficiency;
- functional rewards।

Page 17 GRPO-এর limitations হিসেবে দিয়েছে:

- less studied and optimised;
- batching-এর প্রতি sensitive;
- বেশ expensive, 2 models ব্যবহার করে।

### 13.2 PPO advantages and limitations

Page 17 PPO-এর advantages হিসেবে দিয়েছে:

- well-studied and stable;
- strong theoretical backing;
- domain জুড়ে reliable।

Page 17 PPO-এর limitations হিসেবে দিয়েছে:

- expensive, 4 models ব্যবহার করে;
- hyperparameter-এর প্রতি sensitive;
- slower convergence।

### 13.3 Comparison table

| Method | Strengths | Weaknesses |
|---|---|---|
| GRPO | Value model নেই, higher sample efficiency, functional rewards | কম studied, batching-sensitive, এখনও expensive |
| PPO | Well-studied, stable, theoretical backing, domain জুড়ে reliable | Expensive, hyperparameter-sensitive, slower convergence |

---

## 14. Mixture of Experts

### 14.1 Definition

Page 19 Mixture of Experts define করে:

> Several separate networks, joined together, which are specialised in a different region of the feature space. At inference, one or more experts are chosen by a gating network.

### 14.2 Intuition

Mixture-of-Experts model-এ multiple expert subnetwork থাকে। প্রতিটি input-এর জন্য পুরো model একইভাবে activate না করে, gating network current input process করার জন্য কোন expert বা experts নির্বাচন করবে তা ঠিক করে।

### 14.3 Diagram interpretation

Page 19-এর MoE diagram দেখায়:

- MoE layer-সহ একটি standard model path;
- MoE layer-এর ভেতরে multiple experts;
- expert select বা weight করার gating network;
- selected expert computation-এর পর output combine করা।

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Visible slides mathematical gating function, top-$k$ routing rule, বা load-balancing loss specify করে না।

---

## 15. What experts learn

### 15.1 Main claim

Page 20 বলছে:

- encoder experts shallow concept বা token group-এ specialise করে;
- যেমন punctuation expert বা proper noun expert হতে পারে;
- decoder experts-এর specialisation কম।

### 15.2 Table থেকে examples

Page 20-এর table expert specialisation দেখায়, যেমন:

- **sentinel tokens**;
- **punctuation**;
- **conjunctions and articles**;
- **verbs**;
- **visual descriptions**, যার মধ্যে colour এবং spatial position আছে;
- **proper names**;
- **counting and numbers**, যার মধ্যে written এবং numerical forms আছে।

### 15.3 Key point

Lecture “expert” শব্দের intuitive meaning-এর সঙ্গে slide-এ যা দেখানো হয়েছে তা contrast করে। MoE model-এ expert মানবসদৃশ topic specialist যেমন medicine, law, বা history নাও হতে পারে; বরং low-level token বা feature specialist হতে পারে।

### 15.4 Discussion question

Page 21 জিজ্ঞেস করে:

> When you hear the word ‘expert’, you might imagine topic experts like history or medicine. Why do you think models often learn much lower-level experts instead?

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slides প্রশ্নটি অন্তর্ভুক্ত করে, কিন্তু spoken answer নেই।

---

## 16. To MoE or not to MoE

### 16.1 Advantages

Page 22 MoE-এর advantages হিসেবে দিয়েছে:

- fewer activations;
- faster pretraining;
- experts on different devices;
- sparsity।

### 16.2 Disadvantages

Page 22 disadvantages হিসেবে দিয়েছে:

- fine-tune করা challenging;
- overfitting-এর prone;
- much higher complexity;
- whole model memory-তে থাকতে হয়।

### 16.3 Key concept: sparse activation

#### Intuition

MoE computationally efficient হতে পারে, কারণ given input-এর জন্য model-এর শুধু একটি অংশ activate হয়।

#### Slide-supported trade-off

কম expert active থাকলেও computation-এর সময় whole model memory-তে থাকতে হতে পারে।

---

## 17. Reasoning models

### 17.1 Chain-of-Thought prompting

Page 24 Chain-of-Thought prompting-কে define করে এমন prompting হিসেবে যা model-কে encourage করে:

> think step by step.

এটি hard task-কে simple task-এর series-এ পরিণত করে।

### 17.2 Chain-of-Thought-এর benefits

Slide তিনটি key benefit list করে:

- complex reasoning task-এ accuracy improve করে;
- transparent, verifiable solution তৈরি করে;
- common reasoning error কমায়।

### 17.3 Worked example: $13 \times 27$

Page 24 দেয়:

> Solve $13 \times 27$.

দেখানো reasoning:

প্রথমে multiply:

$$
7 \times 3 = 21
$$

Carry 2।

তারপর:

$$
7 \times 1 = 7
$$

Carried 2 যোগ করি:

$$
7 + 2 = 9
$$

সুতরাং:

$$
13 \times 7 = 91
$$

Next:

$$
20 \times 13 = 260
$$

Finally:

$$
260 + 91 = 351
$$

Therefore:

$$
13 \times 27 = 351
$$

### 17.4 Example নিয়ে note

Arithmetic-টি step-by-step decomposition হিসেবে present করা হয়েছে। Final answer:

$$
351
$$

---

## 18. Reasoning model format

### 18.1 Two-stage structure

Page 25 দুটি stage describe করে:

1. reasoning / thinking step;
2. response।

Slide format দেয়:

```text
<think> Chain of thought reasoning for task. </think> Final response.
```

### 18.2 Test-time thinking

Slide বলছে:

- model arbitrary time ব্যয় করে different idea explore করতে পারে;
- সাধারণত “thinking”-এ যত বেশি সময় ব্যয় হয়, performance তত ভালো হয়।

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slide limit, stopping criteria, বা “thinking” budget কীভাবে control করা হয় তা define করে না।

---

## 19. Test-time compute

### 19.1 Slide title

Page 26-এর title:

> Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters.

### 19.2 Visual evidence shown

Page-টিতে চারটি plot আছে।

#### Plot 1: Test time-এ answer iteratively revise করা

এই plot generation budget বাড়লে MATH accuracy বাড়তে দেখায়। এটি compare করে:

- majority;
- best-of-$N$ weighted;
- compute optimal;
- parallel।

#### Plot 2: FLOPs-matched evaluation-এ test-time এবং pretraining compute compare করা

এই bar chart relative improvement from test-time compute দেখায়:

- easy questions;
- medium questions;
- hard questions।

Visual suggest করে যে inference tokens to pretraining tokens ratio এবং question difficulty অনুযায়ী test-time compute-এর সাহায্য ভিন্ন হতে পারে।

#### Plot 3: PRM verifier-এর against test-time search

এই plot compare করে:

- majority;
- ORM best-of-$N$ weighted;
- PRM best-of-$N$ weighted;
- PRM compute optimal।

Generation budget বাড়ার সঙ্গে MATH accuracy বাড়ে।

#### Plot 4: আরেকটি FLOPs-matched comparison

Final bar chart easy, medium, এবং hard question জুড়ে varying gain/loss দেখায়।

### 19.3 Key point

Slide-এর title সরাসরি takeaway জানায়: optimally scaling inference-time compute model parameter scale করার চেয়ে বেশি effective হতে পারে।

### 19.4 Discussion question

Page 27 জিজ্ঞেস করে:

> If you had a fixed budget, when would it be smarter to spend it on a bigger model, and when would it be smarter to let the model think longer at test time?

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slides প্রশ্ন ও chart অন্তর্ভুক্ত করে, কিন্তু lecturer-এর spoken interpretation নেই।

---

## 20. Summary of first half

Page 29 main takeaway দেয়।

### 20.1 Transformers and self-supervised training

Large-scale next-token prediction powerful general language representation তৈরি করতে সক্ষম করে।

### 20.2 Instruction tuning

Instruction-response pair-এর উপর train করে instruction tuning raw pretrained model-কে useful assistant-এ convert করে।

### 20.3 Human alignment

RLHF, PPO, এবং DPO-সহ human alignment method model behaviour-কে human preferences, safety, এবং helpfulness-এর সঙ্গে align করে।

### 20.4 Mixture of Experts

MoE sparse expert routing-এর মাধ্যমে scalability এবং efficiency improve করে।

### 20.5 Reasoning models

Chain-of-Thought-এর মতো technique structured reasoning এবং problem-solving improve করে।

### 20.6 Discussion question

Page 28 জিজ্ঞেস করে:

> If you had to explain pretraining, instruction tuning, and alignment in one short sentence each, how would you separate them?

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slide প্রশ্নটি অন্তর্ভুক্ত করে, কিন্তু lecturer-এর spoken answer নেই।

---

## 21. Inversed instruction tuning

### 21.1 Transition

Page 30 lecture-এর দ্বিতীয় major part শুরু করে:

> Inversed Instruction tuning

এই section prompt-based NLG evaluation এবং inversion learning নিয়ে।

---

## 22. Problems with prompt-based evaluation

### 22.1 Core problem

Page 31 বলছে:

> Evaluating generated text is now about as hard as generating it!

Lecture দুটি evaluation approach identify করে।

#### Human evaluation

Human evaluation-কে gold standard বলা হয়েছে, কিন্তু এতে সমস্যা থাকতে পারে:

- inconsistency;
- bias;
- lack of standardisation।

#### LLM-based evaluation

LLM-based evaluation অনেক বেশি scalable, কিন্তু prompt design-এর প্রতি অত্যন্ত sensitive।

Even small prompt changes can lead to large performance differences.

### 22.2 Key concept: prompt-based NLG evaluation

#### Intuition

শুধু human বা automatic metric-এর উপর নির্ভর না করে, generated text evaluate করতে একটি LLM-কে prompt করা যায়।

#### Problem

Evaluation result prompt-এর উপর strongly depend করে, তাই evaluator model-এর score actual output quality-এর পাশাপাশি prompt design-ও reflect করতে পারে।

---

## 23. High sensitivity of LLMs to prompt design

### 23.1 Main claims

Page 32 বলছে:

- LLM-based evaluation prompt-এর প্রতি highly sensitive;
- prompt বেশির ভাগই hand-crafted;
- small design change output quality-তে significant effect ফেলতে পারে;
- Polo et al. 2024-এ few-shot template-এর subtle variation **76-point accuracy shifts** পর্যন্ত ঘটিয়েছে;
- performance vary করে:
  - prompt phrasing;
  - prompt order;
  - numerical scales;
  - implicit biases।

### 23.2 Interpretation

একটি single prompt neutral evaluation instrument নয়। এর wording, structure, examples, এবং scoring scale—সবই model behaviour affect করতে পারে।

---

## 24. Extreme prompt example

Page 33 একটি “extreme example” দেয় এবং explicitভাবে label করে:

> Not Recommended.

Prompt-টি model-কে এমন expert coder হিসেবে frame করে যার cancer treatment-এর জন্য desperately money দরকার, এবং coding task সঠিকভাবে করলে fictional corporate reward হিসেবে \$1B দেওয়ার কথা বলে।

### 24.1 Purpose of the example

Example-টি দেখায় prompt design কীভাবে manipulative, theatrical, বা overly engineered হয়ে যেতে পারে।

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slide example-টিকে “not recommended” বলে, কিন্তু কেন not recommended তার spoken explanation পাওয়া যায়নি।

---

## 25. Prompt-based NLG evaluation and one-size-fits-all prompts

### 25.1 Common practice

Page 34 বলছে common practice হলো summarisation, machine translation, এবং অন্যান্য NLG evaluation setting-এ একই popular human-crafted prompt ব্যবহার করা।

এই prompt-গুলো প্রায়ই evaluator হিসেবে কোন base LLM ব্যবহার হচ্ছে তা বিবেচনা না করেই reuse করা হয়।

### 25.2 Problem with this assumption

Slide point out করে:

- human evaluator একই evaluation guideline-এ ভিন্নভাবে respond করে;
- তাই সব LLM-এর জন্য single evaluation prompt কাজ করবে ধরে নেওয়া questionable;
- model ভেদে behaviour আলাদা।

### 25.3 Discussion question

Page 35 জিজ্ঞেস করে:

> If two evaluator models give different scores to the same summary, what possible causes should we consider before concluding one model is simply wrong?

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slides প্রশ্নটি অন্তর্ভুক্ত করে, কিন্তু lecturer-এর answer নেই।

---

## 26. Inversion modelling

### 26.1 Standard instruction tuning

Page 36 standard instruction tuning define করে:

> Learn the mapping from input instruction to outcomes.

Symbolic terms-এ:

$$
\text{Instruction} \rightarrow \text{Outcome}
$$

Diagram-এ evaluation instruction একটি LLM-এ গিয়ে output produce করছে, যেমন:

```json
{
  "article": "...",
  "summary": "...",
  "consistency score": 4.53,
  "...": "..."
}
```

### 26.2 Inversion-based fine-tuning

Page 36 inversion-based fine-tuning define করে:

> Learn the inverse mapping from outcomes to input instructions.

Symbolic terms-এ:

$$
\text{Outcome} \rightarrow \text{Instruction}
$$

Diagram outcome-like object-কে inverse model-এ যেতে দেখায়, যা output হিসেবে evaluation prompt দেয়।

### 26.3 Key concept: inversion modelling

#### Intuition

“এই prompt দিলে model কী output produce করে?”—এ প্রশ্ন করার বদলে inversion learning জিজ্ঞেস করে: “এই desired output/evaluation behaviour পেতে কোন prompt দরকার?”

#### Formal slide distinction

$$
\text{Standard instruction tuning: } X \mapsto Y
$$

$$
\text{Inversion-based fine-tuning: } Y \mapsto X
$$

---

## 27. Inverse mapping diagram

### 27.1 Diagram structure

Page 37 দেখায়:

- multiple prompts:
  - prompt 1;
  - prompt 2;
  - prompt 3;
  - ...;
  - prompt $n$;
- একটি **Instruct LLM**;
- output score distributions;
- visually indicated **good distribution** এবং **bad distribution**;
- একটি one-shot example;
- একটি **Inverse LLM**, যা prompt-এর দিকে back-map করে।

### 27.2 Diagram-এর অর্থ

Diagram-টি বোঝায় যে different prompt evaluator-এর জন্য different output score distribution produce করে। Inverse model একটি example outcome ব্যবহার করে desired evaluation behaviour-এর সঙ্গে বেশি মেলে এমন input prompt generate বা recover করে।

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slide-এর good এবং bad distribution-এর visual distinction mathematically formalise করা হয়নি।

---

## 28. Inversion learning

### 28.1 Problem studied

Page 38 বলে inversion learning study করে:

> the problem of generating high-quality, model-specific evaluation prompts.

### 28.2 Core idea

Core idea হলো:

> learn an effective reverse mapping from model outputs back to their input instructions.

### 28.3 Data requirement

Slide বলছে method-টির দরকার শুধু:

> one evaluation sample, consisting of content plus human score,

evaluation prompt generate করার জন্য।

### 28.4 Key concept: model-specific evaluation prompts

#### Intuition

Different LLM different prompt format-এর অধীনে differently behave করে, তাই best evaluation prompt evaluator model অনুযায়ী tailor করা উচিত; সব model-এ একই prompt reuse করা উচিত নয়।

---

## 29. Related work on inversion learning

### 29.1 Prompt sensitivity and prompt variants

Pages 39-41 কয়েকটি related work mention করে।

#### Polo et al. 2024

Single prompt-এর উপর নির্ভর না করে multiple prompt variant জুড়ে performance estimate করার recommendation দিয়েছে।

#### Qian et al. 2024

MT task-এ different prompt component benchmark করেছে কোন element সবচেয়ে matter করে তা identify করতে, যেমন:

- phrasing;
- ordering;
- scale।

### 29.2 Prompt reconstruction and inversion work

#### Morris et al. 2023

Next-token probability থেকে prompt-এ inverse mapping শিখেছে:

$$
\text{Logit} \rightarrow \text{Prompt}
$$

#### Petrov et al. 2024

Input token recover করতে gradient-based inversion ব্যবহার করেছে:

$$
\text{Gradient} \rightarrow \text{Prompt}
$$

#### Zhang et al. 2024

ChatGPT-এর multiple sampled output ব্যবহার করে prompt reconstruct করেছে:

$$
\text{Output} \rightarrow \text{Prompt}
$$

### 29.3 Difference from previous work

Page 41 বলে previous work-এর বেশির ভাগ focus করে:

- jailbreaking;
- ChatGPT-এর মতো closed-source model-এ ব্যবহৃত input prompt reconstruct করা।

In contrast, এই lecture-এর approach-এর লক্ষ্য:

- prompt quality improve করা;
- model-specific inverse prompt derive করা;
- forward model-এর same architecture দিয়ে inverse model train করা;
- শুধু single example require করা;
- logits বা gradients-এর মতো internal model state-এর উপর নির্ভর না করা।

---

## 30. Experimental setup: white-box and black-box settings

### 30.1 White-box setting

Page 42 white-box setting define করে যেখানে থাকে:

- SFT dataset এবং model—উভয়ের full access;
- exact inversion dataset construct করার ability;
- inversion-based fine-tuning।

Slide দেয়:

$$
\mathcal{D}_{\text{SFT}} = (X, Y)
$$

$$
\mathcal{D}_{\text{Inv}} = (Y, X)
$$

অর্থাৎ inversion dataset normal SFT mapping-কে reverse করে।

### 30.2 Black-box setting

Page 42 black-box setting define করে যেখানে থাকে:

- SFT data-তে access নেই;
- training pipeline-এ access নেই;
- inversion dataset distillation।

Distillation step instruction-tuned model ব্যবহার করে known input $x$ থেকে output $y$ generate করে।

Slide দেয়:

$$
\tilde{y} = \mathcal{M}_{\text{Instruct}}(x)
$$

and:

$$
\mathcal{D}_{\text{Inv}} = \{(\tilde{Y}, X)\}
$$

### 30.3 Inversion fine-tuning objective

Slide optimisation objective দেয়:

$$
\tilde{\theta}
=
\arg\min_{\theta}
\mathbb{E}_{(y,x)\sim \mathcal{D}_{\text{Inv}}}
\left[
\mathcal{L}
\left(
\mathcal{M}(y;\theta), x
\right)
\right]
$$

#### Interpretation

Model $y$-like output input হিসেবে নেয় এবং $x$-like instruction reconstruct করতে শেখে।

---

## 31. Experimental setup: tasks, datasets, models, baselines

### 31.1 NLG evaluation tasks and datasets

Page 43 list করে:

#### Summarisation

- SummEval;
- QAGS।

#### Dialogue

- Topical-Chat।

#### Machine translation

- WMT-22।

### 31.2 Inversion model training

Inversion model train করা হয়:

- Qwen;
- LLaMA।

### 31.3 Baseline prompts

Baseline prompt-এর মধ্যে আছে:

- human-crafted prompts, যেমন G-EVAL এবং GEMBA থেকে prompts;
- standard instruction-tuned LLM দ্বারা generated forward prompts।

---

## 32. Worked example: original vs distillation

### 32.1 Example-এ ব্যবহৃত prompt

Page 44 input instruction দেয়:

> Identify and elaborate on some of the most notable philosophers throughout history, detailing their key contributions to various branches of philosophy, along with the historical and cultural context of their ideas.

### 32.2 Original response

Original response শুরু হয়:

- “Certainly!”
- এটি notable philosophers এবং তাদের contribution describe করে।
- এটি Socrates দিয়ে শুরু করে:
  - branch: ethics, epistemology;
  - key contribution: Socratic Method;
  - context: ancient Athens, political and cultural development, Sophists-দের challenge করা, Plato-এর মাধ্যমে transmitted।
- এরপর Plato-তে যায়:
  - branch: metaphysics, epistemology, ethics, political philosophy;
  - key contribution: Theory of Forms;
  - Athens-এ Academy প্রতিষ্ঠা।

### 32.3 Distillation response

Distillation response-ও notable philosophers discuss করে, কিন্তু structure কিছুটা আলাদা।

Socrates-এর জন্য এটি অন্তর্ভুক্ত করে:

- “Ancient Greek Philosophy” heading;
- contributions;
- key ideas;
- historical and cultural context;
- Peloponnesian War এবং Athens-এর decline context হিসেবে;
- Socrates democracy এবং তার excesses-এর critic ছিলেন—এই statement।

Plato-এর জন্য এটি শুরু করে:

- “Plato (428/427-348/347 BCE) — Ancient Greek Philosophy.”

### 32.4 Example-এর purpose

Example দেখায় যে black-box setting-এ original SFT data-তে access না থাকলেও known input থেকে output generate করে inversion dataset construct করা যায়।

---

## 33. Overall results

### 33.1 Metrics reported

Page 45-এর results table দুটি metric report করে:

$$
\rho
$$

and

$$
r
$$

প্রতিটি dataset এবং average-এর জন্য।

[UNCLEAR] Slides $\rho$ এবং $r$ explicitভাবে define করে না। এগুলো Spearman/Pearson নাকি অন্য correlation pair—তা জানতে transcript বা paper check করতে হবে।

### 33.2 Baseline automatic metrics

Table BERTScore এবং BARTScore অন্তর্ভুক্ত করে:

| Evaluator | Average $\rho$ | Average $r$ |
|---|---:|---:|
| BERTScore | 0.271 | 0.301 |
| BARTScore | 0.309 | 0.320 |

### 33.3 Black-box setting: LLaMA-3.1-8B-Instruct

Average results:

| Prompt type | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Human-crafted prompt | 0.391 | 0.407 |
| Forward prompt | 0.318 | 0.327 |
| Inversion prompt, ours | 0.423 | 0.433 |
| Relative gain | ↑33% | ↑32% |

Inversion prompt forward prompt-এর তুলনায় average score improve করে এবং human-crafted prompt average-কেও ছাড়িয়ে যায়।

### 33.4 Black-box setting: Qwen-2.5-7B-Instruct

Average results:

| Prompt type | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Human-crafted prompt | 0.436 | 0.431 |
| Forward prompt | 0.350 | 0.374 |
| Inversion prompt, ours | 0.484 | 0.495 |
| Relative gain | ↑38% | ↑32% |

আবারও reported average-এ inversion prompt সবচেয়ে ভালো perform করে।

### 33.5 White-box setting: LLaMA-3.1-8B-WhiteBox

Average results:

| Prompt type | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Human-crafted prompt | 0.374 | 0.380 |
| Forward prompt | 0.303 | 0.318 |
| Inversion prompt, ours | 0.404 | 0.406 |
| Relative gain | ↑33% | ↑28% |

### 33.6 White-box setting: Qwen-2.5-7B-WhiteBox

Average results:

| Prompt type | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Human-crafted prompt | 0.420 | 0.432 |
| Forward prompt | 0.314 | 0.325 |
| Inversion prompt, ours | 0.484 | 0.489 |
| Relative gain | ↑60% | ↑54% |

### 33.7 Results table থেকে main takeaway

Reported black-box এবং white-box setting জুড়ে inversion prompts সাধারণত forward prompts-এর চেয়ে ভালো perform করে এবং average-এ human-crafted prompts-কেও অনেক ক্ষেত্রে outperform করে।

---

## 34. GPT results

### 34.1 Black-box inversion prompt সহ GPT-4o-mini results

Page 46 evaluator হিসেবে GPT-4o-mini ব্যবহার করে।

Black-box prompt-এর জন্য:

| Prompt type | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Forward Prompt-BB | 0.434 | 0.451 |
| Inversion Prompt-BB | 0.533 | 0.556 |
| Relative gain | ↑23% | ↑23% |

### 34.2 White-box inversion prompt সহ GPT-4o-mini results

White-box prompt-এর জন্য:

| Prompt type | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Forward Prompt-WB | 0.468 | 0.480 |
| Inversion Prompt-WB | 0.509 | 0.522 |
| Relative gain | ↑9% | ↑9% |

### 34.3 Slide conclusions

Page 46 বলছে:

- inversion prompt GPT-4-এও forward prompt-এর চেয়ে generally better perform করে;
- original model, Qwen-এ ব্যবহারের তুলনায় relative gain ছোট;
- inversion prompt higher quality হলেও, শুধু **model-specific prompt** full potential exploit করতে পারে।

---

## 35. Sensitivity analysis: model sensitivity

### 35.1 What was tested

Page 47 Qwen এবং LLaMA দিয়ে generated prompt swap করে। এটি black-box এবং white-box setting-এ generated prompt-ও compare করে।

### 35.2 Main finding

Slide বলছে:

> Each model performed best with its own model tailored, inversion-generated prompt.

### 35.3 LLaMA-3.1-8B-Instruct results

Average results:

| Prompt | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Forward Prompt | 0.318 | 0.327 |
| Inversion Prompt-Qwen | 0.384 | 0.399 |
| Inversion Prompt-WB | 0.420 | 0.405 |
| Inversion Prompt, ours | 0.423 | 0.433 |

Best average $r$ model-এর own inversion prompt থেকে আসে।

### 35.4 Qwen-2.5-7B-Instruct results

Average results:

| Prompt | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Forward Prompt | 0.350 | 0.374 |
| Inversion Prompt-LLaMA | 0.448 | 0.458 |
| Inversion Prompt-WB | 0.456 | 0.463 |
| Inversion Prompt, ours | 0.484 | 0.495 |

Model-এর own inversion prompt সবচেয়ে ভালো perform করে।

### 35.5 Key conclusion

Page 47 central question repeat করে:

> So why assume a single evaluation prompt works for all LLMs? i.e. models exhibit different behaviours.

---

## 36. Sensitivity analysis: numerical sensitivity

### 36.1 What was tested

Page 48 বলছে numerical sensitivity experiment inverse input চারভাবে modify করেছে:

1. original prompt;
2. one decimal place;
3. remove score range;
4. remove all scores।

### 36.2 Average results

Qwen-2.5-7B-Instruct-এর জন্য:

| Variant | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Inversion Prompt | 0.484 | 0.495 |
| One Decimal Place | 0.477 | 0.472 |
| Without Score Range | 0.464 | 0.478 |
| Without Score | 0.469 | 0.461 |

### 36.3 Example input modifications

Visual examples consistency score ভিন্নভাবে represent করা দেখায়।

#### Original

Prompt-এ score range এবং precise score থাকে, যেমন:

$$
0.66666
$$

#### One decimal place

Score round করা হয়:

$$
0.7
$$

#### Remove score range

Explicit range “between 0 and 1” remove করা হয়, কিন্তু score থাকে।

#### Remove all scores

Score value পুরোপুরি remove করা হয়।

### 36.4 Key conclusion

Inverse input-এর numerical detail performance affect করে। Table-এ original prompt variant-এর average score সবচেয়ে বেশি।

---

## 37. Case study: prompt comparison

### 37.1 Prompt types compared

Page 49 compare করে:

- forward prompts;
- human-crafted prompts;
- inversion prompts।

### 37.2 Prompt components

Slide তিনটি prompt component identify করে:

1. **Model instruction**।
2. **Evaluation criteria**।
3. **Evaluation guideline**।

### 37.3 Forward prompt

Forward prompt example summary এবং article-এর মধ্যে consistency-তে focus করে। এটি criteria list করে যেমন:

- comprehensive coverage;
- accuracy;
- relevance;
- precision;
- brevity।

তারপর বলে summaries original article-এর সঙ্গে consistency-এর জন্য evaluate করা হবে।

### 37.4 Human-crafted prompt

Human-crafted prompt বলে:

- model-কে একটি news article দেওয়া হবে;
- model-কে একটি summary দেওয়া হবে;
- task হলো একটি metric-এ summary rate করা।

এতে অন্তর্ভুক্ত আছে:

- evaluation criteria: 1-5 scale-এ consistency;
- evaluation steps:
  1. article carefully পড়া এবং main facts/details identify করা;
  2. summary পড়া এবং article-এর সঙ্গে compare করা;
  3. consistency score assign করা।

### 37.5 Inversion prompt

Inversion prompt বেশি detailed এবং formal। এটি বলে AI assistant detailed article-এর ভিত্তিতে summary-এর factual consistency evaluate করার task পেয়েছে।

এটি evaluator-কে instruct করে:

1. article-এর content-এর relation-এ summary-এর প্রতিটি sentence examine করতে;
2. factual inconsistencies, misrepresentations, contradictions, বা omitted key details identify করতে;
3. 0 থেকে 1 scale-এ factual consistency score assign করতে।

এটি আরও define করে:

- $1$: perfect factual consistency;
- $0$: complete factual inconsistency।

Promptটি আরও evaluation guideline দেয়: summary factually consistent তখনই যখন প্রতিটি sentence article দ্বারা logically entailed হয় এবং কোনো contradiction present থাকে না।

---

## 38. Prompt comparison: LLaMA vs Qwen

### 38.1 LLaMA prompt style

Page 50 বলছে:

- LLaMA prompt-এ বেশি conversational এবং কম formal phrasing style দেখা যায়।

### 38.2 Qwen prompt style

Page 50 বলছে:

- Qwen evaluation criteria এবং guideline-এর দিক থেকে বেশি rigorous এবং formal instruction generate করে।

Specifically, Qwen:

- model instruction পরিষ্কারভাবে separate করে;
- evaluation criteria পরিষ্কারভাবে separate করে;
- evaluation guideline পরিষ্কারভাবে separate করে।

### 38.3 Contrast

Slide বলে LLaMA এই element-গুলো বেশি loosely blend করে।

### 38.4 Key takeaway

Prompt style model-dependent, যা lecture-এর central claim support করে: effective LLM-based evaluation-এর জন্য model-specific prompt গুরুত্বপূর্ণ।

---

## 39. Conclusion of inversion-learning section

Page 51 বলছে:

- inversed instruction tuning inversion learning-এর মাধ্যমে automatically high-quality, model-specific evaluation prompt generate করে;
- methodটি single evaluation sample থেকে efficiently high-quality prompt generate করে;
- দুইটি LLM family, তিনটি evaluation task, এবং চারটি dataset জুড়ে experiment confirm করে যে effective LLM-based evaluation-এর জন্য model-specific prompt essential।

---

## 40. Formula and algorithm sheet

### 40.1 Reward modelling loss

$$
\mathcal{L}_{\text{ranking}}
=
-\log
\left(
\sigma
\left(
r_\theta(x, y_c)
-
r_\theta(x, y_r)
\right)
\right)
$$

Definitions:

- $x$: prompt;
- $y_c$: chosen response;
- $y_r$: rejected response;
- $r_\theta(x,y)$: scalar reward output;
- reward difference human preference-এর log odds represent করে।

### 40.2 PPO ratio

$$
r_t(\theta)
=
\frac{
\pi_\theta(a_t \mid s_t)
}{
\pi_{\theta_{\text{old}}}(a_t \mid s_t)
}
$$

### 40.3 PPO advantage

$$
A_t
=
\text{reward}
-
\text{baseline}
$$

### 40.4 White-box inversion dataset

$$
\mathcal{D}_{\text{SFT}} = (X, Y)
$$

$$
\mathcal{D}_{\text{Inv}} = (Y, X)
$$

### 40.5 Black-box inversion distillation

$$
\tilde{y}
=
\mathcal{M}_{\text{Instruct}}(x)
$$

$$
\mathcal{D}_{\text{Inv}}
=
\{(\tilde{Y}, X)\}
$$

### 40.6 Inversion fine-tuning objective

$$
\tilde{\theta}
=
\arg\min_{\theta}
\mathbb{E}_{(y,x)\sim \mathcal{D}_{\text{Inv}}}
\left[
\mathcal{L}
\left(
\mathcal{M}(y;\theta), x
\right)
\right]
$$

### 40.7 Chain-of-thought answer format

```text
<think> Chain of thought reasoning for task. </think> Final response.
```

---

## 41. Worked examples preserved

### 41.1 Instruction tuning: nitrogen boiling point

Input:

> Please answer the following question.  
> What is the boiling point of Nitrogen?

Output:

```text
-320.4F
```

### 41.2 Chain-of-thought instruction tuning: cafeteria apples

Input:

> The cafeteria had 23 apples. If they used 20 for lunch and bought 6 more, how many apples do they have?

Reasoning:

$$
23 - 20 = 3
$$

$$
3 + 6 = 9
$$

Answer:

$$
9
$$

### 41.3 Generalisation to unseen task: Hinton and Washington

Input:

> Can Geoffrey Hinton have a conversation with George Washington?  
> Give the rationale before answering.

Reasoning shown:

- Geoffrey Hinton 1947 সালে জন্মেছিলেন।
- George Washington 1799 সালে মারা যান।
- তাই তারা একসঙ্গে conversation করতে পারতেন না।

Answer:

```text
no
```

### 41.4 Chain-of-thought multiplication: $13 \times 27$

Steps:

$$
7 \times 3 = 21
$$

Carry 2।

$$
7 \times 1 = 7
$$

$$
7 + 2 = 9
$$

$$
13 \times 7 = 91
$$

$$
20 \times 13 = 260
$$

$$
260 + 91 = 351
$$

Answer:

$$
351
$$

### 41.5 Inversion learning: original vs distillation philosophers example

Input notable philosophers, তাদের contribution, এবং historical/cultural context চায়।

Original output এবং distillation output দুটিই Socrates এবং Plato নিয়ে আলোচনা করে, কিন্তু distillation output response-টিকে এমন section দিয়ে restructure করে:

- contributions;
- key ideas;
- historical and cultural context।

এটি black-box inversion dataset distillation illustrate করে: known input ব্যবহার করে instruction-tuned model থেকে output generate করা, তারপর generated output ব্যবহার করে inverse mapping train করা।

---

## 42. Discussion questions captured

Slides-এ এই discussion questions আছে:

1. Raw foundation model customer support-এ সরাসরি deploy করলে, language fluent হলেও কী failure হতে পারে?
2. Humans-কে প্রতিটি answer-এ absolute 1-10 score দিতে বলার চেয়ে pairwise comparison কেন সহজ ও বেশি reliable হতে পারে?
3. “Expert” শুনলে আমরা history বা medicine-এর মতো topic expert ভাবতে পারি; তাহলে model কেন প্রায়ই lower-level expert শেখে?
4. Fixed budget থাকলে কখন bigger model-এ spend করা ভালো, আর কখন model-কে test time-এ longer thinking করতে দেওয়া ভালো?
5. Pretraining, instruction tuning, এবং alignment—প্রতিটিকে এক sentence-এ কীভাবে আলাদা করে explain করবে?
6. একই summary-তে দুই evaluator model ভিন্ন score দিলে, একটি model simply wrong conclude করার আগে কোন possible cause consider করা উচিত?

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Slides প্রশ্নগুলো অন্তর্ভুক্ত করে, কিন্তু lecturer-এর answer নেই।

---

## 43. Exam flags

### 43.1 Explicit exam flags

Visible slide text-এ “this will be on the exam,” “you should know this,” “common mistake,” বা equivalent কিছু নেই।

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] Transcript ছাড়া spoken exam cue check করা যায় না।

### 43.2 Slide emphasis থেকে high-value revision targets, explicit exam flags নয়

এগুলো explicit exam flag নয়, কিন্তু lecture-এর central বিষয়:

1. Foundation model এবং instruction-tuned model-এর difference।
2. Instruction tuning কেন next-token prediction এবং user intent-এর mismatch কমায়।
3. HHH alignment principles: helpful, honest, harmless।
4. Reward modelling setup:

   

$$
y_c,\ y_r,\ r_\theta(x,y)
$$

   এবং pairwise ranking loss।
5. PPO motivation: destructive collapse ছাড়া sufficiently large update নেওয়া।
6. PPO ratio:

   

$$
r_t(\theta)
   =
   \frac{\pi_\theta(a_t|s_t)}
   {\pi_{\theta_{\text{old}}}(a_t|s_t)}
$$

7. RLHF এবং DPO-এর difference।
8. GRPO vs PPO trade-offs।
9. MoE definition এবং কেন “experts” low-level token specialist হতে পারে।
10. Chain-of-Thought prompting এবং reasoning step বনাম final response-এর distinction।
11. Inversion learning as $Y \mapsto X$, standard instruction tuning as $X \mapsto Y$-এর contrast।
12. White-box vs black-box inversion setup।
13. Model-specific prompt effective LLM-based evaluation-এর জন্য essential—এই conclusion।

---

## 44. Connections to earlier/later material and applications

### 44.1 Connection to pretraining

Lecture post-training-কে large-scale next-token prediction-এর সঙ্গে connect করে, যেখানে self-supervised learning base model produce করে।

### 44.2 Connection to prompting and inference

Pipeline diagram aligned model-কে inference-time technique-এর সঙ্গে connect করে:

- In-Context Learning;
- few-shot prompting;
- Chain-of-Thought;
- Tree of Thought;
- Retrieval-Augmented Generation।

### 44.3 Connection to safety and security

Pipeline explicitভাবে অন্তর্ভুক্ত করে:

- security evaluation;
- red teaming;
- inversion attacks;
- model/prompt inversion;
- prompt বা training data recovery;
- post-deployment evaluation।

এটি inversion-learning section-এর পূর্বাভাস দেয়।

### 44.4 Connection to NLG evaluation

Second half alignment এবং prompt design-কে generated text evaluation-এর সঙ্গে connect করে, যার মধ্যে আছে:

- summarisation;
- dialogue;
- machine translation;
- human evaluation;
- LLM-based evaluation।

### 44.5 Connection to model families

Inversion-learning experiments compare করে:

- Qwen;
- LLaMA;
- transfer-style evaluation-এ GPT-4o-mini।

Prompt comparison দেখায় different model family different prompt style produce বা require করে।

---

## 45. Unclear sections to revisit in the recording/transcript

### 45.1 Missing transcript

[UNCLEAR: ট্রান্সক্রিপ্ট অনুপস্থিত] আলাদা lecture transcript অন্তর্ভুক্ত ছিল না, তাই spoken elaboration, examples, jokes, exam hints, এবং corrections পাওয়া যায়নি।

### 45.2 Transformer architecture

[UNCLEAR] Agenda Transformer architecture এবং training paradigms mention করে, কিন্তু visible slides বিস্তারিত Transformer architecture material অন্তর্ভুক্ত করে না।

### 45.3 PPO clipped objective

[UNCLEAR] Slides PPO ratio, advantage, এবং clipping motivation define করে, কিন্তু full clipped PPO objective দেয় না।

### 45.4 DPO loss

[UNCLEAR] Slides বলে DPO direct exact optimisation with binary cross entropy ব্যবহার করে, কিন্তু DPO loss formula দেয় না।

### 45.5 GRPO formal objective

[UNCLEAR] Slides group-relative advantage এবং functional rewards describe করে, কিন্তু exact GRPO objective দেয় না।

### 45.6 MoE routing details

[UNCLEAR] Slides expert এবং gating define করে, কিন্তু top-$k$ routing, load balancing, বা mathematical gating function specify করে না।

### 45.7 Test-time compute methodology

[UNCLEAR] Charts generation budget এবং test-time search-এর সঙ্গে improved accuracy দেখায়, কিন্তু slides detailed experimental setup explain করে না।

### 45.8 Metrics $\rho$ and $r$

[UNCLEAR] Results table $\rho$ এবং $r$ ব্যবহার করে, কিন্তু slides এগুলো define করে না।

### 45.9 Inversion-learning paper details

[UNCLEAR] Slides inversion-learning method এবং results summarise করে, কিন্তু detailed dataset construction, hyperparameters, এবং prompt-generation procedure visible নয়।
