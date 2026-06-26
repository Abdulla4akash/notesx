---
subject: COMP64501
chapter: 14
title: "Neural Networks — Flashcards"
language: en
---

# Neural Networks — Flashcards

106 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> When do ML algorithms need derivatives?</summary>

Use: whenever an objective/model output changes with parameters and you need an optimisation direction.<br>1. Use gradients for steepest local increase/decrease.<br>2. Use Hessians when second-order curvature is needed.<br>Reference: derivatives support batch GD, SGD, and second-order optimisation; gradients are first-order sensitivities and Hessians are second-order curvature matrices.

</details>

<details>
<summary><strong>Q2.</strong> Gradient vs Hessian — what does each tell you?</summary>

Discriminator: are you asking about slope or curvature?<br>Use: gradient → direction/rate of local change; Hessian → how that gradient itself changes, i.e. curvature.<br>Reference: the gradient contains first partial derivatives; the Hessian contains second partial derivatives.

</details>

<details>
<summary><strong>Q3.</strong> Which derivative-computation method applies: manual, finite difference, symbolic, or AD?</summary>

Discriminator: what output do you want and at what cost?<br>Manual: derive formulas by hand; exact but tedious.<br>Finite difference: perturb inputs and compare outputs; easy but approximate and costly in high dimension.<br>Symbolic: manipulate expression trees to derivative expressions; exact expression but can swell.<br>AD: evaluate a program’s elementary operations with chain rule; exact numerical derivative values at a point.<br>Reference: the sheet compares manual differentiation, finite differences, symbolic differentiation, and automatic/algorithmic differentiation.

</details>

<details>
<summary><strong>Q4.</strong> How do you manually differentiate a multivariable expression with respect to one variable?</summary>

Use:<br>1. Choose the variable x_j.<br>2. Treat all other variables as constants.<br>3. Apply basic derivative rules term by term.<br>4. Repeat for each input variable if you need the full gradient.<br>Reference: a partial derivative differentiates with respect to one variable while holding the others constant.

</details>

<details>
<summary><strong>Q5.</strong> What derivative rules from the sheet should you apply mechanically?</summary>

Use: reduce each term using the simplest applicable rule.<br>1. Constant → 0.<br>2. c·x → c when c is constant.<br>3. x^a → a x^(a−1).<br>4. d(f+g)/dx = df/dx + dg/dx.<br>5. d(c f)/dx = c df/dx.<br>Reference: these are the calculus rules listed for manual differentiation.

</details>

<details>
<summary><strong>Q6.</strong> How do you form a gradient vector from partial derivatives?</summary>

Use:<br>1. List the input variables as z = [x_1,…,x_n].<br>2. Compute ∂f/∂x_i for each input.<br>3. Stack the partial derivatives in the same variable order.<br>Reference: the gradient with respect to z is [∂f/∂x_1,…,∂f/∂x_n]^T for scalar f.

</details>

<details>
<summary><strong>Q7.</strong> When is manual differentiation a bad choice?</summary>

Discriminator: would a human derivation be long or parameter-heavy?<br>Use: avoid manual differentiation when the function has many variables, complicated expressions, or many parameters; use AD/backprop instead.<br>Reference: manual differentiation becomes tedious and error-prone for complex, high-dimensional ML models.

</details>

<details>
<summary><strong>Q8.</strong> How do you approximate a single-variable derivative using finite differences?</summary>

Use:<br>1. Choose a small perturbation ε.<br>2. Evaluate h(x_0+ε) and h(x_0).<br>3. Compute [h(x_0+ε)−h(x_0)]/ε.<br>4. Treat the result as an approximation to dh/dx at x_0.<br>Reference: dh(x_0)/dx = lim_{ε→0} [h(x_0+ε)−h(x_0)]/ε.

</details>

<details>
<summary><strong>Q9.</strong> How do you approximate a partial derivative by finite differences?</summary>

Use:<br>1. Choose the coordinate x_i to differentiate.<br>2. Perturb only x_i by ε; keep all other coordinates fixed.<br>3. Compute [h(x+ε e_i)−h(x)]/ε.<br>4. Repeat for each coordinate to approximate the gradient.<br>Reference: ∂h/∂x_i is the limit of a one-coordinate perturbation quotient as ε→0.

</details>

<details>
<summary><strong>Q10.</strong> Finite differences — what is the discriminator for usefulness?</summary>

Discriminator: do you need a quick derivative check or efficient exact gradients?<br>Use finite differences to sanity-check an implementation; avoid them for large models because they are approximate and require many function evaluations.<br>Reference: finite differences are easy to implement but imprecise and expensive for large parametric models.

</details>

<details>
<summary><strong>Q11.</strong> How does symbolic differentiation work?</summary>

Use:<br>1. Represent the expression as a tree/list of operations.<br>2. Apply symbolic derivative rules mechanically to the expression structure.<br>3. Return a derivative expression, optionally simplify it.<br>Reference: symbolic differentiation manipulates mathematical expressions directly to obtain derivative expressions.

</details>

<details>
<summary><strong>Q12.</strong> Expression swell — how do you recognize it?</summary>

Discriminator: did symbolic differentiation create a much larger redundant derivative expression?<br>Use: suspect expression swell when repeated expansion creates long, hard-to-evaluate formulas with shared subexpressions duplicated.<br>Reference: expression swell is growth of symbolic derivative expressions into long, redundant forms under mechanistic symbolic differentiation.

