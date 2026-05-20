---
subject: COMP64702
chapter: 6
title: "SFT, Alignment & Inversion"
language: en
---

# Supervised Fine-Tuning, Alignment, Reasoning Models, and Inversed Instruction Tuning — Study Notes

**Topic and scope:** This lecture is about post-training large language models: supervised fine-tuning, instruction tuning, human alignment methods such as RLHF/PPO/DPO/GRPO, Mixture-of-Experts scaling, reasoning models, and inversed instruction tuning / inversion learning for model-specific NLG evaluation prompts. It fits into the broader LLM pipeline as the stage after raw pretraining, where models are made useful, controllable, aligned, scalable, and evaluable.

**Course:** [UNCLEAR: course not specified in the uploaded material]  
**Lecture topic:** Supervised Fine-Tuning (SFT), Alignment, Reasoning Models, and Inversed Instruction Tuning  
**Lecturer:** Jingyuan Sun, Department of Computer Science, The University of Manchester  
**Sources used:** Uploaded slide deck `TRIM_week6_SFT_alignment_inversion_reduced45_with_scripts-1.pdf`. Page references below refer to this slide deck.  
**Transcript status:** [UNCLEAR: separate transcript missing] No separate auto-generated transcript was included in the uploaded material available here. These notes use the slide text, diagrams, tables, and embedded visual content. Spoken elaboration, examples, and exam cues from the recording cannot be verified.

---

## 1. Lecture roadmap

### 1.1 Main agenda

The lecture is organised around five main themes, shown on page 2:

1. **The foundation:** Transformer architecture and training paradigms.
2. **From raw models to useful assistants:** instruction tuning.
3. **Human alignment:** RLHF, PPO, and DPO.
4. **Mixture of Experts models.**
5. **Reasoning models:** Chain-of-Thought and beyond.

A second major section begins on page 30 and shifts to **Inversed Instruction Tuning**, specifically for automatically generating high-quality, model-specific prompts for NLG evaluation.

---

## 2. End-to-end LLM pipeline

### 2.1 Full pipeline shown in the diagram

The pipeline diagram on page 3 breaks the lifecycle of an LLM into five broad stages.

#### Stage 1: Data preparation

Raw data sources include:

- web;
- books;
- code;
- other text sources.

The data preparation pipeline includes:

- filtering;
- de-duplication;
- formatting;
- tokenization.

This produces a **cleaned pretraining corpus**.

#### Stage 2: Pretraining

The cleaned corpus is used for pretraining. The slide describes this as:

- **self-supervised learning on a corpus**;
- learning **language patterns, facts, and reasoning**.

The output is a **base model**, with examples given as:

- LLaMA-3-Base;
- GPT-3-Base.

#### Stage 3: Post-training: alignment and fine-tuning

The post-training block has two main steps.

First, **instruction tuning**:

- uses **Supervised Fine-Tuning (SFT)** on instruction-response pairs;
- trains the model to follow instructions.

This produces an **instruction-tuned model**.

Second, **policy optimisation / reinforcement learning**:

- collects preference data;
- trains a reward model;
- optimises the model with PPO/DPO;
- aims to maximise human preference scores.

This produces an **aligned model**, with examples given as:

- LLaMA-3-Instruct;
- ChatGPT.

#### Stage 4: Inference and application

At inference time, the user gives a prompt. The diagram includes:

- prompting and interaction techniques;
- In-Context Learning (ICL), especially examples and few-shot prompting;
- Chain-of-Thought (CoT), described as step-by-step reasoning;
- Tree of Thought (ToT), described as exploring possibilities;
- inference;
- Retrieval-Augmented Generation (RAG), where the model retrieves relevant documents from an external knowledge base;
- final response generation.

#### Stage 5: Security evaluation and red teaming

The diagram explicitly includes:

- testing against **inversion attacks**, including model inversion and prompt inversion;
- analysing whether prompts or training data can be recovered;
- post-deployment evaluation.

This connects directly to the later material on **inversed instruction tuning** and inversion learning.

---

## 3. Foundation models vs instruction-tuned models

### 3.1 Foundation models

#### Intuition

A foundation model is a raw pretrained language model. It can generate fluent text and has broad knowledge, but it is not necessarily easy to control as an assistant.

#### Slide definition / properties

Page 4 lists foundation models as having:

- coherent, fluent generation;
- completion and continuation ability;
- vast world knowledge.

But they also have serious limitations:

- potentially harmful outputs;
- difficult to control;
- misaligned with human values.

### 3.2 Instruction-tuned models

#### Intuition

An instruction-tuned model is a pretrained model further trained to respond to user instructions, making it more like an assistant rather than a pure text-completion engine.

#### Slide definition / properties

Page 4 lists instruction-tuned models as having:

- foundation ability and more;
- controllability by prompt;
- less need for fine-tuning;
- ability to follow commands.

But the slide also notes trade-offs:

- slight hit to performance;
- sensitivity to prompt template.

### 3.3 Key contrast

| Aspect | Foundation model | Instruction-tuned model |
|---|---|---|
| Main training behaviour | Completion / continuation | Following instructions |
| Control | Difficult to control | More controllable by prompts |
| Alignment | May be misaligned | More aligned with requested tasks |
| Risks | Harmful outputs, value mismatch | Sensitive to prompt format/template |
| Use as assistant | Not directly ideal | Much more suitable |

---

## 4. Instruction tuning

### 4.1 Before instruction tuning

Page 5 states that before instruction tuning, the model is:

- trained to minimise **next-token prediction loss** on large corpora;
- not explicitly trained to follow user instructions.

#### Intuition

