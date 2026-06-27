---
subject: COMP64301
chapter: 11
title: "Week 11 — Visual Tracking"
language: en
---

# Visual Tracking — Structured Study Notes

**Source:** `visualTracking-2023-MSC.pdf`  
**Transcript status:** No transcript provided; these notes are based on the slides only.  
**Course:** [not specified in slides]  
**Lecture topic:** Visual Tracking

## Topic and scope

This lecture introduces **visual tracking**: estimating the state of objects over time from image sequences. It contrasts detection with tracking, formulates tracking as Bayesian inference over hidden states and observations, then covers Kalman filters, particle filters, background modelling, and practical tracking issues.

---

# 1. Detection vs Tracking

## 1.1 Detection

### Intuition

Detection treats each video frame independently. The object is found again from scratch in every frame, and its position can then be recorded over time.

### Slide definition

Detection means detecting the object independently in each frame and recording its position over time, for example using:

- the centroid of a blob;
- coordinates of a detection window.

### Example from slides

The slides show a sequence of frames labelled:


$$

t=1,\quad t=2,\quad \ldots,\quad t=20,\quad t=21

$$


A red bounding box marks the detected object in each frame.

### Key point

Detection does **not** explicitly use the previous frame's estimate to predict where the object should appear next.

---

## 1.2 Tracking with dynamics

### Intuition

Tracking uses both:

1. the current image measurement; and
2. an expectation of how the object should move.

Instead of asking only "where does the detector fire now?", tracking also asks:


$$

\text{given where the object was before, where should it probably be now?}

$$


### Slide definition

Tracking with dynamics uses image measurements to estimate the object position, but also incorporates the position predicted by dynamics, meaning the expected motion pattern of the object.

### Why this helps

Tracking with dynamics can:

- restrict the search region;
- reduce the effect of noisy measurements;
- avoid jumping to implausible detections;
- smooth the estimated trajectory over time.

### Example from slides

The object moves left across frames. The slides show image measurements along with a motion arrow / predicted position, indicating that the tracker uses the expected direction of motion.

---

# 2. What Are We Tracking?

The lecture separates two questions:

1. **What state variables do we want to estimate?**
2. **What image evidence do we use to estimate them?**

---

## 2.1 Object properties that may be tracked

The tracker may estimate:

- position;
- velocity;
- acceleration;
- shape;
- size;
- deformation;
- 3D structure;
- other task-specific variables.

These are the **state variables**: the hidden quantities we care about.

---

## 2.2 Image properties that may be tracked

The tracker may use image evidence such as:

- intensity / colours;
- region statistics;
- contours / edges;
- shapes;
- motion.

These are **measurements** or **observations**: image-derived signals that help infer the hidden state.

---

# 3. Tracking Using Feature Detection

The slides use feature-based tracking as an early example.

Reference shown on slides:

> Gu et al., *Efficient Visual Object Tracking with Online Nearest Neighbor Classifier*, ACCV 2010.

---

## 3.1 Basic idea

Feature-based tracking builds an appearance model from visual features and uses those features to locate the target in later frames.

A typical setup contains:

- an **object model**;
- a **background model**;
- feature matching in subsequent frames;
- an update of the object appearance model.

---

## 3.2 Initialisation

### Slide process

1. Start with an initial frame.
2. Mark or detect the object region.
3. Extract features inside the object window.
4. Extract background features outside the object window.
5. Build two models:
   - object model;
   - background model.

The slide shows green feature points inside the face/object window and blue points outside it.

### Key concept: object model

**Intuition:** A representation of what the target looks like.

**In this slide context:** The object model is built from features extracted inside the initial target window.

### Key concept: background model

**Intuition:** A representation of what non-target image regions look like.

**In this slide context:** The background model is built from features extracted outside the target region.

---

## 3.3 Subsequent frames

For later frames, the tracker:

1. extracts or detects features;
2. matches those features against the object/background models;
3. fits the best window around the likely object location;
4. updates the object appearance model.

### Important mechanism

The tracker is adaptive: after locating the object, it updates the object appearance model so it can follow changes in appearance over time.

### [UNCLEAR]

