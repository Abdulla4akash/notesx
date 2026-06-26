---
subject: COMP64501
chapter: 15
title: "Sequence Modeling — Flashcards"
language: en
---

# Sequence Modeling — Flashcards

79 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> Sequence modelling — how do you recognize the task?</summary>

Use it when the output at a position depends on ordered earlier/later elements, not just one independent input vector.<br>1. Identify the ordered units $x_1,\dots,x_N$.<br>2. Decide which output is needed at each position or for the whole sequence.<br>3. Preserve order when training/evaluating; do not treat tokens as an unordered set unless the model explicitly compensates.<br>Reference: sequence modelling extends feedforward prediction to ordered data where predictions depend on a sequence of inputs.

</details>

<details>
<summary><strong>Q2.</strong> Language model — how do you use it to compare possible sequences?</summary>

Score each candidate sequence $x$ with $p(x)$, then prefer the candidate with the larger probability.<br>Discriminator: which candidate sequence is assigned higher probability by the model?<br>Reference: a language model defines a probability distribution over all finite sequences $x \in \Sigma^*$, with $\sum_{x\in\Sigma^*}p(x)=1$.

</details>

<details>
<summary><strong>Q3.</strong> Chain rule for a sequence — how do you factor $p(x_1,\dots,x_N)$?</summary>

1. Start with the first token probability $p(x_1)$.<br>2. For each later token $x_n$, condition on all previous tokens $x_1,\dots,x_{n-1}$.<br>3. Multiply all conditional terms.<br>Reference: $p(x_1,\dots,x_N)=p(x_1)\prod_{n=2}^{N}p(x_n\mid x_1,\dots,x_{n-1})$.

</details>

<details>
<summary><strong>Q4.</strong> Next-token prediction — how do you turn language modelling into a supervised objective?</summary>

1. At position $n$, feed the context $x_1,\dots,x_{n-1}$.<br>2. Predict a distribution over the next token $x_n$.<br>3. Train by making the true next token high probability.<br>Discriminator: what token is immediately next after the available context?<br>Reference: language modelling can be written as learning $p(x_n\mid x_1,\dots,x_{n-1})$.

</details>

<details>
<summary><strong>Q5.</strong> Why can next-token prediction require language understanding?</summary>

Recognize it when a next-token distribution changes after adding broader context.<br>Apply by asking which information the model must use: syntax, semantics, context, and world knowledge.<br>Reference: the sheet states that the simple objective of predicting the next word can contain much of natural-language understanding.

</details>

<details>
<summary><strong>Q6.</strong> Language modelling as time-series prediction — what split rule prevents leakage?</summary>

1. Treat positions as ordered in time.<br>2. Train only on earlier/past data for the prediction setting.<br>3. Test on future/held-out later data.<br>Discriminator: is any future token being used to predict an earlier token?<br>Reference: language modelling is a time-series prediction problem: train on the past, test on the future.

</details>

<details>
<summary><strong>Q7.</strong> Feedforward vs RNN — discriminator: does the hidden representation depend on a previous hidden state?</summary>

If no, use the feedforward form: compute from the current input only.<br>If yes, use the recurrent form: combine the current input with $h_{n-1}$.<br>Reference: feedforward $h=g(Vx+c),\ \hat y=Wh+b$; RNN $h_n=g(V[x_n;h_{n-1}]+c),\ \hat y_n=Wh_n+b$.

</details>

<details>
<summary><strong>Q8.</strong> RNN forward pass — how do you compute predictions through a sequence?</summary>

1. Choose an initial state $h_0$.<br>2. For $n=1,\dots,N$, concatenate $[x_n;h_{n-1}]$.<br>3. Compute $h_n=g(V[x_n;h_{n-1}]+c)$.<br>4. Compute $\hat y_n=Wh_n+b$.<br>Reference: an RNN carries information forward by feeding each hidden state into the next timestep.

</details>

<details>
<summary><strong>Q9.</strong> RNN next-token training — how do you align inputs and targets?</summary>

1. Prepend a start token to form the input stream.<br>2. Feed token $x_n$ at step $n$.<br>3. Use the output $\hat y_n$ to predict the next token target, usually $x_{n+1}$.<br>Discriminator: which token should the current output predict, current or next? Check the task notation.<br>Reference: the sheet presents RNN outputs at each timestep for next-word prediction and flags a notation ambiguity in the slide loss.

</details>

<details>
<summary><strong>Q10.</strong> RNN unrolling — how do you convert recurrence into a graph for training?</summary>