The pretrained model learns to predict plausible continuations of text. That is powerful, but it does not directly teach the model to interpret a user request as a command and respond helpfully.

### 4.2 Motivation for instruction tuning

Instruction tuning is motivated by the need to:

- reduce the mismatch between the training objective and user intent;
- provide useful information;
- reliably respond to instructions.

### 4.3 Key concept: instruction tuning

#### Intuition

Instruction tuning turns a general pretrained language model into a model that behaves more like an assistant.

#### Formal definition from slides

Instruction tuning uses **Supervised Fine-Tuning on instruction-response pairs** so the model learns to follow instructions.

### 4.4 Discussion question

Page 6 asks:

> If you deployed a raw foundation model directly in customer support, what kinds of failures would you expect, even if the language sounds fluent?

[UNCLEAR: transcript missing] The slide includes the question, but the lecturer's spoken answer is unavailable.

---

## 5. Instruction tuning examples

### 5.1 Standard instruction fine-tuning example

Page 7 gives a simple factual question:

> Please answer the following question.  
> What is the boiling point of Nitrogen?

The model output shown is:

```text
-320.4F
```

This illustrates simple instruction-following for direct question answering.

### 5.2 Chain-of-thought fine-tuning example

Page 7 gives a step-by-step reasoning instruction:

> Answer the following question by reasoning step-by-step.  
> The cafeteria had 23 apples. If they used 20 for lunch and bought 6 more, how many apples do they have?

The output shown reasons:

```text
The cafeteria had 23 apples originally. They used 20 to make lunch.
So they had 23 - 20 = 3.
They bought 6 more apples, so they have 3 + 6 = 9.
```

So the final answer is:

$$
9
$$

This example demonstrates that instruction tuning can include not only final answers but also intermediate reasoning traces.

### 5.3 Generalisation to unseen tasks

The page 7 diagram labels the training side as:

> Multi-task instruction finetuning, 1.8K tasks

Below the dashed line, it labels inference as:

> generalization to unseen tasks

The example unseen task asks:

> Can Geoffrey Hinton have a conversation with George Washington?  
> Give the rationale before answering.

The model output reasons that Geoffrey Hinton was born in 1947 and George Washington died in 1799, so they could not have had a conversation. The final answer is:

```text
no
```

#### Important point

Instruction tuning is not only about memorising specific tasks. The slide emphasises generalisation from many instruction-following tasks to unseen tasks.

---

## 6. HHH guiding principles

Page 8 presents **HHH** as guiding principles for aligned assistant behaviour:

1. Helpful.
2. Honest.
3. Harmless.

### 6.1 Helpful

A helpful model should:

- comprehend the user's intentions;
- execute requested actions correctly;
- offer relevant supporting information and alternate solutions.

#### Intuition

Helpfulness is about doing the task the user actually asked for, not merely producing fluent text.

### 6.2 Honest

An honest model should:

- provide truthful, meaningful, and specific information;
- admit when it is unable to produce relevant or correct information;
- make clear when it is presenting a hypothesis instead of a fact.

#### Intuition

Honesty is about avoiding false confidence and being clear about uncertainty.

### 6.3 Harmless

A harmless model should:

- avoid offensive terminology or ideology;
- avoid providing information about potentially dangerous activities;
- refuse unlawful activities;
- detect attempts to deceive or manipulate it into providing illicit information.

#### Intuition

Harmlessness is about safety and refusal behaviour, not just politeness.

---

## 7. Prompt templates

### 7.1 Why prompt templates matter

The foundation-vs-instruction-tuned comparison on page 4 notes that instruction-tuned models are **sensitive to prompt template**. Page 9 gives concrete templates for LLaMA2, Qwen, and Phi-2.

### 7.2 LLaMA2 prompt template

The LLaMA2 chat-style format shown on page 9 is:

```text
<s>[INST] <<SYS>>

{{ system_prompt }}

<</SYS>>

{{ user_message }} [/INST]
```

#### Interpretation

The template separates:

- system prompt;
- user message;
- instruction delimiters.

[UNCLEAR: transcript missing] The slide gives the template but does not explain how much performance changes when the template is changed.

### 7.3 Qwen prompt template

The Qwen-style template shown on page 9 is:

```text
<|im_start|>system
{system_message}<|im_end|>
<|im_start|>user
{prompt}<|im_end|>
<|im_start|>assistant
```

#### Interpretation

This format explicitly marks:

- system message;
- user message;
- assistant start.

### 7.4 Phi-2 prompt template

The Phi-2-style template shown on page 9 is:

```text
Instruction: {{instruction}}

Output:
```

#### Key point

Different model families expect different prompt formats. This later connects strongly to the inversion-learning section, where model-specific prompts are shown to matter.

---

## 8. Reinforcement Learning with Human Feedback

### 8.1 RLHF workflow

The RLHF diagram on page 10 shows a workflow based on LLaMA2:

1. Pretraining data is used for self-supervised learning.
2. This produces a base model, shown as LLaMA 2.
3. The model undergoes supervised fine-tuning.
4. Human feedback provides human preference data.
5. Separate reward models are shown:
   - safety reward model;
   - helpful reward model.
6. Fine-tuning involves:
   - rejection sampling;
   - Proximal Policy Optimisation.
7. The final model is LLaMA-2-chat.

### 8.2 Key concept: RLHF

#### Intuition

RLHF uses human preference feedback to make a model's outputs better aligned with what humans prefer, including helpfulness and safety.

#### Formal description from slides

RLHF uses human preference data, reward models, and fine-tuning methods such as rejection sampling and PPO.

[UNCLEAR: transcript missing] The slide does not provide the detailed algorithmic sequence for collecting preferences, training reward models, or running PPO updates.

