---
subject: COMP64802
chapter: 37
title: "Lecture 7 — Flashcards"
language: en
---

# Lecture 7 — Flashcards

74 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> When should you recognise a problem as Independent Component Analysis (ICA)?</summary>

Use ICA when the observations are mixtures and the target variables are hidden source signals.<br>Check: do you only observe mixtures, not the original sources or mixing process? If yes, frame it as blind source separation.<br>Reference: ICA decomposes a multivariate signal into additive, statistically independent, non-Gaussian components.

</details>

<details>
<summary><strong>Q2.</strong> How do you recognise blind source separation?</summary>

Look for hidden sources $s_1,\ldots,s_n$ and observed mixtures $x_1,\ldots,x_m$.<br>Your task is not ordinary prediction; it is to recover/estimate the hidden sources from mixtures alone.<br>Reference: in this lecture, $x$ is observed, while $A$ and $s$ are unknown.

</details>

<details>
<summary><strong>Q3.</strong> ICA: what are the source assumptions you must check first?</summary>

Before applying ICA, ask: are the source components intended to be statistically independent and non-Gaussian?<br>If the sources are Gaussian, the lecture's ICA setup does not apply.<br>Reference: $s_1,\ldots,s_n$ are assumed statistically independent with non-Gaussian distributions.

</details>

<details>
<summary><strong>Q4.</strong> How do you set up the source vector in ICA notation?</summary>

List the hidden sources as components, then stack them into one vector.<br>Use: $s=(s_1,\ldots,s_n)^\top \in \mathbb{R}^n$.<br>Reference: the source vector contains the independent components to be estimated.

</details>

<details>
<summary><strong>Q5.</strong> How do you set up the observed mixture vector in ICA notation?</summary>

List the observed mixtures, then stack them into one vector.<br>Use: $x=(x_1,\ldots,x_m)^\top \in \mathbb{R}^m$.<br>Reference: only $x_1,\ldots,x_m$ are observed in the basic ICA setting.

</details>

<details>
<summary><strong>Q6.</strong> How do you write the ICA linear mixing model?</summary>

Step 1: stack hidden sources into $s$.<br>Step 2: stack observed mixtures into $x$.<br>Step 3: write mixtures as a linear transform of sources: $x=As$.<br>Reference: $A\in\mathbb{R}^{m\times n}$ is the mixing matrix.

</details>

<details>
<summary><strong>Q7.</strong> What does the mixing matrix do in ICA?</summary>

Use $A$ to encode how each observed mixture is built from the hidden sources.<br>Each row gives the weights for one observed mixture; each column corresponds to one source's contribution across mixtures.<br>Reference: $x=As$, with $A\in\mathbb{R}^{m\times n}$.

</details>

<details>
<summary><strong>Q8.</strong> In ICA, what is observed and what is estimated?</summary>

Observed: the mixture vector/data $x$.<br>Estimated: the hidden source vector $s$, and usually the unknown mixing/unmixing relation.<br>Reference: $x$ is the left-hand side of $x=As$; $A$ and $s$ are unknown.

</details>

<details>
<summary><strong>Q9.</strong> How do you interpret unmixing in ICA?</summary>

Use unmixing as the inverse-style step: transform observed mixtures into estimated sources.<br>Write $\hat{s}=Wx$. Choose $W$ so the components of $\hat{s}$ become as statistically independent as possible.<br>Reference: $W$ is the unmixing matrix.

</details>

<details>
<summary><strong>Q10.</strong> What optimisation objective distinguishes ICA from PCA?</summary>

Discriminator: Are you maximising independence or variance?<br>ICA: choose $W$ to maximise statistical independence of $\hat{s}=Wx$.<br>PCA: choose directions that maximise variance.<br>Reference: ICA optimises independence, PCA optimises variance.

</details>

<details>
<summary><strong>Q11.</strong> When does the lecture assume equal numbers of mixtures and sources?</summary>