The slides show the update loop, but without the transcript they do not explain the failure cases in detail. Model update could potentially cause tracker drift, but this is not explicitly discussed in the slides.

---

# 4. Other Tracking Scenarios

The slides show **vision-based motion capture** as another scenario.

In this setting, the tracker is not merely following a bounding box. It may estimate a human body configuration, such as a skeleton or articulated pose.

This connects to later parts of the lecture where particle filters are described as useful for complicated state spaces, such as articulated tracking in joint-angle spaces.

---

# 5. Why Visual Tracking Is Difficult

The slides illustrate tracking difficulty using a human figure and label several sources of difficulty.

---

## 5.1 Loss of 3D information in 2D projection

### Intuition

The real world is 3D, but the camera image is 2D. Different 3D configurations can produce similar 2D images.

### Tracking consequence

The tracker may not know whether an apparent image change is caused by:

- object motion;
- pose change;
- camera viewpoint;
- depth ambiguity;
- projection effects.

---

## 5.2 Unusual poses

Objects, especially humans, can appear in poses that are not well captured by a simple model.

### Example

A walking person may place limbs in unusual positions relative to the camera.

---

## 5.3 Self-occlusion

Parts of an object can hide other parts of the same object.

### Example

A person's arm or leg can occlude part of their torso.

### Tracking consequence

The observation model may not see all relevant object parts at every frame.

---

## 5.4 Low contrast

If the object has weak contrast against the background, image evidence becomes unreliable.

### Tracking consequence

The likelihood / observation model may become weak or ambiguous.

---

# 6. Practical Simplifications

The slides list conditions that make tracking easier in practice.

## 6.1 Known or stationary background

If the background is known or does not move, foreground objects can be detected more easily.

Example from slides:

- tracking blobs.

---

## 6.2 Distinct a priori colours

If the object has distinctive colours, colour features can help identify it.

Example from slides:

- skin colour.

---

## 6.3 Multiple cameras

Multiple cameras, often 2 or 3, can reduce ambiguity caused by a single 2D view.

---

## 6.4 Manual initialisation

Instead of solving object discovery automatically, the tracker can start from a manually supplied target location.

---

## 6.5 Strong dynamics model

A strong motion model can predict likely future states and reduce the search space.

---

## 6.6 Prior knowledge of number and type of objects

If the number of objects and their types are known, the tracker does not need to solve a fully open-ended scene interpretation problem.

---

## 6.7 Sufficient object size

Tracking is easier when the target occupies enough pixels to provide useful visual evidence.

---

## 6.8 Limited occlusion

Tracking becomes easier when the object is not frequently hidden by itself, other objects, or the environment.

---

# 7. Tracking with Dynamics

## 7.1 Key idea

Given a model of expected motion, predict where objects will occur in the next frame before seeing the image.


$$

\text{past state estimates} + \text{dynamics model} \rightarrow \text{prediction for next frame}

$$


---

## 7.2 Goals

Tracking with dynamics has two main goals.

### Goal 1: Restrict search

The tracker does not need to search the entire image equally. It can focus on regions where the object is predicted to be.

### Goal 2: Improve estimates

Measurement noise is reduced by using trajectory smoothness.

That is, a noisy frame-by-frame measurement can be corrected by considering whether it fits the expected trajectory.

---

## 7.3 Assumption: continuous motion patterns

The slides state that tracking with dynamics assumes continuous motion patterns:

- the camera does not instantly move to a completely new viewpoint;
- objects do not disappear and reappear in different places;
- pose changes gradually between camera and scene.

### Key intuition

Tracking works because video is temporally coherent. Consecutive frames are usually related by gradual change.

---

# 8. General Model for Tracking

## 8.1 State and observation

The moving object is characterised by an underlying state:


$$

X

$$


The state gives rise to measurements or observations:


$$

Y

$$


At each time step $t$:

- the state changes to $X_t$;
- a new observation $Y_t$ is received.

The temporal structure is:


$$

X_1 \rightarrow X_2 \rightarrow \cdots \rightarrow X_t

$$


with observations:


$$

X_1 \rightarrow Y_1,\quad X_2 \rightarrow Y_2,\quad \ldots,\quad X_t \rightarrow Y_t

$$


---

## 8.2 Hidden state

