---
subject: COMP64301
chapter: 5
title: "Week 5 — Segmentation & Clustering"
language: en
---

# Segmentation and Clustering — Structured Study Notes

**Course/context:** University of Manchester computer vision material. Exact course code is not stated in the slide decks.

**Source status:** Four slide decks were provided: `segmentation-part1-2025`, `segmentation-part2-2025`, `segmentation-part3-2025`, and `segmentation-part4-2025`. No transcript file was provided/found, so these notes use the slides only. Any lecturer-only verbal derivations, exam hints, or clarifications cannot be recovered from the files.

## Topic and scope

This lecture sequence covers **image segmentation and clustering** in computer vision: how to group pixels, features, or image regions into meaningful units. It starts from perceptual grouping and Gestalt principles, then treats segmentation as clustering using **k-means**, **Gaussian mixture models with EM**, **mean-shift**, and finally **graph-theoretic segmentation** using graph cuts, normalized cuts, GrabCut, superpixels, and boundary-based evaluation.

---

# 1. Big picture: segmentation lectures across Parts 1–4

The four-part sequence is organised around the following progression:

1. **Segmentation and grouping**
   - Gestalt principles
   - Image segmentation
2. **Segmentation as clustering**
   - k-means
   - Feature spaces
3. **Probabilistic clustering**
   - Gaussian and multivariate Gaussian distributions
   - Mixture of Gaussians
   - Expectation-Maximization (EM)
4. **Model-free clustering**
   - Mean-shift clustering
5. **Graph-theoretic segmentation**
   - Normalized cuts

The sequence moves from **human perceptual grouping** to increasingly formal algorithmic treatments:

- Part 1: why grouping/segmentation matters and how k-means clusters pixels in feature spaces.
- Part 2: why hard clustering can be insufficient, and how Gaussian mixture models and EM give probabilistic, soft cluster assignments.
- Part 3: how mean-shift finds modes of a density without assuming a parametric model.
- Part 4: how to represent an image as a graph and segment it by cutting weak affinities, plus normalized cuts and GrabCut.

---

# 2. Segmentation and grouping in computer vision

## 2.1 Goal of grouping

**Intuition:** Grouping means collecting image elements that “belong together”. In images, those elements are often pixels, features, edges, regions, or video frames.

**Slide definition / formal statement:** The goal is to:

- gather features that belong together;
- obtain an intermediate representation that compactly describes key image or video parts.

The slide example shows a tiger image being converted into a simplified region-based representation: the tiger body, grass, water/background, and foreground ground are separated into visually coherent parts.

## 2.2 Examples of grouping in computer vision

The slides show grouping as a broad family of tasks, not just one algorithmic problem:

- **Determining image regions:** dividing an image into regions that correspond to visual structures.
- **Grouping video frames into shots:** grouping temporally related frames in a video.
- **Figure-ground separation:** separating foreground objects from background.
- **Image segmentation:** isolating flowers or a face/person from the rest of the image.
- **Snapchat-style stickers:** extracting a person/object and placing it elsewhere.

The common theme is that grouping creates a more useful intermediate representation than raw pixels.

---

# 3. Gestalt principles and perceptual grouping

## 3.1 Basic idea of grouping in human vision

The slides connect computer vision grouping to human visual perception:

- We want to group together pixels that “belong together”.
- Psychologists studied this under the **Gestalt school**.

## 3.2 Gestalt school

**Key concept: Gestalt**

- **Intuition:** A visual whole can have meaning or structure that is not apparent from individual parts alone.
- **Slide definition:** Gestalt means **whole** or **group**.
- Slide phrase: “The whole is greater than the sum of its parts.”

The slides state:

- grouping is key to visual perception;
- elements in a collection can have properties that result from relationships;
- relationships among parts can yield new properties/features.

Visual examples on the slides include:

- **Illusory/subjective contours:** shapes are perceived even when their boundaries are not explicitly drawn.
- **Occlusion:** partial shapes are interpreted as complete objects behind occluders.
- **Familiar configuration:** separated parts may be grouped because they form a familiar object or pattern.

## 3.3 Gestalt factors

The slides list several factors that predispose elements to be grouped by the human visual system:

### Proximity

Elements close to each other tend to be grouped together.

### Similarity

Elements with similar appearance tend to be grouped. The slide shows similarity by colour/fill and by shape/orientation.

### Common fate

Elements that appear to move in the same direction are grouped together.

### Common region

Elements inside the same enclosing region are grouped together.

### Parallelism

Parallel curves or lines are grouped as related.

### Symmetry

Symmetric parts are grouped as belonging together.

### Continuity

Smooth continuation of curves or lines encourages grouping.

### Closure

The visual system tends to complete incomplete boundaries into closed shapes.

## 3.4 Algorithmic challenge

The slides explicitly warn that Gestalt principles are **inspiring observations/explanations**, but the challenge is how to map them to algorithms.

That is the transition from perceptual grouping to computational segmentation: the principles motivate grouping, but the rest of the lecture sequence focuses on concrete algorithms.

---

# 4. What makes a “good” segmentation?

## 4.1 Top-down vs bottom-up segmentation

The slides distinguish two ways pixels can “belong together”.

### Top-down segmentation

**Definition from slides:** Pixels belong together because they are from the same object.

This means object-level knowledge drives grouping.

### Bottom-up segmentation

**Definition from slides:** Pixels belong together because they look “similar”.

This means low-level appearance cues drive grouping: intensity, colour, texture, position, etc.

## 4.2 Why success is hard to measure

The slides state that segmentation is hard to evaluate because “what is interesting depends on the app.”

For example:

- one application may want a person as one region;
- another may want clothing, face, hair, and background separately;
- another may only care about boundaries.

## 4.3 Comparing to human segmentation / ground truth

The first idea for evaluating segmentation is to compare algorithm output to human segmentation or ground truth.

The slides show examples from the Berkeley Segmentation Dataset:

- image of animals with human-drawn boundaries;
- image of people/cowboys with human-drawn boundaries;
- an image with three different human segmentations from User 1, User 2, User 3.

## 4.4 No objective definition of segmentation

**Key slide statement:** “No objective definition of segmentation!”

The visual point is that different human users draw different segmentations for the same image. Therefore, even “ground truth” segmentation can vary depending on the annotator and task.

## 4.5 Superpixels as a second idea

Because computing the single “correct” segmentation is not always meaningful, the slides introduce **superpixels**.

**Slide statement:** “Let’s not even try to compute a ‘correct’ segmentation.”

**Definition:** A superpixel segmentation is an **over-segmentation** where each region is very likely to be uniform.

**Purpose:** Group together similar-looking pixels for efficiency of further processing.

The slide shows an input image, ground truth, superpixels, and an overlay. The superpixels are small local regions that mostly respect larger object boundaries.

---

# 5. Segmentation as clustering: toy intensity example

## 5.1 Clean toy image

The slide shows a simple image containing:

- a black circular region;
- a grey square region;
- a white background.

The corresponding intensity histogram has three clear spikes:

- black pixels near low intensity;
- grey pixels around a mid-level intensity;
- white pixels around high intensity.

## 5.2 Main idea

The slides state that these intensities define three groups.

Every pixel can be labelled according to which of the primary intensities it belongs to. This is segmentation based on the **intensity feature**.

## 5.3 Worked example: intensity-based segmentation of the toy image

**Input:** An image with three dominant intensity values: black, grey, white.

**Step 1: Build or inspect the intensity histogram.**

- The histogram shows three main intensity groups.
- Each group corresponds to one visual region.

**Step 2: Choose three representative centres.**

The slide labels the representative intensities as approximately:

- centre 1: black, around intensity 0;
- centre 2: grey, around intensity 190;
- centre 3: white, around intensity 255.

**Step 3: Assign each pixel to the closest centre.**

Each pixel receives a label:

- label 1 for black pixels;
- label 2 for grey pixels;
- label 3 for white pixels.

**Step 4: Produce the segmented image.**

The output labels the black circle as region 1, the grey square as region 2, and the white background as region 3.

## 5.4 Noisy toy image

The slides then ask: what if the image is not so simple?

In the noisy version, the histogram no longer has three perfect spikes. Instead, each group becomes a broader distribution of intensities. The three main groups are still visible, but their boundaries are less trivial.

This motivates clustering: we need a method to determine the three main intensities defining the groups.

---

# 6. K-means clustering

## 6.1 Objective: choose representative centres

**Goal from slides:** Choose three “centres” as the representative intensities, and label every pixel according to which of these centres it is nearest to.

The best cluster centres minimize the **SSD** between all points and their nearest cluster centre.

### K-means objective


$$

\sum_{\text{clusters } i}\sum_{\text{points } p \in \text{cluster } i} \|p - c_i\|^2

$$


Where:

- $p$ is a data point / pixel feature value;
- $c_i$ is the centre of cluster $i$;
- the objective sums squared distances between each point and its cluster centre.

## 6.2 The “chicken and egg” problem

The slides describe clustering as a chicken-and-egg problem:

- If we knew the cluster centres, we could allocate points to groups by assigning each point to its closest centre.
- If we knew the group memberships, we could get the centres by computing the mean per group.

K-means solves this by alternating between these two steps.

## 6.3 K-means algorithm

**Algorithm from slides:**

1. Randomly initialize the cluster centres $c_1, \ldots, c_K$.
2. Given cluster centres, determine points in each cluster.
   - For each point $p$, find the closest $c_i$.
   - Put $p$ into cluster $i$.
3. Given points in each cluster, solve for $c_i$.
   - Set $c_i$ to be the mean of points in cluster $i$.
4. If the $c_i$ have changed, repeat Step 2.

## 6.4 Properties of k-means

The slides state:

- k-means will always converge to some solution;
- the solution can be a local minimum;
- it does not always find the global minimum of the objective function.

## 6.5 K-means as segmentation

K-means can segment an image by clustering pixel features.

The slides show a panda image segmented with:

- $K=2$: fewer regions, coarser segmentation;
- $K=3$: more regions, more intensity levels captured.

The key point is that the chosen number of clusters $K$ directly affects the segmentation.

---

# 7. Feature spaces for segmentation

## 7.1 Feature space controls grouping

**Key slide statement:** Depending on what we choose as the **feature space**, we can group pixels in different ways.

A feature space is the representation in which pixel similarity is measured.

## 7.2 Intensity feature space

For greyscale images, the feature space can be a single intensity value.

- Feature space: intensity value, 1D.
- Grouping criterion: intensity similarity.

Example from slides: panda image clustered based on intensity.

## 7.3 Colour feature space

For colour images, a pixel can be represented by its RGB values.

- Feature space: colour value, 3D.
- Coordinates: $(R, G, B)$.
- Grouping criterion: colour similarity.

The slides show pixel samples from a panda image such as:

- $R=255, G=200, B=250$;
- $R=245, G=220, B=248$;
- $R=15, G=189, B=2$;
- $R=3, G=12, B=2$.

These RGB values are plotted as points in a 3D colour feature space.

## 7.4 K-means results: intensity vs colour

The slides show:

- original image of vegetables;
- intensity-based clusters;
- colour-based clusters.

**Key statement:** K-means clustering based on intensity or colour is essentially **vector quantization** of the image attributes.

## 7.5 Spatial coherence issue

The slides explicitly state that clusters do **not** have to be spatially coherent.

That means pixels with similar colour or intensity may be assigned to the same cluster even if they are far apart in the image.

## 7.6 Adding position to the feature vector

The slides propose clustering $(r,g,b,x,y)$ values to enforce more spatial coherence.

This encodes both:

- **similarity:** colour values $(r,g,b)$;
- **proximity:** image position $(x,y)$.

---

# 8. Summary of k-means

## 8.1 Pros

The slides list these advantages:

- simple;
- fast to compute;
- converges to a local minimum of within-cluster squared error.

## 8.2 Cons / issues

The slides list these issues:

- setting $K$ is required;
- sensitive to initial centres;
- sensitive to outliers;
- detects spherical clusters only.

## 8.3 Key concept: hard assignment

Part 2 contrasts k-means with probabilistic clustering.

K-means assigns each point $x$ to exactly one cluster. The slides call this **hard assignment**.

This becomes a limitation when clusters overlap or when cluster shape is non-circular.

---

# 9. Probabilistic clustering: motivation

## 9.1 Why move beyond k-means?

The slides motivate probabilistic clustering by asking:

- What if clusters are overlapping?
  - It is hard to tell which cluster is right.
  - Maybe we should remain uncertain.
- What if a cluster has a non-circular shape?

K-means only models clusters by their centres and makes hard assignments. Gaussian mixture models model each cluster probabilistically.

## 9.2 Gaussian mixture models

The slides state:

- clusters are modelled as Gaussians;
- clusters are not described just by their mean;
- the EM algorithm assigns data to clusters with some probability;
- the model gives a probability model of $x$, so it is **generative**.

---

# 10. Gaussian distributions

## 10.1 Univariate normal / Gaussian distribution

**Definition from slides:** A univariate Gaussian or normal distribution describes a single continuous variable.

It has two parameters:

- mean $\mu$;
- variance $\sigma^2 > 0$, with standard deviation $\sigma$.

### Formula


$$

Pr(x) = \frac{1}{\sqrt{2\pi\sigma^2}}\exp\left[-0.5\frac{(x-\mu)^2}{\sigma^2}\right]

$$


Usual notation on the slide:


$$

\mathcal{N}(x;\mu,\sigma) = \frac{1}{\sqrt{2\pi\sigma^2}}\exp\left[-\frac{1}{2}\frac{(x-\mu)^2}{\sigma^2}\right]

$$


### Maximum-likelihood estimates shown on slide


$$

\hat{\mu}=\frac{1}{N}\sum_i x^{(i)}

$$



$$

\hat{\sigma}^2=\frac{1}{N}\sum_i (x^{(i)}-\hat{\mu})^2

$$


## 10.2 Multivariate normal distribution

**Definition from slides:** A multivariate normal distribution describes multiple continuous variables.

It takes two parameters:

- a vector containing the mean position, $\mu$;
- a symmetric positive-definite covariance matrix, $\Sigma$.

The slide notes:

- $\mu$ is a length-$d$ row vector;
- $\Sigma$ is a $d \times d$ matrix;
- $|\Sigma|$ is the matrix determinant.

### Formula as written in the slide convention


$$

\mathcal{N}(x;\mu,\Sigma)
= \frac{1}{(2\pi)^{d/2}}|\Sigma|^{-1/2}
\exp\left\{-\frac{1}{2}(x-\mu)\Sigma^{-1}(x-\mu)^T\right\}

$$


### Parameter estimates shown on slide


$$

\hat{\mu}=\frac{1}{m}\sum_j x^{(j)}

$$



$$

\hat{\Sigma}=\frac{1}{m}\sum_j (x^j-\hat{\mu})^T(x^j-\hat{\mu})

$$


## 10.3 Types of covariance

The slides list three covariance forms: spherical, diagonal, and full.

### Spherical covariance


$$

\Sigma_{spher}=\begin{bmatrix}
\sigma^2 & 0 \\
0 & \sigma^2
\end{bmatrix}

$$


This produces circular/spherical Gaussian contours.

### Diagonal covariance


$$

\Sigma_{diag}=\begin{bmatrix}
\sigma_1^2 & 0 \\
0 & \sigma_2^2
\end{bmatrix}

$$


This permits different variance along coordinate axes, but no off-diagonal covariance terms.

### Full covariance


$$

\Sigma_{full}=\begin{bmatrix}
\sigma_{11}^2 & \sigma_{12}^2 \\
\sigma_{21}^2 & \sigma_{22}^2
\end{bmatrix}

$$


This permits tilted elliptical Gaussian shapes, as shown in the slide examples.

---

# 11. Single Gaussian vs mixture of Gaussians

## 11.1 Why one Gaussian is not enough

The slides show a histogram where a single normal distribution is not good enough. The slide text says:

> A normal distribution is not good enough! Need a way to make more complex distributions.

The solution introduced is a **mixture of Gaussians**, where each cluster is modelled using one Gaussian “bell”.

## 11.2 Generative model idea

The slides define the basic probabilistic clustering idea:

- Instead of treating the data as a bunch of points, assume they were generated by sampling a continuous function.
- This function is called a **generative model**.
- It is defined by a vector of parameters $\theta$.

---

# 12. Mixture of Gaussians / Gaussian mixture model

## 12.1 One-dimensional mixture notation

The slides describe starting with parameters for each cluster:

- mean $\mu_c$;
- variance $\sigma_c$;
- size / mixture weight $\pi_c$.

The probability distribution is:


$$

p(x)=\sum_c \pi_c \mathcal{N}(x;\mu_c,\sigma_c)

$$


The latent component selection view is:


$$

p(z=c)=\pi_c

$$



$$

p(x|z=c)=\mathcal{N}(x;\mu_c,\sigma_c)

$$


The slide describes the generative process:

1. Select a mixture component with probability $\pi$.
2. Sample from that component’s Gaussian.

## 12.2 Multivariate mixture of Gaussians

The slides define a mixture of Gaussians as:

- $K$ Gaussian blobs;
- each blob has mean $\mu_b$, covariance matrix $V_b$, and dimension $d$;
- blob $b$ is selected with probability $\alpha_b$;
- the likelihood of observing $x$ is a weighted mixture of Gaussians.

### Blob likelihood


$$

P(x|\mu_b,V_b)
= \frac{1}{\sqrt{(2\pi)^d |V_b|}}
\exp\left[-\frac{1}{2}(x-\mu_b)^T V_b^{-1}(x-\mu_b)\right]

$$


### Mixture likelihood


$$

P(x|\theta)=\sum_{b=1}^{K}\alpha_b P(x|\theta_b)

$$


The parameter vector is shown as:


$$

\theta=[\mu_1,\ldots,\mu_n,V_1,\ldots,V_n]

$$


[UNCLEAR: The slide uses both $K$ for the number of components and $n$ inside the parameter-vector display. The intended meaning is component parameters for all mixture components, but the slide notation is not completely consistent.]

---

# 13. Expectation-Maximization (EM)

## 13.1 Goal of EM

The goal is to find blob parameters $\theta$ that maximize the likelihood function:


$$

P(data|\theta)=\prod_x P(x|\theta)

$$


## 13.2 EM algorithm overview

The slides define EM as alternating between two steps:

1. **E-step:** Given the current guess of blobs, compute ownership of each point.
2. **M-step:** Given ownership probabilities, update blobs to maximize the likelihood function.
3. Repeat until convergence.

## 13.3 E-step: ownership probability

The E-step computes the probability that point $x$ is in blob $b$, given the current guess of $\theta$.


$$

P(b|x,\mu_b,V_b)
=\frac{\alpha_b P(x|\mu_b,V_b)}{\sum_{i=1}^{K}\alpha_i P(x|\mu_i,V_i)}

$$


**Intuition:** Instead of assigning a point to exactly one cluster, EM assigns probabilities of membership to blobs.

## 13.4 M-step: update mixture weight

For $N$ data points, the updated probability that blob $b$ is selected is:


$$

\alpha_b^{new}=\frac{1}{N}\sum_{i=1}^{N}P(b|x_i,\mu_b,V_b)

$$


## 13.5 M-step: update mean

The updated mean of blob $b$ is:


$$

\mu_b^{new}
=\frac{\sum_{i=1}^{N}x_iP(b|x_i,\mu_b,V_b)}{\sum_{i=1}^{N}P(b|x_i,\mu_b,V_b)}

$$


## 13.6 M-step: update covariance

The updated covariance of blob $b$ is:


$$

V_b^{new}
=\frac{\sum_{i=1}^{N}(x_i-\mu_b^{new})(x_i-\mu_b^{new})^T P(b|x_i,\mu_b,V_b)}{\sum_{i=1}^{N}P(b|x_i,\mu_b,V_b)}

$$


## 13.7 Applications of EM

The slides state EM is useful for:

- any clustering problem;
- any model estimation problem;
- missing data problems;
- finding outliers;
- segmentation problems:
  - segmentation based on colour;
  - segmentation based on motion;
  - foreground/background separation.

## 13.8 Visual applications shown

### Background subtraction

The slides show a video/background subtraction example:

- repeated frames of a scene;
- a frame containing a person;
- a foreground mask where the person is separated from the background.

### Segmentation with EM

The slides show segmentation examples using a GMM with $K=5$ components.

Images include:

- people on a field;
- rhinoceroses;
- a building/church scene.

Each is shown as an original image and a GMM segmentation.

---

# 14. Summary: Mixtures of Gaussians and EM

## 14.1 Pros

The slides list:

- probabilistic interpretation;
- soft assignments between data points and clusters;
- generative model, can predict novel data points;
- relatively compact storage.

## 14.2 Cons

The slides list:

- local minima;
- initialization;
  - often a good idea to start with some k-means iterations;
- need to know number of components;
- need to choose generative model;
- numerical problems are often a nuisance.

---

# 15. Mean-shift segmentation

## 15.1 What mean-shift is for

The slides introduce mean-shift segmentation as:

> An advanced and versatile technique for clustering-based segmentation.

The cited paper on the slides is:

- D. Comaniciu and P. Meer, “Mean Shift: A Robust Approach toward Feature Space Analysis,” PAMI 2002.

## 15.2 Modes in a histogram

The slides ask: how many modes are there?

**Definition from slides:** A mode is a local maximum of the density of a given distribution.

The slide says modes are:

- easy to see;
- hard to compute.

The histogram example visually contains multiple local peaks. The next slide highlights two broad regions/windows, suggesting the practical question of how to identify meaningful modes from noisy empirical data.

---

# 16. Mean-shift algorithm

## 16.1 Iterative mode search

The slide algorithm is:

1. Initialize random seed and window $W$.
2. Calculate centre of gravity, the “mean”, of $W$.
3. Shift the search window to the “mean”.
4. Repeat Step 2 until convergence.

The formula shown beside Step 2 is:


$$

\sum_{x\in W} xH(x)

