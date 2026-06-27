---
subject: COMP64301
chapter: 7
title: "Weeks 7–8 — Local Features, SIFT & Bag-of-Words"
language: en
---

# Study Notes — Local Features, Harris, Scale Selection, SIFT, Visual Words, and Bag-of-Words

**Topic and scope.**  
This lecture sequence explains how computer vision systems use **local invariant features** to recognise, match, retrieve, and classify images. The full pipeline is:

> local-feature motivation → repeatable interest-point detection → scale-invariant region selection → SIFT descriptors → descriptor matching/indexing → visual vocabularies → Bag-of-Words image retrieval/classification.

**Sources used:**  
- `LocalFeatures-Part1-2025.pdf`
- `LocalFeatures-Part2-2025.pdf`
- `LocalFeatures-Part3-2025.pdf`
- `LocalFeaturesSIFT-Part4-2025.pdf`
- `objectRecognitionwithLocalFeatures-part1.pdf`
- `objectRec_part2.pdf`

**Transcript status:** transcript not provided, so the notes are slide-based only. Any lecturer-only comments, spoken derivations, exam hints, or clarifications are unavailable and are marked where relevant as `[UNCLEAR]`.

---

## 1. Big-picture pipeline

The lecture sequence builds a complete classical local-feature recognition pipeline.

1. **Detect distinctive local image regions.**
   - Use interest-point detectors such as Harris, LoG, DoG, Harris-Laplace.
2. **Make the regions repeatable and invariant.**
   - Handle translation, rotation, scale, moderate viewpoint change, illumination variation, noise, blur.
3. **Describe each region.**
   - Use local descriptors such as SIFT.
4. **Match descriptors.**
   - Compare local descriptor vectors using distances such as SSD or ratio distance.
5. **Index descriptors efficiently.**
   - Quantize descriptors into visual words.
   - Use an inverted file index for retrieval.
6. **Represent whole images/categories.**
   - Use Bag-of-Words histograms over visual words.
7. **Classify or retrieve images.**
   - Use nearest neighbours, SVMs, boosting, Naïve Bayes, or other classifiers.

---

## 2. Motivation for local features

### 2.1 Why not only global image representations?

Global image representations describe the whole image at once. The slides state that global representations have limitations. Instead, the lecture motivates describing and matching only **local regions**.

This improves robustness to:

- **occlusions** — only part of the object may be visible;
- **intra-category variations** — different instances of the same category may vary globally but share local parts;
- **clutter** — background and irrelevant objects may be ignored if good local regions are selected.

### 2.2 What is a feature in computer vision?

A feature is a **local, meaningful, detectable part of an image**.

The slides also describe features as:

- locations of sudden change;
- image parts with high information content;
- regions that can be detected and matched across images.

Examples include:

- corners,
- blobs,
- textured patches,
- distinctive local object parts.

### 2.3 Why use features?

Features are useful because they:

- have high information content;
- can be invariant or robust to viewpoint and illumination changes;
- reduce computational burden by avoiding comparison of all pixels;
- can support matching even when the whole image changes.

### 2.4 Model-based vs image-based object recognition

The slides contrast two types of object recognition.

#### Model-based object recognition

A 3D model is available, and recognition means finding the object in the image using that model.

#### Image-based object recognition

The system uses example images and matches visual evidence in new images.

The local-feature approach is especially useful for image-based recognition because it can match parts of objects without requiring a full 3D model.

---

## 3. Applications of local features

Feature points are used for:

- image alignment;
- homography estimation;
- fundamental matrix estimation;
- 3D reconstruction;
- motion tracking;
- indexing and database retrieval;
- robot navigation;
- Visual SLAM;
- image stitching;
- object recognition;
- scene recognition.

Examples shown in the slides include:

- Visual SLAM on a mobile device;
- image matching across different views of the same building;
- NASA Mars Rover image matching using SIFT feature matches;
- image stitching / panorama construction;
- wide-baseline stereo;
- automatic mosaicing;
- Sony Aibo recognising charging stations, visual cards, and taught objects.

---

## 4. General local-feature approach

The slide sequence gives a five-step local-feature pipeline:

1. **Find a set of distinctive keypoints / interest points.**
2. **Define a region around each keypoint.**
3. **Extract and normalize the region content.**
4. **Compute a local descriptor from the normalized region.**
5. **Match local descriptors.**

### 4.1 Matching condition

The slides show local descriptors $f_A$ and $f_B$ compared using a distance / similarity measure:


$$

d(f_A, f_B) < T

$$


where $T$ is a threshold for accepting a match.

**Intuition.**  
Two local patches are considered corresponding if their descriptors are sufficiently similar.

---

## 5. Common requirements for local features

### 5.1 Problem 1: repeatable detection

The first requirement is:

> Detect the same point independently in both images.

If corresponding physical points are not detected in both images, there is no chance to match them.

Therefore, we need a **repeatable detector**.

**Definition — repeatable detector.**  
A detector is repeatable if it detects corresponding physical image points across different images of the same scene/object.

### 5.2 Problem 2: distinctive description

The second requirement is:

> For each point, correctly recognise the corresponding one.

Therefore, we need a **reliable and distinctive descriptor**.

A detector says where to look; a descriptor says what the local region looks like.

### 5.3 Local feature requirements

The slides list several requirements.

#### Repeatability and invariance

Region extraction needs to be repeatable and invariant to:

- translation;
- rotation;
- scale changes.

It should also be robust or covariant to:

- out-of-plane transformations, approximately affine transformations;
- lighting variations;
- noise;
- blur;
- quantization.

#### Locality

Features are local, therefore robust to occlusion and clutter.

#### Quantity

A sufficient number of regions is needed to cover the object.

#### Distinctiveness

The regions should contain “interesting” structure.

Flat or repetitive patches are not useful because they are hard to distinguish.

#### Efficiency

The method should be close to real-time.

---

## 6. Interest points and corners

### 6.1 Why corners?

Edges only localise in one direction. Along an edge, movement parallel to the edge produces little image change.

Corners provide repeatable points for matching because a small shift in almost any direction changes the local appearance.

The slide’s key idea:

> In the region around a corner, image gradient has two or more dominant directions.

### 6.2 Flat, edge, and corner regions

#### Flat region

A flat region has no significant intensity change in any direction.

- Window shift causes little change.
- Not distinctive.

#### Edge

An edge has strong change in one direction but little change along the edge.

- Localises well perpendicular to the edge.
- Poorly localised along the edge.

#### Corner

A corner has significant change in all directions.

