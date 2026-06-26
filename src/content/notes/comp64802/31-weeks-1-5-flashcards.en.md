---
subject: COMP64802
chapter: 31
title: "Weeks 1–5 — Flashcards"
language: en
---

# Weeks 1–5 — Flashcards

100 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> How do you recognise that an ML data object should be treated as high-dimensional data?</summary>

Use: once the object is represented by many numeric coordinates, work with it as a vector or sequence of vectors.
Steps:
1. Identify the scalar measurements/embeddings/samples.
2. Stack them into coordinates.
3. Analyse the object in a real vector space.
Reference: high-dimensional data are modelled as x ∈ ℝ^d.

</details>

<details>
<summary><strong>Q2.</strong> How do you encode an image as a vector?</summary>

Use: treat each scalar pixel/channel value as one coordinate.
Steps:
1. Choose an ordering of pixel/channel scalars.
2. Stack them into a vector.
3. The image becomes one point in a high-dimensional real space.
Reference: if there are m scalar values, image x ∈ ℝ^m.

</details>

<details>
<summary><strong>Q3.</strong> How do you encode text for an ML model?</summary>

Use: do not treat the sentence as raw characters; treat it as a sequence of embedded tokens.
Steps:
1. Split text into tokens.
2. Map each token to an embedding vector.
3. Represent the sentence as an ordered vector sequence.
Reference: (x_1,...,x_T), with x_i ∈ ℝ^e.

</details>

<details>
<summary><strong>Q4.</strong> How do you encode a function as data?</summary>

Use: sample the function at selected input points.
Steps:
1. Pick domain points t_1,...,t_m.
2. Evaluate f(t_i) at each point.
3. Stack the values as a vector.
Reference: f ↦ [f(t_1),...,f(t_m)] ∈ ℝ^m.

</details>

<details>
<summary><strong>Q5.</strong> Discriminator: low-dimensional representation or low-dimensional original data?</summary>

Ask: is the raw object already low-dimensional, or are we trying to find a compact representation of a high-dimensional object?
Use: representation learning usually starts with high-dimensional data and seeks a lower-dimensional structure.
Reference: low-dimensional representations may exist because coordinates are dependent, but finding them still processes high-dimensional data.

</details>

<details>
<summary><strong>Q6.</strong> Why should you distrust 2D/3D pictures in high-dimensional ML?</summary>

Use: check how a quantity scales with dimension d before trusting geometric intuition.
Method:
1. Write the high-dimensional formula.
2. Let d grow.
3. Compare the limit with the 2D/3D picture.
Reference: high-dimensional geometry can behave qualitatively differently; low-dimensional pictures are misleading.

</details>

<details>
<summary><strong>Q7.</strong> How do you derive the diagonal length of a d-dimensional cube?</summary>

Use: apply Pythagoras across all d coordinates.
Steps:
1. Let side length be s.
2. Square each coordinate displacement: s².
3. Sum d copies and take the square root.
Reference: diagonal length = √(d s²) = s√d.

</details>

<details>
<summary><strong>Q8.</strong> How do you solve a high-dimensional sphere-contact radius problem?</summary>

Use: turn tangency into a distance equation.
Steps:
1. Compute centre-to-centre distance c(d).
2. Let inner radius be r and outer radius be a.
3. Use tangency: r + a = c(d).
4. Solve for r and inspect behaviour as d grows.
Reference: contact radius is found from r = c(d) − a.

</details>

<details>
<summary><strong>Q9.</strong> How do you model uncertain data formally?</summary>

Use: treat the observed data vector as a random variable.
Steps:
1. Choose the sample space, usually ℝ^d.
2. Specify a probability law/density.
3. Interpret observed data as samples from that law.
Reference: ML data are often modelled as random variables x ∈ ℝ^d.

</details>

<details>
<summary><strong>Q10.</strong> How do you recognise a valid continuous probability density?</summary>

Use: check non-negativity and total mass.
Steps:
1. Verify p(x) ≥ 0 for all x.
2. Integrate over the whole space.
3. Confirm the integral equals 1.
Reference: p: ℝ^d → [0,∞), with ∫_{ℝ^d} p(x) dx = 1.

</details>

<details>
<summary><strong>Q11.</strong> How do you compute the probability of an event from a density?</summary>

Use: integrate the density over the event region.
Steps:
1. Identify the subset A of possible values.
2. Integrate p over A.
3. Interpret the result as probability mass.
Reference: P[x ∈ A] = ∫_A p(x) dx.

</details>

<details>
<summary><strong>Q12.</strong> How do you check a proposed uniform density on a region?</summary>

Use: constant density means every point inside the region is equally likely.
Steps:
1. Set p(x)=c inside the region and p(x)=0 outside.
2. Compute c × volume(region).
3. Choose/check c so total mass is 1.
Reference: uniform density has constant p on its support and zero outside.

</details>

<details>
<summary><strong>Q13.</strong> How do you check a Gaussian-style density?</summary>

