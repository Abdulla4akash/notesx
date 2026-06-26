---
subject: COMP64501
chapter: 25
title: "Neural Networks & Autodiff — Question Bank"
language: en
---

# COMP64501 Chapter 5 — Worked Question Bank

**Topic:** Neural Networks and Automatic Differentiation  
**Source used:** uploaded lecture sheet, `COMP64501 Chapter 5 - Neural Networks and Automatic Differentiation(1).mht`  
**Purpose:** practice the computational task types actually covered by the sheet, with fully worked solutions.

The solutions are placed directly after each question inside a **Worked solution** block so you can cover them and self-test.

---

## Task types identified from the sheet

The sheet covers the following computational tasks:

1. Manual partial differentiation and gradient construction.
2. Finite-difference derivative approximation and comparison with exact derivatives.
3. Symbolic differentiation and expression swell, especially using the logistic map.
4. Evaluation traces and computational graphs.
5. Jacobian construction for vector-valued functions.
6. Forward-mode automatic differentiation using primal traces and tangent traces.
7. Reverse-mode automatic differentiation using adjoints and path-sum rules.
8. Choosing forward mode or reverse mode from the input/output dimensions of a function.
9. Forward passes through logistic units and multilayer perceptrons.
10. Cross-entropy, sigmoid, and `tanh` derivative chain-rule calculations.
11. Backpropagation deltas and gradients for weights and biases.
12. Mini-batch gradient aggregation, running time, and storage checks.
13. ReLU variance propagation and He initialisation.
14. Data normalisation, batch normalisation, and layer normalisation.
15. SGD, momentum, AdaGrad, RMSProp, Adam, weight decay, and AdamW updates.
16. Residual connections and dropout calculations.
17. Convolution arithmetic, padding, stride, feature-map shapes, multi-channel filters, and pooling.

The sections below ramp from mechanical drills to edge cases where the methods disagree or break down.

---

# Section A — Mechanical / single-step drills

These are the “can I execute the formula?” questions. They deliberately use small numbers.

---

## Question A1 — Manual gradient for the sheet’s running example

For

$$
 f(x,y)=x^2y+y+2,
$$

compute the gradient

$$
\nabla f(x,y)=
\begin{bmatrix}
\frac{\partial f}{\partial x} \\
\frac{\partial f}{\partial y}
\end{bmatrix}
$$

and evaluate it at $(x,y)=(3,2)$.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Differentiate with respect to $x$

Treat $y$ as constant:

$$
\frac{\partial}{\partial x}(x^2y+y+2)
=
\frac{\partial}{\partial x}(x^2y)
+
\frac{\partial}{\partial x}(y)
+
\frac{\partial}{\partial x}(2).
$$

So:

$$
\frac{\partial f}{\partial x}=2xy+0+0=2xy.
$$

### Step 2 — Differentiate with respect to $y$

Treat $x$ as constant:

$$
\frac{\partial}{\partial y}(x^2y+y+2)
=
\frac{\partial}{\partial y}(x^2y)
+
\frac{\partial}{\partial y}(y)
+
\frac{\partial}{\partial y}(2).
$$

So:

$$
\frac{\partial f}{\partial y}=x^2+1+0=x^2+1.
$$

### Step 3 — Assemble the gradient

$$
\nabla f(x,y)=
\begin{bmatrix}
2xy \\
x^2+1
\end{bmatrix}.
$$

### Step 4 — Substitute $(x,y)=(3,2)$

$$
2xy=2(3)(2)=12,
$$

and

$$
x^2+1=3^2+1=10.
$$

Therefore:

$$
\boxed{
\nabla f(3,2)=
\begin{bmatrix}
12 \\
10
\end{bmatrix}}
$$

</details>

---

## Question A2 — One finite-difference derivative

Using the same function

$$
 f(x,y)=x^2y+y+2,
$$

estimate $\partial f/\partial x$ at $(x,y)=(3,2)$ using the forward finite difference with $\epsilon=0.01$:

$$
\frac{\partial f}{\partial x}
\approx
\frac{f(3+0.01,2)-f(3,2)}{0.01}.
$$

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute the base value

$$
f(3,2)=3^2(2)+2+2=18+4=22.
$$

### Step 2 — Compute the perturbed value

$$
f(3.01,2)=(3.01)^2(2)+2+2.
$$

Since

$$
(3.01)^2=9.0601,
$$

we get

$$
f(3.01,2)=9.0601(2)+4=18.1202+4=22.1202.
$$

### Step 3 — Apply the finite-difference formula

$$
\frac{f(3.01,2)-f(3,2)}{0.01}
=
\frac{22.1202-22}{0.01}
=
\frac{0.1202}{0.01}
=12.02.
$$

### Step 4 — Compare with the exact derivative

From Question A1:

$$
\frac{\partial f}{\partial x}=2xy.
$$

At $(3,2)$:

$$
2xy=12.
$$

So the finite-difference estimate is close but not exact:

$$
\boxed{12.02 \text{ versus exact value } 12.}
$$

</details>

---

## Question A3 — Write an evaluation trace

For

$$
 y=f(x_1,x_2)=\ln(x_1)+x_1x_2-\sin(x_2),
$$

write an evaluation trace using elementary operations.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Name the inputs

Following the sheet’s notation, set:

$$
v_{-1}=x_1,
\qquad
v_0=x_2.
$$

### Step 2 — Break the expression into elementary operations

The expression has three main parts:

$$
\ln(x_1),
\qquad
x_1x_2,
\qquad
\sin(x_2).
$$

Define:

$$
v_1=\ln(v_{-1}),
$$

$$
v_2=v_{-1}v_0,
$$

$$
v_3=\sin(v_0).
$$

### Step 3 — Combine the intermediate values

First add the log term and product term:

$$
v_4=v_1+v_2.
$$

Then subtract the sine term:

$$
v_5=v_4-v_3.
$$

### Step 4 — Identify the output

$$
y=v_5.
$$

So the full trace is:

$$
\boxed{
\begin{aligned}
v_{-1}&=x_1, \\
v_0&=x_2, \\
v_1&=\ln(v_{-1}), \\
v_2&=v_{-1}v_0, \\
v_3&=\sin(v_0), \\
v_4&=v_1+v_2, \\
v_5&=v_4-v_3, \\
y&=v_5.
\end{aligned}}
$$

</details>

---

## Question A4 — A single Jacobian entry

Let

$$
F(x_1,x_2)=
\begin{bmatrix}
f_1(x_1,x_2) \\
f_2(x_1,x_2)
\end{bmatrix}
=
\begin{bmatrix}
x_1^2+x_2 \\
x_1x_2
\end{bmatrix}.
$$

Compute $J_{21}$, the second row and first column of the Jacobian, at $(x_1,x_2)=(2,3)$.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Recall what $J_{21}$ means

The Jacobian entry $J_{ij}$ is:

$$
J_{ij}=\frac{\partial f_i}{\partial x_j}.
$$

So:

$$
J_{21}=\frac{\partial f_2}{\partial x_1}.
$$

### Step 2 — Identify $f_2$

The second component is:

$$
f_2(x_1,x_2)=x_1x_2.
$$

### Step 3 — Differentiate with respect to $x_1$

Treat $x_2$ as constant:

$$
\frac{\partial f_2}{\partial x_1}
=
\frac{\partial}{\partial x_1}(x_1x_2)
=x_2.
$$

### Step 4 — Substitute the point

At $(x_1,x_2)=(2,3)$:

$$
J_{21}=x_2=3.
$$

Therefore:

$$
\boxed{J_{21}=3.}
$$

</details>

---

## Question A5 — Cross-entropy and sigmoid cancellation

For binary classification, suppose the output activation is

$$
a=0.8
$$

and the target is

$$
y=1.
$$

The cross-entropy derivative is

$$
\frac{\partial E}{\partial a}
=
-\frac{y}{a}
+
\frac{1-y}{1-a},
$$

and the sigmoid derivative is

$$
\frac{\partial a}{\partial z}=a(1-a).
$$

Compute $\partial E/\partial z$.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute $\partial E/\partial a$

Substitute $a=0.8$ and $y=1$:

$$
\frac{\partial E}{\partial a}
=
-\frac{1}{0.8}
+
\frac{1-1}{1-0.8}.
$$

The second term is zero, so:

$$
\frac{\partial E}{\partial a}=-1.25.
$$

### Step 2 — Compute $\partial a/\partial z$

$$
\frac{\partial a}{\partial z}=a(1-a)=0.8(0.2)=0.16.
$$

### Step 3 — Apply the chain rule

$$
\frac{\partial E}{\partial z}
=
\frac{\partial E}{\partial a}
\frac{\partial a}{\partial z}
=(-1.25)(0.16)=-0.2.
$$

### Step 4 — Check using the shortcut

For sigmoid plus cross-entropy:

$$
\frac{\partial E}{\partial z}=a-y.
$$

Here:

$$
a-y=0.8-1=-0.2.
$$

Therefore:

$$
\boxed{\frac{\partial E}{\partial z}=-0.2.}
$$

</details>

---

## Question A6 — `tanh` derivative from an activation value

A hidden unit has activation

$$
a=\tanh(z)=0.6.
$$

Compute

$$
\frac{\partial a}{\partial z}.
$$

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Recall the derivative of $\tanh$

The sheet gives:

$$
\tanh'(z)=1-\tanh^2(z).
$$

### Step 2 — Substitute the activation value

Since $a=\tanh(z)=0.6$:

$$
\frac{\partial a}{\partial z}=1-a^2.
$$

### Step 3 — Compute

$$
1-a^2=1-(0.6)^2=1-0.36=0.64.
$$

Therefore:

$$
\boxed{\frac{\partial a}{\partial z}=0.64.}
$$

</details>

---

## Question A7 — He initialisation scale

For a ReLU layer with $M=50$ incoming connections, He initialisation sets

$$
\epsilon=\sqrt{\frac{2}{M}}.
$$

Compute $\epsilon$.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Substitute $M=50$

$$
\epsilon=\sqrt{\frac{2}{50}}.
$$

### Step 2 — Simplify

$$
\frac{2}{50}=0.04.
$$

### Step 3 — Take the square root

