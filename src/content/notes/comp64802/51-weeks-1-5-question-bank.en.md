---
subject: COMP64802
chapter: 51
title: "Weeks 1–5 — Question Bank"
language: en
---

# COMP64802 Weeks 1–5 — Worked Practice Question Bank

Source: uploaded lecture sheet `COMP64802 Chapter 1 - Weeks 1-5.mht`.

## What the sheet actually contains

The computational/procedural task types in the sheet are:

1. Converting real-world objects into high-dimensional vector dimensions.
2. Computing high-dimensional cube geometry: diagonal length and the inner-sphere radius formula.
3. Checking probability densities and computing probability mass over events.
4. Writing population risk and empirical risk from loss functions and samples.
5. Computing Euclidean norms.
6. Checking convexity and recognising convex functions with/without finite minimisers.
7. Setting up Lagrangians and first-order optimality conditions for constrained convex optimisation.
8. Recognising non-convex neural-network losses.
9. Computing eigenvalues, spectral radius, and spectral norm in the lecture's tricky matrix example.
10. Deriving and unrolling gradient descent recurrences.
11. Analysing gradient descent on the scalar quadratic and the Mexican-hat objective.
12. Extending the Mexican-hat recurrence to a matrix/Frobenius-norm analogue.
13. Applying the Johnson–Lindenstrauss property and dimensional scaling.
14. Building sketched linear-regression objectives and proving expected loss preservation.
15. Computing affine/ReLU layer outputs and constructing the ReLU max network.
16. Distinguishing architecture diagrams from actual neural functions.
17. Computing autoencoder hidden codes, reconstructions, and losses.
18. Proving the special sparse-coding autoencoder zero-loss case.
19. Setting up latent-variable marginal distributions and posterior distributions.
20. Computing KL divergence.
21. Deriving ELBO/VFE and connecting VAE mathematics to code variables.

---

# Section A — Mechanical / single-step drills

## Q1. Vectorising data: image dimension

An image has height $28$, width $28$, and one grayscale value per pixel. Treating it as a vector, what space does it live in?

### Solution

**Step 1 — Count scalar coordinates.**  
Each pixel contributes one scalar value.

$$28\times 28 = 784.$$

**Step 2 — State the vector space.**  
The image is represented by a vector with 784 real coordinates.

$$x\in \mathbb{R}^{784}.$$

**Answer.**  
The image lives in $\mathbb{R}^{784}$.

---

## Q2. High-dimensional cube diagonal and inner-sphere radius

For the $d$-dimensional cube $[-1,1]^d$, compute the diagonal length and the lecture's inner-sphere radius when $d=9$.

### Solution

**Step 1 — Use the side length.**  
The cube $[-1,1]^d$ has side length $2$.

**Step 2 — Compute the diagonal.**  
By Pythagoras in $d$ dimensions,

$$\text{diagonal}=\sqrt{2^2+\cdots+2^2}=2\sqrt d.$$

For $d=9$,

$$2\sqrt 9=2\cdot 3=6.$$

**Step 3 — Use the lecture's radius formula.**  
The outer sphere radius is $1/2$, and the centre-to-centre distance is $\sqrt d/2$.

$$r+\frac12=\frac{\sqrt d}{2}.$$

So,

$$r=\frac12(\sqrt d-1).$$

For $d=9$,

$$r=\frac12(3-1)=1.$$

**Answer.**  
The diagonal is $6$, and the inner-sphere radius is $1$.

---

## Q3. Checking a uniform density and event probability

Let

$$p(x)=\begin{cases}1/4,&x\in[-2,2],\\0,&\text{otherwise.}\end{cases}$$

Check that $p$ integrates to $1$, then compute $\mathbb{P}(0\le x\le 1)$.

### Solution

**Step 1 — Integrate only where the density is nonzero.**

$$\int_{-\infty}^{\infty}p(x)\,dx=\int_{-2}^{2}\frac14\,dx.$$

**Step 2 — Compute the total mass.**

$$\int_{-2}^{2}\frac14\,dx=\frac14(2-(-2))=\frac14\cdot4=1.$$

So $p$ is a valid density.

**Step 3 — Integrate over the event.**

$$\mathbb{P}(0\le x\le1)=\int_0^1\frac14\,dx=\frac14(1-0)=\frac14.$$

**Answer.**  
$p$ is normalised, and $\mathbb{P}(0\le x\le1)=1/4$.

---

## Q4. Euclidean norm

Compute $\|v\|_2$ for

$$v=\begin{bmatrix}2\\-1\\2\end{bmatrix}.$$

### Solution

**Step 1 — Square each coordinate.**

$$2^2=4,\qquad (-1)^2=1,\qquad 2^2=4.$$

**Step 2 — Sum the squares.**

$$4+1+4=9.$$

**Step 3 — Take the square root.**

$$\|v\|_2=\sqrt9=3.$$

**Answer.**  
$\|v\|_2=3$.

---

## Q5. Empirical squared loss for a linear predictor

Let $f_w(x)=\langle w,x\rangle$, where $w=(1,-1)$. For the two training samples

$$(x_1,y_1)=((2,1),1),\qquad (x_2,y_2)=((0,3),-2),$$

compute the empirical risk using

$$\ell(w,x,y)=\frac12(y-\langle w,x\rangle)^2.$$

### Solution

**Step 1 — Compute the first prediction.**

$$\langle w,x_1\rangle = 1\cdot2+(-1)\cdot1=1.$$

**Step 2 — Compute the first loss.**

$$\ell_1=\frac12(1-1)^2=0.$$

**Step 3 — Compute the second prediction.**

$$\langle w,x_2\rangle = 1\cdot0+(-1)\cdot3=-3.$$

**Step 4 — Compute the second loss.**

$$\ell_2=\frac12((-2)-(-3))^2=\frac12(1)^2=\frac12.$$

**Step 5 — Average over the sample.**

$$\widehat R(w)=\frac12(\ell_1+\ell_2)=\frac12\left(0+\frac12\right)=\frac14.$$

**Answer.**  
$\widehat R(w)=1/4$.

---

## Q6. ReLU layer output: lecture running example

Use the lecture's one-layer ReLU example:

$$x=\begin{bmatrix}1\\2\end{bmatrix},\qquad b=0,\qquad W=\begin{bmatrix}1&0\\2&-1\\0&-2\end{bmatrix}.$$

Compute

$$N(x)=\operatorname{ReLU}(Wx+b).$$

### Solution

**Step 1 — Multiply $W$ by $x$ row by row.**

First row:

$$1\cdot1+0\cdot2=1.$$

Second row:

$$2\cdot1+(-1)\cdot2=0.$$

Third row:

$$0\cdot1+(-2)\cdot2=-4.$$

So,

$$Wx=\begin{bmatrix}1\\0\\-4\end{bmatrix}.$$

**Step 2 — Add the bias.**  
Here $b=0$, so nothing changes.

$$Wx+b=\begin{bmatrix}1\\0\\-4\end{bmatrix}.$$

**Step 3 — Apply ReLU componentwise.**

$$\operatorname{ReLU}(1)=1,\qquad \operatorname{ReLU}(0)=0,\qquad \operatorname{ReLU}(-4)=0.$$

**Answer.**

$$N(x)=\begin{bmatrix}1\\0\\0\end{bmatrix}.$$

---

## Q7. Eigenvalues of the lecture's tricky spectral-norm matrix

For

$$A(3)=\begin{bmatrix}0&3\\0&0\end{bmatrix},$$

compute the eigenvalues and spectral radius.

### Solution

**Step 1 — Write the characteristic matrix.**

$$A-\lambda I=\begin{bmatrix}-\lambda&3\\0&-\lambda\end{bmatrix}.$$

**Step 2 — Compute the determinant.**

$$\det(A-\lambda I)=(-\lambda)(-\lambda)-0\cdot3=\lambda^2.$$

**Step 3 — Solve the characteristic equation.**

$$\lambda^2=0\quad\Rightarrow\quad \lambda=0.$$

**Step 4 — Compute spectral radius.**  
The spectral radius is the largest absolute eigenvalue.

$$\rho(A)=\max |\lambda|=0.$$

**Answer.**  
The only eigenvalue is $0$, so $\rho(A)=0$.

---

## Q8. Spectral norm of the same matrix

For

$$A(3)=\begin{bmatrix}0&3\\0&0\end{bmatrix},$$

