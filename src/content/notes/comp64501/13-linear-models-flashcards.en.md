---
subject: COMP64501
chapter: 13
title: "Linear Models — Flashcards"
language: en
---

# Linear Models — Flashcards

80 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> Target-type discriminator: linear regression or logistic regression?</summary>

Ask: what kind of target y is being modelled?<br><ol><li>If y is continuous, use Gaussian/linear regression.</li><li>If y is binary, use logistic regression as a probabilistic classifier.</li></ol><b>Reference:</b> Linear regression predicts f(x,w)=w^T x; logistic regression models p(y|w,x)=Ber(y|σ(w^T x)).

</details>

<details>
<summary><strong>Q2.</strong> How do you write a scalar-input linear model?</summary>

Use it by separating the constant part from the input-dependent part:<br><ol><li>Put w0 as the intercept.</li><li>Put w1 as the slope multiplying x.</li><li>Compute f(x,w)=w0+w1x.</li></ol><b>Reference:</b> For one input, f(x,w)=w0+w1x, with w0 intercept and w1 slope.

</details>

<details>
<summary><strong>Q3.</strong> How do you build a D-feature linear-regression prediction?</summary>

Use this recipe:<br><ol><li>Augment the input with x0=1.</li><li>Form x=[1,x1,...,xD]^T.</li><li>Form w=[w0,w1,...,wD]^T.</li><li>Predict with the dot product w^T x.</li></ol><b>Reference:</b> f(x,w)=w0+w1x1+...+wDxD=w^T x.

</details>

<details>
<summary><strong>Q4.</strong> Bias/intercept discriminator: which term survives when all real inputs are zero?</summary>

Set the non-bias inputs to zero:<br><ol><li>Use x=[1,0,...,0]^T.</li><li>Compute w^T x.</li><li>The only standing term is w0.</li></ol><b>Reference:</b> w0 is the bias/intercept, and f(0,w)=w0 when x0=1 is used.

</details>

<details>
<summary><strong>Q5.</strong> How do you recognize and use a Gaussian pdf?</summary>

Look for two parameters:<br><ol><li>μ gives the centre/mean.</li><li>σ² gives the spread/variance.</li><li>Smaller σ² means narrower/taller; larger σ² means wider/flatter.</li></ol><b>Reference:</b> p(y|μ,σ²)=N(y|μ,σ²)=(1/sqrt(2πσ²)) exp{-(y-μ)²/(2σ²)}.

</details>

<details>
<summary><strong>Q6.</strong> How do you convert deterministic regression into Gaussian regression?</summary>

Add a Gaussian noise term:<br><ol><li>Start from the deterministic prediction f(x,w).</li><li>Add ε with mean zero and variance σ².</li><li>Write the observation as prediction plus noise.</li></ol><b>Reference:</b> y=f(x,w)+ε, where ε~N(0,σ²).

</details>

<details>
<summary><strong>Q7.</strong> For fixed x and w, how do you get the conditional distribution of y?</summary>

Treat f(x,w) as a constant:<br><ol><li>The mean of y is f(x,w)+E[ε]=f(x,w).</li><li>The variance of y is var(ε)=σ².</li><li>Therefore y is Gaussian around the regression prediction.</li></ol><b>Reference:</b> p(y|x,w,σ²)=N(y|f(x,w),σ²); for a linear model, p(y|x,w,σ²)=N(y|w^T x,σ²).

</details>

<details>
<summary><strong>Q8.</strong> How do you make a prediction for a new input after training?</summary>

Use the fitted weights as follows:<br><ol><li>Build the augmented test vector x_* including the leading 1.</li><li>Compute the central prediction w^T x_*.</li><li>Use σ² only as the noise/spread around that central prediction.</li></ol><b>Reference:</b> f(x_*,w)=w^T x_* and p(y|x_*,w,σ²)=N(y|w^T x_*,σ²).

</details>

<details>
<summary><strong>Q9.</strong> How do you write the training set, output vector, and design matrix?</summary>

Organise the data before fitting:<br><ol><li>Write D={(x_n,y_n)} for n=1,...,N.</li><li>Stack targets as y=[y1,...,yN]^T.</li><li>Stack augmented inputs as rows of X.</li></ol><b>Reference:</b> y∈R^{N×1}; X=[x1,...,xN]^T∈R^{N×(D+1)}, with each row including x0=1.

</details>

<details>
<summary><strong>Q10.</strong> Independence assumption: how do you factor the joint distribution?</summary>