Use the square-case simplification when the derivation assumes the number of observations equals the number of sources.<br>Check: $m=n$.<br>Reference: this is the simplifying assumption used for the ICA derivation in the slides.

</details>

<details>
<summary><strong>Q12.</strong> How do you form the ICA data matrix from observed mixture samples?</summary>

Step 1: take observations $x_1,\ldots,x_N\in\mathbb{R}^m$.<br>Step 2: put each observation as a row: $X=(x_1^\top;\ldots;x_N^\top)$.<br>Step 3: record the shape $X\in\mathbb{R}^{N\times m}$.<br>Reference: rows are data points; columns are observed mixture coordinates.

</details>

<details>
<summary><strong>Q13.</strong> How do you recognise a whitened signal condition?</summary>

Check whether second-order structure has been normalised away.<br>Use: components have zero cross-correlation and unit variance, so the second-moment/covariance matrix is identity.<br>Reference: the lecture writes the whitened-source condition as $\mathbb{E}[ss^\top]=I$.

</details>

<details>
<summary><strong>Q14.</strong> Whitening vs independence: what is the discriminator?</summary>

Discriminator: Does the condition remove only second-order correlation, or full statistical dependence?<br>Whitening gives uncorrelated unit-variance components; independence is stronger and is the ICA target.<br>Reference: independent components are uncorrelated, but uncorrelated components need not be independent.

</details>

<details>
<summary><strong>Q15.</strong> When is $\mathbb{E}[ss^\top]$ literally a covariance matrix?</summary>

Check whether the signal is centred/zero-mean.<br>If $\mathbb{E}[s]=0$, then $\mathbb{E}[ss^\top]$ is the covariance matrix.<br>Reference: the notes flag that the slide's covariance interpretation depends on centering/zero mean.

</details>

<details>
<summary><strong>Q16.</strong> How do you derive $WW^\top$ from the SVD of the ICA unmixing matrix?</summary>

Step 1: write $W=USV^\top$.<br>Step 2: compute $WW^\top=USV^\top(USV^\top)^\top$.<br>Step 3: expand transpose: $(USV^\top)^\top=VS^\top U^\top$.<br>Step 4: use $V^\top V=I$.<br>Step 5: get $WW^\top=USS^\top U^\top=US^2U^\top$.<br>Reference: this is the SVD step used in the slide derivation.

</details>

<details>
<summary><strong>Q17.</strong> How do you compare ICA's $WW^\top$ expression with an eigendecomposition?</summary>

Step 1: write $WW^\top=US^2U^\top$.<br>Step 2: write $X^\top X=QDQ^\top$.<br>Step 3: if the slide assumption $X^\top X=WW^\top$ is used, match factors: $U=Q$, $S^2=D$.<br>Step 4: conclude $S=D^{1/2}$.<br>Reference: the slide obtains $W=QD^{1/2}V^\top$.

</details>

<details>
<summary><strong>Q18.</strong> What remains after the ICA SVD/EVD comparison?</summary>

After matching $U$ and $S$, the unknown part is the orthogonal matrix $V$.<br>So the remaining search is over rotations/projections that maximise independence.<br>Reference: the slides call the remaining task projection pursuit.

</details>

<details>
<summary><strong>Q19.</strong> How should you treat the slide claim $X^\top X=WW^\top$?</summary>

Use it only as a slide-stated step, not as a generally justified identity unless extra assumptions are provided.<br>In a derivation, explicitly say: under the slide's stated equality, compare eigendecompositions.<br>Reference: the notes mark this equality as transcript-dependent/unclear.

</details>

<details>
<summary><strong>Q20.</strong> How do you compute kurtosis for a random variable?</summary>

Step 1: subtract the mean $\mu$.<br>Step 2: divide by the standard deviation $\sigma$.<br>Step 3: raise to the fourth power and take expectation.<br>Reference: $\kappa=\mathbb{E}[((X-\mu)/\sigma)^4]$.