### Intuition

The hidden state is what we really want to know.

### Slide definition

Hidden state = parameters of interest.

### Examples

The hidden state may include:

- true object position;
- velocity;
- acceleration;
- pose;
- shape;
- size;
- deformation;
- joint angles;
- 3D structure.

---

## 8.3 Measurement / observation

### Intuition

The measurement is what the image gives us directly.

### Slide definition

Measurement = what we get to directly observe.

### Examples

Measurements may include:

- image pixels;
- foreground blobs;
- colour features;
- edge locations;
- contours;
- detection windows;
- classifier scores.

---

# 9. Tracking as Inference

## 9.1 Tracking problem

The hidden state consists of the true parameters we care about, denoted:


$$

X

$$


The measurement is a noisy observation produced from the underlying state, denoted:


$$

Y

$$


At each time step:


$$

X_{t-1} \rightarrow X_t

$$


and we receive:


$$

Y_t

$$


---

## 9.2 Goal

The goal is to recover the most likely current state:


$$

X_t

$$


given:

1. all observations seen so far;
2. knowledge about the dynamics of state transitions.

Formally, the target posterior is:


$$

P(X_t \mid y_0, y_1, \ldots, y_t)

$$


or equivalently:


$$

P(X_t \mid y_0, \ldots, y_t)

$$


---

## 9.3 Prediction and correction

Tracking consists of two repeated steps.

### Prediction

Ask:


$$

\text{What is the next state of the object given past measurements?}

$$


This uses the **dynamics model**.

### Correction

Ask:


$$

\text{How should the prediction be updated using the new measurement?}

$$


This uses the **observation model**.

---

## 9.4 Posterior propagation

The slides describe tracking as propagating the posterior distribution of the state given measurements across time.

Before new measurement:


$$

P(X_t \mid y_0, \ldots, y_{t-1})

$$


After new measurement:


$$

P(X_t \mid y_0, \ldots, y_t)

$$


---

# 10. Simplifying Assumptions

The slides introduce two core probabilistic assumptions.

---

## 10.1 Markov dynamics assumption

### Intuition

Only the immediate past state matters for predicting the current state.

### Formal definition


$$

P(X_t \mid X_0, \ldots, X_{t-1}) = P(X_t \mid X_{t-1})

$$


This is the **dynamics model**.

### Meaning

The full history of states is not needed once we know the immediately previous state.

---

## 10.2 Current-state observation assumption

### Intuition

The current measurement depends only on the current state.

### Formal definition


$$

P(Y_t \mid X_0, Y_0, \ldots, X_{t-1}, Y_{t-1}, X_t)
=
P(Y_t \mid X_t)

$$


This is the **observation model**.

### Meaning

Once the current hidden state $X_t$ is known, older states and observations do not directly affect the current measurement.

---

## 10.3 Graphical model interpretation

The slide diagram represents a hidden Markov model-like structure:


$$

X_1 \rightarrow X_2 \rightarrow \cdots \rightarrow X_t

$$


and:


$$

X_i \rightarrow Y_i

$$


for each time step $i$.

---

# 11. Problem Formulation Example: Cars on a Road

The slides use a road/car example to formulate tracking.

---

## 11.1 Goal

Estimate car positions at each time instant.

---

## 11.2 Observations

The observations are:

- image sequences;
- known background.

---

## 11.3 Background subtraction

The slide shows:


$$

\text{current image} - \text{known background} = \text{foreground / object evidence}

$$


The result is an image where car-like foreground blobs remain.

---

## 11.4 State and observations

The slide identifies:


$$

\text{system states} = \text{car positions}

$$



$$

\text{observations} = \text{images}

$$


A possible state representation is:


$$

X_t = (x_t, y_t)

$$


where $(x_t, y_t)$ is the car position at time $t$.

---

## 11.5 Likelihood, prior, and posterior

The slide writes an image likelihood:


$$

p(bg \mid car=(x,y))

$$


and shows:

### Likelihood


$$

p(bg \mid car=(x,y))

$$


This represents the noisy observation likelihood.

### Prior


$$

p(car=(x,y))

$$


This represents the prior belief about the car position.

### Posterior


$$

p(car=(x,y) \mid bg)