Use: verify shape and total mass.
Steps:
1. Confirm the density is non-negative.
2. Check it decreases away from its centre according to the quadratic exponent.
3. Verify its integral over the whole space is 1.
Reference: a Gaussian density assigns positive mass everywhere but exponentially less far from its mean.

</details>

<details>
<summary><strong>Q14.</strong> Discriminator: probability density or distribution function?</summary>

Ask: does the object give local mass density p(x), or cumulative probability P[X ≤ x]?
Use: integrate a density to get probabilities; do not read p(x) itself as event probability in continuous spaces.
Reference: for continuous variables, p: ℝ^d→[0,∞) is a density; a CDF is a different object.

</details>

<details>
<summary><strong>Q15.</strong> How do you set up a supervised learning problem?</summary>

Use: define inputs, labels, predictors, and a loss.
Steps:
1. Let x ∈ X be input and y ∈ Y be label.
2. Choose predictors f: X→Y or a parameterised model f_w.
3. Score prediction error using ℓ(w,x,y).
Reference: supervised data are pairs (x,y) sampled from a distribution D on X×Y.

</details>

<details>
<summary><strong>Q16.</strong> How do you identify the model class in a learning problem?</summary>

Use: look for the set of predictors the training algorithm is allowed to choose from.
Steps:
1. Specify the functional form.
2. Identify trainable parameters.
3. Optimise only over that class.
Reference: a model class is a set F of candidate predictors f_w.

</details>

<details>
<summary><strong>Q17.</strong> How do you use a loss function?</summary>

Use: convert a prediction mistake into a scalar penalty.
Steps:
1. Feed model parameters, input, and label into ℓ.
2. Larger mistake should give larger penalty.
3. Optimise the average/expected loss.
Reference: ℓ(w,x,y) measures prediction error; squared loss can be written 1/2(y−⟨w,x⟩)².

</details>

<details>
<summary><strong>Q18.</strong> Discriminator: population risk or empirical risk?</summary>

Ask: is the average taken over the true data distribution or over the finite training sample?
Population risk = target but usually unknown.
Empirical risk = computable from observed data.
Reference: R(w)=E_D[ℓ(w,x,y)], while R̂(w)=m^{-1}∑_{i=1}^m ℓ(w,x_i,y_i).

</details>

<details>
<summary><strong>Q19.</strong> How do you compute empirical risk from a dataset?</summary>

Use: average the loss over all observed samples.
Steps:
1. For each sample (x_i,y_i), compute ℓ(w,x_i,y_i).
2. Sum the losses.
3. Divide by the number of samples.
Reference: R̂(w)=1/m ∑_{i=1}^m ℓ(w,x_i,y_i).

</details>

<details>
<summary><strong>Q20.</strong> What is the core ML challenge in risk minimisation?</summary>

Use: remember which risk is available and which risk matters.
Method:
1. We care about population risk.
2. We only observe samples.
3. We minimise empirical risk and hope it generalises.
Reference: ML aims to minimise population risk while only having access to empirical risk.

</details>

<details>
<summary><strong>Q21.</strong> How do you compute the Euclidean norm of a vector?</summary>

Use: square, sum, square-root.
Steps:
1. Square each coordinate v_i.
2. Sum the squares.
3. Take the square root.
Reference: ∥v∥₂ = √(∑_i v_i²).

</details>

<details>
<summary><strong>Q22.</strong> How do you use Euclidean norm as a distance or residual size?</summary>

Use: apply the norm to a difference vector.
Steps:
1. Form the difference a−b or residual r.
2. Compute ∥a−b∥₂ or ∥r∥₂.
3. Square it if the objective penalises squared error.
Reference: Euclidean distance between a and b is ∥a−b∥₂.

</details>

<details>
<summary><strong>Q23.</strong> How do you recognise differentiable convexity using the tangent inequality?</summary>

Use: test whether every tangent hyperplane lies below the graph.
Steps:
1. Pick arbitrary x and y.
2. Form the first-order approximation at x.
3. Check it never exceeds F(y).
Reference: F is convex if F(x)+∇F(x)^T(y−x) ≤ F(y) for all x,y.

</details>

<details>
<summary><strong>Q24.</strong> How do you verify convexity from the first-order definition?</summary>

Use: prove the tangent inequality generically, not by checking one picture.
Steps:
1. Compute ∇F(x).
2. Substitute into F(x)+∇F(x)^T(y−x).
3. Rearrange to show ≤ F(y) for all x,y.
Reference: convexity here is the global first-order lower-bound property.

</details>

<details>
<summary><strong>Q25.</strong> Discriminator: convex function with minimum or convex function without finite minimum?</summary>

Ask: is the infimum actually attained at some finite point?
Use: convexity alone does not guarantee a minimiser.
Check:
1. Find the lowest possible value.
2. Ask whether any finite x reaches it.
Reference: a convex function may have a unique minimiser or no finite minimiser.

</details>

<details>
<summary><strong>Q26.</strong> How do you handle ReLU when checking convexity?</summary>