Use this discriminator: does each output stop depending on the other outputs once its own input/model is known?<br><ol><li>If yes, replace the joint by a product of per-example terms.</li><li>Keep each y_n paired with its own x_n.</li></ol><b>Reference:</b> p(y1,...,yN|x1,...,xN)=∏_{n=1}^N p(y_n|x_n).

</details>

<details>
<summary><strong>Q11.</strong> Identically distributed assumption: what stays the same across examples?</summary>

Check whether all examples use the same conditional model family and parameters:<br><ol><li>Same Gaussian form.</li><li>Same w.</li><li>Same σ².</li><li>Different means only because x_n changes.</li></ol><b>Reference:</b> p(y_n|x_n,w,σ²)=N(y_n|w^T x_n,σ²).

</details>

<details>
<summary><strong>Q12.</strong> iid discriminator: which two assumptions are both required?</summary>

Ask two questions:<br><ol><li>Independent? The joint over observations factorises into per-example terms.</li><li>Identically distributed? The same conditional model/parameters apply to every example.</li></ol><b>Reference:</b> iid = independent and identically distributed.

</details>

<details>
<summary><strong>Q13.</strong> How do you construct the Gaussian linear-regression likelihood?</summary>

Build it in three steps:<br><ol><li>For each example, write p(y_n|x_n,w,σ²)=N(y_n|w^T x_n,σ²).</li><li>Use iid to multiply all N terms.</li><li>Optionally expand the Gaussian product into one exponential with the sum of squared residuals.</li></ol><b>Reference:</b> p(y|X,w,σ²)=∏_{n=1}^N N(y_n|w^T x_n,σ²).

</details>

<details>
<summary><strong>Q14.</strong> How do you expand the iid Gaussian likelihood into one exponential?</summary>

Combine the product carefully:<br><ol><li>Each Gaussian contributes a factor 1/sqrt(2πσ²).</li><li>Multiplying N factors gives (2πσ²)^(-N/2).</li><li>Products of exponentials become one exponential whose exponent is the sum.</li><li>The exponent contains the sum of squared residuals.</li></ol><b>Reference:</b> p(y|X,w,σ²)=1/(2πσ²)^{N/2} exp{-(1/(2σ²))∑_{n=1}^N(y_n-w^T x_n)²}.

</details>

<details>
<summary><strong>Q15.</strong> Pdf vs likelihood discriminator: what is fixed and what varies?</summary>

Ask: are the parameters or the data being treated as the variable?<br><ol><li>Pdf view: parameters are fixed; y varies.</li><li>Likelihood view: data X,y are fixed; w and σ² vary.</li></ol><b>Reference:</b> L(w,σ²)=p(y|X,w,σ²) when used as a function of the unknown parameters.

</details>

<details>
<summary><strong>Q16.</strong> How do you perform maximum-likelihood estimation for Gaussian regression?</summary>

Use this procedure:<br><ol><li>Write the likelihood p(y|X,w,σ²).</li><li>Treat X and y as fixed.</li><li>Choose w and σ² to maximise the likelihood, or equivalently maximise log-likelihood/minimise NLL.</li><li>Solve by setting relevant gradients to zero when using calculus.</li></ol><b>Reference:</b> (w*,σ²*)=argmax_{w,σ²} p(y|X,w,σ²).

</details>

<details>
<summary><strong>Q17.</strong> Why take logs of the likelihood?</summary>

Use the log because:<br><ol><li>log is monotonic, so the maximiser does not change.</li><li>Products become sums.</li><li>Derivatives become easier to work with.</li></ol><b>Reference:</b> LL(w,σ²)=log p(y|X,w,σ²); maximising L and LL gives the same parameters.

</details>

<details>
<summary><strong>Q18.</strong> How do you write the Gaussian linear-regression log-likelihood?</summary>

After multiplying iid Gaussian terms, take the log:<br><ol><li>Collect the constant normalisation term.</li><li>Collect the log-variance term.</li><li>Collect the squared-residual term.</li></ol><b>Reference:</b> LL(w,σ²)=-(N/2)log(2π)-(N/2)log(σ²)-(1/(2σ²))∑_{n=1}^N(y_n-w^T x_n)².

</details>

<details>
<summary><strong>Q19.</strong> How do you turn log-likelihood into negative log-likelihood?</summary>

Flip the sign and minimise:<br><ol><li>Compute LL=log p(y|X,w,σ²).</li><li>Set NLL=-LL.</li><li>Minimise NLL instead of maximising LL.</li></ol><b>Reference:</b> NLL(w,σ²)=N/2 log(2π)+N/2 log(σ²)+(1/(2σ²))∑_{n=1}^N(y_n-w^T x_n)².

