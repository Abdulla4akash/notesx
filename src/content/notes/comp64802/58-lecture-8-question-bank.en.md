---
subject: COMP64802
chapter: 58
title: "Lecture 8 — Question Bank"
language: en
---

# COMP64802 Lecture 8 — Worked Practice Question Bank

**Lecture sheet read from disk:** `COMP64802 Chapter 8 - Lecture 8.mht`  
**Topic identified from the sheet:** data clustering, K-means clustering, similarity graphs, graph Laplacians, and spectral clustering.

Use this bank by covering the solution after each question. The solutions deliberately model the written working: **Step 1**, **Step 2**, etc.

---

## Task types identified from the lecture sheet

The lecture sheet contains the following examinable task types:

1. **Recognising the clustering objective:** high intra-cluster similarity and low inter-cluster similarity.
2. **Running K-means mechanically:** choose $K$, assign points to nearest centres, update centres, repeat until memberships stop changing.
3. **Computing the K-means objective:**  
   
$$

   \sum_{k=1}^{K}\sum_{x\in C_k}\|x-\mu_k\|^2.
   
$$

4. **Diagnosing K-means limitations:** pre-chosen $K$, mean must be defined, local optima, sensitivity to initialisation, non-convex shapes, noise/outliers.
5. **Computing Gaussian-kernel similarity weights:**  
   
$$

   w_{i,j}=\exp\left(-\frac{\|x_i-x_j\|^2}{2\sigma^2}\right).
   
$$

6. **Constructing a similarity matrix $W$** and checking symmetry.
7. **Constructing a weighted graph $G=(V,E,W)$** from similarity weights.
8. **Computing node degrees and the degree matrix $D$:**  
   
$$

   d_i=\sum_j w_{i,j},\qquad D=\operatorname{diag}(d_1,\ldots,d_N).
   
$$

9. **Computing the unnormalised graph Laplacian:**  
   
$$

   L=D-W.
   
$$

10. **Using the Laplacian quadratic form:**  
    
$$

    y^\top Ly=\frac12\sum_{i,j} w_{i,j}(y_i-y_j)^2.
    
$$

11. **Using the connected-components theorem:** multiplicity of eigenvalue $0$ equals the number of connected components.
12. **Using indicator vectors of connected components** as the zero-eigenvalue eigenspace basis.
13. **Running the spectral clustering pipeline:** compute $D$, compute $L$, take first $k$ eigenvectors, form $V$, cluster rows of $V$ with K-means.
14. **Handling edge cases:** Gaussian similarities are strictly positive, weakly connected graphs are not disconnected, $K$-choice matters, K-means ties need a rule, and K-means may disagree with spectral clustering on non-convex structure.

No normalised Laplacian or normalised spectral clustering algorithm is introduced in this sheet, so those are intentionally not drilled here.

---

# Section 1 — Mechanical / single-step drills

## Q1. Recognising whether a proposed clustering has the right goal

You are given an unlabelled dataset. A proposed clustering puts nearby-looking points into the same groups and far-apart-looking points into different groups.

What two checks should you apply to decide whether this matches the lecture definition of clustering?

### Solution

**Step 1 — Check similarity within clusters.**  
For each cluster, ask: are points inside the same cluster similar to each other?

This is the **high intra-cluster similarity** check.

**Step 2 — Check similarity between clusters.**  
For different clusters, ask: are points in different clusters dissimilar from each other?

This is the **low inter-cluster similarity** check.

**Step 3 — Decide.**  
A clustering is good in the lecture sense if both conditions hold:


$$

\text{high intra-cluster similarity}
\quad\text{and}\quad
\text{low inter-cluster similarity}.

$$


**Answer:** apply the intra-cluster similarity check and the inter-cluster similarity check.

---

## Q2. K-means assignment step in one dimension

Run only the **assignment step** of K-means.

Data points:


$$

x_1=-1,\quad x_2=1,\quad x_3=8,\quad x_4=12.

$$


Current centres:


$$

\mu_1=0,\qquad \mu_2=10.

$$


Assign each point to the nearest centre.

### Solution

**Step 1 — Write the assignment rule.**  
Assign each point to the cluster whose centre has the smallest distance:


$$

\operatorname{cluster}(x)=\arg\min_k |x-\mu_k|.

$$


**Step 2 — Compute distances for $x_1=-1$.**


$$

|-1-0|=1,\qquad |-1-10|=11.

$$


So $x_1\in C_1$.

**Step 3 — Compute distances for $x_2=1$.**


$$

|1-0|=1,\qquad |1-10|=9.

$$


So $x_2\in C_1$.

**Step 4 — Compute distances for $x_3=8$.**


$$

|8-0|=8,\qquad |8-10|=2.

$$


So $x_3\in C_2$.

**Step 5 — Compute distances for $x_4=12$.**


$$

|12-0|=12,\qquad |12-10|=2.

$$


So $x_4\in C_2$.

**Answer:**


$$

C_1=\{-1,1\},\qquad C_2=\{8,12\}.

$$


---

## Q3. K-means update step in two dimensions

Run only the **centre update step**.

Current clusters:


$$

C_1=\{(0,0),(2,0),(4,0)\},

$$



$$

C_2=\{(10,2),(10,4)\}.

$$


Compute the updated cluster centres.

### Solution

**Step 1 — Write the update rule.**  
For K-means, update each centre to the mean of the points assigned to that cluster:


$$

\mu_k=\frac{1}{|C_k|}\sum_{x\in C_k}x.

$$


**Step 2 — Update $C_1$.**


$$

\mu_1
=
\frac{(0,0)+(2,0)+(4,0)}{3}
=
\left(\frac{6}{3},\frac{0}{3}\right)
=
(2,0).

$$


**Step 3 — Update $C_2$.**


$$

\mu_2
=
\frac{(10,2)+(10,4)}{2}
=
\left(\frac{20}{2},\frac{6}{2}\right)
=
(10,3).

$$


**Answer:**


$$

\mu_1=(2,0),\qquad \mu_2=(10,3).

$$


---

## Q4. Computing the K-means objective

Given


$$

C_1=\{0,2\},\quad \mu_1=1,

$$



$$

