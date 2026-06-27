---
subject: COMP64301
chapter: 9
title: "Week 9 — Face Detection (Viola-Jones)"
language: en
---

# Face Detection: The Viola-Jones Algorithm — Study Notes

> **Source basis:** Slides only: `FaceDetection2025.pdf`.  
> **Transcript status:** No transcript was provided, so these notes do **not** include transcript-only lecturer comments, verbal exam hints, or extra derivations. Where the slides are underspecified, sections are marked **[UNCLEAR]** rather than filled in from outside knowledge.

---

## Topic and scope

This lecture introduces **face detection** as a machine vision task and explains the **Viola-Jones algorithm**: simple rectangle features, integral images for fast computation, AdaBoost for selecting useful features, and a cascade classifier for real-time detection.

**Course context:** Computer vision / machine vision; appendix slides show **COMP37212**.  
**Lecture topic:** Face Detection — the Viola-Jones Algorithm.

---

# 1. Human Vision and Faces

## 1.1 Newborns and imitation

The lecture begins by motivating face detection from human vision.

- Even **ten minutes after birth**, babies can imitate adult facial expressions/actions.
- This works even though early infant vision can only perceive **low-frequency information**.
- “Low-frequency” here means the visual input is very blurred: fine detail is not available, but broad dark/light structures are.

### Key concept: Low-frequency visual information

**Intuition:**  
A face does not need to be seen in sharp detail to be recognisable as a face. Coarse spatial layout — dark eye regions, lighter forehead/cheek regions, mouth region — can already provide useful cues.

**Formal definition from slides:**  
No mathematical definition is given. The slide describes it as early vision being “very blurred.”

---

## 1.2 Humans are highly tuned for face detection

The slides show examples of face-like patterns in:

- natural formations,
- cars,
- rooftops,
- objects,
- textures,
- random shapes.

The point is that humans often perceive faces even where no real face exists.

### Key concept: Face-like pattern bias

**Intuition:**  
Human vision is strongly tuned to detect face-like arrangements. This is useful for real faces, but it also causes false positives: we see faces in objects and natural patterns.

**Formal definition from slides:**  
No formal definition is given. The slide states that humans “tend to perceive faces everywhere” and are “highly-tuned for facial detection.”

---

# 2. Face Detection in Machine Vision

## 2.1 Commercial applications

The slides distinguish **face detection**, **face recognition**, and related animal detection applications.

### Face detection applications

Face detection is used for:

- red-eye removal,
- camera focus and exposure,
- tracking,
- adult/child detection,
- specific focusing.

### Face recognition applications

Face recognition is used for:

- saving person-specific settings,
- image retrieval.

### Cat and dog detection applications

Animal face detection can be used for:

- focus and exposure,
- taking a picture when the animal is face-on.

---

## 2.2 Face detection vs face recognition

### Key concept: Face detection

**Intuition:**  
Face detection answers: “Where are the faces in this image?”

It does not identify who the person is. It only finds regions that likely contain faces.

**Formal definition from slides:**  
The task is to:

> scan images and find regions that contain examples of the object of interest.

For this lecture, the object of interest is a **face**.

### Key concept: Face recognition

**Intuition:**  
Face recognition goes beyond detecting a face. It tries to identify the person, and possibly their expression.

**Formal definition from slides:**  
The summary slide states that face detection is **not the same as facial recognition**, where recognition involves:

- identifying a person,
- identifying their expression.

---

# 3. Visual Clues for Detecting Faces

## 3.1 Basic facial structure

The slides show that face detection can rely on simple image cues:

- basic features and their relationship,
- simple patterns in blurred grayscale patches,
- contrast-adjusted patches,
- dark and light regions,
- simple horizontal and vertical patterns.

The lecture uses blurred face patches to show that faces remain recognisable even after much detail is removed.

---

## 3.2 Face layout as rectangular regions

The slides describe a simplified face layout:

- forehead,
- eyes,
- nose,
- cheekbones,
- upper lip,
- chin.

A crude face template can be built from rectangular regions:

- forehead is relatively light,
- eyes are darker,
- cheekbone/upper-face region differs from eye region,
- mouth/upper-lip region forms another horizontal contrast pattern.

### Key concept: Rectangular feature detector

**Intuition:**  
Instead of trying to recognise eyes, nose, and mouth directly, the algorithm can test whether certain rectangular regions are darker or lighter than nearby rectangular regions.