</details>

<details>
<summary><strong>Q21.</strong> How do you compute excess kurtosis?</summary>

Compute kurtosis, then subtract the Gaussian benchmark.<br>Use: excess kurtosis $=\kappa-3$.<br>Reference: Gaussian variables have $\kappa=3$, so excess kurtosis measures departure from that benchmark.

</details>

<details>
<summary><strong>Q22.</strong> How do you classify a distribution using excess kurtosis?</summary>

Step 1: compute $\kappa-3$.<br>Step 2: compare with zero.<br>If $=0$: mesokurtic; if $>0$: leptokurtic; if $<0$: platykurtic.<br>Reference: the lecture uses excess kurtosis as a non-Gaussianity measure.

</details>

<details>
<summary><strong>Q23.</strong> Mesokurtic vs leptokurtic vs platykurtic: what is the discriminator?</summary>

Discriminator: the sign of excess kurtosis.<br>Mesokurtic: $\kappa-3=0$, Gaussian-like peak/tails.<br>Leptokurtic: $\kappa-3>0$, fat tails.<br>Platykurtic: $\kappa-3<0$, thin tails.<br>Reference: these are the slide categories for kurtosis.

</details>

<details>
<summary><strong>Q24.</strong> How do you use kurtosis inside ICA reasoning?</summary>

Use kurtosis/excess kurtosis to detect non-Gaussianity of candidate components.<br>If a candidate component looks Gaussian by kurtosis, it is not useful for the lecture's ICA assumption.<br>Reference: ICA requires non-Gaussian source signals.

</details>

<details>
<summary><strong>Q25.</strong> When is the lecture's basic ICA model invalid?</summary>

Check four failure points: Gaussian sources, nonlinear mixing, more sources than observations, or additive noise in the simple model.<br>If any holds, the basic clean linear ICA setup is not enough.<br>Reference: the lecture lists no Gaussian sources, no nonlinear mixture, source-count limit, and noise-free assumption.

</details>

<details>
<summary><strong>Q26.</strong> How many sources can basic ICA recover according to the lecture?</summary>

Count observed mixtures first.<br>The setup can recover at most as many sources as there are observations: recoverable sources $\leq m$.<br>Reference: with $m$ observed mixed signals, the lecture says you cannot recover more than $m$ sources.

</details>

<details>
<summary><strong>Q27.</strong> How do you recognise when the basic ICA model needs a noisy extension?</summary>

Check whether observations include additive noise beyond the linear mixture.<br>Clean model: $x=As$. Noisy model: $x=As+n$.<br>Reference: the lecture says the additive-noise version exists but needs more work.

</details>

<details>
<summary><strong>Q28.</strong> ICA vs PCA: what is the fastest discriminator?</summary>

Ask: is the goal separation into independent sources or dimension reduction by variance?<br>ICA: signal separation, independent non-Gaussian components, independence maximisation.<br>PCA: dimension reduction, orthogonal directions, variance maximisation, Gaussian data allowed.<br>Reference: this is the lecture's ICA/PCA comparison.

</details>

<details>
<summary><strong>Q29.</strong> When is Kernel PCA motivated instead of ordinary linear PCA?</summary>

Use Kernel PCA when the important structure is not well captured by linear directions/subspaces in input space.<br>Method idea: embed data into another space, then apply PCA-like operations there using kernels.<br>Reference: Kernel PCA is presented as a nonlinear extension of PCA.

</details>

<details>
<summary><strong>Q30.</strong> How do you build the data matrix for PCA-style methods?</summary>

Step 1: take data points $x_1,\ldots,x_N\in\mathbb{R}^d$.<br>Step 2: store each point as a row: $X=(x_1^\top;\ldots;x_N^\top)$.<br>Step 3: record shape $X\in\mathbb{R}^{N\times d}$.<br>Reference: rows are samples; columns are features.

</details>

<details>
<summary><strong>Q31.</strong> How do you compute the sample covariance matrix?</summary>

