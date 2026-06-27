---
subject: COMP64301
chapter: 10
title: "Week 10 — Stereo & Epipolar Geometry"
language: en
---

# Study Notes: Stereo Basics and Epipolar Geometry

**Topic and scope:**  
This lecture covers how 3D structure can be recovered from multiple images, especially a stereo pair. It builds from visual depth cues and the pinhole camera model to triangulation, disparity, correspondence search, epipolar geometry, rectification, the essential matrix, calibration, and applications.

**Source material:**  
- `stereo-part1.pdf` — Stereo basics and Epipolar Geometry, Part 1  
- `stereo-part2-3.pdf` — Stereo basics and Epipolar Geometry, Part 2 / 3  

**Transcript status:** slides only. Spoken-only explanations, exam warnings, and extra examples cannot be recovered, so `[UNCLEAR]` flags mark places where the slides are thin or notation is garbled.

---

## 1. Why 3D Recovery Needs Multiple Views

### 1.1 Goal: recover 3D structure

The lecture’s broad goal is **recovery of 3D structure** from images. The slides say the focus is on **perspective** and **motion**, and motivate multi-view geometry by saying that recovery of structure from one image is inherently ambiguous.

**Intuition:**  
A single 2D image point could have been produced by many possible 3D points along the same projection ray. Without extra information, one image cannot uniquely determine depth.

**Slide examples:**  
The slides use forced-perspective images: someone appearing to kick the Leaning Tower of Pisa and a person appearing tiny beside a giant pumpkin. These examples show that apparent size and depth can be misleading in a single view.

---

## 2. Visual Cues for 3D Structure

The slides list several visual cues that can help humans or vision systems infer 3D shape:

### 2.1 Shading

**Intuition:**  
Changes in brightness across a surface can suggest surface shape.

**Slide example:**  
Two face images show how shading/makeup changes perceived facial structure.

### 2.2 Texture

**Intuition:**  
Texture patterns change with depth and surface orientation. Repeated patterns can reveal surface layout.

**Slide example:**  
The “Visual Cliff” image uses a checkerboard pattern to convey depth.

### 2.3 Focus

**Intuition:**  
Blur can indicate whether parts of a scene are nearer or farther from the focal plane.

**Slide example:**  
A photography example shows different parts of a city scene in focus/blur.

### 2.4 Perspective

**Intuition:**  
Parallel or repeated structures appear to converge or shrink with distance.

**Slide example:**  
A row of buildings/houses over water demonstrates perspective depth cues.

### 2.5 Motion

**Intuition:**  
Different views of an object, or movement through a scene, reveal shape.

**Slide example:**  
The gargoyle shown from multiple viewpoints illustrates how shape becomes clearer from motion or changing viewpoint.

---

## 3. What Stereo Vision Is

### 3.1 Generic formulation

**Formal slide definition:**  
Stereo vision is: given several images of the same object or scene, compute a representation of its 3D shape.

**Intuition:**  
Multiple images from different viewpoints provide multiple projection rays. Combining them can locate where a 3D point lies.

### 3.2 Narrower binocular formulation

**Formal slide definition:**  
Given a **calibrated binocular stereo pair**, fuse it to produce a **depth image**.

This is the main version studied in the lecture: two cameras/images, known camera geometry, and the goal of producing depth or 3D structure.

### 3.3 Stereo photography and stereo viewers

The slides connect computational stereo to historical stereo viewing:

- Take two pictures of the same subject from slightly different viewpoints.
- Display them so each eye sees only one image.
- This creates a 3D perception effect.
- The slides mention Sir Charles Wheatstone, 1838, and show stereoscopic viewers and anaglyph-style images.

### 3.4 Applications introduced early

The slides mention stereo in **robotic exploration**:

- Nomad robot searching for meteorites in Antarctica.
- Real-time stereo on Mars.
- Stereo views from Viking lander.

The Mars examples are used later to show that disparity maps can reveal terrain structure even when the original images look fairly flat.

---

## 4. Camera Model: Pinhole Camera and Perspective Projection

### 4.1 Pinhole camera model

The lecture uses a **pinhole camera** model with:

- Centre of projection: $O$
- Image plane
- Focal length: $f$
- Scene point: $P(X,Y,Z)$
- Image point: $p(x,y)$

**Intuition:**  
A 3D point projects to the image plane along a ray through the camera centre.

### 4.2 Perspective transform

The slides derive perspective projection using similar triangles.

