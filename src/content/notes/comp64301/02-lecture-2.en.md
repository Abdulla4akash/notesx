---
subject: COMP64301
chapter: 2
title: "Lecture 2a–2b — Developmental Robotics & HRI"
language: en
---

# COMP64301 Lecture 2a–2b: Developmental Robotics, HRI, and Applications

**Course:** COMP64301  
**Lecture topics:** Lecture 2a — Developmental Robotics; Lecture 2b — Human-Robot Interaction (HRI) and Applications  
**Lecturer:** Angelo Cangelosi, Department of Computer Science, The University of Manchester  
**Sources used:** Uploaded slides for Lecture 2a and Lecture 2b. No transcript file/text was available in the working directory, so transcript-specific spoken emphasis, verbal examples, and explicit exam comments could not be captured.

**Topic and scope:** These lectures connect cognitive/developmental robotics to human-robot interaction. Lecture 2a introduces developmental robotics as a biologically inspired approach to building cognitive robots; Lecture 2b applies those ideas to HRI: speech, pose/action recognition, trust, education, and care robots.

---

## 0. Exam / revision flags

**No explicit spoken exam flags are available**, because no transcript was provided. From the slide structure, the most exam-relevant material is:

- **[REVISION FLAG] Developmental Robotics formal definition** from Cangelosi & Schlesinger.
- **[REVISION FLAG] Six developmental robotics principles**, especially dynamical systems, embodiment/situatedness, intrinsic motivation, nonlinear stages, and open-ended cumulative learning.
- **[REVISION FLAG] HRI technical challenges:** speech, action/intention recognition, trust/acceptability, emotion, long-term interaction.
- **[REVISION FLAG] Trust measurement:** price judgment game and investment game.
- **[REVISION FLAG] Robot education outcomes:** cognitive vs affective outcomes, embodiment, robot roles.
- **[REVISION FLAG] Key formulas:** trust/change-rate formula and Bayesian ToM dependency structure.

---

# Part I — Lecture 2a: Developmental Robotics

## 1. Positioning: Cognitive robotics approaches

### 1.1 Cognitive robotics approaches listed in the lecture

The lecture places **developmental robotics** as one approach within cognitive robotics. Other approaches listed are:

- **Developmental Robotics** — Cangelosi & Schlesinger 2015.
- **Evolutionary Robotics** — Nolfi & Floreano 2002.
- **Swarm Robotics** — Dorigo et al. 2014; Hamann 2018.
- **Soft Robotics** — Laschi et al. 2016; Veri et al. 2015.
- **Neurorobotics** — Hu & Krichmar 2022.

### Key concept: Developmental Robotics

**Intuition:** Developmental robotics tries to build robots that acquire behaviour and cognition through developmental processes, rather than being fully pre-programmed. The inspiration is not just adult cognition, but the way children develop sensorimotor, social, linguistic, and cognitive skills over time.

**Formal definition given in slides:**

> Developmental Robotics is the interdisciplinary approach to the autonomous design of behavioral and cognitive capabilities in artificial agents (robots) that takes direct inspiration from the developmental principles and mechanisms observed in natural cognitive systems (children).

A near-identical slide first says “takes inspiration”; the next slide says **“takes direct inspiration”**. Treat the second as the sharper formal definition.

---

## 2. Origins and community

### 2.1 Historical roots

The lecture lists three related historical traditions:

1. **Epigenetic Robotics** — Balkenius et al. 2001.
2. **Autonomous Mental Development** — Weng et al. 2002.
3. **Cognitive Developmental Robotics** — Asada et al. 2001, 2009; Lungarella et al. 2003.

### 2.2 Research community

The slide identifies the field’s community via:

- **Journal:** IEEE Transactions on Cognitive and Developmental Systems, formerly IEEE Transactions on Autonomous Mental Development.
- **Conference:** IEEE Joint ICDL-EpiRob Conference on Development and Learning.
- **Website:** ICDL-EpiRob site.

### 2.3 Interdisciplinary map

The slide diagram places **Cognitive Developmental Robotics** at the centre of several disciplines:

- Child psychology.
- Linguistics.
- Ethology.
- Robotics.
- Neuroscience.
- Cognitive psychology.
- Computer science.

**Connection:** This matters because developmental robotics is not presented as “just robotics” or “just AI.” It is an interdisciplinary modelling approach that uses developmental psychology, neuroscience, linguistics, ethology, and robotics together.

---

## 3. Developmental Robotics principles

The content slide says there are **six principles**:

1. Dynamical systems.
2. Phylogenetic-ontogenetic interaction.
3. Embodiment.
4. Intrinsic motivation.
5. Incremental / nonlinear developmental stages.
6. Open-ended learning.

**[UNCLEAR] Principle 2:** The content slide lists **phylogenetic-ontogenetic interaction**, but the uploaded deck does not include a detailed Principle 2 slide. The deck jumps from Principle 1 to Principle 3. This is a listening/check-slide gap.

---

## 4. Principle 1: Dynamical Systems

### 4.1 Core features

The dynamical systems principle is described through four terms:

- **Decentralized system**.
- **Self-organization and emergence**.
- **Multicausality**.
- **Nested timescales**.

### Key concept: Dynamical systems view of development

**Intuition:** Development is not controlled by one single cause. Behaviour emerges from interactions between the body, brain, environment, and time. A child’s behaviour changes as the child’s body grows, the nervous system develops, and the environment offers different possibilities for action.

**Formal slide statement:**  
Child development is the **emergent product** of intricate, dynamic interaction among many decentralized and local interactions related to the child’s growing **body**, **brain**, and **environment**.

### 4.2 Example: crawling and walking

The speaker notes give the example of crawling and walking:

- A child’s body configuration changes during growth.
- When the child has enough strength and coordination to support the body on hands and knees, but not enough for upright walking, crawling becomes the stable locomotion strategy.
- When the child’s legs become stronger and more stable, standing and walking emerge as the stable developmental state.

**Worked example structure:**

1. **Initial bodily state:** infant cannot yet support upright walking.
2. **Available coordination:** hands-and-knees posture is possible.
3. **Stable behaviour:** crawling emerges.
4. **Body growth:** legs become stronger and more stable.
5. **New stable behaviour:** standing/walking emerges.

This is an example of **multicausality**: the behaviour changes because body growth, coordination, environment, and neural control interact.

### 4.3 Example: walking reflex

The slide image gives another dynamical systems example:

- **Walking reflex:** a primitive reflex appearing at birth; babies move their legs rhythmically and alternately when held upright over a flat surface.
- The slide states that **alternative stepping suddenly disappeared around 2 months old**.
- But when the behavioural context changed, the behaviour reappeared:
  - Submerging the infant’s legs in water made alternative stepping reappear.
  - A treadmill with a moving belt elicited well-coordinated leg movements.

**Interpretation within slide content:** Behaviour depends on body-environment conditions, not just an internal maturation clock. Changing the context can reveal or restore a behaviour.

### 4.4 Nested timescales

The speaker notes list different timescales:

- Neural activity: milliseconds.
- Reaction/action times: seconds or hundreds of milliseconds.
- Learning: hours or days.
- Physical body growth: months.

**Key idea:** Faster processes are nested inside slower ones. Neural activity happens within action, action within learning, and learning within bodily development.

---

## 5. Principle 3: Embodied and Situated

### 5.1 Embodiment

**Formal slide definition:**  
**Embodiment** = Body-Brain-Environment interaction.

**Intuition:** Cognitive behaviour is shaped by the robot’s body and its interaction with the world. The body is not just a container for the brain/controller; it participates in cognition.

### 5.2 Situatedness

**Formal slide definition:**  
**Situatedness** = Learning in context.

**Intuition:** Learning is not abstracted away from the environment. The agent learns while acting in a particular situation.

### 5.3 Enaction

**Formal slide definition:**  
**Enaction** = Own model of the world.

**Intuition:** The robot’s understanding of the world is built through its own active engagement with the world.

### 5.4 Other linked terms

The slide also lists:

- **Morphological computation** — linked to robot lectures.
- **Grounding** — linked to language lecture.

**Connection:** The slide explicitly connects embodiment to previous robot lectures and grounding to the language lecture.

---

## 6. Principle 4: Intrinsic Motivation and Social Learning

### 6.1 Intrinsic motivation

**Formal slide content:**  
Intrinsic motivation includes:

- Curiosity.
- Surprise.
- Novelty-seeking.
- Values.
- Drives.

**Intuition:** A robot does not only learn because an external supervisor tells it what to do. It can explore because something is new, surprising, or internally valuable.

### 6.2 Social learning and imitation

The slide connects intrinsic motivation to:

- **Social learning**.
- **Imitation**.
- Social and Human-Robot Interaction lecture.

**Connection:** Developmental robotics links directly into HRI because social interaction and imitation are developmental mechanisms.

---

## 7. Worked example: Playground Experiment

The lecture uses the **Playground Experiment** from Oudeyer et al. 2005.

### 7.1 Experimental setup

The slide image shows a robot in a play-mat style environment with:

- An object that can be **bitten**.
- A tag for **visual object recognition**.
- An object that can be **bashed**.

### 7.2 Actions

The robot has three action types:

1. Bashing.
2. Biting.
3. Looking.

### 7.3 Sensors

The slide lists **3 sensors** and the speaker notes mention sensor values labelled:

- $O_v$
- $B_i$
- $O_s$

**[UNCLEAR]** The slide does not define the three sensor abbreviations in text. The figure labels include successful look, successful bite, and successful bash traces, but the exact meanings of $O_v, B_i, O_s$ need checking from the recording or source paper.

### 7.4 What the graph shows

The speaker notes describe:

- Top 3 graphs: frequency of action types over windows of 100 time steps:
  - bashing,
  - biting,
  - just looking.
- Bottom 3 graphs: distribution of sensor values over windows of 100 time steps, normalized relative to random action selection.

**Interpretation kept within slide content:** The experiment illustrates task-independent development of a curious robot, where behaviour unfolds through intrinsic motivation rather than a fixed externally specified task.