</details>

<details>
<summary><strong>Q20.</strong> ML consistency discriminator: when does ML recover the correct parameters?</summary>

Ask whether the model is correctly specified:<br><ol><li>If the data really came from the stated probability model, ML recovers the correct parameters in the infinite-data limit.</li><li>If the model is wrong, this guarantee is not the one being invoked.</li></ol><b>Reference:</b> Under the specified data-generating model, the correct parameters are recovered as N→∞.

</details>

<details>
<summary><strong>Q21.</strong> How do you compute residual sum of squares?</summary>

Use residuals:<br><ol><li>For each example, compute residual r_n=y_n-w^T x_n.</li><li>Square each residual.</li><li>Sum over all examples.</li></ol><b>Reference:</b> RSS(w)=∑_{n=1}^N(y_n-w^T x_n)².

</details>

<details>
<summary><strong>Q22.</strong> Gaussian ML vs least squares discriminator: when are they equivalent?</summary>

Ask: are the residual assumptions exactly the Gaussian regression ones?<br><ol><li>Residuals are iid.</li><li>Residuals are Gaussian.</li><li>Variance σ² is fixed while optimising w.</li><li>Then maximising Gaussian log-likelihood over w is the same as minimising RSS.</li></ol><b>Reference:</b> NLL(w)∝RSS(w) under fixed σ² Gaussian iid residuals.

</details>

<details>
<summary><strong>Q23.</strong> How do you derive the normal equation from the vector objective?</summary>

Use this derivation skeleton:<br><ol><li>Write residual vector r=y-Xw.</li><li>Use the quadratic term r^T r.</li><li>Expand or differentiate to get gradient X^T Xw-X^T y.</li><li>Set the gradient to zero.</li><li>Solve X^T Xw=X^T y for w.</li></ol><b>Reference:</b> w*=(X^T X)^{-1}X^T y.

</details>

<details>
<summary><strong>Q24.</strong> How do you expand the vector residual quadratic?</summary>

Use FOIL with transposes:<br><ol><li>Start with (y-Xw)^T(y-Xw).</li><li>Multiply left and right terms.</li><li>Keep the two cross-terms explicit before differentiating.</li></ol><b>Reference:</b> (y-Xw)^T(y-Xw)=y^T y-w^T X^T y-y^T Xw+w^T X^T Xw.

</details>

<details>
<summary><strong>Q25.</strong> Which derivative rules produce the normal-equation gradient?</summary>

Differentiate the expanded quadratic with respect to w:<br><ol><li>Terms not involving w differentiate to 0.</li><li>d(w^T X^T y)/dw = X^T y.</li><li>d(y^T Xw)/dw = X^T y.</li><li>d(w^T X^T Xw)/dw = 2X^T Xw.</li></ol><b>Reference:</b> dLL/dw=(1/σ²)X^T y-(1/σ²)X^T Xw before setting the gradient to zero.

</details>

<details>
<summary><strong>Q26.</strong> How do you use the normal equation in practice?</summary>

Apply it as a closed-form fitting recipe:<br><ol><li>Build X with the intercept column.</li><li>Stack y.</li><li>Check that X^T X is invertible.</li><li>Compute w*=(X^T X)^{-1}X^T y.</li><li>Predict new outputs with w*^T x_*.</li></ol><b>Reference:</b> The normal equation is w*=(X^T X)^{-1}X^T y.

</details>

<details>
<summary><strong>Q27.</strong> Normal-equation existence discriminator: can X^T X be inverted?</summary>

Ask whether X^T X is non-singular:<br><ol><li>If X^T X is full rank / determinant nonzero, the inverse exists.</li><li>If it is singular, the displayed normal-equation inverse cannot be computed.</li></ol><b>Reference:</b> w*=(X^T X)^{-1}X^T y exists when (X^T X)^{-1} exists.

</details>

<details>
<summary><strong>Q28.</strong> How do you estimate the Gaussian noise variance after fitting w?</summary>

Use the fitted residuals:<br><ol><li>Compute r=y-Xw*.</li><li>Compute r^T r.</li><li>Divide by N.</li></ol><b>Reference:</b> σ²*=(1/N)(y-Xw*)^T(y-Xw*), the average squared residual.

</details>

<details>
<summary><strong>Q29.</strong> How do basis functions let a linear model fit nonlinear patterns?</summary>

Use this idea:<br><ol><li>Transform the original input x into features φ(x).</li><li>Fit a linear model in the transformed feature space.</li><li>The curve can be nonlinear in x while still linear in w.</li></ol><b>Reference:</b> f(x,w)=w^T φ(x).