Step 1: compute the sample mean $\hat{\mu}=N^{-1}\sum_i x_i$.<br>Step 2: subtract it from each point.<br>Step 3: sum outer products and divide by $N$.<br>Reference: $\Sigma=N^{-1}\sum_i(x_i-\hat{\mu})(x_i-\hat{\mu})^\top$.

</details>

<details>
<summary><strong>Q32.</strong> What does covariance become when the data are already centred?</summary>

If $\hat{\mu}=0$, skip the subtraction step.<br>Use: $\Sigma=N^{-1}\sum_i x_ix_i^\top=N^{-1}X^\top X$.<br>Reference: for centred data, covariance is proportional to $X^\top X$.

</details>

<details>
<summary><strong>Q33.</strong> How do you prove $X^\top X=\sum_i x_ix_i^\top$?</summary>

Step 1: write $X$ with rows $x_i^\top$.<br>Step 2: write $X^\top$ as block columns $(x_1,\ldots,x_N)$.<br>Step 3: multiply blockwise.<br>Step 4: obtain $x_1x_1^\top+\cdots+x_Nx_N^\top$.<br>Reference: $X^\top X=\sum_{i=1}^N x_ix_i^\top$.

</details>

<details>
<summary><strong>Q34.</strong> How do you perform linear PCA via covariance EVD?</summary>

Step 1: centre the data: $x_i\leftarrow x_i-\hat{\mu}$.<br>Step 2: form centred $X$.<br>Step 3: compute $\Sigma'=X^\top X$ or $\Sigma=N^{-1}X^\top X$.<br>Step 4: compute eigenpairs $(\lambda_i,v_i)$.<br>Step 5: sort $\lambda_1\geq\lambda_2\geq\cdots$.<br>Step 6: return $v_1,\ldots,v_k$.<br>Reference: principal component vectors are covariance eigenvectors.

</details>

<details>
<summary><strong>Q35.</strong> Why does using $X^\top X$ instead of $N^{-1}X^\top X$ not change PCA directions?</summary>

Multiplying a matrix by a positive scalar rescales eigenvalues but leaves eigenvectors unchanged.<br>So $X^\top X$ and $N^{-1}X^\top X$ give the same principal component directions.<br>Reference: the lecture notes this scaling changes eigenvalues by a factor of $N$, not eigenvectors.

</details>

<details>
<summary><strong>Q36.</strong> How do you identify the $k$-th principal component in covariance PCA?</summary>

Sort covariance eigenvalues from largest to smallest.<br>The $k$-th principal component is the eigenvector associated with the $k$-th largest eigenvalue.<br>Reference: PCA basis vectors/principal component vectors are eigenvectors of $\Sigma$.

</details>

<details>
<summary><strong>Q37.</strong> How do you prove $XX^\top$ is the Gram matrix?</summary>

Step 1: use row $j$ of $X$, which is $x_j^\top$.<br>Step 2: use column $k$ of $X^\top$, which is $x_k$.<br>Step 3: compute entry $(XX^\top)_{jk}=x_j^\top x_k$.<br>Reference: the Gram matrix stores all pairwise dot products.

</details>

<details>
<summary><strong>Q38.</strong> How do you perform linear PCA via SVD?</summary>

Step 1: centre the data.<br>Step 2: form centred $X$.<br>Step 3: compute $X=USV^\top$.<br>Step 4: take the columns $v_1,\ldots,v_d$ of $V$.<br>Step 5: return $v_1,\ldots,v_k$.<br>Reference: PCA basis vectors are the columns of $V$ from the SVD of centred $X$.

</details>

<details>
<summary><strong>Q39.</strong> How do singular vector equations work?</summary>

Use paired equations to connect left and right singular vectors.<br>Given $u\in\mathbb{R}^N$, $v\in\mathbb{R}^d$, and $\sigma>0$: $Xv=\sigma u$ and $X^\top u=\sigma v$.<br>Reference: these are the singular vector equations in the lecture.