---

## 8. Principle 5: Nonlinear, Stage Development

### 8.1 Developmental milestones

The slide uses developmental milestones as an example of staged development. The table includes months, behaviours, and learning targets:

| Month | Behaviour | Learning target |
|---:|---|---|
| 5 | hand regard | forward and inverse models of the hand |
| 6 | finger the other’s face | integration of visuo-tactile sensation of the face |
| 6 | observe objects from different viewpoints | 3-D object recognition |
| 7 | drop objects and observe the result | causality and permanency of objects |
| 8 | hit objects | dynamic model of objects |
| 9 | drum or bring a cup to mouth | tool use |
| 10 | imitate movements | imitation of unseen movements |
| 11 | fine grasp and carry objects to others | action recognition and generation, cooperation |
| 12 | pretend | mental simulation |

### 8.2 Piaget’s qualitative stages

The slides introduce:

- **Qualitative stages**.
- **Piaget**.
- **Genetic Epistemology Theory**.
- **4 stages**.

The image slides list the four Piaget stages:

1. **Sensorimotor stage** — birth to 2 years.
2. **Preoperational stage** — 2 to 7 years.
3. **Concrete operational stage** — 7 to 11 years.
4. **Formal operational stage** — 12 and up.

### 8.3 Piaget stage details shown in slides

#### Sensorimotor stage: birth to 2 years

Major characteristics listed:

- Infant knows the world through movements and sensations.
- Children learn through basic actions such as sucking, grasping, looking, and listening.
- Infants learn that things continue to exist even when not seen: object permanence.
- Infants are separate beings from people and objects around them.
- Infants realize their actions can cause things to happen.

#### Preoperational stage: 2 to 7 years

Major characteristics listed:

- Children begin to think symbolically.
- They learn to use words and pictures to represent objects.
- They tend to be egocentric and struggle to see things from others’ perspectives.
- Their language and thinking improve, but they still tend to think concretely.

#### Concrete operational stage: 7 to 11 years

Major characteristics listed:

- Children begin thinking logically about concrete events.
- They begin to understand conservation, e.g. the amount of liquid in a short wide cup equals that in a tall skinny glass.
- Thinking becomes more logical and organized, but still concrete.
- Children begin using inductive logic: reasoning from specific information to a general principle.

#### Formal operational stage: 12 and up

Major characteristics listed:

- Adolescents or young adults begin to think abstractly.
- They reason about hypothetical problems.
- Abstract thought emerges.
- They think more about moral, philosophical, ethical, social, and political issues requiring theoretical and abstract reasoning.
- They begin to use deductive logic: reasoning from a general principle to specific information.

---

## 9. Developmental Robotics of Language Acquisition

The lecture includes a section on language acquisition.

### 9.1 ERA architecture

The slide names the **ERA architecture for cumulative learning**.

It lists **5+ experiments**:

- First words.
- Mutual exclusivity.
- U-learning.
- Word order.
- Other experiments not listed.

### 9.2 BabyLabs collaborations

The slide lists collaborations with BabyLabs:

- Smith — Indiana, USA.
- Horst — Sussex.
- Floccia & Cattani — Plymouth.
- Twomey — Manchester.

### 9.3 Developmental language timeline shown in the image

The slide image shows a developmental timeline from 0 to 36 months, with labelled phases:

- **Universal phonetic discrimination** — early period.
- **Perceptual reorganization** — around the 1-year region.
- **Vocabulary spurt** — around the 2-year region.
- **Language production** — later, toward 3 years.

**[UNCLEAR]** The exact month boundaries are only visible graphically; the slide does not provide a textual definition of the intervals.

---

## 10. Nonlinear U-shaped development

### 10.1 Key idea

The lecture presents nonlinear development as **U-shaped**.

**Intuition:** Development is not always monotonic improvement. Performance can improve, then worsen, then improve again.

### 10.2 Worked example: English past tense

The slide gives the sequence:


$$

\text{spoke} \rightarrow \text{speaked} \rightarrow \text{spoke}

$$


- Early: child produces the correct irregular form **spoke**.
- Middle: child overgeneralizes the regular past-tense rule and says **speaked**.
- Later: child returns to the correct irregular form **spoke**.

The graph marks correct performance high at the beginning and end, with a dip in the middle.

### 10.3 Worked example: vocabulary spurt

The slide also shows a cumulative vocabulary graph from around 12 to 20 months, labelled **Vocabulary spurt**.

- Cumulative vocabulary increases slowly at first.
- Growth accelerates sharply later.

---

## 11. Principle 6: Online, Open-ended, Cumulative

### 11.1 Core components

The slide lists:

- Online learning.
- Cumulative learning.
- Cross-modality.
- Cognitive bootstrapping.

It also states that this principle is linked to intrinsic motivation.

### Key concept: online, open-ended, cumulative learning

**Intuition:** The robot continues learning over time, builds new knowledge on previous knowledge, links information across modalities, and can use earlier abilities to bootstrap later cognitive abilities.

**Formal details:** No equation or algorithm is given in the slide.

---