Use: do not reject convexity just because the derivative fails at one point.
Steps:
1. Note ReLU is piecewise linear.
2. Slopes move from lower to higher as x crosses the kink.
3. Treat it as convex under the broader convex-function definition.
Reference: ReLU(x)=max{0,x}; it is convex but not differentiable at x=0.

</details>

<details>
<summary><strong>Q27.</strong> How do you solve equality-constrained convex optimisation with a Lagrangian?</summary>

Use: introduce multipliers and solve stationarity plus feasibility.
Steps:
1. Write the constraint as Ax=b.
2. Form L(x,λ)=f(x)+λ^T(Ax−b).
3. Set ∂L/∂x=0 and ∂L/∂λ=0.
4. Solve for x* and λ*.
Reference: under the slide assumptions, these conditions are necessary and sufficient.

</details>

<details>
<summary><strong>Q28.</strong> What optimality equations should you use for full-rank equality constraints?</summary>

Use: pair stationarity with the original constraint.
Equations:
1. ∇f(x*) + A^Tλ* = 0.
2. Ax* = b.
Reference: for convex differentiable f with full-rank linear equality constraints, x* is optimal iff such λ* exists.

</details>

<details>
<summary><strong>Q29.</strong> Discriminator: stationarity or primal feasibility?</summary>

Ask: does the equation come from differentiating the objective/Lagrangian, or from satisfying the constraint itself?
Stationarity: ∇f(x*)+A^Tλ*=0.
Primal feasibility: Ax*=b.
Reference: both are required for the equality-constrained optimum.

</details>

<details>
<summary><strong>Q30.</strong> How do you recognise a non-convex neural loss from a plot or formula?</summary>

Use: look for violation of convex shape, not just multiple parameters.
Checks:
1. Does a line/tangent go above/below in a way convexity forbids?
2. Are there multiple separated local minima or local maxima?
3. Is only one local minimum global?
Reference: neural-network losses can be non-convex even in very small models.

</details>

<details>
<summary><strong>Q31.</strong> Why does non-convexity matter for neural-network training?</summary>

Use: it breaks the clean guarantees available for convex optimisation.
Consequences:
1. Local minima may not be global.
2. Critical points may trap or slow optimisation.
3. Proving GD convergence becomes difficult.
Reference: the lecture uses a tiny sigmoid-gate loss as a concrete non-convex example.

</details>

<details>
<summary><strong>Q32.</strong> How do you compute the spectral norm from the definition?</summary>

Use: find the largest stretch of any unit vector.
Steps:
1. Restrict to vectors x with ∥x∥₂=1.
2. Compute ∥Ax∥₂.
3. Maximise over all unit x.
Reference: ∥A∥₂ = max_{∥x∥₂=1} ∥Ax∥₂ = max_{x≠0} ∥Ax∥₂/∥x∥₂.

</details>

<details>
<summary><strong>Q33.</strong> How do you compute eigenvalues and eigenvectors?</summary>

Use: solve the square-matrix equation Av=λv.
Steps:
1. Form det(A−λI)=0.
2. Solve for eigenvalues λ.
3. For each λ, solve (A−λI)v=0 for nonzero v.
Reference: eigenvalues/eigenvectors are normally defined for square A.

</details>

<details>
<summary><strong>Q34.</strong> Discriminator: spectral norm or spectral radius?</summary>

Ask: are you measuring largest stretch of vectors or largest eigenvalue magnitude?
Spectral norm: optimise ∥Ax∥ over unit x.
Spectral radius: maximise |λ| over eigenvalues.
Reference: spectral radius ≤ spectral norm, but the gap can be arbitrarily large.

</details>

<details>
<summary><strong>Q35.</strong> How can spectral radius be small while spectral norm is large?</summary>

Use: compute both; do not infer stretch from eigenvalues alone.
Steps:
1. Find eigenvalues and spectral radius.
2. Independently maximise ∥Ax∥₂ over unit vectors.
3. Compare the two quantities.
Reference: non-normal matrices can stretch some vectors far more than their eigenvalue magnitudes suggest.

</details>

<details>
<summary><strong>Q36.</strong> How do you run gradient descent on a differentiable objective?</summary>

Use: repeatedly move opposite the gradient.
Steps:
1. Choose initial point w_1.
2. Choose step sizes η_t and number of steps T.
3. Update w_{t+1}=w_t−η_t∇F(w_t).
4. Return the final iterate.
Reference: GD is the vanilla gradient-based training algorithm.

</details>

<details>
<summary><strong>Q37.</strong> Why does gradient descent move in the negative-gradient direction?</summary>

Use: gradient points toward steepest local increase.
Therefore:
1. ∇F(w_t) increases F fastest locally.
2. −∇F(w_t) decreases F fastest locally.
3. η_t controls how far to move.
Reference: GD update is w_{t+1}=w_t−η_t∇F(w_t).

</details>

<details>
<summary><strong>Q38.</strong> How do you derive a scalar GD recurrence?</summary>

Use: substitute the derivative into the GD update and factor.
Steps:
1. Compute F′(x_t).
2. Write x_{t+1}=x_t−η_tF′(x_t).
3. Simplify into a recurrence.
Reference: for a differentiable scalar F, GD is x_{t+1}=x_t−η_tF′(x_t).