For example:

- eyes may be darker than cheekbones,
- eyes may be darker than the bridge of the nose.

**Formal definition:**

The formal rectangle feature definition appears later in the slides:


$$

F = \sum_{\vec r \in A} I(\vec r) - \sum_{\vec r \in B} I(\vec r)

$$


where:

- $I(\vec r)$ is the image intensity at location $\vec r$,
- $A$ and $B$ are two rectangular regions,
- the feature value compares the total intensity in region $A$ against the total intensity in region $B$.

---

# 4. The Learning Task

## 4.1 Object detection as scanning

The object detection task is:

- scan the image,
- consider many candidate regions,
- decide whether each region contains the object of interest.

In this lecture, the object is a **frontal upright face**.

---

## 4.2 Learning approach

The slides specify a supervised learning setup:

- given **positive examples**: image patches containing faces,
- given **negative examples**: image patches not containing faces,
- learn:
  - the best features,
  - the best classifier.

### Key concept: Positive and negative examples

**Intuition:**  
The algorithm learns what face patches look like by comparing them against non-face patches.

**Formal definition from slides:**  
No formal notation is given. The slides describe the training setup as “given positive and negative examples.”

---

# 5. Fast Face Detection Requirements

The Viola-Jones detector is motivated by speed and accuracy requirements.

## 5.1 Performance requirements

The slides list three requirements:

- **Speed of computation:** about **15 frames per second**.
- **Detection rate:** about **90%–95%**.
- **False positive rate:** about $10^{-5}$.

### Key concept: Detection rate

**Intuition:**  
Detection rate measures how many true faces the system successfully finds.

**Formal definition from slides:**  
No formal equation is given. The slide states a target detection rate of approximately $90\%-95\%$.

### Key concept: False positive rate

**Intuition:**  
False positive rate measures how often the detector incorrectly labels a non-face region as a face.

**Formal definition from slides:**  
No formal equation is given. The slide states a target false positive rate of approximately:


$$

10^{-5}

$$


---

## 5.2 Viola-Jones design approach

To make face detection fast enough, the slides list five design choices:

1. Limit the task to **frontal, upright faces**.
2. Use **efficient-to-compute features**.
3. Use an **efficient image representation**.
4. Use **AdaBoost** for efficient feature choice.
5. Use a **cascade of classifiers**.

This is the central structure of the Viola-Jones method.

---

# 6. Rectangle Features

## 6.1 Definition of rectangle features

The slides define rectangle features as comparisons between sums of pixel intensities in rectangular regions.


$$

F = \sum_{\vec r \in A} I(\vec r) - \sum_{\vec r \in B} I(\vec r)

$$


where:

- $A$ is one rectangular region,
- $B$ is another rectangular region,
- $I(\vec r)$ is the image intensity at pixel/location $\vec r$,
- the feature value is the difference between total brightness in $A$ and total brightness in $B$.

### Intuition

A rectangle feature asks a simple question:

> Is this rectangular region brighter or darker than that nearby rectangular region?

For face detection, this can capture patterns such as:

- eye regions darker than cheekbones,
- eye regions darker than the bridge of the nose,
- horizontal bands corresponding to forehead/eyes/mouth/chin.

---

## 6.2 Types of rectangle features

The slides show several feature arrangements.

### Two-rectangle features

Example:


$$

A \quad B

$$


This compares one rectangle against another.

### Three-rectangle features

Example:


$$

A \quad B \quad A

$$


This compares a middle region against two surrounding regions.

### Four-rectangle / diagonal-style features

Example:


$$

\begin{matrix}
A & B \\
B & A
\end{matrix}

$$


This captures diagonal contrast patterns.

The slides describe these as:

- vertical feature detectors,
- horizontal feature detectors,
- diagonal feature detectors.

---

## 6.3 Why not simple convolution?

The slides state:

> Implementation as convolution too inefficient.

The idea is that directly convolving many rectangle filters across all positions and scales would be too slow, especially because there are many possible rectangles.

**[UNCLEAR]** The slides do not give a detailed runtime comparison or convolution cost derivation.

---

# 7. Integral Image Representation

## 7.1 Definition of the integral image

The slides introduce an efficient image representation called the **integral image**.

Given an original image $I(x,y)$, the integral image $J(x,y)$ stores the sum of all image values above and to the left of $(x,y)$:


$$

J(x,y) =
\sum_{x' \le x}
\sum_{y' \le y}
I(x',y')

$$


### Intuition

At each location $(x,y)$, the integral image tells you the total brightness of the rectangular region from the image origin to $(x,y)$.

So instead of summing pixels inside a rectangle one by one, you can use a few integral image values.

---

## 7.2 Computing the integral image

The slides state:

- the integral image can be computed in **one pass**,
- it contains all information in the original image.

### Key concept: Integral image

**Intuition:**  
The integral image is a cumulative-sum version of the image. It allows rectangular sums to be computed very quickly.

**Formal definition:**


$$

J(x,y) =
\sum_{x' \le x}
\sum_{y' \le y}
I(x',y')

$$


**[UNCLEAR]** The slides do not show the one-pass recurrence formula.

---

## 7.3 Visual behaviour of the integral image

The slides compare an original image $I(x,y)$ with an integral image $J(x,y)$.

They show that:

- where the original image has zero values, the integral image is flat,
- where the original image has positive values, the integral image increases,
- where there is no additional intensity being accumulated, the integral image remains constant in that direction.

The key point is:

> the integral image contains all information in the original image.

---

# 8. Rectangle Features Using the Integral Image

## 8.1 Sum over a rectangle using four references

The slides show that the sum of pixels inside a rectangular region can be computed using four array references.

Using the slide’s corner labels $A,B,C,D$:


$$

\sum_{\vec r \in ABCD} I(\vec r)
=
J(D) - J(C) + J(A) - J(B)

$$


Equivalently, this is the usual inclusion–exclusion idea:

- take the cumulative sum up to the bottom-right corner,
- subtract regions outside the desired rectangle,
- add back the region subtracted twice.

### Worked symbolic example: single rectangle sum

Suppose the desired rectangle is bounded by four integral-image corner references $A,B,C,D$.

Step 1: Start from the full cumulative sum at $D$:


$$

J(D)

$$


Step 2: Remove the extra cumulative region on one side:


$$

J(D) - J(C)

$$


Step 3: Remove the extra cumulative region on the other side:


$$

J(D) - J(C) - J(B)

$$


Step 4: Add back the region removed twice:


$$

J(D) - J(C) - J(B) + J(A)

$$


The slide writes the same expression as:


$$

J(D) - J(C) + J(A) - J(B)

$$


So the rectangle sum is obtained using only **four integral-image values**.

---

## 8.2 Number of array references for different features

The slides give the following counts:

| Feature type | Number of array references |
|---|---:|
| Single rectangle | 4 |
| Two-rectangle feature | 6 |
| Three-rectangle feature | 8 |
| Four-rectangle feature | 9 |

The two-rectangle case uses **6 rather than 8** references because neighbouring rectangles share corner points.

### Key point

Rectangle features become efficient because the integral image makes each rectangular sum fast, independent of the rectangle’s area.

---

# 9. Rectangle Features on Faces

## 9.1 Face patch size

The detector uses:


$$

24 \times 24

$$


frontal face patches that are roughly aligned.

This means each candidate face window is normalised to a small fixed-size patch.

---

## 9.2 Feature pool

The slides state that the system uses:

- 2-rectangle features,
- 3-rectangle features,
- 4-rectangle features,
- various scales,
- various locations.

This creates approximately:


$$

160{,}000

$$


possible rectangle features.

### Key problem

The algorithm must decide:

> Which rectangle features are actually useful?

The slide also asks:

> Poor contrast locally?

**[UNCLEAR]** The slide raises local contrast as an issue but does not explain the handling in detail.

---

# 10. AdaBoost Face Classifier

## 10.1 Training data

The slides give the training dataset:

- $5000$ face patches,
- $10{,}000$ non-face patches,
- each patch is $24 \times 24$.

So the classifier is trained using labelled positive and negative examples.

---

## 10.2 Feature selection result

The slides state:

- AdaBoost selected **200 features** from **160,000** possible features.
- Result:
  - **95% detection rate**,
  - **1 in 14,084 false positive rate**.

### Key concept: AdaBoost in this lecture

**Intuition:**  
AdaBoost is used to choose a small set of useful rectangle features from a very large pool. Instead of evaluating all 160,000 features, the classifier uses a much smaller selected subset.

**Formal definition from slides:**  
No AdaBoost algorithm or update equations are given in the slides. The slides only state its role: efficient choice of features/classifier.

**[UNCLEAR]** The internal AdaBoost training procedure is not shown in the slide deck.

---

## 10.3 First two AdaBoost features

The slides identify the first two features selected by AdaBoost.

### Feature 1: Eyes darker than cheekbones

The selected rectangle feature compares the eye region with the cheekbone region.

Interpretation:

- eyes tend to be darker,
- cheekbones tend to be lighter,
- the contrast is useful for detecting frontal faces.

### Feature 2: Eyes darker than bridge of nose

The selected rectangle feature compares the eye regions with the bridge of the nose.

Interpretation:

- eye sockets/eyes are darker,
- the bridge of the nose is lighter,
- this contrast is another strong face cue.

These examples show why simple rectangular intensity comparisons can work for face detection.

---

# 11. Searching the Whole Image

## 11.1 Multi-scale and multi-position search

The slides state that, when searching a full image, the detector must consider:

- a range of possible scales,
- all possible patch positions.

This means the detector cannot assume faces are always the same size or at the same location.

---

## 11.2 Most patches are not faces

The slides emphasise:

> Most patches are NOT faces.

This is crucial for the cascade idea. Since most image windows are background/non-face, the algorithm should reject obvious non-faces quickly instead of spending full computation on every window.

---

# 12. Cascade Classifier

## 12.1 Motivation

The slides state:

- In a full image, most sub-windows are not faces.
- A single-stage AdaBoost classifier is too slow for scanning every possible window.
- But AdaBoost demonstrates that rectangle features can detect faces.

So the solution is to use a **cascade classifier**.

---

## 12.2 How the cascade works

The cascade processes candidate windows in stages.

### Stage 1

Stage 1 quickly rejects many non-faces:

- about **70% of non-faces** are rejected immediately,
- about **30% of non-faces** pass to the next stage,
- about **99% of faces** pass to the next stage.

So Stage 1 is deliberately permissive for true faces but aggressive against obvious non-faces.

### Later stages

Windows that pass Stage 1 are checked by Stage 2, then later stages.

The key idea:

> do not waste time on further processing for windows that already look like non-faces.

---

## 12.3 Worked example: 10-stage cascade

The slide gives a 10-stage cascade calculation.

Assume each stage:

- passes $30\%$ of non-faces,
- passes $99\%$ of faces.

### False positive rate

For a non-face to survive all 10 stages, it must pass every stage:


$$

(0.3)^{10}

$$


Compute:


$$

(0.3)^{10} \approx 6 \times 10^{-6}

$$


So the false positive rate is approximately:


$$

6 \times 10^{-6}

$$


This is close to the target false positive rate of about $10^{-5}$.

### Detection rate

For a true face to survive all 10 stages, it must also pass every stage:


$$

(0.99)^{10}

$$


Compute:


$$

(0.99)^{10} \approx 0.9

$$


So the detection rate is approximately:


$$

90\%

$$


### Interpretation

The cascade achieves both:

- low false positives,
- high detection rate,

while avoiding expensive computation on most non-face windows.

---

# 13. Viola-Jones Cascade Classifier

The slides cite:

**Paul Viola & Michael Jones, “Robust Real-Time Face Detection,” International Journal of Computer Vision, 57(2), 137–154, 2004.**

## 13.1 Reported system details

The Viola-Jones cascade classifier used:

- **38 stages**,
- stages of varying complexity,
- **6060 features** in total.

Training:

- trained in a day,
- used parallel processing.

Runtime:

- searched a $384 \times 288$ pixel image in **0.067 seconds**.

Other properties:

- applies features at multiple scales and locations,
- was **15 times faster** than previous approaches,
- can be generalised to other objects such as:
  - people,
  - cars,
  - cats,
  - dogs.

---

# 14. Original Face Detection Results

## 14.1 Works at different scales and small rotations

The slides show detection boxes on faces of different sizes.

The stated result:

- works at various scales,
- works under small rotation.

This matches the earlier design point that the detector searches over multiple scales and locations.

---

## 14.2 Finds multiple faces in a single image

The slides show a group photograph with many detected faces.

The stated result:

- finds multiple faces within a single image.

This shows that the detector is not limited to one face per image.

---

## 14.3 Failure cases

The slides list two limitations:

- fails for faces in profile,
- occasional mistakes.

### Why profile faces fail

This is expected because the approach was explicitly limited to **frontal, upright faces**.

So the failure is not surprising: the training/design assumptions do not cover profile faces.

### Occasional mistakes

The slides show examples of incorrect detections.

**[UNCLEAR]** The slides do not quantify the mistakes in these examples or give a detailed failure analysis.

---

# 15. Face Detection Summary

The summary slide gives the main takeaways:

- fast detectors are available,
- they are sufficient for commercial applications,
- face detection is not the same as facial recognition,
- similar feature detection can be applied to:
  - eyes,
  - mouths,
  - other facial parts,
- another approach is to use:
  - eigen models,
  - shape models.

### Key distinction

Face detection:


$$

\text{Find face regions}

$$


Face recognition:


$$

\text{Identify the person and/or expression}

$$


---

# 16. Appendix: Detecting Cats

## 16.1 Cat faces have more variation

The appendix says:

> Cat faces: greater appearance variation than human.

So detecting cat heads is treated as a harder or more varied version of the detection problem.

---

## 16.2 Cat detection features

The cat detector uses:

- image intensity,
- image gradient channels.

The listed channels are:

- intensity,
- vertical,
- horizontal,
- two diagonals.

The method uses:

- within-channel rectangle/Haar features,
- between-channel rectangle/Haar features.

The cited work is:

**Zhang, Sun, and Tang, “Cat Head Detection: How to Effectively Exploit Shape and Texture Features,” ECCV 2008.**

---

## 16.3 Cat head detection results

The final slide shows cat images with detection boxes around cat heads.

The slide title is:

> Cat Head Detection: Results

**[UNCLEAR]** The slide gives visual results only; no numerical detection rate or false positive rate is shown.

---

# Key Concepts Glossary

## Face detection

**Intuition:** Find where faces are in an image.  
**Formal slide definition:** Scan images and find regions containing examples of the object of interest.

## Face recognition

**Intuition:** Identify who the face belongs to, and possibly the expression.  
**Formal slide definition:** The slides describe it as identifying a person and their expression.

## Rectangle feature

**Intuition:** Compare brightness sums between rectangular image regions.  
**Formal definition:**


$$

F = \sum_{\vec r \in A} I(\vec r) - \sum_{\vec r \in B} I(\vec r)

$$


## Integral image

**Intuition:** A cumulative-sum image that allows fast rectangular area sums.  
**Formal definition:**


$$

J(x,y) =
\sum_{x' \le x}
\sum_{y' \le y}
I(x',y')

$$


## AdaBoost classifier

**Intuition:** Used to select a small number of useful rectangle features from a very large feature pool.  
**Formal definition from slides:** No AdaBoost equations are provided.

## Cascade classifier

**Intuition:** A sequence of classifiers where early stages quickly reject obvious non-faces, so later stages only process harder candidates.  
**Formal slide example:**


$$

\text{False positive rate} = (0.3)^{10} \approx 6 \times 10^{-6}

$$



$$

\text{Detection rate} = (0.99)^{10} \approx 0.9 = 90\%

$$


---

# Clean Formula Sheet

## Rectangle feature


$$

F = \sum_{\vec r \in A} I(\vec r) - \sum_{\vec r \in B} I(\vec r)

$$


## Integral image


$$

J(x,y) =
\sum_{x' \le x}
\sum_{y' \le y}
I(x',y')

$$


## Rectangle sum from integral image

Using the slide’s corner labels:


$$

\sum_{\vec r \in ABCD} I(\vec r)
=
J(D) - J(C) + J(A) - J(B)

$$


Equivalent ordering:


$$

J(D) - J(C) - J(B) + J(A)

$$


## 10-stage cascade false positive rate


$$

(0.3)^{10} \approx 6 \times 10^{-6}

$$


## 10-stage cascade detection rate


$$

(0.99)^{10} \approx 0.9 = 90\%

$$


---

# Algorithmic Pipeline from the Slides

## Training pipeline

1. Collect $24 \times 24$ training patches.
2. Use positive examples: face patches.
3. Use negative examples: non-face patches.
4. Generate many rectangle features at different positions and scales.
5. Use AdaBoost to select useful features.
6. Build a face classifier.
7. Arrange classifiers into a cascade.

## Detection pipeline

1. Take a full image.
2. Search over many candidate windows.
3. Search over multiple scales.
4. For each window, apply Stage 1 of the cascade.
5. Reject obvious non-faces early.
6. Pass remaining windows to later stages.
7. Windows that pass all stages are labelled as faces.

---

# Worked Examples Preserved from Slides

## Worked Example 1: Rectangle sum using integral image

Goal:


$$

\sum_{\vec r \in ABCD} I(\vec r)

$$


Step 1: Use cumulative sum at bottom-right corner:


$$

J(D)

$$


Step 2: Remove one unwanted cumulative region:


$$

J(D) - J(C)

$$


Step 3: Remove the other unwanted cumulative region:


$$

J(D) - J(C) - J(B)

$$


Step 4: Add back the region removed twice:


$$

J(D) - J(C) - J(B) + J(A)

$$


Final:


$$

\sum_{\vec r \in ABCD} I(\vec r)
=
J(D) - J(C) + J(A) - J(B)

$$


---

## Worked Example 2: Cascade false positive rate

Given:

- each stage passes $30\%$ of non-faces,
- there are 10 stages.

A false positive must pass all 10 stages:


$$

0.3 \times 0.3 \times \cdots \times 0.3
=
(0.3)^{10}

$$


Therefore:


$$

(0.3)^{10} \approx 6 \times 10^{-6}

$$


So the 10-stage cascade gives a very low false positive rate.

---

## Worked Example 3: Cascade detection rate

Given:

- each stage passes $99\%$ of faces,
- there are 10 stages.

A true face must pass all 10 stages:


$$

0.99 \times 0.99 \times \cdots \times 0.99
=
(0.99)^{10}

$$


Therefore:


$$

(0.99)^{10} \approx 0.9

$$


So the overall detection rate is approximately:


$$

90\%

$$


---

# Exam Flags

No explicit transcript phrases such as “this will be on the exam,” “you should know this,” or “common mistake” are available from the slides alone.

## High-value revision points from slide emphasis

These are not transcript-confirmed exam flags, but they are the most central slide concepts:

- **Rectangle feature definition**

  
$$

  F = \sum_{\vec r \in A} I(\vec r) - \sum_{\vec r \in B} I(\vec r)
  
$$


- **Integral image definition**

  
$$

  J(x,y) =
  \sum_{x' \le x}
  \sum_{y' \le y}
  I(x',y')
  
$$


- **Why integral images make rectangle features efficient**
- **Number of references for rectangle features**
  - single rectangle: 4,
  - two-rectangle: 6,
  - three-rectangle: 8,
  - four-rectangle: 9.
- **AdaBoost selects 200 features from 160,000**
- **First two selected face features**
  - eyes darker than cheekbones,
  - eyes darker than bridge of nose.
- **Cascade classifier calculation**

  
$$

  (0.3)^{10} \approx 6 \times 10^{-6}
  
$$


  
$$

  (0.99)^{10} \approx 90\%
  
$$


- **Limitation to frontal upright faces**
- **Face detection is not face recognition**

---

# Connections

## Connection to human vision

The lecture connects human face perception to machine face detection:

- humans detect faces from coarse, low-frequency information,
- machines can exploit similarly coarse dark/light rectangular patterns.

## Connection to object detection

The same scan-and-classify structure can generalise beyond faces to:

- people,
- cars,
- cats,
- dogs.

## Connection to feature detection

The summary slide says similar feature detection can be applied to:

- eyes,
- mouths,
- other facial parts.

## Connection to later/different methods

The final summary mentions another approach:

- eigen models,
- shape models.

**[UNCLEAR]** The slides do not explain eigen models or shape models in this deck.

---

# Unclear / Missing Sections

- **[UNCLEAR] No transcript available.** Any verbal explanation, exam hints, lecturer emphasis, or extra derivations are missing.
- **[UNCLEAR] AdaBoost details.** The slides state that AdaBoost chooses features but do not give the AdaBoost update equations or training algorithm.
- **[UNCLEAR] Integral image one-pass computation.** The slides state it can be computed in one pass but do not show the recurrence.
- **[UNCLEAR] “Poor contrast locally?”** The slide raises this issue but does not explain how it is handled.
- **[UNCLEAR] Missing slide numbers.** The uploaded deck jumps between slide numbers, so some content may have been omitted or hidden.
- **[UNCLEAR] Cat detection results.** The appendix gives visual results but no quantitative metrics.