compute $\|A(3)\|_2$ using the lecture's unit-vector parametrisation

$$v(\alpha)=\begin{bmatrix}\sin\alpha\\\cos\alpha\end{bmatrix}.$$

### Solution

**Step 1 — Apply the matrix to the unit vector.**

$$A(3)v(\alpha)=\begin{bmatrix}0&3\\0&0\end{bmatrix}\begin{bmatrix}\sin\alpha\\\cos\alpha\end{bmatrix}=\begin{bmatrix}3\cos\alpha\\0\end{bmatrix}.$$

**Step 2 — Compute the output norm.**

$$\|A(3)v(\alpha)\|_2=\sqrt{(3\cos\alpha)^2+0^2}=3|\cos\alpha|.$$

**Step 3 — Maximise over $\alpha$.**  
The maximum value of $|\cos\alpha|$ is $1$.

$$\|A(3)\|_2=3.$$

**Answer.**  
$\|A(3)\|_2=3$, even though all eigenvalues are $0$.

---

## Q9. One gradient descent step for $F(x)=x^2$

Let $F(x)=x^2$, $x_0=5$, and constant step size $\eta=0.1$. Compute $x_1$.

### Solution

**Step 1 — Differentiate the objective.**

$$F'(x)=2x.$$

**Step 2 — Write the GD update.**

$$x_{t+1}=x_t-\eta F'(x_t).$$

**Step 3 — Substitute $x_0=5$.**

$$x_1=5-0.1\cdot(2\cdot5).$$

**Step 4 — Compute.**

$$x_1=5-1=4.$$

**Answer.**  
$x_1=4$.

---

## Q10. Johnson–Lindenstrauss interval check

A vector $a$ has squared norm $\|a\|_2^2=100$. A random projection satisfies the JL property with $\varepsilon=0.2$. What interval should $\|\Pi a\|_2^2$ lie in when the projection succeeds?

### Solution

**Step 1 — Write the JL success condition.**

$$(1-\varepsilon)\|a\|_2^2\le \|\Pi a\|_2^2\le (1+\varepsilon)\|a\|_2^2.$$

**Step 2 — Substitute $\varepsilon=0.2$ and $\|a\|_2^2=100$.**

$$(1-0.2)100\le \|\Pi a\|_2^2\le (1+0.2)100.$$

**Step 3 — Compute the bounds.**

$$80\le \|\Pi a\|_2^2\le120.$$

**Answer.**  
The projected squared norm should lie in $[80,120]$.

---

## Q11. Sketched regression dimensions

Let $A\in\mathbb{R}^{1000\times 20}$, $\beta\in\mathbb{R}^{20}$, $y\in\mathbb{R}^{1000}$, and $\Pi\in\mathbb{R}^{100\times1000}$. What are the dimensions of $A\beta-y$ and $\Pi(A\beta-y)$?

### Solution

**Step 1 — Compute the dimension of $A\beta$.**

$$A\in\mathbb{R}^{1000\times20},\qquad \beta\in\mathbb{R}^{20}.$$

So,

$$A\beta\in\mathbb{R}^{1000}.$$

**Step 2 — Subtract $y$.**

Since $y\in\mathbb{R}^{1000}$,

$$A\beta-y\in\mathbb{R}^{1000}.$$

**Step 3 — Apply the sketching matrix.**

$$\Pi\in\mathbb{R}^{100\times1000},\qquad A\beta-y\in\mathbb{R}^{1000}.$$

Therefore,

$$\Pi(A\beta-y)\in\mathbb{R}^{100}.$$

**Answer.**  
The original residual is in $\mathbb{R}^{1000}$; the sketched residual is in $\mathbb{R}^{100}$.

---

## Q12. Discrete KL divergence

Let

$$p=(1/2,1/2),\qquad q=(1/4,3/4).$$

Compute $\operatorname{KL}(p\|q)$.

### Solution

**Step 1 — Write the definition.**

$$\operatorname{KL}(p\|q)=\sum_i p_i\log\frac{p_i}{q_i}.$$

**Step 2 — Substitute the two probabilities.**

$$\operatorname{KL}(p\|q)=\frac12\log\frac{1/2}{1/4}+\frac12\log\frac{1/2}{3/4}.$$

**Step 3 — Simplify ratios.**

$$\frac{1/2}{1/4}=2,\qquad \frac{1/2}{3/4}=\frac23.$$

So,

$$\operatorname{KL}(p\|q)=\frac12\log2+\frac12\log\frac23.$$

**Step 4 — Combine if desired.**

$$\operatorname{KL}(p\|q)=\frac12\log\left(2\cdot\frac23\right)=\frac12\log\frac43.$$

**Answer.**

$$\operatorname{KL}(p\|q)=\frac12\log\frac43.$$

---

## Q13. VAE loss from code variables

A VAE forward pass returns

$$\widehat x=(1,1),\qquad \text{mean}=(0,1),\qquad \text{log var}=(0,0),$$

for input

$$x=(2,1).$$

Compute the VAE loss, dropping constants, using

$$\frac12\|x-\widehat x\|_2^2-\frac12\sum_i[1+\text{log var}_i-\text{mean}_i^2-e^{\text{log var}_i}].$$

### Solution

**Step 1 — Compute reconstruction error.**

$$x-\widehat x=(2,1)-(1,1)=(1,0).$$

$$\|x-\widehat x\|_2^2=1^2+0^2=1.$$

So,

$$\frac12\|x-\widehat x\|_2^2=\frac12.$$

**Step 2 — Compute the KL contribution coordinate by coordinate.**

For coordinate 1:

$$1+0-0^2-e^0=1-1=0.$$

For coordinate 2:

$$1+0-1^2-e^0=1-1-1=-1.$$

The sum is

$$0+(-1)=-1.$$

**Step 3 — Apply the negative half factor.**

$$-\frac12(-1)=\frac12.$$

**Step 4 — Add reconstruction and KL terms.**

$$\text{VAE loss}=\frac12+\frac12=1.$$

**Answer.**  
The VAE loss is $1$.

---

# Section B — Multi-condition checks

## Q14. Binary classification rule, linear prediction, and squared loss

The lecture's binary classification example labels a point by

$$y=\begin{cases}1,&x_1^2+x_2^2\le5,\\-1,&\text{otherwise.}\end{cases}$$

For $x=(1,2)$ and $w=(1,0)$, compute the label $y$, the linear prediction $\langle w,x\rangle$, and the squared loss $\frac12(y-\langle w,x\rangle)^2$.

### Solution

**Step 1 — Apply the circle rule.**

$$x_1^2+x_2^2=1^2+2^2=5.$$

Because $5\le5$, the point is inside/on the boundary of the positive region.

$$y=1.$$

**Step 2 — Compute the linear prediction.**

$$\langle w,x\rangle=1\cdot1+0\cdot2=1.$$

**Step 3 — Compute the squared loss.**

$$\frac12(y-\langle w,x\rangle)^2=\frac12(1-1)^2=0.$$

**Answer.**  
The label is $1$, the prediction is $1$, and the loss is $0$.

---

## Q15. Convexity and existence of a finite minimiser

Check whether $F(x)=e^{-2x}$ is convex, and decide whether it has a finite minimiser.

### Solution

**Step 1 — Differentiate once.**

$$F'(x)=-2e^{-2x}.$$

**Step 2 — Differentiate twice.**

$$F''(x)=4e^{-2x}.$$

**Step 3 — Check convexity.**  
Since $e^{-2x}>0$ for every real $x$,

$$F''(x)=4e^{-2x}>0.$$

Therefore $F$ is convex.

**Step 4 — Check whether the function attains its infimum.**  
As $x\to\infty$,

$$e^{-2x}\to0.$$

But $e^{-2x}$ is never equal to $0$ for finite $x$.

**Answer.**  
$F(x)=e^{-2x}$ is convex, but it has no finite minimiser. Its infimum is $0$, approached as $x\to\infty$.

---

## Q16. Gradient descent step-size condition for $F(x)=x^2$

For $F(x)=x^2$, constant step size $\eta$ gives

$$x_{t+1}=(1-2\eta)x_t.$$

For each value $\eta=0.25$, $\eta=0.75$, and $\eta=1.1$, decide whether the recurrence converges to $0$ from a nonzero start.

### Solution

**Step 1 — Identify the multiplier.**

