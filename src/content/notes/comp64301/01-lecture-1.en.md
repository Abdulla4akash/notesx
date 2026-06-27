---
subject: COMP64301
chapter: 1
title: "Lecture 1a–1b — Cognitive Robotics"
language: en
---

# COMP64301 Cognitive Robotics — Lecture 1a + 1b Study Notes

**Sources used:**

- `COMP64301_Lecture1a_CognitiveRoboticsExample_2025-3.pdf`
- `COMP64301_Lecture1b_CognitiveRobotics2025.pptx`

## Topic and scope

This introductory material defines **cognitive robotics** and positions it between AI, robotics, cognitive science, biology, developmental psychology, neuroscience, linguistics, and philosophy of AI. It also introduces embodied language learning through child–robot comparisons, especially the idea that robots should not merely manipulate symbols but ground language in perception, action, posture, attention, and development.

---

# 1. Big Picture: What Cognitive Robotics Is About

## 1.1 Robotics and AI applications

The lecture begins by motivating robotics through real-world application domains:

- **Companions for older people**
- **Cobots for Industry 4.0**
- **Robots for children in hospital**
- **Safety**, especially body recognition and avoidance

These examples show that robotics is not only about mechanical control. Robots increasingly operate near humans, so they need capabilities such as perception, interaction, communication, adaptation, and safety-aware behaviour.

## 1.2 Main motivating questions

The slides frame cognitive robotics around two kinds of questions.

### Human-development question

What mechanisms and constraints support cognitive development?

The slides specifically mention:

- **Biases**
- **Cues**
- **Embodiment**
- **Language acquisition**

This sets up cognitive robotics as a way to study human cognition, not only to build robots.

### Robotics-design question

How can we design robots that can use language to communicate with humans and other robots?

This makes the engineering goal explicit: robots need language abilities that go beyond memorised dictionaries or pre-programmed responses.

### Cognitive-science question

What can cognitive scientists learn from robot experiments on embodied language learning?

This is important: robots are not only products of cognitive science; they can also be experimental tools for testing hypotheses about cognition and development.

---

# 2. Definition of Cognitive Robotics

## 2.1 Formal definition

The lecture gives the following definition:

> **Cognitive robotics is the field that combines insights and methods from AI, as well as cognitive and biological sciences, to robotics.**

This definition is attributed to **Cangelosi & Asada, 2022**.

## 2.2 Intuition

Cognitive robotics asks how to build robots with abilities associated with cognition, such as:

- Perception
- Learning
- Communication
- Adaptation
- Goal-directed action
- Anticipation
- Social interaction
- Language grounding

The key point is that these abilities are not treated as purely engineering problems. They are informed by how humans and animals develop, perceive, act, and learn.

## 2.3 Robotics problem ↔ human problem

The summary slide states:

- Cognitive robotics treats a **robotics problem** as connected to a **human problem**.
- It draws inspiration from:
  - Philosophy of AI
  - Child psychology
  - Robot/child experiments
  - Machine learning for robot learning
  - Cumulative, open-ended extension

This means the field is bidirectional:

- Human cognition inspires robot design.
- Robot experiments help test theories of cognition.

---

# 3. Related Terms: Cognitive Robotics, Artificial Cognitive Systems, Intelligent Robotics

Lecture 1b distinguishes three related but different terms.

## 3.1 Cognitive Robotics

### Formal slide definition

Cognitive robotics concerns:

> The design of sensorimotor and cognitive capabilities in intelligent robots, taking direct inspiration from cognitive and biological sciences.

## 3.2 Artificial Cognitive Systems

### Formal slide definition

Artificial cognitive systems involve:

> Modelling of simulated and embodied/robotic agents taking inspiration from natural and cognitive systems.

### Intuition

Artificial cognitive systems are broader than physical robots. They may include:

- Simulated agents
- Embodied agents
- Robotic agents

The emphasis is on modelling cognition-like capabilities.

## 3.3 Intelligent Robotics / Robotics and AI

### Formal slide definition

Intelligent robotics is described as:

> An engineering approach to the design of intelligent capabilities in robots using any Artificial Intelligence methods.

### Important distinction

The distinction is mainly about **source of inspiration** and **research aim**.