$$


[UNCLEAR: The slide labels this as the centre of gravity / “mean” of $W$, but the displayed formula only shows a weighted sum term. If the lecturer explained a normalization term verbally, that is not available without the transcript.]

## 16.2 Mean-shift and mode finding

The slides show a one-dimensional visualization of:

- a kernel density estimate;
- its derivative;
- a mean shift.

The figure labels include:

- $f(x)$, the density curve;
- $f'(x_k)$, derivative information near $x_k$;
- $m(x_k)$, the mean-shift vector;
- $K(x)$ and $G(x)$, kernel-related curves in the visualization.

The slide references Parzen window / kernel probability density estimation, with further reading in Duda, Hart, and Stork; Bishop; and Comaniciu and Meer.

## 16.3 Visual worked example: moving a window to a dense mode

The slides show a 2D point set and a circular region of interest.

**Step 1: Start with a window.**

A circular window is placed over part of the point cloud.

**Step 2: Compute centre of mass.**

A centre-of-mass marker appears offset from the current window centre.

**Step 3: Define the mean-shift vector.**

An arrow from the current centre to the centre of mass is shown as the mean-shift vector.

**Step 4: Shift the window.**

The window moves so its centre approaches the local dense region.

**Step 5: Repeat.**

The window keeps shifting toward the denser cluster of points.

**Step 6: Converge.**

Eventually, the centre of mass aligns with the window centre near a mode.

---

# 17. Real modality analysis and attraction basins

## 17.1 Running mean-shift in parallel

The slides show many windows initialized over many data points, with the instruction:

> Run the procedure in parallel.

The idea shown visually is that many windows move through the feature space toward density modes.

## 17.2 Traversed points

A later slide colors many data points blue and states:

> The blue data points were traversed by the windows towards the mode.

The visual point is that many starting positions follow trajectories into the same mode.

## 17.3 Mean-shift cluster definition

**Slide definition:** A cluster is all data points in the attraction basin of a mode.

**Slide definition:** An attraction basin is the region for which all trajectories lead to the same mode.

The diagram shows two attraction basins, each with trajectories flowing inward to its own mode.

---

# 18. Mean-shift clustering / segmentation pipeline

The slides give the procedure for image segmentation:

1. Find features such as colour, gradients, texture, etc.
2. Initialize windows at individual pixel locations.
3. Perform mean shift for each window until convergence.
4. Merge windows that end up near the same “peak” or mode.

The visual examples show:

- an input image of coloured buildings;
- a feature-space scatter plot;
- a coloured clustering result in feature space;
- a density surface with trajectories moving to peaks.

## 18.1 Mean-shift segmentation results

The slides show original images and their mean-shift segmentations:

- a campus/building image becomes large flat colour/region segments;
- a mountain landscape becomes simplified into sky, snow, rock, and shadow-like regions.

---

# 19. Summary of mean-shift

## 19.1 Pros

The slides list:

- general, application-independent tool;
- model-free: does not assume any prior shape such as spherical or elliptical clusters;
- just a single parameter: window size $h$;
- finds a variable number of modes;
- robust to outliers.

## 19.2 Cons

The slides list:

- output depends on window size;
- window size / bandwidth selection is not trivial;
- computationally relatively expensive, around $\sim 2s/image$;
- does not scale well with dimension of feature space.

---

# 20. Graph-theoretic segmentation

## 20.1 Images as graphs

The slides represent an image as a fully connected graph.

**Definition from slides:**

- There is a node / vertex for every pixel.
- There is a link between every pair of pixels $(p,q)$.
- Each link / edge has an affinity weight $w_{pq}$.

The affinity weight measures similarity. Similarity is inversely proportional to difference, for example in colour and position.

## 20.2 Segmentation by graph cuts

The slides define segmentation by graph cuts as breaking a graph into segments:

- delete links that cross between segments;
- it is easiest to break links with low similarity / low weight;
- similar pixels should be in the same segment;
- dissimilar pixels should be in different segments.

The tiger image example shows an image overlaid with boundary curves, illustrating segmentation by separating regions.

## 20.3 Affinity matrix example

The graph-cut slide shows a graph and an affinity matrix. The slide states:

> Here, the cut is nicely defined by the block-diagonal structure of the affinity matrix.

This means the graph naturally separates into groups when within-group affinities are strong and between-group affinities are weak.

---

# 21. Measuring affinity

The slides give several ways to define affinity between points $x$ and $y$.

## 21.1 Distance affinity


$$

aff(x,y)=\exp\left\{-\frac{1}{2\sigma_d^2}\|x-y\|^2\right\}

$$


This groups points based on spatial closeness.

## 21.2 Intensity affinity


$$

aff(x,y)=\exp\left\{-\frac{1}{2\sigma_d^2}\|I(x)-I(y)\|^2\right\}

$$


This groups points based on similarity of image intensity.

## 21.3 Colour affinity


$$

aff(x,y)=\exp\left\{-\frac{1}{2\sigma_d^2}dist(c(x),c(y))^2\right\}

$$


The slide describes $dist(c(x),c(y))$ as a suitable colour-space distance.

## 21.4 Texture/filter-output affinity


$$

aff(x,y)=\exp\left\{-\frac{1}{2\sigma_d^2}\|f(x)-f(y)\|^2\right\}

$$


The slide describes $f(x)$ and $f(y)$ as vectors of filter outputs.

## 21.5 Effect of scale $\sigma$

The slides show that scale affects affinity:

- small $\sigma$: group only nearby points;
- large $\sigma$: group far-away points.