$$k=1-2\eta.$$

The recurrence converges to $0$ if

$$|k|<1.$$

**Step 2 — Check $\eta=0.25$.**

$$k=1-2(0.25)=0.5.$$

Since $|0.5|<1$, it converges monotonically toward $0$.

**Step 3 — Check $\eta=0.75$.**

$$k=1-2(0.75)=-0.5.$$

Since $|-0.5|<1$, it converges with sign oscillation.

**Step 4 — Check $\eta=1.1$.**

$$k=1-2(1.1)=-1.2.$$

Since $|-1.2|>1$, it diverges in magnitude.

**Answer.**  
$\eta=0.25$ converges monotonically; $\eta=0.75$ converges with oscillation; $\eta=1.1$ diverges.

---

## Q17. Non-asymptotic convergence time for $F(x)=x^2$

Suppose $x_{t}=x_0k^t$ with $x_0=8$ and $k=1/2$. How many steps are sufficient to guarantee $|x_t|\le1/16$?

### Solution

**Step 1 — Write the target inequality.**

$$|x_0|k^t\le\varepsilon.$$

Here,

$$|x_0|=8,\qquad k=\frac12,\qquad \varepsilon=\frac1{16}.$$

**Step 2 — Substitute.**

$$8\left(\frac12\right)^t\le\frac1{16}.$$

**Step 3 — Divide by $8$.**

$$\left(\frac12\right)^t\le\frac1{128}.$$

**Step 4 — Rewrite powers of two.**

$$\frac1{128}=\left(\frac12\right)^7.$$

So we need

$$t\ge7.$$

**Answer.**  
At least $7$ steps are sufficient.

---

## Q18. Mexican-hat objective: critical points and one GD step

Let

$$F(x)=\frac12(x^2-4)^2.$$

Find the derivative, the critical points, the global minima, and compute one GD step from $x_0=3$ with $\eta=0.01$.

### Solution

**Step 1 — Differentiate using the chain rule.**  
Let $u=x^2-4$. Then $F(x)=\frac12u^2$.

$$F'(x)=u\cdot u'=(x^2-4)(2x)=2x(x^2-4).$$

**Step 2 — Find critical points.**

$$F'(x)=0\quad\Rightarrow\quad 2x(x^2-4)=0.$$

So,

$$x=0,\qquad x^2=4\Rightarrow x=\pm2.$$

**Step 3 — Find global minima.**  
Since $F(x)=\frac12(x^2-4)^2\ge0$, global minima occur when the squared term is zero.

$$x^2-4=0\Rightarrow x=\pm2.$$

Thus $x=\pm2$ are global minima. The critical point $x=0$ is not a global minimum.

**Step 4 — Write the GD update.**

$$x_{t+1}=x_t-\eta\,2x_t(x_t^2-4).$$

**Step 5 — Substitute $x_0=3$ and $\eta=0.01$.**

$$x_1=3-0.01\cdot2\cdot3(3^2-4).$$

$$x_1=3-0.01\cdot6\cdot5=3-0.3=2.7.$$

**Answer.**  
$F'(x)=2x(x^2-4)$; critical points are $-2,0,2$; global minima are $\pm2$; one GD step gives $x_1=2.7$.

---

## Q19. Spectral radius versus spectral norm gap

For

$$A(\theta)=\begin{bmatrix}0&\theta\\0&0\end{bmatrix},$$

explain why the spectral radius is always $0$ but the spectral norm can be arbitrarily large.

### Solution

**Step 1 — Compute the eigenvalues.**

$$\det(A-\lambda I)=\det\begin{bmatrix}-\lambda&\theta\\0&-\lambda\end{bmatrix}=\lambda^2.$$

So the only eigenvalue is $\lambda=0$.

**Step 2 — Compute spectral radius.**

$$\rho(A)=\max |\lambda|=0.$$

**Step 3 — Compute spectral norm.**  
The lecture's calculation gives

$$\|A(\theta)\|_2=|\theta|.$$

**Step 4 — Compare.**  
The spectral radius stays fixed at $0$ for every $\theta$, but $|\theta|$ can be chosen as large as desired.

**Answer.**  
The spectral radius is always $0$, while the spectral norm is $|\theta|$, so the gap can be arbitrarily large.

---

## Q20. Expected sketch identity: diagonal and off-diagonal entries

Let $\Pi=G/\sqrt{k}$ where $G\in\mathbb{R}^{k\times n}$ has independent standard normal entries. Show why $\mathbb{E}[\Pi^\top\Pi]=I$ by checking diagonal and off-diagonal entries.

### Solution

**Step 1 — Write an entry of $\Pi^\top\Pi$.**

$$(\Pi^\top\Pi)_{j\ell}=\frac1k\sum_{i=1}^{k}G_{ij}G_{i\ell}.$$

**Step 2 — Diagonal case $j=\ell$.**

$$(\Pi^\top\Pi)_{jj}=\frac1k\sum_{i=1}^{k}G_{ij}^2.$$

Since $G_{ij}\sim\mathcal N(0,1)$,

$$\mathbb{E}[G_{ij}^2]=1.$$

Therefore,

$$\mathbb{E}[(\Pi^\top\Pi)_{jj}]=\frac1k\sum_{i=1}^k1=1.$$

**Step 3 — Off-diagonal case $j\ne\ell$.**

Because $G_{ij}$ and $G_{i\ell}$ are independent and mean zero,

$$\mathbb{E}[G_{ij}G_{i\ell}]=\mathbb{E}[G_{ij}]\mathbb{E}[G_{i\ell}]=0.$$

So,

$$\mathbb{E}[(\Pi^\top\Pi)_{j\ell}]=0.$$

**Step 4 — Combine the cases.**  
The expected diagonal entries are $1$ and expected off-diagonal entries are $0$.

**Answer.**

$$\mathbb{E}[\Pi^\top\Pi]=I.$$

---

## Q21. ReLU network for $\max(x_1,x_2)$: evaluate all hidden units

Use the lecture construction

$$s=x_1+x_2,\qquad d=x_1-x_2,$$

$$h_1=\operatorname{ReLU}(s),\quad h_2=\operatorname{ReLU}(-s),\quad h_3=\operatorname{ReLU}(d),\quad h_4=\operatorname{ReLU}(-d),$$

and output

$$\frac12h_1-\frac12h_2+\frac12h_3+\frac12h_4.$$

Evaluate it at $(x_1,x_2)=(-1,3)$.

### Solution

**Step 1 — Compute $s$ and $d$.**

$$s=x_1+x_2=-1+3=2.$$

$$d=x_1-x_2=-1-3=-4.$$

**Step 2 — Compute the four ReLU gates.**

$$h_1=\operatorname{ReLU}(2)=2.$$

$$h_2=\operatorname{ReLU}(-2)=0.$$

$$h_3=\operatorname{ReLU}(-4)=0.$$

$$h_4=\operatorname{ReLU}(4)=4.$$

**Step 3 — Compute the output.**

$$\frac12h_1-\frac12h_2+\frac12h_3+\frac12h_4
=\frac12(2)-\frac12(0)+\frac12(0)+\frac12(4).$$

$$=1+0+0+2=3.$$

**Step 4 — Check against $\max(x_1,x_2)$.**

$$\max(-1,3)=3.$$

**Answer.**  
The network outputs $3$, which equals $\max(-1,3)$.

---

## Q22. Sparse autoencoder forward pass and loss

Let

$$y=\begin{bmatrix}1\\2\end{bmatrix},\qquad W=\begin{bmatrix}1&0\\0&1\\1&-1\end{bmatrix},\qquad \varepsilon=0,$$

and define

$$h=\operatorname{ReLU}(Wy-\varepsilon\vec1),\qquad \widetilde y=W^\top h.$$

Compute $h$, $\widetilde y$, and the reconstruction loss $\frac12\|\widetilde y-y\|_2^2$.

### Solution

**Step 1 — Compute $Wy$.**

$$Wy=\begin{bmatrix}1&0\\0&1\\1&-1\end{bmatrix}\begin{bmatrix}1\\2\end{bmatrix}
=\begin{bmatrix}1\\2\\-1\end{bmatrix}.$$

**Step 2 — Apply ReLU.**

Since $\varepsilon=0$,

$$h=\operatorname{ReLU}\begin{bmatrix}1\\2\\-1\end{bmatrix}
=\begin{bmatrix}1\\2\\0\end{bmatrix}.$$