$$
\sqrt{0.04}=0.2.
$$

Therefore:

$$
\boxed{\epsilon=0.2.}
$$

</details>

---

## Question A8 — Data normalisation for one feature

A feature takes the three values

$$
x_1=2,
\qquad
x_2=4,
\qquad
x_3=6.
$$

Using

$$
\mu=\frac{1}{N}\sum_{n=1}^{N}x_n,
\qquad
\sigma^2=\frac{1}{N}\sum_{n=1}^{N}(x_n-\mu)^2,
\qquad
\tilde{x}_n=\frac{x_n-\mu}{\sigma},
$$

normalise the values.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute the mean

There are $N=3$ values:

$$
\mu=\frac{2+4+6}{3}=\frac{12}{3}=4.
$$

### Step 2 — Compute the variance

$$
\sigma^2
=
\frac{1}{3}\left((2-4)^2+(4-4)^2+(6-4)^2\right).
$$

So:

$$
\sigma^2
=
\frac{1}{3}(4+0+4)
=
\frac{8}{3}.
$$

### Step 3 — Compute the standard deviation

$$
\sigma=\sqrt{\frac{8}{3}}\approx 1.633.
$$

### Step 4 — Normalise each value

For $x_1=2$:

$$
\tilde{x}_1=\frac{2-4}{1.633}\approx -1.225.
$$

For $x_2=4$:

$$
\tilde{x}_2=\frac{4-4}{1.633}=0.
$$

For $x_3=6$:

$$
\tilde{x}_3=\frac{6-4}{1.633}\approx 1.225.
$$

Therefore:

$$
\boxed{\tilde{x}\approx[-1.225,\ 0,\ 1.225].}
$$

</details>

---

## Question A9 — Momentum update

Suppose

$$
w^{(\tau-1)}=2,
\qquad
\nabla E(w^{(\tau-1)})=0.5,
\qquad
\eta=0.1,
\qquad
\mu=0.9,
\qquad
\Delta w^{(\tau-2)}=-0.03.
$$

Using

$$
\Delta w^{(\tau-1)}
=
-\eta \nabla E(w^{(\tau-1)})
+
\mu\Delta w^{(\tau-2)},
$$

compute $\Delta w^{(\tau-1)}$ and the new weight

$$
w^{(\tau)}=w^{(\tau-1)}+\Delta w^{(\tau-1)}.
$$

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute the ordinary gradient step

$$
-\eta \nabla E
=-(0.1)(0.5)
=-0.05.
$$

### Step 2 — Compute the momentum contribution

$$
\mu\Delta w^{(\tau-2)}
=(0.9)(-0.03)
=-0.027.
$$

### Step 3 — Add the two parts

$$
\Delta w^{(\tau-1)}=-0.05-0.027=-0.077.
$$

### Step 4 — Update the weight

$$
w^{(\tau)}=2+(-0.077)=1.923.
$$

Therefore:

$$
\boxed{\Delta w^{(\tau-1)}=-0.077,
\qquad
w^{(\tau)}=1.923.}
$$

</details>

---

## Question A10 — One convolution window

Let

$$
I=
\begin{bmatrix}
1&2&3\\
4&5&6\\
7&8&9
\end{bmatrix},
\qquad
K=
\begin{bmatrix}
1&0\\
-1&2
\end{bmatrix}.
$$

Compute the top-left convolution output using the $2\times2$ patch in the top-left of $I$.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Extract the top-left patch

The top-left $2\times2$ patch is:

$$
\begin{bmatrix}
1&2\\
4&5
\end{bmatrix}.
$$

### Step 2 — Multiply corresponding entries with the filter

$$
1(1)+2(0)+4(-1)+5(2).
$$

### Step 3 — Add the terms

$$
1+0-4+10=7.
$$

Therefore:

$$
\boxed{C(1,1)=7.}
$$

</details>

---

# Section B — Multi-condition checks

These questions combine two or more checks: traces plus values, derivatives plus dimensions, or formula plus interpretation.

---

## Question B1 — Finite-difference error as $\epsilon$ changes

For the sheet’s running function

$$
f(x,y)=x^2y+y+2,
$$

estimate $\partial f/\partial x$ at $(3,2)$ using forward finite differences with:

1. $\epsilon=1$
2. $\epsilon=10^{-6}$

Then compare each estimate with the exact value.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Write the finite-difference expression

$$
\frac{\partial f}{\partial x}
\approx
\frac{f(3+\epsilon,2)-f(3,2)}{\epsilon}.
$$

### Step 2 — Compute the formula algebraically

First:

$$
f(3,2)=22.
$$

Now:

$$
f(3+\epsilon,2)
=(3+\epsilon)^2(2)+2+2.
$$

Expand:

$$
(3+\epsilon)^2=9+6\epsilon+\epsilon^2.
$$

So:

$$
f(3+\epsilon,2)=2(9+6\epsilon+\epsilon^2)+4
=18+12\epsilon+2\epsilon^2+4
=22+12\epsilon+2\epsilon^2.
$$

Therefore:

$$
\frac{f(3+\epsilon,2)-f(3,2)}{\epsilon}
=
\frac{22+12\epsilon+2\epsilon^2-22}{\epsilon}
=
12+2\epsilon.
$$

### Step 3 — Use $\epsilon=1$

$$
12+2(1)=14.
$$

### Step 4 — Use $\epsilon=10^{-6}$

$$
12+2(10^{-6})=12.000002.
$$

### Step 5 — Compare with the exact derivative

From manual differentiation:

$$
\frac{\partial f}{\partial x}=2xy.
$$

At $(3,2)$:

$$
2xy=12.
$$

So:

$$
\boxed{\epsilon=1 \Rightarrow 14,\quad \text{error }2.}
$$

$$
\boxed{\epsilon=10^{-6} \Rightarrow 12.000002,\quad \text{error }0.000002.}
$$

Smaller $\epsilon$ improves the approximation here, although very tiny $\epsilon$ can later cause floating-point problems.

</details>

---

## Question B2 — Full Jacobian and forward-mode pass count

Let

$$
F(x_1,x_2)=
\begin{bmatrix}
x_1+x_2^2\\
x_1x_2\\
\sin(x_1)
\end{bmatrix}.
$$

Compute the Jacobian at $(x_1,x_2)=(1,2)$. How many forward-mode passes are needed to compute the full Jacobian?

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Identify input and output dimensions

There are two inputs and three outputs:

$$
F:\mathbb{R}^2\to\mathbb{R}^3.
$$

So the Jacobian has shape:

$$
3\times2.
$$

### Step 2 — Differentiate the first output

$$
f_1=x_1+x_2^2.
$$

Therefore:

$$
\frac{\partial f_1}{\partial x_1}=1,
\qquad
\frac{\partial f_1}{\partial x_2}=2x_2.
$$

At $(1,2)$:

$$
\frac{\partial f_1}{\partial x_2}=4.
$$

So row 1 is:

$$
[1,4].
$$

### Step 3 — Differentiate the second output

$$
f_2=x_1x_2.
$$

Therefore:

$$
\frac{\partial f_2}{\partial x_1}=x_2,
\qquad
\frac{\partial f_2}{\partial x_2}=x_1.
$$

At $(1,2)$:

$$
[x_2,x_1]=[2,1].
$$

So row 2 is:

$$
[2,1].
$$

### Step 4 — Differentiate the third output

$$
f_3=\sin(x_1).
$$

Therefore:

$$
\frac{\partial f_3}{\partial x_1}=\cos(x_1),
\qquad
\frac{\partial f_3}{\partial x_2}=0.
$$

At $x_1=1$:

$$
\cos(1)\approx0.5403.
$$

So row 3 is:

$$
[0.5403,0].
$$

### Step 5 — Assemble the Jacobian

$$
\boxed{
J(1,2)=
\begin{bmatrix}
1&4\\
2&1\\
0.5403&0
\end{bmatrix}.}
$$

### Step 6 — Count forward-mode passes

Forward mode computes one Jacobian column per input seed direction.

There are $n=2$ inputs, so the full Jacobian needs:

$$
\boxed{2\text{ forward-mode passes}.}
$$

</details>

---

## Question B3 — Forward-mode AD for $\partial y/\partial x_2$

For the sheet’s AD example

$$
y=\ln(x_1)+x_1x_2-\sin(x_2),
$$

compute $\partial y/\partial x_2$ at $(x_1,x_2)=(2,5)$ using the forward-mode trace.

Use:

$$
\cos(5)\approx0.283662.
$$

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Write the primal trace

$$
v_{-1}=x_1,
\qquad
v_0=x_2,
$$

$$
v_1=\ln(v_{-1}),
\qquad
v_2=v_{-1}v_0,
\qquad
v_3=\sin(v_0),
$$

$$
v_4=v_1+v_2,
\qquad
v_5=v_4-v_3,
\qquad
y=v_5.
$$

### Step 2 — Seed the tangent variables for $x_2$

To compute $\partial y/\partial x_2$, set:

$$
\dot{v}_{-1}=\dot{x}_1=0,
\qquad
\dot{v}_0=\dot{x}_2=1.
$$

### Step 3 — Propagate through $v_1=\ln(v_{-1})$

$$
\dot{v}_1=\frac{1}{v_{-1}}\dot{v}_{-1}.
$$

At $v_{-1}=2$:

$$
\dot{v}_1=\frac{1}{2}(0)=0.
$$

### Step 4 — Propagate through $v_2=v_{-1}v_0$

Use the product rule:

$$
\dot{v}_2=\dot{v}_{-1}v_0+v_{-1}\dot{v}_0.
$$

At $(v_{-1},v_0)=(2,5)$:

$$
\dot{v}_2=0(5)+2(1)=2.
$$

### Step 5 — Propagate through $v_3=\sin(v_0)$

$$
\dot{v}_3=\cos(v_0)\dot{v}_0.
$$

So:

$$
\dot{v}_3=\cos(5)(1)=0.283662.
$$

### Step 6 — Propagate through $v_4=v_1+v_2$

$$
\dot{v}_4=\dot{v}_1+\dot{v}_2=0+2=2.
$$

### Step 7 — Propagate through $v_5=v_4-v_3$