</details>

<details>
<summary><strong>Q39.</strong> How do you unroll a multiplicative GD recurrence?</summary>

Use: repeatedly substitute the previous iterate.
Steps:
1. Put the recurrence in the form x_{t+1}=a_t x_t.
2. Substitute x_t=a_{t−1}x_{t−1}.
3. Continue to get a product of factors times x_0.
Reference: x_{t+1}=x_0∏_{i=0}^t a_i.

</details>

<details>
<summary><strong>Q40.</strong> Discriminator: critical point or global minimum in GD?</summary>

Ask: is the gradient zero, or is the objective value globally smallest?
Use: GD stops at any critical point because the update step is zero.
Reference: if ∇F(w_0)=0, then w_{t+1}=w_t; critical points need not be global minima.

</details>

<details>
<summary><strong>Q41.</strong> How do you prove geometric convergence for a GD recurrence?</summary>

Use: make the multiplicative factor have magnitude less than one.
Steps:
1. Derive x_{t+1}=k x_t.
2. Require |k|<1.
3. Unroll to x_t=k^t x_0.
4. Conclude x_t→0.
Reference: geometric convergence occurs when repeated factors shrink the iterate.

</details>

<details>
<summary><strong>Q42.</strong> How do you estimate the number of GD steps needed for ε accuracy under geometric convergence?</summary>

Use: solve the inequality |x_0|k^t≤ε.
Steps:
1. Divide by |x_0|.
2. Take logs.
3. Remember log(k)<0 when 0<k<1, so the inequality direction flips if dividing by it.
Reference: t ≥ log(|x_0|/ε)/log(1/k), giving O(log(1/ε)).

</details>

<details>
<summary><strong>Q43.</strong> How do you derive GD for a double-well/Mexican-hat objective?</summary>

Use: chain rule, then substitute into GD.
Steps:
1. Write F(x)=1/2(x²−a²)².
2. Differentiate: F′(x)=2x(x²−a²).
3. Update: x_{t+1}=x_t−2ηx_t(x_t²−a²).
4. Global minima satisfy x²=a².
Reference: this is the scalar non-convex recurrence pattern used in the lecture.

</details>

<details>
<summary><strong>Q44.</strong> How do you derive the matrix analogue of the Mexican-hat recurrence?</summary>

Use: replace scalar squared size with Frobenius squared size.
Steps:
1. Let f(W)=(C−∥W∥_F²)².
2. Use ∇_W∥W∥_F²=2W.
3. Get ∇f(W)=4(∥W∥_F²−C)W.
4. Update W_{t+1}=W_t−4η(∥W_t∥_F²−C)W_t.
Reference: C is fixed and the update factors W_t by a scalar term.

</details>

<details>
<summary><strong>Q45.</strong> What is the main GD lesson from non-convex examples?</summary>

Use: separate empirical behaviour from theorem-level guarantees.
Takeaway:
1. GD may reach a global minimum in some non-convex cases.
2. Proving this in general is much harder.
3. Neural-network analysis remains difficult.
Reference: GD is simple to state but hard to analyse for general non-convex losses.

</details>

<details>
<summary><strong>Q46.</strong> How do you construct a random Gaussian projection?</summary>

Use: scale an i.i.d. Gaussian matrix by the target dimension.
Steps:
1. Draw G ∈ ℝ^{k×d} with independent G_ij∼N(0,1).
2. Set Π=(1/√k)G.
3. Map a∈ℝ^d to Πa∈ℝ^k.
Reference: Π: ℝ^d→ℝ^k compresses when k≪d.

</details>

<details>
<summary><strong>Q47.</strong> How do you check the (ε,δ)-JL property for one vector?</summary>

Use: ask whether squared length is preserved within multiplicative error with high probability.
Check:
(1−ε)∥a∥₂² ≤ ∥Πa∥₂² ≤ (1+ε)∥a∥₂².
Failure probability should be at most δ.
Reference: k=O(log(1/δ)/ε²) for the one-vector JL guarantee.

</details>

<details>
<summary><strong>Q48.</strong> What controls the JL target dimension?</summary>

Use: look at accuracy and failure probability, not the original dimension directly.
Rules:
1. Smaller ε needs larger k.
2. Smaller δ needs larger k.
3. d does not appear directly in the basic target-dimension scaling.
Reference: k=O(log(1/δ)/ε²) for one vector.

</details>

<details>
<summary><strong>Q49.</strong> How do you apply the JL lemma to n points?</summary>

Use: preserve all pairwise distances after projection.
Steps:
1. Start with points a_1,...,a_n∈ℝ^d.
2. Choose target dimension k=O(log n/ε²).
3. Use a linear map f:ℝ^d→ℝ^k.
4. Check distances between every pair.
Reference: ∥f(a_i)−f(a_j)∥ approximately preserves ∥a_i−a_j∥ for all i,j.

</details>

<details>
<summary><strong>Q50.</strong> Why does norm preservation imply pairwise-distance preservation?</summary>