</details>

<details>
<summary><strong>Q30.</strong> How do you build a basis-feature vector φ(x)?</summary>

Construct it like this:<br><ol><li>Choose M basis functions φ1,...,φM.</li><li>Include φ0(x)=1 for the intercept.</li><li>Stack them into one vector.</li></ol><b>Reference:</b> φ(x)=[1,φ1(x),...,φM(x)]^T and f(x,w)=w0+∑_{i=1}^M w_i φ_i(x).

</details>

<details>
<summary><strong>Q31.</strong> Linearity discriminator for basis-function models: nonlinear in inputs or parameters?</summary>

Ask what the weights multiply:<br><ol><li>If w appears only as coefficients multiplying fixed transformed features, the model is linear in parameters.</li><li>The transformed features φ_i(x) may be nonlinear in x.</li></ol><b>Reference:</b> Basis-function regression preserves linearity in w: f(x,w)=w^T φ(x).

</details>

<details>
<summary><strong>Q32.</strong> How do you build polynomial basis features?</summary>

Use powers of the scalar input:<br><ol><li>Choose maximum degree M.</li><li>Include the intercept feature 1.</li><li>Stack x,x²,...,x^M.</li></ol><b>Reference:</b> φ_i(x)=x^i, so φ(x)=[1,x,x²,...,x^M]^T.

</details>

<details>
<summary><strong>Q33.</strong> How do you build exponential basis features?</summary>

Use local bell-shaped functions:<br><ol><li>Choose centres μ_i.</li><li>Choose spread s.</li><li>For each i, compute exp{-(x-μ_i)²/(2s²)}.</li></ol><b>Reference:</b> φ_i(x)=exp{-(x-μ_i)²/(2s²)}.

</details>

<details>
<summary><strong>Q34.</strong> How do you build sigmoidal basis features?</summary>

Use shifted and scaled S-shaped functions:<br><ol><li>Choose centres μ_i.</li><li>Choose scale s.</li><li>Compute σ((x-μ_i)/s) for each i.</li></ol><b>Reference:</b> φ_i(x)=σ((x-μ_i)/s), where σ(a)=1/(1+exp(-a)).

</details>

<details>
<summary><strong>Q35.</strong> How do you form the design matrix with basis functions?</summary>

Replace raw-input rows with transformed-feature rows:<br><ol><li>For each example x_n, compute φ(x_n).</li><li>Transpose it into a row.</li><li>Stack all rows into Φ.</li></ol><b>Reference:</b> Φ has rows φ(x_n)^T and entries Φ_{n,m}=φ_m(x_n), with φ0(x)=1.

</details>

<details>
<summary><strong>Q36.</strong> How does the normal equation change with basis functions?</summary>

Use the same method, but swap X for Φ:<br><ol><li>Construct Φ from basis features.</li><li>Use y as before.</li><li>Compute the closed-form weights in transformed space.</li></ol><b>Reference:</b> w*=(Φ^T Φ)^{-1}Φ^T y.

</details>

<details>
<summary><strong>Q37.</strong> Normal equation vs iterative optimisation discriminator: when avoid matrix inversion?</summary>

Ask whether forming/inverting X^T X is practical:<br><ol><li>If feature count is manageable and data fits in memory, the normal equation may be suitable.</li><li>If feature count is large or too many instances fit in memory, use iterative optimisation.</li></ol><b>Reference:</b> Normal equations require inverting X^T X, with cost growing polynomially in D+1 and linearly in N.

</details>

<details>
<summary><strong>Q38.</strong> How do you set up a general iterative optimisation method?</summary>

Use this template:<br><ol><li>Choose objective h(w) to minimise.</li><li>Initialise w0.</li><li>At iteration k, choose search direction d_k and step size η.</li><li>Update w_{k+1}=w_k+ηd_k.</li><li>A useful direction reduces h.</li></ol><b>Reference:</b> h(w_{k+1})&lt;h(w_k) is the desired descent condition.

</details>

<details>
<summary><strong>Q39.</strong> How do you choose the gradient-descent search direction?</summary>

Use the negative gradient:<br><ol><li>Compute g_k=∇h(w_k).</li><li>Set d_k=-g_k.</li><li>Move from w_k in that direction.</li></ol><b>Reference:</b> Gradient descent/steepest descent uses w_{k+1}=w_k-η∇h(w_k).

</details>

<details>
<summary><strong>Q40.</strong> How do you run gradient descent as an algorithm?</summary>

