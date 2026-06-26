---
subject: COMP64802
chapter: 36
title: "Lecture 6 — Flashcards"
language: en
---

# Lecture 6 — Flashcards

59 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> How do you recognise high-dimensional data?</summary>

Use: Check whether each observation is described by many measured coordinates/features rather than a small hand-readable set.<br>Ask whether the feature count \(d\) is large enough to make direct inspection, coverage, or modelling difficult.<br>Reference: high-dimensional data = observations \(x_i \in \mathbb{R}^d\) with a very large number of features/variables/coordinates.

</details>

<details>
<summary><strong>Q2.</strong> How do you write a high-dimensional data point in PCA notation?</summary>

Use: Represent the \(i\)-th observation as a vector of feature values.<br>Step 1: Choose \(d\) = number of features.<br>Step 2: Write \(x_i \in \mathbb{R}^d\).<br>Step 3: Interpret each coordinate of \(x_i\) as one feature value.<br>Reference: \(x_i\) is the \(i\)-th data point and \(d\) is the data dimension.

</details>

<details>
<summary><strong>Q3.</strong> How does the curse of dimensionality affect a learning problem?</summary>

Use: When \(d\) grows, expect the input space to become sparse unless sample size grows very fast.<br>Ask: Do I have enough data to cover the space densely?<br>Consequence: coverage, density, distance intuition, and visual intuition become harder in high dimensions.<br>Reference: curse of dimensionality = volume/sample-complexity effects caused by increasing feature dimension.

</details>

<details>
<summary><strong>Q4.</strong> How do you use the hypercube volume argument for the curse of dimensionality?</summary>

Use: Compare how much space must be covered as dimension increases.<br>Step 1: Take a hypercube with side length \(s\).<br>Step 2: Its volume is \(s^d\).<br>Step 3: For fixed \(s\), volume grows exponentially in \(d\).<br>Step 4: Exponential volume growth implies exponentially more samples are needed for dense coverage.<br>Reference: high-dimensional volume grows exponentially with dimension.

</details>

<details>
<summary><strong>Q5.</strong> What lower-dimensional subspace assumption motivates PCA?</summary>

Use: Before applying PCA, ask whether most meaningful variation appears to lie along a few linear directions.<br>If yes, replace the original \(d\)-dimensional representation by a \(k\)-dimensional subspace with \(k \ll d\).<br>Reference: PCA assumes data in \(\mathbb{R}^d\) can be well approximated by a \(k\)-dimensional linear subspace \(\mathcal{S}\subset\mathbb{R}^d\).

</details>

<details>
<summary><strong>Q6.</strong> How do you recognise a dimensionality-reduction task?</summary>

Use: Look for a need to replace many original features by fewer coordinates while keeping important structure.<br>Step 1: Start with observations in \(\mathbb{R}^d\).<br>Step 2: Choose a smaller target dimension \(k\), usually \(k\ll d\).<br>Step 3: Learn/choose a mapping or projection preserving useful information.<br>Reference: dimensionality reduction = reducing input variables/features while retaining essential information.

</details>

<details>
<summary><strong>Q7.</strong> When should dimensionality reduction be used?</summary>

Use it when the original feature dimension blocks interpretation or efficiency.<br>Main uses: visualise high-dimensional data in a small plotting space; compress data; reduce noise; reduce compute cost; improve downstream modelling when redundant/noisy features exist.<br>Reference: the lecture motivates dimensionality reduction for visualisation, compression/noise reduction, and computational/performance reasons.

</details>

<details>
<summary><strong>Q8.</strong> Discriminator: linear vs non-linear dimensionality reduction methods mentioned in the lecture</summary>

Ask: Does the method search for a linear subspace/basis, or can it represent curved/nonlinear structure?<br>Linear methods mentioned: PCA, ICA, CCA.<br>Non-linear methods mentioned: Kernel PCA, t-SNE, UMAP, ISOMAP, LLE, MDS.<br>Reference: PCA is the lecture’s linear baseline before nonlinear dimensionality-reduction methods.

