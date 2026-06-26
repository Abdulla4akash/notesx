---
subject: COMP64501
chapter: 6
title: "Neural Networks — Exercise Solutions"
language: en
---

# Neural Networks — Structured Study Notes

**Source status:** These notes are based on the uploaded exercise-sheet / slide-source PDF only. No lecture transcript text was provided in the conversation, so transcript-specific wording, spoken emphasis, and spoken exam hints are not included.

**Course:** Neural Networks / Machine Learning, inferred from the uploaded file title.

**Lecture topic:** Neural-network calculus and implementation foundations: Jacobians, finite differences, computational graphs, automatic differentiation, backpropagation-style gradients, Hessians, parameter initialization, moving-average bias correction, and convolution/padding operations.

**How this fits the broader subject:** These topics support the mathematical and computational foundations of training neural networks, especially how derivatives are computed and used in optimization.

---

## 1. Vector-valued functions and Jacobians

### 1.1 Setup: function $f:\mathbb{R}^3 \to \mathbb{R}^2$

The exercise starts with a vector-valued function with three inputs and two outputs:

$$
y_1 = f_1(x_1,x_2,x_3)
= x_1x_3 + \log(x_2+x_1)e^{-x_3}
$$

$$
y_2 = f_2(x_1,x_2,x_3)
= e^{-x_2} + \cos(x_1x_3)
$$

The function maps:

$$
(x_1,x_2,x_3) \in \mathbb{R}^3
\quad \mapsto \quad
(y_1,y_2) \in \mathbb{R}^2
$$

### 1.2 Key concept: Jacobian

**Intuition:**  
The Jacobian collects all first-order partial derivatives of a vector-valued function. It tells us how each output changes when each input changes slightly.

**Formal definition in this exercise:**  
Since $f:\mathbb{R}^3 \to \mathbb{R}^2$, the Jacobian has shape $2 \times 3$:

$$
J =
\begin{bmatrix}
\frac{\partial f_1}{\partial x_1} &
\frac{\partial f_1}{\partial x_2} &
\frac{\partial f_1}{\partial x_3}
\
$$
4pt]
\frac{\partial f_2}{\partial x_1} &
\frac{\partial f_2}{\partial x_2} &
\frac{\partial f_2}{\partial x_3}
\end{bmatrix}
$$

The uploaded solution explicitly gives this structure and evaluates it at $(x_1,x_2,x_3)=(3,5,1)$.

---

### 1.3 Manual differentiation

For $f_1$:

$$
f_1(x_1,x_2,x_3)
= x_1x_3 + \log(x_2+x_1)e^{-x_3}
$$

The derivatives are:

$$
\frac{\partial f_1}{\partial x_1}
=
x_3 + e^{-x_3}\frac{1}{x_2+x_1}
$$

$$
\frac{\partial f_1}{\partial x_2}
=
e^{-x_3}\frac{1}{x_2+x_1}
$$

$$
\frac{\partial f_1}{\partial x_3}
=
x_1 - \log(x_2+x_1)e^{-x_3}
$$

For $f_2$:

$$
f_2(x_1,x_2,x_3)
= e^{-x_2} + \cos(x_1x_3)
$$

The derivatives are:

$$
\frac{\partial f_2}{\partial x_1}
=
-x_3\sin(x_1x_3)
$$

$$
\frac{\partial f_2}{\partial x_2}
=
-e^{-x_2}
$$

$$
\frac{\partial f_2}{\partial x_3}
=
-x_1\sin(x_1x_3)
$$

---

### 1.4 Worked example: Jacobian at $(3,5,1)$

At:

$$
x_1=3,\qquad x_2=5,\qquad x_3=1
$$

The solution gives:

$$
J(3,5,1)
=
\begin{bmatrix}
1.0459849301 & 0.0459849301 & 2.2350162077 \\
-0.1411200081 & -0.006737947 & -0.4233600242
\end{bmatrix}
$$

This is the exact/manual differentiation result in the notes.

---

### 1.5 Finite-difference approximation

**Key concept: finite differences**

**Intuition:**  
Instead of differentiating symbolically, perturb one input slightly and observe how the output changes.

**Formal approximation:**

For a scalar output $f_i$ and input coordinate $x_j$,

$$
\frac{\partial f_i}{\partial x_j}
\approx
\frac{f_i(x+\epsilon e_j)-f_i(x)}{\epsilon}
$$

where:

- $\epsilon$ is small,
- $e_j$ is the unit vector in the $x_j$ direction.

In the solution, $\epsilon=10^{-6}$ is used in code. The finite-difference Jacobian at the same point is:

$$
J(3,5,1)
\approx
\begin{bmatrix}
1.0459849276 & 0.0459849274 & 2.2350165896 \\
-0.1411195131 & -0.0067379436 & -0.4233555692
\end{bmatrix}
$$

This is very close to the exact Jacobian, with small numerical discrepancies due to the finite-difference approximation.

---

## 2. Computational graph for the vector-valued function

### 2.1 Key concept: computational graph

**Intuition:**  
A computational graph breaks a complicated function into smaller elementary operations. This makes automatic differentiation easier because each node only needs local derivatives.

**Formal structure from the diagram:**

Inputs are represented as intermediate variables:

$$
v_{-2}=x_1,\qquad v_{-1}=x_2,\qquad v_0=x_3
$$

The internal computations are:

$$
v_1 = v_{-2}v_0
$$

$$
v_2 = \log(v_{-2}+v_{-1})
$$

$$
v_3 = \exp(-v_0)
$$

