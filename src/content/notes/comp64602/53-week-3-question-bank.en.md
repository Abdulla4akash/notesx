---
subject: COMP64602
chapter: 53
title: "Week 3 — Question Bank"
language: en
---

# COMP64602 Week 3 — Worked Question Bank

**Lecture scope extracted from the uploaded Week 3 `.mht`:** semantic embedding, one-hot vectors, Word2Vec, contextual vs non-contextual embeddings, knowledge graph embedding with TransE/TransH/TransR, ontology embedding for $\mathcal{EL}^{++}$, ball and box concept embeddings, Box2EL losses and normal forms, negative sampling, embedding paradigms, and OWL2Vec\*.

**How to use this bank:** cover the solution after each question and try to write the step headers yourself before computing. The questions ramp from mechanical drills to multi-condition checks, then construction tasks, then edge cases where methods disagree or break down.

---

## Task types identified from the sheet

The sheet supports these examinable worked-task types:

1. Construct one-hot vectors and sentence matrices.
2. Decide whether a Word2Vec task is Skip-gram or CBOW, and identify input/output words.
3. Extract a learned word embedding from an input-to-hidden weight matrix.
4. Distinguish contextual and non-contextual embeddings in ambiguous-word cases.
5. Compute TransE scores with L1/L2-style distances and rank triples.
6. Generate corrupted negative triples and spot false-negative risk.
7. Compute TransE margin-ranking hinge loss.
8. Describe a TransE mini-batch training step.
9. Show why TransE can model relation composition.
10. Derive why TransE struggles with symmetric, 1-to-N, N-to-1, and N-to-N relations.
11. Apply TransH hyperplane projection.
12. Apply TransR relation-specific matrix projection.
13. Parse $\mathcal{EL}^{++}$ constructors and distinguish TBox/ABox axioms.
14. Convert ABox assertions into TBox axioms using nominals.
15. Check ball membership, ball subsumption, and the ball-intersection limitation.
16. Compute box center, offset, membership, inclusion, and intersection.
17. Compute box distance vectors and interpret positive/negative dimensions.
18. Compute Box2EL subsumption and disjointness losses.
19. Map axioms to Box2EL normal forms NF1–NF7 and choose the correct loss.
20. Write Box2EL bump-vector constraints for existential restrictions.
21. Generate and score Box2EL negative samples.
22. Choose between end-to-end, sequence-learning, and graph-propagation embedding paradigms.
23. Convert OWL existential axioms into RDF graph triples for OWL2Vec\*.
24. Build OWL2Vec\* structure, lexical, and combined documents.
25. Explain hard edge cases: incomplete KGs, false negatives, relation collapse, ball-vs-box closure, projection information loss, and ambiguous text embeddings.

---

# Section A — Mechanical / single-step drills

## Q1. One-hot sentence matrix using the lecture vocabulary

Vocabulary order:


$$

(\text{cat},\text{mat},\text{on},\text{sat},\text{the})

$$


Construct the one-hot matrix for:


$$

\text{the cat sat on the mat}

$$


### Solution

**Step 1 — Fix the vocabulary order.**

The dimensions are:

1. cat  
2. mat  
3. on  
4. sat  
5. the

So each token is represented by a length-5 vector.

**Step 2 — Write each word as a one-hot vector.**


$$

\text{cat}=[1,0,0,0,0]

$$



$$

\text{mat}=[0,1,0,0,0]

$$



$$

\text{on}=[0,0,1,0,0]

$$



$$

\text{sat}=[0,0,0,1,0]

$$



$$

\text{the}=[0,0,0,0,1]

$$


**Step 3 — Stack vectors in sentence order.**

The sentence has 6 tokens:


$$

\text{the},\text{cat},\text{sat},\text{on},\text{the},\text{mat}

$$


Therefore:


$$

\begin{bmatrix}
0&0&0&0&1\\
1&0&0&0&0\\
0&0&0&1&0\\
0&0&1&0&0\\
0&0&0&0&1\\
0&1&0&0&0
\end{bmatrix}

$$


**Step 4 — State the size.**

There are 6 tokens and 5 vocabulary items, so the matrix is:


$$

6\times 5

$$


---

## Q2. One-hot similarity and sparsity

Vocabulary order:


$$

(\text{cat},\text{dog},\text{animal})

$$


Compute the dot product and cosine similarity between the one-hot vectors for `cat` and `dog`. What limitation does this show?

### Solution

**Step 1 — Write the vectors.**


$$

\text{cat}=[1,0,0]

$$



$$

\text{dog}=[0,1,0]

$$


**Step 2 — Compute the dot product.**


$$

\text{cat}\cdot\text{dog}
=1\cdot0+0\cdot1+0\cdot0=0

$$


**Step 3 — Compute the vector norms.**


$$

\|\text{cat}\|=1,\qquad \|\text{dog}\|=1

$$


**Step 4 — Compute cosine similarity.**


$$

\cos(\text{cat},\text{dog})
=
\frac{\text{cat}\cdot\text{dog}}{\|\text{cat}\|\|\text{dog}\|}
=
\frac{0}{1\cdot1}=0

$$


**Step 5 — Interpret.**

The vectors are orthogonal even though cats and dogs are semantically related. This shows the lecture’s limitation of one-hot vectors: they are sparse and do not directly encode semantic similarity.

---

## Q3. Skip-gram or CBOW?

A sentence window is:


$$

w_{t-2},\;w_{t-1},\;w_t,\;w_{t+1},\;w_{t+2}

$$


The model receives $w_t$ as input and predicts the surrounding words. Is this Skip-gram or CBOW? List the input and target outputs.

### Solution

**Step 1 — Ask the discriminator question.**

Is the model predicting context from the middle word, or predicting the middle word from context?

**Step 2 — Identify the input.**

The input is the middle word:


$$

w_t

$$


**Step 3 — Identify the outputs.**

The outputs are the surrounding context words:


$$

w_{t-2},w_{t-1},w_{t+1},w_{t+2}

$$


**Step 4 — Decide the model type.**

Middle word $\rightarrow$ surrounding words is **Continuous Skip-gram**.

---

## Q4. CBOW input/output direction

A model receives the context words


$$

w_{t-1},w_{t+1}

$$


and predicts $w_t$. Is this Skip-gram or CBOW?

### Solution

**Step 1 — Ask the discriminator question.**

Is the model using surrounding words to predict the middle word?

**Step 2 — Identify the input side.**

The input is the context:


$$

w_{t-1},w_{t+1}

$$


**Step 3 — Identify the target.**

The target is the middle word:


$$

w_t

$$


**Step 4 — Decide the model type.**

Surrounding words $\rightarrow$ middle word is **Continuous Bag of Words**, or **CBOW**.

---

## Q5. Extracting a Word2Vec embedding from a weight matrix

Vocabulary order:


$$

(w_1,w_2,w_3,w_4)

$$


The input-to-hidden weight matrix is:


$$

W=
\begin{bmatrix}
0.1&0.8\\
-0.4&0.3\\
0.7&-0.2\\
0.0&0.5
\end{bmatrix}

$$


Using the lecture description that the embedding is the hidden-layer output from the one-hot input times the weight matrix, find the embedding of $w_3$.

### Solution

**Step 1 — Write the one-hot vector for $w_3$.**

Because $w_3$ is third in the vocabulary:


$$

x_{w_3}=[0,0,1,0]

$$


**Step 2 — Multiply by the input-to-hidden matrix.**


$$

x_{w_3}W=[0,0,1,0]
\begin{bmatrix}
0.1&0.8\\
-0.4&0.3\\
0.7&-0.2\\
0.0&0.5
\end{bmatrix}

$$


This selects the third row of $W$:


$$

[0.7,-0.2]

$$


**Step 3 — State the embedding.**


$$

V(w_3)=[0.7,-0.2]

$$


---

## Q6. Contextual or non-contextual embedding?

Consider the sentence:

> the bank robber was seen on the river bank

A model assigns exactly the same vector to both occurrences of `bank`. Is this contextual or non-contextual?

### Solution

**Step 1 — Ask the discriminator question.**

Does the vector depend on surrounding words?

**Step 2 — Compare the two occurrences.**

The first `bank` is connected to robbery/finance. The second `bank` is connected to river/geography.