</details>

<details>
<summary><strong>Q9.</strong> How do you recognise representation learning?</summary>

Use: Check whether the system learns useful features/representations automatically rather than relying on manually chosen features.<br>A learned representation may be lower-dimensional, but it does not have to be.<br>Reference: representation learning = ML techniques that automatically discover the representations/features needed for a task.

</details>

<details>
<summary><strong>Q10.</strong> Discriminator: dimensionality reduction vs representation learning</summary>

Ask: Is the main goal fewer dimensions, or automatically learned useful features?<br>Dimensionality reduction: specifically reduces \(d\) to smaller \(k\) while preserving structure.<br>Representation learning: broader; learns useful features, possibly with the same, lower, or higher dimension.<br>Reference: \(\text{Dimensionality reduction}\subset\text{Representation learning}\).

</details>

<details>
<summary><strong>Q11.</strong> Which representation-learning examples were mentioned?</summary>

Use: Recognise these as examples of automatically learned representations, not necessarily PCA only.<br>Mentioned examples: dimensionality reduction/manifold learning, autoencoders, Transformer-style neural models, contrastive learning, and self-supervised learning.<br>Reference: representation learning is the broader family containing dimensionality reduction.

</details>

<details>
<summary><strong>Q12.</strong> How do you recognise PCA as the right tool?</summary>

Use PCA when you want a lower-dimensional linear representation that preserves as much variance as possible.<br>Step 1: Centre the data.<br>Step 2: Find orthogonal directions of decreasing variance.<br>Step 3: Keep the first \(k\) directions as the low-dimensional representation.<br>Reference: PCA finds principal components: new axes capturing maximum variance in a linear subspace.

</details>

<details>
<summary><strong>Q13.</strong> What assumptions must be checked before using PCA?</summary>

Use: Ask whether the data structure is approximately linear and whether high-variance directions are useful for the task.<br>Check 1: A low-dimensional linear subspace is a reasonable approximation.<br>Check 2: Variance is a good proxy for information.<br>Check 3: Orthogonal principal directions are acceptable.<br>Reference: PCA assumes meaningful information lies in a low-dimensional linear subspace and is captured by high-variance orthogonal directions.

</details>

<details>
<summary><strong>Q14.</strong> What does PCA output?</summary>

Use: Report the subspace, its basis, and the projected data.<br>Step 1: Find \(k\) principal component vectors \(v_1,\dots,v_k\).<br>Step 2: Treat their span as the learned \(k\)-dimensional subspace.<br>Step 3: Project each centred data point onto that subspace.<br>Reference: PCA goals = find a \(k\)-dimensional linear subspace, identify a suitable basis, and project data points onto it.

</details>

<details>
<summary><strong>Q15.</strong> How do you organise data into the matrix \(X\)?</summary>

Use: Put observations as rows and features as columns.<br>Step 1: For data points \(x_1,\dots,x_N\in\mathbb{R}^d\), write each transpose as one row.<br>Step 2: Form \(X=\begin{pmatrix}x_1^\top\\ \vdots\\ x_N^\top\end{pmatrix}\).<br>Step 3: Check shape: \(X\in\mathbb{R}^{N\times d}\).<br>Reference: rows = data points; columns = features; \(N\) rows and \(d\) columns.

</details>

<details>
<summary><strong>Q16.</strong> How do you centre data before PCA?</summary>

Use this as the first preprocessing step.<br>Step 1: Compute the sample mean \(\hat{\mu}=\frac{1}{N}\sum_{i=1}^N x_i\).<br>Step 2: For every observation, subtract it: \(\tilde{x}_i=x_i-\hat{\mu}\).<br>Step 3: Use the centred \(\tilde{x}_i\) in PCA.<br>Reference: centred data satisfy \(\hat{\mu}=0\).

</details>