$$
v_4 = \exp(-v_{-1})
$$

$$
v_5 = \cos(v_{-2}v_0)
$$

$$
v_6 = v_2v_3
$$

The outputs are:

$$
v_7 = v_1+v_6 = y_1
$$

$$
v_8 = v_4+v_5 = y_2
$$

The diagram on page 3 shows these dependencies visually, with arrows flowing from inputs through intermediate variables to $y_1$ and $y_2$.

---

## 3. Automatic differentiation in forward mode

### 3.1 Key concept: forward-mode AD

**Intuition:**  
Forward-mode automatic differentiation propagates both the value of each intermediate variable and its derivative with respect to a chosen input. It moves in the same direction as the computational graph: from inputs to outputs.

**Formal idea:**  
For each intermediate variable $v_i$, compute:

$$
v_i \quad \text{and} \quad \dot{v}_i
$$

where $\dot{v}_i$ is the derivative of $v_i$ with respect to the selected input direction.

To compute the first Jacobian column, the seed direction is:

$$
\dot{x}_1=1,\qquad \dot{x}_2=0,\qquad \dot{x}_3=0
$$

This gives:

$$
\frac{\partial y_1}{\partial x_1}
\quad \text{and} \quad
\frac{\partial y_2}{\partial x_1}
$$

---

### 3.2 Forward primal trace and tangent trace

The forward primal trace is:

$$
v_{-2}=x_1
$$

$$
v_{-1}=x_2
$$

$$
v_0=x_3
$$

$$
v_1=v_{-2}v_0
$$

$$
v_2=\log(v_{-2}+v_{-1})
$$

$$
v_3=\exp(-v_0)
$$

$$
v_4=\exp(-v_{-1})
$$

$$
v_5=\cos(v_{-2}v_0)
$$

$$
v_6=v_2v_3
$$

$$
v_7=v_1+v_6
$$

$$
v_8=v_4+v_5
$$

$$
y_1=v_7,\qquad y_2=v_8
$$

For the tangent trace with respect to $x_1$, the slide gives:

$$
\dot{v}_1=v_0
$$

$$
\dot{v}_2=\frac{1}{v_{-2}+v_{-1}}
$$

$$
\dot{v}_3=0
$$

$$
\dot{v}_4=0
$$

$$
\dot{v}_5=-v_0\sin(v_{-2}v_0)
$$

$$
\dot{v}_6=v_3\dot{v}_2
$$

$$
\dot{v}_7=\dot{v}_1+\dot{v}_6
$$

$$
\dot{v}_8=\dot{v}_5
$$

$$
\dot{y}_1=\dot{v}_7,\qquad \dot{y}_2=\dot{v}_8
$$

The slide table states that this procedure computes $dy_1/dx_1$ and $dy_2/dx_1$.

---

### 3.3 Worked example: forward mode at $(3,5,1)$

Using:

$$
x_1=3,\qquad x_2=5,\qquad x_3=1
$$

and seed:

$$
\dot{x}_1=1,\qquad \dot{x}_2=0,\qquad \dot{x}_3=0
$$

The slide gives the following values:

$$
v_{-2}=3,\qquad v_{-1}=5,\qquad v_0=1
$$

$$
v_1=3,\qquad \dot{v}_1=1
$$

$$
v_2=\log(8)=2.079,\qquad \dot{v}_2=\frac{1}{8}=0.125
$$

$$
v_3=e^{-1}=0.367,\qquad \dot{v}_3=0
$$

$$
v_4=e^{-5}=0.006,\qquad \dot{v}_4=0
$$

$$
v_5=\cos(3)=-0.989,\qquad \dot{v}_5=-\sin(3)=-0.141
$$

$$
v_6=v_2v_3=0.764,\qquad \dot{v}_6=v_3\dot{v}_2=0.045
$$

$$
v_7=v_1+v_6=3.764,\qquad \dot{v}_7=1.045
$$

$$
v_8=v_4+v_5=-0.983,\qquad \dot{v}_8=-0.141
$$

Therefore:

$$
\dot{y}_1=1.045,\qquad \dot{y}_2=-0.141
$$

These are the first-column entries of the Jacobian:

$$
\frac{\partial y_1}{\partial x_1}\approx 1.045,
\qquad
\frac{\partial y_2}{\partial x_1}\approx -0.141
$$

The slide states that the other two columns are computed similarly and leaves them to the student.

### [UNCLEAR] Notation issue in the forward-mode table

The table labels the first input as $v_{-2}=x_1$, but the tangent entry appears as $\dot{v}_{-1}=\dot{x}_1$. This is likely a notation typo; it should correspond to $\dot{v}_{-2}$. The same indexing issue appears around the input rows.

---

## 4. Automatic differentiation in reverse mode

### 4.1 Key concept: reverse-mode AD

**Intuition:**  
Reverse mode first computes the values of all intermediate variables in a forward pass, then propagates derivatives backward from the output to the inputs. This is the basis of backpropagation.

**Formal idea:**  
For each intermediate variable $v_i$, define its adjoint:

$$
\bar{v}_i
=
\frac{\partial y}{\partial v_i}
$$

where $y$ is the chosen output.

In the slide, reverse mode is applied to compute:

$$
\frac{\partial y_1}{\partial x_1},
\qquad
\frac{\partial y_1}{\partial x_2},
\qquad
\frac{\partial y_1}{\partial x_3}
$$

The computation for derivatives of $y_2$ is left to the student.

---

### 4.2 Reverse-mode trace for $y_1$

Since:

$$
y_1=v_7
$$

the seed adjoint is:

$$
\bar{y}_1=1
$$

and:

$$
\bar{v}_7=\frac{\partial y_1}{\partial v_7}=1
$$

Now propagate backward through the graph.

Because:

$$
v_7=v_1+v_6
$$

we get:

$$
\bar{v}_6
=
\bar{v}_7
\frac{\partial v_7}{\partial v_6}
=
1
$$

$$
\bar{v}_1
=
\bar{v}_7
\frac{\partial v_7}{\partial v_1}
=
1
$$

Because:

$$
v_6=v_2v_3
$$

we get:

$$
\bar{v}_2
=
\bar{v}_6
\frac{\partial v_6}{\partial v_2}
=
\bar{v}_6v_3
=
1\cdot 0.367
=
0.367
$$

$$
\bar{v}_3
=
\bar{v}_6
\frac{\partial v_6}{\partial v_3}
=
\bar{v}_6v_2
=
1\cdot 2.079
=
2.079
$$

Now collect contributions to the input variables.

For $v_{-2}=x_1$, there are contributions through $v_1$ and $v_2$:

$$
\bar{v}_{-2}
=
\bar{v}_1
\frac{\partial v_1}{\partial v_{-2}}
+
\bar{v}_2
\frac{\partial v_2}{\partial v_{-2}}
$$

$$
=
\bar{v}_1v_0
+
\bar{v}_2
\frac{1}{v_{-2}+v_{-1}}
$$

At the point $(3,5,1)$:

$$
\bar{v}_{-2}
=
(1)(1)
+
\frac{0.367}{8}
=
1.0458
$$

For $v_{-1}=x_2$, the contribution is through $v_2$:

$$
\bar{v}_{-1}
=
\bar{v}_2
\frac{\partial v_2}{\partial v_{-1}}
=
\bar{v}_2
\frac{1}{v_{-2}+v_{-1}}
$$

$$
=
\frac{0.367}{8}
=
0.0459
$$

For $v_0=x_3$, there are contributions through $v_1$ and $v_3$:

$$
\bar{v}_0
=
\bar{v}_1
\frac{\partial v_1}{\partial v_0}
+
\bar{v}_3
\frac{\partial v_3}{\partial v_0}
$$

$$
=
\bar{v}_1v_{-2}
+
\bar{v}_3(-e^{-v_0})
$$

At the point:

$$
\bar{v}_0
=
(1)(3)
-
(2.079)e^{-1}
=
2.235
$$

Thus:

$$
\bar{x}_1=1.0458
$$

$$
\bar{x}_2=0.0459
$$

$$
\bar{x}_3=2.235
$$

So reverse mode recovers the gradient row for $y_1$:

$$
\nabla_x y_1
\approx
[1.0458,\ 0.0459,\ 2.235]
$$

This matches the first row of the manually computed Jacobian.

---

## 5. Jacobian matrices for element-wise activation functions

### 5.1 Key concept: element-wise activation

**Intuition:**  
An element-wise activation applies the same scalar function independently to each coordinate of a vector. Therefore, each output coordinate depends only on the corresponding input coordinate.

**Formal setup:**  
For layer $l$, suppose there are $n_l$ units. The activation vector is:

$$
a^{(l)} = g(z^{(l)})
$$

where $g$ is applied coordinate-wise.

The Jacobian is:

$$
\frac{\partial a^{(l)}}{\partial z^{(l)}}
=
\begin{bmatrix}
\frac{\partial a_1^{(l)}}{\partial z_1^{(l)}} &
\frac{\partial a_1^{(l)}}{\partial z_2^{(l)}} &
\cdots &
\frac{\partial a_1^{(l)}}{\partial z_{n_l}^{(l)}}
\\
\frac{\partial a_2^{(l)}}{\partial z_1^{(l)}} &
\frac{\partial a_2^{(l)}}{\partial z_2^{(l)}} &
\cdots &
\frac{\partial a_2^{(l)}}{\partial z_{n_l}^{(l)}}
\\
\vdots & \vdots & \ddots & \vdots
\\
\frac{\partial a_{n_l}^{(l)}}{\partial z_1^{(l)}} &
\frac{\partial a_{n_l}^{(l)}}{\partial z_2^{(l)}} &
\cdots &
\frac{\partial a_{n_l}^{(l)}}{\partial z_{n_l}^{(l)}}
\end{bmatrix}
$$

For element-wise activations:

$$
\frac{\partial a_i^{(l)}}{\partial z_j^{(l)}}=0
\quad \text{for } i\neq j
$$

Therefore, the activation Jacobian is diagonal.

---

### 5.2 Sigmoid activation

The sigmoid activation is:

$$
a_i^{(l)}
=
\sigma(z_i^{(l)})
=
\frac{1}{1+e^{-z_i^{(l)}}}
$$

Its derivative is:

$$
\sigma'(x)=\sigma(x)(1-\sigma(x))
$$

So:

$$
\frac{\partial a^{(l)}}{\partial z^{(l)}}
=
\begin{bmatrix}
a_1^{(l)}(1-a_1^{(l)}) & 0 & \cdots & 0 \\
0 & a_2^{(l)}(1-a_2^{(l)}) & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & a_{n_l}^{(l)}(1-a_{n_l}^{(l)})
\end{bmatrix}
$$

---

### 5.3 Tanh activation

The tanh derivative is:

$$
\tanh'(x)=1-\tanh^2(x)
$$

Therefore:

$$
\frac{\partial a^{(l)}}{\partial z^{(l)}}
=
\begin{bmatrix}
1-\tanh^2(z_1^{(l)}) & 0 & \cdots & 0 \\
0 & 1-\tanh^2(z_2^{(l)}) & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & 1-\tanh^2(z_{n_l}^{(l)})
\end{bmatrix}
$$

---

### 5.4 ReLU activation

The ReLU derivative is written in the slide as:

$$
\text{ReLU}'(x)=\mathbf{1}(x\geq 0)
$$

Therefore:

$$
\frac{\partial a^{(l)}}{\partial z^{(l)}}
=
\begin{bmatrix}
\mathbf{1}(z_1^{(l)}\geq 0) & 0 & \cdots & 0 \\
0 & \mathbf{1}(z_2^{(l)}\geq 0) & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & \mathbf{1}(z_{n_l}^{(l)}\geq 0)
\end{bmatrix}
$$

### [UNCLEAR] ReLU derivative at zero

The slide uses $\mathbf{1}(x\geq 0)$. It does not discuss the non-differentiability of ReLU at $x=0$. For exam purposes, use the slide convention unless the lecturer states otherwise.

---

## 6. Single-layer neural network: Hessian of cross-entropy error

### 6.1 Model setup

The single-layer classification model has one scalar input $x$, one scalar output $y$, one weight $w$, and one bias $b$:

$$
y(x,w,b)=\sigma(wx+b)
$$

The cross-entropy error over $N$ datapoints is:

$$
E(w,b)
=
-\sum_{n=1}^{N}
\left[
t_n\ln y(x_n,w,b)
+
(1-t_n)\ln(1-y(x_n,w,b))
\right]
$$

The task is to derive the $2\times 2$ Hessian with respect to $w$ and $b$.

---

### 6.2 Key concept: Hessian

**Intuition:**  
The Hessian contains all second derivatives of a scalar function with respect to its parameters. It describes curvature.

**Formal definition here:**

$$
H
=
\begin{bmatrix}
\frac{\partial^2 E}{\partial w^2}
&
\frac{\partial^2 E}{\partial w\partial b}
\
$$
4pt]
\frac{\partial^2 E}{\partial b\partial w}
&
\frac{\partial^2 E}{\partial b^2}
\end{bmatrix}
$$

The slide connects positive trace and determinant to positive eigenvalues and therefore to a minimum.

---

### 6.3 Error for a single datapoint

For one datapoint:

$$
E_n(w,b)
=
-t_n\ln y_n
-
(1-t_n)\ln(1-y_n)
$$

where:

$$
y_n=y(x_n,w,b)
$$

The derivatives are:

$$
\frac{\partial E_n}{\partial w}
=
\frac{\partial E_n}{\partial y_n}
\frac{\partial y_n}{\partial w}
$$

The slide expands:

$$
\frac{\partial E_n}{\partial w}
=
\left(
-\frac{t_n}{y_n}
+
\frac{1-t_n}{1-y_n}
\right)
y_n(1-y_n)x_n
$$

Simplify:

$$
=
\left((1-t_n)y_n-t_n(1-y_n)\right)x_n
$$

$$
=
(y_n-t_n)x_n
$$

Similarly:

$$
\frac{\partial E_n}{\partial b}
=
\left(
-\frac{t_n}{y_n}
+
\frac{1-t_n}{1-y_n}
\right)
y_n(1-y_n)
$$

$$
=
(1-t_n)y_n-t_n(1-y_n)
$$

$$
=
y_n-t_n
$$

---

### 6.4 Second derivatives

The second derivatives are:

$$
\frac{\partial^2E}{\partial w^2}
=
\sum_n
y_n(1-y_n)x_n^2
$$

$$
\frac{\partial^2E}{\partial w\partial b}
=
\sum_n
y_n(1-y_n)x_n
$$

$$
\frac{\partial^2E}{\partial b\partial w}
=
\sum_n
y_n(1-y_n)x_n
$$

$$
\frac{\partial^2E}{\partial b^2}
=
\sum_n
y_n(1-y_n)
$$

Define:

$$
\alpha_n=y_n(1-y_n)
$$

The slide states:

$$
\alpha_n>0
$$

Then:

$$
H
=
\begin{bmatrix}
\sum_n\alpha_nx_n^2
&
\sum_n\alpha_nx_n
\
$$
4pt]
\sum_n\alpha_nx_n
&
\sum_n\alpha_n
\end{bmatrix}
$$

The slide writes the second off-diagonal term with an index $m$, but the intended structure is the same symmetric Hessian.

---

### 6.5 Trace and determinant

The trace is:

$$
\operatorname{tr}(H)
=
\sum_n\alpha_nx_n^2
+
\sum_m\alpha_m
$$

The slide states:

$$
\operatorname{tr}(H)>0
$$

The determinant is written as:

$$
\det(H)
=
\left(\sum_n\alpha_nx_n^2\right)
\left(\sum_m\alpha_m\right)
-
\left(\sum_n\alpha_nx_n\right)
\left(\sum_m\alpha_mx_m\right)
$$

The slide states:

$$
\det(H)\geq 0
$$

and then concludes both trace and determinant are positive.

### [UNCLEAR] Strict positivity of the determinant

The derivation shown in the slides gives $\det(H)\geq 0$, but the slide then says both trace and determinant are positive. The step from non-negative to strictly positive is not fully justified in the uploaded material. The slide mentions “assume, e.g., $n=m=3$” but does not show the missing argument. This is a section to revisit in the recording.

---