</details>

<details>
<summary><strong>Q13.</strong> Automatic differentiation — how do you use it conceptually?</summary>

Use:<br>1. Break the program into elementary operations.<br>2. Store intermediate values from the evaluation trace.<br>3. Apply local derivative rules to each operation.<br>4. Combine them by the chain rule to get exact numerical derivatives at the chosen input.<br>Reference: AD computes exact numerical derivative values by combining elementary symbolic derivatives with intermediate numerical results.

</details>

<details>
<summary><strong>Q14.</strong> AD vs symbolic differentiation — what is the key discriminator?</summary>

Discriminator: do you output a derivative expression or derivative values at a point?<br>Symbolic differentiation outputs formulas.<br>AD outputs exact numerical derivative values for a specific evaluation, reusing intermediate values.<br>Reference: AD is concerned with exact numerical computation of derivatives rather than their full symbolic form.

</details>

<details>
<summary><strong>Q15.</strong> AD vs finite differences — what is the key discriminator?</summary>

Discriminator: do you apply the chain rule exactly or estimate by perturbation?<br>AD propagates exact local derivatives through the trace; finite differences approximate slopes from function-value differences.<br>Reference: finite differences are approximate; AD gives exact numerical derivative values up to ordinary floating-point arithmetic.

</details>

<details>
<summary><strong>Q16.</strong> How do you build an evaluation trace?</summary>

Use:<br>1. Start with input variables.<br>2. Rewrite the expression/program as named elementary operations v_1,…,v_l.<br>3. Ensure each v_i depends only on earlier variables.<br>4. Mark the final variable(s) as outputs.<br>Reference: an evaluation trace is the composition of elementary operations that produces the full expression/output.

</details>

<details>
<summary><strong>Q17.</strong> How do you read a computational graph?</summary>

Use:<br>1. Nodes are inputs, intermediate variables, or outputs.<br>2. Directed edges show which earlier values feed each operation.<br>3. Follow edges forward to evaluate values; follow edges backward to propagate sensitivities.<br>Reference: a computational graph represents the dependencies in an evaluation trace.

</details>

<details>
<summary><strong>Q18.</strong> How is general AD notation organized for f: R^n → R^m?</summary>

Use:<br>1. Treat inputs as the earliest variables in the trace.<br>2. Treat v_1,…,v_l as intermediate variables.<br>3. Treat the final trace variables as outputs y_1,…,y_m.<br>Reference: the sheet uses input variables, intermediate variables v_i, and final trace variables corresponding to outputs.

</details>

<details>
<summary><strong>Q19.</strong> How do you construct a Jacobian matrix?</summary>

Use:<br>1. Identify outputs y_i=f_i(x_1,…,x_n), i=1,…,m.<br>2. Identify inputs x_j, j=1,…,n.<br>3. Put ∂f_i/∂x_j in row i, column j.<br>Reference: the Jacobian J is an m×n matrix with entries J_ij = ∂f_i/∂x_j.

</details>

<details>
<summary><strong>Q20.</strong> Forward-mode AD — what is the step-by-step method?</summary>

Use:<br>1. Run the primal trace forward to compute each v_i.<br>2. Attach a tangent dot(v_i) to each v_i.<br>3. Initialize input tangents to select the input direction.<br>4. For each operation, compute its output tangent using local derivative rules.<br>5. Read output tangents as derivatives in that input direction.<br>Reference: forward mode builds a tangent trace alongside the forward primal trace.

</details>

<details>
<summary><strong>Q21.</strong> Tangent trace vs primal trace — what is the discriminator?</summary>

Discriminator: value or derivative?<br>Primal trace computes the intermediate values v_i.<br>Tangent trace computes dot(v_i), the derivative of each v_i with respect to the selected input/direction.<br>Reference: forward-mode AD associates dot(v_i)=∂v_i/∂x_k with each intermediate variable for the chosen input x_k.

</details>

<details>
<summary><strong>Q22.</strong> How do you initialize forward mode to get ∂y/∂x_i?</summary>

Use:<br>1. Set dot(x_i)=1.<br>2. Set dot(x_k)=0 for every other input k≠i.<br>3. Run the tangent trace forward.<br>4. Read dot(y_j) as ∂y_j/∂x_i.<br>Reference: one forward pass with a one-hot input tangent computes one Jacobian column.

</details>

<details>
<summary><strong>Q23.</strong> How does forward mode compute the full Jacobian?</summary>

Use:<br>1. For each input x_i, run one forward pass with dot(x_i)=1 and other input tangents 0.<br>2. The output tangents from that pass form column i of J.<br>3. Repeat for all n inputs.<br>Reference: forward mode requires n forward passes to compute the whole Jacobian of f: R^n → R^m.

</details>

<details>
<summary><strong>Q24.</strong> When is forward mode preferred?</summary>

Discriminator: are there few inputs and many outputs?<br>Use forward mode when n is small, especially f: R → R^m, because one pass gives derivatives of all outputs with respect to the input.<br>Reference: forward mode is efficient for f: R → R^m but needs n passes for f: R^n → R.

</details>

<details>
<summary><strong>Q25.</strong> Reverse-mode AD — what is the step-by-step method?</summary>