<details>
<summary><strong>Q17.</strong> Why does PCA require centring?</summary>

Use: PCA measures variation around the dataset centre, not around an arbitrary origin.<br>If data are not centred, the origin can distort the variance directions.<br>After centring, the sample mean becomes the origin of the PCA coordinate system.<br>Reference: the sample mean is the centre of mass of the dataset and PCA uses it as the origin.

</details>

<details>
<summary><strong>Q18.</strong> How do you project a centred point \(x_i\) onto a unit direction \(v\)?</summary>

Use: Convert the point into a scalar coordinate along \(v\).<br>Step 1: Ensure \(\|v\|=1\).<br>Step 2: Compute the scalar projection \(v^\top x_i\).<br>Step 3: For a vector reconstruction along the line, use \((v^\top x_i)v\).<br>Reference: \(v^\top x_i\) is the projected coordinate of \(x_i\) on direction \(v\).

</details>

<details>
<summary><strong>Q19.</strong> How do you reconstruct \(x_i\) from a one-dimensional PCA projection?</summary>

Use: Put the scalar projection back along the unit direction.<br>Step 1: Compute \(v^\top x_i\).<br>Step 2: Multiply by the basis vector: \((v^\top x_i)v\).<br>Step 3: Residual error is \(x_i-(v^\top x_i)v\).<br>Reference: one-dimensional PCA reconstruction along \(v\) is \((v^\top x_i)v\).

</details>

<details>
<summary><strong>Q20.</strong> How do you find the first principal component by variance maximisation?</summary>

Use: Search over unit directions and choose the one with largest average squared projection.<br>Step 1: Centre the data.<br>Step 2: For each candidate unit vector \(v\), compute \(\frac{1}{N}\sum_i(v^\top x_i)^2\).<br>Step 3: Pick the maximiser.<br>Reference: \(v_1=\arg\max_{\|v\|=1}\frac{1}{N}\sum_{i=1}^N(v^\top x_i)^2\).

</details>

<details>
<summary><strong>Q21.</strong> How do you find the first principal component by reconstruction-error minimisation?</summary>

Use: Search over unit directions and choose the line giving smallest average squared residual.<br>Step 1: Centre the data.<br>Step 2: For each unit \(v\), reconstruct each point as \((v^\top x_i)v\).<br>Step 3: Compute \(\frac{1}{N}\sum_i\|x_i-(v^\top x_i)v\|^2\).<br>Step 4: Pick the minimiser.<br>Reference: \(v_1=\arg\min_{\|v\|=1}\frac{1}{N}\sum_i\|x_i-(v^\top x_i)v\|^2\).

</details>

<details>
<summary><strong>Q22.</strong> Discriminator: maximise projected variance vs minimise reconstruction error in PCA</summary>

Ask: Am I keeping spread along the projection, or reducing perpendicular residuals?<br>For centred data and unit directions, these are the same optimisation problem.<br>Max projected variance chooses the direction with largest \(\frac{1}{N}\sum_i(v^\top x_i)^2\).<br>Min reconstruction error chooses the direction with smallest \(\frac{1}{N}\sum_i\|x_i-(v^\top x_i)v\|^2\).<br>Reference: PCA variance maximisation \(\Longleftrightarrow\) reconstruction-error minimisation.

</details>

<details>
<summary><strong>Q23.</strong> How do you prove PCA variance maximisation equals reconstruction-error minimisation?</summary>

Use: Expand the squared residual and separate the part depending on \(v\).<br>Step 1: Start with \(\|x_i-(v^\top x_i)v\|^2\).<br>Step 2: Use \(\|v\|=1\) to simplify to \(\|x_i\|^2-(v^\top x_i)^2\).<br>Step 3: Average over \(i\).<br>Step 4: \(\frac{1}{N}\sum_i\|x_i\|^2\) is constant in \(v\), so minimising error means maximising projected variance.<br>Reference: \(\frac{1}{N}\sum_i\|x_i-(v^\top x_i)v\|^2=\text{constant}-\frac{1}{N}\sum_i(v^\top x_i)^2\).