## 7. Full weight gradients in a toy MLP

### 7.1 Network architecture

The toy network has:

- two input features:

$$
x^{(1)}
=
\begin{bmatrix}
x_1\\x_2
\end{bmatrix}
$$

- a hidden layer with two tanh units:

$$
z^{(2)}=W^{(2)}x^{(1)}+b^{(2)}
$$

$$
a^{(2)}=\tanh(z^{(2)})
$$

- a scalar output pre-activation:

$$
z_1^{(3)}
=
(w^{(3)})^\top a^{(2)}
+
b_1^{(3)}
$$

- a sigmoid output:

$$
\hat{y}=a_1^{(3)}=\sigma(z_1^{(3)})
$$

The diagram on page 7 shows two input nodes feeding two tanh hidden units, which then feed a sigmoid output node.

---

### 7.2 Loss function

For datapoint $n$, the cross-entropy error is:

$$
E_n(x_n,y_n;W^{(2)},b^{(2)},w^{(3)},b_1^{(3)})
=
-\left(
y_n\log \hat{y}_n
+
(1-y_n)\log(1-\hat{y}_n)
\right)
$$

The task is to derive full gradients over all datapoints:

$$
\frac{\partial E}{\partial W^{(2)}},
\qquad
\frac{\partial E}{\partial b^{(2)}},
\qquad
\frac{\partial E}{\partial w^{(3)}},
\qquad
\frac{\partial E}{\partial b_1^{(3)}}
$$

---

### 7.3 Output-layer gradients

For $w_{11}^{(3)}$:

$$
\frac{\partial E_n}{\partial w_{11}^{(3)}}
=
\left(
\frac{\partial E_n}{\partial a_1^{(3)}}
\frac{\partial a_1^{(3)}}{\partial z_1^{(3)}}
\right)
\frac{\partial z_1^{(3)}}{\partial w_{11}^{(3)}}
$$

The slide expands:

$$
=
\left(
\frac{1-y_n}{1-a_1^{(3)}}
-
\frac{y_n}{a_1^{(3)}}
\right)
a_1^{(3)}(1-a_1^{(3)})a_1^{(2)}
$$

$$
=
\left(
(1-y_n)a_1^{(3)}
-
y_n(1-a_1^{(3)})
\right)a_1^{(2)}
$$

$$
=
(a_1^{(3)}-y_n)a_1^{(2)}
$$

For $w_{12}^{(3)}$:

$$
\frac{\partial E_n}{\partial w_{12}^{(3)}}
=
(a_1^{(3)}-y_n)a_2^{(2)}
$$

These are the output-layer weight gradients.

---

### 7.4 Hidden-layer gradients

The hidden-layer weight gradients use the chain:

$$
\frac{\partial E_n}{\partial w_{ij}^{(2)}}
=
\frac{\partial E_n}{\partial z_1^{(3)}}
\frac{\partial z_1^{(3)}}{\partial a^{(2)}}
\frac{\partial a^{(2)}}{\partial z^{(2)}}
\frac{\partial z^{(2)}}{\partial w_{ij}^{(2)}}
$$

The tanh Jacobian is diagonal:

$$
\frac{\partial a^{(2)}}{\partial z^{(2)}}
=
\begin{bmatrix}
1-\tanh^2(z_1^{(2)}) & 0 \\
0 & 1-\tanh^2(z_2^{(2)})
\end{bmatrix}
$$

For $w_{11}^{(2)}$:

$$
\frac{\partial E_n}{\partial w_{11}^{(2)}}
=
(a_1^{(3)}-y_n)
w_{11}^{(3)}
\left(1-\tanh^2(z_1^{(2)})\right)
x_{n1}
$$

For $w_{12}^{(2)}$:

$$
\frac{\partial E_n}{\partial w_{12}^{(2)}}
=
(a_1^{(3)}-y_n)
w_{11}^{(3)}
\left(1-\tanh^2(z_1^{(2)})\right)
x_{n2}
$$

For $w_{21}^{(2)}$:

$$
\frac{\partial E_n}{\partial w_{21}^{(2)}}
=
(a_1^{(3)}-y_n)
w_{12}^{(3)}
\left(1-\tanh^2(z_2^{(2)})\right)
x_{n1}
$$

For $w_{22}^{(2)}$:

$$
\frac{\partial E_n}{\partial w_{22}^{(2)}}
=
(a_1^{(3)}-y_n)
w_{12}^{(3)}
\left(1-\tanh^2(z_2^{(2)})\right)
x_{n2}
$$

---

### 7.5 Full gradient with respect to $W^{(2)}$

Summing over datapoints:

$$
\frac{\partial E}{\partial W^{(2)}}
=
\begin{bmatrix}
\sum_n
(a_1^{(3)}-y_n)
w_{11}^{(3)}
(1-\tanh^2(z_1^{(2)}))
x_{n1}
&
\sum_n
(a_1^{(3)}-y_n)
w_{11}^{(3)}
(1-\tanh^2(z_1^{(2)}))
x_{n2}
\
$$
6pt]
\sum_n
(a_1^{(3)}-y_n)
w_{12}^{(3)}
(1-\tanh^2(z_2^{(2)}))
x_{n1}
&
\sum_n
(a_1^{(3)}-y_n)
w_{12}^{(3)}
(1-\tanh^2(z_2^{(2)}))
x_{n2}
\end{bmatrix}
$$

This is the full hidden-layer weight gradient.

---

### 7.6 Full gradient with respect to $w^{(3)}$

From the earlier derivation:

$$
\frac{\partial E}{\partial w^{(3)}}
=
\left[
\sum_n(a_1^{(3)}-y_n)a_1^{(2)},
\quad
\sum_n(a_1^{(3)}-y_n)a_2^{(2)}
\right]
$$

### [UNCLEAR] Slide notation issue in final $w^{(3)}$ gradient

The derivation on page 8 uses hidden activations $a_1^{(2)}$ and $a_2^{(2)}$, but the final line shown in the parsed slide text appears to use $a_1^{(3)}$ and $a_2^{(3)}$. Since there is only one output activation $a_1^{(3)}$, $a_2^{(3)}$ is inconsistent with the network diagram. Treat this as a likely slide typo and check the recording.

---

### 7.7 Bias gradients

For hidden-layer bias:

$$
\frac{\partial E}{\partial b^{(2)}}
=
\sum_n
(a_1^{(3)}-y_n)
\left[
w_{11}^{(3)}
(1-\tanh^2(z_1^{(2)})),
\quad
w_{12}^{(3)}
(1-\tanh^2(z_2^{(2)}))
\right]
$$

For output bias:

$$
\frac{\partial E}{\partial b_1^{(3)}}
=
\sum_n(a_1^{(3)}-y_n)
$$

The final output bias result is especially clean because:

$$
\frac{\partial z_1^{(3)}}{\partial b_1^{(3)}}=1
$$

---

## 8. Succinct matrix form of weight gradients

### 8.1 Element-wise gradient formula

The slide recalls:

$$
\frac{\partial E}{\partial w_{ij}^{(l)}}
=
\frac{\partial E}{\partial z_i^{(l)}}
\cdot
\frac{\partial z_i^{(l)}}{\partial w_{ij}^{(l)}}
$$

Since:

$$
z_i^{(l)}
=
\sum_j w_{ij}^{(l)}a_j^{(l-1)}
+
b_i^{(l)}
$$

we have:

$$
\frac{\partial z_i^{(l)}}{\partial w_{ij}^{(l)}}
=
a_j^{(l-1)}
$$

Therefore:

$$
\frac{\partial E}{\partial w_{ij}^{(l)}}
=
\frac{\partial E}{\partial z_i^{(l)}}
a_j^{(l-1)}
$$

---

### 8.2 Matrix form

The gradient matrix has entries:

$$
\left[
\frac{\partial E}{\partial W^{(l)}}
\right]_{ij}
=
a_j^{(l-1)}
\frac{\partial E}{\partial z_i^{(l)}}
$$

The slide shows that this can be written compactly as:

$$
\frac{\partial E}{\partial W^{(l)}}
=
\left(
a^{(l-1)}
\frac{\partial E}{\partial z^{(l)}}
\right)^\top
$$

The slide also notes that a scalar-by-vector derivative yields a row vector.

---

## 9. Parameter initialization in neural networks

### 9.1 Setup

The layer is:

$$
z_i^{(l)}
=
\sum_{j=1}^{M}
w_{ij}a_j^{(l-1)}
$$

with:

$$
a_i^{(l-1)}
=
\text{ReLU}(z_i^{(l-1)})
$$

The weights are initialized as:

$$
w_{ij}\sim \mathcal{N}(0,\epsilon^2)
$$

The previous layer’s pre-activations have fixed variance:

$$
\operatorname{Var}(z_j^{(l-1)})=\lambda^2
$$

The task is to show:

$$
\mathbb{E}[z_i^{(l)}]=0
$$

$$
\operatorname{Var}(z_i^{(l)})
=
\frac{M}{2}\epsilon^2\lambda^2
$$

and then choose $\epsilon$ so that the variance remains $\lambda^2$.

---

### 9.2 Mean derivation

Start from:

$$
z_i^{(l)}
=
\sum_j w_{ij}^{(l)}a_j^{(l-1)}
$$

Take expectation:

$$
\mathbb{E}[z_i^{(l)}]
=
\mathbb{E}
\left[
\sum_j w_{ij}^{(l)}a_j^{(l-1)}
\right]
$$

$$
=
\sum_j
\mathbb{E}[w_{ij}^{(l)}]
\mathbb{E}[a_j^{(l-1)}]
$$

Since:

$$
\mathbb{E}[w_{ij}^{(l)}]=0
$$

we get:

$$
\mathbb{E}[z_i^{(l)}]=0
$$

---

### 9.3 Variance derivation

The slide states that $z_i^{(l)}$ is a sum of $M$ independent random variables, so the variance of the sum is the sum of variances:

$$
\operatorname{Var}(z_i^{(l)})
=
M\operatorname{Var}(w_{ij}a_j^{(l-1)})
$$

Expand:

$$
=
M\mathbb{E}\left[(w_{ij}a_j^{(l-1)})^2\right]
-
M\left(
\mathbb{E}[w_{ij}a_j^{(l-1)}]
\right)^2
$$

Because the expectation term is zero:

$$
=
M\mathbb{E}\left[(w_{ij}a_j^{(l-1)})^2\right]
$$

Using independence:

$$
=
M\mathbb{E}[w_{ij}^2]
\mathbb{E}[(a_j^{(l-1)})^2]
$$

Since:

$$
\mathbb{E}[w_{ij}^2]=\epsilon^2
$$

we get:

$$
\operatorname{Var}(z_i^{(l)})
=
M\epsilon^2
\mathbb{E}[(a_j^{(l-1)})^2]
$$

Now, because:

$$
a_j^{(l-1)}
=
\text{ReLU}(z_j^{(l-1)})
$$