**Step 3 — Check whether the vectors differ.**

The model assigns:


$$

V(\text{bank})=V(\text{bank})

$$


for both occurrences.

**Step 4 — Decide the embedding type.**

This is **non-contextual**, like Word2Vec, because the word has one vector regardless of context.

---

## Q7. TransE score for the lecture’s CapitalOf example

Use the lecture triple:


$$

\langle \text{London},\text{CapitalOf},\text{UK}\rangle

$$


Suppose:


$$

\mathbf{London}=(1,2),\quad \mathbf{CapitalOf}=(2,-1),\quad \mathbf{UK}=(3,1)

$$


Compute the TransE L1 score.

### Solution

**Step 1 — Write the TransE scoring idea.**

TransE wants:


$$

\mathbf{h}+\mathbf{r}\approx\mathbf{t}

$$


The L1 score is:


$$

f(h,r,t)=\|\mathbf{h}+\mathbf{r}-\mathbf{t}\|_1

$$


**Step 2 — Add head and relation.**


$$

\mathbf{London}+\mathbf{CapitalOf}
=(1,2)+(2,-1)=(3,1)

$$


**Step 3 — Subtract the tail.**


$$

(3,1)-(3,1)=(0,0)

$$


**Step 4 — Compute L1 norm.**


$$

|0|+|0|=0

$$


**Step 5 — Interpret.**

The score is $0$, so this is a perfect TransE fit for the triple.

---

## Q8. Ranking candidate tails with TransE

For a triple pattern:


$$

\langle h,r,?\rangle

$$


suppose:


$$

\mathbf{h}=(1,1),\quad \mathbf{r}=(2,0)

$$


Candidate tails:


$$

\mathbf{t_1}=(3,1),\quad \mathbf{t_2}=(4,1),\quad \mathbf{t_3}=(3,4)

$$


Rank the candidates from most likely to least likely using L1 TransE score.

### Solution

**Step 1 — Compute the translated head.**


$$

\mathbf{h}+\mathbf{r}=(1,1)+(2,0)=(3,1)

$$


**Step 2 — Score candidate $t_1$.**


$$

f(h,r,t_1)=\|(3,1)-(3,1)\|_1=0

$$


**Step 3 — Score candidate $t_2$.**


$$

f(h,r,t_2)=\|(3,1)-(4,1)\|_1=|-1|+|0|=1

$$


**Step 4 — Score candidate $t_3$.**


$$

f(h,r,t_3)=\|(3,1)-(3,4)\|_1=|0|+|-3|=3

$$


**Step 5 — Rank by smaller score.**

Most likely:


$$

t_1 \;>\; t_2 \;>\; t_3

$$


because their scores are:


$$

0,1,3

$$


---

## Q9. Negative sampling for a TransE triple

Positive triple:


$$

\langle \text{London},\text{CapitalOf},\text{UK}\rangle

$$


Entity set:


$$

\{\text{London},\text{Manchester},\text{UK},\text{France}\}

$$


Generate one head-corrupted and one tail-corrupted negative sample.

### Solution

**Step 1 — Recall the negative-sampling method.**

Given a positive triple:


$$

\langle h,r,t\rangle

$$


replace either $h$ or $t$ with another entity.

**Step 2 — Corrupt the head.**

Replace London with Manchester:


$$

\langle \text{Manchester},\text{CapitalOf},\text{UK}\rangle

$$


**Step 3 — Corrupt the tail.**

Replace UK with France:


$$

\langle \text{London},\text{CapitalOf},\text{France}\rangle

$$


**Step 4 — State the caveat.**

These are treated as negative for training, but if the KG is incomplete, a corrupted triple could accidentally be true. That is the false-negative problem.

---

## Q10. TransE hinge loss for one positive-negative pair

Margin:


$$

\gamma=1

$$


Positive triple score:


$$

f(h,r,t)=0.5

$$


Negative triple score:


$$

f(h',r,t')=0.8

$$


Compute the hinge loss:


$$

[\gamma+f(h,r,t)-f(h',r,t')]_+

$$


### Solution

**Step 1 — Write the hinge expression.**


$$

[\gamma+f_{pos}-f_{neg}]_+

$$


**Step 2 — Substitute values.**


$$

[1+0.5-0.8]_+

$$


**Step 3 — Simplify inside the bracket.**


$$

1+0.5-0.8=0.7

$$


**Step 4 — Apply positive part.**


$$

[0.7]_+=\max(0,0.7)=0.7

$$


**Step 5 — Interpret.**

The model is penalized because the negative triple is not far enough away from the positive triple by margin $\gamma$.

---

## Q11. Zero hinge loss case

Margin:


$$

\gamma=1

$$


Positive score:


$$

f_{pos}=0.4

$$


Negative score:


$$

f_{neg}=2.0

$$


Compute the TransE hinge loss.

### Solution

**Step 1 — Write the loss term.**


$$

[\gamma+f_{pos}-f_{neg}]_+

$$


**Step 2 — Substitute.**


$$

[1+0.4-2.0]_+

$$


**Step 3 — Simplify.**


$$

1+0.4-2.0=-0.6

$$


**Step 4 — Apply positive part.**


$$

[-0.6]_+=\max(0,-0.6)=0

$$


**Step 5 — Interpret.**

The negative triple is already sufficiently worse than the positive triple, so this pair contributes no loss.

---

## Q12. Recognising $\mathcal{EL}^{++}$ constructors

For the axiom:


$$

\text{Child}\sqsubseteq \exists \text{hasParent}.\text{Father}

$$


identify the constructor on the right-hand side.

### Solution

**Step 1 — Recall the relevant $\mathcal{EL}^{++}$ constructors.**

The sheet lists:


$$

\bot\mid\top\mid A\mid C\sqcap D\mid \exists r.C\mid \{a\}

$$


**Step 2 — Inspect the right-hand side.**

The right-hand side is:


$$

\exists \text{hasParent}.\text{Father}

$$


**Step 3 — Match it to the constructor pattern.**

This matches:


$$

\exists r.C

$$


where:


$$

r=\text{hasParent},\qquad C=\text{Father}

$$


**Step 4 — Interpret.**

Every instance of `Child` has some `hasParent` relation to an instance of `Father`.

---

## Q13. Convert ABox assertions into TBox axioms

Convert the following ABox assertions into TBox axioms using nominals:


$$

\text{Father}(\text{Alex})

$$



$$

\text{hasParent}(\text{Bob},\text{Alex})

$$


### Solution

**Step 1 — Recall the conversion rule for concept assertions.**


$$

C(a)\quad\leadsto\quad \{a\}\sqsubseteq C

$$


So:


$$

\text{Father}(\text{Alex})\quad\leadsto\quad \{\text{Alex}\}\sqsubseteq \text{Father}

$$


**Step 2 — Recall the conversion rule for role assertions.**


$$

r(a,b)\quad\leadsto\quad \{a\}\sqsubseteq \exists r.\{b\}

$$


So:


$$

\text{hasParent}(\text{Bob},\text{Alex})
\quad\leadsto\quad
\{\text{Bob}\}\sqsubseteq \exists \text{hasParent}.\{\text{Alex}\}

$$


**Step 3 — State the converted TBox-style axioms.**


$$

\{\text{Alex}\}\sqsubseteq \text{Father}

$$



$$

\{\text{Bob}\}\sqsubseteq \exists \text{hasParent}.\{\text{Alex}\}

$$


---

## Q14. Ball membership and ball subsumption

Concept $C$ is represented by a ball with center:


$$

\mathbf{c}_C=(0,0)

$$


and radius:


$$

r_C=3

$$


Individual $a$ is represented by:


$$

\mathbf{x}_a=(2,1)

$$


Does $a$ belong to $C$?

### Solution

**Step 1 — Recall the membership rule.**

An individual belongs to a concept if its point lies inside the concept ball:


$$

\|\mathbf{x}_a-\mathbf{c}_C\|\leq r_C

$$


**Step 2 — Compute the distance from the center.**


$$

\|(2,1)-(0,0)\|=\sqrt{2^2+1^2}=\sqrt{5}

$$


**Step 3 — Compare with the radius.**


$$

\sqrt{5}\approx2.236\leq3

$$


**Step 4 — Conclude.**

Yes. The individual point lies inside the ball, so:


$$

a\in C