1. Copy the same recurrent cell once per timestep.<br>2. Connect $h_{n-1}\rightarrow h_n$ across copies.<br>3. Share the same parameters across all copies.<br>4. Backpropagate through this unrolled acyclic graph.<br>Reference: an RNN can be shown as a recurrent cell with a loop or as an unrolled directed acyclic graph.

</details>

<details>
<summary><strong>Q11.</strong> RNN sequence loss — how do you combine per-timestep errors?</summary>

1. Compute a loss $E_n$ for each timestep prediction $\hat y_n$.<br>2. Sum the losses across timesteps.<br>3. Divide by the sequence length if using the average loss.<br>Reference: the sheet gives $E=\frac{1}{N}\sum_{n=1}^{N}E_n(x_n,\hat y_n)$, with target notation flagged as ambiguous for next-token diagrams.

</details>

<details>
<summary><strong>Q12.</strong> Back-Propagation Through Time — how do you train an RNN?</summary>

1. Run the RNN forward through all timesteps.<br>2. Unroll the recurrent computation graph.<br>3. Apply ordinary backpropagation from losses back through outputs and hidden-state links.<br>4. Accumulate parameter gradients across all shared cell copies.<br>Reference: BPTT is ordinary backpropagation applied to the unrolled RNN graph.

</details>

<details>
<summary><strong>Q13.</strong> BPTT gradient to an earlier state — what contributions must be included?</summary>

For hidden state $h_i$:<br>1. Include the local loss path through $\hat y_i$.<br>2. Include each future loss path $E_j\rightarrow \hat y_j\rightarrow h_j\rightarrow\cdots\rightarrow h_i$ for $j>i$.<br>3. Sum all such path contributions.<br>Reference: in full BPTT, $\partial E/\partial h_i$ receives contributions from timestep $i$ and later timesteps.

</details>

<details>
<summary><strong>Q14.</strong> Truncated BPTT — discriminator: how far back through time are gradients allowed to flow?</summary>

1. Choose a truncation window length.<br>2. Backpropagate only through hidden-state links inside that window.<br>3. Cut gradient dependencies beyond the window.<br>4. Accept cheaper training but weaker long-range gradient learning.<br>Reference: truncated BPTT approximates full BPTT by breaking dependencies after a fixed number of timesteps.

</details>

<details>
<summary><strong>Q15.</strong> Long-range dependency in an RNN — how do you recognize one?</summary>

A prediction at timestep $n$ requires information from much earlier timesteps.<br>To model it, the relevant information must be stored in hidden states and preserved through many recurrent updates.<br>Discriminator: does the required evidence occur far before the prediction point?<br>Reference: RNNs can represent long-range dependencies in theory, but learning them is difficult in practice.

</details>

<details>
<summary><strong>Q16.</strong> Exploding/vanishing gradients — what causes them in RNNs?</summary>

Trace a late loss back to an early hidden state.<br>1. The path multiplies many recurrent Jacobians $\partial h_n/\partial h_{n-1}$.<br>2. Repeated products can grow or shrink exponentially.<br>3. Large products explode; tiny products vanish.<br>Reference: $\partial E_N/\partial h_1$ contains $\prod_{n=N}^{2}\partial h_n/\partial h_{n-1}$.

</details>

<details>
<summary><strong>Q17.</strong> Recurrent Jacobian — how do you compute $\partial h_n/\partial h_{n-1}$?</summary>