---

## 9. Reward modelling

### 9.1 Pairwise preference setup

Page 11 uses a **binary pairwise ranking loss**.

Notation:

- $r_\theta(x, y)$ is the scalar reward output for prompt $x$ and response $y$.
- $y_c$ is the chosen response in the pairwise matchup.
- $y_r$ is the rejected response.

### 9.2 Reward model loss

The slide gives:

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

- $x$ is the prompt;
- $y_c$ is the chosen response;
- $y_r$ is the rejected response;
- $r_\theta(x,y)$ is the reward model's scalar score;
- $\sigma(\cdot)$ is the sigmoid function.

### 9.3 Meaning of the loss

Page 11 states:

> The difference in reward represents the log odds that one response is preferred by human labellers.

#### Intuition

The reward model is trained so that the chosen response receives a higher reward than the rejected response. The larger the reward difference

$$
r_\theta(x, y_c) - r_\theta(x, y_r),
$$

the more confidently the model predicts that $y_c$ is preferred.

### 9.4 Discussion question

Page 12 asks:

> Why might pairwise comparison be easier and more reliable than asking humans to give every answer an absolute score from 1 to 10?

[UNCLEAR: transcript missing] The uploaded slides include the question but not the lecturer's spoken answer.

---

## 10. Proximal Policy Optimisation

### 10.1 Motivation

Page 13 frames the motivation as:

> How can we take the biggest improvement step on a policy using the currently available data, without stepping so far we cause collapse?

The slide contrasts:

- **small policy steps**, which often converge but take a long time;
- **large policy steps**, which may converge faster but may collapse irrecoverably.

### 10.2 Ratio function

The slide defines the ratio function:

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

- $\pi_\theta$ is the current policy;
- $\pi_{\theta_{\text{old}}}$ is the old policy;
- $a_t$ is the action at time $t$;
- $s_t$ is the state at time $t$.

### 10.3 Advantage

The slide defines:

$$
A_t = \text{reward} - \text{baseline}
$$

#### Intuition

The advantage measures whether the outcome is better or worse than a baseline expectation.

### 10.4 Clipping

The slide states:

> Clipping prevents destructive updates.

### 10.5 Key concept: PPO

#### Intuition

PPO updates the model policy while limiting how far the new policy can move from the old policy.

#### Formal content given in slides

The visible formal content is:

- the ratio function $r_t(\theta)$;
- the advantage definition $A_t$;
- the clipping motivation.

[UNCLEAR: transcript missing] The slide does not give the full PPO clipped objective.

---

## 11. Direct Preference Optimisation

### 11.1 Motivation

Page 14 states that Rafailov et al. argue the reward modelling approach is:

- too complex;
- unstable.

### 11.2 Core proposal

DPO replaces the RLHF procedure with:

- direct optimisation;
- exact optimisation;
- binary cross entropy.

The slide contrasts two procedures.

#### RLHF

Preference data goes into a reward model. The reward model then labels rewards. Reinforcement learning samples completions and updates the LM policy.

#### DPO

Preference data directly trains the final language model using maximum likelihood.

### 11.3 Key concept: DPO

#### Intuition

DPO avoids training a separate reward model and running a separate RL loop.

#### Formal description from slides

DPO replaces RLHF with a direct, exact optimisation using binary cross entropy.

[UNCLEAR: transcript missing] The slide does not provide the DPO loss formula.

---

## 12. Group Relative Policy Optimisation

### 12.1 GRPO diagram

Page 15 compares PPO and GRPO. The diagram states that GRPO:

- processes a group of outputs simultaneously;
- calculates advantage scores in groups;
- avoids the complicated calculation of $A_{i,t}$;
- adds KL divergence between the trained policy and the reference policy directly to the loss;
- forgoes the value model;
- estimates the baseline from group scores;
- significantly reduces training resources.

### 12.2 GRPO mechanics from the slides

Page 16 states:

- the reward model is replaced with a series of rule-based rewards as Python functions that proxy desired behaviour;
- averaged reward from multiple generations eliminates the need for a value model;
- multiple outputs for a given prompt are processed simultaneously;
- advantage scores are calculated relative to the group;
- this aligns with the original reward model objective.

### 12.3 Key concept: GRPO

#### Intuition

GRPO compares multiple generated outputs for the same prompt and computes relative advantage within the group, reducing reliance on a separate value model.

#### Formal content from slides

No explicit GRPO objective is given. The slides define it procedurally through:

- group outputs;
- rule-based rewards;
- group-relative advantage;
- no value model.

[UNCLEAR: transcript missing] The exact GRPO loss and exact group advantage calculation are not provided in the visible slides.

---

## 13. GRPO vs PPO

### 13.1 GRPO advantages and limitations

Page 17 lists GRPO as having the following advantages:

- no value model needed;
- higher sample efficiency;
- functional rewards.

Page 17 lists GRPO as having the following limitations:

- less studied and optimised;
- sensitive to batching;
- quite expensive, using 2 models.

### 13.2 PPO advantages and limitations

Page 17 lists PPO as having the following advantages:

- well-studied and stable;
- strong theoretical backing;
- reliable across domains.

Page 17 lists PPO as having the following limitations:

- expensive, using 4 models;
- sensitive to hyperparameters;
- slower convergence.

### 13.3 Comparison table

| Method | Strengths | Weaknesses |
|---|---|---|
| GRPO | No value model, higher sample efficiency, functional rewards | Less studied, batching-sensitive, still expensive |
| PPO | Well-studied, stable, theoretical backing, reliable across domains | Expensive, hyperparameter-sensitive, slower convergence |

---

## 14. Mixture of Experts