Use: distances are norms of difference vectors.
Steps:
1. For each pair, form a_i−a_j.
2. Apply norm preservation to that difference vector.
3. Since f is linear, f(a_i−a_j)=f(a_i)−f(a_j).
Reference: pairwise JL follows by applying the norm guarantee to all difference vectors.

</details>

<details>
<summary><strong>Q51.</strong> Why does log n appear in the JL lemma for n points?</summary>

Use: count the number of pairwise events to protect.
Steps:
1. There are about n² pairwise differences.
2. Require each distance to be preserved.
3. Use a union-bound idea over all pairs.
Reference: this turns one-vector failure control into k=O(log n/ε²).

</details>

<details>
<summary><strong>Q52.</strong> How do you sketch linear regression with a random projection?</summary>

Use: project the residual vector before measuring its squared norm.
Steps:
1. Original residual: r(β)=Aβ−y.
2. Choose Π∈ℝ^{k×n} with k<n.
3. Replace ∥Aβ−y∥₂² by ∥Π(Aβ−y)∥₂².
4. Solve the smaller sketched problem.
Reference: original min_β∥Aβ−y∥₂²; sketched min_β∥Π(Aβ−y)∥₂².

</details>

<details>
<summary><strong>Q53.</strong> How do you prove expected preservation of sketched regression loss?</summary>

Use: expand the projected residual norm and take expectation.
Steps:
1. Let r=Aβ−y.
2. Write ∥Πr∥₂² = r^TΠ^TΠr.
3. Take expectation over Π.
4. Substitute E[Π^TΠ]=I.
Reference: E∥Πr∥₂² = r^T I r = ∥r∥₂².

</details>

<details>
<summary><strong>Q54.</strong> How do you show E[Π^TΠ]=I for a scaled Gaussian projection?</summary>

Use: inspect diagonal and off-diagonal entries.
Steps:
1. Write Π=(1/√k)G.
2. Diagonal entries average k unit-variance terms scaled by 1/k, giving 1.
3. Off-diagonal entries average products of independent zero-mean Gaussians, giving 0.
Reference: E[Π^TΠ]=I.

</details>

<details>
<summary><strong>Q55.</strong> Discriminator: neural gate or Boolean gate?</summary>

Ask: does the gate output a real-valued activation or a truth-functional Boolean value?
Neural gate: weighted sum plus activation.
Boolean gate: logical operation such as AND/OR/NOT.
Reference: neural gate output is σ(∑_i w_i x_i), a real number.

</details>

<details>
<summary><strong>Q56.</strong> How does a neural activation gate compute its output?</summary>

Use: combine inputs linearly, then apply a nonlinearity.
Steps:
1. Multiply each input x_i by weight w_i.
2. Sum the weighted inputs, optionally with bias.
3. Apply activation σ.
Reference: gate output has the form σ(∑_i w_i x_i + b).

</details>

<details>
<summary><strong>Q57.</strong> How do you apply ReLU to a scalar or vector?</summary>

Use: keep positive entries and zero out negative entries.
Scalar: ReLU(t)=max{0,t}.
Vector: apply this componentwise to every coordinate.
Reference: ReLU is the Rectified Linear Unit.

</details>

<details>
<summary><strong>Q58.</strong> Discriminator: PyTorch Linear layer or mathematical linear map?</summary>

Ask: is there a bias term?
If bias is included, the map is affine, not purely linear.
Method: compute Wx+b, not just Wx.
Reference: PyTorch Linear with bias corresponds to an affine layer x↦Wx+b.

</details>

<details>
<summary><strong>Q59.</strong> How do you compute one ReLU layer?</summary>

Use: affine map first, activation second.
Steps:
1. Compute z=Wx+b.
2. Apply ReLU componentwise: h=max{0,z}.
3. Pass h to the next layer/output.
Reference: one ReLU layer is x↦ReLU(Wx+b).

</details>

<details>
<summary><strong>Q60.</strong> How can ReLU gates compute max of two scalar inputs?</summary>

Use: express max using positive parts.
Steps:
1. Form the difference d=x_1−x_2.
2. Compute ReLU(d).
3. Add it to x_2.
Reference: max(x_1,x_2)=x_2+ReLU(x_1−x_2).

</details>

<details>
<summary><strong>Q61.</strong> How do you write a general ReLU deep neural network?</summary>

Use: alternate affine maps with ReLU activations.
Pattern:
1. h_1=ReLU(W_1x+b_1).
2. h_{j+1}=ReLU(W_{j+1}h_j+b_{j+1}).
3. Final layer may be affine.
Reference: a ReLU DNN composes affine transformations and componentwise ReLUs.

</details>

<details>
<summary><strong>Q62.</strong> Discriminator: architecture or neural function?</summary>

Ask: have the weights and biases been assigned?
Architecture: graph/layers/connections; defines a family of functions.
Neural function: the actual map after parameters are fixed.
Reference: a diagram is not yet a neural function until weights are specified.

</details>

<details>
<summary><strong>Q63.</strong> How do neural-network risks depend on weights?</summary>