- Localises well in both directions.
- Useful as a distinctive interest point.

---

## 7. Harris detector formulation

### 7.1 Change of intensity under a shift

The Harris detector measures how much a small image window changes when shifted by $[u,v]$.


$$

E(u,v)
=
\sum_{x,y}
w(x,y)
\left[
I(x+u,y+v) - I(x,y)
\right]^2

$$


where:

- $I(x,y)$ is the image intensity;
- $I(x+u,y+v)$ is the shifted intensity;
- $w(x,y)$ is the window function;
- $[u,v]$ is the shift.

### 7.2 Window function

The window function $w(x,y)$ determines how pixels inside the region contribute.

#### Option 1: uniform window


$$

w(x,y) = 1

$$


inside the window and $0$ outside.

This sums over a square window.

**Problem:** the square window is not rotation invariant.

#### Option 2: Gaussian window

Use a Gaussian weighting function.

The slides state that the Gaussian already performs a weighted sum and gives a rotation-invariant result.

---

## 8. Image gradient reminder

The image gradient points in the direction of most rapid increase in intensity.


$$

\nabla I =
\begin{bmatrix}
I_x \\
I_y
\end{bmatrix}

$$


The gradient magnitude is:


$$

\|\nabla I\|
=
\sqrt{I_x^2 + I_y^2}

$$


The gradient direction is:


$$

\theta
=
\tan^{-1}\left(\frac{I_y}{I_x}\right)

$$


This gradient information is used in both Harris corner detection and SIFT descriptors.

---

## 9. Small-shift approximation and second moment matrix

For small shifts, the intensity-change measure can be approximated as:


$$

E(u,v)
\cong
[u,v] M
\begin{bmatrix}
u \\
v
\end{bmatrix}

$$


where $M$ is a $2 \times 2$ matrix computed from image derivatives.

### 9.1 Second moment matrix


$$

M
=
\sum_{x,y \in w}
w(x,y)
\begin{bmatrix}
I_x^2 & I_x I_y \\
I_x I_y & I_y^2
\end{bmatrix}

$$


where:

- $I_x$ is the image derivative with respect to $x$;
- $I_y$ is the image derivative with respect to $y$;
- $I_xI_y$ captures interaction between horizontal and vertical gradient components;
- the summation is over the image region being tested for cornerness.

### 9.2 Gaussian-smoothed second moment matrix

The fast approximation slide writes:


$$

M(\sigma_I,\sigma_D)
=
g(\sigma_I)
*
\begin{bmatrix}
I_x^2(\sigma_D) & I_xI_y(\sigma_D) \\
I_xI_y(\sigma_D) & I_y^2(\sigma_D)
\end{bmatrix}

$$


where:

- $\sigma_D$ is the derivative scale;
- $\sigma_I$ is the integration/smoothing scale;
- $g(\sigma_I)$ is a Gaussian filter.

[UNCLEAR] The slides do not fully expand how $\sigma_I$ and $\sigma_D$ should be chosen.

---

## 10. Eigenvalue interpretation of Harris matrix

Let:


$$

\lambda_1, \lambda_2

$$


be the eigenvalues of $M$.

The eigenvalues describe how strongly intensity changes in two principal directions.

- A large eigenvalue means strong change in that direction.
- A small eigenvalue means weak change in that direction.

### 10.1 Flat region


$$

\lambda_1 \approx 0,\qquad \lambda_2 \approx 0

$$


Intensity change is small in all directions.

### 10.2 Edge

One eigenvalue is large and the other is small:


$$

\lambda_1 \gg \lambda_2

$$


or


$$

\lambda_2 \gg \lambda_1

$$


Intensity changes strongly in one direction but weakly in the other.

### 10.3 Corner

Both eigenvalues are large and comparable:


$$

\lambda_1 \text{ large},\qquad \lambda_2 \text{ large},\qquad \lambda_1 \approx \lambda_2

$$


Then $E(u,v)$ increases in all directions.

---

## 11. Harris corner response

### 11.1 Cornerness function

The Harris response is:


$$

R = \det(M) - \alpha \, \text{trace}(M)^2

$$


The slides also use $k$ for the constant:


$$

R = \det(M) - k(\text{trace}(M))^2

$$


In terms of eigenvalues:


$$

\det(M) = \lambda_1\lambda_2

$$



$$

\text{trace}(M) = \lambda_1+\lambda_2

$$


So:


$$

R
=
\lambda_1\lambda_2
-
\alpha(\lambda_1+\lambda_2)^2

$$


The slides give:


$$

\alpha = 0.04 \text{ to } 0.06

$$


### 11.2 Interpretation of $R$

The slides state:

- $R$ is large for a corner.
- $R$ is negative with large magnitude for an edge.
- $|R|$ is small for a flat region.

| Region type | Eigenvalue behaviour | Harris response |
|---|---|---|
| Flat | $\lambda_1,\lambda_2$ small | $|R|$ small |
| Edge | one large, one small | $R<0$ |
| Corner | both large | $R>0$ |

---

## 12. Harris detector workflow

The Harris detector workflow is:

1. Compute image derivatives:
   
$$

   I_x,\quad I_y
   
$$

2. Compute squared/product derivative images:
   
$$

   I_x^2,\quad I_y^2,\quad I_xI_y
   
$$

3. Smooth with Gaussian filter:
   
$$

   g(I_x^2),\quad g(I_y^2),\quad g(I_xI_y)
   
$$

4. Build the second moment matrix $M$.
5. Compute the cornerness function $R$.
6. Find points with large response:
   
$$

   R > \text{threshold}
   
$$

7. Apply non-maximum suppression:
   - take only local maxima of $R$.
8. The remaining points are Harris points.

### 12.1 Harris detector responses

The slides show that Harris gives a precise corner detector. It detects points at visually sharp, repeatable structures such as corners of objects, boxes, or architectural features.

---

## 13. Harris detector properties

### 13.1 Rotation invariance

The slides state:

> Corner response $R$ is invariant to image rotation.

Reason:

- when the image rotates, the ellipse associated with $M$ rotates;
- but the shape of the ellipse, i.e. the eigenvalues, stays the same;
- since $R$ depends only on eigenvalues, it remains unchanged.

### 13.2 Lack of scale invariance

The slides explicitly state:

> Not invariant to image scale.

A corner at one scale can look edge-like if the window size is inappropriate after scaling.

This motivates scale-invariant region selection.

---

## 14. From points to regions

The Harris operator defines interest points with:

- precise localization;
- high repeatability.

However, to compare these points, we need to compute a descriptor over a region.