The visual example shows affinity matrices for small, medium, and large $\sigma$. With small $\sigma$, only close/local relationships are strong. With large $\sigma$, broader relationships become strong.

---

# 22. Cuts in a graph

## 22.1 Graph cut definition

**Definition from slides:** A graph cut is a set of edges whose removal makes a graph disconnected.

## 22.2 Cost of a cut

The cost of a cut is the sum of weights of cut edges:


$$

cut(A,B)=\sum_{p\in A,q\in B}w_{p,q}

$$


A graph cut gives a segmentation.

The slide asks the central question:

> What is a “good” graph cut and how do we find one?

---

# 23. Minimum cut

## 23.1 Basic idea

The slides state that segmentation can be done by finding the minimum cut in a graph.

Efficient algorithms exist for doing this.

## 23.2 Why minimum cut is not always the best cut

The slides state:

- minimum cut is not always the best cut;
- weight of cut is proportional to the number of edges in the cut;
- minimum cut tends to cut off very small, isolated components.

The visual example shows an “ideal cut” separating a red group from a blue group, but also shows alternative cuts with lesser weight that isolate small components instead of producing the desired segmentation.

---

# 24. Normalized Cut (NCut)

## 24.1 Motivation

The slides state:

- a minimum cut penalizes large segments;
- this can be fixed by normalizing for size of segments.

## 24.2 Normalized cut cost


$$

Ncut(A,B)=\frac{cut(A,B)}{assoc(A,V)}+\frac{cut(A,B)}{assoc(B,V)}

$$


Where:


$$

assoc(A,A)=\sum_{p\in A,q\in A}w_{p,q}

$$


The slide defines this as the association, or sum of all weights, within a cluster.

Also:


$$

assoc(A,V)=assoc(A,A)+cut(A,B)

$$


This is the sum of all weights associated with nodes in $A$.

## 24.3 Intuition

The slide states:

> Big segments will have a large $assoc(A,V)$, thus decreasing $Ncut(A,B)$.

The normalization reduces the tendency to prefer tiny isolated components.

## 24.4 Complexity statement

The slide states:

- finding the globally optimal cut is NP-complete;
- a relaxed version can be solved using a generalized eigenvalue problem.

The referenced paper is:

- J. Shi and J. Malik, “Normalized cuts and image segmentation,” PAMI 2000.

## 24.5 Colour image segmentation with NCuts

The slides show example NCut segmentations of colour images:

- flower/landscape scene divided into regions such as flowers, greenery, sky/buildings;
- Arc de Triomphe-like scene divided into object and background regions;
- another building/landscape scene split into multiple colour/region masks.

The slide notes that NCuts Matlab code was available at the cited UPenn/Jianbo Shi software page.

---

# 25. Summary of normalized cuts

## 25.1 Pros

The slides list:

- generic framework;
- flexible choice of function that computes weights / affinities between nodes;
- does not require any model of the data distribution.

## 25.2 Cons

The slides list:

- time and memory complexity can be high;
- dense, highly connected graphs require many affinity computations;
- solving the eigenvalue problem adds cost.

---

# 26. Graph cuts and GrabCut

## 26.1 GrabCut overview

The slides introduce GrabCut with the paper:

- Rother et al., “Interactive Foreground Extraction with Iterated Graph Cuts,” SIGGRAPH 2004.

The key example shows:

- the user draws only a rectangular box around the foreground object/person;
- GrabCut extracts the object;
- the cut-out foreground can be pasted onto a new background.

**Slide phrase:** “Only user input is the box!”

## 26.2 Combining region and boundary information

The slides state GrabCut combines:

- region information;
- boundary information.

The llama example shows:

- user input as a dashed bounding box;
- output as an extracted llama head/neck foreground;
- the result uses both region and boundary cues.

## 26.3 GrabCut iterative procedure

The slide gives the main iteration:

1. **Segmentation using graph cuts**
   - Requires having a foreground model.
2. **Foreground-background modelling using unsupervised clustering**
   - Requires having segmentation.

This is another chicken-and-egg style structure:

- graph cuts need a foreground/background model;
- the foreground/background model needs an initial segmentation;
- GrabCut alternates between the two.

## 26.4 GrabCut example results

The slide shows rectangular user boxes and final cut-outs for:

- a person/child with an object;
- orange flowers;
- a statue.

In each case, the box initializes the object region, and the algorithm extracts the foreground.

---

# 27. Improving efficiency with superpixels

## 27.1 Problem

The slides state:

- images contain many pixels;
- this remains a problem even with efficient graph cuts.

## 27.2 Efficiency trick: superpixels

The slides introduce superpixels again as an efficiency trick.

**Definition:** Group together similar-looking pixels for efficiency of further processing.

**Description:** Superpixels are cheap, local over-segmentations.

## 27.3 Explicit importance flag from slide

**EXAM FLAG / explicit slide importance:** The slide says it is **important** to ensure that superpixels:

- do not cross boundaries;
- have similar size;
- have regular shape;
- are produced by an algorithm with low complexity.

The slide examples show baseball images overlaid with superpixel boundaries. Good superpixels should stay within meaningful visual regions rather than crossing object boundaries.

---

# 28. Evaluating segmentation

## 28.1 Evaluation question

The final technical slide asks:

> How to evaluate segmentation?

The visual comparison shows:

- an original horse/rider image;
- a predicted segmentation;
- ground truth segmentation.

## 28.2 Precision

**Definition from slides:** Precision $P$ is the percentage of marked boundary points that are real ones.

In boundary-evaluation terms, precision measures how many predicted boundaries correspond to real/ground-truth boundaries.

## 28.3 Recall