Use:<br>1. Forward pass: compute and store all intermediate values and graph dependencies.<br>2. Seed the chosen output adjoint with 1.<br>3. Traverse operations backward.<br>4. For each parent variable, add downstream adjoint × local derivative.<br>5. Read input adjoints as output gradients with respect to inputs.<br>Reference: reverse mode propagates derivatives backwards from a chosen output using adjoints.

</details>

<details>
<summary><strong>Q26.</strong> Adjoint in reverse mode — how do you use it?</summary>

Use: interpret bar(v_i) as “how much the chosen output changes if v_i changes.”<br>During backprop, update each parent by summing contributions from all children that depend on it.<br>Reference: bar(v_i)=∂y_j/∂v_i is the sensitivity of output y_j to intermediate variable v_i.

</details>

<details>
<summary><strong>Q27.</strong> Reverse-mode multi-path dependency — what must you do?</summary>

Discriminator: does a variable feed several downstream nodes?<br>Use: sum all path contributions: bar(v)=Σ_child bar(child)·∂child/∂v.<br>Reference: if a variable contributes to the output through several downstream paths, its adjoint is the sum of those contributions.

</details>

<details>
<summary><strong>Q28.</strong> How do you start and finish a reverse pass for a scalar output?</summary>

Use:<br>1. Seed the output with bar(y)=∂y/∂y=1.<br>2. Backpropagate adjoints through the graph.<br>3. At the inputs, read bar(x_i)=∂y/∂x_i.<br>Reference: reverse-mode AD starts from the output adjoint and ends with input adjoints equal to gradient components.

</details>

<details>
<summary><strong>Q29.</strong> When is reverse mode preferred?</summary>

Discriminator: are there many inputs and few outputs?<br>Use reverse mode when n≫m, especially scalar-loss ML models with many parameters.<br>Reference: reverse mode performs better for f: R^n → R^m when n≫m, but stores intermediate values from the forward trace.

</details>

<details>
<summary><strong>Q30.</strong> Forward mode vs reverse mode — one-pass discriminator?</summary>

Discriminator: which dimension does one pass cover?<br>Forward pass with one-hot tangent → one Jacobian column, tied to one input.<br>Reverse pass from one output → one Jacobian row/gradient of that output, tied to one output.<br>Reference: forward mode scales with number of inputs; reverse mode scales with number of outputs.

</details>

<details>
<summary><strong>Q31.</strong> Why is reverse-mode AD called backpropagation in neural networks?</summary>

Use: when the computation graph is a neural network loss, reverse-mode AD’s backward adjoint pass is exactly the gradient-propagation procedure used for parameter updates.<br>Reference: in machine learning, reverse-mode AD is called backpropagation.

</details>

<details>
<summary><strong>Q32.</strong> What common ML tools implement AD/backprop?</summary>

Use: recognize PyTorch, TensorFlow, and JAX as mainstream AD implementations for ML workflows.<br>Reference: the sheet highlights PyTorch, TensorFlow, and JAX as popular AD implementations in the ML community.

</details>

<details>
<summary><strong>Q33.</strong> How is logistic regression a neural unit?</summary>

Use:<br>1. Compute a linear pre-activation z=w^T x+b.<br>2. Apply a nonlinear activation, typically sigmoid for binary output.<br>3. Interpret the output as P(y=1|x,w,b).<br>Reference: a neural unit computes a linear function of its input followed by a nonlinear activation function.

</details>

<details>
<summary><strong>Q34.</strong> Sigmoid unit — how do you use and differentiate it?</summary>

Use: apply sigmoid when a scalar pre-activation should become a probability-like output in (0,1).<br>Derivative shortcut: if a=σ(z), then da/dz=a(1−a).<br>Reference: σ(z)=1/(1+e^(−z)) and σ′(z)=σ(z)(1−σ(z)).

</details>

<details>
<summary><strong>Q35.</strong> Logistic regression vs MLP — what is the discriminator?</summary>

Discriminator: is the decision boundary only one affine separator or can hidden layers transform the space?<br>Logistic regression: affine pre-activation plus sigmoid; linear separating surface.<br>MLP: at least one hidden layer plus nonlinear activations; can create nonlinear decision regions.<br>Reference: the sheet motivates MLPs because a single linear boundary can fail on nonlinear class structure.

</details>

<details>
<summary><strong>Q36.</strong> How do you recognize a multi-layer perceptron?</summary>

Use: look for input layer → one or more hidden layers → output layer, with nonlinear hidden activations and trainable weights/biases between layers.<br>Reference: an MLP extends logistic regression by adding at least one hidden layer.

</details>

<details>
<summary><strong>Q37.</strong> Neural-network notation — what does W^(k)_ij mean?</summary>

Use: read superscript k as the layer; read subscript ij as the connection from unit j in the previous layer to unit i in layer k.<br>Reference: W^(k)_ij denotes the weight on the link from unit j to unit i in the k-th layer.

</details>

<details>
<summary><strong>Q38.</strong> Pre-activation vs activation — what is the discriminator?</summary>

Discriminator: before or after the nonlinearity?<br>z_i^(k): affine input to unit i in layer k.<br>a_i^(k): output after applying the activation function.<br>Reference: z denotes pre-activation; a denotes activation.

</details>

<details>
<summary><strong>Q39.</strong> How do you perform a layer forward pass in an MLP/feedforward net?</summary>