</details>

<details>
<summary><strong>Q40.</strong> How do you show a right singular vector is an eigenvector of $X^\top X$?</summary>

Step 1: start with $Xv=\sigma u$.<br>Step 2: left-multiply by $X^\top$: $X^\top Xv=\sigma X^\top u$.<br>Step 3: substitute $X^\top u=\sigma v$.<br>Step 4: get $X^\top Xv=\sigma^2v$.<br>Reference: $v$ is an eigenvector of $X^\top X$ with eigenvalue $\sigma^2$.

</details>

<details>
<summary><strong>Q41.</strong> How do you show a left singular vector is an eigenvector of $XX^\top$?</summary>

Step 1: start with $X^\top u=\sigma v$.<br>Step 2: left-multiply by $X$: $XX^\top u=\sigma Xv$.<br>Step 3: substitute $Xv=\sigma u$.<br>Step 4: get $XX^\top u=\sigma^2u$.<br>Reference: $u$ is an eigenvector of $XX^\top$ with eigenvalue $\sigma^2$.

</details>

<details>
<summary><strong>Q42.</strong> What is the relationship between singular values and eigenvalues?</summary>

Square the singular value to get the corresponding eigenvalue.<br>For paired singular vectors: eigenvalue of $X^\top X$ or $XX^\top$ is $\sigma^2$.<br>Reference: both eigenvector relationships in the lecture use eigenvalue $\sigma^2$.

</details>

<details>
<summary><strong>Q43.</strong> What shapes should you track in the lecture's SVD setup?</summary>

For $X\in\mathbb{R}^{N\times d}$, the lecture uses $X=USV^\top$.<br>Track: $U\in\mathbb{R}^{N\times d}$, $S\in\mathbb{R}^{d\times d}$, $V\in\mathbb{R}^{d\times d}$.<br>Reference: columns of $U$ are orthonormal in $\mathbb{R}^N$; columns of $V$ form an orthonormal basis of $\mathbb{R}^d$.

</details>

<details>
<summary><strong>Q44.</strong> How should you treat the claim that all singular values are positive?</summary>

Use it in the full-rank setting, but flag rank-deficient cases.<br>If rank deficient, some singular values may be zero, so positivity is not automatic.<br>Reference: the notes mark the all-positive statement as dependent on a full-rank assumption.

</details>

<details>
<summary><strong>Q45.</strong> How do you construct the Gram matrix?</summary>

Step 1: take data points $x_1,\ldots,x_N$.<br>Step 2: fill entry $(i,j)$ with $x_i^\top x_j$.<br>Step 3: equivalently compute $G=XX^\top$.<br>Reference: $G\in\mathbb{R}^{N\times N}$ stores pairwise inner products.

</details>

<details>
<summary><strong>Q46.</strong> How do you centre a Gram matrix without explicitly writing centred data?</summary>

Apply the double-centering formula.<br>Use: $\tilde{G}=G-N^{-1}\mathbf{1}G-N^{-1}G\mathbf{1}+N^{-2}\mathbf{1}G\mathbf{1}$.<br>Reference: $\mathbf{1}$ is the $N\times N$ all-ones matrix.

</details>

<details>
<summary><strong>Q47.</strong> $\mathbf{1}$ vs $I$: what is the discriminator in Gram centering?</summary>

Discriminator: all entries one, or diagonal ones only?<br>$\mathbf{1}$: all-ones matrix used for centering.<br>$I$: identity matrix with ones only on the diagonal.<br>Reference: the lecture explicitly warns $\mathbf{1}
eq I$.

</details>

<details>
<summary><strong>Q48.</strong> How do you perform linear PCA via the centred Gram matrix?</summary>