Repeat this loop:<br><ol><li>Start with initial weights w0.</li><li>Compute the gradient of the objective at the current weights.</li><li>Subtract η times that gradient.</li><li>Continue until the stopping criterion is met.</li></ol><b>Reference:</b> w_{k+1}=w_k-ηg_k, with g_k=∇h(w_k).

</details>

<details>
<summary><strong>Q41.</strong> Learning-rate discriminator: what happens when η is too small or too large?</summary>

Ask how the objective moves:<br><ol><li>Too small: convergence is very slow.</li><li>Too large: updates can overshoot and fail to converge.</li></ol><b>Reference:</b> The main issue in gradient descent is setting the step size η.

</details>

<details>
<summary><strong>Q42.</strong> Which listed alternatives address step size or search direction?</summary>

Classify the named alternatives only as far as the sheet does:<br><ol><li>Line search methods choose step sizes and may use non-steepest directions.</li><li>Conjugate gradient is listed as the method of choice for quadratic objectives.</li><li>Newton search direction is listed as another alternative.</li></ol><b>Reference:</b> The sheet lists line search, conjugate gradient for g(w)=w^T A w, and Newton search direction, without detailed derivations.

</details>

<details>
<summary><strong>Q43.</strong> How do you set up the linear-regression squared-error objective?</summary>

Use half the RSS for cleaner derivatives:<br><ol><li>Compute each residual y_n-w^T x_n.</li><li>Square it.</li><li>Sum over n.</li><li>Multiply by 1/2.</li></ol><b>Reference:</b> E(w)=1/2 ∑_{n=1}^N(y_n-w^T x_n)².

</details>

<details>
<summary><strong>Q44.</strong> How do you compute the batch gradient for linear-regression squared error?</summary>

Use residual direction with the sign from prediction minus target:<br><ol><li>Compute predictions Xw.</li><li>Compute prediction errors Xw-y.</li><li>Premultiply by X^T.</li></ol><b>Reference:</b> ∇E(w)=∑_{n=1}^N(w^T x_n-y_n)x_n=X^T(Xw-y).

</details>

<details>
<summary><strong>Q45.</strong> How do you perform batch gradient descent for linear regression?</summary>

Use the full dataset every update:<br><ol><li>Compute g_k=X^T(Xw_k-y).</li><li>Choose η.</li><li>Update w_{k+1}=w_k-ηg_k.</li></ol><b>Reference:</b> w_{k+1}=w_k-ηX^T(Xw_k-y).

</details>

<details>
<summary><strong>Q46.</strong> Batch nature discriminator: what data is used to compute each gradient?</summary>

Ask how much data enters g_k:<br><ol><li>Batch gradient descent uses the whole dataset (X,y) at every step.</li><li>This can be expensive for large or streaming datasets.</li></ol><b>Reference:</b> Batch GD computes the gradient using all N training instances each iteration.

</details>

<details>
<summary><strong>Q47.</strong> Feature-scaling rule for gradient descent: what must you do before training?</summary>

Apply this rule before running GD:<br><ol><li>Check whether features have very different scales.</li><li>Normalise features so scales are similar.</li><li>Then run GD for faster convergence.</li></ol><b>Reference:</b> Always normalise the features if using gradient descent.

</details>

<details>
<summary><strong>Q48.</strong> When is online or large-scale learning relevant?</summary>

Use the subset-gradient idea when full-batch gradients are impractical:<br><ol><li>Online learning: instances arrive one at a time.</li><li>Large datasets: computing the exact full gradient is expensive or impossible.</li></ol><b>Reference:</b> Traditional gradients use D={(x_n,y_n)}_{n=1}^N; SGD uses subsets instead.

</details>

<details>
<summary><strong>Q49.</strong> How do you run stochastic gradient descent?</summary>

Use a sampled subset instead of the whole dataset:<br><ol><li>Select an instance or subset at iteration k.</li><li>Compute the gradient using only that selection.</li><li>Update w with the chosen learning rate.</li><li>Repeat with newly selected data.</li></ol><b>Reference:</b> SGD computes g_k from only a subset of available instances; stochastic means g_k depends on which subset is chosen.

</details>

<details>
<summary><strong>Q50.</strong> Batch GD vs SGD vs mini-batch discriminator: how many examples form the gradient?</summary>

Ask: what is S?<br><ol><li>Batch GD: S is the whole dataset.</li><li>SGD: S is a sampled subset, often one or a few instances.</li><li>Mini-batch GD: S is a subset and gradients are averaged over S.</li></ol><b>Reference:</b> Mini-batch estimate g_k=(1/|S|)∑_{i∈S}g_{k,i}.