</details>

<details>
<summary><strong>Q24.</strong> How do you choose the PCA projection direction from a visual sketch?</summary>

Use: Pick the line aligned with the longest spread of the centred cloud.<br>Discriminator question: Which direction makes projected points most spread out and perpendicular residuals smallest?<br>That same direction maximises variance and minimises reconstruction error.<br>Reference: first PC = unit direction of maximum projected variance / minimum reconstruction error.

</details>

<details>
<summary><strong>Q25.</strong> How do you find the second principal component after \(v_1\)?</summary>

Use: Remove what \(v_1\) already explains, then maximise variance in the remaining residuals.<br>Step 1: For each point compute residual \(r_i=x_i-(v_1^\top x_i)v_1\).<br>Step 2: Find the unit \(v\) maximising \(\frac{1}{N}\sum_i(v^\top r_i)^2\).<br>Step 3: That maximiser is \(v_2\).<br>Reference: \(v_2=\arg\max_{\|v\|=1}\frac{1}{N}\sum_i\left(v^\top(x_i-(v_1^\top x_i)v_1)\right)^2\).

</details>

<details>
<summary><strong>Q26.</strong> How do you find the \(k\)-th principal component sequentially?</summary>

Use: Remove projections onto all earlier PCs, then maximise remaining variance.<br>Step 1: Assume \(v_1,\dots,v_{k-1}\) are known.<br>Step 2: Compute residual \(r_i=x_i-\sum_{j=1}^{k-1}(v_j^\top x_i)v_j\).<br>Step 3: Choose unit \(v_k\) maximising \(\frac{1}{N}\sum_i(v^\top r_i)^2\).<br>Reference: \(v_k\) is the direction capturing the largest variance left after removing the span of previous PCs.

</details>

<details>
<summary><strong>Q27.</strong> PCA Algorithm I: how do you construct PCs sequentially?</summary>

Use this as the conceptual PCA algorithm.<br>Step 1: Centre the data.<br>Step 2: Find \(v_1\) by maximising projected variance.<br>Step 3: For each later \(v_k\), subtract projections onto \(v_1,\dots,v_{k-1}\).<br>Step 4: Maximise variance of the residuals.<br>Step 5: Return \(v_1,\dots,v_k\).<br>Reference: sequential PCA repeatedly finds the largest remaining variance direction.

</details>

<details>
<summary><strong>Q28.</strong> How do you compute the sample covariance matrix?</summary>

Use: Measure how centred features vary together.<br>Step 1: Compute \(\hat{\mu}=\frac{1}{N}\sum_i x_i\).<br>Step 2: Centre each point: \(x_i-\hat{\mu}\).<br>Step 3: Sum outer products.<br>Step 4: Divide by \(N\).<br>Reference: \(\Sigma=\frac{1}{N}\sum_{i=1}^N(x_i-\hat{\mu})(x_i-\hat{\mu})^\top\).

</details>

<details>
<summary><strong>Q29.</strong> How do you interpret an entry \(\Sigma_{j,k}\) of the covariance matrix?</summary>

Use: Read it as joint variation between feature \(j\) and feature \(k\).<br>Large positive: features tend to move together.<br>Large negative: one tends to increase when the other decreases.<br>Near zero: weak linear co-variation.<br>Reference: \(\Sigma_{j,k}=\frac{1}{N}\sum_i(x_{i,j}-\hat{\mu}_j)(x_{i,k}-\hat{\mu}_k)\).

</details>

<details>
<summary><strong>Q30.</strong> How does covariance simplify for centred data?</summary>