$$
\dot{v}_5=\dot{v}_4-\dot{v}_3=2-0.283662=1.716338.
$$

### Step 8 — Read off the derivative

Since $y=v_5$:

$$
\boxed{\frac{\partial y}{\partial x_2}\approx1.716338.}
$$

</details>

---

## Question B4 — Reverse-mode AD for the full gradient

For

$$
y=\ln(x_1)+x_1x_2-\sin(x_2),
$$

use reverse-mode AD to compute the full gradient at $(x_1,x_2)=(2,5)$.

Use:

$$
\cos(5)\approx0.283662.
$$

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Write the primal trace

$$
v_{-1}=x_1,
\qquad
v_0=x_2,
$$

$$
v_1=\ln(v_{-1}),
\qquad
v_2=v_{-1}v_0,
\qquad
v_3=\sin(v_0),
$$

$$
v_4=v_1+v_2,
\qquad
v_5=v_4-v_3,
\qquad
y=v_5.
$$

At $(x_1,x_2)=(2,5)$:

$$
v_{-1}=2,
\qquad
v_0=5.
$$

### Step 2 — Start the reverse pass at the output

Since $y=v_5$:

$$
\bar{v}_5=\frac{\partial y}{\partial v_5}=1.
$$

### Step 3 — Backpropagate through $v_5=v_4-v_3$

The local derivatives are:

$$
\frac{\partial v_5}{\partial v_4}=1,
\qquad
\frac{\partial v_5}{\partial v_3}=-1.
$$

Therefore:

$$
\bar{v}_4=\bar{v}_5(1)=1,
\qquad
\bar{v}_3=\bar{v}_5(-1)=-1.
$$

### Step 4 — Backpropagate through $v_4=v_1+v_2$

The local derivatives are both 1:

$$
\bar{v}_1=\bar{v}_4(1)=1,
\qquad
\bar{v}_2=\bar{v}_4(1)=1.
$$

### Step 5 — Accumulate the adjoint for $x_1=v_{-1}$

The variable $v_{-1}$ contributes through both $v_1$ and $v_2$:

$$
\bar{v}_{-1}
=
\bar{v}_1\frac{\partial v_1}{\partial v_{-1}}
+
\bar{v}_2\frac{\partial v_2}{\partial v_{-1}}.
$$

Now:

$$
\frac{\partial v_1}{\partial v_{-1}}=\frac{1}{v_{-1}}=\frac{1}{2},
$$

and

$$
\frac{\partial v_2}{\partial v_{-1}}=v_0=5.
$$

So:

$$
\bar{v}_{-1}=1\left(\frac{1}{2}\right)+1(5)=5.5.
$$

Thus:

$$
\frac{\partial y}{\partial x_1}=5.5.
$$

### Step 6 — Accumulate the adjoint for $x_2=v_0$

The variable $v_0$ contributes through both $v_2$ and $v_3$:

$$
\bar{v}_0
=
\bar{v}_2\frac{\partial v_2}{\partial v_0}
+
\bar{v}_3\frac{\partial v_3}{\partial v_0}.
$$

Now:

$$
\frac{\partial v_2}{\partial v_0}=v_{-1}=2,
$$

and

$$
\frac{\partial v_3}{\partial v_0}=\cos(v_0)=\cos(5)\approx0.283662.
$$

So:

$$
\bar{v}_0=1(2)+(-1)(0.283662)=1.716338.
$$

Thus:

$$
\frac{\partial y}{\partial x_2}\approx1.716338.
$$

### Step 7 — Assemble the gradient

$$
\boxed{
\nabla y(2,5)
\approx
\begin{bmatrix}
5.5\\
1.716338
\end{bmatrix}.}
$$

</details>

---

## Question B5 — Forward pass through the sheet’s toy MLP form

Use the toy MLP structure from the sheet:

$$
z^{(2)}=W^{(2)}x+b^{(2)},
\qquad
a^{(2)}=\tanh(z^{(2)}),
$$

$$
z^{(3)}=(w^{(3)})^Ta^{(2)}+b^{(3)},
\qquad
\hat{y}=\sigma(z^{(3)}).
$$

Let

$$
x=
\begin{bmatrix}
1\\-1
\end{bmatrix},
\quad
W^{(2)}=
\begin{bmatrix}
0.5&-0.25\\
1&0.5
\end{bmatrix},
\quad
b^{(2)}=
\begin{bmatrix}
0\\0.1
\end{bmatrix},
$$

$$
w^{(3)}=
\begin{bmatrix}
1.2\\-0.7
\end{bmatrix},
\qquad
b^{(3)}=0.2,
\qquad
y=1.
$$

Compute $\hat{y}$ and the cross-entropy error.

Use:

$$
\tanh(0.75)\approx0.635149,
\qquad
\tanh(0.6)\approx0.537050.
$$

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute the hidden pre-activation $z^{(2)}$

First hidden unit:

$$
z^{(2)}_1=0.5(1)+(-0.25)(-1)+0=0.5+0.25=0.75.
$$

Second hidden unit:

$$
z^{(2)}_2=1(1)+0.5(-1)+0.1=1-0.5+0.1=0.6.
$$

So:

$$
z^{(2)}=
\begin{bmatrix}
0.75\\0.6
\end{bmatrix}.
$$

### Step 2 — Apply $\tanh$ element-wise

$$
a^{(2)}=
\begin{bmatrix}
\tanh(0.75)\\
\tanh(0.6)
\end{bmatrix}
\approx
\begin{bmatrix}
0.635149\\
0.537050
\end{bmatrix}.
$$

### Step 3 — Compute the output pre-activation

$$
z^{(3)}=1.2(0.635149)+(-0.7)(0.537050)+0.2.
$$

Compute each term:

$$
1.2(0.635149)=0.762179,
$$

$$
-0.7(0.537050)=-0.375935.
$$

Thus:

$$
z^{(3)}=0.762179-0.375935+0.2=0.586244.
$$

### Step 4 — Apply the sigmoid

$$
\hat{y}=\sigma(0.586244)=\frac{1}{1+e^{-0.586244}}\approx0.642503.
$$

### Step 5 — Compute cross-entropy for $y=1$

For $y=1$:

$$
E=-\log(\hat{y}).
$$

So:

$$
E=-\log(0.642503)\approx0.442384.
$$

Therefore:

$$
\boxed{\hat{y}\approx0.642503,
\qquad
E\approx0.442384.}
$$

</details>

---

## Question B6 — Two MLP gradients from the same forward pass

Using the values from Question B5, compute:

1. $\partial E/\partial w^{(3)}_{11}$
2. $\partial E/\partial w^{(2)}_{12}$

Use the sheet’s formulas:

$$
\frac{\partial E}{\partial w^{(3)}_{11}}
=(a^{(3)}_1-y)a^{(2)}_1,
$$

and

$$
\frac{\partial E}{\partial w^{(2)}_{12}}
=
(a^{(3)}_1-y)w^{(3)}_{11}
\left(1-\tanh^2(z^{(2)}_1)\right)x_2.
$$

Use:

$$
a^{(3)}_1=0.642503,
\quad
 y=1,
\quad
 a^{(2)}_1=0.635149,
\quad
 z^{(2)}_1=0.75,
\quad
 w^{(3)}_{11}=1.2,
\quad
 x_2=-1.
$$

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute the output-layer error signal

For sigmoid plus cross-entropy:

$$
\delta^{(3)}=a^{(3)}_1-y.
$$

So:

$$
\delta^{(3)}=0.642503-1=-0.357497.
$$

### Step 2 — Compute $\partial E/\partial w^{(3)}_{11}$

Use:

$$
\frac{\partial E}{\partial w^{(3)}_{11}}
=\delta^{(3)}a^{(2)}_1.
$$

Substitute:

$$
\frac{\partial E}{\partial w^{(3)}_{11}}
=(-0.357497)(0.635149).
$$

Therefore:

$$
\boxed{
\frac{\partial E}{\partial w^{(3)}_{11}}
\approx -0.227064.}
$$

### Step 3 — Compute the hidden activation derivative

Since $a^{(2)}_1=\tanh(z^{(2)}_1)=0.635149$:

$$
1-\tanh^2(z^{(2)}_1)=1-(0.635149)^2.
$$

Now:

$$
(0.635149)^2\approx0.403414.
$$

So:

$$
1-\tanh^2(z^{(2)}_1)\approx0.596586.
$$

### Step 4 — Compute $\partial E/\partial w^{(2)}_{12}$

Use:

$$
\frac{\partial E}{\partial w^{(2)}_{12}}
=
\delta^{(3)}w^{(3)}_{11}
\left(1-\tanh^2(z^{(2)}_1)\right)x_2.
$$

Substitute:

$$
\frac{\partial E}{\partial w^{(2)}_{12}}
=(-0.357497)(1.2)(0.596586)(-1).
$$

Multiplying gives:

$$
\boxed{
\frac{\partial E}{\partial w^{(2)}_{12}}
\approx0.255933.}
$$

</details>

---

## Question B7 — Batch norm versus layer norm

Consider the mini-batch pre-activation matrix

$$
Z=
\begin{bmatrix}
1&2&3\\
3&4&5
\end{bmatrix},
$$

where rows are data points and columns are hidden units. Use $\gamma=1$, $\beta=0$, and $\delta=0$.

Compute:

1. batch normalisation across the mini-batch separately for each hidden unit;
2. layer normalisation across hidden units separately for each data point.

<details>
<summary><strong>Worked solution</strong></summary>

## Part 1 — Batch normalisation

### Step 1 — Compute the mean for each hidden unit

Column 1:

$$
\mu_1=\frac{1+3}{2}=2.
$$

Column 2:

$$
\mu_2=\frac{2+4}{2}=3.
$$

Column 3:

$$
\mu_3=\frac{3+5}{2}=4.
$$

### Step 2 — Compute the variance for each hidden unit

Each column has values one below and one above its mean:

$$
\sigma_1^2=\frac{(1-2)^2+(3-2)^2}{2}=1,
$$

$$
\sigma_2^2=\frac{(2-3)^2+(4-3)^2}{2}=1,
$$

$$
\sigma_3^2=\frac{(3-4)^2+(5-4)^2}{2}=1.
$$

So each standard deviation is 1.

