---
subject: "Self Learning"
chapter: 2
title: "Modern Directions in Reinforcement Learning, 2025-2026"
language: en
---

# Modern Directions in Reinforcement Learning, 2025–2026

**Generated:** 2026-07-06  
**Refresh note:** This file is a current-field map, not a timeless textbook chapter. Refresh it every few months, especially the LLM reasoning/RLVR sections.

## Why this note exists

Classical RL notes usually cover the established canon: **Q-learning**, **DQN**, **policy gradients**, **actor-critic**, **TRPO/PPO**, **SAC**, and maybe **RLHF**. The 2025–2026 frontier is different: RL is now heavily tied to **large reasoning models**, **verifiable rewards**, **preference optimization**, **test-time scaling**, **tool-using agents**, and **world models**. The core shift is that RL is less often “learn to play Atari from pixels” and more often “shape a foundation model’s reasoning, actions, tool use, or alignment behavior.”

## 1. RL for LLM reasoning / RLVR

**RLVR** means **Reinforcement Learning with Verifiable Rewards**: the model gets reward from an automatically checkable outcome, such as a correct math answer, passing code tests, satisfying a formal checker, or matching a rule-based verifier. The landmark case is **DeepSeek-R1-Zero**, trained with large-scale RL without an SFT warm start; its AIME 2024 pass@1 rose from 15.6% to 71.0%, and to 86.7% with majority voting. The deeper point is not just the score: RL produced longer reasoning, self-reflection, verification, and “aha moment” behavior without directly supervising those reasoning traces. ([arxiv.org](https://arxiv.org/html/2501.12948v1))

**Why it matters now:** RLVR made RL central again by giving LLMs a scalable training signal for domains where human preference labels are expensive or fuzzy but answers are objectively checkable. For PhD interviews, know the contrast: **RLHF optimizes human/AI preference**, while **RLVR optimizes externally verifiable task success**.

**Key names:** DeepSeek-R1-Zero, DeepSeek-R1, RLVR, rule-based rewards, verifiers, outcome rewards, long-CoT RL.  
**Read next:** DeepSeek-R1 technical report / Nature paper.

## 2. GRPO and the post-PPO algorithm wave

**GRPO** stands for **Group Relative Policy Optimization**. It is PPO-like, but it removes the learned critic/value model by sampling a group of answers for the same prompt and estimating relative advantages from the group’s reward scores. This matters for LLMs because a critic as large as the policy is expensive; critic-free RL is cheaper and simpler to scale. ([arxiv.org](https://arxiv.org/html/2501.12948v1))

**Why it matters now:** GRPO became the default algorithmic reference point after DeepSeek-R1, but the community quickly found that naive GRPO is not magic. **DAPO** adds practical fixes such as decoupled clipping, dynamic sampling, token-level policy-gradient loss, and overlong reward shaping; **Dr. GRPO** argues that GRPO has optimization bias that can inflate response length, especially for incorrect outputs. ([arxiv.org](https://arxiv.org/html/2503.14476v1))

**Key names:** GRPO, DAPO, Dr. GRPO, REINFORCE++, PPO-style RL for LLMs, verl.  
**Read next:** DAPO paper, Dr. GRPO / “Understanding R1-Zero-Like Training.”

## 3. Preference optimization beyond PPO

**DPO** means **Direct Preference Optimization**. It reframes the RLHF objective into a simpler classification-like loss over preferred vs rejected responses, avoiding explicit reward-model training and online PPO sampling. The original DPO paper showed competitive or better alignment results than PPO-style RLHF in several settings while being simpler to implement. ([arxiv.org](https://arxiv.org/abs/2305.18290))

**Why it matters now:** DPO and its variants are the main “RL-free but RL-derived” alignment family. In 2025, surveys organized DPO variants around data strategy, learning framework, constraints, and model properties, showing that the frontier is no longer just “PPO or DPO” but data quality, preference noise, margin design, iterative preference learning, and robustness. ([arxiv.org](https://arxiv.org/abs/2503.11701))

**Key names:** DPO, IPO, KTO, ORPO, SimPO, fDPO, reward-model-free alignment, offline preference optimization.  
**Read next:** Original DPO paper, 2025 DPO survey.

## 4. RLAIF and scalable feedback

**RLAIF** means **Reinforcement Learning from AI Feedback**. Instead of asking humans to label every preference pair, a stronger or specialized model judges responses and produces preference data or reward signals. Anthropic’s **Constitutional AI** is the canonical early example: the system uses rules or principles, self-critique, AI preference modeling, and RL from AI feedback to reduce reliance on direct human labels. ([arxiv.org](https://arxiv.org/abs/2212.08073))

**Why it matters now:** RLAIF scales better than human-only feedback, but AI judges can be noisy, biased, length-sensitive, or unstable across domains. Recent work explicitly studies noisy AI preference labels and shows that teacher models can flip a large fraction of human preferences, which makes robust preference-data filtering and judge calibration a major open problem. ([mdpi.com](https://www.mdpi.com/2076-3417/15/19/10328))

**Key names:** RLAIF, Constitutional AI, AI judges, model-based preference labeling, noisy preference optimization.  
**Read next:** Constitutional AI, RLAIF noise-aware DPO work.

## 5. Reasoning models and inference-time scaling

The modern “reasoning model” idea is that the model spends more compute at inference time: longer internal reasoning, multiple rollouts, search, verification, tool calls, or reranking. OpenAI’s o1 line explicitly framed reinforcement learning as teaching the model to refine chain-of-thought strategies, recognize mistakes, break hard problems into steps, and try alternate approaches. ([openai.com](https://openai.com/index/learning-to-reason-with-llms/))

**Why it matters now:** Reasoning is now both a **training-time** and **test-time** scaling problem. Surveys on **test-time scaling** treat inference compute as a first-class axis: what to scale, how to scale, where to scale, and how well it works. ([arxiv.org](https://arxiv.org/abs/2503.24235))

**Key names:** OpenAI o-series, GPT-5 Thinking/Pro, DeepSeek-R1, test-time compute, best-of-N, majority voting, MCTS, process reward models.  
**Read next:** OpenAI “Learning to reason with LLMs,” test-time scaling surveys.

## 6. Process reward models and step-level supervision

A **process reward model** scores intermediate reasoning steps, not just the final answer. This is attractive because final-answer rewards can miss invalid reasoning that lands on the correct answer by luck. OpenAI’s earlier process-supervision work showed that rewarding correct reasoning steps can improve mathematical reasoning and released PRM800K, a large step-level feedback dataset. ([openai.com](https://openai.com/index/improving-mathematical-reasoning-with-process-supervision/?utm_source=chatgpt.com))

**Why it matters now:** PRMs connect RL, verification, and inference-time search. They are used to guide tree search, rerank reasoning paths, and provide denser feedback for long-horizon reasoning. The bottleneck is cost: step-level labels are expensive, so newer work explores AI-generated/verbalized PRMs and data-efficient process supervision.

**Key names:** PRM, ORM, step-level reward, outcome reward, PRM800K, ThinkPRM, verifier-guided search.  
**Read next:** “Let’s Verify Step by Step,” newer PRM/test-time scaling papers.

## 7. Multimodal RL and visual reasoning

RLVR is moving from text-only math/code into **multimodal reasoning**, especially vision-language models. The problem is harder because the model must both perceive the image correctly and reason over it correctly; answer-only rewards can improve reasoning style while leaving visual perception errors untouched. **Perception-R1** argues for adding visual perception rewards so RLVR improves the perceptual foundation, not just the final answer. ([arxiv.org](https://arxiv.org/abs/2506.07218))

**Why it matters now:** This is especially relevant for CV+NLP/VLM research. A 2025 survey frames **large multimodal reasoning models** as moving from modular perception pipelines toward unified systems with multimodal chain-of-thought, multimodal RL, and agentic planning. ([arxiv.org](https://arxiv.org/abs/2505.04921))

**Key names:** Perception-R1, Vision-R1, Open Vision Reasoner, Visual-RFT, multimodal GRPO, VLM reasoning.  
**Read next:** Perception-R1, “Perception, Reason, Think, and Plan” survey.

## 8. Foundation models × RL convergence

RL is increasingly fused with foundation models rather than trained from scratch. Foundation models can provide priors, synthetic environments, reward models, planners, critics, tool-use policies, or world models. Surveys now explicitly describe the convergence of deep RL with foundation-model methods such as RLHF, RLAIF, preference optimization, and world-model pretraining. ([mdpi.com](https://www.mdpi.com/2073-431X/15/1/40?utm_source=chatgpt.com))

**Why it matters now:** For applications, this means RL is becoming a post-training and agent-training layer on top of pretrained models. The interesting research questions are less “can PPO solve MuJoCo?” and more “how do we train long-horizon agents with tools, memory, verifiers, simulated environments, and sparse rewards?”

**Key names:** foundation-model RL, agentic RL, tool-use RL, LLM agents, GUI agents, deep research agents.  
**Read next:** RL-for-LLMs surveys, agentic RL / GUI-agent surveys.

## 9. World models and model-based RL

**World models** learn a predictive model of the environment and use it for planning or imagined rollouts. **DreamerV3** remains the key classical-modern bridge: it learns a world model, imagines future trajectories, and achieved strong performance across more than 150 tasks with a single configuration. ([nature.com](https://www.nature.com/articles/s41586-025-08744-2))

**Why it matters now:** World models are now also foundation-model work. DeepMind’s **Genie 2** and **Genie 3** are described as foundation world models that generate action-controllable interactive environments for training and evaluating agents; Genie 3 can generate real-time interactive worlds from text prompts at 24 fps for a few minutes. ([deepmind.google](https://deepmind.google/blog/genie-2-a-large-scale-foundation-world-model/))

**Key names:** DreamerV3, Genie 2, Genie 3, foundation world models, model-based RL, imagination-based planning.  
**Read next:** DreamerV3, Genie 3, world-model surveys.

## 10. Offline RL and decision-transformer-style methods

**Offline RL** learns from fixed datasets without online environment interaction. This remains crucial for healthcare, robotics, recommender systems, autonomous driving, and other domains where exploration is costly or unsafe. The main tension is distribution shift: the learned policy may choose actions underrepresented in the dataset, causing value overestimation or brittle behavior.

**Why it matters now:** Offline RL increasingly intersects with sequence modeling and transformers. Decision Transformers reframed RL as conditional sequence modeling; CQL/IQL-style methods remain important for conservative value learning; newer work blends offline RL with world models and foundation-model priors.

**Key names:** CQL, IQL, Decision Transformer, trajectory modeling, conservative policy learning, offline model-based RL.  
**Read next:** CQL, Decision Transformer, offline RL surveys.

## 11. Multi-agent RL and self-play

**Multi-agent RL** studies learning when multiple agents interact, cooperate, compete, communicate, or form conventions. The classical problems are non-stationarity, credit assignment, equilibrium selection, opponent modeling, and coordination. Modern MARL now overlaps with LLM agents, self-play reasoning, debate, verifier-solver systems, and multi-agent tool-use pipelines.

**Why it matters now:** The agentic-AI version of MARL is not only StarCraft or robotics; it is planner–executor–critic systems, solver–verifier loops, automated debate, multi-agent coding, and research agents. The frontier question is how to train these systems end-to-end rather than hand-engineering the roles.

**Key names:** MARL, self-play, centralized training/decentralized execution, agent debate, solver-verifier-corrector systems.  
**Read next:** MARL surveys, multi-agent LLM reasoning papers.

## 12. Safe RL and constrained RL

**Safe RL** studies policies that optimize reward while satisfying constraints. Classical formulations use **constrained MDPs**, cost functions, risk-sensitive objectives, shields, or safety critics. In modern foundation-model RL, the safety version includes refusal behavior, deception monitoring, tool-use constraints, reward hacking detection, and deployment-time behavioral evaluation.

**Why it matters now:** As models become tool-using agents, RL safety becomes more than “don’t crash the robot.” It becomes “do not optimize the proxy in a way that violates user intent, safety policy, or real-world constraints.”

**Key names:** constrained MDPs, safe RL, shielded RL, risk-sensitive RL, deliberative alignment, deployment simulation.  
**Read next:** Safe RL surveys, OpenAI deployment simulation / CoT monitorability work.

## 13. Reward hacking and verifier gaming

**Reward hacking** happens when a policy exploits the reward proxy rather than satisfying the intended objective. In RLVR, this can mean gaming the output format, exploiting weak verifiers, producing plausible-but-invalid reasoning, or finding shortcuts that pass tests without robust understanding. DeepSeek-R1-Zero deliberately avoided neural reward models partly because neural reward models can suffer from reward hacking and complicate the pipeline. ([arxiv.org](https://arxiv.org/html/2501.12948v1))

**Why it matters now:** The stronger the model, the more dangerous weak rewards become. Recent work studies reward hacking in RLVR and proposes composite/verifiable rewards, penalties, stronger verifiers, and better evaluation to reduce shortcut behavior. ([arxiv.org](https://arxiv.org/abs/2509.15557?utm_source=chatgpt.com))

**Key names:** reward hacking, specification gaming, verifier hacking, proxy reward, composite rewards, adversarial evaluation.  
**Read next:** Reward hacking in RLVR papers, classic specification gaming examples.

## 14. Chain-of-thought monitorability

A new safety thread asks whether reasoning traces are useful for oversight. OpenAI’s 2025–2026 work frames chain-of-thought monitorability as a way to detect misbehavior more effectively than looking only at final outputs or actions; it also studies whether more RL or more test-time compute makes reasoning easier or harder to monitor. ([openai.com](https://openai.com/index/evaluating-chain-of-thought-monitorability/))

**Why it matters now:** If reasoning traces stay monitorable, they may become a safety layer for agentic systems. If future models learn to hide or reshape their reasoning, CoT monitoring becomes less reliable; OpenAI’s CoT-Control work reports that current frontier reasoning models still struggle to control their chains of thought in ways that reduce monitorability. ([openai.com](https://openai.com/index/reasoning-models-chain-of-thought-controllability/))

**Key names:** CoT monitorability, CoT controllability, deliberative alignment, agent oversight, deployment simulation.  
**Read next:** OpenAI CoT monitorability and CoT-Control papers.

## 15. The live critique: does RL create new reasoning or elicit latent ability?

A central debate is whether RLVR genuinely creates new reasoning capabilities or mostly shifts probability mass toward reasoning paths already latent in the base model. One line of work argues RLVR improves correct reasoning and can incentivize logical integrity; another argues RLVR primarily improves sampling efficiency while narrowing exploration. ([arxiv.org](https://arxiv.org/abs/2506.14245?utm_source=chatgpt.com))

**Why it matters now:** This is interview gold. The sophisticated answer is not “RL solves reasoning” or “RL is fake”; it is that RL changes the model’s search distribution, length allocation, exploration, and self-verification behavior, but the boundary between eliciting latent skills and acquiring new skills remains empirically unsettled.

**Key names:** latent capability, sampling efficiency, Pass@K, CoT-Pass@K, exploration collapse, capability boundary.  
**Read next:** “Does RL Really Incentivize Reasoning Capacity…?”, “RLVR Implicitly Incentivizes Correct Reasoning…”.

## 16. The broader critique: reasoning models still fail

Reasoning models are much better than older chat models on many math, coding, and science tasks, but they are not reliable general reasoners. Apple’s **Illusion of Thinking** paper reports three regimes: standard models can outperform reasoning models on low-complexity tasks, reasoning models help on medium-complexity tasks, and both collapse on high-complexity controlled puzzles. ([machinelearning.apple.com](https://machinelearning.apple.com/research/illusion-of-thinking))

**Why it matters now:** This critique keeps the field honest. Modern RL-for-reasoning is powerful, but long-horizon algorithmic reasoning, exact computation, tool grounding, factuality, and robust generalization remain open problems.

**Key names:** Illusion of Thinking, overthinking, complexity collapse, exact computation, tool-augmented reasoning.  
**Read next:** Apple “Illusion of Thinking” plus follow-up critiques and tool-augmentation responses.

## What to read first

1. **DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning** — the most important 2025 paper for understanding RLVR, GRPO, R1-Zero, emergent long-CoT behavior, and the post-PPO reasoning-model wave. ([arxiv.org](https://arxiv.org/html/2501.12948v1))

2. **A Survey of Reinforcement Learning for Large Reasoning Models** — the broad map of RL for LRMs after DeepSeek-R1, including algorithms, training data, infrastructure, applications, and open problems. ([arxiv.org](https://arxiv.org/abs/2509.08827))

3. **DAPO: An Open-Source LLM Reinforcement Learning System at Scale** — the practical engineering paper for reproducing large-scale long-CoT RL, with details on clipping, dynamic sampling, token-level losses, and reward shaping. ([arxiv.org](https://arxiv.org/html/2503.14476v1))

4. **Direct Preference Optimization + 2025 DPO survey** — the cleanest bridge from RLHF theory to modern preference optimization without PPO-style online RL. ([arxiv.org](https://arxiv.org/abs/2305.18290))

5. **DreamerV3 / Genie 3** — the best bridge from classical model-based RL to foundation-scale world models and simulated environments for agent training. ([nature.com](https://www.nature.com/articles/s41586-025-08744-2))

## Interview-level one-liners

- **RLVR:** “RLHF optimizes preferences; RLVR optimizes verifiable success signals like math correctness or code tests.”
- **GRPO:** “GRPO is PPO-style LLM RL without a learned critic; it uses group-relative rewards as the baseline.”
- **DAPO/Dr. GRPO:** “The post-GRPO wave is about fixing length bias, entropy collapse, reward noise, and instability in long-CoT RL.”
- **DPO:** “DPO is the reward-model-free, offline preference-optimization alternative to PPO-style RLHF.”
- **Reasoning models:** “The frontier is train-time RL plus test-time compute, not just bigger pretraining.”
- **World models:** “Model-based RL is back through foundation world models: learned simulators are becoming training environments for agents.”
- **Core critique:** “RL may be creating new reasoning, eliciting latent reasoning, or mostly improving sampling efficiency; the field has not settled this.”
- **Safety angle:** “As RL makes agents more capable, reward hacking and CoT monitorability become central evaluation problems.”