**Step 3 — Compute reconstruction.**

$$W^\top=\begin{bmatrix}1&0&1\\0&1&-1\end{bmatrix}.$$

$$\widetilde y=W^\top h
=\begin{bmatrix}1&0&1\\0&1&-1\end{bmatrix}\begin{bmatrix}1\\2\\0\end{bmatrix}
=\begin{bmatrix}1\\2\end{bmatrix}.$$

**Step 4 — Compute reconstruction error.**

$$\widetilde y-y=\begin{bmatrix}1\\2\end{bmatrix}-\begin{bmatrix}1\\2\end{bmatrix}=\begin{bmatrix}0\\0\end{bmatrix}.$$

$$\frac12\|\widetilde y-y\|_2^2=0.$$

**Answer.**  
$h=(1,2,0)^\top$, $\widetilde y=(1,2)^\top$, and the reconstruction loss is $0$.

---

## Q23. Latent posterior from a tiny discrete model

Suppose $z\in\{0,1\}$ with

$$p(z=0)=p(z=1)=1/2.$$

For an observed $x$, suppose

$$p(x\mid z=0)=0.2,\qquad p(x\mid z=1)=0.6.$$

Compute $p(z=1\mid x)$.

### Solution

**Step 1 — Write Bayes' rule.**

$$p(z\mid x)=\frac{p(x\mid z)p(z)}{p(x)}.$$

**Step 2 — Compute the marginal likelihood $p(x)$.**

$$p(x)=p(x\mid z=0)p(z=0)+p(x\mid z=1)p(z=1).$$

$$p(x)=0.2\cdot\frac12+0.6\cdot\frac12=0.1+0.3=0.4.$$

**Step 3 — Compute the posterior for $z=1$.**

$$p(z=1\mid x)=\frac{0.6\cdot\frac12}{0.4}=\frac{0.3}{0.4}=0.75.$$

**Answer.**  
$p(z=1\mid x)=0.75$.

---

## Q24. Maximum likelihood from empirical log scores

Two candidate generative models give log-likelihoods on three data points:

$$\log p_{\Theta_A}(x_i): -1,-2,-1,$$

$$\log p_{\Theta_B}(x_i): -2,-2,-2.$$

Using the empirical MLE objective, which model is preferred?

### Solution

**Step 1 — Write the empirical MLE objective.**  
In practice, maximise

$$\frac1m\sum_{i=1}^m\log p_\Theta(x_i).$$

**Step 2 — Average model A's log scores.**

$$\frac13(-1-2-1)=\frac{-4}{3}.$$

**Step 3 — Average model B's log scores.**

$$\frac13(-2-2-2)=-2.$$

**Step 4 — Choose the larger average log-likelihood.**

$$-\frac43>-2.$$

**Answer.**  
Model $A$ is preferred by empirical maximum likelihood.

---

# Section C — Building things from scratch

## Q25. Build the empirical risk objective from a dataset

You are given samples $(x_i,y_i)_{i=1}^m$, a linear predictor $f_w(x)=\langle w,x\rangle$, and squared loss. Write the empirical risk objective to minimise over $w$.

### Solution

**Step 1 — Start with the general empirical risk form.**

$$\widehat R(w)=\frac1m\sum_{i=1}^m \ell(w,x_i,y_i).$$

**Step 2 — Substitute the squared loss.**

$$\ell(w,x_i,y_i)=\frac12(y_i-\langle w,x_i\rangle)^2.$$

**Step 3 — Put the loss into the average.**

$$\widehat R(w)=\frac1m\sum_{i=1}^m\frac12(y_i-\langle w,x_i\rangle)^2.$$

**Step 4 — State the optimisation problem.**

$$\min_w \widehat R(w)=\min_w \frac1m\sum_{i=1}^m\frac12(y_i-\langle w,x_i\rangle)^2.$$

**Answer.**  
The empirical risk objective is

$$\min_w \frac1m\sum_{i=1}^m\frac12(y_i-\langle w,x_i\rangle)^2.$$

---

## Q26. Build and solve a simple Lagrangian problem

Solve

$$\min_{x,y} x^2+y^2\quad \text{subject to}\quad x+y=1.$$

Use the Lagrangian method.

### Solution

**Step 1 — Identify the objective and constraint.**

Objective:

$$F(x,y)=x^2+y^2.$$

Constraint:

$$g(x,y)=x+y-1=0.$$

**Step 2 — Build the Lagrangian.**

$$\mathcal L(x,y,\lambda)=x^2+y^2+\lambda(x+y-1).$$

**Step 3 — Set partial derivatives to zero.**

$$\frac{\partial\mathcal L}{\partial x}=2x+\lambda=0.$$

$$\frac{\partial\mathcal L}{\partial y}=2y+\lambda=0.$$

$$\frac{\partial\mathcal L}{\partial \lambda}=x+y-1=0.$$

**Step 4 — Solve the first two equations.**

From

$$2x+\lambda=0,\qquad 2y+\lambda=0,$$

we get

$$2x=2y\quad\Rightarrow\quad x=y.$$

**Step 5 — Use the constraint.**

$$x+y=1,$$

and $x=y$, so

$$2x=1\quad\Rightarrow\quad x=\frac12.$$

Therefore,

$$y=\frac12.$$

**Step 6 — State the minimiser and value.**

$$F\left(\frac12,\frac12\right)=\left(\frac12\right)^2+\left(\frac12\right)^2=\frac12.$$

**Answer.**  
The constrained minimiser is $(x,y)=(1/2,1/2)$, with minimum value $1/2$.

---

## Q27. Build the GD recurrence and solve it for $F(x)=x^2$

For $F(x)=x^2$, derive the recurrence for gradient descent with constant step size $\eta$, then express $x_t$ in terms of $x_0$.

### Solution

**Step 1 — Differentiate the objective.**

$$F'(x)=2x.$$

**Step 2 — Write the GD update.**

$$x_{t+1}=x_t-\eta F'(x_t).$$

**Step 3 — Substitute the derivative.**

$$x_{t+1}=x_t-2\eta x_t.$$

**Step 4 — Factor out $x_t$.**

$$x_{t+1}=(1-2\eta)x_t.$$

**Step 5 — Define the multiplier.**

Let

$$k=1-2\eta.$$

Then

$$x_{t+1}=kx_t.$$

**Step 6 — Unroll the recurrence.**

$$x_1=kx_0.$$

$$x_2=kx_1=k^2x_0.$$

Continuing,

$$x_t=k^tx_0=(1-2\eta)^tx_0.$$

**Answer.**

$$x_{t+1}=(1-2\eta)x_t,$$

and

$$x_t=(1-2\eta)^t x_0.$$

---

## Q28. Build the matrix analogue update

Let

$$f(W)=\left(\operatorname{Tr}(AA^\top)-\operatorname{Tr}(WW^\top)\right)^2.$$

Write the gradient and the gradient descent update.

### Solution

**Step 1 — Rewrite traces as Frobenius norms.**

$$\operatorname{Tr}(AA^\top)=\|A\|_F^2=:C,$$

and

$$\operatorname{Tr}(WW^\top)=\|W\|_F^2.$$

So,

$$f(W)=(C-\|W\|_F^2)^2.$$

**Step 2 — Differentiate the inner term.**

$$\nabla_W\|W\|_F^2=2W.$$

The inner term is

$$C-\|W\|_F^2,$$

whose gradient is

$$-2W.$$

**Step 3 — Apply the chain rule.**

$$\nabla_W f(W)=2(C-\|W\|_F^2)(-2W).$$

So,

$$\nabla_W f(W)=-4(C-\|W\|_F^2)W.$$

Equivalently,

$$\nabla_W f(W)=4(\|W\|_F^2-C)W.$$

**Step 4 — Write the GD update.**

$$W_{t+1}=W_t-\eta\nabla f(W_t).$$

Using the second form,

$$W_{t+1}=W_t-4\eta(\|W_t\|_F^2-C)W_t.$$

**Step 5 — Factor.**

$$W_{t+1}=\left[1-4\eta(\|W_t\|_F^2-C)\right]W_t.$$

**Answer.**

$$\nabla_W f(W)=4(\|W\|_F^2-\|A\|_F^2)W,$$

and

$$W_{t+1}=\left[1-4\eta(\|W_t\|_F^2-\|A\|_F^2)\right]W_t.$$