### Step 3 — Normalise each column

Column 1:

$$
\frac{1-2}{1}=-1,
\qquad
\frac{3-2}{1}=1.
$$

Column 2:

$$
\frac{2-3}{1}=-1,
\qquad
\frac{4-3}{1}=1.
$$

Column 3:

$$
\frac{3-4}{1}=-1,
\qquad
\frac{5-4}{1}=1.
$$

Thus batch norm gives:

$$
\boxed{
\begin{bmatrix}
-1&-1&-1\\
1&1&1
\end{bmatrix}.}
$$

## Part 2 — Layer normalisation

### Step 4 — Compute the mean for each data point

Row 1:

$$
\mu_1=\frac{1+2+3}{3}=2.
$$

Row 2:

$$
\mu_2=\frac{3+4+5}{3}=4.
$$

### Step 5 — Compute the variance for each data point

Row 1:

$$
\sigma_1^2=\frac{(1-2)^2+(2-2)^2+(3-2)^2}{3}=\frac{2}{3}.
$$

Row 2:

$$
\sigma_2^2=\frac{(3-4)^2+(4-4)^2+(5-4)^2}{3}=\frac{2}{3}.
$$

So:

$$
\sigma_1=\sigma_2=\sqrt{\frac{2}{3}}\approx0.8165.
$$

### Step 6 — Normalise each row

For row 1:

$$
\left[
\frac{1-2}{0.8165},
\frac{2-2}{0.8165},
\frac{3-2}{0.8165}
\right]
\approx[-1.225,0,1.225].
$$

For row 2:

$$
\left[
\frac{3-4}{0.8165},
\frac{4-4}{0.8165},
\frac{5-4}{0.8165}
\right]
\approx[-1.225,0,1.225].
$$

Thus layer norm gives:

$$
\boxed{
\begin{bmatrix}
-1.225&0&1.225\\
-1.225&0&1.225
\end{bmatrix}.}
$$

### Step 7 — Interpret the difference

Batch norm normalises **columns** across the mini-batch.  
Layer norm normalises **rows** across hidden units.

</details>

---

## Question B8 — AdaGrad versus RMSProp after two gradients

A single parameter starts at

$$
w^{(0)}=1.
$$

The gradients are:

$$
g^{(1)}=0.4,
\qquad
g^{(2)}=0.2.
$$

Use learning rate $\eta=0.1$, no numerical stabiliser, and initial accumulator $r^{(0)}=0$.

1. Compute two AdaGrad updates.
2. Compute two RMSProp updates with $\beta=0.5$.

<details>
<summary><strong>Worked solution</strong></summary>

## Part 1 — AdaGrad

### Step 1 — First AdaGrad accumulator

AdaGrad uses:

$$
r^{(\tau)}=r^{(\tau-1)}+(g^{(\tau)})^2.
$$

So:

$$
r^{(1)}=0+(0.4)^2=0.16.
$$

### Step 2 — First AdaGrad weight update

$$
w^{(1)}=w^{(0)}-\frac{\eta}{\sqrt{r^{(1)}}}g^{(1)}.
$$

Since $\sqrt{0.16}=0.4$:

$$
w^{(1)}=1-\frac{0.1}{0.4}(0.4)=1-0.1=0.9.
$$

### Step 3 — Second AdaGrad accumulator

$$
r^{(2)}=0.16+(0.2)^2=0.16+0.04=0.20.
$$

### Step 4 — Second AdaGrad weight update

$$
w^{(2)}=0.9-\frac{0.1}{\sqrt{0.20}}(0.2).
$$

Now:

$$
\sqrt{0.20}\approx0.447214.
$$

So:

$$
\frac{0.1}{0.447214}(0.2)
\approx0.044721.
$$

Therefore:

$$
\boxed{w^{(2)}_{\text{AdaGrad}}\approx0.855279.}
$$

## Part 2 — RMSProp

### Step 5 — First RMSProp accumulator

RMSProp uses:

$$
r^{(\tau)}=\beta r^{(\tau-1)}+(1-\beta)(g^{(\tau)})^2.
$$

With $\beta=0.5$:

$$
r^{(1)}=0.5(0)+0.5(0.4)^2=0.08.
$$

### Step 6 — First RMSProp weight update

$$
w^{(1)}=1-\frac{0.1}{\sqrt{0.08}}(0.4).
$$

Since $\sqrt{0.08}\approx0.282843$:

$$
\frac{0.1}{0.282843}(0.4)\approx0.141421.
$$

So:

$$
w^{(1)}\approx1-0.141421=0.858579.
$$

### Step 7 — Second RMSProp accumulator

$$
r^{(2)}=0.5(0.08)+0.5(0.2)^2=0.04+0.02=0.06.
$$

### Step 8 — Second RMSProp weight update

$$
w^{(2)}=0.858579-\frac{0.1}{\sqrt{0.06}}(0.2).
$$

Since $\sqrt{0.06}\approx0.244949$:

$$
\frac{0.1}{0.244949}(0.2)\approx0.081650.
$$

Thus:

$$
\boxed{w^{(2)}_{\text{RMSProp}}\approx0.776929.}
$$

### Step 9 — Interpret the difference

AdaGrad accumulates **all** squared gradients, so its denominator keeps growing.  
RMSProp uses a **moving average**, so old gradients decay away.

</details>

---

## Question B9 — Multi-channel convolution shape and parameters

An input image has shape

$$
32\times32\times3.
$$

A convolutional layer uses $16$ filters. Each filter has spatial size $5\times5$, spans all input channels, uses padding $P=2$, and stride $S=1$.

Compute:

1. the output feature-map shape;
2. the number of weight parameters;
3. the number of bias parameters if each output channel has one bias.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Identify the input dimensions

Here:

$$
J=32,
\qquad
K=32,
\qquad
C=3.
$$

The filter has:

$$
M=5,
\qquad
C_{\text{out}}=16.
$$

### Step 2 — Compute the spatial output size

The sheet gives:

$$
\left\lfloor \frac{J+2P-M}{S}+1 \right\rfloor
\times
\left\lfloor \frac{K+2P-M}{S}+1 \right\rfloor.
$$

Substitute:

$$
\left\lfloor \frac{32+2(2)-5}{1}+1 \right\rfloor
=\left\lfloor 31+1 \right\rfloor
=32.
$$

So the spatial size is:

$$
32\times32.
$$

### Step 3 — Add the output-channel dimension

There are $16$ independent filters, so there are $16$ output channels.

Therefore the output shape is:

$$
\boxed{32\times32\times16.}
$$

### Step 4 — Count weight parameters

Each filter has shape:

$$
5\times5\times3.
$$

So one filter has:

$$
5(5)(3)=75
$$

weights.

There are $16$ filters, so:

$$
75(16)=1200
$$

weights.

### Step 5 — Count bias parameters

One bias per output channel gives:

$$
16
$$

biases.

Therefore:

$$
\boxed{1200\text{ weights and }16\text{ biases}.}
$$

</details>

---

## Question B10 — Max pooling with stride 2

Apply $2\times2$ max pooling with stride $2$ to

$$
A=
\begin{bmatrix}
1&3&2&0\\
4&6&5&1\\
7&2&8&9\\
1&5&2&3
\end{bmatrix}.
$$

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Split the input into non-overlapping $2\times2$ windows

Top-left window:

$$
\begin{bmatrix}
1&3\\
4&6
\end{bmatrix}
$$

Top-right window:

$$
\begin{bmatrix}
2&0\\
5&1
\end{bmatrix}
$$

Bottom-left window:

$$
\begin{bmatrix}
7&2\\
1&5
\end{bmatrix}
$$

Bottom-right window:

$$
\begin{bmatrix}
8&9\\
2&3
\end{bmatrix}
$$

### Step 2 — Take the maximum in each window

Top-left:

$$
\max(1,3,4,6)=6.
$$

Top-right:

$$
\max(2,0,5,1)=5.
$$

Bottom-left:

$$
\max(7,2,1,5)=7.
$$

Bottom-right:

$$
\max(8,9,2,3)=9.
$$

### Step 3 — Assemble the pooled output

$$
\boxed{
\begin{bmatrix}
6&5\\
7&9
\end{bmatrix}.}
$$

</details>

---

# Section C — Build from scratch

These are longer worked examples where you have to create the trace, the network calculation, or the layer calculation yourself.

---

## Question C1 — Build a forward-mode trace from scratch

Let

$$
y=\ln(x_1+x_2)+x_1x_2.
$$

At $(x_1,x_2)=(1,3)$, compute $\partial y/\partial x_1$ using forward-mode AD.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Write the primal trace

Choose elementary operations:

$$
v_{-1}=x_1,
\qquad
v_0=x_2,
$$

$$
v_1=v_{-1}+v_0,
$$

$$
v_2=\ln(v_1),
$$

$$
v_3=v_{-1}v_0,
$$

$$
v_4=v_2+v_3,
$$

$$
y=v_4.
$$

### Step 2 — Seed the tangent variables

To compute $\partial y/\partial x_1$, set:

$$
\dot{v}_{-1}=1,
\qquad
\dot{v}_0=0.
$$

### Step 3 — Evaluate the primal values

At $(x_1,x_2)=(1,3)$:

$$
v_{-1}=1,
\qquad
v_0=3.
$$

Then:

$$
v_1=1+3=4,
$$

$$
v_2=\ln(4),
$$

$$
v_3=1(3)=3,
$$

$$
y=v_4=\ln(4)+3.
$$

### Step 4 — Propagate the tangent through $v_1=v_{-1}+v_0$

$$
\dot{v}_1=\dot{v}_{-1}+\dot{v}_0=1+0=1.
$$

### Step 5 — Propagate through $v_2=\ln(v_1)$

$$
\dot{v}_2=\frac{1}{v_1}\dot{v}_1.
$$

Since $v_1=4$:

$$
\dot{v}_2=\frac{1}{4}(1)=0.25.
$$

### Step 6 — Propagate through $v_3=v_{-1}v_0$

Use the product rule:

$$
\dot{v}_3=\dot{v}_{-1}v_0+v_{-1}\dot{v}_0.
$$

So:

$$
\dot{v}_3=1(3)+1(0)=3.
$$