**Definition from slides:** Recall $R$ is the percentage of real boundary points that were marked.

Recall measures how many true/ground-truth boundaries the prediction recovered.

## 28.4 F-measure

The slide gives:


$$

F = \frac{2PR}{P+R}

$$


This combines precision and recall.

---

# 29. Key connections across the lecture sequence

## 29.1 Gestalt to algorithms

Gestalt principles motivate what it means for visual elements to belong together, but the slides explicitly state the challenge is mapping those principles to algorithms.

## 29.2 K-means to EM

K-means provides hard assignments and simple centre-based clusters.

EM/Gaussian mixtures extend this by:

- allowing soft probabilistic assignment;
- modelling clusters with covariance, not just means;
- handling non-circular Gaussian blob shapes.

## 29.3 K-means/EM to mean-shift

K-means and GMMs require specifying the number of clusters/components.

Mean-shift instead finds a variable number of modes and is model-free, but depends strongly on window size and becomes expensive in high-dimensional feature spaces.

## 29.4 Feature space to graph affinities

Earlier slides use feature spaces such as intensity, colour, and $(r,g,b,x,y)$.

Graph-cut slides use affinity functions based on:

- distance;
- intensity;
- colour;
- texture/filter outputs.

So the idea of choosing features continues into graph-theoretic segmentation: the graph weights depend on how similarity is measured.

## 29.5 Superpixels recur

Superpixels appear in Part 1 as a pragmatic alternative to a single correct segmentation and again in Part 4 as an efficiency trick for graph-cut-style processing.

---

# 30. Formula and algorithm sheet

## 30.1 K-means objective


$$

\sum_{\text{clusters } i}\sum_{\text{points }p\in\text{cluster }i}\|p-c_i\|^2

$$


## 30.2 K-means algorithm

1. Initialize $K$ centres randomly.
2. Assign each point to nearest centre.
3. Update each centre to the mean of assigned points.
4. Repeat until centres stop changing.

## 30.3 Univariate Gaussian


$$

\mathcal{N}(x;\mu,\sigma)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\left[-\frac{1}{2}\frac{(x-\mu)^2}{\sigma^2}\right]

$$


## 30.4 Gaussian MLEs


$$

\hat{\mu}=\frac{1}{N}\sum_i x^{(i)}

$$



$$

\hat{\sigma}^2=\frac{1}{N}\sum_i (x^{(i)}-\hat{\mu})^2

$$


## 30.5 Multivariate Gaussian


$$

\mathcal{N}(x;\mu,\Sigma)
=\frac{1}{(2\pi)^{d/2}}|\Sigma|^{-1/2}
\exp\left\{-\frac{1}{2}(x-\mu)\Sigma^{-1}(x-\mu)^T\right\}

$$


## 30.6 Mixture of Gaussians


$$

p(x)=\sum_c \pi_c \mathcal{N}(x;\mu_c,\sigma_c)

$$



$$

P(x|\theta)=\sum_{b=1}^{K}\alpha_b P(x|\theta_b)

$$


## 30.7 EM likelihood objective


$$

P(data|\theta)=\prod_x P(x|\theta)

$$


## 30.8 EM E-step


$$

P(b|x,\mu_b,V_b)
=\frac{\alpha_bP(x|\mu_b,V_b)}{\sum_{i=1}^{K}\alpha_iP(x|\mu_i,V_i)}

$$


## 30.9 EM M-step updates


$$

\alpha_b^{new}=\frac{1}{N}\sum_{i=1}^{N}P(b|x_i,\mu_b,V_b)

$$



$$

\mu_b^{new}=\frac{\sum_{i=1}^{N}x_iP(b|x_i,\mu_b,V_b)}{\sum_{i=1}^{N}P(b|x_i,\mu_b,V_b)}

$$



$$

V_b^{new}=\frac{\sum_{i=1}^{N}(x_i-\mu_b^{new})(x_i-\mu_b^{new})^T P(b|x_i,\mu_b,V_b)}{\sum_{i=1}^{N}P(b|x_i,\mu_b,V_b)}

$$


## 30.10 Mean-shift iterative mode search

1. Initialize random seed and window $W$.
2. Calculate centre of gravity / mean of $W$.
3. Shift window to the mean.
4. Repeat until convergence.

Formula shown on slide:


$$

\sum_{x\in W}xH(x)

$$


[UNCLEAR: normalization not shown on the slide.]

## 30.11 Affinity functions

Distance:


$$

aff(x,y)=\exp\left\{-\frac{1}{2\sigma_d^2}\|x-y\|^2\right\}

$$


Intensity:


$$

aff(x,y)=\exp\left\{-\frac{1}{2\sigma_d^2}\|I(x)-I(y)\|^2\right\}

$$


Colour:


$$

aff(x,y)=\exp\left\{-\frac{1}{2\sigma_d^2}dist(c(x),c(y))^2\right\}

$$


Texture/filter outputs:


$$

aff(x,y)=\exp\left\{-\frac{1}{2\sigma_d^2}\|f(x)-f(y)\|^2\right\}

$$


## 30.12 Graph cut cost


$$

cut(A,B)=\sum_{p\in A,q\in B}w_{p,q}

$$


## 30.13 Normalized cut


$$

Ncut(A,B)=\frac{cut(A,B)}{assoc(A,V)}+\frac{cut(A,B)}{assoc(B,V)}

$$



$$

assoc(A,A)=\sum_{p\in A,q\in A}w_{p,q}

$$



$$

assoc(A,V)=assoc(A,A)+cut(A,B)

$$


## 30.14 Segmentation F-measure


$$

F=\frac{2PR}{P+R}

$$


---