C_2=\{8,10\},\quad \mu_2=9,

$$


compute the K-means objective:


$$

\sum_{k=1}^{K}\sum_{x\in C_k}\|x-\mu_k\|^2.

$$


### Solution

**Step 1 — Write the objective.**


$$

J=\sum_{k=1}^{K}\sum_{x\in C_k}\|x-\mu_k\|^2.

$$


**Step 2 — Compute contribution from $C_1$.**


$$

(0-1)^2+(2-1)^2
=
1+1
=
2.

$$


**Step 3 — Compute contribution from $C_2$.**


$$

(8-9)^2+(10-9)^2
=
1+1
=
2.

$$


**Step 4 — Add cluster contributions.**


$$

J=2+2=4.

$$


**Answer:** the K-means objective value is


$$

4.

$$


---

## Q5. One full K-means iteration

Data points:


$$

0,\ 1,\ 4,\ 5.

$$


Initial centres:


$$

\mu_1=0,\qquad \mu_2=5.

$$


Run one full K-means iteration: assignment step, update step, then compute the objective after the update.

### Solution

**Step 1 — Assign points to nearest centres.**

For $0$:


$$

|0-0|=0,\quad |0-5|=5,

$$


so $0\in C_1$.

For $1$:


$$

|1-0|=1,\quad |1-5|=4,

$$


so $1\in C_1$.

For $4$:


$$

|4-0|=4,\quad |4-5|=1,

$$


so $4\in C_2$.

For $5$:


$$

|5-0|=5,\quad |5-5|=0,

$$


so $5\in C_2$.

Thus:


$$

C_1=\{0,1\},\qquad C_2=\{4,5\}.

$$


**Step 2 — Update centres.**


$$

\mu_1=\frac{0+1}{2}=0.5,

$$



$$

\mu_2=\frac{4+5}{2}=4.5.

$$


**Step 3 — Compute objective after update.**


$$

J
=
(0-0.5)^2+(1-0.5)^2+(4-4.5)^2+(5-4.5)^2.

$$



$$

J
=
0.25+0.25+0.25+0.25
=
1.

$$


**Answer:** after one iteration,


$$

C_1=\{0,1\},\quad C_2=\{4,5\},

$$



$$

\mu_1=0.5,\quad \mu_2=4.5,

$$


and


$$

J=1.

$$


---

## Q6. Gaussian kernel similarity

Compute the Gaussian kernel similarity between


$$

x_i=2,\qquad x_j=5,

$$


with


$$

\sigma=3.

$$


Use


$$

w_{i,j}
=
\exp\left(-\frac{\|x_i-x_j\|^2}{2\sigma^2}\right).

$$


### Solution

**Step 1 — Compute the distance.**


$$

\|x_i-x_j\|=|2-5|=3.

$$


**Step 2 — Square the distance.**


$$

\|x_i-x_j\|^2=3^2=9.

$$


**Step 3 — Compute the denominator.**


$$

2\sigma^2=2(3^2)=18.

$$


**Step 4 — Substitute into the Gaussian kernel.**


$$

w_{i,j}
=
\exp\left(-\frac{9}{18}\right)
=
\exp(-0.5).

$$


**Step 5 — Approximate if needed.**


$$

\exp(-0.5)\approx 0.6065.

$$


**Answer:**


$$

w_{i,j}\approx 0.6065.

$$


The points are moderately similar because the value is closer to $1$ than to $0$, but not extremely close to $1$.

---

## Q7. Building a Gaussian similarity matrix

Data points:


$$

x_1=0,\qquad x_2=1,\qquad x_3=3.

$$


Let


$$

\sigma=1.

$$


Build the similarity matrix $W$ using the Gaussian kernel:


$$

w_{i,j}
=
\exp\left(-\frac{\|x_i-x_j\|^2}{2\sigma^2}\right).

$$


Include the diagonal entries.

### Solution

**Step 1 — Write the formula.**

Since $\sigma=1$,


$$

w_{i,j}
=
\exp\left(-\frac{\|x_i-x_j\|^2}{2}\right).

$$


**Step 2 — Compute diagonal entries.**

For any point,


$$

\|x_i-x_i\|=0,

$$


so


$$

w_{i,i}=\exp(0)=1.

$$


Therefore:


$$

w_{1,1}=w_{2,2}=w_{3,3}=1.

$$


**Step 3 — Compute $w_{1,2}$.**


$$

\|x_1-x_2\|=|0-1|=1.

$$



$$

w_{1,2}
=
\exp\left(-\frac{1^2}{2}\right)
=
\exp(-0.5)
\approx 0.6065.

$$


By symmetry,


$$

w_{2,1}=0.6065.

$$


**Step 4 — Compute $w_{1,3}$.**


$$

\|x_1-x_3\|=|0-3|=3.

$$



$$

w_{1,3}
=
\exp\left(-\frac{3^2}{2}\right)
=
\exp(-4.5)
\approx 0.0111.

$$


By symmetry,


$$

w_{3,1}=0.0111.

$$


**Step 5 — Compute $w_{2,3}$.**


$$

\|x_2-x_3\|=|1-3|=2.

$$



$$

w_{2,3}
=
\exp\left(-\frac{2^2}{2}\right)
=
\exp(-2)
\approx 0.1353.

$$


By symmetry,


$$

w_{3,2}=0.1353.

$$


**Answer:**


$$

W
\approx
\begin{pmatrix}
1 & 0.6065 & 0.0111\\
0.6065 & 1 & 0.1353\\
0.0111 & 0.1353 & 1
\end{pmatrix}.

$$


---

## Q8. Computing degree matrix and graph Laplacian

Given the similarity matrix


$$

W=
\begin{pmatrix}
0 & 2 & 1\\
2 & 0 & 0\\
1 & 0 & 0
\end{pmatrix},

$$


compute:

1. the degree of each node,
2. the degree matrix $D$,
3. the unnormalised graph Laplacian $L=D-W$.

### Solution

**Step 1 — Compute node degrees.**

Use


$$

d_i=\sum_j w_{i,j}.

$$


For node $1$:


$$

d_1=0+2+1=3.

$$


For node $2$:


$$

d_2=2+0+0=2.