### Step 7 — Propagate through $v_4=v_2+v_3$

$$
\dot{v}_4=\dot{v}_2+\dot{v}_3=0.25+3=3.25.
$$

### Step 8 — Read off the derivative

Since $y=v_4$:

$$
\boxed{\frac{\partial y}{\partial x_1}=3.25.}
$$

</details>

---

## Question C2 — Build a reverse-mode trace from scratch

Let

$$
y=(x_1+x_2)(x_1-x_2).
$$

At $(x_1,x_2)=(5,2)$, compute the full gradient using reverse-mode AD.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Write the primal trace

Define:

$$
v_{-1}=x_1,
\qquad
v_0=x_2,
$$

$$
v_1=v_{-1}+v_0,
$$

$$
v_2=v_{-1}-v_0,
$$

$$
v_3=v_1v_2,
$$

$$
y=v_3.
$$

### Step 2 — Evaluate the primal values

At $(x_1,x_2)=(5,2)$:

$$
v_1=5+2=7,
$$

$$
v_2=5-2=3,
$$

$$
y=v_3=7(3)=21.
$$

### Step 3 — Start the reverse pass

Since $y=v_3$:

$$
\bar{v}_3=1.
$$

### Step 4 — Backpropagate through $v_3=v_1v_2$

The local derivatives are:

$$
\frac{\partial v_3}{\partial v_1}=v_2=3,
\qquad
\frac{\partial v_3}{\partial v_2}=v_1=7.
$$

Therefore:

$$
\bar{v}_1=\bar{v}_3v_2=1(3)=3,
$$

$$
\bar{v}_2=\bar{v}_3v_1=1(7)=7.
$$

### Step 5 — Accumulate contributions to $x_1=v_{-1}$

The variable $v_{-1}$ appears in both $v_1$ and $v_2$:

$$
\bar{v}_{-1}
=
\bar{v}_1\frac{\partial v_1}{\partial v_{-1}}
+
\bar{v}_2\frac{\partial v_2}{\partial v_{-1}}.
$$

The local derivatives are:

$$
\frac{\partial v_1}{\partial v_{-1}}=1,
\qquad
\frac{\partial v_2}{\partial v_{-1}}=1.
$$

So:

$$
\bar{v}_{-1}=3(1)+7(1)=10.
$$

Thus:

$$
\frac{\partial y}{\partial x_1}=10.
$$

### Step 6 — Accumulate contributions to $x_2=v_0$

The variable $v_0$ also appears in both $v_1$ and $v_2$:

$$
\bar{v}_{0}
=
\bar{v}_1\frac{\partial v_1}{\partial v_0}
+
\bar{v}_2\frac{\partial v_2}{\partial v_0}.
$$

The local derivatives are:

$$
\frac{\partial v_1}{\partial v_0}=1,
\qquad
\frac{\partial v_2}{\partial v_0}=-1.
$$

So:

$$
\bar{v}_{0}=3(1)+7(-1)=-4.
$$

Thus:

$$
\frac{\partial y}{\partial x_2}=-4.
$$

### Step 7 — Assemble the gradient

$$
\boxed{
\nabla y(5,2)=
\begin{bmatrix}
10\\
-4
\end{bmatrix}.}
$$

</details>

---

## Question C3 — Full backpropagation for a small MLP

Consider a network with two inputs, two hidden `tanh` units, and one sigmoid output:

$$
z^{(2)}=W^{(2)}x+b^{(2)},
\qquad
a^{(2)}=\tanh(z^{(2)}),
$$

$$
z^{(3)}=(w^{(3)})^Ta^{(2)}+b^{(3)},
\qquad
a^{(3)}=\sigma(z^{(3)}).
$$

Use:

$$
x=
\begin{bmatrix}
2\\1
\end{bmatrix},
\quad
W^{(2)}=
\begin{bmatrix}
0.1&0.2\\
-0.1&0.3
\end{bmatrix},
\quad
b^{(2)}=
\begin{bmatrix}
0\\0.1
\end{bmatrix},
$$

$$
w^{(3)}=
\begin{bmatrix}
0.4\\-0.2
\end{bmatrix},
\qquad
b^{(3)}=0,
\qquad
y=0.
$$

Compute all gradients:

$$
\frac{\partial E}{\partial w^{(3)}},
\quad
\frac{\partial E}{\partial b^{(3)}},
\quad
\frac{\partial E}{\partial W^{(2)}},
\quad
\frac{\partial E}{\partial b^{(2)}}.
$$

Use cross-entropy with sigmoid output.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute the hidden pre-activation

$$
z^{(2)}=W^{(2)}x+b^{(2)}.
$$

First hidden unit:

$$
z^{(2)}_1=0.1(2)+0.2(1)+0=0.4.
$$

Second hidden unit:

$$
z^{(2)}_2=(-0.1)(2)+0.3(1)+0.1=-0.2+0.3+0.1=0.2.
$$

So:

$$
z^{(2)}=
\begin{bmatrix}
0.4\\0.2
\end{bmatrix}.
$$

### Step 2 — Compute hidden activations

$$
a^{(2)}=\tanh(z^{(2)})
\approx
\begin{bmatrix}
0.379949\\0.197375
\end{bmatrix}.
$$

### Step 3 — Compute the output pre-activation

$$
z^{(3)}=0.4(0.379949)+(-0.2)(0.197375)+0.
$$

So:

$$
z^{(3)}=0.151980-0.039475=0.112505.
$$

### Step 4 — Compute the output activation

$$
a^{(3)}=\sigma(0.112505)\approx0.528097.
$$

### Step 5 — Compute the output error signal

For sigmoid plus cross-entropy:

$$
\delta^{(3)}=\frac{\partial E}{\partial z^{(3)}}=a^{(3)}-y.
$$

Since $y=0$:

$$
\delta^{(3)}=0.528097-0=0.528097.
$$

### Step 6 — Compute output-layer gradients

For output weights:

$$
\frac{\partial E}{\partial w^{(3)}}=
\delta^{(3)}a^{(2)}.
$$

Thus:

$$
\frac{\partial E}{\partial w^{(3)}}
=0.528097
\begin{bmatrix}
0.379949\\0.197375
\end{bmatrix}
\approx
\begin{bmatrix}
0.200650\\0.104233
\end{bmatrix}.
$$

For the output bias:

$$
\frac{\partial E}{\partial b^{(3)}}=\delta^{(3)}=0.528097.
$$

### Step 7 — Backpropagate to hidden units

For each hidden unit:

$$
\delta^{(2)}_i
=
\delta^{(3)}w^{(3)}_i\left(1-(a^{(2)}_i)^2\right).
$$

First hidden unit:

$$
\delta^{(2)}_1
=0.528097(0.4)(1-0.379949^2).
$$

Since $1-0.379949^2\approx0.855639$:

$$
\delta^{(2)}_1\approx0.180744.
$$

Second hidden unit:

$$
\delta^{(2)}_2
=0.528097(-0.2)(1-0.197375^2).
$$

Since $1-0.197375^2\approx0.961043$:

$$
\delta^{(2)}_2\approx-0.101505.
$$

Therefore:

$$
\delta^{(2)}\approx
\begin{bmatrix}
0.180744\\-0.101505
\end{bmatrix}.
$$

### Step 8 — Compute hidden-layer weight gradients

For a layer:

$$
\frac{\partial E}{\partial W^{(2)}}=\delta^{(2)}(x)^T.
$$

So:

$$
\frac{\partial E}{\partial W^{(2)}}
=
\begin{bmatrix}
0.180744\\-0.101505
\end{bmatrix}
\begin{bmatrix}
2&1
\end{bmatrix}.
$$

Therefore:

$$
\frac{\partial E}{\partial W^{(2)}}
\approx
\begin{bmatrix}
0.361488&0.180744\\
-0.203009&-0.101505
\end{bmatrix}.
$$

### Step 9 — Compute hidden-layer bias gradients

Bias gradients equal the hidden deltas:

$$
\frac{\partial E}{\partial b^{(2)}}=\delta^{(2)}.
$$

So:

$$
\boxed{
\frac{\partial E}{\partial b^{(2)}}
\approx
\begin{bmatrix}
0.180744\\-0.101505
\end{bmatrix}.}
$$

### Step 10 — Final answer

$$
\boxed{
\frac{\partial E}{\partial w^{(3)}}
\approx
\begin{bmatrix}
0.200650\\0.104233
\end{bmatrix},
\quad
\frac{\partial E}{\partial b^{(3)}}
\approx0.528097.}
$$

$$
\boxed{
\frac{\partial E}{\partial W^{(2)}}
\approx
\begin{bmatrix}
0.361488&0.180744\\
-0.203009&-0.101505
\end{bmatrix},
\quad
\frac{\partial E}{\partial b^{(2)}}
\approx
\begin{bmatrix}
0.180744\\-0.101505
\end{bmatrix}.}
$$

</details>

---

## Question C4 — Mini-batch gradient aggregation

For a layer with two output units and two input activations, suppose a mini-batch has two examples.

Example 1:

$$
a^{(l-1)}_1=
\begin{bmatrix}
1\\2
\end{bmatrix},
\qquad
\delta^{(l)}_1=
\begin{bmatrix}
0.5\\-0.1
\end{bmatrix}.
$$

Example 2:

$$
a^{(l-1)}_2=
\begin{bmatrix}
0\\1
\end{bmatrix},
\qquad
\delta^{(l)}_2=
\begin{bmatrix}
-0.2\\0.3
\end{bmatrix}.
$$

Compute the average mini-batch gradients for $W^{(l)}$ and $b^{(l)}$.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Recall the per-example weight-gradient formula

For one example:

$$
\frac{\partial E}{\partial W^{(l)}}
=
\delta^{(l)}(a^{(l-1)})^T.
$$

The bias gradient is:

$$
\frac{\partial E}{\partial b^{(l)}}=\delta^{(l)}.
$$

### Step 2 — Compute the weight gradient for example 1

$$
G_1=
\begin{bmatrix}
0.5\\-0.1
\end{bmatrix}
\begin{bmatrix}
1&2
\end{bmatrix}
=
\begin{bmatrix}
0.5&1.0\\
-0.1&-0.2
\end{bmatrix}.
$$