| Term | Main focus | Source of methods/inspiration |
|---|---|---|
| Cognitive Robotics | Building robots with cognitive and sensorimotor capabilities | AI + cognitive science + biological sciences |
| Artificial Cognitive Systems | Modelling cognitive capabilities in simulated or embodied agents | Natural/cognitive systems |
| Intelligent Robotics | Engineering intelligent robot behaviour | Any AI method |

Cognitive robotics is not just “AI on a robot.” It specifically uses cognitive and biological sciences to shape robot design.

---

# 4. Approaches Within Cognitive Robotics

Lecture 1b lists several approaches that fall under or influence cognitive robotics.

## 4.1 Developmental Robotics

Associated with **Cangelosi & Schlesinger, 2015**.

Developmental robotics studies how robots can acquire skills over time in ways inspired by human child development.

In Lecture 1a, this is central to language acquisition: robots are used to model developmental stages such as first words, mutual exclusivity, word order, and trust.

## 4.2 Evolutionary Robotics

Associated with **Nolfi & Floreano, 2002**.

Evolutionary robotics takes inspiration from evolution and selection. Robots or controllers may be evolved rather than hand-designed.

## 4.3 Swarm Robotics

Associated with **Dorigo et al., 2014** and **Hamann, 2018**.

Swarm robotics studies collective behaviour in groups of robots, often inspired by social insects or biological swarms.

## 4.4 Soft Robotics

Associated with **Laschi et al., 2016** and **Veri et al., 2015**.

Soft robotics uses compliant, flexible bodies. This is relevant to cognition because body morphology can shape behaviour and interaction.

## 4.5 Neurorobotics

Associated with **Hu & Krichmar, 2022**.

Neurorobotics connects robotics with neural models or neuroscience-inspired mechanisms.

---

# 5. Concepts and Theoretical Influences

Lecture 1b lists several principles and theories influencing cognitive robotics.

## 5.1 Embodied cognition

Associated names on the slide:

- Wilson
- Pfeifer
- Barsalou

### Intuition

Embodied cognition means cognition is not just computation inside the head. It depends on:

- The body
- Sensorimotor activity
- Situated interaction with the environment

This connects directly to the language-learning material in Lecture 1a: posture, attention, and object interaction affect word learning.

## 5.2 AI and knowledge-based systems

Associated with:

- Levesque
- Reiter

This points to symbolic AI traditions, where intelligent behaviour can be represented through knowledge, reasoning, and explicit structures.

## 5.3 Behaviour-Based Robotics

Associated with:

- Brooks

Behaviour-based robotics emphasises direct perception-action loops rather than high-level symbolic planning alone.

## 5.4 Synthetic methodologies

The slides list examples:

- Walter’s Tortoise
- Braitenberg’s Vehicles
- Langton’s Artificial Life
- Edelman’s neurorobotics

### Intuition

Synthetic methodology means building artificial systems to understand natural systems. Instead of only observing cognition, researchers construct simplified agents or robots to test whether particular mechanisms can generate cognitive-like behaviour.

---

# 6. Language Learning: Why Symbol Manipulation Is Not Enough

## 6.1 Talking to robots

The lecture contrasts robots/computers that can be programmed to use words with systems that actually understand language.

The slides state:

> Computers and robots can be easily pre-programmed to memorise a dictionary, but cannot understand the language they use.

Examples shown include:

- ELIZA
- Siri
- Cortana
- Humanoid robots

The point is that producing language-like responses does not necessarily imply understanding.

## 6.2 Chinese Room Experiment

The lecture uses the **Chinese Room Experiment** as a philosophy-of-AI motivation.

### Key concept

A system may manipulate symbols according to rules without understanding their meaning.

### Role in the lecture

The Chinese Room sets up the problem of **symbol grounding**:

- A system can receive input.
- It can apply rules.
- It can produce plausible output.
- But this does not guarantee semantic understanding.

**[UNCLEAR]** The slides include video stills from “The Brain with David Eagleman” / Blink Films, but without transcript audio the exact spoken explanation is unavailable.

---

# 7. Angelo’s Room Experiment

The lecture gives a worked symbolic-rule example called **Angelo’s Room Experiment**.

## 7.1 Setup

The system receives questions in a language/dialect and has:

1. A dictionary
2. A reply rule book

Example question:

```latex
\text{quanti anni havi la picciotta?}
```

## 7.2 Dictionary entries

The dictionary contains entries such as:

- **picciotta**: setti anni, picca pitittu, maciari hovu
- **za’nzina**: settanta anni, assai pitittu, manciari haddina
- **haddina**: dui anni, assai pitittu, maciari simenza
- **anni**: dui, setti, settanta
- **pitittu**: assai, picca
- **manciari**: hovu, haddina, simenza

## 7.3 Reply rule book

The rule book maps question templates to answer templates:

```latex
\text{quanti anni havi la X?} \rightarrow \text{la X havi A anni}
```

```latex
\text{quantu pitittu havi la X?} \rightarrow \text{la X havi B pitittu}
```

```latex
\text{soccu voli manciari la X?} \rightarrow \text{la X voli manciari C}
```

## 7.4 Worked example: answering the question

### Question

```latex
\text{quanti anni havi la picciotta?}
```

### Step 1: Identify the template

The question matches:

```latex
\text{quanti anni havi la X?}
```

So:

```latex
X = \text{picciotta}
```

### Step 2: Look up X in the dictionary

The dictionary says:

```latex
\text{picciotta: setti anni, picca pitittu, maciari hovu}
```

So the age value is:

```latex
A = \text{setti}
```

### Step 3: Apply the rule

```latex
\text{la X havi A anni}
```

Substitute:

```latex
X = \text{picciotta}, \quad A = \text{setti}
```

### Answer

```latex
\text{la picciotta havi setti anni}
```

## 7.5 Other possible worked answers

Using the same rules:

### Question

```latex
\text{quanti anni havi la za’nzina?}
```

Dictionary:

```latex
\text{za’nzina: settanta anni}
```

Answer:

```latex
\text{la za’nzina havi settanta anni}
```

### Question

```latex
\text{quantu pitittu havi la haddina?}
```

Dictionary:

```latex
\text{haddina: assai pitittu}
```

Answer:

```latex
\text{la haddina havi assai pitittu}
```

### Question

```latex
\text{soccu voli manciari la picciotta?}
```

Dictionary:

```latex
\text{picciotta: maciari hovu}
```

Answer:

```latex
\text{la picciotta voli manciari hovu}
```

## 7.6 Point of the example

This experiment shows that a system can answer questions correctly by using dictionary lookup and syntactic rules.

But that does not mean the system understands:

- What a girl is
- What age is
- What hunger is
- What eating is
- What an egg, chicken, or seed is

The system is manipulating symbols, not grounding them in perception/action.

## 7.7 Grounding extension

The next slide adds images for terms such as:

- picciotta
- za’nzina
- haddina
- hovu
- simenza
- picca
- assai
- manciari

This illustrates a move from pure symbol manipulation toward grounding words in perceptual or embodied referents.

**[UNCLEAR]** The slide labels “picca” and “assai” with object-group images, but without the spoken explanation it is unclear exactly how the lecturer described these quantities.

---

# 8. Gavagai and the Problem of Word Meaning

## 8.1 Gavagai

The lecture uses **Quine’s “Gavagai”** example.

Slides show a child/rabbit image and then a dog image, both labelled “Gavagai.”

## 8.2 Core idea

The problem is that hearing a word in context does not uniquely determine its meaning.

For example, if someone points and says “Gavagai,” the learner must infer whether it means:

- Rabbit
- Animal
- A part of the animal
- Movement
- Situation
- Event
- Something else

The slides connect this to:

- Mechanisms and constraints in cognitive development
- Biases and cues
- Embodiment in language acquisition
- The “Body as Cognitive Hub” hypothesis

## 8.3 Connection to cognitive robotics

Robots face the same problem as children:

- They receive words.
- They perceive scenes.
- They must map language to objects, actions, properties, or events.
- The mapping is ambiguous unless constrained by embodiment, attention, posture, interaction, and learning history.

This is why the lecture shifts from dictionaries to embodied learning experiments.

---

# 9. Learning and Development in Children

## 9.1 Children are slow but efficient language learners

The slides state:

> Children are slow, but efficient at learning a language.

A specific developmental phenomenon mentioned is the **vocabulary spurt**.

## 9.2 Children use the body for situated interaction

The lecture highlights that children use their bodies in real-world interaction.

This includes:

- Sitting
- Crawling
- Standing
- Reaching
- Looking
- Holding objects
- Interacting with caregivers
- Attending to objects in space

This matters because the body helps structure the learning problem.

## 9.3 Brain integration of language and sensorimotor knowledge

The slides state:

> The brain integrates language and sensorimotor knowledge.

This supports the embodied view of language: word meaning is not detached from perception and action.