Use:<br>1. Take previous activations a^(l−1).<br>2. Compute z^(l)=W^(l)a^(l−1)+b^(l).<br>3. Compute a^(l)=h_l(z^(l)) element-wise or as defined.<br>4. Pass a^(l) to the next layer.<br>Reference: feedforward layer equations are z^(l)=W^(l)a^(l−1)+b^(l), a^(l)=h_l(z^(l)).

</details>

<details>
<summary><strong>Q40.</strong> How do you compute the output of a one-hidden-layer binary MLP?</summary>

Use:<br>1. Hidden pre-activation: z^(2)=W^(2)x+b^(2).<br>2. Hidden activation: a^(2)=h(z^(2)).<br>3. Output pre-activation: z^(3)=W^(3)a^(2)+b^(3).<br>4. Prediction: a^(3)=σ(z^(3)).<br>Reference: the sheet’s toy MLP uses hidden nonlinear activations followed by a sigmoid output.

</details>

<details>
<summary><strong>Q41.</strong> Binary cross-entropy — how do you apply it to one example?</summary>

Use: for target y and prediction ŷ, penalize confident wrong probability by computing −[y log ŷ +(1−y)log(1−ŷ)].<br>Reference: E_n=−(y_n log ŷ_n +(1−y_n)log(1−ŷ_n)).

</details>

<details>
<summary><strong>Q42.</strong> How do you chain gradients through a binary MLP output?</summary>

Use:<br>1. Differentiate loss with respect to output activation.<br>2. Multiply by derivative of output activation with respect to output pre-activation.<br>3. Continue through output weights, hidden activations, hidden pre-activations, and earlier weights.<br>Reference: the sheet combines ∂E/∂a^(L), ∂a^(L)/∂z^(L), ∂z/∂a, and ∂a/∂z using the chain rule.

</details>

<details>
<summary><strong>Q43.</strong> Cross-entropy + sigmoid — what simplification should you use?</summary>

Use: if binary cross-entropy is paired with sigmoid output a, set the output pre-activation error to δ = a−y; the sigmoid derivative cancels the loss denominator.<br>Reference: ∂E/∂a=(a−y)/(a(1−a)) and ∂a/∂z=a(1−a), so ∂E/∂z=a−y.

</details>

<details>
<summary><strong>Q44.</strong> How do you differentiate tanh activations?</summary>

Use: if a=tanh(z), replace da/dz with 1−a^2, or 1−tanh^2(z). For a vector activation applied element-wise, put these terms on the diagonal Jacobian.<br>Reference: tanh′(x)=1−tanh^2(x).

</details>

<details>
<summary><strong>Q45.</strong> How do you compute an output-layer weight gradient?</summary>

Use:<br>1. Compute output pre-activation error δ_i^(L)=∂E/∂z_i^(L).<br>2. Identify the previous activation a_j^(L−1) feeding the weight.<br>3. Multiply: ∂E/∂w_ij^(L)=δ_i^(L) a_j^(L−1).<br>Reference: for z_i^(l)=Σ_j w_ij^(l)a_j^(l−1)+b_i^(l), ∂E/∂w_ij^(l)=∂E/∂z_i^(l) · a_j^(l−1).

</details>

<details>
<summary><strong>Q46.</strong> How do you compute a hidden-layer weight gradient?</summary>

Use:<br>1. Backpropagate the downstream error to get δ_i^(l)=∂E/∂z_i^(l).<br>2. Identify the incoming activation a_j^(l−1).<br>3. Multiply: ∂E/∂w_ij^(l)=δ_i^(l)a_j^(l−1).<br>Reference: hidden-layer gradients use the same parameter-gradient rule once δ^(l) has been computed by the chain rule.

</details>

<details>
<summary><strong>Q47.</strong> Why can an MLP make a nonlinear decision boundary?</summary>

Use: hidden activations transform the original input coordinates into a learned representation, then the output layer separates in that transformed space.<br>Reference: the sheet compares original input space with hidden representation and notes that MLPs can create nonlinear decision regions.

</details>

<details>
<summary><strong>Q48.</strong> How do you recognize a feedforward neural network?</summary>

Use: information flows from earlier layers to later layers only; there are no recurrent feedback loops.<br>Reference: a feedforward network extends the MLP architecture to any finite number L of layers, with input-to-output flow.

</details>

<details>
<summary><strong>Q49.</strong> Full feedforward pass — what is the procedure?</summary>

Use:<br>1. Set a^(1)=x.<br>2. For l=2,…,L compute z^(l)=W^(l)a^(l−1)+b^(l).<br>3. Compute a^(l)=h_l(z^(l)).<br>4. Evaluate E(a^(L),y).<br>Reference: these are the forward equations for a general feedforward neural network.

</details>

<details>
<summary><strong>Q50.</strong> Backprop output layer — how do you compute δ^(L)?</summary>

Use:<br>1. Differentiate the error with respect to the output activation, ∂E/∂a^(L).<br>2. Multiply by the activation Jacobian, ∂a^(L)/∂z^(L).<br>3. Call the result δ^(L)=∂E/∂z^(L).<br>Reference: ∂E/∂z^(L)=∂E/∂a^(L) · ∂a^(L)/∂z^(L).

</details>

<details>
<summary><strong>Q51.</strong> Element-wise activation Jacobian — what is the discriminator?</summary>

Discriminator: does each activation component depend only on its own pre-activation?<br>If yes, the Jacobian is diagonal; off-diagonal derivatives are zero.<br>Reference: when h_l is applied element-wise, ∂a^(l)/∂z^(l) is a diagonal Jacobian.