---

## Q29. Build a JL dimension requirement for a finite point set

You have $n$ points in $\mathbb{R}^d$. The lecture states that there exists a linear map into $\mathbb{R}^k$ preserving pairwise distances up to error $\varepsilon$, with

$$k=O\left(\frac{\log n}{\varepsilon^2}\right).$$

For $n=10{,}000$ and $\varepsilon=0.1$, write the scaling expression for $k$ up to the hidden constant.

### Solution

**Step 1 — Write the JL scaling.**

$$k=O\left(\frac{\log n}{\varepsilon^2}\right).$$

**Step 2 — Substitute $n=10{,}000$.**

$$\log n=\log(10{,}000).$$

**Step 3 — Substitute $\varepsilon=0.1$.**

$$\varepsilon^2=(0.1)^2=0.01.$$

**Step 4 — Form the expression.**

$$k=O\left(\frac{\log(10{,}000)}{0.01}\right).$$

Equivalently,

$$k=O\left(100\log(10{,}000)\right).$$

**Answer.**  
Up to the hidden constant,

$$k\sim 100\log(10{,}000).$$

The important feature is that this scaling depends on $n$ and $\varepsilon$, not directly on the original dimension $d$.

---

## Q30. Build the sketched linear-regression objective

Given $A\in\mathbb{R}^{n\times d}$, $y\in\mathbb{R}^n$, parameter $\beta\in\mathbb{R}^d$, and sketch matrix $\Pi\in\mathbb{R}^{k\times n}$ with $k<n$, write both the original and sketched regression objectives.

### Solution

**Step 1 — Define the original residual.**

$$r(\beta)=A\beta-y.$$

This is in $\mathbb{R}^n$.

**Step 2 — Write the original objective.**

$$\min_{\beta\in\mathbb{R}^d}\|A\beta-y\|_2^2.$$

**Step 3 — Compress the residual.**

Apply $\Pi$ to the residual:

$$\Pi r(\beta)=\Pi(A\beta-y).$$

This is in $\mathbb{R}^k$.

**Step 4 — Write the sketched objective.**

$$\min_{\beta\in\mathbb{R}^d}\|\Pi(A\beta-y)\|_2^2.$$

**Answer.**  
Original:

$$\min_\beta\|A\beta-y\|_2^2.$$

Sketched:

$$\min_\beta\|\Pi(A\beta-y)\|_2^2.$$

---

## Q31. Prove expected preservation of sketched regression loss

Let $r=A\beta-y$ be fixed with respect to $\Pi$, and assume $\mathbb{E}[\Pi^\top\Pi]=I$. Prove that

$$\mathbb{E}_\Pi\|\Pi r\|_2^2=\|r\|_2^2.$$

### Solution

**Step 1 — Expand the squared norm.**

$$\|\Pi r\|_2^2=(\Pi r)^\top(\Pi r).$$

**Step 2 — Move matrices together.**

$$(\Pi r)^\top(\Pi r)=r^\top\Pi^\top\Pi r.$$

**Step 3 — Take expectation over $\Pi$.**

$$\mathbb{E}_\Pi\|\Pi r\|_2^2=\mathbb{E}_\Pi[r^\top\Pi^\top\Pi r].$$

**Step 4 — Pull out the fixed vector $r$.**

Since $r$ is fixed relative to $\Pi$,

$$\mathbb{E}_\Pi[r^\top\Pi^\top\Pi r]=r^\top\mathbb{E}_\Pi[\Pi^\top\Pi]r.$$

**Step 5 — Use the identity expectation.**

$$r^\top\mathbb{E}_\Pi[\Pi^\top\Pi]r=r^\top I r.$$

**Step 6 — Return to the norm.**

$$r^\top I r=r^\top r=\|r\|_2^2.$$

**Answer.**

$$\mathbb{E}_\Pi\|\Pi r\|_2^2=\|r\|_2^2.$$

---

## Q32. Build the ReLU network for $\max(x_1,x_2)$

Construct the lecture's width-4 ReLU representation of $\max(x_1,x_2)$.

### Solution

**Step 1 — Start from the identity.**

$$\max(x_1,x_2)=\frac{x_1+x_2}{2}+\frac{|x_1-x_2|}{2}.$$

**Step 2 — Define sum and difference.**

$$s=x_1+x_2,$$

$$d=x_1-x_2.$$

**Step 3 — Represent $s$ using ReLUs.**  
Use

$$a=\operatorname{ReLU}(a)-\operatorname{ReLU}(-a).$$

So,

$$s=\operatorname{ReLU}(s)-\operatorname{ReLU}(-s).$$

**Step 4 — Represent $|d|$ using ReLUs.**  
Use

$$|a|=\operatorname{ReLU}(a)+\operatorname{ReLU}(-a).$$

So,

$$|d|=\operatorname{ReLU}(d)+\operatorname{ReLU}(-d).$$

**Step 5 — Define the four hidden units.**

$$h_1=\operatorname{ReLU}(x_1+x_2),$$

$$h_2=\operatorname{ReLU}(-x_1-x_2),$$

$$h_3=\operatorname{ReLU}(x_1-x_2),$$

$$h_4=\operatorname{ReLU}(-x_1+x_2).$$

**Step 6 — Combine them linearly.**

$$\max(x_1,x_2)=\frac12h_1-\frac12h_2+\frac12h_3+\frac12h_4.$$

**Answer.**  
A depth-2, width-4 ReLU network computes $\max(x_1,x_2)$ using the four hidden units above and output weights

$$\left(\frac12,-\frac12,\frac12,\frac12\right).$$

---

## Q33. Build a deep ReLU network from layer dimensions

Suppose

$$A_1:\mathbb{R}^4\to\mathbb{R}^5,$$

$$A_2:\mathbb{R}^5\to\mathbb{R}^3,$$

$$A_3:\mathbb{R}^3\to\mathbb{R}^1.$$

Write the corresponding ReLU deep neural network and its input/output dimensions.

### Solution

**Step 1 — Recall the lecture's DNN composition pattern.**

A ReLU DNN applies affine maps with ReLUs between them:

$$N=A_{k+1}\circ \operatorname{ReLU}\circ A_k\circ\cdots\circ\operatorname{ReLU}\circ A_1.$$

**Step 2 — Insert the three affine maps.**

$$N(x)=A_3\left(\operatorname{ReLU}\left(A_2\left(\operatorname{ReLU}(A_1(x))\right)\right)\right).$$

**Step 3 — Track dimensions.**

Start:

$$x\in\mathbb{R}^4.$$

After $A_1$:

$$A_1(x)\in\mathbb{R}^5.$$

After ReLU:

$$\operatorname{ReLU}(A_1(x))\in\mathbb{R}^5.$$

After $A_2$:

$$A_2(\cdot)\in\mathbb{R}^3.$$

After ReLU:

$$\operatorname{ReLU}(A_2(\cdot))\in\mathbb{R}^3.$$

After $A_3$:

$$N(x)\in\mathbb{R}^1.$$

**Answer.**  
The network is

$$N(x)=A_3(\operatorname{ReLU}(A_2(\operatorname{ReLU}(A_1(x))))),$$

and it maps $\mathbb{R}^4\to\mathbb{R}^1$.

---

## Q34. Prove the sparse-coding autoencoder zero-loss special case

Assume

$$y=A^\star x^\star,$$

$A^\star$ is orthogonal, $x^\star\ge0$ componentwise, and $W^\top=A^\star$. Prove that

$$\|y-W^\top\operatorname{ReLU}(Wy)\|_2^2=0.$$

### Solution

**Step 1 — Convert $W^\top=A^\star$ into $W$.**

If

$$W^\top=A^\star,$$

then

$$W=(A^\star)^\top.$$

**Step 2 — Compute the encoder pre-activation $Wy$.**

$$Wy=(A^\star)^\top y.$$

Substitute $y=A^\star x^\star$:

$$Wy=(A^\star)^\top A^\star x^\star.$$

**Step 3 — Use orthogonality.**

Since $A^\star$ is orthogonal,

$$(A^\star)^\top A^\star=I.$$

So,

$$Wy=x^\star.$$

**Step 4 — Apply ReLU.**

Because $x^\star\ge0$ componentwise,

$$\operatorname{ReLU}(x^\star)=x^\star.$$

Thus,