Use: If \(\hat{\mu}=0\), drop mean-subtraction terms.<br>Step 1: Check the data matrix \(X\) is centred.<br>Step 2: Use \(\Sigma=\frac{1}{N}\sum_i x_ix_i^\top\).<br>Step 3: In matrix form use \(\Sigma=\frac{1}{N}X^\top X\).<br>Reference: for centred data, covariance is \(\frac{1}{N}X^\top X\).

</details>

<details>
<summary><strong>Q31.</strong> How do you recognise an eigenvalue/eigenvector pair?</summary>

Use: Multiply the matrix by the vector and check whether the output only rescales the vector.<br>Step 1: Start with square matrix \(A\).<br>Step 2: Test non-zero \(v\).<br>Step 3: If \(Av=\lambda v\), then \(\lambda\) is an eigenvalue and \(v\) its eigenvector.<br>Reference: eigenpair definition = \(Av=\lambda v\) for \(v\neq0\).

</details>

<details>
<summary><strong>Q32.</strong> How do you test if \(\lambda\) is an eigenvalue using a kernel condition?</summary>

Use: Rearrange the eigenvector equation into a homogeneous linear system.<br>Step 1: Start from \(Av=\lambda v\).<br>Step 2: Rewrite as \((\lambda I-A)v=0\).<br>Step 3: Check whether \(\ker(\lambda I-A)\) contains a non-zero vector.<br>Reference: \(\lambda\) is an eigenvalue iff \(\ker(\lambda I-A)\) is nontrivial.

</details>

<details>
<summary><strong>Q33.</strong> How do you find eigenvalues using the characteristic polynomial?</summary>

Use this for pen-and-paper eigenvalue questions.<br>Step 1: Form \(\lambda I-A\).<br>Step 2: Compute \(p_A(\lambda)=\det(\lambda I-A)\).<br>Step 3: Solve \(p_A(\lambda)=0\).<br>Step 4: The roots are the eigenvalues.<br>Reference: characteristic polynomial \(p_A(\lambda)=\det(\lambda I-A)\).

</details>

<details>
<summary><strong>Q34.</strong> How do you find an eigenvector once an eigenvalue is known?</summary>

Use: Solve the nullspace equation for that eigenvalue.<br>Step 1: Substitute the known \(\lambda\).<br>Step 2: Solve \((A-\lambda I)v=0\) or equivalently \((\lambda I-A)v=0\).<br>Step 3: Choose any non-zero solution vector.<br>Step 4: Optionally normalise it if PCA needs unit vectors.<br>Reference: eigenvectors for \(\lambda\) are non-zero vectors in \(\ker(A-\lambda I)\).

</details>

<details>
<summary><strong>Q35.</strong> Why do covariance eigenvectors give PCA directions?</summary>

Use: Rewrite projected variance as a quadratic form in the covariance matrix.<br>Step 1: For centred data, \(\Sigma=\frac{1}{N}\sum_i x_ix_i^\top\).<br>Step 2: Rewrite \(\frac{1}{N}\sum_i(v^\top x_i)^2=v^\top\Sigma v\).<br>Step 3: Maximising \(v^\top\Sigma v\) over unit \(v\) gives the top eigenvector of \(\Sigma\).<br>Reference: PCs are covariance eigenvectors ordered by descending eigenvalues.

</details>

<details>
<summary><strong>Q36.</strong> PCA Algorithm II: how do you compute PCA via the covariance matrix?</summary>

Use this when asked for covariance/eigendecomposition PCA.<br>Step 1: Centre data: \(x_i\leftarrow x_i-\hat{\mu}\).<br>Step 2: Form centred \(X\) with rows \(x_i^\top\).<br>Step 3: Compute \(\Sigma=\frac{1}{N}X^\top X\) or the unnormalised \(X^\top X\).<br>Step 4: Compute eigenpairs \((\lambda_i,v_i)\).<br>Step 5: Sort \(\lambda_1\ge\lambda_2\ge\cdots\).<br>Step 6: Return \(v_1,\dots,v_k\).<br>Reference: covariance PCA returns the top \(k\) eigenvectors of the covariance-related matrix.