1. Split the recurrent weights into input and hidden parts: $V_x,V_h$.<br>2. Write $z_n=V_xx_n+V_hh_{n-1}+c$.<br>3. Write $h_n=g(z_n)$.<br>4. Apply the chain rule: activation derivative times hidden-weight derivative.<br>Reference: $\partial h_n/\partial h_{n-1}=\operatorname{diag}(g'(z_n))V_h$.

</details>

<details>
<summary><strong>Q18.</strong> Eigenvalue test for RNN gradients — discriminator: how does the largest eigenvalue of $V_h$ compare with 1?</summary>

Largest eigenvalue $=1$: gradients can propagate.<br>Largest eigenvalue $>1$: repeated products tend to grow, so gradients explode.<br>Largest eigenvalue $<1$: repeated products tend to shrink, so gradients vanish.<br>Reference: the sheet explains exploding/vanishing gradients via repeated multiplication involving $V_h$.

</details>

<details>
<summary><strong>Q19.</strong> RNN gradient problems — what architectural fix does the sheet mention?</summary>

Use architectures with gated units when long-range gradient flow is problematic.<br>Discriminator: is the issue repeated recurrent multiplication causing vanishing/exploding gradients?<br>Reference: the sheet names gated units as the popular architecture-level solution for RNN gradient problems.

</details>

<details>
<summary><strong>Q20.</strong> Why move beyond RNNs — discriminator: can timesteps be computed in parallel?</summary>

In an RNN, no: $h_n$ depends on $h_{n-1}$, so forward and backward passes require sequential operations across the sequence.<br>This limits GPU parallelism and large-scale training.<br>Reference: RNNs have $O(\text{sequence length})$ unparallelisable operations.

</details>

<details>
<summary><strong>Q21.</strong> Attention — how do you apply the idea to a token in context?</summary>

1. Choose the output token or position being computed.<br>2. Score how relevant each input token is to that output.<br>3. Rely more heavily on high-relevance tokens and less on low-relevance tokens.<br>Discriminator: which input tokens should this output depend on most?<br>Reference: attention means a neural network attends to, or relies more heavily on, selected words/tokens from the rest of the sequence.

</details>

<details>
<summary><strong>Q22.</strong> One-hot encoding — how do you encode a token?</summary>

1. Fix a vocabulary/dictionary of size $K$.<br>2. Assign the token an index $k$.<br>3. Create a length-$K$ vector with 1 at position $k$ and 0 elsewhere.<br>Reference: one-hot encoding represents the $k$-th word by a vector with a single 1 in position $k$.

</details>

<details>
<summary><strong>Q23.</strong> One-hot vs embedding — discriminator: sparse identity code or dense learned vector?</summary>

One-hot: high-dimensional sparse vector tied directly to dictionary index.<br>Embedding: lower-dimensional dense vector that can be learned and reused by the model.<br>Reference: one-hot vectors have length $K$; embeddings map them into a $D$-dimensional space.

</details>

<details>
<summary><strong>Q24.</strong> Word embedding lookup — how do you compute the embedding from a one-hot vector?</summary>

1. Let $E\in\mathbb R^{D\times K}$ be the embedding matrix.<br>2. Let $x_n$ be the one-hot vector for token $n$.<br>3. Multiply $v_n=Ex_n$.<br>4. Interpret $v_n$ as the selected column of $E$.<br>Reference: $v_n=Ex_n$, where $D$ is embedding dimension and $K$ is vocabulary size.

</details>

<details>
<summary><strong>Q25.</strong> Embedding training — preprocessing or end-to-end?</summary>

Use either route:<br>1. Pre-train embeddings separately and feed them into the model; or<br>2. Include the embedding matrix inside the model and learn it during task training.<br>Reference: the sheet says embeddings can be learned, for example with word2vec, as preprocessing or end-to-end.

</details>

<details>
<summary><strong>Q26.</strong> Semantic structure in embeddings — how do you use vector offsets?</summary>

To test an analogy-style relation:<br>1. Compute a relation vector $v(A)-v(B)$.<br>2. Compare it with another relation vector $v(C)-v(D)$.<br>3. Similar offsets suggest a similar semantic relation.<br>Reference: learned embedding spaces can contain semantic structure expressed through approximate vector-offset relations.

</details>

<details>
<summary><strong>Q27.</strong> Token matrix $X$ — how do you build it from token vectors?</summary>

1. Choose token units, such as words or byte-pair tokens.<br>2. Represent each token as a $D$-dimensional vector $x_n$.<br>3. Stack token vectors as rows in sequence order.<br>4. Use an $N\times D$ matrix, with $N$ tokens and $D$ features.<br>Reference: $X=[x_1^\top; x_2^\top; \dots; x_N^\top]\in\mathbb R^{N\times D}$.

</details>

<details>
<summary><strong>Q28.</strong> Transformer/self-attention layer goal — what shape should the transformation preserve?</summary>

1. Take token matrix $X\in\mathbb R^{N\times D}$.<br>2. Produce output token matrix $Y$ with the same number of token positions.<br>3. Allow layers to be stacked repeatedly to build a deep model.<br>Reference: the sheet writes $Y=\operatorname{TransformerLayer}[X]$ and maps $x_1,\dots,x_N$ to $y_1,\dots,y_N$.

</details>

<details>
<summary><strong>Q29.</strong> Self-attention output token — how do you compute $y_n$ as a weighted mixture?</summary>

1. For output position $n$, assign weights $a_{nm}$ over all input tokens $m=1,\dots,N$.<br>2. Multiply each input vector $x_m$ by its weight.<br>3. Sum the weighted vectors.<br>Reference: $y_n=\sum_{m=1}^{N}a_{nm}x_m$.

</details>

<details>
<summary><strong>Q30.</strong> Attention weights — how do you interpret a row $a_{n1},\dots,a_{nN}$?</summary>

For fixed output $n$, each $a_{nm}$ says how much input token $m$ influences output token $n$.<br>Large weight = strong influence; near-zero weight = little influence.<br>Reference: attention coefficients are normalized weights used to combine value vectors.

</details>

<details>
<summary><strong>Q31.</strong> Values, keys, queries — discriminator: returned content, compared label, or asking vector?</summary>

Value: vector that is weighted and summed into the output.<br>Key: vector compared against a query to decide relevance.<br>Query: vector for the output position asking which keys matter.<br>Reference: attention uses queries and keys to compute weights, then applies those weights to values.

</details>

<details>
<summary><strong>Q32.</strong> Self-attention Q/K/V source — where do queries, keys, and values come from?</summary>

Use the same input sequence for all three roles:<br>1. Token vectors act as values.<br>2. Token vectors act as keys.<br>3. The token for output position $n$ acts as the query for $y_n$.<br>Reference: in self-attention, the same input vectors are used as queries, keys, and values.

</details>

<details>
<summary><strong>Q33.</strong> Dot-product self-attention — step-by-step method without learnable projections</summary>

1. For output $n$, use $x_n$ as the query.<br>2. For each input $m$, score similarity with $x_n^\top x_m$.<br>3. Apply row-wise softmax over $m$ to get $a_{nm}$.<br>4. Output $y_n=\sum_m a_{nm}x_m$.<br>Reference: basic dot-product self-attention uses the same vectors as Q/K/V and has no learnable parameters.

</details>

<details>
<summary><strong>Q34.</strong> Softmax in attention — discriminator: probability model or normalization device?</summary>

In this sheet, treat it as a normalization device for weights, not as a separate probabilistic interpretation.<br>1. Exponentiate scores.<br>2. Normalize within each row so weights are comparable and sum to 1.<br>Reference: the sheet explicitly says the attention softmax here has no probabilistic interpretation.

</details>

<details>
<summary><strong>Q35.</strong> Matrix dot-product self-attention — how do you compute $Y$ from $X$?</summary>

1. Compute all pairwise token scores: $L=XX^\top$.<br>2. Apply softmax independently to each row of $L$.<br>3. Multiply the resulting attention matrix by $X$.<br>Reference: $Y=\operatorname{softmax}(XX^\top)X$.

</details>

<details>
<summary><strong>Q36.</strong> Parameterized self-attention — how do you add learnable Q/K/V projections?</summary>

1. Learn three matrices $W^{(q)},W^{(k)},W^{(v)}$.<br>2. Compute $Q=XW^{(q)}$, $K=XW^{(k)}$, $V=XW^{(v)}$.<br>3. Score with $QK^\top$.<br>4. Row-softmax the scores and multiply by $V$.<br>Reference: $Y=\operatorname{softmax}(QK^\top)V$.

</details>

<details>
<summary><strong>Q37.</strong> Parameterized attention dimensions — how do you sanity-check the shapes?</summary>

1. Start with $X\in\mathbb R^{N\times D}$.<br>2. Use $W^{(q)}\in\mathbb R^{D\times D_q}$, $W^{(k)}\in\mathbb R^{D\times D_k}$, $W^{(v)}\in\mathbb R^{D\times D_v}$.<br>3. Usually set $D_q=D_k$ so $QK^\top$ is valid.<br>4. Output shape is $N\times D_v$.<br>Reference: $QK^\top\in\mathbb R^{N\times N}$, $V\in\mathbb R^{N\times D_v}$, so $Y\in\mathbb R^{N\times D_v}$.

</details>

<details>
<summary><strong>Q38.</strong> Biases in attention projections — how do you keep matrix notation?</summary>

1. Add a constant column to the data matrix $X$.<br>2. Add a corresponding row to each projection weight matrix.<br>3. Perform the same matrix multiplication as before.<br>Reference: bias parameters can be included by augmenting $X$ with a column and the weight matrices with a row.

</details>

<details>
<summary><strong>Q39.</strong> Scaled dot-product attention — when and how do you scale?</summary>

Use it before softmax when dot-product magnitudes may be large.<br>1. Compute scores $QK^\top$.<br>2. Divide scores by $\sqrt{D_k}$.<br>3. Apply row-wise softmax.<br>4. Multiply by $V$.<br>Reference: $\operatorname{Attention}(Q,K,V)=\operatorname{softmax}(QK^\top/\sqrt{D_k})V$.

</details>

<details>
<summary><strong>Q40.</strong> Why divide by $\sqrt{D_k}$ in scaled attention?</summary>

1. Assume query/key components are independent with zero mean and unit variance.<br>2. The dot product sums $D_k$ terms, so its variance is $D_k$.<br>3. Divide by the standard deviation $\sqrt{D_k}$ to normalize magnitudes.<br>Reference: scaling helps prevent softmax gradients from becoming exponentially small for high-magnitude inputs.

</details>

<details>
<summary><strong>Q41.</strong> Attention head — how do you recognize one?</summary>

It is one complete attention computation with its own Q/K/V projections and output values.<br>Use one head to let outputs attend to one learned pattern of token relevance.<br>Reference: the sheet calls the attention layer described so far an attention head.

</details>

<details>
<summary><strong>Q42.</strong> Multi-head attention — step-by-step method</summary>

1. Create $H$ parallel attention heads with independent parameters.<br>2. For each head $h$, compute $H_h=\operatorname{Attention}(Q_h,K_h,V_h)$.<br>3. Concatenate the head outputs across feature dimensions.<br>4. Apply output projection $W^{(o)}$.<br>Reference: $Y(X)=\operatorname{Concat}(H_1,\dots,H_H)W^{(o)}$.

</details>

<details>
<summary><strong>Q43.</strong> Multi-head vs single-head attention — discriminator: how many relevance patterns can be learned in parallel?</summary>

Single head: one attention pattern family.<br>Multi-head: several identically structured heads with independent parameters, allowing multiple data-dependent patterns.<br>Reference: the sheet compares multiple attention heads to multiple filters in CNNs.

</details>

<details>
<summary><strong>Q44.</strong> Residual connection + layer normalization — post-norm procedure</summary>

1. Apply a sublayer $Y(X)$ to input $X$.<br>2. Add the residual input: $Y(X)+X$.<br>3. Apply layer normalization after the addition.<br>Reference: post-norm attention block $Z=\operatorname{LayerNorm}(Y(X)+X)$.

</details>

<details>
<summary><strong>Q45.</strong> Pre-norm vs post-norm — discriminator: is normalization before or after the sublayer?</summary>

Post-norm: sublayer first, add residual, then normalize.<br>Pre-norm: normalize the input first, apply the sublayer, then add the residual.<br>Reference: pre-norm attention uses $X'=\operatorname{LayerNorm}(X)$, then $Z=Y(X')+X$; the sheet says pre-norm can be more effective.