## 9.4 Theory of Mind

The slides also mention that children develop **Theory of Mind (ToM)** for social interaction.

### Definition

Theory of Mind is the ability to reason about other agents’ mental states, such as beliefs, intentions, attention, and knowledge.

### Role in this lecture

The slide does not go into detail, but ToM is listed as part of social interaction relevant to language learning.

---

# 10. Developmental Psychology of Language Acquisition

Lecture 1a includes a developmental timeline.

## 10.1 Timeline features shown

The slide maps language and motor development from birth to around 3 years.

Key stages shown include:

- **Universal phonetic discrimination**
- **Perceptual reorganisation**
- **Vocabulary spurt**
- **Language production**

Motor/social milestones shown include:

- Sitting up
- Crawling
- Standing

Language examples shown include:

- Around 1 year: “Mamma”, “Dadda”
- Around later infancy: ~10 words, “dow”/dog, “noo-noos”, noodles
- Around 2 years: short phrases, “Mummy bye-bye”, “me milk”, abstract “mine”
- Later: words such as “now”, “sad”, spatial “in”

## 10.2 Key developmental implication

Language learning is not isolated. It develops alongside:

- Motor development
- Perceptual changes
- Social interaction
- Body posture
- Object manipulation
- Attention

This prepares the ground for robot experiments that reproduce child-like learning conditions.

---

# 11. Cognitive Developmental Robotics

## 11.1 Interdisciplinary nature

A slide places **Cognitive Developmental Robotics** at the centre of several disciplines:

- Ethology
- Computer science
- Robotics
- Linguistics
- Cognitive psychology
- Child psychology
- Neuroscience

This reinforces the idea that cognitive robotics is not a single-method field.

## 11.2 Developmental robotics of language acquisition

The lecture describes a **cognitive architecture for cumulative learning**.

The slide lists more than five experiment types:

- First words
- Mutual exclusivity
- U-learning
- Word order
- Trust
- Others not detailed on the slide

It also mentions collaborations with BabyLabs, including:

- Smith, Indiana
- Horst, Sussex
- Floccia, Plymouth
- Twomey, Manchester
- Marchetti, Milan Cattolica

## 11.3 Cumulative learning

### Definition

Cumulative learning means that earlier learned capabilities support later learning.

### In this lecture

The robot is not just trained on one isolated task. It is presented as part of a developmental sequence, paralleling child development from early word learning to more complex language use.

---

# 12. Posture Affects Word Learning

## 12.1 Main claim

The slides explicitly state:

> Posture affects word learning.

This is tied to work by **Smith & Samuelson (2010)** and **Morse, Cangelosi, Smith et al. (2015)**.

## 12.2 Intuition

Posture changes what the learner can see, reach, attend to, and interact with. Therefore posture can affect how words are associated with objects.

This supports the embodied cognition view: word learning depends not only on language input, but also on bodily state and sensorimotor context.

## 12.3 Modi experiment setup

The experiment uses a novel word:

```latex
\text{MODI}
```

The learner is shown objects across steps, with left/right spatial positioning.

The training/test sequence includes:

- “Look at the MODI”
- Repeated exposure to an object in a spatial context
- Later test question:

```latex
\text{Where’s the MODI?}
```

## 12.4 Experimental cue conditions

The slide contrasts:

### Consistent spatial cue

- The target object appears consistently in a spatial location.
- Performance shown:

```latex
73\%
```

### No consistency

- The spatial cue is not consistent.
- Performance shown:

```latex
46\%
```

## 12.5 Interpretation

The consistent spatial cue improves word learning compared with no consistency.

So learners are not only learning arbitrary word-object pairings. They exploit regularities in embodied/situated experience, such as spatial location.

**[UNCLEAR]** The slide image shows a step table and robot frames, but without transcript audio the exact distinction between “switch,” “Baldwin task,” and “interference task” is only partially recoverable from the slide.

---

# 13. iCub’s Modi Experiment

## 13.1 Robot platform

The lecture uses the **iCub** humanoid robot in the Modi experiment.

The slide cites:

- Morse et al. (2015), PLoS ONE

## 13.2 Purpose

The experiment tests whether a robot can model child-like word learning effects, especially the role of posture and spatial consistency.

## 13.3 Same robot/child experiment

The lecture summary explicitly says cognitive robotics uses the **same robot/child experiment**.

This matters methodologically:

- If a robot model produces similar behaviour to children under similar experimental conditions, it supports the hypothesis that the model captures relevant mechanisms.
- If the robot fails, the model or assumptions may need revision.

## 13.4 Predictions

The slide states:

- There are **6 robot/baby experiments**.
- The model predicts that changes in posture, for example from sitting to standing, will remove a task interference effect despite the target location remaining consistent.

### Interpretation

Even if the object’s location is stable, changing posture can disrupt the embodied context used for learning. This means the relevant cue is not just external location; it includes body-relative sensorimotor state.

## 13.5 Graph on prediction/results slide

The graph compares **child data** and **robot data** across experiment conditions:

- Exp 1 & 6: Baldwin Task
- Exp 2: Switch Task
- Exp 3 & 7: Baldwin Task + Posture Change
- Exp 4 & 8: Interference Task
- Exp 5 & 9: Interference Task + Posture Change

The y-axis is:

```latex
\text{Mean Proportion Correct}
```

A dashed line marks chance-level performance around 50%.

The graph visually indicates that robot and child data are compared directly across matched conditions.

**[UNCLEAR]** The slide includes significance stars, but the exact statistical tests and p-values are not visible in the parsed text.

---

# 14. Epigenetic Robotics / AI Architecture

## 14.1 Architecture components shown

The architecture slide includes multiple sensory and motor components:

- **Body posture**, represented as joint angles
- **ASR**, automatic speech recognition
- **Words / phonemes**
- **Actions**, such as:
  - Look
  - Reach
  - Point
  - Grasp
  - Hold
  - Drop
- **HSV object colour histogram**
- **Object shape information**, such as:
  - Circleness
  - Squareness
  - Convexity
- **SOMs**, likely Self-Organising Maps, connected to several modalities
- **Echo State Network or Simple Recurrent Neural Network** for word order learning

## 14.2 Key idea

The robot architecture integrates:

- Speech/language input
- Vision
- Object features
- Body posture
- Action
- Sequential learning

This is an embodied architecture because language learning is not represented as text-only processing. It is distributed across perception, action, body state, and linguistic input.

**[UNCLEAR]** The slide labels several SOM components, but without the lecturer’s explanation the exact training procedure and data flow are only partially specified.

---

# 15. Embodied Attention and Word Learning

## 15.1 Main topic

The lecture introduces **Embodied Attention & Word Learning**, citing:

- Raggioli & Cangelosi (2022), ICDL

## 15.2 Slide content

The slide shows a robot training setting involving:

- A humanoid robot
- A tablet or display
- A table
- Objects such as a cup
- Human pointing/interaction

## 15.3 Interpretation

Attention is treated as embodied because the robot’s word learning depends on where attention is directed in a physical scene.

This continues the main theme:

- Words are learned in interaction.
- Meaning is connected to perception and action.
- Human cues such as pointing can guide learning.

**[UNCLEAR]** The slide is mostly visual and does not provide the detailed method, model, or results.

---

# 16. Open-Ended Cumulative Learning

## 16.1 Main topic

The lecture introduces **Open-Ended Cumulative Learning**, citing:

- Morse & Cangelosi (2016), Cognitive Science

## 16.2 Definition

Open-ended cumulative learning means the robot continues to extend its knowledge over time rather than learning a fixed closed set of behaviours.

## 16.3 Role in cognitive robotics

This is important because human development is open-ended:

- Children do not learn a fixed dictionary once.
- They keep adding words, categories, actions, and social meanings.
- Later learning builds on earlier learning.

A cognitive robot should similarly support continued learning, not just one-off task training.

---

# 17. Modelling Cognitive Systems

Lecture 1b shifts from language-learning examples to general modelling of cognitive systems.

## 17.1 Artificial cognitive systems

The slides define artificial cognitive systems as modelling human-like and animal-like capabilities in simulated or physical agents.

## 17.2 Four criteria

The slide says modelling cognitive systems involves **four criteria**, but the visible text only clearly includes:

- Computational / bio-inspired spectrum
- Level of abstraction in the biological model

The slide also includes a repeated line:

> what cognition is for and how it is achieved

It then explains:

> Ultimate explanations deal with questions concerned with why a given behaviour exists in a system or is selected through evolution.

**[UNCLEAR]** The slide says “Four criteria,” but only some criteria are visible in the parsed text. Need recording or full visual inspection to recover the complete list.