## 12. Lecture 2a summary

The summary slide states the core points:

- Developmental Robotics.
- Direct inspiration from developmental psychology.
- Six principles.
- Incremental, staged development.
- Focus on intrinsic motivation.
- Optional reading: Chapter 1 of Cangelosi & Schlesinger 2015.

---

# Part II — Lecture 2b: Human-Robot Interaction and Applications

## 13. HRI overview and challenges

### 13.1 What HRI covers in this lecture

The lecture frames HRI as applications of:

- Social robotics.
- Language models.
- Human-robot interaction scenarios.

### 13.2 Technical and scientific challenges

The HRI challenge slide lists:

1. Speech recognition / production.
2. Action recognition and intention reading.
3. Trust and acceptability.
4. Emotion recognition / production.
5. Long-term interaction.

**[REVISION FLAG]** These five challenges are likely a useful overview answer for “what are major technical/scientific challenges in HRI?”

---

## 14. Speech in robotics

### 14.1 ASR: Automatic Speech Recognition

**Formal slide definition:**  
ASR = Automatic Speech Recognition.

The slide lists a historical/technical progression:

- From Hidden “Marcov” Models to deep learning systems.
- Nuance VoCon.
- Sphinx.
- Google, Bing, Alexa.
- Whisper.
- Robot-specific ASRs.

**[UNCLEAR / typo]** The slide says “Hidden Marcov Models.” This is almost certainly “Hidden Markov Models,” but the slide text itself has the typo.

### 14.2 Speech synthesis

Speech synthesis includes:

- Text-to-speech.
- Loquendo/Nuance.
- Google Cloud Text-to-Speech.

---

## 15. ASR for HRI

### 15.1 Nao adult speech recognition

The slide reports adult tests for recognition of counting numbers and short sentences:

- **90%** with Nao on-board microphone and ASR: Nuance VoCon 4.7.
- **99%** with a high-quality microphone and Google ASR.

### 15.2 Child speech recognition challenge

Child speech differs from adult speech:

- Higher pitch due to smaller vocal tracts.
- Disfluencies, especially in younger children.
- Utterances are often ungrammatical.

**Key point:** ASR performance in HRI cannot be assumed from adult speech performance, especially in child-robot interaction.

---

## 16. Worked example: ASR robot study with children

### 16.1 Participants

The study involved children’s speech in a UK school setting:

- 11 children.
- Average age $M = 4.9$, $SD = 0.3$.
- 5 female / 6 male.
- 5 children did not use English at home.

### 16.2 Utterance types

Three kinds of utterances were recorded:

1. Words — e.g. “one”, “two”, “three”.
2. Simple sentences — e.g. “The horse is in the stable”.
3. Spontaneous speech.

### 16.3 Recording devices

Three recording devices:

1. NAO robot — V5.0, running NaoQi V2.1.4.
2. Studio-grade microphone — Rode NT1-A.
3. Portable audio recorder — Zoom H1.

### 16.4 Microphone comparison chart

The chart compares recognition rate across microphones:

- NAO microphone: around 0.6 recognition rate.
- Portable recorder: slightly above NAO, around 0.6–0.65.
- Studio microphone: highest, around 0.8+.
- Statistical markings:
  - NAO vs Studio: $p = .006$.
  - Portable vs Studio: $p < .001$.

**[UNCLEAR]** Exact bar heights are only visible graphically; the slide does not provide numerical values.

### 16.5 ASR recommendations

The recommendation slide says:

- A high-quality off-board microphone can increase ASR performance by **20%**.
- In a limited domain such as numbers, recognition rate on Nao can reach **60%**.
- Nao hardly recognises anything when the speaker is at more than a **22-degree angle**.
- ASR engines are robust to background noise.
- Constrain recognition engines with a grammar when possible.
- Do not rely on ASR alone; additional input devices are a must.

**[REVISION FLAG]** The practical design message is: ASR is useful, but fragile. Use better microphones, constrained grammars, and multimodal input.

---

## 17. Action and pose recognition

### 17.1 Two revolutions

The lecture describes two “revolutions” in action/pose recognition:

1. **Kinect and RGBD cameras**
   - Cheap 3D sensors.
2. **Deep learning**
   - OpenPose.

### 17.2 OpenPose

**Formal slide description:**  
OpenPose is a real-time multi-person keypoint detection library for:

- Body estimation.
- Face estimation.
- Hands estimation.
- Foot estimation.

### 17.3 Kinect/RGBD in robotics

Kinect/RGBD sensors can be:

- On-board.
- Add-on.

Examples:

- Pepper — Asus Xion.
- Nao — add-on.

Applications:

- Teleoperation.
- Navigation.
- Action recognition.
- Human tracking.

### 17.4 OpenPose with children

The slide image shows OpenPose skeleton/keypoint overlays on children interacting at a table. The point is that pose estimation can operate in child-HRI contexts, not only adult lab settings.

### 17.5 UoM CoRoLab example

The lecture gives a UoM CoRoLab example:

- **Intention Reading from Action**.
- “Mindreading for Robots: Predicting Intentions via Dynamical Clustering of Human Postures”.
- Vinanzi, Goerick, Cangelosi 2019.

**Connection:** This links pose/action recognition to **intention reading**, which is one of the HRI challenges listed at the start.

---

## 18. Trust in HRI

### 18.1 Two directions of trust

The lecture splits trust into two directions.

#### Robot’s trust of other agents

The robot may need to evaluate whether it can trust:

- Humans.
- Other robots.

This links to:

- Theory of Mind.
- Trust.
- Bayesian models for belief and ToM.

#### People’s trust of robots

Humans may trust or distrust robots depending on:

- Social factors.
- Anthropomorphic factors.

The slide also mentions University of Manchester projects:

- THRIVE++.
- TAS Trust Node.

---

## 19. Can I trust my human? Robot trust and Theory of Mind

### 19.1 Bayesian ToM Trust Model

The slide describes a Bayesian Network model:

- Separate Bayesian Networks for:
  - Reliable speaker $R$.
  - Unreliable speaker $U$.

### 19.2 Variables in the model

The slide uses these variables:

- $X_C$: child’s internal belief.
- $Y_C$: child’s action.
- $Y_R$: reliable informant’s action.
- $Y_U$: unreliable informant’s action.
- $X_R$: reliable speaker’s belief.
- $X_U$: unreliable speaker’s belief.

### 19.3 Dependency structure

The action of the child is a consequence of:


$$

Y_C \leftarrow \{X_C, Y_R\}

$$


for a reliable speaker, or:


$$

Y_C \leftarrow \{X_C, Y_U\}

$$


for an unreliable speaker.

The slide says children collect statistical information to track agent reliability. The Bayesian Network parameters are set using:


$$

\text{MLE} = \text{Maximum Likelihood Estimation}

$$


**[UNCLEAR]** The slide does not give the probability tables, likelihood function, or parameter-estimation derivation.

---

## 20. Development of ToM: Sally-Anne test

### 20.1 Worked example: Sally-Anne test

The slide gives the classic false-belief structure:

1. Sally puts an object into location $x$.
2. In Sally’s absence, Anne moves the object to location $y$.
3. Sally returns.
4. The child is asked where Sally believes the object is.

**[UNCLEAR / slide text issue]** Parsed slide text says “Ann returns” and asks where Anne believes the object is; the image and standard task logic indicate Sally returns and the belief question concerns Sally. For revision, the important structure is the false-belief test: one agent has an outdated belief because the object was moved in their absence.

### 20.2 Results: deception detection

The slide reports:

- None of the 3–4-year-old children.
- 86% of 6–9-year-old children.

The slide labels these as results for **deception detection**.

---

## 21. Development of ToM and Trust

The slide image shows a robot trust task:

- The task asks: “Where is the sticker?”
- A robot asks the human: “Can you suggest me the location of the sticker?”
- The human answers: “Right.”
- The robot says it is thinking where to look based on the suggestion.
- The robot later says: “I was right not to trust you.”

**Meaning within the lecture:** Trust is treated as something that can be learned or updated from interaction. The robot can evaluate whether a human informant is reliable.

---

## 22. Can I trust my robot? Human trust in robots

### 22.1 HRI trust experiments

The lecture lists anthropomorphic and social factors that may affect human trust of robots:

- Social gaze.
- Speech.
- Anthropomorphic priming.
- Shared actions.
- Imitation.

### 22.2 Trust measurement protocols

The lecture lists two protocols:

1. **Price judgment game**.
2. **Investment game**.

---

## 23. HRI trust and social gaze

### 23.1 Experimental questions

The social gaze trust experiment asks:

1. Does gaze, the developmental precursor of social behaviour, support trust between humans and robots?
2. Does robot appearance influence trust?

### 23.2 Experimental design

The design extends Rau et al.’s 2009 **Price Judgment Task**.

Experimental factors:

- **Social gaze:** gaze vs no gaze.
- **Appearance:** Nao humanoid vs Baxter; also iCub.
- **Priming order:**
  - First Nao, second Baxter.
  - First Baxter, second Nao.

### 23.3 Formula: Trust as change rate

The lecture gives:


$$

\text{Trust} = \text{Change Rate}

$$


where:


$$