</details>

<details>
<summary><strong>Q52.</strong> Backprop hidden layer — how do you compute δ^(l)?</summary>

Use:<br>1. Start from the next-layer error δ^(l+1)=∂E/∂z^(l+1).<br>2. Propagate through next-layer weights W^(l+1).<br>3. Multiply by the activation Jacobian ∂a^(l)/∂z^(l).<br>4. The result is δ^(l)=∂E/∂z^(l).<br>Reference: ∂E/∂z^(l)=∂E/∂z^(l+1) · W^(l+1) · ∂a^(l)/∂z^(l), using the sheet’s convention.

</details>

<details>
<summary><strong>Q53.</strong> How do you get gradients with respect to W^(l) and b^(l)?</summary>

Use:<br>1. Compute δ^(l)=∂E/∂z^(l).<br>2. For each weight: ∂E/∂w_ij^(l)=δ_i^(l)a_j^(l−1).<br>3. For each bias: ∂E/∂b_i^(l)=δ_i^(l).<br>4. In matrix form, use an outer product with consistent row/column convention.<br>Reference: ∂E/∂W^(l)=(a^(l−1) ∂E/∂z^(l))^T and ∂E/∂b^(l)=∂E/∂z^(l) under the slide convention.

</details>

<details>
<summary><strong>Q54.</strong> Backpropagation summary — what sequence should you run?</summary>

Use:<br>1. Forward pass: compute all z^(l), a^(l), then E.<br>2. Output backward step: compute δ^(L).<br>3. Hidden backward steps: compute δ^(l) from δ^(l+1).<br>4. Parameter gradients: form ∂E/∂W^(l) and ∂E/∂b^(l).<br>5. Use an optimiser to update parameters.<br>Reference: the sheet’s central equations combine feedforward computation with backward gradients for each layer.

</details>

<details>
<summary><strong>Q55.</strong> Backprop running time — what drives it?</summary>

Use: count matrix multiplications across fully connected layers in both forward and backward passes; each layer contributes computation in both directions.<br>Reference: gradient computation involves as many matrix multiplications as there are fully connected layers, plus forward and backward operations.

</details>

<details>
<summary><strong>Q56.</strong> Backprop space requirement — what must be stored?</summary>

Use: store enough forward-pass values to reuse in the backward pass.<br>For each layer, keep a^(l), z^(l), and δ^(l)=∂E/∂z^(l).<br>Reference: the sheet lists activations, pre-activations, and layer errors as storage requirements for backpropagation.

</details>

<details>
<summary><strong>Q57.</strong> Mini-batches — how do they change neural-network computation?</summary>

Use: replace single-example vectors with batched tensors/matrices and compute many examples together; ensure parameters and activations fit in GPU memory.<br>Reference: mini-batches process multiple examples together using tensor operations; parameters must fit in GPU memory.

</details>

<details>
<summary><strong>Q58.</strong> SGD update — what is the procedure?</summary>

Use:<br>1. Choose a sample or mini-batch.<br>2. Compute its gradient ∇E_n(w).<br>3. Set Δw=−η∇E_n(w).<br>4. Update w ← w+Δw.<br>Reference: SGD uses Δw^(τ−1)=−η∇E_n(w^(τ−1)) and w^(τ)=w^(τ−1)+Δw^(τ−1).

</details>

<details>
<summary><strong>Q59.</strong> Training epoch — how do you recognize one?</summary>

Use: count one epoch after the training procedure has made a complete pass through the entire training set, regardless of mini-batch size.<br>Reference: a training epoch is a complete pass through the whole training set.

</details>

<details>
<summary><strong>Q60.</strong> Stationary point, local minimum, global minimum — what is the discriminator?</summary>

Discriminator: gradient zero, or minimum relative to what set?<br>Stationary point: gradient vanishes.<br>Local minimum: lower than nearby points but not necessarily best overall.<br>Global minimum: smallest error over the whole weight space.<br>Reference: the sheet distinguishes stationary points, local minima, and global minima on an error surface E(w).

</details>

<details>
<summary><strong>Q61.</strong> Why does parameter initialization matter?</summary>

Use: treat initialization as part of the training method because it affects convergence and generalisation; avoid choices that cause identical units or unstable variance.<br>Reference: parameter initialization has a significant effect on convergence and generalisation performance.

</details>

<details>
<summary><strong>Q62.</strong> Symmetry breaking — what is the discriminator?</summary>

Discriminator: are multiple parameters/units initialized identically?<br>If yes, they receive identical updates and learn the same features; use random initialization to break symmetry.<br>Reference: if parameters are initialized with the same values, they receive the same updates.

</details>

<details>
<summary><strong>Q63.</strong> What initialization distributions are suggested?</summary>

Use: initialize randomly using either a uniform interval around zero or a zero-mean Gaussian, then choose the scale carefully.<br>Reference: the sheet suggests uniform initialization on [−ε,ε] or Gaussian initialization N(0,ε^2).

</details>

<details>
<summary><strong>Q64.</strong> He initialization — how do you compute the scale for a ReLU layer?</summary>

Use:<br>1. Let M be the number of inputs feeding a unit.<br>2. For ReLU activations with zero-mean Gaussian weights, require (M/2)ε^2=1 to preserve variance.<br>3. Solve ε=sqrt(2/M).<br>Reference: He initialization sets the weight scale ε=sqrt(2/M) for the ReLU-layer variance calculation in the sheet.