## 17.3 Computational vs bio-inspired spectrum

A model may be more computational/engineering-oriented or more biologically inspired.

### Computational end

The model focuses on solving the task effectively, perhaps without matching biological details.

### Bio-inspired end

The model tries to reflect biological or cognitive mechanisms.

## 17.4 Level of abstraction

A model may represent cognition at different levels:

- High-level functional principles
- Algorithmic mechanisms
- Neural or physical implementation details

This connects directly to Marr’s levels.

---

# 18. What Is Cognition?

## 18.1 Formal definition from Vernon

Lecture 1b gives a definition from Vernon (2014):

> Cognition is the process by which an autonomous system perceives its environment, learns from experience, anticipates the outcome of events, acts to pursue goals, and adapts to changing circumstances.

## 18.2 Components of cognition in this definition

The definition includes several capabilities:

1. **Perception**
   - The system senses or interprets its environment.

2. **Learning from experience**
   - The system changes based on past interactions.

3. **Anticipation**
   - The system predicts outcomes of events.

4. **Goal-directed action**
   - The system acts to pursue goals.

5. **Adaptation**
   - The system adjusts to changing circumstances.

## 18.3 Cognition as a cycle of anticipation

The slides describe cognition as a **cycle of anticipation**.

### Intuition

Cognition is not simply reacting to stimuli. A cognitive system predicts what may happen, acts, observes the consequences, and adapts.

The likely cycle is:

```latex
\text{Perceive} \rightarrow \text{Learn/Predict} \rightarrow \text{Act} \rightarrow \text{Observe outcome} \rightarrow \text{Adapt}
```

**[UNCLEAR]** The slide contains a diagram of cognition as a cycle of anticipation, but the parsed text does not expose all labels in the diagram.

---

# 19. Marr’s Levels of Abstraction

## 19.1 Why abstraction matters

Lecture 1b states:

> A theoretical/computational model is an abstraction of a real system.

Marr’s levels are introduced as a way to analyse and understand systems at different levels.

## 19.2 Marr’s three levels

The lecture lists three levels:

1. **Computational / theory**
2. **Representation / algorithmic**
3. **Implementation**

## 19.3 Level 1: Computational / theory

### Core question

What problem is the system solving, and why?

This level specifies the goal of the computation.

### Example in cognitive robotics

For word learning:

- The computational problem might be mapping words to objects, actions, or meanings.
- The purpose might be communication with humans.

## 19.4 Level 2: Representation / algorithmic

### Core question

How is the problem solved?

This level specifies:

- Representations
- Algorithms
- Processes
- Data structures

### Example in cognitive robotics

For word learning:

- Object features might be represented by colour histograms or shape descriptors.
- Speech may be represented as words or phonemes.
- Learning may use SOMs, recurrent neural networks, or echo state networks.

## 19.5 Level 3: Implementation

### Core question

How is the algorithm physically realised?

This could include:

- Robot sensors
- Motors
- Neural hardware
- Software implementation
- Body morphology

## 19.6 Decoupling the levels

The lecture quotes/uses Marr’s point:

> You should decouple the different levels of abstraction and begin your analysis at the highest level, avoiding consideration of implementation issues until the computational or theoretical model is complete.

Then, once the computational/theoretical model is complete, it can guide decisions at the lower levels when realising the physical system.

## 19.7 Why this matters for robotics

Without Marr’s hierarchy, a designer may jump too quickly to implementation details:

- Which robot?
- Which camera?
- Which network?
- Which actuator?

Marr’s approach says first ask:

- What is the cognitive task?
- What is the goal?
- What information must be represented?
- What algorithmic process can solve it?
- Only then: how should it be implemented physically?

---

# 20. Connections Across the Two Lectures

## 20.1 Lecture 1a connects to Lecture 1b through the definition of cognitive robotics

Lecture 1a builds toward the definition of cognitive robotics using language learning examples. Lecture 1b formalises the field and places it among related terms and modelling frameworks.

## 20.2 Embodiment connects language learning to cognitive systems

Lecture 1a shows embodiment through:

- Posture effects
- Spatial cues
- Word learning
- iCub experiments
- Attention and pointing
- Cumulative learning

Lecture 1b provides the theoretical framing:

- Embodied cognition
- Cognitive robotics
- Artificial cognitive systems
- Marr’s abstraction hierarchy

## 20.3 Symbol grounding connects philosophy of AI to robot learning