</details>

<details>
<summary><strong>Q37.</strong> Discriminator: \(\Sigma=\frac{1}{N}X^\top X\) vs \(X^\top X\) in PCA</summary>

Ask: Do I need principal directions only, or correctly scaled variance values?<br>For directions: either matrix gives the same eigenvectors.<br>For eigenvalues/variance: \(X^\top X\) eigenvalues are \(N\) times the covariance eigenvalues.<br>Reference: scaling by \(1/N\) changes eigenvalues but not eigenvectors.

</details>

<details>
<summary><strong>Q38.</strong> How do you recognise singular values?</summary>

Use: Look at the eigenvalues of \(X^\top X\), then take square roots.<br>Step 1: Compute/consider \(X^\top X\).<br>Step 2: If \(X^\top Xv_i=\lambda_i v_i\), define \(\sigma_i=\sqrt{\lambda_i}\).<br>Step 3: Order them descending when using SVD for PCA.<br>Reference: singular values of \(X\) are \(\sqrt{\text{eigenvalues of }X^\top X}\).

</details>

<details>
<summary><strong>Q39.</strong> What does SVD decompose a data matrix into?</summary>

Use: Factor the centred data matrix into left directions, singular values, and right directions.<br>Step 1: For \(X\in\mathbb{R}^{n\times d}\), write \(X=USV^\top\).<br>Step 2: Read shapes: \(U\in\mathbb{R}^{n\times d}\), \(S\in\mathbb{R}^{d\times d}\), \(V\in\mathbb{R}^{d\times d}\).<br>Step 3: Read diagonal entries of \(S\) as singular values \(\sigma_1\ge\cdots\ge\sigma_d\).<br>Reference: SVD in the lecture: \(X=USV^\top\), with \(S=\operatorname{diag}(\sigma_1,\dots,\sigma_d)\).

</details>

<details>
<summary><strong>Q40.</strong> Which part of SVD gives the principal components?</summary>

Use: Look at the right singular vectors.<br>Step 1: Centre \(X\).<br>Step 2: Compute \(X=USV^\top\).<br>Step 3: Take columns of \(V\) as principal component vectors.<br>Step 4: Keep the first \(k\) columns for \(k\)-dimensional PCA.<br>Reference: columns of \(V\), equivalently rows of \(V^\top\), are the principal components.

</details>

<details>
<summary><strong>Q41.</strong> PCA Algorithm III: how do you compute PCA via SVD?</summary>

Use this when asked for direct SVD PCA.<br>Step 1: Centre data: \(x_i\leftarrow x_i-\hat{\mu}\).<br>Step 2: Build centred \(X\).<br>Step 3: Compute \(X=USV^\top\).<br>Step 4: Let \(v_1,\dots,v_d\) be columns of \(V\).<br>Step 5: Return \(v_1,\dots,v_k\).<br>Reference: SVD PCA uses right singular vectors of centred \(X\) as PCs.

</details>

<details>
<summary><strong>Q42.</strong> Discriminator: covariance PCA vs SVD PCA</summary>

Ask: Am I diagonalising \(X^\top X\)/\(\Sigma\), or factorising \(X\) directly?<br>Covariance PCA: compute \(\Sigma\) or \(X^\top X\), then eigenvectors.<br>SVD PCA: compute \(X=USV^\top\), then use columns of \(V\).<br>Both return the same PC directions for centred data.<br>Reference: covariance eigenvectors and SVD right singular vectors coincide for PCA.

</details>

<details>
<summary><strong>Q43.</strong> How are eigenvalues and singular values related in PCA?</summary>

Use: Match the convention for the matrix whose eigenvalues are being used.<br>If \(\lambda_i\) is an eigenvalue of \(X^\top X\), then \(\lambda_i=\sigma_i^2\).<br>If \(\lambda_i\) is an eigenvalue of \(\Sigma=\frac{1}{N}X^\top X\), then \(\lambda_i=\frac{\sigma_i^2}{N}\).<br>Reference: singular values satisfy \(\sigma_i=\sqrt{\lambda_i}\) for eigenvalues of \(X^\top X\).

