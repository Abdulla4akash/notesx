---
subject: COMP64501
chapter: 5
title: "Neural Networks and Automatic Differentiation"
language: en
---

# Study Notes — Automatic Differentiation, Neural Networks, and CNNs

**Course:** Topics in Machine Learning, University of Manchester  
**Lecture topics:** Automatic differentiation; feedforward neural networks, backpropagation, training deep neural networks, and convolutional neural networks.

**Topic and scope:** These lectures connect optimisation in machine learning to the practical computation of gradients. The automatic differentiation lecture explains how derivatives are computed efficiently in programs, especially reverse-mode AD/backpropagation. The neural networks lecture then uses backpropagation to train multilayer networks and extends the discussion to deep training methods and CNNs.

> **Source note:** No lecture transcript was provided in the chat. These notes use the two uploaded slide decks only: `autodiff.pdf` and `neural-networks.pdf`. Transcript-dependent details such as spoken “this is on the exam” comments cannot be verified until the transcript is provided.

---

# Part I — Automatic Differentiation

## 1. Why derivatives matter in machine learning

### Intuition

Many machine learning algorithms are optimisation problems. To optimise an objective function, we need derivatives that tell us how the objective changes when parameters change.

Derivatives are needed for:

- **Batch gradient descent**
- **Stochastic gradient descent**
- **Second-order optimisation methods**, which require Hessians

### Formal role

If an objective or model output depends on parameters, gradients provide the direction of steepest local increase/decrease. Hessians provide second-order curvature information.

The lecture frames derivatives as a core requirement for optimisation in ML algorithms.

---

## 2. Ways to compute derivatives in computer programs

The lecture compares four methods:

1. Manual differentiation
2. Numerical differentiation using finite differences
3. Symbolic differentiation
4. Automatic differentiation / algorithmic differentiation

The main motivation is that automatic differentiation gives exact numerical derivative values efficiently without manually deriving large expressions.

---

## 3. Manual differentiation

### 3.1 Worked example

The function is:

$$
f(x,y) = x^2y + y + 2
$$

The aim is to compute the gradient with respect to

$$
z =
\begin{bmatrix}
x \\
y
\end{bmatrix}.
$$

The gradient is written as:

$$
\frac{df(x,y)}{dz}
=
\begin{bmatrix}
\frac{\partial f(x,y)}{\partial x} \\
\frac{\partial f(x,y)}{\partial y}
\end{bmatrix}.
$$

### 3.2 Calculus rules used

The slides list the following rules:

- The derivative of a constant is $0$.
- The derivative of $ax$ with respect to $x$ is $a$, where $a$ is constant.
- The derivative of $x^a$ is $ax^{a-1}$.
- Differentiation is linear: the derivative of a sum is the sum of the derivatives.
- The derivative of a constant times a function is the constant times the derivative.

### 3.3 Derivation

For

$$
f(x,y)=x^2y+y+2,
$$

the partial derivative with respect to $x$ is:

$$
\frac{\partial}{\partial x} f(x,y)
=
\frac{\partial}{\partial x}(x^2y+y+2).
$$

Treat $y$ as constant:

$$
\frac{\partial}{\partial x}(x^2y)=2xy,
$$

$$
\frac{\partial}{\partial x}(y)=0,
$$

$$
\frac{\partial}{\partial x}(2)=0.
$$

Therefore:

$$
\frac{\partial f(x,y)}{\partial x}=2xy.
$$

The partial derivative with respect to $y$ is:

$$
\frac{\partial}{\partial y} f(x,y)
=
\frac{\partial}{\partial y}(x^2y+y+2).
$$

Treat $x$ as constant:

$$
\frac{\partial}{\partial y}(x^2y)=x^2,
$$

$$
\frac{\partial}{\partial y}(y)=1,
$$

$$
\frac{\partial}{\partial y}(2)=0.
$$

Therefore:

$$
\frac{\partial f(x,y)}{\partial y}=x^2+1.
$$

So the gradient is:

$$
\frac{df(x,y)}{dz}
=
\begin{bmatrix}
2xy \\
x^2+1
\end{bmatrix}.
$$

### 3.4 Problem with manual differentiation

Manual differentiation becomes tedious and error-prone when:

- the function has many variables;
- the expression is complicated;
- the model has many parameters.

This matters directly for machine learning because modern models can have many parameters.

---

## 4. Finite difference approximation

### 4.1 Definition of a derivative

For a single-variable function $h(x)$, the derivative at $x_0$ is:

$$
\frac{dh(x_0)}{dx}
=
\lim_{x \to x_0}
\frac{h(x)-h(x_0)}{x-x_0}.
$$

Equivalently, using a small perturbation $\epsilon$:

$$
\frac{dh(x_0)}{dx}
=
\lim_{\epsilon \to 0}
\frac{h(x_0+\epsilon)-h(x_0)}{\epsilon}.
$$

### 4.2 Partial derivatives by finite differences

For a two-variable function $h(x,y)$, the partial derivatives at $(x_0,y_0)$ are:

$$
\frac{\partial h(x_0,y_0)}{\partial x}
=
\lim_{\epsilon \to 0}
\frac{h(x_0+\epsilon,y_0)-h(x_0,y_0)}{\epsilon},
$$

$$
\frac{\partial h(x_0,y_0)}{\partial y}
=
\lim_{\epsilon \to 0}
\frac{h(x_0,y_0+\epsilon)-h(x_0,y_0)}{\epsilon}.
$$

### 4.3 Worked example from slides

For the earlier function:

$$
f(x,y)=x^2y+y+2,
$$

the slide evaluates finite differences at:

$$
x_0=3,\qquad y_0=2,\qquad \epsilon=10^{-6}.
$$

Numerical finite difference approximation for $x$:

$$
\frac{\partial f}{\partial x}
\approx
\frac{f(x_0+\epsilon,y_0)-f(x_0,y_0)}{\epsilon}.
$$

The slide output gives approximately:

$$
\frac{\partial f}{\partial x}
\approx 12.000002001855137.
$$

The analytical derivative is:

$$
2xy = 2(3)(2)=12.
$$

Numerical finite difference approximation for $y$:

$$
\frac{\partial f}{\partial y}
\approx
\frac{f(x_0,y_0+\epsilon)-f(x_0,y_0)}{\epsilon}.
$$

The slide output gives approximately:

$$
\frac{\partial f}{\partial y}
\approx 10.000000003174137.
$$

The analytical derivative is:

$$
x^2+1=3^2+1=10.
$$

So the finite difference approximation is close, but not exact.

### 4.4 Problems with finite differences

The lecture lists three main issues:

- The result is imprecise.
- The imprecision gets worse with more complicated functions.
- The function must be evaluated at least twice, and for large parametric models it must be evaluated many times.

However, finite differences are easy to implement and can be used to test whether a manual derivative implementation is correct.

---

## 5. Symbolic differentiation

### 5.1 Definition

#### Intuition

Symbolic differentiation manipulates mathematical expressions directly to produce derivative expressions.

#### Formal description from slides

Symbolic differentiation performs automatic manipulation of expressions to obtain corresponding derivative expressions. The expression is represented using data structures such as trees or lists, and then a mechanistic process is used to obtain derivatives.

### 5.2 Examples of symbolic differentiation tools

The slides mention:

- Mathematica
- Maxima
- Maple

### 5.3 Expression swell

#### Definition

**Expression swell** is the growth of derivative expressions into very long, redundant forms when symbolic differentiation is applied mechanistically.

#### Why it happens

Symbolic differentiation may repeatedly expand expressions without simplifying shared sub-expressions. This can create long derivative expressions that are:

- difficult to understand;
- difficult to evaluate;
- full of redundancy.

### 5.4 Logistic map example

The slides use the logistic map:

$$
l_n = 4l_{n-1}(1-l_{n-1}),
\qquad l_1=x.
$$

The table shows that as $n$ increases, the expression for $l_n$ and especially $\frac{dl_n}{dx}$ becomes increasingly large.