</details>

<details>
<summary><strong>Q51.</strong> Sampling with vs without replacement discriminator: can the same instance reappear before a pass ends?</summary>

Use this test:<br><ol><li>With replacement: a selected instance can be selected again; used to simulate infinite data.</li><li>Without replacement: each instance is used once before the pass resets; more stable.</li></ol><b>Reference:</b> One loop through the whole dataset without replacement is an epoch.

</details>

<details>
<summary><strong>Q52.</strong> Epoch recognition: when do you count one epoch?</summary>

Count one epoch after this happens:<br><ol><li>Sampling is without replacement.</li><li>Every training instance has been visited once.</li></ol><b>Reference:</b> An epoch is one loop through the whole dataset without replacement.

</details>

<details>
<summary><strong>Q53.</strong> How do you compute a mini-batch gradient estimate?</summary>

Average per-instance gradients over the selected subset:<br><ol><li>Choose subset S⊆D.</li><li>Compute g_{k,i} for each i∈S.</li><li>Sum the selected gradients.</li><li>Divide by |S|.</li></ol><b>Reference:</b> g_k=(1/|S|)∑_{i∈S}g_{k,i}.

</details>

<details>
<summary><strong>Q54.</strong> Why average a mini-batch gradient by |S|?</summary>

Use the average to control scale:<br><ol><li>Without averaging, larger subsets give larger gradient magnitudes.</li><li>Dividing by |S| makes the estimate less dependent on subset size.</li></ol><b>Reference:</b> The sheet notes that changing dataset/subset size changes gradient magnitude; mini-batch GD uses g_k=(1/|S|)∑_{i∈S}g_{k,i}.

</details>

<details>
<summary><strong>Q55.</strong> How do you choose an SGD learning-rate sequence that can converge?</summary>

Check the Robbins-Monro conditions:<br><ol><li>The learning rates must not shrink too fast: ∑_{k=1}^∞ η_k=∞.</li><li>Their squares must be summable: ∑_{k=1}^∞ η_k²&lt;∞.</li></ol><b>Reference:</b> SGD usually uses an iteration-dependent learning rate η_k satisfying the Robbins-Monro conditions.

</details>

<details>
<summary><strong>Q56.</strong> How do the example SGD learning-rate schedules work?</summary>

Use a decaying schedule:<br><ol><li>Simple option: η_k=1/k.</li><li>More flexible option: η_k=1/(τ0+k)^κ.</li><li>τ0 slows early iterations; κ is chosen in (0.5,1].</li></ol><b>Reference:</b> The sheet lists η_k=1/k and η_k=1/(τ0+k)^κ with κ∈(0.5,1].

</details>

<details>
<summary><strong>Q57.</strong> How do you add regularisation to an objective?</summary>

Add a penalty term to the data-fitting term:<br><ol><li>Choose the fitting loss, such as E(w) or NLL(w).</li><li>Choose a regulariser R(w).</li><li>Choose strength λ.</li><li>Optimise fitting loss plus λR(w).</li></ol><b>Reference:</b> h(w)=E(w)+λR(w), or use NLL(w) instead of E(w).

</details>

<details>
<summary><strong>Q58.</strong> Regularisation-strength discriminator: what does λ do, and what if λ=0?</summary>

Ask how strongly the penalty should affect the solution:<br><ol><li>λ controls the weight of the regularisation term.</li><li>λ=0 removes regularisation entirely.</li><li>Larger λ puts more emphasis on the penalty relative to fitting.</li></ol><b>Reference:</b> h(w)=E(w)+λR(w); if λ=0, h(w)=E(w).

</details>

<details>
<summary><strong>Q59.</strong> How do you compute the general regularisation term shown in the sheet?</summary>

Combine L1 and L2 using α:<br><ol><li>Compute ||w||_1=∑_{m=1}^p |w_m|.</li><li>Compute ||w||_2²=∑_{m=1}^p w_m².</li><li>Weight them by α and 1-α.</li></ol><b>Reference:</b> R(w)=α||w||_1+(1-α)(1/2)||w||_2².

</details>

<details>
<summary><strong>Q60.</strong> Lasso/ridge/elastic-net discriminator: which α case applies?</summary>

Pick the case from α:<br><ol><li>α=1 gives Lasso / L1.</li><li>α=0 gives Ridge / L2 / Tikhonov.</li><li>0&lt;α&lt;1 gives Elastic Net.</li></ol><b>Reference:</b> R(w)=α||w||_1+(1-α)(1/2)||w||_2².