### Step 3 — Compute the weight gradient for example 2

$$
G_2=
\begin{bmatrix}
-0.2\\0.3
\end{bmatrix}
\begin{bmatrix}
0&1
\end{bmatrix}
=
\begin{bmatrix}
0&-0.2\\
0&0.3
\end{bmatrix}.
$$

### Step 4 — Average the weight gradients

$$
\bar{G}=\frac{G_1+G_2}{2}.
$$

First add:

$$
G_1+G_2=
\begin{bmatrix}
0.5&0.8\\
-0.1&0.1
\end{bmatrix}.
$$

Now divide by 2:

$$
\boxed{
\bar{G}=
\begin{bmatrix}
0.25&0.4\\
-0.05&0.05
\end{bmatrix}.}
$$

### Step 5 — Average the bias gradients

$$
\bar{\delta}=\frac{1}{2}
\left(
\begin{bmatrix}
0.5\\-0.1
\end{bmatrix}
+
\begin{bmatrix}
-0.2\\0.3
\end{bmatrix}
\right).
$$

Add:

$$
\begin{bmatrix}
0.5\\-0.1
\end{bmatrix}
+
\begin{bmatrix}
-0.2\\0.3
\end{bmatrix}
=
\begin{bmatrix}
0.3\\0.2
\end{bmatrix}.
$$

Divide by 2:

$$
\boxed{
\frac{\partial E}{\partial b^{(l)}}
=
\begin{bmatrix}
0.15\\0.1
\end{bmatrix}.}
$$

</details>

---

## Question C5 — Full convolution feature map plus ReLU

Use

$$
I=
\begin{bmatrix}
1&2&3\\
4&5&6\\
7&8&9
\end{bmatrix},
\qquad
K=
\begin{bmatrix}
1&0\\
-1&2
\end{bmatrix}.
$$

With no padding and stride $1$, compute the full $2\times2$ feature map. Then add bias $b=-10$ to every entry and apply ReLU.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute the output shape

A $3\times3$ input with a $2\times2$ filter, no padding, stride 1 gives:

$$
(3-2+1)\times(3-2+1)=2\times2.
$$

### Step 2 — Compute the top-left output

Patch:

$$
\begin{bmatrix}
1&2\\
4&5
\end{bmatrix}.
$$

Convolution value:

$$
1(1)+2(0)+4(-1)+5(2)=1-4+10=7.
$$

### Step 3 — Compute the top-right output

Patch:

$$
\begin{bmatrix}
2&3\\
5&6
\end{bmatrix}.
$$

Convolution value:

$$
2(1)+3(0)+5(-1)+6(2)=2-5+12=9.
$$

### Step 4 — Compute the bottom-left output

Patch:

$$
\begin{bmatrix}
4&5\\
7&8
\end{bmatrix}.
$$

Convolution value:

$$
4(1)+5(0)+7(-1)+8(2)=4-7+16=13.
$$

### Step 5 — Compute the bottom-right output

Patch:

$$
\begin{bmatrix}
5&6\\
8&9
\end{bmatrix}.
$$

Convolution value:

$$
5(1)+6(0)+8(-1)+9(2)=5-8+18=15.
$$

### Step 6 — Assemble the convolution map

$$
C=
\begin{bmatrix}
7&9\\
13&15
\end{bmatrix}.
$$

### Step 7 — Add the bias

$$
C+b=
\begin{bmatrix}
7-10&9-10\\
13-10&15-10
\end{bmatrix}
=
\begin{bmatrix}
-3&-1\\
3&5
\end{bmatrix}.
$$

### Step 8 — Apply ReLU element-wise

ReLU keeps positive values and sends negative values to zero:

$$
\operatorname{ReLU}
\left(
\begin{bmatrix}
-3&-1\\
3&5
\end{bmatrix}
\right)
=
\begin{bmatrix}
0&0\\
3&5
\end{bmatrix}.
$$

Therefore:

$$
\boxed{
C=
\begin{bmatrix}
7&9\\13&15
\end{bmatrix},
\qquad
\operatorname{ReLU}(C-10)=
\begin{bmatrix}
0&0\\3&5
\end{bmatrix}.}
$$

</details>

---

## Question C6 — Build the He variance calculation

A ReLU layer has

$$
z_i^{(l)}=\sum_{j=1}^{M}w_{ij}a_j^{(l-1)},
$$

with

$$
w_{ij}\sim\mathcal{N}(0,\epsilon^2).
$$

The sheet gives the variance relation

$$
\operatorname{Var}(z_i^{(l)})=\frac{M}{2}\epsilon^2\lambda^2,
$$

where $\lambda^2$ is the variance of the previous layer’s pre-activations.

For $M=128$, choose $\epsilon$ so that variance is preserved across the layer.

Also say what happens if $\epsilon=0.1$.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — State the variance-preservation condition

To preserve variance, we want:

$$
\operatorname{Var}(z_i^{(l)})=\lambda^2.
$$

Using the sheet’s formula:

$$
\frac{M}{2}\epsilon^2\lambda^2=\lambda^2.
$$

### Step 2 — Cancel $\lambda^2$

Assuming $\lambda^2\ne0$:

$$
\frac{M}{2}\epsilon^2=1.
$$

### Step 3 — Solve for $\epsilon$

$$
\epsilon^2=\frac{2}{M}.
$$

So:

$$
\epsilon=\sqrt{\frac{2}{M}}.
$$

### Step 4 — Substitute $M=128$

$$
\epsilon=\sqrt{\frac{2}{128}}=\sqrt{\frac{1}{64}}=\frac{1}{8}=0.125.
$$

Therefore the He scale is:

$$
\boxed{\epsilon=0.125.}
$$

### Step 5 — Check what happens if $\epsilon=0.1$

The variance multiplier is:

$$
\frac{M}{2}\epsilon^2
=
\frac{128}{2}(0.1)^2
=64(0.01)=0.64.
$$

So the new variance would be:

$$
0.64\lambda^2.
$$

That means the variance shrinks by a factor of $0.64$ each layer, which can contribute to signals becoming smaller in deep networks.

</details>

---

## Question C7 — Adam and AdamW first update

A parameter starts at

$$
w^{(0)}=1.
$$

The first gradient is

$$
g^{(1)}=0.2.
$$

Use Adam with:

$$
\eta=0.01,
\quad
\beta_1=0.9,
\quad
\beta_2=0.999,
\quad
s^{(0)}=0,
\quad
r^{(0)}=0,
$$

and ignore the tiny numerical stabiliser.

1. Compute the first Adam update.
2. Compute the first AdamW update with weight decay $\lambda=0.1$, using the sheet’s AdamW form.

<details>
<summary><strong>Worked solution</strong></summary>

## Part 1 — Adam

### Step 1 — Compute the first moment estimate

$$
s^{(1)}=\beta_1s^{(0)}+(1-\beta_1)g^{(1)}.
$$

Substitute:

$$
s^{(1)}=0.9(0)+0.1(0.2)=0.02.
$$

### Step 2 — Compute the second moment estimate

$$
r^{(1)}=\beta_2r^{(0)}+(1-\beta_2)(g^{(1)})^2.
$$

Substitute:

$$
r^{(1)}=0.999(0)+0.001(0.2)^2=0.001(0.04)=0.00004.
$$

### Step 3 — Bias-correct the estimates

For $\tau=1$:

$$
\hat{s}^{(1)}=\frac{s^{(1)}}{1-\beta_1^1}
=\frac{0.02}{1-0.9}=\frac{0.02}{0.1}=0.2.
$$

$$
\hat{r}^{(1)}=\frac{r^{(1)}}{1-\beta_2^1}
=\frac{0.00004}{1-0.999}
=\frac{0.00004}{0.001}=0.04.
$$

### Step 4 — Apply the Adam update

$$
w^{(1)}=w^{(0)}-rac{\eta}{\sqrt{\hat{r}^{(1)}}}\hat{s}^{(1)}.
$$

Since $\sqrt{0.04}=0.2$:

$$
w^{(1)}=1-rac{0.01}{0.2}(0.2)=1-0.01=0.99.
$$

So:

$$
\boxed{w^{(1)}_{\text{Adam}}=0.99.}
$$

## Part 2 — AdamW

### Step 5 — Use the AdamW form

The sheet’s AdamW update is:

$$
w^{(1)}=w^{(0)}-
\eta
\left(
\frac{\hat{s}^{(1)}}{\sqrt{\hat{r}^{(1)}}}
+
\lambda w^{(0)}
\right).
$$

### Step 6 — Compute the adaptive gradient term

$$
\frac{\hat{s}^{(1)}}{\sqrt{\hat{r}^{(1)}}}
=
\frac{0.2}{0.2}=1.
$$

### Step 7 — Compute the weight-decay term

$$
\lambda w^{(0)}=0.1(1)=0.1.
$$

### Step 8 — Apply the AdamW update

$$
w^{(1)}=1-0.01(1+0.1)=1-0.011=0.989.
$$

So:

$$
\boxed{w^{(1)}_{\text{AdamW}}=0.989.}
$$

</details>

---

## Question C8 — Residual connection and dropout mask

A scalar residual network block computes

$$
z_1=F_1(x)+x.
$$

Let

$$
F_1(x)=2x+1,
\qquad
x=3.
$$

Then a second residual block computes

$$
y=F_2(z_1)+z_1,
$$

with

$$
F_2(z)=z-4.
$$

Compute $z_1$ and $y$.

Then apply a dropout mask to the hidden activation vector

$$
a=
\begin{bmatrix}
2\\-1\\0.5
\end{bmatrix},
\qquad
m=
\begin{bmatrix}
1\\0\\1
\end{bmatrix}.
$$

Use the sheet’s deletion-only description of dropout during training: hidden or input nodes may be deleted, but output nodes are not deleted.

<details>
<summary><strong>Worked solution</strong></summary>

## Part 1 — Residual connection

### Step 1 — Compute $F_1(x)$

$$
F_1(3)=2(3)+1=7.
$$

### Step 2 — Add the identity shortcut

$$
z_1=F_1(x)+x=7+3=10.
$$

### Step 3 — Compute $F_2(z_1)$

$$
F_2(10)=10-4=6.
$$