For example:

$$
l_1=x,
\qquad
\frac{dl_1}{dx}=1.
$$

Then:

$$
l_2=4x(1-x),
$$

$$
\frac{dl_2}{dx}
=
4(1-x)-4x.
$$

The expressions for $n=3$ and $n=4$ become substantially longer. This demonstrates expression swell.

The slides also show that Mathematica’s `Simplify` can reduce some of these expressions, but the main point remains: symbolic differentiation can produce unwieldy expressions if not handled carefully.

---

## 6. Automatic differentiation

### 6.1 Definition

#### Intuition

Automatic differentiation computes derivative values by breaking a program into elementary operations and applying the chain rule at each step.

It does not try to produce a full symbolic derivative expression. Instead, it computes exact numerical derivatives at a point by reusing intermediate values.

#### Formal definition from slides

Automatic differentiation is concerned with **exact numerical computation of derivatives**, rather than their actual symbolic form. It computes derivatives by storing values of intermediate sub-expressions and combining:

- symbolic differentiation at the elementary operation level;
- intermediate numerical results.

---

## 7. Evaluation traces and computational graphs

### 7.1 Evaluation trace

#### Definition

An **evaluation trace** is the composition of elementary operations that lead to a full expression.

### 7.2 Worked example

The function is:

$$
f(x_1,x_2)=\ln(x_1)+x_1x_2-\sin(x_2).
$$

The inputs are:

$$
x_1,\quad x_2.
$$

The elementary operations are:

$$
v_1=\ln(x_1),
$$

$$
v_2=x_1x_2,
$$

$$
v_3=\sin(x_2),
$$

$$
v_4=v_1+v_2,
$$

$$
v_5=v_4-v_3,
$$

$$
f(x_1,x_2)=v_5.
$$

The computational graph shows how $x_1$ feeds into $v_1$ and $v_2$, $x_2$ feeds into $v_2$ and $v_3$, and the values are combined through $v_4$ and $v_5$.

---

## 8. General notation for automatic differentiation

The slides introduce a general function:

$$
f:\mathbb{R}^n \to \mathbb{R}^m.
$$

Input variables are written as:

$$
v_{i-n}=x_i,
\qquad i=1,\dots,n.
$$

Intermediate variables are:

$$
v_i,
\qquad i=1,\dots,l.
$$

Output variables are:

$$
y_{m-i}=v_{l-i},
\qquad i=m-1,\dots,0.
$$

**[UNCLEAR]** The slide notation for output variables is compact and slightly awkward in the parsed text. The intended meaning is that the final variables in the evaluation trace correspond to the output variables.

---

## 9. Jacobian

### 9.1 Definition

Suppose there are several functions:

$$
y_i=f_i(\cdot), \qquad i=1,\dots,m,
$$

depending on several input variables:

$$
x_1,x_2,\dots,x_n.
$$

That is:

$$
y_1=f_1(x_1,\dots,x_n),
$$

$$
y_2=f_2(x_1,\dots,x_n),
$$

$$
\vdots
$$

$$
y_m=f_m(x_1,\dots,x_n).
$$

The **Jacobian** $J$ is an $m \times n$ matrix with entries:

$$
J_{ij}
=
\frac{\partial f_i}{\partial x_j}.
$$

Explicitly:

$$
J=
\begin{bmatrix}
\frac{\partial f_1}{\partial x_1}
&
\frac{\partial f_1}{\partial x_2}
&
\cdots
&
\frac{\partial f_1}{\partial x_n}
\\
\frac{\partial f_2}{\partial x_1}
&
\frac{\partial f_2}{\partial x_2}
&
\cdots
&
\frac{\partial f_2}{\partial x_n}
\\
\vdots & \vdots & \ddots & \vdots
\\
\frac{\partial f_m}{\partial x_1}
&
\frac{\partial f_m}{\partial x_2}
&
\cdots
&
\frac{\partial f_m}{\partial x_n}
\end{bmatrix}.
$$

---

## 10. Forward-mode automatic differentiation

### 10.1 Definition

Forward accumulation mode is also called **tangent linear mode**.

To compute the derivative of $f$ with respect to $x_1$, each intermediate variable $v_i$ has an associated derivative:

$$
\dot{v}_i
=
\frac{\partial v_i}{\partial x_1}.
$$

For each evaluation trace, also called the **forward primal trace**, forward-mode AD builds a **forward derivative trace**, also called the **tangent trace**.

### 10.2 Chain rule basis

Forward mode implements the chain rule:

$$
\frac{dy}{dx}
=
\frac{dy}{du}
\frac{du}{dz}
\frac{dz}{dx}.
$$

The key idea is that derivatives are propagated forward at the same time as values.

---

## 11. Forward-mode worked example

### 11.1 Function

The function is:

$$
y=f(x_1,x_2)=\ln(x_1)+x_1x_2-\sin(x_2).
$$

The aim is to compute:

$$
\frac{\partial y}{\partial x_1}.
$$

### 11.2 Forward primal trace and tangent trace

The primal trace is:

$$
v_{-1}=x_1,
$$

$$
v_0=x_2,
$$

$$
v_1=\ln(v_{-1}),
$$

$$
v_2=v_{-1}v_0,
$$

$$
v_3=\sin(v_0),
$$

$$
v_4=v_1+v_2,
$$

$$
v_5=v_4-v_3,
$$

$$
y=v_5.
$$

The tangent trace for $\partial y/\partial x_1$ is:

$$
\dot{v}_{-1}=\dot{x}_1,
$$

$$
\dot{v}_0=\dot{x}_2,
$$

$$
\dot{v}_1=
\frac{1}{v_{-1}}\dot{v}_{-1},
$$

$$
\dot{v}_2=
\dot{v}_{-1}v_0+\dot{v}_0v_{-1},
$$

$$
\dot{v}_3=
\dot{v}_0\cos(v_0),
$$

$$
\dot{v}_4=
\dot{v}_1+\dot{v}_2,
$$

$$
\dot{v}_5=
\dot{v}_4-\dot{v}_3,
$$

$$
\dot{y}=\dot{v}_5.
$$

### 11.3 Numerical evaluation at $x_1=2,\ x_2=5$

To compute $\partial y/\partial x_1$, initialise:

$$
\dot{x}_1=1,
\qquad
\dot{x}_2=0.
$$

Thus:

$$
v_{-1}=x_1=2,
\qquad
\dot{v}_{-1}=1.
$$

$$
v_0=x_2=5,
\qquad
\dot{v}_0=0.
$$

Next:

$$
v_1=\ln(v_{-1})=\ln 2 \approx 0.693,
$$

$$
\dot{v}_1=
\frac{1}{v_{-1}}\dot{v}_{-1}
=
\frac{1}{2}(1)
=
0.5.
$$

Then:

$$
v_2=v_{-1}v_0=2 \times 5=10,
$$

$$
\dot{v}_2
=
\dot{v}_{-1}v_0+\dot{v}_0v_{-1}
=
1 \times 5 + 0 \times 2
=
5.
$$

Then:

$$
v_3=\sin(v_0)=\sin(5).
$$

The slide uses:

$$
\sin(5)\approx -0.959,
$$

and because $v_5=v_4-v_3$, this appears as adding $0.959$ later.

The tangent value is:

$$
\dot{v}_3
=
\dot{v}_0\cos(v_0)
=
0 \times \cos(5)
=
0.
$$

Then:

$$
v_4=v_1+v_2=0.693+10=10.693,
$$

$$
\dot{v}_4=\dot{v}_1+\dot{v}_2=0.5+5=5.5.
$$

Then:

$$
v_5=v_4-v_3=10.693-\sin(5).
$$

Since $\sin(5)\approx -0.959$,

$$
v_5\approx 10.693+0.959=11.652.
$$

And:

$$
\dot{v}_5
=
\dot{v}_4-\dot{v}_3
=
5.5-0
=
5.5.
$$

Therefore:

$$
y=11.652,
\qquad
\frac{\partial y}{\partial x_1}=5.5.
$$

The slides add that if instead we wanted:

$$
\frac{\partial y}{\partial x_2},
$$

we would set:

$$
\dot{v}_{-1}=0,
\qquad
\dot{v}_0=1.
$$

---

## 12. Forward mode and the Jacobian

For a function:

$$
f:\mathbb{R}^n \to \mathbb{R}^m,
$$

with independent variables $x_i$ and dependent variables $y_j$, the derivatives in the Jacobian are:

$$
\frac{\partial y_j}{\partial x_i}.
$$

To compute a column of the Jacobian, set:

$$
\dot{x}_i=1,
$$

and all other input tangents to zero:

$$
\dot{x}_k=0
\qquad
k \ne i.
$$

At a point $x=a$, the resulting tangent values are:

$$
\dot{y}_j
=
\left.
\frac{\partial y_j}{\partial x_i}
\right|_{x=a}.
$$

For a specific input $x_i$, one forward pass computes all derivatives:

$$
\frac{\partial y_j}{\partial x_i},
\qquad j=1,\dots,m.
$$

This is column $i$ of the Jacobian.

Therefore, to compute the whole Jacobian, forward mode requires:

$$
n
$$

forward passes, one per input variable.

---

## 13. Complexity of forward-mode AD

Forward mode is efficient for functions of the form:

$$
f:\mathbb{R}\to\mathbb{R}^m.
$$

Reason: with one input variable, one forward pass computes all derivatives:

$$
\frac{\partial y_j}{\partial x},
\qquad j=1,\dots,m.
$$

But for:

$$
f:\mathbb{R}^n\to\mathbb{R},
$$

forward mode needs $n$ forward passes. If $n$ is large, this becomes expensive.

The slides state the rule of thumb:

$$
n \gg m \quad \Rightarrow \quad \text{reverse mode AD is preferred.}
$$

---

## 14. Reverse-mode automatic differentiation

### 14.1 Definition

Reverse-mode AD propagates derivatives backwards from a chosen output.

It computes intermediate variables called **adjoints**.

For an intermediate variable $v_i$, the adjoint is:

$$
\bar{v}_i
=
\frac{\partial y_j}{\partial v_i}.
$$

This measures the sensitivity of output $y_j$ to intermediate variable $v_i$.

### 14.2 Two phases

Reverse-mode AD uses two phases:

#### Phase 1: Forward step

Compute the intermediate variables $v_i$ and book-keep dependencies in the computational graph.

#### Phase 2: Backward / reverse step

Compute adjoints starting from the output and moving backwards to the inputs.

---

## 15. Reverse-mode example

### 15.1 Function

Again:

$$
y=f(x_1,x_2)=\ln(x_1)+x_1x_2-\sin(x_2).
$$

The slides focus on:

$$
v_0=x_2.
$$

The aim is to compute:

$$
\bar{v}_0
=
\frac{\partial y}{\partial v_0}.
$$

### 15.2 Contribution through multiple paths

From the computational graph, $v_0$ affects $y$ through both $v_2$ and $v_3$.

So:

$$
\frac{\partial y}{\partial v_0}
=
\frac{\partial y}{\partial v_2}
\frac{\partial v_2}{\partial v_0}
+
\frac{\partial y}{\partial v_3}
\frac{\partial v_3}{\partial v_0}.
$$

Using adjoint notation:

$$
\frac{\partial y}{\partial v_2}=\bar{v}_2,
\qquad
\frac{\partial y}{\partial v_3}=\bar{v}_3.
$$

Therefore:

$$
\bar{v}_0
=
\bar{v}_2
\frac{\partial v_2}{\partial v_0}
+
\bar{v}_3
\frac{\partial v_3}{\partial v_0}.
$$

This is the central reverse-mode idea: when a variable contributes to the output through several downstream paths, its adjoint sums the contributions from all paths.

### 15.3 Starting the reverse pass

After the forward pass computes the $v_i$, the reverse pass starts with:

$$
\bar{v}_5
=
\bar{y}
=
\frac{\partial y}{\partial y}
=
1.
$$

At the end, the reverse pass gives:

$$
\frac{\partial y}{\partial x_1}=\bar{x}_1,
$$

$$
\frac{\partial y}{\partial x_2}=\bar{x}_2.
$$

---

## 16. Reverse-mode numerical evaluation

### 16.1 Forward pass values

At:

$$
x_1=2,\qquad x_2=5,
$$

the forward values are:

$$
v_{-1}=2,
$$

$$
v_0=5,
$$

$$
v_1=\ln(v_{-1})=\ln 2,
$$

$$
v_2=v_{-1}v_0=10,
$$

$$
v_3=\sin(v_0)=\sin(5),
$$

$$
v_4=v_1+v_2=0.693+10,
$$

$$
v_5=v_4-v_3=10.693+0.959,
$$

$$
y=v_5=11.652.
$$

### 16.2 Reverse pass adjoints

Start at the output:

$$
\bar{v}_5=\bar{y}=1.
$$

Since:

$$
v_5=v_4-v_3,
$$

we have:

$$
\frac{\partial v_5}{\partial v_4}=1,
\qquad
\frac{\partial v_5}{\partial v_3}=-1.
$$

Therefore:

$$
\bar{v}_4
=
\bar{v}_5
\frac{\partial v_5}{\partial v_4}
=
1 \times 1
=
1.
$$

$$
\bar{v}_3
=
\bar{v}_5
\frac{\partial v_5}{\partial v_3}
=
1 \times (-1)
=
-1.
$$

Since:

$$
v_4=v_1+v_2,
$$

we have:

$$
\frac{\partial v_4}{\partial v_1}=1,
\qquad
\frac{\partial v_4}{\partial v_2}=1.
$$

Therefore:

$$
\bar{v}_1
=
\bar{v}_4
\frac{\partial v_4}{\partial v_1}
=
1 \times 1
=
1.
$$

$$
\bar{v}_2
=
\bar{v}_4
\frac{\partial v_4}{\partial v_2}
=
1 \times 1
=
1.
$$

Now for $v_{-1}=x_1$, there are contributions through $v_1$ and $v_2$:

$$
\bar{v}_{-1}
=
\bar{v}_1
\frac{\partial v_1}{\partial v_{-1}}
+
\bar{v}_2
\frac{\partial v_2}{\partial v_{-1}}.
$$

Since:

$$
v_1=\ln(v_{-1}),
\qquad
\frac{\partial v_1}{\partial v_{-1}}
=
\frac{1}{v_{-1}},
$$

and:

$$
v_2=v_{-1}v_0,
\qquad
\frac{\partial v_2}{\partial v_{-1}}
=
v_0,
$$

we get:

$$
\bar{v}_{-1}
=
\bar{v}_1 \frac{1}{v_{-1}}
+
\bar{v}_2 v_0.
$$

Substitute values:

$$
\bar{v}_{-1}
=
1\cdot \frac{1}{2}
+
1\cdot 5
=
5.5.
$$

Now for $v_0=x_2$, there are contributions through $v_2$ and $v_3$:

$$
\bar{v}_0
=
\bar{v}_2
\frac{\partial v_2}{\partial v_0}
+
\bar{v}_3
\frac{\partial v_3}{\partial v_0}.
$$

Since:

$$
v_2=v_{-1}v_0,
\qquad
\frac{\partial v_2}{\partial v_0}=v_{-1},
$$

and:

$$
v_3=\sin(v_0),
\qquad
\frac{\partial v_3}{\partial v_0}=\cos(v_0),
$$

we get:

$$
\bar{v}_0
=
\bar{v}_2v_{-1}
+
\bar{v}_3\cos(v_0).
$$

Substitute values:

$$
\bar{v}_0
=
1\cdot 2
+
(-1)\cos(5).
$$

The slide reports:

$$
\bar{v}_0=1.716.
$$

Finally:

$$
\bar{x}_1
=
\bar{v}_{-1}
\frac{\partial v_{-1}}{\partial x_1}
=
5.5 \times 1
=
5.5,
$$