</details>

<details>
<summary><strong>Q61.</strong> How do you recognize/apply Lasso regularisation?</summary>

Use the L1-only case:<br><ol><li>Set α=1 in the general regulariser.</li><li>Penalise the sum of absolute weight values.</li></ol><b>Reference:</b> Lasso is L1 regularisation: R(w)=||w||_1=∑_{m=1}^p |w_m|.

</details>

<details>
<summary><strong>Q62.</strong> How do you recognize/apply Ridge regularisation?</summary>

Use the L2-only case:<br><ol><li>Set α=0 in the general regulariser.</li><li>Penalise half the squared L2 norm of the weights.</li></ol><b>Reference:</b> Ridge/Tikhonov regularisation uses R(w)=(1/2)||w||_2²=(1/2)∑_{m=1}^p w_m².

</details>

<details>
<summary><strong>Q63.</strong> How do you recognize/apply Elastic Net regularisation?</summary>

Use the mixed case:<br><ol><li>Choose α strictly between 0 and 1.</li><li>Apply both the L1 term and the L2 squared term.</li></ol><b>Reference:</b> Elastic net uses R(w)=α||w||_1+(1-α)(1/2)||w||_2² with 0&lt;α&lt;1.

</details>

<details>
<summary><strong>Q64.</strong> How do you write the ridge-regression objective?</summary>

Add the L2 penalty to squared error:<br><ol><li>Use E(w)=1/2∑(y_n-w^T x_n)².</li><li>Add (λ/2)w^T w.</li><li>Minimise the combined objective.</li></ol><b>Reference:</b> h(w)=1/2∑_{n=1}^N(y_n-w^T x_n)²+(λ/2)w^T w.

</details>

<details>
<summary><strong>Q65.</strong> How do you solve ridge regression in closed form?</summary>

Use the normal-equation pattern with a λI adjustment:<br><ol><li>Build X and y.</li><li>Choose λ.</li><li>Compute X^T X+λI.</li><li>Invert that matrix and multiply by X^T y.</li></ol><b>Reference:</b> w*=(X^T X+λI)^{-1}X^T y.

</details>

<details>
<summary><strong>Q66.</strong> Which optimisers can be used for regularised linear regression?</summary>

Use the same optimisation tools for h(w):<br><ol><li>Batch gradient descent.</li><li>SGD.</li><li>Mini-batch SGD.</li></ol><b>Reference:</b> The sheet states ridge/regularised objectives can be optimised iteratively with batch GD, SGD, or mini-batch SGD.

</details>

<details>
<summary><strong>Q67.</strong> How do you set up binary classification for logistic regression?</summary>

Prepare the target as binary:<br><ol><li>Use feature vector x∈R^D.</li><li>Encode y as a binary target.</li><li>For the Bernoulli/cross-entropy formula, use y∈{0,1}.</li></ol><b>Reference:</b> Logistic regression is a probabilistic classifier for binary classification; the sheet lists y∈{0,1} or y∈{-1,+1}.

</details>

<details>
<summary><strong>Q68.</strong> How do you use the Bernoulli distribution for a binary target?</summary>

Use μ as the probability of class 1:<br><ol><li>If y=1, probability is μ.</li><li>If y=0, probability is 1-μ.</li><li>Keep μ=P(Y=1).</li></ol><b>Reference:</b> Ber(y|μ)=μ for y=1 and 1-μ for y=0.

</details>

<details>
<summary><strong>Q69.</strong> How do you write the Bernoulli distribution in one compact expression?</summary>

Use exponents to select the correct case:<br><ol><li>For y=1, μ^y keeps μ and (1-μ)^{1-y} becomes 1.</li><li>For y=0, μ^y becomes 1 and (1-μ)^{1-y} keeps 1-μ.</li></ol><b>Reference:</b> p(Y=y)=Ber(y|μ)=μ^y(1-μ)^{1-y}, for y∈{0,1}.

</details>

<details>
<summary><strong>Q70.</strong> How do you build the logistic-regression probability model?</summary>

Map a linear score into a Bernoulli parameter:<br><ol><li>Compute z=w^T x.</li><li>Pass z through σ(z).</li><li>Use σ(w^T x) as μ(x)=P(y=1|x).</li><li>Put that μ inside a Bernoulli distribution.</li></ol><b>Reference:</b> p(y|w,x)=Ber(y|σ(w^T x)).

</details>

<details>
<summary><strong>Q71.</strong> How do you use the logistic sigmoid function?</summary>