$$\operatorname{ReLU}(Wy)=x^\star.$$

**Step 5 — Decode.**

$$W^\top\operatorname{ReLU}(Wy)=A^\star x^\star.$$

**Step 6 — Substitute the generative model.**

$$A^\star x^\star=y.$$

So,

$$W^\top\operatorname{ReLU}(Wy)=y.$$

**Step 7 — Compute the loss.**

$$\|y-W^\top\operatorname{ReLU}(Wy)\|_2^2=\|y-y\|_2^2=0.$$

**Answer.**  
Under these special conditions, the reconstruction is exact, so the loss is $0$.

---

## Q35. Build a latent-variable marginal distribution

Suppose a latent model has prior $p(z)$ and decoder likelihood $p_\Theta(x\mid z)$. Write the marginal density $p_\Theta(x)$ and the sampling procedure for $x$.

### Solution

**Step 1 — Start from the joint density.**

The model defines

$$p_\Theta(x,z)=p_\Theta(x\mid z)p(z).$$

**Step 2 — Integrate out the latent variable.**

The marginal distribution of $x$ is

$$p_\Theta(x)=\int_Z p_\Theta(x,z)\,dz.$$

**Step 3 — Substitute the joint factorisation.**

$$p_\Theta(x)=\int_Z p_\Theta(x\mid z)p(z)\,dz.$$

**Step 4 — State the sampling interpretation.**

To sample $x$ from this model:

1. Sample $z\sim p(z)$.
2. Sample $x\sim p_\Theta(\cdot\mid z)$.

**Answer.**

$$p_\Theta(x)=\int_Z p_\Theta(x\mid z)p(z)\,dz.$$

Sampling uses prior first, decoder second.

---

## Q36. Derive the ELBO decomposition

Starting from

$$\operatorname{KL}(q(z\mid x)\|p(z\mid x)),$$

use Bayes' rule to derive

$$\log p(x)=\operatorname{KL}(q(z\mid x)\|p(z\mid x))+\operatorname{ELBO}.$$

### Solution

**Step 1 — Start with KL divergence.**

$$\operatorname{KL}(q(z\mid x)\|p(z\mid x))
=\mathbb{E}_q\left[\log\frac{q(z\mid x)}{p(z\mid x)}\right].$$

**Step 2 — Substitute Bayes' rule.**

Bayes' rule gives

$$p(z\mid x)=\frac{p(x\mid z)p(z)}{p(x)}.$$

So,

$$\operatorname{KL}=\mathbb{E}_q\left[\log\frac{q(z\mid x)}{p(x\mid z)p(z)/p(x)}\right].$$

**Step 3 — Split the logarithm.**

$$\operatorname{KL}=\mathbb{E}_q[\log q(z\mid x)-\log p(x\mid z)-\log p(z)+\log p(x)].$$

**Step 4 — Pull out $\log p(x)$.**  
For fixed $x$, $\log p(x)$ does not depend on $z$, so

$$\operatorname{KL}=\mathbb{E}_q[\log q(z\mid x)]-\mathbb{E}_q[\log p(x\mid z)]-\mathbb{E}_q[\log p(z)]+\log p(x).$$

**Step 5 — Rearrange to isolate $\log p(x)$.**

$$\log p(x)=\operatorname{KL}+\mathbb{E}_q[\log p(x\mid z)]-\mathbb{E}_q\left[\log\frac{q(z\mid x)}{p(z)}\right].$$

**Step 6 — Name the ELBO.**

$$\operatorname{ELBO}=\mathbb{E}_q[\log p(x\mid z)]-\operatorname{KL}(q(z\mid x)\|p(z)).$$

**Answer.**

$$\log p(x)=\operatorname{KL}(q(z\mid x)\|p(z\mid x))+\operatorname{ELBO}.$$

Because KL is nonnegative, ELBO is a lower bound on $\log p(x)$.

---

## Q37. Build the VAE loss from the Gaussian KL identity

For a diagonal Gaussian encoder

$$q_\Phi(z\mid x)=\mathcal N(\mu,\operatorname{diag}(\sigma^2)),$$

with standard normal prior $p(z)=\mathcal N(0,I)$, derive the coordinatewise KL term using code variable

$$\text{log var}_i=\log\sigma_i^2.$$

### Solution

**Step 1 — Start from the Gaussian KL identity.**

For $k$ dimensions,

$$\operatorname{KL}(\mathcal N(\mu,\Sigma)\|\mathcal N(0,I))
=\frac12\left[\operatorname{Tr}(\Sigma)+\|\mu\|_2^2-k-\log\det(\Sigma)\right].$$

**Step 2 — Use diagonal covariance.**

If

$$\Sigma=\operatorname{diag}(\sigma_1^2,\ldots,\sigma_k^2),$$

then

$$\operatorname{Tr}(\Sigma)=\sum_i \sigma_i^2,$$

and

$$\log\det(\Sigma)=\sum_i\log\sigma_i^2.$$

**Step 3 — Substitute into KL.**

$$\operatorname{KL}=\frac12\sum_i\left[\sigma_i^2+\mu_i^2-1-\log\sigma_i^2\right].$$

**Step 4 — Convert to code variable `log var`.**

Since

$$\text{log var}_i=\log\sigma_i^2,$$

we have

$$\sigma_i^2=e^{\text{log var}_i}.$$

**Step 5 — Write the code-friendly KL.**

$$\operatorname{KL}=\frac12\sum_i\left[e^{\text{log var}_i}+\text{mean}_i^2-1-\text{log var}_i\right].$$

Equivalently,

$$\operatorname{KL}=-\frac12\sum_i\left[1+\text{log var}_i-\text{mean}_i^2-e^{\text{log var}_i}\right].$$

**Answer.**  
The VAE KL term is

$$-\frac12\sum_i[1+\text{log var}_i-\text{mean}_i^2-e^{\text{log var}_i}].$$

---

# Section D — Hard edge cases / where methods disagree or break down

## Q38. Population risk versus empirical risk: which one is computable?

A learner has a training set $S$ but does not know the true data distribution $D$. It wants to minimise true expected error. Which risk can it compute directly, which risk does it actually care about, and why is this the core ML problem?

### Solution

**Step 1 — Identify the target quantity.**  
The true target is population risk:

$$R(w)=\mathbb{E}_{(x,y)\sim D}[\ell(w,x,y)].$$

This measures expected loss over the real data-generating distribution.

**Step 2 — Ask whether $D$ is known.**  
The learner does not know $D$.

Therefore it cannot usually compute $R(w)$ exactly.

**Step 3 — Identify the computable substitute.**  
Given samples $S=\{(x_i,y_i)\}_{i=1}^m$, the learner can compute empirical risk:

$$\widehat R(w)=\frac1m\sum_{i=1}^m\ell(w,x_i,y_i).$$

**Step 4 — State the core tension.**  
The learner minimises $\widehat R(w)$ because it is computable, but it actually wants small $R(w)$ because that measures future/general data performance.

**Answer.**  
Empirical risk is computable; population risk is the real target. The core ML challenge is using empirical risk minimisation to achieve low population risk.

---

## Q39. Convex function with no minimiser versus non-convex function with minima

Compare $F_1(x)=e^{-x}$ and $F_2(x)=\frac12(x^2-4)^2$. Which is convex? Which has global minima? Why does convex not automatically mean “has a minimum”?

### Solution

**Step 1 — Analyse $F_1(x)=e^{-x}$.**  
Differentiate twice:

$$F_1'(x)=-e^{-x},\qquad F_1''(x)=e^{-x}>0.$$

So $F_1$ is convex.

**Step 2 — Check whether $F_1$ attains a minimum.**  
As $x\to\infty$,

$$e^{-x}\to0,$$

but $e^{-x}$ never equals $0$ at a finite $x$.

So $F_1$ has no finite minimiser.

**Step 3 — Analyse $F_2(x)=\frac12(x^2-4)^2$.**  
This function is nonnegative and equals zero when

$$x^2-4=0.$$

So it has global minima at

$$x=\pm2.$$

**Step 4 — Explain the edge case.**  
Convexity is about shape/tangent geometry. It does not guarantee that the infimum is attained at a finite point.

**Answer.**  
$e^{-x}$ is convex but has no finite minimiser. The Mexican-hat objective is non-convex but has global minima at $\pm2$. Convexity helps optimisation when a minimiser exists, but it does not by itself guarantee existence.