Step 1: construct $G=XX^\top$.<br>Step 2: centre it to get $\tilde{G}$.<br>Step 3: apply EVD to $\tilde{G}$.<br>Step 4: sort $\lambda_1\geq\cdots\geq\lambda_N\geq0$.<br>Step 5: choose the top $k$ eigenvalues/eigenvectors.<br>Reference: this is the Gram-matrix formulation of linear PCA.

</details>

<details>
<summary><strong>Q49.</strong> What is the key warning about Gram-matrix PCA eigenvectors?</summary>

Do not confuse Gram eigenvectors with directions in the original feature space.<br>They live in $\mathbb{R}^N$, because $\tilde{G}$ is $N\times N$.<br>Reference: the lecture warns these eigenvectors are not directly in data space.

</details>

<details>
<summary><strong>Q50.</strong> Covariance PCA vs Gram PCA: what is the discriminator?</summary>

Discriminator: are you decomposing a $d\times d$ feature covariance matrix or an $N\times N$ sample-similarity matrix?<br>Covariance PCA: EVD of $X^\top X$, eigenvectors in data/feature space.<br>Gram PCA: EVD of $XX^\top$, eigenvectors in sample-coordinate space $\mathbb{R}^N$.<br>Reference: Kernel PCA follows the Gram-matrix style.

</details>

<details>
<summary><strong>Q51.</strong> How do you recognise a feature map in Kernel PCA?</summary>

Look for a function that sends original inputs into another space before inner products are taken.<br>Use notation: $\phi:\mathcal{X}\to H$.<br>Reference: a feature map embeds data into a Hilbert space/feature space.

</details>

<details>
<summary><strong>Q52.</strong> How do you use a feature map to define a kernel?</summary>

Step 1: map both inputs: $x\mapsto\phi(x)$, $y\mapsto\phi(y)$.<br>Step 2: take the feature-space inner product.<br>Step 3: define $\kappa(x,y)=\langle\phi(x),\phi(y)
angle_H$.<br>Reference: kernels compute inner products after embedding.

</details>

<details>
<summary><strong>Q53.</strong> What is the kernel trick in this lecture's Kernel PCA setup?</summary>

Avoid explicitly computing coordinates in the feature space.<br>Instead, compute $\kappa(x,y)$, which equals the feature-space inner product.<br>Reference: $\kappa(x,y)=\langle\phi(x),\phi(y)
angle_H$.

</details>

<details>
<summary><strong>Q54.</strong> How do you check whether a function is a kernel?</summary>

Step 1: check symmetry: $\kappa(x,x')=\kappa(x',x)$.<br>Step 2: check positive semi-definiteness for all finite choices of points and coefficients.<br>Reference: a kernel on $\mathcal{X}$ is $\kappa:\mathcal{X}\times\mathcal{X}\to\mathbb{R}$ satisfying symmetry and PSD.

</details>

<details>
<summary><strong>Q55.</strong> How do you prove kernel symmetry?</summary>

Swap the two arguments and simplify.<br>If the expression is unchanged, symmetry holds: $\kappa(x,x')=\kappa(x',x)$.<br>Reference: symmetry must hold for any $x,x'\in\mathcal{X}$.

</details>

<details>
<summary><strong>Q56.</strong> How do you prove kernel positive semi-definiteness directly?</summary>

Step 1: choose arbitrary $n$, points $x_1,\ldots,x_n$, and coefficients $c_1,\ldots,c_n$.<br>Step 2: form $\sum_i\sum_j c_ic_j\kappa(x_i,x_j)$.<br>Step 3: show the expression is always $\geq0$.<br>Reference: PSD means this double sum is non-negative for all finite choices.

</details>

<details>
<summary><strong>Q57.</strong> How do you prove PSD when a feature map is available?</summary>

Step 1: write $\kappa(x_i,x_j)=\langle\phi(x_i),\phi(x_j)
angle$.<br>Step 2: substitute into $\sum_i\sum_j c_ic_j\kappa(x_i,x_j)$.<br>Step 3: regroup as $\|\sum_i c_i\phi(x_i)\|^2$.<br>Step 4: conclude $\geq0$.<br>Reference: feature-map inner products always produce PSD kernels.