### Step 4 — Add the second shortcut

$$
y=F_2(z_1)+z_1=6+10=16.
$$

So:

$$
\boxed{z_1=10,
\qquad
y=16.}
$$

## Part 2 — Dropout mask

### Step 5 — Apply the mask element-wise

Using deletion-only dropout:

$$
a_{\text{drop}}=m\odot a.
$$

So:

$$
a_{\text{drop}}
=
\begin{bmatrix}
1\\0\\1
\end{bmatrix}
\odot
\begin{bmatrix}
2\\-1\\0.5
\end{bmatrix}
=
\begin{bmatrix}
2\\0\\0.5
\end{bmatrix}.
$$

### Step 6 — State the output-node rule

The sheet says dropout applies to hidden nodes and input nodes, but not output nodes. So this mask is valid for a hidden activation vector, not for deleting final output units.

Therefore:

$$
\boxed{
a_{\text{drop}}=
\begin{bmatrix}
2\\0\\0.5
\end{bmatrix}.}
$$

</details>

---

# Section D — Hard edge cases where methods disagree or break down

These are the highest-value drills. They test where a memorised formula can lead you into trouble.

---

## Question D1 — Finite differences can fail when $\epsilon$ is too large or too small

Let

$$
h(x)=x^2
$$

and estimate $h'(1)$ using forward finite differences:

$$
\frac{h(1+\epsilon)-h(1)}{\epsilon}.
$$

1. Compute the exact derivative.
2. Compute the finite-difference formula in exact arithmetic.
3. Evaluate it for $\epsilon=1$.
4. Explain what can happen in floating-point arithmetic if $\epsilon=10^{-16}$.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute the exact derivative

$$
h(x)=x^2.
$$

Therefore:

$$
h'(x)=2x.
$$

At $x=1$:

$$
h'(1)=2.
$$

### Step 2 — Compute the finite-difference expression exactly

$$
\frac{h(1+\epsilon)-h(1)}{\epsilon}
=
\frac{(1+\epsilon)^2-1^2}{\epsilon}.
$$

Expand:

$$
(1+\epsilon)^2=1+2\epsilon+\epsilon^2.
$$

So:

$$
\frac{(1+\epsilon)^2-1}{\epsilon}
=
\frac{2\epsilon+\epsilon^2}{\epsilon}
=2+
\epsilon.
$$

### Step 3 — Use $\epsilon=1$

$$
2+1=3.
$$

This is far from the exact derivative $2$, because $\epsilon$ is too large.

### Step 4 — Explain the tiny-$\epsilon$ problem

In exact arithmetic, $\epsilon=10^{-16}$ would give:

$$
2+10^{-16}.
$$

That is extremely close to $2$.

But in typical double-precision floating-point arithmetic, $1+10^{-16}$ may round back to $1$, because the perturbation is too small to be represented distinctly near 1.

Then a computer may effectively compute:

$$
\frac{h(1)-h(1)}{10^{-16}}=0.
$$

### Step 5 — State the lesson

Finite differences can disagree with exact or automatic differentiation for two opposite reasons:

- $\epsilon$ too large gives truncation error.
- $\epsilon$ too small gives rounding or cancellation error.

So:

$$
\boxed{\text{finite differences are useful checks, but they are not exact derivatives.}}
$$

</details>

---

## Question D2 — ReLU at zero: the derivative is not defined

Let

$$
r(x)=\operatorname{ReLU}(x)=\max(0,x).
$$

At $x=0$:

1. compute the right derivative;
2. compute the left derivative;
3. compute the central finite difference;
4. explain why AD implementations may choose a subgradient.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute the right derivative

The right derivative uses $\epsilon>0$:

$$
\frac{r(0+\epsilon)-r(0)}{\epsilon}.
$$

Since $r(\epsilon)=\epsilon$ and $r(0)=0$:

$$
\frac{\epsilon-0}{\epsilon}=1.
$$

So the right derivative is:

$$
1.
$$

### Step 2 — Compute the left derivative

The left derivative uses $\epsilon>0$ but approaches from the left:

$$
\frac{r(0)-r(0-\epsilon)}{\epsilon}.
$$

Since $r(-\epsilon)=0$:

$$
\frac{0-0}{\epsilon}=0.
$$

So the left derivative is:

$$
0.
$$

### Step 3 — Compute the central finite difference

The central finite difference is:

$$
\frac{r(0+\epsilon)-r(0-\epsilon)}{2\epsilon}.
$$

Substitute:

$$
\frac{\epsilon-0}{2\epsilon}=\frac{1}{2}.
$$

So the central finite-difference estimate is:

$$
0.5.
$$

### Step 4 — Explain the disagreement

The right derivative is $1$, the left derivative is $0$, and the central difference gives $0.5$. Since the one-sided derivatives are different, the true derivative at $0$ is undefined.

### Step 5 — Connect to AD and neural networks

Automatic differentiation systems usually define some convention at the kink, often choosing a subgradient such as $0$ or sometimes another valid convention.

That does not mean the mathematical derivative exists. It means the implementation has chosen a usable value for optimisation.