$$


For node $3$:


$$

d_3=1+0+0=1.

$$


**Step 2 — Build the degree matrix.**


$$

D=
\begin{pmatrix}
3 & 0 & 0\\
0 & 2 & 0\\
0 & 0 & 1
\end{pmatrix}.

$$


**Step 3 — Compute $L=D-W$.**


$$

L
=
\begin{pmatrix}
3 & 0 & 0\\
0 & 2 & 0\\
0 & 0 & 1
\end{pmatrix}
-
\begin{pmatrix}
0 & 2 & 1\\
2 & 0 & 0\\
1 & 0 & 0
\end{pmatrix}.

$$



$$

L
=
\begin{pmatrix}
3 & -2 & -1\\
-2 & 2 & 0\\
-1 & 0 & 1
\end{pmatrix}.

$$


**Answer:**


$$

d_1=3,\quad d_2=2,\quad d_3=1,

$$



$$

D=
\begin{pmatrix}
3 & 0 & 0\\
0 & 2 & 0\\
0 & 0 & 1
\end{pmatrix},
\qquad
L=
\begin{pmatrix}
3 & -2 & -1\\
-2 & 2 & 0\\
-1 & 0 & 1
\end{pmatrix}.

$$


---

## Q9. Computing the Laplacian quadratic form

Use the Laplacian from Q8:


$$

L=
\begin{pmatrix}
3 & -2 & -1\\
-2 & 2 & 0\\
-1 & 0 & 1
\end{pmatrix}.

$$


Let


$$

y=
\begin{pmatrix}
1\\2\\4
\end{pmatrix}.

$$


Compute $y^\top Ly$. Then verify it using


$$

y^\top Ly=\frac12\sum_{i,j}w_{i,j}(y_i-y_j)^2.

$$


### Solution

**Step 1 — Compute $Ly$.**


$$

Ly
=
\begin{pmatrix}
3 & -2 & -1\\
-2 & 2 & 0\\
-1 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
1\\2\\4
\end{pmatrix}.

$$


First row:


$$

3(1)-2(2)-1(4)=3-4-4=-5.

$$


Second row:


$$

-2(1)+2(2)+0(4)=-2+4=2.

$$


Third row:


$$

-1(1)+0(2)+1(4)=-1+4=3.

$$


So


$$

Ly=
\begin{pmatrix}
-5\\2\\3
\end{pmatrix}.

$$


**Step 2 — Compute $y^\top Ly$.**


$$

y^\top Ly
=
(1,2,4)
\begin{pmatrix}
-5\\2\\3
\end{pmatrix}
=
1(-5)+2(2)+4(3).

$$



$$

y^\top Ly=-5+4+12=11.

$$


**Step 3 — Verify using the pairwise form.**

From Q8,


$$

w_{1,2}=2,\qquad w_{1,3}=1,\qquad w_{2,3}=0.

$$


For an undirected graph, the half-sum over all $i,j$ is equivalent to summing each undirected edge once:


$$

y^\top Ly
=
2(y_1-y_2)^2+1(y_1-y_3)^2+0(y_2-y_3)^2.

$$


Substitute:


$$

=2(1-2)^2+1(1-4)^2+0(2-4)^2.

$$



$$

=2(1)+1(9)+0=11.

$$


**Answer:**


$$

y^\top Ly=11.

$$


---

# Section 2 — Multi-condition checks

## Q10. Is K-means appropriate here?

For each dataset, decide whether plain K-means is appropriate based on the lecture's stated limitations.

A. A numerical dataset with compact, blob-shaped clusters and a known value of $K$.  
B. A dataset of categorical labels only, such as colours or product types.  
C. A dataset shaped like two curved moons.  
D. A numerical dataset with many extreme outliers.  
E. A numerical dataset where the user has no idea how many clusters to choose.

### Solution

**Step 1 — Recall K-means requirements and weaknesses.**

K-means works best when:

- data are numerical enough for a mean to be defined;
- clusters are roughly centroid-shaped / convex;
- $K$ is known in advance;
- outliers do not dominate;
- local optima from bad initialisation are not too damaging.

**Step 2 — Check A.**

Numerical, compact, blob-shaped clusters, known $K$.

This matches the K-means assumptions well.

**A: appropriate.**

**Step 3 — Check B.**

Categorical labels only.

K-means needs a mean / centroid. A mean of raw categories is not naturally defined.

**B: not appropriate without extra encoding or a different method.**

**Step 4 — Check C.**

Two curved moons are non-convex.

The lecture shows this type of structure as a K-means failure case.

**C: not appropriate.**

**Step 5 — Check D.**

Many extreme outliers.

The lecture lists noisy data and outliers as weaknesses of K-means.

**D: risky / not appropriate without preprocessing or a robust method.**

**Step 6 — Check E.**

K-means requires $K$ in advance.

If the user has no idea how many clusters to choose, K-means violates the desirable property of minimal domain knowledge.

**E: not ideal.**

**Answer:**

| Case | Plain K-means? | Reason |
|---|---:|---|
| A | Yes | numerical, compact, known $K$ |
| B | No | mean not naturally defined |
| C | No | non-convex curved structure |
| D | Risky | outlier sensitivity |
| E | Not ideal | requires $K$ in advance |

---

## Q11. Has K-means converged?

At iteration $t$, the memberships are:


$$

C_1^{(t)}=\{x_1,x_2\},\qquad C_2^{(t)}=\{x_3,x_4\}.

$$


After reassigning points at iteration $t+1$, the memberships are:


$$

C_1^{(t+1)}=\{x_1,x_2\},\qquad C_2^{(t+1)}=\{x_3,x_4\}.

$$


According to the lecture algorithm, should K-means stop?

### Solution

**Step 1 — Recall the stopping rule.**

The lecture algorithm says to repeat assignment and update until none of the $N$ objects changed membership in the last iteration.

**Step 2 — Compare memberships.**

At iteration $t$:


$$

C_1=\{x_1,x_2\},\quad C_2=\{x_3,x_4\}.

$$


At iteration $t+1$:


$$

C_1=\{x_1,x_2\},\quad C_2=\{x_3,x_4\}.

$$