$$
\bar{x}_2
=
\bar{v}_0
\frac{\partial v_0}{\partial x_2}
=
1.716 \times 1
=
1.716.
$$

Therefore the gradient at $(x_1,x_2)=(2,5)$ is:

$$
\nabla y
=
\begin{bmatrix}
5.5 \\
1.716
\end{bmatrix}.
$$

---

## 17. Reverse-mode complexity

Reverse-mode AD performs better when:

$$
n \gg m.
$$

This is the case in many machine learning models, where there are many parameters and usually one scalar objective to optimise.

The downside is increased storage cost because reverse mode must save intermediate values $v_i$ from the evaluation trace for use during the backward pass.

---

## 18. Reverse-mode AD and backpropagation

Reverse-mode AD is the algorithm used to train neural networks and deep learning models.

For neural network training, the objective function is written as:

$$
E(w):\mathbb{R}^n \to \mathbb{R}^m,
$$

where $w \in \mathbb{R}^n$ is a high-dimensional vector of parameters and typically:

$$
n \gg m.
$$

In the machine learning community, reverse-mode AD is called **backpropagation**.

Connection to later lecture: the automatic differentiation slides explicitly say that backpropagation will appear again in the neural networks session.

---

## 19. AD implementations

The slides show a survey table of AD implementations and highlight three popular implementations in the machine learning community:

- PyTorch
- TensorFlow
- JAX

The references listed are:

- Appendix D of *Hands-On Machine Learning with Scikit-Learn, Keras and TensorFlow*
- *Automatic Differentiation in Machine Learning: a Survey* by Baydin, Pearlmutter, Radul, and Siskind

---

# Part II — Neural Networks and CNNs

## 20. Lecture recap and intended learning outcomes

### 20.1 Previous lecture recap

The neural networks lecture starts by recapping that the previous lecture covered:

- basics of vector and matrix calculus;
- logistic regression as a linear classifier;
- stochastic gradient descent methods.

This connects the lecture to the previous material on optimisation and calculus.

### 20.2 Intended learning outcomes

By the end of the lecture, students should be able to:

- identify the key components of feedforward neural networks;
- explain how feedforward neural networks can be effectively optimised;
- apply variants of SGD methods to neural parameter updates;
- implement convolutional neural networks and SGD/RMSProp/Adam in practice.

---

## 21. Logistic regression as a neural unit

### 21.1 Logistic regression structure

The lecture begins from logistic regression.

A unit in a neural network computes:

1. a linear function of its input;
2. a nonlinear activation function applied to that linear function.

For logistic regression, the nonlinear activation is the sigmoid:

$$
\sigma(z)=\frac{1}{1+e^{-z}}.
$$

The output is:

$$
\hat{y}=P(y=1\mid x,w,b).
$$

The separating surface is linear.

### 21.2 Limitation shown by toy example

The slides show a toy two-dimensional classification dataset where the classes cannot be well separated by a single linear boundary.

The logistic regression decision boundary is a straight line and “fails badly” on this dataset.

This motivates moving from logistic regression to multilayer perceptrons.

---

## 22. Multi-layer perceptron

### 22.1 Definition

A **multi-layer perceptron** extends logistic regression by adding at least one hidden layer.

The example network has three layers:

1. Input layer
2. Hidden layer
3. Output layer

The hidden units use $\tanh$, and the output uses sigmoid.

### 22.2 Notation

The slides define notation for weights, pre-activations, and activations.

For weights:

$$
w^{(k)}_{ij}
$$

means:

- superscript $k$: the $k$-th layer;
- subscript $ij$: link from unit $j$ to unit $i$.

For pre-activations:

$$
z^{(k)}_i
$$

means:

- superscript $k$: the $k$-th layer;
- subscript $i$: unit $i$.

For activations:

$$
a^{(k)}_i
$$

means:

- superscript $k$: the $k$-th layer;
- subscript $i$: unit $i$.

### 22.3 Vector and matrix notation

The input vector is:

$$
x^{(1)}=
\begin{bmatrix}
x_1 \\
x_2
\end{bmatrix}.
$$

The hidden-layer bias vector is:

$$
b^{(2)}
=
\begin{bmatrix}
b^{(2)}_1 \\
b^{(2)}_2
\end{bmatrix}.
$$

The hidden-layer pre-activation vector is:

$$
z^{(2)}
=
\begin{bmatrix}
z^{(2)}_1 \\
z^{(2)}_2
\end{bmatrix}.
$$

The hidden-layer activation vector is written on the slide as:

$$
a^{(2)}
=
\begin{bmatrix}
a^{(2)}_1 \\
a^{(2)}_1
\end{bmatrix}.
$$

**[UNCLEAR]** This is likely a slide typo or parsed-text error. Since the network has two hidden units, it should presumably be:

$$
a^{(2)}
=
\begin{bmatrix}
a^{(2)}_1 \\
a^{(2)}_2
\end{bmatrix}.
$$

But the slide text shows $a^{(2)}_1$ twice.

The hidden-layer weight matrix is:

$$
W^{(2)}
=
\begin{bmatrix}
w^{(2)}_{11} & w^{(2)}_{12} \\
w^{(2)}_{21} & w^{(2)}_{22}
\end{bmatrix}.
$$

The output-layer weight vector is:

$$
w^{(3)}
=
\begin{bmatrix}
w^{(3)}_{11} \\
w^{(3)}_{12}
\end{bmatrix}.
$$

### 22.4 Forward equations for the toy MLP

The slides define:

$$
z^{(2)}
=
W^{(2)}x^{(1)}+b^{(2)}.
$$

Then:

$$
a^{(2)}
=
\tanh(z^{(2)}).
$$

The output pre-activation is:

$$
z^{(3)}_1
=
(w^{(3)})^\top a^{(2)}+b^{(3)}_1.
$$

The prediction is:

$$
\hat{y}
=
a^{(3)}_1
=
\sigma(z^{(3)}_1).
$$

---

## 23. Gradients for the toy MLP

### 23.1 Objective function

To minimise the error function, derivatives are needed with respect to all differentiable parameters:

$$
W^{(2)},\quad b^{(2)},\quad W^{(3)},\quad b^{(3)}_1.
$$

The total error over dataset $D$ is:

$$
E(W^{(2)},b^{(2)},W^{(3)},b^{(3)}_1;D)
=
\sum_{n=1}^{N}
E_n(x_n,y_n;W^{(2)},b^{(2)},W^{(3)},b^{(3)}_1).
$$

The needed derivatives include:

$$
\frac{\partial E}{\partial w^{(2)}_{11}},
\quad
\frac{\partial E}{\partial w^{(2)}_{12}},
\quad
\frac{\partial E}{\partial w^{(2)}_{21}},
\quad
\frac{\partial E}{\partial w^{(2)}_{22}},
$$

$$
\frac{\partial E}{\partial w^{(3)}_{11}},
\quad
\frac{\partial E}{\partial w^{(3)}_{12}},
$$

$$
\frac{\partial E}{\partial b^{(2)}_1},
\quad
\frac{\partial E}{\partial b^{(2)}_2},
\quad
\frac{\partial E}{\partial b^{(3)}_1}.
$$

### 23.2 Cross-entropy error for classification

For a single data point, the lecture uses cross-entropy:

$$
E_n(x_n,y_n;W^{(2)},b^{(2)},w^{(3)},b^{(3)}_1)
=
-
\left(
y_n\log \hat{y}_n
+
(1-y_n)\log(1-\hat{y}_n)
\right).
$$

### 23.3 Chain-rule components

According to the slides, it suffices to compute:

$$
\frac{\partial E_n}{\partial a^{(3)}_1},
$$

$$
\frac{\partial a^{(3)}_1}{\partial z^{(3)}_1},
$$

$$
\frac{\partial z^{(3)}_1}{\partial a^{(2)}},
$$