$$


---

## Q15. Box center, offset, and point membership

Concept $C$ is represented by the box:


$$

\mathbf{l}_C=(1,2),\qquad \mathbf{u}_C=(5,6)

$$


Compute its center and offset. Then check whether point:


$$

\mathbf{x}=(3,7)

$$


belongs to the box.

### Solution

**Step 1 — Recall the box definition.**


$$

\text{Box}(C)=\{\mathbf{x}\mid \mathbf{l}_C\leq \mathbf{x}\leq \mathbf{u}_C\}

$$


with element-wise inequalities.

**Step 2 — Compute the center.**


$$

\mathbf{c}(C)=\frac{\mathbf{l}_C+\mathbf{u}_C}{2}
=\frac{(1,2)+(5,6)}{2}
=(3,4)

$$


**Step 3 — Compute the offset.**


$$

\mathbf{o}(C)=\frac{\mathbf{u}_C-\mathbf{l}_C}{2}
=\frac{(5,6)-(1,2)}{2}
=(2,2)

$$


**Step 4 — Check point membership dimension by dimension.**

For $x=(3,7)$:

- first dimension: $1\leq3\leq5$, yes;
- second dimension: $2\leq7\leq6$, no.

**Step 5 — Conclude.**

The point is not inside the box because the second coordinate is outside the upper bound.

---

## Q16. Box intersection

Let:


$$

A=[0,4]\times[1,5]

$$



$$

B=[2,6]\times[0,3]

$$


Compute $A\cap B$.

### Solution

**Step 1 — Recall the box-intersection rule.**

For axis-aligned boxes:


$$

\mathbf{l}_{A\cap B}=\max(\mathbf{l}_A,\mathbf{l}_B)

$$



$$

\mathbf{u}_{A\cap B}=\min(\mathbf{u}_A,\mathbf{u}_B)

$$


where max and min are element-wise.

**Step 2 — Write lower and upper corners.**


$$

\mathbf{l}_A=(0,1),\quad \mathbf{u}_A=(4,5)

$$



$$

\mathbf{l}_B=(2,0),\quad \mathbf{u}_B=(6,3)

$$


**Step 3 — Compute the intersection lower corner.**


$$

\max((0,1),(2,0))=(2,1)

$$


**Step 4 — Compute the intersection upper corner.**


$$

\min((4,5),(6,3))=(4,3)

$$


**Step 5 — State the intersection box.**


$$

A\cap B=[2,4]\times[1,3]

$$


Because lower $\leq$ upper in both dimensions, the intersection is non-empty.

---

## Q17. OWL existential axiom to RDF mapping

Convert the existential axiom:


$$

C\sqsubseteq \exists r.D

$$


into the W3C-style RDF graph pattern used in the OWL2Vec\* part of the lecture.

### Solution

**Step 1 — Identify the subclass.**

The subclass is:


$$

C

$$


**Step 2 — Identify the existential restriction.**

The superclass is not directly $D$. It is the restriction:


$$

\exists r.D

$$


**Step 3 — Introduce a blank node for the restriction.**

Call it:


$$

\_:x

$$


**Step 4 — Write the RDF triples.**


$$

\langle C,\text{rdfs:subClassOf},\_:x\rangle

$$



$$

\langle \_:x,\text{rdf:type},\text{owl:Restriction}\rangle

$$



$$

\langle \_:x,\text{owl:onProperty},r\rangle

$$



$$

\langle \_:x,\text{owl:someValuesFrom},D\rangle

$$


**Step 5 — Interpret.**

The blank node preserves the fact that the superclass is an existential restriction using property $r$ and filler $D$, rather than a plain subclass link to $D$.

---

# Section B — Multi-condition checks

## Q18. Build a TransE mini-batch loss expression

Training set batch:


$$

S_{batch}=\{(A,r,B),(B,s,C)\}

$$


Suppose the sampled corrupted triples are:


$$

(A,r,D),\qquad (D,s,C)

$$


Write the positive-negative pair batch $T_{batch}$ and the corresponding margin-ranking loss expression.

### Solution

**Step 1 — Recall the TransE training-batch construction.**

For each positive triple, sample a corrupted negative triple and pair them.

**Step 2 — Pair the first positive triple with its negative.**


$$

((A,r,B),(A,r,D))

$$


**Step 3 — Pair the second positive triple with its negative.**


$$

((B,s,C),(D,s,C))

$$


**Step 4 — Write $T_{batch}$.**


$$

T_{batch}=\{((A,r,B),(A,r,D)),((B,s,C),(D,s,C))\}

$$


**Step 5 — Write the loss expression.**


$$

L=
[\gamma+f(A,r,B)-f(A,r,D)]_+
+
[\gamma+f(B,s,C)-f(D,s,C)]_+

$$


**Step 6 — State what optimization does.**

Gradient descent updates embeddings so that positive triples get lower scores and corrupted triples get higher scores.

---

## Q19. Total TransE hinge loss over two pairs

Let:


$$

\gamma=2

$$


Pair 1:


$$

f_{pos}=0.6,\qquad f_{neg}=1.0

$$


Pair 2:


$$

f_{pos}=0.4,\qquad f_{neg}=3.0

$$


Compute total loss.

### Solution

**Step 1 — Write the loss for each pair.**


$$

L_i=[\gamma+f_{pos}^{(i)}-f_{neg}^{(i)}]_+

$$


**Step 2 — Compute Pair 1.**


$$

L_1=[2+0.6-1.0]_+=[1.6]_+=1.6

$$


**Step 3 — Compute Pair 2.**


$$

L_2=[2+0.4-3.0]_+=[-0.6]_+=0

$$


**Step 4 — Sum.**


$$

L=L_1+L_2=1.6+0=1.6

$$


**Step 5 — Interpret.**

Only Pair 1 contributes loss. Pair 2 already separates the positive and negative triples by more than the margin.

---

## Q20. Relation composition in TransE

Suppose:


$$

\mathbf{r}_1=(1,2),\qquad \mathbf{r}_2=(-2,3)

$$


A candidate composed relation has vector:


$$

\mathbf{r}_3=(-1,5)

$$


Check whether $r_3$ can represent $r_1\circ r_2$ in TransE.

### Solution

**Step 1 — Recall the TransE composition condition.**

If:


$$

\mathbf{x}+\mathbf{r}_1=\mathbf{y}

$$


and:


$$

\mathbf{y}+\mathbf{r}_2=\mathbf{z}

$$


then:


$$

\mathbf{x}+\mathbf{r}_1+\mathbf{r}_2=\mathbf{z}

$$


So the composed relation should be:


$$

\mathbf{r}_3=\mathbf{r}_1+\mathbf{r}_2

$$


**Step 2 — Add $\mathbf{r}_1$ and $\mathbf{r}_2$.**


$$

(1,2)+(-2,3)=(-1,5)

$$


**Step 3 — Compare with the candidate.**

The candidate is:


$$

(-1,5)

$$


**Step 4 — Conclude.**

Yes. The candidate vector exactly equals $\mathbf{r}_1+\mathbf{r}_2$, so it can represent the composed relation in TransE.

---

## Q21. Why symmetric relations break TransE

A symmetric relation has both:


$$

\langle h,r,t\rangle

$$


and:


$$

\langle t,r,h\rangle

$$


Show why perfect TransE scoring forces a contradiction when $h\neq t$.

### Solution

**Step 1 — Write the perfect TransE condition for the first triple.**


$$

\mathbf{h}+\mathbf{r}=\mathbf{t}

$$


**Step 2 — Write the perfect TransE condition for the reverse triple.**


$$

\mathbf{t}+\mathbf{r}=\mathbf{h}

$$


**Step 3 — Substitute the first equation into the second.**

Since:


$$

\mathbf{t}=\mathbf{h}+\mathbf{r}

$$


then:


$$

(\mathbf{h}+\mathbf{r})+\mathbf{r}=\mathbf{h}

$$


**Step 4 — Simplify.**


$$

\mathbf{h}+2\mathbf{r}=\mathbf{h}

$$



$$

2\mathbf{r}=0

$$



$$

\mathbf{r}=0

$$


**Step 5 — Substitute back.**

If $\mathbf{r}=0$, then:


$$

\mathbf{h}=\mathbf{t}

$$


**Step 6 — State the contradiction.**