$$


This is obtained by Bayesian update.

### [UNCLEAR]

The variable `bg` is not defined clearly in the slides. It appears to refer to the background-subtraction observation or image evidence, not simply the background itself.

---

# 12. Tracking as Induction

## 12.1 Base case

Assume an initial prior over the state before seeing evidence:


$$

P(X_0)

$$


At the first frame, correct this prior using the observed measurement:


$$

Y_0 = y_0

$$


Bayes' rule gives:


$$

P(X_0 \mid Y_0 = y_0)
=
\frac{P(y_0 \mid X_0)P(X_0)}{P(y_0)}

$$


Since $P(y_0)$ is a normalising constant with respect to $X_0$:


$$

P(X_0 \mid Y_0 = y_0)
\propto
P(y_0 \mid X_0)P(X_0)

$$


---

## 12.2 Components of the base-case update

### Posterior probability of state given measurement


$$

P(X_0 \mid Y_0 = y_0)

$$


This is the updated belief after observing the first frame.

### Likelihood of measurement


$$

P(y_0 \mid X_0)

$$


This scores how likely the measurement is under a particular state.

### Prior of the state


$$

P(X_0)

$$


This is the belief before seeing the measurement.

---

## 12.3 Inductive step

Given a corrected estimate for frame $t$:

1. predict for frame $t+1$;
2. correct for frame $t+1$.

This repeats through the video sequence.

---

# 13. Prediction and Correction Formulas

## 13.1 Prediction formula

The predicted distribution at time $t$, before seeing $y_t$, is:


$$

P(X_t \mid y_0, \ldots, y_{t-1})
=
\int
P(X_t \mid X_{t-1})
P(X_{t-1} \mid y_0, \ldots, y_{t-1})
\, dX_{t-1}

$$


### Components


$$

P(X_t \mid X_{t-1})

$$


is the **dynamics model**.


$$

P(X_{t-1} \mid y_0, \ldots, y_{t-1})

$$


is the corrected estimate from the previous step.


$$

\int \cdots dX_{t-1}

$$


marginalises over all possible previous states.

### Intuition

To predict where the object is now, consider every possible previous state, move it forward using the dynamics model, and combine the results.

---

## 13.2 Correction formula

After observing $y_t$, update the prediction:


$$

P(X_t \mid y_0, \ldots, y_t)
=
\frac{
P(y_t \mid X_t)
P(X_t \mid y_0, \ldots, y_{t-1})
}{
\int
P(y_t \mid X_t)
P(X_t \mid y_0, \ldots, y_{t-1})
\, dX_t
}

$$


### Components


$$

P(y_t \mid X_t)

$$


is the **observation model**.


$$

P(X_t \mid y_0, \ldots, y_{t-1})

$$


is the predicted estimate.

The denominator:


$$

\int
P(y_t \mid X_t)
P(X_t \mid y_0, \ldots, y_{t-1})
\, dX_t

$$


is the normalisation constant.

### Intuition

The prediction says where the object is likely to be before seeing the frame. The observation model scores which predicted states explain the new image measurement.

---

# 14. The Kalman Filter

## 14.1 Definition

The Kalman filter is a method for tracking **linear dynamical models with Gaussian noise**.

---

## 14.2 Core property

The predicted and corrected state distributions are Gaussian.

Therefore, the filter only needs to maintain:

- mean;
- covariance.

The slides state that the calculations are easy because all the integrals can be done in closed form.

### [UNCLEAR]

The slides do not provide the full matrix Kalman filter update equations, so they are not included here.

---

## 14.3 Kalman filter cycle

The Kalman filter alternates between:

1. time update / prediction;
2. measurement update / correction.

---

## 14.4 Time update: predict

Given the corrected state from the previous time step and all measurements up to the current one, predict the distribution over the next state.

The predicted distribution is written as:


$$

P(X_t \mid y_0, \ldots, y_{t-1})

$$


The slide denotes the predicted mean and standard deviation as:


$$

\mu_t^-, \sigma_t^-

$$


---

## 14.5 Measurement update: correct

After receiving measurement $y_t$, update the distribution over the current state:


$$

P(X_t \mid y_0, \ldots, y_t)

$$