$$
\frac{\partial a^{(2)}}{\partial z^{(2)}}.
$$

These pieces are then combined using the chain rule.

---

## 24. Derivative calculations for the toy MLP

### 24.1 Derivative of cross-entropy with respect to output activation

The slide computes:

$$
\frac{\partial E_n}{\partial a^{(3)}_1}
=
-\frac{y_n}{a^{(3)}_1}
+
\frac{1-y_n}{1-a^{(3)}_1}.
$$

This simplifies to:

$$
\frac{\partial E_n}{\partial a^{(3)}_1}
=
\frac{a^{(3)}_1-y_n}
{a^{(3)}_1(1-a^{(3)}_1)}.
$$

### 24.2 Derivative of sigmoid

The sigmoid derivative is:

$$
\sigma'(x)
=
\sigma(x)(1-\sigma(x)).
$$

So:

$$
\frac{\partial a^{(3)}_1}{\partial z^{(3)}_1}
=
a^{(3)}_1(1-a^{(3)}_1).
$$

### 24.3 Derivative of output pre-activation with respect to hidden activations

The slide gives:

$$
\frac{\partial z^{(3)}_1}{\partial a^{(2)}}
=
\begin{bmatrix}
w^{(3)}_{11} & w^{(3)}_{12}
\end{bmatrix}.
$$

This is described as scalar-by-vector.

### 24.4 Derivative of $\tanh$

The derivative is:

$$
\tanh'(x)
=
1-\tanh^2(x).
$$

Because $\tanh$ is applied element-wise:

$$
\frac{\partial a^{(2)}}{\partial z^{(2)}}
=
\begin{bmatrix}
1-\tanh^2(z^{(2)}_1) & 0 \\
0 & 1-\tanh^2(z^{(2)}_2)
\end{bmatrix}.
$$

This is described as vector-by-vector.

---

## 25. Example gradient formulas

### 25.1 Gradient with respect to $w^{(3)}_{11}$

The slides compute:

$$
\frac{\partial E_n}{\partial w^{(3)}_{11}}
=
\left(
\frac{\partial E_n}{\partial a^{(3)}_1}
\frac{\partial a^{(3)}_1}{\partial z^{(3)}_1}
\right)
\frac{\partial z^{(3)}_1}{\partial w^{(3)}_{11}}.
$$

Now:

$$
\frac{\partial E_n}{\partial a^{(3)}_1}
=
\frac{a^{(3)}_1-y_n}
{a^{(3)}_1(1-a^{(3)}_1)}
$$

and:

$$
\frac{\partial a^{(3)}_1}{\partial z^{(3)}_1}
=
a^{(3)}_1(1-a^{(3)}_1).
$$

Multiplying cancels the denominator:

$$
\frac{\partial E_n}{\partial z^{(3)}_1}
=
a^{(3)}_1-y_n.
$$

Since:

$$
z^{(3)}_1
=
(w^{(3)})^\top a^{(2)}+b^{(3)}_1,
$$

we have:

$$
\frac{\partial z^{(3)}_1}{\partial w^{(3)}_{11}}
=
a^{(2)}_1.
$$

Therefore:

$$
\frac{\partial E_n}{\partial w^{(3)}_{11}}
=
(a^{(3)}_1-y_n)a^{(2)}_1.
$$

### 25.2 Gradient with respect to $w^{(2)}_{12}$

The slide gives:

$$
\frac{\partial E_n}{\partial w^{(2)}_{12}}
=
\left(
\frac{\partial E_n}{\partial z^{(3)}_1}
\frac{\partial z^{(3)}_1}{\partial a^{(2)}}
\frac{\partial a^{(2)}}{\partial z^{(2)}}
\right)
\frac{\partial z^{(2)}}{\partial w^{(2)}_{12}}.
$$

The result shown is:

$$
\frac{\partial E_n}{\partial w^{(2)}_{12}}
=
(a^{(3)}_1-y_n)
w^{(3)}_{11}
\left(
1-\tanh^2(z^{(2)}_1)
\right)
x_{n2}.
$$

This is the chain rule passing from error to output pre-activation, then to hidden activation, then to hidden pre-activation, then to the hidden-layer weight.

---

## 26. Hidden representation and MLP decision boundary

The slides compare the original input space:

$$
(x_1,x_2)
$$

with the learned hidden representation:

$$
(a^{(2)}_1,a^{(2)}_2).
$$

The scatterplot shows that the hidden representation changes the geometry of the data.

The decision boundary slide shows that the MLP can produce a nonlinear decision region in the original input space, unlike logistic regression’s straight-line boundary.

---

## 27. General feedforward neural networks

### 27.1 Definition

A feedforward neural network extends the MLP architecture to any finite number $L$ of layers.

The network is called “feedforward” because information flows from earlier layers to later layers, from input to output, without recurrence.

### 27.2 Layer equations

For layer $l$, the network computes:

$$
z^{(l)}
=
W^{(l)}a^{(l-1)}+b^{(l)},
$$

$$
a^{(l)}
=
h_l(z^{(l)}),
$$

where $h_l$ is the nonlinear activation function in layer $l$.

### 27.3 Forward equations

The slides list the forward equations:

$$
a^{(1)}=x.
$$

For:

$$
l=2,\dots,L,
$$

compute:

$$
z^{(l)}
=
W^{(l)}a^{(l-1)}+b^{(l)}.
$$

Then:

$$
a^{(l)}
=
h_l(z^{(l)}).
$$

Finally, compute the error:

$$
E(a^{(L)},y).
$$

---

## 28. Backpropagation in feedforward neural networks

### 28.1 Output layer

At the output layer:

$$
z^{(L)}
=
W^{(L)}a^{(L-1)}+b^{(L)},
$$

$$
a^{(L)}
=
h_L(z^{(L)}).
$$

Given:

$$
E(a^{(L)},y),
$$

we want:

$$
\frac{\partial E}{\partial z^{(L)}}.
$$

Using the chain rule:

$$
\frac{\partial E}{\partial z^{(L)}}
=
\frac{\partial E}{\partial a^{(L)}}
\cdot
\frac{\partial a^{(L)}}{\partial z^{(L)}}.
$$

If there are $n_L$ units in layer $L$, then:

$$
\frac{\partial a^{(L)}}{\partial z^{(L)}}
$$

is an $n_L \times n_L$ Jacobian matrix:

$$
\frac{\partial a^{(L)}}{\partial z^{(L)}}
=
\begin{bmatrix}
\frac{\partial a^{(L)}_1}{\partial z^{(L)}_1}
&
\frac{\partial a^{(L)}_1}{\partial z^{(L)}_2}
&
\cdots
&
\frac{\partial a^{(L)}_1}{\partial z^{(L)}_{n_L}}
\\
\frac{\partial a^{(L)}_2}{\partial z^{(L)}_1}
&
\frac{\partial a^{(L)}_2}{\partial z^{(L)}_2}
&
\cdots
&
\frac{\partial a^{(L)}_2}{\partial z^{(L)}_{n_L}}
\\
\vdots & \vdots & \ddots & \vdots
\\
\frac{\partial a^{(L)}_{n_L}}{\partial z^{(L)}_1}
&
\frac{\partial a^{(L)}_{n_L}}{\partial z^{(L)}_2}
&
\cdots
&
\frac{\partial a^{(L)}_{n_L}}{\partial z^{(L)}_{n_L}}
\end{bmatrix}.
$$

If $h_L$ is applied element-wise, this Jacobian is diagonal.

### 28.2 Hidden layer

For layer $l+1$:

$$
z^{(l+1)}
=
W^{(l+1)}a^{(l)}+b^{(l+1)}.
$$

The weight $w^{(l+1)}_{ij}$ is the weight on the connection from the $j$-th unit in layer $l$ to the $i$-th unit in layer $l+1$.

To compute:

$$
\frac{\partial E}{\partial z^{(l)}},
$$

use:

$$
\frac{\partial E}{\partial z^{(l)}}
=
\frac{\partial E}{\partial z^{(l+1)}}
\cdot
\frac{\partial z^{(l+1)}}{\partial z^{(l)}}.
$$

By inserting $a^{(l)}$:

$$
\frac{\partial E}{\partial z^{(l)}}
=
\frac{\partial E}{\partial z^{(l+1)}}
\cdot
\frac{\partial z^{(l+1)}}{\partial a^{(l)}}
\cdot
\frac{\partial a^{(l)}}{\partial z^{(l)}}.
$$

Since:

$$
\frac{\partial z^{(l+1)}}{\partial a^{(l)}}
=
W^{(l+1)},
$$

the slide gives:

$$
\frac{\partial E}{\partial z^{(l)}}
=
\frac{\partial E}{\partial z^{(l+1)}}
\cdot
W^{(l+1)}
\cdot
\frac{\partial a^{(l)}}{\partial z^{(l)}}.
$$

---

## 29. Gradients with respect to parameters

For layer $l$:

$$
z^{(l)}
=
W^{(l)}a^{(l-1)}+b^{(l)},
$$

$$
a^{(l)}
=
h_l(z^{(l)}).
$$

The parameters to optimise are:

$$
W^{(l)},\qquad b^{(l)}.
$$

### 29.1 Weight gradient

For a single weight:

$$
\frac{\partial E}{\partial w^{(l)}_{ij}}
=
\frac{\partial E}{\partial z^{(l)}_i}
\cdot
\frac{\partial z^{(l)}_i}{\partial w^{(l)}_{ij}}.
$$

Since:

$$
z^{(l)}_i
=
\sum_j w^{(l)}_{ij}a^{(l-1)}_j+b^{(l)}_i,
$$

we have:

$$
\frac{\partial z^{(l)}_i}{\partial w^{(l)}_{ij}}
=
a^{(l-1)}_j.
$$

Therefore:

$$
\frac{\partial E}{\partial w^{(l)}_{ij}}
=
\frac{\partial E}{\partial z^{(l)}_i}
a^{(l-1)}_j.
$$

### 29.2 Bias gradient

Since:

$$
\frac{\partial z^{(l)}_i}{\partial b^{(l)}_i}=1,
$$

the slide gives:

$$
\frac{\partial E}{\partial b^{(l)}_i}
=
\frac{\partial E}{\partial z^{(l)}_i}.
$$

### 29.3 Matrix form

The slides write:

$$
\frac{\partial E}{\partial W^{(l)}}
=
\left(
a^{(l-1)}
\frac{\partial E}{\partial z^{(l)}}
\right)^\top.
$$

And:

$$
\frac{\partial E}{\partial b^{(l)}}
=
\frac{\partial E}{\partial z^{(l)}}.
$$

**[UNCLEAR]** The exact orientation of vectors in the matrix expression depends on whether gradients are treated as row or column vectors. The slide gives the expression above, so use the slide convention.

---

## 30. Backpropagation summary equations

### Forward equations

$$
a^{(1)}=x.
$$

$$
z^{(l)}
=
W^{(l)}a^{(l-1)}+b^{(l)},
\qquad l=2,\dots,L.
$$

$$
a^{(l)}
=
h_l(z^{(l)}),
\qquad l=2,\dots,L.
$$

$$
E(a^{(L)},y).
$$

### Backpropagation equations

Output layer:

$$
\frac{\partial E}{\partial z^{(L)}}
=
\frac{\partial E}{\partial a^{(L)}}
\cdot
\frac{\partial a^{(L)}}{\partial z^{(L)}}.
$$

Hidden layers:

$$
\frac{\partial E}{\partial z^{(l)}}
=
\frac{\partial E}{\partial z^{(l+1)}}
\cdot
W^{(l+1)}
\cdot
\frac{\partial a^{(l)}}{\partial z^{(l)}}.
$$

Weight gradient:

$$
\frac{\partial E}{\partial W^{(l)}}
=
\left(
a^{(l-1)}
\frac{\partial E}{\partial z^{(l)}}
\right)^\top.
$$

Bias gradient:

$$
\frac{\partial E}{\partial b^{(l)}}
=
\frac{\partial E}{\partial z^{(l)}}.
$$

These equations are a central revision item because they summarise the feedforward and backward passes.

---

## 31. Computational questions for backpropagation

### 31.1 Running time

The running time to compute gradients involves:

- as many matrix multiplications as there are fully connected layers;
- operations performed during both the forward and backward passes.

### 31.2 Space requirement

Need to store, for each layer:

$$
a^{(l)},
\qquad
z^{(l)},
\qquad
\frac{\partial E}{\partial z^{(l)}}.
$$

### 31.3 Mini-batches

The slides state that multiple examples can be processed together using mini-batches.

With mini-batches, computation is performed using tensor operations.

The slides also note that parameters must fit in GPU memory.

---

## 32. Training deep neural networks

### 32.1 Stochastic gradient descent and epochs

The lecture defines:

- **SGD:** stochastic gradient descent uses a mini-batch of samples.
- **Training epoch:** a complete pass through the whole training set.

### 32.2 Stationary points and minima

A point where the gradient vanishes is called a **stationary point**.

A **global minimum** is a minimum corresponding to the smallest value of the error function across the whole of weight space.

A **local minimum** is any other minimum corresponding to a higher value of the error function.

The slide visualises an error surface $E(w)$, with positions $w_A,w_B,w_C$, and a gradient $\nabla E$.

---

## 33. Parameter initialization

### 33.1 Importance

Parameter initialization has a significant effect on:

- convergence;
- generalisation performance.

### 33.2 Symmetry breaking

The slides state:

**Symmetry breaking:** if parameters are initialised with the same values, they will receive the same updates.

This is why random initialisation is used.

### 33.3 Initialisation distributions

The slides suggest either:

$$
[-\epsilon,\epsilon]
$$

for uniform initialisation, or a zero-mean Gaussian:

$$
\mathcal{N}(0,\epsilon^2).
$$

The choice of $\epsilon$ is important.

### 33.4 Variance calculation for a ReLU layer

The layer considered is:

$$
z^{(l)}_i
=
\sum_{j=1}^{M}w_{ij}a^{(l-1)}_j,
$$

with:

$$
a^{(l-1)}_i
=
\text{ReLU}(z^{(l-1)}_i).
$$

With:

$$
w_{ij}\sim \mathcal{N}(0,\epsilon^2),
$$

and fixed variance $\lambda^2$ of $z^{(l-1)}_j$, the slides state:

$$
\mathbb{E}[z^{(l)}_i]=0,
$$

$$
\operatorname{Var}[z^{(l)}_j]
=
\frac{M}{2}\epsilon^2\lambda^2.
$$

**[UNCLEAR]** The slide text in the parsed output appears as $M/2$ in the rendered image, while the parsed text shows “$M 2$” due to formatting. The intended displayed expression is:

$$
\operatorname{Var}[z^{(l)}_j]
=
\frac{M}{2}\epsilon^2\lambda^2.
$$

### 33.5 He initialization

He initialization sets:

$$
\frac{M}{2}\epsilon^2=1.
$$

Solving:

$$
\epsilon
=
\sqrt{\frac{2}{M}}.
$$

The slide attributes this to He et al. (2015).

---

## 34. Normalization

### 34.1 Motivation

Normalization removes the need to deal with extremely large or extremely small values.

The slides cover:

- data normalization;
- batch normalization;
- layer normalization.

### 34.2 Data normalization

For continuous inputs, data normalization rescales and recentres input values.

For feature $i$:

$$
\mu_i
=
\frac{1}{N}
\sum_{n=1}^{N}
x_{ni}.
$$

$$
\sigma_i^2
=
\frac{1}{N}
\sum_{n=1}^{N}
(x_{ni}-\mu_i)^2.
$$

Then:

$$
\tilde{x}_{ni}
=
\frac{x_{ni}-\mu_i}{\sigma_i}.
$$

### 34.3 Batch normalization

For each nonlinear unit:

$$
a_i=h(z_i),
$$

batch normalization normalizes pre-activations within a mini-batch of size $K$.

The slide gives:

$$
\mu_i
=
\frac{1}{K}
\sum_{n=1}^{K}
z_{ni}.
$$

The variance is displayed as:

$$
\sigma_i^2
=
\frac{1}{N}
\sum_{n=1}^{N}
(z_{ni}-\mu_i)^2.
$$

**[UNCLEAR]** The text says mini-batch size $K$, but the variance formula in the parsed slide uses $N$. This may be a slide typo or parsed-text issue. Use the slide formula with caution.

The normalized pre-activation is:

$$
\tilde{z}_{ni}
=
\gamma_i
\frac{z_{ni}-\mu_i}{\sigma_i+\delta}
+
\beta_i.
$$

### 34.4 Layer normalization

Layer normalization normalizes across hidden-unit values for each data point separately.

The slide gives:

$$
\mu_n
=
\frac{1}{M}
\sum_{i=1}^{M}
z_{ni}.
$$

$$
\sigma_n^2
=
\frac{1}{M}
\sum_{i=1}^{M}
(z_{ni}-\mu_i)^2.
$$

**[UNCLEAR]** The variance expression uses $\mu_i$ in the parsed slide, but because this is layer normalization across hidden units for data point $n$, $\mu_n$ may be intended. The slide should be checked.

The normalized value is:

$$
\tilde{z}_{ni}
=
\gamma_n
\frac{z_{ni}-\mu_n}{\sigma_n+\delta}
+
\beta_n.
$$

### 34.5 Batch norm vs layer norm visual distinction

The slide diagram states:

- **Batch normalization:** mean and variance are computed across the mini-batch separately for each hidden unit.
- **Layer normalization:** mean and variance are computed across hidden units separately for each data point.

---

## 35. Gradient momentum

### 35.1 SGD update

The slides write stochastic gradient descent for one data point at a time as:

$$
w^{(\tau)}
=
w^{(\tau-1)}
+
\Delta w^{(\tau-1)}.
$$

The update is:

$$
\Delta w^{(\tau-1)}
=
-\eta \nabla E_n(w^{\tau-1}).
$$

### 35.2 Problem: oscillations

For fixed step sizes, SGD can lead to oscillations.

The slide shows motion across an elongated error surface, where updates bounce back and forth.

### 35.3 Momentum update

Momentum adds inertia to motion through weight space and smooths oscillations.

The momentum update is:

$$
\Delta w^{(\tau-1)}
=
-\eta \nabla E_n(w^{\tau-1})
+
\mu \Delta w^{(\tau-2)}.
$$

Here:

$$
\mu
$$

is the momentum parameter.

---

## 36. Adaptive gradients

### 36.1 Motivation

The optimal learning rate depends on the local curvature of the error surface.

The lecture covers:

- AdaGrad
- RMSProp
- Adam

### 36.2 AdaGrad

AdaGrad reduces each learning rate using the accumulated sum of squared gradients.

For parameter $w_i$:

$$
r_i^{(\tau)}
=
r_i^{(\tau-1)}
+
\left(
\frac{\partial E(w)}{\partial w_i}
\right)^2.
$$

The update is:

$$
w_i^{(\tau)}
=
w_i^{(\tau-1)}
-
\frac{\eta}{\sqrt{r_i^{(\tau)}}+\epsilon}
\frac{\partial E(w)}{\partial w_i}.
$$

### 36.3 RMSProp

RMSProp uses a moving average:

$$
r_i^{(\tau)}
=
\beta r_i^{(\tau-1)}
+
(1-\beta)
\left(
\frac{\partial E(w)}{\partial w_i}
\right)^2.
$$

The update is:

$$
w_i^{(\tau)}
=
w_i^{(\tau-1)}
-
\frac{\eta}{\sqrt{r_i^{(\tau)}}+\epsilon}
\frac{\partial E(w)}{\partial w_i}.
$$

### 36.4 Adam

Adam uses moving averages for both the gradient and the squared gradient.

First moment estimate:

$$
s_i^{(\tau)}
=
\beta_1s_i^{(\tau-1)}
+
(1-\beta_1)
\frac{\partial E(w)}{\partial w_i}.
$$

Second moment estimate:

$$
r_i^{(\tau)}
=
\beta_2r_i^{(\tau-1)}
+
(1-\beta_2)
\left(
\frac{\partial E(w)}{\partial w_i}
\right)^2.
$$

Bias correction:

$$
\hat{s}_i^{(\tau)}
=
\frac{s_i^{(\tau)}}{1-\beta_1^\tau},
$$

$$
\hat{r}_i^{(\tau)}
=
\frac{r_i^{(\tau)}}{1-\beta_2^\tau}.
$$

Parameter update:

$$
w_i^{(\tau)}
=
w_i^{(\tau-1)}
-
\frac{\eta}{\sqrt{\hat{r}_i^{(\tau)}}+\epsilon}
\hat{s}_i^{(\tau)}.
$$

---

## 37. Regularization: weight decay

### 37.1 L2 regularization in linear models

The regularized error is:

$$
\widetilde{E}(w)
=
E(w)
+
\frac{\lambda}{2}w^\top w.
$$

The second term is the regularization term.

The gradient is:

$$
\nabla \widetilde{E}(w)
=
\nabla E(w)+\lambda w.
$$

### 37.2 Weight decay

Weight decay encourages weights to decay towards zero unless supported by the data.

### 37.3 AdamW

AdamW is Adam with weight decay, used to decouple weight decay from L2 regularization.

The slide gives:

$$
w_i^{(\tau)}
=
w_i^{(\tau-1)}
-
\eta
\left(
\frac{\hat{s}_i^{(\tau)}}{\sqrt{\hat{r}_i^{(\tau)}}+\delta}
+
\lambda w_i^{(\tau-1)}
\right).
$$

---

## 38. Regularization: residual connections

### 38.1 Motivation

Training networks with a large number of layers is difficult.

The slide mentions **shattered gradients** and shows Jacobians for networks with:

- two layers;
- 25 layers;
- 51 layers with residual connections.

The visual point is that deeper plain networks can have unstable or shattered gradient behaviour, while residual connections improve the gradient structure.

### 38.2 Residual connection equations

The slide shows residual connections of the form:

$$
z_1=F_1(x)+x.
$$

$$
z_2=F_2(z_1)+z_1.
$$

$$
y=F_2(z_2)+z_2.
$$

**[UNCLEAR]** The last equation in the parsed slide uses $F_2$ again:

$$
y=F_2(z_2)+z_2.
$$

Given the diagram labels $F_1,F_2,F_3$, the final function may be intended as $F_3(z_2)$, but the slide text says $F_2(z_2)$. Check the recording or slide image.

### 38.3 Error landscape visual

The lecture shows an error landscape comparison:

- A network with 56 layers without residual connections has a rugged error surface.
- The same network with residual connections has a smoother-looking error surface.

This is used to illustrate why residual connections help optimise deep networks.

---

## 39. Regularization: dropout

### 39.1 Definition

Dropout is described as one of the most effective forms of regularization and is widely used to overcome overfitting.

### 39.2 Mechanism

During training, dropout randomly deletes nodes from the network, including their connections.

The slides state that dropout is applied to:

- hidden nodes;
- input nodes;

but not to output nodes.

The diagrams show a full network and examples where different nodes/connections are removed.

---

## 40. Structured input

### 40.1 Unstructured vs structured data

So far, the lecture says observed data have been treated as unstructured vectors:

$$
x=(x_1,\dots,x_D).
$$

That means the model treats elements as though we do not know in advance how they relate to one another.

But many ML applications involve structured data where input variables have additional relationships.

### 40.2 Examples

Two-dimensional inputs:

- image pixels have spatial relationships;
- pixels are arranged in a two-dimensional grid;
- convolutional neural networks exploit this.

Sequential inputs:

- words in natural language form a sequence;
- recurrent neural networks and transformers exploit this.