Use it to convert any real score into a probability-like value:<br><ol><li>Take input z.</li><li>Compute 1/(1+exp(-z)).</li><li>The output lies in [0,1].</li></ol><b>Reference:</b> σ(z)=1/(1+exp(-z)).

</details>

<details>
<summary><strong>Q72.</strong> Sigmoid key-value discriminator: what does z imply about probability?</summary>

Use the sign and size of z:<br><ol><li>z=0 gives σ(z)=0.5.</li><li>z→∞ gives σ(z)→1.</li><li>z→-∞ gives σ(z)→0.</li></ol><b>Reference:</b> Logistic regression uses σ(w^T x) to map linear combinations to [0,1].

</details>

<details>
<summary><strong>Q73.</strong> How do you classify a test input with logistic regression?</summary>

Use the fitted model and threshold:<br><ol><li>Compute p=σ(w^T x_*).</li><li>Compare p with threshold 0.5.</li><li>Assign the class according to which side of the threshold p falls on.</li></ol><b>Reference:</b> p(y=1|w,x_*)=σ(w^T x_*), and the sheet uses threshold 0.5.

</details>

<details>
<summary><strong>Q74.</strong> Decision-boundary discriminator: what linear score gives the threshold?</summary>

Ask when the predicted probability equals 0.5:<br><ol><li>σ(z)=0.5 exactly when z=0.</li><li>Here z=w^T x.</li><li>So the threshold boundary is where w^T x=0.</li></ol><b>Reference:</b> A 0.5 threshold in logistic regression induces a linear decision boundary.

</details>

<details>
<summary><strong>Q75.</strong> How do you build the iid logistic-regression likelihood?</summary>

Use the Bernoulli model per example and multiply:<br><ol><li>For each n, compute σ(w^T x_n).</li><li>Write p(y_n|w,x_n)=Ber(y_n|σ(w^T x_n)).</li><li>Use iid to take the product over all n.</li></ol><b>Reference:</b> p(y|w,X)=∏_{n=1}^N Ber(y_n|σ(w^T x_n)).

</details>

<details>
<summary><strong>Q76.</strong> How do you derive/use cross-entropy from the logistic likelihood?</summary>

Turn the Bernoulli likelihood into a minimisation objective:<br><ol><li>Start with the iid Bernoulli product.</li><li>Take the log to get a sum.</li><li>Negate it to minimise.</li><li>Use the resulting cross-entropy as NLL(w).</li></ol><b>Reference:</b> NLL(w)=-∑_{n=1}^N{y_n log σ(w^T x_n)+(1-y_n)log[1-σ(w^T x_n)]}.

</details>

<details>
<summary><strong>Q77.</strong> How do you compute the gradient of logistic-regression NLL?</summary>

Use prediction minus target:<br><ol><li>Compute σ_n=σ(w^T x_n) for each example.</li><li>Form errors σ_n-y_n.</li><li>Weight each input x_n by its error and sum.</li><li>In matrix form, stack σ_n into vector σ.</li></ol><b>Reference:</b> ∇NLL(w)=∑_{n=1}^N[σ(w^T x_n)-y_n]x_n=X^T(σ-y).

</details>

<details>
<summary><strong>Q78.</strong> How do you optimise logistic regression?</summary>

Use the same iterative optimisation machinery:<br><ol><li>Write the logistic NLL/cross-entropy.</li><li>Compute or estimate its gradient.</li><li>Minimise it with batch GD, SGD, or mini-batch SGD.</li></ol><b>Reference:</b> The sheet states SGD methods can be applied to find w that minimises logistic-regression NLL(w).

</details>

<details>
<summary><strong>Q79.</strong> How do you add regularisation to logistic regression?</summary>

Penalise the cross-entropy objective:<br><ol><li>Start from logistic NLL(w).</li><li>Choose R(w): Lasso, Ridge, or Elastic Net.</li><li>Add λR(w).</li><li>Optimise the combined objective.</li></ol><b>Reference:</b> Regularised logistic objective: NLL(w)+λR(w).

</details>

<details>
<summary><strong>Q80.</strong> Regression-to-classification connection: what distribution changes?</summary>

Ask what y can be:<br><ol><li>Continuous y: use Gaussian regression with Gaussian noise.</li><li>Binary y: use Bernoulli logistic regression with sigmoid probability.</li></ol><b>Reference:</b> Gaussian model p(y|x,w,σ²)=N(y|f(x,w),σ²); logistic model p(y|w,x)=Ber(y|σ(w^T x)).

</details>