The slide denotes the corrected mean and standard deviation as:


$$

\mu_t^+, \sigma_t^+

$$


Then time advances:


$$

t++

$$


---

# 15. Propagation of Gaussian Densities

The slides illustrate three effects in Gaussian density propagation.

---

## 15.1 Deterministic drift: shifting the mean

The distribution moves according to expected deterministic motion.

### Meaning

The predicted state shifts in the direction specified by the motion model.

---

## 15.2 Stochastic diffusion: increasing the variance

The uncertainty increases over time because of randomness/noise in the dynamics.

### Meaning

Without measurement correction, uncertainty spreads.

---

## 15.3 Reactive effect of measurement: Bayesian combination

The new measurement pulls the distribution toward values supported by the image evidence.

### Meaning

The corrected estimate combines the predicted state and the measurement.

---

# 16. Summary: Kalman Filter

## 16.1 Pros

The slides list the following advantages:

- Gaussian densities everywhere;
- simple updates;
- compact and efficient representation;
- very established method;
- very well understood.

---

## 16.2 Cons

The slides list the following limitations:

- unimodal distribution;
- only a single hypothesis;
- restricted class of motions defined by a linear model.

---

## 16.3 Why this is restrictive

Many interesting cases do not have linear dynamics.

Examples from slides:

- pedestrians walking;
- a bouncing ball.

### Intuition

A walking person has complex pose changes. A bouncing ball changes direction abruptly at impact. These behaviours are difficult to capture with a simple linear-Gaussian model.

---

# 17. Single Hypothesis vs Multiple Hypotheses

## 17.1 When is a single hypothesis too limiting?

A single Gaussian/Kalman estimate can represent only one main peak in the distribution.

Natural images can produce multiple plausible explanations for the current observation.

---

## 17.2 Multi-modal likelihoods

The slide title says **"Multi-Model Likelihoods"**, but the content describes likelihood functions with multiple local maxima.

### [UNCLEAR]

The title likely means **multi-modal likelihoods**, because the slide explains that measurement clutter in natural images causes likelihood functions to have multiple local maxima.

### Key idea

Measurement clutter can create several plausible target locations.

A single Gaussian distribution is not enough to represent multiple competing hypotheses.

---

# 18. Propagation of General Densities

Unlike Gaussian-only filtering, general density propagation allows distributions with:

- multiple peaks;
- irregular shapes;
- non-Gaussian uncertainty.

The slide again shows:

- deterministic drift;
- stochastic diffusion;
- reactive effect of measurement.

But now these effects are applied to a general, multi-peaked density rather than a single Gaussian.

---

# 19. Particle Filtering

## 19.1 Definition

Particle filtering is also known as **Sequential Monte Carlo**.

The slides describe it as using sampling to propagate densities over time, especially across frames in a video sequence.

Reference shown on slides:

> M. Isard and A. Blake, *CONDENSATION — conditional density propagation for visual tracking*, IJCV 29(1):5–28, 1998.

---

## 19.2 Posterior representation

At each time step, represent the posterior:


$$

P(X_t \mid Y_t)

$$


with a weighted sample set.

Each particle represents a possible state.

Each weight represents how plausible that state is.

### [UNCLEAR]

Earlier slides write the posterior as $P(X_t \mid y_0, \ldots, y_t)$. The particle filter slide writes $P(X_t \mid Y_t)$. This likely uses $Y_t$ as shorthand for observations up to time $t$, but the notation is not explained.

---

## 19.3 Passing information through time

The previous time step's sample set:


$$

P(X_{t-1} \mid Y_{t-1})

$$


is passed to the next time step as the effective prior.

---

# 20. Factored Sampling

## 20.1 Key idea

Represent the state distribution non-parametrically.

Instead of storing a Gaussian mean and covariance, store a set of weighted samples.

---

## 20.2 Prediction step

Sample points from the prior density for the state:


$$

P(X)

$$


In tracking context, this means sampling candidate states according to the predicted distribution.

---

## 20.3 Correction step

Weight the samples according to the observation likelihood:


$$

P(Y \mid X)

$$


Particles that better explain the observation receive higher weights.

---

## 20.4 Relation to Bayesian correction formula