</details>

<details>
<summary><strong>Q65.</strong> Normalization — why use it?</summary>

Use: normalize when raw values or activations may become extremely large or small; rescale/recenter them before further computation.<br>Reference: normalization removes the need to deal with extremely large or extremely small values.

</details>

<details>
<summary><strong>Q66.</strong> Data normalization — what is the procedure for continuous inputs?</summary>

Use:<br>1. For each feature i, compute mean μ_i across the dataset.<br>2. Compute variance σ_i^2 across the dataset.<br>3. Replace each x_ni by (x_ni−μ_i)/σ_i.<br>Reference: data normalization recentres and rescales each continuous input feature.

</details>

<details>
<summary><strong>Q67.</strong> Batch normalization — what is the procedure?</summary>

Use:<br>1. For each unit/channel i, compute mean and variance of pre-activations z_ni across the mini-batch.<br>2. Normalize z_ni using those mini-batch statistics.<br>3. Apply learned scale and shift γ_i, β_i.<br>Reference: batch normalization normalizes pre-activations within a mini-batch separately for each hidden unit.

</details>

<details>
<summary><strong>Q68.</strong> Layer normalization — what is the procedure?</summary>

Use:<br>1. For each data point n, compute mean and variance across its hidden-unit values.<br>2. Normalize each z_ni using statistics from that same data point.<br>3. Apply learned scale and shift parameters.<br>Reference: layer normalization normalizes across hidden units separately for each data point.

</details>

<details>
<summary><strong>Q69.</strong> Batch norm vs layer norm — what is the discriminator?</summary>

Discriminator: across examples or across units?<br>Batch norm: statistics across the mini-batch for each unit/channel.<br>Layer norm: statistics across hidden units for each individual data point.<br>Reference: the sheet’s visual distinction is batch-wise per hidden unit vs layer-wise per data point.

</details>

<details>
<summary><strong>Q70.</strong> SGD oscillations — when should momentum help?</summary>

Discriminator: are updates bouncing back and forth across an elongated error surface?<br>Use momentum to add inertia, smooth oscillations, and combine the current gradient step with the previous update direction.<br>Reference: fixed step-size SGD can oscillate; momentum smooths motion through weight space.

</details>

<details>
<summary><strong>Q71.</strong> Momentum update — what is the procedure?</summary>

Use:<br>1. Compute current gradient g=∇E_n(w).<br>2. Scale the negative gradient by learning rate: −ηg.<br>3. Add μ times the previous update Δw_prev.<br>4. Update w with the resulting Δw.<br>Reference: Δw^(τ−1)=−η∇E_n(w^(τ−1))+μΔw^(τ−2).

</details>

<details>
<summary><strong>Q72.</strong> AdaGrad vs RMSProp vs Adam — what is the discriminator?</summary>

Discriminator: what moving quantity controls the update?<br>AdaGrad: cumulative sum of squared gradients.<br>RMSProp: exponential moving average of squared gradients.<br>Adam: moving average of gradients plus moving average of squared gradients, with bias correction.<br>Reference: the sheet presents AdaGrad, RMSProp, and Adam as adaptive-gradient methods.

</details>

<details>
<summary><strong>Q73.</strong> AdaGrad — what is the update method?</summary>

Use for each parameter w_i:<br>1. Accumulate squared gradient: r_i ← r_i + g_i^2.<br>2. Scale learning rate by 1/(sqrt(r_i)+ε).<br>3. Update w_i ← w_i − η g_i/(sqrt(r_i)+ε).<br>Reference: AdaGrad reduces each parameter’s learning rate using accumulated squared gradients.

</details>

<details>
<summary><strong>Q74.</strong> RMSProp — what is the update method?</summary>

Use for each parameter w_i:<br>1. Compute gradient g_i.<br>2. Update moving average r_i ← βr_i +(1−β)g_i^2.<br>3. Update w_i ← w_i − η g_i/(sqrt(r_i)+ε).<br>Reference: RMSProp replaces AdaGrad’s cumulative sum with an exponential moving average of squared gradients.

</details>

<details>
<summary><strong>Q75.</strong> Adam — what is the update method?</summary>

Use for each parameter w_i:<br>1. Compute gradient g_i.<br>2. Update first moment s_i ← β_1s_i +(1−β_1)g_i.<br>3. Update second moment r_i ← β_2r_i +(1−β_2)g_i^2.<br>4. Bias-correct s_i and r_i.<br>5. Update w_i ← w_i − η ŝ_i/(sqrt(r̂_i)+ε).<br>Reference: Adam uses moving averages of both gradients and squared gradients.

</details>

<details>
<summary><strong>Q76.</strong> Adam bias correction — how do you apply it?</summary>

Use: divide early moving averages by their missing-mass factors before the parameter step.<br>ŝ_i^(τ)=s_i^(τ)/(1−β_1^τ); r̂_i^(τ)=r_i^(τ)/(1−β_2^τ).<br>Reference: the sheet gives bias-corrected first and second moments before the Adam update.

</details>

<details>
<summary><strong>Q77.</strong> L2 regularization — how does it change the objective and gradient?</summary>