### 14.1 Definition

Page 19 defines Mixture of Experts as:

> Several separate networks, joined together, which are specialised in a different region of the feature space. At inference, one or more experts are chosen by a gating network.

### 14.2 Intuition

A Mixture-of-Experts model contains multiple expert subnetworks. Instead of activating the whole model in the same way for every input, a gating network selects which expert or experts should process the current input.

### 14.3 Diagram interpretation

The MoE diagram on page 19 shows:

- a standard model path containing MoE layers;
- inside an MoE layer, multiple experts;
- a gating network that selects or weights experts;
- outputs combined after the selected expert computation.

[UNCLEAR: transcript missing] The visible slides do not specify the mathematical gating function, top-$k$ routing rule, or load-balancing loss.

---

## 15. What experts learn

### 15.1 Main claim

Page 20 states:

- encoder experts specialise in shallow concepts or groups of tokens;
- this may produce, for example, a punctuation expert or proper noun expert;
- decoder experts have less specialisation.

### 15.2 Examples from the table

The table on page 20 shows expert specialisations such as:

- **sentinel tokens**;
- **punctuation**;
- **conjunctions and articles**;
- **verbs**;
- **visual descriptions**, including colour and spatial position;
- **proper names**;
- **counting and numbers**, including written and numerical forms.

### 15.3 Key point

The lecture explicitly contrasts the intuitive meaning of “expert” with what the slide shows. In MoE models, experts may be low-level token or feature specialists rather than human-like topic specialists such as medicine, law, or history.

### 15.4 Discussion question

Page 21 asks:

> When you hear the word ‘expert’, you might imagine topic experts like history or medicine. Why do you think models often learn much lower-level experts instead?

[UNCLEAR: transcript missing] The slides include the question but not the spoken answer.

---

## 16. To MoE or not to MoE

### 16.1 Advantages

Page 22 lists the advantages of MoE as:

- fewer activations;
- faster pretraining;
- experts on different devices;
- sparsity.

### 16.2 Disadvantages

Page 22 lists disadvantages as:

- challenging to fine-tune;
- prone to overfitting;
- much higher complexity;
- whole model must be in memory.

### 16.3 Key concept: sparse activation

#### Intuition

MoE can be computationally efficient because only part of the model is activated for a given input.

#### Slide-supported trade-off

Even if fewer experts are active during computation, the whole model may still need to reside in memory.

---

## 17. Reasoning models

### 17.1 Chain-of-Thought prompting

Page 24 defines Chain-of-Thought prompting as prompting that encourages the model to:

> think step by step.

It says this turns a hard task into a series of simple tasks.

### 17.2 Benefits of Chain-of-Thought

The slide lists three key benefits:

- improves accuracy on complex reasoning tasks;
- creates transparent, verifiable solutions;
- reduces common reasoning errors.

### 17.3 Worked example: $13 \times 27$

Page 24 gives:

> Solve $13 \times 27$.

The reasoning shown is:

First multiply:

$$
7 \times 3 = 21
$$

Carry 2.

Then:

$$
7 \times 1 = 7
$$

Add the carried 2:

$$
7 + 2 = 9
$$

So:

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

### 17.4 Note on the example

The arithmetic is presented as a step-by-step decomposition. The final answer is:

$$
351
$$

---

## 18. Reasoning model format

### 18.1 Two-stage structure

Page 25 describes two stages:

1. reasoning / thinking step;
2. response.

The slide gives the format:

```text
<think> Chain of thought reasoning for task. </think> Final response.
```

### 18.2 Test-time thinking

The slide states:

- the model can spend arbitrary time exploring different ideas;
- typically, the longer spent “thinking,” the better the performance.

[UNCLEAR: transcript missing] The slide does not define limits, stopping criteria, or how the “thinking” budget is controlled.

---

## 19. Test-time compute

### 19.1 Slide title

Page 26 is titled:

> Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters.

### 19.2 Visual evidence shown

The page contains four plots.

#### Plot 1: Iteratively revising answers at test time

This plot shows MATH accuracy increasing with generation budget. It compares methods such as:

- majority;
- best-of-$N$ weighted;
- compute optimal;
- parallel.

#### Plot 2: Comparing test-time and pretraining compute in a FLOPs-matched evaluation

This bar chart shows relative improvement from test-time compute across:

- easy questions;
- medium questions;
- hard questions.

The visual suggests test-time compute helps differently depending on question difficulty and the ratio of inference tokens to pretraining tokens.

#### Plot 3: Test-time search against a PRM verifier

This plot compares:

- majority;
- ORM best-of-$N$ weighted;
- PRM best-of-$N$ weighted;
- PRM compute optimal.

MATH accuracy rises as generation budget increases.

#### Plot 4: Another FLOPs-matched comparison

The final bar chart shows varying gains/losses across easy, medium, and hard questions.

### 19.3 Key point

The slide's title states the takeaway directly: optimally scaling inference-time compute can be more effective than scaling model parameters.

### 19.4 Discussion question

Page 27 asks:

> If you had a fixed budget, when would it be smarter to spend it on a bigger model, and when would it be smarter to let the model think longer at test time?

[UNCLEAR: transcript missing] The slides include the question and charts but not the lecturer's spoken interpretation.

---

## 20. Summary of first half

Page 29 gives the main takeaways.

### 20.1 Transformers and self-supervised training

Large-scale next-token prediction enables powerful general language representations.

### 20.2 Instruction tuning

Instruction tuning converts raw pretrained models into useful assistants by training on instruction-response pairs.

### 20.3 Human alignment

Human alignment methods, including RLHF, PPO, and DPO, align model behaviour with human preferences, safety, and helpfulness.