</details>

<details>
<summary><strong>Q46.</strong> Transformer feedforward sublayer — why is it needed and how is it applied?</summary>

1. Attention forms weighted combinations of value vectors.<br>2. Add a shared nonlinear network to increase expressive power beyond the span of the inputs.<br>3. Apply the same feedforward/MLP network independently to each token vector.<br>Reference: the feedforward layer is a standard nonlinear network $FF[\cdot]$ with $D$ inputs and $D$ outputs.

</details>

<details>
<summary><strong>Q47.</strong> Feedforward sublayer with residual/norm — what are the post-norm and pre-norm forms?</summary>

Post-norm:<br>1. Apply $FF[Z]$.<br>2. Add residual $+Z$.<br>3. Layer-normalize.<br>Pre-norm:<br>1. Set $Z'=\operatorname{LayerNorm}(Z)$.<br>2. Apply $FF[Z']$.<br>3. Add residual $+Z$.<br>Reference: post-norm $\tilde X=\operatorname{LayerNorm}(FF[Z]+Z)$; pre-norm $\tilde X=FF[Z']+Z$.

</details>

<details>
<summary><strong>Q48.</strong> Permutation equivariance — discriminator: what happens if the input token rows are permuted?</summary>

If the model is permutation equivariant, the output rows are permuted in exactly the same way.<br>Use this test: reorder rows of $X$; if outputs only reorder rather than change by position, the transform is equivariant.<br>Reference: shared transformer attention weights across positions make attention without positional information equivariant to input permutations.

</details>

<details>
<summary><strong>Q49.</strong> Equivariant vs non-equivariant attention — discriminator: are positions part of the input?</summary>

Without positional information, permuting token rows in $X$ just permutes output rows in the same way: equivariant.<br>With position vectors tied to positions, moving a token to a different position changes its token+position representation, so the model can distinguish order: non-equivariant with respect to token reordering alone.<br>Reference: the sheet’s intended outcome contrasts attention transforming sequences equivariantly and non-equivariantly; positional encoding provides order information.

</details>

<details>
<summary><strong>Q50.</strong> How do positional encodings make attention usable for sequences?</summary>

1. Assign each position $n$ a position vector $r_n$.<br>2. Combine token and position information before attention.<br>3. The sheet uses addition: $\tilde x_n=x_n+r_n$.<br>Discriminator: does the model know where each token occurs?<br>Reference: positional encoding is needed because token order matters and pure self-attention is permutation equivariant.

</details>

<details>
<summary><strong>Q51.</strong> Add vs concatenate positional information — discriminator: does feature dimension increase?</summary>

Concatenate: combine $[x_n;r_n]$, increasing dimensionality.<br>Add: compute $\tilde x_n=x_n+r_n$, preserving dimensionality.<br>Reference: the sheet considers both options and uses addition.

</details>

<details>
<summary><strong>Q52.</strong> Sinusoidal positional encoding — how do you compute the position vector?</summary>

1. For position $n$, create components indexed by $i$.<br>2. Use sine for even-indexed components.<br>3. Use cosine for odd-indexed components.<br>4. Use different wavelengths across dimensions controlled by a constant scale $L$.<br>Reference: the sheet gives a bounded sinusoidal encoding with terms of the form $\sin(n/L^{i/D})$ and $\cos(n/L^{(i-1)/D})$, noting the exact slide formatting is garbled.

</details>

<details>
<summary><strong>Q53.</strong> Sinusoidal encoding property — why is it useful for relative positions?</summary>

Use it when relative offsets matter.<br>The encoding at position $n+k$ can be represented as a linear combination of the encoding at $n$, with coefficients depending on $k$ rather than the absolute position.<br>Reference: the sheet describes sinusoidal positional encoding as a bounded relative-position method.

</details>

<details>
<summary><strong>Q54.</strong> Encoder block — what operations are repeated on the input side of a transformer?</summary>

1. Add positional encoding to input embeddings.<br>2. Apply multi-head attention.<br>3. Apply Add & Norm.<br>4. Apply feedforward layer.<br>5. Apply Add & Norm.<br>6. Repeat the block as required.<br>Reference: the encoder side contains repeated multi-head attention, Add & Norm, feedforward, Add & Norm blocks.

</details>

<details>
<summary><strong>Q55.</strong> Decoder block — what extra attention operation appears compared with the encoder?</summary>

1. Add positional encoding to shifted output embeddings.<br>2. Apply masked multi-head self-attention.<br>3. Apply Add & Norm.<br>4. Apply encoder-conditioned multi-head attention when in encoder-decoder models.<br>5. Apply Add & Norm, feedforward, Add & Norm.<br>Reference: the decoder side contains masked multi-head attention, multi-head attention, feedforward, and Add & Norm stages.

</details>

<details>
<summary><strong>Q56.</strong> Encoder vs decoder vs encoder-decoder — discriminator: represent, generate, or condition generation on an input?</summary>

Encoder: processes an input sequence into representations.<br>Decoder: generates an output sequence token by token.<br>Encoder-decoder: encodes a source sequence, then decodes a target sequence conditioned on the encoded source.<br>Reference: the sheet distinguishes encoder transformers, decoder transformers, and sequence-to-sequence encoder-decoder transformers.

</details>

<details>
<summary><strong>Q57.</strong> BERT — how do you recognize the model type and training workflow?</summary>

Recognize BERT as an encoder-transformer approach.<br>1. Pre-train on a large unlabelled text corpus.<br>2. Fine-tune using supervised transfer learning.<br>3. Use smaller task-specific labelled datasets for downstream tasks.<br>Reference: BERT stands for Bidirectional Encoder Representations from Transformers.

</details>

<details>
<summary><strong>Q58.</strong> BERT pre-training diagram — which objectives are shown?</summary>

Read the diagram as two stages:<br>1. Pre-training uses self-supervised objectives on unlabelled sentence-pair input.<br>2. The shown pre-training heads include Mask LM and NSP.<br>3. Fine-tuning replaces/adapts heads for supervised downstream tasks.<br>Reference: the sheet’s BERT diagram labels NSP and Mask LM during pre-training, then downstream tasks during fine-tuning.

</details>

<details>
<summary><strong>Q59.</strong> BERT masked-token training — step-by-step method</summary>

1. Randomly select a subset of input tokens.<br>2. Corrupt selected positions according to the masking rule.<br>3. Feed the corrupted sequence into the encoder.<br>4. Predict the original tokens at the selected output positions.<br>5. Train without human labels because the targets come from the original text.<br>Reference: BERT masked-token prediction is self-supervised learning.

</details>

<details>
<summary><strong>Q60.</strong> BERT masking rule — what happens to selected tokens?</summary>

1. Select 15% of tokens.<br>2. Of selected tokens, replace 80% with $\langle\text{mask}\rangle$.<br>3. Replace 10% with a random vocabulary token.<br>4. Leave 10% unchanged.<br>5. Predict all selected original tokens at the output.<br>Reference: this is the practical BERT 15% masking rule described in the sheet.

</details>

<details>
<summary><strong>Q61.</strong> Bidirectional in BERT — discriminator: can the model see both sides of the masked position?</summary>

Yes: for a masked token, BERT can use tokens before and after that position.<br>Use the term bidirectional when prediction uses both left and right context.<br>Reference: bidirectional means the network sees words both before and after the masked word.

</details>

<details>
<summary><strong>Q62.</strong> BERT input representation — how do you build each input vector?</summary>

For each position:<br>1. Add the token embedding.<br>2. Add the segment embedding, e.g. segment A vs segment B for a pair input.<br>3. Add the position embedding.<br>4. Use [CLS] as a class-level token when needed and [SEP] to mark sequence boundaries.<br>Reference: BERT input representation is the sum of token, segment, and position embeddings.

</details>

<details>
<summary><strong>Q63.</strong> BERT downstream task format — discriminator: class label, span, or token labels?</summary>

Sentence-pair or single-sentence classification: use the special class-level output.<br>Question answering: predict start and end span positions over the passage.<br>Sequence tagging: predict a label for each token output.<br>Reference: the sheet lists BERT fine-tuning formats for classification, question answering, and tagging.

</details>

<details>
<summary><strong>Q64.</strong> Vision Transformer — how do you turn an image into transformer input?</summary>

1. Slice the image into patches.<br>2. Flatten/project each patch into an embedding token.<br>3. Add a learnable class token if class prediction is needed.<br>4. Add positional embeddings.<br>5. Feed tokens into a transformer encoder.<br>6. Use an MLP head for the final class output.<br>Reference: a Vision Transformer treats image patches as tokens for an encoder transformer.

</details>

<details>
<summary><strong>Q65.</strong> Decoder transformer — how do you recognize its modelling purpose?</summary>

Use it for generative models that create output token sequences.<br>It predicts the next token from the tokens already generated and repeats this process.<br>Reference: the sheet defines a decoder as being used for generative models that create output sequences of tokens.

</details>

<details>
<summary><strong>Q66.</strong> Autoregressive generation — step-by-step method</summary>

1. Start with context $x_1,\dots,x_{n-1}$.<br>2. Estimate $p(x_n\mid x_1,\dots,x_{n-1})$.<br>3. Choose or sample $x_n$ from that distribution.<br>4. Append $x_n$ to the context.<br>5. Repeat for $x_{n+1}$ and beyond.<br>Reference: an autoregressive model generates a sequence one token at a time.

</details>

<details>
<summary><strong>Q67.</strong> GPT training alignment — how do you shift inputs and targets?</summary>

1. Prepend a start token to the input sequence.<br>2. Shift the input sequence right by one position.<br>3. At position $n$, use the shifted input to predict the next original token.<br>4. Train output $y_n$ against target $x_{n+1}$ under the sheet’s notation.<br>Reference: GPT is a decoder-transformer architecture using right-shifted inputs for next-token prediction.

</details>

<details>
<summary><strong>Q68.</strong> Causal attention — how do you prevent future-token leakage?</summary>

1. Compute the attention score matrix.<br>2. Identify scores from a position to later positions.<br>3. Set those pre-softmax scores to $-\infty$.<br>4. Apply softmax, making those attention weights zero.<br>Discriminator: is the attended token later than the current prediction position?<br>Reference: causal attention zeros all attention weights to later tokens by setting corresponding pre-activations to $-\infty$.

</details>

<details>
<summary><strong>Q69.</strong> Causal vs full attention — discriminator: can a token attend to future positions?</summary>

Causal attention: no; each position attends only to earlier/current positions.<br>Full attention: yes; positions can attend across the whole sequence.<br>Reference: the sheet contrasts causal attention with full attention in decoder modelling.

</details>

<details>
<summary><strong>Q70.</strong> GPT architecture pipeline — what is the high-level flow?</summary>

1. Input tokens.<br>2. Input embeddings plus positional encoding.<br>3. Stacked transformer blocks with masked multi-head attention and feedforward parts.<br>4. Final layer normalization.<br>5. Linear layer.<br>6. Softmax for output token probabilities.<br>Reference: the sheet’s GPT diagram shows Input → Embedding/Position → Transformer blocks → LayerNorm → Linear → Softmax → Output.

</details>

<details>
<summary><strong>Q71.</strong> GPT transformer block diagram — what sublayers should you recognize?</summary>

1. Masked multi-head attention with a causal mask before softmax.<br>2. Dropout and linear projection around attention outputs.<br>3. Residual connections and layer normalization.<br>4. Feedforward stack: Linear → GELU → Linear, with dropout.<br>Reference: the sheet’s GPT architecture diagram shows masked attention heads, mask, softmax, dropout, linear projections, residuals, LayerNorm, and a GELU feedforward part.

</details>

<details>
<summary><strong>Q72.</strong> Greedy search — how do you generate tokens?</summary>

1. At the current step, compute the next-token distribution.<br>2. Choose the single token with highest probability.<br>3. Append it to the sequence.<br>4. Repeat from the new context.<br>Discriminator: which candidate has the highest immediate probability?<br>Reference: greedy search selects the highest-probability token at each step.

</details>

<details>
<summary><strong>Q73.</strong> Beam search — how do you generate with $B$ hypotheses?</summary>

1. Keep a set of $B$ partial sequences.<br>2. Extend each hypothesis with possible next tokens.<br>3. Score extended sequences by total sequence probability, usually via summed log-probabilities.<br>4. Keep the best $B$ extended hypotheses.<br>5. Repeat until stopping.<br>Reference: beam search maintains $B$ hypotheses, where $B$ is the beam width.

</details>

<details>
<summary><strong>Q74.</strong> Greedy vs beam search — discriminator: local best token or best retained sequence hypotheses?</summary>

Greedy commits to the highest-probability next token immediately.<br>Beam keeps multiple continuations and compares extended sequence probabilities before pruning.<br>Reference: beam search can avoid a locally best first choice that leads to a worse extended sequence.

</details>

<details>
<summary><strong>Q75.</strong> Seq2seq transformer — how do you map an input sequence to an output sequence?</summary>

1. Encode the source token sequence into an internal representation $Z$.<br>2. Feed shifted target-side tokens into the decoder.<br>3. Generate target tokens autoregressively.<br>4. Condition each generated token on both previous target tokens and the encoded source $Z$.<br>Reference: sequence-to-sequence transformers use an encoder plus decoder for tasks such as source-to-target sequence mapping.

</details>

<details>
<summary><strong>Q76.</strong> Cross-attention — discriminator: where do Q, K, and V come from?</summary>

Queries come from the decoder sequence being generated.<br>Keys and values come from the encoder representation $Z$.<br>Use it when the decoder must condition on an encoded input sequence.<br>Reference: in cross-attention, $Q\leftarrow$ decoder and $K,V\leftarrow Z$.

</details>

<details>
<summary><strong>Q77.</strong> Self-attention vs cross-attention — discriminator: one sequence or two sources?</summary>

Self-attention: Q, K, and V all come from the same sequence.<br>Cross-attention: Q comes from the decoder/current sequence, while K and V come from the encoder/source representation.<br>Reference: the sheet defines self-attention inside a sequence and cross-attention as combining encoder and decoder.

</details>

<details>
<summary><strong>Q78.</strong> Full encoder-decoder transformer recap — what happens after decoder blocks?</summary>

1. Encoder builds source representations from input embeddings plus positions.<br>2. Decoder uses masked self-attention, cross-attention, and feedforward layers.<br>3. Decoder outputs pass through a linear layer.<br>4. Softmax converts logits into output-token probabilities.<br>Reference: final transformer output uses Linear → Softmax → output probabilities.

</details>

<details>
<summary><strong>Q79.</strong> Attention instead of recurrence — discriminator: what replaces sequential hidden-state updates?</summary>

RNNs pass information through $h_{n-1}\rightarrow h_n$.<br>Transformers let tokens directly form weighted combinations of other tokens through attention.<br>Use attention when the model should compare tokens in parallel rather than propagate memory step by step.<br>Reference: the sheet motivates transformers as replacing recurrence with attention, positional information, and encoder/decoder architectures.

</details>