# 31. Worked examples preserved from slides

## 31.1 Toy intensity segmentation

**Task:** Segment a simple image with black, grey, and white regions.

**Method:** Use intensity feature and cluster into three groups.

**Steps:**

1. Inspect the histogram.
2. Identify three intensity groups: black, grey, white.
3. Choose representative centres near 0, 190, and 255.
4. Assign each pixel to the nearest centre.
5. Output three labelled regions.

## 31.2 K-means panda segmentation

**Task:** Segment a panda image by intensity clustering.

**Method:** Run k-means on pixel intensity values.

**Slide comparison:**

- $K=2$: produces a coarse two-region segmentation.
- $K=3$: produces a more detailed segmentation with three intensity-based labels.

**Main lesson:** Choosing $K$ changes the segmentation.

## 31.3 Colour feature-space clustering

**Task:** Group pixels from a colour panda image.

**Method:** Represent each pixel as $(R,G,B)$.

**Steps:**

1. Sample pixels from the image.
2. Treat each pixel as a point in RGB feature space.
3. Cluster points by colour similarity.
4. Assign pixels in the image according to cluster membership.

**Main lesson:** Feature-space choice controls the grouping produced.

## 31.4 EM/GMM segmentation

**Task:** Segment images using a Gaussian mixture model with $K=5$ components.

**Method:** Use EM to estimate component parameters and assign pixels/points probabilistically.

**Visual examples:**

- people on a field;
- rhinoceroses;
- a building/church scene.

**Main lesson:** GMMs can model multiple colour/appearance components and produce segmentations from those components.

## 31.5 Mean-shift mode search

**Task:** Find dense modes in a point cloud.

**Method:** Initialize windows and shift them to local centres of mass until convergence.

**Steps:**

1. Place a window around a seed point.
2. Compute centre of mass of points in the window.
3. Move the window to that centre.
4. Repeat until the window stops moving.
5. Merge windows ending near the same mode.

**Main lesson:** Clusters are attraction basins of density modes.

## 31.6 Minimum cut failure case

**Task:** Segment a graph into meaningful groups.

**Method:** Try minimum graph cut.

**Observation:** The ideal cut separates red points from blue points, but lower-weight cuts can isolate tiny components.

**Main lesson:** Minimum cut tends to cut off very small isolated components; normalized cut fixes this by normalizing by association/segment size.

## 31.7 GrabCut foreground extraction

**Task:** Extract foreground object from an image.

**User input:** A bounding box.

**Method:** Iterate between graph-cut segmentation and foreground/background modelling.

**Steps:**

1. User draws box.
2. Algorithm initializes foreground/background assumptions.
3. Graph cut produces segmentation.
4. Foreground/background models are updated by unsupervised clustering.
5. Steps repeat to improve the cut.

**Main lesson:** GrabCut combines region and boundary information and requires minimal user input.

---

# 32. Exam flags / high-value statements from slides

No transcript was provided, so no verbal exam statements such as “this will be on the exam” can be recovered.

Explicitly highlighted or high-value slide statements:

- **No objective definition of segmentation.** Different human segmentations can disagree.
- **K-means does not always find the global minimum.** It converges to some solution but can be a local minimum.
- **K-means issues:** setting $K$, initialization sensitivity, outlier sensitivity, spherical clusters only.
- **MoG/EM issues:** local minima, initialization, need number of components, need generative model, numerical problems.
- **Mean-shift issues:** output depends on window size; bandwidth selection is not trivial; computationally expensive; poor scaling with feature dimension.
- **Minimum cut is not always best.** It tends to cut off very small isolated components.
- **Normalized cut:** globally optimal cut is NP-complete; relaxed version solved using a generalized eigenvalue problem.
- **Superpixels:** the slide explicitly says it is important that superpixels do not cross boundaries, have similar size, have regular shape, and are generated with low complexity.

---

# 33. Unclear sections to revisit

- [UNCLEAR: transcript absent] No transcript was provided/found, so any spoken derivations, explanations, exam hints, or clarifications are unavailable.
- [UNCLEAR: mean-shift formula] The slide labels the mean-shift centre-of-gravity computation as the “mean” of $W$, but the displayed formula only shows $\sum_{x\in W}xH(x)$. If the lecturer gave a normalized expression verbally, it is not in the slide text.
- [UNCLEAR: MoG parameter notation] One slide uses $K$ for the number of Gaussian blobs but later writes $\theta=[\mu_1,\ldots,\mu_n,V_1,
\ldots,V_n]$. The component-count notation is inconsistent on the slide.
- [UNCLEAR: derivations not shown] The slides state EM updates, normalized cut, and the generalized eigenvalue relaxation result, but do not show derivations. If the lecturer derived any of these verbally, the derivation cannot be captured without transcript/audio.

---

# 34. Reading listed on slides

The slides list the following readings:

- Forsyth and Ponce, *Computer Vision: A Modern Approach*, Chapter 14.
- D. Comaniciu and P. Meer, “Mean Shift: A Robust Approach toward Feature Space Analysis,” PAMI 2002.
- J. Shi and J. Malik, “Normalized cuts and image segmentation,” PAMI 2000.
- Y. Boykov and M. Jolly, “Interactive Graph Cuts for Optimal Boundary & Region Segmentation of Objects in N-D Images,” ICCV 2001.
- Rother et al., “Interactive Foreground Extraction with Iterated Graph Cuts,” SIGGRAPH 2004.
- X. Ren and J. Malik, “Learning a classification model for segmentation,” ICCV 2003.
- Sfikas et al., IEEE ICIP 2007, shown for GMM segmentation examples.