### 20.4 Mixture of Experts

MoE improves scalability and efficiency through sparse expert routing.

### 20.5 Reasoning models

Techniques such as Chain-of-Thought improve structured reasoning and problem-solving.

### 20.6 Discussion question

Page 28 asks:

> If you had to explain pretraining, instruction tuning, and alignment in one short sentence each, how would you separate them?

[UNCLEAR: transcript missing] The slide includes the question but not the lecturer's spoken answer.

---

## 21. Inversed instruction tuning

### 21.1 Transition

Page 30 begins the second major part of the lecture:

> Inversed Instruction tuning

This section focuses on prompt-based NLG evaluation and inversion learning.

---

## 22. Problems with prompt-based evaluation

### 22.1 Core problem

Page 31 states:

> Evaluating generated text is now about as hard as generating it!

The lecture identifies two evaluation approaches.

#### Human evaluation

Human evaluation is described as the gold standard, but it can suffer from:

- inconsistency;
- bias;
- lack of standardisation.

#### LLM-based evaluation

LLM-based evaluation is much more scalable, but it is highly sensitive to prompt design.

Even small prompt changes can lead to large performance differences.

### 22.2 Key concept: prompt-based NLG evaluation

#### Intuition

Instead of relying only on humans or automatic metrics, an LLM can be prompted to evaluate generated text.

#### Problem

The evaluation result depends strongly on the prompt, so the evaluator model's score may reflect prompt design as well as actual output quality.

---

## 23. High sensitivity of LLMs to prompt design

### 23.1 Main claims

Page 32 states:

- LLM-based evaluation is highly sensitive to prompts;
- prompts are mostly hand-crafted;
- small design changes can significantly affect output quality;
- subtle variations in few-shot templates led to up to **76-point accuracy shifts** in Polo et al. 2024;
- performance varies with:
  - prompt phrasing;
  - prompt order;
  - numerical scales;
  - implicit biases.

### 23.2 Interpretation

A single prompt is not a neutral evaluation instrument. Its wording, structure, examples, and scoring scale can all affect the model's behaviour.

---

## 24. Extreme prompt example

Page 33 gives an “extreme example” and explicitly labels it:

> Not Recommended.

The prompt frames the model as an expert coder who desperately needs money for cancer treatment, with a fictional corporate reward of \$1B for doing the coding task correctly.

### 24.1 Purpose of the example

The example illustrates how prompt design can become manipulative, theatrical, or overly engineered.

[UNCLEAR: transcript missing] The slide labels the example “not recommended,” but the spoken explanation of why it is not recommended is unavailable.

---

## 25. Prompt-based NLG evaluation and one-size-fits-all prompts

### 25.1 Common practice

Page 34 says that a common practice is to use the same popular human-crafted prompts for evaluation across tasks such as:

- summarisation;
- machine translation;
- other NLG evaluation settings.

These prompts are often reused regardless of the base LLM used as evaluator.

### 25.2 Problem with this assumption

The slide points out:

- human evaluators respond differently to the same evaluation guidelines;
- therefore, it is questionable to assume a single evaluation prompt works for all LLMs;
- models exhibit different behaviours.

### 25.3 Discussion question

Page 35 asks:

> If two evaluator models give different scores to the same summary, what possible causes should we consider before concluding one model is simply wrong?

[UNCLEAR: transcript missing] The slides include the question but not the lecturer's answer.

---

## 26. Inversion modelling

### 26.1 Standard instruction tuning

Page 36 defines standard instruction tuning as:

> Learn the mapping from input instruction to outcomes.

In symbolic terms:

$$
\text{Instruction} \rightarrow \text{Outcome}
$$

The diagram gives the example of an evaluation instruction going into an LLM and producing an output such as:

```json
{
  "article": "...",
  "summary": "...",
  "consistency score": 4.53,
  "...": "..."
}
```

### 26.2 Inversion-based fine-tuning

Page 36 defines inversion-based fine-tuning as:

> Learn the inverse mapping from outcomes to input instructions.

In symbolic terms:

$$
\text{Outcome} \rightarrow \text{Instruction}
$$

The diagram shows the outcome-like object going into an inverse model, which outputs an evaluation prompt.

### 26.3 Key concept: inversion modelling

#### Intuition

Instead of asking “given this prompt, what output does the model produce?”, inversion learning asks “given this desired output/evaluation behaviour, what prompt would produce it?”

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

Page 37 shows:

- multiple prompts:
  - prompt 1;
  - prompt 2;
  - prompt 3;
  - ...;
  - prompt $n$;
- an **Instruct LLM**;
- output score distributions;
- a **good distribution** and **bad distribution** indicated visually;
- a one-shot example;
- an **Inverse LLM** that maps back toward prompts.

### 27.2 Meaning of the diagram

The diagram represents the idea that different prompts produce different output score distributions for an evaluator. The inverse model uses an example outcome to generate or recover an input prompt that better matches the desired evaluation behaviour.

[UNCLEAR: transcript missing] The slide's visual distinction between good and bad distributions is not formalised mathematically.

---

## 28. Inversion learning

### 28.1 Problem studied

Page 38 states that inversion learning studies:

> the problem of generating high-quality, model-specific evaluation prompts.

### 28.2 Core idea

The core idea is:

> learn an effective reverse mapping from model outputs back to their input instructions.

### 28.3 Data requirement

The slide states that the method requires only:

> one evaluation sample, consisting of content plus human score,

to generate an evaluation prompt.

### 28.4 Key concept: model-specific evaluation prompts

#### Intuition

Because different LLMs behave differently under different prompt formats, the best evaluation prompt should be tailored to the evaluator model rather than reused across all models.