The next question is:

> How can we define such a region in a scale-invariant manner?

Equivalently:

> How can we detect scale-invariant interest regions?

---

## 15. Naïve scale approach: exhaustive search

A naïve approach is a multi-scale procedure:

- compare descriptors while varying the patch size;
- try different region sizes until corresponding patches match.

The slides show that a patch size may be wrong at first, giving mismatching descriptors, but another patch size may correctly capture the corresponding content.

### 15.1 Why exhaustive search is bad

Comparing descriptors while varying patch size is:

- computationally inefficient;
- inefficient but possible for small-scale matching;
- prohibitive for retrieval in large databases;
- prohibitive for recognition.

Therefore, automatic scale selection is needed.

---

## 16. Automatic scale selection

### 16.1 Main idea

Design a function on the region that is **scale invariant**:

> The same for corresponding regions, even if they are at different scales.

For a point in one image, consider the response as a function of region size or patch width.

This response curve is the **scale signature**.

### 16.2 Local maximum principle

The common approach:

1. Compute the function response for increasing scale.
2. Take a local maximum of this function.
3. Use the scale at which the maximum occurs as the selected scale.

The key observation:

> The region size for which the maximum is achieved should be invariant to image scale.

### 16.3 Independent scale selection

The slide explicitly says:

> Important: this scale invariant region size is found in each image independently!

If the second image is half the scale of the first, then:


$$

s_2 = \frac{1}{2}s_1

$$


but each scale is found independently from its own image.

### 16.4 Normalization

After selecting scale, normalize by rescaling the region to a fixed size.

This allows descriptor computation on comparable normalized patches.

---

## 17. Laplacian and Laplacian-of-Gaussian

### 17.1 Edge position reminder

In 1D:

- the image intensity has a discontinuity;
- the first derivative has a peak at the edge;
- the second derivative changes sign near the edge.

The notation reminder from the slide:


$$

\frac{\partial}{\partial x} \equiv \partial_x

$$


### 17.2 Second derivative filters

Second derivative with respect to $x$:


$$

[1 \quad -2 \quad 1]

$$


Second derivative with respect to $y$:


$$

\begin{bmatrix}
1 \\
-2 \\
1
\end{bmatrix}

$$


### 17.3 Laplacian

The Laplacian is the sum of second-order partial derivatives:


$$

\nabla^2 I(x,y)
=
\frac{\partial^2 I(x,y)}{\partial x^2}
+
\frac{\partial^2 I(x,y)}{\partial y^2}

$$


or:


$$

\nabla^2 I(x,y) = I_{xx}+I_{yy}

$$


A discrete Laplacian kernel shown in the slides is:


$$

\begin{bmatrix}
0 & 1 & 0 \\
1 & -4 & 1 \\
0 & 1 & 0
\end{bmatrix}
* I

$$


### 17.4 Notes about the Laplacian

The slides state:

- $\nabla^2 I(x,y)$ is a scalar.
- It can be found using a single mask.
- Orientation information is lost.
- It is the sum of second-order derivatives.
- Taking derivatives increases noise.
- The Laplacian is very noise sensitive.
- Therefore it is always combined with smoothing.

Pipeline:


$$

I(x,y) \rightarrow \text{Smooth} \rightarrow \text{Laplacian} \rightarrow O(x,y)

$$


---

## 18. Laplacian of Gaussian, LoG

### 18.1 Combining Gaussian smoothing and Laplacian

If $K_{\nabla^2}$ is a Laplacian kernel and $G_\sigma$ is a Gaussian kernel:


$$

K_{\nabla^2} * (G_\sigma * I)
=
(K_{\nabla^2} * G_\sigma) * I
=
(\nabla^2 G_\sigma) * I

$$


The term:


$$

\nabla^2 G_\sigma

$$


is the **Laplacian of Gaussian**.

### 18.2 1D Gaussian and derivatives

The slides give:


$$

g(x)
=
e^{-\frac{x^2}{2\sigma^2}}

$$


First derivative:


$$

g'(x)
=
-\frac{x}{\sigma^2}
e^{-\frac{x^2}{2\sigma^2}}

$$


Second derivative:


$$

g''(x)
=
\left(
\frac{x^2}{\sigma^4}
-
\frac{1}{\sigma^2}
\right)
e^{-\frac{x^2}{2\sigma^2}}

$$


### 18.3 2D Laplacian of Gaussian

The slide gives the 2D LoG form as:


$$

\frac{1}{\sigma^2}
\left(
\frac{x^2+y^2}{\sigma^2}
-
1
\right)
e^{-\frac{x^2+y^2}{2\sigma^2}}

$$


[UNCLEAR] Some standard LoG formulas include different normalising constants or factors; this note preserves the slide’s displayed form.

### 18.4 LoG as blob detector

The slides state:

> Laplacian-of-Gaussian == “blob” detector.

A blob produces an extreme LoG response when the filter scale matches the blob size.

---

## 19. Characteristic scale

The slides define:

> The characteristic scale is the scale that produces an extreme value / peak of Laplacian-of-Gaussian response.

In notation:


$$

\sigma^*
=
\arg\max_\sigma
\left|
\text{LoG response at scale } \sigma
\right|

$$


The slide says “extreme value,” so the relevant response may be a maximum or minimum depending on sign convention.

**Intuition.**  
A blob-like image structure responds most strongly when the LoG filter has the right scale for the blob.

---

## 20. LoG interest points in scale space

For scale-invariant detection, interest points are:

> Local maxima in scale space of Laplacian-of-Gaussian.

The detector searches over:

- spatial coordinate $x$;
- spatial coordinate $y$;
- scale $\sigma$.

The output is:


$$

(x,y,\sigma)

$$


This gives both the location and the region scale.

---

## 21. LoG detector workflow

The LoG detector workflow shown visually:

1. Start with an image.
2. Compute LoG responses at multiple scales.
3. Detect strong local extrema in scale space.
4. Return circular regions at detected locations/scales.

The butterfly example shows many detected circular regions, with circle radius corresponding to detected scale.

---

## 22. Harris-Laplace detector

Harris-Laplace combines Harris corner detection with LoG-based scale selection.

The slides list:

1. **Initialization:** multiscale Harris corner detection.
2. **Scale selection:** based on Laplacian of Gaussian.

**Intuition.**  
Harris gives precise corner localisation; LoG gives the characteristic scale for the region.

---

## 23. Difference-of-Gaussian, DoG

### 23.1 Why DoG?

LoG can be approximated by a Difference of Gaussians.

This is more efficient because:

- no second derivatives need to be computed;
- Gaussian-smoothed images are already computed in a Gaussian pyramid;
- DoG is used in Lowe’s SIFT pipeline for feature detection.

### 23.2 DoG formula

The slide gives:


$$

DoG
=
G(x,y,k\sigma)
-
G(x,y,\sigma)

$$


where:

- $G(x,y,\sigma)$ is a Gaussian at scale $\sigma$;
- $G(x,y,k\sigma)$ is a Gaussian at a nearby larger scale;
- $k$ is the scale multiplier.

### 23.3 DoG computation in Gaussian scale pyramid

Workflow:

1. Build a Gaussian scale pyramid.
2. Smooth the image at multiple scales.
3. Subtract neighbouring Gaussian-smoothed images.
4. Obtain Difference-of-Gaussian images.
5. Detect local extrema in scale space.

### 23.4 DoG keypoint localisation

The slides give the DoG keypoint localisation process:

1. Detect maxima of DoG in scale space.
2. Reject points with low contrast using a threshold.
3. Eliminate edge responses.
4. Output candidate keypoints:


$$

(x,y,\sigma)

$$


### 23.5 DoG example from slide

The slide gives a keypoint detection example:

- image size:
  
$$

  233 \times 189
  
$$

- initial DoG extrema:
  
$$

  832
  
$$

- after peak-value threshold:
  
$$

  729
  
$$

- after testing ratio of principal curvatures and removing edge responses:
  
$$

  536
  
$$


This illustrates that the detector first produces many candidates and then removes unstable/edge-like ones.

---

## 24. Summary of scale-invariant detection

Given two images of the same scene with a large scale difference, the goal is:

> Find the same interest points independently in each image.

The solution is:

> Search for maxima of suitable functions in scale and in space.

Two main strategies:

- Laplacian-of-Gaussian (LoG);
- Difference-of-Gaussian (DoG) as a fast approximation.

These can be used:

- on their own;
- combined with single-scale detectors such as Harris.

---

## 25. Bridge to descriptors

At this stage, the pipeline can detect:


$$

(x,y,\sigma)

$$


for each candidate keypoint.

That gives:

- position,
- scale,
- interest point location.

The next question is:

> How do we match them?

This leads into local descriptors, especially SIFT.

---

## 26. Feature descriptors

### 26.1 Matching problem

The SIFT lecture begins with:

> We know how to detect good points. Next question: how to match them?

Two possibilities:

- simple option: match square windows around the point;
- state-of-the-art approach: SIFT.

### 26.2 How to achieve feature invariance

The slides state that we need both:

1. An invariant detector.
2. An invariant descriptor.

#### Detector invariance

The detector should be invariant to:

- translation;
- rotation;
- scale.

It should find:

- interest-point locations;
- characteristic scales.

#### Descriptor invariance

A descriptor captures information in the region around the detected interest point.

The slides call it the:

> signature of the region’s content.

---

## 27. Simple patch descriptors

### 27.1 Square window of pixels

The simplest descriptor is a list of intensities inside a patch.

The slides write:


$$

A \rightarrow \mathbf{a}

$$



$$

B \rightarrow \mathbf{b}

$$


So each region is written as a vector.

### 27.2 Limitation of raw pixel descriptors

Small changes can affect matching score a lot:

- intensity changes;
- rotation;
- 3D viewpoint change.

Therefore, raw pixel windows are not robust.

### 27.3 Solution: gradient direction histograms

The proposed solution is:

> histograms of gradient directions.

This is the foundation of SIFT.

---

## 28. Rotation-invariant descriptors

### 28.1 Local orientation

To make a descriptor rotation invariant:

1. Find local orientation.
2. Use the dominant direction of gradient for the image patch.
3. Rotate the patch according to this angle.

This places the patch into a **canonical orientation**.

### 28.2 Orientation normalization

The slides state:

- gradient orientation is quantised into eight bins;
- bins cover $0^\circ$ to $360^\circ$, i.e. $0$ to $2\pi$;
- compute orientation histogram;
- select dominant orientation;
- rotate to fixed orientation.

---

## 29. SIFT descriptor formation

### 29.1 SIFT definition

SIFT stands for:

> Scale Invariant Feature Transform.

Descriptor computation uses:

- SIFT feature location and scale using DoG;
- gradient orientation over a $16 \times 16$ pixel region around the interest point;
- histogram of image gradient orientations for all pixels in that region.

### 29.2 SIFT vector construction

Steps:

1. Take a $16 \times 16$ window around the interest point.
2. Divide it into a $4 \times 4$ grid of sub-patches.
3. This gives:
   
$$

   4 \times 4 = 16 \text{ cells}
   
$$

4. For each cell, compute a histogram of gradient orientations.
5. Each histogram has 8 orientation bins.
6. Concatenate all histograms.

Final descriptor dimension:


$$

4 \times 4 \times 8 = 128

$$


This is a key value.

### 29.3 SIFT output for one image

For one image, SIFT yields:

- $n$ 128-dimensional descriptors:
  
$$

  n \times 128
  
$$

- $n$ scale parameters:
  
$$

  n \times 1
  
$$

- $n$ orientation parameters:
  
$$

  n \times 1
  
$$

- $n$ 2D points:
  
$$

  n \times 2
  
$$


So an image produces a set of descriptors, not one descriptor.

### 29.4 Robustness of SIFT

The slides state that SIFT is an extraordinarily robust matching technique:

- handles viewpoint changes up to about $60^\circ$ out-of-plane rotation;
- handles significant illumination changes;
- can sometimes handle day vs night changes;
- is fast and efficient;
- code is widely available.

---

## 30. Feature matching

### 30.1 Basic feature matching

Given a feature in image $I_1$, find the best match in $I_2$:

1. Define a distance function between descriptors.
2. Test all features in $I_2$.
3. Choose the feature with minimum distance.

### 30.2 SSD distance

The simple distance function is SSD:


$$

SSD(f_1,f_2)

$$


where SSD means sum of squared differences.

For descriptors:


$$

f_1=(f_{1,1},\dots,f_{1,d})

$$



$$

f_2=(f_{2,1},\dots,f_{2,d})

$$



$$

SSD(f_1,f_2)
=
\sum_{k=1}^{d}
(f_{1,k}-f_{2,k})^2

$$


For SIFT:


$$

d=128

$$


### 30.3 Problem with SSD

SSD can give good scores to ambiguous bad matches.

A descriptor may have many similarly close neighbours. In that case, the best SSD match is not necessarily reliable.