Use: treat the network output as changing when weights change.
Steps:
1. Let N_w be the network with weights w.
2. Define population risk as expected loss of N_w.
3. Define empirical risk as average sample loss of N_w.
Reference: R(w) and R̂(w) are functions of all trainable weights w.

</details>

<details>
<summary><strong>Q64.</strong> Why is exact population risk usually rare for neural nets?</summary>

Use: notice the expectation is over the unknown data distribution and a nonlinear model.
Reason:
1. D is unknown in practice.
2. N_w is complex and nonlinear.
3. The expectation is usually analytically intractable.
Reference: neural-net training normally uses empirical risk or stochastic estimates.

</details>

<details>
<summary><strong>Q65.</strong> How does a generic autoencoder reconstruct input?</summary>

Use: encode then decode back to the input space.
Steps:
1. Feed y into encoder E.
2. Obtain hidden code h=E(y).
3. Decode: y_hat=D(h).
4. Train so y_hat≈y.
Reference: autoencoder output is D(E(y)); goal is reconstruction.

</details>

<details>
<summary><strong>Q66.</strong> Discriminator: encoder or decoder?</summary>

Ask: is the map going from data to hidden code, or hidden code back to data?
Encoder: y↦h.
Decoder: h↦y_hat.
Reference: autoencoders contain both an encoder and a decoder.

</details>

<details>
<summary><strong>Q67.</strong> How do you set up a sparse-coding generative model?</summary>

Use: model observations as a dictionary times a sparse latent code.
Steps:
1. Choose sparse latent source x*.
2. Choose generating dictionary A*.
3. Generate observation y=A*x*.
Reference: sparse coding treats y as generated from a sparse code through a matrix/dictionary.

</details>

<details>
<summary><strong>Q68.</strong> How do you compute the hidden representation in a sparse-coding autoencoder?</summary>

Use: apply a learned analysis matrix and ReLU.
Steps:
1. Multiply the input y by W.
2. Apply ReLU componentwise.
3. Treat the result as the hidden code.
Reference: h=ReLU(Wy).

</details>

<details>
<summary><strong>Q69.</strong> How do you reconstruct in a sparse-coding autoencoder?</summary>

Use: map the hidden code back with the decoder/dictionary matrix.
Steps:
1. Compute h=ReLU(Wy).
2. Decode using W^T or a decoder matrix.
3. Compare the reconstruction with y.
Reference: y_hat=W^T ReLU(Wy) in the tied-weight version from the sheet.

</details>

<details>
<summary><strong>Q70.</strong> What loss does the sparse-coding autoencoder minimise?</summary>

Use: combine reconstruction error with weight regularisation.
Steps:
1. Compute reconstruction residual y−y_hat.
2. Penalise its squared norm.
3. Add Frobenius-norm regularisation on the weights.
Reference: loss = reconstruction error + regularisation, with ∥W∥_F² as the regulariser.

</details>

<details>
<summary><strong>Q71.</strong> How does sparse coding connect autoencoders to generative modelling?</summary>

Use: ask whether the learned decoder approximates the true generator.
Logic:
1. If y=A*x* generated the data.
2. If training learns W^T≈A*.
3. Then the autoencoder has learned an approximate data-generating dictionary.
Reference: reconstruction can reveal the generative mechanism in sparse coding.

</details>

<details>
<summary><strong>Q72.</strong> How do you verify a zero-loss autoencoder special case?</summary>

Use: substitute the proposed weights into the reconstruction formula.
Steps:
1. Assume y=A*x* with suitable nonnegative sparse code.
2. Substitute the proposed relation between W and A*.
3. Use orthogonality to simplify the encoder output.
4. Apply ReLU; if the code is nonnegative it is unchanged.
5. Decode and show y_hat=y.
Reference: nonnegative reconstruction loss is globally minimised when it reaches 0.

</details>

<details>
<summary><strong>Q73.</strong> Discriminator: known global minimiser or recoverable by training?</summary>

Ask: have we shown a parameter setting gives minimum loss, or that an optimisation algorithm will find it?
Use: existence of a global minimiser does not prove GD/Adam recovers it from samples.
Reference: the sheet explicitly separates global-minimum existence from optimisation guarantees.

</details>

<details>
<summary><strong>Q74.</strong> What is a bottleneck autoencoder?</summary>

Use: force reconstruction through a lower-dimensional code.
Steps:
1. Encode x into z with dimension smaller than input.
2. Decode z back to x_hat.
3. Train x_hat≈x despite compression.
Reference: bottleneck autoencoder has x→z→x_hat with z compressed.

</details>

<details>
<summary><strong>Q75.</strong> How are bottleneck autoencoders related to PCA?</summary>

Use: view them as nonlinear representation learners.
Distinction:
1. PCA is a linear low-dimensional representation method.
2. Bottleneck autoencoders can use nonlinear neural functions.
3. The course notes call them a more powerful nonlinear generalisation of PCA.
Reference: precise conditions where autoencoders beat PCA are outside the sheet’s scope.