</details>

<details>
<summary><strong>Q58.</strong> How do you prove a polynomial-style dot-product function is a kernel using the lecture method?</summary>

Step 1: find or use an explicit feature map $\phi$.<br>Step 2: show the proposed $\kappa(x,y)$ equals $\phi(x)^\top\phi(y)$.<br>Step 3: symmetry follows from inner-product symmetry; PSD follows from the squared-norm argument.<br>Reference: the lecture's kernel exercise is proved by feature-map representation, not by testing examples.

</details>

<details>
<summary><strong>Q59.</strong> Feature map → kernel: what theorem-style claim should you remember?</summary>

If $\phi:\mathcal{X}\to H$ maps into a Hilbert space, then defining $\kappa(x,y)=\langle\phi(x),\phi(y)
angle_H$ gives a kernel.<br>Use: symmetry from inner product; PSD from squared norm.<br>Reference: every feature-space inner product defines a kernel.

</details>

<details>
<summary><strong>Q60.</strong> Kernel → feature map: what converse claim should you remember?</summary>

If $\kappa$ is a valid kernel, then some Hilbert space $H$ and feature map $\phi:\mathcal{X}\to H$ exist such that $\kappa(x,y)=\langle\phi(x),\phi(y)
angle_H$.<br>Do not try to prove it in this lecture; the notes say the proof is nontrivial.<br>Reference: this Hilbert space is called an RKHS.

</details>

<details>
<summary><strong>Q61.</strong> What is an RKHS in the lecture's Kernel PCA story?</summary>

Use RKHS as the Hilbert space associated with a kernel.<br>It is the space where a feature map $\phi$ can realise $\kappa(x,y)=\langle\phi(x),\phi(y)
angle_H$.<br>Reference: RKHS = Reproducing Kernel Hilbert Space.

</details>

<details>
<summary><strong>Q62.</strong> How do you construct the kernel matrix?</summary>

Step 1: choose data points $x_1,\ldots,x_N$ and a kernel $\kappa$.<br>Step 2: fill entry $(i,j)$ with $\kappa(x_i,x_j)$.<br>Step 3: record $K\in\mathbb{R}^{N\times N}$.<br>Reference: $K_{ij}=\kappa(x_i,x_j)$.

</details>

<details>
<summary><strong>Q63.</strong> Kernel matrix vs Gram matrix: what is the discriminator?</summary>

Discriminator: ordinary dot product or kernel value?<br>Gram matrix: $G_{ij}=x_i^\top x_j$.<br>Kernel matrix: $K_{ij}=\kappa(x_i,x_j)$, equivalent to a feature-space inner product.<br>Reference: $K=\phi(X)\phi(X)^\top$ if the feature-mapped data matrix is known.

</details>

<details>
<summary><strong>Q64.</strong> How do you centre a kernel matrix?</summary>

Apply the same double-centering structure as for the Gram matrix.<br>Use: $\tilde{K}=K-N^{-1}\mathbf{1}K-N^{-1}K\mathbf{1}+N^{-2}\mathbf{1}K\mathbf{1}$.<br>Reference: $\mathbf{1}$ is the $N\times N$ all-ones matrix.

</details>

<details>
<summary><strong>Q65.</strong> How do you perform Kernel PCA via the centred kernel matrix?</summary>

Step 1: choose kernel $\kappa$.<br>Step 2: construct $K$ with $K_{ij}=\kappa(x_i,x_j)$.<br>Step 3: centre it to get $\tilde{K}$.<br>Step 4: apply EVD to $\tilde{K}$.<br>Step 5: sort eigenvalues $\lambda_1\geq\cdots\geq\lambda_N\geq0$.<br>Step 6: choose the top $k$.<br>Reference: Kernel PCA uses EVD of the centred kernel matrix.

</details>