\text{Change Rate}
=
\frac{
\text{Number of participants' price changes}
}{
\text{Number of cases when the robot disagrees}
}

$$


**Interpretation:** If the robot disagrees with a participant’s price estimate, and the participant changes their answer toward the robot, that is counted as trusting behaviour.

### 23.4 Social and humanoid priming result

The visible chart compares change rate/trust across robot/social conditions.

- In the visible graph, **First Nao** with social behaviour has higher change rate than nonsocial behaviour.
- The difference for First Nao is marked with significance stars.
- Baxter does not show the same clear social-over-nonsocial pattern in the visible chart.

**[UNCLEAR]** Exact numerical values and all condition labels are not readable from the slide image alone. The chart also has a typo: “Tust” instead of “Trust.”

---

## 24. Measuring trust with behavioural game theory

### 24.1 Why economic games are used

The lecture says trust can be measured by playing economic games with robots as partners or opponents.

Advantages:

- Implicit measure.
- Repeated measures.
- Complex interactions.

### 24.2 Investment amount as trust measure

The slide states:


$$

\text{Investment amount} = \text{implicit measure of trust}

$$


Repeated rounds track the development of trust over time and experience.

---

## 25. Investment Game and Trust

### 25.1 Experimental question

The slide asks:

**Can anthropomorphic behaviour increase trust?**

### 25.2 Joint attention manipulation

Anthropomorphic behaviour is represented by **joint attention**, including:

- Head tracking.
- Gaze.
- Gestures while playing the game.

### 25.3 Interaction with robot intentions

The slide adds that trust is affected by interaction with the robot’s **intentions**.

Two robot intention/personality conditions are shown:

- **Nice Nao:** returns 120%–180%.
- **Nasty Nao:** returns 0%–120%.

### 25.4 Results chart

The result graph shows investment over 20 game turns, split by:

- Nice vs nasty robot.
- Joint vs nonjoint attention.

Visible pattern:

- For **nasty** robot, joint attention remains higher than nonjoint attention later in the game, while nonjoint drops strongly.
- For **nice** robot, both joint and nonjoint conditions stay relatively high, with fluctuations.
- The graph suggests that social/anthropomorphic cues interact with the robot’s actual return behaviour.

**[UNCLEAR]** Exact statistical results are not given in text on the slide.

---

# Part III — HRI Applications: Robot Tutors for Education

## 26. Social robots for education: review

The lecture uses the Belpaeme et al. 2018 Science Robotics review.

### 26.1 Core review claim shown on slide

The review abstract shown in the slide says social robots can be used in education as:

- Tutors.
- Peer learners.

They have been shown to be effective at increasing:

- Cognitive outcomes.
- Affective outcomes.

They achieved outcomes similar to human tutoring **on restricted tasks**, largely because of physical presence, which traditional learning technologies lack.

### Key concept: cognitive vs affective outcomes

#### Cognitive outcomes

**Formal slide content:** Cognitive outcomes include learning gain, speed, and related measures.

From the review excerpt:

- Knowledge.
- Comprehension.
- Application.
- Analysis.
- Synthesis.
- Evaluation.

Common measures include:

- Difference between pre-test and post-test score.
- Post-test immediately after robot exposure or with delay.
- Normalized learning gain.
- Completion time.
- Number of attempts needed for correct response.

#### Affective outcomes

**Formal slide content:** Affective outcomes include attitudes toward learning and toward the robot.

From the review excerpt, affective outcomes include qualities such as:

- Attentive.
- Receptive.
- Responsive.
- Reflective.
- Inquisitive.

Common measures include:

- Persistence: attempts or time spent with robot.
- Number of interactions with the system.
- Emotional expressions.
- Godspeed questionnaire.
- Tripod survey.
- Immediacy.
- Time between answers as fatigue indicator.
- Video coding.
- Eye gaze behaviour.
- Subjective ratings.
- Foreign language anxiety questionnaire.
- KindSAR interactivity index.
- Basic empathy scale.
- Free-form feedback/interviews.

---

## 27. Data and demographics from the review

### 27.1 Published studies and reporting quality

The review excerpt reports:

- 101 published studies analysed.
- 309 study results.
- Only 81 results had enough data to calculate an effect size.

**[REVISION FLAG]** This is a major methodological point: HRI education studies often lack enough statistical reporting for effect-size calculation.

### 27.2 Learning outcome distribution

The review reports:

- 99 cognitive learning outcome data points = 33.6%.
- 196 affective learning outcome data points = 66.4%.
- 14 study results did not contain a comparative experiment on learning outcomes.

The slide graphic rounds this to:

- Affective: 66%.
- Cognitive: 34%.

### 27.3 Participant demographics

The review reports:

- Children: 179 data points, 58% of sample.
  - Mean age 8.2 years.
  - SD 3.56.
- Adults: 98 data points, 32% of sample.
  - Mean age 30.5.
  - SD 17.5.
- Mixed/unknown: 29 studies, 9%.

The slide graphic rounds adults to 33%.

### 27.4 Countries shown in the slide

The country distribution chart includes:

- USA: 26%.
- Japan: 12%.
- UK: 12%.
- South Korea: 10%.
- Netherlands: 7%.
- Germany: 5%.
- Turkey: 5%.
- Portugal: 4%.
- Switzerland: 4%.
- Iran: 3%.
- Israel: 3%.
- Spain: 2%.
- Taiwan: 2%.
- Sweden: 2%.
- Australia: 1%.
- Italy: 1%.
- Denmark: 1%.
- Singapore: 1%.

---

## 28. Efficacy of robots in education

### 28.1 Effect sizes

The review excerpt reports comparisons between robots and alternatives such as ITS, on-screen avatars, or human tutoring.

Aggregated mean effect sizes:


$$

d_{\text{cognitive}} = 0.70

$$


with 95% CI:


$$

[0.66, 0.75]

$$


from 18 data points, mean $N = 16.9$ participants per data point.


$$

d_{\text{affective}} = 0.59

$$


with 95% CI:


$$

[0.51, 0.66]

$$


from 19 data points, mean $N = 24.4$ students per data point.

### 28.2 Interpretation given in the review excerpt

The review states:

- The limited set of studies comparing robots against alternatives gives a positive picture.
- Robots show medium effect sizes for affective and cognitive outcomes.
- Positive affective outcomes do not necessarily imply positive cognitive outcomes, and vice versa.
- Human tutors are a gold standard, with previous work suggesting $d = 0.79$.
- Robot results are in a similar region, but robots are usually deployed in restricted scenarios:
  - Short lessons.
  - Well-defined tasks.
  - Limited adaptation.
  - Limited curriculum flexibility.
- There is no suggestion yet that robots can tutor generally as well as humans.

**[REVISION FLAG]** The balanced answer is: robot tutors can work well in restricted educational tasks, but this does not mean they replace general human tutoring.

---

## 29. Robot appearance and embodiment

### 29.1 Main question

The lecture asks:

**What is the impact of using a physically embodied robot compared with alternative technologies?**

### 29.2 Robot appearance distribution

The slide shows the most common robots in the review:

- Nao: 48%.
- Other: 26%.
- Keepon: 6%.
- Wakamaru: 5%.
- Robovie: 4%.
- iCat: 4%.
- Bandit: 4%.
- Dragonbot: 4%.

### 29.3 Nao robot

The review excerpt describes Nao as:

- 54 cm tall.
- Humanoid.
- By SoftBank Robotics Europe.
- Available with 14, 21, or 25 degrees of freedom.
- Versions with arms, legs, torso, and head.
- Can walk, gesture, and pan/tilt its head.
- Has a rich sensor suite and onboard computation.
- Became almost a de facto platform because of:
  - Wide availability.
  - Appealing appearance.
  - Accessible price point.
  - Technical robustness.
  - Ease of programming.

### 29.4 Keepon robot

The review excerpt describes Keepon as:

- 25 cm tall.
- Snowman-shaped.
- Yellow foam exterior.
- No arms or legs.
- Four degrees of freedom:
  - pan,
  - roll,
  - tilt,
  - bop.
- Originally sold as a novelty for children but usable as a research platform after modification.

### 29.5 Effect sizes by robot appearance

The slide gives:

- Keepon: cognitive outcome $d = 0.56$, $N = 10$.
- Nao: cognitive outcome $d = 0.76$, $N = 8$.

The review excerpt says both are medium-sized effects, but direct comparison is difficult because studies did not use the same design, curriculum, and student population.

---

## 30. Role of the robot in education

### 30.1 Roles listed

The lecture lists four roles:

1. Tutor.
2. Teacher.
3. Peer and novice.
4. Mixed tutor/teacher.

### 30.2 Tutor

A tutor robot has:

- One-to-one interactions.
- The robot, as tutor, “knows best.”

The review says robot-as-tutor often focuses on one-to-one interaction because it offers the greatest potential for personalized education.

### 30.3 Teacher

A teacher robot is used for:

- One-to-many teaching.

The review says that in some cases the robot acts as a novel channel for lecture delivery, teacher, or teacher assistant. The value may be improving attention and motivation, while delivery/assessment remains with the human teacher.

### 30.4 Peer and novice

A peer/novice robot:

- Learns together with the child.
- Can be a teachable robot.
- Is linked to care-receiving robots and the protégé effect.

The review excerpt says robot-as-peer can be less intimidating than a tutor/teacher and can support peer-to-peer learning.

### 30.5 Robot as novice / protégé effect

The review describes educational benefits from a robot taking the role of novice:

- Student becomes instructor.
- Teaching the robot improves confidence and learning outcomes.
- This is learning by teaching, also called the **protégé effect**.
- Learner must explain/instruct material, requiring deeper understanding.

Examples:

- Care-receiving robot for English vocabulary.
- Robot deliberately makes errors and children correct it.
- CoWriter project: teachable robot helps children improve handwriting; children teach the robot, reflect on their own writing, and improve motor skills.

### 30.6 Distribution of robot roles

The slide graphic reports:

- Tutor: 48%.
- Teacher: 38%.
- Peer and novice: 9%.
- Mixed tutor and teacher: 4%.
- Other: 1%.

### 30.7 Number of learners per robot

The slide graphic reports:

- One learner: 65%.
- Many learners: 30%.
- Other: 5%.

### 30.8 Results about role

The role slide concludes:

- Role of robot is **application specific**.
- Tutor is most effective in many domains and many age ranges.
- There is no evidence that one particular role is superior to others in terms of outcomes.

**[REVISION FLAG]** Do not answer “tutor is always best.” The slide says tutor is often effective, but no role is generally superior across outcomes.

---

## 31. Worked example: Robots increase learning

The lecture uses Leyzberg, Spaulding, and Scassellati 2014.

### 31.1 Three experimental conditions

1. Lessons by the computer.
2. Lessons by an on-screen robot.
3. Lessons by a physically embodied robot: Keepon.

### 31.2 Result shown in graphs

The slide graphs report:

- “Robot group solved puzzles fastest.”
- “Robot group solved same puzzle faster.”

The right bar chart shows largest mean improvement for the robot condition compared with:

- none,
- random advice,
- voice,
- video,
- robot.

**[UNCLEAR]** Exact numerical values are only visible graphically and not listed in slide text.

### 31.3 Conceptual takeaway

The example supports the claim that physically embodied social robots can improve learning performance compared with less embodied alternatives in a restricted task.

---

# Part IV — HRI Applications: Robot Companions for Care

## 32. Robots for health and social care

### 32.1 Robots for healthcare with children

The slide lists:

- Children with autism — e.g. Aurora project.
- Children in hospital — e.g. ALIZ-E project.

### 32.2 Robot companions for older people

The slide lists:

- H2020 RobotEra project.
- MoveCare project.
- Turing Manchester Workshop, October 2019.

---

## 33. Case study: Robot-Era project

### 33.1 Project facts

The Robot-Era case study slide states:

- More than 155 elderly people involved in experimentation.
- 200+ stakeholders involved in design.
- Three robots:
  - DORO.
  - CORO.
  - ORO.
- Participants had mild age-related health, motor, and cognitive deficits.
- Testing occurred in:
  - UK.
  - Italy.
  - Örebro.
- Acceptability increased after testing.

### 33.2 Acceptability chart

The acceptability slide asks:

**“I would like to use this service ...”**

It compares responses for:

- Now.
- In case of need.
- As help for family.

Visible pattern:

- “Strongly agree” is very high for **in case of need** and **as help for family**.
- “Now” is more distributed across categories.
- The lecture’s stated conclusion is: acceptability increased after testing.

**[UNCLEAR]** Exact percentages are only visible graphically; no numerical table is given.

---

# Key formulas and formal structures

## 1. Trust as change rate


$$

\text{Trust} = \text{Change Rate}

$$



$$

\text{Change Rate}
=
\frac{
\text{Number of participants' price changes}
}{
\text{Number of cases when the robot disagrees}
}

$$


Used in the price judgment game.

## 2. Investment amount as implicit trust


$$

\text{Investment amount} = \text{implicit measure of trust}

$$


Used in repeated economic games with robots.

## 3. Bayesian ToM trust dependency

Reliable informant case:


$$

Y_C \leftarrow \{X_C, Y_R\}

$$


Unreliable informant case:


$$

Y_C \leftarrow \{X_C, Y_U\}

$$


where $X_C$ is child belief, $Y_C$ is child action, $Y_R$ is reliable informant action, and $Y_U$ is unreliable informant action.

## 4. Effect sizes in robot education


$$

d_{\text{cognitive}} = 0.70,\quad 95\%\,CI=[0.66,0.75]

$$



$$

d_{\text{affective}} = 0.59,\quad 95\%\,CI=[0.51,0.66]

$$


Robot appearance examples:


$$

d_{\text{Keepon}} = 0.56,\quad N=10

$$



$$

d_{\text{Nao}} = 0.76,\quad N=8

$$


---

# Connections across the two lectures

- **Developmental robotics → HRI:** Lecture 2a’s social learning and imitation principle connects directly to Lecture 2b’s social HRI, trust, gaze, imitation, and interaction.
- **Embodiment → education robots:** Lecture 2a’s embodiment principle reappears in Lecture 2b’s comparison of physical robots, on-screen robots, and computer-only tutoring.
- **ToM → trust:** Theory of Mind appears as a developmental psychology concept and then becomes a robot trust model.
- **Pose recognition → intention reading:** OpenPose/Kinect are not just perception tools; the HRI application is reading human action and intention.
- **Language acquisition → robot tutors:** Developmental robotics of language acquisition connects to robot tutors for children, vocabulary learning, and peer/novice roles.
- **Intrinsic motivation → open-ended learning:** The Playground Experiment motivates autonomous exploration, later linked to online/open-ended cumulative learning.

---

# Unclear sections to check in recording

1. **Transcript missing:** No transcript was provided/found, so no spoken emphasis or exam comments can be captured.
2. **Principle 2 missing:** Content slide lists “phylogenetic-ontogenetic interaction,” but no detailed Principle 2 slide appears in the uploaded deck.
3. **ASR typo:** “Hidden Marcov Models” appears on the slide; likely intended as Hidden Markov Models.
4. **Sally-Anne parsed-text mismatch:** Parsed text says “Ann returns” and asks where Anne believes the object is; the image/logic indicates Sally returns and the false-belief question concerns Sally.
5. **Bayesian ToM details:** The slide gives BN structure and MLE, but not probability tables or derivation.
6. **Playground sensors:** The three sensor labels are not defined in the slide text.
7. **Graph values:** Microphone comparison, social/humanoid priming, investment game, Leyzberg learning gains, and Robot-Era acceptability charts need the slide/recording for exact numerical values.
8. **Piaget slides:** The deck uses screenshot material from an external source; the main stage labels are readable, but detailed definitions should be checked against lecture commentary if the lecturer expanded them.