No object changed cluster.

**Step 3 — Apply the stopping rule.**

Since no membership changed, K-means has converged according to the algorithm.

**Answer:** yes, K-means should stop.

**Important exam warning:** convergence does not guarantee the global optimum. It only means the algorithm has reached a stable assignment, often a local optimum.

---

## Q12. Is this a valid similarity matrix for the lecture's undirected graph setup?

Consider


$$

W=
\begin{pmatrix}
0 & 2 & 3\\
1 & 0 & 4\\
3 & 4 & 0
\end{pmatrix}.

$$


Can this be used directly as the similarity matrix for an undirected weighted graph in the lecture theorem?

### Solution

**Step 1 — Recall the symmetry requirement.**

The lecture states that the similarity matrix is symmetric when


$$

w_{i,j}=s(x_i,x_j)=s(x_j,x_i)=w_{j,i}.

$$


For an undirected graph, weights should be symmetric.

**Step 2 — Check $w_{1,2}$ and $w_{2,1}$.**


$$

w_{1,2}=2,

$$


but


$$

w_{2,1}=1.

$$


These are not equal.

**Step 3 — Decide.**

The matrix is not symmetric, so it is not directly valid for the undirected graph Laplacian theorem as stated in the lecture.

**Answer:** no. It must be replaced by a symmetric similarity matrix before applying the undirected graph Laplacian results.

---

## Q13. From similarity matrix to graph components

Given


$$

W=
\begin{pmatrix}
0 & 1 & 0 & 0\\
1 & 0 & 0 & 0\\
0 & 0 & 0 & 4\\
0 & 0 & 4 & 0
\end{pmatrix},

$$


where an edge exists when $w_{i,j}>0$, find the connected components.

### Solution

**Step 1 — Identify positive weights.**

The positive off-diagonal weights are:


$$

w_{1,2}=w_{2,1}=1,

$$



$$

w_{3,4}=w_{4,3}=4.

$$


**Step 2 — Convert positive weights into edges.**

So the graph has edges:


$$

1\leftrightarrow 2,

$$



$$

3\leftrightarrow 4.

$$


There are no edges between nodes $\{1,2\}$ and nodes $\{3,4\}$.

**Step 3 — Find connected components.**

Nodes $1$ and $2$ are connected to each other.

Nodes $3$ and $4$ are connected to each other.

There is no path between these pairs.

**Answer:**


$$

C_1=\{1,2\},\qquad C_2=\{3,4\}.

$$


The graph has $2$ connected components.

---

## Q14. Connected components from Laplacian eigenvalues

A graph Laplacian has eigenvalues


$$

0,\quad 0,\quad 0,\quad 1.7,\quad 4.2.

$$


How many connected components does the graph have?

### Solution

**Step 1 — Recall the theorem.**

For an undirected graph with nonnegative weights, the algebraic multiplicity of eigenvalue $0$ equals the number of connected components.

**Step 2 — Count how many zero eigenvalues appear.**

The eigenvalues are:


$$

0,\quad 0,\quad 0,\quad 1.7,\quad 4.2.

$$


There are three zeros.

**Step 3 — Apply the theorem.**

Multiplicity of $0$ is $3$, so the graph has $3$ connected components.

**Answer:** the graph has


$$

3

$$


connected components.

---

## Q15. Indicator vectors for connected components

A graph has nodes


$$

1,2,3,4,5,6

$$


and connected components


$$

C_1=\{1,2\},\qquad C_2=\{3,4,5\},\qquad C_3=\{6\}.

$$


Write the indicator vectors for the connected components.

### Solution

**Step 1 — Recall the definition of an indicator vector.**

The indicator vector $\mathbf{1}_{C}$ has:

- entry $1$ for nodes inside component $C$;
- entry $0$ for nodes outside component $C$.

The entries follow the node order:


$$

1,2,3,4,5,6.

$$


**Step 2 — Build $\mathbf{1}_{C_1}$.**

For $C_1=\{1,2\}$, nodes $1$ and $2$ get $1$, all others get $0$:


$$

\mathbf{1}_{C_1}
=
(1,1,0,0,0,0)^\top.

$$


**Step 3 — Build $\mathbf{1}_{C_2}$.**

For $C_2=\{3,4,5\}$, nodes $3,4,5$ get $1$:


$$

\mathbf{1}_{C_2}
=
(0,0,1,1,1,0)^\top.

$$


**Step 4 — Build $\mathbf{1}_{C_3}$.**

For $C_3=\{6\}$, only node $6$ gets $1$:


$$

\mathbf{1}_{C_3}
=
(0,0,0,0,0,1)^\top.

$$


**Answer:**


$$

\mathbf{1}_{C_1}
=
(1,1,0,0,0,0)^\top,

$$



$$

\mathbf{1}_{C_2}
=
(0,0,1,1,1,0)^\top,

$$



$$

\mathbf{1}_{C_3}
=
(0,0,0,0,0,1)^\top.

$$


---

## Q16. Interpreting the Laplacian quadratic form

A graph has two weighted edges:


$$

w_{1,2}=10,\qquad w_{2,3}=1.

$$


Compare these two vectors:


$$

y=(0,10,10)^\top,

$$



$$

z=(0,0,10)^\top.

$$


Which has the smaller Laplacian quadratic form, and why?

### Solution

**Step 1 — Recall the pairwise form.**

For an undirected graph,


$$

y^\top Ly
=
\sum_{i<j} w_{i,j}(y_i-y_j)^2.

$$


Here the only edges are $1\leftrightarrow 2$ and $2\leftrightarrow 3$.

**Step 2 — Compute the penalty for $y=(0,10,10)$.**


$$

y^\top Ly
=
10(y_1-y_2)^2+1(y_2-y_3)^2.

$$



$$

=
10(0-10)^2+1(10-10)^2.

$$



$$

=
10(100)+1(0)=1000.

$$


**Step 3 — Compute the penalty for $z=(0,0,10)$.**


$$

z^\top Lz
=
10(z_1-z_2)^2+1(z_2-z_3)^2.

$$



$$

=
10(0-0)^2+1(0-10)^2.

$$



$$

=
0+100=100.

$$


**Step 4 — Compare.**