This connects CNNs to the broader idea of using data structure in model architecture.

---

## 41. Convolution

### 41.1 Receptive field

A **receptive field** is a small rectangular region or patch used to capture locality.

For an image, a hidden unit may connect only to a local patch rather than the whole input.

### 41.2 Unit output

The output of a unit is shown as:

$$
z
=
\text{ReLU}(w^\top x+w_0).
$$

The term:

$$
w^\top x+w_0
$$

is identified as the convolution operation for 2D input.

### 41.3 Formal convolution definition

The slide defines convolution as:

$$
C(j,k)
=
\sum_l \sum_m I(j+l,k+m)K(l,m).
$$

Where:

- $I$ is the input image;
- $K$ is the filter/kernel;
- $C$ is the output feature map.

### 41.4 Worked 3×3 image and 2×2 filter example

The slide shows a $3\times 3$ image:

$$
I=
\begin{bmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{bmatrix}
$$

and a $2\times 2$ filter:

$$
K=
\begin{bmatrix}
j & k \\
l & m
\end{bmatrix}.
$$

The resulting $2\times 2$ feature map is:

$$
C=
\begin{bmatrix}
aj+bk+dl+em & bj+ck+el+fm \\
dj+ek+gl+hm & ej+fk+hl+im
\end{bmatrix}.
$$

This example shows the filter sliding across four possible $2\times2$ patches of the $3\times3$ image.

---

## 42. Padding and stride

For a filter of dimensionality:

$$
M\times M
$$

applied to an image of:

$$
J\times K
$$

pixels:

### 42.1 Padding

Padding adds $P$ pixels around the outside of the original image.

Purpose: allow the feature map to have the same dimension as the original image.

The slide diagram shows a $4\times4$ input surrounded by zeros.

### 42.2 Stride

Stride $S$ is the number of pixels by which the filter moves over the image at each step.

### 42.3 Feature map shape

If the same stride is used horizontally and vertically, the output feature map shape is:

$$
\left\lfloor
\frac{J+2P-M}{S}
+1
\right\rfloor
\times
\left\lfloor
\frac{K+2P-M}{S}
+1
\right\rfloor.
$$

---

## 43. Multi-dimensional convolution

### 43.1 Multiple input channels

For an image with $C$ channels, the image is described by a tensor of dimensionality:

$$
J\times K\times C.
$$

The filter has dimensionality:

$$
M\times M\times C.
$$

This means the filter spans all input channels.

### 43.2 Multiple output channels

To include multiple independent filter channels, the filter tensor has dimensionality:

$$
M\times M\times C\times C_{\text{OUT}},
$$

where:

$$
C_{\text{OUT}}
$$

is the number of output channels.

The slide illustrates a multi-channel image feeding into multiple feature maps.

---

## 44. CNN worked visual example

The slides show an example with:

- two filters;
- zero padding;
- stride one.

The example is sourced from the CS231n convolutional networks material, according to the slide footnote.

The visual shows:

- an input volume;
- filter weights;
- bias terms;
- resulting output volume.

**[UNCLEAR]** The detailed numeric calculations in the example are embedded in a small slide image and are not fully legible from the parsed text. Revisit the slide/recording if the exact arithmetic is needed.

---

## 45. Deep convolutional networks

### 45.1 VGG-16 architecture example

The slides use VGG-16 to show how convolutional architectures are extended with multiple layers.

The visual architecture includes:

- convolution followed by ReLU;
- max pooling;
- fully connected layers followed by ReLU;
- softmax activation.

The input image shape is:

$$
224\times224\times3.
$$

The feature maps progress through dimensions shown on the slide, including:

$$
224\times224\times64,
$$

$$
112\times112\times128,
$$

$$
56\times56\times256,
$$

$$
28\times28\times512,
$$

$$
14\times14\times512,
$$

$$
7\times7\times512,
$$

then fully connected-style representations:

$$
1\times1\times4096,
$$

and output:

$$
1\times1\times1000.
$$

### 45.2 Pooling

The slide also shows pooling, specifically max pooling with:

- $2\times2$ filters;
- stride $2$.

This reduces spatial resolution. For example, the slide diagram shows a $224\times224\times64$ representation downsampled to $112\times112\times64$.

---

## 46. ResNets

### 46.1 Why more layers can give worse models

The slide titled “ResNets: Why more layers can give worse models” compares:

- plain networks of 18 and 34 layers;
- ResNets of 18 and 34 layers.

The caption states:

- thin curves denote training error;
- bold curves denote validation error of the center crops;
- left: plain networks of 18 and 34 layers;
- right: ResNets of 18 and 34 layers.

The slide references the paper by He, Zhang, Ren and Sun (2015).

### 46.2 ResNet block

The ResNet block diagram shows:

$$
x
$$

passing through weight layers to produce:

$$
F(x),
$$

while an identity shortcut carries $x$ forward.

The block computes:

$$
F(x)+x.
$$

The slide also shows a 34-layer residual network, with dotted shortcuts used to increase dimensions.

---

# Exam flags

No explicit transcript text was provided, so spoken comments such as “this will be on the exam” or “common mistake” cannot be identified.

From the slides alone, the highest-value revision targets are:

- forward-mode AD trace and tangent trace;
- reverse-mode AD adjoints and numerical reverse pass;
- why reverse mode is preferred when $n\gg m$;
- the connection between reverse-mode AD and backpropagation;
- feedforward equations;
- backpropagation equations;
- gradients with respect to weights and biases;
- SGD with momentum;
- AdaGrad, RMSProp, Adam, AdamW update equations;
- He initialization;
- batch normalization vs layer normalization;
- convolution output shape with padding and stride;
- multi-channel convolution tensor dimensions;
- residual connections and ResNet block.

These are flagged as slide-emphasised rather than transcript-confirmed exam flags.

---

# Connections across the two lectures

## Automatic differentiation → backpropagation

The automatic differentiation lecture states that reverse-mode AD is used to train neural networks and is called backpropagation in the machine learning community. The neural networks lecture then develops backpropagation equations for feedforward networks.

## Logistic regression → MLP

The neural networks lecture starts from logistic regression as a linear classifier, then shows that logistic regression fails on a nonlinear toy dataset. The MLP is introduced as an extension that adds a hidden layer and nonlinear activations.

## Vector/matrix calculus → neural network gradients

The neural networks lecture explicitly recaps previous material on vector and matrix calculus, then uses Jacobians and chain-rule products to derive backpropagation.

## SGD → deep learning optimisers

The lecture builds from SGD to momentum, then to adaptive methods AdaGrad, RMSProp, Adam, and AdamW.

## Feedforward networks → CNNs

The lecture first treats inputs as unstructured vectors, then motivates CNNs by pointing out that image pixels have spatial relationships. Convolutions use receptive fields to exploit this structure.

---

# Unclear sections to revisit in the recording/slides

1. **MLP activation vector notation:** the slide writes

   $$
   a^{(2)}=[a^{(2)}_1,a^{(2)}_1]^\top
   $$

   but the network has two hidden activations, so this is likely meant to be

   $$
   a^{(2)}=[a^{(2)}_1,a^{(2)}_2]^\top.
   $$

2. **Batch normalization variance denominator:** the slide text says mini-batch size $K$, but the variance formula appears with $N$. Check whether it should use $K$.

3. **Layer normalization variance mean index:** the slide formula appears to use $\mu_i$ inside the variance term, but layer normalization is described as computing statistics per data point, so $\mu_n$ may be intended.

4. **Residual connection final equation:** the slide diagram labels $F_1,F_2,F_3$, but the parsed equation says

   $$
   y=F_2(z_2)+z_2.
   $$

   Check whether this should be $F_3(z_2)+z_2$.

5. **CNN numeric example with two filters:** the exact arithmetic is embedded in a small image and is not fully legible from the parsed text.

6. **Transcript-based exam comments:** no transcript was included, so spoken emphasis, exam warnings, and lecturer-specific clarifications are missing.