</details>

<details>
<summary><strong>Q76.</strong> How do you state the distribution-estimation problem?</summary>

Use: infer an unknown data distribution from i.i.d. samples.
Steps:
1. Observe samples x_1,...,x_m from unknown p(x).
2. Choose a parameterised density family p_θ(x).
3. Fit θ so p_θ approximates p.
Reference: goal is to estimate unknown p(x) from samples.

</details>

<details>
<summary><strong>Q77.</strong> How do you form the maximum-likelihood estimator?</summary>

Use: choose parameters assigning high probability to the data.
Steps:
1. Write log p_θ(x) for a sample.
2. Average over the data distribution or empirical sample.
3. Choose θ maximising that average log likelihood.
Reference: MLE maximises E_p[log p_θ(x)], approximated by sample average in practice.

</details>

<details>
<summary><strong>Q78.</strong> How do you build a latent-variable joint model?</summary>

Use: introduce hidden z and model data conditionally on z.
Steps:
1. Choose prior p(z).
2. Choose conditional model p_θ(x|z).
3. Multiply them to get a joint density.
Reference: p_θ(x,z)=p_θ(x|z)p(z).

</details>

<details>
<summary><strong>Q79.</strong> How do you marginalise out a latent variable?</summary>

Use: sum or integrate the joint density over z.
Steps:
1. Write p_θ(x,z)=p_θ(x|z)p(z).
2. Integrate/sum over all z.
3. The result is the model’s marginal density of x.
Reference: p_θ(x)=∫ p_θ(x|z)p(z) dz.

</details>

<details>
<summary><strong>Q80.</strong> How do you sample from a latent-variable generative model?</summary>

Use: sample the hidden cause first, then the observation.
Steps:
1. Draw z∼p(z).
2. Draw x∼p_θ(x|z).
3. Treat x as generated data.
Reference: generative modelling often uses a simple prior p(z) and expressive conditional p_θ(x|z).

</details>

<details>
<summary><strong>Q81.</strong> How do you compute the posterior over latent variables?</summary>

Use: apply Bayes’ rule after observing x.
Steps:
1. Write the joint p_θ(x|z)p(z).
2. Divide by the marginal p_θ(x).
3. Interpret the result as belief over z given x.
Reference: p_θ(z|x)=p_θ(x|z)p(z)/p_θ(x).

</details>

<details>
<summary><strong>Q82.</strong> How do you compute KL divergence on a discrete sample space?</summary>

Use: sum probability-weighted log ratios.
Steps:
1. Ensure p and q live on the same outcomes.
2. For each outcome, compute p(i) log[p(i)/q(i)].
3. Sum over outcomes.
Reference: KL(p∥q)=∑_i p(i) log(p(i)/q(i)).

</details>

<details>
<summary><strong>Q83.</strong> Discriminator: KL(p∥q) or KL(q∥p)?</summary>

Ask: which distribution supplies the outer weighting in the sum/expectation?
KL(p∥q): expectation under p.
KL(q∥p): expectation under q.
Reference: KL is asymmetric; generally KL(p∥q) ≠ KL(q∥p).

</details>

<details>
<summary><strong>Q84.</strong> When does KL divergence become infinite?</summary>

Use: check support mismatch in the denominator distribution.
Rule: if p assigns positive mass where q assigns zero, then KL(p∥q) has an infinite term.
Reference: p(i)>0 and q(i)=0 makes p(i)log[p(i)/q(i)] infinite.

</details>

<details>
<summary><strong>Q85.</strong> Why is KL divergence not a distance metric?</summary>

Use: test metric properties.
It fails symmetry: KL(p∥q) can differ from KL(q∥p).
It also should not be read as geometric distance.
Reference: KL measures asymmetric dissimilarity between distributions.

</details>

<details>
<summary><strong>Q86.</strong> How do you compare two conditional distributions in VAE motivation?</summary>

Use: put them over the same latent variable z given the same x, then apply KL.
Steps:
1. Identify the target posterior p(z|x).
2. Identify the approximation q(z|x).
3. Minimise KL(q(z|x)∥p(z|x)).
Reference: VAEs use an approximate posterior to match the true latent posterior.

</details>

<details>
<summary><strong>Q87.</strong> How do you derive the ELBO from KL and Bayes’ rule?</summary>

Use: expand KL(q(z|x)∥p(z|x)) and substitute Bayes.
Steps:
1. Start with E_q log[q(z|x)/p(z|x)].
2. Replace p(z|x)=p(x|z)p(z)/p(x).
3. Split the logarithm into terms.
4. Isolate log p(x).
5. The remaining bracket is ELBO.
Reference: log p(x)=KL(q(z|x)∥p(z|x))+ELBO.

</details>

<details>
<summary><strong>Q88.</strong> Why does maximising ELBO make sense?</summary>

Use: log p(x) is fixed with respect to q for a given model/data point.
Logic:
1. log p(x)=KL(q∥posterior)+ELBO.
2. KL is nonnegative.
3. Increasing ELBO decreases the gap to log p(x).
Reference: minimising KL(q(z|x)∥p(z|x)) is equivalent to maximising ELBO when log p(x) is fixed.