$$

100<1000.

$$


So $z$ has the smaller quadratic form.

**Answer:** $z$ is smoother on the graph because it keeps the high-weight edge $1\leftrightarrow 2$ at equal values. The Laplacian heavily penalises different values across high-similarity edges.

---

# Section 3 — Building complete workflows from scratch

## Q17. Run K-means to convergence and identify a bad local optimum

Data points:


$$

A=(0,0),\quad B=(0,2),\quad C=(8,0),\quad D=(8,2).

$$


Use $K=2$. Initial centres are:


$$

\mu_1^{(0)}=(0,0),\qquad \mu_2^{(0)}=(0,2).

$$


Run K-means until memberships stop changing. Then compare the final clustering with the more natural left/right clustering.

### Solution

**Step 1 — Assign points to initial centres.**

Initial centres:


$$

\mu_1=(0,0),\qquad \mu_2=(0,2).

$$


For $A=(0,0)$:


$$

d(A,\mu_1)=0,\qquad d(A,\mu_2)=2.

$$


So $A\in C_1$.

For $B=(0,2)$:


$$

d(B,\mu_1)=2,\qquad d(B,\mu_2)=0.

$$


So $B\in C_2$.

For $C=(8,0)$:


$$

d(C,\mu_1)=8,

$$



$$

d(C,\mu_2)=\sqrt{(8-0)^2+(0-2)^2}=\sqrt{68}\approx 8.246.

$$


So $C\in C_1$.

For $D=(8,2)$:


$$

d(D,\mu_1)=\sqrt{(8-0)^2+(2-0)^2}=\sqrt{68}\approx 8.246,

$$



$$

d(D,\mu_2)=8.

$$


So $D\in C_2$.

Thus:


$$

C_1=\{A,C\},\qquad C_2=\{B,D\}.

$$


**Step 2 — Update centres.**


$$

\mu_1
=
\frac{(0,0)+(8,0)}{2}
=
(4,0).

$$



$$

\mu_2
=
\frac{(0,2)+(8,2)}{2}
=
(4,2).

$$


**Step 3 — Reassign using updated centres.**

For $A=(0,0)$:


$$

d(A,\mu_1)=4,

$$



$$

d(A,\mu_2)=\sqrt{(0-4)^2+(0-2)^2}=\sqrt{20}\approx 4.472.

$$


So $A\in C_1$.

For $B=(0,2)$:


$$

d(B,\mu_1)=\sqrt{20}\approx 4.472,

$$



$$

d(B,\mu_2)=4.

$$


So $B\in C_2$.

For $C=(8,0)$:


$$

d(C,\mu_1)=4,

$$



$$

d(C,\mu_2)=\sqrt{20}\approx 4.472.

$$


So $C\in C_1$.

For $D=(8,2)$:


$$

d(D,\mu_1)=\sqrt{20}\approx 4.472,

$$



$$

d(D,\mu_2)=4.

$$


So $D\in C_2$.

The memberships are still:


$$

C_1=\{A,C\},\qquad C_2=\{B,D\}.

$$


**Step 4 — Stop.**

No membership changed, so K-means has converged.

**Step 5 — Compute objective of this clustering.**

For $C_1=\{A,C\}$, centre $(4,0)$:


$$

\|A-\mu_1\|^2=16,

$$



$$

\|C-\mu_1\|^2=16.

$$


For $C_2=\{B,D\}$, centre $(4,2)$:


$$

\|B-\mu_2\|^2=16,

$$



$$

\|D-\mu_2\|^2=16.

$$


Total:


$$

J=16+16+16+16=64.

$$


**Step 6 — Compare with natural left/right clustering.**

Natural left/right clusters would be:


$$

\{A,B\},\qquad \{C,D\}.

$$


Their centres would be:


$$

(0,1),\qquad (8,1).

$$


Objective:


$$

\|A-(0,1)\|^2+\|B-(0,1)\|^2+\|C-(8,1)\|^2+\|D-(8,1)\|^2.

$$


Each squared distance is $1$, so:


$$

J_{\text{left/right}}=4.

$$


**Answer:** K-means converged to


$$

\{A,C\},\qquad \{B,D\},

$$


with objective $64$. But another clustering has objective $4$. This shows the lecture warning: K-means can converge to a local optimum and is sensitive to initialisation.

---

## Q18. Build $D$, $L$, and verify connected-component indicator vectors

Consider the weighted graph with five nodes and similarity matrix


$$

W=
\begin{pmatrix}
0 & 2 & 0 & 0 & 0\\
2 & 0 & 0 & 0 & 0\\
0 & 0 & 0 & 1 & 0\\
0 & 0 & 1 & 0 & 0\\
0 & 0 & 0 & 0 & 0
\end{pmatrix}.

$$


1. Find the connected components.  
2. Compute $D$.  
3. Compute $L=D-W$.  
4. Verify that the connected-component indicator vectors lie in the zero-eigenvalue eigenspace.

### Solution

**Step 1 — Find connected components from positive weights.**

Positive edges:


$$

1\leftrightarrow 2,

$$



$$

3\leftrightarrow 4.

$$


Node $5$ has no edges.

So the connected components are:


$$

C_1=\{1,2\},\qquad C_2=\{3,4\},\qquad C_3=\{5\}.

$$


**Step 2 — Compute degrees.**


$$

d_1=2,\quad d_2=2,\quad d_3=1,\quad d_4=1,\quad d_5=0.

$$


**Step 3 — Build $D$.**


$$

D=
\begin{pmatrix}
2 & 0 & 0 & 0 & 0\\
0 & 2 & 0 & 0 & 0\\
0 & 0 & 1 & 0 & 0\\
0 & 0 & 0 & 1 & 0\\
0 & 0 & 0 & 0 & 0
\end{pmatrix}.

$$


**Step 4 — Compute $L=D-W$.**


$$

L=
\begin{pmatrix}
2 & -2 & 0 & 0 & 0\\
-2 & 2 & 0 & 0 & 0\\
0 & 0 & 1 & -1 & 0\\
0 & 0 & -1 & 1 & 0\\
0 & 0 & 0 & 0 & 0
\end{pmatrix}.