---

## 29. Related work on inversion learning

### 29.1 Prompt sensitivity and prompt variants

Pages 39-41 mention several related works.

#### Polo et al. 2024

Recommended estimating performance across multiple prompt variants instead of relying on a single prompt.

#### Qian et al. 2024

Benchmarked different prompt components in MT tasks to identify which elements matter most, such as:

- phrasing;
- ordering;
- scale.

### 29.2 Prompt reconstruction and inversion work

#### Morris et al. 2023

Learned the inverse mapping from next-token probability to prompts:

$$
\text{Logit} \rightarrow \text{Prompt}
$$

#### Petrov et al. 2024

Used gradient-based inversion to recover input tokens:

$$
\text{Gradient} \rightarrow \text{Prompt}
$$

#### Zhang et al. 2024

Used multiple sampled outputs from ChatGPT to reconstruct prompts:

$$
\text{Output} \rightarrow \text{Prompt}
$$

### 29.3 Difference from previous work

Page 41 states that most previous work focuses on:

- jailbreaking;
- reconstructing input prompts used in closed-source models such as ChatGPT.

In contrast, the approach in this lecture aims to:

- improve prompt quality;
- derive model-specific inverse prompts;
- train an inverse model with the same architecture as the forward model;
- require only a single example;
- avoid relying on internal model states such as logits or gradients.

---

## 30. Experimental setup: white-box and black-box settings

### 30.1 White-box setting

Page 42 defines the white-box setting as having:

- full access to both the SFT dataset and the model;
- ability to construct the exact inversion dataset;
- inversion-based fine-tuning.

The slide gives:

$$
\mathcal{D}_{\text{SFT}} = (X, Y)
$$

$$
\mathcal{D}_{\text{Inv}} = (Y, X)
$$

So the inversion dataset reverses the normal SFT mapping.

### 30.2 Black-box setting

Page 42 defines the black-box setting as having:

- no access to SFT data;
- no access to the training pipeline;
- inversion dataset distillation.

The distillation step generates outputs $y$ from known inputs $x$ using an instruction-tuned model.

The slide gives:

$$
\tilde{y} = \mathcal{M}_{\text{Instruct}}(x)
$$

and:

$$
\mathcal{D}_{\text{Inv}} = \{(\tilde{Y}, X)\}
$$

### 30.3 Inversion fine-tuning objective

The slide gives the optimisation objective:

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

The model takes $y$-like outputs as input and learns to reconstruct $x$-like instructions.

---

## 31. Experimental setup: tasks, datasets, models, baselines

### 31.1 NLG evaluation tasks and datasets

Page 43 lists:

#### Summarisation

- SummEval;
- QAGS.

#### Dialogue

- Topical-Chat.

#### Machine translation

- WMT-22.

### 31.2 Inversion model training

The inversion models are trained using:

- Qwen;
- LLaMA.

### 31.3 Baseline prompts

The baseline prompts include:

- human-crafted prompts, such as prompts from G-EVAL and GEMBA;
- forward prompts generated by standard instruction-tuned LLMs.

---

## 32. Worked example: original vs distillation

### 32.1 Prompt used in the example

Page 44 gives the input instruction:

> Identify and elaborate on some of the most notable philosophers throughout history, detailing their key contributions to various branches of philosophy, along with the historical and cultural context of their ideas.

### 32.2 Original response

The original response begins:

- “Certainly!”
- It describes notable philosophers and their contributions.
- It starts with Socrates:
  - branch: ethics, epistemology;
  - key contribution: Socratic Method;
  - context: ancient Athens, political and cultural development, challenges to Sophists, transmitted through Plato.
- It then moves to Plato:
  - branch: metaphysics, epistemology, ethics, political philosophy;
  - key contribution: Theory of Forms;
  - founded the Academy in Athens.

### 32.3 Distillation response

The distillation response also discusses notable philosophers but has a somewhat different structure.

For Socrates, it includes:

- “Ancient Greek Philosophy” heading;
- contributions;
- key ideas;
- historical and cultural context;
- Peloponnesian War and decline of Athens as context;
- statement that Socrates was a critic of democracy and its excesses.

For Plato, it begins:

- “Plato (428/427-348/347 BCE) — Ancient Greek Philosophy.”

### 32.4 Purpose of the example

The example demonstrates that in a black-box setting, outputs can be generated from known inputs and used to construct an inversion dataset, even without access to the original SFT data.

---

## 33. Overall results

### 33.1 Metrics reported

The results table on page 45 reports two metrics:

$$
\rho
$$

and

$$
r
$$

for each dataset and average.

[UNCLEAR] The slides do not define $\rho$ and $r$ explicitly. Check the transcript or paper for whether these are Spearman/Pearson or another correlation pair.

### 33.2 Baseline automatic metrics

The table includes BERTScore and BARTScore:

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

The inversion prompt improves the average score over the forward prompt and also exceeds the human-crafted prompt average.

### 33.4 Black-box setting: Qwen-2.5-7B-Instruct

Average results:

| Prompt type | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Human-crafted prompt | 0.436 | 0.431 |
| Forward prompt | 0.350 | 0.374 |
| Inversion prompt, ours | 0.484 | 0.495 |
| Relative gain | ↑38% | ↑32% |

Again, the inversion prompt performs best on the reported averages.

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

### 33.7 Main takeaway from the results table

Across the reported black-box and white-box settings, inversion prompts generally outperform forward prompts and often outperform human-crafted prompts on average.

---

## 34. GPT results

### 34.1 GPT-4o-mini results with black-box inversion prompts

Page 46 uses GPT-4o-mini as evaluator.