The Chinese Room and Angelo’s Room examples motivate the problem:

- Rule-based symbol manipulation can produce correct answers.
- But meaning requires grounding.
- Robots may ground words through perception, action, posture, and social interaction.

## 20.4 Child psychology connects to robot experiments

Lecture 1a repeatedly connects child development and robot learning:

- Vocabulary spurt
- Posture effects
- Body use in situated interaction
- Same child/robot experimental designs

This is an example of cognitive robotics using human developmental evidence to design and test robotic systems.

---

# 21. Key Concepts Glossary

## Cognitive Robotics

**Formal definition:** Field combining insights and methods from AI, cognitive sciences, and biological sciences to robotics.

**Intuition:** Building robots whose intelligence is inspired by human/animal cognition and development.

## Artificial Cognitive Systems

**Formal definition:** Modelling simulated and embodied/robotic agents inspired by natural and cognitive systems.

**Intuition:** Artificial systems used to model cognition, not necessarily always physical robots.

## Intelligent Robotics

**Formal definition:** Engineering approach to designing intelligent robot capabilities using any AI methods.

**Intuition:** More engineering-centred and less necessarily tied to biology/cognition.

## Embodied Cognition

**Definition from lecture context:** Cognition depends on the body and situated interaction, not just abstract internal computation.

**Example:** Posture affects word learning.

## Symbol Grounding

**Definition from lecture context:** The problem of connecting symbols/words to meanings through perception, action, and experience.

**Example:** Angelo’s Room can answer questions syntactically but does not understand the words.

## Gavagai Problem

**Definition from lecture context:** A word heard in a scene may have many possible meanings, so word learning requires constraints, cues, and embodied/social context.

## Theory of Mind

**Definition:** Ability to reason about other agents’ mental states for social interaction.

**Lecture role:** Listed as part of child development relevant to language learning.

## Cumulative Learning

**Definition:** Learning where earlier knowledge supports later learning.

**Lecture example:** Developmental robotics architecture supporting first words, mutual exclusivity, word order, trust, and more.

## Open-Ended Learning

**Definition:** Learning that continues beyond a fixed task or closed dataset.

**Lecture example:** Robot language learning extending over time.

## Marr’s Levels

**Definition:** A three-level hierarchy for understanding a system: computational/theory, representation/algorithmic, implementation.

**Lecture message:** Start at the highest level before implementation details.

---

# 22. Exam Flags

## Explicit exam flags found

No slide text explicitly says “this will be on the exam,” “common mistake,” or similar.

## High-value likely exam material from slide emphasis

These are not explicit exam statements, but they are strongly emphasised in the slides:

1. **Definition of cognitive robotics**
   - Cangelosi & Asada definition appears in both lecture decks.

2. **Difference between cognitive robotics, artificial cognitive systems, and intelligent robotics**
   - Lecture 1b directly contrasts these.

3. **Chinese Room / Angelo’s Room**
   - Important for understanding symbol manipulation vs understanding.

4. **Gavagai**
   - Important for ambiguity and grounding in word learning.

5. **Embodiment in language acquisition**
   - Posture, spatial cues, and attention are central.

6. **iCub Modi experiment**
   - Key worked example of robot/child comparison.

7. **Marr’s abstraction hierarchy**
   - Explicitly presented as a theoretical framework.

---

# 23. Unclear Sections to Revisit in Recording

- **[UNCLEAR]** Chinese Room video explanation: slides show video stills, but the detailed spoken explanation is absent.
- **[UNCLEAR]** Angelo’s Room pronunciation/translations: the symbolic logic is clear, but exact dialect meanings and pronunciation need audio.
- **[UNCLEAR]** Grounding slide: images show referents for words, but the precise explanation of quantity terms such as “picca” and “assai” is not fully recoverable.
- **[UNCLEAR]** Modi experiment task variants: “Baldwin Task,” “Switch Task,” “Interference Task,” and posture-change variants appear in the graph, but detailed procedures are not fully described in the slide text.
- **[UNCLEAR]** Statistical details in the Modi graph: significance stars are visible, but the actual tests and p-values are not readable from parsed text.
- **[UNCLEAR]** Epigenetic robotics architecture: the broad components are visible, but the detailed training flow is not explained in the slide text.
- **[UNCLEAR]** Artificial cognitive systems “four criteria”: the slide mentions four criteria, but only some are visible in parsed text.