The particle method approximates the same correction formula:


$$

P(X_t \mid y_0, \ldots, y_t)
=
\frac{
P(y_t \mid X_t)
P(X_t \mid y_0, \ldots, y_{t-1})
}{
\int
P(y_t \mid X_t)
P(X_t \mid y_0, \ldots, y_{t-1})
\, dX_t
}

$$


but uses samples rather than a closed-form density.

---

# 21. Particle Filtering Algorithm

The particle filtering slide describes the following process.

## Step 1: Start with weighted samples

Begin with weighted samples from the previous time step.

These represent the previous posterior.

---

## Step 2: Sample and shift according to dynamics

Move particles according to the dynamics model.

This corresponds to the prediction step.

---

## Step 3: Spread due to randomness

Particles spread because of stochasticity/noise in the model.

The result is the predicted density:


$$

P(X_t \mid Y_{t-1})

$$


---

## Step 4: Weight using observation density

Evaluate each particle according to how well it explains the new observation.

Particles supported by the image evidence receive higher weights.

---

## Step 5: Arrive at corrected density estimate

The weighted particles now approximate:


$$

P(X_t \mid Y_t)

$$


---

# 22. Tracking in Clutter

The slides show an example of tracking in clutter.

### Key point

Cluttered natural images make tracking harder because irrelevant image structures can create false evidence or multiple local maxima in the likelihood.

This connects directly to the motivation for particle filtering: the state distribution may be multi-modal and not well represented by a single Gaussian.

---

# 23. Obtaining a State Estimate from Particles

## 23.1 No explicit single state is maintained

The slides note that particle filtering does not maintain one explicit state estimate.

Instead, it maintains a **cloud of particles**.

---

## 23.2 Querying the particle set

To obtain a single estimate at a particular time, query the current particle set.

---

## 23.3 Mean particle

One approach is to use the weighted sum of particles.

A natural formula for this is:


$$

\hat{X}_t = \sum_i w_i X_t^{(i)}

$$


where:

- $X_t^{(i)}$ is particle $i$;
- $w_i$ is its weight.

### [UNCLEAR]

The slide says "weighted sum of particles" but does not explicitly write this equation.

---

## 23.4 Confidence

The slide states:


$$

\text{confidence} = \text{inverse variance}

$$


Intuition:

- low particle spread means high confidence;
- high particle spread means low confidence.

---

## 23.5 Mode finder

The slide says that we really want a mode finder: the mean of the tallest peak.

### Why this matters

If the distribution has several peaks, the global weighted mean may fall between plausible states. A mode-based estimate focuses on the strongest hypothesis.

---

# 24. Condensation: Estimating Target State

The slides show examples from Isard and Blake, 1998.

The figure illustrates:

- state samples;
- thickness proportional to particle weight;
- mean of weighted state samples.

### Interpretation

Particles cluster around likely target states. Heavily weighted particles contribute more to the final estimate.

---

# 25. Summary: Particle Filtering

## 25.1 Pros

The slides list the following advantages:

- can represent arbitrary densities;
- converges to the true posterior even for non-Gaussian and nonlinear systems;
- efficient because particles tend to focus on high-probability regions;
- works with many different state spaces;
- useful for articulated tracking in complicated joint-angle spaces;
- many extensions are available.

---

## 25.2 Cons / caveats

The slides list the following limitations:

- the number of particles is an important performance factor;
- fewer particles are desirable for efficiency;
- enough particles are needed to cover the state space sufficiently well;
- worst-case complexity grows exponentially with dimensionality;
- multimodal densities are possible, but still usually for a single object;
- interactions between multiple objects require special treatment;
- multiple-object interaction can cause state-space explosion.

---

# 26. Obtaining the Observations

After discussing filtering, the lecture moves to the question:


$$

\text{How do we get the object measurements?}

$$


The slides list several approaches:

- background modelling;
- tracking lines and contours;
- tracking-by-detection.

---

# 27. Background Colour Model

## 27.1 Gaussian mixture for each pixel

The slides describe a background colour model using a Gaussian mixture for each pixel.

### Intuition

Each pixel has a model of its usual appearance.

Because background appearance can vary, a mixture of Gaussians can represent multiple common values for that pixel.