Use:<br>1. Add (λ/2)w^T w to the original error E(w).<br>2. Differentiate: add λw to the original gradient.<br>3. Update using the regularized gradient.<br>Reference: Ẽ(w)=E(w)+(λ/2)w^T w and ∇Ẽ(w)=∇E(w)+λw.

</details>

<details>
<summary><strong>Q78.</strong> Weight decay — what effect should you expect?</summary>

Use: interpret weight decay as a force pulling weights toward zero unless the data-supported gradient keeps them large.<br>Reference: weight decay encourages weights to decay towards zero unless supported by the data.

</details>

<details>
<summary><strong>Q79.</strong> AdamW — how is the update different from Adam?</summary>

Discriminator: is weight decay coupled into the adaptive gradient or added as a separate decay term?<br>Use AdamW by taking the Adam adaptive step and adding a separate λw term inside the overall learning-rate step.<br>Reference: AdamW is Adam with decoupled weight decay; w_i ← w_i − η(ŝ_i/(sqrt(r̂_i)+δ)+λw_i).

</details>

<details>
<summary><strong>Q80.</strong> Residual connections — when do they help?</summary>

Discriminator: is a very deep plain network hard to optimise or showing unstable/shattered gradients?<br>Use residual shortcuts to give gradients and information an identity path across layers.<br>Reference: residual connections improve gradient structure and make deep networks easier to optimise.

</details>

<details>
<summary><strong>Q81.</strong> Residual block — what computation does it perform?</summary>

Use:<br>1. Send input x through learned layers to compute F(x).<br>2. Carry x forward through an identity shortcut.<br>3. Add them: output = F(x)+x.<br>Reference: a ResNet block computes F(x)+x using an identity shortcut.

</details>

<details>
<summary><strong>Q82.</strong> Stacked residual connections — what is the general recurrence?</summary>

Use: for block t, compute z_t = F_t(z_(t−1)) + z_(t−1). Repeat this across blocks so each block learns a residual correction to its input.<br>Reference: the sheet writes residual connections as each block output equal to a learned transform plus the previous activation.

</details>

<details>
<summary><strong>Q83.</strong> Plain deep network vs ResNet — what is the discriminator?</summary>

Discriminator: does each block have an identity shortcut?<br>Plain network: layers feed only through learned transformations.<br>ResNet: learned transformation plus shortcut F(x)+x; shortcuts may adjust dimensions when needed.<br>Reference: the sheet compares plain networks with residual networks and shows residual blocks with identity shortcuts.

</details>

<details>
<summary><strong>Q84.</strong> Dropout — what is the training-time procedure?</summary>

Use:<br>1. During training, randomly delete selected nodes.<br>2. Remove their incident connections for that pass.<br>3. Train the remaining thinned network.<br>4. Use dropout as regularization against overfitting.<br>Reference: dropout randomly deletes nodes and their connections during training.

</details>

<details>
<summary><strong>Q85.</strong> Dropout placement — what is the discriminator?</summary>

Discriminator: hidden/input node or output node?<br>Apply dropout to hidden nodes and input nodes; do not apply it to output nodes in the sheet’s description.<br>Reference: dropout is applied to hidden and input nodes, but not output nodes.

</details>

<details>
<summary><strong>Q86.</strong> Structured vs unstructured input — what is the discriminator?</summary>

Discriminator: do the input coordinates have known relationships?<br>Unstructured vector: treat x=(x_1,…,x_D) as unrelated coordinates.<br>Structured input: exploit relationships such as spatial grids or sequences in the model architecture.<br>Reference: CNNs exploit spatial relationships in images; sequence models exploit order in language.

</details>

<details>
<summary><strong>Q87.</strong> Receptive field — how do you apply the idea?</summary>

Use: connect a hidden unit to a local patch of the input instead of the whole input when locality matters, such as images.<br>Reference: a receptive field is a small rectangular region/patch used to capture locality.

</details>

<details>
<summary><strong>Q88.</strong> 2D convolution — what is the step-by-step operation?</summary>

Use:<br>1. Place filter K over a local input patch of I.<br>2. Multiply corresponding input and filter entries.<br>3. Sum the products to produce one output C(j,k).<br>4. Slide the filter to every valid location according to stride/padding.<br>Reference: convolution forms an output feature map by sliding a kernel over local input patches and summing element-wise products.

</details>

<details>
<summary><strong>Q89.</strong> Formal convolution formula — how do you read it?</summary>

Use: for output location (j,k), sum over filter offsets (l,m): input at shifted location times kernel entry.<br>Reference: C(j,k)=Σ_l Σ_m I(j+l,k+m)K(l,m), where I is input, K is filter/kernel, and C is the feature map.

</details>

<details>
<summary><strong>Q90.</strong> Convolutional unit output — where is the nonlinearity?</summary>

Use:<br>1. Compute the local affine/convolution response w^T x+w_0 on a receptive field.<br>2. Apply ReLU to get the unit output.<br>Reference: the sheet writes a convolutional unit as z=ReLU(w^T x+w_0).

</details>

<details>
<summary><strong>Q91.</strong> Padding — what does it do?</summary>

Discriminator: are extra border pixels being added before convolution?<br>Use padding P to add pixels around the image, often zeros, so filters can cover border regions and control output size.<br>Reference: padding adds P pixels around the outside of the original image; one purpose is allowing the feature map to match the original dimension.

</details>

<details>
<summary><strong>Q92.</strong> Stride — what does it do?</summary>