$$


**Step 5 — Write indicator vectors.**


$$

\mathbf{1}_{C_1}=(1,1,0,0,0)^\top,

$$



$$

\mathbf{1}_{C_2}=(0,0,1,1,0)^\top,

$$



$$

\mathbf{1}_{C_3}=(0,0,0,0,1)^\top.

$$


**Step 6 — Verify $L\mathbf{1}_{C_1}=0$.**


$$

L
\begin{pmatrix}
1\\1\\0\\0\\0
\end{pmatrix}
=
\begin{pmatrix}
2(1)-2(1)\\
-2(1)+2(1)\\
0\\
0\\
0
\end{pmatrix}
=
\begin{pmatrix}
0\\0\\0\\0\\0
\end{pmatrix}.

$$


**Step 7 — Verify $L\mathbf{1}_{C_2}=0$.**


$$

L
\begin{pmatrix}
0\\0\\1\\1\\0
\end{pmatrix}
=
\begin{pmatrix}
0\\
0\\
1(1)-1(1)\\
-1(1)+1(1)\\
0
\end{pmatrix}
=
\begin{pmatrix}
0\\0\\0\\0\\0
\end{pmatrix}.

$$


**Step 8 — Verify $L\mathbf{1}_{C_3}=0$.**

Since row $5$ is all zero and node $5$ is isolated,


$$

L
\begin{pmatrix}
0\\0\\0\\0\\1
\end{pmatrix}
=
0.

$$


**Answer:** the graph has three components, and the three component-indicator vectors are zero eigenvectors of $L$. Therefore eigenvalue $0$ has multiplicity $3$.

---

## Q19. Spectral clustering on an exactly disconnected graph

Suppose a graph has two connected components:


$$

C_1=\{1,2\},\qquad C_2=\{3,4\}.

$$


The first two eigenvectors of the graph Laplacian can be taken as the component indicator vectors:


$$

v_1=(1,1,0,0)^\top,

$$



$$

v_2=(0,0,1,1)^\top.

$$


Run the spectral clustering embedding step for $k=2$. What rows of $V$ are clustered by K-means, and what clusters result?

### Solution

**Step 1 — Build $V$ using $v_1$ and $v_2$ as columns.**


$$

V=
\begin{pmatrix}
| & |\\
v_1 & v_2\\
| & |
\end{pmatrix}
=
\begin{pmatrix}
1 & 0\\
1 & 0\\
0 & 1\\
0 & 1
\end{pmatrix}.

$$


**Step 2 — Interpret rows as projected data points.**

Node $1$ becomes:


$$

(1,0).

$$


Node $2$ becomes:


$$

(1,0).

$$


Node $3$ becomes:


$$

(0,1).

$$


Node $4$ becomes:


$$

(0,1).

$$


**Step 3 — Run K-means on the rows.**

Rows for nodes $1$ and $2$ are identical.

Rows for nodes $3$ and $4$ are identical.

Therefore K-means with $k=2$ separates them as:


$$

\{1,2\},\qquad \{3,4\}.

$$


**Answer:** spectral clustering exactly recovers the connected components:


$$

C_1=\{1,2\},\qquad C_2=\{3,4\}.

$$


---

## Q20. Spectral embedding using a constant vector and a split vector

A connected graph has first two relevant eigenvectors for a two-cluster spectral embedding:


$$

v_1=(0.5,0.5,0.5,0.5)^\top,

$$



$$

v_2=(-0.5,-0.5,0.5,0.5)^\top.

$$


Construct $V\in\mathbb{R}^{4\times 2}$, list the embedded row for each node, and infer the two clusters.

### Solution

**Step 1 — Build $V$ from columns $v_1$ and $v_2$.**


$$

V=
\begin{pmatrix}
0.5 & -0.5\\
0.5 & -0.5\\
0.5 & 0.5\\
0.5 & 0.5
\end{pmatrix}.

$$


**Step 2 — Read each row as the embedded point.**

Node $1$:


$$

(0.5,-0.5).

$$


Node $2$:


$$

(0.5,-0.5).

$$


Node $3$:


$$

(0.5,0.5).

$$


Node $4$:


$$

(0.5,0.5).

$$


**Step 3 — Cluster the rows.**

Nodes $1$ and $2$ have identical embedded rows.

Nodes $3$ and $4$ have identical embedded rows.

So K-means in the spectral embedding gives:


$$

C_1=\{1,2\},\qquad C_2=\{3,4\}.

$$


**Answer:** the spectral embedding separates the nodes into


$$

\{1,2\}
\quad\text{and}\quad
\{3,4\}.

$$


---

## Q21. Full spectral clustering pipeline with a supplied $W$

Given


$$

W=
\begin{pmatrix}
0 & 3 & 0 & 0\\
3 & 0 & 0 & 0\\
0 & 0 & 0 & 2\\
0 & 0 & 2 & 0
\end{pmatrix},

$$


run the spectral clustering pipeline for $k=2$, assuming the first two eigenvectors are the two component indicators:


$$

v_1=(1,1,0,0)^\top,

$$



$$

v_2=(0,0,1,1)^\top.

$$


### Solution

**Step 1 — Compute node degrees.**


$$

d_1=3,\quad d_2=3,\quad d_3=2,\quad d_4=2.

$$


**Step 2 — Construct $D$.**


$$

D=
\begin{pmatrix}
3&0&0&0\\
0&3&0&0\\
0&0&2&0\\
0&0&0&2
\end{pmatrix}.

$$


**Step 3 — Compute $L=D-W$.**


$$

L=
\begin{pmatrix}
3&-3&0&0\\
-3&3&0&0\\
0&0&2&-2\\
0&0&-2&2
\end{pmatrix}.

$$


**Step 4 — Take the first $k=2$ eigenvectors.**

The question supplies:


$$

v_1=(1,1,0,0)^\top,
\qquad
v_2=(0,0,1,1)^\top.

$$


These correspond to the two connected components.

**Step 5 — Build $V$.**


$$

V=
\begin{pmatrix}
1&0\\
1&0\\
0&1\\
0&1
\end{pmatrix}.

$$


**Step 6 — Treat rows as projected data points.**

Rows:


$$

\text{node 1}: (1,0),

$$



$$

\text{node 2}: (1,0),

$$



$$

\text{node 3}: (0,1),

$$



$$

\text{node 4}: (0,1).

$$


**Step 7 — Run K-means on rows.**

Rows $1$ and $2$ are identical, and rows $3$ and $4$ are identical.

So K-means returns:


$$

C_1=\{1,2\},\qquad C_2=\{3,4\}.

$$


**Answer:** spectral clustering returns the two connected components


$$

\{1,2\}
\quad\text{and}\quad
\{3,4\}.

$$


---

# Section 4 — Hard edge cases: methods disagree or break down

## Q22. Running example from the sheet: centre plus ring

The lecture sheet shows a central blob surrounded by a ring-shaped cluster. The ground truth is:

- one cluster = centre blob;
- another cluster = outer ring.

Explain, step by step, why K-means can fail on this structure and why spectral clustering is better motivated.

### Solution

**Step 1 — Ask what K-means assumes geometrically.**

K-means assigns points by distance to centres.

So it works best when each cluster is well represented by a centroid.

**Step 2 — Check the ring cluster.**

A ring is non-convex.

Its natural shape wraps around the centre.

A single centroid does not represent the ring well.

**Step 3 — Identify the failure.**

K-means tries to split space by nearest centre.

For a centre-plus-ring dataset, nearest-centre boundaries can cut through the ring instead of separating the ring from the central blob.

**Step 4 — Connect to the lecture limitation.**

The sheet says K-means is not suitable for some non-convex shapes.

The ring is exactly that kind of shape.

**Step 5 — Explain why spectral clustering is motivated.**

Spectral clustering builds a similarity graph.

If nearby ring points are strongly connected to neighbouring ring points, and centre points are strongly connected to other centre points, then the graph structure can capture the natural clusters better than a single centroid can.

**Answer:** K-means fails because the ring is not centroid-shaped. Spectral clustering is motivated because it clusters through graph connectivity and Laplacian eigenvectors rather than direct distance-to-centre in the original space.

---

## Q23. Running example from the sheet: two curved clusters

The lecture sheet shows two curved arc-shaped clusters, like a two-moons structure. Explain why K-means may cut the data incorrectly.

### Solution

**Step 1 — Recall the K-means assignment rule.**

K-means assigns each point to the nearest centre.

**Step 2 — Check the cluster shape.**

Each moon-shaped cluster is curved and non-convex.

The cluster is not a compact blob around a single mean.

**Step 3 — Predict what K-means does.**

K-means creates centroid-based regions.

These regions can slice across the moons rather than follow the curved structure.

**Step 4 — State the lecture lesson.**

The sheet says K-means is not suitable for non-convex clusters.

Two moons are a standard non-convex failure case.

**Answer:** K-means may separate the dataset by a centroid boundary instead of following the two arcs. The failure is caused by the mismatch between centroid-shaped clusters and curved non-convex structure.

---

## Q24. Gaussian kernel edge case: why is the graph complete?

The lecture defines an edge by


$$

w_{i,j}>0.

$$


It also gives the Gaussian kernel:


$$

w_{i,j}
=
\exp\left(-\frac{\|x_i-x_j\|^2}{2\sigma^2}\right).

$$


Assume all distances are finite and $\sigma>0$. If you use this rule literally, is there an edge between every pair of distinct data points?

### Solution

**Step 1 — Examine the Gaussian expression.**

The exponent is


$$

-\frac{\|x_i-x_j\|^2}{2\sigma^2}.

$$


For finite distances and $\sigma>0$, this is a finite real number.

**Step 2 — Use the range of the exponential.**

For any finite real number $a$,


$$

\exp(a)>0.

$$


Therefore,


$$

w_{i,j}>0

$$


for every finite pair of points.

**Step 3 — Apply the lecture edge rule.**

The lecture edge rule says there is an edge if


$$

w_{i,j}>0.

$$


Since all Gaussian similarities are positive, every pair of distinct points has an edge.

**Step 4 — State the consequence.**

The graph is complete, unless the method also introduces thresholding, sparsification, $k$-nearest-neighbour construction, or some other rule that sets some weights to zero.

Those extra rules are not part of the basic formula as stated in the sheet.

**Answer:** yes. With the literal Gaussian kernel and edge rule $w_{i,j}>0$, every finite pair has an edge, so the graph is complete.

**Exam trap:** a very small Gaussian weight is not the same as zero.

---

## Q25. Small nonzero eigenvalue is not the same as another connected component

A graph Laplacian has eigenvalues


$$

0,\quad 0.03,\quad 2.1,\quad 4.0.

$$


A student says: “There are two connected components because $0.03$ is close to zero.”

Is that correct?

### Solution

**Step 1 — Recall the exact theorem.**

The number of connected components equals the multiplicity of eigenvalue exactly equal to $0$.

**Step 2 — Count exact zeros.**

The eigenvalues are:


$$

0,\quad 0.03,\quad 2.1,\quad 4.0.

$$


Only one eigenvalue is exactly zero.

**Step 3 — Apply the theorem.**

Since the multiplicity of eigenvalue $0$ is $1$, the graph has one connected component.

**Step 4 — Interpret $0.03$.**

A small nonzero eigenvalue may indicate a weakly connected or nearly separable graph.

But it is not an exact disconnected component.

**Answer:** no. The graph has one connected component. The value $0.03$ may suggest weak cluster structure, but it is not an exact zero eigenvalue.

---

## Q26. What if spectral clustering uses the wrong $k$?

A graph has Laplacian eigenvalues


$$

0,\quad 0,\quad 0,\quad 2,\quad 5.

$$


A student runs spectral clustering with $k=2$. What is the issue?

### Solution

**Step 1 — Count connected components.**

There are three zero eigenvalues:


$$

0,\quad 0,\quad 0.

$$


So the graph has three connected components.

**Step 2 — Compare this with the chosen $k$.**

The student chooses


$$

k=2.

$$


But the graph structure says there are


$$

3

$$


exact connected components.

**Step 3 — Explain what goes wrong.**

The first three zero-eigenvalue eigenvectors span the component-indicator space.