and the distribution of $z_j^{(l-1)}$ is symmetric around zero, the slide uses:

$$
\mathbb{E}[(a_j^{(l-1)})^2]
=
\frac{1}{2}
\mathbb{E}[(z_j^{(l-1)})^2]
=
\frac{1}{2}\lambda^2
$$

Therefore:

$$
\operatorname{Var}(z_i^{(l)})
=
M\epsilon^2
\frac{1}{2}\lambda^2
$$

$$
=
\frac{M}{2}\epsilon^2\lambda^2
$$

---

### 9.4 Choosing $\epsilon$

To preserve the same variance:

$$
\operatorname{Var}(z_i^{(l)})=\lambda^2
$$

Set:

$$
\frac{M}{2}\epsilon^2\lambda^2=\lambda^2
$$

Cancel $\lambda^2$:

$$
\frac{M}{2}\epsilon^2=1
$$

$$
\epsilon^2=\frac{2}{M}
$$

$$
\epsilon=\sqrt{\frac{2}{M}}
$$

This is the initialization scale derived in the slide.

### Connection

This is the variance-preservation argument behind ReLU-compatible initialization. The slide connects it to keeping activations from exploding or vanishing as they pass through layers.

---

## 10. Bias correction in exponentially weighted moving averages

### 10.1 Setup

Given a sequence:

$$
\{x_1,x_2,\ldots,x_N\}
$$

define the exponentially weighted moving average:

$$
\mu_n
=
\beta\mu_{n-1}
+
(1-\beta)x_n
$$

where:

$$
0\leq \beta<1
$$

The initialization is:

$$
\mu_0=0
$$

The goal is to show that the estimator is biased and can be corrected using:

$$
\hat{\mu}_n
=
\frac{\mu_n}{1-\beta^n}
$$

---

### 10.2 Unrolling the recurrence

Start with:

$$
\mu_n
=
\beta\mu_{n-1}
+
(1-\beta)x_n
$$

Substitute:

$$
\mu_{n-1}
=
\beta\mu_{n-2}
+
(1-\beta)x_{n-1}
$$

Then:

$$
\mu_n
=
\beta(\beta\mu_{n-2}+(1-\beta)x_{n-1})
+
(1-\beta)x_n
$$

$$
=
\beta^2\mu_{n-2}
+
\beta(1-\beta)x_{n-1}
+
(1-\beta)x_n
$$

Continuing:

$$
\mu_n
=
\beta^n\mu_0
+
\sum_{i=0}^{n-1}
\beta^i(1-\beta)x_{n-i}
$$

Since:

$$
\mu_0=0
$$

we have:

$$
\mu_n
=
\sum_{i=0}^{n-1}
\beta^i(1-\beta)x_{n-i}
$$

---

### 10.3 Taking expectations

Take expectation:

$$
\mathbb{E}[\mu_n]
=
\mathbb{E}
\left[
\sum_{i=0}^{n-1}
\beta^i(1-\beta)x_{n-i}
\right]
$$

$$
=
\sum_{i=0}^{n-1}
\beta^i(1-\beta)
\mathbb{E}[x_{n-i}]
$$

The finite geometric sum used in the slide is:

$$
\sum_{k=0}^{n-1}\beta^k
=
\frac{1-\beta^n}{1-\beta}
$$

The slide simplifies:

$$
\sum_{i=0}^{n-1}
\beta^i(1-\beta)\mathbb{E}[x_{n-i}]
=
\frac{1-\beta^n}{1-\beta}
(1-\beta)\mathbb{E}[x_{n-i}]
$$

$$
=
(1-\beta^n)\mathbb{E}[x_{n-i}]
$$

Therefore:

$$
\mathbb{E}[\mu_n]
=
(1-\beta^n)\mathbb{E}[x_{n-i}]
$$

So the estimator is biased downward by a factor:

$$
1-\beta^n
$$

The correction is:

$$
\hat{\mu}_n
=
\frac{\mu_n}{1-\beta^n}
$$

### [UNCLEAR] Assumption behind the expectation simplification

The simplification treats $\mathbb{E}[x_{n-i}]$ as the same constant across the summation. The slide does not explicitly state the required assumption that these expectations are equal across time. Revisit the recording for whether the lecturer mentioned stationarity or constant mean.

---

## 11. Convolution worked example

### 11.1 Setup

The slide asks for the output of a convolution of a $4\times 4$ input matrix with a $2\times 2$ filter.

Input:

$$
\begin{bmatrix}
2 & 5 & -3 & 0 \\
0 & 6 & 0 & -4 \\
-1 & -3 & 0 & 2 \\
5 & 0 & 0 & 3
\end{bmatrix}
$$

Filter:

$$
\begin{bmatrix}
-2 & 0 \\
4 & 6
\end{bmatrix}
$$

The slide uses pointwise multiplication of each $2\times 2$ patch with the filter, then sums the result.

---

### 11.2 Key concept: feature map

**Intuition:**  
A filter slides over local patches of an input matrix. At each location, multiply corresponding entries and add them to produce one output value.

**Formal operation used in the slide:**

For each $2\times 2$ patch $P$ and filter $K$:

$$
\text{output entry}
=
\sum_{i,j} P_{ij}K_{ij}
$$

This is the operation shown in the slide’s worked example. It is called “convolution” in the exercise.

---

### 11.3 Worked example: first feature-map element

Top-left input patch:

$$
\begin{bmatrix}
2 & 5 \\
0 & 6
\end{bmatrix}
$$

Filter:

$$
\begin{bmatrix}
-2 & 0 \\
4 & 6
\end{bmatrix}
$$

Compute:

$$
2(-2)+5(0)+0(4)+6(6)
$$

$$
=
-4+0+0+36
$$

$$
=
32
$$

The slide explicitly gives this first calculation.

---

### 11.4 Full feature map

The resulting $3\times 3$ feature map shown on page 13 is:

$$
\begin{bmatrix}
32 & 14 & -18 \\
-22 & -24 & 12 \\
22 & 6 & 18
\end{bmatrix}
$$

Page 13’s figure shows the input matrix, the $2\times 2$ filter, and the resulting feature map side by side.

---

## 12. Padding and feature-map size

### 12.1 Setup

The exercise considers an image of size:

$$
J\times K
$$

It is padded with $P$ pixels on all sides and convolved with a kernel of size:

$$
M\times M
$$

where $M$ is odd.

Stride is:

$$
S=1
$$

The task is to show that choosing:

$$
P=\frac{M-1}{2}
$$

makes the output feature map have the same size as the original image:

$$
J\times K
$$

---

### 12.2 Feature-map shape formula

The slide gives the output shape as:

$$
\left\lfloor
\frac{J+2P-M}{S}+1
\right\rfloor
\times
\left\lfloor
\frac{K+2P-M}{S}+1
\right\rfloor
$$

For:

$$
S=1
$$

this becomes:

$$
\left\lfloor
J+2P-M+1
\right\rfloor
\times
\left\lfloor
K+2P-M+1
\right\rfloor
$$

Substitute:

$$
P=\frac{M-1}{2}
$$

Then:

$$
J+2\left(\frac{M-1}{2}\right)-M+1
=
J+(M-1)-M+1
=
J
$$

Similarly:

$$
K+2\left(\frac{M-1}{2}\right)-M+1
=
K
$$

Therefore, the output feature map has shape:

$$
J\times K
$$

This is the “same padding” result for stride $1$, using the notation in the slide.

---

## 13. Exam flags and revision priority

### Explicit exam flags

No explicit phrases such as “this will be on the exam,” “you should know this,” “common mistake,” or “important” appear in the uploaded material.

Because no transcript was provided, spoken exam flags could not be checked.

### Revision-priority flags from exercise difficulty

The sheet marks exercises by difficulty:

- $(*)$: simpler exercises.
- $(**)$: more involved exercises.
- $(***)$: most complex category, although no $(***)$ exercise appears in the shown solution set.

High-value $(**)$ topics in this file:

1. Forward-mode AD for Jacobians.
2. Reverse-mode AD / adjoints.
3. Single-layer neural-network Hessian.
4. Full weight gradients in an MLP.
5. Parameter initialization for ReLU networks.
6. Bias correction in moving averages.

These are likely higher-value revision topics because the exercise sheet gives them the $(**)$ difficulty marker.

---

## 14. Connections across the material

### Jacobians, computational graphs, and AD

The first exercise connects three ways of computing derivatives:

1. Manual symbolic differentiation.
2. Finite-difference numerical approximation.
3. Automatic differentiation using a computational graph.

Forward mode gives one column of the Jacobian per seed direction, while reverse mode gives gradients of a chosen output with respect to all inputs.

### Activation Jacobians and backpropagation

The diagonal Jacobian of element-wise activations is used directly in the MLP gradient derivations. The tanh derivative matrix:

$$
\operatorname{diag}(1-\tanh^2(z_i))
$$

appears in the hidden-layer gradient derivation.

### Cross-entropy plus sigmoid

The single-layer and MLP examples both show the same simplification:

$$
\frac{\partial E}{\partial z}
=
a-y
$$

or, in the scalar single-layer notation:

$$
\frac{\partial E_n}{\partial w}
=
(y_n-t_n)x_n
$$

This simplification is used repeatedly in the weight-gradient derivations.

### Hessian and optimization

The Hessian exercise connects curvature to minima by using trace and determinant. The slide states that positive eigenvalues imply a minimum.

### Initialization and stable signal propagation

The initialization exercise connects weight variance to pre-activation variance across layers. The goal is to choose $\epsilon$ so the variance remains stable:

$$
\epsilon=\sqrt{\frac{2}{M}}
$$

### Moving averages and optimization algorithms

The bias-correction exercise is connected to exponentially weighted averages, which are commonly used in optimization methods. The key issue is that initializing $\mu_0=0$ biases early estimates toward zero.

### Convolution and CNNs

The final exercises connect matrix operations to convolutional neural networks:

- local filter application,
- feature map construction,
- output-size calculation,
- padding to preserve spatial size.

---

## 15. Consolidated unclear sections to revisit

1. **Forward-mode tangent trace indexing:** the table appears to mix $\dot{v}_{-2}$ and $\dot{v}_{-1}$ in the input rows.
2. **Reverse-mode $y_2$ derivatives:** the slide computes reverse mode only for $y_1$; the derivatives for $y_2$ are left to the student.
3. **Hessian determinant positivity:** the slide shows $\det(H)\geq 0$, then concludes positivity. The strict positivity argument is not fully shown.
4. **MLP notation typo:** the vector $a^{(2)}$ appears with repeated entries in the parsed text, and the final $\partial E/\partial w^{(3)}$ expression appears to use $a^{(3)}$ where the derivation uses $a^{(2)}$.
5. **Moving-average expectation assumption:** the derivation treats $\mathbb{E}[x_{n-i}]$ as constant across terms without explicitly stating the assumption.