For the $x$-coordinate:

$$
\frac{x}{f} = \frac{X}{Z}
$$

so

$$
x = \frac{fX}{Z}
$$

and equivalently

$$
X = \frac{Zx}{f}
$$

Similarly for the $y$-coordinate:

$$
y = \frac{fY}{Z}
$$

and equivalently

$$
Y = \frac{Zy}{f}
$$

**Key intuition:**  
Image coordinates depend inversely on depth $Z$. Farther objects project smaller.

---

## 5. Depth with Stereo: Basic Idea

### 5.1 Triangulation

**Formal slide statement:**  
Basic principle: **triangulation**.

Triangulation gives reconstruction as the **intersection of two rays**.

It requires:

1. **Camera pose / calibration**
2. **Point correspondence**

**Intuition:**  
If the same 3D scene point is identified in two images, each image point defines a ray from its camera centre. The 3D point lies where the rays meet.

---

## 6. Simple Stereo Geometry

### 6.1 Setup

The simple stereo system assumes:

- Two cameras.
- Image planes aligned in $Y$ and $Z$.
- Parallel optical axes.
- Same focal length $f$.
- Baseline distance $b$ between camera centres.
- A 3D point $P$ with depth $Z$.
- Corresponding image points:
  - $p_l$ in the left image
  - $p_r$ in the right image
- Horizontal image coordinates:
  - $x_l$ in the left image
  - $x_r$ in the right image

The baseline $b$ is the distance between the two camera centres.

### 6.2 Disparity

**Formal slide definition:**  
Disparity is the displacement between **conjugate**, meaning corresponding, points in the left and right images.

In the simple stereo system:

$$
d = x_l - x_r
$$

where $d$ is disparity.

### 6.3 Worked derivation: depth by triangulation

The slides derive depth using similar triangles.

From the left camera:

$$
\frac{x_l}{f} = \frac{X + b/2}{Z}
$$

From the right camera:

$$
\frac{x_r}{f} = \frac{X - b/2}{Z}
$$

Subtract the right equation from the left equation:

$$
\frac{x_l}{f} - \frac{x_r}{f}
=
\frac{X + b/2}{Z} - \frac{X - b/2}{Z}
$$

$$
\frac{x_l - x_r}{f}
=
\frac{b}{Z}
$$

Rearrange for $Z$:

$$
Z = \frac{bf}{x_l - x_r}
$$

Since $x_l - x_r$ is disparity:

$$
Z = \frac{bf}{d}
$$

**Answer:**  
Depth is inversely proportional to disparity.

### 6.4 Scene coordinates from disparity

Once $Z$ is known, the slides give:

$$
X = Z\frac{x_l}{f} - \frac{b}{2}
$$

$$
Y = Z\frac{y_l}{f}
$$

So for the simple stereo system:

1. Find corresponding points.
2. Compute disparity $d = x_l - x_r$.
3. Compute depth:

$$
Z = \frac{bf}{d}
$$

4. Compute scene coordinates $X$ and $Y$.

### 6.5 Depth from disparity map

The slides show a left image $I(x,y)$, a disparity map $D(x,y)$, and a corresponding image $I'(x',y')$.

The mapping shown is:

$$
(x',y') = (x + D(x,y), y)
$$

This expresses the simple rectified case where correspondence shifts horizontally only.

---

## 7. The Correspondence Problem

### 7.1 Why reconstruction is impossible without correspondence

The slides ask: “Why is this impossible?” in the context of reconstructing from image points.

The answer given:  
Because we do not know how to make the correspondences.

**Core issue:**  
Before triangulation can happen, we need to know which point in the left image corresponds to which point in the right image.

### 7.2 Components of stereo analysis

The slides break stereo analysis into three components:

1. **Find correspondences**
   - Conjugate pairs of points.
   - Potentially hard because there are many possible pairs.

2. **Reconstruction**
   - Calculate scene coordinates $(X,Y,Z)$.
   - Easy once correspondences and calibration are known.

3. **Calibration**
   - Calculate camera parameters such as $b$, $f$, etc.

### 7.3 Assumptions for finding correspondences

The slides state two assumptions:

- Most scene points are visible in both views.
- Corresponding points are similar.

Because finding correspondences at every point is difficult, the slides introduce sparse matching at “interesting” points.

---

## 8. Epipolar Constraint in the Simple Stereo System

### 8.1 Simple-system epipolar constraint