### 30.4 Ratio distance

The better approach shown is:


$$

\text{ratio distance}
=
\frac{SSD(f_1,f_2)}
{SSD(f_1,f_2')}

$$


where:

- $f_2$ is the best SSD match to $f_1$ in $I_2$;
- $f_2'$ is the second-best SSD match to $f_1$ in $I_2$.

Interpretation:

- small ratio: best match is much better than second-best, so it is distinctive;
- ratio near $1$: match is ambiguous.

### 30.5 Eliminating bad matches

The slides state:


$$

\text{Throw out features with distance} > \text{threshold}

$$


Example distances shown:

- $50$: true match;
- $75$: true match;
- $200$: false match.

[UNCLEAR] The slides do not give a final threshold-selection rule; they introduce ROC curves for evaluation.

---

## 31. Evaluating feature matchers

### 31.1 True positives and false positives

The threshold affects performance.


$$

\text{True positives}
=
\# \text{ detected matches that are correct}

$$



$$

\text{False positives}
=
\# \text{ detected matches that are incorrect}

$$


### 31.2 True positive rate


$$

TPR
=
\frac{\# \text{ true positives matched}}
{\# \text{ true positives}}

$$


The denominator is the number of features that really do have a match.

### 31.3 False positive rate


$$

FPR
=
\frac{\# \text{ false positives matched}}
{\# \text{ true negatives}}

$$


The denominator is the number of features that really do not have a match.

### 31.4 ROC curve

ROC means:


$$

\text{Receiver Operator Characteristic}

$$


The ROC curve plots:


$$

x = \text{false positive rate}

$$



$$

y = \text{true positive rate}

$$


ROC curves are generated by counting correct/incorrect matches for different thresholds.

[UNCLEAR] The slide text appears to say “current/incorrect matches”; likely intended as “correct/incorrect matches.”

### 31.5 AUC

The slides state:

> Want to maximize area under the curve (AUC).

AUC is useful for comparing different feature-matching methods.

---

## 32. Indexing local features

### 32.1 Descriptors as points in feature space

Each patch/region has a descriptor, which is a point in a high-dimensional feature space.

For SIFT:


$$

f \in \mathbb{R}^{128}

$$


Close points in feature space indicate similar descriptors and therefore similar local image content.

### 32.2 Why indexing is needed

Images can contain thousands of features, and databases can contain hundreds to millions of images.

The problem:

> How to efficiently find database images relevant to a new image?

Brute-force matching all descriptors against all descriptors is expensive.

### 32.3 Text retrieval analogy

For text documents:


$$

\text{word} \rightarrow \text{pages where word occurs}

$$


For images:


$$

\text{visual word} \rightarrow \text{images/frames where feature occurs}

$$


To use this idea, continuous descriptors must be mapped to discrete visual words.

---

## 33. Visual words

### 33.1 Main idea

A visual word is a discrete token representing a group of similar local descriptors.

### 33.2 Quantization

The slides define indexing with visual words as:

> Map high-dimensional descriptors to tokens/words by quantizing the feature space.

Process:

1. Extract local descriptors from images.
2. Cluster the descriptor vectors.
3. Treat cluster centres as prototype visual words.
4. Assign each new image region to the closest cluster centre.

If descriptor $f$ is closest to cluster centre $c_k$:


$$

f \mapsto w_k

$$


where $w_k$ is the corresponding visual word.

### 33.3 Visual vocabulary

The set of all visual words is the **visual vocabulary**:


$$

\{w_1,w_2,\dots,w_V\}

$$


where $V$ is the vocabulary size.

---

## 34. Inverted file index

### 34.1 Structure

An inverted file index maps:


$$

\text{visual word number}
\rightarrow
\text{list of image/frame numbers}

$$


Example pattern:


$$

w_7 \rightarrow \{1,2\}

$$



$$

w_{91} \rightarrow \{2\}

$$


### 34.2 Database indexing algorithm

For database images:

1. Detect or sample local features.
2. Compute descriptors.
3. Quantize descriptors to visual words.
4. Insert image/frame ID into the inverted list for each visual word.

### 34.3 Query-time retrieval algorithm

For a query image:

1. Extract words in the query.
2. Use the inverted file index to find relevant images/frames.
3. Compare word counts.

This reduces query-time search.

### 34.4 Query region case

If the query is a portion of a frame:

1. User selects a query region.
2. Pull out only SIFT descriptors whose positions lie inside that polygon.
3. Use those descriptors/visual words to retrieve relevant frames.

The slides show examples from *Friends* and *Groundhog Day*.

---

## 35. Video Google system

The Video Google pipeline is:

1. Collect all words within the query region.
2. Use the inverted file index to find relevant frames.
3. Compare word counts.
4. Perform spatial verification.

The system is attributed to Sivic & Zisserman, ICCV 2003.

---

## 36. Spatial verification

### 36.1 Why spatial verification is needed

Two image pairs may share many visual words but not correspond to the same object/scene.

The slides show examples where both pairs have many visual words in common, but only some matches are mutually consistent.

### 36.2 Generalized Hough Transform

The spatial verification strategy shown is the **Generalized Hough Transform**.

Algorithm:

1. Each matched feature casts a vote on:
   - object location;
   - scale;
   - orientation.
2. Parameters with enough votes are verified.

**Intuition.**  
Correct object matches should agree on a common geometric transformation. Random visual-word matches usually will not.

[UNCLEAR] The slides do not specify exact Hough parameterisation, bin sizes, or voting thresholds.

---

## 37. Visual vocabulary formation

The slides list issues in visual vocabulary construction:

1. Sampling strategy: where to extract features?
2. Clustering / quantization algorithm.
3. Unsupervised vs supervised construction.
4. What corpus provides the features — possible universal vocabulary?
5. Vocabulary size / number of words.

### 37.1 Sampling strategies

The slides show:

- sparse sampling at interest points;
- dense uniform sampling;
- random sampling;
- multiple interest operators.

Slide points:

- For specific textured objects, sparse sampling from interest points is often more reliable.
- Multiple complementary interest operators provide more image coverage.
- For object categorization, dense sampling gives better coverage.

### 37.2 Clustering / quantization methods

The slide lists:

- $k$-means as the typical choice;
- agglomerative clustering;
- mean-shift.

[UNCLEAR] The slides name these methods but do not derive them.

---

## 38. Object categorization

### 38.1 Specific-object recognition vs category recognition

The slides distinguish:

- **Find this particular object** — instance-level recognition.
- **Recognize any car / any cow** — category-level recognition.

Object categorization is harder because category members vary in shape, pose, texture, viewpoint, and background.

### 38.2 Formal task description

The slide gives:

> Given a small number of training images of a category, recognize a-priori unknown instances of that category and assign the correct category label.

### 38.3 Levels of categorization

The slides show a hierarchy:

- individual level: “Fido”;
- subordinate/specific category: German shepherd, Doberman;
- basic level: dog, cat, cow;
- abstract levels: quadruped, animal, living being.

### 38.4 Basic-level categories

The slides state:

- Basic-level categories in humans seem to be defined predominantly visually.
- Humans usually start with basic-level categorization before identification.
- Basic-level categorization is easier and faster than object identification.
- Therefore, it is a promising starting point for visual classification.

### 38.5 Number of object categories

The slides give:


$$

\sim 10{,}000 \text{ to } 30{,}000

$$


object categories.

### 38.6 Other category types

#### Functional categories

Defined by function.

Example:

> chairs = “something you can sit on”

#### Ad-hoc categories

Defined by a situational/contextual grouping.

Example:

> something you can find in an office environment

---

## 39. Challenges in object categorization

### 39.1 Robustness challenges

The slides list:

- illumination;
- object pose;
- clutter;
- occlusions;
- intra-class appearance;
- viewpoint.

### 39.2 Minimal supervision

The slides show a supervision continuum:

- unlabeled images with multiple objects;
- class labels with some clutter;
- cropped objects and object parts labelled.

The challenge is to learn useful category models with limited supervision.

### 39.3 Category representation problem

The key questions:

> If a local image region is a visual word, how can we summarize an image?

> How can we build a representation suitable for an entire category?

The representation should be:

- robust to intra-category variation;
- robust to deformation and articulation;
- still discriminative.

This motivates Bag-of-Words.

---

## 40. Bag-of-Words representation

### 40.1 Analogy to documents

In text retrieval, a document can be represented by the words it contains.

Similarly, an image can be represented by the visual words it contains.

### 40.2 Object as a bag of visual words

An object/image is represented as a collection of local patches, ignoring exact spatial order.

### 40.3 Definition of BoW

The slides give two definitions.

#### Looser definition

A Bag-of-Words representation consists of:

- independent features.

#### Stricter definition

A stricter Bag-of-Words representation consists of:

- independent features;
- histogram representation.

### 40.4 Formal BoW representation

Let the vocabulary contain:


$$

\{w_1,w_2,\dots,w_V\}

$$


An image $I$ is represented as:


$$

\mathbf{x} = [x_1,x_2,\dots,x_V]

$$


where:


$$

x_i =
\text{number of occurrences of visual word } w_i \text{ in image } I

$$


This gives a fixed-dimensional vector for any image.

---

## 41. Bag-of-Words model pipeline

### 41.1 Learning phase

1. Feature detection and representation.
2. Codeword dictionary / visual vocabulary construction.
3. Image representation as BoW histograms.
4. Train category models/classifiers.

### 41.2 Recognition phase

1. Extract features from a new image.
2. Quantize features using the codeword dictionary.
3. Build image histogram.
4. Make category decision.

### 41.3 Feature detection options

#### Regular grid

Examples:

- color histogram approach;
- multidimensional receptive field histograms.

#### Interest point detector

Use a state-of-the-art detector, e.g. scale-invariant detector, and descriptors such as SIFT.

### 41.4 Codeword dictionary formation

Descriptors are clustered in feature space.

Each cluster centre becomes a visual codeword.


$$

\text{descriptor space}
\rightarrow
\text{clusters}
\rightarrow
\text{visual words}

$$


### 41.5 Image representation

For an image:

1. Extract descriptors.
2. Assign descriptors to visual words.
3. Count occurrences.
4. Store the counts as a histogram.

---

## 42. Comparing Bag-of-Words histograms

### 42.1 Histogram comparison

The slides state that any histogram comparison measure can be used.

One example is the normalized scalar product between occurrence count vectors.

### 42.2 Cosine similarity formula

For database image vector $\mathbf{d}_j$ and query vector $\mathbf{q}$:


$$

sim(\mathbf{d}_j,\mathbf{q})
=
\frac{
\langle \mathbf{d}_j,\mathbf{q}\rangle
}
{
\|\mathbf{d}_j\|\|\mathbf{q}\|
}

$$


Expanded over vocabulary size $V$:


$$

sim(\mathbf{d}_j,\mathbf{q})
=
\frac{
\sum_{i=1}^{V} d_j(i)q(i)
}
{
\sqrt{\sum_{i=1}^{V}d_j(i)^2}
\sqrt{\sum_{i=1}^{V}q(i)^2}
}

$$


### 42.3 Worked example

The slide shows:


$$

\mathbf{d}_j = [1,8,1,4]

$$



$$

\mathbf{q} = [5,1,1,0]

$$


Dot product:


$$

\langle \mathbf{d}_j,\mathbf{q}\rangle
=
1\cdot5 + 8\cdot1 + 1\cdot1 + 4\cdot0
=
14

$$


Norms:


$$

\|\mathbf{d}_j\|
=
\sqrt{1^2+8^2+1^2+4^2}
=
\sqrt{82}

$$



$$

\|\mathbf{q}\|
=
\sqrt{5^2+1^2+1^2+0^2}
=
\sqrt{27}

$$


Similarity:


$$

sim(\mathbf{d}_j,\mathbf{q})
=
\frac{14}{\sqrt{82}\sqrt{27}}
=
\frac{14}{\sqrt{2214}}
\approx 0.298

$$


---

## 43. Learning and recognition with BoW histograms

### 43.1 Why BoW is useful

BoW represents an unordered point set with a single fixed-dimensional vector.

This allows use of learning algorithms that require vector input.


$$

\text{variable-size set of local descriptors}
\rightarrow
\text{fixed-dimensional histogram vector}

$$


### 43.2 Image-level classification

The slides state that BoW works pretty well for image-level classification, with examples:


$$

\{\text{face}, \text{flowers}, \text{building}\}

$$


---

## 44. Category models and classifiers

### 44.1 Discriminative methods

A discriminative method learns a decision rule.

The slides define:

> Learn a decision rule/classifier assigning bag-of-features representations of images to different classes.

Example:

- zebra;
- non-zebra;
- decision boundary.

### 44.2 Generative methods

A generative method models class-conditional likelihoods.

Example:


$$

p(\text{image}\mid\text{zebra})

$$



$$

p(\text{image}\mid\text{no zebra})

$$


Classification compares which class model makes the image more likely.

---

## 45. Nearest-neighbour classification

### 45.1 Basic nearest neighbour

Assign the label of the nearest training data point to each test point.

### 45.2 Decision regions

Any decision rule divides input space into decision regions separated by decision boundaries.

Nearest-neighbour classification creates a Voronoi partition of feature space.

### 45.3 K-nearest neighbours

For KNN:

1. For a new point, find the $k$ closest training points.
2. The labels of the $k$ points vote.
3. Assign the majority class.

Slide example:


$$

k=5

$$


If the 5 nearest neighbours are:

- 3 negative;
- 2 positive;

then classify as:


$$

\text{negative}

$$


### 45.4 Pros of nearest neighbours

- Simple to implement.
- Flexible to feature/distance choices.
- Naturally handles multi-class cases.
- Can work well with enough representative data.

### 45.5 Cons of nearest neighbours

- Large search problem to find nearest neighbours.
- Requires storing data.
- Requires a meaningful distance function.

---

## 46. Other discriminative classifiers

The slides list:

- Boosting;
- Support Vector Machines (SVMs).

Boosting is marked as connected to the previous lecture.

---

## 47. Naïve Bayes model

### 47.1 Conditional independence assumption

The Naïve Bayes model assumes each feature is conditionally independent given the class.


$$

p(w_1,\dots,w_N\mid c)
=
\prod_{i=1}^{N}p(w_i\mid c)

$$


where:

- $w_i$ is the $i$-th visual word;
- $c$ is the class.

### 47.2 MAP decision rule


$$

c^*
=
\arg\max_c
p(c)
\prod_{i=1}^{N}
p(w_i\mid c)

$$


where:

- $c^*$ is the chosen class;
- $p(c)$ is the class prior;
- $p(w_i\mid c)$ is the likelihood of the $i$-th visual word given class $c$.

Likelihoods are estimated using empirical frequencies of visual words in images from a class.

### 47.3 Presence/absence version

If only word presence/absence is used:


$$

x_i \in \{0,1\}

$$


Then:


$$

P(\mathbf{x}\mid c)
=
\prod_{i=1}^{m}
P(x_i\mid c)

$$


### 47.4 Dataset example

The slides show image classification with Naïve Bayes using:

- 7 object categories;
- arbitrary views;
- partial occlusions.

The cited example is Csurka et al. 2004.

### 47.5 Recognition result table

The slide shows a confusion matrix for the best vocabulary:


$$

k=1000

$$


| True class | faces | buildings | trees | cars | phones | bikes | books |
|---|---:|---:|---:|---:|---:|---:|---:|
| faces | 76 | 4 | 2 | 3 | 4 | 4 | 13 |
| buildings | 2 | 44 | 5 | 0 | 5 | 1 | 3 |
| trees | 3 | 2 | 80 | 0 | 0 | 5 | 0 |
| cars | 4 | 1 | 0 | 75 | 3 | 1 | 4 |
| phones | 9 | 15 | 1 | 16 | 70 | 14 | 11 |
| bikes | 2 | 15 | 12 | 0 | 8 | 73 | 0 |
| books | 4 | 19 | 0 | 6 | 7 | 2 | 69 |

Mean ranks:

| Class | Mean rank |
|---|---:|
| faces | 1.49 |
| buildings | 1.88 |
| trees | 1.33 |
| cars | 1.33 |
| phones | 1.63 |
| bikes | 1.57 |
| books | 1.57 |

---

## 48. Spatial information in BoW

### 48.1 Core limitation

The slides ask:

> What about spatial info?

A Bag-of-Words representation is **orderless**.

It throws out spatial relationships between features.

Therefore, two images with the same local patches but different arrangements can have similar or identical BoW histograms.

### 48.2 Middle-ground solutions

The slides list ways to reintroduce spatial information:

- visual phrases: frequently co-occurring words;
- semi-local features: describe configuration/neighbourhood;
- include position as part of each feature;
- count bags of words only within sub-grids of an image;
- after matching, verify spatial consistency by checking neighbours.

---

## 49. Summary: indexing features

The indexing-feature pipeline:

1. Detect or sample features.
2. Store:
   - positions;
   - scales;
   - orientations.
3. Describe features.
4. Produce a list of $d$-dimensional descriptors.
5. Either:
   - index descriptors into a pool from previous images; or
   - quantize descriptors to form a BoW vector.

---

## 50. Summary: Bag-of-Words

### 50.1 Pros

The slides list:

- flexible to geometry, deformations, and viewpoint;
- compact summary of image content;
- provides vector representation for sets;
- empirically good recognition results.

### 50.2 Cons

The slides list:

- basic model ignores geometry;
- geometry must be verified afterwards or encoded via features;
- background and foreground are mixed when the bag covers the whole image;
- interest points or sampling do not guarantee object-level parts;
- optimal vocabulary formation remains unclear.

---

## 51. Key formulas

### Local descriptor matching


$$

d(f_A,f_B)<T

$$


### Harris shift energy


$$

E(u,v)
=
\sum_{x,y}
w(x,y)
\left[
I(x+u,y+v)-I(x,y)
\right]^2

$$


### Harris small-shift approximation


$$

E(u,v)
\cong
[u,v]M
\begin{bmatrix}
u\\
v
\end{bmatrix}

$$


### Second moment matrix


$$

M
=
\sum_{x,y \in w}
w(x,y)
\begin{bmatrix}
I_x^2 & I_xI_y \\
I_xI_y & I_y^2
\end{bmatrix}

$$


### Harris response


$$

R=\det(M)-\alpha\text{trace}(M)^2

$$


### Harris response in eigenvalue form


$$

R
=
\lambda_1\lambda_2
-
\alpha(\lambda_1+\lambda_2)^2

$$


### Gradient magnitude


$$

\|\nabla I\|=\sqrt{I_x^2+I_y^2}

$$


### Gradient direction


$$

\theta=\tan^{-1}\left(\frac{I_y}{I_x}\right)

$$


### Laplacian


$$

\nabla^2 I(x,y)
=
I_{xx}+I_{yy}

$$


### Laplacian of Gaussian identity


$$

K_{\nabla^2}*(G_\sigma*I)
=
(K_{\nabla^2}*G_\sigma)*I
=
(\nabla^2G_\sigma)*I

$$


### DoG


$$

DoG=G(x,y,k\sigma)-G(x,y,\sigma)

$$


### SIFT descriptor dimension


$$

4\times4\times8=128

$$


### SSD


$$

SSD(f_1,f_2)
=
\sum_{k=1}^{d}(f_{1,k}-f_{2,k})^2

$$


### Ratio distance


$$

\frac{SSD(f_1,f_2)}{SSD(f_1,f_2')}

$$


### True positive rate


$$

TPR
=
\frac{\#\text{ true positives matched}}
{\#\text{ true positives}}

$$


### False positive rate


$$

FPR
=
\frac{\#\text{ false positives matched}}
{\#\text{ true negatives}}

$$


### BoW cosine similarity


$$

sim(\mathbf{d}_j,\mathbf{q})
=
\frac{
\sum_{i=1}^{V}d_j(i)q(i)
}
{
\sqrt{\sum_{i=1}^{V}d_j(i)^2}
\sqrt{\sum_{i=1}^{V}q(i)^2}
}

$$


### Naïve Bayes likelihood


$$

p(w_1,\dots,w_N\mid c)
=
\prod_{i=1}^{N}p(w_i\mid c)

$$


### Naïve Bayes MAP decision


$$

c^*
=
\arg\max_c
p(c)
\prod_{i=1}^{N}p(w_i\mid c)

$$


---

## 52. Worked examples

### 52.1 Harris region classification

Given eigenvalues $\lambda_1,\lambda_2$:

- if both are small → flat;
- if one is large and one is small → edge;
- if both are large and similar → corner.

### 52.2 DoG filtering example

Initial image:


$$

233\times189

$$


Initial DoG extrema:


$$

832

$$


After peak threshold:


$$

729

$$


After removing edge responses:


$$

536

$$


### 52.3 SIFT descriptor size

A SIFT descriptor uses:

- $4\times4$ cells;
- 8 orientation bins per cell.


$$

4\times4\times8=128

$$


### 52.4 Ratio distance example structure

Given:

- $f_1$ in $I_1$;
- $f_2$, best match in $I_2$;
- $f_2'$, second-best match in $I_2$;

compute:


$$

\frac{SSD(f_1,f_2)}{SSD(f_1,f_2')}

$$


A ratio near 1 means ambiguity.

### 52.5 KNN example

If:


$$

k=5

$$


and nearest neighbours are:

- 3 negative;
- 2 positive;

then classify as:


$$

\text{negative}

$$


### 52.6 BoW similarity example

Given:


$$

\mathbf{d}_j=[1,8,1,4]

$$



$$

\mathbf{q}=[5,1,1,0]

$$


Dot product:


$$

1\cdot5+8\cdot1+1\cdot1+4\cdot0=14

$$


Norms:


$$

\|\mathbf{d}_j\|=\sqrt{82}

$$



$$

\|\mathbf{q}\|=\sqrt{27}

$$


Similarity:


$$

sim(\mathbf{d}_j,\mathbf{q})
=
\frac{14}{\sqrt{82}\sqrt{27}}
\approx0.298

$$


---

## 53. Exam flags / high-value revision points

No transcript was provided, so no spoken exam flags can be captured. The following are slide-emphasised or high-value for revision.

### Very high value

- Local features solve problems with global representations.
- Repeatable detector + distinctive descriptor are both required.
- Flat/edge/corner distinction.
- Harris energy:
  
$$

  E(u,v)
  
$$

- Second moment matrix:
  
$$

  M
  
$$

- Eigenvalue interpretation of $M$.
- Harris response:
  
$$

  R=\det(M)-\alpha\text{trace}(M)^2
  
$$

- Harris is rotation invariant but not scale invariant.
- Characteristic scale is the scale where LoG response is extremal.
- LoG is a blob detector.
- DoG approximates LoG and is used in SIFT.
- DoG keypoint filtering:
  - reject low contrast;
  - eliminate edge responses.
- SIFT descriptor:
  
$$

  4\times4\times8=128
  
$$

- SSD vs ratio distance.
- ROC and AUC for feature matcher evaluation.
- Visual words are quantized descriptors.
- Inverted index maps visual words to images/frames.
- Spatial verification checks geometric consistency.
- BoW is a histogram over visual words.
- BoW is orderless and loses spatial information.
- Naïve Bayes assumes conditional independence of visual words given class.

---

## 54. Connections across lectures

### Local Features Part 1

Introduces motivation, requirements, and applications.

### Local Features Part 2

Develops Harris detector for local interest point detection.

### Local Features Part 3

Extends points to scale-invariant regions using LoG and DoG.

### Local Features Part 4

Builds descriptors, especially SIFT, and explains descriptor matching/evaluation.

### Object Recognition with Local Features Part 1

Uses SIFT-like local features for indexing, visual words, inverted files, and Video Google.

### Object Recognition Part 2

Uses visual words and Bag-of-Words for object categorization and image classification.

---

## 55. Unclear / underspecified sections

- [UNCLEAR] Transcript absent, so spoken explanations, exam hints, and lecturer warnings are missing.
- [UNCLEAR] The slides give the Harris approximation $E(u,v)\cong[u,v]M[u,v]^T$ but do not fully derive it from Taylor expansion.
- [UNCLEAR] Exact selection of $\sigma_I$ and $\sigma_D$ in Harris is not explained in detail.
- [UNCLEAR] LoG formula may omit normalising constants; slide form is preserved.
- [UNCLEAR] Exact scale-space neighbourhood for maxima detection is shown visually but not numerically specified.
- [UNCLEAR] DoG edge-response rejection is described via principal curvature ratio but formula is not given.
- [UNCLEAR] Threshold choices for Harris response, DoG contrast, edge rejection, and feature matching are not specified.
- [UNCLEAR] Harris-Laplace is described only at workflow level.
- [UNCLEAR] Clustering methods for visual vocabulary are named but not derived.
- [UNCLEAR] Spatial verification is described at a high level; voting thresholds and implementation details are not specified.
- [UNCLEAR] Naïve Bayes smoothing and zero-frequency handling are not covered in the slides.

---

## 56. Further reading named in slides

- D. Lowe, *Distinctive image features from scale-invariant keypoints*, IJCV 60(2), pp. 91–110, 2004.
- T. Lindeberg, *Feature detection with automatic scale selection*, IJCV 30(2), pp. 77–116, 1998.
- T. Tuytelaars and K. Mikolajczyk, *Local Invariant Feature Detectors: A Survey*, Foundations and Trends in Computer Graphics and Vision, Vol. 3, No. 3, pp. 177–280, 2008.
- J. Sivic and A. Zisserman, *Video Google: A Text Retrieval Approach to Object Matching in Videos*, ICCV 2003.
- Csurka et al., *Visual categorisation with bags of keypoints*, 2004.