Discriminator: how far does the filter move after each placement?<br>Use stride S as the step size of the filter horizontally/vertically; larger stride samples fewer positions and reduces spatial resolution.<br>Reference: stride is the number of pixels by which the filter moves over the image at each step.

</details>

<details>
<summary><strong>Q93.</strong> Padding vs stride — headline discriminator?</summary>

Discriminator: border expansion or movement step?<br>Padding changes the effective input size by adding a border.<br>Stride changes how densely the filter is applied.<br>Reference: padding adds outside pixels; stride is the filter movement per step.

</details>

<details>
<summary><strong>Q94.</strong> Convolution output shape — how do you compute it?</summary>

Use:<br>1. Let input height/width be J×K.<br>2. Let square filter size be M×M.<br>3. Let padding be P and stride be S.<br>4. Output size is floor((J+2P−M)/S + 1) × floor((K+2P−M)/S + 1).<br>Reference: this is the feature-map shape formula given for equal horizontal/vertical stride.

</details>

<details>
<summary><strong>Q95.</strong> Multi-channel convolution — what dimensions must match?</summary>

Use:<br>1. If input is J×K×C, each filter must span all C input channels.<br>2. Use filter shape M×M×C for one output feature map.<br>3. Sum across spatial offsets and channels at each output location.<br>Reference: for C input channels, the filter has dimensionality M×M×C.

</details>

<details>
<summary><strong>Q96.</strong> Multiple convolution output channels — how do you create them?</summary>

Use:<br>1. Use C_OUT independent filters.<br>2. Each filter spans M×M×C.<br>3. Stack the resulting C_OUT feature maps as the output channels.<br>Reference: a filter bank has dimensionality M×M×C×C_OUT, where C_OUT is the number of output channels.

</details>

<details>
<summary><strong>Q97.</strong> CNN output volume from several filters — what is the procedure?</summary>

Use:<br>1. Apply each filter across the padded/strided input volume.<br>2. Add that filter’s bias to its responses.<br>3. Each filter produces one feature map.<br>4. Stack feature maps into the output volume.<br>Reference: the sheet’s CNN visual example shows input volume, filter weights, bias terms, and output volume.

</details>

<details>
<summary><strong>Q98.</strong> Max pooling — what is the procedure?</summary>

Use:<br>1. Choose a pooling window and stride.<br>2. Slide the window across each feature map.<br>3. Replace each window by its maximum value.<br>4. This downsamples spatial resolution while keeping channels conceptually separate.<br>Reference: the sheet shows max pooling as a spatial downsampling operation after convolution/ReLU blocks.

</details>

<details>
<summary><strong>Q99.</strong> How do you read a deep CNN/VGG-style stack?</summary>

Use: follow repeated blocks of convolution → ReLU → pooling, then fully connected-style layers → ReLU, then final class activation such as softmax.<br>Reference: the sheet uses a VGG-style architecture to show convolution/ReLU blocks, max pooling, fully connected layers, and softmax output.

</details>

<details>
<summary><strong>Q100.</strong> Softmax in a CNN classifier — where does it fit?</summary>

Use: apply softmax at the final classification layer when the network outputs scores over multiple classes.<br>Reference: the deep CNN architecture slide ends with a softmax activation after learned feature extraction and fully connected-style layers.

</details>

<details>
<summary><strong>Q101.</strong> Why can more layers give worse plain networks?</summary>

Use: recognize the optimisation problem: deeper plain nets can have worse training/validation behaviour because gradients and error landscapes become harder to manage; residual shortcuts mitigate this.<br>Reference: the ResNet section compares plain and residual networks and motivates residual blocks for deeper models.

</details>

<details>
<summary><strong>Q102.</strong> Dotted shortcuts in ResNets — what do they signal?</summary>

Use: when the shortcut must connect tensors with different dimensions, use a dimension-changing shortcut rather than a pure same-shape identity.<br>Reference: the sheet notes dotted shortcuts are used to increase dimensions in the residual-network diagram.

</details>

<details>
<summary><strong>Q103.</strong> Automatic differentiation → backpropagation — how are the lectures connected?</summary>

Use: map the general reverse-mode AD algorithm onto neural networks: computational graph = network/loss; adjoints = layer errors; reverse pass = backpropagation.<br>Reference: the sheet explicitly connects reverse-mode AD to backpropagation for training neural networks.

</details>

<details>
<summary><strong>Q104.</strong> Logistic regression → MLP — what is the conceptual upgrade?</summary>

Use: start from affine + sigmoid logistic regression; add hidden nonlinear layers to transform representation before the output classifier.<br>Reference: the neural-network lecture motivates MLPs from the limitation of logistic regression’s linear decision boundary.

</details>

<details>
<summary><strong>Q105.</strong> SGD → momentum/adaptive optimisers — what changes?</summary>

Use: SGD uses only the current gradient; momentum adds previous update direction; adaptive methods rescale by accumulated or moving squared-gradient information; Adam also averages gradients.<br>Reference: the sheet builds from SGD to momentum, then AdaGrad, RMSProp, Adam, and AdamW.

</details>

<details>
<summary><strong>Q106.</strong> Feedforward networks → CNNs — what changes in the architecture?</summary>

Use: replace treating inputs as unrelated coordinates with local, shared-filter operations that exploit spatial structure.<br>Reference: the sheet motivates CNNs by moving from unstructured vectors to structured image inputs with spatial relationships.

</details>