For the simple stereo system, the match for a point $(x_l,y_l)$ lies on:

$$
y_r = y_l
$$

So the search becomes a **1D search problem** along a horizontal line.

**Intuition:**  
Instead of searching the entire right image for a match, search only along the same image row.

### 8.2 Epipolar lines

In the simple case, epipolar lines are horizontal scanlines.

The slides say the epipolar constraint will be covered in detail later. In Part 2/3, this becomes full epipolar geometry for arbitrary camera poses.

---

## 9. Matching Edges

### 9.1 Why edges are useful candidates

The slides say edges are convenient places to match because:

- They correspond to significant image structure.
- There are a small number of points to match.
- Edge polarity and direction provide cues for matching.

### 9.2 Edge polarity and direction

**Intuition:**  
If an edge goes from dark to light in one image, and has a similar orientation and polarity in the other image, it is more likely to be the same physical edge.

### 9.3 Canny detector

The slides mention the **Canny detector** and emphasise:

- Multiple-scale, coarse-to-fine search:
  - Detect edges at coarse scales first.
  - Fewer edges at coarse scale means fewer false matches.
  - Coarse results provide a starting point for search at finer scales.
- Accuracy:
  - Non-maximal suppression can locate edges to sub-pixel precision.
  - High accuracy is important for accurate depth estimation.

### 9.4 Problems with edge matching

The slides give several disadvantages:

- Image gradients at corresponding points may not be equally high.
  - Causes include shadows, occlusions, illumination differences.
- Horizontal edges are difficult to match.
  - Match points are poorly localised along epipolar lines.
- Not all significant structure lies on edges.
- Edge magnitude features may not be reliable for matching.
- Near-horizontal edges do not provide good localisation.

**Important intuition:**  
A near-horizontal edge lies roughly along the epipolar line, so sliding along the epipolar line does not change the local edge evidence much. That makes the exact match position ambiguous.

---

## 10. Correspondence by Correlation Matching

### 10.1 Motivation

The slides say:

- Similar points do not necessarily lie on salient edges.
- Corresponding points should look similar, but not identical, because viewpoints differ.

### 10.2 Cross-correlation search

The method introduced:

- Use cross-correlation to find candidate matches.
- Search is 1D along epipolar lines.
- The remaining question is: which points should be matched?

The answer given by the slides: match “interesting” points.

---

## 11. Interest Operators

### 11.1 Why interest points are needed

The slides say we need **locally distinct points**.

Problems with edge matches:

- Edge matches can be found at neighbouring points along an edge.
- Near-horizontal edges may give no reliable disparity values.

Interest operators seek **isolated distinct points**.

Examples listed:

- Moravec operator
- Corners, Harris
- LoG / DoG

The slides say Harris and LoG/DoG were already covered in previous lectures.

### 11.2 Moravec operator

**Definition from slides:**  
The Moravec operator is a non-linear filter. Over a neighbourhood, for example $5 \times 5$, it calculates sums of squared pixel differences in several directions. The output value is the **minimum** of these values. Then non-maxima of the filter output are suppressed to isolate local maxima.

**Intuition:**  
A good interest point should change strongly in multiple directions. Edges change strongly in one direction but weakly along the edge. Taking the minimum over directional changes eliminates simple edges as candidates.

### 11.3 Moravec-style directional sums

The slide shows sums of squared differences of the form:

$$
\sum \left(I(i,j) - I(i+1,j)\right)^2
$$

and related shifted versions in other directions.

Then:

$$
\text{Moravec response} = \min(\text{directional SSD values})
$$

After this:

1. Suppress non-maxima.
2. Keep local maxima as distinct points.

`[UNCLEAR]` The exact four directional shift formulas on the Moravec slide are partially garbled in the parsed text. The visual slide indicates pixel differences in several directions; the main point is clear: compute directional squared-difference sums, take their minimum, then apply non-max suppression.

---

## 12. General Epipolar Geometry

### 12.1 Why general geometry is needed

The simple stereo system assumes parallel optical axes and aligned image planes. The slides then move to the general case:

- Cameras may have arbitrary orientations.
- Image planes may not be parallel.
- The separation between optical centres may not be parallel to the image planes.
- Camera coordinate systems may differ from each other and from the scene coordinate system.

### 12.2 Stereo correspondence constraints

The key question:  
Given a point $p$ in the left image, where can the corresponding point $p'$ in the right image be?

The answer:  
It must lie on a corresponding **epipolar line**.