$$
\boxed{\operatorname{ReLU}'(0)\text{ is undefined mathematically, so methods can disagree at }0.}
$$

</details>

---

## Question D3 — Symbolic expression swell in the logistic map

The sheet uses the logistic map

$$
l_n=4l_{n-1}(1-l_{n-1}),
\qquad
l_1=x.
$$

1. Compute $l_2$ and $dl_2/dx$.
2. Write $l_3$ in factored form.
3. Compute $dl_3/dx$ using the recursive derivative form rather than fully expanding first.
4. Evaluate $dl_3/dx$ at $x=0.25$.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute $l_2$

Using

$$
l_n=4l_{n-1}(1-l_{n-1}),
$$

and $l_1=x$:

$$
l_2=4x(1-x).
$$

### Step 2 — Differentiate $l_2$

Use the product rule:

$$
\frac{dl_2}{dx}
=4\frac{d}{dx}\left[x(1-x)\right].
$$

Now:

$$
\frac{d}{dx}\left[x(1-x)\right]
=(1-x)+x(-1)=1-2x.
$$

So:

$$
\frac{dl_2}{dx}=4(1-2x).
$$

This is equivalent to the sheet’s form:

$$
4(1-x)-4x.
$$

### Step 3 — Write $l_3$ in factored form

$$
l_3=4l_2(1-l_2).
$$

Substitute $l_2=4x(1-x)$:

$$
l_3=4[4x(1-x)][1-4x(1-x)].
$$

So:

$$
\boxed{l_3=16x(1-x)[1-4x(1-x)].}
$$

### Step 4 — Derive the recursive derivative rule

For

$$
l_n=4l_{n-1}(1-l_{n-1}),
$$

differentiate with respect to $x$:

$$
\frac{dl_n}{dx}
=4\frac{dl_{n-1}}{dx}(1-l_{n-1})
+4l_{n-1}\left(-\frac{dl_{n-1}}{dx}\right).
$$

Factor out $4\frac{dl_{n-1}}{dx}$:

$$
\frac{dl_n}{dx}
=4\frac{dl_{n-1}}{dx}(1-2l_{n-1}).
$$

### Step 5 — Apply the recursive rule to $l_3$

$$
\frac{dl_3}{dx}
=4\frac{dl_2}{dx}(1-2l_2).
$$

Substitute:

$$
\frac{dl_2}{dx}=4(1-2x),
\qquad
l_2=4x(1-x).
$$

Therefore:

$$
\frac{dl_3}{dx}
=4[4(1-2x)][1-2(4x(1-x))].
$$

So:

$$
\boxed{
\frac{dl_3}{dx}=16(1-2x)[1-8x(1-x)].}
$$

### Step 6 — Evaluate at $x=0.25$

First:

$$
1-2x=1-2(0.25)=0.5.
$$

Next:

$$
x(1-x)=0.25(0.75)=0.1875.
$$

So:

$$
1-8x(1-x)=1-8(0.1875)=1-1.5=-0.5.
$$

Therefore:

$$
\frac{dl_3}{dx}=16(0.5)(-0.5)=-4.
$$

Thus:

$$
\boxed{\left.\frac{dl_3}{dx}\right|_{x=0.25}=-4.}
$$

### Step 7 — Explain the expression-swell point

A symbolic system might expand $l_3$ into a polynomial and then differentiate a long expression. The recursive derivative keeps shared subexpressions such as $l_2$, which is exactly why automatic differentiation avoids symbolic expression swell.

</details>

---

## Question D4 — Choosing forward mode or reverse mode

For each function type below, decide whether forward mode or reverse mode is usually preferred for computing the full Jacobian, and state the number of passes suggested by the sheet’s rule of thumb.

1. $f:\mathbb{R}^1\to\mathbb{R}^{1000}$
2. $f:\mathbb{R}^{1,000,000}\to\mathbb{R}^1$
3. $f:\mathbb{R}^{200}\to\mathbb{R}^{200}$

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Recall the forward-mode rule

Forward mode computes one Jacobian column per input variable.

So for

$$
f:\mathbb{R}^n\to\mathbb{R}^m,
$$

forward mode needs roughly:

$$
n
$$

passes for the full Jacobian.

### Step 2 — Recall the reverse-mode rule

Reverse mode computes derivatives of one chosen output with respect to all inputs.

So reverse mode needs roughly:

$$
m
$$

reverse passes for the full Jacobian.

For a scalar objective, $m=1$, this is why reverse mode is preferred in many machine-learning settings.

### Step 3 — Case 1: $\mathbb{R}^1\to\mathbb{R}^{1000}$

Here:

$$
n=1,
\qquad
m=1000.
$$

Forward mode needs $1$ pass.

Reverse mode would need about $1000$ output seeds to get the full Jacobian.

So:

$$
\boxed{\text{forward mode is preferred.}}
$$

### Step 4 — Case 2: $\mathbb{R}^{1,000,000}\to\mathbb{R}^1$

Here:

$$
n=1{,}000{,}000,
\qquad
m=1.
$$

Forward mode would need $1{,}000{,}000$ passes for the full gradient.

Reverse mode needs one reverse pass after the forward trace.

So:

$$
\boxed{\text{reverse mode is preferred.}}
$$

### Step 5 — Case 3: $\mathbb{R}^{200}\to\mathbb{R}^{200}$

Here:

$$
n=200,
\qquad
m=200.
$$

Forward mode needs about $200$ passes.

Reverse mode also needs about $200$ output seeds for the full Jacobian.

So neither has the obvious dimension-count advantage:

$$
\boxed{\text{the choice depends on memory, implementation, and what derivative product is actually needed.}}
$$

</details>

---

## Question D5 — Reverse-mode path-sum trap

Let

$$
y=x\cdot x+x.
$$

At $x=3$, compute $dy/dx$ using reverse-mode AD. Be careful: $x$ contributes through multiple paths, including both inputs of the multiplication.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Write a computational trace

Use:

$$
v_0=x,
$$

$$
v_1=v_0v_0,
$$

$$
v_2=v_1+v_0,
$$

$$
y=v_2.
$$

At $x=3$:

$$
v_0=3,
\qquad
v_1=9,
\qquad
v_2=12.
$$

### Step 2 — Start the reverse pass

Since $y=v_2$:

$$
\bar{v}_2=1.
$$

### Step 3 — Backpropagate through $v_2=v_1+v_0$

The local derivatives are:

$$
\frac{\partial v_2}{\partial v_1}=1,
\qquad
\frac{\partial v_2}{\partial v_0}=1.
$$

So one contribution is:

$$
\bar{v}_1=1.
$$

And there is a direct contribution to $v_0$:

$$
\bar{v}_0 \leftarrow 1.
$$

### Step 4 — Backpropagate through $v_1=v_0v_0$

This is the trap. The variable $v_0$ appears twice.

The derivative of $v_0v_0$ with respect to $v_0$ is:

$$
v_0+v_0=2v_0.
$$

At $v_0=3$:

$$
2v_0=6.
$$

So the multiplication contributes:

$$
\bar{v}_1(6)=1(6)=6.
$$

### Step 5 — Sum all contributions to $v_0$

There are two sources:

1. direct path from $v_2=v_1+v_0$, contribution $1$;
2. multiplication path through $v_1=v_0v_0$, contribution $6$.

Thus:

$$
\bar{v}_0=1+6=7.
$$

Therefore:

$$
\boxed{\frac{dy}{dx}=7.}
$$

### Step 6 — Check manually

Since

$$
y=x^2+x,
$$

we have:

$$
\frac{dy}{dx}=2x+1.
$$

At $x=3$:

$$
2(3)+1=7.
$$

The reverse-mode result is correct.

</details>

---

## Question D6 — Batch norm denominator edge case

The sheet’s text says batch normalisation uses a mini-batch of size $K$, but the parsed variance formula may show $N$. This can matter numerically.

For one hidden unit in a mini-batch, suppose the two pre-activations are:

$$
z_1=1,
\qquad
z_2=3.
$$

The mini-batch size is $K=2$, but the whole dataset size is $N=4$. Use $\gamma=1$, $\beta=0$, and $\delta=0$.

1. Compute batch norm using the mini-batch denominator $K=2$.
2. Compute what you would get if you mistakenly divided by $N=4$ in the variance.
3. Explain the disagreement.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Compute the mini-batch mean

The mean is computed over the mini-batch:

$$
\mu=\frac{1+3}{2}=2.
$$

### Step 2 — Compute the correct mini-batch variance using $K=2$

$$
\sigma^2
=
\frac{1}{2}\left((1-2)^2+(3-2)^2\right).
$$

So:

$$
\sigma^2=\frac{1}{2}(1+1)=1.
$$

Therefore:

$$
\sigma=1.
$$

### Step 3 — Normalise correctly

For $z_1=1$:

$$
\tilde{z}_1=\frac{1-2}{1}=-1.
$$

For $z_2=3$:

$$
\tilde{z}_2=\frac{3-2}{1}=1.
$$

So the correct mini-batch-normalised values are:

$$
\boxed{[-1,1].}
$$

### Step 4 — Compute the mistaken variance using $N=4$

If someone divides by $4$ instead of $2$:

$$
\sigma^2_{\text{wrong}}
=
\frac{1}{4}\left((1-2)^2+(3-2)^2\right)
=
\frac{2}{4}=0.5.
$$

Thus:

$$
\sigma_{\text{wrong}}=\sqrt{0.5}\approx0.7071.
$$

### Step 5 — Normalise using the wrong variance

For $z_1=1$:

$$
\tilde{z}_{1,\text{wrong}}
=
\frac{1-2}{0.7071}
\approx -1.414.
$$

For $z_2=3$:

$$
\tilde{z}_{2,\text{wrong}}
=
\frac{3-2}{0.7071}
\approx 1.414.
$$

So the mistaken values are:

$$
\boxed{[-1.414,1.414].}
$$

### Step 6 — Explain the disagreement

Batch normalisation is defined over the mini-batch. If the mini-batch contains $K$ examples, the natural denominator is $K$, not the full dataset size $N$. Using $N$ here shrinks the variance estimate and inflates the normalised values.

The sheet’s parsed formula should therefore be treated carefully when the notation appears inconsistent.

</details>

---

## Question D7 — Stride edge case: floor drops incomplete windows

An input image has size $6\times6$. A convolution uses filter size $3\times3$, no padding, and stride $S=2$.

1. Compute the output spatial shape.
2. Explain why the floor appears in the formula.
3. Recompute the shape if padding $P=1$ is added.

<details>
<summary><strong>Worked solution</strong></summary>

### Step 1 — Use the shape formula with no padding

The sheet gives:

$$
\left\lfloor
\frac{J+2P-M}{S}+1
\right\rfloor.
$$

Here:

$$
J=6,
\qquad
P=0,
\qquad
M=3,
\qquad
S=2.
$$

So:

$$
\left\lfloor
\frac{6+2(0)-3}{2}+1
\right\rfloor
=
\left\lfloor
\frac{3}{2}+1
\right\rfloor
=
\left\lfloor 2.5 \right\rfloor
=2.
$$

The same calculation applies in both spatial directions, so the output shape is:

$$
\boxed{2\times2.}
$$

### Step 2 — Explain the floor

With zero-indexed positions, the filter’s top-left corner can start at positions:

$$
0,2
$$

but not at $4$, because a $3\times3$ filter starting at position $4$ would need indices $4,5,6$, and index $6$ is outside a length-6 image.

So the incomplete final window is dropped.

### Step 3 — Recompute with padding $P=1$

Now:

$$
\left\lfloor
\frac{6+2(1)-3}{2}+1
\right\rfloor
=
\left\lfloor
\frac{5}{2}+1
\right\rfloor
=
\left\lfloor3.5\right\rfloor
=3.
$$

So with padding $P=1$, the output shape is:

$$
\boxed{3\times3.}
$$

### Step 4 — State the lesson

Stride does not guarantee every pixel participates symmetrically. If the filter does not land exactly at the end, the floor operation drops the incomplete positions.

</details>

---

## Question D8 — Adam with L2 regularisation versus AdamW

This question tests the sheet’s point that AdamW decouples weight decay from L2 regularisation.

Let

$$
w^{(0)}=10,
\qquad
g=0.2,
\qquad
\lambda=0.1,
\qquad
\eta=0.01.
$$

Use first-step Adam with bias correction and ignore the numerical stabiliser. Compare:

1. Adam where L2 regularisation is folded into the gradient, so $g_{\text{L2}}=g+\lambda w^{(0)}$;
2. AdamW, where the adaptive gradient step uses $g$, and weight decay adds $\lambda w^{(0)}$ separately.

Use the fact that for the first Adam step with a positive scalar gradient, the bias-corrected adaptive term becomes $g/|g|=1$.

<details>
<summary><strong>Worked solution</strong></summary>

## Part 1 — Adam with L2 folded into the gradient

### Step 1 — Compute the L2-regularised gradient

$$
g_{\text{L2}}=g+\lambda w^{(0)}.
$$

Substitute:

$$
g_{\text{L2}}=0.2+0.1(10)=0.2+1=1.2.
$$

### Step 2 — Compute the first-step adaptive Adam term

For the first Adam step with positive scalar gradient and bias correction:

$$
\frac{\hat{s}}{\sqrt{\hat{r}}}=\frac{g_{\text{L2}}}{|g_{\text{L2}}|}=1.
$$

### Step 3 — Update the parameter

$$
w^{(1)}_{\text{Adam+L2}}
=w^{(0)}-\eta(1)
=10-0.01=9.99.
$$

So:

$$
\boxed{w^{(1)}_{\text{Adam+L2}}=9.99.}
$$

## Part 2 — AdamW

### Step 4 — Compute the adaptive gradient term from the data gradient only

The data gradient is $g=0.2$, so the first-step adaptive term is:

$$
\frac{g}{|g|}=1.
$$

### Step 5 — Compute the decoupled weight decay term

$$
\lambda w^{(0)}=0.1(10)=1.
$$

### Step 6 — Apply AdamW

The AdamW-style update is:

$$
w^{(1)}_{\text{AdamW}}
=w^{(0)}-
\eta\left(
1+
\lambda w^{(0)}
\right).
$$

Substitute:

$$
w^{(1)}_{\text{AdamW}}
=10-0.01(1+1)
=10-0.02=9.98.
$$

So:

$$
\boxed{w^{(1)}_{\text{AdamW}}=9.98.}
$$

### Step 7 — Explain why the methods disagree

In Adam with L2 folded into the gradient, the adaptive denominator normalises the combined gradient. The weight-decay contribution is mixed into Adam’s adaptive scaling.

In AdamW, the data-gradient update and the weight-decay update are separate. That is why the first update here is larger under AdamW:

$$
9.98 \ne 9.99.
$$

This is exactly the reason AdamW is described as decoupling weight decay from L2 regularisation.

</details>

---

# End checklist

By the end of this bank, you should be able to:

- compute gradients manually and with finite differences;
- build evaluation traces;
- run forward-mode and reverse-mode AD by hand;
- build Jacobians and choose an AD mode based on dimensions;
- perform MLP forward and backward passes;
- compute normalisation and optimiser updates;
- compute convolution outputs and feature-map shapes;
- explain edge cases where methods disagree or fail.