---

## Q40. Starting gradient descent at a critical point

Compare starting GD at $x_0=0$ for $F(x)=x^2$ and for $G(x)=\frac12(x^2-4)^2$. What happens in each case, and why is this an edge case?

### Solution

**Step 1 — Recall the GD rule.**

$$x_{t+1}=x_t-\eta F'(x_t).$$

If the gradient is zero at the start, GD does not move.

**Step 2 — Check $F(x)=x^2$.**

$$F'(x)=2x.$$

At $x_0=0$,

$$F'(0)=0.$$

So GD stays at $0$.

Here this is fine because $x=0$ is the global minimum.

**Step 3 — Check $G(x)=\frac12(x^2-4)^2$.**

$$G'(x)=2x(x^2-4).$$

At $x_0=0$,

$$G'(0)=0.$$

So GD also stays at $0$.

**Step 4 — Decide whether $0$ is a global minimum for $G$.**

$$G(0)=\frac12(0-4)^2=8.$$

But

$$G(2)=G(-2)=0.$$

So $x=0$ is not a global minimum.

**Answer.**  
For $x^2$, starting at $0$ leaves GD at the global minimum. For the Mexican-hat objective, starting at $0$ traps GD at a non-minimising critical point. This is why critical points are dangerous starting points in non-convex optimisation.

---

## Q41. Why spectral radius is not a substitute for spectral norm

Someone claims: “To measure how much a matrix stretches vectors, just compute the largest eigenvalue magnitude.” Use the lecture's $A(\theta)$ example to refute this.

### Solution

**Step 1 — State what vector stretching means in the lecture.**  
The spectral norm measures maximum vector stretch:

$$\|A\|_2=\max_{\|x\|_2=1}\|Ax\|_2.$$

**Step 2 — Use the lecture's matrix.**

$$A(\theta)=\begin{bmatrix}0&\theta\\0&0\end{bmatrix}.$$

**Step 3 — Compute eigenvalue magnitude.**  
The only eigenvalue is $0$, so the spectral radius is

$$\rho(A)=0.$$

**Step 4 — Compute actual maximum stretch.**  
The spectral norm is

$$\|A(\theta)\|_2=|\theta|.$$

For example, if $\theta=1000$, then

$$\rho(A)=0,$$

but

$$\|A\|_2=1000.$$

**Step 5 — Conclude.**  
The eigenvalues completely miss the large stretching effect in this example.

**Answer.**  
Spectral radius can badly underestimate vector stretch. The spectral norm, not spectral radius, is the correct quantity for maximum Euclidean stretching.

---

## Q42. JL length preservation versus pairwise distance preservation

A projection preserves $\|a\|_2$ for a single vector $a$. Explain how this becomes pairwise distance preservation for a finite set $a_1,\dots,a_n$, and what extra issue appears.

### Solution

**Step 1 — Rewrite pairwise distance as a norm.**

For any pair $(i,j)$,

$$\|a_i-a_j\|_2$$

is the norm of the difference vector

$$a_i-a_j.$$

**Step 2 — Apply norm preservation to difference vectors.**  
If the projection $\Pi$ preserves the norm of every difference vector $a_i-a_j$, then

$$\|\Pi(a_i-a_j)\|_2\approx \|a_i-a_j\|_2.$$

**Step 3 — Use linearity of the projection.**

Because $\Pi$ is linear,

$$\Pi(a_i-a_j)=\Pi a_i-\Pi a_j.$$

So,

$$\|\Pi a_i-\Pi a_j\|_2\approx\|a_i-a_j\|_2.$$

**Step 4 — Identify the extra finite-set issue.**  
There is not just one vector to preserve. There are many pairwise difference vectors:

$$\binom n2$$

pairs.

To make all pairwise distances succeed at once, the projection must succeed for every pair. This is where a union-bound style argument and the $\log n$ dependence enter.

**Answer.**  
Pairwise distance preservation follows by applying norm preservation to all difference vectors $a_i-a_j$. The extra issue is simultaneous success over all $\binom n2$ pairs.

---

## Q43. Expected sketched loss is not the same as a deterministic guarantee

The lecture shows

$$\mathbb{E}_\Pi\|\Pi r\|_2^2=\|r\|_2^2.$$

Does this mean every sampled $\Pi$ preserves every residual exactly? Explain the correct interpretation.

### Solution

**Step 1 — Read the equation carefully.**

The equation contains an expectation:

$$\mathbb{E}_\Pi.$$

So it is an average statement over the randomness of $\Pi$.

**Step 2 — State what the equation guarantees.**  
For a fixed residual $r$, if many independent sketch matrices were sampled, the average sketched squared norm would equal the original squared norm.

**Step 3 — State what it does not guarantee.**  
It does not say that every particular sampled $\Pi$ satisfies

$$\|\Pi r\|_2^2=\|r\|_2^2.$$

A given sketch may overestimate or underestimate the norm.

**Step 4 — Connect to JL-style guarantees.**  
JL-type results add high-probability approximate preservation:

$$(1-\varepsilon)\|r\|_2^2\le\|\Pi r\|_2^2\le(1+\varepsilon)\|r\|_2^2$$

with high probability, not necessarily exact equality.

**Answer.**  
Expected preservation is an average-over-sketches statement. It is not an exact deterministic guarantee for every sampled sketch.

---

## Q44. Architecture diagram versus neural function

A slide shows an architecture from $\mathbb{R}^4$ to $\mathbb{R}^3$, but no weights or biases are assigned. Is this already a neural function? Explain.

### Solution

**Step 1 — Define an architecture.**  
An architecture specifies the layer structure, widths, and connections.

For example, it may say the network maps

$$\mathbb{R}^4\to\mathbb{R}^3.$$

**Step 2 — Ask what is missing.**  
To get a specific neural function, every affine map needs actual weights and biases.

**Step 3 — Distinguish class from instance.**  
The architecture defines a class of possible functions:

all functions obtainable by varying the weights and biases.

It does not define one particular function.

**Answer.**  
No. A diagram without weights and biases is an architecture, not a single neural function. It defines a family of possible functions.

---

## Q45. PyTorch `Linear`: linear or affine?

A PyTorch layer called `Linear` computes $x\mapsto Wx+b$. Is this mathematically linear? Why does the distinction matter in the lecture?

### Solution

**Step 1 — Recall the mathematical definition of linearity.**  
A map $L$ is linear if it satisfies

$$L(0)=0,$$

and preserves addition/scalar multiplication.

**Step 2 — Evaluate the PyTorch layer at zero.**

$$x\mapsto Wx+b.$$

At $x=0$,

$$W0+b=b.$$

If $b\ne0$, then the output is not $0$.

**Step 3 — Classify the map.**  
A map of the form

$$x\mapsto Wx+b$$

is affine. It is linear only in the special case $b=0$.

**Step 4 — Connect to the lecture.**  
The lecture warns that software terminology can differ from mathematical terminology. PyTorch's `Linear` with bias is mathematically affine.

**Answer.**  
With bias, PyTorch `Linear` is affine, not purely linear.

---

## Q46. ReLU is convex but not differentiable everywhere

Explain why the lecture can treat ReLU as a useful activation even though the differentiable convexity formula does not directly apply at $x=0$.

### Solution

**Step 1 — Write ReLU.**

$$\operatorname{ReLU}(x)=\max\{0,x\}.$$

**Step 2 — Check differentiability away from zero.**  
For $x<0$,

$$\operatorname{ReLU}(x)=0,$$

so derivative is $0$.

For $x>0$,

$$\operatorname{ReLU}(x)=x,$$

so derivative is $1$.

**Step 3 — Check the kink at zero.**  
The left derivative at $0$ is $0$, while the right derivative is $1$.

So ReLU is not differentiable at $0$.

**Step 4 — Explain convexity.**  
ReLU is still convex because it is the maximum of two affine functions:

$$0\quad\text{and}\quad x.$$

The maximum of convex affine functions is convex.

**Step 5 — Explain the lecture relevance.**  
The differentiable first-order convexity formula applies only when the function is differentiable everywhere. ReLU needs the broader convexity notion, but it is still central because neural networks use it effectively.

**Answer.**  
ReLU is convex but nondifferentiable at $0$. This is not a contradiction; it just means the differentiable convexity test is not the right tool at the kink.

---