---

## 27.2 Common appearance variation

The model captures common appearance variation for each pixel separately.

---

## 27.3 Updating mixtures over time

The mixtures are updated over time.

This allows the model to adapt to:

- lighting changes;
- gradual changes in the scene;
- other slow background variation.

---

## 27.4 Empty-scene initialisation

The slides say this method is easiest when an empty scene is first seen for some frames.

### Intuition

If the camera observes the background before any foreground objects appear, it can learn a clean background model.

---

## 27.5 Online learning

The slides also state that the method can be applied for online learning.

That means the background model can be learned and updated as the video runs.

---

## 27.6 Standard use cases

The slides describe Gaussian-mixture background modelling as a de-facto standard for many tracking applications, especially:

- fixed-camera scenarios;
- scenes with limited background motion.

Reference shown on slides:

> C. Stauffer and E. Grimson, *Learning Patterns of Activity Using Real-Time Tracking*, IEEE TPAMI 22(8):747–757, 2000.

---

# 28. Summary: Tracking Issues

The final slides summarise major issues in tracking.

---

## 28.1 Initialisation

Tracking can be initialised by:

- manual initialisation;
- background subtraction;
- detection.

### Key point

The tracker needs some starting point. Without an initial object state, the system may not know what to track.

---

## 28.2 Obtaining observation and dynamics models

The slides distinguish different ways to model observations and dynamics.

---

### 28.2.1 Generative observation model

A generative observation model "renders" the state on top of the image and compares it.

### Intuition

Ask:


$$

\text{If the object were in this state, would the image look like this?}

$$


---

### 28.2.2 Discriminative observation model

A discriminative observation model uses a classifier or detector score.

### Intuition

Ask:


$$

\text{How strongly does this image region look like the target?}

$$


---

### 28.2.3 Dynamics model

The dynamics model can be:

- learned, which the slides say is very difficult;
- specified using domain knowledge.

---

## 28.3 Prediction vs correction

The slides emphasise the balance between prediction and correction.

---

### Dynamics model too strong

If the dynamics model is too strong, the tracker ends up ignoring the data.

### Observation model too strong

If the observation model is too strong, tracking is reduced to repeated detection.

### Key contrast

Tracking is useful because it balances:


$$

\text{motion prediction} \quad + \quad \text{image evidence}

$$


Too much prediction becomes blind extrapolation. Too much correction becomes independent detection.

---

## 28.4 Nonlinear dynamics

Nonlinear dynamics may be needed in some situations.

The slides mention:

- keeping multiple trackers in parallel;
- modelling different driver behaviour;
- handling abrupt direction changes.

---

## 28.5 Data association

Data association asks:


$$

\text{Which measurements should be associated with which tracks?}

$$


This is especially problematic in cases of occlusion.

### Intuition

If several objects are visible and some overlap or disappear temporarily, the tracker may not know which detection corresponds to which object identity.

---

# 29. Worked Examples from the Slides

## Worked Example 1: Detection vs tracking a moving object

### Task

Estimate object position over time.

### Detection approach

**Step 1:** Process frame $t=1$.  
**Step 2:** Detect the object independently.  
**Step 3:** Record the bounding box or centroid.  
**Step 4:** Repeat independently for frames $t=2, \ldots, t=21$.

### Result

A sequence of positions is obtained, but without an explicit motion model.

---

### Tracking approach

**Step 1:** Use the previous state estimate.  
**Step 2:** Predict where the object should move next.  
**Step 3:** Use the new image measurement.  
**Step 4:** Combine prediction and measurement.  
**Step 5:** Update the object position.

### Result

The estimate is influenced by both visual evidence and expected motion.

---

## Worked Example 2: Feature-based face tracking

### Task

Track a face/object region across frames.

### Initialisation

**Step 1:** Select the initial object window.  
**Step 2:** Extract object features inside the window.  
**Step 3:** Extract background features outside the window.  
**Step 4:** Build object and background models.

### Subsequent frames

**Step 1:** Detect/extract features in the new frame.  
**Step 2:** Match features against the object/background models.  
**Step 3:** Fit the best window to the object.  
**Step 4:** Update the object appearance model.

### Result