For black-box prompts:

| Prompt type | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Forward Prompt-BB | 0.434 | 0.451 |
| Inversion Prompt-BB | 0.533 | 0.556 |
| Relative gain | ↑23% | ↑23% |

### 34.2 GPT-4o-mini results with white-box inversion prompts

For white-box prompts:

| Prompt type | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Forward Prompt-WB | 0.468 | 0.480 |
| Inversion Prompt-WB | 0.509 | 0.522 |
| Relative gain | ↑9% | ↑9% |

### 34.3 Slide conclusions

Page 46 states:

- inversion prompts still perform generally better than forward prompts on GPT-4;
- the relative gain is smaller than when used on the original model, Qwen;
- although inversion prompts are higher quality, only **model-specific prompts** can exploit the full potential.

---

## 35. Sensitivity analysis: model sensitivity

### 35.1 What was tested

Page 47 swaps prompts generated by Qwen and LLaMA. It also compares prompts generated under black-box and white-box settings.

### 35.2 Main finding

The slide states:

> Each model performed best with its own model tailored, inversion-generated prompt.

### 35.3 LLaMA-3.1-8B-Instruct results

Average results:

| Prompt | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Forward Prompt | 0.318 | 0.327 |
| Inversion Prompt-Qwen | 0.384 | 0.399 |
| Inversion Prompt-WB | 0.420 | 0.405 |
| Inversion Prompt, ours | 0.423 | 0.433 |

The best average $r$ is from the model's own inversion prompt.

### 35.4 Qwen-2.5-7B-Instruct results

Average results:

| Prompt | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Forward Prompt | 0.350 | 0.374 |
| Inversion Prompt-LLaMA | 0.448 | 0.458 |
| Inversion Prompt-WB | 0.456 | 0.463 |
| Inversion Prompt, ours | 0.484 | 0.495 |

The model's own inversion prompt performs best.

### 35.5 Key conclusion

Page 47 repeats the central question:

> So why assume a single evaluation prompt works for all LLMs? i.e. models exhibit different behaviours.

---

## 36. Sensitivity analysis: numerical sensitivity

### 36.1 What was tested

Page 48 says numerical sensitivity experiments modified the inverse inputs in four ways:

1. original prompt;
2. one decimal place;
3. remove score range;
4. remove all scores.

### 36.2 Average results

For Qwen-2.5-7B-Instruct:

| Variant | Average $\rho$ | Average $r$ |
|---|---:|---:|
| Inversion Prompt | 0.484 | 0.495 |
| One Decimal Place | 0.477 | 0.472 |
| Without Score Range | 0.464 | 0.478 |
| Without Score | 0.469 | 0.461 |

### 36.3 Example input modifications

The visual examples show the consistency score being represented differently.

#### Original

The prompt includes a score range and a precise score such as:

$$
0.66666
$$

#### One decimal place

The score is rounded to:

$$
0.7
$$

#### Remove score range

The explicit range “between 0 and 1” is removed, but the score remains.

#### Remove all scores

The score value is removed entirely.

### 36.4 Key conclusion

Numerical details in the inverse input affect performance. The original prompt variant has the highest average scores in the table.

---

## 37. Case study: prompt comparison

### 37.1 Prompt types compared

Page 49 compares:

- forward prompts;
- human-crafted prompts;
- inversion prompts.

### 37.2 Prompt components

The slide identifies three prompt components:

1. **Model instruction**.
2. **Evaluation criteria**.
3. **Evaluation guideline**.

### 37.3 Forward prompt

The forward prompt example focuses on consistency between a summary and article. It lists criteria such as:

- comprehensive coverage;
- accuracy;
- relevance;
- precision;
- brevity.

It then says summaries will be evaluated for consistency with the original article.

### 37.4 Human-crafted prompt

The human-crafted prompt says:

- the model will be given a news article;
- the model will be given one summary;
- the task is to rate the summary on one metric.

It includes:

- evaluation criteria: consistency on a 1-5 scale;
- evaluation steps:
  1. read the article carefully and identify main facts/details;
  2. read the summary and compare it to the article;
  3. assign a consistency score.

### 37.5 Inversion prompt

The inversion prompt is more detailed and formal. It states that the AI assistant is tasked with evaluating factual consistency of summaries based on detailed articles.

It instructs the evaluator to:

1. examine each sentence in the summary in relation to the article's content;
2. identify factual inconsistencies, misrepresentations, contradictions, or omitted key details;
3. assign a factual consistency score on a scale from 0 to 1.

It also defines:

- $1$: perfect factual consistency;
- $0$: complete factual inconsistency.

The prompt further gives an evaluation guideline stating that a summary is factually consistent if every sentence is logically entailed by the article and no contradictions are present.

---

## 38. Prompt comparison: LLaMA vs Qwen

### 38.1 LLaMA prompt style

Page 50 states:

- LLaMA prompts show a more conversational and less formal phrasing style.

### 38.2 Qwen prompt style

Page 50 states:

- Qwen generates more rigorous and formal instructions in terms of evaluation criteria and guidelines.

Specifically, Qwen:

- clearly separates model instruction;
- clearly separates evaluation criteria;
- clearly separates evaluation guidelines.

### 38.3 Contrast

The slide says LLaMA blends these elements more loosely.

### 38.4 Key takeaway

Prompt style is model-dependent, which supports the lecture's central claim that model-specific prompts are important for effective LLM-based evaluation.

---

## 39. Conclusion of inversion-learning section

Page 51 states:

- inversed instruction tuning automatically generates high-quality, model-specific evaluation prompts via inversion learning;
- the method efficiently generates high-quality prompts from a single evaluation sample;
- experiments across two LLM families, three evaluation tasks, and four datasets confirm that model-specific prompts are essential for effective LLM-based evaluation.

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
- reward difference represents log odds of human preference.

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

- Geoffrey Hinton was born in 1947.
- George Washington died in 1799.
- They could not have had a conversation together.

Answer:

```text
no
```

### 41.4 Chain-of-thought multiplication: $13 \times 27$

Steps:

$$
7 \times 3 = 21
$$

Carry 2.

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

Input asks for notable philosophers, their contributions, and historical/cultural context.

Original output and distillation output both discuss Socrates and Plato, but the distillation output restructures the response with sections such as:

- contributions;
- key ideas;
- historical and cultural context.

This illustrates black-box inversion dataset distillation: generate outputs from known inputs using an instruction-tuned model, then use those generated outputs to train an inverse mapping.

---

## 42. Discussion questions captured

The slides include these discussion questions:

1. If a raw foundation model were deployed directly in customer support, what failures would occur even if the language sounded fluent?
2. Why might pairwise comparison be easier and more reliable than asking humans to give every answer an absolute 1-10 score?
3. When hearing the word “expert,” why might models learn lower-level experts rather than topic experts like history or medicine?
4. With a fixed budget, when is it better to spend on a bigger model, and when is it better to let the model think longer at test time?
5. How would you separate pretraining, instruction tuning, and alignment in one short sentence each?
6. If two evaluator models give different scores to the same summary, what possible causes should be considered before concluding one model is wrong?

[UNCLEAR: transcript missing] The slides include the questions but not the lecturer's answers.

---

## 43. Exam flags

### 43.1 Explicit exam flags

No visible slide text says “this will be on the exam,” “you should know this,” “common mistake,” or equivalent.

[UNCLEAR: transcript missing] Spoken exam cues cannot be checked without the transcript.

### 43.2 High-value revision targets from slide emphasis, not explicit exam flags

These are not explicit exam flags, but they are central to the lecture:

1. Difference between foundation models and instruction-tuned models.
2. Why instruction tuning reduces the mismatch between next-token prediction and user intent.
3. HHH alignment principles: helpful, honest, harmless.
4. Reward modelling setup:

   

$$
y_c,\ y_r,\ r_\theta(x,y)
$$

   and the pairwise ranking loss.
5. PPO motivation: large enough updates without destructive collapse.
6. PPO ratio:

   

$$
r_t(\theta)
   =
   \frac{\pi_\theta(a_t|s_t)}
   {\pi_{\theta_{\text{old}}}(a_t|s_t)}
$$

7. Difference between RLHF and DPO.
8. GRPO vs PPO trade-offs.
9. MoE definition and why “experts” may be low-level token specialists.
10. Chain-of-Thought prompting and the distinction between reasoning step and final response.
11. Inversion learning as $Y \mapsto X$, contrasted with standard instruction tuning as $X \mapsto Y$.
12. White-box vs black-box inversion setup.
13. The conclusion that model-specific prompts are essential for LLM-based evaluation.

---

## 44. Connections to earlier/later material and applications

### 44.1 Connection to pretraining

The lecture connects post-training back to large-scale next-token prediction, where self-supervised learning produces base models.

### 44.2 Connection to prompting and inference

The pipeline diagram connects aligned models to inference-time techniques:

- In-Context Learning;
- few-shot prompting;
- Chain-of-Thought;
- Tree of Thought;
- Retrieval-Augmented Generation.

### 44.3 Connection to safety and security

The pipeline explicitly includes:

- security evaluation;
- red teaming;
- inversion attacks;
- model/prompt inversion;
- recovery of prompts or training data;
- post-deployment evaluation.

This foreshadows the inversion-learning section.

### 44.4 Connection to NLG evaluation

The second half connects alignment and prompt design to evaluation of generated text, including:

- summarisation;
- dialogue;
- machine translation;
- human evaluation;
- LLM-based evaluation.

### 44.5 Connection to model families

The inversion-learning experiments compare:

- Qwen;
- LLaMA;
- GPT-4o-mini in transfer-style evaluation.

The prompt comparison shows that different model families produce or require different prompt styles.

---

## 45. Unclear sections to revisit in the recording/transcript

### 45.1 Missing transcript

[UNCLEAR: transcript missing] No separate lecture transcript was included, so spoken elaboration, examples, jokes, exam hints, and corrections are unavailable.

### 45.2 Transformer architecture

[UNCLEAR] The agenda mentions Transformer architecture and training paradigms, but the visible slides do not include detailed Transformer architecture material.

### 45.3 PPO clipped objective

[UNCLEAR] The slides define the PPO ratio, advantage, and clipping motivation, but not the full clipped PPO objective.

### 45.4 DPO loss

[UNCLEAR] The slides state that DPO uses direct exact optimisation with binary cross entropy, but they do not give the DPO loss formula.

### 45.5 GRPO formal objective

[UNCLEAR] The slides describe group-relative advantages and functional rewards, but not the exact GRPO objective.

### 45.6 MoE routing details

[UNCLEAR] The slides define experts and gating but do not specify top-$k$ routing, load balancing, or the mathematical gating function.

### 45.7 Test-time compute methodology

[UNCLEAR] The charts show improved accuracy with generation budget and test-time search, but the slides do not explain the experimental setup in detail.

### 45.8 Metrics $\rho$ and $r$

[UNCLEAR] The results tables use $\rho$ and $r$, but the slides do not define them.

### 45.9 Inversion-learning paper details

[UNCLEAR] The slides summarise the inversion-learning method and results, but detailed dataset construction, hyperparameters, and prompt-generation procedure are not visible.