<details>
<summary><strong>Q66.</strong> What is the key warning about Kernel PCA eigenvectors?</summary>

Do not say the raw eigenvectors of $\tilde{K}$ are ordinary input-space directions.<br>The matrix is $N\times N$, so the literal eigenvectors are sample-coordinate coefficient vectors; the associated directions live in the feature/Hilbert space.<br>Reference: the slide warns Kernel PCA components are not in data space.

</details>

<details>
<summary><strong>Q67.</strong> PCA vs Kernel PCA: what is the fastest discriminator?</summary>

Ask: are projections linear in input space or induced by nonlinear embedding?<br>PCA: orthogonal directions in data space; EVD of centred Gram/covariance; linear projections.<br>Kernel PCA: directions in embedding/Hilbert space; EVD of centred kernel matrix; nonlinear embeddings.<br>Reference: this is the final PCA/Kernel PCA comparison.

</details>

<details>
<summary><strong>Q68.</strong> Linear PCA vs Kernel PCA: how do you translate the matrix entries?</summary>

Replace ordinary dot products with kernel evaluations.<br>Linear Gram entry: $x_i^\top x_j$.<br>Kernel entry: $\kappa(x_i,x_j)=\langle\phi(x_i),\phi(x_j)
angle_H$.<br>Reference: Kernel PCA is the Gram-matrix idea with kernel entries.

</details>

<details>
<summary><strong>Q69.</strong> How do you decide between covariance EVD, Gram EVD, and kernel EVD?</summary>

Use covariance EVD when you want data-space PCA directions from $X^\top X$.<br>Use Gram EVD when working with sample similarities $XX^\top$.<br>Use kernel EVD when similarities come from $\kappa(x_i,x_j)$ after implicit embedding.<br>Reference: the lecture moves from covariance PCA to Gram PCA to Kernel PCA.

</details>

<details>
<summary><strong>Q70.</strong> How do you choose the top $k$ components/eigenvalues across PCA-style algorithms?</summary>

After EVD/SVD, sort by decreasing eigenvalue or singular value.<br>Then retain the first $k$ components/eigenvectors/eigenvalue directions required by the method.<br>Reference: covariance PCA, Gram PCA, and Kernel PCA all choose the top $k$ after sorting.

</details>

<details>
<summary><strong>Q71.</strong> What is the common centering step across PCA, Gram PCA, and Kernel PCA?</summary>

Before PCA-style decomposition, remove the mean effect.<br>Data PCA: centre points $x_i\leftarrow x_i-\hat{\mu}$.<br>Gram/Kernel PCA: use double-centering to obtain $\tilde{G}$ or $\tilde{K}$.<br>Reference: centering changes the Gram/kernel matrix and is required before EVD.

</details>

<details>
<summary><strong>Q72.</strong> How do ICA and Kernel PCA differ as representation-learning methods?</summary>

ICA asks for independent hidden sources from observed mixtures.<br>Kernel PCA asks for PCA-like components after nonlinear embedding via a kernel.<br>Discriminator: source separation objective vs nonlinear dimensional representation objective.<br>Reference: the lecture covers ICA first, then Kernel PCA as separate unsupervised methods.

</details>

<details>
<summary><strong>Q73.</strong> How do you answer an exam prompt asking for ICA applications?</summary>

Give application areas where hidden independent sources are plausibly mixed in observations.<br>Examples from the lecture categories: sound separation, EEG/fMRI analysis, natural-scene analysis.<br>Reference: ICA is used for separating mixed signals into independent components.

</details>

<details>
<summary><strong>Q74.</strong> How do you avoid overclaiming Kernel PCA's feature space?</summary>

Say that a kernel corresponds to an inner product in some Hilbert space, but you usually do not explicitly construct that space in Kernel PCA.<br>Use kernel evaluations to fill $K$, then decompose $\tilde{K}$.<br>Reference: the kernel-to-feature-map/RKHS existence result is stated, not proved, in the lecture.

</details>