</details>

<details>
<summary><strong>Q44.</strong> How do you interpret \(\lambda_k\) in PCA?</summary>

Use: Treat the eigenvalue as variance captured in its PC direction.<br>Large \(\lambda_k\): the data vary strongly along \(v_k\).<br>Small \(\lambda_k\): little variance remains in that direction.<br>Reference: \(\lambda_k\) = data variance in the \(k\)-th principal direction.

</details>

<details>
<summary><strong>Q45.</strong> How do you compute total variance from PCA eigenvalues?</summary>

Use: Add the variance contributions from all principal directions.<br>Step 1: List eigenvalues \(\lambda_1,\dots,\lambda_d\).<br>Step 2: Sum them all.<br>Reference: total variance \(=\lambda_1+\lambda_2+\cdots+\lambda_d\).

</details>

<details>
<summary><strong>Q46.</strong> How do you compute variance captured by the top \(k\) PCs?</summary>

Use: Add the first \(k\) eigenvalues after sorting descending.<br>Step 1: Sort \(\lambda_1\ge\lambda_2\ge\cdots\ge\lambda_d\).<br>Step 2: Sum \(\lambda_1+\cdots+\lambda_k\).<br>Reference: top-\(k\) captured variance \(=\lambda_1+\cdots+\lambda_k\).

</details>

<details>
<summary><strong>Q47.</strong> How do you compute the explained variance ratio of component \(k\)?</summary>

Use: Divide that component’s eigenvalue by total variance.<br>Step 1: Compute total variance \(T=\lambda_1+\dots+\lambda_d\).<br>Step 2: Compute \(\mathrm{EVR}_k=\lambda_k/T\).<br>Reference: \(\mathrm{EVR}_k=\frac{\lambda_k}{\lambda_1+\dots+\lambda_d}\).

</details>

<details>
<summary><strong>Q48.</strong> How do you compute cumulative explained variance for the first \(k\) PCs?</summary>

Use: Divide top-\(k\) variance by total variance.<br>Step 1: Compute numerator \(\lambda_1+\dots+\lambda_k\).<br>Step 2: Compute denominator \(\lambda_1+\dots+\lambda_d\).<br>Step 3: Divide; multiply by \(100\) only if a percentage is requested.<br>Reference: cumulative EVR \(=\frac{\lambda_1+\dots+\lambda_k}{\lambda_1+\dots+\lambda_d}=\sum_{j=1}^k\mathrm{EVR}_j\).

</details>

<details>
<summary><strong>Q49.</strong> How do you solve an explained-variance percentage question?</summary>

Use the eigenvalues only; do not recompute PCs.<br>Step 1: Add all listed eigenvalues for total variance.<br>Step 2: Add the eigenvalues for the requested PCs.<br>Step 3: Compute requested sum / total sum.<br>Step 4: Multiply by \(100\) for a percentage.<br>Reference: percentage explained by first \(k\) PCs \(=100\times\frac{\lambda_1+\dots+\lambda_k}{\lambda_1+\dots+\lambda_d}\).

</details>

<details>
<summary><strong>Q50.</strong> How is PCA used for visualisation?</summary>

Use: Replace high-dimensional coordinates by a few principal-component coordinates for plotting.<br>Step 1: Centre the data.<br>Step 2: Compute PCs.<br>Step 3: Keep a small number of leading PCs.<br>Step 4: Plot data in those PC coordinates.<br>Reference: PCA can project high-dimensional data into a lower-dimensional space for visualisation.

</details>

<details>
<summary><strong>Q51.</strong> How is PCA used for compression?</summary>