### 12.3 Epipolar constraint

**Formal slide statement:**  
Potential matches for $p$ must lie on the corresponding epipolar line $l'$.  
Potential matches for $p'$ must lie on the corresponding epipolar line $l$.

**Why useful:**  
The epipolar constraint reduces the correspondence problem to a **1D search along conjugate epipolar lines**.

### 12.4 Epipolar geometry terms

The slides define:

#### Baseline

**Formal definition:**  
The line joining the camera centres.

#### Epipole

**Formal definition:**  
The point of intersection of the baseline with the image plane.

#### Epipolar plane

**Formal definition:**  
The plane containing the baseline and the world point.

#### Epipolar line

**Formal definition:**  
The intersection of the epipolar plane with the image plane.

#### Additional properties

- All epipolar lines intersect at the epipole.
- An epipolar plane intersects the left and right image planes in epipolar lines.

### 12.5 Visual example

The slides show example images where points in one image correspond to green epipolar lines in another. The correspondence is not searched over the full image but along those lines.

---

## 13. General Calibrated Stereo Reconstruction

### 13.1 Coordinate systems

In the general calibrated case, the coordinate systems are related by:

- Rotation matrices:
  - $R_l$: orientation of left camera coordinate system relative to scene coordinates.
  - $R_r$: orientation of right camera coordinate system relative to scene coordinates.
- Translation vectors:
  - $T_l$: translation between left camera origin and scene origin.
  - $T_r$: translation between right camera origin and scene origin.

### 13.2 Rays in scene coordinates

The slides define image-direction vectors:

$$
p_l = (x_l, y_l, f_l)
$$

$$
p_r = (x_r, y_r, f_r)
$$

A 3D point along a projected ray can be written in scene coordinates as:

$$
P_l = T_l + a_l R_l p_l
$$

$$
P_r = T_r + a_r R_r p_r
$$

where $a_l$ and $a_r$ are scalar depths/scale factors along the rays.

The rays intersect when:

$$
T_l + a_l R_l p_l = T_r + a_r R_r p_r
$$

### 13.3 Measurement error

The slides say reconstruction is not quite that simple because measurement inaccuracies mean projected vectors will not coincide.

So instead of exact intersection:

- Find the closest points on each projected ray.
- Take the midpoint of the vector between those closest points.
- This can also be found by solving a set of linear equations.

`[UNCLEAR]` The slides mention solving linear equations but do not give the full system.

---

## 14. Essential Matrix

### 14.1 Calibrated stereo rig

For calibrated cameras, the slides say we know how to rotate and translate camera reference frame 1 to get camera reference frame 2:

- Rotation: $3 \times 3$ matrix $R$
- Translation: 3-vector $T$

The coordinate transformation is:

$$
X'_c = R X_c + T
$$

where:

- $X_c$ is the point in camera 1 coordinates.
- $X'_c$ is the same point in camera 2 coordinates.

### 14.2 Cross product recall

The slides remind us:

$$
\vec{a} \times \vec{b} = \vec{c}
$$

where $\vec{c}$ is perpendicular to both $\vec{a}$ and $\vec{b}$.

Therefore:

$$
\vec{a} \cdot \vec{c} = 0
$$

$$
\vec{b} \cdot \vec{c} = 0
$$

### 14.3 Matrix form of cross product

The cross product can be expressed as matrix multiplication:

$$
\vec{a} \times \vec{b} = [a_x]\vec{b}
$$

where

$$
[a_x] =
\begin{bmatrix}
0 & -a_3 & a_2 \\
a_3 & 0 & -a_1 \\
-a_2 & a_1 & 0
\end{bmatrix}
$$

So:

$$
\vec{a} \times \vec{b}
=
\begin{bmatrix}
0 & -a_3 & a_2 \\
a_3 & 0 & -a_1 \\
-a_2 & a_1 & 0
\end{bmatrix}
\begin{bmatrix}
b_1\\
b_2\\
b_3
\end{bmatrix}
$$

### 14.4 Worked derivation: from geometry to algebra

Start from the calibrated transformation:

$$
X' = RX + T
$$

Take cross product with $T$:

$$
T \times X' = T \times (RX + T)
$$

Expand:

$$
T \times X' = T \times RX + T \times T
$$

Since:

$$
T \times T = 0
$$

we get:

$$
T \times X' = T \times RX
$$

The vector $T \times X'$ is normal to the epipolar plane. Since $X'$ lies in that plane:

$$
X' \cdot (T \times X') = 0
$$

Using the equality above:

$$
X' \cdot (T \times RX) = 0
$$

Use the matrix form of cross product:

$$
T \times RX = [T_x]RX
$$

Therefore:

$$
X' \cdot ([T_x]RX) = 0
$$

Define the essential matrix:

$$
E = [T_x]R
$$

Then the epipolar constraint becomes:

$$
X'^T E X = 0
$$

### 14.5 Essential matrix definition

**Formal slide definition:**  
$E$ is called the **essential matrix**, and it relates corresponding image points between both cameras, given the rotation and translation.

The slides also state:

- If we observe a point in one image, its position in the other image is constrained to lie on a line defined by the above equation.
- These points are in **camera coordinate systems**.

### 14.6 Worked example: essential matrix for parallel cameras

For parallel cameras, the slides use:

$$
R = I
$$

$$
T = [-d, 0, 0]^T
$$

Then:

$$
E = [T_x]R = [T_x]
$$

The slide gives:

$$
E =
\begin{bmatrix}
0 & 0 & 0 \\
0 & 0 & d \\
0 & -d & 0
\end{bmatrix}
$$

Let:

$$
p = [x, y, f]^T
$$

$$
p' = [x', y', f]^T
$$

The epipolar equation is:

$$
p'^T E p = 0
$$

Compute:

$$
Ep =
\begin{bmatrix}
0 & 0 & 0 \\
0 & 0 & d \\
0 & -d & 0
\end{bmatrix}
\begin{bmatrix}
x\\
y\\
f
\end{bmatrix}
=
\begin{bmatrix}
0\\
df\\
-dy
\end{bmatrix}
$$

Then:

$$
p'^T Ep =
[x', y', f]
\begin{bmatrix}
0\\
df\\
-dy
\end{bmatrix}
$$

$$
= x' \cdot 0 + y'df + f(-dy)
$$

$$
= dfy' - dfy
$$

Set equal to zero:

$$
df(y' - y) = 0
$$

Assuming $d \neq 0$ and $f \neq 0$:

$$
y' = y
$$

**Answer:**  
For parallel cameras, the image of any point must lie on the same horizontal line in each image plane.

This matches the earlier simple stereo constraint:

$$
y_r = y_l
$$

---

## 15. Rectification

### 15.1 Motivation

In general camera geometry, epipolar lines can be at arbitrary angles through the epipoles. Searching along arbitrary angled lines is less convenient.

The slides state:

- Search for correspondences is a 1D search along epipolar lines.
- Search is easier if the images are rectified.

### 15.2 Definition

**Rectification:**  
Transform or warp the images so that the image planes become parallel and epipolar lines become horizontal.

The slides say that knowing $R_l$ and $R_r$, we can transform the images so that:

- Image planes are parallel.
- Epipoles are at infinity.
- Epipolar lines are parallel to the horizontal image axis.

### 15.3 Stereo image rectification

The slides describe rectification as:

- Reproject image planes onto a common plane parallel to the line between optical centres.
- Pixel motion is horizontal after this transformation.
- Use two homographies, one $3 \times 3$ transform for each input image reprojection.
- In practice, it is convenient if image scanlines, meaning rows, are the epipolar lines.

### 15.4 Visual example

The rectification example shows two images of a scene before and after warping. After rectification, corresponding points lie along horizontal scanlines, making stereo matching easier.

---

## 16. Stereo Reconstruction Pipeline

The slides repeatedly list the main steps:

1. Calibrate cameras.
2. Rectify images.
3. Compute disparity.
4. Estimate depth.

This pipeline is central.

---

## 17. Dense Correspondence Search

### 17.1 Algorithm

For each pixel in the first image:

1. Find the corresponding epipolar line in the right image.
2. Examine all pixels on the epipolar line.
3. Pick the best match, for example using SSD or correlation.
4. Triangulate the matches to get depth information.

The slides emphasise that this is easiest when epipolar lines are scanlines, so images should be rectified first.

### 17.2 Dense versus sparse

#### Dense correspondence

**Advantages:**

- Simple process.
- More depth estimates.
- Useful for surface reconstruction.

**Disadvantages:**

- Breaks down in textureless regions.
- Raw pixel distances can be brittle.
- Not good with very different viewpoints.

#### Sparse correspondence

**Advantages:**

- Efficient.
- Can have more reliable feature matches.
- Less sensitive to illumination than raw pixels.

**Disadvantages:**

- Need enough knowledge to pick good features.
- Produces sparse information.

---

## 18. Window-Based Matching

### 18.1 Example: University of Tsukuba data

The slides show:

- A scene image.
- Ground-truth depth/disparity.
- A window-based matching result.
- The best window-size result compared to ground truth.

The window-based output is visibly noisier than the ground truth, especially around object boundaries and less-textured regions.

### 18.2 Effect of window size

The slides compare:

- $W = 3$
- $W = 20$

**Slide statement:**  
Want the window large enough to have sufficient intensity variation, yet small enough to contain only pixels with about the same disparity.

### 18.3 Trade-off

Small window:

- Better at preserving local detail.
- More vulnerable to ambiguity/noise if there is not enough texture.

Large window:

- More intensity variation and more stable matching.
- Can blur over depth discontinuities because the window may include pixels with different disparities.

This is directly implied by the slide’s stated requirement: enough variation, but roughly same disparity inside the window.

---

## 19. Additional Correspondence Constraints

The slides say that beyond the hard constraint of epipolar geometry, there are “soft” constraints:

1. Similarity
2. Uniqueness
3. Ordering

### 19.1 Similarity constraint

**Slide idea:**  
Image regions for matches should be similar in appearance.

**Intuition:**  
The same physical point or local patch should look similar in both views, though not identical because of viewpoint and illumination changes.

### 19.2 Difficulties in similarity

The slides show two main problems:

#### Untextured surfaces

Untextured surfaces provide little local structure, so many candidate matches may look equally plausible.

#### Occlusions

Some scene points visible in one view may not be visible in the other.

### 19.3 Uniqueness constraint

`[UNCLEAR]` The slides list uniqueness but do not give a formal definition. In stereo matching, the intended idea is that a scene point should usually correspond to one point in the other image, but the slides do not spell this out.

### 19.4 Ordering constraint

**Formal slide statement:**  
Points on the same surface of an opaque object will be in the same order in both views.

The slides show one configuration that satisfies ordering and another that violates ordering.

### 19.5 Combined effect

The slides summarise:

- Epipolar lines constrain the search to a line.
- Appearance and ordering constraints further reduce possible matches.

---

## 20. Possible Sources of Error

The slides list:

- Low-contrast / textureless image regions.
- Occlusions.
- Camera calibration errors.
- Violations of brightness constancy, for example specular reflections.
- Large motions.

These are exactly the kinds of cases where the assumptions behind matching break down.

---

## 21. Camera Parameters and Calibration

### 21.1 Why calibration is needed

The slides say we need camera parameters:

- $R$, $T$, and $f$ to calculate triangulation.
- $d_x$, $d_y$, $f$, and $s_x/s_y$ to calculate image coordinates from pixel coordinates.

### 21.2 Extrinsic parameters

**Formal slide list:**

- Rotation matrix $R$, a $3 \times 3$ matrix with 3 free parameters.
- Translation vector:

$$
(T_x, T_y, T_z)
$$

**Intuition:**  
Extrinsic parameters describe camera pose: where the camera is and how it is oriented.

### 21.3 Intrinsic parameters

**Formal slide list:**

Intrinsic parameters relate pixel coordinates to image coordinates.

They include:

- Pixel size $(s_x, s_y)$, because pixels may not be square.
- Origin offset $(d_x, d_y)$, because the pixel origin may not be on the optic axis.
- Focal length $f$.
- The slides note these are not totally independent and list the needed quantities as:

$$
d_x,\ d_y,\ f,\ \frac{s_x}{s_y}
$$

### 21.4 Intrinsic-parameter diagram

The diagram shows:

- Pixel grid.
- Image plane.
- Grid origin.
- Image origin.
- Origin shift $d_x, d_y$.
- Pixel dimensions $s_x, s_y$.

### 21.5 Calibration target

The slides show a calibration target with square corners detected in left and right images.

**Slide statement:**  
Corners of squares can be located accurately in two directions by edge finding.

Calibration can be done if we know the scene coordinates of sufficient image points.

The calibration target provides:

- Accurately measured feature positions.
- Reliable locations in images.

### 21.6 Calibration algorithms

The slides say several algorithms exist and involve compromises between:

- Accuracy of parameter estimation.
- Robustness of parameter estimation.
- Complexity of calculation.

They mention:

- Least squares.
- Non-linear optimisations.

They also note engineering requirements of the target:

- Points on a plane.
- Points throughout a 3D volume.

---

## 22. Uncalibrated Stereo

### 22.1 Absolute versus relative 3D

The slides state:

- Calibration is necessary to determine **absolute 3D positions**.
- Without calibration, we can determine **relative 3D positions**, up to a scale factor.

### 22.2 Minimum correspondences

The slides state:

- If at least 8 correspondences in the scene are known, sufficient camera parameters can be estimated.
- Degenerate configurations should be avoided.

`[UNCLEAR]` The slides do not define “degenerate configurations” or provide the uncalibrated-estimation algorithm.

### 22.3 Human stereopsis connection

The slides include “c.f. human stereopsis,” connecting uncalibrated or relative stereo perception to human depth perception.

---

## 23. Applications

### 23.1 Stereo from Mars

The slides show stereo views from the Viking lander and a disparity map.

**Slide observation:**  
Despite the appearance of flat rocky terrain, disparity maps show a series of planes separated by gaps. This indicates a series of dunes receding from the viewer.

### 23.2 Depth for segmentation

The slides show left/right camera images, a depth image, and an edge-combination image.

**Main point:**  
Edges in disparity, combined with image edges, enhance contours found.

A second segmentation slide shows “snake” contour results:

- Original image with snake initialization.
- Final snake on original image.
- Final snake on depth image.
- Final snake on edge-combination image.
- Original image with final snake overlaid.

### 23.3 View interpolation

The slides show:

- Right image.
- Left image.
- Disparity map.
- Interpolated view result.

**Main point:**  
Given stereo images and disparity, one can synthesize intermediate or alternative views.

### 23.4 Virtual viewpoint video

The slides cite:

L. Zitnick et al., *High-quality video view interpolation using a layered representation*, SIGGRAPH 2004.

The shown pipeline includes:

- Input colour image.
- Colour-based segmentation.
- Initial disparity estimates.
- Refined disparity estimates.
- Smoothed disparity estimates.

This connects stereo reconstruction to video view interpolation and virtual camera viewpoints.

---

# Worked Derivations to Know

## A. Perspective projection

Given 3D point $P(X,Y,Z)$, focal length $f$, and image point $p(x,y)$:

$$
\frac{x}{f} = \frac{X}{Z}
$$

$$
x = \frac{fX}{Z}
$$

$$
X = \frac{Zx}{f}
$$

Similarly:

$$
y = \frac{fY}{Z}
$$

$$
Y = \frac{Zy}{f}
$$

## B. Stereo depth from disparity

Given:

$$
\frac{x_l}{f} = \frac{X+b/2}{Z}
$$

$$
\frac{x_r}{f} = \frac{X-b/2}{Z}
$$

Subtract:

$$
\frac{x_l-x_r}{f} = \frac{b}{Z}
$$

Rearrange:

$$
Z = \frac{bf}{x_l-x_r}
$$

Let disparity $d = x_l-x_r$:

$$
Z = \frac{bf}{d}
$$

Then:

$$
X = Z\frac{x_l}{f} - \frac{b}{2}
$$

$$
Y = Z\frac{y_l}{f}
$$

## C. Essential matrix derivation

Start with:

$$
X' = RX + T
$$

Take cross product with $T$:

$$
T \times X' = T \times RX + T \times T
$$

Since:

$$
T \times T = 0
$$

$$
T \times X' = T \times RX
$$

Dot with $X'$:

$$
X' \cdot (T \times RX) = 0
$$

Use matrix cross-product form:

$$
T \times RX = [T_x]RX
$$

So:

$$
X' \cdot ([T_x]RX) = 0
$$

Define:

$$
E = [T_x]R
$$

Then:

$$
X'^TEX = 0
$$

## D. Parallel-camera essential matrix example

Given:

$$
R = I
$$

$$
T = [-d,0,0]^T
$$

$$
E =
\begin{bmatrix}
0 & 0 & 0 \\
0 & 0 & d \\
0 & -d & 0
\end{bmatrix}
$$

For:

$$
p = [x,y,f]^T
$$

$$
p' = [x',y',f]^T
$$

Epipolar constraint:

$$
p'^TEp = 0
$$

leads to:

$$
y = y'
$$

So for parallel cameras, corresponding points lie on the same horizontal image line.

---

# Key Concepts Glossary

## Stereo vision

Using two or more images of the same scene/object from different viewpoints to compute 3D shape.

## Binocular stereo pair

A two-image stereo setup, often calibrated, used to produce a depth image.

## Calibration

The process of estimating camera parameters needed for triangulation and coordinate conversion.

## Intrinsic parameters

Parameters internal to the camera/image formation process, including focal length, pixel dimensions, and origin offset.

## Extrinsic parameters

Parameters describing camera pose: rotation $R$ and translation $T$.

## Baseline

Line joining the two camera centres.

## Disparity

Horizontal displacement between corresponding points in left and right images:

$$
d = x_l - x_r
$$

in the simple rectified case.

## Triangulation

Recovering a 3D point as the intersection of rays projected from corresponding image points.

## Correspondence problem

The problem of deciding which point in one image matches which point in another image.

## Epipolar constraint

A geometric constraint saying that the match for a point in one image must lie on a corresponding epipolar line in the other image.

## Epipolar plane

Plane containing the two camera centres and the 3D world point.

## Epipolar line

Intersection of the epipolar plane with an image plane.

## Epipole

Intersection of the baseline with an image plane.

## Essential matrix

Matrix

$$
E = [T_x]R
$$

that relates corresponding points between calibrated cameras:

$$
X'^TEX = 0
$$

## Rectification

Warping stereo images so that epipolar lines become horizontal scanlines.

## Dense correspondence

Matching every, or nearly every, pixel to produce a dense depth/disparity map.

## Sparse correspondence

Matching only selected features or interest points.

## Moravec operator

An interest-point detector based on directional sums of squared intensity differences, taking the minimum response and applying non-max suppression.

---

# Exam Flags / High-Value Slide Emphasis

No spoken transcript means I cannot recover lecturer-only “this is on the exam” comments. From the slides, these are the clear high-value items:

- **Know the stereo reconstruction pipeline:** calibrate cameras → rectify images → compute disparity → estimate depth.
- **Know the disparity-depth equation:**

$$
Z = \frac{bf}{x_l-x_r}
$$

- **Know that correspondence is the hard part.** Reconstruction is easy once correspondence and calibration are known.
- **Know the epipolar constraint:** corresponding points lie on conjugate epipolar lines, reducing search to 1D.
- **Know the epipolar geometry terms:** baseline, epipole, epipolar plane, epipolar line.
- **Know why rectification helps:** it turns epipolar lines into horizontal scanlines.
- **Know the essential matrix equation:**

$$
E = [T_x]R
$$

$$
X'^TEX = 0
$$

- **Know the parallel-camera result:** corresponding points lie on the same horizontal line,

$$
y = y'
$$

- **Explicit slide importance:** high accuracy in edge localisation is important for accurate depth estimation.
- **Know matching failure cases:** textureless regions, occlusions, calibration errors, brightness constancy violations, specular reflections, and large motions.
- **Know dense vs sparse trade-offs:** dense gives more depth estimates but struggles in textureless regions; sparse can be more reliable but gives sparse information.

---

# Connections Across the Lecture

- **Single-view ambiguity → multi-view geometry:** The early visual cue slides motivate why stereo/multiple views are needed.
- **Pinhole camera → triangulation:** Perspective projection equations become the basis for recovering depth from corresponding image points.
- **Correspondence problem → epipolar geometry:** Since matching is hard, epipolar geometry reduces the search space.
- **Simple stereo → general stereo:** The simple result $y_r=y_l$ becomes the general epipolar line constraint.
- **Epipolar geometry → rectification:** Rectification makes the general case behave more like the simple parallel-camera case.
- **Disparity → applications:** Once disparity/depth is recovered, it supports segmentation, view interpolation, robotic exploration, Mars terrain understanding, and virtual viewpoint video.

---

# Unclear Sections to Revisit

- `[UNCLEAR]` Moravec operator exact shift formulas: the slide image shows directional squared differences, but the parsed text is garbled. The concept is clear: compute directional SSD values over a neighbourhood, take the minimum, then suppress non-maxima.
- `[UNCLEAR]` General stereo reconstruction linear system: the slides state closest-point midpoint can be found by solving linear equations, but do not show the full system.
- `[UNCLEAR]` Uniqueness constraint: listed as an additional correspondence constraint, but not formally defined in the slides.
- `[UNCLEAR]` Degenerate configurations in uncalibrated stereo: mentioned but not explained.
- `[UNCLEAR]` Uncalibrated stereo algorithm: slides say 8 correspondences are enough to estimate sufficient parameters, but do not derive the method.