## Q47. Known global minimum versus proving optimisation finds it

In the sparse-coding autoencoder special case, the loss can be $0$ when $W^\top=A^\star$. Does that prove gradient descent will recover $A^\star$ from data? Explain.

### Solution

**Step 1 — State what the zero-loss proof shows.**  
Under special assumptions,

$$W^\top=A^\star$$

makes the reconstruction exact, so the loss is $0$.

**Step 2 — Use nonnegativity of squared loss.**  
Because squared reconstruction loss is nonnegative, $0$ is a global minimum.

**Step 3 — Identify what this does not show.**  
It does not show that an optimisation algorithm will find that $W$.

Training may face:

- non-convexity;
- bad initialisation;
- local minima or saddle/critical points;
- finite-sample issues.

**Step 4 — State the lecture's caveat.**  
The lecture explicitly separates knowing a good global minimiser exists from proving an algorithm recovers it.

**Answer.**  
No. Existence of a global minimiser does not prove gradient descent will find it. Optimisation recovery is a separate and harder question.

---

## Q48. VAE forward pass versus ordinary deterministic network

Why is a VAE forward function not just “evaluate one neural network on $x$”? Name the steps and returned quantities.

### Solution

**Step 1 — Recall an ordinary deterministic forward pass.**  
A standard neural net usually computes

$$x\mapsto N(x)$$

with no sampling inside the forward computation.

**Step 2 — Identify the VAE encoder step.**  
The encoder maps the data vector to latent Gaussian parameters:

$$(\mu_z,\text{log var})=\operatorname{Encoder}_\Phi(x).$$

**Step 3 — Identify the sampling step.**  
A latent vector is sampled from the encoder distribution:

$$z\sim q_\Phi(z\mid x).$$

In implementation, this is often written

$$z=\mu_z+\sigma_z\circ\epsilon,\qquad \epsilon\sim\mathcal N(0,I).$$

**Step 4 — Identify the decoder step.**  
The decoder maps $z$ to a reconstruction:

$$\widehat x=\operatorname{Decoder}_\Theta(z).$$

**Step 5 — State the returned quantities.**  
The forward function returns

$$(\widehat x,\mu_z,\text{log var}).$$

The mean and log variance are needed to compute the KL term in the VAE loss.

**Answer.**  
A VAE forward pass uses two neural nets plus stochastic sampling: encode $x$, sample $z$, decode $z$, and return $(\widehat x,\mu_z,\text{log var})$.

---

## Q49. Which KL direction appears in the VAE objective?

The VAE objective uses

$$\operatorname{KL}(q_\Phi(z\mid x)\|p(z)),$$

not

$$\operatorname{KL}(p(z)\|q_\Phi(z\mid x)).$$

Why does the order matter computationally?

### Solution

**Step 1 — Recall that KL is asymmetric.**

In general,

$$\operatorname{KL}(p\|q)\ne\operatorname{KL}(q\|p).$$

So the order cannot be swapped casually.

**Step 2 — Identify the distributions in the VAE KL term.**

The encoder distribution is

$$q_\Phi(z\mid x)=\mathcal N(\mu_z,\operatorname{diag}(\sigma_z^2)).$$

The prior is

$$p(z)=\mathcal N(0,I).$$

**Step 3 — Connect to the code formula.**  
The code formula

$$-\frac12\sum_i[1+\text{log var}_i-\text{mean}_i^2-e^{\text{log var}_i}]$$

is specifically the closed form for

$$\operatorname{KL}(q_\Phi(z\mid x)\|p(z)).$$

**Step 4 — Explain the computational consequence.**  
Using the reverse KL would give a different mathematical quantity and a different loss landscape.

**Answer.**  
The order matters because KL is asymmetric. The VAE code formula corresponds specifically to $\operatorname{KL}(q_\Phi(z\mid x)\|p(z))$.

---

## Q50. ELBO, VFE, and optimisation direction

The lecture states

$$\operatorname{ELBO}=-\operatorname{VFE}.$$

If the goal is to make $q(z\mid x)$ close to the true posterior $p(z\mid x)$, should training maximise ELBO or minimise VFE? Explain using the decomposition.

### Solution

**Step 1 — Write the decomposition.**

$$\log p(x)=\operatorname{KL}(q(z\mid x)\|p(z\mid x))+\operatorname{ELBO}.$$

**Step 2 — Treat $\log p(x)$ as fixed with respect to $q$.**  
For a fixed observed data point $x$, the value $\log p(x)$ is constant when optimising $q$.

**Step 3 — Use nonnegativity of KL.**  
To make

$$\operatorname{KL}(q(z\mid x)\|p(z\mid x))$$

small, the ELBO must become large, because their sum is fixed.

**Step 4 — Convert to VFE.**  
The lecture states

$$\operatorname{VFE}=-\operatorname{ELBO}.$$

Maximising ELBO is therefore equivalent to minimising VFE.

**Answer.**  
Training should maximise ELBO, equivalently minimise VFE.

---

## Q51. Reconstruction loss versus KL regularisation in a VAE

A VAE has low reconstruction loss but a very large KL term. What does each part of the loss say, and why might the total VFE still be bad?

### Solution

**Step 1 — Recall the VFE structure.**

$$\operatorname{VFE}= -\mathbb{E}_q\log p_\Theta(x\mid z)+\operatorname{KL}(q_\Phi(z\mid x)\|p(z)).$$

**Step 2 — Interpret reconstruction loss.**  
The term

$$-\mathbb{E}_q\log p_\Theta(x\mid z)$$

checks whether the decoder can reconstruct or generate $x$ well from sampled $z$.

Low reconstruction loss means the decoder reconstruction is good.

**Step 3 — Interpret the KL term.**

$$\operatorname{KL}(q_\Phi(z\mid x)\|p(z))$$

checks whether the encoder distribution stays close to the prior.

A large KL means the encoder is using latent distributions far from the simple prior.

**Step 4 — Combine the terms.**  
The total VFE is the sum of reconstruction loss and KL regularisation. Even if one is small, the other can dominate.

**Answer.**  
Low reconstruction loss alone is not enough. A very large KL term can make total VFE high because the encoder distribution is far from the prior.

---

## Q52. Non-convex neural loss: what should you infer from the plot?

The lecture shows a one-dimensional neural loss using a sigmoid gate and regularised squared loss. For $\lambda=0.13$, the plot has a local maximum, two local minima, and only one global minimum. What are the safe conclusions?

### Solution

**Step 1 — Identify the model class.**  
The model is extremely simple: one scalar weight inside a sigmoid gate.

**Step 2 — Identify the objective.**  
The loss is regularised squared loss as a function of the weight $w$.

**Step 3 — Read the plot features.**  
The plot contains:

- a local maximum;
- two local minima;
- only one global minimum.

**Step 4 — Infer non-convexity.**  
A differentiable convex one-dimensional function cannot have this kind of local-max/local-min structure. Therefore the objective is non-convex.

**Step 5 — Avoid overclaiming.**  
This example shows neural losses can be non-convex even in simple cases. It does not prove every neural-network loss always has exactly this shape.

**Answer.**  
The safe conclusion is that neural-network losses can be non-convex even for very simple models, so gradient-based optimisation may face local minima and other critical-point issues.

---

# Final self-test checklist

You should be able to do the following without looking at the solutions:

- Convert data objects into vector dimensions.
- Compute $2\sqrt d$ and $\frac12(\sqrt d-1)$ for the high-dimensional cube example.
- Check whether a simple density integrates to $1$ and compute event probabilities.
- Write population risk and empirical risk.
- Compute Euclidean norms and squared losses.
- Check convexity using derivatives and distinguish convexity from existence of a minimiser.
- Set up a Lagrangian and solve first-order equations.
- Compute eigenvalues, spectral radius, and spectral norm in the nilpotent matrix example.
- Derive, unroll, and analyse GD recurrences.
- Derive the Mexican-hat update and identify critical points.
- State and use JL norm/distance preservation.
- Build sketched regression objectives and prove expected loss preservation.
- Compute ReLU layer outputs and build the ReLU max network.
- Track DNN composition dimensions.
- Compute autoencoder hidden codes, reconstructions, and losses.
- Prove the special sparse-coding zero-loss result.
- Build latent-variable marginals and posteriors.
- Compute discrete KL divergence.
- Derive ELBO and translate VAE code variables into the VFE/loss.