Use: Store or process only leading PC coordinates instead of all original features.<br>Step 1: Compute PCs.<br>Step 2: Keep top \(k\) components.<br>Step 3: Represent each point by its \(k\) projected coordinates.<br>Step 4: Reconstruct approximately if needed using the retained subspace.<br>Reference: PCA compression keeps fewer components while preserving large-variance structure.

</details>

<details>
<summary><strong>Q52.</strong> How is PCA used for noise filtering?</summary>

Use: Treat low-variance directions as candidates for noise, then discard them carefully.<br>Step 1: Compute PCs and eigenvalues.<br>Step 2: Keep high-variance components.<br>Step 3: Drop low-variance components if they plausibly represent noise.<br>Reference: PCA can reduce noise when signal lies in leading variance directions and noise lies in discarded directions.

</details>

<details>
<summary><strong>Q53.</strong> How is PCA used as preprocessing for another ML method?</summary>

Use: Reduce feature dimension before fitting the downstream model.<br>Step 1: Fit PCA on training data after centring.<br>Step 2: Transform data into leading PC coordinates.<br>Step 3: Train the downstream model on those coordinates.<br>Step 4: Remember that PCA preserves variance, not necessarily task labels.<br>Reference: PCA can be used as data preprocessing to reduce feature dimension.

</details>

<details>
<summary><strong>Q54.</strong> Discriminator: when does PCA fail because of linearity?</summary>

Ask: Is the true structure curved rather than well approximated by a flat subspace?<br>If the meaningful geometry is nonlinear, a linear PCA subspace may cut through it and lose structure.<br>Use nonlinear dimensionality-reduction methods when a curved manifold is essential.<br>Reference: PCA is restricted to linear subspaces and can fail on essentially nonlinear manifolds.

</details>

<details>
<summary><strong>Q55.</strong> Discriminator: high variance vs task relevance</summary>

Ask: Does this high-variance direction actually contain the information needed for the task?<br>PCA keeps high-variance directions even if they are irrelevant.<br>A lower-variance direction can still contain class-separating or task-critical information.<br>Reference: PCA assumes variance indicates importance, but \(\text{Variance}\neq\text{Relevance}\).

</details>

<details>
<summary><strong>Q56.</strong> Discriminator: orthogonal PCs vs non-orthogonal latent factors</summary>

Ask: Must the learned factors be perpendicular/uncorrelated?<br>PCA forces principal components to be orthogonal.<br>If real underlying factors are not orthogonal, PCA may be an unsuitable representation.<br>Reference: PCA imposes an orthogonality restriction on principal components.

</details>

<details>
<summary><strong>Q57.</strong> How does PCA connect to representation learning?</summary>

Use: View PCA as a learned change of representation rather than just a calculation.<br>Original representation: raw feature coordinates.<br>Learned representation: coordinates along principal components.<br>Reference: PCA is a dimensionality-reduction method and therefore one form of representation learning.

</details>

<details>
<summary><strong>Q58.</strong> Which linear algebra machinery should you expect to use for PCA?</summary>

Use: Link each PCA computation to the corresponding linear algebra object.<br>Variance/covariance PCA uses covariance matrices, eigenvalues, and eigenvectors.<br>SVD PCA uses singular values and right singular vectors.<br>Explained variance uses PCA eigenvalues.<br>Reference: the lecture connects PCA to covariance, eigenvalues/eigenvectors, singular values, and SVD.

</details>

<details>
<summary><strong>Q59.</strong> How should you handle covariance/SVD normalisation ambiguity in an exam answer?</summary>

Use: State which matrix your eigenvalues belong to.<br>If using \(X^\top X\), then \(\lambda_i=\sigma_i^2\).<br>If using \(\Sigma=\frac{1}{N}X^\top X\), then \(\lambda_i=\sigma_i^2/N\).<br>Directions are unchanged by the \(1/N\) factor; variance values are scaled.<br>Reference: the lecture flags a normalisation ambiguity between \(X^\top X\) and \(\frac{1}{N}X^\top X\).

</details>