The red window follows the face/object in later frames.

---

## Worked Example 3: Car tracking with known background

### Task

Estimate car positions at each time instant.

### Step 1: Define state


$$

X_t = \text{car position at time } t

$$


For example:


$$

X_t = (x_t, y_t)

$$


### Step 2: Define observation


$$

Y_t = \text{image at time } t

$$


The slides use image sequences and a known background.

### Step 3: Obtain foreground evidence

Subtract the known background from the current image:


$$

\text{current image} - \text{background} = \text{foreground evidence}

$$


### Step 4: Define likelihood


$$

p(bg \mid car=(x,y))

$$


### Step 5: Combine prior and likelihood


$$

p(car=(x,y) \mid bg)
\propto
p(bg \mid car=(x,y))p(car=(x,y))

$$


### Step 6: Estimate car position

Choose a likely position from the posterior distribution.

### [UNCLEAR]

The slides do not define exactly what `bg` denotes in the likelihood.

---

## Worked Example 4: Particle filtering through time

### Task

Track an object when the posterior may be non-Gaussian or multimodal.

### Step 1: Start with particles

Use weighted samples from the previous time step.

### Step 2: Predict

Move particles according to the dynamics model.

### Step 3: Diffuse

Add randomness, causing particles to spread.

### Step 4: Measure

Evaluate particles using the observation density.

### Step 5: Correct

Increase weights for particles that explain the observation well.

### Step 6: Estimate state

Use a weighted mean or a mode of the particle cloud.

---

# 30. Exam Flags

No transcript was provided, so there are **no lecturer-spoken exam flags** available.

Based on slide emphasis alone, the highest-value revision areas are:

1. detection vs tracking;
2. tracking with dynamics;
3. state vs observation;
4. dynamics model vs observation model;
5. Bayesian prediction and correction;
6. base-case Bayesian update;
7. prediction and correction equations;
8. Kalman filter assumptions, pros, and cons;
9. propagation of Gaussian densities;
10. why linear-Gaussian single-hypothesis tracking is restrictive;
11. multimodal likelihoods in clutter;
12. particle filtering and factored sampling;
13. obtaining a state estimate from particles;
14. particle filter pros and caveats;
15. Gaussian mixture background modelling;
16. tracking issues: initialisation, model design, prediction/correction balance, nonlinear dynamics, data association.

---

# 31. Connections

## 31.1 Bayesian inference

The lecture applies Bayes' rule repeatedly:


$$

\text{posterior} \propto \text{likelihood} \times \text{prior}

$$


This is the foundation of tracking as recursive inference.

---

## 31.2 Probabilistic graphical models

The state-observation chain:


$$

X_1 \rightarrow X_2 \rightarrow \cdots \rightarrow X_t

$$


with:


$$

X_t \rightarrow Y_t

$$


is a temporal probabilistic model.

---

## 31.3 Computer vision applications

The slides connect visual tracking to:

- object tracking;
- face tracking;
- visual motion capture;
- articulated tracking;
- tracking in clutter;
- car/traffic tracking.

---

## 31.4 Classical tracking literature

The slides reference:

- Gu et al. for online nearest-neighbour visual object tracking;
- Isard and Blake for Condensation / particle filtering;
- Stauffer and Grimson for Gaussian-mixture background modelling.

---

# 32. Unclear / Transcript-Needed Sections

- `[UNCLEAR]` The notation $p(bg \mid car=(x,y))$ is not fully defined in the slides. `bg` likely refers to background-subtraction image evidence, but the slides do not spell this out.
- `[UNCLEAR]` The slide title says "Multi-Model Likelihoods," but the content describes multiple local maxima. This likely means **multi-modal likelihoods**.
- `[UNCLEAR]` Particle-filter notation sometimes writes $P(X_t \mid Y_t)$, while earlier formulas use all observations $y_0, \ldots, y_t$. The slide likely uses $Y_t$ as shorthand for observations up to time $t$.
- `[UNCLEAR]` The Kalman filter matrix equations are not included in the slides.
- `[UNCLEAR]` The slides show image/video examples for feature tracking, motion capture, and clutter, but without transcript there is no spoken explanation of exactly what the lecturer highlighted in those demos.