Using only two eigenvectors gives an incomplete representation of the three components.

K-means in this incomplete embedding may merge components or produce an arbitrary two-way grouping.

**Answer:** the issue is that $k=2$ conflicts with the Laplacian spectrum, which indicates $3$ exact connected components. For exact recovery, the natural choice is $k=3$.

---

## Q27. K-means tie case

Data points:


$$

0,\quad 5,\quad 10.

$$


Initial centres:


$$

\mu_1=0,\qquad \mu_2=10.

$$


The point $5$ is exactly halfway between both centres. Show why K-means needs a tie-breaking rule.

### Solution

**Step 1 — Compute distances for the tied point.**


$$

|5-0|=5,

$$



$$

|5-10|=5.

$$


The distances are equal.

**Step 2 — Observe the ambiguity.**

The assignment rule says to choose the nearest centre.

But both centres are equally near.

So the algorithm needs a tie-breaking convention, such as:

- assign to the lower-index cluster;
- assign randomly;
- keep previous membership.

**Step 3 — Show that different tie rules change the update.**

If $5$ goes to $C_1$, then:


$$

C_1=\{0,5\},\qquad C_2=\{10\}.

$$


Updated centres:


$$

\mu_1=\frac{0+5}{2}=2.5,

$$



$$

\mu_2=10.

$$


If $5$ goes to $C_2$, then:


$$

C_1=\{0\},\qquad C_2=\{5,10\}.

$$


Updated centres:


$$

\mu_1=0,

$$



$$

\mu_2=\frac{5+10}{2}=7.5.

$$


**Answer:** K-means needs a tie-breaking rule because equal-distance points can lead to different future centres and possibly different final clusterings.

---

## Q28. Outlier effect on a K-means centre

Consider one cluster containing


$$

0,\quad 1,\quad 2,\quad 100.

$$


Compute the K-means centre and compare it with the centre without the outlier $100$. What does this show?

### Solution

**Step 1 — Compute the mean with the outlier.**


$$

\mu
=
\frac{0+1+2+100}{4}
=
\frac{103}{4}
=
25.75.

$$


**Step 2 — Compute the mean without the outlier.**

Without $100$, the data are:


$$

0,\quad 1,\quad 2.

$$



$$

\mu_{\text{no outlier}}
=
\frac{0+1+2}{3}
=
1.

$$


**Step 3 — Compare.**

With the outlier:


$$

\mu=25.75.

$$


Without the outlier:


$$

\mu=1.

$$


The outlier pulls the centre far away from the main group.

**Step 4 — Connect to the lecture limitation.**

The lecture says K-means is unable to handle noisy data and outliers well.

This example shows why: the mean is sensitive to extreme values.

**Answer:** the centre moves from $1$ to $25.75$. This demonstrates K-means sensitivity to outliers.

---

## Q29. Categorical data edge case: why “mean” breaks

Suppose the data points are categories:


$$

\text{red},\quad \text{blue},\quad \text{green},\quad \text{red}.

$$


Can plain K-means be applied directly?

### Solution

**Step 1 — Recall the K-means update.**

K-means updates each centre by computing the mean of the assigned points.

**Step 2 — Ask whether the mean is defined.**

For numerical values, a mean is defined.

For raw categories like


$$

\text{red},\quad \text{blue},\quad \text{green},

$$


there is no natural arithmetic mean.

For example,


$$

\frac{\text{red}+\text{blue}}{2}

$$


has no direct meaning.

**Step 3 — Apply the lecture limitation.**

The lecture says K-means is only applicable when the mean is defined and asks what happens for categorical data.

**Answer:** plain K-means cannot be applied directly to raw categorical data because the cluster centre / mean is not naturally defined.

---

## Q30. Self-similarity entries in a Gaussian similarity matrix

Using the Gaussian kernel, every diagonal entry satisfies


$$

w_{i,i}=1.

$$


Suppose the degree is defined as


$$

d_i=\sum_j w_{i,j}.

$$


Does the self-similarity $w_{i,i}=1$ create a penalty in the Laplacian quadratic form?

### Solution

**Step 1 — Recall the quadratic form.**


$$

y^\top Ly
=
\frac12\sum_{i,j}w_{i,j}(y_i-y_j)^2.

$$


**Step 2 — Look at a self-term.**

For $i=j$, the term is:


$$

w_{i,i}(y_i-y_i)^2.

$$


But


$$

y_i-y_i=0.

$$


So


$$

w_{i,i}(y_i-y_i)^2
=
w_{i,i}(0)^2
=
0.

$$


**Step 3 — Interpret.**

Even if $w_{i,i}=1$, it does not create a smoothness penalty because a node always has the same value as itself.

**Step 4 — Connect to $L=D-W$.**

If the self-weight is included in both $D$ and $W$, it cancels on the diagonal of $L$:


$$

d_i-w_{i,i}
=
\sum_j w_{i,j}-w_{i,i}
=
\sum_{j\ne i} w_{i,j}.

$$


**Answer:** no. Self-similarity does not add a Laplacian smoothness penalty, because $(y_i-y_i)^2=0$.

---

# Final rapid checklist

Before moving on, make sure you can do these without looking:

1. State the clustering goal: high intra-cluster similarity, low inter-cluster similarity.
2. Run one K-means assignment step.
3. Run one K-means centre-update step.
4. Compute the K-means objective.
5. Explain why convergence does not imply global optimum.
6. Diagnose K-means failure on rings and curved clusters.
7. Compute a Gaussian similarity weight.
8. Build a symmetric similarity matrix $W$.
9. Compute degrees $d_i$.
10. Build $D$.
11. Compute $L=D-W$.
12. Compute $y^\top Ly$.
13. Interpret $y^\top Ly$ as a graph smoothness penalty.
14. Count connected components from zero eigenvalue multiplicity.
15. Write connected-component indicator vectors.
16. Build $V$ from the first $k$ eigenvectors.
17. Cluster rows of $V$ using K-means.
18. Explain why Gaussian weights are positive and why this matters for graph connectivity.
19. Distinguish exact zero eigenvalues from small nonzero eigenvalues.
20. Explain why choosing the wrong $k$ can break spectral clustering.