</details>

<details>
<summary><strong>Q89.</strong> Discriminator: ELBO or VFE?</summary>

Ask: are you maximising the lower bound or minimising its negative?
ELBO: maximise.
VFE: minimise negative ELBO.
Reference: ELBO = −VFE, so VFE = −ELBO.

</details>

<details>
<summary><strong>Q90.</strong> How do you read the VAE objective as two terms?</summary>

Use: split negative ELBO.
Terms:
1. Reconstruction term: −E_q log p_θ(x|z).
2. KL regulariser: KL(q_φ(z|x)∥p(z)).
Reference: VAE/VFE objective = reconstruction loss + KL regularisation.

</details>

<details>
<summary><strong>Q91.</strong> What are the three distributions in a VAE?</summary>

Use: identify encoder, prior, and decoder.
1. Approximate posterior/encoder: q_φ(z|x).
2. Prior: p(z).
3. Decoder likelihood: p_θ(x|z).
Reference: a VAE is a probabilistic system, not just one neural network.

</details>

<details>
<summary><strong>Q92.</strong> How do encoder outputs parameterise the Gaussian approximate posterior?</summary>

Use: read the encoder output as mean and log variance.
Steps:
1. Encoder maps x to μ_z and log_var.
2. Convert log_var to variance via exp(log_var).
3. Use diagonal covariance.
Reference: q_φ(z|x)=N(μ_z, diag(σ_z²)), with log_var=log(σ_z²).

</details>

<details>
<summary><strong>Q93.</strong> How do you compute Gaussian KL to a standard normal prior?</summary>

Use: plug mean and covariance into the closed form.
Steps:
1. Identify μ and covariance Σ.
2. Compute Tr(Σ), ∥μ∥₂², dimension k, and log det Σ.
3. Combine them in the Gaussian KL formula.
Reference: KL(N(μ,Σ)∥N(0,I))=1/2[Tr(Σ)+∥μ∥₂²−k−log det Σ].

</details>

<details>
<summary><strong>Q94.</strong> How do you sample z using the reparameterisation trick?</summary>

Use: move randomness into an auxiliary noise variable.
Steps:
1. Sample ε∼N(0,I).
2. Compute z=μ_z+σ_z∘ε.
3. Backpropagate through μ_z and σ_z while ε carries randomness.
Reference: reparameterisation implements z∼N(μ_z,diag(σ_z²)).

</details>

<details>
<summary><strong>Q95.</strong> How does the decoder likelihood become reconstruction loss?</summary>

Use: assume a Gaussian decoder with identity covariance.
Steps:
1. Let x_hat=Decoder_θ(z).
2. Model p_θ(x|z)=N(x_hat,I).
3. Negative log-likelihood becomes squared error plus a constant.
Reference: −log p_θ(x|z)=1/2∥x−x_hat∥₂² + constant.

</details>

<details>
<summary><strong>Q96.</strong> How do you estimate empirical VFE by Monte Carlo?</summary>

Use: sample latent z values from the encoder distribution.
Steps:
1. For each data point x, draw z samples from q_φ(z|x).
2. Estimate the expected reconstruction term by averaging sample losses.
3. Add the analytic or estimated KL term.
Reference: empirical VFE approximates −E_q log p_θ(x|z)+KL(q_φ(z|x)∥p(z)).

</details>

<details>
<summary><strong>Q97.</strong> How do you compute VAE loss from code variables?</summary>

Use: map code outputs to the mathematical terms.
Steps:
1. x_hat is the decoder reconstruction.
2. mean is μ_z.
3. log_var is log σ_z².
4. Add reconstruction 1/2∥x−x_hat∥₂² and Gaussian KL.
Reference: loss = 1/2∥x−x_hat∥₂² + 1/2∑_i[exp(log_var_i)+mean_i²−1−log_var_i].

</details>

<details>
<summary><strong>Q98.</strong> Discriminator: ordinary forward function or VAE forward function?</summary>

Ask: is the forward pass deterministic evaluation only, or does it include stochastic latent sampling?
Ordinary NN: input → output.
VAE: input → encoder parameters → sample z → decoder output.
Reference: VAE forward returns (x_hat, μ, log_var) and implements a stochastic process.

</details>

<details>
<summary><strong>Q99.</strong> Discriminator: single architecture or VAE system?</summary>

Ask: are you describing one network shape or the full probabilistic training setup?
A VAE uses two neural nets plus prior, approximate posterior, decoder likelihood, and ELBO/VFE objective.
Reference: VAE is not a single architecture.

</details>

<details>
<summary><strong>Q100.</strong> How does a trained VAE approximate the data marginal?</summary>

Use: combine simple latent prior with learned decoder likelihood.
Steps:
1. Sample or integrate over z from p(z).
2. Use p_θ(x|z) to generate/explain x.
3. The marginal is obtained by integrating out z.
Reference: p_θ(x)=∫p_θ(x|z)p(z)dz.

</details>