A symmetric relation between distinct entities requires $h\neq t$, but perfect TransE forces $\mathbf{h}=\mathbf{t}$. Therefore TransE cannot properly model symmetric relations while keeping the entities distinct.

---

## Q22. Why 1-to-N relations break TransE

A 1-to-N relation has both:


$$

\langle h,r,t\rangle

$$


and:


$$

\langle h,r,t'\rangle

$$


where $t\neq t'$. Show the TransE contradiction.

### Solution

**Step 1 — Write the perfect TransE condition for the first triple.**


$$

\mathbf{h}+\mathbf{r}=\mathbf{t}

$$


**Step 2 — Write the perfect TransE condition for the second triple.**


$$

\mathbf{h}+\mathbf{r}=\mathbf{t'}

$$


**Step 3 — Compare the right-hand sides.**

Both are equal to the same vector $\mathbf{h}+\mathbf{r}$, so:


$$

\mathbf{t}=\mathbf{t'}

$$


**Step 4 — State the contradiction.**

The KG says $t$ and $t'$ are different tail entities, but perfect TransE forces their embeddings to collapse to the same point.

**Step 5 — Generalize.**

This is why the sheet says TransE also struggles with N-to-1 and N-to-N relations: one global translation vector is too rigid.

---

## Q23. TransH projection calculation

For relation $r$, suppose the hyperplane normal vector is:


$$

\mathbf{w}_r=(0,1)

$$


and the relation translation vector on the hyperplane is:


$$

\mathbf{d}_r=(3,0)

$$


Given:


$$

\mathbf{h}=(3,4),\qquad \mathbf{t}=(6,7)

$$


compute $\mathbf{h}_\perp$, $\mathbf{t}_\perp$, and check the TransH translation score informally.

### Solution

**Step 1 — Recall the TransH projection formula.**

For a unit normal vector:


$$

\mathbf{h}_{\perp}=\mathbf{h}-\mathbf{w}_r^T\mathbf{h}\mathbf{w}_r

$$



$$

\mathbf{t}_{\perp}=\mathbf{t}-\mathbf{w}_r^T\mathbf{t}\mathbf{w}_r

$$


**Step 2 — Project the head.**


$$

\mathbf{w}_r^T\mathbf{h}=(0,1)\cdot(3,4)=4

$$



$$

\mathbf{h}_\perp=(3,4)-4(0,1)=(3,4)-(0,4)=(3,0)

$$


**Step 3 — Project the tail.**


$$

\mathbf{w}_r^T\mathbf{t}=(0,1)\cdot(6,7)=7

$$



$$

\mathbf{t}_\perp=(6,7)-7(0,1)=(6,7)-(0,7)=(6,0)

$$


**Step 4 — Apply relation translation on the hyperplane.**


$$

\mathbf{h}_\perp+\mathbf{d}_r=(3,0)+(3,0)=(6,0)

$$


**Step 5 — Compare with projected tail.**


$$

\mathbf{t}_\perp=(6,0)

$$


So:


$$

\mathbf{h}_\perp+\mathbf{d}_r=\mathbf{t}_\perp

$$


**Step 6 — Interpret.**

The triple fits perfectly after relation-specific projection. This illustrates why TransH can represent relation-specific behaviour better than plain TransE.

---

## Q24. TransR projection calculation

Suppose a relation $r$ uses projection matrix:


$$

\mathbf{M}_r=
\begin{bmatrix}
1&0\\
0&0
\end{bmatrix}

$$


Given:


$$

\mathbf{h}=(2,5),\quad \mathbf{t}=(5,1),\quad \mathbf{r}=(3,0)

$$


Compute:


$$

\mathbf{h}_r=\mathbf{h}\mathbf{M}_r,
\qquad
\mathbf{t}_r=\mathbf{t}\mathbf{M}_r

$$


and the TransR score vector $\mathbf{h}_r+\mathbf{r}-\mathbf{t}_r$.

### Solution

**Step 1 — Recall the TransR idea.**

Entities are projected into the relation-specific space before translation:


$$

\mathbf{h}_r=\mathbf{h}\mathbf{M}_r,
\qquad
\mathbf{t}_r=\mathbf{t}\mathbf{M}_r

$$


**Step 2 — Project the head.**


$$

(2,5)
\begin{bmatrix}
1&0\\
0&0
\end{bmatrix}
=(2,0)

$$


**Step 3 — Project the tail.**


$$

(5,1)
\begin{bmatrix}
1&0\\
0&0
\end{bmatrix}
=(5,0)

$$


**Step 4 — Compute the score vector.**


$$

\mathbf{h}_r+\mathbf{r}-\mathbf{t}_r
=(2,0)+(3,0)-(5,0)=(0,0)

$$


**Step 5 — Interpret.**

The score vector is zero, so the triple fits perfectly in the relation-specific space.

---

## Q25. Box distance vector

Boxes $A$ and $B$ have:


$$

\mathbf{c}(A)=(1,1),\quad \mathbf{o}(A)=(1,2)

$$



$$

\mathbf{c}(B)=(4,2),\quad \mathbf{o}(B)=(1,1)

$$


Compute:


$$

\mathbf{d}(A,B)=|\mathbf{c}(A)-\mathbf{c}(B)|-\mathbf{o}(A)-\mathbf{o}(B)

$$


### Solution

**Step 1 — Compute center difference.**


$$

|\mathbf{c}(A)-\mathbf{c}(B)|=|(1,1)-(4,2)|=|(-3,-1)|=(3,1)

$$


**Step 2 — Subtract offsets.**


$$

(3,1)-(1,2)-(1,1)

$$


**Step 3 — Compute dimension by dimension.**


$$

(3-1-1,\;1-2-1)=(1,-2)

$$


**Step 4 — Interpret.**


$$

\mathbf{d}(A,B)=(1,-2)

$$


The first dimension is positive, so the boxes have a gap in that dimension. The second dimension is negative, so they overlap in that dimension.

---

## Q26. Box2EL subsumption loss in 1D

Use the non-empty-target case:


$$

\mathcal{L}_{\sqsubseteq}(A,B)=\left\|\max\{0,\mathbf{d}(A,B)+2\mathbf{o}(A)-\gamma\}\right\|

$$


In 1D:


$$

\mathbf{c}(A)=2,
\quad
\mathbf{o}(A)=1,
\quad
\mathbf{c}(B)=2.5,
\quad
\mathbf{o}(B)=3,
\quad
\gamma=0.5

$$


Compute the loss.

### Solution

**Step 1 — Use the simplified expression from the sheet.**

The sheet gives:


$$

\mathbf{d}(A,B)+2\mathbf{o}(A)
=|\mathbf{c}(A)-\mathbf{c}(B)|+\mathbf{o}(A)-\mathbf{o}(B)

$$


So the inside term is:


$$

|c_A-c_B|+o_A-o_B-\gamma

$$


**Step 2 — Substitute values.**


$$

|2-2.5|+1-3-0.5

$$


**Step 3 — Compute.**


$$

0.5+1-3-0.5=-2

$$


**Step 4 — Apply max.**


$$

\max(0,-2)=0

$$


**Step 5 — State the loss.**


$$

\mathcal{L}_{\sqsubseteq}(A,B)=0

$$


**Step 6 — Interpret.**

The loss is zero, so the model treats $A\sqsubseteq B$ as geometrically satisfied.

---

## Q27. Box2EL subsumption violation in 1D

Use:


$$

\mathbf{c}(A)=6,
\quad
\mathbf{o}(A)=1,
\quad
\mathbf{c}(B)=2.5,
\quad
\mathbf{o}(B)=3,
\quad
\gamma=0.5

$$


Compute the same subsumption loss.

### Solution

**Step 1 — Write the inside term.**


$$

|c_A-c_B|+o_A-o_B-\gamma

$$


**Step 2 — Substitute.**


$$

|6-2.5|+1-3-0.5

$$


**Step 3 — Compute.**


$$

3.5+1-3-0.5=1

$$


**Step 4 — Apply max.**


$$

\max(0,1)=1

$$


**Step 5 — State the loss.**


$$

\mathcal{L}_{\sqsubseteq}(A,B)=1

$$


**Step 6 — Interpret.**

The positive loss means $A$ is not safely included in $B$. Training would push the boxes toward satisfying inclusion.

---

## Q28. Box2EL disjointness loss in 1D

For NF5:


$$

C\sqcap D\sqsubseteq\bot

$$


use the sheet’s loss form:


$$

\mathcal{L}_5(C,D)=\left\|\max\{0,-(\mathbf{d}(C,D)+\gamma)\}\right\|

$$


Let:


$$

C=[0,2],\qquad D=[1,3],\qquad \gamma=0.2

$$


Compute the loss.

### Solution

**Step 1 — Compute centers and offsets.**

For $C=[0,2]$:


$$

c_C=1,
\quad
 o_C=1

$$


For $D=[1,3]$:


$$

c_D=2,
\quad
 o_D=1

$$


**Step 2 — Compute box distance.**


$$

d(C,D)=|c_C-c_D|-o_C-o_D

$$



$$

=|1-2|-1-1=1-2=-1

$$


**Step 3 — Add the margin.**


$$

d(C,D)+\gamma=-1+0.2=-0.8

$$


**Step 4 — Negate and apply max.**


$$

-(d+\gamma)=0.8

$$



$$

\max(0,0.8)=0.8

$$


**Step 5 — Interpret.**

The loss is positive because the boxes overlap, but NF5 wants their intersection to be empty.

---

## Q29. Identify the Box2EL normal form and loss

For each axiom, identify the normal form NF1–NF7 and the corresponding loss idea.

1. $C\sqsubseteq D$  
2. $C\sqcap D\sqsubseteq E$  
3. $C\sqsubseteq \exists r.D$  
4. $\exists r.C\sqsubseteq D$  
5. $C\sqcap D\sqsubseteq\bot$  
6. $r\sqsubseteq s$  
7. $r_1\circ r_2\sqsubseteq s$

### Solution

**Step 1 — Match plain concept inclusion.**


$$

C\sqsubseteq D

$$


is **NF1**, with loss:


$$

\mathcal{L}_1(C,D)=\mathcal{L}_{\sqsubseteq}(\text{Box}(C),\text{Box}(D))

$$


**Step 2 — Match conjunction on the left.**


$$

C\sqcap D\sqsubseteq E

$$


is **NF2**, with loss:


$$

\mathcal{L}_2(C,D,E)=\mathcal{L}_{\sqsubseteq}(\text{Box}(C)\cap\text{Box}(D),\text{Box}(E))

$$


**Step 3 — Match existential restriction on the right.**


$$

C\sqsubseteq\exists r.D

$$


is **NF3**, with the bump-vector head/tail loss.

**Step 4 — Match existential restriction on the left.**


$$

\exists r.C\sqsubseteq D

$$


is **NF4**, with loss:


$$

\mathcal{L}_4(r,C,D)=\mathcal{L}_{\sqsubseteq}(\text{Head}(r)-\text{Bump}(C),\text{Box}(D))

$$


**Step 5 — Match disjointness.**


$$

C\sqcap D\sqsubseteq\bot

$$


is **NF5**, with the disjointness / empty-intersection loss.

**Step 6 — Match role subsumption.**


$$

r\sqsubseteq s

$$


is **NF6**, requiring both:


$$

\text{Head}(r)\sqsubseteq \text{Head}(s)

$$


and:


$$

\text{Tail}(r)\sqsubseteq \text{Tail}(s)

$$


**Step 7 — Match role composition.**


$$

r_1\circ r_2\sqsubseteq s

$$


is **NF7**, requiring:


$$

\text{Head}(r_1)\sqsubseteq\text{Head}(s)

$$


and:


$$

\text{Tail}(r_2)\sqsubseteq\text{Tail}(s)

$$


---

## Q30. Box2EL bump constraints for the lecture family ontology

Use the lecture axiom:


$$

\text{Child}\sqsubseteq \exists\text{hasParent}.\text{Father}

$$


Write the two Box2EL inclusion constraints used for this NF3 axiom.

### Solution

**Step 1 — Identify the NF3 pattern.**

NF3 has form:


$$

C\sqsubseteq\exists r.D

$$


Here:


$$

C=\text{Child},\quad r=\text{hasParent},\quad D=\text{Father}

$$


**Step 2 — Write the head-box constraint.**

The box of $C$, bumped by $D$, should be inside the head box of $r$:


$$

\text{Box}(\text{Child})\oplus\text{Bump}(\text{Father})
\subseteq
\text{Head}(\text{hasParent})

$$


**Step 3 — Write the tail-box constraint.**

The box of $D$, bumped by $C$, should be inside the tail box of $r$:


$$

\text{Box}(\text{Father})\oplus\text{Bump}(\text{Child})
\subseteq
\text{Tail}(\text{hasParent})

$$


**Step 4 — Connect to the loss.**

The NF3 loss is the average of the two corresponding subsumption losses:


$$

\mathcal{L}_3(\text{Child},\text{hasParent},\text{Father})
=
\frac{1}{2}(\text{head loss}+\text{tail loss})

$$


---

## Q31. Box2EL role subsumption for the lecture family ontology

The lecture has:


$$

\text{hasParent}\sqsubseteq\text{relatedTo}

$$


What geometric constraints does Box2EL impose?

### Solution

**Step 1 — Identify the normal form.**

A role inclusion:


$$

r\sqsubseteq s

$$


is **NF6**.

**Step 2 — Identify $r$ and $s$.**


$$

r=\text{hasParent},\qquad s=\text{relatedTo}

$$


**Step 3 — Write the head-box inclusion.**


$$

\text{Head}(\text{hasParent})
\subseteq
\text{Head}(\text{relatedTo})

$$


**Step 4 — Write the tail-box inclusion.**


$$

\text{Tail}(\text{hasParent})
\subseteq
\text{Tail}(\text{relatedTo})

$$


**Step 5 — State the loss.**


$$

\mathcal{L}_6(\text{hasParent},\text{relatedTo})
=
\frac{1}{2}
\left(
\mathcal{L}_{\sqsubseteq}(\text{Head}(\text{hasParent}),\text{Head}(\text{relatedTo}))
+
\mathcal{L}_{\sqsubseteq}(\text{Tail}(\text{hasParent}),\text{Tail}(\text{relatedTo}))
\right)

$$


---

## Q32. Box2EL negative-sample loss from given $\mu$ values

For a negative NF3 sample:


$$

C\not\sqsubseteq \exists r.D

$$


suppose:


$$

\delta=1.0

$$


and:


$$

\mu(\text{Box}(C)+\text{Bump}(D),\text{Head}(r))=0.2

$$



$$

\mu(\text{Box}(D)+\text{Bump}(C),\text{Tail}(r))=1.2

$$


Compute:


$$

\mathcal{L}_{\not\sqsubseteq}(C,r,D)

$$


using the sheet’s formula:


$$

(\delta-\mu_{head})^2+(\delta-\mu_{tail})^2

$$


### Solution

**Step 1 — Identify the two $\mu$ values.**


$$

\mu_{head}=0.2,
\qquad
\mu_{tail}=1.2

$$


**Step 2 — Substitute into the negative loss.**


$$

(1.0-0.2)^2+(1.0-1.2)^2

$$


**Step 3 — Compute each term.**


$$

(0.8)^2=0.64

$$



$$

(-0.2)^2=0.04

$$


**Step 4 — Add them.**


$$

0.64+0.04=0.68

$$


**Step 5 — Interpret.**

The loss is not zero because the head part is too close to overlap and the tail part is slightly farther than the target separation $\delta$. The negative-sample loss is minimized when both $\mu$ values are near $\delta$.

---

## Q33. Choose the embedding paradigm

For each scenario, choose the paradigm from the lecture:

1. A model defines explicit score/loss functions for logical axioms and learns by SGD.  
2. A model converts ontology paths and axioms into token sequences, then trains Word2Vec.  
3. A model converts an ontology into a graph and uses a GNN-style propagation model.

### Solution

**Step 1 — Identify the score/loss model.**

Explicit score and loss functions with SGD correspond to the **end-to-end paradigm**.

Examples from the sheet:


$$

\text{TransE},\quad \text{Box2EL}

$$


**Step 2 — Identify the sequence model.**

Converting paths/axioms into sequences and training Word2Vec corresponds to the **sequence-learning paradigm**.

Example from the sheet:


$$

\text{OWL2Vec}^*

$$


**Step 3 — Identify the graph model.**

Converting knowledge into a graph and learning by message passing / propagation corresponds to the **graph-propagation paradigm**.

**Step 4 — Final answers.**

1. End-to-end paradigm.  
2. Sequence-learning paradigm.  
3. Graph-propagation paradigm.

---

## Q34. Build OWL2Vec\* structure, lexical, and combined sequences

Suppose the structure sequence is:


$$

(\text{iri:A},\text{iri:hasPart},\text{iri:B})

$$


Labels:


$$

\text{iri:A}\mapsto \text{``alpha cell''}

$$



$$

\text{iri:hasPart}\mapsto \text{``has part''}

$$



$$

\text{iri:B}\mapsto \text{``beta nucleus''}

$$


Construct one lexical sequence and one combined sequence.

### Solution

**Step 1 — Keep the structure document sequence as IRIs.**


$$

(\text{iri:A},\text{iri:hasPart},\text{iri:B})

$$


This preserves entity/relation identity.

**Step 2 — Replace each IRI by its label words for the lexical document.**


$$

\text{iri:A}\rightarrow(\text{alpha},\text{cell})

$$



$$

\text{iri:hasPart}\rightarrow(\text{has},\text{part})

$$



$$

\text{iri:B}\rightarrow(\text{beta},\text{nucleus})

$$


So a lexical sequence is:


$$

(\text{alpha},\text{cell},\text{has},\text{part},\text{beta},\text{nucleus})

$$


**Step 3 — Build a combined sequence.**

A combined document mixes IRIs and words. For example, replace the relation IRI with its words and keep the concept IRIs:


$$

(\text{iri:A},\text{has},\text{part},\text{iri:B})

$$


**Step 4 — Interpret.**

The combined sequence creates correlations between formal entities and lexical words, which is the text-aware part of OWL2Vec\*.

---

# Section C — Building things from scratch

## Q35. Build one-hot vectors and Skip-gram pairs from a tiny corpus

Vocabulary order:


$$

(a,b,c,d)

$$


Sentence:


$$

a\;b\;c\;d

$$


Use window size $1$. Build the one-hot sentence matrix and the Skip-gram training pairs.

### Solution

**Step 1 — Write one-hot vectors.**


$$

a=[1,0,0,0]

$$



$$

b=[0,1,0,0]

$$



$$

c=[0,0,1,0]

$$



$$

d=[0,0,0,1]

$$


**Step 2 — Stack vectors in sentence order.**


$$

\begin{bmatrix}
1&0&0&0\\
0&1&0&0\\
0&0&1&0\\
0&0&0&1
\end{bmatrix}

$$


The matrix is $4\times4$.

**Step 3 — Recall Skip-gram direction.**

Skip-gram uses:


$$

\text{middle word}\rightarrow\text{context words}

$$


**Step 4 — Generate window-size-1 pairs.**

For $a$, context is $b$:


$$

(a,b)

$$


For $b$, context is $a,c$:


$$

(b,a),(b,c)

$$


For $c$, context is $b,d$:


$$

(c,b),(c,d)

$$


For $d$, context is $c$:


$$

(d,c)

$$


**Step 5 — Final pair set.**


$$

\{(a,b),(b,a),(b,c),(c,b),(c,d),(d,c)\}

$$


---

## Q36. Build and score a tiny TransE training example

KG positive triple:


$$

(A,r,B)

$$


Corrupted negative triple:


$$

(A,r,C)

$$


Embeddings:


$$

\mathbf{A}=(0,0),\quad \mathbf{r}=(1,1),\quad \mathbf{B}=(1,1),\quad \mathbf{C}=(2,1)

$$


Use L1 score and margin $\gamma=1$. Compute the loss.

### Solution

**Step 1 — Score the positive triple.**


$$

\mathbf{A}+\mathbf{r}-\mathbf{B}=(0,0)+(1,1)-(1,1)=(0,0)

$$



$$

f(A,r,B)=|0|+|0|=0

$$


**Step 2 — Score the negative triple.**


$$

\mathbf{A}+\mathbf{r}-\mathbf{C}=(0,0)+(1,1)-(2,1)=(-1,0)

$$



$$

f(A,r,C)=|-1|+|0|=1

$$


**Step 3 — Apply margin loss.**


$$

[\gamma+f_{pos}-f_{neg}]_+
=[1+0-1]_+
=[0]_+=0

$$


**Step 4 — Interpret.**

The negative triple is just separated by the margin, so this pair contributes zero loss.

---

## Q37. Build an $\mathcal{EL}^{++}$ ontology and normalize the ABox

Represent the following statements:

1. Every Researcher is a Person and an Employee.  
2. Every Student has some Supervisor as advisor.  
3. `advisorOf` is a subrole of `relatedTo`.  
4. Alice is a Student.  
5. Alice has advisor Bob.

Then convert the ABox assertions into TBox-style axioms.

### Solution

**Step 1 — Identify TBox concept inclusion with conjunction.**

“Every Researcher is a Person and an Employee” becomes:


$$

\text{Researcher}\sqsubseteq \text{Person}\sqcap\text{Employee}

$$


**Step 2 — Identify TBox existential restriction.**

“Every Student has some Supervisor as advisor” becomes:


$$

\text{Student}\sqsubseteq \exists\text{advisorOf}.\text{Supervisor}

$$


**Step 3 — Identify role subsumption.**


$$

\text{advisorOf}\sqsubseteq\text{relatedTo}

$$


**Step 4 — Write ABox assertions.**

“Alice is a Student”:


$$

\text{Student}(\text{Alice})

$$


“Alice has advisor Bob”:


$$

\text{advisorOf}(\text{Alice},\text{Bob})

$$


**Step 5 — Convert the concept assertion to TBox style.**


$$

\text{Student}(\text{Alice})
\leadsto
\{\text{Alice}\}\sqsubseteq\text{Student}

$$


**Step 6 — Convert the role assertion to TBox style.**


$$

\text{advisorOf}(\text{Alice},\text{Bob})
\leadsto
\{\text{Alice}\}\sqsubseteq\exists\text{advisorOf}.\{\text{Bob}\}

$$


**Step 7 — Final ontology after ABox-to-TBox conversion.**


$$

\text{Researcher}\sqsubseteq \text{Person}\sqcap\text{Employee}

$$



$$

\text{Student}\sqsubseteq \exists\text{advisorOf}.\text{Supervisor}

$$



$$

\text{advisorOf}\sqsubseteq\text{relatedTo}

$$



$$

\{\text{Alice}\}\sqsubseteq\text{Student}

$$



$$

\{\text{Alice}\}\sqsubseteq\exists\text{advisorOf}.\{\text{Bob}\}

$$


---

## Q38. Map a constructed ontology to Box2EL normal forms

Using the ontology from Q37, identify the Box2EL normal form for each axiom.

### Solution

**Step 1 — Inspect the first axiom.**


$$

\text{Researcher}\sqsubseteq \text{Person}\sqcap\text{Employee}

$$


This is not directly one of the listed normal forms because the conjunction is on the right. Normalization would rewrite it into simpler inclusions such as:


$$

\text{Researcher}\sqsubseteq\text{Person}

$$



$$

\text{Researcher}\sqsubseteq\text{Employee}

$$


Each is **NF1**.

**Step 2 — Inspect the existential-on-right axiom.**


$$

\text{Student}\sqsubseteq \exists\text{advisorOf}.\text{Supervisor}

$$


This is **NF3**:


$$

C\sqsubseteq\exists r.D

$$


**Step 3 — Inspect role subsumption.**


$$

\text{advisorOf}\sqsubseteq\text{relatedTo}

$$


This is **NF6**:


$$

r\sqsubseteq s

$$


**Step 4 — Inspect nominal concept inclusion.**


$$

\{\text{Alice}\}\sqsubseteq\text{Student}

$$


This is **NF1**, where the left concept is a nominal.

**Step 5 — Inspect nominal existential.**


$$

\{\text{Alice}\}\sqsubseteq\exists\text{advisorOf}.\{\text{Bob}\}

$$


This is **NF3**, where both $C$ and $D$ are nominals.

**Step 6 — Summary.**

- Researcher-to-Person: NF1  
- Researcher-to-Employee: NF1  
- Student-to-exists-advisorOf-Supervisor: NF3  
- advisorOf-to-relatedTo: NF6  
- Alice-to-Student: NF1  
- Alice-to-exists-advisorOf-Bob: NF3

---

## Q39. Build the Box2EL constraints for a new existential axiom

For:


$$

\text{Student}\sqsubseteq\exists\text{advisorOf}.\text{Supervisor}

$$


write the two bump-vector constraints and the loss form.

### Solution

**Step 1 — Match the axiom to NF3.**


$$

C\sqsubseteq\exists r.D

$$


where:


$$

C=\text{Student},\quad r=\text{advisorOf},\quad D=\text{Supervisor}

$$


**Step 2 — Write the head constraint.**


$$

\text{Box}(\text{Student})+\text{Bump}(\text{Supervisor})
\subseteq
\text{Head}(\text{advisorOf})

$$


**Step 3 — Write the tail constraint.**


$$

\text{Box}(\text{Supervisor})+\text{Bump}(\text{Student})
\subseteq
\text{Tail}(\text{advisorOf})

$$


**Step 4 — Write the loss form.**


$$

\mathcal{L}_3(\text{Student},\text{advisorOf},\text{Supervisor})
=
\frac{1}{2}
\left(
\mathcal{L}_{\sqsubseteq}
(
\text{Box}(\text{Student})+\text{Bump}(\text{Supervisor}),
\text{Head}(\text{advisorOf})
)
+
\mathcal{L}_{\sqsubseteq}
(
\text{Box}(\text{Supervisor})+\text{Bump}(\text{Student}),
\text{Tail}(\text{advisorOf})
)
\right)

$$


---

## Q40. Build an OWL2Vec\* pipeline from an existential axiom

A concept has IRI `ex:Snack` and label “snack”. The relation `ex:derivedFrom` has label “derived from”. The filler concept `ex:Plant` has label “plant”. The formal axiom is:


$$

\text{ex:Snack}\sqsubseteq\exists\text{ex:derivedFrom}.\text{ex:Plant}

$$


There is also a textual definition: “A snack is a small amount of food eaten between meals.”

Build the OWL2Vec\* RDF graph mapping, one structure sequence, one lexical sequence, and one combined sequence.

### Solution

**Step 1 — Convert the existential axiom to RDF graph triples.**

Introduce a blank node $\_:x$:


$$

\langle \text{ex:Snack},\text{rdfs:subClassOf},\_:x\rangle

$$



$$

\langle \_:x,\text{rdf:type},\text{owl:Restriction}\rangle

$$



$$

\langle \_:x,\text{owl:onProperty},\text{ex:derivedFrom}\rangle

$$



$$

\langle \_:x,\text{owl:someValuesFrom},\text{ex:Plant}\rangle

$$


**Step 2 — Build a structure sequence.**

A structure sequence keeps entity/relation identifiers. One axiom-style sequence is:


$$

(\text{ex:Snack},\text{subClassOf},\text{ex:derivedFrom},\text{some},\text{ex:Plant})

$$


**Step 3 — Build a lexical sequence from labels and definition.**

Labels contribute:


$$

(\text{snack},\text{derived},\text{from},\text{plant})

$$


The definition contributes words such as:


$$

(\text{a},\text{snack},\text{is},\text{a},\text{small},\text{amount},\text{of},\text{food},\text{eaten},\text{between},\text{meals})

$$


A lexical document may include both.

**Step 4 — Build a combined sequence.**

Replace one or more entities in the structure sequence with words. For example, keep the concept IRIs but replace the relation with its label words:


$$

(\text{ex:Snack},\text{derived},\text{from},\text{some},\text{ex:Plant})

$$


**Step 5 — State the training step.**

OWL2Vec\* trains a word embedding model, such as CBOW, over the structure, lexical, and combined documents. The vocabulary contains both IRIs and words, so it can output IRI vectors and word vectors.

---

# Section D — Hard edge cases / where methods disagree or break down

## Q41. False negatives in TransE negative sampling

Positive triple:


$$

\langle \text{London},\text{CapitalOf},\text{UK}\rangle

$$


A negative sample is generated:


$$

\langle \text{London},\text{CapitalOf},\text{England}\rangle

$$


Explain why this could be problematic in an incomplete KG.

### Solution

**Step 1 — Recall how TransE generates negatives.**

It corrupts the head or tail of an observed triple and treats the corrupted triple as false.

**Step 2 — Identify the corrupted triple.**

The tail was changed from:


$$

\text{UK}\quad\text{to}\quad\text{England}

$$


**Step 3 — State the closed-world-style assumption.**

The training process assumes that if the corrupted triple is not in the KG, it can be used as a negative sample.

**Step 4 — Explain the incompleteness problem.**

KGs are often incomplete. A triple missing from the KG is not necessarily false.

**Step 5 — State the risk.**

If the corrupted triple is actually true or plausible under the intended relation, the model is trained to push a true fact away. This is a **false negative**.

---

## Q42. TransE 1-to-N collapse under optimization

Suppose the KG contains:


$$

(h,r,t_1),\quad (h,r,t_2),\quad (h,r,t_3)

$$


All three are true and $t_1,t_2,t_3$ are distinct. Explain what a perfect TransE solution would force.

### Solution

**Step 1 — Write the perfect equations.**

For each true triple:


$$

\mathbf{h}+\mathbf{r}=\mathbf{t}_1

$$



$$

\mathbf{h}+\mathbf{r}=\mathbf{t}_2

$$



$$

\mathbf{h}+\mathbf{r}=\mathbf{t}_3

$$


**Step 2 — Compare the equations.**

Each tail equals the same vector $\mathbf{h}+\mathbf{r}$.

Therefore:


$$

\mathbf{t}_1=\mathbf{t}_2=\mathbf{t}_3

$$


**Step 3 — Explain the collapse.**

The model is pushed to place different tail entities at the same or very similar positions.

**Step 4 — State why this is a limitation.**

The KG says the tails are distinct entities, but TransE’s single translation vector cannot naturally represent one head mapping to many different tails.

**Step 5 — Connect to TransH/TransR.**

TransH and TransR reduce this problem by allowing relation-specific projections before translation.

---

## Q43. Symmetric relation workaround: why $r=0$ is not enough

For a symmetric relation, TransE can satisfy both directions by making:


$$

\mathbf{r}=0

$$


Why is this not a good representation when the entities are distinct?

### Solution

**Step 1 — Start from the symmetric equations.**


$$

\mathbf{h}+\mathbf{r}=\mathbf{t}

$$



$$

\mathbf{t}+\mathbf{r}=\mathbf{h}

$$


**Step 2 — Use $\mathbf{r}=0$.**

The first equation becomes:


$$

\mathbf{h}=\mathbf{t}

$$


The second also becomes:


$$

\mathbf{t}=\mathbf{h}

$$


**Step 3 — Identify the issue.**

This only works perfectly by collapsing the two entity embeddings together.

**Step 4 — Explain why collapse is bad.**

If $h$ and $t$ are distinct individuals, their embeddings should not be forced to be identical merely because they participate in one symmetric relation.

**Step 5 — Conclusion.**

Setting $r=0$ is mathematically possible but semantically poor. It removes the relation’s directional translation and collapses distinct entities.

---

## Q44. Ball intersection vs box intersection

Two concept balls overlap in a lens-shaped region. The ontology needs:


$$

E\equiv C\sqcap D

$$


Why is this hard for ball embeddings but natural for box embeddings?

### Solution

**Step 1 — Recall what conjunction means.**


$$

C\sqcap D

$$


means concept intersection.

**Step 2 — Apply this to balls.**

If $C$ and $D$ are balls, then $C\cap D$ is generally not another ball. It is often a lens-shaped region.

**Step 3 — State the closure problem.**

Ball embeddings are not closed under intersection. So representing $E$ exactly as the intersection of $C$ and $D$ is generally difficult.

**Step 4 — Apply this to boxes.**

If $C$ and $D$ are axis-aligned boxes, then:


$$

\text{Box}(C)\cap\text{Box}(D)

$$


is still an axis-aligned box, if non-empty.

**Step 5 — Conclusion.**

Boxes are better suited to $\mathcal{EL}^{++}$ conjunction because concept intersection stays inside the same geometric representation family.

---

## Q45. Empty box intersection edge case

Let:


$$

A=[0,1]

$$



$$

B=[2,3]

$$


Compute $A\cap B$. What does this mean for a disjointness axiom?

### Solution

**Step 1 — Compute the intersection lower bound.**


$$

l_{A\cap B}=\max(0,2)=2

$$


**Step 2 — Compute the intersection upper bound.**


$$

u_{A\cap B}=\min(1,3)=1

$$


**Step 3 — Check validity.**

A valid interval requires:


$$

l\leq u

$$


Here:


$$

2>1

$$


so the intersection is empty.

**Step 4 — Connect to disjointness.**

For a disjointness axiom:


$$

A\sqcap B\sqsubseteq\bot

$$


empty intersection is exactly the desired semantic condition.

**Step 5 — Connect to Box2EL loss.**

NF5 penalizes overlap. If the boxes are separated enough, the disjointness loss becomes zero.

---

## Q46. Negative-sample loss is not “push infinitely far away”

For Box2EL negative samples, suppose:


$$

\delta=1

$$


Compare loss values for $\mu=0$, $\mu=1$, and $\mu=3$ using one term:


$$

(\delta-\mu)^2

$$


What does this show?

### Solution

**Step 1 — Compute loss when $\mu=0$.**


$$

(1-0)^2=1

$$


This corresponds to boxes being too close or overlapping.

**Step 2 — Compute loss when $\mu=1$.**


$$

(1-1)^2=0

$$


This is the target separation.

**Step 3 — Compute loss when $\mu=3$.**


$$

(1-3)^2=(-2)^2=4

$$


This is also penalized.

**Step 4 — Interpret.**

The negative-sample loss does not simply push boxes infinitely far apart. It pushes the separation measure $\mu$ toward the hyperparameter $\delta$.

---

## Q47. Projection rule vs full RDF mapping in OWL2Vec\*

For:


$$

C\sqsubseteq\exists r.D

$$


compare the full RDF mapping with the simpler projected triple:


$$

\langle C,\text{rdfs:subClassOf},D\rangle

$$


What information can the projection lose?

### Solution

**Step 1 — Write the full RDF mapping.**


$$

\langle C,\text{rdfs:subClassOf},\_:x\rangle

$$



$$

\langle \_:x,\text{rdf:type},\text{owl:Restriction}\rangle

$$



$$

\langle \_:x,\text{owl:onProperty},r\rangle

$$



$$

\langle \_:x,\text{owl:someValuesFrom},D\rangle

$$


**Step 2 — Write the projected triple.**


$$

\langle C,\text{rdfs:subClassOf},D\rangle

$$


**Step 3 — Compare the semantics.**

The full mapping says:


$$

C\sqsubseteq \exists r.D

$$


meaning every $C$ has some $r$-successor in $D$.

The projected triple says only:


$$

C\sqsubseteq D

$$


**Step 4 — Identify lost information.**

The projected triple can lose or blur:

- the existential restriction structure;
- the role/property $r$;
- the distinction between “is a subclass of $D$” and “has an $r$-relation to some $D$”.

**Step 5 — Conclusion.**

Projection is simpler for sequence generation, but it can shift the formal semantics.

---

## Q48. Ambiguous words: why Word2Vec can fail and contextual embeddings help

The word `bank` appears in:

1. “the bank approved the loan”  
2. “the boat reached the river bank”

Explain how Word2Vec and BERT-style contextual embeddings differ.

### Solution

**Step 1 — Identify the two meanings.**

In sentence 1, `bank` means a financial institution.

In sentence 2, `bank` means the side of a river.

**Step 2 — Apply non-contextual embedding.**

Word2Vec gives one vector per word type:


$$

V(\text{bank})=V(\text{bank})

$$


for both sentences.

**Step 3 — State the failure mode.**

The same vector must represent two meanings, so the embedding cannot directly distinguish the contexts.

**Step 4 — Apply contextual embedding.**

A BERT-style model gives vectors depending on surrounding words:


$$

V(\text{bank in loan context})\neq V(\text{bank in river context})

$$


**Step 5 — Conclusion.**

Contextual embeddings handle fine-grained word meaning better because the representation changes with context.

---

## Q49. L1 vs L2 scoring ambiguity: how to stay safe in an exam answer

A question asks you to compute TransE score. It says:


$$

f(h,r,t)=\|\mathbf{h}+\mathbf{r}-\mathbf{t}\|_{L1/L2}

$$


but does not specify L1 or L2. What should you do?

### Solution

**Step 1 — Identify the missing condition.**

The formula allows either L1 or L2-style distance.

**Step 2 — Do not silently choose one if the question expects precision.**

State your assumption:

> “Using L1 distance…”

or:

> “Using L2 distance…”

**Step 3 — If both are useful, compute both.**

For score vector:


$$

\mathbf{v}=\mathbf{h}+\mathbf{r}-\mathbf{t}=(a,b)

$$


L1 is:


$$

|a|+|b|

$$


Standard Euclidean L2 is:


$$

\sqrt{a^2+b^2}

$$


The slide also presents a squared-distance-style expression in one place, so make clear which convention you are using.

**Step 4 — Interpret the result the same way.**

For both L1 and L2-style scores, smaller score means the triple is more likely.

---

## Q50. Normalisation changes form, not intended ontology meaning

An ontology contains:


$$

\text{Researcher}\sqsubseteq \text{Person}\sqcap\text{Employee}

$$


Box2EL wants normal forms. Why is it acceptable to rewrite this into:


$$

\text{Researcher}\sqsubseteq\text{Person}

$$


and:


$$

\text{Researcher}\sqsubseteq\text{Employee}

$$


for training?

### Solution

**Step 1 — Interpret the original axiom.**


$$

\text{Researcher}\sqsubseteq \text{Person}\sqcap\text{Employee}

$$


means every Researcher is both a Person and an Employee.

**Step 2 — Split the conjunction.**

Being a subclass of an intersection entails being a subclass of each conjunct:


$$

\text{Researcher}\sqsubseteq\text{Person}

$$



$$

\text{Researcher}\sqsubseteq\text{Employee}

$$


**Step 3 — Connect to normalisation.**

The lecture says ontology normalisation changes axiom forms while preserving semantics.

**Step 4 — Connect to Box2EL.**

Each resulting axiom is NF1:


$$

C\sqsubseteq D

$$


so Box2EL can apply the concept-subsumption loss directly.

---

# Final rapid-check list

Use this as a last pass before an exam or self-test:

1. **One-hot:** vector length = vocabulary size; sentence matrix = tokens $\times$ vocabulary size.  
2. **Skip-gram:** middle word $\rightarrow$ context.  
3. **CBOW:** context $\rightarrow$ middle word.  
4. **Word2Vec embedding:** one-hot input selects a row of the input-to-hidden matrix.  
5. **Contextual embedding:** same word can have different vectors in different contexts.  
6. **TransE score:** smaller $\|h+r-t\|$ means more plausible.  
7. **Negative sampling:** corrupt head or tail; beware false negatives.  
8. **TransE loss:** $[\gamma+f_{pos}-f_{neg}]_+$.  
9. **Composition:** $r_3=r_1+r_2$.  
10. **Symmetry failure:** forces $r=0$ and $h=t$.  
11. **1-to-N failure:** forces different tails to collapse.  
12. **TransH:** project entities onto relation-specific hyperplane.  
13. **TransR:** project entities into relation-specific space with $M_r$.  
14. **$\mathcal{EL}^{++}$:** know $\bot,\top,A,C\sqcap D,\exists r.C,\{a\}$.  
15. **ABox-to-TBox:** $C(a)\to\{a\}\sqsubseteq C$; $r(a,b)\to\{a\}\sqsubseteq\exists r.\{b\}$.  
16. **Ball concept:** membership = point inside ball; problem = intersections are not generally balls.  
17. **Box concept:** membership = element-wise bounds; intersection of boxes is a box.  
18. **Box distance:** positive dimension = gap; negative dimension = overlap.  
19. **Box2EL NF3:** two bump constraints, one into Head$(r)$, one into Tail$(r)$.  
20. **OWL2Vec\*:** OWL/RDF graph $\rightarrow$ structure, lexical, combined docs $\rightarrow$ CBOW embeddings.
